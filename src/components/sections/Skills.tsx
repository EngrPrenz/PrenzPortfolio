import React from 'react'
import { Database, Terminal, Browsers, Wrench } from '@phosphor-icons/react'
import { skillsCategories } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TechLogo } from '@/components/ui/TechLogo'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

export const Skills: React.FC = () => {
  const showTechLogos = useFeatureFlag('skill-tech-logos', undefined, true)

  const categoryIcons = [
    <Browsers key="frontend" size={20} aria-hidden="true" className="text-[var(--accent)]" />,
    <Terminal key="backend" size={20} aria-hidden="true" className="text-[var(--accent)]" />,
    <Database key="database" size={20} aria-hidden="true" className="text-[var(--accent)]" />,
    <Wrench key="tools" size={20} aria-hidden="true" className="text-[var(--accent)]" />,
  ]

  return (
    <section
      id="skills"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-primary)]"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Skills & Stack"
          subtitle="Languages, frameworks, databases, and QA tools used across shipped projects."
        />

        {/* Flat Hairline-Divided 2x2 Capability Ledger (zero nested card chrome) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {skillsCategories.map((category, idx) => (
            <div key={category.title} className="border-t border-[var(--border-primary)] pt-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  {categoryIcons[idx % categoryIcons.length]}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    {category.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[var(--text-tertiary)] tabular-nums">
                  {category.skills.length} tools
                </span>
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                {category.description}
              </p>

              <ul className="divide-y divide-[var(--border-primary)]/70">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="py-3 flex items-center gap-3.5"
                  >
                    {showTechLogos && (
                      <div className="w-10 h-8 shrink-0 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-[var(--button-ghost-specular)] flex items-center justify-center gap-1">
                        {skill.icons.map((iconId) => (
                          <TechLogo
                            key={iconId}
                            id={iconId}
                            size={skill.icons.length > 1 ? 15 : 20}
                          />
                        ))}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--text-primary)] leading-snug">
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
          ))}
        </div>
      </div>
    </section>
  )
}
