/* UKR09–16. Original village and industrial domestic plans.
 * This fragment is concatenated inside residential-art-primitives006.js's IIFE.
 * References inform typology rather than copying a particular surviving house.
 */

function vwRubble006(right,seed) {
  const pal=(right?['aaa18a','b3a58d','a79b83','b6a98d']:['c9bea1','d3c7a9','c3b79c','d7cbad']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/2.1),phase=(row&1)*1.72,x=u+phase;
    const cell=Math.floor(x/3.35),n=hash(cell,row,seed);
    if(z<2.6)return right?C('8b8974'):C('a09d80');
    if(mod(z,2.1)<.20||mod(x,3.35)<.14)return right?C('928b77'):C('b0a68c');
    return pal[(n>>>6)%4];
  };
}
function vwBrick006(right,seed) {
  const pal=(right?['815147','87574c','7b4d44']:['a96b55','b1735b','a36854']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.75),x=u+(row&1)*1.2,n=hash(Math.floor(x/2.4),row,seed);
    if(z<1.7)return right?C('68665b'):C('8c8470');
    if(mod(z,1.75)<.17||mod(x,2.4)<.12)return right?C('735347'):C('916954');
    if(z<4.5&&n%5===0)return pal[2];
    return n%9===0?pal[1]:n%11===0?pal[2]:pal[0];
  };
}
function vwClay006(right,seed,axis) {
  const pal=(right?['765048','7e564c','704940']:['a8755a','ae7a5f','a06c55']).map(C);
  return (i,j,z)=>{
    const along=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down/1.05);
    const x=along+(row&1)*.8,n=hash(Math.floor(x/1.6),row,seed);
    if(mod(down,1.05)<.1)return right?C('61473f'):C('93654f');
    return n%13===0?pal[1]:n%17===0?pal[2]:pal[0];
  };
}
function vwStoneSlate006(right,seed,axis) {
  const pal=(right?['777a6e','7e8072','737668']:['999a87','a3a28e','939583']).map(C);
  return (i,j,z)=>{
    const a=axis==='j'?j:i,d=axis==='j'?i:j,row=Math.floor(d/1.5),x=a+(row&1)*1.3;
    const n=hash(Math.floor(x/2.6),row,seed);
    if(mod(d,1.5)<.13)return right?C('676e63'):C('818877');
    return n%13===0?pal[1]:n%17===0?pal[2]:pal[0];
  };
}
function vwRoof006(S,i0,i1,j0,j1,z,rise,seed,opt) {
  opt=opt||{};
  const axis=opt.axis||'i',m=axis==='j'?(i0+i1)/2:(j0+j1)/2;
  const tex=opt.clay?vwClay006:opt.stone?vwStoneSlate006:tileRoof;
  const gable=opt.gable||vwBrick006(axis==='i',seed+8);
  if(axis==='j'){
    S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tex(false,seed,'j'));
    S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tex(true,seed+1,'j'));
    S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>gable(i-i0,zz),-.025);
    S.line([i0,j1,z],[m,j1,z+rise],opt.stone?P.stone:P.roofEdge,1);
    S.line([m,j1,z+rise],[i1,j1,z],opt.stone?P.stoneR:P.roofEdge,1);
    ridge(S,[m,j0],[m,j1],z+rise,opt.clay?C('bd8b6a'):opt.stone?C('b1ae97'):P.lead);
    S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  }else{
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],tex(true,seed,'i'));
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],tex(false,seed+1,'i'));
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>gable(j-j0,zz),-.025);
    S.line([i1,j0,z],[i1,m,z+rise],opt.stone?P.stoneR:P.roofEdge,1);
    S.line([i1,m,z+rise],[i1,j1,z],opt.stone?P.stoneR:P.roofEdge,1);
    ridge(S,[i0,m],[i1,m],z+rise,opt.clay?C('bd8b6a'):opt.stone?C('b1ae97'):P.lead);
    S.line([i0,j1,z],[i1,j1,z],P.iron,1);
  }
}
function vwPlainDoor006(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,col=opt.col||P.wood;
  F.panel(u-.3,u+w+.3,z,z+h+.7,right?P.stoneD:P.stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(x<.3||x>w-.3||y>h-.45)return right?P.greenD:C('5c6756');
    if(opt.glazed&&y>h-4.1&&y<h-.9&&x>.6&&x<w-.6)return [P.glass,P.warm[2]];
    if(mod(x,.85)<.10)return right?C('344b42'):C('45594b');
    if(y>h*.42&&y<h*.48&&x>w*.72)return P.gold;
    return col;
  },.23);
  const a=F.point(u-.15),b=F.point(u+w+.15);
  S.line([a[0],a[1]+.2,z+.15],[b[0],b[1]+.2,z+.15],P.stoneHi,1);
}
function vwCottageWindow006(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right;
  windowOn(S,F,u,z,w,h,{right,panes:opt.panes||2,transom:h*.56,leaded:!!opt.leaded,curtain:!!opt.curtain,lit:opt.lit!==false,warm:opt.warm||0,border:.3});
  if(opt.woodLintel)F.panel(u-.5,u+w+.5,z+h,z+h+.85,right?C('716751'):C('8b7c5e'),.28);
}
function vwGarden006(S,seed) {
  S.flat(.7,31.3,.7,31.3,0,(i,j)=>{
    const n=hash(Math.floor(i/3),Math.floor(j/3),seed);
    if(j>30)return P.path[n%4];
    return [C('89956f'),C('83916a'),C('8d9973')][n%3];
  },0,1);
}
function vwCobbles006(S,i0,i1,j0,j1,seed) {
  S.flat(i0,i1,j0,j1,.12,(i,j)=>{
    const row=Math.floor(j/1.65),x=i+(row&1)*1.1,n=hash(Math.floor(x/2.2),row,seed);
    if(mod(j,1.65)<.16||mod(x,2.2)<.14)return C('919082');
    return [C('ada997'),C('b5af9c'),C('a5a491'),C('bcb6a2')][n%4];
  },.01,1);
}
function vwGardenWall006(S,a,b,height,seed,stone) {
  const F=S.face(a,b),right=a[0]===b[0];
  F.panel(0,F.length,0,height,stone?vwRubble006(right,seed):vwBrick006(right,seed),.02);
  for(let u=0;u<F.length;u+=1.55){
    const p=F.point(u),q=F.point(Math.min(F.length,u+1.5));
    S.line([p[0],p[1],height],[q[0],q[1],height],stone?P.stoneR:C('a3775d'),1);
  }
}
function vwGate006(S,a,b,h) {
  const L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(let u=0;u<=L;u+=.8){const p=lerp(a,b,u/L);S.line([p[0],p[1],.4],[p[0],p[1],h],C('7f7960'),1);}
  for(const z of [1.2,h-1])S.line([a[0],a[1],z],[b[0],b[1],z],C('a09576'),1);
}
function vwPot006(S,i,j,flower) {
  S.box(i-.6,i+.6,j-.6,j+.6,0,1.7,C('a67358'),C('7d5544'),C('6e6650'));
  bush(S,i,j,.85,3.2,flower);
}
function vwKitchenBed006(S,i0,i1,j0,j1,seed) {
  S.flat(i0,i1,j0,j1,.17,C('81775c'),.02,1);
  for(let j=j0+.8;j<j1;j+=1.7)for(let i=i0+.65;i<i1;i+=1.4){
    const n=hash(Math.floor(i*3),Math.floor(j*3),seed);
    S.line([i-.25,j,.6],[i+.35,j,1.1],n%2?C('607c49'):C('769052'),1);
  }
}
function vwDormer006(S,i0,i1,back,front,z0,z1,rise,seed,stone) {
  const mid=(i0+i1)/2,mat=stone?vwRubble006(false,seed):vwBrick006(false,seed);
  S.poly([[i0,back,z1+1],[i0,front,z0],[i0,front,z1]],P.stoneD,.02);
  S.poly([[i1,back,z1+1],[i1,front,z0],[i1,front,z1]],P.stoneR,.02);
  const D=S.face([i0,front],[i1,front]);D.panel(0,i1-i0,z0,z1,mat,.02);
  S.poly([[i0,front,z1],[i1,front,z1],[mid,front,z1+rise]],(i,j,z)=>mat(i-i0,z),.02);
  S.poly([[i0,back,z1],[i1,back,z1],[mid,back,z1+rise]],P.stoneD,-.03);
  vwRoof006(S,i0-.25,i1+.25,back,front+.32,z1,rise,seed+1,{axis:'j',stone,gable:mat});
  vwCottageWindow006(S,D,.9,z0+1,i1-i0-1.8,z1-z0-1.8,{leaded:true});
}

