# Claude Code Standards

> **Version:** 1.0
> **Owner:** Amin Tai
> **Status:** Org standard — applies to every repo and every engineer using Claude Code.

This document defines how Claude Code is configured and used across our engineering organization: model selection, MCP server integration, skills, sub-agents, and memory management. It extends the AI Engineering Handbook and is binding in the same way `CLAUDE.md` and `workflows/spec-driven-development.md` are — this isn't a tips document, it's how we expect Claude Code to be set up on every project.

---

## Why this exists

A generic Claude Code setup gets you maybe 20% of its value — a chat box that edits files. The other 80% — deliberate model selection, custom skills, sub-agents scoped to our `agents/` roles, MCP integrations, and structured memory — is what turns it into the kind of teammate described in our AI Engineering Handbook's Final Vision. This standard exists so that capability is consistent across every repo and every engineer, not dependent on who happened to watch a tutorial.

This standard is organized around five capability areas. Each one ties back to something we already have or are building, and each is explicitly mapped onto the four phases of `workflows/spec-driven-development.md` — spec → plan → tasks → implement. This document doesn't introduce a parallel process; it's how that existing process gets executed in Claude Code.

### How these capabilities map onto the spec-driven phases

| Phase | Owner (`agents/`) | Model | Sub-agent | Skills | MCP | Memory |
|---|---|---|---|---|---|---|
| **1. Spec** (`spec.md`) | Product Manager | Sonnet | Product Manager sub-agent | — | Atlassian Rovo (for context, not yet sync) | `specs/<feature>/notes.md` starts here |
| **2. Plan** (`plan.md`) | Architect | Opus | Architect sub-agent, read-only on implementation code | — | Context7 (live docs), Atlassian Rovo | ADRs recorded per `knowledge/decision-log.md` |
| **3. Tasks** (`tasks.md`) | Planner | Sonnet | Planner sub-agent | — | — | Task list itself is the artifact |
| **4. Implement** | Developer (frontend/backend/fullstack) | Sonnet (Haiku for bulk/boilerplate) | Developer sub-agent, full write access scoped to repo | Code Review, Security Review, Performance Review, Refactoring — all required before PR | GitHub (push/PR), Playwright (E2E per QA-owned stage) | `notes.md` logs any deviation from plan |

This table is the canonical reference — if a section below and this table ever disagree, this table wins, since it's the one place all five capabilities are seen together against the same four phases.

---

## 1. Model selection — match the model to the task

Claude Code provides three models. Selecting the right one is a standard, not a suggestion — it affects both output quality and cost.

| Model | Best for | Use it for |
|---|---|---|
| **Opus** | Complex reasoning, architecture, hard bugs | Plan phase (`plan.md`), ADRs, anything where a wrong call is expensive to undo |
| **Sonnet** | Most day-to-day work, the default | Implementation, code review, most of the spec phase |
| **Haiku** | Simple, long-running, high-volume tasks | Bulk refactors, generating boilerplate, simple test writing across many files |

