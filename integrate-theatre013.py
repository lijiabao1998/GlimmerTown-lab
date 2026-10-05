#!/usr/bin/env python3
"""GPT-013 count-checked native theatre integration. Source/syntax work only.
Build a separate candidate from untouched T725 HTML; do not run game/art code.
"""
import argparse, hashlib, json, pathlib, re
P = pathlib.Path(__file__).resolve().parent
p = argparse.ArgumentParser()
p.add_argument('--input', required=True)
p.add_argument('--output', required=True)
p.add_argument('--art', default=str(P/'british-theatre-art013.js'))
a = p.parse_args()
src = pathlib.Path(a.input); out = pathlib.Path(a.output)
if src.resolve() == out.resolve() or out.resolve() == (P/'index.html').resolve():
    raise SystemExit('Separate candidate output required')
base = src.read_text(); s = base; audit = []
if 'const THEATRE013=' in s: raise SystemExit('Theatre already integrated')
reserved = r'281'
for pattern in [rf'(?<![\w.]){reserved}\s*:', rf"['\"]{reserved}(?:_[0-9]+_[0-9]+)?['\"]\s*:", rf'\bk\s*(?::|={{1,3}})\s*{reserved}\b', rf"\b(?:MSZ|KNAME|KCB|SPR\.bld)\s*\[\s*['\"]?{reserved}(?:_[0-9]+_[0-9]+)?['\"]?\s*\]", rf"['\"]{reserved}_[0-9]+_[0-9]+['\"]"]:
    hit = re.search(pattern, base)
    if hit: raise SystemExit('Reserved permanent building ID already occupied: '+hit.group(0))
def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count: raise SystemExit(f'Anchor {n} != {count}: {old[:160]}')
    s = s.replace(old,new); audit.append({'anchor':old[:120], 'count':n})
