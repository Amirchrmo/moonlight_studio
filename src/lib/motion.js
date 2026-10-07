/**
 * Shared motion settings. Tweak timings here to retune the whole site.
 */

/** Soft "expo-out" — default for reveals and UI. */
export const ease = [0.22, 1, 0.36, 1]
/** Symmetric in-out — curtains / page transitions. */
export const easeCurtain = [0.76, 0, 0.24, 1]

/** Page transition timings (seconds). */
export const PAGE_EXIT = 0.55
export const PAGE_ENTER = 0.7

/** Intro preloader plays once per browser session. */
const INTRO_KEY = 'moonlight-intro-seen'
export const INTRO_DURATION = 1.7

function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem(INTRO_KEY)) return false
    sessionStorage.setItem(INTRO_KEY, '1')
    return true
  } catch {
    return false
  }
}

export const SHOW_INTRO = shouldShowIntro()

/** Extra delay for first-paint animations so they start as the intro lifts. */
export const INTRO_DELAY = SHOW_INTRO ? INTRO_DURATION - 0.25 : 0
