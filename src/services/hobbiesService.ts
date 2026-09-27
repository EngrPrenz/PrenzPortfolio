import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Hobby } from '@/types/hobby'
import { hobbiesData } from '@/data/hobbies'

const LOCAL_STORAGE_KEY = 'prenz_portfolio_hobbies_cache'

// Helper to convert database row (snake_case) to Hobby interface (camelCase)
const mapDbToHobby = (row: any): Hobby => ({
  id: row.id,
  title: row.title,
  category: row.category || 'General',
  icon: row.icon || 'Sparkle',
  description: row.description || '',
  tags: Array.isArray(row.tags) ? row.tags : [],
  imageUrl: row.image_url || undefined,
  featured: row.featured !== undefined ? Boolean(row.featured) : true,
  displayOrder: row.display_order ?? 0,
})

// Helper to convert Hobby to database row
const mapHobbyToDb = (hobby: Hobby): any => ({
  id: hobby.id,
  title: hobby.title,
  category: hobby.category,
  icon: hobby.icon,
  description: hobby.description,
  tags: hobby.tags,
  image_url: hobby.imageUrl || null,
  featured: hobby.featured ?? true,
  display_order: hobby.displayOrder ?? 0,
  updated_at: new Date().toISOString(),
})

export const getLocalCachedHobbies = (): Hobby[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (err) {
    console.warn('Failed reading hobbies from localStorage', err)
  }
  return [...hobbiesData]
}

export const setLocalCachedHobbies = (hobbies: Hobby[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hobbies))
  } catch (err) {
    console.warn('Failed saving hobbies to localStorage', err)
  }
}

export const hobbiesService = {
  async getHobbies(): Promise<Hobby[]> {
    if (!isSupabaseConfigured()) {
      return getLocalCachedHobbies()
    }

    try {
      const { data, error } = await supabase
        .from('hobbies')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.warn('Supabase fetch failed for hobbies, using local fallback:', error.message)
        return getLocalCachedHobbies()
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbToHobby)
        setLocalCachedHobbies(mapped)
        return mapped
      }

      return getLocalCachedHobbies()
    } catch (err) {
      console.warn('Network error reaching Supabase for hobbies:', err)
      return getLocalCachedHobbies()
    }
  },

  async createHobby(hobby: Hobby): Promise<{ data: Hobby | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const current = getLocalCachedHobbies()
      const updated = [...current, hobby]
      setLocalCachedHobbies(updated)
      return { data: hobby, error: null }
    }

    const payload = {
      ...mapHobbyToDb(hobby),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('hobbies')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const mapped = mapDbToHobby(data)
    const current = getLocalCachedHobbies().filter(h => h.id !== mapped.id)
    setLocalCachedHobbies([...current, mapped])
    return { data: mapped, error: null }
  },

  async updateHobby(id: string, updates: Partial<Hobby>): Promise<{ data: Hobby | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const current = getLocalCachedHobbies()
      const index = current.findIndex(h => h.id === id)
      if (index === -1) {
        return { data: null, error: new Error('Hobby not found') }
      }
      const updatedItem = { ...current[index], ...updates }
      current[index] = updatedItem
      setLocalCachedHobbies([...current])
      return { data: updatedItem, error: null }
    }

    const dbPayload: any = {}
    if (updates.title !== undefined) dbPayload.title = updates.title
    if (updates.category !== undefined) dbPayload.category = updates.category
    if (updates.icon !== undefined) dbPayload.icon = updates.icon
    if (updates.description !== undefined) dbPayload.description = updates.description
    if (updates.tags !== undefined) dbPayload.tags = updates.tags
    if (updates.imageUrl !== undefined) dbPayload.image_url = updates.imageUrl || null
    if (updates.featured !== undefined) dbPayload.featured = updates.featured
    if (updates.displayOrder !== undefined) dbPayload.display_order = updates.displayOrder
    dbPayload.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('hobbies')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const mapped = mapDbToHobby(data)
    const current = getLocalCachedHobbies().map(h => (h.id === id ? mapped : h))
    setLocalCachedHobbies(current)
    return { data: mapped, error: null }
  },

  async deleteHobby(id: string): Promise<{ success: boolean; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const current = getLocalCachedHobbies().filter(h => h.id !== id)
      setLocalCachedHobbies(current)
      return { success: true, error: null }
    }

    const { error } = await supabase.from('hobbies').delete().eq('id', id)
    if (error) {
      return { success: false, error: new Error(error.message) }
    }

    const current = getLocalCachedHobbies().filter(h => h.id !== id)
    setLocalCachedHobbies(current)
    return { success: true, error: null }
  },

  async seedInitialHobbies(): Promise<{ count: number; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      setLocalCachedHobbies([...hobbiesData])
      return { count: hobbiesData.length, error: null }
    }

    const rows = hobbiesData.map(mapHobbyToDb)
    const { error } = await supabase.from('hobbies').upsert(rows, { onConflict: 'id' })

    if (error) {
      return { count: 0, error: new Error(error.message) }
    }

    setLocalCachedHobbies([...hobbiesData])
    return { count: rows.length, error: null }
  },
}
