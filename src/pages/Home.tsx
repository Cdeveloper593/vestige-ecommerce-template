import { Link, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

// Defers mounting (and therefore chunk loading) of below-the-fold sections
// until they approach the viewport — layout glue only.
function LazyVisible({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || show) return
    if (typeof IntersectionObserver === 'undefined') { setShow(true); return }
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { setShow(true); io.disconnect() } }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [show])
  return <div ref={ref}>{show ? children : fallback}</div>
}
import { GrainGradient } from '../components/componentry/grain-gradient/grain-gradient'
import { KineticTextReveal } from '../components/componentry/kinetic-text-reveal/kinetic-text-reveal'
import { FlippingWordSwap } from '../components/componentry/flipping-word-swap/flipping-word-swap'
import { MagneticDock, DockIconHome, DockIconSearch, DockIconMail } from '../components/componentry/magnetic-dock/magnetic-dock'
import SplitText from '../components/reactbits/SplitText/SplitText'
import ScrollVelocity from '../components/reactbits/ScrollVelocity/ScrollVelocity'
import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal'
import CountUp from '../components/reactbits/CountUp/CountUp'
import Carousel from '../components/reactbits/Carousel/Carousel'
import LogoLoop from '../components/reactbits/LogoLoop/LogoLoop'
import FadeContent from '../components/reactbits/FadeContent/FadeContent'
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent'
// Below-the-fold sections are code-split (QA 2026-11-14 perf pass): they are
// heavy (Lenis scroll stack, flip stack, bento, card swap) and never needed
// for first paint. Fallbacks reserve space so the swap-in doesn't jump.
const MagicBento = lazy(() => import('../components/reactbits/MagicBento/MagicBento'))
const StickyScrollCards = lazy(() => import('../components/componentry/sticky-scroll-cards/sticky-scroll-cards').then((m) => ({ default: m.StickyScrollCards })))
const CaseStudyFlipStack = lazy(() => import('../components/componentry/case-study-flip-stack/case-study-flip-stack').then((m) => ({ default: m.CaseStudyFlipStack })))
const CardSwap = lazy(() => import('../components/reactbits/CardSwap/CardSwap'))
import ProductCard from '../components/site/ProductCard'
import { products, HERO_IMAGE } from '../data/products'
import { money, useReducedMotion } from '../lib/utils'
import { useCart } from '../store/cart'

