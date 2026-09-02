import React from 'react'
import { ArrowDown, Sparkle } from '@phosphor-icons/react'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { TypeWriter } from '@/components/ui/TypeWriter'
import { GlowButton } from '@/components/ui/GlowButton'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const Hero: React.FC = () => {
  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Web Developer',
    'Mobile Developer',
    'Game Developer',
    'QA Engineer',
    'Student / Aspiring Developer',
  ]

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Interactive Particle Animation Background */}
      <ParticleBackground />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <RevealOnScroll delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-neon-glow)] text-[var(--accent-neon)] border border-[var(--border-hover)] text-xs font-mono mb-6">
            <Sparkle size={14} weight="fill" className="animate-pulse" />
            <span>Computer Engineering Student &amp; Builder</span>
          </div>
        </RevealOnScroll>

        {/* Main Display Headline */}
        <RevealOnScroll delay={0.2}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.05]">
            Hello, I&apos;m{' '}
            <span className="text-[var(--accent-neon)] font-mono drop-shadow-[0_0_20px_var(--accent-neon-glow)]">
              Prenz
            </span>
          </h1>
        </RevealOnScroll>

        {/* Dynamic Typewriter Roles */}
        <RevealOnScroll delay={0.3} className="mt-4 sm:mt-6">
          <div className="text-lg sm:text-2xl md:text-3xl font-medium text-[var(--text-secondary)] flex flex-wrap items-center justify-center gap-2">
            <span>Building as a</span>
            <TypeWriter roles={roles} />
          </div>
        </RevealOnScroll>

        {/* Tagline */}
        <RevealOnScroll delay={0.4}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed font-normal">
            Obsessed with clean code, cool projects, and pushing what&apos;s possible.
          </p>
        </RevealOnScroll>

        {/* CTAs */}
        <RevealOnScroll delay={0.5} className="mt-8 sm:mt-10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton variant="solid" size="lg" href="#featured">
              View Projects
            </GlowButton>
            <GlowButton variant="ghost" size="lg" href="#contact">
              Get in Touch
            </GlowButton>
          </div>
        </RevealOnScroll>

        {/* Scroll indicator prompt */}
        <RevealOnScroll delay={0.7} className="mt-16 sm:mt-20">
          <a
            href="#about"
            aria-label="Scroll to About section"
            className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--accent-neon)] transition-colors"
          >
            <span>DISCOVER</span>
            <ArrowDown size={16} className="animate-bounce text-[var(--accent-neon)]" />
          </a>
        </RevealOnScroll>
      </div>
    </section>
  )
}
