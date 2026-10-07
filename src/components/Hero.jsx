import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { imgUrl, srcSet } from '../data/images'
import { INTRO_DELAY, ease } from '../lib/motion'
import LineReveal from './motion/LineReveal'
import content from '../content/pageContent'
import './Hero.css'

const { hero } = content
const d = INTRO_DELAY // entrance waits for the intro preloader (0 on later visits)

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])

  return (
    <section className="hero" ref={ref} aria-label={hero.ariaLabel}>
      <motion.div className="hero__bg" style={{ y, scale }}>
        {/* Ken Burns settle on load */}
        <motion.img
          src={imgUrl(hero.image.src, 1920)}
          srcSet={srcSet(hero.image.src)}
          sizes="100vw"
          alt={hero.image.alt}
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 2.6, ease, delay: d }, opacity: { duration: 1.2, delay: d } }}
        />
      </motion.div>
      <div className="hero__scrim" />
      <div className="hero__vignette" />

      <motion.div className="hero__content" style={{ opacity: fade, y: contentY }}>
        {hero.eyebrow && (
          <motion.p
            className="eyebrow hero__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d + 0.2, ease }}
          >
            {hero.eyebrow}
          </motion.p>
        )}

        <LineReveal
          as="h1"
          immediate
          className="hero__title display"
          delay={d + 0.35}
          stagger={0.12}
          lines={hero.titleLines.map((w) => (w.accent ? <em key={w.text}>{w.text}</em> : w.text))}
        />

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d + 0.8, ease }}
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d + 0.95, ease }}
        >
          <Link to={hero.primaryButton.url} className="btn btn--solid">{hero.primaryButton.label}</Link>
          <Link to={hero.secondaryButton.url} className="btn">{hero.secondaryButton.label}</Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: d + 1.3 }}
      >
        <motion.span style={{ opacity: fade }} className="hero__scroll-inner">
          <span>{hero.scrollLabel}</span>
          <span className="hero__scroll-line" />
        </motion.span>
      </motion.div>
    </section>
  )
}
