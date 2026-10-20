"""Read primary architectural references on the branch CI runner; never boot the game."""
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

if os.environ.get('GITHUB_ACTIONS') != 'true':
    raise RuntimeError('Reference transfer runs on GitHub Actions only')

OUT = Path('shots/wave035/references')
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = [('royalshakespeare', 'https://www.bennettsassociates.com/projects/royal-shakespeare-theatre/'), ('jubilee', 'https://jubileepool.co.uk/'), ('wintergardens', 'https://www.wintergardensblackpool.co.uk/wg-heritage/our-story/')]


class Images(HTMLParser):
    def __init__(self, base):
        super().__init__()
        self.base, self.items = base, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img':
            src = a.get('data-src') or a.get('src')
            if src:
                self.items.append({'url': urljoin(self.base, html.unescape(src)), 'alt': a.get('alt', '')})
        elif tag == 'source' and a.get('srcset'):
            for part in a['srcset'].split(','):
                self.items.append({'url': urljoin(self.base, html.unescape(part.strip().split()[0])), 'alt': 'responsive photo source'})
        elif tag == 'meta' and a.get('property') == 'og:image' and a.get('content'):
            self.items.append({'url': urljoin(self.base, html.unescape(a['content'])), 'alt': 'page primary image'})


def read(url, limit):
    if urlparse(url).scheme != 'https':
        raise ValueError('HTTPS references required')
    with urlopen(Request(url, headers={'User-Agent': 'GlimmerTown-Lab-readonly-reference/1.0'}), timeout=35) as r:
        data = r.read(limit + 1)
        if len(data) > limit:
            raise ValueError('Reference exceeds size bound')
        return data, r.headers.get_content_type(), r.url


records = []
for name, page in SOURCES:
    record = {'id': name, 'page': page, 'images': [], 'errors': []}
    try:
        data, _, final = read(page, 4 * 1024 * 1024)
        record.update(htmlBytes=len(data), htmlSHA256=hashlib.sha256(data).hexdigest(), finalPage=final)
        parser = Images(final)
        text = data.decode('utf8', errors='replace').replace('\\/', '/')
        parser.feed(text)
        # Venue sites also publish photographs as CSS backgrounds and JSON data.
        for match in re.findall(r'''(?:https:)?//[^\s"'<>]+?\.(?:jpe?g|png|webp|avif)(?:\?[^\s"'<>)]*)?''', text, re.I):
            parser.items.append({'url': urljoin(final, html.unescape(match)), 'alt': 'photo URL present in source page'})
        unique = {}
        for item in parser.items:
            u = item['url']
            if re.search(r'logo|icon|placeholder|spinner|avatar|sprite|cookie|facebook|twitter', u, re.I):
                continue
            if urlparse(u).scheme == 'https':
                unique.setdefault(u, item)
        record['candidates'] = list(unique.values())
        for j, item in enumerate(sorted(record['candidates'], key=lambda x: ('exterior' not in x['alt'].lower(), x['alt'] != 'page primary image'))[:8]):
            try:
                image, mime, final_url = read(item['url'], 8 * 1024 * 1024)
                if mime not in ('image/jpeg', 'image/png', 'image/webp', 'image/avif'):
                    raise ValueError('Not a raster photo: ' + mime)
                file = name + '-' + str(j) + ('.jpg' if mime == 'image/jpeg' else '.png' if mime == 'image/png' else '.avif' if mime == 'image/avif' else '.webp')
                (OUT / file).write_bytes(image)
                meta = {**item, 'file': file, 'finalURL': final_url, 'bytes': len(image), 'sha256': hashlib.sha256(image).hexdigest()}
                record['images'].append(meta)
                # Exact public reference bytes; no credentials, saves or private data.
                import base64
                print('WAVE035_REF_BEGIN ' + json.dumps(meta), flush=True)
                encoded = base64.b64encode(image).decode('ascii')
                for at in range(0, len(encoded), 4096):
                    print('WAVE035_REF_DATA ' + encoded[at:at + 4096], flush=True)
                print('WAVE035_REF_END ' + file, flush=True)
            except Exception as error:
                record['errors'].append({'url': item['url'], 'error': str(error)})
    except Exception as error:
        record['errors'].append({'url': page, 'error': str(error)})
    records.append(record)
    print('WAVE035_REFERENCE ' + json.dumps(record), flush=True)

manifest = {'head': os.environ.get('GITHUB_SHA'), 'purpose': 'Primary photo references only; no game acceptance result', 'sources': records}
(OUT / 'manifest-references035.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('WAVE035_REFERENCE_SUMMARY ' + json.dumps([{'id': r['id'], 'photos': len(r['images']), 'errors': r['errors']} for r in records]))
