-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  zip_code text,
  political_lean text default 'moderate',
  political_score numeric default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  article_url text,
  article_title text,
  parent_id uuid references public.comments(id) on delete cascade,
  mentions text[],
  likes_count integer default 0,
  edited boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create comment_likes table
create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  comment_id uuid references public.comments(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, comment_id)
);

-- Create article_likes table
create table if not exists public.article_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  article_id text not null,
  article_title text,
  article_source text,
  bias_score integer default 0,
  category text,
  created_at timestamptz default now(),
  unique(user_id, article_id)
);

-- Create viewpoint_likes table
create table if not exists public.viewpoint_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  viewpoint_id text not null,
  viewpoint_side text not null,
  article_title text,
  created_at timestamptz default now(),
  unique(user_id, viewpoint_id)
);

-- Create contact_submissions table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  type text default 'general',
  subject text,
  message text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Create suggestions table
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text default 'feature',
  status text default 'pending',
  votes integer default 0,
  created_at timestamptz default now()
);

-- Create suggestion_votes table
create table if not exists public.suggestion_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  suggestion_id uuid references public.suggestions(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, suggestion_id)
);

-- Create merch_products table
create table if not exists public.merch_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text default 'apparel',
  sizes text[],
  colors text[],
  status text default 'pending',
  submitted_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
