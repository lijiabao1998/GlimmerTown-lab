// GPT-006 UKR01–08. Original residential massing, not variants of legacy sprites.
// This fragment is concatenated inside the native residential-art006 IIFE.
// Common street datum: Georgian facade j=24, eaves z=56, pavement j=29.6–31.4.

function gvStock006(right,seed) {
  const pal=right?[C('84765b'),C('8b7b5f'),C('7f7057')]:[C('b6a17e'),C('baa582'),C('ae9976')];
  return (u,z)=>{
    const row=Math.floor(z/1.65),n=hash(Math.floor((u+(row&1)*1.1)/2.2),row,seed);
    if(z<2.4)return right?P.stoneD:P.stoneR;
    if(mod(z,1.65)<.15||mod(u+(row&1)*1.1,2.2)<.09)return right?C('7b705b'):C('a18e71');
    if(z<5&&n%5===0)return pal[2];
    return pal[n%3];
  };
}

function gvWall006(S,a,b,h,right,seed,stone) {
  const F=S.face(a,b);
  F.panel(0,F.length,0,h,stone?gvStock006(right,seed):brick(right,seed,h),0);
  return F;
}

function gvBand006(F,z,h,right) {
  F.panel(0,F.length,z,z+h,right?P.stoneR:P.stone,.10);
  F.panel(0,F.length,z+h-.25,z+h+.2,right?P.stoneD:P.stoneHi,.14);
}

function gvSash006(S,F,u,z,w,h,opt) {
  opt=opt||{};
  const right=!!opt.right,frame=right?P.frameR:P.frame,border=.33;
  F.panel(u-.35,u+w+.35,z-.65,z+.2,right?P.stoneD:P.stoneR,.14);
  F.panel(u-.42,u+w+.42,z-.18,z+.48,right?P.stoneR:P.stoneHi,.24);
  F.panel(u-.24,u+w+.24,z+h-.1,z+h+.9,right?P.stoneR:P.stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(x<border||x>w-border||y<.5||y>h-.5||Math.abs(y-h*.49)<.32)return frame;
    const panes=opt.panes||2;
    for(let n=1;n<panes;n++)if(Math.abs(x-w*n/panes)<.16)return frame;
    if(opt.six&&(Math.abs(y-h*.25)<.17||Math.abs(y-h*.74)<.17))return frame;
    if(opt.curtain&&y<h*.88&&(x<w*.22||x>w*.84))return right?C('ac9e87'):C('d2c0a1');
    if(opt.leaded&&mod(x*1.25+y*.45,2.4)<.13)return right?P.iron:P.ironHi;
    return [y>h*.72?(right?P.glass:P.glassHi):(right?P.glassR:P.glass),opt.lit?P.warm[opt.warm||0]:0];
  },.2);
}

function gvDoor006(S,F,u,z,w,h,opt) {
  opt=opt||{};
  const right=!!opt.right,top=x=>h-2.8+2.8*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
  F.panel(u-.55,u+w+.55,z,z+h+.65,(x,y)=>{
    const tx=Math.max(0,Math.min(w,x-.55));
    return y>top(tx)+.6?null:(right?P.stoneR:P.stoneHi);
  },.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(y>top(x))return null;
    if(x<.3||x>w-.3||y>top(x)-.4)return right?P.wood:P.frame;
    if(y>h-3.4){
      if(Math.abs(y-(h-3.15))<.18||Math.abs(x-w/2)<.13||Math.abs((x-w/2)*1.3-y+h-3.15)<.14||Math.abs((x-w/2)*1.3+y-h+3.15)<.14)return P.frameR;
      return [right?P.glassR:P.glass,opt.lit?P.warm[1]:0];
    }
    if(y<.7)return P.iron;
    if(x>.6&&x<w-.6&&((y>2&&y<5.8)||(y>7.1&&y<h-4.4)))return opt.col===C('6a4b44')?C('80584c'):P.greenHi;
    if(x>w*.7&&x<w*.87&&y>6.3&&y<7)return P.gold;
    return opt.col||P.green;
  },.25);
  F.panel(u-.65,u+w+.65,z+h+.3,z+h+1.05,right?P.stoneR:P.stoneHi,.18);
}

