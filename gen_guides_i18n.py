#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate multilingual (es/pt/ru/ar) versions of the 6 STWADD buyer's guides.

Each language page mirrors the English root guides/ pages but:
- has translated content
- uses absolute paths (matching the existing 3000+ multilingual pages)
- declares hreflang alternates (en/es/pt/ru/ar) exactly like the existing language articles
- Arabic sets dir="rtl"
Commerce nav links point to root (root-only pages); in-language links point to the
new language guides, so there are no 404s.
"""
import json
import os

ROOT = "/Users/mapingyuan/WorkBuddy/2026-07-24-11-47-23/stwadd-fullsite"
SITE = "https://www.stwadd.com"
LANGS = ["es", "pt", "ru", "ar"]

SLUGS = {
    "index": "index",
    "choose": "choose-water-bottle-manufacturer",
    "steel": "304-vs-316-stainless-steel",
    "verify": "verify-chinese-factory",
    "moq": "moq-lead-time-ecommerce",
    "material": "drinkware-material-comparison",
}

# ---------------------------------------------------------------------------
# Shared CSS (identical to the English guide pages, all classes used across them)
# ---------------------------------------------------------------------------
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
.cta{background:var(--red);color:#fff;padding:9px 18px;border-radius:6px;font-weight:600;font-size:14px}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
.crumb{font-size:13px;color:var(--muted);padding:14px 0}
.crumb a:hover{color:var(--red)}
.hero{background:#fff;border:1px solid var(--line);border-radius:12px;padding:34px;margin-bottom:22px}
.hero .tag{display:inline-block;background:#fdecef;color:var(--red);font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:.5px;margin-bottom:14px}
.h1{font-size:30px;line-height:1.25;margin-bottom:14px}
.lead{font-size:16px;color:#374151;margin-bottom:18px}
.section{background:#fff;border:1px solid var(--line);border-radius:12px;padding:26px;margin-bottom:22px}
.section h2{font-size:22px;margin-bottom:12px}
.section h3{font-size:16px;margin:18px 0 8px;color:var(--blue)}
.section p{color:#374151;margin-bottom:12px}
.section ol{margin:0 0 12px 22px;color:#374151}
.section ul{margin:0 0 12px 22px;color:#374151}
.section li{margin-bottom:8px}
.checklist{border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px;background:#fafbfc}
.checklist b{color:var(--dark)}
.step{border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px;background:#fafbfc}
.step b{color:var(--red)}
.timeline{border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px;background:#fafbfc}
.timeline b{color:var(--blue)}
.specs table{width:100%;border-collapse:collapse;margin-top:6px}
.specs th,.specs td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--line);font-size:14px;vertical-align:top}
.specs th{width:180px;color:var(--muted);font-weight:600;background:#fafbfc}
.faq-item{border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px}
.faq-item .q{font-weight:700;font-size:15px;margin-bottom:8px;color:var(--dark)}
.faq-item .a{color:#374151;font-size:14px}
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.guide-card{border:1px solid var(--line);border-radius:12px;padding:20px;transition:.15s;background:#fff}
.guide-card:hover{border-color:var(--red);box-shadow:0 6px 18px rgba(196,30,58,.08)}
.guide-card .num{font-size:13px;font-weight:700;color:var(--red);margin-bottom:8px}
.guide-card h3{font-size:18px;margin-bottom:8px;line-height:1.3}
.guide-card p{font-size:14px;color:#4b5563;margin-bottom:14px}
.guide-card .read{color:var(--red);font-weight:600;font-size:14px}
.inquiry{background:linear-gradient(120deg,#111418,#1f2937);color:#fff;border-radius:12px;padding:30px;margin-bottom:22px;text-align:center}
.inquiry h2{color:#fff;margin-bottom:8px}
.inquiry p{color:#cbd5e1;margin-bottom:18px}
.inquiry a{display:inline-block;background:var(--red);color:#fff;padding:13px 28px;border-radius:8px;font-weight:700}
.footer{background:#0c0f14;color:#9ca3af;padding:34px 0;font-size:14px}
.footer .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px;max-width:1180px;margin:0 auto;padding:0 20px}
.footer h3{color:#fff;font-size:15px;margin-bottom:12px}
.footer .logo{color:var(--red);margin-bottom:10px;display:block}
.footer a{color:#cbd5e1}
@media(max-width:880px){.guide-grid{grid-template-columns:1fr}.nav{display:none}.footer .cols{grid-template-columns:1fr}}
"""

# ---------------------------------------------------------------------------
# TRANSLATIONS
# ---------------------------------------------------------------------------
# Index page
IDX = {
    "es": {
        "title": "Guías y Recursos para Compradores — Botellas y Termos OEM/ODM | STWADD",
        "meta": "Guías gratuitas para comprar botellas de agua, termos y tazas aisladas desde China: cómo elegir fabricante, acero 304 vs 316, cómo verificar una fábrica real, MOQ/plazos para vendedores de Amazon y comparativa de materiales. Escrito por una fábrica de Yongkang.",
        "hero_tag": "RECURSOS · PARA COMPRADORES",
        "h1": "Guías y Recursos para Comprar Artículos de Bebida desde China",
        "lead": "Guías prácticas y directas escritas por una fábrica de artículos de bebida en Yongkang, China, el mayor clúster mundial de fabricación de botellas aisladas. Úsalas para elegir el fabricante adecuado, seleccionar materiales, verificar una fábrica real y planificar tu MOQ y plazos. Cuando estés listo, somos fabricante OEM/ODM con precios directos de fábrica.",
        "cards": [
            ("GUÍA 01", "Cómo Elegir un Fabricante de Botellas de Agua", "La lista de verificación completa para compradores OEM/ODM: fábrica vs comerciante, certificaciones, personalización, MOQ y señales de alerta al comprar desde China.", "Leer guía →", "choose-water-bottle-manufacturer"),
            ("GUÍA 02", "Acero Inoxidable 304 vs 316", "¿Qué grado elegir para tu marca? Comparativa clara del 18/8 (304) y el 316: resistencia a la corrosión, costo y cuándo vale la pena el 316.", "Leer guía →", "304-vs-316-stainless-steel"),
            ("GUÍA 03", "Cómo Verificar que una Fábrica China es Real", "¿No es un comerciante? Pasos prácticos para confirmar que el proveedor es un fabricante genuino: recorridos en video, inspecciones de terceros, registros de exportación y ferias.", "Leer guía →", "verify-chinese-factory"),
            ("GUÍA 04", "MOQ, Plazos y Moldes para Vendedores de Amazon / Shopify", "Guía de planificación para vendedores de marca propia en e-commerce: cómo funciona el MOQ, costos de moldes, plazos realistas y cómo programar re pedidos.", "Leer guía →", "moq-lead-time-ecommerce"),
            ("GUÍA 05", "Comparativa de Materiales para Bebidas", "Tritan vs plástico vs vidrio vs acero inoxidable: durabilidad, seguridad, aislamiento, peso y precio para ayudarte a elegir el material adecuado.", "Leer guía →", "drinkware-material-comparison"),
            ("PÁGINA DE FÁBRICA", "Fábrica OEM / ODM de STWADD", "Nuestras capacidades, materiales, certificaciones, MOQ y plazos, y cómo fabricamos para marcas, mayoristas y empresas de comercio en todo el mundo.", "Ver fábrica →", "oem-odm"),
        ],
        "inquiry_h2": "¿Necesitas una Cotización de Fábrica?",
        "inquiry_p": "Cuéntanos tu producto, cantidad, personalización y destino — respondemos en 24 h con un precio directo de fábrica.",
        "inquiry_a": "Solicitar Cotización",
        "footer_products": ["Catálogo Completo (850+)", "Fábrica OEM / ODM", "Buscar Todos los Productos", "Guías para Compradores"],
        "company_line": "Fundada en 2017 · Fábrica OEM y ODM (Fabricante)",
    },
    "pt": {
        "title": "Guias e Recursos para Compradores — Garrafas e Canecas OEM/ODM | STWADD",
        "meta": "Guias gratuitas para sourcing de garrafas de água, canecas e copos isolados da China: como escolher fabricante, aço 304 vs 316, como verificar uma fábrica real, MOQ/prazos para vendedores da Amazon e comparação de materiais. Escrito por uma fábrica de Yongkang.",
        "hero_tag": "RECURSOS · PARA COMPRADORES",
        "h1": "Guias e Recursos para Comprar Utensílios de Bebida da China",
        "lead": "Guias práticas e diretas escritas por uma fábrica de utensílios de bebida em Yongkang, China, o maior cluster mundial de fabricação de garrafas isoladas. Use-as para escolher o fabricante certo, selecionar materiais, verificar uma fábrica real e planejar seu MOQ e prazos. Quando estiver pronto, somos fabricante OEM/ODM com preços diretos de fábrica.",
        "cards": [
            ("GUIA 01", "Como Escolher um Fabricante de Garrafas de Água", "O checklist completo para compradores OEM/ODM: fábrica vs comerciante, certificações, personalização, MOQ e sinais de alerta ao comprar da China.", "Ler guia →", "choose-water-bottle-manufacturer"),
            ("GUIA 02", "Aço Inoxidável 304 vs 316", "Qual graduação escolher para sua marca? Comparação clara do 18/8 (304) e do 316: resistência à corrosão, custo e quando o 316 vale a pena.", "Ler guia →", "304-vs-316-stainless-steel"),
            ("GUIA 03", "Como Verificar se uma Fábrica Chinesa é Real", "Não é um comerciante? Passos práticos para confirmar que o fornecedor é um fabricante genuíno: tours em vídeo, inspeções de terceiros, registros de exportação e feiras.", "Ler guia →", "verify-chinese-factory"),
            ("GUIA 04", "MOQ, Prazos e Moldes para Vendedores da Amazon / Shopify", "Guia de planejamento para vendedores de marca própria no e-commerce: como funciona o MOQ, custos de moldes, prazos realistas e como programar re pedidos.", "Ler guia →", "moq-lead-time-ecommerce"),
            ("GUIA 05", "Comparação de Materiais para Bebidas", "Tritan vs plástico vs vidro vs aço inoxidável: durabilidade, segurança, isolamento, peso e preço para ajudar a escolher o material certo.", "Ler guia →", "drinkware-material-comparison"),
            ("PÁGINA DA FÁBRICA", "Fábrica OEM / ODM da STWADD", "Nossas capacidades, materiais, certificações, MOQ e prazos, e como fabricamos para marcas, atacadistas e empresas de comércio em todo o mundo.", "Ver fábrica →", "oem-odm"),
        ],
        "inquiry_h2": "Precisa de uma Cotação de Fábrica?",
        "inquiry_p": "Conte-nos seu produto, quantidade, personalização e destino — respondemos em 24h com preço direto de fábrica.",
        "inquiry_a": "Solicitar Cotação",
        "footer_products": ["Catálogo Completo (850+)", "Fábrica OEM / ODM", "Buscar Todos os Produtos", "Guias para Compradores"],
        "company_line": "Fundada em 2017 · Fábrica OEM e ODM (Fabricante)",
    },
    "ru": {
        "title": "Руководства и ресурсы для покупателей — Бутылки и посуда OEM/ODM | STWADD",
        "meta": "Бесплатные руководства по закупке изолированных бутылок, термокружек и фляг в Китае: как выбрать производителя, сталь 304 против 316, как проверить настоящую фабрику, MOQ/сроки для продавцов Amazon и сравнение материалов. Написано фабрикой из Юнкана.",
        "hero_tag": "РЕСУРСЫ · ДЛЯ ПОКУПАТЕЛЕЙ",
        "h1": "Руководства и ресурсы по закупке посуды для напитков в Китае",
        "lead": "Практичные и конкретные руководства, написанные фабрикой посуды в Юнкане, Китай — крупнейшем в мире кластере по производству изолированных бутылок. Используйте их, чтобы выбрать подходящего производителя, подобрать материалы, проверить настоящую фабрику и спланировать MOQ и сроки. Когда будете готовы, мы — производитель OEM/ODM с прямыми заводскими ценами.",
        "cards": [
            ("РУКОВОДСТВО 01", "Как выбрать производителя бутылок для воды", "Полный чек-лист для покупателей OEM/ODM: фабрика против трейдера, сертификаты, кастомизация, MOQ и тревожные признаки при закупках в Китае.", "Читать руководство →", "choose-water-bottle-manufacturer"),
            ("РУКОВОДСТВО 02", "Нержавеющая сталь 304 против 316", "Какую марку выбрать для вашего бренда? Чёткое сравнение 18/8 (304) и 316: коррозионная стойкость, цена и когда 316 того стоит.", "Читать руководство →", "304-vs-316-stainless-steel"),
            ("РУКОВОДСТВО 03", "Как проверить, что китайская фабрика настоящая", "Не трейдер? Практические шаги, чтобы убедиться, что поставщик — настоящий производитель: видео-туры, инспекции третьей стороной, экспортные записи и выставки.", "Читать руководство →", "verify-chinese-factory"),
            ("РУКОВОДСТВО 04", "MOQ, сроки и оснастка для продавцов Amazon / Shopify", "Руководство по планированию для продавцов private-label в e-commerce: как работает MOQ, стоимость пресс-форм, реалистичные сроки и как планировать повторные заказы.", "Читать руководство →", "moq-lead-time-ecommerce"),
            ("РУКОВОДСТВО 05", "Сравнение материалов для посуды", "Тритан против пластика против стекла против нержавеющей стали: долговечность, безопасность, теплоизоляция, вес и цена для выбора подходящего материала.", "Читать руководство →", "drinkware-material-comparison"),
            ("СТРАНИЦА ФАБРИКИ", "Фабрика OEM / ODM STWADD", "Наши возможности, материалы, сертификаты, MOQ и сроки, и как мы производим для брендов, оптовиков и торговых компаний по всему миру.", "Смотреть фабрику →", "oem-odm"),
        ],
        "inquiry_h2": "Нужна заводская смета?",
        "inquiry_p": "Сообщите нам ваш товар, количество, кастомизацию и назначение — отвечаем в течение 24 ч с прямой заводской ценой.",
        "inquiry_a": "Запросить смету",
        "footer_products": ["Полный каталог (850+)", "Фабрика OEM / ODM", "Искать все товары", "Руководства для покупателей"],
        "company_line": "Основана в 2017 · Фабрика OEM и ODM (Производитель)",
    },
    "ar": {
        "title": "أدلة وموارد المشترين — زجاجات وأواني شرب OEM/ODM | STWADD",
        "meta": "أدلة مجانية للمشترين لاستيراد زجاجات الماء المعزولة والكؤوس والقوارير من الصين: كيفية اختيار المصنع، الفولاذ 304 مقابل 316، كيفية التحقق من مصنع حقيقي، الحد الأدنى للطلب/المدة لبائعي أمازون، ومقارنة المواد. كُتبت بواسطة مصنع في يونكانغ.",
        "hero_tag": "موارد · للمشترين",
        "h1": "أدلة وموارد لاستيراد أواني الشرب من الصين",
        "lead": "أدلة عملية وواضحة كتبها مصنع أواني شرب في يونكانغ، الصين — أكبر مجمع لتصنيع الزجاجات المعزولة في العالم. استخدمها لاختيار المصنع المناسب، وانتقاء المواد، والتحقق من مصنع حقيقي، وتخطيط حد الطلب الأدنى ومدة التسليم. عندما تكون جاهزًا، نحن مصنع OEM/ODM بأسعار مباشرة من المصنع.",
        "cards": [
            ("دليل 01", "كيفية اختيار مصنع زجاجات الماء", "قائمة فحص كاملة للمشترين OEM/ODM: المصنع مقابل الوسيط، الشهادات، التخصيص، الحد الأدنى للطلب، والعلامات التحذيرية عند الشراء من الصين.", "اقرأ الدليل ←", "choose-water-bottle-manufacturer"),
            ("دليل 02", "الفولاذ المقاوم للصدأ 304 مقابل 316", "أي درجة تختار لعلامتك التجارية؟ مقارنة واضحة بين 18/8 (304) و316: مقاومة التآكل، التكلفة، ومتى يستحق 316 العلاوة.", "اقرأ الدليل ←", "304-vs-316-stainless-steel"),
            ("دليل 03", "كيفية التحقق من أن المصنع الصيني حقيقي", "ليس وسيطًا؟ خطوات عملية لتأكيد أن المورّد مصنع حقيقي: جولات بالفيديو، فحوص طرف ثالث، سجلات التصدير، ومعارض.", "اقرأ الدليل ←", "verify-chinese-factory"),
            ("دليل 04", "الحد الأدنى للطلب والمدة والأدوات لبائعي أمازون / شوبيفاي", "دليل تخطيط لبائعي العلامة الخاصة في التجارة الإلكترونية: كيف يعمل الحد الأدنى، تكاليف القوالب، مدد واقعية، وكيفية جدولة إعادة الطلب.", "اقرأ الدليل ←", "moq-lead-time-ecommerce"),
            ("دليل 05", "مقارنة مواد أواني الشرب", "تريتان مقابل بلاستيك مقابل زجاج مقابل فولاذ مقاوم للصدأ: المتانة، السلامة، العزل، الوزن والسعر للمساعدة في اختيار المادة المناسبة.", "اقرأ الدليل ←", "drinkware-material-comparison"),
            ("صفحة المصنع", "مصنع STWADD OEM / ODM", "إمكاناتنا، المواد، الشهادات، الحد الأدنى للطلب والمدة، وكيف نصنّع للعلامات التجارية والجملة وشركات التجارة حول العالم.", "اطلع على المصنع ←", "oem-odm"),
        ],
        "inquiry_h2": "تحتاج عرض سعر من المصنع؟",
        "inquiry_p": "أخبرنا عن منتجك وكميته وتخصيصه والوجهة — نرد خلال 24 ساعة بسعر مباشر من المصنع.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_products": ["الكتالوج الكامل (850+)", "مصنع OEM / ODM", "ابحث عن كل المنتجات", "أدلة المشترين"],
        "company_line": "تأسست في 2017 · مصنع OEM وODM (صانع)",
    },
}

# Article content. Each = dict with title/meta/hero_tag/h1/lead/body/faq/inquiry/footer_guides
# body is a list of [type, payload]:
#   ['h2', text], ['p', text], ['h3', text], ['ul', [items]],
#   ['checklist', text], ['step', text], ['timeline', text],
#   ['table', [ [th, td, td, ...], ... ]]

ART = {}

