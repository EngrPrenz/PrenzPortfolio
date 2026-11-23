import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  GoogleLogo,
  LockKey,
  ShieldCheck,
  EnvelopeSimple,
  ArrowLeft,
  WarningCircle,
  CodeBlock,
} from '@phosphor-icons/react'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { isConfigured, signInWithGoogle, signInWithPassword, enableDevBypass, user, isAdmin } =
    useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  React.useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [user, isAdmin, navigate])

  const handleGoogleSignIn = async () => {
    setErrorMsg(null)
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)
    const { error } = await signInWithPassword(email, password)
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  const handleDevBypass = () => {
    enableDevBypass()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="admin-studio-light min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col p-4 sm:p-6">
      <div className="relative z-10 max-w-md w-full mx-auto flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md px-1"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Portfolio</span>
        </button>
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center py-6">
        <div className="max-w-md w-full rounded-xl surface-card p-6 sm:p-8">
          <div className="mb-7">
            <div className="w-11 h-11 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center mb-4 text-[var(--accent)]">
              <ShieldCheck size={24} weight="duotone" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Admin Sign In
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Sign in with your authorized Google or Supabase account to manage projects and hobbies.
            </p>
          </div>

          {!isConfigured && (
            <div
              className="mb-6 p-4 rounded-lg border text-xs space-y-2.5"
              style={{
                backgroundColor: 'var(--alert-warn-bg)',
                borderColor: 'var(--alert-warn-border)',
                color: 'var(--alert-warn-text)',
              }}
            >
              <div className="flex items-center gap-2 font-semibold">
                <WarningCircle size={17} className="shrink-0" aria-hidden="true" />
                <span>Supabase not configured</span>
              </div>
              <p className="leading-relaxed">
                Add your keys in <code className="font-mono font-semibold">.env</code> whenever you are ready. You can still preview the dashboard right now in local developer mode.
              </p>
              <button
                type="button"
                onClick={handleDevBypass}
                className="w-full py-2.5 px-3 min-h-[44px] rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                style={{
                  borderColor: 'var(--alert-warn-border)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                <CodeBlock size={16} aria-hidden="true" />
                <span>Enter Local Developer Mode</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-lg border text-xs flex items-start gap-2 leading-relaxed"
              style={{
                backgroundColor: 'var(--alert-error-bg)',
                borderColor: 'var(--alert-error-border)',
                color: 'var(--alert-error-text)',
              }}
            >
              <WarningCircle size={17} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || !isConfigured}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 min-h-[44px] rounded-lg border border-[var(--border-hover)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--accent)] font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <GoogleLogo size={20} weight="bold" className="text-[var(--accent)]" aria-hidden="true" />
              <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--border-primary)]" />
              <span className="shrink-0 mx-3 text-xs text-[var(--text-tertiary)]">
                or email credentials
              </span>
              <div className="flex-grow border-t border-[var(--border-primary)]" />
            </div>

            {!showPasswordForm ? (
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="w-full py-2.5 px-4 min-h-[44px] rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <LockKey size={15} aria-hidden="true" />
                <span>Sign in with Email &amp; Password</span>
              </button>
            ) : (
              <form onSubmit={handlePasswordSignIn} className="space-y-3.5 pt-1">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="admin-email"
                    className="text-xs font-medium text-[var(--text-secondary)]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeSimple
                      size={16}
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                    />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2.5 pl-9 pr-3 min-h-[44px] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-medium text-[var(--text-secondary)]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKey
                      size={16}
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                    />
                    <input
                      id="admin-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2.5 pl-9 pr-3 min-h-[44px] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 min-h-[44px] rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] shadow-[var(--button-specular)] font-semibold text-sm transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {isConfigured && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDevBypass}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors underline cursor-pointer min-h-[36px] px-2"
                >
                  Demo Mode bypass
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
