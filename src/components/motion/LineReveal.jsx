import { motion } from 'framer-motion'
import { ease } from '../../lib/motion'
import './motion.css'

/**
 * Headline whose lines slide up from behind a mask, one after another.
 *
 *   <LineReveal as="h1" className="display" lines={['A decade of', <em>quiet obsession.</em>]} />
 *
 * `immediate` animates on mount (e.g. hero) instead of when scrolled into view.
 */
export default function LineReveal({
  lines,
  as = 'h2',
  className = '',
  delay = 0,
  stagger = 0.1,
  immediate = false,
}) {
  const Tag = motion[as] || motion.h2
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.4 } }

  return (
    <Tag className={`line-reveal ${className}`} initial="hide" {...trigger}>
      {lines.map((line, i) => (
        <span className="line-reveal__mask" key={i}>
          <motion.span
            className="line-reveal__line"
            variants={{ hide: { y: '115%' }, show: { y: '0%' } }}
            transition={{ duration: 1.05, ease, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
