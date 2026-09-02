import React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, GithubLogo, ShieldCheck, Eye, Images } from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { StatusBadge } from './StatusBadge'
import { SkillBadge } from './SkillBadge'
import { GlowButton } from './GlowButton'

interface ProjectCardProps {
  project: Project
  variant?: 'featured' | 'gallery'
  index?: number
  onSelect?: (project: Project) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'gallery',
  onSelect,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const primaryScreenshot = project.screenshots?.[0] || '/projects/ursac-hub-full.png'

  if (variant === 'featured') {
    return (
      <div className="relative rounded-2xl glass-card border border-[var(--border-primary)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_35px_var(--accent-neon-glow)] group">
        {/* Accent neon top line */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--accent-neon)] via-emerald-400 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center">
          {/* Left Column: Project Info */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Header info */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={project.status} />
                  <span className="text-xs font-mono text-[var(--accent-neon)] bg-[var(--accent-neon-glow)] px-2.5 py-1 rounded border border-[var(--border-hover)] font-bold">
                    {project.categoryTag || project.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--text-tertiary)]">
                  {project.role}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3
                onClick={() => onSelect?.(project)}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors cursor-pointer"
              >
                {project.title}
              </h3>
              <p className="text-sm sm:text-base font-medium text-[var(--text-secondary)] mt-1">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {project.description}
              </p>

              {/* Architecture / QA Metrics Pill Grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 pt-4 border-t border-[var(--border-primary)]">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)]"
                    >
                      <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={14} className="text-[var(--accent-neon)]" />
                        {m.label}
                      </div>
                      <div className="text-sm font-semibold font-mono text-[var(--text-primary)] mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {project.techStack.map((tech) => (
                  <SkillBadge key={tech} name={tech} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <GlowButton
                variant="solid"
                size="md"
                onClick={() => onSelect?.(project)}
                icon={<Eye size={18} weight="bold" />}
              >
                View Screenshots &amp; Specs
              </GlowButton>

              {project.liveUrl && (
                <GlowButton
                  variant="outline"
                  size="md"
                  href={project.liveUrl}
                  target="_blank"
                  icon={<ArrowUpRight size={18} weight="bold" />}
                >
                  Live Demo
                </GlowButton>
              )}

              {project.githubUrl && (
                <GlowButton
                  variant="ghost"
                  size="md"
                  href={project.githubUrl}
                  target="_blank"
                  icon={<GithubLogo size={18} weight="bold" />}
                >
                  Source Code
                </GlowButton>
              )}
            </div>
          </div>

          {/* Right Column: Screenshot Preview Banner */}
          <div
            onClick={() => onSelect?.(project)}
            className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden bg-[#10141d] border border-[var(--border-primary)] group/img cursor-pointer shadow-lg transition-all duration-300 hover:border-[var(--accent-neon)] hover:shadow-[0_0_30px_var(--accent-neon-glow)]"
          >
            <img
              src={primaryScreenshot}
              alt={`${project.title} preview`}
              className="w-full h-full object-contain bg-[#0a0d14] group-hover/img:scale-105 transition-transform duration-500"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
              }}
            />

            {/* Overlay prompt on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="p-3 rounded-full bg-[var(--accent-neon)] text-[#0a0a0a]">
                <Images size={24} weight="bold" />
              </div>
              <span className="text-sm font-mono font-bold text-white tracking-wide">
                Click to Open Screenshot Gallery ({project.screenshots?.length || 1} Images)
              </span>
            </div>

            {/* Slide Count Pill */}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-mono font-semibold text-white border border-white/10 flex items-center gap-1.5">
              <Images size={14} className="text-[var(--accent-neon)]" />
              <span>{project.screenshots?.length || 1} Shots</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Gallery Card Variant
  return (
    <motion.div
      layout={!shouldReduceMotion}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className="flex flex-col h-full rounded-xl glass-card border border-[var(--border-primary)] overflow-hidden transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_4px_25px_var(--accent-neon-glow)] group"
    >
      {/* Thumbnail Banner */}
      <div
        onClick={() => onSelect?.(project)}
        className="relative aspect-video w-full overflow-hidden bg-[#10141d] border-b border-[var(--border-primary)] cursor-pointer group/thumb"
      >
        <img
          src={primaryScreenshot}
          alt={project.title}
          className="w-full h-full object-contain bg-[#0a0d14] group-hover/thumb:scale-105 transition-transform duration-300"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/projects/ursac-hub-2.svg'
          }}
        />

        {/* Hover overlay badge */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-[var(--accent-neon)] text-[#0a0a0a] text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
            <Eye size={16} weight="bold" /> View Gallery
          </span>
        </div>

        {/* Image count */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[11px] font-mono text-white/90 border border-white/10">
          {project.screenshots?.length || 1} shots
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={project.status} />
          <span className="text-xs font-mono text-[var(--accent-neon)] font-medium">
            {project.categoryTag || project.category}
          </span>
        </div>

        {/* Project Title */}
        <h4
          onClick={() => onSelect?.(project)}
          className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors cursor-pointer"
        >
          {project.title}
        </h4>
        <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
          {project.role}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 my-4 pt-3 border-t border-[var(--border-primary)]">
          {project.techStack.slice(0, 4).map((tech) => (
            <SkillBadge key={tech} name={tech} />
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs font-mono text-[var(--text-tertiary)] self-center pl-1">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links and Modal Trigger */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[var(--border-primary)]">
          <button
            onClick={() => onSelect?.(project)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-neon)] hover:underline min-h-[44px] cursor-pointer"
          >
            <Images size={16} /> Inspect Shots
          </button>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live demo for ${project.title}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-neon)] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowUpRight size={18} weight="bold" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.title}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-neon)] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <GithubLogo size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
