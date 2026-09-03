import React from 'react'

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'solid',
  size = 'md',
  icon,
  children,
  className = '',
  href,
  target,
  rel,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[40px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-3.5 text-base min-h-[48px]',
  }[size]

  const variantClasses = {
    solid:
      'bg-[#00ff88] text-[#0a0a0a] font-semibold hover:bg-[#00cc6a] hover:shadow-[0_0_25px_rgba(0,255,136,0.35)] dark:bg-[#00ff88] dark:text-[#050505] dark:hover:bg-[#00e67a]',
    ghost:
      'bg-transparent text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)] hover:bg-[var(--accent-neon-glow)]',
    outline:
      'bg-transparent text-[var(--accent-neon)] border border-[var(--accent-neon)] hover:bg-[var(--accent-neon)] hover:text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(0,255,136,0.25)]',
  }[variant]

  const commonClasses = `inline-flex items-center justify-center gap-2.5 rounded-lg transition-all duration-200 cursor-pointer select-none whitespace-nowrap active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : rel}
        className={commonClasses}
      >
        {children}
        {icon && <span className="shrink-0">{icon}</span>}
      </a>
    )
  }

  return (
    <button className={commonClasses} {...props}>
      {children}
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  )
}
