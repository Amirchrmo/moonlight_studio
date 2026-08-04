/**
 * Premium black & white placeholder imagery.
 *
 * We use picsum.photos with the `grayscale` filter so every image renders as a
 * cinematic monochrome photograph. Curated photo IDs are chosen for mood and
 * composition. `img()` builds a responsive-friendly URL for any size.
 */

const BASE = 'https://picsum.photos/id'

export function img(id, w, h, { grayscale = true, blur = 0 } = {}) {
  const params = []
  if (grayscale) params.push('grayscale')
  if (blur) params.push(`blur=${blur}`)
  const q = params.length ? `?${params.join('&')}` : ''
  return `${BASE}/${id}/${Math.round(w)}/${Math.round(h)}${q}`
}

/** Build a srcSet across common widths for responsive loading. */
export function srcSet(id, ratio = 1.5, widths = [640, 960, 1280, 1920]) {
  return widths.map((w) => `${img(id, w, Math.round(w / ratio))} ${w}w`).join(', ')
}
