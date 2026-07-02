# AI Workflows

The authoritative source for how this engineering organization builds features with Claude Code. Contains the process, the standards, the templates, and the agent definitions — not application code.

---

## Start here

If you are new to this repo, read in this order:

1. **[docs/GUIDELINES.md](docs/GUIDELINES.md)** — 15-minute read. Explains the 4-phase process, when to use it, and how to write specs and tasks correctly. Includes the FAQ.
2. **[examples/engineering-arcade-leaderboard/](examples/engineering-arcade-leaderboard/)** — A complete worked example. Read `spec.md` → `plan.md` → `tasks.md` in that folder to see what a finished feature lifecycle looks like before starting your own.
3. **[docs/CLAUDE-CODE-STANDARDS.md](docs/CLAUDE-CODE-STANDARDS.md)** — How to configure Claude Code: which model to use when, MCP servers, skills, sub-agents, plugins, and memory. Read this before your first Claude Code session on a real feature.

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
│   ├── GUIDELINES.md                  ← how to use the process (start here)
│   ├── spec-driven-development.md     ← full rationale and phase definitions
│   └── CLAUDE-CODE-STANDARDS.md       ← Claude Code configuration standard
│
├── templates/                         ← copy these when starting a feature
│   ├── spec.md
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

## Starting a new feature

```bash
# 1. Create the feature folder
mkdir -p specs/<feature-slug>

# 2. Copy the templates
cp templates/spec.md templates/plan.md templates/tasks.md templates/notes.md specs/<feature-slug>/

# 3. Open Claude Code and start Phase 1
#    Use the Product Manager sub-agent or write spec.md yourself
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
