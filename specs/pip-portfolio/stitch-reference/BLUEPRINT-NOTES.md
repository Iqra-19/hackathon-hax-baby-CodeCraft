# Pip Portfolio — Stitch Blueprint Notes

> Extracted from `screen-award-ux.html` (primary) and `screen-award-desktop.html` (secondary).
> These are the visual reference patterns to translate into Vite/TS/CSS. Do NOT copy Tailwind — rewrite as CSS custom properties and modules.

---

## Stitch Project References

| Resource | ID / Path |
|---|---|
| Stitch project | `1293706685272681927` |
| Design system | `assets/42978877d18447a8b4df387263d26c22` |
| Primary blueprint screen | `9875b2f8ddba4b7392b14f797327956e` (`screen-award-ux.html`) |
| Secondary blueprint screen | `1a943d420ae9471e89c36389b9de0fcf` (`screen-award-desktop.html`) |

---

## Color Tokens (extract into `tokens.css`)

```css
:root {
  --cream: #FFF8F1;        /* page background */
  --berry: #A34063;        /* primary brand / CTAs */
  --berry-dark: #812E4C;   /* hover state */
  --berry-ticker: #822a4b; /* marquee strip bg */
  --cocoa: #5C4033;        /* body text */
  --amber: #FFC56B;        /* accent / glow / outlines */
  --lilac: #C9B6E4;        /* secondary accent */
  --blush: #F6C1CC;        /* tertiary accent */
  --sky: #BFD9F2;          /* story section accent */
  --mint: #C5E8D8;         /* easter egg accent */

  /* Amber glow depth tokens — NEVER use grey shadows */
  --glow-card: 0 12px 32px -4px rgba(255, 197, 107, 0.35);
  --glow-strong: 0 0 24px rgba(255, 197, 107, 0.65);
  --glow-halo: 0 0 60px 20px rgba(255, 197, 107, 0.30);
  --glow-btn: 0 4px 12px rgba(255, 197, 107, 0.25);
  --glow-badge: 0 4px 12px rgba(255, 197, 107, 0.30);
}
```

---

## Typography Stack

| Role | Font | Size | Weight |
|---|---|---|---|
| Body | Quicksand | 16px | 500 |
| Headlines (h1–h3) | Fraunces | 56/32/24px | 600 |
| Tagline | Fraunces italic | 18px | 400 |
| Labels, monospace, code | Space Mono | 12/11/10px | 400/700 |
| Pixel/retro decorative | VT323 | variable | — |

Google Fonts import URL:
```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Quicksand:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=VT323&display=swap
```

---

## Background Texture

Star-print wallpaper — 3 radial dots per 70px tile:
```css
body {
  background-image:
    radial-gradient(circle at 10px 10px, rgba(163, 64, 99, 0.035) 1.5px, transparent 1.5px),
    radial-gradient(circle at 35px 35px, rgba(255, 197, 107, 0.04) 2px, transparent 2px),
    radial-gradient(circle at 60px 15px, rgba(163, 64, 99, 0.03) 1px, transparent 1px);
  background-size: 70px 70px;
}
```

---

## Component Patterns

### Win98 Beveled Box (warm amber — not grey)
```css
.win98-box {
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-right: 2px solid #FFC56B;
  border-bottom: 2px solid #FFC56B;
  box-shadow: var(--glow-card);
}
.win98-inset {
  border-top: 2px solid rgba(163, 64, 99, 0.4);
  border-left: 2px solid rgba(163, 64, 99, 0.4);
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  background: #ffffff;
}
.win98-btn {
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-right: 2px solid #A34063;
  border-bottom: 2px solid #A34063;
  background: #FFF8F1;
  box-shadow: var(--glow-btn);
}
.win98-btn:active {
  border-top: 2px solid #A34063;
  border-left: 2px solid #A34063;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: translate(1px, 1px);
}
```

### Holographic Card (About section)
```css
.holo-card {
  border: 3px solid transparent;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(135deg, #FFC56B, #F6C1CC, #C9B6E4, #BFD9F2, #FFC56B) border-box;
  box-shadow: var(--glow-card);
}
```

### Marquee Ticker
```css
@keyframes marquee {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 22s linear infinite;
}
```
Ticker text: `✦ now playing: twinkle v2 · zzz edition · welcome to my corner of the web! ✦ dream weather: 72° & 100% snuggles ✦ bedtime shift: active ✦`

### Float Animation (Pip + speech bubble)
```css
@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-8px) rotate(0.4deg); }
}
.animate-float { animation: floatSlow 5s ease-in-out infinite; }
```

