import React, { useState, useEffect, useId, useRef } from 'react'
import { Project, ProjectCategory, ProjectStatus } from '@/data/projects'
import { storageService } from '@/services/storageService'
import { useDialogModal } from '@/hooks/useDialogModal'
import {
  X,
  UploadSimple,
  Trash,
  Check,
  WarningCircle,
  Link as LinkIcon,
} from '@phosphor-icons/react'

interface ProjectModalFormProps {
  project?: Project | null
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => Promise<void>
}

const CATEGORIES: ProjectCategory[] = ['Full Stack', 'QA & Testing', 'AR & Systems']
const STATUSES: ProjectStatus[] = ['live', 'development', 'upcoming']

export const ProjectModalForm: React.FC<ProjectModalFormProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const isEditing = Boolean(project)

  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [role, setRole] = useState('')
  const [categoryTag, setCategoryTag] = useState('Software Development')
  const [category, setCategory] = useState<ProjectCategory>('Full Stack')
  const [status, setStatus] = useState<ProjectStatus>('live')
  const [featured, setFeatured] = useState(false)
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  const [keyFeatures, setKeyFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState('')
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([])
  const [newMetricLabel, setNewMetricLabel] = useState('')
  const [newMetricValue, setNewMetricValue] = useState('')

  const [screenshots, setScreenshots] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Keep closedby="closerequest" (Esc works, accidental outside click does not discard form edits)
  useDialogModal(dialogRef, isOpen, onClose, { lightDismiss: false })

  useEffect(() => {
    if (!isOpen) return
    if (project) {
      setId(project.id)
      setTitle(project.title)
      setSubtitle(project.subtitle || '')
      setRole(project.role || '')
      setCategoryTag(project.categoryTag || 'Software Development')
      setCategory(project.category || 'Full Stack')
      setStatus(project.status || 'live')
      setFeatured(Boolean(project.featured))
      setDescription(project.description || '')
      setLongDescription(project.longDescription || '')
      setLiveUrl(project.liveUrl || '')
      setGithubUrl(project.githubUrl || '')
      setKeyFeatures(project.keyFeatures || [])
      setTechStack(project.techStack || [])
      setMetrics(project.metrics || [])
      setScreenshots(project.screenshots || [])
    } else {
      setId(`project-${Date.now()}`)
      setTitle('')
      setSubtitle('')
      setRole('Full-Stack Developer')
      setCategoryTag('Software Development')
      setCategory('Full Stack')
      setStatus('live')
      setFeatured(false)
      setDescription('')
      setLongDescription('')
      setLiveUrl('')
      setGithubUrl('')
      setKeyFeatures([])
      setTechStack([])
      setMetrics([])
      setScreenshots([])
    }
    setFormError(null)
    setUploadError(null)
  }, [project, isOpen])

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setKeyFeatures([...keyFeatures, newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index))
  }

  const handleAddTech = () => {
    if (newTech.trim()) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech('')
    }
  }

  const handleRemoveTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index))
  }

  const handleAddMetric = () => {
    if (newMetricLabel.trim() && newMetricValue.trim()) {
      setMetrics([...metrics, { label: newMetricLabel.trim(), value: newMetricValue.trim() }])
      setNewMetricLabel('')
      setNewMetricValue('')
    }
  }

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index))
  }

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim()
    if (trimmed) {
      const normalized = /^(https?:|data:|blob:|\/)/i.test(trimmed) ? trimmed : `/${trimmed}`
      setScreenshots([...screenshots, normalized])
      setNewImageUrl('')
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const results = await Promise.all(
        Array.from(files).map((file) => storageService.uploadAsset(file, 'projects'))
      )

      const successfulUrls: string[] = []
      results.forEach((res) => {
        if (res.url) successfulUrls.push(res.url)
        else if (res.error) setUploadError(res.error.message)
      })

      if (successfulUrls.length > 0) {
        setScreenshots((prev) => [...prev, ...successfulUrls])
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Project title is required.')
      return
    }
    if (!description.trim()) {
      setFormError('Short description is required.')
      return
    }

    const payloadId =
      id.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const payload: Project = {
      id: payloadId,
      title: title.trim(),
      subtitle: subtitle.trim(),
      role: role.trim(),
      categoryTag: categoryTag.trim(),
      category,
      status,
      featured,
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      keyFeatures,
      techStack,
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      metrics: metrics.length > 0 ? metrics : undefined,
      screenshots: screenshots.length > 0 ? screenshots : ['/projects/ursachub/1.png'],
    }

    setSaving(true)
    try {
      await onSave(payload)
      onClose()
    } catch (err: any) {
      setFormError(err.message || 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="portfolio-dialog m-auto w-[min(94vw,56rem)] max-h-[92dvh] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {isOpen && (
        <>
          <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between gap-4 bg-[var(--bg-primary)] shrink-0">
            <h1 id={titleId} className="font-display text-lg font-bold text-[var(--text-primary)] truncate">
              {isEditing ? `Edit ${project?.title}` : 'New Project'}
            </h1>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project form"
              className="p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto overscroll-contain space-y-6 flex-1">
            {formError && (
              <div
                role="alert"
                className="p-3.5 rounded-lg border text-xs flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--alert-error-bg)',
                  borderColor: 'var(--alert-error-border)',
                  color: 'var(--alert-error-text)',
                }}
              >
                <WarningCircle size={17} className="shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Slug / ID *
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={isEditing}
                  placeholder="ursac-hub"
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] font-mono disabled:opacity-50 focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-8 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Project Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. URSAC Hub Marketplace"
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] font-medium focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Campus organization and marketplace platform"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Full-Stack Developer"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-2 px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Discipline Tag
                </label>
                <input
                  type="text"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  placeholder="Full-Stack POS"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-2 px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-2 px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    Featured
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Short Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Brief summary displayed on project cards."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Detailed Overview
                </label>
                <textarea
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  rows={4}
                  placeholder="Architecture choices, QA scope, and project impact."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none resize-y"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Live URL
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://ursachub.onrender.com"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 pl-9 pr-3 min-h-[42px] text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/EngrPrenz/..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 pl-9 pr-3 min-h-[42px] text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Tech Stack ({techStack.length})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTech()
                      }
                    }}
                    placeholder="e.g. Laravel, React, MySQL"
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)]"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(i)}
                        aria-label={`Remove ${tech}`}
                        className="text-[var(--text-tertiary)] hover:text-[var(--alert-error-text)] cursor-pointer"
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Key Capabilities ({keyFeatures.length})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddFeature()
                      }
                    }}
                    placeholder="e.g. Role-based RBAC permissions"
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {keyFeatures.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)]"
                    >
                      <span className="truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        aria-label={`Remove feature ${feat}`}
                        className="text-[var(--text-tertiary)] hover:text-[var(--alert-error-text)] shrink-0 cursor-pointer"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Metrics &amp; Specs (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newMetricLabel}
                  onChange={(e) => setNewMetricLabel(e.target.value)}
                  placeholder="Label (e.g. Evaluation)"
                  className="sm:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
                <input
                  type="text"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                  placeholder="Value (e.g. < 0.05ms)"
                  className="sm:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="sm:col-span-2 py-1.5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono"
                  >
                    <span className="text-[var(--text-tertiary)]">{m.label}:</span>
                    <span className="text-[var(--accent)] font-medium">{m.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(i)}
                      aria-label={`Remove metric ${m.label}`}
                      className="text-[var(--text-tertiary)] hover:text-[var(--alert-error-text)] cursor-pointer"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Screenshots ({screenshots.length})
                </label>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Upload image files to Supabase Storage or add paths/URLs.
                </p>
              </div>

              {uploadError && (
                <div
                  role="alert"
                  className="p-2.5 rounded-lg border text-xs"
                  style={{
                    backgroundColor: 'var(--alert-error-bg)',
                    borderColor: 'var(--alert-error-border)',
                    color: 'var(--alert-error-text)',
                  }}
                >
                  {uploadError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[var(--bg-secondary)] border border-dashed border-[var(--border-hover)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text-primary)] cursor-pointer transition-colors">
                  <UploadSimple size={15} className="text-[var(--accent)]" aria-hidden="true" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-[var(--text-tertiary)]">or</span>

                <div className="flex-1 flex gap-2 w-full">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://... or /projects/ursachub/1.png"
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {screenshots.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="relative group rounded-lg overflow-hidden border border-[var(--border-primary)] bg-[var(--media-canvas)] aspect-video"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(i)}
                          aria-label={`Remove screenshot ${i + 1}`}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <Trash size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border-primary)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 min-h-[42px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 min-h-[42px] rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] font-semibold text-xs transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Check size={15} weight="bold" aria-hidden="true" />
                <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </form>
        </>
      )}
    </dialog>
  )
}
