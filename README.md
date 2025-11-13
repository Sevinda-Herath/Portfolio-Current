## Portfolio — Desktop-Style React App (Vite)

A personal portfolio presented as a mini desktop environment. It simulates a Linux boot, shows a GNOME-like login, and then launches a windowed desktop where you can open apps: About, Projects, and Contact. Built with React and Vite, with attention to smooth interactions, responsiveness, and accessibility.

- Live demo: https://sevinda-herath.is-a.dev
- Source: https://github.com/Sevinda-Herath/portfolio-new

## What You See

- Boot sequence: brief GRUB menu followed by a Debian-style boot log.
- Login screen: clock, animated username/password typing, and a Sign In button.
- Desktop: video wallpaper, top bar clock, welcome overlay, and three icons:
	- About: profile, overview, and skills.
	- Projects: searchable, tag-filterable project list with links.
	- Contact: email copy/send, GitHub and LinkedIn links.

## How It Works

- Flow (first visit): GRUB → Debian boot → Login → Desktop.
	- Subsequent visits skip boot/login using `localStorage` flags:
		- `portfolio_hasBootedOnce`
		- `portfolio_hasLoggedInOnce`
- Background media is preloaded (`preloadVideos`) to reduce visual delays.
- Window system:
	- Open one window per app; brings to front on focus.
	- Drag, resize from edges/corners, maximize/restore.
	- Snap to halves/quarters when near screen edges; dock shows minimized apps.
	- Mobile mode simplifies behavior (no drag/resize); smooth open/close animations.
- Accessibility: semantic roles, ARIA labels, live regions for time, keyboard focus handling.

## Tech Stack

- React 18 + Vite 6
- CSS modules (plain CSS files) for styling
- Vitest + Testing Library (`jsdom`) for tests
- Web App Manifest and basic icons/metadata (not a full PWA install flow)

## Local Development

```bash
npm ci
npm start
```

- Dev server runs at `http://localhost:3000` with hot reload.

## Build and Deploy

Standard build (for GitHub Pages at `/portfolio-new/`):

```bash
npm run build
```

Portable build and populate `deploy/` (works on any host/path):

```bash
npm run deploy
```

This produces `dist/` and then copies a minimal set into `deploy/`:

- `deploy/index.html`
- `deploy/assets/` (bundled JS/CSS/images/videos)
- `deploy/manifest.json`, `deploy/robots.txt`, `deploy/sitemap.xml`

Upload the contents of `deploy/` to your hosting provider.

Notes on base paths:

- GitHub Pages under this repo: keep Vite base as `/portfolio-new/` and use `npm run build`.
- Any other host/subpath: use `npm run build:deploy` or simply `npm run deploy` (uses relative asset paths).

## Resetting the Experience

- Click the power icon in the top bar → Power Off to trigger a shutdown log; it clears `localStorage` and redirects.
- Or manually clear the two `localStorage` keys shown above to see the boot/login again.

## Project Structure (high level)

- `src/components/boot/*`: GRUB + Debian boot screens.
- `src/components/login/*`: GNOME-like login screen.
- `src/components/desktop/*`: Desktop, top bar, icons, and generic `AppWindow`.
- `src/components/apps/*`: App content for About, Projects, Contact.
- `src/components/shutdown/*`: Power-off confirmation and shutdown log.
- `src/utils/preloadMedia.js`: Video preloader helper.

## Commands

Defined in `package.json` under `scripts`:

- `npm start`: dev server with HMR on port 3000.
- `npm test`: run tests with Vitest.
- `npm run build`: production build to `dist/` using Vite base in `vite.config.js`.
- `npm run build:deploy`: production build with relative base (`--base ./`).
- `npm run deploy`: build with relative base and refresh `deploy/` from `dist/`.
- `npm run preview`: locally serve the production build.

## Troubleshooting

- Missing JS/CSS after upload? Rebuild with `npm run build:deploy` and re-upload `deploy/`.
- SPA refresh 404s? Configure your host to fallback to `index.html`.
- Preview port busy? Stop the other server or change the port.

## License

See `LICENSE` for details.
