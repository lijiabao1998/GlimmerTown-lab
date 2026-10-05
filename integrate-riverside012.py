#!/usr/bin/env python3
"""GPT-012 static/count-checked integration. Never executes game or art code."""
import argparse, hashlib, json, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if 'const RIVERSIDE012=' in s:raise SystemExit('Already integrated')
# Fail closed if any reserved ID is already a source registry key, permanent
# building assignment/comparison, indexed registry entry or sprite identity.
reserved=r'(?:278|279|280)'
occupied=[
 rf'(?<![\w.]){reserved}\s*:',
 rf"['\"]{reserved}(?:_[0-9]+_[0-9]+)?['\"]\s*:",
 rf'\bk\s*(?::|={{1,3}})\s*{reserved}\b',
 rf"\b(?:MSZ|KNAME|KCB|SPR\.bld)\s*\[\s*['\"]?{reserved}(?:_[0-9]+_[0-9]+)?['\"]?\s*\]",
 rf"['\"]{reserved}_[0-9]+_[0-9]+['\"]"
]
for pattern in occupied:
 hit=re.search(pattern,base)
 if hit:raise SystemExit('Reserved permanent building ID already occupied: '+hit.group(0))
def rep(old,new,count=1):
 global s
 n=s.count(old)
 if n!=count:raise SystemExit(f'Anchor {n} != {count}: {old[:160]}')
 s=s.replace(old,new);audit.append({'anchor':old[:120],'count':n})
