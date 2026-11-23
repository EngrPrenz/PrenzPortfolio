import { useEffect, useRef, RefObject } from 'react'

interface UseDialogModalOptions {
  /** Enables click-outside backdrop dismissal fallback where HTMLDialogElement.prototype.closedBy is missing. */
  lightDismiss?: boolean
}

let cachedSupportsDisplayTransition: boolean | undefined

function canTransitionDisplay(): boolean {
  if (cachedSupportsDisplayTransition !== undefined) return cachedSupportsDisplayTransition
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false
  }
  const probe = document.createElement('div')
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;'
  document.body.appendChild(probe)
  getComputedStyle(probe).display
  probe.style.display = 'none'
  cachedSupportsDisplayTransition = getComputedStyle(probe).display === 'block'
  probe.remove()
  return cachedSupportsDisplayTransition
}

function supportsTopLayerExit(): boolean {
  return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay())
}

async function closeTopLayerDialog(dialog: HTMLDialogElement) {
  if (!dialog.open) return

  if (!supportsTopLayerExit()) {
    if (dialog.hasAttribute('data-closing')) return
    dialog.setAttribute('data-closing', '')
    const animations = dialog.getAnimations({ subtree: true })
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => setTimeout(resolve, 450)),
      ])
    }
    if (!dialog.hasAttribute('data-closing')) return
    dialog.removeAttribute('data-closing')
  }

  if (dialog.open) {
    dialog.close()
  }
}

/**
 * Synchronizes React open/close state with a native top-layer <dialog> opened via showModal(),
 * resets dialog.returnValue on close, supports smooth Firefox/Safari top-layer exit transitions,
 * and provides Safari light-dismiss fallback when requested.
 */
export function useDialogModal(
  dialogRef: RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onClose: () => void,
  options: UseDialogModalOptions = {}
) {
  const { lightDismiss = true } = options
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.removeAttribute('data-closing')
      if (!dialog.open) {
        dialog.showModal()
      }
    } else if (dialog.open) {
      void closeTopLayerDialog(dialog)
    }
  }, [dialogRef, isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = (event: Event) => {
      if (event.target !== dialog) return
      dialog.removeAttribute('data-closing')
      dialog.returnValue = ''
      onCloseRef.current()
    }

    const handleCancel = (event: Event) => {
      if (event.target !== dialog) return
      if (!supportsTopLayerExit() && event.cancelable) {
        event.preventDefault()
        void closeTopLayerDialog(dialog)
      }
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
    }
  }, [dialogRef])

  useEffect(() => {
    if (!lightDismiss) return
    if (typeof HTMLDialogElement === 'undefined' || 'closedBy' in HTMLDialogElement.prototype) {
      return
    }

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
        void closeTopLayerDialog(dialog)
      }
      pressedOutside = false
    }

    dialog.addEventListener('pointerdown', handlePointerDown)
    dialog.addEventListener('pointerup', handlePointerUp)
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown)
      dialog.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dialogRef, lightDismiss])
}
