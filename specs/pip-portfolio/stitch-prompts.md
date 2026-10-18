# Stitch Design Prompts — Pip's Homepage @ Midnight Nursery

> **How to use:** New Stitch project → Web → paste the master prompt. Then add each follow-up as its own separate edit (one screen at a time). Screenshot every version you like — Stitch can reset.  
> After export: hand HTML to Claude Code as visual reference — "Match this layout, tokens, and interaction states in vanilla TS + CSS tokens; don't copy Tailwind classes."
>
> **Prompt budget:** Stitch drops components above ~5,000 chars. Each prompt here is sized to fit.

---

## UX thesis (read before designing)

This is not a portfolio — it's a greeting. Every UX decision answers: "how does a judge feel in the first 3 seconds, the peak moment, and the very last moment?" (Peak-end rule, Laws of UX). The peak is the wake-up. The end is Pip saying goodnight. Everything between serves those two moments.

**Five rules that govern every screen:**
1. Beauty first — aesthetic-usability effect means a charming first screen earns forgiveness for everything after
2. < 100 ms feedback on every click — Doherty threshold; nothing that makes you wait
3. One light source: amber glow only — no grey shadows anywhere on the page
4. Motion must mean something — each animation answers "what changed and where did it come from"
5. Reduced motion = fades not nothing — the site remains delightful at 0 animation

---

## MASTER PROMPT — Full page, awake state (paste this first)

Design the complete landing page for "Pip's Homepage @ Midnight Nursery" in its primary awake, day-mode state. This is the poster version — the moment a judge lands and Pip has already woken up to greet them.

**CHARACTER — Pip (NEVER spooky, gothic, or Halloween):**
Pip is a soft pastel vinyl toy skull-baby: smooth round pale skull, big warm amber-glowing eye sockets with tiny amber pinpricks for pupils, tiny sweet crooked smile, cream nightcap covered in gold stars with a small pink bow, pale cloud-print pajamas, floating on a fluffy white cloud. Job: Junior Dream Engineer at the Midnight Nursery. Tagline: "I build the dreams you fall asleep inside." Always cozy, curious, clumsy, and giggly — never creepy.

