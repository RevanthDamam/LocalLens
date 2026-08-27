# CornerStores Architecture

CornerStores separates the React experience from a compact Node.js API while retaining the existing Supabase project as its authentication and PostgreSQL data layer. The browser makes same-origin calls to `/api`; the Node service validates requests, forwards the authenticated merchant access token to Supabase, and relies on the project’s existing row-level security policies.

| Concern | Current implementation |
| --- | --- |
| Public discovery | React calls `GET /api/shops`, shop detail, and offering routes through the Node API. |
| Merchant authentication | `/api/auth` delegates registration, password sign-in, and session lookup to Supabase Auth. |
| Merchant ownership | The API creates request-scoped Supabase clients using the merchant bearer token; existing RLS policies enforce ownership. |
| Profiles, shops, and items | The API reads and writes the existing PostgreSQL-backed `profiles`, `shops`, and `shop_items` tables. |
| Merchant location picker | Authenticated area search is routed through `/api/locations/search`; the frontend moves a fixed center-pin map to the match and saves its centered coordinates. |
| Production delivery | Vercel serves `frontend/dist` and routes `/api/*` to the thin Express serverless adapter in `api/[...path].js`. |

The active data contract deliberately retains `address`, `latitude`, and `longitude` on shops. The location picker only improves how those established fields are chosen; it does not add schema changes or replace the storefront save flow.

The backend keeps the runtime focused on `@supabase/supabase-js`, Express, Zod, CORS, and dotenv. The former `pg` pool, custom schema migration runner, custom password/JWT packages, and unused browser-side Supabase client were retired because they did not participate in the deployed runtime and could mislead future maintenance.