# ---- choose-water-bottle-manufacturer ----
ART["choose"] = {
    "es": {
        "title": "Cómo Elegir un Fabricante de Botellas de Agua (Guía OEM/ODM) | STWADD",
        "meta": "Guía práctica para elegir un fabricante de botellas, termos o tazas en China: fábrica vs comerciante, certificaciones (ISO/FDA/LFGB), personalización OEM/ODM, MOQ y señales de alerta. Escrito por una fábrica de Yongkang.",
        "hero_tag": "GUÍA PARA COMPRADORES 01",
        "h1": "Cómo Elegir un Fabricante de Botellas de Agua (Guía para Compradores OEM/ODM)",
        "lead": "¿Abasteces botellas, termos, frascos o tazas aisladas desde China? Esta guía recorre las decisiones que realmente afectan tu costo, calidad y entrega: fábrica vs comerciante, certificaciones, personalización, MOQ y las señales de alerta que separan a los fabricantes serios de los intermediarios. Está escrita desde dentro de una fábrica de Yongkang, no desde un escritorio de marketing.",
        "body": [
            ["h2", "1. ¿Fábrica o empresa de comercio?"],
            ["p", "Para pedidos B2B al por mayor, un <b>fabricante (fábrica)</b> suele ser la mejor opción: menor costo unitario sin comisión de intermediario, control directo de calidad y plazos, y personalización más fácil (moldes, impresión, empaque). Una <b>empresa de comercio</b> puede servir si necesitas consolidar muchas categorías de productos no relacionadas con un solo proveedor, pero pagas un margen y pierdes visibilidad de la producción."],
            ["p", "La pregunta práctica no es \"¿qué modelo es mejor?\" sino <b>\"¿con cuál estoy tratando realmente?\"</b> Muchos proveedores se presentan como fábricas pero tercerizan todo. Verifica antes de comprometerte — nuestra <a href=\"/es/guides/verify-chinese-factory.html\" style=\"color:var(--blue)\">guía de verificación de fábrica</a> explica exactamente cómo."],
            ["h3", "Comparación rápida"],
            ["ul", [
                "<b>Fábrica:</b> precio menor, control de calidad directo, moldes propios, pero suele tener gama de productos más estrecha.",
                "<b>Comerciante:</b> catálogo más amplio, abastecimiento integral, pero precio mayor y menos control de producción.",
            ]],
            ["h2", "2. Certificaciones que realmente importan"],
            ["p", "Como mínimo, busca:"],
            ["ul", [
                "<b>ISO 9001</b> — sistema de gestión de calidad.",
                "<b>Cumplimiento de contacto con alimentos</b> — <b>FDA</b> de EE. UU. y <b>LFGB</b> de la UE para acero inoxidable y plástico.",
                "<b>Informes de prueba SGS / TUV</b> — pruebas de material y migración.",
                "<b>BSCI / auditoría social</b> — necesaria si vendes a minoristas de la UE.",
            ]],
            ["p", "Pide <b>certificados vigentes y con fecha</b>, no capturas de pantalla de hace años. Una fábrica creíble los tiene listos porque los compradores los solicitan constantemente para aduanas y cumplimiento de plataformas (Amazon)."],
            ["h2", "3. Personalización (OEM / ODM)"],
            ["p", "Decide pronto si necesitas:"],
            ["ul", [
                "<b>OEM (tu diseño):</b> tú aportas el arte/ forma; la fábrica produce e imprime tu logotipo.",
                "<b>ODM (diseño de la fábrica):</b> eliges entre los moldes existentes y aplicas tu marca — más rápido y económico para empezar.",
                "<b>Molde totalmente personalizado:</b> una forma nueva. Mayor costo y plazo, pero exclusiva para ti.",
            ]],
            ["p", "Capacidades a verificar: fabricación de moldes propia, impresión de logotipo (láser / serigrafía / UV), calcomanías por transferencia de agua, combinación de colores y empaque personalizado / cajas de regalo."],
            ["h2", "4. MOQ y plazos"],
            ["p", "Un <b>MOQ realista para artículos estándar con logotipo</b> suele empezar en torno a 500 piezas. Un molde nuevo totalmente personalizado se cotiza caso por caso. Confirma siempre si el MOQ es por color, por diseño o total — los proveedores lo definen de forma distinta."],
            ["p", "<b>Plazos típicos:</b> 25–35 días de producción estándar tras el depósito; 15–20 días urgente; 5–7 días para muestras. Varían con la complejidad del pedido y la temporada (periodos pre navideños son ocupados)."],
            ["h2", "5. Señales de alerta a evitar"],
            ["checklist", "<b>Rechaza un recorrido en video en vivo</b> de las instalaciones, o solo muestra una oficina genérica."],
            ["checklist", "<b>Sin licencia comercial ni registro de exportación</b> que pueda compartir."],
            ["checklist", "<b>No puede aportar certificados con fecha</b> — solo capturas viejas o con marca de agua."],
            ["checklist", "<b>Precios muy por debajo del mercado</b> con especificaciones vagas (suele indicar materiales de grado inferior sustituidos)."],
            ["checklist", "<b>Presión para pagar 100% por adelantado</b> — las fábricas legítimas suelen aceptar depósito + saldo contra documentos de envío."],
        ],
        "faq": [
            ("¿Debo comprar a una fábrica o a una empresa de comercio?",
             "Para pedidos B2B al por mayor, un fabricante (fábrica) suele ser mejor: obtienes menor costo unitario sin margen de intermediario, control directo de calidad y plazos, y personalización más fácil (moldes, impresión, empaque). Una empresa de comercio puede servir si necesitas consolidar muchas categorías no relacionadas con un solo proveedor, pero pagas una comisión y pierdes visibilidad de la producción. La clave es verificar con cuál estás tratando realmente."),
            ("¿Qué certificaciones debe tener un fabricante de artículos de bebida?",
             "Como mínimo busca ISO 9001 (gestión de calidad) y cumplimiento de material/contacto con alimentos: FDA de EE. UU. y LFGB de la UE para acero inoxidable y plástico, además de informes de prueba SGS o TUV. Auditorías de cumplimiento social como BSCI importan si vendes a minoristas de la UE. Pide certificados vigentes y con fecha, no capturas de años atrás."),
            ("¿Cuál es un MOQ realista para botellas de agua personalizadas?",
             "Para artículos estándar con logotipo impreso, los MOQ suelen empezar en torno a 500 piezas. Un molde nuevo totalmente personalizado (forma nueva) es un compromiso mayor y se cotiza caso por caso. El MOQ negociable a menudo depende de la frecuencia de pedido y de si reutilizarás el molde. Confirma siempre si el MOQ es por color, por diseño o total."),
            ("¿Qué señales de alerta debo vigilar al elegir un proveedor?",
             "Las señales de alerta incluyen: rechazar una videollamada de las instalaciones, no tener licencia comercial ni registro de exportación, incapacidad de aportar certificados con fecha, precios muy por debajo del mercado con especificaciones vagas, y presión para pagar 100% por adelantado. Un fabricante genuino suele mostrar el taller, compartir auditorías y aceptar un depósito razonable + saldo contra documentos de envío."),
        ],
        "inquiry_h2": "STWADD es una Fábrica de Artículos de Bebida en Yongkang",
        "inquiry_p": "Somos fabricante OEM/ODM de botellas, termos, frascos y tazas aisladas, fundados en 2017, con ISO 9001, pruebas SGS/TUV y materiales conformes a FDA/LFGB. Precios directos de fábrica, MOQ desde ~500 pzas. Solicita una cotización.",
        "inquiry_a": "Solicitar Cotización",
        "footer_guides": [("Todas las Guías", "index"), ("304 vs 316 Acero", "304-vs-316-stainless-steel"), ("Verificar una Fábrica", "verify-chinese-factory"), ("MOQ para Vendedores", "moq-lead-time-ecommerce")],
    },
    "pt": {
        "title": "Como Escolher um Fabricante de Garrafas de Água (Guia OEM/ODM) | STWADD",
        "meta": "Guia prático para escolher um fabricante de garrafas, canecas ou copos no Brasil/China: fábrica vs comerciante, certificações (ISO/FDA/LFGB), personalização OEM/ODM, MOQ e sinais de alerta. Escrito por uma fábrica de Yongkang.",
        "hero_tag": "GUIA PARA COMPRADORES 01",
        "h1": "Como Escolher um Fabricante de Garrafas de Água (Guia para Compradores OEM/ODM)",
        "lead": "Está comprando garrafas, canecas, frascos ou copos isolados da China? Este guia percorre as decisões que realmente afetam seu custo, qualidade e entrega: fábrica vs comerciante, certificações, personalização, MOQ e os sinais de alerta que separam fabricantes sérios de intermediários. Foi escrito de dentro de uma fábrica de Yongkang, não de uma mesa de marketing.",
        "body": [
            ["h2", "1. Fábrica ou empresa de comércio?"],
            ["p", "Para pedidos B2B em grande volume, um <b>fabricante (fábrica)</b> costuma ser a melhor opção: menor custo unitário sem comissão de intermediário, controle direto de qualidade e prazos, e personalização mais fácil (moldes, impressão, embalagem). Uma <b>empresa de comércio</b> pode ajudar se você precisa consolidar muitas categorias não relacionadas com um só fornecedor, mas você paga uma margem e perde visibilidade da produção."],
            ["p", "A pergunta prática não é \"qual modelo é melhor?\" e sim <b>\"com qual estou lidando realmente?\"</b> Muitos fornecedores se apresentam como fábricas mas terceirizam tudo. Verifique antes de se comprometer — nosso <a href=\"/pt/guides/verify-chinese-factory.html\" style=\"color:var(--blue)\">guia de verificação de fábrica</a> explica exatamente como."],
            ["h3", "Comparação rápida"],
            ["ul", [
                "<b>Fábrica:</b> preço menor, controle de qualidade direto, moldes próprios, mas geralmente gama de produtos mais estreita.",
                "<b>Comerciante:</b> catálogo mais amplo, abastecimento integral, mas preço maior e menos controle de produção.",
            ]],
            ["h2", "2. Certificações que realmente importam"],
            ["p", "No mínimo, procure:"],
            ["ul", [
                "<b>ISO 9001</b> — sistema de gestão de qualidade.",
                "<b>Conformidade de contato com alimentos</b> — <b>FDA</b> dos EUA e <b>LFGB</b> da UE para aço inoxidável e plástico.",
                "<b>Relatórios de teste SGS / TUV</b> — testes de material e migração.",
                "<b>BSCI / auditoria social</b> — necessária se vende a varejistas da UE.",
            ]],
            ["p", "Peça <b>certificados vigentes e datados</b>, não capturas de tela de anos atrás. Uma fábrica credível os mantém prontos porque os compradores os solicitam constantemente para alfândega e conformidade de plataformas (Amazon)."],
            ["h2", "3. Personalização (OEM / ODM)"],
            ["p", "Decida cedo se você precisa de:"],
            ["ul", [
                "<b>OEM (seu design):</b> você fornece a arte/ forma; a fábrica produz e imprime seu logotipo.",
                "<b>ODM (design da fábrica):</b> você escolhe entre os moldes existentes e aplica sua marca — mais rápido e barato para começar.",
                "<b>Molde totalmente personalizado:</b> uma forma nova. Maior custo e prazo, mas exclusiva para você.",
            ]],
            ["p", "Capacidades a verificar: fabricação de moldes própria, impressão de logotipo (láser / serigrafia / UV), adesivos por transferência de água, combinação de cores e embalagem personalizada / caixas de presente."],
            ["h2", "4. MOQ e prazos"],
            ["p", "Um <b>MOQ realista para itens padrão com logotipo</b> costuma começar em torno de 500 peças. Um molde novo totalmente personalizado é cotado caso a caso. Confirme sempre se o MOQ é por cor, por design ou total — fornecedores definem isso de forma diferente."],
            ["p", "<b>Prazos típicos:</b> 25–35 dias de produção padrão após o depósito; 15–20 dias urgente; 5–7 dias para amostras. Variam com a complexidade do pedido e a estação (períodos pré-festas são ocupados)."],
            ["h2", "5. Sinais de alerta a evitar"],
            ["checklist", "<b>Recusa de um tour por vídeo ao vivo</b> das instalações, ou mostra apenas um escritório genérico."],
            ["checklist", "<b>Sem licença comercial nem registro de exportação</b> que possa compartilhar."],
            ["checklist", "<b>Não consegue fornecer certificados datados</b> — apenas capturas antigas ou com marca d'água."],
            ["checklist", "<b>Preços muito abaixo do mercado</b> com especificações vagas (geralmente sinal de materiais de grau inferior substituídos)."],
            ["checklist", "<b>Pressão para pagar 100% adiantado</b> — fábricas legítimas costumam aceitar depósito + saldo contra documentos de envio."],
        ],
        "faq": [
            ("Devo comprar de uma fábrica ou de uma empresa de comércio?",
             "Para pedidos B2B em grande volume, um fabricante (fábrica) costuma ser melhor: você obtém menor custo unitário sem margem de intermediário, controle direto de qualidade e prazos, e personalização mais fácil (moldes, impressão, embalagem). Uma empresa de comércio pode ajudar se você precisa consolidar muitas categorias não relacionadas com um só fornecedor, mas paga uma comissão e perde visibilidade da produção. A chave é verificar com qual você está lidando realmente."),
            ("Quais certificações um fabricante de utensílios de bebida deve ter?",
             "No mínimo procure ISO 9001 (gestão de qualidade) e conformidade de material/contato com alimentos: FDA dos EUA e LFGB da UE para aço inoxidável e plástico, além de relatórios de teste SGS ou TUV. Auditorias de conformidade social como BSCI importam se você vende a varejistas da UE. Peça certificados vigentes e datados, não capturas de anos atrás."),
            ("Qual é um MOQ realista para garrafas de água personalizadas?",
             "Para itens padrão com logotipo impresso, os MOQ costumam começar em torno de 500 peças. Um molde novo totalmente personalizado (forma nova) é um compromisso maior e é cotado caso a caso. O MOQ negociável frequentemente depende da frequência de pedido e de se você reutilizará o molde. Confirme sempre se o MOQ é por cor, por design ou total."),
            ("Quais sinais de alerta devo observar ao escolher um fornecedor?",
             "Sinais de alerta incluem: recusar uma videoligação das instalações, não ter licença comercial nem registro de exportação, incapacidade de fornecer certificados datados, preços muito abaixo do mercado com especificações vagas, e pressão para pagar 100% adiantado. Um fabricante genuíno costuma mostrar a oficina, compartilhar auditorias e aceitar um depósito razoável + saldo contra documentos de envio."),
        ],
        "inquiry_h2": "STWADD é uma Fábrica de Utensílios de Bebida em Yongkang",
        "inquiry_p": "Somos fabricante OEM/ODM de garrafas, canecas, frascos e copos isolados, fundados em 2017, com ISO 9001, testes SGS/TUV e materiais conformes a FDA/LFGB. Preços diretos de fábrica, MOQ a partir de ~500 pçs. Solicite uma cotação.",
        "inquiry_a": "Solicitar Cotação",
        "footer_guides": [("Todos os Guias", "index"), ("304 vs 316 Aço", "304-vs-316-stainless-steel"), ("Verificar uma Fábrica", "verify-chinese-factory"), ("MOQ para Vendedores", "moq-lead-time-ecommerce")],
    },
    "ru": {
        "title": "Как выбрать производителя бутылок для воды (Руководство OEM/ODM) | STWADD",
        "meta": "Практическое руководство по выбору производителя бутылок, термокружек или фляг в Китае: фабрика против трейдера, сертификаты (ISO/FDA/LFGB), кастомизация OEM/ODM, MOQ и тревожные признаки. Написано фабрикой из Юнкана.",
        "hero_tag": "РУКОВОДСТВО ДЛЯ ПОКУПАТЕЛЕЙ 01",
        "h1": "Как выбрать производителя бутылок для воды (Руководство для покупателей OEM/ODM)",
        "lead": "Закупаете изолированные бутылки, термокружки, фляги или кружки в Китае? Это руководство разбирает решения, которые реально влияют на вашу цену, качество и сроки: фабрика против трейдера, сертификаты, кастомизация, MOQ и тревожные признаки, отличающие серьёзных производителей от посредников. Написано изнутри фабрики в Юнкане, а не маркетинговым отделом.",
        "body": [
            ["h2", "1. Фабрика или торговая компания?"],
            ["p", "Для оптовых B2B-заказов <b>производитель (фабрика)</b> обычно предпочтительнее: меньшая себестоимость без наценки посредника, прямой контроль качества и сроков, и проще кастомизация (пресс-формы, печать, упаковка). <b>Торговая компания</b> может пригодиться, если нужно собрать много несвязанных категорий у одного поставщика, но вы платите комиссию и теряете видимость производства."],
            ["p", "Практичный вопрос не \"какая модель лучше?\", а <b>\"с кем я на самом деле имею дело?\"</b> Многие поставщики выдают себя за фабрики, но всё отдают на аутсорс. Проверяйте до того, как обязаться — наше <a href=\"/ru/guides/verify-chinese-factory.html\" style=\"color:var(--blue)\">руководство по проверке фабрики</a> объясняет точно как."],
            ["h3", "Быстрое сравнение"],
            ["ul", [
                "<b>Фабрика:</b> ниже цена, прямой контроль качества, собственные пресс-формы, но обычно уже ассортимент.",
                "<b>Трейдер:</b> шире каталог, закупка под ключ, но выше цена и меньше контроля производства.",
            ]],
            ["h2", "2. Сертификаты, которые действительно важны"],
            ["p", "Как минимум ищите:"],
            ["ul", [
                "<b>ISO 9001</b> — система менеджмента качества.",
                "<b>Соответствие контакту с пищей</b> — <b>FDA</b> США и <b>LFGB</b> ЕС для нержавеющей стали и пластика.",
                "<b>Отчёты об испытаниях SGS / TUV</b> — испытания материала и миграции.",
                "<b>BSCI / социальный аудит</b> — нужно при продаже розничным сетям ЕС.",
            ]],
            ["p", "Запрашивайте <b>действующие, датированные сертификаты</b>, а не скриншоты многолетней давности. Надёжная фабрика держит их под рукой, потому что покупатели постоянно требуют их для таможни и соответствия платформ (Amazon)."],
            ["h2", "3. Кастомизация (OEM / ODM)"],
            ["p", "Заранее решите, нужно ли вам:"],
            ["ul", [
                "<b>OEM (ваш дизайн):</b> вы даёте макет/форму; фабрика производит и наносит ваш логотип.",
                "<b>ODM (дизайн фабрики):</b> вы выбираете из существующих пресс-форм и наносите бренд — быстрее и дешевле начать.",
                "<b>Полностью индивидуальная пресс-форма:</b> новая форма. Выше цена и срок, но эксклюзивно для вас.",
            ]],
            ["p", "Что проверить: собственное изготовление пресс-форм, нанесение логотипа (лазер / шелкография / УФ), деколи, подбор цвета и индивидуальная упаковка / подарочные коробки."],
            ["h2", "4. MOQ и сроки"],
            ["p", "Реалистичный <b>MOQ для стандартных позиций с логотипом</b> обычно начинается с ~500 штук. Полностью индивидуальная новая пресс-форма котируется отдельно. Всегда уточняйте, считается MOQ на цвет, на дизайн или общий — поставщики определяют это по-разному."],
            ["p", "<b>Типичные сроки:</b> 25–35 дней стандартного производства после депозита; 15–20 дней срочно; 5–7 дней на образцы. Зависят от сложности заказа и сезона (предпраздничные периоды загружены)."],
            ["h2", "5. Тревожные признаки, которых стоит избегать"],
            ["checklist", "<b>Отказ от живого видео-тура</b> цеха или показ только общего офиса."],
            ["checklist", "<b>Нет лицензии или экспортных записей</b>, которыми могут поделиться."],
            ["checklist", "<b>Не может предоставить датированные сертификаты</b> — только старые или с водяными знаками скриншоты."],
            ["checklist", "<b>Цены намного ниже рынка</b> с расплывчатыми спецификациями (часто признак замены на материал низшего сорта)."],
            ["checklist", "<b>Давление заплатить 100% авансом</b> — легитимные фабрики обычно принимают депозит + остаток против отгрузочных документов."],
        ],
        "faq": [
            ("Покупать у фабрики или у торговой компании?",
             "Для оптовых B2B-заказов производитель (фабрика) обычно лучше: вы получаете меньшую себестоимость без наценки посредника, прямой контроль качества и сроков, и проще кастомизация (пресс-формы, печать, упаковка). Торговая компания может пригодиться, если нужно собрать много несвязанных категорий у одного поставщика, но вы платите комиссию и теряете видимость производства. Ключ — проверить, с кем вы на самом деле имеете дело."),
            ("Какие сертификаты должен иметь производитель посуды?",
             "Как минимум ищите ISO 9001 (менеджмент качества) и соответствие материала/контакта с пищей: FDA США и LFGB ЕС для нержавеющей стали и пластика, а также отчёты об испытаниях SGS или TUV. Социальные аудиты вроде BSCI важны при продаже розничным сетям ЕС. Запрашивайте действующие, датированные сертификаты, а не скриншоты прошлых лет."),
            ("Какой реалистичный MOQ для индивидуальных бутылок?",
             "Для стандартных позиций с нанесённым логотипом MOQ обычно начинается с ~500 штук. Полностью индивидуальная новая пресс-форма (новая форма) — большее обязательство и котируется отдельно. MOQ часто зависит от частоты заказов и того, будете ли переиспользовать пресс-форму. Всегда уточняйте, считается он на цвет, на дизайн или общий."),
            ("Какие тревожные признаки искать при выборе поставщика?",
             "Тревожные признаки: отказ от видеозвонка цеха, отсутствие лицензии или экспортных записей, невозможность предоставить датированные сертификаты, цены намного ниже рынка с расплывчатыми спецификациями и давление заплатить 100% авансом. Настоящий производитель обычно рад показать цех, поделиться аудитами и принять разумный депозит + остаток против отгрузочных документов."),
        ],
        "inquiry_h2": "STWADD — фабрика посуды в Юнкане",
        "inquiry_p": "Мы — производитель OEM/ODM изолированных бутылок, термокружек, фляг и кружек, основанный в 2017, с ISO 9001, испытаниями SGS/TUV и материалами, соответствующими FDA/LFGB. Прямые заводские цены, MOQ от ~500 шт. Запросите смету.",
        "inquiry_a": "Запросить смету",
        "footer_guides": [("Все руководства", "index"), ("304 vs 316 сталь", "304-vs-316-stainless-steel"), ("Проверить фабрику", "verify-chinese-factory"), ("MOQ для продавцов", "moq-lead-time-ecommerce")],
    },
    "ar": {
        "title": "كيفية اختيار مصنع زجاجات الماء (دليل OEM/ODM) | STWADD",
        "meta": "دليل عملي لاختيار مصنع زجاجات أو قوارير أو كؤوس من الصين: المصنع مقابل الوسيط، الشهادات (ISO/FDA/LFGB)، التخصيص OEM/ODM، الحد الأدنى للطلب وعلامات التحذير. كُتب بواسطة مصنع في يونكانغ.",
        "hero_tag": "دليل المشترين 01",
        "h1": "كيفية اختيار مصنع زجاجات الماء (دليل المشترين OEM/ODM)",
        "lead": "هل تشتري زجاجات معزولة أو قوارير أو كؤوس من الصين؟ يستعرض هذا الدليل القرارات التي تؤثر فعليًا على تكلفتك وجودتك ومدة التسليم: المصنع مقابل الوسيط، الشهادات، التخصيص، الحد الأدنى للطلب، وعلامات التحذير التي تفصل المصانع الجادة عن الوسطاء. كُتب من داخل مصنع في يونكانغ، لا من مكتب تسويق.",
        "body": [
            ["h2", "1. مصنع أم شركة تجارة؟"],
            ["p", "بالنسبة للطلبات بالجملة B2B، يكون <b>المصنع</b> عادةً الخيار الأفضل: تكلفة وحدة أقل دون هامش وسيط، تحكم مباشر في الجودة والمدة، وتخصيص أسهل (قوالب وطباعة وتغليف). قد تفيد <b>شركة التجارة</b> إذا احتجت لجمع فئات منتجات غير مرتبطة من مورّد واحد، لكنك تدفع عمولة وتفقد رؤية الإنتاج."],
            ["p", "السؤال العملي ليس \"أي نموذج أفضل؟\" بل <b>\"مع من أتعامل فعليًا؟\"</b> يدّعي كثير من الموردين أنهم مصانع لكنهم يستعينون بغيرهم. تحقق قبل الالتزام — <a href=\"/ar/guides/verify-chinese-factory.html\" style=\"color:var(--blue)\">دليل التحقق من المصنع</a> يشرح بالضبط كيف."],
            ["h3", "مقارنة سريعة"],
            ["ul", [
                "<b>المصنع:</b> سعر أقل، تحكم مباشر بالجودة، قوالب خاصة، لكن عادة نطاق منتجات أضيق.",
                "<b>الوسيط:</b> كتالوج أوسع، توريد متكامل، لكن سعر أعلى وتحكم أقل في الإنتاج.",
            ]],
            ["h2", "2. الشهادات التي تهم فعلًا"],
            ["p", "على الأقل ابحث عن:"],
            ["ul", [
                "<b>ISO 9001</b> — نظام إدارة الجودة.",
                "<b>الامتثال للتلامس مع الغذاء</b> — <b>FDA</b> الأمريكية و<b>LFGB</b> الأوروبية للفولاذ والمواد البلاستيكية.",
                "<b>تقارير فحص SGS / TUV</b> — اختبارات المادة والهجرة.",
                "<b>BSCI / تدقيق اجتماعي</b> — ضروري إن كنت تبيع لمنافذ البيع بالتجزئة في الاتحاد الأوروبي.",
            ]],
            ["p", "اطلب <b>شهادات سارية ومؤرخة</b>، لا لقطات شاشة قديمة. المصنع الموثوق يجهزها لأن المشترين يطلبونها باستمرار للجمارك وامتثال المنصات (أمازون)."],
            ["h2", "3. التخصيص (OEM / ODM)"],
            ["p", "حدد مبكرًا ما تحتاجه:"],
            ["ul", [
                "<b>OEM (تصميمك):</b> توفر الفن/الشكل؛ والمصنع ينتج ويطبع شعارك.",
                "<b>ODM (تصميم المصنع):</b> تختار من القوالب القائمة وتطبق علامتك — أسرع وأرخص للبدء.",
                "<b>قالب مخصص بالكامل:</b> شكل جديد. تكلفة ومدة أعلى، لكن حصري لك.",
            ]],
            ["p", "قدرات للتحقق: صناعة قوالب ذاتية، طباعة الشعار (ليزر/حرير/UV)، ملصقات النقل المائي، مطابقة الألوان، وتغليف مخصص/صناديق هدايا."],
            ["h2", "4. الحد الأدنى للطلب والمدة"],
            ["p", "يبدأ <b>حد الطلب الأدنى لبنود قياسية مطبوع عليها شعار</b> عادةً عند ~500 قطعة. قالب جديد مخصص بالكامل يُسعّر حالة بحالة. تأكد دائمًا إن كان الحد للون أم للتصميم أم الإجمالي — يختلف تعريف الموردين."],
            ["p", "<b>المدد النموذجية:</b> 25–35 يوم إنتاج قياسي بعد الدفعة؛ 15–20 يوم عاجل؛ 5–7 أيام للعينات. تختلف حسب تعقيد الطلب والموسم (فترات ما قبل الأعياد مزدحمة)."],
            ["h2", "5. علامات التحذير الواجب تجنبها"],
            ["checklist", "<b>يرفض جولة فيديو مباشرة</b> للمنشأة، أو يعرض مكتبًا عامًا فقط."],
            ["checklist", "<b>لا رخصة تجارية ولا سجل تصدير</b> يمكنه مشاركتها."],
            ["checklist", "<b>لا يستطيع تقديم شهادات مؤرخة</b> — فقط لقطات قديمة أو عليها علامة مائية."],
            ["checklist", "<b>أسعار أقل بكثير من السوق</b> مع مواصفات غامضة (غالبًا دليل على استبدال مواد بدرجة أدنى)."],
            ["checklist", "<b>ضغط لدفع 100% مقدمًا</b> — المصانع الشرعية عادة تقبل دفعة + رصيد مقابل مستندات الشحن."],
        ],
        "faq": [
            ("هل أشتري من مصنع أم من شركة تجارة؟",
             "لطلبات الجملة B2B، يكون المصنع عادةً أفضل: تحصل على تكلفة وحدة أقل دون هامش وسيط، تحكم مباشر بالجودة والمدة، وتخصيص أسهل (قوالب وطباعة وتغليف). قد تفيد شركة التجارة إن احتجت لجمع فئات غير مرتبطة من مورد واحد، لكنك تدفع عمولة وتفقد رؤية الإنتاج. المفتاح هو التحقق من الجهة التي تتعامل معها فعليًا."),
            ("ما الشهادات التي يجب أن يملكها مصنع أواني الشرب؟",
             "على الأقل ابحث عن ISO 9001 (إدارة الجودة) والامتثال المادي/للتلامس مع الغذاء: FDA الأمريكية وLFGB الأوروبية للفولاذ والمواد البلاستيكية، إضافة لتقارير فحص SGS أو TUV. تدقيقات الامتثال الاجتماعي مثل BSCI مهمة إن كنت تبيع لمنافذ الاتحاد الأوروبي. اطلب شهادات سارية ومؤرخة، لا لقطات أعوام مضت."),
            ("ما حد الطلب الأدنى الواقعي لزجاجات ماء مخصصة؟",
             "للبنود القياسية المطبوع عليها شعار، يبدأ الحد الأدنى عادةً عند ~500 قطعة. قالب جديد مخصص بالكامل (شكل جديد) التزام أكبر ويُسعّر حالة بحالة. كثيرًا ما يتوقف الحد القابل للتفاوض على تكرار الطلبات وعلى ما إن كنت ستعيد استخدام القالب. تأكد دائمًا إن كان الحد للون أم للتصميم أم الإجمالي."),
            ("ما علامات التحذير التي أراقبها عند اختيار المورد؟",
             "علامات التحذير تشمل: رفض مكالمة فيديو للمنشأة، عدم وجود رخصة تجارية أو سجل تصدير، العجز عن تقديم شهادات مؤرخة، أسعار أقل بكثير من السوق مع مواصفات غامضة، وضغط لدفع 100% مقدمًا. المصنع الحقيقي عادة يسرّ بإظهار الورشة ومشاركة التدقيقات وقبول دفعة معقولة + رصيد مقابل مستندات الشحن."),
        ],
        "inquiry_h2": "STWADD مصنع أواني شرب في يونكانغ",
        "inquiry_p": "نحن مصنع OEM/ODM لزجاجات معزولة وقوارير وكؤوس، أسسنا عام 2017، بحصولنا على ISO 9001 وفحوص SGS/TUV ومواد مطابقة لـ FDA/LFGB. أسعار مباشرة من المصنع، حد طلب من ~500 قطعة. اطلب عرض سعر.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_guides": [("كل الأدلة", "index"), ("304 مقابل 316 فولاذ", "304-vs-316-stainless-steel"), ("تحقق من مصنع", "verify-chinese-factory"), ("حد الطلب لبائعين", "moq-lead-time-ecommerce")],
    },
}

