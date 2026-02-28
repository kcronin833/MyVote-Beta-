-- Add missing columns to comments table for the backend service
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS article_url TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS article_title TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS mentions TEXT[] DEFAULT '{}';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS edited BOOLEAN DEFAULT false;

-- Backfill article_url from article_id for existing rows
UPDATE public.comments SET article_url = article_id WHERE article_url IS NULL AND article_id IS NOT NULL;

-- Add verified column to profiles if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Create political_profiles table
CREATE TABLE IF NOT EXISTS public.political_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  county TEXT,
  congressional_district TEXT,
  state_senate_district TEXT,
  state_house_district TEXT,
  registered_party TEXT,
  top_issues TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.political_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pol_profiles_select_own" ON public.political_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pol_profiles_insert_own" ON public.political_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pol_profiles_update_own" ON public.political_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-update likes_count trigger
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_like_change ON public.comment_likes;
CREATE TRIGGER on_comment_like_change
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_article_url ON public.comments(article_url);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
