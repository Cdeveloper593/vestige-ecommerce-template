// Product data — non-visual glue. Every image URL below was curl-verified HTTP 200 on 2026-11-13.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`

export interface Review { author: string; rating: number; title: string; body: string; date: string }
export interface Product {
  slug: string; name: string; price: number; compareAt?: number;
  description: string; details: string[]; category: string;
  sizes: string[]; colours: { name: string; hex: string }[];
  rating: number; reviewCount: number; reviews: Review[];
  badge?: string; stock: number; featured?: boolean;
  images: string[];
}

const POOL: Review[] = [
  { author: 'Mara J.', rating: 5, title: 'Heavier, better, honest', body: 'You can feel the fabric weight the second you pick it up. Cut is exactly as pictured — boxy where it should be, clean at the hem.', date: '2026-10-18' },
  { author: 'Devon K.', rating: 5, title: 'Wears like armour', body: 'Third VESTIGE piece I own. Survived a month of daily wear without losing shape. Sizing runs true — take your usual.', date: '2026-09-30' },
  { author: 'Anaïs R.', rating: 4, title: 'Beautiful, minimal, warm', body: 'The colour is deeper in person. Docked one star because delivery took six days, but the garment itself is flawless.', date: '2026-10-02' },
  { author: 'Tomás E.', rating: 5, title: 'Zero logos, all presence', body: 'Exactly the point of this label. People ask where it is from constantly. Stitching and hardware feel a tier above the price.', date: '2026-08-21' },
  { author: 'June P.', rating: 4, title: 'Structured and sharp', body: 'Holds its silhouette all day. Slightly long in the sleeve for me — the size guide is accurate, so read it before ordering.', date: '2026-10-27' },
  { author: 'Felix W.', rating: 5, title: 'Bought a second one', body: 'Rarely do this. The first one got so many comments I ordered the other colourway before it sold out.', date: '2026-09-12' },
]
const rv = (a: number, b: number, c?: number): Review[] => (c === undefined ? [POOL[a], POOL[b]] : [POOL[a], POOL[b], POOL[c]])
const APPAREL = ['XS', 'S', 'M', 'L', 'XL']
const INK_BONE = [{ name: 'Ink', hex: '#101010' }, { name: 'Bone', hex: '#EDE8E0' }]

export const CATEGORIES = ['Outerwear', 'Tailoring', 'Essentials', 'Footwear', 'Objects'] as const

