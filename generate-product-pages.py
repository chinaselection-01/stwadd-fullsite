#!/usr/bin/env python3
"""Generate 167 SEO product detail pages from catalog data."""

import json, re, os, random, unicodedata

BASE = '/Users/mapingyuan/WorkBuddy/2026-07-24-11-47-23/stwadd-fullsite'
OUTDIR = os.path.join(BASE, 'products')
os.makedirs(OUTDIR, exist_ok=True)

with open(os.path.join(BASE, '2026-catalog-data.json')) as f:
    products = json.load(f)

random.seed(42)

# ── keyword pools ──
MATERIALS = [
    "Double Wall Stainless Steel",
    "18/8 Stainless Steel",
    "304 Food Grade Stainless Steel",
    "316 Stainless Steel",
    "Premium Stainless Steel",
    "Eco-Friendly Tritan Plastic",
    "BPA-Free Tritan",
    "BPA-Free Plastic",
    "Shatterproof Plastic",
    "High Borosilicate Glass",
]

FEATURES_A = [
    "Vacuum Insulated",
    "Thermal Insulated",
    "Double Wall Vacuum",
    "Triple Layer Insulated",
    "Copper Coated Insulated",
    "Temperature Display",
]

FEATURES_B = [
    "Ceramic Inner",
    "Leak Proof",
    "Sweat Proof",
    "Rust Proof",
    "Shatter Proof",
    "BPA Free",
    "Food Grade",
    "Eco Friendly",
    "Dishwasher Safe",
    "Easy Clean",
]

COMMERCE = [
    "Factory Price",
    "OEM ODM",
    "Directly Factory",
    "Wholesale Bulk",
    "Cheap Price",
    "Custom Logo OEM",
    "Bulk Wholesale",
    "Manufacturer Direct",
]

SCENARIOS = [
    "School",
    "Hiking",
    "Sports",
    "Travel",
    "Office",
    "Gym",
    "Camping",
    "Outdoor",
    "Daily Use",
    "Picnic",
    "Road Trip",
    "Beach",
    "Yoga",
    "Running",
    "Fitness",
    "Work",
    "College",
    "Backpacking",
    "Home",
    "Kitchen",
]

STYLES = [
    "Classic",
    "Modern",
    "Stylish",
    "Portable",
    "Sleek",
    "Ergonomic",
    "Compact",
    "Lightweight",
    "Heavy Duty",
    "Retro",
    "Minimalist",
    "Trendy",
    "Fashion",
    "Cute",
    "Cartoon",
]

# ── Product type mapping from Chinese name ──
def categorize(name):
    n = name
    if '杯' in n or '温度' in n or '温显' in n or '保温' in n or '口袋' in n or '高盖' in n or '背包' in n or '滑板' in n:
        return 'insulated cup'
    if '壶' in n or '瓶' in n or '罐' in n or '大口' in n or '闷茶' in n:
        return 'vacuum flask'
    if '咖啡' in n:
        return 'coffee mug'
    if '塑料' in n or '鹿角' in n or '小熊' in n or '拉布布' in n or '铃兰' in n or '三丽鸥' in n or '卡皮' in n:
        return 'plastic tumbler'
    if '汽车' in n or '车载' in n:
        return 'car cup'
    if '吸管' in n:
        return 'straw cup'
    if '弹跳' in n or '速开' in n:
        return 'flip lid bottle'
    if '套装' in n or '套盒' in n or '三件套' in n or '三盖' in n:
        return 'gift set'
    if '大壶' in n or '可乐' in n or '啤酒' in n or '红酒' in n:
        return 'large capacity jug'
    if '易拉罐' in n:
        return 'can style cup'
    if '手柄' in n or '手提' in n or '吊带' in n:
        return 'handle mug'
    if '水果' in n or '榴莲' in n:
        return 'fruit design bottle'
    if '卡通' in n or '动物' in n or '熊' in n or '猫' in n or '蜘蛛' in n or '史迪' in n or '米奇' in n:
        return 'cartoon character cup'
    return 'stainless steel bottle'

