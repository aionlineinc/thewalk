# inLovingMemory (Application B)

Next.js app in this monorepo for **inlovingmemory.cloud** (public URLs + memorial flows). Shares PostgreSQL and Prisma schema with the main theWalk site.

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
docker run --rm -e DATABASE_URL="postgresql://..." -p 3001:3001 ilm:local
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

Point your ILM hostname (e.g. `inlovingmemory.cloud`) at this service. On the **main** theWalk deployment, set `ILM_APP_URL` to that same public URL for admin sidebar links.
