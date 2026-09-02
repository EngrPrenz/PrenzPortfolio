import React from 'react'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ProjectsGallery } from '@/components/sections/ProjectsGallery'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll with touch & reduced-motion guards
  useSmoothScroll()

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <ProjectsGallery />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
