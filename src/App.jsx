import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Cursor from './components/motion/Cursor'
import ScrollProgress from './components/motion/ScrollProgress'
import content from './content/pageContent'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()

  return (
    <>
      <a href="#main" className="skip-link">{content.ui.skipToContent}</a>
      <Intro />
      <ScrollProgress />
      <Cursor />
      <Navbar />
      {/* Footer lives inside the transition so it never flashes between pages.
          Scroll resets while the curtain covers the screen. */}
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}>
        <div key={location.pathname}>
          <main id="main">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AnimatePresence>
    </>
  )
}
