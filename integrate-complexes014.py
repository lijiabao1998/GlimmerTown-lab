#!/usr/bin/env python3
"""GPT-014 source-only native integration from immutable T726; no game execution.
Count-check every edit. Output is a separate review candidate, never index.html.
"""
import argparse, hashlib, json, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True)
p.add_argument('--art',nargs='+',default=[str(P/f) for f in ['british-complex-primitives014.js','british-college-manor-art014.js','british-baths-fire-art014.js','british-complexes-art014.js']])
a=p.parse_args();src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if 'const COMPLEX014=' in s:raise SystemExit('Complexes already integrated')
for k in range(282,294):
 for pattern in [rf'(?<![\w.]){k}\s*:',rf"['\"]{k}(?:_[0-9]+_[0-9]+)?['\"]\s*:",rf'\bk\s*(?::|={{1,3}})\s*{k}\b',rf"\b(?:MSZ|KNAME|KCB|SPR\.bld)\s*\[\s*['\"]?{k}(?:_[0-9]+_[0-9]+)?['\"]?\s*\]",rf"['\"]{k}_[0-9]+_[0-9]+['\"]"]:
  hit=re.search(pattern,base)
  if hit:raise SystemExit('Reserved permanent building ID already occupied: '+hit.group(0))
# Reject unseen baselines, even when all textual anchors still happen to match.
EXPECTED_T726_SHA='d08e96bc49a86f58a6671153c5b58da76022294e3efe1c10af5a6c3b9d9a565e'
if hashlib.sha256(base.encode()).hexdigest()!=EXPECTED_T726_SHA:raise SystemExit('Expected exact immutable T726 input')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor {n} != {count}: {old[:160]}')
 s=s.replace(old,new);audit.append({'anchor':old[:120],'count':n})
def after(old,new,count=1):rep(old,old+'\n'+new,count)
rows=json.loads((P/'complex-specs014.json').read_text());buildings=rows['buildings'];paths=rows['paths']
assert [q['k'] for q in buildings]==list(range(282,294)) and len(paths)==16
assert all(q['sz']==(4 if q['k'] in [282,285,288,291] else 2) for q in buildings)
game=(P/'gameplay014.js').read_text();early,late=game.split('/* GPT-014 LATE NATIVE HOOKS */',1)
assert json.loads(game.split('const COMPLEX014=Object.freeze(',1)[1].split(');',1)[0])=={str(q['k']):q for q in buildings}
assert json.loads(game.split('const COMPLEX_PATH014=Object.freeze(',1)[1].split(');',1)[0])=={q['id']:q for q in paths}
art='\n'.join(pathlib.Path(f).read_text() for f in a.art)
if 'BritishComplexesArchitecture014' not in art:raise SystemExit('Expected BritishComplexesArchitecture014 art API')
marker='<!-- GPT-013 native theatre art BEGIN: source british-theatre-art013.js -->'
rep(marker,'<!-- GPT-014 native complexes art BEGIN: sources british-complex-primitives014.js, british-college-manor-art014.js, british-baths-fire-art014.js, british-complexes-art014.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-014 native complexes art END -->\n'+marker)
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('||RIVERSIDE012[k]||THEATRE013[k]||null;','||RIVERSIDE012[k]||THEATRE013[k]||COMPLEX014[k]||null;')
rep('const drawPath643=(src=>','/* GPT-014 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installTheatreArt013(); // GPT-004','installTheatreArt013();installComplexArt014(); // GPT-004')
rep('const TOOLS=[',"const TOOLS=[\n  ...Object.values(COMPLEX014).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:'$'+q.cost,unlockRank:q.rank})),")
after('for(const q of Object.values(THEATRE013)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(COMPLEX014)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(COMPLEX_TOOL014[toolId])return canPlaceComplex014(COMPLEX_TOOL014[toolId],x,y);')
rep('||RIVERSIDE_TOOL012[toolId]||THEATRE_TOOL013[toolId];','||RIVERSIDE_TOOL012[toolId]||THEATRE_TOOL013[toolId]||COMPLEX_TOOL014[toolId];')
cases=''.join("case '%s':"%q['id'] for q in buildings)
rep("    case 'edwardianTheatre013':c=",'    '+cases+'c=COMPLEX_TOOL014[toolId].cost;break;\n'+"    case 'edwardianTheatre013':c=")
rep("    case 'edwardianTheatre013':{",'    '+cases+'''{
      const q=COMPLEX_TOOL014[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false});if(q.role==='housing')Object.assign(t.bld,{we:1,den:3});
      markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;markEmergencyDirty455();break;}
    case 'edwardianTheatre013':{''')