export default function Home() {
  const navigate = useNavigate()
  const { setOpen } = useCart()
  const reduced = useReducedMotion()
  const featured = products.filter((p) => p.featured)
  // Restore the default document title (other routes set their own).
  useEffect(() => { document.title = 'VESTIGE — Wear What Remains' }, [])

  return (
    <main>
      {/* ── HERO — Componentry Grain Gradient + Kinetic Text Reveal ── */}
      <section className="relative overflow-hidden">
        {!reduced && <GrainGradient colorLight="#3a3a3a" colorMid="#171717" colorDark="#101010" grain={0.55} speed={0.7} className="absolute inset-0 w-full h-full" />}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-5">Autumn / Winter — Drop 04</p>
            <h1 className="font-display uppercase leading-[0.9] text-[17vw] sm:text-8xl xl:text-9xl">
              <KineticTextReveal text="WEAR WHAT" splitBy="words" blur />
              <span className="text-vermilion block"><KineticTextReveal text="REMAINS" splitBy="characters" blur /></span>
            </h1>
            <p className="mt-6 max-w-md text-sand text-base sm:text-lg">
              Dark editorial clothing built to outlast trends — cut in limited runs, stripped of logos, always{' '}
              <FlippingWordSwap word1="SELVEDGE DENIM." word2="RAW DENIM." className="flip-inline text-bone font-semibold" toClassName="text-vermilion font-semibold" />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Shop the drop</Link>
              <Link to="/shop?category=Outerwear" className="btn-ghost">Outerwear</Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 max-w-md gap-6 text-center sm:text-left">
              <div><dt className="sr-only">Products in drop</dt><dd className="font-display text-3xl"><CountUp to={14} /></dd><dd className="text-[10px] uppercase tracking-widest text-sand">Pieces</dd></div>
              <div><dt className="sr-only">Average rating</dt><dd className="font-display text-3xl"><CountUp to={4.8} decimals={1} /></dd><dd className="text-[10px] uppercase tracking-widest text-sand">Avg rating</dd></div>
              <div><dt className="sr-only">Reviews</dt><dd className="font-display text-3xl"><CountUp to={2841} separator="," /></dd><dd className="text-[10px] uppercase tracking-widest text-sand">Reviews</dd></div>
            </dl>
          </div>
          <FadeContent blur duration={900}>
            <div className="ph aspect-[4/5] max-h-[640px] w-full">
              <img src={HERO_IMAGE} alt="Editorial fashion look from the VESTIGE AW drop" fetchPriority="high" />
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── MARQUEE — React Bits ScrollVelocity (swap for Componentry Velocity Scroll, registry 404) ── */}
      {!reduced && (
        <div className="border-y border-smoke py-3 overflow-hidden" aria-hidden>
          <ScrollVelocity texts={['VESTIGE — WEAR WHAT REMAINS — FREE SHIPPING OVER $200 —']} velocity={60} className="font-display uppercase text-2xl text-bone/70" />
        </div>
      )}

      {/* ── FEATURED — React Bits Carousel ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SplitText text="FEATURED REMAINS" tag="h2" className="font-display uppercase text-4xl sm:text-6xl mb-3" />
        <p className="text-sand max-w-lg mb-8">The pieces the drop is built around. Prices first, always — open any piece below for its full story.</p>
        <AnimatedContent distance={40}>
          <Carousel
            items={featured.map((p) => ({ id: p.slug, image: p.images[0], alt: p.name, title: p.name, description: `${money(p.price)} — ★ ${p.rating} (${p.reviewCount})` }))}
            baseWidth={320} aspectRatio={0.85} arrows indicator="dots" theme="dark" pauseOnHover loop
            className="mx-auto"
          />
        </AnimatedContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {featured.slice(0, 3).map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
        <p className="mt-8"><Link to="/shop" className="btn-ghost">View all 14 pieces</Link></p>
      </section>

      {/* ── CATEGORIES — React Bits MagicBento ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20" aria-labelledby="cat-h">
        <h2 id="cat-h" className="font-display uppercase text-4xl sm:text-5xl mb-8">Shop by remains</h2>
        <LazyVisible fallback={<div className="min-h-[420px]" aria-hidden />}>
        <Suspense fallback={<div className="min-h-[420px]" aria-hidden />}>
          <MagicBento
            theme="dark" glowColor="255, 77, 0" columns={3}
            items={[
              { label: 'Start here', title: 'Outerwear', description: 'Leather, wool, weather armour.', onClick: () => navigate('/shop?category=Outerwear') },
              { label: 'Sharp', title: 'Tailoring', description: 'Blazers, denim, the column dress.', onClick: () => navigate('/shop?category=Tailoring') },
              { label: 'Daily', title: 'Essentials', description: 'Heavy tees and seamless knits.', onClick: () => navigate('/shop?category=Essentials') },
              { label: 'Ground', title: 'Footwear', description: 'Runners, courts, slip-ons.', onClick: () => navigate('/shop?category=Footwear') },
              { label: 'Carry', title: 'Objects', description: 'Packs and frames. Nothing extra.', onClick: () => navigate('/shop?category=Objects') },
              { label: 'All', title: 'Everything', description: 'The full drop, unfiltered.', onClick: () => navigate('/shop') },
            ]}
          />
        </Suspense>
        </LazyVisible>
      </section>

      {/* ── STORY — Componentry Sticky Scroll Cards + React Bits ScrollReveal ── */}
      <section className="border-y border-smoke bg-coal" aria-labelledby="story-h">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12">
          <div className="min-w-0 lg:sticky lg:top-[max(6rem,calc(50vh-240px))] self-start">
            <p className="eyebrow mb-4">The Vestige Method</p>
            <h2 id="story-h" className="font-display uppercase text-4xl sm:text-6xl leading-[0.95] mb-6">Built to be<br />what remains</h2>
            <ScrollReveal as="p" baseOpacity={0.15} enableBlur blurStrength={3} textClassName="text-sand text-lg leading-relaxed">
              Most clothing is designed to be replaced. VESTIGE is designed to be what is left standing — heavy fabrics, honest construction, no logos begging for attention. We cut in limited runs, publish our fabric weights, and price like we plan to see the garment again in ten years.
            </ScrollReveal>
            <div className="mt-8"><LogoLoop logos={['HYPEBEAST', 'GQ', 'DAZED', 'HIGHSNOBIETY', 'i-D'].map((n) => ({ node: <span className="font-display text-xl text-sand">{n}</span>, ariaLabel: n }))} logoHeight={28} gap={48} fadeOut fadeOutColor="#171717" /></div>
          </div>
          <div className="story-stack min-w-0">
            <LazyVisible fallback={<div className="min-h-[80vh]" aria-hidden />}>
              <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}>
                <StickyScrollCards className="pt-[8vh] pb-[8vh]" hint="Scroll — the method" cards={[
                  { title: '01 — Heavy cloth only', src: products[2].images[0] },
                  { title: '02 — Cut in limited runs', src: products[0].images[0] },
                  { title: '03 — No logos, ever', src: products[9].images[0] },
                  { title: '04 — Repaired, not replaced', src: products[11].images[0] },
                ]} />
              </Suspense>
            </LazyVisible>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL — Componentry Case Study Flip Stack ── */}
      <LazyVisible fallback={<div className="min-h-[60vh] bg-[#eeeae2]" aria-hidden />}>
      <Suspense fallback={<div className="min-h-[60vh] bg-[#eeeae2]" aria-hidden />}>
        <CaseStudyFlipStack className="flip-stack" heading="Field Notes." endLabel="End of notes" items={[
          { eyebrow: 'Leather', title: 'The Relic, six months in', description: 'Our cropped jacket after half a year of daily wear — the grain deepens, the vermilion lining appears only in motion.', image: products[0].images[0], imageAlt: 'Relic leather jacket worn in', background: '#1c1c1c', foreground: '#EDE8E0' },
          { eyebrow: 'Wool', title: 'A coat that is the outfit', description: 'The Monolith was cut oversized on purpose. Under it, anything. Over everything, presence.', image: products[1].images[0], imageAlt: 'Monolith wool coat editorial', background: '#FF4D00', foreground: '#FFFFFF' },
          { eyebrow: 'Silk', title: 'Half a second behind you', description: 'The Column dress is bias-cut so the fabric moves after you do. That delay is the whole design.', image: products[9].images[0], imageAlt: 'Column slip dress in motion', background: '#EDE8E0', foreground: '#101010' },
        ]} />
      </Suspense>
      </LazyVisible>

      {/* ── REVIEWS — React Bits CardSwap ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-10 items-center" aria-labelledby="rev-h">
        <div>
          <p className="eyebrow mb-4">Word of mouth</p>
          <h2 id="rev-h" className="font-display uppercase text-4xl sm:text-6xl leading-[0.95]">Worn &<br />sworn by</h2>
          <p className="text-sand mt-5 max-w-md">4.8 average across 2,841 verified reviews. The stack cycles on its own — hover to hold a story.</p>
        </div>
        <div className="min-h-[320px]">
          <LazyVisible fallback={<div className="min-h-[240px]" aria-hidden />}>
            <Suspense fallback={<div className="min-h-[240px]" aria-hidden />}>
              <CardSwap width={340} height={240} autoplay delay={3500} pauseOnHover items={[
                { title: '★★★★★ — Mara J.', alt: 'Review by Mara J.' },
                { title: '★★★★★ — Devon K.', alt: 'Review by Devon K.' },
                { title: '★★★★★ — Tomás E.', alt: 'Review by Tomás E.' },
              ]} />
            </Suspense>
          </LazyVisible>
          <blockquote className="mt-6 border-l-2 border-vermilion pl-4 text-sand max-w-md">
            “You can feel the fabric weight the second you pick it up. Cut is exactly as pictured.”
            <footer className="mt-2 text-xs uppercase tracking-widest">— Mara J., verified buyer</footer>
          </blockquote>
        </div>
      </section>

      {/* ── MOBILE DOCK — Componentry Magnetic Dock ── */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <MagneticDock variant="glass" items={[
            { id: 'home', label: 'Home', icon: <DockIconHome />, onClick: () => navigate('/') },
            { id: 'shop', label: 'Shop', icon: <DockIconSearch />, onClick: () => navigate('/shop') },
            { id: 'cart', label: 'Cart', icon: <DockIconMail />, onClick: () => setOpen(true) },
          ]} />
        </div>
      </div>
    </main>
  )
}
