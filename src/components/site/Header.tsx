import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../store/cart'

// Global header — wordmark, burger toggle and cart trigger are native elements
// (layout/state glue). Neither Componentry nor React Bits ships a plain
// three-line burger toggle — their navs are pill/text toggles — so the toggle
// and dropdown panel are native button/nav elements styled with theme tokens,
// the same documented pattern as the cart drawer and form controls.
// (Replaced React Bits PillNav on 2026-11-13 at the user's request.)
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Checkout', href: '/checkout' },
]
const CATEGORIES = ['Outerwear', 'Tailoring', 'Essentials', 'Footwear', 'Objects']

export default function Header() {
  const { count, setOpen } = useCart()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the menu whenever the route changes.
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Escape closes the menu and returns focus to the toggle (QA 2026-11-14 —
  // previously focus was stranded inside the now-invisible panel).
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-smoke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-3 py-3">
        <Link to="/" className="font-display text-2xl tracking-wide text-bone" aria-label="VESTIGE home">
          VESTIGE<span className="text-vermilion">.</span>
        </Link>

        {/* Burger toggle — three lines that fold into an X when open */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex items-center gap-3 border border-bone/30 px-4 py-3 hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-vermilion"
        >
          <span aria-hidden className="relative block h-[14px] w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-full bg-bone transition-all duration-300 motion-reduce:transition-none ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-[6px] h-0.5 w-full bg-bone transition-opacity duration-200 motion-reduce:transition-none ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-[12px] h-0.5 w-full bg-bone transition-all duration-300 motion-reduce:transition-none ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-bone">Menu</span>
        </button>

        <button type="button" onClick={() => setOpen(true)} aria-label={`Cart ${count} items`}
          className="relative border border-bone/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:border-bone">
          Cart
          <span aria-hidden className="absolute -top-2 -right-2 bg-vermilion text-ink text-[10px] font-bold w-5 h-5 grid place-items-center rounded-full">{count}</span>
        </button>
      </div>

      {/* Dropdown menu panel */}
      <div
        id="site-menu"
        className={`absolute inset-x-0 top-full border-b border-smoke bg-ink/95 backdrop-blur transition-all duration-300 motion-reduce:transition-none ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none'}`}
      >
        <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <ul className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-10">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`group flex items-baseline gap-3 font-display uppercase leading-none text-4xl sm:text-5xl ${pathname === item.href ? 'text-vermilion' : 'text-bone hover:text-vermilion'}`}
                >
                  <span aria-hidden className="text-xs font-sans font-semibold tracking-widest text-sand">0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-smoke pt-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-sand">Shop by category</span>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to={`/shop?category=${encodeURIComponent(c)}`}
                onClick={() => setMenuOpen(false)}
                className="py-1.5 text-xs font-semibold uppercase tracking-widest text-bone/80 hover:text-vermilion"
              >
                {c}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
