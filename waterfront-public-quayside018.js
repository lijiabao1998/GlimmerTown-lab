'use strict';
const {isDeepStrictEqual:equal}=require('node:util');
const {pins015,pins016,pins017}=require('./waterfront-public-contract018');
const {functionalGardenState016}=require('./waterfront-public-garden018');
// Only passive native coordinate reads. Aggregate evidence is recorded, never repaired.
function passiveQuaysideState017(label,complexRecipe,theatreRecipe,streetRecipe,gardenRecipe,quaysideRecipe){
 const old=window.__gardenPublicState016(label,complexRecipe,theatreRecipe,streetRecipe,gardenRecipe);
 const themes=quaysideRecipe.paths.map(p=>({...p,at:GV.quaysideAt017(p.x,p.y)}));
 return JSON.parse(JSON.stringify({...old,quayside:GV.quaysideEvidence017(),quaysideThemes:themes,quaysideDisabled:!!window.__noQuayside017,quaysideArtDisabled:!!window.__noQuaysideArt017}));
}
const families017=[
 {key:'streetscapeThemes',name:'streetscape015',specs:pins015.streetscapeCatalog.paths,themeKey:'british015',turnKey:'turn015',positions:[[9,68],[11,69],[7,68],[8,68],[18,68],[19,68],[20,68],[21,68]]},
 {key:'gardenThemes',name:'gardenLife016',specs:pins016.gardenCatalog.paths,themeKey:'british016',turnKey:'turn016',positions:[[30,68],[31,68],[32,68],[42,68],[43,68],[44,68]]},
 {key:'quaysideThemes',name:'quayside017',specs:pins017.quaysideCatalog.paths,themeKey:'british017',turnKey:'turn017',positions:[[27,68],[28,68],[29,68],[39,68],[40,68],[41,68]]}
];
function directIdentity017(q,priorOnly=false){
 const out=[];
 for(const f of families017.slice(0,priorOnly?2:3)){
  const rows=q?.[f.key];if(!Array.isArray(rows)||rows.length!==f.specs.length||new Set(rows.map(p=>p.theme)).size!==f.specs.length)return null;
  for(const [n,s]of f.specs.entries()){
   const p=rows.find(p=>p.theme===s.theme),a=p?.at,[x,y]=f.positions[n];
   if(!a||p.id!==s.id||p.cost!==12||p.lit!==s.lit||p.x!==x||p.y!==y||!Number.isInteger(p.turn)||p.turn<0||p.turn>3||a.root!==y*72+x||a.x!==x||a.y!==y||a.theme!==s.theme||a.am502!==1||a.baseWalkCost!==.72||a.cost!==12||a.amx502?.[f.themeKey]!==s.theme||a.amx502?.[f.turnKey]!==p.turn)return null;
   out.push({family:f.name,id:p.id,root:a.root,x:a.x,y:a.y,theme:a.theme,turn:p.turn,am502:a.am502,amx502:a.amx502,baseWalkCost:a.baseWalkCost,cost:a.cost});
  }
 }
 return new Set(out.map(p=>p.root)).size===out.length?out:null;
}
function functionalQuaysideState017(q){
 if(!functionalGardenState016(q)||q.quaysideDisabled||q.quaysideArtDisabled||q.quayside?.day!==q.stats.day||q.quayside?.art?.total!==24||q.quayside.art.builds!==1||!directIdentity017(q))return false;
 const actual=q.quayside.paths||[];
 return actual.length===6&&new Set(actual.map(r=>r.theme)).size===6&&q.quaysideThemes.every(p=>equal(actual.find(a=>a.theme===p.theme),p.at));
}
function verifyQuaysideCatalog017(q){return equal(q,pins017.quaysideCatalog);}
function sameDirectIdentity017(a,b){const aa=directIdentity017(a),bb=directIdentity017(b);return aa!==null&&bb!==null&&equal(aa,bb);}
function summarizeQuayside017(report){
 const checks=(report.checks||[]).filter(q=>q.scope==='quayside'),cycles=report.quaysideColdReloads||[],expectedChecks=32;
 const passed=report.quaysideChecksPassed===true&&checks.length===expectedChecks&&checks.every(q=>q.ok)&&cycles.length===2&&cycles.every((q,n)=>q.cycle===n+1&&sameDirectIdentity017(q.immediate,q.before)&&q.pausedFrames?.length===2&&q.pausedFrames.every(p=>sameDirectIdentity017(p,q.before))&&q.days?.length===3&&q.days.every(d=>d.ok===true&&functionalQuaysideState017(d.state)&&sameDirectIdentity017(d.state,q.before)));
 return{passed,expectedChecks,checksExecuted:checks.length,checksPassed:checks.filter(q=>q.ok).length,failedChecks:checks.filter(q=>!q.ok).map(q=>q.name),constructionDaysObserved:report.quaysideOrdinaryDays?.length||0,coldReloads:cycles.map(q=>({cycle:q.cycle,save:q.save,daysObserved:q.days?.length||0,firstOrdinaryDay:q.days?.[0]?.ok===true?'passed':'not_passed'}))};
}
module.exports={passiveQuaysideState017,directIdentity017,sameDirectIdentity017,functionalQuaysideState017,verifyQuaysideCatalog017,summarizeQuayside017};
