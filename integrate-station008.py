#!/usr/bin/env python3
"""Static, count-checked integration. Input immutable, output separate candidate."""
import argparse, hashlib, json, pathlib
P=pathlib.Path(__file__).resolve().parent
a=argparse.ArgumentParser();a.add_argument('--input',required=True);a.add_argument('--output',required=True);o=a.parse_args()
source=pathlib.Path(o.input);dest=pathlib.Path(o.output)
if source.resolve()==dest.resolve() or dest.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=source.read_text();s=base;audit=[]
if 'const STATION_TOOLS008=' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor {n} != {count}: {old[:120]}')
 s=s.replace(old,new);audit.append({'anchor':old[:100],'count':n})
marker='<!-- GPT-007 native public-life art BEGIN: source british-publiclife-art.js -->'
art=(P/'british-station-art008.js').read_text()
rep(marker,'<!-- GPT-008 native station art BEGIN: source british-station-art008.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-008 native station art END -->\n'+marker)
anchor='const drawPath643=(src=>'
game=(P/'station-gameplay008.js').read_text();split=game.index('function britishStation008')
rep('function britishSpec004(k){',game[:split]+'\nfunction britishSpec004(k){')
rep(anchor,game[split:]+'\n'+anchor)
rep('installPublicLifeArt007(); // GPT-004','installPublicLifeArt007();installStationArt008(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&STATION_TOOLS008[t.id])return stationDescription008(STATION_TOOLS008[t.id]);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&&!(STATION_TOOLS008[t.id]&&window.__noBritishStation008)&&')
# Reuse the native daily index scan; add no second N² scan or legacy tile writes.
rep('function buildTickIndex(){\n  tickBld.length=0;','function buildTickIndex(){\n  stationRoots008.clear();\n  tickBld.length=0;')
rep('    if(t.bld)tickBld.push(i);','    if(t.bld){tickBld.push(i);if(britishStation008(t.bld))stationRoots008.add(i);}')
# Native age and T418 steel acceleration remain authoritative; completion rails
# refresh before the following service read. No day or utility flag is assigned.
rep('  refreshPublicLifeUtilities007();refreshPublicLifeCoverage007();','  refreshPublicLifeUtilities007();refreshPublicLifeCoverage007();stationUtilities008();stationDaily008();')
# A late native age change must also invalidate the route before the next read.
rep('  // T124：每 30 天重判存量住宅財富級','  stationDaily008(); // GPT-008: exact native completion boundary, including T418 steel\n  // T124：每 30 天重判存量住宅財富級')
rep('  objs.sort((a,b2)=>a.dep-b2.dep);','  stationObjects008(objs,sxOf,syOf,vis,lodFar);\n  objs.sort((a,b2)=>a.dep-b2.dep);')
rep('    if(o.busStop&&SPR.busStop){','    if(o.stationModule008){stationModuleDraw008(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.busStop&&SPR.busStop){\n      if(stationTheme008(tiles[idx(o.x,o.y)])===\'bus\')continue;')
rep('    if(!window.__noConstr701&&!window.__noConstr700&&bd.k!==4&&window.__x12Reg',"    if(britishStation008(bd)&&bd.age<9){stationConstructionDraw008(ctx,bd,s,bx,by,z,nightDepth,nightSprites,occ629Push,idx(o.x,o.y));continue;}\n    if(!window.__noConstr701&&!window.__noConstr700&&bd.k!==4&&window.__x12Reg")
rep("for(const i of amCells502){const x=i%N,y=(i/N)|0,sx=_sx413", "for(const i of amCells502){if(stationTheme008(tiles[i]))continue;const x=i%N,y=(i/N)|0,sx=_sx413")
rep('  publicLifeSelftest007,publicLifeGameplayProbe007,publicLifeAt007,','  stationSelftest008,stationDistrictAt008,stationEvidence008,\n  publicLifeSelftest007,publicLifeGameplayProbe007,publicLifeAt007,')
rep('function insMetrics461(x,y,b,html){','function insMetrics461(x,y,b,html){if(britishStation008(b))return stationDescription008(STATION_TOOLS008[stationAxis008(b)?\'britishStationEW008\':\'britishStationNS008\'])+\' · 工期 \'+Math.min(9,b.age)+\'/9 · \'+(stationReady008(idx(x,y),b)?\'可營運\':\'施工中或缺少實際供給\');')
for path in ['fp.json','style.json','AUTORUN-LOG.md','docs/DECISIONS.md']:assert (P/path).exists()
assert source.read_text()==base
dest.write_text(s)
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
