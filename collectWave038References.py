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
        "https://www.geograph.org.uk/photo/7660387",
        [
            "https://s0.geograph.org.uk/geophotos/07/66/03/7660387_b207eaff.jpg",
            "https://s0.geograph.org.uk/geophotos/05/47/40/5474054_13df065b.jpg"
        ]
    ],
    [
        "darlington",
        "https://www.geograph.org.uk/photo/6299652",
        [
            "https://s0.geograph.org.uk/geophotos/06/29/96/6299652_4be64fee.jpg"
        ]
    ],
    [
        "halifax",
        "https://commons.wikimedia.org/wiki/File:Borough_Market,_Halifax_-_geograph.org.uk_-_2836415.jpg",
        [
            "https://upload.wikimedia.org/wikipedia/commons/6/6b/Borough_Market%2C_Halifax_-_geograph.org.uk_-_2836415.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
            "https://upload.wikimedia.org/wikipedia/commons/b/b0/Halifax_Borough_Market_roof_%282265020733%29.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org"
        ]
    ],
    [
        "bishoplloyd",
        "https://www.geograph.org.uk/photo/6544554",
        [
            "https://s0.geograph.org.uk/geophotos/06/54/45/6544554_88d3b862.jpg"
        ]
    ],
    [
        "burlington",
        "https://www.geograph.org.uk/photo/8188950",
        [
            "https://s0.geograph.org.uk/geophotos/08/18/89/8188950_c3927be3.jpg",
            "https://jamiefobertarchitects.com/wp-content/uploads/2016/05/Burlington-Arcade-Piccadilly-London-Royal-Academy-Jamie-Fobert-Architects-British-stone-floor-marble-mosaic-1800x1202.jpg",
            "https://jamiefobertarchitects.com/wp-content/uploads/2015/07/Burlington-Arcade-Piccadilly-London-Royal-Academy-Jamie-Fobert-Architects-British-stone-floor-marble-mosaic-Picadilly-entrance-1800x1350.jpg",
            "https://jamiefobertarchitects.com/wp-content/uploads/2015/07/Burlington-Arcade-Piccadilly-London-Royal-Academy-Jamie-Fobert-Architects-British-stone-floor-marble-mosaic-Burlington-entrance-1800x1350.jpg"
        ]
    ],
    [
        "silver",
        "https://leicestershirepress.com/2025/03/10/leicesters-silver-arcade-welcomes-new-stores-it-feels-like-a-revival/?amp=1",
        [
            "https://i0.wp.com/leicestershirepress.com/wp-content/uploads/2025/03/Silver-Arcade-2.jpg?resize=1024%2C768&ssl=1",
            "https://www.maber.co.uk/app/uploads/2019/09/2895_N8_medium.jpg"
        ]
    ],
    [
        "harrods",
        "https://www.geograph.org.uk/photo/3262298",
        [
            "https://s0.geograph.org.uk/geophotos/03/26/22/3262298_b87129ea.jpg"
        ]
    ],
    [
        "liberty",
        "https://www.geograph.org.uk/photo/104144",
        [
            "https://s0.geograph.org.uk/photos/10/41/104144_746b7bd3.jpg"
        ]
    ],
    [
        "danum",
        "https://www.geograph.org.uk/photo/7628318",
        [
            "https://s0.geograph.org.uk/geophotos/07/62/83/7628318_ab148d32.jpg"
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
REQUESTED = set(filter(None, os.environ.get('WAVE038_REFERENCE_IDS', 'leedsCorn,darlington,halifax,bishoplloyd,burlington,silver,harrods,liberty,danum').split(',')))
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


PROVENANCE = {x['url']: x for x in json.loads(Path('docs/branch/GPT-038-reference-provenance.json').read_text())['assets']}
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
            meta = {**item, **{k: v for k, v in PROVENANCE.get(item['url'], {}).items() if k != 'state'}, 'file': file, 'finalURL': final, 'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest(), 'head': os.environ.get('GITHUB_SHA'), 'part': PART}
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
