'use strict';
// This module defines the additional public-origin suite. It cannot start a
// browser on import. Its caller gates isolated Actions and exact deployment.
const path=require('node:path'),{isDeepStrictEqual:equal}=require('node:util');
const {hash,complexFixtureSource014}=require('./quayside-public-contract017');
const {passiveStreetscapeState015,functionalStreetscapeState015,verifyStreetscapeCatalog015}=require('./quayside-public-streetscape017');
const {ownedComplexIdentity014}=require('./quayside-public-extra017');
async function observeStreetscape015(ctx){
 const {ROOT,cdp,report,check:parentCheck,documentResponses,documentProof,menuReady,screenshot013,registerComplexPassive,recipe,save,sourceObserver}=ctx;
 const check=(name,ok,detail)=>parentCheck(name,ok,detail,'streetscape');
 const {seedApprovedBritishLegacy007}=require(path.join(ROOT,'publiclife-legacy-fixture007.js'));
 const {functions015}=require(path.join(ROOT,'streetscape-gameplay015.js'));
 const api=await cdp.evalJs('({specs:GV.streetscapeSpecs015(),selftest:GV.streetscapeSelftest015(),functions:["streetscapeSpecs015","streetscapeAt015","streetscapeEvidence015","streetscapeSelftest015"].map(k=>({key:k,type:typeof GV[k]}))})');
 check('all eight independently paid native themes exactly match approved source catalog',verifyStreetscapeCatalog015(api.specs)&&api.selftest.ok&&api.functions.every(q=>q.type==='function'),api);
 report.streetscapeLock=await cdp.evalJs("(()=>{GV.newWorld();GV.setSpeed(0);GV.ai(false);GV.setDiff(1);return{rank:GV.rank(),paths:GV.streetscapeSpecs015().paths.map(p=>({id:p.id,preview:GV.placePreview459(p.id,10,10)}))};})()");
 check('all eight official tools enforce native city-level-four lock',report.streetscapeLock.rank.lv===1&&report.streetscapeLock.paths.length===8&&report.streetscapeLock.paths.every(q=>!q.preview.ok&&q.preview.reason==='城市 Lv.4 解鎖'),report.streetscapeLock);
 await cdp.evalJs('window.__complexFns014=(()=>{'+complexFixtureSource014(ROOT)+';return{bindObservation014,setupComplexes014,identity014,snapshot014,step014,nativeScene014};})();window.__streetscapeFns015=(()=>{'+functions015.map(f=>f.toString()).join('\n')+';return{'+functions015.map(f=>f.name).join(',')+'};})();true');
 const call=(name,...args)=>cdp.evalJs('window.__streetscapeFns015.'+name+'('+args.map(x=>JSON.stringify(x)).join(',')+')');
 const fixture=await cdp.evalJs('window.__complexFns014.setupComplexes014(('+seedApprovedBritishLegacy007.toString()+'),"college")');
 report.streetscapeFixture=fixture;const complexRecipe=fixture.recipe;
 report.streetscapePlacement=await call('setupStreetscape015');
 const placement=report.streetscapePlacement,streetRecipe={paths:placement.paths,payments:placement.payments,placementDay:placement.placementDay};
 check('all eight actual paid T502 themes preserve old native roots and prior themed paths',fixture.oldIdentitiesExact&&placement.paths.length===8&&placement.payments.every(q=>q.exact&&q.charged===12&&q.quote.cost===q.plain.cost)&&placement.oldBuildingIdentityExact&&placement.priorThemesExact,placement);
 report.streetscapeOrdinaryDays=[];
 for(let n=1;n<=9;n++)report.streetscapeOrdinaryDays.push(await cdp.evalJs('window.__complexFns014.step014(1)'));
 check('all retained ensemble roots beside new paths require nine real construction days',report.streetscapeOrdinaryDays.length===9&&report.streetscapeOrdinaryDays.every((q,n)=>q.day===placement.placementDay+n+1&&q.roots.length===12&&q.roots.every(r=>r.age===n+1))&&report.streetscapeOrdinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational))&&report.streetscapeOrdinaryDays[8].roots.every(r=>r.built),report.streetscapeOrdinaryDays);
 const registerPassive=async()=>{await registerComplexPassive();await cdp.evalJs('window.__streetscapePublicState015='+passiveStreetscapeState015.toString());};
 const stateExpression=label=>'window.__streetscapePublicState015('+[label,complexRecipe,recipe,streetRecipe].map(x=>JSON.stringify(x)).join(',')+')';
 const state=label=>cdp.evalJs(stateExpression(label));
 await registerPassive();let ready=await state('streetscape-day-nine');report.streetscapeOperationalDays=[ready];
 for(let n=9;n<28&&!functionalStreetscapeState015(ready);n++){await cdp.evalJs('window.__complexFns014.step014(1)');ready=await state('streetscape-operational-day-'+(n+1));report.streetscapeOperationalDays.push(ready);}
 check('old native city and all eight new paths achieve actual utility staff housing fire and physical-road lamp service',functionalStreetscapeState015(ready),ready);
 report.streetscapeTransactions=await call('streetscapeTransactions015');const tx=report.streetscapeTransactions;
 check('each paid path survives exact native demolition undo redo and restoration',tx.rows.length===8&&tx.rows.every(r=>r.removed&&r.gone&&r.charged===r.quote.cost&&r.undo&&r.restored&&r.redo&&r.regone&&r.redoPaid&&r.undoAgain&&r.final)&&tx.drawWorldExact&&tx.drawStorageExact&&tx.canonical,tx);
 report.streetscapeEdits=await call('streetscapeEdits015');const edits=report.streetscapeEdits;
 check('all eight genuine paid theme edits persist through native save load and ordinary day',edits.rows.length===8&&edits.rows.every(q=>q.exact&&q.nextDay===q.day+1&&q.storedBytes>1000)&&edits.disabledLoad&&edits.otherSlotsExact&&edits.followingDay===edits.fromDay+1&&edits.followingLighting.every(q=>q.ready),edits);
 report.streetscapeConstraints=await call('streetscapeConstraints015');const constraints=report.streetscapeConstraints;
 check('occupied native themes reject conflicts without tile or money mutation',constraints.disabled&&constraints.rows.length>=48&&constraints.rows.every(q=>q.blocked&&q.tileExact&&q.moneyExact),constraints);
 report.streetscapeScenes=[];
 for(const group of ['college','manor'])for(const night of[false,true]){
  const scene=await call('streetscapeScene015',0,night,group,2);delete scene.png;report.streetscapeScenes.push(scene);
  await screenshot013('public-streetscape-'+group+'-'+(night?'night':'day')+'.png',{kind:'actual official paid streetscape details beside complete supplied ensembles',group,night,day:scene.day,paths:scene.paths});
 }
 check('four actual official day and night scenes contain all eight original canonical details',report.streetscapeScenes.length===4&&report.streetscapeScenes.every(s=>(s.group==='college'?s.paths.slice(0,4):s.paths.slice(4)).every(p=>p.within&&p.canonical)),report.streetscapeScenes);
 await call('streetscapeScene015',0,true,'college',2);report.streetscapeLights=[];
 for(const theme of ['heritageLantern','basketLamp'])report.streetscapeLights.push(await call('streetscapeLight015',theme));
 check('both physical lamp masks use actual supplied adjacent road with unchanged world and storage',report.streetscapeLights.every(q=>q.light.ready&&q.light.service>.03&&q.light.source&&q.candidates>0&&q.blocked+q.visible>0&&q.worldExact&&q.storageExact&&q.physicalMaskOnly),report.streetscapeLights);
 // BEGIN MEASURED STREETSCAPE COLD PHASE: passive reads, native save/reload,
 // native Continue, pause/AI-off, and exactly one ordinary day at a time only.
 report.streetscapeColdReloads=[];
 for(let cycle=1;cycle<=2;cycle++){
  const row={cycle,days:[]};report.streetscapeColdReloads.push(row);
  await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
  const raw=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')"),stored=JSON.parse(raw||'null');
  row.before=await state('streetscape-before-reload-'+cycle);
  row.save={bytes:Buffer.byteLength(raw||''),sha256:hash(raw||''),version:stored?.gameVer,schema:stored?.v,day:stored?.day,money:stored?.money};
  check('streetscape cold '+cycle+': current native save contains old city and all eight paid themes',functionalStreetscapeState015(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.34'&&stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&Object.keys(row.before.otherSlots).length===4,{before:row.before,save:row.save});
  const beforeDocuments=documentResponses.length;
  sourceObserver.mark('streetscape-cold-reload-'+cycle);
  await cdp.send('Page.reload',{ignoreCache:true});
  check('streetscape cold '+cycle+': actual official reload boots native menu',await menuReady());
  await documentProof('streetscape-cold-page-reload-'+cycle,beforeDocuments,'streetscape');
  const menu=await cdp.evalJs("({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',fixtureAbsent:!window.__complexQA014&&!window.__complexFns014&&!window.__streetscapeQA015&&!window.__streetscapeFns015&&!window.__theatreQA013&&!window.__theatrePublic013})");
  row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:hash(menu.raw||'')};
  check('streetscape cold '+cycle+': exact complete save bytes and T730 menu survive with fixture memory absent',menu.raw===raw&&menu.slot==='3'&&menu.version==='14.34'&&menu.label==='v14.34 · T730'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
  await registerPassive();
  row.immediate=await cdp.evalJs("(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);return "+stateExpression('streetscape-immediate-'+cycle)+";})()");
  const same=(q)=>equal(q.cells,row.before.cells)&&equal(q.paths,row.before.paths)&&equal(q.water,row.before.water)&&equal(q.otherSlots,row.before.otherSlots)&&equal(q.streetscapeThemes.map(p=>p.at?.amx502),row.before.streetscapeThemes.map(p=>p.at?.amx502));
  check('streetscape cold '+cycle+': paused Continue preserves all roots refs ages directions themes water and other slots',!row.immediate.menuVisible&&row.immediate.version==='14.34'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&!row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&same(row.immediate),row.immediate);
  for(let frame=1;frame<=2;frame++){
   const q=await cdp.evalJs('new Promise(resolve=>requestAnimationFrame(()=>resolve('+stateExpression('streetscape-paused-'+cycle+'-'+frame)+')))');
   (row.pausedFrames||=[]).push(q);
   check('streetscape cold '+cycle+': paused frame '+frame+' retains saved day exact ownership and other slots',q.stats.day===stored.day&&same(q),q);
  }
  for(let day=1;day<=3;day++){
   const next=await cdp.evalJs('(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);return{before,state:'+stateExpression('streetscape-cold-'+cycle+'-day-'+day)+'};})()');
   row.days.push(next);
   next.ok=next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalStreetscapeState015(next.state)&&equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&equal(ownedComplexIdentity014(next.state),ownedComplexIdentity014(row.before));
   check('streetscape cold '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day retains every theme and real native service',next.ok,next.state);
  }
  save();
 }
 // END MEASURED STREETSCAPE COLD PHASE.
 check('both eight-theme cold Continue cycles pass their first and all three unaided days',report.streetscapeColdReloads.length===2&&report.streetscapeColdReloads.every(q=>q.days.length===3&&q.days.every(d=>d.ok===true&&functionalStreetscapeState015(d.state))),report.streetscapeColdReloads.map(q=>({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
 report.streetscapeChecksPassed=true;
 await screenshot013('public-streetscape-cold-reload-verified.png',{kind:'actual official old-plus-new town after second cold Continue and three unaided ordinary days'});
}
module.exports={observeStreetscape015};
