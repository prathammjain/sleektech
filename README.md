# SleekTech

Marketing site and internal admin dashboard for **SleekTech**, a software engineering collective.
Live at [sleektech.in](https://www.sleektech.in).

Built with **Next.js 16** (App Router, Turbopack), **React 19**, **Framer Motion**, and
**Supabase** (Postgres + Storage). Hand-rolled CSS design system, no UI framework.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, custom CSS (`globals.css`), Framer Motion (`motion`) |
| Backend | Supabase (Postgres + Storage), Next.js Route Handlers |
| Auth (admin) | Shared-password gate via `proxy.ts` + signed cookie |
| Hosting | Vercel |

> Next.js 16 note: middleware is the `src/proxy.ts` file convention (not `middleware.ts`),
> and `cookies()` / route-handler `params` are async.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev                         # http://localhost:7001
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Environment variables

Set these in `.env.local` for local dev and in **Vercel → Settings → Environment Variables**
for production (see `.env.local.example`):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, e.g. `https://xxxx.supabase.co` (no path) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret** key (server-only, bypasses RLS) |
| `ADMIN_PASSWORD` | Shared password protecting `/admin` |

Until these are set the public site works fully; only form submissions and `/admin` stay inert.

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase-schema.sql`](./supabase-schema.sql) in the SQL editor (tables, enums, RLS,
   and the private `resumes` storage bucket).
3. Add the env vars above and redeploy.

All database access goes through server code using the service-role key; RLS is on with no public
policies, so nothing is readable without that key.

## Project structure

```
src/
  app/
    page.tsx              Landing page
    layout.tsx            Root layout, metadata, fonts, structured data
    opengraph-image.tsx   Dynamic OG / Twitter social cards
    robots.ts sitemap.ts manifest.ts icon.tsx   SEO + PWA
    admin/                Password-gated dashboard (route group)
    api/                  Route handlers (leads, applications, admin)
  components/
    ai/                   Live demos (workflow, agent console, chatbot)
    motion/               Reveal + RotatingWord primitives
    admin/                Dashboard shell + controls
  lib/
    site.ts               SEO / brand config (single source of truth)
    supabase/server.ts    Service-role client (server-only)
    auth.ts types.ts format.ts admin-data.ts
  proxy.ts                Auth gate for /admin (Next 16 middleware)
```

## SEO

Centralised in [`src/lib/site.ts`](./src/lib/site.ts): metadata, Open Graph / Twitter cards
(dynamic image via `next/og`), JSON-LD (`Organization`, `WebSite`, `ProfessionalService`),
`robots`, `sitemap`, `manifest`, and icons. Update brand details and the canonical URL there.

## Deployment

Pushes to `main` deploy to production on Vercel. The custom domain is configured in
Vercel → Domains.
