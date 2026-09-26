# -*- coding: utf-8 -*-
"""Generate 10 long-tail care/repair articles (EN + RU) by cloning the
validated repair article template, replacing title / slug / meta / JSON-LD /
body prose / dates, and stripping pt/es/ar hreflang (only en+ru exist)."""
import re, os, datetime

BASE = 'a-how-to-repair-a-leaking-thermos-water-bottle.html'
OLD_SLUG = 'a-how-to-repair-a-leaking-thermos-water-bottle'
OLD_TITLE = 'How to Repair a Leaking Thermos Water Bottle'
OLD_DESC_PREFIX = 'Thermoses can develop leaks'
TODAY = '2026-09-27T08:00:00+08:00'
SITE = 'https://www.stwadd.com'

CTA_EN = '''<h2>Need a Replacement? We Manufacture Drinkware</h2>
<p>If your bottle is beyond repair, STWADD is a BSCI-certified factory producing vacuum-insulated bottles, tumblers and flasks with OEM/ODM service from 500 pcs. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> or <a href="/contact-us.html">contact our team</a> for a quote. Sourcing across multiple categories? Our <a href="/sourcing-agent.html">China buying office</a> consolidates orders into one container.</p>'''

CTA_RU = '''<h2>Нужна замена? Мы производим посуду</h2>
<p>Если ваша бутылка не подлежит ремонту, STWADD — сертифицированная по BSCI фабрика, выпускающая вакуумные бутылки, стаканы и фляги с OEM/ODM от 500 шт. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a> за расчётом. Закупаете по нескольким категориям? Наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> консолидирует заказы в один контейнер.</p>'''

