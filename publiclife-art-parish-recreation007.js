/* GPT-007 / UKL07–12: original parish and recreation buildings.
 * Concatenated inside publiclife-art-primitives007.js's IIFE.
 * The six forms use independent volumes and real open structural bays.
 * All materials go through Scene's paired day/emission depth buffer.
 * No bitmap imports, Canvas paths, anti-aliasing, shared RNG, or old-art edits.
 */

function plLeisureFlint007(right,seed) {
  const pal=(right?['6b706a','73786f','636b67','7b7e71']:['92968a','a0a292','888f85','a7a897']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.65),x=u+(row&1)*.94,n=hash(Math.floor(x/1.9),row,seed);
    if(z<2.4)return right?C('767d69'):C('999f85');
    if(mod(z,1.65)<.14||mod(x,1.9)<.13)return right?C('92917d'):C('bab79c');
    if(mod(x,1.9)<.36&&mod(z,1.65)>1.0)return pal[2];
    return pal[(n>>>4)%4];
  };
}
function plLeisureBrick007(right,seed) {
  const pal=(right?['865448','8f5b4c','7d5046']:['b47157','bd7b5c','aa6954']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.75),x=u+(row&1)*1.2,n=hash(Math.floor(x/2.4),row,seed);
    if(z<2.1)return right?C('736953'):C('93856a');
    if(mod(z,1.75)<.16||mod(x,2.4)<.12)return right?C('715447'):C('9a7259');
    return n%11===0?pal[1]:n%13===0?pal[2]:pal[0];
  };
}
function plLeisureBoard007(right,seed,cream) {
  const pal=(cream?(right?['a7ad96','adb19b','9ea68f']:['d5d6b7','deddbf','cdcfb0']):(right?['435c4d','4a6251','3d564a']:['627e61','6b8567','58745b'])).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.55),n=hash(Math.floor(u/5),row,seed);
    if(mod(z,1.55)<.18)return cream?(right?C('878f7c'):C('afb99a')):(right?C('344c41'):C('486550'));
    return n%17===0?pal[1]:n%19===0?pal[2]:pal[0];
  };
}
function plLeisureAshlar007(right) {
  return (u,z)=>{
    const row=Math.floor(z/3.2),x=u+(row&1)*2.6;
    if(mod(z,3.2)<.14||mod(x,5.2)<.10)return right?C('999381'):C('c2b89d');
    return right?C('b8ae93'):C('dcd0b0');
  };
}
function plLeisureWalls007(S,i0,i1,j0,j1,z0,z1,material,seed) {
  const F=S.face([i0,j1],[i1,j1]),R=S.face([i1,j0],[i1,j1]);
  F.panel(0,i1-i0,z0,z1,material(false,seed),0);
  R.panel(0,j1-j0,z0,z1,material(true,seed+1),0);
  return {F,R};
}
function plLeisureClay007(right,seed,axis) {
  const pal=(right?['79534a','80594d','714b43']:['a5785d','ae8062','9e7157']).map(C);
  return (i,j,z)=>{
    const along=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down/1.1),x=along+(row&1)*.9;
    const n=hash(Math.floor(x/1.8),row,seed);
    if(mod(down,1.1)<.095)return right?C('684b43'):C('8e674f');
    return n%17===0?pal[1]:n%23===0?pal[2]:pal[0];
  };
}
function plLeisureRoof007(S,i0,i1,j0,j1,z,rise,seed,opt) {
  opt=opt||{};const axis=opt.axis||'i',m=axis==='j'?(i0+i1)/2:(j0+j1)/2;
  const tex=opt.clay?plLeisureClay007:tileRoof,edge=opt.stone?P.stoneR:P.roofEdge;
  const mat=opt.gable||plLeisureBrick007(axis==='i',seed+9);
  if(axis==='j'){
    S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tex(false,seed,'j'));
    S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tex(true,seed+1,'j'));
    S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>mat(i-i0,zz),-.025);
    S.line([i0,j1,z],[m,j1,z+rise],edge,1);S.line([m,j1,z+rise],[i1,j1,z],edge,1);
    ridge(S,[m,j0],[m,j1],z+rise,opt.clay?C('c0916d'):P.lead);
    S.line([i1,j0,z],[i1,j1,z],P.roofEdge,1);
  }else{
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],tex(true,seed,'i'));
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],tex(false,seed+1,'i'));
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>mat(j-j0,zz),-.025);
    S.line([i1,j0,z],[i1,m,z+rise],edge,1);S.line([i1,m,z+rise],[i1,j1,z],edge,1);
    ridge(S,[i0,m],[i1,m],z+rise,opt.clay?C('c0916d'):P.lead);
    S.line([i0,j1,z],[i1,j1,z],P.roofEdge,1);
  }
}
function plLeisurePointWindow007(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,frame=right?C('b3ab92'):C('d4cbb0'),border=.52;
  const top=x=>h-Math.abs(x-w/2)*.94;
  F.panel(u-.35,u+w+.35,z-.65,z+.15,right?P.stoneR:P.stoneHi,.2);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const a=top(x);if(y>a)return null;
    if(x<border||x>w-border||y<.65||y>a-.65)return frame;
    if(Math.abs(x-w/2)<.23||Math.abs(y-h*.53)<.20)return right?P.stoneR:P.stone;
    if(opt.louvre)return mod(y,1.65)<.62?(right?C('677166'):C('879083')):C('293e3d');
    if(y>h*.53&&Math.abs(Math.abs(x-w/2)-(h-y)/2)<.25)return frame;
    if(mod(x*1.4+y*.38,2.5)<.15)return right?C('3d5355'):C('576c67');
    const col=y>h*.62?C('9c8a63'):(right?C('3b5961'):C('597a7b'));
    return [col,opt.lit===false?0:(y>h*.62?C('c9a46b'):C('ddbd82'))];
  },.2);
  const A=F.point(u),B=F.point(u+w/2),D=F.point(u+w);
  S.line([A[0],A[1],z+top(0)],[B[0],B[1],z+h],right?P.stoneR:P.stoneHi,1);
  S.line([B[0],B[1],z+h],[D[0],D[1],z+top(w)],right?P.stoneR:P.stoneHi,1);
}
function plLeisureRoundDoor007(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,arch=Math.min(w*.52,3.4),frame=right?P.stoneR:P.stone;
  const top=x=>h-arch+arch*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
  F.panel(u-.4,u+w+.4,z-.4,z+.45,right?P.stoneD:P.stoneHi,.19);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const a=top(x);if(y>a)return null;
    if(x<.48||x>w-.48||y>a-.65)return frame;
    if(y>h-arch-3.0){
      if(Math.abs(x-w/2)<.22||Math.abs(y-(h-arch-2.8))<.3)return P.frameR;
      return [right?P.glassR:P.glass,opt.lit===false?0:P.warm[0]];
    }
    if(Math.abs(x-w/2)<.2||y<.5||mod(x,1.25)<.12)return right?C('314b42'):C('425a4a');
    if(y>4.5&&y<5.2&&Math.abs(x-w/2)<.8)return P.gold;
    return right?C('415a4d'):C('58715b');
  },.23);
}
function plLeisureSteps007(S,i0,i1,back,front,z,n) {
  const run=(front-back)/n;
  for(let k=0;k<n;k++){
    const a=back+k*run,b=back+(k+1)*run,h=z*(n-k)/n;
    S.box(i0,i1,a,b,0,h,P.stoneR,P.stoneD,P.stone);
    S.line([i0,b,h],[i1,b,h],P.stoneHi,1);
  }
}
function plLeisurePost007(S,i,j,z0,z1,cream) {
  const L=cream?C('d8d6b8'):C('5b7462'),R=cream?C('a8ad96'):C('394f45');
  S.box(i-.65,i+.65,j-.65,j+.65,z0,z0+1.2,L,R,cream?P.stoneHi:C('718774'));
  S.box(i-.38,i+.38,j-.38,j+.38,z0+1.2,z1-1,L,R,L);
  S.box(i-.64,i+.64,j-.64,j+.64,z1-1,z1+.25,L,R,cream?P.stoneHi:C('718774'));
}
function plLeisureRails007(S,a,b,z,h,opt) {
  opt=opt||{};const L=Math.hypot(b[0]-a[0],b[1]-a[1]),col=opt.cream?C('c2c7ab'):C('456052');
  S.line([a[0],a[1],z+h],[b[0],b[1],z+h],col,1);
  S.line([a[0],a[1],z+.7],[b[0],b[1],z+.7],col,1);
  for(let u=0;u<=L;u+=1.45){const p=lerp(a,b,u/L);S.line([p[0],p[1],z+.5],[p[0],p[1],z+h],col,1);}
  if(opt.cross)for(let u=0;u<L-.2;u+=4){
    const p=lerp(a,b,u/L),q=lerp(a,b,Math.min(L,u+4)/L);
    S.line([p[0],p[1],z+.8],[q[0],q[1],z+h-.3],col,1);
    S.line([p[0],p[1],z+h-.3],[q[0],q[1],z+.8],col,1);
  }
}
function plLeisureGrass007(S,seed) {
  const n=S.spec.sz*16;
  S.flat(.6,n-.6,.6,n-.6,0,(i,j)=>{
    const v=hash(Math.floor(i/3),Math.floor(j/3),seed);
    return [C('87946d'),C('7f8e65'),C('8b976f')][v%3];
  },0,1);
}
function plLeisurePaving007(S,i0,i1,j0,j1,seed,z) {
  S.flat(i0,i1,j0,j1,z===undefined?.12:z,(i,j)=>{
    const row=Math.floor(j/2.25),x=i+(row&1)*1.75,n=hash(Math.floor(x/3.5),row,seed);
    if(mod(j,2.25)<.13||mod(x,3.5)<.12)return C('949487');
    return [C('b2ae9b'),C('beb8a5'),C('a9a895')][n%3];
  },.01,1);
}
function plLeisureButtress007(S,i,j,h,wide) {
  const w=wide||1.15;
  S.box(i-w,i+w,j-1.1,j+1.8,0,h*.46,P.stoneR,P.stoneD,P.stone);
  S.box(i-w*.76,i+w*.76,j-.75,j+1.2,h*.46,h*.8,P.stone,P.stoneR,P.stoneHi);
  S.box(i-w*.58,i+w*.58,j-.55,j+.8,h*.8,h,P.stone,P.stoneR,P.stoneHi);
  S.poly([[i-w*.76,j+1.2,h*.46],[i+w*.76,j+1.2,h*.46],[i+w*.76,j+.8,h*.46+1.2],[i-w*.76,j+.8,h*.46+1.2]],P.stoneHi);
}
function plLeisureSconce007(S,i,j,z) {
  // A real opaque iron-backed lantern, never emissive air or a screen-space halo.
  S.box(i-.55,i+.55,j-.45,j+.45,z-1.2,z+1.7,P.iron,P.iron,P.ironHi);
  S.box(i-.35,i+.35,j-.48,j+.48,z-.8,z+1.25,[C('ceb47f'),P.warm[0]],[C('ad905f'),P.warm[2]],P.iron);
  S.line([i-.6,j+.48,z+1.6],[i+.6,j+.48,z+1.6],P.iron,1);
}

