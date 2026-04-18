#!/usr/bin/env python3
"""
Wave 3 seed: Beliefs + Ministry Structure pages.

Idempotent. Safe to re-run.

What it does:
  1. Ensures two new section schemas exist on the live Directus instance:
       - section_doctrine_block          (+ section_doctrine_block_items)
       - section_principles_panel        (+ section_principles_panel_items)
     Plus o2m relations, public read permissions, and grows the
     pages.sections M2A allowed_collections union to include the new types.
  2. Uploads the Ministry Structure org-chart graphic into Public/.
  3. Creates / updates pages/beliefs (4 doctrine blocks; Members has 5 items).
  4. Creates / updates pages/ministry-structure (principles_panel + doctrine_block).

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \
    DIRECTUS_TOKEN=… \
    python3 scripts/cms/seed_wave3.py
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


# ─── helpers ──────────────────────────────────────────────────────────────────


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


# ─── schema migration ────────────────────────────────────────────────────────


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


def build_section_doctrine_block() -> None:
    name = "section_doctrine_block"
    items = "section_doctrine_block_items"
    ensure_collection(name, note="Headline + body + sub-points + scripture refs.", icon="menu_book")
    add_status(name)
    add_title_internal(name)
    add_string(name, "eyebrow")
    add_string(name, "headline")
    add_string(name, "subheadline", note="Small caps line under the headline (e.g. '(GodHead)').")
    add_text(name, "body", markdown=True, note="Paragraphs separated by blank lines. Inline links: [text](url).")
    add_string(name, "scripture_refs", note="Comma-separated bible references.")
    add_string(name, "variant", choices=["default", "muted-panel"], default="default")
    add_user_timestamps(name)
    ensure_collection(items, note="Sub-points within a section_doctrine_block.", icon="format_list_bulleted", archive_field=None, sort_field="sort", hidden=True)
    add_sort(items)
    add_string(items, "title", required=True)
    add_text(items, "body", markdown=True)
    add_string(items, "scripture_refs")
    add_o2m(name, "items", items)


def build_section_principles_panel() -> None:
    name = "section_principles_panel"
    items = "section_principles_panel_items"
    ensure_collection(name, note="Image + side panel of named principles.", icon="schema")
    add_status(name)
    add_title_internal(name)
    add_string(name, "eyebrow")
    add_string(name, "headline", required=True)
    add_text(name, "subheadline", note="Short intro line under the headline.")
    add_file(name, "image", required=True)
    add_string(name, "image_alt", required=True)
    add_user_timestamps(name)
    ensure_collection(items, note="Named principles displayed alongside the image.", icon="format_list_numbered", archive_field=None, sort_field="sort", hidden=True)
    add_sort(items)
    add_string(items, "title", required=True, note="Short uppercase label.")
    add_text(items, "body", markdown=True)
    add_string(items, "scripture_refs", note="Optional comma-separated bible references.")
    add_o2m(name, "items", items)


def grow_pages_sections_m2a() -> None:
    """Append the new section types to the M2A allowed_collections union."""
    junction = "pages_sections"
    new_types = ["section_doctrine_block", "section_principles_panel"]
    cur = get(f"/relations/{junction}/item")
    if not cur.ok:
        fail(f"M2A relation missing on {junction}.item — was Wave 0 schema run?")
    cur_meta = (cur.json().get("data") or {}).get("meta") or {}
    cur_allowed = list(cur_meta.get("one_allowed_collections") or [])
    missing = [c for c in new_types if c not in cur_allowed]
    if not missing:
        print(f"  ✓ M2A allowed_collections already includes new types")
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
        # Top-level published filter for status-driven section collections;
        # nested *_items rows are accessed only through their parent.
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


def upload_local_file(path: Path, folder_id: str, title: str) -> str:
    existing = find_file_by_name(path.name)
    if existing:
        S.patch(f"{BASE}/files/{existing}", json={"folder": folder_id, "title": title})
        return existing
    if not path.exists():
        fail(f"missing local file: {path}")
    with open(path, "rb") as f:
        r = requests.post(
            f"{BASE}/files",
            headers=H_NO_CT,
            files={"file": (path.name, f, "application/octet-stream")},
            data={"folder": folder_id, "title": title},
        )
    if not r.ok:
        fail(f"upload {path.name}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


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
    """Delete-and-recreate sub-items so order + content match exactly."""
    fk = f"{parent_collection}_id"
    old = (
        S.get(
            f"{BASE}/items/{child_collection}",
            params={
                f"filter[{fk}][_eq]": parent_id,
                "fields": "id",
                "limit": -1,
            },
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
                params={
                    "filter[pages_id][_eq]": existing["id"],
                    "fields": "id",
                    "limit": -1,
                },
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


def seed_beliefs() -> None:
    print("→ BELIEFS sections…")

    father = upsert_section(
        "section_doctrine_block",
        "Beliefs — Father",
        {
            "eyebrow": None,
            "headline": "Father",
            "subheadline": "(GodHead)",
            "body": (
                "In Him does the divine and perfect will of the Godhead reside and in Him, "
                "it has been established, He is sovereign. His will is perfect and our "
                "primary focus and goal is to ensure that as His vessels we seek to "
                "completely fulfil the will of the Father, collectively and individually"
            ),
            "scripture_refs": "Proverbs 3:6, Matthew 6:10, Proverbs 19:21, James 4:15",
            "variant": "default",
        },
    )

    son = upsert_section(
        "section_doctrine_block",
        "Beliefs — The Son",
        {
            "eyebrow": None,
            "headline": "The Son (Jesus Christ)",
            "subheadline": "(GodHead)",
            "body": (
                "The Son of God is Jesus Christ, He is the manifestation of the will of "
                "the Father, and He is the Lamb of God.\n\n"
                "He was sacrificed so that all humanity could have the opportunity to be "
                "saved from the damnation which is the result of sin. He Jesus Christ, the "
                "Word of God, came to the earth as the Son of Man and was crucified. By "
                "His sacrifice, provision unto justification concerning the judgment of "
                "the Father's decree, which states that \"the wages of sin is death\", was "
                "satisfied. For all those who accept Jesus' sacrifice by faith, they are "
                "saved by this gracious act of God, the Father, through the Son.\n\n"
                "We believe that the Son of God came to earth, lived a life without sin "
                "and was therefore not worthy of death, He chose to die in exchange for "
                "humanity, in effect giving His righteousness and perfect life/spirit to "
                "us while taking on our broken lives. In faith, we continue to live His "
                "life today, through the Holy Spirit.\n\n"
                "Jesus is now our Lord, He is the Word of God in all His manifested forms "
                "in body as the Christ, in Logos via the Scriptures and in Rhema through "
                "prophetic utterance. We believe that the Logos Word and Rhema Word are "
                "authoritative as long as they agree and in no way conflict with each "
                "other, because we believe that the God we serve is unchanging as He "
                "claims, then the Logos Word remains and is unchangeable."
            ),
            "scripture_refs": "Matthew 3:17, Matthew 17:5, John 5:19, John 5:30, John 3:16, John 1:1",
            "variant": "default",
        },
    )

    spirit = upsert_section(
        "section_doctrine_block",
        "Beliefs — Holy Spirit",
        {
            "eyebrow": None,
            "headline": "The Holy Spirit",
            "subheadline": "(GodHead)",
            "body": (
                "The Holy Spirit is one with God the Father and the Son (the Word of "
                "God), they have, do and will always agree. He is the very presence of "
                "God with humanity now that the Son of God doesn't presently walk in the "
                "flesh within the earth. The Holy Spirit is the means by which everything "
                "truly Godly is made possible in and through mankind, it is through the "
                "Holy Spirit that man is made to know the righteous standard of God, it "
                "is this conviction of sin that draws humanity to seek God's "
                "righteousness.\n\n"
                "When we accept Jesus Christ as Lord and Savior acknowledging our sin and "
                "the price paid for it, the Holy Spirit comes and dwells within us, "
                "bringing with Him all that is God, i.e. His dwelling within us makes us "
                "tabernacles for God. We by the Holy Spirit dwelling within us are "
                "provided with a Helper, Comforter and Guide that is always present, by "
                "this Jesus' words \"I will never leave you or forsake you\", is "
                "fulfilled. When the Holy Spirit is embraced by the believer and is "
                "trusted and followed the fruit of the Spirit are cultivated, these are "
                "love, joy, peace, patience, kindness, goodness, faithfulness, "
                "gentleness and self-control. It is this fruit that makes us strong in "
                "the Lord.\n\n"
                "The same power and authority that Jesus the Son of Man walked in, "
                "through the Holy Spirit we too walk in this very power and authority, "
                "when we fully realise all that we are in Christ. It is through the "
                "Spirit of God that we know the will of the Father and can apply the "
                "Word of God and therefore function effectively as Ambassadors to His "
                "Kingdom. The Holy Spirit supports the work given by the Word of God in "
                "the creation of disciples of Christ and the spreading of the Gospel of "
                "the Kingdom of God. He does this by empowering the testimony of those "
                "sent out with the manifestation of the knowledge, works and power of "
                "the Kingdom of God to which the gospel testifies, displaying clearly "
                "that the Kingdom of God is undoubtedly at hand."
            ),
            "scripture_refs": (
                "John 16:7-11, John 14:16, 1 Corinthians 3:16, Romans 8:9, John 16:14, "
                "2 Corinthians 6:16, Deuteronomy 31:6, 1 Corinthians 6:19-20, John 16:13, "
                "John 15:26, 1 Corinthians 12:3, Galatians 5:22-23, 1 Corinthians 12:1-31"
            ),
            "variant": "default",
        },
    )

    members = upsert_section(
        "section_doctrine_block",
        "Beliefs — Members",
        {
            "eyebrow": None,
            "headline": "Members",
            "subheadline": "(Children of God)",
            "body": None,
            "scripture_refs": (
                "Matthew 5:3-10, Matthew 18:6, Mark 10:43, John 13:1-17, Luke 22:25-26, "
                "John 7:18, Ephesians 6:6, Psalms 15:1-5, Matthew 20:26, Matthew 20:28, "
                "1 Corinthians 9:19, 1 Corinthians 12:12-26, John 3:27-30"
            ),
            "variant": "default",
        },
    )
    replace_children(
        "section_doctrine_block",
        members,
        "section_doctrine_block_items",
        [
            {
                "title": "Importance of Structure",
                "body": (
                    "While we believe that structure and hierarchy are fundamental we "
                    "also believe that the structure of an organism should be based on "
                    "the purpose of the organism. Our focus and structure therefore at "
                    "all times will be based on our community (the Kingdom of God, and "
                    "its King) and our purpose within the wider community the ecclesia, "
                    "as it relates to the specific mandates given to theWalk."
                ),
                "scripture_refs": None,
            },
            {
                "title": "Importance of Diversity and Unity",
                "body": (
                    "We believe that just as the health of a natural body is dependent "
                    "on all components of that body being well-nourished, communicating "
                    "and functioning well together, then also, there is need for us as "
                    "the Body of Christ to be all well-nourished and communicating "
                    "purposefully so we also can be healthier in our collective "
                    "purpose.\n\n"
                    "Further, we believe that only in the presence and service of "
                    "another can the true value of our uniqueness, purpose and "
                    "ultimately, our fulfilment be realised. We therefore encourage "
                    "collaboration at all levels for growth so that connectivity and "
                    "strength of the community can be enhanced."
                ),
                "scripture_refs": None,
            },
            {
                "title": "New Converts",
                "body": (
                    "Children are not able to vote, work, or contribute in many ways "
                    "that adults do to society, yet in most cultures and in many "
                    "aspects they are the ones most loved and cherished, this often "
                    "makes those who are most vulnerable the ones most valued ( "
                    "Matthew 18:6). The new, the young and the unshaped are vital "
                    "aspects to any organism as these are able to change beyond the "
                    "taught limits of its established environment; we believe that all "
                    "members of this ministry are essential to the success of the "
                    "ministry and openly welcome and accept all opinions for "
                    "discussion. It is not possible to journey through extreme terrain "
                    "with small children without there being inherent dangers as a "
                    "result of the journey itself but it is difficult to travel "
                    "through any terrain with those who have not travelled that way "
                    "before and not learn something new from the questions they "
                    "present that you yourself haven't thought to ask. So it is our "
                    "goal that as much as is possible we grow together as we believe "
                    "that true learning requires that established perceptions and "
                    "world views are discussed so we can learn from each our "
                    "individual angles of perception. We will not be hindering the "
                    "voices of the members of our community and welcome all "
                    "respectable expression so that the Word of God can be expressed "
                    "in its full clarity to them and us."
                ),
                "scripture_refs": None,
            },
            {
                "title": "Leaders",
                "body": (
                    "Those who will be elevated in this community to maintain "
                    "structure and give guidance by the leading of the Holy Spirit "
                    "due to their relationship with the King and their willingness to "
                    "be open to Him for this cause will be servant leaders, leaders "
                    "for the purpose of servitude. This servitude is expressed first "
                    "and primarily to the King and secondly without deviation to the "
                    "community and all that pertains to it. There will be no "
                    "assigning of titles within the community outside of for the "
                    "purpose for determining of roles unique to this ministry, and "
                    "these will be deliberately kept distinct from biblical titles, "
                    "as we do not intend to create a super church but rather a "
                    "community for the gathering of churches. We endeavour to "
                    "maintain a relaxed family atmosphere as much as is possible and "
                    "to promote respect at all levels. While we will not enforce the "
                    "absolute use of titles or issue any Biblical titles within our "
                    "community, the titles of members from their respected ministries "
                    "should be observed and respected, and the roles of those within "
                    "the community should be adhered to as much as is required for "
                    "structure and organization.\n\n"
                    "We believe that being set apart by God to be an Apostle, "
                    "Prophet, Evangelist, Pastor or Teacher to the Body of Christ is "
                    "inherent from Him and comes from above and not from men or self, "
                    "respect is to be shown to all those who sit in authoritative "
                    "positions within the body of Christ because they have been "
                    "chosen by Him and to all those who do not have these five fold "
                    "titles because they too are a part of Him. We will enforce "
                    "respect through grace for all members of the community.\n\n"
                    "We define respect as that which God revealed through the 10 "
                    "commandments and we define grace to be that which has the "
                    "capacity to go above these statutes through the Spirit of God "
                    "and seek peace not through justice alone but to seek peace, "
                    "through mercy and forgiveness as well."
                ),
                "scripture_refs": None,
            },
            {
                "title": "Unification of Ministries",
                "body": (
                    "We fully expect to draw upon the collective and individual "
                    "strengths of ministries, ministers and members of all those who "
                    "will walk with us, to assist in our collective endeavours, as we "
                    "may make requests of the anointing and gifted them for the Body "
                    "of Christ.\n\n"
                    "A system for a servant leadership "
                    "[Ministry Structure](/about/ministry-structure) has been given "
                    "which embodies the ideals we see in scripture and it is these "
                    "we will endeavour to establish our community upon."
                ),
                "scripture_refs": None,
            },
        ],
    )

    upsert_page(
        "beliefs",
        {
            "title": "Our Beliefs",
            "seo_title": "Beliefs (by Structure) | theWalk Ministries",
            "seo_description": (
                "What we believe about the Father, the Son, the Holy Spirit, and the "
                "people of God—structure, unity, and servant leadership."
            ),
        },
        [
            {"collection": "section_doctrine_block", "item": father},
            {"collection": "section_doctrine_block", "item": son},
            {"collection": "section_doctrine_block", "item": spirit},
            {"collection": "section_doctrine_block", "item": members},
        ],
    )
    print("  ✓ beliefs seeded")


def seed_ministry_structure(orgchart_image: str) -> None:
    print("→ MINISTRY STRUCTURE sections…")

    hero = upsert_section(
        "section_principles_panel",
        "Ministry Structure — hero principles",
        {
            "eyebrow": None,
            "headline": "Ministry Structure",
            "subheadline": (
                "Servant leadership, accountability, and how authority and care flow "
                "through theWalk."
            ),
            "image": orgchart_image,
            "image_alt": (
                "Organizational chart: Jesus as foundation, mission and vision, core "
                "team, visionary, senior counsel, public ministry, and ecclesia "
                "connected by red lines."
            ),
        },
    )
    replace_children(
        "section_principles_panel",
        hero,
        "section_principles_panel_items",
        [
            {
                "title": "Servant management",
                "body": (
                    "Groups / layers serve the area(s) directly above them. Groups "
                    "support those who depend upon them; authority flows up. "
                    "Authoritative priority will be higher at lower levels of the "
                    "structure and will proceed up from the bottom tier. By this, we "
                    "acknowledge and emphasize the servant leadership paradigm which "
                    "Jesus taught. In this system of governance, Jesus is the "
                    "foundation."
                ),
                "scripture_refs": "Matthew 23:11, 1 Corinthians 3:11",
            },
            {
                "title": "Discipleship | Fellowship",
                "body": (
                    "Groups are accountable for every layer beside them. With this, "
                    "we utilize the Jewish discipleship and study practice of Jesus' "
                    "day, where persons were encouraged to grow together in small "
                    "intimate groups or 'haverim'."
                ),
                "scripture_refs": "Luke 10:1",
            },
            {
                "title": "Focus",
                "body": (
                    "Decisions made from those at lower levels of the structure will "
                    "be focused at providing benefit to those who reside at the top "
                    "tiers of the structure, so that beneficial priority for "
                    "decisions made will proceed down from the top. By this we "
                    "emphasize Jesus' evangelistic focus where the physician comes "
                    "to the sick and not those who are well."
                ),
                "scripture_refs": "Mark 2:17",
            },
        ],
    )

    system = upsert_section(
        "section_doctrine_block",
        "Ministry Structure — System details",
        {
            "eyebrow": None,
            "headline": "System details",
            "subheadline": None,
            "body": None,
            "scripture_refs": None,
            "variant": "muted-panel",
        },
    )
    replace_children(
        "section_doctrine_block",
        system,
        "section_doctrine_block_items",
        [
            {
                "title": "Unity",
                "body": (
                    "Critical to the system's success is the requirement to see "
                    "everyone as a part of God's image; at all levels it must be "
                    "observed that the image of God the Father is embedded within "
                    "all. We must take this into consideration and regularly obtain "
                    "input from all levels of the system, especially the top and "
                    "bottom layers. To signify this commonality between the "
                    "components of the body, the red line from the layer of Jesus "
                    "Christ our redeemer reaches all persons in the system, in which "
                    "the Spirit of God dwells."
                ),
                "scripture_refs": "1 Corinthians 12:4–13",
            },
            {
                "title": "Foundation (Jesus)",
                "body": (
                    "Jesus (the Word of God) is the foundation upon which the "
                    "ministry is to be built. He is to have ultimate authority of "
                    "this, His Body, and from where He resides His authority and "
                    "nature flow to the entire body through the Holy Spirit on which "
                    "we are all dependent. As with any foundation or cornerstone, "
                    "the weight and the stability of the entire structure rely upon "
                    "Him."
                ),
                "scripture_refs": "1 Corinthians 3:11, Matthew 7:24–27",
            },
            {
                "title": "Mission and vision",
                "body": (
                    "The mission and vision given by Christ are to govern the "
                    "activities and focus of the ministry. The main activity of the "
                    "visionary is to ensure that the mission and vision are "
                    "accomplished and that they stay true to what was originally "
                    "given. The ability to fulfil the task given is heavily based "
                    "upon these two elements; this power is often referred to as the "
                    "anointing of a ministry, and is based entirely on the purpose "
                    "of the ministry."
                ),
                "scripture_refs": None,
            },
            {
                "title": "The working layer / core team",
                "body": (
                    "The working layer, comprised of the core team, the visionary "
                    "team, and the senior counsel, will focus on fulfilling the "
                    "criteria for the mission and vision of the ministry. The core "
                    "team will focus on the mission, the senior counsel will focus "
                    "on the vision, and the visionary team will facilitate them "
                    "while focusing on oversight and balance."
                ),
                "scripture_refs": None,
            },
        ],
    )

    upsert_page(
        "ministry-structure",
        {
            "title": "Ministry Structure",
            "seo_title": "Ministry Structure | theWalk Ministries",
            "seo_description": (
                "How theWalk organizes servant leadership, discipleship, and "
                "governance—from Christ as foundation through mission, vision, and "
                "core teams."
            ),
        },
        [
            {"collection": "section_principles_panel", "item": hero},
            {"collection": "section_doctrine_block", "item": system},
        ],
    )
    print("  ✓ ministry-structure seeded")


# ─── main ────────────────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")

    print("→ schema: section_doctrine_block")
    build_section_doctrine_block()
    print("→ schema: section_principles_panel")
    build_section_principles_panel()

    print("→ M2A: grow allowed_collections")
    grow_pages_sections_m2a()

    print("→ permissions: public read")
    ensure_public_read([
        "section_doctrine_block",
        "section_doctrine_block_items",
        "section_principles_panel",
        "section_principles_panel_items",
    ])

    folder_id = get_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading ministry structure assets…")
    orgchart = upload_local_file(
        REPO / "public/assets/servant-leadership-structure-2.png",
        folder_id,
        "Ministry Structure org chart",
    )
    print(f"  org chart: {orgchart}")

    seed_beliefs()
    seed_ministry_structure(orgchart)

    print("✓ Wave 3 seed complete")


if __name__ == "__main__":
    main()
