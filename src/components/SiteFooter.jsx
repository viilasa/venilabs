import { Link } from 'react-router-dom'
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from '../lib/siteLinks'

export function SiteFooter() {
  return (
    <footer className="footer footer-expanded footer-band">
      <div className="footer-inner">
        <div className="footer-band-top">
          <div className="footer-band-intro">
            <p className="footer-band-eyebrow">
              Have questions, ideas, or just curious?
            </p>
            <a
              className="footer-band-email"
              href={`mailto:${CONTACT_EMAIL}`}
              title={CONTACT_EMAIL}
            >
              Email me
            </a>
          </div>
          <div className="footer-band-pills" role="navigation" aria-label="Social and blog links">
            <a
              className="footer-band-pill"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="footer-band-pill"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <Link className="footer-band-pill" to="/blogs">
              Blogs
            </Link>
          </div>
        </div>
        <span className="footer-band-mega">VENILABS</span>
      </div>
    </footer>
  )
}
