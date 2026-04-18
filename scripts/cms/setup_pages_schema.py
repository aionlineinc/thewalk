#!/usr/bin/env python3
"""
Directus schema setup for the theWalk site CMS.

Creates:
  - pages             (parent collection, status-driven, with M2A `sections`)
  - site_settings     (singleton for nav/footer/SEO defaults)
  - 12 section_*      (typed section layouts)
  - 6  *_items        (child collections for sections with nested files)

Idempotent: re-runs are safe. Each step checks if the target exists before
creating. Drops/renames are NOT performed.

Usage:
    DIRECTUS_URL=https://cms.thewalk.org \\
    DIRECTUS_TOKEN=... \\
    python3 scripts/cms/setup_pages_schema.py
"""
from __future__ import annotations

import json
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


# ─── helpers ──────────────────────────────────────────────────────────────────

def _ok(res: requests.Response, ctx: str) -> dict[str, Any] | None:
    if res.status_code in (200, 204):
        if res.status_code == 204 or not res.text:
            return None
        return res.json()
    # 400 with "already exists" messages are non-fatal
    body = res.text
    if res.status_code in (400, 403) and (
        "already exists" in body.lower()
        or "duplicate" in body.lower()
        or "exists" in body.lower()
    ):
        print(f"  · {ctx}: already present")
        return None
    print(f"FAIL {ctx}: {res.status_code} {body[:400]}", file=sys.stderr)
    sys.exit(1)


def get(path: str) -> requests.Response:
    return S.get(f"{BASE}{path}")


def post(path: str, body: dict, ctx: str) -> dict[str, Any] | None:
    return _ok(S.post(f"{BASE}{path}", json=body), ctx)


def patch(path: str, body: dict, ctx: str) -> dict[str, Any] | None:
    return _ok(S.patch(f"{BASE}{path}", json=body), ctx)


def collection_exists(name: str) -> bool:
    return get(f"/collections/{name}").status_code == 200


def field_exists(collection: str, field: str) -> bool:
    return get(f"/fields/{collection}/{field}").status_code == 200


def relation_exists(collection: str, field: str) -> bool:
    r = get(f"/relations/{collection}/{field}")
    return r.status_code == 200


# ─── collection / field builders ──────────────────────────────────────────────

def ensure_collection(
    name: str,
    *,
    note: str,
    singleton: bool = False,
    hidden: bool = False,
    icon: str = "article",
    color: str | None = None,
    group: str | None = None,
    archive_field: str | None = "status",
    archive_value: str = "archived",
    unarchive_value: str = "draft",
    sort_field: str | None = None,
    accountability: str = "all",
) -> None:
    if collection_exists(name):
        print(f"✓ collection exists: {name}")
        return
    meta: dict[str, Any] = {
        "icon": icon,
        "note": note,
        "hidden": hidden,
        "singleton": singleton,
        "accountability": accountability,
        "translations": None,
    }
    if color:
        meta["color"] = color
    if group:
        meta["group"] = group
    if archive_field:
        meta["archive_field"] = archive_field
        meta["archive_value"] = archive_value
        meta["unarchive_value"] = unarchive_value
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
                "meta": {
                    "hidden": True,
                    "readonly": True,
                    "interface": "input",
                    "special": ["uuid"],
                },
                "schema": {"is_primary_key": True, "length": 36, "has_auto_increment": False},
            },
        ],
    }
    post("/collections", body, f"create collection {name}")
    print(f"+ created collection: {name}")


STATUS_CHOICES = [
    {"text": "Published", "value": "published", "color": "#2ECD6F"},
    {"text": "Draft", "value": "draft", "color": "#D3DAE4"},
    {"text": "Archived", "value": "archived", "color": "#A2B5CD"},
]


def add_status_field(collection: str) -> None:
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
                "display_options": {
                    "showAsDot": True,
                    "choices": STATUS_CHOICES,
                },
            },
            "schema": {"default_value": "draft", "is_nullable": False},
        },
        f"+status on {collection}",
    )


def add_sort_field(collection: str) -> None:
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


def add_title_internal(collection: str, note: str = "Editor-only label to distinguish instances in the builder.") -> None:
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
                "note": note,
                "required": True,
                "special": None,
            },
            "schema": {"is_nullable": False},
        },
        f"+title_internal on {collection}",
    )


