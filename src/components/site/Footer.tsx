import { Link } from 'react-router-dom'
import { ClosingPlasma } from '../componentry/closing-plasma/closing-plasma'

// Footer CTA band — visual component: Componentry Closing Plasma.
export default function Footer() {
  return (
    <footer className="mt-24">
      <ClosingPlasma themeMode="dark" darkColorA="#101010" darkColorB="#2b0f04" darkColorC="#FF4D00" className="border-t border-smoke">
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
      </ClosingPlasma>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 justify-between text-xs uppercase tracking-widest text-sand">
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
