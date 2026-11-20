import React, { useState, useEffect, useId, useRef } from 'react'
import {
  X,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ArrowUpRight,
  GithubLogo,
  ArrowsOutSimple,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { GlowButton } from './GlowButton'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const dispatchedOpenRef = useRef(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isNativeScale, setIsNativeScale] = useState(false)

  const screenshots =
    project?.screenshots && project.screenshots.length > 0
      ? project.screenshots
      : ['/projects/ursachub/1.png']

  // Open or close native top-layer <dialog> cleanly when selected project changes
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (project) {
      setCurrentSlide(0)
      setIsLightboxOpen(false)
      setIsNativeScale(false)
      if (!dialog.open) {
        dialog.showModal()
      }
      if (!dispatchedOpenRef.current) {
        dispatchedOpenRef.current = true
        window.dispatchEvent(new CustomEvent('prenz:modal-open'))
      }
    } else {
      if (lightboxRef.current?.open) {
        lightboxRef.current.close()
      }
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [project])

  // Manage nested full-scale lightbox <dialog>
  useEffect(() => {
    const lb = lightboxRef.current
    if (!lb) return

    if (isLightboxOpen && project) {
      if (!lb.open) {
        lb.showModal()
      }
    } else if (lb.open) {
      lb.close()
    }
  }, [isLightboxOpen, project])

  // Sync React state when browser closes the project dialog (Esc, Close button, or light dismiss)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      dialog.returnValue = ''
      setIsLightboxOpen(false)
      setIsNativeScale(false)
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

  // Sync React state when browser closes the lightbox dialog
  useEffect(() => {
    const lb = lightboxRef.current
    if (!lb) return

    const handleLbClose = (e: Event) => {
      e.stopPropagation()
      lb.returnValue = ''
      setIsLightboxOpen(false)
      setIsNativeScale(false)
    }

    lb.addEventListener('close', handleLbClose)
    return () => {
      lb.removeEventListener('close', handleLbClose)
    }
  }, [])

  // Mandatory Safari light-dismiss fallback where HTMLDialogElement.prototype.closedBy is missing
  useEffect(() => {
    if ('closedBy' in HTMLDialogElement.prototype) return

    const attachLightDismiss = (dialog: HTMLDialogElement | null) => {
      if (!dialog) return () => {}
      let pressedOutside = false
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect()
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
      }

      const handlePointerDown = (e: PointerEvent) => {
        if (e.target !== dialog) {
          pressedOutside = false
          return
        }
        pressedOutside = isOutside(e)
      }

      const handlePointerUp = (e: PointerEvent) => {
        if (e.target === dialog && pressedOutside && isOutside(e) && dialog.open) {
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
    }

    const cleanupMain = attachLightDismiss(dialogRef.current)
    const cleanupLb = attachLightDismiss(lightboxRef.current)
    return () => {
      cleanupMain()
      cleanupLb()
    }
  }, [])

  // Left/Right arrow navigation for slides
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, screenshots.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as any)}
      className="project-dialog m-auto w-[min(94vw,72rem)] max-h-[92dvh] p-0 flex-col rounded-2xl bg-[#0d1117] text-[#f0f6fc] border border-[#21262d] shadow-2xl overflow-hidden"
    >
      {project && (
        <>
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 border-b border-[#21262d] bg-[#161b22]/60 shrink-0">
            <div className="min-w-0">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 mb-2">
                {project.categoryTag || 'SOFTWARE DEVELOPMENT'}
              </span>
              <h2
                id={titleId}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase"
              >
                {project.title}
              </h2>
              <p className="text-sm font-medium text-[#8b949e] mt-0.5">
                Role: <span className="text-[#c9d1d9]">{project.role}</span>
              </p>
            </div>

            {/* Circular Close Button */}
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close project modal"
              className="p-2.5 rounded-full bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff88]"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Modal Body — data-lenis-prevent allows native wheel scrolling inside modal */}
          <div
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain p-5 sm:p-7 lg:p-9 flex-1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Screenshot Carousel & Thumbnails */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Main Image Container — Clickable to inspect at full scale */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-inner group flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNativeScale(false)
                      setIsLightboxOpen(true)
                    }}
                    aria-label={`View full-scale image ${currentSlide + 1} of ${screenshots.length}`}
                    className="w-full h-full flex items-center justify-center cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff88]"
                  >
                    <img
                      src={screenshots[currentSlide]}
                      alt={`${project.title} screenshot ${currentSlide + 1}`}
                      className="w-full h-full object-contain bg-[#0a0d12] select-none transition-transform duration-200 group-hover:scale-[1.01]"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
                      }}
                    />
                  </button>

                  {/* Full-scale Expand Hint Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNativeScale(false)
                      setIsLightboxOpen(true)
                    }}
                    aria-label="Open full-scale image viewer"
                    className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-[#00ff88] text-white hover:text-[#0a0a0a] backdrop-blur-md text-xs font-mono font-semibold border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                  >
                    <ArrowsOutSimple size={14} weight="bold" aria-hidden="true" />
                    <span className="hidden sm:inline">Full Scale</span>
                  </button>

                  {/* Left & Right Navigation Arrows */}
                  {screenshots.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous screenshot"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/10"
                      >
                        <CaretLeft size={22} weight="bold" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next screenshot"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/10"
                      >
                        <CaretRight size={22} weight="bold" aria-hidden="true" />
                      </button>
                    </>
                  )}

                  {/* Counter Badge */}
                  <div className="pointer-events-none absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/10">
                    {currentSlide + 1} / {screenshots.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                {screenshots.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {screenshots.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`View screenshot ${idx + 1}`}
                        className={`relative shrink-0 w-20 sm:w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          currentSlide === idx
                            ? 'border-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.5)] scale-105'
                            : 'border-[#30363d] opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover bg-[#161b22]"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Project Details & Features */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Project Overview */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                    Project Overview
                  </h3>
                  <p className="text-sm text-[#8b949e] leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Key Features & Highlights */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                      Key Features &amp; Highlights
                    </h3>
                    <div className="space-y-2">
                      {project.keyFeatures.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-[#30363d]/70 text-xs sm:text-sm text-[#c9d1d9]"
                        >
                          <CheckCircle
                            size={18}
                            weight="bold"
                            className="text-[#00ff88] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies & Tools */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                    Technologies &amp; Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#21262d] text-[#e6edf3] border border-[#30363d]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto">
                  {project.liveUrl && (
                    <GlowButton
                      variant="solid"
                      size="md"
                      href={project.liveUrl}
                      target="_blank"
                      icon={<ArrowUpRight size={18} weight="bold" />}
                      className="flex-1 min-w-[140px]"
                    >
                      Live Preview
                    </GlowButton>
                  )}
                  {project.githubUrl && (
                    <GlowButton
                      variant="ghost"
                      size="md"
                      href={project.githubUrl}
                      target="_blank"
                      icon={<GithubLogo size={18} weight="bold" />}
                      className="flex-1 min-w-[140px]"
                    >
                      Source Code
                    </GlowButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nested Top-Layer Full-Scale Lightbox Dialog */}
          <dialog
            ref={lightboxRef}
            aria-label={`${project.title} full-scale screenshot viewer`}
            {...({ closedby: 'any' } as any)}
            className="lightbox-dialog m-auto w-[96vw] h-[94dvh] max-w-none max-h-none p-0 flex-col rounded-2xl bg-[#07090d]/95 text-white border border-[#30363d] shadow-2xl overflow-hidden"
          >
            {/* Lightbox Top Toolbar */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded-md bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30 text-xs font-mono font-bold shrink-0">
                  {currentSlide + 1} / {screenshots.length}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#c9d1d9] truncate">
                  {project.title} — Screenshot #{currentSlide + 1}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Toggle Fit-to-Screen vs 1:1 Native Resolution */}
                <button
                  type="button"
                  onClick={() => setIsNativeScale((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-[#e6edf3] border border-[#30363d] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                  title={isNativeScale ? 'Fit to screen' : 'Zoom to actual pixel size (100%)'}
                >
                  {isNativeScale ? (
                    <>
                      <MagnifyingGlassMinus size={16} weight="bold" className="text-[#00ff88]" />
                      <span>Fit Screen</span>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassPlus size={16} weight="bold" className="text-[#00ff88]" />
                      <span>Actual Size (1:1)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => lightboxRef.current?.close()}
                  aria-label="Close full-scale image viewer"
                  className="p-2 rounded-lg bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <X size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Viewport */}
            <div
              data-lenis-prevent
              className={`relative flex-1 overflow-auto overscroll-contain flex ${
                isNativeScale ? 'items-start justify-start p-4' : 'items-center justify-center p-3 sm:p-6'
              }`}
            >
              <img
                src={screenshots[currentSlide]}
                alt={`${project.title} full-scale screenshot ${currentSlide + 1}`}
                onClick={() => setIsNativeScale((prev) => !prev)}
                title={isNativeScale ? 'Click to fit screen' : 'Click to zoom 1:1 original size'}
                className={
                  isNativeScale
                    ? 'max-w-none max-h-none w-auto h-auto mx-auto cursor-zoom-out select-none rounded-lg shadow-2xl'
                    : 'max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in select-none rounded-lg shadow-2xl'
                }
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
                }}
              />

              {/* Floating Prev / Next Arrows */}
              {screenshots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous screenshot"
                    className="fixed left-4 sm:left-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-md cursor-pointer border border-white/15 shadow-xl z-20"
                  >
                    <CaretLeft size={24} weight="bold" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next screenshot"
                    className="fixed right-4 sm:right-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-md cursor-pointer border border-white/15 shadow-xl z-20"
                  >
                    <CaretRight size={24} weight="bold" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </dialog>
        </>
      )}
    </dialog>
  )
}
