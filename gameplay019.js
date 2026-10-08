/* GPT-019: one native paid waterfront path collection. Visual activity reads
 * existing services and native walking topology; no new economy or actors. */
const QUARTER_ROWS019=Object.freeze([
 ['arrivalCourt','水岸展館入口廣場','Open heritage arrival court','🧭','入口 廣場 石鋪',false],
 ['brickPromenade','水岸紅磚主步道','Connected red-brick promenade','🧱','步道 紅磚 連接',false],
 ['quayEdgeWalk','水岸護欄步道','Quayside coping and railing','🌊','岸邊 護欄 步道',false],
 ['quayCorner','水岸轉角眺望台','Quayside corner lookout','🔭','轉角 眺望 護岸',false],
 ['heritageDisplay','海事解說台步道','Maritime interpretation court','🗺️','海事 解說 地圖',false],
 ['watersideBench','水岸長椅花台','Waterside bench and planting bay','🪑','長椅 休息 花台',false],
 ['harbourLantern','水岸港燈步道','Powered harbour lantern path','🏮','港燈 路燈 夜間',true],
 ['timberShelter','水岸木構涼亭','Open timber waterfront shelter','⛱️','木構 涼亭 遮雨',false]
].map(Object.freeze));
const QUARTER_PATH019=Object.freeze(Object.fromEntries(QUARTER_ROWS019.map(([theme,nm,en,ic,keywords,lit])=>[theme+'019',Object.freeze({id:theme+'019',theme,nm,en,ic,keywords,lit,sz:1,rank:4})])));
const QUARTER_THEME019=Object.freeze(Object.fromEntries(Object.values(QUARTER_PATH019).map(q=>[q.theme,q])));
const QUARTER_COLLECTION019=Object.freeze([...Object.keys(WATERFRONT_TOOL018),...Object.keys(QUARTER_PATH019),...Object.keys(QUAYSIDE_PATH017)]);
let quarterArtCanonical019=null,quarterGraphCache019=null;
const quarterFloorCache019=new Map(),quarterRouteCache019=new Map();
const quarterStats019={graphBuilds:0,floorBuilds:0,routeBuilds:0,visitors:0,floors:0,raised:0};
function quarterMeta019(t){return t?.am502===1?window.WaterfrontQuarterLogic019.metadata(t.amx502):null;}
function quarterTheme019(t){return quarterMeta019(t)?.theme||null;}
function quarterDescription019(q){return q.nm+'是獨立付費的陸上步道，沿用正常步行及原生造價。與相鄰水岸構件連接鋪面，岸邊構件優先朝相鄰水面，其餘朝附近道路保存方向；'+(q.lit?'實體港燈只使用一格相鄰道路的原生供電。':'本構件不發光。')+'附近訪客僅呈現展館營運狀態，沒有新增遊客經濟、收入或服務容量。';}
function quarterTurn019(theme,x,y){if(theme==='quayEdgeWalk'||theme==='quayCorner')for(let d=0;d<4;d++){const [dx,dy]=window.WaterfrontQuarterLogic019.DIRS[d],xx=x+dx,yy=y+dy;if(inMap(xx,yy)&&tiles[idx(xx,yy)]?.t===0)return(d+1)&3;}return complexRoadTurn014(x,y);}
function quarterConflict019(id,x,y){
 if(['doze','wpipe','waterMain','sewerMain','udline','ugcable'].includes(id))return null;
 const cells=[];if(['tdig','tland','traise'].includes(id)&&terraBrush===3)cells.push(...terraCells(x,y));else{const size=Math.max(1,toolSize458(id)||1);for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)cells.push([x+dx,y+dy]);}
 for(const [xx,yy]of cells)if(inMap(xx,yy)&&quarterTheme019(tiles[idx(xx,yy)]))return '先拆除水岸街區步道';return null;
}
function installQuarterArt019(){
 if(!quarterArtCanonical019){const start=performance.now(),a=window.BritishWaterfrontQuarter019.buildAll(),expected=Object.keys(QUARTER_THEME019).flatMap(t=>[0,1,2,3].map(v=>t+'_'+v));
  if(Object.keys(a.modules||{}).sort().join(',')!==expected.sort().join(','))throw Error('GPT-019 requires exactly32 original quarter views');
  for(const theme of Object.keys(QUARTER_THEME019))for(let view=0;view<4;view++){const s=a.modules[theme+'_'+view],p=window.BritishWaterfrontQuarter019.layersFor(s);if(!s?.img||!s?.night||s.sz!==1||s.view!==view||s.w!==72||s.h!==92||s.ax!==36||s.ay!==90||!p?.ground||!p?.raised||!p?.raisedNight||s.physicalLampCount!==(theme==='harbourLantern'?1:0))throw Error('Invalid quarter geometry/layers '+theme+'/'+view);}
  quarterArtCanonical019=a.modules;quarterFloorCache019.clear();window.__quarterArt019={builds:1,total:32,ms:performance.now()-start};
 }
 SPR.waterfrontQuarter019=quarterArtCanonical019;
}
function quarterGraph019(){
 // A renderer never repairs native caches. A dirty/load frame is intentionally
 // silent; normal T502 maintenance supplies the next valid topology.
 if(amDirty502||!tiles||WALK_COST502.length!==N*N)return null;
 const old=quarterGraphCache019;if(old&&old.tiles===tiles&&old.version===amVersion502&&old.cells===amCells502)return old.graph;
 const rows=[];for(const i of amCells502){const t=tiles[i],m=quarterMeta019(t),native=!!(t&&!t.bld&&!t.tree&&!t.ruin&&!t.crater&&(t.t===1||t.t===2)&&WALK_COST502[i]>0),plain=!t.amx502&&(t.am502===1||t.am502===4),open=m?window.BritishWaterfrontQuarter019.metadata.walkClearance[m.theme].openEdges.reduce((a,d)=>a|(1<<d),0):15;
  rows.push({i,elevation:t.el||0,passable:native,flat:!!(m?window.WaterfrontQuarterLogic019.FLAT.includes(m.theme):plain),theme:m?.theme||null,open:window.WaterfrontQuarterLogic019.rotateMask(open,m?.turn||0)});
 }
 const graph=window.WaterfrontQuarterLogic019.graph(rows,N);quarterGraphCache019={tiles,version:amVersion502,cells:amCells502,graph};quarterRouteCache019.clear();quarterStats019.graphBuilds++;return graph;
}
function quarterRoutes019(root,b,g){
 const key=root+':'+(b.v||0),cached=quarterRouteCache019.get(key);if(cached)return cached;
 const q=window.WaterfrontQuarterLogic019.routes({x:root%N,y:(root/N)|0,sz:b.sz,turn:b.v||0,elevation:tiles[root].el||0},g);
 if(quarterRouteCache019.size>=64)quarterRouteCache019.delete(quarterRouteCache019.keys().next().value);quarterRouteCache019.set(key,q);quarterStats019.routeBuilds++;return q;
}
function quarterGround019(sprite,mask){
 const layers=window.BritishWaterfrontQuarter019.layersFor(sprite);if(!layers)return sprite.img;
 if(window.__noWaterfrontConnections019||!mask)return layers.ground;
 const key=sprite.theme+':'+sprite.view+':'+mask,cached=quarterFloorCache019.get(key);if(cached){quarterFloorCache019.delete(key);quarterFloorCache019.set(key,cached);return cached;}
 const H=window.BritishComplexPrimitives014,P=window.BritishWaterfrontQuarter019.metadata.palette,S=H.Scene(1,sprite.view,72,92),rects=[[5.3,10.7,0,5.3],[10.7,16,5.3,10.7],[5.3,10.7,10.7,16],[0,5.3,5.3,10.7]];
 const bricks=(x,y)=>{const row=Math.floor(y),u=x+(row%2),mod=(n,d)=>(n%d+d)%d;return mod(y,1)<.11||mod(u,2)<.10?P.mortar:P.brick;};
 for(let d=0;d<4;d++)if(mask&(1<<d)){const r=rects[d];S.flat(...r,.055,bricks);if(d%2===0){S.flat(r[0]-.30,r[0],r[2],r[3],.058,P.limestoneHi);S.flat(r[1],r[1]+.30,r[2],r[3],.058,P.limestoneHi);}else{S.flat(r[0],r[1],r[2]-.30,r[2],.058,P.limestoneHi);S.flat(r[0],r[1],r[3],r[3]+.30,.058,P.limestoneHi);}}
 const trim=S.finish(),floor=document.createElement('canvas');floor.width=72;floor.height=92;const c=floor.getContext('2d');c.drawImage(layers.ground,0,0);c.drawImage(trim.img,0,0);
 // At most128 private surfaces (<3.4MiB RGBA), no new SPR leaf or per-frame
 // rebuild. Source layers remain immutable, and LRU eviction drops ownership.
 if(quarterFloorCache019.size>=128)quarterFloorCache019.delete(quarterFloorCache019.keys().next().value);quarterFloorCache019.set(key,floor);quarterStats019.floorBuilds++;return floor;
}
function quarterActivity019(root,b,z=cam.z){
 const built=complexBuilt014(b),operational=complexOperational014(root,b),live=publicStaffRoot495.get(root),employed=live?.k===b.k?live.employed||0:0,leisure=COMPLEX014[b.k].leisure*complexCapacityFactor014(root,b);
 return window.WaterfrontQuarterLogic019.activity({built,operational,employed,leisure,night:daylight().b<.62,wet:weather>=1,winter:season()===3,zoom:z,disabled:!!(window.__noWaterfrontVisitors019||window.__noWaterfrontQuarterArt019||window.__noActiveMobility502)});
}
function quarterObjects019(objs,sxOf,syOf,vis,lodFar){
 quarterStats019.visitors=0;quarterStats019.floors=0;quarterStats019.raised=0;if(lodFar||window.__noWaterfrontQuarterArt019||!SPR.waterfrontQuarter019)return;
 const z=cam.z,g=quarterGraph019();
 // Floors precede all objects, preserving pedestrian feet and adjacent props.
 // Raised pixels alone join the unchanged native object-depth sort.
 for(const i of amCells502){const t=tiles[i],m=quarterMeta019(t);if(!m)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(!vis(sx,sy))continue;const s=SPR.waterfrontQuarter019[m.theme+'_'+((m.turn+viewRotEff())&3)],mask=window.WaterfrontQuarterLogic019.rotateMask(g?.nodes.get(i)?.mask||0,-m.turn),floor=quarterGround019(s,mask);ctx.drawImage(floor,sx+(32-s.ax)*z,sy+(32-s.ay)*z,s.w*z,s.h*z);quarterStats019.floors++;objs.push({dep:viewDep(x,y)+.019,quarterModule019:m.theme,x,y,sx,sy});}
 if(!g||window.__noWaterfrontVisitors019||window.__noActiveMobility502||z<1)return;
 for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!waterfrontAppearance018(b))continue;const x=root%N,y=(root/N)|0;if(!vis(sxOf(x,y),syOf(x,y)))continue;const count=quarterActivity019(root,b,z);if(!count)continue;const routes=quarterRoutes019(root,b,g).paths;if(!routes.length)continue;
  for(let n=0;n<count&&quarterStats019.visitors<24;n++){const seed=window.WaterfrontQuarterLogic019.hash(root,n),p=window.WaterfrontQuarterLogic019.position(routes[n%routes.length],g,visT,seed);if(!p)continue;const sx=sxOf(p.x,p.y)+32*z,sy=syOf(p.x,p.y)+16*z;if(!vis(sx,sy))continue;objs.push({dep:viewDep(p.x,p.y)+.025,quarterVisitor019:{root,seed,state:p.state,ptype:seed%3},sx,sy});quarterStats019.visitors++;}
  if(quarterStats019.visitors>=24)break;
 }
}
function quarterModuleDraw019(g,o,z,depth,night,occ){
 const m=quarterMeta019(tiles[idx(o.x,o.y)]);if(!m)return;const s=SPR.waterfrontQuarter019[m.theme+'_'+((m.turn+viewRotEff())&3)],p=window.BritishWaterfrontQuarter019.layersFor(s);if(!p)return;const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;g.drawImage(p.raised,x,y,s.w*z,s.h*z);occ(p.raised,x,y,s.w*z,s.h*z);quarterStats019.raised++;
 if(depth>0&&m.theme==='harbourLantern'){const light=complexPathLight014(o.x,o.y);if(light.source&&light.service>.03)night.push({img:p.raisedNight,x,y,w:s.w*z,h:s.h*z,grid487:1,gx:light.source.x,gy:light.source.y,warm649:1});}
}
function quarterVisitorDraw019(g,o,z,occ){const v=o.quarterVisitor019,fr=v.state==='walking'?(Math.floor(visT*3+v.seed%17)%2):0,s=SPR.ped[v.ptype]?.[fr];if(!s)return;g.drawImage(s.img,o.sx-s.ax*z,o.sy-s.ay*z,s.w*z,s.h*z);occ(s.img,o.sx-s.ax*z,o.sy-s.ay*z,s.w*z,s.h*z);}
function quarterConnection019(id,x,y){
 const g=quarterGraph019();if(!g||!inMap(x,y))return{ready:false,text:'步道連接更新中'};
 if(waterfrontTool018(id)){const e=window.WaterfrontQuarterLogic019.entrance({x,y,sz:2,turn:complexRoadTurn014(x,y),elevation:tiles[idx(x,y)].el||0},g);return{ready:true,front:e.front,cells:e.connected,text:['北','東','南','西'][e.front]+'側入口 · '+(e.connected.length?'已連步道':'尚未連步道')};}
 const q=QUARTER_PATH019[id];if(!q)return null;const count=window.WaterfrontQuarterLogic019.DIRS.reduce((a,[dx,dy])=>a+(inMap(x+dx,y+dy)&&g.nodes.has(idx(x+dx,y+dy))?1:0),0);return{ready:true,neighbors:count,text:count?'相鄰 '+count+' 格步道':'獨立步道 · 可繼續銜接'};
}
function quarterEntrancePreview019(sxOf,syOf,z,id,x,y){if(window.__noWaterfrontQuarterPreview019||!waterfrontTool018(id))return;const c=quarterConnection019(id,x,y);if(!c?.ready)return;const d=c.front,edges=[[[x,y-1],[x+1,y-1]],[[x+2,y],[x+2,y+1]],[[x+1,y+2],[x,y+2]],[[x-1,y+1],[x-1,y]]];ctx.save();for(const [a,b]of edges[d])if(inMap(a,b))drawTileOutline459(sxOf(a,b),syOf(a,b),z,c.cells.includes(idx(a,b))?'#b4dda3':'#e9c178',false);ctx.restore();}
function quarterAt019(x,y){if(!inMap(x,y))return null;const i=idx(x,y),m=quarterMeta019(tiles[i]);if(!m)return null;return{root:i,x,y,theme:m.theme,turn:m.turn,am502:tiles[i].am502,amx502:{...tiles[i].amx502},walkCost:WALK_COST502[i]||0,cost:COST.footpath502,lighting:complexPathLight014(x,y)};}
function quarterSpecs019(){return{paths:Object.values(QUARTER_PATH019).map(q=>({...q,base:'footpath502',cost:COST.footpath502})),collection:[...QUARTER_COLLECTION019],authority:{walking:'native T502',visualActivity:'service-informed decoration only',extraJobs:0,extraRevenue:0,extraServices:0,save:'existing sparse amx502 metadata'},bounds:{floorCache:128,routeCache:64,visitors:24,visitedPerHall:128,routeDepth:12}};}
function quarterEvidence019(){const g=quarterGraph019(),paths=[],halls=[];for(const i of amCells502){const m=quarterAt019(i%N,(i/N)|0);if(m)paths.push(m);}for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!waterfrontAppearance018(b))continue;const r=g?quarterRoutes019(root,b,g):null;halls.push({root,theme:waterfrontAppearance018(b),age:b.age,activity:quarterActivity019(root,b),entry:r?.entry||null,paths:r?.paths||[],visited:r?.visited||0,positions:(r?.paths||[]).map((p,n)=>window.WaterfrontQuarterLogic019.position(p,g,visT,window.WaterfrontQuarterLogic019.hash(root,n)))});}return{day,paths,halls,art:{...window.__quarterArt019},cache:{...quarterStats019,floors:quarterFloorCache019.size,routes:quarterRouteCache019.size,topologyReady:!!g},visualOnly:true};}
function quarterSelftest019(){const details=[],add=(name,ok)=>details.push({name,ok:!!ok});add('exact eight manual paid1x1 themes',Object.keys(QUARTER_PATH019).length===8);for(const q of Object.values(QUARTER_PATH019)){add(q.id+' original native paid manual-only tool',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===COST.footpath502&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only');for(let v=0;v<4;v++){const s=SPR.waterfrontQuarter019?.[q.theme+'_'+v];add(q.id+' view'+v+' canonical identity and private layers',s===quarterArtCanonical019?.[q.theme+'_'+v]&&!!window.BritishWaterfrontQuarter019.layersFor(s)&&s?.physicalLampCount===(q.lit?1:0));}}add('32 assets built once',window.__quarterArt019?.total===32&&window.__quarterArt019?.builds===1);add('private caches bounded',quarterFloorCache019.size<=128&&quarterRouteCache019.size<=64);add('focused16-piece collection preserves existing halls and quayside',QUARTER_COLLECTION019.length===16&&QUARTER_COLLECTION019.every(id=>TOOLS.some(t=>t.id===id)));return{ok:details.every(q=>q.ok),checks:details.map(q=>q.name+(q.ok?' ✓':' ✗')),details};}
/* GPT-019 LATE NATIVE HOOKS */
const __quarterCan019=canPlace;canPlace=function(id,x,y){const owned=quarterConflict019(id,x,y);if(owned)return owned;const q=QUARTER_PATH019[id];if(!q)return __quarterCan019(id,x,y);if(window.__noWaterfrontQuarter019)return '水岸街區暫停新增';if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';const err=__quarterCan019('footpath502',x,y);if(err)return err;const t=tiles[idx(x,y)];if(t.tree)return '先移除樹木';if(t.zone||t.office)return '先取消既有分區';if(t.lv475||t.hv471||t.fly475||t.ix475)return '既有架空基礎設施擋住';if(t.deco||t.rdec||t.parkMeter||t.bus||t.dock||t.levee)return '先移除既有地面設施或裝飾';return null;};
const __quarterCost019=placeCost;placeCost=function(id,x,y){return __quarterCost019(QUARTER_PATH019[id]?'footpath502':id,x,y);};
const __quarterPlace019=doPlace;doPlace=function(id,x,y,silent){const q=QUARTER_PATH019[id];if(!q)return __quarterPlace019(id,x,y,silent);const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}if(!__quarterPlace019('footpath502',x,y,true))return false;tiles[idx(x,y)].amx502={british019:q.theme,turn019:quarterTurn019(q.theme,x,y)};activeMobilityMarkDirty502();if(!silent)toast(q.ic+' '+q.nm+' 完工','gold');return true;};
for(const q of Object.values(QUARTER_PATH019)){COST[q.id]=COST.footpath502;const t={id:q.id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:0,size:1,status:'manual-only',decision:'manual-only'};}
CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(QUARTER_PATH019));
const __quarterKeywords019=catalogKeywords458;catalogKeywords458=function(t){const q=QUARTER_PATH019[t?.id],all=QUARTER_COLLECTION019.includes(t?.id)?' 水岸街區 waterfront quarter ':'';return (__quarterKeywords019(t)+all+(q?q.en+' '+q.keywords:'')).toLowerCase();};
const __quarterInspect019=inspect;inspect=function(x,y){const out=__quarterInspect019(x,y),m=inMap(x,y)?quarterMeta019(tiles[idx(x,y)]):null;if(m&&$('#infoBody'))$('#infoBody').insertAdjacentHTML('beforeend','<div class="row">'+quarterDescription019(QUARTER_THEME019[m.theme])+'</div>');return out;};
const __quarterCatalogList019=catalogToolList458;catalogToolList458=function(){if(catalogCat458!=='waterfront019')return __quarterCatalogList019();const q=catalogQuery458.trim().toLowerCase();return QUARTER_COLLECTION019.map(toolMeta434).filter(t=>t&&(!q||catalogKeywords458(t).includes(q)));};
/* GPT-019 CATALOG FIT BEGIN: additive UI only; frozen T731 sources stay exact. */
function quarterCatalogFit019(){
 const root=$('#buildCatalog458');if(!root)return;
 if(!document.getElementById('quarterCatalogStyle019')){const style=document.createElement('style');style.id='quarterCatalogStyle019';style.textContent='#buildCatalog458[data-quarter-catalog-fit019] .catalogSheet458{grid-template-columns:minmax(0,1fr)}#buildCatalog458[data-quarter-catalog-fit019] .catalogSheet458>*{min-width:0;max-width:100%}#buildCatalog458[data-quarter-catalog-fit019] .catalogCats458{touch-action:pan-x}#buildCatalog458[data-quarter-catalog-fit019] .catalogResults458{touch-action:pan-y}';document.head.appendChild(style);}
 root.toggleAttribute('data-quarter-catalog-fit019',!window.__noWaterfrontCatalogFit019);
}
function quarterEnterCollection019(){catalogCat458='waterfront019';catalogMode458='all';catalogQuery458='';catalogDetailId458='';const search=$('#catalogSearch458');if(search)search.value='';renderBuildCatalog458();const host=$('#catalogResults458');if(host&&!window.__noWaterfrontCatalogFit019)host.scrollTop=0;}
// The old hall adapter accepts an ID, while cards pass tool objects. Preserve
// every unrelated argument exactly, including native object callers.
const __quarterToolSize019=toolSize458;toolSize458=function(t){const id=typeof t==='string'?t:t?.id;return __quarterToolSize019.call(this,waterfrontTool018(id)?id:t);};
const __quarterCatalogCats019=renderCatalogCats458;renderCatalogCats458=function(){__quarterCatalogCats019();const host=$('#catalogCats458');if(!host)return;const b=document.createElement('button');b.textContent='🌊 水岸街區';b.dataset.quarterCollection019='1';b.style.minHeight='44px';b.classList.toggle('on',catalogCat458==='waterfront019');b.onclick=quarterEnterCollection019;host.appendChild(b);};
const __quarterCatalogRender019=renderBuildCatalog458;renderBuildCatalog458=function(){quarterCatalogFit019();__quarterCatalogRender019();if(catalogCat458!=='waterfront019')return;const host=$('#catalogResults458');if(host)host.insertAdjacentHTML('afterbegin','<div class="catalogEmpty458" data-quarter-guide019>先建展館，再用入口廣場與紅磚步道連向岸邊；長椅、解說台與木亭放在步道旁。每件獨立購買，金額依原生施工報價。訪客是展館營運的視覺呈現。</div>');};
/* GPT-019 CATALOG FIT END */
const __quarterPlacement019=placementStatus459;placementStatus459=function(id,x,y){const s=__quarterPlacement019(id,x,y);if(s&&!s.err&&!s.poor&&(QUARTER_PATH019[id]||waterfrontTool018(id))){const c=quarterConnection019(id,x,y);if(c)s.sub+=' · '+c.text;}return s;};
