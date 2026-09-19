// facade_usmain.js — T577 美式主街立面繪製器（實驗線）
// usMainStreet：美國 1900–1930 Main Street 磚造商業建築，一支繪製器套兩個原型（依 ctx.lv 分流）：
//   shophouse（k2 lv1）：一排 2–3 層店屋。一樓整面大玻璃＋橫窗＋內縮入口＋條紋／素色遮陽篷；一二樓間招牌帶（店名色塊）；
//                       上層雙懸窗配石楣石台；女兒牆＋托架簷口＋中央名牌方塊；戶與戶磚色／高度／篷色／店招各異；
//                       側牆褪色油漆廣告（ghost sign）；人行道鑄鐵路燈、消防栓、郵筒、長椅、路緣停的老車。
//   office（k2 lv2）：4–5 層芝加哥式商業樓。基座（店面＋石框主入口）／樓身（芝加哥三聯窗或成對雙懸窗、頂層拱窗、連續壁柱、樓板帶）／
//                     厚簷口＋女兒牆＋名牌；轉角隅石；側牆逃生梯與 ghost sign；屋頂木水塔／看板／樓梯間／天窗。
// 登記：window.__facade577.usMainStreet={name,draw(ctx)}；只畫牆／窗／屋頂／人行道小件，地坪與接地陰影由核心畫好。
// 座標：C.W→C.S 受光正面（朝路），C.S→C.E 背光端牆；外凸方向（篷、招牌）在螢幕上是 (-2,+1)。
// 全部整數像素；亂數只用 ctx.rand（決定性）。前景小件用 rcN：白天畫上、夜光畫布同位置清掉 ⇒ 夜裡只有白天畫出的窗／燈具／店招會亮。
(function(){
'use strict';
const REG=window.__facade577=window.__facade577||{};
const R=Math.round;

function tools(ctx){
  const A=ctx.A,sh=A.shade,g=ctx.g,ng=ctx.ng;
  const rc=(cx,x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(R(x),R(y),w,h);};
  const rcN=(x,y,w,h,c)=>{rc(g,x,y,w,h,c);if(ng)ng.clearRect(R(x),R(y),w,h);};
  const lit=(x,y,w,h,c)=>{if(ng){ng.fillStyle=c;ng.fillRect(R(x),R(y),w,h);}};
  // 多邊形掃描線（像素中心取樣、硬邊）
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
  // 牆頂四角（與牆柱同一套 round；-.02 讓牆頂那列不落進屋頂掃描線）
  const tops=(C,h)=>{const xW=R(C.W[0]),xS=R(C.S[0]),xE=R(C.E[0]);
    return {W:[xW,foot(C.W,C.S,xW)-h-.02],S:[xS,foot(C.W,C.S,xS)-h-.02],E:[xE,foot(C.S,C.E,xE)-h-.02],N:[R(C.N[0]),R(C.N[1])-h-.02]};};
  // 夜光畫布是疊加的：這個量體白天會蓋到的範圍（正面牆柱、端牆柱、屋頂）先把 ng 清掉，夜光才跟白天 painter order 一致
  const clearMass=(C,h)=>{if(!ng)return;cols(C.W,C.S,(x,y)=>ng.clearRect(x,y-h,1,h+1));cols(C.S,C.E,(x,y)=>ng.clearRect(x,y-h,1,h+1));
    const Ct=tops(C,h);clearPoly(ng,[[Ct.N[0],Ct.N[1]-1],[Ct.E[0]+1,Ct.E[1]-1],[Ct.S[0],Ct.S[1]],[Ct.W[0]-1,Ct.W[1]-1]]);};
  // 雙懸窗：y=窗台列；玻璃 y-h..y-1；石楣 y-h-1；中間一列淺色＝上下扇交接橫檔
  const dh=(x,y,w,h,glassC,stone,on,lc)=>{rc(g,x,y-h-1,w,1,stone);rc(g,x,y-h,w,h,glassC);if(w>=2)rc(g,x,y-h,w-1,1,sh(glassC,14));
    rc(g,x,y-h+(h>>1),w,1,sh(glassC,26));rc(g,x,y,w,1,sh(stone,-8));if(on)lit(x,y-h,w,h,lc);};
  const WARM=['#ffd98c','#ffe4a8','#ffcf78'],COOL='#d8e4ff';
  const litCol=(r,office)=>office?(r<.5?WARM[0]:r<.78?WARM[1]:COOL):(r<.7?WARM[0]:r<.92?WARM[2]:WARM[1]);
  // ---- 人行道小件（p=站立點）
  const lampOld=(x,y)=>{const post='#2c3a30';
    rcN(x-1,y-1,3,1,post);rcN(x,y-9,1,8,post);rcN(x-1,y-9,3,1,'#3d4d40');rcN(x-1,y-11,3,2,'#efe8cf');rcN(x,y-12,1,1,post);
    rc(g,x-1,y,4,1,'rgba(20,26,22,.30)');
    lit(x-1,y-11,3,2,'#fff3cc');lit(x-2,y-12,5,4,'rgba(255,236,170,.20)');lit(x-3,y-1,7,2,'rgba(255,236,170,.12)');};
  const oldCar=(x,y,col)=>{const d=sh(col,-30),l=sh(col,18);
    rcN(x-5,y-3,11,3,col);rcN(x-5,y-4,11,1,l);              // 車身＋引擎蓋／行李箱高光
    rcN(x-3,y-7,6,3,col);rcN(x-3,y-8,6,1,l);                  // 高車廂＋車頂
    rcN(x-2,y-7,4,2,'#8fb0c4');rcN(x,y-7,1,2,sh(col,-10));    // 車窗＋中柱
    rcN(x+3,y-7,1,3,d);rcN(x+5,y-4,1,4,d);                    // 背光側
    rcN(x-5,y-1,11,1,sh(col,-24));                            // 踏板／裙板
    rcN(x-4,y,2,1,'#1c1a18');rcN(x+2,y,2,1,'#1c1a18');        // 輪
    rcN(x+5,y-3,1,1,'#e9dca8');                               // 頭燈（停車不亮）
    rc(g,x-5,y+1,12,1,'rgba(20,26,22,.30)');};
  const hydrant=(x,y)=>{rcN(x,y-3,1,3,'#c23b2c');rcN(x-1,y-2,3,1,'#c23b2c');rcN(x,y-4,1,1,'#8a2a20');rc(g,x,y,2,1,'rgba(20,26,22,.3)');};
  const mailbox=(x,y)=>{rcN(x,y-3,2,3,'#2f4a6a');rcN(x,y-4,2,1,'#4d6c8c');rcN(x+1,y-2,1,1,'#1e3248');rc(g,x,y,3,1,'rgba(20,26,22,.3)');};
  const bench=(x,y)=>{rcN(x,y-3,5,1,'#7e5a38');rcN(x,y-2,5,1,'#6a4a2e');rcN(x,y-1,1,1,'#2a2a2e');rcN(x+4,y-1,1,1,'#2a2a2e');rc(g,x,y,6,1,'rgba(20,26,22,.28)');};
  return {sh,rc,rcN,lit,spans,poly,clearPoly,lineP,fy,foot,cols,wall,sub,lerp,tops,clearMass,dh,litCol,lampOld,oldCar,hydrant,mailbox,bench};
}

// 核心 lotFill570 在 k=2 前庭畫的車／花台／柱子會戳出地界 1–3px；用精確色把 G0 外的清成透明（G0 內整塊稍後重鋪）。
// 夜光畫布上核心那兩顆「無燈具的光斑」一併清掉（這兩個原型沒有 ex 裙樓，ng 上沒別的東西）。
function scrub(ctx,T){
  const {g,ng,G0}=ctx,sh=T.sh,W=g.canvas.width,H=g.canvas.height;
  const ax=G0.E[0]-G0.N[0],ay=G0.E[1]-G0.N[1],bx=G0.W[0]-G0.N[0],by=G0.W[1]-G0.N[1],det=(ax*by-ay*bx)||1;
  const in0=(x,y)=>{const px=x+.5-G0.N[0],py=y+.5-G0.N[1];const u=(px*by-py*bx)/det,v=(ax*py-ay*px)/det;return u>=-.02&&u<=1.02&&v>=-.02&&v<=1.02;};
  const set=new Set();const add=h=>set.add(parseInt(h.slice(1),16));
  for(const c of ['#b4544a','#3f6f9a','#c9a63f','#4d7f56','#8d5aa0','#c4c8cc']){add(c);add(sh(c,24));add(sh(c,-16));add(sh(c,-34));}
  ['#5e5a53','#9fc4d8','#221f1c','#ffe9a8','#7b6a52','#95836a','#3f7a3c','#4f9449','#b9bcc0','#e2e5e8'].forEach(add);
  const im=g.getImageData(0,0,W,H),d=im.data;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,a=d[i+3];if(a===0||in0(x,y))continue;
    const key=(d[i]<<16)|(d[i+1]<<8)|d[i+2];
    if(a===255&&set.has(key))d[i+3]=0;
    else if(a<200&&d[i]>200&&d[i+1]>200)d[i+3]=0;}
  g.putImageData(im,0,0);
  if(ng)ng.clearRect(0,0,W,H);
}

// 人行道帶（G0 的 v∈[vF,1] 全寬）：混凝土＋分縫、路緣線、停車帶柏油；回傳路緣 v
function sidewalk(ctx,T,vF,kerbPx){
  const {A,g,G0,bw,bh}=ctx,{poly,lineP}=T;
  const P=(u,v)=>A.paraPt559(G0,u,v);
  const vK=Math.min(1,vF+kerbPx/(16*bh));
  poly(g,[P(0,vF),P(1,vF),P(1,1),P(0,1)],'#5d5c58');
  poly(g,[P(0,vF),P(1,vF),P(1,vK),P(0,vK)],'#b3b0a7');
  const n=Math.max(2,R(bw*32/11));
  for(let i=1;i<n;i++)lineP(g,P(i/n,vF),P(i/n,vK),'#a5a299');
  lineP(g,P(0,vK),P(1,vK),'#8c8981');
  return vK;
}

// 褪色油漆廣告（畫在背光端牆上：faded 面板＋兩行「字」＋底線）；x0..x0+w 欄、從各欄牆腳算起 top..top+h 列
function ghostSign(T,g,a,b,H,x0,w,top,h,pal){
  const {rc,foot}=T;
  for(let x=x0;x<x0+w;x++){const y=foot(a,b,x)-H+top,k=x-x0;
    rc(g,x,y,1,h,pal[0]);
    if(k>=1&&k<w-1&&(k%3)!==0)rc(g,x,y+2,1,2,pal[1]);
    if(h>=9&&k>=2&&k<w-2&&(k%3)!==2)rc(g,x,y+6,1,1,pal[1]);
    if(h>=12&&k>=1&&k<w-1)rc(g,x,y+h-3,1,1,pal[2]);}
}
const GHOST=[['rgba(28,40,80,.28)','rgba(238,232,214,.34)','rgba(238,232,214,.18)'],['rgba(150,32,26,.28)','rgba(242,232,200,.34)','rgba(242,232,200,.18)'],
             ['rgba(20,20,24,.24)','rgba(236,228,200,.32)','rgba(236,228,200,.16)'],['rgba(236,226,196,.18)','rgba(22,20,18,.30)','rgba(22,20,18,.16)']];

// 店面（兩個原型共用）：勒腳、大玻璃（櫥窗擺設）、橫窗、招牌帶＋店名色塊、內縮入口、遮陽篷、夜光
// 參數：Cs 量體、x 範圍 [xa,xb]（不含柱）、sign=[bg,letter]、awn=[c1,c2|null]|null、door 側、rowSign=招牌帶起始列（自牆腳）、signH
function storefront(T,g,Cs,xa,xb,o){
  const {sh,rc,rcN,lit,foot}=T;
  const GLASS='#4a6272',GLASS_T='#7d9cab';
  const f=(x)=>foot(Cs.W,Cs.S,x);
  const wi=xb-xa+1;
  for(let x=xa;x<=xb;x++){const y=f(x);
    rc(g,x,y-2,1,2,o.bulk);rc(g,x,y-8,1,6,GLASS);rc(g,x,y-8,1,1,sh(GLASS,16));rc(g,x,y-10,1,2,GLASS_T);
    rc(g,x,y-10-o.signH,1,o.signH,o.sign[0]);}
  // 櫥窗擺設：玻璃底兩列的幾個色點
  const DISP=['#c94a3a','#d9b23a','#3a7a52','#e8dcc0','#2a4a8a','#c98a3a'];
  for(let x=xa+1;x<xb;x+=2+(((x*7)>>1)&1)){if(o.rand()<.55)rc(g,x,f(x)-4,1,(o.rand()<.5?1:2),DISP[(o.rand()*DISP.length)|0]);}
  // 店名色塊（2 亮 1 空）
  const tw=Math.max(2,Math.min(wi-2,4+((o.rand()*9)|0))),tx=xa+((wi-tw)>>1),ry=o.signH>=3?11:11;
  for(let x=tx;x<tx+tw;x++){if(((x-tx)%3)===2)continue;rc(g,x,f(x)-ry-1,1,1,o.sign[1]);}
  // 中挺（玻璃夠寬）
  if(wi>=12){const mx=xa+(wi>>1);rc(g,mx,f(mx)-8,1,6,sh(GLASS,-22));}
  // 內縮入口：門扇 3 欄、左右門框暗 1 欄、門檻、把手；門上橫窗留著（夜裡會亮）
  const dx=o.doorSide?xb-3:xa+1,dy=f(dx+1);
  rc(g,dx-1,dy-8,1,8,'#1e2422');rc(g,dx+3,dy-8,1,8,'#1e2422');
  rc(g,dx,dy-8,3,8,o.door);rc(g,dx+1,dy-8,1,7,sh(o.door,-18));rc(g,dx,dy-6,3,1,sh(o.door,14));rc(g,dx+(o.doorSide?0:2),dy-4,1,1,'#d8b860');
  rc(g,dx,dy-1,3,1,'#9a9488');
  // 夜光：玻璃、橫窗、門上橫窗、店招
  const on=o.rand()<.72;
  if(on){for(let x=xa;x<=xb;x++){if(x>=dx-1&&x<=dx+3)continue;const y=f(x);lit(x,y-8,1,6,'rgba(255,222,150,.88)');lit(x,y-10,1,2,'rgba(255,238,196,.92)');}}
  if(on||o.rand()<.5)lit(dx,dy-10,3,2,'#ffe4a8');
  if(o.signLit){for(let x=tx;x<tx+tw;x++){if(((x-tx)%3)===2)continue;lit(x,f(x)-ry-1,1,1,'#fff0c0');}lit(tx-1,f(tx)-10-o.signH,tw+2,o.signH,'rgba(255,230,170,.22)');}
  // 遮陽篷：貼在 y-9 列，外凸 1 單位（-2,+1）：欄 x 的第 d 列對應牆位 u=x+d；條紋沿牆每 2px 換色；外緣稍暗、垂幕更暗；篷下玻璃變暗
  if(o.awn){const [c1,c2]=o.awn,xlo=o.first?xa:xa-2;
    const colAt=(u)=>c2?((((u-xa)>>1)&1)?c2:c1):c1;
    for(let x=xlo;x<=xb;x++){const yx=f(x);
      for(let d=0;d<=2;d++){const u=x+d;if(u<xa||u>xb)continue;rcN(x,yx-9+d,1,1,d===2?sh(colAt(u),-14):colAt(u));}
      if(x+2>=xa&&x+2<=xb)rcN(x,yx-6,1,1,sh(colAt(x+2),-42));}
    for(let x=xa;x+2<=xb;x++){if(x>=dx-1&&x<=dx+3)continue;rc(g,x,f(x)-5,1,1,sh(GLASS,-12));}}
  return {dx,dy};
}

// 後翼（深街區的店屋後段矮一層）：只看得到端牆、屋頂；正面被前段蓋住（仍鋪素磚防止圓整縫隙）
function rearWing(ctx,T,Cr,Hr,nFr,brick,stone,S){
  const {A,g,rand}=ctx,{sh,rc,lit,poly,lineP,foot,cols,wall,lerp,tops,clearMass,dh}=T;
  const brickR=sh(brick,-46);
  clearMass(Cr,Hr);
  wall(g,Cr.W,Cr.S,Hr,brick);
  wall(g,Cr.S,Cr.E,Hr,brickR);
  const xrS=R(Cr.S[0]),xrE=R(Cr.E[0]),DXr=xrE-xrS,fE=(x)=>foot(Cr.S,Cr.E,x);
  cols(Cr.S,Cr.E,(x,y)=>{rc(g,x,y-1,1,1,sh(brickR,-16));rc(g,x,y-Hr,1,1,sh(stone,-40));rc(g,x,y-Hr+1,1,1,sh(brickR,-4));rc(g,x,y-Hr+3,1,1,sh(stone,-52));rc(g,x,y-Hr+4,1,1,sh(brickR,-14));});
  if(DXr>=10){const wx=xrS+R(DXr*.5),yw=fE(wx+1);
    for(let f=0;f<nFr;f++)dh(wx,yw-14-1-f*8,3,4,'#2e3c46',sh(stone,-56),rand()<.2,'#e8c47a');
    if(rand()<.7)dh(wx,yw-3,3,4,'#2a3640',sh(stone,-56),rand()<.25,'#e8c47a');}
  const Ct=tops(Cr,Hr);
  poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],S.roof);
  lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.S[0],Ct.S[1]-1],sh(stone,-4));lineP(g,[Ct.S[0],Ct.S[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-30));
  lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.N[0],Ct.N[1]-1],sh(stone,-12));lineP(g,[Ct.N[0],Ct.N[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-12));
  if(Ct.S[1]-Ct.N[1]>=6){lineP(g,[Ct.W[0]+1,Ct.W[1]],[Ct.N[0]+1,Ct.N[1]],sh(brickR,-6));lineP(g,[Ct.N[0]+1,Ct.N[1]],[Ct.E[0]-1,Ct.E[1]],sh(brick,-8));}
  const rp=(u,vv)=>{const p=A.paraPt559(Ct,u,vv);return [R(p[0]),R(p[1])-1];};
  if(rand()<.6&&DXr>=8){const p=lerp(Ct.S,Ct.E,.5),px=R(p[0]),py=R(p[1])-1;if(py-6>=2){rc(g,px-1,py-4,1,4,sh(brick,2));rc(g,px,py-4,1,4,sh(brick,-40));rc(g,px-1,py-5,2,1,'#3a3a3c');}}
  if(rand()<.5&&DXr>=10){const p=rp(.5,.5),px=p[0],py=p[1];if(py-3>=2){rc(g,px-1,py-2,3,2,'#8d959b');rc(g,px-1,py-1,3,1,'#6b8898');rc(g,px+2,py-2,1,2,'#5f666c');if(rand()<.4)lit(px-1,py-1,3,1,'rgba(255,226,160,.55)');}}
  if(rand()<.5){const p=rp(.3,.3),px=p[0],py=p[1];if(py-4>=2){rc(g,px,py-3,1,3,'#8e9499');rc(g,px-1,py-4,3,1,'#b9bec3');}}
}

