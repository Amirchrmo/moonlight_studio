import { motion } from 'framer-motion'
import { ease } from '../../lib/motion'

/**
 * Scroll-triggered reveal. Fades + lifts content into view once
 * (reduced-motion is honored globally via <MotionConfig reducedMotion="user">).
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  className = '',
  amount = 0.25,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
