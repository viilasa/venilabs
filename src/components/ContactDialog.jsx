import { useCallback, useEffect, useRef } from 'react'
import { ContactForm } from './ContactForm'

function IconModalClose({ className = '' }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function ContactDialog({ open, onClose }) {
  const ref = useRef(null)

  const handleCloseComplete = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('close', handleCloseComplete)
    return () => el.removeEventListener('close', handleCloseComplete)
  }, [handleCloseComplete])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && typeof el.showModal === 'function') {
      if (!el.open) el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  function handleBackdrop(event) {
    if (event.target === ref.current) {
      ref.current?.close()
    }
  }

  return (
    <dialog
      ref={ref}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      aria-modal="true"
      onClick={handleBackdrop}
    >
      <div className="contact-dialog-shell" role="presentation" onClick={(e) => e.stopPropagation()}>
        <header className="contact-dialog-header">
          <div className="contact-dialog-intro">
            <p className="contact-dialog-kicker">Contact</p>
            <h2 id="contact-dialog-title" className="contact-dialog-title-text">
              Tell us what you need
            </h2>
            <p className="contact-dialog-sub">
              Brief details — we reply within one business day.
            </p>
          </div>
          <button
            type="button"
            className="contact-dialog-close"
            onClick={() => ref.current?.close()}
            aria-label="Close dialog"
          >
            <IconModalClose />
          </button>
        </header>
        <div className="contact-dialog-body">
          <ContactForm variant="dialog" />
        </div>
      </div>
    </dialog>
  )
}
