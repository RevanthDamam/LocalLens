# CornerStores Redesign and Backend Migration

## Reference-aligned map refinement

- [ ] Render the same Lucide category icons in map pins as in the left category filter rail.
- [ ] Adjust the public map workspace proportions, map canvas, controls, and rail to match the provided reference.
- [ ] Validate the refined map layout and category icon consistency in production.

## Category and map expansion

- [x] Define the complete customer-facing category catalog with a unique icon and marker treatment for each category.
- [x] Use the shared category metadata in category navigation, shop cards, and map markers.
- [x] Add clearly labeled sample listings for every category without fabricated ratings, reviews, or customer claims.
- [x] Validate filtering and map behavior with live and sample listings.

## Production cleanup and security

- [x] Identify and remove unused dependencies, legacy data access files, and redundant implementation without changing active flows.
- [x] Harden HTTP security headers, payload handling, validation, and error exposure for the deployed Node API.
- [x] Confirm frontend, API, database, merchant location search, and production routes retain their current behavior after cleanup.

## Merchant location picker

- [x] Add an interactive map picker to the merchant shop-listing workflow.
- [x] Add address search that narrows the map to an address and saves selected coordinates and address text.
- [x] Validate the frontend build and deployed, protected address-search route while preserving the existing shop coordinate payload.

## Merchant center-pin refinement

- [x] Replace click-to-place selection with a fixed map-center marker controlled by panning and zooming.
- [x] Update location search and merchant instructions to fly the map to an area and save the centered coordinates.
- [x] Validate and deploy the refined merchant location-selection flow.

## Merchant structured location search

- [x] Prevent location search from submitting or resetting the parent shop-listing form.
- [x] Add country, state or region, city, and area inputs above the map for structured area search.
- [x] Recenter the fixed-pin map from the structured search and validate the preserved listing state.

## CornerStores rename

- [x] Rename the GitHub repository and product-facing application branding to CornerStores.
- [x] Validate the CornerStores source build and confirm production continuity.
- [x] Refresh the existing Vercel project's Git link or deploy the approved CornerStores source artifact while retaining the production domain.

- [x] Inspect the connected Supabase project and use its supported database configuration for CornerStores.

- [x] Configure the Node.js API to use Supabase Auth and the existing Supabase PostgreSQL-backed schema without storing a database password.
- [x] Deploy the Node.js API and connect the production frontend to it.

- [x] Map the supplied Supabase project endpoint to the backend’s supported authentication and PostgreSQL data configuration.

- [x] Inspect the production backend and PostgreSQL hosting state.
- [x] Configure the Node.js API with Supabase Auth and PostgreSQL-backed data access.
- [x] Point the deployed frontend at the production Node.js API.
- [x] Verify public listing reads against the production database.

- [x] Inspect the connected Vercel deployment and make the current CornerStores frontend workspace live.
- [x] Verify the deployed site presents the redesigned CornerStores interface.

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
