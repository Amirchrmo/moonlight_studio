import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { INTRO_DELAY, ease } from '../lib/motion'
import content from '../content/pageContent'
import './Navbar.css'

const { navigation, site, ui } = content

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  // Only the home page opens on a dark full-bleed hero that needs light nav text.
  const overHero = location.pathname === '/'

  // Solid bar once scrolled; tuck away while scrolling down, return on scroll up.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320)
        lastY = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on route change and lock scroll while open.
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''} ${hidden && !open ? 'nav--hidden' : ''} ${overHero ? 'nav--over-hero' : ''}`}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: INTRO_DELAY + 0.1 }}
    >
      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label={ui.nav.brandAria}>
          <img src={site.logo.src} alt={site.logo.alt} className="nav__logo" width="180" height="42" />
        </Link>

        <nav className="nav__links" aria-label={ui.nav.primaryNavAria}>
          {navigation.map((l) => (
            <NavLink
              key={l.url}
              to={l.url}
              end={l.end}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <ThemeToggle />
          <button
            className="nav__burger"
            aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div className="nav__mobile" aria-hidden={!open}>
        <nav className="nav__mobile-links" aria-label={ui.nav.mobileNavAria}>
          {navigation.map((l, i) => (
            <NavLink
              key={l.url}
              to={l.url}
              end={l.end}
              className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}
              style={{ transitionDelay: `${0.08 + i * 0.06}s` }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
