# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Next.js dev server on :3000
npm run build     # production build
npm run lint      # ESLint
```

No test suite is currently configured for the Next.js app.

## Codebase state

This repo has **two coexisting codebases** — ignore `src/` entirely, it is the legacy Angular app and will be deleted:

| Directory | Status |
|-----------|--------|
| `src/` | Legacy Angular 18 — dead code, ignore |
| `app/` | Active Next.js 14 App Router |
| `components/`, `hooks/`, `lib/`, `types/` | Active Next.js code |

## Architecture (Next.js app)

**Route groups:**
- `app/(auth)/login` — public login page
- `app/(dashboard)/` — protected shell with `<Sidebar>` + `<main>`; auth guard lives in `app/(dashboard)/layout.tsx`
- `app/page.tsx` — redirects to `/dashboard`

**Auth flow:**
- `AuthContext` is provided by `components/layout/providers.tsx`, which wraps the entire app
- `hooks/use-auth.ts` exposes the context via `useAuth()`
- Currently the `login()` function in `providers.tsx` is **mocked** — accepts any credentials and sets a fake user. This was intentional to bypass the missing backend while building the UI.

**Data fetching:**
- `lib/api.ts` — Axios instance; base URL is `NEXT_PUBLIC_API_URL` or `/api/v1`; token stored in `window.__oceanops_token`
- `next.config.mjs` rewrites `/api/v1/*` → `BACKEND_URL` (default `localhost:3001`) — no backend is running, all API calls currently fail silently
- `hooks/use-*.ts` — TanStack Query hooks per domain (ships, containers, cargo, ports, users)
- `types/index.ts` — single source of truth for all TypeScript interfaces

**UI:**
- `components/ui/` — shadcn/Radix UI primitives (Button, Card, Dialog, etc.)
- `components/layout/` — Sidebar, Topbar, Providers
- Color palette is hardcoded dark navy (`#0A0F1E` bg, `#111827` cards, `#3B82F6` accent) — no Tailwind theme extension yet

## Planned direction

The app is being pivoted from enterprise fleet management to a **public maritime fishing data dashboard**:
- **No backend** — data comes from free public APIs: OpenMeteo Marine (waves, wind, sea temp), NOAA Tides (tides/currents), Copernicus CMEMS (oceanography)
- **Groq AI** (10 req/day cron limit) processes raw API data into daily human-readable summaries stored as static JSON
- **PWA** target — mobile-responsive, installable
- **Next.js upgrade** to latest stable pending (currently on 14.2.5)
- Angular files in `src/` to be deleted entirely
