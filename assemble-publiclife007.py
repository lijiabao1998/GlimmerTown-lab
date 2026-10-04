#!/usr/bin/env python3
"""Assemble original native public-life art and counted gameplay edits.

Reads immutable deployed T719 and parses JavaScript without executing the game.
Runtime acceptance belongs to the isolated branch CI, never this local helper.
"""
from pathlib import Path
import subprocess, hashlib, json

P = Path(__file__).resolve().parent
BASE = '36632c0e98c3e9daf7a1fa7adfe03a866cb4fbb7'
BASE_HTML_SHA256 = '2a55093245f0d81b8fbea135456a32513ff19164c7e6e89b7e71a1d3d2066b60'
PARTS = ['publiclife-art-primitives007.js', 'publiclife-art-civic-learning007.js', 'publiclife-art-parish-recreation007.js']
BUILDERS = ['plHistoricTownHall007', 'plMagistratesCourt007', 'plBoroughPolice007', 'plEdwardianFireStation007', 'plTechnicalInstitute007', 'plGrammarSchool007', 'flintParishChurch007', 'nonconformistChapel007', 'cricketPavilion007', 'bowlsClub007', 'ironBandstand007', 'seasideConcertHall007']
required = PARTS + ['publiclife-specs007.json', 'integrate-publiclife007.py', 'publiclife-gameplay007.js', 'publiclife-selftest007.js', 'publiclife-gameplay-probe007.js']
missing = [f for f in required if not (P/f).is_file()]
if missing:
    raise SystemExit('Missing fragments: '+str(missing))
specs = json.loads((P/'publiclife-specs007.json').read_text())
assert [s['k'] for s in specs] == list(range(262, 274))
assert [s['art'] for s in specs] == ['UKL%02d'%n for n in range(1,13)]
art = '\n'.join((P/f).read_text() for f in PARTS)
art += '\n  const builders={'+','.join(s['art']+':'+b for s,b in zip(specs,BUILDERS))+'};\n'
art += "  function build(id){const s=specs.find(q=>q.id===id);if(!s)throw Error('Unknown public-life building: '+id);return builders[id](s);}\n"
art += "  root.PublicLifeArchitecture007=Object.freeze({version:'UKL-art-r1',specs,build,buildAll:()=>specs.map(s=>builders[s.id](s))});\n})(window);\n"
(P/'british-publiclife-art.js').write_text(art)
subprocess.run(['node','--check',str(P/'british-publiclife-art.js')],check=True)
raw = subprocess.check_output(['git','show',BASE+':index.html'],cwd=P)
assert hashlib.sha256(raw).hexdigest() == BASE_HTML_SHA256
(P/'.publiclife-base007.html').write_bytes(raw)
patch = subprocess.run(['python3',str(P/'integrate-publiclife007.py'),'--input',str(P/'.publiclife-base007.html'),'--output',str(P/'.publiclife-integrated007.html')],check=True,capture_output=True,text=True)
(P/'publiclife-integration-edit-audit007.json').write_text(patch.stdout)
s = (P/'.publiclife-integrated007.html').read_text()
anchor = '<!-- GPT-006 native residential art END -->'
assert s.count(anchor) == 1
assert '<!-- GPT-007 native public-life art BEGIN' not in s
s = s.replace(anchor,anchor+'\n<!-- GPT-007 native public-life art BEGIN: source british-publiclife-art.js -->\n<script>\n'+art+'</script>\n<!-- GPT-007 native public-life art END -->')
for field in ["const GAME_VER='14.23'", "const GAME_ANCHOR='T719'", 'id="startVersion456">v14.23 · T719']:
    assert s.count(field) == 1, 'Release metadata changed: '+field
for f in ['fp.json','style.json','AUTORUN-LOG.md','docs/DECISIONS.md','british-prototypes-art.js','british-high-street-art.js','british-residential-art.js']:
    assert (P/f).read_bytes() == subprocess.check_output(['git','show',BASE+':'+f],cwd=P), 'Protected file changed: '+f
parser = "const vm=require('vm'),fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');let n=0;for(const m of s.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)){new vm.Script(m[1],{filename:'inline-'+(++n)});}console.log('Parsed '+n+' inline scripts without execution');"
(P/'.publiclife-final007.html').write_text(s)
subprocess.run(['node','-e',parser,str(P/'.publiclife-final007.html')],check=True)
(P/'index.html').write_text(s)
print(json.dumps({'htmlBytes':len(s.encode()),'htmlSHA256':hashlib.sha256(s.encode()).hexdigest(),'artBytes':len(art.encode()),'artSHA256':hashlib.sha256(art.encode()).hexdigest(),'base':BASE},indent=2))
