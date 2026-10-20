"""Read bounded public primary-reference photographs on the branch CI runner."""
import base64
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError

if os.environ.get('GITHUB_ACTIONS') != 'true':
    raise RuntimeError('Reference transfer runs on GitHub Actions only')
OUT = Path('shots/wave037/references')
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = [
    [
        "belfast",
        "https://www.belfastcity.gov.uk/things-to-do/city-hall/history-of-belfast-city-hall",
        []
    ],
    [
        "manchester",
        "https://www.manchester.gov.uk/the-council-and-democracy/town-hall-complex/our-town-hall/our-town-hall-project-the-transformation/our-town-hall-project-on-display",
        []
    ],
    [
        "leeds",
        "https://historicengland.org.uk/listing/the-list/list-entry/1255781",
        [
            "https://historicengland.org.uk/etl/1255781/eef62c23-a5e7-4123-a40a-28de58e0c610.JPG?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "newcastle",
        "https://www.theciviccentre.co.uk/about",
        []
    ],
    [
        "london",
        "https://www.fosterandpartners.com/projects/city-hall",
        []
    ],
    [
        "holyrood",
        "https://www.mirallestagliabue.com/project/scottish-parliament-building/",
        []
    ],
    [
        "thaxted",
        "https://thaxted-pc.gov.uk/tourism/short-history-of-thaxted/",
        []
    ],
    [
        "abingdon",
        "https://www.english-heritage.org.uk/visit/places/abingdon-county-hall-museum/",
        []
    ],
    [
        "middlesex",
        "https://supremecourt.uk/about-the-building/architecture",
        [
            "https://supremecourt.uk/_next/image?q=75&url=https%3A%2F%2Fsupremecourt.uk%2Fuploads%2Fthe_former_middlesex_guildhall_ea9f42bfa7.jpg&w=3840"
        ]
    ],
    [
        "rcj",
        "https://insidehmcts.blog.gov.uk/2026/10/19/historic-court-buildings-the-royal-courts-of-justice-from-queen-victoria-to-the-bear-pit/",
        []
    ]
]
PART = int(os.environ['WAVE037_REFERENCE_PART'])
if PART not in range(5):
    raise ValueError('Exactly five bounded reference parts')


class Images(HTMLParser):
    def __init__(self, base):
        super().__init__()
        self.base, self.items = base, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for key in ['data-lazyload', 'data-src', 'src']:
            if tag == 'img' and a.get(key):
                self.items.append({'url': urljoin(self.base, html.unescape(a[key])), 'alt': a.get('alt', '')})
        if tag == 'meta' and a.get('property') == 'og:image' and a.get('content'):
            self.items.append({'url': urljoin(self.base, html.unescape(a['content'])), 'alt': 'page primary photo'})


def read(url, limit):
    if urlparse(url).scheme != 'https':
        raise ValueError('HTTPS reference required')
    with urlopen(Request(url, headers={'User-Agent': 'GlimmerTown-Lab-readonly-reference/1.0'}), timeout=35) as r:
        if urlparse(r.url).scheme != 'https':
            raise ValueError('HTTPS final reference required')
        data = r.read(limit + 1)
        if len(data) > limit:
            raise ValueError('Reference exceeds byte bound')
        return data, r.headers.get_content_type(), r.url


def error_record(error, name):
    out = {'error': repr(error)}
    if isinstance(error, HTTPError):
        b = error.read()
        (OUT / (name + '-http-error.txt')).write_bytes(b)
        out.update(status=error.code, headers=dict(error.headers), responseBytes=len(b), responseSHA256=hashlib.sha256(b).hexdigest())
    return out


records = []
for name, page, direct in SOURCES[PART * 2:PART * 2 + 2]:
    rec = {'id': name, 'page': page, 'images': [], 'errors': []}
    candidates = [{'url': u, 'alt': 'Published primary photo URL verified in source page'} for u in direct]
    if not direct:
        try:
            data, _, final = read(page, 4 * 1024 * 1024)
            (OUT / (name + '-source.html')).write_bytes(data)
            rec.update(htmlBytes=len(data), htmlSHA256=hashlib.sha256(data).hexdigest(), finalPage=final)
            text = data.decode('utf8', errors='replace').replace('\\/', '/')
            parser = Images(final)
            parser.feed(text)
            candidates.extend(parser.items)
            for url in re.findall(r'''(?:https:)?//[^\s"'<>]+?\.(?:jpe?g|png|webp)(?:\?[^\s"'<>)]*)?''', text, re.I):
                candidates.append({'url': urljoin(final, html.unescape(url)), 'alt': 'Photo URL actually present in primary page'})
        except Exception as e:
            rec['errors'].append(error_record(e, name))
    unique = {}
    for item in candidates:
        u = item['url']
        if urlparse(u).scheme == 'https' and not re.search(r'logo|icon|dummy|placeholder|spinner|avatar|sprite|cookie|facebook|twitter', u, re.I):
            unique.setdefault(u, item)
    rec['candidates'] = list(unique.values())
    selected = sorted(unique.values(), key=lambda x: (not re.search(r'exterior|figure|court|building|front|slide.home', x['url'] + x['alt'], re.I), x['alt'] != 'page primary photo'))[:2]
    for j, item in enumerate(selected):
        try:
            b, mime, final = read(item['url'], 8 * 1024 * 1024)
            ext = {'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp'}.get(mime)
            if not ext:
                raise ValueError('Reference must be a raster photo: ' + mime)
            file = name + '-' + str(j) + ext
            (OUT / file).write_bytes(b)
            meta = {**item, 'file': file, 'finalURL': final, 'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest(), 'head': os.environ.get('GITHUB_SHA'), 'part': PART}
            rec['images'].append(meta)
            print('WAVE037_REF_BEGIN ' + json.dumps(meta), flush=True)
            s = base64.b64encode(b).decode()
            for at in range(0, len(s), 4096):
                print('WAVE037_REF_DATA ' + s[at:at + 4096], flush=True)
            print('WAVE037_REF_END ' + file, flush=True)
        except Exception as e:
            rec['errors'].append({**item, **error_record(e, name + '-' + str(j))})
    records.append(rec)
    print('WAVE037_REFERENCE ' + json.dumps(rec), flush=True)
manifest = {'head': os.environ.get('GITHUB_SHA'), 'part': PART, 'purpose': 'Primary photo evidence only; no game test or new civic/justice simulation', 'sources': records}
(OUT / ('manifest-references037-part' + str(PART) + '.json')).write_text(json.dumps(manifest, indent=2) + '\n')
print('WAVE037_REFERENCE_SUMMARY ' + json.dumps([{'id': r['id'], 'photos': len(r['images']), 'errors': r['errors']} for r in records]))
if any(not r['images'] for r in records):
    raise RuntimeError('Primary photo evidence missing; preserve failure and correct sources before drawing')
