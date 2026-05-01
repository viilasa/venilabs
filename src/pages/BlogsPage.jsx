import { Link } from 'react-router-dom'
import { BlogSubnav } from '../components/BlogSubnav'
import { SiteFooter } from '../components/SiteFooter'
import { SiteTopbar } from '../components/SiteTopbar'
import { usePageMeta } from '../hooks/usePageMeta'
import { blogs } from '../lib/blogs'

export function BlogsPage() {
  usePageMeta({
    title: 'Website Design Blog Goa | Guides for Local SEO & Web Designers — Venilabs',
    description:
      'Practical guides on website design in Goa, pricing, mobile-first builds, Google visibility, and hospitality sites — written so local businesses rank better and convert more enquiries.',
    path: '/blogs',
    variant: 'blog',
  })

  return (
    <div className="page blog-page">
      <SiteTopbar />

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
