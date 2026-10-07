#!/usr/bin/env python3
"""Source/file-data tests only; no game, browser, renderer or network."""
import base64, contextlib, hashlib, io, json, os, pathlib, runpy, tempfile
from unittest.mock import patch
SOURCE=pathlib.Path(__file__).with_name('quayside-public-package017.py')
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=')
SHA='a'*40; H='b'*64; checks=0
with tempfile.TemporaryDirectory(prefix='quayside017-package-data-') as tmp:
 root=pathlib.Path(tmp); script=root/SOURCE.name;script.write_bytes(SOURCE.read_bytes())
 (root/'quayside-public-release017.json').write_text(json.dumps({'sourceSHA256':H,'releaseSHA':'c'*40}))
 evidence=root/'quayside-evidence/public';evidence.mkdir(parents=True)
 (evidence/'native.png').write_bytes(PNG)
 for n in range(3):(evidence/f'raw-{n}.txt').write_bytes(bytes([65+n])*(12*1024*1024))
 (evidence/'large.json').write_bytes(b'['+b'0,'*(15*1024*1024)+b'0]')
 with patch.dict(os.environ,{'GITHUB_SHA':SHA,'GITHUB_RUN_ID':'source-data-test'}),patch('subprocess.check_output',return_value=SHA+'\n'),contextlib.redirect_stdout(io.StringIO()):runpy.run_path(str(script),run_name='__main__')
 parts=sorted((root/'.quayside-public-packets').glob('part*'));assert len(parts)==2;checks+=1
 seen={}
 for part in parts:
  index=json.loads((part/'packet-index.json').read_text());assert index['packetCount']==2 and index['completeFileCount']==6;checks+=1
  assert sum(p.stat().st_size for p in part.rglob('*') if p.is_file())<=28*1024*1024;checks+=1
  assert index['checkedSHA']=='c'*40 and index['observerSHA']==SHA and index['sourceSHA256']==H;checks+=1
  for row in index['files']:
   assert row['originalPath'] not in seen;seen[row['originalPath']]=row;payload=(part/row['payloadPath']).read_bytes()
   assert hashlib.sha256(payload).hexdigest()==row['payloadSHA256'];checks+=1
   import gzip
   raw=gzip.decompress(payload) if row['compression']=='gzip' else payload
   assert raw==(root/row['originalPath']).read_bytes() and hashlib.sha256(raw).hexdigest()==row['sha256'];checks+=1
 assert len(seen)==6;checks+=1
 assert seen['quayside-evidence/public/native.png']['width']==1 and seen['quayside-evidence/public/native.png']['height']==1;checks+=1
 assert seen['quayside-evidence/public/native.png']['compression']=='none';checks+=1
 assert seen['quayside-evidence/public/large.json']['compression']=='gzip';checks+=1
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'checks':checks,'parts':2,'maximumRawBytes':28*1024*1024}))
