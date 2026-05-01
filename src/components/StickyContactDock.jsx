import { useContactDialog } from '../context/ContactDialogContext.jsx'
import { WHATSAPP_CHAT_URL } from '../lib/siteLinks'

/** Fixed bottom shortcuts: WhatsApp + Contact (same modal as homepage). Desktop shows Contact only (bottom-right). */
export function StickyContactDock() {
  const { openContact } = useContactDialog()

  return (
    <nav className="sticky-contact-dock" aria-label="Quick contact">
      <a
        href={WHATSAPP_CHAT_URL}
        className="sticky-contact-btn sticky-contact-btn-wa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        WhatsApp
      </a>
      <button
        type="button"
        className="sticky-contact-btn sticky-contact-btn-contact"
        onClick={openContact}
        aria-label="Open contact form"
      >
        Contact
      </button>
    </nav>
  )
}
