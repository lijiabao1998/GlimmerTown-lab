// facade_uk1.js — T577 英式街景立面繪製器（實驗線）
// ukTerrace：維多利亞／愛德華連棟屋（套 cottage 原型）；ukSemi：1930 年代半獨立屋（套 bungalow 原型）
// 登記：window.__facade577[name]={name,draw(ctx)}；只畫牆／窗／屋頂／沿街小件，地坪、接地線、前庭道具由核心畫好。
// 座標：G.W→G.S 是受光正面（朝路），G.E→G.S 是背光端牆；u 沿正面、v 沿深度。全部整數像素、硬邊多邊形（像素中心取樣）。
// 亂數只用 ctx.rand（決定性）；主磚色由 v 決定；每戶差異（門色、磚色微差、天窗、樹籬／鐵欄）由 rand 決定。
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
  const cols=(a,b,fn)=>{const x0=R(Math.min(a[0],b[0])),x1=R(Math.max(a[0],b[0]));for(let x=x0;x<=x1;x++)fn(x,foot(a,b,x));};
  const wall=(cx,a,b,h,c)=>{cx.fillStyle=c;cols(a,b,(x,y)=>cx.fillRect(x,y-h,1,h));};
  const sub=(C,u0,u1,v0,v1)=>({N:A.paraPt559(C,u0,v0),E:A.paraPt559(C,u1,v0),S:A.paraPt559(C,u1,v1),W:A.paraPt559(C,u0,v1)});
  const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  const lerp=A.lerp2;
  // 牆頂四角（用與牆柱同一套取整的牆腳，屋頂邊線才會貼齊牆頂；-.02 讓簷口列不被掃描線吃掉）
  const tops=(C,h)=>{const xW=R(C.W[0]),xS=R(C.S[0]),xE=R(C.E[0]);
    return {W:[xW,foot(C.W,C.S,xW)-h-.02],S:[xS,foot(C.W,C.S,xS)-h-.02],E:[xE,foot(C.S,C.E,xE)-h-.02],N:[R(C.N[0]),R(C.N[1])-h-.02]};};
  // 窗：外框 1px 上楣／下檻，玻璃，選配中挺／橫檔；夜光只畫玻璃
  const win=(g,ng,x,y,w,h,glass,trim,lit,opt)=>{opt=opt||{};
    rc(g,x,y-1,w,1,trim);rc(g,x,y+h,w,1,trim);rc(g,x,y,w,h,glass);
    if(opt.rail)rc(g,x,y+(h>>1),w,1,trim);
    if(opt.mull)rc(g,x+(w>>1),y,1,h,trim);
    if(lit&&ng){ng.fillStyle=opt.litCol||'#ffd98c';ng.fillRect(R(x),R(y),w,h);
      if(opt.rail){ng.fillStyle='rgba(60,40,20,.55)';ng.fillRect(R(x),R(y)+(h>>1),w,1);}
      if(opt.mull){ng.fillStyle='rgba(60,40,20,.55)';ng.fillRect(R(x)+(w>>1),R(y),1,h);}}};
  // 煙囪：立在屋脊上，左亮右暗，陶土煙囪帽
  const chimney=(g,x,y,w,h,brick,pots,antenna)=>{
    const bl=sh(brick,-6),br=sh(brick,-46);
    rc(g,x,y-h,w>>1,h,bl);rc(g,x+(w>>1),y-h,w-(w>>1),h,br);
    rc(g,x-1,y-h-1,w+2,1,'#4a423b');rc(g,x-1,y-h,w+2,1,sh(brick,-60));
    for(let i=0;i<pots;i++){const px=x+(pots===2?[0,w-1][i]:[0,(w>>1),w-1][i]);rc(g,px,y-h-3,1,2,i%2?'#a35a37':'#b8653e');rc(g,px,y-h-4,1,1,'#6b3f2a');}
    if(antenna){rc(g,x+w-1,y-h-9,1,6,'#3a3d44');rc(g,x+w-3,y-h-9,5,1,'#3a3d44');rc(g,x+w-2,y-h-7,3,1,'#3a3d44');}
  };
  return {sh,rc,poly,lineP,fy,foot,cols,wall,sub,mid,lerp,tops,win,chimney};
}

