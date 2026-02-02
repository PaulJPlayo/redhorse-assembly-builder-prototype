# Cloudflare Deployment (OpenNext)

Use OpenNext for Cloudflare Workers for deployment.

Build:
- `npm run build:cf`

Deploy:
- `npm run deploy:cf`

Notes:
- `wrangler.jsonc` configures the Worker entrypoint and assets.
- Ensure Node.js version is set to 20 in Cloudflare Pages settings if using Pages for CI builds.
