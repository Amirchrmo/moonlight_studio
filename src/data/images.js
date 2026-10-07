/**
 * Image helpers backed by the generated manifest (see scripts/images.mjs).
 *
 * Images are referenced by their path inside the top-level `images/` folder,
 * e.g. "portfolio/vows/01.jpg". Every image is pre-built into several widths,
 * so components just pass `sizes` and the browser picks the best file.
 */
import manifest from './image-manifest.json'

const FALLBACK = { w: 1600, h: 1000, ph: '', srcs: {} }

/** Manifest entry for an image path (warns in dev if it doesn't exist). */
export function getImage(src) {
  const entry = manifest[src]
  if (!entry && import.meta.env.DEV) console.warn(`[images] Unknown image "${src}" — add it to images/`)
  return entry || FALLBACK
}

/** `srcset` string covering every generated width. */
export function srcSet(src) {
  const { srcs } = getImage(src)
  return Object.entries(srcs)
    .map(([w, url]) => `${url} ${w}w`)
    .join(', ')
}

/** Single URL closest to (but not smaller than) the wanted width. */
export function imgUrl(src, width = 1200) {
  const { srcs } = getImage(src)
  const widths = Object.keys(srcs).map(Number).sort((a, b) => a - b)
  const w = widths.find((x) => x >= width) ?? widths.at(-1)
  return srcs[w] ?? ''
}

/** Natural aspect ratio (width / height). */
export function ratioOf(src) {
  const { w, h } = getImage(src)
  return w / h
}

/** Tiny inline blur placeholder (data URI). */
export function placeholder(src) {
  return getImage(src).ph
}
