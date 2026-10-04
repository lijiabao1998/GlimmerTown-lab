#!/usr/bin/env python3
"""Deterministic bounded integration; never writes index.html. No game execution.
Usage: python integrate-residential006.py --input index.html --output review006.html
The parent supplies the art script separately. All anchors are count-checked.
"""
import argparse,json,pathlib,re
P=pathlib.Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--input',default=str(P/'index.html'));ap.add_argument('--output',required=True);a=ap.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if out.resolve()==(P/'index.html').resolve() or out.resolve()==src.resolve(): raise SystemExit('Refusing in-place product write; use separate --output')
s=src.read_text();audit=[]
if 'const RESIDENTIAL006=' in s: raise SystemExit('Residential integration already present')
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count: raise SystemExit(f'Anchor count {n} != {count}: {old[:140]}')
 s=s.replace(old,new);audit.append({'anchor':old[:100],'count':n})
rows=json.loads((P/'residential-specs006.json').read_text())
assert [q['k'] for q in rows]==list(range(246,262)) and all(q['kind']=='R' for q in rows)
registry='const RESIDENTIAL_SPEC_ROWS006=Object.freeze('+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+'.map(Object.freeze));\n'
rep('function britishSpec004(k){',registry+(P/'residential-gameplay006.js').read_text()+'\nfunction britishSpec004(k){')
rep('return BRITISH004[k]||HIGHSTREET005[k]||null;','return BRITISH004[k]||HIGHSTREET005[k]||RESIDENTIAL006[k]||null;')
rep('const TOOLS=[','const TOOLS=[\n  ...Object.values(RESIDENTIAL006).map(q=>({id:q.id,cat:q.cat,ic:q.band===\'low\'?\'🏡\':\'🏘️\',nm:q.nm,pr:\'$\'+q.cost,unlockRank:q.rank})),')
rep('for(const q of Object.values(HIGHSTREET005)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(HIGHSTREET005)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}\nfor(const q of Object.values(RESIDENTIAL006)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(RESIDENTIAL_TOOL006[toolId])return canPlaceResidential006(RESIDENTIAL_TOOL006[toolId],x,y);')
rep('const highStreet005=HIGHSTREET_TOOL005[toolId];','const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId];')
cases=''.join("case '%s':"%q['id'] for q in rows)
rep("    case 'coOpStores':case 'stoneBakehouse':case 'coveredMarket':case 'boardSchool':case 'cottageSurgery':case 'highStreetPost':case 'municipalBaths':case 'villageHall':c=HIGHSTREET_TOOL005[toolId].cost;break;",'    '+cases+'c=RESIDENTIAL_TOOL006[toolId].cost;break;\n    '+"case 'coOpStores':case 'stoneBakehouse':case 'coveredMarket':case 'boardSchool':case 'cottageSurgery':case 'highStreetPost':case 'municipalBaths':case 'villageHall':c=HIGHSTREET_TOOL005[toolId].cost;break;")
anchor="    case 'coOpStores':case 'stoneBakehouse':case 'coveredMarket':case 'boardSchool':case 'cottageSurgery':case 'highStreetPost':case 'municipalBaths':case 'villageHall':{"
rep(anchor,'    '+cases+'''{
      const q=RESIDENTIAL_TOOL006[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false,we:q.we,den:q.band==='low'?2:3});
      markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;break;}
'''+anchor)
rep('function housingBand488(b){if(!b||b.ref)return null;','function housingBand488(b){if(!b||b.ref)return null;if(RESIDENTIAL006[b.k])return RESIDENTIAL006[b.k].band;')
rep('function residentCapacity488(b){if(!b||b.ref)return 0;','function residentCapacity488(b){if(!b||b.ref)return 0;if(RESIDENTIAL006[b.k])return RESIDENTIAL006[b.k].capacity;')
rep('function residentEligible488(root,b){if(!b||b.ref)return false;','function residentEligible488(root,b){if(!b||b.ref)return false;if(RESIDENTIAL006[b.k])return residentialOperational006(root,b);')
# Existing inclusive resident readers: add only the bounded new identities.
# Avoid touching either frozen registry, or existing resident selftests/probes.
cut=s.index('/* GPT-005 resident smoke:')
product,tests=s[:cut],s[cut:]
for var in ['b','bb','hb488']:
 old=f'[1,127,33,105,219].includes({var}.k)';n=product.count(old)
 if n: product=product.replace(old,f'housingKind006({var}.k)');audit.append({'anchor':old,'count':n})
