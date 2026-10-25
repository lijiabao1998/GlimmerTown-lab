// GPT-048 original bodies 1–5; authored after frozen card002f14fc.
function foxglovecharter(row,view){
 const A=context(row,view),{S,P}=A;
 const low=[[4,8],[28,8],[28,22],[21,22],[21,21],[11,21],[11,22],[4,22]],up=[[4,8],[28,8],[28,25],[21,25],[21,21],[11,21],[11,25],[4,25]];
 const lf=polygonWalls048(A,low,.6,9,'stone'),uf=polygonWalls048(A,up,9,20,'whiteplaster');
 for(const [x0,x1]of[[4,11],[21,28]]){S.flat(x0,x1,22,25,9,P.woodR);S.beam([x0,25,9],[x1,25,9],P.woodD,.55);for(const x of[x0+.8,x1-.8])S.beam([x,22,7],[x,24.7,9],P.woodD,.5);}
 // One real common hip, closed soffit meets every upper wall head exactly.
 hipRoof(A,3,29,7,26,20,9,true);S.beam([11,25.7,19.6],[21,25.7,19.6],P.woodD,.7);
 const centre=face(A,[11,21],[21,21],0,1);solidDoor(A,centre,.8,.6,3,6.3);A.pane(centre,5,3,3.7,13,'mullion',true);
 for(const F of[uf[2],uf[6]]){A.pane(F,1.3,12,4.2,5,'mullion',true);for(const u of[.2,F.length-.2])S.beam(F.point(u,.17,9),F.point(u,.17,19.7),P.woodD,.3);F.panel(0,F.length,10,10.35,P.woodD,.18);}
 for(const F of[lf[2],lf[6]])A.pane(F,1.5,2.4,3.8,3.4,'rect',true);
 A.windows(uf[0],1,4,12,0,3.2,4.5,'rect');A.windows(uf[1],1,3,12,0,3,4,'rect');A.windows(uf[7],1,3,12,0,3,4,'rect');solidDoor(A,lf[7],4,.6,3,6);
 return finish048(A,{twoEndJetties:true,fullHeightCentralRecess:true,singleCommonHip:true});
}
function silverweedalpine(row,view){
 const A=context(row,view),{S,P}=A,c=[16.5,17.5,27],q=rect048(5,28,6,29),knee=2.4,join=6+(8.5-knee)*11.5/(27-knee);
 const faces=[];for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4];faces.push(i===0?wallWithOpening048(A,a,b,.6,knee,'stone',8,15,knee):wallWithOpening048(A,a,b,.6,knee,'stone'));}
 for(let i=0;i<4;i++){
  const a=[...q[i],knee],b=[...q[(i+1)%4],knee],tri=[a,b,c],normal=[((a[0]+b[0])/2-c[0])*24.6/11.5,((a[1]+b[1])/2-c[1])*24.6/11.5,11.5];
  const pieces=i===0?cutConvex048(tri,rectEdges048(13,20,2,join)).out:[tri];
  for(const piece of pieces)glassFace048(A,piece,normal,true);
  S.beam(a,c,P.frame,.4);S.beam(a,b,P.stoneHi,.45);
  // Sparse true sloping glazing members, not an upright room under a cap.
  for(const t of[.33,.66])S.beam(a.map((v,j)=>v+(c[j]-v)*t),b.map((v,j)=>v+(c[j]-v)*t),P.frame,.22);
 }
 const front=face(A,[20,2],[13,2],0,-1);S.wall([20,2],[13,2],.6,8.1,A.mat('wood',0,-1));S.wall([13,2],[13,join],.6,8.1,A.mat('wood',-1,0));S.wall([20,join],[20,2],.6,8.1,A.mat('wood',1,0));
 roofShell(A,[[13,2,8.5],[20,2,8.5],[20,join,8.5],[13,join,8.5]]);solidDoor(A,front,2,.6,3,6.6);A.pane(face(A,[13,2],[13,join],-1,0),1.2,2.2,2.8,3.5,'rect',true);
 return finish048(A,{nearGroundFourPlanePyramid:true,finiteClippedVestibule:true,vestibuleJoin:join});
}
function maddartutors(row,view){
 const A=context(row,view),{S,P}=A;
 const rs=[[3,14,3,14,14],[18,29,3,14,18],[3,14,18,29,12],[18,29,18,29,16]],connector=[[14,10],[18,10],[18,14],[22,14],[22,18],[18,18],[18,22],[14,22],[14,18],[10,18],[10,14],[14,14]];
 // Solid cross top and four corner contacts; its end caps are indoor interfaces.
 flatPlan048(A,connector,8.5,P.lead);flatPlan048(A,connector,.6,P.stoneR);
 for(let i=0;i<connector.length;i++){const a=connector[i],b=connector[(i+1)%connector.length],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(rs.some(r=>mid[0]>=r[0]&&mid[0]<=r[1]&&mid[1]>=r[2]&&mid[1]<=r[3]))continue;const F=edgeFace(A,a,b);S.wall(a,b,.6,8.5,A.mat('stone',F.nx,F.ny));}
 rs.forEach((r,j)=>{const[x0,x1,y0,y1,h]=r,plan=rect048(x0,x1,y0,y1),ff=[];for(let i=0;i<4;i++){const a=plan[i],b=plan[(i+1)%4],F=edgeFace(A,a,b),dx=(b[0]-a[0])/F.length,dy=(b[1]-a[1])/F.length;let intervals=[];for(let u=0;u<F.length;u+=.25){const m=[a[0]+dx*(u+.125),a[1]+dy*(u+.125)];const contact=(m[0]>=14&&m[0]<=18&&m[1]>=10&&m[1]<=22)||(m[1]>=14&&m[1]<=18&&m[0]>=10&&m[0]<=22);intervals.push({u,contact});}let start=0;while(start<intervals.length){let end=start+1;while(end<intervals.length&&intervals[end].contact===intervals[start].contact)end++;const z0=intervals[start].contact?8.5:.6;F.panel(start*.25,Math.min(end*.25,F.length),z0,h,A.mat('brick',F.nx,F.ny));start=end;}ff.push(F);}
  const apex=[(x0+x1)/2,(y0+y1)/2,h+5];for(let i=0;i<4;i++)roofSheet(A,[[...plan[i],h+.4],[...plan[(i+1)%4],h+.4],apex]);for(let i=0;i<4;i++)fascia(A,[...plan[i],h+.4],[...plan[(i+1)%4],h+.4]);
  for(const i of[j<2?0:2,j%2?1:3])A.windows(ff[i],1,2,3.2,0,3,4.4,j===2?'ribbon':'rect');if(j===2)solidDoor(A,ff[2],4,.6,3,6);
 });return finish048(A,{fourCornerHips:true,lowSolidCross:true,noCourtyard:true});
}
function restharrowsalt(row,view){
 const A=context(row,view),{S,P}=A,z0=.6,z1=19;
 for(const side of[-1,1]){const xb=side<0?4:28,xt=side<0?10:22,normal=[side,0,6/(z1-z0)];S.poly([[xb,5,z0],[xb,28,z0],[xt,28,z1],[xt,5,z1]],A.mat('stone',side,0));
  for(const yc of[10,17,24]){const pts=[[yc-1.6,7],[yc+1.6,7],[yc+1.6,11],[yc-1.6,11]].map(([y,z])=>[xb+(xt-xb)*(z-z0)/(z1-z0)+side*.08,y,z]);glassFace048(A,pts,normal,true);}}
 for(const y of[5,28])S.poly([[4,y,z0],[28,y,z0],[22,y,z1],[10,y,z1]],A.mat('stone',0,y===5?-1:1));
 roofShell(A,[[10,5,19.4],[22,5,19.4],[22,28,19.4],[10,28,19.4]]);const F=face(A,[4,28],[28,28],0,1);solidDoor(A,F,9,.6,6,8);louver(A,F,10.5,12,3,3.5);louver(A,face(A,[28,5],[4,5],0,-1),10.5,12,3,3.5);
 return finish048(A,{trueBatteredSidePlanes:true,closedTrapezoidEnds:true,narrowFlatRoof:true});
}
function betonymarionette(row,view){
 const A=context(row,view),{S,P}=A,rs=[[4,28,4,13,24,33],[7,25,13,22,16,24],[10,22,22,29,10,16]];
 rs.forEach((r,i)=>{const[x0,x1,y0,y1,h,ridge]=r,F={front:face(A,[x0,y1],[x1,y1],0,1),back:face(A,[x1,y0],[x0,y0],0,-1),left:face(A,[x0,y0],[x0,y1],-1,0),right:face(A,[x1,y1],[x1,y0],1,0)};
  for(const f of[F.left,F.right])f.panel(0,f.length,.6,h,A.mat('brick',f.nx,f.ny));
  if(i===0)F.back.panel(0,F.back.length,.6,h,A.mat('brick',0,-1));
  if(i===2)F.front.panel(0,F.front.length,.6,h,A.mat('brick',0,1));else{const next=rs[i+1],nx0=next[0],nx1=next[1],nh=next[4],nr=next[5],cx=(nx0+nx1)/2;
   F.front.panel(0,nx0-x0,.6,h,A.mat('brick',0,1));F.front.panel(nx1-x0,x1-x0,.6,h,A.mat('brick',0,1));
   for(const [a,b,ha,hb]of[[nx0,cx,nh,nr],[cx,nx1,nr,nh]])S.poly([[a,y1,ha],[b,y1,hb],[b,y1,h],[a,y1,h]],A.mat('brick',0,1));
  }
  const cx=(x0+x1)/2;roofSheet(A,[[x0,y0,h+.4],[cx,y0,ridge+.4],[cx,y1,ridge+.4],[x0,y1,h+.4]]);roofSheet(A,[[cx,y0,ridge+.4],[x1,y0,h+.4],[x1,y1,h+.4],[cx,y1,ridge+.4]]);
  for(const y of[i===0?y0:null,y1].filter(x=>x!==null)){S.poly([[x0,y,h],[x1,y,h],[cx,y,ridge]],A.mat('brick',0,y===y0?-1:1));fascia(A,[x0,y,h+.4],[cx,y,ridge+.4]);fascia(A,[cx,y,ridge+.4],[x1,y,h+.4]);}
  for(const x of[x0,x1])fascia(A,[x,y0,h+.4],[x,y1,h+.4]);S.beam([cx,y0,ridge+.5],[cx,y1,ridge+.5],P.lead,.26);
  for(const f of[F.left,F.right])A.windows(f,1,2,i===0?12:3,0,2.5,i===0?6:3,'rect');if(i===2)solidDoor(A,F.front,4.5,.6,3,6);if(i===0)solidDoor(A,F.left,3,.6,3.5,8);
 });return finish048(A,{threeCoaxialOccupiedGables:true,twoRealSectionSteps:true,groundedFrontDoor:true});
}
