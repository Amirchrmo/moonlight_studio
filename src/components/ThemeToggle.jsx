import { useTheme } from '../context/ThemeContext'
import content from '../content/pageContent'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? content.ui.theme.switchToLight : content.ui.theme.switchToDark

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb" data-dark={isDark}>
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
            {isDark ? (
              <path
                fill="currentColor"
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
              />
            ) : (
              <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
                <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
              </g>
            )}
          </svg>
        </span>
      </span>
    </button>
  )
}
