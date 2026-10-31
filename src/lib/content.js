import { reactive, ref } from 'vue'
import { api } from './api.js'

// Site content shared by the public pages and the admin editor.
export const content = reactive({})
export const loaded = ref(false)
export const loadError = ref('')

export async function loadContent() {
  try {
    Object.assign(content, await api.get('/api/content'))
    loadError.value = ''
  } catch (e) {
    loadError.value = e.message
  } finally {
    loaded.value = true
  }
}

export const publishedPosts = () =>
  (content.posts || []).filter((p) => p.published).sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const paragraphs = (text = '') => String(text).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const formatDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
