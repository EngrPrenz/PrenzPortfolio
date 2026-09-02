import React from 'react'
import { FileText, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatsCard } from '@/components/ui/StatsCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const About: React.FC = () => {
  const highlights = [
    'Building robust full-stack web platforms with Laravel, React & Firebase',
    'Executing thorough QA strategies: boundary-value, RBAC & stress tests',
    'Explored AR systems & microcontroller hardware interfaces with Unity 3D',
    'Pursuing a B.S. in Computer Engineering (Graduating 2027)',
  ]

  return (
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            title="Behind the Code"
            subtitle="Bridging software engineering, rigorous testing, and interactive systems."
            eyebrow="ABOUT ME"
          />
        </RevealOnScroll>

        {/* Split Layout: Bio on left, 3D Stats Card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-8">
          {/* Left Column: Bio & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <RevealOnScroll delay={0.1}>
              <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] inline-block">
                <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
                  Official Name
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--accent-neon)] tracking-tight">
                  Prince Psalm Vivaz
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                I am a Computer Engineering student (Class of 2027) with a deep passion for
                architecting full-stack web applications and engineering resilient, software solutions.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Whether implementing role-based access control in Laravel, designing real-time
                Firebase POS kiosk applications, or analyzing camera latency for hardware-tracking AR
                in Unity, my goal is always the same: write clean, maintainable code and test it
                thoroughly before it hits production.
              </p>
            </RevealOnScroll>

            {/* Core Competencies Checklist */}
            <RevealOnScroll delay={0.4}>
              <div className="space-y-3 pt-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="text-[var(--accent-neon)] shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            {/* Actions */}
            <RevealOnScroll delay={0.5}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <GlowButton
                  variant="outline"
                  size="md"
                  href="#contact"
                  icon={<ArrowRight size={18} />}
                >
                  Work With Me
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="md"
                  href="/resume.pdf"
                  target="_blank"
                  icon={<FileText size={18} />}
                >
                  Download Resume / CV
                </GlowButton>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: 3D Perspective Floating Stats Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <RevealOnScroll delay={0.3} direction="left" className="w-full">
              <StatsCard />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
