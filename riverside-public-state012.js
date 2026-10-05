'use strict';
// Serialized into the isolated official-origin CI browser. Passive reads only.
// No repair, ensure, topology, dispatch, financial or workforce setter is used.
function passivePublicState012(label, recipe) {
 const cells=[],paths=[],water=[],shoreline=[];
 let roads=0,poweredRoads=0,sources=0,poweredSources=0;
 for(let y=0;y<recipe.N;y++)for(let x=0;x<recipe.N;x++){
  const t=GV.tile(x,y),b=t?.bld,i=y*recipe.N+x;
  if(t?.road){roads++;if(t.rp)poweredRoads++;}
  if(b)cells.push({i,k:b.k,ref:b.ref??null,sz:b.sz??1,lv:b.lv??null,v:b.v??null,age:b.age??null});
  if(b&&!b.ref&&b.k===5){sources++;if(b.pw)poweredSources++;}
  if(t?.am502)paths.push({i,am502:t.am502,amx502:t.amx502??null});
 }
 for(const p of recipe.waterCells)water.push({x:p.x,y:p.y,t:GV.tile(p.x,p.y).t});
 for(const p of recipe.shoreline)shoreline.push({...p,land:GV.tile(p.x,p.y).t,water:GV.tile(p.x,p.y+1).t});
 const otherSlots=Object.fromEntries(Object.keys(localStorage).sort()
  .filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k)).map(k=>[k,localStorage.getItem(k)]));
 return JSON.parse(JSON.stringify({label,version:GV.ver(),slot:localStorage.getItem('glimmerville.v1.slot'),
  difficulty:GV.diff(),developer:GV.dev516B(),stats:GV.stats(),
  menuVisible:getComputedStyle(document.getElementById('start')).display!=='none',
  coldFixDisabled:!!window.__noColdLoadPower011,physical:{roads,poweredRoads,sources,poweredSources},
  districtCache:window.__t450Power||null,market:GV.riversideEvidence012(),
  themes:recipe.pathPlacements.map(p=>({...p,at:GV.riversideAt012(p.x,p.y)})),
  street:GV.streetLifeEvidence009(),museum:GV.museumEvidence010(),
  stations:recipe.stations.map(p=>GV.stationDistrictAt008(...p)),
  retained:recipe.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,
   cells:Array.from({length:r.sz*r.sz},(_,n)=>GV.tile(r.x+n%r.sz,r.y+Math.floor(n/r.sz)).bld)})),
  oldMuseums:recipe.oldMuseums.map(r=>({...r,bld:GV.tile(r.x,r.y).bld})),
  cells,paths,water,shoreline,otherSlots}));
}
function retailAccounting012(market) {
 const roots=market?.roots||[],ledger=market?.taxLedger,rows=ledger?.rows||[];
 const expectedUnits=roots.reduce((s,r)=>s+(r.operational?r.employed/14:0),0);
 const formulaExact=roots.length===3&&roots.every(r=>Number.isFinite(r.employed)&&
  Math.abs(r.retailUnits-(r.operational?r.employed/14:0))<1e-9&&
  Math.abs(r.activity?.shopping-(r.operational?r.employed*2.15:0))<1e-9&&
  r.activity.work>0&&r.activity.work===r.activity.enterpriseJobs&&r.activity.publicJobs===0&&
  r.activity.education===0&&r.activity.services===0&&r.activity.leisure===0&&r.activity.parking===0);
 const ledgerExact=!!ledger?.current&&ledger.day===market.day&&
  Number.isFinite(ledger.total)&&Math.abs(ledger.total-rows.reduce((s,r)=>s+r.tax,0))<1e-9&&
  rows.length===3&&new Set(rows.map(r=>r.root)).size===3&&
  rows.every(row=>roots.some(r=>r.root===row.root&&r.k===row.k&&r.tax?.tax===row.tax));
 return {formulaExact,ledgerExact,expectedUnits,exact:formulaExact&&ledgerExact&&
  Math.abs(market.retailUnits-expectedUnits)<1e-9,
  positive:formulaExact&&ledgerExact&&ledger.total>0&&roots.every(r=>r.operational&&r.employed>0&&r.activity.shopping>0&&r.tax?.tax>0)};
}
function marketIdentity012(q) {
 return (q?.market?.roots||[]).map(r=>({root:r.root,k:r.k,id:r.id,v:r.v,sz:r.sz,
  refs:(r.refCells||[]).map(p=>({i:p.i,k:p.bld?.k,ref:p.bld?.ref??null,
   sz:p.bld?.sz??1,lv:p.bld?.lv??null,v:p.bld?.v??null}))})).sort((a,b)=>a.root-b.root);
}
function functionalPublicState012(q) {
 const roots=q?.market?.roots||[],street=q?.street?.roots||[],museum=q?.museum?.roots||[];
 const retail=retailAccounting012(q?.market);
 return !!q&&q.version==='14.29'&&q.slot==='3'&&q.difficulty===1&&
  !q.developer?.sandbox&&!q.developer?.god&&!q.menuVisible&&!q.coldFixDisabled&&
  Number.isFinite(q.stats?.money)&&q.stats.pop>0&&q.stats.poweredBld>0&&
  q.physical?.poweredRoads>0&&q.physical.sources>0&&q.districtCache?.districts>0&&
  roots.length===3&&[278,279,280].every(k=>roots.some(r=>r.k===k&&r.built&&r.age>=9&&r.operational&&
   r.power&&r.powerState===1&&r.powerAllocation?.root===r.root&&r.powerAllocation.pool>=0&&
   r.water&&r.waterState?.code>=2&&r.waterDelivered>0&&r.road?.length>0&&
   r.positions>0&&r.employed>0&&r.employed<=r.positions&&r.positions<=({278:18,279:3,280:4})[k]&&
   r.enterprise?.activePositions===r.positions&&r.enterprise.employed===r.employed&&r.enterprise.potentialJobs===({278:18,279:3,280:4})[k]))&&
  retail.exact&&retail.positive&&q.market.day===q.stats.day&&
  street.length===3&&[274,275,276].every(k=>street.some(r=>r.k===k&&r.operational&&r.power&&r.powerState===1&&r.employed>0))&&
  museum.length===1&&museum[0].k===277&&museum[0].built&&museum[0].operational&&museum[0].powerState===1&&
  museum[0].waterDelivered>0&&museum[0].employed>0&&museum[0].tourism?.currentBase>0&&
  q.retained?.length===47&&q.retained.every(r=>r.bld?.k===r.k&&(r.bld.sz||1)===r.sz&&
   r.cells?.length===r.sz*r.sz&&r.cells.every((b,n)=>n===0?b?.k===r.k:b?.ref?.[0]===r.x&&b.ref[1]===r.y))&&
  q.oldMuseums?.length===2&&q.oldMuseums.every(r=>r.bld?.k===r.k&&r.bld.sz===2)&&
  q.stations?.length===2&&q.stations.every(r=>r.k===139&&r.v===3&&r.age>=9&&Array.isArray(r.ownedRail)&&r.ownedRail.length===10&&r.ownedRail.every(v=>v===1))&&
  q.themes?.length===36&&['quay','rail','promenade'].every(t=>q.themes.some(p=>p.theme===t))&&
  q.themes.every(p=>p.at?.theme===p.theme&&p.at.am502===1&&p.at.baseWalkCost===.72&&p.at.amx502?.british012===p.theme)&&
  q.water?.length===70&&q.water.every(p=>p.t===0)&&q.shoreline?.length===13&&q.shoreline.every(p=>p.land!==0&&p.water===0);
}
// Reporting only: separates completed functional evidence from strict raw-log
// diagnostics. It cannot alter a check, reclassify an error or make a run pass.
function summarizePublicResult012(report) {
 const checks=report.checks||[],functional=checks.filter(q=>q.scope==='functional');
 const status=q=>!q?'not_run':q.ok?'passed':'failed';
 const named=prefix=>status(checks.find(q=>q.name.startsWith(prefix)));
 const failed=functional.filter(q=>!q.ok),passed=report.functionalChecksPassed===true&&functional.length>0&&failed.length===0;
 const raw=report.rawBrowserErrors||[],known=report.knownPWALogs||[],unknown=report.consoleErrors||[],network=report.networkFailures||[];
 return {
  functionalSummary:{status:failed.length?'failed':passed?'passed':functional.length?'incomplete':'not_run',
   passed,checksExecuted:functional.length,checksPassed:functional.filter(q=>q.ok).length,
   checksFailed:failed.length,failedChecks:failed.map(q=>q.name),
   milestones:{paidAgeZeroMarket:named('public-origin normal city actually buys age-zero'),
    nineOrdinaryConstructionDays:named('nine real ordinary construction days'),
    physicalServiceNativeLaborShoppingTax:named('actual public market has native road'),
    threeThemedPaths:named('all 36 native themed paths'),nativeDayNightViews:named('native official day and night views'),
    twoColdReloadCycles:named('both independent public cold reloads passed')},
   constructionDaysObserved:(report.ordinaryDays||[]).length,
   coldReloads:(report.coldReloads||[]).map(row=>{
    const dayChecks=functional.filter(q=>q.name.startsWith('cold reload '+row.cycle+': ')&&q.name.includes(' unaided ordinary day '));
    return {cycle:row.cycle,currentSaveSHA256:row.save?.sha256||null,currentSaveBytes:row.save?.bytes||null,
     savedNativeDay:row.save?.day??null,expectedOrdinaryDays:3,
     ordinaryDaysObserved:(row.days||[]).length,ordinaryDaysPassed:dayChecks.filter(q=>q.ok).length,
     firstOrdinaryDay:status(dayChecks.find(q=>q.name.includes(': FIRST '))),
     observedNativeDays:(row.days||[]).map(q=>q.state?.stats?.day??null)};
   })},
  browserDiagnosticSummary:{observed:Array.isArray(report.consoleErrors),rawBrowserErrorCount:raw.length,
   knownPWA404ResponseCount:(report.knownPWA404||[]).length,knownPWAErrorCount:known.length,
   unclassifiedRawBrowserErrorCount:Math.max(0,raw.length-known.length),unknownErrorCount:unknown.length,
   networkFailureCount:network.length,warningCount:(report.warnings||[]).length,
   rawConsoleClean:Array.isArray(report.consoleErrors)&&raw.length===0&&unknown.length===0,
   strictErrorGatePassed:Array.isArray(report.consoleErrors)&&unknown.length===0&&network.length===0,
   unknownErrors:[...unknown],networkFailures:[...network],
   classificationPolicy:'Exact PWA resource URL plus independently matching numeric HTTP 404 only; generic or URL-less errors remain unknown even when a separate warning names sw.js.'}
 };
}
module.exports={passivePublicState012,retailAccounting012,marketIdentity012,functionalPublicState012,summarizePublicResult012};
