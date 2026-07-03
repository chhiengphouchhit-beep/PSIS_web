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

-- Drop policies if they already exist to prevent duplicate key errors
drop policy if exists "Public can read cms assets" on public.cms_assets;
drop policy if exists "Authenticated users can insert cms assets" on public.cms_assets;
drop policy if exists "Authenticated users can delete cms assets" on public.cms_assets;

-- Public can read published asset URLs
create policy "Public can read cms assets"
on public.cms_assets
for select
using (true);

-- Authenticated admins can insert assets
create policy "Authenticated users can insert cms assets"
on public.cms_assets
for insert
to authenticated
with check (true);

-- Authenticated admins can delete assets
create policy "Authenticated users can delete cms assets"
on public.cms_assets
for delete
to authenticated
using (true);


-- 2) Storage bucket
insert into storage.buckets (id, name, public)
values ('psis-assets', 'psis-assets', true)
on conflict (id) do update set public = true;

-- Drop storage policies if they exist
drop policy if exists "Public can view psis assets" on storage.objects;
drop policy if exists "Authenticated users can upload psis assets" on storage.objects;
drop policy if exists "Authenticated users can update psis assets" on storage.objects;
drop policy if exists "Authenticated users can delete psis assets" on storage.objects;

-- Public can view images in psis-assets
create policy "Public can view psis assets"
on storage.objects
for select
using (bucket_id = 'psis-assets');

-- Authenticated admins can upload images
create policy "Authenticated users can upload psis assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'psis-assets');

-- Authenticated admins can update images
create policy "Authenticated users can update psis assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'psis-assets');

-- Authenticated admins can delete images
create policy "Authenticated users can delete psis assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'psis-assets');


-- 3) Inquiries table for leads
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  student_name text not null,
  student_age integer not null,
  phone text not null,
  email text,
  campus text not null,
  program text not null,
  notes text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Tour Booked', 'Enrolled', 'Junk')),
  assigned_admin text,
  created_at timestamptz default now()
);

alter table public.inquiries enable row level security;

-- Drop inquiries policies if they exist
drop policy if exists "Anyone can insert inquiries" on public.inquiries;
drop policy if exists "Authenticated users can select inquiries" on public.inquiries;
drop policy if exists "Authenticated users can update inquiries" on public.inquiries;
drop policy if exists "Authenticated users can delete inquiries" on public.inquiries;

-- Public can submit inquiries (insert)
create policy "Anyone can insert inquiries"
on public.inquiries
for insert
with check (true);

-- Authenticated admins can view inquiries
create policy "Authenticated users can select inquiries"
on public.inquiries
for select
to authenticated
using (true);

-- Authenticated admins can update inquiry status
create policy "Authenticated users can update inquiries"
on public.inquiries
for update
to authenticated
using (true);

-- Authenticated admins can delete inquiries
create policy "Authenticated users can delete inquiries"
on public.inquiries
for delete
to authenticated
using (true);