# ---- 304-vs-316-stainless-steel ----
ART["steel"] = {
    "es": {
        "title": "Acero Inoxidable 304 vs 316 — Qué Elegir para tu Marca | STWADD",
        "meta": "304 (18/8) vs 316 para botellas, termos y frascos: resistencia a la corrosión, costo, seguridad y cuándo el 316 vale la pena. Guía para marcas que compran en China.",
        "hero_tag": "GUÍA PARA COMPRADORES 02",
        "h1": "Acero Inoxidable 304 vs 316: Qué Elegir para tu Marca de Artículos de Bebida",
        "lead": "Tanto el 304 como el 316 son aceros inoxidables austeníticos de grado alimentario usados en artículos premium. La diferencia está en la resistencia a la corrosión y el precio. Esta guía explica qué significa cada grado para botellas, termos y frascos, y cuándo pagar más por el 316 tiene sentido para tu marca.",
        "body": [
            ["h2", "Qué significan los números"],
            ["p", "<b>304 (18/8):</b> 18% cromo, 8% níquel. El caballo de batalla global del acero inoxidable de grado alimentario y el estándar para la mayoría de botellas y termos aislados."],
            ["p", "<b>316 (18/10 / \"grado marino\"):</b> añade 2–3% de <b>molibdeno</b>, que mejora significativamente la resistencia a cloruros y a la corrosión por picaduras. A menudo llamado \"grado quirúrgico\" en marketing."],
            ["h2", "Comparación cara a cara"],
            ["table", [
                ["Propiedad", "304 (18/8)", "316"],
                ["Resistencia a la corrosión", "Excelente para uso diario", "Superior — resiste cloruros, ácidos, picaduras"],
                ["Mejor para", "Botellas, termos y frascos diarios", "Costa/exterior, bebidas cítricas/ácidas, premium y médico"],
                ["Seguridad alimentaria", "Cumple FDA y LFGB", "Cumple FDA y LFGB"],
                ["Costo", "Base (más rentable)", "Pequeña prima por unidad"],
                ["Posición de mercado", "\"Grado alimentario estándar\"", "\"Premium / grado quirúrgico\""],
            ]],
            ["h2", "Cuándo el 304 es la elección correcta"],
            ["p", "Para la abrumadora mayoría de botellas de agua aisladas, termos de viaje y frascos al vacío, <b>el 304 es la elección correcta, segura y rentable</b>. Es totalmente seguro para alimentos, resistente a la oxidación en uso normal y cumple FDA (EE. UU.) y LFGB (UE). Elegir 304 te permite mantener el costo unitario bajo sin comprometer la seguridad."],
            ["h2", "Cuándo el 316 vale la prima"],
            ["ul", [
                "<b>Mercados al aire libre / costa / húmedos</b> donde la corrosión por salitre es un riesgo real.",
                "<b>Bebidas ácidas o cítricas</b> (agua con limón, electrolitos deportivos) en contacto prolongado.",
                "<b>Posicionamiento premium</b> — \"316 grado quirúrgico\" es un fuerte argumento de venta para líneas de gama alta.",
                "<b>Productos para bebés / médicos / uso sensible</b> donde se comercializa máxima inercia.",
            ]],
            ["p", "Si estás construyendo una línea insignia premium, ofrecer el 316 como nivel superior es una estrategia común y efectiva."],
            ["h2", "Nota sobre \"18/8\" vs \"18/10\""],
            ["p", "Verás ambos. 18/8 y 18/10 son nombres de marketing para aceros tipo 304 (la cifra de níquel se redondea). El verdadero 316 suele etiquetarse 18/10 con molibdeno. Pide siempre a tu fabricante el <b>certificado de material</b> en lugar de confiar solo en la etiqueta — una fábrica real aporta informes de prueba de material SGS/TUV."],
        ],
        "faq": [
            ("¿Es seguro el acero inoxidable 304 para botellas de agua?",
             "Sí. El 304 (18/8) es de grado alimentario y el estándar global para artículos de bebida. Contiene 18% cromo y 8% níquel, resiste óxido y lixiviación en uso normal, y cumple FDA (EE. UU.) y LFGB (UE) para contacto con alimentos. La gran mayoría de botellas y termos aislados de calidad usan 304."),
            ("¿Cuándo vale la pena el acero inoxidable 316 sobre el costo extra?",
             "El 316 añade molibdeno, que mejora la resistencia a cloruros y contenidos ácidos (cítricos, bebidas deportivas) y a la corrosión por picaduras en ambientes costeros/húmedos. Vale la prima para líneas premium/marinas/exterior, productos médicos o infantiles, o cuando comercializas posicionamiento \"grado quirúrgico\". Para botellas diarias, el 304 es suficiente y más rentable."),
            ("¿Es el 316 mucho más caro que el 304?",
             "El material 316 cuesta más que el 304 (contenido de níquel y molibdeno), pero en una botella terminada la diferencia de precio unitario suele ser modesta porque el material es solo parte del costo total (moldes, impresión, mano de obra, empaque). Espera una pequeña prima por unidad; el mayor factor de costo es el volumen de pedido y la personalización, no solo el grado de acero."),
        ],
        "inquiry_h2": "¿Necesitas Botellas de 304 o 316?",
        "inquiry_p": "STWADD es una fábrica de Yongkang que produce botellas, termos y frascos aislados tanto en acero inoxidable 304 como 316 de grado alimentario, con materiales conformes a FDA/LFGB e informes de prueba SGS. OEM/ODM directo de fábrica.",
        "inquiry_a": "Solicitar Cotización",
        "footer_guides": [("Todas las Guías", "index"), ("Elegir un Fabricante", "choose-water-bottle-manufacturer"), ("Verificar una Fábrica", "verify-chinese-factory"), ("Comparativa de Materiales", "drinkware-material-comparison")],
    },
    "pt": {
        "title": "Aço Inoxidável 304 vs 316 — Qual Escolher para sua Marca | STWADD",
        "meta": "304 (18/8) vs 316 para garrafas, canecas e frascos: resistência à corrosão, custo, segurança e quando o 316 vale a pena. Guia para marcas que compram na China.",
        "hero_tag": "GUIA PARA COMPRADORES 02",
        "h1": "Aço Inoxidável 304 vs 316: Qual Escolher para sua Marca de Utensílios de Bebida",
        "lead": "Tanto o 304 quanto o 316 são aços inoxidáveis austeníticos de grau alimentar usados em utensílios premium. A diferença está na resistência à corrosão e no preço. Este guia explica o que cada grau significa para garrafas, canecas e frascos, e quando pagar mais pelo 316 faz sentido para sua marca.",
        "body": [
            ["h2", "O que os números significam"],
            ["p", "<b>304 (18/8):</b> 18% cromo, 8% níquel. O trabalho pesado global do aço inoxidável de grau alimentar e o padrão para a maioria das garrafas e canecas isoladas."],
            ["p", "<b>316 (18/10 / \"grau marinho\"):</b> adiciona 2–3% de <b>molibdênio</b>, que melhora significativamente a resistência a cloretos e à corrosão por picadas. Muitas vezes chamado de \"grau cirúrgico\" no marketing."],
            ["h2", "Comparação lado a lado"],
            ["table", [
                ["Propriedade", "304 (18/8)", "316"],
                ["Resistência à corrosão", "Excelente para uso diário", "Superior — resiste cloretos, ácidos, picadas"],
                ["Melhor para", "Garrafas, canecas e frascos diários", "Litoral/exterior, bebidas cítricas/ácidas, premium e médico"],
                ["Segurança alimentar", "Cumpre FDA e LFGB", "Cumpre FDA e LFGB"],
                ["Custo", "Base (mais econômico)", "Pequena prima por unidade"],
                ["Posição de mercado", "\"Grau alimentar padrão\"", "\"Premium / grau cirúrgico\""],
            ]],
            ["h2", "Quando o 304 é a escolha certa"],
            ["p", "Para a esmagadora maioria das garrafas de água isoladas, canecas de viagem e frascos a vácuo, <b>o 304 é a escolha correta, segura e econômica</b>. É totalmente seguro para alimentos, resistente à ferrugem em uso normal e cumpre FDA (EUA) e LFGB (UE). Escolher 304 mantém o custo unitário baixo sem comprometer a segurança."],
            ["h2", "Quando o 316 vale a prima"],
            ["ul", [
                "<b>Mercados ao ar livre / litoral / úmidos</b> onde a corrosão por salitre é um risco real.",
                "<b>Bebidas ácidas ou cítricas</b> (água com limão, eletrólitos esportivos) em contato prolongado.",
                "<b>Posicionamento premium</b> — \"316 grau cirúrgico\" é um forte argumento de venda para linhas de alta gama.",
                "<b>Produtos para bebês / médicos / uso sensível</b> onde se comercializa máxima inércia.",
            ]],
            ["p", "Se você está construindo uma linha premium de ponta, oferecer o 316 como nível superior é uma estratégia comum e eficaz."],
            ["h2", "Nota sobre \"18/8\" vs \"18/10\""],
            ["p", "Você verá ambos. 18/8 e 18/10 são nomes de marketing para aços tipo 304 (o valor de níquel é arredondado). O verdadeiro 316 geralmente é rotulado 18/10 com molibdênio. Peça sempre ao seu fabricante o <b>certificado de material</b> em vez de confiar apenas no rótulo — uma fábrica real fornece relatórios de teste de material SGS/TUV."],
        ],
        "faq": [
            ("O aço inoxidável 304 é seguro para garrafas de água?",
             "Sim. O 304 (18/8) é de grau alimentar e o padrão global para utensílios de bebida. Contém 18% cromo e 8% níquel, resiste ferrugem e lixiviação em uso normal, e cumpre FDA (EUA) e LFGB (UE) para contato com alimentos. A grande maioria das garrafas e canecas isoladas de qualidade usa 304."),
            ("Quando o aço inoxidável 316 vale o custo extra?",
             "O 316 adiciona molibdênio, que melhora a resistência a cloretos e conteúdos ácidos (cítricos, bebidas esportivas) e à corrosão por picadas em ambientes litorais/úmidos. Vale a prima para linhas premium/marinhas/exterior, produtos médicos ou infantis, ou quando comercializa posicionamento \"grau cirúrgico\". Para garrafas diárias, o 304 é suficiente e mais econômico."),
            ("O 316 é muito mais caro que o 304?",
             "O material 316 custa mais que o 304 (níquel e molibdênio), mas em uma garrafa final a diferença de preço unitário costuma ser modesta porque o material é só parte do custo total (moldes, impressão, mão de obra, embalagem). Espere uma pequena prima por unidade; o maior fator de custo é o volume de pedido e a personalização, não apenas o grau do aço."),
        ],
        "inquiry_h2": "Precisa de Garrafas de 304 ou 316?",
        "inquiry_p": "STWADD é uma fábrica de Yongkang que produz garrafas, canecas e frascos isolados tanto em aço inoxidável 304 quanto 316 de grau alimentar, com materiais conformes a FDA/LFGB e relatórios de teste SGS. OEM/ODM direto de fábrica.",
        "inquiry_a": "Solicitar Cotação",
        "footer_guides": [("Todos os Guias", "index"), ("Escolher um Fabricante", "choose-water-bottle-manufacturer"), ("Verificar uma Fábrica", "verify-chinese-factory"), ("Comparação de Materiais", "drinkware-material-comparison")],
    },
    "ru": {
        "title": "Нержавеющая сталь 304 против 316 — что выбрать для бренда | STWADD",
        "meta": "304 (18/8) против 316 для бутылок, термокружек и фляг: коррозионная стойкость, цена, безопасность и когда 316 того стоит. Руководство для брендов, закупающих в Китае.",
        "hero_tag": "РУКОВОДСТВО ДЛЯ ПОКУПАТЕЛЕЙ 02",
        "h1": "Нержавеющая сталь 304 против 316: что выбрать для вашего бренда посуды",
        "lead": "И 304, и 316 — пищевые аустенитные нержавеющие стали, используемые в премиальной посуде. Разница — в коррозионной стойкости и цене. Это руководство объясняет, что значит каждая марка для бутылок, термокружек и фляг, и когда переплата за 316 имеет смысл для вашего бренда.",
        "body": [
            ["h2", "Что означают цифры"],
            ["p", "<b>304 (18/8):</b> 18% хрома, 8% никеля. Мировая работа лошадка пищевой нержавеющей стали и стандарт для большинства изолированных бутылок и кружек."],
            ["p", "<b>316 (18/10 / \"морская\"):</b> добавляет 2–3% <b>молибдена</b>, что заметно повышает стойкость к хлоридам и точечной коррозии. В маркетинге часто называется \"хирургической\"."],
            ["h2", "Сравнение бок о бок"],
            ["table", [
                ["Свойство", "304 (18/8)", "316"],
                ["Коррозионная стойкость", "Отлично для повседневного использования", "Выше — стойкость к хлоридам, кислотам, точечной коррозии"],
                ["Лучше всего для", "Ежедневные бутылки, кружки, фляги", "Побережье/наружное, цитрусовые/кислые напитки, премиум и медицина"],
                ["Пищевая безопасность", "Соответствует FDA и LFGB", "Соответствует FDA и LFGB"],
                ["Цена", "Базовая (наиболее экономичная)", "Небольшая надбавка за единицу"],
                ["Рыночная позиция", "\"Стандартная пищевая\"", "\"Премиум / хирургическая\""],
            ]],
            ["h2", "Когда 304 — правильный выбор"],
            ["p", "Для подавляющего большинства изолированных бутылок для воды, дорожных кружек и вакуумных фляг <b>304 — правильный, безопасный и экономичный выбор</b>. Он полностью пищевой, устойчив к ржавчине при нормальном использовании и соответствует FDA (США) и LFGB (ЕС). Выбор 304 позволяет держать себестоимость низкой без ущерба безопасности."],
            ["h2", "Когда 316 оправдывает надбавку"],
            ["ul", [
                "<b>Рынки на открытом воздухе / побережье / влажные</b>, где точечная коррозия от соли — реальный риск.",
                "<b>Кислые или цитрусовые напитки</b> (вода с лимоном, спортивные электролиты) при длительном контакте.",
                "<b>Премиальное позиционирование</b> — \"316 хирургическая\" — сильный аргумент для линеек высокого класса.",
                "<b>Детские / медицинские / чувствительные продукты</b>, где продвигается максимальная инертность.",
            ]],
            ["p", "Если вы создаёте флагманскую премиальную линейку, предложение 316 как повышенного уровня — распространённая и эффективная стратегия."],
            ["h2", "Заметка о \"18/8\" против \"18/10\""],
            ["p", "Вы встретите оба. 18/8 и 18/10 — маркетинговые названия сталей типа 304 (значение никеля округлено). Настоящая 316 обычно маркируется 18/10 с молибденом. Всегда запрашивайте у производителя <b>сертификат материала</b>, а не доверяйте только этикетке — настоящая фабрика предоставляет отчёты об испытаниях материала SGS/TUV."],
        ],
        "faq": [
            ("Безопасна ли нержавеющая сталь 304 для бутылок с водой?",
             "Да. 304 (18/8) — пищевая сталь и мировой стандарт для посуды. Содержит 18% хрома и 8% никеля, устойчива к ржавчине и вымыванию при нормальном использовании и соответствует FDA (США) и LFGB (ЕС) для контакта с пищей. Подавляющее большинство качественных изолированных бутылок и кружек использует 304."),
            ("Когда нержавеющая 316 оправдывает переплату?",
             "316 добавляет молибден, повышающий стойкость к хлоридам и кислому содержимому (цитрус, спортивные напитки) и к точечной коррозии в прибрежных/влажных условиях. Оправдана для премиальных/морских/наружных линеек, медицинских или детских товаров, либо при позиционировании \"хирургическая\". Для повседневных бутылок 304 достаточно и экономичнее."),
            ("316 намного дороже 304?",
             "Материал 316 дороже 304 (никель и молибден), но на готовой бутылке разница в цене за единицу обычно скромная, поскольку материал — лишь часть общей себестоимости (пресс-формы, печать, труд, упаковка). Ждите небольшую надбавку за единицу; главный фактор цены — объём заказа и кастомизация, а не только марка стали."),
        ],
        "inquiry_h2": "Нужны бутылки из 304 или 316?",
        "inquiry_p": "STWADD — фабрика в Юнкане, производящая изолированные бутылки, кружки и фляги как из пищевой нержавеющей стали 304, так и 316, с материалами, соответствующими FDA/LFGB, и отчётами SGS. OEM/ODM напрямую с завода.",
        "inquiry_a": "Запросить смету",
        "footer_guides": [("Все руководства", "index"), ("Выбрать производителя", "choose-water-bottle-manufacturer"), ("Проверить фабрику", "verify-chinese-factory"), ("Сравнение материалов", "drinkware-material-comparison")],
    },
    "ar": {
        "title": "الفولاذ المقاوم للصدأ 304 مقابل 316 — أيّهما لعلامتك | STWADD",
        "meta": "304 (18/8) مقابل 316 لزجاجات والمفاتم والقوارير: مقاومة التآكل، التكلفة، السلامة، ومتى يستحق 316 العلاوة. دليل للعلامات التي تشتري من الصين.",
        "hero_tag": "دليل المشترين 02",
        "h1": "الفولاذ المقاوم للصدأ 304 مقابل 316: أيّهما تختار لعلامتك التجارية",
        "lead": "كل من 304 و316 فولاذ مقاوم للصدأ أوستنيتي بدرجة غذائية يُستخدم في الأواني الفاخرة. الفرق يكمن في مقاومة التآكل والسعر. يشرح هذا الدليل ما يعنيه كل درجة لزجاجات والمفاتم والقوارير، ومتى يكون دفع المزيد مقابل 316 منطقيًا لعلامتك.",
        "body": [
            ["h2", "ماذا تعني الأرقام"],
            ["p", "<b>304 (18/8):</b> 18% كروم، 8% نيكل. العملة العالمية للفولاذ المقاوم للصدأ بدرجة غذائية والمعيار لمعظم الزجاجات والمفاتم المعزولة."],
            ["p", "<b>316 (18/10 / \"درجة بحرية\"):</b> يضيف 2–3% <b>موليبدنوم</b>، ما يحسّن مقاومة الكلوريدات والتآكل النقرى بشكل كبير. يُسمى غالبًا \"درجة جراحية\" في التسويق."],
            ["h2", "مقارنة وجهًا لوجه"],
            ["table", [
                ["الخاصية", "304 (18/8)", "316"],
                ["مقاومة التآكل", "ممتازة للاستخدام اليومي", "أعلى — تقاوم الكلوريدات والأحماض والنقر"],
                ["الأفضل لـ", "زجاجات ومفاتم وقوارير يومية", "ساحلي/خارجي، مشروبات حمضية/حمضيات، فاخر وطبي"],
                ["سلامة الغذاء", "مطابق FDA وLFGB", "مطابق FDA وLFGB"],
                ["التكلفة", "أساس (الأكثر اقتصادية)", "علاوة بسيطة للوحدة"],
                ["الموقع السوقي", "\"درجة غذائية قياسية\"", "\"فاخر / درجة جراحية\""],
            ]],
            ["h2", "متى يكون 304 هو الاختيار الصحيح"],
            ["p", "بالنسبة للغالبية العظمى من زجاجات الماء المعزولة والمفاتم السفرية والقوارير المفرغة، <b>304 هو الاختيار الصحيح والآمن والاقتصادي</b>. غذائي بالكامل، مقاوم للصدأ في الاستخدام الطبيعي، ومطابق لـ FDA (أمريكا) وLFGB (أوروبا). اختيار 304 يبقي التكلفة للوحدة منخفضة دون المساس بالسلامة."],
            ["h2", "متى يستحق 316 العلاوة"],
            ["ul", [
                "<b>أسواق خارجية / ساحلية / رطبة</b> حيث تآكل الملح خطر حقيقي.",
                "<b>مشروبات حمضية أو حمضيات</b> (ماء بالليمون، مشروبات رياضية) عند ملامسة طويلة.",
                "<b>تموضع فاخر</b> — \"316 درجة جراحية\" حجة بيع قوية للخطوط الراقية.",
                "<b>منتجات أطفال / طبية / استخدام حساس</b> حيث تُسوّق أقصى خاملية.",
            ]],
            ["p", "إذا كنت تبني خطًّا فاخرًا رئيسيًا، فإن عرض 316 كمستوى أعلى استراتيجية شائعة وفعالة."],
            ["h2", "ملاحظة عن \"18/8\" مقابل \"18/10\""],
            ["p", "سترى كلاهما. 18/8 و18/10 أسماء تسويقية لفولاذ نوع 304 (رقم النيكل مدوّر). 316 الحقيقية تُوسم عادةً 18/10 مع موليبدنوم. اطلب دائمًا من مصنعك <b>شهادة المادة</b> بدلًا من الاعتماد على الملصق وحده — المصنع الحقيقي يقدم تقارير فحص المادة SGS/TUV."],
        ],
        "faq": [
            ("هل الفولاذ المقاوم للصدأ 304 آمن لزجاجات الماء؟",
             "نعم. 304 (18/8) بدرجة غذائية والمعيار العالمي للأواني. يحتوي 18% كروم و8% نيكل، يقاوم الصدأ والتسرب في الاستخدام الطبيعي، ويتوافق مع FDA (أمريكا) وLFGB (أوروبا) للتلامس مع الغذاء. الغالبية العظمى من الزجاجات والمفاتم المعزولة الجيدة تستخدم 304."),
            ("متى يستحق الفولاذ المقاوم للصدأ 316 التكلفة الإضافية؟",
             "316 يضيف موليبدنومًا يحسّن مقاومة الكلوريدات والمحتوى الحمضي (حمضيات ومشروبات رياضية) والتآكل النقرى في البيئات الساحلية/الرطبة. يستحق العلاوة لخطوط فاخرة/بحرية/خارجية، ومنتجات طبية أو أطفال، أو عند تسويق تموضع \"درجة جراحية\". للزجاجات اليومية، 304 كافٍ وأكثر اقتصادية."),
            ("هل 316 أغلى بكثير من 304؟",
             "مادة 316 أغلى من 304 (نيكل وموليبدنوم)، لكن على زجاجة تامة يكون فرق السعر للوحدة عادةً متواضعًا لأن المادة جزء فقط من التكلفة الكلية (قوالب وطباعة وعمل وتغليف). توقّع علاوة بسيطة للوحدة؛ المحرّك الأكبر للتكلفة هو حجم الطلب والتخصيص، لا درجة الفولاذ وحدها."),
        ],
        "inquiry_h2": "تحتاج زجاجات من 304 أو 316؟",
        "inquiry_p": "STWADD مصنع في يونكانغ ينتج زجاجات ومفاتم وقوارير معزولة من الفولاذ المقاوم للصدأ 304 و316 بدرجة غذائية، بمواد مطابقة لـ FDA/LFGB وتقارير فحص SGS. OEM/ODM مباشر من المصنع.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_guides": [("كل الأدلة", "index"), ("اختيار مصنع", "choose-water-bottle-manufacturer"), ("تحقق من مصنع", "verify-chinese-factory"), ("مقارنة المواد", "drinkware-material-comparison")],
    },
}

