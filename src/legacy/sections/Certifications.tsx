import React, { useState } from 'react'
import {
  Certificate,
  CheckCircle,
  Copy,
  Check,
  FilePdf,
  Eye,
  CalendarBlank,
  ShieldCheck,
  DownloadSimple,
} from '@phosphor-icons/react'
import { certificationsData, Certification } from '@/data/certifications'
import { SectionHeading } from '@/legacy/ui/SectionHeading'
import { RevealOnScroll } from '@/legacy/ui/RevealOnScroll'
import { GlowButton } from '@/legacy/ui/GlowButton'
import { CertificationModal } from '@/legacy/ui/CertificationModal'

export const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)
  const [initialDocIndex, setInitialDocIndex] = useState(0)
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null)

  const isSingle = certificationsData.length === 1

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
      // Clipboard fallback unavailable
    }
  }

  return (
    <section id="certifications" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="VERIFIED CREDENTIALS"
            title="Certifications & Training"
            subtitle="Industry-recognized technical credentials reinforcing my software engineering, QA, and AI workflows."
          />
        </RevealOnScroll>

        <div
          className={
            isSingle
              ? 'max-w-4xl mx-auto mt-10'
              : 'grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10'
          }
        >
          {certificationsData.map((cert, idx) => (
            <RevealOnScroll key={cert.id} delay={idx * 0.1}>
              <article className="relative rounded-2xl glass-card border border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:shadow-[0_0_30px_var(--accent-neon-glow)] transition-all duration-300 overflow-hidden group">
                {/* Accent neon top line */}
                <div className="h-1 w-full bg-gradient-to-r from-[var(--accent-neon)] via-emerald-400 to-transparent" />

                <div
                  className={
                    isSingle
                      ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-start'
                      : 'flex flex-col gap-6 p-6 sm:p-8'
                  }
                >
                  {/* Left / Top Column: Metadata, Credential ID, Tags & Actions */}
                  <div className={isSingle ? 'lg:col-span-6 flex flex-col gap-5' : 'flex flex-col gap-5'}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                        <ShieldCheck size={15} weight="fill" aria-hidden="true" />
                        Verified Credential
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                        <CalendarBlank size={14} className="text-[var(--accent-neon)]" aria-hidden="true" />
                        {cert.issueDate}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] group-hover:border-[var(--accent-neon)]/50 flex items-center justify-center shrink-0 transition-colors">
                        <Certificate size={26} weight="duotone" className="text-[var(--accent-neon)]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-neon)] font-semibold block">
                          {cert.issuer}
                          {cert.program ? ` · ${cert.program}` : ''}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mt-1">
                          {cert.title}
                        </h3>
                        <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1">
                          {cert.credentialType}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {cert.summary}
                    </p>

                    {/* Credential ID Box */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                          Credential ID
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(cert.id, cert.credentialId)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[var(--accent-neon)] hover:underline cursor-pointer"
                        >
                          {copiedCertId === cert.id ? (
                            <>
                              <Check size={13} weight="bold" aria-hidden="true" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} aria-hidden="true" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block text-xs font-mono text-[var(--text-primary)] break-all select-all">
                        {cert.credentialId}
                      </code>
                    </div>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Primary CTA */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <GlowButton
                        variant="solid"
                        size="md"
                        onClick={() => openModal(cert, 0)}
                        icon={<Eye size={18} weight="bold" />}
                      >
                        Inspect Official PDFs
                      </GlowButton>

                      {cert.documents[0] && (
                        <a
                          href={cert.documents[0].fileUrl}
                          download={cert.documents[0].fileName}
                          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:border-[var(--accent-neon)] text-xs font-mono font-semibold text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-colors"
                        >
                          <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                          <span>Download PDF</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right / Bottom Column: Verified Competencies & Document Pills */}
                  <div
                    className={
                      isSingle
                        ? 'lg:col-span-6 flex flex-col gap-5 pt-4 lg:pt-0 lg:border-l lg:border-[var(--border-primary)] lg:pl-8'
                        : 'flex flex-col gap-5 pt-4 border-t border-[var(--border-primary)]'
                    }
                  >
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-neon)] font-bold mb-3">
                        Key Verified Competencies
                      </h4>
                      <ul className="space-y-2.5">
                        {cert.competencies.slice(0, 5).map((comp, cIdx) => (
                          <li
                            key={cIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
                          >
                            <CheckCircle
                              size={17}
                              weight="fill"
                              className="text-[var(--accent-neon)] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                      {cert.competencies.length > 5 && (
                        <button
                          type="button"
                          onClick={() => openModal(cert, 0)}
                          className="mt-3 text-xs font-mono font-semibold text-[var(--accent-neon)] hover:underline cursor-pointer"
                        >
                          +{cert.competencies.length - 5} more competencies in full details →
                        </button>
                      )}
                    </div>

                    {/* Quick Document Selector Pills */}
                    <div className="pt-3 border-t border-[var(--border-primary)] space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                        Official Credential PDFs ({cert.documents.length})
                      </span>
                      <div className="flex flex-col gap-2">
                        {cert.documents.map((doc, dIdx) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => openModal(cert, dIdx)}
                            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-neon)] text-left transition-all cursor-pointer group/doc"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <FilePdf
                                size={18}
                                weight="duotone"
                                className="text-[var(--accent-neon)] shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-xs font-mono font-semibold text-[var(--text-primary)] group-hover/doc:text-[var(--accent-neon)] truncate">
                                {doc.label}
                              </span>
                            </span>
                            <span className="text-[11px] font-mono text-[var(--text-tertiary)] group-hover/doc:text-[var(--accent-neon)] shrink-0">
                              Preview →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
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
