import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your_supabase_anon_key')
  )
}

// Create a safe client. If unconfigured, a dummy client is created with fallback warning
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

/**
 * Returns list of whitelisted admin emails configured in environment
 */
export const getAdminEmails = (): string[] => {
  const envEmails = import.meta.env.VITE_ADMIN_EMAILS || ''
  return envEmails
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter((e: string) => e.length > 0)
}

/**
 * Checks if a given user email is authorized as an administrator
 */
export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false
  const admins = getAdminEmails()
  // If no admin emails are configured yet in dev mode, grant access to any logged-in user
  if (admins.length === 0) return true
  return admins.includes(email.toLowerCase())
}
