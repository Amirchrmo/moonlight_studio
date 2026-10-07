import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './motion.css'

/**
 * Statement whose words "light up" one by one as it scrolls through the
 * viewport. `parts` is a list of { text, em? } — `em` parts are italic/brand.
 */
export default function ScrollWords({ parts, as = 'h2', className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const Tag = as

  const words = parts.flatMap((p) =>
    p.text
      .split(/(\s+)/)
      .filter((w) => w.trim())
      .map((w) => ({ w, em: p.em }))
  )

  return (
    <Tag ref={ref} className={`scroll-words ${className}`}>
      <span className="sr-only">{parts.map((p) => p.text).join('')}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} em={word.em}>
            {word.w}
          </Word>
        ))}
      </span>
    </Tag>
  )
}

function Word({ children, progress, range, em }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const Inner = em ? 'em' : 'span'
  return (
    <>
      <motion.span className="scroll-words__word" style={{ opacity }}>
        <Inner>{children}</Inner>
      </motion.span>{' '}
    </>
  )
}
