#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Wire static category Hub links into index.html (replace ?q= param links)
and add a static category bar to all-products.html (so the JS page also exposes
crawlable category entry points). Part of P0/P1 remediation."""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))

# homepage ?q= deep-links -> static Hub page
HOMEPAGE_MAP = {
    "/all-products.html?q=stainless%20steel": "/stainless-steel-bottles.html",
    "/all-products.html?q=plastic": "/plastic-bottles.html",
    "/all-products.html?q=glass": "/glass-bottles.html",
    "/all-products.html?q=cup": "/cups.html",
    "/all-products.html?q=flask": "/flasks.html",
    "/all-products.html?q=sport": "/sports-bottles.html",
    "/all-products.html?q=titanium": "/cups.html",
    "/all-products.html?q=insulated%20bottle": "/insulated-bottles.html",
    "/all-products.html?q=tumbler": "/tumblers.html",
    "/all-products.html?q=lunch": "/lunch-boxes.html",
}

HUBS = [
    ("tumblers", "Tumblers"), ("flasks", "Wine Flasks & Growlers"),
    ("insulated-bottles", "Insulated Bottles"), ("stainless-steel-bottles", "Stainless Steel"),
    ("plastic-bottles", "Plastic Bottles"), ("glass-bottles", "Glass Bottles"),
    ("sports-bottles", "Sports Bottles"), ("kids-bottles", "Kids Bottles"),
    ("coffee-mugs", "Coffee Mugs"), ("cups", "Cups"),
    ("lunch-boxes", "Lunch Boxes"),
    ("travel-mugs", "Travel Mugs"),
]

def main():
    # 1) index.html: replace param links
    idx = os.path.join(ROOT, "index.html")
    s = open(idx, encoding="utf-8").read()
    rep = 0
    for old, new in HOMEPAGE_MAP.items():
        n = s.count(old)
        if n:
            s = s.replace(old, new)
            rep += n
    open(idx, "w", encoding="utf-8").write(s)
    print(f"index.html: replaced {rep} ?q= links with static Hub URLs")

    # 2) all-products.html: add static category bar after <div class="wrap">
    ap = os.path.join(ROOT, "all-products.html")
    t = open(ap, encoding="utf-8").read()
    if "static-cat-bar" not in t:
        links = "\n".join(
            f'      <a class="scb-chip" href="/{slug}.html">{name}</a>' for slug, name in HUBS
        )
        bar = (
            '<div class="static-cat-bar" aria-label="Product categories">\n'
            '  <span class="scb-label">Categories:</span>\n' + links + "\n"
            "</div>\n"
            "<style>\n"
            ".static-cat-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;"
            "margin:0 0 22px;padding:14px 16px;background:#fff;border:1px solid #eaeaea;border-radius:12px}\n"
            ".scb-label{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#aaa;margin-right:4px}\n"
            ".scb-chip{padding:7px 14px;border:1px solid #eaeaea;border-radius:999px;font-size:.85rem;background:#fafafa}\n"
            ".scb-chip:hover{border-color:#c41e3a;color:#c41e3a;background:#fff5f6}\n"
            "</style>\n"
        )
        t = t.replace('<div class="wrap">', '<div class="wrap">\n' + bar, 1)
        open(ap, "w", encoding="utf-8").write(t)
        print(f"all-products.html: added static category bar with {len(HUBS)} Hub links")
    else:
        print("all-products.html: static cat bar already present, skipped")

if __name__ == "__main__":
    main()
