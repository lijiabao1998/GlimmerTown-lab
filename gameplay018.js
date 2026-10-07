/* GPT-018: two optional heritage appearances for the existing native k287 court.
 * Native placement, costs, services, staffing, construction and simulation remain
 * authoritative. Only tagged instances receive the new sprite and visitor label.
 */
const WATERFRONT_BASE018='manorStableCourt014';
const WATERFRONT_TOOL018=Object.freeze({
  lifeboatHeritageHall018:Object.freeze({id:'lifeboatHeritageHall018',theme:'lifeboatHall',nm:'英式海難救援史展館',en:'British lifeboat heritage hall',ic:'🏛️',keywords:'水岸 海事 海難 救生艇 文物 展館',rank:4,sz:2,k:287}),
  canalTollhouseExhibit018:Object.freeze({id:'canalTollhouseExhibit018',theme:'canalTollhouse',nm:'英式運河收費亭展館',en:'British canal tollhouse exhibit',ic:'🏛️',keywords:'水岸 運河 八角 收費亭 文物 展館',rank:4,sz:2,k:287})
});
const WATERFRONT_THEME018=Object.freeze(Object.fromEntries(Object.values(WATERFRONT_TOOL018).map(q=>[q.theme,q])));
let waterfrontArtCanonical018=null;
function waterfrontTool018(id){return typeof id==='string'&&Object.prototype.hasOwnProperty.call(WATERFRONT_TOOL018,id)?WATERFRONT_TOOL018[id]:null;}
function waterfrontAppearance018(b){return b&&!b.ref&&b.k===287&&typeof b.waterfront018==='string'&&Object.prototype.hasOwnProperty.call(WATERFRONT_THEME018,b.waterfront018)?b.waterfront018:null;}
function waterfrontDescription018(q){return q.theme==='lifeboatHall'?'以舊救生艇屋為題的海事文物參觀展館。需要道路、供電、供水、設備及實際職員才能提供休閒；展示海難救援歷史，不執行救援或船舶運輸。':'以八角運河收費亭為題的文物參觀展館。需要道路、供電、供水、設備及實際職員才能提供休閒；展示運河歷史，不收通行費、不操作船閘或船舶。';}
function installWaterfrontArt018(){
  if(!waterfrontArtCanonical018){
    const start=performance.now(),art=window.BritishWaterfrontHeritage018.buildAll(),expected=Object.keys(WATERFRONT_THEME018).flatMap(t=>[0,1,2,3].map(v=>t+'_'+v));
    if(Object.keys(art).sort().join(',')!==[...expected].sort().join(','))throw Error('GPT-018 requires exactly eight authored heritage views');
    const sprites={};
    for(const theme of Object.keys(WATERFRONT_THEME018))for(let view=0;view<4;view++){
      const key=theme+'_'+view,s=art[key];
      if(!s?.img||!s?.night||s.sz!==2||s.view!==view||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.family!=='waterfront018'||s.appearance!==theme||s.nativeBaseK!==287||s.physicalLampCount!==2)throw Error('Invalid original waterfront geometry '+key);
      sprites[key]={...s,smoke:[],__waterfront018:1,__t479:1,__t547:{k:287,lv:1,v:view,bw:2,bh:2}};
    }
    waterfrontArtCanonical018=sprites;window.__waterfrontArt018={builds:1,total:8,ms:performance.now()-start};
  }
  SPR.waterfront018=waterfrontArtCanonical018;
}
function waterfrontSprite018(b,fallback){
  const theme=waterfrontAppearance018(b);
  if(!theme||window.__noWaterfrontArt018)return fallback;
  return SPR.waterfront018?.[theme+'_'+(((b.v||0)+viewRotEff())&3)]||fallback;
}
function waterfrontSave018(){
  const rows=[];
  for(let i=0;i<tiles.length;i++){const theme=waterfrontAppearance018(tiles[i]?.bld);if(theme)rows.push([i,theme]);}
  return rows.length?rows:null;
}
function waterfrontLoad018(raw){
  if(raw===undefined||raw===null)return{ok:true,count:0};
  if(!Array.isArray(raw)||raw.length>tiles.length)return{ok:false,count:0};
  const seen=new Set();
  for(const row of raw){
    if(!Array.isArray(row)||row.length!==2||!Number.isInteger(row[0])||row[0]<0||row[0]>=tiles.length||seen.has(row[0])||typeof row[1]!=='string'||!Object.prototype.hasOwnProperty.call(WATERFRONT_THEME018,row[1]))return{ok:false,count:0};
    const b=tiles[row[0]]?.bld;
    if(!b||b.ref||b.k!==287||b.sz!==2)return{ok:false,count:0};
    seen.add(row[0]);
  }
  for(const [i,theme]of raw)tiles[i].bld.waterfront018=theme;
  return{ok:true,count:raw.length};
}
function waterfrontSpecs018(){
  const q=COMPLEX014[287];
  return JSON.parse(JSON.stringify({appearances:Object.values(WATERFRONT_TOOL018).map(t=>({...t,base:WATERFRONT_BASE018,cost:q.cost,jobs:q.jobs,leisure:q.leisure,upkeep:q.upkeep,power:q.power,water:q.water})),authority:{placement:'existing native k287',construction:'native nine-day construction',staff:'T495',leisure:'T491',save:'optional sparse appearance tag only',extraIncome:0,extraServices:0,newBuildingIDs:0}}));
}
function waterfrontAt018(x,y){
  if(!inMap(x,y))return null;let root=idx(x,y),b=tiles[root]?.bld;
  if(b?.ref){root=idx(b.ref[0],b.ref[1]);b=tiles[root]?.bld;}
  const theme=waterfrontAppearance018(b);if(!theme)return null;
  return{root,x:root%N,y:(root/N)|0,k:b.k,theme,v:b.v,age:b.age,sz:b.sz,appearance:b.waterfront018,native:complexAt014(root%N,(root/N)|0)};
}
function waterfrontEvidence018(){const roots=[];for(const i of tickBld||[]){const q=waterfrontAt018(i%N,(i/N)|0);if(q)roots.push(q);}return{day,roots,art:{...window.__waterfrontArt018},savedAppearances:waterfrontSave018()};}
function waterfrontSelftest018(){
  const details=[],add=(name,ok)=>details.push({name,ok:!!ok}),base=COMPLEX014[287];
  add('exact two optional appearances over the original visitor court',Object.keys(WATERFRONT_TOOL018).length===2&&Object.keys(COMPLEX014).join(',')==='282,283,284,285,286,287,288,289,290,291,292,293'&&base.id===WATERFRONT_BASE018&&base.sz===2&&base.cost===1250&&base.jobs===5&&base.leisure===70&&base.upkeep===3&&base.power===1.2&&base.water===1.8);
  for(const q of Object.values(WATERFRONT_TOOL018)){
    add(q.id+' exact native catalog and manual-only placement',TOOLS.filter(t=>t.id===q.id).length===1&&COST[q.id]===COST[WATERFRONT_BASE018]&&toolSize458(q.id)===2&&MAYOR_ACTION_CATALOG470A[q.id]?.status==='manual-only'&&MAYOR_ACTION_CATALOG470A[q.id]?.k===287);
    for(let view=0;view<4;view++){const s=SPR.waterfront018?.[q.theme+'_'+view];add(q.theme+'_'+view+' original complete view',s===waterfrontArtCanonical018?.[q.theme+'_'+view]&&s?.__waterfront018===1&&s.sz===2&&s.view===view&&s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&!!s.img&&!!s.night&&s.physicalLampCount===2);}
  }
  add('original k287 canonical atlas remains unchanged',Array.from({length:4},(_,v)=>SPR.bld['287_1_'+v]===complexArtCanonical014?.bld['287_1_'+v]).every(Boolean));
  add('eight independent assets built once',window.__waterfrontArt018?.total===8&&window.__waterfrontArt018?.builds===1);
  add('all twenty previous optional path details retained',Object.keys(STREETSCAPE_PATH015).length===8&&Object.keys(GARDENLIFE_PATH016).length===6&&Object.keys(QUAYSIDE_PATH017).length===6);
  add('original map-edge sprite selects only outward faces',window.MapEdgeRepair018?.selftest018().ok===true);
  return{ok:details.every(q=>q.ok),checks:details.map(q=>q.name+(q.ok?' ✓':' ✗')),details};
}
/* GPT-018 LATE NATIVE HOOKS */
const __waterfrontSize018=toolSize458;toolSize458=function(id){return waterfrontTool018(id)?__waterfrontSize018(WATERFRONT_BASE018):__waterfrontSize018(id);};
const __waterfrontCoverage018=placementCoverage459;placementCoverage459=function(id){return __waterfrontCoverage018(waterfrontTool018(id)?WATERFRONT_BASE018:id);};
const __waterfrontCan018=canPlace;canPlace=function(id,x,y){
  const q=waterfrontTool018(id);if(!q)return __waterfrontCan018(id,x,y);
  if(window.__noWaterfront018)return '英式水岸文物展館暫停新增';
  if(!toolUnlocked458(toolMeta434(id)))return '城市 Lv.'+q.rank+' 解鎖';
  return __waterfrontCan018(WATERFRONT_BASE018,x,y);
};
const __waterfrontCost018=placeCost;placeCost=function(id,x,y){return __waterfrontCost018(waterfrontTool018(id)?WATERFRONT_BASE018:id,x,y);};
const __waterfrontPlace018=doPlace;doPlace=function(id,x,y,silent){
  const q=waterfrontTool018(id);if(!q)return __waterfrontPlace018(id,x,y,silent);
  const err=canPlace(id,x,y);if(err){if(!silent){toast(err,'bad');sErr();}return false;}
  if(!__waterfrontPlace018(WATERFRONT_BASE018,x,y,true))return false;
  const b=tiles[idx(x,y)].bld;b.waterfront018=q.theme;b.v=complexRoadTurn014(x,y);
  if(!silent)toast(q.ic+' '+q.nm+' 開始施工','gold');return true;
};
for(const q of Object.values(WATERFRONT_TOOL018)){
  COST[q.id]=COST[WATERFRONT_BASE018];const t={id:q.id,cat:'culture',ic:q.ic,nm:q.nm,pr:'$'+COST[q.id],unlockRank:q.rank};
  TOOLS.push(t);MAYOR_MANUAL_ONLY470A.add(q.id);MAYOR_ACTION_CATALOG470A[q.id]={id:q.id,nm:q.nm,cat:mayorToolCategory470(q.id),toolCat:t.cat,k:287,size:2,status:'manual-only',decision:'manual-only'};
}
CATALOG_SECTIONS458.find(q=>q[0]==='leisure')[2].push(...Object.keys(WATERFRONT_TOOL018));
const __waterfrontKeywords018=catalogKeywords458;catalogKeywords458=function(t){const q=waterfrontTool018(t?.id);return q?(__waterfrontKeywords018(t)+' '+q.en+' 英式 英國 '+q.keywords).toLowerCase():__waterfrontKeywords018(t);};
const __waterfrontInspect018=complexInspect014;complexInspect014=function(root,b){
  const original=__waterfrontInspect018(root,b),theme=waterfrontAppearance018(b);if(!theme)return original;
  const q=WATERFRONT_THEME018[theme],base=COMPLEX014[287];
  return original.replace('<h3>'+base.ic+' '+base.nm+'</h3><div class="row">'+base.en+'</div>','<h3>'+q.ic+' '+q.nm+'</h3><div class="row">'+q.en+'</div>')
    .replace('<div class="row">'+complexDescription014(base)+'</div>','<div class="row">'+waterfrontDescription018(q)+'</div>');
};