// ---------------------------------------------------------------- lv1：Main Street 店屋列
function mainStreet(ctx,T,C,vFront){
  const {A,g,ng,rand,bw,bh,G0}=ctx,{sh,rc,rcN,lit,poly,lineP,foot,cols,wall,sub,lerp,tops,clearMass,dh,litCol,lampOld,oldCar,hydrant,mailbox,bench}=T;
  const gf=14,fh=8,cr=3;
  const yN=R(C.N[1]);
  const nFmax=Math.max(1,Math.floor((yN-2-gf-1-cr-2)/fh));
  const DXall=R(C.E[0])-R(C.S[0]);
  const BRICK=[['#9a4a3a','#e2d6bf'],['#b25a3e','#ead9bf'],['#7e3b30','#d9cbb2'],['#b8905e','#efe4cc'],['#d5c39d','#f4ead6'],['#8f5a48','#e6d8c0'],['#a3624a','#eedfc4'],['#c07a4a','#f0e2c8']];
  const AWN=[['#3a7a52','#e9e3d3'],['#a83a34','#ece5d5'],['#2d4f7a','#e9e3d3'],['#6a4a2a','#dccaa8'],['#2f5a3a',null],['#6e2a2a',null],['#2a3a5a',null],['#8a6a2a',null],['#4a4a50',null]];
  const SIGN=[['#1f2f45','#f0e6c0'],['#8a2a24','#f2d78a'],['#2d5a3a','#efe6cf'],['#e2d6bf','#2a2622'],['#3a2a20','#e6c98a'],['#24343c','#d8e6e2'],['#6a3a1a','#f0e0b0']];
  const DOOR=['#2a2420','#3a2c22','#4a2a2a','#1f2f45','#2e4a2c','#5a3a1a'];
  const IRON='#26302c',GLASS='#4a6272',GLASS_R='#2e3c46';
  const LX=C.S[0]-C.W[0],nH=Math.max(1,R(LX/21));
  const bx=[C.W[0]];for(let i=1;i<nH;i++)bx.push(R(C.W[0]+LX*i/nH+(rand()-.5)*4));bx.push(C.S[0]);
  const stores=[];
  let lastB=-1;
  for(let i=0;i<nH;i++){
    let bi=(rand()*BRICK.length)|0;if(bi===lastB)bi=(bi+1+((rand()*3)|0))%BRICK.length;lastB=bi;
    const brick=sh(BRICK[bi][0],R((rand()-.5)*10)),stone=BRICK[bi][1];
    const nF=Math.min(nFmax,1+(rand()<.65?1:0));
    const tall=rand()<.25&&(gf+nF*fh+1+cr+4+3<=yN-2);
    stores.push({brick,stone,nF,pp:tall?4:2,awn:rand()<.72?AWN[(rand()*AWN.length)|0]:null,sign:SIGN[(rand()*SIGN.length)|0],door:DOOR[(rand()*DOOR.length)|0],
      doorSide:rand()<.5?0:1,belt:rand()<.45,name:rand()<.55,ghost:rand()<.65,barber:rand()<.12,blade:rand()<.4,sky:rand()<.5,chim:rand()<.7,vent:rand()<.4,
      bulk:rand()<.5?'#3a3a3e':'#5a3a28',signLit:rand()<.5,roof:sh('#4c4845',R((rand()-.5)*8)),decor:rand()<.4,rear:DXall>=30&&rand()<.55});
  }
  for(let i=0;i<nH;i++){
    const S=stores[i],u0=i===0?0:(bx[i]-C.W[0])/LX,u1=i===nH-1?1:(bx[i+1]-C.W[0])/LX;
    const pp=S.pp,H=gf+S.nF*fh+1+cr+pp;
    if(S.rear){rearWing(ctx,T,sub(C,u0,u1,0,.42),gf+Math.max(0,S.nF-1)*fh+1+cr+2,Math.max(0,S.nF-1),S.brick,S.stone,S);}
    const Cs=S.rear?sub(C,u0,u1,.42,1):sub(C,u0,u1,0,1);
    clearMass(Cs,H+3);
    const xs0=R(Cs.W[0]),xsS=R(Cs.S[0]),xsE=R(Cs.E[0]),wI=xsS-xs0+1,DXe=xsE-xsS;
    const brick=S.brick,stone=S.stone,brickR=sh(brick,-46);
    const fF=(x)=>foot(Cs.W,Cs.S,x),fE=(x)=>foot(Cs.S,Cs.E,x);
    // ---- 端牆（背光）先畫；正面之後蓋住轉角欄
    wall(g,Cs.S,Cs.E,H,brickR);
    cols(Cs.S,Cs.E,(x,y)=>{if(x===xsS)return;
      rc(g,x,y-1,1,1,sh(brickR,-16));rc(g,x,y-gf,1,1,sh(stone,-60));
      if(S.belt)for(let f=0;f<S.nF;f++)rc(g,x,y-gf-1-f*fh,1,1,sh(brickR,10));
      rc(g,x,y-H,1,1,sh(stone,-40));rc(g,x,y-H+pp+1,1,1,sh(stone,-52));rc(g,x,y-H+pp+2,1,1,((x-xsS)%3===1)?sh(stone,-74):sh(stone,-56));rc(g,x,y-H+pp+3,1,1,sh(brickR,-14));});
    if(S.ghost&&DXe>=12){const gw=Math.min(DXe-5,18),gh=Math.min(S.nF*fh-2,14);ghostSign(T,g,Cs.S,Cs.E,H,xsS+2,gw,pp+cr+2,gh,GHOST[(rand()*GHOST.length)|0]);}
    if(DXe>=14){const wx=xsE-5,yw=fE(wx+1);for(let f=0;f<S.nF;f++)dh(wx,yw-gf-1-f*fh,3,4,GLASS_R,sh(stone,-56),rand()<.22,'#e8c47a');
      if(rand()<.5){rc(g,wx,yw-7,3,1,sh(stone,-56));rc(g,wx,yw-6,3,5,'#2a2622');rc(g,wx+1,yw-6,1,5,'#1e1c1a');}}          // 後門
    {const xp=xsS+1;rc(g,xp,fE(xp)-H+pp+cr+1,1,H-pp-cr-2,'#3a3d42');}                                                        // 落水管
    // ---- 正面
    for(let x=xs0;x<=xsS;x++){const y=fF(x);
      rc(g,x,y-H,1,H,brick);
      if(S.belt)for(let f=0;f<S.nF;f++)rc(g,x,y-gf-1-f*fh,1,1,sh(stone,-6));
      rc(g,x,y-gf,1,1,stone);                                              // 店面簷
      rc(g,x,y-H,1,1,sh(stone,10));                                        // 壓頂
      rc(g,x,y-H+1,1,pp,S.decor?(((x-xs0)&1)?sh(brick,-22):sh(brick,-2)):sh(brick,-4));   // 女兒牆（部分戶有花磚）
      rc(g,x,y-H+pp+1,1,1,stone);                                          // 簷板
      rc(g,x,y-H+pp+2,1,1,((x-xs0)%3===1)?sh(stone,-44):sh(stone,-6));     // 托架
      rc(g,x,y-H+pp+3,1,1,sh(brick,-36));                                  // 簷下陰影
    }
    const xa=xs0+1,xb=xsS-1;
    const sf=storefront(T,g,Cs,xa,xb,{bulk:S.bulk,sign:S.sign,signH:3,door:S.door,doorSide:S.doorSide,awn:S.awn,signLit:S.signLit,rand,first:i===0});
    // 鑄鐵柱（一樓）＋上層戶界
    {const y0=fF(xs0),y1=fF(xsS);rc(g,xs0,y0-gf,1,gf,IRON);rc(g,xsS,y1-gf,1,gf,IRON);rc(g,xsS,y1-H+pp+cr+1,1,H-pp-cr-1-gf,sh(brick,-18));
      if(S.barber){const BP=['#c8342a','#eeeeee','#2a4a8a','#eeeeee','#c8342a'];for(let k=0;k<5;k++)rc(g,xs0,y0-9+k,1,1,BP[k]);}}
    // 上層雙懸窗（3×5，節距 5）
    {const wi=xb-xa+1,nW=Math.max(1,Math.floor((wi+2)/5)),pad=Math.max(0,(wi-(5*nW-2))>>1);
      for(let j=0;j<nW;j++){const wx=xa+pad+5*j,yx=fF(wx+1);
        for(let f=0;f<S.nF;f++){dh(wx,yx-gf-1-f*fh,3,4,GLASS,stone,rand()<.32,litCol(rand()));if(f>0&&rand()<.08)rc(g,wx,yx-gf-2-f*fh,2,1,'#c3c8cd');}}}
    // 側懸招牌（掛在左柱、凸向左＝外凸方向近似）；第一戶不掛（會出地界）
    if(S.blade&&i>0){const ys=fF(xs0),sc=SIGN[(rand()*SIGN.length)|0];rcN(xs0-2,ys-20,2,1,IRON);rcN(xs0-3,ys-19,3,3,sc[0]);rcN(xs0-2,ys-18,1,1,sc[1]);
      if(rand()<.5)lit(xs0-3,ys-19,3,3,'rgba(255,236,190,.85)');}
    // 名牌方塊（女兒牆中央，凸出壓頂 3 列）
    if(S.name&&wI>=10){const xc=(xs0+xsS)>>1,yc=fF(xc),hw=wI>=14?3:2;if(yc-H-3>=2){rc(g,xc-hw,yc-H-2,2*hw+1,3,stone);rc(g,xc-hw,yc-H-3,2*hw+1,1,sh(stone,12));rc(g,xc-hw+1,yc-H-1,2*hw-1,1,sh(stone,-34));rc(g,xc+hw,yc-H-2,1,3,sh(stone,-22));}}
    // ---- 屋頂：油毛氈、壓頂線、後側女兒牆內面、煙囪（戶界後段）、天窗、通風管
    const Ct=tops(Cs,H);
    poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],S.roof);
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.S[0],Ct.S[1]-1],sh(stone,14));lineP(g,[Ct.S[0],Ct.S[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-30));
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.N[0],Ct.N[1]-1],sh(stone,-12));lineP(g,[Ct.N[0],Ct.N[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-12));
    if(Ct.S[1]-Ct.N[1]>=6){lineP(g,[Ct.W[0]+1,Ct.W[1]],[Ct.N[0]+1,Ct.N[1]],sh(brickR,-6));lineP(g,[Ct.N[0]+1,Ct.N[1]],[Ct.E[0]-1,Ct.E[1]],sh(brick,-8));}
    const rp=(u,vv)=>{const p=A.paraPt559(Ct,u,vv);return [R(p[0]),R(p[1])-1];};
    {const nSeam=Math.floor(DXe/9);for(let k=1;k<nSeam;k++){const t=k/nSeam,a=lerp(Ct.W,Ct.N,t),b=lerp(Ct.S,Ct.E,t);lineP(g,[a[0]+1,a[1]],[b[0]-1,b[1]],sh(S.roof,8));}}   // 油毛氈接縫
    if(S.chim&&DXe>=8){const p=lerp(Ct.S,Ct.E,.68),px=R(p[0]),py=R(p[1])-1;if(py-6>=2){rc(g,px-1,py-4,1,4,sh(brick,2));rc(g,px,py-4,1,4,sh(brick,-40));rc(g,px-1,py-5,2,1,'#3a3a3c');rc(g,px-1,py,3,1,'rgba(20,26,22,.3)');}}
    if(S.sky&&DXe>=10&&wI>=10){const p=rp(.5,.5),px=p[0],py=p[1];if(py-3>=2){rc(g,px-1,py-2,3,2,'#8d959b');rc(g,px-1,py-1,3,1,'#6b8898');rc(g,px+2,py-2,1,2,'#5f666c');rc(g,px-1,py,4,1,'rgba(20,26,22,.28)');if(rand()<.4)lit(px-1,py-1,3,1,'rgba(255,226,160,.6)');}}
    if(S.vent&&DXe>=8){const p=rp(.25,.35),px=p[0],py=p[1];if(py-4>=2){rc(g,px,py-3,1,3,'#8e9499');rc(g,px-1,py-4,3,1,'#b9bec3');}}
    S.xs0=xs0;S.xsS=xsS;S.u0=u0;S.u1=u1;S.door=sf;
  }
  // ---- 接地暗線
  cols(C.W,C.S,(x,y)=>rc(g,x,y,1,1,'rgba(16,22,18,.42)'));cols(C.S,C.E,(x,y)=>rc(g,x,y,1,1,'rgba(16,22,18,.42)'));
  return stores;
}

