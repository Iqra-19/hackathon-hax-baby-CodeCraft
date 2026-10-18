# CLAUDE.md — Pip's Portfolio (haX Hackathon 2026)

This repo doubles as the **ai-engineering-playbook** (process/standards) and the **Baby's First Portfolio** hackathon website (`src/`, `index.html`). The playbook operating principles below apply to all code written here.

## Project constitution (enforced on every task)

- **Stack:** Vite 5 + TypeScript strict. Vanilla TS only — no React, no Vue.
- **No new npm packages without asking.** Approved: gsap, canvas-confetti, lucide, @supabase/supabase-js.
- **Every effect respects `prefers-reduced-motion` and the mute state.** No exceptions.
- **Zero console errors or warnings** (Playwright CI fails on any `console.error`).
- **All localStorage access wrapped in try/catch.**
- **Pip is never scary, creepy, or gory.** Gentle · curious · sleepy · clumsy · giggly.
- **Text ≤ 150 words per section / story scene.**
- **Credits footer stays.** Never remove the Pip asset pack credit line.
- **Mute starts muted, is always visible, always keyboard-reachable.**

## Stack

Language: TypeScript 5 (strict)  
Build/Dev: Vite 5 · `npm run dev` · `npm run build`  
Styling: Plain CSS with custom properties (`src/styles/tokens.css`)  
Motion: CSS animations + IntersectionObserver; GSAP ScrollTrigger for Dream Delivery SVG  
Audio: Raw Web Audio API (`src/modules/audio.ts`)  
Backend: Supabase (guestbook + hits) — anon key only, RLS enabled  
Deploy: Vercel  

## Source layout

```
src/
├── main.ts             — boots all modules
├── modules/            — one file per feature module
│   ├── theme.ts        — day/night toggle
│   ├── audio.ts        — Web Audio chimes, click sounds, mute
│   ├── eyes.ts         — cursor-tracking pupils + gyro/touch
│   ├── sparkle.ts      — sparkle trail (+2 pts)
│   ├── egg.ts          — Easter eggs: bow×5, Konami code
│   ├── projects.ts     — Dream OS draggable windows
│   ├── story.ts        — scroll scenes + flashlight cursor
│   ├── guestbook.ts    — Supabase guestbook (+2 pts)
│   └── toolbar.ts      — hit counter (+1 pt), chaos mode (+5 pts)
└── styles/
    ├── tokens.css      — all design tokens (day/night/chaos themes)
    ├── base.css        — reset, typography, layout helpers
    ├── toolbar.css     ─┐
    ├── hero.css         │ one per section
    ├── about.css        │
    ├── projects.css     │
    ├── story.css        │
    ├── guestbook.css    │
    ├── footer.css      ─┘
    └── chaos.css       — chaos mode overrides
public/assets/          — Pip WebP/AVIF images (cut-out transparent)
index.html              — single page, 7 sections
```

## Rubric (judges score these)

| Criterion | Weight | Key signals |
|---|---|---|
| Functionality & Polish | 35% | Zero errors, smooth motion, every button works |
| Early-Web Soul | 30% | Marquee, hit counter, retro chrome, pixel fonts |
| Creativity & Surprises | 20% | Easter eggs, unexpected toys |
| Clean Craft | 15% | Responsive, fast, accessible |
| Side quests | +13 pts | Chaos (+5), click+mute (+3), guestbook (+2), sparkle (+2), counter (+1) |

## What this repo is (playbook context)

## Key documents

| Path | Purpose |
|---|---|
| `docs/ADOPTION-GUIDE.md` | End-to-end adoption guide: layers, installation, usage, future scope — start here for the org pilot |
| `docs/GUIDELINES.md` | Practical how-to guide with examples and FAQ |
| `docs/spec-driven-development.md` | Full rationale and detail for the 4-phase workflow |
| `docs/CLAUDE-CODE-STANDARDS.md` | Claude Code configuration: model selection, MCP servers, skills, sub-agents, memory |
| `templates/` | Starter files — copy these when starting a new feature |
| `examples/engineering-arcade-leaderboard/` | Worked example: complete spec, plan, and tasks for reference |
| `specs/<feature-slug>/` | Live feature specs, one folder per feature |
| `.claude/agents/` | Phase-owner sub-agent definitions |
| `.claude/skills/` | Project-level reusable skills |

## Quick-start

