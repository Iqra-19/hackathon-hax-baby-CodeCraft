---
feature: pip-portfolio
status: approved
owner: amin-tai
created: 2026-10-18
approved-by: amin-tai
approved-date: 2026-10-18
---

# Spec: Pip's Homepage @ Midnight Nursery

> What the site must do — not how it is built. Tech stack and implementation choices are in `plan.md`.

## Context

Build Pip's portfolio website for the haX.baby hackathon (Track 1). The site must answer three questions — what Pip is, what she does, and what her story is — while competing against other entries that start from the same four character renders. The differentiator is that Pip feels alive: she notices the visitor, comments throughout their stay, and goes quiet when they leave. A fully polished Tier 1–2 entry beats an ambitious broken one; the scoring rubric weights functionality and polish at 35%.

## Technical requirements

- The site must be a single scrolling page with seven sections: toolbar, hero, about, projects, origin story, guestbook, footer.
- The site must be responsive and usable on phones, tablets, and desktop without horizontal scroll.
- Every interactive effect must respect `prefers-reduced-motion` (skip animations, keep functionality).
- Every sound effect must be controllable by a mute button that is visible at all screen sizes and starts in the muted state.
- All localStorage access must be wrapped in try/catch.
- Zero `console.error` or `console.warn` in Chrome, Safari, and Firefox at any point during normal use.
- Each section and story scene must contain ≤150 words of copy.
- The footer must credit: "Pip character art: haX.baby Track 1 Creator Asset Pack."

## Acceptance criteria

### F1 — Wake-up arc

- [ ] **FR-001:** Pip arrives asleep
      Given the page has just loaded
      When the hero section is visible
      Then Pip's eyes show soft closed lids (CSS overlay) and a "z z z" element drifts above her head; the cloud bobs on a CSS loop

- [ ] **FR-002:** Cursor/touch triggers wake-up
      Given Pip is asleep
      When the visitor moves the cursor, touches the screen, or scrolls for the first time
      Then the wake-up arc plays immediately (z fades → lids open → pupils slide to cursor → small wiggle → speech bubble)

- [ ] **FR-003:** Auto-wake after 2.5 seconds
      Given Pip is asleep and no interaction has occurred
      When 2.5 seconds have passed since page load
      Then the wake-up arc plays automatically (with a yawn variant instead of a startled wiggle)

- [ ] **FR-004:** Opening speech bubble
      Given the wake-up arc has played
      When the arc completes
      Then a speech bubble displays "oh! a visitor! it was getting so quiet in here." and auto-dismisses after 4 seconds

- [ ] **FR-005:** Return visit recognition
      Given the visitor has been to the site before (localStorage key `pip-visited` is set)
      When the page loads
      Then the full wake-up arc is skipped and Pip shows "you came back!! ✦" in a bubble for 3 seconds; the key is set after the first arc plays

- [ ] **FR-006:** Reduced-motion variant
      Given the visitor has `prefers-reduced-motion: reduce` set
      When the wake-up arc plays
      Then the wiggle is replaced by an opacity fade; the arc still plays and the bubble still appears

- [ ] **FR-007:** No-audio requirement
      Given sound is muted (the default state)
      When the wake-up arc plays
      Then the arc is visually complete and communicates the moment without any sound

### F2 — Pip as persistent host

- [ ] **FR-008:** Docked Pip in toolbar
      Given any scroll position
      When the toolbar is visible
      Then a small Pip icon is fixed in the toolbar corner and serves as the speech bubble anchor

- [ ] **FR-009:** Project window comments
      Given sound is any state
      When a project window or card is opened
      Then Pip's docked icon shows a project-specific comment bubble that auto-dismisses after 4 seconds; one bubble at a time

- [ ] **FR-010:** Guestbook reaction
      Given a visitor has submitted a guestbook entry
      When the submission succeeds (or is saved locally)
      Then Pip's bubble shows "someone left me a note!! ✦"

- [ ] **FR-011:** Idle — "still there?"
      Given the visitor has been idle (no pointer move, scroll, or click) for 20 seconds
      When this is the first idle stretch (resets on any interaction)
      Then Pip's bubble shows "hello? still there? it's very quiet…"; the timer fires at most once per idle stretch; timers pause when the tab is hidden

- [ ] **FR-012:** Idle — doze off
      Given the visitor has been idle for 60 seconds
      When the doze threshold is reached
      Then Pip's lids close and a "z" returns; the next interaction wakes her with a small wiggle (no full arc)

- [ ] **FR-013:** Bubble accessibility
      Given any bubble appears
      When the text is rendered
      Then the bubble container has `aria-live="polite"` so screen readers announce it once

