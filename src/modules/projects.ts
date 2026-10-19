import { playLullaby, chime, rattle } from './audio'
import { onProjectOpened } from './companion'
import { createPip3DViewer } from './pip3d'
import { initDreamCatcherGame, initBlockStacker } from './minigame'

interface Project {
  id: string
  title: string
  emoji: string
  image?: string
  imageAlt?: string
  description: string
  tags: string[]
}

const LULLABY_VIDEO = '/assets/videos/lullaby-lab.mp4'

const PROJECTS: Project[] = [
  {
    id: 'lullaby-lab',
    title: 'Lullaby Lab',
    emoji: '🎵',
    image: '/assets/pip_lullaby_box.webp',
    imageAlt: 'Pink-and-cream music box with a unicorn on top and a gold key',
    description: 'A Web Audio music box that generates personalized lullabies. Wind the golden key to play Pip\'s signature Twinkle v2 melody. Each lullaby remembers your favourite colour and adapts the tempo to your breathing.',
    tags: ['Web Audio API', 'Generative Music', 'TypeScript'],
  },
  {
    id: 'nightlight',
    title: 'Nightlight Collection',
    emoji: '🔦',
    image: '/assets/pip_dream_lantern.webp',
    imageAlt: 'Bell-shaped nightlight with a sleepy crescent moon',
    description: 'A curated gallery of bespoke nightlights, each shaped like something you miss most. The dream lantern uses CSS masking to project gentle glow patterns. Available in moonbeam, amber, and blush.',
    tags: ['CSS Masking', 'SVG', 'Design Systems'],
  },
  {
    id: 'delivery',
    title: 'Dream Delivery Routes',
    emoji: '🗺️',
    description: 'Hand-drawn SVG routes mapping the nightly journey of dreams from Cloud #7 to pillows worldwide. Routes animate on scroll via GSAP ScrollTrigger. The scenic path through the constellation belt takes 0.3 seconds.',
    tags: ['SVG Animation', 'GSAP ScrollTrigger', 'Cartography'],
  },
  {
    id: 'rattle',
    title: 'Rattle, Blocks & Dream Catcher',
    emoji: '🪀',
    description: 'Interactive nursery game drawer: play the Dream Catcher falling stars mini-game, build balance block towers, and shake the rattle for audio physics bursts!',
    tags: ['HTML5 Canvas', 'Mini-game', 'Web Audio', 'Block Physics'],
  },
  {
    id: 'growth',
    title: "Pip's Growth Chart",
    emoji: '📈',
    description: 'An SVG growth chart tracking Pip\'s milestones as Junior Dream Engineer: first lullaby (3 months), first delivery route (6 months), first chaos mode incident (7 months). Hand-drawn in pixel art.',
    tags: ['SVG', 'Pixel Art', 'Data Viz'],
  },
  {
    id: 'pip-3d',
    title: 'Pip 3D Holo-Viewer',
    emoji: '🌟',
    description: 'Interactive 3D WebGL render of Baby Pip built with Three.js. Drag to inspect Pip from any angle, trigger cheeky winks, spin 360°, and watch orbiting star particles in real-time.',
    tags: ['Three.js', 'WebGL', '3D Graphics', 'Interactive'],
  },
]

const openWindows = new Map<string, HTMLElement>()
let zBase = 100
let tiltAngles: number[] = []

function getTilt() {
  if (tiltAngles.length === 0) {
    tiltAngles = [-3, -1.5, 0, 1.5, 3, -2, 2]
  }
  const idx = Math.floor(Math.random() * tiltAngles.length)
  return tiltAngles.splice(idx, 1)[0] ?? 0
}