export const products: Product[] = [
  {
    slug: 'relic-leather-jacket', name: 'Relic Leather Jacket', price: 485, compareAt: 560,
    description: 'A cropped, boxy jacket cut from full-grain aniline leather that breaks in like a second skin. No visible branding — just weight, drape and a vermilion interior stitch that only shows when you move.',
    details: ['Full-grain aniline leather', 'Corozo buttons, gunmetal zip', 'Quilted vermilion lining', 'Made in limited runs of 200'],
    category: 'Outerwear', sizes: APPAREL, colours: INK_BONE, rating: 4.9, reviewCount: 212, reviews: rv(1, 3, 5),
    badge: 'Icon', stock: 14, featured: true,
    images: [u('1551028719-00167b16eac5'), u('1483985988355-763728e1935b'), u('1523381210434-271e8be1f52b')],
  },
  {
    slug: 'monolith-wool-coat', name: 'Monolith Wool Coat', price: 420,
    description: 'Floor-skimming double-faced wool with a sculpted shoulder and a single hidden closure. Cut oversized on purpose — it is the whole outfit.',
    details: ['Double-faced Italian wool', 'Hidden single closure', 'Two interior pockets', 'Oversized editorial cut'],
    category: 'Outerwear', sizes: APPAREL, colours: INK_BONE, rating: 4.8, reviewCount: 148, reviews: rv(2, 0),
    badge: 'New', stock: 9, featured: true,
    images: [u('1539109136881-3be0616acf4b'), u('1445205170230-053b83016050'), u('1490481651871-ab68de25d43d')],
  },
  {
    slug: 'foundation-heavy-tee', name: 'Foundation Heavy Tee', price: 95, compareAt: 120,
    description: '240gsm organic cotton with a ribbed collar that refuses to sag. The tee other tees are measured against — dense, matte, and cut square.',
    details: ['240gsm organic cotton', 'Ribbed anti-sag collar', 'Side-seamed, boxy cut', 'Garment-dyed'],
    category: 'Essentials', sizes: APPAREL, colours: [...INK_BONE, { name: 'Vermilion', hex: '#FF4D00' }], rating: 4.9, reviewCount: 864, reviews: rv(0, 5, 1),
    badge: 'Bestseller', stock: 120, featured: true,
    images: [u('1521572163474-6864f9cf17ab'), u('1576566588028-4147f3842f27'), u('1503342217505-b0a15ec3261c')],
  },
  {
    slug: 'axis-wide-denim', name: 'Axis Wide Denim', price: 185,
    description: '14oz Japanese selvedge in a wide, straight leg that stacks perfectly over boots or breaks clean over sneakers. Fades are earned, never printed.',
    details: ['14oz Japanese selvedge', 'Wide straight leg', 'Chain-stitched hems', 'Button fly'],
    category: 'Tailoring', sizes: ['28', '30', '32', '34', '36'], colours: INK_BONE, rating: 4.7, reviewCount: 231, reviews: rv(3, 4),
    stock: 42,
    images: [u('1542272604-787c3835535d'), u('1541099649105-f69ad21f3246'), u('1434389677669-e08b4cac3105')],
  },
  {
    slug: 'signal-runner', name: 'Signal Runner', price: 240,
    description: 'A sculpted runner in matte technical mesh and suede, finished with a single vermilion heel tab. Built for cities, styled for galleries.',
    details: ['Technical mesh + suede upper', 'Dual-density foam sole', 'Reflective heel tab', 'Vegan lining'],
    category: 'Footwear', sizes: ['40', '41', '42', '43', '44', '45'], colours: INK_BONE, rating: 4.8, reviewCount: 317, reviews: rv(5, 2, 0),
    badge: 'New', stock: 58, featured: true,
    images: [u('1549298916-b41d501d3772'), u('1595950653106-6c9ebd614d3a'), u('1600185365483-26d7a4cc7519')],
  },
  {
    slug: 'court-low-sneaker', name: 'Court Low Sneaker', price: 195, compareAt: 230,
    description: 'A minimal court profile in full-grain white leather on a natural gum sole. No logos on the upper — the silhouette does the talking.',
    details: ['Full-grain leather upper', 'Natural gum cupsole', 'Leather-lined interior', 'Hand-finished in Portugal'],
    category: 'Footwear', sizes: ['40', '41', '42', '43', '44', '45'], colours: [{ name: 'Bone', hex: '#EDE8E0' }, { name: 'Ink', hex: '#101010' }], rating: 4.9, reviewCount: 402, reviews: rv(1, 0),
    stock: 73,
    images: [u('1560769629-975ec94e6a86'), u('1543163521-1bf539c55dd2'), u('1556306535-0f09a537f0a3')],
  },
  {
    slug: 'cargo-day-pack', name: 'Cargo Day Pack', price: 210,
    description: 'A 22-litre pack in ballistic nylon with magnetic hardware and a padded 16-inch laptop sleeve. Carries a day, looks like a sculpture.',
    details: ['Ballistic nylon shell', 'Magnetic buckle hardware', 'Padded 16" laptop sleeve', '22L capacity'],
    category: 'Objects', sizes: ['One Size'], colours: INK_BONE, rating: 4.7, reviewCount: 129, reviews: rv(4, 3),
    stock: 26,
    images: [u('1553062407-98eeb64c6a62'), u('1483985988355-763728e1935b'), u('1441986300917-64674bd600d8')],
  },
  {
    slug: 'eclipse-frame-glasses', name: 'Eclipse Frame', price: 150,
    description: 'Hand-polished bio-acetate frames with nylon polarised lenses. Square, dark, and deliberately unbranded.',
    details: ['Bio-acetate frame', 'Polarised nylon lenses', '100% UV protection', 'Includes hard case'],
    category: 'Objects', sizes: ['One Size'], colours: INK_BONE, rating: 4.6, reviewCount: 88, reviews: rv(2, 5),
    stock: 51,
    images: [u('1511499767150-a48a237f0083'), u('1571945153237-4929e783af4a'), u('1556306535-0f09a537f0a3')],
  },
  {
    slug: 'uniform-tee-3pack', name: 'Uniform Tee — 3 Pack', price: 165, compareAt: 285,
    description: 'Three Foundation tees — Ink, Bone, Vermilion — in one box. The rotation that ends decision fatigue.',
    details: ['3 × 240gsm organic tees', 'Ink / Bone / Vermilion', 'Boxy square cut', 'Pre-shrunk'],
    category: 'Essentials', sizes: APPAREL, colours: INK_BONE, rating: 4.8, reviewCount: 356, reviews: rv(0, 1),
    badge: 'Value', stock: 88,
    images: [u('1523381210434-271e8be1f52b'), u('1620799140408-edc6dcb6d633'), u('1618354691373-d851c5c3a990')],
  },
  {
    slug: 'column-slip-dress', name: 'Column Slip Dress', price: 265,
    description: 'A bias-cut column in matte sandwashed silk that moves half a second behind you. Adjustable straps, zero hardware on show.',
    details: ['Sandwashed silk', 'Bias cut', 'Adjustable straps', 'Midi length'],
    category: 'Tailoring', sizes: APPAREL, colours: INK_BONE, rating: 4.9, reviewCount: 174, reviews: rv(2, 3, 5),
    badge: 'Limited', stock: 11, featured: true,
    images: [u('1594633312681-425c7b97ccd1'), u('1515372039744-b8f02a3ae446'), u('1496747611176-843222e1e57c')],
  },
  {
    slug: 'solar-field-shirt', name: 'Solar Field Shirt', price: 145,
    description: 'A sun-faded overshirt in dry cotton twill with bellows pockets and matte snaps. Layers over everything, argues with nothing.',
    details: ['Dry cotton twill', 'Bellows chest pockets', 'Matte snap closures', 'Relaxed layering fit'],
    category: 'Essentials', sizes: APPAREL, colours: [{ name: 'Solar', hex: '#D9A441' }, ...INK_BONE], rating: 4.6, reviewCount: 97, reviews: rv(4, 0),
    stock: 34,
    images: [u('1509631179647-0177331693ae'), u('1485968579580-b6d095142e6e'), u('1524504388940-b1c1722653e1')],
  },
  {
    slug: 'meridian-knit', name: 'Meridian Knit', price: 225, compareAt: 260,
    description: 'A chunky half-cardigan stitch in undyed merino, knitted seamless so there is nothing to rub, pill or give up. Warmth without bulk.',
    details: ['100% undyed merino', 'Seamless knit', 'Half-cardigan stitch', 'Naturally temperature regulating'],
    category: 'Essentials', sizes: APPAREL, colours: [{ name: 'Bone', hex: '#EDE8E0' }, { name: 'Ink', hex: '#101010' }], rating: 4.8, reviewCount: 143, reviews: rv(1, 4),
    stock: 29,
    images: [u('1434389677669-e08b4cac3105'), u('1576566588028-4147f3842f27'), u('1621072156002-e2fccdc0b176')],
  },
  {
    slug: 'portrait-blazer', name: 'Portrait Blazer', price: 340,
    description: 'Single-breasted, half-canvassed, with a roped shoulder and a ticket pocket. Tailoring that reads editorial, not corporate.',
    details: ['Half-canvassed construction', 'Roped shoulder', 'Horn buttons', 'Half-lined in vermilion'],
    category: 'Tailoring', sizes: APPAREL, colours: INK_BONE, rating: 4.9, reviewCount: 76, reviews: rv(3, 1),
    badge: 'Atelier', stock: 8, featured: true,
    images: [u('1552374196-c4e7ffc6e126'), u('1507680434567-5739c80be1ac'), u('1487412720507-e7ab37603c6f')],
  },
  {
    slug: 'gallery-slip-on', name: 'Gallery Slip-On', price: 175,
    description: 'A laceless slip-on in brushed suede on a cushioned crepe sole. The shoe equivalent of a white gallery wall — quiet, perfect context.',
    details: ['Brushed suede upper', 'Natural crepe sole', 'Elastic gussets', 'Cork footbed'],
    category: 'Footwear', sizes: ['40', '41', '42', '43', '44', '45'], colours: INK_BONE, rating: 4.5, reviewCount: 64, reviews: rv(5, 4),
    stock: 47,
    images: [u('1600185365483-26d7a4cc7519'), u('1560769629-975ec94e6a86'), u('1549298916-b41d501d3772')],
  },
]

export const bySlug = (slug: string) => products.find((p) => p.slug === slug)
export const related = (p: Product, n = 4) => products.filter((x) => x.slug !== p.slug && x.category === p.category).concat(products.filter((x) => x.slug !== p.slug && x.category !== p.category)).slice(0, n)
export const HERO_IMAGE = u('1490481651871-ab68de25d43d')
