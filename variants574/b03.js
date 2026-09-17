(window.__variants574=window.__variants574||[]).push(function b03(A){
  const SPR=A.SPR(), B=SPR.bld;
  const sh=A.shade;
  /* ================= b03 引擎：等距投影 + 像素中心多邊形（無反鋸齒） ================= */
  // 世界座標：原點＝地塊北頂點；u 往右下、v 往左下（1 單位＝水平 1px），z 往上（1 單位＝1px）
  const mkI=(Nx,Ny)=>(u,v,z)=>[Nx+u-v,Ny+(u+v)/2-(z||0)];
  function poly(g,P,col){
    const n=P.length;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,ar=0;
    for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];x0=Math.min(x0,a[0]);x1=Math.max(x1,a[0]);y0=Math.min(y0,a[1]);y1=Math.max(y1,a[1]);ar+=a[0]*b[1]-b[0]*a[1];}
    if(Math.abs(ar)<1e-9)return;const s=ar>0?1:-1;
    x0=Math.floor(x0);x1=Math.ceil(x1);y0=Math.floor(y0);y1=Math.ceil(y1);
    g.fillStyle=col;
    for(let y=y0;y<y1;y++){let run=-1;const cy=y+.5;
      for(let x=x0;x<=x1;x++){const cx=x+.5;let ins=true;
        for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];if(((b[0]-a[0])*(cy-a[1])-(b[1]-a[1])*(cx-a[0]))*s<-1e-7){ins=false;break;}}
        if(ins){if(run<0)run=x;}else if(run>=0){g.fillRect(run,y,x-run,1);run=-1;}
      }
      if(run>=0)g.fillRect(run,y,x1+1-run,1);
    }
  }
  const Q=(g,I,pts,col)=>poly(g,pts.map(p=>I(p[0],p[1],p[2])),col);
  // 方盒：左面(v=v1)亮、右面(u=u1)暗、頂面；edge=true 時頂面後緣受光、前緣簷影
  function box(g,I,u0,u1,v0,v1,z0,z1,cL,cR,cT,edge){
    if(cR)Q(g,I,[[u1,v0,z0],[u1,v1,z0],[u1,v1,z1],[u1,v0,z1]],cR);
    if(cL)Q(g,I,[[u0,v1,z0],[u1,v1,z0],[u1,v1,z1],[u0,v1,z1]],cL);
    if(cT){Q(g,I,[[u0,v0,z1],[u1,v0,z1],[u1,v1,z1],[u0,v1,z1]],cT);
      if(edge!==false){
        const a=I(u0,v1,z1),b=I(u0,v0,z1),c=I(u1,v0,z1);
        poly(g,[a,b,[b[0],b[1]+1],[a[0],a[1]+1]],sh(cT,16));poly(g,[b,c,[c[0],c[1]+1],[b[0],b[1]+1]],sh(cT,16));
        const d=I(u1,v1,z1);
        poly(g,[a,d,[d[0],d[1]-1],[a[0],a[1]-1]],sh(cT,-22));poly(g,[d,c,[c[0],c[1]-1],[d[0],d[1]-1]],sh(cT,-22));
      }}
  }
  // 雙坡頂：脊沿 u（山牆朝 +u 右面）
  function gableU(g,I,u0,u1,v0,v1,zb,rise,cF,cB,cEnd){
    const vm=(v0+v1)/2,zt=zb+rise;
    Q(g,I,[[u0,v0,zb],[u1,v0,zb],[u1,vm,zt],[u0,vm,zt]],cB);
    Q(g,I,[[u0,v1,zb],[u1,v1,zb],[u1,vm,zt],[u0,vm,zt]],cF);
    if(cEnd)Q(g,I,[[u1,v0,zb],[u1,v1,zb],[u1,vm,zt]],cEnd);
    const a=I(u0,vm,zt),b=I(u1,vm,zt);poly(g,[a,b,[b[0],b[1]+1],[a[0],a[1]+1]],sh(cF,18));
  }
  // 雙坡頂：脊沿 v（山牆朝 +v 左面）
  function gableV(g,I,u0,u1,v0,v1,zb,rise,cF,cB,cEnd){
    const um=(u0+u1)/2,zt=zb+rise;
    Q(g,I,[[u0,v0,zb],[u0,v1,zb],[um,v1,zt],[um,v0,zt]],cB);
    Q(g,I,[[u1,v0,zb],[u1,v1,zb],[um,v1,zt],[um,v0,zt]],cF);
    if(cEnd)Q(g,I,[[u0,v1,zb],[u1,v1,zb],[um,v1,zt]],cEnd);
    const a=I(um,v0,zt),b=I(um,v1,zt);poly(g,[a,b,[b[0]+1,b[1]],[a[0]+1,a[1]]],sh(cB,14));
  }
  // 四坡/金字塔頂（脊長 0 時為金字塔）；c=[+v面(亮),+u面(暗),-u面,-v面]
  function hip(g,I,u0,u1,v0,v1,zb,rise,c,ridgeAlongU){
    const um=(u0+u1)/2,vm=(v0+v1)/2,zt=zb+rise;
    let r1,r2;
    if(ridgeAlongU){const k=Math.max(0,((u1-u0)-(v1-v0))/2);r1=[u0+k+(v1-v0)/2,vm,zt];r2=[u1-k-(v1-v0)/2,vm,zt];}
    else{const k=Math.max(0,((v1-v0)-(u1-u0))/2);r1=[um,v0+k+(u1-u0)/2,zt];r2=[um,v1-k-(u1-u0)/2,zt];}
    if(ridgeAlongU){
      Q(g,I,[[u0,v0,zb],[u1,v0,zb],r2,r1],c[3]);Q(g,I,[[u0,v0,zb],[u0,v1,zb],r1],c[2]);
      Q(g,I,[[u1,v0,zb],[u1,v1,zb],r2],c[1]);Q(g,I,[[u0,v1,zb],[u1,v1,zb],r2,r1],c[0]);
    }else{
      Q(g,I,[[u0,v0,zb],[u0,v1,zb],r2,r1],c[2]);Q(g,I,[[u0,v0,zb],[u1,v0,zb],r1],c[3]);
      Q(g,I,[[u0,v1,zb],[u1,v1,zb],r2],c[0]);Q(g,I,[[u1,v0,zb],[u1,v1,zb],r2,r1],c[1]);
    }
  }
  // 立面上的平行四邊形（左面 v=const / 右面 u=const）
  const paraL=(g,I,v,uA,uB,zA,zB,col)=>Q(g,I,[[uA,v,zA],[uB,v,zA],[uB,v,zB],[uA,v,zB]],col);
  const paraR=(g,I,u,vA,vB,zA,zB,col)=>Q(g,I,[[u,vA,zA],[u,vB,zA],[u,vB,zB],[u,vA,zB]],col);
  const paraT=(g,I,u0,u1,v0,v1,z,col)=>Q(g,I,[[u0,v0,z],[u1,v0,z],[u1,v1,z],[u0,v1,z]],col);
  // 窗：左面以 u 為左緣、右面以 v 為右緣（畫面上左緣 x=Nx+u-v）
  const px=(p)=>[Math.round(p[0]),Math.round(p[1])];
  function winL(g,ng,I,v,u,z,w,h,kind,glass,lit,trim,on){const p=px(I(u,v,z));A.winShape570(g,ng,p[0],p[1],w,h,kind,glass,lit,trim,on);}
  function winR(g,ng,I,u,v,z,w,h,kind,glass,lit,trim,on){const p=px(I(u,v,z));A.winShape570(g,ng,p[0],p[1],w,h,kind,glass,lit,trim,on);}
  // 圓柱（沿 z）：以中心 (u,v) 半徑 r；左亮右暗漸層
  function cyl(g,I,u,v,r,z0,z1,cL,cR,cT){
    const c0=I(u,v,z0),c1=I(u,v,z1),rx=r*Math.SQRT2,ry=rx/2;
    const x0=Math.floor(c0[0]-rx),x1=Math.ceil(c0[0]+rx);
    for(let x=x0;x<x1;x++){const t=(x+.5-c0[0])/rx;if(Math.abs(t)>1)continue;const e=ry*Math.sqrt(1-t*t);
      const yb=Math.round(c0[1]+e),yt=Math.round(c1[1]+e);
      g.fillStyle=t<-.35?cL:(t>.35?cR:mix(cL,cR,(t+.35)/.7));g.fillRect(x,yt,1,Math.max(0,yb-yt));}
    if(cT){for(let x=x0;x<x1;x++){const t=(x+.5-c1[0])/rx;if(Math.abs(t)>1)continue;const e=ry*Math.sqrt(1-t*t);
      g.fillStyle=cT;g.fillRect(x,Math.round(c1[1]-e),1,Math.max(1,Math.round(2*e)));}}
  }
  // 穹頂：底圓心 (u,v,z) 半徑 r、高 H
  function dome(g,I,u,v,z,r,H,col,hi,lo){
    const c=I(u,v,z),rx=r*Math.SQRT2,ry=rx/2;
    const x0=Math.floor(c[0]-rx),x1=Math.ceil(c[0]+rx);
    for(let x=x0;x<x1;x++){const t=(x+.5-c[0])/rx;if(Math.abs(t)>1)continue;const q=Math.sqrt(1-t*t);
      const yb=Math.round(c[1]+ry*q),yt=Math.round(c[1]-H*q);
      for(let y=yt;y<yb;y++){const s=(c[1]-y)/Math.max(1,H*q);// 0 底 → 1 頂
        const lv=-t*.8+s*.5;g.fillStyle=lv>.45?hi:(lv<-.25?lo:col);g.fillRect(x,y,1,1);}}
  }
  // 圓錐頂：底圓心 (u,v,z) 半徑 r、高 H；左亮、中、右暗三段
  function cone(g,I,u,v,z,r,H,cL,cM,cR){
    const c=I(u,v,z),rx=r*Math.SQRT2,ry=rx/2,apY=c[1]-H;
    const x0=Math.floor(c[0]-rx),x1=Math.ceil(c[0]+rx);
    for(let x=x0;x<x1;x++){const t=(x+.5-c[0])/rx;if(Math.abs(t)>1)continue;
      const yt=Math.round(apY+Math.abs(t)*(c[1]-apY)),yb=Math.round(c[1]+ry*Math.sqrt(1-t*t));
      g.fillStyle=t<-.3?cL:(t>.3?cR:cM);g.fillRect(x,yt,1,Math.max(1,yb-yt));}
  }
  function mix(a,b,t){const A1=parseInt(a.slice(1),16),B1=parseInt(b.slice(1),16);const f=(s)=>Math.round(((A1>>s)&255)*(1-t)+((B1>>s)&255)*t);
    return '#'+((f(16)<<16)|(f(8)<<8)|f(0)).toString(16).padStart(6,'0');}
  // 直線（1px，整數步進）
  function line(g,a,b,col){const x0=Math.round(a[0]),y0=Math.round(a[1]),x1=Math.round(b[0]),y1=Math.round(b[1]);
    const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);g.fillStyle=col;
    for(let i=0;i<=n;i++)g.fillRect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1);}
  /* ================= 地塊與管線後製（複刻 plate + T526 + T528 + T479，讓新圖與 v0 同一質感） ================= */
  function plateOn(g,ax,ay,sz,col,rk,nSp,eD,eL){
    const hw=32*sz,ty=ay-hw;A.dia(g,ax,ty,hw,col);
    const cols=[sh(col,-10),sh(col,8)];
    for(let i=0;i<(nSp|0);i++){const yy=1+Math.floor(rk()*(hw-2));const hr=Math.max(1,(yy<hw/2?(yy+1):(hw-yy))*2-2);
      const xx=ax-hr+Math.floor(rk()*hr*2);g.fillStyle=cols[Math.floor(rk()*2)];g.fillRect(xx,ty+yy,2,1);}
    A.diaEdge(g,6,eD||sh(col,-20),ax,ty,hw);A.diaEdge(g,9,eL||sh(col,10),ax,ty,hw);
  }
  function polish(c,o){ // o:{ax,ay,w0,full,rk}
    const g=c.getContext('2d'),w=c.width,h=c.height,sc=Math.max(.6,Math.min(3,o.w0/72));
    g.save();if(!o.full)g.globalCompositeOperation='source-atop';
    g.fillStyle='rgba(10,14,24,.16)';g.beginPath();g.ellipse(o.ax+8*sc,o.ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();g.restore();
    const im=g.getImageData(0,0,w,h),d=im.data;
    const rows=[];let top=-1;
    for(let y=0;y<h;y++){let L=-1,R=-1;for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]>40){if(L<0)L=x;R=x;}}rows[y]=L>=0?[L,R]:null;if(L>=0&&top<0)top=y;}
    if(o.full)for(let y=0;y<h;y++){const r=rows[y];if(!r)continue;
      for(let x=r[0];x<Math.min(r[0]+2,w);x++){const i=(y*w+x)*4;d[i]=Math.min(255,d[i]*1.14+12);d[i+1]=Math.min(255,d[i+1]*1.14+12);d[i+2]=Math.min(255,d[i+2]*1.14+12);}
      const i=(y*w+r[1])*4;d[i]*=.88;d[i+1]*=.88;d[i+2]*=.88;}
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]<=40)continue;if((((x>>1)+(y>>1))&3)===0){d[i]*=.955;d[i+1]*=.955;d[i+2]*=.955;}}
    if(top>=0)for(let y=h-2;y>top+8;y-=8){const r=rows[y];if(!r)continue;for(let x=r[0];x<=r[1];x++){const i=(y*w+x)*4;if(d[i+3]>40){d[i]*=.93;d[i+1]*=.93;d[i+2]*=.93;}}}
    g.putImageData(im,0,0);
    g.save();g.globalCompositeOperation='source-atop';
    let gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,236,194,.075)');gr.addColorStop(.52,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(28,35,43,.10)');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'],dn=Math.min(360,Math.max(10,Math.floor(w*h/520)));
    for(let i=0;i<dn;i++){const x=Math.floor(o.rk()*w),y=Math.floor(o.rk()*h);g.fillStyle=cols[Math.floor(o.rk()*3)%3];g.fillRect(x,y,o.rk()<.74?1:2,o.rk()<.88?1:2);}
    gr=g.createLinearGradient(0,h*.28,w,h*.92);gr.addColorStop(0,'rgba(222,213,190,.035)');gr.addColorStop(1,'rgba(43,49,54,.07)');g.fillStyle=gr;g.fillRect(0,0,w,h);
    g.fillStyle='rgba(68,62,55,.075)';for(let y=Math.floor(h*.36);y<Math.floor(h*.86);y+=8){const off=Math.floor(o.rk()*5);g.fillRect(Math.floor(w*.22)+off,y,Math.floor(w*.78)-off-(Math.floor(w*.22)+off),1);}
    gr=g.createLinearGradient(0,h*.72,0,h);gr.addColorStop(0,'rgba(25,28,30,0)');gr.addColorStop(1,'rgba(20,23,25,.13)');g.fillStyle=gr;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();
  }
  const layer=(w,h)=>A.cv(w,h);
  function stamp(dstG,L,ol){if(ol)A.outlineSprite(L,ol[0],ol[1],ol[2]);dstG.drawImage(L,0,0);}
  function nightCut(nc,L){const g=nc.getContext('2d');g.save();g.globalCompositeOperation='destination-out';g.drawImage(L,0,0);g.restore();}
  function lamp(g,ng,x,y,hgt,pole,head,glow){g.fillStyle=pole;g.fillRect(x,y-hgt,1,hgt);g.fillStyle=head;g.fillRect(x-1,y-hgt-1,3,2);if(ng){ng.fillStyle=glow;ng.fillRect(x-1,y-hgt-1,3,2);}}
  function put(key,c,nc,ax,ay,smoke){B[key]={img:c,night:nc,ax,ay,w:c.width,h:c.height,smoke:smoke||[]};}
  const OL=[26,30,44];
  /* ---- 第二代小工具：場景／圖層／收尾 ---- */
  // 取 v0 地塊顏色（左角空地取樣）；取不到回 fb
  function v0col(k,sz,fb){try{const s=B[k+'_1_0'];const g=s.img.getContext('2d'),hw=32*sz;
    const d=g.getImageData(s.ax-hw+7,s.ay-hw-1,8,3).data;let r=0,gg=0,b=0,n=0;
    for(let i=0;i<d.length;i+=4)if(d[i+3]>200){r+=d[i];gg+=d[i+1];b+=d[i+2];n++;}
    if(n<12)return fb;const f=x=>Math.min(255,Math.round(x/n*1.03)).toString(16).padStart(2,'0');return '#'+f(r)+f(gg)+f(b);}catch(e){return fb;}}
  function scene(sz,k,v,pt){pt=pt||0;const W=[0,72,136,208][sz],H=[0,112,150,220][sz]+pt,ax=W/2,ay=[0,110,148,218][sz]+pt;
    const [c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);return {c,g,nc,ng,I:mkI(ax,ay-32*sz),W,H,ax,ay,sz,k,v,rk:A.metroRand516('v574:'+k+':'+v)};}
  function lay(S){const [L,l]=A.cv(S.W,S.H),[N,n]=A.cv(S.W,S.H);return {L,l,N,n};}
  function com(S,Y,ol){if(ol!==0)A.outlineSprite(Y.L,...(ol||OL));S.g.drawImage(Y.L,0,0);nightCut(S.nc,Y.L);S.ng.drawImage(Y.N,0,0);}
  function fin(S,smoke){polish(S.c,{ax:S.ax,ay:S.ay,w0:S.W,full:true,rk:S.rk});put(S.k+'_1_'+S.v,S.c,S.nc,S.ax,S.ay,smoke);}
  // 地面投影（只落在地塊上）：足跡往畫面右移 d 像素的凸包
  function hull(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
    const lo=[],up=[];for(const p of P){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
    for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}
    return lo.slice(0,-1).concat(up.slice(0,-1));}
  function castShadow(S,u0,u1,v0,v1,d,a){const I=S.I,P=[];for(const u of [u0,u1])for(const v of [v0,v1]){const p=I(u,v,0);P.push(p,[p[0]+d,p[1]-d*.15]);}
    const g=S.g;g.save();g.globalCompositeOperation='source-atop';poly(g,hull(P),'rgba(18,22,30,'+(a||.2)+')');g.restore();}
  // 樹：柏樹（高瘦）與圓冠樹，底部在 (x,y)
  function cypress(l,x,y,h,c1,c2,c3){c1=c1||'#5a8a52';c2=c2||'#35603a';c3=c3||'#26472c';
    for(let i=0;i<h;i++){const t=(i+.5)/h;const hw=Math.max(.6,2.6*Math.sin(Math.PI*Math.pow(t,.72))*(t>.9?.8:1));
      const xl=Math.round(x-hw),xr=Math.round(x+hw);const yy=y-h-1+i;
      l.fillStyle=c2;l.fillRect(xl,yy,Math.max(1,xr-xl),1);l.fillStyle=c1;l.fillRect(xl,yy,1,1);if(xr-xl>2){l.fillStyle=c3;l.fillRect(xr-1,yy,1,1);}}
    l.fillStyle='#5a4030';l.fillRect(x-1,y-1,1,2);}
  function roundTree(l,x,y,r,c1,c2,c3){c1=c1||'#7aa85a';c2=c2||'#4f8440';c3=c3||'#36602e';
    l.fillStyle='#5a4030';l.fillRect(x-1,y-4,2,4);const cy=y-4-r;
    for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){const d=xx*xx+yy*yy;if(d>r*r+r*.6)continue;
      const lv=(-xx-yy)/r;l.fillStyle=lv>.7?c1:(lv<-.6?c3:c2);l.fillRect(x+xx,cy+yy,1,1);}}

  /* ================= k43 法院 ================= */
  try{
  {
    // v1：古典神殿式法院——山牆門廊＋六柱＋三段台階＋拱窗側牆
    const k=43,rk=A.metroRand516('v574:43:1'),W=136,H=150,ax=68,ay=148;
    const [c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const I=mkI(68,84);
    plateOn(g,ax,ay,2,'#8a8a92',rk,26);
    // 前庭鋪面（無描邊）
    paraT(g,I,16,58,56,63,0,'#a3a5ad');
    for(let u=18;u<58;u+=6)paraT(g,I,u,u+1,56,63,0,'#95979f');
    const L1=layer(W,H)[0],l1=L1.getContext('2d');
    const stL='#c9ced8',stR='#9ba3b2',stT='#b4bbc8',roofF='#56627a',roofB='#6c7a93';
    // 台基＋台階
    box(l1,I,14,58,10,58,0,4,'#b1b7c3','#8a92a1','#c3c9d4');
    box(l1,I,20,52,58,60,0,3,'#bcc2cc','#939aa8','#cdd2db',false);
    box(l1,I,22,50,60,62,0,1.5,'#c2c7d0','#99a0ad','#d2d6de',false);
    // 殿身
    box(l1,I,18,54,12,46,4,26,stL,stR,stT,false);
    // 側牆拱窗（右面 u=54）
    for(const v of [18,28,38])winR(l1,ng,I,54,v+6,21,3,8,'arch','#34445a','#c8d8ff','#dfe3ea',v!==28);
    // 殿身前牆（門廊內，偏暗）＋拱門
    paraL(l1,I,46,18,54,4,26,'#8f97a6');
    {const p=px(I(34,46,20));l1.fillStyle='#2e3444';l1.fillRect(p[0],p[1],5,11);l1.fillRect(p[0]+1,p[1]-1,3,1);ng.fillStyle='#c8d8ff';ng.fillRect(p[0]+1,p[1]+4,3,7);}
    // 簷部（楣梁）
    box(l1,I,16,56,44,58,22,26,'#d3d8e0','#a5adbb','#c1c8d3',false);
    paraL(l1,I,58,16,56,22,23,'#b7bfcb');
    // 六柱
    for(let i=0;i<6;i++){const u=19+i*6.6;const p=px(I(u,57,4));const top=px(I(u,57,22));
      l1.fillStyle='#e3e7ee';l1.fillRect(p[0],top[1],2,p[1]-top[1]);l1.fillStyle='#a9b1bf';l1.fillRect(p[0]+2,top[1],1,p[1]-top[1]);
      l1.fillStyle='#cfd5de';l1.fillRect(p[0]-1,top[1],4,1);}
    // 屋頂＋山牆（三角楣）
    gableV(l1,I,16,56,10,58,26,13,roofF,roofB,'#d6dbe3');
    Q(l1,I,[[20,58,27],[52,58,27],[36,58,37]],'#c3c9d3');
    {const p=px(I(36,58,31));l1.fillStyle='#e0bf4a';l1.fillRect(p[0]-3,p[1],7,1);l1.fillRect(p[0],p[1]-3,1,5);l1.fillRect(p[0]-3,p[1]+1,2,2);l1.fillRect(p[0]+2,p[1]+1,2,2);
      ng.fillStyle='#ffe98a';ng.fillRect(p[0]-3,p[1],7,1);}
    stamp(g,L1,OL);
    // 台階兩側燈柱
    const L2=layer(W,H)[0],l2=L2.getContext('2d');
    for(const u of [18,54]){const p=px(I(u,62,0));lamp(l2,ng,p[0],p[1],10,'#4a4f5a','#f0e6c0','#ffe9b0');}
    stamp(g,L2,OL);
    polish(c,{ax,ay,w0:136,full:true,rk});
    put('43_1_1',c,nc,ax,ay);
  }
  {
    // v2：現代司法大樓——高板樓＋垂直鰭片＋玻璃大廳裙樓＋雨遮＋旗桿
    const rk=A.metroRand516('v574:43:2'),W=136,H=150,ax=68,ay=148;
    const [c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const I=mkI(68,84);
    plateOn(g,ax,ay,2,'#8a8a92',rk,26);
    paraT(g,I,34,62,54,62,0,'#a0a2aa');
    for(let v=55;v<62;v+=3)paraT(g,I,34,62,v,v+1,0,'#93959d');
    const L1=layer(W,H)[0],l1=L1.getContext('2d');
    // 高板樓
    const tL='#b3bac6',tR='#858e9d',tT='#727b8a';
    box(l1,I,12,38,14,46,0,60,tL,tR,tT);
    // 左面：垂直玻璃條＋樓層帶
    for(let u=15;u<37;u+=5){paraL(l1,I,46,u,u+2,6,56,'#3d5068');paraL(l1,I,46,u,u+2,56,57,'#5a6f88');}
    for(let z=14;z<56;z+=8)paraL(l1,I,46,12,38,z,z+1,'#c9cfd8');
    // 右面：窗格
    for(let z=10;z<54;z+=8)for(let v=18;v<44;v+=6){paraR(l1,I,38,v,v+3,z,z+4,'#34465c');
      const on=((v*7+z*3)%5)<2;if(on){ng.fillStyle='#c8d8ff';const p=px(I(38,v+3,z+4));ng.fillRect(p[0],p[1],3,4);}}
    // 女兒牆＋天平標
    box(l1,I,12,38,14,16,60,63,'#c6ccd6','#9aa2b0','#d0d5dd',false);
    box(l1,I,12,14,16,46,60,63,'#c6ccd6','#9aa2b0','#d0d5dd',false);
    box(l1,I,20,30,24,34,60,66,'#9aa2b0','#7a8393','#8f98a6',false);
    stamp(g,L1,OL);
    const L3=layer(W,H)[0],l3=L3.getContext('2d');
    // 天平標誌（立在前緣）
    {const p=px(I(25,46,62));l3.fillStyle='#d8b640';l3.fillRect(p[0],p[1]-9,1,9);l3.fillRect(p[0]-4,p[1]-8,9,1);l3.fillRect(p[0]-5,p[1]-7,3,2);l3.fillRect(p[0]+3,p[1]-7,3,2);l3.fillRect(p[0]-2,p[1],5,1);
      ng.fillStyle='#ffe98a';ng.fillRect(p[0]-4,p[1]-8,9,1);}
    stamp(g,L3,OL);
    // 裙樓大廳
    const L2=layer(W,H)[0],l2=L2.getContext('2d');
    box(l2,I,38,60,22,54,0,16,'#c3c9d2','#949cab','#a7aeba');
    paraL(l2,I,54,40,58,2,12,'#48617c');
    for(let u=40;u<58;u+=4)paraL(l2,I,54,u,u+1,2,12,'#8aa0b6');
    for(let u=40;u<58;u+=4)paraL(ng,I,54,u+1,u+4,3,11,'rgba(255,246,214,.5)');
    for(const v of [26,34,42]){paraR(l2,I,60,v,v+5,5,10,'#3a4b60');}
    box(l2,I,40,58,54,59,12,14,'#dde1e7','#aeb5c0','#e6e9ee',false);
    for(const u of [41,57]){const p=px(I(u,58.5,0)),t=px(I(u,58.5,12));l2.fillStyle='#8a929e';l2.fillRect(p[0],t[1],1,p[1]-t[1]);}
    stamp(g,L2,OL);
    // 旗桿＋路燈
    const L4=layer(W,H)[0],l4=L4.getContext('2d');
    {const p=px(I(10,58,0));l4.fillStyle='#9aa0a8';l4.fillRect(p[0],p[1]-30,1,30);l4.fillStyle='#4a78c8';l4.fillRect(p[0]+1,p[1]-30,6,2);l4.fillStyle='#e8e8ea';l4.fillRect(p[0]+1,p[1]-28,6,2);l4.fillStyle='#4a78c8';l4.fillRect(p[0]+1,p[1]-26,6,1);
      l4.fillStyle='#6a7078';l4.fillRect(p[0]-1,p[1]-1,3,1);}
    {const p=px(I(62,50,0));lamp(l4,ng,p[0],p[1],11,'#4a4f5a','#e8ecf0','#e8f0ff');}
    stamp(g,L4,OL);
    polish(c,{ax,ay,w0:136,full:true,rk});
    put('43_1_2',c,nc,ax,ay);
  }
  }catch(e){console.error('v574 k43',e);}

  /* ================= k31 監獄 ================= */
  try{
    const K=31,pc=v0col(K,2,'#7a7a6a');
    const wL='#9a9a92',wR='#74746c',wT='#86867e';
    // 角樓：方柱身＋外挑崗亭（深色觀察窗）＋四坡頂＋探照燈
    const tower=(Y,I,u,v,h)=>{box(Y.l,I,u-2.5,u+2.5,v-2.5,v+2.5,0,h,wL,wR,wT,false);
      box(Y.l,I,u-4,u+4,v-4,v+4,h,h+6,'#a4a49c','#7c7c74','#8a8a82',false);
      paraL(Y.l,I,v+4,u-3,u+3,h+2,h+4,'#2e3440');paraR(Y.l,I,u+4,v-3,v+3,h+2,h+4,'#262c36');
      hip(Y.l,I,u-5,u+5,v-5,v+5,h+6,5,['#6a6e76','#4e525a','#5a5e66','#5a5e66']);
      const p=px(I(u,v,h+11));Y.l.fillStyle='#d8d8cc';Y.l.fillRect(p[0]-1,p[1]-1,3,2);Y.n.fillStyle='#fff6c8';Y.n.fillRect(p[0]-1,p[1]-1,3,2);
      Y.n.fillStyle='#e8d890';const q=px(I(u-2,v+4,h+4));Y.n.fillRect(q[0],q[1],3,1);};
    // 牆頂刺網：牆頂上方一條細線＋每 6 單位一根短柱
    const wire=(Y,I,a,b,z)=>{line(Y.l,I(a[0],a[1],z+2),I(b[0],b[1],z+2),'#50545a');
      const n=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/6);for(let i=0;i<=n;i++){const t=i/n,p=px(I(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z));Y.l.fillStyle='#5a5e64';Y.l.fillRect(p[0],p[1]-2,1,2);}};
    {// v1：放射式監獄——十字翼舍＋中央圓廳＋四角樓高牆
      const S=scene(2,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,6,58,6,58,0,sh(pc,-18));
      paraT(S.g,I,42,56,40,56,0,'#6c7658');paraT(S.g,I,43,55,47.5,48.5,0,'#8a9476');
      let Y=lay(S);tower(Y,I,5,5,24);com(S,Y);/*後角樓*/
      Y=lay(S);box(Y.l,I,5,59,4,6,0,14,wL,wR,wT);box(Y.l,I,4,6,5,59,0,14,wL,wR,wT);
      wire(Y,I,[6,5],[59,5],14);wire(Y,I,[5,6],[5,59],14);com(S,Y);
      Y=lay(S);tower(Y,I,59,5,24);com(S,Y);
      // 後兩翼
      Y=lay(S);const cL='#aeaca2',cR='#807e76',cT='#a4a298';
      box(Y.l,I,27,37,9,24,0,19,cL,cR,cT);box(Y.l,I,9,24,25,35,0,19,cL,cR,cT);
      for(let v=11;v<23;v+=3)for(const z of [7,14])paraR(Y.l,I,37,v,v+1,z-4,z,'#3a3e46');
      for(let u=10;u<23;u+=3)for(const z of [7,14]){paraL(Y.l,I,35,u,u+1,z-4,z,'#3a3e46');if(S.rk()<.22){const p=px(I(u,35,z));Y.n.fillStyle='#e0cc88';Y.n.fillRect(p[0],p[1],1,3);}}
      com(S,Y);
      // 中央圓廳
      Y=lay(S);cyl(Y.l,I,32,30,9,0,25,'#b4b2a8','#86847c','#9a988e');
      for(let a=0;a<5;a++){const t=-.8+a*.4,p=I(32,30,0);const x=Math.round(p[0]+t*9*Math.SQRT2);Y.l.fillStyle=t<.3?'#4a4e56':'#32363e';Y.l.fillRect(x,Math.round(p[1]+Math.sqrt(1-t*t)*6.3)-20,1,5);Y.l.fillRect(x,Math.round(p[1]+Math.sqrt(1-t*t)*6.3)-12,1,5);
        if(a===1||a===3){Y.n.fillStyle='#e0cc88';Y.n.fillRect(x,Math.round(p[1]+Math.sqrt(1-t*t)*6.3)-20,1,4);}}
      cone(Y.l,I,32,30,25,10,9,'#6e727a','#5a5e66','#464a52');
      {const p=px(I(32,30,34));Y.l.fillStyle='#3e4248';Y.l.fillRect(p[0],p[1]-3,1,3);Y.l.fillStyle='#d8d8cc';Y.l.fillRect(p[0]-1,p[1]-5,3,2);Y.n.fillStyle='#fff6c8';Y.n.fillRect(p[0]-1,p[1]-5,3,2);}
      com(S,Y);
      // 前兩翼
      Y=lay(S);
      box(Y.l,I,40,55,25,35,0,19,cL,cR,cT);box(Y.l,I,27,37,38,53,0,19,cL,cR,cT);
      for(let u=42;u<54;u+=3)for(const z of [7,14]){paraL(Y.l,I,35,u,u+1,z-4,z,'#3a3e46');if(S.rk()<.22){const p=px(I(u,35,z));Y.n.fillStyle='#e0cc88';Y.n.fillRect(p[0],p[1],1,3);}}
      for(let v=27;v<34;v+=3)for(const z of [7,14])paraR(Y.l,I,55,v,v+1,z-4,z,'#34383f');
      for(let v=40;v<52;v+=3)for(const z of [7,14]){paraR(Y.l,I,37,v,v+1,z-4,z,'#34383f');if(S.rk()<.2){const p=px(I(37,v+1,z));Y.n.fillStyle='#d8c480';Y.n.fillRect(p[0],p[1],1,3);}}
      com(S,Y);
      Y=lay(S);
      box(Y.l,I,57,59,6,57,0,14,wL,wR,wT);box(Y.l,I,6,57,57,59,0,14,wL,wR,wT);
      wire(Y,I,[58,6],[58,57],14);wire(Y,I,[6,58],[57,58],14);
      // 門樓
      box(Y.l,I,25,39,55,61,0,20,'#aeaca2','#84827a','#96948c');
      paraL(Y.l,I,61,29,35,0,11,'#2a2e36');for(let u=30;u<35;u+=1.5)paraL(Y.l,I,61,u,u+.5,0,11,'#5a5e66');
      paraL(Y.l,I,61,25,39,17,18,'#c8c6bc');
      {const p=px(I(32,61,15));Y.l.fillStyle='#d8d8cc';Y.l.fillRect(p[0]-3,p[1],2,2);Y.l.fillRect(p[0]+2,p[1],2,2);Y.n.fillStyle='#fff0b0';Y.n.fillRect(p[0]-3,p[1],2,2);Y.n.fillRect(p[0]+2,p[1],2,2);}
      tower(Y,I,5,59,24);
      com(S,Y);
      Y=lay(S);tower(Y,I,59,59,24);com(S,Y);
      fin(S);
    }
    {// v2：現代高度戒備監獄——高板牢房樓＋行政樓＋雙層鐵網＋鋼構崗哨＋運動場
      const S=scene(2,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,4,60,4,60,0,sh(pc,-6));
      paraT(S.g,I,10,28,30,50,0,'#6a7a5c');
      line(S.g,I(12,40,0),I(26,40,0),'#a8b494');
      paraT(S.g,I,36,60,52,60,0,sh(pc,8));
      castShadow(S,10,50,8,22,12,.18);
      const fenceP='#4e545c',fenceW='#5a6068';
      const fence=(Y,a,b,h)=>{const n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/6));
        for(let i=0;i<=n;i++){const t=i/n,uu=a[0]+(b[0]-a[0])*t,vv=a[1]+(b[1]-a[1])*t,p=px(I(uu,vv,0));Y.l.fillStyle=fenceP;Y.l.fillRect(p[0],p[1]-h,1,h);}
        line(Y.l,I(a[0],a[1],h),I(b[0],b[1],h),fenceW);line(Y.l,I(a[0],a[1],1),I(b[0],b[1],1),fenceW);
        line(Y.l,I(a[0],a[1],h+1.5),I(b[0],b[1],h+1.5),'#b8bec4');};
      let Y=lay(S);fence(Y,[3,3],[61,3],9);fence(Y,[3,3],[3,61],9);com(S,Y,0);
      // 牢房板樓（沿 u 長向）
      Y=lay(S);const cL='#c6c2b6',cR='#96928a',cT='#aaa69a';
      box(Y.l,I,10,50,8,22,0,34,cL,cR,cT);
      for(let z=13;z<34;z+=9)paraL(Y.l,I,22,10,50,z-1,z,'#b0aca0');
      for(let u=13;u<49;u+=5)for(let z=10;z<34;z+=9){paraL(Y.l,I,22,u,u+1,z-4,z,'#3a3e46');if(S.rk()<.16){const p=px(I(u,22,z));Y.n.fillStyle='#e8dca0';Y.n.fillRect(p[0],p[1],1,3);}}
      for(let v=12;v<21;v+=5)for(let z=10;z<34;z+=9)paraR(Y.l,I,50,v,v+1,z-4,z,'#30343b');
      box(Y.l,I,24,36,10,18,34,40,'#b8b4a8','#8c887e','#9e9a8e',false);
      box(Y.l,I,40,46,11,17,34,37,'#a8a8a4','#80807c','#949490',false);
      {const p=px(I(30,14,40));Y.l.fillStyle='#8a8e94';Y.l.fillRect(p[0],p[1]-8,1,8);Y.l.fillStyle='#c84a40';Y.l.fillRect(p[0]-1,p[1]-9,2,2);Y.n.fillStyle='#ff6a50';Y.n.fillRect(p[0]-1,p[1]-9,2,2);}
      com(S,Y);
      // 運動場鐵網
      Y=lay(S);fence(Y,[10,30],[28,30],6);fence(Y,[10,30],[10,50],6);com(S,Y,0);
      Y=lay(S);fence(Y,[28,30],[28,50],6);fence(Y,[10,50],[28,50],6);
      {const p=px(I(19,38,0));Y.l.fillStyle='#8a8e94';Y.l.fillRect(p[0],p[1]-7,1,7);Y.l.fillStyle='#e8e8e2';Y.l.fillRect(p[0]-1,p[1]-9,3,2);}
      com(S,Y,0);
      // 行政樓（玻璃帶＋雨遮）
      Y=lay(S);
      box(Y.l,I,32,56,32,48,0,13,'#d6d4cc','#aaa8a0','#bcbab2');
      paraL(Y.l,I,48,34,54,4,9,'#3e5670');for(let u=36;u<54;u+=4)paraL(Y.l,I,48,u,u+.8,4,9,'#8ea2b4');
      for(let u=34;u<54;u+=4)if(u!==42)paraL(Y.n,I,48,u+.8,u+4,4,9,'rgba(236,232,196,.55)');
      for(let v=35;v<47;v+=4)paraR(Y.l,I,56,v,v+2,5,9,'#36485c');
      box(Y.l,I,38,48,48,53,9,10.5,'#e6e6e0','#b4b4ac','#dcdcd6',false);
      for(const u of [38.5,47.5]){const p=px(I(u,52.5,0)),t=px(I(u,52.5,9));Y.l.fillStyle='#7e848c';Y.l.fillRect(p[0],t[1],1,p[1]-t[1]);}
      box(Y.l,I,42,48,34,40,13,16,'#b0aea6','#88867e','#9a988f',false);
      com(S,Y);
      // 鋼構崗哨（前左角）
      Y=lay(S);{const u=9,v=56,h=32;
        for(const [du,dv] of [[-2,-2],[2,-2],[-2,2],[2,2]]){const a=px(I(u+du,v+dv,0)),b=px(I(u+du,v+dv,h));Y.l.fillStyle=du>0?'#5e646c':'#8a9098';Y.l.fillRect(a[0],b[1],1,a[1]-b[1]);}
        for(let z=4;z<h;z+=8){line(Y.l,I(u-2,v+2,z),I(u+2,v+2,z+8),'#6e747c');line(Y.l,I(u+2,v-2,z),I(u+2,v+2,z+8),'#555b62');}
        box(Y.l,I,u-4,u+4,v-4,v+4,h,h+7,'#9aa0a8','#6e747c','#7e848c',false);
        paraL(Y.l,I,v+4,u-3.5,u+3.5,h+2,h+5,'#28303a');paraR(Y.l,I,u+4,v-3.5,v+3.5,h+2,h+5,'#222830');
        box(Y.l,I,u-5,u+5,v-5,v+5,h+7,h+8.5,'#b4bac2','#80868e','#a4aab2',false);
        const p=px(I(u,v,h+9));Y.l.fillStyle='#e8e8dc';Y.l.fillRect(p[0]-1,p[1]-2,3,2);Y.n.fillStyle='#fff8d0';Y.n.fillRect(p[0]-1,p[1]-2,3,2);
        const q=px(I(u-3,v+4,h+5));Y.n.fillStyle='#d8e4f0';Y.n.fillRect(q[0],q[1],6,2);}
      com(S,Y);
      // 前兩道鐵網＋閘門
      Y=lay(S);fence(Y,[61,3],[61,28],9);fence(Y,[61,40],[61,61],9);fence(Y,[3,61],[61,61],9);
      {const a=px(I(61,28,0)),b=px(I(61,40,0));Y.l.fillStyle='#4a4e56';Y.l.fillRect(a[0],a[1]-11,2,11);Y.l.fillRect(b[0],b[1]-11,2,11);
        for(let i=0;i<12;i++){const p=px(I(61,28.5+i,5));Y.l.fillStyle=(i>>1)%2?'#2a2a2e':'#e8c030';Y.l.fillRect(p[0],p[1],1,2);}
        Y.n.fillStyle='#ff5040';Y.n.fillRect(a[0],a[1]-12,2,1);Y.n.fillRect(b[0],b[1]-12,2,1);
        Y.l.fillStyle='#ff5040';Y.l.fillRect(a[0],a[1]-12,2,1);Y.l.fillRect(b[0],b[1]-12,2,1);}
      com(S,Y,0);
      fin(S);
    }
  }catch(e){console.error('v574 k31',e);}

  /* ================= k42 市政廳 ================= */
  try{
    const K=42,pc=v0col(K,2,'#9a9484');
    {// v1：圓頂議事堂——中央高鼓座穹頂＋左右低翼＋山牆柱廊；燈亭頂 (32,32,61) 對齊動畫旗掛點畫布 (68,16)，畫布上緣裁 39px
      const S=scene(2,K,1,-39),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,20,44,50,62,0,'#c8b898');for(let u=22;u<44;u+=5)paraT(S.g,I,u,u+1,50,62,0,'#b4a684');
      const sL='#e6d09a',sR='#c0a46a',sT='#b09460';
      let Y=lay(S);
      // 左翼
      box(Y.l,I,4,20,20,42,0,17,sL,sR,sT);
      hip(Y.l,I,3,21,19,43,17,6,['#8a7a5a','#6c5e44','#7a6c50','#7a6c50']);
      for(const u of [6,11,16]){winL(Y.l,Y.n,I,42,u,13,2,6,'arch','#3a4a5a','#ffe9b0','#f4e4b8',S.rk()<.6);}
      com(S,Y);
      // 主體
      Y=lay(S);
      box(Y.l,I,20,44,16,46,0,24,sL,sR,sT);
      box(Y.l,I,19,45,15,47,22,25,'#f0dcaa','#caae74','#c8ae78',false);
      for(const u of [22,26,38,42])winL(Y.l,Y.n,I,46,u-.5,19,2,7,'arch','#3a4a5a','#ffe9b0','#f4e4b8',S.rk()<.55);
      for(const v of [22,28,34,40])winR(Y.l,Y.n,I,44,v+2,19,2,7,'arch','#34424f','#ffe9b0','#e0cc98',S.rk()<.45);
      for(const v of [22,28,34,40])winR(Y.l,Y.n,I,44,v+2,8,2,5,'punch','#34424f','#ffe9b0','#c8b080',S.rk()<.35);
      // 鼓座＋穹頂＋燈亭（中心 (32,32)：畫面 x=68）
      cyl(Y.l,I,32,32,11,25,38,'#ecd8a4','#bc9e66','#d8c08a');
      ring(Y.l,I,32,32,11,36,'#f4e4b8');
      for(let a=0;a<7;a++){const t=-.84+a*.28,p=cylPt(I,32,32,11,t,25);
        Y.l.fillStyle=t<.3?'#4a5a66':'#3a4652';Y.l.fillRect(p[0],p[1]-10,1,6);if(a%2===0){Y.n.fillStyle='#ffe0a0';Y.n.fillRect(p[0],p[1]-10,1,6);}}
      cyl(Y.l,I,32,32,11.6,38,39.5,'#f4e4b8','#caae74','#d8c08a');
      dome(Y.l,I,32,32,39.5,10.5,16,'#5f9a82','#8cc4a8','#3f6e5c');
      cyl(Y.l,I,32,32,2.2,53,60,'#f0e0b8','#c0a878');
      {const p=cylPt(I,32,32,2.2,-.3,57);Y.l.fillStyle='#4a5a66';Y.l.fillRect(p[0],p[1]-2,1,2);Y.n.fillStyle='#ffe9a0';Y.n.fillRect(p[0],p[1]-2,1,2);}
      dome(Y.l,I,32,32,60,2.6,1.6,'#5f9a82','#8cc4a8','#3f6e5c');
      com(S,Y);
      // 右翼
      Y=lay(S);
      box(Y.l,I,44,60,20,42,0,17,sL,sR,sT);
      hip(Y.l,I,43,61,19,43,17,6,['#8a7a5a','#6c5e44','#7a6c50','#7a6c50']);
      for(const u of [47,52,57])winL(Y.l,Y.n,I,42,u-1,13,2,6,'arch','#3a4a5a','#ffe9b0','#f4e4b8',S.rk()<.6);
      for(const v of [24,30,36])winR(Y.l,Y.n,I,60,v+2,13,2,6,'arch','#34424f','#ffe9b0','#e0cc98',S.rk()<.4);
      com(S,Y);
      // 柱廊＋三角楣
      Y=lay(S);
      box(Y.l,I,23,41,46,50,0,2,'#d8c8a0','#b0a07c','#e0d2ae',false);
      paraL(Y.l,I,46,24,40,2,18,'#a88e5c');
      {const p=px(I(31,46,13));Y.l.fillStyle='#5a3a24';Y.l.fillRect(p[0],p[1],4,8);Y.n.fillStyle='#ffe0a0';Y.n.fillRect(p[0]+1,p[1]+1,2,6);}
      for(let i=0;i<5;i++){const u=24.5+i*3.6,a=px(I(u,49,2)),b=px(I(u,49,18));Y.l.fillStyle='#f6e8c4';Y.l.fillRect(a[0],b[1],1,a[1]-b[1]);Y.l.fillStyle='#c8b080';Y.l.fillRect(a[0]+1,b[1],1,a[1]-b[1]);}
      box(Y.l,I,23,41,45,50,18,21,'#f0dcaa','#c4a870','#d8c08c',false);
      Q(Y.l,I,[[23,50,21],[41,50,21],[32,50,28]],'#f2dfae');
      gableV(Y.l,I,23,41,40,50,21,7,'#8a7a5a','#9a8a68');
      {const p=px(I(32,50,24));Y.l.fillStyle='#f4ecd8';Y.l.fillRect(p[0]-1,p[1]-1,3,3);Y.l.fillStyle='#5a4a2a';Y.l.fillRect(p[0],p[1]-1,1,2);Y.n.fillStyle='#ffe9a0';Y.n.fillRect(p[0]-1,p[1]-1,3,3);}
      for(const u of [19,45]){const p=px(I(u,58,0));Y.l.fillStyle='#8a6a2a';Y.l.fillRect(p[0],p[1]-22,1,22);Y.l.fillStyle=u<30?'#c83c3c':'#3c64c8';Y.l.fillRect(p[0]+1,p[1]-22,6,4);}
      com(S,Y);
      fin(S);
    }
    {// v2：紅磚鐘樓市府——後左高鐘樓（塔尖 (22,22,90)＝畫布 (68,16) 動畫旗掛點）＋右後雙坡主廳＋左前階梯山牆翼＋右前噴水廣場
      const S=scene(2,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,38,62,38,62,0,'#b8a888');for(let u=40;u<62;u+=4)paraT(S.g,I,u,u+1,38,62,0,'#a89878');
      castShadow(S,16,28,16,28,30,.16);
      const bL='#c07458',bR='#94533e',bT='#a8644c',rF='#5e6674',rB='#747c8a',st='#dcc8a8',stR='#b8a484';
      let Y=lay(S);
      // 高鐘樓
      {const u0=16,u1=28,v0=16,v1=28,h=70;
        box(Y.l,I,u0,u1,v0,v1,0,h,bL,bR,bT,false);
        for(const z of [30,46]){paraL(Y.l,I,v1,u0,u1,z-1,z,st);paraR(Y.l,I,u1,v0,v1,z-1,z,stR);}
        winL(Y.l,Y.n,I,v1,21,43,2,8,'arch','#2e3844','#ffe4a8','#e8d8b8',true);
        winR(Y.l,Y.n,I,u1,23,43,2,8,'arch','#2a323c','#ffe4a8','#c8b494',false);
        const c1=px(I(22,v1,53)),c2=px(I(u1,22,53));
        Y.l.fillStyle='#f4ecd8';Y.l.fillRect(c1[0]-2,c1[1]-2,5,5);Y.l.fillStyle='#d8d0bc';Y.l.fillRect(c2[0]-2,c2[1]-2,5,5);
        Y.l.fillStyle='#3a2e22';Y.l.fillRect(c1[0],c1[1]-1,1,2);Y.l.fillRect(c1[0],c1[1],2,1);Y.l.fillRect(c2[0],c2[1]-1,1,2);
        Y.n.fillStyle='#ffe9a0';Y.n.fillRect(c1[0]-2,c1[1]-2,5,5);Y.n.fillStyle='#f0d890';Y.n.fillRect(c2[0]-2,c2[1]-2,5,5);
        box(Y.l,I,u0-1,u1+1,v0-1,v1+1,57,59,'#e0ccaa','#b09a78','#c8b494',false);
        for(const u of [18,23.5])winL(Y.l,Y.n,I,v1,u,67,2,6,'arch','#2a2622','#ffe4a8','#e8d8b8',false);
        for(const v of [22,27.5])winR(Y.l,Y.n,I,u1,v,67,2,6,'arch','#221e1a','#ffe4a8','#c8b494',false);
        box(Y.l,I,u0-1.5,u1+1.5,v0-1.5,v1+1.5,h,h+2,'#e0ccaa','#b09a78','#c8b494',false);
        hip(Y.l,I,u0-1.5,u1+1.5,v0-1.5,v1+1.5,h+2,18,['#6aa488','#3e7260','#548a72','#548a72']);}
      com(S,Y);
      // 主廳（脊沿 u）
      Y=lay(S);
      box(Y.l,I,30,58,10,32,0,18,bL,bR,bT,false);
      for(let z=6;z<18;z+=6){paraL(Y.l,I,32,30,58,z-.8,z,st);paraR(Y.l,I,58,10,32,z-.8,z,stR);}
      for(let u=36;u<56;u+=6){winL(Y.l,Y.n,I,32,u,15,2,7,'arch','#34404c','#ffe4a8','#e8d8b8',S.rk()<.55);winL(Y.l,Y.n,I,32,u,5,2,4,'punch','#34404c','#ffe4a8','#b86a50',S.rk()<.3);}
      for(const v of [16,30])winR(Y.l,Y.n,I,58,v,15,2,7,'arch','#2a323c','#ffe4a8','#c8b494',S.rk()<.4);
      gableU(Y.l,I,29,59,9,33,18,11,rF,rB,bR);
      {const p=px(I(59,21,23));Y.l.fillStyle='#f0e4c8';Y.l.fillRect(p[0]-1,p[1],3,3);Y.n.fillStyle='#ffe4a8';Y.n.fillRect(p[0]-1,p[1],3,3);}
      for(const u of [40,52])box(Y.l,I,u-1.5,u+1.5,19.5,22.5,27,33,'#9a5a44','#7a4636','#8a5040',false);
      com(S,Y);
      // 階梯山牆翼（脊沿 v，山牆朝 +v）
      Y=lay(S);
      box(Y.l,I,12,34,30,54,0,17,bL,bR,bT,false);
      paraL(Y.l,I,54,12,34,6,6.8,st);paraR(Y.l,I,34,30,54,6,6.8,stR);
      for(let v=34;v<52;v+=5.5)winR(Y.l,Y.n,I,34,v+2,14,2,6,'arch','#2e3844','#ffe4a8','#d8c4a0',S.rk()<.45);
      for(const u of [14.5,29])winL(Y.l,Y.n,I,54,u,14,2,6,'arch','#34404c','#ffe4a8','#e8d8b8',S.rk()<.6);
      gableV(Y.l,I,11,35,29,54,17,11,rF,rB,'#c88064');
      for(let i=0;i<5;i++){const uA=11+i*2.4,uB=35-i*2.4,z=17+i*2.2;box(Y.l,I,uA,uA+1.6,53,55,z,z+2.2,'#d08a6c','#a0604a','#e0a080',false);box(Y.l,I,uB-1.6,uB,53,55,z,z+2.2,'#d08a6c','#a0604a','#e0a080',false);}
      {const p=px(I(23,54,24));Y.l.fillStyle='#f0e8d4';Y.l.fillRect(p[0]-2,p[1]-2,5,5);Y.l.fillStyle='#8a6a4a';Y.l.fillRect(p[0]-1,p[1]-1,3,3);Y.l.fillStyle='#f0e8d4';Y.l.fillRect(p[0],p[1],1,1);Y.n.fillStyle='#ffd890';Y.n.fillRect(p[0]-1,p[1]-1,3,3);}
      {const p=px(I(21,54,10));Y.l.fillStyle='#e8d8b8';Y.l.fillRect(p[0]-1,p[1]-1,6,1);Y.l.fillStyle='#5a3a24';Y.l.fillRect(p[0],p[1],4,10);Y.n.fillStyle='#ffd890';Y.n.fillRect(p[0]+1,p[1]+2,2,8);}
      com(S,Y);
      // 噴水池＋燈＋長椅
      Y=lay(S);cyl(Y.l,I,50,50,5,0,2,'#c8c0b0','#a09888','#6aa8c8');cyl(Y.l,I,50,50,1.2,2,5,'#d8d0c0','#a8a090');
      {const p=px(I(50,50,5));Y.l.fillStyle='#d8e8f0';Y.l.fillRect(p[0],p[1]-4,1,4);}
      for(const [u,v] of [[38,60],[60,38]]){const p=px(I(u,v,0));lamp(Y.l,Y.n,p[0],p[1],10,'#4a4038','#f0e0b0','#ffe9b0');}
      {const p=px(I(42,52,0));Y.l.fillStyle='#8a6a42';Y.l.fillRect(p[0],p[1]-3,6,2);Y.l.fillStyle='#5a4028';Y.l.fillRect(p[0],p[1]-1,1,1);Y.l.fillRect(p[0]+5,p[1]-1,1,1);}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k42',e);}

  // 圓柱前半圈細線（石砌層線／欄杆扶手）
  function ring(g,I,u,v,r,z,col,step){const c=I(u,v,z),rx=r*Math.SQRT2,ry=rx/2;g.fillStyle=col;
    for(let x=Math.floor(c[0]-rx);x<Math.ceil(c[0]+rx);x+=(step||1)){const t=(x+.5-c[0])/rx;if(Math.abs(t)>1)continue;g.fillRect(x,Math.round(c[1]+ry*Math.sqrt(1-t*t)),1,1);}}
  // 圓柱表面上的點：t∈[-1,1]（左→右），高度 z
  function cylPt(I,u,v,r,t,z){const c=I(u,v,z),rx=r*Math.SQRT2;return [Math.round(c[0]+t*rx),Math.round(c[1]+rx/2*Math.sqrt(Math.max(0,1-t*t)))];}

  /* ================= k95 消防瞭望塔 ================= */
  try{
    const K=95,pc=v0col(K,1,'#9aa07e');
    {// v1：石砌圓塔——收分塔身＋挑出迴廊＋木造瞭望亭＋紅色圓錐頂；塔腳木工具棚
      const S=scene(1,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      paraT(S.g,I,13,17,22,32,0,sh(pc,14));
      castShadow(S,10,22,10,22,16,.18);
      let Y=lay(S);
      cyl(Y.l,I,16,16,6.5,0,8,'#bab09c','#8a8070');
      cyl(Y.l,I,16,16,5.5,8,46,'#c8bfaa','#928a78');
      for(const z of [8,16,24,32,40])ring(Y.l,I,16,16,z===8?6.5:5.5,z,'#a49a86',2);
      {const p=cylPt(I,16,16,6.5,-.25,0);Y.l.fillStyle='#5a3e28';Y.l.fillRect(p[0]-1,p[1]-7,3,6);Y.l.fillRect(p[0],p[1]-8,1,1);Y.l.fillStyle='#e0d6c0';Y.l.fillRect(p[0]-2,p[1]-9,5,1);}
      for(const [t,z] of [[-.35,22],[.2,34]]){const p=cylPt(I,16,16,5.5,t,z);Y.l.fillStyle='#343844';Y.l.fillRect(p[0],p[1]-3,1,3);}
      // 迴廊托座＋平台
      cyl(Y.l,I,16,16,7.8,44,47,'#b4aa94','#80786a','#a0967e');
      for(let i=0;i<6;i++){const t=-.85+i*.34,p=cylPt(I,16,16,7.8,t,47);Y.l.fillStyle=t<.3?'#6a5238':'#4e3c2a';Y.l.fillRect(p[0],p[1]-4,1,4);}
      ring(Y.l,I,16,16,7.8,51,'#6a5238');
      // 瞭望亭
      cyl(Y.l,I,16,16,5,47,56,'#d0b890','#9c8460');
      for(let i=0;i<4;i++){const t=-.72+i*.48,p=cylPt(I,16,16,5,t,54);Y.l.fillStyle=t<.3?'#3c4c5c':'#30404e';Y.l.fillRect(p[0],p[1]-1,t<0?2:2,4);
        Y.n.fillStyle='#ffd98a';Y.n.fillRect(p[0],p[1]-1,2,4);}
      cone(Y.l,I,16,16,56,7.5,13,'#e06a48','#c65434','#943a26');
      {const p=px(I(16,16,69));Y.l.fillStyle='#4a3a2a';Y.l.fillRect(p[0],p[1]-5,1,5);Y.l.fillStyle='#e04a3a';Y.l.fillRect(p[0]+1,p[1]-5,3,2);}
      com(S,Y);
      // 塔腳工具棚
      Y=lay(S);box(Y.l,I,21,29,17,26,0,7,'#b8946a','#8a6a48','#9a7a54',false);
      gableU(Y.l,I,20.5,29.5,16.5,26.5,7,4,'#7a5a3e','#96724e','#8a6a48');
      {const p=px(I(23,26,6));Y.l.fillStyle='#4a3424';Y.l.fillRect(p[0],p[1],3,5);}
      {const p=px(I(28,28,0));Y.l.fillStyle='#c83a30';Y.l.fillRect(p[0],p[1]-4,2,4);Y.l.fillStyle='#e8e0d0';Y.l.fillRect(p[0],p[1]-3,2,1);}
      com(S,Y);
      fin(S);
    }
    {// v2：鋼構瞭望台——收分四腳鋼架＋X 斜撐＋玻璃值勤艙＋紅屋頂＋天線信標；火險指示牌
      const S=scene(1,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      for(const [u,v] of [[6,6],[26,6],[6,26],[26,26]])paraT(S.g,I,u-1.5,u+1.5,v-1.5,v+1.5,0,sh(pc,-16));
      castShadow(S,8,24,8,24,12,.16);
      const H=38,leg=(b,t,z)=>[b[0]+(t[0]-b[0])*z/H,b[1]+(t[1]-b[1])*z/H];
      const LB=[[6,6],[26,6],[6,26],[26,26]],LT=[[11,11],[21,11],[11,21],[21,21]];
      const P=(i,z)=>{const q=leg(LB[i],LT[i],z);return I(q[0],q[1],z);};
      const brace=(g,i,j,col)=>{for(const [z0,z1] of [[0,13],[13,26],[26,H]]){line(g,P(i,z0),P(j,z1),col);line(g,P(j,z0),P(i,z1),col);line(g,P(i,z1),P(j,z1),col);}};
      let Y=lay(S);
      line(Y.l,P(0,0),P(0,H),'#3e444c');brace(Y.l,0,1,'#555b63');brace(Y.l,0,2,'#5e646c');
      com(S,Y,0);
      Y=lay(S);
      for(const i of [1,2]){const a=P(i,0),b=P(i,H);line(Y.l,a,b,i===2?'#9aa2aa':'#5a6068');line(Y.l,[a[0]+1,a[1]],[b[0]+1,b[1]],i===2?'#7a828a':'#4a5058');}
      brace(Y.l,2,3,'#848c94');brace(Y.l,1,3,'#646a72');
      {const a=P(3,0),b=P(3,H);line(Y.l,a,b,'#8a929a');line(Y.l,[a[0]+1,a[1]],[b[0]+1,b[1]],'#5e646c');}
      com(S,Y,0);
      // 值勤艙
      Y=lay(S);
      box(Y.l,I,7,25,7,25,H-1,H,'#9aa0a8','#6e747c','#848a92',false);
      box(Y.l,I,9,23,9,23,H,H+3,'#dcd8cc','#aaa69a','#c0bcb0',false);
      box(Y.l,I,9,23,9,23,H+3,H+9,'#3c5064','#2c3c4c','#c0bcb0',false);
      for(let u=9;u<=23;u+=4.6){paraL(Y.l,I,23,u,u+.7,H+3,H+9,'#d8dcd8');paraR(Y.l,I,23,u,u+.7,H+3,H+9,'#a8aca8');}
      paraL(Y.n,I,23,9.8,22.6,H+3.5,H+8.5,'rgba(255,226,150,.8)');paraR(Y.n,I,23,9.8,22.6,H+3.5,H+8.5,'rgba(255,214,140,.65)');
      line(Y.l,I(7,25,H+3),I(25,25,H+3),'#c8ccd0');line(Y.l,I(25,7,H+3),I(25,25,H+3),'#9aa0a6');
      box(Y.l,I,8,24,8,24,H+9,H+11,'#d45444','#a03a2e','#c04a3a');
      {const p=px(I(16,16,H+11));Y.l.fillStyle='#5a6068';Y.l.fillRect(p[0],p[1]-12,1,12);Y.l.fillRect(p[0]-2,p[1]-8,5,1);
        Y.l.fillStyle='#e03a30';Y.l.fillRect(p[0]-1,p[1]-14,3,2);Y.n.fillStyle='#ff5040';Y.n.fillRect(p[0]-1,p[1]-14,3,2);
        const q=px(I(20,12,H+11));Y.l.fillStyle='#b8bcc0';Y.l.fillRect(q[0],q[1]-3,3,2);Y.l.fillStyle='#6a7078';Y.l.fillRect(q[0]+1,q[1]-1,1,1);}
      com(S,Y);
      // 火險指示牌
      Y=lay(S);{const a=px(I(2,29,0)),b=px(I(7,30,0));Y.l.fillStyle='#6a4e34';Y.l.fillRect(a[0],a[1]-9,1,9);Y.l.fillRect(b[0],b[1]-9,1,9);
        const x0=Math.min(a[0],b[0])-1,y0=Math.min(a[1],b[1])-13;Y.l.fillStyle='#e8e2d0';Y.l.fillRect(x0,y0,9,5);
        Y.l.fillStyle='#4aa048';Y.l.fillRect(x0+1,y0+2,2,2);Y.l.fillStyle='#e8c030';Y.l.fillRect(x0+3,y0+1,2,3);Y.l.fillStyle='#d84030';Y.l.fillRect(x0+5,y0+2,3,2);
        Y.l.fillStyle='#2a2a2a';Y.l.fillRect(x0+4,y0+1,1,3);}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k95',e);}

  /* ================= k107 火葬場 ================= */
  try{
    const K=107,pc=v0col(K,1,'#9a9c94');
    {// v1：禮堂式火葬場——雙坡告別禮堂（山牆朝前）＋後方爐房＋高磚煙囪＋柏樹
      const S=scene(1,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      paraT(S.g,I,10,14,27,32,0,sh(pc,18));
      castShadow(S,22,26,5,9,20,.15);
      let Y=lay(S);
      box(Y.l,I,18,29,3,13,0,11,'#bcbeb8','#94968f','#a4a6a0');
      for(const v of [6,10])paraR(Y.l,I,29,v,v+2,4,8,'#4a5058');
      box(Y.l,I,22,26,5,9,11,56,'#b0725c','#825040','#5a3a30',false);
      for(const z of [30,46])box(Y.l,I,21.6,26.4,4.6,9.4,z,z+1.5,'#c88a72','#9a624e','#b07a64',false);
      box(Y.l,I,21.4,26.6,4.4,9.6,54,57,'#9a9c98','#6e706c','#3a3634',false);
      com(S,Y);
      Y=lay(S);
      box(Y.l,I,4,19,12,27,0,14,'#ddd5c3','#b0a896','#c4bcaa',false);
      gableV(Y.l,I,3,20,11,28,14,10,'#56606c','#707a88','#e6dfcf');
      {const p=px(I(9.5,27.6,9));Y.l.fillStyle='#4a3424';Y.l.fillRect(p[0],p[1],4,9);Y.l.fillRect(p[0]+1,p[1]-1,2,1);Y.l.fillStyle='#c8c0ae';Y.l.fillRect(p[0]-1,p[1]-2,6,1);
        Y.n.fillStyle='#f0d8a0';Y.n.fillRect(p[0]+1,p[1]+1,2,7);}
      {const p=px(I(11.5,28,18));Y.l.fillStyle='#8aa0b0';Y.l.fillRect(p[0]-1,p[1]-1,3,3);Y.l.fillStyle='#c8c0ae';Y.l.fillRect(p[0],p[1]-2,1,1);Y.n.fillStyle='#ffe0a8';Y.n.fillRect(p[0]-1,p[1]-1,3,3);}
      for(const v of [18,24])winR(Y.l,Y.n,I,19,v,11,2,5,'arch','#3c4c5a','#ffe0a8','#e8e0d0',v===18);
      com(S,Y);
      Y=lay(S);{const p=px(I(29,19,0));cypress(Y.l,p[0],p[1],16);const q=px(I(4,30,0));cypress(Y.l,q[0]+2,q[1],12);}
      com(S,Y);
      const sp=px(I(24,7,57));fin(S,[{x:sp[0],y:sp[1]-2}]);
    }
    {// v2：現代火葬場——水平長條清水混凝土＋深出簷＋雙細鋼煙囪＋紀念水池＋納骨牆
      const S=scene(1,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      paraT(S.g,I,4,20,22,30,0,'#b8b8b0');paraT(S.g,I,5,19,23,29,0,'#5a88a4');paraT(S.g,I,5,19,23,24,0,'#46708a');
      let Y=lay(S);
      box(Y.l,I,4,28,4,18,0,10,'#cac8c0','#9c9a92','#b4b2aa',false);
      paraL(Y.l,I,18,12,27,2,8,'#34485a');for(let u=12;u<=27;u+=5)paraL(Y.l,I,18,u,u+.7,2,8,'#b8bcbc');
      for(let u=12.7;u<26;u+=5)paraL(Y.n,I,18,u,u+4.3,2.5,7.5,'rgba(255,224,160,.7)');
      paraL(Y.l,I,18,6,9.5,0,8,'#8a6a48');
      box(Y.l,I,3,29,3,21,10,12,'#e2e0d8','#b0aea6','#c2c0b8');
      paraL(Y.l,I,21,3,29,9,10,'#6e6c66');
      for(const [u,h] of [[17,36],[22,42]]){cyl(Y.l,I,u,7,1.7,12,h,'#c4c8cc','#80868c','#50565c');ring(Y.l,I,u,7,1.7,h-6,'#9aa0a6');}
      box(Y.l,I,8,14,8,13,12,14.5,'#a8aaa6','#80827e','#949692',false);
      com(S,Y);
      Y=lay(S);box(Y.l,I,23,30,21,23.5,0,7,'#bcb8ae','#8e8a80','#a8a49a');
      for(let u=24;u<29;u+=2)for(const z of [5,2.5])paraL(Y.l,I,23.5,u,u+1,z-1.5,z,'#6a665e');
      {const p=px(I(3,27,0));roundTree(Y.l,p[0]+1,p[1],4);}
      com(S,Y);
      const s1=px(I(22,7,42)),s2=px(I(17,7,36));fin(S,[{x:s1[0],y:s1[1]-2},{x:s2[0],y:s2[1]-2}]);
    }
  }catch(e){console.error('v574 k107',e);}

  /* ================= k99 婚禮教堂 ================= */
  try{
    const K=99,pc=v0col(K,1,'#a8b088');
    {// v1：圓形婚禮亭——兩階圓台＋拱窗圓廳＋粉色穹頂＋小燈亭；花拱門＋紅毯
      const S=scene(1,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      paraT(S.g,I,14,18,24,32,0,'#c85464');
      let Y=lay(S);
      cyl(Y.l,I,16,15,11,0,1.5,'#e2ddd2','#b6b0a4','#ece8e0');
      cyl(Y.l,I,16,15,9.5,1.5,3,'#e8e3d8','#bcb6aa','#f2eee6');
      cyl(Y.l,I,16,15,8,3,19,'#f8f4ec','#d2cabc');
      for(let i=0;i<5;i++){const t=-.72+i*.36,p=cylPt(I,16,15,8,t,15);A.winShape570(Y.l,Y.n,p[0]-1,p[1]-1,2,8,'arch',t>.3?'#7c90a4':'#90a8bc','#ffe6c0',t>.3?'#c8c0b0':'#ffffff',i!==4);}
      {const p=cylPt(I,16,15,8,-.05,3);Y.l.fillStyle='#8a5a3a';Y.l.fillRect(p[0]-1,p[1]-6,3,5);}
      cyl(Y.l,I,16,15,8.8,19,21,'#fcfaf4','#d8d0c2','#e8e2d6');
      dome(Y.l,I,16,15,21,8,10,'#e2a2b2','#f6ccd6','#b87888');
      cyl(Y.l,I,16,15,1.6,30,33,'#fcfaf4','#d0c8ba');
      {const p=px(I(16,15,33));Y.l.fillStyle='#e2a2b2';Y.l.fillRect(p[0]-1,p[1]-1,3,1);Y.l.fillStyle='#e8c040';Y.l.fillRect(p[0],p[1]-4,1,3);Y.n.fillStyle='#ffe6c0';Y.n.fillRect(p[0]-1,p[1]+1,3,2);}
      com(S,Y);
      // 花拱門
      Y=lay(S);{const a=px(I(13,30,0)),b=px(I(19,30,0));Y.l.fillStyle='#f4f0e8';Y.l.fillRect(a[0],a[1]-9,1,9);Y.l.fillRect(b[0],b[1]-9,1,9);
        const cx=(a[0]+b[0])/2,cy=Math.min(a[1],b[1])-9,rr=(b[0]-a[0])/2;
        for(let x=Math.ceil(a[0]);x<=b[0];x++){const t=(x-cx)/rr;const y=Math.round(cy+(a[1]-b[1])*(x-cx)/(2*rr)-Math.sqrt(Math.max(0,1-t*t))*4);Y.l.fillStyle=(x%2)?'#f08aa0':'#fbe0e6';Y.l.fillRect(x,y,1,2);}
        Y.l.fillStyle='#6aa860';Y.l.fillRect(a[0]-1,a[1]-3,2,2);Y.l.fillRect(b[0],b[1]-3,2,2);}
      {const p=px(I(29,22,0));Y.l.fillStyle='#8a7a5a';Y.l.fillRect(p[0],p[1]-7,1,7);Y.l.fillStyle='#e8c040';Y.l.fillRect(p[0]-3,p[1]-11,3,3);Y.l.fillRect(p[0]+1,p[1]-11,3,3);Y.l.fillStyle='#f8f0d8';Y.l.fillRect(p[0]-2,p[1]-10,1,1);Y.l.fillRect(p[0]+2,p[1]-10,1,1);
        Y.n.fillStyle='#ffe6a0';Y.n.fillRect(p[0]-3,p[1]-11,7,3);}
      com(S,Y);
      fin(S);
    }
    {// v2：石造鐘樓小教堂——長向雙坡中殿（玫瑰窗朝右）＋前左獨立鐘樓（尖錐頂）＋花棚架
      const S=scene(1,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,1,pc,S.rk,10);
      paraT(S.g,I,8,24,20,22,0,'#7aa060');
      for(let u=9;u<24;u+=3)paraT(S.g,I,u,u+1,20.5,21.5,0,(u%2)?'#f090a8':'#fbe8b0');
      paraT(S.g,I,22,28,24,32,0,sh(pc,16));
      let Y=lay(S);
      box(Y.l,I,6,27,7,19,0,13,'#ece4d4','#c2b8a4','#d4ccbc',false);
      for(const u of [12,17,22])winL(Y.l,Y.n,I,19,u-1,11,2,6,'arch','#8cb0cc','#ffe6c0','#fbf6ea',true);
      gableU(Y.l,I,5,28,6,20,13,9,'#b06878','#c88494','#e0d6c4');
      {const p=px(I(28,13,17));Y.l.fillStyle='#fbf6ea';Y.l.fillRect(p[0]-2,p[1]-2,4,4);Y.l.fillStyle='#d890a8';Y.l.fillRect(p[0]-1,p[1]-1,2,2);Y.n.fillStyle='#ffd8e0';Y.n.fillRect(p[0]-1,p[1]-1,2,2);}
      {const p=px(I(28,11,7));Y.l.fillStyle='#6a4a30';Y.l.fillRect(p[0],p[1],2,6);}
      com(S,Y);
      Y=lay(S);{const u0=2,u1=9,v0=18,v1=25,h=28;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#f4f0e6','#cac2b2','#dcd4c4',false);
        paraL(Y.l,I,v1,u0,u1,18,19,'#d8d0c0');paraR(Y.l,I,u1,v0,v1,18,19,'#b0a898');
        winL(Y.l,Y.n,I,v1,4.5,26,2,4,'arch','#4a4450','#ffe6c0','#fbf6ea',false);
        winR(Y.l,Y.n,I,u1,22.5,26,2,4,'arch','#3e3844','#ffe6c0','#d8d0c0',false);
        {const p=px(I(4.5,v1,26));Y.l.fillStyle='#d8b040';Y.l.fillRect(p[0],p[1]+1,2,2);}
        winL(Y.l,Y.n,I,v1,4.5,14,2,4,'arch','#8cb0cc','#ffe6c0','#fbf6ea',true);
        {const p=px(I(4.5,v1,7));Y.l.fillStyle='#6a4a30';Y.l.fillRect(p[0],p[1],3,7);Y.l.fillRect(p[0]+1,p[1]-1,1,1);}
        box(Y.l,I,u0-.8,u1+.8,v0-.8,v1+.8,h,h+1.5,'#fcfaf4','#d0c8b8','#e8e2d6',false);
        hip(Y.l,I,u0-.8,u1+.8,v0-.8,v1+.8,h+1.5,14,['#c87888','#9a5666','#b06878','#b06878']);
        const t=px(I(5.5,21.5,h+15.5));Y.l.fillStyle='#e8c040';Y.l.fillRect(t[0],t[1]-4,1,4);Y.l.fillRect(t[0]-1,t[1]-3,3,1);}
      com(S,Y);
      // 花棚架＋雙環招牌
      Y=lay(S);{const a=px(I(22,30,0)),b=px(I(28,30,0));Y.l.fillStyle='#fbf8f0';Y.l.fillRect(a[0],a[1]-10,1,10);Y.l.fillRect(b[0],b[1]-10,1,10);
        line(Y.l,[a[0]-1,a[1]-10],[b[0]+1,b[1]-10],'#fbf8f0');line(Y.l,[a[0]-1,a[1]-11],[b[0]+1,b[1]-11],'#e8e0d0');
        for(let x=a[0];x<=b[0];x+=2){const y=Math.round(a[1]-12+(b[1]-a[1])*(x-a[0])/Math.max(1,b[0]-a[0]));Y.l.fillStyle=(x>>1)%2?'#f08aa0':'#78b060';Y.l.fillRect(x,y,2,1);}
        Y.l.fillStyle='#78b060';Y.l.fillRect(a[0]-1,a[1]-4,2,3);Y.l.fillRect(b[0],b[1]-4,2,3);}
      {const p=px(I(30,20,0));Y.l.fillStyle='#8a7a5a';Y.l.fillRect(p[0],p[1]-6,1,6);Y.l.fillStyle='#e8c040';Y.l.fillRect(p[0]-3,p[1]-10,3,3);Y.l.fillRect(p[0]+1,p[1]-10,3,3);Y.l.fillStyle='#f8f0d8';Y.l.fillRect(p[0]-2,p[1]-9,1,1);Y.l.fillRect(p[0]+2,p[1]-9,1,1);
        Y.n.fillStyle='#ffe6a0';Y.n.fillRect(p[0]-3,p[1]-10,7,3);}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k99',e);}

  /* ================= k61 消防總局 ================= */
  try{
    const K=61,pc=v0col(K,3,'#9a9488');
    // 消防車：沿 v 停放（車頭朝 +v）或沿 u 停放（車頭朝 +u）
    const truckV=(Y,I,u,v,len,ladder)=>{const u1=u+7,v1=v+len;
      box(Y.l,I,u,u1,v,v1-4,1,8,'#d23a30','#9e2a24','#bc3028',false);
      box(Y.l,I,u,u1,v1-4,v1,1,9,'#dc4034','#a62c26','#c43228',false);
      paraL(Y.l,I,v1,u+1,u1-1,6,8,'#2c3440');paraR(Y.l,I,u1,v1-3.5,v1-.5,6,8,'#2c3440');
      paraR(Y.l,I,u1,v,v1-4,4,5,'#f0ece0');
      for(const vv of [v+2,v1-3]){const p=px(I(u1,vv,1));Y.l.fillStyle='#22262c';Y.l.fillRect(p[0]-1,p[1]-1,3,2);}
      if(ladder){paraT(Y.l,I,u+2,u+5,v+1,v1-5,8.5,'#c8ccd0');for(let q=v+2;q<v1-5;q+=2)paraT(Y.l,I,u+2,u+5,q,q+.6,8.6,'#8a9098');}
      const p=px(I(u+3.5,v1-2,9));Y.l.fillStyle='#4a90e0';Y.l.fillRect(p[0]-1,p[1]-1,3,1);Y.n.fillStyle='#8ac0ff';Y.n.fillRect(p[0]-1,p[1]-1,3,1);};
    {// v1：紅磚古典消防局——兩層磚樓＋四道拱形車庫門＋後方高曬水帶塔（金字塔頂）＋宿舍側翼＋停車坪兩部消防車
      const S=scene(3,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      paraT(S.g,I,14,66,58,90,0,'#b4b0a6');
      for(const u of [27,40,53])paraT(S.g,I,u-.4,u+.4,60,88,0,'#e0dccf');
      paraT(S.g,I,14,66,88,89,0,'#d8c050');
      castShadow(S,52,64,16,28,40,.16);
      const bL='#b85c48',bR='#8a4436',st='#eadfca',stR='#bcae98';
      let Y=lay(S);
      // 曬水帶塔（在後）
      {const u0=52,u1=64,v0=16,v1=28,h=72;
        box(Y.l,I,u0,u1,v0,v1,0,h,bL,bR,'#7a4034',false);
        for(const z of [34,52])box(Y.l,I,u0-.5,u1+.5,v0-.5,v1+.5,z,z+2,st,stR,st,false);
        for(const z of [42])winR(Y.l,Y.n,I,u1,24,z,2,6,'arch','#2e3440','#ffd890','#eadfca',true);
        for(let i=0;i<3;i++){paraR(Y.l,I,u1,v0+2+i*3.3,v0+4.4+i*3.3,58,68,'#3a3230');for(let z=59;z<68;z+=2)paraR(Y.l,I,u1,v0+2+i*3.3,v0+4.4+i*3.3,z,z+.8,'#8a5a48');}
        box(Y.l,I,u0-1,u1+1,v0-1,v1+1,h,h+2.5,st,stR,st,false);
        hip(Y.l,I,u0-1,u1+1,v0-1,v1+1,h+2.5,11,['#6e7684','#4e5664','#5e6674','#5e6674']);
        const t=px(I(58,22,h+13.5));Y.l.fillStyle='#4a4a4a';Y.l.fillRect(t[0],t[1]-8,1,8);Y.l.fillStyle='#e03a30';Y.l.fillRect(t[0]+1,t[1]-8,5,3);
        Y.l.fillStyle='#e03a30';Y.l.fillRect(t[0]-1,t[1]-1,3,2);Y.n.fillStyle='#ff5a40';Y.n.fillRect(t[0]-1,t[1]-1,3,2);}
      com(S,Y);
      // 主樓
      Y=lay(S);{const u0=14,u1=66,v0=30,v1=58,h=30;
        box(Y.l,I,u0,u1,v0,v1,0,h,bL,bR,'#6c6058',false);
        paraL(Y.l,I,v1,u0,u1,15,16.5,st);paraR(Y.l,I,u1,v0,v1,15,16.5,stR);
        paraL(Y.l,I,v1,u0,u1,27,29,st);paraR(Y.l,I,u1,v0,v1,27,29,stR);
        // 屋頂女兒牆
        box(Y.l,I,u0,u1,v0,v0+1.5,h,h+2.5,'#c86a54','#9a4e3e','#d8a890',false);box(Y.l,I,u0,u0+1.5,v0,v1,h,h+2.5,'#c86a54','#9a4e3e','#d8a890',false);
        box(Y.l,I,30,38,38,46,h,h+5,'#a8a49c','#7e7a72','#94908a',false);
        box(Y.l,I,u0,u1,v1-1.5,v1,h,h+2.5,'#c86a54','#9a4e3e','#d8a890',false);box(Y.l,I,u1-1.5,u1,v0,v1,h,h+2.5,'#c86a54','#9a4e3e','#d8a890',false);
        // 拱形車庫門
        for(let i=0;i<4;i++){const u=17+i*12.3;
          paraL(Y.l,I,v1,u,u+9,0,13,st);paraL(Y.l,I,v1,u+2,u+7,13,14,st);
          paraL(Y.l,I,v1,u+1,u+8,0,12,'#c83a32');paraL(Y.l,I,v1,u+2.5,u+6.5,12,13,'#c83a32');
          paraL(Y.l,I,v1,u+1.5,u+7.5,8,10,'#9ac0d8');paraL(Y.l,I,v1,u+1,u+8,4,4.8,'#9a2c26');
          paraL(Y.n,I,v1,u+1.5,u+7.5,8,10,'rgba(255,220,150,.75)');
          winL(Y.l,Y.n,I,v1,u+3.5,25,2,6,'arch','#2e3844','#ffe0a0',st,S.rk()<.55);}
        for(let v=33;v<57;v+=6){winR(Y.l,Y.n,I,u1,v+2,25,2,6,'arch','#2a323c','#ffe0a0',stR,S.rk()<.45);winR(Y.l,Y.n,I,u1,v+2,11,2,6,'arch','#2a323c','#ffe0a0',stR,S.rk()<.35);}
        // 門楣名牌
        paraL(Y.l,I,v1,34,46,17.5,20.5,'#f4ecd8');paraL(Y.l,I,v1,35,45,18.5,19.5,'#b83a30');
      }
      com(S,Y);
      // 宿舍側翼
      Y=lay(S);box(Y.l,I,66,84,40,58,0,18,'#c4705a','#944e3e','#a45a48',false);
      hip(Y.l,I,65,85,39,59,18,8,['#6e7684','#4e5664','#5e6674','#5e6674']);
      for(let v=43;v<57;v+=5)winR(Y.l,Y.n,I,84,v+2,13,2,5,'punch','#2a323c','#ffe0a0','#e0d4c0',S.rk()<.5);
      for(const u of [70,77])winL(Y.l,Y.n,I,58,u,13,2,5,'punch','#2e3844','#ffe0a0','#eadfca',S.rk()<.5);
      {const p=px(I(71,58,7));Y.l.fillStyle='#5a3a24';Y.l.fillRect(p[0],p[1],3,7);}
      com(S,Y);
      // 消防車＋旗桿＋消防栓
      Y=lay(S);truckV(Y,I,18,62,15,false);truckV(Y,I,43,62,17,true);
      {const p=px(I(8,64,0));Y.l.fillStyle='#b0b4b8';Y.l.fillRect(p[0],p[1]-34,1,34);Y.l.fillStyle='#d23a30';Y.l.fillRect(p[0]+1,p[1]-34,8,5);Y.l.fillStyle='#f4f0e6';Y.l.fillRect(p[0]+1,p[1]-32,8,1);
        const q=px(I(72,86,0));Y.l.fillStyle='#d23a30';Y.l.fillRect(q[0]-1,q[1]-4,3,4);Y.l.fillStyle='#f0c040';Y.l.fillRect(q[0]-1,q[1]-5,3,1);}
      for(const u of [12,68]){const p=px(I(u,90,0));lamp(Y.l,Y.n,p[0],p[1],12,'#3a3e44','#f0e6c0','#ffe9b0');}
      com(S,Y);
      fin(S);
    }
    {// v2：現代消防總局——四層玻璃辦公樓＋寬幅車庫大廳（屋頂直升機坪）＋後方混凝土訓練塔＋雲梯車
      const S=scene(3,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      paraT(S.g,I,22,92,62,92,0,'#bcb8ae');
      for(let u=36;u<90;u+=10)paraT(S.g,I,u-.4,u+.4,64,90,0,'#e0c850');
      castShadow(S,74,88,4,18,34,.16);
      let Y=lay(S);
      // 訓練塔
      {const u0=74,u1=88,v0=4,v1=18,h=66;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#ccc8bc','#9a968c','#aca89e');
        for(let z=10;z<h-4;z+=11){for(const u of [77,83])paraL(Y.l,I,v1,u,u+3,z,z+6,'#34383e');for(const v of [7,13])paraR(Y.l,I,u1,v,v+3,z,z+6,'#2e3238');
          if(((z/11)|0)%2===0){box(Y.l,I,76,84,v1,v1+3,z-1.5,z,'#d84a3e','#a8362e','#e0584a',false);line(Y.l,I(76,v1+3,z+3),I(84,v1+3,z+3),'#e0584a');}}
        line(Y.l,I(u0,v1,h+3),I(u1,v1,h+3),'#e0584a');line(Y.l,I(u1,v0,h+3),I(u1,v1,h+3),'#b8443a');
        {const p=px(I(81,11,h));Y.l.fillStyle='#e03a30';Y.l.fillRect(p[0]-1,p[1]-3,3,2);Y.n.fillStyle='#ff5a40';Y.n.fillRect(p[0]-1,p[1]-3,3,2);}}
      com(S,Y);
      // 辦公樓
      Y=lay(S);{const u0=8,u1=34,v0=28,v1=58,h=42;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#d8d8d2','#a8a8a2','#9c9c96');
        paraL(Y.l,I,v1,u0+2,u1-2,3,h-3,'#3c5268');
        for(let z=3;z<h;z+=9.5)paraL(Y.l,I,v1,u0+2,u1-2,z,z+1.2,'#d0d4d6');
        for(let u=u0+2;u<=u1-2;u+=4.5)paraL(Y.l,I,v1,u,u+.6,3,h-3,'#9aaab6');
        for(let z=4.2;z<h-4;z+=9.5)for(let u=u0+2.6;u<u1-2.5;u+=4.5)if(S.rk()<.3)paraL(Y.n,I,v1,u,u+3.9,z,z+8.3,'rgba(255,236,190,.5)');
        box(Y.l,I,u0-1,u0+1.5,v1-1.5,v1+1,0,h+4,'#e04a3e','#aa362e','#c8443a',false);
        box(Y.l,I,14,22,34,42,h,h+4,'#b0b0aa','#84847e','#9a9a94',false);
        {const p=px(I(26,36,h));Y.l.fillStyle='#6a7078';Y.l.fillRect(p[0],p[1]-14,1,14);Y.l.fillRect(p[0]-2,p[1]-10,5,1);Y.l.fillStyle='#e03a30';Y.l.fillRect(p[0],p[1]-15,1,1);Y.n.fillStyle='#ff5a40';Y.n.fillRect(p[0],p[1]-15,1,1);}}
      com(S,Y);
      // 車庫大廳＋直升機坪
      Y=lay(S);{const u0=34,u1=90,v0=22,v1=62,h=20;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#dedcd4','#acaaa2','#8e8c86');
        paraL(Y.l,I,v1,u0,u1,15.5,19,'#d0443a');paraR(Y.l,I,u1,v0,v1,15.5,19,'#a0342c');
        for(let i=0;i<5;i++){const u=37+i*10.4;paraL(Y.l,I,v1,u,u+8,0,13,'#4e545c');paraL(Y.l,I,v1,u+.7,u+7.3,0,12.3,'#aab6be');
          for(let z=2.5;z<12;z+=2.5)paraL(Y.l,I,v1,u+.7,u+7.3,z,z+.6,'#8a969e');
          paraL(Y.n,I,v1,u+.7,u+7.3,0,12.3,'rgba(255,240,200,.42)');}
        for(let v=26;v<58;v+=8)paraR(Y.l,I,u1,v,v+4,5,12,'#34404c');
        // 直升機坪
        const cu=64,cv=42,r=12;for(let a=0;a<64;a++){const t=a/64*6.283;const p=px(I(cu+Math.cos(t)*r,cv+Math.sin(t)*r,h));Y.l.fillStyle='#e8c830';Y.l.fillRect(p[0],p[1],1,1);}
        paraT(Y.l,I,cu-5,cu-3.6,cv-5,cv+5,h,'#f4f2ea');paraT(Y.l,I,cu+3.6,cu+5,cv-5,cv+5,h,'#f4f2ea');paraT(Y.l,I,cu-3.6,cu+3.6,cv-.7,cv+.7,h,'#f4f2ea');
        for(const [du,dv] of [[-r,0],[r,0],[0,-r],[0,r]]){const p=px(I(cu+du,cv+dv,h));Y.l.fillStyle='#58c870';Y.l.fillRect(p[0],p[1]-1,1,1);Y.n.fillStyle='#80ff90';Y.n.fillRect(p[0],p[1]-1,1,1);}
      }
      com(S,Y);
      // 雲梯車（沿 u）＋指揮車
      Y=lay(S);{const v0=70,v1=77;
        box(Y.l,I,42,62,v0,v1,1,8,'#d23a30','#9e2a24','#bc3028',false);
        box(Y.l,I,62,68,v0,v1,1,10,'#dc4034','#a62c26','#c43228',false);
        paraR(Y.l,I,68,v0+1,v1-1,6,9,'#2c3440');paraL(Y.l,I,v1,62.5,67.5,6,9,'#2c3440');
        paraL(Y.l,I,v1,42,62,4,5,'#f0ece0');
        paraT(Y.l,I,40,62,v0+2,v0+5,9,'#c8ccd0');for(let u=41;u<62;u+=2)paraT(Y.l,I,u,u+.6,v0+2,v0+5,9.1,'#7a8088');
        for(const u of [45,57,65]){const p=px(I(u,v1,1));Y.l.fillStyle='#22262c';Y.l.fillRect(p[0]-1,p[1]-1,3,2);}
        const b=px(I(65,73.5,10));Y.l.fillStyle='#4a90e0';Y.l.fillRect(b[0]-1,b[1]-1,3,1);Y.n.fillStyle='#8ac0ff';Y.n.fillRect(b[0]-1,b[1]-1,3,1);
        box(Y.l,I,76,84,72,77,1,6,'#e8e4dc','#b4b0a8','#d0ccc4',false);paraL(Y.l,I,77,76,84,3,4,'#d23a30');paraL(Y.l,I,77,81,83.5,4.2,5.6,'#2c3440');
        for(const u of [77.5,82.5]){const p=px(I(u,77,1));Y.l.fillStyle='#22262c';Y.l.fillRect(p[0],p[1]-1,2,2);}}
      {const p=px(I(14,68,0));Y.l.fillStyle='#b0b4b8';Y.l.fillRect(p[0],p[1]-30,1,30);Y.l.fillStyle='#d23a30';Y.l.fillRect(p[0]+1,p[1]-30,8,5);Y.l.fillStyle='#f4f0e6';Y.l.fillRect(p[0]+3,p[1]-29,3,3);}
      for(const u of [26,92]){const p=px(I(u,94,0));lamp(Y.l,Y.n,p[0],p[1],12,'#3a3e44','#e8ecf0','#e8f0ff');}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k61',e);}

  /* ================= k115 市民中心 ================= */
  try{
    const K=115,pc=v0col(K,3,'#9a9484');
    const flags=['#e05252','#5aa0e8','#58c470','#f0a040','#b070d8'];
    {// v1：U 形廣場市民會堂——中央列柱大廳＋淺圓頂＋兩側拱廊翼樓＋中庭噴泉＋旗列
      const S=scene(3,K,1),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      paraT(S.g,I,26,70,38,90,0,'#d6c8a4');
      for(let v=46;v<90;v+=8)paraT(S.g,I,26,70,v,v+.6,0,'#c4b690');
      for(let u=34;u<70;u+=8)paraT(S.g,I,u,u+.6,38,90,0,'#c4b690');
      paraT(S.g,I,40,56,58,74,0,'#e2d6b8');
      const sL='#eee8da',sR='#c6beaa',roof=['#c87858','#9a5a42','#b06a4e','#b06a4e'];
      let Y=lay(S);
      // 左翼（面向中庭的右面有拱廊）
      box(Y.l,I,10,26,12,72,0,18,sL,sR,'#b8b09c',false);
      for(let v=42;v<70;v+=6.5){paraR(Y.l,I,26,v,v+4,0,9,'#8a8272');paraR(Y.l,I,26,v+.8,v+3.2,9,10.5,'#8a8272');
        winR(Y.l,Y.n,I,26,v+3.5,15,2,4,'punch','#46525c','#ffe6b0','#d8d0bc',S.rk()<.5);
        paraR(Y.n,I,26,v+.8,v+3.2,1,8,'rgba(255,220,160,.45)');}
      for(const u of [13,18,23])winL(Y.l,Y.n,I,72,u-1,14,2,6,'arch','#46525c','#ffe6b0','#faf6ec',S.rk()<.6);
      hip(Y.l,I,9,27,11,73,18,8,roof);
      com(S,Y);
      // 中央大廳
      Y=lay(S);{const u0=26,u1=70,v0=10,v1=38,h=28;
        box(Y.l,I,u0,u1,v0,v1,0,h,sL,sR,'#bab29e',false);
        paraL(Y.l,I,v1,u0+3,u1-3,0,21,'#a89e8a');
        for(let u=u0+5;u<u1-5;u+=7){winL(Y.l,Y.n,I,v1,u,17,2,10,'arch','#4e5a64','#ffe6b0','#c8c0ac',S.rk()<.7);}
        for(let i=0;i<9;i++){const u=u0+3.5+i*4.6;const a=px(I(u,v1+2,0)),b=px(I(u,v1+2,21));Y.l.fillStyle='#faf6ec';Y.l.fillRect(a[0],b[1],2,a[1]-b[1]);Y.l.fillStyle='#d0c8b4';Y.l.fillRect(a[0]+2,b[1],1,a[1]-b[1]);}
        box(Y.l,I,u0,u1,v1,v1+3,21,h,'#f6f0e2','#d0c8b4','#e2dccc',false);
        paraL(Y.l,I,v1+3,u0,u1,24,25,'#c8bea8');
        box(Y.l,I,u0-1,u1+1,v0-1,v1+4,h,h+2,'#faf6ec','#d4ccb8','#c4bca8',false);
        for(let v=14;v<36;v+=7)winR(Y.l,Y.n,I,u1,v+2,22,2,8,'arch','#46525c','#ffe6b0','#d8d0bc',S.rk()<.5);
        cyl(Y.l,I,48,24,10,h+2,h+8,'#f2ecde','#c8c0ac','#dcd4c2');
        for(let i=0;i<6;i++){const t=-.8+i*.32,p=cylPt(I,48,24,10,t,h+2);Y.l.fillStyle=t<.3?'#56626c':'#46525c';Y.l.fillRect(p[0],p[1]-5,1,3);if(i%2)Y.n.fillStyle='#ffe0a0',Y.n.fillRect(p[0],p[1]-5,1,3);}
        dome(Y.l,I,48,24,h+8,10,9,'#a8bccb','#cddae4','#7e94a6');
        cyl(Y.l,I,48,24,2,h+17,h+21,'#faf6ec','#c8c0ac','#e0d8c8');
        const t=px(I(48,24,h+21));Y.l.fillStyle='#e0b840';Y.l.fillRect(t[0],t[1]-4,1,4);}
      com(S,Y);
      // 右翼
      Y=lay(S);box(Y.l,I,70,86,12,72,0,18,sL,sR,'#b8b09c',false);
      for(let v=16;v<70;v+=7)winR(Y.l,Y.n,I,86,v+2,14,2,6,'arch','#3e4a54','#ffe6b0','#d8d0bc',S.rk()<.5);
      for(const u of [73,78,83])winL(Y.l,Y.n,I,72,u-1,14,2,6,'arch','#46525c','#ffe6b0','#faf6ec',S.rk()<.6);
      {const p=px(I(77,72,7));Y.l.fillStyle='#6a4a30';Y.l.fillRect(p[0],p[1],3,7);}
      hip(Y.l,I,69,87,11,73,18,8,roof);
      com(S,Y);
      // 噴泉＋旗列＋樹＋長椅
      Y=lay(S);cyl(Y.l,I,48,66,6,0,2.5,'#e6e0d2','#b8b2a4','#5ab4d0');
      cyl(Y.l,I,48,66,1.5,2.5,6,'#e6e0d2','#b8b2a4','#8ad0e4');
      {const p=px(I(48,66,6));Y.l.fillStyle='#bfe8f4';Y.l.fillRect(p[0],p[1]-4,1,4);}
      for(let i=0;i<5;i++){const u=32+i*8,p=px(I(u,86,0));Y.l.fillStyle='#8a8a92';Y.l.fillRect(p[0],p[1]-20,1,20);Y.l.fillStyle=flags[i];Y.l.fillRect(p[0]+1,p[1]-20,6,4);}
      {let p=px(I(8,88,0));roundTree(Y.l,p[0],p[1],5);p=px(I(86,82,0));roundTree(Y.l,p[0],p[1],6);}
      for(const u of [30,62]){const p=px(I(u,78,0));Y.l.fillStyle='#8a6a42';Y.l.fillRect(p[0],p[1]-3,6,2);Y.l.fillStyle='#5a4028';Y.l.fillRect(p[0],p[1]-1,1,1);Y.l.fillRect(p[0]+5,p[1]-1,1,1);}
      com(S,Y);
      fin(S);
    }
    {// v2：現代市民會館——筒拱大屋頂＋全玻璃前廳＋雨遮＋前方下沉式階梯劇場＋時鐘標誌柱
      const S=scene(3,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      paraT(S.g,I,24,74,52,92,0,'#cfc8b6');
      let Y=lay(S);
      // 標誌柱（在後左）
      {const p0=[4,48];box(Y.l,I,p0[0],p0[0]+5,p0[1],p0[1]+5,0,40,'#f2f0ea','#c4c2ba','#dcdad2',false);
        paraL(Y.l,I,p0[1]+5,p0[0],p0[0]+5,8,30,'#d04a3e');paraR(Y.l,I,p0[0]+5,p0[1],p0[1]+5,8,30,'#3a6ab0');
        const c=px(I(p0[0]+2.5,p0[1]+5,37));Y.l.fillStyle='#fbfaf6';Y.l.fillRect(c[0]-2,c[1]-2,4,4);Y.l.fillStyle='#2a2e34';Y.l.fillRect(c[0]-1,c[1]-1,1,2);Y.l.fillRect(c[0]-1,c[1],2,1);
        Y.n.fillStyle='#fff0c0';Y.n.fillRect(c[0]-2,c[1]-2,4,4);}
      com(S,Y);
      // 會館本體＋筒拱屋頂
      Y=lay(S);{const u0=14,u1=84,v0=10,v1=46,h=22,rise=16;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#eeebe3','#c4c0b6',null);
        paraL(Y.l,I,v1,u0+3,u1-3,2,h-2,'#3e566c');
        for(let u=u0+3;u<=u1-3;u+=5)paraL(Y.l,I,v1,u,u+.6,2,h-2,'#b8c8d4');
        paraL(Y.l,I,v1,u0+3,u1-3,11,12,'#d8dee2');
        for(let u=u0+3.6;u<u1-4;u+=5){if(S.rk()<.5)paraL(Y.n,I,v1,u,u+4.4,2.5,10.8,'rgba(255,236,190,.5)');if(S.rk()<.3)paraL(Y.n,I,v1,u,u+4.4,12.2,h-2.5,'rgba(255,236,190,.4)');}
        for(let v=14;v<44;v+=6)paraR(Y.l,I,u1,v,v+3,6,17,'#3a4c5e');
        const N=18,zs=[];for(let i=0;i<=N;i++){const v=v0+(v1-v0)*i/N;zs.push([v,h+rise*Math.sin(Math.PI*i/N)]);}
        Q(Y.l,I,[[u1,v0,h]].concat(zs.map(q=>[u1,q[0],q[1]])).concat([[u1,v1,h]]),'#d2cec4');
        for(let i=0;i<N;i++){const a=zs[i],b=zs[i+1];const slope=(b[1]-a[1]);
          const col=slope>3?'#9aa8b2':slope>0?'#b6c2ca':slope>-3?'#cdd6dc':'#bcc8d0';
          Q(Y.l,I,[[u0,a[0],a[1]],[u1,a[0],a[1]],[u1,b[0],b[1]],[u0,b[0],b[1]]],col);}
        for(let i=0;i<N;i++){const a=zs[i],b=zs[i+1];line(Y.l,I(u1,a[0],a[1]),I(u1,b[0],b[1]),'#f6f4ee');}
        for(let u=u0+12;u<u1-4;u+=23){for(let i=0;i<N;i++){const a=zs[i],b=zs[i+1];line(Y.l,I(u,a[0],a[1]),I(u,b[0],b[1]),'#98a4ac');}}
      }
      // 雨遮
      box(Y.l,I,36,62,46,55,12,13.5,'#f6f4ee','#c8c6be','#e8e6de',false);
      for(const u of [37,61]){const a=px(I(u,54.5,0)),b=px(I(u,54.5,12));Y.l.fillStyle='#8a9098';Y.l.fillRect(a[0],b[1],1,a[1]-b[1]);}
      com(S,Y);
      // 階梯劇場（往前遞降）＋舞台
      Y=lay(S);{for(let i=0;i<5;i++){const va=58+i*4,hh=(5-i)*1.6;box(Y.l,I,30,68,va,va+4,0,hh,'#d8d2c4','#aca698','#e6e0d2',false);paraL(Y.l,I,va+4,30,68,hh-.6,hh,'#f2eee4');}
        box(Y.l,I,38,60,78,88,0,2.4,'#b89a70','#8e7454','#c8aa80',false);
        for(const u of [39,59]){const p=px(I(u,87,2.4));Y.l.fillStyle='#50565e';Y.l.fillRect(p[0],p[1]-14,1,14);Y.l.fillStyle='#e8ecf0';Y.l.fillRect(p[0]-1,p[1]-15,3,2);Y.n.fillStyle='#fff4d0';Y.n.fillRect(p[0]-1,p[1]-15,3,2);}}
      {let p=px(I(90,60,0));roundTree(Y.l,p[0],p[1],6);p=px(I(88,82,0));roundTree(Y.l,p[0],p[1],6);p=px(I(10,72,0));roundTree(Y.l,p[0],p[1],6);}
      for(let i=0;i<3;i++){const p=px(I(20,56+i*8,0));Y.l.fillStyle='#8a8a92';Y.l.fillRect(p[0],p[1]-16,1,16);Y.l.fillStyle=flags[i+1];Y.l.fillRect(p[0]+1,p[1]-16,2,8);}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k115',e);}

  /* ================= k54 大墓園 ================= */
  try{
    const K=54,pc='#8a9280';
    // 直立墓碑（2×4 像素＋頂圓角），依 (u+v) 由後往前畫
    const stone=(l,I,u,v,c)=>{const p=px(I(u,v,0));l.fillStyle=c||'#b8bcb2';l.fillRect(p[0]-1,p[1]-4,3,4);l.fillRect(p[0],p[1]-5,1,1);l.fillStyle='#dcdfd8';l.fillRect(p[0]-1,p[1]-4,1,3);l.fillStyle='#7e8478';l.fillRect(p[0]-1,p[1]-1,3,1);};
    {// v1：圍牆哥德禮拜堂墓園——低石牆＋拱門＋中軸柏樹大道＋尖塔禮拜堂＋側邊小陵墓
      const S=scene(3,K,1,6),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      for(const [a,b,c,d] of [[8,44,8,44],[52,90,8,44],[8,44,52,90],[52,90,52,90]])paraT(S.g,I,a,b,c,d,0,'#7a8a68');
      paraT(S.g,I,44,52,36,94,0,'#b8b2a4');paraT(S.g,I,8,90,45,51,0,'#b0aa9c');
      for(let v=40;v<94;v+=6)paraT(S.g,I,44,52,v,v+.6,0,'#a49e90');
      castShadow(S,43,53,36,46,30,.14);
      let Y=lay(S);
      // 後牆
      box(Y.l,I,4,92,4,6,0,5,'#a8aca0','#80847a','#bcc0b4',false);box(Y.l,I,4,6,6,92,0,5,'#a8aca0','#80847a','#bcc0b4',false);
      for(let u=4;u<=92;u+=11)box(Y.l,I,u-1,u+1.5,3.5,6.5,0,7,'#b4b8ac','#8a8e84','#c8ccc0',false);
      for(let v=15;v<=92;v+=11)box(Y.l,I,3.5,6.5,v-1,v+1.5,0,7,'#b4b8ac','#8a8e84','#c8ccc0',false);
      com(S,Y);
      // 後排墓碑（禮拜堂後方與兩側）
      Y=lay(S);const G=[];
      for(let u=12;u<42;u+=7)for(let v=12;v<42;v+=8)G.push([u,v]);
      for(let u=58;u<88;u+=7)for(let v=12;v<42;v+=8)if(!(u>66&&v<30))G.push([u,v]);
      G.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));for(const [u,v] of G)if(S.rk()<.55)stone(Y.l,I,u+S.rk()*1.5,v);
      com(S,Y);
      // 小陵墓（右後）
      Y=lay(S);box(Y.l,I,70,84,12,26,0,10,'#e2e4dc','#b8bab2','#cfd1c9',false);
      paraL(Y.l,I,26,74,80,0,7,'#6a6e68');
      for(const u of [71.5,82.5]){const a=px(I(u,27,0)),b=px(I(u,27,10));Y.l.fillStyle='#f0f2ea';Y.l.fillRect(a[0],b[1],2,a[1]-b[1]);}
      hip(Y.l,I,69,85,11,28,10,7,['#c4c8bc','#9a9e94','#b0b4a8','#b0b4a8']);
      com(S,Y);
      // 禮拜堂本體（脊沿 v，山牆朝前）
      Y=lay(S);{const u0=38,u1=58,v0=10,v1=36;
        box(Y.l,I,u0,u1,v0,v1,0,20,'#a2a89e','#767c72','#8a9086',false);
        for(let v=13;v<34;v+=5.5){winR(Y.l,Y.n,I,u1,v+2,16,2,9,'arch','#3a4452','#f0c880','#c8ccc0',S.rk()<.4);box(Y.l,I,u1,u1+1.5,v+2.5,v+3.8,0,14,'#aab0a6','#7e847a',null,false);}
        gableV(Y.l,I,u0-1,u1+1,v0-1,v1,20,15,'#4a5452','#5e6a66','#a8aea4');}
      com(S,Y);
      // 前塔＋尖頂
      Y=lay(S);{const u0=43,u1=53,v0=36,v1=46,h=34;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#aeb4aa','#80867c','#949a90',false);
        paraL(Y.l,I,v1,u0,u1,22,23,'#c4c8bc');paraR(Y.l,I,u1,v0,v1,22,23,'#9aa094');
        {const p=px(I(46.5,v1,11));Y.l.fillStyle='#c4c8bc';Y.l.fillRect(p[0]-1,p[1]-2,5,1);Y.l.fillStyle='#3a2e26';Y.l.fillRect(p[0],p[1]-1,3,11);Y.l.fillRect(p[0]+1,p[1]-2,1,1);Y.n.fillStyle='#f0c880';Y.n.fillRect(p[0],p[1]+2,3,8);}
        {const p=px(I(48,v1,18));Y.l.fillStyle='#c4c8bc';Y.l.fillRect(p[0]-2,p[1]-2,5,5);Y.l.fillStyle='#5a6a8a';Y.l.fillRect(p[0]-1,p[1]-1,3,3);Y.n.fillStyle='#e8b870';Y.n.fillRect(p[0]-1,p[1]-1,3,3);}
        winL(Y.l,Y.n,I,v1,47.5,31,2,5,'arch','#2e343c','#f0c880','#c4c8bc',false);winR(Y.l,Y.n,I,u1,42,31,2,5,'arch','#2a3038','#f0c880','#9aa094',false);
        hip(Y.l,I,u0-.5,u1+.5,v0-.5,v1+.5,h,24,['#56625e','#3c4644','#4a5652','#4a5652']);
        const t=px(I(48,41,h+24));Y.l.fillStyle='#d8dad4';Y.l.fillRect(t[0],t[1]-7,1,7);Y.l.fillRect(t[0]-2,t[1]-5,5,1);}
      com(S,Y);
      // 前排墓碑＋柏樹大道
      Y=lay(S);const F=[];
      for(let u=12;u<42;u+=7)for(let v=56;v<88;v+=8)F.push([u,v,0]);
      for(let u=58;u<88;u+=7)for(let v=56;v<88;v+=8)F.push([u,v,0]);
      for(let u=12;u<40;u+=7)F.push([u,40,0]);
      for(const v of [58,72,86]){F.push([42,v,1]);F.push([54,v,1]);}
      F.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
      for(const [u,v,t] of F){if(t){const p=px(I(u,v,0));cypress(Y.l,p[0],p[1],15);}else if(S.rk()<.52)stone(Y.l,I,u+S.rk()*1.5,v);}
      com(S,Y);
      // 前牆＋拱門
      Y=lay(S);
      box(Y.l,I,90,92,6,92,0,5,'#a8aca0','#80847a','#bcc0b4',false);
      box(Y.l,I,6,43,90,92,0,5,'#a8aca0','#80847a','#bcc0b4',false);box(Y.l,I,53,92,90,92,0,5,'#a8aca0','#80847a','#bcc0b4',false);
      for(let u=4;u<=92;u+=11)if(u<40||u>56)box(Y.l,I,u-1,u+1.5,89.5,92.5,0,7,'#b4b8ac','#8a8e84','#c8ccc0',false);
      for(let v=15;v<=92;v+=11)box(Y.l,I,89.5,92.5,v-1,v+1.5,0,7,'#b4b8ac','#8a8e84','#c8ccc0',false);
      for(const u of [40,53]){box(Y.l,I,u,u+3,89,93,0,15,'#b8bcb0','#8a8e84','#cacec2',false);box(Y.l,I,u-.5,u+3.5,88.5,93.5,15,16.5,'#c8ccc0','#9a9e94','#d8dcd0',false);}
      for(let i=0;i<=12;i++){const t=i/12,u=43+10*t,z=15+Math.sin(Math.PI*t)*5;const p=px(I(u,92,z));Y.l.fillStyle='#3e3a36';Y.l.fillRect(p[0],p[1],1,2);}
      for(const u of [41.5,54.5]){const p=px(I(u,93,16.5));Y.l.fillStyle='#e8d8a0';Y.l.fillRect(p[0]-1,p[1]-3,2,2);Y.n.fillStyle='#ffd890';Y.n.fillRect(p[0]-1,p[1]-3,2,2);}
      com(S,Y);
      fin(S);
    }
    {// v2：草坪紀念公園——中央圓形廣場方尖碑＋L 形納骨迴廊＋平放紀念石列＋開放涼亭＋落葉樹
      const S=scene(3,K,2,4),I=S.I;
      plateOn(S.g,S.ax,S.ay,3,pc,S.rk,40);
      paraT(S.g,I,6,90,6,90,0,'#7e9068');
      const cu=50,cv=54,R=14,circ=(r)=>{const P=[];for(let i=0;i<28;i++){const a=i/28*6.283;P.push(I(cu+Math.cos(a)*r,cv+Math.sin(a)*r,0));}return P;};
      paraT(S.g,I,cu-2.5,cu+2.5,cv,94,0,'#c2bcae');paraT(S.g,I,cu,94,cv-2.5,cv+2.5,0,'#c2bcae');
      poly(S.g,circ(R),'#c8c2b4');poly(S.g,circ(R-2),'#d2ccbe');
      castShadow(S,cu-2,cu+2,cv-2,cv+2,30,.14);
      // 墓碑列（花崗岩色、疏排）：以方尖碑為界分前後兩層
      const GB=[],GF=[];
      for(let u=20;u<88;u+=9)for(let v=22;v<90;v+=9){const du=u-cu,dv=v-cv;if(du*du+dv*dv<(R+6)*(R+6))continue;if(Math.abs(u-cu)<5||Math.abs(v-cv)<5)continue;if(u>64&&v>60)continue;
        if(S.rk()<.7)((u+v<cu+cv)?GB:GF).push([u+S.rk()*1.5,v]);}
      let Y=lay(S);
      // 納骨牆（沿後右邊，一字形）
      {const cL='#dcd8cc',cR='#aca89c',cT='#c8c4b8';
        box(Y.l,I,18,88,6,12,0,9,cL,cR,cT,false);
        for(let u=18;u<88;u+=10){paraL(Y.l,I,12,u,u+.6,0,9,'#b8b4a8');for(const z of [3,6.5])paraL(Y.l,I,12,u+3.5,u+6,z-1.5,z,'#a8906a');}
        box(Y.l,I,17,89,5,13.5,9,10.5,'#eeeae0','#bab6aa','#d6d2c6',false);}
      com(S,Y);
      // 樹（後）＋後排墓碑
      Y=lay(S);for(const [u,v] of [[10,26],[84,20],[22,84]]){const p=px(I(u,v,0));roundTree(Y.l,p[0],p[1],6,'#8ab060','#5e8a46','#3e6232');}
      com(S,Y);
      Y=lay(S);GB.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));for(const [u,v] of GB)stone(Y.l,I,u,v,'#a4a8a6');
      com(S,Y);
      // 方尖碑
      Y=lay(S);{box(Y.l,I,cu-6,cu+6,cv-6,cv+6,0,2.5,'#c8c4b8','#9a968a','#dad6ca',false);box(Y.l,I,cu-4,cu+4,cv-4,cv+4,2.5,5,'#d0ccc0','#a29e92','#e0dcd0',false);
        const b=2.3,t=1.3,z0=5,z1=44;
        Q(Y.l,I,[[cu+b,cv-b,z0],[cu+b,cv+b,z0],[cu+t,cv+t,z1],[cu+t,cv-t,z1]],'#a8a498');
        Q(Y.l,I,[[cu-b,cv+b,z0],[cu+b,cv+b,z0],[cu+t,cv+t,z1],[cu-t,cv+t,z1]],'#e2ded2');
        Q(Y.l,I,[[cu-t,cv+t,z1],[cu+t,cv+t,z1],[cu,cv,z1+5]],'#eeeade');Q(Y.l,I,[[cu+t,cv-t,z1],[cu+t,cv+t,z1],[cu,cv,z1+5]],'#b8b4a8');
        const p=px(I(cu,cv+b,20));Y.l.fillStyle='#c8a850';Y.l.fillRect(p[0]-1,p[1],2,2);}
      for(const [u,v] of [[cu-11,cv+10],[cu+10,cv-11]]){const p=px(I(u,v,0));Y.l.fillStyle='#8a6a42';Y.l.fillRect(p[0]-2,p[1]-3,5,2);Y.l.fillStyle='#5a4028';Y.l.fillRect(p[0]-2,p[1]-1,1,1);Y.l.fillRect(p[0]+2,p[1]-1,1,1);}
      com(S,Y);
      Y=lay(S);GF.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));for(const [u,v] of GF)stone(Y.l,I,u,v,'#a4a8a6');
      com(S,Y);
      // 開放涼亭（右前）
      Y=lay(S);{const u0=70,u1=86,v0=66,v1=82;
        for(const [u,v] of [[u0+1,v0+1],[u1-1,v0+1],[u0+1,v1-1],[u1-1,v1-1]]){const a=px(I(u,v,0)),b=px(I(u,v,13));Y.l.fillStyle='#e6e2d8';Y.l.fillRect(a[0],b[1],2,a[1]-b[1]);}
        box(Y.l,I,u0,u1,v0,v1,13,15,'#eeeae0','#bab6aa','#d2cec2',false);
        hip(Y.l,I,u0-1,u1+1,v0-1,v1+1,15,5,['#6a7470','#4e5854','#5c6662','#5c6662']);
        for(const [u,v] of [[u0+1,v1-1],[u1-1,v1-1],[u1-1,v0+1]]){const a=px(I(u,v,0)),b=px(I(u,v,13));Y.l.fillStyle='#f2eee4';Y.l.fillRect(a[0],b[1],2,a[1]-b[1]);Y.l.fillStyle='#bab6aa';Y.l.fillRect(a[0]+1,b[1],1,a[1]-b[1]);}
        const p=px(I(78,74,13));Y.n.fillStyle='rgba(255,224,160,.8)';Y.n.fillRect(p[0]-1,p[1]+1,3,2);Y.l.fillStyle='#e8dcb0';Y.l.fillRect(p[0]-1,p[1]+1,3,2);}
      for(const [u,v] of [[88,50],[40,88],[62,90]]){const p=px(I(u,v,0));roundTree(Y.l,p[0],p[1],6,'#8ab060','#5e8a46','#3e6232');}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k54',e);}

  /* ================= k66 信仰中心 ================= */
  try{
    const K=66,pc=v0col(K,2,'#b4ac9c');
    {// v1：圓頂多元禮拜堂——圓形鼓座大廳＋青綠穹頂＋前方尖拱門樓＋後右細高塔＋水鏡前庭
      const S=scene(2,K,1,4),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,18,46,46,62,0,'#d8d0bc');paraT(S.g,I,26,38,52,60,0,'#c8c0ac');paraT(S.g,I,27,37,53,59,0,'#5a9ab8');paraT(S.g,I,27,37,53,54,0,'#4a809c');
      castShadow(S,50,56,6,12,24,.15);
      const sL='#e6decc',sR='#b6ac98';
      let Y=lay(S);
      // 後右細高塔
      {box(Y.l,I,50,56,6,12,0,46,sL,sR,'#cac2b0',false);
        for(const z of [16,30])paraL(Y.l,I,12,50,56,z,z+1,'#c8bea8');
        winL(Y.l,Y.n,I,12,52,26,2,5,'arch','#3a5058','#ffe4a8','#f4ecdc',S.rk()<.6);
        box(Y.l,I,49,57,5,13,40,42,'#f2ecde','#c2b8a4','#dcd4c2',false);
        cyl(Y.l,I,53,9,2.6,42,50,'#eee6d4','#bcb29e');for(const t of [-.4,.4]){const p=cylPt(I,53,9,2.6,t,48);Y.l.fillStyle='#3a5058';Y.l.fillRect(p[0],p[1]-3,1,3);Y.n.fillStyle='#ffe4a8';Y.n.fillRect(p[0],p[1]-3,1,3);}
        dome(Y.l,I,53,9,50,2.8,4,'#5aa8a4','#8ad0cc','#3a7a7a');
        const t=px(I(53,9,54));Y.l.fillStyle='#e0b840';Y.l.fillRect(t[0],t[1]-3,1,3);}
      com(S,Y);
      // 鼓座大廳＋穹頂
      Y=lay(S);{const cu=31,cv=29;
        cyl(Y.l,I,cu,cv,17,0,19,sL,sR);
        for(let i=0;i<7;i++){const t=-.86+i*.287,p=cylPt(I,cu,cv,17,t,16);A.winShape570(Y.l,Y.n,p[0]-1,p[1]-1,2,9,'arch',t>.3?'#3a5058':'#46606a','#ffe4a8',t>.3?'#d0c6b2':'#f6f0e2',S.rk()<.6);}
        cyl(Y.l,I,cu,cv,18,19,21.5,'#f4eee0','#c8beaa','#d8d0bc');
        cyl(Y.l,I,cu,cv,12,21.5,28,sL,sR);
        for(let i=0;i<5;i++){const t=-.8+i*.4,p=cylPt(I,cu,cv,12,t,26.5);Y.l.fillStyle=t>.3?'#34484e':'#3e545c';Y.l.fillRect(p[0],p[1]-3,1,3);if(i%2===0){Y.n.fillStyle='#ffe4a8';Y.n.fillRect(p[0],p[1]-3,1,3);}}
        dome(Y.l,I,cu,cv,28,12,16,'#52a0a0','#86cac6','#347474');
        cyl(Y.l,I,cu,cv,1.8,43,46,'#f4eee0','#c8beaa');
        const t=px(I(cu,cv,46));Y.l.fillStyle='#e0b840';Y.l.fillRect(t[0],t[1]-5,1,5);Y.l.fillRect(t[0]-1,t[1]-7,3,2);}
      com(S,Y);
      // 尖拱門樓
      Y=lay(S);{const u0=23,u1=39,v0=43,v1=49,h=26;
        box(Y.l,I,u0,u1,v0,v1,0,h,'#f0e8d6','#c2b8a2','#dcd4c0',false);
        paraL(Y.l,I,v1,u0,u1,h-2,h-1,'#c8bca4');
        Q(Y.l,I,[[26.5,v1,0],[35.5,v1,0],[35.5,v1,14],[31,v1,21],[26.5,v1,14]],'#c4b89e');
        Q(Y.l,I,[[28,v1,0],[34,v1,0],[34,v1,13],[31,v1,18],[28,v1,13]],'#3e5058');
        Q(Y.l,I,[[29.5,v1,0],[32.5,v1,0],[32.5,v1,9],[29.5,v1,9]],'#6a4a30');
        Q(Y.n,I,[[28.5,v1,10],[33.5,v1,10],[33.5,v1,13],[31,v1,17],[28.5,v1,13]],'rgba(255,220,150,.8)');
        for(const u of [u0+1.5,u1-3])box(Y.l,I,u,u+1.5,v1-.5,v1+1,h,h+4,'#f4eee0','#c8beaa','#e0d8c6',false);
        for(let i=0;i<5;i++){const u=u0+1+i*3.3;paraL(Y.l,I,v1,u,u+1.6,h,h+1.5,'#e8e0cc');}}
      for(const u of [16,46]){const p=px(I(u,58,0));cypress(Y.l,p[0],p[1],15);}
      com(S,Y);
      fin(S);
    }
    {// v2：東方重簷殿宇——石台基＋紅柱格扇大殿＋重簷歇山頂（翹角）＋前方牌坊＋石燈籠
      const S=scene(2,K,2),I=S.I;
      plateOn(S.g,S.ax,S.ay,2,pc,S.rk,26);
      paraT(S.g,I,27,37,48,64,0,'#c8c0ae');for(let v=50;v<64;v+=3)paraT(S.g,I,27,37,v,v+.5,0,'#b4ac9a');
      const tile=['#5e6e6a','#40504c','#50605c','#50605c'],red='#b84a3a',redR='#8a3428';
      const upturn=(l,I,u0,u1,v0,v1,zb,col)=>{for(const [u,v,dx] of [[u0,v1,-1],[u1,v1,0],[u1,v0,1]]){const p=px(I(u,v,zb));l.fillStyle=col;l.fillRect(p[0]+(dx<0?-2:dx>0?1:0),p[1]-2,dx===0?1:2,1);l.fillRect(p[0]+(dx<0?-1:dx>0?0:0),p[1]-1,1,1);}};
      let Y=lay(S);
      box(Y.l,I,10,54,10,50,0,4,'#ccc4b4','#9c9484','#d6cebe',false);
      box(Y.l,I,26,38,50,54,0,2.5,'#ccc4b4','#9c9484','#d6cebe',false);
      // 大殿
      {const u0=15,u1=49,v0=15,v1=45,h=19;
        box(Y.l,I,u0,u1,v0,v1,4,h,red,redR,null,false);
        for(let u=u0+1;u<u1;u+=5.5){paraL(Y.l,I,v1,u+1.2,u+4.6,6,h-2,'#e4d2a8');for(let z=8;z<h-2;z+=3)paraL(Y.l,I,v1,u+1.2,u+4.6,z,z+.7,'#a88a5c');
          paraL(Y.n,I,v1,u+1.2,u+4.6,6,h-2,'rgba(255,214,140,.55)');}
        for(let u=u0;u<=u1;u+=5.5)paraL(Y.l,I,v1+.5,u,u+1.2,4,h,'#7a2a20');
        for(let v=v0+2;v<v1-2;v+=6)paraR(Y.l,I,u1,v,v+3.5,7,h-3,'#caa878');
        paraL(Y.l,I,v1,u0,u1,h-1.5,h,'#3e4a48');paraR(Y.l,I,u1,v0,v1,h-1.5,h,'#2e3836');
        hip(Y.l,I,u0-5,u1+5,v0-5,v1+5,h,8,tile,true);
        upturn(Y.l,I,u0-5,u1+5,v0-5,v1+5,h,'#7a8a84');
        box(Y.l,I,22,42,22,38,h+4,h+11,red,redR,null,false);
        for(let u=23;u<41;u+=4.5)paraL(Y.l,I,38,u+.8,u+3.6,h+6,h+10,'#e4d2a8');
        hip(Y.l,I,18,46,18,42,h+11,11,tile,true);
        upturn(Y.l,I,18,46,18,42,h+11,'#7a8a84');
        const a=px(I(30,30,h+22)),b=px(I(34,30,h+22));Y.l.fillStyle='#2e3a38';Y.l.fillRect(a[0]-1,a[1]-3,2,3);Y.l.fillRect(b[0],b[1]-3,2,3);
        const c=px(I(32,30,h+22));Y.l.fillStyle='#d8b040';Y.l.fillRect(c[0],c[1]-4,1,3);}
      com(S,Y);
      // 牌坊＋石燈籠＋香爐＋松
      Y=lay(S);{const v=58;
        for(const u of [23,41]){const a=px(I(u,v,0)),b=px(I(u,v,21));Y.l.fillStyle='#c04a3a';Y.l.fillRect(a[0],b[1],2,a[1]-b[1]);Y.l.fillStyle='#8a3428';Y.l.fillRect(a[0]+2,b[1],1,a[1]-b[1]);Y.l.fillStyle='#8a8478';Y.l.fillRect(a[0]-1,a[1]-2,4,2);}
        box(Y.l,I,21,45,v-1,v+1,15,16.5,'#c84e3e','#96382c','#d05a48',false);
        box(Y.l,I,19,47,v-1.5,v+1.5,20,22,'#3e4a48','#2e3836','#56625e',false);
        const e1=px(I(19,v+1.5,22)),e2=px(I(47,v+1.5,22));Y.l.fillStyle='#56625e';Y.l.fillRect(e1[0]-2,e1[1]-2,2,1);Y.l.fillRect(e2[0]+1,e2[1]-2,2,1);
        const pl=px(I(32,v,17.5));Y.l.fillStyle='#d8b040';Y.l.fillRect(pl[0]-3,pl[1]-1,6,2);}
      for(const u of [18,46]){const p=px(I(u,52,0));Y.l.fillStyle='#a8a296';Y.l.fillRect(p[0]-1,p[1]-2,3,2);Y.l.fillRect(p[0],p[1]-6,1,4);Y.l.fillStyle='#c8c2b4';Y.l.fillRect(p[0]-2,p[1]-9,5,3);Y.l.fillStyle='#6a665e';Y.l.fillRect(p[0]-2,p[1]-10,5,1);
        Y.l.fillStyle='#f0d890';Y.l.fillRect(p[0]-1,p[1]-8,3,1);Y.n.fillStyle='#ffd890';Y.n.fillRect(p[0]-1,p[1]-8,3,1);}
      cyl(Y.l,I,32,53,2.5,0,4,'#6a5a48','#4a3e30','#3a3028');
      {const p=px(I(5,36,0));roundTree(Y.l,p[0],p[1],6,'#6a9a5a','#44703e','#2e5030');}
      com(S,Y);
      fin(S);
    }
  }catch(e){console.error('v574 k66',e);}
});