// 前庭：矮磚牆／樹籬／鐵欄、每戶小徑與門口、垃圾桶。zone 在 G0 的 [u0,u1]×[vFront,~.95]。
function frontGarden(ctx,T,opt){
  const {A,g,ng,G0,rand}=ctx,{sh,rc,fy,foot}=T;
  const P=(u,v)=>A.paraPt559(G0,u,v);
  const box=opt.box,vw=Math.min(.955,1-.045);           // 圍牆線
  if(box[3]>vw-.10)return;                              // 沒有前院
  const pa=P(box[0],vw),pb=P(box[1],vw);
  const gates=opt.doors.map(d=>d.u);
  const gateAt=x=>{for(const u of gates){const gx=P(u,vw)[0];if(Math.abs(x-gx)<=1)return true;}return false;};
  const houseOf=x=>{let best=0,bd=1e9;opt.doors.forEach((d,i)=>{const dd=Math.abs(P(d.u,vw)[0]-x);if(dd<bd){bd=dd;best=i;}});return best;};
  const x0=R(pa[0]),x1=R(pb[0]);
  for(let x=x0;x<=x1;x++){
    const y=foot(pa,pb,x);if(gateAt(x))continue;
    const h=opt.doors[houseOf(x)].fence;              // 0 樹籬 1 鐵欄 2 矮牆
    rc(g,x,y,1,1,'rgba(16,22,18,.38)');
    if(h===0){rc(g,x,y-2,1,2,opt.brick);rc(g,x,y-3,1,1,'#cbc2b0');
      const hh=3+((x*7)%3===0?1:0);rc(g,x,y-3-hh,1,hh,'#37602f');rc(g,x,y-3-hh,1,1,'#4f8542');}
    else if(h===1){rc(g,x,y-1,1,1,opt.brick);rc(g,x,y-2,1,1,'#b9b0a0');
      if((x-x0)%2===0)rc(g,x,y-5,1,3,'#2b2b31');rc(g,x,y-4,1,1,'#2b2b31');}
    else{rc(g,x,y-3,1,3,opt.brick);rc(g,x,y-4,1,1,'#cbc2b0');}
  }
  // 小徑：門腳 → 大門（每格 v 深度 = 16*bh 列，x 每列 -2）
  for(const d of opt.doors){
    const gp=P(d.u,vw),n=Math.max(1,R(gp[1]-d.y));
    for(let k=0;k<=n;k++){rc(g,d.x-1-2*k,d.y+k,3,1,k%2?'#c9c1ae':'#bfb6a3');}
    rc(g,d.x-1,d.y,3,1,'#d8d0bd');                      // 門階
    if(d.bin){rc(g,d.x+3,d.y+1,2,3,d.binCol);rc(g,d.x+3,d.y,2,1,sh(d.binCol,26));}
    if(ng&&d.litDoor){ng.fillStyle='rgba(255,214,140,.30)';ng.fillRect(d.x-2,d.y,5,2);}
  }
}

