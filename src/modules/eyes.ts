export function initEyes(root: HTMLElement, maxShift = 7) {
  const pupils = [...root.querySelectorAll<HTMLElement>('.pupil')]
  let raf = 0

  const look = (x: number, y: number) => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      for (const p of pupils) {
        const r = p.getBoundingClientRect()
        const ang = Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2))
        const dist = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2))
        const clamped = Math.min(dist / 100, 1) * maxShift
        p.style.setProperty('--dx', `${Math.cos(ang) * clamped}px`)
        p.style.setProperty('--dy', `${Math.sin(ang) * clamped}px`)
      }
    })
  }

  addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true })
  addEventListener('pointerdown', (e) => look(e.clientX, e.clientY), { passive: true })

  // Gyroscope fallback for mobile
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return
    look(
      innerWidth / 2 + e.gamma * 10,
      innerHeight / 2 + (e.beta - 45) * 10,
    )
  })

  // Touch tap: snap to tap location
  addEventListener('touchstart', (e) => {
    const t = e.touches[0]
    if (t) look(t.clientX, t.clientY)
  }, { passive: true })
}
