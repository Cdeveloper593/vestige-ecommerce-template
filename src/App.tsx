import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './store/cart'
import Header from './components/site/Header'
import Footer from './components/site/Footer'
import FadeContent from './components/reactbits/FadeContent/FadeContent'
import { lazy, Suspense } from 'react'
// The drawer is code-split out of the entry chunk (QA 2026-11-14 perf
// pass); its chunk loads asynchronously alongside the first paint.
const CartDrawer = lazy(() => import('./components/site/CartDrawer'))
import Home from './pages/Home'
const Shop = lazy(() => import('./pages/Shop'))
const ProductPage = lazy(() => import('./pages/Product'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))

// App shell — routing/layout glue only. Page transition: React Bits FadeContent.
function Shell() {
  const { pathname } = useLocation()
  return (
    <div id="top" className="min-h-screen bg-ink text-bone flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-vermilion focus:text-white focus:px-4 focus:py-2">Skip to content</a>
      <Header />
      <div id="main" tabIndex={-1} className="flex-1 outline-none">
        <FadeContent key={pathname} blur duration={450}>
          <Suspense fallback={<p className="p-10 text-sand" role="status">Loading…</p>}><Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes></Suspense>
        </FadeContent>
      </div>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  )
}
