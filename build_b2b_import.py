# -*- coding: utf-8 -*-
"""Generate 1 new B2B bridge article: how to import custom water bottles from China.
EN + RU = 2 files. Clone validated repair template, replace
title/slug/meta/JSON-LD/body, strip pt/es/ar hreflang, update sitemap."""
import re, os

BASE = 'a-how-to-repair-a-leaking-thermos-water-bottle.html'
OLD_SLUG = 'a-how-to-repair-a-leaking-thermos-water-bottle'
OLD_TITLE = 'How to Repair a Leaking Thermos Water Bottle'
OLD_DESC_PREFIX = 'Thermoses can develop leaks'
TODAY = '2026-10-05T10:00:00+08:00'
SITE = 'https://www.stwadd.com'
LASTMOD = '2026-10-05'

CTA_EN = '''<h2>One Supplier or a Buying Office? We Do Both</h2>
<p>STWADD is both a BSCI-certified drinkware factory and a China buying office. If you only need custom bottles, we run OEM/ODM from 500 pcs in 304/316 steel with FDA/LFGB/BSCI documentation and FTO-aware design. If you are sourcing bottles plus other houseware, our <a href="/sourcing-agent.html">China buying office</a> audits factories, consolidates goods into one container, and handles AQL inspection before loading. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> or <a href="/contact-us.html">request a quote</a>.</p>'''

CTA_RU = '''<h2>Один поставщик или закупочный офис? Мы делаем и то, и другое</h2>
<p>STWADD — это одновременно сертифицированная по BSCI фабрика посуды и закупочный офис в Китае. Если нужны только кастомные бутылки, мы делаем OEM/ODM от 500 шт из стали 304/316 с документами FDA/LFGB/BSCI и дизайном с учётом FTO. Если закупаете бутылки вместе с другой посудой, наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> проводит аудит фабрик, объединяет товары в один контейнер и контролирует качество по AQL до погрузки. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или <a href="/ru/contact-us.html">запросите расчёт</a>.</p>'''

