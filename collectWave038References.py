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
OUT = Path('shots/wave038/references')
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = [
    [
        "leedsCorn",
        "https://historicengland.org.uk/listing/the-list/list-entry/1255771",
        [
            "https://historicengland.org.uk/etl/1255771/834ee99f-a5f4-4712-841c-0541ce5c12f8.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false",
            "https://images.squarespace-cdn.com/content/v1/687e1a7c495e1f0ac7287589/1753094781577-OJXRLX1K9EIT7I84Z08T/ABG09421.jpg"
        ]
    ],
    [
        "darlington",
        "https://historicengland.org.uk/listing/the-list/list-entry/1322944",
        [
            "https://historicengland.org.uk/etl/1322944/2fff4b27-598e-4ea9-ae9e-698d039844d3.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "halifax",
        "https://historicengland.org.uk/listing/the-list/list-entry/1281516",
        [
            "https://historicengland.org.uk/etl/1281516/d8045128-ef7e-4a29-9c97-c0959425f727.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "bishoplloyd",
        "https://historicengland.org.uk/listing/the-list/list-entry/1376439",
        [
            "https://historicengland.org.uk/etl/1376439/e6cff2e8-30e3-4a9c-bf8e-172197d5576c.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "burlington",
        "https://historicengland.org.uk/listing/the-list/list-entry/1066338",
        [
            "https://historicengland.org.uk/etl/1066338/b36e3295-89a1-4fd5-a5da-b942784da2ab.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "silver",
        "https://historicengland.org.uk/listing/the-list/list-entry/1074775",
        [
            "https://historicengland.org.uk/etl/1074775/a447b97f-2e36-4af5-83fb-35fd973e7f67.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "harrods",
        "https://historicengland.org.uk/listing/the-list/list-entry/1294346",
        [
            "https://historicengland.org.uk/etl/1294346/40512116-54b6-43e1-8a2a-46728e888e79.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "liberty",
        "https://historicengland.org.uk/listing/the-list/list-entry/1357064",
        [
            "https://historicengland.org.uk/etl/1357064/360569f4-b3db-47e8-9b6a-a577de37b62a.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "danum",
        "https://historicengland.org.uk/listing/the-list/list-entry/1031509",
        [
            "https://historicengland.org.uk/etl/1031509/8affcb29-0c5d-4353-9859-845fb00b0aa6.jpg?autorotate=true&format=webp&height=500&quality=80&rmode=max&upscale=false"
        ]
    ],
    [
        "willow",
        "https://www.geograph.org.uk/photo/7360104",
        [
            "https://s0.geograph.org.uk/geophotos/07/36/01/7360104_88c041d8.jpg"
        ]
    ]
]
PART = int(os.environ['WAVE038_REFERENCE_PART'])
if PART not in range(5):
    raise ValueError('Exactly five bounded reference parts')
REQUESTED = set(filter(None, os.environ.get('WAVE038_REFERENCE_IDS', '').split(',')))
if REQUESTED - {s[0] for s in SOURCES}:
    raise ValueError('Unknown reference subject')


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
    if REQUESTED and name not in REQUESTED:
        continue
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
    selected = list(unique.values())[:6] if direct else sorted(unique.values(), key=lambda x: (not re.search(r'exterior|figure|court|building|front|slide.home', x['url'] + x['alt'], re.I), x['alt'] != 'page primary photo'))[:2]
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
            print('WAVE038_REF_BEGIN ' + json.dumps(meta), flush=True)
            s = base64.b64encode(b).decode()
            for at in range(0, len(s), 4096):
                print('WAVE038_REF_DATA ' + s[at:at + 4096], flush=True)
            print('WAVE038_REF_END ' + file, flush=True)
        except Exception as e:
            rec['errors'].append({**item, **error_record(e, name + '-' + str(j))})
    records.append(rec)
    print('WAVE038_REFERENCE ' + json.dumps(rec), flush=True)
manifest = {'head': os.environ.get('GITHUB_SHA'), 'part': PART, 'purpose': 'Primary photo evidence only; no game test or new commerce or market simulation', 'sources': records}
(OUT / ('manifest-references038-part' + str(PART) + '.json')).write_text(json.dumps(manifest, indent=2) + '\n')
print('WAVE038_REFERENCE_SUMMARY ' + json.dumps([{'id': r['id'], 'photos': len(r['images']), 'errors': r['errors']} for r in records]))
if any(not r['images'] for r in records):
    raise RuntimeError('Primary photo evidence missing; preserve failure and correct sources before drawing')
