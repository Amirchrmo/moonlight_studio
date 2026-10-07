import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { imgUrl, srcSet } from '../data/images'
import { ease } from '../lib/motion'
import content from '../content/pageContent'
import './PortfolioSlider.css'

const DURATION = 6000
const { slider, ui } = content
const SLIDER = slider.items

export default function PortfolioSlider() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)
  const count = SLIDER.length

  const go = useCallback(
    (next) => {
      setDir(next > index || (index === count - 1 && next === 0) ? 1 : -1)
      setIndex((next + count) % count)
    },
    [index, count]
  )

  const next = useCallback(() => go((index + 1) % count), [go, index, count])
  const prev = useCallback(() => go((index - 1 + count) % count), [go, index, count])

  // Autoplay
  useEffect(() => {
    if (paused) return undefined
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), DURATION)
    return () => clearTimeout(timer.current)
  }, [index, paused, count])

  // Keyboard control when the slider is in view / focused
  const onKey = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  const active = SLIDER[index]

  return (
    <section
      className="slider"
      aria-roledescription={ui.slider.roleDescription}
      aria-label={slider.ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Swipe / drag to change slides */}
      <motion.div
        className="slider__stage"
        data-cursor={ui.slider.dragLabel}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -400) next()
          else if (info.offset.x > 60 || info.velocity.x > 400) prev()
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={active.image.src}
            className="slider__slide"
            custom={dir}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease }}
          >
            <motion.img
              src={imgUrl(active.image.src, 1920)}
              srcSet={srcSet(active.image.src)}
              sizes="100vw"
              alt={active.image.alt}
              draggable={false}
              loading="lazy"
              decoding="async"
              initial={{ scale: 1 }}
              animate={{ scale: 1.09 }}
              transition={{ duration: DURATION / 1000 + 1.2, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="slider__scrim" />
      </motion.div>

      {/* Overlay content */}
      <div className="slider__overlay">
        <div className="slider__meta">
          <span className="slider__count">
            {String(index + 1).padStart(2, '0')}
            <span className="slider__count-total"> / {String(count).padStart(2, '0')}</span>
          </span>
        </div>

        <div className="slider__caption">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.image.src}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="slider__category">{active.category}</span>
              <h2 className="slider__title display">{active.title}</h2>
            </motion.div>
          </AnimatePresence>

          <div className="slider__controls">
            <button className="slider__arrow" onClick={prev} aria-label={ui.slider.prev}>
              <Arrow dir="left" />
            </button>
            <button className="slider__arrow" onClick={next} aria-label={ui.slider.next}>
              <Arrow dir="right" />
            </button>
            <Link to={slider.viewAllButton.url} className="btn slider__view">{slider.viewAllButton.label}</Link>
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div className="slider__progress" role="tablist" aria-label={ui.slider.slidesAria}>
        {SLIDER.map((s, i) => (
          <button
            key={s.image.src}
            className={`slider__dot ${i === index ? 'is-active' : ''}`}
            role="tab"
            aria-selected={i === index}
            aria-label={`${ui.slider.goToPrefix} ${s.title}`}
            onClick={() => go(i)}
          >
            <span
              className="slider__dot-fill"
              style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }}
              data-active={i === index}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ transform: dir === 'left' ? 'rotate(180deg)' : 'none' }}>
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