// ---------------------------------------------------------------- lv2：芝加哥式商業樓
function chicago(ctx,T,C){
  const {A,g,ng,rand,bw,bh}=ctx,{sh,rc,rcN,lit,poly,lineP,foot,cols,wall,sub,lerp,tops,clearMass,dh,litCol}=T;
  const gf=13,fh=8,cr=4;
  const yN=R(C.N[1]);
  const nFmax=Math.max(2,Math.floor((yN-2-gf-1-cr-2)/fh));
  const BRICK=[['#8e4a3a','#dccbb0',0],['#a7583f','#e4d4b8',0],['#c4a06e','#f0e6d0',1],['#d9ccae','#f6efe0',1],['#6e4a44','#d4c3a8',2],['#9a8a76','#e6dfd0',2],['#7d4335','#d9c8ad',0],['#b07a5a','#ecdcc0',1]];   // [磚,石,色系]
  const AWN=[['#3a7a52','#e9e3d3'],['#a83a34','#ece5d5'],['#2d4f7a','#e9e3d3'],['#2f5a3a',null],['#6e2a2a',null],['#4a4a50',null]];
  const SIGN=[['#1f2f45','#f0e6c0'],['#8a2a24','#f2d78a'],['#2d5a3a','#efe6cf'],['#e2d6bf','#2a2622'],['#24343c','#d8e6e2'],['#3a2a20','#e6c98a']];
  const DOOR=['#2a2420','#3a2c22','#4a2a2a','#1f2f45'];
  const GLASS='#48607a',GLASS_R='#2c3a4a',IRON='#3a3d44';
  const LX=C.S[0]-C.W[0],nS=Math.max(1,R(LX/38));
  const bx=[C.W[0]];for(let i=1;i<nS;i++)bx.push(R(C.W[0]+LX*i/nS+(rand()-.5)*6));bx.push(C.S[0]);
  const DXall=R(C.E[0])-R(C.S[0]);
  const secs=[];let lastFam=-1;
  for(let s=0;s<nS;s++){
    let bi=(rand()*BRICK.length)|0;
    if(BRICK[bi][2]===lastFam){for(let t=0;t<4&&BRICK[bi][2]===lastFam;t++)bi=(rand()*BRICK.length)|0;}   // 相鄰段換色系（紅／黃褐／灰暗）
    lastFam=BRICK[bi][2];
    const brick=sh(BRICK[bi][0],R((rand()-.5)*8)),stone=BRICK[bi][1];
    const nF=Math.min(nFmax,4+(((bw>=2||bh>=2)&&rand()<.5)?1:0));
    const tall=rand()<.3&&(gf+nF*fh+1+cr+4+3<=yN-2);
    const r=rand(),wt=r<.42?'chicago':r<.75?'paired':'arch';
    secs.push({brick,stone,nF,pp:tall?4:2,wt,belt:wt==='chicago'||rand()<.5,name:rand()<.6,ghost:rand()<.7,esc:rand()<.55,tank:rand()<.4,board:rand()<.35,bulk:rand()<.5,
      sky:rand()<.6,chim:rand()<.6,roof:sh('#4a4643',R((rand()-.5)*8)),bulkC:rand()<.5?'#3a3a3e':'#2c3a3a',entrance:rand()<.5?0:1,quoin:rand()<.6,piers:rand()<.75,rear:DXall>=36&&rand()<.5});
  }
  for(let s=0;s<nS;s++){
    const S=secs[s],u0=s===0?0:(bx[s]-C.W[0])/LX,u1=s===nS-1?1:(bx[s+1]-C.W[0])/LX;
    const pp=S.pp,H=gf+S.nF*fh+1+cr+pp;
    if(S.rear){rearWing(ctx,T,sub(C,u0,u1,0,.4),gf+(S.nF-1)*fh+1+cr+2,S.nF-1,S.brick,S.stone,S);}
    const Cs=S.rear?sub(C,u0,u1,.4,1):sub(C,u0,u1,0,1);
    clearMass(Cs,H+3);
    const xs0=R(Cs.W[0]),xsS=R(Cs.S[0]),xsE=R(Cs.E[0]),wI=xsS-xs0+1,DXe=xsE-xsS;
    const brick=S.brick,stone=S.stone,brickR=sh(brick,-46),stoneR=sh(stone,-56);
    const fF=(x)=>foot(Cs.W,Cs.S,x),fE=(x)=>foot(Cs.S,Cs.E,x);
    // ---- 端牆（背光）：窗列、逃生梯、ghost sign、落水管
    wall(g,Cs.S,Cs.E,H,brickR);
    cols(Cs.S,Cs.E,(x,y)=>{if(x===xsS)return;
      rc(g,x,y-1,1,1,sh(brickR,-16));rc(g,x,y-gf,1,1,stoneR);
      if(S.belt)for(let f=0;f<S.nF;f++)rc(g,x,y-gf-1-f*fh,1,1,sh(brickR,10));
      rc(g,x,y-H,1,1,sh(stone,-40));rc(g,x,y-H+pp+1,1,1,sh(stone,-46));rc(g,x,y-H+pp+2,1,1,sh(stone,-54));rc(g,x,y-H+pp+3,1,1,((x-xsS)%3===1)?sh(stone,-76):sh(stone,-58));rc(g,x,y-H+pp+4,1,1,sh(brickR,-14));});
    const wxs=[];if(DXe>=24){wxs.push(xsS+R(DXe*.62));wxs.push(xsS+R(DXe*.86));}else if(DXe>=12)wxs.push(xsS+R(DXe*.68));
    for(const wx of wxs){const yw=fE(wx+1);for(let f=0;f<S.nF;f++)dh(wx,yw-gf-1-f*fh,3,5,GLASS_R,stoneR,rand()<.24,'#e8c47a');
      dh(wx,yw-2,3,5,sh(GLASS_R,-6),stoneR,rand()<.3,'#e8c47a');}
    if(S.ghost&&DXe>=14){const gw=Math.min(Math.max(8,(wxs.length?wxs[0]-xsS-4:DXe-5)),20),gh=Math.min(2*fh-2,14);ghostSign(T,g,Cs.S,Cs.E,H,xsS+2,gw,pp+cr+3,gh,GHOST[(rand()*GHOST.length)|0]);}
    if(S.esc&&wxs.length){const ex=wxs[0]-1,ew=5,yw=fE(ex+2);
      for(let f=0;f<S.nF;f++){const sb=yw-gf-1-f*fh;rc(g,ex,sb+1,ew,1,IRON);for(let k=0;k<ew;k+=2)rc(g,ex+k,sb-1,1,2,IRON);
        if(f<S.nF-1){if(f%2===0)lineP(g,[ex+ew-1,sb],[ex,sb-fh+2],sh(IRON,10));else lineP(g,[ex,sb],[ex+ew-1,sb-fh+2],sh(IRON,10));}}
      rc(g,ex+ew-1,yw-gf-1,1,gf-4,IRON);}
    {const xp=xsS+1;rc(g,xp,fE(xp)-H+pp+cr+1,1,H-pp-cr-2,'#3a3d42');}
    // ---- 正面：磚、樓板帶、店面簷、簷口（4 列）、女兒牆、壓頂
    for(let x=xs0;x<=xsS;x++){const y=fF(x);
      rc(g,x,y-H,1,H,brick);
      if(S.belt)for(let f=0;f<S.nF;f++)rc(g,x,y-gf-1-f*fh,1,1,sh(stone,-8));
      rc(g,x,y-gf,1,1,stone);
      rc(g,x,y-H,1,1,sh(stone,12));
      rc(g,x,y-H+1,1,pp,pp>=4?(((x-xs0)&1)?sh(brick,-20):sh(brick,-2)):sh(brick,-4));
      rc(g,x,y-H+pp+1,1,1,sh(stone,16));rc(g,x,y-H+pp+2,1,1,stone);
      rc(g,x,y-H+pp+3,1,1,((x-xs0)%3===1)?sh(stone,-46):sh(stone,-4));
      rc(g,x,y-H+pp+4,1,1,sh(brick,-38));}
    // 開間：芝加哥窗 9 寬（2｜3｜2，節距 11）；成對／拱窗 7 寬（3｜3，節距 9）
    const bp=S.wt==='chicago'?11:9,bwid=bp-2,xa=xs0+1,xb=xsS-1,wi=xb-xa+1;
    const nB=Math.max(1,Math.floor((wi+2)/bp)),pad=Math.max(0,(wi-(nB*bp-2))>>1);
    const bayX=[];for(let j=0;j<nB;j++)bayX.push(xa+pad+j*bp);
    if(S.piers){for(let j=0;j<=nB;j++){const px=j<nB?bayX[j]-1:bayX[nB-1]+bwid;if(px<xa||px>xb)continue;const y=fF(px);rc(g,px,y-H+pp+cr+1,1,H-pp-cr-1-gf,sh(brick,-14));}}
    for(let j=0;j<nB;j++){const x0=bayX[j],yx=fF(x0+(bwid>>1));
      for(let f=0;f<S.nF;f++){const sb=yx-gf-1-f*fh,top=(S.wt==='arch'&&f===S.nF-1);
        if(S.wt==='chicago'){
          rc(g,x0,sb-5,9,1,stone);rc(g,x0,sb-4,9,4,GLASS);rc(g,x0,sb-4,8,1,sh(GLASS,14));rc(g,x0+2,sb-4,1,4,sh(stone,-24));rc(g,x0+6,sb-4,1,4,sh(stone,-24));
          rc(g,x0,sb-2,2,1,sh(GLASS,26));rc(g,x0+7,sb-2,2,1,sh(GLASS,26));rc(g,x0,sb,9,1,sh(stone,-8));rc(g,x0,sb-7,9,1,sh(brick,-8));
          const lc=litCol(rand(),true);if(rand()<.4)lit(x0+3,sb-4,3,4,lc);if(rand()<.3)lit(x0,sb-4,2,4,lc);if(rand()<.3)lit(x0+7,sb-4,2,4,lc);
        }else{
          for(const ox of [0,4]){const x=x0+ox;dh(x,sb,3,5,GLASS,stone,rand()<.38,litCol(rand(),true));
            if(top){rc(g,x,sb-6,3,1,GLASS);rc(g,x,sb-6,1,1,stone);rc(g,x+2,sb-6,1,1,stone);rc(g,x,sb-7,3,1,stone);}}
          rc(g,x0+3,sb-5,1,5,sh(stone,-24));
          if(S.wt==='arch'&&!top&&f>0)rc(g,x0,sb-7,7,1,sh(brick,-10));
        }}}
    // 一樓：店面分段（≈17px 一間）＋主入口（石框、門上橫窗、門牌）
    const nSF=Math.max(1,R(wi/17)),ex=S.entrance&&nSF>=2?(nSF>>1):-1;
    const sfb=[];for(let k=0;k<=nSF;k++)sfb.push(xa+R(wi*k/nSF));
    let entrance=null;
    for(let k=0;k<nSF;k++){let a=sfb[k],b=sfb[k+1]-1;
      if(k===ex){const dx=a+((b-a-2)>>1);entrance={dx};a=dx+4;}
      if(k===ex-1&&entrance===null){}
      if(b-a+1<8)continue;
      const y0=fF(a),y1=fF(b);rc(g,a,y0-gf,1,gf,sh(stone,-20));rc(g,b,y1-gf,1,gf,sh(stone,-20));
      storefront(T,g,Cs,a+1,b-1,{bulk:S.bulkC,sign:SIGN[(rand()*SIGN.length)|0],signH:2,door:DOOR[(rand()*DOOR.length)|0],doorSide:rand()<.5?0:1,
        awn:rand()<.5?AWN[(rand()*AWN.length)|0]:null,signLit:rand()<.45,rand,first:s===0&&k===0});}
    if(entrance){const dx=entrance.dx,dy=fF(dx+1);
      rc(g,dx-1,dy-12,5,12,stone);rc(g,dx-1,dy-12,5,1,sh(stone,14));
      rc(g,dx,dy-10,3,2,'#9fb2c2');rc(g,dx,dy-8,3,8,'#2a2420');rc(g,dx+1,dy-8,1,7,'#1c1a18');rc(g,dx,dy-6,3,1,'#3a3430');rc(g,dx+2,dy-4,1,1,'#d8b860');
      rc(g,dx,dy-11,3,1,sh(stone,-40));rc(g,dx+1,dy-11,1,1,'#2a2622');rc(g,dx-1,dy-1,5,1,'#9a9488');
      lit(dx,dy-10,3,2,'#ffe4a8');}
    // 轉角隅石（整列兩端）
    if(S.quoin){for(const [x,isR] of [[xs0,s===0],[xsS,s===nS-1]]){if(!isR)continue;const y=fF(x);for(let yy=y-H+pp+cr+1;yy<y-gf;yy++)rc(g,x,yy,1,1,((yy>>1)&1)?sh(stone,-8):sh(brick,-14));}}
    // 名牌
    if(S.name&&wI>=14){const xc=(xs0+xsS)>>1,yc=fF(xc);if(yc-H-3>=2){rc(g,xc-3,yc-H-2,7,3,stone);rc(g,xc-3,yc-H-3,7,1,sh(stone,12));rc(g,xc-2,yc-H-1,5,1,sh(stone,-34));rc(g,xc+3,yc-H-2,1,3,sh(stone,-22));}}
    // ---- 屋頂
    const Ct=tops(Cs,H);
    poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],S.roof);
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.S[0],Ct.S[1]-1],sh(stone,14));lineP(g,[Ct.S[0],Ct.S[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-30));
    lineP(g,[Ct.W[0],Ct.W[1]-1],[Ct.N[0],Ct.N[1]-1],sh(stone,-12));lineP(g,[Ct.N[0],Ct.N[1]-1],[Ct.E[0],Ct.E[1]-1],sh(stone,-12));
    if(Ct.S[1]-Ct.N[1]>=6){lineP(g,[Ct.W[0]+1,Ct.W[1]],[Ct.N[0]+1,Ct.N[1]],sh(brickR,-6));lineP(g,[Ct.N[0]+1,Ct.N[1]],[Ct.E[0]-1,Ct.E[1]],sh(brick,-8));
      lineP(g,[Ct.W[0]+2,Ct.W[1]+1],[Ct.N[0]+2,Ct.N[1]+1],sh(brickR,-2));lineP(g,[Ct.N[0]+2,Ct.N[1]+1],[Ct.E[0]-2,Ct.E[1]+1],sh(brick,-4));}
    const rp=(u,vv)=>{const p=A.paraPt559(Ct,u,vv);return [R(p[0]),R(p[1])-1];};
    const RW=Ct.S[0]-Ct.W[0],RD=Ct.E[0]-Ct.S[0];
    {const nSeam=Math.floor(RD/9);for(let i=1;i<nSeam;i++){const t=i/nSeam,a=lerp(Ct.W,Ct.N,t),b=lerp(Ct.S,Ct.E,t);lineP(g,[a[0]+1,a[1]],[b[0]-1,b[1]],sh(S.roof,8));}}
    // 木水塔：四腳鋼架＋平台、木桶（左亮右暗、兩道鐵箍）、錐頂
    if(S.tank&&RW>=16&&RD>=12){const p=rp(.3+rand()*.2,.3+rand()*.2),px=p[0],py=p[1];if(py-17>=2){
      rc(g,px-4,py+1,9,1,'rgba(20,26,22,.30)');rc(g,px-3,py-5,1,5,'#3b3733');rc(g,px+3,py-5,1,5,'#3b3733');rc(g,px,py-4,1,4,'#2f2b28');
      lineP(g,[px-3,py-5],[px+3,py-1],'#35312d');lineP(g,[px+3,py-5],[px-3,py-1],'#35312d');rc(g,px-3,py-6,7,1,'#2f2b28');
      rc(g,px-3,py-13,3,7,'#a8825a');rc(g,px,py-13,2,7,'#805f3e');rc(g,px+2,py-13,2,7,'#5a4030');rc(g,px-3,py-11,7,1,'#3a2e24');rc(g,px-3,py-8,7,1,'#3a2e24');
      rc(g,px-3,py-14,7,1,'#6d6863');rc(g,px-2,py-15,5,1,'#5c5854');rc(g,px-1,py-16,3,1,'#4e4a47');rc(g,px,py-17,1,1,'#2a2826');rc(g,px-3,py-14,3,1,'#7e7973');rc(g,px-2,py-15,2,1,'#6a6661');}}
    // 屋頂看板：兩根柱＋沿正面方向傾斜的面板（底色＋兩行字＋色塊），頂上兩顆小燈（夜亮）
    if(S.board&&RW>=18&&RD>=8){const p=rp(.62,.82),px=p[0],py=p[1];const BB=[['#e8dcc0','#b83a2a','#2a4a8a'],['#2a4a8a','#f0e6c0','#c9a63f'],['#8a2a24','#f2d78a','#e8dcc0'],['#2d5a3a','#efe6cf','#c94a3a']];const bc=BB[(rand()*BB.length)|0];
      const y0=py-10;if(y0-3>=2){
        rc(g,px-4,py-4,1,4,'#3b3733');rc(g,px+3,py-2,1,2,'#3b3733');rc(g,px-5,py+1,11,1,'rgba(20,26,22,.28)');
        for(let x=px-5;x<=px+5;x++){const yy=y0+((x-px+5)>>1);rc(g,x,yy,1,6,bc[0]);rc(g,x,yy,1,1,sh(bc[0],-30));rc(g,x,yy+5,1,1,sh(bc[0],-30));
          const k=x-px+5;if(k>=1&&k<10&&(k%3)!==0)rc(g,x,yy+2,1,1,bc[1]);if(k>=2&&k<9&&(k%3)!==1)rc(g,x,yy+4,1,1,bc[1]);if(k>=7&&k<=9)rc(g,x,yy+1,1,1,bc[2]);}
        rc(g,px-5,y0,1,6,sh(bc[0],-30));rc(g,px+5,y0+5,1,6,sh(bc[0],-30));
        rc(g,px-3,y0-1+1,1,1,'#e9dca8');rc(g,px+2,y0-1+3,1,1,'#e9dca8');lit(px-3,y0,1,1,'#fff3cc');lit(px+2,y0+2,1,1,'#fff3cc');lit(px-5,y0+1,11,7,'rgba(255,236,190,.16)');}}
    // 樓梯間（磚盒＋門）、天窗、通風管、煙囪
    if(S.bulk&&RW>=12&&RD>=10){const p=rp(.15+rand()*.1,.55+rand()*.15),px=p[0],py=p[1];if(py-6>=2){rc(g,px-3,py-4,6,4,sh(brick,-10));rc(g,px-3,py-5,6,1,sh(brick,10));rc(g,px+2,py-4,1,4,sh(brick,-40));rc(g,px-2,py-3,1,2,'#2a2420');rc(g,px-3,py,7,1,'rgba(20,26,22,.3)');}}
    if(S.sky&&RW>=14&&RD>=10){for(const u of [.55,.78]){const p=rp(u,.52),px=p[0],py=p[1];if(py-3>=2){rc(g,px-1,py-2,3,2,'#8d959b');rc(g,px-1,py-1,3,1,'#6b8898');rc(g,px+2,py-2,1,2,'#5f666c');rc(g,px-1,py,4,1,'rgba(20,26,22,.28)');if(rand()<.35)lit(px-1,py-1,3,1,'rgba(255,226,160,.55)');}}}
    if(S.chim&&RD>=10){const p=rp(.9,.22),px=p[0],py=p[1];if(py-8>=2){rc(g,px-1,py-7,1,7,sh(brick,-4));rc(g,px,py-7,1,7,sh(brick,-40));rc(g,px-1,py-8,2,1,'#3a3a3c');}}
    for(let i=0;i<2;i++){if(rand()<.5)continue;const p=rp(.2+rand()*.6,.2+rand()*.3),px=p[0],py=p[1];if(py-4>=2){rc(g,px,py-3,1,3,'#8e9499');rc(g,px-1,py-4,3,1,'#b9bec3');}}
    S.xs0=xs0;S.xsS=xsS;S.u0=u0;S.u1=u1;
  }
  cols(C.W,C.S,(x,y)=>rc(g,x,y,1,1,'rgba(16,22,18,.42)'));cols(C.S,C.E,(x,y)=>rc(g,x,y,1,1,'rgba(16,22,18,.42)'));
  return secs;
}

