import { Link } from 'react-router-dom'
import content from '../content/pageContent'
import LineReveal from './motion/LineReveal'
import Marquee from './motion/Marquee'
import './Footer.css'

const YEAR = new Date().getFullYear()
const { footer, contactInfo } = content

/** Renders a footer link that is internal (react-router) or external/protocol. */
function FooterLink({ item }) {
  const isRoute = item.url.startsWith('/')
  if (isRoute) return <Link to={item.url}>{item.label}</Link>
  return (
    <a
      href={item.url}
      {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {item.label}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__top section-wide">
        <div className="footer__lead">
          <p className="eyebrow">{footer.eyebrow}</p>
          <LineReveal
            className="footer__headline display"
            lines={[footer.headline.line1, <em key="l2">{footer.headline.line2}</em>]}
          />
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h3 className="footer__col-title">{footer.quickLinks.title}</h3>
            <ul>
              {footer.quickLinks.items.map((item) => (
                <li key={item.label}><FooterLink item={item} /></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{footer.studioColumn.title}</h3>
            <ul>
              <li>
                <a href={contactInfo.instagram.url} target="_blank" rel="noreferrer">
                  {footer.studioColumn.instagramLabel}
                </a>
              </li>
              <li><a href={`tel:${contactInfo.phone.tel}`}>{contactInfo.phone.value}</a></li>
              <li><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{footer.visitColumn.title}</h3>
            <ul>
              <li>{contactInfo.address.line1}</li>
              <li>{contactInfo.address.line2}</li>
              <li>{contactInfo.address.note}</li>
            </ul>
          </div>
        </div>
      </div>

      <Marquee className="footer__wordmark display" text={`${footer.wordmark} · `} baseVelocity={-1.2} />

      <div className="footer__base section-wide">
        <span>© {YEAR} {footer.base.copyrightSuffix}</span>
        <span className="footer__base-mark">{footer.base.mark}</span>
        <span className="footer__base-end">
          <span>{footer.base.tagline}</span>
          <button className="footer__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {footer.base.backToTop} <span aria-hidden="true">↑</span>
          </button>
        </span>
      </div>
    </footer>
  )
}