### 88×31 Web Badge
```css
.web-badge-8831 {
  width: 88px; height: 31px;
  font-family: 'Space Mono', monospace; font-size: 9px;
  letter-spacing: -0.02em; line-height: 1;
  text-transform: uppercase; font-weight: 700;
  image-rendering: pixelated;
  display: flex; align-items: center; justify-content: center;
  border-top:   1px solid rgba(255,255,255,0.8);
  border-left:  1px solid rgba(255,255,255,0.8);
  border-right: 1px solid rgba(163,64,99,0.7);
  border-bottom:1px solid rgba(163,64,99,0.7);
  box-shadow: var(--glow-badge);
  transition: transform 0.15s, filter 0.15s;
}
.web-badge-8831:hover { transform: translateY(-1px); filter: brightness(1.1); }
```

### Tape Strip (guestbook)
```css
.tape-strip {
  background: rgba(255, 248, 241, 0.92);
  box-shadow: 0 2px 8px rgba(255, 197, 107, 0.45);
  border-left:  2px dashed rgba(163, 64, 99, 0.25);
  border-right: 2px dashed rgba(163, 64, 99, 0.25);
}
```

---

## Section Structure Blueprint

### 1 — Sticky Toolbar (44px, `bg: #A34063`)
- Left: `✦ Pip's Homepage` in Space Mono bold + version badge `v1.02`
- Center: Marquee strip (darker `#822a4b`, rounded-full, amber border/40)
- Right: Hit odometer → 3 pill buttons (Sound Off / Bedtime / Chaos) → 24px Pip avatar with amber ring
- Odometer: pitch-black bg `#050712`, segmented `#121526` boxes, amber digits, `HITS` label
- Pill buttons: `h-[28px]`, rounded-full, hover amber outline + glow

### 2 — Hero (centered, max-w-5xl)
- Absolute decorations: 🌙 top-right, scattered ✦ ✧ ⋆ in amber/lilac/blush/sky
- Pip: 420px responsive (320→380→420px), `cloud-amber-glow` underneath
- Amber halo: `blur-3xl` radial div behind, pulsing
- Speech bubble: cream bg, 2px berry border, rounded-full, floating, tail at bottom-right
- H1: Fraunces 56px, `#A34063`, with `✦` glyph glowing
- Subtitle: Quicksand 20px, cocoa
- Tagline: Fraunces italic 18px, cocoa, in quotes
- Hint pill: lilac/25 bg, `#C9B6E4` border, Space Mono 12px

### 3 — About (max-w-5xl)
- Section stamp: `01` pill (berry bg, cream text) + Fraunces heading + amber gradient divider
- Holo card: grid 5/7 cols — portrait left, specs right
- Portrait frame: `win98-box` > `win98-inset` > img; Space Mono caption; `★ 1ST ED` badge
- Spec rows: cream bg, amber border/40, berry Space Mono label → cocoa Quicksand value
- Snuggle meter: berry→amber gradient, 94% fill, `0 0 8px #FFC56B` glow

### 4 — Projects "Dream OS 98" (max-w-5xl)
- Section stamp `02` + heading + `C:\MIDNIGHT_NURSERY\PROJECTS> ▋` prompt bar
- White desktop area: 2px amber border, rounded-16px, `glow-amber-card`
- 5 desktop icons (72px): emoji icon + Space Mono label; active = dashed berry border
- Active window: Win98 title bar (`berry→berry-dark` gradient), close/min/max buttons, beveled body

### 5 — Origin Story (section 03)
- Stamp `03` + "The Making of a Dream Engineer" + amber divider
- 5 vertical chronological scene panels, right-rail progress dots (hidden lg)
- Progress dots: active = 14px amber filled + amber ring, inactive = 10px cream with amber border
- **Scene color palette (bg changes per scene — drives the sky darkening effect):**

| Scene | Time stamp | Bg color | Text |
|---|---|---|---|
| 01 | 20:15 PM · PEACH DUSK | `#FDE8DB` | cocoa |
| 02 | 21:30 PM · ROSE TWILIGHT | `#FBD3DC` | cocoa |
| 03 | 23:00 PM · VIOLET DEEPENING | `#E7E1F5` | berry-dark `#812E4C` |
| 04 | 00:30 AM · MIDNIGHT BLUE | `#252D5A` | cream |
| 05 | 02:45 AM · DEEP MIDNIGHT | `#050712` | cream; `pip_dream_lantern` image shown here |

