import React from 'react'
import { projectsData } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const FeaturedProjects: React.FC = () => {
  const featuredProjects = projectsData.filter((p) => p.featured)

  return (
    <section id="featured" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            title="Featured Engineering"
            subtitle="Selected production-ready applications demonstrating full-stack engineering and quality assurance."
          />
        </RevealOnScroll>

        <div className="space-y-12 mt-8">
          {featuredProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delay={idx * 0.15}>
              <ProjectCard project={project} variant="featured" />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
