// GPT-047 new world-space bodies 1–5. No previous model body is called.
function spindlefruit(row,view){
  const A=context(row,view),{S,P}=A;
  const lodge=A.volume(23,30,6,27,.6,14.6,'brick');gableBodyRoof(A,22.5,30.5,5.5,27.5,14.6,5.8,'y','brick');
  solidDoor(A,lodge.front,1.5,.7,3.1,5.8);A.windows(lodge.right,2,3,3.2,6.1,2.2,3.4,'mullion');A.windows(lodge.left,1,2,7.5,0,2.4,3.8,'rect');
  const line=[];for(let i=0;i<=28;i++){const x=2+21*i/28;line.push([x,14+4*Math.sin((x-2)*Math.PI*2/21)]);}
  // Two real faces and a solid coping, not a thin drawn S-line.
  for(let i=0;i<line.length-1;i++){
    const a=line[i],b=line[i+1],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy),ox=-dy/n*.55,oy=dx/n*.55;
    planBlock(A,[[a[0]+ox,a[1]+oy],[b[0]+ox,b[1]+oy],[b[0]-ox,b[1]-oy],[a[0]-ox,a[1]-oy]],.6,10.6,'brick',P.stoneHi);
    S.beam([a[0],a[1],10.9],[b[0],b[1],10.9],P.stoneHi,.75);
  }
  // One planar lean-to over the second bay; its clipped back follows the actual wall.
  const edge=line.slice(14).map(p=>[p[0],p[1]+.58]);const outline=[...edge,[23,22],[12.5,22]];
  roofShell(A,outline.map(p=>[p[0],p[1],10.5-(p[1]-10)*.19]),.45);
  for(const x of[13.2,22.2])A.volume(x-.45,x+.45,21.2,22,.6,8.45,'wood');
  S.beam([12.5,21.6,8.5],[23,21.6,8.5],P.woodR,.6);
  // The other bay intentionally stays open to the sky; no common floor/roof fills it.
  return {...A.finish(),details:{originalDesign:true,newModelBody:true,thickSerpentineWall:true,onePlanarBayShelter:true}};
}
function agrimonypattern(row,view){
  const A=context(row,view),{S,P}=A;
  // Eight real piers, a continuous upper ring, and an open central court.
  for(const [x,y] of [[5,4],[15,4],[25,4],[5,14],[25,14],[5,24],[15,24],[25,24]])A.volume(x,x+2,y,y+2,.6,8.4,'stone');
  const strips=[[5,27,4,9],[5,27,21,26],[5,10,9,21],[22,27,9,21]];
  for(const [x0,x1,y0,y1]of strips){
    A.volume(x0,x1,y0,y1,8,8.7,'stone');
    const f=A.volume(x0,x1,y0,y1,8.7,17.3,'brick');
    S.flat(x0,x1,y0,y1,8,P.stoneR);
    shell(A,[[x0,y0,17.7],[x1,y0,17.7],[x1,y1,17.7],[x0,y1,17.7]],P.lead,.4);
    for(const F of[f.front,f.back,f.left,f.right])if(F.length>=10)A.windows(F,1,Math.floor(F.length/5),11.2,0,2.1,3.3,'rect');
  }
  // Low outer and inner parapets preserve the complete sky opening.
  for(const [x0,x1,y0,y1] of [[5,27,4,4.5],[5,27,25.5,26],[5,5.5,4.5,25.5],[26.5,27,4.5,25.5],[9.5,22.5,8.5,9],[9.5,22.5,21,21.5],[9.5,10,9,21],[22,22.5,9,21]])A.volume(x0,x1,y0,y1,17.7,18.6,'stone');
  // One exterior stair leaves the other three lower sides wholly unoccupied.
  for(let i=0;i<13;i++)A.volume(1,4.8,27-i*1.3,28.3-i*1.3,.6,.6+(i+1)*8.1/13,'stone');
  A.volume(1,5,9.4,12.7,8.1,8.7,'stone');
  const west=face(A,[5,21],[5,9],-1,0);solidDoor(A,west,9,8.7,2.2,5.6);
  return {...A.finish(),details:{originalDesign:true,newModelBody:true,entireGroundTierOpen:true,skyCourt:true}};
}
function hopdrying(row,view){
  const A=context(row,view),{S,P}=A;
  // The kiln overlaps the sorting range by a finite chord; no zero-width tangent joint.
  const f=A.volume(3,16,5,28,.6,16.6,'brick');gableBodyRoof(A,2.5,16.5,4.5,28.5,16.6,6.2,'y','brick');
  A.windows(f.left,2,4,3,6.9,2.4,3.8,'rect');A.windows(f.front,1,3,10,0,2.3,3.8,'rect');solidDoor(A,f.front,3,.7,6,6.5);
  const faces=A.polygon(21,11,7.7,.6,23,28,'brick',0);A.cone(21,11,8.1,0,23,36.2,28,'slate');
  for(const i of[0,3,5,7,9,11,13,15,17,19,21,23,25,27]){
    const F=faces[i],mid=F.point(F.length/2,0,0);
    if(mid[0]>16.3||mid[1]<4.7)A.pane(F,(F.length-1.1)/2,7.2,1.1,3.6,'rect',true);
  }
  // A real upper loading landing and simple external stair on the west long wall.
  for(let i=0;i<9;i++)A.volume(.7,2.7,25-i*1.5,26.5-i*1.5,.6,.6+(i+1)*8/9,'stone');
  A.volume(.7,3,11.3,14.5,.6,8.6,'stone');solidDoor(A,f.left,6.5,8.6,2.2,5.4);
  return {...A.finish(),details:{originalDesign:true,newModelBody:true,oneKilnFiniteChordJoin:true}};
}
function tansymill(row,view){
  const A=context(row,view),{S,P}=A;
  // One central post with grounded crossed trestles, not a filled raised plinth.
  A.volume(13.8,16.2,13.8,16.2,.6,13,'wood');
  for(const [x,y]of[[5.5,5.5],[24.5,5.5],[5.5,24.5],[24.5,24.5]]){
    A.volume(x-1,x+1,y-1,y+1,.6,1.6,'stone');
    S.beam([x,y,1.6],[15,15,11.8],P.woodR,1.35);
  }
  S.beam([5.5,5.5,1.6],[24.5,24.5,1.6],P.wood,1.2);S.beam([24.5,5.5,1.6],[5.5,24.5,1.6],P.wood,1.2);
  const f=A.volume(7,23,7,23,12.5,23.8,'wood');S.flat(7,23,7,23,12.5,P.woodR);gableBodyRoof(A,6.5,23.5,6.5,23.5,23.8,6.2,'y','wood');
  A.windows(f.left,1,2,17,0,2.7,3.7,'rect');A.windows(f.back,1,1,17.4,0,3,3.7,'rect');
  // Tail porch is carried by substantial braces; the stair reaches exactly its floor.
  A.volume(23,28,16,21,12.1,12.7,'wood');S.flat(23,28,16,21,12.1,P.woodR);
  S.beam([16.2,16.2,8.5],[27,20,12.1],P.woodR,.9);
  for(let i=0;i<15;i++)A.volume(24,28,30-(i+1)*.65,30-i*.65,.6,.6+(i+1)*12.1/15,'wood');
  solidDoor(A,f.right,2.5,12.7,3,6);S.beam([28,20,13],[28,30,1.3],P.wood,.35);
  // Static crossed lattice sails on the front, not wind/power simulation.
  const centre=[15,24.2,23.4];for(const [dx,dz]of[[1,1],[-1,1],[1,-1],[-1,-1]]){
    const end=[15+dx*9,24.2,23.4+dz*9];S.beam(centre,end,P.woodR,.55);
    for(let i=3;i<=8;i+=1.5){const x=15+dx*i,z=23.4+dz*i;S.beam([x-.7,24.2,z+.7],[x+.7,24.2,z-.7],P.wood,.17);}
  }
  return {...A.finish(),details:{originalDesign:true,newModelBody:true,singlePostDiagonalTrestle:true,staticSailsOnly:true}};
}
function vervainrecital(row,view){
  const A=context(row,view),{S,P}=A,cx=16,cy=22,zc=4.4,r=11.5,inner=10.85,n=24,m=12;
  // The half hemisphere curves in BOTH principal axes. Two radial skins plus
  // cut-rim and spring closures make a thick shell around a genuinely empty room.
  const pt=(rad,i,j)=>{const theta=i*Math.PI/(2*m),phi=j*Math.PI/n;return[cx+rad*Math.sin(theta)*Math.cos(phi),cy-rad*Math.sin(theta)*Math.sin(phi),zc+rad*Math.cos(theta)];};
  for(let i=0;i<m;i++)for(let j=0;j<n;j++){
    const out=i===0?[pt(r,0,j),pt(r,1,j),pt(r,1,j+1)]:[pt(r,i,j),pt(r,i+1,j),pt(r,i+1,j+1),pt(r,i,j+1)];
    const ins=i===0?[pt(inner,0,j),pt(inner,1,j+1),pt(inner,1,j)]:[pt(inner,i,j),pt(inner,i,j+1),pt(inner,i+1,j+1),pt(inner,i+1,j)];
    S.poly(out,A.dark(Math.cos((j+.5)*Math.PI/n),-Math.sin((j+.5)*Math.PI/n))?P.lead:P.slateHi);S.poly(ins,P.stoneR);
  }
  for(const j of[0,n])for(let i=0;i<m;i++)S.poly([pt(r,i,j),pt(r,i+1,j),pt(inner,i+1,j),pt(inner,i,j)],P.stoneHi);
  for(let j=0;j<n;j++){
    const a=pt(r,m,j),b=pt(r,m,j+1),ia=pt(inner,m,j),ib=pt(inner,m,j+1);
    S.poly([a,b,ib,ia],P.stoneR);
    S.wall(a.slice(0,2),b.slice(0,2),.6,zc,A.mat('stone',Math.cos((j+.5)*Math.PI/n),-Math.sin((j+.5)*Math.PI/n)));
    S.wall(ib.slice(0,2),ia.slice(0,2),.6,zc,P.stoneR);
    S.poly([[...a.slice(0,2),.6],[...b.slice(0,2),.6],[...ib.slice(0,2),.6],[...ia.slice(0,2),.6]],P.stoneR);
  }
  for(const x of[cx-r,cx+inner])A.volume(x,x+(r-inner),cy-.65,cy,.6,zc,'stone');
  A.volume(5,27,19,28,.6,1.2,'stone');
  // Small front stair and real stage; no dark disc across the open arch.
  A.volume(7,25,28,30,.6,.9,'stone');
  return {...A.finish(),details:{originalDesign:true,newModelBody:true,radiallyThickHalfDome:true,openDeepInterior:true}};
}
