import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Project } from '@/data/projects'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ProjectsGallery } from '@/components/sections/ProjectsGallery'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Certifications } from '@/components/sections/Certifications'
import { Contact } from '@/components/sections/Contact'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

const PortfolioHome: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="relative min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Keyboard Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[var(--accent)] focus:text-[var(--accent-ink)] focus:text-sm focus:font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-[var(--text-primary)]"
      >
        Skip to main content
      </a>

      {/* Top Sentinel observed by Navbar IntersectionObserver (zero scroll listeners) */}
      <div
        id="top-sentinel"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-8 w-full"
      />

      <Navbar />

      <main id="main-content">
        <Hero />
        <ProjectsGallery onSelectProject={setSelectedProject} />
        <About />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <>
      {/* Fixed tactile micro-grain across public and admin surfaces */}
      <div className="grain-overlay" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