# ---- verify-chinese-factory ----
ART["verify"] = {
    "es": {
        "title": "Cómo Verificar que una Fábrica China de Artículos de Bebida es Real | STWADD",
        "meta": "Pasos prácticos para confirmar que un proveedor chino de botellas es un fabricante genuino, no una empresa de comercio: recorridos en video en vivo, inspecciones de terceros (SGS/BV), registros de exportación, ferias y licencia comercial.",
        "hero_tag": "GUÍA PARA COMPRADORES 03",
        "h1": "Cómo Verificar que una Fábrica China de Artículos de Bebida es Real (No un Comerciante)",
        "lead": "Muchas \"fábricas\" en plataformas B2B son en realidad empresas de comercio o agentes de abastecimiento de una persona. Para pedidos de bebidas al por mayor, confirmar que tratas con un fabricante genuino protege tu precio, calidad y plazos. Aquí tienes las verificaciones prácticas y de bajo costo que cualquier comprador puede hacer antes de comprometerse.",
        "body": [
            ["h2", "Verificación paso a paso"],
            ["step", "<b>1. Recorrido en video en vivo del taller.</b> Pide una videollamada en tiempo real recorriendo la línea de producción, no una oficina montada. Una fábrica puede mostrarte moldeado, impresión, ensamblaje y estaciones de control de calidad. Un comerciante eludirá o mostrará imágenes genéricas."],
            ["step", "<b>2. Revisa la licencia comercial.</b> Solicita la licencia comercial china (营业执照). Confirma que el <b>objeto social incluye fabricación</b>, no solo \"mayorista/comercio\". Verifica el código unificado de crédito social en registros oficiales cuando sea posible."],
            ["step", "<b>3. Pide certificados con fecha.</b> ISO 9001, más cumplimiento de material/contacto con alimentos (FDA de EE. UU., LFGB de la UE) e informes de prueba SGS/TUV. Las fábricas genuinas los mantienen vigentes porque los compradores los exigen constantemente."],
            ["step", "<b>4. Verifica registros de exportación.</b> Pide referencias, documentos de envío anteriores (redactados) o registros aduaneros. Los fabricantes establecidos tienen historial de exportación, no solo ventas domésticas."],
            ["step", "<b>5. Inspección de terceros.</b> Contrata a SGS, BV o TUV para visitar las instalaciones e informar. Esta es la prueba independiente más sólida y es práctica estándar antes de un primer pedido al por mayor."],
            ["step", "<b>6. Reúnase en una feria.</b> La Feria de Cantón y ferias regionales de ferretería/regalos son donde exponen las fábricas reales. Conocer en persona (o vía la lista oficial de expositores) suma confianza."],
            ["h2", "Fábrica vs comerciante — señales de comportamiento"],
            ["ul", [
                "<b>Fábrica:</b> posee moldes, muestra el taller, discute detalles de producción, acepta depósito + saldo, aporta informes de prueba con facilidad.",
                "<b>Comerciante:</b> vago en producción, empuja \"tenemos muchas fábricas socias\", hesita en recorridos en video, menos transparente en el desglose de precios.",
            ]],
            ["p", "Ninguno es automáticamente malo — los comerciantes cumplen una función — pero <b>debes saber con cuál estás pagando</b>, porque el perfil de precio y riesgo difiere."],
            ["h2", "Por qué la ubicación importa: Yongkang"],
            ["p", "Yongkang, Zhejiang — la \"Capital de las Tazas de China\" (中国口杯之都) — es el mayor clúster mundial de fabricación de artículos de bebida. Una fábrica allí tiene acceso directo a cadenas de suministro locales maduras, fabricantes de moldes y acabadores, por eso muchos fabricantes reales de botellas aisladas operan en la región. Cuando un proveedor dice Yongkang, puedes verificar la dirección física e incluso organizar una inspección local rápida más fácilmente."],
        ],
        "faq": [
            ("¿Cómo puedo saber si un proveedor chino es una fábrica o una empresa de comercio?",
             "Pide un recorrido en video en vivo de las líneas de producción (no solo una oficina), solicita la licencia comercial que muestre objeto de fabricación, y verifica si poseen moldes y equipo de impresión. Las fábricas suelen mostrar el taller con gusto; los comerciantes eluden o muestran imágenes genéricas. Las inspecciones de terceros (SGS/BV) y los registros de exportación son la prueba más sólida."),
            ("¿Qué documentos prueban que un proveedor es un fabricante real?",
             "La evidencia más fuerte es la combinación de: (1) una licencia comercial válida con objeto de fabricación, (2) ISO 9001 y certificados de material/contacto con alimentos con fecha (FDA/LFGB, SGS/TUV), (3) registros de exportación / documentos aduaneros, y (4) una inspección exitosa de instalaciones por terceros. Una fábrica genuina los aporta sin hesitar."),
            ("¿Puedo inspeccionar una fábrica china sin visitarla?",
             "Sí. Opciones: una videollamada en vivo recorriendo el taller, contratar un inspector de terceros (SGS, BV, TUV) para visitar e informar, solicitar fotos/videos de producción recientes de tu pedido específico, y verificar registros de exportación. Muchos compradores combinan un recorrido en video con una inspección de terceros pagada antes del primer pedido al por mayor."),
        ],
        "inquiry_h2": "STWADD — Una Fábrica Real de Artículos de Bebida en Yongkang",
        "inquiry_p": "Somos un fabricante con nuestras propias líneas de producción, ISO 9001, pruebas SGS/TUV y materiales conformes a FDA/LFGB. Damos la bienvenida a recorridos en video, inspecciones de terceros y visitas a la Feria de Cantón. Obtén una cotización de fábrica.",
        "inquiry_a": "Solicitar Cotización",
        "footer_guides": [("Todas las Guías", "index"), ("Elegir un Fabricante", "choose-water-bottle-manufacturer"), ("304 vs 316 Acero", "304-vs-316-stainless-steel"), ("MOQ para Vendedores", "moq-lead-time-ecommerce")],
    },
    "pt": {
        "title": "Como Verificar se uma Fábrica Chinesa de Utensílios é Real | STWADD",
        "meta": "Passos práticos para confirmar que um fornecedor chinês de garrafas é um fabricante genuíno, não uma empresa de comércio: tours por vídeo ao vivo, inspeções de terceiros (SGS/BV), registros de exportação, feiras e licença comercial.",
        "hero_tag": "GUIA PARA COMPRADORES 03",
        "h1": "Como Verificar se uma Fábrica Chinesa de Utensílios é Real (Não um Comerciante)",
        "lead": "Muitas \"fábricas\" em plataformas B2B são na verdade empresas de comércio ou agentes de sourcing de uma pessoa só. Para pedidos de bebidas em grande volume, confirmar que você lida com um fabricante genuíno protege seu preço, qualidade e prazos. Aqui estão as verificações práticas e de baixo custo que qualquer comprador pode fazer antes de se comprometer.",
        "body": [
            ["h2", "Verificação passo a passo"],
            ["step", "<b>1. Tour por vídeo ao vivo da oficina.</b> Peça uma videoligação em tempo real percorrendo a linha de produção, não um escritório montado. Uma fábrica pode mostrar moldagem, impressão, montagem e estações de controle de qualidade. Um comerciante esquivará ou mostrará imagens genéricas."],
            ["step", "<b>2. Verifique a licença comercial.</b> Solicite a licença comercial chinesa (营业执照). Confirme que o <b>objeto social inclui fabricação</b>, não apenas \"atacadista/comércio\". Verifique o código unificado de crédito social em registros oficiais quando possível."],
            ["step", "<b>3. Peça certificados datados.</b> ISO 9001, mais conformidade de material/contato com alimentos (FDA dos EUA, LFGB da UE) e relatórios de teste SGS/TUV. Fábricas genuínas os mantêm vigentes porque os compradores os exigem constantemente."],
            ["step", "<b>4. Verifique registros de exportação.</b> Peça referências, documentos de envio anteriores (redigidos) ou registros aduaneiros. Fabricantes estabelecidos têm histórico de exportação, não apenas vendas domésticas."],
            ["step", "<b>5. Inspeção de terceiros.</b> Contrate SGS, BV ou TUV para visitar as instalações e informar. Esta é a prova independente mais sólida e é prática padrão antes de um primeiro pedido em grande volume."],
            ["step", "<b>6. Encontre-se em uma feira.</b> A Feira de Cantão e feiras regionais de ferragens/presentes são onde expõem as fábricas reais. Conhecer pessoalmente (ou via lista oficial de expositores) agrega confiança."],
            ["h2", "Fábrica vs comerciante — sinais de comportamento"],
            ["ul", [
                "<b>Fábrica:</b> possui moldes, mostra a oficina, discute detalhes de produção, aceita depósito + saldo, fornece relatórios de teste com facilidade.",
                "<b>Comerciante:</b> vago na produção, empurra \"temos muitas fábricas parceiras\", hesita em tours por vídeo, menos transparente no detalhamento de preços.",
            ]],
            ["p", "Nenhum é automaticamente ruim — comerciantes cumprem uma função — mas <b>você deve saber com qual está pagando</b>, porque o perfil de preço e risco difere."],
            ["h2", "Por que a localização importa: Yongkang"],
            ["p", "Yongkang, Zhejiang — a \"Capital das Canecas da China\" (中国口杯之都) — é o maior cluster mundial de fabricação de utensílios de bebida. Uma fábrica lá tem acesso direto a cadeias de suprimentos locais maduras, fabricantes de moldes e acabadores, por isso muitos fabricantes reais de garrafas isoladas operam na região. Quando um fornecedor diz Yongkang, você pode verificar o endereço físico e até organizar uma inspeção local rápida mais facilmente."],
        ],
        "faq": [
            ("Como posso saber se um fornecedor chinês é uma fábrica ou uma empresa de comércio?",
             "Peça um tour por vídeo ao vivo das linhas de produção (não apenas um escritório), solicite a licença comercial que mostre objeto de fabricação, e verifique se possuem moldes e equipamento de impressão. Fábricas costumam mostrar a oficina com prazer; comerciantes esquivam ou mostram imagens genéricas. Inspeções de terceiros (SGS/BV) e registros de exportação são a prova mais sólida."),
            ("Quais documentos provam que um fornecedor é um fabricante real?",
             "A evidência mais forte é a combinação de: (1) licença comercial válida com objeto de fabricação, (2) ISO 9001 e certificados de material/contato com alimentos datados (FDA/LFGB, SGS/TUV), (3) registros de exportação / documentos aduaneiros, e (4) uma inspeção bem-sucedida de instalações por terceiros. Uma fábrica genuína os fornece sem hesitar."),
            ("Posso inspecionar uma fábrica chinesa sem visitá-la?",
             "Sim. Opções: videoligação ao vivo percorrendo a oficina, contratar um inspetor de terceiros (SGS, BV, TUV) para visitar e informar, solicitar fotos/vídeos de produção recentes do seu pedido específico, e verificar registros de exportação. Muitos compradores combinam um tour por vídeo com uma inspeção de terceiros paga antes do primeiro pedido em grande volume."),
        ],
        "inquiry_h2": "STWADD — Uma Fábrica Real de Utensílios em Yongkang",
        "inquiry_p": "Somos um fabricante com nossas próprias linhas de produção, ISO 9001, testes SGS/TUV e materiais conformes a FDA/LFGB. Damos boas-vindas a tours por vídeo, inspeções de terceiros e visitas à Feira de Cantão. Obtenha uma cotação de fábrica.",
        "inquiry_a": "Solicitar Cotação",
        "footer_guides": [("Todos os Guias", "index"), ("Escolher um Fabricante", "choose-water-bottle-manufacturer"), ("304 vs 316 Aço", "304-vs-316-stainless-steel"), ("MOQ para Vendedores", "moq-lead-time-ecommerce")],
    },
    "ru": {
        "title": "Как проверить, что китайская фабрика посуды настоящая | STWADD",
        "meta": "Практические шаги, чтобы подтвердить, что китайский поставщик бутылок — настоящий производитель, а не торговая компания: живые видео-туры, инспекции третьей стороной (SGS/BV), экспортные записи, выставки и лицензия.",
        "hero_tag": "РУКОВОДСТВО ДЛЯ ПОКУПАТЕЛЕЙ 03",
        "h1": "Как проверить, что китайская фабрика посуды настоящая (не трейдер)",
        "lead": "Многие \"фабрики\" на B2B-платформах — на самом деле торговые компании или агенты по закупкам из одного человека. Для оптовых заказов посуды подтверждение, что вы имеете дело с настоящим производителем, защищает вашу цену, качество и сроки. Вот практичные и недорогие проверки, которые любой покупатель может выполнить до обязательства.",
        "body": [
            ["h2", "Пошаговая проверка"],
            ["step", "<b>1. Живой видео-тур цеха.</b> Попросите видеозвонок в реальном времени по линии производства, а не постановочный офис. Фабрика может показать литьё, печать, сборку и посты контроля качества. Трейдер увильнёт или покажет общие кадры."],
            ["step", "<b>2. Проверьте лицензию.</b> Запросите китайскую лицензию (营业执照). Убедитесь, что <b>вид деятельности включает производство</b>, а не только \"оптовая торговля\". По возможности сверьте единый социальный кредитный код по официальным реестрам."],
            ["step", "<b>3. Запросите датированные сертификаты.</b> ISO 9001, плюс соответствие материала/контакта с пищей (FDA США, LFGB ЕС) и отчёты SGS/TUV. Настоящие фабрики держат их актуальными, потому что покупатели постоянно их требуют."],
            ["step", "<b>4. Проверьте экспортные записи.</b> Запросите рекомендации, прошлые отгрузочные документы (с изъятиями) или таможенные записи. Устоявшиеся производители имеют историю экспорта, а не только внутренние продажи."],
            ["step", "<b>5. Инспекция третьей стороной.</b> Наймите SGS, BV или TUV для посещения площадки и отчёта. Это самое сильное независимое доказательство и стандартная практика перед первым оптовым заказом."],
            ["step", "<b>6. Встретьтесь на выставке.</b> Кантонская ярмарка и региональные выставки инструментов/подарков — где экспонируют настоящие фабрики. Личная встреча (или по официальному списку экспонентов) добавляет уверенности."],
            ["h2", "Фабрика против трейдера — поведенческие признаки"],
            ["ul", [
                "<b>Фабрика:</b> владеет пресс-формами, показывает цех, обсуждает детали производства, принимает депозит + остаток, легко даёт отчёты об испытаниях.",
                "<b>Трейдер:</b> туманно о производстве, давит \"у нас много партнёрских фабрик\", неохотно на видео-туры, менее прозрачен в разбивке цен.",
            ]],
            ["p", "Ни тот, ни другой автоматически плохи — трейдеры выполняют функцию — но <b>вы должны знать, за что платите</b>, потому что профиль цены и риска различается."],
            ["h2", "Почему местоположение важно: Юнкан"],
            ["p", "Юнкан, Чжэцзян — \"Столица кружек Китая\" (中国口杯之都) — крупнейший в мире кластер по производству посуды. Фабрика там имеет прямой доступ к зрелым местным цепочкам поставок, изготовителям пресс-форм и отделке, поэтому многие настоящие производители изолированных бутылок работают в регионе. Когда поставщик называет Юнкан, вы можете проверить физический адрес и даже быстрее организовать местную инспекцию."],
        ],
        "faq": [
            ("Как понять, что китайский поставщик — фабрика, а не торговая компания?",
             "Попросите живой видео-тур линий производства (не только офис), запросите лицензию с видом деятельности \"производство\" и проверьте, владеет ли он пресс-формами и печатным оборудованием. Фабрики обычно рады показать цех; трейдеры увиливают или показывают общие кадры. Инспекции третьей стороной (SGS/BV) и экспортные записи — самое сильное доказательство."),
            ("Какие документы доказывают, что поставщик — настоящий производитель?",
             "Сильнее всего сочетание: (1) действующей лицензии с производственным видом деятельности, (2) ISO 9001 и датированных сертификатов материала/контакта с пищей (FDA/LFGB, SGS/TUV), (3) экспортных записей / таможенных документов и (4) успешной инспекции площадки третьей стороной. Настоящая фабрика даёт это без колебаний."),
            ("Можно ли проверить китайскую фабрику, не посещая её?",
             "Да. Варианты: живой видеозвонок по цеху, наём инспектора третьей стороной (SGS, BV, TUV) для визита и отчёта, запрос свежих фото/видео производства вашего конкретного заказа и проверка экспортных записей. Многие покупатели сочетают видео-тур с платной инспекцией третьей стороной перед первым оптовым заказом."),
        ],
        "inquiry_h2": "STWADD — настоящая фабрика посуды в Юнкане",
        "inquiry_p": "Мы — производитель со своими линиями производства, ISO 9001, испытаниями SGS/TUV и материалами, соответствующими FDA/LFGB. Мы рады видео-турам, инспекциям третьей стороной и визитам на Кантонскую ярмарку. Запросите заводскую смету.",
        "inquiry_a": "Запросить смету",
        "footer_guides": [("Все руководства", "index"), ("Выбрать производителя", "choose-water-bottle-manufacturer"), ("304 vs 316 сталь", "304-vs-316-stainless-steel"), ("MOQ для продавцов", "moq-lead-time-ecommerce")],
    },
    "ar": {
        "title": "كيفية التحقق من أن المصنع الصيني لأواني الشرب حقيقي | STWADD",
        "meta": "خطوات عملية لتأكيد أن موردًا صينيًا للزجاجات مصنع حقيقي لا شركة تجارة: جولات فيديو مباشرة، فحوص طرف ثالث (SGS/BV)، سجلات تصدير، معارض ورخصة تجارية.",
        "hero_tag": "دليل المشترين 03",
        "h1": "كيفية التحقق من أن المصنع الصيني لأواني الشرب حقيقي (ليس وسيطًا)",
        "lead": "كثير من \"المصانع\" على منصات B2B هي في الواقع شركات تجارة أو وكلاء توريد من شخص واحد. للطلبات بالجملة، فإن التأكد من التعامل مع مصنع حقيقي يحمي سعرك وجودتك ومدة تسليمك. إليك فحوصًا عملية ومنخفضة التكلفة يمكن لأي مشترٍ إجراؤها قبل الالتزام.",
        "body": [
            ["h2", "تحقق خطوة بخطوة"],
            ["step", "<b>1. جولة فيديو مباشرة للورشة.</b> اطلب مكالمة فيديو فورية تجوب خط الإنتاج، لا مكتبًا مُعدًا. المصنع يمكنه إظهار القولبة والطباعة والتجميع ومحطات ضبط الجودة. الوسيط سيتهرب أو يعرض لقطات عامة."],
            ["step", "<b>2. افحص الرخصة التجارية.</b> اطلب الرخصة التجارية الصينية (营业执照). تأكد أن <b>نطاق العمل يشمل التصنيع</b>، لا مجرد \"جملة/تجارة\". تحقق من الرمز الموحد للائتمان الاجتماعي في السجلات الرسمية عند الإمكان."],
            ["step", "<b>3. اطلب شهادات مؤرخة.</b> ISO 9001، إضافة لامتثال المادة/التلامس مع الغذاء (FDA الأمريكية، LFGB الأوروبية) وتقارير فحص SGS/TUV. المصانع الحقيقية تبقيها سارية لأن المشترين يطلبونها باستمرار."],
            ["step", "<b>4. تحقق من سجلات التصدير.</b> اطلب مراجع ووثائق شحن سابقة (مُعتمة) أو سجلات جمركية. المصنعون الراسخون لهم سجل تصدير، لا مبيعات محلية فقط."],
            ["step", "<b>5. فحص طرف ثالث.</b> استعن بـ SGS أو BV أو TUV لزيارة المنشأة والتقرير. هذه أقوى إثبات مستقل وممارسة قياسية قبل أول طلب جملة."],
            ["step", "<b>6. التقِ في معرض.</b> معرض كانتون والمعارض الإقليمية للأدوات/الهدايا هي حيث تعرض المصانع الحقيقية. اللقاء شخصيًا (أو عبر القائمة الرسمية للعارضين) يضيف ثقة."],
            ["h2", "مصنع أم وسيط — علامات سلوكية"],
            ["ul", [
                "<b>المصنع:</b> يملك قوالب، يُظهر الورشة، يناقش تفاصيل الإنتاج، يقبل دفعة+رصيد، يقدّم تقارير الفحص بسهولة.",
                "<b>الوسيط:</b> غامض في الإنتاج، يدفع \"لدينا many شركاء مصانع\"، يتلكأ في جولات الفيديو، أقل شفافية في تفصيل السعر.",
            ]],
            ["p", "لا أحد سيئ تلقائيًا — الوسطاء يقومون بدور — لكن <b>عليك أن تعرف مع من تدفع</b>، لأن ملف السعر والمخاطر يختلف."],
            ["h2", "لماذا الموقع مهم: يونكانغ"],
            ["p", "يونكانغ، تشيجيانغ — \"عاصمة الكؤوس في الصين\" (中国口杯之都) — أكبر مجمع عالمي لتصنيع أواني الشرب. المصنع هناك يتمتع بوصول مباشر إلى سلاسل توريد محلية ناضجة وصانعي قوالب وتشطيب، لذلك يعمل كثير من المصانع الحقيقية للزجاجات المعزولة في المنطقة. عندما يذكر المورد يونكانغ، يمكنك التحقق من العنوان الفعلي بل وتنظيم فحص محلي سريع بسهولة أكبر."],
        ],
        "faq": [
            ("كيف أعرف إن كان المورد الصيني مصنعًا أم شركة تجارة؟",
             "اطلب جولة فيديو مباشرة لخطوط الإنتاج (لا مكتبًا فقط)، واطلب الرخصة التجارية التي تُظهر نطاق التصنيع، وتحقق إن كان يملك قوالب ومعدات طباعة. المصانع عادة تسرّ بإظهار الورشة؛ الوسطاء يتلكأون أو يعرضون لقطات عامة. فحوص طرف ثالث (SGS/BV) وسجلات التصدير هي الإثبات الأقوى."),
            ("ما الوثائق التي تثبت أن المورد مصنع حقيقي؟",
             "أقوى دليل هو الجمع بين: (1) رخصة تجارية سارية بنطاق تصنيع، (2) ISO 9001 وشهادات مادة/تلامس غذائي مؤرخة (FDA/LFGB وSGS/TUV)، (3) سجلات تصدير/وثائق جمركية، و(4) فحص ناجح للمنشأة من طرف ثالث. المصنع الحقيقي يقدّمها بلا تردد."),
            ("هل يمكنني فحص مصنع صيني دون زيارته؟",
             "نعم. الخيارات: مكالمة فيديو مباشرة تجوب الورشة، استئجار مفتش طرف ثالث (SGS أو BV أو TUV) للزيارة والتقرير، طلب صور/فيديو إنتاج حديثة لطلبك المحدد، والتحقق من سجلات التصدير. كثير من المشترين يجمعون بين جولة فيديو وفحص مدفوع من طرف ثالث قبل أول طلب جملة."),
        ],
        "inquiry_h2": "STWADD — مصنع أواني شرب حقيقي في يونكانغ",
        "inquiry_p": "نحن مصنع بخطوط إنتاج خاصة، ISO 9001، فحوص SGS/TUV ومواد مطابقة لـ FDA/LFGB. نرحب بجولات الفيديو وفحوص طرف ثالث وزيارات معرض كانتون. اطلب عرض سعر من المصنع.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_guides": [("كل الأدلة", "index"), ("اختيار مصنع", "choose-water-bottle-manufacturer"), ("304 مقابل 316 فولاذ", "304-vs-316-stainless-steel"), ("حد الطلب لبائعين", "moq-lead-time-ecommerce")],
    },
}

