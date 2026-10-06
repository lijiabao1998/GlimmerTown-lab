/* GPT-015: optional original street details on native paid T502 footpaths.
 * No building IDs, economic/service modifiers, new save format or RNG changes.
 */
const STREETSCAPE_ROWS015=Object.freeze([
  ['heritageLantern','英式六角鑄鐵街燈','Heritage fluted hexagonal lantern','💡','街燈 鑄鐵 六角 燈柱',true],
  ['basketLamp','英式花籃彎頸街燈','Swan-neck flower-basket lamp','💐','街燈 花籃 彎頸',true],
  ['teaTradeSign','英式茶室懸招步道','Tea-room iron-bracket trade sign','🫖','店招 茶室 茶壺 懸招',false],
  ['bookTradeSign','英式書店懸招步道','Bookshop gilded trade sign','📖','店招 書店 書本 懸招',false],
  ['ironUrn','英式鑄鐵花甕步道','Cast-iron urn planting','🏺','花箱 花甕 鑄鐵 花壇',false],
  ['roseTrellis','英式玫瑰木花架步道','Rose trellis and timber trough','🌹','花箱 木槽 玫瑰 花架',false],
  ['sundialCourt','英式日晷磚庭步道','Sundial brick courtyard','☀️','庭院 日晷 磚地 石座',false],
  ['wicketCourt','英式小院木門步道','Open garden wicket and espalier','🚪','庭院 木門 磚牆 果樹',false]
].map(Object.freeze));
const STREETSCAPE_PATH015=Object.freeze(Object.fromEntries(STREETSCAPE_ROWS015.map(([theme,nm,en,ic,keywords,lit])=>[theme+'015',Object.freeze({id:theme+'015',theme,nm,en,ic,keywords,lit,sz:1,rank:4})])));
const STREETSCAPE_THEME015=Object.freeze(Object.fromEntries(Object.values(STREETSCAPE_PATH015).map(q=>[q.theme,q])));
let streetscapeArtCanonical015=null;
function streetscapeTheme015(t){const theme=t?.amx502?.british015;return t?.am502===1&&Object.prototype.hasOwnProperty.call(STREETSCAPE_THEME015,theme)?theme:null;}
function streetscapeDescription015(q){return '獨立付費原生步道，步行成本 0.72；'+q.nm+'為可拆除的街區配景。建造時朝四格內最近直線道路對齊並保存方向。'+(q.lit?'燈具只讀取一格相鄰道路的原生夜間供電。':'此配景不發光。')+'不提供額外職位、收入、服務或觀光容量。';}
function streetscapeConflict015(id,x,y){
  if(['doze','wpipe','waterMain','sewerMain','udline','ugcable'].includes(id))return null;
  const cells=[];
  if(['tdig','tland','traise'].includes(id)&&terraBrush===3)cells.push(...terraCells(x,y));
  else{const size=Math.max(1,toolSize458(id)||1);for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)cells.push([x+dx,y+dy]);}
  for(const [xx,yy]of cells)if(inMap(xx,yy)&&streetscapeTheme015(tiles[idx(xx,yy)]))return '先拆除英式街區配景步道';
  return null;
}
function installStreetscapeArt015(){
  if(!streetscapeArtCanonical015){
    const start=performance.now(),a=window.BritishStreetscapeArchitecture015.buildAll(),expected=Object.keys(STREETSCAPE_THEME015).flatMap(t=>[0,1,2,3].map(v=>t+'_'+v));
    if(Object.keys(a.modules||{}).sort().join(',')!==[...expected].sort().join(','))throw Error('GPT-015 requires exactly32 declared street-detail views');
    for(const theme of Object.keys(STREETSCAPE_THEME015))for(let view=0;view<4;view++){
      const s=a.modules[theme+'_'+view];
      if(!s?.img||!s?.night||s.sz!==1||s.view!==view||s.w!==72||s.h!==92||s.ax!==36||s.ay!==90)throw Error('Invalid original streetscape geometry '+theme+'/'+view);
    }
    streetscapeArtCanonical015=a.modules;window.__streetscapeArt015={builds:1,total:32,ms:performance.now()-start};
  }
  SPR.streetscape015=streetscapeArtCanonical015;
}
function streetscapeObjects015(objs,sxOf,syOf,vis,lodFar){
  if(lodFar||window.__noStreetscapeArt015||!SPR.streetscape015)return;
  for(const i of amCells502){const t=tiles[i],theme=streetscapeTheme015(t);if(!theme)continue;const x=i%N,y=(i/N)|0,sx=sxOf(x,y),sy=syOf(x,y);if(vis(sx,sy))objs.push({dep:viewDep(x,y)+.015,streetscapeModule015:theme,x,y,sx,sy});}
}
function streetscapeModuleDraw015(g,o,z,depth,night,occ){
  const t=tiles[idx(o.x,o.y)],theme=o.streetscapeModule015,s=SPR.streetscape015[theme+'_'+(((t.amx502?.turn015||0)+viewRotEff())&3)];if(!s)return;
  const x=o.sx+(32-s.ax)*z,y=o.sy+(32-s.ay)*z;
  g.drawImage(s.img,x,y,s.w*z,s.h*z);occ(s.img,x,y,s.w*z,s.h*z);
  if(depth>0&&STREETSCAPE_THEME015[theme].lit&&s.night){const light=complexPathLight014(o.x,o.y);if(light.source&&light.service>.03)night.push({img:s.night,x,y,w:s.w*z,h:s.h*z,grid487:1,gx:light.source.x,gy:light.source.y,warm649:1});}
}
function streetscapeSpecs015(){return JSON.parse(JSON.stringify({paths:Object.values(STREETSCAPE_PATH015).map(q=>({...q,base:'footpath502',cost:COST.footpath502})),authority:{walking:'T502',light:'T487 physical adjacent road',construction:'native instant path completion',extraIncome:0,extraJobs:0,extraServices:0}}));}
function streetscapeAt015(x,y){if(!inMap(x,y))return null;const root=idx(x,y),t=tiles[root],theme=streetscapeTheme015(t);return theme?{root,x,y,theme,am502:t.am502,amx502:JSON.parse(JSON.stringify(t.amx502)),walkCost:(WALK_COST502[root]||0)*amWeatherFactor502('walk',1),baseWalkCost:.72,cost:COST.footpath502,lighting:complexPathLight014(x,y)}:null;}
function streetscapeEvidence015(){const paths=[];for(const i of amCells502)if(streetscapeTheme015(tiles[i]))paths.push(streetscapeAt015(i%N,(i/N)|0));return{day,paths,art:{...window.__streetscapeArt015}};}
function streetscapeSelftest015(){
  const details=[],add=(name,ok)=>details.push({name,ok:!!ok});
  add('exact eight optional themes with no building identities',Object.keys(STREETSCAPE_PATH015).length===8&&Object.values(STREETSCAPE_PATH015).every(q=>!Object.hasOwn(q,'k')&&q.sz===1));
  for(const q of Object.values(STREETSCAPE_PATH015)){
    add(q.id+' native paid manual-only walking theme',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===COST.footpath502&&AM_META502.footpath502.c===1&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only');
    for(let v=0;v<4;v++){const s=SPR.streetscape015?.[q.theme+'_'+v];add(q.theme+'_'+v+' canonical complete geometric view',s===streetscapeArtCanonical015?.[q.theme+'_'+v]&&!!s?.img&&!!s?.night&&s.sz===1&&s.view===v&&s.w===72&&s.h===92&&s.ax===36&&s.ay===90);}
  }
  add('physical lamp themes are explicit and bounded',Object.values(STREETSCAPE_PATH015).filter(q=>q.lit).map(q=>q.theme).join(',')==='heritageLantern,basketLamp');
  add('exact32 original assets built once',window.__streetscapeArt015?.total===32&&window.__streetscapeArt015.builds===1);
  add('all existing complex and street registries retained',Object.keys(COMPLEX014).length===12&&Object.keys(COMPLEX_PATH014).length===16&&Object.keys(STREETLIFE_PATH009).length===3&&Object.keys(THEATRE_PATH013).length===6);
  return{ok:details.every(q=>q.ok),checks:details.map(q=>q.name+(q.ok?' ✓':' ✗')),details};
}
/* GPT-015 LATE NATIVE HOOKS */
const __streetscapeCan015=canPlace;canPlace=function(id,x,y){
  const owned=streetscapeConflict015(id,x,y);if(owned)return owned;
  const q=STREETSCAPE_PATH015[id];if(!q)return __streetscapeCan015(id,x,y);
  if(window.__noStreetscape015)return '英式街區配景暫停新增';
  if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';
  const err=__streetscapeCan015('footpath502',x,y);if(err)return err;const t=tiles[idx(x,y)];
  if(t.tree)return '先移除樹木';if(t.zone||t.office)return '先取消既有分區';
  if(t.lv475||t.hv471||t.fly475||t.ix475)return '既有架空基礎設施擋住';
  if(t.deco||t.rdec||t.parkMeter||t.bus||t.dock||t.levee)return '先移除既有地面設施或裝飾';
  return null;
};
const __streetscapeCost015=placeCost;placeCost=function(id,x,y){return __streetscapeCost015(STREETSCAPE_PATH015[id]?'footpath502':id,x,y);};
const __streetscapePlace015=doPlace;doPlace=function(id,x,y,silent){
  const q=STREETSCAPE_PATH015[id];if(!q)return __streetscapePlace015(id,x,y,silent);
  const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}
  if(!__streetscapePlace015('footpath502',x,y,true))return false;
  tiles[idx(x,y)].amx502={british015:q.theme,turn015:complexRoadTurn014(x,y)};activeMobilityMarkDirty502();
  if(!silent)toast(q.ic+' '+q.nm+' 完工','gold');return true;
};
for(const q of Object.values(STREETSCAPE_PATH015)){
  COST[q.id]=COST.footpath502;const t={id:q.id,cat:'road',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:0,size:1,status:'manual-only',decision:'manual-only'};
}
CATALOG_SECTIONS458.find(q=>q[0]==='transit')[2].push(...Object.keys(STREETSCAPE_PATH015));
const __streetscapeKeywords015=catalogKeywords458;catalogKeywords458=function(t){const q=STREETSCAPE_PATH015[t?.id];return q?(__streetscapeKeywords015(t)+' '+q.en+' 英式 英國 '+q.keywords).toLowerCase():__streetscapeKeywords015(t);};
const __streetscapeInspect015=inspect;inspect=function(x,y){const out=__streetscapeInspect015(x,y),theme=inMap(x,y)?streetscapeTheme015(tiles[idx(x,y)]):null;if(theme&&$('#infoBody'))$('#infoBody').insertAdjacentHTML('beforeend','<div class="row">'+streetscapeDescription015(STREETSCAPE_THEME015[theme])+'</div>');return out;};