function stoneCottagePair006(spec) {
  const S=Scene(spec);vwGarden006(S,609);
  // Two distinct cottages share the party wall; their roof/eave levels step.
  const A=S.face([2.6,23],[15.7,23]),AR=S.face([15.7,10.2],[15.7,23]);
  A.panel(0,13.1,0,23.5,vwRubble006(false,610),0);
  AR.panel(0,12.8,0,23.5,vwRubble006(true,611),0);
  const B=S.face([15.7,24],[29.0,24]),BR=S.face([29,10],[29,24]);
  B.panel(0,13.3,0,25.4,vwRubble006(false,612),0);
  BR.panel(0,14,0,25.4,vwRubble006(true,613),0);
  vwRoof006(S,2.15,15.8,9.8,23.45,23.7,18.1,614,{stone:true,gable:vwRubble006(true,615)});
  vwRoof006(S,15.5,29.5,9.5,24.5,25.6,19.5,616,{stone:true,gable:vwRubble006(true,617)});
  vwDormer006(S,6.7,12.5,19.2,23.5,25.1,34.4,6.6,618,true);
  vwDormer006(S,20.0,26.3,20.6,24.5,27.0,37.4,7.4,620,true);
  vwPlainDoor006(S,A,1.2,.6,3.25,15.3,{col:C('596c61'),glazed:true});
  vwCottageWindow006(S,A,6.3,5.1,4.65,10.6,{leaded:true,woodLintel:true,curtain:true});
  vwCottageWindow006(S,B,1.3,5.4,4.8,10.8,{leaded:true,woodLintel:true});
  vwPlainDoor006(S,B,8.5,.6,3.3,16.0,{col:C('777d64')});
  vwCottageWindow006(S,BR,3.5,6.1,4.2,10.1,{right:true,leaded:true,lit:false});
  vwCottageWindow006(S,BR,6.1,27.4,3.2,7.6,{right:true,leaded:true,lit:false});
  // Solid stone stacks, irregular domestic gardens, and two working gates.
  chimney(S,3.7,15.1,40.0,2.1,2.0,1,622);
  chimney(S,16.1,16.1,43.7,2.55,2.2,2,623);
  vwCobbles006(S,3.2,7.2,23.1,30.7,624);vwCobbles006(S,23.6,28.1,24.0,30.7,625);
  vwGardenWall006(S,[1,30.3],[3.4,30.3],3.4,626,true);
  vwGardenWall006(S,[7.1,30.3],[23.7,30.3],3.4,627,true);
  vwGardenWall006(S,[27.8,30.3],[31,30.3],3.4,628,true);
  vwGardenWall006(S,[31,19.2],[31,30.3],3.4,629,true);
  vwGardenWall006(S,[15.7,24.3],[15.7,30.3],2.8,630,true);
  vwGate006(S,[3.5,30.3],[7.0,30.3],3.5);vwGate006(S,[23.8,30.3],[27.7,30.3],3.5);
  bush(S,10.7,27.7,1.65,3.1,true);bush(S,19.4,28.1,1.4,2.8,true);
  vwPot006(S,28.7,25.4,false);downpipe(S,15.5,23.2,23.4);
  return S.finish();
}

