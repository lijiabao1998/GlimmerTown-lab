// T577 facade_uk2：英式街景立面繪製器（住宅 lv2）
//   ukVictorian —— 倫敦白灰泥聯排（Belgravia／Bloomsbury）：原型 terrace（G=[.08,.92]×[0,1]，牆高 1.38×）
//   ukMansion   —— 愛德華紅磚公寓大樓（Kensington mansion block）：原型 courtyard（G=[0,1]×[0,.52]＋前左側翼）
// 規約：整數像素；牆上的每一件東西（窗、帶、欄杆、門廊）都逐列貼著牆腳斜率畫；光從左（W→S 面亮、E→S 面暗）；
//       只用 ctx.rand；夜光只畫白天畫出來的窗／門燈；所有東西落在 G0 之內、牆腳貼在 G 邊上。
(function(){
'use strict';
const REG=window.__facade577=window.__facade577||{};
const R=Math.round;
function sh(hex,amt){const n=parseInt(hex.slice(1),16),c=x=>x<0?0:x>255?255:x;const r=c((n>>16)+amt),g=c(((n>>8)&255)+amt),b=c((n&255)+amt);return '#'+((r<<16|g<<8|b).toString(16).padStart(6,'0'));}
function P(C,u,v){return [C.N[0]+u*(C.E[0]-C.N[0])+v*(C.W[0]-C.N[0]),C.N[1]+u*(C.E[1]-C.N[1])+v*(C.W[1]-C.N[1])];}
function lift(C,h){return {N:[C.N[0],C.N[1]-h],E:[C.E[0],C.E[1]-h],S:[C.S[0],C.S[1]-h],W:[C.W[0],C.W[1]-h]};}
function sub(C,u0,u1,v0,v1){return {N:P(C,u0,v0),E:P(C,u1,v0),S:P(C,u1,v1),W:P(C,u0,v1)};}
// 牆面：a→b 是牆腳線（實數座標）；每個整數 x 列有自己的牆腳 y；z 從牆腳往上數（z=0 是牆腳上方第一列）
function mkFace(a,b,H){const dx=b[0]-a[0],dy=b[1]-a[1],k=dx?dy/dx:0;const xa=R(a[0]),xb=R(b[0]);
  const x0=Math.min(xa,xb),x1=Math.max(xa,xb);return {x0,x1,H,len:x1-x0+1,fy:x=>R(a[1]+(x-a[0])*k),a,b};}
// 牆面 F 上，列 xs..xe、高度 z0..z1（不含 z1）填色 —— 一切牆上元素的基本筆
function band(g,F,xs,xe,z0,z1,col){xs=Math.max(xs,F.x0);xe=Math.min(xe,F.x1);if(xe<xs||z1<=z0)return;g.fillStyle=col;for(let x=xs;x<=xe;x++)g.fillRect(x,F.fy(x)-z1,1,z1-z0);}
// 硬邊平行四邊形（四邊斜率 ±1/2）；不含最下一列（留給牆頂／簷口），edgeCol 畫最下一列上方那一列（女兒牆內側陰影）
function dia(g,C,col,edgeCol){const xa=Math.ceil(Math.min(C.W[0],C.N[0])),xb=Math.floor(Math.max(C.E[0],C.S[0]));
  for(let x=xa;x<=xb;x++){const top=C.N[1]+Math.abs(x-C.N[0])/2,bot=C.S[1]-Math.abs(x-C.S[0])/2;const y0=R(top),y1=R(bot)-1;
    if(y1<y0)continue;g.fillStyle=col;g.fillRect(x,y0,1,y1-y0+1);if(edgeCol){g.fillStyle=edgeCol;g.fillRect(x,y1,1,1);}}}
// 硬邊線段（斜率 ±1/2 的屋脊／天溝線）
function seg(g,a,b,col){const xa=R(a[0]),xb=R(b[0]),k=(b[1]-a[1])/(b[0]-a[0]||1);g.fillStyle=col;for(let x=Math.min(xa,xb);x<=Math.max(xa,xb);x++)g.fillRect(x,R(a[1]+(x-a[0])*k),1,1);}
// 直立推拉窗單元（4 列寬：側框｜玻璃 2｜側框），zb=窗台列高度，wh=玻璃高；ngZ0 = 夜光從哪個高度起（陽台欄杆遮住的下半不亮）
function sashWin(g,ng,F,x,zb,wh,C,lit,ngZ0){
  band(g,F,x,x+3,zb,zb+1,C.trim);
  band(g,F,x,x,zb+1,zb+1+wh,C.revL);band(g,F,x+3,x+3,zb+1,zb+1+wh,C.revR);
  band(g,F,x+1,x+2,zb+1,zb+1+wh,C.glass);
  band(g,F,x+1,x+2,zb+wh,zb+1+wh,C.sky);
  if(wh>=5)band(g,F,x+1,x+2,zb+1+(wh>>1),zb+2+(wh>>1),C.bar);
  band(g,F,x,x+3,zb+1+wh,zb+2+wh,C.trim);
  if(lit&&ng)band(ng,F,x+1,x+2,Math.max(zb+1,ngZ0==null?zb+1:ngZ0),zb+1+wh,C.lit);
}
// 煙囪：立在 (x,y) 這一列上（y 為屋面列），3 寬 5 高＋帽＋兩支煙囪管
function chimney(g,x,y,col,colD,cap,pot){
  g.fillStyle=col;g.fillRect(x,y-5,2,5);g.fillStyle=colD;g.fillRect(x+2,y-5,1,5);
  g.fillStyle=cap;g.fillRect(x-1,y-6,5,1);
  g.fillStyle=pot;g.fillRect(x,y-8,1,2);g.fillRect(x+2,y-8,1,2);
  g.fillStyle='rgba(20,24,28,.30)';g.fillRect(x+3,y-3,2,3);
}

/* ============================ ukVictorian ============================ */
REG.ukVictorian={name:'ukVictorian',draw(ctx){
  const {g,ng,G,G0,bw,bh,v,rand}=ctx,H=ctx.wallH;
  // 採光井：建築腳印 B = G 沿 -v 內縮 d（畫面上每列高 2d 的一條帶），帶內畫地下室採光井＋黑鐵欄杆
  const d=3;
  const B={N:G.N,E:G.E,W:[G.W[0]+2*d,G.W[1]-d],S:[G.S[0]+2*d,G.S[1]-d]};
  const brickUp=(((v/3)|0)%2)===1;        // 同一個原型下的第二個變體：上層倫敦黃磚
  const base={
    stucco:'#e6e0d1',groove:'#cec7b5',upper:brickUp?'#c9b28c':'#efe9db',course:brickUp?'#b39c77':'#dcd6c7',
    revL:'#d9d2c1',revR:'#b7b09e',glass:'#33414f',sky:'#6f8496',bar:'#8a9aa8',trim:'#f8f4ea',frieze:'#d3ccbb',col:'#fbf8f0',
    iron:'#26262a',slab:'#bdb6a5',corS:'#b3ac9c',corL:'#f8f4ea',parapet:'#e9e3d5',
    lit:'#fffbe5',fan:'#9fbfd4',fanLit:'#ffd27a',knock:'#d8c070',pipe:'#7a7e82'};
  const pal=dk=>{if(!dk)return base;const o={};for(const k in base)o[k]=sh(base[k],-40);
    o.glass='#222c38';o.sky='#4d5f6e';o.bar='#5f6d7a';o.iron='#1c1c20';o.lit='#f4ecc8';o.fan='#6e8a9c';o.fanLit=base.fanLit;return o;};
  const CL=pal(false),CR=pal(true);
  const DOORS=['#161618','#1d3a2b','#20304f','#5a1c1c','#2b2b30','#3a2d5a'];
  const PIT='#2b2927',PITW='#3d4a59',RAIL='#161618',STEP='#d2ccbe';
  const RF='#5d636c',RB='#41464e',RIDGE='#767c84',VALLEY='#30343a',ROOFE='#383c43';
  // 樓層節奏：地面層最高（灰泥溝縫）、一樓次之（陽台＋高窗）、往上遞減；頂上簷口＋女兒牆 3–4 列
  const nF=H>=50?5:H>=38?4:3;
  const fh=[11,10,8,7,7].slice(0,nF);
  const sum=()=>fh.reduce((a,b)=>a+b,0);
  while(sum()+3>H){fh[fh.indexOf(Math.max(...fh))]--;}
  let extra=H-3-sum(),ii=0;while(extra>=2){fh[ii%nF]++;extra--;ii++;}
  const zf=[0];for(let j=1;j<nF;j++)zf[j]=zf[j-1]+fh[j-1];
  const zTop=zf[nF-1]+fh[nF-1],par=H-zTop;
  const FL=mkFace(B.W,B.S,H);
  const FR=mkFace(B.S,B.E,H);FR.x0++;FR.len--;
  // ---- 屋頂：女兒牆後的淺石板屋頂（深的街區是 M 形雙脊＋中央天溝，淺的單脊）；先畫，讓牆頂壓在它前緣上 ----
  const RP=lift(B,H);
  const ridges=bh>=2?[.26,.74]:[.46];
  if(bh>=2){dia(g,sub(RP,0,1,0,.26),RB);dia(g,sub(RP,0,1,.26,.5),RF);dia(g,sub(RP,0,1,.5,.74),RB);dia(g,sub(RP,0,1,.74,1),RF,ROOFE);
    seg(g,P(RP,0,.5),P(RP,1,.5),VALLEY);}
  else{dia(g,sub(RP,0,1,0,.46),RB);dia(g,sub(RP,0,1,.46,1),RF,ROOFE);}
  for(const r of ridges)seg(g,P(RP,0,r),P(RP,1,r),RIDGE);
  // ---- 牆體 ----
  const wall=(F,C)=>{
    band(g,F,F.x0,F.x1,0,fh[0],C.stucco);
    for(let z=3;z<fh[0]-1;z+=3)band(g,F,F.x0,F.x1,z,z+1,C.groove);
    band(g,F,F.x0,F.x1,fh[0],zTop,C.upper);
    if(brickUp)for(let z=fh[0]+2;z<zTop-1;z+=3)band(g,F,F.x0,F.x1,z,z+1,sh(C.upper,-9));
    for(let j=1;j<nF;j++)band(g,F,F.x0,F.x1,zf[j],zf[j]+1,C.course);
    band(g,F,F.x0,F.x1,zTop,zTop+1,C.corS);
    band(g,F,F.x0,F.x1,zTop+1,zTop+2,C.corL);
    if(par>3)band(g,F,F.x0,F.x1,zTop+2,H-1,C.parapet);
    band(g,F,F.x0,F.x1,H-1,H,C.corL);
  };
  wall(FL,CL);wall(FR,CR);
  // ---- 採光井帶：G 前緣與 B 前緣之間（兩端斜切），黑鐵欄杆立在 G 邊上 ----
  const fG=x=>G.W[1]+(x-G.W[0])/2;
  const pitTop=x=>Math.max(fG(x)-2*d,G.W[1]-(x-G.W[0])/2),pitBot=x=>Math.min(fG(x),G.S[1]-(x-G.S[0])/2);
  const xa=R(G.W[0]),xb=R(B.S[0]);
  for(let x=xa;x<=xb;x++){const y0=R(pitTop(x)),y1=R(pitBot(x))-1;if(y1<y0)continue;
    g.fillStyle=PIT;g.fillRect(x,y0,1,y1-y0+1);}
  const railAt=(x)=>{const y0=R(pitTop(x)),y1=R(pitBot(x))-1;if(y1<y0)return;
    const rt=Math.max(y0,y1-2);g.fillStyle=RAIL;g.fillRect(x,rt,1,1);if((x-xa)%3===0)g.fillRect(x,rt,1,y1-rt+1);};
  // ---- 沿街分戶：每戶約 30 列，3 開間（門＋兩窗）或 2 開間 ----
  const len=FL.len,nH=Math.max(1,Math.round(len/30));
  const hx=[];for(let h=0;h<=nH;h++)hx.push(FL.x0+Math.round(len*h/nH));
  const doorCols=[];
  const portico=(F,c,door,C)=>{
    band(g,F,c-2,c+2,0,1,STEP);
    band(g,F,c-1,c+1,1,7,door);band(g,F,c,c,3,4,C.knock);
    band(g,F,c-1,c+1,7,8,C.fan);
    band(g,F,c-2,c-2,1,8,C.col);band(g,F,c+2,c+2,1,8,C.col);band(g,F,c+3,c+3,1,8,C.revR);
    band(g,F,c-3,c+3,8,9,C.frieze);band(g,F,c-3,c+3,9,10,C.col);
    if(ng)band(ng,F,c-1,c+1,7,8,C.fanLit);
  };
  for(let h=0;h<nH;h++){
    const x0=hx[h],x1=hx[h+1]-1,w=x1-x0+1;
    const bays=w>=22?[.2,.5,.8]:[.3,.7];
    const cx=bays.map(t=>x0+R(w*t));
    const doorBay=rand()<.5?0:bays.length-1;
    const door=DOORS[(rand()*DOORS.length)|0];
    cx.forEach((c,b)=>{if(b===doorBay){portico(FL,c,door,CL);doorCols.push(c);}
      else sashWin(g,ng,FL,c-2,2,Math.min(5,fh[0]-5),CL,rand()<.42);});
    for(let j=1;j<nF;j++){
      const wh=Math.min(j===1?6:j===2?5:4,fh[j]-3),zb=j===1?zf[1]:zf[j]+1;
      cx.forEach(c=>sashWin(g,ng,FL,c-2,zb,wh,CL,rand()<.42,j===1?zf[1]+4:null));
    }
  }
  // 一樓連續鑄鐵陽台（整排連通）
  if(nF>=2){band(g,FL,FL.x0,FL.x1,zf[1],zf[1]+1,CL.slab);
    for(let x=FL.x0;x<=FL.x1;x+=3)band(g,FL,x,x,zf[1]+1,zf[1]+4,CL.iron);
    band(g,FL,FL.x0,FL.x1,zf[1]+3,zf[1]+4,CL.iron);}
  // 每隔一道分戶牆一支落水管（從一樓陽台上方到簷口）
  for(let h=1;h<nH;h++)if(h%2===1)band(g,FL,hx[h],hx[h],zf[1]+4,zTop,CL.pipe);
  // 採光井欄杆＋地下室窗＋門前台階（台階跨過採光井、打斷欄杆）
  for(let x=xa;x<=xb;x++)railAt(x);
  for(let h=0;h<nH;h++){const x0=hx[h],w=hx[h+1]-x0,c=x0+R(w*.5);
    if(doorCols.indexOf(c)>=0)continue;const y0=R(pitTop(c)),y1=R(pitBot(c))-1;if(y1-y0>=4){g.fillStyle=PITW;g.fillRect(c-1,y0,2,2);
      if(ng&&rand()<.3){ng.fillStyle='#c9b070';ng.fillRect(c-1,y0,2,2);}}}
  for(const c of doorCols){for(let x=c-2;x<=c+2;x++){const y0=R(pitTop(x)),y1=R(pitBot(x))-1;if(y1<y0)continue;
    g.fillStyle=(x===c-2||x===c+2)?sh(STEP,-26):STEP;g.fillRect(x,y0,1,y1-y0+1);}}
  // ---- 山牆面（右）：同樣的樓層，窗少 ----
  const nb=Math.max(1,R(FR.len/16));
  for(let i=0;i<nb;i++){const c=FR.x0+R(FR.len*(i+.5)/nb);
    sashWin(g,ng,FR,c-2,2,Math.min(5,fh[0]-5),CR,rand()<.5);
    for(let j=1;j<nF;j++){const wh=Math.min(j===1?6:j===2?5:4,fh[j]-3);sashWin(g,ng,FR,c-2,zf[j]+1,wh,CR,rand()<.5);}}
  // ---- 屋頂後方一排煙囪（每個分戶牆一支，立在後脊上）----
  const rb=ridges[0];
  for(let h=0;h<=nH;h++){const u=.05+.90*h/nH,p=P(RP,u,rb);chimney(g,R(p[0])-1,R(p[1]),'#a08c6c','#7c6b51','#d1c8b7','#a85a3e');}
  // ---- 沿街偶有一棵行道樹（右端 G0 內的空地）----
  if(bw>=3&&rand()<.6){const p=P(G0,.955,.84),x=R(p[0]),y=R(p[1]);
    g.fillStyle='rgba(18,28,18,.30)';g.fillRect(x-2,y,5,1);
    g.fillStyle='#5a4632';g.fillRect(x,y-3,1,3);
    g.fillStyle='#3f7a3a';g.fillRect(x-2,y-8,5,5);g.fillStyle='#2c5a2a';g.fillRect(x+2,y-7,1,4);
    g.fillStyle='#5fa050';g.fillRect(x-2,y-8,2,2);g.fillStyle='#3f7a3a';g.fillRect(x-1,y-9,3,1);}
  return {pitch:false};
}};

/* ============================ ukMansion ============================ */
REG.ukMansion={name:'ukMansion',draw(ctx){
  const {g,ng,G,G0,bw,bh,v,rand,ar}=ctx,H=ctx.wallH;
  const hasWing=!!(ar&&ar.ex&&ar.ex.box);
  const bx=hasWing?ar.ex.box:null;
  const Wg=hasWing?sub(G0,bx[0],bx[1],bx[2],bx[3]):null;
  const Hw=hasWing?Math.max(6,R(H*ar.ex.hm)):0;
  const base={brick:'#9e4f3e',stone:'#e4dfcf',stoneD:'#c3bdab',baseC:'#d2ccba',baseJ:'#b9b3a1',glass:'#33404d',sky:'#66798a',
    corS:'#7e5a4d',corL:'#ece7d8',slate:'#4b5159',slateT:'#5c626b',curb:'#787e86',gutter:'#2c3035',dorm:'#d3cdbd',dormD:'#9a9484',dormCap:'#7d838b',
    chim:'#8d4536',chimD:'#66302a',cap:'#d6d0c0',pot:'#7a5a4a',arch:'#141416',lamp:'#3e3e40',lampLit:'#ffd08a',hall:'#d9a24a',lit:'#fffbe5',pipe:'#3b3b3f',
    porch:'#e4dfcf',porchL:'#f2ede0',porchD:'#c3bdab',step:'#cfc9b8'};
  const dk=o=>{const r={};for(const k in o)r[k]=sh(o[k],-40);r.glass='#232c36';r.sky='#48586a';r.lit='#f4ecc8';r.lampLit=o.lampLit;r.hall=o.hall;return r;};
  const CL=base,CR=dk(base);
  const dkBrick=(((v/3)|0)%2)===1;     // 第二變體：更深的紫紅磚
  if(dkBrick){CL.brick='#8c4238';CR.brick=sh(CL.brick,-40);}
  const so=Math.max(5,Math.min(14,R((H+ctx.stepH+ctx.towH+ctx.pitchH*.5)*.26)));
  // ---- 一個量體：石基座＋紅磚樓層（每層白石樓板帶）＋簷口＋石板 mansard（天窗一排）＋後緣煙囪 ----
  const body=(Bx,Hb,o)=>{
    let bH=Hb>=30?7:6,cor=2;
    const avail=Hb-bH-cor,nFl=Math.max(1,Math.min(5,Math.floor(avail/6)));
    const fh=Math.max(4,Math.min(8,Math.floor(avail/nFl)));
    let left=Hb-bH-cor-nFl*fh;const ab=Math.max(0,Math.min(2,left));bH+=ab;left-=ab;cor+=Math.max(0,left);
    const zC=bH+nFl*fh,mH=5,s=2,mB=mH+2*s;
    const FL=mkFace(Bx.W,Bx.S,Hb),FR=mkFace(Bx.S,Bx.E,Hb);FR.x0++;FR.len--;
    const PL={N:[Bx.N[0],Bx.N[1]-Hb-mH],E:[Bx.E[0]-2*s,Bx.E[1]-s-Hb-mH],S:[Bx.S[0],Bx.S[1]-2*s-Hb-mH],W:[Bx.W[0]+2*s,Bx.W[1]-s-Hb-mH]};
    // 屋頂板
    dia(g,PL,CL.slateT);
    // 牆
    const wall=(F,C)=>{
      band(g,F,F.x0,F.x1,0,bH,C.baseC);
      for(let z=2;z<bH-1;z+=3)band(g,F,F.x0,F.x1,z,z+1,C.baseJ);
      band(g,F,F.x0,F.x1,bH,zC,C.brick);
      for(let j=0;j<nFl;j++)band(g,F,F.x0,F.x1,bH+j*fh,bH+j*fh+1,C.stone);
      band(g,F,F.x0,F.x1,zC,zC+1,C.corS);
      band(g,F,F.x0,F.x1,zC+1,Hb,C.corL);
    };
    wall(FL,CL);wall(FR,CR);
    // 窗：成對直立窗（2＋石中挺＋2），每 12 列一組；基座層單窗
    const bays=F=>{const n=Math.max(1,Math.floor((F.len-3)/12)),tot=(n-1)*12+7,st=F.x0+Math.floor((F.len-tot)/2)+1;const a=[];for(let i=0;i<n;i++)a.push(st+i*12);return a;};
    const sillZ=fh>=7?2:1,wh=fh>=8?fh-4:Math.min(3,fh-3);
    const pairWin=(F,x,zb,C)=>{
      band(g,F,x-1,x+5,zb,zb+1,C.stone);
      band(g,F,x,x+1,zb+1,zb+1+wh,C.glass);band(g,F,x+3,x+4,zb+1,zb+1+wh,C.glass);
      band(g,F,x,x+1,zb+wh,zb+1+wh,C.sky);band(g,F,x+3,x+4,zb+wh,zb+1+wh,C.sky);
      band(g,F,x+2,x+2,zb+1,zb+1+wh,C.stone);
      if(ng){if(rand()<.44)band(ng,F,x,x+1,zb+1,zb+1+wh,C.lit);if(rand()<.44)band(ng,F,x+3,x+4,zb+1,zb+1+wh,C.lit);}
    };
    const baseWin=(F,x,C)=>{band(g,F,x,x+1,2,5,C.glass);band(g,F,x+3,x+4,2,5,C.glass);
      if(ng){if(rand()<.3)band(ng,F,x,x+1,2,5,C.lit);if(rand()<.3)band(ng,F,x+3,x+4,2,5,C.lit);}};
    const face=(F,C,entX)=>{
      const bl=bays(F);
      for(const x of bl){
        if(entX!=null&&x===entX)continue;
        baseWin(F,x,C);
        for(let j=0;j<nFl;j++)pairWin(F,x,bH+j*fh+sillZ,C);
      }
      return bl;
    };
    let entX=null;
    if(o.entrance!=null){const bl=bays(FL),want=FL.x0+R(FL.len*o.entrance);let best=bl[0];for(const x of bl)if(Math.abs(x-want)<Math.abs(best-want))best=x;entX=best;}
    const blL=face(FL,CL,entX);face(FR,CR,null);
    // 入口：石造門廊（升到基座之上兩列）＋拱門＋兩盞門燈
    if(entX!=null){const x=entX;
      band(g,FL,x-1,x+5,0,bH+2,CL.porch);band(g,FL,x-1,x-1,0,bH+2,CL.porchL);band(g,FL,x+5,x+5,0,bH+2,CL.porchD);
      band(g,FL,x-1,x+5,bH+1,bH+2,CL.porchL);band(g,FL,x,x+4,0,1,CL.step);
      band(g,FL,x+1,x+3,1,6,CL.arch);band(g,FL,x+2,x+2,6,7,CL.arch);
      // 門燈：托架（暗）＋燈頭（奶白），夜裡整支發光
      for(const lx of [x,x+4]){band(g,FL,lx,lx,4,5,CL.lamp);band(g,FL,lx,lx,5,6,'#f1e2b0');}
      for(let j=0;j<nFl;j++)pairWin(FL,x,bH+j*fh+sillZ,CL);
      // 門廊頂上的石欄杆（一樓落地窗在它後面）
      for(const px of [x-1,x+1,x+3,x+5])band(g,FL,px,px,bH+2,bH+3,CL.porchL);
      band(g,FL,x-1,x+5,bH+3,bH+4,CL.porchL);
      if(ng){for(const lx of [x,x+4])band(ng,FL,lx,lx,4,6,CL.lampLit);band(ng,FL,x+1,x+3,1,6,CL.hall);}
      o.entFoot=[x+2,FL.fy(x+2)];
    }
    // 轉角石（南角上下交錯）＋右面落水管
    for(let z=bH;z<zC-1;z+=4){band(g,FL,FL.x1,FL.x1,z,z+2,CL.stone);band(g,FR,FR.x0,FR.x0,z,z+2,CR.stoneD);}
    band(g,FR,FR.x1-1,FR.x1-1,0,zC,CL.pipe);
    // mansard 斜面帶（正面亮、右面暗），兩端往屋頂板內收成斜角
    const mans=(F,C,corner,pcorner,isL)=>{
      for(let x=F.x0;x<=F.x1;x++){
        const wt=F.fy(x)-Hb;                     // 牆頂列
        let yTop;
        const t=isL?(x-corner[0]):(corner[0]-x);   // 離端角的距離（列）
        if(t<2*s)yTop=R(corner[1]-Hb-t*(s+mH)/(2*s));else yTop=wt-mB;
        const yBot=wt-1;if(yBot<yTop)continue;
        g.fillStyle=C.slate;g.fillRect(x,yTop,1,yBot-yTop+1);
        g.fillStyle=C.curb;g.fillRect(x,yTop,1,1);
        if(yBot>yTop){g.fillStyle=C.gutter;g.fillRect(x,yBot,1,1);}
      }
    };
    mans(FL,CL,Bx.W,PL.W,true);mans(FR,CR,Bx.E,PL.E,false);
    // 天窗（正面，對齊成對窗的中線）
    for(const x of blL){const c=x+2;if(c-1<R(PL.W[0])||c+2>FL.x1)continue;
      band(g,FL,c-1,c+2,Hb+1,Hb+6,CL.dorm);band(g,FL,c+2,c+2,Hb+1,Hb+6,CL.dormD);
      band(g,FL,c,c+1,Hb+2,Hb+5,CL.glass);band(g,FL,c-1,c+2,Hb+6,Hb+7,CL.dormCap);
      if(ng&&rand()<.35)band(ng,FL,c,c+1,Hb+2,Hb+5,CL.lit);}
    // 後緣一排煙囪
    const nC=Math.max(2,R(FL.len/26));
    for(let i=0;i<nC;i++){const p=P(PL,.08+.84*(i+.5)/nC,.16);chimney(g,R(p[0])-1,R(p[1]),CL.chim,CL.chimD,CL.cap,CL.pot);}
    return {PL,FL,FR,entFoot:o.entFoot||null};
  };
  // ---- 主量體 ----
  const main=body(G,H,{entrance:hasWing?.74:.5});
  if(hasWing){
    // 側翼的剪影底下清掉夜光（主量體被擋住的窗、核心前庭的燈），再畫側翼
    const PLw={N:[Wg.N[0],Wg.N[1]-Hw-5],E:[Wg.E[0]-4,Wg.E[1]-2-Hw-5],S:[Wg.S[0],Wg.S[1]-4-Hw-5],W:[Wg.W[0]+4,Wg.W[1]-2-Hw-5]};
    const fL=mkFace(Wg.W,Wg.S,Hw),fR=mkFace(Wg.S,Wg.E,Hw);
    for(let x=R(Wg.W[0]);x<=R(Wg.E[0]);x++){const yt=R(PLw.N[1]+Math.abs(x-PLw.N[0])/2)-1;const yb=x<=R(Wg.S[0])?fL.fy(x):fR.fy(x);if(yb>=yt)ng.clearRect(x,yt,1,yb-yt+2);}
    // 落影（向右下）＋地坪＋接地暗線
    const SHW=k2=>({N:[Wg.N[0]+k2,Wg.N[1]+R(k2*.45)],E:[Wg.E[0]+k2,Wg.E[1]+R(k2*.45)],S:[Wg.S[0]+k2,Wg.S[1]+R(k2*.45)],W:[Wg.W[0]+k2,Wg.W[1]+R(k2*.45)]});
    ctx.A.fillPara547(g,SHW(so),'rgba(20,28,22,.30)');ctx.A.fillPara547(g,SHW(Math.max(1,so>>1)),'rgba(16,24,18,.26)');
    ctx.A.fillPara547(g,Wg,'#8a7a68');
    seg(g,Wg.W,Wg.S,'rgba(16,22,18,.45)');seg(g,Wg.S,Wg.E,'rgba(16,22,18,.45)');
    body(Wg,Hw,{entrance:null});
    // 前庭：矮樹籬圍住前緣與右緣，入口到街的石板小徑打斷樹籬
    const HG='#3a6a36',HT='#4f8a45';
    const hedge=(a,b,skipX)=>{const xa=R(a[0]),xb=R(b[0]),k=(b[1]-a[1])/(b[0]-a[0]||1);
      for(let x=Math.min(xa,xb);x<=Math.max(xa,xb);x++){if(skipX&&Math.abs(x-skipX)<=2)continue;const y=R(a[1]+(x-a[0])*k);
        g.fillStyle=HG;g.fillRect(x,y-2,1,2);g.fillStyle=HT;g.fillRect(x,y-3,1,1);g.fillStyle='rgba(18,28,18,.30)';g.fillRect(x,y,1,1);}};
    let gate=null;
    // 小徑：從門廊腳往 +v（畫面左下）走到前緣，樹籬在小徑處留門
    if(main.entFoot){const px0=main.entFoot[0],py0=main.entFoot[1];
      const fG0=x=>G0.W[1]+(x-G0.W[0])/2;
      for(let k=0;;k++){const x=px0-2*k,y=py0+k;if(y>=fG0(x)-1||k>40)break;g.fillStyle='#c9c2ae';g.fillRect(x-1,y,3,1);g.fillStyle='#a49d8a';g.fillRect(x+2,y,1,1);gate=x;}}
    hedge(P(G0,bx[1]+.03,1),P(G0,.985,1),gate);
    hedge(P(G0,1,bx[2]+.05),P(G0,1,.97),null);
  }
  return {pitch:false};
}};
})();
