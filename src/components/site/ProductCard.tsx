import { Link } from 'react-router-dom'
import SpotlightCard from '../reactbits/SpotlightCard/SpotlightCard'
import GlareHover from '../reactbits/GlareHover/GlareHover'
import { HoverTransition } from '../componentry/hover-transition/hover-transition'
import { money } from '../../lib/utils'
import type { Product } from '../../data/products'

// Product card = composition (layout glue) of allowed components only:
// React Bits SpotlightCard + GlareHover, Componentry Hover Transition,
// plus native link/text. No new visual component is invented here.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <SpotlightCard theme="dark" spotlightColor="rgba(255,77,0,0.25)" className="bg-coal border border-smoke h-full">
      <Link to={`/product/${product.slug}`} className="block group" aria-label={`${product.name}, ${money(product.price)}`}>
        <div className="relative">
          <HoverTransition
            effect="wipe"
            defaultComponent={
              <GlareHover width="100%" height="100%" glareColor="#EDE8E0" glareOpacity={0.25}>
                <div className="ph aspect-[4/5]"><img src={product.images[0]} alt={product.name} loading="lazy" width={720} height={900} /></div>
              </GlareHover>
            }
            hoverComponent={
              <div className="ph aspect-[4/5]"><img src={product.images[1] ?? product.images[0]} alt="" loading="lazy" width={720} height={900} /></div>
            }
          />
          {product.badge && <span className="absolute top-3 left-3 bg-vermilion text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">{product.badge}</span>}
          {product.stock <= 12 && <span className="absolute top-3 right-3 bg-ink/85 text-bone text-[10px] font-bold uppercase tracking-widest px-2 py-1">Only {product.stock} left</span>}
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-mega text-sand">{product.category}</p>
          <h3 className="mt-1 font-semibold text-bone group-hover:text-vermilion transition-colors">{product.name}</h3>
          <p className="mt-1 text-sm" aria-label={`Rated ${product.rating} out of 5`}>
            <span className="text-vermilion" aria-hidden>{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-sand"> {product.rating} ({product.reviewCount})</span>
          </p>
          <p className="mt-2 text-lg font-bold text-bone">
            {money(product.price)}{' '}
            {product.compareAt && <s className="text-sand text-sm font-normal">{money(product.compareAt)}</s>}
          </p>
        </div>
      </Link>
    </SpotlightCard>
  )
}
