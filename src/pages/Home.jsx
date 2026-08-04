import { Link } from 'react-router-dom'
import Page from '../components/Page'
import Hero from '../components/Hero'
import PortfolioSlider from '../components/PortfolioSlider'
import Reveal from '../components/Reveal'
import Media from '../components/Media'
import content from '../content/pageContent'
import './Home.css'

const { home, portfolio } = content
const { intro, featured: featuredContent, marquee, services, statistics, cta } = home

export default function Home() {
  const featured = portfolio.projects.slice(0, 4)

  return (
    <Page>
      <Hero />
      <PortfolioSlider />

      {/* Philosophy statement */}
      <section className="section home-intro">
        <div className="section-wide home-intro__grid">
          <Reveal className="home-intro__eyebrow">
            <p className="eyebrow">{intro.eyebrow}</p>
          </Reveal>
          <Reveal as="h2" delay={0.05} className="home-intro__statement display">
            {intro.statement.before}<em>{intro.statement.emphasis}</em>{intro.statement.after}
          </Reveal>
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
            <Reveal as="h2" className="home-featured__title display">{featuredContent.title}</Reveal>
            <Reveal delay={0.1}>
              <Link to={featuredContent.button.url} className="btn">{featuredContent.button.label}</Link>
            </Reveal>
          </div>

          <div className="home-featured__grid">
            {featured.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 0.08}
                className={`home-card home-card--${i % 2 === 0 ? 'tall' : 'wide'}`}
              >
                <Link to={featuredContent.button.url} className="home-card__link">
                  <Media
                    id={p.cover.src}
                    ratio={i % 2 === 0 ? 0.82 : 1.35}
                    alt={p.cover.alt}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    width={1200}
                  />
                  <div className="home-card__body">
                    <span className="home-card__cat">{p.category} · {p.year}</span>
                    <h3 className="home-card__name display">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="home-marquee__group">
              {marquee.text}
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="section home-services">
        <div className="section-wide">
          <Reveal className="home-services__intro">
            <p className="eyebrow">{services.eyebrow}</p>
            <h2 className="home-services__title display">
              {services.title}
            </h2>
          </Reveal>
          <div className="home-services__list">
            {services.items.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06} className="home-service">
                <span className="home-service__n">{s.n}</span>
                <h3 className="home-service__title display">{s.title}</h3>
                <p className="home-service__text">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section home-stats">
        <div className="section-wide home-stats__grid">
          {statistics.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="home-stat">
              <span className="home-stat__v display">{s.value}</span>
              <span className="home-stat__l">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="home-cta">
        <div className="home-cta__media">
          <Media id={cta.image.src} ratio={2.4} alt={cta.image.alt} sizes="100vw" width={1920} hoverZoom={false} />
        </div>
        <div className="home-cta__scrim" />
        <Reveal className="home-cta__content">
          <p className="eyebrow">{cta.eyebrow}</p>
          <h2 className="home-cta__title display">
            {cta.title.line1}<br /><em>{cta.title.emphasis}</em>
          </h2>
          <Link to={cta.button.url} className="btn btn--solid">{cta.button.label}</Link>
        </Reveal>
      </section>
    </Page>
  )
}
