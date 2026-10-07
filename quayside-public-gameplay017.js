'use strict';
// Definitions only on import; runtime execution is gated by the Actions runner.
const fs=require('node:fs'),path=require('node:path'),{isDeepStrictEqual:equal}=require('node:util');
const {hash,complexFixtureSource014,pins017,verifyApprovedRecords013,verifyCanonicalAsset017}=require('./quayside-public-contract017');
const {passiveQuaysideState017,functionalQuaysideState017,verifyQuaysideCatalog017,directIdentity017,sameDirectIdentity017}=require('./quayside-public-new017');
const {passiveGardenState016}=require('./quayside-public-garden017');
const {passiveStreetscapeState015}=require('./quayside-public-streetscape017');
const {ownedComplexIdentity014}=require('./quayside-public-extra017');
async function observeQuayside017(ctx){
 const {ROOT,OUT,cdp,report,check:parentCheck,documentResponses,documentProof,menuReady,screenshot013,registerComplexPassive,recipe,save,sourceObserver}=ctx;
 const check=(name,ok,detail)=>parentCheck(name,ok,detail,'quayside');
 const {seedApprovedBritishLegacy007}=require(path.join(ROOT,'publiclife-legacy-fixture007.js'));
 const {functions015}=require(path.join(ROOT,'streetscape-gameplay015.js'));
 const {functions017}=require(path.join(ROOT,'quayside-gameplay017.js'));
 const {functions016}=require(path.join(ROOT,'gardenlife-gameplay016.js'));
 const api=await cdp.evalJs('({specs:GV.quaysideSpecs017(),selftest:GV.quaysideSelftest017(),functions:["quaysideSpecs017","quaysideAt017","quaysideEvidence017","quaysideSelftest017"].map(k=>({key:k,type:typeof GV[k]}))})');
 check('all six paid quayside themes exactly match the approved non-emissive source catalog',verifyQuaysideCatalog017(api.specs)&&api.selftest.ok&&api.functions.every(q=>q.type==='function'),api);
 report.quaysideLock=await cdp.evalJs("(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),paths:GV.quaysideSpecs017().paths.map(p=>({id:p.id,preview:GV.placePreview459(p.id,10,10)}))};})()");
 check('all six quayside tools enforce native city-level-four lock',report.quaysideLock.rank.lv===1&&report.quaysideLock.paths.length===6&&report.quaysideLock.paths.every(q=>!q.preview.ok&&q.preview.reason==='城市 Lv.4 解鎖'),report.quaysideLock);
 await cdp.evalJs('window.__complexFns014=(()=>{'+complexFixtureSource014(ROOT)+';return{bindObservation014,setupComplexes014,identity014,snapshot014,step014,nativeScene014};})();window.__streetscapeFns015=(()=>{'+functions015.map(f=>f.toString()).join('\n')+';return{'+functions015.map(f=>f.name).join(',')+'};})();window.__quaysideFns017=(()=>{'+functions017.map(f=>f.toString()).join('\n')+';return{'+functions017.map(f=>f.name).join(',')+'};})();window.__gardenLifeFns016=(()=>{'+functions016.map(f=>f.toString()).join('\n')+';return{'+functions016.map(f=>f.name).join(',')+'};})();true');
 const call=(name,...args)=>cdp.evalJs('window.__quaysideFns017.'+name+'('+args.map(x=>JSON.stringify(x)).join(',')+')');
 const fixture=await cdp.evalJs('window.__complexFns014.setupComplexes014(('+seedApprovedBritishLegacy007.toString()+'),"baths")');
 report.quaysideFixture=fixture;const complexRecipe=fixture.recipe;
 report.quaysidePriorPlacement=await cdp.evalJs('window.__streetscapeFns015.setupStreetscape015()');
 report.quaysidePriorGardenPlacement=await cdp.evalJs('window.__gardenLifeFns016.setupGardenLife016()');
 report.quaysidePlacement=await call('setupQuayside017');
 const placement=report.quaysidePlacement,prior=report.quaysidePriorPlacement;
 const streetRecipe={paths:prior.paths,payments:prior.payments,placementDay:prior.placementDay},quaysideRecipe={paths:placement.paths,payments:placement.payments,placementDay:placement.placementDay};
 const gp=report.quaysidePriorGardenPlacement,gardenRecipe={paths:gp.paths,payments:gp.payments,placementDay:gp.placementDay};
 check('six actual paid quayside paths preserve every old native root and all eight genuinely paid streetscape themes',fixture.oldIdentitiesExact&&placement.paths.length===6&&placement.payments.every(q=>q.exact&&q.charged===12&&q.quote.cost===q.plain.cost)&&placement.oldBuildingIdentityExact&&placement.priorThemesExact&&placement.priorDetailsCount===14&&gp.paths.length===6&&gp.payments.every(q=>q.exact&&q.charged===12)&&gp.oldBuildingIdentityExact&&gp.priorThemesExact&&gp.priorStreetscapeCount===8&&prior.paths.length===8&&prior.payments.every(q=>q.exact&&q.charged===12)&&prior.oldBuildingIdentityExact&&prior.priorThemesExact,{placement,prior,garden:gp});
 const assetBytes=async(phase)=>{
  const rows=await call('assetAudit017'),records=[];
  for(const row of rows)for(const [field,suffix]of [['png',''],['night','-night']]){
   const data=row[field];if(typeof data!=='string'||!data.startsWith('data:image/png;base64,'))throw Error('Unaltered native PNG required');
   const bytes=Buffer.from(data.slice('data:image/png;base64,'.length),'base64');
   const {relative,...actual}=verifyCanonicalAsset017(row.key,field==='night',bytes);
   const file='quayside-'+phase+'/'+relative;fs.mkdirSync(path.dirname(path.join(OUT,file)),{recursive:true});fs.writeFileSync(path.join(OUT,file),bytes);
   const record={file,...actual,kind:'unaltered official canonical quayside '+(field==='png'?'day surface':'non-emissive night surface'),phase,checkedSHA:report.checkedSHA,sourceSHA256:report.sourceSHA256,officialURL:report.officialURL};report.artifacts.push(record);records.push(record);
  }
  if(!equal(records.map(r=>r.file.slice(('quayside-'+phase+'/').length)).sort(),Object.keys(pins017.canonicalAssets).sort()))throw Error('Exactly48 distinct complete canonical surfaces required');
  return{records,rows:rows.map(({png,night,...q})=>q)};
 };
 report.quaysideAssetsBefore=await assetBytes('before');
 check('all twenty-four installed quayside views and all twenty-four empty night surfaces match exact approved native PNG bytes',report.quaysideAssetsBefore.records.length===48&&report.quaysideAssetsBefore.rows.length===24,report.quaysideAssetsBefore);
 report.quaysideOrdinaryDays=[];
 for(let n=1;n<=9;n++)report.quaysideOrdinaryDays.push(await cdp.evalJs('window.__complexFns014.step014(1)'));
 check('all twelve retained ensemble roots beside quayside paths require nine real construction days',report.quaysideOrdinaryDays.length===9&&report.quaysideOrdinaryDays.every((q,n)=>q.day===placement.placementDay+n+1&&q.roots.length===12&&q.roots.every(r=>r.age===n+1))&&report.quaysideOrdinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational))&&report.quaysideOrdinaryDays[8].roots.every(r=>r.built),report.quaysideOrdinaryDays);
 const registerPassive=async()=>{await registerComplexPassive();await cdp.evalJs('window.__streetscapePublicState015='+passiveStreetscapeState015.toString());await cdp.evalJs('window.__gardenPublicState016='+passiveGardenState016.toString());await cdp.evalJs('window.__quaysidePublicState017='+passiveQuaysideState017.toString());};
 const stateExpression=label=>'window.__quaysidePublicState017('+[label,complexRecipe,recipe,streetRecipe,gardenRecipe,quaysideRecipe].map(x=>JSON.stringify(x)).join(',')+')';
 const state=label=>cdp.evalJs(stateExpression(label));
 await registerPassive();let ready=await state('quayside-day-nine');report.quaysideOperationalDays=[ready];
 for(let n=9;n<28&&!functionalQuaysideState017(ready);n++){await cdp.evalJs('window.__complexFns014.step014(1)');ready=await state('quayside-operational-day-'+(n+1));report.quaysideOperationalDays.push(ready);}
 check('old native city and all six quayside plus fourteen retained themes retain genuine native utility staffing housing fire and road service',functionalQuaysideState017(ready),ready);
 report.quaysideTransactions=await call('quaysideTransactions017');const tx=report.quaysideTransactions;
 check('each paid quayside path survives exact native demolition undo redo and restoration',tx.rows.length===6&&tx.rows.every(r=>r.removed&&r.gone&&r.charged===r.quote.cost&&r.undo&&r.restored&&r.redo&&r.regone&&r.redoPaid&&r.undoAgain&&r.final)&&tx.drawWorldExact&&tx.drawStorageExact&&tx.canonical,tx);
 report.quaysideEdits=await call('quaysideEdits017');const edits=report.quaysideEdits;
 check('six genuine paid quayside theme edits retain direction through native save load ordinary day and disabled-placement load',edits.rows.length===6&&edits.rows.every(q=>q.exact&&q.nextDay===q.day+1&&q.storedBytes>1000)&&edits.disabledLoad&&edits.otherSlotsExact&&edits.followingDay===edits.fromDay+1&&edits.followingLighting.length===6,edits);
 report.quaysideConstraints=await call('quaysideConstraints017');const constraints=report.quaysideConstraints;
 check('quayside ownership rejects every declared conflict and escape control restores exact paid native path',constraints.disabled&&constraints.rows.length===66&&constraints.rows.every(q=>q.blocked&&q.tileExact&&q.moneyExact)&&constraints.escape.positive&&constraints.escape.disabled&&constraints.escape.undo&&constraints.escape.exact,constraints);
 report.quaysideScenes=[];
 for(const rotation of[0,1,2,3])for(const group of['baths','fire'])for(const night of[false,true]){
  const scene=await call('quaysideScene017',rotation,night,group,2);delete scene.png;report.quaysideScenes.push(scene);
  await screenshot013('public-quayside-'+group+'-view'+rotation+'-'+(night?'night':'day')+'.png',{kind:'actual official paid quayside details beside complete supplied ensembles',group,rotation,night,day:scene.day,paths:scene.paths});
 }
 report.quaysideAssetsAfter=await assetBytes('after-four-views');
 check('all six canonical quayside themes render in four genuine camera directions and day/night without changing any canonical PNG byte',report.artifacts.filter(a=>a.file.startsWith('public-quayside-')).length===16&&report.artifacts.filter(a=>a.file.startsWith('public-quayside-')).every(a=>a.width===1600&&a.height===1080)&&report.quaysideScenes.length===16&&report.quaysideScenes.every(s=>(s.group==='baths'?s.paths.slice(0,3):s.paths.slice(3)).every(p=>p.within&&p.canonical&&p.view===((p.turn+s.rotation)&3))&&(s.night?s.time.b<.45:s.time.b>.95))&&report.quaysideAssetsAfter.records.length===48,{scenes:report.quaysideScenes,assetsAfter:report.quaysideAssetsAfter});
 report.quaysideFingerprint=await cdp.evalJs('({fp:GV.fp536(),blocks:GV.blockFp536()})');
 const fpExact=verifyApprovedRecords013(report.quaysideFingerprint.fp,report.quaysideFingerprint.blocks);
 check('complete 3139 leaves 163 families 1728 blocks remain exact and six quayside themes stay strictly non-emissive',fpExact&&report.quaysideAssetsAfter.rows.every(q=>q.lit===0&&q.outside===0&&q.physicalLampCount===0&&q.partial===0&&q.edge===0),{recordsExact:fpExact,assets:report.quaysideAssetsAfter.rows});
 // BEGIN MEASURED QUAYSIDE COLD PHASE: passive reads, native save/reload,
 // native Continue, pause/AI-off, and exactly one ordinary day at a time only.
 report.quaysideColdReloads=[];
 for(let cycle=1;cycle<=2;cycle++){
  const row={cycle,days:[]};report.quaysideColdReloads.push(row);
  await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
  const raw=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')"),stored=JSON.parse(raw||'null');
  row.before=await state('quayside-before-reload-'+cycle);
  row.save={bytes:Buffer.byteLength(raw||''),sha256:hash(raw||''),version:stored?.gameVer,schema:stored?.v,day:stored?.day,money:stored?.money};
  check('quayside cold '+cycle+': native save contains old city and all six quayside plus fourteen old paid themes',functionalQuaysideState017(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.34'&&stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&Object.keys(row.before.otherSlots).length===4,{before:row.before,save:row.save});
  const beforeDocuments=documentResponses.length;
  sourceObserver.mark('quayside-cold-reload-'+cycle);
  await cdp.send('Page.reload',{ignoreCache:true});
  check('quayside cold '+cycle+': actual official reload boots native menu',await menuReady());
  await documentProof('quayside-cold-page-reload-'+cycle,beforeDocuments,'quayside');
  const menu=await cdp.evalJs("({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',fixtureAbsent:!window.__complexQA014&&!window.__complexFns014&&!window.__streetscapeQA015&&!window.__streetscapeFns015&&!window.__quaysideQA017&&!window.__quaysideFns017&&!window.__gardenLifeQA016&&!window.__gardenLifeFns016&&!window.__theatreQA013&&!window.__theatrePublic013})");
  row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:hash(menu.raw||'')};
  check('quayside cold '+cycle+': exact complete native save bytes survive T730 menu with all fixture memory absent',menu.raw===raw&&menu.slot==='3'&&menu.version==='14.34'&&menu.label==='v14.34 · T730'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
  await registerPassive();
  row.immediate=await cdp.evalJs("(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);return "+stateExpression('quayside-immediate-'+cycle)+";})()");
  const same=(q)=>equal(q.cells,row.before.cells)&&equal(q.paths,row.before.paths)&&equal(q.water,row.before.water)&&equal(q.otherSlots,row.before.otherSlots)&&equal(q.streetscapeThemes.map(p=>p.at?.amx502),row.before.streetscapeThemes.map(p=>p.at?.amx502))&&equal(q.quaysideThemes.map(p=>p.at?.amx502),row.before.quaysideThemes.map(p=>p.at?.amx502))&&sameDirectIdentity017(q,row.before);
  check('quayside cold '+cycle+': immediate paused Continue preserves every old root ref age all twenty directions themes water and other slots',!row.immediate.menuVisible&&row.immediate.version==='14.34'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&!row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&same(row.immediate),row.immediate);
  for(let frame=1;frame<=2;frame++){
   const q=await cdp.evalJs('new Promise(resolve=>requestAnimationFrame(()=>resolve('+stateExpression('quayside-paused-'+cycle+'-'+frame)+')))');
   (row.pausedFrames||=[]).push(q);
   check('quayside cold '+cycle+': paused frame '+frame+' retains saved day exact ownership and all twenty directions',q.stats.day===stored.day&&same(q),q);
  }
  for(let day=1;day<=3;day++){
   const next=await cdp.evalJs('(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);return{before,state:'+stateExpression('quayside-cold-'+cycle+'-day-'+day)+'};})()');
   row.days.push(next);
   next.ok=next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalQuaysideState017(next.state)&&sameDirectIdentity017(next.state,row.before)&&equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&equal(ownedComplexIdentity014(next.state),ownedComplexIdentity014(row.before));
   check('quayside cold '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day retains all twenty themes and real native service',next.ok,next.state);
  }
  save();
 }
 // END MEASURED QUAYSIDE COLD PHASE.
 check('both six-quayside plus fourteen-retained-theme cold Continue cycles pass their first and all three unaided days',report.quaysideColdReloads.length===2&&report.quaysideColdReloads.every(q=>q.days.length===3&&q.days.every(d=>d.ok===true&&functionalQuaysideState017(d.state))),report.quaysideColdReloads.map(q=>({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
 report.quaysideChecksPassed=true;
 await screenshot013('public-quayside-cold-reload-verified.png',{kind:'actual official old-plus-twenty-theme town after second quayside cold Continue and three unaided ordinary days'});
}
module.exports={observeQuayside017};
