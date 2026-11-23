import React, { useState } from 'react'
import {
  Check,
  Copy,
  FilePdf,
  ArrowUpRight,
} from '@phosphor-icons/react'
import { certificationsData, Certification } from '@/data/certifications'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlowButton } from '@/components/ui/GlowButton'
import { SkillBadge } from '@/components/ui/SkillBadge'
import { CertificationModal } from '@/components/ui/CertificationModal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

export const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)
  const [initialDocIndex, setInitialDocIndex] = useState(0)
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null)

  const openModal = (cert: Certification, docIndex = 0) => {
    setInitialDocIndex(docIndex)
    setSelectedCert(cert)
  }

  const handleCopyId = async (id: string, credentialId: string) => {
    try {
      await navigator.clipboard.writeText(credentialId)
      setCopiedCertId(id)
      setTimeout(() => setCopiedCertId(null), 2200)
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <section
      id="certifications"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/35"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Credentials"
          subtitle="Verified technical coursework and official PDF certificates."
        />

        <div className="space-y-6">
          {certificationsData.map((cert) => (
            <SpotlightCard
              as="article"
              key={cert.id}
              className="rounded-xl surface-card-interactive p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Credential Identity, Summary & ID */}
              <div className="relative z-[2] lg:col-span-7 flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-tertiary)]">
                  <span className="text-[var(--accent)] font-medium">
                    {cert.issuer}
                    {cert.program ? ` / ${cert.program}` : ''}
                  </span>
                  <span className="tabular-nums">{cert.issueDate}</span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1">
                    {cert.credentialType}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[60ch]">
                  {cert.summary}
                </p>

                {/* Inline Credential ID Row */}
                <div className="pt-4 border-t border-[var(--border-primary)] flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                      Credential ID
                    </span>
                    <code className="block text-xs font-mono text-[var(--text-primary)] break-all select-all mt-0.5 tabular-nums">
                      {cert.credentialId}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyId(cert.id, cert.credentialId)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--border-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {copiedCertId === cert.id ? (
                      <>
                        <Check size={14} weight="bold" className="text-[var(--accent)]" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} aria-hidden="true" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <SkillBadge key={skill} name={skill} />
                  ))}
                </div>

                <div className="pt-1">
                  <GlowButton
                    variant="solid"
                    size="md"
                    onClick={() => openModal(cert, 0)}
                    icon={<ArrowUpRight size={17} weight="bold" />}
                  >
                    Inspect Certificates ({cert.documents.length})
                  </GlowButton>
                </div>
              </div>

              {/* Right Column: Top Competencies & Direct PDF Triggers */}
              <div className="relative z-[2] lg:col-span-5 flex flex-col gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[var(--border-primary)] lg:pl-8">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Verified Competencies
                  </h4>
                  <ul className="space-y-2.5">
                    {cert.competencies.slice(0, 3).map((comp, cIdx) => (
                      <li
                        key={cIdx}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] leading-relaxed"
                      >
                        <Check
                          size={15}
                          weight="bold"
                          className="text-[var(--accent)] shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                  {cert.competencies.length > 3 && (
                    <button
                      type="button"
                      onClick={() => openModal(cert, 0)}
                      className="mt-3 text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer min-h-[36px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm"
                    >
                      View all {cert.competencies.length} competencies
                    </button>
                  )}
                </div>

                <div className="pt-5 border-t border-[var(--border-primary)]">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Official PDF Documents
                  </h4>
                  <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
                    {cert.documents.map((doc, dIdx) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => openModal(cert, dIdx)}
                        className="w-full py-3 flex items-center justify-between gap-3 text-left group cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <FilePdf
                            size={18}
                            weight="regular"
                            className="text-[var(--accent)] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                            {doc.label}
                          </span>
                        </span>
                        <span className="text-xs font-mono text-[var(--text-tertiary)] group-hover:text-[var(--accent)] shrink-0">
                          Open
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <CertificationModal
        certification={selectedCert}
        initialDocIndex={initialDocIndex}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  )
}
