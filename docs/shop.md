## Shop (Directus catalog + Stripe checkout)

### Overview
- **Catalog + content**: managed in **Directus** (collection `shop_products`)
- **Payments**: handled by **Stripe Checkout**
- **App flow**:
  - `/shop` fetches published + active items from Directus
  - “Buy” posts to `POST /api/stripe/checkout`
  - API creates a Stripe Checkout Session using the configured Stripe Price ID

### Directus schema
Seed script:
- `scripts/cms/seed_wave7_shop.py`

Collection:
- `shop_products`

Fields used by the app:
- **status**: `published|draft|archived` (public site reads `published` only)
- **sort**: integer (ordering)
- **title**: string (required)
- **summary**: text (optional)
- **category**: string (optional; chip label)
- **price_label**: string (optional; display-only chip)
- **stripe_price_id**: string (required; e.g. `price_...`)
- **image**: file (Directus `directus_files` relation)
- **active**: boolean (public site only shows `true`)

Public read:
- The seed script adds a Public policy read permission for `shop_products` (published only).

### Stripe configuration (set in deployment dashboard)
Required env vars:
- **STRIPE_SECRET_KEY**: Stripe secret key used server-side by `POST /api/stripe/checkout`

Recommended env vars:
- **NEXT_PUBLIC_APP_URL** (or `NEXT_PUBLIC_SITE_URL`): base URL used to build `success_url` and `cancel_url`

### Local testing
1. Run the Directus seed (once) to create the collection:

```bash
DIRECTUS_URL=https://cms.thewalk.org DIRECTUS_TOKEN=... python3 scripts/cms/seed_wave7_shop.py
```

2. Create a Stripe Product + Price in Stripe, copy the **Price ID** (starts with `price_...`).
3. Create a `shop_products` item in Directus with:
   - `status=published`
   - `active=true`
   - `stripe_price_id=<price_...>`
4. Visit `/shop` and click **Buy**.