// ---------------------------------------------------------------- 登記
REG.usMainStreet={name:'usMainStreet',draw(ctx){
  const T=tools(ctx),{A,g,G0,rand,lv,bw,bh,ar}=ctx,{rc,poly,foot,lampOld,oldCar,hydrant,mailbox,bench}=T;
  const box=(ar&&ar.box)||[0,1,0,1],hi=lv>=2;
  const P0=(u,vv)=>A.paraPt559(G0,u,vv);
  const para0=(u0,u1,v0,v1)=>({N:P0(u0,v0),E:P0(u1,v0),S:P0(u1,v1),W:P0(u0,v1)});
  // shophouse 原型貼到 v=1：退 3.5px 留人行道＋路緣停車帶；office 原型本身留 [.80,1]
  const vFront=hi?box[3]:Math.min(box[3],1-3.5/(16*bh));
  scrub(ctx,T);
  poly(g,[G0.N,G0.E,G0.S,G0.W],'#87888c');
  const vK=sidewalk(ctx,T,vFront,hi?2:1.5);
  const C=para0(box[0],box[1],box[2],vFront);
  const units=hi?chicago(ctx,T,C):mainStreet(ctx,T,C,vFront);
  // ---- 人行道小件：路燈在戶界（隔一戶）、消防栓在左端、郵筒／長椅偶有；老車停在路緣（1920s，顏色深）
  const LX=G0.S[0]-G0.W[0],vL=Math.max(vFront+.2/(16*bh),vK-.5/(16*bh));
  const lamps=[];
  for(let i=1;i<units.length;i+=2)lamps.push(units[i].u0);
  if(!lamps.length||units.length<=2)lamps.push(Math.min(.94,1-5/LX));
  if(bw>=3&&lamps[0]>.3)lamps.unshift(Math.max(.06,6/LX));
  for(const u of lamps){const p=P0(u,vL);lampOld(R(p[0]),R(p[1]));}
  {const p=P0(Math.max(.05,3/LX),vL);hydrant(R(p[0]),R(p[1]));}
  if(bw>=2&&rand()<.6){const p=P0(Math.min(.9,lamps[0]+7/LX),vL);mailbox(R(p[0]),R(p[1]));}
  if(rand()<.5){const u=.25+rand()*.5,p=P0(u,vL);bench(R(p[0]),R(p[1]));}
  const CARS=['#23252b','#2f4a36','#5b2a2c','#3a3f58','#8a7a5a','#6a6a6e','#4a3a2a'];
  const nSlot=Math.max(1,Math.floor(LX/34)),vC=1-1.1/(16*bh);
  for(let s=0;s<nSlot;s++){if(rand()<(nSlot===1?.55:.42))continue;let u=(s+.5)/nSlot+(rand()-.5)*(.5/nSlot);u=Math.min(1-7/LX,Math.max(7/LX,u));
    const p=P0(u,vC);oldCar(R(p[0]),R(p[1]),CARS[(rand()*CARS.length)|0]);}
  return {pitch:false};
}};
})();
