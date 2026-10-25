// GPT-048 original bodies 6–10, with actual plane intersections rather than masks.
function burnetterrace(row,view){
 const A=context(row,view),{S,P}=A,outline=[[4,4],[28,4],[28,28],[20,28],[20,17],[12,17],[12,28],[4,28]];
 const ff=polygonWalls048(A,outline,.6,8.6,'stone');flatPlan048(A,outline,9,P.lead);flatPlan048(A,outline,8.6,P.woodR);for(let i=0;i<outline.length;i++)fascia(A,[...outline[i],9],[...outline[(i+1)%outline.length],9]);
 const upper=A.volume(7,25,4,12,9,23,'brick',false);gableBodyRoof(A,7,25,4,12,23.4,6.6,'x','brick');solidDoor(A,upper.front,7.5,9,3,7);A.windows(upper.back,1,3,12,0,3,6,'rect');A.windows(upper.left,1,1,12,0,3,6,'rect');A.windows(upper.right,1,1,12,0,3,6,'rect');
 for(let i=0;i<14;i++){const y0=17+12*i/14,y1=17+12*(i+1)/14,z=9-8.4*i/14;S.box(12,20,y0,y1,.6,z,P.stone,P.stoneR,P.stoneHi);}
 // Stair rises toward decreasing y; no parapet crosses its actual landing.
 for(const [x0,x1,y0,y1]of[[4,7,4,4.5],[25,28,4,4.5],[4,4.5,4,28],[27.5,28,4,28],[4,12,27.5,28],[20,28,27.5,28],[11.5,12,17,28],[20,20.5,17,28]])S.box(x0,x1,y0,y1,9,10.5,P.stone,P.stoneR,P.stoneHi);
 for(const F of[ff[2],ff[6]])solidDoor(A,F,2.5,.6,3,6);A.windows(ff[1],1,3,2.5,0,3.5,3.6,'ribbon');A.windows(ff[7],1,3,2.5,0,3.5,3.6,'ribbon');
 return finish048(A,{wideExternalStairHighAtY17:true,realTerraceZ9:true,groundedOccupiedBase:true});
}
function figwortcolour(row,view){
 const A=context(row,view),{S,P}=A,triangles=[{q:[[3,13],[11,13],[7,25]],z:8.5,apex:[7,16,13]},{q:[[12,13],[20,13],[16,29]],z:10,apex:[16,17,16]},{q:[[21,13],[29,13],[25,25]],z:8.5,apex:[25,16,13]}];
 const back={back:face(A,[29,5],[3,5],0,-1),left:face(A,[3,5],[3,13],-1,0),right:face(A,[29,13],[29,5],1,0)};
 for(const F of Object.values(back))F.panel(0,F.length,.6,18,A.mat('brick',F.nx,F.ny));
 for(const [x0,x1,z0]of[[3,11,8.5],[11,12,.6],[12,20,10],[20,21,.6],[21,29,8.5]])S.wall([x0,13],[x1,13],z0,18,A.mat('brick',0,1));
 for(const t of triangles){const F=edgeFace(A,t.q[1],t.q[2]),G=edgeFace(A,t.q[2],t.q[0]);for(const f of[F,G]){f.panel(0,f.length,.6,t.z,A.mat('brick',f.nx,f.ny));A.pane(f,2.1,2.5,Math.min(5,f.length-4),3.8,'mullion',true);}triangleHip(A,t.q,t.z+.4,t.apex);}
 gableBodyRoof(A,3,29,5,13,18.4,6.6,'x','brick');A.windows(back.back,1,4,8,0,3.5,5,'rect');solidDoor(A,back.left,2,.6,3,6.5);
 return finish048(A,{threeRealTriangularRooms:true,fullOneUnitRootGaps:true,highBackingGallery:true});
}
function damewortcruck(row,view){
 const A=context(row,view),{S,P}=A,q=Array.from({length:6},(_,i)=>[16+13*Math.cos(i*Math.PI/3),16+13*Math.sin(i*Math.PI/3)]),centre=[16,16,27];
 polygonWalls048(A,q,.6,3,'stone');
 for(let i=0;i<6;i++){const a=[...q[i],3.4],b=[...q[(i+1)%6],3.4],F=edgeFace(A,q[i],q[(i+1)%6]);
  if(i%2===0){const mid=[(a[0]+b[0])/2,(a[1]+b[1])/2,27];roofSheet(A,[a,mid,centre]);roofSheet(A,[mid,b,centre]);
   const wall=[[a[0],a[1],3],[b[0],b[1],3],[mid[0],mid[1],26.6]];glassFace048(A,wall,[F.nx,F.ny,0],true);fascia(A,a,mid);fascia(A,mid,b);S.beam(mid,centre,P.lead,.35);
   for(const t of[.25,.5,.75]){const z=3+(26.6-3)*(1-Math.abs(t*2-1));S.beam(F.point(F.length*t,.23,3),F.point(F.length*t,.23,z),P.woodD,.38);}
   if(i===0||i===4)solidDoor(A,F,F.length/2-1.6,.6,3.2,6.5);else A.pane(F,F.length/2-2,4,4,6,'mullion',true);
  }else{roofSheet(A,[a,b,centre]);fascia(A,a,b);}
 }
 return finish048(A,{singleLowHexagonalEnclosure:true,threeFullWidthGableEnds:true,nineClosedRoofPlanes:true});
}
function pimpernelcross(row,view){
 const A=context(row,view),{S,P}=A,rooms=[orientedRect(16,16,0,-13,11,3.5),orientedRect(16,16,Math.PI/3,-10,13,3.5)],extents=[[-13,11],[-10,13]],h=3.5;
 const coords=(R,p)=>[(p[0]-16)*R.ux+(p[1]-16)*R.uy,(p[0]-16)*R.vx+(p[1]-16)*R.vy];
 const edges=(R,lim)=>[p=>coords(R,p)[0]-lim[0],p=>lim[1]-coords(R,p)[0],p=>coords(R,p)[1]+h,p=>h-coords(R,p)[1]];
 const z=(R,p)=>28-10*Math.abs(coords(R,p)[1])/h;
 const boundary=[];
 rooms.forEach((R,i)=>{const O=rooms[1-i],ee=edges(O,extents[1-i]);
  // Four explicit combinations of roof slopes cover only the higher surface.
  for(const sign of[-1,1]){
   const own=clip048(R.points,p=>coords(R,p)[1]*sign),cut=cutConvex048(own,ee),parts=cut.out;
   for(const os of[-1,1]){let overlap=clip048(cut.inside,p=>coords(O,p)[1]*os);overlap=clip048(overlap,p=>z(R,p)-z(O,p));if(overlap.length>=3)parts.push(overlap);}
   for(const q of parts)if(Math.abs(q.reduce((s,p,j)=>s+p[0]*q[(j+1)%q.length][1]-p[1]*q[(j+1)%q.length][0],0))>1e-7)roofSheet(A,q.map(p=>[...p,z(R,p)+.4]));
  }
  // Exact segment splitting at the other footprint boundary retains only the
  // outer union walls. No full wall continues through the occupied crossing.
  R.points.forEach((a,j)=>{const b=R.points[(j+1)%4],ts=[0,1];for(const fn of ee){const fa=fn(a),fb=fn(b);if(fa*fb<0)ts.push(fa/(fa-fb));}ts.sort((a,b)=>a-b);
   for(let k=0;k<ts.length-1;k++){const lo=ts[k],hi=ts[k+1],at=t=>a.map((v,j)=>v+t*(b[j]-v)),mid=at((lo+hi)/2);if(ee.every(fn=>fn(mid)>-1e-8))continue;const x=at(lo),y=at(hi),F=edgeFace(A,x,y),split=[0,1],va=coords(R,x)[1],vb=coords(R,y)[1];if(va*vb<0)split.splice(1,0,va/(va-vb));
    for(let s=0;s<split.length-1;s++){const u=split[s],v=split[s+1],p=x.map((a,j)=>a+u*(y[j]-a)),q=x.map((a,j)=>a+v*(y[j]-a));S.poly([[...p,.6],[...q,.6],[...q,z(R,q)],[...p,z(R,p)]],A.mat('brick',F.nx,F.ny));fascia(A,[...p,z(R,p)+.4],[...q,z(R,q)+.4]);}
    boundary.push({F,room:i,edge:j});
   }
  });
  const floor=i===0?[R.points]:cutConvex048(R.points,edges(rooms[0],extents[0])).out;for(const q of floor)flatPlan048(A,q,.6,P.stoneR);
 });
 // Complete exposed end gables, plus actual side windows clear of the junction.
 for(const b of boundary){const {F,room,edge}=b;if(F.length<2.8)continue;if(edge===1||edge===3){if((room===0&&edge===1)||(room===1&&edge===3))solidDoor(A,F,F.length/2-1.5,.6,3,7);else A.pane(F,F.length/2-1.8,3,3.6,5,'mullion',true);A.pane(F,F.length/2-1.25,15,2.5,5,'pointed',true);}else if(F.length>4.5)A.pane(F,(F.length-2.5)/2,5,2.5,5,'rect',true);}
 return finish048(A,{trueSixtyDegreeFourArmUnion:true,roofUpperEnvelopeClipped:true,internalCrossingWallsRemoved:true});
}
function fumitorygin(row,view){
 const A=context(row,view),{S,P}=A,cx=21.5,cy=16,r=8,join=cx-r*Math.cos(Math.PI/8),lo=cy-r*Math.sin(Math.PI/8),hi=cy+r*Math.sin(Math.PI/8),q=Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
 const barn=A.volume(3,join,4,28,.6,17,'brick',false);gableBodyRoof(A,3,join,4,28,17.4,7.6,'y','brick');solidDoor(A,barn.front,3,.6,4,7);A.windows(barn.left,1,4,8,0,2.5,4,'rect');A.windows(barn.back,1,2,5,0,2.6,4,'rect');
 const apex=[cx,cy,11.8];
 for(let i=0;i<8;i++){const a=q[i],b=q[(i+1)%8],shared=Math.abs(a[0]-join)<1e-7&&Math.abs(b[0]-join)<1e-7;
  roofSheet(A,[[...a,8.4],[...b,8.4],apex]);if(!shared)fascia(A,[...a,8.4],[...b,8.4]);
  if(Math.abs(a[0]-join)>1e-7)S.box(a[0]-.3,a[0]+.3,a[1]-.3,a[1]+.3,.6,8,P.wood,P.woodR,P.woodHi);
  if(!shared){S.beam([...a,7.85],[...b,7.85],P.woodD,.45);const p=a.map((v,j)=>v+(b[j]-v)*.28);S.beam([...a,5.5],[...p,7.85],P.woodR,.35);}
 }
 // One exact barn interface, no second shelter wall. Door meets the common floor.
 const shared=face(A,[join,hi],[join,lo],1,0);solidDoor(A,shared,(hi-lo-3)/2,.6,3,6);flatPlan048(A,q,.6,P.stoneR);
 return finish048(A,{lowOpenOctagonSevenOuterFacets:true,finiteExactSharedBarnFacet:true,joinX:join});
}
