'use strict';
// Definitions only on import; runtime execution is gated by the Actions runner.
const fs=require('node:fs'),path=require('node:path'),{isDeepStrictEqual:equal}=require('node:util');
const {hash,complexFixtureSource014,pins016,verifyApprovedRecords013,verifyCanonicalAsset016}=require('./gardenlife-public-contract016');
const {passiveGardenState016,functionalGardenState016,verifyGardenCatalog016}=require('./gardenlife-public-new016');
const {passiveStreetscapeState015}=require('./gardenlife-public-streetscape016');
const {ownedComplexIdentity014}=require('./gardenlife-public-extra016');
async function observeGarden016(ctx){
 const {ROOT,OUT,cdp,report,check:parentCheck,documentResponses,documentProof,menuReady,screenshot013,registerComplexPassive,recipe,save,sourceObserver}=ctx;
 const check=(name,ok,detail)=>parentCheck(name,ok,detail,'garden');
 const {seedApprovedBritishLegacy007}=require(path.join(ROOT,'publiclife-legacy-fixture007.js'));
 const {functions015}=require(path.join(ROOT,'streetscape-gameplay015.js'));
 const {functions016}=require(path.join(ROOT,'gardenlife-gameplay016.js'));
 const api=await cdp.evalJs('({specs:GV.gardenLifeSpecs016(),selftest:GV.gardenLifeSelftest016(),functions:["gardenLifeSpecs016","gardenLifeAt016","gardenLifeEvidence016","gardenLifeSelftest016"].map(k=>({key:k,type:typeof GV[k]}))})');
 check('all six paid garden themes exactly match the approved non-emissive source catalog',verifyGardenCatalog016(api.specs)&&api.selftest.ok&&api.functions.every(q=>q.type==='function'),api);
 report.gardenLock=await cdp.evalJs("(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),paths:GV.gardenLifeSpecs016().paths.map(p=>({id:p.id,preview:GV.placePreview459(p.id,10,10)}))};})()");
 check('all six garden tools enforce native city-level-four lock',report.gardenLock.rank.lv===1&&report.gardenLock.paths.length===6&&report.gardenLock.paths.every(q=>!q.preview.ok&&q.preview.reason==='城市 Lv.4 解鎖'),report.gardenLock);
 await cdp.evalJs('window.__complexFns014=(()=>{'+complexFixtureSource014(ROOT)+';return{bindObservation014,setupComplexes014,identity014,snapshot014,step014,nativeScene014};})();window.__streetscapeFns015=(()=>{'+functions015.map(f=>f.toString()).join('\n')+';return{'+functions015.map(f=>f.name).join(',')+'};})();window.__gardenLifeFns016=(()=>{'+functions016.map(f=>f.toString()).join('\n')+';return{'+functions016.map(f=>f.name).join(',')+'};})();true');
 const call=(name,...args)=>cdp.evalJs('window.__gardenLifeFns016.'+name+'('+args.map(x=>JSON.stringify(x)).join(',')+')');
 const fixture=await cdp.evalJs('window.__complexFns014.setupComplexes014(('+seedApprovedBritishLegacy007.toString()+'),"baths")');
 report.gardenFixture=fixture;const complexRecipe=fixture.recipe;
 report.gardenPriorPlacement=await cdp.evalJs('window.__streetscapeFns015.setupStreetscape015()');
 report.gardenPlacement=await call('setupGardenLife016');
 const placement=report.gardenPlacement,prior=report.gardenPriorPlacement;
 const streetRecipe={paths:prior.paths,payments:prior.payments,placementDay:prior.placementDay},gardenRecipe={paths:placement.paths,payments:placement.payments,placementDay:placement.placementDay};
 check('six actual paid garden paths preserve every old native root and all eight genuinely paid streetscape themes',fixture.oldIdentitiesExact&&placement.paths.length===6&&placement.payments.every(q=>q.exact&&q.charged===12&&q.quote.cost===q.plain.cost)&&placement.oldBuildingIdentityExact&&placement.priorThemesExact&&placement.priorStreetscapeCount===8&&prior.paths.length===8&&prior.payments.every(q=>q.exact&&q.charged===12)&&prior.oldBuildingIdentityExact&&prior.priorThemesExact,{placement,prior});
 const assetBytes=async(phase)=>{
  const rows=await call('assetAudit016'),records=[];
  for(const row of rows)for(const [field,suffix]of [['png',''],['night','-night']]){
   const data=row[field];if(typeof data!=='string'||!data.startsWith('data:image/png;base64,'))throw Error('Unaltered native PNG required');
   const bytes=Buffer.from(data.slice('data:image/png;base64,'.length),'base64');
   const {relative,...actual}=verifyCanonicalAsset016(row.key,field==='night',bytes);
   const file='garden-'+phase+'/'+relative;fs.mkdirSync(path.dirname(path.join(OUT,file)),{recursive:true});fs.writeFileSync(path.join(OUT,file),bytes);
   const record={file,...actual,kind:'unaltered official canonical garden '+(field==='png'?'day surface':'non-emissive night surface'),phase,checkedSHA:report.checkedSHA,sourceSHA256:report.sourceSHA256,officialURL:report.officialURL};report.artifacts.push(record);records.push(record);
  }
  if(!equal(records.map(r=>r.file.slice(('garden-'+phase+'/').length)).sort(),Object.keys(pins016.canonicalAssets).sort()))throw Error('Exactly48 distinct complete canonical surfaces required');
  return{records,rows:rows.map(({png,night,...q})=>q)};
 };
 report.gardenAssetsBefore=await assetBytes('before');
 check('all twenty-four installed garden views and all twenty-four empty night surfaces match exact approved native PNG bytes',report.gardenAssetsBefore.records.length===48&&report.gardenAssetsBefore.rows.length===24,report.gardenAssetsBefore);
 report.gardenOrdinaryDays=[];
 for(let n=1;n<=9;n++)report.gardenOrdinaryDays.push(await cdp.evalJs('window.__complexFns014.step014(1)'));
 check('all twelve retained ensemble roots beside garden paths require nine real construction days',report.gardenOrdinaryDays.length===9&&report.gardenOrdinaryDays.every((q,n)=>q.day===placement.placementDay+n+1&&q.roots.length===12&&q.roots.every(r=>r.age===n+1))&&report.gardenOrdinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational))&&report.gardenOrdinaryDays[8].roots.every(r=>r.built),report.gardenOrdinaryDays);
 const registerPassive=async()=>{await registerComplexPassive();await cdp.evalJs('window.__streetscapePublicState015='+passiveStreetscapeState015.toString());await cdp.evalJs('window.__gardenPublicState016='+passiveGardenState016.toString());};
 const stateExpression=label=>'window.__gardenPublicState016('+[label,complexRecipe,recipe,streetRecipe,gardenRecipe].map(x=>JSON.stringify(x)).join(',')+')';
 const state=label=>cdp.evalJs(stateExpression(label));
 await registerPassive();let ready=await state('garden-day-nine');report.gardenOperationalDays=[ready];
 for(let n=9;n<28&&!functionalGardenState016(ready);n++){await cdp.evalJs('window.__complexFns014.step014(1)');ready=await state('garden-operational-day-'+(n+1));report.gardenOperationalDays.push(ready);}
 check('old native city and all six garden plus eight streetscape themes retain genuine native utility staffing housing fire and road service',functionalGardenState016(ready),ready);
 report.gardenTransactions=await call('gardenLifeTransactions016');const tx=report.gardenTransactions;
 check('each paid garden path survives exact native demolition undo redo and restoration',tx.rows.length===6&&tx.rows.every(r=>r.removed&&r.gone&&r.charged===r.quote.cost&&r.undo&&r.restored&&r.redo&&r.regone&&r.redoPaid&&r.undoAgain&&r.final)&&tx.drawWorldExact&&tx.drawStorageExact&&tx.canonical,tx);
 report.gardenEdits=await call('gardenLifeEdits016');const edits=report.gardenEdits;
 check('six genuine paid garden theme edits retain direction through native save load ordinary day and disabled-placement load',edits.rows.length===6&&edits.rows.every(q=>q.exact&&q.nextDay===q.day+1&&q.storedBytes>1000)&&edits.disabledLoad&&edits.otherSlotsExact&&edits.followingDay===edits.fromDay+1&&edits.followingLighting.length===6,edits);
 report.gardenConstraints=await call('gardenLifeConstraints016');const constraints=report.gardenConstraints;
 check('garden ownership rejects every declared conflict and escape control restores exact paid native path',constraints.disabled&&constraints.rows.length===60&&constraints.rows.every(q=>q.blocked&&q.tileExact&&q.moneyExact)&&constraints.escape.positive&&constraints.escape.disabled&&constraints.escape.undo&&constraints.escape.exact,constraints);
 report.gardenScenes=[];
 for(const rotation of[0,1,2,3])for(const group of['baths','fire'])for(const night of[false,true]){
  const scene=await call('gardenLifeScene016',rotation,night,group,2);delete scene.png;report.gardenScenes.push(scene);
  await screenshot013('public-garden-'+group+'-view'+rotation+'-'+(night?'night':'day')+'.png',{kind:'actual official paid garden details beside complete supplied ensembles',group,rotation,night,day:scene.day,paths:scene.paths});
 }
 report.gardenAssetsAfter=await assetBytes('after-four-views');
 check('all six canonical garden themes render in four genuine camera directions and day/night without changing any canonical PNG byte',report.artifacts.filter(a=>a.file.startsWith('public-garden-')).length===16&&report.artifacts.filter(a=>a.file.startsWith('public-garden-')).every(a=>a.width===1600&&a.height===1080)&&report.gardenScenes.length===16&&report.gardenScenes.every(s=>(s.group==='baths'?s.paths.slice(0,3):s.paths.slice(3)).every(p=>p.within&&p.canonical&&p.view===((p.turn+s.rotation)&3))&&(s.night?s.time.b<.45:s.time.b>.95))&&report.gardenAssetsAfter.records.length===48,{scenes:report.gardenScenes,assetsAfter:report.gardenAssetsAfter});
 report.gardenFingerprint=await cdp.evalJs('({fp:GV.fp536(),blocks:GV.blockFp536()})');
 const fpExact=verifyApprovedRecords013(report.gardenFingerprint.fp,report.gardenFingerprint.blocks);
 check('complete 3115 leaves 162 families 1728 blocks remain exact and six garden themes stay strictly non-emissive',fpExact&&report.gardenAssetsAfter.rows.every(q=>q.lit===0&&q.outside===0&&q.physicalLampCount===0&&q.partial===0&&q.edge===0),{recordsExact:fpExact,assets:report.gardenAssetsAfter.rows});
 // BEGIN MEASURED GARDEN COLD PHASE: passive reads, native save/reload,
 // native Continue, pause/AI-off, and exactly one ordinary day at a time only.
 report.gardenColdReloads=[];
 for(let cycle=1;cycle<=2;cycle++){
  const row={cycle,days:[]};report.gardenColdReloads.push(row);
  await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
  const raw=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')"),stored=JSON.parse(raw||'null');
  row.before=await state('garden-before-reload-'+cycle);
  row.save={bytes:Buffer.byteLength(raw||''),sha256:hash(raw||''),version:stored?.gameVer,schema:stored?.v,day:stored?.day,money:stored?.money};
  check('garden cold '+cycle+': native save contains old city and all six garden plus eight old paid themes',functionalGardenState016(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.33'&&stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&Object.keys(row.before.otherSlots).length===4,{before:row.before,save:row.save});
  const beforeDocuments=documentResponses.length;
  sourceObserver.mark('garden-cold-reload-'+cycle);
  await cdp.send('Page.reload',{ignoreCache:true});
  check('garden cold '+cycle+': actual official reload boots native menu',await menuReady());
  await documentProof('garden-cold-page-reload-'+cycle,beforeDocuments,'garden');
  const menu=await cdp.evalJs("({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',fixtureAbsent:!window.__complexQA014&&!window.__complexFns014&&!window.__streetscapeQA015&&!window.__streetscapeFns015&&!window.__gardenLifeQA016&&!window.__gardenLifeFns016&&!window.__theatreQA013&&!window.__theatrePublic013})");
  row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:hash(menu.raw||'')};
  check('garden cold '+cycle+': exact complete native save bytes survive T729 menu with all fixture memory absent',menu.raw===raw&&menu.slot==='3'&&menu.version==='14.33'&&menu.label==='v14.33 · T729'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
  await registerPassive();
  row.immediate=await cdp.evalJs("(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);return "+stateExpression('garden-immediate-'+cycle)+";})()");
  const same=(q)=>equal(q.cells,row.before.cells)&&equal(q.paths,row.before.paths)&&equal(q.water,row.before.water)&&equal(q.otherSlots,row.before.otherSlots)&&equal(q.streetscapeThemes.map(p=>p.at?.amx502),row.before.streetscapeThemes.map(p=>p.at?.amx502))&&equal(q.gardenThemes.map(p=>p.at?.amx502),row.before.gardenThemes.map(p=>p.at?.amx502));
  check('garden cold '+cycle+': immediate paused Continue preserves every old root ref age all fourteen directions themes water and other slots',!row.immediate.menuVisible&&row.immediate.version==='14.33'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&!row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&same(row.immediate),row.immediate);
  for(let frame=1;frame<=2;frame++){
   const q=await cdp.evalJs('new Promise(resolve=>requestAnimationFrame(()=>resolve('+stateExpression('garden-paused-'+cycle+'-'+frame)+')))');
   (row.pausedFrames||=[]).push(q);
   check('garden cold '+cycle+': paused frame '+frame+' retains saved day exact ownership and all fourteen directions',q.stats.day===stored.day&&same(q),q);
  }
  for(let day=1;day<=3;day++){
   const next=await cdp.evalJs('(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);return{before,state:'+stateExpression('garden-cold-'+cycle+'-day-'+day)+'};})()');
   row.days.push(next);
   next.ok=next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalGardenState016(next.state)&&equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&equal(ownedComplexIdentity014(next.state),ownedComplexIdentity014(row.before));
   check('garden cold '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day retains all fourteen themes and real native service',next.ok,next.state);
  }
  save();
 }
 // END MEASURED GARDEN COLD PHASE.
 check('both six-garden plus eight-streetscape cold Continue cycles pass their first and all three unaided days',report.gardenColdReloads.length===2&&report.gardenColdReloads.every(q=>q.days.length===3&&q.days.every(d=>d.ok===true&&functionalGardenState016(d.state))),report.gardenColdReloads.map(q=>({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
 report.gardenChecksPassed=true;
 await screenshot013('public-garden-cold-reload-verified.png',{kind:'actual official old-plus-fourteen-theme town after second garden cold Continue and three unaided ordinary days'});
}
module.exports={observeGarden016};
