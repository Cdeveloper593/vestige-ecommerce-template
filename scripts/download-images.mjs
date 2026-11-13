// Downloads the site's 34 product/hero photos into public/images/ so the
// site serves every image locally and never depends on remote image links.
//
// Why this script exists: the photos were downloaded on 2026-11-13 and are
// used locally, but the tool that published this repo to GitHub rejects
// binary files, so the JPGs themselves are not committed. If you cloned
// this repo and public/images/ is empty, run:
//
//   node scripts/download-images.mjs
//
// once — after that the site is fully self-contained. Node 18+ (uses fetch).
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const IDS = [
  '1434389677669-e08b4cac3105', '1441986300917-64674bd600d8', '1445205170230-053b83016050',
  '1483985988355-763728e1935b', '1485968579580-b6d095142e6e', '1487412720507-e7ab37603c6f',
  '1490481651871-ab68de25d43d', '1496747611176-843222e1e57c', '1503342217505-b0a15ec3261c',
  '1507680434567-5739c80be1ac', '1509631179647-0177331693ae', '1511499767150-a48a237f0083',
  '1515372039744-b8f02a3ae446', '1521572163474-6864f9cf17ab', '1523381210434-271e8be1f52b',
  '1524504388940-b1c1722653e1', '1539109136881-3be0616acf4b', '1541099649105-f69ad21f3246',
  '1542272604-787c3835535d', '1543163521-1bf539c55dd2', '1549298916-b41d501d3772',
  '1551028719-00167b16eac5', '1552374196-c4e7ffc6e126', '1553062407-98eeb64c6a62',
  '1556306535-0f09a537f0a3', '1560769629-975ec94e6a86', '1571945153237-4929e783af4a',
  '1576566588028-4147f3842f27', '1594633312681-425c7b97ccd1', '1595950653106-6c9ebd614d3a',
  '1600185365483-26d7a4cc7519', '1618354691373-d851c5c3a990', '1620799140408-edc6dcb6d633',
  '1621072156002-e2fccdc0b176',
]

const outDir = new URL('../public/images/', import.meta.url)
await mkdir(outDir, { recursive: true })

let done = 0, skipped = 0
for (const id of IDS) {
  const file = new URL(`${id}.jpg`, outDir)
  try { await access(file); skipped++; continue } catch { /* not downloaded yet */ }
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`
  const res = await fetch(url)
  if (!res.ok) { console.error(`FAILED ${id}: HTTP ${res.status}`); process.exitCode = 1; continue }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 10_000) { console.error(`FAILED ${id}: suspiciously small (${buf.length} bytes)`); process.exitCode = 1; continue }
  await writeFile(file, buf)
  done++
  console.log(`ok ${id}.jpg (${buf.length} bytes)`)
}
console.log(`\nDownloaded ${done}, already present ${skipped}, total expected ${IDS.length}.`)
