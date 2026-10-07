import Page from '../components/Page'
import Media from '../components/Media'
import Reveal from '../components/motion/Reveal'
import LineReveal from '../components/motion/LineReveal'
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
          <LineReveal
            as="h1"
            immediate
            delay={0.25}
            className="ab-head__title display"
            lines={[header.title.lead, <>{header.title.beforeEmphasis}<em>{header.title.emphasis}</em></>]}
          />
        </div>
      </header>

      <div className="ab-hero-media section-wide">
        <Media src={heroImage.src} ratio={2.2} alt={heroImage.alt} sizes="100vw" priority hoverZoom={false} parallax={8} />
      </div>

      {/* Our Story */}
      <section className="section ab-block">
        <div className="section-wide ab-two">
          <Reveal className="ab-two__label">
            <span className="ab-index">{story.index}</span>
            <LineReveal className="ab-two__title display" lines={[story.title]} />
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
          <Media src={vision.image.src} ratio={1.4} alt={vision.image.alt} sizes="(max-width: 900px) 100vw, 45vw" parallax={8} hoverZoom={false} />
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
          <LineReveal className="ab-values__title display" lines={[values.title]} />
          <div className="ab-values__grid">
            {values.items.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="ab-value">
                <span className="ab-value__n">{String(i + 1).padStart(2, '0')}</span>
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
            <LineReveal className="ab-bts__title display" lines={[behindTheScenes.title]} />
            <p className="ab-bts__sub">
              {behindTheScenes.subtitle}
            </p>
          </Reveal>
          <div className="ab-bts__grid">
            {behindTheScenes.images.map((image, i) => (
              <Reveal
                key={image.src + i}
                delay={(i % 3) * 0.08}
                className={`ab-bts__item ${i % 4 === 0 || i % 4 === 3 ? 'is-wide' : ''}`}
              >
                <Media src={image.src} ratio={null} alt={image.alt} sizes="(max-width: 700px) 50vw, 33vw" />
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
            <LineReveal className="ab-team__title display" lines={[team.title]} />
          </Reveal>
          <div className="ab-team__grid">
            {team.members.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06} className="ab-member">
                <div className="ab-member__photo">
                  <Media src={m.image.src} ratio={0.82} alt={m.image.alt} sizes="(max-width: 700px) 50vw, 25vw" />
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