# ---- moq-lead-time-ecommerce ----
ART["moq"] = {
    "es": {
        "title": "MOQ, Plazos y Moldes: Guía para Vendedores de Amazon y Shopify | STWADD",
        "meta": "Guía de planificación para vendedores de Amazon y Shopify que compran botellas de marca propia desde China: cómo funciona el MOQ, costos de moldes, plazos realistas y cómo programar re pedidos para evitar roturas de stock.",
        "hero_tag": "GUÍA PARA COMPRADORES 04",
        "h1": "MOQ, Plazos y Moldes: Guía para Vendedores de Amazon y Shopify de Artículos de Bebida",
        "lead": "Las botellas, termos y frascos de marca propia son una categoría de e-commerce popular, pero el mayor riesgo operativo no es el producto, es el <b>tiempo</b>. Esta guía ayuda a vendedores de Amazon y Shopify a planificar el MOQ, entender los costos de moldes, fijar plazos realistas y programar re pedidos para no quedarse sin stock en temporada alta.",
        "body": [
            ["h2", "Entender el MOQ"],
            ["p", "<b>MOQ (cantidad mínima de pedido)</b> es el pedido más pequeño que una fábrica aceptará. Para artículos estándar con logotipo usando los moldes existentes de la fábrica, los MOQ suelen empezar en torno a <b>500 piezas por diseño/color</b>. Un molde nuevo (forma nueva) es un primer compromiso mayor."],
            ["ul", [
                "El MOQ a menudo es <b>negociable según la frecuencia de pedido</b> — comprométete con re pedidos regulares y la fábrica puede bajar el primer MOQ.",
                "Confirma siempre si el MOQ es <b>por color, por diseño o total</b> — las definiciones varían.",
                "Un MOQ menor suele significar un precio unitario más alto; el volumen es lo que baja el costo unitario.",
            ]],
            ["h2", "Moldes / herramental: personalizado vs existente"],
            ["h3", "Usa moldes existentes (ODM)"],
            ["p", "Lo más rápido y económico para lanzar. Eliges una forma probada y aplicas tu logotipo, color y empaque. Sin costo de herramental. Ideal cuando la velocidad de salida al mercado importa más que una silueta única."],
            ["h3", "Invierte en un molde personalizado"],
            ["p", "Una forma única da diferenciación y exclusividad de marca, pero añade un <b>costo único de herramental</b> y extiende el plazo. Vale la pena solo si puedes amortizar el molde en volumen y la forma es central para tu marca."],
            ["h2", "Línea de tiempo realista de extremo a extremo (por mar)"],
            ["timeline", "<b>Muestras:</b> 5–7 días (a menudo gratis o de bajo costo para artículos estándar)."],
            ["timeline", "<b>Producción:</b> 25–35 días tras el depósito; urgente 15–20 días."],
            ["timeline", "<b>Flete marítimo (China → EE. UU./UE):</b> ~30–45 días."],
            ["timeline", "<b>Despacho aduanero + última milla:</b> ~5–10 días."],
            ["p", "<b>Planea aproximadamente 2–3.5 meses puerta a puerta por mar.</b> El flete aéreo reduce el tránsito a ~7–12 días pero cuesta mucho más — útil para reposiciones de emergencia, no para reabastecimiento rutinario."],
            ["h2", "Cómo evitar roturas de stock"],
            ["ul", [
                "<b>Disparador de re pedido:</b> coloca el próximo PO cuando el inventario alcance tu cobertura de plazo (ej. 1.5–2 meses de ventas), no cuando esté casi vacío.",
                "<b>Estacionalidad:</b> pre navideño (Q3–Q4) es el periodo más ocupado de producción en China — haz pedidos antes para evitar retrasos en la cola.",
                "<b>Stock de buffer:</b> mantén 1 mes de inventario de seguridad para tus productos estrella.",
                "<b>Previsión por SKU:</b> no promedies en todo el catálogo; los artículos de movimiento rápido necesitan disciplina de re pedido más ajustada.",
            ]],
        ],
        "faq": [
            ("¿Qué MOQ debe esperar un vendedor de Amazon/Shopify para botellas de marca propia?",
             "Para artículos estándar con logotipo usando los moldes existentes de la fábrica, los MOQ suelen empezar en torno a 500 piezas por diseño/color. Un molde nuevo (forma nueva) es un primer pedido mayor e incluye un costo único de herramental. Muchas fábricas son flexibles si te comprometes con re pedidos regulares, así que negocia el MOQ contra la frecuencia de pedido, no contra un solo envío."),
            ("¿Cuánto tardan producción y envío de extremo a extremo?",
             "La producción típica es 25–35 días tras confirmar el depósito; urgente 15–20 días. El flete marítimo a EE. UU./UE añade unas 30–45 días; el aéreo es más rápido (unos 7–12 días) pero cuesta más. Incluyendo muestras (5–7 días) y despacho aduanero, planea 2–3.5 meses puerta a puerta por mar. Incorpora esto a tu momento de re pedido."),
            ("¿Debo pagar por un molde personalizado o usar una forma existente?",
             "Usa los moldes existentes de la fábrica (ODM) cuando importan la velocidad y el bajo costo — solo pagas impresión y empaque. Invierte en un molde personalizado solo cuando una forma única es central para la diferenciación de tu marca y puedes amortizar el costo del herramental en volumen. Un molde personalizado también da exclusividad, pero extiende el plazo y sube el mínimo del primer pedido."),
        ],
        "inquiry_h2": "Fabricante de Artículos de Bebida de Marca Propia para Vendedores",
        "inquiry_p": "STWADD es una fábrica OEM/ODM de Yongkang que atiende a vendedores de Amazon, Shopify y e-commerce — logotipo, color, empaque y moldes personalizados, MOQ desde ~500 pzas, producción 25–35 días. Obtén una cotización y un plazo realista.",
        "inquiry_a": "Solicitar Cotización",
        "footer_guides": [("Todas las Guías", "index"), ("Elegir un Fabricante", "choose-water-bottle-manufacturer"), ("Verificar una Fábrica", "verify-chinese-factory"), ("Comparativa de Materiales", "drinkware-material-comparison")],
    },
    "pt": {
        "title": "MOQ, Prazos e Moldes: Guia para Vendedores da Amazon e Shopify | STWADD",
        "meta": "Guia de planejamento para vendedores da Amazon e Shopify que compram garrafas de marca própria da China: como funciona o MOQ, custos de moldes, prazos realistas e como programar re pedidos para evitar falta de estoque.",
        "hero_tag": "GUIA PARA COMPRADORES 04",
        "h1": "MOQ, Prazos e Moldes: Guia para Vendedores da Amazon e Shopify de Utensílios de Bebida",
        "lead": "Garrafas, canecas e frascos de marca própria são uma categoria de e-commerce popular, mas o maior risco operacional não é o produto, é o <b>tempo</b>. Este guia ajuda vendedores da Amazon e Shopify a planejar o MOQ, entender os custos de moldes, definir prazos realistas e programar re pedidos para nunca ficar sem estoque no pico de temporada.",
        "body": [
            ["h2", "Entender o MOQ"],
            ["p", "<b>MOQ (quantidade mínima de pedido)</b> é o menor pedido que uma fábrica aceitará. Para itens padrão com logotipo usando os moldes existentes, os MOQ costumam começar em torno de <b>500 peças por design/cor</b>. Um molde novo (forma nova) é um compromisso inicial maior."],
            ["ul", [
                "O MOQ frequentemente é <b>negociável conforme a frequência de pedido</b> — comprometa-se com re pedidos regulares e a fábrica pode baixar o primeiro MOQ.",
                "Confirme sempre se o MOQ é <b>por cor, por design ou total</b> — as definições variam.",
                "Um MOQ menor geralmente significa preço unitário mais alto; o volume é o que reduz o custo unitário.",
            ]],
            ["h2", "Moldes / ferramental: personalizado vs existente"],
            ["h3", "Use moldes existentes (ODM)"],
            ["p", "O mais rápido e barato para lançar. Você escolhe uma forma comprovada e aplica seu logotipo, cor e embalagem. Sem custo de ferramental. Ideal quando a velocidade de lançamento importa mais que uma silhueta única."],
            ["h3", "Invista em um molde personalizado"],
            ["p", "Uma forma única dá diferenciação e exclusividade de marca, mas adiciona um <b>custo único de ferramental</b> e estende o prazo. Vale a pena apenas se você puder amortizar o molde em volume e a forma for central para sua marca."],
            ["h2", "Linha de tempo realista de ponta a ponta (por mar)"],
            ["timeline", "<b>Amostras:</b> 5–7 dias (geralmente grátis ou de baixo custo para itens padrão)."],
            ["timeline", "<b>Produção:</b> 25–35 dias após o depósito; urgente 15–20 dias."],
            ["timeline", "<b>Frete marítimo (China → EUA/UE):</b> ~30–45 dias."],
            ["timeline", "<b>Despacho aduaneiro + última milha:</b> ~5–10 dias."],
            ["p", "<b>Planeje aproximadamente 2–3,5 meses porta a porta por mar.</b> O frete aéreo reduz o trânsito para ~7–12 dias mas custa muito mais — útil para reposições de emergência, não para reabastecimento rotineiro."],
            ["h2", "Como evitar falta de estoque"],
            ["ul", [
                "<b>Gatilho de re pedido:</b> faça o próximo PO quando o estoque atingir sua cobertura de prazo (ex. 1,5–2 meses de vendas), não quando estiver quase vazio.",
                "<b>Sazonalidade:</b> pré-festas (Q3–Q4) é o período mais ocupado de produção na China — faça pedidos antes para evitar atrasos na fila.",
                "<b>Estoque de buffer:</b> mantenha 1 mês de estoque de segurança para seus produtos de destaque.",
                "<b>Previsão por SKU:</b> não faça média em todo o catálogo; itens de movimento rápido precisam de disciplina de re pedido mais apertada.",
            ]],
        ],
        "faq": [
            ("Qual MOQ um vendedor da Amazon/Shopify deve esperar para garrafas de marca própria?",
             "Para itens padrão com logotipo usando os moldes existentes da fábrica, os MOQ costumam começar em torno de 500 peças por design/cor. Um molde novo (forma nova) é um primeiro pedido maior e inclui um custo único de ferramental. Muitas fábricas são flexíveis se você se comprometer com re pedidos regulares, então negocie o MOQ contra a frequência de pedido, não contra um único envio."),
            ("Quanto tempo duram produção e envio de ponta a ponta?",
             "A produção típica é 25–35 dias após confirmar o depósito; urgente 15–20 dias. O frete marítimo para EUA/UE adiciona cerca de 30–45 dias; o aéreo é mais rápido (cerca de 7–12 dias) mas custa mais. Incluindo amostras (5–7 dias) e despacho aduaneiro, planeje 2–3,5 meses porta a porta por mar. Incorporе isso ao seu momento de re pedido."),
            ("Devo pagar por um molde personalizado ou usar uma forma existente?",
             "Use os moldes existentes da fábrica (ODM) quando velocidade e baixo custo importam — você paga apenas impressão e embalagem. Invista em um molde personalizado apenas quando uma forma única for central para a diferenciação da sua marca e você puder amortizar o custo do ferramental em volume. Um molde personalizado também dá exclusividade, mas estende o prazo e eleva o mínimo do primeiro pedido."),
        ],
        "inquiry_h2": "Fabricante de Utensílios de Marca Própria para Vendedores",
        "inquiry_p": "STWADD é uma fábrica OEM/ODM de Yongkang que atende vendedores da Amazon, Shopify e e-commerce — logotipo, cor, embalagem e moldes personalizados, MOQ a partir de ~500 pçs, produção 25–35 dias. Obtenha uma cotação e um prazo realista.",
        "inquiry_a": "Solicitar Cotação",
        "footer_guides": [("Todos os Guias", "index"), ("Escolher um Fabricante", "choose-water-bottle-manufacturer"), ("Verificar uma Fábrica", "verify-chinese-factory"), ("Comparação de Materiais", "drinkware-material-comparison")],
    },
    "ru": {
        "title": "MOQ, сроки и оснастка: руководство для продавцов Amazon и Shopify | STWADD",
        "meta": "Руководство по планированию для продавцов Amazon и Shopify, закупающих бутылки private-label в Китае: как работает MOQ, стоимость пресс-форм, реалистичные сроки и как планировать повторные заказы во избежание нехватки.",
        "hero_tag": "РУКОВОДСТВО ДЛЯ ПОКУПАТЕЛЕЙ 04",
        "h1": "MOQ, сроки и оснастка: руководство для продавцов Amazon и Shopify посуды",
        "lead": "Бутылки, термокружки и фляги private-label — популярная категория e-commerce, но главный операционный риск — не товар, а <b>время</b>. Это руководство помогает продавцам Amazon и Shopify спланировать MOQ, понять стоимость оснастки, задать реалистичные сроки и планировать повторные заказы, чтобы не остаться без стока в пик сезона.",
        "body": [
            ["h2", "Понимание MOQ"],
            ["p", "<b>MOQ (минимальный объём заказа)</b> — наименьший заказ, который примет фабрика. Для стандартных позиций с логотипом на существующих пресс-формах MOQ обычно начинается с <b>~500 штук на дизайн/цвет</b>. Новая пресс-форма (новая форма) — большее первоначальное обязательство."],
            ["ul", [
                "MOQ часто <b>зависит от частоты заказов</b> — обяжитесь регулярными повторными заказами, и фабрика может снизить первый MOQ.",
                "Всегда уточняйте, считается MOQ на цвет, на дизайн или общий — определения разнятся.",
                "Меньший MOQ обычно означает более высокую цену за единицу; объём и снижает себестоимость.",
            ]],
            ["h2", "Пресс-формы / оснастка: индивидуальная против существующей"],
            ["h3", "Используйте существующие пресс-формы (ODM)"],
            ["p", "Самый быстрый и дешёвый запуск. Выбираете проверенную форму и наносите логотип, цвет и упаковку. Без затрат на оснастку. Идеально, когда скорость выхода важнее уникального силуэта."],
            ["h3", "Инвестируйте в индивидуальную пресс-форму"],
            ["p", "Уникальная форма даёт дифференциацию и эксклюзивность бренда, но добавляет <b>разовую стоимость оснастки</b> и увеличивает срок. Оправдана, только если можете амортизировать пресс-форму на объёме, а форма центральна для бренда."],
            ["h2", "Реалистичные сроки от начала до конца (морем)"],
            ["timeline", "<b>Образцы:</b> 5–7 дней (часто бесплатно или дёшево для стандартных позиций)."],
            ["timeline", "<b>Производство:</b> 25–35 дней после депозита; срочно 15–20 дней."],
            ["timeline", "<b>Морская перевозка (Китай → США/ЕС):</b> ~30–45 дней."],
            ["timeline", "<b>Таможня + последняя миля:</b> ~5–10 дней."],
            ["p", "<b>Планируйте примерно 2–3,5 месяца \"от двери до двери\" морем.</b> Авиаперевозка сокращает транзит до ~7–12 дней, но стоит намного дороже — для экстренных подпиток, не для рутинного пополнения."],
            ["h2", "Как избежать нехватки стока"],
            ["ul", [
                "<b>Триггер повторного заказа:</b> размещайте следующий PO, когда остаток достигнет покрытия срока (напр. 1,5–2 месяца продаж), а не когда почти пусто.",
                "<b>Сезонность:</b> предпраздничный период (Q3–Q4) — самый загруженный для производства в Китае; заказывайте раньше, чтобы избежать очереди.",
                "<b>Буферный сток:</b> держите 1 месяц страхового запаса для хитов.",
                "<b>Прогноз по SKU:</b> не усредняйте по каталогу; быстроходам нужна более жёсткая дисциплина заказов.",
            ]],
        ],
        "faq": [
            ("Какой MOQ ждать продавцу Amazon/Shopify для бутылок private-label?",
             "Для стандартных позиций с логотипом на существующих пресс-формах MOQ обычно начинается с ~500 штук на дизайн/цвет. Новая пресс-форма (новая форма) — больший первый заказ и разовая стоимость оснастки. Многие фабрики гибки при регулярных повторных заказах, поэтому торгуйте MOQ исходя из частоты, а не одной отгрузки."),
            ("Сколько занимают производство и доставка от начала до конца?",
             "Типичное производство — 25–35 дней после депозита; срочно 15–20 дней. Море в США/ЕС добавляет ~30–45 дней; авиа быстрее (~7–12 дней), но дороже. Включая образцы (5–7 дней) и таможню, планируйте 2–3,5 месяца \"от двери до двери\" морем. Заложите это в график повторных заказов."),
            ("Платить за индивидуальную пресс-форму или брать готовую форму?",
             "Используйте существующие пресс-формы (ODM), когда важны скорость и низкая цена — платите только за печать и упаковку. Инвестируйте в индивидуальную пресс-форму, только если уникальная форма центральна для дифференциации бренда и можно амортизировать оснастку на объёме. Индивидуальная форма даёт эксклюзив, но увеличивает срок и минимум первого заказа."),
        ],
        "inquiry_h2": "Производитель посуды private-label для продавцов",
        "inquiry_p": "STWADD — фабрика OEM/ODM в Юнкане для продавцов Amazon, Shopify и e-commerce: логотип, цвет, упаковка и пресс-формы, MOQ от ~500 шт., производство 25–35 дней. Запросите смету и реалистичный график.",
        "inquiry_a": "Запросить смету",
        "footer_guides": [("Все руководства", "index"), ("Выбрать производителя", "choose-water-bottle-manufacturer"), ("Проверить фабрику", "verify-chinese-factory"), ("Сравнение материалов", "drinkware-material-comparison")],
    },
    "ar": {
        "title": "حد الطلب الأدنى والمدة والأدوات: دليل لبائعي أمازون وشوبيفاي | STWADD",
        "meta": "دليل تخطيط لبائعي أمازون وشوبيفاي الذين يشترون زجاجات علامة خاصة من الصين: كيف يعمل الحد الأدنى، تكاليف القوالب، مدد واقعية، وكيفية جدولة إعادة الطلب لتفادي نفاد المخزون.",
        "hero_tag": "دليل المشترين 04",
        "h1": "حد الطلب الأدنى والمدة والأدوات: دليل لبائعي أمازون وشوبيفاي لأواني الشرب",
        "lead": "زجاجات ومفاتم وقوارير العلامة الخاصة فئة شائعة في التجارة الإلكترونية، لكن أكبر خطر تشغيلي ليس المنتج، بل <b>الوقت</b>. يساعد هذا الدليل بائعي أمازون وشوبيفاي على تخطيط حد الطلب الأدنى، وفهم تكاليف القوالب، وتحديد مدد واقعية، وجدولة إعادة الطلب لتجنب نفاد المخزون في ذروة الموسم.",
        "body": [
            ["h2", "فهم حد الطلب الأدنى"],
            ["p", "<b>MOQ (الحد الأدنى للطلب)</b> هو أصغر طلب تقبله الفابريka. لبنود قياسية مطبوع عليها شعار باستخدام القوالب القائمة، يبدأ الحد عادةً عند <b>~500 قطعة لكل تصميم/لون</b>. قالب جديد (شكل جديد) التزام أولى أكبر."],
            ["ul", [
                "غالبًا ما يكون الحد <b>قابلًا للتفاوض حسب تكرار الطلب</b> — التزم بإعادة طلبات منتظمة وقد تخفض الفابريka الحد الأولى.",
                "تأكد دائمًا إن كان الحد للون أم للتصميم أم الإجمالي — التعريفات تختلف.",
                "حد أدنى أصغر يعني عادة سعر وحدة أعلى؛ الحجم هو ما يخفض تكلفة الوحدة.",
            ]],
            ["h2", "القوالب / الأدوات: مخصص مقابل قائم"],
            ["h3", "استخدم القوالب القائمة (ODM)"],
            ["p", "أسرع وأرخص للإطلاق. تختار شكلًا مجرّبًا وتطبق شعارك ولونك وتغليفك. بلا تكلفة أدوات. مثالي عندما تسبق سرعة الوصول لسوق شكلًا فريدًا."],
            ["h3", "استثمر في قالب مخصص"],
            ["p", "شكل فريد يمنح تميّزًا وحصرية للعلامة، لكن يضيف <b>تكلفة أدوات لمرة واحدة</b> ويمدد المدة. يستحق فقط إن أمكنك إطفاء القالب على حجم، وكان الشكل محوريًا لعلامتك."],
            ["h2", "مدة واقعية من البداية للنهاية (بحرًا)"],
            ["timeline", "<b>العينات:</b> 5–7 أيام (غالبًا مجانية أو منخفضة التكلفة للبنود القياسية)."],
            ["timeline", "<b>الإنتاج:</b> 25–35 يومًا بعد الدفعة؛ عاجل 15–20 يومًا."],
            ["timeline", "<b>الشحن البحري (الصين → أمريكا/أوروبا):</b> ~30–45 يومًا."],
            ["timeline", "<b>التخليص الجمركي + آخر ميل:</b> ~5–10 أيام."],
            ["p", "<b>خطّط لحوالي 2–3.5 شهرًا من باب لباب بحرًا.</b> الشحن الجوي يخفض العبور إلى ~7–12 يومًا لكنه أغلى بكثير — مفيد لتعويضات الطوارئ لا للتجديد الروتيني."],
            ["h2", "كيفية تفادي نفاد المخزون"],
            ["ul", [
                "<b>محفّز إعادة الطلب:</b> ضع أمر الشراء التالي عندما يصل المخزون إلى غطاء المدة (مثل 1.5–2 شهر مبيعات)، لا عندما يكاد يفرغ.",
                "<b>الموسمية:</b> ما قبل الأعياد (Q3–Q4) أزحم فترات الإنتاج في الصين — اطلب مبكرًا لتفادي تأخير الطابور.",
                "<b>مخزون احتياطي:</b> احتفظ بشهر من الأمان لأفضل منتجاتك.",
                "<b>توقع حسب SKU:</b> لا تُعدّ متوسطًا للكتالوج كله؛ السريعة الحركة تحتاج انضباط طلبات أشد.",
            ]],
        ],
        "faq": [
            ("ما حد الطلب الأدنى الذي يتوقعه بائع أمازون/شوبيفاي لزجاجات علامة خاصة؟",
             "للبنود القياسية المطبوع عليها شعار باستخدام القوالب القائمة، يبدأ الحد عادةً عند ~500 قطعة لكل تصميم/لون. قالب جديد (شكل جديد) طلب أولى أكبر ويشمل تكلفة أدوات لمرة واحدة. كثير من المصانع مرنة إن التزمت بإعادة طلبات منتظمة، لذا فاوض الحد حسب تكرار الطلب لا شحنة واحدة."),
            ("كم تستغرق الإنتاج والشحن من البداية للنهاية؟",
             "الإنتاج النموذجي 25–35 يومًا بعد تأكيد الدفعة؛ عاجل 15–20 يومًا. الشحن البحري لأمريكا/أوروبا يضيف ~30–45 يومًا؛ الجوي أسرع (~7–12 يومًا) لكن أغلى. شاملاً العينات (5–7 أيام) والتخليص الجمركي، خطّط لـ 2–3.5 شهرًا من باب لباب بحرًا. أدرج ذلك في توقيت إعادة الطلب."),
            ("هل أدفع لقالب مخصص أم أستخدم شكلًا قائمًا؟",
             "استخدم القوالب القائمة (ODM) عندما تهم السرعة والتكلفة المنخفضة — تدفع فقط للطباعة والتغليف. استثمر في قالب مخصص فقط عندما يكون شكل فريد محوريًا لتميّز علامتك ويمكن إطفاء تكلفة الأدوات على حجم. القالب المخصص يمنح حصرية لكنه يمدد المدة ويرفع حد الطلب الأولى."),
        ],
        "inquiry_h2": "مصنع أواني علامة خاصة لبائعين",
        "inquiry_p": "STWADD مصنع OEM/ODM في يونكانغ يخدم بائعي أمازون وشوبيفاي والتجارة الإلكترونية — شعار ولون وتغليف وقوالب مخصصة، حد طلب من ~500 قطعة، إنتاج 25–35 يومًا. اطلب عرض سعر ومدة واقعية.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_guides": [("كل الأدلة", "index"), ("اختيار مصنع", "choose-water-bottle-manufacturer"), ("تحقق من مصنع", "verify-chinese-factory"), ("مقارنة المواد", "drinkware-material-comparison")],
    },
}

