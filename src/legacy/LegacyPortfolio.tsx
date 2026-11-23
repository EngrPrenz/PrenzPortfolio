import React from 'react'
import { Navbar } from '@/legacy/layout/Navbar'
import { Footer } from '@/legacy/layout/Footer'
import { Hero } from '@/legacy/sections/Hero'
import { About } from '@/legacy/sections/About'
import { FeaturedProjects } from '@/legacy/sections/FeaturedProjects'
import { ProjectsGallery } from '@/legacy/sections/ProjectsGallery'
import { Skills } from '@/legacy/sections/Skills'
import { Certifications } from '@/legacy/sections/Certifications'
import { Contact } from '@/legacy/sections/Contact'
import './legacy.css'

const LegacyPortfolio: React.FC = () => {
  return (
    <div className="legacy-v1 relative min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <ProjectsGallery />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default LegacyPortfolio
