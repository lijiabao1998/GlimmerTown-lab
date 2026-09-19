// facade_us1.js — T577 美式街景立面繪製器（實驗線）
// usBrownstone：紐約布朗石排屋（套 walkup 原型 lv2）；usPrewar：戰前磚造公寓（套 slab／twin 原型 lv3）
// 登記：window.__facade577[name]={name,draw(ctx)}；只畫牆／窗／屋頂／沿街小件，地坪、接地線、前庭道具由核心畫好。
// 座標：G.W→G.S 是受光正面（朝路），G.E→G.S 是背光端牆；u 沿正面、v 沿深度（v=1 貼路）。
// 全部整數像素、硬邊多邊形（像素中心取樣）；亂數只用 ctx.rand（決定性）。
(function(){
'use strict';
const REG=window.__facade577=window.__facade577||{};
const R=Math.round,clampN=(x,a,b)=>x<a?a:x>b?b:x;

function tools(ctx){
  const A=ctx.A,sh=A.shade,g=ctx.g,ng=ctx.ng;
  const rc=(cx,x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(R(x),R(y),w,h);};
  // scanline spans of a polygon (pixel-centre sampling, hard edges)
  const spans=(cx,pts,fn)=>{let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    y0=Math.max(0,Math.floor(y0));y1=Math.min(cx.canvas.height-1,Math.ceil(y1));const n=pts.length;
    for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
      for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=Math.ceil(xs[i]-.5),xb=Math.ceil(xs[i+1]-.5);if(xb>xa)fn(xa,y,xb-xa);}}};
  const poly=(cx,pts,c)=>{cx.fillStyle=c;spans(cx,pts,(x,y,w)=>cx.fillRect(x,y,w,1));};
  const clearPoly=(cx,pts)=>{spans(cx,pts,(x,y,w)=>cx.clearRect(x,y,w,1));};
  const lineP=(cx,a,b,c)=>{let x0=R(a[0]),y0=R(a[1]);const x1=R(b[0]),y1=R(b[1]);const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;cx.fillStyle=c;
    for(let guard=0;guard<4096;guard++){cx.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}};
  const fy=(a,b,x)=>Math.abs(b[0]-a[0])<1e-6?a[1]:a[1]+(x-a[0])*((b[1]-a[1])/(b[0]-a[0]));
  const foot=(a,b,x)=>R(fy(a,b,x));
  const cols=(a,b,fn)=>{const x0=R(Math.min(a[0],b[0])),x1=R(Math.max(a[0],b[0]));for(let x=x0;x<=x1;x++)fn(x,foot(a,b,x));};
  const wall=(cx,a,b,h,c)=>{cx.fillStyle=c;cols(a,b,(x,y)=>cx.fillRect(x,y-h,1,h));};
  const sub=(C,u0,u1,v0,v1)=>({N:A.paraPt559(C,u0,v0),E:A.paraPt559(C,u1,v0),S:A.paraPt559(C,u1,v1),W:A.paraPt559(C,u0,v1)});
  const lerp=A.lerp2;
  // wall-top corners (same rounding as wall columns; -.02 keeps the top wall row out of the roof scanlines)
  const tops=(C,h)=>{const xW=R(C.W[0]),xS=R(C.S[0]),xE=R(C.E[0]);
    return {W:[xW,foot(C.W,C.S,xW)-h-.02],S:[xS,foot(C.W,C.S,xS)-h-.02],E:[xE,foot(C.S,C.E,xE)-h-.02],N:[R(C.N[0]),R(C.N[1])-h-.02]};};
  // 盒子剪影（六邊形）；左右各放寬 1px，讓 edgeWall547 用 round() 畫在角柱上的那一欄也被涵蓋
  const hex=(C,h,extra)=>{const e=extra||0;return [[C.W[0]-1,C.W[1]],[C.S[0],C.S[1]+1],[C.E[0]+1,C.E[1]],[C.E[0]+1,C.E[1]-h-e],[C.N[0],C.N[1]-h-e-1],[C.W[0]-1,C.W[1]-h-e]];};
  // glass + optional night light; 1px sky highlight on the top row when h>=3
  const glass=(x,y,w,h,col,lit,litCol)=>{rc(g,x,y,w,h,col);if(h>=3&&w>=2)rc(g,x,y,w-1,1,sh(col,12));
    if(lit&&ng){ng.fillStyle=litCol||'#ffd98c';ng.fillRect(R(x),R(y),w,h);}};
  const litCol=(r)=>r<.72?'#ffd98c':r<.9?'#ffe9b8':'#cfe0ff';
  // street furniture (ground point p = where it stands)
  const tree=(x,y)=>{rc(g,x-1,y,3,1,'#5e4a36');rc(g,x-2,y+1,5,1,'rgba(20,28,20,.28)');
    rc(g,x,y-3,1,3,'#4a3626');rc(g,x-2,y-6,5,3,'#3a7436');rc(g,x-1,y-7,3,1,'#3a7436');
    rc(g,x-1,y-6,2,1,'#57a04c');rc(g,x-2,y-5,1,1,'#57a04c');rc(g,x+1,y-4,2,1,'#2c5a2a');rc(g,x+2,y-6,1,1,'#2c5a2a');};
  const hydrant=(x,y)=>{rc(g,x,y-3,1,3,'#c23b2c');rc(g,x-1,y-2,3,1,'#c23b2c');rc(g,x,y-4,1,1,'#8a2a20');rc(g,x,y,2,1,'rgba(20,28,20,.3)');};
  const lamp=(x,y)=>{rc(g,x,y-9,1,9,'#2f3238');rc(g,x,y-10,3,1,'#2f3238');rc(g,x+2,y-9,1,1,'#efe6c0');rc(g,x,y,2,1,'rgba(20,28,20,.3)');
    if(ng){ng.fillStyle='#fff2c8';ng.fillRect(R(x)+2,R(y)-9,1,1);ng.fillStyle='rgba(255,236,170,.22)';ng.fillRect(R(x)+1,R(y)-8,3,1);ng.fillRect(R(x),R(y)-1,5,2);}};
  const bins=(x,y,n)=>{for(let i=0;i<n;i++){const c=i%2?'#4b5058':'#3f4a42';rc(g,x+i*3,y-2,2,2,c);rc(g,x+i*3,y-3,2,1,sh(c,30));}rc(g,x,y,n*3,1,'rgba(20,28,20,.28)');};
  // 夜光畫布是疊加的：先畫的量體（後排、內側段、後棟）被之後的牆／屋頂蓋住時，白天看不見但窗燈仍留在 ng 上、變成屋頂上的浮光。
  // 每個量體開畫前，把 ng 在「這個量體白天會蓋到的範圍」（正面牆柱、端牆柱、屋頂多邊形）清掉，讓夜光與白天的 painter order 一致。
  const clearMass=(C,h)=>{if(!ng)return;cols(C.W,C.S,(x,y)=>ng.clearRect(x,y-h,1,h+1));cols(C.S,C.E,(x,y)=>ng.clearRect(x,y-h,1,h+1));
    const Ct=tops(C,h);clearPoly(ng,[Ct.N,Ct.E,Ct.S,Ct.W]);};
  return {sh,rc,spans,poly,clearPoly,lineP,fy,foot,cols,wall,sub,lerp,tops,hex,glass,litCol,tree,hydrant,lamp,bins,clearMass};
}

