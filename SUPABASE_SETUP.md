# PSIS Supabase Image Storage Setup

This project now includes Supabase-ready image upload for the Admin CMS.

## What was added

- `src/lib/supabase.ts`
- `src/components/ProductionImageManager.tsx`
- Admin CMS Image Assets tab now supports Supabase image upload
- `.env.example`
- `supabase/setup.sql`
- `SUPABASE_SETUP.md`

## What it does

Admin can upload and save:

- Hero banner images
- Campus photos
- News images
- Partner logos
- Student life gallery images
- PSIS / AYLA logos

Uploaded images are stored in:

```text
Supabase Storage bucket: psis-assets
```

Image metadata is saved in:

```text
public.cms_assets
```

This means after deployment, uploaded images remain saved and can be seen by all users.

## Step 1: Create Supabase Project

Go to Supabase and create a new project.

## Step 2: Run SQL

Open Supabase → SQL Editor → paste and run:

```text
supabase/setup.sql
```

This creates:

- `cms_assets` table
- `psis-assets` storage bucket
- Row-level security policies

## Step 3: Create `.env.local`

Copy `.env.example` to `.env.local`

```bash
cp .env.example .env.local
```

For Windows PowerShell:

```powershell
copy .env.example .env.local
```

Fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Find these values in Supabase:

```text
Project Settings → API
```

## Step 4: Install dependencies

```bash
npm install
```

## Step 5: Run

```bash
npm run dev
```

## Step 6: Use Admin CMS

Go to Admin CMS → Image Assets

If Supabase is configured, you will see the upload panel.

If not configured, the panel will show a warning.

## Important

This adds production-ready storage logic, but real admin authentication should be connected to Supabase Auth in the next phase.

Current Admin CMS role system may still be UI/demo based depending on your existing project code.
