#!/usr/bin/env python3
"""
Create/update the Directus Flow that pings `/api/revalidate` whenever any
CMS content collection changes.

    REVALIDATION_URL=https://v2.thewalk.org/api/revalidate \\
    REVALIDATION_SECRET=... \\
    DIRECTUS_TOKEN=... \\
    python3 scripts/cms/setup_revalidation_flow.py

The Flow listens for action events on the full CMS surface and fans them out
to the webhook with a JSON body of `{collection, keys, event}` so Next.js can
revalidate selectively.
"""
from __future__ import annotations

import os
import sys
import json
import requests

BASE = os.environ.get("DIRECTUS_URL", "https://cms.thewalk.org").rstrip("/")
TOKEN = os.environ["DIRECTUS_TOKEN"]
URL = os.environ.get("REVALIDATION_URL", "https://v2.thewalk.org/api/revalidate")
SECRET = os.environ["REVALIDATION_SECRET"]

H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
FLOW_NAME = "Revalidate Next.js on content change"

TRACKED_COLLECTIONS = [
    "pages",
    "site_settings",
    "pages_sections",
    "section_hero",
    "section_rich_text",
    "section_feature_cards",
    "section_feature_cards_items",
    "section_image_split",
    "section_stats",
    "section_ministry_tabs",
    "section_ministry_tabs_tabs",
    "section_cta_banner",
    "section_timeline",
    "section_timeline_items",
    "section_faq",
    "section_testimonials",
    "section_testimonials_items",
    "section_gallery",
    "section_gallery_items",
    "section_logo_strip",
    "section_logo_strip_items",
    "articles",
    "courses",
]

TRIGGER_SCOPE = [
    "items.create",
    "items.update",
    "items.delete",
]


def find_flow_id() -> str | None:
    r = requests.get(f"{BASE}/flows?filter[name][_eq]={requests.utils.quote(FLOW_NAME)}&limit=1&fields=id", headers=H)
    if not r.ok:
        return None
    data = r.json().get("data", [])
    return data[0]["id"] if data else None


def upsert_flow() -> str:
    existing = find_flow_id()
    payload = {
        "name": FLOW_NAME,
        "icon": "autorenew",
        "color": "#AA0303",
        "description": "Posts to the Next.js /api/revalidate endpoint whenever any CMS content changes.",
        "status": "active",
        "trigger": "event",
        "accountability": "all",
        "options": {
            "type": "action",
            "scope": TRIGGER_SCOPE,
            "collections": TRACKED_COLLECTIONS,
        },
    }
    if existing:
        r = requests.patch(f"{BASE}/flows/{existing}", headers=H, json=payload)
    else:
        r = requests.post(f"{BASE}/flows", headers=H, json=payload)
    if not r.ok:
        print("FAIL flow:", r.status_code, r.text, file=sys.stderr)
        sys.exit(1)
    flow_id = (r.json().get("data") or {}).get("id") or existing
    print("flow id:", flow_id)
    return flow_id


def find_operation(flow_id: str, key: str) -> str | None:
    r = requests.get(
        f"{BASE}/operations?filter[flow][_eq]={flow_id}&filter[key][_eq]={key}&limit=1&fields=id",
        headers=H,
    )
    if not r.ok:
        return None
    data = r.json().get("data", [])
    return data[0]["id"] if data else None


def upsert_operation(flow_id: str) -> str:
    key = "post_revalidate"
    body_tmpl = json.dumps(
        {
            "collection": "{{ $trigger.collection }}",
            "keys": "{{ $trigger.keys }}",
            "event": "{{ $trigger.event }}",
        }
    )
    payload = {
        "flow": flow_id,
        "name": "POST /api/revalidate",
        "key": key,
        "type": "request",
        "position_x": 19,
        "position_y": 1,
        "options": {
            "method": "POST",
            "url": URL,
            "headers": [
                {"header": "x-revalidate-secret", "value": SECRET},
                {"header": "Content-Type", "value": "application/json"},
            ],
            "body": body_tmpl,
        },
    }
    existing = find_operation(flow_id, key)
    if existing:
        r = requests.patch(f"{BASE}/operations/{existing}", headers=H, json=payload)
    else:
        r = requests.post(f"{BASE}/operations", headers=H, json=payload)
    if not r.ok:
        print("FAIL operation:", r.status_code, r.text, file=sys.stderr)
        sys.exit(1)
    op_id = (r.json().get("data") or {}).get("id") or existing
    print("operation id:", op_id)
    return op_id


def attach_operation(flow_id: str, op_id: str) -> None:
    r = requests.patch(f"{BASE}/flows/{flow_id}", headers=H, json={"operation": op_id})
    if not r.ok:
        print("FAIL attach operation:", r.status_code, r.text, file=sys.stderr)
        sys.exit(1)


def main() -> None:
    print(f"→ target URL: {URL}")
    flow_id = upsert_flow()
    op_id = upsert_operation(flow_id)
    attach_operation(flow_id, op_id)
    print("✓ revalidation Flow ready")


if __name__ == "__main__":
    main()
