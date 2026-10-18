import { playLullaby, chime, rattle } from './audio'
import { onProjectOpened } from './companion'

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
    title: 'Rattle & Block Toys',
    emoji: '🪀',
    description: 'Interactive toy drawer: shake the rattle for a Web Audio burst, stack CSS blocks, and watch them wobble with spring physics. Every toy makes a sound. Every sound starts muted.',
    tags: ['Web Audio API', 'CSS Physics', 'Interaction Design'],
  },
  {
    id: 'growth',
    title: "Pip's Growth Chart",
    emoji: '📈',
    description: 'An SVG growth chart tracking Pip\'s milestones as Junior Dream Engineer: first lullaby (3 months), first delivery route (6 months), first chaos mode incident (7 months). Hand-drawn in pixel art.',
    tags: ['SVG', 'Pixel Art', 'Data Viz'],
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
      <div class="interactive-toy rattle-toy" aria-label="Interactive Rattle and Toy Blocks">
        <div class="toy-header">
          <span class="toy-badge">✦ NURSERY TOY DRAWER</span>
          <span class="toy-hint">Shake the rattle or tap blocks to make chimes!</span>
        </div>
        <div class="toy-stage rattle-stage">
          <button class="toy-rattle-btn" type="button" aria-label="Shake rattle" data-action="shake-rattle">
            <span class="rattle-icon" aria-hidden="true">🪀</span>
            <span class="rattle-label">Shake Rattle</span>
          </button>
          <div class="toy-blocks" role="group" aria-label="Toy building blocks">
            <button class="toy-block block-p" type="button" data-pitch="523" aria-label="Block P - Note C">P</button>
            <button class="toy-block block-i" type="button" data-pitch="659" aria-label="Block I - Note E">I</button>
            <button class="toy-block block-p2" type="button" data-pitch="784" aria-label="Block P - Note G">P</button>
            <button class="toy-block block-star" type="button" data-pitch="1046" aria-label="Block Star - Note High C">★</button>
          </div>
        </div>
        <p class="toy-caption">Spring physics bop · Soft Web Audio chime per block</p>
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

  win.querySelectorAll<HTMLButtonElement>('.toy-block').forEach((block) => {
    block.addEventListener('click', () => {
      block.classList.remove('bopping')
      void block.offsetWidth
      block.classList.add('bopping')
      const pitch = parseInt(block.dataset.pitch ?? '523', 10)
      chime(pitch)
    })
  })
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