// ---------------------------------------------------------------- ukTerrace
REG.ukTerrace={name:'ukTerrace',draw(ctx){
  const T=tools(ctx),{A,g,ng,G,G0,rand,v,bw,bh,span,k,lv,ar}=ctx,{sh,rc,poly,lineP,fy,foot,cols,wall,sub,mid,lerp,tops,win,chimney}=T;
  const fh=span>=2?9:8,wallH=fh*2+1;                    // 兩層＋簷溝列
  const LX=G.S[0]-G.W[0],DX=G.N[0]-G.W[0];
  const nRows=clampN(R(DX/32/.72),1,3);                 // 深街區：背靠背多排（M 形屋頂），每排約 20–30px 深
  const stock=(v%2===0);
  const base=stock?['#b59c6a','#ad9668','#bea472'][v%3]:['#a0563f','#984f3b','#a85d45'][v%3];
  const slateF='#66717f',slateB='#444c58',ridgeC='#8791a0',trimF='#efe6d2',trimR='#b7ae9c',glassF='#546878',glassR='#3e4c58';
  const DOORS=['#1b1b20','#20407a','#8c2020','#25562f','#e6e0d0','#5a2a5c'];
  const PAINT=['#e6dfcd','#d9dfe6','#ead9cf'];
  const doorsOut=[];
  const nH=Math.max(1,R(LX/16));
  const villa=(k===1&&lv===1&&bw*bh<=4&&(Math.abs(v)%3)===0);
  for(let r=0;r<nRows;r++){
    const C=sub(G,0,1,r/nRows,(r+1)/nRows),isFront=(r===nRows-1);
    const Ct=tops(C,wallH),dxRow=C.N[0]-C.W[0];
    const rise=clampN(R(dxRow*.38),7,12);
    const f=mid(Ct.W,Ct.N);f[1]-=rise;const b=mid(Ct.S,Ct.E);b[1]-=rise;
    const endBrick=sh(base,-46);
    // 端牆（背光）＋山牆
    wall(g,C.S,C.E,wallH,endBrick);
    rc(g,R(C.S[0]),foot(C.W,C.S,R(C.S[0]))-wallH,1,wallH,sh(base,-30));   // 轉角柱
    cols(C.S,C.E,(x,y)=>{rc(g,x,y-1,1,1,sh(endBrick,-16));});                 // 勒腳
    {const xp=R(C.S[0])+2;rc(g,xp,foot(C.S,C.E,xp)-wallH+1,1,wallH-1,'#3e4249');}   // 端牆落水管
    if(rand()<.5){const p=lerp(C.S,C.E,.5);const x=R(p[0])-1,y=foot(C.S,C.E,R(p[0]));win(g,ng,x,y-fh-5,2,3,glassR,trimR,rand()<.4);}
    // 屋頂：背坡→山牆三角→前坡→石板橫縫→屋脊→封簷
    poly(g,[Ct.N,Ct.E,b,f],slateB);
    poly(g,[Ct.S,Ct.E,b],endBrick);
    poly(g,[Ct.W,Ct.S,b,f],slateF);
    for(const s of[.34,.68]){lineP(g,lerp(Ct.W,f,s),lerp(Ct.S,b,s),'#5b6572');}
    lineP(g,f,b,ridgeC);lineP(g,Ct.S,b,sh(slateF,18));
    // 正面（只有前排看得到）
    if(isFront){
      const hw=LX/nH;
      for(let i=0;i<nH;i++){
        const xs=C.W[0]+hw*i,xi0=R(xs),xi1=R(xs+hw)-1;
        const painted=rand()<.11;
        const bcol=painted?PAINT[(rand()*3)|0]:sh(base,R((rand()-.5)*16));
        const door=DOORS[(rand()*DOORS.length)|0];
        const trim=painted?'#f6f1e6':trimF;
        for(let x=xi0;x<=xi1;x++){const y=foot(C.W,C.S,x);
          rc(g,x,y-wallH,1,wallH,bcol);
          rc(g,x,y-wallH,1,1,'#3f444b');                        // 簷溝
          rc(g,x,y-wallH+1,1,1,sh(bcol,22));                     // 簷口線
          rc(g,x,y-fh-1,1,1,painted?sh(bcol,-14):sh(bcol,20));    // 樓層腰線
          rc(g,x,y-1,1,1,sh(bcol,-26));                          // 勒腳
        }
        // 門（左）：扇形窗＋門色
        const dx=xi0+2,dy=foot(C.W,C.S,dx+1);
        rc(g,dx-1,dy-fh,5,1,trim);                               // 門楣
        rc(g,dx,dy-fh+1,3,1,'#93a8b8');                          // 扇形窗
        rc(g,dx,dy-fh+2,3,fh-2,door);
        rc(g,dx+2,dy-3,1,1,sh(door,50));                         // 門把
        const litDoor=rand()<.55;
        if(ng&&litDoor){ng.fillStyle='#ffd27a';ng.fillRect(dx,dy-fh+1,3,1);}
        // 樓上窗：門上 3 寬、凸窗上 5 寬（推拉窗：橫檔）
        const wy=dy-wallH+3,uh=fh-4;                             // 簷口下留一列磚
        win(g,ng,dx,wy,3,uh,glassF,trim,rand()<.42,{rail:1});
        const bx=xi1-6;                                           // 凸窗牆柱 [bx,bx+4]
        const by=foot(C.W,C.S,bx+2);
        win(g,ng,bx,by-wallH+3,5,uh,glassF,trim,rand()<.42,{rail:1,mull:1});
        // 一樓凸窗：向路面凸出 2px（-2,+1），自帶小屋頂與側面
        const bf=by+1;
        rc(g,bx-2,bf-fh+1,5,fh-1,bcol);
        rc(g,bx-2,bf-fh+1,5,1,'#8f98a2');rc(g,bx-1,bf-fh,6,1,'#a9b2bb');  // 鉛皮小屋頂兩級
        win(g,ng,bx-2,bf-fh+3,5,fh-5,glassF,trim,rand()<.5,{mull:1});
        rc(g,bx-2,bf-1,5,1,sh(bcol,-26));
        rc(g,bx+3,bf-fh+1,1,fh-1,sh(bcol,-40));rc(g,bx+4,bf-fh,1,fh-1,sh(bcol,-40));  // 凸窗側面
        rc(g,bx-2,bf,5,1,'rgba(16,22,18,.45)');rc(g,bx+3,bf,2,1,'rgba(16,22,18,.45)');
        // 落水管：每兩戶一支
        if(i%2===1){rc(g,xi0,foot(C.W,C.S,xi0)-wallH+1,1,wallH-1,'#4b5058');}
        // 天窗：前坡上、戶中央，三成
        if(rand()<.3){const t=(i+.5)/nH,e=lerp(Ct.W,Ct.S,t),rp=lerp(f,b,t),d=lerp(e,rp,.42);
          const x=R(d[0])-2,y=R(d[1]);rc(g,x,y-4,4,4,sh(bcol,-4));rc(g,x-1,y-5,6,1,'#7f8a97');rc(g,x,y-4,4,1,'#8f98a2');
          rc(g,x+1,y-3,2,2,glassF);if(ng&&rand()<.4){ng.fillStyle='#ffd98c';ng.fillRect(x+1,y-3,2,2);}}
        // 前庭資料
        const uDoor=(ar&&ar.box)?ar.box[0]+((dx+1-G.W[0])/LX)*(ar.box[1]-ar.box[0]):0;
        doorsOut.push({u:uDoor,x:dx+1,y:dy,fence:rand()<.45?0:(rand()<.6?1:2),bin:rand()<.55,binCol:rand()<.5?'#3d473d':'#4a4f57',litDoor});
      }
      // 正面左端牆角：前坡左緣
      lineP(g,Ct.W,f,sh(slateF,10));
    }
    // 煙囪：每兩戶共牆一座；端牆上也有
    const nStack=Math.max(1,Math.floor(nH/2)+1);
    for(let j=0;j<=Math.floor(nH/2);j++){
      const t=Math.min(1,(2*j)/nH);
      if(nH===1&&j>0)break;
      const rp=lerp(f,b,t);const pots=2+((rand()<.4)?1:0),sw=pots===3?5:4;
      chimney(g,R(rp[0])-(sw>>1),R(rp[1])+2,sw,7,base,pots,rand()<.35);
    }
    void nStack;
  }
  if(!villa&&ar&&ar.box&&doorsOut.length)frontGarden(ctx,T,{box:ar.box,doors:doorsOut,brick:sh(base,-14)});
  return {pitch:true};
}};

