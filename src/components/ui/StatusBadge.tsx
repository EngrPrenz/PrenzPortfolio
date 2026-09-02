import React from 'react'
import { ProjectStatus } from '@/data/projects'

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const configs = {
    live: {
      label: 'Live Deployment',
      dotColor: 'bg-[#00ff88]',
      ringColor: 'ring-[#00ff88]/40',
      badgeBg: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 dark:text-[#00ff88] light:text-[#00944b]',
    },
    development: {
      label: 'In Development',
      dotColor: 'bg-amber-400',
      ringColor: 'ring-amber-400/40',
      badgeBg: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    },
    upcoming: {
      label: 'Upcoming Project',
      dotColor: 'bg-cyan-400',
      ringColor: 'ring-cyan-400/40',
      badgeBg: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
    },
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium font-mono border ${configs.badgeBg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${configs.dotColor}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${configs.dotColor}`} />
      </span>
      {configs.label}
    </span>
  )
}
