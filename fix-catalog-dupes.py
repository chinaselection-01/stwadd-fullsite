#!/usr/bin/env python3
"""Regenerate catalog table rows with correct unique links for each product."""

import json, os

BASE = '/Users/mapingyuan/WorkBuddy/2026-07-24-11-47-23/stwadd-fullsite'

with open(os.path.join(BASE, 'product-slugs.json')) as f:
    slugs = json.load(f)

with open(os.path.join(BASE, '2026-catalog.html')) as f:
    catalog = f.read()

# Find the tbody section
import re
tbody_match = re.search(r'<tbody id="productList">(.*?)</tbody>', catalog, re.DOTALL)
if not tbody_match:
    print("ERROR: Could not find tbody in catalog")
    exit(1)

# Generate new tbody with correct links
whatsapp_number = "8615088228843"
new_rows = ""

for i, s in enumerate(slugs, 1):
    cap = s['capacity'] if s['capacity'] not in ('-', '', None) else '-'
    pcs = s['pcs'] if s['pcs'] not in ('-', '', None) else '-'
    carton = s['carton'] if s['carton'] not in ('-', '', None) else '-'
    seo_name = s['seo_name']
    slug = s['slug']
    link = f'/products/{slug}.html'
    
    wa_link = f"https://wa.me/{whatsapp_number}?text=Hi STWADD, I'm interested in: {seo_name} ({cap}). Please send me the best price."
    wa_link_escaped = wa_link.replace('&', '&amp;').replace('"', '&quot;')
    
    new_rows += f"""
        <tr class="product-row">
            <td class="seq">{i}</td>
            <td class="name"><a href="{link}" title="{seo_name}">{seo_name}</a></td>
            <td class="spec">{cap}</td>
            <td class="spec">{pcs}</td>
            <td class="spec carton">{carton}</td>
            <td class="action">
                <a href="{wa_link_escaped}" target="_blank" rel="noopener" class="whatsapp-btn">
                    <svg viewBox="0 0 24 24" class="wa-icon"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    联系获取底价
                </a>
            </td>
        </tr>"""

# Replace old tbody with new
old_tbody = tbody_match.group(0)
new_tbody = '<tbody id="productList">' + new_rows + '\n            </tbody>'
catalog = catalog.replace(old_tbody, new_tbody)

# Also update the JavaScript products array at the bottom
# Find the products declaration
products_js = json.dumps([{'seq': s['seq'], 'name': s['seo_name'], 'capacity': s['capacity'], 
                           'weight': s['weight'], 'pcs': s['pcs'], 'carton': s['carton'],
                           'slug': s['slug'], 'original_name': s['original_name']} 
                          for s in slugs], ensure_ascii=False)

# Update the const products = [...] line
js_match = re.search(r'const products = \[.*?\];', catalog, re.DOTALL)
if js_match:
    catalog = catalog.replace(js_match.group(0), f'const products = {products_js};')

with open(os.path.join(BASE, '2026-catalog.html'), 'w') as f:
    f.write(catalog)

print(f"Catalog regenerated with {len(slugs)} unique product links")

# Verify no plain Chinese names remain in tbody links
import re
remaining = re.findall(r'<td class="name">([^<]*)</td>', catalog)
plain = [r for r in remaining if not r.startswith('<a')]
print(f"Plain text names without links: {len(plain)}")
if plain:
    for x in plain[:5]:
        print(f"  - {x[:50]}")
