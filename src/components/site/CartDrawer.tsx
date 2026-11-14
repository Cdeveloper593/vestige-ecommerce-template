import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CountUp from '../reactbits/CountUp/CountUp'
import Counter from '../reactbits/Counter/Counter'
import Magnet from '../reactbits/Magnet/Magnet'
import { LayeredStack } from '../componentry/layered-stack/layered-stack'
import { FREE_SHIPPING_THRESHOLD, useCart } from '../../store/cart'
import { money } from '../../lib/utils'

// Slide-out cart — drawer shell is layout glue (native aside + CSS transform).
// Visual components inside: React Bits Counter / CountUp / Magnet,
// Componentry Layered Stack for the empty state. The item list is a native
// <ul> (QA 2026-11-14): AnimatedList renders role="listbox"/"option", which
// cannot legally contain the quantity/remove buttons.
export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement | null
      closeRef.current?.focus()
    } else if (prevFocusRef.current) {
      // Return focus to whatever opened the drawer (QA 2026-11-14).
      prevFocusRef.current.focus()
      prevFocusRef.current = null
    }
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, setOpen])

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    // inert while closed (QA 2026-11-14): previously the off-screen,
    // aria-hidden drawer still accepted keyboard focus on all its controls.
    <div aria-hidden={!open} inert={!open} className={open ? '' : 'pointer-events-none'}>
      <div className={`scrim fixed inset-0 bg-black/70 z-50 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-label="Shopping cart"
        className={`drawer fixed top-0 right-0 z-50 h-full w-full max-w-md bg-coal border-l border-smoke flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-smoke">
          <h2 className="font-display text-2xl uppercase">Cart — {count}</h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="border border-bone/30 w-10 h-10 text-lg hover:border-bone">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <LayeredStack className="mx-auto mb-10 w-56 h-36">
                <div className="w-56 h-36 bg-smoke grid place-items-center font-display text-xl">OUTERWEAR</div>
                <div className="w-56 h-36 bg-vermilion text-ink grid place-items-center font-display text-xl">ESSENTIALS</div>
                <div className="w-56 h-36 bg-bone text-ink grid place-items-center font-display text-xl">FOOTWEAR</div>
              </LayeredStack>
              <p className="text-sand mb-6">Your cart is empty. Remains to be filled.</p>
              <Link to="/shop" onClick={() => setOpen(false)} className="btn-primary">Shop the drop</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <p className="text-xs uppercase tracking-widest text-sand" role="status">
                {remaining > 0 ? <>Add <strong className="text-bone">{money(remaining)}</strong> more for free shipping</> : 'Free shipping unlocked'}
              </p>
              <div className="h-1 bg-smoke mt-2" aria-hidden><div className="h-full bg-vermilion" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} /></div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <ul className="flex flex-col gap-3">
                {items.map((i) => (
                  <li key={`${i.product.slug}|${i.size}|${i.colour}`} className="flex gap-3 items-center bg-ink border border-smoke p-3 w-full">
                    <div className="ph w-16 aspect-[4/5] shrink-0"><img src={i.product.images[0]} alt="" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{i.product.name}</p>
                      <p className="text-xs text-sand">{i.size} · {i.colour} · {money(i.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button type="button" aria-label={`Decrease quantity of ${i.product.name}`} onClick={() => setQty(i, i.qty - 1)} className="w-8 h-8 border border-bone/30 hover:border-bone">−</button>
                        <span><span className="sr-only" role="status">Quantity {i.qty}</span><span aria-hidden="true"><Counter value={i.qty} fontSize={16} /></span></span>
                        <button type="button" aria-label={`Increase quantity of ${i.product.name}`} disabled={i.qty >= i.product.stock} onClick={() => setQty(i, Math.min(i.product.stock, i.qty + 1))} className="w-8 h-8 border border-bone/30 hover:border-bone disabled:opacity-40 disabled:pointer-events-none">+</button>
                        <button type="button" onClick={() => remove(i)} aria-label={`Remove ${i.product.name} from cart`} className="ml-auto text-xs uppercase tracking-widest text-sand hover:text-vermilion py-1">Remove</button>
                      </div>
                    </div>
                    <p className="font-bold">{money(i.product.price * i.qty)}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 border-t border-smoke">
              <p className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>$<CountUp to={subtotal} duration={0.6} separator="," /></span>
              </p>
              <p className="text-xs text-sand mt-1">Shipping calculated at checkout.</p>
              <Magnet padding={60} magnetStrength={3} className="mt-4 block">
                <Link to="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full">Checkout</Link>
              </Magnet>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
