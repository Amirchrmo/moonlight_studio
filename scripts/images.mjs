#!/usr/bin/env node
/**
 * Static image pipeline.
 *
 *   images/<any/path>.jpg   (source photos — the only place you add/replace images)
 *        ↓  npm run images  (runs automatically before `dev` and `build`)
 *   public/img/<any/path>.<hash>-<width>.webp   (responsive, content-hashed → cached forever)
 *   src/data/image-manifest.json                (sizes + tiny blur placeholder per image)
 *
 * Content (src/content/pageContent.js) refers to images by their path inside
 * `images/`, e.g. `src: "portfolio/vows/01.jpg"`. The build fails loudly if a
 * referenced image does not exist, so typos never reach production.
 *
 * Outputs are cached by content hash: re-running only processes new/changed files.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'images')
const OUT_DIR = path.join(ROOT, 'public/img')
const MANIFEST = path.join(ROOT, 'src/data/image-manifest.json')
const CONTENT = path.join(ROOT, 'src/content/pageContent.js')

/** Responsive widths generated for every image (never upscaled). */
const WIDTHS = [480, 800, 1200, 1600, 2400]
const QUALITY = 78
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
  )
  return files.flat()
}

const exists = (p) => fs.access(p).then(() => true, () => false)
const toPosix = (p) => p.split(path.sep).join('/')

async function processImage(file) {
  const rel = toPosix(path.relative(SRC_DIR, file))
  const buf = await fs.readFile(file)
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 8)
  // .rotate() applies EXIF orientation so phone photos are never sideways.
  const meta = await sharp(buf).rotate().metadata()
  const portrait = (meta.orientation ?? 1) >= 5
  const width = portrait ? meta.height : meta.width
  const height = portrait ? meta.width : meta.height

  const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(Math.min(width, WIDTHS.at(-1))))]
  const base = rel.replace(/\.[^.]+$/, '')
  const srcs = {}
  let created = 0

  for (const w of widths) {
    const url = `/img/${base}.${hash}-${w}.webp`
    srcs[w] = url
    const out = path.join(OUT_DIR, url.slice('/img/'.length))
    if (await exists(out)) continue
    await fs.mkdir(path.dirname(out), { recursive: true })
    await sharp(buf).rotate().resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toFile(out)
    created++
  }

  const ph = await sharp(buf).rotate().resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer()

  return {
    rel,
    created,
    entry: { w: width, h: height, ph: `data:image/webp;base64,${ph.toString('base64')}`, srcs },
  }
}

/** Social preview image + touch icon, regenerated only when missing. */
const OG_SOURCE = 'site/hero.jpg'
async function buildExtras() {
  const og = path.join(ROOT, 'public/og-image.jpg')
  if (!(await exists(og))) {
    await sharp(path.join(SRC_DIR, OG_SOURCE))
      .rotate()
      .resize(1200, 630, { fit: 'cover', position: 'attention' })
      .grayscale()
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(og)
  }
  const icon = path.join(ROOT, 'public/apple-touch-icon.png')
  if (!(await exists(icon))) {
    await sharp(path.join(ROOT, 'public/favicon.svg'), { density: 300 }).resize(180, 180).png().toFile(icon)
  }
}

async function main() {
  const t0 = Date.now()
  const files = (await walk(SRC_DIR)).filter((f) => EXTS.has(path.extname(f).toLowerCase())).sort()
  if (!files.length) throw new Error(`No images found in ${SRC_DIR}`)

  const manifest = {}
  let created = 0
  // Small concurrency pool keeps memory reasonable with large originals.
  const queue = [...files]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const r = await processImage(queue.shift())
        manifest[r.rel] = r.entry
        created += r.created
      }
    })
  )

  // Remove stale outputs (deleted/replaced source images).
  const keep = new Set(Object.values(manifest).flatMap((e) => Object.values(e.srcs)))
  let removed = 0
  for (const f of await walk(OUT_DIR)) {
    if (!keep.has('/img/' + toPosix(path.relative(OUT_DIR, f)))) {
      await fs.rm(f)
      removed++
    }
  }

  await buildExtras()

  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]))
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true })
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + '\n')

  // Validate every image referenced in the content file.
  const content = await fs.readFile(CONTENT, 'utf8')
  const refs = [...content.matchAll(/\bsrc:\s*["']([^"']+)["']/g)]
    .map((m) => m[1])
    .filter((s) => !s.startsWith('/') && !/^https?:/.test(s))
  const missing = [...new Set(refs.filter((r) => !manifest[r]))]
  if (missing.length) {
    console.error(`\n✖ pageContent.js references images that are not in images/:\n  - ${missing.join('\n  - ')}\n`)
    process.exit(1)
  }

  console.log(
    `✔ images: ${files.length} sources, ${created} generated, ${removed} stale removed (${((Date.now() - t0) / 1000).toFixed(1)}s)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
