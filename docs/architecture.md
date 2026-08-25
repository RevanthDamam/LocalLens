# LocalLens Migration Architecture

The repository will move from browser-direct Supabase access to a Node.js API in `backend/`, backed by PostgreSQL. The React client will call `/api` through the Vite development proxy, so public discovery and merchant workflows remain browser-accessible without exposing database credentials.

| Concern | Current behavior | Repository-native replacement |
| --- | --- | --- |
| Public discovery | Browser selects `shops` and `shop_items` directly | `GET /api/shops`, `GET /api/shops/:id`, and `GET /api/shops/:id/items` |
| Merchant registration | Supabase Auth signup plus `profiles` insert | `POST /api/auth/register` creates a password-hashed user and profile in one transaction |
| Merchant login | Supabase Auth password login and persisted session | `POST /api/auth/login` returns a signed JWT stored only in browser local storage |
| Merchant profile | Direct profile update plus auth metadata update | `GET` and `PUT /api/profiles/me` return and update the same public display fields |
| Shop management | Direct owner-scoped `shops` mutations | Owner-verified CRUD under `/api/shops` |
| Item management | Direct owner-scoped `shop_items` mutations | Owner-verified CRUD under `/api/shops/:shopId/items` and `/api/items/:itemId` |

The PostgreSQL migration preserves the existing user-facing fields: profile display name and avatar; shop owner, name, category, address, description, image, rating, price level, open status, phone, latitude, and longitude; and shop-item name, description, price, image, and popularity. The new `users` table replaces the Supabase Auth dependency and holds only the credential fields needed by the Node.js service.

The React app will receive a compatibility-shaped authenticated user with `id`, `email`, and `user_metadata`. This allows the existing merchant experience to keep its current data vocabulary while making the transport layer independent of Supabase.

