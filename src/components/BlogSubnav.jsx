import { Link } from 'react-router-dom'
import { IconArrowLeft } from './IconArrowLeft'

/**
 * Back link + breadcrumb strip for blog routes.
 * @param {{ backTo: string, backLabel: string, crumbs: { label: string, to?: string }[] }} props
 */
export function BlogSubnav({ backTo, backLabel, crumbs }) {
  return (
    <div className="blog-chrome">
      <Link className="blog-back" to={backTo}>
        <span className="blog-back-icon-wrap" aria-hidden>
          <IconArrowLeft />
        </span>
        <span className="blog-back-label">{backLabel}</span>
      </Link>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {crumbs.flatMap((c, i) => {
            const isLast = i === crumbs.length - 1
            const nodes = []

            if (i > 0) {
              nodes.push(
                <li key={`sep-${i}`} className="breadcrumb-sep-item" aria-hidden>
                  <span className="breadcrumb-sep">/</span>
                </li>,
              )
            }

            nodes.push(
              <li key={`crumb-${i}`} className="breadcrumb-item">
                {c.to && !isLast ? (
                  <Link to={c.to}>{c.label}</Link>
                ) : (
                  <span
                    className={isLast ? 'breadcrumb-current' : undefined}
                    title={c.title ?? (isLast ? c.label : undefined)}
                  >
                    {c.label}
                  </span>
                )}
              </li>,
            )

            return nodes
          })}
        </ol>
      </nav>
    </div>
  )
}
