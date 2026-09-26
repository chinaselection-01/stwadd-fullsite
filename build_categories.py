#!/usr/bin/env python3
"""Generate 12 category pages for STWADD's China Buying Office / sourcing-agent section.
English skeletons only (multilingual variants are a follow-up pass)."""
import os, json, html

OUT = "categories"
os.makedirs(OUT, exist_ok=True)

SITE = "https://www.stwadd.com"

CSS = """:root{--red:#c41e3a;--dark:#111418;--blue:#2f6fb0;--line:#e6e8eb;--bg:#fff;--muted:#6b7280}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;color:var(--dark);background:#f6f7f9;line-height:1.65}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.header{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:12px 24px}
.logo{font-weight:800;font-size:22px;color:var(--red);letter-spacing:.5px}
.logo span{color:var(--dark)}
.nav{display:flex;gap:22px;font-size:15px}
.nav a:hover{color:var(--red)}
.nav a.active{color:var(--red);font-weight:700}
.cta{background:var(--red);color:#fff;padding:9px 18px;border-radius:6px;font-weight:600;font-size:14px}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
.crumb{font-size:13px;color:var(--muted);padding:14px 0}
.crumb a:hover{color:var(--red)}
.hero{background:#fff;border:1px solid var(--line);border-radius:12px;padding:34px;margin-bottom:22px}
.hero .tag{display:inline-block;background:#fdecef;color:var(--red);font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:.5px;margin-bottom:14px}
.h1{font-size:30px;line-height:1.25;margin-bottom:14px}
.lead{font-size:16px;color:#374151;margin-bottom:18px}
.hero .facts{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}
.fact{background:#f6f7f9;border:1px solid var(--line);border-radius:8px;padding:10px 14px;font-size:13px;color:#374151}
.fact b{color:var(--red)}
.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:8px;font-weight:600;font-size:15px}
.btn-primary{background:var(--red);color:#fff}
.btn-wa{background:#25D366;color:#fff}
.section{background:#fff;border:1px solid var(--line);border-radius:12px;padding:26px;margin-bottom:22px}
.section h2{font-size:22px;margin-bottom:12px}
.section h3{font-size:16px;margin:18px 0 8px;color:var(--blue)}
.section p{color:#374151;margin-bottom:12px}
.section ul{margin:0 0 12px 20px;color:#374151}
.section li{margin-bottom:6px}
.cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
.cat-card{border:1px solid var(--line);border-radius:10px;padding:16px}
.cat-card h3{font-size:15px;margin-bottom:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.cat-card .badge{background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;letter-spacing:.3px}
.cat-card p{font-size:13px;color:#374151;margin-bottom:10px}
.cat-tags{display:flex;flex-wrap:wrap;gap:6px}
.cat-tags span{background:#f6f7f9;border:1px solid var(--line);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--muted)}
.steps{counter-reset:s;list-style:none;margin:0;padding:0}
.steps li{counter-increment:s;position:relative;padding:14px 14px 14px 56px;border:1px solid var(--line);border-radius:10px;margin-bottom:12px;color:#374151}
.steps li:before{content:counter(s);position:absolute;left:14px;top:14px;width:28px;height:28px;background:var(--red);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.faq-item{border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px}
.faq-item .q{font-weight:700;font-size:15px;margin-bottom:8px;color:var(--dark)}
.faq-item .a{color:#374151;font-size:14px}
.inquiry{background:linear-gradient(120deg,#111418,#1f2937);color:#fff;border-radius:12px;padding:30px;margin-bottom:22px;text-align:center}
.inquiry h2{color:#fff;margin-bottom:8px}
.inquiry p{color:#cbd5e1;margin-bottom:18px}
.inquiry a{display:inline-block;background:var(--red);color:#fff;padding:13px 28px;border-radius:8px;font-weight:700}
.footer{background:#0c0f14;color:#9ca3af;padding:34px 0;font-size:14px}
.footer .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px;max-width:1180px;margin:0 auto;padding:0 20px}
.footer h3{color:#fff;font-size:15px;margin-bottom:12px}
.footer .logo{color:var(--red);margin-bottom:10px;display:block}
.footer a{color:#cbd5e1}
@media(max-width:880px){.cat-grid{grid-template-columns:1fr}.nav{display:none}.footer .cols{grid-template-columns:1fr}}"""

