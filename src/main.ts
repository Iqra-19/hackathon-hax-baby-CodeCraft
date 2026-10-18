import './styles/tokens.css'
import './styles/base.css'
import './styles/toolbar.css'
import './styles/hero.css'
import './styles/about.css'
import './styles/projects.css'
import './styles/story.css'
import './styles/guestbook.css'
import './styles/footer.css'
import './styles/chaos.css'

import { initLordicon } from './modules/lordicon'
import { initTheme } from './modules/theme'
import { initMute } from './modules/audio'
import { initEyes } from './modules/eyes'
import { initSparkles } from './modules/sparkle'
import { initEgg } from './modules/egg'
import { initProjects } from './modules/projects'
import { initStory } from './modules/story'
import { initGuestbook } from './modules/guestbook'
import { initHitCounter, initChaos } from './modules/toolbar'
import { initCompanion } from './modules/companion'

// Sparkle CSS (injected once)
const sparkleStyle = document.createElement('style')
sparkleStyle.textContent = `
  .sparkle {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    color: var(--amber);
    font-size: 14px;
    text-shadow: 0 0 6px var(--glow);
    animation: twinkle .9s ease-out forwards;
    user-select: none;
  }
  @keyframes twinkle {
    to { opacity: 0; transform: translate(var(--drift), 30px) scale(.3) rotate(90deg); }
  }
  .counter-tick { animation: tick-flash .5s ease-out; }
  @keyframes tick-flash {
    0%, 100% { color: var(--amber); }
    50% { color: var(--accent); }
  }
  .pip.snoring-pulse { animation: pulse-glow 1s ease-in-out infinite alternate; }
  @keyframes pulse-glow {
    from { filter: drop-shadow(0 0 8px var(--glow)); }
    to { filter: drop-shadow(0 0 24px var(--accent)); }
  }
  body.snoring .pip { animation: cloud-bob 1s ease-in-out infinite, pulse-glow 0.5s ease-in-out infinite alternate !important; }
`
document.head.appendChild(sparkleStyle)

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!

// Boot all modules
initLordicon()
initTheme($<HTMLButtonElement>('#theme-toggle'))
initMute($<HTMLButtonElement>('#mute-toggle'))
initHitCounter()
initChaos($<HTMLButtonElement>('#chaos-toggle'))

const pip = $<HTMLElement>('#pip')
if (pip) {
  initEyes(pip)
  initEgg(pip.querySelector<HTMLElement>('.bow-hit')!, pip)
}

// ── Wake-up arc ────────────────────────────────────────────
// pip-wakes.mp4 plays once; when it ends (or after 3s fallback)
// the interactive Pip fades in and the speech bubble appears.
const wakeVideo = document.getElementById('pip-wake-video') as HTMLVideoElement | null
const pipFigure = document.getElementById('pip') as HTMLElement | null
const speechBubble = document.getElementById('speech-bubble') as HTMLElement | null
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

function awakenPip() {
  if (!pipFigure) return
  pipFigure.classList.remove('pip--hidden')
  pipFigure.classList.add('pip--visible')
  if (speechBubble) {
    speechBubble.removeAttribute('hidden')
  }
  if (wakeVideo) {
    wakeVideo.classList.add('pip-wake-fadeout')
    setTimeout(() => { wakeVideo.style.display = 'none' }, 850)
  }
}

if (reducedMotion || !wakeVideo) {
  awakenPip()
} else {
  wakeVideo.play().catch(() => awakenPip())
  wakeVideo.addEventListener('ended', awakenPip, { once: true })
  // Fallback: if video stalls or takes too long
  setTimeout(() => {
    if (pipFigure?.classList.contains('pip--hidden')) awakenPip()
  }, 8000)
}

initSparkles()
initProjects()
initStory()
initGuestbook()
initCompanion()

// Welcome back memory (Tier 3)
const VISIT_KEY = 'pip-last-visit'
const safeGet = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }

const lastVisit = safeGet(VISIT_KEY)
if (lastVisit) {
  const pip = document.getElementById('pip')
  if (pip) {
    const banner = document.createElement('div')
    banner.style.cssText = 'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-family:var(--font-retro);font-size:1.1rem;padding:0.5rem 1.5rem;border-radius:99px;z-index:500;animation:entry-slide-in 0.5s ease-out;pointer-events:none;'
    banner.textContent = '✨ Welcome back! Pip missed you!'
    document.body.appendChild(banner)
    setTimeout(() => banner.remove(), 4000)
  }
}
safeSet(VISIT_KEY, new Date().toISOString())
