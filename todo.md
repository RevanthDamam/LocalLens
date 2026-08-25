# LocalLens Redesign and Backend Migration

- [ ] Inspect the connected Supabase project and use its supported database configuration for LocalLens.

- [ ] Store the supplied PostgreSQL and JWT credentials as production-only deployment secrets.
- [ ] Run the PostgreSQL schema migration against the supplied Supabase database.
- [ ] Deploy the Node.js API and connect the production frontend to it.

- [ ] Map the supplied Supabase project endpoint to the backend’s PostgreSQL connection configuration.
- [ ] Obtain the secure PostgreSQL connection string and JWT secret required for production backend access.

- [ ] Inspect the production backend and PostgreSQL hosting state.
- [ ] Configure the Node.js API with its PostgreSQL connection and production environment variables.
- [ ] Point the deployed frontend at the production Node.js API.
- [ ] Verify public listing reads and merchant API flows against the production database.

- [x] Inspect the connected Vercel deployment and make the current LocalLens frontend workspace live.
- [x] Verify the deployed site presents the redesigned LocalLens interface.

- [x] Verify the active frontend deployment source and fix the configuration so the redesigned interface is visible.

- [x] Restructure the repository into explicit `frontend/` and `backend/` workspaces.
- [x] Move the React, Vite, Tailwind, and frontend testing configuration into `frontend/`.
- [x] Update root scripts, frontend API proxying, and documentation for the two-folder architecture.
- [x] Validate the migrated workspaces and commit the restructuring update.

- [x] Inventory the current React routes, Supabase queries, authentication behavior, and SQL schema.
- [x] Define the Node.js API surface and PostgreSQL data model that preserve the present product flows.
- [x] Add a `backend/` Node.js service with environment validation, database access, authentication, and local development scripts.
- [x] Add PostgreSQL migrations for profiles, shops, and shop items, plus migration guidance from the current Supabase schema.
- [x] Connect the React frontend to the new API without changing customer-facing capabilities.
- [x] Rebuild the complete frontend around the Cartographic Editorial design system.
- [x] Test the production build, existing automated test suite, backend source syntax, and representative rendered routes.
- [ ] Verify live public discovery, merchant authentication, shop management, item CRUD, and profile updates after setting `backend/.env` with a reachable PostgreSQL database.
- [ ] Commit the completed repository changes and provide concise setup instructions.
