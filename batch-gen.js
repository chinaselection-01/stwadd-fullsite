#!/usr/bin/env node
/*
 * batch-gen.js — 全量重做根目录 + 多语言(ar/es/ru/pt) 产品页
 * 用 git show origin/main:<file> 直接取原版内容(绕过 sparse/checkout 限制)
 * - 跳过非产品页(博客 a-、聚合 catalog 等)
 * - 主图用原链接 og:image 真实图, 下载本地 images/
 * - 多语言页保留 lang(阿拉伯语 dir=rtl)
 * - 文件名不变, 谷歌无感
 *
 * 用法: LIMIT=20 node batch-gen.js   (LIMIT 限制处理前 N 个, 用于试点)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const G = require('./gen-product-page.js');
const ROOT = __dirname;

const LIMIT = parseInt(process.env.LIMIT || '0', 10);

function gitShow(f){
  return execSync(`git show origin/main:${f}`, { maxBuffer: 100*1024*1024 }).toString();
}

// 非产品页: 博客 / 聚合目录 / 系统页
function isProduct(f){
  const b = path.basename(f);
  if(/^a-/.test(b)) return false;                       // 博客文章
  if(/(catalog|blog|guide|news|post|article|-faq)/i.test(f)) return false;
  return true;
}

function listFiles(){
  return execSync(`git ls-files '*.html'`).toString().split('\n').filter(Boolean)
    .filter(f => !f.startsWith('products/') && !f.startsWith('video/'))
    .filter(f => !/^(index|catalog|sitemap|robots|404|about|contact|oem|odm)/.test(f))
    .filter(f => !f.includes('2026-catalog'))
    .filter(isProduct);
}

// 下载单张图到 images/(已存在则跳过)
function downloadOne(url){
  return new Promise(res=>{
    const name = url.split('/').pop();
    const dest = path.join(ROOT,'images',name);
    if(fs.existsSync(dest) && fs.statSync(dest).size > 1500){ return res('cached'); }
    if(!/^https?:\/\//.test(url)) return res('skip');
    const req = https.get(url, { timeout: 25000, headers:{'User-Agent':'Mozilla/5.0'} }, r=>{
      if(r.statusCode !== 200){ console.log('  IMGFAIL', r.statusCode, name); return res('fail'); }
      const ws = fs.createWriteStream(dest);
      r.pipe(ws); ws.on('finish', ()=>res('ok'));
    });
    req.on('error', e=>{ console.log('  IMGERR', e.code, name); res('err'); });
    req.on('timeout', ()=>{ req.destroy(); console.log('  IMGTIMEOUT', name); res('timeout'); });
  });
}

(async()=>{
  const all = listFiles();
  const files = LIMIT ? all.slice(0, LIMIT) : all;
  console.log('产品页总数:', all.length, '| 本次处理:', files.length);

  let ok=0, skip=0, pending=[];
  function queueDl(url){ if(!url) return; pending.push(downloadOne(url)); if(pending.length>=40){ const b=pending; pending=[]; return Promise.all(b); } return null; }

  for(let i=0;i<files.length;i++){
    const f = files[i];
    try{
      const html = gitShow(f);
      const slug = path.basename(f).replace(/\.html$/,'');
      const lang = (html.match(/<html[^>]*lang="([^"]*)"/i)||[])[1] || 'en';
      const ex = G.extractExisting(html);
      const name = ex.h1 && ex.h1.length>5 ? ex.h1 : G.humanize(slug);
      const image = ex.ogImage || (ex.images&&ex.images[0]) || G.pickImage(slug);
      const specs = G.deriveSpecs(slug);
      const related = G.pickRelated(slug, f);
      const out = G.buildPage({ name, desc: ex.desc, image, slug, specs, related, url:f, lang });
      const fp = path.join(ROOT, f);
      fs.mkdirSync(path.dirname(fp), { recursive:true });
      fs.writeFileSync(fp, out);
      // 主图异步下载(若有)
      const p = queueDl(ex.ogImage || image);
      ok++;
      if(p) await p;
    }catch(e){
      console.log('GENFAIL', f, e.message);
      skip++;
    }
    if((i+1)%100===0) console.log(`  进度 ${i+1}/${files.length} ok=${ok}`);
  }
  // 收尾下载
  if(pending.length) await Promise.all(pending);
  console.log('完成: ok='+ok+' skip='+skip);
})();
