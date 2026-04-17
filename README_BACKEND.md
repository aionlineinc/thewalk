# Backend / Dokploy setup (Phase 1)

## Services (local via Docker)
- **Postgres**: `db` on `localhost:5432`
- **Directus CMS**: `cms` on `http://localhost:8055`
- **Next.js app**: `web` on `http://localhost:3000`

Start:

```bash
docker compose up --build
```

## Database + Prisma migrations
This repo uses Prisma with Postgres. In Dokploy (or any container deploy), run:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

If you are running Postgres locally without Docker, ensure the `DATABASE_URL` user has privileges.

## Auth env vars
Required:
- `DATABASE_URL`
- `AUTH_SECRET`

Optional:
- `NEXT_PUBLIC_APP_URL`

## Quick smoke test
1. Visit `/register`, create an account.\n+2. Navigate to `/admin`.\n+\n+If you are not logged in, middleware will redirect to `/sign-in`.\n+

