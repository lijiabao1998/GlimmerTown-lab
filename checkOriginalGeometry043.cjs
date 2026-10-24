'use strict';
// Source-only structural audit. This does not load the game, canvas, kit rasterizer
// or browser. Recording stubs can catch bad coordinates and incomplete builders;
// they cannot establish rendered pixels, projection, crop, lighting or acceptance.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const scope=JSON.parse(fs.readFileSync('wave043-original-scope.json','utf8'));
const source=fs.readFileSync('british-wave15-art043.js','utf8');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const colour=s=>parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0,6),16);
const P=new Proxy({},{get:(_,k)=>colour(String(k))});
let traces=[];
function kit(options,view){
  assert.deepEqual(JSON.parse(JSON.stringify(options)),{sz:2,w:160,h:196});
  const trace={view,polygons:[],beams:[],faces:[],materials:[],materialValues:[],pairedMaterials:0};traces.push(trace);
  const record=(points,material)=>{
    assert(points.length>=2);
    for(const p of points){assert.equal(p.length,3);assert(p.every(Number.isFinite),'finite world coordinate');}
    if(Array.isArray(material))trace.pairedMaterials++;
    trace.polygons.push(points);trace.materials.push(Array.isArray(material)?'emissive':material&&material.kind||'solid');trace.materialValues.push(typeof material==='number'?material:null);
  };
  const S={
    poly:record,
    wall:(a,b,z0,z1,m)=>record([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],m),
    flat:(x0,x1,y0,y1,z,m)=>record([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],m),
    box:(x0,x1,y0,y1,z0,z1,m,side,top)=>{assert(x1>x0&&y1>y0&&z1>=z0,'ordered world box');for(const [a,b,c]of[[[x0,y0],[x1,y0],m],[[x0,y1],[x1,y1],m],[[x0,y0],[x0,y1],side===undefined?m:side],[[x1,y0],[x1,y1],side===undefined?m:side]])record([[...a,z0],[...b,z0],[...b,z1],[...a,z1]],c);if(top!==null)record([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],top===undefined?m:top);},
    beam:(a,b,c,w)=>{assert(a.every(Number.isFinite)&&b.every(Number.isFinite));assert(Number.isFinite(w)&&w>0);trace.beams.push([a,b,w]);},
    face:(a,b,nx,ny)=>{
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);assert(length>0);
      assert(Math.abs(Math.hypot(nx,ny)-1)<1e-8,'unit physical wall normal');trace.faces.push({a,b,nx,ny});
      const F={length,point:(u,d,z)=>[a[0]+dx*u/length+nx*d,a[1]+dy*u/length+ny*d,z]};
      F.panel=(u0,u1,z0,z1,m,d=0)=>record([F.point(u0,d,z0),F.point(u1,d,z0),F.point(u1,d,z1),F.point(u0,d,z1)],m);
      F.block=(u0,u1,d0,d1,z0,z1,m)=>record([F.point(u0,d0,z0),F.point(u1,d0,z0),F.point(u1,d1,z0),F.point(u0,d1,z0),F.point(u0,d0,z1),F.point(u1,d0,z1),F.point(u1,d1,z1),F.point(u0,d1,z1)],m);
      return F;
    },
    finish:meta=>({sourceOnly:true,...meta})
  };
  const K={
    hash:(x,y,z)=>(Math.imul(x,17)^Math.imul(y,43)^z)>>>0,mod:(x,n)=>(x%n+n)%n,
    brick:()=>Object.assign(()=>P.stone,{kind:'brick'}),ashlar:()=>Object.assign(()=>P.stone,{kind:'stone'}),slate:()=>Object.assign(()=>P.lead,{kind:'slate'}),paving:()=>P.pave,
    cylinder:(s,x,y,z0,z1,r0,r1,c0,c1,c2,n=8)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([[x+r0*Math.cos(a),y+r0*Math.sin(a),z0],[x+r0*Math.cos(b),y+r0*Math.sin(b),z0],[x+r1*Math.cos(b),y+r1*Math.sin(b),z1],[x+r1*Math.cos(a),y+r1*Math.sin(a),z1]],c0);}},
    ring:(s,F,u,z,rx,ry,w,d,m,n=24)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([F.point(u+rx*Math.cos(a),d,z+ry*Math.sin(a)),F.point(u+rx*Math.cos(b),d,z+ry*Math.sin(b)),F.point(u+(rx-w)*Math.cos(b),d,z+(ry-w)*Math.sin(b)),F.point(u+(rx-w)*Math.cos(a),d,z+(ry-w)*Math.sin(a))],m);}},
    lantern:(s,x,y,z,lit)=>s.poly([[x-.3,y,z],[x+.3,y,z],[x+.3,y,z+1],[x-.3,y,z+1]],lit?[P.glass,P.warm]:P.glass)
  };
  return{S,K,P,C:s=>parseInt(s,16),dark:(nx,ny)=>nx-ny<0};
}
const sandbox={BritishUseScalesKit021:{create:kit}};
vm.runInNewContext(source,sandbox,{filename:'british-wave15-art043.js'});
const art=sandbox.BritishWaveArchitecture043,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,720+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[],modelTraces={};
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  if(view===0)modelTraces[row.id]=t;
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave043,1);assert(t.polygons.length>35);assert(t.pairedMaterials>5,'authored paired glazing required');
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
// Independent geometric assertions work on recorded surfaces, not model flags.
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const signedArea=q=>q.reduce((s,p,i)=>s+p[0]*q[(i+1)%q.length][1]-p[1]*q[(i+1)%q.length][0],0)/2;
const ccw=q=>signedArea(q)<0?q.toReversed():q.slice();
function intersectionArea(first,second){
  let p=ccw(first),clip=ccw(second);
  for(let i=0;i<clip.length&&p.length;i++){
    const a=clip[i],b=clip[(i+1)%clip.length],out=[];
    for(let j=0;j<p.length;j++){
      const x=p[j],y=p[(j+1)%p.length],dx=cross(a,b,x),dy=cross(a,b,y),insideX=dx>=-1e-9,insideY=dy>=-1e-9;
      if(insideX)out.push(x);
      if(insideX!==insideY){const t=dx/(dx-dy);out.push([x[0]+t*(y[0]-x[0]),x[1]+t*(y[1]-x[1])]);}
    }
    p=out;
  }
  return Math.abs(signedArea(p));
}
function roofPolygons(t){return t.polygons.filter((p,i)=>t.materials[i]==='slate');}
function assertRoofPartition(polys,label){
  for(const q0 of polys){const q=ccw(q0);assert(signedArea(q)>1e-9,label+' nonzero roof patch');for(let i=0;i<q.length;i++)assert(cross(q[i],q[(i+1)%q.length],q[(i+2)%q.length])>=-1e-8,label+' convex roof patch');}
  for(let i=0;i<polys.length;i++)for(let j=i+1;j<polys.length;j++)assert(intersectionArea(polys[i],polys[j])<1e-7,label+' roof patches must not overlap in plan');
}
function heightsAt(t,x,y){
  const found=[];
  for(const p of t.polygons)for(let i=1;i<p.length-1;i++){
    const a=p[0],b=p[i],c=p[i+1],d=cross(a,b,c);if(Math.abs(d)<1e-9)continue;
    const u=cross([x,y],b,c)/d,v=cross(a,[x,y],c)/d,w=1-u-v;
    if(Math.min(u,v,w)>=-1e-8)found.push(a[2]*u+b[2]*v+c[2]*w);
  }
  return found;
}
function assertOpen(t,points,label){for(const p of points)assert(heightsAt(t,...p).every(z=>z<=.61),label+' true empty vertical opening');}
for(const id of['pondbadminton','fennelhoney','withebasket','rillramblers'])assertRoofPartition(roofPolygons(modelTraces[id]),id);
assertOpen(modelTraces.fennelhoney,[[16,16],[13,16],[19,16],[16,13],[16,19]],'hexagonal courtyard');
assertOpen(modelTraces.ashfives,[[16,16],[16,23],[11,25],[21,25],[16,29]],'roofless open court');
// The spiral gap lies between 345 and 405 degrees. Probe the actual lodge
// width at 15 degrees, not just the courtyard centre where any ring is empty.
assertOpen(modelTraces.rillramblers,[8,10,12].map(r=>[16+r*Math.cos(Math.PI/12),16+r*Math.sin(Math.PI/12)]),'spiral entrance gap');
const close=(a,b)=>Math.abs(a-b)<1e-8,key=p=>p.map(x=>Math.round(x*1e8)).join(','),polykey=p=>p.map(key).sort().join('|');
function pointOnTriangle(p,a,b,c){
  const sub=(u,v)=>u.map((x,i)=>x-v[i]),dot=(u,v)=>u.reduce((n,x,i)=>n+x*v[i],0),v0=sub(b,a),v1=sub(c,a),v2=sub(p,a),aa=dot(v0,v0),bb=dot(v0,v1),cc=dot(v1,v1),dd=dot(v2,v0),ee=dot(v2,v1),den=aa*cc-bb*bb;
  if(Math.abs(den)<1e-12)return false;const u=(cc*dd-bb*ee)/den,v=(aa*ee-bb*dd)/den,recon=a.map((x,i)=>x+u*v0[i]+v*v1[i]);
  return u>=-1e-8&&v>=-1e-8&&u+v<=1+1e-8&&Math.hypot(...p.map((x,i)=>x-recon[i]))<1e-7;
}
function assertSaddleClosed(t){
  const tops=roofPolygons(t);assert.equal(tops.length,200,'saddle has independently specified 10 by 10 triangulated cells');
  const underside=new Set(t.polygons.filter((p,i)=>t.materialValues[i]===P.woodR).map(polykey));
  for(const p of tops)assert(underside.has(polykey(p.map(q=>[q[0],q[1],q[2]-.42]))),'saddle exact matching closed underside');
  const corners=[[16,3.3,19.3],[28.7,16,9.1],[16,28.7,19.3],[3.3,16,9.1]];
  const vertices=tops.flat();for(const c of corners)assert(vertices.some(p=>p.every((v,i)=>close(v,c[i]))),'saddle alternating high and low corner');
  const edges=new Map();for(const p of tops)for(let i=0;i<3;i++){const a=p[i],b=p[(i+1)%3],k=[key(a),key(b)].sort().join('|'),e=edges.get(k);if(e)e.count++;else edges.set(k,{a,b,count:1});}
  const boundary=[...edges.values()].filter(e=>e.count===1);assert.equal(boundary.length,40,'saddle has exactly one four-sided boundary');
  for(const e of boundary){const lowA=[e.a[0],e.a[1],e.a[2]-.42],lowB=[e.b[0],e.b[1],e.b[2]-.42];assert(t.polygons.some((p,i)=>t.materialValues[i]===P.lead&&p.length===4&&[e.a,e.b,lowA,lowB].every(v=>pointOnTriangle(v,p[0],p[1],p[2])||pointOnTriangle(v,p[0],p[2],p[3]))),'saddle has four closed boundary fascia strips');}
}
assertSaddleClosed(modelTraces.pondbadminton);
const ring=modelTraces.fennelhoney.faces.filter(F=>Math.hypot(F.a[0]-16,F.a[1]-16)<7&&Math.hypot(F.b[0]-16,F.b[1]-16)<7);
assert(ring.length>=12);for(const F of ring){const x=(F.a[0]+F.b[0])/2-16,y=(F.a[1]+F.b[1])/2-16;assert(x*F.nx+y*F.ny<0,'courtyard faces point inward toward real air');}
function assertEndNormals(t,endpoints,label){
  for(const {a,b,n}of endpoints){const F=t.faces.find(F=>(F.a.every((x,i)=>close(x,a[i]))&&F.b.every((x,i)=>close(x,b[i])))||(F.b.every((x,i)=>close(x,a[i]))&&F.a.every((x,i)=>close(x,b[i]))));assert(F,label+' real end face');assert(F.nx*n[0]+F.ny*n[1]>.999999,label+' exterior end normal');}
}
const sDx=5.4*2*Math.PI,sDy=25.5,sLen=Math.hypot(sDx,sDy),sNx=sDy/sLen,sNy=-sDx/sLen;
const sEnds=[3.25,28.75].map((y,i)=>({a:[16-sNx*2.65,y-sNy*2.65],b:[16+sNx*2.65,y+sNy*2.65],n:[(i?1:-1)*sDx/sLen,(i?1:-1)*sDy/sLen]}));
const spiralEnds=[{angle:Math.PI/4,r:9.8,sign:-1},{angle:Math.PI/4+5*Math.PI/3,r:10.85,sign:1}].map(({angle,r,sign})=>({a:[16+(r-2.65)*Math.cos(angle),16+(r-2.65)*Math.sin(angle)],b:[16+(r+2.65)*Math.cos(angle),16+(r+2.65)*Math.sin(angle)],n:[-Math.sin(angle)*sign,Math.cos(angle)*sign]}));
assertEndNormals(modelTraces.withebasket,sEnds,'S workshop');assertEndNormals(modelTraces.rillramblers,spiralEnds,'spiral lodge');
// Explicit corruptions exercise the new geometry-only guard, then original
// traces are rechecked. These do not claim Chrome/pixel negative controls.
let structuralNegativeControls=0;
const duplicate=roofPolygons(modelTraces.withebasket);assert.throws(()=>assertRoofPartition([...duplicate,duplicate[0]],'S mutation'),/must not overlap/);structuralNegativeControls++;
const filled={polygons:[...modelTraces.fennelhoney.polygons,[[12,12,10],[20,12,10],[20,20,10],[12,20,10]]]};assert.throws(()=>assertOpen(filled,[[16,16]],'filled courtyard'),/true empty/);structuralNegativeControls++;
const blocked={polygons:[...modelTraces.rillramblers.polygons,[[22,15,4],[30,15,4],[30,22,4],[22,22,4]]]};assert.throws(()=>assertOpen(blocked,[[25,18]],'blocked spiral'),/true empty/);structuralNegativeControls++;
const saddle=modelTraces.pondbadminton,remove=saddle.polygons.findIndex((p,i)=>saddle.materialValues[i]===P.woodR&&p.length===3),openSaddle={...saddle,polygons:saddle.polygons.filter((_,i)=>i!==remove),materials:saddle.materials.filter((_,i)=>i!==remove),materialValues:saddle.materialValues.filter((_,i)=>i!==remove)};
assert.throws(()=>assertSaddleClosed(openSaddle),/exact matching closed underside/);structuralNegativeControls++;
const wrongEnds={...modelTraces.rillramblers,faces:modelTraces.rillramblers.faces.map(F=>({...F,nx:-F.nx,ny:-F.ny}))};assert.throws(()=>assertEndNormals(wrongEnds,spiralEnds,'inward spiral mutation'),/exterior end normal/);structuralNegativeControls++;
for(const id of['pondbadminton','fennelhoney','withebasket','rillramblers'])assertRoofPartition(roofPolygons(modelTraces[id]),id+' restored');
assertSaddleClosed(saddle);
const structuralChecks={nonintersectingConvexRoofPartitions:['pondbadminton','fennelhoney','withebasket','rillramblers'],realOpenCourtyard:true,realRooflessCourt:true,realSpiralGap:true,closedSaddleUndersideAndFascia:true,unitWallNormals:true,inwardCourtyardNormals:true,outwardSAndSpiralEndNormals:true,sourceOnly:true};
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,negativeControls:3+structuralNegativeControls,structuralChecks,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),summaries};
fs.writeFileSync('wave043-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({...out,summaries:undefined}));
