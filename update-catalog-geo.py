#!/usr/bin/env python3
"""Update catalog page links, GEO files, and sitemap for new product pages."""

import json, os, re
from datetime import datetime

BASE = '/Users/mapingyuan/WorkBuddy/2026-07-24-11-47-23/stwadd-fullsite'

with open(os.path.join(BASE, 'product-slugs.json')) as f:
    slugs = json.load(f)

print(f"Loaded {len(slugs)} product-slug mappings")

# ── 1. Update 2026-catalog.html ──
catalog_path = os.path.join(BASE, '2026-catalog.html')
with open(catalog_path) as f:
    catalog = f.read()

# Replace each product name with clickable link
# Pattern: the table rows in the catalog
for s in slugs:
    # Find and replace in catalog HTML
    # The row contains the product name in <td class="name">
    original = s['original_name']
    seo_name = s['seo_name']
    link = f'/products/{s["slug"]}.html'
    
    # Replace the plain text name with linked version
    # Pattern: <td class="name">{original}</td>
    old_td = f'<td class="name">{original}</td>'
    new_td = f'<td class="name"><a href="{link}" title="{seo_name}">{seo_name}</a></td>'
    catalog = catalog.replace(old_td, new_td)

# Also update product count display
catalog = catalog.replace('2026 Product Catalog · 167 Products', 
                           '2026 Product Catalog · 167 Products · Click for Details')

with open(catalog_path, 'w') as f:
    f.write(catalog)

print("Updated catalog page with product links")

# ── 2. Update llms.txt ──
llms_path = os.path.join(BASE, 'llms.txt')
with open(llms_path) as f:
    llms = f.read()

# Add catalog section
catalog_entry = """\n
## 2026 Product Catalog (167 Products)
- Full catalog with specifications: https://www.stwadd.com/2026-catalog.html
- Individual product detail pages with SEO optimization, structured data, and direct WhatsApp inquiry
- Products include: insulated cups, vacuum flasks, coffee mugs, plastic tumblers, car cups, straw cups, gift sets, large capacity jugs"""

if '2026 Product Catalog' not in llms:
    llms += catalog_entry

product_sample = "\n- Sample product pages: "
for i in range(min(5, len(slugs))):
    s = slugs[i]
    product_sample += f"https://www.stwadd.com/products/{s['slug']}.html, "
if 'Sample product pages:' not in llms:
    llms += product_sample.rstrip(', ')
    llms += "\n- All 167 product pages available via https://www.stwadd.com/2026-catalog.html\n"

with open(llms_path, 'w') as f:
    f.write(llms)

print("Updated llms.txt")

# ── 3. Update identity.json ──
identity_path = os.path.join(BASE, 'identity.json')
with open(identity_path) as f:
    identity = json.load(f)

# Add product catalog reference
if 'knowsAbout' in identity:
    # Append 2026 catalog info
    identity['knowsAbout'].append({
        "@type": "ItemList",
        "name": "2026 Product Catalog",
        "numberOfItems": 167,
        "url": "https://www.stwadd.com/2026-catalog.html",
        "description": "Complete 2026 product catalog with SEO-optimized product detail pages"
    })

with open(identity_path, 'w') as f:
    json.dump(identity, f, ensure_ascii=False, indent=2)

print("Updated identity.json")

# ── 4. Update ai.txt ──
ai_path = os.path.join(BASE, 'ai.txt')
with open(ai_path) as f:
    ai = f.read()

if '2026 Product Catalog' not in ai:
    ai += """\n
## 2026 Product Catalog
- 167 individual product pages in /products/ directory
- Each page has full Product schema (JSON-LD), BreadcrumbList, and Organization schema
- Product names are SEO-optimized with long-tail keywords
- All pages have canonical URLs and responsive HTML"""
    with open(ai_path, 'w') as f:
        f.write(ai)
    print("Updated ai.txt")

# ── 5. Update sitemap.xml with new product pages ──
sitemap_path = os.path.join(BASE, 'sitemap.xml')
with open(sitemap_path) as f:
    sitemap = f.read()

today = datetime.now().strftime('%Y-%m-%d')
new_entries = []
for s in slugs:
    entry = f"""  <url>
    <loc>https://www.stwadd.com/products/{s['slug']}.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""
    new_entries.append(entry)

# Add before closing </urlset>
sitemap = sitemap.replace('</urlset>', '\n'.join(new_entries) + '\n</urlset>')

# Also add the catalog page if not present
if '2026-catalog.html' not in sitemap:
    catalog_entry = f"""  <url>
    <loc>https://www.stwadd.com/2026-catalog.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""
    sitemap = sitemap.replace('</urlset>', catalog_entry + '\n</urlset>')

with open(sitemap_path, 'w') as f:
    f.write(sitemap)

print(f"Updated sitemap.xml with {len(slugs)} product pages + catalog entry")

# ── 6. Verify ──
print(f"\nVerification:")
print(f"  products/ directory: {len(os.listdir(os.path.join(BASE, 'products')))} files")
print(f"  catalog page updated: {os.path.exists(catalog_path)}")
print(f"  llms.txt updated: {os.path.exists(llms_path)}")
print(f"  identity.json updated: {os.path.exists(identity_path)}")
print(f"  ai.txt updated: {os.path.exists(ai_path)}")
print(f"  sitemap.xml updated: {os.path.exists(sitemap_path)}")

# Print sample links
print(f"\nSample product URLs:")
for s in slugs[:5]:
    print(f"  https://www.stwadd.com/products/{s['slug']}.html")