function flintParishChurch007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,768);
  // The lower chancel and separate south porch break the broad flint nave.
  plLeisurePaving007(S,22.2,30.2,37,47.4,769);
  plLeisurePaving007(S,30,47.4,40.5,44.3,770);
  plLeisurePaving007(S,2.5,45.6,29.7,34.2,771);
  const N=plLeisureWalls007(S,13.8,35.5,12.2,30.4,0,35,plLeisureFlint007,772);
  plLeisureRoof007(S,13.3,35.9,11.7,30.9,35.2,21.8,774,{clay:true,stone:true,gable:plLeisureFlint007(true,775)});
  for(const u of [2.7,9.7,16.2])plLeisurePointWindow007(S,N.F,u,12,4.2,17,{lit:u!==9.7});
  for(const i of [15.2,22.2,29.4,35.2])plLeisureButtress007(S,i,30.5,29.5,.65);
  const Cn=plLeisureWalls007(S,35.4,44.6,15.1,28.4,0,27,plLeisureFlint007,776);
  plLeisureRoof007(S,35.0,45.0,14.7,28.8,27.2,16.4,778,{clay:true,stone:true,gable:plLeisureFlint007(true,779)});
  plLeisurePointWindow007(S,Cn.F,2.7,8.2,4.3,14.7,{lit:true});
  plLeisurePointWindow007(S,Cn.R,3.4,7.2,6.4,20,{right:true,lit:false});
  plLeisureButtress007(S,44.0,28.3,23.5,.7);
  // A square three-stage tower. Its open, recessed top is bounded by parapets.
  const T=plLeisureWalls007(S,3.8,15.2,15.0,27.3,0,78.2,plLeisureFlint007,780);
  for(const z of [2.2,28.4,55.0,76.6]){
    S.box(3.45,15.55,14.65,27.65,z,z+1.15,P.stone,P.stoneR,P.stoneHi);
  }
  plLeisurePointWindow007(S,T.F,3.65,11.5,4.25,18,{lit:true});
  plLeisurePointWindow007(S,T.F,3.45,60,4.65,13.9,{louvre:true,lit:false});
  plLeisurePointWindow007(S,T.R,3.9,60,4.65,13.9,{right:true,louvre:true,lit:false});
  plLeisurePointWindow007(S,T.R,4.9,35.1,2.45,10,{right:true,lit:false});
  for(const [i,j]of [[4.0,27.1],[14.9,27.1],[15,15.4]])plLeisureButtress007(S,i,j,71.4,1.05);
  S.flat(4.1,14.9,15.3,27.0,78.3,C('646e62'));
  S.box(3.7,15.3,14.9,15.85,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(3.7,4.65,15.0,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(3.7,15.3,26.45,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(14.35,15.3,15,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  for(const i of [3.7,7.9,12.1])for(const j of [14.9,26.45])S.box(i,i+3.2,j,j+.95,82,86.8,P.stone,P.stoneR,P.stoneHi);
  for(const j of [18.3,22.6])for(const i of [3.7,14.35])S.box(i,i+.95,j,j+2.65,82,86.8,P.stone,P.stoneR,P.stoneHi);
  // The porch has a deep entrance and timber-supported opening below its gable.
  const PF=S.face([21.7,40.1],[31.1,40.1]),PR=S.face([31.1,30],[31.1,40.1]);
  PR.panel(0,10.1,0,20.5,plLeisureFlint007(true,782),0);
  PF.panel(0,9.4,0,20.5,(u,z)=>{
    const inner=u>2.15&&u<7.25,top=17.7-Math.abs(u-4.7)*.88;
    return inner&&z>1&&z<top?null:plLeisureFlint007(false,783)(u,z);
  },0);
  S.wall([23.85,37],[28.95,37],.9,18.8,C('405047'));
  const D=S.face([23.85,37.05],[28.95,37.05]);plLeisureRoundDoor007(S,D,0,1,5.1,16.7,{lit:false});
  S.wall([23.85,37],[23.85,40.1],1,15.5,P.stoneD);S.wall([28.95,37],[28.95,40.1],1,15.5,P.stoneR);
  S.flat(22.5,30.4,35.3,40.5,1.05,P.path[1]);
  plLeisureRoof007(S,21.3,31.5,29.6,40.6,20.7,10.4,784,{axis:'j',clay:true,stone:true,gable:plLeisureAshlar007(false)});
  for(const i of [22.6,30.1])S.box(i-.35,i+.35,39.9,40.2,16.5,21,C('68705c'),C('47594b'),P.stoneR);
  S.line([22.2,40.7,21],[26.4,40.7,29.8],C('596454'),1);S.line([26.4,40.7,29.8],[30.6,40.7,21],C('596454'),1);
  S.line([26.4,40.7,21],[26.4,40.7,30.7],C('68705c'),1);
  plLeisurePointWindow007(S,PR,4.3,7,2.0,8.5,{right:true,lit:false});
  plLeisureSteps007(S,23.1,29.8,40.2,42.6,1.8,3);
  downpipe(S,35.55,30.7,34.9);downpipe(S,44.7,28.5,27.0);
  // Low churchyard edges retain street access and a readable lawn strip.
  for(const [a,b]of [[[1,46.5],[21.7,46.5]],[[30.8,46.5],[46.6,46.5]],[[46.6,5.0],[46.6,39.8]]]){
    const F=S.face(a,b);F.panel(0,F.length,0,2.2,plLeisureFlint007(a[0]===b[0],786),0);
    S.line([a[0],a[1],2.3],[b[0],b[1],2.3],P.stoneR,1);
  }
  bench(S,34.6,37.0,6.4);bush(S,8.2,39.4,2.2,4.1,false);bush(S,40.7,7.6,2.0,4.2,false);
  lamp(S,32.0,43.8,9);return S.finish();
}

function nonconformistChapel007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Compact double-height brick gallery hall, with a classical street front.
  const W=plLeisureWalls007(S,3.2,27.6,4.0,24.5,0,43.4,plLeisureBrick007,790);
  hipRoof(S,[[2.75,3.55],[28.05,3.55],[28.05,24.55],[2.75,24.55]],[11.2,13.0],[19.6,13.0],43.6,10.3,792);
  S.box(2.85,27.95,4.0,24.85,20.7,21.8,P.stone,P.stoneR,P.stoneHi);
  cornice(S,3.0,27.8,3.85,24.65,42.5);
  // Side pilasters and two tiers of round-headed lights clearly indicate gallery use.
  for(const j of [4.4,10.7,17.2,23.5]){
    S.box(27.6,28.05,j,j+1.0,1.8,41.7,C('b27a5d'),C('966447'),P.stoneR);
    S.box(27.55,28.2,j-.2,j+1.2,39.8,41.2,P.stoneR,P.stoneD,P.stone);
  }
  for(const u of [2.15,8.5,14.7]){
    windowOn(S,W.R,u,5.0,4.1,13.3,{right:true,arch:true,panes:2,transom:6.4,lit:u!==8.5});
    windowOn(S,W.R,u,26.0,4.1,13.7,{right:true,arch:true,panes:2,transom:6.7,lit:u===8.5});
  }
  for(const i of [3.25,8.8,21.05,26.5]){
    S.box(i,i+1.05,24.45,25.15,1.2,42.7,P.stone,P.stoneR,P.stoneHi);
    S.box(i-.18,i+1.23,24.4,25.45,39.5,41.3,P.stoneHi,P.stoneR,P.stoneHi);
  }
  for(const u of [1.7,19.0]){
    windowOn(S,W.F,u,5.7,3.9,13.4,{arch:true,panes:2,lit:false});
    windowOn(S,W.F,u,26.0,3.9,13.7,{arch:true,panes:2});
  }
  plLeisureRoundDoor007(S,W.F,7.4,3.4,4.35,15.0,{});
  plLeisureRoundDoor007(S,W.F,12.8,3.4,4.35,15.0,{});
  windowOn(S,W.F,8.5,27.0,7.35,13.4,{arch:true,panes:3,transom:6.4});
  W.F.panel(7.1,17.65,22.1,25.8,P.stone,.2);letters(W.F,'CHAPEL',7.75,22.6,.36,C('76523e'));
  // A broken pediment sits above the central bay; it is masonry, not floating trim.
  const PF=S.face([9.0,25.35],[22.0,25.35]);PF.panel(0,13,41.8,45.8,plLeisureBrick007(false,795),0);
  S.poly([[9.0,25.35,45.2],[22,25.35,45.2],[15.5,25.35,54.6]],(i,j,z)=>plLeisureBrick007(false,796)(i,z),0);
  S.line([8.8,25.6,45.7],[13.45,25.6,52.5],P.stoneHi,1);
  S.line([17.55,25.6,52.5],[22.2,25.6,45.7],P.stoneHi,1);
  S.line([8.75,25.6,44.8],[22.25,25.6,44.8],P.stoneHi,1);
  windowOn(S,PF,5.2,46.4,2.7,5.4,{arch:true,panes:1,lit:false});
  plLeisureSteps007(S,9.5,22.1,24.9,29.7,3.45,5);
  for(const i of [9.15,22.4]){
    S.line([i,25.0,7],[i,29.7,4.2],P.iron,1);
    for(const j of [25.1,27.1,29.4]){const z=3.45*(29.7-j)/4.8;S.line([i,j,z],[i,j,z+3.9],P.iron,1);}
  }
  downpipe(S,27.98,24.5,42.5);lamp(S,5.6,29.1,8.6);bush(S,28.9,28.9,1.3,2.8,true);
  return S.finish();
}

function cricketPavilion007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,802);
  plLeisurePaving007(S,2.0,46.0,40.0,47.4,803);plLeisurePaving007(S,43.1,47.4,5,43,804);
  // Substantial brick clubhouse behind a high, long, genuinely open veranda.
  const W=plLeisureWalls007(S,4.5,43.0,6.0,24.3,0,36.5,plLeisureBrick007,805);
  plLeisureRoof007(S,4.0,43.5,5.5,24.8,36.7,14.0,807,{clay:true,gable:plLeisureBoard007(true,808,true)});
  for(const u of [2,9.5,26.5,33.0])windowOn(S,W.F,u,15.0,4.9,12.1,{panes:3,transom:7.7});
  doorway(S,W.F,17.0,9.5,5.0,16.9,{double:true});
  for(const u of [2.1,9.8])windowOn(S,W.R,u,12.0,4.9,13.7,{right:true,panes:3,transom:8.7});
  W.F.panel(0,38.5,30.6,32.0,C('495f4e'),.14);W.R.panel(0,18.3,30.6,32,C('344d42'),.14);
  for(const i of [6.2,14.5,34.2,41.3])S.box(i-.36,i+.36,24.25,24.6,28.0,36.4,C('58715b'),C('3b5245'),P.frameR);
  // Terrace and veranda have separate height levels and supported load paths.
  S.box(3.8,43.6,24.2,34.9,0,9.0,(i,j,z)=>plLeisureBrick007(false,810)(i,z),(i,j,z)=>plLeisureBrick007(true,811)(j,z),C('a19b80'));
  S.flat(4.1,43.3,24.2,34.7,9.08,(i,j)=>mod(i,1.15)<.12?C('827e68'):C('b3a386'));
  for(const i of [5.5,13.1,20.7,28.3,35.9,42.4]){
    plLeisurePost007(S,i,33.65,9.1,27.4,true);
    S.line([i,33.65,23.9],[i+2.0,33.65,27.1],C('aeb89b'),1);
    S.line([i,33.65,23.9],[i-2.0,33.65,27.1],C('aeb89b'),1);
  }
  S.poly([[4.0,24.1,32.2],[43.6,24.1,32.2],[43.6,34.4,27.4],[4.0,34.4,27.4]],plLeisureClay007(false,812,'i'));
  S.wall([4.0,34.4],[43.6,34.4],26.9,28.1,C('cec8a8'));
  S.line([4,34.45,26.5],[43.6,34.45,26.5],C('566b54'),1);
  for(const [a,b]of [[[4.5,34.7],[19.6,34.7]],[[27.3,34.7],[43.0,34.7]],[[43.1,24.9],[43.1,34.7]]])plLeisureRails007(S,a,b,9.1,4.7,{cream:true,cross:true});
  // A jettied, gabled viewing room rises above the veranda's low sweep.
  const V=plLeisureWalls007(S,17.0,30.2,17.1,28.5,30.5,46.4,(right,seed)=>plLeisureBoard007(right,seed,true),814);
  plLeisureRoof007(S,16.6,30.6,16.7,29.0,46.5,13.4,816,{axis:'j',clay:true,gable:plLeisureBoard007(false,817,true)});
  S.box(16.5,30.7,28.4,29.2,30.0,31.3,C('5a6c51'),C('3a5243'),C('708064'));
  windowOn(S,V.F,1.6,33.0,10.0,11.6,{panes:5,transom:7.8,border:.32});
  windowOn(S,V.R,3.4,34.0,5.4,9.0,{right:true,panes:3,lit:false});
  for(const i of [17.3,23.6,29.9])S.line([i,29.05,46.7],[i,29.05,46.7+(i===23.6?12.6:.5)],C('536a50'),1);
  S.line([17.15,29.08,46.7],[23.6,29.08,59.2],C('536a50'),1);S.line([23.6,29.08,59.2],[30.05,29.08,46.7],C('536a50'),1);
  S.line([19.4,29.08,46.8],[23.6,29.08,53.7],C('536a50'),1);S.line([27.8,29.08,46.8],[23.6,29.08,53.7],C('536a50'),1);
  S.line([23.6,29.08,58.9],[23.6,29.08,62.1],C('657258'),1);
  // Broad stepped spectator terraces leave the central stair genuinely clear.
  for(let n=0;n<4;n++){
    const back=34.9+n*2.7,front=back+2.7,z=7.1-n*1.75;
    for(const [a,b]of [[4.2,19.5],[27.4,43.5]]){
      S.box(a,b,back,front,0,z,P.stoneR,P.stoneD,P.path[1]);
      S.line([a,front,z],[b,front,z],P.stoneHi,1);
      // Fixed slatted benches on visible iron legs, not painted stripes on the steps.
      const y=back+.65;
      for(const i of [a+.7,b-.7])S.box(i-.16,i+.16,y,y+.7,z,z+1.5,P.iron,P.iron,null);
      S.box(a+.2,b-.2,y,y+1.1,z+1.35,z+1.8,C('9e865c'),C('746a4c'),C('b39b6a'));
    }
  }
  plLeisureSteps007(S,20,26.9,34.85,46.2,9.0,9);
  for(const i of [19.7,27.2]){
    S.line([i,35,13],[i,46.1,4],C('c2c7aa'),1);
    for(let k=0;k<5;k++){const j=35+k*2.7,z=9*(46.2-j)/11.35;S.line([i,j,z],[i,j,z+4],C('aeb79c'),1);}
  }
  // A compact scoreboard on the right wall is part of the club's everyday use.
  W.R.panel(2.5,15.5,28.5,34.2,C('344b40'),.2);letters(W.R,'CC',3.4,29.5,.36,P.frame);
  for(const u of [7.0,9.6,12.1])W.R.panel(u,u+1.1,30.0,32.3,C('d2ccb0'),.25);
  downpipe(S,43.2,24.45,36.5);bush(S,2.0,33.4,1.25,3.0,false);lamp(S,45.6,39.0,10);
  return S.finish();
}

