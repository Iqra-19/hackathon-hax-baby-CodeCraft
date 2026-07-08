# Design: PM Agent — Auto Scaffolding + Jira Integration

**Date:** 2026-07-08  
**Status:** approved

---

## Problem

Two friction points block fast spec creation in pilot projects:

1. **Manual folder setup** — Engineers must manually create `specs/<feature-slug>/` and copy four template files before the PM agent can do anything. This is unnecessary busywork and easy to miss.
2. **No Jira connection** — Specs are written from scratch even when a detailed Jira user story already exists. Engineers copy-paste content manually or re-describe work that's already documented.

## Goal

The PM agent handles both problems transparently:
- It scaffolds the specs folder automatically on first invocation
- It detects a Jira ticket ID in the prompt and pulls the full ticket via MCP, asking only for what's missing

Engineer's mental model stays simple: one command, two input shapes.

## Scope

### In scope
- Update `product-manager.md`: add `Bash` tool, add `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` tool, add scaffolding + Jira detection instructions
- Update `README.md`: Phase 1 prompt examples show both paths
- Update `docs/ADOPTION-GUIDE.md`: "Writing a spec" section shows both paths + MCP note

### Out of scope
- No changes to Architect, Planner, Developer, or Reviewer agents
- No changes to any template files
- No Jira write-back (status updates, comment posting)
- No Jira search — engineer provides the ticket ID explicitly

---

## Design

### Input detection (auto-detect, Option A)

The PM agent inspects the prompt for a Jira-style ticket ID matching pattern `[A-Z]+-\d+` (e.g. `PROJ-42`, `PLATFORM-123`). If found → Jira path. If not → direct Q&A path.

```
# Direct path
"Use the Product Manager agent to write the spec for user login.
 Context: Engineers need a secure login flow with email + password."

# Jira path
"Use the Product Manager agent to write the spec for PROJECT-123."
```

### Fix 1 — Auto folder scaffolding

Runs on every invocation, before any spec writing.

**Steps the agent takes:**
1. Derive the feature slug from the feature name or Jira ticket summary — lowercase, hyphen-separated (e.g. `"User Login Flow"` → `user-login-flow`; `PROJ-42` → `proj-42-user-login-flow`)
2. Check if `specs/<slug>/` already exists (read the directory)
3. If it does not exist: `mkdir -p specs/<slug>`, then read each of the four templates and write them to the new folder:
   - `templates/spec.md` → `specs/<slug>/spec.md`
   - `templates/plan.md` → `specs/<slug>/plan.md`
   - `templates/tasks.md` → `specs/<slug>/tasks.md`
   - `templates/notes.md` → `specs/<slug>/notes.md`
4. If it already exists: skip scaffolding, use existing files

**Tools required:** `Bash` (for `mkdir -p`), `Read` (to read templates), `Write` (to write scaffolded files)

### Fix 2 — Jira MCP integration (full pull + targeted Q&A)

Triggered when a Jira ticket ID is detected in the prompt.

**Steps the agent takes:**
1. Call `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` with the ticket key
2. Extract from the response:
   - Summary → feature name / slug
   - Description → Context section candidate
   - Acceptance criteria (if present) → FR-NNN draft candidates
   - Labels → potential scope notes
   - Linked issues → potential out-of-scope or dependency notes
3. Map what is clear and technical into a FR-NNN draft (Given-When-Then)
4. Identify gaps — any of these triggers a targeted follow-up question (one at a time):
   - Description is vague, non-technical, or in business/user language only
   - No acceptance criteria in the ticket
   - Scope boundary unclear (what's explicitly excluded?)
   - Technical constraints not stated (performance, security, API shape)
5. After all gaps are resolved, write the complete spec incorporating both Jira content and answers

**Tools required:** `mcp__claude_ai_Atlassian_Rovo__getJiraIssue`

**Prerequisite:** Atlassian Rovo MCP must be connected in Claude Code (available via MCP settings — already connected in this org's environment).

### Updated agent tools list

```yaml
tools: Read, Write, Edit, Bash, mcp__claude_ai_Atlassian_Rovo__getJiraIssue
```

### Documentation changes

**`README.md` — Quick Start Step 5:**

Replace the single prompt example with two paths side by side (see success criteria below).

**`docs/ADOPTION-GUIDE.md` — "Writing a spec" section:**

Same two-path example. Add one-line note: Jira path requires Atlassian Rovo MCP connected in Claude Code.

---

## Success criteria

- Engineer can invoke the PM agent with just a feature name — no manual `mkdir`, no manual template copy
- Engineer can invoke with a Jira ticket ID — agent fetches the ticket, maps content to FR-NNN, asks only for what's missing
- README.md and ADOPTION-GUIDE.md show both invocation patterns
- If `specs/<slug>/` already exists, scaffolding is skipped silently
- If the Jira ticket has complete acceptance criteria, agent asks zero or one gap question (not a full interview)

---

## Files changed

| File | Change |
|---|---|
| `.claude/agents/product-manager.md` | Add `Bash` + MCP tool; add scaffolding + Jira detection instructions |
| `README.md` | Update Phase 1 prompt example with both paths |
| `docs/ADOPTION-GUIDE.md` | Update "Writing a spec" section with both paths + MCP note |