// ---------------------------------------------------------------- ukSemi
// 1930 年代半獨立屋：兩戶鏡像成一對（[凸窗][門][門][凸窗]），四坡陶瓦屋頂、上層粉刷下層紅磚、兩層凸窗、門廊小雨遮，
// 對與對之間留 3px 車道縫；煙囪在對中央屋脊；街區右側 u>.80 的空地是側邊車道＋車。
REG.ukSemi={name:'ukSemi',draw(ctx){
  const T=tools(ctx),{A,g,ng,G,G0,rand,v,bw,bh,span,k,lv,ar}=ctx,{sh,rc,poly,lineP,fy,foot,cols,wall,sub,mid,lerp,tops,win,chimney}=T;
  const fh=span>=2?9:8,wallH=fh*2+1;
  const LX=G.S[0]-G.W[0],DX=G.N[0]-G.W[0];
  const nRows=clampN(R(DX/32/.72),1,3);
  const brick=['#a4523f','#9c4d3c','#ad5a44'][v%3];
  const RENDER=['#e9e3d6','#e2d8c2','#d8d3c6','#ece7dd'];
  const tileF='#c26a44',tileB='#8a482e',tileH='#a4573a',ridgeC='#d68a63';
  const DOORS=['#1f2a45','#8c2020','#25562f','#e6e0d0','#2b2b2f','#6a4a2a'];
  const glassF='#5b6d7c',glassR='#3e4c58',trimB='#efe6d2',trimW='#8f8b83';
  const gap=4,doorsOut=[];
  const villa=(k===1&&lv===1&&bw*bh<=4&&(Math.abs(v)%3)===0);
  const nP=Math.max(1,R((LX+gap)/(24+gap)));           // 每對 21–27px（每戶 11–13px）
  const pw=(LX-gap*(nP-1))/nP;
  for(let r=0;r<nRows;r++){
    const C=sub(G,0,1,r/nRows,(r+1)/nRows),isFront=(r===nRows-1);
    const dxRow=C.N[0]-C.W[0],rise=clampN(R(dxRow*.36),6,11);
    for(let p=0;p<nP;p++){
      const xs=C.W[0]+(pw+gap)*p,ua=(xs-C.W[0])/LX,ub=(xs+pw-C.W[0])/LX;
      const Cp=sub(C,ua,ub,0,1),Ct=tops(Cp,wallH);
      const render=RENDER[(rand()*RENDER.length)|0],tudor=rand()<.35;
      const bcol=sh(brick,R((rand()-.5)*10));
      const xi0=R(Cp.W[0]),xi1=R(Cp.S[0])-1;
      // 端牆（背光）：下磚上粉刷
      wall(g,Cp.S,Cp.E,wallH,sh(render,-62));
      cols(Cp.S,Cp.E,(x,y)=>{rc(g,x,y-fh,1,fh,sh(bcol,-44));rc(g,x,y-1,1,1,sh(bcol,-58));rc(g,x,y-wallH,1,1,'#3a3d43');});
      if(rand()<.5){const q=lerp(Cp.S,Cp.E,.5);const x=R(q[0])-1,y=foot(Cp.S,Cp.E,R(q[0]));win(g,ng,x,y-wallH+4,2,3,glassR,sh(trimW,-30),rand()<.4);}
      // 四坡屋頂
      const fm=mid(Ct.W,Ct.N),bm=mid(Ct.S,Ct.E),hipT=clampN(dxRow*.4/Math.max(8,pw),.12,.38);
      const f=lerp(fm,bm,hipT);f[1]-=rise;const b=lerp(fm,bm,1-hipT);b[1]-=rise;
      poly(g,[Ct.N,Ct.E,b,f],tileB);
      poly(g,[Ct.S,Ct.E,b],tileH);
      poly(g,[Ct.W,Ct.S,b,f],tileF);
      for(const s of[.36,.7]){lineP(g,lerp(Ct.W,f,s),lerp(Ct.S,b,s),sh(tileF,-22));}
      lineP(g,f,b,ridgeC);lineP(g,Ct.S,b,sh(tileF,16));lineP(g,Ct.W,f,sh(tileF,10));
      // 正面
      if(isFront){
        const hw=pw/2;
        for(let x=xi0;x<=xi1;x++){const y=foot(Cp.W,Cp.S,x);
          rc(g,x,y-wallH,1,wallH,render);
          rc(g,x,y-fh,1,fh,bcol);
          rc(g,x,y-wallH,1,1,'#4a4e55');                        // 簷溝
          rc(g,x,y-fh-1,1,1,sh(render,-34));                     // 粉刷下緣陰影
          rc(g,x,y-1,1,1,sh(bcol,-28));                          // 勒腳
        }
        // 兩戶鏡像：h=0 左戶（凸窗左、門右），h=1 右戶（門左、凸窗右）
        for(let h=0;h<2;h++){
          const bx=h===0?xi0+1:xi1-5;                             // 凸窗牆柱 [bx,bx+4]
          const dx=h===0?xi0+R(hw)-4:xi0+R(hw)+1;                 // 門 [dx,dx+2]
          const door=DOORS[(rand()*DOORS.length)|0];
          // 兩層凸窗：向路面凸 2px
          const bf=foot(Cp.W,Cp.S,bx+2)+1,topY=bf-wallH+1;
          const uc=tudor?'#f1ece2':render;
          rc(g,bx-2,topY,5,wallH-1,uc);
          rc(g,bx-2,bf-fh,5,fh,bcol);
          rc(g,bx-2,bf-fh-1,5,1,sh(uc,-34));
          rc(g,bx-2,bf-1,5,1,sh(bcol,-28));
          rc(g,bx-2,topY-1,5,1,sh(tileF,-6));rc(g,bx-2,topY,5,1,sh(tileF,-28));   // 凸窗小屋頂（承接主屋簷）
          if(tudor){rc(g,bx-2,topY+1,1,fh-2,'#2c2622');rc(g,bx+2,topY+1,1,fh-2,'#2c2622');rc(g,bx-2,topY+1,5,1,'#2c2622');}
          win(g,ng,bx-1,topY+3,3,fh-5,glassF,tudor?'#2c2622':trimW,rand()<.42,{});
          win(g,ng,bx-2,bf-fh+2,5,fh-5,glassF,trimB,rand()<.5,{mull:1});
          rc(g,bx+3,topY,1,wallH-1,sh(uc,-52));rc(g,bx+4,topY-1,1,wallH-1,sh(uc,-52));   // 凸窗側面
          rc(g,bx+3,bf-fh,1,fh,sh(bcol,-46));rc(g,bx+4,bf-fh-1,1,fh,sh(bcol,-46));
          rc(g,bx-2,bf,5,1,'rgba(16,22,18,.45)');rc(g,bx+3,bf,2,1,'rgba(16,22,18,.45)');
          // 門＋門廊雨遮
          const dy=foot(Cp.W,Cp.S,dx+1);
          rc(g,dx-1,dy-fh,5,1,'#cfcbc2');rc(g,dx-1,dy-fh+1,5,1,sh(bcol,-24));
          rc(g,dx,dy-fh+2,3,1,'#93a8b8');rc(g,dx,dy-fh+3,3,fh-3,door);rc(g,dx+(h?0:2),dy-3,1,1,sh(door,50));
          const litDoor=rand()<.5;
          if(ng&&litDoor){ng.fillStyle='#ffd27a';ng.fillRect(dx,dy-fh+2,3,1);ng.fillStyle='rgba(255,220,150,.35)';ng.fillRect(dx-1,dy-fh+1,5,1);}
          // 門上樓上窗
          win(g,ng,dx,dy-wallH+3,3,fh-4,glassF,trimW,rand()<.4,{});
          const uDoor=(ar&&ar.box)?ar.box[0]+((dx+1-G.W[0])/LX)*(ar.box[1]-ar.box[0]):0;
          doorsOut.push({u:uDoor,x:dx+1,y:dy,fence:rand()<.7?0:2,bin:rand()<.4,binCol:rand()<.5?'#3d473d':'#4a4f57',litDoor});
        }
        // 對與對之間的車道縫：短車道往路面
        if(p<nP-1){const gx=xi1+1,gy=foot(Cp.W,Cp.S,xi1+1);
          for(let s=1;s<=4;s++)rc(g,gx-2*s,gy+s,3,1,s%2?'#8d8c86':'#96958f');}
      }
      // 煙囪：對中央屋脊
      const rp=lerp(f,b,.5);chimney(g,R(rp[0])-2,R(rp[1])+2,4,6,bcol,2,rand()<.3);
    }
  }
  // 側邊車道＋車（u>.80 的空地），只在原型真的留了空地時
  if(!villa&&ar&&ar.box&&ar.box[1]<=.84){
    const P=(u,vv)=>A.paraPt559(G0,u,vv);
    const u0=ar.box[1]+.015,u1=Math.min(.97,u0+.11);
    poly(g,[P(u0,.50),P(u1,.50),P(u1,.965),P(u0,.965)],'#83827c');
    lineP(g,P(u0,.50),P(u0,.965),'#5f5e59');lineP(g,P(u1,.50),P(u1,.965),'#9a9993');
    if(rand()<.85){const c=P((u0+u1)/2,.78),x=R(c[0])-3,y=R(c[1]);
      const col=['#b4544a','#3f6f9a','#c9c9c4','#4d7f56','#2f3238'][(rand()*5)|0];
      rc(g,x,y-3,7,3,col);rc(g,x+1,y-5,4,2,sh(col,20));rc(g,x+2,y-5,2,1,'#9fc4d8');rc(g,x+5,y-4,1,1,'#9fc4d8');
      rc(g,x+6,y-3,1,3,sh(col,-36));rc(g,x+1,y,1,1,'#221f1c');rc(g,x+5,y,1,1,'#221f1c');rc(g,x,y+1,8,1,'rgba(16,22,18,.30)');}
  }
  if(!villa&&ar&&ar.box&&doorsOut.length)frontGarden(ctx,T,{box:ar.box,doors:doorsOut,brick:sh(brick,-14)});
  return {pitch:true};
}};
})();
