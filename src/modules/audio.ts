let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = true // start muted — browsers block autoplay

function ensure() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 0.35
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return { ctx, master: master! }
}

/** Soft music-box "ding": sine + quiet octave, fast attack, long decay */
export function chime(freq = 880, when = 0) {
  if (muted) return
  const { ctx, master } = ensure()
  const t = ctx.currentTime + when;
  [1, 2].forEach((mult, i) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq * mult
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(i ? 0.08 : 0.3, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
    osc.connect(g).connect(master)
    osc.start(t)
    osc.stop(t + 1.3)
  })
}

export const click = () => chime(1320 + Math.random() * 200, 0)

/** Twinkle-style lullaby in C major (0 = rest) */
export function playLullaby(tempo = 0.45) {
  const notes = [523, 523, 784, 784, 880, 880, 784, 0, 698, 698, 659, 659, 587, 587, 523]
  notes.forEach((f, i) => f && chime(f, i * tempo))
}

/** Short rattle sound: noise burst */
export function rattle() {
  if (muted) return
  const { ctx, master } = ensure()
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const source = ctx.createBufferSource()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  source.buffer = buffer
  g.gain.value = 0.4
  source.connect(filter).connect(g).connect(master)
  source.start()
}

export function initMute(btn: HTMLButtonElement) {
  const label = btn.querySelector('.pill-text')
  const render = () => {
    btn.setAttribute('aria-pressed', String(!muted))
    btn.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute sound')
    if (label) label.textContent = muted ? 'Sound Off' : 'Sound On'
  }

  btn.addEventListener('click', () => {
    muted = !muted
    const { ctx, master } = ensure()
    master.gain.setTargetAtTime(muted ? 0 : 0.35, ctx.currentTime, 0.05)
    render()
    if (!muted) chime(988)
  })

  render()

  // Click sounds on interactive elements
  document.addEventListener('click', (e) => {
    const target = e.target as Element
    if (target.closest('[data-click-sound]') || target.closest('button, a')) {
      if (target !== btn) click()
    }
  })
}
