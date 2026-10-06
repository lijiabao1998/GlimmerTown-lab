/* GPT-016: optional original garden-life details on native paid T502 footpaths.
 * No building IDs, economic/service modifiers, new save format or RNG changes.
 */
const GARDENLIFE_ROWS016=Object.freeze([
  ['pumpCourt','英式手壓水泵庭角','Cast-iron garden hand-pump court','🪣','庭院 手壓 水泵 裝飾',false],
  ['birdbathCourt','英式鳥浴石盆庭角','Carved-stone birdbath court','🐦','花園 鳥浴 石盆',false],
  ['pottingBench','英式園藝工作桌步道','Timber potting bench and seed trays','🪴','園藝 工作桌 陶盆 澆水壺',false],
  ['croquetCorner','英式槌球休憩角步道','Croquet equipment and lawn corner','🏑','花園 槌球 球門 球桿',false],
  ['chessCourt','英式戶外棋桌步道','Stone outdoor chess table and seats','♟️','庭院 棋桌 石凳',false],
  ['orchardPress','英式果園木壓榨架步道','Oak orchard screw press and tub','🍎','果園 木架 壓榨 裝飾',false]
].map(Object.freeze));
const GARDENLIFE_PATH016=Object.freeze(Object.fromEntries(GARDENLIFE_ROWS016.map(([theme,nm,en,ic,keywords,lit])=>[theme+'016',Object.freeze({id:theme+'016',theme,nm,en,ic,keywords,lit,sz:1,rank:4})])));
const GARDENLIFE_THEME016=Object.freeze(Object.fromEntries(Object.values(GARDENLIFE_PATH016).map(q=>[q.theme,q])));
let gardenLifeArtCanonical016=null;
function gardenLifeTheme016(t){const theme=t?.amx502?.british016;return t?.am502===1&&Object.prototype.hasOwnProperty.call(GARDENLIFE_THEME016,theme)?theme:null;}
function gardenLifeDescription016(q){return '獨立付費原生步道，步行成本 0.72；'+q.nm+'為可拆除的花園配景。建造時朝四格內最近直線道路對齊並保存方向。'+(q.lit?'燈具只讀取一格相鄰道路的原生夜間供電。':'此配景不發光。')+'不提供水源、產物、棋局或額外職位、收入、服務與觀光容量。';}
function gardenLifeConflict016(id,x,y){
  if(['doze','wpipe','waterMain','sewerMain','udline','ugcable'].includes(id))return null;
  const cells=[];
  if(['tdig','tland','traise'].includes(id)&&terraBrush===3)cells.push(...terraCells(x,y));
  else{const size=Math.max(1,toolSize458(id)||1);for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)cells.push([x+dx,y+dy]);}
  for(const [xx,yy]of cells)if(inMap(xx,yy)&&gardenLifeTheme016(tiles[idx(xx,yy)]))return '先拆除英式花園配景步道';
  return null;
}
function installGardenLifeArt016(){
  if(!gardenLifeArtCanonical016){
    const start=performance.now(),a=window.BritishGardenLifeArchitecture016.buildAll(),expected=Object.keys(GARDENLIFE_THEME016).flatMap(t=>[0,1,2,3].map(v=>t+'_'+v));
    if(Object.keys(a.modules||{}).sort().join(',')!==[...expected].sort().join(','))throw Error('GPT-016 requires exactly24 declared garden-life views');
    for(const theme of Object.keys(GARDENLIFE_THEME016))for(let view=0;view<4;view++){
      const s=a.modules[theme+'_'+view];
      if(!s?.img||!s?.night||s.sz!==1||s.view!==view||s.w!==72||s.h!==92||s.ax!==36||s.ay!==90)throw Error('Invalid original gardenLife geometry '+theme+'/'+view);
    }
    gardenLifeArtCanonical016=a.modules;window.__gardenLifeArt016={builds:1,total:24,ms:performance.now()-start};
  }
  SPR.gardenLife016=gardenLifeArtCanonical016;
}
function gardenLifeObjects016(objs,sxOf,syOf,vis,lodFar){
  if(lodFar||window.__noGardenLifeArt016||!SPR.gardenLife016)return;
  for(const i of amCells502){const t=tiles[i],theme=gardenLifeTheme016(t);if(!theme)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(vis(sx,sy))objs.push({dep:viewDep(x,y)+.016,gardenLifeModule016:theme,x,y,sx,sy});}
}
function gardenLifeModuleDraw016(g,o,z,depth,night,occ){
  const t=tiles[idx(o.x,o.y)],theme=o.gardenLifeModule016,s=SPR.gardenLife016[theme+'_'+(((t.amx502?.turn016||0)+viewRotEff())&3)];if(!s)return;
  const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;
  g.drawImage(s.img,x,y,s.w*z,s.h*z);occ(s.img,x,y,s.w*z,s.h*z);
  // All six are non-emissive. No night sprite, supplied flag or fake water source is added.
}
function gardenLifeSpecs016(){return JSON.parse(JSON.stringify({paths:Object.values(GARDENLIFE_PATH016).map(q=>({...q,base:'footpath502',cost:COST.footpath502})),authority:{walking:'T502',light:'non-emissive original garden geometry',construction:'native instant path completion',extraIncome:0,extraJobs:0,extraServices:0}}));}
function gardenLifeAt016(x,y){if(!inMap(x,y))return null;const root=idx(x,y),t=tiles[root],theme=gardenLifeTheme016(t);return theme?{root,x,y,theme,am502:t.am502,amx502:JSON.parse(JSON.stringify(t.amx502)),walkCost:(WALK_COST502[root]||0)*amWeatherFactor502('walk',1),baseWalkCost:.72,cost:COST.footpath502,lighting:complexPathLight014(x,y)}:null;}
function gardenLifeEvidence016(){const paths=[];for(const i of amCells502)if(gardenLifeTheme016(tiles[i]))paths.push(gardenLifeAt016(i%N,(i/N)|0));return{day,paths,art:{...window.__gardenLifeArt016}};}
function gardenLifeSelftest016(){
  const details=[],add=(name,ok)=>details.push({name,ok:!!ok});
  add('exact six optional garden themes with no building identities',Object.keys(GARDENLIFE_PATH016).length===6&&Object.values(GARDENLIFE_PATH016).every(q=>!Object.hasOwn(q,'k')&&q.sz===1));
  for(const q of Object.values(GARDENLIFE_PATH016)){
    add(q.id+' native paid manual-only walking theme',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===COST.footpath502&&AM_META502.footpath502.c===1&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only');
    for(let v=0;v<4;v++){const s=SPR.gardenLife016?.[q.theme+'_'+v];add(q.theme+'_'+v+' canonical complete geometric view',s===gardenLifeArtCanonical016?.[q.theme+'_'+v]&&!!s?.img&&!!s?.night&&s.sz===1&&s.view===v&&s.w===72&&s.h===92&&s.ax===36&&s.ay===90);}
  }
  add('all six garden themes are strictly non-emissive',Object.values(GARDENLIFE_PATH016).every(q=>q.lit===false));
  add('exact24 original assets built once',window.__gardenLifeArt016?.total===24&&window.__gardenLifeArt016.builds===1);
  add('all existing complex and street registries retained',Object.keys(STREETSCAPE_PATH015).length===8&&Object.keys(COMPLEX014).length===12&&Object.keys(COMPLEX_PATH014).length===16&&Object.keys(STREETLIFE_PATH009).length===3&&Object.keys(THEATRE_PATH013).length===6);
  return{ok:details.every(q=>q.ok),checks:details.map(q=>q.name+(q.ok?' ✓':' ✗')),details};
}
/* GPT-016 LATE NATIVE HOOKS */
const __gardenLifeCan016=canPlace;canPlace=function(id,x,y){
  const owned=gardenLifeConflict016(id,x,y);if(owned)return owned;
  const q=GARDENLIFE_PATH016[id];if(!q)return __gardenLifeCan016(id,x,y);
  if(window.__noGardenLife016)return '英式花園配景暫停新增';
  if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';
  const err=__gardenLifeCan016('footpath502',x,y);if(err)return err;const t=tiles[idx(x,y)];
  if(t.tree)return '先移除樹木';if(t.zone||t.office)return '先取消既有分區';
  if(t.lv475||t.hv471||t.fly475||t.ix475)return '既有架空基礎設施擋住';
  if(t.deco||t.rdec||t.parkMeter||t.bus||t.dock||t.levee)return '先移除既有地面設施或裝飾';
  return null;
};
const __gardenLifeCost016=placeCost;placeCost=function(id,x,y){return __gardenLifeCost016(GARDENLIFE_PATH016[id]?'footpath502':id,x,y);};
const __gardenLifePlace016=doPlace;doPlace=function(id,x,y,silent){
  const q=GARDENLIFE_PATH016[id];if(!q)return __gardenLifePlace016(id,x,y,silent);
  const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}
  if(!__gardenLifePlace016('footpath502',x,y,true))return false;
  tiles[idx(x,y)].amx502={british016:q.theme,turn016:complexRoadTurn014(x,y)};activeMobilityMarkDirty502();
  if(!silent)toast(q.ic+' '+q.nm+' 完工','gold');return true;
};
for(const q of Object.values(GARDENLIFE_PATH016)){
  COST[q.id]=COST.footpath502;const t={id:q.id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:0,size:1,status:'manual-only',decision:'manual-only'};
}
CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(GARDENLIFE_PATH016));
const __gardenLifeKeywords016=catalogKeywords458;catalogKeywords458=function(t){const q=GARDENLIFE_PATH016[t?.id];return q?(__gardenLifeKeywords016(t)+' '+q.en+' 英式 英國 '+q.keywords).toLowerCase():__gardenLifeKeywords016(t);};
const __gardenLifeInspect016=inspect;inspect=function(x,y){const out=__gardenLifeInspect016(x,y),theme=inMap(x,y)?gardenLifeTheme016(tiles[idx(x,y)]):null;if(theme&&$('#infoBody'))$('#infoBody').insertAdjacentHTML('beforeend','<div class="row">'+gardenLifeDescription016(GARDENLIFE_THEME016[theme])+'</div>');return out;};
