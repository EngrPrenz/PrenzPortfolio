import { useState, useEffect, useCallback } from 'react'
import { Hobby } from '@/types/hobby'
import { hobbiesData } from '@/data/hobbies'
import { hobbiesService } from '@/services/hobbiesService'

export const useHobbies = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>(hobbiesData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHobbies = useCallback(async () => {
    try {
      setLoading(true)
      const data = await hobbiesService.getHobbies()
      setHobbies(data)
      setError(null)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHobbies()

    // Listen for storage or custom update events
    const handleUpdate = () => {
      fetchHobbies()
    }
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('prenz_hobbies_updated', handleUpdate)

    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('prenz_hobbies_updated', handleUpdate)
    }
  }, [fetchHobbies])

  return { hobbies, loading, error, refresh: fetchHobbies }
}
