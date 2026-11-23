import React from 'react'
import { ArrowUp } from '@phosphor-icons/react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-[var(--text-secondary)]">
          <span>&copy; {new Date().getFullYear()} Prince Psalm Vivaz</span>
          <a
            href="/admin"
            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm"
          >
            Admin
          </a>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span>Back to top</span>
          <ArrowUp size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
