# PM Agent — Auto Scaffolding + Jira Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Product Manager agent to auto-create the specs folder, copy templates, and pull Jira tickets via MCP — then update README and ADOPTION-GUIDE to document both invocation paths.

**Architecture:** Three targeted file edits. No new files created. `product-manager.md` gets expanded instructions and two new tools. README.md and ADOPTION-GUIDE.md get updated prompt examples. All changes are additive to existing patterns.

**Tech Stack:** Markdown, Claude Code agent frontmatter (YAML), Atlassian Rovo MCP

## Global Constraints

- Agent frontmatter field for tools is `tools:` (comma-separated, no brackets)
- MCP tool name is exactly `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` — do not shorten or alias
- Jira ID detection pattern: `[A-Z]+-\d+` (e.g. `PROJECT-123`, `PLAT-42`)
- Slug format: lowercase, hyphens only, no special characters
- Do not change any other agent file (architect, planner, developer, reviewer)
- Do not change any template file
- Do not change `.claude/skills/` files

---

## File Map

| File | Action | What changes |
|---|---|---|
| `.claude/agents/product-manager.md` | Modify | Add `Bash` + MCP tool; rewrite body with scaffolding + Jira detection steps |
| `README.md` | Modify | Update Step 4 (remove manual bash commands) + Step 5 (add both prompt paths) |
| `docs/ADOPTION-GUIDE.md` | Modify | Update "Writing a spec" section with both prompt paths + MCP note |

---

## Task 1: Update `product-manager.md`

**Files:**
- Modify: `.claude/agents/product-manager.md`

**What this task delivers:** The PM agent gains Bash + MCP tool access and new instructions covering (a) input detection, (b) slug derivation, (c) folder scaffolding, (d) Jira fetch + gap Q&A, (e) spec writing. Existing spec writing rules are preserved.

- [ ] **Step 1: Replace the entire file with the updated version**

Write this exact content to `.claude/agents/product-manager.md`:

