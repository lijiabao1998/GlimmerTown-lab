'use strict';
require('./waterfront-quarter-lamp019.test');
// Inert source and synthetic transaction/geometry data only, never a game/painter.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{functions019,quarterCapitalNative019}=require('./waterfront-quarter-native019'),L=require('./waterfront-quarter-logic019');
for(const f of functions019)new vm.Script('('+f.toString()+')');let positives=0,negatives=0;
for(const length of[0,1,78,79,80])for(const id of['lifeboatHeritageHall018','canalTollhouseExhibit018']){
 const quote={tool:id,x:59,y:51,cost:1015.3125},before=Array.from({length},(_,n)=>({d:n,tool:'park',x:n%72,y:3,cost:60,k:4})),row={d:90,tool:id,x:59,y:51,cost:1015,k:287},after=[...before,row].slice(-80);assert(quarterCapitalNative019(id,quote,before,after,90));positives++;
 for(const mutate of[q=>q.pop(),q=>q.push({...row}),q=>q.at(-1).cost++,q=>q.at(-1).tool='footpath502',q=>q.at(-1).k=4,q=>q.at(-1).d++,q=>q.at(-1).x++,q=>q.at(-1).extra=true]){const bad=structuredClone(after);mutate(bad);assert(!quarterCapitalNative019(id,quote,before,bad,90));negatives++;}
 if(after.length>1){const bad=structuredClone(after);bad[0].cost++;assert(!quarterCapitalNative019(id,quote,before,bad,90));negatives++;}
}
const g=L.graph([{i:11,passable:true,flat:true,open:15,elevation:0},{i:12,passable:true,flat:true,open:15,elevation:1}],10);assert.equal(g.nodes.get(11).visual.length,0);assert.equal(g.nodes.get(11).mask,0);assert.equal(g.nodes.get(11).neighbors.length,1);
const native=fs.readFileSync('waterfront-quarter-native019.js','utf8'),game=fs.readFileSync('gameplay019.js','utf8'),runner=fs.readFileSync('probe-waterfront-quarter019.js','utf8'),preflight=fs.readFileSync('waterfront-quarter-preflight019.js','utf8');for(const [name,source]of Object.entries({native,game,runner,preflight}))new vm.Script(source,{filename:name});
const observation=functions019.filter(f=>['quarterIdentityNative019','quarterStateNative019','quarterStepNative019'].includes(f.name)).map(f=>f.toString()).join('\n');assert(!/\b(?:ensure|rebuild|refresh|dispatch|prepare|testAge|innovationSetQA)[A-Za-z0-9_]*\s*\(/.test(observation));assert(!/\.age\s*=(?!=)|\.pw\s*=|\.wa\s*=|GV\.forceDraw\(|localStorage\.setItem/.test(observation));
for(const feature of['GV.placeUndo','GV.placePreview459','GV.undo','GV.redo','capitalBefore','capitalAfter',"P.pay('tdig'",'quarterCapitalNative019','WALK_COST502','amVersion502','quarterTurn019'])assert((native+game).includes(feature),feature);
assert(game.includes('quarterFloorCache019.size>=128'));assert(game.includes('quarterRouteCache019.size>=64'));assert(game.includes('quarterStats019.visitors<24'));assert(game.includes('if(amDirty502||'));assert(!/Math\.random|\blocalStorage\b|\bsessionStorage\b/.test(game));
assert(runner.includes("process.env.GITHUB_ACTIONS!=='true'"));assert(preflight.includes("process.env.GITHUB_ACTIONS!=='true'"));assert(runner.includes('head!==process.env.GITHUB_SHA'));assert(runner.includes("await cdp.send('Page.reload'"));assert(runner.includes('iteration<=2'));assert(runner.includes('n<=3'));assert(runner.includes('Input.dispatchTouchEvent'));assert(runner.includes("type:'touchMove'"));assert(runner.includes('maxTouchPoints:2'));assert(runner.includes('[[390,844],[844,390]]'));assert(runner.includes('if(!ok)?')===false);
const cold=runner.slice(runner.indexOf("  if(MODE==='coldload'){"),runner.indexOf("  if(MODE==='mobile'){"));assert(!/testAge|innovationSetQA|ensure|rebuild|refresh|\.pw\s*=|\.wa\s*=/.test(cold));assert(cold.indexOf('for(let n=1;n<=3')<cold.indexOf("await shot('cold-'"));
// Validate the source-declared district geometry independently of the renderer.
const points=[],add=(theme,x,y)=>points.push({theme,x,y});for(const x of[59,60,65,66])add('arrivalCourt',x,54);for(const y of[55,60])for(let x=58;x<=69;x++)add('brickPromenade',x,y);for(const x of[60,66])for(let y=56;y<=59;y++)add('brickPromenade',x,y);for(const x of[61,62,63,64,65])add('arrivalCourt',x,57);for(const[x,y]of[[58,54],[62,54],[68,54]])add('harbourLantern',x,y);for(const[x,y]of[[59,56],[65,56]])add('heritageDisplay',x,y);for(const[x,y]of[[61,56],[67,56],[59,59],[67,59]])add('watersideBench',x,y);for(const[x,y]of[[62,58],[64,58]])add('timberShelter',x,y);for(let x=58;x<=69;x++)add(x===58||x===69?'quayCorner':'quayEdgeWalk',x,61);
assert.equal(points.length,64);assert.equal(new Set(points.map(p=>p.x+','+p.y)).size,64);for(const[x,y]of[[58,58],[58,59],[62,59],[64,59],[68,58],[68,59]])assert(!points.some(p=>p.x===x&&p.y===y));
const rows=points.map(p=>({i:p.y*72+p.x,theme:p.theme,flat:L.FLAT.includes(p.theme),passable:true,open:p.y===61?11:15}));for(const x of[59,60,65,66])rows.push({i:53*72+x,flat:true,passable:true,open:15});const graph=L.graph(rows,72);for(const x of[59,65]){const r=L.routes({x,y:51,sz:2,turn:0},graph);assert.equal(r.entry.connected.length,2);assert.equal(r.paths.length,4);for(const p of r.paths)assert(p.length<=13);}
const disconnected=L.graph(rows.filter(p=>![54*72+59,54*72+60].includes(p.i)),72);assert.equal(L.routes({x:59,y:51,sz:2,turn:0},disconnected).paths.length,0);assert(L.routes({x:65,y:51,sz:2,turn:0},disconnected).paths.length>0);
console.log(JSON.stringify({ok:true,sourceOnly:true,gameOrPainterExecuted:false,functions: functions019.length,capitalPositive:positives,capitalNegative:negatives,layoutCells:64,connectedHalls:2,newRuntimeModes:8}));
// Regression for the actual first CI failure: fixed saved shore direction is
// chosen at purchase time, so all intended land must exist before the first rail.
assert(native.indexOf('for(let x=58;x<=70;x++)P.prepare(x,61);')<native.indexOf("for(let x=58;x<=69;x++)put(x===58"));
const turn=game.match(/function quarterTurn019\([^\n]+/)[0];
const shoreCells=Array.from({length:72*72},()=>({t:2}));for(let x=57;x<=70;x++)shoreCells[62*72+x]={t:0};
const evaluateTurn=(x,y)=>new vm.Script('('+turn+')("quayEdgeWalk",'+x+','+y+')').runInNewContext({window:{WaterfrontQuarterLogic019:L},tiles:shoreCells,idx:(x,y)=>y*72+x,inMap:(x,y)=>x>=0&&y>=0&&x<72&&y<72,complexRoadTurn014:()=>0});
shoreCells[61*72+60]={t:0};assert.equal(evaluateTurn(59,61),2);shoreCells[61*72+60]={t:2};for(let x=58;x<=69;x++)assert.equal(evaluateTurn(x,61),3);
// The normal scene helper must never invoke the legacy weather setter: that
// setter changes day. Exercise only synthetic data callbacks, never a canvas.
const scene=functions019.find(f=>f.name==='quarterSceneNative019'),events=[];let syntheticDay=27;
const GV={setRot:v=>{},setZoom:v=>{},lookAt:()=>{},setVisT:()=>{},art574:{cycle574:()=>100},britishWeather004:(s,w,r)=>{events.push('weather-fixture');syntheticDay=[1,101,201,301][s];},weather:()=>events.push('normal-weather'),forceDraw:()=>events.push('draw-stub'),camera436:()=>({x:0,y:0,z:1}),stats:()=>({day:syntheticDay}),rot:()=>0,season:()=>({idx:0}),quarterEvidence019:()=>({}),complexAt014:()=>({})};
const context={GV,window:{__quarterQA019:{focus:[0,0],paths:[],roots:[]}},document:{getElementById:()=>({width:1600,height:1080,toDataURL:()=> 'synthetic-image-not-rendered'})}};
const ordinary=new vm.Script('('+scene.toString()+')(0,false,1.25,null)').runInNewContext(context);assert.equal(ordinary.day,27);assert(!events.includes('weather-fixture'));assert(events.includes('draw-stub'));
console.log(JSON.stringify({firstCiShoreOrderRegression:true,ordinarySceneClockRegression:true,syntheticCallbacksOnly:true}));
// The second planning CI failure kept every purchase/undo/ledger fact true.
// Only the reverse subtraction differed: quote 9.746999999999998 versus raw
// 100000 - 99990.253 = 9.747000000003027. Check the native debit direction
// exactly, retaining the raw difference rather than rounding it or adding epsilon.
const purchaseCheck=runner.split('\n').find(line=>line.includes("check('sixteen actual discounted/base purchases"));assert(purchaseCheck);
const purchaseGate=cat=>{let result;new vm.Script(purchaseCheck).runInNewContext({cat,check:(name,ok)=>{result=ok;}});return result;};
const catalog=functions019.find(f=>f.name==='quarterCatalogNative019');
function syntheticCatalog(mutation={}){
 const ids=['arrivalCourt','brickPromenade','quayEdgeWalk','quayCorner','heritageDisplay','watersideBench','harbourLantern','timberShelter'].map(id=>id+'019'),slot='glimmerville.v1.s3';
 const initial={rk:3,money:100000,tech343:{done:[]}};for(const field of['ter','rd','rl','tr','tre','zn','lvl475','hvl471','fly475','ix475','rn','ctr','pm','dc','of'])initial[field]=(field==='ter'?'2':'0').repeat(72*72);
 let state=structuredClone(initial),tile={t:2,el:0},ledger=[{d:1,tool:'park',cost:60}],snapshot;
 const storage=new Map([[slot,JSON.stringify(initial)]]),localStorage={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)};
 const cost=()=>state.tech343.done.length?9.746999999999998:12;
 const GV={save:()=>storage.set(slot,JSON.stringify(state)),load:()=>{state=JSON.parse(storage.get(slot));tile={t:2,el:0};ledger=[{d:1,tool:'park',cost:60}];return true;},setSpeed:()=>{},ai:()=>{},rank:()=>({lv:state.rk+1}),devUnlocked516B:()=>state.rk>=3,quarterSpecs019:()=>({paths:ids.map(id=>({id}))}),devMoney516B:()=>state.money,tile:()=>structuredClone(tile),fiscal515:()=>({capitalLedger:structuredClone(ledger)}),
  placePreview459:(id,x,y)=>({ok:true,cost:cost(),affordable:state.money>=cost()}),
  placeUndo:(id,x,y)=>{if(state.money<cost())return false;snapshot={money:state.money,tile:structuredClone(tile)};state.money-=cost();state.money+=mutation.debitError||0;tile={...tile,am502:1,amx502:{british019:id.slice(0,-3),turn019:0}};return true;},
  undo:()=>{if(!snapshot)return false;state.money=snapshot.money+(mutation.undoCashError||0);tile=structuredClone(snapshot.tile);if(mutation.undoTileError)tile.extra=(tile.extra||0)+1;if(mutation.ledgerError)ledger.push({d:2,tool:'footpath502',cost:12});return !mutation.undoFailure;}};
 const window={__streetQA009:{prepare:()=>{}},__quarterQA019:{world:()=>JSON.stringify({state,tile,ledger})}};
 return new vm.Script('('+catalog.toString()+')()').runInNewContext({GV,window,localStorage,waterfrontDecodeInput018:JSON.parse});
}
const syntheticPurchases=syntheticCatalog();assert(purchaseGate(syntheticPurchases));assert.equal(syntheticPurchases.quotes.length,16);
for(const row of syntheticPurchases.quotes){assert.equal(row.moneyBefore,100000);assert.equal(row.moneyAfter,row.moneyBefore-row.preview.cost);assert.equal(row.charged,row.moneyBefore-row.moneyAfter);if(row.discounted){assert.equal(row.preview.cost,9.746999999999998);assert.equal(row.charged,9.747000000003027);assert.notEqual(row.charged,row.preview.cost);}}
let rejectedPurchases=0;for(const mutation of[{debitError:1e-10},{debitError:-1e-10},{debitError:.01},{undoCashError:1e-10},{undoTileError:true},{ledgerError:true},{undoFailure:true}]){assert(!purchaseGate(syntheticCatalog(mutation)),JSON.stringify(mutation));rejectedPurchases++;}
for(const change of[p=>p.preview.ok=false,p=>p.native.ok=false,p=>p.placed=false,p=>p.native.cost++,p=>p.charged++,p=>p.moneyAfter++,p=>p.moneyBefore++]){const bad=structuredClone(syntheticPurchases);change(bad.quotes[8]);assert(!purchaseGate(bad));rejectedPurchases++;}
const short=structuredClone(syntheticPurchases);short.quotes.pop();assert(!purchaseGate(short));rejectedPurchases++;
console.log(JSON.stringify({exactNativeDebitRegression:true,syntheticPurchases:16,rejectedPurchases,syntheticCallbacksOnly:true}));
