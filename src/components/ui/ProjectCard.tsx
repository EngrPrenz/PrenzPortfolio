import React from 'react'
import { ArrowUpRight, GithubLogo, Images } from '@phosphor-icons/react'
import { Project } from '@/data/projects'
import { StatusBadge } from './StatusBadge'
import { SkillBadge } from './SkillBadge'
import { GlowButton } from './GlowButton'
import { SpotlightCard } from './SpotlightCard'

interface ProjectCardProps {
  project: Project
  variant?: 'spotlight' | 'standard'
  onSelect?: (project: Project) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'standard',
  onSelect,
}) => {
  const primaryScreenshot = project.screenshots?.[0] || '/projects/ursachub/1.png'
  const shotCount = project.screenshots?.length || 1

  if (variant === 'spotlight') {
    return (
      <SpotlightCard
        as="article"
        className="rounded-xl surface-card-interactive grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="relative z-[2] lg:col-span-7 bg-[var(--media-canvas)] border-b lg:border-b-0 lg:border-r border-[var(--border-primary)]">
          <button
            type="button"
            onClick={() => onSelect?.(project)}
            aria-label={`Inspect ${project.title} screenshots and technical specifications`}
            className="group block w-full h-full aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
          >
            <img
              src={primaryScreenshot}
              alt={`${project.title} application screenshot`}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
              loading="lazy"
            />
          </button>
        </div>

        <div className="relative z-[2] lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                {project.role}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
              <button
                type="button"
                onClick={() => onSelect?.(project)}
                className="text-left hover:text-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm"
              >
                {project.title}
              </button>
            </h3>

            <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
              {project.subtitle}
            </p>

            <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.description}
            </p>

            {project.metrics && project.metrics.length > 0 && (
              <dl className="mt-5 pt-4 border-t border-[var(--border-primary)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-3">
                {project.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                      {metric.label}
                    </dt>
                    <dd className="text-xs sm:text-sm font-medium font-mono text-[var(--text-primary)] tabular-nums mt-0.5">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 6).map((tech) => (
                <SkillBadge key={tech} name={tech} />
              ))}
              {project.techStack.length > 6 && (
                <span className="text-xs font-mono text-[var(--text-tertiary)] self-center px-1 tabular-nums">
                  +{project.techStack.length - 6}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-primary)] flex flex-wrap items-center gap-2.5">
            <GlowButton
              variant="solid"
              size="sm"
              onClick={() => onSelect?.(project)}
              icon={<Images size={15} weight="regular" />}
            >
              Inspect Details ({shotCount})
            </GlowButton>

            {project.liveUrl && (
              <GlowButton
                variant="outline"
                size="sm"
                href={project.liveUrl}
                target="_blank"
                icon={<ArrowUpRight size={15} weight="bold" />}
              >
                Live Site
              </GlowButton>
            )}

            {project.githubUrl && (
              <GlowButton
                variant="ghost"
                size="sm"
                href={project.githubUrl}
                target="_blank"
                icon={<GithubLogo size={15} weight="regular" />}
              >
                Source Code
              </GlowButton>
            )}
          </div>
        </div>
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard
      as="article"
      className="flex flex-col h-full rounded-xl surface-card-interactive"
    >
      <button
        type="button"
        onClick={() => onSelect?.(project)}
        aria-label={`Inspect ${project.title} screenshots and technical specifications`}
        className="group relative z-[2] block aspect-[16/10] w-full overflow-hidden bg-[var(--media-canvas)] border-b border-[var(--border-primary)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
      >
        <img
          src={primaryScreenshot}
          alt={`${project.title} application preview`}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
          loading="lazy"
        />
      </button>

      <div className="relative z-[2] p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={project.status} />
          <span className="text-xs font-mono text-[var(--text-tertiary)] truncate">
            {project.category}
          </span>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
          <button
            type="button"
            onClick={() => onSelect?.(project)}
            className="text-left hover:text-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm"
          >
            {project.title}
          </button>
        </h3>

        <p className="text-xs text-[var(--text-tertiary)] mt-1">{project.role}</p>

        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        {project.metrics && project.metrics[0] && (
          <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex items-baseline justify-between gap-3 text-xs">
            <span className="font-mono text-[var(--text-tertiary)]">{project.metrics[0].label}</span>
            <span className="font-mono font-medium text-[var(--text-primary)] tabular-nums text-right">
              {project.metrics[0].value}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <SkillBadge key={tech} name={tech} />
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs font-mono text-[var(--text-tertiary)] self-center px-1 tabular-nums">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 mt-5 border-t border-[var(--border-primary)]">
          <button
            type="button"
            onClick={() => onSelect?.(project)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
          >
            <Images size={15} aria-hidden="true" />
            <span>Inspect Details ({shotCount})</span>
          </button>

          <div className="flex items-center gap-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live site for ${project.title}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View GitHub repository for ${project.title}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <GithubLogo size={18} weight="regular" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
