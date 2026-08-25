# LocalLens API

This folder contains the repository-native Node.js API that replaces browser-direct Supabase access. It uses PostgreSQL, Express, parameterized `pg` queries, password hashing, and bearer-token authentication.

| Command | Purpose |
| --- | --- |
| `npm install --prefix backend` | Install backend dependencies. |
| `cp backend/.env.example backend/.env` | Create the local environment file and set `DATABASE_URL` plus `JWT_SECRET`. |
| `npm run migrate --prefix backend` | Apply the PostgreSQL schema in `db/migrations`. |
| `npm run dev --prefix backend` | Run the API with file watching on port `4000` by default. |

The API expects a PostgreSQL database; no database credentials are stored in the repository. The frontend development server proxies `/api` to this service, so the browser never receives the PostgreSQL connection string.
