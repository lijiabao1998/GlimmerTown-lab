#!/usr/bin/env python3
"""Data-only lossless packaging regression, including an index above64KiB."""
from pathlib import Path
import importlib.util,tempfile,hashlib,json,gzip
spec=importlib.util.spec_from_file_location('pack019',Path(__file__).with_name('waterfront-quarter-package019.py'));pack=importlib.util.module_from_spec(spec);spec.loader.exec_module(pack)
pack.limit=512*1024
with tempfile.TemporaryDirectory(prefix='quarter019-package-control-') as temporary:
 root=Path(temporary);files=[]
 large=root/'000-near-bound.bin';large.write_bytes(b'A'*(pack.limit-65536));files.append(large)
 for n in range(300):
  f=root/'retained'/('source-pinned-historical-comparison-'+str(n).zfill(4)+'-'+'x'*80+'.json');f.parent.mkdir(exist_ok=True);f.write_text('{"oldAssertionPassed":true}\n');files.append(f)
 text=root/'oversized.txt';text.write_text('Repeated raw assertion evidence.\n'*20000);files.append(text)
 png=root/'synthetic-header.png';png.write_bytes(bytes.fromhex('89504e470d0a1a0a0000000d494844520000000200000003')+b'synthetic-header-only');files.append(png)
 rows=pack.package_files(root,files,'a'*40,'b'*64,'synthetic-data-only');assert len(rows)>1
 out=root/'.waterfront-quarter-packets';recovered={};max_index=0;compressed=0
 for part in sorted(out.iterdir()):
  index=part/'packet-index.json';raw=index.read_bytes();max_index=max(max_index,len(raw));q=json.loads(raw);assert q['packetCount']==len(rows) and q['completeFileCount']==len(files)
  assert q['payloadBytes']+len(raw)==sum(p.stat().st_size for p in part.rglob('*')if p.is_file())<=pack.limit
  for r in q['files']:
   b=(part/r['payloadPath']).read_bytes();assert hashlib.sha256(b).hexdigest()==r['payloadSHA256'];assert len(b)==r['payloadBytes']
   if r['compression']=='gzip':b=gzip.decompress(b);compressed+=1
   assert hashlib.sha256(b).hexdigest()==r['sha256'] and len(b)==r['originalBytes'];assert b==(root/r['originalPath']).read_bytes();assert r['originalPath']not in recovered;recovered[r['originalPath']]=True
   if r['originalPath'].endswith('.png'):assert (r['width'],r['height'])==(2,3)
 assert len(recovered)==len(files) and max_index>65536 and compressed==1
 try:pack.package_files(root,files,'a'*40,'b'*64,'duplicate')
 except AssertionError:pass
 else:raise AssertionError('Existing output replaced')
with tempfile.TemporaryDirectory(prefix='quarter019-package-reject-')as temporary:
 root=Path(temporary);file=root/'too-large.bin';file.write_bytes(b'A'*pack.limit)
 try:pack.package_files(root,[file],'a'*40,'b'*64,'negative')
 except AssertionError:pass
 else:raise AssertionError('Oversized binary accepted')
 assert not(root/'.waterfront-quarter-packets').exists()
 assert not list(root.glob('.waterfront-quarter-stage-*'))
print(json.dumps({'ok':True,'sourceDataOnly':True,'gameExecuted':False,'exactIndexBytesBudgeted':True,'largeIndexBytes':max_index,'losslessFiles':len(recovered),'streamedGzipFiles':compressed,'atomicPublication':True,'oversizedBinaryRejected':True}))
