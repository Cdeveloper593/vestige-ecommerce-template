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
| Sticky Scroll Cards | Home brand-story stack. Layout glue trims its as-shipped dead space (≈550vh of track for 4 cards): padding cut via its className hook, stage height and card offset trimmed by `.story-stack` rules in index.css, story text column sticky. |
| Case Study Flip Stack | Home editorial "Field Notes" section |
| Hover Transition | Product cards — default/hover image swap (Shop, Related) |
| Layered Stack | Cart drawer empty state |
| Magnetic Dock | Mobile floating dock (Home / Shop / Cart) |
| Closing Plasma | Footer CTA / newsletter band |
| Silk Aurora | Shop page header band |

## React Bits — reactbits.dev (23 used, 1 removed in the 2026-11-14 deep QA)

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
| AnimatedList | REMOVED 2026-11-14 (deep QA item 20): it renders role="listbox"/"option", which cannot legally contain the cart's quantity/remove buttons, and its window-level keyboard handler fought them. The drawer list is a native `<ul>` now. Note: the GitHub snapshot-push tool cannot delete files, so the unused source still exists in the repo tree; it is not imported anywhere and compiles clean. |
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

## Deep QA pass — 2026-11-14

Full browser sweep (Playwright + headless Chrome, 360/390/768/1440px, every route),
a read-through audit of all 45 source files, a Lighthouse run, and a fix for every
genuine finding. Method and raw reports: `~/workspace/tools/pw/qa*-vestige.mjs`,
`/tmp/vestige-qa/report*.json`.

### Bugs found & fixed

1. **CRITICAL — Home page crashed blank at ≤768px (React error #185, max update
   depth).** LogoLoop's `geometry()`→`setLayout` feedback loop: below `lg`, the Home
   story grid's text column lacked `min-w-0`, so LogoLoop's root width was
   content-driven — each added logo copy widened the "container", demanding more
   copies (7 → 55+, root width 1,907px → 32,418px at a 390px viewport). Fixed with
   `min-w-0` on the story text column (`Home.tsx`) plus a defensive copies cap (≤64)
   in `LogoLoop.tsx`. Verified: Home renders at all widths, loop converges to 4–5
   copies, zero page errors.
2. **Extra landmarks/headings from library components.** Case Study Flip Stack
   rendered its own `<main>` and `<h1>` (in an off-palette orange); Sticky Scroll
   Cards rendered a `<main>` — Home had 3 mains and 2 h1s. Roots changed to `<div>`
   (sticky root now carries `.ssc-root`; the `.story-stack` glue selectors in
   index.css updated to match), flip heading demoted to a styled `<p>` in ink.
3. **Flip Stack dead space.** Intro block (82vh / min 640px) and 120vh end spacer
   trimmed via `.flip-stack` glue CSS → intro 56vh / min 420px, end min-height 38vh.
4. **Shop and Checkout had no h1** (BlurText renders a `<p>`). Added sr-only h1s
   ("Shop all remains" / "Checkout") and an sr-only h2 "Products" on Shop.
5. **Duplicate section heading on Home** — visible SplitText h2 "FEATURED REMAINS"
   plus an sr-only h2 for the same section. sr-only copy removed.
6. **ScrollReveal hardcoded an `<h2>`** around long body copy (Home story, Product
   description). Added an `as` prop ('h2' | 'p'); both call sites use `as="p"`.
7. **`useReducedMotion` was a render-time read, not a hook** (the Cerium bug
   pattern, verbatim) in `lib/utils.ts` — the value froze at first render. Rewritten
   as a real hook (useState + useEffect + MediaQueryList change listener).
8. **Closing Plasma ignored reduced motion entirely** (continuous WebGL, no check
   anywhere). The Footer now gates it behind the fixed hook with a static
   radial-gradient fallback carrying identical content; the component itself also
   draws a single static frame and stops its rAF loop under reduced motion.
9. **Closed cart drawer stayed keyboard-focusable inside `aria-hidden`.** Added
   `inert` while closed, focus capture on open, and focus restore to the opener on
   close (verified: focus cannot enter the closed drawer; Escape returns focus to
   the header Cart button).
10. **Burger menu Escape stranded focus** in the invisible panel. Escape now
    returns focus to the toggle (verified). Category-link tap height raised.
