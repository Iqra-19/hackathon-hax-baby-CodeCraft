# Pip's Homepage @ Midnight Nursery — Design Document

_2026-10-18 · haX.baby hackathon Track 1 · 48-hour build_

---

## Intent & Why

Build Pip's personal website as a 2003-style retro homepage — marquee, hit counter, guestbook, beveled frames, 88×31 badges — but with a living character inside it. Every Track 1 entry shares the same four renders; this one makes Pip **a character who notices you**: she wakes up when you arrive, comments as you explore, goes quiet when you idle, and dozes off when you leave. The retro shell is the costume; the aliveness is the character.

---

## Goals

- Win Functionality & Polish (35%) by shipping every must-have, zero console errors, smooth motion, clean state across all features.
- Win Early-Web Soul (30%) with genuine 90s/00s chrome: marquee, hit counter, guestbook, pixel fonts, beveled image frames, webring, "best viewed at bedtime."
- Win Creativity & Surprises (20%) through the wake-up arc, Pip as persistent host, Chaos Mode as a visible-by-default retro personality, and the Easter egg.
- Win Clean Craft (15%) with Lighthouse 90+, responsive layout, accessible controls, `prefers-reduced-motion` respected everywhere.
- Collect all five side quest bonuses: Chaos Mode (+5), click sounds + mute (+3), sparkle trail (+2), guestbook (+2), hit counter (+1).

## Non-Goals

- No server-side rendering (no Next.js). Vite + vanilla TypeScript only.
- No new npm dependencies without explicit approval.
- No horror, gore, or creepy tone. Pip is never scary.
- No Track 2 characters. Pip, she/her.

## Anti-Goals (failure even if technically working)

- A site where Pip is just a picture. The aliveness must persist beyond the hero.
- Console errors or warnings in Chrome, Safari, or Firefox at any point.
- A guestbook or counter that shows errors when Supabase is slow or paused.
- An opening sequence that fires on return visits (jarring instead of warm).

---

## Constraints

- Code must be written inside the submission window (17–19 Oct 2026). No code commits before 17:17 IST on 17 Oct.
- All art credited in the footer: "Pip character art: haX.baby Track 1 Creator Asset Pack."
- Pip: she/her in third person. First person ("I") when Pip speaks.
- Every effect respects mute (starts muted) and `prefers-reduced-motion`.
- All storage in try/catch (localStorage may be unavailable).
- ~150 words max per section or story scene.
- Submit by 19 Oct 14:00 IST: live Vercel URL + public GitHub repo + write-up + credits.

---

## Stack

| Layer | Choice |
|-------|--------|
| Build | Vite 5 + TypeScript (strict) |
| Styling | Plain CSS with custom properties (tokens) |
| Motion | CSS animations + IntersectionObserver; GSAP ScrollTrigger only if needed |
| Audio | Raw Web Audio API |
| Fun | canvas-confetti (~4 KB) |
| Icons | lucide (vanilla build) + hand-made pixel icons |
| Fonts | Fredoka (body), Fraunces/Instrument Serif (headers), VT323 or Press Start 2P (retro chrome) |
| Backend | Supabase: `guestbook` + `hits` tables, RLS on, rate-limited inserts via RPC |
| Memory | localStorage (try/catch wrapped) |
| Deploy | Vercel (GitHub integration) |
| Quality | ESLint + Prettier, Playwright smoke tests, Lighthouse CI |

---

## Page Structure

One scroll, top to bottom:

1. **Toolbar** — fixed. Marquee ("now playing: Twinkle v2 · zzz edition"), hit-counter odometer, mute button (always visible), day/night toggle, Chaos Mode toggle, docked Pip host.
2. **Hero** — Pip waking up (the centerpiece). Tagline: "I build the dreams you fall asleep inside."
3. **About Pip** — Trading-card character sheet.
4. **Projects** — Five Dream OS windows (desktop) / full-screen cards (mobile).
5. **Origin Story** — Five scroll scenes, sky darkens.
6. **Guestbook** — "Sign Pip's nursery wall."
7. **Footer** — Webring, 88×31 badges, credits, "best viewed at bedtime."

---

## Feature Specs

### F1 — The Wake-Up Arc (most polished thing on the site)

**Goal:** Make the judge feel noticed before they scroll or read anything.

