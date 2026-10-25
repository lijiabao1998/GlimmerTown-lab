'use strict';
// Recording-stub geometry only. Never invokes Canvas, the game, Chrome or fingerprints.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const {U,kit,traces,frozenRows,source,digest}=require('./wave047-geometry-harness.cjs');
const scope=JSON.parse(fs.readFileSync('wave047-original-scope.json','utf8'));
assert.deepEqual(scope.rows,frozenRows,'independent first-card frozen ten-model identities and geometry specification');
process.argv.push('--check');try{require('./build-wave047-art.cjs');}finally{process.argv.pop();}
const sandbox={BritishUseScalesKit021:{create:kit},__wave047GeometryOnly:true};
vm.runInNewContext(source,sandbox,{filename:'british-wave19-art047.js'});
const art=sandbox.BritishWaveArchitecture047,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,880+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[],modelTraces={};
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  if(view===0)modelTraces[row.id]=t;
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave047,1);assert(t.polygons.length>35);assert.equal(t.pairedMaterials,t.materials.filter(m=>m==='emissive').length,'record all authored glazing, including intentionally open shell');
  const bbox=[0,1,2].map(i=>[Math.min(...pts.map(p=>p[i])),Math.max(...pts.map(p=>p[i]))]);
  assert(bbox[0][0]>-.1&&bbox[0][1]<32.1&&bbox[1][0]>-.1&&bbox[1][1]<32.1,'bounded native footprint');
  assert(bbox[2][0]>=0&&bbox[2][1]<65,'bounded authored height; this is not a projected crop check');
  const boundsPoints=[...pts,...t.beams.flatMap(([a,b,w])=>[a,b].flatMap(p=>[-1,1].flatMap(s=>[-1,1].flatMap(v=>[-1,1].map(z=>[p[0]+s*w/2,p[1]+v*w/2,p[2]+z*w/2])))))];
  const projected=boundsPoints.map(([x,y,z])=>{let u=x,v=y;if(view===1){u=32-y;v=x;}else if(view===2){u=32-x;v=32-y;}else if(view===3){u=y;v=32-x;}return[80+2*u-2*v,130+u+v-z];});
  const projectedBounds=[0,1].map(i=>[Math.min(...projected.map(p=>p[i])),Math.max(...projected.map(p=>p[i]))]);
  assert(projectedBounds[0][0]>1&&projectedBounds[0][1]<159&&projectedBounds[1][0]>1&&projectedBounds[1][1]<195,'analytic source projected bounds include all beam widths; not a pixel crop assertion');
  summaries.push({id:row.id,view,projectedBounds,polygons:t.polygons.length,beams:t.beams.length,pairedMaterials:t.pairedMaterials,bbox,geometrySHA256:digest({polygons:t.polygons,beams:t.beams})});
}
assert.equal(summaries.length,40);assert.equal(new Set(summaries.filter(s=>s.view===0).map(s=>s.geometrySHA256)).size,10);
assert.throws(()=>art.build('not-a-frozen-model',0),/unknown frozen original/);
assert.throws(()=>art.build(rows[0].id,4),/four world rotations only/);
assert.throws(()=>art.build(rows[0].id,NaN),/four world rotations only/);
assert(!/\b(?:document|SPR|tiles|dispatch|nightPowerRate|trafClock|pw)\b/.test(source.slice(source.indexOf('  function context('))),'pure geometry source isolation');
assert(!/BritishWaveArchitecture(?!047)\d+|\brequire\s*\(|\beval\s*\(/.test(source.slice(source.indexOf('  function context('))),'no prior model dispatch or dynamic source access');

const a=require('./wave047-checks-a-junction.cjs')(U),b=require('./wave047-checks-b-shell.cjs')(U);
const checks={...a.checks,...b.checks},mutations=[...a.mutations,...b.mutations];
assert.deepEqual(Object.keys(checks).sort(),rows.map(r=>r.id).sort());
for(const row of rows)for(let view=0;view<4;view++){art.build(row.id,view);checks[row.id](traces.at(-1));}
const controls=[];
for(const {name,id,mutate,pattern} of mutations){
 const bad=JSON.parse(JSON.stringify(modelTraces[id])),before=digest({polygons:bad.polygons,beams:bad.beams});
 mutate(bad);assert.notEqual(digest({polygons:bad.polygons,beams:bad.beams}),before,'negative changes actual geometry');
 assert.throws(()=>checks[id](bad),pattern,name+' fails at exact target');checks[id](modelTraces[id]);
 controls.push({name,id,target:pattern.source,firstRed:'actual-surface',restored:true});
}
assert(controls.length>=30,'thirty actual structural sabotage controls');

const sourceControls=[];
for(const [name,from,to,id,pattern] of [
 ['source-deform-kiln-radius','A.polygon(21,11,7.7','A.polygon(21,11,6.7','hopdrying',/cylindrical kiln/],
 ['source-flatten-recital-hemisphere','r=11.5','r=10.5','vervainrecital',/true two-axis spherical/]
]){
 assert.equal(source.split(from).length,2,'unique source-body mutation target');
 const changed=source.replace(from,to),box={BritishUseScalesKit021:{create:kit},__wave047GeometryOnly:true};
 vm.runInNewContext(changed,box);box.BritishWaveArchitecture047.build(id,0);
 assert.throws(()=>checks[id](traces.at(-1)),pattern,name);checks[id](modelTraces[id]);
 sourceControls.push({name,id,target:pattern.source,restored:true});
}

for(const row of rows)assert(mutations.filter(m=>m.id===row.id).length>=3,'three controls for every model');
const invalidInputs=[];
for(const view of[-1,4,1.5,NaN,Infinity,-Infinity,'0',null,undefined,true]){assert.throws(()=>art.build(rows[0].id,view),/four world rotations only/);invalidInputs.push({kind:'view',value:String(view)});}
for(const id of['not-frozen','__proto__','constructor','',null,undefined,880]){assert.throws(()=>art.build(id,0),/unknown frozen original/);invalidInputs.push({kind:'id',value:String(id)});}
assert(Object.isFrozen(art)&&Object.isFrozen(art.rows)&&art.rows.every(Object.isFrozen));assert.equal(art.buildAll().length,40);
for(const row of rows)assert.equal(new Set(summaries.filter(s=>s.id===row.id).map(s=>s.geometrySHA256)).size,1,'four callers construct identical world geometry');
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),structuralNegativeControls:controls,sourceControls,invalidInputs,negativeControls:controls.length+sourceControls.length+invalidInputs.length,summaries};
fs.writeFileSync('wave047-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,summaries:undefined}));
