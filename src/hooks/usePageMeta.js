import { useEffect } from 'react'
import {
  DEFAULT_OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_SITE_NAME,
  SITE_URL,
} from '../lib/seo'

const DEFAULT_KEYWORDS =
  'website designer Goa, web designer Goa, freelance web designer Goa, affordable web design Goa, website design near Panjim, website design Margao, local website designer India, Venilabs, mobile-first website Goa, SEO website Goa, small business website Goa'

const BLOG_KEYWORDS =
  'website design Goa, Goa web designer, freelance web designer Goa, local SEO Goa, hospitality website Goa, Venilabs blog'

/** ISO-8601 datetime from frontmatter `YYYY-MM-DD` (India offset). */
function toArticleIsoPublish(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return undefined
  const d = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T09:00:00+05:30`
  const parsed = Date.parse(d)
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString()
  return undefined
}

const ARTICLE_OG_PROPS = ['article:published_time', 'article:modified_time', 'article:author']

function removeArticleMetaTags() {
  for (const prop of ARTICLE_OG_PROPS) {
    document.head.querySelector(`meta[property="${prop}"]`)?.remove()
  }
}

export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  /** Optional override for social previews (otherwise uses site default OG image). */
  imagePath = OG_IMAGE_PATH,
  /** Short alt text for og:image / Twitter (accessibility + some platforms). */
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  /** Meta keywords (optional). Blog routes use richer defaults when `variant` is `blog`. */
  keywords,
  /** `'blog'` sets Goa / web-design keyword set for article and listing pages. */
  variant = 'default',
  /** ISO or `YYYY-MM-DD` — for `article` Open Graph tags. */
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
}) {
  useEffect(() => {
    document.title = title

    const base = SITE_URL.replace(/\/$/, '')
    const imageUrl =
      typeof imagePath === 'string' && imagePath.startsWith('http')
        ? imagePath
        : `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`

    const ensureMeta = (name, content, attr = 'name') => {
      if (!content && content !== 0 && content !== false) return
      let node = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!node) {
        node = document.createElement('meta')
        node.setAttribute(attr, name)
        document.head.appendChild(node)
      }
      node.setAttribute('content', String(content))
    }

    ensureMeta('description', description)
    const kw =
      keywords ?? (variant === 'blog' ? BLOG_KEYWORDS : DEFAULT_KEYWORDS)
    ensureMeta('keywords', kw)
    ensureMeta('geo.region', 'IN-GA')
    ensureMeta('geo.placename', 'Goa, India')
    ensureMeta('geo.position', '15.4986;73.8287')
    ensureMeta('ICBM', '15.4986, 73.8287')

    const pageUrl = `${SITE_URL}${path === '/' ? '' : path}`

    ensureMeta('og:title', title, 'property')
    ensureMeta('og:description', description, 'property')
    ensureMeta('og:type', type, 'property')
    ensureMeta('og:url', pageUrl, 'property')
    ensureMeta('og:locale', 'en_IN', 'property')
    ensureMeta('og:site_name', OG_SITE_NAME, 'property')
    ensureMeta('og:image', imageUrl, 'property')
    ensureMeta('og:image:secure_url', imageUrl, 'property')
    ensureMeta('og:image:width', String(OG_IMAGE_WIDTH), 'property')
    ensureMeta('og:image:height', String(OG_IMAGE_HEIGHT), 'property')
    ensureMeta('og:image:alt', imageAlt, 'property')

    if (type === 'article') {
      const pub = toArticleIsoPublish(articlePublishedTime)
      const mod = toArticleIsoPublish(articleModifiedTime) ?? pub
      if (pub) ensureMeta('article:published_time', pub, 'property')
      if (mod) ensureMeta('article:modified_time', mod, 'property')
      if (articleAuthor) ensureMeta('article:author', articleAuthor, 'property')
    } else {
      removeArticleMetaTags()
    }

    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', title)
    ensureMeta('twitter:description', description)
    ensureMeta('twitter:image', imageUrl)
    ensureMeta('twitter:image:alt', imageAlt)

    ensureMeta('robots', 'index, follow, max-image-preview:large')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', pageUrl)

    let hreflang = document.head.querySelector('link[rel="alternate"][hreflang="en-IN"]')
    if (!hreflang) {
      hreflang = document.createElement('link')
      hreflang.setAttribute('rel', 'alternate')
      hreflang.setAttribute('hreflang', 'en-IN')
      document.head.appendChild(hreflang)
    }
    hreflang.setAttribute('href', pageUrl)
  }, [
    articleAuthor,
    articleModifiedTime,
    articlePublishedTime,
    description,
    imageAlt,
    imagePath,
    keywords,
    path,
    title,
    type,
    variant,
  ])
}
