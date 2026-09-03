import React, { useState } from 'react'
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  FacebookLogo,
  DiscordLogo,
  FileText,
  PaperPlaneTilt,
  CheckCircle,
  Copy,
} from '@phosphor-icons/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlowButton } from '@/components/ui/GlowButton'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const emailAddress = 'vivazprince@gmail.com'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    // Static UI feedback as specified in plan
    setIsSubmitted(true)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const socials = [
    {
      name: 'GitHub',
      handle: '@EngrPrenz',
      href: 'https://github.com/EngrPrenz',
      icon: <GithubLogo size={22} />,
    },
    {
      name: 'LinkedIn',
      handle: 'Prince Psalm Vivaz',
      href: 'https://www.linkedin.com/in/prince-psalm-vivaz-8972b7189',
      icon: <LinkedinLogo size={22} />,
    },
    {
      name: 'Facebook',
      handle: 'Prince Psalm Vivaz',
      href: 'https://facebook.com/Hugasmunaplato',
      icon: <FacebookLogo size={22} />,
    },
    {
      name: 'Discord',
      handle: 'zavs24',
      href: 'https://discord.com',
      icon: <DiscordLogo size={22} />,
    },
  ]

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            title="Let&apos;s Build Together"
            subtitle="Have a project in mind, an engineering role, or a QA inquiry? Send a dispatch or connect across platforms."
            eyebrow="GET IN TOUCH"
          />
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mt-10 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <RevealOnScroll delay={0.1}>
              <div className="rounded-2xl glass-card border border-[var(--border-primary)] p-6 sm:p-8 sm:p-10 shadow-xl">
                {isSubmitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent-neon-glow)] text-[var(--accent-neon)] flex items-center justify-center mx-auto border border-[var(--border-hover)]">
                      <CheckCircle size={36} weight="fill" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                      Transmission Received
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                      Thank you for reaching out, {formData.name}. I will review your message and respond promptly!
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false)
                          setFormData({ name: '', email: '', message: '' })
                        }}
                        className="text-xs font-mono text-[var(--accent-neon)] hover:underline cursor-pointer"
                      >
                        Send another dispatch
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium"
                      >
                        Your Name <span className="text-[var(--accent-neon)]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent-neon)] focus:ring-1 focus:ring-[var(--accent-neon)] transition-all min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium"
                      >
                        Email Address <span className="text-[var(--accent-neon)]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ada@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent-neon)] focus:ring-1 focus:ring-[var(--accent-neon)] transition-all min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium"
                      >
                        Project Details / Message <span className="text-[var(--accent-neon)]">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project, engineering role, or collaboration idea..."
                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent-neon)] focus:ring-1 focus:ring-[var(--accent-neon)] transition-all resize-none min-h-[120px]"
                      />
                    </div>

                    <GlowButton
                      type="submit"
                      variant="solid"
                      size="lg"
                      className="w-full"
                      icon={<PaperPlaneTilt size={18} weight="bold" />}
                    >
                      Send Message
                    </GlowButton>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Direct Info & Social Grid */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Card with Copy button */}
            <RevealOnScroll delay={0.2}>
              <div className="p-6 rounded-2xl glass-card border border-[var(--border-primary)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--accent-neon-glow)] text-[var(--accent-neon)]">
                    <EnvelopeSimple size={24} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                      Direct Inquiries
                    </span>
                    <h4 className="text-base font-bold text-[var(--text-primary)]">
                      {emailAddress}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-mono font-medium text-[var(--text-primary)] hover:border-[var(--accent-neon)] transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle size={16} className="text-[var(--accent-neon)]" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${emailAddress}`}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-neon)] text-[#0a0a0a] text-xs font-mono font-bold hover:bg-[var(--accent-neon-hover)] transition-colors flex items-center justify-center min-h-[44px]"
                  >
                    Open Mailer
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            {/* Resume / CV Card */}
            <RevealOnScroll delay={0.3}>
              <div className="p-6 rounded-2xl glass-card border border-[var(--border-primary)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--accent-neon)] border border-[var(--border-primary)]">
                    <FileText size={24} weight="bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      Resume / CV
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Updated for 2026 engineering positions
                    </p>
                  </div>
                </div>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-[var(--accent-neon)] text-[var(--accent-neon)] hover:bg-[var(--accent-neon)] hover:text-[#0a0a0a] text-xs font-mono font-semibold transition-all min-h-[44px] flex items-center shrink-0"
                >
                  View CV
                </a>
              </div>
            </RevealOnScroll>

            {/* Social Channels Grid */}
            <RevealOnScroll delay={0.4}>
              <div className="p-6 rounded-2xl glass-card border border-[var(--border-primary)]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Developer Profiles &amp; Socials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]/60 text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-all flex items-center gap-3 min-h-[44px] group"
                    >
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent-neon)] transition-colors">
                        {social.icon}
                      </span>
                      <div className="overflow-hidden">
                        <span className="block text-xs font-bold truncate">
                          {social.name}
                        </span>
                        <span className="block text-[11px] font-mono text-[var(--text-tertiary)] truncate">
                          {social.handle}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
