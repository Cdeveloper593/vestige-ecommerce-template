import { Link, useLocation, useNavigate } from 'react-router-dom'
import PillNav from '../reactbits/PillNav/PillNav'
import { useCart } from '../../store/cart'

// Global header — visual component: React Bits PillNav. Cart trigger is a native
// button (layout/state glue); navigation is intercepted for SPA routing.
export default function Header() {
  const { count, setOpen } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Checkout', href: '/checkout' },
  ]
  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-smoke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-3 py-3">
        <Link to="/" className="font-display text-2xl tracking-wide text-bone" aria-label="VESTIGE home">
          VESTIGE<span className="text-vermilion">.</span>
        </Link>
        <div className="hidden md:block">
          <PillNav
            items={items}
            activeHref={pathname}
            theme="dark"
            highlightColor="#FF4D00"
            onItemClick={(item, _i, e) => { e.preventDefault(); if (item.href) navigate(item.href) }}
          />
        </div>
        <nav className="flex md:hidden gap-4 text-xs font-semibold uppercase tracking-widest" aria-label="Primary">
          <Link to="/" className={pathname === '/' ? 'text-vermilion' : 'text-bone'}>Home</Link>
          <Link to="/shop" className={pathname === '/shop' ? 'text-vermilion' : 'text-bone'}>Shop</Link>
        </nav>
        <button type="button" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}
          className="relative border border-bone/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:border-bone">
          Cart
          <span aria-hidden className="absolute -top-2 -right-2 bg-vermilion text-white text-[10px] font-bold w-5 h-5 grid place-items-center rounded-full">{count}</span>
        </button>
      </div>
    </header>
  )
}
