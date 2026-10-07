# Moonlight Studio

Portfolio website for **Moonlight Studio**, a luxury photography studio. Live at **https://moonlightstudioo.ir**.

React 18 · Vite 5 · React Router · Framer Motion. Fully static: images and fonts are bundled and served from our own server, with no third-party CDNs at runtime.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 (also on your LAN IP for phone testing)
npm run build        # production build → dist/
npm run preview      # serve dist/ at http://localhost:4173
```

Requires Node 18.17+. `dev` and `build` run the image pipeline first; see below.

## Editing content

**All text, links and image choices are in [`src/content/pageContent.js`](src/content/pageContent.js).** It has Persian comments for the client. You normally never need to touch a component to change content.

SEO title and description also live in [`index.html`](index.html), because the browser reads them before React loads.

## Images

Images are static assets. To add or replace an image:

1. Put the original photo (JPG/PNG/WebP, any size; ~2400px on the long side is plenty) somewhere under [`images/`](images/), e.g. `images/portfolio/vows/05.jpg`.
2. Reference it in `pageContent.js` by its path inside `images/`: `{ src: "portfolio/vows/05.jpg", alt: "…" }`.
3. Run `npm run dev` or `npm run build`. That's it.

`scripts/images.mjs` turns each source into responsive WebP files (480–2400px wide) with a content hash in the filename (`public/img/...`, cached forever by the server). It also writes a blur-up placeholder into `src/data/image-manifest.json`. Only new or changed files are processed. If `pageContent.js` points at an image that doesn't exist, the build fails with the missing path.

- `images/site/hero.jpg` is also used to generate the social preview `og-image.jpg`.
- Photos are shown in black & white by the CSS token `--img-filter` in [`src/styles/global.css`](src/styles/global.css). Set it to `none` for color.
- `public/img/`, `og-image.jpg`, `apple-touch-icon.png` and the manifest are generated. Don't edit or commit them.

## Project structure

```
images/              source photos (edit here)
public/              files copied as-is (logo.png, favicon.svg)
scripts/
  images.mjs         image pipeline
  deploy.sh          build + deploy / rollback / status
  check-prod.sh      live-site smoke test
deploy/              server config (docker-compose, nginx, cert renewal hook)
docs/                server runbook (how the shared server/proxy is set up)
src/
  content/           pageContent.js — all editable copy
  pages/             Home, Portfolio, About, Contact (+ CSS)
  components/        Navbar, Footer, Hero, PortfolioSlider, Lightbox, Media, Intro, Page …
  components/motion/ reusable animation pieces (Reveal, LineReveal, ScrollWords, Marquee, CountUp, Cursor, ScrollProgress)
  lib/motion.js      shared easing/timings (retune all animation here)
  data/images.js     image helpers (manifest lookups)
  styles/            global.css (design tokens, themes), fonts.css
```

### Design & motion

- Brand color, theme colors, spacing and the photo filter are CSS variables at the top of `global.css`.
- Animation timings and easing are in `src/lib/motion.js`. The first visit in a session shows a short branded intro. Route changes use a curtain transition.
- Visitors with *reduced motion* enabled get no movement (handled globally via `MotionConfig` and CSS).
- Hover labels such as "View" / "Drag" come from `data-cursor` attributes; their text lives in `pageContent.js` under `ui.cursor`.

## Deploying

```bash
npm run deploy                        # build, upload, switch, health-check, smoke-test
bash scripts/deploy.sh rollback       # instantly switch back to the previous release
bash scripts/deploy.sh status         # list releases on the server
npm run check:prod                    # smoke-test the live site any time
```

Deploys connect over SSH with your key (`root@5.57.39.207`, port 3939). Override with `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_DIR`.

Each deploy uploads `dist/` to a new `releases/<timestamp>-<commit>/` on the server and atomically repoints `releases/current`. There's no downtime and no container restart unless the nginx/compose config changed. If the health check fails, it rolls back automatically. The last 5 releases are kept.

### Production architecture

```
Internet ─▶ Nginx Proxy Manager (container, ports 80/443, TLS, proxy host #5, cert slot npm-31)
              └─▶ moonlight-nginx (nginx:1.27-alpine on proxy-net)
                    /opt/moonlight/releases/current   ← static site
                    /opt/moonlight/acme               ← Let's Encrypt HTTP-01 webroot
```

The server also hosts other sites (comodeconcept.ir, bergeerd.ir, snsyar.ir, runningclub.ir). Never restart or reconfigure NPM without checking them.

**SSL:** the Let's Encrypt cert renews automatically through `certbot.timer` using the HTTP-01 webroot. [`deploy/letsencrypt/moonlight-deploy-hook.sh`](deploy/letsencrypt/moonlight-deploy-hook.sh), installed in `/etc/letsencrypt/renewal-hooks/deploy/`, copies the renewed cert into NPM and reloads it.

### Troubleshooting

- **TLS error "unrecognized name" / site down over HTTPS:** check that `/opt/nginx-proxy-manager/data/nginx/proxy_host/5.conf` contains `listen 443 ssl` and the `npm-31` certificate lines. On 2026-08-22 NPM regenerated this file without its SSL block, which took the site down. A good copy is in the backups under `/root/backups/`. Restore it, then run `docker exec nginx-proxy-manager nginx -t && docker exec nginx-proxy-manager nginx -s reload`.
- Logs: `/opt/nginx-proxy-manager/data/logs/proxy-host-5_{access,error}.log`, `docker logs moonlight-nginx`, `journalctl -u certbot`.