function bowlsClub007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,824);
  plLeisurePaving007(S,1,31,24.3,27.4,825);plLeisurePaving007(S,12.7,20.0,26.5,31.4,826);
  // Rear changing room with weatherboard, and three truly open segmental bays.
  const W=plLeisureWalls007(S,3.1,29.0,7.1,14.5,0,23.4,(right,seed)=>plLeisureBoard007(right,seed,false),827);
  S.box(2.7,29.4,6.8,23.8,0,2.35,(i,j,z)=>plLeisureBrick007(false,829)(i,z),(i,j,z)=>plLeisureBrick007(true,830)(j,z),C('8c977d'));
  S.flat(3,29.1,14.4,23.7,2.42,(i,j)=>mod(i,1.15)<.1?C('7e8269'):C('a6a786'));
  doorway(S,W.F,10.45,2.45,5.0,14.6,{double:true,col:C('4e6856')});
  for(const u of [2.2,19.0])windowOn(S,W.F,u,8.5,4.8,8.6,{panes:3,lit:u>10,border:.3});
  windowOn(S,W.R,2.0,8.4,3.6,8.4,{right:true,panes:2,lit:false});
  const F=S.face([3.2,23.2],[28.8,23.2]);
  for(const i of [3.25,11.8,20.35,28.85])plLeisurePost007(S,i,23.2,2.4,21.5,true);
  // A shallow arch is cut out of each structural spandrel; no dark fake opening.
  for(const u of [.45,9.0,17.55]){
    const w=7.65;
    F.panel(u,u+w,16.1,21.4,(x,z)=>{
      const curve=1.0+3.3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
      return z<curve?null:C('d3d2b2');
    },.12);
    let prev=null;
    for(let k=0;k<=12;k++){
      const x=w*k/12,z=17.1+3.3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)),p=F.point(u+x);
      if(prev)S.line(prev,[p[0],p[1],z],C('a8b299'),1);prev=[p[0],p[1],z];
    }
  }
  for(const [a,b]of [[3.2,11.8],[20.35,28.8]]){
    S.wall([a,23.2],[b,23.2],2.4,6.9,(i,j,z)=>plLeisureBoard007(false,832,true)(i,z),.08);
    S.box(a,b,22.9,23.5,6.7,7.35,C('c7cfb0'),C('969e88'),C('d6d9ba'));
    for(let i=a+.75;i<b-.4;i+=2.15)S.line([i,23.3,3.1],[i,23.3,6.6],C('a5b093'),1);
  }
  S.wall([29,14.5],[29,23.2],2.4,6.9,(i,j,z)=>plLeisureBoard007(true,833,true)(j,z),.05);
  S.box(2.7,29.45,22.95,23.6,21.3,23.0,C('d8d4b3'),C('aab097'),C('e1ddbd'));
  // Monopitch slate, high at the rear and low at the arcade. No gable or cupola.
  S.poly([[2.6,6.6,27.0],[29.5,6.6,27.0],[29.5,23.8,23.2],[2.6,23.8,23.2]],tileRoof(false,834,'i'));
  S.poly([[29.1,7.1,23.3],[29.1,23.2,21.7],[29.1,23.8,23.2],[29.1,6.6,27.0]],C('54705b'));
  S.line([2.6,6.6,27],[29.5,6.6,27],P.lead,1);S.line([2.6,23.8,23.2],[29.5,23.8,23.2],P.roofEdge,1);
  plLeisureSteps007(S,12.2,20.0,23.55,26.4,2.4,3);
  // Low seating and a cropped green edge establish scale without inventing play.
  bench(S,3.5,28.3,6.1);bench(S,23.0,28.3,5.8);
  S.line([1.4,30.7,.3],[10.6,30.7,.3],C('d4d2af'),1);
  S.box(6.8,7.5,29.8,30.5,.2,.7,C('424d40'),C('343e36'),C('54604a'));
  S.box(9.2,9.7,29.8,30.3,.2,.6,C('dddcc4'),C('b4b79e'),C('efecd4'));
  plLeisureSconce007(S,11.8,23.4,16.0);plLeisureSconce007(S,20.35,23.4,16.0);
  downpipe(S,29.3,23.65,23);return S.finish();
}

