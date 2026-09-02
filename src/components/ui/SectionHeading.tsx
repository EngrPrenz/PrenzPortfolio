import React from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  eyebrow?: string
  centered?: boolean
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  eyebrow,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-neon)]" />
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-[var(--accent-neon)] font-medium">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] max-w-[65ch] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
