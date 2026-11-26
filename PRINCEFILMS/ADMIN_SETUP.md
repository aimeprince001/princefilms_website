# PRINCEFILMS Admin Dashboard setup

The admin dashboard is available at `/admin` and uses Appwrite account sessions, Appwrite Teams membership, and the Films TablesDB table.

## 1. Configure environment variables

Copy `.env.example` to `.env.local` in this `PRINCEFILMS` folder. Keep `.env.local` out of Git.

Fill in:
- `VITE_APPWRITE_DATABASE_ID`: the ID of your **Production TablesDB** database (not its display name).
- `VITE_APPWRITE_ADMIN_TEAM_ID`: the ID of the `PRINCEFILMS-ADMINS` team (not its name).

The project endpoint and project ID are already prefilled in `.env.example`. The Films table ID defaults to `films`.

For Vercel/Netlify or another deployment, add the same `VITE_...` variables to the project's environment settings and redeploy.

## 2. Appwrite console setup

1. In Appwrite, open **Auth → Settings → Platforms** and add your website's domain (localhost for local development and your deployed domain).
2. Open **Teams → PRINCEFILMS-ADMINS** and copy its team ID into `VITE_APPWRITE_ADMIN_TEAM_ID`.
3. Add your administrator account to that team with the role `admin`.
4. Open **Databases → Production TablesDB → Films** and copy the database ID into `VITE_APPWRITE_DATABASE_ID`.
5. Ensure the administrator team has the required read, create, update, and delete permissions for the Films table/rows. The admin page will only show the dashboard after it verifies the signed-in user's membership and admin role.

## 3. Supported film columns

The dashboard submits values for the existing film fields and checks the table's column metadata before saving, so fields not yet created in your table are omitted. Recommended field types:
- `title`, `description`, `genre`, `posterId`, `videoUrl`, `language`, `quality`, `rating`, `director`, `cast`, `trailerUrl`, `subtitleLanguages`, `createdBy`: String
- `releaseYear`, `duration`, `views`: Integer
- `published`, `featured`: Boolean

Use scalar String columns for `cast` and `subtitleLanguages` (comma-separated values), not Appwrite array columns.

## 4. Run locally

```bash
cd PRINCEFILMS
npm install
npm run dev
```

Open the local Vite URL and visit `/admin`.

**Important:** This dashboard protects its interface with Appwrite team membership. Also configure Appwrite table/row permissions correctly; frontend checks alone are not a replacement for backend permissions.
