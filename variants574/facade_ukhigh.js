// facade_ukhigh.js — T577 英國維多利亞高街（high street）立面繪製器（實驗線）
// ukHighStreet：套在商業 lv1 cornerLot（轉角店屋：一樓木製店面＋兩到三層紅磚／灰泥住宅、板岩屋頂＋煙囪、轉角斜切入口／角樓）
//               與商業 lv2 hotel（四到五層旅館：石砌一樓＋大門雨遮、整齊窗列＋一樓鐵欄陽台、頂部名牌＋孟莎屋頂＋旗桿）。
// 登記：window.__facade577.ukHighStreet={name,draw(ctx)}；只畫牆／窗／屋頂／沿街小件，地坪、接地線、前庭道具由核心畫好。
// 座標：G.W→G.S 是受光正面（朝路），G.S→G.E 是背光側面；「朝路的前方」在畫面上是 (-2,+1)。全部整數像素、硬邊多邊形。
// 亂數只用 ctx.rand（決定性）；角樓有無由 v 決定；每店招牌色、門位、遮陽篷、酒吧與否由 rand 決定，重放一致。
(function(){
'use strict';
const REG=window.__facade577=window.__facade577||{};
const R=Math.round,clampN=(x,a,b)=>x<a?a:x>b?b:x;

function tools(ctx){
  const A=ctx.A,sh=A.shade;
  const rc=(cx,x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(R(x),R(y),w,h);};
  // 硬邊多邊形：像素中心取樣掃描線，無抗鋸齒混色
  const poly=(cx,pts,c)=>{let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    y0=Math.max(0,Math.floor(y0));y1=Math.min(cx.canvas.height-1,Math.ceil(y1));cx.fillStyle=c;const n=pts.length;
    for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
      for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=Math.ceil(xs[i]-.5),xb=Math.ceil(xs[i+1]-.5);if(xb>xa)cx.fillRect(xa,y,xb-xa,1);}}};
  // 整數像素線（Bresenham）
  const lineP=(cx,a,b,c)=>{let x0=R(a[0]),y0=R(a[1]);const x1=R(b[0]),y1=R(b[1]);const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;cx.fillStyle=c;
    for(let guard=0;guard<4096;guard++){cx.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}};
  const fy=(a,b,x)=>a[1]+(x-a[0])*((b[1]-a[1])/(b[0]-a[0]));
  const foot=(a,b,x)=>R(fy(a,b,x));
  // 沿牆帶：欄 x∈[x0,x1]，離地 d0（含）往上 h 列 ⇒ 每欄佔列 y-d0-h+1 … y-d0（d=1 是牆腳上第一列）
  const band=(cx,a,b,x0,x1,d0,h,c)=>{cx.fillStyle=c;for(let x=x0;x<=x1;x++){const y=foot(a,b,x);cx.fillRect(x,y-d0-h+1,1,h);}};
  const sub=(C,u0,u1,v0,v1)=>({N:A.paraPt559(C,u0,v0),E:A.paraPt559(C,u1,v0),S:A.paraPt559(C,u1,v1),W:A.paraPt559(C,u0,v1)});
  const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  const lerp=A.lerp2;
  // 牆頂四角（與牆柱同一套取整的牆腳；-.02 讓簷口列不被掃描線吃掉）
  const tops=(C,h)=>{const xW=R(C.W[0]),xS=R(C.S[0]),xE=R(C.E[0]);
    return {W:[xW,foot(C.W,C.S,xW)-h-.02],S:[xS,foot(C.W,C.S,xS)-h-.02],E:[xE,foot(C.S,C.E,xE)-h-.02],N:[R(C.N[0]),R(C.N[1])-h-.02]};};
  // 直立推拉窗：x 左欄、y 該窗中欄的牆腳、d0 樓層底 d；窗台 d0+2（5 寬）、玻璃 d0+3..d0+6、窗楣 d0+7（headW 寬，預設 5；密排窗列給 3 免得連成條帶）；夜光只畫玻璃
  const sash=(g,ng,x,y,d0,glass,trim,lit,rail,headW)=>{
    const hw=headW||5;
    rc(g,x-1,y-d0-2,5,1,trim);rc(g,x-1+((5-hw)>>1),y-d0-7,hw,1,trim);
    rc(g,x,y-d0-6,3,4,glass);
    if(rail)rc(g,x,y-d0-5,3,1,rail);
    if(lit&&ng){rc(ng,x,y-d0-6,3,4,'#ffd98c');if(rail)rc(ng,x,y-d0-5,3,1,'rgba(70,45,20,.5)');}};
  // 煙囪：立在屋脊點 (x,y) 上，左亮右暗，陶土煙囪帽
  const stack=(g,x,y,w,h,brick,pots)=>{
    const bl=sh(brick,-4),br=sh(brick,-44);
    rc(g,x,y-h,w>>1,h,bl);rc(g,x+(w>>1),y-h,w-(w>>1),h,br);
    rc(g,x-1,y-h-1,w+2,1,sh(brick,-58));
    for(let i=0;i<pots;i++){const px=x+(pots===2?[0,w-1][i]:[0,(w>>1),w-1][i]);rc(g,px,y-h-3,1,2,i%2?'#a35a37':'#b8653e');rc(g,px,y-h-4,1,1,'#6b3f2a');}};
  return {sh,rc,poly,lineP,fy,foot,band,sub,mid,lerp,tops,sash,stack};
}

