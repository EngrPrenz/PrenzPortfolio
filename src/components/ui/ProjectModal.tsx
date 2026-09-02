import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ArrowUpRight,
  GithubLogo,
} from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { GlowButton } from './GlowButton'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Reset slide index when project changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [project])

  // Keyboard navigation: Escape to close, Left/Right arrows to change slides
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : project.screenshots.length - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev < project.screenshots.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [project, onClose])

  if (!project) return null

  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : ['/projects/ursac-hub-full.png']

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0d1117] text-[#f0f6fc] border border-[#21262d] shadow-2xl z-10 p-5 sm:p-7 lg:p-9 flex flex-col gap-6"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#21262d]">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 mb-2">
                {project.categoryTag || 'SOFTWARE DEVELOPMENT'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase">
                {project.title}
              </h2>
              <p className="text-sm font-medium text-[#8b949e] mt-0.5">
                Role: <span className="text-[#c9d1d9]">{project.role}</span>
              </p>
            </div>

            {/* Circular Close Button */}
            <button
              onClick={onClose}
              aria-label="Close project modal"
              className="p-2.5 rounded-full bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          {/* Main 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Screenshot Carousel & Thumbnails */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Image Container */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-inner group flex items-center justify-center">
                <img
                  src={screenshots[currentSlide]}
                  alt={`${project.title} screenshot ${currentSlide + 1}`}
                  className="w-full h-full object-contain bg-[#0a0d12] select-none transition-opacity duration-200"
                  onError={(e) => {
                    // Fallback to placeholder if file is missing
                    ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
                  }}
                />

                {/* Left & Right Navigation Arrows */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      aria-label="Previous screenshot"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/10"
                    >
                      <CaretLeft size={22} weight="bold" />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next screenshot"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#00ff88] hover:text-[#0a0a0a] transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/10"
                    >
                      <CaretRight size={22} weight="bold" />
                    </button>
                  </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/10">
                  {currentSlide + 1} / {screenshots.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {screenshots.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
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
                <h4 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                  Project Overview
                </h4>
                <p className="text-sm text-[#8b949e] leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Key Features & Highlights */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                    Key Features &amp; Highlights
                  </h4>
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
                        />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies & Tools */}
              <div>
                <h4 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                  Technologies &amp; Tools
                </h4>
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
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
