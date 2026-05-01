import { useEffect, useRef, useState } from 'react'
import { ContactForm } from './ContactForm'

const REMINDER_DELAY_MS = 45_000
const STORAGE_DISMISSED = 'venilabs-contact-reminder-dismissed'
const CONTACT_REMINDER_ILLUSTRATION_URL =
  'https://res.cloudinary.com/ddhhlkyut/image/upload/v1777651030/contact_lbtigg.svg'

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

/**
 * Gentle full-page modal after 45s: landscape-style card with illustration slot + compact contact form.
 * Dismissal is remembered for the browser tab session (`sessionStorage`).
 */
export function ContactReminderDialog() {
  const dialogRef = useRef(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_DISMISSED) === '1') {
        return undefined
      }
    } catch {
      /* storage unavailable */
    }
    const timerId = window.setTimeout(() => setArmed(true), REMINDER_DELAY_MS)
    return () => window.clearTimeout(timerId)
  }, [])

  useEffect(() => {
    if (!armed) return
    try {
      if (sessionStorage.getItem(STORAGE_DISMISSED) === '1') return
    } catch {}
    const el = dialogRef.current
    if (el && typeof el.showModal === 'function' && !el.open) {
      el.showModal()
    }
  }, [armed])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    function markDismissed() {
      try {
        sessionStorage.setItem(STORAGE_DISMISSED, '1')
      } catch {
        /* ignore */
      }
    }
    el.addEventListener('close', markDismissed)
    return () => el.removeEventListener('close', markDismissed)
  }, [])

  function handleBackdrop(event) {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close()
    }
  }

  function handleFormSuccess() {
    try {
      sessionStorage.setItem(STORAGE_DISMISSED, '1')
    } catch {
      /* ignore */
    }
    window.setTimeout(() => dialogRef.current?.close(), 2400)
  }

  return (
    <dialog
      ref={dialogRef}
      className="contact-reminder-dialog"
      aria-label="Venilabs contact reminder"
      aria-modal="true"
      onClick={handleBackdrop}
    >
      <div className="contact-reminder-shell" role="presentation" onClick={(e) => e.stopPropagation()}>
        <div className="contact-reminder-card">
          <button
            type="button"
            className="contact-reminder-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close reminder"
          >
            <IconModalClose />
          </button>
          <aside className="contact-reminder-art">
            <div className="contact-reminder-intro">
              <p className="contact-reminder-kicker">While you&apos;re here</p>
              <h2 className="contact-reminder-title">Ready to look premium online?</h2>
            </div>
            <div className="contact-reminder-art-frame" aria-hidden>
              <figure className="contact-reminder-art-figure">
                <img
                  className="contact-reminder-art-img"
                  src={CONTACT_REMINDER_ILLUSTRATION_URL}
                  alt=""
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </aside>
          <div className="contact-reminder-panel">
            <p className="contact-reminder-mobile-encourage" id="contact-reminder-mobile-msg">
              Take a moment to fill this in—we&apos;ll reply with next steps shortly.
            </p>
            <div className="contact-reminder-form-scroll">
              <ContactForm variant="dialog" onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
