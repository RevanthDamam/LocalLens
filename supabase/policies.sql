-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to allow data to be read/written.
-- These policies fix "data not adding to tables" by allowing authenticated and anonymous access where needed.

-- Enable RLS on tables (if not already)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shop_items ENABLE ROW LEVEL SECURITY;

-- PROFILES: users can read/update their own profile; insert on signup (via service role or auth.uid())
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- SHOPS: anyone can read (for explore); only owner can insert/update/delete
DROP POLICY IF EXISTS "Shops are viewable by everyone" ON public.shops;
CREATE POLICY "Shops are viewable by everyone" ON public.shops
  FOR SELECT USING (true);

-- If owner_id is UUID type in your DB, use: auth.uid() = owner_id
-- If owner_id is TEXT type, use: auth.uid()::text = owner_id
DROP POLICY IF EXISTS "Authenticated users can create own shop" ON public.shops;
CREATE POLICY "Authenticated users can create own shop" ON public.shops
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id);

DROP POLICY IF EXISTS "Owners can update own shop" ON public.shops;
CREATE POLICY "Owners can update own shop" ON public.shops
  FOR UPDATE USING (auth.uid()::text = owner_id);

DROP POLICY IF EXISTS "Owners can delete own shop" ON public.shops;
CREATE POLICY "Owners can delete own shop" ON public.shops
  FOR DELETE USING (auth.uid()::text = owner_id);

-- SHOP_ITEMS: anyone can read; only shop owner can insert/update/delete (via shop ownership)
DROP POLICY IF EXISTS "Shop items are viewable by everyone" ON public.shop_items;
CREATE POLICY "Shop items are viewable by everyone" ON public.shop_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Shop owners can insert items" ON public.shop_items;
CREATE POLICY "Shop owners can insert items" ON public.shop_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Shop owners can update items" ON public.shop_items;
CREATE POLICY "Shop owners can update items" ON public.shop_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Shop owners can delete items" ON public.shop_items;
CREATE POLICY "Shop owners can delete items" ON public.shop_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()::text)
  );

-- Optional: trigger to create profile on signup (run in SQL Editor).
-- If your profiles table has a UNIQUE constraint on user_id, use: ON CONFLICT (user_id) DO NOTHING;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
