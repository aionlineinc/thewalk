# inLovingMemory.cloud — Product Specification & Developer Brief

> **More than a memorial — a living legacy**
> Version 1.0 | May 2026 | theWalk Ministries Int'l — Confidential

---

| | |
|---|---|
| **Platform** | inlovingmemory.cloud (module of theWalk.org) |
| **Tech Stack** | Next.js · Dokploy · Prisma · PostgreSQL · Directus CMS |
| **Auth** | Shared SSO with theWalk.org |
| **Built with** | Cursor (AI-assisted development) |
| **Managed by** | theWalk.org Admin Dashboard |

---

## Table of Contents

1. [Overview & Vision](#1-overview--vision)
2. [Platform Architecture](#2-platform-architecture)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Tier Structure & Pricing](#4-tier-structure--pricing)
5. [Memorial Page — Feature Specification](#5-memorial-page--feature-specification)
6. [Generations Vault](#6-generations-vault)
7. [Organisation Accounts](#7-organisation-accounts)
8. [Prayer Wall & Ministry Integration](#8-prayer-wall--ministry-integration)
9. [Grief Counselling & Minister Registry](#9-grief-counselling--minister-registry)
10. [Physical Memorial Products](#10-physical-memorial-products)
11. [Admin Dashboard Specification](#11-admin-dashboard-specification)
12. [Technical Implementation Notes](#12-technical-implementation-notes)
13. [Open Items & Decisions Required](#13-open-items--decisions-required)

---

## 1. Overview & Vision

inLovingMemory is a full-service digital memorial and legacy platform built as a decoupled, modular extension of theWalk.org. It serves families, funeral homes, and ministries with tools to honour those who have passed, preserve family heritage across generations, and connect the bereaved to spiritual care and community.

The platform is shaped by theWalk's core conviction: that death is not the end of a story, but the end of this chapter of a walk. Every memorial is therefore framed not merely as a record of loss, but as the conclusion of a purposeful journey — and the beginning of a lasting legacy.

---

### Tagline

> *"More than a memorial — a living legacy"*

---

### Homepage Hero Copy

> Every life tells a story worth preserving. inLovingMemory gives families, funeral homes, and ministries a beautiful, lasting space to honour those who have passed — and to protect what matters most for the generations that follow.
>
> From a simple tribute page to a full digital funeral experience, from a public memorial to a private family vault — this is where memory becomes legacy.
>
> When someone's walk in this life ends, their story does not.

---

### About Us Page Copy

inLovingMemory was born out of theWalk Ministries' conviction that every life lived in faith — and every life lived at all — deserves to be honoured with dignity, remembered with love, and preserved with intention.

We are more than a memorial platform. We are a community of remembrance, grief support, and generational legacy. When you create a memorial here, you are not simply marking an end — you are protecting a beginning. A legacy that speaks to children not yet born, to family members not yet found, and to a community that carries someone's story forward.

Powered by theWalk Ministries Int'l, inLovingMemory connects the bereaved to pastoral care, grief counselling, prayer, and community — because grief was never meant to be faced alone.

This is where the end of one walk becomes the foundation of another.

---

### How It Works Page Copy

1. **Create your memorial** — Add basic details, a photo, and a life story in minutes. It's free to start.
2. **Personalise and share** — Upload photos, videos, audio tributes, and invite family and friends to contribute their own memories.
3. **Honour the service** — Build a full digital funeral programme with a pamphlet, QR codes, service details, and event pages.
4. **Preserve the legacy** — Unlock Generations, your private family vault, to store letters, documents, voice messages, and family history for those who come after.
5. **Connect to support** — Access grief counselling, prayer from theWalk ministry team, and community grief groups — all from within your memorial.

---

## 2. Platform Architecture

### System Overview

```
inlovingmemory.cloud  (standalone brand / domain)
   │
   ├── PUBLIC LAYER        Memorial pages, directory, guest book, prayer wall
   ├── PREMIUM LAYER       Digital funeral, planning tools, grief support, AI
   ├── GENERATIONS VAULT   Private family legacy (always paid)
   └── ADMIN DASHBOARD     Funeral homes, ministries — managed via theWalk.org
              │
              └──► theWalk.org  (shared SSO, single PostgreSQL, Directus CMS)
```

---

### Modularity & Decoupling Principles

- inLovingMemory is a Next.js module within the theWalk.org monorepo, isolated under `/apps/inlovingmemory` or equivalent workspace package.
- Shared services (auth, database, CMS, email) are consumed from theWalk core — not duplicated.
- The module exposes its own routing, UI components, and API routes. It does not bleed into other theWalk modules.
- Directus CMS manages all content (copy, resources, grief articles) and is shared across theWalk modules.
- Prisma schema is extended with inLovingMemory-specific models under a shared PostgreSQL instance, using prefixed table names (`ilm_*`).
- All media (photos, video, audio, documents) is stored in a dedicated S3-compatible object store (e.g., Cloudflare R2 or AWS S3) — not in the database.

---

### SSO & Account Logic

When a user registers at **inlovingmemory.cloud**:

- A theWalk.org account is created via shared SSO (NextAuth or similar).
- The user's dashboard defaults to inLovingMemory view — memorial management only.
- A persistent, dismissible banner reads: *"Expand your journey — access all of theWalk"* with a single CTA button.
- If the user already has a theWalk.org account, login at either domain grants access to both, with a role-aware redirect.
- Funeral home and ministry admin accounts are created by the theWalk Super Admin and scoped to their organisation only.

---

## 3. User Roles & Permissions

| Role | Scope | Key Permissions |
|---|---|---|
| Public Visitor | No account | View public memorials, sign guest book, submit prayer |
| Free Member | Personal | Create 1 Basic Memorial or Living Legacy page |
| Premium Member | Personal | Unlimited memorials, Generations add-on available, full feature access |
| theWalk Member | Personal | Free Premium access as a ministry benefit — auto-assigned on registration |
| Page Keeper | Per memorial | Full admin of their specific memorial page(s), media moderation, Generations mgmt |
| Generations Guardian | Per vault | Designated successor — takes ownership of vault on owner incapacity/passing |
| Counsellor / Minister | Platform service | Assigned to memorials for grief support, specifies counselling specialisations |
| Funeral Home Admin | Organisation | Create & manage all org memorials, manage staff sub-accounts, billing |
| Ministry Admin | Organisation | Manage congregation memorials, prayer routing, Connect8/myWalk integration |
| Platform Super Admin | Global (theWalk.org) | Full platform oversight, billing, content moderation, all org accounts |

---

## 4. Tier Structure & Pricing

> **Note:** All prices are recommendations based on industry standards and comparable platforms (MyKeeper, Ever Loved, GatheringUs). They are stored in Directus CMS — no hard-coded pricing in the codebase.

---

### Feature Comparison

| Feature | Basic (Free) | Premium | Generations |
|---|---|---|---|
| Memorial pages | 1 | Unlimited | N/A (standalone or add-on) |
| Living Legacy page | 1 | Unlimited | Included |
| Photo uploads | 20 (max 5 MB each) | Unlimited (10 MB each) | Unlimited |
| Direct video upload | — | Up to 500 MB total | Unlimited |
| YouTube / Vimeo embed | 1 | Unlimited | Unlimited |
| Audio tributes | 1 (max 10 MB) | Unlimited | Unlimited |
| Guest book (text) | ✓ | ✓ | ✓ |
| Guest media submissions | — | ✓ (moderated) | ✓ |
| AI obituary assistant | — | ✓ | ✓ |
| Digital funeral pamphlet | — | ✓ | — |
| QR code (pamphlet) | — | ✓ | ✓ |
| Funeral event pages | — | ✓ | — |
| Order of service builder | — | ✓ | — |
| Family tree (public) | — | ✓ | — |
| Resting place / geo-tag | — | ✓ | — |
| Content moderation controls | — | ✓ | ✓ |
| Multiple Page Keepers | — | ✓ | ✓ |
| Privacy controls | Public or password | Full granular | Invite-only |
| Hide from search engines | — | ✓ | ✓ |
| Prayer wall | ✓ | ✓ | ✓ |
| Grief counselling (basic) | — | ✓ (included) | ✓ |
| Grief resource library | — | ✓ | ✓ |
| Generations vault | — | Add-on | ✓ (core) |
| Time-locked messages | — | — | ✓ |
| Private family tree | — | — | ✓ |
| Faith & legacy section | — | — | ✓ |
| Guardian designation | — | — | ✓ |
| Physical products | — | ✓ | ✓ |
| Annual maintenance option | — | ✓ | ✓ |

---

### Recommended Pricing

| Plan | Price | Notes |
|---|---|---|
| Basic Memorial | Free | Always free. No expiry, no trial period. |
| Memorial Premium | USD $89 one-time | Comparable: MyKeeper Plus at $99. Includes full digital funeral package. |
| Generations Vault | USD $49/year | Annual model funds ongoing storage and maintenance. |
| Annual Maintenance Fee | USD $19/year | Active management support after one-time purchase. |
| theWalk Members | Free Premium | Generations available at USD $19/year (reduced rate). |
| Concierge Setup | USD $299 one-time | Expert builds and populates the memorial. Includes one 30-min virtual meeting. |

> Funeral home and ministry org pricing is on a separate volume-based schedule — see [Section 7](#7-organisation-accounts).

---

## 5. Memorial Page — Feature Specification

### 5.1 Basic Memorial (Free Tier)

- Custom URL: `inlovingmemory.cloud/memorial/[slug]`
- Profile: name, dates, age, profile photo, banner image
- Biography / life story (rich text, no AI)
- Family listing — structured fields (parents, siblings, children, cousins, friends)
- Photo gallery — up to 20 images (5 MB each), lightbox viewer
- 1 embedded video (YouTube or Vimeo link)
- 1 audio file upload (10 MB max)
- Order of Service — 1 PDF upload
- Funeral service details: date, time, venue, internment location
- Guest book — text condolences, moderated by Page Keeper
- Privacy: public or password-protected
- Prayer wall (see [Section 8](#8-prayer-wall--ministry-integration))
- Social sharing (WhatsApp, Facebook, email, link copy)

---

### 5.2 Memorial Premium — Additional Features

#### Digital Funeral & Memorial Services

- **Digital funeral pamphlet builder**
  - Drag-and-drop template editor (name, photo, biography, order of service, scriptures, acknowledgements)
  - Branded output: family can upload logo or choose from templates
  - Export as print-ready PDF and shareable web link
  - Auto-generated QR code linking the printed pamphlet to the live memorial page
  - QR code embeddable in the pamphlet PDF at generation time
- Funeral event pages: virtual / in-person / hybrid with live stream embed (YouTube / Vimeo / Zoom)
- Order of service programme builder with sections, hymns, readings, speaker names, timing
- Viewing / visitation schedule builder with venue details
- Pre-funeral planning checklist (editable, shareable with funeral home partner)
- Floral tribute coordination — link to partner florist or custom note field

#### Rich Media

- Unlimited photo uploads (10 MB each)
- Direct video upload — up to 500 MB total per memorial
- Unlimited audio tribute uploads
- Guest-submitted media (photos, video links, audio) with moderation controls
- Story templates — highlight key life moments (milestone, favourite things, quote, memory)
- Albums — organise media into named collections

#### Memorial Page Enhancements

- Family tree — visual, linked to other memorials on the platform
- Loved Ones — featured section for key people
- Resting place — photo of headstone / grave marker + geo-tag with directions
- Full granular privacy: public, password-protected, family-only, section-level
- Hide from search engines toggle
- Multiple Page Keepers — invite co-admins by email
- Content moderation — auto-publish or approve-before-publish for all guest submissions
- **AI obituary assistant** — guided prompts generate a full draft, editable before publishing (Claude API)
- Unlimited memorial pages per account
- Annual maintenance fee option for managed ongoing support

---

### 5.3 Living Legacy Pages

A Living Legacy is a memorial page created for a person who is **still alive** — a proactive act of preservation, not of grief. Available on both Free and Premium tiers from launch.

- Clearly labelled as 'Living Legacy' in the UI — distinct visual treatment from deceased memorials
- All the same features as a standard memorial page apply
- Can be converted to a memorial page at any time by the Page Keeper
- Ideal for elderly family members, ministry leaders, or anyone wishing to preserve their story now
- Automatically suggested as a Generations Vault companion (upsell prompt)

---

### 5.4 Public Directory

- **Find a Memorial** — searchable public directory of non-private memorial pages
- Search by name, date, location, or keyword
- Filter: memorial type (deceased / living legacy), associated ministry, funeral home
- Each listing shows: name, dates, profile photo, short biography excerpt, and link to full page
- Option for Page Keeper to exclude their memorial from the directory (privacy toggle)

---

## 6. Generations Vault

Generations is the private, paid legacy layer of inLovingMemory. It can be attached to any memorial (free or premium) or exist as a **completely standalone vault with no public memorial** — making it suitable for living individuals who want to begin preserving their family's legacy now.

### Standalone Vault Use Cases

- A living grandparent documenting family history, cultural heritage, and personal testimonies
- A minister or elder preserving their faith journey and discipleship legacy
- A family creating a shared archive that outlives any individual — an ongoing generational project
- A parent writing time-locked messages to children for future milestones

---

### 6.1 Vault Sections

#### Legacy Documents & Archives

- Upload: documents (PDF, Word), photos, video, audio — no hard storage cap (paid tier)
- Each item has: title, date, location, description, tagged people, privacy level
- Organise into named **Collections** (e.g., "Dad's Military Service", "Family — Barbados Branch")
- Collections can be nested (sub-collections) for deep family histories
- Items are searchable by keyword, person tagged, date, or collection

#### Messages to the Future — Time-Locked Delivery

- Create a message: text, audio recording, or video upload
- Address it to: a specific person (by email) or a role (e.g., "My firstborn grandchild")
- **Lock trigger options:**
  - Specific date: *"Deliver on January 1, 2040"*
  - Milestone: *"When [named person] turns 18"*
  - On passing: *"Deliver when the Vault Owner is marked as deceased"* — triggered by a Guardian
  - Manual release: Guardian can release at any time
- Once locked by owner, message content is **frozen — no edits** (integrity preserved)
- Delivery method: email notification + in-app unlock with a private viewer
- Recipient does not need a Generations account — a secure one-time link is emailed
- Owner can draft and revise messages freely until they choose to lock them
- System prompts owner annually: *"You have X draft messages — are you ready to lock any of them?"*

#### Family History & Heritage

- Long-form narrative builder — write family history in chapters and sections
- Ancestral records: places of origin, migration journeys, historical context
- Cultural heritage: traditions, languages, customs, recipes, celebrations
- Faith heritage: denominational background, significant ministers in the family's history

#### Private Family Tree

- Deeper and more detailed than the public memorial family tree
- Private notes per person: relationship context, personal history, health notes (optional, owner-controlled)
- Link family members to their own memorials or Generations vaults on the platform
- **GEDCOM import/export** for compatibility with Ancestry, FamilySearch, and other genealogy tools
- Mark individuals as deceased (links to memorial if one exists) or living

#### Faith & Legacy Section — theWalk Integration

- Faith journey narrative: salvation experience, spiritual milestones, ministry seasons
- Testimonies — personal accounts of God's work in their life
- Scripture: verses they lived by, prophetic words spoken over them
- Ministry history: church affiliations, leadership roles, small group participation
- Discipleship legacy: people they mentored, Connect8 group history (pulled from theWalk if linked)
- Automatically populated from theWalk member profile if accounts are linked
- Private by default — owner controls what is visible to which Vault members

---

### 6.2 Generations Roles & Access Control

| Role | Scope | Permissions |
|---|---|---|
| Vault Owner | Full vault | All permissions. Sets all access. Assigns all roles. Locks messages. |
| Generations Guardian | Full vault | Designated successor. Takes ownership on owner death/incapacity. Can release time-locked messages. |
| Backup Guardian | Full vault | Secondary Guardian — system strongly recommends assigning one. Activates if primary is unavailable. |
| Family Editor | Assigned sections | Can add and edit content in permitted sections. Cannot delete, restructure, or change access. |
| Family Viewer | Assigned sections | Read-only access to permitted sections. Cannot contribute content. |
| Section Keeper | One collection only | Editor-level access to a single named collection. Ideal for a specific branch of the family. |

**Access control rules:**

- Vault Owner invites members by email and assigns roles at vault or section level
- Sections can be hidden entirely from certain roles
- **Two-Guardian Rule** — system prompts Owner to assign a Backup Guardian if only one Guardian exists
- Owner can write a private note to their Guardian (*"When I pass, please…"*)
- Roles are manageable by the Owner at any time — revoke, upgrade, or reassign

---

## 7. Organisation Accounts

### 7.1 Funeral Home Accounts

#### Profile & Presence

- Organisation profile page: `inlovingmemory.cloud/funeral-home/[slug]`
- Logo, contact information, service area, bio, and service offerings
- Listed in a searchable funeral home directory on the platform
- Families can search for and connect their memorial to a funeral home

#### Dashboard Capabilities

- Create and manage multiple memorial pages under one login
- Optional co-branding on managed memorial pages (funeral home logo in footer/header)
- Staff sub-accounts with assigned roles (e.g., "Memorial Creator", "Account Manager")
- Bulk QR code and pamphlet generation across multiple memorials
- Pre-funeral planning checklist shared directly with families from the dashboard
- Communication log — track all interactions with a family per memorial
- Grief counselling referral routing (refer families to theWalk counsellors)
- Analytics per memorial: page views, guest book entries, media submissions

#### Pricing — Tiered by Volume

| Tier | Price | Includes |
|---|---|---|
| Starter (1–10 active memorials) | USD $49/month | Up to 10 active Premium memorials, 2 staff accounts |
| Growth (11–50 memorials) | USD $149/month | Unlimited Premium memorials, 10 staff accounts, bulk QR |
| Professional (51–200 memorials) | USD $299/month | All features, unlimited staff, co-branding, priority support |
| Enterprise (200+ memorials) | Custom pricing | White-label options, API access, dedicated account manager |

> All tiers include onboarding support and access to grief counselling referral routing.

---

### 7.2 Ministry Accounts

- Manage memorials for deceased congregation or community members
- Assign a minister, counsellor, or pastoral team member to each memorial
- Access grief support routing and theWalk small group referrals
- Prayer wall management for each memorial under the ministry
- Connect8 grief group creation: form a small group around a family or community loss
- Free Premium memorials automatically applied for verified theWalk members
- theWalk Super Admin creates and verifies ministry accounts
- **Pricing:** included in theWalk Ministries membership — no additional charge for ministry-managed memorials

---

## 8. Prayer Wall & Ministry Integration

### 8.1 Prayer Wall (All Tiers)

- Present on every memorial page, public and private
- Visitors submit: name, prayer text, optional email (no account required)
- Displayed as a living, scrollable wall of prayer on the memorial page
- Page Keeper moderates: auto-publish or approve-before-publish
- Prayer count displayed prominently: *"147 prayers offered for this family"*
- Visitors can choose to be notified of new prayers via email
- Family can respond to specific prayers (Page Keeper only)

### 8.2 theWalk Ministry Integration

- **"Pray for this family"** one-click button adds the memorial to theWalk's active prayer list
- New Premium or ministry-managed memorials trigger a notification to the theWalk ministry team
- Prayer team can be assigned to the memorial by a Ministry Admin
- Weekly prayer summary email sent to the family (opt-in): *"This week, X people prayed for [name]"*
- Grief counselling requests routed to the counsellor registration system (see Section 9)

---

## 9. Grief Counselling & Minister Registry

### 9.1 Counsellor / Minister Registration

Ministers and counsellors register within the theWalk.org platform. Their profile is then available for assignment to memorials and grief cases on inLovingMemory.

**Registration form fields:**

- Full name, contact email, photo
- Ministry affiliation and location (city, country, timezone)
- **Counselling specialisations** — multi-select:
  - Bereavement & grief counselling
  - Trauma and loss
  - Child bereavement (supporting children through loss)
  - Sudden or violent loss
  - Pregnancy loss / infant bereavement
  - Elderly loss (supporting elderly bereaved)
  - Spiritual / faith-based grief support
  - Family systems and communication in grief
  - Group grief facilitation
  - General pastoral care
- Availability: days/hours, session format (virtual, in-person, both)
- Languages spoken
- Brief bio and approach statement
- **Verification status** — theWalk Super Admin approves before they appear in the system

---

### 9.2 Grief Support — Included in Premium

- Family submits a counselling request from their memorial dashboard
- Request includes: brief description, preferred schedule, language, type of loss
- System matches to available counsellors by specialisation, timezone, and language
- Counsellor is notified and can accept or suggest an alternative time
- Session scheduled: virtual (Zoom/Meet link) or in-person
- **Basic counselling is included** — initial sessions at no added cost to Premium members
- Extended or specialised counselling may be offered at a fee set by the counsellor
- Session history and notes (counsellor-side only) stored in the counsellor's theWalk dashboard
- Family can rate and review the counselling experience (visible to Ministry Admin only)

### 9.3 Grief Resource Library

- Curated articles, devotionals, and scriptures — managed in Directus CMS
- Categorised by: type of loss, stage of grief, age group, faith perspective
- Available to all Premium members from their memorial dashboard
- theWalk ministry team can add, update, and remove resources via Directus

---

## 10. Physical Memorial Products

> A fulfilment partner needs to be sourced. Products should integrate with the memorial page and be manageable via the admin dashboard.

### 10.1 Recommended Launch Products

| Product | Description |
|---|---|
| **Memorial QR Plaque** | Durable physical plaque (acrylic or metal) engraved with the deceased's name and a QR code linking to their memorial page. Suitable for headstone, frame, or display. |
| **Printed Tribute Booklet** | Professionally printed version of the digital funeral pamphlet. Saddle-stitched or perfect-bound. Family uploads content via the pamphlet builder; file sent to print-on-demand partner. |
| **Memorial Candle** | Personalised candle with name, dates, and a short tribute on the label. Pillar or jar style. Purchasable by visitors from the memorial page as a sympathy gift. |
| **Sympathy Card Pack** | Set of personalised memorial cards (wallet-size or A6) with photo, name, dates, and a scripture or quote. Shareable at the funeral service. |
| **Memorial Tree Certificate** | Plant a tree in memory of the deceased. Partner with a reforestation charity. Certificate mailed to the family with GPS coordinates of the planted tree. |

### 10.2 Phase 2 Products

- Photo books — printed hardcover album from gallery uploads
- Engraved keepsake stones or wooden plaques
- Digital memorial frame — smart display device preloaded with gallery photos
- Memorial jewellery — discreet QR code charm or engraved pendant
- Personalised grief journal — printed with the person's name and selected photos

### 10.3 Fulfilment Integration Requirements

- Print-on-demand API or fulfilment partner for booklets, cards, and candles (e.g., Printful, Gelato, or local Caribbean/regional supplier)
- QR plaque manufacturer — laser engraving on acrylic or stainless steel (regional sourcing needed)
- Memorial tree charity partner — verified reforestation programme with certificate generation
- Shopify or custom e-commerce layer within the admin dashboard for order management
- Order status visible to Page Keeper from their memorial dashboard
- Visitor-purchasable items shown on the public memorial page as **"Send a gift"**

---

## 11. Admin Dashboard Specification

### 11.1 Super Admin (theWalk.org)

- Global view: all accounts, memorials, organisations, counsellors
- Organisation account creation and verification (funeral homes, ministries)
- Counsellor verification and activation
- Platform analytics: memorials created, active users, storage used, prayer activity, counselling cases
- Content moderation queue: flag and review reported guest submissions
- Billing and subscription management: view all transactions, refunds, plan changes
- Directus CMS access: update all public-facing copy, pricing, grief resources
- **Feature flags:** enable/disable platform features without deployment

### 11.2 Funeral Home / Ministry Admin

- Dashboard scoped to their organisation only — cannot see other orgs
- Create, edit, and archive memorial pages
- Staff account management: invite, assign roles, deactivate
- Bulk pamphlet and QR code generation
- Family communication log per memorial
- Grief counselling referral management
- Billing: view invoices, update payment, manage plan tier
- Analytics: memorial performance, engagement, product orders

### 11.3 Individual Page Keeper

- Memorial dashboard: edit all page content, manage media, update privacy settings
- Guest book moderation: approve, reject, or delete submissions
- Media moderation: approve guest-submitted photos, videos, stories, audio
- Invite co-Keepers by email
- Grief support: submit counselling request, view assigned counsellor, schedule session
- Generations vault: manage vault, invite members, create/lock time-locked messages
- Physical products: order products, track delivery status
- Analytics: page views, prayer count, guest book entries, media submissions
- **theWalk expansion prompt:** banner with CTA to access full theWalk functionality

---

## 12. Technical Implementation Notes

> This section is guidance for Cursor / AI-assisted development. Adjust as the build evolves.

### 12.1 Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) — module within theWalk.org monorepo |
| Deployment | Dokploy — existing pipeline |
| ORM | Prisma — extend shared schema with inLovingMemory models |
| Database | PostgreSQL — shared instance, prefixed tables (`ilm_*`) |
| CMS | Directus — shared instance, new collections for memorial content |
| Auth | Shared NextAuth (or equivalent) — SSO across theWalk.org and inlovingmemory.cloud |
| Media | S3-compatible object store (Cloudflare R2 recommended) — not PostgreSQL |
| Email | Shared transactional email service (Resend or Postmark) — extend with ILM templates |
| AI | Anthropic Claude API — obituary assistant, grief resource suggestions |
| QR Codes | `qrcode` npm package — generate server-side, embed in PDF / link to media store |
| PDF Generation | Puppeteer or React-PDF — funeral pamphlet builder output |
| Payments | Stripe — one-time and subscription billing, webhook-driven entitlement updates |

---

### 12.2 Key Prisma Models

```prisma
// Core memorial
ilm_memorial          // type, slug, tier, privacyLevel, pageKeeperId
ilm_media             // type, storageUrl, memorialId, submittedBy, status
ilm_guestbook_entry   // memorialId, content, status, authorName
ilm_prayer            // memorialId, content, authorName, status
ilm_event             // memorialId, type, dateTime, streamUrl
ilm_pamphlet          // memorialId, pdfUrl, qrCodeUrl

// Generations vault
ilm_generations_vault  // ownerId, linkedMemorialId?, storageQuotaBytes
ilm_vault_collection   // vaultId, name, parentId?
ilm_vault_item         // collectionId, type, storageUrl, lockedAt
ilm_vault_message      // vaultId, recipientEmail, unlockTrigger, lockedAt
ilm_vault_member       // vaultId, userId, role, sectionRestrictions

// Services
ilm_counsellor         // userId, specialisations, availability
ilm_grief_request      // memorialId, requesterId, status, matchedCounsellor

// Organisations & products
ilm_org_account        // type, name, tier, adminUserId
ilm_product_order      // memorialId, productType, status, fulfilmentRef
```

---

### 12.3 Modularity Rules

- All inLovingMemory routes live under `/apps/inlovingmemory` — no cross-contamination with theWalk core routes.
- Shared utilities (auth, email, storage) are imported from a shared `/packages` layer — not duplicated.
- Feature flags in Directus or environment variables control which features are live — enables gradual rollout.
- **Pricing values are stored in Directus CMS or a config table — never hard-coded in application logic.**
- Media URLs are always resolved via a CDN-fronted storage URL — never served directly from the application server.
- AI API calls are server-side only — API key never exposed to the client.

---

### 12.4 Recommended Build Order

1. Core auth + SSO integration with theWalk.org
2. Basic memorial CRUD — create, edit, publish, delete
3. Media upload pipeline — S3 integration, size limits per tier
4. Guest book and prayer wall
5. Privacy controls and public directory
6. Premium tier + Stripe billing
7. Digital pamphlet builder + QR code generation
8. Funeral event pages
9. AI obituary assistant (Claude API)
10. Generations vault — core storage and access control
11. Time-locked messages
12. Grief counselling registry and matching
13. Organisation accounts (funeral home / ministry)
14. Physical product ordering (Stripe + fulfilment partner API)
15. Admin dashboard — Super Admin, Org Admin, Page Keeper
16. theWalk integration — Connect8, myWalk, prayer routing

---

## 13. Open Items & Decisions Required

| # | Item | Status |
|---|---|---|
| 01 | Physical product fulfilment partner — needs to be sourced (regional preference for Caribbean?) | ⚠️ Open |
| 02 | QR plaque manufacturer — laser engraving supplier needed for launch product | ⚠️ Open |
| 03 | Memorial tree charity partner — identify and contract a reforestation programme | ⚠️ Open |
| 04 | Grief counsellor onboarding — 10 initial counsellors need to register and be verified | ⚠️ Open |
| 05 | Funeral home partner — document the interested funeral home's specific requirements | ⚠️ Open |
| 06 | Stripe account — confirm account is set up under theWalk or a dedicated entity | ⚠️ Open |
| 07 | Object storage — confirm Cloudflare R2 or AWS S3 and bucket structure | ⚠️ Open |
| 08 | Domain DNS — confirm inlovingmemory.cloud DNS is pointed to Dokploy deployment | ⚠️ Open |
| 09 | Concierge service — confirm if offered at launch or phase 2 | ⚠️ Open |
| 10 | Languages — confirm if multilingual support is needed at launch (English only to start?) | ⚠️ Open |

---

*inLovingMemory.cloud — theWalk Ministries Int'l*
*More than a memorial — a living legacy*
