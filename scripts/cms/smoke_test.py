#!/usr/bin/env python3
"""
Smoke test: create a demo page+hero, fetch it through the exact field list the
Next.js layer uses, delete it. Verifies the M2A round-trip works.

    DIRECTUS_TOKEN=... python3 scripts/cms/smoke_test.py
"""
from __future__ import annotations

import os
import sys
import json
import requests

BASE = os.environ.get("DIRECTUS_URL", "https://cms.thewalk.org").rstrip("/")
TOKEN = os.environ["DIRECTUS_TOKEN"]
H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
SLUG = "__smoke_test__"


SECTION_COLLECTIONS = [
    "section_hero","section_rich_text","section_feature_cards","section_image_split",
    "section_stats","section_ministry_tabs","section_cta_banner","section_timeline",
    "section_faq","section_testimonials","section_gallery","section_logo_strip",
]

NESTED_ITEM_EXPANSIONS = {
    "section_feature_cards": ["items.*", "items.icon.id"],
    "section_ministry_tabs": ["tabs.*", "tabs.image.id"],
    "section_timeline": ["items.*", "items.image.id"],
    "section_testimonials": ["items.*", "items.image.id"],
    "section_gallery": ["items.*", "items.image.id"],
    "section_logo_strip": ["items.*", "items.logo.id"],
}

SECTION_FILE_EXPANSIONS = {
    "section_hero": ["image.id"],
    "section_image_split": ["image.id"],
    "section_cta_banner": ["background_image.id"],
}


def build_fields() -> list[str]:
    fields = ["*", "seo_image.id", "sections.id", "sections.sort", "sections.collection"]
    for coll in SECTION_COLLECTIONS:
        fields.append(f"sections.item:{coll}.*")
        for extra in SECTION_FILE_EXPANSIONS.get(coll, []):
            fields.append(f"sections.item:{coll}.{extra}")
        for extra in NESTED_ITEM_EXPANSIONS.get(coll, []):
            fields.append(f"sections.item:{coll}.{extra}")
    return fields


def post(path: str, body: dict):
    r = requests.post(f"{BASE}{path}", headers=H, json=body)
    if not r.ok:
        print(f"FAIL POST {path}: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)
    return r.json()["data"] if r.text else None


def delete_test():
    r = requests.get(f"{BASE}/items/pages?filter[slug][_eq]={SLUG}&fields=id", headers=H)
    rows = r.json().get("data", []) if r.ok else []
    for row in rows:
        requests.delete(f"{BASE}/items/pages/{row['id']}", headers=H)


PIXEL_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00"
    b"\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfeA\xfd\x02\xa7"
    b"\x00\x00\x00\x00IEND\xaeB`\x82"
)


def upload_test_file() -> str:
    files = {"file": ("smoke.png", PIXEL_PNG, "image/png")}
    r = requests.post(
        f"{BASE}/files",
        headers={"Authorization": H["Authorization"]},
        files=files,
    )
    if not r.ok:
        print(f"FAIL upload: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)
    return r.json()["data"]["id"]


def main() -> None:
    delete_test()
    print("→ uploading 1x1 test file…")
    file_id = upload_test_file()
    print("  file id:", file_id)
    print("→ creating hero section…")
    hero = post("/items/section_hero", {
        "status": "published",
        "title_internal": "Smoke Hero",
        "eyebrow": "theWalk",
        "headline": "Smoke test headline",
        "subheadline": "If you can read this, the M2A round-trip works.",
        "image": file_id,
        "image_alt": "1x1 test pixel",
        "image_position": "right",
        "cta_primary_label": "Learn more",
        "cta_primary_url": "/about",
    })
    print("  hero id:", hero["id"])

    print("→ creating test page…")
    page = post("/items/pages", {
        "status": "published",
        "slug": SLUG,
        "title": "Smoke Test Page",
        "sections": [
            {
                "collection": "section_hero",
                "item": {"id": hero["id"]},
                "sort": 0,
            }
        ],
    })
    print("  page id:", page["id"])

    print("→ fetching with Next.js-layer field list…")
    fields = build_fields()
    r = requests.get(
        f"{BASE}/items/pages",
        headers=H,
        params={"filter[slug][_eq]": SLUG, "fields": ",".join(fields), "limit": 1},
    )
    if not r.ok:
        print("FAIL GET:", r.status_code, r.text, file=sys.stderr)
        sys.exit(1)
    data = r.json()["data"]
    if not data:
        print("FAIL: page not returned", file=sys.stderr)
        sys.exit(1)
    row = data[0]
    assert row["slug"] == SLUG
    sections = row.get("sections") or []
    assert len(sections) == 1, f"expected 1 section, got {len(sections)}"
    s0 = sections[0]
    assert s0["collection"] == "section_hero", f"got {s0['collection']}"
    assert s0["item"]["headline"] == "Smoke test headline"
    print("  ✓ round-trip OK. collection:", s0["collection"], "| sort:", s0["sort"], "| headline:", s0["item"]["headline"])

    print("→ cleanup…")
    delete_test()
    requests.delete(f"{BASE}/items/section_hero/{hero['id']}", headers=H)
    requests.delete(f"{BASE}/files/{file_id}", headers=H)
    print("✓ smoke test PASSED")


if __name__ == "__main__":
    main()
