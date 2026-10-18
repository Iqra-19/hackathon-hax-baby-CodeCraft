# Baby's First Portfolio — Hackathon Master Plan
**17 Oct 2026 · @Amin Tai**

> This document is the source of truth for the full 48-hour plan. Feature specs are in `spec.md`. Implementation tasks are in `tasks.md`. Stitch prompts are in `stitch-prompts.md`.

---

## 1. The brief in plain English

We have 48 hours (17 Oct 17:17 IST → 19 Oct 17:17 IST) to build a cute, playful portfolio website for a baby character that answers three questions: what they are, what they do, and what their story is. A fully working, polished Tier 1–2 site beats an ambitious broken one — judges say so explicitly.

### Hard rules
- All code written inside the window. Public GitHub repo must show commits from 17–19 Oct — do not push any code before 17:17 IST today.
- Submit: live URL + public repo + short story write-up + credits for art, audio and libraries.
- Credit every art source visibly in the footer (the Pip pack included).
- Any sound needs an easy-to-find mute switch.
- Must work on phones and tablets.
- Text is ~150 words max per section or story scene — no text walls.
- Pip's name, skull-baby look, job (Junior Dream Engineer, Midnight Nursery) and gentle tone are locked. Never scary, creepy or gory.
- AI tools are allowed, but we must be able to explain how the site works.

**The six must-haves:** intro (identity + look), 3+ projects, story told through scroll/scenes, one visitor-reactive moment, mobile layout, one hidden Easter egg.

### Scoring rubric

| Criterion | Weight | What wins it |
|---|---|---|
| Functionality & Polish | 35% | Every button works, smooth motion, zero console errors, clean state |
| Early-Web Soul | 30% | 90s/00s whimsy: marquees, hit counters, guestbooks, pixel fonts, cozy feel |
| Creativity & Surprises | 20% | Easter eggs, unexpected toys, fresh storytelling |
| Clean Craft | 15% | Responsive, fast, accessible controls, tidy code |
| Side quests | +13 bonus | Chaos Mode +5, click sounds + mute +3, guestbook +2, sparkle trail +2, hit counter +1 |

**Winning entry target:** every Tier 1 done flawlessly, two Tier 2 showpieces (Web Audio music box + flashlight cursor), all five side quests, one or two Tier 3 extras only once the rest is solid.

### Date note
The event hub says submission opens 17 Oct 17:17; the problem page says 18 Oct 17:17. Both agree code freeze is 19 Oct 17:17 IST. We plan to submit by 19 Oct 14:00.

---

## 2. The asset pack

