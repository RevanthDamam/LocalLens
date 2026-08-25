# LocalLens

LocalLens is a React field guide for local-business discovery, rebuilt with a **Cartographic Editorial** interface and a repository-native **Node.js + PostgreSQL** backend. Public visitors can browse a live shop register by category, proximity, and map location. Merchants can create an account, manage one shop listing, and maintain its current offering list.

## Architecture

| Layer | Technology | Responsibility |
| --- | --- | --- |
| `frontend/` | React, TypeScript, Vite, Tailwind CSS | Discovery, map exploration, merchant access, listing management, and offering management. |
| `backend/` | Node.js, Express, Zod | Public shop reads, password-based merchant authentication, JWT authorization, profile updates, and owner-scoped CRUD. |
| Database | PostgreSQL, `pg` | Users, profiles, shops, and shop items, with foreign-key constraints and timestamps. |
| Local bridge | Vite proxy | Routes browser requests from `/api` to the Node.js service on port `4000` during local development. |

## Local setup

Install the frontend and backend dependencies from the repository root, then create the backend environment file. The application intentionally keeps PostgreSQL credentials in `backend/.env`, which is excluded from version control.

```sh
npm run install:all
cp backend/.env.example backend/.env
```

Set `DATABASE_URL` and a long random `JWT_SECRET` in `backend/.env`. The PostgreSQL user must be able to create the schema objects described below. Apply the migration before starting either workflow that needs live data.

```sh
npm run db:migrate
npm run dev:backend
# in another terminal
npm run dev:frontend
```

The React application in `frontend/` then runs on `http://localhost:8080` and forwards `/api/*` to the Node.js service in `backend/` on port `4000`. The root `npm run dev`, `npm run build`, and `npm run test` commands delegate to the frontend workspace for convenience.

## PostgreSQL schema

The initial migration is located at `backend/db/migrations/001_initial_schema.sql`. It creates `users`, `profiles`, `shops`, and `shop_items`, including the foreign-key relationships required for merchant ownership and automatic offering cleanup when a shop is deleted. The migration runner records successful applications in `schema_migrations`.

## API surface

| Route group | Operations |
| --- | --- |
| `/api/auth` | Register, login, and retrieve the active merchant identity. |
| `/api/profiles/me` | Read and update the authenticated merchant’s public profile fields. |
| `/api/shops` | Read the public register; authenticated merchants create, update, and remove their own listing. |
| `/api/shops/:shopId/items` | Read a shop’s public offerings and create offerings for an owned shop. |
| `/api/shops/items/:itemId` | Update or delete an offering owned by the authenticated merchant. |
| `/api/health` | Confirm the API process can reach PostgreSQL. |

## Verification

The frontend production build and Node.js syntax checks pass in the repository. The home page, discovery workspace, full map, and merchant-access route have been rendered in a browser. Completing live data tests requires a valid PostgreSQL connection in `backend/.env`; see [`docs/verification.md`](docs/verification.md) for the current environment-dependent boundary.

## Repository notes

The prior browser-direct Supabase integration remains in the repository only as unused historical source under `frontend/src/integrations`. The active React data hooks call `frontend/src/lib/api.ts`, which connects to the new Node.js API. The visual direction, data-contract mapping, and execution checklist are recorded in [`ideas.md`](ideas.md), [`docs/architecture.md`](docs/architecture.md), and [`todo.md`](todo.md).
