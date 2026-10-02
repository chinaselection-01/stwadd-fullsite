# -*- coding: utf-8 -*-
"""Backfill for the 2 page-builder core pages (about-us.html, contact-us.html)
whose footer is rendered by the page-builder block system (no <footer> tag).
Inject the same dofollow outbound link to india-selection.com right before
</body>. Prefers </footer> if present (future-proof), else </body>."""
URL = 'https://www.india-selection.com'
ANCHOR = 'India Selection &mdash; Curated Picks'
FRAG = (
'<div class="footer-network" style="text-align:center;padding:16px 14px;font-size:.9rem;border-top:1px solid rgba(0,0,0,.1);">\n'
'  Part of our network: <a href="%s" target="_blank" rel="noopener">%s</a>\n'
'</div>\n' % (URL, ANCHOR))

for f in ['about-us.html', 'contact-us.html']:
    html = open(f, encoding='utf-8').read()
    if 'india-selection.com' in html:
        print('SKIP already:', f)
        continue
    if '</footer>' in html:
        new = html.replace('</footer>', FRAG + '\n</footer>', 1)
        where = '</footer>'
    elif '</body>' in html:
        new = html.replace('</body>', FRAG + '</body>', 1)
        where = '</body>'
    else:
        print('ERROR no anchor:', f)
        continue
    open(f, 'w', encoding='utf-8').write(new)
    v = open(f, encoding='utf-8').read()
    print('OK %-18s @%-9s links=%d nofollow=%s blank=%s' % (
        f, where, v.count('india-selection.com'),
        'rel="nofollow"' in v, 'target="_blank"' in v))
