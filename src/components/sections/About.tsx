import React, { useState } from 'react'
import { Check, FileText, ArrowUpRight } from '@phosphor-icons/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { HobbyModal } from '@/components/ui/HobbyModal'
import { HobbyIcon } from '@/components/ui/HobbyIcon'
import { useHobbies } from '@/hooks/useHobbies'
import { Hobby, getHobbyImages } from '@/types/hobby'

const ENGINEERING_PRACTICES = [
  'Full-stack web applications with React, TypeScript, Laravel, Node.js, and relational or real-time databases',
  'Systematic QA workflows covering RBAC isolation, boundary-value analysis, and concurrent order stress tests',
  'Spatial and hardware-adjacent builds using Unity 3D, AR Foundation, and Arduino microcontrollers',
]

const PROFILE_FACTS = [
  { label: 'Education', value: 'B.S. Computer Engineering, Class of 2027' },
  { label: 'Primary Focus', value: 'Full-Stack Engineering & Software QA' },
  { label: 'Availability', value: 'Open to internships & junior engineering roles' },
  { label: 'Location', value: 'Philippines (UTC+8)' },
]

export const About: React.FC = () => {
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null)
  const { hobbies } = useHobbies()

  const visibleHobbies = hobbies.filter((h) => h.featured !== false)

  return (
    <section
      id="about"
      className="section-studio-light py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/35"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Editorial Bio + Border-Separated Engineering Summary Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <SectionHeading
              title="About"
              subtitle="Engineering full-stack systems with the same care for edge cases and reliability as for the interface."
              className="mb-6"
            />

            <div className="space-y-4 text-base text-[var(--text-secondary)] leading-relaxed max-w-[62ch]">
              <p>
                I am Prince Psalm Vivaz, a Computer Engineering student focused on building maintainable full-stack applications and verifying how they behave under real constraints.
              </p>
              <p>
                Whether enforcing role-based access in Laravel, eliminating race conditions in a real-time Firebase POS, or keeping local feature-flag evaluation under 0.05ms in Vexlo, I aim to ship code that is clear to read and proven before release.
              </p>
            </div>

            <ul className="mt-6 space-y-2.5 max-w-[62ch]">
              {ENGINEERING_PRACTICES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[var(--text-primary)] leading-relaxed"
                >
                  <Check
                    size={16}
                    weight="bold"
                    className="text-[var(--accent)] shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Clean Border-Separated Fact Rail (zero fake terminal chrome) */}
          <aside className="lg:col-span-5 lg:pt-2">
            <dl className="border-t border-[var(--border-primary)] divide-y divide-[var(--border-primary)]">
              {PROFILE_FACTS.map((fact) => (
                <div key={fact.label} className="py-4 flex flex-col gap-1">
                  <dt className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                    {fact.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="pt-5 border-t border-[var(--border-primary)]">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
              >
                <FileText size={18} weight="regular" aria-hidden="true" />
                <span>View Resume</span>
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>

        {/* Inline Photo-Led Hobbies Strip */}
        {visibleHobbies.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--border-primary)]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Outside of Engineering
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Hardware tinkering, guitar, ranked gaming, and weekend rides. Select any photo to open the gallery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visibleHobbies.map((hobby) => {
                const hobbyImages = getHobbyImages(hobby)
                const coverImage = hobbyImages[0]

                return (
                  <article key={hobby.id} className="group flex flex-col">
                    <button
                      type="button"
                      onClick={() => setSelectedHobby(hobby)}
                      aria-label={`Open ${hobby.title} gallery`}
                      className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-xl"
                    >
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-[var(--border-primary)] group-hover:border-[var(--border-hover)] bg-[var(--media-canvas)] transition-colors">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={hobby.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HobbyIcon name={hobby.icon} size={28} />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                          {hobby.title}
                        </h4>
                        {hobbyImages.length > 1 && (
                          <span className="text-xs font-mono text-[var(--text-tertiary)] tabular-nums shrink-0">
                            {hobbyImages.length} photos
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {hobby.description}
                      </p>
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <HobbyModal
        hobby={selectedHobby}
        icon={selectedHobby ? <HobbyIcon name={selectedHobby.icon} size={20} /> : null}
        onClose={() => setSelectedHobby(null)}
      />
    </section>
  )
}
