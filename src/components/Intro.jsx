import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import content from '../content/pageContent'
import { INTRO_DURATION, SHOW_INTRO, ease, easeCurtain } from '../lib/motion'
import './Intro.css'

/** Brief branded preloader shown on the first visit of a session. */
export default function Intro() {
  const [visible, setVisible] = useState(SHOW_INTRO)

  useEffect(() => {
    if (!visible) return undefined
    const t = setTimeout(() => setVisible(false), (INTRO_DURATION - 0.6) * 1000)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro"
          aria-hidden="true"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: easeCurtain }}
        >
          <motion.img
            className="intro__logo"
            src={content.site.logo.src}
            alt=""
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.8, ease }}
          />
          <motion.span
            className="intro__line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTRO_DURATION - 0.7, ease: easeCurtain, delay: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
