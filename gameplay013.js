/* GPT-013: distinct Edwardian theatre and six paid optional T502 path themes.
   T495 owns public labor; T491 owns leisure. No ticket revenue or new tourism. */
const THEATRE013=Object.freeze({281:Object.freeze({k:281,id:'edwardianTheatre013',nm:'英式愛德華時代劇院',en:'British Edwardian theatre',ic:'🎭',sz:3,cost:3600,rank:7,cat:'culture',kind:'A',jobs:16,upkeep:10,leisure:200,power:4.5,water:3.4,coverage:'theater'})});
const THEATRE_TOOL013=Object.freeze(Object.fromEntries(Object.values(THEATRE013).map(q=>[q.id,q])));
const THEATRE_PATH013=Object.freeze({
  theatreTicket013:Object.freeze({id:'theatreTicket013',nm:'英式售票亭步道',en:'British ticket kiosk paving',ic:'🎟️',sz:1,rank:4,theme:'ticket'}),
  theatrePlaza013:Object.freeze({id:'theatrePlaza013',nm:'英式劇院前廣場步道',en:'British theatre plaza paving',ic:'◈',sz:1,rank:4,theme:'plaza'}),
  theatreRail013:Object.freeze({id:'theatreRail013',nm:'英式劇院鐵欄步道',en:'British theatre iron-railing paving',ic:'🚧',sz:1,rank:4,theme:'rail'}),
  theatreBench013:Object.freeze({id:'theatreBench013',nm:'英式劇院木椅步道',en:'British theatre wooden bench paving',ic:'🪑',sz:1,rank:4,theme:'bench'}),
  theatrePlanter013:Object.freeze({id:'theatrePlanter013',nm:'英式劇院花槽步道',en:'British theatre planter paving',ic:'🌷',sz:1,rank:4,theme:'planter'}),
  theatreLamp013:Object.freeze({id:'theatreLamp013',nm:'英式劇院街燈步道',en:'British theatre lamp paving',ic:'💡',sz:1,rank:4,theme:'lamp'})
});
const theatreCovRoots013=new Map();
let theatreArtCanonical013=null;
function theatreKind013(k){return Object.prototype.hasOwnProperty.call(THEATRE013,k);}
function theatreBuilt013(b){return !!(b&&!b.ref&&theatreKind013(b.k)&&b.age>=9);}
function theatreOperational013(root,b){return !!(theatreBuilt013(b)&&b.pw&&b.wa&&!powerLegacy450()&&!waterLegacy449()&&POWER_ROOT_OK471[root]===1&&WATER_ROOT_STATE472[root]>=2&&WATER_ROOT_DELIVERED472[root]>0&&britishRoad004(root)&&!b.fire&&!b.sick&&!b.death&&!b.abandoned&&!b.riot&&!b.plague&&assetAvailability493(root,'services')>.02);}
function refreshTheatreUtilities013(){for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!b||b.ref||!theatreKind013(b.k))continue;b.pw=!!(!powerLegacy450()&&POWER_ROOT_OK471[root]===1);b.wa=!!(b.pw&&!waterLegacy449()&&WATER_ROOT_STATE472[root]>=2&&WATER_ROOT_DELIVERED472[root]>0);}}
function theatreFactors013(root,b){
  const availability=clamp(assetAvailability493(root,'services'),0,1),power=b?.pw?1:0,road=britishRoad004(root)?1:0,demand=rootWaterDemandBase472(b)*waterProfile472(b)[1]*waterPolicyDemandMul472(b),water=b?.wa&&demand>0?clamp(WATER_ROOT_DELIVERED472[root]/demand,0,1):0,on=theatreOperational013(root,b),factor=on?clamp(availability*water,0,1):0;
  return{family:'other',availability:+availability.toFixed(4),power,water:+water.toFixed(4),road,attraction:1,capacityBudget:1,activeFactor:+factor.toFixed(4),serviceFactor:+factor.toFixed(4),disrupted:!on};
}
function theatreCapacityFactor013(root,b){
  if(!theatreOperational013(root,b)||window.__noCivicServices495)return 0;
  const live=publicStaffRoot495.get(root);
  // Existing last-dispatched staff is authoritative between daily dispatches.
  // No plan/labor-access fallback invents employed theatre staff before hiring.
  if(live?.k!==b.k||!(live.employed>0))return 0;
  return clamp(Math.min(live.capacityFactor||0,theatreFactors013(root,b).serviceFactor*clamp(live.staffFill||0,0,1)),0,1);
}
function theatrePublicJobs013(){let n=0;for(const root of tickBld||[]){const b=tiles[root]?.bld;if(theatreBuilt013(b))n+=THEATRE013[b.k].jobs;}return n;}
function theatreUpkeep013(){let n=0;for(const root of tickBld||[]){const b=tiles[root]?.bld;if(theatreBuilt013(b))n+=THEATRE013[b.k].upkeep;}return n;}
function theatreCoverageReady013(root,b){return theatreCapacityFactor013(root,b)>.02;}
function stampTheatreCoverage013(root,radius,delta){const a=COV.theater,x=root%N,y=(root/N)|0;for(let yy=Math.max(0,y-radius);yy<=Math.min(N-1,y+radius);yy++)for(let xx=Math.max(0,x-radius);xx<=Math.min(N-1,x+radius);xx++)a[idx(xx,yy)]+=delta;}
function refreshTheatreCoverage013(roots){
  const active=new Map();for(const root of roots||tickBld||[]){const b=tiles[root]?.bld;if(theatreCoverageReady013(root,b))active.set(root,COVR.theater);}
  for(const [root,radius]of theatreCovRoots013)if(active.get(root)!==radius){stampTheatreCoverage013(root,radius,-1);theatreCovRoots013.delete(root);markLandDirty(root%N,(root/N)|0,Math.max(20,radius));}
  for(const [root,radius]of active)if(!theatreCovRoots013.has(root)){stampTheatreCoverage013(root,radius,1);theatreCovRoots013.set(root,radius);markLandDirty(root%N,(root/N)|0,Math.max(20,radius));}
}
// Only placement chooses orientation: nearest cardinal road within four cells.
// Canonical clear walking axis points south (+y); art quarter-turns map it to
// west, north, east. Equal-distance ties are south, east, north, west.
function theatreRoadTurn013(x,y){for(let d=1;d<=4;d++)for(const [dx,dy,turn]of[[0,1,0],[1,0,3],[0,-1,2],[-1,0,1]]){const xx=x+dx*d,yy=y+dy*d;if(inMap(xx,yy)&&tiles[idx(xx,yy)]?.road)return turn;}return 0;}
// T487 public-lighting districts belong to native road carriers, not arbitrary
// path tiles. Lighting reaches only a cardinally adjacent road (distance one),
// independently of the four-cell visual orientation search. Fail closed before
// the native lighting dispatch is ready; this read never creates electrical load.
function theatrePathLight013(x,y){
  const out={ready:!!nightCity487.ready&&nightCity487.day===day&&power471.day===day&&!powerDirty450&&!powerHVDirty471,source:null,district:-1,service:0};
  if(!out.ready||powerLegacy450())return out;
  for(const [dx,dy]of[[0,1],[1,0],[0,-1],[-1,0]]){const xx=x+dx,yy=y+dy;if(!inMap(xx,yy))continue;const i=idx(xx,yy),d=POWER_DIST450?.[i]??-1;if(!tiles[i]?.road||!powerCarrierLive475(i)||d<0||!powerDistricts450[d])continue;const service=nightLightServiceAt487(xx,yy);if(!out.source||service>out.service){out.source={x:xx,y:yy,i};out.district=d;out.service=service;}}
  return out;
}
function theatreTheme013(t){const theme=t?.amx502?.british013;return t?.am502===1&&['ticket','plaza','rail','bench','planter','lamp'].includes(theme)?theme:null;}
// New-theme ownership only: old tools retain exact behavior on every other tile.
// Underground services can coexist, while replacing surface uses requires doze.
function theatrePathConflict013(id,x,y){
  if(['doze','wpipe','waterMain','sewerMain','udline','ugcable'].includes(id))return null;
  const cells=[];
  if(['tdig','tland','traise'].includes(id)&&terraBrush===3)cells.push(...terraCells(x,y));
  else{const size=Math.max(1,toolSize458(id)||1);for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)cells.push([x+dx,y+dy]);}
  for(const [xx,yy]of cells)if(inMap(xx,yy)&&theatreTheme013(tiles[idx(xx,yy)]))return '先拆除劇院街區步道';
  return null;
}
function theatreDescription013(q){if(q.theme)return '獨立付費原生陸上步道，步行成本 0.72；'+q.nm+'是可拆除視覺主題。'+(q.theme==='ticket'?'售票亭為步道裝飾，沒有獨立售票交易或收入。':q.theme==='lamp'?'暖色燈光只讀取一格相鄰道路的原生電網夜間供電，無治安或公共服務加成。':'')+'建造時朝最近四格內的直線道路對齊並保存方向；無額外職位、觀光、休閒容量或覆蓋加成。';return '3×3 固定英式愛德華時代劇院，原生九日施工門檻（鋼材可加速）。需真正臨路、實際供電、送達的水與職員；16 名目公共職位、200 名目休閒容量，容量依實際人力與設備縮放。沿用劇院幸福覆蓋半徑 7，須已營運且有人力；竣工後維護 $10／日。無私人商業稅、額外門票收入或新增觀光權重。';}
function canPlaceTheatre013(q,x,y){if(window.__noTheatre013)return '英式劇院街區暫停新增';if(!toolUnlocked458(toolMeta434(q.id)))return '城市 Lv.'+q.rank+' 解鎖';const err=canPlaceMulti(x,y,q.sz,'需 '+q.sz+'×'+q.sz+' 陸地');if(err)return err;const el=T(idx(x,y)).el||0;for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++){const t=T(idx(x+dx,y+dy));if(t.tree)return '先移除樹木';if(t.crater)return '隕石坑需先剷除';if(t.am502||t.parkMeter)return '先移除既有街道設施';if(t.fly475||t.ix475)return '既有高架交通擋住';if((t.el||0)!==el)return '需同一高度的平整地基';}return null;}
function theatreInspect013(root,b){const q=THEATRE013[b.k],on=theatreOperational013(root,b),live=publicStaffRoot495.get(root),staff=on&&live?.k===b.k?live:null,f=theatreCapacityFactor013(root,b),a=activityCapacity491(root,b);return '<h3>'+q.ic+' '+q.nm+'</h3><div class="row">'+q.en+'</div><div class="row">'+(b.age<9?'施工中 '+Math.floor(b.age)+'/9':on?'營運基建就緒':'離線：需道路、供電、供水及設備')+'</div><div class="row">公共職位 '+q.jobs+'｜有效 '+(on?publicActivePositions495(root,b):0).toFixed(1)+'｜實際職員 '+(staff?.employed||0).toFixed(1)+'</div><div class="row">有效休閒 '+(a?.leisure||0).toFixed(1)+'（含原生城市遊客需求倍率）｜人力容量 '+Math.round(f*100)+'%</div><div class="row">'+theatreDescription013(q)+'</div>'; }
function theatreMetrics013(root,b){const q=THEATRE013[b.k],f=theatreCapacityFactor013(root,b);return[{k:'維護',v:'$'+(theatreBuilt013(b)?q.upkeep:0),u:'／日'},{k:'有效休閒',v:(q.leisure*f).toFixed(1)+' / '+q.leisure,u:'人力縮放・城市需求倍率前'},{k:'公共職位',v:(theatreOperational013(root,b)?publicActivePositions495(root,b):0).toFixed(1)+' / '+q.jobs,u:'有效／名目'},{k:'覆蓋',v:theatreCoverageReady013(root,b)?COVR.theater:0,u:'劇院半徑・固定 Lv.1'}];}
function installTheatreArt013(){
  if(!theatreArtCanonical013){const t0=performance.now(),a=window.BritishTheatreArchitecture013.buildAll(),bld={};if(Object.keys(a.buildings).join(',')!=='281'||Object.keys(a.modules).length!==24)throw Error('GPT-013 requires one theatre and twenty-four path views');for(const q of Object.values(THEATRE013)){const views=a.buildings[q.k];if(views?.length!==4)throw Error('GPT-013 requires four authored theatre views');for(let v=0;v<4;v++){const s=views[v];if(!s?.img||!s?.night||s.sz!==q.sz||s.view!==v)throw Error('Invalid GPT-013 theatre sprite '+v);bld[q.k+'_1_'+v]={...s,smoke:[],__theatre013:1,__t479:1,__t547:{k:q.k,lv:1,v,bw:q.sz,bh:q.sz}};}}for(const q of Object.values(THEATRE_PATH013))for(let v=0;v<4;v++){const s=a.modules[q.theme+'_'+v];if(!s?.img||!s?.night||s.sz!==1||s.view!==v||![s.w,s.h,s.ax,s.ay].every(Number.isFinite)||s.w<=0||s.h<=0)throw Error('Invalid GPT-013 path '+q.theme+'/'+v);}theatreArtCanonical013={bld,modules:a.modules};window.__theatreArt013={builds:1,buildings:4,modules:24,total:28,ms:performance.now()-t0};}
  Object.assign(SPR.bld,theatreArtCanonical013.bld);SPR.theatre013=theatreArtCanonical013.modules;
}
function theatreObjects013(objs,sxOf,syOf,vis,lodFar){if(lodFar||window.__noTheatreArt013||!SPR.theatre013)return;for(const i of amCells502){const t=tiles[i],theme=theatreTheme013(t);if(!theme)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(vis(sx,sy))objs.push({dep:viewDep(x,y)+.013,theatreModule013:theme,x,y,sx,sy});}}
function theatreModuleDraw013(g,o,z,depth,night,occ){const t=tiles[idx(o.x,o.y)],s=SPR.theatre013[o.theatreModule013+'_'+(((t.amx502?.turn013||0)+viewRotEff())&3)];if(!s)return;const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;g.drawImage(s.img,x,y,s.w*z,s.h*z);occ(s.img,x,y,s.w*z,s.h*z);if(depth>0&&s.night){const light=theatrePathLight013(o.x,o.y);if(light.source&&light.service>.03)night.push({img:s.night,x,y,w:s.w*z,h:s.h*z,grid487:1,gx:light.source.x,gy:light.source.y,warm649:1});}}
function theatreSpecs013(){return JSON.parse(JSON.stringify({buildings:Object.values(THEATRE013),paths:Object.values(THEATRE_PATH013).map(q=>({...q,base:'footpath502',cost:COST.footpath502})),authority:{staff:'T495',leisure:'T491',coverage:'native theater',construction:'T168 / T418 / T700',ticketRevenue:0,tourism:0}}));}
// Evidence is read-only: no ensure/dispatch, network mutation or time advance.
function theatreAt013(x,y){
  if(!inMap(x,y))return null;let root=idx(x,y),b=tiles[root]?.bld;if(b?.ref){root=idx(b.ref[0],b.ref[1]);b=tiles[root]?.bld;}const q=b&&!b.ref&&THEATRE013[b.k];
  if(q){const live=publicStaffRoot495.get(root),refs=[];for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)if(dx||dy){const i=idx(root%N+dx,((root/N)|0)+dy);refs.push({i,bld:tiles[i]?.bld});}return JSON.parse(JSON.stringify({root,k:b.k,id:q.id,v:b.v,age:b.age,sz:b.sz,refCells:refs,built:theatreBuilt013(b),operational:theatreOperational013(root,b),power:!!b.pw,water:!!b.wa,powerState:POWER_ROOT_OK471[root]||0,powerAllocation:power471.loads?.find(r=>r.root===root)||null,waterState:{code:WATER_ROOT_STATE472[root]||0,state:WATER_STATE_TEXT472[WATER_ROOT_STATE472[root]||0]},waterDelivered:WATER_ROOT_DELIVERED472[root]||0,waterDemand:rootWaterDemandBase472(b)*waterProfile472(b)[1]*waterPolicyDemandMul472(b),road:sanRoadSeeds445(root).filter(i=>!roadIncidentClosed493(i)),staff:live?.k===b.k?{...live,potentialJobs:q.jobs}:null,positions:theatreOperational013(root,b)?publicActivePositions495(root,b):0,employed:theatreOperational013(root,b)&&live?.k===b.k?live.employed||0:0,coverageStamp:theatreCovRoots013.has(root)?{field:'theater',radius:theatreCovRoots013.get(root)}:null,factors:theatreFactors013(root,b),capacityFactor:theatreCapacityFactor013(root,b),activity:activityCapacity491(root,b),coverage:{field:'theater',radius:COVR.theater,ready:theatreCoverageReady013(root,b),stampedRadius:theatreCovRoots013.get(root)||0},upkeep:theatreBuilt013(b)?q.upkeep:0}));}
  const t=tiles[idx(x,y)],theme=theatreTheme013(t);return theme?{root:idx(x,y),theme,am502:t.am502,amx502:JSON.parse(JSON.stringify(t.amx502)),walkCost:(WALK_COST502[idx(x,y)]||0)*amWeatherFactor502('walk',1),baseWalkCost:.72,cost:COST.footpath502,lighting:theatrePathLight013(x,y)}:null;
}
function theatreEvidence013(){const roots=[],paths=[];for(const root of tickBld||[]){const b=tiles[root]?.bld;if(b&&!b.ref&&theatreKind013(b.k))roots.push(theatreAt013(root%N,(root/N)|0));}for(const i of amCells502)if(theatreTheme013(tiles[i]))paths.push(theatreAt013(i%N,(i/N)|0));return{day,roots,paths,civic:civicServicesSnapshot495(),mobility:mobilitySnapshot491(),art:{...window.__theatreArt013}};}
function theatreSelftest013(){
  const details=[],add=(name,ok,actual)=>details.push({name,ok:!!ok,actual}),q=THEATRE013[281],b={k:281,lv:1,age:9,sz:3};
  add('one permanent new theatre identity',Object.keys(THEATRE013).join(',')==='281'&&!BRITISH004[281]&&!HIGHSTREET005[281]&&!PUBLICLIFE007[281]&&!STREETLIFE009[281]&&!MUSEUM010[281]&&!RIVERSIDE012[281]);
  add('paid fixed theatre catalog',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===3600&&MSZ[281]===3&&toolSize458(q.id)===3&&KNAME[281]===q.nm&&KCB[281]==='A'&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only');
  add('native public jobs no enterprise or school alias',PUBLIC_JOBS491[281]===16&&publicJobCapacity491(b)===16&&publicJobCapacity491({...b,age:8})===0&&publicJobCapacity491({...b,ref:[0,0]})===0&&!ENTERPRISE_CORE_K489.has(281)&&enterprisePotentialJobs489(0,b)===0&&!EDUCATION_CAP491[281]&&!CIVIC_EDU_SEATS495[281]&&!SERVICE_CAP491[281]&&!LMCFG309[281]);
  add('theatre leisure and coverage authority',LEISURE_BASE491[281]===200&&covFieldOfK(281)==='theater'&&TOOL_COV459[q.id]==='theater'&&civicFamily495(281)==='other'&&COVR.theater===7);
  add('physical utility and fiscal registrations',powerLoadBase471(b)===4.5&&rootWaterDemandBase472(b)===3.4&&powerCriticalTier471(281)===2&&FISCAL_PUBLIC_ASSET_META515[281]?.cost===3600&&FISCAL_PUBLIC_ASSET_META515[281]?.family==='culture');
  add('reference cells consume no utilities or positions',powerLoadBase471({...b,ref:[0,0]})===0&&rootWaterDemandBase472({...b,ref:[0,0]})===0&&publicJobCapacity491({...b,ref:[0,0]})===0);
  for(let v=0;v<4;v++){const key='281_1_'+v,s=SPR.bld[key];add(key+' canonical authored view',s===theatreArtCanonical013?.bld[key]&&s?.__theatre013===1&&s.sz===3&&s.view===v&&s.w===232&&s.h===260&&s.ax===116&&s.ay===258&&!!s.img&&!!s.night);}
  for(const p of Object.values(THEATRE_PATH013)){add(p.id+' native paid path and metadata',TOOLS.filter(t=>t.id===p.id).length===1&&COST[p.id]===COST.footpath502&&AM_META502.footpath502.c===1&&MAYOR_ACTION_CATALOG470A[p.id]?.status==='manual-only');for(let v=0;v<4;v++){const s=SPR.theatre013?.[p.theme+'_'+v];add(p.theme+'_'+v+' canonical path view',s===theatreArtCanonical013?.modules[p.theme+'_'+v]&&s?.sz===1&&s?.view===v&&s?.w===72&&s?.h===92&&s?.ax===36&&s?.ay===90&&!!s?.img&&!!s?.night);}}
  add('exact twenty-eight assets built once',window.__theatreArt013?.total===28&&window.__theatreArt013.builds===1);
  add('prior bounded registries untouched',Object.keys(BRITISH004).length===3&&Object.keys(HIGHSTREET005).length===8&&Object.keys(RESIDENTIAL006).length===16&&Object.keys(PUBLICLIFE007).length===12&&Object.keys(STREETLIFE009).length===3&&Object.keys(MUSEUM010).length===1&&Object.keys(RIVERSIDE012).length===3);
  add('legacy theatre cinema and British halls stay distinct',KNAME[36]==='劇院'&&KNAME[40]==='電影院'&&MSZ[36]===2&&PUBLIC_JOBS491[36]===10&&PUBLIC_JOBS491[40]===6&&LEISURE_BASE491[36]===140&&LEISURE_BASE491[40]===100&&PUBLICLIFE007[273]?.leisure===170);
  return{ok:details.every(d=>d.ok),checks:details.map(d=>d.name+(d.ok?' ✓':' ✗')),details};
}
/* GPT-013 LATE NATIVE HOOKS */
const __theatrePathCan013=canPlace;canPlace=function(id,x,y){const owned=theatrePathConflict013(id,x,y);if(owned)return owned;const q=THEATRE_PATH013[id];if(!q)return __theatrePathCan013(id,x,y);if(window.__noTheatre013)return '英式劇院街區暫停新增';if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';const err=__theatrePathCan013('footpath502',x,y);if(err)return err;const t=tiles[idx(x,y)];if(t.tree)return '先移除樹木';if(t.zone||t.office)return '先取消既有分區';if(t.lv475||t.hv471||t.fly475||t.ix475)return '既有架空基礎設施擋住';if(t.deco||t.rdec||t.parkMeter||t.bus||t.dock||t.levee)return '先移除既有地面設施或裝飾';return null;};
const __theatrePathCost013=placeCost;placeCost=function(id,x,y){return __theatrePathCost013(THEATRE_PATH013[id]?'footpath502':id,x,y);};
const __theatrePathPlace013=doPlace;doPlace=function(id,x,y,silent){const q=THEATRE_PATH013[id];if(!q)return __theatrePathPlace013(id,x,y,silent);const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}if(!__theatrePathPlace013('footpath502',x,y,true))return false;tiles[idx(x,y)].amx502={british013:q.theme,turn013:theatreRoadTurn013(x,y)};activeMobilityMarkDirty502();if(!silent)toast(q.ic+' '+q.nm+' 完工','gold');return true;};
const __theatreVdraw013=vdraw574;vdraw574=function(o,b){return b&&theatreKind013(b.k)?((b.v+viewRotEff())&3):__theatreVdraw013(o,b);};
for(const q of Object.values(THEATRE_PATH013)){COST[q.id]=COST.footpath502;const t={id:q.id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:0,size:1,status:'manual-only',decision:'manual-only'};}
CATALOG_SECTIONS458.find(q=>q[0]==='leisure')[2].push(...Object.keys(THEATRE_TOOL013));CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(THEATRE_PATH013));
const __theatreKeywords013=catalogKeywords458;catalogKeywords458=function(t){const q=THEATRE_TOOL013[t?.id]||THEATRE_PATH013[t?.id];return q?(__theatreKeywords013(t)+' '+q.en+' 英式 英國 愛德華 劇院 戲院 售票 廣場 鐵欄 木椅 花槽 街燈').toLowerCase():__theatreKeywords013(t);};
const __theatreInspect013=inspect;inspect=function(x,y){const out=__theatreInspect013(x,y),t=inMap(x,y)?tiles[idx(x,y)]:null,theme=theatreTheme013(t);if(theme&&$('#infoBody'))$('#infoBody').insertAdjacentHTML('beforeend','<div class="row">'+theatreDescription013(Object.values(THEATRE_PATH013).find(q=>q.theme===theme))+'</div>');return out;};
