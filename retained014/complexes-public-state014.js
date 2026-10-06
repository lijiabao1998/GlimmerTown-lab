'use strict';
// Official-origin browser reads only. No simulation/setter or repair is called.
function passivePublicState013(label, recipe) {
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
  districtCache:window.__t450Power||null,market:GV.riversideEvidence012(),theatre:GV.theatreEvidence013(),
  themes:recipe.pathPlacements.map(p=>({...p,at:GV.theatreAt013(p.x,p.y)})),
  street:GV.streetLifeEvidence009(),museum:GV.museumEvidence010(),
  stations:recipe.stations.map(p=>GV.stationDistrictAt008(...p)),
  retained:recipe.retained.map(r=>({...r,bld:GV.tile(r.x,r.y).bld,
   cells:Array.from({length:r.sz*r.sz},(_,n)=>GV.tile(r.x+n%r.sz,r.y+Math.floor(n/r.sz)).bld)})),
  oldMuseums:recipe.oldMuseums.map(r=>({...r,bld:GV.tile(r.x,r.y).bld})),
  cells,paths,water,shoreline,otherSlots}));
}
function theatreAccounting013(q){
 const r=q?.theatre?.roots?.[0];if(!r)return{exact:false,positive:false};
 const water=Math.max(0,Math.min(1,r.waterDelivered/r.waterDemand)),service=+(r.factors.availability*water).toFixed(4),fill=r.staff?.staffFill||0;
 const expected=r.operational&&r.employed>0?Math.max(0,Math.min(1,r.staff.capacityFactor,service*fill)):0;
 const expectedLeisure=200*expected*(1+Math.min(.35,(q.museum?.tourists||0)/2200));
 const exact=Number.isFinite(expected)&&Math.abs(r.capacityFactor-expected)<1e-7&&Math.abs(r.activity.leisure-expectedLeisure)<1e-7&&
  r.activity.enterpriseJobs===0&&r.activity.education===0&&r.activity.shopping===0&&r.activity.services===0&&r.activity.parking===0;
 return{water,fill,service,expected,expectedLeisure,exact,positive:exact&&r.operational&&r.employed>0&&r.activity.publicJobs>0&&r.activity.leisure>0&&r.coverageStamp?.field==='theater'&&r.coverageStamp.radius===7};
}
function ownedIdentity013(q){
 const roots=[...(q?.theatre?.roots||[]),...(q?.market?.roots||[]),...(q?.street?.roots||[]),...(q?.museum?.roots||[])];
 const ids=new Set(roots.map(r=>r.root));for(const r of q?.retained||[])ids.add(r.y*72+r.x);for(const r of q?.oldMuseums||[])ids.add(r.y*72+r.x);
 for(const r of q?.stations||[])if(Number.isInteger(r.root))ids.add(r.root);
 return(q?.cells||[]).filter(c=>ids.has(c.i)||c.ref&&ids.has(c.ref[1]*72+c.ref[0])).map(({age,...rest})=>rest);
}
function footprintExact013(q,r){
 if(!r||!Number.isInteger(r.root)||!Number.isInteger(r.sz)||r.sz<1)return false;
 const x=r.root%72,y=Math.floor(r.root/72),root=q.cells?.find(c=>c.i===r.root);
 if(!root||root.k!==r.k||root.ref!==null||root.sz!==r.sz)return false;
 const expected=[];for(let dy=0;dy<r.sz;dy++)for(let dx=0;dx<r.sz;dx++)if(dx||dy)expected.push((y+dy)*72+x+dx);
 const actual=q.cells.filter(c=>c.ref?.[0]===x&&c.ref[1]===y);
 return actual.length===expected.length&&expected.every(i=>actual.some(c=>c.i===i&&c.k===r.k&&c.ref?.[0]===x&&c.ref[1]===y));
}
function functionalPublicState013(q){
 const roots=q?.theatre?.roots||[],r=roots[0],market=q?.market?.roots||[],street=q?.street?.roots||[],museum=q?.museum?.roots||[];
 return !!q&&q.version==='14.31'&&q.slot==='3'&&q.difficulty===1&&!q.developer?.sandbox&&!q.developer?.god&&!q.menuVisible&&!q.coldFixDisabled&&
  Number.isFinite(q.stats?.money)&&q.stats.pop>0&&q.stats.poweredBld>0&&q.cells?.length===q.stats.buildings&&
  q.physical?.poweredRoads>0&&q.physical.sources>0&&q.districtCache?.districts>0&&
  roots.length===1&&r.k===281&&r.root===64*72+58&&r.sz===3&&r.id==='edwardianTheatre013'&&r.built&&r.age>=9&&r.operational&&
  r.power&&r.powerState===1&&r.powerAllocation?.root===r.root&&r.powerAllocation.pool>=0&&
  r.water&&r.waterState?.code>=2&&r.waterDelivered>0&&r.road?.length>0&&r.staff?.k===281&&r.staff.potentialJobs===16&&
  r.positions>0&&r.employed>0&&r.employed<=r.positions+.005&&r.positions<=16&&r.upkeep===10&&theatreAccounting013(q).positive&&
  q.theatre.day===q.stats.day&&footprintExact013(q,r)&&r.refCells?.length===8&&
  street.length===3&&[274,275,276].every(k=>street.some(r=>r.k===k&&r.operational&&r.power&&r.powerState===1&&r.employed>0&&footprintExact013(q,r)))&&
  museum.length===1&&museum[0].k===277&&museum[0].built&&museum[0].operational&&museum[0].powerState===1&&museum[0].waterDelivered>0&&museum[0].employed>0&&footprintExact013(q,museum[0])&&
  market.length===3&&[278,279,280].every(k=>market.some(r=>r.k===k&&r.built&&r.operational&&r.powerState===1&&r.waterDelivered>0&&r.employed>0&&r.activity.shopping>0&&footprintExact013(q,r)))&&
  q.retained?.length===47&&q.retained.every(r=>r.bld?.k===r.k&&(r.bld.sz||1)===r.sz&&r.cells?.length===r.sz*r.sz&&r.cells.every((b,n)=>n===0?b?.k===r.k:b?.k===r.k&&b?.ref?.[0]===r.x&&b.ref[1]===r.y))&&
  q.oldMuseums?.length===2&&q.oldMuseums.every(r=>r.bld?.k===r.k&&r.bld.sz===2)&&
  q.stations?.length===2&&q.stations.every(r=>r.k===139&&r.v===3&&r.age>=9&&Array.isArray(r.ownedRail)&&r.ownedRail.length===10&&r.ownedRail.every(v=>v===1))&&
  q.themes?.length===6&&['ticket','plaza','rail','bench','planter','lamp'].every(t=>q.themes.filter(p=>p.theme===t).length===1)&&
  q.themes.every(p=>p.at?.theme===p.theme&&p.at.am502===1&&p.at.baseWalkCost===.72&&p.at.amx502?.british013===p.theme&&p.at.amx502.turn013===0)&&
  q.water?.length===70&&q.water.every(p=>p.t===0)&&q.shoreline?.length===13&&q.shoreline.every(p=>p.land!==0&&p.water===0);
}
function summarizePublicResult013(report){
 const checks=report.checks||[],functional=checks.filter(q=>q.scope==='functional'),failed=functional.filter(q=>!q.ok);
 const cycles=report.coldReloads||[],twoCycles=cycles.length===2&&cycles.every((q,n)=>q.cycle===n+1&&q.days?.length===3&&q.days.every(d=>d.ok===true&&functionalPublicState013(d.state)));
 const passed=report.functionalChecksPassed===true&&functional.length===26&&failed.length===0&&twoCycles;
 const raw=report.rawBrowserErrors||[],runtime=report.rawRuntimeErrors||[],known=report.knownPWALogs||[],unknown=report.consoleErrors||[],network=report.networkFailures||[],warnings=report.warnings||[];
 const observed=Array.isArray(report.consoleErrors),rawConsoleClean=observed&&raw.length===0&&runtime.length===0&&unknown.length===0&&warnings.length===0;
 return{functionalSummary:{status:failed.length?'failed':passed?'passed':functional.length?'incomplete':'not_run',passed,expectedChecks:26,checksExecuted:functional.length,checksPassed:functional.filter(q=>q.ok).length,checksFailed:failed.length,failedChecks:failed.map(q=>q.name),constructionDaysObserved:report.ordinaryDays?.length||0,
  coldReloads:cycles.map(q=>({cycle:q.cycle,currentSaveSHA256:q.save?.sha256,currentSaveBytes:q.save?.bytes,savedNativeDay:q.save?.day,expectedOrdinaryDays:3,ordinaryDaysObserved:q.days?.length||0,ordinaryDaysPassed:(q.days||[]).filter(d=>d.ok===true&&functionalPublicState013(d.state)).length,firstOrdinaryDay:q.days?.length?(q.days[0].ok===true&&functionalPublicState013(q.days[0].state)?'passed':'failed'):'not_run',observedNativeDays:(q.days||[]).map(d=>d.state?.stats?.day)}))},
  browserDiagnosticSummary:{observed,rawBrowserErrorCount:raw.length,rawRuntimeErrorCount:runtime.length,knownPWA404ResponseCount:report.knownPWA404?.length||0,knownPWAErrorCount:known.length,unclassifiedRawBrowserErrorCount:Math.max(0,raw.length-known.length),unknownErrorCount:unknown.length,networkFailureCount:network.length,warningCount:warnings.length,rawConsoleClean,strictErrorGatePassed:rawConsoleClean&&network.length===0,unknownErrors:[...unknown],networkFailures:[...network],classificationPolicy:'Inherited exact PWA resource URL plus independently matching numeric HTTP 404 only. URL-less script errors remain unknown. Known logs and warnings remain raw and cannot satisfy the strict clean gate.'}};
}
module.exports={passivePublicState013,theatreAccounting013,ownedIdentity013,footprintExact013,functionalPublicState013,summarizePublicResult013};