### F3 — Audio engine + mute

- [ ] **FR-014:** Mute button always visible
      Given any screen size (including narrow mobile)
      When the toolbar is rendered
      Then the mute button is visible and keyboard-reachable; it does not collapse into a menu

- [ ] **FR-015:** Starts muted
      Given the page has just loaded
      When any sound-producing interaction occurs before the mute button is clicked
      Then no audio plays

- [ ] **FR-016:** Mute toggle
      Given sound is muted or unmuted
      When the visitor clicks the mute button
      Then the audio state flips and a confirmation chime plays on unmute

### F4 — Lullaby Lab (interactive project 1)

- [ ] **FR-017:** Wind the key
      Given the Lullaby Lab window or card is open
      When the visitor clicks or taps the gold key on the music box
      Then the key rotates 360°, the unicorn on top spins, and `playLullaby()` fires if unmuted

- [ ] **FR-018:** Visual-only when muted
      Given sound is muted
      When the key is wound
      Then the key and unicorn animations play with no audio

### F5 — Nightlight Collection (interactive project 2)

- [ ] **FR-019:** Lamp toggle
      Given the Nightlight Collection window or card is open
      When the visitor clicks or taps a lamp
      Then the lamp toggles between off (dim) and on (warm glow + CSS pulse); a click chime plays if unmuted

- [ ] **FR-020:** Multiple lamps
      Given the Nightlight Collection is open
      When it first renders
      Then at least three lamps are present and at least one starts in the "on" state

### F6 — Rattle & Block Toys (interactive project 3)

- [ ] **FR-021:** Rattle shake
      Given the Rattle & Block window or card is open
      When the visitor clicks or taps the rattle
      Then a visual shake animation plays and 3–5 `click()` chimes fire in quick succession (~50 ms apart) if unmuted

- [ ] **FR-022:** Block bop
      Given the Rattle & Block window or card is open
      When the visitor clicks or taps a block
      Then the block bounces up and down and a pitch specific to that block plays via `chime()` if unmuted

### F7 — Dream Delivery Routes (light project)

- [ ] **FR-023:** Route animation on open
      Given the Dream Delivery window or card is opened
      When the window/card becomes visible
      Then an SVG path animates once (stroke-dashoffset) tracing a delivery route with 3–4 labeled stops

- [ ] **FR-024:** Stop tooltips
      Given the route animation has played
      When the visitor hovers over a stop marker
      Then a small tooltip shows the stop name

### F8 — Pip's Growth Chart (light project)

- [ ] **FR-025:** Hover milestone reveal
      Given the Growth Chart window or card is visible
      When the visitor hovers over a chart bar
      Then a tooltip reveals a milestone label for that bar

### F9 — Origin story

- [ ] **FR-026:** Five scroll scenes
      Given the visitor scrolls through the origin story section
      When each scene enters the viewport (IntersectionObserver)
      Then it fades in; each scene has ≤80 words of copy

- [ ] **FR-027:** Sky darkens
      Given the origin story section is visible
      When the visitor scrolls from the first to the fifth scene
      Then the section background gradient interpolates from light sky to deep navy

- [ ] **FR-028:** Night mode sky start
      Given the visitor is already in night mode when the page loads
      When the origin story section renders
      Then the gradient starts at dusk rather than noon

- [ ] **FR-029:** Theme change during story
      Given the visitor toggles the day/night theme while in the origin story section
      When the `pip:theme` custom event fires
      Then the sky gradient updates without a page reload

- [ ] **FR-030:** Lantern flashlight scoped
      Given the visitor is in night mode and in the origin story section
      When the flashlight effect is active
      Then the CSS mask overlay applies only within the story section; a "lights on" button removes it; no other section is masked

### F10 — Guestbook

- [ ] **FR-031:** Submit an entry
      Given the guestbook section has scrolled into view (lazy load)
      When the visitor fills in name (≤32 chars) and message (≤140 chars) and submits
      Then the entry is sent via Supabase RPC; the form resets; the new entry appears in the list

- [ ] **FR-032:** Offline fallback
      Given Supabase is unavailable
      When the visitor submits a guestbook entry
      Then the entry is stored in localStorage; the UI shows "saved locally — Pip will read it later ✦"; no `console.error` is thrown

- [ ] **FR-033:** Rate limiting
      Given a visitor has submitted within the last 5 minutes (localStorage timestamp)
      When they attempt another submission
      Then the form shows a friendly wait message and does not submit

### F11 — Hit counter

- [ ] **FR-034:** Counter increments per unique visit
      Given the visitor has not been counted this session (sessionStorage flag)
      When the page loads
      Then `increment_hit()` RPC is called and the odometer in the toolbar updates; sessionStorage flag is set to prevent recount

