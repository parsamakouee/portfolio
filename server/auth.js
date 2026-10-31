import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'

const ENV_PATH = join(import.meta.dirname, '..', '.env')

// First run: create .env with a random admin password and session secret.
if (!existsSync(ENV_PATH)) {
  const password = randomBytes(9).toString('base64url')
  appendFileSync(
    ENV_PATH,
    `# Admin login for /admin — change it any time, then restart the server.\nADMIN_PASSWORD=${password}\nSESSION_SECRET=${randomBytes(32).toString('hex')}\nAPI_PORT=3001\n`,
  )
  console.log('\n  Created .env with a generated admin password (open .env to see it).\n')
}
process.loadEnvFile(ENV_PATH)

const SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex')
const SALT = 'portfolio-admin'
const passwordHash = scryptSync(process.env.ADMIN_PASSWORD || '', SALT, 32)
const COOKIE = 'admin_session'
const MAX_AGE_MS = 1000 * 60 * 60 * 12

const sign = (payload) => createHmac('sha256', SECRET).update(payload).digest('base64url')

export function checkPassword(input) {
  if (!process.env.ADMIN_PASSWORD) return false
  return timingSafeEqual(scryptSync(String(input ?? ''), SALT, 32), passwordHash)
}

export function issueSession(res) {
  const exp = String(Date.now() + MAX_AGE_MS)
  res.cookie(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_MS,
  })
}

export function clearSession(res) {
  res.clearCookie(COOKIE)
}

export function isAuthed(req) {
  const [exp, sig] = String(req.cookies?.[COOKIE] ?? '').split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  const expected = Buffer.from(sign(exp))
  const given = Buffer.from(sig)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function requireAuth(req, res, next) {
  if (isAuthed(req)) return next()
  res.status(401).json({ error: 'Sign in to continue.' })
}

// Small in-memory limiter: `limit` hits per `windowMs` per IP and bucket.
const hits = new Map()
export function rateLimit(bucket, limit, windowMs) {
  return (req, res, next) => {
    const key = `${bucket}:${req.ip}`
    const now = Date.now()
    const entry = hits.get(key)
    if (!entry || entry.reset < now) hits.set(key, { count: 1, reset: now + windowMs })
    else if (++entry.count > limit) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' })
    next()
  }
}
