#!/usr/bin/env python3
"""
Wave 7 seed: Shop catalog schema (`shop_products`).

Idempotent. Safe to re-run.

What it does:
  1. Creates a `shop_products` collection (if missing)
  2. Adds fields needed to manage shop catalog content in Directus:
     - status (published/draft/archived)
     - sort (hidden)
     - title (required)
     - summary (short description)
     - category (e.g. Book, Apparel)
     - price_label (display-only, e.g. "$19.99")
     - stripe_price_id (required; used by Stripe Checkout)
     - image (directus_files relation)
     - active (boolean; public site only shows active == true)
  3. Adds Public policy read permission on `shop_products` (published only)

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \
    DIRECTUS_TOKEN=… \
    python3 scripts/cms/seed_wave7_shop.py
"""

from __future__ import annotations

import os
import sys
from typing import Any

import requests

BASE = os.environ.get("DIRECTUS_URL", "https://cms.thewalk.org").rstrip("/")
TOKEN = os.environ.get("DIRECTUS_TOKEN")
if not TOKEN:
    print("ERROR: DIRECTUS_TOKEN env var required", file=sys.stderr)
    sys.exit(1)

H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

S = requests.Session()
S.headers.update(H)


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def get(path: str) -> requests.Response:
    return S.get(f"{BASE}{path}")


def post(path: str, body: dict, ctx: str) -> dict[str, Any] | None:
    r = S.post(f"{BASE}{path}", json=body)
    if r.status_code in (200, 201, 204):
        return r.json() if r.text else None
    body_txt = r.text
    if r.status_code in (400, 403) and ("already exists" in body_txt.lower() or "duplicate" in body_txt.lower()):
        print(f"  · {ctx}: already present")
        return None
    fail(f"{ctx}: {r.status_code} {body_txt[:400]}")


def patch(path: str, body: dict, ctx: str) -> dict[str, Any] | None:
    r = S.patch(f"{BASE}{path}", json=body)
    if r.status_code in (200, 204):
        return r.json() if r.text else None
    fail(f"{ctx}: {r.status_code} {r.text[:400]}")


def collection_exists(name: str) -> bool:
    return get(f"/collections/{name}").status_code == 200


def field_exists(collection: str, field: str) -> bool:
    return get(f"/fields/{collection}/{field}").status_code == 200


def relation_exists(collection: str, field: str) -> bool:
    return get(f"/relations/{collection}/{field}").status_code == 200


STATUS_CHOICES = [
    {"text": "Published", "value": "published", "color": "#2ECD6F"},
    {"text": "Draft", "value": "draft", "color": "#D3DAE4"},
    {"text": "Archived", "value": "archived", "color": "#A2B5CD"},
]


def ensure_collection(name: str, *, note: str, icon: str = "shopping_bag") -> None:
    if collection_exists(name):
        print(f"  ✓ collection exists: {name}")
        return
    body = {
        "collection": name,
        "meta": {
            "icon": icon,
            "note": note,
            "hidden": False,
            "singleton": False,
            "archive_field": "status",
            "archive_value": "archived",
            "unarchive_value": "draft",
            "archive_app_filter": True,
            "sort_field": "sort",
        },
        "schema": {"name": name},
        "fields": [
            {
                "field": "id",
                "type": "uuid",
                "meta": {"hidden": True, "readonly": True, "interface": "input", "special": ["uuid"]},
                "schema": {"is_primary_key": True, "length": 36, "has_auto_increment": False},
            },
        ],
    }
    post("/collections", body, f"create collection {name}")
    print(f"  + created collection: {name}")


def add_status(collection: str) -> None:
    if field_exists(collection, "status"):
        return
    post(
        f"/fields/{collection}",
        {
            "field": "status",
            "type": "string",
            "meta": {
                "width": "half",
                "interface": "select-dropdown",
                "options": {"choices": STATUS_CHOICES},
                "display": "labels",
                "display_options": {"showAsDot": True, "choices": STATUS_CHOICES},
            },
            "schema": {"default_value": "draft", "is_nullable": False},
        },
        f"+status on {collection}",
    )


