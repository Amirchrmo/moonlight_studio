import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PAGE_ENTER, PAGE_EXIT, ease, easeCurtain } from '../lib/motion'

// The very first page render is covered by the intro (or needs no transition).
let firstMount = true

/**
 * Wraps each route. On navigation a dark curtain sweeps up over the old page,
 * the route swaps (and scrolls to top) underneath, then the curtain lifts off
 * the new page.
 */
export default function Page({ children }) {
  const isFirst = firstMount
  useEffect(() => {
    firstMount = false
  }, [])

  return (
    <>
      <motion.div
        className="curtain curtain--in"
        aria-hidden="true"
        initial={isFirst ? false : { scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: PAGE_ENTER, ease: easeCurtain }}
      />
      <motion.div
        className="curtain curtain--out"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: PAGE_EXIT, ease: easeCurtain }}
      />
      <motion.div
        initial={isFirst ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: PAGE_ENTER, ease, delay: isFirst ? 0 : 0.15 }}
      >
        {children}
      </motion.div>
    </>
  )
}