11. **Checkout step-jump validation hole.** Stepper indicators are clickable;
    jumping 1 → 3 validated only the current step and landed on Review with an
    unvalidated payment step ("Card ending ····"). `onStepChange` now validates
    every skipped step and lands on the first invalid one. Also: double-submit
    guard on Place order, and Checkout uses `shippingFor()` from commerce.ts
    instead of a duplicated formula.
12. **Cart restore trusted localStorage verbatim** — negative/huge/fractional
    quantities and invalid size/colour options were resurrected. The store now
    validates every entry (product exists, integer qty ≥ 1, size/colour within the
    product's options, qty clamped to stock) and `add()` clamps merged quantities
    to stock; the drawer's + button disables at stock. Verified with tampered
    storage (qty 999 → 9 for a stock-9 piece, bad entries dropped, storage
    rewritten clean).
13. **Favicon 404 on every load** — `public/favicon.svg` existed but index.html
    never linked it. Added the icon link, theme-color, canonical, and full
    Open Graph / Twitter cards. The SVG itself was the Vite template's purple
    bolt — replaced with an on-brand mark (bone "V" + vermilion dot on ink).
14. **Dead "Back to top" footer link** (`#top` existed only on Home's `<main>`).
    `id="top"` moved to the App shell; skip link target `#main` given
    `tabIndex={-1}` so focus actually moves. `scroll-padding-top: 88px` added as
    anchor insurance under the sticky header.
15. **Mobile horizontal overflow on Product** — the rotated Stack gallery cards
    painted ~8px past the right edge. Guard: `html, body { overflow-x: clip }`
    (clip, not hidden, so sticky positioning still works). Verified
    scrollWidth == clientWidth on all 16 route×width combinations.
16. **Form contrast/focus nits** — `.field::placeholder` opacity 0.5 → 0.75;
    `.field:focus { outline: none }` removed (it was overriding the global
    :focus-visible outline; the border-colour change stays).
17. **CountUp formatting** — cart subtotal CountUp now uses `separator=","` to
    match `money()` grouping. `money()` now always renders two decimals for
    fractional amounts ($12.50, not $12.5).
18. **Product page stale "Added" state** — changing size/colour/quantity now
    resets the add-to-cart button label.
19. **Shop price-slider reset desync (found by code audit).** ElasticSlider was
    uncontrolled (`defaultValue`); Reset restored Shop state but the slider thumb
    still showed the old price. It is now controlled (`value={maxPrice}`), has an
    accessible name (`ariaLabel="Maximum price"`), and the numeric alternative's
    min/step now match the slider (0 / 25; they were 95 / 5).
20. **AnimatedList misused as the cart list (code audit)** — see the inventory
    note above. Drawer list is a native `<ul>` with identical item markup.
21. **Focus stops inside links (code audit)** — HoverTransition's root is
    `tabIndex={0}` and ProductCard renders it inside a `<Link>`: a focusable
    element inside an anchor on every card. ProductCard now passes
    `tabIndex={-1}` (the link itself remains the focus stop).
22. **Shop header band was a full viewport tall (code audit)** — SilkAurora
    defaults to `min-h-screen`, pushing the catalogue a full screen down. Worse,
    its root uses `containerType: "size"`, so `min-h-0` collapsed the band to a
    clipped 80px strip. The Shop call site now sets an explicit
    `min-h-[360px] md:min-h-[420px]`: full heading block visible, products start
    immediately below.
23. **SilkAurora latent second h1** — its optional `title` prop rendered `<h1>`
    in both the normal and fallback paths. Demoted to `<h2>` (Shop passes no
    title today; the landmine is removed). Its `text-white/68` class generated
    no CSS in Tailwind 3.4 (68 is not on the opacity scale) → `text-white/70`;
    same class of bug in the flip stack (`opacity-82` → `opacity-[0.82]`).
24. **WebGL listener leaks on error paths (code audit)** — in Closing Plasma and
    Silk Aurora, the shader/program/uniform failure returns ran after pointer
    listeners were attached and returned no cleanup, leaking both listeners.
    All failure paths now return a shared `detach` cleanup.
25. **CardSwap and Carousel autoplay ignored reduced motion.** Both engines'
    `paused()` now includes the reduced-motion flag (Carousel's was latent —
    autoplay is off in current use). Verified: under reduced-motion emulation
    the CardSwap stack order is identical after 4.6s (> its 3.5s delay).
    Silk Aurora's rAF loop also now stops after one static frame under reduced
    motion instead of redrawing an identical frame forever.
26. **Checkout kept two order sessions (code audit)** — the summary rendered a
    locally invented fake session while Place order created a different adapter
    session; totals agreed only by luck. There is now exactly one adapter
    session: created from the cart, rendered in the summary, charged by
    placeOrder. placeOrder also gained try/catch/finally — a rejected adapter
    promise previously left the button stuck on "Placing order…" forever.
27. **Checkout validation was cosmetic (code audit)** — card number accepted
    letters, expiry accepted 99/99 and past dates, CVC accepted letters. Now:
    12–19 digits, real MM/YY month, not in the past, numeric 3–4 digit CVC
    (verified end-to-end, including the error messages).
28. **Drawer promised taxes that don't exist** — "Shipping & taxes calculated at
    checkout" with no tax concept anywhere in the mock. Copy corrected to
    "Shipping calculated at checkout."
29. **Misleading image width/height attributes (code audit)** — every product
    image declared 4:5 dimensions; the real files (all 900px wide) range from
    900×598 to 900×1354, and the hero is 900×600, not 900×1125. All `.ph`
    aspect-box containers already reserve the layout space (measured CLS 0), so
    the wrong attributes were removed rather than perpetuated.
30. **Unknown URLs rendered Home** — the router catch-all silently served the
    homepage for every bad URL. New native `NotFound` page ("Nothing remains
    here", links to Shop/Home), mirroring Product's not-found state. Related,
    found during post-push verification: **every deep link 404'd on Vercel**
    (/shop, /checkout, product URLs on refresh or direct visit) because the
    repo had no SPA fallback config — added `vercel.json` with a catch-all
    rewrite to /index.html (static files still serve first).
31. **No per-route titles** — Shop, Product (per product name), Checkout, and
    NotFound now set `document.title`; Home restores the default. (Honest SPA
    limit: one global meta/OG set in index.html; per-route meta needs SSR.)
32. **Mobile Magnetic Dock covered the footer's bottom bar** at the page bottom
    (nav links and the template line were obscured in a 390px screenshot). The
    footer bar now carries `pb-28 lg:pb-10`; verified clear in a settled
    page-bottom screenshot.
33. **Lighthouse findings** — `robots.txt` was the SPA fallback HTML (invalid):
    a real `public/robots.txt` added. Production source maps enabled.
    Accessible-name mismatches fixed: header cart button is now "Cart N items"
    (its visible text is "Cart" + the count badge), and ProductCard links dropped their
    `aria-label` so the accessible name comes from the card contents.
    ScrollReveal's `as="p"` form no longer puts a prohibited `aria-label` on a
    `<p>` nor hides its text from AT.
34. **Contrast: white text on vermilion failed WCAG AA (3.32:1)** on every
    primary button and small vermilion label. Text on vermilion fills is now
    the palette's own ink (≈5.7:1): `.btn-primary`, Shop's active category
    button, Product's selected size button, card badges, the header count
    bubble, and the empty-cart stack card. (The vermilion blocks themselves
    are unchanged.)
35. **Quantity readouts used `aria-label` on plain spans** (prohibited/ignored)
    around Counter in Product and the drawer. Replaced with an sr-only
    `role="status"` readout plus an `aria-hidden` visual Counter.
36. **Home copy promised a non-existent interaction** — "tap any card for the
    full story" above a Carousel whose slides aren't links. Copy corrected to
    point at the product cards below.
37. **`tsconfig` had `strict` off** — enabled `strict: true`; the whole tree
    (including the remaining vendored sources) type-checks with zero errors.
    Also documented `allowedHosts: true` in vite.config.ts (deliberate for the
    localhost.run tunnel workflow).
38. **Related-products TiltedCard could link to `/product/undefined`** if
    `related()` ever returned fewer than 4 items (optional-chained slug inside
    a template string). Now guarded by a `rel[3] &&` conditional.
39. **Performance** — entry chunk 1,017.33 kB (gzip 343.47) → 552.66 kB
    (gzip 184.77) in round 1 of this pass via route-level lazy loading plus
    viewport-gated mounting of the below-fold Home sections (MagicBento,
    Sticky Scroll Cards, Case Study Flip Stack, CardSwap mount on approach via
    an IntersectionObserver wrapper with space-reserving fallbacks), lazy
    Closing Plasma in the Footer, and a lazy Cart Drawer. Home initial JS
    transfer 1,017 kB → ~744 kB measured after all rounds (chunk layout
    reshuffled slightly as routes were added; gzip entry 198 kB). All sections
    still mount on approach with zero errors.

### Flows verified working (Playwright)

- Shop: search ("leather" → 2 pieces), zero-result empty state + Reset (slider,
  number input, and results all return to 14 pieces / $500), category buttons +
  URL param (Footwear → 3), price-asc sort order, price cap $150 → 3 pieces
  ($95/$145/$150), hover image swap; slider keyboard alternative in sync.
- Cart math, exact: 2 × Foundation Heavy Tee $95 = $190 subtotal with "$10 more
  for free shipping" ($200 threshold); + Relic Leather Jacket $485 = $675 with
  free shipping unlocked; decrease-to-zero removes the line; drawer +/− clamps
  at stock; persistence across routes and reload; tampered-storage recovery.
- Checkout: empty-shipping and empty-payment validation messages, tightened
  card/expiry/CVC rules, summary math ($485 / Free / $485), Review shows
  "Card ending 4242", order placed (VST-… id, cart cleared), empty-cart guard
  page, invalid slug → "Piece not found", unknown route → NotFound page.
- Story section: sticky text stays beside all 4 cards with no blank stretches;
  hero Flipping Word Swap keeps the comma attached to SELVEDGE DENIM; burger
  menu open/close/Escape/route-change with focus return; cart drawer
  open/close/Escape with focus return.
- Post-fix matrix: all routes × 360/390/768/1440 → exactly one h1 and one main
  per route, no horizontal overflow, no broken images after scroll, zero page
  errors and zero console errors.

### Honest limitations

- **Lighthouse completed** (two runs; reports in /tmp/vestige-qa during the
  session): after fixes — Accessibility 97, SEO 100, Best Practices 96,
  CLS 0. The Performance score (34; TBT 158s, interactive 171s) is an
  artefact of this VM — 1.5 shared CPUs and software-rendered WebGL — and
  is not representative of real hardware; lab timings from Playwright
  (FCP ≈ 1.6s, CLS 0) carry the same caveat. The a11y/SEO findings it
  produced are fixed above (items 13, 33–35); the only remaining contrast
  flags are ScrollReveal word spans sampled mid-animation at 15% opacity
  (final state is ≈8:1).
- **Fonts in the sandbox browser**: Google Fonts requests fail in this
  environment (ERR_TUNNEL_CONNECTION_FAILED), so all screenshots rendered
  with fallback fonts. The font links themselves are unchanged and correct.
- **Known nits left as designed** (documented, not bugs): Magnetic Dock's Cart
  item uses the library's mail glyph (no bag icon exists in the dock's icon
  set; its accessible label is "Cart"); Counter's rolling digits are verbose
  in DOM text (upstream pattern — mitigated by item 35's sr-only readouts);
  flip-stack card h2s are in reverse DOM order (the component renders them
  reversed); Stepper duplicates input ids in the leaving pane for the ~600ms
  of a step transition (upstream pattern, leaving pane is aria-hidden);
  Closing Plasma's `themeMode` prop is accepted but hard-wired dark upstream;
  per-route Open Graph would need SSR.
- The unused AnimatedList source remains in the GitHub tree (snapshot pushes
  cannot delete files) — see item 20. It is imported nowhere.

## Follow-up fix — Featured carousel centering (2026-11-14)

User screenshot: in Home's "FEATURED REMAINS" section the React Bits Carousel
sat hard against the left edge of the max-w-7xl container, leaving the rest of
the row empty on desktop. Root cause: the Carousel root renders at
`width: 100%` capped by its `maxWidth` (= `baseWidth`, 320px) with no auto
margins, inside the full-width AnimatedContent wrapper — a capped block with
no centering glue aligns left. Measured before (Playwright, 1440px): carousel
left gap 0px / right gap 912px; at 390px: 0px / 38px.

Fix (layout glue only, via the component's own `className` prop — no library
source edited): `className="mx-auto"` on the Carousel in `src/pages/Home.tsx`.
Measured after: 1440px gaps 456px / 456px (carousel dead-center), 390px gaps
19px / 19px, no horizontal overflow at either width (scrollWidth ==
clientWidth), next-arrow click still advances the slide (Relic Leather Jacket
→ Monolith Wool Coat), zero page errors. The viewport-gated/lazy mounting from
the QA pass is untouched (Carousel is statically imported in Home and renders
above the LazyVisible sections, as before).