def after(old,new,count=1): rep(old, old+'\n'+new,count)
game = (P/'gameplay013.js').read_text()
early,late = game.split('/* GPT-013 LATE NATIVE HOOKS */',1)
art = pathlib.Path(a.art).read_text()
if 'BritishTheatreArchitecture013' not in art: raise SystemExit('Expected BritishTheatreArchitecture013 art API')
rep('<!-- GPT-012 native riverside art BEGIN: source british-riverside-art012.js -->','<!-- GPT-013 native theatre art BEGIN: source british-theatre-art013.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-013 native theatre art END -->\n<!-- GPT-012 native riverside art BEGIN: source british-riverside-art012.js -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('||MUSEUM010[k]||RIVERSIDE012[k]||null;','||MUSEUM010[k]||RIVERSIDE012[k]||THEATRE013[k]||null;')
rep('const drawPath643=(src=>','/* GPT-013 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installMuseumArt010();installRiversideArt012(); // GPT-004','installMuseumArt010();installRiversideArt012();installTheatreArt013(); // GPT-004')
# Native paid transactions, one 3x3 root/eight refs, collision checks and undo.
rep('const TOOLS=[',"const TOOLS=[\n  ...Object.values(THEATRE013).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:'$'+q.cost,unlockRank:q.rank})),")
after('for(const q of Object.values(RIVERSIDE012)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(THEATRE013)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(THEATRE_TOOL013[toolId])return canPlaceTheatre013(THEATRE_TOOL013[toolId],x,y);')
rep('||MUSEUM_TOOL010[toolId]||RIVERSIDE_TOOL012[toolId];','||MUSEUM_TOOL010[toolId]||RIVERSIDE_TOOL012[toolId]||THEATRE_TOOL013[toolId];')
rep("    case 'regionalNaturalHistory010':c=MUSEUM_TOOL010[toolId].cost;break;","    case 'edwardianTheatre013':c=THEATRE_TOOL013[toolId].cost;break;\n    case 'regionalNaturalHistory010':c=MUSEUM_TOOL010[toolId].cost;break;")
rep("    case 'regionalNaturalHistory010':{","""    case 'edwardianTheatre013':{
      const q=THEATRE_TOOL013[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false});markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;break;}
    case 'regionalNaturalHistory010':{""")
rep('function toolHint434(t){',"function toolHint434(t){\n  if(t&&(THEATRE_TOOL013[t.id]||THEATRE_PATH013[t.id]))return theatreDescription013(THEATRE_TOOL013[t.id]||THEATRE_PATH013[t.id]);")
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !((THEATRE_TOOL013[t.id]||THEATRE_PATH013[t.id])&&window.__noTheatre013)&&')
rep('function toolSize458(id){',"function toolSize458(id){\n  const th013=THEATRE_TOOL013[typeof id==='object'?id?.id:id];if(th013)return th013.sz;")
after('for(const q of Object.values(RIVERSIDE012))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(THEATRE013))MAYOR_MANUAL_ONLY470A.add(q.id);')
after('for(const q of Object.values(RIVERSIDE012))MSZ[q.k]=q.sz;','for(const q of Object.values(THEATRE013))MSZ[q.k]=q.sz;')
after('if(RIVERSIDE012[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});','        if(THEATRE013[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});')
rep('    else if(MUSEUM010[b.k])html=', '    else if(THEATRE013[b.k])html=theatreInspect013(idx(x,y),b);\n    else if(MUSEUM010[b.k])html=')
rep('function insMetrics461(x,y,b,html){','function insMetrics461(x,y,b,html){if(THEATRE013[b.k])return theatreMetrics013(idx(x,y),b);')
# Native physical loads, full-footprint road frontage and services eligibility.
rep('if(RIVERSIDE012[k])return RIVERSIDE012[k].power;','if(THEATRE013[k])return THEATRE013[k].power;if(RIVERSIDE012[k])return RIVERSIDE012[k].power;')
rep('function powerProfile471(b){','function powerProfile471(b){\n  if(theatreKind013(b.k))return powerProfile471({...b,k:36});')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(theatreKind013(k))return 2;')
after('for(const q of Object.values(RIVERSIDE012))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(THEATRE013))WATER_LOAD472.special[q.k]=q.water;')
rep('function waterProfile472(b){','function waterProfile472(b){if(theatreKind013(b.k))return waterProfile472({...b,k:36});')
rep('function wastewaterReturn472(b){if(!b)return 0;','function wastewaterReturn472(b){if(!b)return 0;if(theatreKind013(b.k))return wastewaterReturn472({...b,k:36});')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(theatreKind013(b.k))return waterCriticalTier472({...b,k:36});')
rep('function isSanClient445(k){return ','function isSanClient445(k){return theatreKind013(k)||')
rep('||MUSEUM010[b.k]||RIVERSIDE012[b.k]))b.age++;','||MUSEUM010[b.k]||RIVERSIDE012[b.k]||THEATRE013[b.k]))b.age++;')
rep('&&!MUSEUM010[b.k]&&!RIVERSIDE012[b.k])b.age++;','&&!MUSEUM010[b.k]&&!RIVERSIDE012[b.k]&&!THEATRE013[b.k])b.age++;')
rep('refreshMuseumCoverage010();refreshRiversideUtilities012();','refreshMuseumCoverage010();refreshRiversideUtilities012();refreshTheatreUtilities013();refreshTheatreCoverage013();')
rep('||MUSEUM010[b.k]||RIVERSIDE012[b.k])){const r=sanRoadSeeds445','||MUSEUM010[b.k]||RIVERSIDE012[b.k]||THEATRE013[b.k])){const r=sanRoadSeeds445')
# Existing saved optional path metadata also protects against residual legacy zoning.
rep('if(t.zone&&!t.bld&&!t.ruin&&hasRoadNear(x,y,2,true,true))cands.push([x,y,t.zone]);','if(t.zone&&!t.bld&&!t.ruin&&!theatreTheme013(t)&&hasRoadNear(x,y,2,true,true))cands.push([x,y,t.zone]);')
# No private enterprise/ticket/synthetic visitor income. Exactly one public jobs
# contribution and one completed-asset upkeep contribution in native accounting.
after('  const museumDaily010={publicJobs:museumPublicJobs010(),upkeep:museumUpkeep010()};','  const theatreDaily013={publicJobs:theatrePublicJobs013(),upkeep:theatreUpkeep013()};')
rep('jobs+=highStreetDaily005.publicJobs+publicLifeDaily007.publicJobs+museumDaily010.publicJobs;','jobs+=highStreetDaily005.publicJobs+publicLifeDaily007.publicJobs+museumDaily010.publicJobs+theatreDaily013.publicJobs;')
rep('upkeep+=highStreetDaily005.upkeep+publicLifeDaily007.upkeep+museumDaily010.upkeep;','upkeep+=highStreetDaily005.upkeep+publicLifeDaily007.upkeep+museumDaily010.upkeep+theatreDaily013.upkeep;')
rep('    else if(MUSEUM010[b.k]); // GPT-010:', '    else if(THEATRE013[b.k]); // GPT-013: public theatre has no industrial, commercial or ticket-tax fallback\n    else if(MUSEUM010[b.k]); // GPT-010:')
rep('if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]||RIVERSIDE012[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]||RIVERSIDE012[b.k]||THEATRE013[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
after('for(const q of Object.values(MUSEUM010))PUBLIC_JOBS491[q.k]=q.jobs;','for(const q of Object.values(THEATRE013))PUBLIC_JOBS491[q.k]=q.jobs;')
after('for(const q of Object.values(MUSEUM010))LEISURE_BASE491[q.k]=q.leisure;','for(const q of Object.values(THEATRE013))LEISURE_BASE491[q.k]=q.leisure;')
rep('function publicJobCapacity491(b){','function publicJobCapacity491(b){if(b&&THEATRE013[b.k])return theatreBuilt013(b)?THEATRE013[b.k].jobs:0;')
rep('if(!b||b.ref)return null;if((MUSEUM010[b.k]','if(!b||b.ref)return null;if((THEATRE013[b.k]&&!theatreOperational013(root,b))||(MUSEUM010[b.k]')
rep('(LEISURE_BASE491[b.k]||0)*(MUSEUM010[b.k]?museumCapacityFactor010(root,b):','(LEISURE_BASE491[b.k]||0)*(THEATRE013[b.k]?theatreCapacityFactor013(root,b):MUSEUM010[b.k]?museumCapacityFactor010(root,b):')
rep('function civicFactors495(root,b){','function civicFactors495(root,b){\n  if(b&&THEATRE013[b.k])return theatreFactors013(root,b);')
rep('function publicActivePositions495(root,b){','function publicActivePositions495(root,b){if(b&&THEATRE013[b.k]&&!theatreOperational013(root,b))return 0;')
rep('prepareCivicServices495(entNow489);refreshMuseumCoverage010();','prepareCivicServices495(entNow489);refreshMuseumCoverage010();refreshTheatreCoverage013();')
# Owned reversible stamps use the old theater field without changing old owners.
rep('function covFieldOfK(k){','function covFieldOfK(k){if(THEATRE013[k])return THEATRE013[k].coverage;')
rep('if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k]&&!PUBLICLIFE007[rb.k]&&!MUSEUM010[rb.k])','if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k]&&!PUBLICLIFE007[rb.k]&&!MUSEUM010[rb.k]&&!THEATRE013[rb.k])')
rep('if(cf&&!HIGHSTREET005[bk]&&!PUBLICLIFE007[bk]&&!MUSEUM010[bk])','if(cf&&!HIGHSTREET005[bk]&&!PUBLICLIFE007[bk]&&!MUSEUM010[bk]&&!THEATRE013[bk])')
after('  if(museumCovRoots010.size)refreshMuseumCoverage010([...museumCovRoots010.keys()]);','  if(theatreCovRoots013.size)refreshTheatreCoverage013([...theatreCovRoots013.keys()]);')
rep('britishCovRoots004.clear();highStreetCovRoots005.clear();publicLifeCovRoots007.clear();museumCovRoots010.clear();','britishCovRoots004.clear();highStreetCovRoots005.clear();publicLifeCovRoots007.clear();museumCovRoots010.clear();theatreCovRoots013.clear();')
rep('const f=covFieldOfK(b.k);if(MUSEUM010[b.k]){','const f=covFieldOfK(b.k);if(THEATRE013[b.k]){if(theatreCoverageReady013(idx(x,y),b)){stampTheatreCoverage013(idx(x,y),COVR.theater,1);theatreCovRoots013.set(idx(x,y),COVR.theater);}}else if(MUSEUM010[b.k]){')
after('for(const q of Object.values(MUSEUM010))TOOL_COV459[q.id]=q.coverage;','for(const q of Object.values(THEATRE013))TOOL_COV459[q.id]=q.coverage;')
rep('function placementCoverage459(id){',"function placementCoverage459(id){if(THEATRE_TOOL013[id])return {field:'theater',r:COVR.theater};")
rep('const FISCAL_PUBLIC_ASSET_META515=Object.freeze({',"const FISCAL_PUBLIC_ASSET_META515=Object.freeze({\n  ...Object.fromEntries(Object.values(THEATRE013).map(q=>[q.k,{family:'culture',cost:q.cost}])),")
# Existing T700 paid construction, weather, true sprite rotation, T649 warm
# physical night masks and T629 occlusion remain the rendering authorities.
rep('||b.k===4||b.k===221||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||MUSEUM010[b.k])continue;','||b.k===4||b.k===221||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||MUSEUM010[b.k]||THEATRE013[b.k])continue;')
rep('bd.k!==221&&!HIGHSTREET005[bd.k]&&!PUBLICLIFE007[bd.k]&&!MUSEUM010[bd.k]&&nightDepth>0.55','bd.k!==221&&!HIGHSTREET005[bd.k]&&!PUBLICLIFE007[bd.k]&&!MUSEUM010[bd.k]&&!THEATRE013[bd.k]&&nightDepth>0.55')
rep('museumObjects010(objs,sxOf,syOf,vis,lodFar);riversideObjects012(objs,sxOf,syOf,vis,lodFar);','museumObjects010(objs,sxOf,syOf,vis,lodFar);riversideObjects012(objs,sxOf,syOf,vis,lodFar);theatreObjects013(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.riversideModule012){','    if(o.theatreModule013){theatreModuleDraw013(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.riversideModule012){')
rep('||(!window.__noRiversideArt012&&cam.z>=lodFarZ648()&&riversideTheme012(tiles[i])))continue;','||(!window.__noRiversideArt012&&cam.z>=lodFarZ648()&&riversideTheme012(tiles[i]))||(!window.__noTheatreArt013&&cam.z>=lodFarZ648()&&theatreTheme013(tiles[i])))continue;')
rep('  riversideSelftest012,riversideSpecs012,riversideAt012,riversideEvidence012,','  theatreSelftest013,theatreSpecs013,theatreAt013,theatreEvidence013,\n  riversideSelftest012,riversideSpecs012,riversideAt012,riversideEvidence012,')
# Immutable compatibility boundaries: every old bounded registry/art source,
# old validation functions, release identity, native save/RLE and T724 cold-load.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('const RESIDENTIAL_SPEC_ROWS006=','const RESIDENTIAL_TOOL006='),('const PUBLICLIFE_SPEC_ROWS007=','const PUBLICLIFE_TOOL007='),('const STREETLIFE009=','const STREETLIFE_TOOL009='),('const MUSEUM010=','const MUSEUM_TOOL010='),('const RIVERSIDE012=','const RIVERSIDE_TOOL012=')]:
    assert base.split(start,1)[1].split(end,1)[0] == s.split(start,1)[1].split(end,1)[0], 'Protected registry changed: '+start
for name in ['britishSelftest004','highStreetSelftest005','residentialSelftest006','publicLifeSelftest007','stationSelftest008','streetLifeSelftest009','museumSelftest010','riversideSelftest012']:
    marker='function '+name+'('
    assert marker+base.split(marker,1)[1].split('\nfunction ',1)[0].rstrip() in s, name
cold='const __load515=load;load=function(slot){const ok=__load515(slot);if(ok){fiscal515.lastDay=-1;fiscalStep515(false,false);try{observatoryStep514(true);}catch(_e){}if(!window.__noColdLoadPower011)markPowerDirty450();}return ok;};'
assert cold in base and cold in s, 'T724 cold-load fix changed'
for name in ['activeMobilitySave502','activeMobilityLoad502']:
    marker='function '+name+'('
    assert marker+base.split(marker,1)[1].split('\nfunction ',1)[0].rstrip() in s, name
for key in ['GAME_VER','GAME_ANCHOR']:
    assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s), key
assert src.read_text()==base, 'Input changed during assembly'
out.write_text(s)
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'outputSHA256':hashlib.sha256(s.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
