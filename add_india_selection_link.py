# -*- coding: utf-8 -*-
"""Add a single dofollow outbound link to india-selection.com in the footer of
the 16 English core entry pages of stwadd.com (home + sourcing-agent + about +
contact + 12 category pages). Inserts before </footer> so it works regardless of
each page's inner footer-column layout. dofollow (no rel=nofollow) per user
choice; target=_blank + rel=noopener for safe new-tab open (noopener != nofollow,
so weight still passes)."""
import glob

URL = 'https://www.india-selection.com'
ANCHOR = 'India Selection &mdash; Curated Picks'
INSERT = (
'    <div class="footer-network" style="text-align:center;padding:18px 0 6px;font-size:.9rem;opacity:.85;">\n'
'      Part of our network: <a href="%s" target="_blank" rel="noopener">%s</a>\n'
'    </div>' % (URL, ANCHOR)
)

targets = ['index.html', 'sourcing-agent.html', 'about-us.html', 'contact-us.html']
targets += sorted(glob.glob('categories/*.html'))

print('target files:', len(targets))
ok = []
for f in targets:
    html = open(f, encoding='utf-8').read()
    if 'india-selection.com' in html:
        print('SKIP already linked:', f)
        continue
    n = html.count('</footer>')
    if n == 0:
        print('ERROR no </footer>:', f)
        continue
    if n > 1:
        print('WARN %d </footer> tags:' % n, f)
    new = html.replace('</footer>', INSERT + '\n</footer>', 1)
    open(f, 'w', encoding='utf-8').write(new)
    # verify
    v = open(f, encoding='utf-8').read()
    link = v.count('india-selection.com')
    has_nofollow = 'rel="nofollow"' in v
    has_blank = 'target="_blank"' in v
    print('OK %-42s links=%d nofollow=%s blank=%s' % (f, link, has_nofollow, has_blank))
    ok.append(f)
print('total inserted:', len(ok))
