<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7bebb335-6fc4-4546-8913-3084099c3572

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Supabase Production Image Storage

This version includes Supabase-ready image upload for Admin CMS.

Files added:
- `src/lib/supabase.ts`
- `src/components/ProductionImageManager.tsx`
- `supabase/setup.sql`
- `.env.example`
- `SUPABASE_SETUP.md`

To enable real image saving after deployment, follow `SUPABASE_SETUP.md`.

Run:

```bash
npm install
npm run dev
```