function brickCatslideCottage006(spec) {
  const S=Scene(spec);vwGarden006(S,640);
  vwCobbles006(S,11.7,16.8,25.0,31,641);
  // The continuous long rear slope genuinely descends to a single-storey outshot.
  const F=S.face([4.5,25.0],[24.1,25.0]),R=S.face([24.1,5.0],[24.1,25.0]);
  F.panel(0,19.6,0,35.0,vwBrick006(false,642),0);
  S.poly([[24.1,5,0],[24.1,25,0],[24.1,25,35],[24.1,18,49],[24.1,5,19]],(i,j,z)=>vwBrick006(true,643)(j-5,z),0);
  S.wall([4.5,5],[24.1,5],0,19,(i,j,z)=>vwBrick006(true,644)(i,z),0);
  S.poly([[4.1,4.55,18.4],[24.55,4.55,18.4],[24.55,18,49.3],[4.1,18,49.3]],vwClay006(true,645,'i'));
  S.poly([[4.1,18,49.3],[24.55,18,49.3],[24.55,25.5,34.8],[4.1,25.5,34.8]],vwClay006(false,646,'i'));
  ridge(S,[4.1,18],[24.55,18],49.3,C('ba8664'));
  S.line([24.55,4.55,18.4],[24.55,18,49.3],C('9d7158'),1);
  S.line([24.55,18,49.3],[24.55,25.5,34.8],C('9d7158'),1);
  S.line([4.1,25.5,34.8],[24.55,25.5,34.8],P.iron,1);
  vwPlainDoor006(S,F,7.9,.6,3.8,16.4,{col:C('526b5e'),glazed:true});
  for(const u of [1.1,13.45]){
    vwCottageWindow006(S,F,u,5.2,5.0,10.4,{panes:3,curtain:u<2});
    vwCottageWindow006(S,F,u+.3,23.0,4.4,8.9,{panes:2,lit:u>10});
  }
  // Rear kitchen casement and low plank back door are on the outshot's side.
  vwCottageWindow006(S,R,1.3,4.2,4.3,9.4,{right:true});
  vwPlainDoor006(S,R,6.6,.4,3.1,13.7,{right:true,col:C('626f5c')});
  vwCottageWindow006(S,R,12.6,22.0,3.2,9.3,{right:true,lit:false});
  chimney(S,20.2,16.8,47.3,2.8,2.7,2,647);
  downpipe(S,24.5,25.0,34.4);downpipe(S,24.45,5.2,18.5);
  vwKitchenBed006(S,26.0,30.3,5.3,11.6,648);
  vwKitchenBed006(S,26.0,30.3,14.1,20.6,649);
  vwGardenWall006(S,[30.9,3.8],[30.9,24.2],3.0,650,false);
  vwGate006(S,[30.9,24.2],[30.9,28.3],3.0);
  bush(S,6.7,28.4,1.8,3.5,true);bush(S,22.2,28.3,1.9,3.6,true);
  vwPot006(S,17.8,26.5,true);
  return S.finish();
}

