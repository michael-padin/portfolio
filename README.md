# michaelpadin.com

Personal portfolio

Built as a Turborepo monorepo with a Next.js 16 frontend and Sanity v5 CMS.

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| **Framework**  | Next.js 16 (App Router)                      |
| **Language**   | TypeScript 6                                 |
| **Styling**    | Tailwind CSS v4                              |
| **CMS**        | Sanity v5 (headless)                         |
| **AI Chatbot** | Claude API (Haiku) via `@anthropic-ai/sdk`   |
| **Email**      | Resend                                       |
| **Validation** | Zod v4                                       |
| **CAPTCHA**    | Cloudflare Turnstile                         |
| **Analytics**  | Vercel Analytics, Speed Insights, GA4, Umami |
| **Linting**    | oxlint                                       |
| **Formatting** | oxfmt                                        |
| **Monorepo**   | Turborepo + pnpm workspaces                  |

## Project Structure

```
apps/
  web/          → Next.js portfolio site
  studio/       → Sanity Studio CMS
packages/
  config-typescript/  → Shared TypeScript configs
  sanity-schemas/     → Shared Sanity schema definitions
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Install

```bash
pnpm install
```

### Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example apps/web/.env.local
```

See `.env.example` for all available variables. The site works without any env vars — it uses hardcoded fallback data when Sanity is not configured.

### Development

```bash
pnpm dev
```

This starts the Next.js dev server (web) and Sanity Studio (studio) concurrently via Turborepo.

### Build

```bash
pnpm build
```

### Lint & Format

```bash
pnpm lint          # Check with oxlint
pnpm lint:fix      # Auto-fix lint issues
pnpm format        # Check formatting with oxfmt
pnpm format:fix    # Auto-fix formatting
```

### Type Check

```bash
pnpm type-check
```

## Feature Flags

Features can be toggled via environment variables. All default to **disabled**.

| Flag                         | Controls                                   |
| ---------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_ENABLE_CHATBOT` | AI chatbot (requires `ANTHROPIC_API_KEY`)  |
| `NEXT_PUBLIC_ENABLE_BLOG`    | Blog pages (requires Sanity content)       |
| `NEXT_PUBLIC_ENABLE_CONTACT` | Contact form (requires Resend + Turnstile) |

When a feature is disabled:

- Pages return 404
- API routes return 404
- Nav links and homepage sections are hidden
- Sitemap excludes disabled routes

## Architecture

### CMS (Sanity)

The site gracefully degrades when Sanity is not configured:

- Profile data falls back to `FALLBACK_PROFILE` in `lib/sanity.ts`
- Project/blog fetches return empty arrays
- No runtime errors — the site renders fully with static data

### Security

- **CSP headers** — Content Security Policy configured in `next.config.ts`
- **Security headers** — HSTS, X-Frame-Options, Permissions-Policy, etc.
- **API rate limiting** — `proxy.ts` enforces per-IP limits (10 req/min chat, 5 req/min contact)
- **Cloudflare integration** — Reads `cf-connecting-ip` for real client IP
- **Turnstile CAPTCHA** — Protects contact form from bots
- **Honeypot field** — Secondary bot detection on contact form
- **Prompt injection guards** — Regex patterns block common injection attempts on the chat API
- **Input validation** — Zod schemas on all API inputs

### Monitoring

- **Vercel Analytics** — Page views and web vitals
- **Vercel Speed Insights** — Core Web Vitals monitoring
- **Google Analytics 4** — Via `@next/third-parties` (optional)
- **Umami** — Privacy-first analytics, no cookies (optional)
- **Structured logging** — JSON logs in production via `lib/logger.ts`

## Deployment

Designed for Vercel. Connect the repo and set environment variables in the Vercel dashboard.

**Recommended: Put Cloudflare in front of Vercel** for DDoS protection, WAF rules, and edge rate limiting at no cost.

### Minimal Deploy (no services)

Set no env vars — the site deploys with fallback data, all optional features disabled.

### Full Deploy

Set all env vars from `.env.example` and enable features as needed.

## License

Private. All rights reserved.
