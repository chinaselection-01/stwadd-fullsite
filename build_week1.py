# -*- coding: utf-8 -*-
"""Generate Week-1 long-tail article (EN + RU) by cloning the validated
repair article template. Topic: clean stainless steel bottle with vinegar
and baking soda. Reuses the exact replacement logic of build_articles.py
(verified, already shipped) so HTML/CSS stays identical to the 20 live
articles. Strips pt/es/ar hreflang (only en+ru exist)."""
import re, os

BASE = 'a-how-to-repair-a-leaking-thermos-water-bottle.html'
OLD_SLUG = 'a-how-to-repair-a-leaking-thermos-water-bottle'
OLD_TITLE = 'How to Repair a Leaking Thermos Water Bottle'
OLD_DESC_PREFIX = 'Thermoses can develop leaks'
TODAY = '2026-10-02T08:00:00+08:00'
SITE = 'https://www.stwadd.com'

CTA_EN = '''<h2>Need a Replacement? We Manufacture Drinkware</h2>
<p>If your bottle is beyond cleaning or you want a fresh, factory-grade one, STWADD is a BSCI-certified factory producing vacuum-insulated bottles, tumblers and flasks with OEM/ODM service from 500 pcs. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> or <a href="/contact-us.html">contact our team</a> for a quote. Sourcing across multiple categories? Our <a href="/sourcing-agent.html">China buying office</a> consolidates orders into one container.</p>'''

CTA_RU = '''<h2>Нужна замена? Мы производим посуду</h2>
<p>Если бутылку не отмыть или нужна новая заводского качества, STWADD — сертифицированная по BSCI фабрика, выпускающая вакуумные бутылки, стаканы и фляги с OEM/ODM от 500 шт. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a> за расчётом. Закупаете по нескольким категориям? Наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> консолидирует заказы в один контейнер.</p>'''

