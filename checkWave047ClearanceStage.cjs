'use strict';
// Recording-stub source geometry only; no Canvas or native raster.
const vm=require('vm'),assert=require('assert/strict');
const {U,kit,traces,source}=require('./wave047-geometry-harness.cjs'),{close,hasVertex,polykey,P}=U;
const sandbox={BritishUseScalesKit021:{create:kit},__wave047GeometryOnly:true};vm.runInNewContext(source,sandbox);
const round=q=>close(Math.hypot(q[0]-16,q[1]-22),10.75),centre=(p,z)=>hasVertex(p,[16,22,z]);
const legitimateCheek=p=>[4.5,26.85].some(x=>polykey(p)===polykey([[x,22,.6],[x+.65,22,.6],[x+.65,22,9.4],[x,22,9.4]]));
function check(t){
 for(const z of[.6,1.2]){const f=t.polygons.filter(p=>p.length===3&&p.every(q=>close(q[2],z))&&centre(p,z)&&p.filter(round).length===2);assert.equal(f.length,24,'stage047 complete half-round closed floor at '+z);for(const p of f)assert(p.every(q=>q[1]<=22+1e-8),'stage047 actual room floor behind open arch');}
 const sides=t.polygons.filter(p=>p.length===4&&p.every(round)&&p.some(q=>q[1]<22-1e-8)&&p.some(q=>close(q[2],.6))&&p.some(q=>close(q[2],1.2)));assert.equal(sides.length,24,'stage047 all curved floor edges are real closed solids');
 assert(t.polygons.some(p=>polykey(p)===polykey([[5.25,22,.6],[26.75,22,.6],[26.75,22,1.2],[5.25,22,1.2]])),'stage047 straight floor closure joins forward deck');
 assert(t.polygons.some(p=>polykey(p)===polykey([[5,19,1.2],[27,19,1.2],[27,28,1.2],[5,28,1.2]])),'stage047 complete front deck meets inner floor exactly');
 assert(!t.polygons.some(p=>p.every(q=>close(q[1],22))&&Math.max(...p.map(q=>q[2]))>4.5&&Math.min(...p.map(q=>q[2]))<1.3&&!legitimateCheek(p)),'stage047 no fake arch-mouth closure');
}
let count=0;for(let view=0;view<4;view++){sandbox.BritishWaveArchitecture047.build('vervainrecital',view);const t=traces.at(-1);check(t);
 for(const [find,target]of[[p=>p.length===3&&p.every(q=>close(q[2],1.2))&&centre(p,1.2),/closed floor at 1.2/],[p=>p.length===3&&p.every(q=>close(q[2],.6))&&centre(p,.6),/closed floor at 0.6/],[p=>p.length===4&&p.every(round)&&p.some(q=>q[1]<22-1e-8)&&p.some(q=>close(q[2],.6)),/curved floor edges/],[p=>polykey(p)===polykey([[5,19,1.2],[27,19,1.2],[27,28,1.2],[5,28,1.2]]),/front deck/],[p=>polykey(p)===polykey([[5.25,22,.6],[26.75,22,.6],[26.75,22,1.2],[5.25,22,1.2]]),/straight floor closure/]]){const q=JSON.parse(JSON.stringify(t)),i=q.polygons.findIndex(find);assert(i>=0);q.polygons.splice(i,1);q.materials.splice(i,1);q.materialValues.splice(i,1);assert.throws(()=>check(q),target);check(t);count++;} const bad=JSON.parse(JSON.stringify(t));bad.polygons.push([[6,22,1.2],[26,22,1.2],[26,22,12],[6,22,12]]);assert.throws(()=>check(bad),/no fake arch-mouth closure/);count++;
 const low=JSON.parse(JSON.stringify(t));low.polygons.push([[6,22,1.2],[26,22,1.2],[26,22,5],[6,22,5]]);assert.throws(()=>check(low),/no fake arch-mouth closure/);count++;
 const wide=JSON.parse(JSON.stringify(t)),ci=wide.polygons.findIndex(legitimateCheek);assert(ci>=0);wide.polygons[ci][1][0]+=.3;wide.polygons[ci][2][0]+=.3;assert.throws(()=>check(wide),/no fake arch-mouth closure/);count++;}
console.log(JSON.stringify({ok:true,sourceOnly:true,rasterizerExecuted:false,views:4,negativeControls:count,innerFloorSegments:24}));
