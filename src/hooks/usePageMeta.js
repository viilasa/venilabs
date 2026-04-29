import { useEffect } from 'react'

const SITE_URL = 'https://venilabs.com'

export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
}) {
  useEffect(() => {
    document.title = title

    const ensureMeta = (name, content, attr = 'name') => {
      let node = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!node) {
        node = document.createElement('meta')
        node.setAttribute(attr, name)
        document.head.appendChild(node)
      }
      node.setAttribute('content', content)
    }

    ensureMeta('description', description)
    ensureMeta('og:title', title, 'property')
    ensureMeta('og:description', description, 'property')
    ensureMeta('og:type', type, 'property')
    ensureMeta('og:url', `${SITE_URL}${path}`, 'property')
    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', title)
    ensureMeta('twitter:description', description)
    ensureMeta('robots', 'index, follow')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${SITE_URL}${path}`)
  }, [description, path, title, type])
}
