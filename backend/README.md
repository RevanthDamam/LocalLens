# CornerStores API

This folder contains the repository-native Node.js API that replaces browser-direct database access. It uses Express, Supabase Auth for merchant sessions, and the connected Supabase PostgreSQL tables for local listings, profiles, and offerings.

| Command | Purpose |
| --- | --- |
| `npm install --prefix backend` | Install backend dependencies. |
| `cp backend/.env.example backend/.env` | Create the local environment file and set the Supabase URL and publishable key. |
| `npm run dev --prefix backend` | Run the API with file watching on port `4000` by default. |

The API uses Supabase's supported authenticated client to access the existing PostgreSQL schema. No database password or privileged server key is stored in the repository. The frontend development server proxies `/api` to this service, while Vercel routes the production `/api/*` path to `api/[...path].js`.