- Scene layout: grid 3/9 cols — icon box left (24×24 rounded-16px, amber border, white bg), text right
- Scene 4 (midnight): icon box uses `bg-[#FFF8F1]/10`
- **Scene 5 (finale):** 2px amber border, `shadow-[0_0_36px_rgba(255,197,107,0.45)]`, amber radial blur behind image, `☀ lights on` pill button in top-right
- Scene 5 image: `pip_dream_lantern.png` with `filter: drop-shadow(0 0 24px #FFC56B)`
- Scene 5 copy ends with: "✦ Officially certified by The Midnight Cloud Academy #0042"

### 6 — Guestbook "Pillow Guestbook" (section 04)
- Stamp `04` + "Pillow Guestbook: Sign Pip's Nursery Wall" + amber divider
- Grid 5/7 cols — form card left, masonry notes right

**Form card (left 5 cols):**
- White card, 16px radius, `glow-amber-card`, amber border/40
- Fraunces heading "sign pip's nursery wall ✦"
- Inputs: `bg-[#FFF8F1]`, `border-2 border-[#FFC56B]/60`, rounded-12px; focus = berry border + amber ring
- Char counter: Space Mono 12px, `0/140`
- Sticker picker: 6 emoji buttons (🌙 ⭐ 🎵 ✦ 💤 🌸), 36px square, rounded-10px; selected = amber border + ring + `shadow-[0_0_12px_#FFC56B]` + `scale-105`
- Submit button: full-width, rounded-12px, berry bg, `shadow-[0_6px_20px_rgba(255,197,107,0.45)]`, amber border, Fraunces semibold, "📌 Pin Note to Nursery Wall"

**Note cards (right 7 cols):**
- Masonry 2-col grid, notes at `±1-3°` rotation (`-rotate-2`, `rotate-2`, `rotate-1`, `-rotate-3`, `rotate-3`, `-rotate-1`, `rotate-2`, `-rotate-2`)
- Note bg colors: `#FEDEE6` blush, `#DCECF9` sky, `#E8E0F7` lilac, `#DBF3E7` mint, `#FFF2D6` butter
- Each note: tape strip `w-16 h-4` centered at `-top-2`; author (Fraunces semibold small, berry); sticker emoji; message (Quicksand 500 13px); timestamp (Space Mono 10px berry)
- `shadow-[0_8px_20px_rgba(255,197,107,0.3)]` on all notes

### 7 — Footer "Peak-End Delight"
- Top border: `border-t-2 border-[#FFC56B]/60`, `bg-[#FFF8F1]`, `pt-12 pb-16`

**88×31 Badge Vault (6 badges):**

| Badge text | Bg | Text color |
|---|---|---|
| MADE W/ ♥ | `#A34063` | `#FFC56B` |
| BEDTIME★OK | `#050712` | `#FFF8F1` |
| PIP APPROVED | `#5C4033` | `#FFC56B` |
| NO SPOOKIES | `#ffffff` | `#A34063` |
| Y2K·READY | `#344d62` | `#FFF8F1` |
| DREAM★CORE | `#812E4C` | `#FFC56B` |

**Webring strip:**
- White, rounded-full, amber border, `glow-amber-card`
- `← [Prev Dream] ✦ [pip's midnight webring #0042] ✦ [Next Dream] →` — Space Mono 12px bold

**Credits block:**
```
Pip character art: haX.baby Track 1 Creator Asset Pack · Fonts: Fraunces, Quicksand, Space Mono
best viewed at bedtime · zzz
© 2026 Pip @ The Midnight Nursery. All dream pillows reserved.
```

**Final goodbye (peak-end rule):**
- Speech bubble pill: "sweet dreams, come back soon ✦" — cream, 2px berry border, rounded-full, amber shadow
- Pip avatar: 64px circle, amber ring-4, `shadow-[0_0_24px_#FFC56B]`, gentle bounce 3s duration

---

## Key Implementation Rules

1. **No grey shadows anywhere** — replace all `box-shadow` with amber-only values
2. **Win98 bevel uses amber for dark edges** — `#FFC56B` for right/bottom (not `#808080`)
3. **Tailwind in Stitch = CSS custom props in our code** — map one-to-one
4. **Stitch has no animations** — all motion is implemented in TS modules and CSS keyframes
5. **Font preconnect goes in `<head>` before fonts link** — speeds up LCP
6. **Pip image uses `filter: drop-shadow` not `box-shadow`** — respects transparent PNG shape
7. **Speech bubble tail**: 12px rotated div at `border-b-2 border-r-2` of bubble color
