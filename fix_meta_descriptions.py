#!/usr/bin/env python3
"""
Fix meta descriptions across all STWADD HTML pages.

Problem (flagged by Bing Webmaster Tools):
  - 536 root pages have identical truncated weyescloud template: 
    "Premium OEM & ODM Services For Insulated Water Bottles, Wine tumbler Flasks, And" (93 chars)
  - 567 es/ + 568 ru/ pages have short (<100 chars) meta descriptions
  
Solution: Generate unique, SEO-friendly meta descriptions per page using:
  - Product name extracted from <title> or <h1>
  - Factory/OEM positioning keywords
  - Length target: 120-160 chars (ideal for search snippets)
"""

import glob
import re
import os
import random

# --- Configuration ---
TARGET_LEN_MIN = 120
TARGET_LEN_MAX = 160

# Suffixes to append for variety (factory/OEM positioning)
SUFFIXES_EN = [
    "OEM/ODM manufacturer in China. Cheap factory-direct pricing, low MOQ. Get a quote.",
    "China factory supplier. Custom logo, color & packaging. Bulk wholesale pricing available.",
    "Factory-direct from Yongkang. OEM/ODM custom production for brands worldwide. Contact us.",
    "Cheap China manufacturer. Accepts private-label & white-label bulk orders. Request quote.",
    "Yongkang drinkware factory. ISO9001 certified, SGS tested. Bulk OEM pricing, fast lead time.",
    "Direct-from-factory pricing. Custom mold, logo printing, packaging. MOQ from 500 pcs.",
]

SUFFIXES_ES = [
    "Fabricante OEM/ODM en China. Precios directos de fábrica, bajo MOQ. Solicite cotización.",
    "Proveedor de fábrica en China. Logo personalizado, color y embalaje. Precios al por mayor.",
    "Fábrica directa de Yongkang. Producción OEM/ODM personalizada para marcas mundiales.",
    "Fabricante barato de China. Acepta pedidos privados y blancos al por mayor. Cotice aquí.",
    "Fábrica de vajilla de Yongkang. Certificación ISO9001, probado SGS. Precios OEM masivos.",
    "Precios directos de fábrica. Molde personalizado, impresión de logo. MOQ desde 500 uds.",
]

SUFFIXES_RU = [
    "Производитель OEM/ODM в Китае. Цены напрямую с завода, низкий MOQ. Запросите коммерческое предложение.",
    "Поставщик завода в Китае. Логотип, цвет и упаковка на заказ. Оптовые цены доступны.",
    "Завод напрямую из Юнканя. OEM/ODM производство для мировых брендов. Свяжитесь с нами.",
    "Дешевый производитель Китая. Принимает частные и белые оптовые заказы. Запросите цену.",
    "Завод посуды в Юнкане. Сертификация ISO9001, проверено SGS. Оптовые цены OEM.",
    "Цены напрямую с завода. Индивидуальная форма, печать логотипа. MOQ от 500 шт.",
]


def extract_product_name(html: str) -> str:
    """Extract product name from page, preferring h1 then title."""
    # Try h1 first (cleaner product names)
    m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
    if m:
        name = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        if name and len(name) > 5:
            return name
    
    # Fall back to title
    m = re.search(r'<title>([^<]+)</title>', html)
    if m:
        name = m.group(1).strip()
        # Remove common suffixes like " | STWADD ..."
        name = re.split(r'\s*[|–—-]\s*STWADD', name)[0].strip()
        if name:
            return name
    
    return ""


def clean_product_name(name: str) -> str:
    """Clean up product name for use in meta description."""
    # Remove excessive keyword stuffing - take first meaningful segment
    # Many titles are like "Wholesale Bulk Hot 20 Oz Unique Stainless Steel Double Wall Vacuum Coffee Tumbler With Lid"
    # We want to shorten to something like "20 Oz Stainless Steel Vacuum Coffee Tumbler"
    
    # If very long (>80 chars), try to trim intelligently
    if len(name) > 80:
        # Remove common SEO-fluff prefixes
        name = re.sub(r'^(Wholesale\s+Bulk\s+|Bulk\s+|Hot\s+|New\s+Design\s+)', '', name, flags=re.I)
        name = re.sub(r'^(Custom(?:ized)?\s+|Premium\s+|High\s+Quality\s+)', '', name, flags=re.I)
        
        # If still too long, truncate at a natural break
        if len(name) > 80:
            # Try to cut after a key material/spec word
            for word in ['Tumbler', 'Bottle', 'Flask', 'Mug', 'Cup', 'Bottle']:
                idx = name.find(word)
                if idx > 20:  # found it not too early
                    # Include this word + maybe one more after
                    end = name.find(' ', idx + len(word) + 10)
                    if end > idx + len(word):
                        name = name[:end]
                        break
    
    return name.strip()


def generate_meta_desc(product_name: str, suffix_pool: list, rng: random.Random) -> str:
    """Generate a unique meta description from product name + suffix."""
    suffix = suffix_pool[rng.randint(0, len(suffix_pool) - 1)]
    
    base = f"{product_name}. "
    full = base + suffix
    
    # Adjust length to be within target range
    if len(full) < TARGET_LEN_MIN:
        # Pad with more detail
        extra = " Insulated drinkware specialist since 2017."
        full = base + extra + " " + suffix
    elif len(full) > TARGET_LEN_MAX:
        # Trim product name until it fits
        while len(full) > TARGET_LEN_MAX and len(product_name) > 15:
            product_name = product_name.rsplit(' ', 1)[0]
            full = f"{product_name}. " + suffix
    
    return full[:TARGET_LEN_MAX]


