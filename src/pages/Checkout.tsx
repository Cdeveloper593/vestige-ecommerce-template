import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Stepper, { Step } from '../components/reactbits/Stepper/Stepper'
import BlurText from '../components/reactbits/BlurText/BlurText'
import SpotlightCard from '../components/reactbits/SpotlightCard/SpotlightCard'
import FadeContent from '../components/reactbits/FadeContent/FadeContent'
import { useCart } from '../store/cart'
import { mockCommerce, shippingFor, type CheckoutSession, type Order, type PaymentDetails, type ShippingDetails } from '../lib/commerce'
import { money } from '../lib/utils'

const emptyShip: ShippingDetails = { name: '', email: '', address: '', city: '', postcode: '', country: 'United States' }
const emptyPay: PaymentDetails = { cardName: '', cardNumber: '', expiry: '', cvc: '' }

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const [step, setStep] = useState(1)
  const [ship, setShip] = useState(emptyShip)
  const [pay, setPay] = useState(emptyPay)
  const [errors, setErrors] = useState<string[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [placing, setPlacing] = useState(false)

  const shippingCost = shippingFor(subtotal)
  const total = subtotal + shippingCost
  // QA 2026-11-14: the summary previously rendered a locally-invented fake
  // session while placeOrder created a different one — same numbers only by
  // luck. Now there is exactly one adapter session: created from the cart,
  // rendered in the summary, and charged by placeOrder.
  const [session, setSession] = useState<CheckoutSession | null>(null)
  useEffect(() => {
    let live = true
    mockCommerce.createCheckoutSession(items).then((s) => { if (live) setSession(s) })
    return () => { live = false }
  }, [items])
  const summary = session ?? { subtotal, shipping: shippingCost, total }

  useEffect(() => { document.title = 'Checkout — VESTIGE' }, [])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [step])

  const validate = (forStep: number): string[] => {
    const e: string[] = []
    if (forStep === 1) {
      if (ship.name.trim().length < 2) e.push('Full name is required.')
      if (!/^\S+@\S+\.\S+$/.test(ship.email)) e.push('A valid email is required.')
      if (ship.address.trim().length < 5) e.push('Street address is required.')
      if (ship.city.trim().length < 2) e.push('City is required.')
      if (ship.postcode.trim().length < 3) e.push('Postcode / ZIP is required.')
    }
    if (forStep === 2) {
      if (pay.cardName.trim().length < 2) e.push('Name on card is required.')
      // QA 2026-11-14: digits only (letters previously passed), a real
      // MM/YY month, not in the past, and a numeric 3–4 digit CVC.
      const digits = pay.cardNumber.replace(/[\s-]/g, '')
      if (!/^\d{12,19}$/.test(digits)) e.push('Card number must be 12–19 digits (mock — try 4242 4242 4242 4242).')
      const m = /^(\d{2})\/(\d{2})$/.exec(pay.expiry)
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.push('Expiry must be a valid MM/YY.')
      else {
        const now = new Date()
        const expYear = 2000 + Number(m[2])
        if (expYear < now.getFullYear() || (expYear === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) e.push('That card expiry is in the past.')
      }
      if (!/^\d{3,4}$/.test(pay.cvc.trim())) e.push('CVC must be 3–4 digits.')
    }
    return e
  }

  const onStepChange = (next: number) => {
    if (next > step) {
      // Step indicators are clickable: a jump (e.g. 1 → 3) must validate every
      // step it skips, not just the current one (QA 2026-11-14 — previously a
      // jump validated only the current step and landed on Review with an
      // unvalidated payment step). Land on the first invalid step so its
      // errors sit next to the fields they belong to.
      for (let s = step; s < next; s++) {
        const e = validate(s)
        if (e.length) { setErrors(e); setStep(s); return }
      }
    }
    setErrors([])
    setStep(next)
  }

  const placeOrder = async () => {
    if (placing) return
    const e = [...validate(1), ...validate(2)]
    setErrors(e)
    if (e.length) return
    setPlacing(true)
    try {
      const s = session ?? (await mockCommerce.createCheckoutSession(items))
      const o = await mockCommerce.placeOrder(s, ship, pay, items)
      setOrder(o)
      clear()
    } catch {
      // QA 2026-11-14: a rejected adapter promise previously left the button
      // stuck on "Placing order…" forever.
      setErrors(['Something went wrong placing the order (mock adapter). Please try again.'])
    } finally {
      setPlacing(false)
    }
  }

  if (order) return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
      <FadeContent blur duration={700}>
        <p className="eyebrow mb-4">Order confirmed — mock checkout</p>
        <h1 className="font-display uppercase text-5xl sm:text-7xl leading-none">It remains<br />yours.</h1>
        <p className="mt-6 text-sand">Order <strong className="text-bone">{order.id}</strong> — confirmation sent to {order.email}.<br />
          Total charged (simulated): <strong className="text-bone">{money(order.total)}</strong> · Estimated delivery in {order.etaDays} days.</p>
        <p className="mt-3 text-xs text-sand">No real payment was taken. This flow runs through <code>src/lib/commerce.ts</code>, ready for Stripe or Shopify.</p>
        <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </FadeContent>
    </main>
  )

  if (items.length === 0) return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
      <h1 className="font-display uppercase text-5xl mb-4">Nothing to check out</h1>
      <p className="text-sand mb-8">Your cart is empty.</p>
      <Link to="/shop" className="btn-primary">Shop the drop</Link>
    </main>
  )

  const field = (label: string, node: React.ReactNode, id: string) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2">{label}</label>
      {node}
    </div>
  )

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* BlurText renders a <p>, so the page's real h1 is this sr-only one (QA 2026-11-14). */}
      <h1 className="sr-only">Checkout</h1>
      <BlurText text="CHECKOUT" className="font-display uppercase text-5xl sm:text-7xl mb-10" />
      <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        <div>
          {errors.length > 0 && (
            <div role="alert" className="border border-vermilion bg-vermilion/10 p-4 mb-6">
              <p className="font-semibold mb-1">A few things to fix:</p>
              <ul className="list-disc list-inside text-sm text-sand">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
          {/* Multi-step flow — React Bits Stepper */}
          <Stepper step={step} onStepChange={onStepChange} onFinalStepCompleted={placeOrder}
            theme="dark" accentColor="#FF4D00" backButtonText="Back" nextButtonText="Continue" completeButtonText={placing ? 'Placing order…' : 'Place order'}
            nextButtonProps={placing ? { disabled: true } : undefined} className="w-full">
            <Step title="Shipping">
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {field('Full name', <input id="f-name" className="field" autoComplete="name" value={ship.name} onChange={(e) => setShip({ ...ship, name: e.target.value })} />, 'f-name')}
                {field('Email', <input id="f-email" type="email" className="field" autoComplete="email" value={ship.email} onChange={(e) => setShip({ ...ship, email: e.target.value })} />, 'f-email')}
                <div className="sm:col-span-2">{field('Street address', <input id="f-addr" className="field" autoComplete="street-address" value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} />, 'f-addr')}</div>
                {field('City', <input id="f-city" className="field" autoComplete="address-level2" value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} />, 'f-city')}
                {field('Postcode / ZIP', <input id="f-zip" className="field" autoComplete="postal-code" value={ship.postcode} onChange={(e) => setShip({ ...ship, postcode: e.target.value })} />, 'f-zip')}
                <div className="sm:col-span-2">{field('Country', (
                  <select id="f-country" className="field" value={ship.country} onChange={(e) => setShip({ ...ship, country: e.target.value })}>
                    <option>United States</option><option>United Kingdom</option><option>Canada</option><option>Germany</option><option>France</option><option>Australia</option><option>Japan</option>
                  </select>), 'f-country')}</div>
              </div>
            </Step>
            <Step title="Payment">
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="sm:col-span-2">{field('Name on card', <input id="p-name" className="field" autoComplete="cc-name" value={pay.cardName} onChange={(e) => setPay({ ...pay, cardName: e.target.value })} />, 'p-name')}</div>
                <div className="sm:col-span-2">{field('Card number (mock)', <input id="p-num" inputMode="numeric" className="field" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={pay.cardNumber} onChange={(e) => setPay({ ...pay, cardNumber: e.target.value })} />, 'p-num')}</div>
                {field('Expiry MM/YY', <input id="p-exp" className="field" placeholder="12/28" autoComplete="cc-exp" value={pay.expiry} onChange={(e) => setPay({ ...pay, expiry: e.target.value })} />, 'p-exp')}
                {field('CVC', <input id="p-cvc" inputMode="numeric" className="field" autoComplete="cc-csc" value={pay.cvc} onChange={(e) => setPay({ ...pay, cvc: e.target.value })} />, 'p-cvc')}
                <p className="sm:col-span-2 text-xs text-sand">Demo only — never enter a real card here. The payment step sits behind <code>lib/commerce.ts</code> for Stripe/Shopify.</p>
              </div>
            </Step>
            <Step title="Review">
              <div className="pt-4 space-y-4 text-sm">
                <div className="border border-smoke p-4">
                  <h3 className="font-semibold uppercase tracking-widest text-xs mb-2">Ship to</h3>
                  <p className="text-sand">{ship.name} · {ship.email}<br />{ship.address}, {ship.city} {ship.postcode}, {ship.country}</p>
                </div>
                <div className="border border-smoke p-4">
                  <h3 className="font-semibold uppercase tracking-widest text-xs mb-2">Pay with</h3>
                  <p className="text-sand">Card ending {pay.cardNumber.replace(/\s/g, '').slice(-4) || '····'} — {pay.cardName} (mock, nothing charged)</p>
                </div>
                <p className="text-sand">Placing the order generates a mock order id and clears your cart.</p>
              </div>
            </Step>
          </Stepper>
        </div>

        {/* Summary — React Bits SpotlightCard */}
        <SpotlightCard theme="dark" spotlightColor="rgba(255,77,0,0.22)" className="bg-coal border border-smoke p-6 lg:sticky lg:top-24">
          <h2 className="font-display uppercase text-2xl mb-5">Order summary</h2>
          <ul className="space-y-4">
            {items.map((i) => (
              <li key={`${i.product.slug}|${i.size}|${i.colour}`} className="flex gap-3 items-center">
                <span className="ph w-12 aspect-[4/5] shrink-0"><img src={i.product.images[0]} alt="" /></span>
                <span className="flex-1 min-w-0"><span className="block truncate font-semibold text-sm">{i.product.name}</span>
                  <span className="text-xs text-sand">{i.size} · {i.colour} · ×{i.qty}</span></span>
                <span className="font-semibold text-sm">{money(i.product.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="border-t border-smoke mt-6 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-sand">Subtotal</dt><dd>{money(summary.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-sand">Shipping</dt><dd>{summary.shipping === 0 ? 'Free' : money(summary.shipping)}</dd></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-smoke"><dt>Total</dt><dd>{money(summary.total)}</dd></div>
          </dl>
        </SpotlightCard>
      </div>
    </main>
  )
}
