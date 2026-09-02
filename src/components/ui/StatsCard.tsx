import React, { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Terminal, Code, GitFork, Cpu, GraduationCap, CheckCircle } from '@phosphor-icons/react'

export const StatsCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    // Limit rotation to subtle 8 degrees
    setRotateX(-y / 18)
    setRotateY(x / 18)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const stats = [
    { label: 'Years Coding', value: '3+', icon: <Code size={20} className="text-[var(--accent-neon)]" /> },
    { label: 'Shipped Projects', value: '4+', icon: <Terminal size={20} className="text-[var(--accent-neon)]" /> },
    { label: 'Technologies', value: '15+', icon: <Cpu size={20} className="text-[var(--accent-neon)]" /> },
    { label: 'GitHub Repos', value: '10+', icon: <GitFork size={20} className="text-[var(--accent-neon)]" /> },
  ]

  return (
    <div className="relative perspective-1000 w-full max-w-md mx-auto">
      {/* Background ambient neon blur */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--accent-neon)] to-emerald-600 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          scale: isHovered && !shouldReduceMotion ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative rounded-2xl glass-card p-6 sm:p-8 shadow-2xl border border-[var(--border-primary)] transition-colors duration-300"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-[var(--text-tertiary)] flex items-center gap-1.5">
            <Terminal size={14} /> prenz@system:~
          </span>
        </div>

        {/* Identity & Status */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--accent-neon-glow)] text-[var(--accent-neon)] border border-[var(--border-hover)] text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-neon)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-neon)]" />
              </span>
              AVAILABLE FOR ROLES
            </div>
            <span className="text-xs font-mono text-[var(--text-secondary)]">v2025.1</span>
          </div>

          <div className="pt-2">
            <p className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
              Profile Summary
            </p>
            <h4 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Prince Psalm Vivaz
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-1">
              <GraduationCap size={16} className="text-[var(--accent-neon)]" />
              <span>Computer Engineering — Graduating 2027</span>
            </div>
          </div>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                {stat.icon}
                <CheckCircle size={14} className="text-[var(--text-tertiary)]" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mini terminal footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-primary)] text-xs font-mono text-[var(--text-tertiary)] flex justify-between items-center">
          <span>Target: Full Stack &amp; QA</span>
          <span className="text-[var(--accent-neon)]">sys.status: optimal</span>
        </div>
      </motion.div>
    </div>
  )
}
