const KEY = 'pip-theme'
const safeGet = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } }

export function initTheme(btn: HTMLButtonElement) {
  const prefersNight = matchMedia('(prefers-color-scheme: dark)').matches
  let theme = safeGet(KEY) ?? (prefersNight ? 'night' : 'day')

  const label = btn.querySelector('.pill-text')

  const apply = () => {
    document.documentElement.dataset.theme = theme
    btn.setAttribute('aria-pressed', String(theme === 'night'))
    if (label) label.textContent = theme === 'night' ? 'Wake Up' : 'Bedtime'
  }

  btn.addEventListener('click', () => {
    theme = theme === 'night' ? 'day' : 'night'
    safeSet(KEY, theme)
    apply()
    document.dispatchEvent(new CustomEvent('pip:theme', { detail: theme }))
  })

  apply()
}
