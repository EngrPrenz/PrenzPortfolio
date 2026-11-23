import React from 'react'

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
  download?: string | boolean
}

/**
 * Primary action button/link primitive with WCAG AA contrast across Dark and Light themes,
 * subtle anodized top specular bevel, and tactile press feedback.
 */
export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'solid',
  size = 'md',
  icon,
  children,
  className = '',
  href,
  target,
  rel,
  download,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs min-h-[40px]',
    md: 'px-5 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-sm sm:text-base min-h-[48px]',
  }[size]

  const variantClasses = {
    solid:
      'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold border border-transparent hover:bg-[var(--accent-hover)] shadow-[var(--button-specular)]',
    outline:
      'bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] font-medium border border-[var(--border-hover)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] shadow-[var(--button-ghost-specular)]',
    ghost:
      'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium border border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)] shadow-[var(--button-ghost-specular)]',
  }[variant]

  const commonClasses = [
    'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150',
    'cursor-pointer select-none whitespace-nowrap',
    'hover:-translate-y-[1px] active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
    'disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none',
    sizeClasses,
    variantClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? rel || 'noopener noreferrer' : rel}
        download={download}
        className={commonClasses}
      >
        <span>{children}</span>
        {icon && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </a>
    )
  }

  return (
    <button type={type} className={commonClasses} {...props}>
      <span>{children}</span>
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}
