const fs = require('fs');
const https = require('https');
const path = require('path');

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'images');
fs.mkdirSync(IMG_DIR, { recursive: true });

// 1) 收集所有生成页里残留的 yfisher URL
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['ar','es','ru','pt','products'].includes(e.name)) walk(p, out);
      else if (e.name !== 'images') walk(p, out);
    } else if (e.name.endsWith('.html')) {
      out.push(p);
    }
  }
}
const files = [];
walk(ROOT, files);

const urls = new Map(); // url -> filename
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /https:\/\/img\.yfisher\.com\/[^\"')\s]+/gi;
  let m;
  while ((m = re.exec(html))) {
    const u = m[0];
    const fm = u.match(/[^\/]+\.(png|jpe?g|webp|gif|avif)/i);
    if (fm) urls.set(u, fm[0]);
  }
}
console.log('需本地化唯一图:', urls.size);

// 2) 下载缺失的
function download(url, file) {
  return new Promise((res) => {
    if (fs.existsSync(file)) return res('skip');
    const req = https.get(url, { timeout: 25000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        // 跟随一次重定向
        https.get(r.headers.location, { timeout: 25000 }, (r2) => {
          if (r2.statusCode === 200) {
            const ws = fs.createWriteStream(file);
            r2.pipe(ws);
            ws.on('finish', () => res('ok'));
          } else { res('err' + r2.statusCode); }
        }).on('error', () => res('err'));
        return;
      }
      if (r.statusCode === 200) {
        const ws = fs.createWriteStream(file);
        r.pipe(ws);
        ws.on('finish', () => res('ok'));
      } else { res('err' + r.statusCode); }
    });
    req.on('error', () => res('err'));
    req.on('timeout', () => { req.destroy(); res('timeout'); });
  });
}

(async () => {
  let ok = 0, skip = 0, fail = 0;
  const entries = [...urls.entries()];
  for (const [url, fn] of entries) {
    const file = path.join(IMG_DIR, fn);
    const r = await download(url, file);
    if (r === 'ok') ok++;
    else if (r === 'skip') skip++;
    else { fail++; console.log('FAIL', r, fn); }
  }
  console.log(`下载完成: 新下载=${ok} 已存在=${skip} 失败=${fail}`);
  fs.writeFileSync('/tmp/yf_urls.json', JSON.stringify([...urls.entries()]));
})();
