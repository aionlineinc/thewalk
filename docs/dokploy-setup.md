# Dokploy Deployment Notes

## Build Configuration

- Build type: `dockerfile`
- Dockerfile path: `Dockerfile`
- Docker context: `/`
- Exposed port: `3000`

## Required Runtime Environment

Set these in Dokploy application environment:

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

## Optional Environment

Set these if/when corresponding integrations are enabled:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
STRAPI_API_URL=https://your-strapi-host
```

## Static files vs volumes

- **`public/` is baked into the image** (`Dockerfile` copies `/app/public` in the `runner` stage). Anything committed in Git under `public/` is deployed on every rebuild. Missing images (for example a logo path referenced in code but not in the repo) are **not** a Dokploy retention issue—they were never in the build.
- **Use a Dokploy volume** when the app (or a sidecar) **writes files at runtime** and those files must survive redeploys or container replacement—for example:
  - User or admin uploads (if you store them on disk instead of S3 / Strapi / a bucket)
  - SQLite or other file-backed databases
  - Local caches or generated files you cannot regenerate

For this Next.js app today, **logos and marketing assets** should live in `public/` in Git (or a CDN). A volume does not replace that unless you change the code to read assets from a mounted path (see below).

## Optional: persistent volume for uploads

If you add runtime file storage (e.g. `public/uploads` or a dedicated folder):

1. In Dokploy, create a **volume** (named volume or bind mount on the host).
2. Mount it into the application container at a path your code uses, e.g. `/app/data/uploads` (avoid mounting over all of `/app/public` unless you intend to replace the entire `public` tree from the image).
3. In Next.js, serve those files via a **route handler** or `rewrites` to that directory, or symlink only the subdirectory you need inside the image (advanced).

Mounting a volume on **`/app/public` wholesale** hides the image’s built-in `public` files; prefer a **nested** mount (e.g. `/app/public/uploads`) or a path outside `public` plus explicit serving logic.

## Notes

- The project uses Next.js standalone output for container deploys.
- The current Dokploy app is `theWalk / web` (`thewalk-web-l7fpkb`).
- Attach a domain in Dokploy after the app is healthy.