game=(P/'gameplay012.js').read_text();early,late=game.split('/* GPT-012 LATE NATIVE HOOKS */',1)
art=(P/'british-riverside-art012.js').read_text()
rep('<!-- GPT-010 native museum art BEGIN: source british-museum-art010.js -->','<!-- GPT-012 native riverside art BEGIN: source british-riverside-art012.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-012 native riverside art END -->\n<!-- GPT-010 native museum art BEGIN: source british-museum-art010.js -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('||STREETLIFE009[k]||MUSEUM010[k]||null;','||STREETLIFE009[k]||MUSEUM010[k]||RIVERSIDE012[k]||null;')
rep('const drawPath643=(src=>','/* GPT-012 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installStreetLifeArt009();installMuseumArt010(); // GPT-004','installStreetLifeArt009();installMuseumArt010();installRiversideArt012(); // GPT-004')
# Native catalog/payment/transactions, fixed root/ref footprint and demolition.
rep('const TOOLS=[',"const TOOLS=[\n  ...Object.values(RIVERSIDE012).map(q=>({id:q.id,cat:q.cat,ic:q.ic,nm:q.nm,pr:'$'+q.cost,unlockRank:q.rank})),")
rep('for(const q of Object.values(MUSEUM010)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}','for(const q of Object.values(MUSEUM010)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}\nfor(const q of Object.values(RIVERSIDE012)){KNAME[q.k]=q.nm;KCB[q.k]=q.kind;COST[q.id]=q.cost;}')
rep('function canPlace(toolId,x,y){','function canPlace(toolId,x,y){\n  if(RIVERSIDE_TOOL012[toolId])return canPlaceRiverside012(RIVERSIDE_TOOL012[toolId],x,y);')
rep('const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId]||STREETLIFE_TOOL009[toolId]||MUSEUM_TOOL010[toolId];','const highStreet005=HIGHSTREET_TOOL005[toolId]||RESIDENTIAL_TOOL006[toolId]||PUBLICLIFE_TOOL007[toolId]||STREETLIFE_TOOL009[toolId]||MUSEUM_TOOL010[toolId]||RIVERSIDE_TOOL012[toolId];')
cases="case 'riversideArcade012':case 'flowerStall012':case 'produceStall012':"
rep("    case 'regionalNaturalHistory010':c=MUSEUM_TOOL010[toolId].cost;break;",'    '+cases+"c=RIVERSIDE_TOOL012[toolId].cost;break;\n    case 'regionalNaturalHistory010':c=MUSEUM_TOOL010[toolId].cost;break;")
rep("    case 'regionalNaturalHistory010':{",'    '+cases+'''{
      const q=RIVERSIDE_TOOL012[toolId];placePowerMulti471(x,y,q.k,q.sz,0);
      for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)delete T(idx(x+dx,y+dy)).office;
      Object.assign(t.bld,{pw:false,wa:false});markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();sanDirty445=true;mobility491Dirty=true;break;}
    case 'regionalNaturalHistory010':{''')
rep('function toolHint434(t){',"function toolHint434(t){\n  if(t&&(RIVERSIDE_TOOL012[t.id]||RIVERSIDE_PATH012[t.id]))return riversideDescription012(RIVERSIDE_TOOL012[t.id]||RIVERSIDE_PATH012[t.id]);")
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !((RIVERSIDE_TOOL012[t.id]||RIVERSIDE_PATH012[t.id])&&window.__noRiverside012)&&')
rep('function toolSize458(id){',"function toolSize458(id){\n  const rv012=RIVERSIDE_TOOL012[typeof id==='object'?id?.id:id];if(rv012)return rv012.sz;")
rep('for(const q of Object.values(MUSEUM010))MAYOR_MANUAL_ONLY470A.add(q.id);','for(const q of Object.values(MUSEUM010))MAYOR_MANUAL_ONLY470A.add(q.id);\nfor(const q of Object.values(RIVERSIDE012))MAYOR_MANUAL_ONLY470A.add(q.id);')
rep('for(const q of Object.values(MUSEUM010))MSZ[q.k]=q.sz;','for(const q of Object.values(MUSEUM010))MSZ[q.k]=q.sz;\nfor(const q of Object.values(RIVERSIDE012))MSZ[q.k]=q.sz;')
rep('if(MUSEUM010[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});','if(MUSEUM010[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});\n        if(RIVERSIDE012[k])Object.assign(tiles[i].bld,{lv:1,v:vv&3,pw:false,wa:false});')
rep('    else if(MUSEUM010[b.k])html=', '    else if(RIVERSIDE012[b.k])html=riversideInspect012(idx(x,y),b);\n    else if(MUSEUM010[b.k])html=')
rep('function insMetrics461(x,y,b,html){',"function insMetrics461(x,y,b,html){if(RIVERSIDE012[b.k]){const q=RIVERSIDE012[b.k],root=idx(x,y),e=enterpriseRootInfo489(root),on=riversideOperational012(root,b)&&e?.k===b.k;return [{k:'有效職位',v:(on?e.activePositions||0:0)+' / '+q.jobs,u:'私營職位'},{k:'實際聘用',v:on?e.employed||0:0,u:'原生企業人力'},{k:'維護',v:'$0',u:'／日'},{k:'等級',v:'固定 Lv.1',u:q.sz+'×'+q.sz}];}")
# Physical utilities: no fake connection, source, water, staffing or legacy supply.
rep('if(MUSEUM010[k])return MUSEUM010[k].power;','if(RIVERSIDE012[k])return RIVERSIDE012[k].power;if(MUSEUM010[k])return MUSEUM010[k].power;')
rep('function powerProfile471(b){','function powerProfile471(b){\n  if(riversideKind012(b.k))return [1.28,.84,.34];')
rep('function powerCriticalTier471(k){','function powerCriticalTier471(k){if(riversideKind012(k))return 2;')
rep('for(const q of Object.values(MUSEUM010))WATER_LOAD472.special[q.k]=q.water;','for(const q of Object.values(MUSEUM010))WATER_LOAD472.special[q.k]=q.water;\nfor(const q of Object.values(RIVERSIDE012))WATER_LOAD472.special[q.k]=q.water;')
rep('function waterProfile472(b){','function waterProfile472(b){if(riversideKind012(b.k))return WATER_PROFILE472.commercial;')
rep('function wastewaterReturn472(b){if(!b)return 0;','function wastewaterReturn472(b){if(!b)return 0;if(riversideKind012(b.k))return WASTEWATER_RETURN472.commercial;')
rep('function waterCriticalTier472(b){if(!b)return 3;','function waterCriticalTier472(b){if(!b)return 3;if(riversideKind012(b.k))return 2;')
rep('function isSanClient445(k){return ','function isSanClient445(k){return riversideKind012(k)||')
rep('||STREETLIFE009[b.k]||MUSEUM010[b.k]))b.age++;','||STREETLIFE009[b.k]||MUSEUM010[b.k]||RIVERSIDE012[b.k]))b.age++;')
rep('&&!STREETLIFE009[b.k]&&!MUSEUM010[b.k])b.age++;','&&!STREETLIFE009[b.k]&&!MUSEUM010[b.k]&&!RIVERSIDE012[b.k])b.age++;')
rep('refreshStreetLifeUtilities009();refreshMuseumUtilities010();refreshMuseumCoverage010();','refreshStreetLifeUtilities009();refreshMuseumUtilities010();refreshMuseumCoverage010();refreshRiversideUtilities012();')
# No unstaffed night-area revenue; retain existing per-tax policy multipliers.
rep('if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const','if(!b||b.ref||HIGHSTREET005[b.k]||PUBLICLIFE007[b.k]||STREETLIFE009[b.k]||MUSEUM010[b.k]||RIVERSIDE012[b.k]||(RESIDENTIAL006[b.k]&&!residentialBuilt006(b)))continue;const',2)
# Native private enterprise, hiring, aggregate commercial jobs and demand only.
rep('for(const q of Object.values(STREETLIFE009))ENTERPRISE_CORE_K489.add(q.k);','for(const q of Object.values(STREETLIFE009))ENTERPRISE_CORE_K489.add(q.k);\nfor(const q of Object.values(RIVERSIDE012))ENTERPRISE_CORE_K489.add(q.k);')
rep('function enterpriseGroupOf489(b){if(!b||b.ref)return null;',"function enterpriseGroupOf489(b){if(!b||b.ref)return null;if(riversideKind012(b.k))return'commercial';")
rep('const k=b.k|0;if(STREETLIFE009[k])return STREETLIFE009[k].jobs;','const k=b.k|0;if(RIVERSIDE012[k])return RIVERSIDE012[k].jobs;if(STREETLIFE009[k])return STREETLIFE009[k].jobs;')
rep('k=b&&b.k|0;if(streetLifeKind009(k))','k=b&&b.k|0;if(riversideKind012(k))return riversideOperational012(root,b)?p:0;if(streetLifeKind009(k))')
rep('function enterpriseWaterFactor489(root,b){if(!b)return 0;','function enterpriseWaterFactor489(root,b){if(!b)return 0;if(riversideKind012(b.k))return riversideWaterFactor012(root,b);')
rep('function enterpriseRoadFactor489(root,b){if(!b)return 0;','function enterpriseRoadFactor489(root,b){if(!b)return 0;if(riversideKind012(b.k))return britishRoad004(root)?1:0;')
rep('hardOffline=(streetLifeKind009(k)','hardOffline=(riversideKind012(k)&&!riversideOperational012(root,b))||(streetLifeKind009(k)')
rep('||streetLifeKind009(b.k)))rcC+=a','||streetLifeKind009(b.k)||riversideKind012(b.k)))rcC+=a')
rep('||streetLifeKind009(r.k)))rcCE+=r.employed','||streetLifeKind009(r.k)||riversideKind012(r.k)))rcCE+=r.employed')
rep('||streetLifeKind009(b.k))rcC+=ent;','||streetLifeKind009(b.k)||riversideKind012(b.k))rcC+=ent;')
rep('||streetLifeKind009(b.k)))jobsC+=','||streetLifeKind009(b.k)||riversideKind012(b.k)))jobsC+=')
rep('+streetLifeRetailUnits009();','+streetLifeRetailUnits009()+riversideRetailUnits012();')
# Exactly one native commercial tax branch. Ledger is a copy of the already
# settled native v2, not a new revenue formula, source or saved field.
rep('  let income=0,upkeep=0,roads=0,parks=0,plants=0,bridges=0,nI=0,taxR=0,taxC=0,taxI=0,fireStations=0,policeStations=0,hospitals=0,policeBoxes=0;','  beginRiversideTax012();\n  let income=0,upkeep=0,roads=0,parks=0,plants=0,bridges=0,nI=0,taxR=0,taxC=0,taxI=0,fireStations=0,policeStations=0,hospitals=0,policeBoxes=0;')
rep('    else if(MUSEUM010[b.k]); // GPT-010:', '    else if(RIVERSIDE012[b.k]&&!riversideOperational012(i,b)); // GPT-012: no unfinished/offline or industrial fallback\n    else if(MUSEUM010[b.k]); // GPT-010:')
rep('||highStreetCommerce005(b.k)||streetLifeRetail009(b.k)){const bx=','||highStreetCommerce005(b.k)||streetLifeRetail009(b.k)||riversideKind012(b.k)){const bx=')
rep('const v2=(streetLifeRetail009(b.k)?STREETLIFE009[b.k].jobs:','const v2=(riversideKind012(b.k)?RIVERSIDE012[b.k].jobs:streetLifeRetail009(b.k)?STREETLIFE009[b.k].jobs:')
rep('*enterpriseTaxFactor489(i);income+=v2;taxC+=v2;} // T489：商業稅','*enterpriseTaxFactor489(i);income+=v2;taxC+=v2;if(riversideKind012(b.k))recordRiversideTax012(i,v2);} // T489：商業稅')
# Native activity/OD capacities and existing cosmetic citizen assignments.
rep('function activityCapacity491(root,b){',"function activityCapacity491(root,b){\n  if(b&&!b.ref&&riversideKind012(b.k)){const on=riversideOperational012(root,b),e=enterpriseRootInfo489(root),ent=on&&e?.k===b.k?Math.max(0,e.activePositions||0):0,staff=on&&e?.k===b.k?Math.max(0,e.employed||0):0;return{work:ent,enterpriseJobs:ent,publicJobs:0,shopping:staff*2.15,education:0,services:0,leisure:0,parking:0};}")
rep('||(streetLifeKind009(jb.k)&&streetLifeOperational009(idx(jx,jy),jb)))','||(streetLifeKind009(jb.k)&&streetLifeOperational009(idx(jx,jy),jb))||(riversideKind012(jb.k)&&riversideOperational012(idx(jx,jy),jb)))',2)
rep('||streetLifeKind009(jb.k))?2:jb.k','||streetLifeKind009(jb.k)||riversideKind012(jb.k))?2:jb.k',2)
rep('&&!streetLifeKind009(wb.k))','&&!streetLifeKind009(wb.k)&&!riversideKind012(wb.k))')
rep('||(streetLifeKind009(wb.k)&&!streetLifeOperational009(c.work,wb))','||(streetLifeKind009(wb.k)&&!streetLifeOperational009(c.work,wb))||(riversideKind012(wb.k)&&!riversideOperational012(c.work,wb))')
rep('||STREETLIFE009[b.k]||MUSEUM010[b.k])){const r=sanRoadSeeds445','||STREETLIFE009[b.k]||MUSEUM010[b.k]||RIVERSIDE012[b.k])){const r=sanRoadSeeds445')
# Native draw/construction/night/weather/occlusion, no global art rewrite.
rep('streetLifeObjects009(objs,sxOf,syOf,vis,lodFar);museumObjects010(objs,sxOf,syOf,vis,lodFar);','streetLifeObjects009(objs,sxOf,syOf,vis,lodFar);museumObjects010(objs,sxOf,syOf,vis,lodFar);riversideObjects012(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.streetLifeModule009){','    if(o.riversideModule012){riversideModuleDraw012(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.streetLifeModule009){')
rep('||(!window.__noMuseumArt010&&cam.z>=lodFarZ648()&&museumTheme010(tiles[i])))continue;','||(!window.__noMuseumArt010&&cam.z>=lodFarZ648()&&museumTheme010(tiles[i]))||(!window.__noRiversideArt012&&cam.z>=lodFarZ648()&&riversideTheme012(tiles[i])))continue;')
rep('  streetLifeSelftest009,streetLifeSpecs009,streetLifeAt009,streetLifeEvidence009,','  riversideSelftest012,riversideSpecs012,riversideAt012,riversideEvidence012,\n  streetLifeSelftest009,streetLifeSpecs009,streetLifeAt009,streetLifeEvidence009,')
# Permanent old identities, existing gameplay/selftests and T724 cold-load fix
# remain unchanged. No save/RLE/RNG or shipping/food-flow formula is patched.
for start,end in [('const BRITISH004=','const BRITISH_TOOL004='),('const HIGHSTREET005=','const HIGHSTREET_TOOL005='),('const STREETLIFE009=','/* GPT-010:'),('const MUSEUM010=','function britishSpec004(k){'),('/* GPT-005 resident smoke:','window.GV =')]:
 if start in base and end in base.split(start,1)[1]:
  old=base.split(start,1)[1].split(end,1)[0]
  if start=='const MUSEUM010=':
   assert old in s,'Protected museum source changed'
  else:assert old==s.split(start,1)[1].split(end,1)[0],'Protected source changed: '+start
cold='const __load515=load;load=function(slot){const ok=__load515(slot);if(ok){fiscal515.lastDay=-1;fiscalStep515(false,false);try{observatoryStep514(true);}catch(_e){}if(!window.__noColdLoadPower011)markPowerDirty450();}return ok;};'
assert cold in base and cold in s,'T724 cold-load fix must remain exact'
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'sourceSHA256':hashlib.sha256(base.encode()).hexdigest(),'outputSHA256':hashlib.sha256(s.encode()).hexdigest(),'bytes':len(s.encode()),'edits':audit},ensure_ascii=False))
