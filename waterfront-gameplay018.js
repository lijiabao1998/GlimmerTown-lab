'use strict';
// Browser observers are serialized only by the Actions runner. Requiring this
// file performs no game, painter, canvas, Chrome, storage or simulation work.
function waterfrontPriorPaths018(){
 const out=[],families=[['streetscape015','__streetscapeQA015',8,'streetscapeAt015','british015','turn015'],['gardenLife016','__gardenLifeQA016',6,'gardenLifeAt016','british016','turn016'],['quayside017','__quaysideQA017',6,'quaysideAt017','british017','turn017']];
 for(const[family,key,count,get,themeKey,turnKey]of families){const paths=window[key]?.paths;if(!Array.isArray(paths)||paths.length!==count||new Set(paths.map(p=>p.x+','+p.y)).size!==count||new Set(paths.map(p=>p.theme)).size!==count)throw Error('Every prior paid coordinate required: '+family);
  for(const p of paths){const at=GV[get](p.x,p.y);if(!at||at.root!==p.y*72+p.x||at.x!==p.x||at.y!==p.y||at.theme!==p.theme||at.am502!==1||at.baseWalkCost!==.72||at.cost!==p.cost||at.amx502?.[themeKey]!==p.theme||at.amx502?.[turnKey]!==p.turn)throw Error('Prior native identity changed: '+family+' '+p.x+','+p.y);out.push({...at,family});}}
 if(new Set(out.map(p=>p.root)).size!==20)throw Error('Twenty distinct prior paid cells required');return out;
}
function waterfrontIdentity018(){
 const old=window.__complexFns014.identity014(),tags=[],trees=[];for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y),b=t.bld;if(t.tree)trees.push([y*72+x,t.tree]);if(b&&Object.hasOwn(b,'waterfront018'))tags.push({root:y*72+x,k:b.k,ref:b.ref||null,appearance:b.waterfront018});}return{...old,tags,trees};
}
function waterfrontCells018(r){return Array.from({length:4},(_,n)=>GV.tile(r.x+n%2,r.y+Math.floor(n/2)));}
function bindWaterfront018(recipe){
 window.__waterfrontQA018={...recipe,canonical:Object.entries(GV.art574.SPR().waterfront018),nativeCanonical:[0,1,2,3].map(v=>['287_1_'+v,GV.art574.SPR().bld['287_1_'+v]])};
 const Q=window.__waterfrontQA018;Q.ink=Q.canonical.map(([key,s])=>({key,day:s.img.toDataURL(),night:s.night.toDataURL()}));return true;
}
// Native fiscal515 is the outermost paid-placement wrapper and records the
// selected public catalog tool, even when its inner placement delegates to k287.
// This predicate is shared verbatim with Node's source/JSON acceptance checks.
function waterfrontCapital018(id,quote,capital,day){
 if(!['lifeboatHeritageHall018','canalTollhouseExhibit018','manorStableCourt014'].includes(id)||!quote||quote.tool!==id||!Number.isInteger(day)||day<0||!Array.isArray(capital)||capital.length!==1)return false;
 const c=capital[0];return !!c&&Object.keys(c).sort().join(',')==='cost,d,k,tool,x,y'&&c.tool===id&&c.k===287&&c.x===quote.x&&c.y===quote.y&&Number.isInteger(c.x)&&Number.isInteger(c.y)&&c.x>=0&&c.x<71&&c.y>=0&&c.y<71&&c.d===day&&Number.isFinite(quote.cost)&&quote.cost>0&&c.cost===Math.round(quote.cost);
}
function setupWaterfront018(){
 if(localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable slot 3 only');
 const C=window.__complexQA014,before=waterfrontIdentity018(),prior=waterfrontPriorPaths018(),specs=GV.waterfrontSpecs018().appearances,rows=[...specs,{id:'manorStableCourt014',theme:null,nm:'英式莊園馬廄庭院',k:287,sz:2}],roots=[],payments=[];
 for(const[n,q]of rows.entries()){
  const r={...q,x:63+3*n,y:64};C.prepare(r.x,r.y,2);const site=waterfrontCells018(r),quote=GV.placePreview459(r.id,r.x,r.y),base=GV.placePreview459('manorStableCourt014',r.x,r.y),money=GV.devMoney516B(),ledger=GV.fiscal515().capitalLedger.length;
  if(!quote.ok||!base.ok||quote.size!==2||quote.footprint.length!==4||quote.cost!==base.cost||JSON.stringify(quote.coverage)!==JSON.stringify(base.coverage))throw Error('Exact native available four-cell quote required');
  const ok=GV.placeUndo(r.id,r.x,r.y),charged=money-GV.devMoney516B(),after=waterfrontCells018(r),b=after[0].bld,capital=GV.fiscal515().capitalLedger;
  if(!ok||charged!==quote.cost||charged<=0||b?.k!==287||b.sz!==2||b.age!==0||(b.waterfront018||null)!==r.theme||!after.slice(1).every(t=>t.bld?.k===287&&JSON.stringify(t.bld.ref)===JSON.stringify([r.x,r.y])&&!Object.hasOwn(t.bld,'waterfront018')))throw Error('Actual paid native root and reference cells required');
  const undo=GV.undo(),undoExact=JSON.stringify(waterfrontCells018(r))===JSON.stringify(site)&&GV.devMoney516B()===money,redo=GV.redo(),redoExact=JSON.stringify(waterfrontCells018(r))===JSON.stringify(after)&&money-GV.devMoney516B()===charged;
  roots.push({...r,v:b.v,root:r.y*72+r.x});payments.push({id:r.id,quote,base,charged,ok,capital:capital.slice(ledger),capitalExact:waterfrontCapital018(r.id,quote,capital.slice(ledger),GV.stats().day),undo,undoExact,redo,redoExact});
 }
 const after=waterfrontIdentity018(),recipe={roots,payments,placementDay:GV.stats().day};bindWaterfront018(recipe);
 return{...recipe,prior,oldIdentitiesExact:before.buildings.every(b=>JSON.stringify(after.buildings.find(q=>q.i===b.i))===JSON.stringify(b))&&JSON.stringify(before.paths)===JSON.stringify(after.paths),initial:waterfrontState018()};
}
function waterfrontState018(){
 const Q=window.__waterfrontQA018;
 return{day:GV.stats().day,identity:waterfrontIdentity018(),roots:Q.roots.map(r=>({id:r.id,theme:r.theme,x:r.x,y:r.y,root:r.root,appearance:GV.waterfrontAt018(r.x,r.y),native:GV.complexAt014(r.x,r.y),cells:waterfrontCells018(r)})),prior:waterfrontPriorPaths018(),old:window.__complexFns014.snapshot014(),stats:GV.stats(),fiscal:GV.complexFiscal014(),slot:localStorage.getItem('glimmerville.v1.slot'),otherSlots:Object.fromEntries(Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))};
}
function waterfrontStep018(){const from=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);if(GV.stats().day!==from+1)throw Error('One unaided native ordinary day required');return waterfrontState018();}
function waterfrontCapacity018(){
 const Q=window.__waterfrontQA018,tourists=GV.museumEvidence010().tourists,rows=Q.roots.map(q=>{const r=GV.complexAt014(q.x,q.y),fill=r.staff?.staffFill||0,factor=r.operational&&r.employed>0?Math.max(0,Math.min(1.14,r.staff.capacityFactor,r.factors.serviceFactor*Math.max(0,Math.min(1,fill)))):0,expected=70*factor*(1+Math.min(.35,tourists/2200)),near=(a,b)=>Math.abs(a-b)<1e-6;return{id:q.id,theme:q.theme,r,factor,expectedLeisure:expected,exact:near(r.capacityFactor,factor)&&near(r.activity.leisure,expected)&&r.activity.enterpriseJobs===0&&r.activity.shopping===0&&r.activity.education===0&&r.activity.services===0&&r.activity.parking===0&&r.upkeep===(r.built?3:0),positive:r.operational&&r.employed>0&&r.positions>0&&r.activity.publicJobs>0&&r.activity.leisure>0&&r.powerState===1&&r.waterState.code>=2&&r.waterDelivered>0&&r.road.length>0,zero:r.employed===0&&r.capacityFactor===0&&r.activity.leisure===0};});
 return{day:GV.stats().day,rows,tourists,daily:GV.complexEvidence014().daily,fiscal:GV.complexFiscal014(),exact:rows.every(r=>r.exact),positive:rows.every(r=>r.positive),zero:rows.every(r=>r.zero)};
}
function waterfrontAssets018(){return Object.entries(GV.art574.SPR().waterfront018).map(([key,s])=>({key,w:s.w,h:s.h,ax:s.ax,ay:s.ay,view:s.view,appearance:s.appearance,png:s.img.toDataURL('image/png'),night:s.night.toDataURL('image/png')}));}
function waterfrontCanonical018(){const Q=window.__waterfrontQA018;return Q.canonical.every(([key,s],n)=>GV.art574.SPR().waterfront018[key]===s&&s.img.toDataURL()===Q.ink[n].day&&s.night.toDataURL()===Q.ink[n].night)&&Q.nativeCanonical.every(([key,s])=>GV.art574.SPR().bld[key]===s);}
function waterfrontPurity018(){
 const C=window.__complexQA014,before=C.world(),storage=JSON.stringify(C.storage()),fingerprint=JSON.stringify(GV.fp536()),random=Math.random;let calls=0;
 Math.random=()=>{calls++;throw Error('Art consumed simulation RNG');};
 try{const a=window.BritishWaterfrontHeritage018.buildAll(),b=window.BritishWaterfrontHeritage018.buildAll(),keys=Object.keys(a);return{calls,count:keys.length,deterministic:keys.length===8&&keys.every(k=>a[k].img.toDataURL()===b[k].img.toDataURL()&&a[k].night.toDataURL()===b[k].night.toDataURL()),worldExact:before===C.world(),storageExact:storage===JSON.stringify(C.storage()),fingerprintExact:fingerprint===JSON.stringify(GV.fp536()),canonical:waterfrontCanonical018()};}finally{Math.random=random;}
}
function waterfrontTransactions018(){
 const Q=window.__waterfrontQA018,rows=[];for(const r of Q.roots)for(let cell=0;cell<4;cell++){
  const before=JSON.stringify(waterfrontCells018(r)),identity=JSON.stringify(waterfrontIdentity018()),money=GV.devMoney516B(),x=r.x+cell%2,y=r.y+Math.floor(cell/2),quote=GV.placePreview459('doze',x,y),removed=GV.placeUndo('doze',x,y),charged=money-GV.devMoney516B(),gone=waterfrontCells018(r).every(t=>!t.bld),undo=GV.undo(),restored=before===JSON.stringify(waterfrontCells018(r))&&GV.devMoney516B()===money&&identity===JSON.stringify(waterfrontIdentity018()),redo=GV.redo(),regone=waterfrontCells018(r).every(t=>!t.bld),redoPaid=money-GV.devMoney516B()===charged,undoAgain=GV.undo(),final=before===JSON.stringify(waterfrontCells018(r))&&GV.devMoney516B()===money&&identity===JSON.stringify(waterfrontIdentity018());rows.push({id:r.id,cell,quote,removed,charged,gone,undo,restored,redo,regone,redoPaid,undoAgain,final});
 }return{rows,canonical:waterfrontCanonical018(),prior:waterfrontPriorPaths018()};
}
// Disposable *input* variants for catalog/rejection tests only. This routine
// never runs in construction, image, cold Continue or ordinary-day evidence.
function waterfrontDecodeInput018(raw){const d=JSON.parse(raw);if(d.z===1){for(const k of ['ter','tre','rd','zn','dc','rn','rc','rcl','wp','el','bs','cm','sk','dt','skd','dtd','rl','rb','dk','ow','tl','pm','bln','tr','of','fl','le','ab','ctr','cmd','hvl471','ugc471','wmn472','smn472','lvl475','udl475','fly475','ix475'])if(typeof d[k]==='string')d[k]=d[k].replace(/\*(\d+),([\s\S])/g,(_,n,c)=>c.repeat(+n));delete d.z;}return d;}
function waterfrontCatalog018(){
 const Q=window.__complexQA014,site={x:1,y:64};Q.prepare(site.x,site.y,2);GV.save();const raw=localStorage.getItem('glimmerville.v1.s3'),base=waterfrontDecodeInput018(raw),ids=['lifeboatHeritageHall018','canalTollhouseExhibit018','manorStableCourt014'],rows=[],rank=[],quotes=[],poor=[];
 const load=d=>{localStorage.setItem('glimmerville.v1.s3',JSON.stringify(d));if(!GV.load())throw Error('Disposable native input load failed');GV.setSpeed(0);GV.ai(false);};
 const attempt=(id,label)=>{const before=Q.world(),money=GV.devMoney516B(),ledger=JSON.stringify(GV.fiscal515().capitalLedger),preview=GV.placePreview459(id,site.x,site.y),placed=GV.placeUndo(id,site.x,site.y);return{id,label,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B(),ledgerExact:ledger===JSON.stringify(GV.fiscal515().capitalLedger)};};
 try{
  for(const lv of[3,4]){load({...base,rk:lv-1});rank.push({lv,actual:GV.rank().lv,rows:ids.map(id=>({id,unlocked:GV.devUnlocked516B(id),preview:GV.placePreview459(id,site.x,site.y)}))});}
  for(const discounted of[false,true]){const d=JSON.parse(JSON.stringify(base));d.rk=3;d.money=100000;d.tech343={act:'',prog:{},done:discounted?['B5','C8','D4a']:[]};load(d);const native=GV.placePreview459('manorStableCourt014',site.x,site.y);for(const id of ids){const preview=GV.placePreview459(id,site.x,site.y),money=GV.devMoney516B(),ledger=GV.fiscal515().capitalLedger.length,placed=GV.placeUndo(id,site.x,site.y),charged=money-GV.devMoney516B(),capital=GV.fiscal515().capitalLedger.slice(ledger),undo=GV.undo();quotes.push({id,discounted,native,preview,placed,charged,capital,undo,restored:GV.devMoney516B()===money&&!GV.tile(site.x,site.y).bld});}}
  const noMoney={...base,money:0};load(noMoney);for(const id of ids)poor.push(attempt(id,'insufficient-money'));
  const blockers=[['water','ter','0'],['mountain','ter','3'],['road','rd','1'],['rail','rl','1'],['tram','tr','1'],['overhead distribution','lvl475','1'],['high voltage','hvl471','1'],['underground high voltage','ugc471','1'],['ruin','rn','1'],['tree','tre','1'],['crater','ctr','1'],['parking','pm','1'],['elevated traffic','fly475','1'],['interchange','ix475','1'],['uneven ground','el','1'],['occupied',null,null],['path',null,null]];
  for(let cell=0;cell<4;cell++)for(const[label,channel,value]of blockers){const d=JSON.parse(JSON.stringify(base)),i=(site.y+Math.floor(cell/2))*72+site.x+cell%2;if(channel)d[channel]=d[channel].slice(0,i)+value+d[channel].slice(i+1);else if(label==='occupied')d.bl.push([i,4,1,0,0]);else{d.am502=d.am502||{v:1,c:[]};d.am502.c.push([i,1]);}load(d);for(const id of ids)rows.push({...attempt(id,label),cell,index:i});}
  load(base);for(const id of ids)for(const[x,y]of[[-1,64],[71,64],[1,-1],[1,71]]){const before=Q.world(),money=GV.devMoney516B(),ledger=JSON.stringify(GV.fiscal515().capitalLedger),preview=GV.placePreview459(id,x,y),placed=GV.placeUndo(id,x,y);rows.push({id,label:'map-edge',x,y,preview,placed,worldExact:before===Q.world(),moneyExact:money===GV.devMoney516B(),ledgerExact:ledger===JSON.stringify(GV.fiscal515().capitalLedger)});}
 }finally{localStorage.setItem('glimmerville.v1.s3',raw);if(!GV.load())throw Error('Catalog restores original native save');}
 return{placementDay:base.day,rank,quotes,poor,rows,inputMethod:'Only explicitly declared disposable native save inputs change rank, cash, technology and one blocker; production placement, quote, capital ledger and undo remain unmodified.',restoredRaw:localStorage.getItem('glimmerville.v1.s3')===raw};
}
function waterfrontMalformed018(){
 const Q=window.__waterfrontQA018,before=waterfrontState018();GV.save();const raw=localStorage.getItem('glimmerville.v1.s3'),base=JSON.parse(raw),first=Q.roots[0].root,other=window.__complexQA014.roots.find(r=>r.k===286),cases=[['absent',undefined],['null',null],['empty',[]],['object',{}],['string','lifeboatHall'],['unknown',[[first,'future']]],['prototype',[[first,'constructor']]],['duplicate',[[first,'lifeboatHall'],[first,'canalTollhouse']]],['reference',[[first+1,'lifeboatHall']]],['wrong-root',[[other.y*72+other.x,'lifeboatHall']]],['negative-index',[[-1,'lifeboatHall']]],['fractional-index',[[first+.5,'lifeboatHall']]],['out-of-range',[[72*72,'lifeboatHall']]],['short-row',[[first]]],['long-row',[[first,'lifeboatHall',1]]],['null-row',[null]],['late-invalid',[[first,'lifeboatHall'],[Q.roots[1].root,'future']]]],rows=[];
 try{for(const[name,input]of cases){const d=JSON.parse(raw);if(input===undefined)delete d.waterfront018;else d.waterfront018=input;const supplied=JSON.stringify(d);localStorage.setItem('glimmerville.v1.s3',supplied);const loaded=GV.load(),now=waterfrontState018();rows.push({name,loaded,day:now.day,allFallback:now.identity.tags.length===0&&now.roots.every(r=>!r.appearance),nativeIdentitiesExact:JSON.stringify({...now.identity,tags:[]})===JSON.stringify({...before.identity,tags:[]}),saveInputExact:localStorage.getItem('glimmerville.v1.s3')===supplied,prior:now.prior,otherSlotsExact:JSON.stringify(now.otherSlots)===JSON.stringify(before.otherSlots)});}}
 finally{localStorage.setItem('glimmerville.v1.s3',raw);if(!GV.load())throw Error('Original tagged native save restoration failed');}
 return{rows,savedRows:base.waterfront018,restored:JSON.stringify(waterfrontIdentity018())===JSON.stringify(before.identity),rawExact:localStorage.getItem('glimmerville.v1.s3')===raw};
}
function waterfrontScene018(rotation,night,zoom=1.6,weather=null,focus=null){
 const Q=window.__waterfrontQA018;GV.setRot(rotation);GV.setZoom(zoom);GV.lookAt(...(focus||[66.5,65]));GV.setVisT(GV.art574.cycle574()*(night?.9:.5));if(weather)GV.britishWeather004(weather==='snow'?3:0,1,7);else GV.weather(0);
 window.__ovCapMax606=18000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606;window.__ovCap606=null;
 const c=document.getElementById('game'),geometry=Q.roots.map(r=>{const b=GV.tile(r.x,r.y).bld;if(!b)return{id:r.id,missing:true};const view=(b.v+rotation)&3,key=r.theme&&!window.__noWaterfrontArt018?r.theme+'_'+view:'287_1_'+view,s=r.theme&&!window.__noWaterfrontArt018?GV.art574.SPR().waterfront018[key]:GV.art574.SPR().bld[key],hit=caps.find(q=>q.o?.x===r.x&&q.o?.y===r.y&&q.bd?.k===287);return{id:r.id,theme:r.theme,x:r.x,y:r.y,age:b.age,v:b.v,view,key,canonical:!!hit&&hit.s===s,within:!!hit&&hit.bx>=0&&hit.by>=0&&hit.bx+s.w*zoom<=c.width&&hit.by+s.h*zoom<=c.height,box:hit?{x:hit.bx,y:hit.by,w:s.w*zoom,h:s.h*zoom}:null};});
 return{png:c.toDataURL('image/png'),width:c.width,height:c.height,rotation:GV.rot(),night,weather,season:GV.season(),day:GV.stats().day,time:GV.daylightDbg(),geometry,canonical:waterfrontCanonical018(),roots:Q.roots.map(r=>GV.complexAt014(r.x,r.y))};
}
function waterfrontFallback018(){
 const Q=window.__waterfrontQA018,flags=['__noWaterfront018','__noWaterfrontArt018'],saved=flags.map(k=>({k,had:Object.hasOwn(window,k),value:window[k]})),rows=[];
 try{for(const flag of flags){window[flag]=true;const shot=waterfrontScene018(0,false),world=window.__complexQA014.world(),identity=JSON.stringify(waterfrontIdentity018());GV.save();const raw=localStorage.getItem('glimmerville.v1.s3'),loaded=GV.load();rows.push({flag,shot,loaded,identityExact:JSON.stringify(waterfrontIdentity018())===identity,rawExact:localStorage.getItem('glimmerville.v1.s3')===raw,tags:waterfrontIdentity018().tags,disabled:Q.roots.slice(0,2).map(r=>!GV.devUnlocked516B(r.id)),canonical:waterfrontCanonical018(),worldBefore:world.length});delete window[flag];}}
 finally{for(const s of saved)if(s.had)window[s.k]=s.value;else delete window[s.k];}return{rows};
}
// Isolate the chosen physical sprite's actual contribution. The exact canonical
// object is restored; compositor, opacity/depth erasure and world are untouched.
function waterfrontContribution018(theme,channel='img'){
 const Q=window.__waterfrontQA018,r=Q.roots.find(r=>r.theme===theme),b=GV.tile(r.x,r.y).bld,s=GV.art574.SPR().waterfront018[theme+'_'+((b.v+GV.rot())&3)],original=s[channel],empty=document.createElement('canvas'),c=document.getElementById('game'),g=c.getContext('2d'),world=window.__complexQA014.world(),storage=JSON.stringify(window.__complexQA014.storage());empty.width=s.w;empty.height=s.h;
 try{GV.forceDraw();const on=g.getImageData(0,0,c.width,c.height).data;s[channel]=empty;GV.forceDraw();const off=g.getImageData(0,0,c.width,c.height).data,indices=[];for(let i=0;i<on.length;i+=4){let delta=0;for(let n=0;n<3;n++)delta+=Math.abs(on[i+n]-off[i+n]);if(delta>12)indices.push(i/4);}return{theme,channel,rotation:GV.rot(),count:indices.length,indices,worldExact:world===window.__complexQA014.world(),storageExact:storage===JSON.stringify(window.__complexQA014.storage()),rendererUnmodified:true};}
 finally{s[channel]=original;GV.forceDraw();if(s[channel]!==original)throw Error('Canonical restoration failed');}
}
function waterfrontOcclusion018(){
 const Q=window.__waterfrontQA018,C=window.__complexQA014,before=waterfrontState018();GV.save();const raw=localStorage.getItem('glimmerville.v1.s3'),out={foregrounds:[],trials:[],shots:[],selected:[],method:'Real paid k191 neighbors, nine unaided ordinary construction days, actual same-camera sprite contribution, paid removal and undo. No mask, depth, supply or age overrides.'};
 try{for(const r of Q.roots.filter(r=>r.theme)){
   const x=r.x,y=r.y+2;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const t=GV.tile(x+dx,y+dy);if(t.bld||t.road||t.rail||t.tram||t.am502)throw Error('Foreground cannot replace old native content');}
   const payment=C.place('westminster',x,y,2),initial=GV.tile(x,y).bld,from=GV.stats().day,days=[];for(let n=0;n<9;n++){waterfrontStep018();days.push({day:GV.stats().day,age:GV.tile(x,y).bld.age});}out.foregrounds.push({theme:r.theme,x,y,payment,initial,from,days,matured:GV.tile(x,y).bld});
   for(const rotation of[0,1,2,3]){
    const probes={};for(const night of[false,true]){const scene=waterfrontScene018(rotation,night,2,null,[r.x+1,r.y+1]);probes[night?'night':'day']={with:waterfrontContribution018(r.theme,night?'night':'img')};out.shots.push({theme:r.theme,rotation,night,phase:'with',png:scene.png});}
    const money=GV.devMoney516B(),quote=GV.placePreview459('doze',x+1,y+1),removed=GV.placeUndo('doze',x+1,y+1),charged=money-GV.devMoney516B();waterfrontStep018();
    for(const night of[false,true]){const scene=waterfrontScene018(rotation,night,2,null,[r.x+1,r.y+1]);probes[night?'night':'day'].control=waterfrontContribution018(r.theme,night?'night':'img');out.shots.push({theme:r.theme,rotation,night,phase:'control',png:scene.png});}
    const undo=GV.undo();waterfrontStep018();for(const night of[false,true]){const scene=waterfrontScene018(rotation,night,2,null,[r.x+1,r.y+1]),q=probes[night?'night':'day'];q.restored=waterfrontContribution018(r.theme,night?'night':'img');const on=new Set(q.with.indices),again=new Set(q.restored.indices);q.blocked=q.control.indices.filter(i=>!on.has(i)).length;q.visible=q.control.indices.filter(i=>on.has(i)).length;q.blockedRestored=q.control.indices.filter(i=>!again.has(i)).length;q.visibleRestored=q.control.indices.filter(i=>again.has(i)).length;out.shots.push({theme:r.theme,rotation,night,phase:'restored',png:scene.png});}
    const partial=probes.day.control.count>50&&probes.day.blocked>10&&probes.day.visible>10&&probes.day.blockedRestored>10&&probes.day.visibleRestored>10,lightSafe=probes.night.control.count>5&&probes.night.blocked>0&&probes.night.blockedRestored>0,identityRestored=GV.tile(x,y).bld?.k===191&&GV.tile(x,y).bld.age>=9;
    const trial={theme:r.theme,rotation,quote,removed,charged,undo,identityRestored,partial,lightSafe,probes};out.trials.push(trial);if(partial&&lightSafe&&identityRestored&&removed&&undo&&charged===quote.cost){out.selected.push({theme:r.theme,rotation,trial:out.trials.length});break;}
   }C.pay('doze',x,y);
  }}finally{if(!GV.load())throw Error('Occlusion original save restore failed');const restored=waterfrontState018(),following=waterfrontStep018();out.restoration={identityExact:JSON.stringify(restored.identity)===JSON.stringify(before.identity),rawExact:localStorage.getItem('glimmerville.v1.s3')===raw,day:restored.day,followingDay:following.day,prior:following.prior,roots:following.roots,otherSlotsExact:JSON.stringify(following.otherSlots)===JSON.stringify(before.otherSlots)};}
 return out;
}
const functions018=[waterfrontPriorPaths018,waterfrontIdentity018,waterfrontCells018,bindWaterfront018,waterfrontCapital018,setupWaterfront018,waterfrontState018,waterfrontStep018,waterfrontCapacity018,waterfrontAssets018,waterfrontCanonical018,waterfrontPurity018,waterfrontTransactions018,waterfrontDecodeInput018,waterfrontCatalog018,waterfrontMalformed018,waterfrontScene018,waterfrontFallback018,waterfrontContribution018,waterfrontOcclusion018];
module.exports={functions018,waterfrontCapital018};
