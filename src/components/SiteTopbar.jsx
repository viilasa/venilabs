import { Link, NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { VenilabsLogoMark } from './VenilabsLogoMark'

const TOPBAR_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/blogs', label: 'Blogs' },
  { to: '/#contact', label: 'Contact' },
]

export function SiteTopbar() {
  return (
    <header className="topbar">
      <nav className="topbar-inner" aria-label="Site">
        <Link className="topbar-brand" to="/" aria-label="Venilabs home">
          <span className="topbar-brand-mark">
            <VenilabsLogoMark className="logo-mark" />
          </span>
          <span className="topbar-brand-word">Venilabs</span>
        </Link>
        <ul className="topbar-links">
          {TOPBAR_NAV.map(({ to, label, end }) => (
            <li key={to} className="topbar-links-item">
              <NavLink
                className={({ isActive }) =>
                  ['topbar-link', isActive ? 'topbar-link-active' : ''].join(' ')
                }
                to={to}
                end={Boolean(end)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="topbar-trailing">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
