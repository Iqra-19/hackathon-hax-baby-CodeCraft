export function initStory() {
  const scenes = document.querySelectorAll<HTMLElement>('.scene')
  const dots = document.querySelectorAll<HTMLElement>('.progress-dot')
  const progress = document.querySelector<HTMLElement>('.story-progress')
  const storySection = document.getElementById('story')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!scenes.length) return

  // IntersectionObserver — reveal scenes + lazy-start bg video in scene 2
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          const sceneNum = (entry.target as HTMLElement).dataset.scene
          updateDots(sceneNum)

          // Lazy-start scene 2 background video when it enters view
          if (sceneNum === '2' && !reducedMotion) {
            const vid = entry.target.querySelector<HTMLVideoElement>('.scene-bg-video')
            if (vid && vid.paused) void vid.play()
          }
        }
      }
    },
    { threshold: 0.3 },
  )

  scenes.forEach((scene) => sceneObserver.observe(scene))

  // Show/hide progress dots when story section is visible
  if (storySection && progress) {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        progress.classList.toggle('visible', entry.isIntersecting)
      },
      { threshold: 0.1 },
    )
    sectionObserver.observe(storySection)
  }

  function updateDots(activeScene: string | undefined) {
    dots.forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.scene === activeScene)
    })
  }

  // Nightlight video reveal — "lights on" button in Scene 5
  const lightsBtn = document.getElementById('lights-on')
  const nightlightVideo = document.getElementById('nightlight-video') as HTMLVideoElement | null
  const finaleImg = document.getElementById('scene-finale-img')

  lightsBtn?.addEventListener('click', () => {
    // Remove dark-room overlay
    storySection?.classList.remove('dark-room')
    lightsBtn.dataset.lit = 'true'
    lightsBtn.textContent = '✦ lights on!'

    // Show and play nightlight video; hide static lantern img
    if (nightlightVideo && !reducedMotion) {
      finaleImg?.setAttribute('hidden', '')
      nightlightVideo.removeAttribute('hidden')
      void nightlightVideo.play()
    }
  })

  // Flashlight: track pointer for the dark-room mask
  addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
    document.documentElement.style.setProperty('--my', `${e.clientY}px`)
  }, { passive: true })

  // Touch: keep light at last tap
  addEventListener('touchstart', (e) => {
    const t = e.touches[0]
    if (t) {
      document.documentElement.style.setProperty('--mx', `${t.clientX}px`)
      document.documentElement.style.setProperty('--my', `${t.clientY}px`)
    }
  }, { passive: true })
}
