# Niche: Map-heavy command centers with liquid glass

**Core strength:** building beautiful, real-time, map-heavy command centers — the kind of product [Soccer Terminal](https://github.com/yky32/soccer-terminal) proved out — using [mapcn.dev](https://mapcn.dev) for maps and a purpose-built **liquid glass** terminal shell.

This repo (`sample-terminal`) is the stripped template. The niche lives in the *pattern*, not a single vertical.

---

## What we build (and what we don't)

| We build | We don't build |
|----------|----------------|
| Operational dashboards where **geography is the primary canvas** | Generic admin CRUD panels |
| Real-time monitors: map + metrics + signals in one view | Static report pages |
| Glass-layered UIs that feel like a **terminal**, not a spreadsheet | Dense Bootstrap-style tables |
| Next.js apps with pluggable live data backends | One-off map embeds |

**Good fits:** logistics hubs, energy grids, fleet ops, venue/event command centers, sports/live-ops terminals, regional market monitors, incident rooms.

**Poor fits:** marketing sites, content blogs, form-heavy SaaS with no spatial layer.

---

## Signature elements

### 1. Liquid glass design system

Translucent panels that let the **page backdrop breathe through** — not flat white cards on gray.

| Piece | Location | Role |
|-------|----------|------|
| `news-glass-brick` | `src/app/globals.css` | Base glass: blur, saturate, gradient fill, soft border |
| `leagues-glass-brick` | `globals.css` | Denser variant (~20% more opacity) for map-overlay panels |
| `glass-surface.ts` | `src/components/glass-surface.ts` | Token exports: `glass`, `glassStrong`, `glassInset`, `glassHover`, `glassFocus`, `glassEnter` |
| `PageBackdrop` | `src/components/page-backdrop.tsx` | Fixed sky / violet / mint orbs — biased right so content stays clean |
| `user-menu-liquid` | `globals.css` | Drop + splash + shine animation on account menu |
| `news-enter` / drawer enters | `globals.css` | Staggered panel entrance with `cubic-bezier(0.22, 1, 0.36, 1)` |

**Design rules we follow:**

- Glass reads against a **soft `#eef1f6` canvas**, not pure white.
- Hierarchy via opacity tiers (`subtle` → default → `strong` → `sticky`), not heavier borders.
- Interactive glass lifts on hover (`translateY(-2px) scale(1.002)`) — tactile, not flashy.
- Map popups are **transparent by default** (`.maplibregl-popup-content { background: transparent }`) so markers float inside glass panels, not boxed widgets.

### 2. Map.cn (mapcn.dev)

[mapcn](https://mapcn.dev) is our map layer: **MapLibre GL** components styled with Tailwind, shadcn-compatible, copy-paste ownership.

```bash
npx shadcn@latest add https://mapcn.dev/maps/map.json
```

**Why mapcn fits this niche:**

| Capability | Command-center use |
|------------|-------------------|
| Theme-aware basemaps | Glass UI stays coherent in light/dark |
| Markers, popups, tooltips | Entity pins with live status |
| Routes & paths | Fleets, deliveries, play-by-play movement |
| Fly-to / bounds | Jump from signal list → map focus |
| Clustering | Dense point layers without clutter |
| Any MapLibre tile provider | CARTO, OSM, MapTiler — swap without rewriting UI |

**Where the map lives:** `PrimaryViewPanel` (`#terminal-primary`) — a full-width glass frame sized `min(72vh, 100dvh − 8rem)`. Metrics sit above; the map fills the hero slot.

**CSS already wired for maps:**

- MapLibre popup chrome stripped (`globals.css`)
- Live marker motion: `.live-pin-ping`, `.live-pin-heartbeat`
- Pin choreography: `.pitch-pin-enter`, `.pitch-pin-bob`
- Event overlays: `.heatmap-event-line-enter`

These tokens came from Soccer Terminal and are ready when you drop mapcn in.

### 3. Terminal layout (not a dashboard grid)

A fixed **two-anchor overview** optimized for glance + drill:

```
AppShell (sticky glass header)
└── Overview (/)
    ├── TerminalPageHeader      — title + jump buttons
    ├── TerminalSectionNav      — mobile sticky section tabs
    ├── PrimaryViewPanel        — #terminal-primary (map / main viz)
    └── SignalsPanel            — #terminal-signals (watchlist / monitor)
└── Explore (/explore)          — catalog / entity list
```

| Slot | Purpose |
|------|---------|
| **Primary view** | Map, chart, pitch, or canvas — the spatial truth |
| **Signals** | Severity-tagged watchlist (`low` / `medium` / `high`) |
| **Metrics row** | 3-up KPI strip inside the primary panel |
| **Provider badge** | Shows active data source + `updatedAt` — ops teams trust timestamps |
| **Section jumps** | Desktop icon buttons + mobile sticky nav — scroll to `#terminal-primary` or `#terminal-signals` |

This is a **command center**, not a page of equal widgets. One hero surface, one monitor strip.

### 4. Pluggable real-time data layer

Swap backends without touching the shell:

| Provider | Env | Use |
|----------|-----|-----|
| `mock` | `DATA_PROVIDER=mock` (default) | Offline dev, demos, Storybook |
| `rest` | `DATA_PROVIDER=rest` + `REST_API_BASE_URL` | Your HTTP API |

```ts
// src/lib/data/provider.ts
interface TerminalDataProvider {
  getOverview(): Promise<OverviewPayload>;   // metrics + signals
  getExploreItems(): Promise<ExplorePayload>; // catalog
}
```

- **Server Components** call `getDataProvider()` directly (`src/app/page.tsx`).
- **Client polling** uses BFF routes: `/api/overview`, `/api/explore`.
- Secrets stay server-side (`REST_API_KEY`, never `NEXT_PUBLIC_*`).

Add a third provider (WebSocket, GraphQL, Supabase realtime) by implementing the interface and registering in `get-provider.ts`.

### 5. App shell & preferences

| Element | Notes |
|---------|-------|
| Sticky glass header | `glassStrong`, 4.25rem — nav pills use `glassInset` |
| `AppChromeProvider` | Hide header for immersive map modes |
| User preferences | Locale, timezone, currency, theme stub — localStorage + cookie for TZ |
| SEO kit | `metadata.ts`, sitemap, robots, Open Graph image, optional JSON-LD |
| Typography scale | `--text-display` → `--text-label` — tight tracking for terminal density |

### 6. Motion vocabulary

Shared easing: `cubic-bezier(0.22, 1, 0.36, 1)` — soft deceleration, not bounce (except deliberate pin bob).

- Panel enter: `news-enter`
- Drawer: `news-drawer-enter`
- Live entities: ping + heartbeat on map pins
- `motion-reduce` respected on glass enter animations

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Maps | [mapcn.dev](https://mapcn.dev) → MapLibre GL |
| Glass tokens | Custom CSS utilities + `glass-surface.ts` |
| Icons | Lucide |
| Deploy | Vercel (Analytics + Speed Insights optional) |

---

## Comparison: why this beats the alternatives

### vs. off-the-shelf BI (Metabase, Grafana, Looker)

- BI tools optimize for **charts in grids**. We optimize for **geography as the hero** with glass UI that feels product-grade, not internal tooling.
- Real-time map markers, fly-to, and custom popups are second-class in most BI embeds.

### vs. raw Mapbox / Google Maps SDK

- SDK-first means you **style everything from scratch**. mapcn gives shadcn-shaped components; our glass system handles the chrome around the map.
- We own the code (copy-paste model) — no wrapper lock-in.

### vs. generic shadcn + Leaflet tutorials

- Leaflet is fine for simple pins; **MapLibre + mapcn** scales to vector tiles, 3D pitch, smooth camera moves, and theme-aware basemaps.
- Our terminal layout, provider pattern, and glass tokens are **pre-composed** — not assembled from blog posts.

### vs. Soccer Terminal (full product)

| Soccer Terminal | sample-terminal (this repo) |
|-----------------|----------------------------|
| Football domain: leagues, matches, news, assistant | Generic `OverviewPayload` / `ExplorePayload` |
| Live maps wired | Primary view **placeholder** — drop mapcn in |
| Production data providers | `mock` + `rest` stubs |

Clone `sample-terminal`, rename in `metadata.ts`, wire mapcn into `PrimaryViewPanel`, implement your provider — same niche, new vertical.

---

## Checklist: shipping a new terminal in this niche

1. **Rename** — `PRODUCT_NAME`, logo, navigation (`src/lib/metadata.ts`, `src/lib/navigation.ts`).
2. **Install mapcn** — `npx shadcn@latest add https://mapcn.dev/maps/map.json`.
3. **Fill primary view** — map + markers bound to `getOverview()`; use `live-pin-*` for active entities.
4. **Wire signals** — map list clicks → `flyTo` on the map; severity colors already in `SignalsPanel`.
5. **Add provider** — REST, WebSocket, or domain SDK behind `TerminalDataProvider`.
6. **Tune glass** — switch to `leagues-glass-brick` if panels sit directly on the map.
7. **Deploy** — set `NEXT_PUBLIC_SITE_URL`; BFF routes proxy secrets.

---

## One-line pitch

> We build **liquid-glass command centers** — real-time maps (mapcn + MapLibre), live signals, and pluggable data — as polished Next.js products, not dashboard afterthoughts.
