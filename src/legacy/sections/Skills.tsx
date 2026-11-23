import React from 'react'
import {
  Database,
  Terminal,
  Browsers,
  Wrench,
} from '@phosphor-icons/react'
import { skillsCategories } from '@/data/skills'
import { SectionHeading } from '@/legacy/ui/SectionHeading'
import { RevealOnScroll } from '@/legacy/ui/RevealOnScroll'
import { TechLogo } from '@/components/ui/TechLogo'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

export const Skills: React.FC = () => {
  const showTechLogos = useFeatureFlag('skill-tech-logos', undefined, true)

  const categoryIcons = [
    <Browsers key="frontend" size={24} aria-hidden="true" className="text-[var(--accent-neon)]" />,
    <Terminal key="backend" size={24} aria-hidden="true" className="text-[var(--accent-neon)]" />,
    <Database key="database" size={24} aria-hidden="true" className="text-[var(--accent-neon)]" />,
    <Wrench key="tools" size={24} aria-hidden="true" className="text-[var(--accent-neon)]" />,
  ]

  return (
    <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            title="Technical Arsenal"
            subtitle="The languages, frameworks, databases, and QA practices powering my software engineering workflows."
          />
        </RevealOnScroll>

        {/* 4 Categorized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10">
          {skillsCategories.map((category, idx) => (
            <RevealOnScroll key={category.title} delay={idx * 0.1}>
              <div className="h-full rounded-2xl glass-card border border-[var(--border-primary)] p-6 sm:p-8 hover:border-[var(--border-hover)] hover:shadow-[0_0_25px_var(--accent-neon-glow)] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] group-hover:border-[var(--accent-neon)]/50 transition-colors">
                      {categoryIcons[idx % categoryIcons.length]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        {category.title}
                      </h3>
                      <span className="text-xs font-mono text-[var(--accent-neon)]">
                        {category.skills.length} core technologies
                      </span>
                    </div>
                  </div>

                  {/* Category Description */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {category.description}
                  </p>
                </div>

                {/* Skills List with Logos & Details */}
                <ul className="space-y-2.5 pt-4 border-t border-[var(--border-primary)]">
                  {category.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="group/skill flex items-center gap-3.5 p-2.5 rounded-xl bg-[var(--bg-tertiary)]/65 hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-hover)]/60 transition-all duration-200"
                    >
                      {showTechLogos && (
                        <div className="w-12 h-9 shrink-0 rounded-lg bg-[var(--bg-primary)]/90 border border-[var(--border-primary)] group-hover/skill:border-[var(--accent-neon)]/50 group-hover/skill:shadow-[0_0_14px_var(--accent-neon-glow)] flex items-center justify-center gap-1 transition-all duration-200 group-hover/skill:scale-105 motion-reduce:transition-none motion-reduce:group-hover/skill:scale-100">
                          {skill.icons.map((iconId) => (
                            <TechLogo
                              key={iconId}
                              id={iconId}
                              size={skill.icons.length > 1 ? 17 : 22}
                            />
                          ))}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[13px] font-bold text-[var(--text-primary)] group-hover/skill:text-[var(--accent-neon)] transition-colors leading-tight">
                          {skill.name}
                        </div>
                        {skill.description && (
                          <p className="text-xs text-[var(--text-secondary)] leading-snug mt-0.5">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
