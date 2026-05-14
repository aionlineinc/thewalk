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
| `ILM_S3_BUCKET` | S3 **bucket** name (Wasabi: create bucket in Wasabi console; R2: create bucket in Cloudflare). |
| `ILM_S3_ENDPOINT` | S3 API **endpoint** (Wasabi: `https://s3.wasabisys.com` or region-specific like `https://s3.us-east-1.wasabisys.com`; R2: `https://$ACCOUNT_ID.r2.cloudflarestorage.com`). |
| `ILM_S3_REGION` | Region string (Wasabi: `us-east-1` or your bucket region; R2: `auto`). |
| `ILM_S3_ACCESS_KEY_ID` / `ILM_S3_SECRET_ACCESS_KEY` | API credentials with write access to the bucket (Wasabi: create in IAM → Users; R2: create API token). |
| `ILM_S3_PUBLIC_BASE_URL` | **HTTPS URL prefix** where objects are readable publicly (Wasabi: `https://<bucket>.s3.wasabisys.com` or a CDN custom domain; R2: custom domain or `r2.dev`), no trailing slash. |

**Photo uploads** use presigned PUTs. The browser must be allowed to `PUT` to the bucket: configure **CORS** on the bucket (e.g. allow your ILM origin, `PUT`, `GET`, `HEAD`, and `Content-Type` header). Without `ILM_S3_*`, the **Photos** page explains that storage is not configured.

### Cloudflare R2 setup

**Env vars for R2:**

| Variable | Value |
|---|---|
| `ILM_S3_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `ILM_S3_REGION` | `auto` |
| `ILM_S3_BUCKET` | your R2 bucket name |
| `ILM_S3_ACCESS_KEY_ID` | R2 API token ID (create in Cloudflare → R2 → Manage API tokens) |
| `ILM_S3_SECRET_ACCESS_KEY` | R2 API token secret |
| `ILM_S3_PUBLIC_BASE_URL` | Custom domain or `https://pub-<hash>.r2.dev` (enable public access on the bucket first) |

**R2 CORS** — in the Cloudflare dashboard go to **R2 → your bucket → Settings → CORS Policy** and paste:

```json
[
  {
    "AllowedOrigins": ["https://your-ilm-domain.com", "http://localhost:3001"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

Replace `https://your-ilm-domain.com` with your actual ILM deployment URL. For local dev only, `http://localhost:3001` is sufficient.

**R2 public access** — on the bucket's **Settings** page enable **"Allow Public Access"** (or connect a custom domain). Copy the `r2.dev` subdomain URL (or your custom domain) as `ILM_S3_PUBLIC_BASE_URL`.

---

### Wasabi CORS configuration

In the Wasabi console, go to your bucket → **Settings** → **CORS Configuration** and add:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://your-ilm-domain.com</AllowedOrigin>
    <AllowedOrigin>http://localhost:3001</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

### Wasabi public access

By default, Wasabi buckets are private. To serve photos publicly:

1. In the bucket settings, enable **public access** or set up **bucket policies** to allow `s3:GetObject` for public visitors.
2. Set `ILM_S3_PUBLIC_BASE_URL` to `https://<bucket>.s3.wasabisys.com` (Wasabi's direct bucket URL) or put a CDN in front.
3. If using Wasabi's direct URL, also enable **"Static website hosting"** on the bucket settings.

**`NO_SECRET` in logs:** The ILM container has no `AUTH_SECRET` / `NEXTAUTH_SECRET`, or they were only set at build time. Set them on the **runtime** service in Dokploy (same value as the main app) plus **`NEXTAUTH_URL`**, then redeploy. The app reads these with runtime-safe lookups so Docker-injected secrets are visible after deploy.

## Apex domain vs subdomain cookies

- **Apex (e.g. `inlovingmemory.cloud`)**: leave `AUTH_COOKIE_DOMAIN` **unset**. Cookies will be scoped to that host.\n
- **Subdomain under theWalk (e.g. `ilm.thewalk.org`)**: if you want a shared login across `thewalk.org` and `ilm.thewalk.org`, set `AUTH_COOKIE_DOMAIN=.thewalk.org` **on both deployments**.\n
- **Important**: Browsers cannot share cookies across unrelated domains (you cannot share a session between `inlovingmemory.cloud` and `thewalk.org`). If you run ILM on both an apex domain and a theWalk subdomain, treat them as two separate sessions.\n
- **Always set `NEXTAUTH_URL` to the exact public URL** of the deployed instance (apex vs subdomain) so callbacks and cookie security settings are correct.

Point your ILM hostname at this service. On the **main** theWalk deployment, set `ILM_APP_URL` to that same public URL for admin sidebar links.

## CMS (Directus)

ILM marketing content is read from the shared Directus instance (see repo root **`docs/cms.md`**). Page slug for the ILM home experience: **`ilm-home`**.

**Optional:** With the workspace **Directus MCP** enabled in Cursor, you can have an agent inspect or adjust `ilm-home` sections and file references; confirm changes in the admin UI afterward.
