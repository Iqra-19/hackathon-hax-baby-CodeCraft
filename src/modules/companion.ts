// Persistent Companion behavior & Interactive Dialogue for Pip (T3-4)
import { chime } from './audio'

const PROJECT_COMMENTS: Record<string, string> = {
  'lullaby-lab': 'i wound that music box 1,000 times! 🎵',
  'nightlight': 'my favorite is the crescent moon one! 🌙',
  'delivery': 'cloud #7 is the safest route! 🗺️',
  'rattle': "shhh, don't wake the neighborhood mice! 🪀",
  'growth': 'i grew two whole centimeters this month! 📈',
  'pip-3d': 'woah!! am i in three dimensions right now?! 🌟',
}

const DIALOGUE_RESPONSES: Record<string, string> = {
  night: 'i patrol the nursery and dream clouds with my golden lantern! 🌙 no nightmares allowed!',
  bow: 'my pink bow was woven by constellation fairies! psst... tapping it 5 times makes me sleepy 🎀',
  delivery: 'we launch from Cloud #7 and glide down starbeams directly onto fluffy pillows! ☁️',
  sing: 'twinkle twinkle little star... wind my golden key in Lullaby Lab to hear my full symphony! 🎵',
  chaos: 'WAHOO!! chaos mode flips gravity and bounces star confetti across the nursery ceiling! ⚡',
  secret: 'shhh... if you type the Konami code (↑ ↑ ↓ ↓ ← → ← → B A), i go into maximum snore mode! 🤫',
  story: 'once upon a midnight, a tiny moonbeam woke up a little dreamer named Pip... and here we are! 📖',
  snack: 'warm milk clouds dusted with crushed cinnamon stars! yummy yummy! 🥛✨',
  age: 'i am approximately 12 months old and already a certified Junior Dream Engineer! 🎓',
  default: "giggle! i love talking with dreamers! ask me about my bow, bedtime secrets, or dream routes! ✦",
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

export function pipSpeak(text: string, durationMs = 4500) {
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

  chime(784)

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

export function getPipReply(input: string): string {
  const q = input.toLowerCase()
  if (q.includes('night') || q.includes('do you do') || q.includes('job') || q.includes('work')) {
    return DIALOGUE_RESPONSES.night
  }
  if (q.includes('bow') || q.includes('pink') || q.includes('ribbon') || q.includes('tickl')) {
    return DIALOGUE_RESPONSES.bow
  }
  if (q.includes('deliver') || q.includes('route') || q.includes('cloud') || q.includes('map')) {
    return DIALOGUE_RESPONSES.delivery
  }
  if (q.includes('sing') || q.includes('song') || q.includes('lullaby') || q.includes('music')) {
    return DIALOGUE_RESPONSES.sing
  }
  if (q.includes('chaos') || q.includes('crazy') || q.includes('party')) {
    return DIALOGUE_RESPONSES.chaos
  }
  if (q.includes('secret') || q.includes('konami') || q.includes('egg') || q.includes('cheat')) {
    return DIALOGUE_RESPONSES.secret
  }
  if (q.includes('story') || q.includes('bedtime') || q.includes('tale')) {
    return DIALOGUE_RESPONSES.story
  }
  if (q.includes('eat') || q.includes('food') || q.includes('snack') || q.includes('milk')) {
    return DIALOGUE_RESPONSES.snack
  }
  if (q.includes('old') || q.includes('age') || q.includes('birthday')) {
    return DIALOGUE_RESPONSES.age
  }
  return DIALOGUE_RESPONSES.default
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

  // Setup Pip Character Chat Box Modal / Drawer
  setupPipChatDrawer()
}

function setupPipChatDrawer() {
  if (document.getElementById('pip-chat-modal')) return

  const modal = document.createElement('div')
  modal.id = 'pip-chat-modal'
  modal.className = 'pip-chat-modal'
  modal.setAttribute('hidden', '')
  modal.innerHTML = `
    <div class="pip-chat-card">
      <div class="pip-chat-header">
        <div class="chat-header-title">
          <span class="chat-pip-avatar">🌟</span>
          <div>
            <h4>Chat with Baby Pip</h4>
            <span class="chat-online-badge">● Online · Junior Dream Engineer</span>
          </div>
        </div>
        <button class="chat-close-btn" id="chat-close-btn" type="button" aria-label="Close Chat">✕</button>
      </div>
      <div class="pip-chat-messages" id="pip-chat-messages">
        <div class="chat-bubble chat-bubble--pip">
          hi little dreamer! ✦ i'm Pip! ask me anything or choose a question below!
        </div>
      </div>
      <div class="pip-chat-prompts">
        <button class="chat-prompt-pill" data-q="What do you do at night?">🌙 Night Shift</button>
        <button class="chat-prompt-pill" data-q="Tell me a bedtime story">📖 Bedtime Story</button>
        <button class="chat-prompt-pill" data-q="Why is your bow pink?">🎀 Pink Bow</button>
        <button class="chat-prompt-pill" data-q="How do dream deliveries work?">☁️ Dream Routes</button>
        <button class="chat-prompt-pill" data-q="Tell me a secret easter egg">🤫 Secret Hint</button>
      </div>
      <form class="pip-chat-form" id="pip-chat-form">
        <input type="text" id="pip-chat-input" placeholder="Type a message to Pip..." maxlength="80" autocomplete="off" />
        <button type="submit" aria-label="Send message">Send ✦</button>
      </form>
    </div>
  `
  document.body.appendChild(modal)

  const messages = modal.querySelector<HTMLElement>('#pip-chat-messages')
  const form = modal.querySelector<HTMLFormElement>('#pip-chat-form')
  const input = modal.querySelector<HTMLInputElement>('#pip-chat-input')
  const closeBtn = modal.querySelector<HTMLButtonElement>('#chat-close-btn')

  const appendMsg = (text: string, isUser: boolean) => {
    if (!messages) return
    const bubble = document.createElement('div')
    bubble.className = `chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--pip'}`
    bubble.textContent = text
    messages.appendChild(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return
    appendMsg(questionText, true)
    chime(523)

    // Pip reply with typing simulation
    setTimeout(() => {
      const reply = getPipReply(questionText)
      appendMsg(reply, false)
      pipSpeak(reply, 5000)
      chime(880)
    }, 400)
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!input) return
    const text = input.value.trim()
    input.value = ''
    handleAsk(text)
  })

  modal.querySelectorAll<HTMLButtonElement>('.chat-prompt-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q || btn.textContent || ''
      handleAsk(q)
    })
  })

  closeBtn?.addEventListener('click', () => {
    modal.setAttribute('hidden', '')
  })

  // Hook chat opening to speech bubble or hero button
  const heroBubble = document.getElementById('speech-bubble')
  heroBubble?.addEventListener('click', () => {
    modal.removeAttribute('hidden')
    input?.focus()
    chime(659)
  })

  const heroPip = document.getElementById('pip')
  heroPip?.addEventListener('dblclick', () => {
    modal.removeAttribute('hidden')
    input?.focus()
    chime(659)
  })
}

export function openPipChat() {
  const modal = document.getElementById('pip-chat-modal')
  if (modal) {
    modal.removeAttribute('hidden')
    const input = modal.querySelector<HTMLInputElement>('#pip-chat-input')
    input?.focus()
    chime(659)
  }
}
