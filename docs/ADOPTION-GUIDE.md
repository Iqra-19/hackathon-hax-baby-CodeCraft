# AI Workflows — Org Adoption Guide

> How to deploy this system across every engineering team, every project, every tech stack.

---

## What this system is

A structured approach to AI-assisted feature development. It turns Claude Code from a conversational assistant into a consistent, org-wide engineering workflow — same process, same quality gates, same behavior across every engineer and every project.

Three properties define it:

- **Process-first.** Specs are written before code. Plans are approved before tasks. Nothing skips.
- **Human-gated.** Every phase transition requires a human approval. Claude executes phases; engineers own decisions.
- **Layered configuration.** Org rules live globally. Project context lives per-repo. Feature work lives per-feature. Nothing duplicated.

---

## How configuration layers work

Claude Code reads configuration in a cascade — each layer adds to the previous, never replaces it.

```
~/.claude/                     ← GLOBAL LAYER
├── CLAUDE.md                  ← org operating principles, read in every session
├── agents/                    ← phase-owner agents, available in every project
└── skills/                    ← review skills, available in every project
         │
         │  cascades into
         ▼
project-root/                  ← PROJECT LAYER
├── CLAUDE.md                  ← tech stack + project conventions (thin)
├── specs/                     ← live feature work
└── .claude/                   ← project-specific overrides (optional)
         │
         │  cascades into
         ▼
specs/<feature-slug>/          ← FEATURE LAYER
├── spec.md
├── plan.md
├── tasks.md
└── notes.md
```

**Why this matters for a multi-project org:** The operating principles, agents, and review skills are installed once globally and apply everywhere automatically. Each project only needs to add what is unique to it — the tech stack, build commands, and project conventions. No copying process docs into every repo.

---

## Layer 1 — Global (`~/.claude/`)

Install once per developer machine. Applies to every Claude Code session on that machine, across all projects.

### `~/.claude/CLAUDE.md` — Org operating principles

Contains the six behavioral rules that govern how Claude Code operates across the entire org:

1. Think before coding — state assumptions, ask on ambiguity
2. Simplicity first — minimum code for the stated problem
3. Surgical changes — touch only what the task requires
4. Goal-driven execution — verifiable success criteria per task
5. Ask before acting — clarify before producing output
6. Thinking partner — reason and synthesize, not just retrieve

### `~/.claude/agents/` — Phase-owner agents

Five agents map directly to the spec-driven phases:

| Agent file | Phase | Tool access |
|---|---|---|
| `product-manager.md` | Phase 1 — Spec | Read any file, write spec.md only |
| `architect.md` | Phase 2 — Plan | Read any file (including code, read-only), write plan.md only |
| `planner.md` | Phase 3 — Tasks | Read any file, write tasks.md only |
| `developer.md` | Phase 4 — Implement | Full read/write on implementation code |
| `reviewer.md` | Pre-PR gate | Read-only, produces structured report |

Each agent enforces its own boundaries. The Architect agent refuses to write implementation code. The Developer agent refuses to open a PR without running the review skills. These are behavioral constraints in the agent definition, not conventions.

### `~/.claude/skills/` — Review skills

Four review skills must be present globally (you provide the content; see `docs/CLAUDE-CODE-STANDARDS.md` Section 3 for the required structure):

| Skill file | Invoke with | What it checks |
|---|---|---|
| `code-review.md` | explicit | Readability, architecture, error handling, test coverage |
| `security-review.md` | explicit | OWASP top 10, auth enforcement, secrets, input validation |
| `performance-review.md` | explicit | N+1 queries, async patterns, unbounded loops, indexing |
| `refactoring-best-practices.md` | explicit | Structural improvements without behavior change |

Security review **must** be invoked explicitly — automatic triggering is not sufficient for a high-stakes review.

### Plugins — one-time install

Run these once per developer machine (inside Claude Code):

```bash
# Official Anthropic plugins
/plugin install skill-creator@claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official

# Community plugins
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@claude-mem

# npm-based
npx get-shit-done-cc

/reload-plugins
```

See `docs/CLAUDE-CODE-STANDARDS.md` Section 8 for what each plugin does.

---

## Layer 2 — Project (`project-root/`)

Lives in each individual repo. Checked into version control. Contains only what is unique to that project.

### Project `CLAUDE.md` — keep it thin

Each project's `CLAUDE.md` should be short — one screenful. It adds project-specific context on top of the global layer. It does NOT duplicate the operating principles or process docs (those come from the global layer).

**Structure:**

