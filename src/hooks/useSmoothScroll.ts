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

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
