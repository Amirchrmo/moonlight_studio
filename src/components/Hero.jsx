import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { img } from '../data/images'
import content from '../content/pageContent'
import './Hero.css'

const ease = [0.22, 1, 0.36, 1]
const { hero } = content

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const heroId = hero.image.src

  return (
    <section className="hero" ref={ref} aria-label={hero.ariaLabel}>
      <motion.div className="hero__bg" style={{ y, scale }}>
        <img
          src={img(heroId, 1920, 1080)}
          srcSet={`${img(heroId, 1280, 720)} 1280w, ${img(heroId, 1920, 1080)} 1920w, ${img(heroId, 2560, 1440)} 2560w`}
          sizes="100vw"
          alt={hero.image.alt}
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
      </motion.div>
      <div className="hero__scrim" />
      <div className="hero__vignette" />

      <motion.div className="hero__content" style={{ opacity: fade }}>
        <motion.p
          className="eyebrow hero__eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="hero__title display">
          {hero.titleLines.map((w, i) => (
            <span className="hero__line" key={w.text}>
              <motion.span
                className={w.accent ? 'hero__accent' : ''}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.35 + i * 0.12, ease }}
              >
                {w.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease }}
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease }}
        >
          <Link to={hero.primaryButton.url} className="btn btn--solid">{hero.primaryButton.label}</Link>
          <Link to={hero.secondaryButton.url} className="btn">{hero.secondaryButton.label}</Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        style={{ opacity: fade }}
      >
        <span>{hero.scrollLabel}</span>
        <span className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}