CATS = [
    {
        "slug": "kitchenware-dining", "name": "Kitchenware & Dining", "icon": "🍳",
        "meta": "Source kitchenware & dining from China with STWADD's AI buying office: food storage, lunch boxes, utensils, cookware and bakeware — private label, AQL 2.5 inspection, container consolidation, transparent 3-5% commission.",
        "intro": "Stock your supermarket's kitchen aisle with compliant, retail-ready kitchenware sourced across China. STWADD's buying office shortlists vetted factories for food storage containers, lunch boxes, utensils, cookware and bakeware, then consolidates everything into one container with private-label packaging and AQL 2.5 inspection.",
        "subcats": ["Food storage containers", "Bento & lunch boxes", "Meal-prep containers", "Cutting boards", "Cooking utensil sets", "Silicone & wooden utensils", "Knives & sharpeners", "Bakeware", "Tableware & serving sets", "Small kitchen appliances", "Kitchen textiles"],
        "tags": ["wholesale lunch boxes", "food storage containers China", "kitchen utensil set", "private label cookware", "silicone bakeware"],
        "faqs": [
            ("Can STWADD source kitchenware & dining products from China for my supermarket?",
             "Yes. Our buying office sources the full kitchenware & dining range for retail chains — food storage, lunch boxes, utensils, cookware and bakeware — from vetted Chinese factories. We shortlist 5-10 suppliers per item, compare quotes side by side, and consolidate mixed orders into one container."),
            ("What is the MOQ and lead time for kitchenware?",
             "MOQ is flexible by product: standardized items like containers or utensils can start around 500-1,000 pieces per SKU, while custom-mold cookware is higher. Typical lead time is 30-35 days for production plus 5-7 days consolidated loading from Ningbo or Yiwu."),
            ("Do you provide private label / OEM for kitchenware?",
             "Yes. We apply your supermarket's logo and retail-ready packaging, place barcodes (UPC/EAN), and assemble gift sets. Food-contact items are sourced in compliant materials with FDA/LFGB documentation where required."),
            ("How does STWADD ensure quality and compliance for kitchenware?",
             "Every order gets pre-production sample approval and pre-shipment AQL 2.5 inspection with a downloadable report and photos. For food-contact items we verify material certifications and can arrange third-party SGS/BV testing."),
        ],
    },
    {
        "slug": "home-storage", "name": "Home Storage & Organization", "icon": "📦",
        "meta": "Source home storage & organization products from China: storage bins, drawer organizers, closet systems, laundry baskets. Private label, AQL 2.5 inspection, container consolidation via STWADD buying office.",
        "intro": "Fill the home-organization aisle with practical, high-turn storage products sourced across China. STWADD's buying office finds vetted suppliers for storage boxes, drawer organizers, closet systems and laundry solutions, then consolidates shipments and inspects quality before they reach your port.",
        "subcats": ["Storage boxes & bins", "Drawer organizers", "Closet & shelving systems", "Hanging organizers", "Laundry baskets", "Hangers", "Hooks", "Utility trolleys", "Under-bed storage"],
        "tags": ["storage bins wholesale", "drawer organizer China", "closet storage", "stackable containers", "home organization products"],
        "faqs": [
            ("Can STWADD source home storage products from China for my retail chain?",
             "Yes. We source storage boxes, drawer organizers, closet systems, laundry baskets and related organization products from vetted Chinese factories, consolidating multiple SKUs into one container for your chain."),
            ("What is the MOQ and lead time for home storage?",
             "Standard storage items typically start around 500-1,000 pieces per SKU; bespoke molded bins are higher. Production lead time is generally 30-35 days, plus 5-7 days for consolidated container loading."),
            ("Do you provide private label / OEM for home storage?",
             "Yes. We handle custom logo, retail-ready packaging, barcodes and bundled sets so the products arrive shelf-ready under your own brand."),
            ("How does STWADD ensure quality for home storage?",
             "We run pre-shipment AQL 2.5 inspection on every consolidated order and annual factory audits on recommended suppliers, with photos and a downloadable report before loading."),
        ],
    },
    {
        "slug": "cleaning-household", "name": "Cleaning & Household Care", "icon": "🧽",
        "meta": "Source cleaning & household care products from China: microfiber cloths, mops, brushes, spray bottles. Private label, AQL 2.5 inspection, container consolidation via STWADD buying office.",
        "intro": "Keep the cleaning aisle stocked with reliable, compliant household care products sourced across China. STWADD's buying office matches your specs to vetted suppliers for microfiber cloths, mops, brushes and dispensers, then consolidates and quality-checks every batch.",
        "subcats": ["Cleaning brushes", "Microfiber cloths", "Mops & buckets", "Spray bottles", "Dish racks", "Trash bins & liners", "Gloves", "Laundry care products"],
        "tags": ["cleaning supplies wholesale", "microfiber cloth", "mop bucket", "household cleaning products", "disposable cleaning"],
        "faqs": [
            ("Can STWADD source cleaning & household care products from China?",
             "Yes. We source microfiber cloths, mops, brushes, spray bottles, dish racks and laundry care items from vetted Chinese factories and consolidate them with your other categories into one shipment."),
            ("What is the MOQ and lead time for cleaning products?",
             "Most cleaning accessories start around 500-2,000 pieces per SKU depending on item and customization. Lead time is typically 30-35 days production plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for cleaning products?",
             "Yes. We apply your retail brand, retail-ready packaging and barcodes; for chemical-containing products we handle compliant formulations and documentation."),
            ("How does STWADD ensure quality for household care?",
             "We perform pre-shipment AQL 2.5 inspection and can arrange third-party testing for material safety and chemical compliance where the destination market requires it."),
        ],
    },
    {
        "slug": "pet-supplies", "name": "Pet Supplies", "icon": "🐾",
        "meta": "Source pet supplies from China: cat trees, pet beds, feeding bowls, toys. Private label, AQL 2.5 inspection, container consolidation via STWADD's China buying office.",
        "intro": "The pet category is one of the highest-repeat-purchase aisles in retail. STWADD's buying office sources cat trees, pet beds, feeding bowls and toys from vetted Chinese factories, consolidates them into one container and inspects quality before shipping.",
        "subcats": ["Pet beds", "Cat trees & scratching posts", "Feeding bowls & mats", "Leashes & collars", "Interactive toys", "Grooming tools", "Carriers", "Litter boxes"],
        "tags": ["cat tree manufacturer", "pet bed wholesale", "dog feeding bowl", "pet toys China", "private label pet products"],
        "faqs": [
            ("Can STWADD source pet supplies from China for my supermarket?",
             "Yes. We source pet beds, cat trees, feeding bowls, leashes, toys and grooming tools from vetted Chinese suppliers and consolidate them with your other private-label categories into one container."),
            ("What is the MOQ and lead time for pet supplies?",
             "Soft items like beds start around 300-500 pieces; structural items like cat trees are higher. Typical lead time is 30-35 days production plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for pet products?",
             "Yes. We apply your brand, retail packaging and barcodes, and can build private-label pet sets (bed + bowl + toy) for the shelf."),
            ("How does STWADD ensure quality for pet products?",
             "We run AQL 2.5 pre-shipment inspection and check material safety (e.g. non-toxic coatings, durable stitching) before loading, with photos and a downloadable report."),
        ],
    },
    {
        "slug": "toys-kids-baby", "name": "Toys, Kids & Baby", "icon": "🧸",
        "meta": "Source toys, kids & baby products from China: STEM toys, plush, baby care. Private label, AQL 2.5 inspection, container consolidation via STWADD buying office.",
        "intro": "Toys and baby goods demand strict safety compliance — exactly where a vetted buying office pays off. STWADD sources educational toys, plush, baby care and kids essentials from audited Chinese factories, with compliance screening and inspection built in.",
        "subcats": ["Educational & STEM toys", "Building blocks", "Plush toys", "DIY craft kits", "Baby care & feeding", "Kids essentials"],
        "tags": ["educational toys wholesale", "STEM toys China", "baby products", "plush toys", "kids merchandise"],
        "faqs": [
            ("Can STWADD source toys, kids & baby products from China?",
             "Yes. We source educational/STEM toys, plush, craft kits, baby care and kids essentials from audited Chinese factories, with compliance screening appropriate to the destination market."),
            ("What about toy safety standards (EN71, ASTM, CPSIA)?",
             "We screen suppliers for the relevant standards (EN71 for Europe, ASTM/CPSIA for the US, etc.) and can arrange third-party testing before production and shipment."),
            ("What is the MOQ and lead time for toys & baby products?",
             "MOQ varies widely by item; plush and basic toys can start low, licensed or complex items higher. Lead time is typically 30-45 days given safety documentation, plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for toys & baby?",
             "Yes. We handle private-label packaging, barcodes and compliant labeling (age grading, warnings) so products are retail-ready under your brand."),
        ],
    },
    {
        "slug": "home-textiles", "name": "Home Textiles & Bedding", "icon": "🛏️",
        "meta": "Source home textiles & bedding from China: towels, bed sheets, blankets, curtains. Private label, AQL 2.5 inspection, container consolidation via STWADD buying office.",
        "intro": "Soft goods are a staple of the home aisle. STWADD's buying office sources towels, bed linen, blankets, cushions and curtains from vetted Chinese textile factories, then consolidates and quality-checks every shipment.",
        "subcats": ["Towels", "Bath mats", "Bed sheets", "Pillowcases", "Blankets", "Cushions", "Curtains", "Tablecloths", "Aprons"],
        "tags": ["wholesale towels", "home textiles China", "bed linen", "kitchen textiles", "bath mats"],
        "faqs": [
            ("Can STWADD source home textiles & bedding from China?",
             "Yes. We source towels, bed sheets, blankets, cushions and curtains from vetted Chinese textile mills and consolidate them with your other categories into one container."),
            ("What is the MOQ and lead time for home textiles?",
             "Textiles often have lower MOQs (300-1,000 pieces per design/color); production lead time is typically 30-40 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for textiles?",
             "Yes. We apply your brand labels, retail packaging and barcodes, and can develop exclusive colorways and weaves for your chain."),
            ("How does STWADD ensure quality for textiles?",
             "We check fabric composition, stitching, colorfastness and AQL 2.5 appearance inspection, with third-party testing available for fiber content and safety."),
        ],
    },
    {
        "slug": "beauty-tools", "name": "Beauty & Personal-Care Tools", "icon": "💄",
        "meta": "Source beauty & personal-care tools from China: makeup brushes, jade rollers, nail tools. Private label, AQL 2.5 inspection, container consolidation via STWADD buying office.",
        "intro": "Beauty tools are high-margin, fast-moving SKUs. STWADD's buying office sources makeup brushes, jade rollers, grooming and oral-care tools from vetted Chinese suppliers, with private-label packaging and inspection built in.",
        "subcats": ["Makeup brushes", "Jade rollers & gua sha", "Facial cleansing devices", "Hair accessories", "Nail tools", "Oral-care items", "Refillable cosmetic packaging"],
        "tags": ["makeup brush set", "jade roller wholesale", "beauty tools China", "personal care products", "refillable cosmetics"],
        "faqs": [
            ("Can STWADD source beauty & personal-care tools from China?",
             "Yes. We source makeup brushes, jade rollers, hair accessories, nail tools and oral-care items from vetted suppliers and consolidate them into your container."),
            ("What is the MOQ and lead time for beauty tools?",
             "Beauty accessories often start around 300-1,000 pieces per SKU; devices with electronics are higher. Lead time is typically 30-35 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for beauty tools?",
             "Yes. We handle branded packaging, barcodes and gift-set assembly, and can develop exclusive colorways for your retail brand."),
            ("How does STWADD ensure quality for beauty tools?",
             "We run AQL 2.5 inspection on appearance and function, and for skin-contact items we verify material safety and can arrange third-party testing."),
        ],
    },
    {
        "slug": "garden-outdoor", "name": "Garden & Outdoor", "icon": "🌿",
        "meta": "Source garden & outdoor products from China: garden tools, planters, camping gear, outdoor furniture. Private label, AQL 2.5 inspection, consolidation via STWADD buying office.",
        "intro": "From spring gardening to summer outdoor living, STWADD's buying office sources garden tools, planters, camping gear and outdoor furniture from vetted Chinese factories, consolidating and inspecting every shipment.",
        "subcats": ["Garden tools", "Pruning shears", "Watering accessories", "Planters", "Outdoor furniture", "Camping & picnic gear", "Coolers"],
        "tags": ["garden tools wholesale", "camping gear China", "outdoor furniture", "planters", "picnic supplies"],
        "faqs": [
            ("Can STWADD source garden & outdoor products from China?",
             "Yes. We source garden tools, planters, outdoor furniture, camping and picnic gear from vetted Chinese suppliers and consolidate them with your other categories."),
            ("What is the MOQ and lead time for garden & outdoor?",
             "MOQ varies by item; handheld tools start around 500-1,000 pieces, furniture higher. Lead time is typically 30-45 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for garden products?",
             "Yes. We apply your brand, retail packaging and barcodes, and can build seasonal garden sets for promo planning."),
            ("How does STWADD ensure quality for outdoor products?",
             "We check material durability, weather resistance and AQL 2.5 appearance/function inspection, with photos and a downloadable report before loading."),
        ],
    },
    {
        "slug": "electronics-lighting", "name": "Electronics & Lighting", "icon": "🔌",
        "meta": "Source electronics & lighting from China: phone accessories, chargers, power banks, LED lights. Private label, AQL 2.5 inspection, consolidation via STWADD buying office.",
        "intro": "Electronics accessories are impulse and repeat buys. STWADD's buying office sources phone accessories, chargers, power banks and LED lighting from vetted Chinese factories, with certification screening and inspection built in.",
        "subcats": ["Phone cases & accessories", "Chargers & cables", "Power banks", "LED strips & bulbs", "Solar garden lights", "Smart-home devices", "Small electronics"],
        "tags": ["phone accessories wholesale", "LED lighting China", "power bank", "smart home devices", "USB-C charger"],
        "faqs": [
            ("Can STWADD source electronics & lighting from China?",
             "Yes. We source phone accessories, chargers, power banks, LED lighting and small smart-home devices from vetted suppliers and consolidate them into your container."),
            ("How do you handle electronics certifications (CE, FCC, RoHS)?",
             "We screen suppliers for the certifications required by your destination market (CE/FCC/RoHS/UKCA) and can arrange third-party testing before shipment."),
            ("What is the MOQ and lead time for electronics?",
             "Accessories often start around 500-1,000 pieces per SKU; certified electronics may require higher MOQs. Lead time is typically 30-35 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for electronics?",
             "Yes. We handle branded packaging, barcodes and retail-ready kits, and verify mark/label compliance for the destination market."),
        ],
    },
    {
        "slug": "hardware-tools", "name": "Hardware, Tools & Auto", "icon": "🔧",
        "meta": "Source hardware, tools & auto accessories from China: hand tools, tool sets, adhesives, car accessories. Private label, AQL 2.5 inspection, consolidation via STWADD buying office.",
        "intro": "The hardware aisle serves both DIY shoppers and auto owners. STWADD's buying office sources hand tools, tool sets, adhesives and car accessories from vetted Chinese factories, consolidating and inspecting every shipment.",
        "subcats": ["Hand tools", "Tape measures", "Screwdrivers", "Tool sets", "Adhesives & tapes", "Car interior & cleaning accessories"],
        "tags": ["hand tools wholesale", "tool set China", "hardware accessories", "car accessories", "adhesives"],
        "faqs": [
            ("Can STWADD source hardware, tools & auto accessories from China?",
             "Yes. We source hand tools, tool sets, measuring tools, adhesives and car accessories from vetted Chinese suppliers and consolidate them with your other categories."),
            ("What is the MOQ and lead time for hardware & tools?",
             "Tools often start around 500-1,000 pieces per SKU; sets and kits higher. Lead time is typically 30-35 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for tools & hardware?",
             "Yes. We apply your brand, retail packaging and barcodes, and can build promotional tool-kit bundles for the shelf."),
            ("How does STWADD ensure quality for hardware?",
             "We check material strength, finish and AQL 2.5 function/appearance inspection, with photos and a downloadable report before loading."),
        ],
    },
    {
        "slug": "seasonal-party", "name": "Seasonal, Party & Hygiene", "icon": "🎉",
        "meta": "Source seasonal, party & hygiene products from China: holiday decor, party supplies, disposable tableware. Private label, AQL 2.5 inspection, consolidation via STWADD buying office.",
        "intro": "Seasonal and party goods drive promo peaks. STWADD's buying office sources holiday decorations, party supplies, disposable tableware and hygiene products from vetted Chinese factories, with consolidated shipping timed to your retail calendar.",
        "subcats": ["Holiday decorations (Christmas, Halloween)", "Party supplies", "Disposable tableware", "Paper products", "Hygiene products", "Promotional & festival items"],
        "tags": ["Christmas decorations wholesale", "party supplies China", "disposable tableware", "promotional products", "hygiene products"],
        "faqs": [
            ("Can STWADD source seasonal, party & hygiene products from China?",
             "Yes. We source holiday decorations, party supplies, disposable tableware, paper products and hygiene items from vetted suppliers, planning consolidated shipments around your seasonal calendar."),
            ("How do you handle seasonal timing and lead times?",
             "We plan production and consolidated loading so goods arrive ahead of the selling window (e.g. Christmas stock shipped in summer). Lead time is typically 30-45 days plus 5-7 days consolidated loading."),
            ("Do you provide private label / OEM for seasonal & party?",
             "Yes. We apply your brand, retail packaging and barcodes, and can build festive promotional bundles and exclusive designs."),
            ("How does STWADD ensure quality for these products?",
             "We run AQL 2.5 inspection on appearance and material safety (especially for items contacting food or skin) with a downloadable report before loading."),
        ],
    },
    {
        "slug": "drinkware-bottles", "name": "Drinkware & Bottles", "icon": "🥤",
        "meta": "Drinkware & bottles supplied factory-direct by STWADD: insulated bottles, stainless steel tumblers, flasks, travel mugs. OEM/ODM, private label, AQL 2.5 — your own factory inside the buying office.",
        "intro": "Drinkware is different from every other category: STWADD makes it ourselves. As a Yongkang drinkware factory, we supply your insulated bottles, stainless steel tumblers, vacuum flasks and travel mugs directly from our own automated lines at factory-bottom price — no agent commission on these SKUs. For everything else, our buying office sources it.",
        "subcats": ["Insulated water bottles", "Stainless steel tumblers", "Vacuum flasks", "Coffee & travel mugs", "Sports & shaker bottles", "Kids bottles", "Glass & Tritan bottles", "Thermos", "Wine flasks", "Beer growlers", "Water jugs & pitchers"],
        "tags": ["insulated water bottle manufacturers", "stainless steel tumbler OEM", "vacuum flask supplier", "private label drinkware", "40oz tumbler wholesale"],
        "faqs": [
            ("Do you manufacture drinkware yourself or just source it?",
             "We manufacture it. STWADD is a drinkware factory in Yongkang, China, so your bottles, tumblers, flasks and mugs are supplied directly from our own lines at factory-direct price — no agent commission on drinkware."),
            ("Can you do OEM/ODM and private label for drinkware?",
             "Yes. We offer full OEM/ODM: custom shape, color, logo (laser/screen/UV), packaging and retail-ready barcodes, with NDA protection for your designs. MOQ starts around 500 pieces and is negotiable."),
            ("What materials and certifications do your bottles meet?",
             "We work in 304/316 stainless steel, Tritan, glass and BPA-free plastics, certified to SGS, TUV, FDA and LFGB food-contact standards with ISO 9001 quality management."),
            ("How does drinkware fit the buying-office container?",
             "Drinkware is consolidated together with the other categories our buying office sources, so your whole mixed retail order loads into one container with one inspection and one invoice."),
        ],
    },
]

