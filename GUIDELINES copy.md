# AI Workflow Guidelines

> How to use the spec-driven development files in this repo. Read this before starting any feature larger than a small bugfix.

---

## What changed

Two new pieces were added on top of the existing `AI/` handbook:

1. **`CLAUDE.md`** at the repo root now includes four behavioral rules every AI agent must follow, on top of the org rules already there.
2. **A `specs/` folder** where every non-trivial feature gets its own subfolder of markdown files, written and approved in phases before any code is touched.

Nothing about how you use Claude Code day-to-day changes for small tasks — bugfixes, one-line tweaks, and small PRs still go straight to a developer agent as before. This process kicks in for anything that would normally need a design discussion first.

---

## Part 1 — The four behavioral rules (`CLAUDE.md`)

These apply to every AI agent, on every task, in every phase. They exist because LLMs left unguided tend to fail in four predictable ways: guessing instead of asking, overbuilding, touching unrelated code, and losing track of what "done" means.

| Rule | What it stops | What you'll notice |
|---|---|---|
| **Think before coding** | Silent assumptions on ambiguous requirements | The agent asks a clarifying question instead of guessing, or states "I'm assuming X — let me know if that's wrong" before proceeding |
| **Simplicity first** | Overbuilt, speculative code | Shorter diffs, no unused config options or "just in case" abstractions |
| **Surgical changes** | Drive-by refactoring, unrelated edits | PRs only touch lines related to the actual task |
| **Goal-driven execution** | Vague, unverifiable task completion | The agent states a numbered plan with a verification step before starting multi-step work |

You don't need to invoke these — they're always active. If you see an agent violate one (e.g. it refactors unrelated code, or just guesses at an ambiguous spec instead of asking), that's worth flagging — point it out and ask it to redo the change within scope.

---

## Part 2 — Spec-driven development (`specs/`)

### When to use it

Use this process for: new features, anything touching multiple files or services, anything with unclear requirements, anything that would normally get a design doc or architecture discussion.

Skip it for: bugfixes, copy changes, config tweaks, anything closeable in a single small PR with no open design questions.

### The four phases

Each feature gets a folder: `specs/<feature-slug>/`, containing four files that get filled in **in order**:

```
specs/
└── checkout-redesign/
    ├── spec.md      ← Phase 1: what & why
    ├── plan.md       ← Phase 2: how
    ├── tasks.md        ← Phase 3: the checklist
    └── notes.md         ← ongoing: decisions & deviations
```

#### Phase 1 — `spec.md` — What & Why

**Who writes it:** Product Manager (or whoever owns requirements for this feature)
**Who approves it:** Product Owner

This describes the problem, the user stories, and the acceptance criteria. **No tech stack, no implementation detail** — if you catch yourself writing "we'll use React for this," that belongs in the next phase, not here.

Don't move to Phase 2 until this file's frontmatter says `status: approved`.

#### Phase 2 — `plan.md` — How

**Who writes it:** Architect / Solution Architect
**Who approves it:** Architecture Review (ARB)

Takes the approved spec and adds tech stack choices, data model, API contracts, and an ADR (Architecture Decision Record) for any non-obvious decision. This is where tradeoffs get written down — not in a Slack thread that disappears.

Don't start writing code based on a plan that isn't `status: approved` yet.

#### Phase 3 — `tasks.md` — The Checklist

**Who writes it:** Planner
**Who reviews it:** Senior Engineer (quick skim, not a full approval gate)

Breaks the plan into small, ordered tasks. Each task should close in one PR and states how to verify it's done — this is the Goal-Driven Execution rule from `CLAUDE.md` applied at the planning level.

#### Phase 4 — Implementation

**Who does it:** whichever developer agent fits (frontend/backend/fullstack)
**Who approves it:** Peer Review, then standard PR review

Work through `tasks.md` top to bottom, checking off tasks as you go. If you deviate from the plan for any reason, log it in `notes.md` with the date — don't just silently do something different.

### Starting a new feature

```bash
cp -r specs/_template specs/<your-feature-slug>
```

Then open `spec.md` and start filling it in. Each template file has inline guidance on what goes where.

### The approval gates, summarized

| Phase | File | Approver |
|---|---|---|
| 1 | `spec.md` | Product Owner |
| 2 | `plan.md` | Architecture Review |
| 3 | `tasks.md` | Senior Engineer (informal) |
| 4 | code / PR | Peer Review → standard PR Approval |

No phase starts until the previous file is marked `status: approved`. This isn't bureaucracy for its own sake — it's the same human-in-the-loop gates already in our AI governance model, just given something concrete to actually approve instead of a verbal description.

---

## Part 3 — Syncing specs to Jira

Once `spec.md` reaches `status: approved`, it gets synced into Jira as a story — see `AI/workflows/jira-sync.md` for the exact procedure if you're doing this yourself, or just ask the Product Manager agent to "sync this spec to Jira" once it's approved.

A few rules worth knowing even if you're not doing the sync yourself:

- The spec is written in markdown first, **not** directly in Jira. Markdown is faster to iterate on and stays in git history. Jira is the destination, not the source.
- The returned Jira key gets written back into `spec.md`'s frontmatter (`jira_key: ENG-456`), and that same key propagates into `plan.md`, `tasks.md`, and `notes.md` so everything traces back to one ticket.
- If someone has manually edited the Jira description since the last sync, the sync should flag that and ask before overwriting — it won't silently clobber human edits.

---

## FAQ

**Do I have to use this for every task?**
No — only for features substantial enough to warrant a design step. Small fixes go straight to implementation as before.

**What if I skip a phase to save time?**
Don't. The whole point of this process is catching ambiguity and bad architecture before code exists, which is far cheaper than catching it in review or production. If a phase feels unnecessary for a specific feature, raise that with whoever owns the process rather than quietly skipping it.

**Can I edit `notes.md` entries after the fact?**
No — it's append-only. Add a new dated entry instead of editing old ones. The point is an honest trail of what actually happened, not a tidied-up version after the fact.

**Where do the agent roles (Product Manager, Architect, Planner, etc.) come from?**
They're already defined in `AI/agents/`. This process just gives each of those roles a specific phase and file to own instead of an open-ended responsibility.

**What if requirements change mid-implementation?**
Update `spec.md`, bump its frontmatter status back to `in-review`, get it re-approved, then update `plan.md` and `tasks.md` accordingly. Don't let implementation quietly drift from a spec that's gone stale — fix the spec.

---

## Quick reference

```bash
# Start a new feature
cp -r specs/_template specs/my-new-feature

# Check phase status across all active features
grep -r "status:" specs/*/spec.md

# Find features still waiting on Jira sync
grep -L "jira_key:" specs/*/spec.md
```

For the full rationale behind this process, see `AI/workflows/spec-driven-development.md`. For the Jira sync mechanics, see `AI/workflows/jira-sync.md`.
