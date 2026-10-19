import { chime } from './audio'

const SKY_COLORS: Record<string, string> = {
  '1': '#FDE8DB', // peach dusk
  '2': '#F5C5D0', // rose twilight
  '3': '#C8BDED', // violet deepening
  '4': '#1D2450', // midnight blue
  '5': '#050712', // deep midnight
}

export function initStory() {
  const scenes = document.querySelectorAll<HTMLElement>('.scene')
  const dots = document.querySelectorAll<HTMLElement>('.progress-dot')
  const progress = document.querySelector<HTMLElement>('.story-progress')
  const storySection = document.getElementById('story')
  const storyScenes = document.getElementById('story-scenes')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!scenes.length || !storySection) return

  let currentSceneIndex = 0
  const totalScenes = scenes.length

  // Ensure scenes have initial state
  scenes[0]?.classList.add('visible', 'active-page')

  function updateSky(sceneNum: string | undefined) {
    if (!storySection || !sceneNum) return
    const skyColor = SKY_COLORS[sceneNum]
    if (skyColor) {
      storySection.style.setProperty('--story-sky', skyColor)
    }
  }

  function updateDots(activeScene: string | undefined) {
    dots.forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.scene === activeScene)
    })
  }

  function goToScene(index: number, direction: 'next' | 'prev' = 'next') {
    if (index < 0 || index >= totalScenes || index === currentSceneIndex) return

    const prevScene = scenes[currentSceneIndex]
    currentSceneIndex = index
    const nextScene = scenes[currentSceneIndex]

    if (!prevScene || !nextScene) return

    // Apply 3D page-turn flip classes
    if (!reducedMotion) {
      prevScene.classList.add(direction === 'next' ? 'page-flip-out-left' : 'page-flip-out-right')
      nextScene.classList.add(direction === 'next' ? 'page-flip-in-right' : 'page-flip-in-left')

      setTimeout(() => {
        prevScene.classList.remove('page-flip-out-left', 'page-flip-out-right', 'active-page')
        nextScene.classList.remove('page-flip-in-right', 'page-flip-in-left')
        nextScene.classList.add('active-page', 'visible')
      }, 550)
    } else {
      prevScene.classList.remove('active-page')
      nextScene.classList.add('active-page', 'visible')
    }

    const sceneNum = nextScene.dataset.scene || String(index + 1)
    updateDots(sceneNum)
    updateSky(sceneNum)

    // Gentle page turn audio chime
    chime(523 + index * 60)

    // Update nav counter
    const counterEl = document.getElementById('story-page-counter')
    if (counterEl) {
      counterEl.textContent = `Chapter ${index + 1} of ${totalScenes}`
    }

    // Lazy-start scene 2 video
    if (sceneNum === '2' && !reducedMotion) {
      const vid = nextScene.querySelector<HTMLVideoElement>('.scene-bg-video')
      if (vid && vid.paused) void vid.play()
    }

    // Scroll smoothly to keep book in view
    storySection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // Inject Page-Turn Navigation Bar if not already present
  if (!document.getElementById('story-book-nav')) {
    const navBar = document.createElement('div')
    navBar.id = 'story-book-nav'
    navBar.className = 'story-book-nav'
    navBar.innerHTML = `
      <button class="book-nav-btn" id="story-prev-btn" aria-label="Previous Chapter" type="button">
        <span aria-hidden="true">❮</span> Previous Page
      </button>
      <span class="story-page-counter" id="story-page-counter">Chapter 1 of ${totalScenes}</span>
      <button class="book-nav-btn" id="story-next-btn" aria-label="Next Chapter" type="button">
        Next Page <span aria-hidden="true">❯</span>
      </button>
    `
    storyScenes?.parentElement?.insertBefore(navBar, storyScenes)

    document.getElementById('story-prev-btn')?.addEventListener('click', () => {
      goToScene(currentSceneIndex - 1, 'prev')
    })
    document.getElementById('story-next-btn')?.addEventListener('click', () => {
      goToScene(currentSceneIndex + 1, 'next')
    })
  }

  // Dots clickable navigation
  dots.forEach((dot, idx) => {
    dot.style.cursor = 'pointer'
    dot.setAttribute('role', 'button')
    dot.setAttribute('aria-label', `Go to scene ${idx + 1}`)
    dot.addEventListener('click', () => {
      goToScene(idx, idx > currentSceneIndex ? 'next' : 'prev')
    })
  })

  // Keyboard Navigation: ArrowLeft / ArrowRight
  window.addEventListener('keydown', (e) => {
    // Only handle if story section is mostly in viewport or active
    const rect = storySection.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0
    if (!inView) return

    // Avoid hijacking if user is typing in form
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      goToScene(currentSceneIndex + 1, 'next')
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToScene(currentSceneIndex - 1, 'prev')
    }
  })

  // Touch Swipe Navigation for mobile storybook
  let touchStartX = 0
  let touchStartY = 0
  storySection.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }, { passive: true })

  storySection.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Horizontal swipe threshold (ignore vertical scrolling)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        goToScene(currentSceneIndex + 1, 'next')
      } else {
        goToScene(currentSceneIndex - 1, 'prev')
      }
    }
  }, { passive: true })

  // IntersectionObserver for visibility of story section and dots
  if (storySection && progress) {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        progress.classList.toggle('visible', entry.isIntersecting)
      },
      { threshold: 0.1 },
    )
    sectionObserver.observe(storySection)
  }

  // Theme listener for initial sky
  const isNight = document.documentElement.dataset.theme === 'night'
  if (isNight && storySection) {
    storySection.style.setProperty('--story-sky', SKY_COLORS['3'])
  }

  document.addEventListener('pip:theme', (e) => {
    const detail = (e as CustomEvent<string>).detail
    if (storySection) {
      if (detail === 'night') {
        storySection.style.setProperty('--story-sky', SKY_COLORS['3'])
      } else {
        const curScene = scenes[currentSceneIndex]?.dataset.scene || '1'
        storySection.style.setProperty('--story-sky', SKY_COLORS[curScene] || SKY_COLORS['1'])
      }
    }
  })

  // Nightlight video reveal — "lights on" button in Scene 5
  const lightsBtn = document.getElementById('lights-on')
  const nightlightVideo = document.getElementById('nightlight-video') as HTMLVideoElement | null
  const finaleImg = document.getElementById('scene-finale-img')

  lightsBtn?.addEventListener('click', () => {
    storySection?.classList.remove('dark-room')
    lightsBtn.dataset.lit = 'true'
    lightsBtn.textContent = '✦ lights on!'
    chime(1046)

    if (nightlightVideo && !reducedMotion) {
      finaleImg?.setAttribute('hidden', '')
      nightlightVideo.removeAttribute('hidden')
      void nightlightVideo.play()
    }
  })

  // Flashlight tracking
  addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
    document.documentElement.style.setProperty('--my', `${e.clientY}px`)
  }, { passive: true })

  addEventListener('touchstart', (e) => {
    const t = e.touches[0]
    if (t) {
      document.documentElement.style.setProperty('--mx', `${t.clientX}px`)
      document.documentElement.style.setProperty('--my', `${t.clientY}px`)
    }
  }, { passive: true })
}
