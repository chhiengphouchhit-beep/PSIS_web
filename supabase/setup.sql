-- PSIS Supabase setup
-- Run this in Supabase SQL Editor.

-- 1) Asset metadata table
create table if not exists public.cms_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('hero','campus','news','partner','student-life','gallery','logo')),
  url text not null,
  path text not null,
  campus text,
  section text,
  created_at timestamptz default now()
);

alter table public.cms_assets enable row level security;

-- Public can read published asset URLs
create policy if not exists "Public can read cms assets"
on public.cms_assets
for select
using (true);

-- Authenticated admins can insert assets
create policy if not exists "Authenticated users can insert cms assets"
on public.cms_assets
for insert
to authenticated
with check (true);

-- Authenticated admins can delete assets
create policy if not exists "Authenticated users can delete cms assets"
on public.cms_assets
for delete
to authenticated
using (true);

-- 2) Storage bucket
insert into storage.buckets (id, name, public)
values ('psis-assets', 'psis-assets', true)
on conflict (id) do update set public = true;

-- Public can view images in psis-assets
create policy if not exists "Public can view psis assets"
on storage.objects
for select
using (bucket_id = 'psis-assets');

-- Authenticated admins can upload images
create policy if not exists "Authenticated users can upload psis assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'psis-assets');

-- Authenticated admins can update images
create policy if not exists "Authenticated users can update psis assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'psis-assets');

-- Authenticated admins can delete images
create policy if not exists "Authenticated users can delete psis assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'psis-assets');