function courtyardCottages006(spec) {
  const S=Scene(spec);vwGarden006(S,660);
  vwCobbles006(S,12.0,30.7,13.3,30.6,661);
  // A two-storey dwelling range and genuinely lower perpendicular cottage wing.
  const F=S.face([2.8,14.1],[28.8,14.1]),R=S.face([28.8,3.8],[28.8,14.1]);
  F.panel(0,26,0,31.8,vwRubble006(false,662),0);R.panel(0,10.3,0,31.8,vwRubble006(true,663),0);
  vwRoof006(S,2.3,29.3,3.3,14.6,32.0,16.4,664,{clay:true,gable:vwRubble006(true,665)});
  for(const u of [2.0,13.8]){
    vwPlainDoor006(S,F,u,.6,3.1,14.8,{col:u<5?C('636e57'):C('526858'),glazed:true});
    vwCottageWindow006(S,F,u+4.6,4.4,4.5,10.0,{leaded:true});
    vwCottageWindow006(S,F,u+1.4,22.0,4.0,7.6,{lit:u>5});
  }
  vwCottageWindow006(S,R,2.9,5.0,4.0,10.0,{right:true});
  vwCottageWindow006(S,R,3.0,22.0,3.5,7.7,{right:true,lit:false});
  const WF=S.face([2.8,27.5],[12.2,27.5]),WR=S.face([12.2,13.2],[12.2,27.5]);
  WF.panel(0,9.4,0,21.0,vwBrick006(false,666),0);WR.panel(0,14.3,0,21.0,vwBrick006(true,667),0);
  vwRoof006(S,2.3,12.7,12.5,28.0,21.3,12.7,668,{axis:'j',clay:true,gable:vwBrick006(false,669)});
  vwCottageWindow006(S,WF,2.1,5.1,5.1,10.4,{panes:3,curtain:true});
  vwCottageWindow006(S,WR,1.2,4.8,3.4,9.7,{right:true,lit:false});
  vwPlainDoor006(S,WR,6.3,.5,3.15,14.7,{right:true,col:C('6c765e')});
  vwCottageWindow006(S,WR,10.6,5.0,2.4,9.3,{right:true});
  chimney(S,6.5,8.1,46.3,2.6,2.2,2,670);chimney(S,6.3,19.6,31.9,2.0,2.1,1,671);
  downpipe(S,28.9,14.3,31.8);downpipe(S,12.35,25.8,21);
  // Cobbled access stays open all the way to the lane; enclosure is low.
  vwGardenWall006(S,[30.7,16],[30.7,30.4],3.0,672,true);
  vwGardenWall006(S,[12.6,30.4],[20.0,30.4],2.8,673,true);
  vwGardenWall006(S,[26.0,30.4],[30.7,30.4],2.8,674,true);
  vwGate006(S,[20.1,30.4],[25.9,30.4],2.9);
  vwPot006(S,14.1,23.3,true);vwPot006(S,27.8,17.0,false);
  bench(S,16.5,17.7,4.7);
  S.box(27.0,29.2,23.0,25.2,0,2.6,C('a09b84'),C('807d6d'),C('797f6c'));
  bush(S,28.1,24.1,1.0,3.7,false);
  return S.finish();
}

function thatchedLongCottage006(spec) {
  const S=Scene(spec);vwGarden006(S,680);
  const cob=(right)=>(u,z)=>{
    const n=hash(Math.floor(u/2.7),Math.floor(z/2.5),681);
    if(z<3.1)return right?C('a3a18a'):C('b8b7a0');
    if(z>17.6)return right?C('c0bda5'):C('d8d4b9');
    return right?(n%19===0?C('c2bea7'):C('ccc7ad')):(n%23===0?C('ddd9c0'):C('e5dfc6'));
  };
  const F=S.face([2.6,24.0],[29.1,24.0]),R=S.face([29.1,12.7],[29.1,24.0]);
  F.panel(0,26.5,0,19.2,cob(false),0);R.panel(0,11.3,0,19.2,cob(true),0);
  // A rounded, thick thatch section made from several roof facets, with reed
  // courses following the slope. There is no slate grid, jetty, or half timber.
  const thatch=(right)=>(i,j,z)=>{
    const n=hash(Math.floor(i*1.6),Math.floor(j*.9),683),course=mod(j*1.9+z*.11,2.25);
    if(course<.17)return right?C('887b51'):C('aa9967');
    return right?(n%13===0?C('a59867'):C('9b8c5e')):(n%17===0?C('c9b77c'):C('bdac72'));
  };
  const sections=[[11.7,18.0],[13.2,23.7],[17.0,37.7],[18.2,40.1],[19.5,37.7],[23.5,23.6],[25.1,18.0]];
  for(let q=0;q<sections.length-1;q++){
    const [j0,z0]=sections[q],[j1,z1]=sections[q+1];
    S.poly([[1.8,j0,z0],[29.8,j0,z0],[29.8,j1,z1],[1.8,j1,z1]],thatch(q<3));
  }
  S.poly([[29.1,12.7,18.5],[29.1,24,18.5],[29.1,18.2,39.2]],(i,j,z)=>cob(true)(j,z),-.03);
  // Deep straw rolls at both eaves and a stitched saddle ridge.
  S.wall([1.8,25.1],[29.8,25.1],16.7,18.1,C('9b8b59'),.03);
  S.line([1.8,25.1,18.2],[29.8,25.1,18.2],C('d0bd81'),1);
  S.line([1.8,18.2,40.2],[29.8,18.2,40.2],C('cbb983'),1);
  for(let i=2.7;i<29.1;i+=1.4){
    S.line([i,17.35,38.7],[i+.75,19.1,38.5],C('8e7a50'),1);
    S.line([i,19.1,38.5],[i+.75,17.35,38.7],C('ac9763'),1);
  }
  vwPlainDoor006(S,F,10.9,.45,3.8,14.5,{col:C('5a6a57')});
  vwCottageWindow006(S,F,2.2,5,5.8,8.6,{panes:3,curtain:true,woodLintel:true});
  vwCottageWindow006(S,F,18.1,5,5.3,8.6,{panes:3,woodLintel:true});
  vwCottageWindow006(S,R,4.8,4.8,3.8,8.3,{right:true,lit:false});
  // The rear lean-to has boarded cladding and its own clearly lower roof plane.
  const LR=S.face([29.1,5.3],[29.1,12.9]);
  LR.panel(0,7.6,0,12.4,(u,z)=>mod(u,1.1)<.12?C('4b5144'):C('69705b'),0);
  S.poly([[21.4,5.0,12.4],[29.5,5.0,12.4],[29.5,12.8,19.4],[21.4,12.8,19.4]],vwClay006(true,684,'i'));
  S.poly([[29.1,5.3,12.3],[29.1,12.9,12.3],[29.1,12.9,19.4]],C('626953'),-.02);
  vwPlainDoor006(S,LR,2.2,.2,2.9,10.8,{right:true,col:C('747962')});
  chimney(S,4.1,17.1,38.2,2.6,2.4,1,685);
  vwCobbles006(S,12.4,17.8,24.0,31.0,686);
  vwGate006(S,[2.0,29.7],[12.3,29.7],2.8);vwGate006(S,[17.9,29.7],[30.6,29.7],2.8);
  bush(S,7.5,27.0,1.55,3.3,true);bush(S,23.3,27.2,1.5,3.0,true);
  vwKitchenBed006(S,2.0,6.6,5.0,9.6,687);
  return S.finish();
}

