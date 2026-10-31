# Parsa Makouee — Portfolio

**Live site: https://parsamakouee.github.io/portfolio/**

A personal portfolio built with **Vue 3 + Tailwind CSS v4** and hosted for free on **GitHub Pages**. The layout follows the Picto Figma template, and the styling follows Apple's Human Interface Guidelines: system typography, automatic light and dark modes, 44 pt touch targets, WCAG-AA contrast, and support for reduced motion.

## Editing the site

All of the text lives in one file: **[`content.json`](content.json)**.

1. Open `content.json` on GitHub and click the ✏️ pencil icon.
2. Change the text you want, keeping the quotes and commas as they are.
3. Click **Commit changes**.

GitHub rebuilds and republishes the site in about a minute. You can follow the progress in the **Actions** tab.

### Adding your photo or CV

1. Open the [`public/images`](public/images) folder on GitHub and choose **Add file → Upload files**.
2. Upload, for example, `parsa.jpg` and `Parsa-Makouee-CV.pdf`.
3. In `content.json`, set `"photo": "images/parsa.jpg"` and `"cvUrl": "images/Parsa-Makouee-CV.pdf"`. A **Download CV** button appears once `cvUrl` is set.

### Writing a blog post

Add an entry to the `"posts"` list in `content.json`:

```json
{
  "title": "Migrating a clinic network with zero downtime",
  "slug": "clinic-network-migration",
  "date": "2026-11-15",
  "excerpt": "One-sentence summary shown on the card.",
  "body": "First paragraph.\n\nSecond paragraph.",
  "cover": "images/clinic.jpg",
  "published": true
}
```

The Blog section appears once at least one post has `"published": true`. Each post lives at `/portfolio/blog/<slug>`.

## Working on it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/portfolio/.

## Notes

- The contact form opens the visitor's email app with the message filled in, because GitHub Pages can't run a server to receive messages.
- The earlier version, with an Express + SQLite backend and an `/admin` editor, is preserved in git history at commit `1172808`.