```markdown
# CLAUDE.md

## Stack

Language: <language and version>
Framework: <framework>
Package manager: <pm>
Build: `<build command>`
Test: `<test command>`
Lint: `<lint command>`
DB migrations: `<migration command>`

## Project conventions

- <Convention 1 — e.g. API errors must use { error: string } shape>
- <Convention 2 — e.g. no business logic in route handlers>
- <Convention 3>

## Security notes for this stack

- <Stack-specific security rule — e.g. all SQL via ORM, no string interpolation>

## Performance notes for this stack

- <Stack-specific perf rule — e.g. async endpoints for all I/O>

## Org process

Follow the spec-driven workflow: https://github.com/Tntra/ai-engineering-playbook
Templates: clone ai-engineering-playbook and copy from templates/
```

This is what makes the global agents and review skills **stack-aware**. The Developer agent reads the project `CLAUDE.md` before writing a single line of code. The Reviewer agent reads it to know what "bad" looks like for this specific stack.

### `specs/` — feature work

```
specs/
└── <feature-slug>/
    ├── spec.md       ← status: draft → in-review → approved
    ├── plan.md       ← status: draft → in-review → approved
    ├── tasks.md      ← status: draft → in-progress → done
    └── notes.md      ← append-only decision log
```

Each feature gets its own folder. Files are filled in phase order. No phase starts until the previous file has `status: approved` in its frontmatter.

### `.claude/` — project-specific overrides (optional)

Only add project-level skills or agents when the project needs something that shouldn't be global. For example:

- A data science project might add `.claude/agents/data-scientist.md` with notebook and model-specific tooling
- A security-critical project might add `.claude/skills/threat-model.md` for a project-specific threat modeling workflow

The two skills in this repo's `.claude/skills/` are good examples of project-level skills:
- `spec-check.md` — checks implementation against approved FR-NNN criteria
- `phase-gate.md` — verifies phase exit criteria before moving to the next phase

---

## Layer 3 — Feature (`specs/<slug>/`)

One folder per feature. Created from templates. Ephemeral — the feature folder represents work in progress, not a permanent artifact.

### The four files

| File | Purpose | Append-only? |
|---|---|---|
| `spec.md` | What the system must do — FR-NNN acceptance criteria | No — edited until approved |
| `plan.md` | How it will be built — architecture, ADRs, constitution check | No — edited until approved |
| `tasks.md` | Atomic implementation checklist — T001, [P] markers, Verify lines | No — tasks checked off as done |
| `notes.md` | Deviations from plan, decisions not in ADRs | **Yes — append only** |

### Status gates

Every `spec.md` and `plan.md` has a `status:` field in its frontmatter. The gate is simple:

```
draft → in-review → approved
```

No phase starts without `status: approved` on the previous phase file. This is enforced behaviorally by the phase-owner agents (e.g. the Architect agent reads the spec status before writing anything).

### `notes.md` — the decision log

Every deviation from the approved plan gets logged here with a date:

```markdown
## 2026-07-02

- Deviated from ADR-2: used HMAC instead of RS256 because the JWKS endpoint
  was not available in the staging environment. Will revisit for production.
```

Never edit previous entries. Only append. This is what makes specs "living documents" — the notes trail shows why the code diverged from the plan, without rewriting history.

---

## The 4-phase process

For any feature that would normally need a design discussion. Skip for bugfixes, config tweaks, and one-PR changes.

### Phase 1 — Spec (`spec.md`)

**Owner:** Product Manager agent (or engineer)
**Approver:** Senior engineer / tech lead
**Model:** Sonnet

Write what the system must do, not how. Required sections:
- **Context** — 2–3 sentences on why this needs to exist at the system level
- **Technical requirements** — high-level functional requirements, written technically
- **Acceptance criteria** — FR-NNN numbered, Given-When-Then format (see below)
- **Out of scope** — adjacent work explicitly excluded
- **Open questions** — must be resolved before approval

**Acceptance criteria format:**
```
- [ ] **FR-001:** <short title>
      Given <precondition>
      When <action>
      Then <observable, testable outcome>
```

Each FR must be independently testable. If two FRs are inseparable to test, merge them.

### Phase 2 — Plan (`plan.md`)

**Owner:** Architect agent (or engineer)
**Approver:** Architecture Review Board / senior engineer
**Model:** Opus (required — switch with `/model opus`)

Takes the approved spec and adds: architecture overview, tech stack choices with rationale, data model, API contracts, ADRs, risks, and a constitution check.

**ADR format (every non-trivial decision needs one):**
```
### ADR-N: <title>
- Problem:
- Options considered:
- Chosen solution:
- Reasoning:
```