function ironBandstand007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,844);
  plLeisurePaving007(S,1,31,2.0,30.8,845);
  const B=[[8,4],[24,4],[28,8],[28,24],[24,28],[8,28],[4,24],[4,8]];
  const R=B.map(p=>[16+(p[0]-16)*1.17,16+(p[1]-16)*1.17]);
  const Q=B.map(p=>[16+(p[0]-16)*.94,16+(p[1]-16)*.94]);
  // The column ring is inset from the eave. Seat every capital on the
  // actual sloping canopy at that radius, not merely at eave height.
  const canopySeat=37.0-(37.0-29.8)*(.94/1.17);
  // Octagonal stone drum and a timber stage; the whole interior remains air.
  for(let k=0;k<8;k++){
    const a=B[k],b=B[(k+1)%8],right=(b[1]-a[1])>(b[0]-a[0]);
    S.wall(a,b,0,4.6,right?P.stoneR:P.stone);
    S.line([a[0],a[1],1.7],[b[0],b[1],1.7],right?P.stoneD:C('b4ab90'),1);
    S.wall(a,b,4.5,5.25,right?C('aaa78d'):C('cec5a8'));
  }
  S.poly(B.map(p=>[p[0],p[1],5.3]),(i,j)=>mod(i,1.15)<.1?C('8b7d62'):C('b39c77'));
  for(let k=0;k<8;k++){
    const a=Q[k],b=Q[(k+1)%8];plLeisurePost007(S,a[0],a[1],5.35,canopySeat,false);
    // Cast iron corner brackets are slender geometry tied directly to each post.
    const da=lerp(a,b,.23),db=lerp(a,b,.77);
    S.line([a[0],a[1],25],[da[0],da[1],28.9],C('607969'),1);
    S.line([db[0],db[1],28.9],[b[0],b[1],25],C('607969'),1);
    S.line([a[0],a[1],28.9],[b[0],b[1],28.9],C('536c5c'),1);
    // Patterned rail, with a real central entry opening on the front face.
    if(k===4){
      plLeisureRails007(S,a,[19.4,a[1]],5.4,4.5,{cross:true});
      plLeisureRails007(S,[12.6,a[1]],b,5.4,4.5,{cross:true});
    }else plLeisureRails007(S,a,b,5.4,4.5,{cross:true});
    // Every luminous pixel is confined to these small opaque column fixtures.
    if(k===2||k===3||k===4||k===5)plLeisureSconce007(S,a[0],a[1]+.12,22.9);
  }
  // A shallow eight-facet metal canopy, never a double-eaved temple roof.
  for(let k=0;k<8;k++){
    const a=R[k],b=R[(k+1)%8],right=(a[0]+b[0])>(a[1]+b[1]);
    const mat=(i,j,z)=>{
      const seam=mod((k&1?i+j:i-j)*1.1,3.4)<.11;
      return seam?(right?C('455d59'):C('6b8174')):(right?C('5d756c'):C('829586'));
    };
    S.poly([[a[0],a[1],29.8],[b[0],b[1],29.8],[16,16,37.0]],mat);
    S.wall(a,b,28.7,29.85,right?C('355247'):C('567362'));
    S.line([a[0],a[1],29.85],[16,16,37.05],right?C('6f8478'):C('9ba999'),1);
    const m=lerp(a,b,.5);
    S.line([m[0],m[1],29.5],[m[0],m[1],31.9],C('556e5b'),1);
    S.line([m[0]-.45,m[1],30.3],[m[0]+.45,m[1],30.3],C('728c73'),1);
  }
  // Central basket finial is physically seated on the canopy crown.
  S.box(15.2,16.8,15.2,16.8,36.7,38.1,C('627b65'),C('3e5848'),C('899779'));
  for(const d of [-.7,.7])S.line([16+d,16,38.0],[16+d*.65,16,41.0],C('5a735d'),1);
  S.line([15.35,16,40.2],[16.65,16,40.2],C('6f8569'),1);S.line([16,16,37.9],[16,16,43.2],C('5c7057'),1);
  plLeisureSteps007(S,12.7,19.3,27.65,31.0,5.3,5);
  return S.finish();
}

