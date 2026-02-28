-- ============================================================
-- MyVote Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text default '',
  location text default '',
  political_lean text check (political_lean in ('left', 'center', 'right')) default 'center',
  verified boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- COMMENTS TABLE
-- ============================================================
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  article_url text not null,
  article_title text not null,
  content text not null,
  mentions text[] default '{}',
  parent_id uuid references public.comments(id) on delete cascade,
  likes_count integer default 0,
  edited boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- COMMENT LIKES TABLE
-- ============================================================
create table if not exists public.comment_likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  comment_id uuid references public.comments(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, comment_id)
);

-- Auto-update likes_count on comments
create or replace function update_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.comments set likes_count = likes_count + 1 where id = NEW.comment_id;
  elsif TG_OP = 'DELETE' then
    update public.comments set likes_count = likes_count - 1 where id = OLD.comment_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_like_change on public.comment_likes;

create trigger on_like_change
  after insert or delete on public.comment_likes
  for each row execute procedure update_likes_count();

-- ============================================================
-- USER POLITICAL PROFILE TABLE
-- ============================================================
create table if not exists public.political_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  address text,
  city text,
  state text,
  zip_code text,
  county text,
  congressional_district text,
  state_senate_district text,
  state_house_district text,
  registered_party text,
  top_issues text[] default '{}',
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.political_profiles enable row level security;

-- Profiles: anyone can read, only owner can update
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Comments: anyone can read, authenticated users can insert, only owner can update/delete
drop policy if exists "Comments are viewable by everyone" on public.comments;
create policy "Comments are viewable by everyone" on public.comments for select using (true);

drop policy if exists "Authenticated users can comment" on public.comments;
create policy "Authenticated users can comment" on public.comments for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own comments" on public.comments;
create policy "Users can update own comments" on public.comments for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own comments" on public.comments;
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Comment likes: authenticated users can like/unlike
drop policy if exists "Likes are viewable by everyone" on public.comment_likes;
create policy "Likes are viewable by everyone" on public.comment_likes for select using (true);

drop policy if exists "Authenticated users can like" on public.comment_likes;
create policy "Authenticated users can like" on public.comment_likes for insert with check (auth.uid() = user_id);

drop policy if exists "Users can unlike" on public.comment_likes;
create policy "Users can unlike" on public.comment_likes for delete using (auth.uid() = user_id);

-- Political profiles: only owner can read/write
drop policy if exists "Users can view own political profile" on public.political_profiles;
create policy "Users can view own political profile" on public.political_profiles for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own political profile" on public.political_profiles;
create policy "Users can insert own political profile" on public.political_profiles for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own political profile" on public.political_profiles;
create policy "Users can update own political profile" on public.political_profiles for update using (auth.uid() = user_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_comments_article_url on public.comments(article_url);
create index if not exists idx_comments_user_id on public.comments(user_id);
create index if not exists idx_comments_parent_id on public.comments(parent_id);
create index if not exists idx_comment_likes_comment_id on public.comment_likes(comment_id);
create index if not exists idx_comment_likes_user_id on public.comment_likes(user_id);
