## Portfolio (Vite + React)

This is a Vite + React portfolio. A minimal, production-ready copy of the site lives in the `deploy/` folder so you can upload it to any host.

The site builds to `dist/`. The `deploy/` folder is regenerated from `dist/` using the scripts below.

## Update the deploy folder after changes

Any time you edit the site and want to publish the latest version:

1) Install dependencies (first time or after updates)

```bash
npm ci
```

2) Rebuild with a portable base and refresh the minimal `deploy/` folder

```bash
npm run deploy
```

That runs a production build with relative asset paths and copies only the necessary files into `deploy/`:

- `deploy/index.html`
- `deploy/assets/` (bundled JS/CSS/images/videos)
- `deploy/manifest.json`, `deploy/robots.txt`, `deploy/sitemap.xml`

Upload the contents of `deploy/` to your hosting provider.

## Commands and what they do

All commands are defined in `package.json` under `scripts`.

- `npm start`
	- Starts the dev server on http://localhost:3000 with hot reload.

- `npm test`
	- Runs the test suite via Vitest.

- `npm run build`
	- Standard Vite production build to `dist/` using the base from `vite.config.js` (currently `/portfolio-new/`). Use this for GitHub Pages under this repo name.

- `npm run build:deploy`
	- Production build to `dist/` with a portable relative base (`--base ./`). Use this when deploying the site anywhere (custom domain, subfolder, S3, etc.).

- `npm run deploy`
	- Convenience script: runs `build:deploy`, then wipes and repopulates `deploy/` from `dist/`.

- `npm run preview`
	- Serves the production build locally (useful for a quick sanity check). If your `vite.config.js` base is a subpath, you may need to open the subpath URL.

## Notes on base paths

- GitHub Pages under this repository: keep `vite.config.js` base as `/portfolio-new/` and use `npm run build` (output expects that subpath).
- Any other host or path: use `npm run build:deploy` or just `npm run deploy` to ensure assets use relative paths and work from any folder.

## Troubleshooting

- Seeing 404s for JS/CSS after upload? Rebuild with `npm run build:deploy` (relative paths) and re-upload the `deploy/` contents.
- SPA routing (client-side routes) showing 404s on refresh? Enable a fallback to `index.html` on your host (Netlify `_redirects`, Cloudflare Pages/Vercel setting, S3 static website error document).
- Preview server already running? Free the port and restart preview.

## Learn more

- Vite: https://vitejs.dev/guide/
- Vitest: https://vitest.dev/guide/
- React: https://react.dev/