function seasideConcertHall007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Enclosed assembly hall with an opaque, low vaulted metal roof.
  const W=plLeisureWalls007(S,4.0,35.1,4.3,33.1,0,28.4,plLeisureAshlar007,860);
  W.F.panel(0,31.1,2.0,5.0,C('b9ba9e'),.1);W.R.panel(0,28.8,2.0,5.0,C('959f8a'),.1);
  for(const u of [2.4,10.1,18.0,25.2])windowOn(S,W.F,u,9,4.2,15.5,{arch:true,panes:2,transom:9.2});
  for(const u of [2.4,9.8,17.2,24.0])windowOn(S,W.R,u,9.0,4.2,15.5,{right:true,arch:true,panes:2,transom:9.2,lit:u!==9.8});
  for(const i of [4.0,11.7,19.5,27.3,34.3])S.box(i,i+.85,33.0,33.55,2.0,27.3,P.stoneHi,P.stoneR,P.stoneHi);
  for(const j of [4.5,11.7,19.1,26.4,32.0])S.box(35.05,35.7,j,j+.8,2,27.3,P.stoneR,P.stoneD,P.stone);
  cornice(S,3.9,35.2,4.2,33.2,27.5);
  const i0=3.6,i1=35.6,mid=(i0+i1)/2,rad=(i1-i0)/2,z0=29.0,rise=13.5;
  const roofZ=i=>z0+rise*Math.sqrt(Math.max(0,1-((i-mid)/rad)**2));
  for(let n=0;n<12;n++){
    const a=i0+(i1-i0)*n/12,b=i0+(i1-i0)*(n+1)/12,za=roofZ(a),zb=roofZ(b),right=n>=6;
    const metal=(i,j,z)=>{
      if(mod(j,3.35)<.11)return right?C('4d6d68'):C('7d9788');
      return right?C('69857a'):C('95aa96');
    };
    S.poly([[a,3.9,za],[b,3.9,zb],[b,33.6,zb],[a,33.6,za]],metal);
    S.poly([[a,33.35,28.3],[b,33.35,28.3],[b,33.35,zb],[a,33.35,za]],P.stone);
    S.line([a,3.9,za+.1],[a,33.6,za+.1],right?C('6f8d7e'):C('a7b8a0'),1);
    S.line([a,33.62,za],[b,33.62,zb],P.stoneHi,1);
  }
  // A shallow ridge vent is solid, with small louvers, not a greenhouse lantern.
  S.box(17.3,21.9,11.0,23.8,41.0,44.0,C('b5bda2'),C('8e9d8a'),C('738c78'));
  const VF=S.face([17.3,23.8],[21.9,23.8]);VF.panel(.55,4.05,41.4,43.35,(x,z)=>mod(z,.85)<.32?C('acb89d'):C('526b5d'),.12);
  // Right-hand colonnaded promenade provides the visible roof void from the road.
  S.box(35.2,44.8,5.4,42.4,0,1.8,P.stoneR,P.stoneD,P.path[2]);
  for(const j of [6.8,14.9,23.0,31.1,40.6]){
    plLeisurePost007(S,43.4,j,1.9,20.4,true);
    S.line([43.4,j,17.3],[43.4,j+1.65,20.2],C('b7c0a3'),1);
    S.line([43.4,j,17.3],[43.4,j-1.65,20.2],C('b7c0a3'),1);
  }
  S.poly([[35.3,5.8,22.4],[44.3,5.8,20.9],[44.3,41.8,20.9],[35.3,41.8,22.4]],tileRoof(true,866,'j'));
  S.wall([44.3,5.8],[44.3,41.8],20.0,21.15,C('b2baa1'));
  S.line([44.3,5.8,19.8],[44.3,41.8,19.8],C('768c78'),1);
  plLeisureSconce007(S,43.45,14.9,16.0);plLeisureSconce007(S,43.45,31.1,16.0);
  // Independent entrance volume projects below its own ribbed copper dome.
  const E=plLeisureWalls007(S,12.6,28.0,30.1,42.2,0,31.5,plLeisureAshlar007,867);
  S.box(12.2,28.4,29.85,42.55,29.8,31.5,P.stoneHi,P.stoneR,P.stoneHi);
  for(const i of [12.7,15.2,25.2,27.2]){
    S.box(i-.35,i+.35,42.1,42.7,2.0,28.8,P.stoneHi,P.stoneR,P.stoneHi);
    S.box(i-.6,i+.6,42.0,42.95,27.4,29.1,P.stoneHi,P.stoneR,P.stoneHi);
  }
  plLeisureRoundDoor007(S,E.F,4.6,1.2,6.25,19.0,{});
  windowOn(S,E.F,1.1,9.0,2.15,11.0,{arch:true,panes:1,lit:false});
  windowOn(S,E.F,12.1,9.0,2.15,11.0,{arch:true,panes:1,lit:false});
  E.F.panel(3.45,12.15,22.6,27.3,C('77917d'),.22);letters(E.F,'HALL',4.35,23.4,.48,P.stoneHi);
  windowOn(S,E.R,3.0,9.3,4.6,15.0,{right:true,arch:true,panes:2,transom:8.4});
  // Faceted dome rings are closed opaque solids on the roof, with paired shading.
  const cx=20.3,cy=36.1,ys=.78,segments=12,rings=[[7.5,31.55],[7.65,33.3],[6.85,38.6],[4.75,44.0],[2.25,47.3],[.7,48.4]];
  for(let n=0;n<rings.length-1;n++)for(let k=0;k<segments;k++){
    const a=2*Math.PI*k/segments,b=2*Math.PI*(k+1)/segments,A=rings[n],B=rings[n+1];
    const p=[cx+Math.cos(a)*A[0],cy+Math.sin(a)*A[0]*ys,A[1]],q=[cx+Math.cos(b)*A[0],cy+Math.sin(b)*A[0]*ys,A[1]],r=[cx+Math.cos(b)*B[0],cy+Math.sin(b)*B[0]*ys,B[1]],t=[cx+Math.cos(a)*B[0],cy+Math.sin(a)*B[0]*ys,B[1]];
    const right=Math.cos((a+b)/2)>Math.sin((a+b)/2);
    S.poly([p,q,r,t],right?C('668476'):C('91ab91'));
    S.line(p,t,right?C('8b9f89'):C('b1c0a4'),1);
  }
  S.flat(cx-.7,cx+.7,cy-.7,cy+.7,48.4,C('718a6d'));
  S.box(cx-.6,cx+.6,cy-.6,cy+.6,48.3,50.1,C('a3b293'),C('738a70'),C('b7c3a3'));
  S.line([cx,cy,49.8],[cx,cy,53.0],C('6a805f'),1);
  plLeisureSteps007(S,15.4,25.0,42.4,46.0,1.8,3);
  bench(S,4.6,39.6,5.9);bench(S,34.9,44.2,6.6);bush(S,8.7,45.5,1.6,3.0,true);
  downpipe(S,35.6,33.15,27.5);lamp(S,30.0,45.8,9.4);return S.finish();
}
