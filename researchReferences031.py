"""Read-only primary reference acquisition; never boots the game."""
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import urllib.request

if os.environ.get('GITHUB_ACTIONS') != 'true':
    raise RuntimeError('Reference acquisition runs on the branch CI only')

out = Path('shots/wave031/references')
out.mkdir(parents=True, exist_ok=True)
sources = [
    ('cromer-rnli.jpg', 'https://rnli.org/-/media/rnli/images/findmynearest/lifeboatstation/cromer/cromer-rnli-lifeboat-station-paul-russell-16x9.jpg?rev=b7e36f900c074be59a2be00f6df02cb6'),
    ('hastings-net-shops.pdf', 'https://hastingstrust.hastingsvoluntaryaction.org.uk/sites/hastingstrust.hastingsvoluntaryaction.org.uk/files/910000%20Fishermen%27s%20Net%20Shops.pdf'),
]
records = []
for name, url in sources:
    request = urllib.request.Request(url, headers={'User-Agent': 'GlimmerTown-Lab-Primary-Reference-Reader/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read()
        assert response.status == 200 and data, name
        final_url = response.url
    assert data.startswith(b'\xff\xd8') if name.endswith('.jpg') else data.startswith(b'%PDF-'), name
    (out / name).write_bytes(data)
    records.append({'name': name, 'url': url, 'finalURL': final_url, 'status': 200, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})

subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '1000', '-png', str(out/'hastings-net-shops.pdf'), str(out/'hastings-page01')], check=True)
subprocess.run(['pdftotext', '-layout', str(out/'hastings-net-shops.pdf'), str(out/'hastings-text.txt')], check=True)
manifest = {'head': os.environ['GITHUB_SHA'], 'gameExecuted': False, 'purpose': 'primary source inspection before drawing wave05', 'sources': records, 'derivedPreview': 'First survey PDF page rasterized for reading; not a game asset', 'files': []}
names = ['cromer-rnli.jpg', 'hastings-page01.png', 'hastings-text.txt']
for name in names:
    data = (out/name).read_bytes()
    manifest['files'].append({'name': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
(out/'manifest-references.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')

for name in names + ['manifest-references.json']:
    data = (out/name).read_bytes()
    header = {'name': name, 'head': os.environ['GITHUB_SHA'], 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
    print('WAVE031_REF_BEGIN '+json.dumps(header), flush=True)
    encoded = base64.b64encode(data).decode()
    for i in range(0, len(encoded), 4096):
        print('WAVE031_REF_DATA '+encoded[i:i+4096], flush=True)
    print('WAVE031_REF_END '+name, flush=True)
print('Primary reference bytes acquired; no wave05 art or game run.', flush=True)
