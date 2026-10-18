const COUNTER_KEY = 'pip-visits'
const safeGet = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }

export function initHitCounter() {
  const el = document.getElementById('counter-digits')
  if (!el) return

  const count = parseInt(safeGet(COUNTER_KEY) ?? '0', 10) + 1
  safeSet(COUNTER_KEY, String(count))

  // Update individual digit spans in the odometer
  const str = String(count).padStart(6, '0')
  const spans = el.querySelectorAll('span')
  if (spans.length === 6) {
    spans.forEach((span, i) => { span.textContent = str[i] })
  } else {
    el.textContent = str
  }
}

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
  })

  apply()
}