rep('function toolHint434(t){',"function toolHint434(t){\n  if(t&&(COMPLEX_TOOL014[t.id]||COMPLEX_PATH014[t.id]))return complexDescription014(COMPLEX_TOOL014[t.id]||COMPLEX_PATH014[t.id]);")
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !((COMPLEX_TOOL014[t.id]||COMPLEX_PATH014[t.id])&&window.__noComplex014)&&')
rep('function toolSize458(id){',"function toolSize458(id){\n  const cx014=COMPLEX_TOOL014[typeof id==='object'?id?.id:id];if(cx014)return cx014.sz;")
after('for(const q of Object.values(THEATRE013))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(COMPLEX014))MAYOR_MANUAL_ONLY470A.add(q.id);')
after('for(const q of Object.values(THEATRE013))MSZ[q.k]=q.sz;','for(const q of Object.values(COMPLEX014))MSZ[q.k]=q.sz;')
after('if(THEATRE013[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});',"        if(COMPLEX014[k]){Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});if(complexHousing014(k))Object.assign(tiles[i].bld,{we:1,den:3});}")
rep('    else if(THEATRE013[b.k])html=', '    else if(COMPLEX014[b.k])html=complexInspect014(idx(x,y),b);\n    else if(THEATRE013[b.k])html=')
rep('function insMetrics461(x,y,b,html){','function insMetrics461(x,y,b,html){if(COMPLEX014[b.k])return complexMetrics014(idx(x,y),b);')
# Each new root owns exactly one physical demand in existing native networks.
rep('if(THEATRE013[k])return THEATRE013[k].power;','if(COMPLEX014[k])return COMPLEX014[k].power;if(THEATRE013[k])return THEATRE013[k].power;')
rep('function powerProfile471(b){','function powerProfile471(b){\n  if(complexKind014(b.k))return powerProfile471({...b,k:COMPLEX014[b.k].baseK});')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(complexKind014(k))return powerCriticalTier471(COMPLEX014[k].baseK);')
after('for(const q of Object.values(THEATRE013))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(COMPLEX014))WATER_LOAD472.special[q.k]=q.water;')
rep('function waterProfile472(b){','function waterProfile472(b){if(complexKind014(b.k))return waterProfile472({...b,k:COMPLEX014[b.k].baseK});')
rep('function wastewaterReturn472(b){if(!b)return 0;','function wastewaterReturn472(b){if(!b)return 0;if(complexKind014(b.k))return wastewaterReturn472({...b,k:COMPLEX014[b.k].baseK});')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(complexKind014(b.k))return waterCriticalTier472({...b,k:COMPLEX014[b.k].baseK});')
rep('function isSanClient445(k){return ','function isSanClient445(k){return complexKind014(k)||')
rep('||RIVERSIDE012[b.k]||THEATRE013[b.k]))b.age++;','||RIVERSIDE012[b.k]||THEATRE013[b.k]||COMPLEX014[b.k]))b.age++;')
rep('&&!RIVERSIDE012[b.k]&&!THEATRE013[b.k])b.age++;','&&!RIVERSIDE012[b.k]&&!THEATRE013[b.k]&&!COMPLEX014[b.k])b.age++;')
rep('refreshTheatreUtilities013();refreshTheatreCoverage013();','refreshTheatreUtilities013();refreshTheatreCoverage013();refreshComplexUtilities014();refreshComplexCoverage014();refreshComplexEmergency014();')
rep('||RIVERSIDE012[b.k]||THEATRE013[b.k])){const r=sanRoadSeeds445','||RIVERSIDE012[b.k]||THEATRE013[b.k]||COMPLEX014[b.k])){const r=sanRoadSeeds445')
rep('!theatreTheme013(t)&&hasRoadNear','!theatreTheme013(t)&&!complexTheme014(t)&&hasRoadNear')
# True native household capacity and taxes, not a service-labeled residence.
rep('function housingBand488(b){if(!b||b.ref)return null;','function housingBand488(b){if(!b||b.ref)return null;if(complexHousing014(b.k))return COMPLEX014[b.k].band;')
rep('function residentCapacity488(b){if(!b||b.ref)return 0;','function residentCapacity488(b){if(!b||b.ref)return 0;if(complexHousing014(b.k))return COMPLEX014[b.k].capacity;')
rep('function residentEligible488(root,b){if(!b||b.ref)return false;','function residentEligible488(root,b){if(!b||b.ref)return false;if(complexHousing014(b.k))return complexOperational014(root,b);')
rep('if(RESIDENTIAL006[b.k]&&!residentialBuilt006(b))continue;','if((RESIDENTIAL006[b.k]||complexHousing014(b.k))&&!residentialBuilt006(b))continue;')
rep('const near=(BRITISH004[b.k]||RESIDENTIAL006[b.k])?britishRoad004(si442)','const near=(BRITISH004[b.k]||RESIDENTIAL006[b.k]||complexHousing014(b.k))?britishRoad004(si442)')
rep('if(RESIDENTIAL006[b.k]){if(powerLegacy450())b.pw=false;','if(RESIDENTIAL006[b.k]||complexHousing014(b.k)){if(powerLegacy450())b.pw=false;')
# Public and residential accounting have mutually exclusive one-root ownership.
after('  const theatreDaily013={publicJobs:theatrePublicJobs013(),upkeep:theatreUpkeep013()};','  const complexDaily014={publicJobs:complexPublicJobs014(),upkeep:complexUpkeep014()};')
rep('+theatreDaily013.publicJobs;','+theatreDaily013.publicJobs+complexDaily014.publicJobs;')
rep('+theatreDaily013.upkeep;','+theatreDaily013.upkeep+complexDaily014.upkeep;')
# Runtime-only receipt brackets the unchanged native treasury posting exactly.
# It observes the actual income/upkeep/fin values and never changes them.
rep('  if(diff!==3)money+=income-upkeep;','  complexFiscalState014=tickBld.some(root=>complexKind014(tiles[root]?.bld?.k))?{day,beforeMoney:money,income,upkeep,complexPublicJobs:complexDaily014.publicJobs,complexUpkeep:complexDaily014.upkeep,difficulty:diff}:null;\n  if(diff!==3)money+=income-upkeep;\n  if(complexFiscalState014)Object.assign(complexFiscalState014,{afterMoney:money,postedNet:fin.net,rawFin:JSON.parse(JSON.stringify(fin))});')

