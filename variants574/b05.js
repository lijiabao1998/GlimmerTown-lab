(window.__variants574=window.__variants574||[]).push(function b05(A){
  const SPR=A.SPR(), B=SPR.bld;
  const cv=A.cv, shade=A.shade;

  /* ================= 共用像素工具（全整數、零共用亂數） ================= */
  const R=(k,v)=>A.metroRand516('v574:'+k+':'+v);
  const rect=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  // 掃描線多邊形：像素中心取樣，無反鋸齒
  function poly(g,pts,col){
    let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    g.fillStyle=col;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){
      const yc=y+.5,xs=[];
      for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
        if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const x0=Math.ceil(xs[i]-.5),x1=Math.ceil(xs[i+1]-.5);if(x1>x0)g.fillRect(x0,y,x1-x0,1);}
    }
  }
  function ln(g,x0,y0,x1,y1,col){
    x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
    g.fillStyle=col;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
    for(let n=0;n<2000;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
  }
  function ring(g,cx,cy,r,col){ // 中點圓
    g.fillStyle=col;let x=r,y=0,e=1-r;
    while(x>=y){for(const[p,q]of[[x,y],[y,x],[-y,x],[-x,y],[-x,-y],[-y,-x],[y,-x],[x,-y]])g.fillRect(cx+p,cy+q,1,1);
      y++;if(e<0)e+=2*y+1;else{x--;e+=2*(y-x)+1;}}
  }
  // 等距局部座標：以南角 (cx,by) 為原點，p 往左（西）面、q 往右（東）面、z 往上
  const Qf=(cx,by)=>(p,q,z)=>[cx-p+q,by-(p+q)/2-(z||0)];
  // 方盒（逐欄填色，與 isoBox 同一套欄位法）；a=左面長 b=右面長（偶數）
  function box(g,cx,by,a,b,h,cL,cR,cT,opt){
    opt=opt||{};cx=Math.round(cx);by=Math.round(by);
    g.fillStyle=cL;for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-h,1,h);}
    g.fillStyle=cR;for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-h,1,h);}
    if(!opt.noAO){g.fillStyle='rgba(0,0,0,.13)';
      for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-3,1,3);}
      for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-3,1,3);}}
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(cx,by-h,1,h);
    if(cT){const lt=shade(cT,16),dk=shade(cT,-26);
      for(let d=-a;d<b;d++){
        const low=(d<0?by-((-d)>>1):by-((d+1)>>1))-h-1,e=d-(b-a);
        const up=by-h-((a+b)>>1)+(e<0?((-e+1)>>1)-1:(e>>1));
        if(low<up)continue;
        g.fillStyle=cT;g.fillRect(cx+d,up,1,low-up+1);
        g.fillStyle=lt;g.fillRect(cx+d,up,1,1);
        if(low>up){g.fillStyle=dk;g.fillRect(cx+d,low,1,1);}
      }}
    return by-h;
  }
  // 窗（沿兩面階梯排列的直立矩形，同 windows() 語彙）
  function wins(g,ng,cx,by,a,b,h,rk,o){
    o=Object.assign({w:3,ht:5,gx:6,gy:8,glass:'#3a4a5a',lit:'#ffe9c0',p:.45,top:4,bot:3,mL:4,mR:3,L:true,R:true,kind:'rect',trim:'#e8e0d0',z0:0},o||{});
    const put=(x,y)=>{
      if(o.kind==='arch'){A.winShape570(g,ng,x,y,o.w,o.ht,'arch',o.glass,o.lit,o.trim,rk()<o.p);return;}
      g.fillStyle=o.glass;g.fillRect(x,y,o.w,o.ht);
      g.fillStyle='rgba(255,255,255,.28)';g.fillRect(x,y,o.w,1);
      if(o.metro){g.fillStyle='rgba(255,255,255,.30)';g.fillRect(x,y+o.ht,o.w,1);}
      g.fillStyle='rgba(15,21,35,.45)';if(o.w>=3)g.fillRect(x+(o.w>>1),y,1,o.ht);if(o.ht>=5)g.fillRect(x,y+(o.ht>>1),o.w,1);
      if(rk()<o.p&&ng){ng.fillStyle=o.lit;ng.fillRect(x,y,o.w,o.ht);ng.fillStyle='rgba(96,64,22,.55)';if(o.w>=3)ng.fillRect(x+(o.w>>1),y,1,o.ht);if(o.ht>=5)ng.fillRect(x,y+(o.ht>>1),o.w,1);}
    };
    const b0=by-o.z0;
    if(o.R)for(let dx=o.mR;dx<=b-o.w-2;dx+=o.gx){const yF=b0-((dx+1)>>1);for(let y=yF-h+o.top;y<=yF-o.ht-o.bot;y+=o.gy)put(cx+dx,y);}
    if(o.L)for(let dx=o.mL;dx<=a-2;dx+=o.gx){const yF=b0-(dx>>1);for(let y=yF-h+o.top;y<=yF-o.ht-o.bot;y+=o.gy)put(cx-dx-o.w+1,y);}
  }
  // 圖層：結構畫在獨立畫布、描外框後再合成；夜層同步
  function layer(W,H){const[c,g]=cv(W,H),[nc,ng]=cv(W,H);return{c,g,nc,ng,W,H};}
  function mk(k,pl,pt,pr,pb){
    const s=B[k+'_1_0'];pl=pl|0;pt=pt|0;pr=pr|0;pb=pb|0;
    const W=s.img.width+pl+pr,H=s.img.height+pt+pb;
    const[c,g]=cv(W,H),[nc,ng]=cv(W,H);
    g.drawImage(s.img,pl,pt);if(s.night)ng.drawImage(s.night,pl,pt);
    return{s,c,g,nc,ng,W,H,pl,pt,ax:s.ax+pl,ay:s.ay+pt,hasN:!!s.night};
  }
  function fin(o){return{img:o.c,night:o.hasN?o.nc:undefined,ax:o.ax,ay:o.ay,w:o.W,h:o.H,smoke:[]};}
  // 合成圖層：日層蓋上、日層實體像素下方的舊夜光清掉（不准透光）、再疊新夜光
  function stamp(o,L,ol){
    if(ol)A.outlineSprite(L.c,ol[0],ol[1],ol[2]);
    o.g.drawImage(L.c,0,0);
    const ld=L.c.getContext('2d').getImageData(0,0,L.W,L.H).data;
    const N=o.ng.getImageData(0,0,o.W,o.H),nd=N.data;
    for(let i=0;i<ld.length;i+=4)if(ld[i+3]>200)nd[i+3]=0;
    o.ng.putImageData(N,0,0);
    o.ng.drawImage(L.nc,0,0);
  }
  // 把 v0 的前景部件按遮罩原樣蓋回（日夜同遮罩）
  function restamp(o,test){
    const s=o.s,W=s.img.width,H=s.img.height;
    const sd=s.img.getContext('2d').getImageData(0,0,W,H).data;
    const sn=s.night?s.night.getContext('2d').getImageData(0,0,W,H).data:null;
    const D=o.g.getImageData(0,0,o.W,o.H),dd=D.data,N=o.ng.getImageData(0,0,o.W,o.H),nd=N.data;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;
      if(!test(x,y,sd[i],sd[i+1],sd[i+2],sd[i+3]))continue;
      const j=((y+o.pt)*o.W+(x+o.pl))*4;
      for(let q=0;q<4;q++)dd[j+q]=sd[i+q];
      if(sn){for(let q=0;q<4;q++)nd[j+q]=sn[i+q];}else nd[j+3]=0;}
    o.g.putImageData(D,0,0);o.ng.putImageData(N,0,0);
  }
  // 方盒剪影測試（含 1px 外框），南角 (cx,by)、a/b/h
  function inBox(x,y,cx,by,a,b,h,m){
    m=m===undefined?1:m;const d=x-cx;
    if(d<-a-m||d>b-1+m)return false;
    const dd=Math.max(-a,Math.min(b-1,d));
    const bot=(dd<0?by-((-dd)>>1):by-((dd+1)>>1))-1+m;
    const e=dd-(b-a),top=by-h-((a+b)>>1)+(e<0?((-e+1)>>1)-1:(e>>1))-m;
    return y>=top&&y<=bot;
  }
  // 接地影：只落在已有地面像素上（source-atop），光從左 ⇒ 影往右
  function shadowPoly(o,pts,alpha){
    const[t,tg]=cv(o.W,o.H);poly(tg,pts,'rgba(18,22,32,'+(alpha||.22)+')');
    o.g.save();o.g.globalCompositeOperation='source-atop';o.g.drawImage(t,0,0);o.g.restore();
  }
  const OL=[26,30,44];
  // 都會量體（沿用 metroFacade516 的立面語彙，但所有條帶都裁進量體剪影，不外溢成雜點）
  function mbox(o,cx,by,a,b,h,pal,rk,opt){
    opt=opt||{};
    const T=layer(o.W,o.H),g=T.g,ng=T.ng,gx=opt.gx||6,gy=opt.gy||7;
    box(g,cx,by,a,b,h,pal.light,pal.dark,opt.roof||pal.roof);
    if(h>=12)wins(g,ng,cx,by,a,b,h,rk,{w:3,ht:opt.wh||5,gx,gy,glass:opt.glass||pal.glass,lit:pal.lit,p:opt.litP||.54,top:3,bot:opt.shop?12:3,mL:4,mR:2,metro:true});
    g.fillStyle='rgba(12,19,31,.22)';for(let y=by-h+gy;y<by-3;y+=gy)g.fillRect(cx-a+3,y,a+b-6,1);
    g.fillStyle='rgba(236,245,250,.18)';for(let x=cx-a+5;x<cx+b-4;x+=Math.max(6,gx+1))g.fillRect(x,by-h+2,1,h-4);
    if(opt.balcony){for(let y=by-h+9;y<by-7;y+=9){g.fillStyle=shade(pal.light,18);g.fillRect(cx-a+4,y,a-5,2);g.fillStyle=shade(pal.mid,-24);g.fillRect(cx+2,y-1,b-6,2);}}
    if(opt.shop){ // 沿牆斜率逐欄的店面帶（v574 修：原平面矩形在尖角外露成楔形）
      for(let dx=2;dx<=a-1;dx++){const yF=by-(dx>>1);g.fillStyle=pal.accent;g.fillRect(cx-dx,yF-11,1,2);g.fillStyle='#17243a';g.fillRect(cx-dx,yF-9,1,5);
        ng.fillStyle=shade(pal.accent,28);ng.fillRect(cx-dx,yF-11,1,2);if((dx>>2)%3!==2){ng.fillStyle='rgba(255,236,190,.78)';ng.fillRect(cx-dx,yF-8,1,3);}}
      for(let dx=1;dx<b-1;dx++){const yF=by-((dx+1)>>1);g.fillStyle=shade(pal.accent,-30);g.fillRect(cx+dx,yF-11,1,2);g.fillStyle='#101a2c';g.fillRect(cx+dx,yF-9,1,5);
        if((dx>>2)%3!==1){ng.fillStyle='rgba(255,226,170,.6)';ng.fillRect(cx+dx,yF-8,1,3);}}
    }
    if(opt.band){g.fillStyle=opt.band;for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-h+2,1,2);}
      g.fillStyle=shade(opt.band,-40);for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-h+2,1,2);}}
    // 裁切合成
    const x0=Math.max(0,cx-a-1),x1=Math.min(o.W-1,cx+b+1),y0=Math.max(0,by-h-((a+b)>>1)-1),y1=Math.min(o.H-1,by+1),w=x1-x0+1,hh=y1-y0+1;
    const td=g.getImageData(x0,y0,w,hh).data,tn=ng.getImageData(x0,y0,w,hh).data;
    const D=o.g.getImageData(x0,y0,w,hh),dd=D.data,N=o.ng.getImageData(x0,y0,w,hh),nd=N.data;
    for(let y=0;y<hh;y++)for(let x=0;x<w;x++){
      if(!inBox(x+x0,y+y0,cx,by,a,b,h,0))continue;const i=(y*w+x)*4;if(td[i+3]<200)continue;
      for(let q=0;q<4;q++){dd[i+q]=td[i+q];nd[i+q]=tn[i+q];}}
    o.g.putImageData(D,x0,y0);o.ng.putImageData(N,x0,y0);
    return by-h;
  }
  // T541 夜窗暖暈（同一套規則：只塗白天實體像素）
  function halo541(o){
    const W=o.W,H=o.H,dd=o.g.getImageData(0,0,W,H).data,N=o.ng.getImageData(0,0,W,H),nn=N.data;
    const litAt=i=>{if(nn[i+3]<=40)return false;const r=nn[i],g2=nn[i+1],b=nn[i+2];return r>200&&g2>170&&b>80&&r>=g2-8;};
    const extra=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(!litAt(i))continue;
      nn[i]=255;nn[i+1]=251;nn[i+2]=229;if(nn[i+3]<220)nn[i+3]=255;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;
        const j=(yy*W+xx)*4;if(dd[j+3]<=40)continue;if(litAt(j))continue;extra.push(j);}}
    for(const j of extra){if(nn[j+3]>40&&litAt(j))continue;nn[j]=255;nn[j+1]=236;nn[j+2]=170;nn[j+3]=Math.max(nn[j+3],108);}
    o.ng.putImageData(N,0,0);
  }
  const tree=(g,x,y)=>{rect(g,x,y-3,1,3,'#5b412e');rect(g,x-2,y-7,5,4,'#3d7743');rect(g,x-1,y-8,3,1,'#4f8a50');rect(g,x-2,y-7,2,1,'#5a9a5c');};
  function metroBase(pal,rk,shop){
    const W=304,H=470,[c,g]=cv(W,H),[nc,ng]=cv(W,H),o={c,g,nc,ng,W,H,ax:152,ay:466,hasN:true,pl:0,pt:0};
    const pc='#81858a';A.dia(g,152,370,96,pc);A.diaEdge(g,6,shade(pc,-20),152,370,96);A.diaEdge(g,9,shade(pc,12),152,370,96);
    mbox(o,152,463,88,88,22,pal,rk,{shop,gx:10,gy:10,litP:shop?.72:.54});
    return o;
  }
  const MP=(u,v,z)=>[152+u-v,370+(u+v)/2-(z||0)];

  /* ================= 1×1 小型設施 iso redraw 工具（v0 為平面立面圖 → 依同一佔地重畫） ================= */
  const yL=(by,dx)=>by-(dx>>1), yR=(by,dx)=>by-((dx+1)>>1);
  function fresh1(k){const s=B[k+'_1_0'],W=s.img.width,H=s.img.height,[c,g]=cv(W,H),[nc,ng]=cv(W,H);return{s,k,c,g,nc,ng,W,H,pl:0,pt:0,ax:s.ax,ay:s.ay,hasN:!!s.night};}
  function plate1(o,col,e6,e9){A.dia(o.g,o.ax,o.ay-32,32,col);A.diaEdge(o.g,6,e6,o.ax,o.ay-32,32);A.diaEdge(o.g,9,e9,o.ax,o.ay-32,32);}
  // 牆面斜切矩形（沿牆斜率逐欄）：'L' 欄 dx 由 1 起算、'R' 由 0 起算；S=該牆南角
  function fr(g,S,side,d0,w,z,h,col){S=[Math.round(S[0]),Math.round(S[1])];g.fillStyle=col;for(let i=0;i<w;i++){const dx=d0+i;if(side==='L')g.fillRect(S[0]-dx,yL(S[1],dx)-z-h,1,h);else g.fillRect(S[0]+dx,yR(S[1],dx)-z-h,1,h);}}
  function fw(g,ng,S,side,d0,w,z,h,glass,frame,lit,on){
    fr(g,S,side,d0,w,z,h,glass);fr(g,S,side,d0,w,z+h,1,frame);fr(g,S,side,d0,w,z-1,1,shade(frame,40));
    fr(g,S,side,d0,w,z+h-1,1,'rgba(255,255,255,.22)');
    if(on&&ng)fr(ng,S,side,d0,w,z,h,lit);
  }
  // 遮擋件：畫進暫存層→清掉其下的夜光→蓋上（前景柱、欄杆不透光）
  function occ(L,fn){const[t,tg]=cv(L.W,L.H);fn(tg);L.ng.save();L.ng.globalCompositeOperation='destination-out';L.ng.drawImage(t,0,0);L.ng.restore();L.g.drawImage(t,0,0);}
  // 屋頂（局部 Q）：牆體 p0..p0+a、q0..q0+b、牆頂 zt、脊高 r、出簷 e
  function roofGP(g,Q,p0,q0,a,b,zt,r,e,cLit,cBack,cWall,cEdge){ // 脊沿 p；山牆在 p0 端（右面）
    const qm=q0+b/2;
    poly(g,[Q(p0-e,qm,zt+r),Q(p0+a+e,qm,zt+r),Q(p0+a+e,q0+b+e,zt),Q(p0-e,q0+b+e,zt)],cBack);
    poly(g,[Q(p0,q0,zt),Q(p0,q0+b,zt),Q(p0,qm,zt+r-1)],cWall);
    poly(g,[Q(p0-e,q0-e,zt),Q(p0+a+e,q0-e,zt),Q(p0+a+e,qm,zt+r),Q(p0-e,qm,zt+r)],cLit);
    let u=Q(p0-e,q0-e,zt-1),v=Q(p0+a+e,q0-e,zt-1);ln(g,u[0],u[1],v[0],v[1],cEdge);
    u=Q(p0-e,q0-e,zt);v=Q(p0-e,qm,zt+r);ln(g,u[0],u[1],v[0],v[1],cEdge);
    u=Q(p0-e,q0+b+e,zt);ln(g,v[0],v[1],u[0],u[1],cEdge);
    u=Q(p0+a+e,qm,zt+r);ln(g,v[0],v[1],u[0],u[1],shade(cLit,26));
  }
  function roofGQ(g,Q,p0,q0,a,b,zt,r,e,cBackLit,cDark,cWall,cEdge){ // 脊沿 q；山牆在 q0 端（左面，受光）
    const pm=p0+a/2;
    poly(g,[Q(pm,q0-e,zt+r),Q(pm,q0+b+e,zt+r),Q(p0+a+e,q0+b+e,zt),Q(p0+a+e,q0-e,zt)],cBackLit);
    poly(g,[Q(p0,q0,zt),Q(p0+a,q0,zt),Q(pm,q0,zt+r-1)],cWall);
    poly(g,[Q(p0-e,q0-e,zt),Q(p0-e,q0+b+e,zt),Q(pm,q0+b+e,zt+r),Q(pm,q0-e,zt+r)],cDark);
    let u=Q(p0-e,q0-e,zt-1),v=Q(p0-e,q0+b+e,zt-1);ln(g,u[0],u[1],v[0],v[1],cEdge);
    u=Q(p0-e,q0-e,zt);v=Q(pm,q0-e,zt+r);ln(g,u[0],u[1],v[0],v[1],cEdge);
    u=Q(p0+a+e,q0-e,zt);ln(g,v[0],v[1],u[0],u[1],cEdge);
    u=Q(pm,q0+b+e,zt+r);ln(g,v[0],v[1],u[0],u[1],shade(cBackLit,20));
  }
  function roofHip(g,Q,p0,q0,a,b,zt,r,e,cLit,cDark,cBack,cEdge){ // 四坡；脊沿較長軸
    const qm=q0+b/2,pm=p0+a/2,P0=p0-e,P1=p0+a+e,Q0=q0-e,Q1=q0+b+e;let R1,R2;
    if(a>=b){R1=Q(p0+b/2,qm,zt+r);R2=Q(p0+a-b/2,qm,zt+r);
      poly(g,[Q(P0,Q1,zt),Q(P1,Q1,zt),R2,R1],cBack);poly(g,[Q(P1,Q0,zt),Q(P1,Q1,zt),R2],shade(cLit,-10));
      poly(g,[Q(P0,Q0,zt),Q(P0,Q1,zt),R1],cDark);poly(g,[Q(P0,Q0,zt),Q(P1,Q0,zt),R2,R1],cLit);}
    else{R1=Q(pm,q0+a/2,zt+r);R2=Q(pm,q0+b-a/2,zt+r);
      poly(g,[Q(P1,Q0,zt),Q(P1,Q1,zt),R2,R1],shade(cLit,-10));poly(g,[Q(P0,Q1,zt),Q(P1,Q1,zt),R2],cBack);
      poly(g,[Q(P0,Q0,zt),Q(P1,Q0,zt),R1],cLit);poly(g,[Q(P0,Q0,zt),Q(P0,Q1,zt),R2,R1],cDark);}
    let u=Q(P0,Q0,zt-1),v=Q(P1,Q0,zt-1);ln(g,u[0],u[1],v[0],v[1],cEdge);
    v=Q(P0,Q1,zt-1);ln(g,u[0],u[1],v[0],v[1],cEdge);
    u=Q(P0,Q0,zt);ln(g,u[0],u[1],R1[0],R1[1],shade(cLit,24));ln(g,R1[0],R1[1],R2[0],R2[1],shade(cLit,24));
  }
  // 同 polishAll526 式收尾：接地橢圓影、左緣受光右緣壓暗、細顆粒橫帶
  function polish1(o){
    const g=o.g,W=o.W,H=o.H;
    g.fillStyle='rgba(10,14,24,.16)';g.beginPath();g.ellipse(o.ax+8,o.ay-6,30,12,0,0,6.283);g.fill();
    const im=g.getImageData(0,0,W,H),d=im.data;
    for(let y=0;y<H;y++){let l=-1,r=-1;for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>40){if(l<0)l=x;r=x;}}
      if(l<0)continue;for(let x=l;x<Math.min(l+2,W);x++){const i=(y*W+x)*4;for(let q=0;q<3;q++)d[i+q]=Math.min(255,d[i+q]*1.14+12);}
      {const i=(y*W+r)*4;for(let q=0;q<3;q++)d[i+q]*=.88;}}
    for(let y=0;y<H;y++){const band=((H-2-y)%8===0);for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i+3]<=40)continue;
      if((((x>>1)+(y>>1))&3)===0){for(let q=0;q<3;q++)d[i+q]*=.955;}if(band){for(let q=0;q<3;q++)d[i+q]*=.93;}}}
    g.putImageData(im,0,0);
  }
  const post=(g,Q,p,q,z0,z1,c1,c2)=>{const a=Q(p,q,z0),b=Q(p,q,z1),x=Math.round(a[0]);rect(g,x-1,Math.round(b[1]),1,Math.round(a[1]-b[1]),c1);rect(g,x,Math.round(b[1]),1,Math.round(a[1]-b[1]),c2);};

  /* ================= k85 樂齡中心 (1×1；redraw) ================= */
  (function(){
    const k=85;if(!B[k+'_1_0'])return;
    const OL85=[58,52,38],WL='#d9c4a0',WR='#c0ab88',TRIM='#f0e2c8',GL='#7fb0d8',FR='#5a4a38',LIT='#ffd98a',
      RLit='#4f8056',RMid='#3e6a46',RDk='#2e5236',EDGE='#23402a',DOOR='#5a3a24',COL='#b09468';
    const flowers=(g,Q,p0,p1,q,z)=>{for(let p=p0,i=0;p<=p1;p+=3,i++){const f=Q(p,q,z);rect(g,f[0],f[1]-1,2,2,i%2?'#e05a72':'#ffb35a');rect(g,f[0]-1,f[1]+1,1,1,'#5a9a48');}};
    // v1：長簷平房——左牆整排木柱迴廊（單坡簷）＋山牆朝右＋前院花台、長椅、小樹
    try{const o=fresh1(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9aa07e','#878d6c','#aab08c');
      poly(o.g,[Q(16,0),Q(20,0),Q(20,9),Q(16,9)],'#c8c0b0');
      for(let q=2;q<9;q+=2){const a1=Q(16,q),a2=Q(20,q);ln(o.g,a1[0],a1[1],a2[0],a2[1],'#aaa292');}
      const p0=6,q0=16,a=24,b=14,h=15,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,WL,WR,null);
      fw(g,ng,S,'L',3,4,3,4,GL,FR,LIT,rk()<.65);
      fw(g,ng,S,'L',17,4,3,4,GL,FR,LIT,rk()<.65);
      fr(g,S,'L',10,5,1,8,DOOR);fr(g,S,'L',10,5,9,1,TRIM);fr(g,S,'L',12,1,1,8,'#6a4a30');
      fr(ng,S,'L',10,5,1,8,'rgba(255,217,138,.85)');
      fw(g,ng,S,'R',3,3,4,5,GL,FR,LIT,rk()<.5);fw(g,ng,S,'R',9,3,4,5,GL,FR,LIT,rk()<.5);
      fr(g,S,'L',1,a,8,2,'rgba(40,30,18,.16)');
      // 迴廊地台＋台階
      {const D=Q(5,10,0);box(g,D[0],D[1],26,6,2,'#bca27a','#96794f','#c9b088',{noAO:true});}
      {const D=Q(15,8,0);box(g,D[0],D[1],6,2,1,'#c8c0b0','#a8a090','#d4ccbc',{noAO:true});}
      // 單坡簷
      poly(g,[Q(4,9,11),Q(32,9,11),Q(32,16,14),Q(4,16,14)],'#b88e5a');
      for(let p=8;p<32;p+=4){const u=Q(p,9,11),v=Q(p,16,14);ln(g,u[0],u[1],v[0],v[1],'#9c7446');}
      {const u=Q(4,9,10),v=Q(32,9,10);ln(g,u[0],u[1],v[0],v[1],'#6a4a2c');const w=Q(4,16,14),x=Q(4,9,11);ln(g,x[0],x[1],w[0],w[1],'#6a4a2c');}
      // 主屋頂（山牆朝右）
      roofGP(g,Q,p0,q0,a,b,h,7,2,RLit,RDk,WR,EDGE);
      {const c=Q(p0,q0+b/2,h+3);rect(g,c[0]-1,c[1]-1,2,2,FR);}
      // 前景：迴廊柱、花台、長椅、樹
      occ(L,tg=>{for(const p of[6,13,20,27])post(tg,Q,p,10,1,10,'#c9ae80',COL);
        {const D=Q(22,3,0);box(tg,D[0],D[1],8,3,3,'#9a7a50','#7a5c38','#6a8a4a',{noAO:true});flowers(tg,Q,23,29,4,3);}
        {const s1=Q(8,5,3),s2=Q(13,5,3);ln(tg,s1[0],s1[1],s2[0],s2[1],'#8a6a42');ln(tg,s1[0],s1[1]-2,s2[0],s2[1]-2,'#6a4a2c');
          const l1=Q(9,5,0),l2=Q(12,5,0);rect(tg,l1[0],l1[1]-3,1,3,'#6a4a2c');rect(tg,l2[0],l2[1]-3,1,3,'#6a4a2c');}
        {const t=Q(2,27,0);tree(tg,t[0],t[1]);}});
      stamp(o,L,OL85);polish1(o);
      B[k+'_1_1']=fin(o);}catch(e){console.error('v574 k85 v1',e);}
    // v2：兩層照護樓——四坡綠頂、樓層腰線、入口雨庇＋沿牆無障礙坡道（扶手）、右側玻璃陽光房
    try{const o=fresh1(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9aa07e','#878d6c','#aab08c');
      const p0=10,q0=8,a=20,b=18,h=25,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,WL,WR,null);
      fr(g,S,'L',1,a,13,1,TRIM);fr(g,S,'R',0,b,13,1,shade(TRIM,-20));
      for(const d of[3,9,15])fw(g,ng,S,'L',d,3,16,5,GL,FR,LIT,rk()<.55);
      for(const d of[10,15])fw(g,ng,S,'L',d,3,5,5,GL,FR,LIT,rk()<.6);
      for(const d of[3,8,13])fw(g,ng,S,'R',d,3,16,5,GL,FR,LIT,rk()<.5);
      fr(g,S,'L',3,4,3,8,DOOR);fr(g,S,'L',3,4,11,1,TRIM);fr(ng,S,'L',3,4,3,8,'rgba(255,217,138,.85)');
      roofHip(g,Q,p0,q0,a,b,h,10,2,RLit,RDk,RMid,EDGE);
      // 入口雨庇
      poly(g,[Q(11,4,13),Q(18,4,13),Q(18,8,13),Q(11,8,13)],'#e8dcc4');
      {const u=Q(11,4,12),v=Q(18,4,12);ln(g,u[0],u[1],v[0],v[1],'#a89878');const w=Q(11,8,12);ln(g,u[0],u[1],w[0],w[1],'#8a7a5c');}
      // 陽光房（玻璃牆＋玻璃雙坡，脊沿 q）
      {const p1=2,q1=12,a1=8,b1=12,h1=9,S1=Q(p1,q1,0);
        box(g,S1[0],S1[1],a1,b1,h1,'#a8cfe0','#80aac0',null);
        fr(g,S1,'L',1,a1,0,2,'#e2dccf');fr(g,S1,'R',0,b1,0,2,'#bdb6a8');
        for(let d=1;d<=a1;d+=3)fr(g,S1,'L',d,1,2,h1-2,'#f2eee4');for(let d=0;d<b1;d+=3)fr(g,S1,'R',d,1,2,h1-2,'#d8d2c6');
        fr(g,S1,'L',1,a1,h1-1,1,'#f2eee4');fr(g,S1,'R',0,b1,h1-1,1,'#d8d2c6');
        for(let d=2;d<=a1;d+=3)fr(ng,S1,'L',d,2,2,h1-3,'rgba(255,217,138,.8)');
        for(let d=1;d<b1;d+=3)fr(ng,S1,'R',d,2,2,h1-3,'rgba(255,210,130,.62)');
        roofGQ(g,Q,p1,q1,a1,b1,h1,4,1,'#cfe6f0','#9cc2d4','#b8dcea','#e8e4da');
        const r0=Q(p1+a1/2,q1-1,h1+4),r1=Q(p1+a1/2,q1+b1+1,h1+4);ln(g,r0[0],r0[1],r1[0],r1[1],'#f4f2ea');}
      // 坡道＋平台＋扶手（前景）
      occ(L,tg=>{
        {const D=Q(11,3,0);box(tg,D[0],D[1],6,5,3,'#d6cebe','#b4ac9c','#cac2b2',{noAO:true});}
        poly(tg,[Q(17,3,0),Q(29,3,0),Q(17,3,3)],'#aca494');
        poly(tg,[Q(17,3,3),Q(29,3,0),Q(29,7,0),Q(17,7,3)],'#c8c0b0');
        {let u=Q(11,3,7),v=Q(17,3,7),w=Q(29,3,3);ln(tg,u[0],u[1],v[0],v[1],'#eeeae2');ln(tg,v[0],v[1],w[0],w[1],'#eeeae2');
          for(const[p,z]of[[11,3],[17,3],[23,1.5],[29,0]]){const t=Q(p,3,z),top=Q(p,3,p<=17?7:3+4*(29-p)/12);rect(tg,t[0],top[1]+1,1,Math.max(1,Math.round(t[1]-top[1]-1)),'#b8b4ac');}}
        flowers(tg,Q,20,29,9,0);
        {const t=Q(31,2,0);tree(tg,t[0],t[1]);}});
      stamp(o,L,OL85);polish1(o);
      B[k+'_1_2']=fin(o);}catch(e){console.error('v574 k85 v2',e);}
  })();

  // 牆面點陣圖樣（rows 由上而下；'x' 上色）
  function fpat(g,S,side,d0,z,rows,col){for(let r=0;r<rows.length;r++)for(let i=0;i<rows[r].length;i++)if(rows[r][i]==='x')fr(g,S,side,d0+i,1,z+rows.length-1-r,1,col);}
  const PAW=['.x.x.','x...x','.xxx.','.xxx.'],PAW5=['x.x.x','.....','.xxx.','xxxxx','.xxx.'];
  // 等距欄杆：沿 p（q 固定）或沿 q（p 固定）
  function fence(g,Q,p0,q0,p1,q1,col,pc){ // 實心木柵板帶（4px）＋每 3px 一道板縫；比細線柵欄乾淨、不成雜點
    poly(g,[Q(p0,q0,0),Q(p1,q1,0),Q(p1,q1,3),Q(p0,q0,3)],col);
    const n=Math.max(Math.abs(p1-p0),Math.abs(q1-q0));
    for(let i=2;i<n;i+=3){const t=i/n,a1=Q(p0+(p1-p0)*t,q0+(q1-q0)*t,0);rect(g,Math.round(a1[0]),Math.round(a1[1])-2,1,2,pc);}
    const u=Q(p0,q0,3),v=Q(p1,q1,3);ln(g,u[0],u[1],v[0],v[1],shade(col,14));
  }


  /* ================= k102 寵物醫院 (1×1；redraw) ================= */
  (function(){
    const k=102;if(!B[k+'_1_0'])return;
    const OL102=[60,60,48],WL='#f2f4f0',WR='#d6dad2',COR='#8a9a8a',CORd='#72827a',GRN='#4f9a58',GL='#7fb0d8',FR='#5a6a5a',LIT='#ffe9b0',DOOR='#5a3a24',BR='#8a6a42';
    const crossSign=(g,ng,x,y)=>{rect(g,x-4,y-8,9,8,GRN);rect(g,x-4,y-8,9,1,shade(GRN,24));rect(g,x-1,y-7,3,6,'#f2f4f0');rect(g,x-3,y-5,7,2,'#f2f4f0');
      if(ng){ng.fillStyle='#d0ffd8';ng.fillRect(x-4,y-8,9,8);ng.fillStyle='#ffffff';ng.fillRect(x-1,y-7,3,6);ng.fillRect(x-3,y-5,7,2);}};
    // v1：平頂診所＋左後方白柵欄狗狗運動場（狗屋、跨欄、水碗）；屋頂立綠十字燈箱、右牆大腳印
    try{const o=fresh1(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9aa07e','#878d6c','#aab08c');
      poly(o.g,[Q(22,4),Q(31,4),Q(31,30),Q(22,30)],'#8cb06a');
      for(let q=8;q<30;q+=6){const u=Q(23,q),v=Q(30,q);ln(o.g,u[0],u[1],v[0],v[1],'#80a462');}
      poly(o.g,[Q(8,0),Q(13,0),Q(13,12),Q(8,12)],'#c8c4b4');
      // 後側柵欄
      fence(g,Q,31,4,31,30,'#ecebe2','#b8b8ac');fence(g,Q,22,30,31,30,'#ecebe2','#b8b8ac');
      // 狗屋
      {const D=Q(24,8,0);box(g,D[0],D[1],6,6,5,'#c8684e','#9a4c3a',null,{noAO:true});roofGQ(g,Q,24,8,6,6,5,3,1,'#6a7a8a','#4a5a6a','#c8684e','#3a4450');
        fr(g,D,'L',2,3,0,3,'#3a2a22');}
      // 跨欄＋水碗＋球
      {const a1=Q(29,18,0),a2=Q(29,22,0);rect(g,a1[0],a1[1]-4,1,4,'#e8e8e0');rect(g,a2[0],a2[1]-4,1,4,'#e8e8e0');ln(g,a1[0],a1[1]-3,a2[0],a2[1]-3,'#e05252');}
      {const b1=Q(23,15,0);rect(g,b1[0]-1,b1[1]-1,3,1,'#5ec8ff');}
      {const b2=Q(29,6,0);rect(g,b2[0],b2[1]-2,2,2,'#ffb35a');}
      // 診所本體
      const p0=4,q0=12,a=16,b=18,h=16,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,WL,WR,'#aab6aa');
      fr(g,S,'L',1,a,h-3,3,COR);fr(g,S,'R',0,b,h-3,3,CORd);fr(g,S,'L',1,a,h-1,1,shade(COR,20));
      fw(g,ng,S,'L',10,5,4,7,GL,FR,LIT,true);fr(g,S,'L',12,1,4,7,'rgba(255,255,255,.35)');
      fr(g,S,'L',3,5,0,9,DOOR);fr(g,S,'L',5,1,0,9,'#3a2618');fr(ng,S,'L',3,5,0,9,'rgba(255,233,176,.8)');
      fr(g,S,'L',2,7,9,2,GRN);fr(g,S,'L',2,7,11,1,shade(GRN,26));
      fw(g,ng,S,'R',2,4,5,5,GL,FR,LIT,rk()<.6);fw(g,ng,S,'R',8,4,5,5,GL,FR,LIT,rk()<.6);
      fpat(g,S,'R',13,5,PAW,BR);
      // 屋頂設備＋十字燈箱
      {const c=Q(10,24,h);rect(g,c[0]-2,c[1]-3,5,3,'#8a948a');rect(g,c[0]-2,c[1]-3,5,1,'#a8b2a8');}
      {const c=Q(12,19,h);rect(g,c[0]-3,c[1]-3,1,3,'#6a7078');rect(g,c[0]+3,c[1]-3,1,3,'#6a7078');crossSign(g,ng,c[0],c[1]-3);}
      // 前側柵欄（遮擋）
      occ(L,tg=>{fence(tg,Q,22,4,31,4,'#ecebe2','#b8b8ac');fence(tg,Q,22,4,22,12,'#ecebe2','#b8b8ac');
        {const s1=Q(14,4,3),s2=Q(19,4,3);ln(tg,s1[0],s1[1],s2[0],s2[1],'#8a6a42');const l1=Q(15,4,0),l2=Q(18,4,0);rect(tg,l1[0],l1[1]-3,1,3,'#6a4a2c');rect(tg,l2[0],l2[1]-3,1,3,'#6a4a2c');}});
      stamp(o,L,OL102);polish1(o);
      B[k+'_1_1']=fin(o);}catch(e){console.error('v574 k102 v1',e);}
    // v2：兩層山牆「狗屋形」醫院——綠色雙坡陡頂、山牆大腳印與圓窗、左牆挑出十字招牌；右側低矮犬舍翼（高窗＋天窗）
    try{const o=fresh1(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9aa07e','#878d6c','#aab08c');
      poly(o.g,[Q(15,0),Q(21,0),Q(21,6),Q(15,6)],'#c8c4b4');
      const p0=10,q0=6,a=20,b=16,h=20,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,WL,WR,null);
      fr(g,S,'L',1,a,10,1,'#c8d0c4');fr(g,S,'R',0,b,10,1,'#b4bcb0');
      fr(g,S,'L',1,a,0,2,'#aab4a8');fr(g,S,'R',0,b,0,2,'#94a092');
      for(const d of[2,15])fw(g,ng,S,'L',d,3,3,5,GL,FR,LIT,rk()<.6);
      for(const d of[2,8,15])fw(g,ng,S,'L',d,3,12,5,GL,FR,LIT,rk()<.55);
      for(const d of[3,9])fw(g,ng,S,'R',d,3,12,5,GL,FR,LIT,rk()<.5);
      fr(g,S,'L',7,6,0,8,'#8fc0dc');fr(g,S,'L',10,1,0,8,'#e8ece6');fr(g,S,'L',7,6,8,1,FR);fr(ng,S,'L',7,6,0,8,'rgba(255,233,176,.85)');
      fr(g,S,'L',6,8,9,2,GRN);
      roofGQ(g,Q,p0,q0,a,b,h,12,2,'#6aa872','#3f6e48',WL,'#2c4a32');
      {const c=Q(p0+a/2,q0,h+9);rect(g,Math.round(c[0])-1,Math.round(c[1])-1,3,2,GL);rect(g,Math.round(c[0])-1,Math.round(c[1])-2,3,1,FR);
        if(rk()<.8){ng.fillStyle=LIT;ng.fillRect(Math.round(c[0])-1,Math.round(c[1])-1,3,2);}}
      fpat(g,S,'L',8,h+1,PAW5,BR);
      // 犬舍翼
      {const p1=2,q1=10,a1=8,b1=18,h1=9,S1=Q(p1,q1,0);
        box(g,S1[0],S1[1],a1,b1,h1,'#e4eadc','#c4ccbe','#a4b0a2');
        fr(g,S1,'L',1,a1,h1-2,2,COR);fr(g,S1,'R',0,b1,h1-2,2,CORd);
        for(const d of[2,8,14]){fw(g,ng,S1,'R',d,3,3,3,GL,FR,LIT,rk()<.45);fr(g,S1,'R',d+1,1,3,3,'#5a6a5a');}
        fw(g,ng,S1,'L',3,3,3,3,GL,FR,LIT,rk()<.45);fr(g,S1,'L',4,1,3,3,'#5a6a5a');
        for(const q of[14,21]){const c=Q(p1+4,q,h1);rect(g,c[0]-2,c[1]-2,4,2,'#9cc8dc');rect(g,c[0]-2,c[1]-2,4,1,'#d8eef6');}}
      // 挑出十字招牌（前景）
      occ(L,tg=>{const e1=Q(p0+3,q0,17),e2=Q(p0+3,q0-5,17);ln(tg,e1[0],e1[1],e2[0],e2[1],'#6a7078');
        const c=Q(p0+3,q0-4,16);crossSign(tg,null,Math.round(c[0]),Math.round(c[1])+4);
        {const t=Q(28,4,0);tree(tg,t[0],t[1]);}});
      {const c=Q(p0+3,q0-4,16);ng.fillStyle='#d0ffd8';ng.fillRect(Math.round(c[0])-4,Math.round(c[1])-4,9,8);ng.fillStyle='#ffffff';ng.fillRect(Math.round(c[0])-1,Math.round(c[1])-3,3,6);ng.fillRect(Math.round(c[0])-3,Math.round(c[1])-1,7,2);}
      stamp(o,L,OL102);polish1(o);
      B[k+'_1_2']=fin(o);}catch(e){console.error('v574 k102 v2',e);}
  })();

  // 旋轉體：鼓座（半徑 Rh、高 hd）＋橢球穹頂（高 Rz），逐點取樣＋背面剔除；光從左上前
  function dome3(g,Q,uc,vc,z0,Rh,Rz,tones,hd,dTones){
    const Lx=.26,Ly=-.62,Lz=.73,n=tones.length;
    const put=(u,v,z,nu,nv,nz,T)=>{const d=nu*Lx+nv*Ly+nz*Lz;let t=Math.round((1-d)*(T.length-1)/1.6);t=Math.max(0,Math.min(T.length-1,t));
      const p=Q(uc+u,vc+v,z);g.fillStyle=T[t];g.fillRect(Math.round(p[0]),Math.round(p[1]),1,1);};
    if(hd>0)for(let a=0;a<6.2832;a+=.015){const nu=Math.cos(a),nv=Math.sin(a);if(-nu-nv<-.08)continue;for(let z=0;z<=hd;z+=.5)put(Rh*nu,Rh*nv,z0+z,nu,nv,0,dTones);}
    for(let el=0;el<=1.5708;el+=.015)for(let a=0;a<6.2832;a+=.015){const ce=Math.cos(el),se=Math.sin(el),cu=ce*Math.cos(a),cvv=ce*Math.sin(a);
      let mu=cu/Rh,mv=cvv/Rh,mz=se/Rz;const m=Math.hypot(mu,mv,mz);mu/=m;mv/=m;mz/=m;
      if(-mu-mv+mz<-.02)continue;put(Rh*cu,Rh*cvv,z0+hd+Rz*se,mu,mv,mz,tones);}
    return n;
  }
  const COIN=['.xxx.','xx.xx','x.x.x','xx.xx','.xxx.'];

  /* ================= k86 銀行 (1×1；redraw) ================= */
  (function(){
    const k=86;if(!B[k+'_1_0'])return;
    const OL86=[58,58,66],SL='#c9ccd4',SR='#a4aab6',PED='#8890a0',COLc='#eceef2',DOOR='#5a3a24',GOLD='#dbb42c',GOLDd='#b08e1c',STEP='#b8bcc8',LIT='#ffe9b0';
    // v1：穹頂圓廳銀行——方正石基座＋左牆四柱山花門廊＋中央鼓座穹頂（金頂燈）；右牆拱窗與 ATM
    try{const o=fresh1(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9a9484','#8a8478','#aca696');
      const p0=6,q0=6,a=22,b=22,h=14,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,SL,SR,'#b4bac4');
      fr(g,S,'L',1,a,0,2,'#b0b4be');fr(g,S,'R',0,b,0,2,'#8e94a2');
      fr(g,S,'L',1,a,h-3,3,'#dfe2e8');fr(g,S,'R',0,b,h-3,3,'#bcc2cc');fr(g,S,'L',1,a,h-3,1,'#9aa0ac');fr(g,S,'R',0,b,h-3,1,'#80869a');
      for(const d of[4,10,16]){fw(g,ng,S,'R',d,3,3,6,'#5f7f9c','#8890a0',LIT,rk()<.55);fr(g,S,'R',d+1,1,9,1,'#5f7f9c');}
      fr(g,S,'L',9,5,1,9,DOOR);fr(g,S,'L',9,5,10,1,GOLD);fr(ng,S,'L',9,5,1,9,'rgba(255,233,176,.8)');
      for(const d of[3,17])fw(g,ng,S,'L',d,3,3,6,'#5f7f9c','#8890a0',LIT,rk()<.5);
      // 鼓座＋穹頂
      dome3(g,Q,17,17,h,7,8,['#e4e8f0','#c8cdd8','#aab0be','#8e95a6','#747b8e'],5,['#d8dce4','#c0c5d0','#a4aab8','#8a90a0','#72788a']);
      {const t=Q(17,17,h+5+8);rect(g,t[0]-1,t[1]-3,3,3,'#e8eaf0');rect(g,t[0]-1,t[1]-3,3,1,'#ffffff');rect(g,t[0],t[1]-5,1,2,GOLD);rect(g,t[0]-1,t[1]-6,3,1,GOLD);
        ng.fillStyle='#ffe08a';ng.fillRect(t[0]-1,t[1]-3,3,3);}
      {for(const aa of[-.9,-.3,.3]){const c=Q(17+7*Math.cos(aa+2.36),17+7*Math.sin(aa+2.36),h+2);rect(g,c[0],c[1]-2,1,2,'#4e5a70');if(rk()<.7){ng.fillStyle=LIT;ng.fillRect(Math.round(c[0]),Math.round(c[1])-2,1,2);}}}
      // 門廊（前景）：台階、四柱、額枋、山花
      occ(L,tg=>{
        {const D=Q(8,0,0);box(tg,D[0],D[1],20,2,1,STEP,shade(STEP,-24),'#c8ccd6',{noAO:true});}
        {const D=Q(8,2,0);box(tg,D[0],D[1],20,4,1,'#c0c4ce','#9ca2ae','#ccd0da',{noAO:true});}
        for(const p of[10,15,21,26])post(tg,Q,p,3,1,11,'#f6f7fa','#cdd1da');
        {const D=Q(8,2,11);box(tg,D[0],D[1],20,4,3,'#dfe2e8','#aeb4c0','#c4c9d2',{noAO:true});}
        poly(tg,[Q(18,2,20),Q(18,6,20),Q(28,6,14),Q(28,2,14)],'#9aa2b2');
        poly(tg,[Q(8,2,14),Q(28,2,14),Q(18,2,19)],'#d4d8e0');
        poly(tg,[Q(10,2,14),Q(26,2,14),Q(18,2,18)],PED);
        poly(tg,[Q(8,2,14),Q(8,6,14),Q(18,6,20),Q(18,2,20)],'#7c8496');
        {const u=Q(8,2,14),v=Q(18,2,20),w=Q(28,2,14);ln(tg,u[0],u[1],v[0],v[1],'#eef0f4');ln(tg,v[0],v[1],w[0],w[1],'#eef0f4');}
        {const c=Q(18,2,15);rect(tg,c[0]-1,c[1]-2,3,3,GOLD);rect(tg,c[0],c[1]-1,1,1,GOLDd);}});
      {const c=Q(18,2,15);ng.fillStyle='#ffe08a';ng.fillRect(Math.round(c[0])-1,Math.round(c[1])-2,3,3);}
      stamp(o,L,OL86);polish1(o);
      B[k+'_1_1']=fin(o);}catch(e){console.error('v574 k86 v1',e);}
    // v2：現代金融塔——前方低矮玻璃營業大廳、後方細高石材塔（直條窗、金色冠帶、金幣徽）、右側得來速 ATM 雨棚
    try{const o=fresh1(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#9a9484','#8a8478','#aca696');
      poly(o.g,[Q(0,16),Q(9,16),Q(9,28),Q(0,28)],'#7e7a70');
      for(let q=18;q<28;q+=4){const u=Q(1,q),v=Q(8,q);ln(o.g,u[0],u[1],v[0],v[1],'#e6dc9a');}
      // 塔
      const p0=12,q0=12,a=14,b=14,h=50,S=Q(p0,q0,0);
      box(g,S[0],S[1],a,b,h,SL,SR,'#80879a');
      for(let d=2;d<=a-1;d+=4){fr(g,S,'L',d,2,4,h-10,'#56708c');fr(g,S,'L',d,1,4,h-10,'#6a86a2');}
      for(let d=1;d<b-1;d+=4){fr(g,S,'R',d,2,4,h-10,'#3e546c');}
      for(let z=10;z<h-6;z+=8){fr(g,S,'L',1,a,z,1,'rgba(40,46,60,.35)');fr(g,S,'R',0,b,z,1,'rgba(20,26,40,.35)');}
      for(let z=4;z<h-8;z+=8)for(let d=2;d<=a-1;d+=4){if(rk()<.42)fr(ng,S,'L',d,2,z+1,6,'rgba(255,240,196,.85)');}
      for(let z=4;z<h-8;z+=8)for(let d=1;d<b-1;d+=4){if(rk()<.36)fr(ng,S,'R',d,2,z+1,6,'rgba(255,232,180,.7)');}
      fr(g,S,'L',1,a,h-4,2,GOLD);fr(g,S,'R',0,b,h-4,2,GOLDd);fr(g,S,'L',1,a,h-1,1,'#e8eaf0');
      fpat(g,S,'L',5,h-12,COIN,GOLD);fpat(ng,S,'L',5,h-12,COIN,'#ffe08a');
      {const c=Q(20,22,h);rect(g,c[0]-3,c[1]-4,6,4,'#8a909c');rect(g,c[0]-3,c[1]-4,6,1,'#aab0bc');}
      // 得來速雨棚＋ATM
      {const D=Q(8,18,0);box(g,D[0],D[1],3,4,6,'#4a4e5a','#34383f','#5a5e6a',{noAO:true});fr(g,D,'L',1,3,2,3,'#7fb0d8');fr(ng,D,'L',1,3,2,3,'#66c8ff');}
      {const D=Q(2,16,7);box(g,D[0],D[1],10,12,2,'#dfe2e8','#aab0bc','#c4c9d2',{noAO:true});fr(g,D,'R',0,12,0,1,GOLD);fr(g,D,'L',1,10,0,1,GOLDd);}
      // 營業大廳（前景）
      occ(L,tg=>{
        for(const q of[17,27])post(tg,Q,3,q,0,7,'#c9ccd4','#9aa0ac');
        const p1=6,q1=2,a1=24,b1=10,h1=11,S1=Q(p1,q1,0);
        box(tg,S1[0],S1[1],a1,b1,h1,SL,SR,'#8e95a4');
        fr(tg,S1,'L',1,a1,1,7,'#6a8aa8');fr(tg,S1,'R',0,b1,1,7,'#4e6a86');
        for(let d=1;d<=a1;d+=5)fr(tg,S1,'L',d,1,0,8,'#dfe2e8');for(let d=0;d<b1;d+=5)fr(tg,S1,'R',d,1,0,8,'#b4bac6');
        fr(tg,S1,'L',1,a1,8,1,GOLD);fr(tg,S1,'R',0,b1,8,1,GOLDd);fr(tg,S1,'L',1,a1,0,1,'#9aa0ac');
        fr(tg,S1,'L',10,4,1,6,'#3a4a5c');fr(tg,S1,'L',12,1,1,6,GOLD);
        for(let q=4;q<11;q+=4){const c=Q(p1+a1/2,q1+q,h1);rect(tg,c[0]-6,c[1],12,1,'#b8d8ea');}});
      {const S1=Q(6,2,0);for(let d=2;d<=24;d+=5)if(d<10||d>13)fr(ng,S1,'L',d,4,1,7,'rgba(255,236,190,.82)');for(let d=1;d<10;d+=5)fr(ng,S1,'R',d,4,1,7,'rgba(255,226,170,.6)');}
      stamp(o,L,OL86);polish1(o);
      B[k+'_1_2']=fin(o);}catch(e){console.error('v574 k86 v2',e);}
  })();

  /* ================= k185 賞鯨台 (1×1；redraw；batches.json 標「節慶市集」有誤，實為 KNAME 185 賞鯨台) ================= */
  (function(){
    const k=185;if(!B[k+'_1_0'])return;
    const OL185=[28,22,16],WD='#8a6844',WDL='#a07c50',WDD='#6a4e30',TL='#5a6a54',TD='#485744',TLL='#71826a',LAMP='#ffd97a';
    const bez=(p0,c,p1,n)=>{const r=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;r.push([u*u*p0[0]+2*u*t*c[0]+t*t*p1[0],u*u*p0[1]+2*u*t*c[1]+t*t*p1[1]]);}return r;};
    /* v574 第三輪（退件修）：鯨尾改用 v0 同形同色（#5a6a54／#485744／#71826a）的 Y 形尾鰭，
       放大到塔高約 1/3，立在石座上並投影；cx＝柱中欄、yb＝石座南角 y */
    function tail0(tg,cx,yb,hs){
      box(tg,cx,yb,4,4,3,'#b8b2a2','#8e897c','#cfc9b8',{noAO:true});
      const y1=yb-5,yt=y1-hs;
      rect(tg,cx-1,yt,2,hs+1,TL);rect(tg,cx+1,yt,1,hs+1,TD);
      const X=x=>2*cx+1-x;
      poly(tg,[...bez([cx-1,yt+1],[cx-8,yt-3],[cx-7,yt-11],8),...bez([cx-4,yt-10],[cx-5,yt-4],[cx+1,yt-1],8)],TL);
      poly(tg,[...bez([X(cx-1),yt+1],[X(cx-8),yt-3],[X(cx-7),yt-11],8),...bez([X(cx-4),yt-10],[X(cx-5),yt-4],[X(cx+1),yt-1],8)],TD);
      rect(tg,cx-1,yt,2,2,TLL);
      return yt;
    }
    // 夜光只留在白天實體像素上（先有燈具才有光）
    const clipN=L=>{L.ng.save();L.ng.globalCompositeOperation='destination-in';L.ng.drawImage(L.c,0,0);L.ng.restore();};
    const sandRipple=(o,Q)=>{for(const[p,q]of[[6,4],[26,6],[4,20],[22,26],[14,30]]){const u=Q(p,q),v=Q(p+4,q);ln(o.g,u[0],u[1],v[0],v[1],'#b89e76');}};
    // v1：高腳瞭望塔——四柱斜撐木構、塔台欄杆、鏽紅四角攢尖頂、台上望遠鏡；木棧道引到梯腳、2px 階梯帶、前右石座鯨尾雕塑
    try{const o=fresh1(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng,Q=Qf(o.ax,o.ay);
      plate1(o,'#c8b088','#a8906a','#dcc49a');sandRipple(o,Q);
      poly(o.g,[Q(27,0),Q(32,0),Q(32,8),Q(27,8)],WDL);for(let q=2;q<8;q+=3){const u=Q(27,q),v=Q(32,q);ln(o.g,u[0],u[1],v[0],v[1],WD);}
      // 鯨尾雕塑的接地影（光從左 ⇒ 影往右後）
      {const c=Q(2,26,0),x=Math.round(c[0]),y=Math.round(c[1]);shadowPoly(o,[[x-2,y],[x+5,y+1],[x+15,y-5],[x+8,y-8]],.24);}
      const P=(p,q,z0,z1)=>post(g,Q,p,q,z0,z1,WDL,WDD);
      P(26,26,0,22);P(12,26,0,22);P(26,12,0,22);
      {let u=Q(26,26,2),v=Q(12,26,20);ln(g,u[0],u[1],v[0],v[1],WDD);u=Q(26,26,2);v=Q(26,12,20);ln(g,u[0],u[1],v[0],v[1],WDD);}
      // 台面
      {const D=Q(11,11,20);box(g,D[0],D[1],16,16,2,WDL,WDD,'#b08a5a',{noAO:true});}
      // 台上後欄＋頂柱
      {const r1=Q(27,11,26),r2=Q(27,27,26),r3=Q(11,27,26);ln(g,r1[0],r1[1],r2[0],r2[1],WD);ln(g,r2[0],r2[1],r3[0],r3[1],WD);}
      for(const[p,q]of[[27,27],[27,11],[11,27]])post(g,Q,p,q,22,34,WDL,WDD);
      // 望遠鏡（台上左前）
      {const c=Q(22,14,22);rect(g,c[0],c[1]-4,1,4,'#8a8a90');rect(g,c[0]-2,c[1]-6,5,2,'#3a4a5a');rect(g,c[0]+2,c[1]-6,1,1,'#5a7086');
        ng.fillStyle='rgba(160,220,255,.6)';ng.fillRect(c[0]-2,c[1]-6,5,2);}
      // 燈籠
      {const c=Q(19,19,31);rect(g,c[0],c[1]-2,1,2,'#50565c');rect(g,c[0]-1,c[1],3,3,'#e8b44a');ng.fillStyle=LAMP;ng.fillRect(c[0]-1,c[1],3,3);}
      roofHip(g,Q,11,11,16,16,34,7,2,'#c0643e','#8e4228','#a4502e','#5a2a1a');
      {const c=Q(19,19,41);rect(g,c[0],c[1]-4,1,4,'#50565c');rect(g,c[0]+1,c[1]-4,3,2,'#c25038');}
      // 前景：前柱、斜撐、前欄、樓梯、小鯨尾
      occ(L,tg=>{
        post(tg,Q,12,12,0,22,WDL,WDD);
        {let u=Q(12,12,2),v=Q(26,12,20);ln(tg,u[0],u[1],v[0],v[1],WD);u=Q(12,12,2);v=Q(12,26,20);ln(tg,u[0],u[1],v[0],v[1],WDD);}
        post(tg,Q,11,11,22,34,WDL,WDD);
        {const r1=Q(27,11,26),r0=Q(11,11,26),r3=Q(11,27,26);ln(tg,r1[0],r1[1],r0[0],r0[1],WDL);ln(tg,r0[0],r0[1],r3[0],r3[1],WDL);
          for(let p=15;p<27;p+=4){const a1=Q(p,11,22);rect(tg,a1[0],a1[1]-4,1,4,WD);}for(let q=15;q<27;q+=4){const a1=Q(11,q,22);rect(tg,a1[0],a1[1]-4,1,4,WDD);}}
        // 階梯：下緣 2px 斜樑＋逐階 2px 厚踏板（階梯帶，1× 下可讀）
        {const n=6,run=17/n;
          const u=Q(31,8,-2),v=Q(14,8,18);ln(tg,u[0],u[1],v[0],v[1],WDD);
          for(let i=0;i<n;i++){const S=Q(31-(i+1)*run,8,Math.round((i+1)*21/n)-2);box(tg,Math.round(S[0]),Math.round(S[1]),3,3,2,WD,WDD,'#d8b27a',{noAO:true});}
          // 扶手：斜欄杆＋上下兩柱
          const h0=Q(30,8,6),h1=Q(15,8,27);ln(tg,h0[0],h0[1],h1[0],h1[1],WDL);
          for(const[p,z]of[[30,0],[22,10]]){const b0=Q(p,8,z+1);rect(tg,Math.round(b0[0]),Math.round(b0[1])-5,1,5,WDD);}}
        {const c=Q(2,26,0);tail0(tg,Math.round(c[0]),Math.round(c[1]),4);}});
      {const c=Q(2,26,0),cx=Math.round(c[0]),yt=Math.round(c[1])-5-4;ng.fillStyle='rgba(140,255,200,.8)';ng.fillRect(cx-7,yt-11,2,3);ng.fillRect(cx+6,yt-11,2,3);}
      clipN(L);stamp(o,L,OL185);polish1(o);
      B[k+'_1_1']=fin(o);}catch(e){console.error('v574 k185 v1',e);}
    // v2：鯨骨拱門棧道——長木棧道縱貫全格、棧道入口一對象牙色鯨顎骨尖拱（頂懸燈）、左側藍綠小售票亭（鯨形招牌）、棧道盡頭雙投幣望遠鏡
    /* v574 第三輪（退件修）：顎骨拱 31→50（1.6×）、加粗 4/3/2px 象牙色並各自描深色外框（與棧道分離）；
       亭頂鯨形招牌 10×5→20×10；亭左面加售票窗（夜亮）、拱頂懸燈加大；棧道緣梁與遠側兩盞矮柱燈作夜光來源 */
    try{const o=fresh1(k),rk=R(k,2),Q=Qf(o.ax,o.ay);
      plate1(o,'#c8b088','#a8906a','#dcc49a');sandRipple(o,Q);
      poly(o.g,[Q(0,12),Q(32,12),Q(32,20),Q(0,20)],WD);
      for(let p=2;p<32;p+=3){const u=Q(p,12),v=Q(p,20);ln(o.g,u[0],u[1],v[0],v[1],WDD);}
      {const u=Q(0,12),v=Q(32,12);ln(o.g,u[0],u[1],v[0],v[1],WDL);ln(o.ng,u[0],u[1],v[0],v[1],'rgba(255,210,120,.55)');}
      const bone=(tg,qa,dir)=>{const H=50,N=30,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push(Q(6,qa+dir*8*Math.pow(t,2.2),H*t));}
        const cols=dir>0?['#fbf5e6','#ece3cb','#d6c9ac','#b7a988']:['#f1e8d2','#dfd4ba','#c6b898','#a99b7c'];
        {const b0=Q(6,qa,0),bx=Math.round(b0[0])+(dir>0?-1:2),byy=Math.round(b0[1])+1;box(tg,bx,byy,3,3,3,'#a4a49c','#7c7c76','#bdbdb4',{noAO:true});}
        for(let i=0;i<N;i++){const t=i/N,w=t<.45?4:t<.8?3:2;
          for(let j=0;j<w;j++){const off=dir>0?-j:j,ci=dir>0?(w-1-j):j;ln(tg,pts[i][0]+off,pts[i][1],pts[i+1][0]+off,pts[i+1][1],cols[ci]);}}};
      // 圖層 1：盡頭望遠鏡、遠側矮柱燈、售票亭
      {const L=layer(o.W,o.H),g=L.g,ng=L.ng;
        for(const[pp,q]of[[22,26],[27,24]]){const c=Q(pp,q,0);rect(g,c[0],c[1]-6,1,6,'#6a6e76');rect(g,c[0]-1,c[1]-9,4,3,'#3a4a5a');rect(g,c[0]+3,c[1]-8,1,1,'#5a7086');rect(g,c[0]-1,c[1]-1,3,1,'#6a6e76');
          ng.fillStyle='rgba(160,220,255,.55)';ng.fillRect(Math.round(c[0])-1,Math.round(c[1])-9,4,3);}
        for(const pp of[14,30]){const c=Q(pp,21,0),x=Math.round(c[0]),y=Math.round(c[1]);rect(g,x,y-6,1,6,'#50565c');rect(g,x-1,y-8,3,2,'#e8d8a0');rect(g,x-1,y-9,3,1,'#50565c');
          ng.fillStyle=LAMP;ng.fillRect(x-1,y-8,3,2);}
        const p1=18,q1=2,a1=10,b1=8,h1=12,S1=Q(p1,q1,0);
        box(g,S1[0],S1[1],a1,b1,h1,'#d2b27e','#a8845a',null);
        for(let z=2;z<h1;z+=3){fr(g,S1,'L',1,a1,z,1,'rgba(90,60,30,.16)');fr(g,S1,'R',0,b1,z,1,'rgba(60,40,20,.2)');}
        fr(g,S1,'R',2,5,5,4,'#3a4a5a');fr(g,S1,'R',1,7,9,1,'#4a7a8a');fr(g,S1,'R',1,7,4,1,'#6a4e30');fr(ng,S1,'R',2,5,5,4,'rgba(255,217,122,.9)');
        fr(g,S1,'L',2,3,0,8,'#5a4030');
        // 左面售票窗：櫃台檯面＋藍綠遮簷
        fr(g,S1,'L',6,4,4,4,'#3a4a5a');fr(g,S1,'L',5,6,3,1,'#f0e2c8');fr(g,S1,'L',5,6,8,2,'#4a8a98');fr(g,S1,'L',5,6,8,1,'#6fb0bc');
        fr(ng,S1,'L',6,4,4,4,'rgba(255,222,140,.95)');
        roofGQ(g,Q,p1,q1,a1,b1,h1,5,1,'#5f98a6','#36606c','#d2b27e','#24424a');
        const c=Q(p1+a1/2,q1+b1/2,h1+5),x=Math.round(c[0]),y=Math.round(c[1]);
        rect(g,x-4,y-3,1,4,'#50565c');rect(g,x+4,y-3,1,4,'#50565c');
        const WH=['...............ll.ll','................lxl.','.....lllll.......x..','...lxxxxxxxl.....x..','.lxxxxxxxxxxxl..xx..',
                  'lxexxxxxxxxxxxxxx...','xxxxxxxxxxxxxxxx....','xbbbbbbbbxxxxxx.....','.bbbbbbbbbxxx.......','...bbbbbb...........'];
        const WC={x:'#3a6a9a',l:'#8fc8e8',b:'#c8dcea',e:'#f0f4f8'};
        for(let r=0;r<WH.length;r++)for(let i=0;i<WH[r].length;i++){const ch=WH[r][i];if(ch!=='.')rect(g,x-10+i,y-13+r,1,1,WC[ch]);}
        clipN(L);stamp(o,L,OL185);}
      // 圖層 2：後顎骨（自帶外框）
      {const L=layer(o.W,o.H);bone(L.g,24,-1);stamp(o,L,OL185);}
      // 圖層 3：前顎骨、拱頂懸燈、前繩欄
      {const L=layer(o.W,o.H),g=L.g,ng=L.ng;
        bone(g,9,1);
        {const t=Q(6,16,49),x=Math.round(t[0]),y=Math.round(t[1]);rect(g,x,y,1,5,'#50565c');rect(g,x-1,y+5,3,1,'#3a3e44');rect(g,x-1,y+6,3,3,'#e8b44a');rect(g,x,y+9,1,1,'#3a3e44');
          ng.fillStyle=LAMP;ng.fillRect(x-1,y+6,3,3);}
        for(const p of[2,10]){const a1=Q(p,11,0),x=Math.round(a1[0]),y=Math.round(a1[1]);rect(g,x,y-5,1,5,'#9a9a94');rect(g,x,y-6,1,1,'#e8d8a0');ng.fillStyle=LAMP;ng.fillRect(x,y-6,1,1);}
        {const u=Q(2,11,4),m=Q(6,11,3),v=Q(10,11,4);ln(g,u[0],u[1],m[0],m[1],'#b8a888');ln(g,m[0],m[1],v[0],v[1],'#b8a888');}
        clipN(L);stamp(o,L,OL185);}
      polish1(o);
      B[k+'_1_2']=fin(o);}catch(e){console.error('v574 k185 v2',e);}
  })();

  /* ================= k48 綜合醫院 (3×3) ================= */
  (function(){
    const k=48;if(!B[k+'_1_0'])return;
    const ox=104,oy=122,P=(u,v,z)=>[ox+u-v,oy+(u+v)/2-(z||0)];
    const boxMask=(x,y)=>inBox(x,y,104,216,44,44,40,1);
    const plateLike=(r,g,b)=>Math.abs(r-154)+Math.abs(g-160)+Math.abs(b-164)<44;
    const itemMask=(x,y,r,g,b,a)=>x>=82&&x<=123&&y>=96&&y<=134&&a>200&&!plateLike(r,g,b);
    const WL='#eef0f2',WR='#d0d6da',RF='#b0b8bc';

    // v1：病房塔擴建（東側後方高塔＋屋頂直升機坪）
    {const o=mk(k),rk=R(k,1),L=layer(o.W,o.H);
      const S=P(90,38),cx=S[0],by=S[1],a=32,b=32,h=100;
      shadowPoly(o,[P(58,38),P(90,38),[S[0]+10,S[1]-2],P(90,6),[P(90,6)[0]+10,P(90,6)[1]-2]],.2);
      const g=L.g,ng=L.ng;
      box(g,cx,by,a,b,h,WL,WR,RF);
      wins(g,ng,cx,by,a,b,h,rk,{w:3,ht:5,gx:7,gy:9,glass:'#3a4a5a',lit:'#ffe9c0',p:.42,top:14,bot:4});
      // 頂部設備層：深色帶
      g.fillStyle='#8a939a';for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-h+3,1,2);}
      g.fillStyle='#6f777e';for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-h+3,1,2);}
      // 左面上方紅十字招牌
      {const sx=cx-22,sy=by-11-h+6;rect(g,sx,sy,11,11,'#f6f7f8');rect(g,sx+4,sy+1,3,9,'#e05252');rect(g,sx+1,sy+4,9,3,'#e05252');
        ng.fillStyle='#ff8080';ng.fillRect(sx+4,sy+1,3,9);ng.fillRect(sx+1,sy+4,9,3);}
      // 屋頂直升機坪
      const Q=Qf(cx,by);
      poly(g,[Q(5,5,h+2),Q(a-5,5,h+2),Q(a-5,b-5,h+2),Q(5,b-5,h+2)],'#5d656c');
      poly(g,[Q(5,5,h),Q(a-5,5,h),Q(a-5,5,h+2),Q(5,5,h+2)],'#8a939a');
      poly(g,[Q(5,5,h),Q(5,b-5,h),Q(5,b-5,h+2),Q(5,5,h+2)],'#6f777e');
      {const c=Q(a/2,b/2,h+2);rect(g,c[0]-4,c[1]-3,1,6,'#f2f2ee');rect(g,c[0]+3,c[1]-3,1,6,'#f2f2ee');rect(g,c[0]-3,c[1],6,1,'#f2f2ee');
        const l1=Q(5,5,h+2),l2=Q(a-5,b-5,h+2);rect(g,l1[0],l1[1]-2,1,2,'#c84a3a');rect(g,l2[0],l2[1]-2,1,2,'#c84a3a');
        ng.fillStyle='#ff5050';ng.fillRect(l1[0],l1[1]-2,1,2);ng.fillRect(l2[0],l2[1]-2,1,2);}
      stamp(o,L,OL);
      restamp(o,(x,y,r,g,b,a)=>boxMask(x,y)||itemMask(x,y,r,g,b,a));
      B[k+'_1_1']=fin(o);}

    // v2：紅磚老院區雙翼（U 形院落、山牆＋拱窗）
    {const o=mk(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const BL='#b8674c',BR='#8e4a38',RS='#5c6670',RSd='#48515a',TRIM='#e6dccb';
      // 北角連接體（低、平頂）
      {const S=P(40,40);box(g,S[0],S[1],32,32,20,BL,BR,'#6a7078');}
      // 西翼：脊線沿右面方向，山牆面向左下
      const wingA=()=>{const S=P(42,90),cx=S[0],by=S[1],a=36,b=56,h=22,r=10,Q=Qf(cx,by);
        shadowPoly(o,[Q(0,0,0),[Q(0,0,0)[0]+8,Q(0,0,0)[1]-1],[Q(0,b,0)[0]+8,Q(0,b,0)[1]-1],Q(0,b,0)],.2);
        poly(g,[Q(a/2,0,h+r),Q(a/2,b,h+r),Q(a,b,h),Q(a,0,h)],'#6e7882');       // 遠坡（受光）
        poly(g,[Q(0,0,h),Q(0,b,h),Q(a/2,b,h+r),Q(a/2,0,h+r)],RSd);            // 近坡（背光）
        poly(g,[Q(0,0,0),Q(0,b,0),Q(0,b,h),Q(0,0,h)],BR);                      // 右牆
        poly(g,[Q(0,0,0),Q(a,0,0),Q(a,0,h),Q(a/2,0,h+r),Q(0,0,h)],BL);         // 山牆
        ln(g,...Q(a/2,0,h+r),...Q(a/2,b,h+r),'#8a949c');                        // 脊
        for(let i=0;i<3;i++){const p=8+i*10;const q=Q(p,0,0);
          A.winShape570(g,ng,q[0]-2,q[1]-17,3,6,'arch','#3a4a5a','#ffe9c0',TRIM,rk()<.45);
          A.winShape570(g,ng,q[0]-2,q[1]-8,3,4,'arch','#3a4a5a','#ffe9c0',TRIM,rk()<.4);}
        {const q=Q(a/2,0,h+4);rect(g,q[0]-1,q[1]-2,3,3,TRIM);rect(g,q[0],q[1]-1,1,1,'#3a4a5a');}
        g.fillStyle=TRIM;for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-3,1,1);}
        const ch=Q(a*0.25,b*0.55,h+r*0.5);rect(g,ch[0]-1,ch[1]-9,4,9,'#7a3e30');rect(g,ch[0]-2,ch[1]-10,6,2,'#5a5f66');};
      const wingB=()=>{const S=P(90,42),cx=S[0],by=S[1],a=56,b=36,h=22,r=10,Q=Qf(cx,by);
        shadowPoly(o,[Q(0,0,0),[Q(0,0,0)[0]+8,Q(0,0,0)[1]-1],[Q(0,b,0)[0]+8,Q(0,b,0)[1]-1],Q(0,b,0)],.2);
        poly(g,[Q(0,b/2,h+r),Q(a,b/2,h+r),Q(a,b,h),Q(0,b,h)],RSd);             // 遠坡（東北向，偏暗）
        poly(g,[Q(0,0,h),Q(a,0,h),Q(a,b/2,h+r),Q(0,b/2,h+r)],'#6e7882');       // 近坡（西南向，受光）
        poly(g,[Q(0,0,0),Q(a,0,0),Q(a,0,h),Q(0,0,h)],BL);                      // 左牆
        poly(g,[Q(0,0,0),Q(0,b,0),Q(0,b,h),Q(0,b/2,h+r),Q(0,0,h)],BR);         // 山牆（右）
        ln(g,...Q(0,b/2,h+r),...Q(a,b/2,h+r),'#8a949c');
        for(let i=0;i<3;i++){const q=Q(0,8+i*10,0);
          A.winShape570(g,ng,q[0]-1,q[1]-17,3,6,'arch','#33414f','#ffe9c0','#c9bfae',rk()<.45);
          A.winShape570(g,ng,q[0]-1,q[1]-8,3,4,'arch','#33414f','#ffe9c0','#c9bfae',rk()<.4);}
        {const q=Q(0,b/2,h+4);rect(g,q[0]-1,q[1]-2,3,3,'#c9bfae');rect(g,q[0],q[1]-1,1,1,'#33414f');}
        g.fillStyle='#c9bfae';for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-3,1,1);}
        const ch=Q(a*0.55,b*0.25,h+r*0.5);rect(g,ch[0]-1,ch[1]-9,4,9,'#6a3428');rect(g,ch[0]-2,ch[1]-10,6,2,'#5a5f66');};
      wingA();wingB();
      stamp(o,L,OL);
      restamp(o,(x,y,r,g,b,a)=>boxMask(x,y)||itemMask(x,y,r,g,b,a));
      B[k+'_1_2']=fin(o);}
  })();

  /* ================= k44 會展中心 (3×3) ================= */
  (function(){
    const k=44;if(!B[k+'_1_0'])return;
    const ox=104,oy=122,P=(u,v,z)=>[ox+u-v,oy+(u+v)/2-(z||0)];
    const boxMask=(x,y)=>inBox(x,y,104,216,46,46,34,1);
    const plateLike=(r,g,b)=>Math.abs(r-138)+Math.abs(g-143)+Math.abs(b-150)<40;
    const itemMask=(x,y,r,g,b,a)=>x>=64&&x<=144&&y>=118&&y<=162&&a>200&&!plateLike(r,g,b);

    // v1：拱頂第二展館（沿西北邊長條、玻璃扇形山牆）
    {const o=mk(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const u0=6,u1=42,v0=8,v1=92,hw=20,rise=14,uc=(u0+u1)/2,hr=(u1-u0)/2;
      const zr=u=>hw+rise*Math.sqrt(Math.max(0,1-((u-uc)/hr)**2));
      shadowPoly(o,[P(u1,v1),P(u1+8,v1),P(u1+8,v0),P(u1,v0)],.2);
      // 右長牆（東南面）
      poly(g,[P(u1,v0,0),P(u1,v1,0),P(u1,v1,hw),P(u1,v0,hw)],'#a8b4bc');
      // 拱頂：由後往前取樣
      const TL=['#dfe5ea','#c8d0d8','#b3bec7','#9aa7b2','#8794a0'];
      for(let v=v0;v<=v1;v+=0.5)for(let u=u0;u<=u1;u+=0.5){
        const z=zr(u),sl=(u-uc)/hr; // -1 西北坡 … +1 東南坡
        let t=Math.round((sl+1)*2);t=Math.max(0,Math.min(4,t));
        let col=TL[t];
        if(Math.round(v)%12===0)col=shade(col,-18);
        const p=P(u,v,z);g.fillStyle=col;g.fillRect(Math.round(p[0]),Math.round(p[1]),1,1);
      }
      // 山牆（西南面 v=v1）：底牆＋玻璃扇
      const pts=[P(u0,v1,0),P(u1,v1,0),P(u1,v1,hw)];
      for(let u=u1;u>=u0;u-=1)pts.push(P(u,v1,zr(u)));
      pts.push(P(u0,v1,hw));
      poly(g,pts,'#c8d0d8');
      const fan=[];for(let u=u1-2;u>=u0+2;u-=1)fan.push(P(u,v1,zr(u)-2));fan.push(P(u0+2,v1,hw-6),P(u1-2,v1,hw-6));
      poly(g,fan,'#5ab8b0');
      for(let u=u0+5;u<u1-2;u+=5){const a1=P(u,v1,hw-6),a2=P(u,v1,zr(u)-2);ln(g,a1[0],a1[1]-1,a2[0],a2[1]+1,'#3a8a84');}
      {const a1=P(u0+2,v1,hw-6),a2=P(u1-2,v1,hw-6);ln(g,a1[0],a1[1],a2[0],a2[1],'#3a8a84');}
      {const f2=[];for(let u=u1-2;u>=u0+2;u-=1)f2.push(P(u,v1,zr(u)-2));f2.push(P(u0+2,v1,hw-6),P(u1-2,v1,hw-6));poly(ng,f2,'rgba(160,232,224,.85)');}
      // 入口門（山牆底）＋展覽布條
      poly(g,[P(uc-2,v1,0),P(uc+10,v1,0),P(uc+10,v1,8),P(uc-2,v1,8)],'#2a2e34');
      poly(g,[P(uc-3,v1,9),P(uc+11,v1,9),P(uc+11,v1,11),P(uc-3,v1,11)],'#58c470');
      poly(ng,[P(uc-3,v1,9),P(uc+11,v1,9),P(uc+11,v1,11),P(uc-3,v1,11)],'#b8ffc8');
      poly(ng,[P(uc,v1,1),P(uc+8,v1,1),P(uc+8,v1,6),P(uc,v1,6)],'rgba(255,230,170,.75)');
      // 長牆上的橫向帶窗
      for(let v=v0+4;v<v1-4;v+=6){const q=P(u1,v,11);rect(g,q[0]-1,q[1]-3,3,3,'#5a8a94');if(rk()<.5){ng.fillStyle='rgba(160,232,224,.7)';ng.fillRect(q[0]-1,q[1]-3,3,3);}}
      stamp(o,L,OL);
      restamp(o,(x,y,r,g,b,a)=>boxMask(x,y)||itemMask(x,y,r,g,b,a));
      B[k+'_1_1']=fin(o);}

    // v2：東側穹頂展廳＋西側旗塔
    {const o=mk(k),rk=R(k,2);
      const L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const uc=72,vc=24,rr=21,dh=12;
      const C0=P(uc,vc,0);
      shadowPoly(o,[[C0[0]-rr+4,C0[1]],[C0[0]+4,C0[1]-rr/2],[C0[0]+rr+10,C0[1]],[C0[0]+4,C0[1]+rr/2]],.24);
      const lx=-0.62,ly=0.30,lz=0.72; // 光：左上（nx=螢幕右、ny=朝觀者、nz=上）
      const TD=['#eef2f4','#d4dbe0','#b9c3ca','#9eaab3','#86929c'];
      const plot=(u,v,z,nx,ny,nz,base)=>{
        const L2=nx*lx+ny*ly+nz*lz;let t=Math.round((1-L2)*2.6);t=Math.max(0,Math.min(4,t));
        const p=P(u,v,z);g.fillStyle=base?base[t]:TD[t];g.fillRect(Math.round(p[0]),Math.round(p[1]),1,1);};
      // 鼓座（只畫前半）
      const DR=['#c8d0d8','#b3bec7','#a0acb6','#8f9ba6','#7f8b96'];
      for(let a=0;a<Math.PI*2;a+=0.01){const nu=Math.cos(a),nv=Math.sin(a);if(nu+nv<-0.2)continue;
        for(let z=0;z<=dh;z+=0.5)plot(uc+rr*nu,vc+rr*nv,z,(nu-nv)/Math.SQRT2,(nu+nv)/Math.SQRT2,0,DR);}
      // 穹頂（背面剔除：法向朝觀者才畫）
      for(let el=0;el<=Math.PI/2+0.001;el+=0.012)for(let a=0;a<Math.PI*2;a+=0.012){
        const ce=Math.cos(el),se=Math.sin(el),nu=Math.cos(a)*ce,nv=Math.sin(a)*ce;
        if(nu+nv+1.15*se<0)continue;
        plot(uc+rr*nu,vc+rr*nv,dh+rr*0.9*se,(nu-nv)/Math.SQRT2,(nu+nv)/Math.SQRT2,se,null);}
      // 經線肋
      for(let m=0;m<8;m++){const a=m*Math.PI/4+Math.PI/8;const nu0=Math.cos(a),nv0=Math.sin(a);if(nu0+nv0<-0.2)continue;
        let prev=null;for(let el=0;el<=Math.PI/2;el+=0.02){const p=P(uc+rr*nu0*Math.cos(el),vc+rr*nv0*Math.cos(el),dh+rr*0.9*Math.sin(el));
          const q=[Math.round(p[0]),Math.round(p[1])];if(!prev||prev[0]!==q[0]||prev[1]!==q[1]){g.fillStyle='rgba(60,72,84,.35)';g.fillRect(q[0],q[1],1,1);prev=q;}}}
      // 鼓座玻璃帶
      for(let a=-0.6;a<=2.2;a+=0.36){const nu=Math.cos(a),nv=Math.sin(a);const p=P(uc+rr*nu,vc+rr*nv,8);
        rect(g,p[0]-1,p[1]-1,3,4,'#5ab8b0');if(rk()<.7){ng.fillStyle='#a0e8e0';ng.fillRect(Math.round(p[0])-1,Math.round(p[1])-1,3,4);}}
      // 頂燈亭
      {const t=P(uc,vc,dh+rr*0.9);rect(g,t[0]-3,t[1]-5,7,5,'#9cc0d4');rect(g,t[0]-3,t[1]-6,7,1,'#e8eef2');rect(g,t[0]-1,t[1]-9,3,3,'#8a949c');
        ng.fillStyle='#c8f4ff';ng.fillRect(t[0]-3,t[1]-5,7,5);}
      stamp(o,L,OL);
      restamp(o,(x,y,r,g,b,a)=>boxMask(x,y)||itemMask(x,y,r,g,b,a));
      // 前景：西側旗塔（在主館左前方，不被遮）
      const F=layer(o.W,o.H),fg=F.g,fng=F.ng;
      {const S=P(22,86),cx=S[0],by=S[1];
        shadowPoly(o,[[cx-6,by-3],[cx+10,by-3],[cx+14,by+1],[cx,by+4]],.26);
        box(fg,cx,by,6,6,62,'#d8dde2','#a9b2ba','#8a949c');
        // 左面直式紅布條
        fg.fillStyle='#d24a44';for(let dx=1;dx<=5;dx++)fg.fillRect(cx-dx,by-(dx>>1)-56,1,38);
        fg.fillStyle='#f2ece0';for(let dx=1;dx<=5;dx++)fg.fillRect(cx-dx,by-(dx>>1)-50,1,2);
        // 頂部燈箱招牌（加寬）
        const tb=by-62-3+5;box(fg,cx,tb,10,10,11,'#f4f6f8','#c3ccd4','#9aa6b0',{noAO:true});
        fg.fillStyle='#3a8a84';for(let dx=2;dx<=9;dx++)fg.fillRect(cx-dx,tb-(dx>>1)-8,1,4);
        fg.fillStyle='#2f706b';for(let dx=1;dx<9;dx++)fg.fillRect(cx+dx,tb-((dx+1)>>1)-8,1,4);
        fng.fillStyle='#a0e8e0';for(let dx=2;dx<=9;dx++)fng.fillRect(cx-dx,tb-(dx>>1)-8,1,4);
        fng.fillStyle='rgba(160,232,224,.7)';for(let dx=1;dx<9;dx++)fng.fillRect(cx+dx,tb-((dx+1)>>1)-8,1,4);
        const tt=tb-11-5;rect(fg,cx,tt-6,1,6,'#6a7078');rect(fg,cx-1,tt-8,3,2,'#c84a3a');
        fng.fillStyle='#ff6a5a';fng.fillRect(cx-1,tt-8,3,2);
        }
      stamp(o,F,OL);
      B[k+'_1_2']=fin(o);}
  })();

  /* ================= k65 大型購物中心 (4×4) ================= */
  (function(){
    const k=65;if(!B[k+'_1_0'])return;
    const plateLike=(r,g,b)=>Math.abs(r-182)+Math.abs(g-178)+Math.abs(b-166)<34;
    // v1：購物中心＋辦公塔（右翼後方升起）
    {const o=mk(k),rk=R(k,1),L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const cx=204,by=206,a=22,b=22,h=156;
      box(g,cx,by,a,b,h,'#e6d8c0','#b9a78a','#9a8870');
      wins(g,ng,cx,by,a,b,h,rk,{w:3,ht:5,gx:6,gy:8,glass:'#5f7890',lit:'#ffe0a8',p:.5,top:16,bot:30,mL:3,mR:3});
      // 冠頂：退縮兩階＋紅色簷帶
      const t1=by-h;
      g.fillStyle='#c0453a';for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-h+6,1,3);}
      g.fillStyle='#8f342b';for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-h+6,1,3);}
      const c1=t1-(a>>1)+7;box(g,cx,c1,14,14,10,'#efe4d0','#c4b394','#a8967a',{noAO:true});
      const c2=c1-10-7+3;box(g,cx,c2,6,6,10,'#efe4d0','#c4b394','#8a7a60',{noAO:true});
      const c3=c2-10-3;rect(g,cx,c3-14,1,14,'#8a8a92');rect(g,cx-1,c3-15,3,2,'#c84a3a');ng.fillStyle='#ff6d5f';ng.fillRect(cx-1,c3-15,3,2);
      ng.fillStyle='#ffb0a0';for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);ng.fillRect(cx-dx,yF-h+7,1,1);}
      stamp(o,L,OL);
      restamp(o,(x,y,r,gg,b,a)=>(x>=178&&x<=230&&y>=170&&y<=246)||(x>=166&&x<=242&&y>=150&&y<170&&a>200&&!plateLike(r,gg,b)));
      B[k+'_1_1']=fin(o);}

    // v2：屋頂摩天輪＋右翼 LED 大螢幕
    {const o=mk(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const hx=72,hy=112,Rw=42;
      // 支架（A 字腳）
      const legs=[[hx,hy,54,179],[hx,hy,90,179]];
      for(const l of legs){ln(g,l[0],l[1],l[2],l[3],'#8a8f98');ln(g,l[0]+1,l[1],l[2]+1,l[3],'#6a707a');}
      ln(g,58,160,86,160,'#8a8f98');
      rect(g,49,178,10,3,'#6a707a');rect(g,85,178,10,3,'#6a707a');
      // 輪輻（不描邊層）
      const Sp=layer(o.W,o.H);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;ln(Sp.g,hx,hy,hx+Math.round(Rw*Math.cos(a)),hy+Math.round(Rw*Math.sin(a)),'#c9ccd2');}
      ring(g,hx,hy,Rw,'#e8e4dc');ring(g,hx,hy,Rw-1,'#b8bcc4');ring(g,hx,hy,Rw-6,'#d8d4cc');
      rect(g,hx-3,hy-3,6,6,'#8a8f98');rect(g,hx-2,hy-2,4,4,'#c0453a');
      const GC=['#c0453a','#3a8a7a','#d8a83a','#5f7eb8'];
      for(let i=0;i<12;i++){const a=i*Math.PI/6+Math.PI/12;const px=hx+Math.round(Rw*Math.cos(a)),py=hy+Math.round(Rw*Math.sin(a));
        rect(g,px,py,1,2,'#6a707a');rect(g,px-2,py+2,5,4,GC[i%4]);rect(g,px-2,py+2,5,1,shade(GC[i%4],30));rect(g,px-1,py+3,3,1,'#f2ead8');
        ng.fillStyle='#ffe9b0';ng.fillRect(px-1,py+3,3,1);}
      for(let i=0;i<24;i++){if(i%2)continue;const a=i*Math.PI/12;const px=hx+Math.round((Rw-1)*Math.cos(a)),py=hy+Math.round((Rw-1)*Math.sin(a));
        rect(g,px,py,1,1,'#fff8e0');ng.fillStyle='#fffbe5';ng.fillRect(px,py,1,1);}
      // 右翼屋頂 LED 看板
      {const bx=184,byy=168;rect(g,bx+6,byy-4,2,6,'#6a707a');rect(g,bx+34,byy-4,2,6,'#6a707a');
        rect(g,bx,byy-24,42,20,'#2a3038');rect(g,bx+2,byy-22,38,16,'#3e6f86');rect(g,bx+2,byy-22,38,4,'#6aa6c0');rect(g,bx+6,byy-15,14,6,'#d8a83a');rect(g,bx+22,byy-15,14,6,'#c0453a');
        ng.fillStyle='#8fd8f0';ng.fillRect(bx+2,byy-22,38,16);ng.fillStyle='#ffd070';ng.fillRect(bx+6,byy-15,14,6);ng.fillStyle='#ff8a72';ng.fillRect(bx+22,byy-15,14,6);}
      A.outlineSprite(L.c,...OL);
      o.g.drawImage(Sp.c,0,0);
      stamp(o,L,null);
      restamp(o,(x,y,r,gg,b,a)=>((x>=166&&x<=242&&y>=150)||(x>=10&&x<=108&&y>=160))&&y<=246&&a>200&&!plateLike(r,gg,b)&&!(y<171&&x>=176&&x<=230));
      B[k+'_1_2']=fin(o);}
  })();

  /* ================= k105 住宅巨廈 (3×3 巨構) ================= */
  (function(){
    const k=105;if(!B[k+'_1_0'])return;
    const pal={light:'#fdeddb',mid:'#d49780',dark:'#8a5148',accent:'#9ed09c',roof:'#b8884a',glass:'#27364c',lit:'#fffbe5'};
    /* v574 第三輪（退件修）：專用立面 fac105——
       窗改 v0 節奏（3×5 窗、隔欄隔列：gx7/gy11，樓層之間留素牆帶），
       拿掉 mbox 的平面 1px 橫線／陽台橫條／直向亮線（沿斜牆畫成「橫虛線＋點陣」噪點牆的來源）；
       夜窗點亮率 ~0.5（與 v0 metroFacade516 的 .54 同級）。只在本分類內使用，不動共用 mbox。 */
    function fac105(o,cx,by,a,b,h,rk,litP){
      const T=layer(o.W,o.H),g=T.g,ng=T.ng;
      box(g,cx,by,a,b,h,pal.light,pal.dark,pal.roof);
      if(h>=16)wins(g,ng,cx,by,a,b,h,rk,{w:3,ht:5,gx:7,gy:11,glass:pal.glass,lit:pal.lit,p:litP||.5,top:6,bot:5,mL:4,mR:3,metro:true});
      const x0=Math.max(0,cx-a-1),x1=Math.min(o.W-1,cx+b+1),y0=Math.max(0,by-h-((a+b)>>1)-1),y1=Math.min(o.H-1,by+1),w=x1-x0+1,hh=y1-y0+1;
      const td=g.getImageData(x0,y0,w,hh).data,tn=ng.getImageData(x0,y0,w,hh).data;
      const D=o.g.getImageData(x0,y0,w,hh),dd=D.data,N=o.ng.getImageData(x0,y0,w,hh),nd=N.data;
      for(let y=0;y<hh;y++)for(let x=0;x<w;x++){
        if(!inBox(x+x0,y+y0,cx,by,a,b,h,0))continue;const i=(y*w+x)*4;if(td[i+3]<200)continue;
        for(let q=0;q<4;q++){dd[i+q]=td[i+q];nd[i+q]=tn[i+q];}}
      o.g.putImageData(D,x0,y0);o.ng.putImageData(N,x0,y0);
      return by-h;
    }
    // v1：三塔高低錯落＋空中連廊＋樓頂花園（第三輪：最高後塔 300→255、後塔 32→24 收窄、前塔同步收瘦壓低，總像素壓到 ≤1.25×v0）
    try{const rk=R(k,1),o=metroBase(pal,rk,false);
      const T=(u1,v1,a,h)=>{const S=MP(u1,v1,22);fac105(o,S[0],S[1],a,a,h,rk,.54);return S;};
      T(46,46,24,255);
      T(48,86,26,196);T(86,48,24,136);
      // 空中連廊：前兩塔內角同深度 ⇒ 螢幕水平（x 140..165）
      {const y0=300,xa=140,wb=26;rect(o.g,xa,y0,wb,1,shade(pal.light,12));rect(o.g,xa,y0+1,wb,7,pal.mid);rect(o.g,xa,y0+2,wb,3,pal.glass);
        rect(o.g,xa,y0+6,wb,2,shade(pal.dark,-10));
        o.g.fillStyle=pal.light;for(let x=xa+4;x<xa+wb-2;x+=5)o.g.fillRect(x,y0+2,1,3);
        o.ng.fillStyle=pal.lit;for(let x=xa+5;x<xa+wb-2;x+=10)o.ng.fillRect(x,y0+2,4,3);
        ln(o.g,xa+2,y0+8,xa,y0+12,pal.dark);ln(o.g,xa+wb-3,y0+8,xa+wb-1,y0+12,pal.dark);}
      // 樓頂花園（塔頂菱形中心＝(S.x, S.y-h-a/2)）
      for(const[cx,cy]of[[152,127],[114,206],[190,267]]){
        rect(o.g,cx-7,cy-1,15,1,shade(pal.roof,-18));
        tree(o.g,cx-6,cy+3);tree(o.g,cx+5,cy+1);tree(o.g,cx,cy+8);}
      A.outlineSprite(o.c,20,24,35);halo541(o);
      B[k+'_1_1']=fin(o);}catch(e){console.error('v574 k105 v1',e);}
    // v2：瀑布式退台板樓（第三輪：5 階→4 階、最高階 260→208、板寬 76→70；每階頂綠化平台）
    try{const rk=R(k,2),o=metroBase(pal,rk,false);
      const U0=16,steps=[[10,32,208],[32,52,150],[52,72,96],[72,90,44]];
      for(let i=0;i<steps.length;i++){const[v0,v1,h]=steps[i],S=MP(86,v1,22),b=v1-v0;
        fac105(o,S[0],S[1],86-U0,b,h,rk,.54);
        const top=22+h,Q=(u,v)=>MP(u,v,top);
        const r0=Q(84,v1-1),r1=Q(U0+2,v1-1);ln(o.g,r0[0],r0[1],r1[0],r1[1],'#e8dccb');
        for(let u=78;u>=U0+6;u-=12){const p=Q(u,v1-4);rect(o.g,p[0]-2,p[1]-3,5,3,'#4f8a50');rect(o.g,p[0]-1,p[1]-4,3,1,'#6aaa62');}
        if(i===0){for(const u of[70,50,30]){const p=Q(u,v0+10);tree(o.g,p[0],p[1]);}}
      }
      A.outlineSprite(o.c,20,24,35);halo541(o);
      B[k+'_1_2']=fin(o);}catch(e){console.error('v574 k105 v2',e);}
  })();

  /* ================= k106 商業綜合體 (3×3 巨構) ================= */
  (function(){
    const k=106;if(!B[k+'_1_0'])return;
    const pal={light:'#98bcd8',mid:'#4e708f',dark:'#263b55',accent:'#ef715f',roof:'#3d5a78',glass:'#324761',lit:'#fffbe5'};
    // v1：雙子玻璃塔＋空橋＋退縮冠頂尖塔
    {const rk=R(k,1),o=metroBase(pal,rk,true);
      for(const[u1,v1]of[[48,84],[84,48]]){
        const S=MP(u1,v1,22),cx=S[0];
        mbox(o,cx,S[1],28,28,300,pal,rk,{litP:.72});
        mbox(o,cx,110,20,20,16,pal,rk,{litP:.72,band:pal.accent});
        mbox(o,cx,90,12,12,14,pal,rk,{litP:.6});
        rect(o.g,cx-1,34,2,36,'#7996af');rect(o.g,cx-2,62,4,8,'#4e708f');rect(o.g,cx-1,31,2,3,pal.accent);
        o.ng.fillStyle='#ff6d5f';o.ng.fillRect(cx-1,30,2,3);
      }
      // 空橋（兩塔內角同深度 ⇒ 螢幕水平）
      rect(o.g,142,226,20,6,pal.mid);rect(o.g,142,226,20,1,shade(pal.light,10));rect(o.g,143,228,18,2,pal.glass);
      o.ng.fillStyle=pal.lit;for(let x=144;x<160;x+=4)o.ng.fillRect(x,228,2,2);
      ln(o.g,146,232,143,240,pal.dark);ln(o.g,157,232,160,240,pal.dark);
      A.outlineSprite(o.c,20,24,35);halo541(o);
      B[k+'_1_1']=fin(o);}
    // v2：裝飾藝術風退台大樓（胖、階梯冠、樓台霓虹招牌；暖石材）
    {const rk=R(k,2);
      const dp={light:'#d6cfba',mid:'#8d795b',dark:'#6a5a44',accent:'#e0a040',roof:'#5c5040',glass:'#3b3d45',lit:'#fffbe5'};
      const o=metroBase(dp,rk,true);
      mbox(o,152,424,56,56,120,dp,rk,{litP:.66,band:dp.accent});
      mbox(o,152,296,40,40,90,dp,rk,{litP:.66,band:dp.accent});
      mbox(o,152,199,26,26,70,dp,rk,{litP:.6,band:dp.accent});
      mbox(o,152,123,14,14,24,dp,rk,{litP:.5,band:dp.accent});
      box(o.g,152,94,4,4,6,dp.light,dp.dark,dp.roof,{noAO:true});
      rect(o.g,151,46,2,40,'#b0a488');rect(o.g,150,70,4,3,dp.accent);rect(o.g,151,43,2,3,'#c84a3a');
      o.ng.fillStyle='#ff6d5f';o.ng.fillRect(151,43,2,3);
      // 樓台霓虹招牌（站在第一階平台左側）
      {const P1=MP(30,72,142),P2=MP(60,72,142);
        poly(o.g,[MP(30,72,142),MP(60,72,142),MP(60,72,155),MP(30,72,155)],'#2a2a30');
        poly(o.g,[MP(31,72,144),MP(59,72,144),MP(59,72,153),MP(31,72,153)],'#3e3a44');
        const NC=['#ff7aa8','#7ae0ff','#ffd06a','#ff7aa8'];
        for(let i=0;i<4;i++){const p=MP(34+i*7,72,151);rect(o.g,p[0]-4,p[1],4,5,NC[i]);rect(o.g,p[0]-3,p[1]+1,2,3,'#3e3a44');
          o.ng.fillStyle=NC[i];o.ng.fillRect(p[0]-4,p[1],4,5);}
        rect(o.g,P1[0]+3,P1[1],1,3,'#2a2a30');rect(o.g,P2[0]-3,P2[1],1,3,'#2a2a30');}
      A.outlineSprite(o.c,20,24,35);halo541(o);
      B[k+'_1_2']=fin(o);}
  })();

  /* ================= k87 農貿市場 (2×2) ================= */
  (function(){
    const k=87;if(!B[k+'_1_0'])return;
    const P=(u,v,z)=>[68+u-v,84+(u+v)/2-(z||0)],OL87=[64,58,40];
    const sandLike=(r,g,b)=>r>140&&(r-b)>=18&&(r-b)<=58&&(r-g)>=-2&&(r-g)<=18;
    // v1：鋼構大棚（開放式山形浪板屋頂罩住攤位）
    {const o=mk(k),rk=R(k,1);
      const S=P(62,44),Q=Qf(S[0],S[1]),a=60,b=42,ez=38,rz=50;
      // 後排柱（在攤位後方）
      const LB=layer(o.W,o.H);
      for(const p of[0,20,40,60]){const t=Q(p,b,ez),g0=Q(p,b,0);rect(LB.g,t[0]-1,t[1],2,g0[1]-t[1],'#7a8088');rect(LB.g,t[0],t[1],1,g0[1]-t[1],'#5a6068');}
      stamp(o,LB,OL87);
      restamp(o,(x,y,r,g,b2,a2)=>x>=28&&x<=134&&y>=44&&y<=120&&a2>200&&!sandLike(r,g,b2));
      // 棚下陰影
      shadowPoly(o,[Q(-4,0,0),Q(a-4,0,0),Q(a-4,b,0),Q(-4,b,0)].map(p=>[p[0]+4,p[1]]),.2);
      const L=layer(o.W,o.H),g=L.g,ng=L.ng;
      for(const p of[0,20,40,60]){const t=Q(p,0,ez),g0=Q(p,0,0);rect(g,t[0]-1,t[1],2,g0[1]-t[1],'#8a9098');rect(g,t[0],t[1],1,g0[1]-t[1],'#62686f');}
      {const t=Q(0,21,ez),g0=Q(0,21,0);rect(g,t[0]-1,t[1],2,g0[1]-t[1],'#8a9098');rect(g,t[0],t[1],1,g0[1]-t[1],'#62686f');}
      poly(g,[Q(0,21,rz),Q(a,21,rz),Q(a,b,ez),Q(0,b,ez)],'#4a7d6a');
      poly(g,[Q(0,0,ez),Q(a,0,ez),Q(a,21,rz),Q(0,21,rz)],'#6aa58c');
      for(let p=4;p<a;p+=5){const p0=Q(p,0,ez),p1=Q(p,21,rz);ln(g,p0[0],p0[1],p1[0],p1[1],'#5b937c');}
      poly(g,[Q(0,0,ez),Q(0,b,ez),Q(0,21,rz)],'#50615b');
      {const p0=Q(0,5,ez+1),p1=Q(0,21,rz-3),p2=Q(0,37,ez+1);ln(g,p0[0],p0[1],p1[0],p1[1],'#7a8a84');ln(g,p1[0],p1[1],p2[0],p2[1],'#7a8a84');}
      {const r0=Q(0,21,rz),r1=Q(a,21,rz);ln(g,r0[0],r0[1],r1[0],r1[1],'#dcd6c4');ln(g,r0[0],r0[1]+1,r1[0],r1[1]+1,'#9ab8a8');}
      {const e0=Q(0,0,ez),e1=Q(a,0,ez);ln(g,e0[0],e0[1],e1[0],e1[1],'#3f6a5a');}
      // 簷下吊燈
      for(const p of[10,30,50]){const q=Q(p,1,ez-2);rect(g,q[0],q[1]-1,1,2,'#50565c');rect(g,q[0]-1,q[1]+1,3,2,'#e8d8a0');ng.fillStyle='#ffe9b0';ng.fillRect(q[0]-1,q[1]+1,3,2);}
      stamp(o,L,OL87);
      B[k+'_1_1']=fin(o);}
    // v2：兩層紅瓦市場樓（西北側，拱廊入口＋山牆鐘面招牌），前方保留攤位與菜箱
    {const o=mk(k),rk=R(k,2),L=layer(o.W,o.H),g=L.g,ng=L.ng;
      const S=P(26,62),cx=S[0],by=S[1],a=24,b=60,h=34,r=12,Q=Qf(cx,by);
      shadowPoly(o,[Q(0,0,0),[Q(0,0,0)[0]+8,Q(0,0,0)[1]-1],[Q(0,b,0)[0]+8,Q(0,b,0)[1]-1],Q(0,b,0)],.22);
      const WL='#eadcbc',WR='#c9b48e';
      poly(g,[Q(a/2,0,h+r),Q(a/2,b,h+r),Q(a,b,h),Q(a,0,h)],'#c47a52');
      poly(g,[Q(0,0,h),Q(0,b,h),Q(a/2,b,h+r),Q(a/2,0,h+r)],'#9a5436');
      for(const pp of[4,8]){const z=h+r*pp/(a/2),p0=Q(pp,1,z),p1=Q(pp,b-1,z);ln(g,p0[0],p0[1],p1[0],p1[1],'#8a482e');}
      poly(g,[Q(0,0,0),Q(0,b,0),Q(0,b,h),Q(0,0,h)],WR);
      poly(g,[Q(0,0,0),Q(a,0,0),Q(a,0,h),Q(a/2,0,h+r),Q(0,0,h)],WL);
      {const r0=Q(a/2,0,h+r),r1=Q(a/2,b,h+r);ln(g,r0[0],r0[1],r1[0],r1[1],'#d89068');}
      // 樓層腰線
      g.fillStyle='#b09a74';for(let dx=0;dx<b;dx++){const yF=by-((dx+1)>>1);g.fillRect(cx+dx,yF-18,1,2);}
      g.fillStyle='#d8c8a4';for(let dx=1;dx<=a;dx++){const yF=by-(dx>>1);g.fillRect(cx-dx,yF-18,1,2);}
      // 右長面：一樓拱廊（開口隨牆面斜度逐欄畫）
      for(let q0=4;q0<b-6;q0+=11){
        for(let d=0;d<7;d++){const x=cx+q0+d,yF=by-((q0+d+1)>>1),cut=(d===0||d===6)?2:(d===1||d===5)?1:0;
          g.fillStyle='#3a2e26';g.fillRect(x,yF-13+cut,1,13-cut);}
        const m=cx+q0+3,yF=by-((q0+4)>>1);
        rect(g,m-2,yF-4,2,2,['#e05252','#7be08a','#ffb35a','#f0d060','#5ec8ff'][(q0>>3)%5]);rect(g,m+1,yF-4,2,2,'#e8a03a');
        rect(g,m,yF-12,1,1,'#e8d8a0');
        ng.fillStyle='rgba(255,205,130,.85)';for(let d=1;d<6;d++){const yF2=by-((q0+d+1)>>1);ng.fillRect(cx+q0+d,yF2-11,1,9);}
      }
      // 二樓拱窗
      for(let q0=6;q0<b-6;q0+=11){const yF=by-((q0+2)>>1);A.winShape570(g,ng,cx+q0,yF-29,3,6,'arch','#3a4a5a','#ffe0a8','#f2e8d0',rk()<.5);}
      // 山牆：一樓拱門＋招牌＋鐘面
      for(let d=0;d<7;d++){const dx=8+d,x=cx-dx,yF=by-(dx>>1),cut=(d===0||d===6)?2:(d===1||d===5)?1:0;g.fillStyle='#3a2e26';g.fillRect(x,yF-13+cut,1,13-cut);
        ng.fillStyle='rgba(255,205,130,.85)';if(d>0&&d<6)ng.fillRect(x,yF-11,1,9);}
      {const q=Q(a/2,0,27);rect(g,q[0]-7,q[1]-3,14,5,'#c0453a');rect(g,q[0]-7,q[1]-3,14,1,'#d8695a');for(let i=0;i<3;i++)rect(g,q[0]-5+i*4,q[1]-1,2,2,'#fff4dc');
        ng.fillStyle='#ff9a80';ng.fillRect(q[0]-7,q[1]-3,14,5);ng.fillStyle='#fff4dc';for(let i=0;i<3;i++)ng.fillRect(q[0]-5+i*4,q[1]-1,2,2);}
      {const q=Q(a/2,0,h+4);rect(g,q[0]-2,q[1]-2,5,5,'#f4ecd8');rect(g,q[0]-1,q[1]-3,3,1,'#f4ecd8');rect(g,q[0]-1,q[1]+3,3,1,'#f4ecd8');rect(g,q[0],q[1]-1,1,2,'#3a2e26');rect(g,q[0]+1,q[1],1,1,'#3a2e26');}
      // 屋脊通風塔
      {const q=Q(a/2,b*0.5,h+r);box(g,q[0],q[1]+3,4,4,6,'#eadcbc','#c9b48e','#9a5436',{noAO:true});}
      stamp(o,L,OL87);
      // v574 修：中間綠攤被市場樓擋住後，棚頂右端與串燈在樓右側懸空——清掉（樓體像素保留；橘攤 y≥89 不動）
      {const ld=L.c.getContext('2d').getImageData(0,0,o.W,o.H).data,D=o.g.getImageData(0,0,o.W,o.H),N=o.ng.getImageData(0,0,o.W,o.H);
        for(let y=66;y<=88;y++)for(let x=93;x<=98;x++){const i=(y*o.W+x)*4;if(ld[i+3]>0)continue;D.data[i+3]=0;N.data[i+3]=0;}
        o.g.putImageData(D,0,0);o.ng.putImageData(N,0,0);}
      // 前排菜箱蓋回
      restamp(o,(x,y,r,gg,b2,a2)=>y>=104&&y<=130&&x>=44&&x<=112&&a2>200&&!sandLike(r,gg,b2)&&((x-68)+2*(y-84))/2>23);
      B[k+'_1_2']=fin(o);}
  })();
});
