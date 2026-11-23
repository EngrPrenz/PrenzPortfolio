import React from 'react'

type SpotlightElement = 'div' | 'article' | 'a'

interface SpotlightCardProps {
  as?: SpotlightElement
  href?: string
  className?: string
  children: React.ReactNode
}

/**
 * Zero-rerender cursor-reactive spotlight surface. Mutates --mx / --my directly on the
 * DOM element via pointermove (mouse only), keeping React completely out of the pointer loop.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  as = 'div',
  href,
  className = '',
  children,
}) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const classes = `spotlight-card ${className}`.trim()

  if (as === 'a') {
    return (
      <a href={href} onPointerMove={handlePointerMove} className={classes}>
        {children}
      </a>
    )
  }

  if (as === 'article') {
    return (
      <article onPointerMove={handlePointerMove} className={classes}>
        {children}
      </article>
    )
  }

  return (
    <div onPointerMove={handlePointerMove} className={classes}>
      {children}
    </div>
  )
}
