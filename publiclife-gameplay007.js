/* GPT-007 public-life helpers. Twelve permanent public identities, no aliases.
   Embedded in the game IIFE. The kill switch only prevents new placement. */
const PUBLICLIFE007=Object.freeze(Object.fromEntries(PUBLICLIFE_SPEC_ROWS007.map(q=>[q.k,Object.freeze({...q})])));
const PUBLICLIFE_TOOL007=Object.freeze(Object.fromEntries(Object.values(PUBLICLIFE007).map(q=>[q.id,q])));
const publicLifeCovRoots007=new Map();
let publicLifeEmergencySignature007='';
function publicLifeKind007(k){return Object.prototype.hasOwnProperty.call(PUBLICLIFE007,k);}
function publicLifeBaseK007(k){return PUBLICLIFE007[k]?.baseK??k;}
function publicLifeBuilt007(b){return !!(b&&!b.ref&&publicLifeKind007(b.k)&&b.age>=9);}
function publicLifeOperational007(root,b){return !!(publicLifeBuilt007(b)&&b.pw&&b.wa&&britishRoad004(root)&&!b.fire&&!b.sick&&!b.death&&!b.abandoned&&!b.riot&&!b.plague&&assetAvailability493(root,'services')>.02);}
function publicLifePublicJobs007(){let n=0;for(const root of tickBld||[]){const b=tiles[root]?.bld;if(publicLifeBuilt007(b))n+=PUBLICLIFE007[b.k].jobs;}return n;}
function publicLifeUpkeep007(){let n=0;for(const root of tickBld||[]){const b=tiles[root]?.bld;if(publicLifeBuilt007(b)){const q=PUBLICLIFE007[b.k];n+=q.upkeep*(q.budget?(svcBudget[q.budget]||1):1);}}return n;}
function refreshPublicLifeUtilities007(){
  for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!b||b.ref||!publicLifeKind007(b.k))continue;
    b.pw=!!(!powerLegacy450()&&POWER_ROOT_OK471[root]===1);
    b.wa=!!(b.pw&&!waterLegacy449()&&WATER_ROOT_STATE472[root]>=2&&WATER_ROOT_DELIVERED472[root]>0);
  }
}
function publicLifeFactors007(root,b){
  const family=civicFamily495(b.k),availability=clamp(assetAvailability493(root,'services'),0,1),power=b.pw?1:0,road=britishRoad004(root)?1:0;
  // Use authoritative delivered water, including rationing. A connected pipe
  // cannot create supply and a short allocation cannot silently supply full capacity.
  const demand=rootWaterDemandBase472(b)*waterProfile472(b)[1]*waterPolicyDemandMul472(b),water=b.wa&&demand>0?clamp(WATER_ROOT_DELIVERED472[root]/demand,0,1):0;
  const attraction=civicBudgetAttraction495(family),capacityBudget=civicBudgetCapacity495(family),on=publicLifeOperational007(root,b),base=on?availability*power*water*road:0;
  return {family,availability:+availability.toFixed(4),power,water:+water.toFixed(4),road,attraction:+attraction.toFixed(3),capacityBudget:+capacityBudget.toFixed(3),activeFactor:+clamp(base*attraction,0,1.12).toFixed(4),serviceFactor:+clamp(base*capacityBudget,0,1.14).toFixed(4),disrupted:!on};
}
function publicLifeCapacityFactor007(root,b){
  if(!publicLifeOperational007(root,b))return 0;
  if(window.__noCivicServices495)return publicLifeFactors007(root,b).serviceFactor;
  const live=publicStaffRoot495.get(root),plan=civicPlan495?.byRoot?.get(root);
  return clamp(live?.k===b.k?live.capacityFactor:((plan?.k===b.k?plan.factors.serviceFactor:publicLifeFactors007(root,b).serviceFactor)*publicLaborAccess495(root)),0,1.14);
}
function publicLifeCoverageRadius007(q){return q?.coverage?Math.max(1,Math.round(COVR[q.coverage]*(q.budget?(svcBudget[q.budget]||1):1))):0;}
function stampPublicLifeCoverage007(root,field,radius,delta){
  // Radius is already resolved. Never call stampCov here: it would apply the
  // current native budget a second time or remove an obsolete stamp at a new size.
  const a=COV[field],x=root%N,y=(root/N)|0;
  for(let yy=Math.max(0,y-radius);yy<=Math.min(N-1,y+radius);yy++)for(let xx=Math.max(0,x-radius);xx<=Math.min(N-1,x+radius);xx++)a[idx(xx,yy)]+=delta;
}
function refreshPublicLifeCoverage007(roots){
  const active=new Map();
  for(const root of roots||tickBld||[]){const b=tiles[root]?.bld,q=b&&!b.ref&&PUBLICLIFE007[b.k];if(q?.coverage&&publicLifeOperational007(root,b))active.set(root,{field:q.coverage,radius:publicLifeCoverageRadius007(q)});}
  for(const [root,old]of publicLifeCovRoots007){const cur=active.get(root);if(!cur||cur.field!==old.field||cur.radius!==old.radius){stampPublicLifeCoverage007(root,old.field,old.radius,-1);publicLifeCovRoots007.delete(root);markLandDirty(root%N,(root/N)|0,Math.max(20,old.radius));}}
  for(const [root,cur]of active)if(!publicLifeCovRoots007.has(root)){stampPublicLifeCoverage007(root,cur.field,cur.radius,1);publicLifeCovRoots007.set(root,cur);markLandDirty(root%N,(root/N)|0,Math.max(20,cur.radius));}
}
function publicLifeEmergencyReady007(root,b){
  const q=b&&!b.ref&&PUBLICLIFE007[b.k];if(!q||!['fire','police'].includes(q.role)||!publicLifeOperational007(root,b)||assetAvailability493(root,'services')<=.15)return false;
  if(window.__noCivicServices495)return true;
  const staff=publicStaffRoot495.get(root),crew=q.role==='fire'?4:3;
  return !!(staff?.k===b.k&&staff.employed>=crew&&staff.capacityFactor>0);
}
function refreshPublicLifeEmergency007(){
  const ready=[];for(const root of tickBld||[]){const b=tiles[root]?.bld;if(publicLifeEmergencyReady007(root,b))ready.push(root+':'+b.k);}
  const signature=ready.join('|');if(signature!==publicLifeEmergencySignature007){publicLifeEmergencySignature007=signature;markEmergencyDirty455();}
}
function publicLifeDescription007(q){
  const effects=[q.seats?q.seats+' 名目教育席位':'',q.services?q.services+' 名目服務容量':'',q.leisure?q.leisure+' 名目休閒容量':''].filter(Boolean).join('；');
  return q.sz+'×'+q.sz+' 固定英式公共建築，九天竣工後需道路、實際供電與供水。'+q.jobs+' 個公共職位；'+effects+'；竣工後維護 $'+q.upkeep+'/天'+(q.budget?'（依服務預算調整）':'')+'。有效容量由人力、可達性、供水與設備決定。'+(q.role==='fire'||q.role==='police'?'車輛須由實際有職員且已接通道路的本站出發。':'');
}
function publicLifeInspect007(root,b){const q=PUBLICLIFE007[b.k],on=publicLifeOperational007(root,b),built=publicLifeBuilt007(b);return '<h3>'+q.ic+' '+q.nm+'</h3><div class="row">'+q.en+'</div><div class="row">'+(built?(on?'營運基建就緒':'離線：需道路、供電、供水且設備可用'):'施工中：'+Math.floor(b.age)+'/9 天')+'</div><div class="row">名目公共職位 '+q.jobs+'｜有效職位 '+Math.round(on?publicActivePositions495(root,b):0)+'｜實際職員 '+(on?civicActualJobs495(root,b):0).toFixed(1)+'</div><div class="row">'+publicLifeDescription007(q)+'</div>';}
function publicLifeMetrics007(x,y,b){const q=PUBLICLIFE007[b.k],root=idx(x,y),on=publicLifeOperational007(root,b),budget=q.budget?(svcBudget[q.budget]||1):1;return [{k:'維護',v:'$'+(publicLifeBuilt007(b)?q.upkeep*budget:0),u:'／日'+(q.budget?' · 預算 ×'+budget:'')},{k:'有效職位',v:Math.round(on?publicActivePositions495(root,b):0)+' / '+q.jobs,u:'公共職位'},{k:'覆蓋',v:on?publicLifeCoverageRadius007(q):0,u:'格半徑（基建與設備就緒）'},{k:'等級',v:'固定 Lv.1',u:q.sz+'×'+q.sz+' · '+districtName(distIdx(x,y))}];}
function canPlacePublicLife007(q,x,y){if(window.__noPublicLife007)return '英式公共建築暫停新增';if(!toolUnlocked458(toolMeta434(q.id)))return '城市 Lv.'+q.rank+' 解鎖';const err=canPlaceMulti(x,y,q.sz,'需 '+q.sz+'×'+q.sz+' 陸地');if(err)return err;for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)if(T(idx(x+dx,y+dy)).crater)return '隕石坑需先剷除';return null;}
function installPublicLifeArt007(){const t0=performance.now(),list=window.PublicLifeArchitecture007.buildAll(),seen=new Set();for(const s of list){const q=Object.values(PUBLICLIFE007).find(q=>q.art===s.id);if(!q||seen.has(q.k))throw Error('Invalid public-life art identity '+s.id);seen.add(q.k);SPR.bld[q.k+'_1_0']=Object.assign(s,{smoke:[],__publicLife007:1,__t479:1,__t547:{k:q.k,lv:1,v:0,bw:q.sz,bh:q.sz}});}if(seen.size!==12)throw Error('Twelve public-life assets required');window.__publicLifeArt007={count:list.length,ms:performance.now()-t0};}
// Read-only inspection for normal loaded-city evidence. No ensure/refresh, no
// utility overrides and no demand recalculation are performed by this accessor.
function publicLifeAt007(x,y){if(!inMap(x,y))return null;let root=idx(x,y),b=tiles[root]?.bld;if(b?.ref){root=idx(b.ref[0],b.ref[1]);b=tiles[root]?.bld;}const q=b&&!b.ref&&PUBLICLIFE007[b.k];if(!q)return null;const staff=publicStaffRoot495.get(root),stamp=publicLifeCovRoots007.get(root);return JSON.parse(JSON.stringify({root,k:b.k,built:publicLifeBuilt007(b),operational:publicLifeOperational007(root,b),power:b.pw,water:b.wa,staff:staff?.k===b.k?staff:null,capacity:activityCapacity491(root,b),factors:publicLifeFactors007(root,b),coverage:q.coverage,coverageRadius:publicLifeCoverageRadius007(q),coverageStamp:stamp||null,emergencyReady:publicLifeEmergencyReady007(root,b)}));}