function gvFrontRoof006(S,i0,i1,j0,j1,z,rise,seed,stock,ornate) {
  // Ridge runs into the plot, so the street sees an actual triangular gable.
  const m=(i0+i1)/2;
  S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tileRoof(false,seed,'j'));
  S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tileRoof(true,seed+1,'j'));
  S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>(stock?gvStock006(false,seed+2):brick(false,seed+2))(i,zz),.01);
  const trim=ornate?P.frame:P.stone;
  S.line([i0,j1+.04,z],[m,j1+.04,z+rise],trim,1);
  S.line([m,j1+.04,z+rise],[i1,j1+.04,z],trim,1);
  if(ornate){
    for(let s=1;s<7;s++){
      const t=s/7,x=i0+(m-i0)*t,zz=z+rise*t-1.1;
      S.line([x,j1+.08,zz],[x,j1+.08,zz-1.2],P.frameR,1);
      S.line([i1-(m-i0)*t,j1+.08,zz],[i1-(m-i0)*t,j1+.08,zz-1.2],P.frameR,1);
    }
    S.line([m,j1+.08,z+rise-2],[m,j1+.08,z+rise+2.6],P.wood,1);
  }
  ridge(S,[m,j0],[m,j1],z+rise,P.lead);
  S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  return S.face([i0,j1],[i1,j1]);
}

function gvGarden006(S,paths) {
  S.flat(.6,31.4,.6,31.4,0,(i,j)=>{
    const n=hash(Math.floor(i/2.2),Math.floor(j/2.2),630);
    if(j>30.2||(paths||[]).some(p=>i>p[0]&&i<p[1]&&j>p[2]))return P.path[n%4];
    return P.grass[n%3];
  },0,1);
  S.line([.6,31.35,0],[31.35,31.35,0],P.stoneR,1);
  S.line([31.35,.6,0],[31.35,31.35,0],P.stoneD,1);
}

function gvFence006(S,a,b,gate) {
  const F=S.face(a,b),L=F.length,segs=gate?[[0,gate[0]],[gate[1],L]]:[[0,L]];
  for(const [u,v]of segs){
    if(v<=u)continue;
    S.wall(F.point(u),F.point(v),0,1.4,P.brickR[1]);
    for(let x=u+.25;x<v;x+=1.05){const p=F.point(x);S.line([p[0],p[1],1.4],[p[0],p[1],4.9],P.iron,1);}
    for(const z of [2.2,4.2]){const p=F.point(u),q=F.point(v);S.line([p[0],p[1],z],[q[0],q[1],z],P.iron,1);}
  }
  for(const u of gate?[0,gate[0],gate[1],L]:[0,L]){
    const p=F.point(u),r=.35;
    S.box(p[0]-r,p[0]+r,p[1]-r,p[1]+r,0,5.0,P.brick[1],P.brickR[0],P.stone);
    S.box(p[0]-r-.1,p[0]+r+.1,p[1]-r-.1,p[1]+r+.1,4.7,5.3,P.stone,P.stoneR,P.stoneHi);
  }
}

function gvGeorgianFront006(S,F,start,width,seed,raised) {
  const base=raised?8.7:1.3,doorU=start+width-4.8;
  gvDoor006(S,F,doorU,base,3.2,raised?14.2:16.2,{lit:seed%3===0,col:seed%2?P.green:C('6a4b44')});
  gvSash006(S,F,start+2.1,base+3.2,3.7,raised?10:12.2,{six:true,lit:seed%2===0,curtain:true});
  for(const [row,z,h]of [[0,26,12.7],[1,44,8.6]]){
    gvSash006(S,F,start+2.1,z,3.7,h,{six:true,lit:(seed+row)%3===0});
    gvSash006(S,F,doorU-.25,z,3.7,h,{six:true,lit:(seed+row)%4===0,curtain:row===0});
  }
  F.panel(start+.35,start+.73,2,55.4,P.stoneR,.06);
  for(const z of [raised?24.1:22.5,41.2])F.panel(start+.5,start+width-.1,z,z+.55,P.stone,.09);
  if(raised)gvSash006(S,F,start+2.15,1.2,3.6,5.2,{panes:2,lit:false});
}

function gvGeorgianCornice006(S,i0,i1,j0,j1,z) {
  S.box(i0,i1,j0,j1,z-1.25,z-.35,P.stoneR,P.stoneD,P.stone);
  S.box(i0-.17,i1+.17,j0-.17,j1+.24,z-.35,z+.6,P.stone,P.stoneR,P.stoneHi);
  S.line([i0,j1+.25,z-.7],[i1,j1+.25,z-.7],P.stoneHi,1);
}

