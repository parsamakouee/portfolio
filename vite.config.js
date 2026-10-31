import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'

// GitHub Pages serves 404.html for unknown paths, so a copy of index.html lets
// deep links such as /portfolio/blog/my-post load the app instead of an error.
const spaFallback = {
  name: 'spa-fallback-404',
  closeBundle: () => copyFileSync('dist/index.html', 'dist/404.html'),
}

export default defineConfig({
  // The site lives at https://parsamakouee.github.io/portfolio/
  base: '/portfolio/',
  plugins: [vue(), tailwindcss(), spaFallback],
  server: { port: 5173, strictPort: true },
})
