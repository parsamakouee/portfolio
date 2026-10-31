import { reactive } from 'vue'
import data from '../../content.json'

// All site text lives in /content.json. Edit it and push; GitHub rebuilds the site.
export const content = reactive(data)

// Files in /public are served under the site's base path (/portfolio/).
// Accepts "images/me.jpg", "/images/me.jpg" or a full https:// URL.
export const asset = (url) =>
  !url || /^(https?:|mailto:|data:)/.test(url) ? url : import.meta.env.BASE_URL + url.replace(/^\//, '')

export const publishedPosts = () =>
  (content.posts || []).filter((p) => p.published).sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const paragraphs = (text = '') => String(text).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const formatDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