function vwWorkersBase006(S,seed) {
  vwCobbles006(S,.6,31.4,.6,31.4,seed);
  // The same narrow stone footway, frontage line and eaves bind the street set.
  S.flat(.6,31.4,30.15,31.4,.24,(i,j)=>mod(i,3.6)<.12?C('969787'):C('bbb5a2'),.03,1);
  S.line([.6,31.35,.2],[31.4,31.35,.2],C('83897e'),1);
}
function vwWorkersFace006(S,F,width,seed,opt) {
  opt=opt||{};const right=!!opt.right,h=opt.h||37.6;
  F.panel(0,width,0,h,vwBrick006(right,seed),0);
  F.panel(0,width,h-1.7,h-.8,right?C('704d43'):C('93614e'),.10);
  F.panel(0,width,18.8,19.3,right?C('9c8066'):C('c49f79'),.10);
}
function vwWorkerAddress006(S,F,u,opt) {
  opt=opt||{};const right=!!opt.right;
  vwPlainDoor006(S,F,u+.8,.45,2.7,15.8,{right,col:opt.col||C('4c6557'),glazed:true});
  vwCottageWindow006(S,F,u+4.35,4.9,4.35,10.4,{right,curtain:true,lit:opt.lit!==false});
  vwCottageWindow006(S,F,u+3.05,24.3,4.3,10.2,{right,lit:opt.upperLit!==false});
  F.panel(u+.8,u+3.5,17.4,18.1,right?C('a38166'):C('c79d76'),.16);
}
function vwLaundry006(S,a,b,z) {
  S.line([a[0],a[1],0],[a[0],a[1],z+.4],C('766954'),1);
  S.line([b[0],b[1],0],[b[0],b[1],z+.4],C('766954'),1);
  S.line([a[0],a[1],z],[b[0],b[1],z],C('b0a38c'),1);
  for(const [q,col]of [[.27,C('d3cbb2')],[.64,C('a8b1a5')]]){
    const p=lerp(a,b,q),r=lerp(a,b,q+.16);
    S.wall([p[0],p[1]],[r[0],r[1]],z-3.4,z-.2,col,.02);
  }
}

function workersNarrowRow006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,700);
  const F=S.face([.65,30.0],[31.35,30.0]),R=S.face([31.35,12.0],[31.35,30.0]);
  vwWorkersFace006(S,F,30.7,701);vwWorkersFace006(S,R,18.0,702,{right:true});
  vwRoof006(S,.6,31.4,11.6,30.25,37.8,10.1,703,{gable:vwBrick006(true,704)});
  for(const [k,u]of [0,10.2,20.4].entries()){
    vwWorkerAddress006(S,F,u,{col:[C('476454'),C('6b6a5a'),C('54666b')][k],upperLit:k!==1,lit:k!==2});
    if(k)F.panel(u-.13,u+.13,1,37.2,C('8c594a'),.12);
  }
  // Flat-fronted addresses and shared stacks, deliberately no Victorian bays.
  chimney(S,9.2,19.6,47.2,2.15,2.4,2,705);
  chimney(S,19.4,19.6,47.2,2.15,2.4,2,706);
  vwCottageWindow006(S,R,3.1,6.0,3.1,8.3,{right:true,lit:false});
  vwCottageWindow006(S,R,3.2,25.4,3.0,8.8,{right:true,lit:false});
  downpipe(S,10.25,30.15,37.4);downpipe(S,30.9,30.15,37.4);
  for(const i of [1.5,11.7,21.9])S.flat(i,i+2.8,30.02,30.95,.55,P.stoneR,.08);
  // Rear service strip is paved, not a lawn around each house.
  vwGardenWall006(S,[31.0,1.2],[31.0,10.4],3.0,707,false);
  vwGate006(S,[27.5,2],[30.9,2],3.3);
  return S.finish();
}