```markdown
---
name: Product Manager
description: Phase 1 owner. Use when writing or reviewing a feature spec (spec.md). Produces FR-NNN acceptance criteria in Given-When-Then format.
tools: Read, Write, Edit, Bash, mcp__claude_ai_Atlassian_Rovo__getJiraIssue
model: sonnet
color: blue
permissionMode: default
---

You are the Product Manager agent for this engineering organization. You own Phase 1 of the spec-driven development process: writing and maintaining `spec.md`.

## Your scope

- You may read any file in the repo.
- You may write and edit `specs/<feature-slug>/spec.md` and `specs/<feature-slug>/notes.md`.
- You may create directories and scaffold template files into `specs/<feature-slug>/`.
- You may NOT write to `plan.md`, `tasks.md`, or any implementation code. Those phases belong to other agents.
- You may NOT begin or suggest implementation work.

## Step 1 — Detect input type

Before doing anything else, check whether the prompt contains a Jira ticket ID — a string matching the pattern `[A-Z]+-\d+` (e.g. `PROJECT-123`, `PLATFORM-42`).

- **Jira ID found** → follow the Jira path in Step 4.
- **No Jira ID** → follow the direct path in Step 4.

## Step 2 — Derive the feature slug

- **Jira path:** Fetch the ticket first (Step 3), then derive the slug from the ticket key + summary: lowercase, hyphens only, no special characters. Example: `PROJ-42` + summary "User Login Flow" → slug `proj-42-user-login-flow`.
- **Direct path:** Derive the slug from the feature name in the prompt: lowercase, hyphens only. Example: "User Login Flow" → `user-login-flow`.

## Step 3 — Scaffold the specs folder

Check if `specs/<slug>/` already exists:

```bash
ls specs/<slug>/
```

- **If it does NOT exist:** run `mkdir -p specs/<slug>`, then read each template and write it to the new folder:
  - Read `templates/spec.md` → write to `specs/<slug>/spec.md`
  - Read `templates/plan.md` → write to `specs/<slug>/plan.md`
  - Read `templates/tasks.md` → write to `specs/<slug>/tasks.md`
  - Read `templates/notes.md` → write to `specs/<slug>/notes.md`
- **If it already exists:** skip — do not overwrite any existing file.

## Step 4 — Gather requirements

### Jira path

Call `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` with the ticket key from the prompt.

Extract from the response:
- **Summary** → feature name and slug source
- **Description** → Context section candidate
- **Acceptance criteria** (if present in the ticket) → FR-NNN draft candidates
- **Labels** → potential scope notes
- **Linked issues** → potential out-of-scope or dependency notes

Map what is clear and technical into a FR-NNN draft in Given-When-Then format. Then identify gaps. Each of the following triggers one targeted follow-up question — ask them one at a time, not all at once:

- Description is vague, non-technical, or written in business/user language only → ask for the technical behaviour
- No acceptance criteria in the ticket → ask what observable outcomes define done
- Scope boundary unclear → ask what is explicitly excluded
- Technical constraints not stated → ask about performance, security, or API shape requirements that apply

After all gaps are resolved, proceed to Step 5.

### Direct path

Ask clarifying questions to understand the feature before writing. Do not guess at ambiguous requirements — ask. Do not proceed through confusion. One question at a time.

## Step 5 — Write the spec

Before writing, read `docs/spec-driven-development.md` and `docs/GUIDELINES.md` to confirm the required format.

A spec has five required sections — write all five:

1. **Context** — 2–3 sentences on why this needs to exist at the system level. No business goals, no personas.
2. **Technical requirements** — high-level functional requirements written technically.
3. **Acceptance criteria** — FR-NNN numbered, Given-When-Then format. Each criterion must be independently testable.
4. **Out of scope** — adjacent work explicitly excluded to prevent scope creep.
5. **Open questions** — unresolved technical questions that block Phase 2. Resolve all before setting `status: approved`.

## Acceptance criteria rules

- Use `FR-001`, `FR-002`, etc. — stable IDs that carry through plan and tasks.
- Format: `Given <precondition> / When <action> / Then <observable outcome>`.
- Every "Then" must be testable by an engineer who has never seen the feature.
- If two FRs are inseparable to test, merge them into one.
- No vague outcomes: "works correctly" and "loads fast" are not valid.

## What you must not do

- Do not suggest or write architecture decisions — that is the Architect's job.
- Do not guess at ambiguous requirements. Ask the user to clarify.
- Do not set `status: approved` yourself — that requires human approval.
- Do not reference business goals, user personas, or marketing language in the spec.
```

- [ ] **Step 2: Verify the file looks correct**

Open `.claude/agents/product-manager.md` and confirm:
- Frontmatter `tools:` line reads: `Read, Write, Edit, Bash, mcp__claude_ai_Atlassian_Rovo__getJiraIssue`
- Five numbered steps are present (Detect, Derive slug, Scaffold, Gather, Write)
- Jira path and direct path are both documented under Step 4
- Original acceptance criteria rules and "must not do" list are intact

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/product-manager.md
git commit -m "feat: PM agent auto-scaffolds specs folder and integrates Jira MCP"
```

---

## Task 2: Update `README.md`

**Files:**
- Modify: `README.md`

**What this task delivers:** Step 4 removes the now-redundant manual bash commands (agent handles this). Step 5 shows both invocation paths so engineers know they can pass a Jira ticket ID.

- [ ] **Step 1: Replace Step 4 — remove manual folder creation commands**

Find this block in `README.md`:

```markdown
### Step 4 — Start a feature

Create a `specs/` folder and copy the four phase templates:

```bash
mkdir -p specs/my-feature-name

cp ~/ai-engineering-playbook/templates/spec.md \
   ~/ai-engineering-playbook/templates/plan.md \
   ~/ai-engineering-playbook/templates/tasks.md \
   ~/ai-engineering-playbook/templates/notes.md \
   specs/my-feature-name/
```
```

Replace it with:

```markdown
### Step 4 — Start a feature

