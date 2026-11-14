# COMPONENTS.md — Final component inventory

Every visual UI component used in VESTIGE, its source, and where it appears.
All components were installed as **real source from the official registries** on 2026-11-13:
Componentry via `https://componentry.dev/r/<name>.json` and React Bits via
`https://reactbits.dev/r/<Name>-TS-TW.json` — the exact payloads the shadcn CLI
(`npx shadcn@latest add @componentry/<name>` / `@react-bits/<Name>-TS-TW`) installs.
Source lives in `src/components/componentry/` and `src/components/reactbits/` (editable, as upstream intends).
Animation dependencies of those components (motion, framer-motion, gsap, @gsap/react, lenis, @hugeicons/*, clsx/tailwind-merge for `cn`) are used only as their dependencies.

## Componentry — componentry.dev (10 used)

| Component | Where it appears |
|---|---|
| Grain Gradient | Home hero background (disabled under prefers-reduced-motion) |
| Kinetic Text Reveal | Home hero headline; Product page title |
| Flipping Word Swap | Home hero — the fabric word in the intro sentence (SELVEDGE DENIM ⇄ RAW DENIM, flips per-character on hover/tap). Spacing note: the component centers its stacked words in a box sized to the wider word, which pooled space around the resting word and detached the following comma — so the flip word is deliberately narrower than the resting word, and a `.flip-inline` glue rule in index.css left-aligns the character rows. Replaced Text Morph on 2026-11-13 at the user's request; Text Morph removed. |
| Sticky Scroll Cards | Home brand-story stack |
| Case Study Flip Stack | Home editorial "Field Notes" section |
| Hover Transition | Product cards — default/hover image swap (Shop, Related) |
| Layered Stack | Cart drawer empty state |
| Magnetic Dock | Mobile floating dock (Home / Shop / Cart) |
| Closing Plasma | Footer CTA / newsletter band |
| Silk Aurora | Shop page header band |

## React Bits — reactbits.dev (24 used)

| Component | Where it appears |
|---|---|
| Burger menu (native) | Global header navigation — three-line toggle folding to an X, dropdown panel with Home / Shop / Checkout + category links. Native button/nav: neither library ships a plain three-line burger toggle (their navs are pill/text toggles). Replaced React Bits PillNav on 2026-11-13 at the user's request; PillNav removed. |
| SplitText | Home "Featured Remains" heading |
| BlurText | Shop and Checkout page headings |
| ScrollReveal | Home story copy; Product description |
| ScrollVelocity | Home marquee band (see swap note 1) |
| ShinyText | Product page price |
| CountUp | Home stats; Cart subtotal |
| Counter | Quantity display — Product page, Cart drawer |
| FadeContent | Page transitions; Home hero image; Checkout confirmation |
| AnimatedContent | Section/card entrances — Home featured, Shop grid |
| SpotlightCard | Product cards, Product reviews, Checkout order summary |
| TiltedCard | Product page — related products (4th slot) |
| BorderGlow | Product page — selected size variant |
| GlareHover | Product card images |
| Magnet | Add-to-cart / Checkout CTAs |
| ClickSpark | Add-to-cart feedback (Product page) |
| Carousel | Home featured products |
| Stack | Product page image gallery (+ native thumbnail buttons) |
| AnimatedList | Cart drawer line items |
| Stepper | Checkout — Shipping → Payment → Review |
| ElasticSlider | Shop max-price filter (plus a native number input as keyboard alternative) |
| MagicBento | Home category bento |
| CardSwap | Home reviews |
| LogoLoop | Home press logos |

## Install-failure swaps (all substitutions stay within the two allowed sites)

1. **Componentry "Velocity Scroll"** — registry returned **404** for both `velocity-scroll` and `velocity-scroll-text` on 2026-11-13 → marquee uses **React Bits ScrollVelocity** instead.
2. **Componentry "Liquid Glass Carousel"** — source installs but requires a three.js WebGL stack; for the featured-products slot the plan's own fallback applies → **React Bits Carousel** (CardSwap also used, for reviews).
3. **Componentry "Wheel Carousel"** — depends on `next-themes` (Next.js-only) in a Vite project → category browsing uses **React Bits MagicBento** + native category buttons on Shop.
4. **Componentry "Image Ripple Effect"** — requires @react-three/fiber/drei WebGL; dropped for performance and reduced-motion safety → product gallery uses **React Bits Stack**.
5. **Componentry "Orbit Card Stack" / "Signature" / "Scroll Tilted Grid"** — not used; reviews use **React Bits CardSwap**, footer sign-off is typographic inside **Closing Plasma**. Fewer, stronger components over component tourism.
6. **React Bits "StaggeredMenu"** — its fixed full-screen scope conflicts with the sticky header → navigation was originally **PillNav** + **Componentry Magnetic Dock**; since 2026-11-13 the header uses the native burger menu above (user request) and PillNav is removed.

## The native-HTML gap (honest note)

Neither library ships classic e-commerce primitives — no form inputs, select, drawer,
accordion, tabs or toast. Per the brief, those surfaces use **native HTML elements**
(`input`, `select`, `button`, `label`, `fieldset`, `aside`) styled only with theme
tokens and composed inside allowed components (e.g. Stepper, SpotlightCard, BorderGlow).
No other UI library (no shadcn/ui components, MUI, DaisyUI, etc.) and no site template
was used anywhere. `src/components/site/*` files are compositions/layout glue of the
components above, not new visual components.
