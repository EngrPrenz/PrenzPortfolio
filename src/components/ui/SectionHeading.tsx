import React from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-10 sm:mb-12 ${centered ? 'text-center mx-auto' : 'text-left'} ${className}`}>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[var(--text-primary)] leading-[1.08] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base text-[var(--text-secondary)] max-w-[60ch] leading-relaxed ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
