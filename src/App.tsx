import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ProjectsGallery } from '@/components/sections/ProjectsGallery'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

/**
 * Dynamic showcase banner controlled live by Vexlo Feature Flag Service
 */
const VexloBanner: React.FC = () => {
  const isEnabled = useFeatureFlag('show-vexlo-showcase')

  if (!isEnabled) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="relative overflow-hidden rounded-xl border border-[var(--badge-border)] bg-[var(--badge-bg)] p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-neon)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-neon)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-neon)]"></span>
            </span>
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent-neon)]">
                Live Feature Flag Active
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
                ✨ <strong>Vexlo Integration:</strong> This section is dynamically evaluated in real time by my self-hosted Feature Flag Service!
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
            flag: show-vexlo-showcase
          </span>
        </div>
      </div>
    </div>
  )
}

const PortfolioHome: React.FC = () => {
  // Initialize Lenis smooth scroll on home page
  useSmoothScroll()

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <Hero />
        <About />
        <VexloBanner />
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

export const App: React.FC = () => {
  return (
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
  )
}

export default App
