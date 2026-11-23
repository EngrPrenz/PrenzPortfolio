import React from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from '@/context/ThemeContext'

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun size={20} weight="bold" className="text-amber-300 animate-in fade-in duration-200" />
      ) : (
        <Moon size={20} weight="bold" className="text-indigo-600 animate-in fade-in duration-200" />
      )}
    </button>
  )
}