**Constitution check** — must be fully ticked before tasks can begin:
```
- [ ] No new infrastructure dependency without an ADR
- [ ] All API errors follow { error: string } shape
- [ ] No business logic in route handlers
- [ ] All secrets via environment variables
```

### Phase 3 — Tasks (`tasks.md`)

**Owner:** Planner agent (or engineer)
**Approver:** Senior engineer (informal skim)
**Model:** Sonnet

Breaks the plan into atomic tasks. Each task closes in one PR.

```
- [ ] **T001:** <description>. Satisfies: FR-001.
      Verify: <concrete, observable check>

- [ ] **T002 [P]:** <description>  ← [P] = can run in parallel
      Verify: <check>
```

File ends with a dependency tree showing which tasks block others.

### Phase 4 — Implement

**Owner:** Developer agent (or engineer)
**Approver:** Peer review → standard PR approval
**Model:** Sonnet (Haiku for bulk/boilerplate)

Work through `tasks.md` top to bottom. Before any PR:
1. Run `/spec-check` — verify code satisfies FR-NNN criteria
2. Run code-review, security-review, performance-review skills explicitly
3. Log any deviation from the plan in `notes.md`

### Approval gates summary

| Phase | Approver | Hard gate? |
|---|---|---|
| Spec | Senior engineer / tech lead | Yes |
| Plan | Architecture review | Yes |
| Tasks | Senior engineer | Soft (skim) |
| PR | Peer review | Yes |

---

## Sub-agents reference

Agents live in `.claude/agents/` at either the global (`~/.claude/agents/`) or project level. Each agent has a system prompt that defines its persona, tool access, and behavioral constraints.

**How to invoke:** Claude Code routes to the appropriate agent based on context, or you can invoke explicitly: "Use the Architect agent to write the plan for this feature."

| Agent | Phase | What it does | Will refuse to |
|---|---|---|---|
| `product-manager` | 1 — Spec | Writes FR-NNN acceptance criteria, resolves open questions | Touch plan.md, tasks.md, or any code |
| `architect` | 2 — Plan | Architecture, ADRs, constitution check | Write implementation code; reads code but never edits it |
| `planner` | 3 — Tasks | Atomic task breakdown, [P] markers, dependency tree | Write implementation code |
| `developer` | 4 — Implement | Full implementation, works through tasks.md | Open a PR without running all review skills |
| `reviewer` | Pre-PR | Structured pass/fail report across spec, code, security, perf | Write or suggest code; reports findings only |

---

## Skills and plugins reference

### Project-level skills (`.claude/skills/`)

Invoked with a slash command or automatically based on context.

| Skill | Invoke | What it does |
|---|---|---|
| `spec-check` | `/spec-check` | Reads approved spec.md, checks each FR-NNN criterion against the actual code, reports pass/fail per criterion |
| `phase-gate` | `/phase-gate` | Reads the current phase file, checks all exit criteria, reports what's missing before the next phase can begin |

### Global skills (`~/.claude/skills/`)

| Skill | When | What it checks |
|---|---|---|
| `code-review` | Pre-PR (explicit) | Readability, architecture alignment, error handling, test coverage |
| `security-review` | Pre-PR (explicit, required) | Auth enforcement, input validation, secrets, OWASP top 10 |
| `performance-review` | Pre-PR (explicit) | N+1 queries, async patterns, indexing, unbounded operations |
| `refactoring-best-practices` | On refactor tasks | Structural improvements without behavior change |

### Plugins

| Plugin | Scope | What it does |
|---|---|---|
| `skill-creator` | Global | 4-mode tool: Create, Eval, Improve, Benchmark — use to build new skills against org standards |
| `superpowers` | Global | TDD + subagent plan → implement → verify loop |
| `frontend-design` | Global | Production-grade frontend UI generation with component libraries |
| `get-shit-done` | Global | Context engineering system; combats context rot in long sessions |
| `claude-mem` | Global | Cross-session memory via MCP — persists decisions across sessions |
| `context-mode` | Project | Reduces context window consumption for large codebases |

---

## Tech stack adaptation

### What is universal vs. what varies

| Universal (global layer) | Project-specific (project CLAUDE.md) |
|---|---|
| 6 operating principles | Language, runtime, framework |
| Spec format (FR-NNN, GWT) | Build and test commands |
| Plan format (ADRs, constitution check) | Package manager |
| Tasks format (T001, [P], Verify) | DB migration tooling |
| PM / Architect / Planner agents | Security patterns for this stack |
| Review skill structure | Performance patterns for this stack |

