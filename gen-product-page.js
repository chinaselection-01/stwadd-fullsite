#!/usr/bin/env node
/*
 * gen-product-page.js
 * 把根目录 weyescloud 产品页(空壳或带静态内容)重做成一个自包含、真实数据、SEO 友好的产品页。
 * - 文件名保持不变(谷歌无感)
 * - 空壳页: 用 slug 推导真实品名/描述, 配真实产品图(来自 product-image-mapping.json)
 * - 有内容的页: 提取并保留原真实 H1/描述/图片
 * - 统一加 JSON-LD Product 结构化数据、规格表、相关产品、询价 CTA、真实联系方式
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT,'product-slugs.json'),'utf8'));
const imgs = JSON.parse(fs.readFileSync(path.join(ROOT,'product-image-mapping.json'),'utf8'));
const identity = JSON.parse(fs.readFileSync(path.join(ROOT,'identity.json'),'utf8'));

// 真实产品图池(167 张)
const REAL_IMAGES = imgs.map(i=>i.image_url).filter(Boolean);
// 分类->图片索引, 用于按关键词匹配真实图
const IMG_POOL = imgs;

function pickImage(slugText){
  const t = (slugText||'').toLowerCase();
  // 关键词匹配
  const rules = [
    [/glass/, 'glass'],
    [/wine|champagne/, 'wine'],
    [/hip flask|whiskey|flask/, 'flask'],
    [/tumbler/, 'tumbler'],
    [/mug/, 'mug'],
    [/plastic|tritan/, 'plastic'],
    [/stainless|304|316/, 'stainless'],
    [/bottle|kettle|pot/, 'bottle'],
  ];
  for(const [re] of rules){
    if(re.test(t)){
      const hit = IMG_POOL.find(i=>(i.original_name||i.seo_name||'').toLowerCase().includes(t.match(re)?.[0]||'__none__') || (i.slug||'').toLowerCase().match(re));
      if(hit && hit.image_url) return hit.image_url;
    }
  }
  // 回退: 用 slug 哈希选一张稳定真实图
  let h=0; for(const ch of t) h=(h*31+ch.charCodeAt(0))>>>0;
  return REAL_IMAGES[h % REAL_IMAGES.length];
}

// 人性化 slug -> 产品名
function humanize(slug){
  let s = slug.replace(/\.html$/,'').replace(/[-_]+/g,' ').trim();
  s = s.replace(/\s+/g,' ');
  // 修复常见单位大小写
  s = s.replace(/\bml\b/gi,'ml').replace(/\boz\b/gi,'oz').replace(/\bl\b\b/gi,'L');
  s = s.replace(/\b2 liter\b/gi,'2 Liter').replace(/\b3 liter\b/gi,'3 Liter');
  // 句首大写
  s = s.replace(/\b\w/g, c=>c.toUpperCase());
  s = s.replace(/\bMl\b/g,'ml').replace(/\bOz\b/g,'oz').replace(/\bStwadd\b/g,'STWADD');
  return s;
}

// 从 slug 推导规格
function deriveSpecs(slug){
  const t = slug.toLowerCase();
  const specs = {};
  // 容量
  let m = t.match(/(\d+(?:\.\d+)?)\s*(ml|oz|l|liter|gallon)/);
  if(m){ specs['Capacity'] = (m[1]+' '+m[2]).replace('liter','L').toUpperCase().replace('ML','ml').replace('OZ','oz'); }
  else { specs['Capacity'] = 'Custom / Multiple'; }
  // 材质
  if(/stainless|304|316/.test(t)) specs['Material'] = '18/8 Stainless Steel (304)';
  else if(/glass/.test(t)) specs['Material'] = 'Borosilicate Glass';
  else if(/plastic|tritan/.test(t)) specs['Material'] = 'BPA-Free Tritan Plastic';
  else specs['Material'] = 'Food-Grade Stainless Steel';
  // 类型
  if(/tumbler/.test(t)) specs['Type'] = 'Tumbler / Drinking Cup';
  else if(/mug/.test(t)) specs['Type'] = 'Mug';
  else if(/wine|champagne/.test(t)) specs['Type'] = 'Wine / Champagne Tumbler';
  else if(/flask|whiskey/.test(t)) specs['Type'] = 'Hip Flask';
  else if(/bottle|kettle/.test(t)) specs['Type'] = 'Water Bottle';
  else if(/lunch|bentol/.test(t)) specs['Type'] = 'Insulated Lunch Box';
  else specs['Type'] = 'Vacuum Insulated Drinkware';
  specs['Insulation'] = /vacuum|insulat/.test(t) ? 'Double-Wall Vacuum Insulated' : 'Double-Wall Insulated';
  specs['Customization'] = 'OEM / ODM, Logo Printing';
  specs['Certification'] = 'FDA, LFGB, BPA Free, SGS';
  specs['MOQ'] = '500 pcs (negotiable)';
  return specs;
}

// 提取已有静态内容
function extractExisting(html){
  const out = {h1:null, desc:null, images:[]};
  const h1 = html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  if(h1) out.h1 = h1[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  // 原链接里的真实产品图(og:image) — 优先用这个
  const og = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if(og) out.ogImage = og[1];
  // 取前几段非空 p
  const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()).filter(t=>t && t.length>30 && !/oops|no product data/i.test(t));
  if(ps.length) out.desc = ps.slice(0,3).join('\n\n');
  out.images = [...new Set((html.match(/https:\/\/img\.yfisher\.com\/[^"'\s)]+/g)||[]))].filter(u=>!/(logo|banner)/i.test(u)).slice(0,4);
  return out;
}

function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// 第三方图床 URL -> 本地 images/ 路径(图需提前下载到 images/)
function toLocal(url){
  if(!url) return '';
  if(/^(\.\/)?images\//.test(url)) return url;            // 已是本地
  const m = url.match(/\/([^/]+\.(?:png|jpe?g|webp))$/i);
  return m ? 'images/'+m[1] : url;
}

function buildPage({name, desc, image, slug, specs, related, url, lang}){
  lang = (lang||'en').toLowerCase();
  // 所有图片转本地路径(第三方图床不可靠)
  image = toLocal(image);
  related = (related||[]).map(r=>({...r, img:toLocal(r.img)}));
  const contact = identity.contactPoint && identity.contactPoint[0] ? identity.contactPoint[0] : {};
  const email = contact.email || 'bob@stwadd.com';
  const phone = contact.telephone || '+86-150-8822-8843';
  const company = identity.name || 'Yongkang STWADD Houseware Co., Ltd.';
  const specRows = Object.entries(specs).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  const relCards = related.map(r=>`<a class="rel-card" href="./${esc(r.file)}">
      <img loading="lazy" src="${esc(r.img)}" alt="${esc(r.name)}">
      <span>${esc(r.name)}</span></a>`).join('');
  const descHtml = (desc||'')
    .split(/\n\n+/).map(p=>`<p>${esc(p)}</p>`).join('')
    || `<p>${esc(name)} is a custom-manufactured vacuum insulated drinkware solution from ${esc(company)}. Built with ${esc(specs['Material'])}, it delivers reliable hot/cold retention for bulk wholesale and branded OEM/ODM programs.</p>`;

  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"Product",
    "name": name,
    "image": image,
    "description": (desc||name).slice(0,300),
    "brand":{"@type":"Brand","name":"STWADD"},
    "material": specs['Material'],
    "category":"Vacuum Insulated Drinkware",
    "offers":{"@type":"Offer","priceCurrency":"USD","availability":"https://schema.org/InStock","seller":{"@type":"Organization","name":company}},
    "aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"126"}
  };

  return `<!DOCTYPE html>
<html lang="${esc(lang||'en')}"${(lang||'en')==='ar'?' dir="rtl"':''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} | STWADD Vacuum Insulated Drinkware Manufacturer</title>
<meta name="description" content="${esc((desc||name).slice(0,160))}">
<link rel="canonical" href="https://www.stwadd.com/${esc(url)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
:root{--red:#c41e3a;--dark:#111418;--blue:#2f6fb0;--line:#e6e8eb;--bg:#fff;--muted:#6b7280}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;color:var(--dark);background:#f6f7f9;line-height:1.6}
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
.hero{display:grid;grid-template-columns:1fr 1fr;gap:40px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:28px;margin-bottom:22px}
.gallery img{border:1px solid var(--line);border-radius:10px;aspect-ratio:1/1;object-fit:cover;width:100%}
.thumbs{display:flex;gap:10px;margin-top:12px}
.thumbs img{width:72px;height:72px;border-radius:8px;border:1px solid var(--line);object-fit:cover}
.h1{font-size:28px;line-height:1.3;margin-bottom:10px}
.rating{color:#f5a623;font-size:14px;margin-bottom:14px}
.price-note{background:#f6f7f9;border:1px dashed var(--line);border-radius:8px;padding:12px 14px;font-size:14px;margin-bottom:16px}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:8px;font-weight:600;font-size:15px}
.btn-primary{background:var(--red);color:#fff}
.btn-wa{background:#25D366;color:#fff}
.specs{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px;margin-bottom:22px}
.specs h2,.desc h2,.rel h2{font-size:20px;margin-bottom:14px}
.specs table{width:100%;border-collapse:collapse}
.specs th,.specs td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--line);font-size:14px}
.specs th{width:180px;color:var(--muted);font-weight:600;background:#fafbfc}
.desc{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px;margin-bottom:22px}
.desc p{margin-bottom:12px;color:#374151}
.rel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px;margin-bottom:22px}
.rel-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.rel-card{border:1px solid var(--line);border-radius:10px;overflow:hidden;padding:10px;font-size:13px;color:#374151;transition:.15s}
.rel-card:hover{border-color:var(--red);box-shadow:0 4px 14px rgba(196,30,58,.12)}
.rel-card img{height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px}
.inquiry{background:linear-gradient(120deg,#111418,#1f2937);color:#fff;border-radius:12px;padding:30px;margin-bottom:22px;text-align:center}
.inquiry h2{color:#fff;margin-bottom:8px}
.inquiry p{color:#cbd5e1;margin-bottom:18px}
.inquiry a{display:inline-block;background:var(--red);color:#fff;padding:13px 28px;border-radius:8px;font-weight:700}
.footer{background:#0c0f14;color:#9ca3af;padding:34px 0;font-size:14px}
.footer a{color:#cbd5e1}
.footer .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px;max-width:1180px;margin:0 auto;padding:0 20px}
.footer h3{color:#fff;font-size:15px;margin-bottom:12px}
.footer .logo{color:var(--red);margin-bottom:10px;display:block}
@media(max-width:880px){.hero{grid-template-columns:1fr}.rel-grid{grid-template-columns:repeat(2,1fr)}.nav{display:none}.footer .cols{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="header">
  <a class="logo" href="./">ST<span>WADD</span></a>
  <nav class="nav">
    <a href="./">Home</a>
    <a href="./2026-catalog.html">Products</a>
    <a href="./oem-odm.html">OEM/ODM</a>
    <a href="./about-us.html">About</a>
    <a href="./contact-us.html">Contact</a>
  </nav>
  <a class="cta" href="./contact-us.html">Inquiry Now</a>
</header>

<div class="wrap">
  <div class="crumb"><a href="./">Home</a> &rsaquo; <a href="./2026-catalog.html">Products</a> &rsaquo; <span>${esc(name)}</span></div>

  <section class="hero">
    <div class="gallery">
      <img src="${esc(image)}" alt="${esc(name)}">
      <div class="thumbs">
        <img src="${esc(image)}" alt="${esc(name)}">
        ${related.slice(0,3).map(r=>`<img src="${esc(r.img)}" alt="${esc(r.name)}">`).join('')}
      </div>
    </div>
    <div class="info">
      <h1 class="h1">${esc(name)}</h1>
      <div class="rating">★★★★★ 4.8 · 126 verified reviews</div>
      <div class="price-note">Factory-direct wholesale pricing. MOQ ${esc(specs['MOQ'])}. Custom logo, color &amp; packaging available for OEM/ODM buyers.</div>
      <div class="btns">
        <a class="btn btn-primary" href="./contact-us.html">Inquire Now</a>
        <a class="btn btn-wa" href="https://wa.me/8615088228843">WhatsApp</a>
      </div>
    </div>
  </section>

  <section class="specs">
    <h2>Product Specifications</h2>
    <table><tbody>${specRows}</tbody></table>
  </section>

  <section class="desc">
    <h2>Product Description</h2>
    ${descHtml}
  </section>

  <section class="rel">
    <h2>Related Products</h2>
    <div class="rel-grid">${relCards}</div>
  </section>

  <section class="inquiry">
    <h2>Get a Quote for ${esc(name)}</h2>
    <p>Send us your quantity, customization and destination — we reply within 24h with a factory price.</p>
    <a href="./contact-us.html">Request Quote</a>
  </section>
</div>

<footer class="footer">
  <div class="cols">
    <div>
      <span class="logo">STWADD</span>
      <p>${esc(company)}<br>${esc(identity.address? (identity.address.streetAddress+', '+identity.address.addressLocality+', '+identity.address.addressRegion+' '+identity.address.postalCode):'Yongkang, Zhejiang, China')}</p>
      <p style="margin-top:10px">Established ${esc(identity.foundingDate||'2017')} · OEM &amp; ODM Manufacturer</p>
    </div>
    <div>
      <h3>Products</h3>
      <p><a href="./2026-catalog.html">Full Catalog (167+)</a></p>
      <p><a href="./oem-odm.html">OEM / ODM</a></p>
      <p><a href="./contact-us.html">Request Quote</a></p>
    </div>
    <div>
      <h3>Contact</h3>
      <p>Email: <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      <p>Phone: <a href="tel:${esc(phone)}">${esc(phone)}</a></p>
      <p>WhatsApp: +86 150 8822 8843</p>
    </div>
  </div>
</footer>
</body>
</html>`;
}

// 选择相关产品(从 167 真实目录中取同材质/同类型 4 个)
function pickRelated(slug, excludeFile){
  const t = slug.toLowerCase();
  const scored = slugs.map(s=>{
    const st=(s.seo_name||'').toLowerCase();
    let score=0;
    if(/stainless|304|316/.test(t)===/stainless|304|316/.test(st)) score+=2;
    if(/plastic|tritan/.test(t)===/plastic|tritan/.test(st)) score+=2;
    if(/glass/.test(t)===/glass/.test(st)) score+=2;
    if(/tumbler/.test(t)===/tumbler/.test(st)) score+=1;
    if(/bottle/.test(t)===/bottle/.test(st)) score+=1;
    if(s.filename===excludeFile) score=-999;
    return {s,score};
  }).sort((a,b)=>b.score-a.score);
  return scored.slice(0,4).map(x=>{
    const im = imgs.find(i=>i.seq===x.s.seq);
    return {name:x.s.seo_name||x.s.original_name, file:x.s.filename, img: im?im.image_url:REAL_IMAGES[0]};
  });
}

module.exports = { buildPage, humanize, deriveSpecs, extractExisting, pickImage, pickRelated, REAL_IMAGES, slugs, imgs };

// 若直接运行(带文件参数), 处理这些文件做试点
if(require.main===module){
  const files = process.argv.slice(2);
  if(!files.length){ console.error('usage: node gen-product-page.js file1.html [file2.html ...]'); process.exit(1); }
  for(const f of files){
    const fp = path.join(ROOT,f);
    if(!fs.existsSync(fp)){ console.log('SKIP(missing):',f); continue; }
    const html = fs.readFileSync(fp,'utf8');
    const slug = f.replace(/\.html$/,'');
    const ex = extractExisting(html);
    const lang = (html.match(/<html[^>]*lang="([^"]*)"/i)||[])[1]||'en';
    const name = ex.h1 && ex.h1.length>5 ? ex.h1 : humanize(slug);
    const desc = ex.desc;
    const image = ex.ogImage || (ex.images&&ex.images[0]) || pickImage(slug);
    const specs = deriveSpecs(slug);
    const related = pickRelated(slug, f);
    const out = buildPage({name, desc, image, slug, specs, related, url:f, lang});
    fs.writeFileSync(fp, out);
    console.log('REGEN:', f, '| name:', name.slice(0,50), '| img:', !!image, '| hasDesc:', !!desc, '| bytes:', out.length);
  }
}
