-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- If you already ran the old schema, drop the old table first:
-- DROP TABLE IF EXISTS public.posts;

-- Create the posts table with categories
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  avatar_url text default '',
  category text not null check (category in ('love', 'thoughts', 'confessions', 'dreams', 'rants', 'gratitude')),
  content text not null check (char_length(content) <= 500),
  color text default 'indigo',
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Anyone can read posts
create policy "Posts are publicly readable"
  on public.posts
  for select
  using (true);

-- Authenticated users can insert their own posts
create policy "Authenticated users can create posts"
  on public.posts
  for insert
  with check (auth.uid() = user_id);

-- Users can delete their own posts
create policy "Users can delete their own posts"
  on public.posts
  for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_category_created_idx on public.posts (category, created_at desc);

-- Likes table (one like per user per post)
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, post_id)
);

alter table public.likes enable row level security;

-- Anyone can read likes
create policy "Likes are publicly readable"
  on public.likes
  for select
  using (true);

-- Authenticated users can like posts
create policy "Authenticated users can like posts"
  on public.likes
  for insert
  with check (auth.uid() = user_id);

-- Users can unlike (delete their own likes)
create policy "Users can unlike posts"
  on public.likes
  for delete
  using (auth.uid() = user_id);

-- Indexes for likes
create index if not exists likes_post_id_idx on public.likes (post_id);
create index if not exists likes_user_post_idx on public.likes (user_id, post_id);
