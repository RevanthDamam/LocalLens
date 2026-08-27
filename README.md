# CornerStores

CornerStores is a React field guide for discovering local businesses. Visitors browse the live shop register and map; merchants sign in to manage one storefront, its offerings, and a precise map location.

## Architecture

| Layer | Implementation | Purpose |
| --- | --- | --- |
| `frontend/` | React, TypeScript, Vite, Tailwind, Leaflet | Public discovery, merchant listing and offering management, and fixed center-pin location selection. |
| `backend/` | Node.js, Express, Zod | Same-origin `/api` layer for public reads, merchant operations, and address search. |
| Supabase | Auth and PostgreSQL data API | Merchant identity plus the existing `profiles`, `shops`, and `shop_items` tables protected by RLS. |
| Vercel | Static frontend and Node serverless function | Production delivery for the React app and the `/api/*` bridge. |

## Local development

Install workspace dependencies, copy the environment template, and add the **Supabase URL** and **publishable key** for an approved project. Do not commit `.env` files or privileged database credentials.

```sh
npm run install:all
cp backend/.env.example backend/.env
npm run dev:backend
# in another terminal
npm run dev:frontend
```

The frontend runs on `http://localhost:8080` and proxies `/api/*` to the backend on port `4000`. The configured location provider can be changed with `GEOCODER_URL`; the default is used only for merchant-initiated address search.

## API

| Route group | Purpose |
| --- | --- |
| `/api/auth` | Merchant registration, sign-in, and current-session lookup. |
| `/api/profiles/me` | Read and update the authenticated merchant profile. |
| `/api/shops` | Public discovery and merchant-owned shop CRUD. |
| `/api/shops/:shopId/items` | Public offering reads and owner-scoped offering CRUD. |
| `/api/locations/search` | Authenticated, low-volume address and area lookup for the merchant map picker. |
| `/api/health` | Service health check. |

## Security and data handling

The browser talks only to the same-origin Node API; Supabase credentials and access-token verification remain server-side. The API applies strict JSON parsing, schema validation, allowlisted CORS origins, no-store headers for account responses, common browser security headers, rate limits on sign-in and registration, and generic database error messages. Public listing search is length-limited and strips filter-control characters before it reaches the data query.

The backend deliberately does **not** contain a direct PostgreSQL migration runner or a custom password/JWT implementation. Existing Supabase Auth and PostgreSQL relationships are retained, avoiding incompatible duplicate user tables or unreviewed schema changes.

## Verification

Run `npm test` and `npm run build` from the repository root. Production integration notes and deployment checks are maintained in [`docs/verification.md`](docs/verification.md).
