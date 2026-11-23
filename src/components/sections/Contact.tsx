import React, { useState } from 'react'
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  FacebookLogo,
  DiscordLogo,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  CircleNotch,
  Copy,
  Check,
  ArrowUpRight,
} from '@phosphor-icons/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlowButton } from '@/components/ui/GlowButton'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const EMAIL_ADDRESS = 'vivazprince@gmail.com'
const DISCORD_HANDLE = 'zavs24'

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submittedName, setSubmittedName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<'email' | 'discord' | null>(null)

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedMessage = formData.message.trim()

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Please fill in your name, email address, and message.')
      return
    }

    if (!accessKey) {
      setErrorMessage(
        `The contact form is not configured in this environment. Please email ${EMAIL_ADDRESS} directly.`
      )
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          from_name: trimmedName,
          subject: `Portfolio inquiry from ${trimmedName}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmittedName(trimmedName)
        setIsSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        setErrorMessage(
          data.message || `Could not send your message. Please try again or email ${EMAIL_ADDRESS}.`
        )
      }
    } catch {
      setErrorMessage(
        `Network error while sending your message. Please try again or email ${EMAIL_ADDRESS} directly.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = async (key: 'email' | 'discord', value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2400)
    } catch {
      // Clipboard unavailable
    }
  }

  const externalProfiles = [
    {
      name: 'GitHub',
      handle: '@EngrPrenz',
      href: 'https://github.com/EngrPrenz',
      icon: <GithubLogo size={19} aria-hidden="true" />,
    },
    {
      name: 'LinkedIn',
      handle: 'Prince Psalm Vivaz',
      href: 'https://www.linkedin.com/in/prince-psalm-vivaz-8972b7189',
      icon: <LinkedinLogo size={19} aria-hidden="true" />,
    },
    {
      name: 'Facebook',
      handle: 'Prince Psalm Vivaz',
      href: 'https://facebook.com/Hugasmunaplato',
      icon: <FacebookLogo size={19} aria-hidden="true" />,
    },
  ]

  return (
    <section id="contact" className="section-studio-light py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          title="Contact"
          subtitle="Hiring for a full-stack or QA engineering role, or want to discuss a project? Send a message below or reach out directly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <SpotlightCard className="rounded-xl surface-card-interactive p-6 sm:p-8">
              <div className="relative z-[2]">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--badge-bg)] text-[var(--accent)] border border-[var(--badge-border)] flex items-center justify-center mx-auto">
                    <CheckCircle size={26} weight="fill" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    Message sent
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out, {submittedName}. I received your message and will reply soon.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false)
                        setErrorMessage(null)
                      }}
                      className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer min-h-[40px] px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-medium text-[var(--text-primary)]"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        if (errorMessage) setErrorMessage(null)
                        setFormData({ ...formData, name: e.target.value })
                      }}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors min-h-[44px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-email"
                      className="text-sm font-medium text-[var(--text-primary)]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        if (errorMessage) setErrorMessage(null)
                        setFormData({ ...formData, email: e.target.value })
                      }}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors min-h-[44px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-medium text-[var(--text-primary)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        if (errorMessage) setErrorMessage(null)
                        setFormData({ ...formData, message: e.target.value })
                      }}
                      placeholder="Share details about the role, team, or project."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-y min-h-[128px]"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-lg border text-xs flex items-start gap-2.5 leading-relaxed"
                      style={{
                        backgroundColor: 'var(--alert-error-bg)',
                        borderColor: 'var(--alert-error-border)',
                        color: 'var(--alert-error-text)',
                      }}
                    >
                      <WarningCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <GlowButton
                    type="submit"
                    variant="solid"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    icon={
                      isSubmitting ? (
                        <CircleNotch size={18} className="animate-spin" />
                      ) : (
                        <PaperPlaneTilt size={18} weight="bold" />
                      )
                    }
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </GlowButton>
                </form>
              )}
              </div>
            </SpotlightCard>
          </div>

          {/* Right: Direct Email & Profiles (hairline structured, no duplicate Resume card) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border-t border-[var(--border-primary)] pt-5 space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                <EnvelopeSimple size={18} className="text-[var(--accent)]" aria-hidden="true" />
                <span>Direct Email</span>
              </div>

              <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                {EMAIL_ADDRESS}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <GlowButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('email', EMAIL_ADDRESS)}
                  icon={
                    copiedKey === 'email' ? (
                      <Check size={15} weight="bold" className="text-[var(--accent)]" />
                    ) : (
                      <Copy size={15} />
                    )
                  }
                >
                  {copiedKey === 'email' ? 'Copied' : 'Copy Email'}
                </GlowButton>

                <GlowButton
                  variant="ghost"
                  size="sm"
                  href={`mailto:${EMAIL_ADDRESS}`}
                  icon={<ArrowUpRight size={15} weight="bold" />}
                >
                  Open Mail Client
                </GlowButton>
              </div>
            </div>

            <div className="border-t border-[var(--border-primary)] pt-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                Profiles
              </h3>
              <ul className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
                {externalProfiles.map((profile) => (
                  <li key={profile.name}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 flex items-center justify-between gap-3 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm group"
                    >
                      <span className="inline-flex items-center gap-3 min-w-0">
                        <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                          {profile.icon}
                        </span>
                        <span className="font-medium">{profile.name}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] group-hover:text-[var(--accent)] truncate">
                        <span className="truncate">{profile.handle}</span>
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                ))}

                {/* Discord handle copy action (honest instead of a generic discord.com link) */}
                <li>
                  <button
                    type="button"
                    onClick={() => handleCopy('discord', DISCORD_HANDLE)}
                    className="w-full py-3 flex items-center justify-between gap-3 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors min-h-[44px] cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm group"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                        <DiscordLogo size={19} aria-hidden="true" />
                      </span>
                      <span className="font-medium">Discord</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] group-hover:text-[var(--accent)]">
                      {copiedKey === 'discord' ? (
                        <>
                          <Check size={14} weight="bold" className="text-[var(--accent)]" aria-hidden="true" />
                          <span>Copied ({DISCORD_HANDLE})</span>
                        </>
                      ) : (
                        <>
                          <span>{DISCORD_HANDLE}</span>
                          <Copy size={14} aria-hidden="true" />
                        </>
                      )}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
