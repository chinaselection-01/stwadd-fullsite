#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 (part 1): product-page internal-linking + meta description.
- For every real-catalog product page (from all-products.json, file on disk):
  (a) crumb middle link ./2026-catalog.html -> /{category}.html  (product -> Hub internal link)
  (b) boilerplate meta description (with &amp;amp; double-encode bug) -> unique per-product description
- Reuses CATEGORIES from build_category_hubs.py for consistent categorization.
- Idempotent / re-runnable: reads source of truth (json) each time.
"""
import json, os, re, html
import build_category_hubs as bh

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL = json.load(open(os.path.join(ROOT, "all-products.json"), encoding="utf-8"))

# category slug for a product name (first match wins; sensible fallback)
def cat_for(name):
    nl = (name or "").lower()
    for c in bh.CATEGORIES:
        if any(k in nl for k in c["kw"]):
            return c["slug"]
    if "bottle" in nl:   return "insulated-bottles"
    if "mug" in nl or "cup" in nl: return "cups"
    if "flask" in nl:    return "flasks"
    if "lunch" in nl or "cooler" in nl: return "lunch-boxes"
    return "insulated-bottles"

SLUG_NAME = {c["slug"]: c["name"] for c in bh.CATEGORIES}

# url (lstrip /) -> (slug, product name)
url_map = {}
for p in ALL:
    u = p.get("url", "").lstrip("/")
    if u:
        url_map[u] = (cat_for(p.get("name", "")), p.get("name", ""))

RE_CRUMB = re.compile(r'href="\./2026-catalog\.html"')          # only the crumb uses ./
RE_CRUMB_ABS = re.compile(r'<a href="/2026-catalog\.html">2026 Catalog</a>')  # products/ subdir crumb
RE_LD_CRUMB = re.compile(r'"item":\s*"https://www\.stwadd\.com/2026-catalog\.html"')  # JSON-LD breadcrumb
RE_META  = re.compile(r'<meta name="description" content="[^"]*"[^>]*>', re.S)

n_crumb = n_meta = 0
for fn, (slug, pname) in url_map.items():
    path = os.path.join(ROOT, fn)
    if not os.path.exists(path):
        continue
    t = open(path, encoding="utf-8").read()
    new = t
    # (a) crumb -> Hub (root pages use ./ , products/ subdir uses absolute / )
    if RE_CRUMB.search(new):
        new = RE_CRUMB.sub(f'href="/{slug}.html"', new, count=1)
        n_crumb += 1
    if RE_CRUMB_ABS.search(new):
        new = RE_CRUMB_ABS.sub(f'<a href="/{slug}.html">2026 Catalog</a>', new, count=1)
        n_crumb += 1
    if RE_LD_CRUMB.search(new):
        new = RE_LD_CRUMB.sub(f'"item": "https://www.stwadd.com/{slug}.html"', new, count=1)
    # (b) meta description
    if RE_META.search(new):
        clean = html.unescape(pname)            # json names may be pre-encoded (Flasks &amp; Thermoses)
        short = clean if len(clean) <= 66 else clean[:63] + "..."
        catname = SLUG_NAME[slug]
        desc = (f"Shop {short} — wholesale {catname} from STWADD, a China OEM/ODM "
                f"drinkware factory. Custom logo, low MOQ, food-grade and certified. Request a quote.")
        desc_e = html.escape(desc, quote=True)
        new_meta = f'<meta name="description" content="{desc_e}">'
        new = RE_META.sub(new_meta, new, count=1)
        n_meta += 1
    if new != t:
        open(path, "w", encoding="utf-8").write(new)

print(f"catalog pages in json (on disk): {len(url_map)}")
print(f"  crumb upgraded -> Hub : {n_crumb}")
print(f"  meta replaced        : {n_meta}")
print("done.")
