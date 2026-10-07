import Page from '../components/Page'
import Media from '../components/Media'
import Reveal from '../components/motion/Reveal'
import LineReveal from '../components/motion/LineReveal'
import content from '../content/pageContent'
import './Contact.css'

const { contactInfo } = content
const { header, labels, hours, visual, cta } = content.contact

/* Inline SVG icons kept in the component (visual assets, not editable copy),
   selected by a key that comes from the content data. */
const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  phone: (
    <path
      d="M6.5 3.5 9 4l1 3-1.7 1.3a12 12 0 0 0 5.4 5.4L15 12l3 1 .5 2.5A2 2 0 0 1 16.4 18 13 13 0 0 1 6 7.6 2 2 0 0 1 6.5 3.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  address: (
    <>
      <path
        d="M12 21s6.5-5.2 6.5-10a6.5 6.5 0 0 0-13 0C5.5 15.8 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
}

// Built from the shared contactInfo block so the studio's details live in one place.
const DETAILS = [
  { key: 'instagram', label: labels.instagram, value: contactInfo.instagram.value, href: contactInfo.instagram.url, external: true },
  { key: 'phone', label: labels.phone, value: contactInfo.phone.value, href: `tel:${contactInfo.phone.tel}`, external: false },
  { key: 'address', label: labels.address, value: contactInfo.address.full, href: contactInfo.address.mapUrl, external: true },
]

export default function Contact() {
  return (
    <Page>
      <header className="ct-head section">
        <div className="section-wide">
          <Reveal><p className="eyebrow">{header.eyebrow}</p></Reveal>
          <LineReveal
            as="h1"
            immediate
            delay={0.25}
            className="ct-head__title display"
            lines={[header.title.line1, <em key="em">{header.title.emphasis}</em>]}
          />
          <Reveal delay={0.12} className="ct-head__sub">
            {header.subtitle}
          </Reveal>
        </div>
      </header>

      <section className="ct-main section-wide">
        {/* Contact details */}
        <div className="ct-details">
          {DETAILS.map((d, i) => (
            <Reveal key={d.key} delay={i * 0.08}>
              <a
                className="ct-card"
                href={d.href}
                {...(d.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="ct-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22">{ICONS[d.key]}</svg>
                </span>
                <span className="ct-card__text">
                  <span className="ct-card__label">{d.label}</span>
                  <span className="ct-card__value">{d.value}</span>
                </span>
                <span className="ct-card__arrow" aria-hidden="true">↗</span>
              </a>
            </Reveal>
          ))}

          <Reveal delay={0.3} className="ct-hours">
            <span className="ct-hours__label">{hours.label}</span>
            {hours.lines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </Reveal>
        </div>

        {/* Cinematic visual */}
        <Reveal delay={0.1} className="ct-visual">
          <Media src={visual.image.src} ratio={0.82} alt={visual.image.alt} sizes="(max-width: 900px) 100vw, 42vw" priority hoverZoom={false} />
          <div className="ct-visual__caption">
            <span>{visual.captionLeft}</span>
            <span>{visual.captionRight}</span>
          </div>
        </Reveal>
      </section>

      {/* Map / directions band */}
      <section className="section ct-cta">
        <div className="section-wide ct-cta__inner">
          <LineReveal className="ct-cta__title display" lines={[cta.title]} />
          <Reveal delay={0.08}>
            <a href={`mailto:${contactInfo.email}`} className="btn btn--solid">
              {contactInfo.email}
            </a>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
