# Pre-Build Component Plan — Awwwards-level E-commerce
Status: BUILT 2026-11-13 — see COMPONENTS.md for the final inventory and README.md for run instructions.
Rule: ALL visual UI from https://componentry.dev/ or https://reactbits.dev/ only.
Custom code = layout/routing, product data, cart/checkout state, theming glue ONLY.
Verified 2026-11-13 against componentry.dev/docs and reactbits.dev/llms.txt catalogs.

## Important constraint found during verification
Neither library ships classic e-commerce primitives (form inputs, drawer, accordion,
tabs, toast, select). They are animation / card / nav / gallery / background libraries.
Plan therefore:
- Every *visual* component below is from the two allowed sources.
- Forms, filters, cart logic use native HTML semantics (button/input/select/label)
  styled only by theme tokens + wrapped in allowed components (e.g. Stepper,
  SpotlightCard, BorderGlow) — no custom UI component imitating another library,
  no shadcn / MUI / etc. This gap will be noted in the final COMPONENTS.md.

## Componentry — componentry.dev
Install: npx shadcn@latest add @componentry/<name> (registry in components.json)
1. Grain Gradient — Hero background — Home hero
2. Silk Aurora — (alt hero/checkout ambience, use only if Grain Gradient clashes) — Checkout header band
3. Kinetic Text Reveal — Hero + section headlines — Home hero, Shop header, Product title reveal
4. Velocity Scroll — Marquee band — Home between Featured and Story
5. Text Morph — Rotating hero word (e.g. category/benefit word) — Home hero subline
6. Sticky Scroll Cards — Brand storytelling, pinned stack — Home story section
7. Case Study Flip Stack — Editorial / lookbook stories — Home story / Journal teaser
8. Hover Transition — Product + related-product card hover — Shop grid, Related products
9. Liquid Glass Carousel — Featured products carousel — Home featured
10. Wheel Carousel — Category picker — Shop header / Home categories
11. Scroll Tilted Grid — Gallery grid that resolves on scroll — Product page gallery (secondary view) / Home gallery
12. Scroll Choreography — Scroll-driven image sequence — Home story
13. Layered Stack — Layered promo / bundle cards — Home promo, Cart empty-state visual
14. Orbit Card Stack — Fan-out card deck — Home testimonials / reviews preview
15. Magnetic Dock — Floating mobile action dock (Home/Shop/Cart) — Global, mobile-first
16. Image Ripple Effect — Hero product image interaction (desktop only, disabled on reduced-motion/touch) — Product page main image
17. Closing Plasma — Footer CTA background — Global footer CTA band
18. Signature — Brand sign-off — Footer / About story close

## React Bits — reactbits.dev
Install: npx shadcn@latest add @react-bits/<Name>-TS-TW  (or jsrepo), TS-TW variant
19. PillNav — Main navigation with sliding active dot — Global header (desktop + mobile header bar)
20. StaggeredMenu — Full-screen mobile menu — Global mobile nav
21. SplitText — Hero headline stagger — Home hero (paired with Kinetic Text Reveal, not both on same line — pick one per headline at build)
22. BlurText — Section headline entrance — Shop, Product, Checkout headings
23. ScrollReveal — Paragraph / copy reveal on scroll — Home story, Product description
24. ScrollVelocity — (alt to Componentry Velocity Scroll — use ONE marquee only) — not both, reserve
25. ShinyText — Price / eyebrow accent, Add-to-cart feedback label — Product price, buttons accents
26. CountUp — Stats (reviews count, years, products sold) + cart totals count — Home stats, Cart summary
27. Counter — Quantity stepper display — Cart drawer + Product page qty
28. AnimatedContent — Entrance for sections/cards on scroll — All pages (section wrappers)
29. FadeContent — Page-transition fade + image fade-in (no CLS, reserved aspect boxes) — All pages
30. TiltedCard — Featured / hero product card tilt (pointer only, off on touch/reduced-motion) — Home featured, Product related
31. SpotlightCard — Product cards, review cards, checkout summary card — Shop grid, Product reviews, Checkout summary
32. BorderGlow — Focus / selected variant + featured card edge — Product variant selection, Featured product
33. GlareHover — Image hover glare — Shop product images
34. Magnet — Magnetic CTA buttons (Add to Cart, Checkout) — Product, Cart drawer
35. ClickSpark — Add-to-cart micro-feedback spark — Add to Cart action only
36. Carousel — Product image gallery main carousel — Product page gallery
37. Masonry — Shop grid masonry variant / reviews wall — Shop (grid toggle off by default for price scannability) + Reviews
38. AnimatedList — Filter results / cart line items entrance + keyboard-navigable list — Shop results, Cart items
39. Stepper — Checkout flow steps (Shipping → Payment → Review) — Checkout
40. ElasticSlider — Price-range filter — Shop filters
41. MagicBento — Category / feature bento — Home categories + Why-us features
42. CardSwap — Testimonial / review swapper — Home reviews, Product reviews highlight
43. Stack — Swipeable image stack — Product page secondary gallery (mobile)
44. LogoLoop — Press / brand marquee logos — Home social proof band
45. CurvedLoop — Curved marquee text — Home promo band (one marquee total with #4 — choose at build, do not stack)
46. Aurora / Grainient — NOT planned: Componentry hero backgrounds cover this; adding a second WebGL system hurts performance. Excluded intentionally.
47. Dock (React Bits) — NOT planned: duplicate of Componentry Magnetic Dock. Excluded.

## Page mapping summary
- Home: 1,3/21,4,5,6,9,12,30,41,42,44 + PillNav/StaggeredMenu, Magnetic Dock, Closing Plasma footer
- Shop: PillNav, BlurText, Wheel Carousel, ElasticSlider, AnimatedList, SpotlightCard+GlareHover+Hover Transition cards, AnimatedContent/FadeContent
- Product: Carousel + Stack + Image Ripple, BorderGlow (variants), Counter, Magnet+ClickSpark (Add to Cart), ScrollReveal (description), SpotlightCard (reviews), TiltedCard/Hover Transition (related)
- Cart (drawer, layout glue + native semantics): AnimatedList items, Counter qty, CountUp subtotal, Magnet checkout CTA, Layered Stack empty state
- Checkout: Stepper, SpotlightCard summary, BlurText headings, Silk Aurora band, FadeContent transitions. Mock adapter: src/lib/commerce.ts with createOrder() interface shaped for Stripe/Shopify swap.

## Non-visual custom code allowed
- src/data/products.ts — 12+ products (name, price, description, variants, reviews) — PENDING brand/category
- src/store/cart.tsx — cart state, qty, remove, subtotal, localStorage
- src/lib/commerce.ts — mock checkout adapter (Stripe/Shopify-ready interface)
- Routing, layout grid, theme tokens (CSS variables), reduced-motion + keyboard handling glue

## Decisions — resolved 2026-11-13
User replied "its just a template website so whatever is fine" — full discretion given.
Chosen direction (single, distinctive, stuck to throughout):
- Brand: VESTIGE — dark editorial fashion / streetwear label
- Palette: Ink #101010, Bone #EDE8E0, Vermilion #FF4D00 accent. Bold condensed type, generous whitespace.
- Products: 14 fashion products, USD, premium $95–$485, sizes XS–XL, colour variants
- Cart: slide-out drawer
- Checkout: multi-step via React Bits Stepper, mock adapter in lib/commerce.ts (Stripe/Shopify-ready)
- Images: verified stock (Unsplash) placeholders, each URL checked 200 before use
- Stack: fresh React + TypeScript + Tailwind project (no other UI library/template)