ARTICLES = [
 {
  'slug': 'how-to-import-custom-water-bottles-from-china',
  'en': {
    'title': 'How to Import Custom Water Bottles from China (Buyer Guide)',
    'desc': 'A step-by-step buyer guide to importing custom water bottles from China: define specs, vet factories, set MOQ and tooling, secure FDA/LFGB certifications, clear patents, control quality with AQL, and ship.',
    'prose': '''<p>China makes the majority of the world's insulated and stainless drinkware. For a brand, retailer, or promotional buyer, importing custom water bottles from China is the fastest way to launch a private-label line at a workable cost. This guide walks the whole process so you can avoid the mistakes that sink first-time importers.</p>
<h2>1. Define Your Product Specification</h2>
<p>Before contacting anyone, lock the basics in writing: capacity (350-1000 ml), steel grade (304 as baseline, 316 for premium or acidic drinks), insulation (single-wall, foam, or double-wall vacuum), lid type, and decoration (laser engraving, screen print, UV, powder coat). A clear spec is what lets factories quote accurately and keeps your sample on target.</p>
<h2>2. Find and Vet Suppliers</h2>
<p>Work with a verified factory where possible. Ask for a business license, export record, factory photos, and a live video walkthrough. Tools like shipment databases can confirm a plant actually exports to known brands. If you are not on the ground, a China buying office or sourcing agent can audit the factory on your behalf. Confirm they make the product rather than resell another plant's goods.</p>
<h2>3. Understand MOQ and Tooling</h2>
<p>For stock shapes with your logo, MOQ typically starts around 500-1,000 pieces. A realistic 2026 FOB Guangzhou picture: a 20oz double-wall vacuum tumbler runs about USD 4.1-6.2 per unit at 500-1,000 pcs, dropping toward USD 4.1 at 3,000 pcs. Fully custom shapes need new tooling (often USD 1,500-3,000 per part) and higher minimums. Clarify whether tooling is a one-time fee you own.</p>
<h2>4. Secure the Right Certifications</h2>
<p>For the US and EU, expect FDA (US), LFGB (Germany), and BPA-free declarations, plus a California Prop 65 statement for the US market. REACH SVHC declarations matter for European distributors. Social audits such as BSCI or Sedex reassure retailers. Request current, dated certificates - not expired ones.</p>
<h2>5. Order and Approve Samples</h2>
<p>Never place a bulk order without testing samples. Check leak resistance, lid function, coating durability, odor, and heat retention with hot and cold water. Approve a physical pre-production sample in every colourway before mass production begins.</p>
<h2>6. Clear Patents (FTO)</h2>
<p>This is the trap most new brands miss. Stanley-, Owala- and Hydro Flask-style silhouettes carry active design and utility patents. Copying a protected shape can get your shipment seized or trigger a lawsuit. Request a Freedom-to-Operate opinion and design around protected features. A good factory helps you create a patent-safe shape instead of cloning a bestseller.</p>
<h2>7. Control Quality with AQL</h2>
<p>Agree on an AQL (Acceptable Quality Limit) level - AQL 2.5 is common for drinkware. Use a third-party inspection at the factory before container loading so defects are caught in China, not after delivery to your warehouse. Carton drop tests and leak checks should be part of the inspection.</p>
<h2>8. Logistics and Incoterms</h2>
<p>Know whether your quote is EXW, FOB, or DDP. DDP including Amazon FBA prep saves a handoff. Confirm HS codes so customs duties are correct - vacuum and non-vacuum bottles can fall under different tariff lines. If you mix bottles with other houseware, container consolidation lowers cost per unit.</p>
<h2>Quick FAQ</h2>
<ul>
<li><strong>What is a realistic MOQ for custom water bottles?</strong> 500-1,000 pcs for logo-only on stock moulds; higher for new tooling.</li>
<li><strong>How long does production take?</strong> About 25-40 days after sample approval, plus ocean transit of 25-45 days depending on destination.</li>
<li><strong>Can a small brand avoid patent problems?</strong> Yes - design around protected shapes and get an FTO check before tooling.</li>
<li><strong>Is a sourcing agent worth it?</strong> If you buy across categories, an agent's consolidation and factory audit often save more than their commission costs.</li>
</ul>'''
  },
  'ru': {
    'title': 'Как импортировать кастомные бутылки из Китая (гид закупщика)',
    'desc': 'Пошаговый гид по импорту кастомных бутылок из Китая: спецификация, проверка фабрик, MOQ и оснастка, сертификаты FDA/LFGB, патенты, контроль качества по AQL и доставка.',
    'prose': '''<p>Китай производит большую часть изолированной и нержавеющей посуды мира. Для бренда, ритейлера или промо-закупщика импорт кастомных бутылок из Китая - самый быстрый способ запустить приватный лейбл по приемлемой цене. Этот гид описывает весь процесс, чтобы вы не повторили ошибок, топящих начинающих импортёров.</p>
<h2>1. Определите спецификацию товара</h2>
<p>До обращения к поставщикам зафиксируйте письменно базу: объём (350-1000 мл), марку стали (304 как минимум, 316 для премиум- или кислых напитков), тип изоляции (одностенная, пенная или двустенная вакуумная), тип крышки и декор (лазерная гравировка, шёлкография, УФ, порошковая окраска). Чёткая спецификация даёт фабрикам точную смету и держит образец в цели.</p>
<h2>2. Найдите и проверьте поставщиков</h2>
<p>Работайте с проверенной фабрикой, где возможно. Запросите бизнес-лицензию, историю экспорта, фото цеха и видео-тур в прямом эфире. Базы данных отгрузок могут подтвердить, что завод реально экспортирует известным брендам. Если вас нет на месте, закупочный офис или агент в Китае проведёт аудит фабрики за вас. Убедитесь, что они производят товар, а не перепродают чужой.</p>
<h2>3. Поймите MOQ и оснастку</h2>
<p>Для стандартных форм с вашим логотипом MOQ обычно начинается с 500-1 000 штук. Реалистичная картина FOB Гуанчжоу-2026: 20-унцевый двустенный вакуумный тумблер стоит около 4,1-6,2 USD за штуку при 500-1 000 шт, снижаясь к 4,1 USD при 3 000 шт. Полностью кастомные формы требуют новых пресс-форм (часто 1 500-3 000 USD за деталь) и больших минимумов. Уточните, является ли оснастка разовым платежом, которым вы владеете.</p>
<h2>4. Получите нужные сертификаты</h2>
<p>Для США и ЕС ожидайте FDA (США), LFGB (Германия) и декларации без BPA, а также заявление California Prop 65 для рынка США. Декларации REACH SVHC важны для европейских дистрибьюторов. Социальные аудиты вроде BSCI или Sedex успокаивают ритейлеров. Запрашивайте актуальные датированные сертификаты, а не просроченные.</p>
<h2>5. Закажите и утвердите образцы</h2>
<p>Никогда не размещайте серийный заказ без теста образцов. Проверьте сопротивление протечке, работу крышки, стойкость покрытия, запах и удержание температуры горячей и холодной водой. Утвердите физический предсерийный образец в каждом цвете до начала массового производства.</p>
<h2>6. Проверьте патенты (FTO)</h2>
<p>Это ловушка, которую упускают большинство новых брендов. Формы в стиле Stanley, Owala и Hydro Flask несут активные патенты на дизайн и полезные патенты. Копирование защищённого силуэта может привести к задержке партии или иску. Запросите заключение FTO (Freedom-to-Operate) и обойдите защищённые элементы. Хорошая фабрика поможет создать форму без нарушения патентов вместо клонирования хита.</p>
<h2>7. Контроль качества по AQL</h2>
<p>Договоритесь об уровне AQL (Acceptable Quality Limit) - AQL 2.5 типичен для посуды. Используйте стороннюю инспекцию на фабрике до погрузки контейнера, чтобы брак нашли в Китае, а не после доставки на склад. Тесты на падение коробок и проверка протечек должны входить в инспекцию.</p>
<h2>8. Логистика и Incoterms</h2>
<p>Понимайте, что ваша цена - EXW, FOB или DDP. DDP с подготовкой к Amazon FBA экономит промежуточное звено. Уточните HS-коды, чтобы таможенные пошлины были верными - вакуумные и невакуумные бутылки могут попадать под разные тарифные линии. Если смешиваете бутылки с другой посудой, консолидация контейнера снижает стоимость за единицу.</p>
<h2>Быстрые вопросы</h2>
<ul>
<li><strong>Какой реальный MOQ для кастомных бутылок?</strong> 500-1 000 шт для логотипа на стандартных формах; выше для новой оснастки.</li>
<li><strong>Сколько длится производство?</strong> Около 25-40 дней после утверждения образца плюс морской транзит 25-45 дней в зависимости от назначения.</li>
<li><strong>Может ли малый бренд избежать патентных проблем?</strong> Да - обойдите защищённые формы и сделайте FTO-проверку до оснастки.</li>
<li><strong>Стоит ли агент по закупкам?</strong> Если закупаете по нескольким категориям, консолидация и аудит агента часто экономят больше, чем стоит его комиссия.</li>
</ul>'''
  }
 },
]

base = open(BASE, encoding='utf-8').read()
os.makedirs('ru', exist_ok=True)
generated = []

for art in ARTICLES:
    slug = 'a-' + art['slug']
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
    full = 'a-' + art['slug']
    for lang, path in (('', full + '.html'), ('ru/', 'ru/' + full + '.html')):
        loc = '%s/%s%s' % (SITE, lang, full + '.html')
        if loc in existing:
            continue
        new_urls.append(
            '  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>' % (loc, LASTMOD))
if new_urls:
    idx = sm.rfind('</urlset>')
    sm = sm[:idx] + '\n'.join(new_urls) + '\n' + sm[idx:]
    open('sitemap.xml', 'w', encoding='utf-8').write(sm)
print('sitemap added', len(new_urls), 'urls; total now', sm.count('<loc>'))
