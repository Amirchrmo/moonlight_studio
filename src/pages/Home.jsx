import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import Hero from '../components/Hero'
import PortfolioSlider from '../components/PortfolioSlider'
import Media from '../components/Media'
import Reveal from '../components/motion/Reveal'
import LineReveal from '../components/motion/LineReveal'
import ScrollWords from '../components/motion/ScrollWords'
import Marquee from '../components/motion/Marquee'
import CountUp from '../components/motion/CountUp'
import { ease } from '../lib/motion'
import content from '../content/pageContent'
import './Home.css'

const { home, portfolio, ui } = content
const { intro, featured: featuredContent, marquee, services, statistics, cta } = home

export default function Home() {
  const featured = portfolio.projects.slice(0, featuredContent.count ?? 4)

  return (
    <Page>
      <Hero />
      <PortfolioSlider />

      {/* Philosophy statement — words light up while scrolling */}
      <section className="section home-intro">
        <div className="section-wide home-intro__grid">
          <Reveal className="home-intro__eyebrow">
            <p className="eyebrow">{intro.eyebrow}</p>
          </Reveal>
          <ScrollWords
            className="home-intro__statement display"
            parts={[
              { text: intro.statement.before },
              { text: intro.statement.emphasis, em: true },
              { text: intro.statement.after },
            ]}
          />
          <Reveal delay={0.15} className="home-intro__foot">
            <Link to={intro.link.url} className="home-link">
              {intro.link.label} <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured work — editorial asymmetric grid */}
      <section className="section home-featured">
        <div className="section-wide">
          <div className="home-featured__head">
            <LineReveal className="home-featured__title display" lines={[featuredContent.title]} />
            <Reveal delay={0.1}>
              <Link to={featuredContent.button.url} className="btn">{featuredContent.button.label}</Link>
            </Reveal>
          </div>

          <div className="home-featured__grid">
            {featured.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 2) * 0.1}
                className={`home-card home-card--${i % 2 === 0 ? 'tall' : 'wide'}`}
              >
                <Link to={featuredContent.button.url} className="home-card__link" data-cursor={ui.cursor.view}>
                  <Media
                    src={p.cover.src}
                    ratio={i % 2 === 0 ? 0.82 : 1.35}
                    alt={p.cover.alt}
                    sizes="(max-width: 620px) 100vw, 50vw"
                    parallax={6}
                  />
                  <div className="home-card__body">
                    <span className="home-card__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="home-card__text">
                      <span className="home-card__cat">{p.category} · {p.year}</span>
                      <h3 className="home-card__name display">{p.title}</h3>
                    </span>
                    <span className="home-card__arrow" aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll-reactive marquee */}
      <Marquee className="home-marquee display" text={marquee.text} />

      {/* Services */}
      <section className="section home-services">
        <div className="section-wide">
          <div className="home-services__intro">
            <Reveal><p className="eyebrow">{services.eyebrow}</p></Reveal>
            <Reveal as="h2" delay={0.05} className="home-services__title display">
              {services.title}
            </Reveal>
          </div>
          <div className="home-services__list">
            {services.items.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="home-service">
                <motion.span
                  className="home-service__rule"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.08 }}
                />
                <span className="home-service__n">{s.n}</span>
                <h3 className="home-service__title display">{s.title}</h3>
                <p className="home-service__text">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — numbers count up when visible */}
      <section className="section home-stats">
        <div className="section-wide home-stats__grid">
          {statistics.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="home-stat">
              <CountUp value={s.value} className="home-stat__v display" />
              <span className="home-stat__l">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="home-cta">
        <div className="home-cta__media">
          <Media src={cta.image.src} ratio={null} alt={cta.image.alt} sizes="100vw" hoverZoom={false} reveal={false} parallax={10} />
        </div>
        <div className="home-cta__scrim" />
        <div className="home-cta__content">
          <Reveal><p className="eyebrow">{cta.eyebrow}</p></Reveal>
          <LineReveal
            className="home-cta__title display"
            lines={[cta.title.line1, <em key="em">{cta.title.emphasis}</em>]}
          />
          <Reveal delay={0.25}>
            <Link to={cta.button.url} className="btn btn--solid">{cta.button.label}</Link>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
