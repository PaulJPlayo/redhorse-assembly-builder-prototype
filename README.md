This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How to Deploy

One-time setup (Node 20 is required for Cloudflare builds):

```bash
nvm install
nvm use
```

Cloudflare Pages: set Node.js version to 20 in **Pages → Project → Settings → Build & deployments → Build configuration → Node.js version**.

One-command deployment flow (commit + push + optional status check):

```bash
npm run deploy
```

Notes:
- You will be prompted for a commit message if one is not provided.
- The deploy flow runs `npm run build:cf` (OpenNext) and aborts on failures.
- If the working tree is dirty after commit, deploy will stop and show the diff.

Optional helpers:

```bash
# Commit only (prompts for message)
npm run deploy:commit

# Push only (requires clean working tree)
npm run deploy:push

# Check Cloudflare auth
npm run cf:whoami

# Check deployment status (Workers/Pages; requires CLOUDFLARE_API_TOKEN)
npm run deploy:status
```

To enable deployment status checks, create a Cloudflare API token with Workers/Pages read access and add it to `.env.local`:

```
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_PAGES_PROJECT=redhorse-assembly-builder-prototype
CLOUDFLARE_WORKER_NAME=redhorse-assembly-builder-prototype
CLOUDFLARE_WORKER_URL=https://<your-worker>.workers.dev/assembly
```

OpenNext (Cloudflare) build + deploy:

```bash
npm run build:cf
npm run deploy:cf
```

Cloudflare settings:
- Node.js version: **20** (Pages → Project → Settings → Build & deployments → Build configuration → Node.js version)
- Workers: ensure the Wrangler project name matches `wrangler.jsonc` (`redhorse-assembly-builder-prototype` by default).

### GitHub Actions Deploy (manual only)

This repo includes a manual workflow to deploy the OpenNext Cloudflare Worker if needed.

Required GitHub Secrets (Repository → Settings → Secrets and variables → Actions):
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Deployment Source of Truth

Deployments are handled by Cloudflare Workers Builds on push to `main`.

- Worker URL: https://redhorse-assembly-builder.oraclecoding8.workers.dev/assembly
- Pages fallback URL: https://redhorse-assembly-builder-prototype.pages.dev/assembly
- GitHub Actions deploy workflow is manual-only for emergency use.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
