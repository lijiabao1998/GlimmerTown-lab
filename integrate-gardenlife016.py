#!/usr/bin/env python3
"""GPT-016 deterministic count-checked additive source assembly. No game execution."""
import argparse, hashlib, json, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if hashlib.sha256(base.encode()).hexdigest()!='7d20033d3d50091849717d25820220951401b553123fe1fa588cdd63c2bb9609':raise SystemExit('Exact deployed T728 baseline required')
if 'GARDENLIFE_PATH016' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 if s.count(old)!=count:raise SystemExit(f'Unique integration anchor expected {count}, got {s.count(old)}: {old[:110]}')
 s=s.replace(old,new);audit.append({'from':old,'to':new,'count':count})
early,late=(P/'gameplay016.js').read_text().split('/* GPT-016 LATE NATIVE HOOKS */',1)
art=(P/'british-garden-life-art016.js').read_text()
rep('<!-- GPT-015 native street detail art END -->','<!-- GPT-015 native street detail art END -->\n<!-- GPT-016 native garden-life art BEGIN: source british-garden-life-art016.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-016 native garden-life art END -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('const drawPath643=(src=>','/* GPT-016 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installStreetscapeArt015(); // GPT-004','installStreetscapeArt015();installGardenLifeArt016(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&GARDENLIFE_PATH016[t.id])return gardenLifeDescription016(GARDENLIFE_PATH016[t.id]);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !(GARDENLIFE_PATH016[t.id]&&window.__noGardenLife016)&&')
rep('!complexTheme014(t)&&!streetscapeTheme015(t)&&hasRoadNear','!complexTheme014(t)&&!streetscapeTheme015(t)&&!gardenLifeTheme016(t)&&hasRoadNear')
rep('streetscapeObjects015(objs,sxOf,syOf,vis,lodFar);','streetscapeObjects015(objs,sxOf,syOf,vis,lodFar);gardenLifeObjects016(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.streetscapeModule015){','    if(o.gardenLifeModule016){gardenLifeModuleDraw016(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.streetscapeModule015){')
rep('||(!window.__noStreetscapeArt015&&cam.z>=lodFarZ648()&&streetscapeTheme015(tiles[i])))continue;','||(!window.__noStreetscapeArt015&&cam.z>=lodFarZ648()&&streetscapeTheme015(tiles[i]))||(!window.__noGardenLifeArt016&&cam.z>=lodFarZ648()&&gardenLifeTheme016(tiles[i])))continue;')
rep('  streetscapeSelftest015,streetscapeSpecs015,streetscapeAt015,streetscapeEvidence015,','  gardenLifeSelftest016,gardenLifeSpecs016,gardenLifeAt016,gardenLifeEvidence016,\n  streetscapeSelftest015,streetscapeSpecs015,streetscapeAt015,streetscapeEvidence015,')
# Every edit is independently reversible, including complete authored insertions.
reverse=s
for e in reversed(audit):
 if reverse.count(e['to'])!=e['count']:raise SystemExit('Non-unique reverse integration')
 reverse=reverse.replace(e['to'],e['from'])
if reverse!=base:raise SystemExit('Unlisted product delta')
for key in ['GAME_VER','GAME_ANCHOR']:
 assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s)
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'baseSHA256':hashlib.sha256(base.encode()).hexdigest(),'sourceSHA256':hashlib.sha256(s.encode()).hexdigest(),'edits':[{'anchor':e['from'][:120],'count':e['count']} for e in audit],'reversibleExact':True},ensure_ascii=False))
