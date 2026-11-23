import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldWarning, SignOut, ArrowLeft } from '@phosphor-icons/react'
import { GlowButton } from '@/components/ui/GlowButton'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin, isDevBypassed, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--text-secondary)]">
            Checking administrator access...
          </span>
        </div>
      </div>
    )
  }

  if (!user && !isDevBypassed) {
    return <Navigate to="/admin/login" replace />
  }

  if (user && !isAdmin) {
    return (
      <div className="admin-studio-light min-h-[100dvh] bg-[var(--bg-primary)] flex items-center justify-center p-6 text-[var(--text-primary)]">
        <div className="relative z-10 max-w-md w-full rounded-xl surface-card p-7 space-y-5">
          <div
            className="w-12 h-12 rounded-lg border flex items-center justify-center"
            style={{
              backgroundColor: 'var(--alert-error-bg)',
              borderColor: 'var(--alert-error-border)',
              color: 'var(--alert-error-text)',
            }}
          >
            <ShieldWarning size={24} weight="duotone" aria-hidden="true" />
          </div>

          <div>
            <h1
              className="font-display text-xl font-bold"
              style={{ color: 'var(--alert-error-text)' }}
            >
              Access Denied
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              The account{' '}
              <span className="font-mono text-[var(--text-primary)] font-medium">{user.email}</span>{' '}
              is not on the authorized administrator list.
            </p>
          </div>

          <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">
              To grant access to this email:
            </p>
            <p className="font-mono text-[var(--accent)] break-all">
              VITE_ADMIN_EMAILS={user.email}
            </p>
            <p>
              Add that line to your <code className="font-mono text-[var(--text-primary)]">.env</code>{' '}
              file and restart the server.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--alert-error-bg)',
                borderColor: 'var(--alert-error-border)',
                color: 'var(--alert-error-text)',
              }}
            >
              <SignOut size={17} aria-hidden="true" />
              <span>Sign Out &amp; Try Another Account</span>
            </button>
            <GlowButton
              href="/"
              variant="outline"
              size="md"
              className="w-full"
              icon={<ArrowLeft size={16} />}
            >
              Return to Portfolio
            </GlowButton>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
