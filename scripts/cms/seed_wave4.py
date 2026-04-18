#!/usr/bin/env python3
"""
Wave 4 seed: /journey/cross-over, /journey/cross-roads, /journey/cross-connect.

Idempotent. Safe to re-run.

What it does:
  1. Ensures schema for two new section types exists on the live Directus
     instance, and adds the new fields to section_ministry_tabs(_tabs):
       - section_pathway_hero
       - section_pathway_about (+ section_pathway_about_items)
       - section_ministry_tabs.section_anchor
       - section_ministry_tabs_tabs.{key,lede,focus_items,scriptures}
  2. Grows the pages.sections M2A allowed_collections union to include
     the new pathway types.
  3. Sets public read permissions on the new collections.
  4. Downloads + uploads the three pathway hero photographs from Unsplash
     into Public/.
  5. Creates / updates three pages: journey/cross-over, journey/cross-roads,
     journey/cross-connect — each with hero + about + ministry tabs.

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \
    DIRECTUS_TOKEN=… \
    python3 scripts/cms/seed_wave4.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

import requests

BASE = os.environ.get("DIRECTUS_URL", "https://cms.thewalk.org").rstrip("/")
TOKEN = os.environ.get("DIRECTUS_TOKEN")
if not TOKEN:
    print("ERROR: DIRECTUS_TOKEN env var required", file=sys.stderr)
    sys.exit(1)

H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
H_NO_CT = {"Authorization": f"Bearer {TOKEN}"}
REPO = Path(__file__).resolve().parents[2]
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


# ─── schema migration helpers (mirrored from seed_wave3) ────────────────────


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
    choices: list[str] | None = None,
    default: str | None = None,
) -> None:
    if field_exists(collection, field):
        return
    meta: dict[str, Any] = {"width": "full", "interface": "input", "note": note, "required": required}
    if choices:
        meta["interface"] = "select-dropdown"
        meta["options"] = {"choices": [{"text": c, "value": c} for c in choices]}
    schema: dict[str, Any] = {"is_nullable": not required}
    if default is not None:
        schema["default_value"] = default
    post(
        f"/fields/{collection}",
        {"field": field, "type": "string", "meta": meta, "schema": schema},
        f"+{field} on {collection}",
    )


def add_text(collection: str, field: str, *, markdown: bool = False, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    interface = "input-rich-text-md" if markdown else "input-multiline"
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "text",
            "meta": {"width": "full", "interface": interface, "note": note},
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


def add_json_repeater(
    collection: str,
    field: str,
    *,
    fields: list[dict],
    template: str,
    note: str | None = None,
) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "json",
            "meta": {
                "width": "full",
                "interface": "list",
                "options": {"fields": fields, "template": template},
                "special": ["cast-json"],
                "note": note,
            },
            "schema": {"is_nullable": True},
        },
        f"+{field} on {collection}",
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


def build_section_pathway_hero() -> None:
    name = "section_pathway_hero"
    ensure_collection(name, note="Photographic hero with glass card + chips.", icon="landscape")
    add_status(name)
    add_title_internal(name)
    add_string(name, "eyebrow", note="Small uppercase label above the title (e.g. 'Pathway').")
    add_string(name, "headline", required=True)
    add_text(name, "subheadline", note="One-line subhead under the title.")
    add_string(name, "chips_csv", note="Comma-separated chip labels (e.g. 'Rugged, Covered, Exodus').")
    add_string(name, "cta_primary_label")
    add_string(name, "cta_primary_url")
    add_string(name, "back_link_label", note="Optional secondary link label (e.g. '← Back to Journey').")
    add_string(name, "back_link_url")
    add_text(name, "footnote", note="Longer paragraph below the glass card (white-on-dark).")
    add_file(name, "image", required=True, note="Background photograph.")
    add_string(name, "image_alt", note="Empty string allowed for decorative backgrounds.")
    add_user_timestamps(name)


def build_section_pathway_about() -> None:
    name = "section_pathway_about"
    items = "section_pathway_about_items"
    ensure_collection(name, note="About block: title + lede left, stacked focus mini-cards right.", icon="view_column")
    add_status(name)
    add_title_internal(name)
    add_string(name, "eyebrow", note="Small uppercase label (e.g. 'About').")
    add_string(name, "headline", required=True)
    add_text(name, "lede", note="Lede paragraph under the title.")
    add_string(name, "cta_primary_label")
    add_string(name, "cta_primary_url")
    add_string(name, "cta_secondary_label")
    add_string(name, "cta_secondary_url")
    add_user_timestamps(name)
    ensure_collection(items, note="Mini focus cards rendered in the right column.", icon="format_list_bulleted", archive_field=None, sort_field="sort", hidden=True)
    add_sort(items)
    add_string(items, "title", required=True)
    add_text(items, "body")
    add_o2m(name, "items", items)


def extend_section_ministry_tabs() -> None:
    """Add the new fields needed for the pathway-style rich tabs."""
    add_string(
        "section_ministry_tabs",
        "section_anchor",
        note="In-page anchor id, e.g. `cross-over-ministries`. Used by sticky nav and ?tab=… deep-links.",
    )
    add_string(
        "section_ministry_tabs_tabs",
        "key",
        note="URL-safe slug for `?tab=…`. Optional — defaults to slugified label.",
    )
    add_text(
        "section_ministry_tabs_tabs",
        "lede",
        note="Long ministry description above the focus list. Plain text; paragraphs split on blank lines.",
    )
    add_json_repeater(
        "section_ministry_tabs_tabs",
        "focus_items",
        fields=[
            {"field": "title", "type": "string", "name": "Title", "meta": {"interface": "input", "width": "full", "required": True}},
            {"field": "body", "type": "text", "name": "Body", "meta": {"interface": "input-multiline", "width": "full", "required": True}},
        ],
        template="{{title}}",
        note="Bullet-style ministry-focus list rendered inside the active tab.",
    )
    add_string(
        "section_ministry_tabs_tabs",
        "scriptures",
        note="Comma-separated bible references shown in the right-hand 'Key scriptures' panel.",
    )


def grow_pages_sections_m2a() -> None:
    """Append the new section types to the M2A allowed_collections union."""
    junction = "pages_sections"
    new_types = ["section_pathway_hero", "section_pathway_about"]
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
        if coll.startswith("section_") and not coll.endswith("_items"):
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


# ─── content ────────────────────────────────────────────────────────────────


# Original Unsplash URLs hardcoded in the pathway pages. We download these
# into Directus so editors can replace them later without code changes.
# Several tabs reuse the same Unsplash photo as a pathway hero — we still
# upload it once per slot so editors can swap each independently.
HERO_IMAGES = {
    # Pathway heroes
    "cross-over": (
        "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-over-hero.jpg",
        "Journey – Cross Over hero",
    ),
    "cross-roads": (
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-roads-hero.jpg",
        "Journey – Cross Roads hero",
    ),
    "cross-connect": (
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-connect-hero.jpg",
        "Journey – Cross Connect hero",
    ),
    # Cross Over tab backgrounds
    "rugged": (
        "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-over-tab-rugged.jpg",
        "Cross Over – Rugged tab background",
    ),
    "covered": (
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-over-tab-covered.jpg",
        "Cross Over – Covered tab background",
    ),
    "exodus": (
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-over-tab-exodus.jpg",
        "Cross Over – Exodus tab background",
    ),
    # Cross Roads tab backgrounds
    "bible-study": (
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-roads-tab-bible-study.jpg",
        "Cross Roads – Bible Study tab background",
    ),
    "series": (
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-roads-tab-series.jpg",
        "Cross Roads – Series tab background",
    ),
    "mywalk": (
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-roads-tab-mywalk.jpg",
        "Cross Roads – MyWalk tab background",
    ),
    # Cross Connect tab backgrounds
    "small-groups": (
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-connect-tab-small-groups.jpg",
        "Cross Connect – Small Groups tab background",
    ),
    "prayer": (
        "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-connect-tab-prayer.jpg",
        "Cross Connect – Prayer tab background",
    ),
    "ministry-development": (
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop",
        "journey-cross-connect-tab-ministry-development.jpg",
        "Cross Connect – Ministry Development tab background",
    ),
}


def upload_all_images(folder_id: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for key, (url, fname, title) in HERO_IMAGES.items():
        out[key] = upload_remote_image(url, fname, folder_id, title)
    return out


# ─── Cross Over ─────────────────────────────────────────────────────────────


def seed_cross_over(images: dict[str, str]) -> None:
    print("→ CROSS OVER…")

    hero = upsert_section(
        "section_pathway_hero",
        "Cross Over — hero",
        {
            "eyebrow": "Pathway",
            "headline": "Cross Over",
            "subheadline": "Enter a place of restoration, support, and profound transformation.",
            "chips_csv": "Rugged, Covered, Exodus",
            "cta_primary_label": "Get involved",
            "cta_primary_url": "/get-involved",
            "back_link_label": "← Back to Journey",
            "back_link_url": "/journey",
            "footnote": (
                "Cross Over helps us discover our place and purpose in God, the "
                "Church, and within our wider communities—supporting believers as new "
                "experiences shape the next step of the walk."
            ),
            "image": images["cross-over"],
            "image_alt": "",
        },
    )

    about = upsert_section(
        "section_pathway_about",
        "Cross Over — about",
        {
            "eyebrow": "About",
            "headline": "Cross Over for all.",
            "lede": (
                "Crossover, a core ministry of theWalk, focuses on supporting "
                "believers through new experiences as they progress in their journey "
                "with God."
            ),
            "cta_primary_label": "Talk to our team",
            "cta_primary_url": "/contact?type=journey&pathway=Cross%20Over",
            "cta_secondary_label": "Get involved",
            "cta_secondary_url": "/get-involved",
        },
    )
    replace_children(
        "section_pathway_about",
        about,
        "section_pathway_about_items",
        [
            {
                "title": "For new experiences",
                "body": (
                    "Crossover helps us to discover our place and purpose in God, the "
                    "Church and within our wider communities."
                ),
            },
            {
                "title": "For purpose and belonging",
                "body": (
                    "This ministry exists on the fringes of the faith, helping persons "
                    "to enter and remain on the path toward deeper fellowship with "
                    "Christ."
                ),
            },
            {
                "title": "For deeper fellowship",
                "body": (
                    "Through Rugged, Covered, and Exodus, we meet people in hardship "
                    "and hope—then walk with them toward lasting freedom."
                ),
            },
        ],
    )

    tabs_section = upsert_section(
        "section_ministry_tabs",
        "Cross Over — ministries",
        {
            "eyebrow": "Ministries",
            "headline": "Rugged, Covered, Exodus",
            "intro": (
                "Explore each ministry focus. Shareable links are available via "
                "the URL (for example, ?tab=exodus)."
            ),
            "section_anchor": "cross-over-ministries",
        },
    )
    replace_children(
        "section_ministry_tabs",
        tabs_section,
        "section_ministry_tabs_tabs",
        [
            {
                "key": "rugged",
                "label": "Rugged",
                "title": "Rugged",
                "image": images["rugged"],
                "image_alt": "",
                "lede": (
                    "Rugged exists to reach individuals from all walks of life. "
                    "Developed for those who have faced extreme challenges, it "
                    "emphasizes the power and scope of the amazing redemptive power of "
                    "Jesus' sacrifice. It's for those whose lives due to circumstances "
                    "or choices may not align well with society's expectations; "
                    "offering hope and a fresh start."
                ),
                "focus_items": [
                    {
                        "title": "Spiritual Development",
                        "body": (
                            "Rugged introduces individuals to Christ and nurtures "
                            "foundational faith, helping them begin or restore their "
                            "relationship with God through teaching, prayer, and "
                            "discipleship."
                        ),
                    },
                    {
                        "title": "Personal Development & Life Skills",
                        "body": (
                            "Participants are equipped with practical life skills such as "
                            "communication, discipline, and decision-making, enabling them to "
                            "function effectively in everyday life."
                        ),
                    },
                    {
                        "title": "Education & Career Development",
                        "body": (
                            "The ministry supports access to education, vocational training, "
                            "and employment pathways, helping individuals build sustainable "
                            "and productive futures."
                        ),
                    },
                    {
                        "title": "Community Reintegration & Social Support",
                        "body": (
                            "Rugged assists individuals in re-entering society with "
                            "confidence by providing guidance, accountability, and connection "
                            "to supportive networks."
                        ),
                    },
                    {
                        "title": "Aftercare & Transitional Housing (Covered)",
                        "body": (
                            "Through partnership with Covered, Rugged ensures continued "
                            "support beyond initial outreach, helping individuals transition "
                            "into stable living environments."
                        ),
                    },
                ],
                "scriptures": "1 Timothy 1:12-16, Jeremiah 29:11",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "covered",
                "label": "Covered",
                "title": "Covered",
                "image": images["covered"],
                "image_alt": "",
                "lede": (
                    "Covered Ministries provide a sanctuary of safety, restoration, "
                    "and spiritual growth for individuals at critical periods of "
                    "their walk. We offer temporary housing, essential resources, "
                    "and mentorship for new converts, believers facing challenging "
                    "circumstances, and those seeking to grow deeper in their faith. "
                    "Rooted in the love of Christ, we extend His covering to those "
                    "in need, fostering a supportive environment for transformation, "
                    "training, and service."
                ),
                "focus_items": [
                    {
                        "title": "Temporary Housing & Help (Hostile Environments)",
                        "body": (
                            "Covered offers safe accommodation for individuals escaping "
                            "unsafe or unstable environments, providing immediate relief "
                            "and protection during critical moments."
                        ),
                    },
                    {
                        "title": "Ministry Training (Discipleship & Growth)",
                        "body": (
                            "Residents are engaged in structured discipleship programs "
                            "designed to deepen their understanding of God and strengthen "
                            "their spiritual foundation."
                        ),
                    },
                    {
                        "title": "Retreats & Temporary Getaways",
                        "body": (
                            "Intentional retreats provide space for rest, reflection, and "
                            "spiritual renewal, allowing individuals to reconnect with God "
                            "away from daily pressures."
                        ),
                    },
                    {
                        "title": "Personal Development & Life Skills",
                        "body": (
                            "Covered reinforces personal growth through training in "
                            "responsibility, time management, and healthy lifestyle "
                            "practices."
                        ),
                    },
                    {
                        "title": "Education & Career Development",
                        "body": (
                            "Participants receive support in pursuing education or "
                            "employment opportunities, helping them prepare for long-term "
                            "independence."
                        ),
                    },
                ],
                "scriptures": "Matthew 25:35-36, Psalm 91:1",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "exodus",
                "label": "Exodus",
                "title": "Exodus",
                "image": images["exodus"],
                "image_alt": "",
                "lede": (
                    "Exodus is a ministry dedicated to guiding individuals on a "
                    "journey of deliverance, purity, and transformation. Rooted in "
                    "the power of God's Word, Exodus helps individuals break free "
                    "from the chains of sin, harmful patterns, and worldly "
                    "influences, equipping them to walk in holiness and freedom. By "
                    "teaching spiritual truths and fostering accountability, Exodus "
                    "empowers individuals to leave behind the familiar but "
                    "destructive elements of the world that hinder their "
                    "relationship with God and embrace His purpose for their lives."
                ),
                "focus_items": [
                    {
                        "title": "Deliverance & Healing",
                        "body": (
                            "Exodus addresses spiritual strongholds and emotional wounds "
                            "through prayer, teaching, and guided processes of healing and "
                            "freedom."
                        ),
                    },
                    {
                        "title": "Leaving the World Behind",
                        "body": (
                            "Participants are guided in separating from harmful "
                            "environments, habits, and influences that hinder their "
                            "relationship with God."
                        ),
                    },
                    {
                        "title": "Pursuit of Purity",
                        "body": (
                            "The ministry emphasizes holy living, encouraging individuals "
                            "to align their thoughts, behaviors, and desires with biblical "
                            "standards."
                        ),
                    },
                    {
                        "title": "Spiritual Growth & Discipleship",
                        "body": (
                            "Through teaching and accountability, individuals are equipped "
                            "to grow consistently in their walk with Christ."
                        ),
                    },
                    {
                        "title": "Integration with Rugged & Covered",
                        "body": (
                            "Exodus works in conjunction with other ministries to ensure a "
                            "holistic transformation, supporting individuals across all "
                            "stages of their journey."
                        ),
                    },
                ],
                "scriptures": "Exodus 14:13-14, 2 Corinthians 6:17-18, Romans 12:2",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
        ],
    )

    upsert_page(
        "journey/cross-over",
        {
            "title": "Cross Over",
            "seo_title": "Cross Over | theWalk Ministries",
            "seo_description": (
                "Enter a place of restoration, support, and profound "
                "transformation."
            ),
        },
        [
            {"collection": "section_pathway_hero", "item": hero},
            {"collection": "section_pathway_about", "item": about},
            {"collection": "section_ministry_tabs", "item": tabs_section},
        ],
    )
    print("  ✓ journey/cross-over seeded")


# ─── Cross Roads ────────────────────────────────────────────────────────────


def seed_cross_roads(images: dict[str, str]) -> None:
    print("→ CROSS ROADS…")

    hero = upsert_section(
        "section_pathway_hero",
        "Cross Roads — hero",
        {
            "eyebrow": "Pathway",
            "headline": "Cross Roads",
            "subheadline": "Grow deeply in your identity, absolute truth, and spiritual direction.",
            "chips_csv": "Bible Study, Series, MyWalk",
            "cta_primary_label": "Get involved",
            "cta_primary_url": "/get-involved",
            "back_link_label": "← Back to Journey",
            "back_link_url": "/journey",
            "footnote": (
                "Cross Roads is dedicated to transforming how individuals see "
                "themselves, their associations, and their place in the world—"
                "deepening relationship with God and aligning life with His "
                "divine will."
            ),
            "image": images["cross-roads"],
            "image_alt": "",
        },
    )

    about = upsert_section(
        "section_pathway_about",
        "Cross Roads — about",
        {
            "eyebrow": "About",
            "headline": "Cross Roads for all.",
            "lede": (
                "Cross Roads Ministry is dedicated to transforming how individuals "
                "see themselves, their associations, and their place in the world."
            ),
            "cta_primary_label": "Talk to our team",
            "cta_primary_url": "/contact?type=journey&pathway=Cross%20Roads",
            "cta_secondary_label": "Get involved",
            "cta_secondary_url": "/get-involved",
        },
    )
    replace_children(
        "section_pathway_about",
        about,
        "section_pathway_about_items",
        [
            {
                "title": "For identity",
                "body": (
                    "At its core, this ministry seeks to reshape identity—guiding "
                    "believers to live fully as children of the Most High God and "
                    "citizens of His kingdom."
                ),
            },
            {
                "title": "For alignment",
                "body": (
                    "It centers on deepening our relationship with God and aligning "
                    "our lives with His divine will."
                ),
            },
            {
                "title": "For provision",
                "body": (
                    "Its mission is to help individuals embrace God's plan for their "
                    "lives and equip them to receive His provision for the journey "
                    "ahead."
                ),
            },
        ],
    )

    tabs_section = upsert_section(
        "section_ministry_tabs",
        "Cross Roads — ministries",
        {
            "eyebrow": "Ministries",
            "headline": "Bible Study, Series, MyWalk",
            "intro": (
                "Explore each ministry focus. Shareable links are available via "
                "the URL (for example, ?tab=mywalk)."
            ),
            "section_anchor": "cross-roads-ministries",
        },
    )
    replace_children(
        "section_ministry_tabs",
        tabs_section,
        "section_ministry_tabs_tabs",
        [
            {
                "key": "bible-study",
                "label": "Bible Study",
                "title": "Bible Study",
                "image": images["bible-study"],
                "image_alt": "",
                "lede": (
                    "Bible Study Ministry is dedicated to deepening our understanding "
                    "of God's Word as the foundation of our faith and relationship "
                    "with Him. This ministry focuses on equipping believers with the "
                    "knowledge and tools needed to rightly interpret Scripture and "
                    "experience the living power of God's Word. Through interactive "
                    "study, discussions and personal study, CR Bible Study seeks to "
                    "build a strong, scripturally grounded community, empowering "
                    "believers to confidently walk in the truth of God's Word."
                ),
                "focus_items": [
                    {"title": "Knowing God Through His Word", "body": "This ministry emphasizes building a personal relationship with God by understanding His character and will through Scripture."},
                    {"title": "Learning to Read & Interpret Scripture", "body": "Participants are trained in proper biblical interpretation, enabling them to study the Word accurately and confidently."},
                    {"title": "Engaging the Holy Spirit", "body": "The Holy Spirit is central to understanding Scripture, guiding believers into truth and deeper revelation."},
                    {"title": "Applying the Word to Daily Life", "body": "Teachings are designed to be practical, helping individuals live out biblical principles in everyday situations."},
                    {"title": "Strengthening Spiritual Discernment", "body": "Believers develop the ability to discern truth from error, making sound spiritual decisions."},
                ],
                "scriptures": "Hebrews 4:12, 2 Timothy 2:15, John 17:17",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "series",
                "label": "Series",
                "title": "Series",
                "image": images["series"],
                "image_alt": "",
                "lede": (
                    "theWalk Study Series is dedicated to exploring prominent, "
                    "overarching biblical themes crucial for understanding God's plan "
                    "and purpose in the lives of believers. Rooted in deep study and "
                    "guided by timely revelations, these studies seek to bring "
                    "clarity, unity, and transformation to the body of Christ. This "
                    "aspect of theWalk functions as a collaborative effort, where "
                    "core groups of selected individuals from various "
                    "ministries/organizations come together to study and present "
                    "these topics."
                ),
                "focus_items": [
                    {"title": "In-Depth Thematic Study", "body": "The series explores major biblical themes in detail, providing a comprehensive understanding of God\u2019s overarching plan."},
                    {"title": "Bridge Between Denominations", "body": "It creates unity by bringing together believers from different backgrounds to study and grow together."},
                    {"title": "Holy Spirit Encouraged Revelation (Biblically Sound)", "body": "Teachings are guided by the Holy Spirit while remaining grounded in Scripture, ensuring both depth and accuracy."},
                    {"title": "Collective Teaching, Sharing, Accountability & Cohesion", "body": "Participants contribute to and learn from one another, fostering a culture of shared growth and responsibility."},
                    {"title": "Equipping the Church", "body": "The ultimate goal is to prepare believers to serve effectively within the Body of Christ."},
                ],
                "scriptures": "Ephesians 4:13, John 16:13, 2 Timothy 3:16-17",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "mywalk",
                "label": "MyWalk",
                "title": "MyWalk",
                "image": images["mywalk"],
                "image_alt": "",
                "lede": (
                    "The MyWalk Ministry is a discipleship-based ministry focused on "
                    "the individual journey of the more seasoned believer. It "
                    "provides support, encouragement, and spiritual guidance, helping "
                    "individuals to move into their promised place or purpose with "
                    "faith. At its core, MyWalk is about identifying and moving into "
                    "God's will for our lives. It emphasizes inner healing and "
                    "developing spiritual fortitude through deliverance, prayer, "
                    "fasting, biblical teaching, mentorship and counseling."
                ),
                "focus_items": [
                    {"title": "Healing & Deliverance", "body": "myWalk addresses deeper personal and spiritual issues, helping individuals experience healing and freedom."},
                    {"title": "Purpose Discovery", "body": "Participants are guided in identifying their calling and aligning their lives with God\u2019s purpose."},
                    {"title": "Acquiring Natural and Spiritual Tools and Disciplines", "body": "The ministry equips individuals with both practical habits and spiritual disciplines necessary for growth."},
                    {"title": "Mentorship & Accountability", "body": "Ongoing mentorship provides guidance, while accountability ensures consistency and progress."},
                    {"title": "Support (Natural and Spiritual)", "body": "myWalk offers holistic support, addressing both everyday challenges and spiritual development."},
                ],
                "scriptures": "Jeremiah 29:13, Proverbs 11:14, Philippians 2:4",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
        ],
    )

    upsert_page(
        "journey/cross-roads",
        {
            "title": "Cross Roads",
            "seo_title": "Cross Roads | theWalk Ministries",
            "seo_description": (
                "Grow deeply in your identity, absolute truth, and spiritual "
                "direction."
            ),
        },
        [
            {"collection": "section_pathway_hero", "item": hero},
            {"collection": "section_pathway_about", "item": about},
            {"collection": "section_ministry_tabs", "item": tabs_section},
        ],
    )
    print("  ✓ journey/cross-roads seeded")


# ─── Cross Connect ──────────────────────────────────────────────────────────


def seed_cross_connect(images: dict[str, str]) -> None:
    print("→ CROSS CONNECT…")

    hero = upsert_section(
        "section_pathway_hero",
        "Cross Connect — hero",
        {
            "eyebrow": "Pathway",
            "headline": "Cross Connect",
            "subheadline": "Build enduring community, fellowship, and expand into Kingdom impact.",
            "chips_csv": "Small Groups, Prayer, Ministry Development",
            "cta_primary_label": "Get involved",
            "cta_primary_url": "/get-involved",
            "back_link_label": "← Back to Journey",
            "back_link_url": "/journey",
            "footnote": (
                "Cross Connect serves as a bridge—connecting believers to God, each "
                "other, and their purpose in the body of Christ so no one walks "
                "their journey alone."
            ),
            "image": images["cross-connect"],
            "image_alt": "",
        },
    )

    about = upsert_section(
        "section_pathway_about",
        "Cross Connect — about",
        {
            "eyebrow": "About",
            "headline": "Cross Connect for all.",
            "lede": (
                "Cross Connect is a ministry of fellowship, mentorship, and "
                "spiritual networking—designed to foster strong relationships, "
                "accountability, and unity among believers."
            ),
            "cta_primary_label": "Talk to our team",
            "cta_primary_url": "/contact?type=journey&pathway=Cross%20Connect",
            "cta_secondary_label": "Get involved",
            "cta_secondary_url": "/get-involved",
        },
    )
    replace_children(
        "section_pathway_about",
        about,
        "section_pathway_about_items",
        [
            {
                "title": "For community",
                "body": (
                    "At its heart, Cross Connect is about building community—ensuring "
                    "no one walks their spiritual journey alone."
                ),
            },
            {
                "title": "For mentorship",
                "body": (
                    "Through intentional connections and accountability, believers "
                    "support, encourage, and sharpen one another."
                ),
            },
            {
                "title": "For unity",
                "body": (
                    "Together we grow, serve, and pursue God's will—bridging "
                    "churches, ministries, and the wider body of Christ."
                ),
            },
        ],
    )

    tabs_section = upsert_section(
        "section_ministry_tabs",
        "Cross Connect — ministries",
        {
            "eyebrow": "Ministries",
            "headline": "Small Groups, Prayer, Ministry Development",
            "intro": (
                "Explore each ministry focus. Shareable links are available via "
                "the URL (for example, ?tab=prayer)."
            ),
            "section_anchor": "cross-connect-ministries",
        },
    )
    replace_children(
        "section_ministry_tabs",
        tabs_section,
        "section_ministry_tabs_tabs",
        [
            {
                "key": "small-groups",
                "label": "Small Groups",
                "title": "Small Groups",
                "image": images["small-groups"],
                "image_alt": "",
                "lede": (
                    "The heartbeat of intimate fellowship and spiritual growth within "
                    "theWalk. It exists to create safe, consistent, and Spirit-led "
                    "spaces where individuals can build deep relationships, explore "
                    "the Word of God, and grow in faith together. These groups are "
                    "small in size but through encouraging honest conversation, "
                    "shared experiences, accountability, and personal discipleship "
                    "are big in impact. Whether you're new to the faith or maturing "
                    "in your walk with Christ, small groups offer a place where "
                    "everyone is seen, heard, and supported."
                ),
                "focus_items": [
                    {"title": "Fellowship and Connection", "body": "Small groups create close-knit environments where individuals can build meaningful relationships."},
                    {"title": "Biblical Discussion", "body": "Participants engage in open discussions around Scripture, deepening understanding through dialogue."},
                    {"title": "Spiritual Accountability", "body": "Members encourage one another to stay committed and consistent in their walk with God."},
                    {"title": "Prayer & Support", "body": "Groups provide a safe space for sharing needs and praying for one another."},
                    {"title": "Life Application", "body": "Teachings are applied practically, helping individuals live out their faith daily."},
                ],
                "scriptures": "Acts 2:46-47, Galatians 6:2, Matthew 18:20",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "prayer",
                "label": "Prayer",
                "title": "Prayer",
                "image": images["prayer"],
                "image_alt": "",
                "lede": (
                    "The Prayer Ministry teaches and equips believers to build a "
                    "deeper relationship with God through prayer, focusing on "
                    "approaching Him rightly, aligning with His will, and praying "
                    "with confidence. Central to the ministry is the Court First "
                    "Prayer model, which trains believers to come before God as the "
                    "Righteous Judge with humility, faith, and spiritual strategy. "
                    "Beyond personal prayer, the ministry fosters unity by "
                    "encouraging collective intercession across churches, "
                    "ministries, and denominations."
                ),
                "focus_items": [
                    {"title": "Teaching Prayer Principles", "body": "Participants learn foundational principles of effective and biblically aligned prayer."},
                    {"title": "Court First Prayer Training", "body": "Believers are trained in approaching God with structure and understanding, emphasizing spiritual authority and alignment."},
                    {"title": "Prayer Mobilization", "body": "The ministry organizes collective prayer efforts to address specific needs and situations."},
                    {"title": "Developing Personal Prayer Life", "body": "Individuals are guided in building consistent and meaningful personal prayer habits."},
                    {"title": "Strategic Intercession", "body": "Focused intercession is used to address spiritual matters with intentionality and purpose."},
                ],
                "scriptures": "Hebrews 4:16, Luke 18:7-8, 2 Chronicles 7:14",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
            {
                "key": "ministry-development",
                "label": "Ministry Development",
                "title": "Ministry Development",
                "image": images["ministry-development"],
                "image_alt": "",
                "lede": (
                    "Ministry Development is dedicated to strengthening ministries by "
                    "providing practical support, administrative assistance, and "
                    "strategic resources. It focuses on helping churches and aligned "
                    "nonprofits to become more efficient, effective, and sustainable. "
                    "Through the collective network of ministries and non-profits, "
                    "it offers temporary staffing, project facilitation, financial "
                    "aid, and ministry support. Ministry Development also equips the "
                    "Body of Christ through leadership training, ministry courses, "
                    "and workshops to raise up capable workers for the harvest."
                ),
                "focus_items": [
                    {"title": "Administrative and Operational Support", "body": "This ministry assists organizations with systems, processes, and structure to improve efficiency."},
                    {"title": "Financial and Ministerial Aid", "body": "Support is provided to help ministries sustain and expand their work."},
                    {"title": "Staffing and Facilitation", "body": "Temporary or ongoing personnel support is offered to meet ministry needs."},
                    {"title": "Training and Equipping", "body": "Leaders and workers are trained through courses and workshops to strengthen their effectiveness."},
                    {"title": "Collaboration Forums", "body": "Spaces are created for ministries to connect, share resources, and work together toward common goals."},
                ],
                "scriptures": "Ephesians 4:11-12, Ecclesiastes 4:9, Galatians 6:2",
                "cta_label": "Contact us",
                "cta_url": "/contact?type=serve&ministry={label}",
            },
        ],
    )

    upsert_page(
        "journey/cross-connect",
        {
            "title": "Cross Connect",
            "seo_title": "Cross Connect | theWalk Ministries",
            "seo_description": (
                "Build enduring community, fellowship, and expand into Kingdom "
                "impact."
            ),
        },
        [
            {"collection": "section_pathway_hero", "item": hero},
            {"collection": "section_pathway_about", "item": about},
            {"collection": "section_ministry_tabs", "item": tabs_section},
        ],
    )
    print("  ✓ journey/cross-connect seeded")


# ─── main ────────────────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")

    print("→ schema: section_pathway_hero")
    build_section_pathway_hero()
    print("→ schema: section_pathway_about")
    build_section_pathway_about()
    print("→ schema: extend section_ministry_tabs")
    extend_section_ministry_tabs()

    print("→ M2A: grow allowed_collections")
    grow_pages_sections_m2a()

    print("→ permissions: public read")
    ensure_public_read([
        "section_pathway_hero",
        "section_pathway_about",
        "section_pathway_about_items",
    ])

    folder_id = get_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading pathway hero + tab images…")
    images = upload_all_images(folder_id)

    seed_cross_over(images)
    seed_cross_roads(images)
    seed_cross_connect(images)

    print("✓ Wave 4 seed complete")


if __name__ == "__main__":
    main()
