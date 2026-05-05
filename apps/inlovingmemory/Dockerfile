# inLovingMemory — build from monorepo root (Dokploy: context `.`, Dockerfile `apps/inlovingmemory/Dockerfile`)
FROM node:20-bookworm-slim AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY apps/inlovingmemory/package.json ./apps/inlovingmemory/package.json
ENV NPM_CONFIG_LOGLEVEL=error
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false
RUN npm ci

FROM node:20-bookworm-slim AS builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_ILM_URL=""
ENV NEXT_PUBLIC_ILM_URL=$NEXT_PUBLIC_ILM_URL
RUN node ./node_modules/.bin/prisma generate
RUN npm run build:ilm

FROM node:20-bookworm-slim AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ARG GIT_COMMIT=""
ENV GIT_COMMIT=$GIT_COMMIT

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Next standalone trace (workspace layout keeps server under apps/inlovingmemory/)
COPY --from=builder /app/apps/inlovingmemory/.next/standalone ./
COPY --from=builder /app/apps/inlovingmemory/.next/static ./apps/inlovingmemory/.next/static

# Same DB as theWalk — share migrations (safe if main app also runs migrate deploy)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Prisma CLI resolves WASM next to the `.bin/prisma` shim at runtime.
COPY --from=builder /app/node_modules/prisma/build/prisma_schema_build_bg.wasm ./node_modules/.bin/prisma_schema_build_bg.wasm

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3001

# Sync auth secrets so setting only AUTH_SECRET (e.g. copied from main app) still satisfies NextAuth + middleware.
CMD ["sh", "-c", "if [ -z \"${NEXTAUTH_SECRET}\" ] && [ -n \"${AUTH_SECRET}\" ]; then export NEXTAUTH_SECRET=\"${AUTH_SECRET}\"; fi; if [ -z \"${AUTH_SECRET}\" ] && [ -n \"${NEXTAUTH_SECRET}\" ]; then export AUTH_SECRET=\"${NEXTAUTH_SECRET}\"; fi; if [ -n \"${DATABASE_URL}\" ]; then node ./node_modules/.bin/prisma migrate deploy || echo \"[warn] prisma migrate deploy failed\"; else echo \"[warn] DATABASE_URL not set; skipping migrate\"; fi; exec node apps/inlovingmemory/server.js"]