function workersYardTerrace006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,720);
  // The two-address range ends at a genuine side service alley. Its low rear
  // kitchens and divided yards are visible beyond that end, rather than buried
  // behind a full-width street wall. The left join keeps the common eave datum.
  for(const [k,i]of [1.5,15.8].entries()){
    const rear=[3.8,6.0][k],end=i+4.2;
    const KR=S.face([end,rear],[end,22.0]),KF=S.face([i,22],[end,22]);
    KR.panel(0,22-rear,0,14.4,vwBrick006(true,722+k*3),0);
    KF.panel(0,4.2,0,14.4,vwBrick006(false,723+k*3),0);
    S.poly([[i-.25,rear-.3,15.0],[end+.25,rear-.3,15.0],[end+.25,22.2,22.3],[i-.25,22.2,22.3]],tileRoof(true,724+k*3,'i'));
    S.poly([[end,rear,14.4],[end,22,14.4],[end,22,22.1]],(ii,j,z)=>vwBrick006(true,730+k)(j,z),-.02);
    vwPlainDoor006(S,KR,2.0,.2,2.55,11.2,{right:true,col:C('5a6657')});
    vwCottageWindow006(S,KR,7.1,4.2,3.0,7.2,{right:true,lit:k===1});
  }
  // Two low-walled yards have separate gates onto the continuous back passage.
  vwGardenWall006(S,[11.1,3.4],[11.1,21.9],3.6,734,false);
  vwGardenWall006(S,[.9,3.4],[6.7,3.4],3.4,737,false);
  vwGate006(S,[6.8,3.4],[10.9,3.4],3.3);
  vwGardenWall006(S,[11.2,3.4],[23.2,3.4],3.4,738,false);
  vwGate006(S,[23.3,3.4],[27.1,3.4],3.3);
  vwGardenWall006(S,[27.2,3.4],[31.0,3.4],3.4,739,false);
  vwGardenWall006(S,[31.0,3.4],[31.0,29.8],3.6,740,false);
  S.flat(.8,31.2,.8,3.25,.22,(i,j)=>mod(i,2.4)<.15?C('8b8d80'):C('a1a191'),.03,1);
  const F=S.face([.65,30.0],[21.2,30.0]),R=S.face([21.2,21.9],[21.2,30.0]);
  vwWorkersFace006(S,F,20.55,741);vwWorkersFace006(S,R,8.1,742,{right:true});
  vwRoof006(S,.6,21.55,21.5,30.25,37.8,9.7,743,{gable:vwBrick006(true,744)});
  for(const [k,u]of [0,10.2].entries())vwWorkerAddress006(S,F,u,{col:[C('5f6b58'),C('546a64')][k],upperLit:k!==0});
  vwCottageWindow006(S,R,2.3,6.0,3.4,9.6,{right:true,lit:false});
  vwCottageWindow006(S,R,2.3,24.6,3.4,9.8,{right:true,lit:false});
  chimney(S,9.4,24.8,46.8,2.1,1.9,2,745);chimney(S,18.8,24.8,46.8,2.1,1.9,2,746);
  downpipe(S,10.3,30.15,37.4);downpipe(S,20.9,30.15,37.4);
  // The side alley is open from the street gate to the rear passage. The privy,
  // coal store and clothes line stay against its outside wall, leaving a path.
  vwGardenWall006(S,[21.7,29.8],[23.3,29.8],3.4,750,false);
  vwGardenWall006(S,[29.2,29.8],[31.0,29.8],3.4,751,false);
  vwGate006(S,[23.4,29.8],[29.1,29.8],3.5);
  S.box(27.6,30.2,4.5,7.3,0,8.3,(i,j,z)=>vwBrick006(false,747)(i,z),(i,j,z)=>vwBrick006(true,748)(j,z),P.roofR[0]);
  S.poly([[27.4,4.3,8.2],[30.4,4.3,8.2],[30.4,7.5,9.6],[27.4,7.5,9.6]],tileRoof(false,749,'i'));
  vwPlainDoor006(S,S.face([27.6,7.3],[30.2,7.3]),.5,.2,1.6,6.5,{col:C('665f4e')});
  vwLaundry006(S,[22.5,10.0],[29.3,14.8],7.1);
  S.box(28.1,30.3,17.1,19.2,0,2.5,C('6a6455'),C('4e5147'),C('414841'));
  vwPot006(S,29.2,22.0,false);
  return S.finish();
}

