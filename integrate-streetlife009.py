#!/usr/bin/env python3
"""GPT-009 static integration only; never executes the game. Immutable input."""
import argparse, hashlib, json, pathlib
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if 'const STREETLIFE009=' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor {n} != {count}: {old[:130]}')
 s=s.replace(old,new);audit.append({'anchor':old[:110],'count':n})
game=(P/'streetlife-gameplay009.js').read_text();early,late=game.split('/* GPT-009 LATE NATIVE HOOKS */',1)
art=(P/'british-streetlife-art009.js').read_text()
rep('<!-- GPT-008 native station art BEGIN: source british-station-art008.js -->','<!-- GPT-009 native street-life art BEGIN: source british-streetlife-art009.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-009 native street-life art END -->\n<!-- GPT-008 native station art BEGIN: source british-station-art008.js -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||PUBLICLIFE007[k]||null;','return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||PUBLICLIFE007[k]||STREETLIFE009[k]||null;')
rep('const drawPath643=(src=>','/* GPT-009 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installPublicLifeArt007();installStationArt008(); // GPT-004','installPublicLifeArt007();installStationArt008();installStreetLifeArt009(); // GPT-004')
# Native catalog, fiscal payment, transaction snapshots, root/ref and demolition.
rep('const TOOLS=[',"const TOOLS=[\n  ...Object.values(STREETLIFE009).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:'$'+q.cost,unlockRank:q.rank})),")
rep('for(const q of Object.values(PUBLICLIFE007)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(PUBLICLIFE007)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}\nfor(const q of Object.values(STREETLIFE009)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(STREETLIFE_TOOL009[toolId])return canPlaceStreetLife009(STREETLIFE_TOOL009[toolId],x,y);')
rep('const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId];','const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId]||STREETLIFE_TOOL009[toolId];')
cases="case 'stationHotel009':case 'refreshmentCafe009':case 'stationNewsstand009':"
rep("    case 'britishTerrace':case 'foxFinchPub':case 'edwardianLibrary':c=BRITISH_TOOL004[toolId].cost;break;",'    '+cases+"c=STREETLIFE_TOOL009[toolId].cost;break;\n    case 'britishTerrace':case 'foxFinchPub':case 'edwardianLibrary':c=BRITISH_TOOL004[toolId].cost;break;")
rep("    case 'britishTerrace':case 'foxFinchPub':case 'edwardianLibrary':{",'    '+cases+'''{
      const q=STREETLIFE_TOOL009[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false});markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;break;}
    case 'britishTerrace':case 'foxFinchPub':case 'edwardianLibrary':{''')
