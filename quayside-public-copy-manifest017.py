#!/usr/bin/env python3
"""Inspect prepared source files; never copies to or changes a checkout."""
import hashlib,json,pathlib
root=pathlib.Path(__file__).resolve().parent
records=[]
for p in sorted(root.rglob('*')):
 if not p.is_file() or p.name in ('copy-manifest.json','local-validation.json','source-qa-output.txt'):continue
 rel=p.relative_to(root).as_posix()
 if '__pycache__' in p.parts or rel.startswith('.quayside-public-packets/'):continue
 data=p.read_bytes();target='docs/branch/GPT-017-public-observer.md' if rel=='README.md' else rel
 records.append({'source':rel,'destination':target,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'kind':'retained historical source' if rel.startswith('retained016/') else 'approved native image input' if rel.startswith('approved-native017/') else 'test-only observer source/data'})
receipt=json.loads((root/'quayside-public-release017.json').read_text())
manifest={'schema':1,'sourceOnly':True,'gameExecuted':False,'destinationRepository':'lijiabao1998/GlimmerTown-lab','destinationBranch':'gpt/quayside-public017','neverMerge':True,'sourceDirectory':str(root),'files':records,'fileCount':len(records),'totalBytes':sum(r['bytes'] for r in records),'exclusions':['copy-manifest.json','local-validation.json','source-qa-output.txt','__pycache__','runtime packets'],'requiresFinalReceipt':any(isinstance(v,str) and v.startswith('REQUIRED_') for v in receipt.values())}
(root/'copy-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'fileCount':manifest['fileCount'],'totalBytes':manifest['totalBytes'],'sha256':hashlib.sha256((root/'copy-manifest.json').read_bytes()).hexdigest()}))
