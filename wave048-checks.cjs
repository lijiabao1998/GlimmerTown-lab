'use strict';
// Independent frozen-card coordinate constructions; recording-stub geometry only.
module.exports=function(U){
const {assert,P,close,key,polykey,minz,maxz,area,vertices,hasVertex,materialPolygons,isPoly,wallQ,requireWall,cast,heightsAt,assertPartition}=U;
const checks={},mutations=[];
function need(t,q,label){assert(isPoly(t,q),label);}
function remove(t,p){const i=t.polygons.indexOf(p);assert(i>=0);for(const k of['polygons','materials','materialValues'])t[k].splice(i,1);}
function add(t,q,m=P.stone){t.polygons.push(q);t.materials.push('solid');t.materialValues.push(m);}
function walls(id,specs){checks[id]=t=>{for(const [a,b,z0,z1,label]of specs)requireWall(t,a,b,z0,z1,label);};for(const [a,b,z0,z1,label]of specs.slice(0,3))mutations.push({id,name:'remove-'+label,pattern:new RegExp(label),mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ(a,b,z0,z1))))});}
walls('foxglovecharter',[[[28,22],[21,22],.6,9,'Foxglove grounded right end'],[[28,25],[21,25],9,20,'Foxglove projected right end'],[[21,21],[11,21],9,20,'Foxglove recessed central upper hall']]);
walls('maddartutors',[[[3,3],[14,3],.6,14,'Madder northwest high room'],[[18,3],[29,3],.6,18,'Madder northeast high room'],[[29,29],[18,29],.6,16,'Madder southeast high room']]);
walls('betonymarionette',[[[4,4],[4,13],.6,24,'Betony high rear occupied range'],[[7,13],[7,22],.6,16,'Betony middle occupied range'],[[10,22],[10,29],.6,10,'Betony low front occupied range']]);
walls('burnetterrace',[[[4,4],[28,4],.6,8.6,'Burnet occupied low base'],[[7,12],[25,12],9,23,'Burnet upper terrace entrance'],[[20,17],[12,17],.6,8.6,'Burnet real staircase recess']]);
walls('figwortcolour',[[[29,5],[3,5],.6,18,'Figwort high rear gallery'],[[11,13],[7,25],.6,8.5,'Figwort left triangular room'],[[20,13],[16,29],.6,10,'Figwort centre triangular room']]);
const join=21.5-8*Math.cos(Math.PI/8);
walls('fumitorygin',[[[3,28],[join,28],.6,17,'Fumitory complete high barn'],[[join,28],[join,4],.6,17,'Fumitory one exact interface wall'],[[3,4],[3,28],.6,17,'Fumitory long occupied side']]);
function exact(id,specs){checks[id]=t=>{for(const [q,label]of specs)need(t,q,label);};for(const [q,label]of specs.slice(0,3))mutations.push({id,name:'remove-'+label,pattern:new RegExp(label),mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(q)))});}
exact('restharrowsalt',[
 [[[4,5,.6],[4,28,.6],[10,28,19],[10,5,19]],'Restharrow actual left battered plane'],
 [[[28,5,.6],[28,28,.6],[22,28,19],[22,5,19]],'Restharrow actual right battered plane'],
 [[[4,28,.6],[28,28,.6],[22,28,19],[10,28,19]],'Restharrow complete trapezoid end']]);
const hx=Array.from({length:6},(_,i)=>[16+13*Math.cos(i*Math.PI/3),16+13*Math.sin(i*Math.PI/3)]);
exact('damewortcruck',[0,2,4].map(i=>[[[...hx[i],3],[...hx[(i+1)%6],3],[(hx[i][0]+hx[(i+1)%6][0])/2,(hx[i][1]+hx[(i+1)%6][1])/2,26.6]],'Damewort actual full gable '+i]));
const sj=6+6.1*11.5/24.6;
exact('silverweedalpine',[
 [[[28,6,2.4],[28,29,2.4],[16.5,17.5,27]],'Silverweed east sloped glazing backing'],
 [[[28,29,2.4],[5,29,2.4],[16.5,17.5,27]],'Silverweed rear sloped glazing backing'],
 [[[13,2,.6],[13,sj,.6],[13,sj,8.1],[13,2,8.1]],'Silverweed finite vestibule side']]);
