import React, { useState, useEffect, useId, useRef } from 'react'
import { Hobby, getHobbyImages } from '@/types/hobby'
import { storageService } from '@/services/storageService'
import { useDialogModal } from '@/hooks/useDialogModal'
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
  'Music',
  'Valorant & League',
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
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

  useDialogModal(dialogRef, isOpen, onClose, { lightDismiss: false })

  useEffect(() => {
    if (!isOpen) return
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

    const payloadId =
      id.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

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
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="portfolio-dialog m-auto w-[min(94vw,44rem)] max-h-[92dvh] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {isOpen && (
        <>
          <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between gap-4 bg-[var(--bg-primary)] shrink-0">
            <h1 id={titleId} className="font-display text-lg font-bold text-[var(--text-primary)] truncate">
              {isEditing ? `Edit ${hobby?.title}` : 'New Hobby'}
            </h1>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close hobby form"
              className="p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto overscroll-contain space-y-5 flex-1">
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
              <div className="sm:col-span-7 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. PC Building & Hardware"
                  required
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] font-medium focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Category
                </label>
                <input
                  type="text"
                  list="category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Hardware & Systems"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
                <datalist id="category-suggestions">
                  {CATEGORY_PRESETS.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Icon Name (Phosphor Icon)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Cpu, Guitar, GameController"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 min-h-[42px] text-sm text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ICONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setIcon(preset)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors cursor-pointer ${
                      icon === preset
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] font-semibold'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Short notes about this hobby or interest."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none resize-y"
              />
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Tags ({tags.length})
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
                  placeholder="e.g. Thermal Tuning"
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      aria-label={`Remove tag ${tag}`}
                      className="text-[var(--text-tertiary)] hover:text-[var(--alert-error-text)] cursor-pointer"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Photos ({images.length})
                </label>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Use local paths like /hobbies/setupgreen.jpg or upload files. First image is the cover.
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
                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[var(--bg-secondary)] border border-dashed border-[var(--border-hover)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text-primary)] cursor-pointer shrink-0">
                  <UploadSimple size={15} className="text-[var(--accent)]" aria-hidden="true" />
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

                <span className="text-xs text-[var(--text-tertiary)]">or</span>

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
                    placeholder="/hobbies/setupgreen.jpg or https://..."
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {images.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className="relative group rounded-lg overflow-hidden border border-[var(--border-primary)] bg-[var(--media-canvas)] aspect-video"
                    >
                      <img
                        src={url}
                        alt={`Hobby photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(i)}
                            aria-label={`Set photo ${i + 1} as cover`}
                            title="Set as cover"
                            className="p-2 rounded-lg bg-amber-400 text-amber-950 hover:bg-amber-300 transition-colors cursor-pointer"
                          >
                            <Star size={14} weight="fill" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          aria-label={`Remove photo ${i + 1}`}
                          title="Remove photo"
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <Trash size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg py-1.5 px-3 text-xs text-[var(--text-primary)] font-mono tabular-nums focus:border-[var(--accent)] focus:outline-none"
                  />
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
                      Visible on portfolio
                    </span>
                  </label>
                </div>
              </div>
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
                <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Hobby'}</span>
              </button>
            </div>
          </form>
        </>
      )}
    </dialog>
  )
}
