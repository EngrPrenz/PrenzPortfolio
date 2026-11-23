import React from 'react'
import { ProjectStatus } from '@/data/projects'

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; dotClass: string; badgeStyle: React.CSSProperties }
> = {
  live: {
    label: 'Live',
    dotClass: 'bg-[var(--accent)]',
    badgeStyle: {
      backgroundColor: 'var(--badge-bg)',
      color: 'var(--badge-text)',
      borderColor: 'var(--badge-border)',
    },
  },
  development: {
    label: 'In Progress',
    dotClass: 'bg-[var(--status-dev-text)]',
    badgeStyle: {
      backgroundColor: 'var(--status-dev-bg)',
      color: 'var(--status-dev-text)',
      borderColor: 'var(--status-dev-border)',
    },
  },
  upcoming: {
    label: 'Planned',
    dotClass: 'bg-[var(--status-upcoming-text)]',
    badgeStyle: {
      backgroundColor: 'var(--status-upcoming-bg)',
      color: 'var(--status-upcoming-text)',
      borderColor: 'var(--status-upcoming-border)',
    },
  },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.live

  return (
    <span
      style={config.badgeStyle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${className}`}
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  )
}
