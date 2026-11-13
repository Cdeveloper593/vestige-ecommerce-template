# VESTIGE — E-commerce Template

A dark-editorial fashion e-commerce **template** (Ink `#101010` / Bone `#EDE8E0` / Vermilion `#FF4D00`), built to an award-site standard: bold Anton display type, generous whitespace, intentional motion — without ever hiding the price or the buy button.

**Component rule:** every visual UI component comes from only two sources — [componentry.dev](https://componentry.dev) and [reactbits.dev](https://reactbits.dev) — installed as real source from their official registries (`/r/<name>.json`, the same payload the shadcn CLI installs). See `COMPONENTS.md` for the full inventory, placements, and install-failure swaps. Custom code is glue only: routing/layout, product data, cart & checkout state, theming.

## Images

All product and hero images are served **locally** from `public/images/` (34 photos, downloaded from Unsplash on 2026-11-13) — the site has **no remote image dependencies**, so it keeps working even if the original image links go down. One thing that is still remote, plainly stated: fonts load from Google Fonts.

**Cloning from GitHub?** The JPG files themselves are not committed — the publishing tool used for this repo rejects binary files. If `public/images/` is empty in your clone, run `node scripts/download-images.mjs` once to fetch all 34 photos into place; after that the site is fully self-contained.

## Run it

```bash
npm install
npm run dev        # dev server → http://localhost:3900
npm run build      # production build (tsc + vite) → dist/
npm run preview    # serve the production build → http://localhost:3900
```

Requires Node 18+ (built/verified on Node 24). No environment variables, no backend — checkout is a mock behind `src/lib/commerce.ts`.

## Routes

| Route | What |
|---|---|
| `/` | Hero, featured carousel, categories, brand story, editorial, reviews |
| `/shop` | Search, category + price filters, sorting, live results count |
| `/product/:slug` | Gallery, size/colour variants, qty, reviews, related (14 products) |
| `/checkout` | Multi-step shipping → payment → review, mock order confirmation |

Cart is a slide-out drawer (Esc closes, focus moves to close button), persisted to localStorage. Free shipping over $200.

## File structure

```
src/
  components/
    componentry/   # installed Componentry source (editable, as shipped by their registry)
    reactbits/     # installed React Bits source (TS-TW variants)
    site/          # compositions of the above + native elements (Header, Footer, CartDrawer, ProductCard)
  data/products.ts # 14 products, variants, reviews (all image URLs curl-verified 200)
  store/cart.tsx   # cart state (context + localStorage)
  lib/commerce.ts  # mock commerce adapter — swap this one file for Stripe or Shopify
  lib/utils.ts     # cn() + currency + reduced-motion helpers (glue)
  pages/           # Home, Shop, Product, Checkout (Shop/Product/Checkout are lazy-loaded)
```

## Going live with payments

Implement the `CommerceAdapter` interface in `src/lib/commerce.ts` (`createCheckoutSession` / `placeOrder`) against Stripe Checkout or the Shopify Storefront API — the UI never touches a provider directly. The file contains step-by-step comments for both.

## Accessibility & motion

Keyboard navigation throughout, visible vermilion focus rings, aria labels on icon buttons, labelled form fields with validation summaries, `prefers-reduced-motion` disables the WebGL hero background, marquee and heavy effects. Product images use reserved aspect-ratio boxes (no layout shift).