function getInteractiveWidgetHTML(projectId: string): string {
  if (projectId === 'lullaby-lab') {
    return `
      <div class="interactive-toy lullaby-toy" aria-label="Interactive Lullaby Music Box">
        <div class="toy-header">
          <span class="toy-badge">✦ INTERACTIVE TOY</span>
          <span class="toy-hint">Click the golden key to wind the music box!</span>
        </div>
        <div class="toy-stage lullaby-stage">
          <div class="music-box-visual" aria-hidden="true">
            <span class="music-box-unicorn">🦄</span>
            <span class="music-note-float n1">♪</span>
            <span class="music-note-float n2">♫</span>
          </div>
          <button class="wind-key-btn" type="button" aria-label="Wind golden key to play lullaby" data-action="wind-key">
            <span class="key-icon" aria-hidden="true">🗝️</span>
            <span class="key-label">Wind Golden Key</span>
          </button>
        </div>
        <p class="toy-caption">Winding key rotates 360° · plays Pip's Twinkle v2 melody</p>
      </div>
    `
  }
  if (projectId === 'nightlight') {
    return `
      <div class="interactive-toy nightlight-toy" aria-label="Interactive Nightlight Collection">
        <div class="toy-header">
          <span class="toy-badge">✦ INTERACTIVE LAMPS</span>
          <span class="toy-hint">Click each lamp to toggle its warm glow!</span>
        </div>
        <div class="toy-stage lamps-stage">
          <button class="lamp-btn is-on" type="button" data-lamp="crescent" data-note="659" aria-pressed="true" aria-label="Crescent Moon Lamp (On)">
            <span class="lamp-glow" aria-hidden="true"></span>
            <span class="lamp-icon" aria-hidden="true">🌙</span>
            <span class="lamp-name">Moonbeam</span>
          </button>
          <button class="lamp-btn" type="button" data-lamp="star" data-note="784" aria-pressed="false" aria-label="Little Star Lamp (Off)">
            <span class="lamp-glow" aria-hidden="true"></span>
            <span class="lamp-icon" aria-hidden="true">⭐</span>
            <span class="lamp-name">Starlight</span>
          </button>
          <button class="lamp-btn" type="button" data-lamp="cloud" data-note="880" aria-pressed="false" aria-label="Dream Cloud Lamp (Off)">
            <span class="lamp-glow" aria-hidden="true"></span>
            <span class="lamp-icon" aria-hidden="true">☁️</span>
            <span class="lamp-name">Cloudglow</span>
          </button>
        </div>
        <p class="toy-caption">CSS ambient glow · Click to switch bedside lighting</p>
      </div>
    `
  }
  if (projectId === 'rattle') {
    return `
      <div class="interactive-toy rattle-toy" aria-label="Interactive Rattle, Blocks & Dream Catcher Game">
        <div class="toy-header">
          <span class="toy-badge">✦ NURSERY MINI-GAMES</span>
          <span class="toy-hint">Catch falling dreams or stack balance blocks!</span>
        </div>
        <div class="rattle-mini-game-wrap">
          <div class="game-scoreboard">
            <span class="game-score-readout" id="dream-score-readout">Score: 0 · Combo ×0</span>
            <span class="game-status-hint" id="dream-status-hint">Move mouse or ← / → arrows to catch dreams!</span>
            <button class="game-restart-btn" type="button" data-action="restart-catcher">↺ Restart</button>
          </div>
          <canvas class="dream-catcher-canvas" id="dream-catcher-canvas" width="340" height="180"></canvas>
        </div>
        <div class="toy-stage rattle-stage">
          <button class="toy-rattle-btn" type="button" aria-label="Shake rattle" data-action="shake-rattle">
            <span class="rattle-icon" aria-hidden="true">🪀</span>
            <span class="rattle-label">Shake Rattle</span>
          </button>
          <div class="toy-stack-area">
            <div class="tower-status">Tap blocks below to stack a balance tower!</div>
            <div class="block-tower-stage" aria-label="Balanced block tower"></div>
            <button class="tower-reset-btn" type="button" data-action="reset-tower">Tumble Tower 💥</button>
          </div>
          <div class="toy-blocks" role="group" aria-label="Toy building blocks">
            <button class="toy-block block-p" type="button" data-pitch="523" aria-label="Block P - Note C">P</button>
            <button class="toy-block block-i" type="button" data-pitch="659" aria-label="Block I - Note E">I</button>
            <button class="toy-block block-p2" type="button" data-pitch="784" aria-label="Block P - Note G">P</button>
            <button class="toy-block block-star" type="button" data-pitch="1046" aria-label="Block Star - Note High C">★</button>
          </div>
        </div>
        <p class="toy-caption">Catch falling stars for points · Stack toy blocks with sound chimes</p>
      </div>
    `
  }
  if (projectId === 'pip-3d') {
    return `
      <div class="interactive-toy pip3d-toy" aria-label="Interactive 3D WebGL Pip Viewer">
        <div class="toy-header">
          <span class="toy-badge">✦ 3D WEBGL VIEWER</span>
          <span class="toy-hint">Click & drag to rotate Pip in 3D space!</span>
        </div>
        <div class="pip3d-stage">
          <div class="pip3d-canvas-wrap" id="pip3d-canvas-wrap"></div>
          <div class="pip3d-controls">
            <button class="pip3d-btn" type="button" data-action="pip3d-wink">😉 Pip Wink</button>
            <button class="pip3d-btn" type="button" data-action="pip3d-spin">↺ Spin 360°</button>
            <button class="pip3d-btn" type="button" data-action="pip3d-reset">⟲ Reset View</button>
          </div>
        </div>
        <p class="toy-caption">Three.js WebGL scene · Procedural soft-shaded mesh · Orbital stardust</p>
      </div>
    `
  }
  if (projectId === 'delivery') {
    return `
      <div class="interactive-toy delivery-toy" aria-label="Dream Delivery Route Map">
        <div class="toy-header">
          <span class="toy-badge">✦ LIVE ROUTE MAP</span>
          <span class="toy-hint">Watch the dream delivery path animate!</span>
        </div>
        <div class="toy-stage delivery-stage">
          <svg class="route-map" viewBox="0 0 340 200" aria-label="Dream delivery route from Cloud 7 to pillows worldwide" role="img">
            <!-- Background starfield -->
            <rect width="340" height="200" fill="#090d24" rx="10"/>
            <circle cx="20" cy="15" r="1" fill="rgba(255,255,255,0.6)"/>
            <circle cx="80" cy="30" r="0.8" fill="rgba(255,255,255,0.4)"/>
            <circle cx="140" cy="10" r="1.2" fill="rgba(255,197,107,0.7)"/>
            <circle cx="200" cy="25" r="0.8" fill="rgba(255,255,255,0.5)"/>
            <circle cx="260" cy="8" r="1" fill="rgba(255,255,255,0.4)"/>
            <circle cx="310" cy="20" r="0.7" fill="rgba(201,182,228,0.6)"/>
            <circle cx="50" cy="50" r="0.6" fill="rgba(255,255,255,0.3)"/>
            <circle cx="180" cy="55" r="0.8" fill="rgba(255,197,107,0.4)"/>
            <circle cx="290" cy="45" r="0.6" fill="rgba(255,255,255,0.3)"/>
            <!-- Delivery path -->
            <path class="route-path"
              d="M 30,100 C 80,60 120,140 170,80 C 220,30 260,120 310,90"
              fill="none" stroke="#ffc56b" stroke-width="2.5"
              stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320"
              opacity="0.9"/>
            <!-- Constellation belt decorative arcs -->
            <path d="M 30,100 Q 100,170 170,80" fill="none" stroke="rgba(201,182,228,0.2)" stroke-width="1" stroke-dasharray="4 6"/>
            <!-- Stop markers -->
            <g class="route-stop" data-label="Cloud #7 HQ" transform="translate(30,100)">
              <circle r="6" fill="#ffc56b" stroke="#fff" stroke-width="1.5" class="stop-pulse"/>
              <text y="-12" text-anchor="middle" font-family="VT323, monospace" font-size="9" fill="#ffc56b">☁ Cloud #7</text>
            </g>
            <g class="route-stop" data-label="Star Belt Express" transform="translate(110,95)">
              <circle r="5" fill="#c9b6e4" stroke="#fff" stroke-width="1.5" class="stop-pulse" style="animation-delay:0.3s"/>
              <text y="-11" text-anchor="middle" font-family="VT323, monospace" font-size="9" fill="#c9b6e4">★ Star Belt</text>
            </g>
            <g class="route-stop" data-label="Moonbeam Junction" transform="translate(190,75)">
              <circle r="5" fill="#ff8fb1" stroke="#fff" stroke-width="1.5" class="stop-pulse" style="animation-delay:0.6s"/>
              <text y="-11" text-anchor="middle" font-family="VT323, monospace" font-size="9" fill="#ff8fb1">🌙 Moonbeam</text>
            </g>
            <g class="route-stop" data-label="Pillow Valley — Final Delivery" transform="translate(310,90)">
              <circle r="6" fill="#a34063" stroke="#fff" stroke-width="1.5" class="stop-pulse" style="animation-delay:0.9s"/>
              <text y="-12" text-anchor="middle" font-family="VT323, monospace" font-size="9" fill="#a34063">🛌 Pillows</text>
            </g>
            <!-- Pip icon travelling the path -->
            <text class="route-courier" font-size="14" text-anchor="middle" dy="0.35em">☁</text>
          </svg>
          <button class="replay-route-btn" type="button" aria-label="Replay delivery route animation" data-action="replay-route">
            ↺ Replay Route
          </button>
        </div>
        <p class="toy-caption">Hand-drawn SVG route · 0.3 s constellation belt shortcut</p>
      </div>
    `
  }
  if (projectId === 'growth') {
    return `
      <div class="interactive-toy growth-toy" aria-label="Pip Growth Chart">
        <div class="toy-header">
          <span class="toy-badge">✦ GROWTH CHART</span>
          <span class="toy-hint">Hover the bars to see Pip's milestones!</span>
        </div>
        <div class="toy-stage growth-stage">
          <div class="growth-chart" role="list" aria-label="Pip's milestone growth chart">
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar" style="--bar-h:35%" data-milestone="First dream bubble! 💭" data-month="Month 1" tabindex="0" aria-label="Month 1: First dream bubble">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M1</span>
            </div>
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar" style="--bar-h:52%" data-milestone="First lullaby composed 🎵" data-month="Month 3" tabindex="0" aria-label="Month 3: First lullaby">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M3</span>
            </div>
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar" style="--bar-h:68%" data-milestone="First delivery route mapped 🗺️" data-month="Month 6" tabindex="0" aria-label="Month 6: First delivery route">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M6</span>
            </div>
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar bar--chaos" style="--bar-h:78%" data-milestone="First Chaos Mode incident ⚡" data-month="Month 7" tabindex="0" aria-label="Month 7: First chaos mode incident">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M7</span>
            </div>
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar" style="--bar-h:88%" data-milestone="10 dreams delivered! 🌙" data-month="Month 10" tabindex="0" aria-label="Month 10: 10 dreams delivered">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M10</span>
            </div>
            <div class="chart-bar-group" role="listitem">
              <div class="chart-bar bar--gold" style="--bar-h:100%" data-milestone="Certified Junior Dream Engineer! ★" data-month="Month 12" tabindex="0" aria-label="Month 12: Certified Junior Dream Engineer">
                <span class="bar-fill"></span>
              </div>
              <span class="bar-label">M12</span>
            </div>
          </div>
          <div class="chart-tooltip" id="chart-tooltip" hidden aria-live="polite"></div>
        </div>
        <p class="toy-caption">Hand-drawn pixel art · Hover / tap bars to unlock milestones</p>
      </div>
    `
  }
  return ''
}

