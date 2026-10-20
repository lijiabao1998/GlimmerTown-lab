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
        "https://www.geograph.org.uk/photo/3778916",
        [
            "https://s0.geograph.org.uk/geophotos/03/77/89/3778916_0f287673.jpg",
            "https://www.calderdalenextchapter.co.uk/sites/default/files/2025-08/54721596117_de8a2c300c_c.jpg",
            "https://www.calderdalenextchapter.co.uk/sites/default/files/2025-08/54722643424_de25d7b753_o%20resized.jpg"
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
        "https://commons.wikimedia.org/wiki/File:Burlington_Arcade,_Piccadilly_-_geograph.org.uk_-_7821822.jpg",
        [
            "https://upload.wikimedia.org/wikipedia/commons/b/b0/Burlington_Arcade%2C_Piccadilly_-_geograph.org.uk_-_7821822.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org"
        ]
    ],
    [
        "silver",
        "https://www.maber.co.uk/projects/silver-arcade/",
        [
            "https://www.maber.co.uk/app/uploads/2019/09/2895_N4_medium.jpg",
            "https://www.maber.co.uk/app/uploads/2019/02/silver-arcade-final-1-of-5-1.jpg",
            "https://www.maber.co.uk/app/uploads/2019/02/0000-silver-arcade-office-final-11-of-7.jpg"
        ]
    ],
    [
        "harrods",
        "https://www.makearchitects.com/media/news-events/make-rolls-out-first-stage-of-work-on-harrods-historic-facades-as-retractable-awnings-installed/",
        [
            "https://www.makearchitects.com/wp-content/uploads/2021/12/Full-facade-Brompton-Road-with-new-awnings-scaled.jpg"
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
REQUESTED = set(filter(None, os.environ.get('WAVE038_REFERENCE_IDS', 'burlington').split(',')))
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
