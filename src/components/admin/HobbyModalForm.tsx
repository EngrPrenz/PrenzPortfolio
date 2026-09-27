import React, { useState, useEffect } from 'react'
import { Hobby } from '@/types/hobby'
import { storageService } from '@/services/storageService'
import {
  X,
  UploadSimple,
  Check,
  WarningCircle,
} from '@phosphor-icons/react'

interface HobbyModalFormProps {
  hobby?: Hobby | null
  isOpen: boolean
  onClose: () => void
  onSave: (hobby: Hobby) => Promise<void>
}

const PRESET_ICONS = [
  'Cpu',
  'Circuitry',
  'GameController',
  'Cube',
  'Wrench',
  'Camera',
  'MusicNotes',
  'Globe',
  'DeviceMobile',
  'Sparkle',
]

const CATEGORY_PRESETS = [
  'Hardware & Systems',
  'Engineering & Maker',
  'Interactive Media',
  'Physical Computing',
  'Creative & Design',
  'Outdoors & Fitness',
]

export const HobbyModalForm: React.FC<HobbyModalFormProps> = ({
  hobby,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(hobby)

  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Hardware & Systems')
  const [icon, setIcon] = useState('Cpu')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [featured, setFeatured] = useState(true)

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (hobby) {
      setId(hobby.id)
      setTitle(hobby.title)
      setCategory(hobby.category || 'Hardware & Systems')
      setIcon(hobby.icon || 'Cpu')
      setDescription(hobby.description || '')
      setImageUrl(hobby.imageUrl || '')
      setDisplayOrder(hobby.displayOrder ?? 1)
      setFeatured(hobby.featured ?? true)
      setTags(hobby.tags || [])
    } else {
      setId(`hobby-${Date.now()}`)
      setTitle('')
      setCategory('Hardware & Systems')
      setIcon('Cpu')
      setDescription('')
      setImageUrl('')
      setDisplayOrder(1)
      setFeatured(true)
      setTags([])
    }
    setFormError(null)
    setUploadError(null)
  }, [hobby, isOpen])

  if (!isOpen) return null

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    const res = await storageService.uploadAsset(file, 'hobbies')
    if (res.url) {
      setImageUrl(res.url)
    } else if (res.error) {
      setUploadError(res.error.message)
    }
    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Hobby title is required.')
      return
    }

    const payloadId = id.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const payload: Hobby = {
      id: payloadId,
      title: title.trim(),
      category: category.trim(),
      icon: icon.trim() || 'Sparkle',
      description: description.trim(),
      tags,
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: Number(displayOrder) || 0,
      featured,
    }

    setSaving(true)
    try {
      await onSave(payload)
      onClose()
    } catch (err: any) {
      setFormError(err.message || 'Failed to save hobby.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-tertiary)]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent-neon)] font-semibold">
              {isEditing ? 'UPDATE HOBBY' : 'NEW HOBBY'}
            </span>
            <h2 className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {isEditing ? `Edit: ${hobby?.title}` : 'Add Hobby or Passion'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Hobby Name / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PC Building & Hardware Tinkering"
                required
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] font-bold focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Category
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Hardware & Systems"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
              <datalist id="category-suggestions">
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Icon Selector / Emoji Input */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Icon (Phosphor Icon Name or Emoji)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Cpu, GameController, or 🎮"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] mr-2 self-center">
                Presets:
              </span>
              {PRESET_ICONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setIcon(preset)}
                  className={`px-2 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
                    icon === preset
                      ? 'bg-[var(--accent-neon)] text-black border-[var(--accent-neon)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--accent-neon)]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Description & Personal Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What do you love about this hobby? Favorite projects or experiences..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
            <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
              Highlights & Tags ({tags.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="e.g. Custom Loops, Thermals"
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[var(--accent-neon)] text-black rounded-lg text-xs font-mono font-semibold hover:bg-[var(--accent-neon-hover)] transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(i)}
                    className="text-[var(--text-tertiary)] hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image & Display Order */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
            <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
              Showcase Photo (Optional)
            </label>
            {uploadError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {uploadError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-dashed border-[var(--border-primary)] hover:border-[var(--accent-neon)] text-xs font-mono text-[var(--text-primary)] cursor-pointer">
                <UploadSimple size={16} className="text-[var(--accent-neon)]" />
                <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <span className="text-xs font-mono text-[var(--text-tertiary)]">or URL</span>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
              />
            </div>

            {imageUrl && (
              <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-[var(--border-primary)] mt-2">
                <img src={imageUrl} alt="Hobby Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 p-1 rounded bg-black/70 text-red-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-neon)]"
                  />
                  <span className="text-xs font-mono text-[var(--text-primary)] font-semibold">
                    Show on Portfolio?
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[var(--border-primary)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-neon)] hover:bg-[var(--accent-neon-hover)] text-black font-mono font-bold text-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Check size={16} weight="bold" />
              <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Hobby'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
