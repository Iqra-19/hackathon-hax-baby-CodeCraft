import { chime, rattle } from './audio'
import confetti from 'canvas-confetti'

export function initDreamCatcherGame(canvas: HTMLCanvasElement, scoreEl: HTMLElement, statusEl: HTMLElement): { cleanup: () => void; restart: () => void } {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { cleanup: () => {}, restart: () => {} }

  let width = (canvas.width = canvas.clientWidth || 340)
  let height = (canvas.height = canvas.clientHeight || 220)

  // Basket / Cloud Cradle
  const basket = {
    x: width / 2,
    y: height - 26,
    width: 68,
    height: 18,
    vx: 0,
  }

  interface FallingItem {
    x: number
    y: number
    speed: number
    emoji: string
    points: number
    note: number
    radius: number
    wobble: number
  }

  let items: FallingItem[] = []
  let score = 0
  let combo = 0
  let isPlaying = true
  let animId: number
  let spawnTimer: number
  let bestScore = parseInt(localStorage.getItem('pip-dream-score') || '0', 10)

  const emojis = [
    { emoji: '⭐', points: 10, note: 659 },
    { emoji: '✨', points: 15, note: 784 },
    { emoji: '🌙', points: 25, note: 880 },
    { emoji: '💭', points: 5, note: 523 },
    { emoji: '🦄', points: 50, note: 1046 },
  ]

  const spawnItem = () => {
    if (!isPlaying) return
    const pick = emojis[Math.floor(Math.random() * emojis.length)]
    items.push({
      x: 20 + Math.random() * (width - 40),
      y: -10,
      speed: 1.2 + Math.random() * 1.8,
      emoji: pick.emoji,
      points: pick.points,
      note: pick.note,
      radius: 14,
      wobble: Math.random() * Math.PI * 2,
    })
    const nextInterval = Math.max(700, 1600 - score * 12)
    spawnTimer = window.setTimeout(spawnItem, nextInterval)
  }

  spawnItem()

  // Track pointer
  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX
    basket.x = Math.max(basket.width / 2, Math.min(width - basket.width / 2, clientX - rect.left))
  }

  // Keyboard navigation
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      basket.x = Math.max(basket.width / 2, basket.x - 22)
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      basket.x = Math.min(width - basket.width / 2, basket.x + 22)
    }
  }

  canvas.addEventListener('mousemove', onPointerMove)
  canvas.addEventListener('touchmove', onPointerMove, { passive: true })
  window.addEventListener('keydown', onKeyDown)

  const update = () => {
    ctx.clearRect(0, 0, width, height)

    // Render soft starfield background in canvas
    ctx.fillStyle = 'rgba(25, 30, 60, 0.25)'
    ctx.fillRect(0, 0, width, height)

    // Draw basket (Puff Cloud Cradle)
    ctx.save()
    ctx.translate(basket.x, basket.y)
    // Cloud cushion
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#ffc56b'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(-20, 0, 14, 0, Math.PI * 2)
    ctx.arc(0, -4, 16, 0, Math.PI * 2)
    ctx.arc(20, 0, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    // Cradle ribbon
    ctx.fillStyle = '#ff7b9c'
    ctx.beginPath()
    ctx.roundRect(-22, 6, 44, 4, 2)
    ctx.fill()
    ctx.restore()

    // Draw and update falling items
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]
      it.y += it.speed
      it.wobble += 0.05
      const drawX = it.x + Math.sin(it.wobble) * 6

      ctx.fillText(it.emoji, drawX, it.y)

      // Collision with basket
      const dx = Math.abs(drawX - basket.x)
      const dy = Math.abs(it.y - basket.y)

      if (dx < basket.width / 2 + 6 && dy < 16) {
        // Caught!
        score += it.points
        combo++
        chime(it.note)

        if (score > bestScore) {
          bestScore = score
          localStorage.setItem('pip-dream-score', String(bestScore))
        }

        scoreEl.textContent = `Score: ${score} · Combo ×${combo} (Best: ${bestScore})`
        statusEl.textContent = `Caught ${it.emoji} +${it.points}!`

        // Confetti burst on high value or combos
        if (it.points >= 25 || combo % 5 === 0) {
          const rect = canvas.getBoundingClientRect()
          confetti({
            particleCount: 15,
            spread: 50,
            origin: {
              x: (rect.left + basket.x) / window.innerWidth,
              y: (rect.top + basket.y) / window.innerHeight,
            },
            colors: ['#ffc56b', '#ff7b9c', '#c8bded'],
          })
        }

        items.splice(i, 1)
        continue
      }

      // Missed at bottom
      if (it.y > height + 20) {
        if (combo > 3) {
          statusEl.textContent = 'Combo reset!'
        }
        combo = 0
        items.splice(i, 1)
      }
    }

    if (isPlaying) {
      animId = requestAnimationFrame(update)
    }
  }

  animId = requestAnimationFrame(update)

  const restart = () => {
    score = 0
    combo = 0
    items = []
    scoreEl.textContent = `Score: 0 · Combo ×0 (Best: ${bestScore})`
    statusEl.textContent = 'Move mouse or ← / → arrows to catch dreams!'
    rattle()
  }

  return {
    restart,
    cleanup: () => {
      isPlaying = false
      cancelAnimationFrame(animId)
      clearTimeout(spawnTimer)
      canvas.removeEventListener('mousemove', onPointerMove)
      canvas.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('keydown', onKeyDown)
    },
  }
}

// Stacking Blocks Tower Mechanic
export function initBlockStacker(container: HTMLElement) {
  const blocks = container.querySelectorAll<HTMLElement>('.toy-block')
  const towerArea = container.querySelector<HTMLElement>('.block-tower-stage')
  const resetBtn = container.querySelector<HTMLButtonElement>('[data-action="reset-tower"]')
  const stackStatus = container.querySelector<HTMLElement>('.tower-status')

  if (!blocks.length || !towerArea) return

  let stackedCount = 0
  const totalBlocks = blocks.length

  blocks.forEach((block) => {
    block.addEventListener('click', () => {
      if (block.classList.contains('stacked')) return

      stackedCount++
      block.classList.add('stacked')
      const pitch = parseInt(block.dataset.pitch || '523', 10)
      chime(pitch)

      // Move block into tower stack
      const towerItem = document.createElement('div')
      towerItem.className = `tower-brick ${block.className.split(' ').find(c => c.startsWith('block-')) || ''}`
      towerItem.textContent = block.textContent || ''
      towerItem.style.animationDelay = `${stackedCount * 0.05}s`
      towerArea.appendChild(towerItem)

      if (stackStatus) {
        if (stackedCount < totalBlocks) {
          stackStatus.textContent = `Stacked ${stackedCount}/${totalBlocks} blocks! Keep balancing...`
        } else {
          stackStatus.textContent = '🌟 Tower complete! Perfect balance!'
          chime(1046)
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#ffd54f', '#ff80ab', '#b388ff'],
          })
        }
      }
    })
  })

  resetBtn?.addEventListener('click', () => {
    stackedCount = 0
    towerArea.innerHTML = ''
    blocks.forEach(b => b.classList.remove('stacked'))
    if (stackStatus) stackStatus.textContent = 'Tap blocks below to stack a balance tower!'
    rattle()
  })
}
