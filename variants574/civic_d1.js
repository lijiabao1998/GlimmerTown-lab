// T576 civic_d1：派出所 k52（policeBox／policeBoxVar576[0..2]）＋警察局 k11（police／policeVar[1..4]）重畫。
// 核心：主體量體落地（牆腳貼地、描邊、落影），佔地約六到七成；不准細柱撐起的浮空方塊。
// 分層合成：每個立體件自成一層（二值化＋深色外框），細線件（旗桿、天線）走不描邊層；夜光按層遮擋。
// 零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function civic_d1(A){
  const S=A.SPR();
  const W=72,H=112,AX=36,AY=110;
  const K=A.iso575(W,H,AX,AY,1),{P,hsh,TOPY}=K;

  // ================= 像素工具 =================
  const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  // 硬邊多邊形：像素中心取樣掃描線填色（無抗鋸齒混色）
  const fp=(g,pts,c)=>{let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    y0=Math.max(0,Math.floor(y0));y1=Math.min(H-1,Math.ceil(y1));g.fillStyle=c;const n=pts.length;
    for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
      for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=Math.ceil(xs[i]-.5),xb=Math.ceil(xs[i+1]-.5);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}}};
  const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
    const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
    for(let n=0;n<600;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
  const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
    if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
    if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
    if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);
    return{u0,v0,u1,v1,z,h};};
  const quad=(g,u0,v0,du,dv,c,z=0)=>fp(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
  // 牆面貼片：fL 在 +v 面（v 固定，u∈[ua,ub]）；fR 在 +u 面（u 固定，v∈[va,vb]）
  const fL=(g,v,ua,ub,z0,z1,c)=>fp(g,[P(ua,v,z0),P(ub,v,z0),P(ub,v,z1),P(ua,v,z1)],c);
  const fR=(g,u,va,vb,z0,z1,c)=>fp(g,[P(u,va,z0),P(u,vb,z0),P(u,vb,z1),P(u,va,z1)],c);
  // 一排窗：n 扇、每扇寬 w 像素；lit=夜光色；p=點亮機率；o.gl=頂列反光色、o.sill=窗台色
  const winsL=(g,ng,v,ua,ub,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=ua+(ub-ua)*(i+.5)/n,a=t-w/64,b=t+w/64;
    fL(g,v,a,b,z0,z1,c);if(o.gl)fL(g,v,a,a+1/32,z1-1,z1,o.gl);if(o.sill)fL(g,v,a,b,z0-1,z0,o.sill);if(o.mul)fL(g,v,t-.5/32,t+.5/32,z0,z1,o.mul);
    if(ng&&lit&&hsh(seed,i,z0|0)<p)fL(ng,v,a,b,z0,z1,lit);}};
  const winsR=(g,ng,u,va,vb,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=va+(vb-va)*(i+.5)/n,a=t-w/64,b=t+w/64;
    fR(g,u,a,b,z0,z1,c);if(o.gl)fR(g,u,b-1/32,b,z1-1,z1,o.gl);if(o.sill)fR(g,u,a,b,z0-1,z0,o.sill);if(o.mul)fR(g,u,t-.5/32,t+.5/32,z0,z1,o.mul);
    if(ng&&lit&&hsh(seed,i,(z0|0)+50)<p)fR(ng,u,a,b,z0,z1,lit);}};
  const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);
    for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};

  // ================= 場景：分層描邊＋落影＋夜光遮擋 =================
  const scene=()=>{const items=[],SH=[];let n=0;
    return{
      o:(d,fn)=>items.push({d,ol:1,fn,i:n++}),       // 立體件：描外框
      t:(d,fn)=>items.push({d,ol:0,fn,i:n++}),       // 細線件：不描框
      sh:(u0,v0,du,dv,h)=>SH.push([u0,v0,du,dv,h]),   // 方盒落影
      run(g,ng){
        if(SH.length){const[mc,mx]=A.cv(W,H);
          for(const[u0,v0,du,dv,h]of SH){const hh=Math.min(h,40),k=Math.round(hh*.5),dy=-Math.round(hh*.13);
            const F=[P(u0,v0),P(u0+du,v0),P(u0+du,v0+dv),P(u0,v0+dv)],T=F.map(p=>[p[0]+k,p[1]+dy]);
            fp(mx,F,'#000');fp(mx,T,'#000');for(let i=0;i<4;i++)fp(mx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],'#000');}
          const[tc,tx]=A.cv(W,H);tx.fillStyle='#18212b';tx.fillRect(0,0,W,H);tx.globalCompositeOperation='destination-in';tx.drawImage(mc,0,0);
          g.save();g.globalAlpha=.28;g.globalCompositeOperation='source-atop';g.drawImage(tc,0,0);g.restore();}
        items.sort((a,b)=>a.d-b.d||a.i-b.i);
        for(const it of items){const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);it.fn(sx,lx);K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      }};};
  const sprite=(draw)=>{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const Sc=scene();draw(g,ng,Sc);Sc.run(g,ng);
    return{img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};};

  // ================= 色票 =================
  const C={
    grass:'#78a256',grassD:'#6a934b',grassH:'#88b265',pave:'#c7c2b6',paveJ:'#b9b4a8',paveH:'#d3cec3',
    asph:'#6f6d69',asphE:'#8d8a84',mark:'#e6e2d6',curbD:'#8a857b',curbL:'#d6d1c5',
    blue:'#2d5aa0',blueL:'#3f71bd',blueD:'#223f73',white:'#f1f0ea',
    win:'#4d7090',winD:'#3c5a74',winGl:'#8fb3cc',glass:'#5f8cab',glassD:'#486d86',glassH:'#a6c8dc',frame:'#39434d',
    lit:'#ffe3a2',litW:'#fff1c8',red:'#d4382c',redN:'#ff5a46',blueN:'#6fb2ff',
    hedge:'#4f8a3e',hedgeL:'#62a04c',hedgeD:'#3f7132',trunk:'#6b4a33',
  };

  // ================= 共用元件 =================
  const lotEdge=g=>{A.diaEdge(g,6,C.curbD,AX,TOPY,32);A.diaEdge(g,9,C.curbL,AX,TOPY,32);};
  const specks=(g,u0,v0,du,dv,n,seed,cols)=>{for(let i=0;i<n;i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v,0);RC(g,p[0],p[1],hsh(seed,i,4)<.5?2:1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
  // 鋪面磚縫：沿 u、v 方向細格線
  const tiles=(g,u0,v0,du,dv,step,c)=>{for(let u=u0+step;u<u0+du-.001;u+=step)BL(g,P(u,v0),P(u,v0+dv),c);for(let v=v0+step;v<v0+dv-.001;v+=step)BL(g,P(u0,v),P(u0+du,v),c);};
  const asphalt=(g,u0,v0,du,dv)=>{quad(g,u0,v0,du,dv,C.asphE);quad(g,u0+.015,v0+.015,du-.03,dv-.03,C.asph);};
  // 停車格線：沿 u 分隔（格線沿 v 方向畫）
  const stallsU=(g,u0,v0,du,dv,n)=>{for(let i=0;i<=n;i++){const u=u0+du*i/n;BL(g,P(u,v0),P(u,v0+dv*.7),C.mark);}};
  const stallsV=(g,u0,v0,du,dv,n)=>{for(let i=0;i<=n;i++){const v=v0+dv*i/n;BL(g,P(u0+du*.3,v),P(u0+du,v),C.mark);}};
  // 旗桿（細線層）：底座＋雙色桿＋旗
  const flag=(Sc,u,v,h,cols,d,seed=1)=>{Sc.o(d-.001,g=>{boxZ(g,u-.02,v-.02,.04,.04,0,2,'#d9d6cc','#c9c5ba','#a8a498');});
    Sc.t(d,g=>{const b=P(u,v,2),t=P(u,v,h);BL(g,b,t,'#e4e7ea');BL(g,[b[0]+1,b[1]],[t[0]+1,t[1]+1],'#8a939a');RC(g,t[0],t[1]-1,2,1,'#e0c35a');
      for(let x=0;x<6;x++){const wv=(x===2||x===3)?1:0;for(let y=0;y<4;y++){RC(g,t[0]+2+x,t[1]+1+y+wv,1,1,cols[Math.min(cols.length-1,(y*cols.length/4)|0)]);}}});};
  const tree=(Sc,u,v,r,h,d,seed=1,pal)=>{const q=pal||['#3f7331','#548c3f','#6ea84f','#8cc063'];Sc.sh(u-.03,v-.03,.06,.06,h+r);
    Sc.o(d,g=>{const b=P(u,v,0);RC(g,b[0]-1,b[1]-h,2,h+1,C.trunk);RC(g,b[0],b[1]-h,1,h+1,'#523726');
      const cx=b[0],cy=b[1]-h-r+1;ell(g,cx,cy,r,r,q[0]);ell(g,cx-1,cy-1,r-1,r-1,q[1]);ell(g,cx-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),q[2]);
      for(let i=0;i<4;i++){RC(g,cx-r+1+((hsh(seed,i,1)*(2*r-2))|0),cy-r+2+((hsh(seed,i,2)*(2*r-2))|0),1,1,hsh(seed,i,3)<.5?q[3]:q[0]);}});};
  const shrub=(Sc,u,v,d,c=C.hedge)=>{Sc.o(d,g=>{const b=P(u,v,0);ell(g,b[0],b[1]-2,2,2,c);RC(g,b[0]-1,b[1]-3,2,1,C.hedgeL);});};
  const hedge=(Sc,u0,v0,du,dv,h,d)=>{Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,0,h,C.hedgeL,C.hedge,C.hedgeD);
    for(let i=0;i<Math.round((du+dv)*14);i++){const u=u0+hsh(u0*97|0,i,1)*du,v=v0+hsh(v0*89|0,i,2)*dv,p=P(u,v,h);RC(g,p[0],p[1],1,1,'#79b35c');}});};
  const planter=(Sc,u,v,d)=>{Sc.o(d,g=>{boxZ(g,u,v,.05,.05,0,3,'#9c9a93','#bdbab2','#8f8c85');const p=P(u+.025,v+.025,3);ell(g,p[0],p[1]-1,2,1,C.hedge);RC(g,p[0]-1,p[1]-2,1,1,C.hedgeL);});};
  // 車：dir='u' 沿 u 方向停、'v' 沿 v 方向停；sty：tw 台灣巡邏車／jp 日式黑白／civ 一般車色
  const car=(Sc,u0,v0,dir,sty,d,o={})=>{const L=.22,Wd=.10,du=dir==='u'?L:Wd,dv=dir==='u'?Wd:L;Sc.sh(u0,v0,du,dv,6);
    Sc.o(d,(g,ng)=>{
      const body=sty==='jp'?['#f5f5f2','#f7f7f4','#d0d3d5']:sty==='tw'?['#f3f3f0','#f6f6f3','#cdd0d3']:(o.col||['#b54a3c','#c65a4a','#8e392e']);
      const low=sty==='jp'?['#2a2d33','#34383f','#1f2227']:body;
      boxZ(g,u0,v0,du,dv,1,2,low[0],low[1],low[2]);boxZ(g,u0,v0,du,dv,3,1,body[0],body[1],body[2]);
      // 輪
      if(dir==='u'){fL(g,v0+dv,u0+.03,u0+.07,0,1.2,'#23262a');fL(g,v0+dv,u0+du-.07,u0+du-.03,0,1.2,'#23262a');fR(g,u0+du,v0+.02,v0+.05,0,1.2,'#23262a');}
      else{fR(g,u0+du,v0+.03,v0+.07,0,1.2,'#23262a');fR(g,u0+du,v0+dv-.07,v0+dv-.03,0,1.2,'#23262a');fL(g,v0+dv,u0+.02,u0+.05,0,1.2,'#23262a');}
      if(sty==='tw'){if(dir==='u')fL(g,v0+dv,u0,u0+du,2,3,C.blue);else fR(g,u0+du,v0,v0+dv,2,3,C.blue);}
      // 車艙
      const cu=dir==='u'?u0+.05:u0+.015,cv=dir==='u'?v0+.015:v0+.06,cdu=dir==='u'?du-.1:du-.03,cdv=dir==='u'?dv-.03:dv-.11;
      boxZ(g,cu,cv,cdu,cdv,4,2,body[0],'#3d5566','#2e3e4b');
      if((sty==='tw'||sty==='jp')&&o.bar2){const m=P(cu+cdu/2,cv+cdv/2,6),x=Math.round(m[0]),y=Math.round(m[1]);   // 加大紅藍燈條 4x2（派出所用）
        RC(g,x-2,y-2,2,1,'#ec4a3c');RC(g,x,y-2,2,1,'#4a86ec');RC(g,x-2,y-1,2,1,'#a8281f');RC(g,x,y-1,2,1,'#244fa8');
        if(o.bar&&ng){RC(ng,x-2,y-2,2,2,C.redN);RC(ng,x,y-2,2,2,C.blueN);}}
      else if(sty==='tw'||sty==='jp'){const m=P(cu+cdu/2,cv+cdv/2,6);RC(g,m[0]-1,m[1]-1,1,1,C.red);RC(g,m[0],m[1]-1,1,1,sty==='jp'?C.red:'#2f63d0');
        if(o.bar&&ng){RC(ng,m[0]-1,m[1]-1,1,1,C.redN);RC(ng,m[0],m[1]-1,1,1,sty==='jp'?C.redN:C.blueN);}}
    });};
  // 機車（成排，沿 v 方向停放，車頭朝 −v）
  const scooters=(Sc,u0,v0,n,step,d,cols)=>{Sc.o(d,g=>{for(let i=0;i<n;i++){const p=P(u0+i*step,v0,0),x=Math.round(p[0]),y=Math.round(p[1]),c=cols[i%cols.length];
    RC(g,x-2,y-1,1,1,'#26292d');RC(g,x+1,y-2,1,1,'#26292d');RC(g,x-2,y-3,3,2,c);RC(g,x-1,y-4,2,1,'#2c2f33');RC(g,x+1,y-4,1,2,c);RC(g,x+1,y-5,1,1,'#9aa3aa');}});};
  // 單車架（細線層）
  const bikes=(Sc,u0,v0,n,step,d,white)=>{Sc.t(d,g=>{for(let i=0;i<n;i++){const p=P(u0+i*step,v0,0),x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-2,y-1,1,2,'#3a3e44');RC(g,x+1,y-2,1,2,'#3a3e44');RC(g,x-1,y-2,2,1,white||i%2?'#dfe3e6':'#c24a3a');RC(g,x,y-3,1,1,'#2b2e33');}});};
  const lamp=(Sc,u,v,h,d)=>{Sc.t(d,(g,ng)=>{const b=P(u,v,0),t=P(u,v,h);RC(g,b[0]-1,b[1]-1,3,2,'#4a5157');BL(g,b,t,'#6d767d');BL(g,[b[0]+1,b[1]],[t[0]+1,t[1]],'#40474d');RC(g,t[0]-1,t[1]-2,4,2,'#2f353a');RC(g,t[0]-1,t[1]-1,4,1,'#f1e6c2');if(ng)RC(ng,t[0]-1,t[1]-1,4,1,'#ffe7b0');});};

  // ================= 派出所 k52 =================
  // v0 城市兩層混凝土派出所：白磁磚牆＋藍色招牌帶、雨遮下玻璃門與值班台窗、紅色門燈、直立燈箱；前庭機車排＋巡邏車＋旗桿
  const pb0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.pave);tiles(g,0,0,1,1,.125,C.paveJ);specks(g,0,0,1,1,26,5201,[C.paveH,C.paveJ]);
    quad(g,.86,.0,.14,.62,C.grass);specks(g,.86,0,.14,.62,10,5202,[C.grassD,C.grassH]);
    asphalt(g,.5,.7,.48,.28);stallsU(g,.52,.72,.44,.26,2);
    lotEdge(g);
    const u0=.06,v0=.06,du=.78,dv=.6,u1=u0+du,v1=v0+dv,Hh=24;
    Sc.sh(u0,v0,du,dv,Hh);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,Hh,'#dcd9d0','#e7e4db','#bcb8ae');
      fL(g,v1,u0,u1,0,1,'#8e8a82');fR(g,u1,v0,v1,0,1,'#77736c');                 // 石材牆腳
      fL(g,v1,u0,u1,11.5,15,C.blue);fR(g,u1,v0,v1,11.5,15,C.blueD);               // 招牌帶
      for(const t of [.38,.47,.56]){fL(g,v1,t,t+2/32,12.5,14.5,C.white);}          // 「派出所」字塊
      fL(g,v1,u0,u1,Hh-1,Hh,'#f4f2ec');fR(g,u1,v0,v1,Hh-1,Hh,'#cfcbc2');           // 女兒牆壓頂
      quad(g,u0+.035,v0+.035,du-.07,dv-.07,'#8f9496',Hh);                         // 屋頂面
      // 一樓：公告欄、玻璃門、值班台窗
      fL(g,v1,u0+.04,u0+.17,3,8,'#6e5a44');fL(g,v1,u0+.05,u0+.16,4,7,'#ece8dc');RC(g,...P(u0+.08,v1,6.5),1,1,C.red);RC(g,...P(u0+.12,v1,5.5),1,1,'#3a6fb0');
      fL(g,v1,.29,.41,1,8.5,C.frame);fL(g,v1,.30,.40,1,8,C.glass);fL(g,v1,.345,.355,1,8,C.frame);fL(g,v1,.30,.32,6,8,C.glassH);
      fL(g,v1,.45,.66,3,9,C.frame);fL(g,v1,.46,.65,4,8,C.glass);fL(g,v1,.46,.49,6,8,C.glassH);fL(g,v1,.555,.565,4,8,C.frame);
      if(ng){fL(ng,v1,.30,.40,1,8,C.litW);fL(ng,v1,.46,.65,4,8,C.lit);}
      fL(g,v1,.72,.8,3,8,C.win);fL(g,v1,.72,.74,7,8,C.winGl);if(ng&&hsh(52,0,1)<.6)fL(ng,v1,.72,.8,3,8,C.lit);
      // 二樓窗列
      winsL(g,ng,v1,u0+.04,u1-.04,5,16,21,3,C.win,C.lit,5203,.55,{gl:C.winGl,sill:'#c9c5bb'});
      // 側面（暗面）：窗、冷氣室外機、側門
      winsR(g,ng,u1,v0+.04,v1-.04,3,16,21,3,C.winD,C.lit,5204,.5,{gl:'#6f93ab'});
      winsR(g,ng,u1,v0+.04,v1-.22,2,4,8,3,C.winD,C.lit,5205,.5);
      fR(g,u1,v1-.16,v1-.08,1,9,'#6b6259');
      for(const t of [.18,.34]){fR(g,u1,t,t+.06,13-1,13+1.2,'#a9adb0');}
      // 紅色門燈
      const lp=P(.27,v1,7);RC(g,lp[0],lp[1]-1,1,2,C.red);if(ng){RC(ng,lp[0],lp[1]-1,1,2,C.redN);}
    });
    // 屋頂：樓梯間＋機電箱（取代水塔：灰色方箱、暗面、百葉）＋警示燈
    Sc.o(1.01,(g,ng)=>{boxZ(g,.56,.1,.16,.14,Hh,6,'#cfccc3','#ebe8e0','#a39f95');fL(g,.24,.6,.65,Hh,Hh+5,'#6b6259');
      BL(g,P(.56,.24,Hh+6),P(.72,.24,Hh+6),'#f6f4ee');BL(g,P(.72,.1,Hh+6),P(.72,.24,Hh+6),'#bdb9af');
      boxZ(g,.15,.12,.2,.1,Hh,4,'#c3c8cb','#a4aaad','#6f7578');
      for(const z of [Hh+1,Hh+2.5])fL(g,.22,.18,.32,z,z+.6,'#80878b');fR(g,.35,.14,.2,Hh+.5,Hh+3,'#565b5e');
      const bl=P(.64,.17,Hh+6);RC(g,bl[0],bl[1]-2,2,2,'#3a74d8');if(ng)RC(ng,bl[0],bl[1]-2,2,2,C.blueN);});
    // 雨遮（附牆懸臂）
    Sc.o(1.1,g=>{boxZ(g,.26,v1,.42,.07,9,2,'#e4e4e0','#d0d2d4','#aeb1b4');});
    // 直立燈箱「警察」
    Sc.o(1.12,(g,ng)=>{boxZ(g,.09,v1,.03,.05,12,9,'#dfe2e6','#f2f4f6','#c6cbd0');
      for(let i=0;i<3;i++){const p=P(.09,v1+.05,19-i*3);RC(g,p[0]+1,p[1],1,2,C.blue);}if(ng)fL(ng,v1+.05,.09,.12,12,21,'#eaf2ff');});
    planter(Sc,.21,v1+.02,1.2);planter(Sc,.67,v1+.02,1.2);
    scooters(Sc,.1,.84,4,.045,1.4,['#f0f0ec','#f0f0ec','#2d5aa0','#f0f0ec']);
    car(Sc,.6,.8,'u','tw',1.5,{bar:true});
    flag(Sc,.08,.94,26,['#2d5aa0','#2d5aa0','#f1f0ea','#2d5aa0'],1.6);
    tree(Sc,.93,.3,5,7,1.3,5206);shrub(Sc,.92,.52,1.35);shrub(Sc,.9,.1,1.0);
  });

  // v1 現代玻璃交番（T576r 退件後改版）：單層寬淺玻璃量體＋前高後低薄屋面板（平頂淺斜、前緣挑出）、簷下貫穿藍色招牌帶＋白字塊、
  //    封簷板正中金色警徽、門左紅色圓門燈；門前正面黑白巡邏車（紅藍燈條）、左側揭示板、側邊白色警用單車
  const pb1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,'#d5cfc1');tiles(g,0,0,1,1,.1,'#c8c2b3');specks(g,0,0,1,1,20,5211,['#e0dbcf','#c3bdae']);
    quad(g,0,.06,.12,.94,C.grass);specks(g,0,.06,.12,.94,10,5212,[C.grassD,C.grassH]);
    asphalt(g,.3,.77,.34,.2);stallsU(g,.31,.78,.32,.18,1);                  // 門前臨停格（巡邏車正對大門）
    lotEdge(g);
    // T576r：改「平頂帶淺斜屋面」——陡山牆拿掉（1 倍下像住宅／小教堂），改成單層寬淺玻璃量體＋前高後低的薄屋面板（前緣挑出當雨遮）
    // 簷下貫穿藍色招牌帶＋白字塊（與 v0 同語彙）；入口正上方金色警徽圓章（掛在封簷板上）；門左 3x3 紅色圓門燈＋下方 1px 亮邊
    const u0=.16,v0=.22,du=.6,dv=.36,u1=u0+du,v1=v0+dv,um=u0+du/2,hw=14,e=.025,ef=.09,vf=v1+ef;
    const zb0=14,zb1=15.5,zf0=15,zf1=17.5;                                 // 屋面板：後緣 14–15.5、前緣 15–17.5（前高後低的淺斜）
    const LB=[.2,.29,.57,.66];                                              // 白字塊位置（讓開中央警徽）
    Sc.sh(u0,v0,du,dv,zf1);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,hw,'#d9dcde','#ecebe6','#c4c2bb');
      // 前面整片玻璃（到招牌帶下緣）
      fL(g,v1,u0+.02,u1-.02,0,9,C.frame);fL(g,v1,u0+.03,u1-.03,.5,8.5,'#6d9ab5');
      for(let i=1;i<6;i++){const t=u0+.03+(du-.06)*i/6;fL(g,v1,t-.5/32,t+.5/32,.5,8.5,C.frame);}
      fL(g,v1,um-.07,um+.07,0,6.5,C.frame);fL(g,v1,um-.06,um+.06,0,6,'#8db6cc');fL(g,v1,um-.005,um+.005,0,6,C.frame);   // 自動門
      for(const t of [u0+.05,u0+.14,u1-.14]){BL(g,P(t,v1,1.5),P(t+.05,v1,5.5),'#a9cde0');}                             // 反光斜紋（避開門）
      // 貫穿藍色招牌帶（正面＋側面）＋白色字塊
      fL(g,v1,u0,u1,9.5,12.5,C.blue);fR(g,u1,v0,v1,9.5,12.5,C.blueD);fL(g,v1,u0,u1,12,12.5,'#5b8bd2');
      for(const t of LB)fL(g,v1,t,t+2/32,10,12,C.white);
      fR(g,u1,v1-.2,v1-.14,10,12,'#c9cdd6');
      if(ng){fL(ng,v1,u0+.03,u1-.03,.5,8.5,C.lit);fL(ng,v1,um-.06,um+.06,0,6,C.litW);
        for(let i=1;i<6;i++){const t=u0+.03+(du-.06)*i/6;fL(ng,v1,t-.5/32,t+.5/32,.5,8.5,'#5a5040');}
        for(const t of LB)fL(ng,v1,t,t+2/32,10,12,'#eaf2ff');}
      // 側面：小窗、轉角玻璃、室外機
      winsR(g,ng,u1,v0+.03,v0+.15,1,4,8,3,C.winD,C.lit,5213,.7,{gl:'#6f93ab'});
      fR(g,u1,v1-.2,v1,0,8.5,C.frame);fR(g,u1,v1-.19,v1-.01,.5,8,'#557d96');for(const t of [v1-.13,v1-.07])fR(g,u1,t-.5/32,t+.5/32,.5,8,C.frame);
      if(ng){fR(ng,u1,v1-.19,v1-.01,.5,8,'#f0cf8c');for(const t of [v1-.13,v1-.07])fR(ng,u1,t-.5/32,t+.5/32,.5,8,'#5a5040');}
      boxZ(g,u1,v0+.02,.03,.08,1,3,'#b7bbbe','#c9cdd0','#a0a5a9');
    });
    // 薄屋面板：側面楔形（前厚後薄）＋白色封簷＋淺灰金屬頂面（立邊縫）
    Sc.o(1.05,g=>{const U0=u0-e,U1=u1+e,V0=v0-e;
      fp(g,[P(U1,V0,zb0),P(U1,vf,zf0),P(U1,vf,zf1),P(U1,V0,zb1)],'#9aa3aa');
      fp(g,[P(U0,vf,zf0),P(U1,vf,zf0),P(U1,vf,zf1),P(U0,vf,zf1)],'#f2f2ee');fL(g,vf,U0,U1,zf0,zf0+.7,'#c3c8cc');
      fp(g,[P(U0,V0,zb1),P(U1,V0,zb1),P(U1,vf,zf1),P(U0,vf,zf1)],'#b6bfc6');
      for(let i=1;i<9;i++){const u=U0+(U1-U0)*i/9;BL(g,P(u,V0,zb1),P(u,vf,zf1),'#a4adb4');}
      BL(g,P(U0,vf,zf1),P(U1,vf,zf1),'#dce2e6');
});
    Sc.o(1.055,g=>{const zs=v=>zb1+(zf1-zb1)*(v-(v0-e))/(vf-(v0-e));             // 屋頂室外機（坐在坡面上，底取前緣高）
      boxZ(g,.56,.3,.1,.07,zs(.37),3,'#d3d7da','#c2c6c9','#8f959a');const p=P(.61,.37,zs(.37)+1.5);RC(g,p[0]-1,p[1]-1,2,2,'#6d7479');});
    // 金色警徽圓章（自成一層描框）：掛在封簷板正中、大門正上方
    Sc.o(1.06,(g,ng)=>{badge(g,P(um+ef,vf,15.2));if(ng){const p=P(um+ef,vf,15.2);RC(ng,p[0],p[1],1,1,'#fff3c2');}});
    // 紅色圓門燈（自成一層描框）：3x3 紅＋左上高光、下方 1px 亮邊，掛在門左側招牌帶下
    Sc.o(1.07,(g,ng)=>{const p=P(um-.12,v1+.02,8),x=Math.round(p[0])-1,y=Math.round(p[1])-1;
      RC(g,x,y,3,3,C.red);RC(g,x,y,1,1,'#f7a292');RC(g,x+2,y+2,1,1,'#a92a20');RC(g,x,y+3,3,1,'#ffe4c4');
      if(ng){RC(ng,x,y,3,3,C.redN);RC(ng,x,y,1,1,'#ffc0b0');RC(ng,x,y+3,3,1,'#fff0d8');}});
    // 揭示板（左側草帶上，不擋立面）：兩支腳＋藍框白底板面＋三張告示
    Sc.o(.97,g=>{const b0=.0,b1=.14,bv=.6;for(const u of [b0+.01,b1-.025])boxZ(g,u,bv+.005,.015,.015,0,4,'#6b6f73','#6b6f73','#4d5053');
      boxZ(g,b0,bv,b1-b0,.02,3,6,'#3d4a57','#2f5a86','#23456a');fL(g,bv+.02,b0+.015,b1-.015,3.5,8.5,'#ece8dc');
      fL(g,bv+.02,b0+.03,b0+.06,5,8,'#d9483a');fL(g,bv+.02,b0+.075,b0+.1,4.5,7.5,'#3a6fb0');fL(g,bv+.02,b0+.11,b0+.125,5.5,8,'#e8bb3e');});
    bikes(Sc,.8,.34,2,.08,1.2,true);
    car(Sc,.35,.8,'u','jp',1.6,{bar:true,bar2:true});
    tree(Sc,.07,.85,5,6,1.5,5214);shrub(Sc,.06,.3,.9);                           // 後方灌木排在主體之前畫，不再壓到立面
    tree(Sc,.9,.12,4,6,.9,5215);shrub(Sc,.95,.66,1.3);
    planter(Sc,.2,.66,1.25);planter(Sc,.62,.66,1.25);
  });
  // v2 老式紅磚日式瓦頂派出所：辰野式紅磚白飾帶、深灰瓦四坡屋頂、白灰泥玄關小山牆＋紅門燈（T576r：2x2 自成描框層）＋白底黑框直式木牌；
  //    草坪、石板步道、綠籬、松樹；右前方碎石臨停位停白底藍帶巡邏車（取代右前綠籬）、左前方白色警用單車
  const pb2=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.grass);specks(g,0,0,1,1,40,5221,[C.grassD,C.grassH,'#6f9c4f']);
    quad(g,.1,.08,.74,.58,'#bdb6a6');specks(g,.1,.08,.74,.58,14,5222,['#aaa392','#cdc7b8']);            // 碎石環帶
    quad(g,.4,.6,.16,.4,'#b3ad9f');for(let i=0;i<5;i++){quad(g,.415,.66+i*.07,.13,.045,'#d9d3c4');}      // 石板步道
    quad(g,.58,.72,.38,.23,'#a8a293');quad(g,.6,.74,.34,.19,'#b6b0a1');specks(g,.6,.74,.34,.19,10,5226,['#9e9888','#c7c1b2']);   // 碎石臨停位
    lotEdge(g);
    const u0=.14,v0=.12,du=.64,dv=.46,u1=u0+du,v1=v0+dv,hw=14,hr=26,e=.045,vm=v0+dv/2,r=dv/2+e;
    const brickL='#b5553e',brickR='#8a3e2e',band='#ece5d3',bandR='#c3baa6';
    Sc.sh(u0,v0,du,dv,hr-4);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,hw,null,brickL,brickR);
      for(let z=2;z<hw;z+=2){BL(g,P(u0,v1,z),P(u1,v1,z),'#a44b36');BL(g,P(u1,v0,z),P(u1,v1,z),'#7c3628');}
      fL(g,v1,u0,u1,0,1.5,'#cfc8b7');fR(g,u1,v0,v1,0,1.5,'#a79f8d');
      fL(g,v1,u0,u1,6,7,band);fR(g,u1,v0,v1,6,7,bandR);fL(g,v1,u0,u1,12,13,band);fR(g,u1,v0,v1,12,13,bandR);
      // 直長窗（白框）：左面避開玄關
      for(const t of [.2,.3,.64,.73]){fL(g,v1,t-.045,t+.045,2.5,11,band);fL(g,v1,t-.03,t+.03,3,10.5,'#4a6278');fL(g,v1,t-.005,t+.005,3,10.5,band);
        if(ng&&hsh(5223,t*100|0,1)<.7)fL(ng,v1,t-.03,t+.03,3,10.5,C.lit);}
      for(const t of [.2,.34,.48]){fR(g,u1,t-.045,t+.045,2.5,11,bandR);fR(g,u1,t-.03,t+.03,3,10.5,'#3c5264');fR(g,u1,t-.005,t+.005,3,10.5,bandR);
        if(ng&&hsh(5224,t*100|0,1)<.6)fR(ng,u1,t-.03,t+.03,3,10.5,C.lit);}
    });
    // 四坡瓦頂：後坡／左側坡先畫，前坡、右側坡後畫
    Sc.o(1.02,g=>{const E=[P(u0-e,v0-e,hw),P(u1+e,v0-e,hw),P(u1+e,v1+e,hw),P(u0-e,v1+e,hw)],Ra=P(u0+r,vm,hr),Rb=P(u1-r,vm,hr);
      fp(g,[E[0],E[1],Rb,Ra],'#4f555c');fp(g,[E[0],Ra,E[3]],'#5f666e');
      fp(g,[E[3],E[2],Rb,Ra],'#646b73');fp(g,[E[1],E[2],Rb],'#454a51');
      for(let i=1;i<6;i++){const t=i/6,lp=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];BL(g,lp(E[3],Ra),lp(E[2],Rb),'#565c63');BL(g,lp(E[2],Rb),lp(E[1],Rb),'#3b4046');}
      BL(g,E[3],E[2],'#7a828a');BL(g,E[2],E[1],'#545a61');BL(g,Ra,Rb,'#353a40');BL(g,E[2],Rb,'#3a3f45');
      RC(g,Ra[0]-1,Ra[1]-2,2,2,'#353a40');RC(g,Rb[0],Rb[1]-2,2,2,'#353a40');
      fL(g,v1+e,u0-e,u1+e,hw-1,hw,'#3a3530');fR(g,u1+e,v0-e,v1+e,hw-1,hw,'#2e2a26');});
    // 玄關（白灰泥）＋小山牆；T576r：玄關加寬，門左側掛白底黑框直式木牌（白 2x5）
    const pu0=.3,pu1=.64,pv0=v1-.01,pv1=v1+.1,pum=(pu0+pu1)/2,ph=10,pr=16,pe=.025,dm=pum+.02;
    Sc.o(1.2,(g,ng)=>{boxZ(g,pu0,pv0,pu1-pu0,pv1-pv0,0,ph,null,'#efe9da','#c9c1ae');
      fp(g,[P(pu0,pv1,ph),P(pu1,pv1,ph),P(pum,pv1,pr-1)],'#efe9da');
      fL(g,pv1,dm-.055,dm+.055,0,7.5,'#4c3526');fL(g,pv1,dm-.045,dm+.045,0,7,'#7a5537');fL(g,pv1,dm-.004,dm+.004,0,7,'#4c3526');
      fL(g,pv1,dm-.04,dm-.01,4,6.5,'#9cc0d2');fL(g,pv1,dm+.01,dm+.04,4,6.5,'#9cc0d2');
      if(ng)fL(ng,pv1,dm-.04,dm+.04,4,6.5,C.lit);
      // 直式木牌：黑框 4x7、白底 2x5、兩點墨字
      {const s=P(pu0+.02,pv1,8.6),x=Math.round(s[0]),y=Math.round(s[1]);RC(g,x,y,4,7,'#1f1c19');RC(g,x+1,y+1,2,5,'#fbf8ef');RC(g,x+1,y+2,1,1,'#8d877c');RC(g,x+2,y+4,1,1,'#8d877c');}
      const hU=u=>pr-(pr-(ph-1))*(u-pum)/(pu1+pe-pum);
      fp(g,[P(pum,pv0,pr),P(pum,pv1+pe,pr),P(pu1+pe,pv1+pe,ph-1),P(pu1+pe,pv0,ph-1)],'#555b62');
      for(let i=1;i<4;i++){const u=pum+(pu1+pe-pum)*i/4;BL(g,P(u,pv0,hU(u)),P(u,pv1+pe,hU(u)),'#464b51');}
      const L0=P(pu0-pe,pv1+pe,ph-1),T=P(pum,pv1+pe,pr),R0=P(pu1+pe,pv1+pe,ph-1);
      fp(g,[L0,T,[T[0],T[1]+2],[L0[0],L0[1]+2]],'#3b3f45');fp(g,[T,R0,[R0[0],R0[1]+2],[T[0],T[1]+2]],'#3b3f45');});
    // 紅門燈（自成一層描框）：2x2 紅＋下方 1px 亮邊，掛在小山牆下
    Sc.o(1.21,(g,ng)=>{const p=P(dm,pv1+.02,ph+1.5),x=Math.round(p[0])-1,y=Math.round(p[1])-1;
      RC(g,x,y,2,2,C.red);RC(g,x,y,1,1,'#f7a292');RC(g,x,y+2,2,1,'#ffe4c4');
      if(ng){RC(ng,x,y,2,2,C.redN);RC(ng,x,y+2,2,1,'#fff0d8');}});
    // 綠籬、松樹；右前方綠籬改為巡邏車臨停（碎石停車位）、左前方白色警用單車
    hedge(Sc,.94,.32,.04,.46,2,1.3);hedge(Sc,.12,.94,.2,.04,2,1.5);
    tree(Sc,.9,.1,5,7,1.0,5225,['#2f5a2e','#3f6f3a','#56874b','#6e9e5c']);shrub(Sc,.1,.7,1.3,'#3f7132');shrub(Sc,.2,.7,1.31);
    car(Sc,.64,.775,'u','tw',1.5,{bar:true,bar2:true});
    bikes(Sc,.27,.8,2,.06,1.45,true);
  });

  // ================= 警察局 k11 共用 =================
  // 警徽：深藍圓底＋金色星形十字（以左面座標點為中心）
  const badge=(g,p)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-2,3,5,'#1c3a6c');RC(g,x-2,y-1,5,3,'#1c3a6c');
    RC(g,x,y-2,1,5,'#e8bb3e');RC(g,x-2,y,5,1,'#e8bb3e');RC(g,x-1,y-1,3,3,'#e8bb3e');RC(g,x,y,1,1,'#fff3c2');};
  const flags3=(Sc,u,v,step,d,alongV)=>{const cs=[['#2d5aa0','#2d5aa0','#f1f0ea','#2d5aa0'],['#f1f0ea','#3f8f5a','#3f8f5a','#f1f0ea'],['#2d5aa0','#e8bb3e','#2d5aa0','#2d5aa0']],hs=[22,26,22];
    for(let i=0;i<3;i++)flag(Sc,alongV?u:u+i*step,alongV?v+i*step:v,hs[i],cs[i],d+i*.01);};
  // 通訊鐵塔（細線層，錐形格構）
  const mast=(Sc,u,v,z,h,d)=>{Sc.o(d-.001,g=>{boxZ(g,u-.025,v-.025,.05,.05,z,1.5,'#b8bcbe','#c9cccd','#9ea2a4');});
    Sc.t(d,(g,ng)=>{const b=P(u,v,z+1.5),t=P(u,v,z+h),bx=Math.round(b[0]),by=Math.round(b[1]),tx=Math.round(t[0]),ty=Math.round(t[1]);
      BL(g,[bx-2,by],[tx,ty],'#7d878e');BL(g,[bx+2,by],[tx+1,ty],'#59626a');
      for(let y=by-3;y>ty+1;y-=3){const f=(by-y)/(by-ty),hw=Math.round(2*(1-f));if(hw>0){RC(g,tx-hw,y,2*hw+1,1,'#8a949b');}}
      RC(g,tx,ty-3,1,3,'#9aa3a9');RC(g,tx,ty-4,1,1,C.red);if(ng)RC(ng,tx,ty-4,1,1,C.redN);});};
  // 帶框玻璃帶（水平條窗）：沿 +v 面
  const ribbonL=(g,ng,v,ua,ub,z0,z1,glass,seed,p=.55,step=.07)=>{fL(g,v,ua,ub,z0-.5,z1+.5,C.frame);fL(g,v,ua+.01,ub-.01,z0,z1,glass);fL(g,v,ua+.01,ub-.01,z1-1,z1,'#9cc0d6');
    let i=0;for(let t=ua+step;t<ub-.02;t+=step,i++){fL(g,v,t-.5/32,t+.5/32,z0,z1,C.frame);}
    if(ng){let k=0;for(let t=ua+.01;t<ub-.012;t+=step,k++){if(hsh(seed,k,z0|0)<p)fL(ng,v,t+.5/32,Math.min(ub-.01,t+step-.5/32),z0,z1,C.lit);}}};
  const ribbonR=(g,ng,u,va,vb,z0,z1,glass,seed,p=.5,step=.07)=>{fR(g,u,va,vb,z0-.5,z1+.5,C.frame);fR(g,u,va+.01,vb-.01,z0,z1,glass);
    for(let t=va+step;t<vb-.02;t+=step){fR(g,u,t-.5/32,t+.5/32,z0,z1,C.frame);}
    if(ng){let k=0;for(let t=va+.01;t<vb-.012;t+=step,k++){if(hsh(seed,k,(z0|0)+70)<p)fR(ng,u,t+.5/32,Math.min(vb-.01,t+step-.5/32),z0,z1,C.lit);}}};
  const acUnit=(g,u,v,z)=>{boxZ(g,u,v,.06,.05,z,3,'#c3c7c9','#d5d8da','#a6abae');const p=P(u+.03,v+.025,z+3);RC(g,p[0]-1,p[1],2,1,'#7b8286');};

  // v0 寬矮分局：三層長條混凝土樓（水平帶窗）＋側翼車庫（兩道捲門）＋懸臂雨遮與台階、三旗桿、屋頂通訊鐵塔；前方巡邏車停車場
  const po0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.pave);tiles(g,0,0,1,1,.125,C.paveJ);specks(g,0,0,1,1,24,1101,[C.paveH,C.paveJ]);
    asphalt(g,.38,.64,.6,.34);stallsU(g,.4,.66,.56,.3,4);quad(g,.0,.62,.34,.38,'#cdc8bc');tiles(g,0,.62,.34,.38,.06,'#bfbaae');
    quad(g,.02,.02,.04,.56,C.grass);
    lotEdge(g);
    const u0=.04,v0=.08,du=.66,dv=.5,u1=u0+du,v1=v0+dv,Hh=33,au0=u1,av0=.1,adu=.26,adv=.38,ah=11;
    Sc.sh(u0,v0,du,dv,Hh);Sc.sh(au0,av0,adu,adv,ah);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,Hh,'#e8e5dd','#dedad0','#b3aea3');
      fL(g,v1,u0,u1,0,1.5,'#8b877f');fR(g,u1,v0,v1,0,1.5,'#75716a');
      fL(g,v1,u0,u1,11,12,'#f2f0ea');fR(g,u1,v0,v1,11,12,'#cbc7be');fL(g,v1,u0,u1,20.5,21.5,'#f2f0ea');fR(g,u1,v0,v1,20.5,21.5,'#cbc7be');
      ribbonL(g,ng,v1,u0+.03,u1-.03,14,19,C.glass,1102);ribbonL(g,ng,v1,u0+.03,u1-.03,23.5,28.5,C.glass,1103);
      ribbonR(g,ng,u1,v0+.03,v1-.03,14,19,C.glassD,1104);ribbonR(g,ng,u1,v0+.03,v1-.03,23.5,28.5,C.glassD,1105);
      fL(g,v1,u0,u1,30,Hh,C.blue);fR(g,u1,v0,v1,30,Hh,C.blueD);fL(g,v1,u0,u1,Hh-.6,Hh,'#6f95d0');
      quad(g,u0+.03,v0+.03,du-.06,dv-.06,'#8f9496',Hh);
      // 一樓：大門（玻璃）＋兩側窗
      fL(g,v1,.3,.48,1.5,9.5,C.frame);fL(g,v1,.31,.47,1.5,9,'#6d98b3');for(const t of [.35,.39,.43])fL(g,v1,t-.5/32,t+.5/32,1.5,9,C.frame);
      if(ng)fL(ng,v1,.31,.47,1.5,9,C.litW);
      winsL(g,ng,v1,u0+.02,.28,3,4,9,3,C.win,C.lit,1106,.6,{gl:C.winGl,sill:'#c9c5bb'});winsL(g,ng,v1,.5,u1-.02,3,4,9,3,C.win,C.lit,1107,.6,{gl:C.winGl,sill:'#c9c5bb'});
    });
    // 車庫翼
    Sc.o(1.02,(g,ng)=>{const b=boxZ(g,au0,av0,adu,adv,0,ah,'#a3a8aa','#d6d2c8','#aba69b');const v=av0+adv;
      fL(g,v,au0,au0+adu,ah-2,ah,C.blue);fR(g,au0+adu,av0,v,ah-2,ah,C.blueD);
      for(const[a,bb]of[[.72,.82],[.845,.945]]){fL(g,v,a,bb,0,8,'#6d757b');fL(g,v,a+.01,bb-.01,0,7.5,'#9ba2a7');for(let z=1;z<7.5;z+=1.5)fL(g,v,a+.01,bb-.01,z,z+.5,'#838a8f');}
      fR(g,au0+adu,av0+.08,av0+.2,3,7,C.winD);if(ng)fR(ng,au0+adu,av0+.08,av0+.2,3,7,C.lit);
      acUnit(g,au0+.06,av0+.08,ah);acUnit(g,au0+.16,av0+.08,ah);
      const wl=P(au0+.02,v,9);RC(g,wl[0],wl[1]-1,1,1,'#f0b43a');if(ng)RC(ng,wl[0],wl[1]-1,2,1,'#ffd27a');});
    // 屋頂：樓梯間、冷氣、鐵塔
    Sc.o(1.01,g=>{boxZ(g,.46,.12,.12,.1,Hh,5,'#d5d2c9','#e3e0d8','#b8b3a9');fL(g,.22,.5,.54,Hh,Hh+4,'#6b6259');boxZ(g,.22,.34,.24,.08,Hh,3,'#c3c7c9','#d5d8da','#a6abae');for(const t of [.26,.34,.42]){const q=P(t,.38,Hh+3);RC(g,q[0]-1,q[1],3,1,'#7b8286');}});
    mast(Sc,.14,.16,Hh,22,1.011);
    // 懸臂雨遮（藍色招牌簷口）＋台階
    Sc.o(1.1,g=>{boxZ(g,.27,v1,.24,.08,10,2,'#eceae4',C.blue,C.blueD);for(const t of [.32,.36,.4,.44])fL(g,v1+.08,t,t+1/32,10.5,11.5,C.white);
      badge(g,P(.39,v1,15.5));});
    Sc.o(1.09,g=>{boxZ(g,.28,v1,.22,.05,0,1,'#d9d6ce','#cfcbc2','#aaa69d');});
    flags3(Sc,.03,.66,.08,1.3,true);
    car(Sc,.44,.7,'v','tw',1.4,{bar:true});car(Sc,.58,.7,'v','tw',1.41);car(Sc,.83,.72,'v','civ',1.45,{col:['#c9cfd6','#dfe4e8','#9ea7b0']});
    tree(Sc,.97,.58,4,6,1.5,1108);
  });
  // v1 塔樓型總局：一層玻璃大廳基座＋十層直條窗塔樓（藍色冠帶與警徽）＋屋頂天線；前廣場三旗桿、側道巡邏車
  const po1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,'#cdc8bb');tiles(g,0,0,1,1,.1,'#bfbaad');specks(g,0,0,1,1,20,1111,['#dad5c9','#b9b3a6']);
    quad(g,0,.7,.26,.3,C.grass);quad(g,.7,0,.3,.06,C.grass);specks(g,0,.7,.26,.3,8,1112,[C.grassD,C.grassH]);
    asphalt(g,.9,.06,.1,.6);
    lotEdge(g);
    const pu0=.08,pv0=.08,pdu=.8,pdv=.58,pu1=pu0+pdu,pv1=pv0+pdv,ph=10,tu0=.24,tv0=.14,tdu=.38,tdv=.34,tu1=tu0+tdu,tv1=tv0+tdv,top=64;
    Sc.sh(pu0,pv0,pdu,pdv,ph);Sc.sh(tu0,tv0,tdu,tdv,top);
    Sc.o(1,(g,ng)=>{
      boxZ(g,pu0,pv0,pdu,pdv,0,ph,'#9fa39f','#d9d5cb','#aea99e');
      fL(g,pv1,pu0+.03,pu1-.03,.5,7.5,C.frame);fL(g,pv1,pu0+.04,pu1-.04,.5,7,'#6995b0');
      for(let t=pu0+.1;t<pu1-.05;t+=.08)fL(g,pv1,t-.5/32,t+.5/32,.5,7,C.frame);
      fL(g,pv1,pu0,pu1,8,ph,C.blue);fR(g,pu1,pv0,pv1,8,ph,C.blueD);
      fR(g,pu1,pv0+.04,pv1-.04,1,7,C.frame);fR(g,pu1,pv0+.05,pv1-.05,1.5,6.5,'#4c7590');for(let t=pv0+.12;t<pv1-.05;t+=.08)fR(g,pu1,t-.5/32,t+.5/32,1.5,6.5,C.frame);
      if(ng){fL(ng,pv1,pu0+.04,pu1-.04,.5,7,C.lit);for(let t=pu0+.1;t<pu1-.05;t+=.08)fL(ng,pv1,t-.5/32,t+.5/32,.5,7,'#5a5040');fR(ng,pu1,pv0+.05,pv1-.05,1.5,6.5,'#e8c98a');}
      quad(g,pu0+.03,pv0+.03,pdu-.06,pdv-.06,'#8d9a86',ph);
      for(let i=0;i<8;i++){const u=pu0+.06+hsh(1113,i,1)*(pdu-.12),v=pv0+.06+hsh(1113,i,2)*(pdv-.12),p=P(u,v,ph);RC(g,p[0],p[1],2,1,i%2?'#6f8a62':'#a2b394');}
    });
    Sc.o(1.1,(g,ng)=>{
      boxZ(g,tu0,tv0,tdu,tdv,ph,top-ph,'#e2dfd8','#dcd8cf','#b2ada2');
      const zt=top-7;
      for(let t=tu0+.035;t<tu1-.02;t+=.075){fL(g,tv1,t,t+2/32,ph+2,zt,'#5b87a4');fL(g,tv1,t,t+1/32,ph+2,zt,'#7eaac4');}
      for(let t=tv0+.04;t<tv1-.02;t+=.075){fR(g,tu1,t,t+2/32,ph+2,zt,'#44697f');}
      for(let z=ph+2+5;z<zt;z+=5.5){fL(g,tv1,tu0,tu1,z,z+1,'#c8c4ba');fR(g,tu1,tv0,tv1,z,z+1,'#9f9a90');}
      if(ng){let k=0;for(let z=ph+2;z<zt-1;z+=5.5)for(let t=tu0+.035,i=0;t<tu1-.02;t+=.075,i++){if(hsh(1114,i,k)<.45)fL(ng,tv1,t,t+2/32,z,Math.min(zt,z+5),C.lit);}
        k=0;for(let z=ph+2;z<zt-1;z+=5.5,k++)for(let t=tv0+.04,i=0;t<tv1-.02;t+=.075,i++){if(hsh(1115,i,k)<.4)fR(ng,tu1,t,t+2/32,z,Math.min(zt,z+5),'#f0d08e');}}
      fL(g,tv1,tu0,tu1,zt+1,top,C.blue);fR(g,tu1,tv0,tv1,zt+1,top,C.blueD);badge(g,P(tu0+tdu/2,tv1,zt+4));
      if(ng)RC(ng,...P(tu0+tdu/2,tv1,zt+4),1,1,'#fff3c2');
      quad(g,tu0+.03,tv0+.03,tdu-.06,tdv-.06,'#8f9496',top);
      boxZ(g,tu0+.06,tv0+.06,.12,.1,top,4,'#cfccc4','#dedbd3','#b3aea4');
    });
    mast(Sc,tu0+.26,tv0+.2,top,14,1.101);
    // 入口雨遮
    Sc.o(1.2,g=>{boxZ(g,.36,pv1,.2,.07,7.5,2,'#eeece6','#d3d4d4','#aeb0b2');});
    flags3(Sc,.12,.8,.07,1.4);
    car(Sc,.9,.12,'v','tw',1.2,{bar:true});car(Sc,.9,.4,'v','tw',1.25);
    tree(Sc,.08,.86,5,6,1.6,1116);tree(Sc,.82,.03,4,6,.9,1117);
  });
  // v2 老式古典建築：米黃石材兩層、一樓粗石紋、山花門廊（四柱＋三角楣＋警徽）、欄杆女兒牆、中央鐘樓銅綠尖頂；對稱草坪、路燈
  const po2=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.grass);specks(g,0,0,1,1,36,1121,[C.grassD,C.grassH]);
    quad(g,.06,.06,.82,.58,'#cfc6b2');quad(g,.4,.62,.16,.38,'#d8d0bd');tiles(g,.4,.62,.16,.38,.08,'#c6bda8');
    lotEdge(g);
    const u0=.1,v0=.1,du=.72,dv=.48,u1=u0+du,v1=v0+dv,Hh=24,st='#e9e0c9',stR='#bfb398',stT='#f2ecdc';
    Sc.sh(u0,v0,du,dv,Hh+3);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,Hh,null,st,stR);
      for(let z=2;z<10;z+=2){BL(g,P(u0,v1,z),P(u1,v1,z),'#d3c8ad');BL(g,P(u1,v0,z),P(u1,v1,z),'#a79b80');}
      fL(g,v1,u0,u1,10,11,stT);fR(g,u1,v0,v1,10,11,'#cfc4aa');
      // 窗：一樓拱窗、二樓帶楣窗；避開門廊段
      const wl=[.15,.24,.69,.77],wr=[.18,.3,.42,.5];
      for(const t of wl){fL(g,v1,t-.035,t+.035,3,8.5,'#4a6076');fL(g,v1,t-.02,t+.02,8.5,9.3,'#4a6076');fL(g,v1,t-.045,t+.045,2.2,3,stT);
        fL(g,v1,t-.035,t+.035,13,19,'#4a6076');fL(g,v1,t-.05,t+.05,19.5,21,stT);fL(g,v1,t-.004,t+.004,13,19,st);
        if(ng){if(hsh(1122,t*100|0,1)<.6)fL(ng,v1,t-.035,t+.035,3,8.5,C.lit);if(hsh(1123,t*100|0,1)<.5)fL(ng,v1,t-.035,t+.035,13,19,C.lit);}}
      for(const t of wr){fR(g,u1,t-.035,t+.035,3,8.5,'#3a4d5f');fR(g,u1,t-.02,t+.02,8.5,9.3,'#3a4d5f');
        fR(g,u1,t-.035,t+.035,13,19,'#3a4d5f');fR(g,u1,t-.05,t+.05,19.5,21,'#d8ceb5');
        if(ng){if(hsh(1124,t*100|0,1)<.5)fR(ng,u1,t-.035,t+.035,3,8.5,C.lit);if(hsh(1125,t*100|0,1)<.45)fR(ng,u1,t-.035,t+.035,13,19,C.lit);}}
      // 簷口＋欄杆女兒牆
      boxZ(g,u0-.012,v0-.012,du+.024,dv+.024,Hh-2,2,stT,'#f4eee0','#cbbfa5');
      boxZ(g,u0,v0,du,dv,Hh,3,null,st,stR);
      for(let t=u0+.03;t<u1-.01;t+=.04)fL(g,v1,t,t+1/32,Hh+.5,Hh+2.2,'#b8ab8f');for(let t=v0+.03;t<v1-.01;t+=.04)fR(g,u1,t,t+1/32,Hh+.5,Hh+2.2,'#978a70');
      fp(g,[P(u0,v0,Hh+3),P(u1,v0,Hh+3),P(u1,v1,Hh+3),P(u0,v1,Hh+3)],stT);quad(g,u0+.025,v0+.025,du-.05,dv-.05,'#9b958a',Hh+3);
    });
    // 中央鐘樓＋銅綠尖頂
    Sc.o(1.05,(g,ng)=>{const a=.38,b=.24,s=.16,z=Hh+3,hz=10;boxZ(g,a,b,s,s,z,hz,null,st,stR);
      boxZ(g,a-.01,b-.01,s+.02,s+.02,z+hz,1.5,stT,'#f4eee0','#cbbfa5');
      const c=P(a+s/2,b+s,z+6);ell(g,c[0],c[1],2,2,'#f7f3e8');RC(g,c[0],c[1]-2,1,2,'#3a3a3a');RC(g,c[0],c[1],2,1,'#3a3a3a');if(ng)ell(ng,c[0],c[1],2,2,'#fff0c4');
      const zt=z+hz+1.5,ap=P(a+s/2,b+s/2,zt+10);fp(g,[P(a-.01,b+s+.01,zt),P(a+s+.01,b+s+.01,zt),ap],'#6aa293');fp(g,[P(a+s+.01,b-.01,zt),P(a+s+.01,b+s+.01,zt),ap],'#4b7e71');
      BL(g,ap,[ap[0],ap[1]-4],'#c9a640');});
    // 門廊：台階、四柱、額枋、三角山花（附牆、寬 1/3 立面）
    const pu0=.3,pu1=.62,pv0=v1,pv1=v1+.1,pum=(pu0+pu1)/2,zc=14,ze=16.5,zp=22;
    Sc.o(1.2,(g,ng)=>{boxZ(g,pu0-.03,pv0,pu1-pu0+.06,pv1-pv0+.03,0,1,'#d8d0bc','#e5ddc9','#b7ad97');boxZ(g,pu0-.01,pv0,pu1-pu0+.02,pv1-pv0+.015,1,1.5,'#e3dbc8','#eee7d5','#c2b8a1');
      fL(g,pv0,pu0,pu1,2.5,zc,'#8e8470');fL(g,pv0,pum-.05,pum+.05,2.5,10.5,'#5a3f2c');fL(g,pv0,pum-.04,pum+.04,2.5,10,'#7b5639');fL(g,pv0,pum-.004,pum+.004,2.5,10,'#5a3f2c');
      fL(g,pv0,pum-.04,pum+.04,8,10,'#9fc1d2');if(ng)fL(ng,pv0,pum-.04,pum+.04,8,10,C.lit);
      for(let i=0;i<4;i++){const t=pu0+.03+i*.083;boxZ(g,t,pv1-.03,1.3/32,.03,2.5,zc-2.5,null,'#fbf7ec','#cfc5ae');fL(g,pv1,t-.3/32,t+1.6/32,2.5,3.5,'#e0d7c2');fL(g,pv1,t-.3/32,t+1.6/32,zc-1,zc,'#e0d7c2');}
      boxZ(g,pu0-.01,pv0,pu1-pu0+.02,pv1-pv0+.01,zc,ze-zc,stT,'#f2ecdc','#c9bea4');fL(g,pv1+.01,pu0-.01,pu1+.01,zc,zc+1,'#d9cfb8');
      const L0=P(pu0-.01,pv1+.01,ze),R0=P(pu1+.01,pv1+.01,ze),T=P(pum,pv1+.01,zp);
      fp(g,[T,P(pum,pv0,zp),P(pu1+.01,pv0,ze),R0],'#8f8a80');BL(g,T,P(pum,pv0,zp),'#a6a196');
      fp(g,[L0,R0,T],'#efe8d7');fp(g,[P(pu0+.04,pv1+.01,ze+.8),P(pu1-.04,pv1+.01,ze+.8),P(pum,pv1+.01,zp-1.6)],'#ddd3bd');BL(g,L0,T,'#c3b89f');BL(g,T,R0,'#b3a88f');
      badge(g,P(pum,pv1+.01,ze+2.2));
      for(const t of [pum-.075,pum+.065]){const q=P(t,pv0,8);RC(g,q[0],q[1]-1,1,2,'#e9d9a0');if(ng)RC(ng,q[0],q[1]-1,1,2,'#ffe7a8');}});
    hedge(Sc,.08,.66,.24,.05,3,1.25);hedge(Sc,.62,.66,.24,.05,3,1.26);
    car(Sc,.86,.64,'v','tw',1.5,{bar:true});
    tree(Sc,.94,.2,4,6,1.2,1126);tree(Sc,.03,.95,4,6,1.6,1127);
  });
  // v3 現代玻璃：藍綠玻璃帷幕量體（樓板線＋豎框）＋實心藍色核心筒（直式 POLICE 字＋警徽）、玻璃入口、屋頂太陽能；廣場樹池、單車架、電動巡邏車與充電柱
  const po3=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,'#d0cdc5');tiles(g,0,0,1,1,.083,'#c2beb5');
    quad(g,.0,.66,.34,.34,C.grass);specks(g,0,.66,.34,.34,10,1131,[C.grassD,C.grassH]);
    asphalt(g,.5,.66,.48,.32);stallsU(g,.52,.68,.44,.28,3);
    lotEdge(g);
    const u0=.16,v0=.12,du=.54,dv=.46,u1=u0+du,v1=v0+dv,Hh=46,cu0=u1,cv0=.12,cdu=.14,cdv=.3,ch=54;
    Sc.sh(u0,v0,du,dv,Hh);Sc.sh(cu0,cv0,cdu,cdv,ch);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,Hh,null,'#5d92ad','#43708a');
      for(let t=u0+.09;t<u1-.01;t+=.09){fL(g,v1,t-.5/32,t+.5/32,0,Hh,'#8ab8cd');}
      for(let t=v0+.09;t<v1-.01;t+=.09){fR(g,u1,t-.5/32,t+.5/32,0,Hh,'#5f8aa2');}
      for(let z=9;z<Hh;z+=7.4){fL(g,v1,u0,u1,z,z+1.2,'#2f4757');fR(g,u1,v0,v1,z,z+1.2,'#253a48');}
      for(let i=0;i<5;i++){const t=u0+.05+i*.1;BL(g,P(t,v1,14+i*3),P(t+.06,v1,24+i*3),'#a3cfe0');}
      fL(g,v1,u0,u1,0,1,'#3a4a55');fR(g,u1,v0,v1,0,1,'#2e3b44');
      fL(g,v1,.3,.46,1,8,'#b8dcea');fL(g,v1,.375,.385,1,8,C.frame);
      fL(g,v1,u0,u1,Hh-1.5,Hh,'#e6e9ea');fR(g,u1,v0,v1,Hh-1.5,Hh,'#b9bec1');
      quad(g,u0+.02,v0+.02,du-.04,dv-.04,'#8e9599',Hh);
      if(ng){fL(ng,v1,.3,.46,1,8,C.litW);let k=0;
        for(let z=1.6;z<Hh-3;z+=7.4,k++){for(let t=u0,i=0;t<u1-.01;t+=.09,i++){if(hsh(1132,i,k)<.5)fL(ng,v1,t+.6/32,Math.min(u1,t+.09-.6/32),z+1.2,Math.min(Hh-1.5,z+7.4),'#ffe0a0');}
          for(let t=v0,i=0;t<v1-.01;t+=.09,i++){if(hsh(1133,i,k)<.45)fR(ng,u1,t+.6/32,Math.min(v1,t+.09-.6/32),z+1.2,Math.min(Hh-1.5,z+7.4),'#eccb88');}}}
      for(let i=0;i<3;i++)for(let j=0;j<2;j++){const u=u0+.08+i*.13,v=v0+.08+j*.14;fp(g,[P(u,v,Hh+1),P(u+.1,v,Hh+1),P(u+.1,v+.1,Hh+2.5),P(u,v+.1,Hh+2.5)],'#2f4f73');}
    });
    Sc.o(1.02,(g,ng)=>{boxZ(g,cu0,cv0,cdu,cdv,0,ch,'#284b82',C.blue,C.blueD);
      for(let z=10;z<ch-4;z+=9)fL(g,cv0+cdv,cu0,cu0+cdu,z,z+1,'#3f6fb8');
      const L='POLICE';for(let i=0;i<L.length;i++){const p=P(cu0+.02,cv0+cdv,ch-10-i*5.5);RC(g,p[0]+1,p[1]-3,2,3,C.white);if(ng)RC(ng,p[0]+1,p[1]-3,2,3,'#eaf2ff');}
      fR(g,cu0+cdu,cv0+.04,cv0+cdv-.04,ch-6,ch-2,'#1f3f75');
      badge(g,P(cu0+.08,cv0+cdv,ch-5));
      const r=P(cu0+cdu/2,cv0+cdv/2,ch);RC(g,r[0],r[1]-2,1,2,'#8a939a');RC(g,r[0],r[1]-3,1,1,C.red);if(ng)RC(ng,r[0],r[1]-3,1,1,C.redN);});
    Sc.o(1.1,g=>{boxZ(g,.28,v1,.2,.08,8,1,'#cfe6ef','#9fc3d2','#7aa2b3');});
    Sc.o(1.3,g=>{boxZ(g,.08,.72,.08,.08,0,2,'#9c9a93','#bdbab2','#8f8c85');});tree(Sc,.12,.76,4,6,1.31,1134);
    Sc.o(1.32,g=>{boxZ(g,.22,.82,.08,.08,0,2,'#9c9a93','#bdbab2','#8f8c85');});tree(Sc,.26,.86,4,6,1.33,1135);
    bikes(Sc,.34,.64,3,.05,1.25);
    car(Sc,.555,.72,'v','tw',1.4,{bar:true});car(Sc,.7,.72,'v','tw',1.41);
    Sc.o(1.39,(g,ng)=>{for(const u of [.54,.69]){boxZ(g,u,.68,.02,.02,0,5,'#e9ecee','#f3f5f6','#c8ced2');const p=P(u,.7,4);RC(g,p[0],p[1],1,1,'#48c28e');if(ng)RC(ng,p[0],p[1],1,1,'#7dffcf');}});
  });
  // v4 屋頂直升機停機坪：寬厚四層方樓（格子窗）＋頂層藍帶警徽，屋頂抬高停機坪（黃圈白 H、邊燈）、樓梯出入口、風向袋；前方停車場巡邏車、柵欄入口
  const po4=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.pave);tiles(g,0,0,1,1,.125,C.paveJ);
    asphalt(g,.04,.74,.94,.24);stallsU(g,.3,.76,.66,.22,4);
    lotEdge(g);
    const u0=.08,v0=.08,du=.78,dv=.58,u1=u0+du,v1=v0+dv,Hh=36;
    Sc.sh(u0,v0,du,dv,Hh+2);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,du,dv,0,Hh,null,'#d9d4c8','#aea89b');
      fL(g,v1,u0,u1,0,1.5,'#8b877f');fR(g,u1,v0,v1,0,1.5,'#75716a');
      for(let f=0;f<3;f++){const z=10.5+f*7.5;winsL(g,ng,v1,u0+.02,u1-.02,9,z,z+4.5,3,C.win,C.lit,1141+f,.5,{gl:C.winGl});
        winsR(g,ng,u1,v0+.02,v1-.02,7,z,z+4.5,3,C.winD,C.lit,1144+f,.45,{gl:'#6f93ab'});}
      for(let t=u0+.1;t<u1-.05;t+=.087)fL(g,v1,t-.5/32,t+.5/32,9,32,'#c9c3b5');
      fL(g,v1,.36,.56,1.5,8,C.frame);fL(g,v1,.37,.55,1.5,7.5,'#6d98b3');fL(g,v1,.455,.465,1.5,7.5,C.frame);if(ng)fL(ng,v1,.37,.55,1.5,7.5,C.litW);
      winsL(g,ng,v1,u0+.03,.33,3,3,7,3,C.win,C.lit,1147,.6);winsL(g,ng,v1,.59,u1-.03,3,3,7,3,C.win,C.lit,1148,.6);
      winsR(g,ng,u1,v0+.03,v1-.03,5,3,7,3,C.winD,C.lit,1149,.5);
      fL(g,v1,u0,u1,Hh-3.5,Hh,C.blue);fR(g,u1,v0,v1,Hh-3.5,Hh,C.blueD);badge(g,P(.46,v1,Hh-1.8));
      quad(g,u0,v0,du,dv,'#e4e1d9',Hh);quad(g,u0+.03,v0+.03,du-.06,dv-.06,'#8f9496',Hh);
    });
    // 停機坪（鋼構抬高 2px、深灰坪面、黃圈白 H、邊燈）
    Sc.o(1.01,(g,ng)=>{const a=.2,b=.16,s=.52,t=.44;boxZ(g,a,b,s,t,Hh,2,'#50575c','#6e757a','#4a5055');
      const c=P(a+s/2,b+t/2,Hh+2);
      const ring=(rx,ry,col)=>{for(let k=0;k<64;k++){const an=k/64*Math.PI*2;RC(g,c[0]+Math.round(Math.cos(an)*rx),c[1]+Math.round(Math.sin(an)*ry),1,1,col);}};
      ring(11,5,'#e3bf3c');ring(10,5,'#e3bf3c');
      RC(g,c[0]-3,c[1]-2,1,5,'#f2f2ee');RC(g,c[0]+2,c[1]-2,1,5,'#f2f2ee');RC(g,c[0]-2,c[1],4,1,'#f2f2ee');
      for(const[pu,pv]of[[a,b],[a+s,b],[a+s,b+t],[a,b+t],[a+s/2,b+t],[a+s,b+t/2],[a+s/2,b],[a,b+t/2]]){const p=P(pu,pv,Hh+2);RC(g,p[0],p[1]-1,1,1,'#f0b43a');if(ng)RC(ng,p[0],p[1]-1,1,1,'#ffcf5a');}});
    Sc.o(1.02,(g,ng)=>{boxZ(g,.74,.1,.1,.12,Hh,6,'#d2cdc1','#dcd7cb','#b0aa9c');fL(g,.22,.765,.8,Hh,Hh+4.5,'#5d6770');if(ng)fL(ng,.22,.765,.8,Hh,Hh+4.5,'#e9cf8e');});
    Sc.t(1.03,g=>{const b=P(.84,.62,Hh),t=P(.84,.62,Hh+9);BL(g,b,t,'#8f989e');RC(g,t[0]+1,t[1],3,2,'#e8702a');RC(g,t[0]+2,t[1],1,2,'#f3f1ea');RC(g,t[0]+4,t[1]+1,1,1,'#e8702a');});
    flags3(Sc,.02,.7,.07,1.3,true);
    car(Sc,.33,.76,'v','tw',1.4,{bar:true});car(Sc,.49,.76,'v','tw',1.41);car(Sc,.65,.76,'v','civ',1.42);
    Sc.o(1.5,(g,ng)=>{boxZ(g,.12,.84,.08,.08,0,7,'#3f6fb8','#e9e7e0','#bdb9b0');fL(g,.92,.135,.185,3,6,'#6d98b3');fR(g,.2,.855,.9,3,6,'#4f7590');boxZ(g,.11,.83,.1,.1,7,1,'#2d5aa0','#3f71bd','#223f73');if(ng){fL(ng,.92,.135,.185,3,6,C.lit);fR(ng,.2,.855,.9,3,6,C.lit);}}); // 門口崗亭
  });

  const put=(name,fn)=>{try{fn();}catch(e){console.error('civic576 '+name,e);}};
  put('policeBox',()=>{const a=pb0();let b=a,c=a;try{b=pb1();}catch(e){console.error('civic576 policeBox v1',e);}try{c=pb2();}catch(e){console.error('civic576 policeBox v2',e);}
    for(const o of [a,b,c])o.civic576=1;S.policeBox=a;S.policeBoxVar576=[a,b,c];});
  put('police',()=>{const L=[po0,po1,po2,po3,po4],out=[];for(let i=0;i<5;i++){try{out[i]=L[i]();}catch(e){console.error('civic576 police v'+i,e);}}
    // noFlag525：本組已自帶地面旗桿；index.html T525 屋頂旗是固定座標疊圖（x42,y58–76），對新量體會浮在立面上，整合端可據此略過
    for(const o of out)if(o){o.civic576=1;o.noFlag525=1;}
    if(!Array.isArray(S.policeVar))S.policeVar=[];if(out[0])S.police=out[0];for(let i=1;i<5;i++)if(out[i])S.policeVar[i]=out[i];});
});