// 清掉核心前庭道具（樹冠／樹幹／長椅／鞦韆架）：人行道會蓋住樹幹，樹冠會浮在牆上；
// 依顏色比值認樹（綠比紅高 1.55 倍），落在 G 內回填地坪、G0 內回填草地、G0 外清成透明。夜光畫布上核心的兩顆「無燈具的光斑」一併清掉。
function scrubYard(ctx,clearNg){
  const {g,ng,G0,G}=ctx,W=g.canvas.width,H=g.canvas.height;
  const im=g.getImageData(0,0,W,H),d=im.data;
  const inv=(C)=>{const ax=C.E[0]-C.N[0],ay=C.E[1]-C.N[1],bx=C.W[0]-C.N[0],by=C.W[1]-C.N[1],det=(ax*by-ay*bx)||1;
    return (x,y)=>{const px=x+.5-C.N[0],py=y+.5-C.N[1];const u=(px*by-py*bx)/det,v=(ax*py-ay*px)/det;return u>=0&&u<=1&&v>=0&&v<=1;};};
  const in0=inv(G0),inG=inv(G);
  const EXACT=[[91,63,42],[154,161,167],[195,201,206],[185,178,162],[141,136,120]];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,r=d[i],gg=d[i+1],b=d[i+2];if(d[i+3]<200)continue;
    let hit=(gg>40&&gg>=r*1.55&&gg>=b*1.4);
    if(!hit)for(const e of EXACT){if(r===e[0]&&gg===e[1]&&b===e[2]){hit=true;break;}}
    if(!hit)continue;
    if(inG(x,y)){d[i]=138;d[i+1]=122;d[i+2]=104;d[i+3]=255;}
    else if(in0(x,y)){d[i]=111;d[i+1]=138;d[i+2]=88;d[i+3]=255;}
    else{d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=0;}
  }
  g.putImageData(im,0,0);
  if(ng&&clearNg)ng.clearRect(0,0,ng.canvas.width,ng.canvas.height);
}

// 人行道：G0 的 v∈[vF,1] 全寬鋪水泥；路緣淺線、每 12px 一道細縫
function sidewalk(ctx,T,vF){
  const {A,g,G0,bw}=ctx,{poly,lineP}=T;
  const P=(u,v)=>A.paraPt559(G0,u,v);
  poly(g,[P(0,vF),P(1,vF),P(1,1),P(0,1)],'#a3a099');
  const n=Math.max(2,R(bw*32/12));
  for(let i=1;i<n;i++)lineP(g,P(i/n,vF),P(i/n,1),'#98958d');
  lineP(g,P(0,vF+.004),P(1,vF+.004),'#94918a');
  const vc=1-.6/(16*ctx.bh);lineP(g,P(0,vc),P(1,vc),'#b6b3ab');
}

