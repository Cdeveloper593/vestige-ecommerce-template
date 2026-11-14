import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Source maps for production debugging / Lighthouse (QA 2026-11-14).
  build: { sourcemap: true },
  resolve: { alias: { '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src') } },
  // allowedHosts: true is deliberate for this project's localhost.run tunnel
  // workflow (rotating tunnel hostnames). Revisit before hosting anywhere
  // less trusted (QA 2026-11-14 note).
  server: { port: 3900, host: true, allowedHosts: true },
  preview: { port: 3900, host: true, allowedHosts: true },
})
