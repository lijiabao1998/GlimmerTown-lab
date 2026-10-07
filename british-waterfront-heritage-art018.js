/* GPT-018: original British waterfront heritage visitor buildings.
 * Two fictional composites, four complete geometric views each.
 * Architectural vocabulary: Historic England entries 1269089 and 1232421.
 * All surfaces share the existing native depth buffer. No bitmap imports,
 * screen-space glow, font rendering, simulation RNG, storage or network.
 * Raster execution and visual acceptance belong to isolated GitHub Actions.
 */
(function(root){
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw Error('BritishComplexPrimitives014 must load before waterfront art');
  const {Scene,P,C,mod,hash,GLOW,paving,slate,brick,ring,sash,rainpipe,wallLamp,
    timberDoor,pottedPlant,bench,ironRail}=H;
  const themes=Object.freeze(['lifeboatHall','canalTollhouse']);
  const FEATURES=Object.freeze({
    lifeboatHall:Object.freeze(['broad-slate-gable','coursed-rubble-and-brick-arches',
      'radial-glazed-oculus','double-timber-exhibit-doors','strutted-side-shelter',
      'infilled-side-annex','projecting-rear-casement','roof-ridge-and-gutters',
      'visitor-court','supported-window-and-lantern-emission']),
    canalTollhouse:Object.freeze(['two-storey-octagonal-masonry','eight-real-angled-faces',
      'eight-sided-hipped-slate-roof','arched-recesses-and-glazing-bars',
      'front-visitor-door','distinct-rear-service-door','waist-and-eaves-courses',
      'rear-chimney-stack','stone-entrance-steps','small-railed-visitor-court'])
  });
  const RUBBLE=[C('a8a38e'),C('b9b099'),C('948f7e'),C('c4b79c')];
  const RUBBLE_R=[C('858878'),C('969784'),C('767c70'),C('a0a18b')];
  const IVORY=C('ded7c3'),IVORY_R=C('bfc1ad'),IVORY_HI=C('ece5d2');
  const BLUE=C('435c65'),BLUE_D=C('314b55'),BLUE_HI=C('67808a');
  function foundation(S){
    S.box(.3,31.7,.3,31.7,0,.65,P.stoneD,P.stoneD,paving);
    for(const y of[.45,31.35])S.flat(.45,31.55,y,y+.19,.67,P.stoneR);
    for(const x of[.45,31.35])S.flat(x,x+.19,.45,31.55,.67,P.stoneR);
  }
  function rubble(right){
    return(x,y,z)=>{
      const u=right?y:x,row=Math.floor(z/1.8),offset=(row&1)*1.8;
      const joint=mod(u+offset,3.6),edge=.14+.045*(hash(row,0,1801)%3);
      if(mod(z,1.8)<.15||joint<edge)return right?C('697767'):C('8b8e7b');
      const n=hash(Math.floor((u+offset)/3.6),row,18018);
      return(right?RUBBLE_R:RUBBLE)[n%17===0?3:n%7===0?2:n%5===0?1:0];
    };
  }
  // An oriented face prism is safe on the tollhouse's diagonal walls too.
  // The older axis-aligned face.block helper is intentionally not used there.
  function faceBlock(S,F,u0,u1,d0,d1,z0,z1,front,side,top){
    const a=F.point(u0,d0,z0),b=F.point(u1,d0,z0),c=F.point(u1,d1,z0),d=F.point(u0,d1,z0);
    const lift=p=>[p[0],p[1],z1],A=lift(a),B=lift(b),D=lift(d),E=lift(c);
    S.poly([d,c,E,D],front);S.poly([a,b,B,A],side);
    S.poly([a,d,D,A],side);S.poly([b,c,E,B],side);S.poly([A,B,E,D],top);
  }
  function arch(S,F,u,z,w,h,material,d){
    const radius=w/2,spring=z+h-radius,mid=u+radius;
    const points=[F.point(u,d,z),F.point(u+w,d,z),F.point(u+w,d,spring)];
    for(let k=1;k<=20;k++){const a=k*Math.PI/20;points.push(F.point(mid+Math.cos(a)*radius,d,spring+Math.sin(a)*radius));}
    S.poly(points,material,.035);
  }
  function archStones(S,F,u,z,w,h,red){
    const r=w/2,spring=z+h-r,mid=u+r;
    for(let k=0;k<13;k++){
      const a=k*Math.PI/13+.018,b=(k+1)*Math.PI/13-.018;
      S.poly([F.point(mid+Math.cos(a)*(r+.55),.33,spring+Math.sin(a)*(r+.55)),
        F.point(mid+Math.cos(b)*(r+.55),.33,spring+Math.sin(b)*(r+.55)),
        F.point(mid+Math.cos(b)*r,.33,spring+Math.sin(b)*r),
        F.point(mid+Math.cos(a)*r,.33,spring+Math.sin(a)*r)],red?P.brick[k%3]:k%3?IVORY:IVORY_HI,.05);
    }
    for(const uu of[u-.53,u+w])faceBlock(S,F,uu,uu+.53,.015,.38,z,z+h-r,red?P.brick[0]:IVORY,P.stoneR,P.stoneHi);
    faceBlock(S,F,mid-.34,mid+.34,.03,.52,z+h-.18,z+h+.78,P.stoneHi,P.stoneR,IVORY_HI);
  }
  function archedGlazing(S,F,u,z,w,h,lit,red){
    arch(S,F,u-.35,z-.13,w+.7,h+.42,P.stoneD,.05);
    const A=F.point(u,0,z),B=F.point(u+1,0,z),tx=B[0]-A[0],ty=B[1]-A[1],spring=h-w/2;
    arch(S,F,u,z,w,h,(x,y,zz)=>{
      const xx=(x-A[0])*tx+(y-A[1])*ty,yy=zz-z;
      if(xx<.2||xx>w-.2||yy<.25)return P.frame;
      if(Math.abs(xx-w/2)<.13||Math.abs(yy-spring)<.17||Math.abs(yy-h*.42)<.14)return P.frame;
      if(yy>spring&&mod(Math.atan2(yy-spring,xx-w/2)*(w/2),1.75)<.11)return P.frameR;
      return lit?(xx<w/2?GLOW[0]:GLOW[2]):xx<w/2?P.glass:P.glassR;
    },.14);
    archStones(S,F,u,z,w,h,red);
    faceBlock(S,F,u-.6,u+w+.6,.02,.66,z-.62,z-.15,P.stone,P.stoneR,P.stoneHi);
  }
  function brickQuoin(S,F,u,height){
    for(let z=.65;z<height;z+=1.65)faceBlock(S,F,u,u+(Math.floor(z/1.65)%2?1.35:.95),.02,.17,z,Math.min(z+1.46,height),P.brick[0],P.brickR[0],P.brick[1]);
  }
  function timberExhibitDoors(S,F,u,z,w,h){
    arch(S,F,u-.55,z,w+1.1,h+.48,P.brickR[0],.04);
    arch(S,F,u,z,w,h,(x,y,zz)=>{
      const A=F.point(u,0,z),B=F.point(u+1,0,z),xx=(x-A[0])*(B[0]-A[0])+(y-A[1])*(B[1]-A[1]);
      const yy=zz-z;
      if(Math.abs(xx-w/2)<.18||mod(xx,.85)<.09)return BLUE_D;
      if(yy>h-1.1)return BLUE_D;
      if(Math.abs(yy-2.6)<.13||Math.abs(yy-h*.57)<.14)return P.ironD;
      if(Math.abs(xx-w/2)<.65&&yy>h*.4&&yy<h*.49)return P.gold;
      return hash(Math.floor(xx/.85),0,1819)%5===0?BLUE_HI:BLUE;
    },.19);
    archStones(S,F,u,z,w,h,true);
    faceBlock(S,F,u-.65,u+w+.65,.02,.82,z-.1,z+.14,P.stone,P.stoneR,P.stoneHi);
  }
  function oculus(S,F,u,z,r){
    const points=[];for(let k=0;k<28;k++){const a=k*Math.PI*2/28;points.push(F.point(u+Math.cos(a)*r,.13,z+Math.sin(a)*r));}
    S.poly(points,GLOW[2],.035);ring(S,F,u,z,r+.45,r+.45,.42,.22,P.brick[0],20);
    ring(S,F,u,z,r,r,.16,.27,P.frame,20);
    for(const a of[0,Math.PI/2])S.beam(F.point(u-Math.cos(a)*r,.3,z-Math.sin(a)*r),F.point(u+Math.cos(a)*r,.3,z+Math.sin(a)*r),P.frame,.18);
    faceBlock(S,F,u-.35,u+.35,.05,.48,z+r+.2,z+r+.76,P.stoneHi,P.stoneR,P.stoneHi);
  }
  function shelter(S){
    for(const y of[6,14,22]){
      S.box(29.0,29.65,y-.34,y+.34,.65,14.6,P.wood,P.woodR,P.woodHi);
      S.box(28.82,29.82,y-.53,y+.53,.65,1.35,P.stone,P.stoneR,P.stoneHi);
      S.beam([29.3,y,10.9],[26.9,y,15.1],P.woodR,.38);
      if(y<22)S.beam([29.3,y,11.3],[29.3,y+2.5,14.5],P.woodR,.34);
      if(y>6)S.beam([29.3,y,11.3],[29.3,y-2.5,14.5],P.woodR,.34);
    }
    S.beam([29.3,4.4,14.6],[29.3,24.6,14.6],P.woodD,.5);
    S.poly([[24,4,19.3],[30.2,4,14.7],[30.2,25,14.7],[24,25,19.3]],slate(true));
    for(const y of[4,25])S.beam([24,y,19.3],[30.2,y,14.7],P.frameR,.33);
    S.beam([30.2,4,14.55],[30.2,25,14.55],P.ironD,.3);
    bench(S,26.25,10,5.5,false);
  }
  function lifeboatHall(view){
    const S=Scene(2,view,160,196);foundation(S);
    S.box(6,24,4,25,.65,22,rubble(false),rubble(true),RUBBLE[0]);
    const front=S.face([6,25],[24,25],0,1),back=S.face([24,4],[6,4],0,-1),left=S.face([6,4],[6,25],-1,0),right=S.face([24,25],[24,4],1,0);
    for(const F of[front,back,left,right]){brickQuoin(S,F,0,21.9);brickQuoin(S,F,F.length-1.35,21.9);}
    timberExhibitDoors(S,front,3.9,.8,10.2,15.8);
    for(const u of[3.1,13.4])archedGlazing(S,right,u,7.4,3.9,8.4,true,true);
    for(const u of[4.0,14.3])archedGlazing(S,left,u,8.1,3.5,7.8,true,true);
    H.gableRoof(S,5.45,24.55,3.5,25.55,22.25,12,false,null,rubble(false));
    for(const y of[3.5,25.55]){
      S.beam([5.35,y,22.25],[15,y,34.4],P.frameR,.42);
      S.beam([15,y,34.4],[24.65,y,22.25],P.frameR,.42);
    }
    const gable=S.face([5.45,25.55],[24.55,25.55],0,1);
    oculus(S,gable,9.55,26.6,2.35);
    shelter(S);
    // Infilled service outshut, physically attached to the left wall.
    S.box(2.05,6.05,6,18,.65,13.8,rubble(false),rubble(true),RUBBLE[0]);
    S.poly([[1.65,5.7,13.9],[6.3,5.7,18.6],[6.3,18.3,18.6],[1.65,18.3,13.9]],slate(false));
    const annex=S.face([2.05,6],[2.05,18],-1,0);sash(S,annex,3.2,5.5,4.9,6.4,true);
    const annexFront=S.face([2.05,18],[6.05,18],0,1);timberDoor(annexFront,.65,.75,2.5,8.7,false);
    // Projecting rear casement and visible supporting corbels.
    S.box(12.2,18.1,2.05,4.02,6.1,11.7,P.woodR,P.woodD,P.slate);
    const rearBay=S.face([18.1,2.05],[12.2,2.05],0,-1);sash(S,rearBay,.58,6.6,4.72,4.45,true);
    for(const x of[12.8,17.5])S.beam([x,3.94,3.8],[x,2.2,6.3],P.woodR,.35);
    timberDoor(back,1.3,.8,3.2,10.3,false);
    for(const x of[6.12,23.85])rainpipe(S,x,25.05,21.8);
    rainpipe(S,29.93,4.7,14.5);
    wallLamp(S,front,2.4,13.2);wallLamp(S,front,15.6,13.2);
    // Worn approach, a drain and two modest visitor pots.
    S.flat(9.3,20.7,25.6,31.1,.7,(x,y)=>mod(y,2.3)<.15?P.stoneR:P.paveHi);
    for(let x=8.5;x<22;x+=.8)S.flat(x,x+.4,26.4,26.78,.73,P.ironD);
    pottedPlant(S,4.1,26.7,.7,.78,P.flower[2]);pottedPlant(S,27.6,28.45,.7,.72,P.flower[1]);
    bench(S,3.0,20.8,4.4,false);
    return S.finish({id:'lifeboatHall',family:'waterfront018',appearance:'lifeboatHall',
      features:[...FEATURES.lifeboatHall],physicalLampCount:2,smoke:[],nativeBaseK:287});
  }
  function octagon(cx,cy,r,z){return Array.from({length:8},(_,i)=>{const a=(i+.5)*Math.PI/4;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r,z];});}
  function octagonalBand(S,cx,cy,r,z,h,c,side){
    const a=octagon(cx,cy,r,z),b=octagon(cx,cy,r,z+h);
    for(let i=0;i<8;i++)S.poly([a[i],a[(i+1)%8],b[(i+1)%8],b[i]],i<4?c:side);
    S.poly(b,c);
  }
  function tollWindow(S,F,index){
    const w=4.75,u=(F.length-w)/2;
    archedGlazing(S,F,u,23.1,w,9.0,index!==5,false);
    if(index!==1&&index!==5){
      if(index===0||index===3||index===6)archedGlazing(S,F,u+.3,6.0,w-.6,8.7,true,false);
      else{
        arch(S,F,u,3.65,w,11.4,P.stoneR,.04);
        arch(S,F,u+.24,3.9,w-.48,10.95,IVORY_R,.13);
        faceBlock(S,F,u+.6,u+w-.6,.15,.3,5,9.8,BLUE_D,P.ironD,BLUE);
        for(const z of[6.0,7.2,8.4])F.panel(u+.9,u+w-.9,z,z+.2,P.woodHi,.34);
      }
    }
  }
  function canalTollhouse(view){
    const S=Scene(2,view,160,196);foundation(S);
    const cx=16,cy=14.9,r=10.7,z0=.75,z1=37.2,ring0=octagon(cx,cy,r,z0),ring1=octagon(cx,cy,r,z1),faces=[];
    for(let i=0;i<8;i++){
      const a=ring0[i],b=ring0[(i+1)%8],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),right=i>=3&&i<=6;
      const F=S.face(a,b,dy/length,-dx/length);faces.push(F);
      S.poly([a,b,ring1[(i+1)%8],ring1[i]],(x,y,z)=>{
        const u=(x-a[0])*dx/length+(y-a[1])*dy/length,row=Math.floor(z/1.55);
        if(mod(z,1.55)<.095||mod(u+(row&1)*1.5,3)<.075)return right?C('a8ae9e'):C('cbc5b2');
        return right?IVORY_R:hash(Math.floor(u/3),row,1881)%19===0?IVORY_HI:IVORY;
      });
      tollWindow(S,F,i);
      for(const u of[.12,F.length-.53])faceBlock(S,F,u,u+.4,.01,.24,2.8,36.3,right?P.stoneR:IVORY_HI,P.stoneD,P.stone);
    }
    octagonalBand(S,cx,cy,r+.28,.7,1.55,P.stone,P.stoneR);
    octagonalBand(S,cx,cy,r+.18,18.1,.9,P.stone,P.stoneR);
    octagonalBand(S,cx,cy,r+.36,36.2,.65,P.stoneD,P.stoneR);
    octagonalBand(S,cx,cy,r+.7,36.85,.73,IVORY_HI,P.stoneR);
    const door=faces[1],back=faces[5],w=4.85,u=(door.length-w)/2;
    arch(S,door,u-.35,1.05,w+.7,14.5,P.stoneD,.08);
    arch(S,door,u,1.2,w,13.7,(x,y,z)=>{
      const A=door.point(u,0,0),B=door.point(u+1,0,0),xx=(x-A[0])*(B[0]-A[0])+(y-A[1])*(B[1]-A[1]);
      if(z>10.5)return Math.abs(xx-w/2)<.13||Math.abs(z-11.1)<.17?P.frame:GLOW[2];
      if(Math.abs(xx-w/2)<.16||mod(xx,1.2)<.10||Math.abs(z-4)<.14||Math.abs(z-7.6)<.14)return BLUE_D;
      if(Math.abs(xx-w/2)<.45&&z>6&&z<6.7)return P.gold;
      return BLUE;
    },.18);archStones(S,door,u,1.2,w,13.7,false);
    const bu=(back.length-2.9)/2;faceBlock(S,back,bu-.3,bu+3.2,.02,.3,.8,12.4,P.stone,P.stoneR,P.stoneHi);
    back.panel(bu,bu+2.9,.9,11.9,(x,z)=>mod(x,.65)<.1?P.woodD:z>9.1?P.glassR:P.woodR,.34);
    for(let n=0;n<3;n++)faceBlock(S,door,u-.7,u+w+.7,.15+n*.67,.95+n*.67,.66,1.2-n*.15,P.stone,P.stoneR,P.stoneHi);
    const roof0=octagon(cx,cy,r+1.05,38),roof1=octagon(cx,cy,1.45,51);
    for(let i=0;i<8;i++){
      S.poly([roof0[i],roof0[(i+1)%8],roof1[(i+1)%8],roof1[i]],slate(i>=3&&i<=6));
      S.beam(roof0[i],roof1[i],P.slateHi,.17);
      S.beam(roof0[i],roof0[(i+1)%8],P.ironD,.27);
    }
    S.poly(roof1,P.lead);S.beam([cx,cy,51],[cx,cy,53.2],P.ironD,.32);
    H.cylinder(S,cx,cy,52.5,53.6,.36,.1,P.iron,P.ironD,P.ironHi,8);
    // A rear stack and rainwater fittings make the back genuinely distinct.
    S.box(11.0,13.15,8.1,10.6,37.5,52.2,brick(false,1828),brick(true,1828),P.stoneHi);
    S.box(10.7,13.45,7.85,10.85,51.7,52.5,P.stone,P.stoneR,P.stoneHi);
    for(const x of[11.6,12.65])H.cylinder(S,x,9.3,52.4,54.6,.36,.31,P.pot,P.potR,P.ink,8);
    const rp=faces[3].point(.65,.43,0);rainpipe(S,rp[0],rp[1],36.4);
    wallLamp(S,door,.6,13.4);wallLamp(S,back,back.length-.72,10.9);
    S.flat(11.3,20.7,25.5,31.1,.7,(x,y)=>mod(y,2.1)<.14?P.stoneR:P.paveHi);
    ironRail(S,[2.1,25.1],[2.1,30.0],.68,3.0);
    ironRail(S,[2.1,30.0],[9.5,30.0],.68,3.0);
    ironRail(S,[22.4,30.0],[29.9,30.0],.68,3.0);
    ironRail(S,[29.9,30.0],[29.9,24.4],.68,3.0);
    bench(S,4.1,22.8,5.0,false);pottedPlant(S,26.7,27.45,.7,.78,P.flower[4]);
    return S.finish({id:'canalTollhouse',family:'waterfront018',appearance:'canalTollhouse',
      features:[...FEATURES.canalTollhouse],physicalLampCount:2,smoke:[],nativeBaseK:287});
  }
  function buildAll(){
    const result={};
    for(const theme of themes)for(let view=0;view<4;view++)result[theme+'_'+view]=(theme==='lifeboatHall'?lifeboatHall:canalTollhouse)(view);
    return result;
  }
  root.BritishWaterfrontHeritage018=Object.freeze({themes,buildAll});
})(typeof window==='undefined'?globalThis:window);
