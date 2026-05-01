import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { VenilabsLogoMark } from './VenilabsLogoMark'

export function SiteTopbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="topbar">
      <nav className="topbar-inner" aria-label="Site">
        <div className="topbar-leading">
          <ThemeToggle />
        </div>
        <Link
          className="topbar-brand"
          to="/"
          aria-label="Venilabs home"
          aria-current={isHome ? 'page' : undefined}
        >
          <span className="topbar-brand-mark">
            <VenilabsLogoMark className="logo-mark" />
          </span>
          <span className="topbar-brand-word">Venilabs</span>
        </Link>
      </nav>
    </header>
  )
}
