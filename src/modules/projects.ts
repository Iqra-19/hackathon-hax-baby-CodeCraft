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

  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-controls">
        <button class="win-btn close" aria-label="Close window" data-action="close"></button>
        <button class="win-btn minimize" aria-label="Minimize" data-action="minimize"></button>
        <button class="win-btn maximize" aria-label="Maximize" data-action="maximize"></button>
      </div>
      <span class="window-title">${project.emoji} ${project.title}</span>
    </div>
    <div class="window-body">
      ${mediaEl}
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="window-tags">
        ${project.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `

  // Close
  win.querySelector<HTMLElement>('[data-action="close"]')?.addEventListener('click', () => {
    win.remove()
    openWindows.delete(project.id)
    container.querySelector<HTMLElement>(`[data-project="${project.id}"]`)?.classList.remove('active')
  })

  // Bring to front on click
  win.addEventListener('pointerdown', () => {
    win.style.zIndex = String(++zBase)
  })

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
        // Bring to front
        const win = openWindows.get(project.id)!
        win.style.zIndex = String(++zBase)
        return
      }

      const win = makeWindow(project, iconsEl)
      layer.appendChild(win)
      openWindows.set(project.id, win)
      icon.classList.add('active')
    })
  })
}