function georgianRow006(spec) {
  const S=Scene(spec);ground(S,'paved');
  const F=gvWall006(S,[.8,24],[31.2,24],56,false,641,true),R=gvWall006(S,[31.2,9.8],[31.2,24],56,true,642,true);
  S.flat(.8,31.2,9.8,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,15.2,643,false);gvGeorgianFront006(S,F,15.2,15.2,644,false);
  gvBand006(R,22.5,.6,true);gvBand006(R,41.2,.55,true);
  // Plain party-end brick is intentional: the next module continues the row.
  R.panel(3.0,5.2,28,37,C('80745e'),.01);
  gvGeorgianCornice006(S,.8,31.2,9.8,24,56);
  gableRoof(S,.6,31.4,9.5,24.3,57,11.6,645);
  for(const i of [.95,15.3,29.1])chimney(S,i,15.9,65.0,1.9,2.5,2,646+Math.floor(i));
  for(const i of [15.75,30.9])downpipe(S,i,24.32,55,2);
  for(const i of [10.75,25.95]){
    step(S,i,i+3.9,24,26,2);
    S.flat(i-.2,i+4.1,25.4,31.3,.02,P.path[2],.03,1);
  }
  railing(S,[.8,29.5],[15.8,29.5],5.3,[9.6,14.2]);
  railing(S,[16,29.5],[31.2,29.5],5.3,[9.7,14.3]);
  railing(S,[15.8,24.6],[15.8,29.5],5.3);
  for(const i of [3.4,19.1])bush(S,i,26.6,.78,2.1,false);
  return S.finish();
}

function georgianCorner006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // The return wing reaches the back plot edge: a genuine L around an open yard.
  const side=gvWall006(S,[25.4,.8],[25.4,24],56,true,651,true);
  const front=gvWall006(S,[.8,24],[25.4,24],56,false,652,true);
  gvWall006(S,[.8,10.8],[18.2,10.8],56,false,653,true);
  S.flat(.8,25.4,10.8,24,56,P.stoneR);S.flat(12.4,25.4,.8,17.4,56,P.stoneR);
  // Inner wing face remains visible above the lower courtyard service lean-to.
  const yard=gvWall006(S,[12.4,10.8],[18.2,10.8],56,false,654,true);
  for(const z of [27,44])gvSash006(S,yard,1,z,3.3,z<40?11:8,{six:true,lit:false});
  gvGeorgianFront006(S,front,0,14,655,false);
  for(const z of [4.5,26,44])for(const u of [15.1,20.2])gvSash006(S,front,u,z,3.1,z>40?8.6:12.7,{six:true,lit:(u<17&&z<30)});
  gvBand006(front,22.5,.6,false);gvBand006(front,41.2,.6,false);
  for(const z of [5,26,44])for(const u of [2.2,9.2,16.3])gvSash006(S,side,u,z,3.2,z>40?8.5:12.3,{right:true,six:true,lit:z===26&&u>15});
  // Return entrance and its side-facing footpath make both streets usable.
  gvDoor006(S,side,9.05,1.3,3.5,16.2,{right:true,lit:false});
  gvBand006(side,22.5,.6,true);gvBand006(side,41.2,.6,true);
  gvGeorgianCornice006(S,.8,25.4,10.8,24,56);
  gvGeorgianCornice006(S,12.4,25.4,.8,17.4,56);
  gableRoof(S,.6,25.65,10.5,24.3,57,11.6,656);
  gvFrontRoof006(S,12.15,25.65,.6,17.4,57,11.6,657,true,false);
  chimney(S,1.1,15.8,65,2.0,2.4,2,658);chimney(S,19,3.1,65,2.2,2.4,2,659);
  // Brick rear washhouse below the long return, not an enclosed extra block.
  const service=gvWall006(S,[2.2,8.3],[10.8,8.3],13.8,false,660,true);
  gvWall006(S,[10.8,2.1],[10.8,8.3],13.8,true,661,true);
  S.poly([[2,1.9,19],[11,1.9,19],[11,8.6,14],[2,8.6,14]],tileRoof(false,662,'i'));
  doorway(S,service,1.2,.5,2.5,10.7,{col:C('667061')});
  downpipe(S,25.65,23.8,56);downpipe(S,14.3,24.3,56);
  step(S,10,14.1,24,26,2);
  S.box(25.4,27.8,9.4,13.8,0,.65,P.stoneR,P.stoneD,P.path[2]);
  S.box(25.4,26.5,9.4,13.8,.65,1.3,P.stoneR,P.stoneD,P.path[2]);
  railing(S,[.8,29.5],[25.4,29.5],5.3,[8.9,13.7]);
  railing(S,[29.8,.8],[29.8,29.5],5.3,[8.1,13.4]);
  bush(S,20.8,27,.9,2.5,false);
  return S.finish();
}

