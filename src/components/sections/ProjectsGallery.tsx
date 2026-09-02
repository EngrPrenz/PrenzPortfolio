import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { projectsData, ProjectCategory } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const ProjectsGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All')

  const categories: ProjectCategory[] = ['All', 'Full Stack', 'QA & Testing', 'AR & Systems']

  const filteredProjects =
    activeFilter === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <SectionHeading
                title="Project Archive"
                subtitle="Explore past systems and upcoming initiatives across web, AR, and QA testing."
                eyebrow="SYSTEMS &amp; LABS"
                className="mb-0"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] self-start md:self-auto">
              {categories.map((category) => {
                const isActive = activeFilter === category
                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`relative px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer min-h-[38px] select-none ${
                      isActive
                        ? 'text-[#0a0a0a] font-bold dark:text-[#050505]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterTab"
                        className="absolute inset-0 rounded-lg bg-[var(--accent-neon)] shadow-[0_0_15px_var(--accent-neon-glow)] z-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* Dynamic Animated Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} variant="gallery" index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