def pick_one(pool, avoid=None):
    return random.choice([x for x in pool if x != avoid])

def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

def extract_capacity(cap_str):
    """Extract numeric capacity in ml from various formats."""
    cap_str = str(cap_str)
    nums = re.findall(r'(\d+)\s*[mM]?[lL]?', cap_str)
    if nums:
        return int(nums[0])
    return None

def make_seo_name(p, idx):
    """Generate a unique SEO-optimized product name."""
    cat = categorize(p['name'])
    cap = extract_capacity(p['capacity']) if p['capacity'] != '-' else None
    
    # Build rich name from pools
    material = pick_one(MATERIALS)
    feat_a = pick_one(FEATURES_A)
    feat_b1 = pick_one(FEATURES_B)
    feat_b2 = pick_one(FEATURES_B, avoid=feat_b1)
    commerce = pick_one(COMMERCE)
    scenario = pick_one(SCENARIOS)
    style = pick_one(STYLES)
    
    # Capacity prefix
    cap_part = f"{cap}ml " if cap and cap < 10000 else ""
    
    # Assemble name
    patterns = [
        f"{cap_part}{material} {feat_a} {feat_b1} {feat_b2} {cat} for {scenario} {commerce}",
        f"{cap_part}{style} {feat_a} {material} {cat} {feat_b1} for {scenario} & {pick_one(SCENARIOS, avoid=scenario)} {commerce}",
        f"{cap_part}{feat_a} {material} {cat} with {feat_b1} {feat_b2} {commerce} for {scenario}",
        f"{cap_part}{style} {material} {feat_b1} {feat_a} {cat} {commerce} {scenario}",
    ]
    
    name = random.choice(patterns)
    # Clean up
    name = re.sub(r'\s+', ' ', name).strip()
    # Remove "for" at end
    name = re.sub(r'\s+for\s*$', '', name)
    
    return name

# ── Generate all product data ──
product_data = []
used_slugs = set()
used_names = set()

for i, p in enumerate(products):
    for attempt in range(30):
        seo_name = make_seo_name(p, i)
        slug = slugify(seo_name)[:120]
        if slug and slug not in used_slugs and seo_name not in used_names:
            break
    else:
        slug = slugify(seo_name)[:120]
        base_slug = slug
        c = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{c}"
            c += 1
    
    used_slugs.add(slug)
    used_names.add(seo_name)
    
    cap_val = extract_capacity(p['capacity']) if p['capacity'] != '-' else None
    
    product_data.append({
        'seq': p['seq'],
        'original_name': p['name'],
        'seo_name': seo_name,
        'slug': slug,
        'capacity': p['capacity'],
        'capacity_ml': cap_val,
        'weight': p['weight'],
        'pcs': p['pcs'],
        'carton': p['carton'],
        'filename': f"{slug}.html",
    })

# Save mapping
with open(os.path.join(BASE, 'product-slugs.json'), 'w') as f:
    json.dump(product_data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(product_data)} product names/slugs")

# ── Print name samples ──
for pd in product_data[:5]:
    print(f"  {pd['original_name']} → {pd['seo_name']}")
    print(f"    slug: {pd['slug']}")

# ── SEO keyword tags (rotating) ──
KEYWORD_POOLS = [
    ["stainless steel water bottle", "insulated water bottle", "vacuum flask wholesale", "OEM water bottle factory", "double wall tumbler"],
    ["thermal cup manufacturer", "stainless steel mug wholesale", "vacuum insulated bottle", "custom logo water bottle", "bulk drinkware supplier"],
    ["travel mug factory", "insulated tumbler OEM", "stainless steel bottle China", "wholesale water bottles", "custom drinkware manufacturer"],
    ["food grade water bottle", "BPA free tumbler wholesale", "leak proof bottle factory", "outdoor water bottle OEM", "sports bottle supplier"],
    ["camping flask manufacturer", "school water bottle wholesale", "gym bottle factory", "office mug supplier", "picnic drinkware OEM"],
]

