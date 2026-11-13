import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Stack from '../components/reactbits/Stack/Stack'
import BorderGlow from '../components/reactbits/BorderGlow/BorderGlow'
import Counter from '../components/reactbits/Counter/Counter'
import Magnet from '../components/reactbits/Magnet/Magnet'
import ClickSpark from '../components/reactbits/ClickSpark/ClickSpark'
import ShinyText from '../components/reactbits/ShinyText/ShinyText'
import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal'
import SpotlightCard from '../components/reactbits/SpotlightCard/SpotlightCard'
import TiltedCard from '../components/reactbits/TiltedCard/TiltedCard'
import { KineticTextReveal } from '../components/componentry/kinetic-text-reveal/kinetic-text-reveal'
import ProductCard from '../components/site/ProductCard'
import { bySlug, related } from '../data/products'
import { money } from '../lib/utils'
import { useCart } from '../store/cart'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = bySlug(slug)
  const { add } = useCart()
  const [size, setSize] = useState<string>('')
  const [colour, setColour] = useState<string>('')
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (product) { setSize(product.sizes[Math.min(2, product.sizes.length - 1)]); setColour(product.colours[0].name); setQty(1); setActive(0); setAdded(false) }
    window.scrollTo({ top: 0 })
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const rel = useMemo(() => (product ? related(product) : []), [product])

  if (!product) return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl uppercase mb-4">Piece not found</h1>
      <p className="text-sand mb-8">That remnant has already been claimed.</p>
      <Link to="/shop" className="btn-primary">Back to shop</Link>
    </main>
  )

  const rotated = [...product.images.slice(active), ...product.images.slice(0, active)]
  const gallery = rotated.map((src, i) => (
    <div key={src + i} className="ph w-full h-full"><img src={src} alt={`${product.name} — view ${i + 1}`} width={900} height={1125} draggable={false} /></div>
  ))

  const onAdd = () => {
    if (!size || !colour) { setError('Choose a size and colour first.'); return }
    setError('')
    add(product, size, colour, qty)
    setAdded(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-sand mb-8">
        <Link to="/" className="hover:text-bone">Home</Link> / <Link to="/shop" className="hover:text-bone">Shop</Link> /{' '}
        <Link to={`/shop?category=${product.category}`} className="hover:text-bone">{product.category}</Link> / <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Gallery — React Bits Stack (swipe/click to send to back) + native thumbnails */}
        <div>
          <div className="relative aspect-[4/5] max-h-[640px]" aria-label={`${product.name} image gallery — activate a card to bring the next view forward`}>
            <Stack key={`${product.slug}-${active}`} cards={gallery} sendToBackOnClick className="w-full h-full" />
          </div>
          <div className="flex gap-3 mt-4" role="group" aria-label="Choose product image">
            {product.images.map((src, i) => (
              <button key={src} type="button" onClick={() => setActive(i)} aria-pressed={active === i} aria-label={`View image ${i + 1}`}
                className={`ph w-20 aspect-[4/5] border-2 ${active === i ? 'border-vermilion' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={src} alt="" width={160} height={200} loading="lazy" />
              </button>
            ))}
          </div>
          <p className="text-xs text-sand mt-3">Tip: tap the stack to cycle views, or pick a thumbnail.</p>
        </div>

        {/* Buy column — price and CTA always visible, never behind animation */}
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow mb-3">{product.category}{product.badge ? ` — ${product.badge}` : ''}</p>
          <h1 className="font-display uppercase leading-[0.95] text-5xl sm:text-6xl">
            <KineticTextReveal text={product.name.toUpperCase()} splitBy="words" blur />
          </h1>
          <p className="mt-3 text-sm" aria-label={`Rated ${product.rating} out of 5 from ${product.reviewCount} reviews`}>
            <span className="text-vermilion" aria-hidden>{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-sand"> {product.rating} · {product.reviewCount} reviews</span>
            <span className={product.stock <= 12 ? 'text-vermilion font-semibold ml-3' : 'text-sand ml-3'}>{product.stock <= 12 ? `Only ${product.stock} left` : 'In stock'}</span>
          </p>
          <p className="mt-5 text-4xl font-bold">
            <ShinyText text={money(product.price)} color="#EDE8E0" shineColor="#FF4D00" />
            {product.compareAt && <s className="text-sand text-xl font-normal ml-3">{money(product.compareAt)}</s>}
          </p>

          <fieldset className="mt-8">
            <legend className="text-xs font-semibold uppercase tracking-widest mb-3">Size — <span className="text-vermilion">{size}</span></legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <span key={s} className="inline-block">
                  {size === s ? (
                    <BorderGlow glowColor="16 100 55" colors={['#FF4D00', '#EDE8E0']} borderRadius={0} animated>
                      <button type="button" aria-pressed onClick={() => setSize(s)} className="min-w-12 px-3 py-3 bg-vermilion text-white font-semibold">{s}</button>
                    </BorderGlow>
                  ) : (
                    <button type="button" aria-pressed={false} onClick={() => setSize(s)} className="min-w-12 px-3 py-3 border border-smoke font-semibold hover:border-bone">{s}</button>
                  )}
                </span>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-widest mb-3">Colour — <span className="text-vermilion">{colour}</span></legend>
            <div className="flex gap-3">
              {product.colours.map((c) => (
                <button key={c.name} type="button" onClick={() => setColour(c.name)} aria-pressed={colour === c.name} aria-label={`Colour ${c.name}`}
                  className={`w-10 h-10 rounded-full border-2 ${colour === c.name ? 'border-vermilion scale-110' : 'border-smoke'}`} style={{ background: c.hex }} />
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2" aria-label="Quantity selector">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 border border-bone/30 hover:border-bone">−</button>
              <span aria-label={`Quantity ${qty}`}><Counter value={qty} fontSize={20} /></span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-11 h-11 border border-bone/30 hover:border-bone">+</button>
            </div>
            <div className="flex-1">
              <ClickSpark sparkColor="#FF4D00" sparkCount={10} duration={450}>
                <Magnet padding={50} magnetStrength={3} className="block">
                  <button type="button" onClick={onAdd} className="btn-primary w-full" aria-live="polite">
                    {added ? 'Added — cart open' : `Add to cart — ${money(product.price * qty)}`}
                  </button>
                </Magnet>
              </ClickSpark>
            </div>
          </div>
          {error && <p role="alert" className="text-vermilion text-sm mt-3">{error}</p>}
          <p className="text-xs text-sand mt-4">Free shipping over $200 · 30-day returns · Ships in 24h from the studio.</p>

          <div className="mt-10">
            <h2 className="font-display uppercase text-2xl mb-3">The story</h2>
            <ScrollReveal baseOpacity={0.15} enableBlur blurStrength={2} textClassName="text-sand leading-relaxed">{product.description}</ScrollReveal>
            <ul className="mt-5 space-y-2 text-sm text-sand list-none">
              {product.details.map((d) => <li key={d} className="border-l-2 border-vermilion pl-3">{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24" aria-labelledby="reviews-h">
        <h2 id="reviews-h" className="font-display uppercase text-4xl sm:text-5xl mb-8">Reviews — {product.reviewCount}</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {product.reviews.map((r) => (
            <SpotlightCard key={r.title + r.author} theme="dark" spotlightColor="rgba(255,77,0,0.2)" className="bg-coal border border-smoke p-6">
              <p className="text-vermilion" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              <h3 className="font-semibold mt-2">{r.title}</h3>
              <p className="text-sand text-sm mt-2 leading-relaxed">{r.body}</p>
              <p className="text-xs uppercase tracking-widest text-sand mt-4">{r.author} · {r.date} · Verified</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-24" aria-labelledby="related-h">
        <h2 id="related-h" className="font-display uppercase text-4xl sm:text-5xl mb-8">Complete the remains</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rel.slice(0, 3).map((p) => <ProductCard key={p.slug} product={p} />)}
          <TiltedCard imageSrc={rel[3]?.images[0]} altText={rel[3]?.name} captionText={`${rel[3]?.name} — ${rel[3] ? money(rel[3].price) : ''}`}
            containerHeight="100%" imageHeight="100%" showTooltip={false} rotateAmplitude={8}
            overlayContent={<Link to={`/product/${rel[3]?.slug}`} className="absolute inset-0 grid place-items-end p-4 bg-gradient-to-t from-black/70 to-transparent"><span className="font-semibold text-left w-full">{rel[3]?.name}<br /><span className="text-vermilion">{rel[3] ? money(rel[3].price) : ''}</span></span></Link>}
            displayOverlayContent />
        </div>
      </section>
    </main>
  )
}
