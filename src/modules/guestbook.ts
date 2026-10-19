import { createClient } from '@supabase/supabase-js'
import { onGuestbookSubmitted } from './companion'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || ''
const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const SUPABASE_ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || ''

interface Entry {
  id: string
  name: string
  message: string
  sticker: string
  created_at: string
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function renderEntry(entry: Entry): HTMLElement {
  const card = document.createElement('div')
  card.className = 'entry-card'
  // Escape to prevent XSS
  const name = entry.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const message = entry.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  card.innerHTML = `
    <div class="entry-header">
      <span class="entry-name">${name}</span>
      <span class="entry-sticker" aria-hidden="true">${entry.sticker}</span>
    </div>
    <p class="entry-message">${message}</p>
    <p class="entry-time">${formatTime(entry.created_at)}</p>
  `
  return card
}

export function initGuestbook() {
  const form = document.getElementById('guestbook-form') as HTMLFormElement | null
  const entriesEl = document.getElementById('guestbook-entries')
  const statusEl = document.getElementById('form-status')
  const charCounter = document.getElementById('char-counter')
  if (!form || !entriesEl) return

  // Wire char counter for message textarea
  const msgEl = document.getElementById('gb-message') as HTMLTextAreaElement | null
  if (msgEl && charCounter) {
    msgEl.addEventListener('input', () => {
      charCounter.textContent = `${msgEl.value.length}/140`
    })
  }

  // Degrade gracefully if Supabase not configured
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      showLocalEntry()
    })
    return
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON)

  // Load existing entries
  void loadEntries()

  async function loadEntries() {
    try {
      const { data, error } = await sb
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      if (!data?.length) return

      const empty = entriesEl!.querySelector('.entries-empty')
      empty?.remove()
      data.forEach((entry) => entriesEl!.appendChild(renderEntry(entry as Entry)))
    } catch {
      // Silently fail — guestbook is a bonus feature
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const name = (fd.get('name') as string).trim().slice(0, 50)
    const message = (fd.get('message') as string).trim().slice(0, 200)
    const sticker = (fd.get('sticker') as string) || '⭐'

    if (!name || !message) return

    if (statusEl) statusEl.textContent = 'Posting…'

    try {
      const { data, error } = await sb
        .from('guestbook')
        .insert({ name, message, sticker })
        .select()
        .single()

      if (error) throw error

      const empty = entriesEl!.querySelector('.entries-empty')
      empty?.remove()
      const card = renderEntry(data as Entry)
      entriesEl!.insertBefore(card, entriesEl!.firstChild)
      form.reset()
      if (statusEl) statusEl.textContent = '✨ Note posted!'
      onGuestbookSubmitted()
      setTimeout(() => { if (statusEl) statusEl.textContent = '' }, 3000)
    } catch (err) {
      console.error('Guestbook post error:', err)
      // Fallback: save locally so the visitor note is never lost
      showLocalEntry()
      if (statusEl) statusEl.textContent = '✨ Note pinned locally (offline mode)'
      setTimeout(() => { if (statusEl) statusEl.textContent = '' }, 4000)
    }
  })

  // Fallback: show entry locally if Supabase not set up
  function showLocalEntry() {
    const fd = new FormData(form!)
    const name = (fd.get('name') as string).trim().slice(0, 50) || 'Anonymous'
    const message = (fd.get('message') as string).trim().slice(0, 200) || '...'
    const sticker = (fd.get('sticker') as string) || '⭐'
    const fake: Entry = { id: Date.now().toString(), name, message, sticker, created_at: new Date().toISOString() }
    const empty = entriesEl!.querySelector('.entries-empty')
    empty?.remove()
    entriesEl!.insertBefore(renderEntry(fake), entriesEl!.firstChild)
    form!.reset()
    if (statusEl) statusEl.textContent = '✨ Note pinned locally!'
    onGuestbookSubmitted()
    setTimeout(() => { if (statusEl) statusEl.textContent = '' }, 3000)
  }
}
