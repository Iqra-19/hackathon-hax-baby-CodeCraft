# Pip's Portfolio — haX Baby's First Website Hackathon 2026

A 48-hour hackathon submission for [hax.baby](https://hax.baby/baby-problem). Built for **Track 1: Pip the Skull Baby**, a character portfolio for a Junior Dream Engineer with a locked identity and complete creative freedom on style and storytelling.

**Event dates:** October 17-19, 2026 · Kickoff and freeze at 17:17 IST each day  
**Team size:** Solo or 2-3 person squad  
**Prize pool:** $400 total (1st $160 / 2nd $120 / 3rd $80 / 4th $40)

---

## What we built

A single-page interactive portfolio for Pip, a tiny skull baby who dreams of becoming a Junior Dream Engineer. The site leans into early-web nostalgia (marquees, hit counters, retro chrome) while layering in modern touches: cursor-tracking eyes, generative chimes, draggable project windows, a scroll-driven origin story, and a Supabase-backed guestbook.

---

## Hackathon requirements

| Requirement | Status |
|---|---|
| Character identity introduction | Hero section with animated Pip |
| Projects / work section (min 3) | Dream OS draggable windows |
| Origin or journey narrative | Scroll-driven storybook scenes |
| Mouse tracking | Cursor-following pupils |
| Click sounds with mute toggle | Web Audio chimes, always-visible mute |
| Mobile-friendly responsive design | Fluid layout, gyro/touch fallback for eyes |
| One hidden Easter egg | Konami code + bow tap sequence |

---

## Judging rubric

| Criterion | Weight |
|---|---|
| Functionality and Polish | 35% |
| Early-Web Soul | 30% |
| Creativity and Surprises | 20% |
| Clean Craft (responsive, accessible, fast) | 15% |

**Side quests:** Chaos mode (+5), click sounds + mute (+3), guestbook (+2), sparkle trail (+2), hit counter (+1)

---

## Stack

- **Language:** TypeScript 5 (strict mode)
- **Build / Dev:** Vite 5 · `npm run dev` · `npm run build`
- **Styling:** Plain CSS with custom properties
- **Motion:** CSS animations + IntersectionObserver · GSAP ScrollTrigger for the Dream Delivery section
- **Audio:** Raw Web Audio API
- **Backend:** Supabase (guestbook + hit counter, anon key only, RLS enabled)
- **Deploy:** Vercel

---

## Project structure

```
src/
├── main.ts                 boots all modules
├── modules/
│   ├── theme.ts            day / night toggle
│   ├── audio.ts            Web Audio chimes and click sounds
│   ├── eyes.ts             cursor-tracking pupils + gyro / touch
│   ├── sparkle.ts          sparkle trail
│   ├── egg.ts              Easter eggs: bow tap x5, Konami code
│   ├── projects.ts         Dream OS draggable windows
│   ├── story.ts            scroll scenes + flashlight cursor
│   ├── guestbook.ts        Supabase guestbook
│   ├── companion.ts        Pip companion interactions
│   └── toolbar.ts          hit counter + chaos mode
└── styles/
    ├── tokens.css          all design tokens (day / night / chaos themes)
    ├── base.css            reset, typography, layout helpers
    ├── toolbar.css
    ├── hero.css
    ├── about.css
    ├── projects.css
    ├── story.css
    ├── guestbook.css
    ├── footer.css
    └── chaos.css           chaos mode overrides

public/assets/              Pip WebP / AVIF images (transparent cut-outs)
index.html                  single page, 7 sections
```

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The Supabase backend requires environment variables for the guestbook and hit counter; the rest of the site runs fully offline.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Ground rules

- Sound must include a visible mute control (always keyboard-reachable)
- All art and audio sources must be credited in the footer
- Pip is never scary, creepy, or gory: gentle · curious · sleepy · clumsy · giggly
- Every effect respects `prefers-reduced-motion` and the mute state
- Text capped at 150 words per section or story scene
