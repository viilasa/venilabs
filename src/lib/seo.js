/** Canonical site URL — override in `.env` for staging (e.g. Vercel preview). */
export const SITE_URL =
  typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL.trim()
    ? import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '')
    : 'https://venilabs.viilasa.com'

/** JSON-LD `@id` for the organization (matches `index.html`). */
export const ORG_JSONLD_ID = `${SITE_URL}/#org`

/** Shared Open Graph / Twitter image (place file in `/public`). */
export const OG_IMAGE_PATH = '/og-share.png'
