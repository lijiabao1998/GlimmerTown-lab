#!/usr/bin/env python3
"""GPT-017 deterministic count-checked additive source assembly. No game execution."""
import argparse, hashlib, json, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if hashlib.sha256(base.encode()).hexdigest()!='e00128d491f81d37cd68c4afe6661bf7ff500ac9d6d8d697657f5b3a8a1edff5':raise SystemExit('Exact deployed T729 baseline required')
if 'QUAYSIDE_PATH017' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 if s.count(old)!=count:raise SystemExit(f'Unique integration anchor expected {count}, got {s.count(old)}: {old[:110]}')
 s=s.replace(old,new);audit.append({'from':old,'to':new,'count':count})
early,late=(P/'gameplay017.js').read_text().split('/* GPT-017 LATE NATIVE HOOKS */',1)
art=(P/'british-quayside-details-art017.js').read_text()
rep('<!-- GPT-016 native garden-life art END -->','<!-- GPT-016 native garden-life art END -->\n<!-- GPT-017 native quayside art BEGIN: source british-quayside-details-art017.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-017 native quayside art END -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('const drawPath643=(src=>','/* GPT-017 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installGardenLifeArt016(); // GPT-004','installGardenLifeArt016();installQuaysideArt017(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&QUAYSIDE_PATH017[t.id])return quaysideDescription017(QUAYSIDE_PATH017[t.id]);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !(QUAYSIDE_PATH017[t.id]&&window.__noQuayside017)&&')
rep('!complexTheme014(t)&&!streetscapeTheme015(t)&&!gardenLifeTheme016(t)&&hasRoadNear','!complexTheme014(t)&&!streetscapeTheme015(t)&&!gardenLifeTheme016(t)&&!quaysideTheme017(t)&&hasRoadNear')
rep('gardenLifeObjects016(objs,sxOf,syOf,vis,lodFar);','gardenLifeObjects016(objs,sxOf,syOf,vis,lodFar);quaysideObjects017(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.gardenLifeModule016){','    if(o.quaysideModule017){quaysideModuleDraw017(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.gardenLifeModule016){')
rep('||(!window.__noGardenLifeArt016&&cam.z>=lodFarZ648()&&gardenLifeTheme016(tiles[i])))continue;','||(!window.__noGardenLifeArt016&&cam.z>=lodFarZ648()&&gardenLifeTheme016(tiles[i]))||(!window.__noQuaysideArt017&&cam.z>=lodFarZ648()&&quaysideTheme017(tiles[i])))continue;')
rep('  gardenLifeSelftest016,gardenLifeSpecs016,gardenLifeAt016,gardenLifeEvidence016,','  quaysideSelftest017,quaysideSpecs017,quaysideAt017,quaysideEvidence017,\n  gardenLifeSelftest016,gardenLifeSpecs016,gardenLifeAt016,gardenLifeEvidence016,')
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
