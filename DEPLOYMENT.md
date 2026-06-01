# PSIS Deployment

This project builds two independent app entries:

- Public website: `dist/index.html`
- Admin CMS: `dist/admin.html`

## Local URLs

```txt
http://localhost:3000
http://localhost:3000/admin.html
```

## Production Domains

```txt
https://psis.edu.kh       -> public website
https://cms.psis.edu.kh   -> admin CMS
```

## Build

```bash
npm install
npm run build
```

## Vercel Setup

The included `vercel.json` is prepared for:

- `psis.edu.kh` serving the public website
- `cms.psis.edu.kh` serving the Admin CMS

In Vercel, add both domains to the same project:

```txt
psis.edu.kh
cms.psis.edu.kh
```

Then point DNS records to Vercel as instructed by the Vercel domain screen.

## Google Sheet CMS

Keep this environment variable set in production:

```txt
VITE_GOOGLE_SHEET_CMS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

The same Google Sheet / Google Drive integration is used by the public site and Admin CMS.
