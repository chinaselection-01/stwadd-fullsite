#!/usr/bin/env python3
# 清理产品/博客页里被 weyescloud 框架残留污染进"描述"字段的垃圾文本
# 垃圾特征: 导航菜单文字(HOME PRODUCTS / ABOUT US CONTACT US) + 原始 JS(window.scriptQueue.push / /assets/js/)
# 策略: 在每个描述字段里, 从第一个垃圾标记处截断, 保留干净前缀
import re, glob, os, sys

JUNK = ["HOME PRODUCTS", "VIDEO NEWS ABOUT US CONTACT US", "ABOUT US CONTACT US",
        "window.scriptQueue", "scriptQueue.push", "/assets/js/", "English (function",
        "header-nav.js", "initScriptAfterAppInit"]

def clean_text(t):
    idx = len(t)
    for m in JUNK:
        i = t.find(m)
        if i != -1 and i < idx:
            idx = i
    out = t[:idx].strip()
    # 轻量规范化双转义
    out = out.replace("&amp;amp;", "&amp;").replace("&amp;", "&")
    return out

def is_junk(t):
    return any(j in t for j in JUNK)

def process(html):
    orig = html
    # 1) <meta name="description" content="...">
    def fix_meta(m):
        c = m.group(1)
        if is_junk(c):
            return f'<meta name="description" content="{clean_text(c)}">'
        return m.group(0)
    html = re.sub(r'<meta name="description" content="(.*?)">', fix_meta, html, flags=re.S)

    # 2) JSON-LD 里的 "description":"..."
    def fix_ld(block):
        s = block.group(0)
        def fixdesc(dm):
            val = dm.group(1)
            if is_junk(val):
                return '"description":"' + clean_text(val).replace('"', '\\"') + '"'
            return dm.group(0)
        return re.sub(r'"description":"((?:[^"\\]|\\.)*)"', fixdesc, s)
    html = re.sub(r'<script[^>]*application/ld\+json[^>]*>.*?</script>', fix_ld, html, flags=re.S)

    # 3) 可见描述 <section class="desc"> 里的 <p>...</p>
    def fix_sec(sec):
        s = sec.group(0)
        def fixp(pm):
            c = pm.group(1)
            if is_junk(c):
                return ""  # 整段是 weyescloud 垃圾, 直接删除
            return "<p>" + c.replace("&amp;amp;", "&amp;") + "</p>"
        return re.sub(r"<p>(.*?)</p>", fixp, s, flags=re.S)
    html = re.sub(r'<section class="desc">.*?</section>', fix_sec, html, flags=re.S)

    return html

if __name__ == "__main__":
    files = sys.argv[1:] or glob.glob("*.html")
    changed = 0
    for f in files:
        if not f.endswith(".html") or not os.path.isfile(f):
            continue
        html = open(f, encoding="utf-8", errors="ignore").read()
        new = process(html)
        if new != html:
            open(f, "w", encoding="utf-8").write(new)
            changed += 1
    print(f"已清理 {changed} 个文件")
