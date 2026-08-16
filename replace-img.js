const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'images');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['ar','es','ru','pt','products'].includes(e.name)) walk(p, out);
      else if (e.name !== 'images') walk(p, out);
    } else if (e.name.endsWith('.html')) out.push(p);
  }
}
const files = [];
walk(ROOT, files);

// 收集所有 yfisher URL -> local filename
const map = JSON.parse(fs.readFileSync('/tmp/yf_urls.json', 'utf8'));
const urlMap = new Map(map);

let replaced = 0, broken = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  if (!html.includes('img.yfisher.com')) continue;
  html = html.replace(/https:\/\/img\.yfisher\.com\/[^\"')\s]+/gi, (u) => {
    const fn = u.match(/[^\/]+\.(png|jpe?g|webp|gif|avif)/i);
    if (!fn) return u;
    replaced++;
    return 'images/' + fn[0];
  });
  // 兜底: 指向不存在本地图的 <img>, 移除 src 避免破图
  html = html.replace(/<img\b([^>]*?)\bsrc="images\/([^"]+)"/gi, (whole, pre, fn) => {
    if (!fs.existsSync(path.join(IMG_DIR, fn))) {
      broken++;
      return '<img' + pre + ' src="images/1721782693cf07b8.png"'; // 用主图兜底
    }
    return whole;
  });
  fs.writeFileSync(f, html);
}
console.log('替换 yfisher 引用:', replaced, ' 兜底破图:', broken);
