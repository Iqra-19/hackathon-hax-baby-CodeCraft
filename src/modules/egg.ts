import confetti from 'canvas-confetti'
import { playLullaby } from './audio'

export function initEgg(bow: HTMLElement, pip: HTMLElement) {
  let taps = 0
  let timer = 0

  bow.addEventListener('click', (e) => {
    e.stopPropagation()
    taps++
    clearTimeout(timer)
    timer = window.setTimeout(() => { taps = 0 }, 1500)

    // Wiggle on every tap
    pip.classList.add('wiggle')
    setTimeout(() => pip.classList.remove('wiggle'), 350)

    if (taps < 5) return

    // 🎉 Easter egg triggered
    taps = 0
    pip.classList.add('asleep')
    playLullaby()

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4 },
        shapes: ['star'],
        colors: ['#ffc56b', '#a34063', '#c9b6e4', '#fff8f1', '#ff8fb1'],
      })
    }

    setTimeout(() => pip.classList.remove('asleep'), 6000)
  })

  // Konami code → snoring mode
  const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ]
  let konamiIdx = 0

  addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0
        activateSnoringMode()
      }
    } else {
      konamiIdx = 0
    }
  })

  function activateSnoringMode() {
    document.body.classList.add('snoring')
    playLullaby(0.6)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['star', 'circle'],
        colors: ['#ffc56b', '#a34063', '#c9b6e4', '#1b1f3b', '#ff8fb1'],
      })
    }
    setTimeout(() => document.body.classList.remove('snoring'), 8000)
  }
}
