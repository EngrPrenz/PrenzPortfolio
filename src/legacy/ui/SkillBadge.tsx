import React from 'react'

interface SkillBadgeProps {
  name: string
  highlight?: boolean
  className?: string
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  highlight = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono tracking-tight transition-all duration-150 select-none ${
        highlight
          ? 'bg-[var(--accent-neon-glow)] text-[var(--accent-neon)] border border-[var(--border-hover)]'
          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-neon)]'
      } ${className}`}
    >
      {name}
    </span>
  )
}
