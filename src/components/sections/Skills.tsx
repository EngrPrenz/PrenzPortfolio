import React from 'react'
import {
  Database,
  Terminal,
  Browsers,
  Wrench,
} from '@phosphor-icons/react'
import { skillsCategories } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const Skills: React.FC = () => {
  const categoryIcons = [
    <Browsers key="frontend" size={24} className="text-[var(--accent-neon)]" />,
    <Terminal key="backend" size={24} className="text-[var(--accent-neon)]" />,
    <Database key="database" size={24} className="text-[var(--accent-neon)]" />,
    <Wrench key="tools" size={24} className="text-[var(--accent-neon)]" />,
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

                {/* Skills List with Details */}
                <div className="space-y-3 pt-4 border-t border-[var(--border-primary)]">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)]/70 hover:bg-[var(--bg-tertiary)] transition-colors gap-1 sm:gap-4"
                    >
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {skill.name}
                      </span>
                      {skill.description && (
                        <span className="text-xs text-[var(--text-tertiary)] sm:text-right font-normal">
                          {skill.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
