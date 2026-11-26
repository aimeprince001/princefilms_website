# PRINCEFILMS Admin Dashboard

The admin dashboard is available at `/admin`. It uses Appwrite account sessions, team membership checks, and the live Films TablesDB table.

## Appwrite project configuration

The project IDs are already configured in the dashboard and in `.env.example`:

- Project: `6b06ada200214ac45e1c` (Prince Films Web)
- Database: `6b06af44002b3eaf1968` (Production TablesDB)
- Films table: `6b06afcf00168819da09` (Films)
- Admin team: `6b07130300050ff55713` (PRINCEFILMS-ADMINS)

Copy `.env.example` to `.env.local` only if you need to override the defaults. Never commit `.env.local`.

## Enable administrator access

The admin screen verifies the signed-in Appwrite user's membership in the PRINCEFILMS-ADMINS team and requires a role named `admin`.

1. In Appwrite Console, open **Auth → Settings → Platforms** and add the website origin (for local testing, `http://localhost:5173`; add your deployed domain too).
2. Open **Teams → PRINCEFILMS-ADMINS**.
3. Add the Appwrite user you will use to sign in to the website.
4. Assign the membership role `admin` (not just a team membership with another role).
5. Ensure the team/table/row permissions allow administrators to read, create, update, and delete rows in Films.

The connected project was inspected while setting up this dashboard: the Films table exists and currently has 18 columns. It returned no film rows at the time of inspection. The admin team also returned no memberships, so add your administrator account before signing in.

## Supported film columns

The editor uses the table's existing column metadata and only submits fields that exist. The current table contains:

- String: `title`, `description`, `genre`, `posterId`, `videoUrl`, `language`, `quality`, `rating`, `director`, `cast`, `trailerUrl`, `subtitleLanguages`, `createdBy`
- Integer: `releaseYear`, `duration`, `views`
- Boolean: `published`, `featured`

`cast` and `subtitleLanguages` are scalar strings (comma-separated), not array columns.

## Run locally

```bash
cd PRINCEFILMS
npm install
npm run dev
```

Open the Vite address and visit `/admin`.

**Security:** The dashboard's membership check protects the UI, but Appwrite table/row permissions must also enforce access. Never put an Appwrite API key in a `VITE_*` variable or browser code.