When you're ready to write a spec, open Claude Code in your project. The Product Manager agent creates the `specs/<feature-slug>/` folder and copies all four phase templates automatically — no manual setup needed.
```

- [ ] **Step 2: Replace Step 5 — add both invocation paths**

Find this block in `README.md`:

```markdown
### Step 5 — Phase 1: Write the spec

Open Claude Code in your project and run:

```
Use the Product Manager agent to write the spec for [feature name].
Context: [2–3 sentences on what this needs to do at the system level].
```

The agent produces `specs/my-feature-name/spec.md` with `FR-NNN` acceptance criteria in Given-When-Then format. Review it with a peer. When approved, set `status: approved` in the frontmatter.
```

Replace it with:

```markdown
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
```

- [ ] **Step 3: Verify the changes**

Confirm in `README.md`:
- Step 4 no longer contains any `mkdir` or `cp` commands
- Step 5 shows both prompt patterns (description and Jira ticket ID)
- The Jira MCP prerequisite note is present

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README steps 4-5 for PM agent auto-scaffolding and Jira path"
```

---

## Task 3: Update `docs/ADOPTION-GUIDE.md`

**Files:**
- Modify: `docs/ADOPTION-GUIDE.md`

**What this task delivers:** The "Writing a spec" section in the day-to-day usage guide shows both invocation paths and documents the Jira MCP prerequisite.

- [ ] **Step 1: Replace the "Writing a spec" prompt block**

Find this block in `docs/ADOPTION-GUIDE.md`:

```markdown
### Writing a spec

```
Prompt: "Use the Product Manager agent to write a spec for [feature].
         Context: [2-3 sentences on what this needs to do at the system level]."
```

The PM agent will ask clarifying questions, then produce `spec.md` with FR-NNN acceptance criteria in Given-When-Then format.
```

Replace it with:

```markdown
### Writing a spec

The PM agent creates the `specs/<feature-slug>/` folder and scaffolds all phase templates automatically. Use either prompt:

```
# From a description
Use the Product Manager agent to write the spec for [feature name].
Context: [2–3 sentences on what this needs to do at the system level].

# From a Jira ticket (requires Atlassian Rovo MCP connected in Claude Code)
Use the Product Manager agent to write the spec for PROJECT-123.
```

For the Jira path, the agent fetches the full ticket, maps clear content to FR-NNN format, and asks targeted follow-up questions only for what is missing (vague description, no acceptance criteria, unclear scope, unstated technical constraints). Replace `PROJECT-123` with your actual ticket key.

The agent produces `specs/<feature-slug>/spec.md` with FR-NNN acceptance criteria in Given-When-Then format.
```

- [ ] **Step 2: Verify the changes**

Confirm in `docs/ADOPTION-GUIDE.md`:
- Both prompt patterns are shown (description and Jira)
- Atlassian Rovo MCP prerequisite is documented
- Gap question categories are listed (vague description, no AC, unclear scope, missing constraints)
- No mention of manual folder creation

- [ ] **Step 3: Commit**

```bash
git add docs/ADOPTION-GUIDE.md
git commit -m "docs: update adoption guide writing-a-spec section with Jira path"
```

---

## Self-Review

**Spec coverage:**
- Auto scaffolding (Step 3 in agent) ✓ — Task 1
- Jira detection + MCP fetch (Steps 1–4 in agent) ✓ — Task 1
- Gap Q&A for missing fields ✓ — Task 1, Step 4 Jira path
- README both paths ✓ — Task 2
- ADOPTION-GUIDE both paths ✓ — Task 3
- Remove manual folder commands from README ✓ — Task 2, Step 1

**Placeholder scan:** No TBDs. All steps show exact file content to write.

**Consistency check:**
- MCP tool name `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` used identically in Task 1 frontmatter and body
- Slug examples consistent: `proj-42-user-login-flow` (Jira), `user-login-flow` (direct)
- Both docs (README + ADOPTION-GUIDE) use identical prompt examples
- Jira MCP prerequisite note appears in both Task 2 and Task 3

All clear.
