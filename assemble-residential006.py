#!/usr/bin/env python3
"""Assemble original native art and counted gameplay patches from immutable T718.
Does not execute the game. Only intended for this approved review branch.
"""
from pathlib import Path
import subprocess,hashlib,json,re
P=Path(__file__).resolve().parent
base='0072ac19b3c33f2dda98552d8b6c6bf447ba296c'
parts=['residential-art-primitives006.js','residential-art-georgian-victorian006.js','residential-art-village-workers006.js']
missing=[p for p in parts if not (P/p).is_file()]
if missing:raise SystemExit('Missing art fragments: '+str(missing))
builders=['georgianRow006','georgianCorner006','georgianEnd006','georgianArea006','victorianGabledSemi006','victorianBayVilla006','victorianGardenVilla006','victorianGothicVilla006','stoneCottagePair006','brickCatslideCottage006','courtyardCottages006','thatchedLongCottage006','workersNarrowRow006','workersYardTerrace006','workersCourt006','workersCornerShop006']
art='\n'.join((P/p).read_text() for p in parts)+'\n  const builders={'+','.join(f'UKR{i+1:02d}:{b}' for i,b in enumerate(builders))+'};\n'
art+="  function build(id){const s=specs.find(q=>q.id===id);if(!s)throw Error('Unknown residential building: '+id);return builders[id](s);}\n  root.ResidentialArchitecture006=Object.freeze({version:'UKR-art-r1',specs,build,buildAll:()=>specs.map(s=>builders[s.id](s))});\n})(window);\n"
(P/'british-residential-art.js').write_text(art)
subprocess.run(['node','--check',str(P/'british-residential-art.js')],check=True)
raw=subprocess.check_output(['git','show',base+':index.html'],cwd=P)
assert hashlib.sha256(raw).hexdigest()=='364dec9f1a43a574dbb544d764ac4e086cc877b06afc31eeb6f3c02bf508d06b'
(P/'.residential-base006.html').write_bytes(raw)
qa=subprocess.run(['python',str(P/'integrate-residential006.py'),'--input',str(P/'.residential-base006.html'),'--output',str(P/'.residential-integrated006.html')],check=True,capture_output=True,text=True)
(P/'residential-integration-edit-audit006.json').write_text(qa.stdout)
s=(P/'.residential-integrated006.html').read_text()
anchor='<!-- GPT-005 native high-street art END -->'
assert s.count(anchor)==1 and '<!-- GPT-006' not in s
s=s.replace(anchor,anchor+'\n<!-- GPT-006 native residential art BEGIN: source british-residential-art.js -->\n<script>\n'+art+'</script>\n<!-- GPT-006 native residential art END -->')
# Parse every inline script without executing browser or game code.
parser="const vm=require('vm'),fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');let n=0;for(const m of s.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)){new vm.Script(m[1],{filename:'inline-'+(++n)});}console.log('Parsed '+n+' inline scripts without execution');"
(P/'.residential-final006.html').write_text(s)
subprocess.run(['node','-e',parser,str(P/'.residential-final006.html')],check=True)
(P/'index.html').write_text(s)
print(json.dumps({'htmlBytes':len(s.encode()),'htmlSHA256':hashlib.sha256(s.encode()).hexdigest(),'artBytes':len(art.encode()),'artSHA256':hashlib.sha256(art.encode()).hexdigest(),'base':base}))
