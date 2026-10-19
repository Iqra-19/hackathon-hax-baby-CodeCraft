# AI Engineering Playbook

The authoritative source for how this engineering organization builds features with Claude Code. Contains the process, the standards, the templates, and the agent definitions — not application code.

---

## Pilot project requirements

Every pilot project must have these four things committed to the repo before any feature work begins:

| Required | What it does |
|---|---|
| `CLAUDE.md` at the project root | Tells Claude your stack, conventions, and security rules — read at the start of every session |
| `.claude/agents/` (all 5 agents) | Phase-owner agents: PM, Architect, Planner, Developer, Reviewer |
| `.claude/skills/` (2 skills) | `spec-check` and `phase-gate` — quality gates before any PR |
| `specs/README.md` | Explains the specs/ folder to any engineer who opens the project |

These are not optional. A project without `CLAUDE.md` gives Claude no project context — it behaves like a generic assistant, not a project-aware one. A project without `.claude/agents/` cannot run the spec-driven phases.

**Verify your project is compliant:**

```bash
ls CLAUDE.md .claude/agents/ .claude/skills/ specs/README.md
```

If any of those paths are missing, follow [Setting up a pilot project](#setting-up-a-pilot-project) below.

---

## Quick start

Everything you need to go from zero to a running feature workflow in under 10 minutes.

### Step 1 — Clone the playbook

```bash
git clone https://github.com/Tntra/ai-engineering-playbook ~/ai-engineering-playbook
```

### Step 2 — Copy the Claude config into your project

This is the step most people miss. The playbook ships five phase-owner agents and two skills that Claude Code needs to find inside your project. Copy them in once, commit them, and every engineer on the project gets them automatically.

```bash
cd your-project

# Create the .claude directories
mkdir -p .claude/agents .claude/skills

# Copy the phase-owner agents (PM, Architect, Planner, Developer, Reviewer)
cp ~/ai-engineering-playbook/.claude/agents/* .claude/agents/

# Copy the project skills (spec-check, phase-gate)
cp ~/ai-engineering-playbook/.claude/skills/* .claude/skills/
```

**What these do:**

| File | What Claude Code uses it for |
|---|---|
| `.claude/agents/product-manager.md` | Writes `spec.md` with FR-NNN acceptance criteria |
| `.claude/agents/architect.md` | Writes `plan.md` with ADRs and constitution check |
| `.claude/agents/planner.md` | Writes `tasks.md` with task IDs and dependency tree |
| `.claude/agents/developer.md` | Implements tasks, enforces pre-PR review gates |
| `.claude/agents/reviewer.md` | Read-only quality gate before any PR opens |
| `.claude/skills/spec-check.md` | `/spec-check` — checks code against FR-NNN criteria |
| `.claude/skills/phase-gate.md` | `/phase-gate` — verifies exit criteria before next phase |

### Step 3 — Create a project `CLAUDE.md`

This file tells Claude Code about your specific tech stack and project conventions. It is read automatically at the start of every session — the agents use it to give stack-aware architecture advice and apply the right review lens.

Create `CLAUDE.md` at your project root (copy the block below and fill in the blanks):

```markdown
# CLAUDE.md

## Stack

Language: <language and version>
Framework: <framework>
Package manager: <npm / pip / cargo / etc.>
Build: `<build command>`
Test: `<test command>`
Lint: `<lint command>`
DB migrations: `<migration command, if any>`

## Project conventions

- <e.g. API errors must use { error: string } shape>
- <e.g. no business logic in route handlers — service layer owns it>
- <add your own>

## Security notes

- <e.g. all SQL via ORM, no string interpolation>

## Performance notes

- <e.g. async endpoints for all I/O>

## Org process

Follow the spec-driven workflow: https://github.com/Tntra/ai-engineering-playbook
Agents and skills are in .claude/ — committed to this repo.
```

Keep it to one screenful. The agents pick up the rest from the playbook's global rules.

### Step 4 — Start a feature

When you're ready to write a spec, open Claude Code in your project. The Product Manager agent creates the `specs/<feature-slug>/` folder and copies all four phase templates automatically — no manual setup needed.

### Step 5 — Phase 1: Write the spec

Open Claude Code in your project and use one of these two prompts:

```
# From a description — agent asks clarifying questions, then writes the spec
Use the Product Manager agent to write the spec for [feature name].
Context: [2–3 sentences on what this needs to do at the system level].

# From a Jira ticket — agent fetches the ticket, fills gaps, then writes the spec
Use the Product Manager agent to write the spec for PROJECT-123.
```

The agent creates `specs/<feature-slug>/` automatically, scaffolds the phase templates, and produces `spec.md` with `FR-NNN` acceptance criteria in Given-When-Then format. Review it with a peer. When approved, set `status: approved` in the frontmatter.

> **Jira path:** Requires the Atlassian Rovo MCP to be connected in Claude Code. Replace `PROJECT-123` with your actual ticket key.

> **Rule:** No phase starts until the previous file has `status: approved`.

### Step 6 — Phase 2: Write the plan

Switch to Opus (required for architecture work), then prompt:

```
/model opus

Use the Architect agent to write the plan for this feature.
The spec is approved at specs/my-feature-name/spec.md.
```

The agent produces `specs/my-feature-name/plan.md` with architecture overview, ADRs for every non-trivial decision, and a Constitution check. Get senior-engineer or architecture-review sign-off, then set `status: approved`.

### Step 7 — Phase 3: Break into tasks

```
Use the Planner agent to break the approved plan into tasks.md.
```

The agent produces `specs/my-feature-name/tasks.md` — an atomic checklist with task IDs (`T001`, `T002`), parallelization markers (`[P]`), verify steps, and a dependency tree. A quick senior-engineer skim is enough to proceed.

### Step 8 — Phase 4: Implement

Work through the task list top to bottom:

```
Use the Developer agent to implement T001 from specs/my-feature-name/tasks.md.
```

Repeat for each task. Log any deviation from the plan in `notes.md` (append-only).

Before opening any PR, run the quality gates in order:

```
/spec-check      ← verifies each FR-NNN criterion against the actual code
/phase-gate      ← confirms all exit criteria are met before merge
```

Then run the review skills explicitly:

```
/code-review
/security-review   ← required, must be run explicitly
/performance-review
```

---

## Start here

If you are new to this repo, read in this order:

1. **[docs/ADOPTION-GUIDE.md](docs/ADOPTION-GUIDE.md)** — The full picture: how the three layers work, installation steps, agents, skills, tech stack adaptation, and future scope. Start here if you're setting up the system or explaining it to your team.
2. **[docs/GUIDELINES.md](docs/GUIDELINES.md)** — How to use the 4-phase process day-to-day: when to use it, how to write specs and tasks, FAQ.
3. **[examples/engineering-arcade-leaderboard/](examples/engineering-arcade-leaderboard/)** — A complete worked example. Read `spec.md` → `plan.md` → `tasks.md` to see what a finished feature lifecycle looks like.
4. **[docs/CLAUDE-CODE-STANDARDS.md](docs/CLAUDE-CODE-STANDARDS.md)** — Deep reference for Claude Code configuration: model selection, MCP servers, skills, sub-agents, plugins, memory.

---

## What this process is

Every non-trivial feature goes through four phases, in order. Each phase produces a file. No phase starts until the previous one is approved.

```
Phase 1: spec.md    → what the system must do (FR-NNN acceptance criteria)
Phase 2: plan.md    → how it will be built (architecture, ADRs, constitution check)
Phase 3: tasks.md   → atomic implementation checklist with verify steps
Phase 4: implement  → code, checked against the spec before any PR opens
```

Small bugfixes, config changes, and one-PR tasks skip directly to implementation. The process is for anything that would normally need a design discussion.

---

## Repo structure

```
ai-workflows/
├── README.md                          ← you are here
├── CLAUDE.md                          ← AI agent behavioral rules (read by Claude Code)
│
├── docs/                              ← process documentation
│   ├── ADOPTION-GUIDE.md              ← full setup and installation guide
│   ├── GUIDELINES.md                  ← how to use the process day-to-day
│   ├── spec-driven-development.md     ← full rationale and phase definitions
│   └── CLAUDE-CODE-STANDARDS.md       ← Claude Code configuration standard
│
├── templates/                         ← copy these when starting a project or feature
│   ├── project-claude.md              ← project CLAUDE.md starter (copy to your project root)
│   ├── specs-readme.md                ← specs/ folder README (copy to your project's specs/)
│   ├── research.md                    ← Phase 0 template (optional — for technical spikes)
│   ├── spec.md                        ← copy to specs/<slug>/
│   ├── plan.md
│   ├── tasks.md
│   └── notes.md
│
├── examples/                          ← worked example for reference
│   └── engineering-arcade-leaderboard/
│       ├── spec.md   (approved)
│       ├── plan.md   (approved)
│       └── tasks.md  (in-progress)
│
├── specs/                             ← live active features
│   └── <feature-slug>/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── notes.md
│
└── .claude/                           ← Claude Code tooling
    ├── agents/                        ← phase-owner sub-agent definitions
    │   ├── product-manager.md         ← Phase 1 (spec)
    │   ├── architect.md               ← Phase 2 (plan)
    │   ├── planner.md                 ← Phase 3 (tasks)
    │   ├── developer.md               ← Phase 4 (implement)
    │   └── reviewer.md                ← pre-PR quality gate
    └── skills/
        ├── spec-check.md              ← /spec-check: verify code against FR-NNN criteria
        └── phase-gate.md              ← /phase-gate: check exit criteria before next phase
```

---

## Setting up a pilot project

One-time setup per project. Run all commands from your **project root**.

### Step 1 — Copy the phase-owner agents and skills

```bash
mkdir -p .claude/agents .claude/skills

# Copy the five phase-owner agents
cp ~/ai-engineering-playbook/.claude/agents/* .claude/agents/

# Copy the two project skills
cp ~/ai-engineering-playbook/.claude/skills/* .claude/skills/
```

Safe to re-run — existing files are not overwritten.

### Step 2 — Create the project CLAUDE.md

```bash
# Only runs if CLAUDE.md does not already exist
[ -f CLAUDE.md ] || cp ~/ai-engineering-playbook/templates/project-claude.md CLAUDE.md
```

Open `CLAUDE.md` and fill in:
- Language, framework, and package manager
- Build, test, lint, and migration commands
- Project conventions (e.g. error shape, layer rules)
- Security and performance notes for your stack

Keep it to one screenful. The org operating principles come from `~/.claude/CLAUDE.md` — do not repeat them here.

### Step 3 — Scaffold the specs/ folder

```bash
mkdir -p specs

# Only runs if specs/README.md does not already exist
[ -f specs/README.md ] || cp ~/ai-engineering-playbook/templates/specs-readme.md specs/README.md
```

### Step 4 — Commit everything

```bash
git add CLAUDE.md .claude/ specs/README.md
git commit -m "chore: add AI workflow config (CLAUDE.md, agents, skills, specs/)"
```

### Step 5 — Verify

```bash
ls -la CLAUDE.md .claude/agents/ .claude/skills/ specs/README.md
```

All four paths must exist before you start any feature work.

**Per feature** — open Claude Code and use one of these prompts. The agent creates the folder and scaffolds the templates automatically:

```
# From a description
Use the Product Manager agent to write the spec for [feature name].
Context: [2–3 sentences on what this needs to do at the system level].

# From a Jira ticket
Use the Product Manager agent to write the spec for PROJECT-123.
```

---

## Checking status across all features

```bash
# Phase status of all active features
grep -r "^status:" specs/*/spec.md specs/*/plan.md specs/*/tasks.md

# Features blocked waiting for plan approval
grep -r "^status: in-review" specs/*/plan.md

# Features still in draft spec
grep -r "^status: draft" specs/*/spec.md
```

---

## Claude Code setup (one-time, per machine)

Install the required plugins before your first session:

```bash
/plugin install skill-creator@claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@claude-mem
npx get-shit-done-cc
/reload-plugins
```

See [docs/CLAUDE-CODE-STANDARDS.md](docs/CLAUDE-CODE-STANDARDS.md) for the full setup guide, model selection rules, and MCP server configuration.
