#!/usr/bin/env python3
"""
Wave 6 seed: first-class `series` entity.

Idempotent. Safe to re-run.

Background
----------
Today the homepage "Current series" block is hardcoded (six cards), and
the /growth/articles page treats "Series" as a flat category tag. The
two surfaces drifted: a "series" meant different things to editors.

Wave 6 unifies both. A series is now a real Directus collection — a
collection of ordered article chapters — that both the homepage and
the articles page read from.

What it does
------------
  1. Creates the `series` collection:
       slug, title, subtitle, description, cover_image, cover_alt,
       is_current (bool), sort, status + user timestamps.
  2. Extends the existing `articles` collection:
       + series (m2o → series, nullable)
       + series_sort (integer, 1-indexed position within the series)
       + image (file-image) so editors see thumbnails in Directus
  3. Sets public read permission on `series` (filtered to published).
  4. Downloads + uploads the six original "Components of Walking"
     photographs into the Public/ folder.
  5. Creates / updates the "Components of Walking" series row with
     is_current=true, sort=0.
  6. Creates / updates the six chapter articles (category="series",
     series → Components of Walking, series_sort 1..6) matching the
     original homepage copy verbatim.

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \\
    DIRECTUS_TOKEN=… \\
    python3 scripts/cms/seed_wave6.py
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


def collection_exists(name: str) -> bool:
    return get(f"/collections/{name}").status_code == 200


def field_exists(collection: str, field: str) -> bool:
    return get(f"/fields/{collection}/{field}").status_code == 200


def relation_exists(collection: str, field: str) -> bool:
    return get(f"/relations/{collection}/{field}").status_code == 200


# ─── schema migration helpers ────────────────────────────────────────────────


STATUS_CHOICES = [
    {"text": "Published", "value": "published", "color": "#2ECD6F"},
    {"text": "Draft", "value": "draft", "color": "#D3DAE4"},
    {"text": "Archived", "value": "archived", "color": "#A2B5CD"},
]
CONTENT_COLOR = "#FF7554"


def ensure_collection(
    name: str,
    *,
    note: str,
    icon: str = "collections_bookmark",
    sort_field: str | None = "sort",
    hidden: bool = False,
) -> None:
    if collection_exists(name):
        print(f"  ✓ collection exists: {name}")
        return
    meta: dict[str, Any] = {
        "icon": icon,
        "color": CONTENT_COLOR,
        "note": note,
        "hidden": hidden,
        "singleton": False,
        "accountability": "all",
        "archive_field": "status",
        "archive_value": "archived",
        "unarchive_value": "draft",
        "archive_app_filter": True,
        "display_template": "{{title}}",
        "translations": None,
    }
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
                "meta": {
                    "hidden": True,
                    "readonly": True,
                    "interface": "input",
                    "special": ["uuid"],
                },
                "schema": {
                    "is_primary_key": True,
                    "length": 36,
                    "has_auto_increment": False,
                },
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
        {
            "field": "sort",
            "type": "integer",
            "meta": {"interface": "input", "hidden": True},
            "schema": {},
        },
        f"+sort on {collection}",
    )


def add_string(
    collection: str,
    field: str,
    *,
    required: bool = False,
    unique: bool = False,
    note: str | None = None,
    width: str = "full",
) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "string",
            "meta": {
                "width": width,
                "interface": "input",
                "note": note,
                "required": required,
            },
            "schema": {"is_nullable": not required, "is_unique": unique},
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


def add_boolean(
    collection: str, field: str, *, default: bool = False, note: str | None = None
) -> None:
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


def add_integer(
    collection: str, field: str, *, note: str | None = None, hidden: bool = False
) -> None:
    if field_exists(collection, field):
        return
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "integer",
            "meta": {
                "width": "half",
                "interface": "input",
                "note": note,
                "hidden": hidden,
            },
            "schema": {"is_nullable": True},
        },
        f"+{field} on {collection}",
    )


def add_file(
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
            "type": "uuid",
            "meta": {
                "width": "full",
                "interface": "file-image",
                "display": "image",
                "special": ["file"],
                "note": note,
                "required": required,
            },
            "schema": {
                "is_nullable": not required,
                "foreign_key_table": "directus_files",
            },
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
                "display_options": {"relative": True}
                if typ == "timestamp"
                else {"circle": True},
            },
            "schema": {},
        }
        if typ == "uuid":
            body["schema"] = {"foreign_key_table": "directus_users"}
        post(f"/fields/{collection}", body, f"+{name} on {collection}")


def add_m2o(
    child: str,
    field: str,
    parent: str,
    *,
    template: str = "{{title}}",
    note: str | None = None,
) -> None:
    """Add a many-to-one relation `child.field → parent`."""
    if not field_exists(child, field):
        post(
            f"/fields/{child}",
            {
                "field": field,
                "type": "uuid",
                "meta": {
                    "width": "half",
                    "interface": "select-dropdown-m2o",
                    "special": ["m2o"],
                    "options": {"template": template},
                    "note": note,
                },
                "schema": {
                    "is_nullable": True,
                    "foreign_key_table": parent,
                },
            },
            f"+{field} on {child}",
        )
    if not relation_exists(child, field):
        post(
            "/relations",
            {
                "collection": child,
                "field": field,
                "related_collection": parent,
                "schema": {"on_delete": "SET NULL"},
                "meta": {"sort_field": None},
            },
            f"relation {child}.{field} → {parent}",
        )


def add_o2m_alias(parent: str, field: str, child: str, child_fk: str) -> None:
    """Add the alias O2M side of an existing M2O on the child.

    Assumes `child.child_fk` → `parent` relation already exists.
    """
    if field_exists(parent, field):
        return
    post(
        f"/fields/{parent}",
        {
            "field": field,
            "type": "alias",
            "meta": {
                "width": "full",
                "interface": "list-o2m",
                "special": ["o2m"],
                "options": {"enableCreate": True, "enableSelect": True},
            },
            "schema": None,
        },
        f"+{field} on {parent}",
    )
    # Stamp `one_field` on the relation so the alias is linked.
    patch_rel = S.patch(
        f"{BASE}/relations/{child}/{child_fk}",
        json={"meta": {"one_field": field, "sort_field": "series_sort"}},
    )
    if not patch_rel.ok:
        print(
            f"  WARN: could not set one_field on {child}.{child_fk}: "
            f"{patch_rel.status_code} {patch_rel.text[:200]}"
        )


# ─── schema: series + articles extensions ────────────────────────────────────


def build_series_collection() -> None:
    name = "series"
    ensure_collection(
        name,
        note="Ordered collection of article chapters (e.g. 'Components of Walking').",
        icon="collections_bookmark",
    )
    add_status(name)
    add_sort(name)
    add_string(
        name,
        "slug",
        required=True,
        unique=True,
        note="URL-safe identifier, e.g. 'components-of-walking'.",
    )
    add_string(name, "title", required=True)
    add_string(name, "subtitle", note="Short tagline shown near the title.")
    add_text(
        name,
        "description",
        note="Long copy shown next to the card grid on the homepage.",
    )
    add_file(name, "cover_image", note="Optional cover image for list/detail views.")
    add_string(name, "cover_alt")
    add_boolean(
        name,
        "is_current",
        note="Mark exactly one series as 'current' to feature on the homepage.",
    )
    add_user_timestamps(name)


def extend_articles_with_series() -> None:
    """Add `series` m2o + `series_sort` to the existing `articles` table."""
    add_m2o(
        "articles",
        "series",
        "series",
        template="{{title}}",
        note="Parent series if this article is a chapter.",
    )
    add_integer(
        "articles",
        "series_sort",
        note="1-indexed position within the parent series.",
    )
    # Now surface the reverse side on `series` as an alias field so editors
    # can manage the chapter order from the series page.
    add_o2m_alias("series", "articles", "articles", "series")


def extend_articles_with_image_file() -> None:
    """
    Add a proper file-image field to `articles` so editors see thumbnails.

    We keep legacy `image_url` around for backwards compatibility, but new
    edits should use `image` going forward.
    """
    add_file(
        "articles",
        "image",
        note="Article card image (preferred). Replaces legacy image_url.",
    )


def migrate_article_images() -> None:
    """
    Best-effort migration:
      - If `articles.image` is empty and `image_url` looks like a Directus file id,
        copy it into `image`.
      - If `image_url` is a Directus assets URL, extract the id and copy it.
    """
    if not field_exists("articles", "image"):
        print("  · articles.image missing; skipping image migration")
        return

    r = S.get(
        f"{BASE}/items/articles",
        params={
            "limit": -1,
            "fields": "id,slug,image,image_url",
        },
    )
    if not r.ok:
        print(f"  WARN: cannot list articles for image migration: {r.status_code}")
        return

    def extract_file_id(value: str) -> str | None:
        v = (value or "").strip()
        if not v:
            return None
        # Directus file id is a UUID.
        if len(v) == 36 and v.count("-") == 4:
            return v
        # Directus assets URL: https://cms.../assets/<uuid>(?...).
        if "/assets/" in v:
            after = v.split("/assets/", 1)[1]
            fid = after.split("?", 1)[0].split("/", 1)[0].strip()
            if len(fid) == 36 and fid.count("-") == 4:
                return fid
        return None

    migrated = 0
    for row in r.json().get("data", []):
        if row.get("image"):
            continue
        fid = extract_file_id(row.get("image_url") or "")
        if not fid:
            continue
        pr = S.patch(f"{BASE}/items/articles/{row['id']}", json={"image": fid})
        if pr.ok:
            migrated += 1
        else:
            print(
                f"  WARN: could not migrate image for {row.get('slug')}: "
                f"{pr.status_code} {pr.text[:120]}"
            )
    if migrated:
        print(f"  + migrated articles.image for {migrated} rows")
    else:
        print("  · no articles.image rows needed migration")


# ─── permissions ─────────────────────────────────────────────────────────────


def ensure_public_read(collections: list[tuple[str, bool]]) -> None:
    """Grant public read permission to each (collection, published_only) pair."""
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
        get(
            f"/permissions?filter[policy][_eq]={policy_id}&limit=-1&fields=id,collection,action"
        )
        .json()
        .get("data", [])
    )
    existing = {(p["collection"], p["action"]) for p in ex}
    for coll, published_only in collections:
        if (coll, "read") in existing:
            print(f"  ✓ public read perm exists: {coll}")
            continue
        body: dict[str, Any] = {
            "policy": policy_id,
            "collection": coll,
            "action": "read",
            "permissions": {"status": {"_eq": "published"}} if published_only else {},
            "validation": {},
            "fields": ["*"],
        }
        post("/permissions", body, f"+public read on {coll}")


def widen_articles_public_fields(new_fields: list[str]) -> None:
    """Ensure the existing public read permission on `articles` exposes
    the new `series` + `series_sort` fields.

    The existing permission (set up in earlier waves) has an explicit
    fields allowlist. When we add new fields to the collection they are
    rejected by the public API until we add them to this list.
    """
    r = get(
        "/permissions"
        "?filter[collection][_eq]=articles"
        "&filter[action][_eq]=read"
        "&fields=id,fields&limit=-1"
    )
    if not r.ok:
        print(f"  WARN: cannot read articles permissions: {r.status_code}")
        return
    perms = r.json().get("data", [])
    if not perms:
        print("  · no public read permission on articles; skipping")
        return
    for p in perms:
        current = list(p.get("fields") or [])
        # If "*" is allowed already, nothing to do.
        if "*" in current:
            continue
        missing = [f for f in new_fields if f not in current]
        if not missing:
            print(f"  ✓ articles permission {p['id']} already exposes new fields")
            continue
        merged = current + missing
        pr = S.patch(
            f"{BASE}/permissions/{p['id']}",
            json={"fields": merged},
        )
        if not pr.ok:
            print(
                f"  WARN: could not widen articles permission {p['id']}: "
                f"{pr.status_code} {pr.text[:200]}"
            )
        else:
            print(
                f"  + articles permission {p['id']} widened with: {missing}"
            )


# ─── files ───────────────────────────────────────────────────────────────────


def get_public_folder() -> str:
    r = S.get(
        f"{BASE}/folders",
        params={
            "filter[name][_eq]": PUBLIC_FOLDER_NAME,
            "limit": 1,
            "fields": "id",
        },
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    fail("Public folder missing — run seed_wave1.py first")


def find_file_by_name(name: str) -> str | None:
    r = S.get(
        f"{BASE}/files",
        params={
            "filter[filename_download][_eq]": name,
            "limit": 1,
            "fields": "id",
        },
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    return None


def upload_remote_image(url: str, filename: str, folder_id: str, title: str) -> str:
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


# Each chapter keeps its original homepage image so nothing visually shifts.
CHAPTERS = [
    {
        "slug": "components-of-walking",
        "title": "Components of Walking",
        "excerpt": "What components influence your journey through life?",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-01.jpg",
        "image_title": "Components of Walking — Part 1",
        "image_alt": "Wide landscape — components of a journey",
    },
    {
        "slug": "a-desire-to-move",
        "title": "A Desire to Move",
        "excerpt": "It begins with love.",
        "image_url": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-02.jpg",
        "image_title": "Components of Walking — Part 2",
        "image_alt": "Warm sunrise — desire and beginnings",
    },
    {
        "slug": "a-path-chosen",
        "title": "A Path Chosen",
        "excerpt": "Directed by glory.",
        "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-03.jpg",
        "image_title": "Components of Walking — Part 3",
        "image_alt": "Forest path — a chosen way",
    },
    {
        "slug": "movement",
        "title": "Movement",
        "excerpt": "Powered by faith.",
        "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-04.jpg",
        "image_title": "Components of Walking — Part 4",
        "image_alt": "Mountain vista — forward movement",
    },
    {
        "slug": "staying-the-course",
        "title": "Staying the Course",
        "excerpt": "Seasons and cycles.",
        "image_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-05.jpg",
        "image_title": "Components of Walking — Part 5",
        "image_alt": "Misty hills — seasons and endurance",
    },
    {
        "slug": "destinations",
        "title": "Destinations",
        "excerpt": "Where are we going, and how will we get there?",
        "image_url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop",
        "image_filename": "series-components-of-walking-06.jpg",
        "image_title": "Components of Walking — Part 6",
        "image_alt": "Lake and mountains — destination ahead",
    },
]


def upload_chapter_images(folder_id: str) -> dict[str, str]:
    """Return slug → Directus file id."""
    out: dict[str, str] = {}
    for ch in CHAPTERS:
        fid = upload_remote_image(
            ch["image_url"], ch["image_filename"], folder_id, ch["image_title"]
        )
        out[ch["slug"]] = fid
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


def upsert_series(slug: str, payload: dict) -> str:
    existing = find_one("series", {"slug": slug})
    body = {**payload, "slug": slug, "status": "published"}
    if existing:
        r = S.patch(f"{BASE}/items/series/{existing['id']}", json=body)
        if not r.ok:
            fail(f"patch series/{slug}: {r.status_code} {r.text}")
        return existing["id"]
    r = S.post(f"{BASE}/items/series", json=body)
    if not r.ok:
        fail(f"create series/{slug}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


def clear_current_flag_except(series_id: str) -> None:
    """Ensure only `series_id` has is_current=true (business rule)."""
    r = S.get(
        f"{BASE}/items/series",
        params={
            "filter[is_current][_eq]": "true",
            "fields": "id",
            "limit": -1,
        },
    )
    if not r.ok:
        return
    for row in r.json().get("data", []):
        if row["id"] == series_id:
            continue
        S.patch(f"{BASE}/items/series/{row['id']}", json={"is_current": False})


def upsert_article(payload: dict) -> str:
    slug = payload["slug"]
    existing = find_one("articles", {"slug": slug})
    if existing:
        r = S.patch(f"{BASE}/items/articles/{existing['id']}", json=payload)
        if not r.ok:
            fail(f"patch articles/{slug}: {r.status_code} {r.text}")
        return existing["id"]
    r = S.post(f"{BASE}/items/articles", json=payload)
    if not r.ok:
        fail(f"create articles/{slug}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


# ─── seed ────────────────────────────────────────────────────────────────────


def seed_components_of_walking(images_by_slug: dict[str, str]) -> None:
    print("→ SERIES: Components of Walking…")

    series_id = upsert_series(
        "components-of-walking",
        {
            "title": "The Current series",
            "subtitle": "Components of Walking",
            "description": (
                "As believers, the concept of \u201cwalking\u201d should have "
                "some significance to us in the context of our faith. These "
                "six parts outline what is necessary for purposeful walking "
                "/ movement to take place."
            ),
            "is_current": True,
            "sort": 0,
        },
    )
    clear_current_flag_except(series_id)
    print(f"  ✓ series row: {series_id}")

    for idx, ch in enumerate(CHAPTERS, start=1):
        upsert_article(
            {
                "slug": ch["slug"],
                "title": ch["title"],
                "excerpt": ch["excerpt"],
                "category": "series",
                "featured": False,
                "author": "theWalk",
                # Use a stable date so repeated seeds don't churn ordering.
                "date_published": f"2026-01-{idx:02d}",
                # Prefer the file field for editor thumbnails.
                "image": images_by_slug[ch["slug"]],
                # Keep legacy field populated for backwards compatibility.
                "image_url": f"{BASE}/assets/{images_by_slug[ch['slug']]}",
                "image_alt": ch["image_alt"],
                "body": (
                    "Full article content will load here from your CMS when "
                    "connected. This scaffold keeps the chapter reachable "
                    "while editors flesh out the body."
                ),
                "status": "published",
                "series": series_id,
                "series_sort": idx,
            }
        )
        print(f"  ✓ article: {ch['slug']} (part {idx})")


# ─── main ────────────────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")

    print("→ schema: series collection")
    build_series_collection()

    print("→ schema: articles.series (m2o) + articles.series_sort")
    extend_articles_with_series()

    print("→ schema: articles.image (file)")
    extend_articles_with_image_file()

    print("→ permissions: public read")
    ensure_public_read(
        [
            ("series", True),
            # `articles` already has a public read permission from earlier
            # setup; we just need to widen its `fields` allowlist to
            # include the two new fields.
        ]
    )
    widen_articles_public_fields(["series", "series_sort", "image"])

    print("→ migrate: articles.image from legacy image_url (best-effort)")
    migrate_article_images()

    folder_id = get_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading chapter images…")
    images_by_slug = upload_chapter_images(folder_id)

    seed_components_of_walking(images_by_slug)

    print("✓ Wave 6 seed complete")


if __name__ == "__main__":
    main()
