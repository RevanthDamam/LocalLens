# LocalLens database (Supabase only)

This project uses **Supabase** as its only database. All data lives in your Supabase project.

## Fix: "Could not find the table 'public.shops' in the schema cache"

You must create the tables **once** in the same Supabase project your app uses.

### Steps

1. **Open your project’s SQL Editor**  
   → **[Open SQL Editor for your project](https://supabase.com/dashboard/project/skquddkyggertfdstdxm/sql/new)**  
   (If that link doesn’t match your project, go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor** → **New query**.)

2. **Copy the whole script**  
   Open **`supabase/setup.sql`** in this repo and copy **everything** (from the first `--` line to the last `;`).

3. **Paste and run**  
   Paste into the SQL Editor and click **Run** (or Ctrl+Enter). You should see “Success. No rows returned.”

4. **Reload your app**  
   Refresh the app and try creating a shop again. The error should be gone.

That script creates:

- **`profiles`** – merchant display names (linked to Supabase Auth).
- **`shops`** – shop listings (fixes the PGRST205 / schema cache error).
- **`shop_items`** – products per shop.

Plus RLS policies and an optional trigger to create a profile on signup.

## Env

In your app root `.env`:

- `VITE_SUPABASE_URL` – from Supabase → Settings → API → Project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` – from the same page (anon/public key).
