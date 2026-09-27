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