# ── Product page HTML template ──
def make_product_html(pd, idx):
    """Generate a complete SEO product detail page HTML."""
    slug = pd['slug']
    name = pd['seo_name']
    cap = pd['capacity'] if pd['capacity'] not in ('-', '', None) else 'Various'
    pcs = pd['pcs'] if pd['pcs'] not in ('-', '', None) else 'Custom'
    carton = pd['carton'] if pd['carton'] not in ('-', '', None) else 'Custom'
    weight = pd['weight'] if pd['weight'] not in ('-', '', None) else '-'
    
    keywords = random.choice(KEYWORD_POOLS)
    kw_str = ", ".join(keywords)
    
    desc = f"Wholesale {name}. Factory direct price, OEM ODM available. High quality {cap} capacity. Contact STWADD for bulk pricing and custom logo."
    if len(desc) > 160:
        desc = desc[:157] + "..."
    
    wa_number = "8615088228843"
    wa_msg = f"Hi STWADD, I'm interested in: {name}. Please send me the best factory price and MOQ."
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | Wholesale OEM ODM Factory | STWADD</title>
    <meta name="description" content="{desc}">
    <meta name="keywords" content="{kw_str}">
    <meta property="og:title" content="{name}">
    <meta property="og:description" content="{desc}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://www.stwadd.com/products/{slug}.html">
    <link rel="canonical" href="https://www.stwadd.com/products/{slug}.html">
    
    <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{name}",
  "description": "{desc}",
  "brand": {{ "@type": "Brand", "name": "STWADD" }},
  "manufacturer": {{ "@type": "Organization", "name": "Yongkang STWADD Houseware Co., Ltd." }},
  "offers": {{
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0.00",
    "priceCurrency": "USD",
    "url": "https://www.stwadd.com/products/{slug}.html"
  }}
}}
    </script>
    <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.stwadd.com/" }},
    {{ "@type": "ListItem", "position": 2, "name": "2026 Catalog", "item": "https://www.stwadd.com/2026-catalog.html" }},
    {{ "@type": "ListItem", "position": 3, "name": "{name}" }}
  ]
}}
    </script>
    <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Yongkang STWADD Houseware Co., Ltd.",
  "url": "https://www.stwadd.com",
  "contactPoint": {{
    "@type": "ContactPoint",
    "telephone": "+86-150-8822-8843",
    "contactType": "sales",
    "availableLanguage": ["English", "Russian", "Portuguese", "Spanish", "Arabic"]
  }},
  "address": {{
    "@type": "PostalAddress",
    "streetAddress": "No.8 Qianjin Industrial Zone",
    "addressLocality": "Yongkang",
    "addressRegion": "Zhejiang",
    "postalCode": "321300",
    "addressCountry": "CN"
  }}
}}
    </script>

    <style>
        :root {{
            --gold: #F8C221;
            --gold-hover: #d4a40a;
            --dark: #1a1a1a;
            --bg: #f8f9fa;
            --card-bg: #fff;
            --text: #333;
            --text-light: #666;
            --text-lighter: #999;
            --border: #e0e0e0;
            --green: #25D366;
            --green-hover: #1da84e;
            --radius: 10px;
        }}
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }}
        .top-bar {{
            background: var(--dark);
            color: #ccc;
            font-size: 12px;
            text-align: center;
            padding: 6px 12px;
        }}
        .top-bar strong {{ color: var(--gold); }}
        .header {{
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #fff;
            padding: 20px;
            text-align: center;
            border-bottom: 3px solid var(--gold);
        }}
        .header a {{ color: var(--gold); text-decoration: none; }}
        .header .logo {{
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 3px;
        }}
        .header .tagline {{
            font-size: 12px;
            color: #999;
            letter-spacing: 1px;
            margin-top: 2px;
        }}
        .breadcrumb {{
            max-width: 1100px;
            margin: 0 auto;
            padding: 12px 20px;
            font-size: 13px;
            color: var(--text-lighter);
        }}
        .breadcrumb a {{ color: var(--text-light); text-decoration:none; }}
        .breadcrumb a:hover {{ color: var(--gold); }}
        .container {{
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px 40px;
        }}
        .product-hero {{
            background: var(--card-bg);
            border-radius: var(--radius);
            padding: 32px 28px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 24px;
        }}
        .product-hero h1 {{
            font-size: 26px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 8px;
            line-height: 1.3;
        }}
        .product-hero .sku {{
            font-size: 13px;
            color: var(--text-lighter);
            margin-bottom: 20px;
        }}
        .specs-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin-bottom: 24px;
        }}
        .spec-card {{
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 14px 16px;
            text-align: center;
        }}
        .spec-card .label {{
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-lighter);
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }}
        .spec-card .value {{
            font-size: 16px;
            font-weight: 700;
            color: var(--dark);
        }}
        .price-section {{
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            padding: 20px 0 0;
            border-top: 1px solid var(--border);
        }}
        .price-tag {{
            font-size: 14px;
            color: var(--text-light);
            font-weight: 500;
        }}
        .whatsapp-btn {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--green);
            color: #fff;
            padding: 12px 24px;
            border-radius: 28px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.2s;
        }}
        .whatsapp-btn:hover {{
            background: var(--green-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(37,211,102,0.35);
        }}
        .wa-icon {{
            width: 20px;
            height: 20px;
        }}
        .info-section {{
            background: var(--card-bg);
            border-radius: var(--radius);
            padding: 28px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 24px;
        }}
        .info-section h2 {{
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
            color: var(--dark);
            border-bottom: 2px solid var(--gold);
            padding-bottom: 8px;
            display: inline-block;
        }}
        .info-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 10px;
        }}
        .info-row {{
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }}
        .info-label {{
            font-weight: 600;
            min-width: 140px;
            font-size: 14px;
            color: var(--text-light);
        }}
        .info-value {{
            font-size: 14px;
            color: var(--text);
        }}
        .feature-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }}
        .feature-tag {{
            display: inline-block;
            padding: 6px 14px;
            background: #fdf7e8;
            border: 1px solid #f5e0a3;
            border-radius: 20px;
            font-size: 12px;
            color: #8a6d14;
            font-weight: 500;
        }}
        .cta-section {{
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #fff;
            border-radius: var(--radius);
            padding: 32px 28px;
            text-align: center;
            margin-bottom: 24px;
        }}
        .cta-section h3 {{
            font-size: 20px;
            margin-bottom: 8px;
        }}
        .cta-section p {{
            color: #ccc;
            font-size: 14px;
            margin-bottom: 16px;
        }}
        .related-section {{
            background: var(--card-bg);
            border-radius: var(--radius);
            padding: 28px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 24px;
        }}
        .related-section h2 {{
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
        }}
        .related-links {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}
        .related-links a {{
            display: inline-block;
            padding: 8px 14px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 13px;
            color: var(--text);
            text-decoration: none;
            transition: all 0.15s;
        }}
        .related-links a:hover {{
            border-color: var(--gold);
            background: #fdf7e8;
        }}
        .footer {{
            text-align: center;
            padding: 28px 20px;
            color: var(--text-lighter);
            font-size: 13px;
            border-top: 1px solid var(--border);
            background: var(--card-bg);
        }}
        .footer a {{ color: var(--gold); text-decoration:none; }}
        .back-nav {{
            display: inline-block;
            margin-bottom: 16px;
            color: var(--text-light);
            text-decoration: none;
            font-size: 14px;
        }}
        .back-nav:hover {{ color: var(--gold); }}

        @media (max-width: 768px) {{
            .product-hero h1 {{ font-size: 22px; }}
            .container {{ padding: 0 14px 24px; }}
            .specs-grid {{ grid-template-columns: repeat(2, 1fr); }}
            .info-label {{ min-width: 100px; }}
        }}
        @media (max-width: 480px) {{
            .specs-grid {{ grid-template-columns: 1fr 1fr; }}
            .price-section {{ flex-direction: column; align-items: flex-start; }}
        }}
    </style>
