import { useMemo, useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import Page from '../components/Page'
import Media from '../components/Media'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import content from '../content/pageContent'
import './Portfolio.css'

const ease = [0.22, 1, 0.36, 1]
const { header, categories: CATEGORIES, projects: PROJECTS } = content.portfolio
const uiPf = content.ui.portfolio

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const [open, setOpen] = useState(null)

  const list = useMemo(
    () => (active === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active]
  )

  return (
    <Page>
      <header className="pf-head section">
        <div className="section-wide">
          <Reveal><p className="eyebrow">{header.eyebrow}</p></Reveal>
          <Reveal as="h1" delay={0.05} className="pf-head__title display">
            {header.title.line1}<br /><em>{header.title.emphasis}</em>
          </Reveal>
          <Reveal delay={0.12} className="pf-head__sub">
            {header.subtitle}
          </Reveal>
        </div>
      </header>

      {/* Filters */}
      <div className="pf-filters">
        <div className="section-wide pf-filters__inner" role="tablist" aria-label={uiPf.filtersAria}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              className={`pf-filter ${active === c ? 'is-active' : ''}`}
              onClick={() => setActive(c)}
            >
              {active === c && <motion.span layoutId="pf-pill" className="pf-filter__pill" transition={{ duration: 0.5, ease }} />}
              <span className="pf-filter__label">{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section pf-grid-section">
        <LayoutGroup>
          <motion.div layout className="section-wide pf-grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.button
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease, delay: (i % 3) * 0.04 }}
                  className={`pf-item pf-item--${p.ratio < 1 ? 'portrait' : 'land'}`}
                  onClick={() => setOpen(p)}
                  aria-label={`${uiPf.openGalleryPrefix} ${p.title} ${uiPf.openGallerySuffix}`}
                >
                  <Media
                    id={p.cover.src}
                    ratio={p.ratio}
                    alt={p.cover.alt}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    width={900}
                  />
                  <span className="pf-item__scrim" />
                  <span className="pf-item__meta">
                    <span className="pf-item__cat">{p.category}</span>
                    <span className="pf-item__title display">{p.title}</span>
                    <span className="pf-item__view">{uiPf.viewGalleryLabel}</span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </section>

      <Lightbox project={open} onClose={() => setOpen(null)} />
    </Page>
  )
}