### The stack template model

Rather than copying agents and skills into every project, each project's `CLAUDE.md` injects stack-specific context that the global agents and skills automatically pick up.

The `ai-workflows` repo will provide **stack templates** — pre-written `CLAUDE.md` snippets for common stacks that engineers copy into their project. Engineers mix and match:

```bash
# For a Node.js + React project
cat ~/ai-engineering-playbook/templates/stacks/node-express.md >> CLAUDE.md
cat ~/ai-engineering-playbook/templates/stacks/react.md >> CLAUDE.md
```

### What a stack template looks like

`templates/stacks/python-fastapi.md`:
```markdown
## Stack

Language: Python 3.12
Framework: FastAPI
Package manager: uv
Test: `uv run pytest`
Lint: `uv run ruff check .`
Type check: `uv run mypy .`
DB migrations: `uv run alembic upgrade head`

## Security notes for this stack

- All SQL via SQLAlchemy ORM — no raw string interpolation
- Pydantic models at all API boundaries — no raw dict access on request body
- FastAPI dependency injection for auth — not middleware monkey-patching

## Performance notes for this stack

- Async endpoints for all I/O — never use `requests` in async context, use `httpx`
- SQLAlchemy sessions via `async with` — no session leaks
- Use `selectinload` / `joinedload` for related data — never lazy-load across loops
```

When the Reviewer agent runs in a Python project, it reads this and applies the right lens. When it runs in a Go project, it reads a different snippet. The agent behavior changes; the agent definition does not.

### Stack templates to build

Priority order based on org portfolio:

1. `node-express.md`
2. `python-fastapi.md`
3. `react.md`
4. `nextjs.md`
5. `go-chi.md` / `go-gin.md`
6. `django.md`

---

## Installation guide

### Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code` or download the desktop app)
- Access to the `ai-workflows` repo

### Step 1 — Clone the playbook

```bash
git clone https://github.com/Tntra/ai-engineering-playbook ~/ai-engineering-playbook
```

### Step 2 — Set up the global layer

```bash
mkdir -p ~/.claude/agents ~/.claude/skills

# Copy org operating principles
cp ~/ai-engineering-playbook/CLAUDE.md ~/.claude/CLAUDE.md

# Copy phase-owner agents
cp ~/ai-engineering-playbook/.claude/agents/* ~/.claude/agents/

# Add review skills (write these four files per CLAUDE-CODE-STANDARDS.md Section 3)
# ~/.claude/skills/code-review.md
# ~/.claude/skills/security-review.md
# ~/.claude/skills/performance-review.md
# ~/.claude/skills/refactoring-best-practices.md
```

### Step 3 — Install plugins (inside Claude Code)

```bash
/plugin install skill-creator@claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@claude-mem
npx get-shit-done-cc
/reload-plugins
```

### Step 4 — Create a project `CLAUDE.md` for each existing project

For each project, create a thin `CLAUDE.md` at the project root. Start from the template:

```bash
cp ~/ai-engineering-playbook/templates/project-claude.md /path/to/your-project/CLAUDE.md
# Then edit to fill in the stack and project conventions
```

*(Note: `templates/project-claude.md` is a future addition — see Future scope below.)*

### Step 5 — Start your first feature

```bash
cd your-project

mkdir -p specs/my-first-feature
cp ~/ai-engineering-playbook/templates/spec.md \
   ~/ai-engineering-playbook/templates/plan.md \
   ~/ai-engineering-playbook/templates/tasks.md \
   ~/ai-engineering-playbook/templates/notes.md \
   specs/my-first-feature/

# Open Claude Code and start Phase 1
# Tell Claude: "Use the Product Manager agent to help me write the spec for this feature"
```

---

## Day-to-day usage

### Starting a new feature

```bash
mkdir -p specs/<feature-slug>
cp ~/ai-engineering-playbook/templates/{spec,plan,tasks,notes}.md specs/<feature-slug>/
```

Then open Claude Code in your project and begin Phase 1.

### Writing a spec

```
Prompt: "Use the Product Manager agent to write a spec for [feature].
         Context: [2-3 sentences on what this needs to do at the system level]."
```

The PM agent will ask clarifying questions, then produce `spec.md` with FR-NNN acceptance criteria in Given-When-Then format.

### Getting architecture

```
Prompt: "Switch to the Architect agent. The spec at specs/<slug>/spec.md is approved.
         Write the plan — architecture, ADRs, and constitution check."

Tip: /model opus    ← required for the plan phase
```

