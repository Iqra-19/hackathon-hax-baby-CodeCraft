# Design: Pilot Project Required Files

**Date:** 2026-07-08  
**Status:** approved

---

## Problem

Engineers setting up a new pilot project have to manually piece together setup steps from multiple places in the README and ADOPTION-GUIDE. There is no single authoritative list of what every working project must have committed. As a result, projects can end up without `CLAUDE.md` or `.claude/`, and Claude lacks the context it needs to behave consistently.

## Goal

Make it impossible to miss the required files by:
1. Adding a visible mandate (checklist) in README.md that names what every pilot project must have committed.
2. Adding clear copy-paste setup steps in README.md so engineers can go from zero to compliant in under 5 minutes.
3. Adding a `templates/specs-readme.md` that gets dropped into a project's `specs/` folder to explain its purpose to any engineer who opens the repo.

## Scope

### In scope
- Add "Pilot project requirements" section to README.md (mandate/checklist)
- Add "Setting up a pilot project" section to README.md (step-by-step commands)
- Add `templates/specs-readme.md` (template for the specs/ folder README)

### Out of scope
- No install script
- No changes to agent or skill files
- No changes to ADOPTION-GUIDE or other docs
- No changes to existing Quick Start steps in README.md

---

## Changes

### 1. README.md — "Pilot project requirements" section

Added near the top, after the intro paragraph and before Quick Start. A non-optional checklist of the three required committed files:

```
Every pilot project must have these three things committed to the repo:

- [ ] `CLAUDE.md` at the project root — stack, conventions, security notes
- [ ] `.claude/agents/` — all five phase-owner agents copied from the playbook
- [ ] `.claude/skills/` — spec-check and phase-gate skills copied from the playbook
- [ ] `specs/README.md` — explains the specs/ folder to any engineer opening the project
```

Visual treatment: a short callout block so it reads as a mandate, not a suggestion.

### 2. README.md — "Setting up a pilot project" section

Replaces the thin "Setting up a new project" section. Structured as numbered steps with one-line descriptions and copy-paste commands. Ends with a verify step.

Steps:
1. Copy agents and skills from the playbook
2. Create CLAUDE.md from the template
3. Fill in the stack, commands, and conventions (with inline prompts)
4. Create the specs/ folder and drop in the README template
5. Commit everything
6. Verify: `ls -la CLAUDE.md .claude/ specs/`

### 3. `templates/specs-readme.md`

Short file (10–15 lines) explaining:
- What `specs/` is for
- Folder naming convention (`specs/<feature-slug>/`)
- The four files per feature (spec.md, plan.md, tasks.md, notes.md)
- Link back to the playbook

---

## Success criteria

- A new engineer can read the README and set up a compliant project without opening any other doc.
- The mandate section is the first thing an engineer sees when they look at the README for setup guidance.
- The `specs/README.md` gives context to anyone unfamiliar with the workflow who opens the project.
