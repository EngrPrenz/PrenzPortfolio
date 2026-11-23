import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Project } from '@/data/projects'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
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

const LegacyPortfolio = React.lazy(() => import('@/legacy/LegacyPortfolio'))

const PortfolioHome: React.FC = () => {
  const isRedesignEnabled = useFeatureFlag('redesign', undefined, true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (!isRedesignEnabled) {
    return (
      <React.Suspense
        fallback={<div className="min-h-[100dvh] bg-[var(--bg-primary)]" />}
      >
        <LegacyPortfolio />
      </React.Suspense>
    )
  }

  return (
    <>
      {/* Fixed tactile micro-grain across revamped Precision surface */}
      <div className="grain-overlay" aria-hidden="true" />
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
    </>
  )
}

const withAdminGrain = (node: React.ReactNode) => (
  <>
    <div className="grain-overlay" aria-hidden="true" />
    {node}
  </>
)

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/admin/login" element={withAdminGrain(<AdminLogin />)} />
      <Route
        path="/admin"
        element={withAdminGrain(
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