**Opening state:** Pip arrives with soft CSS-drawn closed lids over her eye sockets (curved lines, not dark voids). A drifting "z z z" floats above her head. The cloud bobs gently on a CSS loop.

**Prototype gate (first 3 hours):** Draw the closed lids convincingly over the render. If they don't look right by hour 4, ship the fallback: amber pinpricks dimmed to 15% opacity + blur, plus the "z z z." Do not spend more time on the lids after that.

**Trigger sequence (fires within 2.5 seconds):**
- First cursor move → start sequence immediately.
- First touch or scroll (mobile) → start sequence immediately.
- After 2.5 seconds with no interaction → auto-start with a yawn animation.

**Arc:**
1. "z z z" fades out.
2. Lids open (or pinpricks brighten from 15% to full).
3. Pupils slide toward the cursor/touch point.
4. Pip does a small CSS wiggle (translateX ±4px, 3 cycles, 300 ms total).
5. Speech bubble appears: *"oh! a visitor! it was getting so quiet in here."*
6. Bubble auto-dismisses after 4 seconds.

**Return visits (localStorage `pip-visited`):**
- If key is set, skip the arc entirely and show: *"you came back!! ✦"* bubble for 3 seconds.
- Set the key after the first arc plays.
- This is also the Tier 3 visitor-memory item.

**Reduced-motion:** Skip wiggle, use opacity fade for bubble. Arc still plays.

**No audio required:** The moment must be complete with sound muted.

---

### F2 — Pip as Persistent Host

**Goal:** Aliveness continues for the whole visit, not just the first 3 seconds.

**Docked Pip:** A small Pip icon fixed in the toolbar corner. Contains the speech bubble anchor.

**Bubble rules:**
- One bubble at a time. New bubble replaces the old one.
- Auto-dismiss after 4 seconds.
- Bubble anchored to docked Pip, never overlapping content.
- Text in a polite `aria-live` region (announced once by screen readers).

**Trigger map:**

| Trigger | Line |
|---------|------|
| Project window opens (Lullaby Lab) | "careful, the music box bites… just kidding ♪" |
| Project window opens (Nightlight) | "i made 47 of these. the moon one glows the longest." |
| Project window opens (Rattle & Block) | "the blocks go bop bop bop. try stacking them!" |
| Project window opens (Dream Delivery) | "i mapped every dream route. mostly clouds, some stardust." |
| Project window opens (Growth Chart) | "i've grown 3 whole centimetres this year. very proud." |
| Guestbook entry submitted | "someone left me a note!! ✦" |
| Idle 20 seconds (fires once per idle stretch) | "hello? still there? it's very quiet…" |
| Idle 60 seconds | Pip dozes off — lids close, "z" returns. Next interaction wakes her with a small wiggle, no full arc. |
| Tab hidden (Page Visibility API) | Pause all idle timers. |
| Tab visible again after being hidden | Resume timers. |
| Bow clicked (Easter egg not yet triggered) | (no bubble) |
| Easter egg fires while muted | "unmute me, i'll sing!! 🎵" |

---

### F3 — Audio Engine + Mute

**Goal:** Shared sound engine used by all three interactive projects.

- `AudioContext` lazy-initialized on first user gesture.
- `master GainNode` controls global volume.
- Starts muted. Mute button always visible, keyboard-accessible.
- `chime(freq, when)` — soft music-box sine tone.
- `click()` — UI feedback chime (fires on all buttons/links except mute).
- `playLullaby(tempo)` — Twinkle in C major, used by Lullaby Lab and Easter egg.
- All sound calls are no-ops when muted.

---

### F4 — Lullaby Lab (interactive project 1)

**Goal:** Web Audio music box. Wind the key → unicorn spins → lullaby plays.

- `pip_lullaby_box` asset displayed with a beveled retro frame and "click to enlarge" caption.
- A visible gold key on the right side of the box. Click/tap to wind.
- Winding: key rotates 360°, unicorn on top spins, `playLullaby()` fires.
- Subsequent winds during playback extend or restart the melody.
- Works with sound muted (visual only — key winds, unicorn spins, no audio).

---

### F5 — Nightlight Collection (interactive project 2)

**Goal:** Gallery of dream lanterns. Click a lamp to switch it on/off.

