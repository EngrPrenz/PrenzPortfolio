import React, { useEffect, useId, useRef, useState } from 'react'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Hobby, getHobbyImages } from '@/types/hobby'
import { useDialogModal } from '@/hooks/useDialogModal'

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

export const HobbyModal: React.FC<HobbyModalProps> = ({ hobby, icon, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const pendingTargetRef = useRef<number | null>(null)
  const scrollStartLeftRef = useRef<number | null>(null)
  const settledSlideRef = useRef<number>(0)
  const rafIdRef = useRef<number | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const images = hobby ? getHobbyImages(hobby) : []

  useEffect(() => {
    if (hobby) {
      setCurrentSlide(0)
      settledSlideRef.current = 0
      pendingTargetRef.current = null
      scrollStartLeftRef.current = null
      setAnnouncement('')
      if (trackRef.current) {
        trackRef.current.scrollLeft = 0
      }
    }
  }, [hobby])

  useDialogModal(dialogRef, Boolean(hobby), onClose, { lightDismiss: true })

  // Sync thumbnail selection and live announcement with native scroll-snap track
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

    const supportsScrollEnd = 'onscrollend' in window

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
      {...({ closedby: 'any' } as Record<string, string>)}
      className="portfolio-dialog m-auto w-[min(92vw,54rem)] max-h-[90dvh] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {hobby && (
        <>
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-mono text-[var(--text-tertiary)] block">
                  {hobby.category}
                </span>
                <h1
                  id={titleId}
                  className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-tight"
                >
                  {hobby.title}
                </h1>
              </div>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close hobby details"
              className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <X size={20} weight="regular" aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5">
            {images.length === 1 && (
              <div className="rounded-lg overflow-hidden border border-[var(--border-primary)] bg-[var(--media-canvas)] flex items-center justify-center">
                <img
                  src={images[0]}
                  alt={hobby.title}
                  className="w-full max-h-[56vh] object-contain select-none"
                />
              </div>
            )}

            {images.length > 1 && (
              <section
                aria-roledescription="carousel"
                aria-label={`${hobby.title} photo gallery`}
                className="space-y-3"
              >
                <div className="relative rounded-lg overflow-hidden border border-[var(--border-primary)] bg-[var(--media-canvas)]">
                  <div className="pointer-events-none absolute inset-y-0 inset-x-0 z-10 flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={() => handleStep(-1)}
                      aria-label="Previous photo"
                      className="pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px] rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] inline-flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <CaretLeft size={20} weight="bold" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStep(1)}
                      aria-label="Next photo"
                      className="pointer-events-auto touch-manipulation min-h-[44px] min-w-[44px] rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] inline-flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <CaretRight size={20} weight="bold" aria-hidden="true" />
                    </button>
                  </div>

                  <div
                    ref={trackRef}
                    className="hobby-carousel-track relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
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
                        className="hobby-carousel-slide flex items-center justify-center bg-[var(--media-canvas)]"
                      >
                        <img
                          src={img}
                          alt={`${hobby.title} photo ${idx + 1} of ${images.length}`}
                          className="w-full max-h-[54vh] object-contain select-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-[var(--text-tertiary)] tabular-nums">
                    Photo {currentSlide + 1} of {images.length}
                  </span>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                  {announcement}
                </p>

                <nav
                  aria-label="Choose a photo"
                  className="flex items-center gap-2 overflow-x-auto py-1"
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
                        className={`relative shrink-0 w-20 sm:w-24 h-12 sm:h-14 min-h-[44px] rounded-lg overflow-hidden bg-[var(--media-canvas)] transition-opacity cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                          isActive
                            ? 'border-2 border-[var(--accent)] opacity-100'
                            : 'border border-[var(--border-primary)] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  })}
                </nav>
              </section>
            )}

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {hobby.description}
            </p>
          </div>
        </>
      )}
    </dialog>
  )
}