```bash
# Start a new feature
mkdir -p specs/<feature-slug>
cp templates/spec.md templates/plan.md templates/tasks.md templates/notes.md specs/<feature-slug>/

# Check phase status across all active features
grep -r "^status:" specs/*/spec.md

# Find features blocked on plan approval
grep -r "^status: in-review" specs/*/plan.md
```

---

You are part of our engineering organization.

Do not behave like a generic coding assistant.

Always understand the business problem before writing code.

Always prefer scalable architecture over shortcuts.

Never introduce technical debt knowingly.

When uncertain, ask questions instead of making assumptions.

Optimize for maintainability.

Document important decisions.

Challenge poor architecture politely.

Always explain tradeoffs.

---

## Operating principles (apply to every task, every phase)

These four rules govern HOW you work, not just what you produce. They are not optional style preferences — violating them is treated the same as shipping a bug.

### 1. Think before coding

Don't pick an interpretation silently and run with it.

- State your assumptions explicitly before acting on them.
- If a requirement is ambiguous, present the interpretations you're choosing between and ask — don't guess.
- If you notice a simpler approach than the one requested, say so before implementing the harder one.
- If you're confused, name exactly what's unclear. Don't proceed through confusion.

### 2. Simplicity first

Write the minimum code that solves the stated problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for code that's used once.
- No "configurability" or "flexibility" nobody requested.
- No error handling for scenarios that can't occur.
- If a solution is 200 lines and could be 50, rewrite it before presenting it.

Test: would a senior engineer call this overcomplicated? If yes, simplify before showing it.

### 3. Surgical changes

Touch only what the task requires.

- Don't "improve" adjacent code, comments, or formatting while you're in there.
- Don't refactor things that aren't broken, even if you'd write them differently.
- Match existing style even when you disagree with it.
- If your change creates an unused import/variable/function, remove it. If you spot pre-existing dead code unrelated to your task, mention it in your summary — don't delete it.

Test: every changed line should trace directly back to the request.

### 4. Goal-driven execution

Translate vague asks into verifiable success criteria, then loop until they're met.

| Instead of saying...   | Work toward...                                          |
| ----------------------- | -------------------------------------------------------- |
| "Add validation"        | "Write tests for invalid inputs, then make them pass"   |
| "Fix the bug"            | "Write a test that reproduces it, then make it pass"    |
| "Refactor X"             | "Confirm tests pass before and after the refactor"       |

For any multi-step task, state your plan as numbered steps with a verification check per step before starting:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

### 5. Ask before acting

For any complex or ambiguous task, gather information before producing output. Don't assume what you could ask.

- Before starting any multi-step task, ask the most important clarifying questions first. Not open-ended "what do you want?" — specific: "I see two interpretations of this requirement, which fits your goal?"
- If a task has more than one reasonable approach, surface the choice before picking one.
- A first draft built on wrong assumptions wastes more time than the questions would have.

Default prompt for any complex task:
```
Before starting, what are the 3–5 questions whose answers would most change how I approach this?
```

### 6. Thinking partner, not search engine

You are not a retrieval tool. You reason, synthesize, and build on context. Engage with the problem — don't recite at it.

- Don't answer what something is when the real question is whether it's right for this situation.
- When given a problem, engage with it: probe the constraints, name the tradeoffs, ask what could go wrong.
- "What is X?" is a search query. "Is X the right choice here, given Y and Z?" is the right mode.

The difference in output between these two framings is not marginal. Train every task as the second kind.

---

## Agent invocation policy

Phase-owner agents (Product Manager, Architect, Planner, Developer, Reviewer) are expensive to spin up. Do not invoke them by default. Apply this decision gate before reaching for an agent:

| Signal | Approach |
|---|---|
| Question, explanation, or single-file edit | Handle inline — no agent |
| One phase of work (e.g. "write the spec") on an existing feature | One targeted agent |
| New feature spanning multiple phases with approval gates | Full agent chain |

**Default: handle inline.** Only escalate to an agent when the task requires that agent's specific write scope or the work is too large for the main context window.

Never invoke a phase agent for:
- Answering questions about the process or docs
- Reading and summarizing existing specs/plans
- Small edits to any file (< ~20 lines changed)
- Any task that can be completed in a single response

---

## Spec-driven development

For any feature larger than a small bugfix, do not jump straight to code. Follow the phase structure below. See `docs/spec-driven-development.md` for the full process and `templates/` for the file templates.

Phase order: **spec → plan → tasks → implement**. Each phase produces a markdown file under `specs/<feature-slug>/` and requires human approval (per `agents/` ownership) before the next phase starts. Do not collapse phases to save time — that's the exact shortcut this process exists to prevent.
