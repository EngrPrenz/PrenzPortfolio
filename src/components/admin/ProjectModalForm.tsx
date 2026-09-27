import React, { useState, useEffect } from 'react'
import { Project, ProjectCategory, ProjectStatus } from '@/data/projects'
import { storageService } from '@/services/storageService'
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
  const isEditing = Boolean(project)

  // Form State
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [role, setRole] = useState('')
  const [categoryTag, setCategoryTag] = useState('SOFTWARE DEVELOPMENT')
  const [category, setCategory] = useState<ProjectCategory>('Full Stack')
  const [status, setStatus] = useState<ProjectStatus>('live')
  const [featured, setFeatured] = useState(false)
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  // Dynamic Lists
  const [keyFeatures, setKeyFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState('')
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([])
  const [newMetricLabel, setNewMetricLabel] = useState('')
  const [newMetricValue, setNewMetricValue] = useState('')

  // Screenshots / Media
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setId(project.id)
      setTitle(project.title)
      setSubtitle(project.subtitle || '')
      setRole(project.role || '')
      setCategoryTag(project.categoryTag || 'SOFTWARE DEVELOPMENT')
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
      // Defaults for new project
      const autoId = `project-${Date.now()}`
      setId(autoId)
      setTitle('')
      setSubtitle('')
      setRole('Full Stack Developer')
      setCategoryTag('SOFTWARE DEVELOPMENT')
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

  if (!isOpen) return null

  // Helpers for Lists
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
    if (newImageUrl.trim()) {
      setScreenshots([...screenshots, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  // Handle Drag & Drop / File Upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = Array.from(files).map((file) =>
        storageService.uploadAsset(file, 'projects')
      )
      const results = await Promise.all(uploadPromises)

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
      // Reset input
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

    const payloadId = id.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-tertiary)]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent-neon)] font-semibold">
              {isEditing ? 'UPDATE RECORD' : 'NEW RECORD'}
            </span>
            <h2 className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {isEditing ? `Edit: ${project?.title}` : 'Create New Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Row 1: ID, Title, Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Project ID / Slug *
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isEditing}
                placeholder="ursac-hub"
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] font-mono disabled:opacity-50 focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-8">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. URSAC HUB MARKETPLACE"
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] font-bold focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Campus Organization & Marketplace Platform"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Role in Project
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Full Stack Developer"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category, Category Tag, Status, Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                placeholder="SOFTWARE DEV"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--text-primary)] font-mono uppercase focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--accent-neon)]"
                />
                <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                  Feature on Hero?
                </span>
              </label>
            </div>
          </div>

          {/* Row 3: Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Short Description (Cards & Previews) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
                placeholder="Brief summary displayed on project cards..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Long Description (Detailed Modal Showcase)
              </label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={4}
                placeholder="Comprehensive technical breakdown, architecture decisions, and business impact..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Live URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://ursachub.onrender.com"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                GitHub Repository URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/EngrPrenz/..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Tech Stack & Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
              <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
                Technologies & Tools ({techStack.length})
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
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-1.5 bg-[var(--accent-neon)] text-black rounded-lg text-xs font-mono font-semibold hover:bg-[var(--accent-neon-hover)] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)]"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(i)}
                      className="text-[var(--text-tertiary)] hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
              <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
                Key Features ({keyFeatures.length})
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
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 bg-[var(--accent-neon)] text-black rounded-lg text-xs font-mono font-semibold hover:bg-[var(--accent-neon-hover)] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                {keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs text-[var(--text-secondary)]"
                  >
                    <span className="truncate">• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-[var(--text-tertiary)] hover:text-red-400 shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Metrics */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
            <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
              Project Metrics & Badges (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newMetricLabel}
                onChange={(e) => setNewMetricLabel(e.target.value)}
                placeholder="Label (e.g. Architecture)"
                className="sm:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
              <input
                type="text"
                value={newMetricValue}
                onChange={(e) => setNewMetricValue(e.target.value)}
                placeholder="Value (e.g. Relational DB)"
                className="sm:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMetric}
                className="sm:col-span-2 py-1.5 bg-[var(--accent-neon)] text-black rounded-lg text-xs font-mono font-semibold hover:bg-[var(--accent-neon-hover)] transition-colors cursor-pointer"
              >
                Add Metric
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono"
                >
                  <span className="text-[var(--text-tertiary)]">{m.label}:</span>
                  <span className="text-[var(--accent-neon)] font-semibold">{m.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(i)}
                    className="text-[var(--text-tertiary)] hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 7: Media & Screenshots (Dual upload: Supabase Storage + Direct URL) */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
                  Screenshots & Media ({screenshots.length})
                </label>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Upload image files directly to Supabase Storage or enter hosted image URLs.
                </p>
              </div>
            </div>

            {uploadError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {uploadError}
              </div>
            )}

            {/* Direct File Upload to Supabase Storage */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-primary)] hover:border-[var(--accent-neon)] text-xs font-mono text-[var(--text-primary)] cursor-pointer transition-colors">
                <UploadSimple size={16} className="text-[var(--accent-neon)]" />
                <span>{isUploading ? 'Uploading to Supabase...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <span className="text-xs font-mono text-[var(--text-tertiary)]">or</span>

              {/* Direct URL Input */}
              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... or /projects/ursachub/1.png"
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Screenshots Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {screenshots.map((url, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] aspect-video"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback on load error
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(i)}
                      className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-[var(--border-primary)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-neon)] hover:bg-[var(--accent-neon-hover)] text-black font-mono font-bold text-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Check size={16} weight="bold" />
              <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
