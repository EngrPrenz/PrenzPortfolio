-- ==============================================================================
-- PRENZ PORTFOLIO - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  role text not null default '',
  category_tag text not null default 'SOFTWARE DEVELOPMENT',
  description text not null,
  long_description text not null default '',
  key_features jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  status text not null default 'live' check (status in ('live', 'development', 'upcoming')),
  live_url text,
  github_url text,
  featured boolean not null default false,
  category text not null default 'Full Stack',
  metrics jsonb default '[]'::jsonb,
  screenshots jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create Hobbies Table
create table if not exists public.hobbies (
  id text primary key,
  title text not null,
  category text not null default 'General',
  icon text not null default 'Sparkle',
  description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  image_url text,
  featured boolean not null default true,
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.hobbies enable row level security;

-- 4. Projects RLS Policies
-- Allow anyone to view projects
create policy "Allow public read access on projects"
  on public.projects
  for select
  using (true);

-- Allow authenticated admins to insert projects
create policy "Allow authenticated insert on projects"
  on public.projects
  for insert
  with check (auth.role() = 'authenticated');

-- Allow authenticated admins to update projects
create policy "Allow authenticated update on projects"
  on public.projects
  for update
  using (auth.role() = 'authenticated');

-- Allow authenticated admins to delete projects
create policy "Allow authenticated delete on projects"
  on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- 5. Hobbies RLS Policies
-- Allow anyone to view hobbies
create policy "Allow public read access on hobbies"
  on public.hobbies
  for select
  using (true);

-- Allow authenticated admins to insert hobbies
create policy "Allow authenticated insert on hobbies"
  on public.hobbies
  for insert
  with check (auth.role() = 'authenticated');

-- Allow authenticated admins to update hobbies
create policy "Allow authenticated update on hobbies"
  on public.hobbies
  for update
  using (auth.role() = 'authenticated');

-- Allow authenticated admins to delete hobbies
create policy "Allow authenticated delete on hobbies"
  on public.hobbies
  for delete
  using (auth.role() = 'authenticated');

-- 6. Storage Bucket for Project & Hobby Assets
-- You can run the following to automatically create the public bucket:
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Storage RLS: Anyone can view assets in 'portfolio-assets'
create policy "Public Access to Portfolio Assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

-- Storage RLS: Only authenticated users can upload assets
create policy "Authenticated users can upload Portfolio Assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

-- Storage RLS: Only authenticated users can update/delete assets
create policy "Authenticated users can update Portfolio Assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Authenticated users can delete Portfolio Assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