// Every section below reads actual polygons, not model detail flags.
function extend(id,fn){const base=checks[id];checks[id]=t=>{base(t);fn(t);};}
extend('foxglovecharter',t=>{for(const[x0,x1]of[[4,11],[21,28]])need(t,[[x0,22,9],[x1,22,9],[x1,25,9],[x0,25,9]],'Foxglove closed actual jetty underside');assert(cast(t,1,16,12).filter(y=>y>20&&y<26).every(y=>y<21.5),'Foxglove centre recess not filled to end plane');});
extend('silverweedalpine',t=>{const roof=t.polygons.filter((p,i)=>[P.wood,P.woodR].includes(t.materialValues[i])&&maxz(p)>20&&p.every(v=>v[1]<=17.500001));assert(heightsAt({polygons:roof},16.5,7).length===0,'Silverweed actual pyramid mouth cut out');assert(heightsAt({polygons:roof},16.5,10).some(z=>z>8.5),'Silverweed roof continues beyond exact entry join');});
extend('maddartutors',t=>{assert(heightsAt(t,16,16).some(z=>close(z,8.5)),'Madder cross is occupied not a court');assert(!heightsAt(t,16,16).some(z=>z>8.500001),'Madder central connector stays low');});
extend('restharrowsalt',t=>{assert(cast(t,0,16,10).some(x=>close(x,4+6*9.4/18.4)),'Restharrow real wall batter at midheight');});
extend('betonymarionette',t=>{for(const y of[13,22])assert(cast(t,1,16,5).every(v=>!close(v,y)),'Betony no internal front blocking lower room');});
extend('burnetterrace',t=>{for(let i=0;i<14;i++){const y=17+12*(i+.5)/14,z=9-8.4*i/14;assert(heightsAt(t,16,y).some(v=>close(v,z)),'Burnet all fourteen actual descending treads');}assert(!cast(t,1,16,9.5).some(y=>close(y,17)),'Burnet landing is not parapet blocked');});
extend('figwortcolour',t=>{for(const x of[11.5,20.5])assert(heightsAt(t,x,13.5).every(z=>z<.61),'Figwort one-unit root gaps truly empty');});
extend('damewortcruck',t=>{const r=materialPolygons(t,'slate');assert.equal(r.length,9,'Damewort nine actual roof planes');assertPartition(r.map(q=>q.map(v=>v.slice(0,2))),'Damewort');});
extend('fumitorygin',t=>{const low=materialPolygons(t,'slate').filter(p=>maxz(p)<12);assert.equal(low.length,8,'Fumitory eight low roof facets');assert(close(low.reduce((a,p)=>a+Math.abs(area(p)),0),128*Math.SQRT2),'Fumitory exact octagonal roof area');assert(cast(t,0,16,4).filter(x=>x>join+.5).length===0,'Fumitory low shelter not closed by a drum wall');});
// Pimpernel is independently reconstructed from first-card lengths/angle.
function crossRoof(t){
 const roofs=materialPolygons(t,'slate'),s=Math.sqrt(3)/2;
 assert(roofs.length>=8,'Pimpernel complete clipped roof patches');
 assertPartition(roofs.map(p=>p.map(v=>v.slice(0,2))),'Pimpernel roof upper-envelope partition');
 const total=roofs.reduce((a,p)=>a+Math.abs(area(p)),0),expected=47*7-49/s;
 assert(close(total,expected),'Pimpernel exact union area without gaps or duplication');
 const co=(p,i)=>i?[(p[0]-16)/2+(p[1]-16)*s,-(p[0]-16)*s+(p[1]-16)/2]:[p[0]-16,p[1]-16];
 const present=(p,i)=>{const[u,v]=co(p,i);return u>=(i?-10:-13)-1e-7&&u<=(i?13:11)+1e-7&&Math.abs(v)<=3.5+1e-7;};
 for(const q of roofs){for(const p of[...q,q.reduce((a,p)=>a.map((v,j)=>v+p[j]/q.length),[0,0,0])]){const zs=[0,1].filter(i=>present(p,i)).map(i=>28.4-10*Math.abs(co(p,i)[1])/3.5);assert(zs.length&&close(p[2],Math.max(...zs)),'Pimpernel every facet on exact upper envelope');}assert(t.polygons.some(p=>polykey(p)===polykey(q.map(v=>[v[0],v[1],v[2]-.4]))),'Pimpernel exact roof underside');}
 // Subdivide all collinear edges at every vertex to handle legitimate T junctions.
 const vv=roofs.flat(),edges=new Map();for(const q of roofs)for(let j=0;j<q.length;j++){
  const a=q[j],b=q[(j+1)%q.length],d=b.map((v,k)=>v-a[k]),dd=d.reduce((s,v)=>s+v*v,0);if(dd<1e-16)continue;
  const ts=[0,1];for(const p of vv){const u=p.reduce((s,v,k)=>s+(v-a[k])*d[k],0)/dd;if(u>1e-8&&u<1-1e-8&&Math.hypot(...p.map((v,k)=>v-a[k]-u*d[k]))<1e-7)ts.push(u);}ts.sort((a,b)=>a-b);
  for(let k=0;k<ts.length-1;k++){if(ts[k+1]-ts[k]<1e-8)continue;const aa=a.map((v,j)=>v+ts[k]*d[j]),bb=a.map((v,j)=>v+ts[k+1]*d[j]),h=[key(aa),key(bb)].sort().join('|');const e=edges.get(h)||{a:aa,b:bb,n:0};e.n++;edges.set(h,e);}
 }
 for(const e of edges.values()){assert(e.n<=2,'Pimpernel no duplicate seam');if(e.n===1){const mid=e.a.map((v,j)=>(v+e.b[j])/2);assert([0,1].some(i=>{const[u,v]=co(mid,i);return present(mid,i)&&(close(Math.abs(v),3.5)||close(u,i?-10:-13)||close(u,i?13:11));}),'Pimpernel no unclosed internal valley');assert(t.polygons.some((q,i)=>t.materialValues[i]===P.lead&&[e.a,e.b,e.a.map((v,j)=>j===2?v-.4:v),e.b.map((v,j)=>j===2?v-.4:v)].every(p=>U.pointOnPoly(p,q))),'Pimpernel exact outer roof fascia closes thickness');}}
 assert(cast(t,0,16,5).every(x=>x<3.01||x>26.99),'Pimpernel no wall inside occupied crossing');
}
checks.pimpernelcross=crossRoof;
mutations.push(
 {id:'pimpernelcross',name:'remove-real-roof-patch',pattern:/union area/,mutate:t=>remove(t,materialPolygons(t,'slate')[0])},
 {id:'pimpernelcross',name:'duplicate-real-roof-patch',pattern:/must not overlap/,mutate:t=>{const p=materialPolygons(t,'slate')[0];t.polygons.push(JSON.parse(JSON.stringify(p)));t.materials.push('slate');t.materialValues.push(null);}},
 {id:'pimpernelcross',name:'restore-internal-crossing-wall',pattern:/wall inside/,mutate:t=>add(t,[[16,12,.6],[16,20,.6],[16,20,18],[16,12,18]])},
 {id:'pimpernelcross',name:'open-boundary-roof-thickness',pattern:/outer roof fascia/,mutate:t=>remove(t,t.polygons.find((p,i)=>t.materialValues[i]===P.lead&&minz(p)>=17.9))},
 {id:'pimpernelcross',name:'lift-valley-vertex',pattern:/upper envelope/,mutate:t=>{materialPolygons(t,'slate')[0][0][2]+=.3;}}
);
return{checks,mutations};
};
