'use strict';
const {isDeepStrictEqual:equal}=require('node:util');
const {pins016}=require('./gardenlife-public-contract016');
const {functionalStreetscapeState015}=require('./gardenlife-public-streetscape016');
// Passive native reads only. This body never binds a fixture or repairs service.
function passiveGardenState016(label,complexRecipe,theatreRecipe,streetRecipe,gardenRecipe){
 const old=window.__streetscapePublicState015(label,complexRecipe,theatreRecipe,streetRecipe);
 const themes=gardenRecipe.paths.map(p=>({...p,at:GV.gardenLifeAt016(p.x,p.y)}));
 return JSON.parse(JSON.stringify({...old,garden:GV.gardenLifeEvidence016(),gardenThemes:themes,gardenDisabled:!!window.__noGardenLife016,gardenArtDisabled:!!window.__noGardenLifeArt016}));
}
function functionalGardenState016(q){
 if(!functionalStreetscapeState015(q)||q.gardenDisabled||q.gardenArtDisabled||q.garden?.day!==q.stats.day||q.garden?.art?.total!==24||q.garden.art.builds!==1)return false;
 const rows=q.gardenThemes||[],actual=q.garden.paths||[],specs=pins016.gardenCatalog.paths;
 if(rows.length!==6||actual.length!==6||new Set(rows.map(r=>r.theme)).size!==6||new Set(actual.map(r=>r.theme)).size!==6)return false;
 return specs.every(s=>{const p=rows.find(r=>r.theme===s.theme),a=p?.at;
  return !!a&&p.id===s.id&&p.cost===12&&p.lit===false&&a.root===p.y*72+p.x&&a.x===p.x&&a.y===p.y&&a.theme===s.theme&&a.am502===1&&a.baseWalkCost===.72&&a.cost===12&&a.amx502?.british016===s.theme&&a.amx502.turn016===p.turn&&Number.isInteger(p.turn)&&p.turn>=0&&p.turn<4&&equal(actual.find(r=>r.theme===s.theme),a);
 });
}
function verifyGardenCatalog016(specs){return equal(specs,pins016.gardenCatalog);}
function summarizeGarden016(report){
 const checks=(report.checks||[]).filter(q=>q.scope==='garden'),cycles=report.gardenColdReloads||[],expectedChecks=32;
 const passed=report.gardenChecksPassed===true&&checks.length===expectedChecks&&checks.every(q=>q.ok)&&cycles.length===2&&cycles.every((q,n)=>q.cycle===n+1&&q.days?.length===3&&q.days.every(d=>d.ok===true&&functionalGardenState016(d.state)));
 return{passed,expectedChecks,checksExecuted:checks.length,checksPassed:checks.filter(q=>q.ok).length,failedChecks:checks.filter(q=>!q.ok).map(q=>q.name),constructionDaysObserved:report.gardenOrdinaryDays?.length||0,coldReloads:cycles.map(q=>({cycle:q.cycle,save:q.save,daysObserved:q.days?.length||0,firstOrdinaryDay:q.days?.[0]?.ok===true?'passed':'not_passed'}))};
}
module.exports={passiveGardenState016,functionalGardenState016,verifyGardenCatalog016,summarizeGarden016};
