import Page from '../components/Page'
import Media from '../components/Media'
import Reveal from '../components/Reveal'
import content from '../content/pageContent'
import './About.css'

const { header, heroImage, story, vision, values, behindTheScenes, team } = content.about

export default function About() {
  return (
    <Page>
      {/* Intro */}
      <header className="ab-head section">
        <div className="section-wide">
          <Reveal><p className="eyebrow">{header.eyebrow}</p></Reveal>
          <Reveal as="h1" delay={0.05} className="ab-head__title display">
            {header.title.lead}<br />{header.title.beforeEmphasis}<em>{header.title.emphasis}</em>
          </Reveal>
        </div>
      </header>

      <div className="ab-hero-media section-wide">
        <Reveal>
          <Media id={heroImage.src} ratio={2.2} alt={heroImage.alt} sizes="100vw" width={1920} priority hoverZoom={false} />
        </Reveal>
      </div>

      {/* Our Story */}
      <section className="section ab-block">
        <div className="section-wide ab-two">
          <Reveal className="ab-two__label">
            <span className="ab-index">{story.index}</span>
            <h2 className="ab-two__title display">{story.title}</h2>
          </Reveal>
          <Reveal delay={0.08} className="ab-two__body">
            {story.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Our Vision */}
      <section className="ab-vision">
        <div className="ab-vision__media">
          <Media id={vision.image.src} ratio={1.4} alt={vision.image.alt} sizes="(max-width: 900px) 100vw, 45vw" width={1100} />
        </div>
        <Reveal className="ab-vision__content">
          <span className="ab-index">{vision.index}</span>
          <h2 className="ab-vision__title display">{vision.title}</h2>
          <p>{vision.paragraph}</p>
          <blockquote className="ab-quote">
            "{vision.quote}"
          </blockquote>
        </Reveal>
      </section>

      {/* Values */}
      <section className="section ab-values">
        <div className="section-wide">
          <Reveal as="h2" className="ab-values__title display">{values.title}</Reveal>
          <div className="ab-values__grid">
            {values.items.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="ab-value">
                <h3 className="ab-value__title display">{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="section ab-bts">
        <div className="section-wide">
          <Reveal className="ab-bts__head">
            <span className="ab-index">{behindTheScenes.index}</span>
            <h2 className="ab-bts__title display">{behindTheScenes.title}</h2>
            <p className="ab-bts__sub">
              {behindTheScenes.subtitle}
            </p>
          </Reveal>
          <div className="ab-bts__grid">
            {behindTheScenes.images.map((image, i) => (
              <Reveal
                key={i}
                delay={(i % 3) * 0.06}
                className={`ab-bts__item ${i % 5 === 0 ? 'is-wide' : ''}`}
              >
                <Media id={image.src} ratio={i % 5 === 0 ? 1.7 : 1} alt={image.alt} sizes="(max-width: 700px) 50vw, 33vw" width={800} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Studio */}
      <section className="section ab-team">
        <div className="section-wide">
          <Reveal className="ab-team__head">
            <span className="ab-index">{team.index}</span>
            <h2 className="ab-team__title display">{team.title}</h2>
          </Reveal>
          <div className="ab-team__grid">
            {team.members.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06} className="ab-member">
                <div className="ab-member__photo">
                  <Media id={m.image.src} ratio={0.82} alt={m.image.alt} sizes="(max-width: 700px) 50vw, 25vw" width={700} />
                </div>
                <h3 className="ab-member__name display">{m.name}</h3>
                <span className="ab-member__role">{m.role}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
