/* GPT-008. Existing k139 railway authority, real rail cells, native T502 modules.
   Embedded inside the game IIFE. No parallel OD, RNG, forced supply or staff. */
const STATION_TOOLS008=Object.freeze({
  britishStationNS008:{nm:'英式中央車站 · 南北軌道',base:'hsrStation',sz:5,rank:20,ic:'🚉',axis:0},
  britishStationEW008:{nm:'英式中央車站 · 東西軌道',base:'hsrStation',sz:5,rank:20,ic:'🚉',axis:1},
  stationSquare008:{nm:'車站石板廣場',base:'footpath502',sz:1,rank:4,ic:'🚶',theme:'square'},
  stationEntrance008:{nm:'車站正式入口',base:'stationEntranceLarge502',sz:1,rank:8,ic:'🚪',theme:'entrance'},
  stationBus008:{nm:'車站巴士候車與行人穿越',base:'crossing502',sz:1,rank:4,ic:'🚌',theme:'bus'},
  stationTaxi008:{nm:'車站計程車候車路緣',base:'crossing502',sz:1,rank:4,ic:'🚕',theme:'taxi'},
  stationCycleParking008:{nm:'車站有蓋自行車停放',base:'bikeHub502',sz:1,rank:5,ic:'🚲',theme:'cycleParking'},
  stationCyclePath008:{nm:'車站自行車通道',base:'bikePath502',sz:1,rank:4,ic:'🚲',theme:'cyclePath'},
  stationWalkTransfer008:{nm:'車站步行轉乘門廊',base:'walkTransfer502',sz:1,rank:8,ic:'🔁',theme:'transfer'}
});
const stationRoots008=new Set();
function britishStation008(b){return !!(b&&!b.ref&&b.k===139&&(b.v===3||b.v===4));}
function stationTheme008(t){const q=t?.amx502?.british008;return t?.am502&&['square','entrance','bus','taxi','cycleParking','cyclePath','transfer'].includes(q)?q:null;}
function stationAxis008(b){return b.v===4?1:0;}
function stationCells008(root,b){const x=root%N,y=(root/N)|0,a=stationAxis008(b),out=[];for(const c of[1,3])for(let k=0;k<5;k++)out.push(idx(x+(a?k:c),y+(a?c:k)));return out;}
function stationPorts008(root,b){const x=root%N,y=(root/N)|0,a=stationAxis008(b),out=[];for(const c of[1,3])for(const k of[-1,5]){const xx=x+(a?k:c),yy=y+(a?c:k);if(inMap(xx,yy))out.push(idx(xx,yy));}return out;}
function stationReady008(root,b){return !!(britishStation008(b)&&b.age>=9&&b.pw&&b.wa&&mobilityFrontage462(root,'road').length&&!b.fire&&!b.abandoned&&assetAvailability493(root,'transport')>.02);}
function stationIndex008(){stationRoots008.clear();for(let i=0;i<N*N;i++)if(britishStation008(tiles[i]?.bld))stationRoots008.add(i);}
function stationRailDirty008(){markMobilityDirty462();railOpsDirty463=true;mobility491Dirty=true;activeMobilityMarkDirty502();}
function stationDaily008(){
  if(!stationRoots008.size)return;
  let changed=false;
  for(const root of stationRoots008){const b=tiles[root]?.bld;if(!britishStation008(b)){stationRoots008.delete(root);continue;}const on=b.age>=9?1:0;for(const i of stationCells008(root,b)){const t=tiles[i];if((t.rail|0)!==on){t.rail=on;t.railBridge=0;t.railMask=0;changed=true;}}}
  if(changed){recalcAllRailMasks();stationRailDirty008();}
}
function stationCost008(id,x,y){const q=STATION_TOOLS008[id];if(!q)return 0;let cost=__stationCost008(q.base,x,y);if(q.theme==='bus')cost+=__stationCost008('bus',x,y);if(q.theme==='taxi'&&diff!==3)cost+=(COST.parkMeter||15)*tq('B5',.95,1)*tq('C8',.95,1)*tq('D4a',.90,1)*sq('hub',1.05,1);return cost;}
function stationCanPlace008(id,x,y){
  const q=STATION_TOOLS008[id];if(window.__noBritishStation008)return'英式車站暫停新增';if(!toolUnlocked458(toolMeta434(id)))return'城市 Lv.'+q.rank+' 解鎖';
  const err=__stationCanPlace008(q.base,x,y);if(err)return err;
  if(q.sz===5){for(let dy=0;dy<5;dy++)for(let dx=0;dx<5;dx++){const t=tiles[idx(x+dx,y+dy)];if(t.am502||t.parkMeter)return'先移除既有交通設施';}return null;}
  const t=tiles[idx(x,y)];if(q.theme==='bus'){if(t.rdec)return'先移除道路佈置';return __stationCanPlace008('bus',x,y);}if(q.theme==='taxi'&&t.parkMeter)return'已有路邊停車設施';return null;
}
function stationPlace008(id,x,y,silent){
  const q=STATION_TOOLS008[id],err=stationCanPlace008(id,x,y),cost=stationCost008(id,x,y);
  if(err||cost>money){if(!silent){toast(err||'資金不足！','bad');sErr();}return false;}
  const before=money,i=idx(x,y);
  if(q.sz===5){if(!__stationPlace008('hsrStation',x,y,true))return false;const b=tiles[i].bld;b.v=3+q.axis;b.pw=false;b.wa=false;stationRoots008.add(i);markPowerDirty450();markPowerDirty471();waterDirty449=true;markWaterCycleDirty472();stationRailDirty008();}
  else{
    if(q.theme==='bus'&&!__stationPlace008('bus',x,y,true))return false;
    if(!__stationPlace008(q.base,x,y,true))throw Error('GPT-008 atomic native facility placement rejected after preflight');
    const t=tiles[i];t.amx502={...(t.amx502||{}),british008:q.theme};
    if(q.theme==='taxi'){t.parkMeter=1;const extra=cost-(before-money);money-=extra;if(undoGroup)undoGroup.spent+=extra;}
    stationRailDirty008();
  }
  if(!silent)toast(q.ic+' '+q.nm+' '+(q.sz===5?'施工開始':'完工'),'gold');updHud();return true;
}
const __stationCanPlace008=canPlace;canPlace=function(id,x,y){if(STATION_TOOLS008[id])return stationCanPlace008(id,x,y);return __stationCanPlace008(id,x,y);};
const __stationCost008=placeCost;placeCost=function(id,x,y){return STATION_TOOLS008[id]?stationCost008(id,x,y):__stationCost008(id,x,y);};
const __stationPlace008=doPlace;doPlace=function(id,x,y,silent){
  if(STATION_TOOLS008[id])return stationPlace008(id,x,y,silent);
  const root=id==='doze'&&inMap(x,y)?mobilityRoot462(idx(x,y)):-1,b=tiles[root]?.bld,owned=britishStation008(b)?stationCells008(root,b):null;
  const taxi=id==='doze'&&inMap(x,y)&&stationTheme008(tiles[idx(x,y)])==='taxi';
  const ok=__stationPlace008(id,x,y,silent);
  if(ok&&owned&&!tiles[root]?.bld){for(const i of owned){tiles[i].rail=0;tiles[i].railBridge=0;tiles[i].railMask=0;}stationRoots008.delete(root);recalcAllRailMasks();stationRailDirty008();}
  if(ok&&taxi){tiles[idx(x,y)].parkMeter=0;mobility491Dirty=true;}
  return ok;
};
const __stationFrontage008=mobilityStationTrackFrontage462;mobilityStationTrackFrontage462=function(root,kind='rail'){root=mobilityRoot462(root);const b=tiles[root]?.bld;if(kind!=='rail'||!britishStation008(b))return __stationFrontage008(root,kind);if(!stationReady008(root,b))return[];const x=root%N,y=(root/N)|0,axis=stationAxis008(b),out=[];for(const c of[1,3]){const ports=[-1,5].map(k=>[x+(axis?k:c),y+(axis?c:k)]);if(ports.some(([xx,yy])=>inMap(xx,yy)&&tiles[idx(xx,yy)].rail)){const i=idx(x+(axis?2:c),y+(axis?c:2));if(tiles[i].rail)out.push(i);}}return out;};
const __stationGeometry008=railGeometry463;railGeometry463=function(mode,L){const g=__stationGeometry008(mode,L);if(mode==='rail'&&g.validStops.some(r=>britishStation008(tiles[r]?.bld)&&!stationReady008(r,tiles[r].bld))){g.broken=true;g.reason='英式車站施工中，或缺少供電／供水／道路';g.path=[];g.stationPos=[];}return g;};
const __stationName008=railStationName463;railStationName463=function(root,mode){return britishStation008(tiles[root]?.bld)?'英式中央車站 · '+(stationAxis008(tiles[root].bld)?'東西':'南北'):__stationName008(root,mode);};
const __stationJobCapacity008=publicJobCapacity491;publicJobCapacity491=function(b){return britishStation008(b)&&b.age<9?0:__stationJobCapacity008(b);};
const __stationActivePositions008=publicActivePositions495;publicActivePositions495=function(root,b){return britishStation008(b)&&!stationReady008(root,b)?0:__stationActivePositions008(root,b);};
const __stationMobilityCapacity008=publicServiceCapacityForMobility495;publicServiceCapacityForMobility495=function(root,b,type){return britishStation008(b)&&!stationReady008(root,b)?0:__stationMobilityCapacity008(root,b,type);};
const __stationVdraw008=vdraw574;vdraw574=function(o,b){return britishStation008(b)?3+((stationAxis008(b)+viewRotEff())&3):__stationVdraw008(o,b);};
const __stationLoad008=load;load=function(...a){const ok=__stationLoad008(...a);if(ok){stationIndex008();stationDaily008();}return ok;};
const __stationNewWorld008=newWorld;newWorld=function(...a){stationRoots008.clear();return __stationNewWorld008(...a);};
const __stationTxnSync008=syncWorldAfterTransaction460;syncWorldAfterTransaction460=function(...a){const r=__stationTxnSync008(...a);stationIndex008();stationDaily008();return r;};
const __stationSize008=toolSize458;toolSize458=function(id){const q=STATION_TOOLS008[typeof id==='object'?id?.id:id];return q?q.sz:__stationSize008(id);};
for(const [id,q]of Object.entries(STATION_TOOLS008)){COST[id]=q.sz===5?COST.hsrStation:COST[q.base]+(q.theme==='bus'?COST.bus:q.theme==='taxi'?COST.parkMeter||15:0);TOOLS.push({id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[id],unlockRank:q.rank});MAYOR_MANUAL_ONLY470A.add(id);}
CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(STATION_TOOLS008));
function stationDescription008(q){if(q.sz===5)return'5×5 · 紅磚售票廳、鐘塔、玻璃鐵棚、月台與跨月台通道。'+(q.axis?'東西':'南北')+'兩條實體軌道；端口只在軌道兩端。沿用大型鐵路車站容量，須完成施工、供電、供水、道路，以及玩家付費車隊與路線。';return({square:'獨立石板廣場：沿用步道，步行成本0.72，可連續拼接。',entrance:'連到四格內的實際車站；沿用大型入口，出口容量420。',bus:'道路上的實際巴士站與行人穿越。客流須有玩家的路線和車隊。',taxi:'道路候車路緣、行人穿越及六格一般路邊停車供給；現有系統尚無專用計程車派遣或計程車客流。',cycleParking:'獨立有蓋自行車停放；原生容量100，須接上步行／自行車網絡。',cyclePath:'獨立自行車道；原生自行車成本0.58，步行成本0.82。',transfer:'連接五格內兩座不同的實際車站；原生步行轉乘容量360。'})[q.theme];}
function stationDistrictAt008(x,y){if(!inMap(x,y))return null;const root=mobilityRoot462(idx(x,y)),b=tiles[root]?.bld;if(britishStation008(b))return{root,k:b.k,v:b.v,age:b.age,axis:stationAxis008(b),ready:stationReady008(root,b),power:!!b.pw,water:!!b.wa,road:mobilityFrontage462(root,'road'),owned:stationCells008(root,b),ownedRail:stationCells008(root,b).map(i=>tiles[i].rail|0),ports:stationPorts008(root,b),connectedPorts:stationReady008(root,b)?stationPorts008(root,b).filter(i=>tiles[i]?.rail):[],trackSeeds:mobilityStationTrackFrontage462(root,'rail'),frontagePolicy:'matching physical rail portals only',authority:'native k139 / T463 / T468 / T491 / T501 / T502'};const t=tiles[idx(x,y)],theme=stationTheme008(t);return theme?{theme,am502:t.am502,amx502:JSON.parse(JSON.stringify(t.amx502)),bus:!!t.bus,parkMeter:!!t.parkMeter,walkCost:amNodeCost502(idx(x,y),'walk'),bikeCost:amNodeCost502(idx(x,y),'bike'),taxiDispatch:false}:null;}
function installStationArt008(){const t0=performance.now(),a=window.BritishStationArchitecture008.buildAll();for(const [v,s]of a.station.entries())SPR.bld['139_1_'+(v+3)]={...s,smoke:[],__britishStation008:1,__t479:1,__t547:{k:139,lv:1,v:v+3,bw:5,bh:5}};SPR.stationDistrict008=a.modules;SPR.stationConstruction008=a.construction;window.__stationArt008={ms:performance.now()-t0,builds:1,station:4,modules:Object.keys(a.modules).length,construction:Object.keys(a.construction).length};}
function stationObjects008(objs,sxOf,syOf,vis,lodFar){if(lodFar||!SPR.stationDistrict008)return;for(const i of amCells502){const t=tiles[i],theme=stationTheme008(t);if(!theme)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(vis(sx,sy))objs.push({dep:viewDep(x,y)+.009,stationModule008:theme,x,y,sx,sy});}}
function stationModuleDraw008(g,o,z,depth,night,occ){const s=SPR.stationDistrict008[o.stationModule008+'_'+viewRotEff()];if(!s)return;const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;g.drawImage(s.img,x,y,s.w*z,s.h*z);occ(s.img,x,y,s.w*z,s.h*z);if(depth>0&&s.night)night.push({img:s.night,x,y,w:s.w*z,h:s.h*z,grid487:1,gx:o.x,gy:o.y,warm649:1});}
function stationConstructionDraw008(g,b,s,x,y,z,depth,night,occ,root){const stage=b.age<2?0:b.age<4?1:b.age<7?2:3,v=(stationAxis008(b)+viewRotEff())&3,c=SPR.stationConstruction008[stage+'_'+v];g.drawImage(c.img,x,y,c.w*z,c.h*z);occ(c.img,x,y,c.w*z,c.h*z);if(depth>0&&b.pw&&c.night)night.push({img:c.night,x,y,w:c.w*z,h:c.h*z,warm649:1,gx:root%N,gy:(root/N)|0});}
function stationSelftest008(){const details=[],add=(name,ok,actual)=>details.push({name,ok:!!ok,actual});for(let v=3;v<7;v++){const s=SPR.bld['139_1_'+v];add('original station view '+v,s?.__britishStation008&&s.img?.width===336&&s.night?.width===336,{w:s?.w,h:s?.h});}add('exact four station,28 module,16 construction assets',window.__stationArt008?.station===4&&window.__stationArt008.modules===28&&window.__stationArt008.construction===16,window.__stationArt008);add('nine independent native tools',Object.keys(STATION_TOOLS008).length===9);add('existing large-station identity retained',MSZ[139]===5&&RAIL_MODE463.rail.stationKs.includes(139));add('square walk authority',AM_META502.footpath502.c===1);add('no taxi dispatch authority invented',stationDescription008(STATION_TOOLS008.stationTaxi008).includes('尚無專用計程車'));return{ok:details.every(d=>d.ok),details};}
function stationEvidence008(){return{day,roots:[...stationRoots008].map(root=>{const b=tiles[root]?.bld;return{...stationDistrictAt008(root%N,(root/N)|0),staff:publicStaffRoot495.has(root)?JSON.parse(JSON.stringify(publicStaffRoot495.get(root))):null,positions:publicActivePositions495(root,b)};}),art:{...window.__stationArt008},rail:railOpsSnapshot463(),operating:transitOpsSnapshot501(),active:activeMobilitySnapshot502(),civic:civicServicesSnapshot495(),mobility:mobilitySnapshot491(),bus:busRoutes.map((r,i)=>({id:i+1,stops:[...r.stops]}))};}
