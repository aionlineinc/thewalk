#!/usr/bin/env python3
"""
Wave 1 seed: home + sign-in + register-group.

Creates a `Public` folder in Directus (if missing), uploads the hero images
the site currently serves locally, and creates one `pages` row per page with
section instances that mirror what's already rendered. Idempotent: re-runs
will reuse existing files (matched by filename) and pages (matched by slug).

    DIRECTUS_TOKEN=... python3 scripts/cms/seed_wave1.py
"""
from __future__ import annotations

import os
import sys
import time
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


# ─── Folders ─────────────────────────────────────────────────────────────────


def ensure_public_folder() -> str:
    r = requests.get(
        f"{BASE}/folders",
        headers=H,
        params={"filter[name][_eq]": PUBLIC_FOLDER_NAME, "limit": 1, "fields": "id,name"},
    )
    if r.ok and r.json().get("data"):
        folder_id = r.json()["data"][0]["id"]
    else:
        r = requests.post(
            f"{BASE}/folders",
            headers=H,
            json={"name": PUBLIC_FOLDER_NAME, "parent": None},
        )
        if not r.ok:
            fail(f"create Public folder: {r.status_code} {r.text}")
        folder_id = r.json()["data"]["id"]
    ensure_public_files_permission(folder_id)
    return folder_id


def ensure_public_files_permission(folder_id: str) -> None:
    """Grant the Public policy read access to files in the Public folder."""
    pol = requests.get(
        f"{BASE}/policies",
        headers=H,
        params={"limit": -1, "fields": "id,name"},
    )
    policies = pol.json().get("data", []) if pol.ok else []
    public = next((p for p in policies if "public" in (p.get("name") or "").lower()), None)
    if not public:
        print("WARN: could not locate Public policy; skipping files permission")
        return
    policy_id = public["id"]
    existing = requests.get(
        f"{BASE}/permissions",
        headers=H,
        params={
            "filter[policy][_eq]": policy_id,
            "filter[collection][_eq]": "directus_files",
            "filter[action][_eq]": "read",
            "limit": 1,
            "fields": "id,permissions",
        },
    ).json().get("data", [])
    payload = {
        "policy": policy_id,
        "collection": "directus_files",
        "action": "read",
        "permissions": {"folder": {"_eq": folder_id}},
        "validation": {},
        "fields": [
            "id",
            "filename_disk",
            "filename_download",
            "title",
            "type",
            "width",
            "height",
            "folder",
            "description",
            "storage",
        ],
    }
    if existing:
        requests.patch(f"{BASE}/permissions/{existing[0]['id']}", headers=H, json=payload)
        print("  ✓ public files permission updated")
    else:
        r = requests.post(f"{BASE}/permissions", headers=H, json=payload)
        if not r.ok:
            print(f"WARN: could not create files permission: {r.status_code} {r.text}")
        else:
            print("  + public files permission created")


# ─── Files ───────────────────────────────────────────────────────────────────


def find_file_by_name(name: str) -> str | None:
    r = requests.get(
        f"{BASE}/files",
        headers=H,
        params={
            "filter[filename_download][_eq]": name,
            "limit": 1,
            "fields": "id,filename_download",
        },
    )
    if r.ok and r.json().get("data"):
        return r.json()["data"][0]["id"]
    return None


def upload_local_file(path: Path, folder_id: str, title: str) -> str:
    existing = find_file_by_name(path.name)
    if existing:
        # Make sure it's in the Public folder
        requests.patch(f"{BASE}/files/{existing}", headers=H, json={"folder": folder_id, "title": title})
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


def import_url(url: str, folder_id: str, suggested_name: str, title: str) -> str:
    existing = find_file_by_name(suggested_name)
    if existing:
        requests.patch(f"{BASE}/files/{existing}", headers=H, json={"folder": folder_id, "title": title})
        return existing
    r = requests.post(
        f"{BASE}/files/import",
        headers=H,
        json={
            "url": url,
            "data": {"folder": folder_id, "filename_download": suggested_name, "title": title},
        },
    )
    if not r.ok:
        fail(f"import {url}: {r.status_code} {r.text}")
    return r.json()["data"]["id"]


# ─── Items ───────────────────────────────────────────────────────────────────


def find_one(collection: str, filt: dict[str, str]) -> dict | None:
    params = {"limit": 1, "fields": "*"}
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