def add_sort(collection: str) -> None:
    if field_exists(collection, "sort"):
        return
    post(
        f"/fields/{collection}",
        {"field": "sort", "type": "integer", "meta": {"interface": "input", "hidden": True}, "schema": {}},
        f"+sort on {collection}",
    )


def add_string(collection: str, field: str, *, required: bool = False, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "string",
            "meta": {"width": "full", "interface": "input", "note": note, "required": required},
            "schema": {"is_nullable": not required},
        },
        f"+{field} on {collection}",
    )


def add_text(collection: str, field: str, *, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "text",
            "meta": {"width": "full", "interface": "input-multiline", "note": note},
            "schema": {"is_nullable": True},
        },
        f"+{field} on {collection}",
    )


def add_bool(collection: str, field: str, *, default: bool = False, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "boolean",
            "meta": {"width": "half", "interface": "boolean", "note": note},
            "schema": {"default_value": default, "is_nullable": False},
        },
        f"+{field} on {collection}",
    )


def add_file(collection: str, field: str, *, required: bool = False, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "uuid",
            "meta": {
                "width": "full",
                "interface": "file-image",
                "display": "image",
                "special": ["file"],
                "note": note,
                "required": required,
            },
            "schema": {"is_nullable": not required, "foreign_key_table": "directus_files"},
        },
        f"+{field} on {collection}",
    )
    if not relation_exists(collection, field):
        post(
            "/relations",
            {
                "collection": collection,
                "field": field,
                "related_collection": "directus_files",
                "schema": {"on_delete": "SET NULL"},
                "meta": {"sort_field": None},
            },
            f"relation {collection}.{field} → directus_files",
        )


def ensure_public_read(collection: str) -> None:
    pr = get("/policies?limit=-1&fields=id,name")
    policies = pr.json().get("data", []) if pr.ok else []
    public = next((p for p in policies if "public" in (p.get("name") or "").lower()), None)
    if not public:
        print("  WARN: could not locate Public policy; skipping permissions.")
        return
    policy_id = public["id"]

    ex = (
        get(f"/permissions?filter[policy][_eq]={policy_id}&filter[collection][_eq]={collection}&filter[action][_eq]=read&limit=1&fields=id")
        .json()
        .get("data", [])
    )

    payload = {
        "policy": policy_id,
        "collection": collection,
        "action": "read",
        "permissions": {"status": {"_eq": "published"}},
        "validation": {},
        "fields": ["*"],
    }
    if ex:
        patch(f"/permissions/{ex[0]['id']}", payload, f"update public read on {collection}")
        print(f"  ✓ public read perm updated: {collection}")
    else:
        post("/permissions", payload, f"+public read on {collection}")
        print(f"  + public read perm created: {collection}")


def main() -> None:
    print(f"→ Directus: {BASE}")
    coll = "shop_products"
    print("→ schema: shop_products")
    ensure_collection(coll, note="Shop catalog managed in Directus; Stripe handles payments via price IDs.")
    add_status(coll)
    add_sort(coll)
    add_string(coll, "title", required=True)
    add_text(coll, "summary", note="Short description used on cards.")
    add_string(coll, "category", note="Optional label (e.g. Book, Apparel).")
    add_string(coll, "price_label", note="Display-only price label (e.g. $19.99). Stripe is source of truth.")
    add_string(coll, "stripe_price_id", required=True, note="Stripe Price ID used by Checkout (e.g. price_...).")
    add_file(coll, "image", note="Card image. Stored as Directus file.")
    add_bool(coll, "active", default=True, note="Public site only shows active items.")

    print("→ permissions: public read")
    ensure_public_read(coll)
    print("✓ Wave 7 shop seed complete")


if __name__ == "__main__":
    main()

