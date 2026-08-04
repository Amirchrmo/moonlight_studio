import { useState } from 'react'
import { img, srcSet } from '../data/images'
import './Media.css'

/**
 * Cinematic monochrome image with lazy loading + blur-up reveal.
 *
 * Renders a low-res blurred placeholder that fades out once the full image
 * decodes, keeping perceived performance high while preserving the mood.
 */
export default function Media({
  id,
  ratio = 1.5,
  alt = '',
  sizes = '100vw',
  width = 1280,
  priority = false,
  className = '',
  hoverZoom = true,
}) {
  const [loaded, setLoaded] = useState(false)
  const h = Math.round(width / ratio)

  return (
    <div
      className={`media m-frame ${hoverZoom ? 'm-zoom' : ''} ${className}`}
      style={{ aspectRatio: `${ratio}` }}
    >
      <div
        className="m-blur"
        style={{ backgroundImage: `url(${img(id, 32, Math.round(32 / ratio), { blur: 3 })})` }}
        aria-hidden="true"
        data-hidden={loaded}
      />
      <img
        src={img(id, width, h)}
        srcSet={srcSet(id, ratio)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        data-loaded={loaded}
      />
    </div>
  )
}
