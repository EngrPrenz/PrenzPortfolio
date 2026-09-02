import React, { useState } from 'react'
import { projectsData, Project } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const FeaturedProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const featuredProjects = projectsData.filter((p) => p.featured)

  return (
    <section id="featured" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            title="Featured Engineering"
            subtitle="Selected production-ready applications demonstrating full-stack engineering and quality assurance. Click any project to inspect screenshots and specs."
            eyebrow="HIGHLIGHTED SYSTEMS"
          />
        </RevealOnScroll>

        <div className="space-y-12 mt-8">
          {featuredProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delay={idx * 0.15}>
              <ProjectCard
                project={project}
                variant="featured"
                onSelect={(p) => setSelectedProject(p)}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Project Detail & Screenshot Carousel Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
