// ─── Commerce adapter (mock) ────────────────────────────────────────────────
// All checkout/payment traffic goes through this interface. To go live:
//  • Stripe: implement createCheckoutSession() with a server endpoint that
//    creates a Stripe Checkout Session from `items` and return its URL/id;
//    placeOrder() then confirms via the Stripe webhook/session status.
//  • Shopify: implement the same two methods with Storefront API
//    checkoutCreate / checkoutCompleteWithCreditCardV2 (or Cart API permalinks).
// The UI never talks to a payment provider directly — swap only this file.
import type { CartItem } from '../store/cart'

export interface ShippingDetails { name: string; email: string; address: string; city: string; postcode: string; country: string }
export interface PaymentDetails { cardName: string; cardNumber: string; expiry: string; cvc: string }
export interface CheckoutSession { id: string; subtotal: number; shipping: number; total: number }
export interface Order { id: string; email: string; total: number; items: CartItem[]; etaDays: number }

export interface CommerceAdapter {
  createCheckoutSession(items: CartItem[]): Promise<CheckoutSession>
  placeOrder(session: CheckoutSession, shipping: ShippingDetails, payment: PaymentDetails, items: CartItem[]): Promise<Order>
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const shippingFor = (subtotal: number) => (subtotal >= 200 || subtotal === 0 ? 0 : 12)

export const mockCommerce: CommerceAdapter = {
  async createCheckoutSession(items) {
    await wait(150)
    const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0)
    const shipping = shippingFor(subtotal)
    return { id: `cs_mock_${Math.random().toString(36).slice(2, 10)}`, subtotal, shipping, total: subtotal + shipping }
  },
  async placeOrder(session, shipping, _payment, items) {
    await wait(600) // simulated provider round-trip — no real card is ever charged
    return {
      id: `VST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`,
      email: shipping.email, total: session.total, items, etaDays: 4,
    }
  },
}