</head>
<body>

<div class="top-bar">
    <strong>FREE SHIPPING SAMPLE</strong> — Factory Direct Price · OEM ODM Available · ISO 9001 Certified Since 2002
</div>

<div class="header">
    <a href="/" class="logo">S T W A D D</a>
    <div class="tagline">PREMIUM HOUSEWARE MANUFACTURER — WHOLESALE & OEM SINCE 2002</div>
</div>

<div class="container">
    <div class="breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="/2026-catalog.html">2026 Catalog</a> &rsaquo; {name}
    </div>
    
    <a href="/2026-catalog.html" class="back-nav">&larr; Back to 2026 Catalog</a>

    <div class="product-hero">
        <h1>{name}</h1>
        <div class="sku">SKU: STW-{pd['seq']} &nbsp;|&nbsp; Category: {pd['original_name']}</div>

        <div class="specs-grid">
            <div class="spec-card">
                <div class="label">Capacity</div>
                <div class="value">{cap}</div>
            </div>
            <div class="spec-card">
                <div class="label">PCS / Carton</div>
                <div class="value">{pcs}</div>
            </div>
            <div class="spec-card">
                <div class="label">Carton Size</div>
                <div class="value">{carton}</div>
            </div>
            <div class="spec-card">
                <div class="label">Carton Weight</div>
                <div class="value">{weight} kg</div>
            </div>
        </div>

        <div class="price-section">
            <div class="price-tag">
                <div style="font-size:22px;font-weight:700;color:var(--dark)">Factory Price</div>
                <div style="font-size:12px;color:var(--text-lighter);margin-top:2px">MOQ negotiable</div>
            </div>
            <a href="https://wa.me/{wa_number}?text={wa_msg}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
                <svg class="wa-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                Get Factory Price on WhatsApp
            </a>
        </div>
    </div>

    <div class="info-section">
        <h2>Product Specifications</h2>
        <div class="info-grid">
            <div class="info-row"><span class="info-label">Product Name</span><span class="info-value">{name}</span></div>
            <div class="info-row"><span class="info-label">Model Number</span><span class="info-value">STW-{pd['seq']}</span></div>
            <div class="info-row"><span class="info-label">Capacity</span><span class="info-value">{cap}</span></div>
            <div class="info-row"><span class="info-label">PCS / Carton</span><span class="info-value">{pcs}</span></div>
            <div class="info-row"><span class="info-label">Carton Size</span><span class="info-value">{carton}</span></div>
            <div class="info-row"><span class="info-label">Carton Weight</span><span class="info-value">{weight} kg</span></div>
            <div class="info-row"><span class="info-label">Material</span><span class="info-value">Stainless Steel / Tritan Plastic / Glass</span></div>
            <div class="info-row"><span class="info-label">MOQ</span><span class="info-value">500-1000 pcs</span></div>
            <div class="info-row"><span class="info-label">Lead Time</span><span class="info-value">20-35 days</span></div>
            <div class="info-row"><span class="info-label">Custom Logo</span><span class="info-value">Yes — Laser / Silk Screen / Heat Transfer</span></div>
            <div class="info-row"><span class="info-label">Sample</span><span class="info-value">Available — Free with Freight Collect</span></div>
        </div>
        <div class="feature-tags">
