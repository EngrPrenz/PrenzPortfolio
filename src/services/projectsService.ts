import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Project, projectsData } from '@/data/projects'

const LOCAL_STORAGE_KEY = 'prenz_portfolio_projects_cache'

// Helper to convert database row (snake_case) to Project interface (camelCase)
const mapDbToProject = (row: any): Project => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle || '',
  role: row.role || '',
  categoryTag: row.category_tag || 'SOFTWARE DEVELOPMENT',
  description: row.description,
  longDescription: row.long_description || '',
  keyFeatures: Array.isArray(row.key_features) ? row.key_features : [],
  techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
  status: row.status || 'live',
  liveUrl: row.live_url || undefined,
  githubUrl: row.github_url || undefined,
  featured: Boolean(row.featured),
  category: row.category || 'Full Stack',
  metrics: Array.isArray(row.metrics) ? row.metrics : [],
  screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
})

// Helper to convert Project to database row
const mapProjectToDb = (project: Project): any => ({
  id: project.id,
  title: project.title,
  subtitle: project.subtitle,
  role: project.role,
  category_tag: project.categoryTag,
  description: project.description,
  long_description: project.longDescription,
  key_features: project.keyFeatures,
  tech_stack: project.techStack,
  status: project.status,
  live_url: project.liveUrl || null,
  github_url: project.githubUrl || null,
  featured: project.featured,
  category: project.category,
  metrics: project.metrics || [],
  screenshots: project.screenshots,
  updated_at: new Date().toISOString(),
})

export const getLocalCachedProjects = (): Project[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (err) {
    console.warn('Failed reading from localStorage', err)
  }
  return [...projectsData]
}

export const setLocalCachedProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects))
  } catch (err) {
    console.warn('Failed saving to localStorage', err)
  }
}

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured()) {
      return getLocalCachedProjects()
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase fetch failed, using local/static fallback:', error.message)
        return getLocalCachedProjects()
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbToProject)
        setLocalCachedProjects(mapped)
        return mapped
      }

      // If database is empty, fallback to cached / static
      return getLocalCachedProjects()
    } catch (err) {
      console.warn('Network error reaching Supabase, using local fallback:', err)
      return getLocalCachedProjects()
    }
  },

  async createProject(project: Project): Promise<{ data: Project | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      // Local fallback
      const current = getLocalCachedProjects()
      const updated = [project, ...current]
      setLocalCachedProjects(updated)
      return { data: project, error: null }
    }

    const payload = {
      ...mapProjectToDb(project),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const mapped = mapDbToProject(data)
    // Update local cache
    const current = getLocalCachedProjects().filter(p => p.id !== mapped.id)
    setLocalCachedProjects([mapped, ...current])
    return { data: mapped, error: null }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<{ data: Project | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const current = getLocalCachedProjects()
      const index = current.findIndex(p => p.id === id)
      if (index === -1) {
        return { data: null, error: new Error('Project not found') }
      }
      const updatedItem = { ...current[index], ...updates }
      current[index] = updatedItem
      setLocalCachedProjects([...current])
      return { data: updatedItem, error: null }
    }

    const dbPayload: any = {}
    if (updates.title !== undefined) dbPayload.title = updates.title
    if (updates.subtitle !== undefined) dbPayload.subtitle = updates.subtitle
    if (updates.role !== undefined) dbPayload.role = updates.role
    if (updates.categoryTag !== undefined) dbPayload.category_tag = updates.categoryTag
    if (updates.description !== undefined) dbPayload.description = updates.description
    if (updates.longDescription !== undefined) dbPayload.long_description = updates.longDescription
    if (updates.keyFeatures !== undefined) dbPayload.key_features = updates.keyFeatures
    if (updates.techStack !== undefined) dbPayload.tech_stack = updates.techStack
    if (updates.status !== undefined) dbPayload.status = updates.status
    if (updates.liveUrl !== undefined) dbPayload.live_url = updates.liveUrl || null
    if (updates.githubUrl !== undefined) dbPayload.github_url = updates.githubUrl || null
    if (updates.featured !== undefined) dbPayload.featured = updates.featured
    if (updates.category !== undefined) dbPayload.category = updates.category
    if (updates.metrics !== undefined) dbPayload.metrics = updates.metrics
    if (updates.screenshots !== undefined) dbPayload.screenshots = updates.screenshots
    dbPayload.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('projects')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const mapped = mapDbToProject(data)
    const current = getLocalCachedProjects().map(p => (p.id === id ? mapped : p))
    setLocalCachedProjects(current)
    return { data: mapped, error: null }
  },

  async deleteProject(id: string): Promise<{ success: boolean; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const current = getLocalCachedProjects().filter(p => p.id !== id)
      setLocalCachedProjects(current)
      return { success: true, error: null }
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      return { success: false, error: new Error(error.message) }
    }

    const current = getLocalCachedProjects().filter(p => p.id !== id)
    setLocalCachedProjects(current)
    return { success: true, error: null }
  },

  async seedInitialProjects(): Promise<{ count: number; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      setLocalCachedProjects([...projectsData])
      return { count: projectsData.length, error: null }
    }

    const rows = projectsData.map(mapProjectToDb)
    const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' })

    if (error) {
      return { count: 0, error: new Error(error.message) }
    }

    setLocalCachedProjects([...projectsData])
    return { count: rows.length, error: null }
  },
}