// ---------------------------------------------------------------- usBrownstone
// 布朗石排屋：半地下室＋抬高主樓層（parlor）＋兩三層；每戶 3 開間，門在鏡像成對的一側，門前石階（stoop）伸向人行道；
// 托架簷口、女兒牆；深街區前後兩排背靠背、中間後院；人行道上行道樹／消防栓／路燈／垃圾桶。
REG.usBrownstone={name:'usBrownstone',draw(ctx){
  const T=tools(ctx),{A,g,ng,G0,rand,v,bw,bh,ar}=ctx,{sh,rc,poly,lineP,foot,cols,wall,lerp,tops,glass,litCol,tree,hydrant,lamp,bins,clearMass}=T;
  const box=(ar&&ar.box)||[0,1,0,1];
  const P0=(u,vv)=>A.paraPt559(G0,u,vv);
  const para0=(u0,u1,v0,v1)=>({N:P0(u0,v0),E:P0(u1,v0),S:P0(u1,v1),W:P0(u0,v1)});
  const hB=4,fhP=9,fh=7,nUp=2+(Math.abs(v)%2),H=hB+fhP+nUp*fh+3;
  const BROWN=['#775444','#6e4d40','#805b4a','#66493c'],RED=['#905040','#844537','#9a5544'],GREY=['#90806c','#847866','#9c8b76'],PAINT=['#d9cdb8','#c9c3b5'];
  const DOORS=['#2a2420','#3a2c22','#5a1f1f','#1f2f45','#2e4a2c','#1b1b20'];
  const glassF='#42505c',glassB='#333d47',glassR='#2f3a44',iron='#25262b',stone='#9c8a74';
  // 正面往後退到前庭夠放 4 級石階（4.6 單位＝4.6/16 格）
  const vFront=Math.min(box[3],1-4.6/(16*bh));
  const depthPx=(vFront-box[2])*bh*32;
  const rows=[];
  if(depthPx>=44){const rd=(depthPx>=70?28:20)/(bh*32);rows.push({v0:box[2],v1:box[2]+rd,front:false});rows.push({v0:vFront-rd,v1:vFront,front:true});}
  else rows.push({v0:box[2],v1:vFront,front:true});
  scrubYard(ctx,!(ar&&ar.ex));
  if(vFront<.97)sidewalk(ctx,T,vFront);
  // 後院（兩排之間）：草地、中線圍籬、每戶分隔籬、灌木
  if(rows.length===2){
    const ya=rows[0].v1,yb=rows[1].v0,Y=para0(box[0],box[1],ya,yb);
    poly(g,[Y.N,Y.E,Y.S,Y.W],'#6a8a54');
    for(let i=0;i<10;i++){const p=P0(box[0]+rand()*(box[1]-box[0]),ya+rand()*(yb-ya));rc(g,p[0],p[1],2,1,rand()<.5?'#7a9a60':'#5e7e4a');}
    const vm=(ya+yb)/2;lineP(g,P0(box[0],vm),P0(box[1],vm),'#7a6a50');
    const LX0=(box[1]-box[0])*bw*32,nL=Math.max(1,R(LX0/15.5));
    for(let i=1;i<nL;i++){const u=box[0]+(box[1]-box[0])*i/nL;lineP(g,P0(u,ya+.01),P0(u,yb-.01),'#5c4a38');}
    for(let i=0;i<nL;i++){if(rand()<.5)continue;const p=P0(box[0]+(box[1]-box[0])*(i+.3+rand()*.4)/nL,ya+.15+rand()*.6);
      rc(g,p[0]-1,p[1]-2,3,2,'#3a6e36');rc(g,p[0],p[1]-3,1,1,'#4f8a44');}
  }
  const props=[];
  const drawRow=(rw)=>{
    const C=para0(box[0],box[1],rw.v0,rw.v1),front=rw.front;
    clearMass(C,H);                                   // 前排蓋住後排的地方，先清掉後排留在 ng 上的窗燈
    const LX=C.S[0]-C.W[0],nH=Math.max(1,R(LX/15.5)),hw=LX/nH;
    const houses=[];
    for(let i=0;i<nH;i++){
      const r=rand();let col,trim;
      if(r<.42){col=BROWN[(rand()*BROWN.length)|0];trim=sh(col,34);}
      else if(r<.68){col=RED[(rand()*RED.length)|0];trim='#b8a283';}
      else if(r<.88){col=GREY[(rand()*GREY.length)|0];trim=sh(col,30);}
      else{col=PAINT[(rand()*PAINT.length)|0];trim='#f0e9da';}
      col=sh(col,R((rand()-.5)*10));
      houses.push({col,trim,door:DOORS[(rand()*DOORS.length)|0],side:(i%2===0)?1:0,bulk:rand()<.3,bins:rand()<.4,sky:rand()<.4,vent:rand()<.5,ant:rand()<.3});
    }
    // 端牆（背光）
    const last=houses[nH-1],endCol=sh(last.col,-46);
    wall(g,C.S,C.E,H,endCol);
    cols(C.S,C.E,(x,y)=>{rc(g,x,y-hB,1,hB,sh(endCol,-8));rc(g,x,y-hB-1,1,1,sh(endCol,14));rc(g,x,y-1,1,1,sh(endCol,-20));rc(g,x,y-H,1,1,sh(last.trim,-40));rc(g,x,y-H+2,1,1,sh(endCol,-16));});
    const DXe=C.E[0]-C.S[0];
    if(DXe>=12){const xw=R(C.S[0]+DXe*.5)-1,yw=foot(C.S,C.E,xw+1);
      for(let f=0;f<=nUp;f++){const yb=yw-hB-(f===0?0:fhP+(f-1)*fh),fhF=f===0?fhP:fh;
        rc(g,xw,yb-fhF+1,2,1,sh(endCol,20));glass(xw,yb-fhF+2,2,fhF-4,glassR,rand()<.3,'#e8c47a');rc(g,xw,yb-2,2,1,sh(endCol,20));}}
    {const xp=R(C.S[0])+1;rc(g,xp,foot(C.S,C.E,xp)-H+3,1,H-4,'#3e4249');}     // 落水管
    // 正面（前排）／後牆（後排）
    const stoops=[];
    for(let i=0;i<nH;i++){
      const h=houses[i],col=h.col,trim=h.trim,base=sh(col,-14);
      const xi0=R(C.W[0]+hw*i),xi1=R(C.W[0]+hw*(i+1))-1,hwI=xi1-xi0+1;
      for(let x=xi0;x<=xi1;x++){const y=foot(C.W,C.S,x);
        rc(g,x,y-H,1,H,col);
        rc(g,x,y-hB,1,hB,base);
        rc(g,x,y-hB-1,1,1,sh(trim,-8));                       // 地下室頂石線
        rc(g,x,y-1,1,1,sh(base,-26));                          // 勒腳
        if(front){rc(g,x,y-H,1,1,trim);rc(g,x,y-H+1,1,1,(x&1)?trim:sh(col,-30));rc(g,x,y-H+2,1,1,sh(col,-34));}   // 托架簷口
        else{rc(g,x,y-H,1,1,sh(trim,-18));}
      }
      {const y=foot(C.W,C.S,xi1);rc(g,xi1,y-H+3,1,H-3,sh(col,-12));}      // 戶界
      // 開間
      const nBay=hwI>=12?3:hwI>=8?2:1,bayW=Math.max(3,Math.floor((hwI-1)/nBay)),pad=Math.max(0,Math.floor((hwI-1-nBay*bayW+1)/2));
      const doorJ=front?(h.side?nBay-1:0):-1;
      for(let j=0;j<nBay;j++){
        const bx=xi0+1+pad+j*bayW,yx=foot(C.W,C.S,bx+1);
        // 地下室窗
        if(j!==doorJ){glass(bx,yx-3,3,2,glassB,rand()<.2,'#e8c47a');}
        else if(!front){rc(g,bx,yx-hB,3,hB,sh(h.door,-6));}
        for(let f=0;f<=nUp;f++){
          const yb=yx-hB-(f===0?0:fhP+(f-1)*fh),fhF=f===0?fhP:fh;
          if(f===0&&j===doorJ){
            // 門：門楣、扇形窗、雙開門、門把
            if(bayW>=5){rc(g,bx-1,yb-fhF+1,5,1,trim);rc(g,bx-1,yb-fhF+2,1,fhF-2,sh(trim,-10));rc(g,bx+3,yb-fhF+2,1,fhF-2,sh(trim,-10));}
            else rc(g,bx,yb-fhF+1,3,1,trim);
            rc(g,bx,yb-fhF+2,3,1,'#9fb2c2');
            rc(g,bx,yb-fhF+3,3,fhF-3,h.door);rc(g,bx+1,yb-fhF+3,1,fhF-3,sh(h.door,-18));rc(g,bx+(h.side?0:2),yb-3,1,1,sh(h.door,60));
            const lit=rand()<.5;if(lit&&ng){ng.fillStyle='#ffd27a';ng.fillRect(bx,yb-fhF+2,3,1);}
            stoops.push({dx:bx,dy:yx,lit,h});
          }else{
            rc(g,bx,yb-fhF+1,3,1,trim);                        // 石窗楣
            glass(bx,yb-fhF+2,3,fhF-4,glassF,rand()<(f===0?.46:.38),litCol(rand()));
            rc(g,bx,yb-2,3,1,trim);                            // 窗台
            if(f>0&&rand()<.1)rc(g,bx+1,yb-3,2,1,'#b9bfc5');   // 窗型冷氣
            if(front&&f===0&&rand()<.3)rc(g,bx,yb-1,3,1,'#2c2d31');   // 窗台鐵花架
          }
        }
      }
    }
    // 屋頂：平屋頂、女兒牆、戶界矮牆、煙囪、樓梯間
    const Ct=tops(C,H);
    poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],'#59544e');
    const cop='#8d8377';
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.S[0],Ct.S[1]-1],cop);
    lineP(g,[Ct.S[0],Ct.S[1]-1],[Ct.E[0],Ct.E[1]-1],sh(cop,-26));
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.N[0],Ct.N[1]-1],'#6c665f');
    lineP(g,[Ct.N[0],Ct.N[1]-1],[Ct.E[0],Ct.E[1]-1],'#6c665f');
    for(let i=1;i<nH;i++){const t=i/nH,a=lerp(Ct.W,Ct.S,t),b=lerp(Ct.N,Ct.E,t);
      lineP(g,[a[0],a[1]-1],[b[0],b[1]-1],'#655f59');
      if(i%2===1||nH<=2){const p=lerp(a,b,.5),px=R(p[0]),py=R(p[1])-1,bc=houses[i].col;
        rc(g,px-1,py-4,1,4,sh(bc,4));rc(g,px,py-4,1,4,sh(bc,-38));rc(g,px-1,py-5,2,1,'#3a3a3c');rc(g,px-1,py,3,1,'rgba(20,26,22,.3)');
        if(houses[i].ant){rc(g,px+1,py-11,1,7,'#3a3d44');rc(g,px-1,py-11,5,1,'#3a3d44');rc(g,px,py-9,3,1,'#3a3d44');}}
    }
    // 天窗、通風管、樓梯間（各戶由 rand 決定）
    for(let i=0;i<nH;i++){const h=houses[i],t=(i+.5)/nH,a=lerp(Ct.W,Ct.S,t),b=lerp(Ct.N,Ct.E,t);
      if(h.sky){const p=lerp(a,b,.64),px=R(p[0])-1,py=R(p[1])-1;rc(g,px,py-1,3,2,'#7d8791');rc(g,px,py-2,3,1,'#a3abb2');rc(g,px+2,py-1,1,2,'#5f6870');rc(g,px,py+1,4,1,'rgba(20,26,22,.3)');}
      if(h.vent){const p=lerp(a,b,.42),px=R(p[0])+2,py=R(p[1])-1;rc(g,px,py-3,1,3,'#8e9499');rc(g,px-1,py-4,3,1,'#b9bec3');}
      if(h.bulk){const p=lerp(a,b,.24),px=R(p[0])-2,py=R(p[1])-1;rc(g,px,py-3,4,3,'#6a6259');rc(g,px,py-4,4,1,'#8a8278');rc(g,px+3,py-3,1,3,'#4e4740');rc(g,px,py,5,1,'rgba(20,26,22,.3)');}}
    // 石階與前院鐵欄（只有前排）
    if(front){
      const stX=stoops.map(s=>[s.dx-2*hB-1,s.dx+3]);
      for(let i=0;i<nH;i++){const xi0=R(C.W[0]+hw*i),xi1=R(C.W[0]+hw*(i+1))-1;
        for(let x=xi0;x<=xi1;x++){if(stX.some(r=>x>=r[0]&&x<=r[1]))continue;const y=foot(C.W,C.S,x)+2;
          rc(g,x-4,y-2,1,2,iron);if((x-xi0)%4===0)rc(g,x-4,y-3,1,1,iron);}}
      for(const s of stoops){
        const dx=s.dx,dy=s.dy,st=sh(stone,R((rand()-.5)*8)),stL=sh(st,18),stD=sh(st,-40);
        poly(g,[[dx+4,dy+1-hB],[dx+4,dy+2],[dx+4-2*hB,dy+2+hB]],stD);
        for(let kk=0;kk<hB;kk++){rc(g,dx-2*kk,dy-hB+2*kk,3,1,stL);rc(g,dx-2*(kk+1),dy-hB+2*kk+1,3,1,st);}
        rc(g,dx-2*hB,dy+hB,4,1,'rgba(16,22,18,.4)');
        lineP(g,[dx+3,dy+1-hB-3],[dx+3-2*hB,dy+1+hB-3],iron);rc(g,dx+3,dy+1-hB-3,1,3,iron);rc(g,dx+3-2*hB,dy+1+hB-3,1,3,iron);
        lineP(g,[dx-1,dy-hB-3],[dx-1-2*hB,dy+hB-3],iron);rc(g,dx-1,dy-hB-3,1,3,iron);rc(g,dx-1-2*hB,dy+hB-3,1,4,iron);
        if(s.lit&&ng){ng.fillStyle='rgba(255,214,140,.32)';ng.fillRect(dx-1,dy-hB-1,5,2);}
        if(s.h.bins)bins(dx+5,foot(C.W,C.S,dx+5)+2,1+(rand()<.5?1:0));
      }
      // 人行道道具：行道樹在成對戶之間、消防栓、路燈、垃圾桶
      const vt=1-1.1/(16*bh);
      for(let i=2;i<nH;i+=2){const u=box[0]+(box[1]-box[0])*(i/nH);props.push(['tree',P0(u,vt)]);}
      if(nH>=2){const u=box[0]+(box[1]-box[0])*(.5/nH);props.push(['hyd',P0(u,vt-.02)]);}
      const uL=box[1]-(box[1]-box[0])*(.45/nH);props.push(['lamp',P0(Math.min(uL,box[1]),vt-.01)]);
      if(LX>=90)props.push(['lamp',P0(box[0]+(box[1]-box[0])*(.15/nH),vt-.01)]);
    }
  };
  for(const rw of rows)drawRow(rw);
  for(const [t,p] of props){const x=R(p[0]),y=R(p[1]);if(t==='tree')tree(x,y);else if(t==='hyd')hydrant(x,y);else lamp(x,y);}
  return {pitch:false};
}};