'''
    # Add feature tags
    features_from_name = []
    if 'stainless steel' in name.lower(): features_from_name.append('304 Stainless Steel')
    if 'double wall' in name.lower() or 'vacuum' in name.lower(): features_from_name.append('Double Wall Vacuum')
    if 'leak proof' in name.lower(): features_from_name.append('Leak Proof')
    if 'copper' in name.lower(): features_from_name.append('Copper Coated')
    if 'bpa' in name.lower() or 'food grade' in name.lower(): features_from_name.append('BPA Free')
    if 'insulated' in name.lower(): features_from_name.append('Thermal Insulated')
    if 'oem' in name.lower(): features_from_name.append('OEM Available')
    if 'factory' in name.lower(): features_from_name.append('Factory Direct')
    if 'wholesale' in name.lower() or 'bulk' in name.lower(): features_from_name.append('Wholesale')
    
    if not features_from_name:
        features_from_name = ['Vacuum Insulated', 'Stainless Steel', 'BPA Free', 'Food Grade', 'Leak Proof']
    
    for tag in features_from_name:
        html += f'            <span class="feature-tag">{tag}</span>\n'
    
    # Related products
    related = random.sample([p for p in product_data if p['slug'] != slug], min(8, len(product_data)-1))
    related_links = ""
    for rp in related:
        related_links += f'<a href="/products/{rp["slug"]}.html">{rp["seo_name"][:60]}...</a>\n'
    
    html += f'''        </div>
    </div>

    <div class="info-section">
        <h2>Why Choose STWADD</h2>
        <div class="info-grid">
            <div class="info-row"><span class="info-label">Factory Size</span><span class="info-value">20,000+ sqm</span></div>
            <div class="info-row"><span class="info-label">Production Lines</span><span class="info-value">7 automated lines</span></div>
            <div class="info-row"><span class="info-label">Monthly Capacity</span><span class="info-value">2,000,000+ units</span></div>
            <div class="info-row"><span class="info-label">Certifications</span><span class="info-value">ISO 9001, SGS, TUV, FDA, LFGB</span></div>
            <div class="info-row"><span class="info-label">Export Markets</span><span class="info-value">80+ countries</span></div>
            <div class="info-row"><span class="info-label">Major Clients</span><span class="info-value">Walmart, Costco, Carrefour</span></div>
        </div>
    </div>

    <div class="cta-section">
        <h3>Ready to Order?</h3>
        <p>Factory direct pricing, custom logo, fast shipping. Talk to our sales team now.</p>
        <a href="https://wa.me/{wa_number}?text={wa_msg}" target="_blank" rel="noopener" class="whatsapp-btn">
            <svg class="wa-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Chat on WhatsApp — Get Price Now
        </a>
    </div>

    <div class="related-section">
        <h2>Related Products</h2>
        <div class="related-links">
            {related_links}
        </div>
    </div>

    <div class="related-section">
        <h2>Quick Links</h2>
        <div class="related-links">
            <a href="/2026-catalog.html">2026 Full Catalog</a>
            <a href="/">STWADD Home</a>
            <a href="/about-us.html">About Us</a>
            <a href="/products.html">All Products</a>
            <a href="/contact-us.html">Contact Us</a>
            <a href="/services.html">OEM / ODM Services</a>
        </div>
    </div>
