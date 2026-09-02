import React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, GithubLogo, ShieldCheck } from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { StatusBadge } from './StatusBadge'
import { SkillBadge } from './SkillBadge'
import { GlowButton } from './GlowButton'

interface ProjectCardProps {
  project: Project
  variant?: 'featured' | 'gallery'
  index?: number
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'gallery',
}) => {
  const shouldReduceMotion = useReducedMotion()

  if (variant === 'featured') {
    return (
      <div className="relative rounded-2xl glass-card border border-[var(--border-primary)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_35px_var(--accent-neon-glow)] group">
        {/* Accent neon top line */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--accent-neon)] via-emerald-400 to-transparent" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="text-xs font-mono text-[var(--accent-neon)] bg-[var(--accent-neon-glow)] px-2.5 py-1 rounded border border-[var(--border-hover)]">
                {project.category}
              </span>
            </div>
            <span className="text-xs font-mono text-[var(--text-tertiary)]">
              {project.role}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base font-medium text-[var(--text-secondary)] mt-1">
            {project.subtitle}
          </p>

          {/* Description */}
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {project.longDescription || project.description}
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

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && (
              <GlowButton
                variant="solid"
                size="md"
                href={project.liveUrl}
                target="_blank"
                icon={<ArrowUpRight size={18} weight="bold" />}
              >
                Launch Production App
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
                Source Repository
              </GlowButton>
            )}
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
      className="flex flex-col h-full rounded-xl glass-card border border-[var(--border-primary)] p-6 transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_4px_25px_var(--accent-neon-glow)] group"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StatusBadge status={project.status} />
        <span className="text-xs font-mono text-[var(--text-tertiary)]">
          {project.category}
        </span>
      </div>

      {/* Project Title */}
      <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors">
        {project.title}
      </h4>
      <p className="text-xs font-mono text-[var(--accent-neon)] mt-0.5">
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

      {/* Links */}
      <div className="flex items-center justify-between pt-2 mt-auto">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[var(--accent-neon)] hover:underline min-h-[44px]"
          >
            Open Live <ArrowUpRight size={14} weight="bold" />
          </a>
        ) : (
          <span className="text-xs font-mono text-[var(--text-tertiary)]">Coming Soon</span>
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
    </motion.div>
  )
}
