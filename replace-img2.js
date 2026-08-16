const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'images');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === 'images') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
}
const files = [];
walk(ROOT, files);

let replaced = 0, filesTouched = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  if (!/img\.yfisher\.com/i.test(raw)) continue;
  let html = raw;
  // 匹配 https:// 或 // 开头的 yfisher 图
  html = html.replace(/(https?:)?\/\/img\.yfisher\.com\/[^\s"'<>)]+/gi, (u) => {
    const fn = u.match(/[^\/]+\.(png|jpe?g|webp|gif|avif)/i);
    if (!fn) return u;
    replaced++;
    return 'images/' + fn[0];
  });
  if (html !== raw) { fs.writeFileSync(f, html); filesTouched++; }
}
console.log('替换 yfisher 引用:', replaced, ' 涉及文件:', filesTouched);

// 兜底: 任何指向不存在本地图的 <img src>
let broken = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  if (!/src="images\//.test(html)) continue;
  const nh = html.replace(/<img\b([^>]*?)\bsrc="images\/([^"]+)"/gi, (whole, pre, fn) => {
    if (!fs.existsSync(path.join(IMG_DIR, fn))) {
      broken++;
      return '<img' + pre + ' src="images/1721782693cf07b8.png"';
    }
    return whole;
  });
  if (nh !== html) fs.writeFileSync(f, nh);
}
console.log('兜底破图:', broken);
