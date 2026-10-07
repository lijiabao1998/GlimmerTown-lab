#!/usr/bin/env python3
"""Exact, reversible source assembly. Never executes game or painter."""
import argparse,hashlib,json,pathlib,re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if hashlib.sha256(base.encode()).hexdigest()!='74d5616c283a561bd9655a6788e48308941e5d009be4200b0642d05b1285a68c':raise SystemExit('Exact released T731 required')
if 'QUARTER_PATH019' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 if s.count(old)!=count:raise SystemExit(f'Unique anchor expected {count}, got {s.count(old)}: {old[:110]}')
 s=s.replace(old,new);audit.append({'from':old,'to':new,'count':count})
early,late=(P/'gameplay019.js').read_text().split('/* GPT-019 LATE NATIVE HOOKS */',1)
art=(P/'british-waterfront-quarter-art019.js').read_text();logic=(P/'waterfront-quarter-logic019.js').read_text()
rep('<!-- GPT-018 owner-requested native map-edge repair END -->','<!-- GPT-018 owner-requested native map-edge repair END -->\n<!-- GPT-019 original waterfront quarter BEGIN -->\n<script>\n'+art+'\n</script>\n<script>\n'+logic+'\n</script>\n<!-- GPT-019 original waterfront quarter END -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('const drawPath643=(src=>','/* GPT-019 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installWaterfrontArt018(); // GPT-004','installWaterfrontArt018();installQuarterArt019(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&QUARTER_PATH019[t.id])return quarterDescription019(QUARTER_PATH019[t.id]);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !(QUARTER_PATH019[t.id]&&window.__noWaterfrontQuarter019)&&')
rep('quaysideObjects017(objs,sxOf,syOf,vis,lodFar);','quaysideObjects017(objs,sxOf,syOf,vis,lodFar);quarterObjects019(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.quaysideModule017){','    if(o.quarterModule019){quarterModuleDraw019(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.quarterVisitor019){quarterVisitorDraw019(ctx,o,z,occ629Push);continue;}\n    if(o.quaysideModule017){')
rep('(!window.__noQuaysideArt017&&cam.z>=lodFarZ648()&&quaysideTheme017(tiles[i])))continue;', '(!window.__noQuaysideArt017&&cam.z>=lodFarZ648()&&quaysideTheme017(tiles[i]))||(!window.__noWaterfrontQuarterArt019&&cam.z>=lodFarZ648()&&quarterTheme019(tiles[i])))continue;')
rep('  drawCoveragePreview459(sxOf,syOf,z,hover.x,hover.y);drawResourceHints459(sxOf,syOf,z,hover.x,hover.y);','  drawCoveragePreview459(sxOf,syOf,z,hover.x,hover.y);drawResourceHints459(sxOf,syOf,z,hover.x,hover.y);quarterEntrancePreview019(sxOf,syOf,z,tool,hover.x,hover.y);')
rep('  waterfrontSelftest018,waterfrontSpecs018,waterfrontAt018,waterfrontEvidence018,','  quarterSelftest019,quarterSpecs019,quarterAt019,quarterEvidence019,quarterConnection019,\n  waterfrontSelftest018,waterfrontSpecs018,waterfrontAt018,waterfrontEvidence018,')
reverse=s
for e in reversed(audit):
 if reverse.count(e['to'])!=e['count']:raise SystemExit('Non-unique reverse integration')
 reverse=reverse.replace(e['to'],e['from'])
if reverse!=base:raise SystemExit('Unlisted product delta')
for key in ['GAME_VER','GAME_ANCHOR']:assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s)
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'baseSHA256':hashlib.sha256(base.encode()).hexdigest(),'sourceSHA256':hashlib.sha256(s.encode()).hexdigest(),'edits':[{'anchor':e['from'][:120],'count':e['count']} for e in audit],'reversibleExact':True}))
