import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BlurText from '../components/reactbits/BlurText/BlurText'
import ElasticSlider from '../components/reactbits/ElasticSlider/ElasticSlider'
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent'
import SilkAurora from '../components/componentry/silk-aurora/silk-aurora'
import ProductCard from '../components/site/ProductCard'
import { CATEGORIES, products } from '../data/products'
import { money } from '../lib/utils'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'rating'
const MAX_PRICE = 500

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('featured')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const category = params.get('category') || 'All'
  // Per-route document title (SPA has no SSR meta) — QA 2026-11-14.
  useEffect(() => { document.title = 'Shop — VESTIGE' }, [])

  const results = useMemo(() => {
    let list = products.filter((p) =>
      (category === 'All' || p.category === category) &&
      p.price <= maxPrice &&
      (query.trim() === '' || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.trim().toLowerCase())))
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    }
    return list
  }, [category, maxPrice, query, sort])

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* BlurText renders a <p>, so the page's real h1 is this sr-only one (QA 2026-11-14). */}
      <h1 className="sr-only">Shop all remains</h1>
      {/* min-h override (QA 2026-11-14): the component defaults to a
          full-viewport band; its root uses containerType:"size", so the
          height must be set explicitly — min-h-0 collapsed it to a clipped
          strip. 360/420px fits the heading block without pushing the grid
          a full screen down. */}
      <SilkAurora baseColor="#101010" midColor="#1d1d1d" accentColor="#FF4D00" className="mb-10 px-6 py-10 min-h-[360px] md:min-h-[420px]">
        <p className="eyebrow mb-3">Drop 04 — 14 pieces</p>
        <BlurText text="SHOP ALL REMAINS" className="font-display uppercase text-5xl sm:text-7xl" />
        <p className="text-sand mt-3 max-w-lg">Search, filter by category and price, sort how you like. Name and price stay readable — always.</p>
      </SilkAurora>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10 items-start">
        <div className="lg:sticky lg:top-24 space-y-8">
          <div>
            <label htmlFor="shop-search" className="eyebrow block mb-3">Search</label>
            <input id="shop-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Leather, tee, runner…" className="field" />
          </div>
          <fieldset>
            <legend className="eyebrow mb-3">Category</legend>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {['All', ...CATEGORIES].map((c) => (
                <button key={c} type="button" aria-pressed={category === c}
                  onClick={() => setParams(c === 'All' ? {} : { category: c })}
                  className={`text-left px-3 py-2 text-sm border ${category === c ? 'bg-vermilion text-ink font-semibold border-vermilion' : 'border-smoke text-sand hover:border-bone hover:text-bone'}`}>
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <p className="eyebrow mb-3" id="price-label">Max price — {money(maxPrice)}</p>
            <div aria-labelledby="price-label">
              <ElasticSlider startingValue={0} maxValue={MAX_PRICE} value={maxPrice} isStepped stepSize={25} ariaLabel="Maximum price"
                onChange={(v) => setMaxPrice(v)} formatValue={(v) => money(v)} leftIcon={<span className="text-xs">$95</span>} rightIcon={<span className="text-xs">$500</span>} />
            </div>
            <p className="text-xs text-sand mt-1">Keyboard alternative: </p>
            <label className="text-xs text-sand">Max price in dollars
              <input type="number" min={0} max={500} step={25} value={maxPrice} onChange={(e) => setMaxPrice(Math.min(MAX_PRICE, Math.max(0, Number(e.target.value) || 0)))} className="field mt-1" />
            </label>
          </div>
          <div>
            <label htmlFor="sort" className="eyebrow block mb-3">Sort</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field">
              <option value="featured">Featured</option>
              <option value="price-asc">Price — low to high</option>
              <option value="price-desc">Price — high to low</option>
              <option value="name">Name A–Z</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        <section aria-live="polite">
          <h2 className="sr-only">Products</h2>
          <p className="text-sm text-sand mb-5" role="status">{results.length} {results.length === 1 ? 'piece' : 'pieces'}{category !== 'All' ? ` in ${category}` : ''}{query ? ` matching “${query}”` : ''}</p>
          {results.length === 0 ? (
            <div className="border border-smoke p-10 text-center">
              <p className="font-display text-3xl uppercase mb-3">Nothing remains</p>
              <p className="text-sand mb-6">No pieces match that combination. Loosen a filter.</p>
              <button type="button" className="btn-ghost" onClick={() => { setQuery(''); setMaxPrice(MAX_PRICE); setParams({}) }}>Reset all filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((p, i) => (
                <AnimatedContent key={p.slug} distance={24} delay={Math.min(i * 0.04, 0.3)}>
                  <ProductCard product={p} />
                </AnimatedContent>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