// ---------------------------------------------------------------- usPrewar
// 戰前公寓：沿街分成數段（各自磚色、窗型、入口、逃生梯、水塔），每層樓一條淺色窗台帶、3px 窗、5px 節距；
// 一樓挑高石帶、雨遮入口或店面；轉角隅石；平屋頂上木水塔（圓桶＋錐頂立在鋼架）、樓梯間、通風管、鍋爐煙囪。
// twin 原型：核心先畫的第二棟灰盒子清掉，用同一套語彙重畫成配對的磚樓（painter order：後棟先、前棟後）。
REG.usPrewar={name:'usPrewar',draw(ctx){
  const T=tools(ctx),{A,g,ng,G,G0,rand,v,bw,bh,ar,wallH}=ctx,{sh,rc,poly,clearPoly,lineP,foot,cols,wall,sub,lerp,tops,hex,glass,litCol,tree,hydrant,lamp,bins,clearMass}=T;
  const box=(ar&&ar.box)||[0,1,0,1];
  const P0=(u,vv)=>A.paraPt559(G0,u,vv);
  const para0=(b)=>({N:P0(b[0],b[2]),E:P0(b[1],b[2]),S:P0(b[1],b[3]),W:P0(b[0],b[3])});
  const gf=9,fh=7;
  const BRICK=['#8c4b3b','#95553f','#7b4a3c','#a5744f','#6f4a3d','#8e5a46','#9a6a52'];
  const CANOPY=['#2f5a3a','#5a2a2a','#2a3a5a','#3a3a3a'],SIGN=['#b8402f','#2f6a4a','#2b4a8a','#8a6a2a'],DOORS=['#2a2420','#3a2c22','#1f2f45','#4a2a2a'];
  const iron='#24252a',glassF='#3f4d59',glassR='#2c3640';
  const budget=(C)=>Math.max(3,Math.floor((C.N[1]-2-19-gf-4)/fh));   // 19 = 水塔 18px ＋ 1px 餘裕，保證塔尖 y≥2
  let nF=clampN(R(wallH/6.5),5,12);
  // 第二量體（twin）：與主量體不重疊才接手；判斷前後（u 或 v 較大者在前）
  let exC=null,exFront=true;
  if(ar&&ar.ex&&ar.ex.box){const e=ar.ex.box;
    const disjoint=e[0]>=box[1]-.01||e[1]<=box[0]+.01||e[2]>=box[3]-.01||e[3]<=box[2]+.01;
    if(disjoint){exC=para0(e);exFront=(e[0]>=box[1]-.01)||(e[2]>=box[3]-.01);}}
  scrubYard(ctx,!(ar&&ar.ex)||!!exC);
  if(exC){const exH0=Math.max(6,R(wallH*ar.ex.hm));clearPoly(g,hex(exC,exH0,12));if(ng)clearPoly(ng,hex(exC,exH0,12));}
  if(box[3]<.95)sidewalk(ctx,T,box[3]);
  const props=[];
  // ---- 一棟（可多段）
  const building=(C,nFb,seedShift)=>{
    const LX=C.S[0]-C.W[0],nS=Math.max(1,R(LX/36));
    let bi=(Math.abs(v)+seedShift)%BRICK.length;
    const secs=[];
    for(let s=0;s<nS;s++){
      bi=(bi+1+((rand()*(BRICK.length-2))|0))%BRICK.length;
      const brick=sh(BRICK[bi],R((rand()-.5)*8)),tan=BRICK[bi]==='#a5744f'||BRICK[bi]==='#9a6a52';
      secs.push({u0:s/nS,u1:(s+1)/nS,brick,stone:tan?'#dfd3b8':'#cdbb9c',stoneBase:rand()<.4,
        paired:rand()<.45,shop:rand()<.3,canopy:CANOPY[(rand()*CANOPY.length)|0],sign:SIGN[(rand()*SIGN.length)|0],door:DOORS[(rand()*DOORS.length)|0],
        nF:nFb-((nS>=2&&rand()<.35)?1:0),tower:rand()<(nS===1?.85:.6),bulk:rand()<.6,chim:rand()<.5,brickPar:rand()<.4,escAt:rand()});
    }
    for(let s=0;s<nS;s++){
      const S=secs[s],Cs=sub(C,S.u0,S.u1,0,1),Hs=gf+1+S.nF*fh+3;
      clearMass(Cs,Hs);                               // 前一段的端牆窗燈被這一段蓋住的部分，從 ng 清掉（只剩退台露出的部分）
      const brick=S.brick,stone=S.stone,base=S.stoneBase?'#a89578':sh(brick,-14),sill=sh(brick,16),brickR=sh(brick,-46);
      const xs0=R(Cs.W[0]),xsS=R(Cs.S[0]),xsE=R(Cs.E[0]),hwI=xsS-xs0+1;
      // 正面牆柱
      for(let x=xs0;x<=xsS;x++){const y=foot(Cs.W,Cs.S,x);
        rc(g,x,y-Hs,1,Hs,brick);rc(g,x,y-gf,1,gf,base);rc(g,x,y-gf-1,1,1,stone);rc(g,x,y-1,1,1,sh(base,-26));
        for(let f=0;f<S.nF;f++)rc(g,x,y-gf-2-f*fh,1,1,sill);
        rc(g,x,y-Hs,1,1,sh(stone,10));
        rc(g,x,y-Hs+1,1,1,S.brickPar?((x&1)?sh(brick,-30):sh(brick,-6)):sh(stone,-14));
        rc(g,x,y-Hs+2,1,1,sh(brick,-30));
      }
      // 窗位
      const avail=hwI-2,wx=[];
      if(S.paired){const nP=Math.max(1,Math.floor((avail+3)/10)),pad=Math.max(0,Math.floor((avail-(10*nP-3))/2));for(let p=0;p<nP;p++){wx.push(xs0+1+pad+10*p);wx.push(xs0+1+pad+10*p+4);}}
      else{const nW=Math.max(1,Math.floor((avail+2)/5)),pad=Math.max(0,Math.floor((avail-(5*nW-2))/2));for(let j=0;j<nW;j++)wx.push(xs0+1+pad+5*j);}
      const dx=xs0+(hwI>>1)-1,dy=foot(Cs.W,Cs.S,dx+1);
      for(const x of wx){const yx=foot(Cs.W,Cs.S,x+1);
        for(let f=0;f<S.nF;f++){const yb=yx-gf-2-f*fh;
          rc(g,x,yb-4,3,1,stone);glass(x,yb-3,3,3,glassF,rand()<.36,litCol(rand()));rc(g,x,yb,3,1,sh(stone,-6));
          if(rand()<.08)rc(g,x,yb-1,2,1,'#c3c8cd');}
        if(!S.shop&&Math.abs(x-dx)>=4){rc(g,x,yx-7,3,1,sh(stone,-10));glass(x,yx-6,3,3,sh(glassF,-8),rand()<.3,litCol(rand()));}
      }
      // 一樓：店面或雨遮入口
      if(S.shop&&hwI>=20){
        const sc=S.sign;
        for(let x=xs0+1;x<xsS;x++){const y=foot(Cs.W,Cs.S,x);rc(g,x,y-9,1,2,sc);if((x-xs0)%5===2)rc(g,x,y-9,1,1,sh(sc,50));rc(g,x,y-7,1,1,sh(sc,-40));}
        for(let x=xs0+2;x+5<=xsS-1;x+=6){if(Math.abs(x+2-dx)<4)continue;const y=foot(Cs.W,Cs.S,x+2);
          rc(g,x-1,y-6,7,1,'#4a4a4e');glass(x,y-6,5,4,'#4f6470',rand()<.7,'#e6efb8');rc(g,x+2,y-6,1,4,'#4a4a4e');}
      }else{
        const y0=dy-9,cp=S.canopy;
        rc(g,dx-1,y0,5,1,cp);rc(g,dx-3,y0+1,5,1,cp);rc(g,dx-5,y0+2,5,1,sh(cp,22));
        rc(g,dx-5,y0+3,1,5,'#3a3d44');rc(g,dx-1,y0+3,1,7,'#3a3d44');
        if(ng){ng.fillStyle='rgba(255,225,160,.45)';ng.fillRect(dx-3,y0+1,5,1);}
      }
      rc(g,dx-1,dy-8,5,1,sh(stone,8));rc(g,dx,dy-7,3,1,'#9fb2c2');rc(g,dx,dy-6,3,5,S.door);rc(g,dx+1,dy-6,1,5,sh(S.door,-18));
      rc(g,dx-1,dy-1,5,1,sh(stone,12));rc(g,dx-3,dy,5,1,sh(stone,-6));
      if(ng){ng.fillStyle='#ffe0a0';ng.fillRect(dx,dy-7,3,1);}
      // 逃生梯（Z 字）
      {const nWin=wx.length;let ei=Math.floor(S.escAt*nWin);if(S.paired)ei=ei&~1;ei=clampN(ei,0,Math.max(0,nWin-1));
        const ex0=wx[ei],ew=(S.paired&&ei+1<nWin)?7:3;
        if(ex0!==undefined&&Math.abs(ex0+ew/2-dx-1)>=5){const yx=foot(Cs.W,Cs.S,ex0+1);
          for(let f=0;f<S.nF;f++){const yb=yx-gf-2-f*fh;
            rc(g,ex0-1,yb+1,ew+2,1,iron);for(let i=0;i<ew+2;i+=2)rc(g,ex0-1+i,yb-2,1,1,iron);rc(g,ex0-1,yb-2,1,3,iron);rc(g,ex0+ew,yb-2,1,3,iron);
            if(f<S.nF-1){if(f%2===0)lineP(g,[ex0+ew,yb],[ex0-1,yb-fh+1],iron);else lineP(g,[ex0-1,yb],[ex0+ew,yb-fh+1],iron);}
            else{for(let i=0;i<ew+2;i+=2)rc(g,ex0-1+i,yb-4,1,1,iron);}}
          rc(g,ex0+ew,yx-gf-1,1,3,iron);}}
      // 轉角隅石
      {const y=foot(Cs.W,Cs.S,xsS);for(let yy=y-Hs+3;yy<y-1;yy++)rc(g,xsS,yy,1,1,((yy>>1)&1)?sh(stone,-16):sh(brick,-20));}
      // 端牆（背光）
      wall(g,Cs.S,Cs.E,Hs,brickR);
      cols(Cs.S,Cs.E,(x,y)=>{if(x===xsS)return;rc(g,x,y-gf,1,gf,sh(base,-44));rc(g,x,y-gf-1,1,1,sh(stone,-50));rc(g,x,y-1,1,1,sh(brickR,-18));
        for(let f=0;f<S.nF;f++)rc(g,x,y-gf-2-f*fh,1,1,sh(brickR,12));
        rc(g,x,y-Hs,1,1,sh(stone,-38));rc(g,x,y-Hs+1,1,1,sh(brickR,-8));rc(g,x,y-Hs+2,1,1,sh(brickR,-22));});
      for(let x=xsS+3;x+3<=xsE-2;x+=5){const yx=foot(Cs.S,Cs.E,x+1);
        for(let f=0;f<S.nF;f++){const yb=yx-gf-2-f*fh;rc(g,x,yb-4,3,1,sh(stone,-44));glass(x,yb-3,3,3,glassR,rand()<.26,'#e8c47a');}
        if(rand()<.6)glass(x,yx-6,3,3,sh(glassR,-6),rand()<.25,'#e8c47a');}
      {const xp=xsS+1;rc(g,xp,foot(Cs.S,Cs.E,xp)-Hs+3,1,Hs-4,'#3e4249');}
      // 屋頂
      const Ct=tops(Cs,Hs);
      poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],'#4f4b47');
      lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.S[0],Ct.S[1]-1],'#7a726a');lineP(g,[Ct.S[0],Ct.S[1]-1],[Ct.E[0],Ct.E[1]-1],'#5e5852');
      lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.N[0],Ct.N[1]-1],'#666059');lineP(g,[Ct.N[0],Ct.N[1]-1],[Ct.E[0],Ct.E[1]-1],'#666059');
      const RW=Ct.S[0]-Ct.W[0],RD=Ct.E[0]-Ct.S[0];
      const rp=(u,vv)=>{const p=A.paraPt559(Ct,u,vv);return [R(p[0]),R(p[1])-1];};
      // 屋面油毛氈接縫：平行正面、每 9px 一道（只在屋頂多邊形內，端點各縮 1px 免壓到女兒牆線）
      {const nSeam=Math.floor(RD/9);for(let i=1;i<nSeam;i++){const t=i/nSeam,a=lerp(Ct.W,Ct.N,t),b=lerp(Ct.S,Ct.E,t);
        lineP(g,[a[0]+1,a[1]],[b[0]-1,b[1]],'#56524e');}}
      // 木水塔：鋼架（四腳＋X 撐）→ 平台 → 木桶（三階受光、兩道鐵箍）→ 錐頂＋頂針；桶身比屋面暖亮很多，遠看仍認得出
      if(S.tower&&RW>=14&&RD>=12){const p=rp(.5+rand()*.25,.32+rand()*.2),px=p[0],py=p[1];
        const leg='#3b3733';
        rc(g,px-4,py+1,9,1,'rgba(20,26,22,.30)');
        rc(g,px-3,py-6,1,6,leg);rc(g,px+3,py-6,1,6,leg);rc(g,px,py-5,1,5,sh(leg,-12));
        lineP(g,[px-3,py-6],[px+3,py-1],sh(leg,-6));lineP(g,[px+3,py-6],[px-3,py-1],sh(leg,-6));
        rc(g,px-3,py-7,7,1,'#2f2b28');                                    // 平台
        rc(g,px-3,py-14,3,7,'#b48a5a');rc(g,px,py-14,2,7,'#8a6440');rc(g,px+2,py-14,2,7,'#5a3f2c');   // 桶身（左亮→右暗）
        rc(g,px-3,py-12,7,1,'#3a2e24');rc(g,px-3,py-9,7,1,'#3a2e24');       // 鐵箍
        rc(g,px-3,py-15,7,1,'#6d6863');rc(g,px-2,py-16,5,1,'#5c5854');rc(g,px-1,py-17,3,1,'#4e4a47');rc(g,px,py-18,1,1,'#2a2826');   // 錐頂＋頂針
        rc(g,px-3,py-15,3,1,'#7e7973');rc(g,px-2,py-16,2,1,'#6a6661');}    // 錐頂受光面
      // 天窗（鋼框＋玻璃，夜間偶爾透光）：放在前緣附近、避開樓梯間與水塔
      if(rand()<.5&&RW>=16&&RD>=12){const p=rp(.34+rand()*.14,.68+rand()*.14),px=p[0],py=p[1];
        rc(g,px-2,py-2,5,3,'#8d949a');rc(g,px-1,py-1,3,1,'#6b8898');rc(g,px-2,py+1,6,1,'rgba(20,26,22,.28)');rc(g,px+2,py-2,1,3,'#5f666c');
        if(ng&&rand()<.4){ng.fillStyle='rgba(255,226,160,.55)';ng.fillRect(px-1,py-1,3,1);}}
      if(S.bulk&&RW>=12&&RD>=10){const p=rp(.18+rand()*.15,.5+rand()*.15),px=p[0],py=p[1];
        rc(g,px-3,py-4,6,4,sh(brick,-10));rc(g,px-3,py-5,6,1,sh(brick,10));rc(g,px+2,py-4,1,4,sh(brick,-40));rc(g,px-2,py-3,1,2,'#2a2420');rc(g,px-3,py,7,1,'rgba(20,26,22,.3)');}
      if(S.chim&&RD>=10){const p=rp(.82,.2),px=p[0],py=p[1];rc(g,px-1,py-7,1,7,sh(brick,-6));rc(g,px,py-7,1,7,sh(brick,-40));rc(g,px-1,py-8,2,1,'#3a3a3c');}
      for(let i=0;i<2;i++){if(rand()<.4)continue;const p=rp(.15+rand()*.7,.15+rand()*.7);rc(g,p[0],p[1]-3,1,3,'#8e9499');rc(g,p[0],p[1]-4,1,1,'#b9bec3');}
    }
    return secs;
  };
  const mainC=G;
  const nFm=Math.min(nF,budget(mainC));
  if(exC&&!exFront){building(exC,Math.min(nF+(rand()<.5?1:0),budget(exC)),3);}
  building(mainC,nFm,0);
  if(exC&&exFront){building(exC,Math.min(nF+(rand()<.5?1:0),budget(exC)),3);}
  // 人行道道具
  if(box[3]<.95){
    const vt=1-1.1/(16*bh),n=Math.max(1,R(bw*32/40));
    for(let i=0;i<n;i++)props.push(['tree',P0(box[0]+(box[1]-box[0])*((i+.27)/n),vt)]);
    props.push(['lamp',P0(box[1]-.06/bw,vt-.01)]);
    if(bw>=2)props.push(['hyd',P0(box[0]+.12/bw,vt-.02)]);
    props.push(['bins',P0(box[0]+.3/bw,vt-.03)]);
  }
  for(const [t,p] of props){const x=R(p[0]),y=R(p[1]);if(t==='tree')tree(x,y);else if(t==='hyd')hydrant(x,y);else if(t==='bins')bins(x,y,2);else lamp(x,y);}
  return {pitch:false};
}};
})();