Four soft 3D pastel renders, each as PNG and JPG — PNGs are opaque RGB on a warm cream backdrop (~#f8efe0). Cut-outs required before using on dark/night themes.

| Asset | Size (px) | What it shows | Where we use it |
|---|---|---|---|
| pip_avatar_cloud | 896 × 1090 | Pip waving on a cloud, moon and stars | Hero + cursor-reactive host |
| pip_portrait | 682 × 1024 | Pip on a cloud holding a lantern and music box | About / character card, story finale |
| pip_lullaby_box | 1024 × 924 | Pink-and-cream music box, unicorn on top, gold key | Lullaby Lab project |
| pip_dream_lantern | 1024 × 914 | Bell-shaped nightlight with a sleepy crescent moon | Nightlight Collection project |

### Asset prep steps
1. Cut out backgrounds with `rembg` (Python) → transparent PNG, export WebP/AVIF at 1× and 2× (target < 120 KB each)
2. Keep cream originals for day mode — `mix-blend-mode: multiply` hides the backdrop on cream backgrounds
3. Extra variants via CSS filters only (hue-rotate, sepia, pixelate) — pack allows crop, resize, animate, filter, remix
4. Map eye-socket centres in % of image size; overlay glowing amber dots
5. Footer credit day one: "Pip character art: haX.baby Track 1 Creator Asset Pack."

The four renders cover two projects visually; delivery map, rattle toys, and growth chart are drawn in SVG/CSS/pixel art.

---

## 3. Creative concept: Hybrid A+B

**"Pip's Homepage @ Midnight Nursery"** — a 2003-style personal homepage (B's scroll story and glow) wrapped in A's retro chrome (marquee, "under construction" moon, hit counter, guestbook, webring), with projects as Dream OS windows on desktop and full-screen cards on phones.

- Day mode: cream and berry
- Night mode: dark navy with lantern cursor

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 5 + TypeScript (strict) | Instant dev server, tiny output, type safety |
| Styling | Plain CSS with custom properties (tokens) | Theme switching = swapping variables |
| Motion | CSS animations + IntersectionObserver; GSAP ScrollTrigger only for route map | Native first; GSAP for scroll-synced SVG |
| Audio | Raw Web Audio API | Music box + click sounds in ~150 lines |
| Fun | canvas-confetti (~4 KB) | Easter egg burst |
| Icons | lucide (vanilla build) + hand-made pixel icons | UI controls + retro charm |
| Fonts | Fredoka (body), Fraunces (headers), VT323 (retro chrome) | Matches haX.baby editorial |
| Backend | Supabase: guestbook + hits, RLS, rate-limited RPC | Free tier, already linked |
| Memory | localStorage (try/catch) | "Welcome back" with zero backend risk |
| Quality | ESLint + Prettier, Playwright smoke test, Lighthouse CI | Proves zero errors + mobile |
| Deploy | Vercel (GitHub integration) | Live URL in minutes |

---

## 5. Site map and feature plan

### Page sections (top to bottom)
1. **Toolbar** — marquee, hit-counter odometer, mute, day/night, Chaos Mode toggle
2. **Hero: "Hi, I'm Pip!"** — avatar on bobbing cloud, cursor-following eyes, tagline
3. **About Pip** — trading-card character sheet
4. **Projects (Dream OS windows)** — Lullaby Lab, Nightlight Collection, Dream Delivery Routes, Rattle & Block Toys, Pip's Growth Chart
5. **Origin story** — 5 scroll scenes, sky darkening
6. **Guestbook** — "Sign Pip's nursery wall" with stickers
7. **Footer** — webring buttons, 88×31 badges, credits

### Feature map

| Feature | Rubric | Tier | Phase |
|---|---|---|---|
| Eye tracking + touch fallback | Required | 1 | P1 |
| Scroll story (5 scenes) | Required | 1 | P2 |
| Day/night toggle | Tier 1 | 1 | P1 |
| Responsive layout | Required | 1 | P1–P2 |
| Easter egg (bow ×5 + Konami) | Required | 1 | P4 |
| Lullaby Lab music box (Web Audio) | Tier 2 showpiece | 2 | P3 |
| Lantern flashlight cursor (CSS mask) | Tier 2 showpiece | 2 | P3 |
| Dream Delivery route on scroll (SVG) | Tier 2 bonus | 2 | P4 |
| Click sounds + mute | +3 side quest | — | P3 |
| Sparkle cursor trail | +2 side quest | — | P3 |
| Hit counter odometer | +1 side quest | — | P4 |
| Live guestbook (Supabase) | +2 side quest | 3 | P4 |
| Chaos Mode | +5 side quest | — | P4 |
| "Welcome back" memory | Tier 3 | 3 | P4 |
| Lighthouse 90+ | Tier 3 | 3 | P5 |

Three projects are the minimum; Lullaby Lab, Nightlight Collection and Dream Delivery Routes are the core three — two others can be cut.

---

## 6. 48-hour roadmap

Plan ~6 hours sleep each night inside phases 1 and 3. Queue long Claude Code tasks before sleeping, review after. If a gate is missed, drop the lowest-value item from the next phase rather than pushing the gate.

**Rule:** a complete, deployed Tier 1 site exists by Sunday 05:17 — every later hour only adds points.

---

## 7. Spec-driven development

Lightweight spec folder. Phase order: **spec → plan → tasks → implement**. Each feature has its own spec file in `specs/pip-portfolio/`.

### Each feature spec has five headings
1. Goal (one line + rubric item it scores)
2. Behaviour (Given/When/Then)
3. Mobile & a11y (touch fallback, keyboard, prefers-reduced-motion)
4. Acceptance checks (testable)
5. Out of scope

### The loop, per feature
1. Write or approve the spec (10 min)
2. Prompt: "Implement specs/pip-portfolio/[feature].md. Follow CLAUDE.md. Plan first, then code, then add a Playwright check."
3. Run dev server, try on phone (`npm run dev` with `--host`)
4. Commit with spec id ("feat(12): lullaby lab music box")
5. Tick in tasks.md; push → Vercel preview

---

## 8. Starter code snippets

All are vanilla TypeScript for Vite; each respects mute and prefers-reduced-motion.

### Theme tokens — `styles/tokens.css`
```css
:root {
  --cream: #fff8f1; --berry: #a34063; --cocoa: #5c4033;
  --amber: #ffc56b; --lilac: #c9b6e4; --navy: #1b1f3b;
  --bg: var(--cream); --ink: var(--cocoa); --accent: var(--berry);
  --card: #ffffff; --glow: rgba(255, 197, 107, .55);
  --font-head: "Fraunces", Georgia, serif;
  --font-body: "Fredoka", system-ui, sans-serif;
  --font-retro: "VT323", ui-monospace, monospace;
}
:root[data-theme="night"] {
  --bg: var(--navy); --ink: #f4ead9; --accent: #ff8fb1; --card: #262b52;
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

### OKLCH tokens (preferred)
```css
:root {
  --cream: oklch(0.983 0.012 67.7);  --berry: oklch(0.516 0.135 1);
  --cocoa: oklch(0.399 0.045 45.9);  --amber: oklch(0.858 0.126 76.7);
  --lilac: oklch(0.807 0.067 303.7); --navy:  oklch(0.251 0.053 275.7);
  --berry-hover: oklch(from var(--berry) calc(l - 0.06) c h);
  --berry-press: oklch(from var(--berry) calc(l - 0.12) c h);
}
```

### Motion duration tokens
```css
:root {
  --dur-instant: 100ms;   /* press feedback, hover colour, toggles */
  --dur-quick:   150ms;   /* tooltips, icon swaps, mute/theme buttons */
  --dur-base:    250ms;   /* window open/close, card reveals, bubble pop */
  --dur-slow:    400ms;   /* theme crossfade, section reveals on scroll */
  --dur-story:   700ms;   /* story scene transitions, sky shifts */
  --dur-pip:     900ms;   /* wake-up arc (choreographed) */

  --ease-out: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-in:  cubic-bezier(0.3, 0, 0.8, 0.15);
  --ease-std: cubic-bezier(0.2, 0, 0, 1);
}
@supports (animation-timing-function: linear(0, 1)) {
  :root {
    --spring-soft:   linear(0, 0.081, 0.268, 0.493, 0.708, 0.885, 1.011, 1.087, 1.122, 1.124, 1.108, 1.081, 1.053, 1.027, 1.007, 0.994, 0.987, 0.984, 0.985, 0.988, 0.991, 0.995, 0.998, 1, 1.001, 1.002, 1.002, 1.001, 1);
    --spring-bouncy: linear(0, 0.109, 0.37, 0.684, 0.971, 1.179, 1.288, 1.306, 1.255, 1.167, 1.07, 0.987, 0.932, 0.907, 0.908, 0.928, 0.957, 0.987, 1.01, 1.024, 1.03, 1.027, 1.02, 1.01, 1.002, 0.995, 0.992, 0.991, 0.992, 0.995, 0.998, 1);
  }
}
```

---

## 9. QA and submission checklist

Run from 19 Oct 12:00; submit by 14:00 IST.

### Must-haves
- [ ] Intro, 3+ projects, scroll story, interactive moment, mobile layout, Easter egg all present
- [ ] Every section and story scene under ~150 words
- [ ] Pip host/narrator voice throughout; nothing scary
- [ ] Mute button visible on every screen size, keyboard-reachable, starts muted

### Polish (35%)
- [ ] Zero console errors or warnings in Chrome, Safari and Firefox
- [ ] Every button and link works; no dead `#` links
- [ ] Tested on real phone (iOS Safari + Android Chrome) and tablet, portrait and landscape
- [ ] Touch fallbacks for eyes, flashlight and hover-only effects
- [ ] `prefers-reduced-motion` turns off sparkles, confetti and parallax

### Craft (15%)
- [ ] Lighthouse mobile: Performance, Accessibility, Best Practices, SEO all 90+
- [ ] Images in WebP/AVIF with width/height set; fonts preloaded with `font-display: swap`
- [ ] Alt text on all Pip images; visible focus rings; colour contrast AA in both themes
- [ ] Supabase key is the public anon key only; RLS on; guestbook input length-limited and escaped

### Submission
- [ ] Live URL (Vercel) opens in a private window
- [ ] Public GitHub repo with steady commits from 17–19 Oct and a README
- [ ] Story write-up: a few paragraphs on Pip's world and our proudest features
- [ ] Credits in footer and README: Pip asset pack, fonts, libraries, sounds
- [ ] Easter egg hint in HTML source: `<!-- psst… pip's bow is ticklish (×5) -->`

---

## 11. The design thesis

A master designer's site doesn't have more effects; every effect has a reason, a timing and a quiet version. Our thesis: one unforgettable moment, a consistent motion language, and nothing that waits on the visitor.

### Five principles

| Principle | The science | What we do |
|---|---|---|
| Design the peak and the end | Peak-end rule | Peak = the wake-up. End = Pip waves and says "sweet dreams, come back soon" |
| Beauty buys forgiveness | Aesthetic-usability effect | Spend the first-screen budget on finish: type, spacing, glow, timing |
| Never make them wait | Doherty threshold (<400 ms) | Every click answers within 100 ms; windows open in under 300 ms |
| Motion must mean something | Apple HIG | Each animation answers "what changed and where did it come from" |
| Frequency decides animation | Emil Kowalski | Wake-up gets full choreography; toolbar toggles get 150 ms |

**Risk to fix:** cream + Fraunces is overused in AI-generated sites. We keep it (haX.baby family look) but make the signature ours: pixel chrome, nursery-wallpaper textures, amber glow as the only saturated light, and the wake-up as the one bold moment.

---

## 12. Motion system

All motion from six duration tokens and four easings. See token block in section 8.

### Craft rules
1. **Animate only transform and opacity** — compositor only; no top/left/width
2. **Origin-aware** — windows grow from their icon; bubbles grow from Pip's mouth side
3. **Never from zero** — scale from 0.9–0.96, not 0; buttons press to 0.97 on `:active`
4. **Interruptible** — use Web Animations API so animations can be reversed and cancelled
5. **Stagger, don't flood** — section reveals stagger children 40–60 ms, max 6 items
6. **Ease-out to enter, ease-in to leave, standard to change** — leaving ~20% faster
7. **Reduced motion = fades, not nothing** — 150 ms opacity fades; keep wake-up as lid fade + glow-on

---

## 13. Bringing Pip to life

### The wake-up arc (≈ 1.1 s total)
1. **0 ms** — trigger (first pointer move, touch, scroll, or 2.5 s auto-wake). Input never blocked.
2. **0–120 ms** — anticipation: Pip squashes down 3% (scaleY 0.97, scaleX 1.02)
3. **120–300 ms** — lids open with `--ease-out`; amber glow fades 0 → 60%
4. **300–420 ms** — pupils snap toward pointer (saccade); glow overshoots 100% → settles 85%
5. **350–750 ms** — startled wiggle: stretch up 4%, ±4° rotation wobble on `--spring-bouncy`; nightcap pom-pom lags 60 ms (follow-through)
6. **600–850 ms** — speech bubble scales 0.92→1 from Pip's side on `--spring-soft`
7. **after 850 ms** — idle layer takes over

### Disney principles used
| Principle | Where |
|---|---|
| Anticipation | Breath-in squash before waking; lean before bubble appears |
| Squash & stretch | Wake-up + Easter-egg giggle |
| Follow-through & overlap | Nightcap pom-pom lags body 60–100 ms |
| Slow in, slow out | Every move eases |
| Secondary action | Breathing + cloud bob continue while she talks |
| Timing & appeal | Random blink gaps; nothing sharp or jumpy |

### Idle layer
- **Breathing:** scaleY 1 → 1.015 over 3.2 s, ease-in-out, infinite
- **Cloud bob:** translateY 0 → −6 px over 4 s, offset from breathing
- **Blinks:** lids closed ~120 ms, random gap 3–6 s, double blink 1 in 5 times
- **Glance-away:** after 8 s of no movement, eyes drift to a star for 1.5 s, then back

### Gaze that feels real
- Pupils move with lerp ~0.18 per frame, clamped to socket
- Head turns 1–2° toward cursor with lerp ~0.05 — eyes lead, head follows
- When cursor stops near her face, glow brightens 10%; when cursor leaves, pupils return to centre after 600 ms

---

## 14. Visual system

### Colour — WCAG AA check

| Pair | Contrast | Verdict |
|---|---|---|
| Cocoa #5C4033 on cream #FFF8F1 | 8.92:1 | Body text — AAA |
| Berry #A34063 on cream | 5.75:1 | Links, headings — AA |
| White on berry | 6.05:1 | Buttons — AA |
| Cream #F4EAD9 on navy #1B1F3B | 13.49:1 | Night — AAA |
| Pink #FF8FB1 on navy | 7.52:1 | Night links — AAA |
| Amber on cream | 1.48:1 | Decoration only — never text |

### Typography
- Scale ratio 1.25 (major third), fluid with `clamp()`
- Fraunces: `font-variation-settings: "SOFT" 100, "opsz" 72`
- Fredoka: weight 400–500, line-height 1.55, max 62ch
- VT323: chrome only (titles, counters, marquee) at 18 px+
- Subset and self-host as WOFF2; preload above-fold fonts

### Space, shape, depth
- 8 px grid; spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Two shapes: soft cards 16 px radius; crisp retro windows 0 radius + 2 px bevel
- One light source: Pip's amber glow — all shadows fall away from her
- Texture: 3% film-grain overlay + faint star-print wallpaper pattern

---

## 15. Sound design

Every sound is short, soft, tied to an action, from one instrument family (music box + soft wood).

- **Length:** clicks 30–150 ms; notifications up to ~500 ms; most under 300 ms
- **Loudness:** master gain ~0.3; test on phone speakers
- **Pitch meaning:** rising two-note chime = success; falling = closing; no error tones
- **Harmony:** all cues in C major pentatonic (C D E G A)
- **Variation:** randomise pitch ±3% and volume ±10% per click
- **Timbre:** music box = sine + quiet octave partial, 5 ms attack, 1–1.5 s decay; wood blocks = 40 ms filtered noise; rattle = 3–5 noise bursts 30 ms apart
- **Respect:** starts muted; pause on `visibilitychange`
- **Signature:** wake-up gets E–G–C "ding-ding-ding"; goodnight uses it in reverse

---

## 16. Tool pipeline

1. Stitch → visual design (layout, tokens, spacing)
2. Claude Code → implementation (match Stitch layout, CSS-token codebase)
3. DevTools → verify (Animations panel at 10% speed, Performance panel 4× CPU throttle)

Steps repeat per feature. Failed check → back to step 2.

---

## 17. Reference library

| Resource | What to take from it | Read when |
|---|---|---|
| Emil Kowalski — 7 practical animation tips | Durations, ease-out, scale-from-0.9, origin-aware | Before writing any animation |
| Emil Kowalski — You don't need animations | Frequency decides whether to animate | Before writing any animation |
| Rauno Freiberg — Invisible details | Interruptibility, spatial consistency | Before building windows and toys |
| Josh Comeau — Animated sparkles | Random size 10–20 px, 50–450 ms spawn interval | Building sparkle trail |
| Josh Comeau — linear() timing | CSS springs and fallback pattern | Tuning Pip's wiggle |
| Disney's 12 principles | Anticipation, follow-through, squash & stretch | Choreographing the wake-up |
| Laws of UX | Peak-end, aesthetic-usability, Doherty threshold | Writing the judge's journey |
| web.dev animations guide | Compositor-only properties | Any jank in DevTools |
| Material 3 motion tokens | Duration scale and easing curves | Setting tokens |
| 98.css | Win98 bevel colours and control styles (MIT) | Building retro chrome |
| UI sound guide | Lengths, loudness, pitch meaning | Building the audio module |

**Sites to study (10 min each):** Poolsuite — retro OS feeling premium; Windows 93 — chaotic retro humour; neal.fun — simple toys with perfect feel.

---

## 18. Quality bar

### The critique loop (15 minutes per feature)
1. **Slow motion:** DevTools → Animations panel at 10% speed. Look for abrupt starts/stops or double overshoots.
2. **Frame check:** Performance panel with 4× CPU throttle. No long frames during wake-up or window open.
3. **Interrupt test:** click everything twice, fast; open and close mid-animation; toggle theme mid-scroll.
4. **Three viewers:** 390 px phone, 768 px tablet, 1440 px desktop, light and night, plus reduced motion.
5. **Fresh eyes:** watch a real person's face in the first 5 seconds. If they don't smile at the wake-up, fix that first.

### Pass/fail before submitting
- [ ] Wake-up plays within 300 ms of first input, or by itself at 2.5 s, on phone and desktop
- [ ] Every interaction gives feedback within 100 ms
- [ ] All animations use only transform/opacity; 60 fps on a mid-range phone
- [ ] Every animation is interruptible; no input is ever blocked
- [ ] Reduced motion replaces movement with fades; site is still delightful
- [ ] Only tokens used — no stray durations, easings, colours or spacing values in the code
- [ ] All text pairs pass WCAG AA in both themes; visible focus rings on everything interactive
- [ ] Sounds are short, pentatonic, equal loudness; muted by default
- [ ] The goodnight ending works: the last thing a judge sees is Pip say "sweet dreams, come back soon ✦"
