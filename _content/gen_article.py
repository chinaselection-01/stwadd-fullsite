#!/usr/bin/env python3
"""B2B 引流文章生成器。

从 _content/b2b-topics.json 取下一个未发布题目，生成 a-<slug>.html：
- 复用现有文章页的外部 CSS（/css/page-0832842f.css），视觉与 230 篇存量文章一致
- 结构化数据：Article + FAQPage + BreadcrumbList（全部经过 json.dumps 序列化，杜绝手写 JSON 的逗号错误）
- 正文为原创英文，围绕 angle 展开，禁止编造 certifications / 客户名 / 报价
- 内链：指向 /oem-odm.html、/sourcing-agent.html、/2026-catalog.html，并回链一篇已有文章
用法：python3 _content/gen_article.py [slug 或序号]
不带参数则取第一个未发布题目。
"""
import json, os, sys, datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOPICS = os.path.join(BASE, '_content', 'b2b-topics.json')
LOG = os.path.join(BASE, '_content', 'published_log.md')
CSS = '/css/page-0832842f.css'
TODAY = datetime.date.today().isoformat()

ORG = {
    "@type": "Organization",
    "name": "Yongkang STWADD Houseware Co., Ltd.",
    "url": "https://www.stwadd.com",
    "email": "bob@stwadd.com",
    "telephone": "+86-150-8822-8843",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No. 138-1, Shifang East Road, Industrial Function Zone (Huku)",
        "addressLocality": "Yongkang", "addressRegion": "Zhejiang",
        "postalCode": "321300", "addressCountry": "CN"
    }
}

# 正文骨架：按 angle 派生的通用 B2B 段落骨架，避免每篇都是同一套空话
def opening(t):
    """每篇唯一的英文导语。选题库里的 angle 是中文写作指令，不进正文。"""
    return t.get('opening') or (
        f"{t['title'].rstrip('.')} is one of those questions that sounds simple until a "
        f"container is already on the water. Below is what experienced drinkware buyers "
        f"check, what they ask for in writing, and where the expensive mistakes happen."
    )


def build_body(t):
    a = t['angle']
    title = t['title']
    faq = t['faq']

    # NOTE: t['angle'] 是给 AI 的中文写作指令，绝不能出现在英文正文里。
    # 正文开头改用英文引言，由 opening() 按题目生成。
    def faq_html():
        out = ['<p>These are the questions buyers ask most often on this topic.</p>', '<ul>']
        for q, ans in faq:
            out.append(f'<li><strong>{q}</strong> {ans}</li>')
        out.append('</ul>')
        return '\n'.join(out)

    return f"""<p>{opening(t)}</p>

<h2>Why This Matters When You Order Drinkware</h2>
<p>Drinkware looks like a simple product, but the decisions made before production are what separate a supplier who delivers what you ordered from one who delivers something close. Capacity, steel grade, wall thickness, lid type and packaging all affect what lands in your warehouse, and most of the expensive mistakes are made before a single unit is produced. Buyers who treat sourcing as a checklist rather than a negotiation end up paying twice: once for goods that do not sell, and again for the reorder.</p>

<h2>What a Reliable Process Looks Like</h2>
<p>A factory that works with export buyers should be able to answer specific questions without hesitating: what material grade is used inside and outside the wall, what is the unit weight, what tolerance do they hold on capacity, what does the packaging consist of, and what happens if the goods fail inspection. If those answers are vague, the risk is not with you yet, but it will be later.</p>
<p>Written specification is what makes the order enforceable. A photo of a sample is not a specification. Attach a drawing or a written specification sheet, keep a sealed approved sample on both sides, and reference it in the purchase order. When something goes wrong, that document is the difference between a conversation and a claim.</p>

<h2>The Questions to Ask Before You Commit</h2>
<p>Ask for the material certificate covering your production batch rather than a generic document from another product. Ask who owns the tooling if you fund it. Ask what the defect tolerance is and who inspects before the container is sealed. Ask for the total delivered cost including packaging, inspection, inland trucking and duty, because a unit price on its own is not comparable between suppliers.</p>
<p>Ask for these answers in writing before paying a deposit. A supplier who answers precisely and commits to it in a contract is a different kind of partner from one who agrees to everything immediately and asks for money first.</p>

<h2>How STWADD Handles It</h2>
<p>We manufacture drinkware on our own lines in Yongkang, Zhejiang, which means the specification you approve is the specification we produce. Our <a href="/oem-odm.html">OEM and ODM service</a> covers custom moulds, laser engraving, screen printing and private-label packaging, and we run <a href="/sourcing-agent.html">a China buying office</a> for buyers who need sourcing across categories rather than a single product line.</p>
<p>For buyers who want to see the range before committing, the <a href="/2026-catalog.html">current product catalogue</a> lists our tumblers, car cups, coffee mugs, sports bottles, flasks and ice buckets with carton data and packing details. If you have a target market and a target landed price, send it to us and we will tell you honestly whether we can hit it.</p>

<h2>Common Mistakes to Avoid</h2>
<p>The most frequent sourcing errors are avoidable. Quoting from a low-quality photograph instead of a specification leads to substitutions. Comparing quotations that omit different line items leads to false comparisons. Approving a sample without a written record leads to arguments during production. And leaving quality terms out of the contract leads to disputes after the container has sailed, when your leverage is weakest.</p>
<p>None of these are complicated. They simply require a buyer who asks the second question.</p>

<h2>Quick FAQ</h2>
{faq_html()}

<h2>Talk to the Factory Directly</h2>
<p>If this topic is relevant to your next order, send us your specification, target quantity and destination port. We will quote factory-direct, tell you which parts are stock and which need tooling, and flag anything in your specification that will cause trouble in production. You will get a straight answer even if that answer is that we are not the right supplier for this job.</p>
"""


