import { useMemo, useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import Page from '../components/Page'
import Media from '../components/Media'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/motion/Reveal'
import LineReveal from '../components/motion/LineReveal'
import { ease } from '../lib/motion'
import content from '../content/pageContent'
import './Portfolio.css'

const { header, categories: CATEGORIES, projects: PROJECTS } = content.portfolio
const uiPf = content.ui.portfolio
const ALL = CATEGORIES[0]
const countFor = (c) => (c === ALL ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length)

export default function Portfolio() {
  const [active, setActive] = useState(ALL)
  const [open, setOpen] = useState(null)

  const list = useMemo(
    () => (active === ALL ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active]
  )

  return (
    <Page>
      <header className="pf-head section">
        <div className="section-wide">
          <Reveal><p className="eyebrow">{header.eyebrow}</p></Reveal>
          <LineReveal
            as="h1"
            immediate
            delay={0.25}
            className="pf-head__title display"
            lines={[header.title.line1, <em key="em">{header.title.emphasis}</em>]}
          />
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
              <sup className="pf-filter__count">{countFor(c)}</sup>
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
                  data-cursor={content.ui.cursor.open}
                  aria-label={`${uiPf.openGalleryPrefix} ${p.title} ${uiPf.openGallerySuffix}`}
                >
                  <Media
                    src={p.cover.src}
                    ratio={p.ratio}
                    alt={p.cover.alt}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
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
