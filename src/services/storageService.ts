import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const storageService = {
  /**
   * Uploads an image file to Supabase Storage bucket 'portfolio-assets'.
   * Falls back to a local DataURL preview if Supabase is not yet configured.
   */
  async uploadAsset(
    file: File,
    folder: 'projects' | 'hobbies' = 'projects'
  ): Promise<{ url: string | null; error: Error | null }> {
    if (!file) {
      return { url: null, error: new Error('No file provided') }
    }

    // Fallback: If Supabase credentials are not configured, read file as local Data URL
    if (!isSupabaseConfigured()) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({ url: e.target?.result as string, error: null })
        }
        reader.onerror = () => {
          resolve({ url: null, error: new Error('Failed to read file locally') })
        }
        reader.readAsDataURL(file)
      })
    }

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${folder}/${Date.now()}-${sanitizedName}`

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        return { url: null, error: new Error(error.message) }
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(data.path)

      return { url: publicUrlData.publicUrl, error: null }
    } catch (err: any) {
      return { url: null, error: new Error(err.message || 'Error uploading file') }
    }
  },
}