function georgianEnd006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Tall terminal pavilion plus a lower rear service wing, joined to row at left.
  const rear=gvWall006(S,[31.2,2.2],[31.2,13.5],39,true,671,true);
  gvWall006(S,[21.5,13.5],[31.2,13.5],39,false,672,true);
  for(const z of [6,23])for(const u of [2,7.0])gvSash006(S,rear,u,z,2.8,10,{right:true,six:true,lit:u<3&&z<10});
  gableRoof(S,21.25,31.4,1.95,13.75,40,10,673);
  chimney(S,27.5,6.3,47,2.4,2.1,2,674);
  const F=gvWall006(S,[.8,24],[17.3,24],56,false,675,true);
  S.flat(.8,17.3,10.0,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,16.5,676,false);
  gvGeorgianCornice006(S,.8,17.3,10,24,56);
  gableRoof(S,.6,18,9.7,24.3,57,11.6,677);
  const PF=gvWall006(S,[17.3,25.4],[31.2,25.4],60,false,678,true),PR=gvWall006(S,[31.2,10],[31.2,25.4],60,true,679,true);
  S.flat(17.3,31.2,10,25.4,60,P.stoneR);
  for(const z of [6,27,46])for(const u of [2.25,8.2])gvSash006(S,PF,u,z,3.4,z>40?9:12.4,{six:true,lit:u<3&&z<30});
  for(const z of [6,27,46])for(const u of [2.4,9.4])gvSash006(S,PR,u,z,3.4,z>40?9:12.4,{right:true,six:true,lit:z===27&&u>8});
  for(const FF of [PF,PR])for(const z of [22.5,41.2])gvBand006(FF,z,.8,FF===PR);
  // Rusticated pavilion corners, restrained rather than a stucco terrace copy.
  for(let z=3;z<59;z+=3.4)for(const u of [0,12.9])PF.panel(u,u+(z%6.8<3.4?.8:1.05),z,z+2.7,P.stone,.11);
  gvGeorgianCornice006(S,17.3,31.2,10,25.4,60);
  hipRoof(S,[[17.1,9.75],[31.4,9.75],[31.4,25.7],[17.1,25.7]],[21.8,17.7],[26.8,17.7],61,11.6,681);
  chimney(S,18.5,15.8,67.5,2.2,2.4,2,682);
  downpipe(S,31.05,25.67,59);downpipe(S,16.9,24.25,56);
  step(S,12,16.1,24,26,2);
  railing(S,[.8,29.5],[31.2,29.5],5.3,[10.9,15.7]);
  railing(S,[31.2,25.8],[31.2,29.5],5.3);
  bush(S,21,27.4,.85,2.6,false);bush(S,28,27.4,.7,2.3,false);
  return S.finish();
}

function georgianArea006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Raised principal floor above an exposed basement, with deep open areas.
  const F=gvWall006(S,[.8,24],[31.2,24],56,false,691,true),R=gvWall006(S,[31.2,8.8],[31.2,24],56,true,692,true);
  S.flat(.8,31.2,8.8,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,15.2,693,true);gvGeorgianFront006(S,F,15.2,15.2,694,true);
  gvBand006(F,8.4,.55,false);gvBand006(R,8.4,.55,true);
  for(const z of [12,28,44])gvSash006(S,R,5.2,z,3.5,z>40?8:10,{right:true,six:true,lit:z===28});
  gvGeorgianCornice006(S,.8,31.2,8.8,24,56);
  gableRoof(S,.6,31.4,8.5,24.3,57,12.5,695);
  for(const i of [1.0,15.3,29.1])chimney(S,i,14.9,66,1.9,2.6,2,696+Math.floor(i));
  // The basement floor is a dark stone surface at z=.1. Raised street retaining
  // walls and bridge slabs supply the section without negative ground geometry.
  for(const start of [.8,16]){
    const d=start+10.4;
    S.flat(start+.5,start+14.4,24.1,28.8,.1,C('777769'),.05,1);
    S.wall([start+.35,28.9],[start+14.6,28.9],.1,3.9,P.stoneD,.02);
    S.wall([start+.35,24],[start+.35,28.9],.1,3.9,P.stoneR,.02);
    S.line([start+.35,28.9,4],[start+14.6,28.9,4],P.stone,1);
    // Narrow stair descends along the side of the area, separately from entry.
    for(let n=0;n<5;n++)S.box(start+.65,start+2.15,24.6+n*.68,25.2+n*.68,.12,(n+1)*.72,P.stoneR,P.stoneD,P.path[1]);
    S.box(d-.2,d+3.75,24,27.0,7.8,8.65,P.stone,P.stoneR,P.stoneHi);
    // Four visible risers from the street datum lead to each bridge landing.
    for(let n=0;n<5;n++)S.box(d-.2,d+3.75,26.8,30.9-n*.76,0,(n+1)*1.73,P.stoneR,P.stoneD,P.path[2]);
    for(const ii of [d-.2,d+3.75]){
      for(const j of [24.5,25.8,27])S.line([ii,j,8.7],[ii,j,12.3],P.iron,1);
      S.line([ii,24.2,11.8],[ii,27,11.8],P.iron,1);
      S.line([ii,27,11.8],[ii,30.8,5.1],P.iron,1);
    }
    railing(S,[start+.35,29],[d-.3,29],7.8);
    railing(S,[d+3.85,29],[start+14.6,29],7.8);
  }
  downpipe(S,15.7,24.3,56);downpipe(S,30.95,24.3,56);
  return S.finish();
}

