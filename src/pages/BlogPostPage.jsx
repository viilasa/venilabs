import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BlogSubnav } from '../components/BlogSubnav'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import { usePageMeta } from '../hooks/usePageMeta'
import { getBlogBySlug, getRelatedPosts } from '../lib/blogs'
import { SITE_URL } from '../lib/seo'

const MAX_CRUMB = 52

function truncateCrumb(title) {
  if (title.length <= MAX_CRUMB) return title
  return `${title.slice(0, MAX_CRUMB - 1)}\u2026`
}

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getBlogBySlug(slug)
  const relatedPosts = post ? getRelatedPosts(post.slug, 3) : []

  usePageMeta({
    title: post ? `${post.title} | Venilabs Blog` : 'Blog Not Found | Venilabs',
    description: post?.description ?? 'The requested blog post does not exist.',
    path: `/blogs/${slug}`,
    type: 'article',
  })

  useEffect(() => {
    const prior = document.getElementById('blog-article-jsonld')
    prior?.remove()
    if (!post) return

    const el = document.createElement('script')
    el.id = 'blog-article-jsonld'
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Person', name: post.author },
      publisher: { '@id': 'https://venilabs.com/#org' },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blogs/${post.slug}`,
      },
    })
    document.head.appendChild(el)
    return () => {
      el.remove()
    }
  }, [post])

  if (!post) {
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
          backTo="/blogs"
          backLabel="Back to blogs"
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Blogs', to: '/blogs' },
            { label: 'Not found' },
          ]}
        />

        <main className="section blog-article-main">
          <h1>Blog not found</h1>
          <p>The article you are looking for does not exist.</p>
          <Link className="btn btn-solid" to="/blogs">
            Go to Blogs
          </Link>
        </main>

        <SiteFooter />
      </div>
    )
  }

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
        backTo="/blogs"
        backLabel="Back to blogs"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Blogs', to: '/blogs' },
          { label: truncateCrumb(post.title), title: post.title },
        ]}
      />

      <main className="section article blog-article-main">
        <p className="eyebrow">{post.date}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </main>

      {relatedPosts.length > 0 ? (
        <section
          className="section blog-related"
          aria-labelledby="related-articles-heading"
        >
          <h2 id="related-articles-heading" className="related-articles-heading">
            Related articles
          </h2>
          <div className="grid related-articles-grid">
            {relatedPosts.map((rp) => (
              <Link
                className="card blog-card"
                key={rp.slug}
                to={`/blogs/${rp.slug}`}
              >
                <article>
                  <p className="eyebrow">{rp.date}</p>
                  <h3>{rp.title}</h3>
                  <p>{rp.description}</p>
                  <p className="text-link">Read article</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </div>
  )
}
