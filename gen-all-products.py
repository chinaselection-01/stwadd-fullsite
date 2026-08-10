#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build all-products.json: English root product pages + 167 catalog products.
Each entry: {name, image, url} so all-products.html can render a searchable,
image-bearing grid that covers the combined product library.
"""
import os, re, json, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
PRODUCT_IMAGES = os.path.join(ROOT, "product-images")

# ---- 1) English root product pages (rel-card / Product JSON-LD, not blog/guide)
BLOG_PREFIXES = ("a-", "t-")
SKIP = ("index", "index-new", "2026-catalog", "about-us", "contact-us",
        "404", "sitemap", "robots")

def is_product_file(fn):
    base = fn[:-5]  # strip .html
    if base in SKIP:
        return False
    if base.startswith(BLOG_PREFIXES):
        return False
    return True

def extract_root_products():
    items = []
    for fn in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        name = os.path.basename(fn)
        if not is_product_file(name):
            continue
        html = open(fn, encoding="utf-8", errors="ignore").read()
        if '"@type":"Product"' not in html and "rel-card" not in html:
            continue  # not a redone product page
        # name from H1 (cleaner than title)
        m = re.search(r'<h1[^>]*class="h1"[^>]*>(.*?)</h1>', html, re.S)
        if not m:
            m = re.search(r'<title>(.*?)</title>', html, re.S)
        title = re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else base
        # strip brand suffix like " | STWADD ..."
        title = title.split(" | ")[0].strip()
        # first main image (relative images/ path)
        img = ""
        im = re.search(r'src="(images/[A-Za-z0-9_.-]+\.(?:png|jpe?g|webp))"', html)
        if im:
            img = "/" + im.group(1)
        items.append({"name": title, "image": img, "url": "/" + name})
    return items

# ---- 2) 167 catalog products
def extract_catalog_products():
    items = []
    html = open(os.path.join(ROOT, "2026-catalog.html"), encoding="utf-8", errors="ignore").read()
    arr = re.search(r'const products\s*=\s*(\[.*?\]);', html, re.S)
    if not arr:
        return items
    try:
        products = json.loads(arr.group(1))
    except Exception as e:
        print("catalog parse error:", e)
        return items
    for p in products:
        slug = p.get("slug", "")
        if not slug:
            continue
        # find actual image extension
        img = ""
        for ext in ("png", "jpeg", "jpg", "webp"):
            cand = os.path.join(PRODUCT_IMAGES, slug + "." + ext)
            if os.path.exists(cand):
                img = f"/product-images/{slug}.{ext}"
                break
        items.append({"name": p.get("name", ""), "image": img,
                      "url": f"/products/{slug}.html"})
    return items

root_items = extract_root_products()
cat_items = extract_catalog_products()
all_items = root_items + cat_items

out = os.path.join(ROOT, "all-products.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(all_items, f, ensure_ascii=False, indent=0)

print(f"root product pages : {len(root_items)}")
print(f"catalog products   : {len(cat_items)}")
print(f"TOTAL combined     : {len(all_items)}")
print(f"written -> {out}")
