import { marked } from 'marked'

const blogModules = import.meta.glob('../content/blogs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function toSlug(filePath, frontmatterSlug) {
  if (frontmatterSlug) return frontmatterSlug
  return filePath.split('/').pop().replace('.md', '')
}

export const blogs = Object.entries(blogModules)
  .map(([filePath, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = toSlug(filePath, data.slug)
    return {
      slug,
      title: data.title ?? 'Untitled',
      description: data.description ?? '',
      date: data.date ?? '',
      author: data.author ?? 'Venilabs Team',
      content,
      html: marked.parse(content),
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getBlogBySlug(slug) {
  return blogs.find((item) => item.slug === slug)
}

/** Other posts from the catalogue (newest first), excluding the current slug. */
export function getRelatedPosts(slug, limit = 3) {
  return blogs.filter((item) => item.slug !== slug).slice(0, limit)
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const frontmatter = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).trim()

  const data = frontmatter.split('\n').reduce((acc, line) => {
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) return acc
    acc[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '')
    return acc
  }, {})

  return { data, content }
}
