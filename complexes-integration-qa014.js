#!/usr/bin/env node
'use strict';
// Product/browser/canvas/native simulation execute ONLY inside isolated Actions.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
const {legacyFixtures014,functions014,validConstruction014,validReady014,validFiscal014,validPaidForeground014,staticObservationTest014}=require('./complexes-gameplay014');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function weatherScene014(kind,rotation,night,group){
 const Q=window.__complexQA014,F=window.__complexFns014,scene=F.nativeScene014(rotation,night,group),d=Q.districts.find(d=>d.group===group);
 GV.weather(kind==='snow'||kind==='rain'?1:kind==='storm'?2:0);if(kind==='fog')GV.fog(3);
 const flag=kind==='snow'?'__noRoofSnow':'__noWx',had=Object.hasOwn(window,flag),previous=window[flag],c=document.getElementById('game'),g=c.getContext('2d');
 const state=()=>({day:GV.stats().day,season:GV.season(),weather:GV.stats().weather,rainDays:GV.rainDays(),fog:GV.fog(),surface:GV.weatherAt499(d.x,d.y),time:GV.daylightDbg()});
 const read=()=>g.getImageData(0,0,c.width,c.height).data;let result;
 try{
  window[flag]=false;for(let n=0;n<3;n++)GV.forceDraw();
  const before=state(),world=Q.world(),storage=JSON.stringify(Q.storage()),identities=JSON.stringify(F.identity014()),refs=[...Q.canonical.map(([k,v])=>['bld',k,v]),...Q.canonicalPaths.map(([k,v])=>['complexes014',k,v])];
  const on=read(),png=c.toDataURL('image/png');window[flag]=true;GV.forceDraw();const off=read(),controlPNG=c.toDataURL('image/png');window[flag]=false;GV.forceDraw();const restored=read();
  let changed=0,rootChanged=scene.geometry.map(r=>({k:r.k,changed:0})),restoredDifference=0;
  for(let i=0;i<on.length;i+=4){let delta=0;for(let j=0;j<3;j++)delta+=Math.abs(on[i+j]-off[i+j]);if(delta>3){changed++;const n=i/4,x=n%c.width,y=Math.floor(n/c.width);scene.geometry.forEach((r,j)=>{const b=r.box;if(b&&x>=b.x&&y>=b.y&&x<b.x+b.w&&y<b.y+b.h)rootChanged[j].changed++;});}if(on[i]!==restored[i]||on[i+1]!==restored[i+1]||on[i+2]!==restored[i+2]||on[i+3]!==restored[i+3])restoredDifference++;}
  const after=state();result={kind,group,rotation:GV.rot(),night,flag,png,controlPNG,before,after,geometry:scene.geometry,composition:F.amenityComposition014(),roots:scene.roots,changed,rootChanged,restoredDifference,worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),identitiesExact:identities===JSON.stringify(F.identity014()),stateExact:JSON.stringify(before)===JSON.stringify(after),canonicalExact:refs.every(([family,key,v])=>GV.art574.SPR()[family][key]===v)};
 }finally{if(had)window[flag]=previous;else delete window[flag];GV.forceDraw();}
 result.flagRestored=had?Object.hasOwn(window,flag)&&window[flag]===previous:!Object.hasOwn(window,flag);return result;
}
function validWeather014(q,kind,rotation,night,group,day){
 const b=q?.before,season=kind==='snow'?3:0,weather=kind==='rain'||kind==='snow'?1:kind==='storm'?2:0;
 const nativeState=b?.day===day&&b?.season?.idx===season&&b.weather===weather&&(kind==='snow'?b.rainDays>=6&&b.surface?.win&&b.surface.snow>0&&b.surface.wet===0&&b.fog===null:kind==='fog'?b.rainDays===0&&b.surface?.snow===0&&b.surface.wet===0&&b.fog?.days===3:b.surface?.snow===0&&b.surface.wet>0);
 return !!(q&&q.kind===kind&&q.group===group&&q.rotation===rotation&&q.night===night&&nativeState&&q.geometry?.length===3&&q.geometry.every(g=>g.canonical&&g.within&&g.anchorError?.every(v=>Math.abs(v)<1e-5))&&q.roots?.length===3&&q.composition?.allFourIndependent&&q.composition.allWithin&&q.composition.allNative&&q.changed>0&&q.rootChanged?.length===3&&q.rootChanged.every(r=>r.changed>0)&&q.worldExact&&q.storageExact&&q.identitiesExact&&q.stateExact&&q.canonicalExact&&q.flagRestored&&(kind==='rain'||kind==='storm'||q.restoredDifference===0)&&(night?b.time.b<.45:b.time.b>.95));
}
function validWeatherInventory014(rows,artifacts,kinds,group){
 const slots=kinds.flatMap(kind=>[0,1,2,3].flatMap(rotation=>[false,true].map(night=>({kind,rotation,night,group}))));
 const expected=slots.flatMap(q=>{const base='images/'+group+'-'+q.kind+'-r'+q.rotation+'-'+(q.night?'night':'day');return[base+'.png',base+'-control.png'];}).sort();
 return rows.length===slots.length&&slots.every(s=>rows.filter(q=>q.kind===s.kind&&q.rotation===s.rotation&&q.night===s.night&&q.group===s.group).length===1)&&eq(artifacts.filter(a=>kinds.some(kind=>a.path.startsWith('images/'+group+'-'+kind+'-'))).map(a=>a.path).sort(),expected);
}
function validPathLights014(q){
 return !!(q&&q.rows?.length===16&&q.originalThemesRetained&&q.payments.every(p=>p.exact&&p.charged>0)&&new Set(q.rows.map(r=>r.theme)).size===4&&q.rows.every(r=>r.purchase.exact&&r.light.changed>0&&r.light.lighting.ready&&r.light.lighting.service>.03&&r.light.sourceIsActualAdjacentRoad&&r.rotation===r.light.rotation)&&[...new Set(q.rows.map(r=>r.theme))].every(theme=>[0,1,2,3].every(rotation=>q.rows.filter(r=>r.theme===theme&&r.rotation===rotation).length===1)));
}
function validFireDrill014(f){
 return !!(f&&f.rows?.length===2&&new Set(f.rows.map(r=>r.k)).size===2&&f.restoredIdentity&&f.recovered.positive&&f.rows.every(r=>[291,292].includes(r.k)&&r.before.emergencyReady&&r.before.emergency.fieldOnline&&r.before.employed>=4&&r.route.ok&&r.route.station===r.before.root&&r.route.path.length>1&&r.routeRoads&&r.ignited&&r.dispatched.some(c=>c.station===r.before.root&&c.caseIdx===r.caseIdx&&c.type==='fire'&&c.complexStation014&&c.path.length>1)&&r.doze&&r.charged===r.quote.cost&&r.charged>0&&r.cancelled.every(c=>c.station!==r.before.root)&&!r.lostRoute.ok&&r.stillFire&&r.undo&&r.moneyRestored&&r.restored.emergencyReady&&r.restoredRoute.ok&&r.restoredRoute.station===r.before.root&&r.redispatched.some(c=>c.station===r.before.root&&c.caseIdx===r.caseIdx)&&r.arrived&&r.frames>0));
}
function staticTests014(){
 for(const f of[weatherScene014,...functions014])new vm.Script('('+f.toString()+')');const rejected=[];
 for(const kind of['rain','storm','snow','fog']){
  const q={kind,group:'college',rotation:0,night:false,flag:kind==='snow'?'__noRoofSnow':'__noWx',before:{day:302,season:{idx:kind==='snow'?3:0},weather:kind==='storm'?2:kind==='fog'?0:1,rainDays:kind==='fog'?0:7,fog:kind==='fog'?{days:3}:null,surface:{win:kind==='snow',snow:kind==='snow'?1:0,wet:['rain','storm'].includes(kind)?1:0},time:{b:1}},geometry:[282,283,284].map(k=>({k,canonical:true,within:true,anchorError:[0,0]})),roots:[{k:282},{k:283},{k:284}],composition:{allFourIndependent:true,allWithin:true,allNative:true},changed:100,rootChanged:[282,283,284].map(k=>({k,changed:5})),restoredDifference:0,worldExact:true,storageExact:true,identitiesExact:true,stateExact:true,canonicalExact:true,flagRestored:true};
  if(!validWeather014(q,kind,0,false,'college',302))throw Error('Weather positive rejected '+kind);
  for(const[name,mutate]of[['wrong day',v=>v.before.day--],['wrong season',v=>v.before.season.idx=2],['wrong weather',v=>v.before.weather=9],['missing support',v=>v.roots.pop()],['zero main effect',v=>v.rootChanged[0].changed=0],['zero support effect',v=>v.rootChanged[1].changed=0],['missing paths',v=>v.composition.allNative=false],['clipped root',v=>v.geometry[0].within=false],['save changed',v=>v.storageExact=false],['world changed',v=>v.worldExact=false],['identity changed',v=>v.identitiesExact=false],['state changed',v=>v.stateExact=false],['canonical changed',v=>v.canonicalExact=false],['flag not restored',v=>v.flagRestored=false],['wrong lighting',v=>v.before.time.b=.3]]){const t=structuredClone(q);mutate(t);if(validWeather014(t,kind,0,false,'college',302))throw Error('Weather negative accepted '+name);rejected.push(kind+': '+name);}
 }
 const kinds=['snow','fog'],group='college',rows=kinds.flatMap(kind=>[0,1,2,3].flatMap(rotation=>[false,true].map(night=>({kind,rotation,night,group})))),artifacts=rows.flatMap(q=>['','-control'].map(suffix=>({path:'images/'+group+'-'+q.kind+'-r'+q.rotation+'-'+(q.night?'night':'day')+suffix+'.png'})));
 if(!validWeatherInventory014(rows,artifacts,kinds,group))throw Error('Full inventory rejected');
 for(const[name,r,a]of[['missing row',rows.slice(1),artifacts],['duplicate row',[...rows.slice(1),rows[1]],artifacts],['missing image',rows,artifacts.slice(1)],['extra image',rows,[...artifacts,{path:'images/college-snow-extra.png'}]]]){if(validWeatherInventory014(r,a,kinds,group))throw Error('Inventory negative accepted');rejected.push(name);}
 const lights={originalThemesRetained:true,payments:[{exact:true,charged:1}],rows:['a','b','c','d'].flatMap(theme=>[0,1,2,3].map(rotation=>({theme,rotation,purchase:{exact:true},light:{rotation,changed:10,lighting:{ready:true,service:1},sourceIsActualAdjacentRoad:true}})))};
 const fire={restoredIdentity:true,recovered:{positive:true},rows:[291,292].map((k,n)=>({k,before:{root:100+n,emergencyReady:true,emergency:{fieldOnline:true},employed:4},route:{ok:true,station:100+n,path:[[1,1],[2,1]]},routeRoads:true,ignited:true,dispatched:[{station:100+n,caseIdx:5,type:'fire',complexStation014:true,path:[[1,1],[2,1]]}],caseIdx:5,doze:true,charged:5,quote:{cost:5},cancelled:[],lostRoute:{ok:false},stillFire:true,undo:true,moneyRestored:true,restored:{emergencyReady:true},restoredRoute:{ok:true,station:100+n},redispatched:[{station:100+n,caseIdx:5}],arrived:true,frames:2}))};
 if(!validPathLights014(lights)||!validFireDrill014(fire))throw Error('Synthetic authority positives rejected');const authorityNegatives=[];
 for(const[name,original,validator,mutate]of[['empty night mask',lights,validPathLights014,q=>q.rows[0].light.changed=0],['unpowered light',lights,validPathLights014,q=>q.rows[0].light.lighting.service=0],['wrong view',lights,validPathLights014,q=>q.rows[0].light.rotation=2],['duplicate theme view',lights,validPathLights014,q=>q.rows[0]=q.rows[1]],['missing path',lights,validPathLights014,q=>q.rows.pop()],['offline fire field',fire,validFireDrill014,q=>q.rows[0].before.emergency.fieldOnline=false],['insufficient fire crew',fire,validFireDrill014,q=>q.rows[0].before.employed=3.99],['wrong real source',fire,validFireDrill014,q=>q.rows[0].route.station=999],['no actual truck',fire,validFireDrill014,q=>q.rows[0].dispatched=[]],['not cancelled',fire,validFireDrill014,q=>q.rows[0].cancelled=q.rows[0].dispatched],['route survives no source',fire,validFireDrill014,q=>q.rows[0].lostRoute.ok=true],['no arrival',fire,validFireDrill014,q=>q.rows[0].arrived=false],['identity not restored',fire,validFireDrill014,q=>q.restoredIdentity=false]]){const q=structuredClone(original);mutate(q);if(validator(q))throw Error('Authority negative accepted '+name);authorityNegatives.push(name);}
 return{ok:true,sourceOnly:true,gameExecuted:false,observation:staticObservationTest014(),weatherNegatives:rejected,authorityNegatives,perWeatherJobScenes:16,perWeatherJobStandalonePNGs:32};
}
if(process.argv.length===3&&process.argv[2]==='--static-test'){console.log(JSON.stringify(staticTests014(),null,2));process.exit(0);}
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only; no local game execution');
const {withGame,waitFor}=require('./harness'),{seedApprovedBritishLegacy007}=require('./publiclife-legacy-fixture007');
const {verifyStatic014,BASE}=require('./complexes-static-contract014'),{verifyFingerprint014,staticTest014}=require('./complexes-fingerprint-qa014');
const ROOT=__dirname,MODE=process.env.CX014_MODE||'preflight',GROUP=process.env.CX014_GROUP||'college';
if(!/^(preflight|fingerprint|gameplay|camera[0-3]|construction[0-3]|weather-wet|weather-winter|coldload)$/.test(MODE)||!['college','manor','baths','fire'].includes(GROUP))throw Error('Unknown bounded evidence mode/group');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA||!/^[0-9a-f]{40}$/.test(head))throw Error('Exact workflow head required');
const source=fs.readFileSync(path.join(ROOT,'index.html')),OUT=path.join(ROOT,'complexes-evidence',MODE==='preflight'||MODE==='fingerprint'||MODE==='coldload'?MODE:MODE+'-'+GROUP);
for(const d of['','images','guards','assets'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
const report={checkedSHA:head,workflowSHA:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID,base:BASE,sourceSHA256:hash(source),mode:MODE,group:GROUP,checks:[],failures:[],artifacts:[],progress:[],limits:[
 'Browser, game, simulation and pixels execute only in isolated Actions with disposable slot3 on8199.',
 'Historical fixture seed is source-pinned. All12 new roots,16 themes and utilities use real paid tools and ordinary native construction days.',
 'Housing uses the native mid-band city housing pool; no student-only or firefighter-only tenancy is claimed.',
 'Public capacity uses real dispatched labor, roads, physical power and delivered water. Paths are native T502, without fabricated revenue or service bonuses.',
 'Weather date jumps are explicitly labeled visual fixture setup. Every scene is a standalone native PNG, without montage or redraw.',
 'Cold proof is two actual Page.reload/Continue cycles with three ordinary days each, without ensure/recompute/repair getters.',
 'The unchanged <1000ms draw-cost limit is CI software-rendering evidence, not real-device FPS certification. Prior PWA diagnostics remain disclosed.'
]};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
function check(name,ok,detail){report.checks.push({name,ok:!!ok,detail});if(!ok)report.failures.push(name);save();}
function progress(phase,detail={}){const q={at:new Date().toISOString(),phase,...detail};report.progress.push(q);console.log('[Complexes014] '+JSON.stringify(q));save();}
function png(file,url,meta={}){if(!url?.startsWith('data:image/png;base64,')||report.artifacts.some(a=>a.path===file))throw Error('Unique native PNG required');const b=Buffer.from(url.split(',')[1],'base64');if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.toString('ascii',12,16)!=='IHDR')throw Error('Invalid PNG');const width=b.readUInt32BE(16),height=b.readUInt32BE(20);if(!width||!height)throw Error('Empty image');fs.writeFileSync(path.join(OUT,file),b);report.artifacts.push({...meta,path:file,bytes:b.length,width,height,sha256:hash(b),checkedSHA:head,sourceSHA256:report.sourceSHA256});save();}
(async()=>{
 const watchdog=setTimeout(()=>{report.error='Native complexes evidence watchdog expired';save();process.exit(124);},43*60000);watchdog.unref();
 try{
  report.sourceTests=staticTests014();report.static=verifyStatic014();delete report.static.protectedManifest;
  check('strict current014 source and all protected previous source including cold topology',report.static.ok&&report.static.protectedExact&&report.static.coldLoadFixExact,report.static);
  report.version=report.static.version;report.anchor=report.static.anchor;report.release=report.static.release;
  const legacy=legacyFixtures014();report.legacyFixtures={sha256:legacy.sha256,parts:legacy.parts,exactHistoricalFunctionBodies:true};
  const session=await withGame({port:8199,timeout:2520,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
   const ev=async(expression,label='native observation')=>{progress('start',{label});const q=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(q.exceptionDetails)throw Error(q.exceptionDetails.exception?.description||q.exceptionDetails.text);progress('done',{label});return q.result.value;};
   const browserFunctions=[...functions014,weatherScene014],register=()=>ev('window.__complexFns014=(()=>{'+legacy.source+'\n'+browserFunctions.map(f=>f.toString()).join('\n')+';return{'+browserFunctions.map(f=>f.name).join(',')+'};})()','register exact prior fixture and native014 observers');
   const call=(name,...args)=>ev('window.__complexFns014.'+name+'('+args.map(a=>JSON.stringify(a)).join(',')+')',name);
   const ready=validReady014,priorReady=r=>r.priorStreet.roots.length===3&&r.priorStreet.roots.every(r=>r.operational&&r.employed>0)&&r.priorMuseum.roots.length===1&&r.priorMuseum.roots.every(r=>r.operational&&r.employed>0)&&r.priorRiverside.roots.length===3&&r.priorRiverside.roots.every(r=>r.operational&&r.employed>0&&r.activity.shopping>0)&&r.priorTheatre.roots.length===1&&r.priorTheatre.roots.every(r=>r.operational&&r.employed>0&&r.activity.leisure>0);
   await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1080,deviceScaleFactor:1,mobile:false});await register();
   report.boot=await ev('({ready:!!window.__bootDone453,version:GV.ver(),label:document.getElementById("startVersion456")?.textContent?.trim(),slot:localStorage.getItem("glimmerville.v1.slot"),batches:window.__t574,art:window.__complexArt014})','native boot');
   check('native exact version anchor disposable slot and successful art batches',report.boot.ready&&report.boot.version===report.version&&report.boot.label==='v'+report.version+' · '+report.anchor&&report.boot.slot==='3'&&!report.boot.batches.err.length,report.boot);
   report.selftest=await ev('GV.complexSelftest014()','native12-building16-theme catalog selftest');check('native complete bounded catalog registrations and selftest',report.selftest.ok,report.selftest);
   const fp=await ev('GV.fp536()','all current native fingerprint records'),blocks=await ev('GV.blockFp536()','all1728 native blocks');report.fingerprint=verifyFingerprint014(fp,blocks);
   check('all2947 old complete leaves and1728 blocks unchanged plus exactly112 new',report.fingerprint.ok,report.fingerprint);
   fs.writeFileSync(path.join(OUT,'guards/fingerprint-native.json'),JSON.stringify({checkedSHA:head,sourceSHA256:report.sourceSHA256,version:report.version,anchor:report.anchor,release:report.release,fp,blocks,proof:report.fingerprint},null,2));
   report.fingerprintNegatives=staticTest014({fp,blocks});check('strict complete-record mutation controls reject',report.fingerprintNegatives.ok,report.fingerprintNegatives);
   if(MODE==='preflight'||MODE==='fingerprint'){
    report.assets=await call('assetAudit014');for(const a of report.assets){png('assets/'+a.key+'.png',a.png,{kind:'installed canonical native sprite',key:a.key});png('assets/'+a.key+'-night.png',a.night,{kind:'native physical emission mask',key:a.key});delete a.png;delete a.night;}
    check('112 canonical four-view opaque assets exact dimensions anchors contained light',report.assets.length===112&&report.assets.every(a=>a.opaque>0&&a.partial===0&&a.outside===0&&a.view>=0&&a.view<=3&&(a.key.startsWith('bld.')?([282,285,288,291].includes(+a.key.split('.')[1].split('_')[0])?a.w===304&&a.h===320&&a.ax===152&&a.ay===318:a.w===160&&a.h===196&&a.ax===80&&a.ay===194)&&a.lit>0:a.w===72&&a.h===92&&a.ax===36&&a.ay===90&&a.lit>0)),report.assets);
    report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;check('no unhandled native exceptions',cdp.errors.length===0,cdp.errors);return true;
   }
   report.locks=await ev('(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),rows:[...GV.complexSpecs014().buildings,...GV.complexSpecs014().paths].map(r=>({id:r.id,rank:r.rank,preview:GV.placePreview459(r.id,10,10)}))};})()','real rank1 locked tools');
   check('all28 independent new tools reject ordinary rank1',report.locks.rank.lv===1&&report.locks.rows.length===28&&report.locks.rows.every(r=>r.preview?.ok===false&&r.preview.reason==='城市 Lv.'+r.rank+' 解鎖'),report.locks);
   report.fixture=await ev('window.__complexFns014.setupComplexes014(('+seedApprovedBritishLegacy007.toString()+'),'+JSON.stringify(GROUP)+')','paid12-root16-theme city preserving every historical district');const fixture=report.fixture;
   check('all12 paid independent roots begin age0 with16 separate themes and unchanged old identities',fixture.oldIdentitiesExact&&fixture.roots.length===12&&new Set(fixture.roots.map(r=>r.k)).size===12&&fixture.paths.length===16&&new Set(fixture.paths.map(p=>p.theme)).size===16&&fixture.initial.roots.every(r=>r.age===0&&!r.built&&!r.operational)&&fixture.paid.every(p=>p.exact&&p.charged>0)&&fixture.initial.difficulty===1&&!fixture.initial.developer.sandbox&&!fixture.initial.developer.god,fixture);
   report.purity=await call('artPurity014');check('all112 assets rebuild deterministically without RNG world storage or canonical mutation',report.purity.calls===0&&report.purity.count===112&&report.purity.same&&report.purity.worldExact&&report.purity.storageExact&&report.purity.canonical&&report.purity.canonicalPixelsExact,report.purity);
   report.rejections=await call('rejectedPlacements014');check('all208 whole-footprint edge surface and escape counterfactuals reject without mutation',report.rejections.length===208&&report.rejections.every(r=>(r.label==='map-edge rejection'?r.preview===null:r.preview?.ok===false)&&!r.placed&&r.unchanged),report.rejections);
   report.construction=[{day:fixture.placementDay,roots:fixture.initial.roots}];
   const constructionRotation=MODE.startsWith('construction')?+MODE.slice(-1):null,shot=async n=>{for(const night of[false,true]){const s=await call('nativeScene014',constructionRotation,night,GROUP);png('images/'+GROUP+'-construction-day'+n+'-'+(night?'night':'day')+'.png',s.png,{kind:'actual ordinary native construction',ordinaryDays:n,rotation:s.rot,night,day:s.day,ages:s.roots.map(r=>({k:r.k,age:r.age})),placementDay:fixture.placementDay});}};
   if(constructionRotation!==null)await shot(0);
   for(let n=1;n<=9;n++){const q=await call('step014',1);report.construction.push({day:q.day,roots:q.roots,fiscal:q.fiscal});if(constructionRotation!==null)await shot(n);}
   check('every one of12 roots progresses exact0..9 days with no early jobs education leisure services housing coverage upkeep',validConstruction014(report.construction,fixture.placementDay),report.construction);
   check('each ordinary construction day posts real treasury delta and native ledger with own upkeep only after completion',report.construction.slice(1).every((q,n)=>validFiscal014(q.fiscal,q.day,n===8?145:0,n===8?88:0)),report.construction.map(q=>({day:q.day,fiscal:q.fiscal})));
   report.settle=[];let op=await call('snapshot014');for(let n=0;n<15&&(!ready(op)||!priorReady(op));n++){op=await call('step014',1);report.settle.push(op);}
   report.operational=op;report.capacity=await call('scalingWitness014');
   check('all12 actual roots operate with native road power water labor housing and fire readiness',ready(op)&&report.capacity.exact&&report.capacity.positive,report.capacity);
   check('completed native jobs upkeep and zero synthetic revenue counted exactly',validFiscal014(op.fiscal,op.day,145,88)&&report.capacity.daily.publicJobs===report.capacity.expectedPublicJobs&&Math.abs(report.capacity.daily.upkeep-report.capacity.expectedUpkeep)<1e-7&&report.capacity.daily.syntheticRevenue===0,report.capacity);
   check('47 retained roots all reference cells two stations old museums and4 prior districts preserved',op.retained.length===47&&op.retained.every(q=>q.bld?.k===q.k&&(q.bld.sz||1)===q.sz&&q.cells.every((b,n)=>n===0?b?.k===q.k:b?.ref?.[0]===q.x&&b.ref[1]===q.y))&&op.stations.length===2&&op.stations.every(q=>q.k===139&&q.v===3&&q.age>=9&&q.ownedRail.every(v=>v===1))&&op.oldMuseums.length===2&&op.oldMuseums.every(q=>q.bld?.k===q.k&&q.bld.sz===2)&&priorReady(op),op);
   if(MODE.startsWith('camera')){
    const rotation=+MODE.slice(-1);
    for(const night of[false,true]){
     const s=await call('nativeScene014',rotation,night,GROUP),a=await call('amenityComposition014');
     png('images/'+GROUP+'-r'+rotation+'-'+(night?'night':'day')+'.png',s.png,{kind:'actual native main and two independent supports with four themed paths',rotation,night,day:s.day,geometry:s.geometry,composition:a});
     check('unclipped three canonical roots and four native themes r'+rotation+' '+(night?'night':'day'),s.geometry.length===3&&s.geometry.every(g=>g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5))&&a.allFourIndependent&&a.allWithin&&a.allNative&&(night?s.time.b<.45:s.time.b>.95),{geometry:s.geometry,composition:a});
     if(night){const lights=[];for(const r of fixture.roots.filter(r=>r.group===GROUP))lights.push(await call('nativeLight014',r.k));check('all three physical night masks actually illuminate supplied native buildings',lights.length===3&&lights.every(q=>q.candidates>0&&q.visible>0),lights);const paths=await call('nativeAmenityLight014');check('four path light authorities are actual adjacent powered roads',paths.rows.length===4&&paths.rows.every(p=>p.sourceIsActualAdjacentRoad&&p.lighting.ready&&p.lighting.service>.03),paths);}
     const city=await call('nativeScene014',rotation,night,GROUP,.62,[36,46]);png('images/'+GROUP+'-mixed-city-r'+rotation+'-'+(night?'night':'day')+'.png',city.png,{kind:'retained native mixed British city plus all four independent precincts',rotation,night,day:city.day});
    }
    if(rotation===0){const q=await call('nativeOcclusion014');report.occlusion={trials:q.trials,selected:q.selected,foregroundFixture:q.foregroundFixture,restoration:q.restoration,payments:q.payments};if(q.capture){png('images/'+GROUP+'-partial-occlusion-night.png',q.capture.png,{kind:'actual mature paid native foreground occludes physical neighboring light',rotation:q.selected.rotation,day:q.capture.day,target:q.selected.target,foreground:q.selected.foreground});png('images/'+GROUP+'-partial-occlusion-control-night.png',q.control.png,{kind:'same-turn actual paid doze foreground removal control',rotation:q.selected.rotation,day:q.control.day});}check('mature independent foreground blocks some physical light while other windows remain visible',!!q.selected&&q.selected.partial&&(!q.foregroundFixture||validPaidForeground014(q)),report.occlusion);}
   }
   report.saveLoad=await call('nativeSaveLoad014');const sl=report.saveLoad;
   check('native save/load preserves all identities themes ages references bounded escape and following day',sl.loaded&&sl.disabled&&sl.references&&sl.otherSlotsUnchanged&&sl.bytes>1000&&sl.following.day===sl.from+1&&ready(sl.following)&&sl.capacity.exact&&sl.capacity.positive,sl);
   if(MODE==='gameplay'){
    report.isolatedPathLights=await call('isolatedPathLighting014',true);check('all four independently bought lamp themes emit actual visible native light in all four views',validPathLights014(report.isolatedPathLights),report.isolatedPathLights);
    report.coverage=await call('coverage014');const c=report.coverage,expectedFields=fixture.roots.filter(r=>r.group===GROUP&&r.coverage).length;
    check('every distinct native service field stamps its clipped square exactly once and undo restores',c.rows.length===expectedFields&&c.rows.every(r=>r.removed&&r.exactOwnedField&&r.changedCells>0&&r.undoExact),c);
    report.losses=[];for(const kind of['power','water','road']){
     const q=await call('physicalLoss014',kind);report.losses.push(q);
     check('physical '+kind+' paid demolition stops all12 roots and paid repair restores native services',q.beforeCapacity.positive&&q.removed.length>0&&q.lost.roots.length===12&&q.lost.roots.every(r=>!r.operational&&r.positions===0&&r.employed===0&&r.activity.work===0&&r.activity.education===0&&r.activity.leisure===0&&r.activity.services===0&&!r.coverageStamp&&(!r.housing||r.housing.population===0))&&q.lostCapacity.exact&&q.lostCapacity.zero&&q.repair.length===q.removed.length&&q.repair.every(p=>p.exact&&p.charged>0)&&q.recoveredCapacity.exact&&q.recoveredCapacity.positive&&ready(q.recovered)&&(kind!=='power'||q.lostLight.every(r=>r.candidates===0)&&q.recoveredLight.every(r=>r.visible>0)&&q.lostPathLight.rows.every(r=>r.changed===0&&r.lighting.service===0)&&q.recoveredPathLight.rows.every(r=>r.lighting.ready&&r.lighting.service>.03&&r.sourceIsActualAdjacentRoad)&&validPathLights014(q.recoveredIsolatedLight)),q);
    }
    if(GROUP==='fire'){
     report.fireDrill=await call('fireDrill014');const f=report.fireDrill;
     check('both exact new fire sources dispatch real native trucks on real roads, cancel after physical source demolition, restore and arrive',validFireDrill014(f),f);
    }
    report.pathEdits=await call('nativePathEdits014');const e=report.pathEdits;
    check('all four district themes independently replace for actual paid path cost and persist native load/day',e.rows.length===4&&e.originalThemesRestored&&e.otherSlotsUnchanged&&e.rows.every(r=>r.from!==r.to&&r.remove.exact&&r.remove.charged>0&&r.removed&&r.purchase.exact&&r.purchase.charged>0&&r.purchase.cost===r.plainQuote.cost&&r.edited.theme===r.to&&r.loaded&&r.metadataExact&&r.afterLoad.theme===r.to&&r.toDay===r.fromDay+1&&r.afterDay.theme===r.to&&r.afterDay.am502===1&&r.afterDay.baseWalkCost===.72&&r.removeEdited.exact&&r.restore.exact&&r.restored.theme===r.from),e);
    report.cardinal=await call('cardinalPathProbes014');check('four native paid cardinal directions survive save/load/day',report.cardinal.rows.length===4&&report.cardinal.rows.every(q=>q.road.exact&&q.purchase.exact&&q.placed.amx502.turn014===q.turn&&q.loaded&&q.metadataExact&&q.afterLoad.amx502.turn014===q.turn&&q.afterDay.amx502.turn014===q.turn&&q.toDay===q.fromDay+1&&q.remove.exact&&q.removed&&q.removeRoad.exact&&q.roadRemoved),report.cardinal);
    report.protected=await call('protectedAmenityTransactions014');const p=report.protected;
    check('new themes reject conflicting later surface tools including all12 buildings and support native underground pipes',p.rows.length===80&&p.rows.every(r=>r.preview?.ok===false&&!r.placed&&r.worldExact&&r.moneyExact&&r.retained?.theme===r.theme)&&p.overlaps.length===4&&p.overlaps.every(r=>r.preview?.ok===false&&!r.placed&&r.worldExact&&r.moneyExact)&&p.underground.length===4&&p.underground.every(r=>r.purchase.exact&&r.purchase.charged>0&&r.nativePipe&&r.themeExact&&r.undo&&r.restored)&&p.days.length===3&&p.noGrowthThrough,p);
    report.amenityRender=await call('amenityRenderWitness014');const a=report.amenityRender;
    check('each of four independent native themes changes real pixels and doze/undo restores it exactly',a.rows.length===4&&a.rows.every(r=>r.removed&&r.paid===r.quote.cost&&r.paid>0&&r.changed>0&&r.undo&&r.restored)&&a.worldExact&&a.storageExact&&a.canonicalExact,a);
    report.constraints=await call('constraints014');const q=report.constraints;
    check('real partial delivered water and partial native workforce independently constrain actual capacity',q.baseline.exact&&!!q.partialWater&&q.partialWater.exact&&q.partialWater.rows.some(r=>r.spec.group===GROUP&&r.root.operational&&r.water>0&&r.water<1)&&!!q.partialStaff&&q.partialStaff.exact&&q.partialStaff.rows.some(r=>r.spec.group===GROUP&&r.root.operational&&r.fill>0&&r.fill<1)&&q.waterPayments.every(p=>p.exact&&p.charged>0)&&q.staffPayments.every(p=>p.exact&&p.charged>0),q);
    check('zero native resident demand/workforce disables public capacities and dispatch while supplied, restored genuine homes recover',q.zero.pop===0&&q.zero.exact&&q.zero.rows.length===10&&q.zero.rows.every(r=>r.root.operational&&r.root.employed===0&&r.factor===0&&r.root.activity.leisure===0&&r.root.activity.education===0&&r.root.activity.services===0&&!r.root.coverageStamp&&(r.spec.role!=='fire'||!r.root.emergencyReady&&!r.root.emergency.sourceRegistered))&&q.restored.exact&&q.restored.positive,q);
   }
   if(MODE.startsWith('weather')){
    const kinds=MODE==='weather-wet'?['rain','storm']:['fog','snow'];report.weather=[];report.weatherSetup=[];
    for(const kind of kinds){
     const season=kind==='snow'?3:0,weather=kind==='storm'?2:kind==='fog'?0:1,rainDays=kind==='fog'?0:6;
     const setup=await ev('(()=>{const F=window.__complexFns014,beforeDay=GV.stats().day,identity=JSON.stringify(F.identity014()),applied=GV.britishWeather004('+season+','+weather+','+rainDays+');GV.fog(1);return{kind:'+JSON.stringify(kind)+',beforeDay,applied,day:GV.stats().day,season:GV.season(),identityExact:identity===JSON.stringify(F.identity014()),developer:GV.dev516B(),method:"Explicit seasonal/weather visual setup; date jump is not ordinary elapsed gameplay."};})()','explicit native '+kind+' visual setup');
     const following=await call('step014',1);report.weatherSetup.push({setup,following});
     check(kind+': explicit setup and one actual native day retain all12 and every older district',setup.identityExact&&setup.applied.season===season&&setup.applied.weather===weather&&setup.applied.rainDays===rainDays&&!setup.developer.sandbox&&!setup.developer.god&&following.day===setup.day+1&&ready(following)&&priorReady(following),{setup,following});
     for(const rotation of[0,1,2,3])for(const night of[false,true]){
      const q=await call('weatherScene014',kind,rotation,night,GROUP),file=GROUP+'-'+kind+'-r'+rotation+'-'+(night?'night':'day');
      png('images/'+file+'.png',q.png,{kind:'actual native '+kind+' with all three independent district buildings',group:GROUP,rotation,night,day:q.before.day,state:q.before,geometry:q.geometry});
      png('images/'+file+'-control.png',q.controlPNG,{kind:'same-turn native '+q.flag+' control',group:GROUP,rotation,night,day:q.before.day,state:q.before});
      delete q.png;delete q.controlPNG;report.weather.push(q);check(kind+': real weather state and individual root effect r'+rotation+' '+(night?'night':'day'),validWeather014(q,kind,rotation,night,GROUP,following.day),q);
     }
    }
    check('exact16 district condition/view/time scenes and32 original primary/control PNGs',validWeatherInventory014(report.weather,report.artifacts,kinds,GROUP),{rows:report.weather.length,artifacts:report.artifacts.map(a=>a.path)});
   }
   report.transactions=await call('nativeTransactions014');const tx=report.transactions;
   check('all three independent main/support whole-footprint reference doze undo redo and four path transactions are exact paid native edits',tx.rows.length===3&&tx.rows.every(r=>r.ok&&r.quote.ok&&r.charged===r.quote.cost&&r.charged>0&&r.gone&&r.peerExact&&r.undo&&r.restored&&r.redo&&r.regone&&r.redoPaid&&r.undoAgain&&r.final&&r.inspect.includes('英式'))&&tx.pathRows.length===4&&tx.pathRows.every(p=>p.doze&&p.removed&&p.charged>0&&p.undo&&p.exact&&p.redo&&p.regone&&p.redoPaid&&p.undoAgain&&p.final&&p.base.am502===1&&p.base.baseWalkCost===.72&&p.base.cost===p.plainCost),tx);
   check('paused renders preserve world storage identity and every canonical reference',tx.renderWorldExact&&tx.renderStorageExact&&tx.identitiesExact&&tx.canonical,tx);
   await call('nativeScene014',MODE.startsWith('camera')?+MODE.slice(-1):0,false,GROUP);
   report.performance=await ev('(()=>{for(let i=0;i<3;i++)GV.forceDraw();const frames=[];for(let i=0;i<12;i++){const t=performance.now();GV.forceDraw();frames.push(performance.now()-t);}return{frames,mean:frames.reduce((a,b)=>a+b,0)/frames.length,art:window.__complexArt014};})()','unchanged native draw-cost limit');
   check('single bounded112-art install deterministic rebuild and mean native draw strictly below1000ms',report.performance.art.builds===1&&report.performance.art.total===112&&report.performance.art.ms<10000&&report.purity.ms<20000&&report.performance.mean<1000,report.performance);
   if (MODE === 'coldload') {
    report.reloads = [];
    const sentinelKeys = ['glimmerville.v1.s1', 'glimmerville.v1.s1_bak', 'glimmerville.v1.s2', 'glimmerville.v1.s2_bak'];
    for (let iteration = 1; iteration <= 2; iteration++) {
     const failuresBeforeReload = report.failures.length;
     // Save the current live state immediately before navigation. Never swap a
     // stale fixture save under visibilitychange/autosave, and never patch it.
     const saved = await ev("(()=>{GV.setSpeed(0);GV.ai(false);GV.save();return{raw:localStorage.getItem('glimmerville.v1.s3'),snapshot:window.__complexFns014.snapshot014()};})()", 'cold reload' + iteration + ' current native save');
     check('reload' + iteration + ': paused current native save is valid and already operational', typeof saved.raw === 'string' && saved.raw.length > 1000 && saved.snapshot.slot === '3' && ready(saved.snapshot) && priorReady(saved.snapshot), { bytes: saved.raw?.length, inputDay: saved.snapshot.day });
     // Disposable fresh profile only. Valid native copies witness untouched
     // other-slot saves and backups; no user profile is attached to this browser.
     if (iteration === 1) await ev('(()=>{for(const k of ' + JSON.stringify(sentinelKeys) + ')localStorage.setItem(k,' + JSON.stringify(saved.raw) + ');return true;})()', 'create isolated other-slot sentinels');
     const sentinels = await ev('Object.fromEntries(' + JSON.stringify(sentinelKeys) + '.map(k=>[k,localStorage.getItem(k)]))', 'record slot sentinel bytes');
     const row = { iteration, inputSHA256: hash(saved.raw), inputBytes: Buffer.byteLength(saved.raw), inputDay: saved.snapshot.day,
      input: saved.snapshot, followingDays: [], sentinelSHA256: Object.fromEntries(Object.entries(sentinels).map(([k, raw]) => [k, hash(raw || '')])) };
     report.reloads.push(row); save();
     await cdp.send('Page.reload', { ignoreCache: true });
     check('reload' + iteration + ': whole page actually boots into native start menu', await waitFor(cdp, "!!window.__bootDone453&&!!window.GV&&getComputedStyle(document.getElementById('start')).display!=='none'", 180000));
     const bytes = await ev("localStorage.getItem('glimmerville.v1.s3')", 'save bytes before Continue');
     row.beforeContinueSHA256 = hash(bytes || '');
     check('reload' + iteration + ': exact full native save bytes survive navigation', bytes === saved.raw, { before: row.inputSHA256, after: row.beforeContinueSHA256 });
     const nativeSource = await ev('(async()=>{const t=await fetch("index.html",{cache:"no-store"}).then(r=>r.text());const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,"0")).join("");})()', 'exact served source hash after cold boot');
     check('reload' + iteration + ': newly loaded page source matches checked head bytes', nativeSource === report.sourceSHA256, { sourceSHA256: nativeSource });
     await register();
     await call('bindObservation014', fixture.recipe);
     row.immediate = await ev("(()=>{const b=document.getElementById('bContinue');if(!b||getComputedStyle(b).display==='none')throw Error('Native Continue is missing');b.click();GV.setSpeed(0);GV.ai(false);return window.__complexFns014.snapshot014();})()", 'native Continue click');
     check('reload' + iteration + ': Continue preserves every root/reference/age/view/theme/water cell and day', eq(row.immediate.identity, saved.snapshot.identity) && row.immediate.day === row.inputDay && row.immediate.stats.money === Math.round(saved.snapshot.stats.money) && row.immediate.slot === '3' && row.immediate.difficulty === 1 && !row.immediate.developer.sandbox && !row.immediate.developer.god && !row.immediate.coldFixDisabled, row.immediate);
     for (let frame = 1; frame <= 2; frame++) {
      const snap = await ev('new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__complexFns014.snapshot014())))', 'post-Continue frame' + frame);
      row['frame' + frame] = snap;
      check('reload' + iteration + ': frame' + frame + ' remains paused with unchanged native identity', snap.day === row.inputDay && eq(snap.identity, saved.snapshot.identity));
     }
     for (let day = 1; day <= 3; day++) {
      // There are no ensure/rebuild/repair calls here. The ordinary native tick
      // itself is responsible for T724 cold-load dispatch and the fiscal result.
      const snap = await call('step014', 1), capacity = await call('scalingWitness014');
      row.followingDays.push({ ordinaryDay: day, snapshot: snap, capacity }); save();
      check('reload' + iteration + ': unaided ordinary day' + day + ' retains population physical service staff cultural leisure coverage and all older districts', snap.day === row.inputDay + day && snap.stats.pop > 0 && snap.stats.poweredBld > 0 && (snap.districtCache?.districts || 0) > 0 && ready(snap) && priorReady(snap) && capacity.exact && capacity.positive && snap.roots.every(r => r.powerState === 1 && r.waterDelivered > 0 && r.waterState.code >= 2) && snap.shoreline.every(p => p.land !== 0 && p.water === 0) && validFiscal014(snap.fiscal,snap.day,145,88), { day: snap.day, population: snap.stats.pop, poweredBld: snap.stats.poweredBld, districtCache: snap.districtCache, roots: snap.roots, capacity });
      if (day === 1 || day === 3) {
       const scene = await call('nativeScene014', 0, false, GROUP, 1.45);
       png('images/reload' + iteration + '-day' + day + '.png', scene.png, { kind: 'actual cold Continue following ordinary day; no repair', iteration, ordinaryDay: day, day: scene.day, inputSHA256: row.inputSHA256, rotation: 0 });
      }
     }
     const afterSentinels = await ev('Object.fromEntries(' + JSON.stringify(sentinelKeys) + '.map(k=>[k,localStorage.getItem(k)]))', 'verify other-slot sentinels');
     row.otherSlotsUnchanged = eq(afterSentinels, sentinels);
     check('reload' + iteration + ': other save slots and backups remain byte-identical', row.otherSlotsUnchanged);
     row.ok = row.followingDays.length === 3 && row.otherSlotsUnchanged && report.failures.length === failuresBeforeReload; save();
    }
    check('two real cold page reload/Continue cycles each pass three unaided ordinary days', report.reloads.length === 2 && report.reloads.every(r => r.ok), report.reloads.map(r => ({ iteration: r.iteration, inputSHA256: r.inputSHA256, inputDay: r.inputDay, days: r.followingDays.map(d => d.snapshot.day), otherSlotsUnchanged: r.otherSlotsUnchanged })));
   }

   report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;check('no native uncaught exceptions or console errors',cdp.errors.length===0,cdp.errors);return true;
  });
  report.session={ok:session.ok,fails:session.fails,seconds:session.seconds};check('selected native evidence job completed',session.ok,report.session);
  check('checked product source bytes unchanged after every native probe',fs.readFileSync(path.join(ROOT,'index.html')).equals(source));
  check('all original native PNGs have verified dimensions SHA head and source provenance',report.artifacts.every(a=>{const b=fs.readFileSync(path.join(OUT,a.path));return a.checkedSHA===head&&a.sourceSHA256===report.sourceSHA256&&a.bytes===b.length&&a.sha256===hash(b)&&a.width===b.readUInt32BE(16)&&a.height===b.readUInt32BE(20);}),report.artifacts.map(a=>({path:a.path,width:a.width,height:a.height,sha256:a.sha256})));
  report.ok=report.failures.length===0;process.exitCode=report.ok?0:1;
 }catch(error){report.error=String(error.stack||error);report.ok=false;console.error(report.error);process.exitCode=1;}
 finally{clearTimeout(watchdog);report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({mode:MODE,group:GROUP,checkedSHA:head,ok:report.ok,checks:report.checks.length,failures:report.failures,error:report.error}));}
})();
