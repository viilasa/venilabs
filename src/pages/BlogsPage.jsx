import { Link } from 'react-router-dom'
import { VenilabsLogoMark } from '../components/VenilabsLogoMark'
import { BlogSubnav } from '../components/BlogSubnav'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import { usePageMeta } from '../hooks/usePageMeta'
import { blogs } from '../lib/blogs'

export function BlogsPage() {
  usePageMeta({
    title: 'Website Design in Goa | Venilabs Blog—Guides, SEO & Local Leads',
    description:
      'Guides on website design in Goa, pricing, mobile-first sites, local SEO, and hospitality—written to help small businesses get found and convert more enquiries.',
    path: '/blogs',
    variant: 'blog',
  })

  return (
    <div className="page blog-page">
      <header className="topbar">
        <div className="topbar-actions">
          <ThemeToggle />
        </div>
        <Link className="topbar-brand" to="/" aria-label="Venilabs home">
          <span className="topbar-brand-mark">
            <VenilabsLogoMark className="logo-mark" />
          </span>
          <span className="topbar-brand-word">Venilabs</span>
        </Link>
      </header>

      <BlogSubnav
        backTo="/"
        backLabel="Back to home"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Blogs' }]}
      />

      <main className="section blog-list-main">
        <h1>Blogs</h1>
        <p className="lead">Insights on websites, SEO, and conversion strategy for local brands.</p>
        <div className="grid">
          {blogs.map((post) => (
            <Link className="card blog-card" key={post.slug} to={`/blogs/${post.slug}`}>
              <article>
                <p className="eyebrow">{post.date}</p>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p className="text-link">Read article</p>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