def org_jsonld():
    return {
        "@type": "Organization",
        "@id": SITE + "/#organization",
        "name": "Yongkang STWADD Houseware Co., Ltd.",
        "alternateName": "STWADD",
        "url": SITE + "/",
        "logo": SITE + "/images/1724987713175-logo-150.png",
        "description": "STWADD is a drinkware factory and an AI-powered China buying office / sourcing agent for supermarket chains and retail buyers.",
        "slogan": "Drinkware Factory + AI China Buying Office for Retail Chains",
        "foundingDate": "2017",
        "address": {"@type": "PostalAddress", "streetAddress": "No. 138-1, Shifang East Road, Industrial Function Zone (Huku)", "addressLocality": "Yongkang City", "addressRegion": "Zhejiang Province", "postalCode": "321300", "addressCountry": "CN"},
        "contactPoint": {"@type": "ContactPoint", "contactType": "sourcing", "name": "BOB (Sourcing & Sales Manager)", "email": "bob@stwadd.com", "telephone": "+86-150-8822-8843", "availableLanguage": ["English", "Chinese"]},
        "certification": ["ISO 9001", "SGS", "TUV", "FDA", "LFGB", "BSCI"],
        "areaServed": "Worldwide"
    }

for c in CATS:
    slug = c["slug"]
    name = c["name"]
    url = f"{SITE}/categories/{slug}.html"
    # JSON-LD
    faq_main = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in c["faqs"]]
    graph = [
        org_jsonld(),
        {
            "@type": "Service",
            "serviceType": f"{name} Sourcing — China Buying Office",
            "provider": {"@id": SITE + "/#organization"},
            "areaServed": "Worldwide",
            "description": c["meta"]
        },
        {"@type": "FAQPage", "mainEntity": faq_main}
    ]
    jsonld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)

    sub_html = ""
    for s in c["subcats"]:
        sub_html += f'      <div class="cat-card"><h3>{html.escape(s)}</h3><p>Sourced and consolidated by STWADD\'s China buying office for retail chains.</p></div>\n'
    tag_html = "".join(f'<span>{html.escape(t)}</span>' for t in c["tags"])
    faq_html = ""
    for q, a in c["faqs"]:
        faq_html += f'    <div class="faq-item"><div class="q">{html.escape(q)}</div><div class="a">{html.escape(a)}</div></div>\n'

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(name)}: China Sourcing Agent & Private Label | STWADD</title>
<meta name="description" content="{html.escape(c['meta'])}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow">
<script type="application/ld+json">
{jsonld}
</script>
<style>
{CSS}
</style>
</head>
<body>
<header class="header">
  <a class="logo" href="../">ST<span>WADD</span></a>
  <nav class="nav">
    <a href="../">Home</a>
    <a href="../2026-catalog.html">Products</a>
    <a href="../oem-odm.html">OEM/ODM</a>
    <a href="../sourcing-agent.html" class="active">Sourcing</a>
    <a href="../about-us.html">About</a>
    <a href="../contact-us.html">Contact</a>
  </nav>
  <a class="cta" href="../contact-us.html">Inquiry Now</a>
