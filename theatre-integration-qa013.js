#!/usr/bin/env node
'use strict';
// Browser, simulation, canvas and pixel execution ONLY in isolated Actions.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
if(process.argv.length===3&&process.argv[2]==='--static-test'){console.log(JSON.stringify(staticSeasonalWeatherTest013(),null,2));process.exit(0);}
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only; no local game execution');
const {withGame,waitFor}=require('./harness'),{seedApprovedBritishLegacy007}=require('./publiclife-legacy-fixture007');
const {verifyStatic013,BASE}=require('./theatre-static-contract013'),{verifyFingerprint013,staticTest013}=require('./theatre-fingerprint-qa013');
const {legacyFixtures013,functions013}=require('./theatre-gameplay013');
const ROOT=__dirname,MODE=process.env.TH013_MODE||'preflight',hash=x=>crypto.createHash('sha256').update(x).digest('hex');
if(!/^(preflight|fingerprint|gameplay|camera[0-3]|construction[0-3]|weather|coldload)$/.test(MODE))throw Error('Unknown theatre evidence mode');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA||!/^[0-9a-f]{40}$/.test(head))throw Error('Exact workflow head required');
const source=fs.readFileSync(path.join(ROOT,'index.html')),OUT=path.join(ROOT,'theatre-evidence',MODE);
for(const dir of['','images','guards','assets'])fs.mkdirSync(path.join(OUT,dir),{recursive:true});
const report={checkedSHA:head,workflowSHA:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID,base:BASE,sourceSHA256:hash(source),mode:MODE,checks:[],failures:[],artifacts:[],progress:[],limits:[
 'Game/browser/pixels run only in isolated GitHub Actions, fresh disposable slot3 and port8199.',
 'Age/money/rank seed remains confined to source-pinned historical city fixtures. Every new theatre, utility and amenity uses real paid tools and genuine ordinary construction days.',
 'The theatre uses existing T495 public employment, T491 leisure, completed upkeep and native theater coverage. There is no ticket revenue, new tourist contribution or per-show simulation.',
 'Six amenities are individually editable native T502 walking paths with decorative metadata; ticket office and queue rail create no sales or queue simulation.',
 'True cold-load proof uses two whole Page.reload/native Continue cycles, exact live-save bytes and three following unaided ordinary days; existing T724 topology fix stays byte-identical.',
 'Snow/fog coverage deliberately changes seasonal weather through the existing QA hook, then advances one real ordinary day; the seasonal date jump is not ordinary elapsed gameplay.',
 'CI software-rendering costs are not real-device/mobile FPS certification. Existing PWA ancillary warnings remain disclosed; no new error allowlist is introduced.'
]};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
function check(name,ok,detail){report.checks.push({name,ok:!!ok,detail});if(!ok)report.failures.push(name);save();}
function progress(phase,detail={}){const row={at:new Date().toISOString(),phase,...detail};report.progress.push(row);console.log('[Theatre013] '+JSON.stringify(row));save();}
function png(file,url,meta={}){
 if(!url?.startsWith('data:image/png;base64,')||report.artifacts.some(a=>a.path===file))throw Error('Unique native PNG required: '+file);
 const b=Buffer.from(url.split(',')[1],'base64');if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.toString('ascii',12,16)!=='IHDR')throw Error('Invalid PNG');
 const width=b.readUInt32BE(16),height=b.readUInt32BE(20);if(!width||!height)throw Error('Empty PNG');fs.writeFileSync(path.join(OUT,file),b);
 report.artifacts.push({...meta,path:file,bytes:b.length,width,height,sha256:hash(b),checkedSHA:head,sourceSHA256:report.sourceSHA256});save();
}
// Browser-only paired native render. Existing flags do not change the product.
function seasonalWeatherScene013(kind,rotation,night){
 const Q=window.__theatreQA013,F=window.__theatreFns013,scene=F.nativeScene013(rotation,night,[60,66],1.8);
 GV.weather(kind==='snow'?1:0);if(kind==='fog')GV.fog(3);
 const flag=kind==='snow'?'__noRoofSnow':'__noWx',had=Object.hasOwn(window,flag),previous=window[flag],c=document.getElementById('game'),g=c.getContext('2d'),box=scene.geometry[0].box;
 const state=()=>({day:GV.stats().day,season:GV.season(),weather:GV.stats().weather,rainDays:GV.rainDays(),fog:GV.fog(),surface:GV.weatherAt499(58,64),time:GV.daylightDbg()});
 const read=()=>g.getImageData(0,0,c.width,c.height).data;let result;
 try{
  window[flag]=false;for(let n=0;n<3;n++)GV.forceDraw();
  const before=state(),world=Q.world(),storage=JSON.stringify(Q.storage()),identities=JSON.stringify(F.identity013()),refs=[...Q.canonical.map(([k,v])=>['bld',k,v]),...Q.canonicalPaths.map(([k,v])=>['theatre013',k,v])];
  const on=read(),png=c.toDataURL('image/png');window[flag]=true;GV.forceDraw();const off=read(),controlPNG=c.toDataURL('image/png');window[flag]=false;GV.forceDraw();const restored=read();
  let changed=0,theatreChanged=0,restoredDifference=0,totalDifference=0;
  for(let i=0;i<on.length;i+=4){let d=0;for(let j=0;j<3;j++)d+=Math.abs(on[i+j]-off[i+j]);if(d>3){changed++;totalDifference+=d;const n=i/4,x=n%c.width,y=Math.floor(n/c.width);if(box&&x>=box.x&&y>=box.y&&x<box.x+box.w&&y<box.y+box.h)theatreChanged++;}if(on[i]!==restored[i]||on[i+1]!==restored[i+1]||on[i+2]!==restored[i+2]||on[i+3]!==restored[i+3])restoredDifference++;}
  const after=state();result={kind,rotation:GV.rot(),night,flag,png,controlPNG,before,after,geometry:scene.geometry,composition:F.amenityComposition013(),roots:GV.theatreEvidence013().roots,changed,theatreChanged,totalDifference,restoredDifference,worldExact:world===Q.world(),storageExact:storage===JSON.stringify(Q.storage()),identitiesExact:identities===JSON.stringify(F.identity013()),stateExact:JSON.stringify(before)===JSON.stringify(after),canonicalExact:refs.every(([family,key,v])=>GV.art574.SPR()[family][key]===v),method:kind==='snow'?'Native winter weather1 and accumulated snow; toggle existing __noRoofSnow for same-turn roof/ice contribution inside actual theatre bounds.':'Native clear weather with zero wet/snow accumulation and GV.fog(3); toggle existing __noWx for T154 fog, not the separate dawn-only __noFog layer.'};
 }finally{if(had)window[flag]=previous;else delete window[flag];GV.forceDraw();}
 result.flagRestored=had?Object.hasOwn(window,flag)&&window[flag]===previous:!Object.hasOwn(window,flag);return result;
}
function validSeasonalWeather013(q,kind,rotation,night,expectedDay){
 const b=q?.before,g=q?.geometry?.[0];
 const weather=kind==='snow'?b?.season?.idx===3&&b.weather===1&&b.rainDays>=6&&b.surface?.win===true&&b.surface.sea===3&&b.surface.snow>0&&b.surface.wet===0&&b.fog===null&&q.flag==='__noRoofSnow':b?.season?.idx===0&&b.weather===0&&b.rainDays===0&&b.surface?.snow===0&&b.surface.wet===0&&b.fog?.days===3&&q.flag==='__noWx';
 return !!(q&&q.kind===kind&&q.rotation===rotation&&q.night===night&&Number.isInteger(expectedDay)&&b?.day===expectedDay&&weather&&g?.k===281&&g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5)&&q.roots?.length===1&&q.roots[0].k===281&&q.composition?.allSixIndependent&&q.composition.allWithin&&q.composition.allNative&&q.changed>0&&q.theatreChanged>0&&q.restoredDifference===0&&q.worldExact&&q.storageExact&&q.identitiesExact&&q.stateExact&&q.canonicalExact&&q.flagRestored&&(night?b.time.b<.45:b.time.b>.95));
}
function validSeasonalInventory013(rows,artifacts){
 const slots=['fog','snow'].flatMap(kind=>[0,1,2,3].flatMap(rotation=>[false,true].map(night=>({kind,rotation,night}))));
 const expected=slots.flatMap(q=>{const base='images/'+q.kind+'-r'+q.rotation+'-'+(q.night?'night':'day');return[base+'.png',base+'-control.png'];}).sort(),actual=artifacts.filter(a=>/^images\/(fog|snow)-/.test(a.path)).map(a=>a.path).sort();
 return rows.length===16&&slots.every(s=>rows.filter(q=>q.kind===s.kind&&q.rotation===s.rotation&&q.night===s.night).length===1)&&JSON.stringify(actual)===JSON.stringify(expected);
}
function staticSeasonalWeatherTest013(){
 const current=fs.readFileSync(__filename,'utf8'),originalWeatherSHA256='69d872c6401836145e20eed6ad9f0ce98b0b8b5a76f8b6a3433bd711244405cb'; // Exact unchanged12-view weather core from595b7cb; no shallow-history fetch needed.
 const start="    report.weather=[];for(const weather of[0,1,2])",end="),report.weather);",a=current.lastIndexOf(start),b=current.indexOf(end,a)+end.length;
 if(a<0||b<end.length||crypto.createHash('sha256').update(current.slice(a,b)).digest('hex')!==originalWeatherSHA256)throw Error('Original12 weather captures/assertions changed');
 new(require('node:vm').Script)('('+seasonalWeatherScene013.toString()+')');const rejected=[];
 for(const kind of['fog','snow']){
  const positive={kind,rotation:0,night:false,flag:kind==='snow'?'__noRoofSnow':'__noWx',before:{day:302,season:{idx:kind==='snow'?3:0},weather:kind==='snow'?1:0,rainDays:kind==='snow'?7:0,fog:kind==='fog'?{days:3}:null,surface:{win:kind==='snow',sea:kind==='snow'?3:0,snow:kind==='snow'?1:0,wet:0},time:{b:1}},geometry:[{k:281,canonical:true,within:true,anchorError:[0,0]}],roots:[{k:281}],composition:{allSixIndependent:true,allWithin:true,allNative:true},changed:100,theatreChanged:10,restoredDifference:0,worldExact:true,storageExact:true,identitiesExact:true,stateExact:true,canonicalExact:true,flagRestored:true};
  if(!validSeasonalWeather013(positive,kind,0,false,302))throw Error('Synthetic seasonal positive rejected');
  for(const[name,mutate]of[['wrong native day',q=>q.before.day--],['wrong actual season',q=>q.before.season.idx=2],['unexpected fog state',q=>q.before.fog={days:2}],['zero effect',q=>q.changed=0],['zero theatre-region effect',q=>q.theatreChanged=0],['world mutation',q=>q.worldExact=false],['save mutation',q=>q.storageExact=false],['identity change',q=>q.identitiesExact=false],['weather/time mutation',q=>q.stateExact=false],['nonrepeatable pixels',q=>q.restoredDifference=1],['unrestored flag',q=>q.flagRestored=false],['wrong weather',q=>q.before.weather=2],['wrong geometry',q=>q.geometry[0].canonical=false],['missing amenities',q=>q.composition.allNative=false],['wrong day/night',q=>q.before.time.b=.3]]){const q=structuredClone(positive);mutate(q);if(validSeasonalWeather013(q,kind,0,false,302))throw Error('Seasonal negative accepted: '+name);rejected.push(kind+': '+name);}
 }
 const rows=['fog','snow'].flatMap(kind=>[0,1,2,3].flatMap(rotation=>[false,true].map(night=>({kind,rotation,night})))),artifacts=rows.flatMap(q=>{const base='images/'+q.kind+'-r'+q.rotation+'-'+(q.night?'night':'day');return[{path:base+'.png'},{path:base+'-control.png'}];});
 if(!validSeasonalInventory013(rows,artifacts))throw Error('Complete synthetic inventory rejected');
 for(const[name,r,a]of[['missing scene',rows.slice(1),artifacts],['duplicate scene',[...rows.slice(1),rows[1]],artifacts],['missing control',rows,artifacts.slice(1)],['extra PNG',rows,[...artifacts,{path:'images/fog-extra.png'}]]]){if(validSeasonalInventory013(r,a))throw Error('Inventory negative accepted: '+name);rejected.push(name);}
 return{ok:true,sourceOnly:true,gameExecuted:false,syntheticDataOnly:true,originalTwelveWeatherChecksExact:true,originalWeatherSHA256,addedPhases:['fog','snow'],addedScenes:16,addedNativePNGs:32,rejected};
}

