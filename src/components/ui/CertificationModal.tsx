import React, { useState, useEffect, useId, useRef } from 'react'
import {
  X,
  Check,
  Copy,
  DownloadSimple,
  ArrowSquareOut,
  FilePdf,
} from '@phosphor-icons/react'
import { Certification } from '@/data/certifications'
import { GlowButton } from './GlowButton'
import { SkillBadge } from './SkillBadge'
import { useDialogModal } from '@/hooks/useDialogModal'

interface CertificationModalProps {
  certification: Certification | null
  initialDocIndex?: number
  onClose: () => void
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  certification,
  initialDocIndex = 0,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const [activeDocIndex, setActiveDocIndex] = useState(0)
  const [copiedId, setCopiedId] = useState(false)

  useEffect(() => {
    if (certification) {
      const safeIndex =
        initialDocIndex >= 0 && initialDocIndex < certification.documents.length
          ? initialDocIndex
          : 0
      setActiveDocIndex(safeIndex)
      setCopiedId(false)
    }
  }, [certification, initialDocIndex])

  useDialogModal(
    dialogRef,
    Boolean(certification),
    () => {
      setCopiedId(false)
      onClose()
    },
    { lightDismiss: true }
  )

  const activeDoc = certification?.documents[activeDocIndex] || certification?.documents[0]

  const handleCopyCredentialId = async () => {
    if (!certification) return
    try {
      await navigator.clipboard.writeText(certification.credentialId)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2500)
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="portfolio-dialog m-auto w-[min(94vw,68rem)] max-h-[92dvh] p-0 flex-col rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden"
    >
      {certification && activeDoc && (
        <>
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] mb-1.5">
                <span className="text-[var(--accent)] font-medium">{certification.issuer}</span>
                {certification.program && <span>/ {certification.program}</span>}
                <span className="tabular-nums">/ {certification.issueDate}</span>
              </div>

              <h1
                id={titleId}
                className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
              >
                {certification.title}
              </h1>
              <p className="text-xs font-mono text-[var(--text-tertiary)] mt-0.5">
                {certification.credentialType}
              </p>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close certificate details"
              className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] border border-[var(--border-primary)] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <X size={20} weight="regular" aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain p-5 sm:p-7 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* Left: PDF Tabs & Viewer */}
              <div className="lg:col-span-7 flex flex-col gap-3.5">
                {certification.documents.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="Certificate PDF documents"
                    className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]"
                  >
                    {certification.documents.map((doc, idx) => {
                      const isActive = idx === activeDocIndex
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveDocIndex(idx)}
                          className={`flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                            isActive
                              ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <FilePdf size={15} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
                          <span className="truncate">{doc.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="rounded-lg overflow-hidden border border-[var(--border-primary)] bg-[var(--media-canvas)]">
                  <iframe
                    key={activeDoc.fileUrl}
                    src={`${activeDoc.fileUrl}#view=FitH`}
                    title={`${certification.title} - ${activeDoc.label}`}
                    className="w-full h-[52vh] lg:h-[60vh] bg-[var(--media-canvas)]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <GlowButton
                    variant="solid"
                    size="sm"
                    href={activeDoc.fileUrl}
                    target="_blank"
                    icon={<ArrowSquareOut size={16} weight="bold" />}
                    className="flex-1 min-w-[160px]"
                  >
                    Open in New Tab
                  </GlowButton>

                  <GlowButton
                    variant="outline"
                    size="sm"
                    href={activeDoc.fileUrl}
                    download={activeDoc.fileName}
                    icon={<DownloadSimple size={16} weight="bold" />}
                    className="flex-1 min-w-[160px]"
                  >
                    Download PDF
                  </GlowButton>
                </div>
              </div>

              {/* Right: Verification Details & Competencies */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="pb-5 border-b border-[var(--border-primary)] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                      Credential ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCredentialId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--border-hover)] text-xs font-medium text-[var(--text-primary)] border border-[var(--border-primary)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      {copiedId ? (
                        <>
                          <Check size={13} className="text-[var(--accent)]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block w-full text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)] break-all select-all tabular-nums">
                    {certification.credentialId}
                  </code>

                  {certification.signatories.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                        Signatories
                      </span>
                      <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                        {certification.signatories.map((sig) => (
                          <li key={sig} className="leading-snug">
                            {sig}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Verified Competencies ({certification.competencies.length})
                  </h2>
                  <ul className="space-y-2.5">
                    {certification.competencies.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
                      >
                        <Check
                          size={15}
                          weight="bold"
                          className="text-[var(--accent)] shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[var(--border-primary)]">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2.5">
                    Applied Skills
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {certification.skills.map((skill) => (
                      <SkillBadge key={skill} name={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}
