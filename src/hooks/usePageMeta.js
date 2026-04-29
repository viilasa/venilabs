import { useEffect } from 'react'
import { OG_IMAGE_PATH, SITE_URL } from '../lib/seo'

export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  /** Optional override for social previews (otherwise uses site default OG image). */
  imagePath = OG_IMAGE_PATH,
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
    ensureMeta(
      'keywords',
      'affordable website designer Goa, freelance web designer Goa, website design India, Venilabs, mobile-first websites, Goa business website, SEO website Goa',
    )
    ensureMeta('geo.region', 'IN-GA')
    ensureMeta('geo.placename', 'Goa, India')

    ensureMeta('og:title', title, 'property')
    ensureMeta('og:description', description, 'property')
    ensureMeta('og:type', type, 'property')
    ensureMeta('og:url', `${SITE_URL}${path === '/' ? '' : path}`, 'property')
    ensureMeta('og:locale', 'en_IN', 'property')
    ensureMeta('og:image', imageUrl, 'property')

    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', title)
    ensureMeta('twitter:description', description)
    ensureMeta('twitter:image', imageUrl)

    ensureMeta('robots', 'index, follow, max-image-preview:large')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${SITE_URL}${path === '/' ? '' : path}`)
  }, [description, imagePath, path, title, type])
}
