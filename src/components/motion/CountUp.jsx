import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a numeric string up from zero when it scrolls into view.
 * Keeps any prefix/suffix, e.g. "480+" → 0+ … 480+.
 */
export default function CountUp({ value, duration = 1.8, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [, prefix = '', num = '', suffix = ''] = String(value).match(/^(\D*)(\d+)(.*)$/) || []
  const target = Number(num)
  const [shown, setShown] = useState(num ? 0 : value)

  useEffect(() => {
    if (!num || !inView) return undefined
    if (reduce) {
      setShown(target)
      return undefined
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, num, target, duration, reduce])

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {num ? `${prefix}${shown}${suffix}` : value}
    </span>
  )
}
