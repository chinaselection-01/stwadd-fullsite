#!/usr/bin/env python3
# Unify NAP street address across the whole site to the canonical value.
# User confirmed the real address is "No.138-1 Shifang East Road" (not Qianjin).
# We replace the old substring everywhere (HTML pages + data source + generator + llms.txt)
# so regenerating pages will not reintroduce the wrong address.

import os
import glob

OLD = "No.8 Qianjin Industrial Zone"
NEW = "No. 138-1, Shifang East Road, Industrial Function Zone (Huku)"

targets = list(glob.glob("**/*.html", recursive=True))
for f in ["identity.json", "generate-product-pages.py", "llms.txt"]:
    if os.path.exists(f):
        targets.append(f)

changed = 0
total_repl = 0
for f in targets:
    with open(f, "r", encoding="utf-8") as fh:
        data = fh.read()
    if OLD in data:
        c = data.count(OLD)
        data = data.replace(OLD, NEW)
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(data)
        changed += 1
        total_repl += c
        print(f"  {f}: {c} replacement(s)")

print(f"\nFiles changed: {changed}")
print(f"Total replacements: {total_repl}")

# Report any remaining 'Qianjin' variants (with space, etc.)
leftover = 0
for f in targets:
    try:
        with open(f, "r", encoding="utf-8") as fh:
            d = fh.read()
    except Exception:
        continue
    if "Qianjin" in d:
        # show the offending line(s)
        for i, line in enumerate(d.splitlines(), 1):
            if "Qianjin" in line:
                print(f"  LEFTOVER in {f}:{i}: {line.strip()[:120]}")
                leftover += 1
print(f"Leftover 'Qianjin' lines: {leftover}")