(async()=>{
 const watchdog=setTimeout(()=>{report.error='Theatre evidence watchdog expired';save();process.exit(124);},32*60000);watchdog.unref();
 try{
  report.seasonalSourceTests=staticSeasonalWeatherTest013();
  report.static=verifyStatic013();delete report.static.protectedManifest;
  check('exact candidate source protected historical files and unchanged release labels',report.static.ok&&report.static.protectedExact&&report.static.coldLoadFixExact,report.static);
  report.version=report.static.version;report.anchor=report.static.anchor;report.release=report.static.release;
  const legacy=legacyFixtures013();report.legacyFixtures={sha256:legacy.sha256,parts:legacy.parts,exactHistoricalFunctionBodies:legacy.exactHistoricalFunctionBodies};
  const session=await withGame({port:8199,timeout:1860,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
   const ev=async(expression,label='native observation')=>{progress('start',{label});const q=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(q.exceptionDetails)throw Error(q.exceptionDetails.exception?.description||q.exceptionDetails.text);progress('done',{label});return q.result.value;};
   const weatherFunctions=[...functions013,seasonalWeatherScene013];
   const register=()=>ev('window.__theatreFns013=(()=>{'+legacy.source+'\n'+weatherFunctions.map(f=>f.toString()).join('\n')+';return{'+weatherFunctions.map(f=>f.name).join(',')+'};})()','register pinned native fixture and theatre observations');
   const call=(name,...args)=>ev('window.__theatreFns013.'+name+'('+args.map(q=>JSON.stringify(q)).join(',')+')',name);
   const readyTheatre=r=>r.roots.length===1&&r.roots[0].k===281&&r.roots.every(q=>q.operational&&q.employed>0&&q.positions>0&&q.activity.publicJobs>0&&q.activity.leisure>0&&q.coverageStamp?.field==='theater');
   const allPriorReady=r=>r.priorStreet.roots.length===3&&r.priorStreet.roots.every(q=>q.operational&&q.employed>0)&&r.priorMuseum.roots.length===1&&r.priorMuseum.roots[0].operational&&r.priorMuseum.roots[0].employed>0&&r.priorRiverside.roots.length===3&&r.priorRiverside.roots.every(q=>q.operational&&q.employed>0&&q.activity.shopping>0);
   await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1080,deviceScaleFactor:1,mobile:false});await register();
   report.boot=await ev('({ready:!!window.__bootDone453,version:GV.ver(),label:document.getElementById("startVersion456")?.textContent?.trim(),slot:localStorage.getItem("glimmerville.v1.slot"),batches:window.__t574,art:window.__theatreArt013})','native boot');
   check('native candidate version anchor and disposable slot boot',report.boot.ready&&report.boot.version===report.version&&report.boot.label==='v'+report.version+' · '+report.anchor&&report.boot.slot==='3'&&!report.boot.batches.err.length,report.boot);
   report.selftest=await ev('GV.theatreSelftest013()','bounded theatre catalog selftest');check('native theatre catalog utilities staffing and four-view art selftest',report.selftest.ok,report.selftest);
   const fp=await ev('GV.fp536()','complete current native fingerprint'),blocks=await ev('GV.blockFp536()','complete1728 native blocks');report.fingerprint=verifyFingerprint013(fp,blocks);
   check('strict28 additions all2919 old leaves and all1728 complete blocks exact',report.fingerprint.ok,report.fingerprint);
   fs.writeFileSync(path.join(OUT,'guards/fingerprint-native.json'),JSON.stringify({checkedSHA:head,sourceSHA256:report.sourceSHA256,version:report.version,anchor:report.anchor,release:false,fp,blocks,proof:report.fingerprint},null,2));
   report.fingerprintNegativeTests=staticTest013({fp,blocks});check('all13 complete-record data mutation controls reject',report.fingerprintNegativeTests.ok&&report.fingerprintNegativeTests.rejected.length===13,report.fingerprintNegativeTests);
   if(MODE==='preflight'||MODE==='fingerprint'){
    report.assets=await call('assetAudit013');for(const a of report.assets){png('assets/'+a.key+'.png',a.png,{kind:'actual native installed canonical day sprite',key:a.key});png('assets/'+a.key+'-night.png',a.night,{kind:'actual native physical emission mask',key:a.key});delete a.png;delete a.night;}
    check('28 canonical opaque assets with contained physical night emission and exact anchors',report.assets.length===28&&report.assets.every(a=>a.opaque>0&&a.partial===0&&a.outside===0&&a.view>=0&&a.view<=3&&(a.key.startsWith('bld.')?a.w===232&&a.h===260&&a.ax===116&&a.ay===258&&a.lit>0:a.w===72&&a.h===92&&a.ax===36&&a.ay===90))&&report.assets.filter(a=>/^theatre013\.(lamp|ticket)_/.test(a.key)).every(a=>a.lit>0)&&report.assets.filter(a=>/^theatre013\.(plaza|rail|bench|planter)_/.test(a.key)).every(a=>a.lit===0),report.assets);
    report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;check('no console or uncaught errors',cdp.errors.length===0,cdp.errors);return true;
   }
   report.locks=await ev('(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),rows:[...GV.theatreSpecs013().buildings,...GV.theatreSpecs013().paths].map(r=>({id:r.id,preview:GV.placePreview459(r.id,10,10)}))};})()','real rank1 catalog locking');
   check('all seven new tools reject ordinary rank1',report.locks.rank.lv===1&&report.locks.rows.length===7&&report.locks.rows.every(r=>r.preview?.ok===false),report.locks);
   report.fixture=await ev('window.__theatreFns013.setupTheatre013(('+seedApprovedBritishLegacy007.toString()+'))','genuine paid theatre and six amenities in retained British city');const fixture=report.fixture;
   check('paid age0 theatre six independently owned native themes and every old district',fixture.difficulty===1&&!fixture.developer.sandbox&&!fixture.developer.god&&fixture.roots.length===1&&fixture.initial.roots[0].k===281&&fixture.initial.roots[0].age===0&&!fixture.initial.roots[0].built&&!fixture.initial.roots[0].operational&&fixture.paid.every(p=>p.exact&&p.charged>0)&&fixture.paths.length===6&&new Set(fixture.paths.map(p=>p.theme)).size===6&&fixture.retained.length===47&&fixture.priorRiverside.length===3&&fixture.initial.paths.length===6&&fixture.initial.paths.every(p=>!p.lighting.ready&&p.lighting.service===0&&!p.lighting.source),fixture);
   report.purity=await call('artPurity013');check('28 assets rebuild deterministically without RNG world storage or canonical changes',report.purity.calls===0&&report.purity.count===28&&report.purity.same&&report.purity.worldExact&&report.purity.storageExact&&report.purity.canonical&&report.purity.canonicalPixelsExact,report.purity);
   report.rejections=await call('rejectedPlacements013');check('native collision tree road water uneven path edge and escape rejections do not mutate',report.rejections.length===50&&report.rejections.every(r=>(r.label==='map-edge rejection'?r.preview===null:r.preview?.ok===false)&&!r.placed&&r.unchanged),report.rejections);
   const constructionRotation=MODE.startsWith('construction')?+MODE.slice(-1):null;
   const constructionShot=async(days)=>{for(const night of[false,true]){const scene=await call('nativeScene013',constructionRotation,night,[60,66],1.6);png('images/construction-day'+days+'-'+(night?'night':'day')+'.png',scene.png,{kind:'actual native ordinary construction',ordinaryDays:days,day:scene.day,rotation:scene.rot,night,ages:scene.roots.map(r=>({k:r.k,age:r.age})),placementDay:fixture.placementDay});}};
   if(constructionRotation!==null)await constructionShot(0);
   for(let days=1;days<=9;days++){report.current=await call('step013',1);if(constructionRotation!==null&&[1,3,6,8,9].includes(days))await constructionShot(days);}
   report.nineDays=await ev('({days:window.__theatreQA013.days,now:window.__theatreFns013.snapshot013()})','nine actual ordinary construction days');
   check('actual age0 to9 sequence gates public jobs leisure coverage and upkeep before completion',report.nineDays.days.length===9&&report.nineDays.days.every((d,n)=>d.from===fixture.placementDay+n&&d.day===fixture.placementDay+n+1&&d.roots.length===1&&d.roots[0].age===n+1)&&report.nineDays.days.slice(0,8).every(d=>d.roots.every(r=>!r.built&&!r.operational&&r.positions===0&&r.employed===0&&r.activity.work===0&&r.activity.leisure===0&&!r.coverageStamp&&r.upkeep===0))&&report.nineDays.now.roots[0].age===9&&report.nineDays.now.roots[0].built,report.nineDays);
   if(constructionRotation!==null){const shots=report.artifacts.filter(p=>p.path.startsWith('images/construction-day')),milestones=[0,1,3,6,8,9];report.construction={rotation:constructionRotation,milestones,shots};check('12 actual day/night construction PNGs ages0/1/3/6/8/9 in this rotation',shots.length===12&&milestones.every(d=>[false,true].every(night=>shots.filter(q=>q.ordinaryDays===d&&q.night===night&&q.rotation===constructionRotation&&q.ages.length===1&&q.ages[0].k===281&&q.ages[0].age===d).length===1)),report.construction);}
   for(let n=9;n<28;n++){const capacity=await call('scalingWitness013');if(readyTheatre(report.current)&&capacity.positive&&allPriorReady(report.current))break;report.current=await call('step013',1);}
   report.operational=await call('snapshot013');report.capacity=await call('scalingWitness013');const op=report.operational,r=op.roots[0];
   check('native road power delivered water public workforce and cultural activity truly operate',readyTheatre(op)&&r.powerState===1&&r.powerAllocation?.root===r.root&&r.powerAllocation.pool>=0&&r.waterState.code>=2&&r.waterDelivered>0&&r.road.length>0&&r.staff?.k===281&&r.employed<=r.positions+.005&&r.positions<=16&&r.activity.enterpriseJobs===0&&r.activity.education===0&&r.activity.shopping===0&&r.activity.services===0&&r.upkeep===10,op);
   check('native200 cultural capacity scales exactly with actual staffing water and city demand',report.capacity.exact&&report.capacity.positive,report.capacity);
   report.authority=await ev('GV.theatreSpecs013().authority','read theatre service boundaries');check('no ticket revenue no own tourist contribution and native cultural authorities only',report.authority.ticketRevenue===0&&report.authority.tourism===0&&report.authority.staff==='T495'&&report.authority.leisure==='T491',report.authority);
   check('47 British footprints two stations old museums and all older districts retain native identities',op.retained.length===47&&op.retained.every(q=>q.bld?.k===q.k&&(q.bld.sz||1)===q.sz&&q.cells.every((b,n)=>n===0?b.k===q.k:b?.ref?.[0]===q.x&&b.ref[1]===q.y))&&op.stations.length===2&&op.stations.every(q=>q.k===139&&q.v===3&&q.age>=9&&q.ownedRail.every(v=>v===1))&&op.oldMuseums.length===2&&op.oldMuseums.every(q=>q.bld?.k===q.k&&q.bld.sz===2)&&allPriorReady(op),{retained:op.retained,stations:op.stations,oldMuseums:op.oldMuseums,street:op.priorStreet,museum:op.priorMuseum,riverside:op.priorRiverside});
   if(MODE.startsWith('camera')){
    const rotation=+MODE.slice(-1);
    for(const night of[false,true]){
     const scene=await call('nativeScene013',rotation,night,[60,66],1.8),g=scene.geometry[0],amenities=await call('amenityComposition013');
     png('images/theatre-quarter-r'+rotation+'-'+(night?'night':'day')+'.png',scene.png,{kind:'actual native theatre and six separate public forecourt amenities',rotation,night,day:scene.day,geometry:scene.geometry,amenities});
     check('full unclipped canonical theatre six amenities camera'+rotation+' '+(night?'night':'day'),scene.rot===rotation&&g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5)&&(night?scene.time.b<.45:scene.time.b>.95)&&amenities.allSixIndependent&&amenities.allWithin&&amenities.allNative,{geometry:g,amenities});
     if(night){const light=await call('nativeAmenityLight013');check('physical ticket and lamp masks use real adjacent-road power camera'+rotation,light.rows.length===2&&light.rows.every(q=>q.sourceIsActualAdjacentRoad&&q.lighting.ready&&q.lighting.service>.03&&q.changed>0),light);}
     const town=await call('nativeScene013',rotation,night,[49,46],.65);png('images/mixed-town-r'+rotation+'-'+(night?'night':'day')+'.png',town.png,{kind:'actual retained British town station museum riverside and theatre',rotation,night,day:town.day});
    }
   }
   report.saveLoad=await call('nativeSaveLoad013');const sl=report.saveLoad;
   check('native save/load preserves every root reference age view and theme with bounded escape and next day',sl.loaded&&sl.disabled&&sl.references&&sl.otherSlotsUnchanged&&sl.bytes>1000&&sl.following.day===sl.from+1&&readyTheatre(sl.following)&&sl.capacity.positive,sl);
   if(MODE==='gameplay'){
    report.coverage=await call('coverage013');const c=report.coverage;check('native theater radius7 field stamps exactly225 cells once and survives doze undo rebuild load/day',c.staffed&&c.loadedStaffed&&c.removed&&c.loaded&&c.to===c.from+1&&c.exactOwnedField&&c.changedCells===225&&c.undoExact&&c.rebuildExact&&c.loadExact,c);
    report.losses=[];for(const kind of['power','water','road']){const q=await call('physicalLoss013',kind);report.losses.push(q);check('paid physical '+kind+' removal stops service and real paid repair restores',q.beforeCapacity.positive&&q.removed.length>0&&q.lost.roots.length===1&&q.lost.roots.every(r=>!r.operational&&r.positions===0&&r.employed===0&&r.activity.work===0&&r.activity.leisure===0&&!r.coverageStamp)&&q.lostCapacity.exact&&q.lostCapacity.zero&&q.repair.length===q.removed.length&&q.repair.every(p=>p.exact&&p.charged>0)&&q.recoveredCapacity.positive&&readyTheatre(q.recovered)&&(kind!=='power'||q.lostLight.every(r=>r.candidates===0)&&q.recoveredLight.some(r=>r.visible>0)&&q.lostModuleLight.rows.length===2&&q.lostModuleLight.rows.every(r=>r.changed===0&&r.lighting.service===0)&&q.recoveredModuleLight.rows.length===2&&q.recoveredModuleLight.rows.every(r=>r.changed>0&&r.lighting.ready&&r.lighting.service>.03&&r.sourceIsActualAdjacentRoad)),q);}
    report.pathEdits=await call('nativePathEdits013');const edit=report.pathEdits;check('six independent paid amenity replacements persist through actual native load and following day',edit.rows.length===6&&edit.originalThemesRestored&&edit.otherSlotsUnchanged&&edit.rows.every(r=>r.from!==r.to&&r.remove.exact&&r.remove.charged>0&&r.removed&&r.purchase.exact&&r.purchase.charged>0&&r.purchase.cost===r.plainQuote.cost&&r.edited.theme===r.to&&r.loaded&&r.metadataExact&&r.afterLoad.theme===r.to&&r.toDay===r.fromDay+1&&r.afterDay.theme===r.to&&r.afterDay.am502===1&&r.afterDay.baseWalkCost===.72&&r.removeEdited.exact&&r.restore.exact&&r.restored.theme===r.from),edit);
    report.cardinalPaths=await call('cardinalPathProbes013');const cardinal=report.cardinalPaths;check('four paid cardinal road-facing orientations persist native save/load/day',cardinal.rows.length===4&&cardinal.rows.every(q=>q.road.exact&&q.purchase.exact&&q.placed.amx502.turn013===q.turn&&q.loaded&&q.metadataExact&&q.afterLoad.amx502.turn013===q.turn&&q.afterDay.amx502.turn013===q.turn&&q.toDay===q.fromDay+1&&q.remove.exact&&q.removed&&q.removeRoad.exact&&q.roadRemoved),cardinal);
    report.protectedAmenities=await call('protectedAmenityTransactions013');const protectedPaths=report.protectedAmenities;check('native themes reject later conflicting road zoning building trees and remain growth-free over three days',protectedPaths.rows.length===48&&protectedPaths.rows.every(q=>q.preview?.ok===false&&!q.placed&&q.worldExact&&q.moneyExact&&q.retained?.theme===q.theme)&&protectedPaths.overlaps.length===6&&protectedPaths.overlaps.every(q=>q.preview?.ok===false&&!q.placed&&q.worldExact&&q.moneyExact)&&protectedPaths.underground.length===6&&protectedPaths.underground.every(q=>q.purchase.exact&&q.purchase.charged>0&&q.nativePipe&&q.themeExact&&q.undo&&q.restored)&&protectedPaths.days.length===3&&protectedPaths.noGrowthThrough,protectedPaths);
    report.amenityRender=await call('amenityRenderWitness013');const a=report.amenityRender;check('each of six genuine native amenities contributes actual pixels and independently dozes/undoes',a.rows.length===6&&a.rows.every(r=>r.removed&&r.paid===r.quote.cost&&r.paid>0&&r.changed>0&&r.undo&&r.restored)&&a.worldExact&&a.storageExact&&a.canonicalExact,a);
    report.constraints=await call('constraints013');const q=report.constraints;check('actual partial water allocation and partial workforce independently scale native theatre capacity',q.baseline.exact&&!!q.partialWater&&q.partialWater.exact&&q.partialWater.water>0&&q.partialWater.water<1&&!!q.partialStaff&&q.partialStaff.exact&&q.partialStaff.fill>0&&q.partialStaff.fill<1&&q.waterPayments.every(p=>p.exact&&p.charged>0)&&q.staffPayments.every(p=>p.exact&&p.charged>0),q);
    check('zero actual residents leave supplied theatre without workforce leisure or coverage and native load restores',q.zero.pop===0&&q.zero.root.operational&&q.zero.root.employed===0&&q.zero.root.capacityFactor===0&&q.zero.root.activity.leisure===0&&!q.zero.root.coverageStamp&&q.zero.exact&&q.restored.exact&&q.restored.positive,q);
   }
   if(MODE==='camera0'){
    const q=await call('nativeOcclusion013');report.occlusion={trials:q.trials,selected:q.selected};if(q.capture){png('images/partial-occlusion-night.png',q.capture.png,{kind:'genuine mature paid foreground blocks physical theatre light',rotation:0,ordinaryDays:9,foreground:q.selected.foreground,day:q.capture.day});png('images/partial-occlusion-control-night.png',q.control.png,{kind:'same-turn native undo control without foreground',rotation:0,day:q.control.day});}
    check('genuine age9 foreground blocks some theatre emission while other windows remain visible',!!q.selected&&q.selected.partial&&q.selected.payment.exact&&q.selected.payment.charged>0&&q.selected.initial.age===0&&q.selected.days.length===9&&q.selected.days.every((d,n)=>d.day===q.selected.from+n+1&&d.age===n+1)&&q.selected.to===q.selected.from+9,report.occlusion);
   }
   if(MODE==='weather'){
    report.weather=[];for(const weather of[0,1,2])for(const rotation of[0,1,2,3]){await call('nativeScene013',rotation,false,[60,66],1.8);const q=await ev('(()=>{const actualWeather=GV.weather('+weather+');GV.forceDraw();return{actualWeather,rot:GV.rot(),png:document.getElementById("game").toDataURL("image/png"),evidence:GV.theatreEvidence013(),composition:window.__theatreFns013.amenityComposition013()};})()','actual native weather render');png('images/weather'+weather+'-r'+rotation+'.png',q.png,{kind:'actual native weather theatre and six paid amenities',weather,rotation,day:q.evidence.day});report.weather.push({weather,rotation,actualWeather:q.actualWeather,rot:q.rot,roots:q.evidence.roots,composition:q.composition});}
    check('all12 real weather and camera views preserve theatre and six native amenities',report.weather.length===12&&report.weather.every(q=>q.weather===q.actualWeather&&q.rotation===q.rot&&q.roots.length===1&&q.roots[0].k===281&&q.composition.allSixIndependent&&q.composition.allWithin&&q.composition.allNative),report.weather);
    // Additive visual coverage: the seasonal date jump is explicit QA setup,
    // not ordinary elapsed gameplay. Only the following step is a native day.
    report.seasonalWeather=[];report.seasonalSetup=[];
    for(const kind of['fog','snow']){
     const season=kind==='snow'?3:0,weather=kind==='snow'?1:0,rainDays=kind==='snow'?6:0;
     const setup=await ev('(()=>{const F=window.__theatreFns013,beforeDay=GV.stats().day,identity=JSON.stringify(F.identity013()),applied=GV.britishWeather004('+season+','+weather+','+rainDays+');'+(kind==='snow'?'GV.fog(1);':'')+'return{fogBeforeDay:GV.fog(),kind:'+JSON.stringify(kind)+',beforeDay,applied,day:GV.stats().day,season:GV.season(),identityExact:identity===JSON.stringify(F.identity013()),developer:GV.dev516B(),method:"Deliberate existing seasonal/weather visual-test hook; date jump is not ordinary elapsed simulation."};})()','explicit '+kind+' visual setup');
     // Expire the previous fog naturally on this actual winter day; no raw fog assignment.
     const following=await call('step013',1);report.seasonalSetup.push({setup,following});
     check(kind+': visual setup preserves identities and following genuine ordinary day settles services',setup.identityExact&&setup.applied.season===season&&setup.applied.weather===weather&&setup.applied.rainDays===rainDays&&setup.day===(kind==='snow'?301:1)&&!setup.developer.sandbox&&!setup.developer.god&&following.day===setup.day+1&&readyTheatre(following)&&allPriorReady(following)&&following.roots.every(r=>r.powerState===1&&r.waterState.code>=2&&r.waterDelivered>0),{setup,following});
     for(const rotation of[0,1,2,3])for(const night of[false,true]){
      const q=await call('seasonalWeatherScene013',kind,rotation,night),phase=night?'night':'day',file=kind+'-r'+rotation+'-'+phase;
      png('images/'+file+'.png',q.png,{kind:'actual native '+kind+' theatre and six amenities after explicit visual setup and one ordinary day',rotation,night,day:q.before.day,condition:q.before,geometry:q.geometry});
      png('images/'+file+'-control.png',q.controlPNG,{kind:'same-turn native '+q.flag+' visual-only control for '+kind,rotation,night,day:q.before.day,condition:q.before});
      delete q.png;delete q.controlPNG;report.seasonalWeather.push(q);
      check(kind+': real native state geometry effect and unchanged world/storage r'+rotation+' '+phase,validSeasonalWeather013(q,kind,rotation,night,following.day),q);
     }
    }
    check('exact16 added snow/fog day-night views plus32 primary/control PNGs; original12 retained',report.weather.length===12&&validSeasonalInventory013(report.seasonalWeather,report.artifacts),{originalWeather:report.weather.length,addedWeather:report.seasonalWeather.length,addedPNGs:report.artifacts.filter(a=>/^images\/(fog|snow)-/.test(a.path)).length});

   }
   report.transactions=await call('nativeTransactions013');const tx=report.transactions;check('paid reference-cell whole-footprint doze undo redo and six independent native path transactions',tx.rows.length===1&&tx.rows.every(r=>r.ok&&r.quote.ok&&r.charged===r.quote.cost&&r.charged>0&&r.gone&&r.undo&&r.restored&&r.redo&&r.regone&&r.redoPaid&&r.undoAgain&&r.final&&r.inspect.includes('英式'))&&tx.pathRows.length===6&&tx.pathRows.every(p=>p.doze&&p.removed&&p.charged>0&&p.undo&&p.exact&&p.redo&&p.regone&&p.redoPaid&&p.undoAgain&&p.final&&p.base.am502===1&&p.base.baseWalkCost===.72&&p.base.cost===p.plainCost),tx);
   check('paused native renders preserve world storage identities and canonical references',tx.renderWorldExact&&tx.renderStorageExact&&tx.identitiesExact&&tx.canonical,tx);
   report.performance=await ev('(()=>{for(let i=0;i<3;i++)GV.forceDraw();const frames=[];for(let i=0;i<12;i++){const t=performance.now();GV.forceDraw();frames.push(performance.now()-t);}return{frames,mean:frames.reduce((a,b)=>a+b,0)/frames.length,art:window.__theatreArt013};})()','actual native drawing time');check('single bounded art build deterministic rebuild and native renderer costs measured',report.performance.art.builds===1&&report.performance.art.total===28&&report.performance.art.ms<10000&&report.purity.ms<20000&&report.performance.mean<1000,report.performance);
   if (MODE === 'coldload') {
    report.reloads = [];
    const sentinelKeys = ['glimmerville.v1.s1', 'glimmerville.v1.s1_bak', 'glimmerville.v1.s2', 'glimmerville.v1.s2_bak'];
    for (let iteration = 1; iteration <= 2; iteration++) {
     const failuresBeforeReload = report.failures.length;
     // Save the current live state immediately before navigation. Never swap a
     // stale fixture save under visibilitychange/autosave, and never patch it.
     const saved = await ev("(()=>{GV.setSpeed(0);GV.ai(false);GV.save();return{raw:localStorage.getItem('glimmerville.v1.s3'),snapshot:window.__theatreFns013.snapshot013()};})()", 'cold reload' + iteration + ' current native save');
     check('reload' + iteration + ': paused current native save is valid and already operational', typeof saved.raw === 'string' && saved.raw.length > 1000 && saved.snapshot.slot === '3' && readyTheatre(saved.snapshot) && allPriorReady(saved.snapshot), { bytes: saved.raw?.length, inputDay: saved.snapshot.day });
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
     await call('bindObservation013', fixture.recipe);
     row.immediate = await ev("(()=>{const b=document.getElementById('bContinue');if(!b||getComputedStyle(b).display==='none')throw Error('Native Continue is missing');b.click();GV.setSpeed(0);GV.ai(false);return window.__theatreFns013.snapshot013();})()", 'native Continue click');
     check('reload' + iteration + ': Continue preserves every root/reference/age/view/theme/water cell and day', eq(row.immediate.identity, saved.snapshot.identity) && row.immediate.day === row.inputDay && row.immediate.stats.money === Math.round(saved.snapshot.stats.money) && row.immediate.slot === '3' && row.immediate.difficulty === 1 && !row.immediate.developer.sandbox && !row.immediate.developer.god && !row.immediate.coldFixDisabled, row.immediate);
     for (let frame = 1; frame <= 2; frame++) {
      const snap = await ev('new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__theatreFns013.snapshot013())))', 'post-Continue frame' + frame);
      row['frame' + frame] = snap;
      check('reload' + iteration + ': frame' + frame + ' remains paused with unchanged native identity', snap.day === row.inputDay && eq(snap.identity, saved.snapshot.identity));
     }
     for (let day = 1; day <= 3; day++) {
      // There are no ensure/rebuild/repair calls here. The ordinary native tick
      // itself is responsible for T724 cold-load dispatch and the fiscal result.
      const snap = await call('step013', 1), capacity = await call('scalingWitness013');
      row.followingDays.push({ ordinaryDay: day, snapshot: snap, capacity }); save();
      check('reload' + iteration + ': unaided ordinary day' + day + ' retains population physical service staff cultural leisure coverage and all older districts', snap.day === row.inputDay + day && snap.stats.pop > 0 && snap.stats.poweredBld > 0 && (snap.districtCache?.districts || 0) > 0 && readyTheatre(snap) && allPriorReady(snap) && capacity.exact && capacity.positive && snap.roots.every(r => r.powerState === 1 && r.waterDelivered > 0 && r.waterState.code >= 2) && snap.shoreline.every(p => p.land !== 0 && p.water === 0), { day: snap.day, population: snap.stats.pop, poweredBld: snap.stats.poweredBld, districtCache: snap.districtCache, roots: snap.roots, capacity });
      if (day === 1 || day === 3) {
       const scene = await call('nativeScene013', 0, false, [60, 66], 1.5);
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

   report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;check('console and uncaught exceptions absent',cdp.errors.length===0,cdp.errors);return true;
  });
  report.session={ok:session.ok,fails:session.fails,seconds:session.seconds};check('selected native evidence session completed',session.ok,report.session);
  check('exact checked product source remains unchanged',fs.readFileSync(path.join(ROOT,'index.html')).equals(source));
  check('every delivered native PNG verifies bytes dimensions exact head and source provenance',report.artifacts.every(a=>{const b=fs.readFileSync(path.join(OUT,a.path));return a.checkedSHA===head&&a.sourceSHA256===report.sourceSHA256&&a.bytes===b.length&&a.sha256===hash(b)&&a.width===b.readUInt32BE(16)&&a.height===b.readUInt32BE(20);}),report.artifacts.map(a=>({path:a.path,width:a.width,height:a.height,sha256:a.sha256})));
  report.ok=report.failures.length===0;process.exitCode=report.ok?0:1;
 }catch(error){report.error=String(error.stack||error);report.ok=false;console.error(report.error);process.exitCode=1;}
 finally{clearTimeout(watchdog);report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({mode:MODE,checkedSHA:head,ok:report.ok,checks:report.checks.length,failures:report.failures,error:report.error}));}
})();
