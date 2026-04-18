# theWalk CMS (Directus) — Pages + Sections architecture

This doc is the single source of truth for how the marketing site reads
editable content out of Directus. Read this before adding new pages,
editing section types, or wiring new frontend routes to the CMS.

## High-level design

```
pages (status, slug, title, SEO)
  └─ sections  (M2A: ordered list, any of 12 section types)
       ├─ section_hero
       ├─ section_rich_text
       ├─ section_feature_cards   (→ section_feature_cards_items)
       ├─ section_image_split
       ├─ section_stats           (json-repeater items)
       ├─ section_ministry_tabs   (→ section_ministry_tabs_tabs)
       ├─ section_cta_banner
       ├─ section_timeline        (→ section_timeline_items)
       ├─ section_faq             (json-repeater items)
       ├─ section_testimonials    (→ section_testimonials_items)
       ├─ section_gallery         (→ section_gallery_items)
       └─ section_logo_strip      (→ section_logo_strip_items)

site_settings (singleton)        — logos, social, SEO defaults, contact
articles, courses                 — unchanged from earlier iteration
```

Every section type has a **Zod schema** in `src/lib/cms/schemas.ts`.
Sections that fail validation are dropped on read (see `parseSections` in
`src/lib/cms/fetch.ts`) — the rest of the page still renders. Pages that
fail top-level validation return `null`, which route handlers must treat as
"use the hardcoded fallback".

## Editor workflow

1. Log in to https://cms.thewalk.org/admin
2. Open **Pages** → **New Item** (or edit an existing row)
3. Set `slug`, `title`, `status` to `published`
4. In the **sections** builder, click **Create Item** → pick a section type
   → fill in its fields. Repeat. Drag to reorder.
5. For sections with nested items (cards, tabs, gallery, testimonials,
   timeline, logo strip), open the created section to add child rows.
6. Click **Save**. A Directus Flow automatically pings the site's
   `/api/revalidate` endpoint so the change is live within ~5 seconds.

## Frontend contract

- `getPage(slug)` in `src/lib/cms/fetch.ts` returns a validated `Page` or
  `null`. Always fall back to hardcoded scaffold when `null`.
- `cmsAsset(fileRef, transforms)` and `cmsAssetPresets.*` build image URLs.
  Always pass a transform so hero slots stay consistent (width/fit/format).
- `<PageRenderer sections={page.sections} overrides={...} />` renders the
  section list. **Pages MUST pass `overrides`** mapping each section type to
  the page's existing visual component — the default renderers in
  `src/components/cms/sections/` are minimal fallbacks, not production
  designs. If you see a default component in production, it means a page is
  missing an override.

Typical page route:

```tsx
import { getPage } from "@/lib/cms";
import { PageRenderer } from "@/components/cms/PageRenderer";
import { HomeHero } from "@/components/home/HomeHero";
// ...

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) return <HardcodedFallback />;
  return (
    <PageRenderer
      sections={page.sections}
      overrides={{
        section_hero: HomeHero,       // existing component accepts {section,index}
        section_feature_cards: HomeFeatures,
        // etc.
      }}
    />
  );
}
```

## Extending: new section type

1. Create the collection in Directus (use `scripts/cms/setup_pages_schema.py`
   as a template — add a new `build_section_*` function + append the name
   to `SECTION_COLLECTIONS`).
2. Re-run `setup_pages_schema.py`; it's idempotent. Update
   `one_allowed_collections` on `pages_sections.item` in the Data Studio
   **Relations** panel so the new collection appears in the M2A picker.
3. Add a Zod schema + discriminated-union case in
   `src/lib/cms/schemas.ts`.
4. Add fetch-layer expansions in `src/lib/cms/fetch.ts` (if the new section
   has nested items or file fields).
5. Add a default renderer in `src/components/cms/sections/`.
6. (Per-page) add an override to the relevant page route.

## Extending: new page

1. In Directus, **Pages → New Item**, fill `slug = my-page`, pick section
   types, save as `published`.
2. In the repo, create the route file (e.g.
   `src/app/my-page/page.tsx`) that calls `getPage("my-page")` and renders
   with `<PageRenderer>` + appropriate overrides.

The Data Studio cannot auto-create new routes in Next.js — that's a
deliberate boundary: routes are owned by code, content by editors.

## Permissions

The Public policy (unauth users) can read:

- `pages` where `status == "published"`
- `section_*` where `status == "published"` (top-level sections only)
- `section_*_items`, `section_*_tabs`, `pages_sections` — unrestricted
  (they're only reachable via a published page anyway)
- `site_settings` — unrestricted singleton

Drafts are visible only if `DIRECTUS_TOKEN` is set in the Next.js
environment (admin/staff preview).

## Revalidation

A Directus Flow (`Revalidate Next.js on content change`) posts to
`${NEXT_PUBLIC_APP_URL}/api/revalidate` on any create/update/delete in any
CMS collection. The endpoint requires `x-revalidate-secret` to match
`REVALIDATION_SECRET` in the Next.js env.

Required Dokploy env vars on the `web` app:

```
NEXT_PUBLIC_CMS_URL=https://cms.thewalk.org
REVALIDATION_SECRET=<32-byte hex, matching the Flow's operation header>
```

To re-run the Flow setup (e.g. after rotating the secret):

```
REVALIDATION_URL=https://v2.thewalk.org/api/revalidate \
REVALIDATION_SECRET=<new-secret> \
DIRECTUS_TOKEN=<admin-token> \
python3 scripts/cms/setup_revalidation_flow.py
```

## Scripts

- `scripts/cms/setup_pages_schema.py` — creates/ensures all collections,
  fields, relations, M2A, and public read permissions. Idempotent.
- `scripts/cms/setup_revalidation_flow.py` — creates/updates the
  revalidation Flow + its webhook operation.
- `scripts/cms/smoke_test.py` — verifies the M2A round-trip works end to
  end by creating a test page + hero, fetching with the production field
  list, then cleaning up.

## Wave plan (rollout)

- **Wave 0** (done) — Schema + fetch layer + renderer + revalidation.
- **Wave 1** — Home + Sign in + Register/Group. Wire via overrides to
  existing visual components. Upload production hero images. Verify no
  visual regression against the hardcoded fallback.
- **Wave 2** — About + About/Beliefs + About/Ministry Structure + Contact.
- **Wave 3** — Journey overview + Cross Over/Roads/Connect.
- **Wave 4** — Growth hub + listings + Services + Shop + Donations +
  Get involved.
- **Wave 5** — `site_settings` (nav/footer logos, socials, defaults) +
  legal pages.

Each wave: CMS seed → component override wiring → visual check → ship.
