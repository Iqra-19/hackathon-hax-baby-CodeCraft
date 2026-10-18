const GLYPHS = ['✦', '✧', '⋆', '★', '✨', '💫']

export function initSparkles() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let last = 0
  addEventListener('pointermove', (e) => {
    const now = performance.now()
    if (now - last < 40) return // ~25/sec max
    last = now

    const s = document.createElement('span')
    s.className = 'sparkle'
    s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    s.style.left = `${e.clientX}px`
    s.style.top = `${e.clientY}px`
    s.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}px`)
    document.body.append(s)
    s.addEventListener('animationend', () => s.remove(), { once: true })
  }, { passive: true })
}
