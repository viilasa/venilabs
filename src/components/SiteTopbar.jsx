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

  useLayoutEffect(() => {
    if (!mobileOpen || !headerRef.current) return
    const h = Math.round(headerRef.current.getBoundingClientRect().height)
    document.documentElement.style.setProperty('--topbar-measured-height', `${h}px`)
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
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
            <p id={menuHeadingId} className="topbar-mobile-heading">
              Menu
            </p>
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