rep('    else if(THEATRE013[b.k]); // GPT-013:',"    else if(COMPLEX014[b.k]){const rt014=complexHousingTax014(i,b,pol||{taxR:1},civicMul);income+=rt014;taxR+=rt014;} // GPT-014: native residential taxes only; no public tax fallback\n    else if(THEATRE013[b.k]); // GPT-013:")
rep('||RIVERSIDE012[b.k]||THEATRE013[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','||RIVERSIDE012[b.k]||THEATRE013[b.k]||(COMPLEX014[b.k]&&(!complexHousing014(b.k)||!complexBuilt014(b)))||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
after('for(const q of Object.values(THEATRE013))PUBLIC_JOBS491[q.k]=q.jobs;','for(const q of Object.values(COMPLEX014)){if(q.jobs)PUBLIC_JOBS491[q.k]=q.jobs;if(q.seats)EDUCATION_CAP491[q.k]=q.seats;}')
after('for(const q of Object.values(THEATRE013))LEISURE_BASE491[q.k]=q.leisure;','for(const q of Object.values(COMPLEX014)){if(q.leisure)LEISURE_BASE491[q.k]=q.leisure;if(q.services)SERVICE_CAP491[q.k]=q.services;}')
after('for(const q of Object.values(PUBLICLIFE007))if(q.seats)CIVIC_EDU_SEATS495[q.k]=q.seats;','for(const q of Object.values(COMPLEX014))if(q.seats)CIVIC_EDU_SEATS495[q.k]=q.seats;')
after("for(const q of Object.values(PUBLICLIFE007)){if(q.role==='fire')CIVIC_FIRE_K495.add(q.k);if(q.role==='police')CIVIC_POLICE_K495.add(q.k);}","for(const q of Object.values(COMPLEX014))if(q.role==='fire')CIVIC_FIRE_K495.add(q.k);")
after('for(const q of Object.values(PUBLICLIFE007))if(CRITICAL_SERVICE_K492.has(q.baseK))CRITICAL_SERVICE_K492.add(q.k);',"for(const q of Object.values(COMPLEX014))if(q.role==='fire')CRITICAL_SERVICE_K492.add(q.k);")
rep('function publicJobCapacity491(b){','function publicJobCapacity491(b){if(b&&COMPLEX014[b.k])return complexBuilt014(b)?COMPLEX014[b.k].jobs:0;')
rep('if(!b||b.ref)return null;if((THEATRE013[b.k]','if(!b||b.ref)return null;if((COMPLEX014[b.k]&&!complexOperational014(root,b))||(THEATRE013[b.k]')
rep('(LEISURE_BASE491[b.k]||0)*(THEATRE013[b.k]?','(LEISURE_BASE491[b.k]||0)*(COMPLEX014[b.k]?complexCapacityFactor014(root,b):THEATRE013[b.k]?')
rep('function civicFactors495(root,b){','function civicFactors495(root,b){\n  if(b&&COMPLEX014[b.k])return complexFactors014(root,b);')
rep('function publicActivePositions495(root,b){','function publicActivePositions495(root,b){if(b&&COMPLEX014[b.k]&&!complexOperational014(root,b))return 0;')
rep('function publicServiceCapacityForMobility495(root,b,type){',"function publicServiceCapacityForMobility495(root,b,type){if(b&&COMPLEX014[b.k])return (type==='education'?COMPLEX014[b.k].seats:COMPLEX014[b.k].services)*complexCapacityFactor014(root,b);")
rep('prepareCivicServices495(entNow489);refreshMuseumCoverage010();refreshTheatreCoverage013();','prepareCivicServices495(entNow489);refreshMuseumCoverage010();refreshTheatreCoverage013();refreshComplexCoverage014();')
# Fire sources enter the real station lookup, route field and dispatched fleet.
rep('function emergencyStationType455(k){',"function emergencyStationType455(k){if(COMPLEX014[k]?.role==='fire')return 'fire';")
rep('(ks.includes(b.k)||(PUBLICLIFE007[b.k]&&emergencyStationType455(b.k)===type&&publicLifeEmergencyReady007(i,b)))',"(ks.includes(b.k)||(COMPLEX014[b.k]?.role==='fire'&&type==='fire'&&complexEmergencyReady014(i,b))||(PUBLICLIFE007[b.k]&&emergencyStationType455(b.k)===type&&publicLifeEmergencyReady007(i,b)))")
rep('||(PUBLICLIFE007[b.k]&&!publicLifeEmergencyReady007(root,b)))return true;','||(COMPLEX014[b.k]&&!complexEmergencyReady014(root,b))||(PUBLICLIFE007[b.k]&&!publicLifeEmergencyReady007(root,b)))return true;')
rep('online:front.length>0&&(!PUBLICLIFE007[b?.k]','online:front.length>0&&(!COMPLEX014[b?.k]||complexEmergencyReady014(root,b))&&(!PUBLICLIFE007[b?.k]')
rep('function resetEmergency455(){',"function resetEmergency455(){complexEmergencySignature014='';complexFiscalState014=null;")
rep('refreshPublicLifeEmergency007();return civic495;','refreshPublicLifeEmergency007();refreshComplexEmergency014();return civic495;')
rep('if(!caseSet.has(c.caseIdx)||(c.publicLifeStation007', 'if(!caseSet.has(c.caseIdx)||(c.complexStation014&&!complexEmergencyReady014(c.station,tiles[c.station]?.bld))||(c.publicLifeStation007')
rep('station:best.station,type});if(PUBLICLIFE007[','station:best.station,type});if(COMPLEX014[tiles[best.station]?.bld?.k])arr[arr.length-1].complexStation014=true;if(PUBLICLIFE007[')
# Reversible staffed coverage stamps never apply budget twice.
rep('function covFieldOfK(k){','function covFieldOfK(k){if(COMPLEX014[k])return COMPLEX014[k].coverage;')
rep('&&!MUSEUM010[rb.k]&&!THEATRE013[rb.k])','&&!MUSEUM010[rb.k]&&!THEATRE013[rb.k]&&!COMPLEX014[rb.k])')
rep('&&!MUSEUM010[bk]&&!THEATRE013[bk])','&&!MUSEUM010[bk]&&!THEATRE013[bk]&&!COMPLEX014[bk])')
after('  if(theatreCovRoots013.size)refreshTheatreCoverage013([...theatreCovRoots013.keys()]);','  if(complexCovRoots014.size)refreshComplexCoverage014([...complexCovRoots014.keys()]);refreshComplexEmergency014();')
rep('museumCovRoots010.clear();theatreCovRoots013.clear();','museumCovRoots010.clear();theatreCovRoots013.clear();complexCovRoots014.clear();')
rep('const f=covFieldOfK(b.k);if(THEATRE013[b.k]){','const f=covFieldOfK(b.k);if(COMPLEX014[b.k]){if(complexCoverageReady014(idx(x,y),b)){const radius=complexCoverageRadius014(COMPLEX014[b.k]);stampComplexCoverage014(idx(x,y),f,radius,1);complexCovRoots014.set(idx(x,y),{field:f,radius});}}else if(THEATRE013[b.k]){')
after('for(const q of Object.values(THEATRE013))TOOL_COV459[q.id]=q.coverage;','for(const q of Object.values(COMPLEX014))if(q.coverage)TOOL_COV459[q.id]=q.coverage;')
rep('function placementCoverage459(id){',"function placementCoverage459(id){if(COMPLEX_TOOL014[id]){const q=COMPLEX_TOOL014[id];return q.coverage?{field:q.coverage,r:complexCoverageRadius014(q)}:null;}")
rep('const FISCAL_PUBLIC_ASSET_META515=Object.freeze({',"const FISCAL_PUBLIC_ASSET_META515=Object.freeze({\n  ...Object.fromEntries(Object.values(COMPLEX014).filter(q=>q.role!=='housing').map(q=>[q.k,{family:q.role==='fire'?'emergency':q.role==='education'?'education':'culture',cost:q.cost}])),")
# Existing construction, weather, rotation and occlusion stay authoritative.
rep('||MUSEUM010[b.k]||THEATRE013[b.k])continue;','||MUSEUM010[b.k]||THEATRE013[b.k]||COMPLEX014[b.k])continue;')
rep('&&!MUSEUM010[bd.k]&&!THEATRE013[bd.k]&&nightDepth>0.55','&&!MUSEUM010[bd.k]&&!THEATRE013[bd.k]&&!COMPLEX014[bd.k]&&nightDepth>0.55')
rep('theatreObjects013(objs,sxOf,syOf,vis,lodFar);','theatreObjects013(objs,sxOf,syOf,vis,lodFar);complexObjects014(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.theatreModule013){','    if(o.complexModule014){complexModuleDraw014(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.theatreModule013){')
rep('||(!window.__noTheatreArt013&&cam.z>=lodFarZ648()&&theatreTheme013(tiles[i])))continue;','||(!window.__noTheatreArt013&&cam.z>=lodFarZ648()&&theatreTheme013(tiles[i]))||(!window.__noComplexArt014&&cam.z>=lodFarZ648()&&complexTheme014(tiles[i])))continue;')
rep('  theatreSelftest013,theatreSpecs013,theatreAt013,theatreEvidence013,','  complexSelftest014,complexSpecs014,complexAt014,complexEvidence014,complexFiscal014,\n  theatreSelftest013,theatreSpecs013,theatreAt013,theatreEvidence013,')
# Protect complete prior modules, old test sources, save and T724 cold topology.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('const RESIDENTIAL_SPEC_ROWS006=','const RESIDENTIAL_TOOL006='),('const PUBLICLIFE_SPEC_ROWS007=','const PUBLICLIFE_TOOL007='),('const STREETLIFE009=','const STREETLIFE_TOOL009='),('const MUSEUM010=','const MUSEUM_TOOL010='),('const RIVERSIDE012=','const RIVERSIDE_TOOL012='),('const THEATRE013=','const THEATRE_TOOL013=')]:
 assert base.split(start,1)[1].split(end,1)[0]==s.split(start,1)[1].split(end,1)[0],start
for name in ['britishSelftest004','highStreetSelftest005','residentialSelftest006','publicLifeSelftest007','stationSelftest008','streetLifeSelftest009','museumSelftest010','riversideSelftest012','theatreSelftest013','residentialKind006','residentialBuilt006','residentialOperational006','activeMobilitySave502','activeMobilityLoad502']:
 marker='function '+name+'(';assert marker+base.split(marker,1)[1].split('\nfunction ',1)[0].rstrip() in s,name
cold='const __load515=load;load=function(slot){const ok=__load515(slot);if(ok){fiscal515.lastDay=-1;fiscalStep515(false,false);try{observatoryStep514(true);}catch(_e){}if(!window.__noColdLoadPower011)markPowerDirty450();}return ok;};'
assert cold in base and cold in s,'T724 cold-load topology changed'
for key in ['GAME_VER','GAME_ANCHOR']:assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s),key
assert src.read_text()==base,'Input changed during assembly'
out.write_text(s)
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'outputSHA256':hashlib.sha256(s.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
