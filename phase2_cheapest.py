#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audit fix (yellow #2): replace "cheapest" marketing copy with value-based language
(cost-effective / factory-direct / lowest / no-middleman) on the commercial pages
ONLY: index.html and oem-odm.html.
- KEEPS the FAQ question "Are you the cheapest water bottle factory in China?" verbatim
  (natural buyer query -> good for matching search intent; the answers are reframed).
- Does NOT touch article pages where "cheapest" legitimately means "cheapest cleaner".
"""
import os
ROOT = "."
FILES = ["index.html", "oem-odm.html"]
KEEP = "Are you the cheapest water bottle factory in China?"  # preserve verbatim (query intent)

REPL = [
    ("Cheapest East-Asia Drinkware Factory — OEM/ODM for Global Buyers",
     "Most Cost-Effective East-Asia Drinkware Factory — OEM/ODM for Global Buyers"),
    ("Cheapest Water Bottle, Flask &amp; Mug Factory (OEM/ODM)",
     "Cost-Effective Water Bottle, Flask &amp; Mug Manufacturer (OEM/ODM)"),
    ("Cheapest Water Bottle, Flask & Mug Factory (OEM/ODM)",
     "Cost-Effective Water Bottle, Flask & Mug Manufacturer (OEM/ODM)"),
    ("Cheapest factory-bottom pricing", "Lowest factory-direct pricing"),
    ("cheapest factory-direct", "cost-effective factory-direct"),   # broader: covers "…prices" / "…water bottle"
    ("cheapest factory-bottom prices", "lowest factory-direct prices"),
    ("cheapest factory-bottom pricing", "lowest factory-direct pricing"),
    ("among the cheapest sources", "among the most cost-effective sources"),
    ("among the cheapest OEM/ODM drinkware factories", "among the most cost-effective OEM/ODM drinkware factories"),
    ("consistently among the cheapest", "consistently among the most cost-effective"),
    ("cheapest sources for custom drinkware", "most cost-effective sources for custom drinkware"),
    ("the cheapest water bottle factory in China", "the most cost-effective water bottle factory in China"),
]

import re
# regex replacements for cases where tags split the phrase (e.g. <b>Cheapest</b> factory-bottom pricing)
RE_REPL = [
    (re.compile(r'<b>Cheapest</b> factory-bottom pricing'), '<b>Lowest</b> factory-direct pricing'),
]

for fn in FILES:
    p = f"{ROOT}/{fn}"
    if not os.path.exists(p):
        print("SKIP (missing):", fn); continue
    lines = open(p, encoding="utf-8").read().split("\n")
    changed = 0
    for i, line in enumerate(lines):
        if KEEP in line:
            continue  # keep the natural buyer question untouched
        new = line
        for a, b in REPL:
            if a in new:
                new = new.replace(a, b)
        for rgx, rep in RE_REPL:
            if rgx.search(new):
                new = rgx.sub(rep, new)
        if new != line:
            lines[i] = new
            changed += 1
    open(p, "w", encoding="utf-8").write("\n".join(lines))
    print(f"{fn}: {changed} lines changed; remaining 'cheapest' (incl. kept FAQ question) =",
          open(p, encoding="utf-8").read().lower().count("cheapest"))
