(window.__variants574=window.__variants574||[]).push(function b10(A){
  const SPR=A.SPR(), B=SPR.bld;
  const shade=A.shade, R=Math.round;

  /* ---------- 像素基元（整數像素、零共用亂數） ---------- */
  const mk=(w,h)=>{const r=A.cv(w,h);return {c:r[0],g:r[1]};};
  const P=(g,x,y,w,h,c)=>{w=R(w);h=R(h);if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(R(x),R(y),w,h);};
  function poly(g,pts,c){ // 凸多邊形：像素中心取樣
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    g.fillStyle=c;const n=pts.length;let area=0;for(let k=0;k<n;k++){const a=pts[k],b=pts[(k+1)%n];area+=a[0]*b[1]-b[0]*a[1];}const s=area>0?1:-1;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){let run=-1;
      for(let x=Math.floor(x0);x<=Math.ceil(x1)+1;x++){const px=x+.5,py=y+.5;let ok=x<=Math.ceil(x1);
        for(let k=0;k<n&&ok;k++){const a=pts[k],b=pts[(k+1)%n];if(s*((b[0]-a[0])*(py-a[1])-(b[1]-a[1])*(px-a[0]))<-.01)ok=false;}
        if(ok&&run<0)run=x;if(!ok&&run>=0){g.fillRect(run,y,x-run,1);run=-1;}}}}
  function seg(g,x0,y0,x1,y1,c){x0=R(x0);y0=R(y0);x1=R(x1);y1=R(y1);
    const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;g.fillStyle=c;
    for(let n=0;n<600;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx;}if(e2<dx){e+=dx;y0+=sy;}}}
  const up=(p,z)=>[p[0],p[1]-z];
  /* 等距方盒：足跡 i∈[i0,i0+a]、j∈[j0,j0+b]，z0 起算、牆高 h */
  function box(g,G,i0,j0,a,b,h,cL,cR,cT,z0){z0=z0||0;
    const S=up(G(i0+a,j0+b),z0),E=up(G(i0+a,j0),z0),W=up(G(i0,j0+b),z0),N=up(G(i0,j0),z0);
    if(cL&&b>0)poly(g,[up(W,h),up(S,h),S,W],cL);
    if(cR&&a>0)poly(g,[up(S,h),up(E,h),E,S],cR);
    if(cT)poly(g,[up(N,h),up(E,h),up(S,h),up(W,h)],cT);
    return {S,E,W,N,h};}
  /* 牆面欄位：side -1 左面（沿 S→W）/ +1 右面（沿 S→E）；d 欄、t 離地列 */
  const fx=(S,side,d)=>side<0?S[0]-1-d:S[0]+d;
  const fyb=(S,d)=>S[1]-1-Math.ceil(d/2);
  function fr(g,S,side,d0,w,t0,hh,c){for(let d=d0;d<d0+w;d++)P(g,fx(S,side,d),fyb(S,d)-t0-hh+1,1,hh,c);}
  /* 頂緣受光線 */
  function topEdge(g,bx,cl,cr){const S=bx.S,h=bx.h,nl=S[0]-bx.W[0],nr=bx.E[0]-S[0];
    if(cl)fr(g,S,-1,0,nl,h-1,1,cl);if(cr)fr(g,S,1,0,nr,h-1,1,cr);}
  /* 直立圓柱：地面橢圓中心 (cx,cy)、半徑 r、高 h；cols=[亮,中,暗,最暗] */
  function cyl(g,cx,cy,r,h,cols,top,rim){const ry=r/2;
    for(let x=cx-r;x<cx+r;x++){const u=(x+.5-cx)/r,e=ry*Math.sqrt(Math.max(0,1-u*u));
      const c=u<-.45?cols[0]:u<.1?cols[1]:u<.62?cols[2]:cols[3];
      const yt=R(cy-h-e),yb=R(cy+e);P(g,x,yt,1,yb-yt+1,c);
      if(top){const t0=R(cy-h-e),t1=R(cy-h+e);P(g,x,t0,1,t1-t0+1,top);if(rim)P(g,x,t0,1,1,rim);}}}
  function ellipse(g,cx,cy,r,ry,c){for(let x=cx-r;x<cx+r;x++){const u=(x+.5-cx)/r,e=ry*Math.sqrt(Math.max(0,1-u*u));const t0=R(cy-e),t1=R(cy+e);P(g,x,t0,1,t1-t0+1,c);}}
  function sphere(g,cx,cy,r,cols){for(let y=cy-r;y<cy+r;y++)for(let x=cx-r;x<cx+r;x++){const u=(x+.5-cx)/r,v=(y+.5-cy)/r,q=u*u+v*v;if(q>1)continue;
    const l=-.55*u-.6*v+.35*Math.sqrt(1-q);P(g,x,y,1,1,l>.45?cols[0]:l>.05?cols[1]:l>-.35?cols[2]:cols[3]);}}
  /* 沿 i 或 j 的粗管（等距直線 + 厚度） */
  function pipe(g,G,a,b,z,th,c,hi){const p0=up(G(a[0],a[1]),z),p1=up(G(b[0],b[1]),z);
    for(let t=0;t<th;t++)seg(g,p0[0],p0[1]+t,p1[0],p1[1]+t,t===0&&hi?hi:c);}
  /* 山牆屋頂：ridge 'i' = 屋脊沿 i；'j' = 屋脊沿 j */
  function gable(g,G,i0,j0,a,b,h,rh,ridge,cSlope,cBack,cWallL,cWallR,z0){z0=z0||0;const H=z0+h,T=z0+h+rh;
    if(ridge==='i'){const jm=j0+b/2;
      poly(g,[up(G(i0,j0),H),up(G(i0+a,j0),H),up(G(i0+a,jm),T),up(G(i0,jm),T)],cBack);
      poly(g,[up(G(i0,j0+b),H),up(G(i0+a,j0+b),H),up(G(i0+a,jm),T),up(G(i0,jm),T)],cSlope);
      poly(g,[up(G(i0+a,j0+b),H),up(G(i0+a,j0),H),up(G(i0+a,jm),T)],cWallR);
    }else{const im=i0+a/2;
      poly(g,[up(G(i0,j0),H),up(G(i0,j0+b),H),up(G(im,j0+b),T),up(G(im,j0),T)],cBack);
      poly(g,[up(G(i0+a,j0),H),up(G(i0+a,j0+b),H),up(G(im,j0+b),T),up(G(im,j0),T)],cSlope);
      poly(g,[up(G(i0,j0+b),H),up(G(i0+a,j0+b),H),up(G(im,j0+b),T)],cWallL);}}
  function hip(g,G,i0,j0,a,b,h,rh,cL,cR,z0){z0=z0||0;const H=z0+h,T=up(G(i0+a/2,j0+b/2),H+rh);
    poly(g,[up(G(i0,j0+b),H),up(G(i0+a,j0+b),H),T],cL);poly(g,[up(G(i0+a,j0+b),H),up(G(i0+a,j0),H),T],cR);}

  /* ---------- 社區/防災座（T364c/d：2× raw + sc .5）：保留 v0 地坪，重畫上方結構 ---------- */
  function civic(k,sz,draw){
    const v0=B[k+'_1_0'];if(!v0||!v0.img)throw new Error('no v0 '+k);
    const W=v0.w,H=v0.h,lw=W>>1,lh=H>>1,ax=v0.ax,ay=v0.ay,hw=sz===1?64:128,top=ay-hw,cut=sz===1?174:198;
    const L=mk(lw,lh),T=mk(lw,lh),NL=mk(lw,lh);
    const No=[ax>>1,top>>1],G=(i,j)=>[No[0]+2*i-2*j,No[1]+i+j];
    draw({g:L.g,tg:T.g,ng:NL.g,G});
    A.outlineSprite(L.c,26,30,44);
    const o=mk(W,H);o.g.drawImage(v0.img,0,0);
    const id=o.g.getImageData(0,0,W,H),d=id.data,so=((sz===1?178:206)*W+ax)*4,smp=[d[so],d[so+1],d[so+2],d[so+3]];
    for(let y=0;y<cut;y++)for(let x=0;x<W;x++){const q=(y*W+x)*4,r=y-top,half=2*(r+1);
      if(r>=0&&r<(hw>>1)&&x>=ax-half&&x<ax+half){d[q]=smp[0];d[q+1]=smp[1];d[q+2]=smp[2];d[q+3]=smp[3];}else d[q+3]=0;}
    /* v0 的 AO 橫條（baseY+28）在 2×2 時伸出佔地菱形外＝浮空橫線：cut 以下到菱形最寬列，菱形外一律清掉 */
    for(let y=cut;y<top+(hw>>1);y++)for(let x=0;x<W;x++){const r=y-top,half=2*(r+1);if(x<ax-half||x>=ax+half)d[(y*W+x)*4+3]=0;}
    o.g.putImageData(id,0,0);
    o.g.drawImage(L.c,0,0,W,H);o.g.drawImage(T.c,0,0,W,H);
    const n=mk(W,H);n.g.drawImage(NL.c,0,0,W,H);n.g.save();n.g.globalCompositeOperation='destination-in';n.g.drawImage(o.c,0,0);n.g.restore();
    const sp={img:o.c,night:n.c,ax,ay,w:W,h:H,smoke:[]};if(v0.sc!==undefined)sp.sc=v0.sc;return sp;
  }
  const lampWarm='rgba(255,196,112,.9)',lampCool='rgba(150,222,255,.85)',winWarm='rgba(255,200,120,.82)',winCool='rgba(146,220,255,.72)';
  /* 球場燈桿：頭部位置固定對齊 T364c 冷暖光錐（raw (11,92)/(132,88)） */
  function courtMasts(g,ng){
    /* 畫在不描邊層：2px 細桿（左亮右暗）＋燈頭，底座壓暗落地 */
    for(const m of[{x:5,hy:45,by:94},{x:65,hy:43,by:93}]){
      P(g,m.x,m.hy+2,1,m.by-m.hy-2,'#7f8d95');P(g,m.x+1,m.hy+2,1,m.by-m.hy-2,'#3f4c54');
      P(g,m.x-2,m.hy-1,6,1,'#2b353b');P(g,m.x-2,m.hy,6,1,'#f4f0d0');P(g,m.x-2,m.hy+1,6,1,'#b9bca8');P(g,m.x-2,m.hy+2,6,1,'#2b353b');
      P(g,m.x-1,m.by-1,4,2,'#2b353b');
      P(ng,m.x-2,m.hy,6,2,'rgba(255,232,170,.95)');}
  }

  /* ================= k124 籃球場 ================= */
  try{
    const K=124;
    B[K+'_1_1']=civic(K,1,({g,tg,ng,G})=>{ // v1：全場＋三階看台
      box(g,G,1,1,14,14,1,'#8a3f34','#6e3229','#a85042');
      poly(g,[G(2,5),G(14,5),G(14,13),G(2,13)],'#253b50');
      const ln='#eef2dc';
      const L4=(a,b)=>{const p=G(a[0],a[1]),q=G(b[0],b[1]);seg(g,p[0],p[1],q[0],q[1],ln);};
      L4([2,5],[14,5]);L4([14,5],[14,13]);L4([14,13],[2,13]);L4([2,13],[2,5]);L4([8,5],[8,13]);
      poly(g,[G(2,7),G(5,7),G(5,11),G(2,11)],'#a85042');poly(g,[G(11,7),G(14,7),G(14,11),G(11,11)],'#a85042');
      L4([5,7],[5,11]);L4([11,7],[11,11]);
      {const c=G(8,9);P(g,c[0]-2,c[1]-1,5,1,ln);P(g,c[0]-2,c[1]+1,5,1,ln);P(g,c[0]-3,c[1],1,1,ln);P(g,c[0]+3,c[1],1,1,ln);}
      // 看台（背側 j∈[1,4]，面向球場）
      box(g,G,3,1,10,1,7,'#9aa3a6','#6f787c','#b04a3e');
      box(g,G,3,2,10,1,5,'#a9b1b3','#7a8387','#3f6f9c');
      box(g,G,3,3,10,1,3,'#b3babb','#848d90','#b04a3e');
      // 籃架
      for(const e of[{i:1,j:9,dir:1},{i:15,j:9,dir:-1}]){const b=G(e.i,e.j);
        P(g,b[0],b[1]-10,1,10,'#53616a');P(g,b[0]-2,b[1]-13,5,4,'#e8ecea');P(g,b[0]-1,b[1]-12,3,2,'#c94f3c');P(g,b[0]+(e.dir>0?1:-2),b[1]-9,2,1,'#e08a3a');}
      courtMasts(tg,ng);
    });
    B[K+'_1_2']=civic(K,1,({g,tg,ng,G})=>{ // v2：鐵網籠街頭半場＋遮陽休息亭
      box(g,G,1,1,14,14,1,'#454b51','#373c41','#565d63');
      const ln='#e9ecde';const L4=(a,b,c)=>{const p=G(a[0],a[1]),q=G(b[0],b[1]);seg(g,p[0],p[1],q[0],q[1],c||ln);};
      poly(g,[G(3,6),G(7,6),G(7,11),G(3,11)],'#a85042');
      L4([3,4],[11,4]);L4([11,4],[11,13]);L4([11,13],[3,13]);L4([3,13],[3,4]);L4([7,6],[7,11]);
      {const c=G(11,8.5);P(g,c[0]-2,c[1]-1,4,1,ln);}
      {const b=G(2,8.5);P(g,b[0],b[1]-10,1,10,'#53616a');P(g,b[0]-2,b[1]-13,5,4,'#e8ecea');P(g,b[0]-1,b[1]-12,3,2,'#c94f3c');P(g,b[0]+1,b[1]-9,2,1,'#e08a3a');}
      // 鐵網籠（後兩側高網）：柱與上欄先畫（在器材室之後方），網面半透明放 tg
      const H=12;
      for(let t=0;t<=14;t+=3.5){const a=G(1+t,1),b=G(1,1+t);P(g,a[0],a[1]-H,1,H,'#56626a');P(g,b[0],b[1]-H,1,H,'#56626a');}
      {const a=G(1,1),b=G(15,1),c=G(1,15);seg(g,a[0],a[1]-H,b[0],b[1]-H,'#7d8a90');seg(g,a[0],a[1]-H,c[0],c[1]-H,'#7d8a90');}
      // 器材室：右後角小屋＋單坡橘頂
      const kb=box(g,G,11,1,4,3,6,'#d8cfbd','#a89f8e',null);
      poly(g,[up(G(10.5,0.5),8),up(G(15.5,0.5),8),up(G(15.5,4.5),6),up(G(10.5,4.5),6)],'#c45a42');
      {const s=up(G(15.5,4.5),6),w=up(G(10.5,4.5),6);seg(g,w[0],w[1],s[0]-1,s[1],'#8a3a31');}
      fr(g,kb.S,-1,2,2,0,4,'#5a4636');fr(g,kb.S,-1,5,2,2,2,'#5f8190');
      courtMasts(tg,ng);
      {const a=G(1,1),b=G(11,1),c=G(1,15);
        for(let x=a[0];x<b[0];x++){const y=a[1]+(x-a[0])/2;for(let t=1;t<H;t++)if(((x+t)&1)===0)P(tg,x,R(y)-t,1,1,'rgba(176,190,196,.30)');}
        for(let x=c[0];x<a[0];x++){const y=a[1]+(a[0]-x)/2;for(let t=1;t<H;t++)if(((x+t)&1)===0)P(tg,x,R(y)-t,1,1,'rgba(176,190,196,.30)');}}
      {const s=kb.S;P(ng,fx(s,-1,5),fyb(s,5)-3,2,2,winWarm);}
    });
  }catch(e){console.error('v574 k124',e);}

  /* ================= k125 網球場 ================= */
  try{
    const K=125;
    B[K+'_1_1']=civic(K,1,({g,tg,ng,G})=>{ // v1：硬地球場＋山牆俱樂部小屋
      box(g,G,1,1,14,14,1,'#20493f','#193a33','#285d55');
      poly(g,[G(3,6),G(15,6),G(15,14),G(3,14)],'#234b61');
      const ln='#eff3de';const L4=(a,b)=>{const p=G(a[0],a[1]),q=G(b[0],b[1]);seg(g,p[0],p[1],q[0],q[1],ln);};
      L4([3.5,6.5],[14.5,6.5]);L4([14.5,6.5],[14.5,13.5]);L4([14.5,13.5],[3.5,13.5]);L4([3.5,13.5],[3.5,6.5]);
      L4([3.5,7.5],[14.5,7.5]);L4([3.5,12.5],[14.5,12.5]);L4([6,10],[12,10]);L4([6,7.5],[6,12.5]);L4([12,7.5],[12,12.5]);
      // 俱樂部小屋（背角，縮小讓球場成為主角）
      const bx=box(g,G,1.5,1,5,3,7,'#e3dccb','#b3ab99',null);
      fr(g,bx.S,-1,1,2,0,5,'#6b4a36');fr(g,bx.S,-1,4,2,2,3,'#5f8190');
      fr(g,bx.S,1,3,2,2,3,'#4f6f7c');
      gable(g,G,1.5,1,5,3,7,3,'i','#4f7a66','#355646','#e3dccb','#c7bfad');
      // 長椅與花台
      {const b=G(9.5,3.5);P(g,b[0]-3,b[1]-3,7,1,'#8a6a42');P(g,b[0]-3,b[1]-2,1,2,'#6d523e');P(g,b[0]+3,b[1]-2,1,2,'#6d523e');}
      box(g,G,12,1.5,2,2,2,'#8a7a62','#6d604d','#5f8f4e');
      // 網（跨短邊）
      {const a=G(9,6),b=G(9,14);P(g,a[0],a[1]-4,1,4,'#b8c4c8');P(g,b[0],b[1]-4,1,4,'#b8c4c8');
        seg(g,a[0],a[1]-2,b[0],b[1]-2,'#3b4a50');seg(g,a[0],a[1]-3,b[0],b[1]-3,'#f2f4ea');}
      courtMasts(tg,ng);
      {const s=bx.S;P(ng,fx(s,-1,4),fyb(s,4)-4,2,3,winWarm);}
    });
    B[K+'_1_2']=civic(K,1,({g,tg,ng,G})=>{ // v2：紅土球場＋防風布圍牆＋裁判椅＋觀眾棚
      box(g,G,1,1,14,14,1,'#8c4c32','#733d28','#a85c3c');
      poly(g,[G(3,4),G(15,4),G(15,13),G(3,13)],'#c4744a');
      const ln='#f1ece0';const L4=(a,b)=>{const p=G(a[0],a[1]),q=G(b[0],b[1]);seg(g,p[0],p[1],q[0],q[1],ln);};
      L4([3,5],[15,5]);L4([15,5],[15,12]);L4([15,12],[3,12]);L4([3,12],[3,5]);L4([5,8.5],[13,8.5]);L4([5,6],[5,11]);L4([13,6],[13,11]);
      // 防風布圍牆（背兩側實牆）
      const H=8;
      poly(g,[up(G(1,1),H),up(G(15,1),H),G(15,1),G(1,1)],'#2f5b48');
      poly(g,[up(G(1,1),H),up(G(1,15),H),G(1,15),G(1,1)],'#264c3c');
      {const a=G(1,1),b=G(15,1),c=G(1,15);seg(g,a[0],a[1]-H,b[0],b[1]-H,'#8a979c');seg(g,a[0],a[1]-H,c[0],c[1]-H,'#8a979c');
        seg(g,a[0],a[1]-3,b[0],b[1]-3,'#3b6b56');seg(g,a[0],a[1]-3,c[0],c[1]-3,'#325e4b');
        for(let t=0;t<=14;t+=7){const p=G(1+t,1),q=G(1,1+t);P(g,p[0],p[1]-H,1,H,'#6f7d82');P(g,q[0],q[1]-H,1,H,'#6f7d82');}}
      // 觀眾棚（右後角，網邊）
      for(const p of[[10,1.5],[14,1.5],[14,3.5],[10,3.5]]){const b=G(p[0],p[1]);P(g,b[0],b[1]-6,1,6,'#7d8a90');}
      {const b=G(12,3);P(g,b[0]-5,b[1]-2,9,1,'#6d523e');}
      box(g,G,9.5,1,5,3,1,'#dfe3dc','#b9beb8','#f2f4ee',6);
      // 網與裁判椅
      {const a=G(9,4),b=G(9,13);P(g,a[0],a[1]-4,1,4,'#b8c4c8');P(g,b[0],b[1]-4,1,4,'#b8c4c8');
        seg(g,a[0],a[1]-2,b[0],b[1]-2,'#3b4a50');seg(g,a[0],a[1]-3,b[0],b[1]-3,'#f2f4ea');}
      {const b=G(9,14);P(g,b[0]-1,b[1]-8,1,8,'#6d7b82');P(g,b[0]+2,b[1]-8,1,8,'#56636a');P(g,b[0]-1,b[1]-4,4,1,'#6d7b82');
        P(g,b[0]-1,b[1]-10,4,2,'#2f5b48');P(g,b[0]-1,b[1]-12,1,2,'#2f5b48');}
      courtMasts(tg,ng);
    });
  }catch(e){console.error('v574 k125',e);}

  /* ================= k128 變電所 ================= */
  try{
    const K=128;
    B[K+'_1_1']=civic(K,1,({g,ng,G})=>{ // v1：現代 GIS 室內變電站＋戶外主變＋格構進線塔
      // 進線格構塔（後方）
      {const b=G(12,2),Hm=36;
        for(let t=0;t<Hm;t++){P(g,b[0]-2,b[1]-t,1,1,'#4a5d68');P(g,b[0]+2,b[1]-t,1,1,'#3a4a54');if(t%6===0)P(g,b[0]-2,b[1]-t,5,1,'#4a5d68');if(t%6===3)P(g,b[0],b[1]-t,1,1,'#56697a');}
        for(let t=0;t<Hm-6;t+=6){seg(g,b[0]-2,b[1]-t,b[0]+2,b[1]-t-6,'#44565f');}
        P(g,b[0]-8,b[1]-Hm,17,2,'#4a5d68');P(g,b[0]-8,b[1]-Hm,17,1,'#7f95a0');
        for(const dx of[-7,0,7]){P(g,b[0]+dx,b[1]-Hm+2,1,4,'#c3d2d4');P(g,b[0]+dx,b[1]-Hm+6,1,1,'#d9a64a');}
      }
      const bx=box(g,G,1,4,9,10,15,'#8ea0a4','#56666d','#6d7e84');
      topEdge(g,bx,'#b3c3c6','#76878d');
      poly(g,[up(G(2,5),15),up(G(9,5),15),up(G(9,13),15),up(G(2,13),15)],'#61727a');
      for(const t of[5,10])fr(g,bx.S,-1,1,16,t,1,'#7b8d92');
      fr(g,bx.S,-1,12,5,0,7,'#3a454c');fr(g,bx.S,-1,14,1,0,7,'#2c353b');fr(g,bx.S,-1,9,2,4,2,'#d9a64a');
      for(let t=4;t<13;t+=2)fr(g,bx.S,1,3,6,t,1,'#46545b');
      fr(g,bx.S,-1,2,8,12,2,'#5e8a9c');fr(g,bx.S,1,12,4,12,2,'#4b7382');
      // 戶外主變壓器
      const tb=box(g,G,11,8,4,5,6,'#6e838a','#4a5a61','#8ea2a8');
      for(let d=1;d<10;d+=2)fr(g,tb.S,1,d,1,1,4,'#3a474d');
      for(let d=1;d<8;d+=2)fr(g,tb.S,-1,d,1,1,4,'#5b6f76');
      for(const p of[[12,9.5],[13.5,10.5],[12.5,11.5]]){const b=up(G(p[0],p[1]),6);P(g,b[0],b[1]-4,1,4,'#c3d2d4');P(g,b[0],b[1]-5,1,1,'#d9a64a');}
      {const t=G(12,2);const a=up(G(12,9.5),10),c=up(G(13.5,10.5),10);seg(g,t[0]-7,t[1]-30,a[0],a[1]+1,'#9fb1b8');seg(g,t[0],t[1]-30,c[0],c[1]+1,'#9fb1b8');}
      // 夜：門燈與高窗帶
      {const s=bx.S;P(ng,fx(s,-1,9),fyb(s,9)-7,2,2,lampWarm);fr(ng,s,-1,2,8,12,2,winCool);}
    });
    B[K+'_1_2']=civic(K,1,({g,ng,G})=>{ // v2：老式紅磚變電塔（1920s）＋木桿進線＋綠色配電箱
      // 木電桿（左後）
      {const b=G(2,11);P(g,b[0],b[1]-24,1,24,'#7a5a3e');P(g,b[0]+1,b[1]-24,1,24,'#5a412c');P(g,b[0]-4,b[1]-22,10,1,'#6b4d35');
        for(const dx of[-4,1,5])P(g,b[0]+dx,b[1]-25,1,3,'#c3d2d4');}
      const bx=box(g,G,5,5,6,6,30,'#b0654a','#7a3f2e',null);
      topEdge(g,bx,'#cf8a6a',null);
      fr(g,bx.S,-1,0,12,10,1,'#d8c8ab');fr(g,bx.S,1,0,12,10,1,'#a8997f');
      fr(g,bx.S,-1,0,12,24,1,'#d8c8ab');fr(g,bx.S,1,0,12,24,1,'#a8997f');
      fr(g,bx.S,-1,4,4,0,8,'#4e5a52');fr(g,bx.S,-1,4,4,8,1,'#d8c8ab');
      for(const d of[3,8])fr(g,bx.S,-1,d,2,15,5,'#2f3438');
      for(const d of[3,8])fr(g,bx.S,1,d,2,15,5,'#26292c');
      for(const d of[3,8]){fr(g,bx.S,-1,d,2,20,1,'#d8c8ab');}
      hip(g,G,4.5,4.5,7,7,30,9,'#6b7a82','#48555c');
      poly(g,[up(G(4.5,11.5),30),up(G(11.5,11.5),30),up(G(11.5,11.5),31),up(G(4.5,11.5),31)],'#3f4a50');
      // 塔頂絕緣子托架＋進線
      for(const d of[2,7]){const x=fx(bx.S,1,d),y=fyb(bx.S,d)-26;P(g,x,y,3,1,'#3c4d56');P(g,x+2,y-3,1,3,'#c3d2d4');}
      {const b=G(2,11),x=fx(bx.S,-1,10),y=fyb(bx.S,10)-26;P(g,x-1,y,2,1,'#3c4d56');P(g,x-1,y-3,1,3,'#c3d2d4');seg(g,b[0]+1,b[1]-25,x-1,y-3,'#9fb1b8');seg(g,b[0]+5,b[1]-25,x-1,y-2,'#9fb1b8');}
      // 綠色配電箱
      const kb=box(g,G,12,11,3,3,6,'#6a8c74','#4b6653','#86a88e');
      fr(g,kb.S,-1,1,4,1,4,'#557561');fr(g,kb.S,-1,2,2,4,1,'#d9a64a');
      // 夜：門燈
      {const s=bx.S;P(g,fx(s,-1,5),fyb(s,5)-10,2,1,'#f2d48a');P(ng,fx(s,-1,5)-1,fyb(s,5)-10,4,2,lampWarm);}
    });
  }catch(e){console.error('v574 k128',e);}

  /* ================= k130 抽水站 ================= */
  try{
    const K=130;
    B[K+'_1_1']=civic(K,1,({g,ng,G})=>{ // v1：山牆泵房＋高聳調壓塔＋粗管
      cyl(g,57,94,5,34,['#c3cccc','#97a4a6','#6a777c','#56636a'],'#d6dddd','#eef2f0');
      {P(g,52,60,10,1,'#4c5a61');for(let t=62;t<92;t+=3)P(g,53,t,1,1,'#3e4a50');P(g,54,62,1,30,'#56636a');
        P(g,52,84,10,2,'#397e9d');}
      pipe(g,G,[12.5,3],[12.5,7],5,3,'#397e9d','#6fb3cf');
      const bx=box(g,G,2,5,9,9,11,'#95a2a2','#5d6a6f',null);
      topEdge(g,bx,'#bcc7c6',null);
      fr(g,bx.S,-1,3,6,0,7,'#324951');for(let d=4;d<9;d+=2)fr(g,bx.S,-1,d,1,1,6,'#4c6670');
      fr(g,bx.S,-1,12,2,5,3,'#6b8995');fr(g,bx.S,-1,15,2,5,3,'#6b8995');
      fr(g,bx.S,1,5,2,5,3,'#4f6a74');fr(g,bx.S,1,11,2,5,3,'#4f6a74');
      gable(g,G,2,5,9,9,11,5,'i','#7b898c','#4c5a61','#95a2a2','#6f7c80');
      fr(g,bx.S,-1,2,8,8,1,'#d7ad42');
      pipe(g,G,[11,12],[15.5,12],3,3,'#397e9d','#6fb3cf');pipe(g,G,[11,9],[15.5,9],3,3,'#2f6f8c','#5ea2bf');
      {const b=up(G(14,12),6);P(g,b[0]-1,b[1]-3,3,3,'#d7ad42');P(g,b[0],b[1]-2,1,1,'#6b5220');}
      {const s=bx.S;P(ng,fx(s,-1,12),fyb(s,12)-7,2,3,winCool);P(ng,fx(s,-1,15),fyb(s,15)-7,2,3,winCool);P(ng,52,60,1,1,'rgba(255,120,100,.9)');}
      P(g,52,59,1,1,'#e05a4a');
    });
    B[K+'_1_2']=civic(K,1,({g,tg,ng,G})=>{ // v2：排水渠閘站：明渠＋攔污柵＋門式吊架
      // 明渠（沿 i 穿越）
      poly(g,[G(0,9),G(16,9),G(16,14),G(0,14)],'#8c9594');
      poly(g,[up(G(0,9.5),0),G(16,9.5),G(16,13.5),G(0,13.5)],'#35708a');
      {const a=G(0,9.5),b=G(16,9.5);for(let t=0;t<2;t++)seg(g,a[0],a[1]+t,b[0],b[1]+t,'#6b7473');}
      for(let i=1;i<15;i+=4){const p=G(i+1,11.5);P(g,p[0],p[1],3,1,'#5d9fb8');}
      {const a=G(0,13.5),b=G(16,13.5);seg(g,a[0],a[1],b[0],b[1],'#b7bfbd');}
      const bx=box(g,G,3,1,9,7,13,'#a3adab','#68767a','#7f8b8c');
      topEdge(g,bx,'#c9d0cd','#8a9699');
      poly(g,[up(G(4,2),13),up(G(11,2),13),up(G(11,7),13),up(G(4,7),13)],'#717d7e');
      fr(g,bx.S,-1,2,10,9,2,'#5e7f8c');fr(g,bx.S,1,2,10,9,2,'#4b6773');
      // 攔污柵（建築前、渠後壁）
      for(const i of[4.5,7,9.5]){const p=G(i,9);for(let d=0;d<4;d++)P(g,p[0]-d,p[1]+(d>>1)-6,1,7,d%2?'#2b3f47':'#4e6670');P(g,p[0]-3,p[1]-7,4,1,'#8fa0a6');}
      // 出水管
      pipe(g,G,[12,5],[15.5,5],2,3,'#397e9d','#6fb3cf');
      // 門式吊架（跨渠）
      {const a=G(13,8),b=G(13,15),Hg=18;
        for(const p of[a,b]){P(g,p[0],p[1]-Hg,1,Hg,'#d7ad42');P(g,p[0]+1,p[1]-Hg,1,Hg,'#a07e2c');P(g,p[0]-1,p[1]-1,4,1,'#6b5220');}
        for(let t=0;t<2;t++)seg(g,a[0],a[1]-Hg-t,b[0],b[1]-Hg-t,t?'#e8c25a':'#a07e2c');
        const m=G(13,11.5);P(g,m[0]-2,m[1]-Hg+1,4,3,'#4c5a61');P(g,m[0],m[1]-Hg+4,1,5,'#2d3439');P(g,m[0]-1,m[1]-Hg+9,3,1,'#2d3439');
        P(g,a[0],a[1]-Hg-3,1,1,'#e05a4a');P(ng,a[0],a[1]-Hg-3,1,1,'rgba(255,120,100,.9)');}
      {const s=bx.S;fr(ng,s,-1,2,10,9,2,winCool);}
    });
  }catch(e){console.error('v574 k130',e);}

  const GREEN=['#a6cc80','#7fae60','#5e8e4a','#456f3b'];
  function tree(g,x,y,r,tall){P(g,x,y-(tall||4),1,tall||4,'#6a583f');sphere(g,x+1,y-(tall||4)-r+1,r,GREEN);}
  function bench(g,x,y){P(g,x-2,y-2,5,1,'#8a6a42');P(g,x-2,y-1,1,1,'#5a412c');P(g,x+2,y-1,1,1,'#5a412c');}

  /* ================= k126 兒童遊樂場 ================= */
  try{
    const K=126;
    B[K+'_1_1']=civic(K,1,({g,tg,ng,G})=>{ // v1：木造遊戲塔＋紅尖頂＋藍色螺旋管滑梯＋蹺蹺板
      box(g,G,1,1,14,14,1,'#b89a52','#9e8445','#d9bd70');
      {const a=G(1,1),b=G(15,1),c=G(1,15),s=G(15,15);seg(g,c[0],c[1]-1,s[0]-1,s[1]-1,'#8a6a42');seg(g,s[0],s[1]-1,b[0]-1,b[1]-1,'#7a5a3a');}
      poly(g,[up(G(3,10),1),up(G(8,10),1),up(G(8,14),1),up(G(3,14),1)],'#e9d38d');
      // 塔：四柱＋平台＋半牆＋尖頂
      for(const p of[[4,3],[9,3],[9,8],[4,8]]){const b=up(G(p[0],p[1]),1);P(g,b[0],b[1]-10,1,10,'#7a5a3e');}
      box(g,G,4,3,5,5,2,'#b57a3e','#8a5a2c','#d9a05a',10);
      const wl=box(g,G,4,3,5,5,4,'#d94c3f','#a8382f',null,12);
      fr(g,wl.S,-1,3,4,1,2,'#f2bd44');fr(g,wl.S,1,3,4,1,2,'#c99a30');
      for(const p of[[4,8],[9,8],[9,3]]){const b=up(G(p[0],p[1]),16);P(g,b[0],b[1]-4,1,4,'#7a5a3e');}
      hip(g,G,3.5,2.5,6,6,20,8,'#e0574a','#a8382f');
      // 爬梯（左面）
      {const b=up(G(6,8),1);P(g,b[0]-3,b[1]-10,1,10,'#6a4a30');P(g,b[0],b[1]-11,1,11,'#6a4a30');for(let t=2;t<10;t+=3)P(g,b[0]-2,b[1]-t,2,1,'#b58a5a');}
      // 螺旋管滑梯（右面落地）
      {const pts=[[9.5,5,11],[12,4,9],[13.5,6,7],[13,9,4],[12,11,2],[12.5,13,1]];
        for(let n=0;n<pts.length-1;n++){const a=up(G(pts[n][0],pts[n][1]),pts[n][2]),b=up(G(pts[n+1][0],pts[n+1][1]),pts[n+1][2]);
          for(let t=0;t<3;t++)seg(g,a[0],a[1]+t,b[0],b[1]+t,t===0?'#7fb0d6':t===1?'#4f83ad':'#3a6388');}}
      // 蹺蹺板
      {const a=up(G(3,11),3),b=up(G(8,13),1),m=G(5.5,12);P(g,m[0]-1,m[1]-2,3,2,'#f2bd44');seg(g,a[0],a[1],b[0],b[1],'#d94c3f');seg(g,a[0],a[1]+1,b[0],b[1]+1,'#a8382f');}
      // 燈柱（左）
      {const b=up(G(2,14),1);P(tg,b[0],b[1]-16,1,16,'#6d7b82');P(tg,b[0]-1,b[1]-17,3,1,'#2b353b');P(tg,b[0]-1,b[1]-18,3,1,'#f2e2a8');P(ng,b[0]-1,b[1]-18,3,2,lampWarm);}
    });
    B[K+'_1_2']=civic(K,1,({g,tg,ng,G})=>{ // v2：攀爬繩網金字塔＋旋轉盤＋彈簧搖搖＋遮蔭樹
      box(g,G,1,1,14,14,1,'#9a4a3c','#7e3c31','#c2604e');
      poly(g,[up(G(9,9),1),up(G(14,9),1),up(G(14,14),1),up(G(9,14),1)],'#d9bd70');
      // 遮蔭樹（右後）
      tree(g,G(13,3)[0],G(13,3)[1]-1,6,6);
      // 繩網金字塔
      {const top=up(G(6,6),24),cs=[up(G(2,6),1),up(G(6,2),1),up(G(10,6),1),up(G(6,10),1)];
        const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
        for(const c of[cs[0],cs[1]])seg(g,top[0],top[1],c[0],c[1],'#b83c32');
        for(const t of[.4,.7]){const r=cs.map(c=>lerp(top,c,t));seg(g,r[0][0],r[0][1],r[1][0],r[1][1],'#e2b04a');seg(g,r[1][0],r[1][1],r[2][0],r[2][1],'#e2b04a');}
        P(g,top[0],top[1],1,23,'#8d9aa0');P(g,top[0]+1,top[1]+1,1,22,'#5e6b72');P(g,top[0]-1,top[1]-2,3,2,'#d94c3f');
        for(const t of[.4,.7]){const r=cs.map(c=>lerp(top,c,t));seg(g,r[2][0],r[2][1],r[3][0],r[3][1],'#f2c65a');seg(g,r[3][0],r[3][1],r[0][0],r[0][1],'#f2c65a');}
        for(const c of[cs[2],cs[3]])seg(g,top[0],top[1],c[0],c[1],'#d94c3f');
        for(const c of cs)P(g,c[0]-1,c[1]-1,2,2,'#4a5860');}
      // 旋轉盤
      {const c=up(G(11.5,11.5),1);ellipse(g,c[0],c[1],6,3,'#3f6f9c');ellipse(g,c[0],c[1]-2,6,3,'#f2bd44');
        P(g,c[0]-5,c[1]-2,4,1,'#d94c3f');P(g,c[0]+1,c[1]-3,4,1,'#d94c3f');P(g,c[0],c[1]-6,1,4,'#8d9aa0');P(g,c[0]-2,c[1]-6,5,1,'#b9c4c8');}
      // 彈簧搖搖 ×2
      for(const r of[[3,12,'#4f83ad'],[10,4,'#6fae4f']]){const b=up(G(r[0],r[1]),1);P(g,b[0],b[1]-2,1,2,'#3a444a');P(g,b[0]-2,b[1]-5,5,3,r[2]);P(g,b[0]+2,b[1]-7,1,2,r[2]);}
      bench(g,G(2.5,9)[0],G(2.5,9)[1]);
      {const b=up(G(1.5,13.5),1);P(tg,b[0],b[1]-16,1,16,'#6d7b82');P(tg,b[0]-1,b[1]-17,3,1,'#2b353b');P(tg,b[0]-1,b[1]-18,3,1,'#f2e2a8');P(ng,b[0]-1,b[1]-18,3,2,lampWarm);}
    });
  }catch(e){console.error('v574 k126',e);}

  /* ================= k127 社會住宅（2×2） ================= */
  try{
    const K=127;
    B[K+'_1_1']=civic(K,2,({g,tg,ng,G})=>{ // v1：11 層點式塔樓＋兩層社區中心翼＋前庭綠地
      const rk=A.metroRand516('v574:127:1');
      poly(g,[G(2,18),G(19,18),G(19,31),G(2,31)],'#79a760');
      poly(g,[G(10,16),G(12,16),G(12,31),G(10,31)],'#d9d3c0');
      poly(g,[G(19,17),G(31,17),G(31,19),G(19,19)],'#d9d3c0');
      // 塔樓
      const T=box(g,G,5,4,12,12,66,'#d5c7a9','#a99c82','#b9ae96');
      topEdge(g,T,'#efe4ca','#c4b79c');
      poly(g,[up(G(6,5),66),up(G(16,5),66),up(G(16,15),66),up(G(6,15),66)],'#a79c86');
      fr(g,T.S,-1,0,24,0,8,'#8f8a7b');fr(g,T.S,1,0,24,0,8,'#76705f');
      fr(g,T.S,-1,11,5,0,6,'#87c4d6');fr(g,T.S,-1,10,7,6,1,'#b75f46');
      for(let f=0;f<9;f++){const t0=10+f*6;
        for(const d of[2,6,19])fr(g,T.S,-1,d,2,t0,3,'#dce8dd');
        fr(g,T.S,-1,10,6,t0-1,5,'#5c7776');fr(g,T.S,-1,10,6,t0-2,1,'#9fb3a8');fr(g,T.S,-1,12,2,t0,3,'#c9d8d0');
        for(const d of[2,6,18,21])fr(g,T.S,1,d,2,t0,3,'#c3cfc4');
        fr(g,T.S,1,11,4,t0-2,6,'#b75f46');fr(g,T.S,1,12,2,t0,3,'#e6d2b0');
        for(const d of[2,6,19]){if(rk()<.42)fr(ng,T.S,-1,d,2,t0,3,winWarm);}
        for(const d of[2,6,18,21]){if(rk()<.35)fr(ng,T.S,1,d,2,t0,3,winWarm);}}
      fr(g,T.S,1,11,4,62,4,'#b75f46');
      fr(ng,T.S,-1,11,5,0,6,winWarm);
      box(g,G,9,8,4,4,5,'#c9bda3','#9c917a','#b5aa92',66);
      // 社區中心翼
      const Wg=box(g,G,20,6,10,10,12,'#e3d9c2','#b3a88f','#9aa38f');
      topEdge(g,Wg,'#f4ecd8',null);
      poly(g,[up(G(21,7),12),up(G(29,7),12),up(G(29,15),12),up(G(21,15),12)],'#7fa866');
      fr(g,Wg.S,-1,1,18,2,5,'#87c4d6');for(let d=4;d<19;d+=4)fr(g,Wg.S,-1,d,1,2,5,'#e3d9c2');
      fr(g,Wg.S,1,3,2,6,3,'#c3cfc4');fr(g,Wg.S,1,9,2,6,3,'#c3cfc4');fr(g,Wg.S,1,15,2,6,3,'#c3cfc4');
      box(g,G,23,16,4,2,1,'#b75f46','#8f4a37','#d0764f',8);
      fr(ng,Wg.S,-1,1,18,2,5,winWarm);
      // 前庭：樹、長椅
      for(const p of[[4,24],[15,27],[7,29]]){const q=G(p[0],p[1]);tree(g,q[0],q[1],5,5);}
      bench(g,G(14,21)[0],G(14,21)[1]);bench(g,G(24,22)[0],G(24,22)[1]);
    });
    B[K+'_1_2']=civic(K,2,({g,tg,ng,G})=>{ // v2：四層山牆連棟 L 形圍合街廓＋中庭
      const rk=A.metroRand516('v574:127:2');
      poly(g,[G(11,11),G(30,11),G(30,30),G(11,30)],'#79a760');
      poly(g,[G(11,19),G(30,19),G(30,21),G(11,21)],'#d9d3c0');
      // 後翼（沿 i）
      const W1=box(g,G,3,2,26,8,24,'#d5c7a9','#a99c82',null);
      fr(g,W1.S,-1,0,52,0,1,'#8f8a7b');fr(g,W1.S,1,0,16,0,1,'#76705f');
      for(let f=0;f<4;f++){const t0=3+f*6;
        for(let d=2;d<50;d+=5){if(d===17||d===37)continue;fr(g,W1.S,-1,d,2,t0,3,'#dce8dd');if(rk()<.4)fr(ng,W1.S,-1,d,2,t0,3,winWarm);}
        for(const d of[4,10])fr(g,W1.S,1,d,2,t0,3,'#c3cfc4');}
      for(const d of[16,36]){fr(g,W1.S,-1,d,4,0,24,'#b75f46');for(let f=0;f<4;f++)fr(g,W1.S,-1,d+1,2,4+f*6,2,'#e6d2b0');fr(g,W1.S,-1,d+1,2,0,3,'#5a4636');}
      for(let f=1;f<4;f++){fr(g,W1.S,-1,6,8,f*6,1,'#5c7776');fr(g,W1.S,-1,26,8,f*6,1,'#5c7776');fr(g,W1.S,-1,42,6,f*6,1,'#5c7776');}
      gable(g,G,3,2,26,8,24,8,'i','#a55a42','#7e4231','#d5c7a9','#b3a68c');
      {const a=up(G(3,6),32),b=up(G(29,6),32);seg(g,a[0],a[1],b[0],b[1],'#c9785a');}
      for(const i of[8,20]){const c=up(G(i,5),29);P(g,c[0],c[1]-5,3,6,'#8a4a38');P(g,c[0],c[1]-6,3,1,'#b5a58a');}
      // 側翼（沿 j）
      const W2=box(g,G,2,10,8,19,24,'#cbbd9f','#a3967c',null);
      fr(g,W2.S,1,0,38,0,1,'#76705f');
      for(let f=0;f<4;f++){const t0=3+f*6;
        for(let d=2;d<36;d+=5){if(d===17)continue;fr(g,W2.S,1,d,2,t0,3,'#c9d6cc');if(rk()<.35)fr(ng,W2.S,1,d,2,t0,3,winWarm);}
        for(const d of[4,10])fr(g,W2.S,-1,d,2,t0,3,'#dce8dd');}
      fr(g,W2.S,1,16,4,0,24,'#b75f46');for(let f=0;f<4;f++)fr(g,W2.S,1,17,2,4+f*6,2,'#e6d2b0');fr(g,W2.S,1,17,2,0,3,'#5a4636');
      gable(g,G,2,10,8,19,24,8,'j','#96503b','#7e4231','#d5c7a9','#b3a68c');
      // 中庭：樹、腳踏車棚、沙坑
      for(const p of[[17,15],[26,14],[15,26]]){const q=G(p[0],p[1]);tree(g,q[0],q[1],5,5);}
      box(g,G,22,24,6,3,1,'#6f7d82','#56636a','#b75f46',6);
      for(const p of[[22,27],[28,27],[28,24]]){const q=G(p[0],p[1]);P(g,q[0],q[1]-6,1,6,'#56636a');}
      poly(g,[G(13,22),G(17,22),G(17,25),G(13,25)],'#d9bd70');
      bench(g,G(20,18)[0],G(20,18)[1]);
    });
  }catch(e){console.error('v574 k127',e);}

  /* ================= k129 海水淡化廠（2×2） ================= */
  try{
    const K=129;
    B[K+'_1_1']=civic(K,2,({g,tg,ng,G})=>{ // v1：鋸齒天窗 RO 膜廠房＋兩座開放式前處理沉澱池
      // 廠房（沿 i）
      const H=14,hb=box(g,G,3,3,24,8,H,'#e4ece9','#aebcbc',null);
      fr(g,hb.S,-1,0,48,0,2,'#6b8995');
      for(let d=3;d<46;d+=6)fr(g,hb.S,-1,d,3,4,6,'#87c4d6');
      for(let d=3;d<46;d+=6)fr(ng,hb.S,-1,d,3,4,6,winCool);
      fr(g,hb.S,-1,20,6,0,8,'#5f7f8a');
      fr(g,hb.S,1,3,3,5,5,'#6b98a8');fr(g,hb.S,1,10,3,5,5,'#6b98a8');
      for(let n=0;n<6;n++){const i0=3+n*4,j0=3,b=8;
        poly(g,[up(G(i0,j0),H),up(G(i0,j0+b),H),up(G(i0+4,j0+b),H+5),up(G(i0+4,j0),H+5)],'#b9c6c6');
        poly(g,[up(G(i0,j0+b),H),up(G(i0+4,j0+b),H),up(G(i0+4,j0+b),H+5)],'#e4ece9');
        if(n<5)poly(g,[up(G(i0+4,j0+b),H+5),up(G(i0+4,j0),H+5),up(G(i0+4,j0),H),up(G(i0+4,j0+b),H)],'#5f9fb8');}
      poly(g,[up(G(27,11),H+5),up(G(27,3),H+5),up(G(27,3),H),up(G(27,11),H)],'#aebcbc');
      // 沉澱池 ×2
      for(const c of[[5,16],[17,16]]){const bx=box(g,G,c[0],c[1],10,10,4,'#9fb0b3','#768a8f','#c9d3d2');
        poly(g,[up(G(c[0]+1,c[1]+1),4),up(G(c[0]+9,c[1]+1),4),up(G(c[0]+9,c[1]+9),4),up(G(c[0]+1,c[1]+9),4)],'#35708a');
        {const a=up(G(c[0]+1,c[1]+1),4),b=up(G(c[0]+9,c[1]+1),4),d=up(G(c[0]+1,c[1]+9),4);seg(g,a[0],a[1]+1,b[0],b[1]+1,'#6d7f84');seg(g,a[0]-1,a[1]+1,d[0],d[1],'#7f9196');}
        for(const q of[[3,4],[6,6],[4,7]]){const p=up(G(c[0]+q[0],c[1]+q[1]),4);P(g,p[0],p[1],3,1,'#6fb3cf');}
        {const a=up(G(c[0],c[1]+5),5),b=up(G(c[0]+10,c[1]+5),5);seg(g,a[0],a[1],b[0],b[1],'#d5ad45');}}
      pipe(g,G,[10,11],[10,16],2,3,'#2e85a7','#6fb3cf');pipe(g,G,[22,11],[22,16],2,3,'#2e85a7','#6fb3cf');
      pipe(g,G,[27,21],[31.5,21],2,3,'#2e85a7','#6fb3cf');
      {const p=G(29,26);P(g,p[0]-1,p[1]-4,3,4,'#d5ad45');P(g,p[0],p[1]-5,1,1,'#e05a4a');}
    });
    B[K+'_1_2']=civic(K,2,({g,tg,ng,G})=>{ // v2：熱法（多級閃蒸）臥式蒸發器列＋高儲水槽＋紅白排汽煙囪
      // 高儲水槽 ×2（後）
      {const c=G(8,5);cyl(g,c[0],c[1],9,34,['#eff5f0','#d9e0df','#aab8ba','#8b9b9e'],'#e8eeec','#ffffff');
        P(g,c[0]-9,c[1]-24,18,2,'#2e85a7');P(g,c[0]-9,c[1]-10,18,1,'#94a6aa');}
      {const c=G(19,4);cyl(g,c[0],c[1],8,28,['#eff5f0','#d9e0df','#aab8ba','#8b9b9e'],'#e8eeec','#ffffff');
        P(g,c[0]-8,c[1]-20,16,2,'#2e85a7');}
      // 煙囪
      {const c=G(27,6);cyl(g,c[0],c[1],2,52,['#d9dcd8','#c6cac6','#9ba2a0','#858c8a']);
        for(const t of[40,46])P(g,c[0]-2,c[1]-t,4,3,'#c9473c');P(g,c[0]-2,c[1]-53,4,1,'#3c4448');
        P(g,c[0],c[1]-55,1,2,'#e05a4a');P(ng,c[0]-1,c[1]-56,3,3,'rgba(255,110,90,.9)');}
      // 臥式蒸發器 ×3（沿 i）
      for(const j of[13,18,23]){const a=G(6,j),b=G(24,j);
        for(const i of[8,15,22]){const s=G(i,j);P(g,s[0]-1,s[1]-3,3,3,'#56636a');}
        for(let t=0;t<7;t++){const col=t<2?'#8b9b9e':t<4?'#b8c5c6':t<6?'#dfe7e5':'#f3f7f5';seg(g,a[0],a[1]-2-t,b[0],b[1]-2-t,col);}
        ellipse(g,b[0]+1,b[1]-5,2,4,'#aab8ba');P(g,b[0]+1,b[1]-8,1,6,'#94a6aa');
        for(const i of[10,16,21]){const s=up(G(i,j),9);P(g,s[0],s[1]-3,1,3,'#2e85a7');}}
      // 控制樓（前右）
      const cb=box(g,G,24,20,6,9,12,'#e4ece9','#aebcbc','#c9d3d2');
      topEdge(g,cb,'#ffffff',null);
      for(const d of[2,6,10])fr(g,cb.S,-1,d,2,6,3,'#6b8995');fr(g,cb.S,1,3,12,6,3,'#87c4d6');
      fr(ng,cb.S,1,3,12,6,3,winCool);
      pipe(g,G,[24,23],[24,13],6,2,'#2e85a7','#6fb3cf');
      {const a=up(G(4,30),1),b=up(G(30,30),1);seg(g,a[0],a[1],b[0],b[1],'#d5ad45');}
    });
  }catch(e){console.error('v574 k129',e);}

  /* ================= 3×3 工業共用件 ================= */
  // 直立塔器：地面中心 (x,y)、半徑 r、高 h；step＝平台環間距
  function column(g,x,y,r,h,cols,o){o=o||{};
    cyl(g,x,y,r,h,cols,o.top||cols[1],o.rim||cols[0]);
    if(o.step)for(let t=o.step;t<h-3;t+=o.step){const yy=R(y-t);P(g,x-r-1,yy,2*r+2,1,o.plat||'#a7b7bd');P(g,x-r-1,yy+1,2*r+2,1,o.platD||'#33414a');}
    if(o.ladder)P(g,x+r-2,R(y-h)+2,1,h-2,o.ladder);}
  // 球形儲槽：地面中心 (x,y)
  function sphereTank(g,x,y,r,cols,leg){const cy=y-r-4;
    for(const dx of[-r+2,-1,r-3])P(g,x+dx,cy,1,y-cy,leg||'#4b535a');
    sphere(g,x,cy,r,cols);P(g,x-r+1,cy+1,2*r-2,1,'rgba(40,48,54,.35)');}
  // 浮頂儲槽
  function floatTank(g,x,y,r,h,cols){
    cyl(g,x,y,r,h,cols,cols[1],'#f3f5f1');
    ellipse(g,x,y-h+1,r-2,(r-2)/2,shade(cols[2],-10));ellipse(g,x,y-h+2,r-3,(r-3)/2,cols[2]);
    P(g,x-r,R(y-h/2),1,1,cols[2]);
    for(let t=0;t<h-2;t+=2)P(g,x-r+3+(t>>1),y-2-t,1,1,'#5d676c');}
  // 鋼構架：後緣（在塔器之前畫）／前緣（在塔器之後畫）
  function frameBack(g,G,i0,j0,a,b,lv,c){const N=G(i0,j0),E=G(i0+a,j0),W=G(i0,j0+b),h=lv[lv.length-1];
    P(g,N[0],N[1]-h,1,h,c);for(const z of lv){seg(g,N[0],N[1]-z,E[0],E[1]-z,c);seg(g,N[0],N[1]-z,W[0],W[1]-z,c);}}
  function frameFront(g,G,i0,j0,a,b,lv,cL,cR){const S=G(i0+a,j0+b),E=G(i0+a,j0),W=G(i0,j0+b),h=lv[lv.length-1];
    P(g,W[0],W[1]-h,1,h,cL);P(g,E[0],E[1]-h,1,h,cR);P(g,S[0],S[1]-h,1,h,cL);P(g,S[0]+1,S[1]-h,1,h,cR);
    let z0=0;for(const z of lv){seg(g,W[0],W[1]-z,S[0],S[1]-z,cL);seg(g,S[0],S[1]-z,E[0],E[1]-z,cR);
      seg(g,W[0],W[1]-z0,R((W[0]+S[0])/2),R((W[1]+S[1])/2)-z,cL);seg(g,E[0],E[1]-z0,R((E[0]+S[0])/2),R((E[1]+S[1])/2)-z,cR);z0=z;}}
  // 管架（沿 i）：posts 每 step 一組
  function rackI(g,G,i0,i1,j,h,step,cPost,pipes){
    for(let i=i0;i<=i1;i+=step)for(const jj of[j,j+2]){const p=G(i,jj);P(g,p[0],p[1]-h,1,h,cPost);}
    for(const jj of[j,j+2]){const a=G(i0,jj),b=G(i1,jj);seg(g,a[0],a[1]-h,b[0],b[1]-h,cPost);}
    pipes.forEach((c,n)=>{const a=G(i0-1,j+.5+n),b=G(i1+1,j+.5+n);seg(g,a[0],a[1]-h-1,b[0],b[1]-h-1,c);seg(g,a[0],a[1]-h,b[0],b[1]-h,shade(c,-30));});}
  function rackJ(g,G,i,j0,j1,h,step,cPost,pipes){
    for(let j=j0;j<=j1;j+=step)for(const ii of[i,i+2]){const p=G(ii,j);P(g,p[0],p[1]-h,1,h,cPost);}
    for(const ii of[i,i+2]){const a=G(ii,j0),b=G(ii,j1);seg(g,a[0],a[1]-h,b[0],b[1]-h,cPost);}
    pipes.forEach((c,n)=>{const a=G(i+.5+n,j0-1),b=G(i+.5+n,j1+1);seg(g,a[0],a[1]-h-1,b[0],b[1]-h-1,c);seg(g,a[0],a[1]-h,b[0],b[1]-h,shade(c,-30));});}

  /* ---- k121 煉油廠：保留 v0 地坪下緣（含 AO 與工業色 V 線），上半地坪依原參數重鋪，量體半解析重畫 ----
     T364b 煉油 FX 綁死 sprite 座標：排氣口 raw (274,72)、夜間暖帶 raw (224..328,268..278)，兩變體都在該處立煙囪／火炬。 */
  function ind121(draw){
    const v0=B['121_1_0'];if(!v0||!v0.img)throw new Error('no v0 121');
    const W=v0.w,H=v0.h,ax=v0.ax,ay=v0.ay,hw=192,top=ay-hw,cut=322,lw=W>>1,lh=H>>1;
    const GB=mk(lw,lh),L=mk(lw,lh),TF=mk(lw,lh),L2=mk(lw,lh),NL=mk(lw,lh);
    const No=[ax>>1,top>>1],G=(i,j)=>[No[0]+2*i-2*j,No[1]+i+j];
    draw({bg:GB.g,g:L.g,tg:TF.g,g2:L2.g,ng:NL.g,G});
    A.outlineSprite(L.c,34,40,48);A.outlineSprite(L2.c,34,40,48);
    const o=mk(W,H),pc='#817b70';
    A.dia(o.g,ax,top,hw,pc);A.diaEdge(o.g,6,'#46433f',ax,top,hw);A.diaEdge(o.g,9,shade(pc,22),ax,top,hw);
    o.g.clearRect(0,cut,W,H-cut);o.g.drawImage(v0.img,0,cut,W,H-cut,0,cut,W,H-cut);
    o.g.drawImage(GB.c,0,0,W,H);o.g.drawImage(L.c,0,0,W,H);o.g.drawImage(TF.c,0,0,W,H);o.g.drawImage(L2.c,0,0,W,H);
    const n=mk(W,H);n.g.drawImage(NL.c,0,0,W,H);n.g.save();n.g.globalCompositeOperation='destination-in';n.g.drawImage(o.c,0,0);n.g.restore();
    const sp={img:o.c,night:n.c,ax,ay,w:W,h:H,smoke:[]};if(v0.sc!==undefined)sp.sc=v0.sc;return sp;
  }
  const STEEL=['#b3c1c6','#8a9aa1','#5f6e76','#47545c'],WHITE=['#eef1ee','#d3d9d8','#aab3b5','#8b9598'];
  try{
    const K=121;
    B[K+'_1_1']=ind121(({bg,g,tg,g2,ng,G})=>{ // v1：催化裂解（FCC）擴建：鋼構反應器架＋雙塔＋高火炬＋球形槽
      // 地面：混凝土墊、廠內道路
      poly(bg,[G(16,14),G(33,14),G(33,28),G(16,28)],'#8f8a80');
      poly(bg,[G(0,34),G(48,34),G(48,37),G(0,37)],'#5f5c57');
      poly(bg,[G(33,26),G(47,26),G(47,44),G(33,44)],'#8c877d');
      {const a=G(33,44),b=G(47,44),c=G(47,26);seg(bg,a[0],a[1],b[0],b[1],'#a9a397');seg(bg,b[0],b[1],c[0],c[1],'#5e5a53');}
      // 後排：蒸餾塔 ×2（高低）
      column(g,84,140,5,72,STEEL,{step:12,ladder:'#3b464d',top:'#c9d4d8'});
      P(g,83,66,2,3,'#6c7d86');P(g,84,64,1,2,'#e05a4a');
      column(g,108,144,4,54,STEEL,{step:11,top:'#c9d4d8'});
      // 高火炬（FX 排氣口 raw 274,72 → 半解析 137,36）
      {const x=137,yb=150;
        for(let t=0;t<74;t++){const sp=R(9-t*9/74);if(t%9===0){seg(bg,x-sp,yb-t,x+sp,yb-t-9,'#4a565d');seg(bg,x+sp,yb-t,x-sp,yb-t-9,'#4a565d');}
          P(bg,x-sp-1,yb-t,1,1,'#56636a');P(bg,x+sp+1,yb-t,1,1,'#3d484f');}
        P(g,x-1,40,1,110,'#a9b6bb');P(g,x,40,1,110,'#7d8b91');P(g,x+1,40,1,110,'#58656c');
        for(const t of[42,48])P(g,x-1,t,3,3,'#c94f3c');
        P(g,x-2,37,5,3,'#3f4a50');P(g,x-1,36,3,1,'#e8923a');
        P(ng,x-2,34,5,3,'rgba(255,170,90,.9)');}
      // FCC 鋼構＋反應器／再生器
      frameBack(bg,G,18,15,12,11,[14,27,40],'#434e55');
      column(g,100,166,8,48,STEEL,{step:16,top:'#c3ced2'});
      {P(g,97,112,6,2,'#5f6e76');P(g,99,108,2,4,'#8a9aa1');}
      column(g,120,168,4,66,WHITE,{step:14,top:'#f4f6f3'});
      {for(let t=0;t<3;t++)seg(g,116,132+t,108,146+t,t===0?'#c9d4d8':t===1?'#8a9aa1':'#5f6e76');}
      frameFront(tg,G,18,15,12,11,[14,27,40],'#56636a','#3b464d');
      for(const z of[14,27,40]){const p=G(30,26);P(ng,p[0]-4,p[1]-z-1,1,1,'rgba(255,214,140,.95)');}
      // 管架（沿 i，穿越廠區）
      rackI(tg,G,2,44,30,11,7,'#3f4a50',['#c99445','#9aa8ad']);
      // 球形 LPG 槽 ×2
      sphereTank(g2,140,190,8,WHITE);
      sphereTank(g2,112,194,9,WHITE);
      // 控制室（v0 紅磚語彙）
      const cb=box(g2,G,7,38,11,8,11,'#b0664a','#7a3f2e','#8c8278');
      topEdge(g2,cb,'#d08a62','#94513a');
      for(let d=2;d<20;d+=5){fr(g2,cb.S,-1,d,3,4,3,'#3c4d58');fr(ng,cb.S,-1,d,3,4,3,'rgba(255,212,138,.9)');}
      fr(g2,cb.S,1,5,3,0,6,'#4a3a30');
      {const p=up(G(12.5,42),11);P(g2,p[0]-1,p[1]-4,3,4,'#6d777c');P(g2,p[0]-2,p[1]-5,5,1,'#8f999e');}
    });
    B[K+'_1_2']=ind121(({bg,g,tg,g2,ng,G})=>{ // v2：儲槽區型老廠：2×2 浮頂槽＋防液堤、加熱爐房＋紅白高煙囪、短塔
      // 防液堤（低矮圍堤，含內場）
      poly(bg,[G(1,15),G(33,15),G(33,47),G(1,47)],'#736e66');
      {const a=G(1,47),b=G(33,47),c=G(33,15),d=G(1,15);
        for(let t=0;t<2;t++){seg(bg,a[0],a[1]-t,b[0],b[1]-t,t?'#b3ad9f':'#5b5751');seg(bg,b[0],b[1]-t,c[0],c[1]-t,t?'#8d877b':'#4b4843');
          seg(bg,d[0],d[1]-t,c[0],c[1]-t,'#9b9587');seg(bg,d[0],d[1]-t,a[0],a[1]-t,'#a8a295');}}
      // 加熱爐房＋紅白煙囪（FX 排氣口 137,36）
      const hb=box(g,G,14,2,11,9,20,'#9aa6ab','#626e75','#737d82');
      topEdge(g,hb,'#c2ccd0','#7d888e');
      for(let d=2;d<22;d+=4)fr(g,hb.S,-1,d,2,4,12,'#7f8b91');
      fr(g,hb.S,1,4,10,13,2,'#3e4a50');fr(ng,hb.S,1,5,8,13,2,'rgba(255,168,84,.85)');
      fr(g,hb.S,-1,9,4,0,7,'#4a555b');
      {const x=137,yb=130,hh=94;cyl(g,x,yb,4,hh,['#e9ecea','#d1d6d5','#a9b0b1','#8c9496'],'#5a5f61','#c8cdcc');
        for(const t of[6,18,30])for(let xx=x-4;xx<x+4;xx++){const u=(xx+.5-x)/4,c=u<-.45?'#e0705e':u<.1?'#c94f3c':u<.62?'#a63e30':'#8a3327';P(g,xx,yb-hh+t,1,6,c);}
        P(g,x-4,yb-hh+2,8,1,'#3c4448');
        P(g,x-3,yb-hh+14,1,1,'#e05a4a');P(ng,x-4,yb-hh+13,3,3,'rgba(255,110,90,.9)');}
      // 短塔 ×2＋塔間平台
      column(g,168,170,3,34,STEEL,{step:10,top:'#c9d4d8'});
      column(g,152,186,5,46,STEEL,{step:11,ladder:'#3b464d',top:'#c9d4d8'});
      P(g,151,138,2,2,'#6c7d86');P(ng,152,139,1,1,'rgba(255,110,90,.9)');
      // 浮頂儲槽 2×2
      const TK=['#e6e9e5','#cdd3d1','#a4adaf','#88929a'];
      floatTank(g,76,156,12,13,TK);
      floatTank(g,104,170,12,13,TK);
      floatTank(g,48,170,12,13,TK);
      floatTank(g,76,184,12,13,TK);
      // 管架（沿 j，儲槽區 → 製程區）
      rackJ(tg,G,35,20,44,9,6,'#3f4a50',['#c99445','#9aa8ad']);
      // 紅磚控制樓（右前）
      const cb=box(g2,G,38,29,8,11,12,'#b0664a','#7a3f2e','#8c8278');
      topEdge(g2,cb,'#d08a62','#94513a');
      for(let d=2;d<16;d+=5){fr(g2,cb.S,-1,d,3,5,3,'#3c4d58');fr(ng,cb.S,-1,d,3,5,3,'rgba(255,212,138,.9)');}
      for(let d=3;d<20;d+=6)fr(g2,cb.S,1,d,3,5,3,'#33434d');
      fr(g2,cb.S,-1,12,3,0,6,'#4a3a30');
    });
  }catch(e){console.error('v574 k121',e);}

  /* ---- k122/k123（T516 industrial-kit v0：244×280、1×、無 sc）：同參數重鋪地坪（metroPlate516），量體 1× 重畫 ----
     注意：繪製端 metroIndustrySprite516A 對 122/123 會強制換回 canonical _0，整合時需放行變體鍵才看得到。 */
  function ind516(k,draw){
    const v0=B[k+'_1_0'];if(!v0||!v0.img)throw new Error('no v0 '+k);
    const W=v0.w,H=v0.h,ax=v0.ax,ay=v0.ay,hw=96,top=ay-hw;
    const GB=mk(W,H),L=mk(W,H),TF=mk(W,H),L2=mk(W,H),TF2=mk(W,H),NL=mk(W,H);
    const G=(i,j)=>[ax+2*i-2*j,top+i+j],pc='#77746e';
    A.dia(GB.g,ax,top,hw,pc);A.diaEdge(GB.g,6,shade(pc,-20),ax,top,hw);A.diaEdge(GB.g,9,shade(pc,12),ax,top,hw);
    draw({bg:GB.g,g:L.g,tg:TF.g,g2:L2.g,tg2:TF2.g,ng:NL.g,G,pal:A.metroPalette516(3,k,1,2)});
    A.outlineSprite(L.c,24,27,33);A.outlineSprite(L2.c,24,27,33);
    const o=mk(W,H);for(const c of[GB,L,TF,L2,TF2])o.g.drawImage(c.c,0,0);
    const n=mk(W,H);n.g.drawImage(NL.c,0,0);n.g.save();n.g.globalCompositeOperation='destination-in';n.g.drawImage(o.c,0,0);n.g.restore();
    return {img:o.c,night:n.c,ax,ay,w:W,h:H,smoke:[]};
  }
  function heap(g,x,y,r,h,cl,cd,ct){for(let xx=x-r;xx<x+r;xx++){const u=(xx+.5-x)/r,f=Math.max(0,1-u*u),e=r/2*Math.sqrt(f),t=h*f,y0=R(y-t),y1=R(y+e);
    P(g,xx,y0,1,y1-y0+1,u<-.15?cl:cd);if(ct&&u>-.6&&u<-.1)P(g,xx,y0,1,1,ct);}}
  function dome(g,x,yt,r,cols){for(let xx=x-r;xx<x+r;xx++){const u=(xx+.5-x)/r,s=Math.sqrt(Math.max(0,1-u*u)),y0=R(yt-r*.7*s),y1=R(yt+r/2*s);
    P(g,xx,y0,1,y1-y0+1,u<-.45?cols[0]:u<.1?cols[1]:u<.62?cols[2]:cols[3]);}}
  const IRON=['#9a928b','#77706a','#56504c','#433e3b'],WARM=['#c3beb6','#9d978f','#746f69','#5a5652'],GLOW='#ffb45a',GLOWN='rgba(255,170,80,.9)';
  try{
    const K=122;
    B[K+'_1_1']=ind516(K,({bg,g,tg,g2,tg2,ng,G,pal})=>{ // v1：高爐一貫廠：高爐塔架＋三座熱風爐＋斜皮帶＋出鐵場
      poly(bg,[G(28,28),G(47,28),G(47,47),G(28,47)],'#6c5a4d');
      {const a=G(28,47),b=G(47,47),c=G(47,28);seg(bg,a[0],a[1],b[0],b[1],'#857163');seg(bg,b[0],b[1],c[0],c[1],'#4f4239');}
      // 煙囪（左後）
      column(g,98,200,3,80,['#8e969b','#6a7378','#4c5459','#3c4247'],{top:'#3a3f43'});
      P(g,95,121,6,4,pal.accent);P(g,95,127,6,1,shade(pal.accent,-30));P(ng,96,121,4,2,'rgba(255,110,90,.9)');
      // 熱風爐 ×3（右後）
      for(const p of[[20,4],[28,4],[36,4]]){const q=G(p[0],p[1]);cyl(g,q[0],q[1],6,48,WARM);dome(g,q[0],q[1]-48,6,WARM);
        P(g,q[0]-7,q[1]-30,14,1,'#5a5652');P(g,q[0]-7,q[1]-31,14,1,'#d4cfc6');}
      // 熱風主管 → 高爐
      for(let t=0;t<3;t++)seg(g,150,176+t,134,184+t,t===0?'#d4cfc6':t===1?'#9d978f':'#6a655f');
      // 高爐塔架＋爐體
      frameBack(bg,G,11,9,10,10,[20,40,60,76],'#3d4549');
      {const x=126,y=210;cyl(g,x,y,9,16,IRON);cyl(g,x,y-16,10,16,IRON);cyl(g,x,y-32,9,16,IRON,'#6b645f');cyl(g,x,y-48,7,14,IRON);cyl(g,x,y-62,5,12,IRON,'#8c8580');
        P(g,x-10,y-33,20,1,'#8a5a3a');P(g,x-9,y-49,18,1,'#8a5a3a');
        for(const dx of[-4,3]){P(g,x+dx,y-94,2,22,dx<0?'#9a928b':'#56504c');}
        P(g,x-5,y-96,11,3,'#77706a');P(g,x-5,y-96,11,1,'#b3aca5');
        for(let t=0;t<3;t++)seg(g,x-6,y-95+t,x-26,y-58+t,t===0?'#b3aca5':t===1?'#77706a':'#4d4845');
        // 除塵器
        cyl(g,x-28,y-8,5,16,IRON);dome(g,x-28,y-24,5,IRON);
        P(g,x-31,y-8,1,6,'#433e3b');P(g,x-25,y-8,1,6,'#433e3b');P(g,x-29,y-6,3,4,'#56504c');}
      frameFront(tg,G,11,9,10,10,[20,40,60,76],'#5b666c','#3d4549');
      P(ng,125,121,2,2,'rgba(255,214,140,.95)');P(ng,145,150,1,1,'rgba(255,214,140,.95)');
      // 出鐵場（山牆棚，爐前）
      const ch=box(g2,G,14,18,12,10,12,'#a39c92','#6f6962',null);
      topEdge(g2,ch,'#c9c2b6',null);
      gable(g2,G,14,18,12,10,12,6,'j','#5e5852','#4a4540','#a39c92','#8a847c');
      fr(g2,ch.S,-1,6,8,0,8,'#2f2a26');fr(g2,ch.S,-1,7,6,0,3,GLOW);fr(g2,ch.S,-1,8,4,3,1,'#e88a3a');
      fr(ng,ch.S,-1,6,8,0,8,GLOWN);
      fr(g2,ch.S,1,4,2,4,3,'#3c4d58');fr(g2,ch.S,1,12,2,4,3,'#3c4d58');
      // 料倉＋斜皮帶廊
      const sh=box(g2,G,2,34,8,10,14,pal.light,pal.mid,pal.roof);
      topEdge(g2,sh,shade(pal.light,20),null);
      for(let d=2;d<16;d+=4)fr(g2,sh.S,-1,d,2,5,3,'#3c4d58');fr(ng,sh.S,-1,6,2,5,3,'rgba(255,240,200,.85)');
      {const a=[66,208],b=[118,142];
        for(let t=0;t<4;t++)seg(tg2,a[0],a[1]+t,b[0],b[1]+t,t===0?'#c3c8c6':t===3?'#3d4549':'#8a9296');
        for(const f of[.36,.68]){const x=R(a[0]+(b[0]-a[0])*f),y=R(a[1]+(b[1]-a[1])*f)+4,gy=R(224+(210-224)*f);P(tg2,x,y,1,gy-y,'#4c5459');P(tg2,x+1,y,1,gy-y,'#3d4549');}}
      // 礦石堆
      heap(g2,118,250,12,10,'#9a6a52','#7a513f','#b5846a');
      heap(g2,142,254,11,8,'#5d5a58','#45423f','#77736f');
    });
    B[K+'_1_2']=ind516(K,({bg,g,tg,g2,tg2,ng,G,pal})=>{ // v2：電爐小鋼廠：高煉鋼廠房＋集塵袋濾屋＋長條軋鋼廠＋廢鋼場門吊
      // 廢鋼場地坪
      poly(bg,[G(3,35),G(21,35),G(21,47),G(3,47)],'#5f5a55');
      // 袋濾屋＋短煙囪（右後）
      const bh=box(g,G,26,2,12,8,18,'#9aa3a6','#646d72',pal.roof);
      topEdge(g,bh,'#c0c8ca',null);
      for(let d=2;d<24;d+=4)fr(g,bh.S,-1,d,1,2,14,'#7c8589');
      fr(g,bh.S,-1,0,24,0,2,'#4c5459');
      column(g,198,226,3,50,['#8e969b','#6a7378','#4c5459','#3c4247'],{top:'#3a3f43'});
      P(g,195,178,6,3,pal.accent);P(ng,196,178,4,2,'rgba(255,110,90,.9)');
      // 煉鋼廠房（高）＋屋頂天窗＋煙道
      const ms=box(g,G,6,4,14,14,36,pal.light,pal.mid,pal.roof);
      topEdge(g,ms,shade(pal.light,22),shade(pal.mid,14));
      for(let d=3;d<28;d+=3)fr(g,ms.S,-1,d,1,2,31,shade(pal.light,-12));
      for(let d=3;d<28;d+=3)fr(g,ms.S,1,d,1,2,31,shade(pal.mid,-10));
      fr(g,ms.S,-1,0,28,28,2,'#3c4d58');fr(ng,ms.S,-1,2,24,28,2,'rgba(255,190,110,.7)');
      fr(g,ms.S,-1,10,8,0,14,'#2f2a26');fr(g,ms.S,-1,11,6,0,4,GLOW);fr(ng,ms.S,-1,10,8,0,14,GLOWN);
      box(g,G,9,9,8,4,5,shade(pal.light,-8),shade(pal.mid,-8),shade(pal.roof,12),36);
      {const a=up(G(18,8),38),b=up(G(28,6),20);for(let t=0;t<4;t++)seg(g,a[0],a[1]+t,b[0],b[1]+t,t===0?'#b3bbbd':t<3?'#7c8589':'#4c5459');
        P(g,b[0]-1,b[1],3,4,'#4c5459');}
      // 長條軋鋼廠房（沿 i，山牆）
      const rm=box(g2,G,2,24,44,10,16,pal.light,pal.mid,null);
      topEdge(g2,rm,shade(pal.light,22),null);
      gable(g2,G,2,24,44,10,16,6,'i',shade(pal.roof,6),shade(pal.roof,-14),pal.light,shade(pal.mid,8));
      fr(g2,rm.S,-1,0,88,0,2,shade(pal.mid,-18));
      for(let d=4;d<86;d+=8){fr(g2,rm.S,-1,d,4,8,3,'#3c4d58');fr(ng,rm.S,-1,d,4,8,3,'rgba(255,240,200,.8)');}
      fr(g2,rm.S,1,6,8,0,10,'#39414a');
      // 廢鋼堆＋門式吊車
      heap(g2,66,238,9,7,'#8a8078','#665e57','#a89b8f');
      heap(g2,48,232,7,6,'#7a6252','#5c4a3e');
      {const legs=[[12,35],[12,47]],Hc=26;
        for(const l of legs){const p=G(l[0],l[1]);P(tg2,p[0]-3,p[1]-Hc,1,Hc,'#d6a83f');P(tg2,p[0]+3,p[1]-Hc,1,Hc,'#a07e2c');seg(tg2,p[0]-3,p[1],p[0],p[1]-Hc,'#d6a83f');seg(tg2,p[0]+3,p[1],p[0],p[1]-Hc,'#a07e2c');P(tg2,p[0]-4,p[1],9,1,'#6b5220');}
        const a=G(12,35),b=G(12,47);for(let t=0;t<3;t++)seg(tg2,a[0],a[1]-Hc-t,b[0],b[1]-Hc-t,t===2?'#f0c85a':t===1?'#d6a83f':'#8a6a24');
        const m=G(12,41);P(tg2,m[0]-2,m[1]-Hc,5,3,'#4c5459');P(tg2,m[0],m[1]-Hc+3,1,8,'#2d3439');P(tg2,m[0]-2,m[1]-Hc+11,5,2,'#56636a');
        P(ng,a[0]-1,a[1]-Hc-3,2,2,'rgba(255,214,140,.9)');}
      // 成品鋼胚堆（兩疊）
      for(const s of[[34,38],[40,36]]){box(g2,G,s[0],s[1],6,3,2,'#8e969b','#5f676c','#b3bbbd');box(g2,G,s[0]+.5,s[1]+.5,5,2,2,'#7d858a','#545b60','#a6aeb0',2);}
    });
  }catch(e){console.error('v574 k122',e);}

  /* 筒形屋頂大棚：脊沿 i；右端山牆（i=i0+a 面）拱頂 */
  function barrel(g,G,i0,j0,a,b,Hh,rise,cL,cR,cRoofL,cRoofD,cRim){
    const bx=box(g,G,i0,j0,a,b,Hh,cL,null,null);
    const zf=t=>Hh+rise*Math.sqrt(Math.max(0,1-(2*t-1)*(2*t-1)));
    const n=b*2;for(let s=0;s<n;s++){const t0=s/n,t1=(s+1)/n,z0=zf(t0),z1=zf(t1),tm=(t0+t1)/2;
      poly(g,[up(G(i0,j0+t0*b),z0),up(G(i0+a,j0+t0*b),z0),up(G(i0+a,j0+t1*b),z1),up(G(i0,j0+t1*b),z1)],tm<.42?cRoofD:tm<.72?cRoofL:shade(cRoofL,-10));}
    for(let i=i0+4;i<i0+a;i+=5)for(let s=0;s<n;s++){const t0=s/n,t1=(s+1)/n,p=up(G(i,j0+t0*b),zf(t0)),q=up(G(i,j0+t1*b),zf(t1));seg(g,p[0],p[1],q[0],q[1],shade(cRoofD,-12));}
    const S=bx.S;for(let d=0;d<2*b;d++){const t=1-(d+.5)/(2*b),hh=R(zf(t));P(g,fx(S,1,d),fyb(S,d)-hh+1,1,hh,cR);}
    if(cRim)for(let d=0;d<2*b;d++){const t=1-(d+.5)/(2*b),hh=R(zf(t));P(g,fx(S,1,d),fyb(S,d)-hh+1,1,1,cRim);}
    return bx;}
  /* 船艏三角柱：船身盒在 i=ib 截止，艏尖在 (it, 中線) */
  function bow(g,G,ib,j0,j1,it,z0,h,rb){const Aq=G(ib,j0),Bq=G(it,(j0+j1)/2),Cq=G(ib,j1);
    poly(g,[up(Aq,z0+h),up(Bq,z0+h+1),up(Bq,z0),up(Cq,z0),up(Cq,z0+h)],'#2a3746');
    poly(g,[up(Cq,z0),up(Bq,z0),up(Bq,z0+h+1),up(Cq,z0+h)],'#394a5c');
    poly(g,[up(Cq,z0),up(Bq,z0),up(Bq,z0+rb),up(Cq,z0+rb)],'#a8463a');
    seg(g,up(Cq,z0+rb)[0],up(Cq,z0+rb)[1],up(Bq,z0+rb)[0],up(Bq,z0+rb)[1],'#d9d4c8');
    poly(g,[up(Aq,z0+h),up(Bq,z0+h+1),up(Cq,z0+h)],'#8a9296');}
  try{
    const K=123;
    B[K+'_1_1']=ind516(K,({bg,g,tg,g2,tg2,ng,G,pal})=>{ // v1：乾塢＋跨塢龍門吊（Goliath）＋分段組立廠房
      // 舾裝水塢（下沉、灌水）：遠側兩道內壁可見
      poly(bg,[G(5,19),G(47,19),G(47,37),G(5,37)],'#5a6266');
      poly(bg,[G(5,19),G(47,19),G(47,21),G(7,21)],'#a2a8a6');
      poly(bg,[G(5,19),G(7,21),G(7,37),G(5,37)],'#7a8184');
      poly(bg,[G(7,21),G(47,21),G(47,37),G(7,37)],'#3f6f8a');
      {const a=G(5,37),b=G(47,37),c=G(47,19);seg(bg,a[0],a[1],b[0],b[1],'#b8bcb6');seg(bg,b[0],b[1],c[0],c[1],'#8f948f');}
      for(const q of[[14,35],[30,34.5],[44,24],[10,23]]){const p=G(q[0],q[1]);P(bg,p[0],p[1],4,1,'#6fa3bd');}
      // 分段組立廠房（後）
      const hb=box(g,G,4,2,30,12,22,pal.light,pal.mid,null);
      topEdge(g,hb,shade(pal.light,20),null);
      gable(g,G,4,2,30,12,22,8,'i',shade(pal.roof,10),shade(pal.roof,-12),pal.light,shade(pal.mid,6));
      for(let d=4;d<60;d+=6)fr(g,hb.S,-1,d,3,14,3,'#3c4d58');
      for(let d=4;d<60;d+=6)fr(ng,hb.S,-1,d,3,14,3,'rgba(255,240,200,.75)');
      fr(g,hb.S,-1,8,10,0,12,'#2a2f36');fr(g,hb.S,-1,32,10,0,12,'#2a2f36');
      fr(ng,hb.S,-1,9,8,0,3,'rgba(255,214,140,.7)');
      // 龍門吊後腿
      const Hc=62,crL='#e2b448',crD='#a07e2c';
      {const a=G(25,18),b=G(31,18),t=G(28,18);for(let k2=0;k2<2;k2++){seg(g,a[0]+k2,a[1],t[0]-1+k2,t[1]-Hc,k2?crD:crL);seg(g,b[0]+k2,b[1],t[0]+k2,t[1]-Hc,k2?crD:crL);}
        P(g,a[0]-1,a[1]-1,b[0]-a[0]+3,2,'#5b4a26');}
      // 船體（塢內，艉樓在左、船艏向右）
      {const z0=-2,hh=11;
        const hull=box(g,G,12,25,26,5.5,hh,'#394a5c','#2a3746','#8a9296',z0);
        fr(g,hull.S,-1,0,52,0,2,'#a8463a');fr(g,hull.S,-1,0,52,6,1,'#d9d4c8');fr(g,hull.S,1,0,11,0,2,'#83372e');
        bow(g,G,38,25,30.5,43,z0,hh,2);
        {const a=G(12,30.5),b=G(43,27.75);seg(bg,a[0],a[1]+1,b[0],b[1]+1,'#8fc0d6');}
        const st=box(g,G,13,25.5,6,4.5,11,'#e4e6e2','#b3b8b6','#c9cdca',z0+hh);
        for(let d=1;d<12;d+=3)fr(g,st.S,-1,d,2,6,2,'#3c4d58');fr(ng,st.S,-1,1,11,6,2,'rgba(255,240,200,.7)');
        box(g,G,24,26,6,3.5,4,'#b0583e','#80402d','#c4704f',z0+hh);}
      // 龍門吊前腿＋主樑＋小車
      {const a=G(25,38),b=G(31,38),t=G(28,38);for(let k2=0;k2<2;k2++){seg(g2,a[0]+k2,a[1],t[0]-1+k2,t[1]-Hc,k2?crD:crL);seg(g2,b[0]+k2,b[1],t[0]+k2,t[1]-Hc,k2?crD:crL);}
        P(g2,a[0]-1,a[1]-1,b[0]-a[0]+3,2,'#5b4a26');
        box(g2,G,27,15,2,25,7,crL,crD,'#f0cf6a',Hc-2);
        for(let d=2;d<50;d+=6)fr(g2,up(G(29,40),Hc-2),1,d,1,1,5,'#8a6a24');
        box(g2,G,26.5,27,3,4,4,'#d9dcd8','#9aa1a3','#eef0ec',Hc+5);
        const c=up(G(28,29),Hc-2);P(tg2,c[0],c[1],1,36,'#2d3439');P(tg2,c[0]-2,c[1]+36,5,3,'#4c5459');
        P(ng,t[0],t[1]-Hc-8,2,2,'rgba(255,110,90,.9)');}
      // 分段組立件（右前）＋辦公小樓（左前）
      box(g2,G,36,39,6,6,6,'#b0583e','#80402d','#c4704f');box(g2,G,43,38,4,5,4,'#8a9296','#5f676c','#b3bbbd');
      const of=box(g2,G,4,38,10,7,10,pal.light,pal.mid,pal.roof);
      topEdge(g2,of,shade(pal.light,20),null);
      for(let d=2;d<20;d+=4){fr(g2,of.S,-1,d,2,4,3,'#3c4d58');fr(ng,of.S,-1,d,2,4,3,'rgba(255,240,200,.85)');}
    });
    B[K+'_1_2']=ind516(K,({bg,g,tg,g2,tg2,ng,G,pal})=>{ // v2：筒形屋頂造船大棚＋船台滑道（船艏出棚）＋塔式吊車
      // 船台滑道
      poly(bg,[G(24,10),G(47,10),G(47,24),G(24,24)],'#8c8a83');
      for(const j of[13.5,20.5]){const a=G(24,j),b=G(47,j);seg(bg,a[0],a[1],b[0],b[1],'#4c5459');}
      {const a=G(47,10),b=G(47,24);seg(bg,a[0],a[1],b[0],b[1],'#5b5f5f');}
      // 大棚
      const hall=barrel(g,G,2,6,24,20,34,10,pal.light,pal.mid,shade(pal.roof,26),shade(pal.roof,4),shade(pal.roof,40));
      for(let d=3;d<48;d+=5)fr(g,hall.S,-1,d,1,2,30,shade(pal.light,-10));
      fr(g,hall.S,-1,0,48,26,2,'#3c4d58');fr(ng,hall.S,-1,2,44,26,2,'rgba(255,240,200,.7)');
      fr(g,hall.S,-1,34,8,0,10,'#2a2f36');fr(ng,hall.S,-1,35,6,0,3,'rgba(255,214,140,.7)');
      // 端牆大門：開口內見船艏
      fr(g,hall.S,1,6,26,0,30,'#23282e');
      fr(g,hall.S,1,6,26,30,1,'#8a6a24');
      // 船體（出棚、艏朝 E）
      {const hh=17;
        const hull=box(g,G,26,12.5,12,9,hh,'#394a5c','#2a3746','#8a9296');
        fr(g,hull.S,-1,0,24,0,6,'#a8463a');fr(g,hull.S,-1,0,24,6,1,'#d9d4c8');fr(g,hull.S,1,0,18,0,6,'#83372e');
        bow(g,G,38,12.5,21.5,45,0,hh,6);
        for(const i of[29,33,37]){const p=G(i,21.5);P(g,p[0]-2,p[1]-1,3,2,'#2d3439');}
        box(g,G,28,14,5,5,5,'#b0583e','#80402d','#c4704f',hh);}
      // 塔式吊車（棚端右後、船身後方；吊臂沿 j 跨過船台）
      {const b=G(31,7),Hc=74,x=b[0],yb=b[1],cg=bg;
        box(cg,G,29.5,5.5,3,3,3,'#8a9296','#5f676c','#b3bbbd');
        for(let t=3;t<Hc;t++){P(cg,x-1,yb-t,1,1,'#e2b448');P(cg,x+2,yb-t,1,1,'#a07e2c');if(t%5===0)P(cg,x-1,yb-t,4,1,'#c99a3a');}
        const top=[x,yb-Hc],j1=up(G(31,26),Hc),j0=up(G(31,2),Hc);
        for(let t=0;t<2;t++)seg(cg,j0[0],j0[1]+t,j1[0],j1[1]+t,t?'#a07e2c':'#e2b448');
        P(cg,top[0],top[1]-9,2,9,'#c99a3a');seg(cg,top[0]+1,top[1]-9,j1[0],j1[1],'#8a6a24');seg(cg,top[0]+1,top[1]-9,j0[0],j0[1],'#8a6a24');
        P(cg,j0[0]-2,j0[1]+2,5,4,'#5f676c');
        P(cg,top[0]-2,top[1]+2,5,5,'#d9dcd8');P(cg,top[0]-1,top[1]+3,3,2,'#3c4d58');
        const hk=up(G(31,18),Hc);P(cg,hk[0],hk[1]+2,1,40,'#2d3439');P(cg,hk[0]-1,hk[1]+42,3,2,'#4c5459');
        P(ng,top[0],top[1]-10,2,2,'rgba(255,110,90,.9)');P(ng,top[0]-1,top[1]+3,3,2,'rgba(255,240,200,.85)');}
      // 鋼板堆＋辦公棟（左前）
      box(g2,G,26,34,7,4,2,'#8e969b','#5f676c','#b3bbbd');box(g2,G,26.5,34.5,6,3,2,'#7d858a','#545b60','#a6aeb0',2);
      const of=box(g2,G,4,34,12,9,11,pal.light,pal.mid,pal.roof);
      topEdge(g2,of,shade(pal.light,20),null);
      for(let d=2;d<24;d+=4){fr(g2,of.S,-1,d,2,5,3,'#3c4d58');fr(ng,of.S,-1,d,2,5,3,'rgba(255,240,200,.85)');}
      fr(g2,of.S,1,6,3,0,6,'#2a2f36');
    });
  }catch(e){console.error('v574 k123',e);}
});
