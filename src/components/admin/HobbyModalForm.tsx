import React, { useState, useEffect } from 'react'
import { Hobby, getHobbyImages } from '@/types/hobby'
import { storageService } from '@/services/storageService'
import {
  X,
  UploadSimple,
  Check,
  WarningCircle,
  Trash,
  Star,
} from '@phosphor-icons/react'

interface HobbyModalFormProps {
  hobby?: Hobby | null
  isOpen: boolean
  onClose: () => void
  onSave: (hobby: Hobby) => Promise<void>
}

const PRESET_ICONS = [
  'Cpu',
  'Guitar',
  'GameController',
  'Motorcycle',
  'Circuitry',
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
  'Music & Creative',
  'Gaming & Esports',
  'Travel & Riding',
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
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
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
      setImages(getHobbyImages(hobby))
      setDisplayOrder(hobby.displayOrder ?? 1)
      setFeatured(hobby.featured ?? true)
      setTags(hobby.tags || [])
    } else {
      setId(`hobby-${Date.now()}`)
      setTitle('')
      setCategory('Hardware & Systems')
      setIcon('Cpu')
      setDescription('')
      setImages([])
      setDisplayOrder(1)
      setFeatured(true)
      setTags([])
    }
    setNewImageUrl('')
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

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim()
    if (!trimmed) return
    setImages((prev) => getHobbyImages({ images: [...prev, trimmed] }))
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSetCover = (index: number) => {
    setImages((prev) => {
      if (index <= 0 || index >= prev.length) return prev
      const chosen = prev[index]
      return [chosen, ...prev.filter((_, i) => i !== index)]
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const results = await Promise.all(
        Array.from(files).map((file) => storageService.uploadAsset(file, 'hobbies'))
      )

      const successfulUrls: string[] = []
      results.forEach((res) => {
        if (res.url) successfulUrls.push(res.url)
        else if (res.error) setUploadError(res.error.message)
      })

      if (successfulUrls.length > 0) {
        setImages((prev) => getHobbyImages({ images: [...prev, ...successfulUrls] }))
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
      images,
      imageUrl: images[0] || undefined,
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

          {/* Images & Display Order */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
                Showcase Photos ({images.length})
              </label>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Add local paths (0 bucket space) like /hobbies/guitar-1.jpg or upload files. First photo is the card cover.
              </p>
            </div>
            {uploadError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {uploadError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-dashed border-[var(--border-primary)] hover:border-[var(--accent-neon)] text-xs font-mono text-[var(--text-primary)] cursor-pointer shrink-0">
                <UploadSimple size={16} className="text-[var(--accent-neon)]" />
                <span>{isUploading ? 'Uploading...' : 'Upload Image(s)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <span className="text-xs font-mono text-[var(--text-tertiary)]">or URL</span>

              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddImageUrl()
                    }
                  }}
                  placeholder="/hobbies/guitar.jpg or https://..."
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-neon)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg text-xs font-mono transition-colors cursor-pointer shrink-0"
                >
                  Add URL
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {images.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="relative group rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] aspect-video"
                  >
                    <img
                      src={url}
                      alt={`Hobby photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(i)}
                          title="Set as Cover"
                          className="p-1.5 rounded-lg bg-amber-500/85 text-black hover:bg-amber-400 transition-colors cursor-pointer"
                        >
                          <Star size={14} weight="fill" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        title="Remove Photo"
                        className="p-1.5 rounded-lg bg-red-500/85 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                      {i === 0 ? '#1 Cover' : `#${i + 1}`}
                    </span>
                  </div>
                ))}
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
