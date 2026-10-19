export function initEyes(root: HTMLElement) {
  const wrap = root.querySelector<HTMLElement>('.pip-body-wrap') ?? root
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let raf = 0

  const look = (x: number, y: number) => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      // Smooth head & body 3D tilt towards pointer (with touch & gyro support)
      if (!reducedMotion) {
        const rootRect = root.getBoundingClientRect()
        const centerX = rootRect.left + rootRect.width / 2
        const centerY = rootRect.top + rootRect.height / 2
        const halfW = Math.max(innerWidth / 2, 200)
        const halfH = Math.max(innerHeight / 2, 200)
        const normX = Math.max(-1, Math.min(1, (x - centerX) / halfW))
        const normY = Math.max(-1, Math.min(1, (y - centerY) / halfH))

        const maxTiltDeg = 6
        const tiltY = normX * maxTiltDeg // Horizontal movement tilts around Y axis
        const tiltX = -normY * maxTiltDeg // Vertical movement tilts around X axis

        wrap.style.setProperty('--head-tilt-x', `${tiltX.toFixed(2)}deg`)
        wrap.style.setProperty('--head-tilt-y', `${tiltY.toFixed(2)}deg`)
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

