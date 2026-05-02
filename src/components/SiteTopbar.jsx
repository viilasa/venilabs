import { createPortal } from 'react-dom'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { VenilabsLogoMark } from './VenilabsLogoMark'

const TOPBAR_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/blogs', label: 'Blogs' },
  { to: '/#contact', label: 'Contact' },
]

function IconCloseMenu({ className = '' }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function TopbarNavLinks({ className, itemClassName, onNavigate }) {
  return (
    <ul className={className}>
      {TOPBAR_NAV.map(({ to, label, end }) => (
        <li key={to} className={itemClassName}>
          <NavLink
            className={({ isActive }) =>
              ['topbar-link', isActive ? 'topbar-link-active' : ''].join(' ')
            }
            to={to}
            end={Boolean(end)}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export function SiteTopbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalReady, setPortalReady] = useState(false)
  const headerRef = useRef(null)
  const menuHeadingId = useId()
  const menuPanelId = useId()

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        '--topbar-measured-height',
        `${Math.round(el.getBoundingClientRect().height)}px`,
      )
    }

    syncHeight()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncHeight)
      ro.observe(el)
      window.addEventListener('orientationchange', syncHeight)
      return () => {
        ro.disconnect()
        window.removeEventListener('orientationchange', syncHeight)
        document.documentElement.style.removeProperty('--topbar-measured-height')
      }
    }

    window.addEventListener('resize', syncHeight)
    window.addEventListener('orientationchange', syncHeight)
    return () => {
      window.removeEventListener('resize', syncHeight)
      window.removeEventListener('orientationchange', syncHeight)
      document.documentElement.style.removeProperty('--topbar-measured-height')
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  useLayoutEffect(() => {
    if (!mobileOpen) return undefined

    const html = document.documentElement
    const body = document.body
    const scrollY = window.scrollY
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth)

    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyPosition = body.style.position
    const prevBodyTop = body.style.top
    const prevBodyLeft = body.style.left
    const prevBodyRight = body.style.right
    const prevBodyWidth = body.style.width
    const prevBodyPaddingRight = body.style.paddingRight

    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`
    }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    html.classList.add('topbar-menu-open')

    const syncOverlayTop = () => {
      const el = headerRef.current
      if (!el) return
      const bottom = Math.ceil(el.getBoundingClientRect().bottom)
      html.style.setProperty('--topbar-overlay-top', `${Math.max(0, bottom)}px`)
    }

    void headerRef.current?.offsetHeight
    syncOverlayTop()
    const raf = window.requestAnimationFrame(() => {
      syncOverlayTop()
    })

    window.addEventListener('resize', syncOverlayTop)
    window.addEventListener('orientationchange', syncOverlayTop)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncOverlayTop)
      window.removeEventListener('orientationchange', syncOverlayTop)
      document.removeEventListener('keydown', onKeyDown)
      html.classList.remove('topbar-menu-open')
      html.style.removeProperty('--topbar-overlay-top')
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.position = prevBodyPosition
      body.style.top = prevBodyTop
      body.style.left = prevBodyLeft
      body.style.right = prevBodyRight
      body.style.width = prevBodyWidth
      body.style.paddingRight = prevBodyPaddingRight
      window.scrollTo(0, scrollY)
    }
  }, [mobileOpen])

  const toggleMobile = () => setMobileOpen((o) => !o)
  const closeMobile = () => setMobileOpen(false)

  const mobileLayers =
    portalReady &&
    createPortal(
      <>
        <div
          className={`topbar-mobile-backdrop${mobileOpen ? ' is-visible' : ''}`}
          aria-hidden={!mobileOpen}
          onClick={closeMobile}
        />

        <div
          id={menuPanelId}
          className={`topbar-mobile-panel${mobileOpen ? ' is-open' : ''}`}
          aria-hidden={!mobileOpen}
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuHeadingId}
          {...(!mobileOpen ? { inert: true } : {})}
        >
          <nav className="topbar-mobile-inner" aria-label="Primary">
            <div className="topbar-mobile-toolbar">
              <p id={menuHeadingId} className="topbar-mobile-heading">
                Menu
              </p>
              <button
                type="button"
                className="topbar-mobile-panel-close"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <IconCloseMenu />
              </button>
            </div>
            <TopbarNavLinks
              className="topbar-links topbar-links--mobile"
              itemClassName="topbar-links-item"
              onNavigate={closeMobile}
            />
          </nav>
        </div>
      </>,
      document.body,
    )

  return (
    <>
      <header className="topbar" ref={headerRef}>
        <nav className="topbar-inner" aria-label="Site">
          <Link className="topbar-brand" to="/" onClick={closeMobile} aria-label="Venilabs home">
            <span className="topbar-brand-mark">
              <VenilabsLogoMark className="logo-mark" />
            </span>
            <span className="topbar-brand-word">Venilabs</span>
          </Link>
          <TopbarNavLinks className="topbar-links topbar-links--desktop" itemClassName="topbar-links-item" />
          <div className="topbar-trailing">
            <ThemeToggle />
            <button
              type="button"
              className="topbar-menu-btn"
              aria-expanded={mobileOpen}
              aria-controls={menuPanelId}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMobile}
            >
              <span className="topbar-menu-btn-bars" aria-hidden>
                <span className="topbar-menu-btn-line topbar-menu-btn-line--1" />
                <span className="topbar-menu-btn-line topbar-menu-btn-line--2" />
                <span className="topbar-menu-btn-line topbar-menu-btn-line--3" />
              </span>
            </button>
          </div>
        </nav>
      </header>
      {mobileLayers}
    </>
  )
}
