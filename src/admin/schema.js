import { serviceIcons } from '../lib/icons.js'

// Describes every editable section. The admin UI is generated from this.
// Field types: text, textarea, email, url, image, file, toggle, select, lines (one item per line), date
export const sections = [
  {
    key: 'profile', label: 'Profile', icon: 'user', kind: 'object',
    hint: 'Your name, intro, photo and contact details.',
    fields: [
      { name: 'photo', label: 'Profile photo', type: 'image' },
      { name: 'name', label: 'Full name', type: 'text' },
      { name: 'credential', label: 'Credential after your name', type: 'text', placeholder: 'M.Sc.' },
      { name: 'role', label: 'Role / title', type: 'text' },
      { name: 'intro', label: 'Intro paragraph', type: 'textarea', rows: 4 },
      { name: 'available', label: 'Show availability badge', type: 'toggle' },
      { name: 'availabilityText', label: 'Availability text', type: 'text' },
      { name: 'location', label: 'Location', type: 'text', help: 'City and country only — avoid street addresses on a public site.' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'emailAlt', label: 'Alternate email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'cvUrl', label: 'CV (PDF)', type: 'file', help: 'Adds a “Download CV” button to the top of the page.' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
    ],
  },
  {
    key: 'stats', label: 'Stats', icon: 'gauge', kind: 'list',
    hint: 'The three numbers under your intro. Three fit best.',
    title: (i) => i.value ? `${i.value} — ${i.label}` : 'New stat',
    blank: { value: '', label: '' },
    fields: [
      { name: 'value', label: 'Value', type: 'text', placeholder: '9+' },
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Years in IT' },
    ],
  },
  {
    key: 'about', label: 'About', icon: 'doc', kind: 'object',
    fields: [
      { name: 'title', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Story', type: 'textarea', rows: 8, help: 'Leave a blank line between paragraphs.' },
      { name: 'highlights', label: 'Highlights', type: 'lines', help: 'One per line.' },
    ],
  },
  {
    key: 'skills', label: 'Skills', icon: 'layers', kind: 'list',
    title: (i) => i.group || 'New skill group',
    blank: { group: '', items: [] },
    fields: [
      { name: 'group', label: 'Group name', type: 'text' },
      { name: 'items', label: 'Skills', type: 'lines', help: 'One per line.' },
    ],
  },
  {
    key: 'services', label: 'Services', icon: 'briefcase', kind: 'list',
    title: (i) => i.title || 'New service',
    blank: { icon: 'server', title: '', description: '' },
    fields: [
      { name: 'icon', label: 'Icon', type: 'icon', options: serviceIcons },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    ],
  },
  {
    key: 'process', label: 'Process', icon: 'list', kind: 'list',
    hint: 'Shown as numbered steps, in this order.',
    title: (i) => i.title || 'New step',
    blank: { title: '', description: '' },
    fields: [
      { name: 'title', label: 'Step name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    ],
  },
  {
    key: 'experience', label: 'Experience', icon: 'briefcase', kind: 'list',
    hint: 'Most recent first.',
    title: (i) => [i.role, i.company].filter(Boolean).join(' · ') || 'New position',
    blank: { company: '', role: '', period: '', url: '', points: [] },
    fields: [
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'period', label: 'Period', type: 'text', placeholder: '2021 — Present' },
      { name: 'url', label: 'Company website', type: 'url' },
      { name: 'points', label: 'What you did', type: 'lines', help: 'One bullet per line.' },
    ],
  },
  {
    key: 'projects', label: 'Portfolio', icon: 'image', kind: 'list',
    hint: 'Categories become the filter buttons above the grid.',
    title: (i) => i.title || 'New project',
    blank: { title: '', category: '', client: '', summary: '', tags: [], image: '', url: '' },
    fields: [
      { name: 'image', label: 'Cover image', type: 'image' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'Infrastructure' },
      { name: 'client', label: 'Client / context', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { name: 'tags', label: 'Tags', type: 'lines', help: 'One per line.' },
      { name: 'url', label: 'Link', type: 'url' },
    ],
  },
  {
    key: 'education', label: 'Education', icon: 'cap', kind: 'list',
    title: (i) => i.degree || 'New degree',
    blank: { degree: '', school: '', year: '', details: '' },
    fields: [
      { name: 'degree', label: 'Degree', type: 'text' },
      { name: 'school', label: 'School', type: 'text' },
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'details', label: 'Details', type: 'textarea', rows: 2 },
    ],
  },
  {
    key: 'credentials', label: 'Certifications', icon: 'award', kind: 'list',
    hint: 'Certifications, language tests, publications and awards.',
    title: (i) => i.title || 'New item',
    blank: { title: '', issuer: '', date: '', detail: '' },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'issuer', label: 'Issuer / venue', type: 'text' },
      { name: 'date', label: 'Date', type: 'text' },
      { name: 'detail', label: 'Detail', type: 'textarea', rows: 2 },
    ],
  },
  {
    key: 'posts', label: 'Blog', icon: 'pen', kind: 'list',
    hint: 'The Blog section appears on the site once at least one post is published.',
    title: (i) => (i.title || 'Untitled post') + (i.published ? '' : ' (draft)'),
    blank: () => ({ title: '', slug: '', date: new Date().toISOString().slice(0, 10), excerpt: '', body: '', cover: '', published: false }),
    fields: [
      { name: 'published', label: 'Published', type: 'toggle' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title', help: 'The post lives at /blog/your-slug.' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'cover', label: 'Cover image', type: 'image' },
      { name: 'excerpt', label: 'Short summary', type: 'textarea', rows: 2 },
      { name: 'body', label: 'Post', type: 'textarea', rows: 14, help: 'Leave a blank line between paragraphs.' },
    ],
  },
]
