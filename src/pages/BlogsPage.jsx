import { Link } from 'react-router-dom'
import { BlogSubnav } from '../components/BlogSubnav'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import { usePageMeta } from '../hooks/usePageMeta'
import { blogs } from '../lib/blogs'

export function BlogsPage() {
  usePageMeta({
    title: 'Venilabs Blogs | Website Design and SEO Insights',
    description:
      'Read practical blog posts from Venilabs on conversion-focused website design, SEO, and lead generation for local businesses.',
    path: '/blogs',
  })

  return (
    <div className="page blog-page">
      <header className="topbar">
        <Link className="logo" to="/">
          Venilabs
        </Link>
        <div className="topbar-actions">
          <ThemeToggle />
        </div>
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
