# PRINCEFILMS Admin setup

The new dashboard is available at `/admin` (GitHub Pages URL: `/princefilms_website/admin`).

## Configure the secure backend

1. Create a Supabase project and create an administrator account with the email you intend to use.
2. In Supabase SQL Editor, run `supabase/admin_setup.sql`.
3. Set the administrator's **app_metadata** role to `admin` using the Supabase Dashboard / trusted server-side Admin API. Do not set this in user-editable metadata. The SQL policies check this claim on every database and Storage operation.
4. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ADMIN_EMAIL` to your local `.env.local` and GitHub Pages build environment. See `.env.example`.
5. Use only the publishable/anon key in the browser. Never expose a service-role key or an admin password in Vite variables, source code, commits, or GitHub Pages.
6. Use a strong, unique administrator password and enable MFA in Supabase. The password previously shared in chat should be changed before using the admin account.

## Admin capabilities

- Password sign-in through Supabase Auth and email allowlist check.
- Film metadata: title, slug, year, synopsis, release date, runtime, quality, category tags, interpreter, audio language, subtitles and featured flag.
- Poster and video file upload to Supabase Storage, or URL fields for externally hosted media.
- Trailer URL, draft/published state, catalogue listing, edit, publish/unpublish and delete.
- Database and Storage authorization enforced by Supabase Row Level Security (RLS), not by the React route.

## Important current integration limitation

This repository's public pages currently render the built-in sample catalogue in `src/data/catalog.ts`. The admin dashboard saves new entries to Supabase `public.films`, but this commit does **not** yet replace the static public catalogue with a live database feed. Publishing in the dashboard changes the database record only; the title will not appear on the existing homepage until that public catalogue integration is implemented. Do not treat the dashboard as production-ready publishing until that integration is completed and tested.

Large feature films should be delivered through a dedicated video CDN/streaming provider with adaptive HLS/DASH, not uploaded as huge files to ordinary object storage.