ARTICLES = [
 {
  'slug': 'a-how-to-clean-stainless-steel-water-bottle-with-vinegar-and-baking-soda',
  'en': {
    'title': 'How to Clean a Stainless Steel Water Bottle with Vinegar and Baking Soda',
    'desc': 'White vinegar and baking soda are food-grade, residue-free ways to deep-clean a stainless steel bottle, removing odors, limescale and mold. Here is the step-by-step method that actually works.',
    'prose': '''<p>Over time a stainless steel bottle can develop a sour smell, chalky limescale, or even mold around the lid gasket and straw, even though the steel itself never rusts. The two cheapest, safest cleaners in your kitchen fix all three: white vinegar and baking soda. Both are food-grade, leave no toxic residue, and cost only pennies per clean.</p>
<h2>Why Vinegar and Baking Soda Work</h2>
<p>White vinegar is about 5% acetic acid. That acid dissolves mineral limescale, which is mostly calcium carbonate, and kills many odor-causing bacteria. Baking soda, or sodium bicarbonate, is a mild abrasive that lifts stains and neutralizes smells. Used in the right order, they clean the bottle without scratching the steel.</p>
<p><strong>Important:</strong> do not dump them together in equal amounts and expect a stronger clean. When mixed directly, they neutralize each other into salty water and lose most of their power. Use them in two separate steps, as shown below.</p>
<h2>What You Need</h2>
<ul>
<li>White vinegar, distilled, 5% acidity</li>
<li>Baking soda</li>
<li>Warm water</li>
<li>A bottle brush and a thin straw brush</li>
<li>A soft cloth</li>
</ul>
<h2>Step-by-Step Deep Clean</h2>
<ol>
<li><strong>Disassemble:</strong> remove the lid, the silicone gasket, and any straw. These hidden parts hold most of the odor and mold, so they need the most attention.</li>
<li><strong>Baking soda soak, deodorize:</strong> add 1-2 tablespoons of baking soda and fill with warm water. Shake, then let it sit 15-30 minutes. This lifts smells and loosens grime.</li>
<li><strong>Vinegar rinse, descale:</strong> empty the bottle, then fill halfway with white vinegar and top with water. Soak 10-15 minutes to dissolve limescale.</li>
<li><strong>Scrub:</strong> scrub the interior with a bottle brush; push the straw brush through both ends of the straw until it runs clean.</li>
<li><strong>Stubborn scale:</strong> make a baking-soda paste with a few drops of water, apply it to the scale, wait 10 minutes, then scrub. For very hard deposits, an overnight 1:1 vinegar-water soak helps.</li>
<li><strong>Rinse and dry:</strong> rinse with clean water, then place the bottle upside down on a drying rack. Let it dry completely before capping, because trapped moisture is exactly what grows mold.</li>
</ol>
<h2>Vinegar vs. Baking Soda vs. Commercial Cleaner</h2>
<ul>
<li><strong>White vinegar:</strong> best for limescale and bacteria; leaves only a mild smell that rinses away.</li>
<li><strong>Baking soda:</strong> best for odors and light stains; gentle and non-scratch.</li>
<li><strong>Commercial cleaner:</strong> faster on heavy buildup but may leave residue and costs more; avoid bleach entirely, since it can react with steel and leave toxic traces.</li>
</ul>
<h2>Habits That Prevent Odor and Mold</h2>
<ul>
<li>Rinse the bottle and lid daily.</li>
<li>Do a deep clean weekly, or immediately after sugary, protein, or dairy drinks.</li>
<li>Always store the bottle uncapped and fully dry.</li>
</ul>
<h2>When to Retire the Bottle</h2>
<p>If the interior shows pitting, deep rust spots, or the gasket is cracked and brittle, cleaning will not make it safe. Replace it. Choosing quality 316-grade steel from the start reduces this risk.</p>'''
  },
  'ru': {
    'title': 'Как очистить стальную бутылку уксусом и содой',
    'desc': 'Белый уксус и пищевая сода — пищевые, без остатков способы глубокой чистки стальной бутылки: убирают запах, накипь и плесень. Пошаговый метод, который работает.',
    'prose': '''<p>Со временем в стальной бутылке появляется кислый запах, меловая накипь или даже плесень у прокладки крышки и трубочки, хотя сама сталь не ржавеет. Два самых дешёвых и безопасных средства на вашей кухне справляются со всем: белый уксус и сода. Оба пищевые, не оставляют токсичных остатков и стоят копейки за чистку.</p>
<h2>Почему уксус и сода работают</h2>
<p>Белый уксус — это около 5% уксусной кислоты. Она растворяет минеральную накипь, которая в основном состоит из карбоната кальция, и убивает многие бактерии, вызывающие запах. Пищевая сода, или гидрокарбонат натрия, — мягкий абразив, который снимает пятна и нейтрализует запахи. В правильном порядке они чистят бутылку, не царапая сталь.</p>
<p><strong>Важно:</strong> не смешивайте их поровну в надежде на усиление. При прямом смешивании они нейтрализуют друг друга в солёную воду и теряют большую часть силы. Используйте их в два отдельных шага, как показано ниже.</p>
<h2>Что понадобится</h2>
<ul>
<li>Белый уксус, дистиллированный, 5% кислотности</li>
<li>Пищевая сода</li>
<li>Тёплая вода</li>
<li>Ёршик для бутылок и тонкий ёршик для трубочки</li>
<li>Мягкая ткань</li>
</ul>
<h2>Пошаговая глубокая чистка</h2>
<ol>
<li><strong>Разберите:</strong> снимите крышку, силиконовую прокладку и трубочку. В этих скрытых деталях живёт большая часть запаха и плесени, поэтому им нужно больше всего внимания.</li>
<li><strong>Замачивание содой, от запаха:</strong> добавьте 1-2 ст. ложки соды и наполните тёплой водой. Взболтайте и оставьте на 15-30 минут. Это снимает запахи и размягчает грязь.</li>
<li><strong>Полоскание уксусом, от накипи:</strong> опорожните бутылку, наполовину налейте белый уксус и долейте водой. Замочите на 10-15 минут, чтобы растворить накипь.</li>
<li><strong>Почистите:</strong> протрите внутреннюю стенку ёршиком; пропустите ёршик для трубочки с обеих сторон, пока он не будет чистым.</li>
<li><strong>Стойкая накипь:</strong> сделайте пасту из соды с несколькими каплями воды, нанесите на накипь, подождите 10 минут и потрите. При очень плотном налёте помогает ночное замачивание в растворе уксуса 1:1.</li>
<li><strong>Прополощите и высушите:</strong> сполосните чистой водой и поставьте бутылку вверх дном на сушилку. Дайте полностью высохнуть перед закрытием — застоявшаяся влага и есть то, что растит плесень.</li>
</ol>
<h2>Уксус против соды против магазинного средства</h2>
<ul>
<li><strong>Белый уксус:</strong> лучше всего от накипи и бактерий; оставляет лишь лёгкий запах, который смывается.</li>
<li><strong>Сода:</strong> лучше всего от запахов и лёгких пятен; мягкая и не царапает.</li>
<li><strong>Магазинное средство:</strong> быстрее на плотном налёте, но может оставлять остаток и стоит дороже; избегайте хлора полностью — он может вступить в реакцию со сталью и оставить токсичные следы.</li>
</ul>
<h2>Привычки, которые предотвращают запах и плесень</h2>
<ul>
<li>Ежедневно ополаскивайте бутылку и крышку.</li>
<li>Делайте глубокую чистку раз в неделю или сразу после сладких, белковых или молочных напитков.</li>
<li>Всегда храните бутылку открытой и полностью сухой.</li>
</ul>
<h2>Когда выбросить бутылку</h2>
<p>Если внутри видны точечная коррозия, глубокие ржавые пятна или прокладка треснула и стала хрупкой, чистка не сделает её безопасной. Замените. Выбор качественной стали марки 316 с самого начала снижает этот риск.</p>'''
  }
 },
]