# ---- drinkware-material-comparison ----
ART["material"] = {
    "es": {
        "title": "Comparativa de Materiales para Bebidas — Tritan vs Plástico vs Vidrio vs Acero | STWADD",
        "meta": "Compara materiales de artículos de bebida — Tritan, plástico, vidrio y acero inoxidable — en durabilidad, seguridad, aislamiento, peso y precio para elegir el material adecuado para tu mercado de botellas, termos o frascos.",
        "hero_tag": "GUÍA PARA COMPRADORES 05",
        "h1": "Comparativa de Materiales para Bebidas: Tritan vs Plástico vs Vidrio vs Acero Inoxidable",
        "lead": "Elegir el material adecuado define el precio, la durabilidad, la historia de seguridad y quién lo compra. Esta guía compara los cuatro materiales comunes de artículos de bebida en las dimensiones que importan a marcas y compradores, para que elijas (o combinés) el correcto para tu mercado.",
        "body": [
            ["h2", "De un vistazo"],
            ["table", [
                ["Dimensión", "Acero Inoxidable", "Tritan", "Plástico (PP/PS)", "Vidrio"],
                ["Durabilidad", "Muy alta", "Alta (resist. a rotura)", "Media", "Baja (frágil)"],
                ["Aislamiento (vacío)", "Excelente (horas caliente/frío)", "Ninguno", "Ninguno", "Ninguno"],
                ["Seguridad", "Grado alimentario, inerte", "Libre de BPA", "Verificar libre de BPA", "Inerte, sabor puro"],
                ["Peso", "Más pesado", "Ligero", "El más ligero", "Pesado"],
                ["Precio (unidad)", "Más alto", "Medio", "El más bajo", "Medio-Alto"],
                ["Mejor para", "Viaje, exterior, regalos", "Deporte, niños", "Promo, presupuesto", "Casa, sabor premium"],
            ]],
            ["h2", "Acero inoxidable (304 / 316)"],
            ["p", "El caballo de batalla premium. El acero al vacío mantiene bebidas calientes 6–12h y frías 12–24h, es extremadamente duradero y de grado alimentario e inerte. Ideal para viaje, exterior, regalos y cualquier marca donde la retención de temperatura sea el argumento de venta. Mayor costo unitario, pero permite un precio premium."],
            ["h2", "Tritan (copoliéster libre de BPA)"],
            ["p", "Plástico transparente, resistente y libre de BPA desarrollado para contacto con alimentos y productos infantiles. Más ligero y resistente a la rotura, ideal para botellas deportivas y de niños donde importan claridad e impacto. No retiene temperatura salvo que esté aislado. Un fuerte posicionamiento de \"plástico seguro\" frente al PP/PS estándar."],
            ["h2", "Plástico estándar (PP / PS)"],
            ["p", "La opción de menor costo — común para botellas promocionales y de presupuesto. Elige grados libres de BPA y verifica cumplimiento de contacto con alimentos. Menos duradero y menos premium; mejor para regalos de gran volumen que para un producto de construcción de marca."],
            ["h2", "Vidrio"],
            ["p", "Químicamente inerte con sabor puro y una sensación premium de hogar/oficina, pero frágil y pesado. A menudo con funda protectora. Mejor para uso estacionario y posicionamiento de bienestar que para viaje o niños."],
            ["h2", "Cómo suelen combinar materiales las marcas"],
            ["ul", [
                "<b>Línea insignia:</b> acero inoxidable al vacío (premium, aislado).",
                "<b>Línea activa/niños:</b> Tritan (ligero, seguro, resistente a rotura).",
                "<b>Promo/presupuesto:</b> plástico libre de BPA para regalos de volumen.",
                "<b>Hogar/bienestar:</b> vidrio con funda para historia de sabor premium.",
            ]],
        ],
        "faq": [
            ("¿Es el plástico Tritan seguro y libre de BPA?",
             "Sí. Tritan es un copoliéster libre de BPA desarrollado específicamente para contacto con alimentos y productos infantiles. Es duradero, transparente, apto para lavavajillas (parte superior) y no contiene Bisfenol A, B ni S. Es una alternativa premium común al plástico PP/PS estándar para botellas deportivas e infantiles donde importan claridad y tenacidad."),
            ("¿Qué material de artículos de bebida mantiene las bebidas calientes o frías por más tiempo?",
             "El acero inoxidable de doble pared al vacío mantiene bebidas calientes o frías durante muchas horas (a menudo 6–12h caliente, 12–24h frío). El vidrio y el plástico/Tritan de pared simple aportan poca o ninguna retención térmica salvo que lleven funda aislada. Si la retención de temperatura es el argumento de venta, el acero al vacío es la elección clara."),
            ("¿Cuál es el material de artículos de bebida más duradero?",
             "El acero inoxidable (304/316) es el más duradero para uso diario y exterior: resiste abolladuras, óxido y caídas. Tritan es muy resistente para un plástico y resistente a la rotura. El vidrio es lo más frágil (propenso a romperse) a pesar de ser químicamente inerte. Para viaje y niños, el acero o el Tritan ganan en durabilidad."),
        ],
        "inquiry_h2": "Fabrica en Cualquiera de estos Materiales",
        "inquiry_p": "STWADD es una fábrica de Yongkang que produce acero inoxidable al vacío, Tritan, plástico libre de BPA y vidrio — con materiales de grado alimentario conformes a FDA/LFGB y pruebas SGS. OEM/ODM directo de fábrica.",
        "inquiry_a": "Solicitar Cotización",
        "footer_guides": [("Todas las Guías", "index"), ("Elegir un Fabricante", "choose-water-bottle-manufacturer"), ("304 vs 316 Acero", "304-vs-316-stainless-steel"), ("Verificar una Fábrica", "verify-chinese-factory")],
    },
    "pt": {
        "title": "Comparação de Materiais para Bebidas — Tritan vs Plástico vs Vidro vs Aço | STWADD",
        "meta": "Compare materiais de utensílios de bebida — Tritan, plástico, vidro e aço inoxidável — em durabilidade, segurança, isolamento, peso e preço para escolher o material certo para seu mercado.",
        "hero_tag": "GUIA PARA COMPRADORES 05",
        "h1": "Comparação de Materiais para Bebidas: Tritan vs Plástico vs Vidro vs Aço Inoxidável",
        "lead": "Escolher o material certo define preço, durabilidade, história de segurança e quem compra. Este guia compara os quatro materiais comuns em dimensões que importam a marcas e compradores, para que você escolha (ou misture) o certo para seu mercado.",
        "body": [
            ["h2", "Num relance"],
            ["table", [
                ["Dimensão", "Aço Inoxidável", "Tritan", "Plástico (PP/PS)", "Vidro"],
                ["Durabilidade", "Muito alta", "Alta (resist. a quebra)", "Média", "Baixa (frágil)"],
                ["Isolamento (vácuo)", "Excelente (horas quente/frio)", "Nenhum", "Nenhum", "Nenhum"],
                ["Segurança", "Grau alimentar, inerte", "Livre de BPA", "Verificar livre de BPA", "Inerte, sabor puro"],
                ["Peso", "Mais pesado", "Leve", "O mais leve", "Pesado"],
                ["Preço (unidade)", "Mais alto", "Médio", "O mais baixo", "Médio-Alto"],
                ["Melhor para", "Viagem, exterior, presentes", "Esporte, crianças", "Promo, orçamento", "Casa, sabor premium"],
            ]],
            ["h2", "Aço inoxidável (304 / 316)"],
            ["p", "O trabalho pesado premium. O aço a vácuo mantém bebidas quentes 6–12h e frias 12–24h, é extremamente durável e de grau alimentar e inerte. Ideal para viagem, exterior, presentes e qualquer marca onde a retenção de temperatura é o argumento de venda. Maior custo unitário, mas permite preço premium."],
            ["h2", "Tritan (copoliéster livre de BPA)"],
            ["p", "Plástico transparente, resistente e livre de BPA desenvolvido para contato com alimentos e infantis. Mais leve e resistente a quebra, ideal para garrafas esportivas e infantis onde clareza e impacto importam. Não retém temperatura salvo se isolado. Um forte posicionamento de \"plástico seguro\" frente ao PP/PS padrão."],
            ["h2", "Plástico padrão (PP / PS)"],
            ["p", "A opção de menor custo — comum para garrafas promocionais e de orçamento. Escolha graus livres de BPA e verifique conformidade de contato com alimentos. Menos durável e menos premium; melhor para brindes de grande volume que para um produto de construção de marca."],
            ["h2", "Vidro"],
            ["p", "Quimicamente inerte com sabor puro e sensação premium de casa/escritório, mas frágil e pesado. Muitas vezes com capa protetora. Melhor para uso estacionário e posicionamento de bem-estar que para viagem ou crianças."],
            ["h2", "Como as marcas costumam misturar materiais"],
            ["ul", [
                "<b>Linha de ponta:</b> aço inoxidável a vácuo (premium, isolado).",
                "<b>Linha ativa/crianças:</b> Tritan (leve, seguro, resistente a quebra).",
                "<b>Promo/orçamento:</b> plástico livre de BPA para brindes de volume.",
                "<b>Casa/bem-estar:</b> vidro com capa para história de sabor premium.",
            ]],
        ],
        "faq": [
            ("O plástico Tritan é seguro e livre de BPA?",
             "Sim. Tritan é um copoliéster livre de BPA desenvolvido especificamente para contato com alimentos e produtos infantis. É durável, transparente, próprio para lava-louças (nível superior) e não contém Bisfenol A, B ou S. É uma alternativa premium comum ao plástico PP/PS padrão para garrafas esportivas e infantis onde clareza e tenacidade importam."),
            ("Qual material de utensílios mantém bebidas quentes ou frias por mais tempo?",
             "O aço inoxidável de parede dupla a vácuo mantém bebidas quentes ou frias por muitas horas (geralmente 6–12h quente, 12–24h frio). Vidro e plástico/Tritan de parede simples oferecem pouca ou nenhuma retenção térmica a menos que tenham capa isolante. Se a retenção de temperatura é o argumento de venda, o aço a vácuo é a escolha clara."),
            ("Qual é o material de utensílios mais durável?",
             "O aço inoxidável (304/316) é o mais durável para uso diário e exterior: resiste amassados, ferrugem e quedas. Tritan é muito resistente para um plástico e resistente a quebra. O vidro é o mais frágil (propenso a quebrar) apesar de quimicamente inerte. Para viagem e crianças, aço ou Tritan ganham em durabilidade."),
        ],
        "inquiry_h2": "Fabrique em Qualquer destes Materiais",
        "inquiry_p": "STWADD é uma fábrica de Yongkang que produz aço inoxidável a vácuo, Tritan, plástico livre de BPA e vidro — com materiais de grau alimentar conformes a FDA/LFGB e testes SGS. OEM/ODM direto de fábrica.",
        "inquiry_a": "Solicitar Cotação",
        "footer_guides": [("Todos os Guias", "index"), ("Escolher um Fabricante", "choose-water-bottle-manufacturer"), ("304 vs 316 Aço", "304-vs-316-stainless-steel"), ("Verificar uma Fábrica", "verify-chinese-factory")],
    },
    "ru": {
        "title": "Сравнение материалов посуды — Тритан vs пластик vs стекло vs сталь | STWADD",
        "meta": "Сравните материалы посуды — Тритан, пластик, стекло и нержавеющую сталь — по долговечности, безопасности, теплоизоляции, весу и цене для выбора подходящего материала.",
        "hero_tag": "РУКОВОДСТВО ДЛЯ ПОКУПАТЕЛЕЙ 05",
        "h1": "Сравнение материалов посуды: Тритан против пластика против стекла против нержавеющей стали",
        "lead": "Правильный выбор материала определяет цену, долговечность, историю безопасности и круг покупателей. Это руководство сравнивает четыре распространённых материала посуды по параметрам, важным для брендов и покупателей, чтобы вы выбрали (или скомбинировали) подходящий для своего рынка.",
        "body": [
            ["h2", "Одним взглядом"],
            ["table", [
                ["Параметр", "Нержавеющая сталь", "Тритан", "Пластик (PP/PS)", "Стекло"],
                ["Долговечность", "Очень высокая", "Высокая (ударостойк.)", "Средняя", "Низкая (хрупкое)"],
                ["Изоляция (вакуум)", "Отлично (часы горяч./холод.)", "Нет", "Нет", "Нет"],
                ["Безопасность", "Пищевая, инертная", "Без BPA", "Проверить без BPA", "Инертное, чистый вкус"],
                ["Вес", "Тяжелее", "Лёгкий", "Самый лёгкий", "Тяжёлое"],
                ["Цена (за ед.)", "Выше", "Средняя", "Самая низкая", "Средне-Высокая"],
                ["Лучше всего для", "Путешествия, наружное, подарки", "Спорт, дети", "Промо, бюджет", "Дом, премиум вкус"],
            ]],
            ["h2", "Нержавеющая сталь (304 / 316)"],
            ["p", "Премиальная работа лошадка. Вакуумная сталь держит горячее 6–12 ч и холодное 12–24 ч, чрезвычайно долговечна, пищевая и инертная. Идеальна для путешествий, наружного use, подарков и любого бренда, где сохранение температуры — аргумент продажи. Выше себестоимость, но оправдывает премиальную цену."],
            ["h2", "Тритан (без-BPA сополиэфир)"],
            ["p", "Прозрачный, прочный и без BPA пластик, разработанный для контакта с пищей и детских товаров. Легче и ударостойкий, идеален для спортивных и детских бутылок, где важны прозрачность и ударопрочность. Не держит температуру, если не изолирован. Сильное позиционирование \"безопасного пластика\" против стандартного PP/PS."],
            ["h2", "Стандартный пластик (PP / PS)"],
            ["p", "Самый дешёвый вариант — обычен для промо и бюджетных бутылок. Выбирайте градации без BPA и проверяйте соответствие контакту с пищей. Менее долговечен и менее премиален; лучше для объёмных подарков, чем для брендообразующего продукта."],
            ["h2", "Стекло"],
            ["p", "Химически инертное с чистым вкусом и премиальным ощущением дома/офиса, но хрупкое и тяжёлое. Часто с защитным чехлом. Лучше для стационарного use и позиционирования благополучия, чем для путешествий или детей."],
            ["h2", "Как бренды обычно комбинируют материалы"],
            ["ul", [
                "<b>Флагманская линейка:</b> вакуумная нержавеющая сталь (премиум, изолированная).",
                "<b>Активная/детская:</b> Тритан (лёгкий, безопасный, ударостойкий).",
                "<b>Промо/бюджет:</b> пластик без BPA для объёмных подарков.",
                "<b>Дом/благополучие:</b> стекло с чехлом для истории чистого вкуса.",
            ]],
        ],
        "faq": [
            ("Безопасен ли пластик Тритан и не содержит ли он BPA?",
             "Да. Тритан — без-BPA сополиэфир, разработанный специально для контакта с пищей и детских товаров. Он долговечен, прозрачен, пригоден для посудомоечной машины (верхний ярус) и не содержит бисфенол A, B или S. Это распространённая премиальная альтернатива стандартному PP/PS для спортивных и детских бутылок, где важны прозрачность и прочность."),
            ("Какой материал посуды дольше всего держит горячее или холодное?",
             "Двустенная вакуумная нержавеющая сталь держит горячее или холодное много часов (часто 6–12 ч горячее, 12–24 ч холодное). Стекло и одностенные пластик/Тритан почти не сохраняют тепло без изолирующего чехла. Если сохранение температуры — аргумент продажи, вакуумная сталь — явный выбор."),
            ("Какой материал посуды самый долговечный?",
             "Нержавеющая сталь (304/316) долговечнее всего для повседневного и наружного use — устойчива к вмятинам, ржавчине и падениям. Тритан очень прочен для пластика и ударостоек. Стекло самое хрупкое (бьётся) несмотря на химическую инертность. Для путешествий и детей сталь или Тритан выигрывают по долговечности."),
        ],
        "inquiry_h2": "Производим из любого из этих материалов",
        "inquiry_p": "STWADD — фабрика в Юнкане, производящая вакуумную нержавеющую сталь, Тритан, пластик без BPA и стекло — с пищевыми материалами, соответствующими FDA/LFGB, и испытаниями SGS. OEM/ODM напрямую с завода.",
        "inquiry_a": "Запросить смету",
        "footer_guides": [("Все руководства", "index"), ("Выбрать производителя", "choose-water-bottle-manufacturer"), ("304 vs 316 сталь", "304-vs-316-stainless-steel"), ("Проверить фабрику", "verify-chinese-factory")],
    },
    "ar": {
        "title": "مقارنة مواد أواني الشرب — تريتان مقابل بلاستيك مقابل زجاج مقابل فولاذ | STWADD",
        "meta": "قارن مواد أواني الشرب — تريتان، بلاستيك، زجاج وفولاذ مقاوم للصدأ — في المتانة والسلامة والعزل والوزن والسعر لاختيار المادة المناسبة لسوقك.",
        "hero_tag": "دليل المشترين 05",
        "h1": "مقارنة مواد أواني الشرب: تريتان مقابل بلاستيك مقابل زجاج مقابل فولاذ مقاوم للصدأ",
        "lead": "اختيار المادة المناسبة يحدد السعر والمتانة وقصة السلامة وشريحة المشترين. يقارن هذا الدليل المواد الأربع الشائعة لأواني الشرب في الأبعاد التي تهم العلامات والمشترين، لتختار (أو تخلط) المناسب لسوقك.",
        "body": [
            ["h2", "لمحة سريعة"],
            ["table", [
                ["البعد", "فولاذ مقاوم للصدأ", "تريتان", "بلاستيك (PP/PS)", "زجاج"],
                ["المتانة", "عالية جدًا", "عالية (مقاوم للكسر)", "متوسطة", "منخفضة (هش)"],
                ["العزل (مفرغ)", "ممتاز (ساعات ساخن/بارد)", "لا شيء", "لا شيء", "لا شيء"],
                ["السلامة", "غذائي خامل", "خالٍ من BPA", "تحقق خالٍ من BPA", "خامل نقي المذاق"],
                ["الوزن", "أثقل", "خفيف", "الأخف", "ثقيل"],
                ["السعر (للوحدة)", "أعلى", "متوسط", "الأقل", "متوسط-مرتفع"],
                ["الأفضل لـ", "سفر وخارجي وهدايا", "رياضة وأطفال", "ترويج وميزانية", "منزل ومذاق فاخر"],
            ]],
            ["h2", "الفولاذ المقاوم للصدأ (304 / 316)"],
            ["p", "العملة الفاخرة. الفولاذ المفرغ يحفظ الساخن 6–12 ساعة والبارد 12–24 ساعة، متين جدًا وغذائي خامل. مثالي للسفر والخارجي والهدايا وأي علامة تجعل حفظ الحرارة حجة البيع. تكلفة وحدة أعلى، لكنه يبرر سعرًا فاخرًا."],
            ["h2", "تريتان (بوليستر مشترك خالٍ من BPA)"],
            ["p", "بلاستيك شفاف ومتين وخالٍ من BPA طُوّر للتلامس مع الغذاء والمنتجات الطفلية. أخف وأكثر مقاومة للكسر، مثالي لزجاجات الرياضة والأطفال حيث تهم الشفافية وتحمل الصدمات. لا يحفظ الحرارة ما لم يكن معزولًا. تموضع قوي \"بلاستيك آمن\" مقابل PP/PS القياسي."],
            ["h2", "البلاستيك القياسي (PP / PS)"],
            ["p", "الخيار الأقل تكلفة — شائع للزجاجات الترويجية والميزانية. اختر درجات خالية من BPA وتحقق من امتثال التلامس مع الغذاء. أقل متانة وأقل فاخرية؛ أفضل لهدايا الحجم الكبير لا لمنتج بناء علامة."],
            ["h2", "الزجاج"],
            ["p", "خامل كيميائي بنكهة نقية وإحساس فاخر للمنزل/المكتب، لكنه هش وثقيل. غالبًا بغطاء واقٍ. أفضل للاستخدام الثابت وتموضع العافية لا للسفر أو الأطفال."],
            ["h2", "كيف تخلط العلامات المواد عادةً"],
            ["ul", [
                "<b>الخط الرئيسي:</b> فولاذ مفرغ (فاخر ومعزول).",
                "<b>خط نشط/أطفال:</b> تريتان (خفيف وآمن ومقاوم للكسر).",
                "<b>ترويج/ميزانية:</b> بلاستيك خالٍ من BPA لهدايا الحجم.",
                "<b>منزل/عافية:</b> زجاج بغطاء لقصة مذاق فاخر.",
            ]],
        ],
        "faq": [
            ("هل البلاستيك تريتان آمن وخالٍ من BPA؟",
             "نعم. تريتان بوليستر مشترك خالٍ من BPA طُوّر خصيصًا للتلامس مع الغذاء والمنتجات الطفلية. متين وشفاف ومناسب لغسالة الأطباق (الرف العلوي) ولا يحتوي بيسفينول A أو B أو S. بديل فاخر شائع للبلاستيك PP/PS القياسي لزجاجات الرياضة والأطفال حيث تهم الشفافية والمتانة."),
            ("أي مادة لأواني الشرب تحفظ الساخن أو البارد أطول مدة؟",
             "الفولاذ المقاوم للصدأ مزدوج الجدار المفرغ يحفظ الساخن أو البارد لساعات عديدة (غالبًا 6–12 ساعة ساخن، 12–24 بارد). الزجاج والبلاستيك/تريتان أحادي الجدار لا يوفر احتفاظًا حراريًا يُذكر ما لم يكن بغطاء معزول. إن كان حفظ الحرارة حجة البيع، فالفولاذ المفرغ هو الخيار الواضح."),
            ("ما أعلى مواد أواني الشرب متانة؟",
             "الفولاذ المقاوم للصدأ (304/316) الأكثر متانة للاستخدام اليومي والخارجي — يقاوم الانبعاج والصدأ والسقوط. تريتان متين جدًا لبلاستيك ومقاوم للكسر. الزجاج الأكثر هشاشة (يسهل كسره) رغم خموله الكيميائي. للسفر والأطفال، الفولاذ أو تريتان يتفوقان في المتانة."),
        ],
        "inquiry_h2": "اصنع بأي من هذه المواد",
        "inquiry_p": "STWADD مصنع في يونكانغ ينتج الفولاذ المفرغ وتريتان وبلاستيكًا خالٍ من BPA والزجاج — بمواد غذائية مطابقة لـ FDA/LFGB وفحوص SGS. OEM/ODM مباشر من المصنع.",
        "inquiry_a": "اطلب عرض سعر",
        "footer_guides": [("كل الأدلة", "index"), ("اختيار مصنع", "choose-water-bottle-manufacturer"), ("304 مقابل 316 فولاذ", "304-vs-316-stainless-steel"), ("تحقق من مصنع", "verify-chinese-factory")],
    },
}

