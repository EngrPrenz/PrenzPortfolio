import React, { useState, useEffect, useId, useRef } from 'react'
import {
  X,
  CaretLeft,
  CaretRight,
  Check,
  ArrowUpRight,
  GithubLogo,
  ArrowsOutSimple,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { GlowButton } from './GlowButton'
import { SkillBadge } from './SkillBadge'
import { StatusBadge } from './StatusBadge'
import { useDialogModal } from '@/hooks/useDialogModal'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isNativeScale, setIsNativeScale] = useState(false)

  const screenshots =
    project?.screenshots && project.screenshots.length > 0
      ? project.screenshots
      : ['/projects/ursachub/1.png']

  useEffect(() => {
    if (project) {
      setCurrentSlide(0)
      setIsLightboxOpen(false)
      setIsNativeScale(false)
    }
  }, [project])

  useDialogModal(
    dialogRef,
    Boolean(project),
    () => {
      setIsLightboxOpen(false)
      setIsNativeScale(false)
      onClose()
    },
    { lightDismiss: true }
  )

  useDialogModal(
    lightboxRef,
    Boolean(project) && isLightboxOpen,
    () => {
      setIsLightboxOpen(false)
      setIsNativeScale(false)
    },
    { lightDismiss: true }
  )

  // Left/Right keyboard navigation while modal is open
  useEffect(() => {
    if (!project || screenshots.length <= 1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
      {...({ closedby: 'any' } as Record<string, string>)}
      className="portfolio-dialog m-auto w-[min(94vw,72rem)] max-h-[92dvh] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {project && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={project.status} />
                <span className="text-xs font-mono text-[var(--text-tertiary)]">
                  {project.categoryTag || project.category}
                </span>
              </div>
              <h1
                id={titleId}
                className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"
              >
                {project.title}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {project.role}
              </p>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close project details"
              className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <X size={20} weight="regular" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto overscroll-contain p-5 sm:p-7 lg:p-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Screenshot Viewer & Thumbnails */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--media-canvas)] border border-[var(--border-primary)] flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNativeScale(false)
                      setIsLightboxOpen(true)
                    }}
                    aria-label={`Open full-scale screenshot ${currentSlide + 1} of ${screenshots.length}`}
                    className="w-full h-full flex items-center justify-center cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
                  >
                    <img
                      src={screenshots[currentSlide]}
                      alt={`${project.title} screenshot ${currentSlide + 1}`}
                      className="w-full h-full object-contain select-none"
                    />
                  </button>

                  {screenshots.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous screenshot"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] border border-[var(--border-primary)] transition-colors inline-flex items-center justify-center backdrop-blur-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      >
                        <CaretLeft size={20} weight="bold" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next screenshot"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] border border-[var(--border-primary)] transition-colors inline-flex items-center justify-center backdrop-blur-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      >
                        <CaretRight size={20} weight="bold" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                {/* Controls Bar Below Image (zero pills overlaid on screenshot) */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-[var(--text-tertiary)] tabular-nums">
                    Screenshot {currentSlide + 1} of {screenshots.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNativeScale(false)
                      setIsLightboxOpen(true)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <ArrowsOutSimple size={14} weight="bold" aria-hidden="true" />
                    <span>Full Scale</span>
                  </button>
                </div>

                {/* Thumbnails */}
                {screenshots.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {screenshots.map((img, idx) => {
                      const isActive = currentSlide === idx
                      return (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Select screenshot ${idx + 1}`}
                          aria-current={isActive ? 'true' : undefined}
                          className={`relative shrink-0 w-20 sm:w-24 aspect-video min-h-[44px] rounded-lg overflow-hidden border-2 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                            isActive
                              ? 'border-[var(--accent)] opacity-100'
                              : 'border-[var(--border-primary)] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-cover bg-[var(--media-canvas)]"
                          />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right: Overview, Specs, Features & Actions */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Overview
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="pt-4 border-t border-[var(--border-primary)]">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                      Architecture &amp; Metrics
                    </h2>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                            {metric.label}
                          </dt>
                          <dd className="text-xs sm:text-sm font-mono font-medium text-[var(--text-primary)] tabular-nums mt-0.5">
                            {metric.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="pt-4 border-t border-[var(--border-primary)]">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                      Key Capabilities
                    </h2>
                    <ul className="space-y-2">
                      {project.keyFeatures.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] leading-snug"
                        >
                          <Check
                            size={16}
                            weight="bold"
                            className="text-[var(--accent)] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--border-primary)]">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2.5">
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <SkillBadge key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-primary)]">
                  {project.liveUrl && (
                    <GlowButton
                      variant="solid"
                      size="md"
                      href={project.liveUrl}
                      target="_blank"
                      icon={<ArrowUpRight size={17} weight="bold" />}
                      className="flex-1 min-w-[140px]"
                    >
                      Live Site
                    </GlowButton>
                  )}
                  {project.githubUrl && (
                    <GlowButton
                      variant="outline"
                      size="md"
                      href={project.githubUrl}
                      target="_blank"
                      icon={<GithubLogo size={17} weight="regular" />}
                      className="flex-1 min-w-[140px]"
                    >
                      Source Code
                    </GlowButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nested Full-Scale Lightbox Dialog */}
          <dialog
            ref={lightboxRef}
            aria-label={`${project.title} full-scale screenshot viewer`}
            {...({ closedby: 'any' } as Record<string, string>)}
            className="lightbox-dialog m-auto w-[96vw] h-[94dvh] max-w-none max-h-none p-0 flex-col rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] text-xs font-mono font-medium tabular-nums shrink-0">
                  {currentSlide + 1} / {screenshots.length}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
                  {project.title} - Screenshot {currentSlide + 1}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNativeScale((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] hover:border-[var(--border-hover)] text-[var(--text-primary)] border border-[var(--border-primary)] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {isNativeScale ? (
                    <>
                      <MagnifyingGlassMinus size={16} weight="bold" className="text-[var(--accent)]" aria-hidden="true" />
                      <span>Fit Screen</span>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassPlus size={16} weight="bold" className="text-[var(--accent)]" aria-hidden="true" />
                      <span>Actual Size (1:1)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => lightboxRef.current?.close()}
                  aria-label="Close full-scale image viewer"
                  className="p-2 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer min-h-[40px] min-w-[40px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <X size={18} weight="regular" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className={`relative flex-1 overflow-auto overscroll-contain bg-[var(--media-canvas)] flex ${
                isNativeScale ? 'items-start justify-start p-4' : 'items-center justify-center p-4 sm:p-6'
              }`}
            >
              <img
                src={screenshots[currentSlide]}
                alt={`${project.title} full-scale screenshot ${currentSlide + 1}`}
                onClick={() => setIsNativeScale((prev) => !prev)}
                className={
                  isNativeScale
                    ? 'max-w-none max-h-none w-auto h-auto mx-auto cursor-zoom-out select-none rounded-lg'
                    : 'max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in select-none rounded-lg'
                }
              />

              {screenshots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous screenshot"
                    className="fixed left-4 sm:left-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] border border-[var(--border-primary)] transition-colors inline-flex items-center justify-center backdrop-blur-sm cursor-pointer shadow-lg z-20"
                  >
                    <CaretLeft size={22} weight="bold" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next screenshot"
                    className="fixed right-4 sm:right-7 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-[var(--bg-secondary)]/90 text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] border border-[var(--border-primary)] transition-colors inline-flex items-center justify-center backdrop-blur-sm cursor-pointer shadow-lg z-20"
                  >
                    <CaretRight size={22} weight="bold" aria-hidden="true" />
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