**Commands:**
- `/model` — switch models mid-session
- `/cost` — check usage so far
- `/context` — see token breakdown and which MCP tools are currently loaded (useful for spotting unnecessary tool loading that's burning context)
- `/compact` — summarize and trim history when a session gets long, without losing continuity

**Required by phase:** Sonnet for spec and tasks phases; Opus for the plan phase and any ADR work, per the Architect role's existing Opus convention; Sonnet for implementation, dropping to Haiku for bulk/boilerplate work within that phase. Switching models mid-phase without reason is not standard — the phase determines the model, not personal preference.

---

## 2. MCP servers — give Claude hands outside the editor

MCP (Model Context Protocol) servers let Claude act in external systems, not just suggest code. We already do this — Atlassian Rovo is connected for Jira sync. The same model applies to every other integration.

### Scoping — where you add a server matters

- **Project level** — only this repo. Use this for anything project-specific (e.g. a project's own deploy pipeline).
- **User/global level** — every project on your machine. Use this for stuff that's always useful (GitHub, Jira).
- **Local scope** — your machine only, not shared via repo config. Use for personal tokens/credentials.

### Required and standard servers

- **GitHub MCP** — required for any repo where engineers push branches via Claude Code. Lets Claude create repos, push branches, and open PRs directly, feeding straight into the Implementation phase of `spec-driven-development.md` — once `tasks.md` is approved, an agent pushes work-in-progress branches without a context switch to a terminal.
- **Atlassian Rovo** — already connected org-wide. This is what powers `workflows/jira-sync.md`. No additional setup needed per project.
- **Context7** — standard for any project with fast-moving external dependencies, to keep documentation context current rather than relying on training data that may be stale.
- **Playwright** — standard for any project with an E2E Testing stage (stage 6 in our AI workflow, QA Engineer-owned).

**Rule:** do not load every server at global scope by default. Run `/context` periodically — if MCP tools are loaded that a session isn't using, that's wasted token budget. Scope servers to the project that actually needs them.

---

## 3. Skills — codify the repeatable stuff

A skill is a markdown file describing a reusable workflow. This is the required mechanism behind the **AI Skills - Development** initiative (Security Review, Code Review, Performance Review, Refactoring/Best Practices) — these four skills must be implemented this way, not as one-off prompts.

### Where they live

```
.claude/skills/
├── code-review.md
├── security-review.md
├── performance-review.md
└── refactoring-best-practices.md
```

### Required structure

A skill must read like a checklist or template, not a vague description. `code-review.md` must specify the actual criteria — security, error handling, performance, testing — in a consistent structure every time, so review quality doesn't depend on how the prompt was phrased that day. This is a direct implementation of `engineering/code-review.md`'s "Review for: Readability, Architecture, Performance, Security, Testing, Edge cases" list — the skill is what makes that list apply automatically and consistently, rather than depending on someone restating it.

### Scoping

Project-level skills for project-specific workflows; global (`~/.claude/skills/`) for skills used everywhere. The four AI Skills - Development skills are global by default — code/security/performance review applies across every repo.

### Invocation

Skills are invoked either explicitly via a slash command, or automatically when Claude recognizes the context calls for it. For security review specifically, invocation must be explicit — automatic triggering is not sufficient for a high-stakes review; the engineer needs to know it ran.

**Phase gate:** all four review skills run during the Implementation phase, before a PR is opened — this is what the Peer Review (Pre-PR Check) approval gate in `spec-driven-development.md` actually checks for. A PR should not reach Peer Review without these having run.

---

## 4. Sub-agents — delegate and parallelize

A sub-agent is an autonomous Claude instance with its own context window, scoped to specific tools and a specific persona. Sub-agents are the required mechanism for operationalizing our existing `agents/` directory — `agents/architect.md`, `agents/qa.md`, `agents/security.md`, etc. define the roles; sub-agents are how those roles run independently rather than existing only as a prompt prefix.

### Where they live

```
.claude/agents/
├── architect.md
├── qa.md
├── security.md
└── reviewer.md
```

### Auto-generated vs custom

Claude may spin up sub-agents automatically when it determines a task benefits from delegation. This is acceptable for routine work — Claude's judgment on when parallelism helps is generally reliable.

Custom sub-agents are required when a persistent specialist needs constrained tool access — e.g. the Security sub-agent must have read-only access to the codebase plus the security-review skill, nothing else. Narrower tool access is itself a security control for this role, not an optional nicety.

### Requirement for spec-driven development

Each phase owner in `spec-driven-development.md` (Product Manager, Architect, Planner, Developer) must be implemented as a sub-agent with a system prompt drawn directly from its corresponding `agents/*.md` file. This is what turns phase ownership from a documentation convention into something Claude Code enforces — the Architect sub-agent has no write access to implementation code when scoped correctly, for instance, and the Product Manager sub-agent has no access to `plan.md` or `tasks.md` until `spec.md` is approved.

This also means the `status: approved` frontmatter gate in each spec-driven phase file should be a real enforcement point, not just a convention — a sub-agent assigned to a later phase should refuse to begin work, or should flag it explicitly, if the prior phase file isn't marked approved.

---

## 5. Memory — give Claude continuity across sessions

Claude Code has no memory between sessions by default. Everything persistent must be written down somewhere it will read again. `CLAUDE.md` is this mechanism at the org level — it must stay scoped to org rules and the four operating principles, and must not be bloated with project-specific detail.

### Required structure as projects scale

For larger or longer-running projects, a structured memory folder is required in place of one growing file:

```
.claude/
├── memory/        — project facts, decisions that don't belong in git history elsewhere
├── state/         — current status of long-running work (what's in progress, what's blocked)
└── contracts/      — API contracts, interface agreements between services
```

This extends the pattern `specs/<feature>/notes.md` already establishes at the feature level — `memory/` and `state/` do the same thing at the project level, for anything spanning multiple features. `notes.md` itself remains the required memory artifact within a single feature's spec-driven lifecycle: every deviation from an approved `plan.md`, and every decision not significant enough for a full ADR, gets logged there per `workflows/spec-driven-development.md`.

**Standard:** if the same context is being re-explained to Claude every session, it belongs in a memory file, not a prompt.

---

## 6. Visual session management (optional, under evaluation)

A visual layer for Claude Code sessions — Kanban view of sessions, live diff/markdown viewing, file-change approval UI — is not yet an org standard. It is worth piloting if multiple people are running parallel Claude Code sessions during the Engineering Arcade pilot, since it would give visibility into work in progress without requiring status updates in Slack. Adoption decision is deferred to a Phase 2 tooling review once the core workflow is validated.

---

## Reference implementation — applying the standard across a full spec-driven cycle

Example: the Engineering Arcade pilot's "leaderboard" feature, walked phase by phase against the mapping table above.

**Phase 1 — Spec**
1. `/model` → Sonnet.
2. Product Manager sub-agent (persona from `agents/product-manager.md`) writes `specs/leaderboard/spec.md`.
3. Human Product Owner approval gate — `spec.md` frontmatter set to `status: approved`.

**Phase 2 — Plan**
4. `/model opus` — required model switch per the mapping table, not optional.
5. Architect sub-agent, scoped read-only on implementation code, writes `plan.md`, pulling live framework docs via Context7 MCP if needed, and logging any non-trivial decision as an ADR.
6. Architecture Review (ARB) approval gate — `plan.md` set to `status: approved`. The Planner sub-agent should not begin Phase 3 before this.

**Phase 3 — Tasks**
7. `/model sonnet`.
8. Planner sub-agent breaks `plan.md` into `tasks.md`, each task carrying its own verification criteria.
9. Senior Engineer informal skim — no formal gate, but flagged before implementation starts.

**Phase 4 — Implement**
10. Developer sub-agent, full write access scoped to this repo, works through `tasks.md`. GitHub MCP pushes the branch directly.
11. Security-review, code-review, and performance-review skills run explicitly before PR — this is the substance of the Peer Review (Pre-PR Check) gate.
12. Playwright MCP drives E2E tests per `tasks.md`'s verification criteria, satisfying the QA-owned E2E Testing stage.
13. Standard PR Approval gate, then deploy.
14. `/compact` as needed across any phase where the session has run long, to keep context manageable without losing continuity.

Any deviation from `plan.md` during step 10 onward gets logged in `notes.md` with a date, per the spec-driven development standard — not silently absorbed into the diff.

---

## Quick reference

| Need | Use |
|---|---|
| Switch model | `/model` |
| Check cost | `/cost` |
| Check token/tool usage | `/context` |
| Trim long session | `/compact` |
| Connect to GitHub/Jira/etc | MCP servers, scoped appropriately |
| Codify a repeatable review process | A skill in `.claude/skills/` |
| Give a role independent context & constrained tools | A sub-agent in `.claude/agents/`, mapped to `agents/*.md` |
| Persist facts across sessions | `CLAUDE.md` (org-wide) or `.claude/memory/` (project-specific) |
| Know which model/sub-agent/skill applies right now | Check which spec-driven phase you're in, then use the mapping table above |

---

## Relationship to other foundation documents

This standard does not replace `workflows/spec-driven-development.md` — it is the execution layer underneath it. `spec-driven-development.md` defines the phases, owners, and approval gates; this document defines exactly which model, sub-agent, skill, and MCP server are used to carry out each phase in Claude Code. Read both together: the workflow doc for *what* happens and *who* approves it, this standard for *how* it's actually run.

---

## 7. Session management — power-user techniques

These apply across all phases and sessions. They are not phase-specific.

### Context and compaction

- **Compact at ~60% context.** Run `/compact` when context hits around 60% — don't wait until it's full. You can give explicit retention instructions: `/compact but keep all API integration decisions and the database schema`. Claude will compress everything else while preserving what you named.
- **Clear between unrelated tasks.** Use `/clear` to wipe context when switching to a completely different task. CLAUDE.md and all your files still exist — you're not starting from scratch, just dropping the stale conversation.
- **Use `/context` to diagnose bloat.** If a session feels sluggish, run `/context` to see a token breakdown by source (system prompt, file contents, MCP tools). Identify what's eating tokens and restructure accordingly. MCP tool definitions load into context — if you don't need a server for this task, don't load it.

### Plan mode

- **Start every non-trivial task in plan mode.** Hit `Shift+Tab` to cycle into plan mode. Claude can still read and research, but writes nothing. It will outline steps and ask clarifying questions before touching any file. Switch out of plan mode when you're satisfied with the approach. This alone reduces back-and-forth corrections significantly.

### Thinking depth

- **`ultrathink` for hard decisions.** Type the word `ultrathink` in any prompt to allocate the maximum thinking budget (~32k tokens) before Claude responds. Use it for: ADRs with significant architectural consequences, complex debugging that hasn't resolved after two tries, big refactors. Don't use it for routine tasks — it's expensive. This is the same posture as the extended thinking guidance in Section 2's ADR instructions.

### Steering and correction

- **Exit early and reask.** The moment Claude goes in the wrong direction, hit `Escape`. Don't wait for it to finish — every token spent on the wrong path is wasted context and increases correction cost. Correct the framing and reprompt.
- **Challenge outputs aggressively.** If output is mediocre, say so explicitly: "Scrap that. Try a completely different approach." or "This isn't good enough — do a more elegant version." Claude routinely produces a dramatically better second output when given a higher bar. After it succeeds, update the relevant skill or CLAUDE.md entry so the same mistake doesn't repeat.

### Parallel sessions

- **Git worktrees for parallel Claude sessions.** Run `claude --worktree <feature-name>` to create an isolated branch with its own workspace. Open another terminal and repeat with a different name. Each session works on its own branch without overwriting the other's files. Run 3–5 sessions simultaneously. Merge branches back via standard git when done. This is the practical mechanism behind the parallel implementation strategy described in `spec-driven-development.md`.

### Automation and notifications

- **`/loop` for recurring monitoring.** Example: `/loop every 5 minutes check the deployment logs`. Claude reruns the prompt on that interval in the background and only interrupts when something needs your input. Loops persist for up to 3 days. For longer-running automation, use desktop scheduled tasks (each fires in a fresh session without the current conversation's context).
- **Hooks for session-end notifications.** Run `/hooks` (or ask Claude in natural language) to set a sound notification when a session completes. Useful when running multiple parallel sessions — you hear the chime and know one needs input without actively watching terminals.

### Permissions

- **Use allow/deny lists instead of `--dangerously-skip-permissions`.** In your permission settings, explicitly allow commands you know are safe (reads, builds, tests) and explicitly deny anything destructive (rm, delete, drop). The deny list takes priority over the allow list. This gives the same autonomy and speed as skipping permissions, without the blast radius. Never use `--dangerously-skip-permissions` in a project with irreversible operations.

### Quick reference addition

| Need | Use |
|---|---|
| Compress a long session while keeping key decisions | `/compact but keep <what to preserve>` |
| Maximum reasoning on a hard architectural call | Type `ultrathink` in the prompt |
| Stop Claude mid-task going the wrong direction | `Escape`, then reprompt with corrected framing |
| Work on multiple features simultaneously without conflicts | `claude --worktree <feature-name>` in separate terminals |
| Monitor a deployment / PR in the background | `/loop every N minutes <check>` |
| Get notified when a session finishes | `/hooks` → set completion notification |
| Autonomous Claude without disabling all safety gates | Allow/deny lists in permissions settings |
