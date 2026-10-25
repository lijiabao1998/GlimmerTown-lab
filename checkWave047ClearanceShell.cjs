'use strict';
// Recording-stub geometry only, never native raster or Canvas.
const vm=require('vm'),assert=require('assert/strict');
const {U,kit,traces,source}=require('./wave047-geometry-harness.cjs');
const {close,P}=U,sandbox={BritishUseScalesKit021:{create:kit},__wave047GeometryOnly:true};
vm.runInNewContext(source,sandbox);
const radius=p=>Math.hypot(p[0]-16,p[1]-22,p[2]-9.4);
function check(t){
 const outer=t.polygons.map((p,k)=>({p,k,c:t.materialValues[k]})).filter(({p})=>p.every(q=>close(radius(q),11.5)));
 assert.equal(outer.length,288,'shell047 unchanged full sphere outer skin');
 for(let k=0;k<outer.length;k++){const i=Math.floor(k/24),j=k%24,theta=(i+.5)*Math.PI/24,phi=(j+.5)*Math.PI/24,nx=Math.sin(theta)*Math.cos(phi),ny=-Math.sin(theta)*Math.sin(phi),nz=Math.cos(theta),v=t.view,rx=v===1?-ny:v===2?-nx:v===3?ny:nx,ry=v===1?nx:v===2?-ny:v===3?-nx:ny;assert.equal(outer[k].c,(-rx+ry+nz)<0?P.lead:P.slateHi,'shell047 full rotated spherical normal including vertical component');}
 assert(outer.slice(0,24).every(p=>p.c===P.slateHi),'shell047 upward crown faces retain native lit slate');
 assert(outer.slice(240).some(p=>p.c===P.lead),'shell047 lower curved side has genuine unlit normal');
 const choose=(w,r)=>t.beams.map((b,i)=>({b,c:t.beamMaterials[i]})).filter(({b})=>close(b[2],w)&&b.slice(0,2).every(p=>close(radius(p),r)));
 const seams=choose(.8,11.68),hoops=choose(.65,11.68),ribs=choose(1.0,10.57);
 assert.equal(seams.length,60,'shell047 sixty physical exterior curved standing-seam segments');assert(seams.every(x=>x.c===P.slateR),'shell047 exterior seam original slate palette');
 assert.equal(hoops.length,48,'shell047 forty-eight physical exterior curved hoop segments');
 assert.equal(ribs.length,60,'shell047 sixty substantial interior curved rib segments');assert(ribs.every(x=>x.c===P.stoneD),'shell047 internal ribs original stone palette');
 for(const {b} of [...seams,...hoops,...ribs]){assert(b[0][2]>=9.4-1e-7&&b[1][2]>=9.4-1e-7,'shell047 no curved member below springline');assert(Math.hypot(...b[0].map((v,i)=>v-b[1][i]))<1.6,'shell047 short curved chord not a screen-space line');}
}
let negatives=0;
for(let view=0;view<4;view++){
 sandbox.BritishWaveArchitecture047.build('vervainrecital',view);const t=traces.at(-1);check(t);
 for(const [w,re]of[[.8,/sixty physical exterior/],[.65,/forty-eight physical/],[1.0,/sixty substantial interior/]]){const q=JSON.parse(JSON.stringify(t)),i=q.beams.findIndex(b=>close(b[2],w));assert(i>=0);q.beams.splice(i,1);q.beamMaterials.splice(i,1);assert.throws(()=>check(q),re);check(t);negatives++;}
 const badShade=JSON.parse(JSON.stringify(t)),k=badShade.polygons.findIndex(p=>p.every(q=>close(radius(q),11.5)));badShade.materialValues[k]=P.lead;assert.throws(()=>check(badShade),/full rotated spherical normal/);negatives++;
 const q=JSON.parse(JSON.stringify(t)),i=q.beams.findIndex(b=>close(b[2],.8));q.beams[i][0][2]+=.5;assert.throws(()=>check(q),/sixty physical exterior/);negatives++;
}
console.log(JSON.stringify({ok:true,sourceOnly:true,rasterizerExecuted:false,views:4,newPhysicalCurvedSegments:168,negativeControls:negatives}));
