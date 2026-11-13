import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products, type Product } from '../data/products'

export interface CartItem { product: Product; size: string; colour: string; qty: number }
const key = (i: Pick<CartItem, 'product' | 'size' | 'colour'>) => `${i.product.slug}|${i.size}|${i.colour}`

interface CartCtx {
  items: CartItem[]; count: number; subtotal: number; open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, size: string, colour: string, qty?: number) => void;
  setQty: (item: CartItem, qty: number) => void;
  remove: (item: CartItem) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vestige-cart') || '[]') as { slug: string; size: string; colour: string; qty: number }[]
      return saved.flatMap((s) => {
        const product = products.find((p) => p.slug === s.slug)
        return product ? [{ product, size: s.size, colour: s.colour, qty: s.qty }] : []
      })
    } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('vestige-cart', JSON.stringify(items.map((i) => ({ slug: i.product.slug, size: i.size, colour: i.colour, qty: i.qty })))) } catch { /* private mode */ }
  }, [items])

  const add: CartCtx['add'] = (product, size, colour, qty = 1) => {
    setItems((prev) => {
      const k = key({ product, size, colour })
      const found = prev.find((i) => key(i) === k)
      if (found) return prev.map((i) => (key(i) === k ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { product, size, colour, qty }]
    })
    setOpen(true)
  }
  const setQty: CartCtx['setQty'] = (item, qty) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => key(i) !== key(item)) : prev.map((i) => (key(i) === key(item) ? { ...i, qty } : i))))
  const remove: CartCtx['remove'] = (item) => setItems((prev) => prev.filter((i) => key(i) !== key(item)))
  const clear = () => setItems([])

  const value = useMemo<CartCtx>(() => ({
    items, open, setOpen, add, setQty, remove, clear,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
  }), [items, open])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside provider')
  return c
}
export const FREE_SHIPPING_THRESHOLD = 200
