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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono tracking-tight border ${
        highlight
          ? 'bg-[var(--badge-bg)] text-[var(--badge-text)] border-[var(--badge-border)]'
          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)]'
      } ${className}`}
    >
      {name}
    </span>
  )
}
