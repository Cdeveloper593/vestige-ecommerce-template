import { Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useReducedMotion } from '../../lib/utils'

// WebGL plasma is below the fold on every route — code-split it (QA
// 2026-11-14 perf pass); the static band doubles as its loading fallback.
const ClosingPlasma = lazy(() => import('../componentry/closing-plasma/closing-plasma').then((m) => ({ default: m.ClosingPlasma })))

// Footer CTA band — visual component: Componentry Closing Plasma.
// Closing Plasma has no reduced-motion handling of its own (QA 2026-11-14),
// so under prefers-reduced-motion it is swapped for a static gradient band
// with identical content — the same gate the Cerium build applied.
export default function Footer() {
  const reduced = useReducedMotion()
  const band = (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
      <p className="eyebrow mb-4">The Drop List</p>
      <h2 className="font-display text-4xl sm:text-6xl uppercase leading-none">First access.<br />No noise.</h2>
      <form className="mx-auto mt-8 flex max-w-md" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; f.reset(); const m = document.getElementById('nl-msg'); if (m) m.textContent = 'You are on the list. Welcome to VESTIGE.' }} aria-label="Newsletter signup">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" type="email" required placeholder="your@email.com" className="field" />
        <button type="submit" className="btn-primary shrink-0">Join</button>
      </form>
      <p id="nl-msg" role="status" className="mt-3 text-sm text-sand" />
    </div>
  )
  return (
    <footer className="mt-24">
      {reduced ? (
        <div className="border-t border-smoke bg-[radial-gradient(120%_140%_at_50%_0%,#2b0f04_0%,#101010_60%)]">{band}</div>
      ) : (
        <Suspense fallback={<div className="border-t border-smoke bg-[radial-gradient(120%_140%_at_50%_0%,#2b0f04_0%,#101010_60%)]">{band}</div>}>
          <ClosingPlasma themeMode="dark" darkColorA="#101010" darkColorB="#2b0f04" darkColorC="#FF4D00" className="border-t border-smoke">
            {band}
          </ClosingPlasma>
        </Suspense>
      )}
      {/* pb-28 on mobile (QA 2026-11-14): Home's fixed Magnetic Dock was
          covering this bar's nav/copyright lines at the page bottom. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-28 lg:pb-10 flex flex-col sm:flex-row gap-6 justify-between text-xs uppercase tracking-widest text-sand">
        <p className="font-display text-lg text-bone normal-case tracking-wide">VESTIGE<span className="text-vermilion">.</span> <span className="text-sand text-xs uppercase tracking-widest">— wear what remains</span></p>
        <nav className="flex gap-6" aria-label="Footer">
          <Link to="/shop" className="hover:text-bone">Shop</Link>
          <Link to="/checkout" className="hover:text-bone">Checkout</Link>
          <a href="#top" className="hover:text-bone">Back to top</a>
        </nav>
        <p>Template — mock checkout, no real orders.</p>
      </div>
    </footer>
  )
}