const BRICKS=['#ab8f66','#b59c6a','#9a5541','#a35a45','#8f4d3f','#b39c78'];
const PAINT=['#e8e0cc','#dfe3e6','#e9d8cc','#d9dcc6'];
const FASC=['#1f4d3a','#5e1c26','#1e2f57','#1b1b20','#2f5f8a','#7a3b1e','#2f4f4f','#8a2a2a'];
const AWN=['#b8433a','#2f6b4a','#1e2f57','#c77a2a'];
const SLATE_F='#5c6774',SLATE_B='#414a55',SLATE_L='#505b69',RIDGE='#8b95a3',COPING='#cfc8b8';
const GLASS_U='#4b6070',GLASS_S='#8db2c2',GLASS_SH='#b7d3dd',STONE='#d8d0bc';

// ---------------------------------------------------------------- 店屋（lv1 cornerLot）
function drawShops(ctx,T){
  const {A,g,ng,G,rand,v,span}=ctx,{sh,rc,poly,lineP,foot,band,sub,mid,lerp,tops,sash,stack}=T;
  const xW=R(G.W[0]),xS=R(G.S[0]),xE=R(G.E[0]),yS=R(G.S[1]);
  const LX=xS-xW,RX=xE-xS;
  const yF=x=>foot(G.W,G.S,x),yR=x=>foot(G.S,G.E,x);
  // ---- 量體：一樓店面 12 列 + 上層每層 8 列；深街區背靠背多排 M 形屋頂
  const shopH=12,fh=8;
  let nUp=span>=2?3:2;
  const depthX=G.N[0]-G.W[0];
  const nRows=clampN(R(depthX/28),1,3),rowDX=depthX/nRows;
  let rise=clampN(R(rowDX*.27),5,9);
  const ridgeTop=()=>A.paraPt559(G,0,.5/nRows)[1]-(shopH+fh*nUp)-rise;   // 最後排屋脊左端（最高點）
  while(nUp>1&&ridgeTop()<12)nUp--;
  while(rise>4&&ridgeTop()<12)rise--;
  const wallH=shopH+fh*nUp;
  // ---- 轉角：斜切面 5 欄 [xS-2,xS+2]，腳在 yS-1；角樓由 v 決定
  const chamfer=LX>=14&&RX>=8,cW=chamfer?2:0;
  const turret=chamfer&&(v%2===0);
  const fx0=xW,fx1=xS-cW-1;
  const nShop=Math.max(1,R((fx1-fx0+1)/19));
  const bx=[];for(let i=0;i<=nShop;i++)bx.push(fx0+R(i*(fx1-fx0)/nShop));
  // ---- 決定性抽籤（順序固定）
  const base=BRICKS[(rand()*BRICKS.length)|0];
  const units=[];
  for(let i=0;i<nShop;i++){
    const w=bx[i+1]-bx[i]+1,painted=rand()<.16;
    const brick=painted?PAINT[(rand()*PAINT.length)|0]:sh(base,R((rand()-.5)*14));
    const pub=w>=17&&rand()<.22;
    const fascia=pub?(rand()<.5?'#1b1b20':'#1f4d3a'):FASC[(rand()*FASC.length)|0];
    units.push({x0:bx[i],x1:bx[i+1],w,painted,brick,fascia,pub,
      gold:rand()<.7,doorL:rand()<.5,awn:!pub&&w>=15&&rand()<.4,awnCol:AWN[(rand()*AWN.length)|0],
      litShop:pub||rand()<.72,dormer:rand()<.3,trim:painted?'#f4efe4':STONE});
  }
  const uLast=units[units.length-1];
  const sideBrick=sh(base,-42);
  // ---- 正面牆體
  for(const U of units){
    for(let x=U.x0;x<=U.x1;x++){const y=yF(x);
      rc(g,x,y-wallH,1,wallH,U.brick);
      rc(g,x,y-wallH,1,1,'#3f444b');                                  // 簷溝
      rc(g,x,y-wallH+1,1,1,U.painted?'#f6f1e6':sh(U.brick,30));        // 簷口線
      for(let f=1;f<nUp;f++)rc(g,x,y-shopH-fh*f,1,1,sh(U.brick,U.painted?-10:16));  // 樓層腰線
    }
  }
  // ---- 店面（d=1..12）
  const shopFront=(a,b,x0,x1,U,side,withDoor)=>{
    const yAt=x=>foot(a,b,x);
    const F=side?sh(U.fascia,-24):U.fascia,gl=side?sh(GLASS_S,-34):GLASS_S,glh=side?sh(GLASS_SH,-34):GLASS_SH;
    const wx0=x0+1,wx1=x1-1;
    band(g,a,b,wx0,wx1,4,5,gl);band(g,a,b,wx0,wx1,8,1,glh);          // 櫥窗 d=4..8，頂列反光
    band(g,a,b,wx0,wx1,2,2,sh(F,-14));band(g,a,b,wx0,wx1,1,1,'#26262a'); // 踢腳板、底
    band(g,a,b,x0+1,x1-1,9,3,F);                                       // 招牌板 d=9..11
    band(g,a,b,x0,x1,12,1,side?'#b9b2a2':'#ece4d0');                   // 簷板 d=12
    for(const x of[x0,x1]){const y=yAt(x);rc(g,x,y-11,1,11,side?sh(F,-10):sh(F,12));rc(g,x,y-12,1,1,sh(F,-6));} // 壁柱＋托架
    if(ng&&U.litShop){ng.fillStyle='#ffe2a8';for(let x=wx0;x<=wx1;x++){const y=yAt(x);ng.fillRect(x,y-8,1,5);}}
    // 字：d=10，每 2px 一點、每五字空一格
    const gold=U.gold?'#d9b55c':'#efe6cf';
    const lx0=x0+3,lx1=Math.min(x1-3,x0+3+Math.max(4,R((x1-x0)*.5)));
    for(let x=lx0,i=0;x<=lx1;x+=2,i++){if(i%5===4)continue;rc(g,x,yAt(x)-10,1,1,gold);if(ng&&U.litShop)rc(ng,x,yAt(x)-10,1,1,'#fff0c0');}
    if(ng&&U.litShop){ng.fillStyle='rgba(255,214,150,.22)';for(let x=x0+1;x<=x1-1;x++){const y=yAt(x);ng.fillRect(x,y-11,1,3);}}
    // 中挺：櫥窗寬 ≥ 9 就一根
    let ww0=wx0,ww1=wx1,dx0=-1;
    if(withDoor){dx0=U.doorL?x0+2:x1-4;if(U.doorL)ww0=dx0+4;else ww1=dx0-2;}
    if(ww1-ww0>=8){const mx=(ww0+ww1)>>1;rc(g,mx,yAt(mx)-8,1,5,F);if(ng&&U.litShop)rc(ng,mx,yAt(mx)-8,1,5,'rgba(40,30,20,.55)');}
    // 內縮店門：框 5 欄 d=1..8、門扇 d=2..6、氣窗 d=7..8、門檻、門把
    if(withDoor){
      const door=U.pub?'#2a2a30':(rand()<.5?F:['#1b1b20','#8c2020','#25562f','#e6e0d0','#20407a'][(rand()*5)|0]);
      band(g,a,b,dx0-1,dx0+3,1,8,sh(F,-30));
      band(g,a,b,dx0,dx0+2,2,5,door);
      band(g,a,b,dx0,dx0+2,7,2,glh);
      band(g,a,b,dx0,dx0+2,1,1,'#d8d0bd');
      rc(g,dx0+(U.doorL?2:0),yAt(dx0+1)-4,1,1,sh(door,60));
      if(ng&&U.litShop){ng.fillStyle='#ffd27a';for(let x=dx0;x<=dx0+2;x++)ng.fillRect(x,yAt(x)-8,1,2);}
    }
    // 遮陽篷：貼在招牌板下緣（d=8），往前 (-2,+1) 一列；條紋每 2px
    if(U.awn&&!side){
      const ax0=ww0,ax1=ww1;
      // 條紋以畫面 x 取相位（前排 x-2 也用同一相位 ⇒ 直條而非棋盤）
      const stripe=x=>(Math.floor(x/3)&1)?U.awnCol:'#efe9dc';
      for(let x=ax0;x<=ax1;x++){const y=yAt(x);
        rc(g,x,y-8,1,1,stripe(x));rc(g,x-2,y-7,1,1,sh(stripe(x-2),-16));rc(g,x-2,y-6,1,1,sh(stripe(x-2),-46));}
      rc(g,ax0-2,yAt(ax0)-7,1,2,sh(U.awnCol,-40));rc(g,ax1-2,yAt(ax1)-7,1,2,sh(U.awnCol,-40));
    }
  };
  for(const U of units)shopFront(G.W,G.S,U.x0,U.x1,U,false,true);
  // ---- 上層窗（每戶 2–3 扇）、落水管、酒吧掛招與花籃、天窗資料
  const winCols=[];
  units.forEach((U,i)=>{
    const frs=U.pub?[.24,.56]:(U.w>=20?[.22,.5,.78]:[.3,.7]);
    const xcs=frs.map(fr=>clampN(U.x0+R(U.w*fr),U.x0+2,U.x1-2));
    for(let f=0;f<nUp;f++){const d0=shopH+fh*f;
      for(const xc of xcs)sash(g,ng,xc-1,yF(xc),d0,GLASS_U,U.trim,U.pub||rand()<.42,sh(GLASS_U,34));}
    winCols.push(xcs);
    if(i%2===1){const x=U.x0,y=yF(x);rc(g,x,y-wallH+2,1,wallH-14,'#3f444b');rc(g,x-1,y-wallH+2,2,1,'#4a4f57');}   // 落水管＋斗
    if(U.pub){
      const sx=clampN(U.x0+R(U.w*.84)-1,U.x0+2,U.x1-4),y=yF(sx+1);
      rc(g,sx-1,y-18,4,1,'#2b2b31');rc(g,sx+1,y-17,1,1,'#2b2b31');                   // 托架
      rc(g,sx,y-16,3,3,'#efe6cf');rc(g,sx+1,y-15,1,1,'#b8433a');rc(g,sx,y-13,3,1,'#2b2b31'); // 掛式招牌
      if(ng)rc(ng,sx,y-16,3,3,'rgba(255,240,200,.75)');
      for(const xc of xcs){const yb=yF(xc);rc(g,xc-1,yb-14,3,1,'#3f7a3c');rc(g,xc,yb-15,1,1,'#4f9449');rc(g,xc-1,yb-14,1,1,'#d46a8a');rc(g,xc+1,yb-14,1,1,'#e0a040');} // 花籃
    }
  });
  // ---- 斜切轉角面（門在轉角，招牌板延續最後一戶）
  const chTop=turret?wallH+3:wallH;
  if(chamfer){
    const yc=yS-1,cb=sh(uLast.brick,-18),F=sh(uLast.fascia,-12);
    for(let dx=-2;dx<=2;dx++){const x=xS+dx;
      const c=turret?sh(uLast.brick,[4,-6,-18,-30,-42][dx+2]):cb;
      rc(g,x,yc-chTop,1,chTop,c);
      if(!turret){rc(g,x,yc-wallH,1,1,'#3f444b');rc(g,x,yc-wallH+1,1,1,sh(cb,28));}
      for(let f=1;f<nUp;f++)rc(g,x,yc-shopH-fh*f,1,1,sh(c,14));
    }
    rc(g,xS-2,yc-11,5,3,F);rc(g,xS-2,yc-12,5,1,'#cfc7b5');                       // 招牌板＋簷板
    rc(g,xS-1,yc-10,1,1,'#d9b55c');rc(g,xS+1,yc-10,1,1,'#d9b55c');
    rc(g,xS-2,yc-8,5,8,sh(F,-30));rc(g,xS-1,yc-6,3,5,'#2a2a30');rc(g,xS-1,yc-8,3,2,GLASS_SH); // 門框、門、氣窗
    rc(g,xS-1,yc-1,3,1,'#d8d0bd');rc(g,xS+1,yc-4,1,1,'#c9a24a');
    rc(g,xS-2,yc,5,1,'rgba(16,22,18,.45)');rc(g,xS-1,yc+1,3,1,'#d8d0bd');           // 接地暗線＋門階
    if(ng&&uLast.litShop){rc(ng,xS-1,yc-8,3,2,'#ffd27a');rc(ng,xS-1,yc-10,1,1,'#fff0c0');rc(ng,xS+1,yc-10,1,1,'#fff0c0');}
    for(let f=0;f<nUp;f++){const d0=shopH+fh*f;sash(g,ng,xS-1,yc,d0,GLASS_U,sh(uLast.trim,-16),rand()<.5,sh(GLASS_U,30));}
  }
  // ---- 側面（背光）：牆、轉角店回頭、上層窗、一樓小窗
  const sx0=xS+cW+1;
  for(let x=sx0;x<=xE;x++){const y=yR(x);
    rc(g,x,y-wallH,1,wallH,sideBrick);
    rc(g,x,y-1,1,1,sh(sideBrick,-16));
    rc(g,x,y-wallH,1,1,'#33373d');rc(g,x,y-wallH+1,1,1,sh(sideBrick,22));
    for(let f=1;f<nUp;f++)rc(g,x,y-shopH-fh*f,1,1,sh(sideBrick,12));
  }
  const retX1=Math.min(xE-1,sx0+11);
  const hasRet=retX1-sx0>=5;
  if(hasRet){const U2=Object.assign({},uLast,{x0:sx0-1,x1:retX1+1,awn:false});shopFront(G.S,G.E,sx0-1,retX1+1,U2,true,false);}
  {const sTrim=sh(STONE,-40),sGl=sh(GLASS_U,-12);
    for(let xc=sx0+3;xc<=xE-3;xc+=8){
      for(let f=0;f<nUp;f++)sash(g,ng,xc-1,yR(xc),shopH+fh*f,sGl,sTrim,rand()<.4,sh(sGl,26));
      if(!hasRet||xc>retX1+3){const y=yR(xc);rc(g,xc-1,y-8,3,1,sTrim);rc(g,xc,y-7,2,4,sGl);rc(g,xc-1,y-3,3,1,sTrim);if(ng&&rand()<.45)rc(ng,xc,y-7,2,4,'#ffd98c');}
    }
    if(hasRet&&xE-retX1>=4){const x=retX1+2,y=yR(x);rc(g,x,y-wallH+2,1,wallH-3,'#33373d');}
  }
  // ---- 屋頂：背排→前排，每排 背坡→側山牆→前坡→石板橫縫→屋脊→煙囪
  const stone=sh(base,-58);
  for(let r=0;r<nRows;r++){
    const C=sub(G,0,1,r/nRows,(r+1)/nRows),Ct=tops(C,wallH),isFront=r===nRows-1;
    const f=mid(Ct.W,Ct.N);f[1]-=rise;const b=mid(Ct.S,Ct.E);b[1]-=rise;
    poly(g,[Ct.N,Ct.E,b,f],SLATE_B);
    poly(g,[Ct.S,Ct.E,b],sideBrick);
    lineP(g,Ct.S,b,COPING);lineP(g,b,Ct.E,sh(COPING,-50));
    poly(g,[Ct.W,Ct.S,b,f],SLATE_F);
    for(const s of[.34,.68])lineP(g,lerp(Ct.W,f,s),lerp(Ct.S,b,s),SLATE_L);
    lineP(g,f,b,RIDGE);
    lineP(g,Ct.W,f,sh(SLATE_F,12));
    // 煙囪：每戶分界一座（後排每兩座取一），兩端各一
    const ts=[.05];for(let i=1;i<nShop;i++)ts.push((bx[i]-xW)/Math.max(1,LX));ts.push(.94);
    ts.forEach((t,i)=>{if(!isFront&&i%2===1)return;if(turret&&isFront&&t>.9)return;
      const p=lerp(f,b,t),pots=2+((rand()<.4)?1:0),w=pots===3?5:4;
      stack(g,R(p[0])-(w>>1),R(p[1])+1,w,6,base,pots);});
    // 老虎窗（gabled dormer）：前排前坡、戶中央，三成。牆 4×3（右緣暗）＋窗台、玻璃 2×2，上面小山牆板岩頂 6/4/2 寬三列（左亮右暗）
    if(isFront)units.forEach((U,i)=>{if(!U.dormer)return;const t=((U.x0+U.x1)/2-xW)/Math.max(1,LX),e=lerp(Ct.W,Ct.S,t),rp=lerp(f,b,t),d=lerp(e,rp,.42);
      const x=R(d[0])-2,y=R(d[1]),dl=sh(SLATE_F,14),dr=SLATE_B;
      rc(g,x,y-3,4,3,U.brick);rc(g,x+3,y-3,1,3,sh(U.brick,-30));rc(g,x,y-1,3,1,U.trim);
      rc(g,x+1,y-3,2,2,GLASS_U);
      rc(g,x-1,y-4,3,1,dl);rc(g,x+2,y-4,3,1,dr);rc(g,x,y-5,2,1,dl);rc(g,x+2,y-5,2,1,dr);rc(g,x+1,y-6,1,1,sh(SLATE_F,22));rc(g,x+2,y-6,1,1,dr);
      if(ng&&rand()<.4)rc(ng,x+1,y-3,2,2,'#ffd98c');});
  }
  // ---- 角樓 / 轉角小山牆（畫在屋頂之後、蓋住角落）
  if(chamfer){
    const yc=yS-1;
    if(turret){
      const yT=yc-chTop;
      for(let dx=-2;dx<=2;dx++)rc(g,xS+dx,yT,1,chTop-shopH,sh(uLast.brick,[4,-6,-18,-30,-42][dx+2]));   // 重畫圓柱（蓋住屋頂角）
      for(let f=0;f<nUp;f++){const d0=shopH+fh*f;sash(g,ng,xS-1,yc,d0,GLASS_U,sh(uLast.trim,-16),rand()<.5,sh(GLASS_U,30));}
      rc(g,xS-3,yc-shopH-1,7,1,STONE);                                              // 托座
      rc(g,xS-3,yT-1,7,1,sh(SLATE_F,10));rc(g,xS,yT-1,4,1,SLATE_B);                  // 錐頂由下往上 7,7,5,5,3,3,1
      rc(g,xS-3,yT-2,7,1,sh(SLATE_F,10));rc(g,xS,yT-2,4,1,SLATE_B);
      rc(g,xS-2,yT-3,5,1,sh(SLATE_F,16));rc(g,xS,yT-3,3,1,SLATE_B);
      rc(g,xS-2,yT-4,5,1,sh(SLATE_F,16));rc(g,xS,yT-4,3,1,SLATE_B);
      rc(g,xS-1,yT-5,3,1,sh(SLATE_F,22));rc(g,xS,yT-5,2,1,SLATE_B);
      rc(g,xS-1,yT-6,3,1,sh(SLATE_F,22));rc(g,xS,yT-6,2,1,SLATE_B);
      rc(g,xS,yT-7,1,1,RIDGE);rc(g,xS,yT-8,1,1,'#c9a24a');
    }else{
      const yt=yc-wallH;
      rc(g,xS-2,yt-1,5,1,sh(uLast.brick,-18));rc(g,xS-1,yt-2,3,1,sh(uLast.brick,-18));rc(g,xS,yt-3,1,1,STONE);
      rc(g,xS-3,yt,7,1,STONE);
    }
  }
  return {pitch:true};
}

