#!/usr/bin/env python3
"""
Wave 2 seed: About page.

What it does (idempotently):
  1. Adds a `reversed` boolean field to `section_rich_text` if missing.
  2. Uploads the About hero graphic and the servant-leadership diagram into
     the Public folder (created in Wave 1 — reused here).
  3. Creates / updates `pages/about` with five sections:
       hero → rich_text (Who We Are) → feature_cards (Vision/Mission)
       → rich_text reversed (A Ministry Built as a Journey)
       → image_split (Servant Leadership Structure callout)

  DIRECTUS_TOKEN=… python3 scripts/cms/seed_wave2.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import requests

BASE = os.environ.get("DIRECTUS_URL", "https://cms.thewalk.org").rstrip("/")
TOKEN = os.environ["DIRECTUS_TOKEN"]
H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
H_NO_CT = {"Authorization": f"Bearer {TOKEN}"}
REPO = Path(__file__).resolve().parents[2]
PUBLIC_FOLDER_NAME = "Public"


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


# ─── helpers (mirror seed_wave1) ─────────────────────────────────────────────


def get_public_folder() -> str:
    r = requests.get(
        f"{BASE}/folders",
        headers=H,
        params={"filter[name][_eq]": PUBLIC_FOLDER_NAME, "limit": 1, "fields": "id"},
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    fail("Public folder missing — run seed_wave1.py first")


def find_file_by_name(name: str) -> str | None:
    r = requests.get(
        f"{BASE}/files",
        headers=H,
        params={"filter[filename_download][_eq]": name, "limit": 1, "fields": "id"},
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    return None


def upload_local_file(path: Path, folder_id: str, title: str) -> str:
    existing = find_file_by_name(path.name)
    if existing:
        requests.patch(
            f"{BASE}/files/{existing}",
            headers=H,
            json={"folder": folder_id, "title": title},
        )
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


def find_one(collection: str, filt: dict[str, str]) -> dict | None:
    params: dict[str, object] = {"limit": 1, "fields": "*"}
    for k, v in filt.items():
        params[f"filter[{k}][_eq]"] = v
    r = requests.get(f"{BASE}/items/{collection}", headers=H, params=params)
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]
    return None


def upsert_section(collection: str, title_internal: str, payload: dict) -> str:
    existing = find_one(collection, {"title_internal": title_internal})
    body = {**payload, "title_internal": title_internal, "status": "published"}
    if existing:
        r = requests.patch(f"{BASE}/items/{collection}/{existing['id']}", headers=H, json=body)
        if not r.ok:
            fail(f"patch {collection}/{existing['id']}: {r.status_code} {r.text}")
        return existing["id"]
    r = requests.post(f"{BASE}/items/{collection}", headers=H, json=body)
    if not r.ok:
        fail(f"create {collection}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


def upsert_feature_card(parent_id: str, sort: int, payload: dict) -> str:
    """Find an existing card by (parent, title) or create a new one."""
    title = payload["title"]
    r = requests.get(
        f"{BASE}/items/section_feature_cards_items",
        headers=H,
        params={
            "filter[section_feature_cards_id][_eq]": parent_id,
            "filter[title][_eq]": title,
            "limit": 1,
            "fields": "id",
        },
    )
    body = {**payload, "section_feature_cards_id": parent_id, "sort": sort}
    if r.ok and r.json().get("data"):
        cid = r.json()["data"][0]["id"]
        rr = requests.patch(f"{BASE}/items/section_feature_cards_items/{cid}", headers=H, json=body)
        if not rr.ok:
            fail(f"patch feature card {cid}: {rr.status_code} {rr.text}")
        return cid
    rr = requests.post(f"{BASE}/items/section_feature_cards_items", headers=H, json=body)
    if not rr.ok:
        fail(f"create feature card: {rr.status_code} {rr.text}")
    return rr.json()["data"]["id"]


def upsert_page(slug: str, payload: dict, sections: list[dict]) -> str:
    page_payload = {**payload, "slug": slug, "status": "published"}
    page_payload["sections"] = [
        {"collection": s["collection"], "item": {"id": s["item"]}, "sort": i}
        for i, s in enumerate(sections)
    ]
    existing = find_one("pages", {"slug": slug})
    if existing:
        old = (
            requests.get(
                f"{BASE}/items/pages_sections",
                headers=H,
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
            requests.delete(f"{BASE}/items/pages_sections/{row['id']}", headers=H)
        r = requests.patch(f"{BASE}/items/pages/{existing['id']}", headers=H, json=page_payload)
        if not r.ok:
            fail(f"patch pages/{slug}: {r.status_code} {r.text}")
        return existing["id"]
    r = requests.post(f"{BASE}/items/pages", headers=H, json=page_payload)
    if not r.ok:
        fail(f"create pages/{slug}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


# ─── schema migration: add `reversed` to section_rich_text ───────────────────


def ensure_rich_text_reversed_field() -> None:
    fields_url = f"{BASE}/fields/section_rich_text"
    r = requests.get(f"{fields_url}/reversed", headers=H)
    if r.status_code == 200:
        print("  ✓ section_rich_text.reversed already exists")
        return
    payload = {
        "field": "reversed",
        "type": "boolean",
        "schema": {"default_value": False, "is_nullable": True},
        "meta": {
            "interface": "boolean",
            "special": ["cast-boolean"],
            "options": {"label": "Reversed editorial layout"},
            "note": "When enabled, render the editorial-split variant with heading on the right.",
            "width": "half",
        },
    }
    r = requests.post(fields_url, headers=H, json=payload)
    if not r.ok:
        fail(f"add section_rich_text.reversed: {r.status_code} {r.text}")
    print("  + section_rich_text.reversed created")


# ─── About content ───────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")
    print("→ ensuring schema…")
    ensure_rich_text_reversed_field()

    folder_id = get_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading about assets…")
    about_hero_img = upload_local_file(
        REPO / "public/assets/617fac9d-80f5-40be-b010-93207da51565-2026-03-29.png",
        folder_id,
        "About hero — servant leadership graphic",
    )
    print(f"  about hero: {about_hero_img}")

    sls_diagram = upload_local_file(
        REPO / "public/assets/servant-leadership-structure.png",
        folder_id,
        "Servant leadership structure diagram",
    )
    print(f"  SLS diagram: {sls_diagram}")

    # ── Sections ───────────────────────────────────────────────────────────
    print("→ ABOUT sections…")
    hero = upsert_section(
        "section_hero",
        "About — main hero",
        {
            "eyebrow": None,
            "headline": "About theWalk",
            "subheadline": (
                "A ministry committed to spiritual growth, discipleship, fellowship, and "
                "transformation—meeting you where you are and walking with you toward "
                "Christ-centered purpose."
            ),
            "image": about_hero_img,
            "image_alt": (
                "Servant leadership structure: pathways from Christ through vision, "
                "mission, and public ministry"
            ),
            "image_position": "right",
            "cta_primary_label": "Explore the Journey",
            "cta_primary_url": "/journey",
            "cta_secondary_label": "Get Involved",
            "cta_secondary_url": "/get-involved",
        },
    )

    who_we_are = upsert_section(
        "section_rich_text",
        "About — Who We Are",
        {
            "eyebrow": None,
            "headline": "Who We Are",
            "body": (
                "TheWalk Ministries is a Christian organisation dedicated to enriching "
                "the spiritual journeys of believers in Christ Jesus. By focusing on "
                "individual development, the ministry seeks to promote lasting positive "
                "impact that resonates throughout communities and beyond."
            ),
            "alignment": "left",
            "reversed": False,
        },
    )

    vision_mission = upsert_section(
        "section_feature_cards",
        "About — Vision & Mission",
        {
            "eyebrow": None,
            "headline": None,
            "intro": None,
            "columns": "2",
        },
    )
    upsert_feature_card(
        vision_mission,
        0,
        {
            "title": "Our Vision",
            "body": (
                "A strengthened and cohesive Body of Christ interconnected across "
                "families, congregations, denominations, nations and cultures."
            ),
            "icon": None,
            "icon_alt": None,
            "url": None,
        },
    )
    upsert_feature_card(
        vision_mission,
        1,
        {
            "title": "Our Mission",
            "body": (
                "Create a kingdom-focused culture through discipleship and fellowship, "
                "which facilitates the manifestation of God’s purposes in all spheres."
            ),
            "icon": None,
            "icon_alt": None,
            "url": None,
        },
    )

    journey_block = upsert_section(
        "section_rich_text",
        "About — A Ministry Built as a Journey",
        {
            "eyebrow": None,
            "headline": "A Ministry Built as a Journey",
            "body": (
                "theWalk is organized around three connected ministry pathways that "
                "guide believers through stages of restoration, identity, discipleship, "
                "community, and impact: Cross Over, Cross Roads, and Cross Connect."
            ),
            "alignment": "left",
            "reversed": True,
        },
    )

    leadership_callout = upsert_section(
        "section_image_split",
        "About — Servant Leadership Structure callout",
        {
            "eyebrow": None,
            "headline": "Servant Leadership Structure",
            "body": (
                "Groups / Layers serve the area(s) directly above them. Groups support "
                "those who depend upon them, authority flows up."
            ),
            "image": sls_diagram,
            "image_alt": "Servant Leadership Structure",
            "image_side": "right",
            "cta_label": "Learn more",
            "cta_url": "/about/ministry-structure",
        },
    )

    upsert_page(
        "about",
        {
            "title": "About",
            "seo_title": "About theWalk Ministries",
            "seo_description": (
                "A Christ-centered ministry committed to discipleship, fellowship, and "
                "spiritual transformation."
            ),
        },
        [
            {"collection": "section_hero", "item": hero},
            {"collection": "section_rich_text", "item": who_we_are},
            {"collection": "section_feature_cards", "item": vision_mission},
            {"collection": "section_rich_text", "item": journey_block},
            {"collection": "section_image_split", "item": leadership_callout},
        ],
    )
    print("  ✓ about seeded")
    print("✓ Wave 2 seed complete")


if __name__ == "__main__":
    main()
