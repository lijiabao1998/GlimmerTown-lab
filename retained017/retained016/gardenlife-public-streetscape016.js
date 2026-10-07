'use strict';
const {isDeepStrictEqual:equal}=require('node:util');
const {pins015}=require('./gardenlife-public-contract016');
const {functionalComplexState014}=require('./gardenlife-public-extra016');
// Serializable passive reader. Only read-only native APIs; no fixture binding,
// draw, repair, load, dispatch, mutable object reference or cached supply result.
function passiveStreetscapeState015(label,complexRecipe,theatreRecipe,streetRecipe){
 const old=window.__complexPublicState014(label,complexRecipe,theatreRecipe);
 const themes=streetRecipe.paths.map(p=>{const at=GV.streetscapeAt015(p.x,p.y),source=at?.lighting?.source;return {...p,at,roadSource:source?GV.tile(source.x,source.y):null};});
 return JSON.parse(JSON.stringify({...old,streetscape:GV.streetscapeEvidence015(),streetscapeThemes:themes,streetscapeDisabled:!!window.__noStreetscape015,streetscapeArtDisabled:!!window.__noStreetscapeArt015}));
}
function functionalStreetscapeState015(q){
 if(!functionalComplexState014(q)||q.streetscapeDisabled||q.streetscapeArtDisabled||q.streetscape?.day!==q.stats.day||q.streetscape?.art?.total!==32||q.streetscape.art.builds!==1)return false;
 const rows=q.streetscapeThemes||[],actual=q.streetscape.paths||[],specs=pins015.streetscapeCatalog.paths;
 if(rows.length!==8||actual.length!==8||new Set(rows.map(r=>r.theme)).size!==8||new Set(actual.map(r=>r.theme)).size!==8)return false;
 return specs.every(s=>{
  const p=rows.find(r=>r.theme===s.theme),a=p?.at;
  if(!a||p.id!==s.id||p.cost!==12||a.root!==p.y*72+p.x||a.x!==p.x||a.y!==p.y||a.theme!==s.theme||a.am502!==1||a.baseWalkCost!==.72||a.cost!==12||a.amx502?.british015!==s.theme||a.amx502.turn015!==p.turn||!Number.isInteger(p.turn)||p.turn<0||p.turn>3||!equal(actual.find(r=>r.theme===s.theme),a))return false;
  if(s.lit){const l=a.lighting;return l?.ready===true&&l.service>.03&&!!l.source&&Math.abs(l.source.x-p.x)+Math.abs(l.source.y-p.y)===1&&!!p.roadSource?.road;}
  return true;
 });
}
function verifyStreetscapeCatalog015(specs){return equal(specs,pins015.streetscapeCatalog);}
function summarizeStreetscapeResult015(report){
 const checks=(report.checks||[]).filter(q=>q.scope==='streetscape'),cycles=report.streetscapeColdReloads||[];
 const expectedChecks=31,passed=report.streetscapeChecksPassed===true&&checks.length===expectedChecks&&checks.every(q=>q.ok)&&cycles.length===2&&cycles.every((q,n)=>q.cycle===n+1&&q.days?.length===3&&q.days.every(d=>d.ok===true&&functionalStreetscapeState015(d.state)));
 return{passed,expectedChecks,checksExecuted:checks.length,checksPassed:checks.filter(q=>q.ok).length,failedChecks:checks.filter(q=>!q.ok).map(q=>q.name),constructionDaysObserved:report.streetscapeOrdinaryDays?.length||0,coldReloads:cycles.map(q=>({cycle:q.cycle,save:q.save,daysObserved:q.days?.length||0,firstOrdinaryDay:q.days?.[0]?.ok===true?'passed':'not_passed'}))};
}
module.exports={passiveStreetscapeState015,functionalStreetscapeState015,verifyStreetscapeCatalog015,summarizeStreetscapeResult015};
