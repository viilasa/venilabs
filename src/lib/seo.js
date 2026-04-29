/** Canonical site URL — override in `.env` for staging (e.g. Vercel preview). */
export const SITE_URL =
  typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL.trim()
    ? import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '')
    : 'https://venilabs.com'

/** Shared Open Graph / Twitter image (place file in `/public`). */
export const OG_IMAGE_PATH = '/og-share.png'