def add_string(collection: str, field: str, *, required: bool = False, note: str | None = None, width: str = "full", interface: str = "input", options: dict | None = None, choices: list[str] | None = None, default: str | None = None) -> None:
    if field_exists(collection, field):
        return
    meta: dict[str, Any] = {"width": width, "interface": interface, "note": note, "required": required}
    if options:
        meta["options"] = options
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


def add_text(collection: str, field: str, *, required: bool = False, note: str | None = None, markdown: bool = False) -> None:
    if field_exists(collection, field):
        return
    interface = "input-rich-text-md" if markdown else "input-multiline"
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "text",
            "meta": {
                "width": "full",
                "interface": interface,
                "note": note,
                "required": required,
            },
            "schema": {"is_nullable": not required},
        },
        f"+{field} on {collection}",
    )


def add_boolean(collection: str, field: str, *, note: str | None = None, default: bool = False) -> None:
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


def add_integer(collection: str, field: str, *, default: int | None = None, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    schema: dict[str, Any] = {}
    if default is not None:
        schema["default_value"] = default
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "integer",
            "meta": {"width": "half", "interface": "input", "note": note},
            "schema": schema,
        },
        f"+{field} on {collection}",
    )


def add_file(collection: str, field: str, *, required: bool = False, note: str | None = None) -> None:
    """Adds a File picker field (m2o → directus_files, special=['file'])."""
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
    # Relation
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


def add_json(collection: str, field: str, *, interface: str = "list", template: str | None = None, fields: list[dict] | None = None, note: str | None = None) -> None:
    if field_exists(collection, field):
        return
    options: dict[str, Any] = {}
    if fields:
        options["fields"] = fields
    if template:
        options["template"] = template
    post(
        f"/fields/{collection}",
        {
            "field": field,
            "type": "json",
            "meta": {"width": "full", "interface": interface, "options": options, "special": ["cast-json"], "note": note},
            "schema": {"is_nullable": True},
        },
        f"+{field} on {collection}",
    )


def add_o2m_to(parent: str, field: str, child: str, child_fk: str = None, note: str | None = None, sort_field: str | None = "sort") -> None:
    """Adds an o2m relation: parent.field → child[child_fk]."""
    child_fk = child_fk or f"{parent}_id"
    # 1) FK column on child side must exist (uuid m2o back to parent)
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
    # 2) Relation child.child_fk → parent.id
    if not relation_exists(child, child_fk):
        meta: dict[str, Any] = {"one_field": field}
        if sort_field:
            meta["sort_field"] = sort_field
        post(
            "/relations",
            {
                "collection": child,
                "field": child_fk,
                "related_collection": parent,
                "schema": {"on_delete": "SET NULL"},
                "meta": meta,
            },
            f"relation {child}.{child_fk} → {parent}",
        )
    # 3) o2m alias field on parent
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
                    "note": note,
                },
                "schema": None,
            },
            f"+{field} on {parent}",
        )


# ─── build all collections ────────────────────────────────────────────────────

SECTION_GROUP_COLOR = "#6644FF"
PAGES_GROUP_COLOR = "#AA0303"


def build_pages() -> None:
    ensure_collection(
        "pages",
        note="Editable pages. Each row maps to a route on the site.",
        icon="description",
        color=PAGES_GROUP_COLOR,
        sort_field="sort",
    )
    add_status_field("pages")
    add_sort_field("pages")
    if not field_exists("pages", "slug"):
        post(
            "/fields/pages",
            {
                "field": "slug",
                "type": "string",
                "meta": {
                    "width": "full",
                    "interface": "input",
                    "required": True,
                    "note": "Route key, e.g. `home`, `about`, `journey/cross-over`. Must be unique.",
                    "special": None,
                },
                "schema": {"is_nullable": False, "is_unique": True},
            },
            "+slug on pages",
        )
    add_string("pages", "title", required=True, note="Page display title (used in admin + default H1).")
    add_string("pages", "seo_title", note="Optional: overrides <title>. Falls back to title.")
    add_text("pages", "seo_description", note="Optional meta description.")
    add_file("pages", "seo_image", note="Optional default OG/social card image for this page.")
    add_user_timestamps("pages")


