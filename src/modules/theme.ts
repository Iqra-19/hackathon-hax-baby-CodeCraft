import { pipSpeak } from './companion'
import { chime } from './audio'

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

    const pip = document.getElementById('pip')
    if (theme === 'night') {
      chime(523)
      pipSpeak("yawn… bedtime shift begins! sweet dreams… 🌙", 4000)
    } else {
      chime(784)
      if (pip) {
        pip.classList.add('wiggle')
        setTimeout(() => pip.classList.remove('wiggle'), 350)
      }
      pipSpeak("good morning, little dreamer! ready to build! ☀️", 4000)
    }
  })

  apply()
}

