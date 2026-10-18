// Dynamic import keeps the Lottie player (~60 KB) out of the main bundle.
// Vite code-splits it automatically; icons upgrade in place once the chunk lands.
export function initLordicon(): void {
  void import('@lordicon/element').then(({ defineElement }) => {
    defineElement()

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Desktop project icons animate on hover of the parent button
    document.querySelectorAll<HTMLElement>('.desktop-lordicon').forEach(el => {
      el.setAttribute('trigger', 'hover')
      el.setAttribute('target', '.desktop-icon')
    })

    // Toolbar pill icons animate on click of the parent button
    document.querySelectorAll<HTMLElement>('.toolbar-lordicon').forEach(el => {
      el.setAttribute('trigger', 'click')
      el.setAttribute('target', '.toolbar-pill')
    })
  })
}
