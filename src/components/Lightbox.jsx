import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { imgUrl, srcSet } from '../data/images'
import { ease } from '../lib/motion'
import content from '../content/pageContent'
import './Lightbox.css'

const { lightbox } = content.ui

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 80, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir * -80, scale: 0.98 }),
}

/**
 * Fullscreen gallery/lightbox for a single project. Keyboard (arrows + escape),
 * swipe/drag on touch, locks background scroll and preloads neighbours.
 */
export default function Lightbox({ project, onClose }) {
  const [[i, dir], setState] = useState([0, 1])
  const gallery = project?.gallery ?? []
  const count = gallery.length

  const go = useCallback((step) => setState(([v]) => [(v + step + count) % count, step]), [count])
  const next = useCallback(() => go(1), [go])
  const prev = useCallback(() => go(-1), [go])

  useEffect(() => {
    setState([0, 1])
  }, [project])

  useEffect(() => {
    if (!project) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose, next, prev])

  // Warm the cache for the next/previous image so navigation feels instant.
  useEffect(() => {
    if (!count) return
    ;[1, -1].forEach((s) => {
      const im = new Image()
      im.src = imgUrl(gallery[(i + s + count) % count].src, 1600)
    })
  }, [i, count, gallery])

  const current = gallery[i]

  return createPortal(
    <AnimatePresence>
      {project && current && (
        <motion.div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} gallery`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="lb__backdrop" onClick={onClose} />

          <motion.div
            className="lb__bar"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <div className="lb__info">
              <span className="lb__cat">{project.category} · {project.location}</span>
              <h2 className="lb__title display">{project.title}</h2>
            </div>
            <button className="lb__close" onClick={onClose} aria-label={lightbox.close}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>

          <div className="lb__stage">
            <button className="lb__nav lb__nav--prev" onClick={prev} aria-label={lightbox.prevImage}>
              <Chevron dir="left" />
            </button>

            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.figure
                key={current.src + i}
                className="lb__figure"
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) next()
                  else if (info.offset.x > 60 || info.velocity.x > 400) prev()
                }}
              >
                <img
                  src={imgUrl(current.src, 1600)}
                  srcSet={srcSet(current.src)}
                  sizes="90vw"
                  alt={current.alt || `${project.title} — image ${i + 1} of ${count}`}
                  decoding="async"
                  draggable={false}
                />
              </motion.figure>
            </AnimatePresence>

            <button className="lb__nav lb__nav--next" onClick={next} aria-label={lightbox.nextImage}>
              <Chevron dir="right" />
            </button>
          </div>

          <motion.div
            className="lb__foot"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
          >
            <span className="lb__counter">{String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            <div className="lb__thumbs">
              {gallery.map((g, gi) => (
                <button
                  key={g.src + gi}
                  className={`lb__thumb ${gi === i ? 'is-active' : ''}`}
                  onClick={() => setState([gi, gi > i ? 1 : -1])}
                  aria-label={`${lightbox.viewImagePrefix} ${gi + 1}`}
                >
                  <img src={imgUrl(g.src, 480)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ transform: dir === 'left' ? 'rotate(180deg)' : 'none' }}>
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
