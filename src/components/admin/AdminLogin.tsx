import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
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
  const { isConfigured, signInWithGoogle, signInWithPassword, enableDevBypass, user, isAdmin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  // If already authenticated and admin, redirect
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-neon-glow)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#22222212_1px,transparent_1px),linear-gradient(to_bottom,#22222212_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-neon-glow)] border border-[var(--accent-neon)]/30 flex items-center justify-center mx-auto mb-4 text-[var(--accent-neon)]">
              <ShieldCheck size={36} weight="duotone" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-neon)] font-semibold">
              PRENZ PORTFOLIO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] mt-1">
              Admin Access
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Sign in with your authorized Google or Supabase account to manage projects and hobbies.
            </p>
          </div>

          {/* Status Alert if Supabase is not yet configured */}
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <WarningCircle size={18} className="shrink-0" />
                <span>Supabase Configuration Pending</span>
              </div>
              <p className="text-amber-200/80">
                You can set your keys in <code className="text-white font-mono">.env</code> anytime. In the meantime, you can enter immediately using <strong>Developer Mode</strong> to explore the full dashboard!
              </p>
              <button
                type="button"
                onClick={handleDevBypass}
                className="mt-2 w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CodeBlock size={16} />
                Enter Developer Demo Mode (Instant Access)
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Action: Google OAuth */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || !isConfigured}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-medium transition-all cursor-pointer ${
                isConfigured
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl active:scale-[0.98]'
                  : 'bg-white/40 text-gray-500 cursor-not-allowed'
              }`}
            >
              <GoogleLogo size={22} weight="bold" className="text-[#EA4335]" />
              <span className="font-semibold text-sm">
                {loading ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            {/* Toggle Email/Password */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[var(--border-primary)]" />
              <span className="flex-shrink mx-4 text-xs font-mono text-[var(--text-tertiary)] uppercase">
                Or email credentials
              </span>
              <div className="flex-grow border-t border-[var(--border-primary)]" />
            </div>

            {!showPasswordForm ? (
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LockKey size={16} />
                Sign in with Email & Password
              </button>
            ) : (
              <form onSubmit={handlePasswordSignIn} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeSimple size={16} className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-neon)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <LockKey size={16} className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-neon)] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-neon)] hover:bg-[var(--accent-neon-hover)] text-black font-semibold text-xs font-mono transition-all active:scale-[0.98] cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Dev bypass option when configured as well */}
            {isConfigured && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDevBypass}
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--accent-neon)] transition-colors underline cursor-pointer"
                >
                  Developer quick bypass
                </button>
              </div>
            )}
          </div>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </button>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
