#!/usr/bin/env python3
"""
Wave 5 seed: /journey (immersive scroller).

Idempotent. Safe to re-run.

What it does:
  1. Ensures schema for the new section type exists on the live Directus
     instance:
       - section_journey_scroller
       - section_journey_scroller_slides (o2m children)
  2. Grows the pages.sections M2A allowed_collections union to include
     the new type.
  3. Sets public read permissions on the new collections.
  4. Downloads + uploads the four scroller background photographs from
     Unsplash into the Public/ folder.
  5. Creates / updates the `journey` page with a single
     section_journey_scroller and four slide children (intro + the three
     existing pathway cards), preserving every line of the original copy.

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \
    DIRECTUS_TOKEN=… \
    python3 scripts/cms/seed_wave5.py
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
H_NO_CT = {"Authorization": f"Bearer {TOKEN}"}
PUBLIC_FOLDER_NAME = "Public"

S = requests.Session()
S.headers.update(H)


# ─── http helpers ────────────────────────────────────────────────────────────


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def get(path: str) -> requests.Response:
    return S.get(f"{BASE}{path}")


def post(path: str, body: dict, ctx: str) -> dict[str, Any] | None:
    r = S.post(f"{BASE}{path}", json=body)
    if r.status_code in (200, 204):
        return r.json() if r.text else None
    body_txt = r.text
    if r.status_code in (400, 403) and (
        "already exists" in body_txt.lower() or "duplicate" in body_txt.lower()
    ):
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


# ─── schema migration helpers ────────────────────────────────────────────────


SECTION_GROUP_COLOR = "#6644FF"
STATUS_CHOICES = [
    {"text": "Published", "value": "published", "color": "#2ECD6F"},
    {"text": "Draft", "value": "draft", "color": "#D3DAE4"},
    {"text": "Archived", "value": "archived", "color": "#A2B5CD"},
]


def ensure_collection(
    name: str,
    *,
    note: str,
    icon: str = "article",
    archive_field: str | None = "status",
    sort_field: str | None = None,
    hidden: bool = False,
) -> None:
    if collection_exists(name):
        print(f"  ✓ collection exists: {name}")
        return
    meta: dict[str, Any] = {
        "icon": icon,
        "color": SECTION_GROUP_COLOR,
        "note": note,
        "hidden": hidden,
        "singleton": False,
        "accountability": "all",
        "translations": None,
    }
    if archive_field:
        meta["archive_field"] = archive_field
        meta["archive_value"] = "archived"
        meta["unarchive_value"] = "draft"
        meta["archive_app_filter"] = True
    if sort_field:
        meta["sort_field"] = sort_field
    body = {
        "collection": name,
        "meta": meta,
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
                "width": "full",
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


def add_title_internal(collection: str) -> None:
    if field_exists(collection, "title_internal"):
        return
    post(
        f"/fields/{collection}",
        {
            "field": "title_internal",
            "type": "string",
            "meta": {
                "width": "full",
                "interface": "input",
                "note": "Editor-only label to distinguish instances in the builder.",
                "required": True,
            },
            "schema": {"is_nullable": False},
        },
        f"+title_internal on {collection}",
    )


def add_string(
    collection: str,
    field: str,
    *,
    required: bool = False,
    note: str | None = None,
) -> None:
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


def add_user_timestamps(collection: str) -> None:
    specs = [
        ("user_created", "uuid", ["user-created"], "select-dropdown-m2o"),
        ("date_created", "timestamp", ["date-created"], "datetime"),
        ("user_updated", "uuid", ["user-updated"], "select-dropdown-m2o"),
        ("date_updated", "timestamp", ["date-updated"], "datetime"),
    ]
    for name, typ, special, interface in specs:
        if field_exists(collection, name):
            continue
        body: dict[str, Any] = {
            "field": name,
            "type": typ,
            "meta": {
                "special": special,
                "interface": interface,
                "readonly": True,
                "hidden": True,
                "width": "half",
                "display": "datetime" if typ == "timestamp" else "user",
                "display_options": {"relative": True} if typ == "timestamp" else {"circle": True},
            },
            "schema": {},
        }
        if typ == "uuid":
            body["schema"] = {"foreign_key_table": "directus_users"}
        post(f"/fields/{collection}", body, f"+{name} on {collection}")


def add_o2m(parent: str, field: str, child: str) -> None:
    child_fk = f"{parent}_id"
    if not field_exists(child, child_fk):
        post(
            f"/fields/{child}",
            {
                "field": child_fk,
                "type": "uuid",
                "meta": {
                    "width": "full",
                    "interface": "select-dropdown-m2o",
                    "hidden": True,
                    "special": ["m2o"],
                },
                "schema": {"is_nullable": True, "foreign_key_table": parent},
            },
            f"+{child_fk} on {child}",
        )
    if not relation_exists(child, child_fk):
        post(
            "/relations",
            {
                "collection": child,
                "field": child_fk,
                "related_collection": parent,
                "schema": {"on_delete": "SET NULL"},
                "meta": {"one_field": field, "sort_field": "sort"},
            },
            f"relation {child}.{child_fk} → {parent}",
        )
    if not field_exists(parent, field):
        post(
            f"/fields/{parent}",
            {
                "field": field,
                "type": "alias",
                "meta": {
                    "width": "full",
                    "interface": "list-o2m",
                    "special": ["o2m"],
                    "options": {"enableCreate": True, "enableSelect": False},
                },
                "schema": None,
            },
            f"+{field} on {parent}",
        )


# ─── new schema definitions ─────────────────────────────────────────────────


def build_section_journey_scroller() -> None:
    name = "section_journey_scroller"
    slides = "section_journey_scroller_slides"
    ensure_collection(
        name,
        note="Sticky scroll-driven 4-up overview used by /journey.",
        icon="view_carousel",
    )
    add_status(name)
    add_title_internal(name)
    add_string(name, "section_anchor", note="In-page anchor id (default 'journey-immersive').")
    add_string(name, "aria_label", note="Aria label for the section. Default 'Journey overview'.")
    add_user_timestamps(name)

    ensure_collection(
        slides,
        note="Up to 4 slides for the immersive scroller.",
        icon="filter_4",
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort(slides)
    add_string(
        slides,
        "key",
        note="Stable identifier used as React key (e.g. 'journey-intro', 'cross-over').",
    )
    add_string(slides, "label", required=True, note="Short label shown in the right-side nav.")
    add_string(
        slides,
        "eyebrow",
        note="Optional small uppercase label above the title. Defaults to 'Journey overview' on slide 1 and 'Pathway 0X' on subsequent slides.",
    )
    add_string(slides, "title", required=True)
    add_text(slides, "body")
    add_string(slides, "href", note="Primary CTA destination URL.")
    add_string(slides, "cta_label", note="Primary CTA button label.")
    add_string(
        slides,
        "ministries_csv",
        note="Comma-separated ministry pill labels (e.g. 'Rugged, Covered, Exodus').",
    )
    add_file(slides, "image", required=True, note="Slide background photo.")
    add_string(slides, "image_alt", note="Empty allowed for decorative backgrounds.")
    add_o2m(name, "slides", slides)


def grow_pages_sections_m2a() -> None:
    """Append section_journey_scroller to the M2A allowed_collections union."""
    junction = "pages_sections"
    new_types = ["section_journey_scroller"]
    cur = get(f"/relations/{junction}/item")
    if not cur.ok:
        fail(f"M2A relation missing on {junction}.item — was Wave 0 schema run?")
    cur_meta = (cur.json().get("data") or {}).get("meta") or {}
    cur_allowed = list(cur_meta.get("one_allowed_collections") or [])
    missing = [c for c in new_types if c not in cur_allowed]
    if not missing:
        print("  ✓ M2A allowed_collections already includes new types")
        return
    merged = cur_allowed + missing
    patch(
        f"/relations/{junction}/item",
        {"meta": {"one_allowed_collections": merged}},
        f"merge M2A allowed_collections (+{len(missing)})",
    )
    print(f"  + M2A allowed_collections grew by: {missing}")


def ensure_public_read(collections: list[str]) -> None:
    pr = get("/policies?filter[name][_eq]=$t:public_label&limit=1")
    data = pr.json().get("data", []) if pr.ok else []
    if not data:
        pr = get("/policies?limit=-1&fields=id,name")
        policies = pr.json().get("data", []) if pr.ok else []
        data = [p for p in policies if "public" in (p.get("name") or "").lower()]
    if not data:
        print("  WARN: could not locate Public policy; skipping permissions.")
        return
    policy_id = data[0]["id"]
    ex = (
        get(f"/permissions?filter[policy][_eq]={policy_id}&limit=-1&fields=id,collection,action")
        .json()
        .get("data", [])
    )
    existing = {(p["collection"], p["action"]) for p in ex}
    for coll in collections:
        if (coll, "read") in existing:
            print(f"  ✓ public read perm exists: {coll}")
            continue
        body = {
            "policy": policy_id,
            "collection": coll,
            "action": "read",
            "permissions": {},
            "validation": {},
            "fields": ["*"],
        }
        if coll.startswith("section_") and not coll.endswith("_slides"):
            body["permissions"] = {"status": {"_eq": "published"}}
        post("/permissions", body, f"+public read on {coll}")


# ─── files ───────────────────────────────────────────────────────────────────


def get_public_folder() -> str:
    r = S.get(
        f"{BASE}/folders",
        params={"filter[name][_eq]": PUBLIC_FOLDER_NAME, "limit": 1, "fields": "id"},
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    fail("Public folder missing — run seed_wave1.py first")


def find_file_by_name(name: str) -> str | None:
    r = S.get(
        f"{BASE}/files",
        params={"filter[filename_download][_eq]": name, "limit": 1, "fields": "id"},
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    return None


def upload_remote_image(url: str, filename: str, folder_id: str, title: str) -> str:
    """Download a remote image and upload to Directus Files (idempotent)."""
    existing = find_file_by_name(filename)
    if existing:
        S.patch(f"{BASE}/files/{existing}", json={"folder": folder_id, "title": title})
        print(f"  ✓ already uploaded: {filename}")
        return existing
    print(f"  ↓ downloading {filename}…")
    rd = requests.get(url, timeout=60)
    if not rd.ok:
        fail(f"download {url}: {rd.status_code}")
    content_type = rd.headers.get("content-type", "image/jpeg").split(";", 1)[0]
    r = requests.post(
        f"{BASE}/files",
        headers=H_NO_CT,
        files={"file": (filename, rd.content, content_type)},
        data={"folder": folder_id, "title": title},
    )
    if not r.ok:
        fail(f"upload {filename}: {r.status_code} {r.text}")
    fid = r.json()["data"]["id"]
    print(f"  ↑ uploaded {filename} → {fid}")
    return fid


# Original Unsplash URLs hardcoded in JourneyImmersiveScroller. We download
# these into Directus so editors can replace them later without code changes.
SCROLLER_IMAGES = {
    "intro": (
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2400&auto=format&fit=crop",
        "journey-scroller-intro.jpg",
        "Journey scroller – Intro background",
    ),
    "cross-over": (
        "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
        "journey-scroller-cross-over.jpg",
        "Journey scroller – Cross Over background",
    ),
    "cross-roads": (
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
        "journey-scroller-cross-roads.jpg",
        "Journey scroller – Cross Roads background",
    ),
    "cross-connect": (
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
        "journey-scroller-cross-connect.jpg",
        "Journey scroller – Cross Connect background",
    ),
}


def upload_all_images(folder_id: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for key, (url, fn, title) in SCROLLER_IMAGES.items():
        out[key] = upload_remote_image(url, fn, folder_id, title)
    return out


# ─── upserts ─────────────────────────────────────────────────────────────────


def find_one(collection: str, filt: dict[str, str]) -> dict | None:
    params: dict[str, object] = {"limit": 1, "fields": "*"}
    for k, v in filt.items():
        params[f"filter[{k}][_eq]"] = v
    r = S.get(f"{BASE}/items/{collection}", params=params)
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]
    return None


def upsert_section(collection: str, title_internal: str, payload: dict) -> str:
    existing = find_one(collection, {"title_internal": title_internal})
    body = {**payload, "title_internal": title_internal, "status": "published"}
    if existing:
        r = S.patch(f"{BASE}/items/{collection}/{existing['id']}", json=body)
        if not r.ok:
            fail(f"patch {collection}/{existing['id']}: {r.status_code} {r.text}")
        return existing["id"]
    r = S.post(f"{BASE}/items/{collection}", json=body)
    if not r.ok:
        fail(f"create {collection}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


def replace_children(parent_collection: str, parent_id: str, child_collection: str, items: list[dict]) -> None:
    fk = f"{parent_collection}_id"
    old = (
        S.get(
            f"{BASE}/items/{child_collection}",
            params={f"filter[{fk}][_eq]": parent_id, "fields": "id", "limit": -1},
        )
        .json()
        .get("data", [])
    )
    for row in old:
        S.delete(f"{BASE}/items/{child_collection}/{row['id']}")
    for sort, payload in enumerate(items):
        body = {**payload, fk: parent_id, "sort": sort}
        r = S.post(f"{BASE}/items/{child_collection}", json=body)
        if not r.ok:
            fail(f"create {child_collection} item: {r.status_code} {r.text}")


def upsert_page(slug: str, payload: dict, sections: list[dict]) -> str:
    page_payload = {**payload, "slug": slug, "status": "published"}
    page_payload["sections"] = [
        {"collection": s["collection"], "item": {"id": s["item"]}, "sort": i}
        for i, s in enumerate(sections)
    ]
    existing = find_one("pages", {"slug": slug})
    if existing:
        old = (
            S.get(
                f"{BASE}/items/pages_sections",
                params={"filter[pages_id][_eq]": existing["id"], "fields": "id", "limit": -1},
            )
            .json()
            .get("data", [])
        )
        for row in old:
            S.delete(f"{BASE}/items/pages_sections/{row['id']}")
        r = S.patch(f"{BASE}/items/pages/{existing['id']}", json=page_payload)
        if not r.ok:
            fail(f"patch pages/{slug}: {r.status_code} {r.text}")
        return existing["id"]
    r = S.post(f"{BASE}/items/pages", json=page_payload)
    if not r.ok:
        fail(f"create pages/{slug}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


# ─── seed ────────────────────────────────────────────────────────────────────


def seed_journey(images: dict[str, str]) -> None:
    print("→ JOURNEY (immersive scroller)…")

    scroller = upsert_section(
        "section_journey_scroller",
        "Journey — immersive scroller",
        {
            "section_anchor": "journey-immersive",
            "aria_label": "Journey overview",
        },
    )
    replace_children(
        "section_journey_scroller",
        scroller,
        "section_journey_scroller_slides",
        [
            {
                "key": "journey-intro",
                "label": "Intro",
                "title": "The Journey",
                "body": (
                    "Four movements. One walk. Explore the ministries built for "
                    "restoration, growth, and Kingdom impact—then step into the "
                    "next right thing."
                ),
                "href": "/get-involved",
                "cta_label": "Get involved",
                "ministries_csv": "",
                "image": images["intro"],
                "image_alt": "",
            },
            {
                "key": "cross-over",
                "label": "Cross Over",
                "title": "Cross Over",
                "body": "Restoration, support, and transformation as you begin.",
                "href": "/journey/cross-over",
                "cta_label": "Explore Cross Over",
                "ministries_csv": "Rugged, Covered, Exodus",
                "image": images["cross-over"],
                "image_alt": "",
            },
            {
                "key": "cross-roads",
                "label": "Cross Roads",
                "title": "Cross Roads",
                "body": "Identity, truth, and spiritual direction in discipleship.",
                "href": "/journey/cross-roads",
                "cta_label": "Explore Cross Roads",
                "ministries_csv": "Bible Study, Series, MyWalk",
                "image": images["cross-roads"],
                "image_alt": "",
            },
            {
                "key": "cross-connect",
                "label": "Cross Connect",
                "title": "Cross Connect",
                "body": "Community, fellowship, and expanding Kingdom impact.",
                "href": "/journey/cross-connect",
                "cta_label": "Explore Cross Connect",
                "ministries_csv": "Small Groups, Prayer, Ministry Development",
                "image": images["cross-connect"],
                "image_alt": "",
            },
        ],
    )

    upsert_page(
        "journey",
        {
            "title": "The Journey",
            "seo_title": "The Journey | theWalk Ministries",
            "seo_description": (
                "Cross Over, Cross Roads, and Cross Connect — pathways for "
                "restoration, growth, and kingdom impact."
            ),
        },
        [{"collection": "section_journey_scroller", "item": scroller}],
    )
    print("  ✓ journey seeded")


# ─── main ────────────────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")

    print("→ schema: section_journey_scroller (+ slides child)")
    build_section_journey_scroller()

    print("→ M2A: grow allowed_collections")
    grow_pages_sections_m2a()

    print("→ permissions: public read")
    ensure_public_read([
        "section_journey_scroller",
        "section_journey_scroller_slides",
    ])

    folder_id = get_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading scroller background images…")
    images = upload_all_images(folder_id)

    seed_journey(images)

    print("✓ Wave 5 seed complete")


if __name__ == "__main__":
    main()
