#!/usr/bin/env node
'use strict';
// Source/JSON observation controls only; no native game, art or browser runs.
const vm=require('node:vm'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{functions017}=require('./quayside-gameplay017');
const fn=functions017.find(f=>f.name==='quaysidePriorPaths017');assert(fn);const source=fn.toString();
assert(!/Evidence015|Evidence016|forceDraw|step\(|ensure|rebuild|MarkDirty|dispatch|localStorage/.test(source));
const fixtures=[{family:'streetscape015',count:8,themeKey:'british015',turnKey:'turn015',recipeKey:'__streetscapeQA015',getter:'streetscapeAt015'},{family:'gardenLife016',count:6,themeKey:'british016',turnKey:'turn016',recipeKey:'__gardenLifeQA016',getter:'gardenLifeAt016'}].map((f,side)=>{
 const paths=Array.from({length:f.count},(_,n)=>({x:n+side*20+5,y:68,theme:'synthetic-'+f.family+'-'+n,turn:n%4,cost:12}));
 return{...f,paths,rows:paths.map(p=>({root:p.y*72+p.x,x:p.x,y:p.y,theme:p.theme,am502:1,amx502:{[f.themeKey]:p.theme,[f.turnKey]:p.turn},baseWalkCost:.72,cost:12,lighting:{ready:false,source:null,district:-1,service:0}}))};
});
function run(input=fixtures){const before=JSON.stringify(input),reads=[],window={},GV={streetscapeEvidence015(){throw Error('Forbidden lazy aggregate');},gardenLifeEvidence016(){throw Error('Forbidden lazy aggregate');}};for(const f of input){window[f.recipeKey]={paths:f.paths};GV[f.getter]=(x,y)=>{reads.push([f.family,x,y]);return f.rows.find(p=>p.x===x&&p.y===y)||null;};}const result=new vm.Script('('+source+')()').runInNewContext({window,GV:Object.freeze(GV)});assert.equal(JSON.stringify(input),before);return{result,reads};}
const positive=run(),expected=fixtures.flatMap(f=>f.rows.map(r=>({...r,family:f.family})));
assert.equal(JSON.stringify(positive.result),JSON.stringify(expected));assert.equal(positive.reads.length,14);assert(positive.result.every(p=>p.lighting.ready===false));
const rejected=[];for(const side of[0,1])for(const[name,mutate]of[
 ['missing coordinate',f=>f.paths.pop()],['extra coordinate',f=>f.paths.push(f.paths[0])],['duplicate coordinate',f=>f.paths[1]={...f.paths[0],theme:f.paths[1].theme}],['duplicate theme',f=>f.paths[1].theme=f.paths[0].theme],['missing native tile',f=>f.rows.pop()],['changed theme',f=>f.rows[0].theme='changed'],['changed saved theme',f=>f.rows[0].amx502[f.themeKey]='changed'],['changed direction',f=>f.rows[0].amx502[f.turnKey]++],['changed path identity',f=>f.rows[0].am502=2],['missing metadata',f=>delete f.rows[0].amx502],['wrong coordinate',f=>f.rows[0].x++],['wrong root',f=>f.rows[0].root++],['wrong native cost',f=>f.rows[0].cost++],['wrong walking cost',f=>f.rows[0].baseWalkCost=.8]
]){const q=structuredClone(fixtures);mutate(q[side]);const label=q[side].family+'/'+name;assert.throws(()=>run(q),undefined,label);rejected.push(label);}
{const q=structuredClone(fixtures),p=q[0].paths[0];Object.assign(q[1].paths[0],{x:p.x,y:p.y});Object.assign(q[1].rows[0],{x:p.x,y:p.y,root:p.y*72+p.x});assert.throws(()=>run(q));rejected.push('cross-family duplicate coordinate');}
const ids=functions017.find(f=>f.name==='quaysideConflictTools017')();
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),section=html.match(/const AM_META502=\{([\s\S]*?)\n\};/);assert(section);const nativeIds=[...section[1].matchAll(/(\w+):\{c:/g)].map(m=>m[1]);assert(nativeIds.includes('bikePath502'));assert(!nativeIds.includes('footcycle502'));
const known=new Set(['road','mooringBitts017','pumpCourt016','heritageLantern015','sundialCourt015','britishTerrace','tdig','tland','traise',...nativeIds]);
const validate=q=>{assert.equal(q.length,11);assert.equal(new Set(q).size,11);for(const id of q)assert(known.has(id));assert(q.includes('bikePath502'));assert(q.includes('pumpCourt016'));};validate(ids);
for(const[name,mutate]of[['unsupported alias',q=>q[2]='footcycle502'],['missing tool',q=>q.pop()],['duplicate tool',q=>q[2]=q[0]]]){const q=[...ids];mutate(q);assert.throws(()=>validate(q));rejected.push(name);}
const constraints=functions017.find(f=>f.name==='quaysideConstraints017').toString();assert(constraints.includes("if(!quote)throw Error('Declared conflict tool lacks native preview: '+id)"));assert(!constraints.includes('if(!quote)continue'));
console.log(JSON.stringify({ok:true,sourceOnly:true,syntheticDataOnly:true,gameExecuted:false,artExecuted:false,exactPriorCoordinatesRead:14,priorFamilies:2,lazyAggregatesUnused:true,noReadinessRepair:true,knownConflictTools:11,expectedNativeConflictCases:66,rejected},null,2));
