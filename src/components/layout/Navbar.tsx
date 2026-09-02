import React, { useState, useEffect } from 'react'
import { List, X } from '@phosphor-icons/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Featured', href: '#featured' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-primary)] shadow-lg shadow-black/10 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#"
          className="group flex items-center gap-2 font-mono text-lg sm:text-xl font-extrabold tracking-wider text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-neon)] rounded"
        >
          <span className="text-[var(--accent-neon)] font-mono">&lt;</span>
          <span className="tracking-tight text-[var(--accent-neon)] font-mono">Prenz</span>
          <span className="text-[var(--accent-neon)] font-mono">/&gt;</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-neon)] group-hover:animate-ping" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-neon)] transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[var(--accent-neon)] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              {item.label}
            </a>
          ))}

          {/* Theme Toggle */}
          <ThemeToggle />
        </nav>

        {/* Mobile Actions: ThemeToggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-neon)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[65px] bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-6 shadow-2xl space-y-4 animate-in slide-in-from-top duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-neon)] transition-colors min-h-[44px] flex items-center"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-primary)] flex justify-between items-center text-xs font-mono text-[var(--text-tertiary)]">
              <span>Prince Psalm Vivaz</span>
              <span className="text-[var(--accent-neon)]">PrenzPortfolio</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