</div>

<div class="footer">
    <p><a href="https://www.stwadd.com"><strong>www.stwadd.com</strong></a> · WhatsApp: <a href="https://wa.me/{wa_number}">+86 150 8822 8843</a> · Email: <a href="mailto:sales1@stwadd.com">sales1@stwadd.com</a></p>
    <p style="margin-top:6px;font-size:12px;color:#aaa">Yongkang STWADD Houseware Co., Ltd. · No.8 Qianjin Industrial Zone · Yongkang · Zhejiang 321300 · China</p>
    <p style="font-size:11px;color:#bbb;margin-top:4px">ISO 9001 | SGS | TUV | FDA | LFGB Certified — Premium Drinkware Manufacturer Since 2002</p>
</div>

</body>
</html>'''
    return html

# ── Generate all HTML files ──
print(f"\nGenerating {len(product_data)} product pages...")
for i, pd in enumerate(product_data):
    html = make_product_html(pd, i)
    filepath = os.path.join(OUTDIR, pd['filename'])
    with open(filepath, 'w') as f:
        f.write(html)
    if (i+1) % 20 == 0:
        print(f"  {i+1}/{len(product_data)} pages generated...")

print(f"Done! {len(product_data)} product pages created in {OUTDIR}")
print(f"Slug mapping saved to product-slugs.json")
