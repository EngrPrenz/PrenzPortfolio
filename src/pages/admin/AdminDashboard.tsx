import React, { useState, useEffect, useId, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UNAUTHORIZED_WRITE_MESSAGE } from '@/lib/supabase'
import { projectsService } from '@/services/projectsService'
import { hobbiesService } from '@/services/hobbiesService'
import { Project } from '@/data/projects'
import { Hobby, getHobbyImages } from '@/types/hobby'
import { ProjectModalForm } from '@/components/admin/ProjectModalForm'
import { HobbyModalForm } from '@/components/admin/HobbyModalForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { HobbyIcon } from '@/components/ui/HobbyIcon'
import { useDialogModal } from '@/hooks/useDialogModal'
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
  CheckCircle,
  MagnifyingGlass,
  Star,
  ArrowUp,
  ArrowDown,
} from '@phosphor-icons/react'

const formatAdminError = (prefix: string, message: string): string =>
  message === UNAUTHORIZED_WRITE_MESSAGE ? UNAUTHORIZED_WRITE_MESSAGE : `${prefix}: ${message}`

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, isConfigured, isDevBypassed, signOut } = useAuth()
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const deleteTitleId = useId()

  const [activeTab, setActiveTab] = useState<'projects' | 'hobbies'>('projects')

  const [projects, setProjects] = useState<Project[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [projectSearch, setProjectSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [hobbyCategoryFilter, setHobbyCategoryFilter] = useState<string>('All')

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null)
  const [isHobbyModalOpen, setIsHobbyModalOpen] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'project' | 'hobby'
    id: string
    title: string
  } | null>(null)

  const [seeding, setSeeding] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  useDialogModal(deleteDialogRef, Boolean(deleteTarget), () => setDeleteTarget(null), {
    lightDismiss: true,
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

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

  const handleSeedData = async () => {
    if (
      !confirm(
        'This will seed the initial portfolio projects and hobbies into your database. Continue?'
      )
    ) {
      return
    }
    setSeeding(true)
    try {
      const projRes = await projectsService.seedInitialProjects()
      const hobbyRes = await hobbiesService.seedInitialHobbies()

      if (projRes.error || hobbyRes.error) {
        const seedErrorMsg =
          projRes.error?.message === UNAUTHORIZED_WRITE_MESSAGE ||
          hobbyRes.error?.message === UNAUTHORIZED_WRITE_MESSAGE
            ? UNAUTHORIZED_WRITE_MESSAGE
            : `Seeding notice: ${projRes.error?.message || ''} ${hobbyRes.error?.message || ''}`
        showToast(seedErrorMsg, 'error')
      } else {
        showToast(`Seeded ${projRes.count} projects and ${hobbyRes.count} hobbies.`)
      }
      await refreshData()
    } catch (err: any) {
      showToast('Seeding failed: ' + err.message, 'error')
    } finally {
      setSeeding(false)
    }
  }

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

  const canReorderProjects = categoryFilter === 'All' && !projectSearch.trim()
  const canReorderHobbies = hobbyCategoryFilter === 'All'

  const reorderItems = async <T extends { id: string }>(
    items: T[],
    index: number,
    direction: -1 | 1,
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    assignOrder: (item: T, order: number) => T,
    persist: (ordered: T[]) => Promise<{ error: Error | null }>,
    label: 'projects' | 'hobbies'
  ) => {
    const targetIndex = index + direction
    if (reordering || targetIndex < 0 || targetIndex >= items.length) return

    const previous = items
    const swapped = [...items]
    ;[swapped[index], swapped[targetIndex]] = [swapped[targetIndex], swapped[index]]
    const nextList = swapped.map((item, i) => assignOrder(item, i + 1))

    setItems(nextList)
    setReordering(true)
    try {
      const { error } = await persist(nextList)
      if (error) {
        setItems(previous)
        showToast(formatAdminError(`Failed to reorder ${label}`, error.message), 'error')
      } else {
        showToast(`${label === 'projects' ? 'Project' : 'Hobby'} order updated`)
      }
    } catch (err: any) {
      setItems(previous)
      showToast(formatAdminError(`Failed to reorder ${label}`, err.message), 'error')
    } finally {
      setReordering(false)
    }
  }

  const handleMoveProject = (index: number, direction: -1 | 1) => {
    if (!canReorderProjects) return
    void reorderItems(
      projects,
      index,
      direction,
      setProjects,
      (item, order) => ({ ...item, displayOrder: order }),
      projectsService.reorderProjects,
      'projects'
    )
  }

  const handleMoveHobby = (index: number, direction: -1 | 1) => {
    if (!canReorderHobbies) return
    void reorderItems(
      hobbies,
      index,
      direction,
      setHobbies,
      (item, order) => ({ ...item, displayOrder: order }),
      hobbiesService.reorderHobbies,
      'hobbies'
    )
  }

  const handleToggleProjectFeatured = async (project: Project) => {
    const updated = !project.featured
    const { error } = await projectsService.updateProject(project.id, { featured: updated })
    if (error) {
      showToast(formatAdminError('Failed to update featured status', error.message), 'error')
    } else {
      showToast(`Project "${project.title}" ${updated ? 'featured' : 'unfeatured'}`)
      await refreshData()
    }
  }

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
      showToast(formatAdminError('Failed to update hobby', error.message), 'error')
    } else {
      showToast(`Hobby "${hobby.title}" ${updated ? 'visible' : 'hidden'}`)
      await refreshData()
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    const { error } =
      deleteTarget.type === 'project'
        ? await projectsService.deleteProject(deleteTarget.id)
        : await hobbiesService.deleteHobby(deleteTarget.id)

    if (error) {
      showToast(formatAdminError(`Failed to delete ${deleteTarget.type}`, error.message), 'error')
    } else {
      showToast(
        `${deleteTarget.type === 'project' ? 'Project' : 'Hobby'} "${deleteTarget.title}" deleted`
      )
      await refreshData()
    }
    setDeleteTarget(null)
  }

  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase()
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q))
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const hobbyCategories = ['All', ...Array.from(new Set(hobbies.map((h) => h.category)))]
  const filteredHobbies = hobbies.filter(
    (h) => hobbyCategoryFilter === 'All' || h.category === hobbyCategoryFilter
  )

  return (
    <div className="admin-studio-light min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Accessible Status Toast (no bounce animation) */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium"
          style={
            notification.type === 'success'
              ? {
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--accent)',
                  color: 'var(--text-primary)',
                }
              : {
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--alert-error-border)',
                  color: 'var(--alert-error-text)',
                }
          }
        >
          {notification.type === 'success' ? (
            <CheckCircle size={18} weight="fill" className="text-[var(--accent)] shrink-0" aria-hidden="true" />
          ) : (
            <WarningCircle size={18} weight="fill" className="shrink-0" aria-hidden="true" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-primary)] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent)] font-mono font-semibold text-sm">
              P
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-[var(--text-primary)] leading-tight">
                Admin Studio
              </h1>
              <p className="text-xs text-[var(--text-tertiary)]">
                Portfolio Projects &amp; Hobbies
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Database Connection Status */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium min-h-[38px]"
              style={
                isConfigured
                  ? {
                      backgroundColor: 'var(--badge-bg)',
                      borderColor: 'var(--badge-border)',
                      color: 'var(--badge-text)',
                    }
                  : {
                      backgroundColor: 'var(--alert-warn-bg)',
                      borderColor: 'var(--alert-warn-border)',
                      color: 'var(--alert-warn-text)',
                    }
              }
            >
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isConfigured ? 'var(--accent)' : 'var(--alert-warn-text)',
                }}
              />
              <span>{isConfigured ? 'Supabase Live' : 'Local Cache'}</span>
            </div>

            <button
              type="button"
              onClick={handleSeedData}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Database size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs font-medium text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <ArrowSquareOut size={15} aria-hidden="true" />
              <span className="hidden sm:inline">View Site</span>
            </a>

            <ThemeToggle className="min-h-[38px] min-w-[38px] h-[38px] w-[38px]" />

            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-primary)]">
              <span className="text-xs font-mono text-[var(--text-secondary)] hidden md:inline max-w-[160px] truncate">
                {user?.email || (isDevBypassed ? 'Developer' : 'Admin')}
              </span>
              <button
                type="button"
                onClick={() => signOut().then(() => navigate('/admin/login'))}
                aria-label="Sign out"
                title="Sign out"
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--alert-error-text)] hover:bg-[var(--alert-error-bg)] transition-colors cursor-pointer min-h-[38px] min-w-[38px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <SignOut size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Primary Tabs & Quick Add */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-primary)] pb-4">
          <div role="tablist" aria-label="Admin sections" className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                activeTab === 'projects'
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--button-specular)] font-semibold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Folder size={16} aria-hidden="true" />
              <span>Projects</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                  activeTab === 'projects'
                    ? 'bg-black/15 text-[var(--accent-ink)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hobbies'}
              onClick={() => setActiveTab('hobbies')}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                activeTab === 'hobbies'
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--button-specular)] font-semibold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Sparkle size={16} aria-hidden="true" />
              <span>Hobbies</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                  activeTab === 'hobbies'
                    ? 'bg-black/15 text-[var(--accent-ink)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                {hobbies.length}
              </span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              type="button"
              onClick={() => {
                setEditingProject(null)
                setIsProjectModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] shadow-[var(--button-specular)] font-semibold text-xs transition-colors active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Plus size={15} weight="bold" aria-hidden="true" />
              <span>Add Project</span>
            </button>
          )}

          {activeTab === 'hobbies' && (
            <button
              type="button"
              onClick={() => {
                setEditingHobby(null)
                setIsHobbyModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] shadow-[var(--button-specular)] font-semibold text-xs transition-colors active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Plus size={15} weight="bold" aria-hidden="true" />
              <span>Add Hobby</span>
            </button>
          )}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between surface-card p-4 rounded-xl">
              <div className="relative w-full lg:w-80">
                <MagnifyingGlass
                  size={16}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                />
                <input
                  type="search"
                  aria-label="Search projects"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects, stack, keywords..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 pl-9 pr-3 min-h-[40px] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(['All', 'Full Stack', 'QA & Testing', 'AR & Systems'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loadingData ? (
              <div className="py-16 text-center text-sm text-[var(--text-tertiary)]">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-16 text-center surface-card rounded-xl p-8">
                <Folder size={40} className="mx-auto text-[var(--text-tertiary)] mb-3" aria-hidden="true" />
                <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
                  No matching projects
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Adjust your search or add a new project record.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredProjects.map((p, idx) => (
                  <div
                    key={p.id}
                    className="surface-card-interactive rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-[var(--media-canvas)] border border-[var(--border-primary)] shrink-0">
                        {p.screenshots && p.screenshots[0] ? (
                          <img
                            src={p.screenshots[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                            <Folder size={20} aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-[var(--text-tertiary)] tabular-nums">
                            #{p.displayOrder && p.displayOrder > 0 ? p.displayOrder : idx + 1}
                          </span>
                          <h2 className="font-display font-bold text-base text-[var(--text-primary)] truncate">
                            {p.title}
                          </h2>
                          <StatusBadge status={p.status} />
                          <span className="text-xs font-mono text-[var(--text-tertiary)]">
                            {p.category}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                          {p.subtitle || p.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {p.techStack.slice(0, 5).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]"
                            >
                              {tech}
                            </span>
                          ))}
                          {p.techStack.length > 5 && (
                            <span className="text-[11px] font-mono text-[var(--text-tertiary)] tabular-nums">
                              +{p.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-primary)] shrink-0">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveProject(idx, -1)}
                          disabled={!canReorderProjects || reordering || idx === 0}
                          aria-label={`Move ${p.title} up`}
                          title={canReorderProjects ? 'Move up' : 'Clear search/filter to reorder'}
                          className="p-2 min-h-[38px] min-w-[38px] rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={14} weight="bold" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveProject(idx, 1)}
                          disabled={!canReorderProjects || reordering || idx === filteredProjects.length - 1}
                          aria-label={`Move ${p.title} down`}
                          title={canReorderProjects ? 'Move down' : 'Clear search/filter to reorder'}
                          className="p-2 min-h-[38px] min-w-[38px] rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          <ArrowDown size={14} weight="bold" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleProjectFeatured(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-medium transition-colors cursor-pointer"
                        style={
                          p.featured
                            ? {
                                backgroundColor: 'var(--alert-warn-bg)',
                                borderColor: 'var(--alert-warn-border)',
                                color: 'var(--alert-warn-text)',
                              }
                            : {
                                backgroundColor: 'var(--bg-primary)',
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-secondary)',
                              }
                        }
                      >
                        <Star size={14} weight={p.featured ? 'fill' : 'regular'} aria-hidden="true" />
                        <span>Featured</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(p)
                          setIsProjectModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        <PencilSimple size={14} aria-hidden="true" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ type: 'project', id: p.id, title: p.title })
                        }
                        aria-label={`Delete ${p.title}`}
                        title="Delete project"
                        className="p-2 min-h-[38px] min-w-[38px] rounded-lg border transition-colors cursor-pointer inline-flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--alert-error-bg)',
                          borderColor: 'var(--alert-error-border)',
                          color: 'var(--alert-error-text)',
                        }}
                      >
                        <Trash size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hobbies Tab */}
        {activeTab === 'hobbies' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 surface-card p-4 rounded-xl">
              <p className="text-xs text-[var(--text-secondary)]">
                Manage personal interests displayed in the About section.
              </p>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {hobbyCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setHobbyCategoryFilter(cat)}
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      hobbyCategoryFilter === cat
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loadingData ? (
              <div className="py-16 text-center text-sm text-[var(--text-tertiary)]">
                Loading hobbies...
              </div>
            ) : filteredHobbies.length === 0 ? (
              <div className="py-16 text-center surface-card rounded-xl p-8">
                <Sparkle size={40} className="mx-auto text-[var(--text-tertiary)] mb-3" aria-hidden="true" />
                <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
                  No hobbies found
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Use Add Hobby to create your first interest item.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHobbies.map((h, idx) => {
                  const photoCount = getHobbyImages(h).length
                  return (
                    <div
                      key={h.id}
                      className="surface-card-interactive rounded-xl p-5 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                              <HobbyIcon name={h.icon} size={20} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-mono text-[var(--text-tertiary)] block truncate">
                                {h.category}
                              </span>
                              <h2 className="font-display font-bold text-base text-[var(--text-primary)] truncate">
                                {h.title}
                              </h2>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingHobby(h)
                                setIsHobbyModalOpen(true)
                              }}
                              aria-label={`Edit ${h.title}`}
                              title="Edit hobby"
                              className="p-2 min-h-[38px] min-w-[38px] rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] transition-colors cursor-pointer inline-flex items-center justify-center"
                            >
                              <PencilSimple size={15} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({ type: 'hobby', id: h.id, title: h.title })
                              }
                              aria-label={`Delete ${h.title}`}
                              title="Delete hobby"
                              className="p-2 min-h-[38px] min-w-[38px] rounded-lg border transition-colors cursor-pointer inline-flex items-center justify-center"
                              style={{
                                backgroundColor: 'var(--alert-error-bg)',
                                borderColor: 'var(--alert-error-border)',
                                color: 'var(--alert-error-text)',
                              }}
                            >
                              <Trash size={15} aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                          {h.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {h.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-primary)] text-xs font-mono text-[var(--text-tertiary)] tabular-nums">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="inline-flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveHobby(idx, -1)}
                              disabled={!canReorderHobbies || reordering || idx === 0}
                              aria-label={`Move ${h.title} up`}
                              title={canReorderHobbies ? 'Move up' : 'Select All category to reorder'}
                              className="p-1.5 min-h-[34px] min-w-[34px] rounded-md bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                              <ArrowUp size={13} weight="bold" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveHobby(idx, 1)}
                              disabled={
                                !canReorderHobbies || reordering || idx === filteredHobbies.length - 1
                              }
                              aria-label={`Move ${h.title} down`}
                              title={canReorderHobbies ? 'Move down' : 'Select All category to reorder'}
                              className="p-1.5 min-h-[34px] min-w-[34px] rounded-md bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                              <ArrowDown size={13} weight="bold" aria-hidden="true" />
                            </button>
                          </div>
                          <span className="truncate">
                            Order #{h.displayOrder ?? idx + 1} / {photoCount}{' '}
                            {photoCount === 1 ? 'photo' : 'photos'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleHobbyFeatured(h)}
                          className={`cursor-pointer font-sans text-xs font-medium min-h-[36px] px-2 rounded-md ${
                            h.featured !== false
                              ? 'text-[var(--accent)]'
                              : 'text-[var(--text-tertiary)] line-through'
                          }`}
                        >
                          {h.featured !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Native Top-Layer Delete Confirmation Dialog (autoFocus on safe Cancel action) */}
      <dialog
        ref={deleteDialogRef}
        aria-labelledby={deleteTitleId}
        {...({ closedby: 'any' } as Record<string, string>)}
        className="portfolio-dialog m-auto w-[min(92vw,28rem)] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
      >
        {deleteTarget && (
          <div className="p-6 space-y-5">
            <div>
              <h1
                id={deleteTitleId}
                className="font-display text-lg font-bold"
                style={{ color: 'var(--alert-error-text)' }}
              >
                Delete {deleteTarget.type}?
              </h1>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                Permanently remove{' '}
                <strong className="text-[var(--text-primary)]">{deleteTarget.title}</strong>? This
                action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                autoFocus
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 min-h-[42px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 min-h-[42px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </dialog>

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
