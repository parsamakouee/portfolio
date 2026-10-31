import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { seed } from './seed.js'

export const DATA_DIR = join(import.meta.dirname, '..', 'data')
export const UPLOAD_DIR = join(DATA_DIR, 'uploads')
mkdirSync(UPLOAD_DIR, { recursive: true })

const db = new DatabaseSync(join(DATA_DIR, 'portfolio.db'))
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

// Insert any missing seed sections without touching ones already edited.
const insert = db.prepare('INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)')
for (const [key, value] of Object.entries(seed)) insert.run(key, JSON.stringify(value))

export const CONTENT_KEYS = Object.keys(seed)

export function getAllContent() {
  const out = {}
  for (const row of db.prepare('SELECT key, value FROM content').all()) out[row.key] = JSON.parse(row.value)
  return out
}

export function setContent(key, value) {
  db.prepare(
    `INSERT INTO content (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).run(key, JSON.stringify(value))
}

export const messages = {
  create: ({ name, email, subject, body }) =>
    db.prepare('INSERT INTO messages (name, email, subject, body) VALUES (?, ?, ?, ?)').run(name, email, subject, body),
  list: () => db.prepare('SELECT * FROM messages ORDER BY created_at DESC, id DESC').all(),
  markRead: (id, isRead) => db.prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(isRead ? 1 : 0, id),
  remove: (id) => db.prepare('DELETE FROM messages WHERE id = ?').run(id),
}