- [ ] **FR-035:** Counter fallback
      Given Supabase is unavailable
      When the page loads
      Then a localStorage-only count is displayed; no `console.error` is thrown

### F12 — Day/night toggle

- [ ] **FR-036:** Toggle and persist
      Given the day/night button is clicked
      When the new theme is applied
      Then `data-theme` on `<html>` flips, the button label updates, the value is saved to localStorage, and a `pip:theme` custom event is dispatched

- [ ] **FR-037:** Respects system preference
      Given no saved theme preference in localStorage
      When the page loads
      Then the theme matches `prefers-color-scheme`

### F13 — Chaos Mode

- [ ] **FR-038:** Default small-dose chaos
      Given the page is rendered in normal mode (toggle off)
      When the projects section is visible
      Then 2–3 project window/cards have a 1–3° tilt; the marquee scrolls; occasional glitter appears in the toolbar

- [ ] **FR-039:** Chaos toggle increases chaos
      Given the Chaos Mode toggle is activated
      When the toggle fires
      Then all project windows tilt further (3–8°, from hand-tuned presets), the marquee reverses, extra glitter appears, and the toolbar gets a beveled border; no button or link is broken; no horizontal scroll occurs

- [ ] **FR-040:** Presets not random
      Given Chaos Mode is active
      When the page reloads
      Then the same tilt angles appear (deterministic presets per breakpoint)

### F14 — Easter egg

- [ ] **FR-041:** Bow ×5 triggers egg
      Given the hero section is visible
      When the visitor clicks Pip's bow 5 times within a 1.5-second window
      Then star confetti fires (if not `prefers-reduced-motion`), `playLullaby()` plays (if unmuted), and Pip's "asleep" animation plays

- [ ] **FR-042:** Muted egg message
      Given sound is muted when the bow ×5 sequence completes
      When the egg triggers
      Then Pip's bubble shows "unmute me, i'll sing!! 🎵" instead of playing audio

- [ ] **FR-043:** Source hint
      Given the page HTML is inspected
      When a judge views the source
      Then the comment `<!-- psst… pip's bow is ticklish (×5) -->` is present near the hero

### F15 — Sparkle trail + click sounds

- [ ] **FR-044:** Sparkle trail
      Given `prefers-reduced-motion` is not set
      When the visitor moves the cursor
      Then ✦/✧/⋆/★ characters appear at the cursor position, drift, and fade; throttled to ~25 per second

- [ ] **FR-045:** Click sounds
      Given sound is unmuted
      When the visitor clicks any button or link except the mute button
      Then a short `click()` chime plays via a single delegated listener

### F16 — Responsive layout

- [ ] **FR-046:** Mobile toolbar collapses
      Given the viewport is narrow (phone)
      When the toolbar renders
      Then the mute button remains visible; all other toolbar items collapse into a hamburger menu

- [ ] **FR-047:** Projects as full-screen cards on mobile
      Given the viewport is narrow
      When the projects section renders
      Then projects display as full-screen cards with the Dream OS title bar; no dragging

### F17 — Retro chrome

- [ ] **FR-048:** Marquee present
      Given the page is loaded
      When the toolbar is visible
      Then a scrolling marquee element displays "now playing: Twinkle v2 · zzz edition" using a CSS animation (not the deprecated `<marquee>` tag)

- [ ] **FR-049:** Footer retro elements
      Given the footer is visible
      When rendered
      Then it contains: 88×31 pixel badges, webring navigation links, credits line, and "best viewed at bedtime" text

- [ ] **FR-050:** Image retro frames
      Given any Pip asset image is displayed
      When rendered
      Then it is wrapped in a beveled retro frame with a caption ("pip_avatar_cloud.jpg · 1.2 MB · click to enlarge" style)

### Quality

- [ ] **FR-051:** Zero console errors
      Given the site is loaded in Chrome, Safari, and Firefox
      When a Playwright smoke test runs
      Then no `console.error` or `console.warn` events are recorded during normal user flow

- [ ] **FR-052:** Lighthouse 90+
      Given the Vercel-deployed production build
      When Lighthouse mobile audit runs
      Then Performance, Accessibility, Best Practices, and SEO all score ≥90

## Out of scope

- Server-side rendering (Next.js or any SSR framework)
- Any npm dependency not already approved in the plan
- Freely draggable windows (desktop only uses a tilted CSS grid)
- Konami code snoring mode (cut if time is short; the bow Easter egg is sufficient for the required Easter egg)
- Track 2 characters
- Any tone that is scary, creepy, or gory

## Open questions

None — all questions resolved during brainstorming on 2026-10-18.
