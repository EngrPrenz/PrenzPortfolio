import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface Pulse {
  horiz: boolean
  line: number
  pos: number
  speed: number
  len: number
  dir: 1 | -1
}

const CELL_SIZE = 36

/**
 * Isolated Hero canvas rendering a 36px precision architectural grid with sparse traveling
 * emerald signal pulses and cursor-illuminated grid intersections. Automatically pauses
 * when scrolled offscreen or tab-hidden, and renders a calm static grid under reduced motion.
 */
export const GridSignalCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDarkRef = useRef(theme === 'dark')
  isDarkRef.current = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReduced = reducedMotionQuery.matches
    let isVisible = true
    let isTabVisible = !document.hidden
    let rafId: number | null = null

    let width = host.clientWidth
    let height = host.clientHeight
    let cols = Math.ceil(width / CELL_SIZE) + 1
    let rows = Math.ceil(height / CELL_SIZE) + 1

    const pointer = { x: -1000, y: -1000, inside: false }

    const createPulses = (): Pulse[] =>
      Array.from({ length: 6 }, (_, i) => {
        const horiz = i % 2 === 0
        const maxLine = Math.max(1, horiz ? rows - 1 : cols - 1)
        const span = horiz ? width : height
        return {
          horiz,
          line: Math.floor(((i + 1) * 1.7) % maxLine) + 1,
          pos: ((i * 0.21 + 0.12) % 1) * span,
          speed: 0.65 + (i % 3) * 0.22,
          len: 84 + (i % 3) * 28,
          dir: i % 3 === 0 ? -1 : 1,
        }
      })

    let pulses = createPulses()

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      cols = Math.ceil(width / CELL_SIZE) + 1
      rows = Math.ceil(height / CELL_SIZE) + 1

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pulses = createPulses()
      drawFrame(false)
    }

    const drawFrame = (advance: boolean) => {
      const dark = isDarkRef.current
      const rgb = dark ? '52, 211, 153' : '4, 120, 87'
      const fadeColor = dark ? '8, 10, 9' : '244, 246, 245'

      ctx.clearRect(0, 0, width, height)

      // Soft top-right directional studio light
      const topGrad = ctx.createRadialGradient(
        width * 0.68,
        -24,
        12,
        width * 0.68,
        height * 0.18,
        Math.max(width, height) * 0.64
      )
      topGrad.addColorStop(0, `rgba(${rgb}, ${dark ? 0.16 : 0.1})`)
      topGrad.addColorStop(1, `rgba(${rgb}, 0)`)
      ctx.fillStyle = topGrad
      ctx.fillRect(0, 0, width, height)

      // Base 36px precision grid
      ctx.strokeStyle = `rgba(${rgb}, ${dark ? 0.075 : 0.085})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL_SIZE + 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL_SIZE + 0.5
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      if (!prefersReduced) {
        // Cursor-illuminated grid intersections
        if (pointer.inside) {
          const cg = ctx.createRadialGradient(pointer.x, pointer.y, 4, pointer.x, pointer.y, 155)
          cg.addColorStop(0, `rgba(${rgb}, ${dark ? 0.14 : 0.09})`)
          cg.addColorStop(1, `rgba(${rgb}, 0)`)
          ctx.fillStyle = cg
          ctx.fillRect(0, 0, width, height)

          const startCol = Math.max(0, Math.floor((pointer.x - 140) / CELL_SIZE))
          const endCol = Math.min(cols, Math.ceil((pointer.x + 140) / CELL_SIZE))
          const startRow = Math.max(0, Math.floor((pointer.y - 140) / CELL_SIZE))
          const endRow = Math.min(rows, Math.ceil((pointer.y + 140) / CELL_SIZE))

          for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
              const ix = c * CELL_SIZE + 0.5
              const iy = r * CELL_SIZE + 0.5
              const dist = Math.hypot(ix - pointer.x, iy - pointer.y)
              if (dist < 135) {
                const alpha = (1 - dist / 135) * (dark ? 0.58 : 0.42)
                ctx.fillStyle = `rgba(${rgb}, ${alpha})`
                ctx.fillRect(ix - 1.5, iy - 1.5, 3, 3)
              }
            }
          }
        }

        // Sparse grid-locked traveling signal pulses
        for (const p of pulses) {
          if (advance) {
            p.pos += p.speed * p.dir
            const limit = p.horiz ? width : height
            if (p.dir > 0 && p.pos - p.len > limit) {
              p.pos = -24
              p.line = Math.floor(Math.random() * Math.max(1, p.horiz ? rows - 1 : cols - 1)) + 1
            } else if (p.dir < 0 && p.pos + p.len < 0) {
              p.pos = limit + 24
              p.line = Math.floor(Math.random() * Math.max(1, p.horiz ? rows - 1 : cols - 1)) + 1
            }
          }

          if (p.horiz) {
            const y = p.line * CELL_SIZE + 0.5
            const x0 = p.pos - p.len * p.dir
            const x1 = p.pos
            const g = ctx.createLinearGradient(x0, y, x1, y)
            g.addColorStop(0, `rgba(${rgb}, 0)`)
            g.addColorStop(0.84, `rgba(${rgb}, ${dark ? 0.5 : 0.38})`)
            g.addColorStop(1, `rgba(${rgb}, ${dark ? 0.88 : 0.65})`)
            ctx.strokeStyle = g
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.moveTo(x0, y)
            ctx.lineTo(x1, y)
            ctx.stroke()

            ctx.fillStyle = `rgba(${rgb}, ${dark ? 0.88 : 0.68})`
            ctx.beginPath()
            ctx.arc(x1, y, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            const x = p.line * CELL_SIZE + 0.5
            const y0 = p.pos - p.len * p.dir
            const y1 = p.pos
            const g = ctx.createLinearGradient(x, y0, x, y1)
            g.addColorStop(0, `rgba(${rgb}, 0)`)
            g.addColorStop(0.84, `rgba(${rgb}, ${dark ? 0.5 : 0.38})`)
            g.addColorStop(1, `rgba(${rgb}, ${dark ? 0.88 : 0.65})`)
            ctx.strokeStyle = g
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.moveTo(x, y0)
            ctx.lineTo(x, y1)
            ctx.stroke()

            ctx.fillStyle = `rgba(${rgb}, ${dark ? 0.88 : 0.68})`
            ctx.beginPath()
            ctx.arc(x, y1, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Soft left + bottom fade so display headline and edge transitions stay crisp
      const leftFade = ctx.createLinearGradient(0, 0, width * 0.56, 0)
      leftFade.addColorStop(0, `rgba(${fadeColor}, 0.58)`)
      leftFade.addColorStop(1, `rgba(${fadeColor}, 0)`)
      ctx.fillStyle = leftFade
      ctx.fillRect(0, 0, width * 0.56, height)

      const bottomFade = ctx.createLinearGradient(0, height * 0.72, 0, height)
      bottomFade.addColorStop(0, `rgba(${fadeColor}, 0)`)
      bottomFade.addColorStop(1, `rgba(${fadeColor}, 0.92)`)
      ctx.fillStyle = bottomFade
      ctx.fillRect(0, height * 0.72, width, height * 0.28)
    }

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const tick = () => {
      drawFrame(true)
      rafId = requestAnimationFrame(tick)
    }

    const syncLoop = () => {
      if (!prefersReduced && isVisible && isTabVisible) {
        if (rafId === null) {
          rafId = requestAnimationFrame(tick)
        }
      } else {
        stopLoop()
        drawFrame(false)
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const rect = host.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.inside = true
    }

    const handlePointerLeave = () => {
      pointer.inside = false
    }

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden
      syncLoop()
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches
      syncLoop()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        syncLoop()
      },
      { threshold: 0.02 }
    )
    intersectionObserver.observe(host)

    host.addEventListener('pointermove', handlePointerMove, { passive: true })
    host.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    resize()
    syncLoop()

    return () => {
      stopLoop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      host.removeEventListener('pointermove', handlePointerMove)
      host.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