base = open(BASE, encoding='utf-8').read()
os.makedirs('ru', exist_ok=True)
generated = []

for art in ARTICLES:
    slug = art['slug']
    new_slug_file = slug + '.html'
    # ---- EN ----
    h = base
    h = re.sub(r'\s*<link rel="alternate" hreflang="(?:pt|es|ar)"[^>]*>\n?', '\n', h)
    h = h.replace(OLD_SLUG, slug)
    h = h.replace(OLD_TITLE, art['en']['title'])
    h = re.sub(r'<meta name="description" content="[^"]*"', '<meta name="description" content="%s"' % art['en']['desc'], h)
    h = re.sub(r'<meta property="og:description" content="[^"]*"', '<meta property="og:description" content="%s"' % art['en']['desc'], h)
    h = re.sub(r'"description": "' + OLD_DESC_PREFIX + r'[^"]*"', '"description": "%s"' % art['en']['desc'], h)
    h = re.sub(r'("date(?:Created|Published|Modified)":\s*")[^"]*(")', r'\g<1>' + TODAY + r'\g<2>', h)
    h = re.sub(r'(<div class="unit-ai-article-detail__detail_html">).*?(</div>)',
               lambda m: m.group(1) + art['en']['prose'] + CTA_EN + '</div>', h, flags=re.S, count=1)
    with open(new_slug_file, 'w', encoding='utf-8') as f:
        f.write(h)
    generated.append((new_slug_file, 'en'))

    # ---- RU ----
    r = base
    r = re.sub(r'\s*<link rel="alternate" hreflang="(?:pt|es|ar)"[^>]*>\n?', '\n', r)
    r = r.replace(OLD_SLUG, slug)
    r = r.replace(OLD_TITLE, art['ru']['title'])
    r = r.replace('<html data-app-version="1.5.11" lang="en">', '<html data-app-version="1.5.11" lang="ru">')
    r = re.sub(r'<meta name="description" content="[^"]*"', '<meta name="description" content="%s"' % art['ru']['desc'], r)
    r = re.sub(r'<meta property="og:description" content="[^"]*"', '<meta property="og:description" content="%s"' % art['ru']['desc'], r)
    r = re.sub(r'"description": "' + OLD_DESC_PREFIX + r'[^"]*"', '"description": "%s"' % art['ru']['desc'], r)
    r = re.sub(r'("date(?:Created|Published|Modified)":\s*")[^"]*(")', r'\g<1>' + TODAY + r'\g<2>', r)
    r = re.sub(r'(<div class="unit-ai-article-detail__detail_html">).*?(</div>)',
               lambda m: m.group(1) + art['ru']['prose'] + CTA_RU + '</div>', r, flags=re.S, count=1)
    ru_path = os.path.join('ru', new_slug_file)
    with open(ru_path, 'w', encoding='utf-8') as f:
        f.write(r)
    generated.append((ru_path, 'ru'))

print('generated', len(generated), 'files')
for p, lang in generated:
    print(lang, p)

# ---- sitemap ----
sm = open('sitemap.xml', encoding='utf-8').read()
existing = set(re.findall(r'<loc>(.*?)</loc>', sm))
for art in ARTICLES:
    sm = re.sub(r'<url>\s*<loc>[^<]*' + re.escape(art['slug']) + r'[^<]*</loc>.*?</url>\s*', '', sm, flags=re.S)
new_urls = []
for art in ARTICLES:
    full = art['slug']
    for lang, path in (('', full + '.html'), ('ru/', 'ru/' + full + '.html')):
        loc = '%s/%s%s' % (SITE, lang, full + '.html')
        if loc in existing:
            continue
        new_urls.append(
            '  <url>\n    <loc>%s</loc>\n    <lastmod>2026-10-02</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>' % loc)
if new_urls:
    idx = sm.rfind('</urlset>')
    sm = sm[:idx] + '\n'.join(new_urls) + '\n' + sm[idx:]
    open('sitemap.xml', 'w', encoding='utf-8').write(sm)
print('sitemap added', len(new_urls), 'urls; total now', sm.count('<loc>'))