def build_site_settings() -> None:
    ensure_collection(
        "site_settings",
        note="Global site-wide settings: logos, social, defaults.",
        icon="settings",
        color=PAGES_GROUP_COLOR,
        singleton=True,
        archive_field=None,
    )
    add_file("site_settings", "nav_logo", note="Header logo (SVG/PNG).")
    add_string("site_settings", "nav_logo_alt", note="Alt text for header logo.")
    add_file("site_settings", "footer_logo", note="Footer logo.")
    add_string("site_settings", "footer_logo_alt", note="Alt text for footer logo.")
    add_file("site_settings", "default_og_image", note="Default social share image (used when a page has none).")
    add_string("site_settings", "default_seo_title", note="Default <title> fallback.")
    add_text("site_settings", "default_seo_description", note="Default meta description fallback.")
    add_string("site_settings", "social_instagram", interface="input", note="Full URL.")
    add_string("site_settings", "social_facebook", note="Full URL.")
    add_string("site_settings", "social_youtube", note="Full URL.")
    add_string("site_settings", "social_tiktok", note="Full URL.")
    add_string("site_settings", "contact_email", note="Primary contact email.")
    add_string("site_settings", "contact_phone", note="Primary contact phone.")
    add_text("site_settings", "contact_address", note="Address block (markdown ok).")
    add_user_timestamps("site_settings")


# ─── section collections ──────────────────────────────────────────────────────

def _section_base(name: str, *, icon: str, note: str) -> None:
    ensure_collection(name, note=note, icon=icon, color=SECTION_GROUP_COLOR)
    add_status_field(name)
    add_title_internal(name)


def build_section_hero() -> None:
    _section_base("section_hero", icon="title", note="Large hero banner with headline, image, and up to 2 CTAs.")
    add_string("section_hero", "eyebrow", note="Small label above headline.")
    add_string("section_hero", "headline", required=True)
    add_text("section_hero", "subheadline")
    add_file("section_hero", "image", required=True, note="Hero background/feature image.")
    add_string("section_hero", "image_alt", required=True, note="Accessibility alt text.")
    add_string("section_hero", "image_position", choices=["left", "right", "full", "background"], default="right")
    add_string("section_hero", "cta_primary_label")
    add_string("section_hero", "cta_primary_url")
    add_string("section_hero", "cta_secondary_label")
    add_string("section_hero", "cta_secondary_url")
    add_user_timestamps("section_hero")


def build_section_rich_text() -> None:
    _section_base("section_rich_text", icon="article", note="Markdown prose block with optional heading.")
    add_string("section_rich_text", "eyebrow")
    add_string("section_rich_text", "headline")
    add_text("section_rich_text", "body", required=True, markdown=True, note="Markdown supported.")
    add_string("section_rich_text", "alignment", choices=["left", "center"], default="left")
    add_user_timestamps("section_rich_text")