function workersCourt006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,760);
  // A compact urban back-to-back court. The street range's outer homes face
  // j=30 and its inner homes face j=22.7, sharing their rear wall at j=26.35.
  // The side pairs share a rear wall at i=5.05; their visible doors face the court.
  // A north range and low washhouse enclose the yard without filling its access.
  const BF=S.face([.7,10.2],[24.0,10.2]),BR=S.face([24.0,2.0],[24.0,10.2]);
  vwWorkersFace006(S,BF,23.3,761,{h:38.7});vwWorkersFace006(S,BR,8.2,762,{h:38.7,right:true});
  vwRoof006(S,.6,24.4,1.6,10.6,38.9,9.8,763,{gable:vwBrick006(true,764)});
  for(const [k,u]of [1.2,12.1].entries()){
    vwPlainDoor006(S,BF,u,.4,2.8,15.5,{col:k?C('64715f'):C('536859'),glazed:true});
    vwCottageWindow006(S,BF,u+4.5,4.7,4.1,10.4,{curtain:true});
    vwCottageWindow006(S,BF,u+3.0,24.6,4.4,10.5,{lit:k===1});
  }
  chimney(S,10.5,5.0,47.6,2.3,2.1,2,765);
  const LF=S.face([.7,23.1],[9.4,23.1]),LR=S.face([9.4,10.0],[9.4,23.1]);
  vwWorkersFace006(S,LF,8.7,766,{h:32});vwWorkersFace006(S,LR,13.1,767,{h:32,right:true});
  vwRoof006(S,.6,9.8,9.7,23.4,32.2,8.4,768,{axis:'j',gable:vwBrick006(false,769)});
  vwPlainDoor006(S,LR,2.0,.4,2.6,14.3,{right:true,col:C('677361'),glazed:true});
  vwCottageWindow006(S,LR,6.3,4.8,3.8,9.0,{right:true});
  vwCottageWindow006(S,LR,5.6,22.0,3.8,7.3,{right:true,lit:false});
  // The two-address street range is truly back-to-back, but stops before the
  // side access. Removing its former right-hand bay reveals the court ground.
  const F=S.face([.65,30.0],[21.4,30.0]),R=S.face([21.4,22.7],[21.4,30]);
  vwWorkersFace006(S,F,20.75,770);vwWorkersFace006(S,R,7.3,771,{right:true});
  const CF=S.face([21.4,22.7],[.65,22.7]);
  CF.panel(0,20.75,0,37.6,vwBrick006(true,782),0);
  for(const u of [1.0,11.2]){
    vwPlainDoor006(S,CF,u,.4,2.7,15.3,{right:true,col:C('596855'),glazed:true});
    vwCottageWindow006(S,CF,u+4.4,5.0,3.9,10.1,{right:true,lit:false});
    vwCottageWindow006(S,CF,u+2.4,24.7,4.1,10.0,{right:true,lit:false});
  }
  S.flat(.65,21.4,22.7,30,37.6,P.brickR[0]);
  vwRoof006(S,.6,21.75,22.3,30.25,37.8,9.7,772,{gable:vwBrick006(true,773)});
  for(const u of [.2,10.6])vwWorkerAddress006(S,F,u,{upperLit:u<1});
  vwCottageWindow006(S,R,2.0,24.6,3.2,9.9,{right:true,lit:false});
  chimney(S,10.2,25.1,46.7,2.25,1.9,2,774);
  downpipe(S,20.8,30.15,37.4);
  // A shallow, low arched gatehouse covers the route. Both ends use the same
  // actual opening; there is no opaque rear wall or painted imitation doorway.
  const gateFront=S.face([21.6,30.0],[31.0,30.0]);
  const gateBack=S.face([21.6,27.2],[31.0,27.2]);
  const archTop=u=>11.8+3.1*Math.sqrt(Math.max(0,1-((u-4.7)/3.25)**2));
  const archMat=(u,z)=>u>1.45&&u<7.95&&z<archTop(u)?null:vwBrick006(false,783)(u,z);
  gateFront.panel(0,9.4,0,16.3,archMat,0);
  gateBack.panel(0,9.4,0,16.3,archMat,0);
  S.wall([23.05,27.2],[23.05,30],0,11.8,C('735647'),0);
  S.wall([29.55,27.2],[29.55,30],0,11.8,C('8c6650'),0);
  S.wall([31.0,27.2],[31.0,30],0,16.3,(i,j,z)=>vwBrick006(true,784)(j,z),0);
  S.flat(23.05,29.55,27.2,30,15.4,C('55483c'),-.02);
  vwRoof006(S,21.4,31.25,26.95,30.25,16.5,2.8,785,{gable:vwBrick006(true,786)});
  for(let k=0;k<12;k++){
    const x=1.45+(k+.5)*6.5/12,z=archTop(x)+.35;
    gateFront.panel(x-.22,x+.22,z-.25,z+.5,C('bf946e'),.18);
  }
  // Small shared brewhouse / washhouse has a chimney, sink and drying yard.
  const W=S.face([25.4,11.0],[31.0,11.0]),WR=S.face([31,3.2],[31,11]);
  W.panel(0,5.6,0,12.0,vwBrick006(false,775),0);WR.panel(0,7.8,0,12.0,vwBrick006(true,776),0);
  vwRoof006(S,25.0,31.35,2.8,11.4,12.2,5.3,777,{axis:'j',gable:vwBrick006(false,778)});
  vwPlainDoor006(S,W,1.6,.3,2.5,9.9,{col:C('6a6e5c')});
  chimney(S,28.0,4.0,16.0,1.3,1.4,1,779);
  S.box(26.4,28.9,13.0,14.7,0,2.8,C('a7a28b'),C('827f6e'),C('646d65'));
  S.line([29.7,13.7,0],[29.7,13.7,6.0],P.iron,1);
  S.line([29.7,13.7,5.9],[28.9,13.7,5.9],P.ironHi,1);
  vwLaundry006(S,[21.8,14.7],[28.6,18.0],7.8);
  vwGardenWall006(S,[31.1,12.0],[31.1,20.3],3.2,780,false);
  return S.finish();
}

