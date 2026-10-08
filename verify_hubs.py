#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, re, json, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
HUBS = ["tumblers","flasks","insulated-bottles","stainless-steel-bottles","plastic-bottles",
        "glass-bottles","sports-bottles","kids-bottles","coffee-mugs","cups",
        "lunch-boxes","travel-mugs"]

all_ok = True
for slug in HUBS:
    f = os.path.join(ROOT, f"{slug}.html")
    if not os.path.exists(f):
        print(f"[FAIL] {slug}.html missing"); all_ok=False; continue
    s = open(f, encoding="utf-8").read()
    links = re.findall(r'<a class="card" href="([^"]+)"', s)
    # JSON-LD parse
    lds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    ld_ok = True
    for blk in lds:
        try: json.loads(blk)
        except Exception as e:
            ld_ok=False; print(f"  [{slug}] JSON-LD parse error: {e}")
    # verify linked product files exist
    missing = [l for l in links if not os.path.exists(os.path.join(ROOT, l.lstrip('/')))]
    status = "OK" if (len(links)>0 and ld_ok and len(missing)==0) else "FAIL"
    if status=="FAIL": all_ok=False
    print(f"[{status}] {slug:24s} cards={len(links):4d} jsonld={len(lds)} broken_links={len(missing)}")
    if missing[:3]:
        print(f"        e.g. missing: {missing[:3]}")

# homepage: no ?q= links remain
idx = open(os.path.join(ROOT,"index.html"), encoding="utf-8").read()
qcount = idx.count("all-products.html?q=")
print(f"\nindex.html remaining ?q= links: {qcount}  {'OK' if qcount==0 else 'FAIL'}")
if qcount: all_ok=False

# all-products static bar
ap = open(os.path.join(ROOT,"all-products.html"), encoding="utf-8").read()
print(f"all-products.html static-cat-bar present: {'OK' if 'static-cat-bar' in ap else 'FAIL'}")
if 'static-cat-bar' not in ap: all_ok=False

# sitemap contains all hubs
sm = open(os.path.join(ROOT,"sitemap.xml"), encoding="utf-8").read()
miss = [h for h in HUBS if f"https://www.stwadd.com/{h}.html" not in sm]
print(f"sitemap hub URLs missing: {miss if miss else 'none'}  {'OK' if not miss else 'FAIL'}")
if miss: all_ok=False

print("\nRESULT:", "ALL CHECKS PASSED" if all_ok else "SOME CHECKS FAILED")
