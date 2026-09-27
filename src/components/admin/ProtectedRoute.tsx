import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldWarning, SignOut, ArrowLeft } from '@phosphor-icons/react'
import { GlowButton } from '@/components/ui/GlowButton'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin, isDevBypassed, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--accent-neon)] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm text-[var(--accent-neon)] tracking-wider uppercase animate-pulse">
            Authenticating Admin Access...
          </span>
        </div>
      </div>
    )
  }

  // Not logged in and not bypassed in dev
  if (!user && !isDevBypassed) {
    return <Navigate to="/admin/login" replace />
  }

  // Logged in with Google/Supabase, but email is NOT whitelisted
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 text-[var(--text-primary)]">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
          
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-400">
            <ShieldWarning size={36} weight="duotone" />
          </div>

          <h1 className="text-2xl font-bold font-mono text-center text-red-400 mb-2">
            Access Denied
          </h1>
          <p className="text-center text-sm text-[var(--text-secondary)] mb-6">
            The account <span className="font-mono text-[var(--text-primary)] font-semibold">{user.email}</span> is not on the authorized administrator whitelist.
          </p>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 mb-6 text-xs text-[var(--text-secondary)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">To grant access to this email:</p>
            <p className="font-mono text-[var(--accent-neon)] break-all">
              VITE_ADMIN_EMAILS={user.email}
            </p>
            <p>Add the line above to your project's <code className="text-white">.env</code> file and restart the Vite server.</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all font-mono text-sm"
            >
              <SignOut size={18} />
              Sign Out & Try Another Account
            </button>
            <GlowButton href="/" variant="outline" size="sm" className="w-full justify-center">
              <ArrowLeft size={16} />
              Return to Public Portfolio
            </GlowButton>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
