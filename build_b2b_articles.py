# -*- coding: utf-8 -*-
"""Generate the 2 B2B bridge articles (week 6 & 7 of the 8-week calendar):
EN + RU each = 4 files. Clone the validated repair template, replace
title/slug/meta/JSON-LD/body prose/dates, strip pt/es/ar hreflang."""
import re, os

BASE = 'a-how-to-repair-a-leaking-thermos-water-bottle.html'
OLD_SLUG = 'a-how-to-repair-a-leaking-thermos-water-bottle'
OLD_TITLE = 'How to Repair a Leaking Thermos Water Bottle'
OLD_DESC_PREFIX = 'Thermoses can develop leaks'
TODAY = '2026-10-01T08:00:00+08:00'
SITE = 'https://www.stwadd.com'
LASTMOD = '2026-10-01'

CTA_EN = '''<h2>Need a Manufacturing Partner, Not Just an Article?</h2>
<p>STWADD is both a BSCI-certified drinkware factory and a China buying office. We run OEM/ODM tumblers and bottles from 500 pcs in 304/316 steel, with FDA/LFGB/BSCI documentation and FTO-aware design. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a>, <a href="/contact-us.html">request a quote</a>, or ask our <a href="/sourcing-agent.html">China buying office</a> to consolidate drinkware with other houseware into one container.</p>'''

CTA_RU = '''<h2>Нужен производственный партнёр, а не просто статья?</h2>
<p>STWADD — это и сертифицированная по BSCI фабрика посуды, и закупочный офис в Китае. Мы делаем OEM/ODM тумблеры и бутылки от 500 шт из стали 304/316 с документами FDA/LFGB/BSCI и дизайном с учётом FTO. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a>, <a href="/ru/contact-us.html">запросите расчёт</a> или попросите наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> объединить посуду с другой продукцией в один контейнер.</p>'''

