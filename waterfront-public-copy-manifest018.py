#!/usr/bin/env python3
"""List prepared observer source only; never writes to a checkout."""
import hashlib,json,pathlib
root=pathlib.Path(__file__).resolve().parent
records=[]
for p in sorted(root.rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(root).as_posix()
 if '__pycache__' in p.parts or rel.startswith('.waterfront-public-packets/') or rel.startswith('waterfront-evidence/') or rel in ('copy-manifest.json','local-validation.json') or rel.endswith('-output.txt') or rel.endswith('-error.txt'):continue
 data=p.read_bytes();target='docs/branch/GPT-018-public-observer.md' if rel=='README.md' else rel
 assert not target.startswith('/') and '..' not in pathlib.PurePosixPath(target).parts
 records.append({'source':rel,'destination':target,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'kind':'retained immutable historical observer source/data' if rel.startswith('retained017/') else 'test-only public observer source/data'})
receipt=json.loads((root/'waterfront-public-release018.json').read_text())
manifest={'schema':1,'sourceOnly':True,'gameExecuted':False,'destinationRepository':'lijiabao1998/GlimmerTown-lab','destinationBranch':'gpt/waterfront-public018','neverMerge':True,'sourceDirectory':str(root),'files':records,'fileCount':len(records),'totalBytes':sum(r['bytes'] for r in records),'exclusions':['copy-manifest.json','local-validation.json','*-output.txt','*-error.txt','__pycache__','runtime evidence and packets'],'requiresFinalReceipt':any(isinstance(v,str) and v.startswith('REQUIRED_') for v in receipt.values())}
(root/'copy-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({'files':len(records),'bytes':manifest['totalBytes'],'sha256':hashlib.sha256((root/'copy-manifest.json').read_bytes()).hexdigest(),'requiresFinalReceipt':manifest['requiresFinalReceipt']}))
