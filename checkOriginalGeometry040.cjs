'use strict';
// Source-only structural audit. This does not load the game, canvas, kit rasterizer
// or browser. Recording stubs can catch bad coordinates and incomplete builders;
// they cannot establish rendered pixels, projection, crop, lighting or acceptance.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const scope=JSON.parse(fs.readFileSync('wave040-original-scope.json','utf8'));
const source=fs.readFileSync('british-wave12-art040.js','utf8');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const colour=s=>parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0,6),16);
const P=new Proxy({},{get:(_,k)=>colour(String(k))});
let traces=[];
function kit(options,view){
  assert.deepEqual(JSON.parse(JSON.stringify(options)),{sz:2,w:160,h:196});
  const trace={view,polygons:[],beams:[],pairedMaterials:0};traces.push(trace);
  const record=(points,material)=>{
    assert(points.length>=2);
    for(const p of points){assert.equal(p.length,3);assert(p.every(Number.isFinite),'finite world coordinate');}
    if(Array.isArray(material))trace.pairedMaterials++;
    trace.polygons.push(points);
  };
  const S={
    poly:record,
    wall:(a,b,z0,z1,m)=>record([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],m),
    flat:(x0,x1,y0,y1,z,m)=>record([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],m),
    box:(x0,x1,y0,y1,z0,z1,m)=>{assert(x1>x0&&y1>y0&&z1>=z0,'ordered world box');record([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],m);},
    beam:(a,b,c,w)=>{assert(a.every(Number.isFinite)&&b.every(Number.isFinite));assert(Number.isFinite(w)&&w>0);trace.beams.push([a,b,w]);},
    face:(a,b,nx,ny)=>{
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);assert(length>0);
      const F={length,point:(u,d,z)=>[a[0]+dx*u/length+nx*d,a[1]+dy*u/length+ny*d,z]};
      F.panel=(u0,u1,z0,z1,m,d=0)=>record([F.point(u0,d,z0),F.point(u1,d,z0),F.point(u1,d,z1),F.point(u0,d,z1)],m);
      F.block=(u0,u1,d0,d1,z0,z1,m)=>record([F.point(u0,d0,z0),F.point(u1,d0,z0),F.point(u1,d1,z0),F.point(u0,d1,z0),F.point(u0,d0,z1),F.point(u1,d0,z1),F.point(u1,d1,z1),F.point(u0,d1,z1)],m);
      return F;
    },
    finish:meta=>({sourceOnly:true,...meta})
  };
  const K={
    hash:(x,y,z)=>(Math.imul(x,17)^Math.imul(y,43)^z)>>>0,mod:(x,n)=>(x%n+n)%n,
    brick:()=>()=>P.stone,ashlar:()=>()=>P.stone,slate:()=>()=>P.lead,paving:()=>P.pave,
    cylinder:(s,x,y,z0,z1,r0,r1,c0,c1,c2,n=8)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([[x+r0*Math.cos(a),y+r0*Math.sin(a),z0],[x+r0*Math.cos(b),y+r0*Math.sin(b),z0],[x+r1*Math.cos(b),y+r1*Math.sin(b),z1],[x+r1*Math.cos(a),y+r1*Math.sin(a),z1]],c0);}},
    ring:(s,F,u,z,rx,ry,w,d,m,n=24)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([F.point(u+rx*Math.cos(a),d,z+ry*Math.sin(a)),F.point(u+rx*Math.cos(b),d,z+ry*Math.sin(b)),F.point(u+(rx-w)*Math.cos(b),d,z+(ry-w)*Math.sin(b)),F.point(u+(rx-w)*Math.cos(a),d,z+(ry-w)*Math.sin(a))],m);}},
    lantern:(s,x,y,z,lit)=>s.poly([[x-.3,y,z],[x+.3,y,z],[x+.3,y,z+1],[x-.3,y,z+1]],lit?[P.glass,P.warm]:P.glass)
  };
  return{S,K,P,C:s=>parseInt(s,16),dark:(nx,ny)=>nx-ny<0};
}
const sandbox={BritishUseScalesKit021:{create:kit}};
vm.runInNewContext(source,sandbox,{filename:'british-wave12-art040.js'});
const art=sandbox.BritishWaveArchitecture040,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,600+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[];
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave040,1);assert(t.polygons.length>35);assert(t.pairedMaterials>5,'authored paired glazing required');
  const bbox=[0,1,2].map(i=>[Math.min(...pts.map(p=>p[i])),Math.max(...pts.map(p=>p[i]))]);
  assert(bbox[0][0]>-.1&&bbox[0][1]<32.1&&bbox[1][0]>-.1&&bbox[1][1]<32.1,'bounded native footprint');
  assert(bbox[2][0]>=0&&bbox[2][1]<65,'bounded authored height; this is not a projected crop check');
  summaries.push({id:row.id,view,polygons:t.polygons.length,beams:t.beams.length,pairedMaterials:t.pairedMaterials,bbox,geometrySHA256:digest({polygons:t.polygons,beams:t.beams})});
}
assert.equal(summaries.length,40);assert.equal(new Set(summaries.filter(s=>s.view===0).map(s=>s.geometrySHA256)).size,10);
assert.throws(()=>art.build('not-a-frozen-model',0),/unknown frozen original/);
assert.throws(()=>art.build(rows[0].id,4),/four world rotations only/);
assert.throws(()=>art.build(rows[0].id,NaN),/four world rotations only/);
assert(!/\b(?:document|SPR|tiles|dispatch|nightPowerRate|trafClock|pw)\b/.test(source),'pure geometry source isolation');
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,negativeControls:3,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),summaries};
fs.writeFileSync('wave040-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({...out,summaries:undefined}));