</header>

<div class="wrap">
  <div class="crumb"><a href="../">Home</a> &rsaquo; <a href="../sourcing-agent.html">AI China Buying Office / Sourcing Agent</a> &rsaquo; <span>{html.escape(name)}</span></div>

  <section class="hero">
    <span class="tag">CHINA BUYING OFFICE</span>
    <h1 class="h1">{c['icon']} {html.escape(name)} — Sourced by STWADD</h1>
    <p class="lead">{html.escape(c['intro'])}</p>
    <div class="facts">
      <div class="fact"><b>Private Label</b> &middot; your brand on shelf</div>
      <div class="fact"><b>AQL 2.5</b> &middot; pre-shipment inspection</div>
      <div class="fact"><b>Container Consolidation</b> &middot; many suppliers, one shipment</div>
      <div class="fact"><b>3-5% Commission</b> &middot; no hidden markup</div>
    </div>
    <div class="btns">
      <a class="btn btn-primary" href="../contact-us.html">Request a Quote</a>
      <a class="btn btn-wa" href="../sourcing-agent.html">Back to Buying Office</a>
    </div>
  </section>

  <section class="section">
    <h2>What we source in {html.escape(name)}</h2>
    <p>STWADD's AI-assisted buying office matches your specs to vetted Chinese factories across the {html.escape(name.lower())} range, then consolidates and quality-checks every order. Popular subcategories:</p>
    <div class="cat-grid">
{sub_html}    </div>
    <div class="cat-tags" style="margin-top:14px">{tag_html}</div>
  </section>

  <section class="section">
    <h2>How STWADD sources {html.escape(name)} for your chain</h2>
    <ol class="steps">
      <li><b>Find &amp; vet suppliers</b> — we shortlist 5-10 vetted factories per item and verify credentials, capacity and compliance.</li>
      <li><b>RFQ &amp; quote compare</b> — our AI drafts RFQs, collects replies, and compares price, MOQ, lead time and landed cost side by side.</li>
      <li><b>Consolidate</b> — goods from multiple suppliers are received, inspected and loaded into one FCL at our warehouse.</li>
      <li><b>Inspect</b> — pre-production sample approval plus pre-shipment AQL 2.5 inspection with a downloadable report.</li>
      <li><b>Private label</b> — your logo, retail-ready boxes, barcode (UPC/EAN) placement and gift-set assembly.</li>
      <li><b>Ship</b> — we arrange ocean freight, documents (FDA/LFGB where needed) and destination-port clearance. FOB / EXW supported.</li>
    </ol>
  </section>

  <section class="section">
    <h2>Why STWADD for {html.escape(name)}</h2>
    <ul>
      <li><b>Factory + agent.</b> For drinkware we are the factory; for everything else we are your buying office — one accountable team, one container, one invoice.</li>
      <li><b>Transparent 3-5% commission.</b> Far below the 5-15% (or hidden 15-30%) typical of trading-company agents.</li>
      <li><b>Human + AI.</b> AI shortlists suppliers and compares quotes in seconds; our team still audits factories, runs AQL 2.5 inspection and owns the outcome.</li>
      <li><b>Lower landed cost.</b> Container consolidation turns many small shipments into one, cutting freight per unit.</li>
    </ul>
  </section>

  <section class="section">
    <h2>Frequently asked questions</h2>
{faq_html}  </section>

  <section class="inquiry">
    <h2>Source {html.escape(name)} for Your Chain</h2>
    <p>Send your category brief, target container size and destination port — we reply within 24h with a consolidation plan and per-unit pricing.</p>
    <a href="../contact-us.html">Contact Our Buying Office</a>
  </section>
</div>

<footer class="footer">
  <div class="cols">
    <div>
      <span class="logo">STWADD</span>
      <p>Yongkang STWADD Houseware Co., Ltd.<br>No. 138-1, Shifang East Road, Industrial Function Zone (Huku), Yongkang City, Zhejiang Province 321300, China</p>
    </div>
    <div>
      <h3>Services</h3>
      <p><a href="../oem-odm.html">OEM / ODM Factory</a><br><a href="../sourcing-agent.html">AI China Buying Office</a><br><a href="../2026-catalog.html">Catalog</a><br><a href="../all-products.html">All Products</a></p>
    </div>
    <div>
      <h3>Contact</h3>
      <p>bob@stwadd.com<br>+86-150-8822-8843<br>Yongkang, Zhejiang, China</p>
    </div>
  </div>
</footer>
</body>
</html>
"""
    with open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8") as f:
        f.write(page)
    print("wrote", slug + ".html")

print("TOTAL categories generated:", len(CATS))
