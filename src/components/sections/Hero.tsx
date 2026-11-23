import React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, FileText } from '@phosphor-icons/react'
import { GlowButton } from '@/components/ui/GlowButton'
import { GridSignalCanvas } from '@/components/ui/GridSignalCanvas'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const DISCIPLINE_TILES = [
  {
    title: 'Full-Stack Web',
    spec: 'React, TypeScript, Laravel, PostgreSQL',
    detail: 'End-to-end web platforms and real-time multi-role POS workflows.',
    href: '#projects',
  },
  {
    title: 'Quality Assurance',
    spec: 'RBAC, Concurrency, Boundary Tests',
    detail: 'Systematic edge-case testing before code reaches production.',
    href: '#skills',
  },
  {
    title: 'Flagship Tooling',
    spec: 'Vexlo / < 0.05ms Local Eval',
    detail: 'Self-hosted feature flags with MurmurHash3 rollouts and dual runtime.',
    href: '#projects',
  },
]

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  const leadMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0.01, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: EASE_OUT_EXPO },
      }

  const tilesMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0.01, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay: 0.14, ease: EASE_OUT_EXPO },
      }

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-between pt-24 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[var(--border-primary)]"
    >
      {/* Living 36px Precision Grid with Traveling Signal Pulses */}
      <GridSignalCanvas />

      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between gap-12">
        {/* Main Statement Block */}
        <motion.div {...leadMotion} className="my-auto pt-6 sm:pt-10 max-w-4xl">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.6rem] font-bold leading-[1.01] text-[var(--text-primary)] text-balance">
            Systems built clean.
            <span className="block text-[var(--text-secondary)]">
              Verified under load.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-[54ch] leading-relaxed">
            <strong className="font-semibold text-[var(--text-primary)]">
              Prince Psalm Vivaz
            </strong>
            , Full-Stack Developer &amp; QA Engineer (B.S. Computer Engineering &apos;27). Building
            web platforms, real-time POS tools, and tested developer infrastructure.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GlowButton
              variant="solid"
              size="lg"
              href="#projects"
              icon={<ArrowDownRight size={18} weight="bold" />}
            >
              View Projects
            </GlowButton>
            <GlowButton
              variant="outline"
              size="lg"
              href="/resume.pdf"
              target="_blank"
              icon={<FileText size={18} weight="regular" />}
            >
              View Resume
            </GlowButton>
          </div>
        </motion.div>

        {/* Bottom 3-Column Cursor-Spotlight Capability Strip */}
        <motion.div
          {...tilesMotion}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
        >
          {DISCIPLINE_TILES.map((tile) => (
            <SpotlightCard
              key={tile.title}
              as="a"
              href={tile.href}
              className="group surface-card-interactive rounded-xl p-4 sm:p-5 bg-[var(--bg-card)]/90 backdrop-blur-sm block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <div className="relative z-[2] flex flex-col justify-between h-full gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {tile.title}
                  </span>
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none shrink-0"
                  />
                </div>
                <div className="text-xs font-mono text-[var(--accent)] tabular-nums truncate">
                  {tile.spec}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {tile.detail}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