def build_section_feature_cards() -> None:
    _section_base("section_feature_cards", icon="dashboard", note="Grid of feature cards. Use 2/3/4 column layout.")
    add_string("section_feature_cards", "eyebrow")
    add_string("section_feature_cards", "headline")
    add_text("section_feature_cards", "intro")
    add_string("section_feature_cards", "columns", choices=["2", "3", "4"], default="3", note="Number of columns on desktop.")
    add_user_timestamps("section_feature_cards")
    # items
    ensure_collection(
        "section_feature_cards_items",
        note="Child items of section_feature_cards.",
        icon="view_module",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_feature_cards_items")
    add_string("section_feature_cards_items", "title", required=True)
    add_text("section_feature_cards_items", "body")
    add_file("section_feature_cards_items", "icon", note="Optional small icon/image.")
    add_string("section_feature_cards_items", "icon_alt", note="Alt text for the icon.")
    add_string("section_feature_cards_items", "url", note="Optional link URL.")
    add_o2m_to("section_feature_cards", "items", "section_feature_cards_items")


def build_section_image_split() -> None:
    _section_base("section_image_split", icon="view_sidebar", note="Split layout: image on one side, text on the other.")
    add_string("section_image_split", "eyebrow")
    add_string("section_image_split", "headline", required=True)
    add_text("section_image_split", "body", markdown=True)
    add_file("section_image_split", "image", required=True)
    add_string("section_image_split", "image_alt", required=True)
    add_string("section_image_split", "image_side", choices=["left", "right"], default="right")
    add_string("section_image_split", "cta_label")
    add_string("section_image_split", "cta_url")
    add_user_timestamps("section_image_split")


def build_section_stats() -> None:
    _section_base("section_stats", icon="leaderboard", note="Row of numeric/metric highlights.")
    add_string("section_stats", "eyebrow")
    add_string("section_stats", "headline")
    add_json(
        "section_stats",
        "items",
        fields=[
            {"field": "value", "type": "string", "name": "Value", "meta": {"interface": "input", "width": "half", "required": True}},
            {"field": "label", "type": "string", "name": "Label", "meta": {"interface": "input", "width": "half", "required": True}},
        ],
        template="{{value}} — {{label}}",
        note="Each item: value + label (e.g. 12 Groups).",
    )
    add_user_timestamps("section_stats")


def build_section_ministry_tabs() -> None:
    _section_base("section_ministry_tabs", icon="tab", note="Tabbed ministry/program presentation (Cross Over / Roads / Connect style).")
    add_string("section_ministry_tabs", "eyebrow")
    add_string("section_ministry_tabs", "headline")
    add_text("section_ministry_tabs", "intro")
    add_user_timestamps("section_ministry_tabs")
    ensure_collection(
        "section_ministry_tabs_tabs",
        note="Child tabs of section_ministry_tabs.",
        icon="tab_unselected",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_ministry_tabs_tabs")
    add_string("section_ministry_tabs_tabs", "label", required=True, note="Tab label (short).")
    add_string("section_ministry_tabs_tabs", "title", required=True)
    add_text("section_ministry_tabs_tabs", "body", markdown=True)
    add_file("section_ministry_tabs_tabs", "image")
    add_string("section_ministry_tabs_tabs", "image_alt")
    add_string("section_ministry_tabs_tabs", "cta_label")
    add_string("section_ministry_tabs_tabs", "cta_url")
    add_o2m_to("section_ministry_tabs", "tabs", "section_ministry_tabs_tabs")


def build_section_cta_banner() -> None:
    _section_base("section_cta_banner", icon="campaign", note="Full-width call-to-action banner.")
    add_string("section_cta_banner", "eyebrow")
    add_string("section_cta_banner", "headline", required=True)
    add_text("section_cta_banner", "body")
    add_string("section_cta_banner", "cta_label", required=True)
    add_string("section_cta_banner", "cta_url", required=True)
    add_file("section_cta_banner", "background_image", note="Optional background image behind CTA.")
    add_string("section_cta_banner", "background_alt")
    add_string("section_cta_banner", "variant", choices=["light", "dark", "brand"], default="brand")
    add_user_timestamps("section_cta_banner")


def build_section_timeline() -> None:
    _section_base("section_timeline", icon="timeline", note="Chronological timeline of milestones or steps.")
    add_string("section_timeline", "eyebrow")
    add_string("section_timeline", "headline")
    add_text("section_timeline", "intro")
    add_user_timestamps("section_timeline")
    ensure_collection(
        "section_timeline_items",
        note="Child items of section_timeline.",
        icon="flag",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_timeline_items")
    add_string("section_timeline_items", "date_label", required=True, note="Display date (e.g. 'Spring 2024').")
    add_string("section_timeline_items", "title", required=True)
    add_text("section_timeline_items", "body", markdown=True)
    add_file("section_timeline_items", "image")
    add_string("section_timeline_items", "image_alt")
    add_o2m_to("section_timeline", "items", "section_timeline_items")


def build_section_faq() -> None:
    _section_base("section_faq", icon="quiz", note="Accordion of question/answer pairs.")
    add_string("section_faq", "eyebrow")
    add_string("section_faq", "headline")
    add_text("section_faq", "intro")
    add_json(
        "section_faq",
        "items",
        fields=[
            {"field": "question", "type": "string", "name": "Question", "meta": {"interface": "input", "width": "full", "required": True}},
            {"field": "answer", "type": "text", "name": "Answer", "meta": {"interface": "input-rich-text-md", "width": "full", "required": True}},
        ],
        template="{{question}}",
    )
    add_user_timestamps("section_faq")


def build_section_testimonials() -> None:
    _section_base("section_testimonials", icon="format_quote", note="Rotating or grid of testimonials / pull quotes.")
    add_string("section_testimonials", "eyebrow")
    add_string("section_testimonials", "headline")
    add_string("section_testimonials", "layout", choices=["carousel", "grid"], default="grid")
    add_user_timestamps("section_testimonials")
    ensure_collection(
        "section_testimonials_items",
        note="Child items of section_testimonials.",
        icon="person",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_testimonials_items")
    add_text("section_testimonials_items", "quote", required=True)
    add_string("section_testimonials_items", "name", required=True)
    add_string("section_testimonials_items", "role")
    add_file("section_testimonials_items", "image")
    add_string("section_testimonials_items", "image_alt")
    add_o2m_to("section_testimonials", "items", "section_testimonials_items")


def build_section_gallery() -> None:
    _section_base("section_gallery", icon="collections", note="Grid/masonry gallery of images.")
    add_string("section_gallery", "eyebrow")
    add_string("section_gallery", "headline")
    add_string("section_gallery", "layout", choices=["grid-2", "grid-3", "grid-4", "masonry"], default="grid-3")
    add_user_timestamps("section_gallery")
    ensure_collection(
        "section_gallery_items",
        note="Child items of section_gallery.",
        icon="image",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_gallery_items")
    add_file("section_gallery_items", "image", required=True)
    add_string("section_gallery_items", "image_alt", required=True)
    add_string("section_gallery_items", "caption")
    add_o2m_to("section_gallery", "items", "section_gallery_items")


def build_section_doctrine_block() -> None:
    """Doctrine block: long-form theological/structural sections used by
    pages like Beliefs and Ministry Structure. Supports an optional list of
    sub-points (each with its own scripture refs) to model nested structures
    such as the Members section on Beliefs."""
    _section_base("section_doctrine_block", icon="menu_book", note="Headline + body + optional sub-points + scripture refs.")
    add_string("section_doctrine_block", "eyebrow")
    add_string("section_doctrine_block", "headline")
    add_string("section_doctrine_block", "subheadline", note="Small caps line under the headline (e.g. '(GodHead)').")
    add_text("section_doctrine_block", "body", markdown=True, note="Paragraphs separated by blank lines. Inline links use [text](url).")
    add_string("section_doctrine_block", "scripture_refs", note="Comma-separated bible references, rendered with hover tooltips.")
    add_string("section_doctrine_block", "variant", choices=["default", "muted-panel"], default="default", note="'muted-panel' wraps the block in a soft gray rounded panel.")
    add_user_timestamps("section_doctrine_block")
    ensure_collection(
        "section_doctrine_block_items",
        note="Sub-points within a section_doctrine_block.",
        icon="format_list_bulleted",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_doctrine_block_items")
    add_string("section_doctrine_block_items", "title", required=True)
    add_text("section_doctrine_block_items", "body", markdown=True)
    add_string("section_doctrine_block_items", "scripture_refs")
    add_o2m_to("section_doctrine_block", "items", "section_doctrine_block_items")


def build_section_principles_panel() -> None:
    """Image-left + principles-panel-right layout. Used by the Ministry
    Structure hero where a diagram sits next to a stacked panel of named
    principles (each with optional scripture refs)."""
    _section_base("section_principles_panel", icon="schema", note="Image + side panel of named principles. Used for diagram-driven hero sections.")
    add_string("section_principles_panel", "eyebrow")
    add_string("section_principles_panel", "headline", required=True)
    add_text("section_principles_panel", "subheadline", note="Short intro line under the headline (kept as text, not markdown).")
    add_file("section_principles_panel", "image", required=True)
    add_string("section_principles_panel", "image_alt", required=True)
    add_user_timestamps("section_principles_panel")
    ensure_collection(
        "section_principles_panel_items",
        note="Named principles displayed alongside the image.",
        icon="format_list_numbered",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_principles_panel_items")
    add_string("section_principles_panel_items", "title", required=True, note="Short uppercase label, e.g. 'Servant management'.")
    add_text("section_principles_panel_items", "body", markdown=True)
    add_string("section_principles_panel_items", "scripture_refs", note="Optional comma-separated bible references.")
    add_o2m_to("section_principles_panel", "items", "section_principles_panel_items")


def build_section_logo_strip() -> None:
    _section_base("section_logo_strip", icon="business", note="Row of partner/ministry logos.")
    add_string("section_logo_strip", "eyebrow")
    add_string("section_logo_strip", "headline")
    add_user_timestamps("section_logo_strip")
    ensure_collection(
        "section_logo_strip_items",
        note="Child items of section_logo_strip.",
        icon="domain",
        color=SECTION_GROUP_COLOR,
        archive_field=None,
        sort_field="sort",
        hidden=True,
    )
    add_sort_field("section_logo_strip_items")
    add_file("section_logo_strip_items", "logo", required=True)
    add_string("section_logo_strip_items", "alt", required=True)
    add_string("section_logo_strip_items", "url")
    add_o2m_to("section_logo_strip", "items", "section_logo_strip_items")


SECTION_COLLECTIONS = [
    "section_hero",
    "section_rich_text",
    "section_feature_cards",
    "section_image_split",
    "section_stats",
    "section_ministry_tabs",
    "section_cta_banner",
    "section_timeline",
    "section_faq",
    "section_testimonials",
    "section_gallery",
    "section_logo_strip",
    "section_doctrine_block",
    "section_principles_panel",
]


# ─── M2A: pages.sections → any section_* ─────────────────────────────────────

def build_pages_sections_m2a() -> None:
    """Creates the pages_sections junction + M2A field on pages."""
    # 1) Junction collection
    junction = "pages_sections"
    if not collection_exists(junction):
        post(
            "/collections",
            {
                "collection": junction,
                "meta": {
                    "icon": "import_export",
                    "note": "Junction for pages.sections M2A.",
                    "hidden": True,
                    "singleton": False,
                    "accountability": "all",
                    "sort_field": "sort",
                },
                "schema": {"name": junction},
                "fields": [
                    {
                        "field": "id",
                        "type": "integer",
                        "meta": {"hidden": True, "interface": "input"},
                        "schema": {"is_primary_key": True, "has_auto_increment": True},
                    },
                ],
            },
            f"create junction {junction}",
        )
        print(f"+ created junction: {junction}")

    # 2) pages_id m2o
    if not field_exists(junction, "pages_id"):
        post(
            f"/fields/{junction}",
            {
                "field": "pages_id",
                "type": "uuid",
                "meta": {"hidden": True, "interface": "select-dropdown-m2o", "special": ["m2o"]},
                "schema": {"is_nullable": True, "foreign_key_table": "pages"},
            },
            f"+pages_id on {junction}",
        )

    # 3) collection (name of section_*)
    if not field_exists(junction, "collection"):
        post(
            f"/fields/{junction}",
            {
                "field": "collection",
                "type": "string",
                "meta": {"hidden": True, "interface": "input"},
                "schema": {"is_nullable": False},
            },
            f"+collection on {junction}",
        )

    # 4) item (string fk to whichever section collection)
    if not field_exists(junction, "item"):
        post(
            f"/fields/{junction}",
            {
                "field": "item",
                "type": "string",
                "meta": {"hidden": True, "interface": "input"},
                "schema": {"is_nullable": False},
            },
            f"+item on {junction}",
        )

    # 5) sort
    add_sort_field(junction)

    # 6) Relations
    # 6a) pages_sections.pages_id → pages.id  (junction side of M2A; needs one_field + junction_field)
    if not relation_exists(junction, "pages_id"):
        post(
            "/relations",
            {
                "collection": junction,
                "field": "pages_id",
                "related_collection": "pages",
                "schema": {"on_delete": "SET NULL"},
                "meta": {
                    "one_field": "sections",
                    "sort_field": "sort",
                    "one_deselect_action": "nullify",
                    "junction_field": "item",
                },
            },
            "relation pages_sections.pages_id → pages",
        )

    # 6b) pages_sections.item → (M2A — multiple related_collections)
    if not relation_exists(junction, "item"):
        post(
            "/relations",
            {
                "collection": junction,
                "field": "item",
                "related_collection": None,
                "schema": None,
                "meta": {
                    "one_collection_field": "collection",
                    "one_allowed_collections": SECTION_COLLECTIONS,
                    "junction_field": "pages_id",
                    "sort_field": "sort",
                    "one_deselect_action": "nullify",
                },
            },
            "relation pages_sections.item → (M2A)",
        )
    else:
        # Relation exists — make sure the allowed-collections union grew to
        # include any new section_* collections added since first install.
        cur = get(f"/relations/{junction}/item")
        if cur.ok:
            cur_meta = (cur.json().get("data") or {}).get("meta") or {}
            cur_allowed = list(cur_meta.get("one_allowed_collections") or [])
            missing = [c for c in SECTION_COLLECTIONS if c not in cur_allowed]
            if missing:
                merged = cur_allowed + missing
                patch(
                    f"/relations/{junction}/item",
                    {"meta": {"one_allowed_collections": merged}},
                    f"merge M2A allowed_collections (+{len(missing)})",
                )
                print(f"  · M2A allowed_collections grew by: {missing}")

    # 7) alias field `sections` on pages (with m2a interface)
    if not field_exists("pages", "sections"):
        post(
            "/fields/pages",
            {
                "field": "sections",
                "type": "alias",
                "meta": {
                    "width": "full",
                    "interface": "list-m2a",
                    "special": ["m2a"],
                    "options": {"enableCreate": True, "enableSelect": True},
                    "note": "Content sections. Drag to reorder. Each block has its own editor.",
                },
                "schema": None,
            },
            "+sections on pages (m2a alias)",
        )


# ─── public read permissions (role=null, access=none → public policy) ────────

PUBLIC_COLLECTIONS = [
    "pages",
    "site_settings",
    "pages_sections",
    *SECTION_COLLECTIONS,
    "section_feature_cards_items",
    "section_ministry_tabs_tabs",
    "section_timeline_items",
    "section_testimonials_items",
    "section_gallery_items",
    "section_logo_strip_items",
    "section_doctrine_block_items",
    "section_principles_panel_items",
]


def build_public_permissions() -> None:
    """Ensure the Public policy (role=null) has read access to content collections.

    Pages/sections need `status == "published"` filter; items/junctions are read fully
    (they're only reachable through a published page's sections).
    """
    # Find the Public policy
    pr = get("/policies?filter[name][_eq]=$t:public_label&limit=1")
    # Directus 11 ships a Public policy with name "$t:public_label". But some instances
    # have a custom name. Fall back to matching "public" case-insensitive.
    data = pr.json().get("data", []) if pr.ok else []
    if not data:
        pr = get("/policies?limit=-1&fields=id,name")
        policies = pr.json().get("data", []) if pr.ok else []
        data = [p for p in policies if "public" in (p.get("name") or "").lower()]
    if not data:
        print("WARN: could not locate Public policy; skipping permissions.")
        return
    policy_id = data[0]["id"]
    print(f"  public policy id: {policy_id}")

    # List existing perms for this policy
    ex = get(f"/permissions?filter[policy][_eq]={policy_id}&limit=-1&fields=id,collection,action").json().get("data", [])
    existing = {(p["collection"], p["action"]) for p in ex}

    for coll in PUBLIC_COLLECTIONS:
        key = (coll, "read")
        if key in existing:
            print(f"✓ public read perm exists: {coll}")
            continue
        body = {
            "policy": policy_id,
            "collection": coll,
            "action": "read",
            "permissions": {},
            "validation": {},
            "fields": ["*"],
        }
        # For top-level status-driven collections, restrict to published
        if coll == "pages" or coll.startswith("section_") and not coll.endswith("_items") and not coll.endswith("_tabs"):
            body["permissions"] = {"status": {"_eq": "published"}}
        post("/permissions", body, f"+public read on {coll}")


# ─── main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    print(f"→ Directus: {BASE}")
    print("→ phase 1: site_settings + pages")
    build_site_settings()
    build_pages()
    print("→ phase 2: section collections")
    build_section_hero()
    build_section_rich_text()
    build_section_feature_cards()
    build_section_image_split()
    build_section_stats()
    build_section_ministry_tabs()
    build_section_cta_banner()
    build_section_timeline()
    build_section_faq()
    build_section_testimonials()
    build_section_gallery()
    build_section_logo_strip()
    build_section_doctrine_block()
    build_section_principles_panel()
    print("→ phase 3: pages.sections M2A")
    build_pages_sections_m2a()
    print("→ phase 4: public read permissions")
    build_public_permissions()
    print("✓ done")


if __name__ == "__main__":
    main()