s=product+tests
rep('return highStreetCommerce005(k)||k===219||k===220','return residentialKind006(k)||highStreetCommerce005(k)||k===219||k===220')
rep('if(b.k===1||b.k===127||b.k===33||b.k===105||b.k===219)w=','if(housingKind006(b.k))w=')
rep('else if(b.k===219)w=1;','else if(b.k===219||residentialKind006(b.k))w=1;')
rep('if(b.k===1||b.k===33||b.k===105||b.k===127||b.k===219){o.rciRoots++;','if(housingKind006(b.k)){o.rciRoots++;')
rep('if(k===1||k===127||k===219)return [0.68','if(k===1||k===127||k===219||residentialKind006(k))return [0.68')
rep('if(HIGHSTREET005[k])return HIGHSTREET005[k].power;','if(RESIDENTIAL006[k])return RESIDENTIAL006[k].power;if(HIGHSTREET005[k])return HIGHSTREET005[k].power;')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(residentialKind006(k))return 1;')
rep('b.k!==127&&b.k!==219)v*=.95','b.k!==127&&b.k!==219&&!residentialKind006(b.k))v*=.95')
rep('for(const q of Object.values(HIGHSTREET005))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(HIGHSTREET005))WATER_LOAD472.special[q.k]=q.water;\nfor(const q of Object.values(RESIDENTIAL006))WATER_LOAD472.special[q.k]=q.water;')
rep('if(k===1||k===127||k===219)return WATER_PROFILE472.residential','if(k===1||k===127||k===219||residentialKind006(k))return WATER_PROFILE472.residential')
rep('if(k===1||k===127||k===219)return WASTEWATER_RETURN472.residential','if(k===1||k===127||k===219||residentialKind006(k))return WASTEWATER_RETURN472.residential')
rep('if(k===1||k===127||k===219)return.55','if(k===1||k===127||k===219||residentialKind006(k))return.55')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(residentialKind006(b.k))return 1;')
rep('b.k===219||b.k===220||highStreetCommerce005(b.k)))m*=.90','b.k===219||b.k===220||highStreetCommerce005(b.k)||residentialKind006(b.k)))m*=.90')
rep('if(b.k===1||b.k===127||b.k===219)lowPressurePop','if(b.k===1||b.k===127||b.k===219||residentialKind006(b.k))lowPressurePop',2)
rep('for(const q of Object.values(HIGHSTREET005))if(q.role===\'commerce\')ENTERPRISE_CORE_K489.add(q.k);','for(const q of Object.values(HIGHSTREET005))if(q.role===\'commerce\')ENTERPRISE_CORE_K489.add(q.k);\nfor(const q of Object.values(RESIDENTIAL006))if(q.jobs)ENTERPRISE_CORE_K489.add(q.k);')
rep('const k=highStreetBaseK005(b.k|0);','const k=residentialEnterpriseK006(highStreetBaseK005(b.k|0));',2)
rep('const k=highStreetBaseK005(b.k|0),x=root%N','const k=residentialEnterpriseK006(highStreetBaseK005(b.k|0)),x=root%N')
rep('const k=b.k|0;if(highStreetCommerce005(k))return HIGHSTREET005[k].jobs;','const k=b.k|0;if(RESIDENTIAL006[k])return RESIDENTIAL006[k].jobs;if(highStreetCommerce005(k))return HIGHSTREET005[k].jobs;')
rep('k=b&&b.k|0;if(highStreetCommerce005(k))','k=b&&b.k|0;if(residentialCommerce006(k))return residentialOperational006(root,b)?p:0;if(highStreetCommerce005(k))')
rep('hardOffline=(highStreetCommerce005(k)','hardOffline=(residentialCommerce006(k)&&!residentialOperational006(root,b))||(highStreetCommerce005(k)')
rep('(b.k===2||b.k===220||highStreetCommerce005(b.k)))rcC+=a','(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k)))rcC+=a')
rep('(r.k===2||r.k===220||highStreetCommerce005(r.k)))rcCE+=r.employed','(r.k===2||r.k===220||highStreetCommerce005(r.k)||residentialCommerce006(r.k)))rcCE+=r.employed')
rep('if(b.k===2||b.k===220||highStreetCommerce005(b.k))rcC+=ent;','if(b.k===2||b.k===220||highStreetCommerce005(b.k)||residentialCommerce006(b.k))rcC+=ent;')
rep("if(!b||b.ref)return null;if(HIGHSTREET005[b.k]&&!highStreetOperational005(root,b))", "if(!b||b.ref)return null;if((RESIDENTIAL006[b.k]&&!residentialOperational006(root,b))||(HIGHSTREET005[b.k]&&!highStreetOperational005(root,b)))")
rep('if(highStreetCommerce005(b.k))shopping=','if(highStreetCommerce005(b.k)||residentialCommerce006(b.k))shopping=')
rep('c.population+=residentPopulation488(i,b);}else if(ENTERPRISE_CORE_K489.has(b.k))','c.population+=residentPopulation488(i,b);if(residentialCommerce006(b.k)){c.jobRoots++;c.jobs+=enterpriseActualJobs489(i,b,\'employed\');c.comRoots++;}}else if(ENTERPRISE_CORE_K489.has(b.k))')
rep('if(!b||b.ref||HIGHSTREET005[b.k])continue;const', 'if(!b||b.ref||HIGHSTREET005[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
# Complete new-only construction before housing/utility settlement; old-only order is identical.
rep('b&&!b.ref&&HIGHSTREET005[b.k])b.age++;','b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k]))b.age++;')
rep('  housingMarketStep488(); // T488','  const residentialDaily006=tickBld.some(i=>residentialKind006(tiles[i]?.bld?.k));\n  if(!residentialDaily006)housingMarketStep488(); // T488')
rep('refreshHighStreetUtilities005();refreshHighStreetCoverage005();','refreshHighStreetUtilities005();refreshHighStreetCoverage005();\n  refreshResidentialUtilities006();if(residentialDaily006)housingMarketStep488();')
rep('if(!HIGHSTREET005[b.k])b.age++;','if(!HIGHSTREET005[b.k]&&!RESIDENTIAL006[b.k])b.age++;')
rep('b.k!==127&&b.k!==219&&b.k!==220))continue;','b.k!==127&&b.k!==219&&b.k!==220&&!residentialKind006(b.k)))continue;')
rep('if(BRITISH004[b.k]&&!britishBuilt004(b))continue;','if(RESIDENTIAL006[b.k]&&!residentialBuilt006(b))continue;\n    if(BRITISH004[b.k]&&!britishBuilt004(b))continue;')
rep('const near=BRITISH004[b.k]?britishRoad004(si442)','const near=(BRITISH004[b.k]||RESIDENTIAL006[b.k])?britishRoad004(si442)')
rep("if(typeof devApplyUtilityBypass516B==='function')devApplyUtilityBypass516B(si442,b);","if(typeof devApplyUtilityBypass516B==='function')devApplyUtilityBypass516B(si442,b);\n    if(RESIDENTIAL006[b.k]){if(powerLegacy450())b.pw=false;if(waterLegacy449())b.wa=false;}")
rep('if(b.k===1||b.k===127||b.k===219){','if(b.k===1||b.k===127||b.k===219||residentialKind006(b.k)){')
rep('if(b&&!b.ref&&highStreetCommerce005(b.k))jobsC+=','if(b&&!b.ref&&(highStreetCommerce005(b.k)||residentialCommerce006(b.k)))jobsC+=')
rep('nComG284*enterpriseTypeUtilization489(2)+highStreetRetailUnits005();','nComG284*enterpriseTypeUtilization489(2)+highStreetRetailUnits005()+residentialRetailUnits006();')
rep('else if(BRITISH004[b.k]&&(!britishBuilt004(b)', 'else if(RESIDENTIAL006[b.k]){const rt006=residentialTaxes006(i,b,pol||{taxR:1,taxC:1,taxI:1},civicMul,freightTaxMul,goodsMul284,commerceSalesMul481);income+=rt006.residential+rt006.commercial;taxR+=rt006.residential;taxC+=rt006.commercial;}\n    else if(BRITISH004[b.k]&&(!britishBuilt004(b)')
rep('(b.k!==1&&b.k!==219))continue;b.h=', '(b.k!==1&&b.k!==219&&!residentialBuilt006(b)))continue;b.h=')
rep('(b.k!==1&&!(b.k===219&&britishBuilt004(b))))continue;', '(b.k!==1&&!(b.k===219&&britishBuilt004(b))&&!residentialBuilt006(b)))continue;')
rep('(b.k!==1&&b.k!==219)){garbLocal[i]=0;continue;}', '(b.k!==1&&b.k!==219&&!residentialBuilt006(b))){garbLocal[i]=0;continue;}',3)
rep('if(b.k===219){for(const j of sanRoadSeeds445(i))','if(b.k===219||residentialKind006(b.k)){for(const j of sanRoadSeeds445(i))')
rep('(hb.k!==1&&hb.k!==219)||!hb.pw||(hb.k===219&&!residentEligible488(idx(hx,hy),hb))','(hb.k!==1&&hb.k!==219&&!residentialKind006(hb.k))||!hb.pw||((hb.k===219||residentialKind006(hb.k))&&!residentEligible488(idx(hx,hy),hb))')
rep('(hb.k!==1&&hb.k!==219)){citizens.splice(i,1);continue;}', '(hb.k!==1&&hb.k!==219&&!residentialKind006(hb.k))||(residentialKind006(hb.k)&&!residentEligible488(c.home,hb))){citizens.splice(i,1);continue;}')
rep('(highStreetCommerce005(jb.k)&&highStreetOperational005(idx(jx,jy),jb)))','(highStreetCommerce005(jb.k)&&highStreetOperational005(idx(jx,jy),jb))||(residentialCommerce006(jb.k)&&residentialOperational006(idx(jx,jy),jb)))',2)
rep('(jb.k===220||highStreetCommerce005(jb.k))?2:jb.k','(jb.k===220||highStreetCommerce005(jb.k)||residentialCommerce006(jb.k))?2:jb.k',2)
rep('wb.k!==220&&!highStreetCommerce005(wb.k))||(highStreetCommerce005(wb.k)&&!highStreetOperational005(c.work,wb))','wb.k!==220&&!highStreetCommerce005(wb.k)&&!residentialCommerce006(wb.k))||(highStreetCommerce005(wb.k)&&!highStreetOperational005(c.work,wb))||(residentialCommerce006(wb.k)&&!residentialOperational006(c.work,wb))')
rep('if(b&&!b.ref&&HIGHSTREET005[b.k]){const r=sanRoadSeeds445','if(b&&!b.ref&&(HIGHSTREET005[b.k]||RESIDENTIAL006[b.k])){const r=sanRoadSeeds445')
rep('else if(b.k===219&&!b.ref){nR++;popM+=','else if((b.k===219||residentialKind006(b.k))&&!b.ref){nR++;popM+=')
rep('if(b.k===219){res++;lv[1]++;','if(b.k===219||residentialKind006(b.k)){res++;lv[1]++;')
rep('for(const q of Object.values(HIGHSTREET005))MSZ[q.k]=q.sz;','for(const q of Object.values(HIGHSTREET005))MSZ[q.k]=q.sz;\nfor(const q of Object.values(RESIDENTIAL006))MSZ[q.k]=q.sz;')
rep('if(HIGHSTREET005[k]){tiles[i].bld.lv=1;',"if(RESIDENTIAL006[k])Object.assign(tiles[i].bld,{lv:1,v:0,pw:false,wa:false,we:1,den:RESIDENTIAL006[k].band==='low'?2:3});\n        if(HIGHSTREET005[k]){tiles[i].bld.lv=1;")
rep('for(const q of Object.values(HIGHSTREET005))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(HIGHSTREET005))MAYOR_MANUAL_ONLY470A.add(q.id);\nfor(const q of Object.values(RESIDENTIAL006))MAYOR_MANUAL_ONLY470A.add(q.id);')
rep('  if(t&&HIGHSTREET_TOOL005[t.id])return','  if(t&&RESIDENTIAL_TOOL006[t.id])return residentialDescription006(RESIDENTIAL_TOOL006[t.id]);\n  if(t&&HIGHSTREET_TOOL005[t.id])return')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&&!(RESIDENTIAL_TOOL006[t.id]&&window.__noResidential006)&&')
rep("const hs=HIGHSTREET_TOOL005[typeof id==='object'?id?.id:id];","const hs=HIGHSTREET_TOOL005[typeof id==='object'?id?.id:id]||RESIDENTIAL_TOOL006[typeof id==='object'?id?.id:id];")
rep("HIGHSTREET_TOOL005[t.id]?.keywords||extra[t.id]||''","(RESIDENTIAL_TOOL006[t.id]?RESIDENTIAL_TOOL006[t.id].en+' '+RESIDENTIAL_TOOL006[t.id].family+' 英式 英國 英格蘭 住宅 街區':HIGHSTREET_TOOL005[t.id]?.keywords)||extra[t.id]||''")
rep('    else if(HIGHSTREET005[b.k])html=','    else if(RESIDENTIAL006[b.k])html=residentialInspect006(idx(x,y),b);\n    else if(HIGHSTREET005[b.k])html=')
rep('function insMetrics461(x,y,b,html){const q=HIGHSTREET005[b.k];',"function insMetrics461(x,y,b,html){const r006=RESIDENTIAL006[b.k];if(r006){const root=idx(x,y),active=residentialOperational006(root,b);return [{k:'居民',v:residentPopulation488(root,b)+' / '+r006.capacity,u:(r006.band==='low'?'低密度':'中密度')+'容量'},{k:'有效職位',v:Math.round(active?enterpriseActualJobs489(root,b,'positions'):0)+' / '+r006.jobs,u:'名目商業職位'},{k:'維護',v:'$0',u:'／日'},{k:'等級',v:'固定 Lv.1',u:r006.sz+'×'+r006.sz+' · '+districtName(distIdx(x,y))}];}const q=HIGHSTREET005[b.k];")
rep('installHighStreetArt005(); //','installHighStreetArt005();installResidentialArt006(); //')
# QA exposes only bounded read-only smoke and explicitly guarded disposable probe.
rep('/* GPT-005 resident smoke:',(P/'residential-selftest006.js').read_text()+'\n'+(P/'residential-gameplay-probe006.js').read_text()+'\n/* GPT-005 resident smoke:')
rep('  highStreetSelftest005,highStreetGameplayProbe005,','  residentialSelftest006,residentialGameplayProbe006,\n  highStreetSelftest005,highStreetGameplayProbe005,')
# Preserve original full T717/T718 metadata and test sources byte-for-byte.
for marker,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005=')]:
 before=src.read_text().split(marker,1)[1].split(end,1)[0];after=s.split(marker,1)[1].split(end,1)[0];assert before==after
out.write_text(s)
print(json.dumps({'output':str(out),'edits':audit,'newBytes':len(s.encode())},ensure_ascii=False))
