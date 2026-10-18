# Notes: Pip's Portfolio

Append-only decision log. Most recent entries at the top.

---

## 2026-10-18 — Brainstorming complete, spec approved

Full brainstorming session completed with Amin Tai. All major decisions locked:

- Centerpiece: wake-up arc (asleep → startled → delighted), not just eyes that follow cursor
- Pip as persistent host throughout visit (idle "still there?", project comments, guestbook reaction, doze at 60s)
- Closed CSS lids instead of dark sockets (creep prevention); fallback: dimmed 15% pinpricks if lids don't look right by hour 4
- Projects locked: Lullaby Lab + Nightlight + Rattle & Block (interactive); Dream Delivery + Growth Chart (light)
- Dream Delivery moved to light after identifying scroll-within-scroll conflict with Dream OS window format
- Chaos Mode: visible small-dose by default; hand-tuned presets, not Math.random
- Lantern flashlight scoped to origin story section only; rest of page stays readable
- Supabase RPCs defined: increment_hit(), insert_guestbook() — no direct table writes
- Return visit detection via localStorage covers both UX and Tier 3 visitor-memory requirement
- Webring: placeholder links, swap real URLs in P5 if sibling entries publish
- Pip's pronoun: she/her (third person), I/me (when Pip speaks)
- Copy: ~1,000 words, all in src/content/pip-copy.ts, drafted before module code

Design doc at specs/pip-portfolio/design.md.
Spec approved: 2026-10-18.
