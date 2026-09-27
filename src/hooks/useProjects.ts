import { useState, useEffect, useCallback } from 'react'
import { Project, projectsData } from '@/data/projects'
import { projectsService } from '@/services/projectsService'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const data = await projectsService.getProjects()
      setProjects(data)
      setError(null)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()

    // Listen for storage or custom update events
    const handleUpdate = () => {
      fetchProjects()
    }
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('prenz_projects_updated', handleUpdate)

    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('prenz_projects_updated', handleUpdate)
    }
  }, [fetchProjects])

  return { projects, loading, error, refresh: fetchProjects }
}
