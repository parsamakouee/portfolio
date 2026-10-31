# Parsa Makouee — Portfolio

A personal portfolio built with **Vue 3 + Tailwind CSS v4**, plus a small **Node/Express + SQLite** backend and a password-protected editor at `/admin`.

Layout follows the Picto Figma template (hero → about → services → process → experience → portfolio → credentials → blog → contact). The visual style follows Apple's Human Interface Guidelines: system typography, light and dark modes that follow the device, 44 pt touch targets, WCAG-AA contrast, and support for reduced motion and reduced transparency.

## Run it

Requires Node 22.13 or newer (it uses the built-in `node:sqlite`).

```bash
npm install
npm run dev
```

- Site: http://localhost:5173
- Editor: http://localhost:5173/admin

On first start the server creates `.env` with a random `ADMIN_PASSWORD`. Open `.env` to see or change it, then restart.

## Production

```bash
npm run build
npm start
```

`npm start` serves the built site and the API together on `API_PORT` (default 3001). Put it behind HTTPS (Nginx, Caddy, or a host such as Render or Railway) and set `NODE_ENV=production` so the login cookie is marked secure.

## What you can edit in /admin

Profile (photo, intro, contact details, CV PDF, LinkedIn and GitHub), stats, about, skills, services, process steps, experience, portfolio projects (with cover images), education, certifications, and blog posts (draft or published). Messages sent through the contact form appear under **Messages**.

## Where things live

| Path | What |
| --- | --- |
| `server/` | Express API, auth, and the starting content taken from the CV (`seed.js`) |
| `data/portfolio.db` | The SQLite database. Back this file up |
| `data/uploads/` | Uploaded images and PDFs. Back this folder up too |
| `src/components/site/` | The public page sections |
| `src/admin/schema.js` | Defines every editable field. Add a field here and it appears in the editor |
| `src/style.css` | Design tokens: colors for light and dark, type, buttons, and cards |
