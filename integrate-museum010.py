#!/usr/bin/env python3
"""GPT-010 source-only, count-checked integration from immutable HTML to candidate.
No game execution. Product index.html and all prior source files remain untouched.
"""
import argparse, hashlib, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);p.add_argument('--art',default=str(P/'british-museum-art010.js'));a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if out.resolve()==src.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if 'const MUSEUM010=' in s:raise SystemExit('Museum already integrated')
if re.search(r'(?:\bk\s*:\s*277\b|\b277\s*:|\[277\])',s):raise SystemExit('Museum identity k277 is already occupied')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor count {n} != {count}: {old[:140]}')
 s=s.replace(old,new);audit.append({'anchor':old[:120],'count':n})
def after(old,new,count=1):rep(old,old+'\n'+new,count)
game=(P/'museum-gameplay010.js').read_text();early,late=game.split('/* GPT-010 LATE NATIVE HOOKS */',1)
art=pathlib.Path(a.art).read_text()
if 'BritishMuseumArchitecture010' not in art:raise SystemExit('Expected BritishMuseumArchitecture010 art API')
rep('<!-- GPT-009 native street-life art BEGIN: source british-streetlife-art009.js -->','<!-- GPT-010 native museum art BEGIN: source british-museum-art010.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-010 native museum art END -->\n<!-- GPT-009 native street-life art BEGIN: source british-streetlife-art009.js -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||PUBLICLIFE007[k]||STREETLIFE009[k]||null;','return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||PUBLICLIFE007[k]||STREETLIFE009[k]||MUSEUM010[k]||null;')
rep('const drawPath643=(src=>','/* GPT-010 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installStationArt008();installStreetLifeArt009(); // GPT-004','installStationArt008();installStreetLifeArt009();installMuseumArt010(); // GPT-004')
# One new fixed identity, paid native transactions, no old identity or art alias.
rep('const TOOLS=[',"const TOOLS=[\n  ...Object.values(MUSEUM010).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:'$'+q.cost,unlockRank:q.rank})),")
after('for(const q of Object.values(STREETLIFE009)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(MUSEUM010)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(MUSEUM_TOOL010[toolId])return canPlaceMuseum010(MUSEUM_TOOL010[toolId],x,y);')
rep('const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId]||STREETLIFE_TOOL009[toolId];','const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId]||STREETLIFE_TOOL009[toolId]||MUSEUM_TOOL010[toolId];')
rep("    case 'stationHotel009':case 'refreshmentCafe009':case 'stationNewsstand009':c=STREETLIFE_TOOL009[toolId].cost;break;","    case 'regionalNaturalHistory010':c=MUSEUM_TOOL010[toolId].cost;break;\n    case 'stationHotel009':case 'refreshmentCafe009':case 'stationNewsstand009':c=STREETLIFE_TOOL009[toolId].cost;break;")
rep("    case 'stationHotel009':case 'refreshmentCafe009':case 'stationNewsstand009':{","    case 'regionalNaturalHistory010':{\n      const q=MUSEUM_TOOL010[toolId];placePowerMulti471(x,y,q.k,q.sz,0);\n      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;\n      Object.assign(t.bld,{pw:false,wa:false});markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;break;}\n    case 'stationHotel009':case 'refreshmentCafe009':case 'stationNewsstand009':{")
rep('function toolHint434(t){',"function toolHint434(t){\n  if(t&&(MUSEUM_TOOL010[t.id]||MUSEUM_PATH010[t.id]))return museumDescription010(MUSEUM_TOOL010[t.id]||MUSEUM_PATH010[t.id]);")
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !((MUSEUM_TOOL010[t.id]||MUSEUM_PATH010[t.id])&&window.__noMuseum010)&&')
rep('function toolSize458(id){',"function toolSize458(id){\n  const m010=MUSEUM_TOOL010[typeof id==='object'?id?.id:id];if(m010)return m010.sz;")
after('for(const q of Object.values(STREETLIFE009))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(MUSEUM010))MAYOR_MANUAL_ONLY470A.add(q.id);')
after('for(const q of Object.values(STREETLIFE009))MSZ[q.k]=q.sz;','for(const q of Object.values(MUSEUM010))MSZ[q.k]=q.sz;')
after('if(STREETLIFE009[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});','        if(MUSEUM010[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});')
rep('    else if(STREETLIFE009[b.k])html=', '    else if(MUSEUM010[b.k])html=museumInspect010(idx(x,y),b);\n    else if(STREETLIFE009[b.k])html=')
rep('function insMetrics461(x,y,b,html){','function insMetrics461(x,y,b,html){if(MUSEUM010[b.k])return museumMetrics010(idx(x,y),b);')
# Full-footprint power discovery and physical caps reuse britishSpec004.
rep('if(STREETLIFE009[k])return STREETLIFE009[k].power;','if(MUSEUM010[k])return MUSEUM010[k].power;if(STREETLIFE009[k])return STREETLIFE009[k].power;')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(museumKind010(k))return 2;')
after('for(const q of Object.values(STREETLIFE009))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(MUSEUM010))WATER_LOAD472.special[q.k]=q.water;')
# Museum uses native culture day/evening/night load and general water profiles.
# Construction, public salary positions and maintenance each have one owner.
rep('HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]))b.age++;','HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]))b.age++;')
rep('if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k]&&!PUBLICLIFE007[b.k]&&!STREETLIFE009[b.k])b.age++;','if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k]&&!PUBLICLIFE007[b.k]&&!STREETLIFE009[b.k]&&!MUSEUM010[b.k])b.age++;')
rep('stationDaily008();refreshStreetLifeUtilities009();','stationDaily008();refreshStreetLifeUtilities009();refreshMuseumUtilities010();refreshMuseumCoverage010();')
after('  const publicLifeDaily007={publicJobs:publicLifePublicJobs007(),upkeep:publicLifeUpkeep007()};','  const museumDaily010={publicJobs:museumPublicJobs010(),upkeep:museumUpkeep010()};')
rep('jobs+=highStreetDaily005.publicJobs+publicLifeDaily007.publicJobs;','jobs+=highStreetDaily005.publicJobs+publicLifeDaily007.publicJobs+museumDaily010.publicJobs;')
rep('upkeep+=highStreetDaily005.upkeep+publicLifeDaily007.upkeep;','upkeep+=highStreetDaily005.upkeep+publicLifeDaily007.upkeep+museumDaily010.upkeep;')
rep('    else if(PUBLICLIFE007[b.k]); // GPT-007:','    else if(MUSEUM010[b.k]); // GPT-010: public museum has no industrial/commercial tax fallback\n    else if(PUBLICLIFE007[b.k]); // GPT-007:')
rep('if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
# T491/T495 are the only worker and visitor-trip authorities. No school seats.
after('for(const q of Object.values(PUBLICLIFE007)){PUBLIC_JOBS491[q.k]=q.jobs;if(q.seats)EDUCATION_CAP491[q.k]=q.seats;}','for(const q of Object.values(MUSEUM010))PUBLIC_JOBS491[q.k]=q.jobs;')
after('for(const q of Object.values(PUBLICLIFE007)){if(q.services)SERVICE_CAP491[q.k]=q.services;if(q.leisure)LEISURE_BASE491[q.k]=q.leisure;}','for(const q of Object.values(MUSEUM010))LEISURE_BASE491[q.k]=q.leisure;')
rep('function publicJobCapacity491(b){','function publicJobCapacity491(b){if(b&&MUSEUM010[b.k])return museumBuilt010(b)?MUSEUM010[b.k].jobs:0;')
rep('if(!b||b.ref)return null;if((PUBLICLIFE007[b.k]','if(!b||b.ref)return null;if((MUSEUM010[b.k]&&!museumOperational010(root,b))||(PUBLICLIFE007[b.k]')
rep('(LEISURE_BASE491[b.k]||0)*(PUBLICLIFE007[b.k]?publicLifeCapacityFactor007(root,b):','(LEISURE_BASE491[b.k]||0)*(MUSEUM010[b.k]?museumCapacityFactor010(root,b):PUBLICLIFE007[b.k]?publicLifeCapacityFactor007(root,b):')
rep('function civicFactors495(root,b){','function civicFactors495(root,b){\n  if(b&&MUSEUM010[b.k])return museumFactors010(root,b);')
rep('function publicActivePositions495(root,b){','function publicActivePositions495(root,b){if(b&&MUSEUM010[b.k]&&!museumOperational010(root,b))return 0;')
# Staff refresh completes before tourism and updates owned museum coverage.
rep('computeBusRtCovPop();prepareCivicServices495(entNow489);','computeBusRtCovPop();prepareCivicServices495(entNow489);refreshMuseumCoverage010();')
rep('  tourists=Math.round((la*25+ctN307*12+obN307*22+tourLm309+','  const museumTourismBase010=museumTourismWeight010();\n  tourists=Math.round((museumTourismBase010+la*25+ctN307*12+obN307*22+tourLm309+')
anchor='  if(cvN>0&&day%CONVENTION_PULSE_DAYS===0){'
rep(anchor,"  museumTourismLedger010={day,base:museumTourismBase010,season:TOUR_SEASON_MULT[sea],green:sq('green',1.15,1),weighted:museumTourismBase010*TOUR_SEASON_MULT[sea]*sq('green',1.15,1)};\n"+anchor)
# New museum coverage is a reversible owned stamp, never an alias or second field.
rep('function covFieldOfK(k){','function covFieldOfK(k){if(MUSEUM010[k])return MUSEUM010[k].coverage;')
rep('if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k]&&!PUBLICLIFE007[rb.k])','if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k]&&!PUBLICLIFE007[rb.k]&&!MUSEUM010[rb.k])')
rep('if(cf&&!HIGHSTREET005[bk]&&!PUBLICLIFE007[bk])','if(cf&&!HIGHSTREET005[bk]&&!PUBLICLIFE007[bk]&&!MUSEUM010[bk])')
after('  if(publicLifeCovRoots007.size)refreshPublicLifeCoverage007([...publicLifeCovRoots007.keys()]);','  if(museumCovRoots010.size)refreshMuseumCoverage010([...museumCovRoots010.keys()]);')
rep('britishCovRoots004.clear();highStreetCovRoots005.clear();publicLifeCovRoots007.clear();','britishCovRoots004.clear();highStreetCovRoots005.clear();publicLifeCovRoots007.clear();museumCovRoots010.clear();')
rep('const f=covFieldOfK(b.k);if(PUBLICLIFE007[b.k]){','const f=covFieldOfK(b.k);if(MUSEUM010[b.k]){if(museumCoverageReady010(idx(x,y),b)){stampMuseumCoverage010(idx(x,y),COVR.museum,1);museumCovRoots010.set(idx(x,y),COVR.museum);}}else if(PUBLICLIFE007[b.k]){')
after('for(const q of Object.values(PUBLICLIFE007))if(q.coverage)TOOL_COV459[q.id]=q.coverage;','for(const q of Object.values(MUSEUM010))TOOL_COV459[q.id]=q.coverage;')
rep('function placementCoverage459(id){',"function placementCoverage459(id){if(MUSEUM_TOOL010[id])return {field:'museum',r:COVR.museum};")
rep('if(b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k])){const r=sanRoadSeeds445','if(b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k])){const r=sanRoadSeeds445')
rep('const FISCAL_PUBLIC_ASSET_META515=Object.freeze({',"const FISCAL_PUBLIC_ASSET_META515=Object.freeze({\n  ...Object.fromEntries(Object.values(MUSEUM010).map(q=>[q.k,{family:'culture',cost:q.cost}])),")
# Authored native construction, rotation, masks, night windows and path compositor.
rep('||b.k===4||b.k===221||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k])continue;','||b.k===4||b.k===221||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||MUSEUM010[b.k])continue;')
rep('bd.k!==221&&!HIGHSTREET005[bd.k]&&!PUBLICLIFE007[bd.k]&&nightDepth>0.55','bd.k!==221&&!HIGHSTREET005[bd.k]&&!PUBLICLIFE007[bd.k]&&!MUSEUM010[bd.k]&&nightDepth>0.55')
rep('stationObjects008(objs,sxOf,syOf,vis,lodFar);streetLifeObjects009(objs,sxOf,syOf,vis,lodFar);','stationObjects008(objs,sxOf,syOf,vis,lodFar);streetLifeObjects009(objs,sxOf,syOf,vis,lodFar);museumObjects010(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.streetLifeModule009){','    if(o.museumModule010){museumModuleDraw010(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.streetLifeModule009){')
rep("if(stationTheme008(tiles[i])||(!window.__noStreetLifeArt009&&cam.z>=lodFarZ648()&&streetLifeTheme009(tiles[i])))continue;","if(stationTheme008(tiles[i])||(!window.__noStreetLifeArt009&&cam.z>=lodFarZ648()&&streetLifeTheme009(tiles[i]))||(!window.__noMuseumArt010&&cam.z>=lodFarZ648()&&museumTheme010(tiles[i])))continue;")
rep('  streetLifeSelftest009,streetLifeSpecs009,streetLifeAt009,streetLifeEvidence009,','  museumSelftest010,museumSpecs010,museumAt010,museumEvidence010,\n  streetLifeSelftest009,streetLifeSpecs009,streetLifeAt009,streetLifeEvidence009,')
# Preserve all bounded prior definitions and release labels byte-for-byte.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('const RESIDENTIAL_SPEC_ROWS006=','const RESIDENTIAL_TOOL006='),('const PUBLICLIFE_SPEC_ROWS007=','const PUBLICLIFE_TOOL007='),('const STREETLIFE009=','const STREETLIFE_TOOL009=')]:
 assert base.split(start,1)[1].split(end,1)[0]==s.split(start,1)[1].split(end,1)[0],start
for name in ['britishSelftest004','highStreetSelftest005','residentialSelftest006','publicLifeSelftest007','stationSelftest008','streetLifeSelftest009']:
 marker='function '+name+'('
 if marker in base:
  assert marker+base.split(marker,1)[1].split('\nfunction ',1)[0].rstrip() in s,name
for key in ['GAME_VER','GAME_ANCHOR']:
 assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s),key
assert src.read_text()==base,'Immutable source changed during assembly'
out.write_text(s)
import json
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'outputSHA256':hashlib.sha256(s.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
