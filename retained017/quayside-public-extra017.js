'use strict';
// Pure passive readers and data predicates; no browser or game starts on import.
const {functionalPublicState013,footprintExact013,ownedIdentity013}=require('./quayside-public-state017');
const {sourcePins}=require('./quayside-public-contract017');
function passiveComplexState014(label,recipe,theatreRecipe){
 const old=window.__theatrePublicState013(label,theatreRecipe);
 return {...old,complex:GV.complexEvidence014(),complexThemes:recipe.pathPlacements.map(p=>({...p,at:GV.complexAt014(p.x,p.y)})),complexDisabled:!!window.__noComplex014,complexArtDisabled:!!window.__noComplexArt014};
}
function complexAccounting014(q){
 const roots=q?.complex?.roots||[],tourists=q?.museum?.tourists||0;
 const rows=sourcePins.complexCatalog.buildings.map(s=>{
  const r=roots.find(r=>r.k===s.k);if(!r)return{k:s.k,exact:false,positive:false};
  const housing=s.role==='housing',fill=r.staff?.staffFill||0;
  const factor=!housing&&r.operational&&r.employed>0?Math.max(0,Math.min(1.14,r.staff.capacityFactor,r.factors.serviceFactor*Math.max(0,Math.min(1,fill)))):0;
  const leisure=s.leisure*factor*(1+Math.min(.35,tourists/2200)),education=s.seats*factor,services=s.services*factor;
  const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-6;
  const exact=near(r.capacityFactor,factor)&&near(r.activity?.leisure,leisure)&&near(r.activity?.education,education)&&near(r.activity?.services,services)&&r.activity.enterpriseJobs===0&&r.activity.shopping===0&&r.activity.parking===0&&
   (!housing||r.positions===0&&r.employed===0&&r.housing?.capacity===s.capacity&&r.housing.population===(r.housing.eligible?Math.round(s.capacity*r.housing.occupancy):0));
  const staffing=housing?r.housing?.eligible&&r.housing.population>0:r.staff?.k===s.k&&r.staff.potentialJobs===s.jobs&&r.positions>0&&r.positions<=s.jobs+.005&&r.employed>0&&r.employed<=r.positions+.005&&r.activity.publicJobs>0&&factor>0;
  const covered=!s.coverage||r.coverageStamp?.field===s.coverage&&r.coverageStamp.radius>0;
  const positive=exact&&staffing&&covered&&r.operational&&(s.role!=='fire'||r.emergencyReady&&r.emergency?.sourceRegistered&&r.emergency?.fieldOnline);
  return{k:s.k,role:s.role,exact,positive,factor,leisure,education,services};
 });
 return{rows,exact:rows.length===12&&rows.every(r=>r.exact),positive:rows.length===12&&rows.every(r=>r.positive)};
}
function functionalComplexState014(q){
 const roots=q?.complex?.roots||[],specs=sourcePins.complexCatalog;
 if(!functionalPublicState013(q)||q.complexDisabled||q.complexArtDisabled||roots.length!==12||new Set(roots.map(r=>r.k)).size!==12||q.complex.day!==q.stats.day||!complexAccounting014(q).positive)return false;
 if(!specs.buildings.every(s=>{const r=roots.find(r=>r.k===s.k);return r&&r.id===s.id&&r.group===s.group&&r.role===s.role&&r.sz===s.sz&&r.built&&r.age>=9&&r.operational&&r.power&&r.powerState===1&&r.powerAllocation?.root===r.root&&r.water&&r.waterState?.code>=2&&r.waterDelivered>0&&r.road?.length>0&&r.upkeep===s.upkeep&&footprintExact013(q,r)&&r.refCells?.length===s.sz*s.sz-1;}))return false;
 const themes=q.complexThemes||[];
 if(themes.length!==16||new Set(themes.map(p=>p.theme)).size!==16||q.complex.paths.length!==16||!specs.paths.every(s=>themes.filter(p=>p.theme===s.theme).length===1))return false;
 if(!themes.every(p=>p.at?.theme===p.theme&&p.at.group===p.group&&p.at.am502===1&&p.at.baseWalkCost===.72&&p.at.cost===12&&p.at.amx502?.british014===p.theme&&p.at.amx502.turn014===0))return false;
 return q.complex.daily?.syntheticRevenue===0&&q.complex.daily.publicJobs===specs.buildings.reduce((n,s)=>n+s.jobs,0)&&q.complex.daily.upkeep===roots.reduce((n,r)=>n+r.upkeep,0);
}
function ownedComplexIdentity014(q){
 const old=ownedIdentity013(q),ids=new Set((q.complex?.roots||[]).map(r=>r.root));
 return [...old,...q.cells.filter(c=>ids.has(c.i)||c.ref&&ids.has(c.ref[1]*72+c.ref[0])).map(({age,...rest})=>rest)].sort((a,b)=>a.i-b.i);
}
function summarizeComplexResult014(report){
 const checks=report.checks.filter(q=>q.scope==='complexes'),cycles=report.complexColdReloads||[];
 const passed=report.complexChecksPassed===true&&checks.length===26&&checks.every(q=>q.ok)&&cycles.length===2&&cycles.every((q,n)=>q.cycle===n+1&&q.days?.length===3&&q.days.every(d=>d.ok===true&&functionalComplexState014(d.state)));
 return{passed,expectedChecks:26,checksExecuted:checks.length,checksPassed:checks.filter(q=>q.ok).length,failedChecks:checks.filter(q=>!q.ok).map(q=>q.name),constructionDaysObserved:report.complexOrdinaryDays?.length||0,coldReloads:cycles.map(q=>({cycle:q.cycle,save:q.save,daysObserved:q.days?.length||0,firstOrdinaryDay:q.days?.[0]?.ok===true?'passed':'not_passed'}))};
}
module.exports={passiveComplexState014,complexAccounting014,functionalComplexState014,ownedComplexIdentity014,summarizeComplexResult014};