function workersCornerShop006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,800);
  // Housing continues across the street frontage; only the narrow corner bay is
  // a shop. The separate stair door and stepped rear wing make its homes explicit.
  const LF=S.face([.65,30],[19.2,30]),LR=S.face([19.2,18.2],[19.2,30]);
  vwWorkersFace006(S,LF,18.55,801);vwWorkersFace006(S,LR,11.8,802,{right:true});
  vwRoof006(S,.6,19.5,17.8,30.25,37.8,9.7,803,{gable:vwBrick006(true,804)});
  vwWorkerAddress006(S,LF,.05,{col:C('556d62'),upperLit:false});
  vwPlainDoor006(S,LF,13.7,.45,3.1,16.8,{col:C('565f55'),glazed:true});
  vwCottageWindow006(S,LF,12.1,24.1,4.5,10.4,{curtain:true});
  // Two occupied upper rooms over the shop, not a freestanding high-street hall.
  const F=S.face([19.2,30],[31.35,30]),R=S.face([31.35,17.3],[31.35,30]);
  F.panel(0,12.15,0,42.2,vwBrick006(false,805),0);R.panel(0,12.7,0,42.2,vwBrick006(true,806),0);
  vwRoof006(S,18.9,31.4,16.9,30.25,42.4,10.6,807,{gable:vwBrick006(true,808)});
  const green=C('425e51'),greenR=C('324a40'),trim=C('849080');
  F.panel(.2,11.95,1.0,18.5,green,.11);R.panel(5.3,12.5,1,18.5,greenR,.11);
  windowOn(S,F,.75,4.5,6.6,12.3,{panes:3,transom:9.1,lit:true,border:.34});
  F.panel(.6,7.5,1.0,4.2,greenR,.24);
  vwPlainDoor006(S,F,8.1,.4,3.15,16.4,{col:green,glazed:true});
  windowOn(S,R,6.0,4.5,5.7,12.3,{right:true,panes:3,transom:9.1,lit:true,border:.34});
  R.panel(5.8,12,1,4.2,greenR,.24);
  // Small shop fascia turns the corner in its own facade planes.
  F.panel(0,12.15,18.0,21.5,green,.2);R.panel(5.0,12.7,18.0,21.5,greenR,.2);
  F.panel(0,12.15,21.1,21.8,trim,.3);R.panel(5.0,12.7,21.1,21.8,C('69796c'),.3);
  letters(F,'STORES',1.1,18.6,.40,C('d2c299'));
  for(const u of [1.4,7.2])vwCottageWindow006(S,F,u,27.0,3.8,10.7,{curtain:true,lit:u<2});
  for(const u of [1.1,7.6])vwCottageWindow006(S,R,u,27.0,3.6,10.7,{right:true,lit:u>5});
  // Lower rear domestic wing, plus a real back entrance onto the side street.
  const WF=S.face([22.3,17.5],[31.35,17.5]),WR=S.face([31.35,5.0],[31.35,17.5]);
  WF.panel(0,9.05,0,25.7,vwBrick006(false,809),0);WR.panel(0,12.5,0,25.7,vwBrick006(true,810),0);
  vwRoof006(S,21.9,31.4,4.6,17.9,25.9,8.8,811,{axis:'j',gable:vwBrick006(false,812)});
  vwPlainDoor006(S,WR,1.2,.4,2.9,14.4,{right:true,col:C('5c6b5b'),glazed:true});
  vwCottageWindow006(S,WR,6.6,6.0,3.8,10.0,{right:true,lit:false});
  chimney(S,9.2,22.9,46.5,2.2,2.0,2,813);
  chimney(S,26.1,22.9,51.9,2.1,2.1,2,814);
  chimney(S,25.9,7.6,33.8,1.7,1.7,1,815);
  downpipe(S,19.1,30.15,37.4);downpipe(S,31.25,18.0,41.8);
  // A restrained doorstep display leaves both streets and the stair door clear.
  S.box(20.2,22.1,30.1,31.0,0,2.4,C('8e7858'),C('705e48'),C('89905f'));
  lamp(S,30.8,30.3,2.8,19.1);
  vwGardenWall006(S,[20.5,2.1],[20.5,15.3],3.1,816,false);
  vwGate006(S,[20.5,2.1],[26.0,2.1],3.1);
  return S.finish();
}