function victorianGabledSemi006(spec) {
  const S=Scene(spec);gvGarden006(S,[[12.2,15.7,20],[16.4,19.7,20]]);
  // Broad H plan: projecting gabled living-room wings and recessed twin doors.
  const CF=gvWall006(S,[11.3,20.7],[20.7,20.7],35.5,false,711,false);
  S.flat(10.8,21.2,7.8,20.7,35.5,P.brickR[0]);
  gableRoof(S,10.5,21.5,7.5,21,36,12.5,712);
  for(const u of [1.1,5.65]){
    gvDoor006(S,CF,u,.9,2.9,15.5,{lit:u<3});
    gvSash006(S,CF,u,22,2.9,9.7,{lit:u>3,panes:2});
  }
  for(const [k,a,b]of [[0,3.4,11.5],[1,20.5,28.6]]){
    const F=gvWall006(S,[a,24],[b,24],38,false,713+k*5,false),R=gvWall006(S,[b,7.7],[b,24],38,true,714+k*5,false);
    S.flat(a,b,7.7,24,38,P.brick[0]);
    gvBand006(F,19.3,1.0,false);gvBand006(R,19.3,1.0,true);
    gvSash006(S,F,1.35,4.7,5.35,11.8,{panes:3,lit:k===0,curtain:true});
    gvSash006(S,F,1.65,23,4.75,11.6,{panes:2,lit:k===1});
    for(const u of [3.1,10.1])for(const z of [5,23])gvSash006(S,R,u,z,3.6,10.8,{right:true,lit:k===1&&u>8&&z>20});
    const G=gvFrontRoof006(S,a-.35,b+.35,7.3,24.4,38.8,18,718+k,false,true);
    gvSash006(S,G,3.1,41.5,2.6,7.1,{panes:2,lit:false});
    for(const u of [.2,7.1])for(let z=3.4;z<37;z+=4.2)F.panel(u,u+.75,z,z+2.1,P.stone,.1);
    chimney(S,k?26.4:4.2,11.5,47,2.4,2.1,3,723+k);
    downpipe(S,b+.3,23.9,38);
  }
  // Separate entrance canopies stay below first-floor openings.
  for(const a of [12.15,16.65]){
    step(S,a,a+3.2,20.7,23.0,2);
    S.poly([[a-.25,20.4,18],[a+3.45,20.4,18],[a+3.45,23,16],[a-.25,23,16]],tileRoof(false,726,'i'));
    for(const i of [a-.1,a+3.3])S.line([i,22.65,1],[i,22.65,16.2],P.wood,1);
  }
  gvFence006(S,[1.1,30.2],[15.8,30.2],[10.8,14.6]);
  gvFence006(S,[16.2,30.2],[30.9,30.2],[.2,4.2]);
  gvFence006(S,[16,23.2],[16,30.2]);
  gvFence006(S,[30.9,2],[30.9,30.2]);
  for(const [i,j]of [[6.1,27.5],[24.7,27.3],[2,4.1]])bush(S,i,j,1.35,3.6,true);
  return S.finish();
}

function victorianBayVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[17.2,21.6,20.8],[28.7,30,6]]);
  // Asymmetrical main block with a single full-height canted bay and offset entry.
  const F=gvWall006(S,[4.4,21.4],[27.4,21.4],40,false,741,false),R=gvWall006(S,[27.4,6.4],[27.4,21.4],40,true,742,false);
  S.flat(4.4,27.4,6.4,21.4,40,P.brick[0]);
  gvBand006(F,20.6,.9,false);gvBand006(R,20.6,.9,true);
  gvDoor006(S,F,13.4,1.3,3.5,17.1,{lit:true});
  gvSash006(S,F,13.2,25.1,4.0,11.4,{lit:false});
  gvSash006(S,F,19.0,5,2.8,12.6,{lit:false});
  for(const z of [5.8,25.1])for(const u of [2.2,9.1])gvSash006(S,R,u,z,3.7,11.2,{right:true,lit:z>20&&u<4,curtain:true});
  gableRoof(S,4.1,27.75,6.05,21.7,40.8,14.5,743);
  // The polygon is real geometry, including two oblique sashes and deep reveals.
  const O=[[5.0,20.4],[14.9,20.4],[14.9,23.2],[12.8,25.4],[7.1,25.4],[5.0,23.2]];
  for(let n=1;n<O.length-1;n++){
    const A=O[n],B=O[n+1],right=n===1||n===2;
    const BF=gvWall006(S,A,B,39.8,right,745+n,false);
    gvBand006(BF,20.3,1.2,right);
    const W=BF.length-.9;
    for(const z of [5.1,24.1])gvSash006(S,BF,.45,z,W,11.8,{right,panes:W>4?3:1,lit:(n===3&&z<10)||(n===2&&z>20),curtain:n===3});
  }
  S.flat(5,14.9,20.4,23.2,39.8,P.stoneR);
  S.poly(O.map(p=>[p[0],p[1],39.8]),P.stone,.03);
  // Low faceted slate cap beneath the much taller gable of the same bay axis.
  for(let n=1;n<O.length-1;n++)S.poly([[O[n][0],O[n][1],40.4],[O[n+1][0],O[n+1][1],40.4],[9.95,20.9,47.9]],tileRoof(n<3,751+n,'i'));
  const GF=gvFrontRoof006(S,4.15,15.6,7.0,21.85,41.0,20.0,756,false,true);
  gvSash006(S,GF,4.3,44.2,3.1,8.0,{panes:2,lit:false});
  // Polygonal bay gutters, red brick panels and stone strings remain legible.
  for(let n=1;n<O.length-1;n++)S.line([O[n][0],O[n][1],40.4],[O[n+1][0],O[n+1][1],40.4],P.iron,1);
  chimney(S,22.8,12,52.5,2.7,2.1,3,759);chimney(S,5.1,10.4,54,2.1,2.0,2,760);
  // A substantial opaque pitched portico occludes the lower doorway overlight.
  S.poly([[17.3,21.1,21],[21.5,21.1,21],[21.5,24.4,18],[17.3,24.4,18]],tileRoof(false,761,'i'));
  for(const i of [17.5,21.3])S.box(i-.28,i+.28,24,24.5,0,18.1,P.stone,P.stoneR,P.stoneHi);
  step(S,17.65,21.6,21.4,25.0,2);
  downpipe(S,27.65,21.4,40);downpipe(S,15.4,21.6,40);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[15.6,21]);gvFence006(S,[30.9,2],[30.9,30.2]);
  for(const [i,j,r,h]of [[8.3,28,1.3,3.5],[25.7,27.1,1.45,4.4],[2.2,6.1,1.25,4.5]])bush(S,i,j,r,h,true);
  return S.finish();
}

function victorianGardenVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[13.7,17.6,20.9],[23.5,29.3,25.1]]);
  const F=S.face([3.2,21.4],[25.9,21.4]),R=S.face([25.9,6],[25.9,21.4]);
  const render=(right)=>(u,z)=>mod(z,4.5)<.14?(right?C('a99f86'):C('c6bba0')):(right?C('b3aa91'):C('d4c8ab'));
  F.panel(0,F.length,0,36.7,render(false),0);R.panel(0,R.length,0,36.7,render(true),0);
  S.flat(3.2,25.9,6,21.4,36.7,P.stoneR);
  gvBand006(F,2.1,1,false);gvBand006(R,2.1,1,true);
  gvBand006(F,19.2,.6,false);gvBand006(R,19.2,.6,true);
  for(const u of [2.2,16.5]){
    gvSash006(S,F,u,5.1,4.2,11.9,{six:true,lit:u<4,curtain:true});
    gvSash006(S,F,u,23,4.2,10.2,{six:true,lit:u>10});
  }
  gvDoor006(S,F,10.6,1.3,3.6,16.1,{col:P.green,lit:false});
  gvSash006(S,F,10.5,23,3.8,10.2,{six:true,lit:false});
  for(const z of [5,23])for(const u of [2.0,8.8])gvSash006(S,R,u,z,3.5,10.4,{right:true,six:true,lit:u<3&&z>20});
  for(const u of [.1,21.65]){
    F.panel(u,u+1.0,2.8,35.4,P.stoneHi,.07);
    F.panel(u-.08,u+1.1,32.8,34.0,P.stone,.11);
  }
  gvGeorgianCornice006(S,3.2,25.9,6,21.4,36.7);
  hipRoof(S,[[2.8,5.6],[26.3,5.6],[26.3,21.8],[2.8,21.8]],[9.2,13.7],[20,13.7],37.4,13.1,779);
  chimney(S,4.2,12.3,45.0,2.3,2.1,2,780);chimney(S,23.1,10.1,43.3,2.2,2,2,781);
  // Central pedimented porch does not turn the whole front into a glass shed.
  for(const i of [13.15,17.05])S.box(i,i+.3,23.85,24.25,1.1,16.8,P.stoneHi,P.stoneR,P.stone);
  S.box(12.9,17.6,21.4,24.5,16.2,17.1,P.stone,P.stoneR,P.stoneHi);
  S.poly([[12.7,24.65,17],[17.8,24.65,17],[15.25,24.65,21.1]],P.stone,.05);
  S.line([12.7,24.7,17],[15.25,24.7,21.1],P.stoneHi,1);S.line([15.25,24.7,21.1],[17.8,24.7,17],P.stoneHi,1);
  S.poly([[12.7,21.2,17],[15.25,21.2,21.1],[15.25,24.65,21.1],[12.7,24.65,17]],tileRoof(false,782,'j'));
  S.poly([[15.25,21.2,21.1],[17.8,21.2,17],[17.8,24.65,17],[15.25,24.65,21.1]],tileRoof(true,783,'j'));
  step(S,13.15,17.5,21.4,25.3,2);
  // Lower side conservatory: opaque pale framing and individual glazed panels.
  // The z-buffer hides the house windows physically behind its roof and walls.
  const CF=S.face([22.8,26.1],[29.6,26.1]),CR=S.face([29.6,15.3],[29.6,26.1]);
  CF.panel(0,6.8,0,12.5,P.frame,.03);CR.panel(0,10.8,0,12.5,P.frameR,.03);
  for(const [FF,right,count,width]of [[CF,false,3,2.2],[CR,true,5,2.1]])for(let n=0;n<count;n++)
    gvSash006(S,FF,.28+n*width,3.1,width-.48,8.8,{right,panes:1,lit:!right&&n===1});
  const roofGlass=(right)=>(i,j,z)=>{
    if(mod(j-15.1,2.1)<.12||mod(i-22.6,1.7)<.12)return right?P.frameR:P.frame;
    return right?C('60797d'):C('829a98');
  };
  S.poly([[22.6,15.1,19.9],[29.85,15.1,12.9],[29.85,26.4,12.9],[22.6,26.4,19.9]],roofGlass(false),.02);
  S.poly([[22.8,26.1,12.5],[29.6,26.1,12.5],[22.8,26.1,19.65]],P.frame,.03);
  const TF=S.face([22.8,26.12],[29.6,26.12]);
  TF.panel(.2,6.6,12.5,19.7,(x,y)=>y>7.15*(1-(x+.2)/6.8)?null:(mod(x+.2,1.7)<.18?P.frame:C('78918e')),.14);
  S.line([22.6,26.4,19.9],[29.85,26.4,12.9],P.frame,1);
  S.line([29.85,15.1,12.9],[29.85,26.4,12.9],P.frameR,1);
  downpipe(S,26.15,7.2,36);downpipe(S,3.4,21.65,36);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[12.1,17]);gvFence006(S,[30.9,1.5],[30.9,30.2]);
  bush(S,7.8,26.5,1.75,3.7,true);bush(S,20.2,28.4,1.15,3.1,true);bush(S,2,3.1,.85,4,false);
  return S.finish();
}

