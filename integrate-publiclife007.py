#!/usr/bin/env python3
"""GPT-007 count-checked integration from an immutable base to a separate candidate.
No game execution, no index write. Parent embeds the standalone art script.
"""
import argparse,hashlib,json,pathlib
P=pathlib.Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--input',required=True);ap.add_argument('--output',required=True);a=ap.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if out.resolve()==src.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Refusing in-place product write; use a distinct candidate output')
base=src.read_text();s=base;audit=[]
if 'const PUBLICLIFE007=' in s:raise SystemExit('Public-life integration already present')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor count {n} != {count}: {old[:140]}')
 s=s.replace(old,new);audit.append({'anchor':old[:100],'count':n})
def after(old,new,count=1):rep(old,old+'\n'+new,count)
rows=json.loads((P/'publiclife-specs007.json').read_text())
assert [q['k'] for q in rows]==list(range(262,274)) and all(q['jobs']>0 and q['baseK'] not in [42,99] for q in rows)
assert [q['sz'] for q in rows]==[3,3,2,3,3,3,3,2,3,2,2,3]
registry='const PUBLICLIFE_SPEC_ROWS007=Object.freeze('+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+'.map(Object.freeze));\n'
rep('function britishSpec004(k){',registry+(P/'publiclife-gameplay007.js').read_text()+'\nfunction britishSpec004(k){')
rep('return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||null;','return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||PUBLICLIFE007[k]||null;')
after('for(const q of Object.values(RESIDENTIAL006)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(PUBLICLIFE007)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('const TOOLS=[','const TOOLS=[\n  ...Object.values(PUBLICLIFE007).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:\'$\'+q.cost,unlockRank:q.rank})),')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(PUBLICLIFE_TOOL007[toolId])return canPlacePublicLife007(PUBLICLIFE_TOOL007[toolId],x,y);')
rep('const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId];','const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId];')
cases=''.join("case '%s':"%q['id'] for q in rows)
anchor="    case 'coOpStores':case 'stoneBakehouse':case 'coveredMarket':case 'boardSchool':case 'cottageSurgery':case 'highStreetPost':case 'municipalBaths':case 'villageHall':"
rep(anchor+'c=HIGHSTREET_TOOL005[toolId].cost;break;','    '+cases+'c=PUBLICLIFE_TOOL007[toolId].cost;break;\n'+anchor+'c=HIGHSTREET_TOOL005[toolId].cost;break;')
rep(anchor+'{','    '+cases+'''{
      const q=PUBLICLIFE_TOOL007[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false});markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;markEmergencyDirty455();break;}
'''+anchor+'{')
# New roots own every stamp. Native doze must never unstamp an unbuilt or already
# removed public-life root, especially overlapping native police/fire coverage.
rep('if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k])','if(cf&&rb.k!==221&&!HIGHSTREET005[rb.k]&&!PUBLICLIFE007[rb.k])')
rep('if(cf&&!HIGHSTREET005[bk])','if(cf&&!HIGHSTREET005[bk]&&!PUBLICLIFE007[bk])')
after('  if(highStreetCovRoots005.size)refreshHighStreetCoverage005([...highStreetCovRoots005.keys()]);','  if(publicLifeCovRoots007.size)refreshPublicLifeCoverage007([...publicLifeCovRoots007.keys()]);')
# All-footprint electrical carrier discovery and physical supply caps reuse the
# bounded britishSpec004 union. No legacy identity is relabelled.
rep('if(RESIDENTIAL006[k])return RESIDENTIAL006[k].power;','if(PUBLICLIFE007[k])return PUBLICLIFE007[k].power;if(RESIDENTIAL006[k])return RESIDENTIAL006[k].power;')
rep('const k=highStreetBaseK005(b.k);','const k=publicLifeBaseK007(highStreetBaseK005(b.k));',4)
rep('k=highStreetBaseK005(k);if([10,12','k=publicLifeBaseK007(highStreetBaseK005(k));if([10,12')
after('for(const q of Object.values(RESIDENTIAL006))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(PUBLICLIFE007))WATER_LOAD472.special[q.k]=q.water;')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(PUBLICLIFE007[b.k])return waterCriticalTier472({k:publicLifeBaseK007(b.k)});')
rep('function covFieldOfK(k){','function covFieldOfK(k){if(PUBLICLIFE007[k])return PUBLICLIFE007[k].coverage||null;')
rep('britishCovRoots004.clear();highStreetCovRoots005.clear();','britishCovRoots004.clear();highStreetCovRoots005.clear();publicLifeCovRoots007.clear();')
rep('const f=covFieldOfK(b.k);if(f&&(b.k!==221','const f=covFieldOfK(b.k);if(PUBLICLIFE007[b.k]){if(f&&publicLifeOperational007(idx(x,y),b)){const radius=publicLifeCoverageRadius007(PUBLICLIFE007[b.k]);stampPublicLifeCoverage007(idx(x,y),f,radius,1);publicLifeCovRoots007.set(idx(x,y),{field:f,radius});}}else if(f&&(b.k!==221')
# Construction has one early, new-only age increment; existing order stays exact.
rep('b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]))b.age++;','b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k]))b.age++;')
after('  refreshHighStreetUtilities005();refreshHighStreetCoverage005();','  refreshPublicLifeUtilities007();refreshPublicLifeCoverage007();')
rep('if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k])b.age++;','if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k]&&!PUBLICLIFE007[b.k])b.age++;')
rep('if(!b||b.ref||HIGHSTREET005[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
after('  const highStreetDaily005={publicJobs:highStreetPublicJobs005(),upkeep:highStreetUpkeep005()};','  const publicLifeDaily007={publicJobs:publicLifePublicJobs007(),upkeep:publicLifeUpkeep007()};')
rep('jobs+=highStreetDaily005.publicJobs;','jobs+=highStreetDaily005.publicJobs+publicLifeDaily007.publicJobs;')
rep('upkeep+=highStreetDaily005.upkeep;','upkeep+=highStreetDaily005.upkeep+publicLifeDaily007.upkeep;')
rep('    else if(HIGHSTREET005[b.k]&&(!highStreetCommerce005(b.k)||!highStreetOperational005(i,b)));','    else if(PUBLICLIFE007[b.k]); // GPT-007: public-only; never commercial or phantom industrial tax\n    else if(HIGHSTREET005[b.k]&&(!highStreetCommerce005(b.k)||!highStreetOperational005(i,b)));')
# T491/T495 are the one employment, commute and public-service authority.
after("for(const q of Object.values(HIGHSTREET005))if(q.role!=='commerce'){PUBLIC_JOBS491[q.k]=q.jobs;if(q.seats)EDUCATION_CAP491[q.k]=q.seats;}",'for(const q of Object.values(PUBLICLIFE007)){PUBLIC_JOBS491[q.k]=q.jobs;if(q.seats)EDUCATION_CAP491[q.k]=q.seats;}')
after('for(const q of Object.values(HIGHSTREET005)){if(q.services)SERVICE_CAP491[q.k]=q.services;if(q.leisure)LEISURE_BASE491[q.k]=q.leisure;}','for(const q of Object.values(PUBLICLIFE007)){if(q.services)SERVICE_CAP491[q.k]=q.services;if(q.leisure)LEISURE_BASE491[q.k]=q.leisure;}')
rep('function publicJobCapacity491(b){','function publicJobCapacity491(b){if(b&&PUBLICLIFE007[b.k])return publicLifeBuilt007(b)?PUBLICLIFE007[b.k].jobs:0;')
rep('if(!b||b.ref)return null;if((RESIDENTIAL006[b.k]','if(!b||b.ref)return null;if((PUBLICLIFE007[b.k]&&!publicLifeOperational007(root,b))||(RESIDENTIAL006[b.k]')
rep('(LEISURE_BASE491[b.k]||0)*(HIGHSTREET005[b.k]?highStreetCapacityFactor005(root,b):av493)','(LEISURE_BASE491[b.k]||0)*(PUBLICLIFE007[b.k]?publicLifeCapacityFactor007(root,b):HIGHSTREET005[b.k]?highStreetCapacityFactor005(root,b):av493)')
after('for(const q of Object.values(HIGHSTREET005)){if(q.beds)CIVIC_HEALTH_BEDS495[q.k]=q.beds;if(q.seats)CIVIC_EDU_SEATS495[q.k]=q.seats;}','for(const q of Object.values(PUBLICLIFE007))if(q.seats)CIVIC_EDU_SEATS495[q.k]=q.seats;')
after('const CIVIC_FIRE_K495=new Set([6,30,61]),CIVIC_POLICE_K495=new Set([11,52]);',"for(const q of Object.values(PUBLICLIFE007)){if(q.role==='fire')CIVIC_FIRE_K495.add(q.k);if(q.role==='police')CIVIC_POLICE_K495.add(q.k);}")
rep('function civicFactors495(root,b){','function civicFactors495(root,b){\n  if(b&&PUBLICLIFE007[b.k])return publicLifeFactors007(root,b);')
rep('function publicActivePositions495(root,b){','function publicActivePositions495(root,b){if(b&&PUBLICLIFE007[b.k]&&!publicLifeOperational007(root,b))return 0;')
rep('function publicServiceCapacityForMobility495(root,b,type){','function publicServiceCapacityForMobility495(root,b,type){if(b&&PUBLICLIFE007[b.k]&&!publicLifeOperational007(root,b))return 0;')
# Only new roots can dirty emergency eligibility here; old-only worlds no-op.
rep('performance:{roots:rows.length},saveSchemaChanged:false};return civic495;','performance:{roots:rows.length},saveSchemaChanged:false};refreshPublicLifeEmergency007();return civic495;')
rep('let f=HIGHSTREET005[b.k]?0:1;try{f=HIGHSTREET005[b.k]?highStreetCapacityFactor005(root,b):','let f=(HIGHSTREET005[b.k]||PUBLICLIFE007[b.k])?0:1;try{f=PUBLICLIFE007[b.k]?publicLifeCapacityFactor007(root,b):HIGHSTREET005[b.k]?highStreetCapacityFactor005(root,b):')
rep('[7,108].includes(highStreetBaseK005(b.k))','[7,108].includes(publicLifeBaseK007(highStreetBaseK005(b.k)))')
rep('else if([32,113,138].includes(b.k))schoolEnv','else if([32,113,138].includes(publicLifeBaseK007(b.k)))schoolEnv')
# Native public assets, incident availability and emergency routing retain new IDs.
after("for(const q of Object.values(HIGHSTREET005))if(q.role==='health')CRITICAL_SERVICE_K492.add(q.k);","for(const q of Object.values(PUBLICLIFE007))if(CRITICAL_SERVICE_K492.has(q.baseK))CRITICAL_SERVICE_K492.add(q.k);")
rep('function emergencyStationType455(k){return','function emergencyStationType455(k){k=publicLifeBaseK007(k);return')
rep("ks.includes(b.k)&&assetAvailability493(i,'services')>.15","(ks.includes(b.k)||(PUBLICLIFE007[b.k]&&emergencyStationType455(b.k)===type&&publicLifeEmergencyReady007(i,b)))&&assetAvailability493(i,'services')>.15")
rep('if(!b||b.ref||emergencyStationType455(b.k)!==type)return true;','if(!b||b.ref||emergencyStationType455(b.k)!==type||(PUBLICLIFE007[b.k]&&!publicLifeEmergencyReady007(root,b)))return true;')
rep('type,root,online:front.length>0,frontage:front.length','type,root,online:front.length>0&&(!PUBLICLIFE007[b?.k]||publicLifeEmergencyReady007(root,b)),frontage:front.length')
# Addition after staffing changes and removal/incident loss also invalidate cached fields.
rep('function resetEmergency455(){emergencyDirty455=true;','function resetEmergency455(){publicLifeEmergencySignature007=\'\';emergencyDirty455=true;')
# Vehicle records preserve their real station root. Cancel only new-source vehicles
# if that exact station loses service; never change any legacy dispatch record.
# Record a bounded flag separately so no old dispatch object receives a new property.
rep('station:best.station,type});inflight.add(best.caseIdx);','station:best.station,type});if(PUBLICLIFE007[tiles[best.station]?.bld?.k])arr[arr.length-1].publicLifeStation007=true;inflight.add(best.caseIdx);')
rep('if(!caseSet.has(c.caseIdx)){arr.splice(i,1);continue;}inflight.add(c.caseIdx);','if(!caseSet.has(c.caseIdx)||(c.publicLifeStation007&&!publicLifeEmergencyReady007(c.station,tiles[c.station]?.bld))){arr.splice(i,1);continue;}inflight.add(c.caseIdx);')
# Aggregate public commuting is owned by T491/T495; individual c.work logic remains native.
rep('b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k])){const r=sanRoadSeeds445','b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]||PUBLICLIFE007[b.k])){const r=sanRoadSeeds445')
# Registry, metadata, normal UI and canonical save identities.
after('for(const q of Object.values(RESIDENTIAL006))MSZ[q.k]=q.sz;','for(const q of Object.values(PUBLICLIFE007))MSZ[q.k]=q.sz;')
rep('        if(HIGHSTREET005[k]){tiles[i].bld.lv=1;','        if(PUBLICLIFE007[k])Object.assign(tiles[i].bld,{lv:1,v:0,pw:false,wa:false});\n        if(HIGHSTREET005[k]){tiles[i].bld.lv=1;')
after('for(const q of Object.values(RESIDENTIAL006))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(PUBLICLIFE007))MAYOR_MANUAL_ONLY470A.add(q.id);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&&!(PUBLICLIFE_TOOL007[t.id]&&window.__noPublicLife007)&&')
rep("const hs=HIGHSTREET_TOOL005[typeof id==='object'?id?.id:id]||RESIDENTIAL_TOOL006[typeof id==='object'?id?.id:id];","const hs=PUBLICLIFE_TOOL007[typeof id==='object'?id?.id:id]||HIGHSTREET_TOOL005[typeof id==='object'?id?.id:id]||RESIDENTIAL_TOOL006[typeof id==='object'?id?.id:id];")
rep('function catalogSection458(t){const hs=HIGHSTREET_TOOL005[t.id];','function catalogSection458(t){const hs=PUBLICLIFE_TOOL007[t.id]||HIGHSTREET_TOOL005[t.id];')
rep("(RESIDENTIAL_TOOL006[t.id]?RESIDENTIAL_TOOL006[t.id].en+' '","(PUBLICLIFE_TOOL007[t.id]?PUBLICLIFE_TOOL007[t.id].keywords:RESIDENTIAL_TOOL006[t.id]?RESIDENTIAL_TOOL006[t.id].en+' '")
rep('  if(t&&RESIDENTIAL_TOOL006[t.id])return','  if(t&&PUBLICLIFE_TOOL007[t.id])return publicLifeDescription007(PUBLICLIFE_TOOL007[t.id]);\n  if(t&&RESIDENTIAL_TOOL006[t.id])return')
rep('    else if(RESIDENTIAL006[b.k])html=','    else if(PUBLICLIFE007[b.k])html=publicLifeInspect007(idx(x,y),b);\n    else if(RESIDENTIAL006[b.k])html=')
rep('function insMetrics461(x,y,b,html){','function insMetrics461(x,y,b,html){if(PUBLICLIFE007[b.k])return publicLifeMetrics007(x,y,b);')
after('for(const q of Object.values(HIGHSTREET005))if(q.coverage)TOOL_COV459[q.id]=q.coverage;','for(const q of Object.values(PUBLICLIFE007))if(q.coverage)TOOL_COV459[q.id]=q.coverage;')
rep('function placementCoverage459(id){','function placementCoverage459(id){if(PUBLICLIFE_TOOL007[id])return {field:PUBLICLIFE_TOOL007[id].coverage,r:publicLifeCoverageRadius007(PUBLICLIFE_TOOL007[id])};')
# Fixed sprites own authored lighting; no generic night fixtures over their roofs.
rep("||b.k===4||b.k===221||HIGHSTREET005[b.k])continue;","||b.k===4||b.k===221||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k])continue;")
rep("bd.k!==221&&!HIGHSTREET005[bd.k]&&nightDepth>0.55","bd.k!==221&&!HIGHSTREET005[bd.k]&&!PUBLICLIFE007[bd.k]&&nightDepth>0.55")
rep('installHighStreetArt005();installResidentialArt006();','installHighStreetArt005();installResidentialArt006();installPublicLifeArt007();')
# Explicit asset authority: root scan, capital ledger and lifecycle backlog use
# locked replacement values; no synthetic second treasury or generic tax multiplier.
rep('const FISCAL_PUBLIC_ASSET_META515=Object.freeze({',"const FISCAL_PUBLIC_ASSET_META515=Object.freeze({\n  ...Object.fromEntries(Object.values(PUBLICLIFE007).map(q=>[q.k,{family:q.role==='fire'?'emergency':q.role==='police'?'police':q.role==='education'?'education':q.baseK===115||q.baseK===43?'administration':q.coverage==='park'||q.coverage==='stadium'?'parks':'culture',cost:q.cost}])),")
# Guarded QA functions are appended without altering old guard contents.
rep('/* GPT-006 read-only resident smoke;', (P/'publiclife-selftest007.js').read_text()+'\n'+(P/'publiclife-gameplay-probe007.js').read_text()+'\n/* GPT-006 read-only resident smoke;')
rep('  residentialSelftest006,residentialGameplayProbe006,','  publicLifeSelftest007,publicLifeGameplayProbe007,publicLifeAt007,\n  residentialSelftest006,residentialGameplayProbe006,')
# Strong bounded metadata preservation, including all prior permanent IDs.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('const RESIDENTIAL_SPEC_ROWS006=','const RESIDENTIAL_TOOL006=')]:
 assert base.split(start,1)[1].split(end,1)[0]==s.split(start,1)[1].split(end,1)[0],start
assert src.read_text()==base,'Immutable source changed during assembly'
out.write_text(s)
print(json.dumps({'output':str(out),'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'edits':audit,'newBytes':len(s.encode())},ensure_ascii=False))
