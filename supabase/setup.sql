-- =============================================================================
-- LocalLens: run this ONCE in your Supabase project (the one in your .env)
-- 1. Open https://supabase.com/dashboard → your project
-- 2. Go to SQL Editor → New query
-- 3. Paste this entire file and click Run
-- Fixes: "Could not find the table 'public.shops' in the schema cache"
-- =============================================================================

-- STEP 1: Create tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  address text NOT NULL,
  description text,
  image text,
  rating numeric,
  price_level text,
  is_open boolean,
  phone text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  image text,
  is_popular boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_shop_items_shop_id ON public.shop_items(shop_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- STEP 2: RLS policies
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shops are viewable by everyone" ON public.shops;
CREATE POLICY "Shops are viewable by everyone" ON public.shops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create own shop" ON public.shops;
CREATE POLICY "Authenticated users can create own shop" ON public.shops FOR INSERT WITH CHECK (auth.uid()::text = owner_id);
DROP POLICY IF EXISTS "Owners can update own shop" ON public.shops;
CREATE POLICY "Owners can update own shop" ON public.shops FOR UPDATE USING (auth.uid()::text = owner_id);
DROP POLICY IF EXISTS "Owners can delete own shop" ON public.shops;
CREATE POLICY "Owners can delete own shop" ON public.shops FOR DELETE USING (auth.uid()::text = owner_id);

DROP POLICY IF EXISTS "Shop items are viewable by everyone" ON public.shop_items;
CREATE POLICY "Shop items are viewable by everyone" ON public.shop_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Shop owners can insert items" ON public.shop_items;
CREATE POLICY "Shop owners can insert items" ON public.shop_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
);
DROP POLICY IF EXISTS "Shop owners can update items" ON public.shop_items;
CREATE POLICY "Shop owners can update items" ON public.shop_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
);
DROP POLICY IF EXISTS "Shop owners can delete items" ON public.shop_items;
CREATE POLICY "Shop owners can delete items" ON public.shop_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
);

-- STEP 3: Optional – create profile when a user signs up
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NOW(), NOW());
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
