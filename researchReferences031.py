"""Read-only additional source photographs. Never imports or boots the game."""
import base64
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import urllib.parse
import urllib.request

if os.environ.get('GITHUB_ACTIONS') != 'true':
    raise RuntimeError('Reference acquisition runs on the branch CI only')

out = Path('shots/wave031/references')
out.mkdir(parents=True, exist_ok=True)

def get(url):
    url = urllib.parse.quote(url, safe=':/?&=%+#@')
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 GlimmerTown-Lab-Reference-Reader/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read()
        assert response.status == 200 and data, url
        return data, response.url

class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.og = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img':
            self.images.append(a)
        if tag == 'meta' and a.get('property') == 'og:image':
            self.og.append(a.get('content', ''))

sources = [
    ('burnham-somerset', 'https://www.somerset.gov.uk/film_locations/burnham-low-lighthouse/'),
    ('georgesdock-photo', "https://en.wikipedia.org/wiki/George%27s_Dock_Building"),
]
records = []
names = []
for label, page in sources:
    html, actual_page = get(page)
    parser = Images()
    parser.feed(html.decode('utf-8', 'replace'))
    if label == 'burnham-somerset':
        candidates = []
        for item in parser.images:
            src = item.get('data-src') or item.get('src') or ''
            if 'burnham' in (item.get('alt', '')+' '+src).lower():
                candidates.append(urllib.parse.urljoin(actual_page, src))
    else:
        candidates = [urllib.parse.urljoin(actual_page, s) for s in parser.og]
        if not candidates:
            for item in parser.images:
                src = item.get('src', '')
                if 'upload.wikimedia.org' in src and ('george' in src.lower() or 'dock' in src.lower()):
                    candidates.append(urllib.parse.urljoin(actual_page, src))
    candidates = list(dict.fromkeys(candidates))[:3]
    assert candidates, f'No original image link on {page}'
    for i, url in enumerate(candidates):
        data, actual = get(url)
        assert data.startswith(b'\xff\xd8') or data.startswith(b'\x89PNG\r\n\x1a\n'), actual
        ext = '.jpg' if data.startswith(b'\xff\xd8') else '.png'
        name = f'{label}-{i+1}{ext}'
        (out/name).write_bytes(data)
        names.append(name)
        records.append({'name': name, 'sourcePage': page, 'imageURL': url, 'finalURL': actual, 'status': 200, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})

manifest = {'head': os.environ['GITHUB_SHA'], 'gameExecuted': False, 'purpose': 'verify Burnham stripe orientation and George Dock exterior before drawing either model', 'reuseInGame': False, 'sources': records}
(out/'manifest-references-extra.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
for name in names+['manifest-references-extra.json']:
    data = (out/name).read_bytes()
    print('WAVE031_REF_BEGIN '+json.dumps({'name': name, 'head': os.environ['GITHUB_SHA'], 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}), flush=True)
    encoded = base64.b64encode(data).decode()
    for i in range(0, len(encoded), 4096):
        print('WAVE031_REF_DATA '+encoded[i:i+4096], flush=True)
    print('WAVE031_REF_END '+name, flush=True)
print('Additional reference acquisition only; gameExecuted=false.', flush=True)
