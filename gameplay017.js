/* GPT-017: optional original quayside details on native paid T502 footpaths.
 * No building IDs, economic/service modifiers, new save format or RNG changes.
 */
const QUAYSIDE_ROWS017=Object.freeze([
  ['mooringBitts','英式繫船柱步道','Paired quay mooring bitts and rope coil','🪢','碼頭 繫船柱 纜繩',false],
  ['quayCapstan','英式碼頭絞盤步道','Timber and iron quay capstan','⚙️','碼頭 絞盤 木柄',false],
  ['lifebuoyStand','英式救生圈架步道','Quayside lifebuoy and timber holder','🛟','碼頭 救生圈 木架',false],
  ['anchorDisplay','英式船錨陳設步道','Admiralty-inspired anchor display','⚓','碼頭 船錨 石座 陳設',false],
  ['withyPots','英式柳編漁簍步道','Cornish withy pots and cork floats','🦞','漁港 柳編 漁簍 浮標',false],
  ['netDryingRack','英式曬網架步道','Braced timber net-drying frame','🕸️','漁港 曬網 漁網 木架',false]
].map(Object.freeze));
const QUAYSIDE_PATH017=Object.freeze(Object.fromEntries(QUAYSIDE_ROWS017.map(([theme,nm,en,ic,keywords,lit])=>[theme+'017',Object.freeze({id:theme+'017',theme,nm,en,ic,keywords,lit,sz:1,rank:4})])));
const QUAYSIDE_THEME017=Object.freeze(Object.fromEntries(Object.values(QUAYSIDE_PATH017).map(q=>[q.theme,q])));
let quaysideArtCanonical017=null;
function quaysideTheme017(t){const theme=t?.amx502?.british017;return t?.am502===1&&Object.prototype.hasOwnProperty.call(QUAYSIDE_THEME017,theme)?theme:null;}
function quaysideDescription017(q){return '可獨立購買與拆除的碼頭街景步道；'+q.nm+'保留正常步行通行，建造時朝附近直線道路對齊並保存方向。此配景不發光，不新增船隻、泊位、捕撈產物、運輸、救援服務或額外收入。';}
function quaysideConflict017(id,x,y){
  if(['doze','wpipe','waterMain','sewerMain','udline','ugcable'].includes(id))return null;
  const cells=[];
  if(['tdig','tland','traise'].includes(id)&&terraBrush===3)cells.push(...terraCells(x,y));
  else{const size=Math.max(1,toolSize458(id)||1);for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)cells.push([x+dx,y+dy]);}
  for(const [xx,yy]of cells)if(inMap(xx,yy)&&quaysideTheme017(tiles[idx(xx,yy)]))return '先拆除英式碼頭配景步道';
  return null;
}
function installQuaysideArt017(){
  if(!quaysideArtCanonical017){
    const start=performance.now(),a=window.BritishQuaysideArchitecture017.buildAll(),expected=Object.keys(QUAYSIDE_THEME017).flatMap(t=>[0,1,2,3].map(v=>t+'_'+v));
    if(Object.keys(a.modules||{}).sort().join(',')!==[...expected].sort().join(','))throw Error('GPT-017 requires exactly24 declared quayside views');
    for(const theme of Object.keys(QUAYSIDE_THEME017))for(let view=0;view<4;view++){
      const s=a.modules[theme+'_'+view];
      if(!s?.img||!s?.night||s.sz!==1||s.view!==view||s.w!==72||s.h!==92||s.ax!==36||s.ay!==90)throw Error('Invalid original quayside geometry '+theme+'/'+view);
    }
    quaysideArtCanonical017=a.modules;window.__quaysideArt017={builds:1,total:24,ms:performance.now()-start};
  }
  SPR.quayside017=quaysideArtCanonical017;
}
function quaysideObjects017(objs,sxOf,syOf,vis,lodFar){
  if(lodFar||window.__noQuaysideArt017||!SPR.quayside017)return;
  for(const i of amCells502){const t=tiles[i],theme=quaysideTheme017(t);if(!theme)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(vis(sx,sy))objs.push({dep:viewDep(x,y)+.017,quaysideModule017:theme,x,y,sx,sy});}
}
function quaysideModuleDraw017(g,o,z,depth,night,occ){
  const t=tiles[idx(o.x,o.y)],theme=o.quaysideModule017,s=SPR.quayside017[theme+'_'+(((t.amx502?.turn017||0)+viewRotEff())&3)];if(!s)return;
  const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;
  g.drawImage(s.img,x,y,s.w*z,s.h*z);occ(s.img,x,y,s.w*z,s.h*z);
  // All six are non-emissive. No night sprite, supplied flag, working vessel or maritime service is added.
}
function quaysideSpecs017(){return JSON.parse(JSON.stringify({paths:Object.values(QUAYSIDE_PATH017).map(q=>({...q,base:'footpath502',cost:COST.footpath502})),authority:{walking:'T502',light:'non-emissive original quayside geometry',construction:'native instant path completion',extraIncome:0,extraJobs:0,extraServices:0}}));}
function quaysideAt017(x,y){if(!inMap(x,y))return null;const root=idx(x,y),t=tiles[root],theme=quaysideTheme017(t);return theme?{root,x,y,theme,am502:t.am502,amx502:JSON.parse(JSON.stringify(t.amx502)),walkCost:(WALK_COST502[root]||0)*amWeatherFactor502('walk',1),baseWalkCost:.72,cost:COST.footpath502,lighting:complexPathLight014(x,y)}:null;}
function quaysideEvidence017(){const paths=[];for(const i of amCells502)if(quaysideTheme017(tiles[i]))paths.push(quaysideAt017(i%N,(i/N)|0));return{day,paths,art:{...window.__quaysideArt017}};}
function quaysideSelftest017(){
  const details=[],add=(name,ok)=>details.push({name,ok:!!ok});
  add('exact six optional quayside themes with no building identities',Object.keys(QUAYSIDE_PATH017).length===6&&Object.values(QUAYSIDE_PATH017).every(q=>!Object.hasOwn(q,'k')&&q.sz===1));
  for(const q of Object.values(QUAYSIDE_PATH017)){
    add(q.id+' native paid manual-only walking theme',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===COST.footpath502&&AM_META502.footpath502.c===1&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only');
    for(let v=0;v<4;v++){const s=SPR.quayside017?.[q.theme+'_'+v];add(q.theme+'_'+v+' canonical complete geometric view',s===quaysideArtCanonical017?.[q.theme+'_'+v]&&!!s?.img&&!!s?.night&&s.sz===1&&s.view===v&&s.w===72&&s.h===92&&s.ax===36&&s.ay===90);}
  }
  add('all six quayside themes are strictly non-emissive',Object.values(QUAYSIDE_PATH017).every(q=>q.lit===false));
  add('exact24 original assets built once',window.__quaysideArt017?.total===24&&window.__quaysideArt017.builds===1);
  add('all existing complex and street registries retained',Object.keys(GARDENLIFE_PATH016).length===6&&Object.keys(STREETSCAPE_PATH015).length===8&&Object.keys(COMPLEX014).length===12&&Object.keys(COMPLEX_PATH014).length===16&&Object.keys(STREETLIFE_PATH009).length===3&&Object.keys(THEATRE_PATH013).length===6);
  return{ok:details.every(q=>q.ok),checks:details.map(q=>q.name+(q.ok?' ✓':' ✗')),details};
}
/* GPT-017 LATE NATIVE HOOKS */
const __quaysideCan017=canPlace;canPlace=function(id,x,y){
  const owned=quaysideConflict017(id,x,y);if(owned)return owned;
  const q=QUAYSIDE_PATH017[id];if(!q)return __quaysideCan017(id,x,y);
  if(window.__noQuayside017)return '英式碼頭配景暫停新增';
  if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';
  const err=__quaysideCan017('footpath502',x,y);if(err)return err;const t=tiles[idx(x,y)];
  if(t.tree)return '先移除樹木';if(t.zone||t.office)return '先取消既有分區';
  if(t.lv475||t.hv471||t.fly475||t.ix475)return '既有架空基礎設施擋住';
  if(t.deco||t.rdec||t.parkMeter||t.bus||t.dock||t.levee)return '先移除既有地面設施或裝飾';
  return null;
};
const __quaysideCost017=placeCost;placeCost=function(id,x,y){return __quaysideCost017(QUAYSIDE_PATH017[id]?'footpath502':id,x,y);};
const __quaysidePlace017=doPlace;doPlace=function(id,x,y,silent){
  const q=QUAYSIDE_PATH017[id];if(!q)return __quaysidePlace017(id,x,y,silent);
  const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}
  if(!__quaysidePlace017('footpath502',x,y,true))return false;
  tiles[idx(x,y)].amx502={british017:q.theme,turn017:complexRoadTurn014(x,y)};activeMobilityMarkDirty502();
  if(!silent)toast(q.ic+' '+q.nm+' 完工','gold');return true;
};
for(const q of Object.values(QUAYSIDE_PATH017)){
  COST[q.id]=COST.footpath502;const t={id:q.id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:0,size:1,status:'manual-only',decision:'manual-only'};
}
CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(QUAYSIDE_PATH017));
const __quaysideKeywords017=catalogKeywords458;catalogKeywords458=function(t){const q=QUAYSIDE_PATH017[t?.id];return q?(__quaysideKeywords017(t)+' '+q.en+' 英式 英國 '+q.keywords).toLowerCase():__quaysideKeywords017(t);};
const __quaysideInspect017=inspect;inspect=function(x,y){const out=__quaysideInspect017(x,y),theme=inMap(x,y)?quaysideTheme017(tiles[idx(x,y)]):null;if(theme&&$('#infoBody'))$('#infoBody').insertAdjacentHTML('beforeend','<div class="row">'+quaysideDescription017(QUAYSIDE_THEME017[theme])+'</div>');return out;};