### Breaking tasks

```
Prompt: "Use the Planner agent to break the approved plan into tasks.md."
```

### Implementing

```
Prompt: "Use the Developer agent to implement T001 from specs/<slug>/tasks.md."
```

The Developer agent reads the plan, the spec, and the project `CLAUDE.md` before touching any code.

### Pre-PR review

Before opening any PR, run these in order:

```
/spec-check          ← verify code satisfies FR-NNN
/phase-gate          ← confirm all exit criteria are met
                        (then invoke review skills explicitly)
```

### Checking feature status across the org

```bash
# All active features and their phase status
grep -r "^status:" specs/*/spec.md specs/*/plan.md

# Features waiting on plan approval
grep -r "^status: in-review" specs/*/plan.md

# Features still drafting spec
grep -r "^status: draft" specs/*/spec.md
```

### Model selection quick reference

| Task | Model | Command |
|---|---|---|
| Writing specs, tasks, most implementation | Sonnet | `/model sonnet` (default) |
| Architecture decisions, ADRs, complex bugs | Opus | `/model opus` |
| Bulk refactors, boilerplate across many files | Haiku | `/model haiku` |
| Hard architectural call needing deep reasoning | Opus + ultrathink | Type `ultrathink` in the prompt |

### Context management

```bash
/compact but keep all API integration decisions and the database schema
# ↑ compress history while preserving what you name

/clear
# ↑ wipe context between unrelated tasks — CLAUDE.md and files still exist

/context
# ↑ see token breakdown — spot MCP tools eating context unnecessarily
```

### Parallel feature development

```bash
# Run two features simultaneously without file conflicts
claude --worktree feature-a    # in one terminal
claude --worktree feature-b    # in another terminal
# each session works on its own branch
```

---

## Future scope

### Near-term (pilot phase)

| Item | What it is |
|---|---|
| `templates/stacks/` | Pre-written project `CLAUDE.md` snippets for Node, Python, React, Go, Django, Next.js |
| `templates/project-claude.md` | Thin project CLAUDE.md starter that engineers fill in with the right stack snippet |
| `install.sh` | One script that sets up `~/.claude/` from `ai-workflows` — one-command onboarding |
| Stack-specific review skills | `security-review-node.md`, `security-review-python.md` etc. with stack-aware checklists |

### Medium-term (post-pilot)

| Item | What it is |
|---|---|
| Private org plugin | Package everything in `~/.claude/` as a private Claude Code plugin — `npx setup-tntra-workflows` installs the whole global layer in one command |
| JIRA / Confluence MCP | Sync spec status to Jira automatically; write plan ADRs to Confluence |
| Automated phase gate enforcement | A CI step that reads spec status from `specs/*/spec.md` and blocks PRs if the gate hasn't opened |

### Long-term (scaling)

| Item | What it is |
|---|---|
| Cross-project analytics | Dashboard showing: time per phase, spec approval rate, most common deviation types in notes.md |
| Domain-specific agents | Specialised agents for ML projects (data-scientist.md), mobile (ios-engineer.md), infra (sre.md) |
| AI Engineering Handbook expansion | Full documentation of the Final Vision, grounded in learnings from the pilot |

---

## Reference: the `ai-workflows` repo structure

```
ai-workflows/
├── README.md                          ← human entry point
├── CLAUDE.md                          ← AI agent behavioral rules (source for ~/.claude/CLAUDE.md)
│
├── docs/
│   ├── GUIDELINES.md                  ← how to use the process
│   ├── spec-driven-development.md     ← full rationale and phase definitions
│   ├── CLAUDE-CODE-STANDARDS.md       ← Claude Code configuration standard
│   └── ADOPTION-GUIDE.md              ← this document
│
├── templates/
│   ├── spec.md                        ← copy to specs/<slug>/
│   ├── plan.md
│   ├── tasks.md
│   └── notes.md
│
├── examples/
│   └── engineering-arcade-leaderboard/
│       ├── spec.md  (approved)        ← read these to see what good looks like
│       ├── plan.md  (approved)
│       └── tasks.md (in-progress)
│
├── specs/                             ← live feature work in this repo
│   └── <feature-slug>/
│
└── .claude/
    ├── agents/                        ← copy to ~/.claude/agents/ during setup
    │   ├── product-manager.md
    │   ├── architect.md
    │   ├── planner.md
    │   ├── developer.md
    │   └── reviewer.md
    └── skills/
        ├── spec-check.md              ← /spec-check
        └── phase-gate.md             ← /phase-gate
```
