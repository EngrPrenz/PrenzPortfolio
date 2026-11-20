import React, { useEffect, useId, useRef, useState } from 'react'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Hobby, getHobbyImages } from '@/types/hobby'

interface HobbyModalProps {
  hobby: Hobby | null
  icon: React.ReactNode
  onClose: () => void
}

const getNearestSlideIndex = (track: HTMLDivElement): number => {
  const slides = Array.from(track.children) as HTMLElement[]
  if (slides.length === 0) return 0

  let nearestIdx = 0
  let minDiff = Infinity
  for (let i = 0; i < slides.length; i++) {
    const diff = Math.abs(slides[i].offsetLeft - track.scrollLeft)
    if (diff < minDiff) {
      minDiff = diff
      nearestIdx = i
    }
  }
  return nearestIdx
}

/**
 * Native modal dialog displaying full hobby details and a multi-photo scroll-snap carousel.
 */
export const HobbyModal: React.FC<HobbyModalProps> = ({ hobby, icon, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const dispatchedOpenRef = useRef(false)
  const pendingTargetRef = useRef<number | null>(null)
  const scrollStartLeftRef = useRef<number | null>(null)
  const settledSlideRef = useRef<number>(0)
  const rafIdRef = useRef<number | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const images = hobby ? getHobbyImages(hobby) : []

  // Open or close native top-layer <dialog> cleanly when selected hobby changes
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (hobby) {
      setCurrentSlide(0)
      settledSlideRef.current = 0
      pendingTargetRef.current = null
      scrollStartLeftRef.current = null
      setAnnouncement('')
      if (trackRef.current) {
        trackRef.current.scrollLeft = 0
      }
      if (!dialog.open) {
        dialog.showModal()
      }
      if (!dispatchedOpenRef.current) {
        dispatchedOpenRef.current = true
        window.dispatchEvent(new CustomEvent('prenz:modal-open'))
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [hobby])

  // Sync React state when browser closes the dialog (Esc, Close button, or light dismiss)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      dialog.returnValue = ''
      if (dispatchedOpenRef.current) {
        dispatchedOpenRef.current = false
        window.dispatchEvent(new CustomEvent('prenz:modal-close'))
      }
      onCloseRef.current()
    }

    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      if (dispatchedOpenRef.current) {
        dispatchedOpenRef.current = false
        window.dispatchEvent(new CustomEvent('prenz:modal-close'))
      }
    }
  }, [])

  // Mandatory Safari light-dismiss fallback where HTMLDialogElement.prototype.closedBy is missing
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return

    let pressedOutside = false
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }

    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e)
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e) && dialog.open) {
        dialog.close()
      }
      pressedOutside = false
    }

    dialog.addEventListener('pointerdown', handlePointerDown)
    dialog.addEventListener('pointerup', handlePointerUp)
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown)
      dialog.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  // Keep thumbnail markers & live status synced with native scroll-snap track
  useEffect(() => {
    const track = trackRef.current
    if (!track || !hobby || images.length <= 1) return

    const handleSettle = () => {
      const target = pendingTargetRef.current
      const settled = getNearestSlideIndex(track)

      if (
        target !== null &&
        settled !== target &&
        scrollStartLeftRef.current !== null &&
        Math.abs(track.scrollLeft - scrollStartLeftRef.current) < 2
      ) {
        return
      }

      pendingTargetRef.current = null
      scrollStartLeftRef.current = null
      setCurrentSlide(settled)

      if (settled !== settledSlideRef.current) {
        settledSlideRef.current = settled
        setAnnouncement(`Photo ${settled + 1} of ${images.length}`)
      }
    }

    // Lenis attaches a window capture-phase scrollend listener that calls e.stopPropagation(),
    // preventing descendant scroll containers from receiving native scrollend events.
    const supportsScrollEnd =
      'onscrollend' in window && !document.documentElement.classList.contains('lenis')

    const handleScroll = () => {
      if (pendingTargetRef.current === null) {
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = requestAnimationFrame(() => {
          const nearest = getNearestSlideIndex(track)
          setCurrentSlide((prev) => (prev === nearest ? prev : nearest))
          rafIdRef.current = null
        })
      }

      if (!supportsScrollEnd) {
        if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = window.setTimeout(handleSettle, 120)
      }
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    if (supportsScrollEnd) {
      track.addEventListener('scrollend', handleSettle)
    }

    return () => {
      track.removeEventListener('scroll', handleScroll)
      if (supportsScrollEnd) {
        track.removeEventListener('scrollend', handleSettle)
      }
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
      if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current)
    }
  }, [hobby, images.length])

  const goToSlide = (targetIdx: number) => {
    const track = trackRef.current
    if (!track || images.length <= 1) return

    const bounded = ((targetIdx % images.length) + images.length) % images.length
    const slide = track.children[bounded] as HTMLElement | undefined
    if (!slide) return

    pendingTargetRef.current = bounded
    scrollStartLeftRef.current = track.scrollLeft
    setCurrentSlide(bounded)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })

    if (prefersReducedMotion || Math.abs(track.scrollLeft - slide.offsetLeft) < 2) {
      pendingTargetRef.current = null
      scrollStartLeftRef.current = null
      if (settledSlideRef.current !== bounded) {
        settledSlideRef.current = bounded
        setAnnouncement(`Photo ${bounded + 1} of ${images.length}`)
      }
    }
  }

  const handleStep = (delta: number) => {
    const baseIndex = pendingTargetRef.current ?? currentSlide
    goToSlide(baseIndex + delta)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as any)}
      className="hobby-dialog m-auto w-[min(92vw,56rem)] max-h-[90dvh] p-0 flex-col rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {hobby && (
        <>
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/80 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-neon)] font-semibold block">
                  {hobby.category}
                </span>
                <h2
                  id={titleId}
                  className="font-mono font-bold text-lg sm:text-2xl text-[var(--text-primary)] leading-tight"
                >
                  {hobby.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close hobby details"
              className="p-2.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-neon)] border border-[var(--border-primary)] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6"
          >
            {images.length === 1 && (
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[#080a0c] flex items-center justify-center">
                <img
                  src={images[0]}
                  alt={hobby.title}
                  className="w-full max-h-[58vh] object-contain select-none"
                />
              </div>
            )}

            {images.length > 1 && (
              <section
                aria-roledescription="carousel"
                aria-label={`${hobby.title} photo gallery`}
                className="space-y-3"
              >
                <div className="relative rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[#080a0c]">
                  {/* Previous / Next Controls placed before the track in DOM order */}
                  <div className="pointer-events-none absolute inset-y-0 inset-x-0 z-10 flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={() => handleStep(-1)}
                      aria-label="Previous photo"
                      className="pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px] rounded-full bg-black/75 text-white border border-white/20 hover:bg-[var(--accent-neon)] hover:text-black hover:border-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <CaretLeft size={20} weight="bold" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStep(1)}
                      aria-label="Next photo"
                      className="pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px] rounded-full bg-black/75 text-white border border-white/20 hover:bg-[var(--accent-neon)] hover:text-black hover:border-[var(--accent-neon)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <CaretRight size={20} weight="bold" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Scroll-Snap Track */}
                  <div
                    ref={trackRef}
                    className="hobby-carousel-track relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)]"
                    tabIndex={0}
                    role="group"
                    aria-label="Photos"
                  >
                    {images.map((img, idx) => (
                      <div
                        key={`${img}-${idx}`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} of ${images.length}`}
                        className="hobby-carousel-slide flex items-center justify-center bg-[#080a0c]"
                      >
                        <img
                          src={img}
                          alt={`${hobby.title} — photo ${idx + 1} of ${images.length}`}
                          className="w-full max-h-[56vh] object-contain select-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Counter Pill */}
                  <div className="pointer-events-none absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/15">
                    {currentSlide + 1} / {images.length}
                  </div>
                </div>

                {/* Screen-reader live announcement after scroll settles */}
                <p className="sr-only" role="status" aria-live="polite">
                  {announcement}
                </p>

                {/* Thumbnail Markers */}
                <nav
                  aria-label="Choose a photo"
                  className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5"
                >
                  {images.map((img, idx) => {
                    const isActive = currentSlide === idx
                    return (
                      <button
                        key={`${img}-thumb-${idx}`}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to photo ${idx + 1} of ${images.length}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={`relative shrink-0 w-20 sm:w-24 h-12 sm:h-14 min-h-[44px] rounded-lg overflow-hidden bg-[#080a0c] transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-neon)] ${
                          isActive
                            ? 'border-2 border-[var(--accent-neon)] ring-2 ring-[var(--accent-neon)]/70 scale-[1.03] opacity-100'
                            : 'border border-[var(--border-primary)] opacity-60 hover:opacity-95'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-1.5 bottom-1 h-1 rounded-full bg-[var(--accent-neon)]"
                          />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </section>
            )}

            {/* Full Hobby Description */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-neon)]">
                About This Hobby
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {hobby.description}
              </p>
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}