function wireInteractiveWidgets(win: HTMLElement) {
  // Lullaby Lab: Wind Key
  const windBtn = win.querySelector<HTMLButtonElement>('[data-action="wind-key"]')
  if (windBtn) {
    windBtn.addEventListener('click', () => {
      windBtn.classList.remove('winding')
      void windBtn.offsetWidth
      windBtn.classList.add('winding')

      const unicorn = win.querySelector('.music-box-unicorn')
      unicorn?.classList.remove('spinning')
      if (unicorn) void (unicorn as HTMLElement).offsetWidth
      unicorn?.classList.add('spinning')

      const notes = win.querySelectorAll('.music-note-float')
      notes.forEach((n) => {
        n.classList.remove('floating')
        void (n as HTMLElement).offsetWidth
        n.classList.add('floating')
      })

      playLullaby()
    })
  }

  // Nightlight: Clickable Lamps
  win.querySelectorAll<HTMLButtonElement>('.lamp-btn').forEach((lamp) => {
    lamp.addEventListener('click', () => {
      const isOn = lamp.classList.toggle('is-on')
      lamp.setAttribute('aria-pressed', String(isOn))
      const label = lamp.querySelector('.lamp-name')?.textContent ?? ''
      lamp.setAttribute('aria-label', `${label} (${isOn ? 'On' : 'Off'})`)
      const note = parseInt(lamp.dataset.note ?? '660', 10)
      chime(note)
    })
  })

  // Rattle & Blocks
  const rattleBtn = win.querySelector<HTMLButtonElement>('[data-action="shake-rattle"]')
  if (rattleBtn) {
    rattleBtn.addEventListener('click', () => {
      rattleBtn.classList.remove('shaking')
      void rattleBtn.offsetWidth
      rattleBtn.classList.add('shaking')
      rattle()
    })
  }

  // Mini-Game: Dream Catcher
  const catcherCanvas = win.querySelector<HTMLCanvasElement>('#dream-catcher-canvas')
  const scoreReadout = win.querySelector<HTMLElement>('#dream-score-readout')
  const statusHint = win.querySelector<HTMLElement>('#dream-status-hint')
  if (catcherCanvas && scoreReadout && statusHint) {
    const game = initDreamCatcherGame(catcherCanvas, scoreReadout, statusHint)
    win.querySelector<HTMLButtonElement>('[data-action="restart-catcher"]')?.addEventListener('click', () => {
      game.restart()
    })
  }

  // Mini-Game: Block Stacker
  initBlockStacker(win)

  // 3D WebGL Pip Viewer
  const pip3dWrap = win.querySelector<HTMLElement>('#pip3d-canvas-wrap')
  if (pip3dWrap) {
    createPip3DViewer(pip3dWrap)
  }

  // Dream Delivery Routes: SVG stroke-dashoffset animation + stop tooltips
  const routeMap = win.querySelector<SVGElement>('.route-map')
  if (routeMap) {
    const routePath = routeMap.querySelector<SVGPathElement>('.route-path')
    const routeCourier = routeMap.querySelector<SVGTextElement>('.route-courier')

    function animateRoute() {
      if (!routePath) return
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        routePath.style.strokeDashoffset = '0'
        return
      }
      routePath.style.transition = 'none'
      routePath.style.strokeDashoffset = '320'
      void routePath.getBoundingClientRect()
      routePath.style.transition = 'stroke-dashoffset 2.8s cubic-bezier(0.4, 0, 0.2, 1)'
      routePath.style.strokeDashoffset = '0'

      // Animate courier along path
      if (routeCourier && routePath.getTotalLength) {
        const len = routePath.getTotalLength()
        let start: number | null = null
        const dur = 2800

        function step(ts: number) {
          if (start === null) start = ts
          const t = Math.min((ts - start) / dur, 1)
          const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
          const pt = routePath!.getPointAtLength(easedT * len)
          routeCourier!.setAttribute('x', String(pt.x))
          routeCourier!.setAttribute('y', String(pt.y))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
      chime(659)
    }

    // Auto-play once on open
    setTimeout(animateRoute, 300)

    // Replay button
    const replayBtn = win.querySelector<HTMLButtonElement>('[data-action="replay-route"]')
    replayBtn?.addEventListener('click', animateRoute)

    // Stop tooltips
    routeMap.querySelectorAll<SVGGElement>('.route-stop').forEach((stop) => {
      const label = stop.dataset.label ?? ''
      const tooltip = win.querySelector<HTMLElement>('.toy-header .toy-hint') // reuse hint or make floating
      const circle = stop.querySelector('circle')

      const showTip = () => {
        if (tooltip) tooltip.textContent = `📍 ${label}`
      }
      const hideTip = () => {
        if (tooltip) tooltip.textContent = 'Watch the dream delivery path animate!'
      }

      circle?.addEventListener('mouseenter', showTip)
      circle?.addEventListener('mouseleave', hideTip)
      circle?.addEventListener('focus', showTip)
      circle?.addEventListener('blur', hideTip)
    })
  }

  // Growth Chart: hover/tap to reveal milestone tooltip
  const growthChart = win.querySelector<HTMLElement>('.growth-chart')
  if (growthChart) {
    const tooltip = win.querySelector<HTMLElement>('.chart-tooltip')

    growthChart.querySelectorAll<HTMLElement>('.chart-bar').forEach((bar, i) => {
      // Animate bar fill in on load with stagger
      const fillEl = bar.querySelector<HTMLElement>('.bar-fill')
      if (fillEl) {
        fillEl.style.transitionDelay = `${i * 0.1}s`
        setTimeout(() => bar.classList.add('bar--animated'), 100)
      }

      const showMilestone = () => {
        if (!tooltip) return
        const ms = bar.dataset.milestone ?? ''
        const month = bar.dataset.month ?? ''
        tooltip.textContent = `${month}: ${ms}`
        tooltip.removeAttribute('hidden')
        bar.classList.add('bar--hover')
        chime(523 + i * 60)
      }

      const hideMilestone = () => {
        tooltip?.setAttribute('hidden', '')
        bar.classList.remove('bar--hover')
      }

      bar.addEventListener('mouseenter', showMilestone)
      bar.addEventListener('mouseleave', hideMilestone)
      bar.addEventListener('focus', showMilestone)
      bar.addEventListener('blur', hideMilestone)
      bar.addEventListener('click', showMilestone)
    })
  }
}

function makeWindow(project: Project, container: HTMLElement): HTMLElement {
  const win = document.createElement('div')
  win.className = 'os-window'
  win.dataset.project = project.id
  const tilt = getTilt()
  win.style.setProperty('--window-tilt', `${tilt}deg`)
  win.style.top = `${20 + openWindows.size * 30}px`
  win.style.left = `${20 + openWindows.size * 30}px`
  win.style.zIndex = String(++zBase)

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const isLullaby = project.id === 'lullaby-lab'
  const mediaEl = isLullaby && !reducedMotion
    ? `<video class="window-video" src="${LULLABY_VIDEO}" autoplay loop muted playsinline preload="auto" aria-label="Pip winding the music box"></video>`
    : project.image
      ? `<img src="${project.image}" alt="${project.imageAlt ?? ''}" loading="lazy">`
      : ''

  const widgetHTML = getInteractiveWidgetHTML(project.id)

  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-controls">
        <button class="win-btn close" aria-label="Close window" data-action="close">×</button>
        <button class="win-btn minimize" aria-label="Minimize window" data-action="minimize">−</button>
        <button class="win-btn maximize" aria-label="Maximize window" data-action="maximize">+</button>
      </div>
      <span class="window-title">${project.emoji} ${project.title}</span>
    </div>
    <div class="window-body">
      ${mediaEl}
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      ${widgetHTML}
      <div class="window-tags">
        ${project.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `

  // Close
  win.querySelector<HTMLElement>('[data-action="close"]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    win.remove()
    openWindows.delete(project.id)
    container.querySelector<HTMLElement>(`[data-project="${project.id}"]`)?.classList.remove('active')
  })

  // Minimize
  const minBtn = win.querySelector<HTMLElement>('[data-action="minimize"]')
  minBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    const isMin = win.classList.toggle('is-minimized')
    minBtn.setAttribute('aria-pressed', String(isMin))
    minBtn.setAttribute('aria-label', isMin ? 'Restore window' : 'Minimize window')
    if (isMin && win.classList.contains('is-maximized')) {
      win.classList.remove('is-maximized')
      const maxBtn = win.querySelector<HTMLElement>('[data-action="maximize"]')
      maxBtn?.setAttribute('aria-pressed', 'false')
      maxBtn?.setAttribute('aria-label', 'Maximize window')
    }
  })

  // Maximize
  const maxBtn = win.querySelector<HTMLElement>('[data-action="maximize"]')
  maxBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    const isMax = win.classList.toggle('is-maximized')
    maxBtn.setAttribute('aria-pressed', String(isMax))
    maxBtn.setAttribute('aria-label', isMax ? 'Restore window size' : 'Maximize window')
    if (isMax) {
      win.classList.remove('is-minimized')
      minBtn?.setAttribute('aria-pressed', 'false')
      minBtn?.setAttribute('aria-label', 'Minimize window')
      win.dataset.prevLeft = win.style.left
      win.dataset.prevTop = win.style.top
      win.style.zIndex = String(++zBase + 50)
    } else {
      if (win.dataset.prevLeft) win.style.left = win.dataset.prevLeft
      if (win.dataset.prevTop) win.style.top = win.dataset.prevTop
    }
  })

  // Bring to front on click
  win.addEventListener('pointerdown', () => {
    win.style.zIndex = String(++zBase)
  })

  // Wire interactive mini-widgets inside this window
  wireInteractiveWidgets(win)

  // Drag (desktop only)
  makeDraggable(win)

  return win
}

function makeDraggable(el: HTMLElement) {
  const bar = el.querySelector<HTMLElement>('.window-titlebar')
  if (!bar) return

  let startX = 0, startY = 0, origLeft = 0, origTop = 0

  bar.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('button')) return
    if (el.classList.contains('is-maximized')) return
    startX = e.clientX
    startY = e.clientY
    origLeft = parseInt(el.style.left || '0', 10)
    origTop = parseInt(el.style.top || '0', 10)
    bar.setPointerCapture(e.pointerId)

    const onMove = (ev: PointerEvent) => {
      el.style.left = `${origLeft + ev.clientX - startX}px`
      el.style.top = `${origTop + ev.clientY - startY}px`
    }
    const onUp = () => {
      bar.removeEventListener('pointermove', onMove)
      bar.removeEventListener('pointerup', onUp)
    }
    bar.addEventListener('pointermove', onMove)
    bar.addEventListener('pointerup', onUp)
  })
}

export function initProjects() {
  const iconsEl = document.getElementById('desktop-icons')
  const layer = document.getElementById('windows-layer')
  if (!iconsEl || !layer) return

  iconsEl.querySelectorAll<HTMLElement>('.desktop-icon').forEach((icon) => {
    icon.addEventListener('click', () => {
      const id = icon.dataset.project
      const project = PROJECTS.find((p) => p.id === id)
      if (!project) return

      if (openWindows.has(project.id)) {
        // Bring to front and restore if minimized
        const win = openWindows.get(project.id)!
        win.classList.remove('is-minimized')
        const minBtn = win.querySelector<HTMLElement>('[data-action="minimize"]')
        minBtn?.setAttribute('aria-pressed', 'false')
        minBtn?.setAttribute('aria-label', 'Minimize window')
        win.style.zIndex = String(++zBase)
        onProjectOpened(project.id)
        return
      }

      const win = makeWindow(project, iconsEl)
      layer.appendChild(win)
      openWindows.set(project.id, win)
      icon.classList.add('active')
      onProjectOpened(project.id)
    })
  })
}