// ---------------------------------------------------------------- 旅館（lv2 hotel）
function drawHotel(ctx,T){
  const {A,g,ng,G,rand,span,lv}=ctx,{sh,rc,poly,lineP,foot,band,mid,lerp,tops,sash,stack}=T;
  const xW=R(G.W[0]),xS=R(G.S[0]),xE=R(G.E[0]);
  const LX=xS-xW,RX=xE-xS;
  const yF=x=>foot(G.W,G.S,x),yR=x=>foot(G.S,G.E,x);
  const gH=13,fh=8;
  let nUp=lv>=3?5:(span>=2?4:3);
  const roofTop=()=>G.N[1]-(gH+fh*nUp+5)-8;
  while(nUp>2&&roofTop()<16)nUp--;
  const wallH=gH+fh*nUp,paraH=wallH+5;
  // ---- 抽籤：石面／紅磚／黃磚；雨遮色
  const sc=rand();
  const stoneFront=sc<.4,base=stoneFront?'#cdc1a6':(sc<.72?'#9a5541':'#b09a6c');
  const front=base,side=sh(base,-40);
  const gfL='#d3cab4',gfR='#9d9482',trim=stoneFront?'#ece5d3':'#e2d9c4';
  const accent=['#6b1f2a','#1f4d3a','#1e2f57'][(rand()*3)|0];
  const dc=xW+R(LX/2);
  const face=(a,b,x0,x1,isL)=>{
    const yAt=x=>foot(a,b,x),wall=isL?front:side,gf=isL?gfL:gfR,tr=isL?trim:sh(trim,-40),gl=isL?GLASS_U:sh(GLASS_U,-12);
    for(let x=x0;x<=x1;x++){const y=yAt(x);
      rc(g,x,y-paraH,1,paraH,wall);
      rc(g,x,y-gH,1,gH,gf);rc(g,x,y-1,1,1,sh(gf,-34));rc(g,x,y-4,1,1,sh(gf,-14));rc(g,x,y-8,1,1,sh(gf,-14));   // 一樓石砌＋粗石橫縫
      rc(g,x,y-12,1,1,sh(gf,-12));rc(g,x,y-13,1,1,sh(gf,24));                                                     // 一樓楣梁
      // 上層不畫樓層腰線：每層的石窗台已是樓層節奏，再加腰線會與窗楣連成兩列淺帶（iter3 拿掉）
      rc(g,x,y-wallH-1,1,1,sh(tr,10));rc(g,x,y-wallH-2,1,1,tr);                                                  // 頂簷口兩列
      rc(g,x,y-paraH,1,1,sh(wall,isL?22:14));                                                                    // 女兒牆壓頂
    }
    // 一樓拱窗：每 7 欄一扇，避開大門
    for(let xc=x0+3;xc<=x1-2;xc+=7){
      if(isL&&Math.abs(xc-dc)<=6)continue;
      const y=yAt(xc);rc(g,xc-2,y-2,5,1,sh(gf,20));rc(g,xc-1,y-8,3,6,gl);rc(g,xc,y-9,1,1,gl);rc(g,xc-1,y-9,1,1,sh(gf,-6));rc(g,xc+1,y-9,1,1,sh(gf,-6));
      if(ng&&rand()<.8){rc(ng,xc-1,y-8,3,6,'#ffe3ad');rc(ng,xc,y-9,1,1,'#ffe3ad');}
    }
    // 上層窗列：每 7 欄一扇；一樓上方鐵欄陽台帶
    for(let f=0;f<nUp;f++){const d0=gH+fh*f;
      for(let xc=x0+3;xc<=x1-2;xc+=7)sash(g,ng,xc-1,yAt(xc),d0,gl,tr,rand()<(isL?.5:.55),sh(gl,30),3);   // 窗楣 3 寬：密排窗列才不會連成條帶
      if(f===0){for(let x=x0+1;x<=x1-1;x++){const y=yAt(x);rc(g,x,y-d0-1,1,1,sh(tr,-6));if((x&1)===0)rc(g,x,y-d0-3,1,2,'#2e3238');else rc(g,x,y-d0-3,1,1,'#2e3238');}}
    }
  };
  face(G.W,G.S,xW,xS-1,true);
  face(G.S,G.E,xS,xE,false);
  // ---- 大門：石門套、雙開玻璃門、雨遮往前一格、兩根柱、紅地毯、門燈
  {
    const y=yF(dc);
    rc(g,dc-3,y-10,7,10,sh(gfL,-22));rc(g,dc-2,y-9,5,8,'#3a2a22');
    rc(g,dc-2,y-8,2,6,'#3c5262');rc(g,dc+1,y-8,2,6,'#3c5262');rc(g,dc-2,y-9,5,1,GLASS_SH);
    rc(g,dc-2,y-1,5,1,'#d8d0bd');
    if(ng){rc(ng,dc-2,y-8,2,6,'#ffe3ad');rc(ng,dc+1,y-8,2,6,'#ffe3ad');rc(ng,dc-2,y-9,5,1,'#fff0c0');}
    for(let x=dc-5;x<=dc+5;x++){const yy=yF(x);rc(g,x,yy-11,1,2,accent);rc(g,x-2,yy-10,1,1,sh(accent,-18));rc(g,x-2,yy-9,1,1,sh(accent,34));}
    for(const px of[dc-5,dc+5]){const yy=yF(px);rc(g,px-2,yy-8,1,10,'#2a2a2e');}
    for(let k=1;k<=2;k++)rc(g,dc-1-2*k,y+k,3,1,k===1?'#9b2b2b':'#8a2525');
    for(const lx of[dc-4,dc+4]){const yy=yF(lx);rc(g,lx,yy-7,1,1,'#2a2a2e');rc(g,lx,yy-8,1,1,'#f4e0a0');
      if(ng){rc(ng,lx,yy-8,1,1,'#fff6d0');rc(ng,lx-1,yy-9,3,3,'rgba(255,225,160,.35)');}}
  }
  // ---- 名牌（女兒牆上、正面 20%–80%）＋轉角直立招牌
  {
    const px0=xW+R(LX*.2),px1=xW+R(LX*.8);
    for(let x=px0;x<=px1;x++){const y=yF(x);rc(g,x,y-wallH-5,1,3,'#232a3a');}
    rc(g,px0,yF(px0)-wallH-5,1,3,'#c9a24a');rc(g,px1,yF(px1)-wallH-5,1,3,'#c9a24a');
    for(let x=px0+2,i=0;x<=px1-2;x+=2,i++){if(i%6===5)continue;const y=yF(x);rc(g,x,y-wallH-4,1,1,'#efe2b8');if(ng)rc(ng,x,y-wallH-4,1,1,'#fff3c8');}
    if(ng){ng.fillStyle='rgba(255,230,170,.28)';for(let x=px0;x<=px1;x++){const y=yF(x);ng.fillRect(x,y-wallH-5,1,3);}}
    const bs0=Math.max(gH+3,wallH-18),bs1=wallH-6,yc=R(G.S[1]);
    rc(g,xS-1,yc-bs1-1,3,bs1-bs0+2,'#7a1f24');rc(g,xS-1,yc-bs1-2,3,1,'#2b2b31');
    for(let d=bs0+1;d<=bs1-1;d+=2){rc(g,xS,yc-d,1,1,'#efe2b8');if(ng)rc(ng,xS,yc-d,1,1,'#fff3c8');}
    if(ng)rc(ng,xS-1,yc-bs1-1,3,bs1-bs0+2,'rgba(255,230,170,.25)');
  }
  // ---- 轉角隅石（磚面旅館）：S 角每 4 列一塊淺石
  if(!stoneFront){const yc=R(G.S[1]);for(let d=gH+2;d<wallH-1;d+=4){rc(g,xS-1,yc-d-1,1,2,sh(trim,-4));rc(g,xS,yc-d-1,1,2,sh(trim,-40));}}
  // ---- 孟莎屋頂：前坡／側坡各內縮 3 格、升 9；老虎窗；平頂鉛皮＋接縫；煙囪列、電梯機房、天窗、旗桿
  {
    const Cb=tops(G,paraH),MR=9;
    const du=6/Math.max(6,G.E[0]-G.N[0]),dv=6/Math.max(6,G.N[0]-G.W[0]);
    const P=(u,vv)=>{const p=A.paraPt559(G,u,vv);return [R(p[0]),R(p[1])-paraH-MR-.02];};
    const Ct={N:P(du,dv),E:P(1-du,dv),S:P(1-du,1-dv),W:P(du,1-dv)};
    poly(g,[Cb.N,Cb.E,Ct.E,Ct.N],SLATE_B);
    poly(g,[Cb.W,Cb.S,Ct.S,Ct.W],'#4f5967');
    poly(g,[Cb.S,Cb.E,Ct.E,Ct.S],'#39414c');
    for(const s of[.36,.7]){lineP(g,lerp(Cb.W,Ct.W,s),lerp(Cb.S,Ct.S,s),'#45505d');lineP(g,lerp(Cb.S,Ct.S,s),lerp(Cb.E,Ct.E,s),'#323a44');}   // 石板橫縫
    poly(g,[Ct.N,Ct.E,Ct.S,Ct.W],'#5d6674');
    // 鉛皮接縫：平行正面、每 8px 一道
    {const n=Math.max(1,R((Ct.N[0]-Ct.W[0])/8));for(let i=1;i<n;i++){const t=i/n;lineP(g,lerp(Ct.N,Ct.W,t),lerp(Ct.E,Ct.S,t),'#56606d');}}
    lineP(g,Ct.W,Ct.S,'#8791a0');lineP(g,Ct.S,Ct.E,'#6d7683');lineP(g,Cb.W,Ct.W,'#8791a0');lineP(g,Cb.S,Ct.S,'#7a8492');
    // 老虎窗：沿前坡每 12 欄一座（避開兩端）：牆 4 寬 4 高、玻璃 2×3、小披簷 6 寬
    for(let x=xW+7;x<=xS-6;x+=12){const y=foot(Cb.W,Cb.S,x);
      rc(g,x-1,y-8,4,4,trim);rc(g,x,y-8,2,3,GLASS_U);rc(g,x+2,y-8,1,4,sh(trim,-40));
      rc(g,x-2,y-9,6,1,'#8a94a2');rc(g,x-1,y-10,4,1,'#7a8492');
      if(ng&&rand()<.45)rc(ng,x,y-8,2,3,'#ffd98c');}
    // 煙囪列：平頂後緣，每 40px 正面一座（至少一座）；大面積再加電梯機房與天窗
    {const n=Math.max(1,R(LX/40));for(let i=0;i<n;i++){const p=A.paraPt559(Ct,(i+.5)/n,.16);stack(g,R(p[0])-2,R(p[1]),4,7,stoneFront?'#a89a80':base,2);}}
    if(span>=2){const p=A.paraPt559(Ct,.68,.55),x=R(p[0]),y=R(p[1]);
      rc(g,x-3,y-6,3,6,'#8a9098');rc(g,x,y-6,3,6,'#5f666e');rc(g,x-3,y-7,6,1,'#aab0b6');rc(g,x-2,y-3,1,2,'#3a3f45');}
    if(span>=2)for(const u of[.3,.45]){const p=A.paraPt559(Ct,u,.5),x=R(p[0]),y=R(p[1]);
      rc(g,x-2,y-2,5,3,'#7d8794');rc(g,x-1,y-2,3,2,'#6f8ea0');if(ng&&rand()<.5)rc(ng,x-1,y-2,3,2,'rgba(255,225,160,.6)');}
    // 旗桿：平頂前緣中央；聖喬治式小旗
    const fp=lerp(Ct.W,Ct.S,.5),fx=R(fp[0]),fyy=R(fp[1]);
    rc(g,fx,fyy-13,1,13,'#d8d8d8');rc(g,fx,fyy-14,1,1,'#c9a24a');rc(g,fx+1,fyy-13,4,3,'#f2f2f2');rc(g,fx+2,fyy-13,1,3,'#c4312c');rc(g,fx+1,fyy-12,4,1,'#c4312c');
  }
  return {pitch:false};
}

REG.ukHighStreet={name:'ukHighStreet',draw(ctx){
  const T=tools(ctx);
  return ctx.lv>=2?drawHotel(ctx,T):drawShops(ctx,T);
}};
})();
