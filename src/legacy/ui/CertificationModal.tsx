import React, { useState, useEffect, useId, useRef } from 'react'
import {
  X,
  Certificate,
  CheckCircle,
  Copy,
  Check,
  DownloadSimple,
  ArrowSquareOut,
  FilePdf,
  CalendarBlank,
  Signature,
} from '@phosphor-icons/react'
import { Certification } from '@/data/certifications'
import { GlowButton } from './GlowButton'

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

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const dispatchedOpenRef = useRef(false)

  const [activeDocIndex, setActiveDocIndex] = useState(0)
  const [copiedId, setCopiedId] = useState(false)

  // Sync active document tab & open/close native top-layer <dialog>
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (certification) {
      const safeIndex =
        initialDocIndex >= 0 && initialDocIndex < certification.documents.length
          ? initialDocIndex
          : 0
      setActiveDocIndex(safeIndex)
      setCopiedId(false)
      if (!dialog.open) {
        dialog.showModal()
      }
      if (!dispatchedOpenRef.current) {
        dispatchedOpenRef.current = true
        window.dispatchEvent(new CustomEvent('prenz:modal-open'))
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [certification, initialDocIndex])

  // Sync React state when browser closes dialog (Esc, Close button, or light dismiss)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      dialog.returnValue = ''
      setCopiedId(false)
      if (dispatchedOpenRef.current) {
        dispatchedOpenRef.current = false
        window.dispatchEvent(new CustomEvent('prenz:modal-close'))
      }
      onCloseRef.current()
    }

    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      if (dispatchedOpenRef.current) {
        dispatchedOpenRef.current = false
        window.dispatchEvent(new CustomEvent('prenz:modal-close'))
      }
    }
  }, [])

  // Mandatory Safari light-dismiss fallback where HTMLDialogElement.prototype.closedBy is missing
  useEffect(() => {
    if ('closedBy' in HTMLDialogElement.prototype) return
    const dialog = dialogRef.current
    if (!dialog) return

    let pressedOutside = false
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (e.target !== dialog) {
        pressedOutside = false
        return
      }
      pressedOutside = isOutside(e)
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (e.target === dialog && pressedOutside && isOutside(e) && dialog.open) {
        dialog.close()
      }
      pressedOutside = false
    }

    dialog.addEventListener('pointerdown', handlePointerDown)
    dialog.addEventListener('pointerup', handlePointerUp)
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown)
      dialog.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const activeDoc = certification?.documents[activeDocIndex] || certification?.documents[0]

  const handleCopyCredentialId = async () => {
    if (!certification) return
    try {
      await navigator.clipboard.writeText(certification.credentialId)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2500)
    } catch {
      // Clipboard fallback unavailable
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as any)}
      className="certification-dialog m-auto w-[min(94vw,68rem)] max-h-[92dvh] p-0 flex-col rounded-2xl bg-[#0d1117] text-[#f0f6fc] border border-[#21262d] shadow-2xl overflow-hidden"
    >
      {certification && activeDoc && (
        <>
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 border-b border-[#21262d] bg-[#161b22]/60 shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30">
                  <Certificate size={14} weight="fill" aria-hidden="true" />
                  {certification.issuer}
                </span>
                {certification.program && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#c9d1d9] bg-[#21262d] border border-[#30363d]">
                    {certification.program}
                  </span>
                )}
              </div>

              <h2
                id={titleId}
                className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white"
              >
                {certification.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#8b949e] mt-1">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarBlank size={14} className="text-[#00ff88]" aria-hidden="true" />
                  Issued: <strong className="text-[#c9d1d9] font-semibold">{certification.issueDate}</strong>
                </span>
                <span>{certification.credentialType}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close certificate modal"
              className="p-2.5 rounded-full bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff88]"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain p-5 sm:p-7 flex-1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* Left Column: Document Tabs + Embedded PDF Viewer */}
              <div className="lg:col-span-7 flex flex-col gap-3.5">
                {/* Document Switcher Tabs */}
                {certification.documents.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="Certificate PDF documents"
                    className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#161b22] border border-[#30363d]"
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
                          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] ${
                            isActive
                              ? 'bg-[#00ff88] text-[#050505] font-bold shadow-[0_0_14px_rgba(0,255,136,0.3)]'
                              : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
                          }`}
                        >
                          <FilePdf size={16} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
                          <span className="truncate">{doc.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Embedded PDF Frame */}
                <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#0a0d12] shadow-inner">
                  <iframe
                    key={activeDoc.fileUrl}
                    src={`${activeDoc.fileUrl}#view=FitH`}
                    title={`${certification.title} — ${activeDoc.label}`}
                    className="w-full h-[55vh] lg:h-[64vh] bg-[#0a0d12]"
                  />
                </div>

                {/* Direct PDF Open & Download Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <GlowButton
                    variant="solid"
                    size="sm"
                    href={activeDoc.fileUrl}
                    target="_blank"
                    icon={<ArrowSquareOut size={16} weight="bold" />}
                    className="flex-1 min-w-[160px]"
                  >
                    Open PDF in New Tab
                  </GlowButton>

                  <a
                    href={activeDoc.fileUrl}
                    download={activeDoc.fileName}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-lg border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] hover:border-[#00ff88] text-xs font-mono font-semibold text-[#e6edf3] hover:text-[#00ff88] transition-colors"
                  >
                    <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Credential ID, Signatories & Competencies */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Credential Verification Card */}
                <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#00ff88] font-bold">
                      Credential Verification ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCredentialId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[11px] font-mono text-[#e6edf3] border border-[#30363d] transition-colors cursor-pointer"
                    >
                      {copiedId ? (
                        <>
                          <Check size={13} className="text-[#00ff88]" aria-hidden="true" />
                          <span className="text-[#00ff88]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block w-full text-xs font-mono text-[#c9d1d9] bg-[#0a0d12] px-3 py-2 rounded-lg border border-[#21262d] break-all select-all">
                    {certification.credentialId}
                  </code>

                  {certification.signatories.length > 0 && (
                    <div className="pt-2 border-t border-[#21262d] space-y-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#8b949e]">
                        <Signature size={13} className="text-[#00ff88]" aria-hidden="true" />
                        Authorized Signatories
                      </span>
                      <ul className="space-y-1 text-xs text-[#c9d1d9]">
                        {certification.signatories.map((sig) => (
                          <li key={sig} className="leading-snug">
                            {sig}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Competencies List */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                    Verified Course Competencies ({certification.competencies.length})
                  </h3>
                  <ul className="space-y-2">
                    {certification.competencies.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#161b22] border border-[#30363d]/70 text-xs text-[#c9d1d9]"
                      >
                        <CheckCircle
                          size={16}
                          weight="bold"
                          className="text-[#00ff88] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Tags */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2.5">
                    Key Applied Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {certification.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#21262d] text-[#e6edf3] border border-[#30363d]"
                      >
                        {skill}
                      </span>
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
