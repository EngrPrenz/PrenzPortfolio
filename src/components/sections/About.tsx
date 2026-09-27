import React, { useState } from 'react'
import {
  FileText,
  CheckCircle,
  ArrowRight,
  User,
  Sparkle,
  Cpu,
  GameController,
  Cube,
  Camera,
  MusicNotes,
  Wrench,
  Globe,
  DeviceMobile,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatsCard } from '@/components/ui/StatsCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { useHobbies } from '@/hooks/useHobbies'

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bio' | 'hobbies'>('bio')
  const { hobbies } = useHobbies()

  const visibleHobbies = hobbies.filter((h) => h.featured !== false)

  const highlights = [
    'Building robust full-stack web platforms with Laravel, React & Firebase',
    'Executing thorough QA strategies: boundary-value, RBAC & stress tests',
    'Explored AR systems & microcontroller hardware interfaces with Unity 3D',
    'Pursuing a B.S. in Computer Engineering (Graduating 2027)',
  ]

  const renderHobbyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu size={22} className="text-[var(--accent-neon)]" />
      case 'Circuitry':
        return <Cpu size={22} className="text-[var(--accent-neon)]" />
      case 'GameController':
        return <GameController size={22} className="text-[var(--accent-neon)]" />
      case 'Cube':
        return <Cube size={22} className="text-[var(--accent-neon)]" />
      case 'Wrench':
        return <Wrench size={22} className="text-[var(--accent-neon)]" />
      case 'Camera':
        return <Camera size={22} className="text-[var(--accent-neon)]" />
      case 'MusicNotes':
        return <MusicNotes size={22} className="text-[var(--accent-neon)]" />
      case 'Globe':
        return <Globe size={22} className="text-[var(--accent-neon)]" />
      case 'DeviceMobile':
        return <DeviceMobile size={22} className="text-[var(--accent-neon)]" />
      default:
        if (iconName && iconName.length <= 4) {
          return <span className="text-xl">{iconName}</span>
        }
        return <Sparkle size={22} className="text-[var(--accent-neon)]" />
    }
  }

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

        {/* Interactive Sub-Panel Tab Switcher */}
        <RevealOnScroll delay={0.1}>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] w-fit mb-8 mt-2">
            <button
              onClick={() => setActiveTab('bio')}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all duration-200 cursor-pointer select-none ${
                activeTab === 'bio'
                  ? 'text-[#0a0a0a] font-bold dark:text-[#050505]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {activeTab === 'bio' && (
                <motion.div
                  layoutId="aboutSubTabIndicator"
                  className="absolute inset-0 rounded-xl bg-[var(--accent-neon)] shadow-[0_0_15px_var(--accent-neon-glow)] z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <User size={16} className="relative z-10" />
              <span className="relative z-10">Engineering Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('hobbies')}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all duration-200 cursor-pointer select-none ${
                activeTab === 'hobbies'
                  ? 'text-[#0a0a0a] font-bold dark:text-[#050505]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {activeTab === 'hobbies' && (
                <motion.div
                  layoutId="aboutSubTabIndicator"
                  className="absolute inset-0 rounded-xl bg-[var(--accent-neon)] shadow-[0_0_15px_var(--accent-neon-glow)] z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Sparkle size={16} className="relative z-10" />
              <span className="relative z-10">Interests & Hobbies</span>
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === 'hobbies'
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-[var(--bg-tertiary)] text-[var(--accent-neon)]'
                }`}
              >
                {visibleHobbies.length}
              </span>
            </button>
          </div>
        </RevealOnScroll>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'bio' ? (
            <motion.div
              key="bio-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
            >
              {/* Left Column: Bio & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] inline-block">
                    <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
                      Official Name
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--accent-neon)] tracking-tight">
                      Prince Psalm Vivaz
                    </span>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                  I am a Computer Engineering student (Class of 2027) with a deep passion for
                  architecting full-stack web applications and engineering resilient, software solutions.
                </p>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Whether implementing role-based access control in Laravel, designing real-time
                  Firebase POS kiosk applications, or analyzing camera latency for hardware-tracking AR
                  in Unity, my goal is always the same: write clean, maintainable code and test it
                  thoroughly before it hits production.
                </p>

                {/* Core Competencies Checklist */}
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

                {/* Actions */}
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
              </div>

              {/* Right Column: 3D Perspective Floating Stats Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <StatsCard />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hobbies-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Outside of commercial software development and academic engineering, here are the
                  hands-on hardware, simulation experiments, and maker passions that fuel my curiosity.
                </p>
              </div>

              {/* Hobbies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {visibleHobbies.map((hobby, idx) => (
                  <motion.div
                    key={hobby.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group relative bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)]/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
                  >
                    {/* Background subtle glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-neon-glow)] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Top Header with Icon & Category */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] group-hover:border-[var(--accent-neon)]/40 flex items-center justify-center transition-colors">
                            {renderHobbyIcon(hobby.icon)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-neon)] font-semibold block">
                              {hobby.category}
                            </span>
                            <h3 className="font-mono font-bold text-base sm:text-lg text-[var(--text-primary)]">
                              {hobby.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                        {hobby.description}
                      </p>
                    </div>

                    {/* Footer: Tags & Optional Image */}
                    <div className="space-y-3 pt-3 border-t border-[var(--border-primary)]/60">
                      {hobby.imageUrl && (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-[var(--border-primary)] bg-[var(--bg-primary)] max-h-36">
                          <img
                            src={hobby.imageUrl}
                            alt={hobby.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {hobby.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] group-hover:border-[var(--accent-neon)]/30 group-hover:text-[var(--text-primary)] transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