PAGES = ["index", "choose", "steel", "verify", "moq", "material"]


def hreflang_block(slug):
    en = f"{SITE}/guides/{slug}.html"
    lines = [f'    <link rel="alternate" hreflang="en" href="{en}" />']
    for lg in ["es", "pt", "ru", "ar"]:
        lines.append(f'    <link rel="alternate" hreflang="{lg}" href="{SITE}/{lg}/guides/{slug}.html" />')
    return "\n".join(lines)


def nav(lang):
    home = f"/{lang}/" if lang != "en" else "/"
    return f'''  <header class="header">
    <a class="logo" href="{home}">ST<span>WADD</span></a>
    <nav class="nav">
      <a href="{home}">{"Home" if lang=="en" else {"es":"Inicio","pt":"Início","ru":"Главная","ar":"الرئيسية"}[lang]}</a>
      <a href="/2026-catalog.html">{"Products" if lang=="en" else {"es":"Productos","pt":"Produtos","ru":"Продукция","ar":"المنتجات"}[lang]}</a>
      <a href="/oem-odm.html">OEM/ODM</a>
      <a href="/{lang}/guides/index.html">{"Guides" if lang=="en" else {"es":"Guías","pt":"Guias","ru":"Руководства","ar":"الأدلة"}[lang]}</a>
      <a href="/{lang}/about-us.html">{"About" if lang=="en" else {"es":"Acerca de","pt":"Sobre","ru":"О нас","ar":"من نحن"}[lang]}</a>
      <a href="/{lang}/contact-us.html">{"Contact" if lang=="en" else {"es":"Contacto","pt":"Contato","ru":"Контакты","ar":"اتصل"}[lang]}</a>
    </nav>
    <a class="cta" href="/{lang}/contact-us.html">{"Inquiry Now" if lang=="en" else {"es":"Solicitar Cotización","pt":"Solicitar Cotação","ru":"Запросить смету","ar":"اطلب عرض سعر"}[lang]}</a>
  </header>'''


