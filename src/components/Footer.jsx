import { Link } from 'react-router-dom'
import content from '../content/pageContent'
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
          <h2 className="footer__headline display">
            {footer.headline.line1}<br />{footer.headline.line2}
          </h2>
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

      <div className="footer__base section-wide">
        <span>© {YEAR} {footer.base.copyrightSuffix}</span>
        <span className="footer__base-mark">{footer.base.mark}</span>
        <span>{footer.base.tagline}</span>
      </div>
    </footer>
  )
}
