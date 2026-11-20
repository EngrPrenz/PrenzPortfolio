import { useEffect } from 'react'
import Lenis from 'lenis'

export const useSmoothScroll = () => {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Detect mobile touch devices to prevent scroll-fight
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (prefersReducedMotion || isTouchDevice) {
      // Keep native browser momentum scroll on touch and reduced-motion
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    })

    let openModalCount = 0
    const handleModalOpen = () => {
      openModalCount += 1
      lenis.stop()
    }
    const handleModalClose = () => {
      openModalCount = Math.max(0, openModalCount - 1)
      if (openModalCount === 0) {
        lenis.start()
      }
    }

    window.addEventListener('prenz:modal-open', handleModalOpen)
    window.addEventListener('prenz:modal-close', handleModalClose)

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('prenz:modal-open', handleModalOpen)
      window.removeEventListener('prenz:modal-close', handleModalClose)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
