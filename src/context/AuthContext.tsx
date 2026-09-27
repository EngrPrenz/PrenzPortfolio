import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured, isUserAdmin, getAdminEmails } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  isConfigured: boolean
  adminEmails: string[]
  isDevBypassed: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  enableDevBypass: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDevBypassed, setIsDevBypassed] = useState(() => {
    return localStorage.getItem('prenz_admin_dev_bypass') === 'true'
  })

  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [configured])

  const signInWithGoogle = async () => {
    if (!configured) {
      return { error: new Error('Supabase is not configured yet in .env') }
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })
    return { error }
  }

  const signInWithPassword = async (email: string, password: string) => {
    if (!configured) {
      return { error: new Error('Supabase is not configured yet in .env') }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (configured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setIsDevBypassed(false)
    localStorage.removeItem('prenz_admin_dev_bypass')
  }

  const enableDevBypass = () => {
    setIsDevBypassed(true)
    localStorage.setItem('prenz_admin_dev_bypass', 'true')
  }

  const adminEmails = getAdminEmails()
  const isAdmin = isDevBypassed || (configured && isUserAdmin(user?.email))

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        isConfigured: configured,
        adminEmails,
        isDevBypassed,
        signInWithGoogle,
        signInWithPassword,
        signOut,
        enableDevBypass,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
