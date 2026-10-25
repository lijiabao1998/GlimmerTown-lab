// New candidate-only planar solid construction helpers. No renderer changes.
function clip048(poly,fn,positive=true){
  if(!poly.length)return[];const out=[],sign=positive?1:-1;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a)*sign,db=fn(b)*sign,ia=da>=-1e-9,ib=db>=-1e-9;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}
  return out.filter((p,i)=>!i||Math.hypot(...p.map((v,j)=>v-out[i-1][j]))>1e-8);
}
function cutConvex048(poly,edges){let inside=poly,out=[];for(const fn of edges){const q=clip048(inside,fn,false);if(q.length>=3)out.push(q);inside=clip048(inside,fn,true);if(inside.length<3)break;}return{inside,out};}
function rect048(x0,x1,y0,y1){return[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];}
function rectEdges048(x0,x1,y0,y1){return[p=>p[0]-x0,p=>x1-p[0],p=>p[1]-y0,p=>y1-p[1]];}
function polygonWalls048(A,q,z0,z1,kind){const faces=[];for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],F=edgeFace(A,a,b);A.S.wall(a,b,z0,z1,A.mat(kind,F.nx,F.ny));faces.push(F);}return faces;}
function flatPlan048(A,q,z,m){for(const t of triangulatePlan(q.map(p=>[...p,z])))A.S.poly(t,m);}
function glassFace048(A,q,normal,lit=true){
 const {S,P}=A,c=q.reduce((a,p)=>a.map((v,j)=>v+p[j]/q.length),[0,0,0]),len=Math.hypot(...normal),n=normal.map(v=>v/len),inner=q.map(p=>p.map((v,j)=>c[j]+(v-c[j])*.87+n[j]*.12));
 S.poly(q,A.dark(n[0],n[1])?P.woodR:P.wood);const glass=A.dark(n[0],n[1])?P.glassR:P.glass;S.poly(inner,lit?[glass,P.warm]:glass);
 for(let i=0;i<q.length;i++)S.beam(q[i],q[(i+1)%q.length],P.frame,.24);
}
function wallWithOpening048(A,a,b,z0,z1,kind,open0,open1,openTop){
 const F=edgeFace(A,a,b);if(open0===undefined){A.S.wall(a,b,z0,z1,A.mat(kind,F.nx,F.ny));return F;}
 for(const [lo,hi,bottom,top]of[[0,open0,z0,z1],[open1,F.length,z0,z1],[open0,open1,openTop,z1]])if(hi>lo+1e-8&&top>bottom+1e-8)F.panel(lo,hi,bottom,top,A.mat(kind,F.nx,F.ny));return F;
}
function finish048(A,details){return{...A.finish(),details:{originalDesign:true,newModelBody:true,...details}};}