rep('function toolHint434(t){',"function toolHint434(t){\n  if(t&&(STREETLIFE_TOOL009[t.id]||STREETLIFE_PATH009[t.id]))return streetLifeDescription009(STREETLIFE_TOOL009[t.id]||STREETLIFE_PATH009[t.id]);")
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !((STREETLIFE_TOOL009[t.id]||STREETLIFE_PATH009[t.id])&&window.__noStreetLife009)&&')
rep('function toolSize458(id){',"function toolSize458(id){\n  const sl009=STREETLIFE_TOOL009[typeof id==='object'?id?.id:id];if(sl009)return sl009.sz;")
rep('for(const q of Object.values(PUBLICLIFE007))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(PUBLICLIFE007))MAYOR_MANUAL_ONLY470A.add(q.id);\nfor(const q of Object.values(STREETLIFE009))MAYOR_MANUAL_ONLY470A.add(q.id);')
rep('for(const q of Object.values(PUBLICLIFE007))MSZ[q.k]=q.sz;','for(const q of Object.values(PUBLICLIFE007))MSZ[q.k]=q.sz;\nfor(const q of Object.values(STREETLIFE009))MSZ[q.k]=q.sz;')
rep('if(PUBLICLIFE007[k])Object.assign(tiles[i].bld,{lv:1,v:0,pw:false,wa:false});','if(PUBLICLIFE007[k])Object.assign(tiles[i].bld,{lv:1,v:0,pw:false,wa:false});\n        if(STREETLIFE009[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});')
rep('    else if(PUBLICLIFE007[b.k])html=', '    else if(STREETLIFE009[b.k])html=streetLifeInspect009(idx(x,y),b);\n    else if(PUBLICLIFE007[b.k])html=')
rep('function insMetrics461(x,y,b,html){',"function insMetrics461(x,y,b,html){if(STREETLIFE009[b.k]){const q=STREETLIFE009[b.k],root=idx(x,y),e=enterpriseRootInfo489(root),on=streetLifeOperational009(root,b);return [{k:'有效職位',v:(on?e?.activePositions||0:0)+' / '+q.jobs,u:'私營職位'},{k:'實際聘用',v:on?e?.employed||0:0,u:'原生企業人力'},{k:q.beds?'開放床位':'維護',v:q.beds?streetLifeBedsAt009(root,b)+' / '+q.beds:'$0',u:q.beds?'原生旅宿帳':'／日'},{k:'等級',v:'固定 Lv.1',u:q.sz+'×'+q.sz}];}")
# Physical utilities. Old branches are unchanged; commercial profiles apply only
# to the new kinds. Hotel uses the existing general overnight load profile.
rep('if(PUBLICLIFE007[k])return PUBLICLIFE007[k].power;','if(STREETLIFE009[k])return STREETLIFE009[k].power;if(PUBLICLIFE007[k])return PUBLICLIFE007[k].power;')
rep('function powerProfile471(b){','function powerProfile471(b){\n  if(streetLifeRetail009(b.k))return [1.28,.84,.34];')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(streetLifeKind009(k))return 2;')
rep('for(const q of Object.values(PUBLICLIFE007))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(PUBLICLIFE007))WATER_LOAD472.special[q.k]=q.water;\nfor(const q of Object.values(STREETLIFE009))WATER_LOAD472.special[q.k]=q.water;')
rep('function waterProfile472(b){','function waterProfile472(b){if(streetLifeRetail009(b.k))return WATER_PROFILE472.commercial;')
rep('function wastewaterReturn472(b){if(!b)return 0;','function wastewaterReturn472(b){if(!b)return 0;if(streetLifeKind009(b.k))return WASTEWATER_RETURN472.commercial;')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(streetLifeKind009(b.k))return 2;')
rep('function isSanClient445(k){return ','function isSanClient445(k){return streetLifeKind009(k)||')
rep('HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]))b.age++;','HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]))b.age++;')
rep('if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k]&&!PUBLICLIFE007[b.k])b.age++;','if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k]&&!PUBLICLIFE007[b.k]&&!STREETLIFE009[b.k])b.age++;')
rep('refreshPublicLifeUtilities007();refreshPublicLifeCoverage007();stationUtilities008();stationDaily008();','refreshPublicLifeUtilities007();refreshPublicLifeCoverage007();stationUtilities008();stationDaily008();refreshStreetLifeUtilities009();')
# Exclude the new types from native speculative night-commerce area bonuses,
# just like prior explicitly staffed British retail. No fictional night jobs.
rep('if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
# Reuse native private enterprises and business-cycle hiring. No new workers.
rep("for(const q of Object.values(RESIDENTIAL006))if(q.jobs)ENTERPRISE_CORE_K489.add(q.k);","for(const q of Object.values(RESIDENTIAL006))if(q.jobs)ENTERPRISE_CORE_K489.add(q.k);\nfor(const q of Object.values(STREETLIFE009))ENTERPRISE_CORE_K489.add(q.k);")
rep('function enterpriseGroupOf489(b){if(!b||b.ref)return null;','function enterpriseGroupOf489(b){if(!b||b.ref)return null;if(streetLifeKind009(b.k))return\'commercial\';')
rep('const k=b.k|0;if(RESIDENTIAL006[k])return RESIDENTIAL006[k].jobs;','const k=b.k|0;if(STREETLIFE009[k])return STREETLIFE009[k].jobs;if(RESIDENTIAL006[k])return RESIDENTIAL006[k].jobs;')
rep('k=b&&b.k|0;if(residentialCommerce006(k))','k=b&&b.k|0;if(streetLifeKind009(k))return streetLifeOperational009(root,b)?p:0;if(residentialCommerce006(k))')
rep('function enterpriseWaterFactor489(root,b){if(!b)return 0;','function enterpriseWaterFactor489(root,b){if(!b)return 0;if(streetLifeKind009(b.k))return streetLifeWaterFactor009(root,b);')
rep('function enterpriseRoadFactor489(root,b){if(!b)return 0;','function enterpriseRoadFactor489(root,b){if(!b)return 0;if(streetLifeKind009(b.k))return britishRoad004(root)?1:0;')
rep('hardOffline=(residentialCommerce006(k)','hardOffline=(streetLifeKind009(k)&&!streetLifeOperational009(root,b))||(residentialCommerce006(k)')
rep('(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k)))rcC+=a','(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k)||streetLifeKind009(b.k)))rcC+=a')
rep('(r.k===2||r.k===220||highStreetCommerce005(r.k)||residentialCommerce006(r.k)))rcCE+=r.employed','(r.k===2||r.k===220||highStreetCommerce005(r.k)||residentialCommerce006(r.k)||streetLifeKind009(r.k)))rcCE+=r.employed')
rep('if(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k))rcC+=ent;','if(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k)||streetLifeKind009(b.k))rcC+=ent;')
rep('if(b&&!b.ref&&(highStreetCommerce005(b.k)||residentialCommerce006(b.k)))jobsC+=','if(b&&!b.ref&&(highStreetCommerce005(b.k)||residentialCommerce006(b.k)||streetLifeKind009(b.k)))jobsC+=')
rep('highStreetRetailUnits005()+residentialRetailUnits006();','highStreetRetailUnits005()+residentialRetailUnits006()+streetLifeRetailUnits009();')
# Staff-scaled lodging contributes to T330/T334 once; no separate revenue path.
rep('hotelBeds=gh330*8+ht330*40+rs330*110+hs340*14;','hotelBeds=gh330*8+ht330*40+rs330*110+hs340*14+streetLifeBeds009();')
rep('    else if(PUBLICLIFE007[b.k]); // GPT-007:', '    else if(STREETLIFE009[b.k]&&(b.k===274||!streetLifeOperational009(i,b))); // GPT-009: lodging revenue only; no unfinished/offline or industrial fallback\n    else if(PUBLICLIFE007[b.k]); // GPT-007:')
rep('else if(b.k===2||b.k===220||highStreetCommerce005(b.k)){const bx=','else if(b.k===2||b.k===220||highStreetCommerce005(b.k)||streetLifeRetail009(b.k)){const bx=')
rep('const v2=(highStreetCommerce005(b.k)?HIGHSTREET005[b.k].jobs:','const v2=(streetLifeRetail009(b.k)?STREETLIFE009[b.k].jobs:highStreetCommerce005(b.k)?HIGHSTREET005[b.k].jobs:')
# Native work/shopping capacities and cosmetic citizen assignments.
rep('function activityCapacity491(root,b){',"function activityCapacity491(root,b){\n  if(b&&!b.ref&&streetLifeKind009(b.k)){const on=streetLifeOperational009(root,b),e=enterpriseRootInfo489(root),ent=on&&e?.k===b.k?Math.max(0,e.activePositions||0):0,staff=on&&e?.k===b.k?Math.max(0,e.employed||0):0;return{work:ent,enterpriseJobs:ent,publicJobs:0,shopping:streetLifeRetail009(b.k)?staff*2.15:0,education:0,services:0,leisure:0,parking:0};}")
rep('(residentialCommerce006(jb.k)&&residentialOperational006(idx(jx,jy),jb)))','(residentialCommerce006(jb.k)&&residentialOperational006(idx(jx,jy),jb))||(streetLifeKind009(jb.k)&&streetLifeOperational009(idx(jx,jy),jb)))',2)
rep('(jb.k===220||highStreetCommerce005(jb.k)||residentialCommerce006(jb.k))?2:jb.k','(jb.k===220||highStreetCommerce005(jb.k)||residentialCommerce006(jb.k)||streetLifeKind009(jb.k))?2:jb.k',2)
rep('wb.k!==220&&!highStreetCommerce005(wb.k)&&!residentialCommerce006(wb.k))','wb.k!==220&&!highStreetCommerce005(wb.k)&&!residentialCommerce006(wb.k)&&!streetLifeKind009(wb.k))')
rep('||(residentialCommerce006(wb.k)&&!residentialOperational006(c.work,wb))','||(residentialCommerce006(wb.k)&&!residentialOperational006(c.work,wb))||(streetLifeKind009(wb.k)&&!streetLifeOperational009(c.work,wb))')
rep('if(b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k])){const r=sanRoadSeeds445','if(b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k])){const r=sanRoadSeeds445')
# Same native renderer, construction, lighting compositor and weather layers.
rep('  stationObjects008(objs,sxOf,syOf,vis,lodFar);','  stationObjects008(objs,sxOf,syOf,vis,lodFar);streetLifeObjects009(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.stationModule008){','    if(o.streetLifeModule009){streetLifeModuleDraw009(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.stationModule008){')
rep("if(stationTheme008(tiles[i]))continue;const x=i%N,y=(i/N)|0,sx=_sx413","if(stationTheme008(tiles[i])||(!window.__noStreetLifeArt009&&cam.z>=lodFarZ648()&&streetLifeTheme009(tiles[i])))continue;const x=i%N,y=(i/N)|0,sx=_sx413")
rep('  stationSelftest008,stationDistrictAt008,stationEvidence008,','  streetLifeSelftest009,streetLifeSpecs009,streetLifeAt009,streetLifeEvidence009,\n  stationSelftest008,stationDistrictAt008,stationEvidence008,')
# Product source never changes release metadata, existing art, old selftests,
# or either bounded legacy registry.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('/* GPT-005 resident smoke:','window.GV =')]:
 if start in base and end in base.split(start,1)[1]:assert base.split(start,1)[1].split(end,1)[0]==s.split(start,1)[1].split(end,1)[0]
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'outputSHA256':hashlib.sha256(s.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
