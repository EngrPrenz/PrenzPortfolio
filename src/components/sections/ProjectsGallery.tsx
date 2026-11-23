import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ProjectCategory, Project } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { useProjects } from '@/hooks/useProjects'

interface ProjectsGalleryProps {
  onSelectProject?: (project: Project) => void
}

const CATEGORIES: ProjectCategory[] = ['All', 'Full Stack', 'QA & Testing', 'AR & Systems']
const FLAGSHIP_PRIORITY = ['vexlo', 'salo-sa-antipolo', 'ursac-hub']

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All')
  const [localSelectedProject, setLocalSelectedProject] = useState<Project | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { projects } = useProjects()

  const handleSelect = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project)
    } else {
      setLocalSelectedProject(project)
    }
  }

  const orderedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      const aOrder = a.displayOrder && a.displayOrder > 0 ? a.displayOrder : Number.MAX_SAFE_INTEGER
      const bOrder = b.displayOrder && b.displayOrder > 0 ? b.displayOrder : Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      const aRank = FLAGSHIP_PRIORITY.indexOf(a.id)
      const bRank = FLAGSHIP_PRIORITY.indexOf(b.id)
      if (aRank !== -1 && bRank !== -1) return aRank - bRank
      if (aRank !== -1) return -1
      if (bRank !== -1) return 1
      return 0
    })
  }, [projects])

  const featuredProjects = useMemo(
    () => orderedProjects.filter((p) => p.featured),
    [orderedProjects]
  )

  const archiveProjects = useMemo(
    () => orderedProjects.filter((p) => !p.featured),
    [orderedProjects]
  )

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return orderedProjects
    return orderedProjects.filter((p) => p.category === activeFilter)
  }, [activeFilter, orderedProjects])

  const leadSpotlight = featuredProjects[0]
  const secondaryFeatured = featuredProjects.slice(1)

  return (
    <section
      id="projects"
      className="section-studio-light py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-primary)]"
    >
      {/* Backwards-compatible anchor for existing #featured links */}
      <span id="featured" aria-hidden="true" className="block -mt-20 pt-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <SectionHeading
            title="Selected Work"
            subtitle="Shipped full-stack platforms, real-time POS tools, and QA-verified systems. Open any project for screenshots and architecture notes."
            className="mb-0"
          />

          {/* Category Filter Controls with Spring Pill */}
          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-[var(--button-ghost-specular)] self-start lg:self-auto max-w-full overflow-x-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeFilter === category
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(category)}
                  className={`relative px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[38px] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isActive
                      ? 'text-[var(--accent-ink)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isActive &&
                    (shouldReduceMotion ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-[var(--accent)] shadow-[var(--button-specular)]"
                      />
                    ) : (
                      <motion.span
                        layoutId="projectFilterPill"
                        aria-hidden="true"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-md bg-[var(--accent)] shadow-[var(--button-specular)]"
                      />
                    ))}
                  <span className="relative z-10">{category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* All View: Deduplicated Editorial Hierarchy */}
        {activeFilter === 'All' ? (
          <div className="space-y-8">
            {leadSpotlight && (
              <ProjectCard
                project={leadSpotlight}
                variant="spotlight"
                onSelect={handleSelect}
              />
            )}

            {secondaryFeatured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryFeatured.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variant="standard"
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}

            {archiveProjects.length > 0 && (
              <div className="pt-8 border-t border-[var(--border-primary)]">
                <div className="flex items-baseline justify-between gap-4 mb-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                    Additional Systems &amp; Labs
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-tertiary)] tabular-nums">
                    {archiveProjects.length}{' '}
                    {archiveProjects.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {archiveProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      variant="standard"
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="standard"
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)] p-10 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              No projects are currently listed under {activeFilter}.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="mt-3 text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer min-h-[44px] px-3"
            >
              Show all projects
            </button>
          </div>
        )}
      </div>

      {!onSelectProject && (
        <ProjectModal
          project={localSelectedProject}
          onClose={() => setLocalSelectedProject(null)}
        />
      )}
    </section>
  )
}
