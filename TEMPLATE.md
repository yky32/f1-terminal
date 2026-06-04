# Terminal template guide

## Layout map

```
AppShell (header + footer)
└── Overview (/)
    ├── TerminalPageHeader
    ├── PrimaryViewPanel      #terminal-primary  (getDataProvider().getOverview)
    └── SignalsPanel          #terminal-signals
└── Explore (/explore)
    ├── PageHeader
    └── Provider-backed list  (getDataProvider().getExploreItems)
```

## Glass design tokens

Use classes from `src/components/glass-surface.ts`:

| Token          | Use case                          |
|----------------|-----------------------------------|
| `glass`        | Default panel                     |
| `glassStrong`  | Header, menus, emphasis           |
| `glassInset`   | Chips, nested controls            |
| `glassHover`   | Interactive cards                 |
| `glassFocus`   | Focus ring for a11y               |

Underlying CSS: `.news-glass-brick` in `globals.css` (rename optional).

## Suggested modules for a new industry

| Module        | Route pattern        | Notes                          |
|---------------|----------------------|--------------------------------|
| Overview      | `/`                  | Main viz + monitor             |
| Catalog       | `/explore` or `/data`| Lists, filters, search         |
| Entity detail | `/data/[id]`         | SSR or client fetch            |
| Settings      | `/settings`          | Optional                       |

## Data layer (multi-provider)

The template ships with **pluggable providers** — same idea as soccer-terminal’s `FOOTBALL_DATA_PROVIDER`.

| Provider | Env | Use case |
|----------|-----|----------|
| `mock` | `DATA_PROVIDER=mock` (default) | Offline dev, demos |
| `rest` | `DATA_PROVIDER=rest` + `REST_API_BASE_URL` | Your HTTP backend |

### Add a third provider

1. Implement `TerminalDataProvider` in `src/lib/data/provider.ts`
2. Create `src/lib/data/providers/<name>/client.ts`
3. Register in `src/lib/data/get-provider.ts` and `DATA_PROVIDER_IDS`
4. Keep secrets in server env only (`API_*`, never `NEXT_PUBLIC_`)

### Files

```
src/lib/data/
  types.ts           # OverviewPayload, ExplorePayload, …
  provider.ts        # interface
  get-provider.ts    # factory (server-only)
  providers/
    mock/client.ts
    rest/client.ts   # GET /overview, GET /explore
src/app/api/
  overview/route.ts  # BFF for client fetch
  explore/route.ts
```

Server Components call `getDataProvider()` directly (see `src/app/page.tsx`). Client code can use `/api/overview` instead.

## Checklist before first deploy

- [ ] `PRODUCT_NAME` and logo
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] Navigation + sitemap routes
- [ ] Remove placeholder copy
- [ ] Favicon (`src/app/icon.svg`, `public/`)