ARTICLES = [
 {
  'slug': 'why-does-my-thermos-stop-keeping-heat',
  'en': {
    'title': 'Why Does My Thermos Stop Keeping Heat? (Lost Vacuum Explained)',
    'desc': 'A thermos that no longer keeps drinks hot usually means the vacuum insulation has failed. Learn the causes, how to test it, and when replacement beats repair.',
    'prose': '''<p>A vacuum-insulated thermos is designed to keep drinks hot for 6-12 hours, sometimes longer. When that performance suddenly drops - your coffee is lukewarm after two hours - the most common cause is a failed vacuum seal. Here is how to understand, test, and respond to the problem.</p>
<h2>How Vacuum Insulation Works</h2>
<p>A double-wall thermos has the air sucked out from the space between the walls, creating a vacuum. Because there is almost no matter between the walls, heat cannot travel by conduction or convection. The only heat loss is through the neck and lid, which is why a good thermos stays hot for hours.</p>
<h2>Signs Your Vacuum Has Failed</h2>
<ul>
<li><strong>Exterior feels warm or hot</strong> when the inside is hot - heat is escaping through the wall.</li>
<li><strong>Condensation or sweating</strong> on the outside of a hot-fill bottle.</li>
<li><strong>A loose rattling sound</strong> inside, as if something broke loose between the walls.</li>
<li><strong>Drinks cool within an hour</strong> instead of several hours.</li>
</ul>
<h2>Common Causes</h2>
<p>Most failures come from a hard drop that cracks the inner wall, long-term fatigue of older units, or a manufacturing defect in budget models. Once the vacuum is lost, the bottle behaves like a single-wall container.</p>
<h2>How to Test It</h2>
<p>Fill the thermos with boiling water, seal it, and wait five minutes. Touch the exterior. If it is warm to the touch, the vacuum has failed. A healthy bottle stays room temperature on the outside.</p>
<h2>Can It Be Repaired?</h2>
<p>In practice, no. The vacuum is created at the factory and cannot be re-established at home. Consumer-grade bottles are not serviceable. The practical fix is replacement.</p>
<p>If you go through bottles often, it pays to buy from a manufacturer that controls quality. <a href="/categories/drinkware-bottles.html">Compare our drinkware categories</a> or talk to our <a href="/sourcing-agent.html">China buying office</a> about bulk sourcing.</p>'''
  },
  'ru': {
    'title': 'Почему термос перестал держать тепло? (Нарушение вакуума)',
    'desc': 'Термос, который перестал держать горячее, обычно потерял вакуумную изоляцию. Узнайте причины, как проверить и когда замена лучше ремонта.',
    'prose': '''<p>Вакуумный термос рассчитан на сохранение горячего 6-12 часов и дольше. Когда это резко падает - кофе тёплый уже через два часа - главная причина обычно в нарушении вакуумного шва. Вот как понять, проверить и решить проблему.</p>
<h2>Как работает вакуумная изоляция</h2>
<p>В двустенном термосе из пространства между стенками откачан воздух, образуя вакуум. Поскольку между стенками почти нет вещества, тепло не передаётся теплопроводностью или конвекцией. Теплопотери идут только через горлышко и крышку.</p>
<h2>Признаки потери вакуума</h2>
<ul>
<li><strong>Корпус тёплый или горячий</strong> снаружи, когда внутри горячее - тепло уходит через стенку.</li>
<li><strong>Конденсат</strong> на внешней стороне при горячем наполнении.</li>
<li><strong>Дребезжание внутри</strong>, будто что-то отвалилось между стенками.</li>
<li><strong>Напиток остывает за час</strong> вместо нескольких.</li>
</ul>
<h2>Частые причины</h2>
<p>Чаще всего - сильный удар, расколовший внутреннюю стенку, усталость старых изделий или брак бюджетных моделей. После потери вакуума бутылка ведёт себя как одностенная.</p>
<h2>Как проверить</h2>
<p>Налейте кипяток, закройте, подождите пять минут и коснитесь корпуса. Если он тёплый - вакуум нарушен. Здоровый термос остаётся комнатной температуры снаружи.</p>
<h2>Можно ли починить?</h2>
<p>На практике - нет. Вакуум создаётся на заводе и не восстанавливается дома. Бытовые термосы не ремонтируются - нужна замена.</p>
<p>Если бутылки часто выходят из строя, лучше покупать у производителя, контролирующего качество. <a href="/categories/drinkware-bottles.html">Сравните наши категории посуды</a> или поговорите с нашим <a href="/ru/sourcing-agent.html">закупочным офисом в Китае</a> об оптовых закупках.</p>'''
  }
 },
 {
  'slug': 'how-to-remove-odor-from-a-water-bottle',
  'en': {
    'title': 'How to Remove Odor from a Water Bottle (Smell-Free in 5 Steps)',
    'desc': 'Lingering smells in a water bottle are usually bacteria or trapped moisture. Here are five safe, food-grade ways to deodorize stainless steel and plastic bottles.',
    'prose': '''<p>A bottle that smells musty or sour is a sign of bacterial film or trapped moisture, not a broken bottle. The good news: most odors come out with simple, food-safe methods.</p>
<h2>Why Bottles Smell</h2>
<p>Warm, wet environments breed bacteria and mold, especially around the lid, gasket and straw. Even stainless steel holds odor in the lid assembly. Residual drink sugars feed the smell.</p>
<h2>5 Safe Deodorizing Steps</h2>
<ol>
<li><strong>Baking soda soak:</strong> mix 1-2 tablespoons of baking soda with warm water, fill the bottle, shake, and leave overnight. Rinse well.</li>
<li><strong>White vinegar rinse:</strong> fill halfway with white vinegar, top with water, soak an hour, then scrub and rinse.</li>
<li><strong>Lemon or citric acid:</strong> a squeeze of lemon or a spoon of citric acid cuts oily smells.</li>
<li><strong>Rice shake:</strong> a handful of dry rice with water scrubs the interior like a brush.</li>
<li><strong>Air dry in sun:</strong> leave uncapped in sunlight; UV helps kill odor-causing microbes.</li>
</ol>
<h2>What Not to Do</h2>
<p>Avoid bleach (toxic residue) and dishwashers for sealed lids (heat damages gaskets). Never store a bottle capped and damp.</p>
<p>Preventing odor is easier than removing it. <a href="/categories/drinkware-bottles.html">Browse drinkware with easy-clean lids</a>, or ask our <a href="/sourcing-agent.html">China buying office</a> about private-label options with wide mouths.</p>'''
  },
  'ru': {
    'title': 'Как убрать запах из бутылки для воды (5 шагов без запаха)',
    'desc': 'Стойкий запах в бутылке обычно вызван бактериями или застоявшейся влагой. Вот пять безопасных пищевых способов удалить запах из стальной и пластиковой бутылки.',
    'prose': '''<p>Бутылка с затхлым или кислым запахом - признак бактериальной плёнки или застоявшейся влаги, а не поломки. Хорошая новость: большинство запахов выводятся простыми и безопасными способами.</p>
<h2>Почему появляется запах</h2>
<p>Тёплая влажная среда размножает бактерии и плесень, особенно у крышки, уплотнителя и трубочки. Даже нержавейка удерживает запах в узле крышки. Остатки сахара в напитке усиливают запах.</p>
<h2>5 безопасных шагов</h2>
<ol>
<li><strong>Замачивание содой:</strong> 1-2 ст. ложки соды с тёплой водой, наполните бутылку, взболтайте и оставьте на ночь. Тщательно прополощите.</li>
<li><strong>Полоскание уксусом:</strong> наполовину уксусом, долейте водой, замочите на час, затем потрите и сполосните.</li>
<li><strong>Лимон или лимонная кислота:</strong> долька лимона или ложка кислоты снимает жирные запахи.</li>
<li><strong>Встряхивание рисом:</strong> горсть сухого риса с водой чистит внутреннюю стенку как ёршик.</li>
<li><strong>Сушка на солнце:</strong> оставьте открытой на солнце - УФ убивает микробы, вызывающие запах.</li>
</ol>
<h2>Чего делать не стоит</h2>
<p>Избегайте хлора (токсичный остаток) и посудомоечной машины для герметичных крышек (тепло портит уплотнители). Никогда не храните бутылку закрытой и влажной.</p>
<p>Предотвратить запах проще, чем убрать. <a href="/categories/drinkware-bottles.html">Смотрите посуду с легкочищающимися крышками</a> или спросите наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> о приватном лейбле с широким горлом.</p>'''
  }
 },
 {
  'slug': 'can-you-put-hot-coffee-in-a-stainless-steel-bottle',
  'en': {
    'title': 'Can You Put Hot Coffee in a Stainless Steel Bottle? Safety & Taste',
    'desc': 'Stainless steel bottles are safe for hot coffee, but taste and staining depend on grade and cleaning. Here is what to know before you brew.',
    'prose': '''<p>Short answer: yes. Food-grade stainless steel (304 or 316) is inert and safe for hot coffee. The real questions are about taste, staining, and which bottle to use.</p>
<h2>Is It Safe?</h2>
<p>304 and 316 stainless steel do not leach harmful chemicals into hot liquids, unlike some plastics. A double-wall vacuum bottle also keeps coffee hot without a plastic liner touching the drink.</p>
<h2>Taste and Odor</h2>
<p>Cheap or scratched steel can impart a metallic note, especially with acidic coffee. Rinse with baking soda occasionally and avoid abrasive scrubbers. A clean bottle should taste neutral.</p>
<h2>Staining and Cleaning</h2>
<p>Coffee tannins stain lighter liners over time. A baking-soda soak removes it. Do not use bleach. Hand-wash the lid, where oils accumulate.</p>
<h2>Coffee vs. Tea</h2>
<p>Both are fine, but tea leaves residue faster. Rinse soon after use.</p>
<p>Want a bottle built for hot drinks? <a href="/categories/drinkware-bottles.html">See our drinkware categories</a> or <a href="/contact-us.html">contact us</a> for OEM samples. Our <a href="/sourcing-agent.html">buying office</a> can source cafe-grade tumblers too.</p>'''
  },
  'ru': {
    'title': 'Можно ли наливать горячий кофе в стальную бутылку? Безопасность и вкус',
    'desc': 'Стальные бутылки безопасны для горячего кофе, но вкус и окрашивание зависят от марки стали и ухода. Что важно знать перед завариванием.',
    'prose': '''<p>Короткий ответ: да. Пищевая нержавеющая сталь (304 или 316) инертна и безопасна для горячего кофе. Настоящие вопросы - о вкусе, окрашивании и выборе бутылки.</p>
<h2>Это безопасно?</h2>
<p>Сталь 304 и 316 не выделяет вредных веществ в горячую жидкость, в отличие от некоторых пластиков. Двустенная вакуумная бутылка держит кофе горячим без пластиковой прокладки, касающейся напитка.</p>
<h2>Вкус и запах</h2>
<p>Дешёвая или поцарапанная сталь может давать металлический привкус, особенно с кислым кофе. Периодически ополаскивайте содой и не используйте абразивы. Чистая бутылка должна быть нейтральной на вкус.</p>
<h2>Окрашивание и чистка</h2>
<p>Танины кофе со временем окрашивают светлые стенки. Замачивание с содой убирает это. Не используйте хлор. Крышку, где скапливаются масла, мойте вручную.</p>
<h2>Кофе или чай</h2>
<p>Оба варианта допустимы, но чай оставляет налёт быстрее. Полощите сразу после использования.</p>
<p>Хотите бутылку для горячего? <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a> за OEM-образцами. Наш <a href="/ru/sourcing-agent.html">закупочный офис</a> тоже поставляет стаканы кафе-класса.</p>'''
  }
 },
 {
  'slug': 'how-to-get-rid-of-rust-in-a-stainless-steel-bottle',
  'en': {
    'title': 'How to Remove Rust from a Stainless Steel Bottle Safely',
    'desc': "Rust on a 'stainless' bottle usually means the coating was scratched. Learn safe removal methods and when the bottle should be retired.",
    'prose': '''<p>True stainless steel resists rust, but the surface layer can be scratched by abrasive cleaners or dropped on rough ground, exposing the steel underneath. That is where rust starts.</p>
<h2>Is a Rusty Bottle Safe?</h2>
<p>Light surface rust on the exterior is cosmetic. But if rust is inside, especially with pitting, retire the bottle - pits harbor bacteria and can leach metal into drinks.</p>
<h2>Safe Removal Methods</h2>
<ul>
<li><strong>Baking soda paste:</strong> mix baking soda with water into a paste, rub on rust with a soft cloth, rinse.</li>
<li><strong>White vinegar:</strong> soak the rusty area in vinegar for 30 minutes, then scrub gently.</li>
<li><strong>Lemon and salt:</strong> sprinkle salt, squeeze lemon, let sit, wipe clean.</li>
</ul>
<h2>What to Avoid</h2>
<p>Steel wool and harsh chemicals scratch deeper and invite more rust. Never use a rusty bottle for food or drink if it is pitted.</p>
<h2>Preventing Rust</h2>
<p>Hand-wash, dry fully, and avoid abrasive pads. Store uncapped.</p>
<p>For bottles that last, choose quality steel from the start. <a href="/categories/drinkware-bottles.html">Browse our drinkware</a> or ask our <a href="/sourcing-agent.html">China buying office</a> about 316-grade options.</p>'''
  },
  'ru': {
    'title': 'Как безопасно удалить ржавчину из стальной бутылки',
    'desc': "Ржавчина на «нержавеющей» бутылке обычно значит, что покрытие поцарапано. Узнайте безопасные способы удаления и когда бутылку пора списать.",
    'prose': '''<p>Настоящая нержавеющая сталь сопротивляется ржавчине, но поверхностный слой можно поцарапать абразивными средствами или при падении на грунт, обнажив сталь под ним. Именно там начинается ржавчина.</p>
<h2>Безопасна ли ржавая бутылка?</h2>
<p>Лёгкая поверхностная ржавчина снаружи - косметическая. Но если ржавчина внутри, особенно с точечной коррозией, выбросьте бутылку: язвы скрывают бактерии и могут выделять металл в напиток.</p>
<h2>Безопасные способы удаления</h2>
<ul>
<li><strong>Паста из соды:</strong> разведите соду с водой до пасты, потрите ржавчину мягкой тканью, сполосните.</li>
<li><strong>Белый уксус:</strong> замочите ржавое место на 30 минут, затем осторожно потрите.</li>
<li><strong>Лимон и соль:</strong> посыпьте солью, выдавите лимон, оставьте, протрите.</li>
</ul>
<h2>Чего избегать</h2>
<p>Металлическая мочалка и агрессивная химия царапают глубже и провоцируют новую ржавчину. Не используйте питтингованную бутылку для еды и питья.</p>
<h2>Профилактика</h2>
<p>Мойте вручную, сушите полностью, не используйте абразивы. Храните открытой.</p>
<p>Чтобы бутылки служили долго, выбирайте качественную сталь сразу. <a href="/categories/drinkware-bottles.html">Смотрите нашу посуду</a> или спросите наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> о стали марки 316.</p>'''
  }
 },
 {
  'slug': 'can-you-put-an-insulated-bottle-in-the-dishwasher',
  'en': {
    'title': 'Can You Put an Insulated Bottle in the Dishwasher? What to Know',
    'desc': 'Most vacuum-insulated bottles should not go in the dishwasher - heat and detergents can damage seals and the vacuum layer. Here is the safe way to clean.',
    'prose': '''<p>Many owners assume "stainless" means dishwasher-safe. For vacuum-insulated bottles, that assumption can quietly ruin the insulation.</p>
<h2>Why the Dishwasher Is Risky</h2>
<ul>
<li><strong>Heat breaks the vacuum:</strong> high temperatures can weaken the bond between walls, destroying insulation.</li>
<li><strong>Detergent degrades gaskets:</strong> harsh detergents dry out and crack rubber seals.</li>
<li><strong>Warping lids:</strong> plastic lids can warp and leak.</li>
</ul>
<h2>What Is Usually Safe</h2>
<p>The cap or lid may be top-rack safe on some brands - check the manual. The bottle body almost never is.</p>
<h2>The Safe Hand-Wash Method</h2>
<ol>
<li>Rinse with warm water immediately after use.</li>
<li>Wash with mild dish soap and a bottle brush.</li>
<li>Clean the lid, gasket and straw separately.</li>
<li>Rinse, then air-dry uncapped.</li>
</ol>
<p>Need bottles rated for tough environments? <a href="/categories/drinkware-bottles.html">See our drinkware categories</a> or <a href="/contact-us.html">contact us</a>. Our <a href="/sourcing-agent.html">buying office</a> sources commercial-grade drinkware too.</p>'''
  },
  'ru': {
    'title': 'Можно ли ставить термобутылку в посудомоечную машину? Что важно знать',
    'desc': 'Большинство вакуумных бутылок нельзя ставить в посудомойку - тепло и моющие средства портят уплотнители и вакуумный слой. Вот безопасный способ чистки.',
    'prose': '''<p>Многие считают, что «нержавейка» значит можно в посудомойку. Для вакуумных бутылок это предположение может незаметно разрушить изоляцию.</p>
<h2>Почему посудомойка опасна</h2>
<ul>
<li><strong>Тепло рвёт вакуум:</strong> высокая температура ослабляет связь между стенками, разрушая изоляцию.</li>
<li><strong>Средство портит уплотнители:</strong> агрессивные составы сушат и трескают резиновые прокладки.</li>
<li><strong>Коробятся крышки:</strong> пластиковые крышки могут деформироваться и подтекать.</li>
</ul>
<h2>Что обычно безопасно</h2>
<p>Крышка иногда допустима на верхней полке у некоторых брендов - проверьте инструкцию. Корпус бутылки почти никогда.</p>
<h2>Безопасная ручная мойка</h2>
<ol>
<li>Сразу после использования ополосните тёплой водой.</li>
<li>Вымойте мягким средством и ёршиком.</li>
<li>Почистите крышку, прокладку и трубочку отдельно.</li>
<li>Сполосните и сушите открытой.</li>
</ol>
<p>Нужны бутылки для жёстких условий? <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a>. Наш <a href="/ru/sourcing-agent.html">закупочный офис</a> поставляет и коммерческую посуду.</p>'''
  }
 },
 {
  'slug': 'how-to-clean-a-water-bottle-straw-and-lid',
  'en': {
    'title': 'How to Clean a Water Bottle Straw and Lid (No More Mold)',
    'desc': 'Straws and lids trap moisture and grow mold fast. A step-by-step clean using a brush and safe soaks keeps them hygienic.',
    'prose': '''<p>The lid and straw are where most bottle contamination lives. They stay damp, narrow, and out of sight - perfect for mold. A regular, correct clean prevents it.</p>
<h2>Tools You Need</h2>
<ul>
<li>A thin bottle/straw brush or pipe cleaner</li>
<li>Mild dish soap</li>
<li>Baking soda or white vinegar for soaks</li>
</ul>
<h2>Step-by-Step</h2>
<ol>
<li>Disassemble the lid fully - remove the gasket and any silicone ring.</li>
<li>Soak parts in warm soapy water for 10 minutes.</li>
<li>Scrub the straw with a pipe cleaner; push it through both ends.</li>
<li>Brush the lid crevices and the gasket groove.</li>
<li>For mold, soak in a 1:1 white-vinegar solution for 15 minutes, then scrub.</li>
<li>Rinse and air-dry completely before reassembly.</li>
</ol>
<h2>How Often</h2>
<p>Daily rinse, weekly deep clean, and immediately after sugary or protein drinks.</p>
<p>Want bottles designed for easy cleaning? <a href="/categories/drinkware-bottles.html">Browse our drinkware</a> or ask our <a href="/sourcing-agent.html">China buying office</a> about wide-mouth and straw-free designs.</p>'''
  },
  'ru': {
    'title': 'Как чистить трубочку и крышку бутылки для воды (без плесени)',
    'desc': 'Трубочки и крышки удерживают влагу и быстро покрываются плесенью. Пошаговая чистка щёткой и безопасными замачиваниями сохраняет гигиену.',
    'prose': '''<p>Крышка и трубочка - место, где живёт большая часть загрязнений бутылки. Они остаются влажными, узкими и вне поля зрения - идеально для плесени. Регулярная правильная чистка предотвращает это.</p>
<h2>Что понадобится</h2>
<ul>
<li>Тонкая ёршик-трубочка или ёршик для бутылок</li>
<li>Мягкое средство для посуды</li>
<li>Сода или белый уксус для замачивания</li>
</ul>
<h2>Пошагово</h2>
<ol>
<li>Полностью разберите крышку - снимите прокладку и силиконовое кольцо.</li>
<li>Замочите детали в тёплой мыльной воде на 10 минут.</li>
<li>Почистите трубочку ёршиком, протолкнув с обеих сторон.</li>
<li>Протрите щели крышки и паз прокладки.</li>
<li>При плесени замочите в растворе уксуса 1:1 на 15 минут, затем потрите.</li>
<li>Сполосните и полностью высушите перед сборкой.</li>
</ol>
<h2>Как часто</h2>
<p>Ежедневное ополаскивание, еженедельная глубокая чистка и сразу после сладких или белковых напитков.</p>
<p>Хотите бутылки, удобные для чистки? <a href="/categories/drinkware-bottles.html">Смотрите нашу посуду</a> или спросите наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> о широкогорлых и безтрубочных моделях.</p>'''
  }
 },
 {
  'slug': 'why-is-my-water-bottle-sweating-condensation',
  'en': {
    'title': 'Why Is My Water Bottle Sweating? Condensation vs. Leak',
    'desc': 'A cold bottle that sweats on the outside is usually condensation, not a leak. Learn to tell the difference and when to worry.',
    'prose': '''<p>If your cold bottle drips on the outside, your first worry is a leak. In most cases, it is harmless condensation. Here is how to tell.</p>
<h2>What Condensation Is</h2>
<p>A single-wall metal or glass bottle filled with ice water cools the surrounding air, which drops below its dew point and forms water on the exterior. That is "sweat," and it is normal.</p>
<h2>Condensation vs. Leak</h2>
<ul>
<li><strong>Condensation:</strong> water appears only when the bottle is cold, on the outside, and the liquid level inside does not drop.</li>
<li><strong>Leak:</strong> water appears even with room-temperature drinks, the outside is wet near the lid or base, and the contents shrink over time.</li>
</ul>
<h2>Single-Wall vs. Double-Wall</h2>
<p>Double-wall vacuum bottles sweat far less because the outer wall stays near room temperature. Single-wall bottles always sweat with cold drinks.</p>
<h2>When to Worry</h2>
<p>If a vacuum bottle sweats with cold liquid, its vacuum may have failed (see our guide on lost insulation). A leaking lid needs a new gasket.</p>
<p>For sweat-free performance, choose vacuum insulation. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> or talk to our <a href="/sourcing-agent.html">China buying office</a> about bulk orders.</p>'''
  },
  'ru': {
    'title': 'Почему бутылка «потеет»? Конденсат или течь',
    'desc': 'Холодная бутылка, «потеющая» снаружи, обычно выделяет конденсат, а не течёт. Узнайте, как отличить и когда стоит беспокоиться.',
    'prose': '''<p>Если холодная бутылка капает снаружи, первое опасение - течь. В большинстве случаев это безвредный конденсат. Вот как отличить.</p>
<h2>Что такое конденсат</h2>
<p>Одностенная металлическая или стеклянная бутылка с ледяной водой охлаждает окружающий воздух, который опускается ниже точки росы и оседает водой снаружи. Это «пот», и это нормально.</p>
<h2>Конденсат или течь</h2>
<ul>
<li><strong>Конденсат:</strong> вода появляется только когда бутылка холодная, снаружи, и уровень жидкости внутри не падает.</li>
<li><strong>Течь:</strong> вода появляется даже при комнатной температуре, снаружи мокро у крышки или дна, а содержимое со временем убывает.</li>
</ul>
<h2>Одностенная против двустенной</h2>
<p>Двустенные вакуумные бутылки почти не потеют, так как внешняя стенка близка к комнатной температуре. Одностенные всегда потеют с холодным.</p>
<h2>Когда беспокоиться</h2>
<p>Если вакуумная бутылка потеет с холодным напитком, её вакуум, возможно, нарушен (см. наш гайд про потерю изоляции). Текущая крышка требует новой прокладки.</p>
<p>Для работы без пота выбирайте вакуумную изоляцию. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или поговорите с нашим <a href="/ru/sourcing-agent.html">закупочным офисом в Китае</a> об оптовых заказах.</p>'''
  }
 },
 {
  'slug': 'how-to-fix-a-dented-thermos-bottle',
  'en': {
    'title': 'How to Fix a Dented Thermos Bottle (and When to Replace)',
    'desc': 'A dent can hurt insulation or just look bad. Here is how to gently reshape a dented bottle and when a dent means it is time for a new one.',
    'prose': '''<p>A dented thermos is common after a drop. Whether it matters depends on where the dent is and whether the vacuum survived.</p>
<h2>First, Assess the Damage</h2>
<ul>
<li><strong>Dent on the base or shoulder:</strong> often cosmetic; insulation may be fine.</li>
<li><strong>Dent that cracks the inner wall:</strong> vacuum lost - performance drops sharply.</li>
<li><strong>Dent near the lid threads:</strong> may cause leaks.</li>
</ul>
<h2>Gentle Reshaping Methods</h2>
<ol>
<li><strong>Warm water + suction:</strong> fill with hot (not boiling) water, cap, and pull the dent outward with a suction cup.</li>
<li><strong>Wooden spoon:</strong> from inside, gently push the dent out - only on the base.</li>
<li><strong>Avoid freezing tricks:</strong> the old "water and freeze" method can crack the wall.</li>
</ol>
<h2>When to Replace</h2>
<p>If the bottle no longer holds temperature or leaks, repair is not worth it. Consumer bottles are not field-serviceable.</p>
<p>Buying frequently? Source direct from a factory. <a href="/categories/drinkware-bottles.html">See our drinkware</a> or <a href="/contact-us.html">contact us</a>. Our <a href="/sourcing-agent.html">buying office</a> consolidates multi-category orders.</p>'''
  },
  'ru': {
    'title': 'Как выправить вмятину на термосе (и когда заменить)',
    'desc': 'Вмятина может повредить изоляцию или просто выглядеть плохо. Как аккуратно выправить бутылку и когда вмятина означает пора покупать новую.',
    'prose': '''<p>Помятый термос - частое дело после падения. Важность зависит от места вмятины и того, выжил ли вакуум.</p>
<h2>Сначала оцените ущерб</h2>
<ul>
<li><strong>Вмятина на дне или плече:</strong> часто косметическая; изоляция может быть цела.</li>
<li><strong>Вмятина, треснувшая внутреннюю стенку:</strong> вакуум потерян - резко падает эффективность.</li>
<li><strong>Вмятина у резьбы крышки:</strong> может вызвать течь.</li>
</ul>
<h2>Мягкие способы выправить</h2>
<ol>
<li><strong>Тёплая вода + присоска:</strong> наполните горячей (не кипятком) водой, закройте и вытяните вмятину присоской наружу.</li>
<li><strong>Деревянная ложка:</strong> изнутри аккуратно выдавите вмятину - только на дне.</li>
<li><strong>Не замораживайте:</strong> старый приём «вода и морозилка» может треснуть стенку.</li>
</ol>
<h2>Когда заменить</h2>
<p>Если бутылка перестала держать температуру или течёт, ремонт не имеет смысла. Бытовые термосы не обслуживаются в полевых условиях.</p>
<p>Покупаете часто? Закупайте напрямую с фабрики. <a href="/categories/drinkware-bottles.html">Смотрите нашу посуду</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a>. Наш <a href="/ru/sourcing-agent.html">закупочный офис</a> консолидирует заказы по нескольким категориям.</p>'''
  }
 },
 {
  'slug': 'is-it-safe-to-leave-water-in-a-stainless-steel-bottle-overnight',
  'en': {
    'title': 'Is It Safe to Leave Water in a Stainless Steel Bottle Overnight?',
    'desc': 'Leaving water in a sealed steel bottle overnight is usually fine, but bacteria and taste can build up. Here is how to do it safely.',
    'prose': '''<p>Stainless steel is inert, so leaving plain water in a clean bottle overnight is generally safe. The real risks come from cleanliness and what else was in the bottle.</p>
<h2>Why Steel Is Low-Risk</h2>
<p>Unlike plastic, food-grade steel does not leach into water and resists bacterial film better. Overnight water in a clean steel bottle is fine to drink.</p>
<h2>When It Becomes Unsafe</h2>
<ul>
<li>The bottle was not cleaned after previous use (sugary or protein drinks).</li>
<li>Water sat in a warm place.</li>
<li>The lid and gasket harbor old moisture.</li>
</ul>
<h2>Best Practice</h2>
<ol>
<li>Rinse the bottle and lid daily.</li>
<li>Empty and air-dry uncapped if not used for long.</li>
<li>For flavored or tap water, freshen daily.</li>
</ol>
<p>Choose bottles that clean easily. <a href="/categories/drinkware-bottles.html">Browse our drinkware categories</a> or ask our <a href="/sourcing-agent.html">China buying office</a> about wide-mouth designs.</p>'''
  },
  'ru': {
    'title': 'Безопасно ли оставлять воду в стальной бутылке на ночь?',
    'desc': 'Оставить воду в закрытой стальной бутылке на ночь обычно можно, но могут размножиться бактерии и появиться привкус. Как делать это безопасно.',
    'prose': '''<p>Нержавеющая сталь инертна, поэтому оставить чистую воду в чистой бутылке на ночь в целом безопасно. Настоящие риски - в чистоте и том, что ещё было в бутылке.</p>
<h2>Почему сталь малорискованна</h2>
<p>В отличие от пластика, пищевая сталь не выделяет веществ в воду и лучше сопротивляется бактериальной плёнке. Ночная вода в чистой стальной бутылке пригодна для питья.</p>
<h2>Когда становится опасно</h2>
<ul>
<li>Бутылку не мыли после предыдущего использования (сладкие или белковые напитки).</li>
<li>Вода стояла в тепле.</li>
<li>Крышка и прокладка удерживают старую влагу.</li>
</ul>
<h2>Лучшая практика</h2>
<ol>
<li>Ежедневно ополаскивайте бутылку и крышку.</li>
<li>Опустошайте и сушите открытой, если долго не используете.</li>
<li>Ароматизированную или водопроводную воду обновляйте ежедневно.</li>
</ol>
<p>Выбирайте бутылки, удобные для чистки. <a href="/categories/drinkware-bottles.html">Смотрите наши категории посуды</a> или спросите наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> о широкогорлых моделях.</p>'''
  }
 },
 {
  'slug': 'how-to-store-an-insulated-bottle-when-not-in-use',
  'en': {
    'title': 'How to Store an Insulated Bottle When Not in Use (Avoid Mold)',
    'desc': 'Storing a bottle wet or sealed invites mold and odor. Follow these steps to store insulated bottles long-term without damage.',
    'prose': '''<p>Off-season or rarely used bottles often come back from storage smelling or growing mold. The cause is almost always how they were put away.</p>
<h2>The Wrong Way</h2>
<p>Sealed, damp, and dark - that is a petri dish. Caps left on trap moisture; a closed bottle cannot breathe.</p>
<h2>The Right Way</h2>
<ol>
<li><strong>Clean first:</strong> wash with mild soap, scrub lid and gasket.</li>
<li><strong>Dry completely:</strong> air-dry uncapped overnight; a dish rack works well.</li>
<li><strong>Store open:</strong> leave the cap off or loosely placed, never screwed tight.</li>
<li><strong>Cool, dry place:</strong> avoid bathrooms and direct sunlight.</li>
<li><strong>Periodic check:</strong> every month or two, air it out.</li>
</ol>
<h2>For Long-Term Storage</h2>
<p>A silica packet inside an open bottle helps in humid climates. Do not store with liquids inside.</p>
<p>For durable, easy-care drinkware, <a href="/categories/drinkware-bottles.html">see our drinkware</a> or <a href="/contact-us.html">contact us</a>. Our <a href="/sourcing-agent.html">China buying office</a> handles bulk and private label.</p>'''
  },
  'ru': {
    'title': 'Как хранить термобутылку, когда она не используется (без плесени)',
    'desc': 'Хранить бутылку влажной или закрытой - значит пригласить плесень и запах. Соблюдайте эти шаги для долгого хранения без повреждений.',
    'prose': '''<p>Сезонные или редко используемые бутылки часто возвращаются из хранения с запахом или плесенью. Причина почти всегда в том, как их убрали.</p>
<h2>Неправильный способ</h2>
<p>Закрытая, влажная и тёмная - это чашка Петри. Надетые крышки удерживают влагу; закрытая бутылка не дышит.</p>
<h2>Правильный способ</h2>
<ol>
<li><strong>Сначала вымойте:</strong> мягким средством, почистьте крышку и прокладку.</li>
<li><strong>Полностью высушите:</strong> сушите открытой ночь; подойдёт сушилка для посуды.</li>
<li><strong>Храните открытой:</strong> крышка снята или накрыта сверху, никогда плотно не закручивайте.</li>
<li><strong>Прохладное сухое место:</strong> избегайте ванных и прямых солнечных лучей.</li>
<li><strong>Периодическая проверка:</strong> раз в месяц-два проветривайте.</li>
</ol>
<h2>Для долгого хранения</h2>
<p>Пакетик силикагеля в открытой бутылке помогает во влажном климате. Не храните с жидкостью внутри.</p>
<p>Для прочной и простой в уходе посуды <a href="/categories/drinkware-bottles.html">смотрите нашу посуду</a> или <a href="/ru/contact-us.html">свяжитесь с нами</a>. Наш <a href="/ru/sourcing-agent.html">закупочный офис в Китае</a> берёт опт и приватный лейбл.</p>'''
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
# idempotent: drop any pre-existing blocks for these slugs (with or without a- prefix)
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
            '  <url>\n    <loc>%s</loc>\n    <lastmod>2026-09-27</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>' % loc)
if new_urls:
    idx = sm.rfind('</urlset>')
    sm = sm[:idx] + '\n'.join(new_urls) + '\n' + sm[idx:]
    open('sitemap.xml', 'w', encoding='utf-8').write(sm)
print('sitemap added', len(new_urls), 'urls; total now', sm.count('<loc>'))
