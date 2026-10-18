// Persistent Companion behavior for Pip (specs/pip-portfolio/spec.md FR-008 - FR-013)

const PROJECT_COMMENTS: Record<string, string> = {
  'lullaby-lab': 'i wound that music box 1,000 times! 🎵',
  'nightlight': 'my favorite is the crescent moon one! 🌙',
  'delivery': 'cloud #7 is the safest route! 🗺️',
  'rattle': "shhh, don't wake the neighborhood mice! 🪀",
  'growth': 'i grew two whole centimeters this month! 📈',
}

let dismissTimer: number | null = null
let idle20Timer: number | null = null
let idle60Timer: number | null = null
let isDozing = false

function getToolbarBubble(): HTMLElement | null {
  let bubble = document.getElementById('toolbar-bubble')
  if (!bubble) {
    const toolbar = document.querySelector('.toolbar')
    const toolbarPip = document.querySelector('.toolbar-pip')
    if (!toolbar) return null

    bubble = document.createElement('div')
    bubble.id = 'toolbar-bubble'
    bubble.className = 'toolbar-bubble'
    bubble.setAttribute('role', 'status')
    bubble.setAttribute('aria-live', 'polite')
    bubble.setAttribute('hidden', '')

    if (toolbarPip && toolbarPip.parentElement) {
      toolbarPip.parentElement.style.position = 'relative'
      toolbarPip.parentElement.appendChild(bubble)
    } else {
      toolbar.appendChild(bubble)
    }
  }
  return bubble
}

export function pipSpeak(text: string, durationMs = 4000) {
  if (dismissTimer) {
    window.clearTimeout(dismissTimer)
    dismissTimer = null
  }

  // Update hero speech bubble if present
  const heroBubble = document.getElementById('speech-bubble')
  if (heroBubble) {
    const textEl = heroBubble.querySelector<HTMLElement>('.bubble-text')
    if (textEl) textEl.textContent = text
    heroBubble.removeAttribute('hidden')
  }

  // Also display docked toolbar bubble
  const toolbarBubble = getToolbarBubble()
  if (toolbarBubble) {
    toolbarBubble.textContent = text
    toolbarBubble.removeAttribute('hidden')
  }

  dismissTimer = window.setTimeout(() => {
    if (toolbarBubble) toolbarBubble.setAttribute('hidden', '')
    dismissTimer = null
  }, durationMs)
}

export function onProjectOpened(projectId: string) {
  const comment = PROJECT_COMMENTS[projectId]
  if (comment) {
    pipSpeak(comment, 4000)
  }
}

export function onGuestbookSubmitted() {
  pipSpeak('someone left me a note!! ✦', 4500)
}

export function initCompanion() {
  const pip = document.getElementById('pip')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

  function resetIdleTimers() {
    if (idle20Timer) window.clearTimeout(idle20Timer)
    if (idle60Timer) window.clearTimeout(idle60Timer)

    if (isDozing && pip) {
      isDozing = false
      pip.classList.remove('asleep')
      if (!reducedMotion) {
        pip.classList.add('wiggle')
        setTimeout(() => pip.classList.remove('wiggle'), 350)
      }
    }

    if (document.visibilityState === 'hidden') return

    // 20s idle: ask "hello? still there?"
    idle20Timer = window.setTimeout(() => {
      pipSpeak("hello? still there? it's very quiet…", 4500)
    }, 20000)

    // 60s idle: Pip dozes off
    idle60Timer = window.setTimeout(() => {
      if (pip) {
        isDozing = true
        pip.classList.add('asleep')
      }
    }, 60000)
  }

  // Track user activity
  const events = ['pointermove', 'keydown', 'scroll', 'touchstart', 'click']
  events.forEach((evt) => {
    window.addEventListener(evt, resetIdleTimers, { passive: true })
  })

  // Pause timers when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (idle20Timer) window.clearTimeout(idle20Timer)
      if (idle60Timer) window.clearTimeout(idle60Timer)
    } else {
      resetIdleTimers()
    }
  })

  // Start initial idle timer
  resetIdleTimers()
}
