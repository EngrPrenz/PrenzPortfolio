export interface Hobby {
  id: string
  title: string
  category: string
  icon: string
  description: string
  tags: string[]
  imageUrl?: string
  images?: string[]
  featured?: boolean
  displayOrder?: number
}

/**
 * Normalizes single or JSON-serialized multiple hobby image URLs into a deduplicated array.
 */
export const getHobbyImages = (hobby: Pick<Hobby, 'imageUrl' | 'images'>): string[] => {
  const raw: string[] = []

  if (Array.isArray(hobby.images)) {
    for (const item of hobby.images) {
      if (typeof item === 'string') {
        raw.push(item)
      }
    }
  }

  if (typeof hobby.imageUrl === 'string') {
    const trimmed = hobby.imageUrl.trim()
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === 'string') {
              raw.push(item)
            }
          }
        } else {
          raw.push(trimmed)
        }
      } catch {
        raw.push(trimmed)
      }
    } else if (trimmed.length > 0) {
      raw.push(trimmed)
    }
  }

  const seen = new Set<string>()
  const result: string[] = []
  for (const item of raw) {
    let clean = item.trim()
    if (!clean) continue
    if (!/^(https?:|data:|blob:|\/)/i.test(clean)) {
      clean = `/${clean}`
    }
    if (!seen.has(clean)) {
      seen.add(clean)
      result.push(clean)
    }
  }

  return result
}

/**
 * Serializes a hobby's images array for storage in the `image_url` text column.
 */
export const serializeHobbyImages = (images: string[]): string | null => {
  const cleaned = getHobbyImages({ images })
  if (cleaned.length === 0) return null
  if (cleaned.length === 1) return cleaned[0]
  return JSON.stringify(cleaned)
}