def fix_file(filepath: str, suffix_pool: list, rng: random.Random) -> dict:
    """Fix meta description in a single file. Returns stats dict."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        return {'status': 'error', 'file': filepath, 'msg': str(e)}
    
    # Find existing meta description
    mm = re.search(r'(<meta\s+name=["\']description["\']\s*content=["\'])([^"\']*)(["\'])', html, re.I)
    if not mm:
        return {'status': 'no-meta', 'file': filepath}
    
    old_desc = mm.group(2).strip()
    old_len = len(old_desc)
    
    # Check if it needs fixing (junk pattern OR too short)
    is_junk = "Premium OEM & ODM Services For Insulated" in old_desc or \
              "Premium OEM & ODM Services for Insulated" in old_desc
    is_short = old_len < 100
    
    if not is_junk and not is_short:
        return {'status': 'ok', 'file': filepath, 'old_len': old_len}
    
    # Extract product name and generate new description
    product_name = extract_product_name(html)
    if not product_name:
        return {'status': 'no-name', 'file': filepath}
    
    product_name = clean_product_name(product_name)
    new_desc = generate_meta_desc(product_name, suffix_pool, rng)
    
    # Replace
    new_html = html[:mm.start(2)] + new_desc + html[mm.end(2):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    return {
        'status': 'fixed',
        'file': filepath,
        'old_len': old_len,
        'new_len': len(new_desc),
        'reason': 'junk' if is_junk else 'short',
        'product': product_name[:60],
        'new_desc_preview': new_desc[:80],
    }


def main():
    results = {'fixed': 0, 'ok': 0, 'error': 0, 'no_meta': 0, 'no_name': 0}
    fixed_details = []
    
    # Use deterministic RNG based on filename for reproducibility but variety
    base_rng = random.Random(42)
    
    # Process root directory HTML files
    print("=" * 70)
    print("FIXING META DESCRIPTIONS - STWADD SITE")
    print("=" * 70)
    
    # Root directory
    root_files = sorted(glob.glob("*.html")) + sorted(glob.glob("p-*.html"))
    print(f"\n--- Root directory ({len(root_files)} files) ---")
    for f in root_files:
        rng = random.Random(base_rng.randint(0, 999999))
        r = fix_file(f, SUFFIXES_EN, rng)
        if r['status'] == 'fixed':
            results['fixed'] += 1
            fixed_details.append(r)
        elif r['status'] == 'ok':
            results['ok'] += 1
        elif r['status'] == 'error':
            results['error'] += 1
        elif r['status'] == 'no_meta':
            results['no_meta'] += 1
        elif r['status'] == 'no_name':
            results['no_name'] += 1
    
    # Spanish (es/)
    es_files = sorted(glob.glob("es/*.html"))
    print(f"\n--- es/ ({len(es_files)} files) ---")
    for f in es_files:
        rng = random.Random(base_rng.randint(0, 999999))
        r = fix_file(f, SUFFIXES_ES, rng)
        if r['status'] == 'fixed':
            results['fixed'] += 1
            fixed_details.append(r)
        elif r['status'] == 'ok':
            results['ok'] += 1
        elif r['status'] == 'error':
            results['error'] += 1
        elif r['status'] == 'no_meta':
            results['no_meta'] += 1
        elif r['status'] == 'no_name':
            results['no_name'] += 1
    
    # Russian (ru/)
    ru_files = sorted(glob.glob("ru/*.html"))
    print(f"\n--- ru/ ({len(ru_files)} files) ---")
    for f in ru_files:
        rng = random.Random(base_rng.randint(0, 999999))
        r = fix_file(f, SUFFIXES_RU, rng)
        if r['status'] == 'fixed':
            results['fixed'] += 1
            fixed_details.append(r)
        elif r['status'] == 'ok':
            results['ok'] += 1
        elif r['status'] == 'error':
            results['error'] += 1
        elif r['status'] == 'no_meta':
            results['no_meta'] += 1
        elif r['status'] == 'no_name':
            results['no_name'] += 1
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"  Fixed (rewritten):   {results['fixed']}")
    print(f"  OK (already good):   {results['ok']}")
    print(f"  Errors:              {results['error']}")
    print(f"  No meta tag:         {results['no_meta']}")
    print(f"  No product name:     {results['no_name']}")
    
    if fixed_details:
        print(f"\n--- Sample of fixed descriptions ---")
        for d in fixed_details[:10]:
            print(f"  [{d['old_len']:3d}→{d['new_len']:3d} chars] ({d['reason']:4s}) {d['file'][:50]}")
            print(f"       → {d['new_desc_preview']}...")
        
        # Stats on new lengths
        lengths = [d['new_len'] for d in fixed_details]
        print(f"\n  New desc lengths: min={min(lengths)}, max={max(lengths)}, avg={sum(lengths)/len(lengths):.0f}")


if __name__ == '__main__':
    main()
