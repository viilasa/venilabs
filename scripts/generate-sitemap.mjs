/**
 * Generates public/sitemap.xml from live blog markdown so URLs always match the repo.
 * Run: node scripts/generate-sitemap.mjs  |  Invoked automatically via npm run prebuild.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blogs')
const OUT = path.join(ROOT, 'public', 'sitemap.xml')

function tryLoadRootEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  const text = fs.readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*VITE_SITE_URL\s*=\s*([^#]+)/)
    if (m) {
      process.env.VITE_SITE_URL = m[1].trim().replace(/^["']|["']$/g, '')
      return
    }
  }
}

tryLoadRootEnv()

const SITE_URL =
  (process.env.VITE_SITE_URL && String(process.env.VITE_SITE_URL).trim().replace(/\/$/, '')) ||
  'https://venilabs.viilasa.com'

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {} }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {} }
  const frontmatter = raw.slice(3, end).trim()
  const data = {}
  for (const line of frontmatter.split('\n')) {
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) continue
    data[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '')
  }
  return { data }
}

function slugFromFile(filePath, data) {
  if (data.slug) return data.slug
  return path.basename(filePath, '.md')
}

function collectPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  const posts = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data } = parseFrontmatter(raw)
    const slug = slugFromFile(file, data)
    const date = data.date || '1970-01-01'
    posts.push({ slug, date, file })
  }
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  return posts
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function main() {
  const posts = collectPosts()
  const today = new Date().toISOString().slice(0, 10)
  /** Home + /blogs: refresh on each build so deploys signal activity to crawlers. */
  const homeLastmod = today

  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- Auto-generated: all routes + ${posts.length} blog posts (Goa / en-IN). Edit scripts/generate-sitemap.mjs -->`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urlEntry(`${SITE_URL}/`, homeLastmod, 'weekly', '1.0'),
    urlEntry(`${SITE_URL}/blogs`, homeLastmod, 'weekly', '0.9'),
  ]

  for (const p of posts) {
    lines.push(
      urlEntry(
        `${SITE_URL}/blogs/${p.slug}`,
        p.date,
        'monthly',
        '0.8',
      ),
    )
  }

  lines.push(`</urlset>`, '')

  fs.writeFileSync(OUT, lines.join('\n'), 'utf8')
  console.log(`sitemap: wrote ${posts.length} blog URLs + home + /blogs → ${path.relative(ROOT, OUT)}`)
}

main()
