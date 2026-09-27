import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { projectsService } from '@/services/projectsService'
import { hobbiesService } from '@/services/hobbiesService'
import { Project } from '@/data/projects'
import { Hobby } from '@/types/hobby'
import { ProjectModalForm } from '@/components/admin/ProjectModalForm'
import { HobbyModalForm } from '@/components/admin/HobbyModalForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  Folder,
  Plus,
  PencilSimple,
  Trash,
  SignOut,
  ArrowSquareOut,
  WarningCircle,
  Database,
  Sparkle,
  Cpu,
  GameController,
  Cube,
  Camera,
  MusicNotes,
  Wrench,
  Globe,
  DeviceMobile,
  CheckCircle,
  Copy,
  MagnifyingGlass,
  Star,
  Terminal,
} from '@phosphor-icons/react'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, isConfigured, isDevBypassed, signOut } = useAuth()

  // Tabs: 'projects' | 'hobbies' | 'database'
  const [activeTab, setActiveTab] = useState<'projects' | 'hobbies' | 'database'>('projects')

  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Filters & Search
  const [projectSearch, setProjectSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [hobbyCategoryFilter, setHobbyCategoryFilter] = useState<string>('All')

  // Modals
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null)
  const [isHobbyModalOpen, setIsHobbyModalOpen] = useState(false)

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'project' | 'hobby'
    id: string
    title: string
  } | null>(null)

  // Status & Notifications
  const [seeding, setSeeding] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [copiedSql, setCopiedSql] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  // Load projects & hobbies
  const refreshData = async () => {
    setLoadingData(true)
    try {
      const [projList, hobbyList] = await Promise.all([
        projectsService.getProjects(),
        hobbiesService.getHobbies(),
      ])
      setProjects(projList)
      setHobbies(hobbyList)
    } catch (err: any) {
      showToast('Error loading data: ' + err.message, 'error')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // 1-Click Seeder
  const handleSeedData = async () => {
    if (!confirm('This will seed the initial portfolio projects and hobbies into your database. Continue?')) {
      return
    }
    setSeeding(true)
    try {
      const projRes = await projectsService.seedInitialProjects()
      const hobbyRes = await hobbiesService.seedInitialHobbies()

      if (projRes.error || hobbyRes.error) {
        showToast(
          `Seeding notice: ${projRes.error?.message || ''} ${hobbyRes.error?.message || ''}`,
          'error'
        )
      } else {
        showToast(`Successfully seeded ${projRes.count} projects and ${hobbyRes.count} hobbies!`)
      }
      await refreshData()
    } catch (err: any) {
      showToast('Seeding failed: ' + err.message, 'error')
    } finally {
      setSeeding(false)
    }
  }

  // Project CRUD Handlers
  const handleSaveProject = async (projectData: Project) => {
    if (editingProject) {
      const { error } = await projectsService.updateProject(projectData.id, projectData)
      if (error) throw error
      showToast(`Updated project "${projectData.title}"`)
    } else {
      const { error } = await projectsService.createProject(projectData)
      if (error) throw error
      showToast(`Created project "${projectData.title}"`)
    }
    await refreshData()
  }

  const handleToggleProjectFeatured = async (project: Project) => {
    const updated = !project.featured
    const { error } = await projectsService.updateProject(project.id, { featured: updated })
    if (error) {
      showToast('Failed to update featured status: ' + error.message, 'error')
    } else {
      showToast(`Project "${project.title}" ${updated ? 'featured' : 'unfeatured'}`)
      await refreshData()
    }
  }

  // Hobby CRUD Handlers
  const handleSaveHobby = async (hobbyData: Hobby) => {
    if (editingHobby) {
      const { error } = await hobbiesService.updateHobby(hobbyData.id, hobbyData)
      if (error) throw error
      showToast(`Updated hobby "${hobbyData.title}"`)
    } else {
      const { error } = await hobbiesService.createHobby(hobbyData)
      if (error) throw error
      showToast(`Created hobby "${hobbyData.title}"`)
    }
    await refreshData()
  }

  const handleToggleHobbyFeatured = async (hobby: Hobby) => {
    const updated = !hobby.featured
    const { error } = await hobbiesService.updateHobby(hobby.id, { featured: updated })
    if (error) {
      showToast('Failed to update hobby: ' + error.message, 'error')
    } else {
      showToast(`Hobby "${hobby.title}" ${updated ? 'active' : 'hidden'}`)
      await refreshData()
    }
  }

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'project') {
      const { error } = await projectsService.deleteProject(deleteTarget.id)
      if (error) {
        showToast('Failed to delete project: ' + error.message, 'error')
      } else {
        showToast(`Project "${deleteTarget.title}" deleted`)
        await refreshData()
      }
    } else {
      const { error } = await hobbiesService.deleteHobby(deleteTarget.id)
      if (error) {
        showToast('Failed to delete hobby: ' + error.message, 'error')
      } else {
        showToast(`Hobby "${deleteTarget.title}" deleted`)
        await refreshData()
      }
    }
    setDeleteTarget(null)
  }

  // Render Hobby Icon
  const renderHobbyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu size={20} className="text-[var(--accent-neon)]" />
      case 'Circuitry':
        return <Cpu size={20} className="text-[var(--accent-neon)]" />
      case 'GameController':
        return <GameController size={20} className="text-[var(--accent-neon)]" />
      case 'Cube':
        return <Cube size={20} className="text-[var(--accent-neon)]" />
      case 'Wrench':
        return <Wrench size={20} className="text-[var(--accent-neon)]" />
      case 'Camera':
        return <Camera size={20} className="text-[var(--accent-neon)]" />
      case 'MusicNotes':
        return <MusicNotes size={20} className="text-[var(--accent-neon)]" />
      case 'Globe':
        return <Globe size={20} className="text-[var(--accent-neon)]" />
      case 'DeviceMobile':
        return <DeviceMobile size={20} className="text-[var(--accent-neon)]" />
      default:
        // check if emoji
        if (iconName && iconName.length <= 4) {
          return <span className="text-lg">{iconName}</span>
        }
        return <Sparkle size={20} className="text-[var(--accent-neon)]" />
    }
  }

  // Filtered lists
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const hobbyCategories = ['All', ...Array.from(new Set(hobbies.map((h) => h.category)))]
  const filteredHobbies = hobbies.filter((h) => {
    return hobbyCategoryFilter === 'All' || h.category === hobbyCategoryFilter
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-mono transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-[var(--accent-neon)] text-[var(--accent-neon)]'
              : 'bg-red-950/90 border-red-500 text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} weight="fill" />
          ) : (
            <WarningCircle size={20} weight="fill" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border-primary)] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-neon-glow)] border border-[var(--accent-neon)]/30 flex items-center justify-center text-[var(--accent-neon)] font-mono font-bold text-lg">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-base sm:text-lg">
                  ADMIN STUDIO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent-neon-glow)] text-[var(--accent-neon)] border border-[var(--accent-neon)]/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
                Project & Hobby Management Dashboard
              </p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Supabase Status Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${
                isConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isConfigured ? 'Supabase Live' : 'Offline / Local Cache'}</span>
            </div>

            {/* Seed Static Data Button */}
            <button
              onClick={handleSeedData}
              disabled={seeding}
              title="Seed starter projects and hobbies into database"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            >
              <Database size={15} className="text-[var(--accent-neon)]" />
              <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>

            {/* View Live Portfolio */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              <ArrowSquareOut size={15} />
              <span className="hidden sm:inline">View Site</span>
            </a>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-primary)]">
              <span className="text-xs font-mono text-[var(--text-secondary)] hidden md:inline max-w-[140px] truncate">
                {user?.email || (isDevBypassed ? 'Developer' : 'Admin')}
              </span>
              <button
                onClick={() => signOut().then(() => navigate('/admin/login'))}
                title="Sign Out"
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <SignOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-primary)] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[var(--accent-neon)] text-black shadow-lg shadow-[var(--accent-neon-glow)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Folder size={16} weight={activeTab === 'projects' ? 'bold' : 'regular'} />
              <span>PROJECTS</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'projects' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
                }`}
              >
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hobbies')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hobbies'
                  ? 'bg-[var(--accent-neon)] text-black shadow-lg shadow-[var(--accent-neon-glow)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Sparkle size={16} weight={activeTab === 'hobbies' ? 'bold' : 'regular'} />
              <span>HOBBIES & PASSIONS</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'hobbies' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
                }`}
              >
                {hobbies.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[var(--accent-neon)] text-black shadow-lg shadow-[var(--accent-neon-glow)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Terminal size={16} weight={activeTab === 'database' ? 'bold' : 'regular'} />
              <span>DATABASE & SETUP</span>
            </button>
          </div>

          {/* Quick Add CTA */}
          {activeTab === 'projects' && (
            <button
              onClick={() => {
                setEditingProject(null)
                setIsProjectModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-neon)] hover:bg-[var(--accent-neon-hover)] text-black font-mono font-bold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-md"
            >
              <Plus size={16} weight="bold" />
              <span>Add New Project</span>
            </button>
          )}

          {activeTab === 'hobbies' && (
            <button
              onClick={() => {
                setEditingHobby(null)
                setIsHobbyModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-neon)] hover:bg-[var(--accent-neon-hover)] text-black font-mono font-bold text-xs transition-all active:scale-[0.98] cursor-pointer shadow-md"
            >
              <Plus size={16} weight="bold" />
              <span>Add New Hobby</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PROJECTS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-primary)]">
              <div className="relative w-full sm:w-80">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-3 text-[var(--text-tertiary)]"
                />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects, stack, keywords..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['All', 'Full Stack', 'QA & Testing', 'AR & Systems'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[var(--accent-neon)] text-black font-bold'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Table / Cards */}
            {loadingData ? (
              <div className="py-20 text-center text-sm font-mono text-[var(--text-tertiary)]">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8">
                <Folder size={48} className="mx-auto text-[var(--text-tertiary)] mb-3" />
                <h3 className="font-mono font-bold text-lg text-[var(--text-primary)]">
                  No projects found
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Try adjusting your search criteria or add a new project.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-primary)] shrink-0">
                        {p.screenshots && p.screenshots[0] ? (
                          <img
                            src={p.screenshots[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                            <Folder size={24} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-mono font-bold text-base text-[var(--text-primary)] truncate">
                            {p.title}
                          </h4>
                          <StatusBadge status={p.status} />
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--accent-neon)]">
                            {p.category}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                          {p.subtitle || p.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {p.techStack.slice(0, 5).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-primary)] text-[var(--text-tertiary)]"
                            >
                              {tech}
                            </span>
                          ))}
                          {p.techStack.length > 5 && (
                            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                              +{p.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Featured switch & Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-primary)]">
                      {/* Featured button */}
                      <button
                        onClick={() => handleToggleProjectFeatured(p)}
                        title={p.featured ? 'Featured on homepage' : 'Not featured'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                          p.featured
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                            : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-tertiary)] hover:text-white'
                        }`}
                      >
                        <Star size={14} weight={p.featured ? 'fill' : 'regular'} />
                        <span className="hidden sm:inline">Featured</span>
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => {
                          setEditingProject(p)
                          setIsProjectModalOpen(true)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        <PencilSimple size={14} />
                        <span>Edit</span>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'project',
                            id: p.id,
                            title: p.title,
                          })
                        }
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* HOBBIES TAB */}
        {/* ========================================================================= */}
        {activeTab === 'hobbies' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-primary)]">
              <div className="flex items-center gap-2">
                <Sparkle size={18} className="text-[var(--accent-neon)]" />
                <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">
                  Manage personal passions & tech interests displayed on your About tab.
                </span>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {hobbyCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setHobbyCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                      hobbyCategoryFilter === cat
                        ? 'bg-[var(--accent-neon)] text-black font-bold'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Hobbies Grid */}
            {loadingData ? (
              <div className="py-20 text-center text-sm font-mono text-[var(--text-tertiary)]">
                Loading hobbies...
              </div>
            ) : filteredHobbies.length === 0 ? (
              <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-8">
                <Sparkle size={48} className="mx-auto text-[var(--text-tertiary)] mb-3" />
                <h3 className="font-mono font-bold text-lg text-[var(--text-primary)]">
                  No hobbies found
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Click "+ Add New Hobby" to add your first interest.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHobbies.map((h) => (
                  <div
                    key={h.id}
                    className="group bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]/40 rounded-2xl p-5 transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Header with Icon, Category, and Actions */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                            {renderHobbyIcon(h.icon)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[var(--accent-neon)] block">
                              {h.category}
                            </span>
                            <h4 className="font-mono font-bold text-base text-[var(--text-primary)]">
                              {h.title}
                            </h4>
                          </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingHobby(h)
                              setIsHobbyModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] transition-colors cursor-pointer"
                            title="Edit Hobby"
                          >
                            <PencilSimple size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: 'hobby',
                                id: h.id,
                                title: h.title,
                              })
                            }
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                            title="Delete Hobby"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                        {h.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {h.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-tertiary)]">
                      <span>Order #{h.displayOrder ?? 0}</span>
                      <button
                        onClick={() => handleToggleHobbyFeatured(h)}
                        className={`cursor-pointer transition-colors ${
                          h.featured !== false
                            ? 'text-[var(--accent-neon)] font-bold'
                            : 'text-[var(--text-tertiary)] line-through'
                        }`}
                      >
                        {h.featured !== false ? '● Visible on Portfolio' : '○ Hidden'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DATABASE SETUP & INSTRUCTIONS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'database' && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-neon)] font-semibold">
                INFRASTRUCTURE & CONFIGURATION
              </span>
              <h3 className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
                Supabase PostgreSQL & Storage Guide
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Connect your free Supabase database to persist projects and hobbies for all portfolio visitors.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
                <span className="text-xs font-mono text-[var(--accent-neon)] font-bold">
                  STEP 1
                </span>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  Create Supabase Project
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Create a free project at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent-neon)] underline"
                  >
                    supabase.com
                  </a>
                  .
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
                <span className="text-xs font-mono text-[var(--accent-neon)] font-bold">
                  STEP 2
                </span>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  Run SQL Schema
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Open the SQL Editor in Supabase, paste the SQL below, and click <strong>Run</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
                <span className="text-xs font-mono text-[var(--accent-neon)] font-bold">
                  STEP 3
                </span>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  Add Keys to .env
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Copy your Project URL and Anon Key into <code className="text-white">.env</code>.
                </p>
              </div>
            </div>

            {/* SQL Script Box with Copy Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[var(--text-primary)]">
                  Complete PostgreSQL Schema & RLS Policies (supabase_schema.sql)
                </label>
                <button
                  onClick={() => {
                    const sql = `-- Run this in Supabase SQL Editor:
create table if not exists public.projects (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  role text not null default '',
  category_tag text not null default 'SOFTWARE DEVELOPMENT',
  description text not null,
  long_description text not null default '',
  key_features jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  status text not null default 'live',
  live_url text,
  github_url text,
  featured boolean not null default false,
  category text not null default 'Full Stack',
  metrics jsonb default '[]'::jsonb,
  screenshots jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hobbies (
  id text primary key,
  title text not null,
  category text not null default 'General',
  icon text not null default 'Sparkle',
  description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  image_url text,
  featured boolean not null default true,
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.hobbies enable row level security;

create policy "Public read projects" on public.projects for select using (true);
create policy "Admin insert projects" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Admin update projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "Admin delete projects" on public.projects for delete using (auth.role() = 'authenticated');

create policy "Public read hobbies" on public.hobbies for select using (true);
create policy "Admin insert hobbies" on public.hobbies for insert with check (auth.role() = 'authenticated');
create policy "Admin update hobbies" on public.hobbies for update using (auth.role() = 'authenticated');
create policy "Admin delete hobbies" on public.hobbies for delete using (auth.role() = 'authenticated');`

                    navigator.clipboard.writeText(sql)
                    setCopiedSql(true)
                    setTimeout(() => setCopiedSql(false), 3000)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-mono text-[var(--accent-neon)] transition-colors cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-primary)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto max-h-64 leading-relaxed">
                <code>{`-- Open Supabase Dashboard > SQL Editor > New Query
-- Run this code to set up your tables, security, and storage:
-- (A complete file is also saved at ./supabase_schema.sql in your repository)`}</code>
              </div>
            </div>

            {/* .env Reference */}
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                Environment Variables Reference (.env)
              </span>
              <pre className="font-mono text-xs text-[var(--accent-neon)] bg-[var(--bg-secondary)] p-3 rounded-lg overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAILS=your.email@gmail.com`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-mono font-bold text-lg text-red-400 mb-2">Confirm Delete</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Are you sure you want to permanently delete the {deleteTarget.type}{' '}
              <strong className="text-[var(--text-primary)] font-mono">
                "{deleteTarget.title}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Create/Edit */}
      <ProjectModalForm
        project={editingProject}
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false)
          setEditingProject(null)
        }}
        onSave={handleSaveProject}
      />

      <HobbyModalForm
        hobby={editingHobby}
        isOpen={isHobbyModalOpen}
        onClose={() => {
          setIsHobbyModalOpen(false)
          setEditingHobby(null)
        }}
        onSave={handleSaveHobby}
      />
    </div>
  )
}
