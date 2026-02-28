-- MyVote Database Schema

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  location TEXT,
  zip_code TEXT,
  political_lean TEXT DEFAULT 'moderate',
  political_score NUMERIC DEFAULT 50,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, location, political_lean)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'location', 'Atlanta, GA'),
    COALESCE(NEW.raw_user_meta_data ->> 'political_lean', 'moderate')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Article likes table
CREATE TABLE IF NOT EXISTS public.article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  article_title TEXT,
  article_source TEXT,
  bias_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "article_likes_select_all" ON public.article_likes FOR SELECT USING (true);
CREATE POLICY "article_likes_insert_own" ON public.article_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "article_likes_delete_own" ON public.article_likes FOR DELETE USING (auth.uid() = user_id);

-- Comment likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comment_likes_select_all" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "comment_likes_insert_own" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comment_likes_delete_own" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Viewpoint likes table (tracks left/right viewpoint preferences)
CREATE TABLE IF NOT EXISTS public.viewpoint_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  viewpoint_side TEXT NOT NULL CHECK (viewpoint_side IN ('left', 'right')),
  viewpoint_text TEXT,
  bias_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id, viewpoint_side)
);

ALTER TABLE public.viewpoint_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "viewpoint_likes_select_all" ON public.viewpoint_likes FOR SELECT USING (true);
CREATE POLICY "viewpoint_likes_insert_own" ON public.viewpoint_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "viewpoint_likes_delete_own" ON public.viewpoint_likes FOR DELETE USING (auth.uid() = user_id);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_select_own" ON public.contact_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contact_insert_any" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Suggestions table
CREATE TABLE IF NOT EXISTS public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'feature',
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suggestions_select_all" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "suggestions_insert_auth" ON public.suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "suggestions_update_own" ON public.suggestions FOR UPDATE USING (auth.uid() = user_id);

-- Suggestion votes table
CREATE TABLE IF NOT EXISTS public.suggestion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, suggestion_id)
);

ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suggestion_votes_select_all" ON public.suggestion_votes FOR SELECT USING (true);
CREATE POLICY "suggestion_votes_insert_own" ON public.suggestion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "suggestion_votes_delete_own" ON public.suggestion_votes FOR DELETE USING (auth.uid() = user_id);

-- Merch products table
CREATE TABLE IF NOT EXISTS public.merch_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'apparel',
  sizes TEXT[],
  colors TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.merch_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "merch_select_approved" ON public.merch_products FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by);
CREATE POLICY "merch_insert_auth" ON public.merch_products FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "merch_update_own" ON public.merch_products FOR UPDATE USING (auth.uid() = submitted_by OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Function to recalculate political score from viewpoint likes
CREATE OR REPLACE FUNCTION public.recalculate_political_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  left_count INTEGER;
  right_count INTEGER;
  new_score NUMERIC;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE viewpoint_side = 'left'),
    COUNT(*) FILTER (WHERE viewpoint_side = 'right')
  INTO left_count, right_count
  FROM public.viewpoint_likes
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

  IF (left_count + right_count) > 0 THEN
    new_score := (right_count::NUMERIC / (left_count + right_count)::NUMERIC) * 100;
  ELSE
    new_score := 50;
  END IF;

  UPDATE public.profiles
  SET political_score = new_score, updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_viewpoint_like_change ON public.viewpoint_likes;
CREATE TRIGGER on_viewpoint_like_change
  AFTER INSERT OR DELETE ON public.viewpoint_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_political_score();
