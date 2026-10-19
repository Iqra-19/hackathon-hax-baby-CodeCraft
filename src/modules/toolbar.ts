const COUNTER_KEY = 'pip-visits'
const SESSION_KEY = 'pip-session-counted'
const safeGet = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }
const safeGetSession = (k: string) => { try { return sessionStorage.getItem(k) } catch { return null } }
const safeSetSession = (k: string, v: string) => { try { sessionStorage.setItem(k, v) } catch {} }

export function initHitCounter() {
  const el = document.getElementById('counter-digits')
  if (!el) return

  // Only increment once per browser session (tab) — FR-034
  const alreadyCounted = safeGetSession(SESSION_KEY)
  const prevCount = parseInt(safeGet(COUNTER_KEY) ?? '0', 10)
  const count = alreadyCounted ? prevCount : prevCount + 1

  if (!alreadyCounted) {
    safeSet(COUNTER_KEY, String(count))
    safeSetSession(SESSION_KEY, '1')
  }

  // Update individual digit spans in the odometer
  const str = String(count).padStart(6, '0')
  const spans = el.querySelectorAll('span')
  if (spans.length === 6) {
    spans.forEach((span, i) => { span.textContent = str[i] })
  } else {
    el.textContent = str
  }
}


import { pipSpeak } from './companion'
import { chime } from './audio'

export function initChaos(btn: HTMLButtonElement) {
  let active = false
  const label = btn.querySelector('.pill-text')

  const apply = () => {
    document.documentElement.dataset.chaos = String(active)
    btn.setAttribute('aria-pressed', String(active))
    if (label) label.textContent = active ? 'Sane' : 'Chaos'

    // Assign tilt to each desktop icon
    document.querySelectorAll<HTMLElement>('.desktop-icon').forEach((icon, i) => {
      icon.style.setProperty('--icon-delay', `${(i * 0.15).toFixed(2)}s`)
    })
  }

  btn.addEventListener('click', () => {
    active = !active
    apply()
    if (active) {
      chime(1046)
      pipSpeak('WAHOO!! MAXIMUM CHAOS ACTIVATED!! ⚡', 4000)
    } else {
      chime(523)
      pipSpeak('whew… nice and cozy again! ☁️', 3500)
    }
  })

  apply()
}