- `pip_dream_lantern` asset as the main lamp, plus 2–3 CSS/SVG variants (hue-rotated or sepia-filtered from the same render, per the asset pack rules).
- Each lamp toggles between off (dim, no glow) and on (warm glow, CSS box-shadow pulse).
- Clicking an off lamp plays a soft click chime.
- At least one lamp starts on to establish the mechanic.
- Night mode: lamps glow brighter.

---

### F6 — Rattle & Block Toys (interactive project 3)

**Goal:** Simple tactile toys using the shared audio engine. Scores Creativity.

- **Rattle:** Shake button (click/tap). Plays a fast burst of `click()` chimes in a tight cluster (3–5 chimes, ~50 ms apart). Visual shake animation on the rattle image/SVG.
- **Blocks:** Stack of 3–5 colored blocks. Click a block to "bop" it — it bounces up and down, plays a `chime()` at a block-specific pitch. Blocks can be rearranged (drag on desktop, tap-to-select + tap-to-place on mobile).
- Both share the `chime()` function from the audio engine.
- Works muted (visual only).

---

### F7 — Dream Delivery Routes (light project 1)

**Goal:** Charming card, no scroll mechanic.

- Shows the `pip_portrait` asset (or a custom SVG rooftop map) in a retro beveled frame.
- When the project window opens, an SVG path animates once (stroke-dashoffset) tracing a delivery route with 3–4 labeled stops.
- Hover over a stop: small tooltip with the stop name.
- No scroll-within-scroll.

---

### F8 — Pip's Growth Chart (light project 2)

**Goal:** Charming card with a hover reveal.

- A tall pixel-art or CSS growth chart showing Pip's height over time (hand-drawn SVG bars or a CSS grid).
- Hover over a bar: tooltip reveals a milestone ("first dream: 3 weeks").
- Static otherwise.

---

### F9 — Origin Story (5 scroll scenes)

**Goal:** Pip narrates her backstory. Sky darkens as you scroll.