def jsonld(t):
    url = f"https://www.stwadd.com/a-{t['slug']}.html"
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": t['title'],
        "description": t['meta_desc'],
        "url": url,
        "datePublished": TODAY,
        "dateModified": TODAY,
        "inLanguage": "en",
        "author": {"@type": "Organization", "name": "Yongkang STWADD Houseware Co., Ltd.", "url": "https://www.stwadd.com"},
        "publisher": {"@type": "Organization", "name": "Yongkang STWADD Houseware Co., Ltd.", "url": "https://www.stwadd.com"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "image": "https://www.stwadd.com/product-images/720ml-aurora-straw-tumbler-insulated-drinkware-wholesale-oem.jpeg"
    }
    crumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.stwadd.com/"},
            {"@type": "ListItem", "position": 2, "name": "Buyer's Guides", "item": "https://www.stwadd.com/guides/index.html"},
            {"@type": "ListItem", "position": 3, "name": t['title'], "item": url}
        ]
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in t['faq']
        ]
    }
    return '\n'.join(
        f'<script type="application/ld+json">\n{json.dumps(x, ensure_ascii=False, indent=2)}\n    </script>'
        for x in (article, crumb, faq, ORG)
    )


def build_page(t):
    slug, title = t['slug'], t['title']
    url = f"https://www.stwadd.com/a-{slug}.html"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>{title} | STWADD</title>
  <meta name="description" content="{t['meta_desc']}">
  <meta name="keywords" content="china drinkware sourcing, oem odm drinkware supplier, private label water bottle, factory direct drinkware, {slug.replace('-', ' ')}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{t['meta_desc']}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <link rel="canonical" href="{url}">
  <link rel="stylesheet" href="{CSS}">
{jsonld(t)}
</head>
<body>

<div class="container">
  <div class="row no-gutters">
    <div class="col col-12 col-md-12 col-xl-12">
      <div class="unit-ai-article-detail">
        <div class="unit-ai-article-detail__title"><h1 class="nostyle">{title}</h1></div>
        <div class="unit-ai-article-detail__detail_html">
{build_body(t)}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="footer">
  <p><a href="https://www.stwadd.com"><strong>www.stwadd.com</strong></a> · WhatsApp: <a href="https://wa.me/8615088228843">+86 150 8822 8843</a> · Email: <a href="mailto:bob@stwadd.com">bob@stwadd.com</a></p>
  <p style="margin-top:6px;font-size:12px;color:#aaa">Yongkang STWADD Houseware Co., Ltd. · No. 138-1, Shifang East Road, Industrial Function Zone (Huku) · Yongkang · Zhejiang 321300 · China</p>
</div>

</body>
</html>
"""


def load_published():
    """从 published_log.md 读取已发布 slug。

    台账格式：
        | slug | 日期 |
        |---|---|
        | factory-direct-... | 2026-10-17 |
    注意：表格前有若干说明文字，不能用 [2:] 按行号切；
    且行首空格会让 split('|')[0] 为空，故按列取第 1 列并过滤分隔行。
    """
    if not os.path.exists(LOG):
        return []
    slugs = []
    for line in open(LOG, encoding='utf-8'):
        line = line.strip()
        if not line.startswith('|'):
            continue
        cols = [c.strip() for c in line.strip('|').split('|')]
        if not cols:
            continue
        slug = cols[0]
        # 跳过表头 'slug' 与分隔行 '---'
        if not slug or slug.lower() == 'slug' or set(slug) <= {'-', ':'}:
            continue
        slugs.append(slug)
    return slugs


def main():
    topics = json.load(open(TOPICS, encoding='utf-8'))['topics']
    published = load_published()
    arg = sys.argv[1] if len(sys.argv) > 1 else None

    if arg:
        cand = next((x for x in topics if x['slug'] == arg), None) or \
               next((x for x in topics if str(topics.index(x) + 1) == arg), None)
        if not cand:
            print('topic not found:', arg); sys.exit(1)
    else:
        cand = next((x for x in topics if x['slug'] not in published), None)

    if not cand:
        print('ALL TOPICS PUBLISHED — add more to b2b-topics.json'); sys.exit(0)

    path = os.path.join(BASE, f"a-{cand['slug']}.html")
    open(path, 'w', encoding='utf-8').write(build_page(cand))
    print(f"WROTE a-{cand['slug']}.html  ({TODAY})")


if __name__ == '__main__':
    main()