def footer_company(lang):
    line = {"es": "Fundada en 2017 · Fábrica OEM y ODM (Fabricante)",
            "pt": "Fundada em 2017 · Fábrica OEM e ODM (Fabricante)",
            "ru": "Основана в 2017 · Фабрика OEM и ODM (Производитель)",
            "ar": "تأسست في 2017 · مصنع OEM وODM (صانع)"}[lang]
    return f'''    <div>
      <span class="logo">STWADD</span>
      <p>Yongkang STWADD Houseware Co., Ltd.<br>No. 138-1, Shifang East Road, Industrial Function Zone (Huku), Yongkang City, Zhejiang Province 321300, China</p>
      <p style="margin-top:10px">{line}</p>
    </div>'''


def footer_products_col(lang, labels):
    items = "".join(f'      <p><a href="{u}">{t}</a></p>' for t, u in [
        (labels[0], "/2026-catalog.html"),
        (labels[1], "/oem-odm.html"),
        (labels[2], "/all-products.html"),
        (labels[3], f"/{lang}/guides/index.html"),
    ])
    return f'''    <div>
      <h3>{"Products" if lang=="en" else {"es":"Productos","pt":"Produtos","ru":"Продукция","ar":"المنتجات"}[lang]}</h3>
{items}
    </div>'''


def footer_contact():
    return '''    <div>
      <h3>Contact</h3>
      <p>Email: <a href="mailto:bob@stwadd.com">bob@stwadd.com</a></p>
      <p>Phone: <a href="tel:+86-150-8822-8843">+86-150-8822-8843</a></p>
      <p>WhatsApp: +86 150 8822 8843</p>
    </div>'''


def render_body(body):
    out = []
    for block in body:
        t = block[0]
        if t == "h2":
            out.append(f'    <h2>{block[1]}</h2>')
        elif t == "h3":
            out.append(f'    <h3>{block[1]}</h3>')
        elif t == "p":
            out.append(f'    <p>{block[1]}</p>')
        elif t == "ul":
            lis = "".join(f"      <li>{li}</li>" for li in block[1])
            out.append(f'    <ul>\n{lis}\n    </ul>')
        elif t == "checklist":
            out.append(f'    <div class="checklist">{block[1]}</div>')
        elif t == "step":
            out.append(f'    <div class="step">{block[1]}</div>')
        elif t == "timeline":
            out.append(f'    <div class="timeline">{block[1]}</div>')
        elif t == "table":
            rows = []
            for r in block[1]:
                cells = "".join(f"<td>{c}</td>" if i > 0 else f"<th>{c}</th>" for i, c in enumerate(r))
                rows.append(f"      <tr>{cells}</tr>")
            out.append('    <table><tbody>\n' + "\n".join(rows) + '\n    </tbody></table>')
    return "\n".join(out)


def build_index(lang, d):
    slug = "index"
    canonical = f"{SITE}/{lang}/guides/index.html"
    cards = ""
    for num, h3, p, read, target in d["cards"]:
        href = f"/{lang}/guides/{target}.html" if target != "oem-odm" else "/oem-odm.html"
        cards += f'''      <a class="guide-card" href="{href}">
        <div class="num">{num}</div>
        <h3>{h3}</h3>
        <p>{p}</p>
        <span class="read">{read}</span>
      </a>
'''
    json_ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "STWADD " + {"es":"Guías y Recursos para Compradores","pt":"Guias e Recursos para Compradores","ru":"Руководства и ресурсы для покупателей","ar":"أدلة وموارد المشترين"}[lang],
        "description": d["meta"],
        "url": canonical,
        "isPartOf": {"@id": f"{SITE}/#organization"},
        "mainEntity": [
            {"@type": "ListItem", "position": i + 1,
             "name": c[1],
             "url": f"{SITE}/{lang}/guides/{c[4]}.html" if c[4] != "oem-odm" else f"{SITE}/oem-odm.html"}
            for i, c in enumerate(d["cards"][:5])
        ],
    }
    ldg = json.dumps(json_ld, ensure_ascii=False, indent=2)
    html = f'''<!DOCTYPE html>
<html lang="{lang}"{" dir=\"rtl\"" if lang=="ar" else ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{d["title"]}</title>
<meta name="description" content="{d["meta"]}">
<link rel="canonical" href="{canonical}">
{hreflang_block(slug)}
<script type="application/ld+json">
{ldg}
</script>
<style>
{CSS}
</style>
</head>
<body>
{nav(lang)}

<div class="wrap">
  <div class="crumb"><a href="/{lang}/">{"Home" if lang=="en" else {"es":"Inicio","pt":"Início","ru":"Главная","ar":"الرئيسية"}[lang]}</a> &rsaquo; <span>{"Buyer's Guides" if lang=="en" else {"es":"Guías para Compradores","pt":"Guias para Compradores","ru":"Руководства для покупателей","ar":"أدلة المشترين"}[lang]}</span></div>

  <section class="hero">
    <span class="tag">{d["hero_tag"]}</span>
    <h1 class="h1">{d["h1"]}</h1>
    <p class="lead">{d["lead"]}</p>
  </section>

  <section class="section">
    <h2>{"Choose a topic" if lang=="en" else {"es":"Elige un tema","pt":"Escolha um tema","ru":"Выберите тему","ar":"اختر موضوعًا"}[lang]}</h2>
    <div class="guide-grid">
{cards}    </div>
  </section>

  <section class="inquiry">
    <h2>{d["inquiry_h2"]}</h2>
    <p>{d["inquiry_p"]}</p>
    <a href="/{lang}/contact-us.html">{d["inquiry_a"]}</a>
  </section>
</div>

<footer class="footer">
  <div class="cols">
{footer_company(lang)}
{footer_products_col(lang, d["footer_products"])}
{footer_contact()}
  </div>
</footer>
</body>
</html>
'''
    return html


def build_article(lang, key, d):
    slug = SLUGS[key]
    canonical = f"{SITE}/{lang}/guides/{slug}.html"
    body_html = render_body(d["body"])
    faq_html = ""
    for q, a in d["faq"]:
        faq_html += f'''    <div class="faq-item">
      <div class="q">{q}</div>
      <div class="a">{a}</div>
    </div>
'''
    json_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in d["faq"]
        ],
    }
    ldg = json.dumps(json_ld, ensure_ascii=False, indent=2)
    fg = "".join(f'      <p><a href="/{lang}/guides/{h}.html">{t}</a></p>' for t, h in d["footer_guides"])
    home = f"/{lang}/"
    html = f'''<!DOCTYPE html>
<html lang="{lang}"{" dir=\"rtl\"" if lang=="ar" else ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{d["title"]}</title>
<meta name="description" content="{d["meta"]}">
<link rel="canonical" href="{canonical}">
{hreflang_block(slug)}
<script type="application/ld+json">
{ldg}
</script>
<style>
{CSS}
</style>
</head>
<body>
{nav(lang)}

<div class="wrap">
  <div class="crumb"><a href="{home}">{"Home" if lang=="en" else {"es":"Inicio","pt":"Início","ru":"Главная","ar":"الرئيسية"}[lang]}</a> &rsaquo; <a href="/{lang}/guides/index.html">{"Guides" if lang=="en" else {"es":"Guías","pt":"Guias","ru":"Руководства","ar":"الأدلة"}[lang]}</a> &rsaquo; <span>{d["hero_tag"].split(" ")[-1]}</span></div>

  <section class="hero">
    <span class="tag">{d["hero_tag"]}</span>
    <h1 class="h1">{d["h1"]}</h1>
    <p class="lead">{d["lead"]}</p>
  </section>

{body_html}

  <section class="section">
    <h2>{"Frequently Asked Questions" if lang=="en" else {"es":"Preguntas Frecuentes","pt":"Perguntas Frequentes","ru":"Часто задаваемые вопросы","ar":"أسئلة شائعة"}[lang]}</h2>
{faq_html}  </section>

  <section class="inquiry">
    <h2>{d["inquiry_h2"]}</h2>
    <p>{d["inquiry_p"]}</p>
    <a href="/{lang}/contact-us.html">{d["inquiry_a"]}</a>
  </section>
</div>

<footer class="footer">
  <div class="cols">
{footer_company(lang)}
    <div>
      <h3>{"Guides" if lang=="en" else {"es":"Guías","pt":"Guias","ru":"Руководства","ar":"الأدلة"}[lang]}</h3>
{fg}    </div>
{footer_contact()}
  </div>
</footer>
</body>
</html>
'''
    return html


def main():
    for lang in LANGS:
        gdir = os.path.join(ROOT, lang, "guides")
        os.makedirs(gdir, exist_ok=True)
        # index
        with open(os.path.join(gdir, "index.html"), "w", encoding="utf-8") as f:
            f.write(build_index(lang, IDX[lang]))
        # articles
        for key in ["choose", "steel", "verify", "moq", "material"]:
            with open(os.path.join(gdir, SLUGS[key] + ".html"), "w", encoding="utf-8") as f:
                f.write(build_article(lang, key, ART[key][lang]))
        print(f"Generated {lang}/guides: 6 files")


if __name__ == "__main__":
    main()
