import content from '../content/pageContent'
import './Loader.css'

export default function Loader({ inline = false }) {
  return (
    <div className={`loader ${inline ? 'loader--inline' : ''}`} role="status" aria-live="polite">
      <span className="loader__mark">
        <span className="loader__moon" />
      </span>
      <span className="sr-only">{content.ui.loading}</span>
    </div>
  )
}