**DESIGN SYSTEM:**
- Background: warm cream #FFF8F1 with a faint repeating star-print nursery wallpaper texture (3% opacity)
- Cards: pure white #FFFFFF
- Primary — Berry: #A34063 (buttons, retro title bars, links)
- Text — Cocoa: #5C4033
- Glow — Amber: #FFC56B (the ONLY accent light source; all glows are amber)
- Supporting: Lilac #C9B6E4 · Blush #F6C1CC · Sky #BFD9F2
- Headlines: Fraunces serif (soft editorial, weight 600, optical size large)
- Body: Quicksand / Fredoka rounded sans (weight 500)
- Retro chrome: Space Mono / VT323 (marquee, counters, window titles, captions)
- Shape mix: soft 16px-radius cards AND crisp Win98-bevel windows (0 radius, 2px top-left highlight #dfdfdf, bottom-right shadow #808080, berry gradient title bar)
- Shadows: amber glow only — box-shadow: 0 12px 32px -4px rgba(255,197,107,0.35). Zero grey shadows.

**STICKY TOOLBAR (top, full width, berry #A34063 bg, h=44px):**
- Left: pixel-font logo "✦ Pip's Homepage" in cream, Space Mono, 16px
- Center: CSS marquee strip (amber #FFC56B text, darker berry bg): "✦ now playing: twinkle v2 · zzz edition · welcome to my corner of the web! · visitors today: cozy · ✦"
- Right cluster: 6-digit mechanical odometer "000 042" (Space Mono, amber digits on black segments, glowing), then three compact pill buttons — 🔇 Sound Off | ☾ Bedtime | ✦ Chaos — cream text, 28px height, berry bg
- Far right: circular crop of Pip's face (24px), subtle amber ring

**HERO (cream bg, 96px padding, centered):**
- Pip illustration: large (420px wide), floating, looking slightly toward cursor. Cloud has a gentle ambient drop glow (amber, 0 0 40px 10px rgba(255,197,107,0.3))
- Speech bubble: pill-shape, cream #FFF8F1 fill, 2px berry border, Quicksand 16px — "oh! a visitor! it was getting so quiet in here. ✦" — positioned top-right of Pip, with a tail pointing to her right
- Headline: Fraunces 56px/600 weight, cocoa brown — "Hi, I'm Pip! ✦"
- Subtitle: Quicksand 20px/500 — "Junior Dream Engineer · Midnight Nursery"
- Tagline: Fraunces italic 18px cocoa/70% — "I build the dreams you fall asleep inside."
- Small Easter egg hint below (Space Mono 12px, lilac): "psst… pip's bow is ticklish 🎀"
- Background: crescent moon illustration (top-right), scattered ✦ ✧ ⋆ stars at varying sizes and 30-60% opacity
- INTERACTION STATES shown as annotations: cursor near Pip → eyes follow; bow button hover → scale 1.05, amber glow pulse

**ABOUT (white card, 16px radius, amber glow shadow):**
- Layout: 2-col — left: retro beveled photo frame with Pip portrait + caption in Space Mono "pip_portrait.jpg · 892 KB · click to enlarge ↗"; right: character stat sheet
- Stats in Quicksand 15px, berry labels, cocoa values:
  SPECIES: Dream Skull Baby
  LOOK: round skull · amber eyes · gold-star nightcap · pink bow · cloud pajamas
  VIBE: curious · sleepy · clumsy · giggles at everything · hates silence
  JOB: Junior Dream Engineer, Midnight Nursery
  LOVES: lullabies · nightlights · soft rattles · counting stars · almost staying awake

**PROJECTS SECTION header (retro chrome):**
Section title in Space Mono: "C:\MIDNIGHT_NURSERY\PROJECTS>" with blinking cursor

Show 5 desktop icons in a soft grid (each 80px): Lullaby Lab · Nightlight Collection · Dream Delivery Routes · Rattle & Block Toys · Pip's Growth Chart. Icons use pixel art style with label below in Space Mono 11px. Hover state: icon lifts 4px + amber glow ring.

**DESIGN PHILOSOPHY visible in layout:**
Every section reveals staggered (40–60ms between children). Cards enter at scale 0.96, ease-out 250ms. The amber glow is the page's single consistent light source. No element uses a grey shadow.

Make this feel like a master UX engineer's finest work: warm, intentional, every pixel earning its place.

---

## FOLLOW-UP SCREENS

Add these one at a time. Screenshot before each new edit.

---

### Screen 1 — Pip: Arrival (asleep state)

**UX rationale:** Peak-end rule — the arrival state is the "before" to the wake-up's "after." Disney anticipation principle: compress before expanding.

Show the hero section with Pip in her asleep state:
- Eyes: two soft curved lid shapes (pale skull-tone crescents) covering the amber pinpricks completely — no glow visible
- "z z z" letters float above her nightcap in lilac, ascending and fading, Space Mono font, staggered sizes (z · z · Z)
- Speech bubble absent
- The hero background is 15% dimmer than normal (overlay: rgba(27,31,59,0.08))
- Cloud still has its ambient form, but the amber halo glow is off
- Headline and tagline still visible below, slightly reduced opacity (80%)
- Add annotation label: "→ state: ASLEEP (on arrival / after 60s idle)"

Keep toolbar, about section, and everything else identical to the master screen.

---

### Screen 2 — Pip: The Wake-Up Peak (the most important screen)

**UX rationale:** This is THE peak moment — the one a judge will remember (peak-end rule). Disney squash-and-stretch + follow-through. Doherty threshold: response must feel within 100ms.

Show the exact mid-wake-up frame (≈ 350ms into the arc):
- Pip's body: very slightly stretched upward (scaleY 1.04) and narrowed (scaleX 0.97) — startled stretch
- Eyes: lids halfway open, amber glow at 100% brightness and slightly oversized (the overshoot moment before settling) — this is the brightest amber glow appears anywhere in the design
- Pupils: locked toward the right (toward where cursor would be), saccade position
- Nightcap: tilted 3° right, lagging behind the body's upward stretch (follow-through)
- Speech bubble: just beginning to appear — scale 0.92, origin at Pip's right, partial opacity (60%) — the spring hasn't finished yet
- Stars around Pip: a few ✦ scattered at varying opacities as if startled by the wake
- The amber cloud glow is at maximum intensity: 0 0 60px 20px rgba(255,197,107,0.55)
- Add annotation: "→ state: WAKING (peak moment, ≈350ms after first interaction)"
- Small annotation timeline at bottom: [ ASLEEP ] → [ squash 0-120ms ] → [ lids open 120-300ms ] → [ ★ PEAK ← you are here ] → [ wiggle 350-750ms ] → [ bubble 600-850ms ] → [ AWAKE ]

---

### Screen 3 — Pip: Idle (fully awake, settled)

**UX rationale:** Secondary action principle (Disney) — Pip lives even while you scroll. Eyes that wander feel like a mind; eyes that only track feel like a gadget.

Show Pip fully awake and settled, mid-idle:
- Eyes: amber glow at 85% (settled from overshoot), pupils centered-left (as if glancing at a star)
- Nightcap: perfectly upright, bow slightly to one side
- Breathing: show the cloud very slightly expanded (scaleY 1.012) — annotate "breathing: 3.2s ease-in-out"
- Cloud: translated 3px upward from rest — annotate "cloud bob: 4s, offset from breathing"
- Speech bubble absent (dismissed after 4 seconds)
- One idle thought: tiny star ✦ glowing softly near her gaze direction
- Add annotation: "→ state: IDLE (after bubble dismisses, every 8s eyes drift to a star)"
- Below Pip, show the cursor interaction callout: "👁 eyes follow cursor with lerp 0.18 · head turns 1-2° · glow +10% when cursor near face"

---

### Screen 4 — Toolbar Detail + All Button States

**UX rationale:** Frequency decides animation (Kowalski) — toolbar buttons fire constantly, so feedback must be instant (100ms) not choreographed. Every control needs a visible hover, active, and focus state.

Full-width horizontal toolbar exploded view at 2× size. Show every control in all states side by side:

MUTE BUTTON:
- Default: 🔇 Sound Off (cream text, berry bg, 28px height, 12px radius)
- Hover: bg lightens to berry+8% lightness, scale 1.02, 100ms
- Active/pressed: scale 0.97, bg darkens, 100ms
- Unmuted variant: 🔊 Sound On (same sizing, amber glow ring)
- Focus: 2px cream outline offset 2px (visible keyboard ring)

THEME TOGGLE:
- Day: ☾ Bedtime (moon icon, berry bg)
- Night: ☀ Wake Up (sun icon, navy bg with cream text)
- Hover: same scale/lightness rules
- Transition annotated: "400ms crossfade on bg + text"

CHAOS TOGGLE:
- Default: ✦ Chaos (normal)
- Active: ✦ CHAOS! (glitter starburst bg, slight rotation ±1°)

ODOMETER:
- 6 digit segments, each: black bg, amber digit, subtle top-to-bottom gloss gradient
- Active counting: one digit mid-flip shown (rotateX 90deg partial)
- Label below in Space Mono 10px: "visitors"

MARQUEE:
- Show the full marquee text in amber on darker-berry strip
- Text repeating, annotated: "CSS animation: scroll-left, 20s linear infinite"

---

### Screen 5 — Projects: Dream OS Desktop (full section)

**UX rationale:** Spatial consistency (Rauno Freiberg) — windows must open from their icon's position; the eye traces the origin. Fidgetability: icons invite clicking just by being there.

Show the full Projects section as the Dream OS desktop:
- Section background: very faint nursery wallpaper + subtle grid (like old Windows desktop)
- 5 desktop icons in a 3+2 soft grid layout:
  - Lullaby Lab 🎵 (music note pixel icon)
  - Nightlight Collection 🌙 (lamp pixel icon)
  - Dream Delivery Routes 📦 (cloud+arrow pixel icon)
  - Rattle & Block Toys 🎲 (blocks pixel icon)
  - Pip's Growth Chart 📊 (ruler pixel icon)
- Each icon: 72×72px area, pixel art icon 48px, Space Mono label 11px below
- Icon states side by side as annotations:
  - Default: normal
  - Hover: translateY -4px (100ms), amber glow ring 0 0 12px rgba(255,197,107,0.5)
  - Active: translateY 0, scale 0.96
  - Double-click indicator: small "double-click to open" tooltip in Space Mono 10px
- Small retro label top-left of section in Space Mono: "C:\MIDNIGHT_NURSERY\PROJECTS> ▋"
- One window (Lullaby Lab) shown open at the side at 30% opacity to hint it's available

---

### Screen 6 — Lullaby Lab Window (open state)

**UX rationale:** Origin-aware animation — window scales from its icon position. Doherty: opens in < 300ms. Fidgetability: every key and button invites touching.

Show the Lullaby Lab retro window fully open, centered, on top of the desktop:
- Window chrome: 0 radius, berry gradient title bar (#A34063 → #812E4C), white Fraunces text "Lullaby Lab 🎵 · lullaby_lab.exe", right-aligned control cluster [─] [□] [×] with 2px bevel each
- Window body: white bg, 24px padding
- Left half: beveled photo frame around pip_lullaby_box.jpg render. Caption below in Space Mono 11px: "pip_lullaby_box.jpg · 924px · click to enlarge ↗"
- Right half, top to bottom:
  - Big round "🔑 Wind the Key" button (64px diameter, berry bg, cream icon, amber glow on hover, rotates 360° on click)
  - 8 pastel note keys in a row like a tiny xylophone (each 32×80px, rounded bottom, colors: C=blush, D=sky, E=lilac, F=amber, G=mint, A=lavender, B=peach, C2=cream). Hover: key depresses 4px, plays note
  - Tempo slider: labeled "♩ tempo" in Space Mono, thumb is a small star ✦
  - Status label in Space Mono 11px, amber text: "► playing: twinkle_v2.mid"
- Window has amber glow shadow (the "active window" state)
- Behind window: other 4 icons dimmed to 40%
- Annotation: "→ window scales from icon origin · open in 250ms spring · close reverses from current state (interruptible)"

---

### Screen 7 — Nightlight Collection Window

Show the Nightlight Collection retro window open:
- Title bar: "Nightlight Collection 🌙 · pip_lamps.exe"
- Content: 6-lamp grid (3×2), each lamp is a card (white, 12px radius, amber glow if on):
  - Lamp 1: pip_dream_lantern.jpg in a small beveled frame, label "Dream Lantern" — ON state (amber halo glow, warm cream overlay)
  - Lamp 2–6: illustrated simple lamps (bell jar, mushroom, star, crescent, cloud shapes) — 3 on, 2 off
  - ON state: amber glow ring + inner warm tint overlay
  - OFF state: desaturated, grey ring, dim
  - Toggle switch on each card: pill toggle (off=grey, on=amber), 24px wide
- Below grid: Space Mono 11px label "3 of 6 lights on · amber mode"
- Hover state annotation on lamp card: "hover → scale 1.03, 100ms ease-out · toggle → 150ms fade"

---

### Screen 8 — Rattle & Block Toys Window

Show the Rattle & Block Toys retro window:
- Title bar: "Rattle & Block Toys 🎲 · rattleblocks.exe"
- Left half: large pastel rattle illustration (rounded handle, spherical head with dots). Below: "🔔 Shake Me!" button (berry bg, cream text, 48px height). Shake state annotation: "→ click: rapid ±8° rotation, 3 micro-tremors 50ms apart"
- Right half: stack of 3 wooden alphabet blocks spelling P-I-P (each 72×72px, wood-grain texture, different pastel face per side: P=berry, I=sky, P=lilac). Below blocks: [+ Stack Block] button and score "Stack height: 3 ✦". Hover on block: block rises 6px + casts amber glow shadow beneath it. Click: block bounces up 12px spring and settles.
- Sound annotation: "🔊 shake = 3-5 noise bursts · block hit = chime at block's pitch (C/E/G)"

---

### Screen 9 — Origin Story: 5 Scroll Scenes

**UX rationale:** IntersectionObserver reveals each scene at threshold 0.3. Sky gradient as emotional arc — sky lightens optimism → darkens solitude → lantern glow = hope found.

Show 5 story panels stacked vertically (each ≈ 400px tall), sky gradient progressing:

Scene 1 — "peach dusk sky" (#f4c6a0 → #f8ede0): A moonbeam falls into a cozy nursery room. Soft illustrated moonbeam angle. Caption in Quicksand italic, max 60 words.
Scene 2 — "rose-peach to dusty violet" (#d4a5c9 → #8b6b9a): Baby Pip wakes in a cradle made of clouds. Her eyes just opening, z z z still fading above.
Scene 3 — "violet to twilight" (#5c4a8a → #2d3561): Pip sits in the dark nursery. Her eye sockets dim, a tiny sad mouth curve. "it was too quiet."
Scene 4 — "deep twilight" (#1f2545 → #0d1226): Pip hammers tiny bolts on a pink music box. Amber sparks fly. Focused, determined expression.
Scene 5 — "near-black navy" (#050712): Pip in a graduation mortarboard (star-topped), holding her lantern, standing on a cloud. Amber lantern glow illuminates the scene — radial glow, circular, warm. "Junior Dream Engineer, certified." Small "lights on" button bottom-right in Space Mono.

Progress dots on right rail: 5 dots, active dot = amber fill, inactive = outline. Active dot pulses softly.
Annotation on scene 5: "→ night mode here: CSS mask creates flashlight cursor effect (radial-gradient transparent center)"

---

### Screen 10 — Guestbook + Footer

**UX rationale:** Sticky notes as physical artifacts make the guestbook feel like a real nursery wall. Rate limiting protects Pip's wall without harsh error messages.

GUESTBOOK SECTION:
- Section background: cream with faint star-print wallpaper, stronger than hero
- Form card (white, 16px radius, amber glow shadow):
  - Headline in Fraunces 28px: "sign pip's nursery wall ✦"
  - Name field (max 32 chars): rounded input, berry focus ring
  - Message field (max 140 chars): textarea, char counter "0/140" in Space Mono 11px
  - Sticker picker: 6 large emoji buttons (🌙 ⭐ 🎵 ✦ 💤 🌸), selected = amber glow ring + scale 1.15
  - Submit button: full-width, berry bg, cream text, Fraunces "Leave a note ✦"
  - Rate limit state (shown as variant): gentle message "pip needs a little nap first… try again in 5 mins 💤"
- Sticky note wall below form: 8 notes in a masonry grid, each rotated ±2–4° (deterministic, not random). Note colors: blush, sky, lilac, mint. Each note: name in Fraunces 14px/600, message in Quicksand 13px, sticker 20px, date in Space Mono 10px gray. Notes have a small top tape strip in cream.

FOOTER:
- Six 88×31 pixel badges (true size, 1px inner border, pixel typography):
  "made with love ♥" | "best viewed at bedtime" | "pip approved ✦" | "no cookies" | "Y2K compliant" | "powered by dreams"
- Webring strip: ← [pip's webring] → arrows in pixel style, label in Space Mono
- Credits in Space Mono 11px, cocoa, centered: "Pip art: haX.baby Track 1 asset pack · Fonts: Google Fonts · Confetti: canvas-confetti"
- "best viewed at bedtime · zzz" in VT323/Space Mono, centered, lilac, 14px
- Final element: small Pip face (32px) with a tiny wave hand, speech bubble "sweet dreams, come back soon ✦" — this is the END of the page, designed deliberately (peak-end rule: last thing a judge sees)

---

### Screen 11 — Night Mode (dark theme, Tier 2 showpiece)

**UX rationale:** The flashlight cursor is a Tier 2 showpiece. It must feel like magic — holding Pip's lantern.

Show the full page in night mode, plus the lantern flashlight cursor effect on the story section:
- Theme: bg #1B1F3B navy, cards #262B52, text #F4EAD9 warm cream, links/accent #FF8FB1 soft pink, amber glow unchanged
- Toolbar: deeper navy bg, same structure
- Hero: Pip with stronger amber glow (the only light in the dark room), stars more visible and slightly twinkling
- Story section with flashlight: a dark overlay (#0b0d1f) covers the section. A radial-gradient transparent circle (180px radius) around the cursor position reveals the scene beneath — as if you're holding Pip's lantern. Outside the circle: near-black. Inside: the scene lit warm.
  - "lights on ☀" button: small, Space Mono, bottom-right, removes overlay on click
- Pip's speech bubble in night mode: "#FF8FB1 pink border, navy bg, cream text"
- Show theme transition annotation: "400ms crossfade on all bg/text/border properties"
- All text pairs remain WCAG AA (contrast ratios noted: cream on navy 13.49:1 ✓ · pink on navy 7.52:1 ✓)

---

### Screen 12 — Chaos Mode (side quest: +5 points)

**UX rationale:** Chaos reads as hand-built, joyful surprise. Deterministic tilts (not random) so it looks the same on every reload — that's what separates craft from noise.

Show the Projects section in chaos mode active:
- All 5 project windows are now open simultaneously, overlapping at playful deterministic angles:
  - Lullaby Lab: −6° rotation
  - Nightlight: +4°
  - Dream Delivery: +8°
  - Rattle & Blocks: −3°
  - Growth Chart: +2°
- Glitter star stickers (✦ ✧ ★) scattered over the desktop bg at 3–4 fixed positions
- A second marquee strip below the toolbar (amber bg, black text): "★ CHAOS MODE ACTIVATED ★ pip is feeling chaotic today ★ hold on ★"
- "NEW! ★" starburst badge (blush pink, red outline) on one window title bar
- Blinking "under construction 🌙" moon sticker on the desktop bg
- Chaos toggle button in toolbar: now showing active state (glitter bg, ±1° rotation, amber outline)
- ALL buttons still accessible, no window title bars covered
- No horizontal scroll — layout stays within viewport
- Annotation: "tilts are hand-tuned presets, NOT random — identical on every reload"

---

### Screen 13 — Mobile 390px

**UX rationale:** Mobile-first means touch targets ≥ 44px, no hover-only interactions, toolbar never collapses the mute button.

Show the complete page at 390px viewport width, all sections:

TOOLBAR (collapsed):
- Left: "✦ Pip" logo only (shortened), Space Mono
- Center: mute button 🔇 ALWAYS VISIBLE (44px touch target, never collapses)
- Right: hamburger menu icon (☰) — contains theme + chaos toggles

HERO:
- Pip fills 85% of viewport width
- Speech bubble repositioned below Pip (not beside, no room)
- Headline Fraunces 34px (fluid clamp from 56px → 34px)
- Stars sparser

PROJECTS:
- Dream OS windows become full-width stacked cards (no tilts, no dragging)
- Each card: full width, 16px radius, win98-style title bar still present (dragging disabled on mobile)
- Stacked vertically with 16px gap

STORY:
- Scenes full-width, taller (500px each)
- Progress dots on bottom (not right rail)

GUESTBOOK:
- Form full-width, stacked inputs
- Sticky notes: 2-column grid, smaller

FOOTER:
- Badges wrap to 3×2 grid
- Webring strip still present

DOCKED PIP (mobile only):
- Small Pip face (48px) fixed bottom-right, above navigation area
- Speech bubble anchored above it (aria-live, reads to screen readers)
- Tap Pip → she wiggles and says something encouraging

---

### Screen 14 — "Goodnight" Ending (the peak-end closer)

**UX rationale:** Peak-end rule — the very last thing a judge sees determines their memory of the experience. This screen is as important as the hero. Designed deliberately, not as an afterthought.

Show the footer-to-ending transition:

After submitting a guestbook entry OR reaching the footer after a full scroll, trigger the goodnight sequence:
- Pip's docked toolbar avatar grows from 24px to 64px (scales up with --spring-soft, origin bottom-right)
- A large speech bubble appears: "you visited!! pip is so happy ✦ sweet dreams, come back soon 💤"
- Pip's pose: a gentle wave animation (arm raises slightly), eyes doing a happy squint (curved lid crescents, but with a smile — happy closed, not sleepy closed)
- The page gets a very subtle warm amber wash overlay (rgba(255,197,107,0.04)) — the whole page feels golden for 2 seconds
- Three ✦ sparkles drift upward from Pip
- A small "zz" floats after the sparkles — she's happy but sleepy
- Auto-dismisses after 5 seconds OR on any click
- Annotation: "→ triggered by: guestbook submit success OR reaching footer after 60s+ scroll · fires once per session (sessionStorage flag)"
- Show both states side by side: "triggered" and "dismissed (Pip small again, waving)"

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Pip looks spooky or gothic | Add: "Pip is a pastel soft vinyl toy, like a Sonny Angel figure, never a real skull. Bedtime cozy, never Halloween." |
| Theme drifts across screens | Re-paste only: COLOR + TYPOGRAPHY + UI STYLE blocks with "Apply to all screens, keep layouts unchanged." |
| Stitch drops components | Prompts > 5,000 chars lose components. Trim or split into two screens. |
| Amber looks orange/harsh | Specify: "Amber #FFC56B is a soft butter-gold, warm and gentle, not neon or electric." |
| Windows look like real Win98 | Add: "Windows-98 style is the inspiration but softened — 16px radius on the outer window, bevel only on the title bar controls." |
| Grey shadows appearing | Add: "Zero grey drop-shadows anywhere. All depth comes from amber glow: rgba(255,197,107,0.35) only." |
