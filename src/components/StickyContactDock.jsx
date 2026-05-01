import { Link } from 'react-router-dom'
import { WHATSAPP_CHAT_URL } from '../lib/siteLinks'

/** Fixed bottom shortcuts: WhatsApp + Contact (#contact). Desktop shows Contact only (bottom-right). */
export function StickyContactDock() {
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
      <Link to="/#contact" className="sticky-contact-btn sticky-contact-btn-contact" aria-label="Go to contact form">
        Contact
      </Link>
    </nav>
  )
}
