# F1 Terminal

Real-time **Formula 1 command center** built on the [sample-terminal](https://github.com/yky32/sample-terminal) liquid-glass template — map-heavy live ops with pluggable data providers.

## What's included

- App shell with sticky glass header, footer, and account menu
- Page backdrop orbs and `news-glass-brick` surface tokens (`src/components/glass-surface.ts`)
- Overview page wired to **pluggable data providers** (mock + REST)
- Explore page listing provider-backed entities
- BFF routes: `/api/overview`, `/api/explore`
- SEO helpers (`src/lib/metadata.ts`, sitemap, robots, optional JSON-LD)
- User preferences (locale, timezone, currency, theme stub)

## Quick start

```bash
cd f1-terminal
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize for F1

1. Install mapcn — `npx shadcn@latest add https://mapcn.dev/maps/map.json`
2. Wire circuit map + car markers into `PrimaryViewPanel`
3. Implement an F1 data provider behind `TerminalDataProvider`
4. Map signals panel clicks → `flyTo` on the circuit map

See [niche.md](./niche.md) for the full niche guide and [TEMPLATE.md](./TEMPLATE.md) for the implementation checklist.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Run production build     |
| `npm run lint` | ESLint                   |

## Deploy

Deploy to [Vercel](https://vercel.com) like any Next.js app. Set `NEXT_PUBLIC_SITE_URL` to your production origin.
