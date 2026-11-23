import React, { useEffect, useState } from 'react'

interface TypeWriterProps {
  roles: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  roles,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  className = '',
}) => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing phase
      if (displayedText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1))
        }, typingSpeed)
      } else {
        // Word complete, wait before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Deleting phase
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length - 1))
        }, deletingSpeed)
      } else {
        // Move to next role
        setIsDeleting(false)
        setRoleIndex((prev) => (prev + 1) % roles.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={`inline-flex items-center ${className}`} aria-label={`Role: ${roles[roleIndex]}`}>
      <span className="text-[var(--accent-neon)] font-mono font-semibold tracking-wide">
        {displayedText}
      </span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block w-[2.5px] h-[1.15em] bg-[var(--accent-neon)] animate-pulse rounded-full"
      />
    </span>
  )
}
