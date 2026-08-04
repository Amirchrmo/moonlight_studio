import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { img } from '../data/images'
import content from '../content/pageContent'
import './Lightbox.css'

const ease = [0.22, 1, 0.36, 1]
const { lightbox } = content.ui

/**
 * Fullscreen gallery/lightbox for a single project. Traps focus, supports
 * keyboard navigation (arrows + escape) and locks background scroll.
 */
export default function Lightbox({ project, onClose }) {
  const [i, setI] = useState(0)
  const gallery = project?.gallery ?? []
  const count = gallery.length

  const next = useCallback(() => setI((v) => (v + 1) % count), [count])
  const prev = useCallback(() => setI((v) => (v - 1 + count) % count), [count])

  useEffect(() => {
    setI(0)
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

  return createPortal(
    <AnimatePresence>
      {project && (
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

          <div className="lb__bar">
            <div className="lb__info">
              <span className="lb__cat">{project.category} · {project.location}</span>
              <h2 className="lb__title display">{project.title}</h2>
            </div>
            <button className="lb__close" onClick={onClose} aria-label={lightbox.close}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="lb__stage">
            <button className="lb__nav lb__nav--prev" onClick={prev} aria-label={lightbox.prevImage}>
              <Chevron dir="left" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={gallery[i].src}
                className="lb__figure"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5, ease }}
              >
                <img
                  src={img(gallery[i].src, 1600, 1067)}
                  srcSet={`${img(gallery[i].src, 1000, 667)} 1000w, ${img(gallery[i].src, 1600, 1067)} 1600w`}
                  sizes="90vw"
                  alt={gallery[i].alt || `${project.title} — image ${i + 1} of ${count}`}
                  decoding="async"
                />
              </motion.figure>
            </AnimatePresence>

            <button className="lb__nav lb__nav--next" onClick={next} aria-label={lightbox.nextImage}>
              <Chevron dir="right" />
            </button>
          </div>

          <div className="lb__foot">
            <span className="lb__counter">{String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            <div className="lb__thumbs">
              {gallery.map((g, gi) => (
                <button
                  key={g.src}
                  className={`lb__thumb ${gi === i ? 'is-active' : ''}`}
                  onClick={() => setI(gi)}
                  aria-label={`${lightbox.viewImagePrefix} ${gi + 1}`}
                >
                  <img src={img(g.src, 120, 80)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
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
