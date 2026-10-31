import express from 'express'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomBytes } from 'node:crypto'
import { checkPassword, clearSession, isAuthed, issueSession, rateLimit, requireAuth } from './auth.js'
import { CONTENT_KEYS, UPLOAD_DIR, getAllContent, messages, setContent } from './db.js'

const app = express()
app.set('trust proxy', 'loopback')
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

// ---------- Auth ----------
app.post('/api/login', rateLimit('login', 8, 15 * 60 * 1000), (req, res) => {
  if (!checkPassword(req.body?.password)) return res.status(401).json({ error: 'That password isn’t right.' })
  issueSession(res)
  res.json({ ok: true })
})
app.post('/api/logout', (req, res) => {
  clearSession(res)
  res.json({ ok: true })
})
app.get('/api/me', (req, res) => res.json({ authed: isAuthed(req) }))

// ---------- Content ----------
app.get('/api/content', (req, res) => res.json(getAllContent()))

app.put('/api/content/:key', requireAuth, (req, res) => {
  const { key } = req.params
  if (!CONTENT_KEYS.includes(key)) return res.status(404).json({ error: `Unknown section “${key}”.` })
  if (req.body?.value === undefined) return res.status(400).json({ error: 'Missing value.' })
  setContent(key, req.body.value)
  res.json({ ok: true })
})

// ---------- Uploads ----------
const IMAGE_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif' }
const FILE_TYPES = { ...IMAGE_TYPES, 'application/pdf': '.pdf' }
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${randomBytes(4).toString('hex')}${FILE_TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, Boolean(FILE_TYPES[file.mimetype])),
})
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose a JPG, PNG, WebP, GIF, AVIF or PDF file under 10 MB.' })
  res.json({ url: `/uploads/${req.file.filename}` })
})
app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '30d',
  setHeaders: (res, path) => {
    if (extname(path) === '.pdf') res.setHeader('Content-Disposition', 'inline')
    res.setHeader('X-Content-Type-Options', 'nosniff')
  },
}))

// ---------- Contact messages ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
app.post('/api/messages', rateLimit('contact', 5, 60 * 60 * 1000), (req, res) => {
  const { name = '', email = '', subject = '', body = '', website = '' } = req.body ?? {}
  if (website) return res.json({ ok: true }) // honeypot field: bots fill it, people never see it
  const clean = (s, max) => String(s).trim().slice(0, max)
  const msg = { name: clean(name, 120), email: clean(email, 200), subject: clean(subject, 200), body: clean(body, 5000) }
  if (!msg.name || !msg.body) return res.status(400).json({ error: 'Add your name and a message.' })
  if (!EMAIL_RE.test(msg.email)) return res.status(400).json({ error: 'Enter an email address I can reply to.' })
  messages.create(msg)
  res.json({ ok: true })
})
app.get('/api/messages', requireAuth, (req, res) => res.json(messages.list()))
app.patch('/api/messages/:id', requireAuth, (req, res) => {
  messages.markRead(Number(req.params.id), Boolean(req.body?.is_read))
  res.json({ ok: true })
})
app.delete('/api/messages/:id', requireAuth, (req, res) => {
  messages.remove(Number(req.params.id))
  res.json({ ok: true })
})

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

// ---------- Built frontend (production) ----------
const DIST = join(import.meta.dirname, '..', 'dist')
if (existsSync(DIST)) {
  app.use(express.static(DIST, { index: false, maxAge: '1h' }))
  app.get('*', (req, res) => res.sendFile(join(DIST, 'index.html')))
}

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'That file is over 10 MB.' : 'Something went wrong on the server.' })
})

const PORT = Number(process.env.API_PORT) || 3001
app.listen(PORT, () => console.log(`  API ready on http://localhost:${PORT}`))
