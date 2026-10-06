#!/usr/bin/env node
'use strict';
// Pure observation-function data controls; no native game, art or browser runs.
const vm=require('node:vm'),assert=require('node:assert/strict'),{functions016}=require('./gardenlife-gameplay016');
const fn=functions016.find(f=>f.name==='gardenLifePriorPaths016');assert(fn);
const source=fn.toString();assert(!/Evidence015|forceDraw|step\(|ensure|rebuild|MarkDirty|dispatch|localStorage/.test(source));
const recipe=Array.from({length:8},(_,n)=>({x:n+5,y:68,theme:'syntheticPrior'+n,turn:n%4}));
const records=recipe.map(p=>({root:p.y*72+p.x,x:p.x,y:p.y,theme:p.theme,am502:1,amx502:{british015:p.theme,turn015:p.turn},baseWalkCost:.72,cost:12,lighting:{ready:false,source:null,district:-1,service:0}}));
function run(paths=recipe,rows=records){const before=JSON.stringify({paths,rows}),reads=[];const context={window:{__streetscapeQA015:{paths}},GV:Object.freeze({streetscapeAt015(x,y){reads.push([x,y]);return rows.find(p=>p.x===x&&p.y===y)||null;},streetscapeEvidence015(){throw Error('Forbidden lazy aggregate read');}})};const result=new vm.Script('('+source+')()').runInNewContext(context);assert.equal(JSON.stringify({paths,rows}),before,'Observer does not mutate data');return{result,reads};}
const positive=run();assert.equal(JSON.stringify(positive.result),JSON.stringify(records));assert.deepEqual(positive.reads,recipe.map(p=>[p.x,p.y]));assert(positive.result.every(p=>p.lighting.ready===false),'Dirty/unsupplied state is retained, never fixed');
const rejected=[];const reject=(name,mutate)=>{const q={paths:structuredClone(recipe),rows:structuredClone(records)};mutate(q);assert.throws(()=>run(q.paths,q.rows),undefined,name);rejected.push(name);};
for(const[name,mutate]of[
 ['missing prior coordinate',q=>q.paths.pop()],['extra coordinate',q=>q.paths.push(q.paths[0])],['duplicate coordinate',q=>q.paths[1]={...q.paths[0],theme:q.paths[1].theme}],['duplicate theme',q=>q.paths[1].theme=q.paths[0].theme],['missing native tile',q=>q.rows.pop()],['changed native theme',q=>q.rows[0].theme='wrong'],['changed saved theme',q=>q.rows[0].amx502.british015='wrong'],['changed direction',q=>q.rows[0].amx502.turn015++],['changed path identity',q=>q.rows[0].am502=2],['missing metadata',q=>delete q.rows[0].amx502],['wrong native coordinate',q=>q.rows[0].x++]
])reject(name,mutate);
const ids=functions016.find(f=>f.name==='gardenLifeConflictTools016')();
const fs=require('node:fs'),path=require('node:path'),html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),section=html.match(/const AM_META502=\{([\s\S]*?)\n\};/);assert(section,'Exact native active-mobility catalog source required');const nativeIds=[...section[1].matchAll(/(\w+):\{c:/g)].map(m=>m[1]);assert(nativeIds.includes('bikePath502'));assert(!nativeIds.includes('footcycle502'));
const known=new Set(['road','pumpCourt016','heritageLantern015','sundialCourt015','britishTerrace','tdig','tland','traise',...nativeIds]);
const validateIds=q=>{assert.equal(q.length,10);assert.equal(new Set(q).size,10);for(const id of q)assert(known.has(id),'Known native fixture ID required: '+id);assert(q.includes('bikePath502'));};validateIds(ids);
for(const [name,change]of[['unknown old alias',q=>q[2]='footcycle502'],['missing tool',q=>q.pop()],['duplicate tool',q=>q[2]=q[0]]]){const q=[...ids];change(q);assert.throws(()=>validateIds(q),undefined,name);rejected.push(name);}
const constraintSource=functions016.find(f=>f.name==='gardenLifeConstraints016').toString();assert(constraintSource.includes("if(!quote)throw Error('Declared conflict tool lacks native preview: '+id)"));assert(!constraintSource.includes('if(!quote)continue'));
console.log(JSON.stringify({ok:true,sourceOnly:true,syntheticDataOnly:true,gameExecuted:false,artExecuted:false,exactNativeCoordinatesRead:positive.reads.length,lazyAggregateUnused:true,noReadinessRepair:true,knownConflictToolCount:ids.length,unsupportedAliasesRejected:true,rejected},null,2));
