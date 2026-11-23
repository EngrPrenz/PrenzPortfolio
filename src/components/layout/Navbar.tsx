import React, { useState, useEffect, useRef } from 'react'
import { List, X } from '@phosphor-icons/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useDialogModal } from '@/hooks/useDialogModal'

interface NavItem {
  id: string
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'certifications', label: 'Credentials', href: '#certifications' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDialogElement>(null)

  useDialogModal(drawerRef, mobileMenuOpen, () => setMobileMenuOpen(false), {
    lightDismiss: true,
  })

  // Observe top sentinel for scrolled header backdrop without window scroll listeners
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
        if (entry.isIntersecting) {
          setActiveSection('')
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Track active section in viewport (including #hero so returning to top clears active state)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const sectionIds = ['hero', ...NAV_ITEMS.map((item) => item.id)]
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        let bestId = ''
        let bestRatio = 0
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }

        if (bestId === 'hero') {
          setActiveSection('')
        } else if (bestId) {
          setActiveSection(bestId)
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0, 0.1, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const targetId = href.replace('#', '')
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView()
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-16 transition-colors duration-200 ${isScrolled
          ? 'bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-primary)]'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 font-display text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] whitespace-nowrap"
        >
          <span>Prince Psalm Vivaz</span>
          <span className="hidden sm:inline font-mono text-xs font-normal text-[var(--text-tertiary)] tracking-normal">
            / Prenz
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${isActive
                    ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/80'
                  }`}
              >
                {item.label}
              </a>
            )
          })}

          <div className="ml-2 pl-2 border-l border-[var(--border-primary)]">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex items-center justify-center p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-hover)] min-h-[44px] min-w-[44px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <List size={20} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Pure CSS compositor-only scroll progress hairline (progressive enhancement) */}
      <div aria-hidden="true" className="scroll-progress-bar" />

      {/* Native Top-Layer Mobile Navigation Drawer */}
      <dialog
        ref={drawerRef}
        id="mobile-nav-drawer"
        aria-label="Site navigation"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="nav-drawer-dialog ml-auto mr-0 my-0 h-[100svh] max-h-none w-[min(20rem,84vw)] max-w-none flex-col p-0 bg-[var(--bg-primary)] text-[var(--text-primary)] border-l border-[var(--border-primary)] shadow-2xl"
      >
        <div className="h-16 px-5 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0">
          <span className="font-display text-sm font-bold text-[var(--text-primary)]">
            Navigation
          </span>
          <button
            type="button"
            autoFocus
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="inline-flex items-center justify-center p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <X size={20} weight="regular" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleMobileNavClick(item.href)
                }}
                className={`px-4 py-3 rounded-lg text-base font-medium min-h-[44px] flex items-center transition-colors ${isActive
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] flex items-center justify-between">
          <span>Prince Psalm Vivaz</span>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            View Resume
          </a>
        </div>
      </dialog>
    </header>
  )
}
