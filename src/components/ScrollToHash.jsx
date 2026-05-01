import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * When navigating to `/…#fragment`, scrolls the matching `id` into view (e.g. `/#contact`).
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    if (!id) return
    const reduceMotion = typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }, [pathname, hash])

  return null
}
