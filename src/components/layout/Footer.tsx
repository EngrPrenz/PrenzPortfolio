import React from 'react'
import { ArrowUp, GithubLogo, LinkedinLogo, FacebookLogo, DiscordLogo, EnvelopeSimple } from '@phosphor-icons/react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/EngrPrenz', icon: <GithubLogo size={20} /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/prince-psalm-vivaz-8972b7189', icon: <LinkedinLogo size={20} /> },
    { name: 'Facebook', href: 'https://www.facebook.com/Hugasmunaplato', icon: <FacebookLogo size={20} /> },
    { name: 'Discord', href: 'https://discord.com', icon: <DiscordLogo size={20} /> },
    { name: 'Email', href: 'mailto:vivazprince@gmail.com', icon: <EnvelopeSimple size={20} /> },
  ]

  return (
    <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <div className="text-center sm:text-left">
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            &copy; {new Date().getFullYear()} Prince Psalm Vivaz. All rights reserved.
          </p>
        </div>

        {/* Social Links Row */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="p-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-neon)] hover:border-[var(--border-hover)] transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {social.icon}
            </a>
          ))}

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="p-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-neon)] hover:border-[var(--border-hover)] transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ml-2"
          >
            <ArrowUp size={20} weight="bold" />
          </button>
        </div>
      </div>
    </footer>
  )
}