ARTICLES = [
 {
  'slug': 'what-does-double-wall-vacuum-insulated-mean',
  'en': {
    'title': 'What Does Double-Wall Vacuum Insulated Mean? (Buyer Guide)',
    'desc': 'Double-wall vacuum insulated means two steel walls with the air pumped out between them, stopping heat transfer. Learn how it works and what to check when sourcing drinkware.',
    'prose': '''<p>When a product description says "double-wall vacuum insulated," it is describing the core technology that keeps drinks hot for 6-12 hours or cold for up to 24. Understanding what the phrase actually means helps both everyday buyers and retailers choosing products to stock.</p>
<h2>What "Double-Wall" Means</h2>
<p>A double-wall bottle has two layers of stainless steel - an inner wall that touches your drink and an outer wall you hold. Between them is a narrow gap. In a single-wall bottle that gap does not exist, so heat moves straight from the liquid to your hand and to the outside air.</p>
<h2>What "Vacuum Insulated" Means</h2>
<p>After the two walls are formed, the air is pumped out of the gap between them, creating a near-perfect vacuum. Heat travels three ways: conduction (through solids), convection (through moving air or liquid), and radiation (infrared waves). With no air in the gap, conduction and convection nearly stop. A thin layer of copper or aluminium plating on the inner wall reflects radiant heat back, slowing the last path. The result: the drink stays at its temperature and the outside stays safe to touch.</p>
<h2>Double-Wall vs. Single-Wall vs. Foam</h2>
<ul>
<li><strong>Single-wall:</strong> cheap, light, but sweats with cold drinks and offers almost no temperature retention.</li>
<li><strong>Foam-insulated:</strong> used in coolers; bulky and lower performance than vacuum.</li>
<li><strong>Double-wall vacuum:</strong> the standard for premium drinkware; no sweat, long retention, higher cost.</li>
</ul>
<h2>What to Check When Sourcing</h2>
<p>If you are buying for a retail line or private label, vacuum quality is the difference between a product customers keep and one they return. Key checks:</p>
<ol>
<li><strong>Steel grade:</strong> 304 (18/8) is the baseline; 316 adds corrosion resistance for acidic drinks.</li>
<li><strong>Copper plating:</strong> ask whether the vacuum layer is copper-coated - it improves retention measurably.</li>
<li><strong>Lid seal:</strong> a poor gasket ruins an otherwise good bottle.</li>
<li><strong>Vacuum warranty:</strong> reputable factories test every unit for vacuum loss before shipping.</li>
</ol>
<h2>How Performance Is Measured</h2>
<p>Manufacturers test retention by filling the bottle with water at a set temperature (often 95 C hot or 4 C cold), sealing it, and measuring the temperature after 6 and 12 hours. A 500 ml vacuum bottle typically keeps drinks above 65 C at 6 hours and above 40 C at 12 hours. Cold retention is usually longer - ice water can stay cold for 24 hours. When comparing suppliers, ask for the actual test data, not just a marketing claim.</p>
<h2>Common Questions</h2>
<ul>
<li><strong>Does double-wall mean it is vacuum insulated?</strong> Not always - some double-wall bottles use air, not vacuum. "Vacuum insulated" is the specific claim to look for.</li>
<li><strong>Why is my vacuum bottle still sweating?</strong> If a vacuum bottle sweats with cold liquid, its vacuum has likely failed; a healthy one should not.</li>
<li><strong>Is copper plating necessary?</strong> It helps retention but is not essential; good 304 steel with a true vacuum already performs well.</li>
</ul>
<h2>For Buyers and Brands</h2>
<p>Specifying the right insulation is only part of sourcing drinkware at scale. You also need consistent steel, certified food-contact materials, and a supplier that handles tooling, coating, and QC. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> to see what we manufacture, or talk to our <a href="/sourcing-agent.html">China buying office</a> if you need to consolidate drinkware with other houseware categories into one shipment.</p>'''
  },
  'ru': {
    'title': 'Что значит двустенная вакуумная изоляция? (Гид закупщика)',
    'desc': 'Двустенная вакуумная изоляция — две стальные стенки с откачанным между ними воздухом, останавливающим передачу тепла. Узнайте, как это работает и на что смотреть при закупке посуды.',
    'prose': '''<p>Когда в описании товара указано «двустенная вакуумная изоляция», речь идёт о ключевой технологии, которая держит напиток горячим 6-12 часов или холодным до 24 часов. Понимание этого термина помогает и обычным покупателям, и ритейлерам, выбирающим товар для продажи.</p>
<h2>Что значит «двустенная»</h2>
<p>Двустенная бутылка состоит из двух слоёв нержавеющей стали - внутренней стенки, контактирующей с напитком, и внешней, которую вы держите. Между ними узкий зазор. В одностенной бутылке этого зазора нет, поэтому тепло сразу переходит от жидкости к руке и наружному воздуху.</p>
<h2>Что значит «вакуумная изоляция»</h2>
<p>После формовки двух стенок воздух из зазора откачивается, создавая почти идеальный вакуум. Тепло передаётся тремя способами: теплопроводностью (через твёрдое), конвекцией (через движущийся воздух) и излучением. Без воздуха в зазоре теплопроводность и конвекция почти прекращаются. Тонкий слой меди или алюминия на внутренней стенке отражает тепловое излучение, замедляя последний путь. Итог: напиток сохраняет температуру, а корпус остаётся безопасным на ощупь.</p>
<h2>Двустенная против одностенной и пенной</h2>
<ul>
<li><strong>Одностенная:</strong> дёшево и легко, но потеет с холодным и почти не держит температуру.</li>
<li><strong>Пенная изоляция:</strong> в холодильниках-термосах; громоздко и слабее вакуума.</li>
<li><strong>Двустенная вакуумная:</strong> стандарт премиум-посуды; без пота, долго держит, дороже.</li>
</ul>
<h2>На что смотреть при закупке</h2>
<p>Если вы закупаете товарную линию или приватный лейбл, качество вакуума - это разница между товаром, который клиент оставит, и тем, что вернёт. Ключевые проверки:</p>
<ol>
<li><strong>Марка стали:</strong> 304 (18/8) - база; 316 добавляет стойкость к кислым напиткам.</li>
<li><strong>Медное напыление:</strong> уточните, покрыт ли вакуумный слой медью - это заметно улучшает удержание.</li>
<li><strong>Уплотнитель крышки:</strong> плохая прокладка портит даже хорошую бутылку.</li>
<li><strong>Гарантия вакуума:</strong> надёжные фабрики проверяют каждую единицу на потерю вакуума до отгрузки.</li>
</ol>
<h2>Как измеряют эффективность</h2>
<p>Производители проверяют удержание, наполняя бутылку водой заданной температуры (часто 95 C горячей или 4 C холодной), закрывая и измеряя через 6 и 12 часов. 500 мл вакуумная бутылка обычно держит выше 65 C через 6 часов и выше 40 C через 12. Холод держится дольше - ледяная вода может оставаться холодной 24 часа. При сравнении поставщиков запрашивайте реальные данные тестов, а не только маркетинг.</p>
<h2>Частые вопросы</h2>
<ul>
<li><strong>Значит ли «двустенная», что она вакуумная?</strong> Не всегда - некоторые двустенные бутылки используют воздух, а не вакуум. Ищите именно «вакуумная изоляция».</li>
<li><strong>Почему моя вакуумная бутылка потеет?</strong> Если вакуумная бутылка потеет с холодным напитком, скорее всего, вакуум нарушен; здоровая не должна.</li>
<li><strong>Обязательно ли медное напыление?</strong> Оно помогает, но не обязательно; хорошая сталь 304 с настоящим вакуумом уже работает достойно.</li>
</ul>
<h2>Для закупщиков и брендов</h2>
<p>Правильная изоляция - лишь часть закупки посуды в масштабе. Нужна стабильная сталь, сертифицированные материалы контакта с пищей и поставщик, который берёт на себя оснастку, покрытие и контроль качества. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a>, чтобы увидеть, что мы производим, или свяжитесь с нашим <a href="/ru/sourcing-agent.html">закупочным офисом в Китае</a>, если нужно объединить посуду с другими категориями товаров в одну поставку.</p>'''
  }
 },
 {
  'slug': 'how-to-choose-a-custom-tumbler-manufacturer-in-china',
  'en': {
    'title': 'How to Choose a Custom Tumbler Manufacturer in China (OEM Guide)',
    'desc': 'A practical checklist for sourcing custom tumblers from China: verify the factory, set MOQ and tooling, specify steel grade, secure FDA/LFGB certifications, clear patents (FTO), and control quality with AQL.',
    'prose': '''<p>China produces the majority of the world's insulated drinkware, from basic steel bottles to Stanley-style tumblers. If you want custom tumblers with your brand, choosing the right manufacturer matters more than the unit price. A cheap supplier that ships defective lids or infringes a patent can cost far more than the savings.</p>
<h2>1. Factory or Trading Company?</h2>
<p>Work with a verified factory when possible. Ask for a business license, factory photos, and a live video walkthrough. A buying office or agent can audit a factory on your behalf if you are not on the ground. Either way, confirm they actually make the product rather than reselling another plant's goods.</p>
<h2>2. MOQ and Tooling</h2>
<p>For stock shapes with your logo, MOQ often starts around 500-1,000 pieces. Fully custom shapes need new tooling (molds), which can run from a few hundred to several thousand dollars and add 2-4 weeks. Clarify whether tooling is a one-time fee you own or a per-order charge.</p>
<h2>3. Materials and Steel Grade</h2>
<p>Specify 304 (18/8) stainless as a minimum; choose 316 for premium or acidic-drink lines. Lids should be BPA-free. Request material certificates so you can prove compliance to your own customers and regulators.</p>
<h2>4. Certifications</h2>
<p>For the US and EU, expect FDA (US), LFGB (Germany), and BPA-free declarations. California Prop 65 compliance matters for the US market. Social audits such as BSCI or Sedex reassure retailers. Ask for current, dated certificates - not expired ones.</p>
<h2>5. Patent and FTO Clearance</h2>
<p>This is the trap most new brands miss. Stanley-, Owala- and Hydro Flask-style shapes carry active design and utility patents. Copying a protected silhouette can get your shipment seized or trigger a lawsuit. Request a Freedom-to-Operate (FTO) opinion and design around protected features. A good factory will help you create a patent-safe shape rather than copy a bestseller.</p>
<h2>6. Customization Depth</h2>
<p>Decide what "custom" means for you: powder-coat color, laser engraving, printed logo, gift box, or a fully new mold. Each adds cost and lead time. Sample approval before mass production is non-negotiable.</p>
<h2>7. Quality Control and AQL</h2>
<p>Agree on an AQL (Acceptable Quality Limit) level - AQL 2.5 is common for drinkware. Use a third-party inspection at the factory before container loading so defects are caught in China, not after delivery to your warehouse.</p>
<h2>8. Logistics and Incoterms</h2>
<p>Understand whether your quote is EXW, FOB, or DDP. DDP including Amazon FBA prep saves you a handoff. Confirm container consolidation if you are mixing tumblers with other houseware.</p>
<h2>Why STWADD</h2>
<p>STWADD is both a drinkware factory and a China buying office. We run OEM/ODM tumblers from 500 pcs with 304/316 steel, FDA/LFGB/BSCI documentation, and FTO-aware design. If you source across categories, our <a href="/sourcing-agent.html">buying office</a> consolidates everything into one container. <a href="/contact-us.html">Contact us</a> for a quote, or <a href="/categories/drinkware-bottles.html">browse our drinkware categories</a> first.</p>
<h2>Quick FAQ</h2>
<ul>
<li><strong>What is a realistic MOQ for custom tumblers?</strong> 500-1,000 pcs for logo-only; higher for new molds.</li>
<li><strong>How long does production take?</strong> 25-40 days after sample approval, plus shipping.</li>
<li><strong>Can a small brand avoid patent problems?</strong> Yes - design around protected shapes and get an FTO check before tooling.</li>
</ul>'''
  },
  'ru': {
    'title': 'Как выбрать производителя кастомных тумблеров в Китае (гид по OEM)',
    'desc': 'Практический чек-лист закупки кастомных тумблеров в Китае: проверка фабрики, MOQ и оснастка, марка стали, сертификаты FDA/LFGB, патенты (FTO) и контроль качества по AQL.',
    'prose': '''<p>Китай производит большую часть изолированной посуды мира - от простых стальных бутылок до тумблеров в стиле Stanley. Если вы хотите тумблеры с вашим брендом, выбор правильного производителя важнее цены за штуку. Дешёвый поставщик с бракованными крышками или нарушением патента обойдётся дороже, чем экономия.</p>
<h2>1. Фабрика или торговая компания?</h2>
<p>Работайте с проверенной фабрикой, когда это возможно. Запросите бизнес-лицензию, фото цеха и видео-тур в прямом эфире. Закупочный офис или агент может провести аудит фабрики за вас, если вас нет на месте. В любом случае убедитесь, что они действительно производят товар, а не перепродают чужой.</p>
<h2>2. MOQ и оснастка</h2>
<p>Для стандартных форм с вашим логотипом MOQ часто начинается с 500-1 000 штук. Полностью кастомные формы требуют новых пресс-форм, что может стоить от нескольких сотен до нескольких тысяч долларов и добавить 2-4 недели. Уточните, является ли оснастка разовым платежом, которым вы владеете, или списанием за заказ.</p>
<h2>3. Материалы и марка стали</h2>
<p>Укажите сталь 304 (18/8) как минимум; выбирайте 316 для премиум-линий или кислых напитков. Крышки должны быть без BPA. Запрашивайте сертификаты материалов, чтобы подтвердить соответствие своим клиентам и регуляторам.</p>
<h2>4. Сертификация</h2>
<p>Для США и ЕС ожидайте FDA (США), LFGB (Германия) и декларации без BPA. Соответствие California Prop 65 важно для рынка США. Социальные аудиты вроде BSCI или Sedex успокаивают ритейлеров. Запрашивайте актуальные датированные сертификаты, а не просроченные.</p>
<h2>5. Патент и FTO</h2>
<p>Это ловушка, которую упускают большинство новых брендов. Формы в стиле Stanley, Owala и Hydro Flask несут активные патенты на дизайн и полезные патенты. Копирование защищённого силуэта может привести к задержке партии или иску. Запросите заключение FTO (Freedom-to-Operate) и обойдите защищённые элементы. Хорошая фабрика поможет создать форму, не нарушающую патенты, вместо копирования хита.</p>
<h2>6. Глубина кастомизации</h2>
<p>Решите, что «кастом» значит для вас: порошковая окраска, лазерная гравировка, печатный логотип, подарочная коробка или полностью новая пресс-форма. Каждое добавляет стоимость и срок. Утверждение образца до серии обязательно.</p>
<h2>7. Контроль качества и AQL</h2>
<p>Договоритесь об уровне AQL (Acceptable Quality Limit) - AQL 2.5 типичен для посуды. Используйте стороннюю инспекцию на фабрике до погрузки контейнера, чтобы брак нашли в Китае, а не после доставки на ваш склад.</p>
<h2>8. Логистика и Incoterms</h2>
<p>Понимайте, что ваша цена - EXW, FOB или DDP. DDP с подготовкой к Amazon FBA экономит промежуточное звено. Уточните консолидацию контейнера, если смешиваете тумблеры с другой посудой.</p>
<h2>Почему STWADD</h2>
<p>STWADD - это одновременно фабрика посуды и закупочный офис в Китае. Мы делаем OEM/ODM тумблеры от 500 шт из стали 304/316 с документами FDA/LFGB/BSCI и дизайном с учётом FTO. Если закупаете по нескольким категориям, наш <a href="/ru/sourcing-agent.html">закупочный офис</a> объединяет всё в один контейнер. <a href="/ru/contact-us.html">Свяжитесь с нами</a> за расчётом или сначала <a href="/categories/drinkware-bottles.html">смотрите наши категории посуды</a>.</p>
<h2>Быстрые вопросы</h2>
<ul>
<li><strong>Какой реальный MOQ для кастомных тумблеров?</strong> 500-1 000 шт для логотипа; выше для новых форм.</li>
<li><strong>Сколько длится производство?</strong> 25-40 дней после утверждения образца плюс доставка.</li>
<li><strong>Может ли малый бренд избежать патентных проблем?</strong> Да - обойдите защищённые формы и сделайте FTO-проверку до оснастки.</li>
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