- Five sections, each ≤80 words, IntersectionObserver fade-in.
- Background gradient interpolates from light sky (#b8d4f0) to deep navy (#1b1f3b) across the five scenes.
- If the visitor is already in night mode at load, the sky starts at dusk rather than noon — the gradient range is shifted so it doesn't fight the theme.
- The story sky updates if the visitor toggles the theme mid-story.
- Night mode lantern flashlight is scoped to **this section only**, with a "lights on" button. It does not apply to the rest of the page.

---

### F10 — Guestbook

**Goal:** Sign Pip's nursery wall. Scores the +2 side quest.

- "Leave a note for Pip ✦" form: name (max 32 chars), message (max 140 chars).
- Submit via Supabase RPC (rate-limited, not a direct table write).
- Input HTML-escaped; basic word filter server-side in the RPC.
- One post per visitor per 5 minutes (localStorage timestamp check + server-side rate limit).
- Supabase SDK loaded lazily (IntersectionObserver on the section, not at page load) to protect Lighthouse score.
- **Fallback if Supabase is down:** Store entry in localStorage, show "saved locally — Pip will read it later ✦". Zero `console.error`. No error state visible to the visitor.
- Recent entries displayed below the form (fetch on scroll-in).

---

### F11 — Hit Counter

**Goal:** Scores the +1 side quest.

- Odometer-style counter in the toolbar.
- Incremented via Supabase RPC on each unique visit (sessionStorage flag prevents recount within one session).
- **Fallback:** localStorage-only count if Supabase is unavailable.

---

### F12 — Day/Night Toggle

**Goal:** Tier 1 must-ship.

- Button in toolbar: "☾ bedtime" / "☀ wake up".
- Swaps CSS custom property tokens (`data-theme="night"` on `<html>`).
- Persists to localStorage.
- Dispatches `pip:theme` custom event so the story sky and other listeners can react.
- Smooth 0.6s background/color transitions.
- Respects `prefers-color-scheme` as initial default.

---

### F13 — Chaos Mode

**Goal:** Scores the +5 side quest. "Glorious retro personality that adapts to any screen."

**Visible by default in small doses:** 2–3 project windows are slightly tilted (1–3°) even in normal mode, the marquee scrolls faster, occasional glitter on the toolbar.

**Toggle pushes it further:** All windows tilt more (3–8°, hand-tuned presets per breakpoint — not random per load), marquee reverses direction, extra glitter, toolbar gets a beveled 3D border, background shows a faint repeating star pattern.

**3 hand-tuned presets per breakpoint** (mobile/tablet/desktop): exact tilt angles stored in constants, not `Math.random()`. QA can reproduce any layout.

**Does not:** Use Comic Sans. Break any button or link. Cause horizontal scroll.

---

### F14 — Easter Egg

**Goal:** Required. Scores Creativity.

- Tap Pip's bow 5× within 1.5 seconds each → Pip falls asleep animation + star confetti + `playLullaby()`.
- If muted when triggered: Pip's bubble says "unmute me, i'll sing!! 🎵"
- Konami code (↑↑↓↓←→←→BA) → "snoring mode": Pip snores, "z z z" extra large, site dims slightly.
- HTML source comment hint: `<!-- psst… pip's bow is ticklish (×5) -->`

---

### F15 — Sparkle Trail + Click Sounds

**Goal:** Side quests +2 and +3.

- Sparkle: fixed-position `✦ ✧ ⋆ ★` characters follow cursor, drift and fade. Throttled to ~25/sec. Skipped if `prefers-reduced-motion`.
- Click sounds: `click()` chime fires on all buttons/links (except the mute button itself). Handled by a single delegated listener in the audio module.

---

### F16 — Responsive Layout + Mobile

**Goal:** Required. Clean Craft criterion.

- Single-column on phones. Two-column projects grid on tablet+. Dream OS windows become full-screen cards on phones.
- Toolbar collapses to mute (always visible) + hamburger menu (everything else) on narrow screens.
- Speech bubbles anchored to docked Pip, auto-dismissed, never covering main content.
- Touch fallbacks for all pointer-only effects: eyes follow last tap, lantern cursor stays at last touch position with "lights on" button.

---

### F17 — Retro Chrome

**Goal:** Scores Early-Web Soul (30%).

- `<marquee>`-styled element (CSS animation, not the deprecated tag) with "now playing: Twinkle v2 · zzz edition".
- 88×31 pixel badges in footer.
- Webring navigation links.
- "Best viewed at bedtime" footer text.
- Pip's images in beveled frames with retro captions ("pip_avatar_cloud.jpg · 1.2 MB · click to enlarge").
- Under-construction moon icon somewhere.
- Pixel font (VT323 / Press Start 2P) for retro chrome elements only.

---

## Asset Usage

| Asset | Usage |
|-------|-------|
| `pip_avatar_cloud` | Hero (wake-up arc), toolbar docked Pip (small crop) |
| `pip_portrait` | About card, story finale scene |
| `pip_lullaby_box` | Lullaby Lab project window |
| `pip_dream_lantern` | Nightlight Collection (main lamp + CSS filter variants) |

All assets displayed on cream backgrounds or with `mix-blend-mode: multiply` on matching backgrounds. For night mode, background-removed WebP versions needed (prep with `rembg` in first 30 minutes after kickoff).

Credit line in footer and README: "Pip character art: haX.baby Track 1 Creator Asset Pack."

---

## Copy (all in Pip's voice)

All copy lives in `src/content/pip-copy.ts` — drafted before coding begins so Phase 1 has real text, not placeholders.

**Sections to write up front:**
- Hero tagline + subtitle
- About card (species, look, personality, job) — ≤150 words
- 5 project titles + blurbs — ≤80 words each
- 5 story scenes — ≤80 words each
- All host bubble lines (from trigger map above)
- Guestbook prompt text
- Footer text

Total: ~1,000 words. Pip speaks in first person ("I", "me"). Third person uses she/her.

---

## Repo Layout

```
pip-portfolio/
├─ CLAUDE.md
├─ specs/                     # one .md per feature (F1–F17)
├─ src/
│  ├─ main.ts
│  ├─ modules/
│  │  ├─ eyes.ts              # F1 wake-up arc
│  │  ├─ host.ts              # F2 persistent host
│  │  ├─ audio.ts             # F3 audio engine
│  │  ├─ lullaby-lab.ts       # F4
│  │  ├─ nightlight.ts        # F5
│  │  ├─ rattle-blocks.ts     # F6
│  │  ├─ story.ts             # F9
│  │  ├─ guestbook.ts         # F10
│  │  ├─ counter.ts           # F11
│  │  ├─ theme.ts             # F12
│  │  ├─ chaos.ts             # F13
│  │  ├─ egg.ts               # F14
│  │  └─ sparkle.ts           # F15
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ base.css
│  │  ├─ retro.css
│  │  └─ chaos.css
│  └─ content/
│     └─ pip-copy.ts
├─ public/
│  └─ assets/                 # WebP/AVIF renders, cut-out versions
└─ tests/
   └─ smoke.spec.ts           # Playwright
```

---

## 48-Hour Phase Plan

| Phase | Hours | Deliverable | Gate |
|-------|-------|-------------|------|
| P1 | H0–12 | Repo scaffold, CLAUDE.md, specs, asset prep, token CSS, hero wake-up arc (F1), Pip host (F2), audio + mute (F3), day/night (F12), responsive shell, Vercel deploy | Tier 1 MVP live |
| P2 | H12–24 | Story scroll (F9), Dream OS windows + mobile cards, Lullaby Lab (F4), Nightlight (F5) | Phone check passes |
| P3 | H24–36 | Rattle & Block (F6), click sounds + sparkle (F15), lantern cursor in story section, Chaos Mode (F13) | Both Tier 2 showpieces work muted and unmuted |
| P4 | H36–43 | Light cards (F7, F8), guestbook (F10), hit counter (F11), Easter egg (F14), Chaos Mode tuning, retro chrome (F17) | Feature freeze |
| P5 | H43–48 | Lighthouse 90+, cross-browser QA, README, story write-up, submit | Ship by 14:00 |

---

## Builder Calls (settled, not open questions)

**Asset prep:** `pip_avatar_cloud`, `pip_portrait`, `pip_lullaby_box`, `pip_dream_lantern` exist as PNG + JPG, opaque on cream background (~#f8efe0). Run `rembg` within the first 30 min of kickoff to produce transparent-background WebP. The pink bow on `pip_avatar_cloud` is a large, distinct element — a transparent `<button class="bow-hit">` overlay covers it (no need for a separate bow asset).

**Supabase RPC signatures (builder-defined):**
- `increment_hit()` → `{ count: number }` — increments hits table, returns new total.
- `insert_guestbook(name: text, message: text, visitor_id: text)` → `{ ok: boolean, error?: string }` — validates length, rate-limits by visitor_id (one per 5 min), escapes HTML, word-filters.
- Tables: `hits (id serial, count int)`, `guestbook (id serial, name text, message text, created_at timestamptz)`. RLS on; no direct client writes.

**Dream OS window chrome:** Win98-inspired. Beveled gray border (inset/outset CSS box-shadow), dark title bar (#2a2a6e or similar) with Pip-branding title and a close button (×). Windows in normal mode are laid in a CSS grid (not freely draggable) with slight 1–3° tilts on alternating cards. In Chaos Mode, tilts increase per preset. On mobile, same title bar sits above a full-screen card; no dragging.

**Lantern flashlight approach:** CSS `mask: radial-gradient(circle 160px at var(--mx) var(--my), transparent 40%, #000 100%)` on a fixed overlay inside the story section. Not canvas. Mouse/pointer updates `--mx`/`--my` custom properties. On touch, values stay at last touch point; a "lights on" button removes the overlay class entirely.

**Webring:** Dummy placeholder links (3–4 entries with fictional names) at submission time. Swap for real sibling entry URLs in P5 if available.

**Copy:** `src/content/pip-copy.ts` is drafted as the first task in P1, before any module is coded. All bubble lines, story scenes, and section text live there. No placeholder text ships.

## What Is Left to the Builder

- Exact eye-socket pixel coordinates for pupil overlays (measure against cut-out asset after `rembg`).
- Exact tilt angles for the 3 Chaos Mode presets per breakpoint (hand-tune in P3).
- SVG artwork for Dream Delivery route map and Growth Chart bars.
- CSS lamp variants for Nightlight Collection (hue-rotate / sepia filters on `pip_dream_lantern`).
- Supabase project creation and deploying the RPCs above.
- Playwright test cases (one per acceptance criterion).
