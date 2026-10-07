import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { imgUrl, placeholder, srcSet } from '../data/images'
import './Media.css'

const ease = [0.76, 0, 0.24, 1]

/**
 * Cinematic monochrome image.
 *  - blur-up placeholder from the manifest while the real file loads
 *  - `reveal`: curtain (clip-path) reveal the first time it scrolls into view
 *  - `parallax`: subtle vertical drift while scrolling (in % of height)
 *
 * `src` is a path inside the `images/` folder, e.g. "portfolio/vows/01.jpg".
 */
export default function Media({
  src,
  ratio = 1.5,
  alt = '',
  sizes = '100vw',
  priority = false,
  className = '',
  hoverZoom = true,
  reveal = true,
  parallax = 0,
}) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-parallax}%`, `${parallax}%`])
  // Observe the (unclipped) frame — a fully clipped element never reports as visible.
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const animateReveal = reveal && !reduce

  return (
    <div
      ref={ref}
      className={`media m-frame ${hoverZoom ? 'm-zoom' : ''} ${className}`}
      style={{ aspectRatio: ratio ? `${ratio}` : undefined }}
    >
      <motion.div
        className="m-clip"
        initial={animateReveal ? { clipPath: 'inset(100% 0% 0% 0%)' } : false}
        animate={animateReveal && inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.2, ease }}
      >
        <motion.div
          className="m-inner"
          style={parallax && !reduce ? { y, scale: 1 + parallax / 50 } : undefined}
        >
          <div
            className="m-blur"
            style={{ backgroundImage: `url(${placeholder(src)})` }}
            aria-hidden="true"
            data-hidden={loaded}
          />
          <img
            src={imgUrl(src, 1200)}
            srcSet={srcSet(src)}
            sizes={sizes}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            data-loaded={loaded}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
