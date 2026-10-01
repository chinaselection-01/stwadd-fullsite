#!/usr/bin/env python3
"""Submit all canonical URLs from sitemap.xml to IndexNow (Bing/ChatGPT/Yandex/DDG).
Run after the key file is publicly reachable at https://www.stwadd.com/356cc2f51e83dfd917d620d5b2ea655d.txt
Usage: python3 submit_indexnow.py
"""
import re, json, urllib.request, urllib.error

KEY = "356cc2f51e83dfd917d620d5b2ea655d"
HOST = "www.stwadd.com"
ENDPOINT = "https://api.indexnow.org/indexnow"

def get_canonical_urls():
    raw = open('sitemap.xml', encoding='utf-8').read()
    locs = re.findall(r'<loc>(.*?)</loc>', raw)
    return [u for u in locs if u.startswith('https://www.stwadd.com/')]

def submit(urls):
    payload = json.dumps({"host": HOST, "key": KEY, "urlList": urls}).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=payload,
                                 headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode('utf-8', 'ignore')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'ignore')
    except Exception as e:
        return -1, str(e)

if __name__ == '__main__':
    urls = get_canonical_urls()
    print(f"Submitting {len(urls)} URLs to IndexNow...")
    status, body = submit(urls)
    print("HTTP", status)
    print(body)
    if status in (200, 202):
        print("OK: IndexNow accepted the batch.")
    else:
        print("NOTE: if status is 422/403, the key file may not be live yet (wait ~5-10 min for GitHub Pages, then re-run).")