def upsert_page(slug: str, payload: dict, sections: list[dict]) -> str:
    """Create or update a page, replacing its sections with the provided list.

    `sections` is a list of {"collection": "section_*", "item": "<id>"} entries
    in render order. We pass them as the M2A field directly; Directus replaces
    the junction rows on update.
    """
    page_payload = {**payload, "slug": slug, "status": "published"}
    page_payload["sections"] = [
        {"collection": s["collection"], "item": {"id": s["item"]}, "sort": i}
        for i, s in enumerate(sections)
    ]
    existing = find_one("pages", {"slug": slug})
    if existing:
        # Clear old junction rows first so we don't duplicate
        old = requests.get(
            f"{BASE}/items/pages_sections",
            headers=H,
            params={"filter[pages_id][_eq]": existing["id"], "fields": "id", "limit": -1},
        ).json().get("data", [])
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


# ─── Wave 1 content ──────────────────────────────────────────────────────────


def main() -> None:
    print(f"→ Directus: {BASE}")
    folder_id = ensure_public_folder()
    print(f"  Public folder: {folder_id}")

    print("→ uploading hero assets…")
    hero_home = upload_local_file(
        REPO / "public/assets/hero/hero-bokeh-forest.png",
        folder_id,
        "Home hero — forest bokeh",
    )
    print(f"  home hero: {hero_home}")

    bg_auth = import_url(
        "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
        folder_id,
        "auth-background-mountains.jpg",
        "Auth background — mountain pass",
    )
    print(f"  auth bg: {bg_auth}")

    # ── HOME ────────────────────────────────────────────────────────────────
    print("→ HOME sections…")
    home_hero = upsert_section(
        "section_hero",
        "Home — main hero",
        {
            "eyebrow": None,
            "headline": "Walk in Faith.\nGrow in Purpose.",
            "subheadline": "A Christ-centered journey of transformation, discipleship, and community.",
            "image": hero_home,
            "image_alt": "",
            "image_position": "background",
            "cta_primary_label": "Explore the Journey",
            "cta_primary_url": "/journey",
            "cta_secondary_label": "Get Involved",
            "cta_secondary_url": "/get-involved",
        },
    )
    home_intro = upsert_section(
        "section_rich_text",
        "Home — what is theWalk",
        {
            "eyebrow": None,
            "headline": "What is theWalk?",
            "body": (
                "TheWalk Ministries is a Christian organisation dedicated to enriching the spiritual "
                "journeys of believers in Christ Jesus. Through discipleship, fellowship, and intentional "
                "development, the ministry seeks to create lasting impact in individuals, communities, "
                "and the wider Body of Christ."
            ),
            "alignment": "center",
        },
    )
    home_final = upsert_section(
        "section_cta_banner",
        "Home — final CTA",
        {
            "eyebrow": None,
            "headline": "Start Your Journey Today",
            "body": "Take the next step into growth, healing, truth, and connection.",
            "cta_label": "Explore the Journey",
            "cta_url": "/journey",
            "background_image": None,
            "background_alt": None,
            "variant": "light",
        },
    )
    upsert_page(
        "home",
        {"title": "Home", "seo_title": "theWalk — Walk in Faith. Grow in Purpose.", "seo_description": "A Christ-centered journey of transformation, discipleship, and community."},
        [
            {"collection": "section_hero", "item": home_hero},
            {"collection": "section_rich_text", "item": home_intro},
            {"collection": "section_cta_banner", "item": home_final},
        ],
    )
    print("  ✓ home seeded")

    # ── SIGN IN ─────────────────────────────────────────────────────────────
    print("→ SIGN-IN sections…")
    signin_bg = upsert_section(
        "section_hero",
        "Sign in — background",
        {
            "eyebrow": None,
            "headline": "Welcome back",
            "subheadline": None,
            "image": bg_auth,
            "image_alt": "",
            "image_position": "background",
            "cta_primary_label": None,
            "cta_primary_url": None,
            "cta_secondary_label": None,
            "cta_secondary_url": None,
        },
    )
    upsert_page(
        "sign-in",
        {"title": "Sign in", "seo_title": "Sign in | theWalk", "seo_description": "Sign in to continue your journey."},
        [{"collection": "section_hero", "item": signin_bg}],
    )
    print("  ✓ sign-in seeded")

    # ── REGISTER GROUP ──────────────────────────────────────────────────────
    print("→ REGISTER-GROUP sections…")
    register_bg = upsert_section(
        "section_hero",
        "Register group — background",
        {
            "eyebrow": None,
            "headline": "Register a group",
            "subheadline": None,
            "image": bg_auth,
            "image_alt": "",
            "image_position": "background",
            "cta_primary_label": None,
            "cta_primary_url": None,
            "cta_secondary_label": None,
            "cta_secondary_url": None,
        },
    )
    upsert_page(
        "register-group",
        {"title": "Register a group", "seo_title": "Register a group | theWalk", "seo_description": "Request onboarding for your ministry or organization."},
        [{"collection": "section_hero", "item": register_bg}],
    )
    print("  ✓ register-group seeded")

    print("✓ Wave 1 seed complete")


if __name__ == "__main__":
    main()