function gvPointed006(S,F,u,z,w,h,right,lit) {
  const top=x=>h-3.7+3.7*(1-Math.abs(x-w/2)/(w/2));
  F.panel(u-.4,u+w+.4,z-.5,z+h+.5,(x,y)=>y>top(Math.max(0,Math.min(w,x-.4)))+.4?null:(right?P.stoneR:P.stone),.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(y>top(x))return null;
    if(x<.34||x>w-.34||y<.5||y>top(x)-.55||Math.abs(x-w/2)<.2||Math.abs(y-h*.44)<.25)return right?P.frameR:P.frame;
    if(mod(x*1.6+y*.6,2.6)<.14)return P.ironHi;
    return [right?P.glassR:P.glass,lit?P.warm[0]:0];
  },.22);
}

function victorianGothicVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[15,19.9,19.9],[27.4,29,8.4]]);
  // Long low hall ends in a steep, taller transverse wing and an angle porch.
  const HF=gvWall006(S,[4.0,20.6],[19.7,20.6],33.1,false,801,false),HR=gvWall006(S,[19.7,6.6],[19.7,20.6],33.1,true,802,false);
  S.flat(4,19.7,6.6,20.6,33.1,P.brick[0]);
  gvBand006(HF,19.1,.7,false);
  for(const u of [1.7,7.2]){
    gvPointed006(S,HF,u,4.2,3.4,12.1,false,u<3);
    gvSash006(S,HF,u,23,3.4,7.3,{panes:2,leaded:true,lit:false});
  }
  gableRoof(S,3.6,20.1,6.2,21.0,33.8,20.8,803);
  // Cross-wing ridge runs forward at right angles to the hall ridge.
  const WF=gvWall006(S,[20,24.1],[28.1,24.1],43.5,false,804,false),WR=gvWall006(S,[28.1,4.2],[28.1,24.1],43.5,true,805,false);
  S.flat(20,28.1,4.2,24.1,43.5,P.brick[0]);
  for(const z of [20.4,40.8]){gvBand006(WF,z,.7,false);gvBand006(WR,z,.7,true);}
  gvPointed006(S,WF,1.25,4.7,5.7,13.6,false,true);
  gvPointed006(S,WF,1.55,25,5.1,13,false,false);
  for(const u of [2.8,9.6,15.5])for(const z of [6,25])gvPointed006(S,WR,u,z,3.3,12.4,true,z>20&&u<4);
  const GF=gvFrontRoof006(S,19.6,28.5,3.8,24.5,44.3,23.8,806,false,true);
  gvPointed006(S,GF,3.35,47.2,2.3,8.1,false,false);
  // A tiny lozenge vent in the apex belongs to the gable face, not screen space.
  GF.panel(3.8,5.1,59.4,62.3,(x,y)=>Math.abs((x-.65)/.65)+Math.abs((y-1.45)/1.45)<1?P.iron:null,.18);
  // Octagonal-ish stair turret in the angle, with a small independently roofed porch.
  const TF=gvWall006(S,[13.7,22.5],[19.8,22.5],26.5,false,807,false);
  gvWall006(S,[19.8,15.5],[19.8,22.5],26.5,true,808,false);
  gvDoor006(S,TF,1.3,1.3,3.5,17.4,{lit:true,col:C('6a4b44')});
  const TM=gvFrontRoof006(S,13.35,20.15,15.2,22.85,27.2,11.6,809,false,true);
  gvPointed006(S,TM,2.6,28.4,1.6,5.1,false,false);
  step(S,14.75,19.1,22.5,25.1,2);
  // Wide stepped stack and clustered pots are prominent domestic Gothic cues.
  chimney(S,6.4,11.3,51.4,3.4,2.8,3,810);
  S.box(6.1,10.15,11,14.4,53.3,54.3,P.brick[1],P.brickR[1],P.stoneR);
  chimney(S,24.1,7.3,61.8,2.6,2.2,2,811);
  for(let z=4;z<40;z+=4.4)WR.panel(18.7,19.6,z,z+2.3,P.stoneR,.08);
  downpipe(S,28.45,23.8,43.5);downpipe(S,12.6,20.8,33);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[12.9,19.2]);gvFence006(S,[30.9,1.5],[30.9,30.2]);
  bush(S,7.8,26.8,1.55,4.5,true);bush(S,25.6,28,1.25,3.3,false);bush(S,2.1,7.1,1.05,3.9,false);
  return S.finish();
}
