# Moonlight Studio

A premium, fully responsive website for **Moonlight Studio**, a luxury photography studio.
Cinematic, editorial, and timeless — built with React + Vite.

## Highlights

- **Fullscreen cinematic hero** with parallax and staggered headline reveal
- **Immersive fullscreen portfolio slider** (autoplay, Ken Burns zoom, keyboard + progress bars)
- **Portfolio page** with animated category filters (Commercial, Portrait, Fashion, Wedding, Birthday, Couple, Kids) and a fullscreen lightbox gallery
- **About page** — Our Story, Our Vision, Behind the Scenes, Meet the Studio
- **Dark & light themes** with a persisted toggle (respects system preference)
- **Glassmorphism pill buttons**, soft blur, subtle brand glow, premium micro-interactions
- Cormorant Garamond (headings) + Inter (body)
- Premium **black & white** placeholder imagery throughout
- Performance & a11y: lazy loading, blur-up images, responsive `srcSet`, route code-splitting, reduced-motion support, skip link, SEO meta + JSON-LD

## Brand

- Primary: `#923125` (used subtly for accents, hovers, active states)
- Secondary: `#FFFFFF` — palette otherwise monochrome

## Tech

React 18 · Vite 5 · React Router · Framer Motion

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  components/   Navbar, Footer, Hero, PortfolioSlider, Lightbox, Media, ThemeToggle, Reveal, ...
  pages/        Home, Portfolio, About
  context/      ThemeContext (dark/light)
  data/         portfolio.js (projects + categories), images.js (image helpers)
  styles/       global.css (design tokens + themes)
```

> Placeholder photography is loaded from picsum.photos with a grayscale filter.
> Swap the image IDs in `src/data/portfolio.js` / `images.js` for real work.
