# inLovingMemory (Application B)

Next.js app in this monorepo for the public ILM site. **Today** that may be a hostname such as `ilm.thewalk.org`; when you move to a dedicated domain (e.g. **inlovingmemory.cloud**), change only environment variables and DNS—no code change is required if URLs are env-driven. Shares PostgreSQL and Prisma schema with the main theWalk site.

## Local dev

From repo root:

```bash
npm install
npm run dev:ilm
```

Open `http://localhost:3001`. Health: `GET /api/health`.

## Docker (matches Dokploy)

Build context must be the **repository root**.

```bash
docker build -f apps/inlovingmemory/Dockerfile -t ilm:local .
docker run --rm \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH_SECRET="same-as-main-app" \
  -e NEXTAUTH_URL="http://localhost:3001" \
  -p 3001:3001 ilm:local
```

Or with Compose (includes Postgres):

```bash
docker compose up --build ilm
```

Service listens on **3001**. Set `NEXT_PUBLIC_ILM_URL` to the public URL at **image build time** if metadata/OG URLs must be correct (e.g. `--build-arg NEXT_PUBLIC_ILM_URL=https://inlovingmemory.cloud`).

Optional runtime/build: `GIT_COMMIT` for `/api/health` (`docker build --build-arg GIT_COMMIT=$(git rev-parse --short HEAD)`).

## Dokploy

| Field | Value |
|-------|--------|
| Build context | `.` (repo root) |
| Dockerfile | `apps/inlovingmemory/Dockerfile` |
| Container port | **3001** |
| `DATABASE_URL` | Same Postgres as main app (shared migrations) |
| `NEXT_PUBLIC_ILM_URL` | Public site URL (recommended as Docker **build arg** for accurate metadata) |
| `AUTH_SECRET` | **Required in production.** Same value as the main theWalk app. |
| `NEXTAUTH_SECRET` | Same string as `AUTH_SECRET`. If you only set one in Dokploy, set `AUTH_SECRET`; the Docker image maps it to `NEXTAUTH_SECRET` at startup. |
| `NEXTAUTH_URL` | **Required in production.** Canonical public URL of this app, e.g. `https://ilm.thewalk.org` or `https://inlovingmemory.cloud`. |
| `AUTH_COOKIE_DOMAIN` | Optional. While ILM is on a subdomain of `thewalk.org`, set `.thewalk.org` if you want session cookies shared with the apex site. When ILM runs only on its own apex domain, **omit** this so cookies stay on that host. |
| `NEXT_PUBLIC_THEWALK_ORIGIN` | Optional. Marketing/auth site for “Create account” links (default `https://thewalk.org`). |

**`NO_SECRET` in logs:** The ILM container has no `AUTH_SECRET` / `NEXTAUTH_SECRET`, or they were only set at build time. Set them on the **runtime** service in Dokploy (same value as the main app) plus **`NEXTAUTH_URL`**, then redeploy. The app reads these with runtime-safe lookups so Docker-injected secrets are visible after deploy.

Point your ILM hostname at this service. On the **main** theWalk deployment, set `ILM_APP_URL` to that same public URL for admin sidebar links.
