#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build static category HUB pages for stwadd.com (P0/P1 remediation).
- Source of truth: all-products.json (857 real catalog products).
- Each Hub = a crawlable HTML page listing ALL matched products as static <a> links.
- Adds FAQPage + BreadcrumbList JSON-LD, unique title/meta/description.
- Appends the new Hub URLs to sitemap.xml.
"""
import json, os, html, datetime, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.stwadd.com"

# ---- category definitions (slug, display name, match keywords, intro, faqs) ----
CATEGORIES = [
    {
        "slug": "tumblers",
        "name": "Tumblers",
        "kw": ["tumbler"],
        "intro": "STWADD tumblers are double-wall vacuum insulated for all-day hot and cold retention, with leak-proof lids built for branding. Choose from 12oz to 40oz in stainless steel and plastic, all available with custom logo, color and packaging under OEM/ODM.",
        "faqs": [
            ("What sizes of tumblers do you manufacture?", "We produce tumblers from 12oz to 40oz, including the popular 20oz and 30oz formats compatible with standard lid and straw accessories."),
            ("Can tumblers be customized with my brand?", "Yes. We offer OEM/ODM: custom logo printing, laser engraving, powder-coat colors, gift boxes and insert cards, with low MOQ for stock shapes."),
            ("Are your tumblers BPA-free and food safe?", "All materials are BPA-free and food-grade, compliant with FDA, LFGB and EU standards, with SGS/TUV test reports available."),
        ],
    },
    {
        "slug": "flasks",
        "name": "Wine Flasks & Growlers",
        "kw": ["flask", "wine", "growler", "beer"],
        "intro": "Our flask and growler range covers stainless steel wine flasks, hip flasks and 1L-2L beer growlers with vacuum insulation that keeps drinks cold for 24h or hot for 12h. Ideal for outdoor, gifting and private-label programs.",
        "faqs": [
            ("What capacity growlers do you offer?", "We make 1L, 1.5L and 2L insulated growlers plus 250ml-750ml wine flasks, all with leak-proof screw or flip caps."),
            ("Do flasks preserve carbonation?", "Our growlers use a sealed double-wall design that holds carbonation far longer than single-wall bottles, suitable for craft beer transport."),
            ("Can I order flasks with custom engraving?", "Yes, laser engraving and color printing are both supported for low-MOQ private label orders."),
        ],
    },
    {
        "slug": "insulated-bottles",
        "name": "Insulated Water Bottles",
        "kw": ["insulated", "vacuum"],
        "intro": "Double-wall vacuum insulated water bottles are our core line — 18/8 stainless steel, copper-plated vacuum layer, sweat-free exterior and 12-24h temperature retention. Available in sports, office and kids variants.",
        "faqs": [
            ("How long do your insulated bottles keep drinks cold?", "Standard double-wall vacuum bottles keep cold up to 24 hours and hot up to 12 hours, verified by our in-house lab."),
            ("What steel grade is used?", "We use 18/8 (304) food-grade stainless steel for the inner wall; some lines use 316 for higher corrosion resistance."),
            ("What is the minimum order quantity?", "MOQ is flexible: as low as 500-1000 pcs for stock molds with logo printing, higher for fully custom tooling."),
        ],
    },
    {
        "slug": "stainless-steel-bottles",
        "name": "Stainless Steel Bottles",
        "kw": ["stainless steel", "stainless"],
        "intro": "Food-grade 304 and 316 stainless steel bottles with vacuum insulation, powder-coat or mirror finishes and a full range of caps (sport, straw, smart-temperature). Factory-direct pricing with full certification.",
        "faqs": [
            ("Is the stainless steel you use 304 or 316?", "Inner walls are 18/8 304 as standard; 316 is offered for premium anti-corrosion requests such as citrus or seawater use."),
            ("Are these bottles dishwasher safe?", "Most powder-coated bodies are hand-wash recommended; lids are generally top-rack dishwasher safe. We label care guidance per SKU."),
            ("Do you provide material certificates?", "Yes — mill test reports, FDA/LFGB and SGS certificates are provided with every shipment."),
        ],
    },
    {
        "slug": "plastic-bottles",
        "name": "Plastic & Tritan Bottles",
        "kw": ["plastic", "tritan", "pet"],
        "intro": "BPA-free plastic and Tritan bottles from 350ml to 2L — lightweight, shatter-resistant and ideal for sports, kids and promotional use. Tritan models are odor-free and dishwasher safe.",
        "faqs": [
            ("Are your plastic bottles BPA-free?", "All our plastic bottles are BPA-free; Tritan models meet Eastman food-contact standards and are odor- and stain-resistant."),
            ("What is the largest plastic bottle you make?", "We produce up to 2L sports and gym bottles with carry straps and times-to-drink markers."),
            ("Can plastic bottles be recycled?", "Yes, our PET and Tritan bottles are recyclable; we also offer recycled-material options on request."),
        ],
    },
    {
        "slug": "glass-bottles",
        "name": "Glass Bottles",
        "kw": ["glass"],
        "intro": "Borosilicate and soda-lime glass water bottles with protective silicone sleeves, perfect for pure taste and hot beverages. A premium option for wellness and gift markets.",
        "faqs": [
            ("Do glass bottles come with a protective sleeve?", "Yes, most glass bottles ship with a removable silicone sleeve for grip and drop protection."),
            ("Can glass bottles hold hot drinks?", "Borosilicate glass models are thermal-shock resistant and safe for hot beverages; sleeve models add insulation."),
            ("Are they suitable for private label?", "We support custom sleeves, boxes and printed logos for glass bottle gift sets."),
        ],
    },
    {
        "slug": "sports-bottles",
        "name": "Sports & Gym Bottles",
        "kw": ["sport", "gym", "shaker"],
        "intro": "Sports bottles built for the gym and trail: squeezable Tritan, insulated steel, shaker bottles with mixer balls, and 1L+ capacities with leak-proof flip caps and carry loops.",
        "faqs": [
            ("Do you make shaker bottles?", "Yes — we produce shaker bottles with mixing balls and measuring marks for protein and pre-workout use."),
            ("Are sports bottles leak-proof?", "All sport caps use a locking flip or push-pull mechanism tested for leak resistance during transport."),
            ("What capacities suit gym use?", "500ml-1L are most popular for training; we also make 1.5L-2L hydration bottles."),
        ],
    },
    {
        "slug": "kids-bottles",
        "name": "Kids & Baby Bottles",
        "kw": ["kids", "baby", "children", "child"],
        "intro": "Kid-friendly bottles with soft spouts, sippy and straw lids, playful prints and lightweight Tritan or stainless bodies. All materials are food-grade and BPA-free for safe daily use.",
        "faqs": [
            ("What lid types are available for kids?", "We offer sippy, straw and spout lids with one-hand open mechanisms suitable for toddlers and school-age children."),
            ("Are kids bottles BPA-free?", "Yes, all kids bottles use BPA-free Tritan or 304 stainless with food-safe, non-toxic coatings."),
            ("Can they go in the dishwasher?", "Lids are top-rack dishwasher safe; we provide care labels for each design."),
        ],
    },
    {
        "slug": "coffee-mugs",
        "name": "Coffee Mugs & Cups",
        "kw": ["mug", "coffee"],
        "intro": "Insulated coffee mugs and camp mugs with comfortable handles, leak-proof slide lids and 12-20oz capacity — built for cafes, commuting and branded merchandise programs.",
        "faqs": [
            ("Do coffee mugs fit car cup holders?", "Most 12-16oz mug designs are cup-holder friendly; we confirm dimensions per SKU."),
            ("Are lids leak-proof?", "Slide-lock and screw lids are leak-resistant for commuting; we label each lid's rating."),
            ("Can mugs be custom printed?", "Yes — full-color print, laser engraving and gift-box packaging are supported."),
        ],
    },
    {
        "slug": "cups",
        "name": "Cups & Drinkware",
        "kw": ["cup"],
        "intro": "A broad cup line — enamel, stainless, ceramic-coat and double-wall cups for hot and cold drinks, promotional events and retail. Mix and match with custom branding.",
        "faqs": [
            ("What cup materials do you offer?", "Stainless steel, enamel, ceramic-coated and double-wall plastic cups across 8-16oz formats."),
            ("Are cups suitable for hot drinks?", "Double-wall and ceramic-coated cups are designed for hot beverages without burning hands."),
            ("Do you support small batch branding?", "Yes, low-MOQ printing is available for promotional and event cups."),
        ],
    },
    {
        "slug": "lunch-boxes",
        "name": "Lunch Boxes & Coolers",
        "kw": ["lunch", "lunchbox", "cooler", "cooler bag"],
        "intro": "Insulated lunch boxes and cooler bags with leak-proof liners, divider trays and carry handles — for meal prep, school and picnic. Custom prints and sizes supported.",
        "faqs": [
            ("Are lunch boxes leak-proof?", "Inner liners use heat-sealed, leak-resistant materials; some models include removable silicone seals."),
            ("Do cooler bags keep food cold?", "Insulated cooler bags with foil lining maintain temperature for several hours for short trips."),
            ("Can they be private labeled?", "Yes — printed panels, zipper pulls and hang tags are customizable."),
        ],
    },
    {
        "slug": "travel-mugs",
        "name": "Travel Mugs & Tumblers",
        "kw": ["travel"],
        "intro": "Commuter-grade travel mugs with slim profiles, secure lids and 12-20oz insulation — designed to slip into cup holders and backpacks while keeping coffee hot for hours.",
        "faqs": [
            ("Are travel mugs cup-holder compatible?", "Our travel line is sized for standard car cup holders; dimensions are listed per SKU."),
            ("How long do they keep coffee hot?", "Double-wall vacuum travel mugs keep drinks hot up to 6-8 hours depending on capacity."),
            ("What lid styles are offered?", "Slide-lid, flip-lid and screw-lid options, all leak-resistant for commuting."),
        ],
    },
]

# ---- related content pages (t-*.html guides/reports) mapped to categories for internal linking ----
def _load_tmap():
    tmap = {c["slug"]: [] for c in CATEGORIES}
    for fp in glob.glob(os.path.join(ROOT, "t-*.html")):
        name = os.path.basename(fp)
        try:
            tt = open(fp, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        m = re.search(r"<title>(.*?)</title>", tt, re.S)
        title = m.group(1).strip() if m else name
        title = re.sub(r"\s*\|.*$", "", title).strip()
        nl = name.lower()
        slug = None
        for c in CATEGORIES:
            if any(k in nl for k in c["kw"]):
                slug = c["slug"]; break
        if slug is None:
            if "glass" in nl: slug = "glass-bottles"
            elif any(k in nl for k in ["flask", "whiskey", "alcohol", "hip"]): slug = "flasks"
            elif any(k in nl for k in ["sport", "cycling", "running", "gym", "soccer", "football", "basketball"]): slug = "sports-bottles"
            elif any(k in nl for k in ["bento", "lunch", "cooler"]): slug = "lunch-boxes"
            elif any(k in nl for k in ["kids", "baby"]): slug = "kids-bottles"
            elif any(k in nl for k in ["mug", "cup", "tumbler", "wine"]): slug = "cups"
            elif "silicone" in nl: slug = "plastic-bottles"
            elif any(k in nl for k in ["insulated", "vacuum", "thermos", "thermal"]): slug = "insulated-bottles"
            elif "stainless" in nl: slug = "stainless-steel-bottles"
            elif "plastic" in nl or "tritan" in nl: slug = "plastic-bottles"
            else: slug = "insulated-bottles"
        tmap[slug].append((name, title))
    return tmap

T_MAP = _load_tmap()

PAGE_CSS = """
:root{--primary:#c41e3a;--text:#222;--text-light:#666;--border:#eaeaea;--bg:#fafafa}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.6}
a{color:inherit;text-decoration:none}
.header{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
.header .container{display:flex;align-items:center;justify-content:space-between;height:64px;max-width:1200px;margin:0 auto;padding:0 20px}
.logo{font-size:1.4rem;font-weight:800;color:var(--primary);letter-spacing:-.5px}
.back{font-size:.9rem;color:var(--text-light)}
.back:hover{color:var(--primary)}
.wrap{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
.crumb{font-size:13px;color:var(--text-light);padding:14px 0}
.crumb a:hover{color:var(--primary)}
.page-title{font-size:1.9rem;font-weight:800;margin-bottom:6px}
.page-sub{color:var(--text-light);margin-bottom:22px;max-width:760px}
.cat-nav{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 26px}
.cat-nav a{padding:7px 14px;border:1px solid var(--border);border-radius:999px;font-size:.85rem;background:#fff}
.cat-nav a:hover,.cat-nav a.active{border-color:var(--primary);color:var(--primary);background:#fff5f6}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px}
.card{background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:transform .15s,box-shadow .15s;display:flex;flex-direction:column}
.card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
.card .img{aspect-ratio:1/1;background:#f3f3f3;display:flex;align-items:center;justify-content:center;overflow:hidden}
.card .img img{width:100%;height:100%;object-fit:contain}
.card .body{padding:12px 14px 16px}
.card .name{font-size:.86rem;font-weight:500;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:3.6em}
.section-h{font-size:1.15rem;font-weight:700;margin:34px 0 14px}
.faq{border:1px solid var(--border);border-radius:12px;background:#fff;padding:6px 18px}
.faq details{border-bottom:1px solid var(--border);padding:14px 0}
.faq details:last-child{border-bottom:none}
.faq summary{font-weight:600;cursor:pointer}
.faq p{color:var(--text-light);margin-top:8px}
.footer{text-align:center;padding:30px;color:#aaa;font-size:13px;border-top:1px solid var(--border);margin-top:40px}
@media(max-width:600px){.grid{grid-template-columns:repeat(2,1fr);gap:12px}.page-title{font-size:1.4rem}}
.rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:8px}
.rel-card{display:block;background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;font-size:.88rem;font-weight:500;line-height:1.4;transition:border-color .15s,color .15s}
.rel-card:hover{border-color:var(--primary);color:var(--primary)}
"""

def esc(s):
    return html.escape(str(s), quote=True)

def build_page(cat, products, all_slugs):
    slug = cat["slug"]
    url = f"{SITE}/{slug}.html"
    title = f"{cat['name']} | STWADD Drinkware Manufacturer"
    desc = f"Shop STWADD {cat['name']} — {len(products)}+ factory-direct drinkware models with OEM/ODM customization, vacuum insulation and full certifications. Browse specs and request a quote."
    # breadcrumb + faq json-ld
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": cat["name"], "item": url},
        ],
    }
    faq_items = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                 for q, a in cat["faqs"]]
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq_items}

    cards = []
    for p in products:
        name = p.get("name", "")
        purl = p.get("url", "")
        img = p.get("image", "")
        cards.append(
            f'      <a class="card" href="{esc(purl)}">'
            f'<div class="img"><img loading="lazy" src="{esc(img)}" alt="{esc(name)}" '
            f'onerror="this.style.display=\'none\'"></div>'
            f'<div class="body"><div class="name">{esc(name)}</div></div></a>'
        )
    cards_html = "\n".join(cards)

    cat_nav = []
    for s in all_slugs:
        cls = " active" if s == slug else ""
        cat_nav.append(f'<a class="cat-nav-link{cls}" href="/{s}.html">{esc(next(c["name"] for c in CATEGORIES if c["slug"]==s))}</a>')
    cat_nav_html = "\n      ".join(cat_nav)

    faq_html = "\n".join(
        f'      <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in cat["faqs"]
    )

    rel = T_MAP.get(slug, [])[:10]
    rel_cards = "\n      ".join(
        f'<a class="rel-card" href="/{esc(fn)}">{esc(ti)}</a>' for fn, ti in rel
    )
    related_html = ""
    if rel:
        related_html = (
            '  <h2 class="section-h">Related Buying Guides &amp; Trend Reports</h2>\n'
            '  <div class="rel-grid">\n      ' + rel_cards + "\n  </div>")

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(url)}">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
<style>{PAGE_CSS}</style>
</head>
<body>
<header class="header">
  <div class="container">
    <a href="/" class="logo">STWADD</a>
    <a href="/" class="back">&larr; Back to Home</a>
  </div>
</header>
<div class="wrap">
  <nav class="crumb"><a href="/">Home</a> &rsaquo; <span>{esc(cat['name'])}</span></nav>
  <h1 class="page-title">{esc(cat['name'])}</h1>
  <p class="page-sub">{esc(cat['intro'])}</p>
  <div class="cat-nav">
      {cat_nav_html}
  </div>
  <h2 class="section-h">All {esc(cat['name'])} ({len(products)})</h2>
  <div class="grid">
{cards_html}
  </div>
  <h2 class="section-h">Frequently Asked Questions</h2>
  <div class="faq">
{faq_html}
  </div>
{related_html}
  <div class="footer">Yongkang STWADD Houseware Co., Ltd &middot; <a href="{esc(SITE)}">www.stwadd.com</a> &middot; <a href="/all-products.html">Full Catalog</a></div>
</div>
</body>
</html>
"""
    return doc

def main():
    with open(os.path.join(ROOT, "all-products.json"), encoding="utf-8") as f:
        ALL = json.load(f)
    print(f"Loaded {len(ALL)} catalog products")

    all_slugs = [c["slug"] for c in CATEGORIES]
    new_urls = []
    total_before = 0
    for cat in CATEGORIES:
        kws = [k.lower() for k in cat["kw"]]
        matched = [p for p in ALL if any(k in p.get("name", "").lower() for k in kws)]
        # Hub pages list ONLY stwadd's own product pages (relative / urls).
        # External 1688 supplier links are excluded to avoid leaking PageRank
        # and to keep the Hub a clean internal crawl path.
        local = [p for p in matched if str(p.get("url", "")).startswith("/")]
        print(f"  /{cat['slug']}.html  -> {len(local)} local products (of {len(matched)} matched)")
        total_before += len(local)
        page = build_page(cat, local, all_slugs)
        with open(os.path.join(ROOT, f"{cat['slug']}.html"), "w", encoding="utf-8") as out:
            out.write(page)
        new_urls.append(f"{SITE}/{cat['slug']}.html")

    # update sitemap
    sm = os.path.join(ROOT, "sitemap.xml")
    with open(sm, encoding="utf-8") as f:
        content = f.read()
    today = datetime.date.today().isoformat()
    blocks = []
    for u in new_urls:
        blocks.append(
            f'  <url>\n    <loc>{u}</loc>\n    <lastmod>{today}</lastmod>\n'
            f'    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>'
        )
    insertion = "\n".join(blocks) + "\n</urlset>"
    content = content.replace("</urlset>", insertion, 1)
    with open(sm, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Sitemap updated: +{len(new_urls)} Hub URLs")

if __name__ == "__main__":
    main()
