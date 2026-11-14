import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Unknown-route page (QA 2026-11-14): the router previously rendered Home
// for every unmatched URL, which hid broken links and confused indexing.
// Native layout glue only, mirroring Product's "Piece not found" state.
export default function NotFound() {
  useEffect(() => { document.title = 'Page not found — VESTIGE' }, [])
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display uppercase text-5xl sm:text-6xl mb-4">Nothing remains here</h1>
      <p className="text-sand mb-8">That page was claimed, moved, or never existed.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary">Shop the drop</Link>
        <Link to="/" className="btn-ghost">Back home</Link>
      </div>
    </main>
  )
}
