// T576 civic_d3：水塔 k10（waterTower＋waterTowerVar[1..4]）／電廠 k5（plant＋plantVar[1..2]）重畫。
// 業主問題：舊圖是「小方塊架在細柱上、浮在灰地坪中央」。本批：主體落地（牆腳貼地、落影向右），
// 水塔的腳是真實結構（斜撐、混凝土基腳、落影）；電廠的煙囪與冷卻塔從地面長出來。
// 分層合成：立體件自成一層（二值化＋深色外框）；細線件（鋼腳、斜撐、欄杆、爬梯）走不描邊層，自帶明暗。
// 零亂數：只用 K.hsh。光從左：+v 面（左前）亮、+u 面（右前）暗；圓柱亮帶偏左；落影向右。
(window.__variants574=window.__variants574||[]).push(function civic_d3(A){
  const S=A.SPR();
  const ERR=(window.__civicD3Err=window.__civicD3Err||[]);

  // ================= 共用工具（依畫布尺寸建立） =================
  const LIB=(W,H,AX,AY)=>{
    const K=A.iso575(W,H,AX,AY,1),{P,hsh,TOPY}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    // 硬邊多邊形（像素中心取樣掃描線）
    const fp=(g,pts,c)=>{let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
      y0=Math.max(0,Math.floor(y0));y1=Math.min(H-1,Math.ceil(y1));g.fillStyle=c;const n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        xs.sort((p,q)=>p-q);
        for(let i=0;i+1<xs.length;i+=2){const xa=Math.ceil(xs[i]-.5),xb=Math.ceil(xs[i+1]-.5);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}}};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<900;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);
      return{u0,v0,u1,v1,z,h};};
    const quad=(g,u0,v0,du,dv,c,z=0)=>fp(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
    const fL=(g,v,ua,ub,z0,z1,c)=>fp(g,[P(ua,v,z0),P(ub,v,z0),P(ub,v,z1),P(ua,v,z1)],c);
    const fR=(g,u,va,vb,z0,z1,c)=>fp(g,[P(u,va,z0),P(u,vb,z0),P(u,vb,z1),P(u,va,z1)],c);
    // 像素橢圓：cx,cy 為中心（像素邊界座標），col 可為字串或 (nx,ny,x,y)=>色
    const ellF=(g,cx,cy,rx,ry,col)=>{if(!(rx>0&&ry>0))return;const x0=Math.floor(cx-rx),x1=Math.ceil(cx+rx),y0=Math.floor(cy-ry),y1=Math.ceil(cy+ry);
      for(let y=y0;y<y1;y++){const ny=(y+.5-cy)/ry;if(ny<-1||ny>1)continue;
        for(let x=x0;x<x1;x++){const nx=(x+.5-cx)/rx;if(nx*nx+ny*ny>1)continue;const c=typeof col==='function'?col(nx,ny,x,y):col;if(c){g.fillStyle=c;g.fillRect(x,y,1,1);}}}};
    const inE=(x,y,cx,cy,rx,ry)=>{const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry;return nx*nx+ny*ny<=1;};
    // 橢圓 1px 邊線；half='f' 只畫前半、'b' 只畫後半
    const ellB=(g,cx,cy,rx,ry,col,half)=>{const x0=Math.floor(cx-rx)-1,x1=Math.ceil(cx+rx)+1,y0=Math.floor(cy-ry)-1,y1=Math.ceil(cy+ry)+1;g.fillStyle=col;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){if(!inE(x,y,cx,cy,rx,ry))continue;
        if(inE(x+1,y,cx,cy,rx,ry)&&inE(x-1,y,cx,cy,rx,ry)&&inE(x,y+1,cx,cy,rx,ry)&&inE(x,y-1,cx,cy,rx,ry))continue;
        if(half==='f'&&y+.5<cy)continue;if(half==='b'&&y+.5>=cy)continue;g.fillRect(x,y,1,1);}};
    // 圓柱明暗帶：ramp[0]=高光…ramp[4]=最暗；光從左
    const band=nx=>nx<-.82?1:nx<-.46?0:nx<.06?1:nx<.42?2:nx<.76?3:4;
    // 迴轉體：z 由下往上逐層畫橢圓（後畫者＝較高者覆蓋＝正確的前表面）
    // bf(nx,x,z) 可回傳索引（查 ramp）或直接回傳色字串
    const rev=(g,cx,cyG,prof,z0,z1,ramp,bf)=>{const f=bf||band;for(let z=z0;z<=z1;z++){const r=prof(z);if(!(r>0))continue;ellF(g,cx,cyG-z,r,r/2,(nx,ny,x)=>{const k=f(nx,x,z);return typeof k==='string'?k:ramp[k];});}};
    const cyl=(g,cx,cyG,r,z0,z1,ramp,cap,bf)=>{rev(g,cx,cyG,()=>r,z0,z1,ramp,bf);if(cap)ellF(g,cx,cyG-z1,r,r/2,cap);};
    // 沿圓柱前表面畫一條水平環線（z 高、厚 t）：鋼箍、漆帶、焊縫
    const hoop=(g,cx,cyG,r,z,t,cols)=>{for(let x=Math.floor(cx-r);x<Math.ceil(cx+r);x++){const nx=(x+.5-cx)/r;if(nx<-1||nx>1)continue;const e=Math.sqrt(1-nx*nx)*r/2,y=Math.round(cyG-z+e-.5);
      const c=Array.isArray(cols)?cols[band(nx)]:cols;RC(g,x,y-t+1,1,t,c);}};
    // 球／扁球：逐像素法向光照（光從左上前）
    const sph=(g,cx,cy,rx,ry,ramp)=>{const L=[-.62,-.5,.6],ln=Math.hypot(L[0],L[1],L[2]);
      ellF(g,cx,cy,rx,ry,(nx,ny)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),d=(nx*L[0]+ny*L[1]+nz*L[2])/ln;return ramp[d>.9?0:d>.66?1:d>.34?2:d>.02?3:4];});};
    const specks=(g,u0,v0,du,dv,n,seed,cols)=>{for(let i=0;i<n;i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v,0);RC(g,p[0],p[1],hsh(seed,i,4)<.5?2:1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
    const tiles=(g,u0,v0,du,dv,step,c)=>{for(let u=u0+step;u<u0+du-.001;u+=step)BL(g,P(u,v0),P(u,v0+dv),c);for(let v=v0+step;v<v0+dv-.001;v+=step)BL(g,P(u0,v),P(u0+du,v),c);};
    const lotEdge=g=>{A.diaEdge(g,6,'#8a857b',AX,TOPY,32);A.diaEdge(g,9,'#d6d1c5',AX,TOPY,32);};

    // ---------- 場景：分層描邊＋落影＋夜光遮擋 ----------
    const SHK=.5,SHY=.13,SHCAP=44;          // 落影：高 z 的點投到地面向右 z*.5、向上 z*.13
    const shOff=z=>{const zz=Math.min(z,SHCAP);return[zz*SHK,-zz*SHY];};
    const scene=()=>{const items=[],SH=[];let n=0;
      const api={
        o:(d,fn)=>items.push({d,ol:1,fn,i:n++}),
        t:(d,fn)=>items.push({d,ol:0,fn,i:n++}),
        sh:fn=>SH.push(fn),
        shBox:(u0,v0,du,dv,h,z0=0)=>SH.push(m=>{const a=shOff(z0),b=shOff(z0+h);
          const F=[P(u0,v0),P(u0+du,v0),P(u0+du,v0+dv),P(u0,v0+dv)],B=F.map(p=>[p[0]+a[0],p[1]+a[1]]),T=F.map(p=>[p[0]+b[0],p[1]+b[1]]);
          fp(m,B,'#000');fp(m,T,'#000');for(let i=0;i<4;i++)fp(m,[B[i],B[(i+1)%4],T[(i+1)%4],T[i]],'#000');}),
        shCyl:(cx,cyG,r,z0,z1)=>SH.push(m=>{for(let z=z0;z<=z1;z++){const o=shOff(z);ellF(m,cx+o[0],cyG+o[1],r,r/2,'#000');}}),
        shLine:(a,za,b,zb,w=1)=>SH.push(m=>{const oa=shOff(za),ob=shOff(zb);for(let k=0;k<w;k++)BL(m,[a[0]+oa[0]+k,a[1]+oa[1]],[b[0]+ob[0]+k,b[1]+ob[1]],'#000');}),
        run(g,ng){
          if(SH.length){const[mc,mx]=A.cv(W,H);for(const f of SH)f(mx);K.hard(mc);
            const[tc,tx]=A.cv(W,H);tx.fillStyle='#18212b';tx.fillRect(0,0,W,H);tx.globalCompositeOperation='destination-in';tx.drawImage(mc,0,0);
            g.save();g.globalAlpha=.3;g.globalCompositeOperation='source-atop';g.drawImage(tc,0,0);g.restore();}
          items.sort((a,b)=>a.d-b.d||a.i-b.i);
          for(const it of items){const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);it.fn(sx,lx);K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
            g.drawImage(sc,0,0);ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
        }};
      return api;};
    const sprite=(draw,ex={})=>{const{c,g,nc,ng}=K.canvases();const Sc=scene();draw(g,ng,Sc);Sc.run(g,ng);
      ng.save();ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.restore();      // 夜光只落在本體不透明區
      const[sc]=A.cv(W,H);const o=K.finish(c,g,sc,nc,{fence:false,smoke:ex.smoke||[]});
      if(ex.lamp)o.lamp=ex.lamp;o.civic576=1;return o;};
    return{K,P,hsh,TOPY,W,H,AX,AY,RC,fp,BL,boxZ,quad,fL,fR,ellF,ellB,inE,band,rev,cyl,hoop,sph,specks,tiles,lotEdge,shOff,scene,sprite};
  };

  // ================= 色票 =================
  const C={
    grass:'#78a256',grassD:'#6a934b',grassH:'#88b265',
    grav:'#bdb7a8',gravD:'#aaa494',gravH:'#cec9bc',
    pave:'#c9c5bb',paveJ:'#b8b3a8',asph:'#6f6d69',asphE:'#8d8a84',mark:'#e6e2d6',
    conc:['#e2ded4','#d2cdc2','#bdb8ac','#a19c91','#86827a'],
    hedge:'#4f8a3e',hedgeL:'#62a04c',hedgeD:'#3f7132',trunk:'#6b4a33',
    lit:'#ffe3a2',litW:'#fff1c8',red:'#d4382c',redN:'#ff5a46',
    steelL:'#b4c1ca',steel:'#8d9ca7',steelD:'#66737d',steelDD:'#4c565e',
  };

  // ================= 共用小件 =================
  const PARTS=L=>{const{P,hsh,RC,BL,boxZ,fL,fR,ellF}=L;
    const tree=(Sc,u,v,r,h,d,seed=1,pal)=>{const q=pal||['#3f7331','#548c3f','#6ea84f','#8cc063'];
      Sc.shCyl(P(u,v)[0],P(u,v)[1],r*.8,h,h+r*1.6);
      Sc.o(d,g=>{const b=P(u,v,0);RC(g,b[0]-1,b[1]-h,2,h+1,C.trunk);RC(g,b[0],b[1]-h,1,h+1,'#523726');
        const cx=b[0],cy=b[1]-h-r+1;ellF(g,cx+.5,cy+.5,r+.5,r+.5,q[0]);ellF(g,cx-.5,cy-.5,r-.5,r-.5,q[1]);ellF(g,cx-1.5,cy-1.5,Math.max(1,r-2.5),Math.max(1,r-2.5),q[2]);
        for(let i=0;i<4;i++){RC(g,cx-r+1+((hsh(seed,i,1)*(2*r-2))|0),cy-r+2+((hsh(seed,i,2)*(2*r-2))|0),1,1,hsh(seed,i,3)<.5?q[3]:q[0]);}});};
    const shrub=(Sc,u,v,d,c=C.hedge)=>{Sc.o(d,g=>{const b=P(u,v,0);ellF(g,b[0]+.5,b[1]-1.5,2.5,2,c);RC(g,b[0]-1,b[1]-3,2,1,C.hedgeL);});};
    const hedge=(Sc,u0,v0,du,dv,h,d)=>{Sc.shBox(u0,v0,du,dv,h);Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,0,h,C.hedgeL,C.hedge,C.hedgeD);
      for(let i=0;i<Math.round((du+dv)*14);i++){const u=u0+hsh(u0*97|0,i,1)*du,v=v0+hsh(v0*89|0,i,2)*dv,p=P(u,v,h);RC(g,p[0],p[1],1,1,'#79b35c');}});};
    // 車：dir='u' 沿 u 停、'v' 沿 v 停
    const car=(Sc,u0,v0,dir,d,col,o={})=>{const Lg=o.len||.22,Wd=.10,du=dir==='u'?Lg:Wd,dv=dir==='u'?Wd:Lg;Sc.shBox(u0,v0,du,dv,6);
      Sc.o(d,(g,ng)=>{const b=col||['#c9cfd6','#dfe4e8','#9ea7b0'];
        boxZ(g,u0,v0,du,dv,1,3,b[0],b[1],b[2]);
        if(dir==='u'){fL(g,v0+dv,u0+.03,u0+.07,0,1.2,'#23262a');fL(g,v0+dv,u0+du-.07,u0+du-.03,0,1.2,'#23262a');fR(g,u0+du,v0+.02,v0+.05,0,1.2,'#23262a');}
        else{fR(g,u0+du,v0+.03,v0+.07,0,1.2,'#23262a');fR(g,u0+du,v0+dv-.07,v0+dv-.03,0,1.2,'#23262a');fL(g,v0+dv,u0+.02,u0+.05,0,1.2,'#23262a');}
        if(o.van){const cu=dir==='u'?u0+.02:u0+.01,cv=dir==='u'?v0+.01:v0+.02;boxZ(g,cu,cv,dir==='u'?du-.06:du-.02,dir==='u'?dv-.02:dv-.06,4,3,b[0],b[1],b[2]);
          if(dir==='u'){fR(g,u0+du-.04,v0+.015,v0+dv-.015,4.5,6.5,'#3d5566');fL(g,v0+dv-.01,u0+du-.1,u0+du-.05,4.5,6.5,'#4d6a7e');}
          else{fL(g,v0+dv-.04,u0+.015,u0+du-.015,4.5,6.5,'#4d6a7e');fR(g,u0+du-.01,v0+dv-.1,v0+dv-.05,4.5,6.5,'#3d5566');}
          if(o.stripe){if(dir==='u')fL(g,v0+dv,u0,u0+du,2.5,3.5,o.stripe);else fR(g,u0+du,v0,v0+dv,2.5,3.5,o.stripe);}}
        else{const cu=dir==='u'?u0+.05:u0+.015,cv=dir==='u'?v0+.015:v0+.06,cdu=dir==='u'?du-.1:du-.03,cdv=dir==='u'?dv-.03:dv-.11;boxZ(g,cu,cv,cdu,cdv,4,2,b[0],'#3d5566','#2e3e4b');}
      });};
    const lamp=(Sc,u,v,h,d)=>{Sc.t(d,(g,ng)=>{const b=P(u,v,0),t=P(u,v,h);RC(g,b[0]-1,b[1]-1,3,2,'#4a5157');BL(g,b,t,'#6d767d');BL(g,[b[0]+1,b[1]],[t[0]+1,t[1]],'#40474d');RC(g,t[0]-1,t[1]-2,4,2,'#2f353a');RC(g,t[0]-1,t[1]-1,4,1,'#f1e6c2');if(ng)RC(ng,t[0]-1,t[1]-1,4,1,'#ffe7b0');});};
    // 爬梯：兩條側軌＋每 2 列一檔
    const ladder=(g,x,yTop,yBot,c='#59636b',cr='#8c979f')=>{for(let y=yTop;y<=yBot;y++){RC(g,x,y,1,1,c);RC(g,x+2,y,1,1,c);if((y-yTop)%2===0)RC(g,x+1,y,1,1,cr);}};
    return{tree,shrub,hedge,car,lamp,ladder};
  };

  // ================================================================
  // 水塔 k10：72×112，錨點 36,110
  // ================================================================
  const WT=LIB(72,112,36,110),WP=PARTS(WT);
  const TANK=['#f4f9fb','#d9e9f1','#b3cedd','#86a8bb','#61849a'];      // 淺藍鋼板
  const ROOF=['#e6edf1','#c8d6de','#a3b6c2','#7e93a1','#5f7380'];

  // v0 經典四腳鋼製水塔：圓柱水槽＋橢圓底＋錐頂、四支斜腳落在混凝土基腳、X 形拉桿與橫撐、中央立管與閥室、
  //    步道欄杆環、立面爬梯；碎石場地、綠籬、維修車
  // T576 退件重做 v0：四支主腳 2px（亮暗各 1px）走描邊層，落在加大的混凝土墩上，墩各帶接地影；
  //    每立面兩層 X 撐＋腰撐，比主腳深一階、不描邊；腳架轉 15°，前腳、立管、爬梯都不落在畫面中線；
  //    描邊完整的閥室放在腳架下方正中，2px 立管從閥室頂接到槽底；爬梯沿右前腳上到步道，再沿槽壁上到頂。
  const wt0=()=>{const L=WT,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,specks,tiles,lotEdge}=L;
    return L.sprite((g,ng,Sc)=>{
      A.dia(g,L.AX,L.TOPY,32,C.grass);specks(g,0,0,1,1,40,1001,[C.grassD,C.grassH]);
      quad(g,.05,.05,.9,.9,C.grav);specks(g,.05,.05,.9,.9,46,1002,[C.gravD,C.gravH]);
      const cu=.47,cv=.47,hs=.09;                                              // 腳架中心；閥室半寬
      const du=.03;                                                            // 門與步道往右偏，避開左腳墩
      quad(g,cu+du-.045,cv+hs,.09,1-cv-hs,C.pave);tiles(g,cu+du-.045,cv+hs,.09,1-cv-hs,.1,C.paveJ);   // 步道：前緣到閥室門
      lotEdge(g);
      const cp=P(cu,cv),cx=Math.round(cp[0]),cyG=Math.round(cp[1]);
      const Zb=34,R=13,RB=.38,RT=.25,ZF=4,topY=cyG-Zb;
      // 腳：0 右前、1 左、2 左後、3 右（繞中心轉 15°）
      const ang=[0,1,2,3].map(k=>Math.PI/12+k*Math.PI/2);
      const foot=ang.map(a=>[cu+RB*Math.cos(a),cv+RB*Math.sin(a)]);
      const head=ang.map(a=>[cu+RT*Math.cos(a),cv+RT*Math.sin(a)]);
      const at=(i,z)=>{const t=(z-ZF)/(Zb-ZF);return P(foot[i][0]+(head[i][0]-foot[i][0])*t,foot[i][1]+(head[i][1]-foot[i][1])*t,z);};
      const legY=i=>[Math.round(at(i,Zb)[1]),Math.round(at(i,ZF)[1])];
      const legX=(i,y)=>{const a=at(i,Zb),b=at(i,ZF);return Math.round(a[0]+(b[0]-a[0])*(y+.5-a[1])/(b[1]-a[1])-1);};   // 2px 腳的左像素
      const leg=(g,i,cl,cd)=>{const[y0,y1]=legY(i);for(let y=y0;y<=y1;y++){const x=legX(i,y);RC(g,x,y,1,1,cl);RC(g,x+1,y,1,1,cd);}
        RC(g,legX(i,y1)-1,y1,4,1,'#4f5961');};                                  // 底板
      const ZT=[ZF,16,28];
      const brace=(g,i,j,c)=>{for(let k=0;k<2;k++){BL(g,at(i,ZT[k]),at(j,ZT[k+1]),c);BL(g,at(j,ZT[k]),at(i,ZT[k+1]),c);}
        BL(g,at(i,ZT[1]),at(j,ZT[1]),c);BL(g,at(i,ZT[2]),at(j,ZT[2]),c);};
      // 落影：墩的接地影＋墩＋腳、閥室、立管、水槽
      for(let i=0;i<4;i++){const f=foot[i];Sc.sh(m=>quad(m,f[0]-.08,f[1]-.08,.16,.16,'#000'));Sc.shBox(f[0]-.055,f[1]-.055,.11,.11,ZF);
        Sc.shLine(P(f[0],f[1]),ZF,P(head[i][0],head[i][1]),Zb,2);}
      Sc.shBox(cu-hs,cv-hs,2*hs,2*hs,8);Sc.shLine([cx-1,cyG],8,[cx-1,cyG],Zb,2);
      Sc.shCyl(cx,cyG,R,Zb-6,Zb+19);
      // 混凝土墩（加大，描邊）
      const pier=(i,d)=>Sc.o(d,g=>{const f=foot[i];boxZ(g,f[0]-.055,f[1]-.055,.11,.11,0,ZF,C.conc[0],C.conc[1],C.conc[3]);
        fL(g,f[1]+.055,f[0]-.055,f[0]+.055,0,1,C.conc[2]);fR(g,f[0]+.055,f[1]-.055,f[1]+.055,0,1,C.conc[4]);});
      // 後兩面：墩→斜撐（深、不描邊）→後腳（描邊）
      pier(2,1.0);pier(3,1.0);
      Sc.t(1.01,g=>{brace(g,1,2,'#56616a');brace(g,2,3,'#4f5a63');});
      Sc.o(1.02,g=>{leg(g,2,'#9aa7b0','#69757f');leg(g,3,'#9aa7b0','#69757f');});
      // 步道後半欄杆（會被水槽蓋掉中段）
      Sc.t(1.045,g=>{ellB(g,cx,topY-4,R+2,(R+2)/2,'#56616a','b');for(const t of [-1,-.6,-.2,.2,.6,1]){const x=Math.round(cx+t*(R+1.5));RC(g,x,topY-4-Math.round(Math.sqrt(Math.max(0,1-t*t))*(R+2)/2),1,4,'#56616a');}});
      // 前兩面：墩→斜撐（不描邊）
      pier(1,1.05);pier(0,1.05);
      Sc.t(1.06,g=>{brace(g,0,1,'#66727c');brace(g,3,0,'#5d6973');});
      // 閥室（腳架正下方，紅磚＋深色屋面，描邊完整：畫在斜撐之上，視線落點不被細線切碎）
      Sc.o(1.065,(g,ng)=>{const u0=cu-hs,v0=cv-hs,d=2*hs,H=8,u1=u0+d,v1=v0+d;
        boxZ(g,u0,v0,d,d,0,H,'#6f767d','#b86a4f','#8e4a38');
        for(let z=2;z<H-1;z+=2){fL(g,v1,u0,u1,z,z+.6,'#a65c44');fR(g,u1,v0,v1,z,z+.6,'#7f412f');}    // 磚縫
        fL(g,v1,u0,u1,0,1,'#8a8378');fR(g,u1,v0,v1,0,1,'#6e685f');                                 // 勒腳
        fL(g,v1,u0,u1,H-1,H,'#e2ddd2');fR(g,u1,v0,v1,H-1,H,'#b7b1a6');                               // 混凝土簷口
        fL(g,v1,cu+du-.035,cu+du+.035,0,5.5,'#3e4f5c');fL(g,v1,cu+du-.022,cu+du+.022,.5,5,'#5f7584');  // 鋼門
        fR(g,u1,cv-.05,cv+.03,3,5.5,'#3a4b58');RC(g,...P(u1,cv-.01,5.5).map(Math.round),1,1,'#8aa3b5');if(ng)fR(ng,u1,cv-.05,cv+.03,3,5.5,C.lit);   // 側窗
        const lp=P(cu+du,v1,6.8),lx=Math.round(lp[0])-1,ly=Math.round(lp[1])-1;RC(g,lx,ly,2,1,'#f0d890');if(ng)RC(ng,lx,ly,2,2,'#ffe7b0');});
      // 中央立管 2px（亮暗各 1px），閥室頂法蘭＋槽底法蘭
      Sc.o(1.066,g=>{for(let y=topY-2;y<=cyG-9;y++){RC(g,cx-1,y,1,1,'#aab7c0');RC(g,cx,y,1,1,'#66727c');}
        RC(g,cx-2,cyG-9,4,1,'#59636b');RC(g,cx-2,topY+10,4,1,'#59636b');});
      // 前腳（描邊）
      Sc.o(1.07,g=>{leg(g,1,'#b4c1ca','#7f8c96');leg(g,0,'#b4c1ca','#7f8c96');});
      Sc.t(1.075,g=>{const[y0,y1]=legY(0);for(let y=y0;y<y1;y++){const x=legX(0,y);RC(g,x+3,y,1,1,'#454f57');if((y-y0)%3===1)RC(g,x+2,y,1,1,'#9aa6ae');}});
      // 水槽：橢圓底→步道板→圓柱→錐頂（蓋住腳頂＝腳接進槽底環梁）
      Sc.o(1.08,(g,ng)=>{
        rev(g,cx,cyG,z=>{const t=(Zb-z)/6;return t>1?0:R*Math.sqrt(1-t*t);},Zb-6,Zb,TANK);
        ellF(g,cx,topY+1,R+2,(R+2)/2,'#6b767e');ellF(g,cx,topY,R+2,(R+2)/2,'#9aa6ae');
        cyl(g,cx,cyG,R,Zb,Zb+13,TANK);
        rev(g,cx,cyG,z=>(R+1)*(1-(z-Zb-13)/7),Zb+13,Zb+19,ROOF);
        ellB(g,cx,cyG-Zb-13,R+1,(R+1)/2,'#6d7f8b','f');
        // 漆帶＋水滴徽
        for(let x=cx-R;x<cx+R;x++){const nx=(x+.5-cx)/R,e=Math.sqrt(Math.max(0,1-nx*nx))*R/2,y=Math.round(cyG-Zb-6+e);RC(g,x,y,1,2,nx<.1?'#3f79b2':nx<.5?'#346a9f':'#2a5683');}
        const dx=cx-5,dy=cyG-Zb-9;RC(g,dx,dy-3,1,1,'#2f6fb3');RC(g,dx-1,dy-2,3,1,'#2f6fb3');RC(g,dx-1,dy-1,3,2,'#2f6fb3');RC(g,dx-1,dy-1,1,1,'#bfe0f5');
        // 頂部尖頂＋航空警示燈
        const ap=cyG-Zb-19;RC(g,cx-1,ap-3,2,3,'#6d7f8b');RC(g,cx-1,ap-4,2,1,C.red);if(ng)RC(ng,cx-1,ap-4,2,1,C.redN);
      });
      // 步道前半欄杆＋槽壁爬梯（接右前腳的爬梯）
      Sc.t(1.09,g=>{ellB(g,cx,topY-4,R+2,(R+2)/2,'#4b555d','f');for(const t of [-1,-.7,-.35,0,.35,.7,1]){const x=Math.round(cx+t*(R+1.5)),y=topY-4+Math.round(Math.sqrt(Math.max(0,1-t*t))*(R+2)/2);RC(g,x,y,1,4,'#4b555d');}
        WP.ladder(g,cx+6,cyG-Zb-12,topY-1,'#4f5961','#7d8991');});
      // 場地：綠籬、樹、維修車、告示牌、灌木
      WP.tree(Sc,.08,.76,3,6,1.3,1004);WP.hedge(Sc,.06,.93,.24,.05,2,1.5);                        // 左角：樹＋綠籬
      WP.tree(Sc,.9,.2,4,6,1.2,1003);                                                           // 右角：樹
      WP.hedge(Sc,.93,.7,.05,.25,2,1.5);
      Sc.o(1.5,g=>{const p=P(.68,.97),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-5,1,5,'#59636b');RC(g,x-2,y-9,5,4,'#2f6fb3');RC(g,x-1,y-8,3,1,'#dfe9f2');RC(g,x-1,y-6,2,1,'#9cc0e0');});   // 水務告示牌
    });};

  // v1 單柱球形水塔：混凝土圓形基座＋粗鋼柱身＋錐形喇叭口承托扁球水槽（赤道漆帶、頂部小欄杆與警示燈）；
  //    柱腳入口門、旁邊紅磚泵房（門燈、百葉窗、屋頂風機）、鋪面廣場、停車、綠籬
  const wt1=()=>{const L=WT,{P,RC,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,sph,specks,tiles,lotEdge}=L;
    return L.sprite((g,ng,Sc)=>{
      A.dia(g,L.AX,L.TOPY,32,C.grass);specks(g,0,0,1,1,40,1101,[C.grassD,C.grassH]);
      quad(g,.08,.08,.7,.7,C.pave);tiles(g,.08,.08,.7,.7,.14,C.paveJ);
      quad(g,.08,.8,.4,.18,C.asphE);quad(g,.095,.815,.37,.15,C.asph);for(const u of [.22,.34])L.BL(g,P(u,.82),P(u,.96),C.mark);   // 訪客停車
      lotEdge(g);
      const cp=P(.4,.4),cx=Math.round(cp[0]),cyG=Math.round(cp[1]);
      const Zs=45,rx=15,ry=13;
      Sc.shCyl(cx,cyG,11,0,4);Sc.shLine([cx-3,cyG],0,[cx-3,cyG-34],34,7);Sc.shCyl(cx,cyG,rx,Zs-8,Zs+8);
      // 基座＋柱身＋喇叭口＋球
      Sc.o(1.0,(g,ng)=>{
        cyl(g,cx,cyG,11,0,2,C.conc,C.conc[2]);cyl(g,cx,cyG,8,2,4,C.conc,C.conc[1]);
        cyl(g,cx,cyG,5,4,27,TANK);
        rev(g,cx,cyG,z=>5+(z-27)*5/8,27,35,ROOF);
        // 柱腳入口門＋門燈
        RC(g,cx-4,cyG-10,3,6,'#4a5a66');RC(g,cx-4,cyG-10,3,1,'#33414b');RC(g,cx-3,cyG-12,1,1,'#f0d890');if(ng){RC(ng,cx-3,cyG-12,1,2,'#ffe7b0');}
        const cy=cyG-Zs;sph(g,cx,cy,rx,ry,TANK);
        // 赤道漆帶（前半）
        for(let x=cx-rx;x<cx+rx;x++){const nx=(x+.5-cx)/rx,e=Math.sqrt(Math.max(0,1-nx*nx));const y=Math.round(cy+e*rx*.42);const c=nx<-.3?'#3f79b2':nx<.4?'#346a9f':'#2a5683';RC(g,x,y,1,2,c);}
        // 頂部：檢修口小欄杆＋通氣帽＋警示燈
        ellB(g,cx,cy-ry+3,5,2.5,'#7b8e9b');RC(g,cx-1,cy-ry-1,2,2,'#8fa3b0');RC(g,cx-1,cy-ry-2,2,1,C.red);if(ng)RC(ng,cx-1,cy-ry-2,2,1,C.redN);
      });
      // 泵房（紅磚、平頂女兒牆）
      const pu=.63,pv=.44,pdu=.32,pdv=.36,ph=11;Sc.shBox(pu,pv,pdu,pdv,ph);
      Sc.o(1.1,(g,ng)=>{const u1=pu+pdu,v1=pv+pdv;boxZ(g,pu,pv,pdu,pdv,0,ph,'#8f8a84','#b5553e','#8a3e2e');
        for(let z=2;z<ph-1;z+=2){L.BL(g,P(pu,v1,z),P(u1,v1,z),'#a44b36');L.BL(g,P(u1,pv,z),P(u1,v1,z),'#7c3628');}
        fL(g,v1,pu,u1,0,1,'#cfc8b7');fR(g,u1,pv,v1,0,1,'#a79f8d');fL(g,v1,pu,u1,ph-1,ph,'#e2dccd');fR(g,u1,pv,v1,ph-1,ph,'#bdb5a3');
        quad(g,pu+.03,pv+.03,pdu-.06,pdv-.06,'#77726c',ph);
        fL(g,v1,pu+.05,pu+.13,0,6.5,'#4c5963');fL(g,v1,pu+.06,pu+.12,.5,6,'#6d7f8c');                 // 鋼門
        fL(g,v1,pu+.18,pu+.26,3,6.5,'#e2dccd');fL(g,v1,pu+.19,pu+.25,3.5,6,'#4d6272');for(let z=4;z<6;z+=1)fL(g,v1,pu+.19,pu+.25,z,z+.4,'#6f8595');   // 百葉窗
        fR(g,u1,pv+.06,pv+.14,3,6.5,'#c3baa8');fR(g,u1,pv+.07,pv+.13,3.5,6,'#3f5261');if(ng)fR(ng,u1,pv+.07,pv+.13,3.5,6,C.lit);
        const lp=P(pu+.09,v1,7.5);RC(g,lp[0],lp[1]-1,2,1,'#f0d890');if(ng)RC(ng,lp[0]-1,lp[1]-1,3,2,'#ffe7b0');
        boxZ(g,pu+.1,pv+.1,.08,.08,ph,3,'#aeb5b9','#c5cbce','#949b9f');const f=P(pu+.14,pv+.14,ph+3);RC(g,f[0]-1,f[1],2,1,'#6b7378');});
      // 泵房接到基座的管線
      Sc.o(1.05,g=>{const a=P(.58,.5,2),b=P(.63,.5,2);RC(g,Math.round(a[0]),Math.round(a[1])-2,Math.round(b[0]-a[0])+1,2,'#3d6f9e');RC(g,Math.round(a[0])+1,Math.round(a[1])-3,1,3,'#2a5683');});
      WP.car(Sc,.12,.84,'u',1.52,['#b54a3c','#c65a4a','#8e392e']);
      WP.hedge(Sc,.56,.94,.4,.04,2,1.55);
      WP.tree(Sc,.08,.66,4,5,1.3,1102);WP.tree(Sc,.88,.12,4,6,0.9,1103);WP.shrub(Sc,.52,.88,1.5);WP.shrub(Sc,.08,.5,1.2);WP.shrub(Sc,.5,.78,1.45);
    });};

  // v2 混凝土高腳杯水塔：素混凝土圓柱筒身（樓梯間窄窗）＋倒錐杯底＋肋條杯壁（觀景窗帶）＋平頂女兒牆與機房天線；
  //    筒腳玻璃入口亭、廣場鋪面、長椅、行道樹、停車
  const CONC2=['#eeebe4','#dcd8cf','#c4c0b6','#a39f96','#85817a'];
  const CUP=['#b9b5ac','#a8a49b','#96928a','#7f7b74','#67645e'];
  const wt2=()=>{const L=WT,{P,RC,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks,tiles,lotEdge}=L;
    return L.sprite((g,ng,Sc)=>{
      A.dia(g,L.AX,L.TOPY,32,'#cdc8bb');tiles(g,0,0,1,1,.1,'#bfbaad');specks(g,0,0,1,1,20,1201,['#dad5c9','#b9b3a6']);
      quad(g,0,.7,.3,.3,C.grass);quad(g,.66,.72,.34,.28,C.grass);specks(g,0,.7,.3,.3,8,1202,[C.grassD,C.grassH]);specks(g,.66,.72,.34,.28,10,1203,[C.grassD,C.grassH]);
      quad(g,.7,.04,.28,.62,C.asphE);quad(g,.715,.055,.25,.59,C.asph);for(const v of [.2,.34,.48])L.BL(g,P(.72,v),P(.96,v),C.mark);
      lotEdge(g);
      const cp=P(.42,.42),cx=Math.round(cp[0]),cyG=Math.round(cp[1]);
      const Zc=30,Zw=42,Zt=51,R=16;
      Sc.shCyl(cx,cyG,12,0,7);Sc.shLine([cx-3,cyG],0,[cx-3,cyG-Zc],Zc,7);Sc.shCyl(cx,cyG,R,Zw-4,Zt);
      const rib=(nx,x)=>{const k=L.band(nx);return ((x-cx)&3)===0?Math.min(4,k+1):k;};
      Sc.o(1.0,(g,ng)=>{
        // 圓形基座館：勒腳、玻璃帶窗、簷口、入口門
        cyl(g,cx,cyG,12,0,7,CONC2);cyl(g,cx,cyG,12,0,1,C.conc);
        for(let x=cx-11;x<cx+11;x++){const nx=(x+.5-cx)/12,e=Math.sqrt(Math.max(0,1-nx*nx))*6,y=Math.round(cyG-5+e-.5);if((x-cx+40)%4===3)continue;
          RC(g,x,y,1,3,nx<.2?'#5d7f98':'#4a667b');if(ng&&L.hsh(1208,x,2)<.6)RC(ng,x,y,1,3,C.lit);}
        {const x=cx-6,y=Math.round(cyG+Math.sqrt(1-.25)*6-7);RC(g,x-1,y,4,6,'#39434d');RC(g,x,y+1,2,5,'#8db6cc');if(ng)RC(ng,x,y+1,2,5,C.litW);}
        ellF(g,cx,cyG-7,12,6,'#d9d5cc');ellF(g,cx,cyG-7,10.5,5.25,'#9a9d9e');
        cyl(g,cx,cyG,5,7,Zc,CONC2);
        for(let z=11;z<Zc-2;z+=5){RC(g,cx-2,cyG-z-2,1,2,'#56606a');if(ng&&z%10===1)RC(ng,cx-2,cyG-z-2,1,2,C.lit);}    // 樓梯間窄窗
        rev(g,cx,cyG,z=>5+(z-Zc)*(R-5)/(Zw-Zc),Zc,Zw,CUP);
        cyl(g,cx,cyG,R,Zw,Zt,CONC2,null,rib);
        hoop(g,cx,cyG,R,Zw+1,1,['#9d998f','#9d998f','#8c887f','#77736c','#65625c']);
        // 觀景窗帶
        for(let x=cx-R+1;x<cx+R-1;x+=3){const nx=(x+1-cx)/R,e=Math.sqrt(Math.max(0,1-nx*nx))*R/2,y=Math.round(cyG-Zt+4+e);RC(g,x,y,2,2,nx<.3?'#4e6e86':'#3d586c');if(ng&&L.hsh(1204,x,1)<.5)RC(ng,x,y,2,2,C.lit);}
        // 平頂：女兒牆＋屋面＋機房＋天線
        ellF(g,cx,cyG-Zt,R,R/2,'#e6e3dc');ellF(g,cx,cyG-Zt,R-1.5,(R-1.5)/2,'#8e9193');
        cyl(g,cx+1,cyG-Zt+1,4,0,4,CONC2,CONC2[1]);
        RC(g,cx+7,cyG-Zt-9,1,8,'#6e777e');RC(g,cx+6,cyG-Zt-7,3,1,'#6e777e');RC(g,cx+7,cyG-Zt-10,1,1,C.red);if(ng)RC(ng,cx+7,cyG-Zt-10,1,1,C.redN);
      });
      // 長椅、樹、車
      Sc.o(1.3,g=>{boxZ(g,.1,.66,.14,.03,1,1,'#9a6a44','#a8774e','#7d5638');});
      WP.tree(Sc,.12,.86,4,6,1.45,1205);WP.tree(Sc,.93,.74,4,6,1.45,1206);WP.shrub(Sc,.7,.8,1.4);WP.shrub(Sc,.3,.8,1.4);
      WP.car(Sc,.74,.215,'u',1.2,['#4a78a8','#5b8bbd','#3a5f86']);WP.car(Sc,.74,.355,'u',1.21,['#e0dccf','#ece8dc','#bab5a8']);
    });};

  // v3 紐約式木桶水塔：三層紅磚泵站（拱窗、石材勒腳、檐口）屋頂上的鋼架＋雪松木桶（木條、鋼箍）＋錐形尖頂；
  //    屋頂檢修出入口、爬梯；人行道、花台、單車
  const WOOD=['#dcae7e','#c4905f','#a8754b','#875c3b','#68462e'];
  const wt3=()=>{const L=WT,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks,tiles,lotEdge}=L;
    return L.sprite((g,ng,Sc)=>{
      A.dia(g,L.AX,L.TOPY,32,C.pave);tiles(g,0,0,1,1,.125,C.paveJ);specks(g,0,0,1,1,20,1301,['#d5d1c7','#b9b4a8']);
      quad(g,.84,.08,.16,.6,C.grass);specks(g,.84,.08,.16,.6,8,1302,[C.grassD,C.grassH]);
      lotEdge(g);
      const u0=.08,v0=.1,du=.74,dv=.62,u1=u0+du,v1=v0+dv,Hh=22;
      const brL='#b5553e',brR='#8a3e2e',stone='#d8d1c0',stoneR='#b0a893';
      Sc.shBox(u0,v0,du,dv,Hh);
      Sc.o(1.0,(g,ng)=>{boxZ(g,u0,v0,du,dv,0,Hh,null,brL,brR);
        for(let z=4;z<Hh-2;z+=2){BL(g,P(u0,v1,z),P(u1,v1,z),'#a44b36');BL(g,P(u1,v0,z),P(u1,v1,z),'#7c3628');}
        fL(g,v1,u0,u1,0,2.5,stone);fR(g,u1,v0,v1,0,2.5,stoneR);                              // 石材勒腳
        fL(g,v1,u0,u1,Hh-2,Hh,stone);fR(g,u1,v0,v1,Hh-2,Hh,stoneR);fL(g,v1,u0,u1,Hh-3,Hh-2.4,'#7a3a2a');   // 檐口
        quad(g,u0,v0,du,dv,'#d0c9b8',Hh);quad(g,u0+.03,v0+.03,du-.06,dv-.06,'#7f7a74',Hh);
        // 拱窗（左面兩層）
        const arch=(F,v,t,z0,z1,w,c,lit,seed)=>{const a=t-w/64,b=t+w/64;F(g,v,a,b,z0,z1-1,c);F(g,v,a+1/32,b-1/32,z1-1,z1,c);F(g,v,a,b,z0-1,z0,stone);
          if(ng&&L.hsh(seed,Math.round(t*100),z0|0)<.55)F(ng,v,a,b,z0,z1-1,lit);};
        for(const t of [.15,.25,.35,.62,.72]){arch(fL,v1,t,12,18,3,'#3f5568',C.lit,1303);}
        for(const t of [.15,.25,.35]){arch(fL,v1,t,4,9,3,'#3f5568',C.lit,1304);}
        for(const t of [.2,.32,.44,.56]){arch(fR,u1,t,12,18,3,'#33485a','#f0cf8c',1305);arch(fR,u1,t,4,9,3,'#33485a','#f0cf8c',1306);}
        // 大拱門（泵房設備門）＋小門＋門燈＋銘牌
        fL(g,v1,.47,.6,2.5,9,stone);fL(g,v1,.485,.585,2.5,8,'#5a4636');fL(g,v1,.495,.575,8,9,'#5a4636');for(let z=3.5;z<8;z+=1.5)fL(g,v1,.49,.58,z,z+.5,'#4a392c');
        fL(g,v1,.66,.72,2.5,8,'#3f332a');const lp=P(.69,v1,9.5);RC(g,lp[0],lp[1]-1,2,1,'#f0d890');if(ng)RC(ng,lp[0]-1,lp[1]-1,3,2,'#ffe7b0');
        fL(g,v1,.45,.62,10.2,11.4,'#e9e2cf');for(const t of [.48,.51,.54,.57])fL(g,v1,t,t+.012,10.5,11,'#3b3b3b');
      });
      // 屋頂：檢修出入口
      Sc.o(1.01,(g,ng)=>{boxZ(g,.64,.16,.12,.12,Hh,5,'#9a948c','#b3aca2','#8b857c');fL(g,.28,.67,.72,Hh,Hh+4,'#5a4a3c');});
      // 鋼架＋木桶
      const tu=.42,tv=.4,tp=P(tu,tv),cx=Math.round(tp[0]),cyG=Math.round(tp[1]),Zf=Hh+6,R=10,Zt=Zf+13;
      const legs=[[tu-.15,tv-.15],[tu+.15,tv-.15],[tu+.15,tv+.15],[tu-.15,tv+.15]].map(f=>[P(f[0],f[1],Hh),P(f[0],f[1],Zf)]);
      Sc.t(1.02,g=>{for(const i of [0,1,3]){const[a,b]=legs[i];BL(g,a,b,'#4b555d');BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],'#333a40');}
        BL(g,legs[3][0],legs[2][1],'#59636b');BL(g,legs[2][0],legs[3][1],'#59636b');BL(g,legs[2][0],legs[1][1],'#454e55');BL(g,legs[1][0],legs[2][1],'#454e55');
        const[a,b]=legs[2];BL(g,a,b,'#59636b');BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],'#3c444a');});
      Sc.o(1.03,(g,ng)=>{
        ellF(g,cx,cyG-Zf+1,R+1,(R+1)/2,'#3b4248');                                                   // 承台鋼樑
        cyl(g,cx,cyG,R,Zf,Zt,WOOD,null,(nx,x)=>{const k=L.band(nx);return ((x-cx)%3===0)?Math.min(4,k+1):k;});
        for(const z of [Zf+2,Zf+5,Zf+8,Zf+11])hoop(g,cx,cyG,R,z,1,['#6d747a','#5b6268','#4c5257','#3d4247','#2f3438']);
        rev(g,cx,cyG,z=>(R+1)*(1-(z-Zt)/8),Zt,Zt+7,['#8a8f86','#737970','#60665e','#4e534c','#3e423c']);
        RC(g,cx-1,cyG-Zt-9,2,2,'#c9a54a');RC(g,cx,cyG-Zt-10,1,1,'#e6c86e');
      });
      Sc.t(1.04,g=>{WP.ladder(g,cx-6,cyG-Zt-1,cyG-Zf+3,'#3b4248','#6b747b');});
      Sc.o(1.3,g=>{for(const u of [.14,.34])boxZ(g,u,.76,.1,.05,0,3,'#9c9a93','#bdbab2','#8f8c85');});
      Sc.o(1.31,g=>{for(const u of [.15,.35]){const p=P(u+.05,.785,3);ellF(g,p[0]+.5,p[1]-.5,3,1.5,C.hedge);RC(g,p[0]-1,p[1]-2,2,1,C.hedgeL);}});
      WP.tree(Sc,.92,.3,4,6,1.1,1307);WP.tree(Sc,.92,.62,4,5,1.25,1308);
      Sc.t(1.4,g=>{for(let i=0;i<3;i++){const p=P(.52+i*.06,.84,0),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-2,y-1,1,2,'#3a3e44');RC(g,x+1,y-2,1,2,'#3a3e44');RC(g,x-1,y-2,2,1,i%2?'#dfe3e6':'#2f6fb3');RC(g,x,y-3,1,1,'#2b2e33');}});
    });};

  // v4 地面儲水槽＋泵房：寬矮鋼製圓槽（環形混凝土基礎、橫向焊縫、低錐頂、沿槽壁螺旋梯與扶手、頂部通氣帽）；
  //    前右混凝土泵房（捲門、門燈、屋頂風機）與兩條藍色送水管；碎石場地、柏油車道、工程車、綠籬
  const GTANK=['#f1f5ea','#d9e5cf','#b8cca9','#91aa83','#6f8a64'];
  const wt4=()=>{const L=WT,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks,tiles,lotEdge}=L;
    return L.sprite((g,ng,Sc)=>{
      A.dia(g,L.AX,L.TOPY,32,C.grass);specks(g,0,0,1,1,36,1401,[C.grassD,C.grassH]);
      quad(g,.04,.04,.78,.78,C.grav);specks(g,.04,.04,.78,.78,40,1402,[C.gravD,C.gravH]);
      quad(g,.8,.06,.2,.5,C.asphE);quad(g,.815,.075,.17,.47,C.asph);
      lotEdge(g);
      const cp=P(.38,.38),cx=Math.round(cp[0]),cyG=Math.round(cp[1]),R=17,Zt=17;
      Sc.shCyl(cx,cyG,R,0,Zt);
      Sc.o(1.0,(g,ng)=>{
        cyl(g,cx,cyG,R+1,0,1,C.conc,C.conc[1]);
        cyl(g,cx,cyG,R,1,Zt,GTANK);
        for(const z of [6,11])hoop(g,cx,cyG,R,z,1,['#c9d8bd','#b3c7a4','#9bb38c','#7b9470','#5f7756']);
        rev(g,cx,cyG,z=>(R+.5)*(1-(z-Zt)/7),Zt,Zt+4,['#dfe6d8','#c6d1bd','#a9b79e','#8a9a80','#6d7c64']);
        ellB(g,cx,cyG-Zt,R+.5,(R+.5)/2,'#7f8f76','f');
        // 頂部通氣帽＋檢修口欄杆
        RC(g,cx-2,cyG-Zt-6,4,2,'#9aa790');RC(g,cx-1,cyG-Zt-7,2,1,'#b9c4ae');
        // 標誌：藍色水滴＋名稱帶
        const dx=cx-9,dy=cyG-8;RC(g,dx,dy-4,1,1,'#2f6fb3');RC(g,dx-1,dy-3,3,1,'#2f6fb3');RC(g,dx-2,dy-2,5,2,'#2f6fb3');RC(g,dx-1,dy,3,1,'#2f6fb3');RC(g,dx-1,dy-2,1,1,'#bfe0f5');
        for(let x=cx-4;x<cx+7;x++){const nx=(x+.5-cx)/R,e=Math.sqrt(1-nx*nx)*R/2;RC(g,x,Math.round(cyG-9+e),1,2,'#2f6fb3');}
        // 沿槽壁螺旋梯（從左下地面繞到右上槽頂）
        for(let x=cx-R+1;x<=cx+10;x++){const nx=(x+.5-cx)/R,e=Math.sqrt(Math.max(0,1-nx*nx))*R/2,z=(nx+1)/(10/R+1)*Zt,y=Math.round(cyG-z+e);
          RC(g,x,y,1,1,'#58626a');RC(g,x,y+1,1,1,'#3d454b');RC(g,x,y-3,1,1,'#7d8890');if((x&1)===0)RC(g,x,y-2,1,2,'#7d8890');}
      });
      // 泵房
      const pu=.7,pv=.58,pdu=.27,pdv=.28,ph=9;Sc.shBox(pu,pv,pdu,pdv,ph);
      Sc.o(1.1,(g,ng)=>{const u1=pu+pdu,v1=pv+pdv;boxZ(g,pu,pv,pdu,pdv,0,ph,'#c9c3b5','#e2dccd','#b9b2a1');
        fL(g,v1,pu,u1,0,1,'#a39c8b');fR(g,u1,pv,v1,0,1,'#8f887a');fL(g,v1,pu,u1,ph-1,ph,'#2f6fb3');fR(g,u1,pv,v1,ph-1,ph,'#244f7e');
        fL(g,v1,pu+.04,pu+.16,0,6.5,'#7d858b');for(let z=1;z<6.5;z+=1.3)fL(g,v1,pu+.04,pu+.16,z,z+.4,'#656d73');   // 捲門
        fL(g,v1,pu+.2,pu+.25,0,5.5,'#4c5963');const lp=P(pu+.225,v1,7);RC(g,lp[0],lp[1]-1,2,1,'#f0d890');if(ng)RC(ng,lp[0]-1,lp[1]-1,3,2,'#ffe7b0');
        fR(g,u1,pv+.07,pv+.15,3,6,'#3f5261');if(ng)fR(ng,u1,pv+.07,pv+.15,3,6,C.lit);fR(g,u1,pv+.19,pv+.26,3,6,'#3f5261');
        boxZ(g,pu+.08,pv+.08,.1,.1,ph,3,'#aeb5b9','#c5cbce','#949b9f');const f=P(pu+.13,pv+.13,ph+3);RC(g,f[0]-2,f[1],3,1,'#6b7378');});
      // 送水管（地面、藍色、法蘭）
      Sc.o(1.05,g=>{for(const v of [.62,.7]){const a=P(.64,v,1),b=P(.7,v,1);for(let x=Math.round(a[0]);x<=Math.round(b[0]);x++){const t=(x-a[0])/((b[0]-a[0])||1),y=Math.round(a[1]+(b[1]-a[1])*t);RC(g,x,y-2,1,1,'#4f86bf');RC(g,x,y-1,1,1,'#2f6fb3');}
        RC(g,Math.round(a[0])+2,Math.round(a[1])-3,1,3,'#22507f');}});
      WP.car(Sc,.84,.14,'v',1.06,['#e9ecee','#f5f7f8','#c3c9ce'],{van:true,stripe:'#2f6fb3'});
      WP.hedge(Sc,.04,.9,.52,.05,2,1.45);WP.tree(Sc,.08,.74,4,6,1.3,1403);WP.shrub(Sc,.62,.92,1.5);
    });};

  // ================================================================
  // 電廠 k5：88×120，錨點 44,118（1×1 緊湊版）
  // smoke／lamp 皆為相對錨點的像素偏移：畫布座標 (44+dx, 118+dy)
  // ================================================================
  const PL=LIB(88,120,44,118),PP=PARTS(PL);
  const CHIM=['#eeece6','#dad7d0','#c0bdb6','#a09d97','#817e79'];
  const CRED=['#f39a8a','#dd6252','#c04e41','#9b3e34','#7a3129'];
  const COAL=['#6c6966','#575451','#45433f','#363432','#292826'];
  const STEEL=['#eef1f3','#d3d9dd','#b1bac0','#8c969d','#6c757c'];
  const plantGround=(g,seed,o={})=>{const L=PL,{P,quad,specks,tiles,lotEdge}=L;
    A.dia(g,L.AX,L.TOPY,32,C.grass);specks(g,0,0,1,1,30,seed,[C.grassD,C.grassH]);
    quad(g,.03,.03,.94,.94,'#c4bfb3');tiles(g,.03,.03,.94,.94,.157,'#b6b1a5');specks(g,.03,.03,.94,.94,30,seed+1,['#d0cbc0','#b0ab9f']);
    lotEdge(g);};
  // 主變壓器：油坑基座＋油箱＋左面散熱片＋三支套管＋警示燈
  const xfmr=(Sc,u0,v0,du,dv,d)=>{const{P,RC,boxZ,fL}=PL;Sc.shBox(u0,v0,du,dv,9);
    Sc.o(d,(g,ng)=>{boxZ(g,u0-.02,v0-.02,du+.04,dv+.04,0,1.5,'#cfcbc2','#d9d5cc','#b3afa6');
      boxZ(g,u0,v0,du,dv,1.5,7.5,'#6f7d74','#8a998f','#5d6a62');
      for(let t=u0+.015;t<u0+du-.01;t+=.03)fL(g,v0+dv,t,t+.012,2.5,8,'#627068');
      for(const k of [.25,.5,.75]){const p=P(u0+du*k,v0+dv*.45,9);RC(g,p[0],p[1]-3,1,3,'#e8ecee');RC(g,p[0],p[1]-4,1,1,'#8b5a3a');}
      const w=P(u0+du,v0+.01,9);RC(g,w[0]-1,w[1]-1,1,1,C.red);if(ng)RC(ng,w[0]-1,w[1]-1,1,1,C.redN);});};
  // 傾斜輸送廊（沿 v）：低端在前 va（z=za）、高端在後 vb（z=zb）；廊寬 w（u 向）、廊高 4；右側鋼支架
  const galleryV=(Sc,u,w,va,vb,za,zb,d)=>{const{P,fp,RC,BL}=PL;const zAt=v=>za+(zb-za)*(va-v)/(va-vb);
    Sc.t(d-.002,g=>{for(const t of [.35,.68]){const v=va+(vb-va)*t,z=zAt(v);const a=P(u+w,v,0),b=P(u+w,v,z);BL(g,a,b,'#6a747b');BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],'#4c555c');
      const c=P(u,v,0),e=P(u,v,z);BL(g,c,e,'#58616a');BL(g,[c[0],c[1]-Math.round(z*.45)],[a[0],a[1]-Math.round(z*.45)],'#58616a');}});
    Sc.o(d,(g,ng)=>{fp(g,[P(u+w,va,za),P(u+w,vb,zb),P(u+w,vb,zb+4),P(u+w,va,za+4)],'#5f6d63');
      fp(g,[P(u,va,za+4),P(u+w,va,za+4),P(u+w,vb,zb+4),P(u,vb,zb+4)],'#8f9c8c');
      fp(g,[P(u,va,za),P(u+w,va,za),P(u+w,va,za+4),P(u,va,za+4)],'#7b8977');
      for(let t=.08;t<.95;t+=.09){const v=va+(vb-va)*t,p=P(u+w,v,zAt(v)+2);RC(g,p[0],p[1],1,1,'#b9c6b4');}});};

  // v0 燃煤：高聳鍋爐房（直肋鋼板、百葉帶、窗）＋前方汽機房（高窗、捲門、藍色簷帶、天窗）＋鋼筋混凝土煙囪
  //    （從地面基座長出、錐收、紅白頂帶、航空燈）＋鍋爐→煙囪煙道；右前露天煤場（兩座煤堆）、轉運站與輸煤棧橋上到鍋爐；主變壓器
  const pl0=()=>{const L=PL,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks}=L;
    const chU=.6,chV=.06,chp=P(chU,chV),ccx=Math.round(chp[0]),ccy=Math.round(chp[1]),ZC=64;
    const spr=L.sprite((g,ng,Sc)=>{
      plantGround(g,5001);
      quad(g,.5,.44,.47,.53,'#8d8780');specks(g,.5,.44,.47,.53,40,5003,['#77726b','#a19b92','#5e5a55']);   // 煤場地面
      quad(g,.03,.83,.42,.14,'#86837d');for(let u=.08;u<.44;u+=.08)BL(g,P(u,.9),P(u+.04,.9),'#d8d3c4');     // 廠內道路
      // 鍋爐房
      const bu0=.06,bv0=.06,bdu=.34,bdv=.34,bh=40,bu1=bu0+bdu,bv1=bv0+bdv;Sc.shBox(bu0,bv0,bdu,bdv,bh);
      Sc.o(1.0,(g,ng)=>{boxZ(g,bu0,bv0,bdu,bdv,0,bh,'#8f9aa2','#c8d0d5','#9aa5ad');
        for(let t=bu0+.03;t<bu1-.01;t+=.04)fL(g,bv1,t,t+.012,1,bh-4,'#b5bec4');
        for(let t=bv0+.03;t<bv1-.01;t+=.04)fR(g,bu1,t,t+.012,1,bh-4,'#8a959d');
        fL(g,bv1,bu0,bu1,bh-8,bh-4,'#7d8a93');fR(g,bu1,bv0,bv1,bh-8,bh-4,'#66727a');for(let z=bh-7.5;z<bh-4;z+=1.2){fL(g,bv1,bu0,bu1,z,z+.4,'#a9b3ba');fR(g,bu1,bv0,bv1,z,z+.4,'#86919a');}
        fL(g,bv1,bu0,bu1,bh-1,bh,'#dde3e6');fR(g,bu1,bv0,bv1,bh-1,bh,'#b3bcc2');
        for(const z of [22,28]){for(const t of [.12,.2,.28,.36]){fL(g,bv1,t,t+.03,z,z+2.5,'#4b6070');if(ng&&L.hsh(5004,t*100|0,z)<.5)fL(ng,bv1,t,t+.03,z,z+2.5,C.lit);}}
        for(const z of [22,28]){for(const t of [.13,.21,.29,.37]){fR(g,bu1,t,t+.03,z,z+2.5,'#3c4d5a');if(ng&&L.hsh(5005,t*100|0,z)<.45)fR(ng,bu1,t,t+.03,z,z+2.5,'#f0cf8c');}}
        quad(g,bu0+.02,bv0+.02,bdu-.04,bdv-.04,'#7c868d',bh);boxZ(g,bu0+.06,bv0+.06,.1,.1,bh,3,'#9aa5ad','#b3bcc2','#86919a');boxZ(g,bu0+.2,bv0+.16,.08,.08,bh,2,'#9aa5ad','#b3bcc2','#86919a');});
      // 煙道：鍋爐 → 煙囪（兩端掛在結構上）
      Sc.o(1.01,g=>{boxZ(g,bu1,.07,chU-bu1-.03,.07,32,5,'#7f8a92','#98a3aa','#6c767d');for(let t=bu1+.05;t<chU-.05;t+=.06)fL(g,.14,t,t+.01,32,37,'#7a858c');});
      // 煙囪
      Sc.shCyl(ccx,ccy,4.5,0,ZC);
      Sc.o(1.02,(g,ng)=>{cyl(g,ccx,ccy,6.5,0,2,C.conc,C.conc[1]);
        rev(g,ccx,ccy,z=>5-z*1.4/ZC,2,ZC,CHIM,(nx,x,z)=>{const k=L.band(nx);return (z>ZC-13&&(((ZC-z)/4|0)%2===0))?CRED[k]:k;});
        hoop(g,ccx,ccy,4,ZC-15,1,'#5d6268');
        ellF(g,ccx,ccy-ZC,3.6,1.8,'#2b2826');ellB(g,ccx,ccy-ZC,3.6,1.8,'#8a3a31');
        RC(g,ccx-1,ccy-ZC-2,2,1,C.red);if(ng)RC(ng,ccx-1,ccy-ZC-2,2,1,C.redN);});
      // 汽機房（鍋爐前方）
      const tu0=.06,tv0=.44,tdu=.34,tdv=.34,th=20,tu1=tu0+tdu,tv1=tv0+tdv;Sc.shBox(tu0,tv0,tdu,tdv,th);
      Sc.o(1.1,(g,ng)=>{boxZ(g,tu0,tv0,tdu,tdv,0,th,'#969b9f','#e3ddcf','#bdb5a3');
        fL(g,tv1,tu0,tu1,0,1.5,'#b9b09c');fR(g,tu1,tv0,tv1,0,1.5,'#9e9683');
        for(const t of [.1,.18,.26,.34]){fL(g,tv1,t-.025,t+.025,6,16,'#4b6478');fL(g,tv1,t-.025,t-.012,13,16,'#86a6bd');if(ng&&L.hsh(5006,t*100|0,1)<.7)fL(ng,tv1,t-.025,t+.025,6,16,C.lit);}
        fR(g,tu1,tv0+.05,tv0+.17,0,9,'#7f868b');for(let z=1;z<9;z+=1.5)fR(g,tu1,tv0+.05,tv0+.17,z,z+.5,'#6c7378');
        for(const t of [tv0+.23,tv0+.29]){fR(g,tu1,t-.02,t+.02,7,14,'#3f5566');if(ng)fR(ng,tu1,t-.02,t+.02,7,14,'#f0cf8c');}
        fL(g,tv1,tu0,tu1,th-2,th,'#2f6fb3');fR(g,tu1,tv0,tv1,th-2,th,'#244f7e');
        quad(g,tu0+.02,tv0+.02,tdu-.04,tdv-.04,'#83898e',th);for(let t=tu0+.06;t<tu1-.03;t+=.07)BL(g,P(t,tv0+.04,th),P(t,tv1-.04,th),'#a9c1cf');});
      // 主變壓器（煙囪右側）
      xfmr(Sc,.83,.07,.12,.14,1.03);
      // 輸煤：轉運站（煤場前）→ 棧橋沿 v 上升 → 鍋爐右側煤倉
      // 棧橋頭房（掛在鍋爐右牆上）
      Sc.o(1.04,(g,ng)=>{boxZ(g,bu1,.28,.1,.12,20,9,'#8e99a1','#b8c1c7','#86919a');fR(g,bu1+.1,.31,.37,23,26,'#3c4d5a');if(ng)fR(ng,bu1+.1,.31,.37,23,26,'#f0cf8c');
        fL(g,.4,bu1,bu1+.1,19,20,'#6c767d');});
      galleryV(Sc,.42,.07,.72,.4,5,21,1.05);
      Sc.shBox(.4,.7,.12,.1,8);
      Sc.o(1.12,g=>{boxZ(g,.4,.7,.12,.1,0,8,'#8e978c','#c9cfc6','#9ea79b');fL(g,.8,.43,.49,0,5,'#5d6a73');});
      // 煤堆
      Sc.shCyl(P(.8,.62)[0],P(.8,.62)[1],9,0,9);Sc.shCyl(P(.86,.42)[0],P(.86,.42)[1],6,0,6);
      Sc.o(1.2,g=>{for(const[u,v,R,Hc]of[[.86,.42,7,7],[.8,.62,10,10]]){const p=P(u,v),cx=Math.round(p[0]),cy=Math.round(p[1]);
          rev(g,cx,cy,z=>R*Math.pow(1-z/Hc,.7),0,Hc-1,COAL);}
        for(let i=0;i<16;i++){const u=.6+L.hsh(5007,i,1)*.32,v=.48+L.hsh(5007,i,2)*.34,p=P(u,v,2+L.hsh(5007,i,3)*4);RC(g,p[0],p[1],1,1,'#8a8680');}});
    });
    spr.smoke=[{dx:ccx-44,dy:(ccy-ZC-3)-118},{dx:ccx-43,dy:(ccy-ZC-4)-118}];spr.lamp={dx:ccx-45,dy:(ccy-ZC-3)-118};return spr;};

  // v1 冷卻塔型：一座雙曲線自然通風冷卻塔（底部斜柱進風口、集水池緣、頂緣內壁、雨痕、航空燈）＋汽機房（青綠簷帶）
  //    ＋循環水管接塔底；前方升壓站（主變＋門型架）、控制室、停車
  const CT=['#f1efea','#dedbd4','#c7c4bc','#a8a59e','#88857f'];
  const pl1=()=>{const L=PL,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks}=L;
    const cp=P(.34,.34),cx=Math.round(cp[0]),cyG=Math.round(cp[1]),ZT=46,prof=z=>8.5*Math.sqrt(1+((z-33)/22.7)**2);
    const spr=L.sprite((g,ng,Sc)=>{
      plantGround(g,5101);
      quad(g,.6,.74,.37,.23,C.grass);specks(g,.6,.74,.37,.23,14,5106,[C.grassD,C.grassH]);quad(g,.72,.74,.07,.23,C.pave);
      quad(g,.04,.68,.5,.28,'#bdb7a8');specks(g,.04,.68,.5,.28,30,5102,[C.gravD,C.gravH]);                          // 升壓站碎石
      // 冷卻塔
      Sc.shCyl(cx,cyG,12,0,ZT);
      Sc.o(1.0,(g,ng)=>{
        cyl(g,cx,cyG,15.5,0,1,C.conc,C.conc[1]);                                                             // 集水池緣
        rev(g,cx,cyG,()=>prof(3)-.5,1,3,CT,(nx,x)=>((x-cx+60)%3===0)?CT[1]:'#3b4045');                         // 斜柱進風口
        rev(g,cx,cyG,prof,4,ZT,CT);
        hoop(g,cx,cyG,prof(4),4,1,['#b9b6ae','#b9b6ae','#a5a29a','#8d8a84','#75726d']);
        // 雨痕
        for(let i=0;i<9;i++){const x=cx-7+Math.round(L.hsh(5103,i,1)*14),y0=cyG-ZT+Math.round(prof(ZT)/2)+1,len=4+Math.round(L.hsh(5103,i,2)*9);
          for(let y=y0;y<y0+len;y++){const nx=(x+.5-cx)/prof(cyG-y);RC(g,x,y,1,1,nx<.1?'#c9c6be':'#95928b');}}
        // 頂口：內壁（後半亮）＋深處＋唇緣
        const rt=prof(ZT),ty=cyG-ZT;ellF(g,cx,ty,rt,rt/2,'#6c7075');ellF(g,cx,ty+1.5,rt-1.5,(rt-1.5)/2,'#3a3e43');ellB(g,cx,ty,rt,rt/2,'#f5f4f0');
        RC(g,cx-Math.round(rt)+1,ty-1,1,1,C.red);RC(g,cx+Math.round(rt)-2,ty-1,1,1,C.red);if(ng){RC(ng,cx-Math.round(rt)+1,ty-1,1,1,C.redN);RC(ng,cx+Math.round(rt)-2,ty-1,1,1,C.redN);}
      });
      // 汽機房
      const tu0=.66,tv0=.3,tdu=.3,tdv=.38,th=17,tu1=tu0+tdu,tv1=tv0+tdv;Sc.shBox(tu0,tv0,tdu,tdv,th);
      Sc.o(1.1,(g,ng)=>{boxZ(g,tu0,tv0,tdu,tdv,0,th,'#8c9396','#e1e5e6','#b4bbbe');
        fL(g,tv1,tu0,tu1,0,1.5,'#a8adaf');fR(g,tu1,tv0,tv1,0,1.5,'#90979a');
        fL(g,tv1,tu0,tu1,th-3,th,'#2f8a8a');fR(g,tu1,tv0,tv1,th-3,th,'#246c6c');
        for(const t of [.71,.78,.85,.92]){fL(g,tv1,t-.02,t+.02,4,12,'#4b6478');if(ng&&L.hsh(5104,t*100|0,1)<.7)fL(ng,tv1,t-.02,t+.02,4,12,C.lit);}
        fR(g,tu1,tv0+.04,tv0+.14,0,8,'#7f868b');for(let z=1;z<8;z+=1.5)fR(g,tu1,tv0+.04,tv0+.14,z,z+.5,'#6c7378');
        for(const t of [tv0+.2,tv0+.27]){fR(g,tu1,t-.02,t+.02,5,11,'#3f5566');if(ng)fR(ng,tu1,t-.02,t+.02,5,11,'#f0cf8c');}
        quad(g,tu0+.02,tv0+.02,tdu-.04,tdv-.04,'#7b8285',th);boxZ(g,tu0+.06,tv0+.08,.22,.08,th,3,'#9aa1a4','#b9bfc2','#868d90');
        for(const t of [tu0+.1,tu0+.16,tu0+.22]){const p=P(t,tv0+.12,th+3);RC(g,p[0]-1,p[1],2,1,'#5e6568');}});
      // 循環水管（汽機房 → 塔底）
      Sc.o(1.05,g=>{for(const v of [.44,.52]){const a=P(.6,v,1.5),b=P(.66,v,1.5),n=Math.round(b[0]-a[0]);for(let i=0;i<=n;i++){const x=Math.round(a[0])+i,y=Math.round(a[1]+(b[1]-a[1])*i/n);
        RC(g,x,y-2,1,1,'#6fa3b0');RC(g,x,y-1,1,1,'#4f8391');RC(g,x,y,1,1,'#3a6773');}}});
      // 升壓站：主變＋門型架
      xfmr(Sc,.1,.7,.14,.14,1.2);
      Sc.shBox(.3,.72,.2,.18,8);
      Sc.o(1.21,(g,ng)=>{boxZ(g,.3,.72,.2,.18,0,8,'#8f9496','#dcdfe0','#b3b9bc');fL(g,.9,.3,.5,6.5,8,'#2f8a8a');fR(g,.5,.72,.9,6.5,8,'#246c6c');
        for(let z=1.5;z<5.5;z+=1.3)fL(g,.9,.33,.41,z,z+.5,'#9aa1a4');fL(g,.9,.44,.48,0,5.5,'#4c5963');fR(g,.5,.76,.84,2,5,'#3f5566');if(ng)fR(ng,.5,.76,.84,2,5,'#f0cf8c');
        const w=P(.46,.9,6);RC(g,w[0],w[1]-1,2,2,'#f2d35d');RC(g,w[0],w[1]-1,1,1,'#2b2b2b');});
      PP.tree(Sc,.93,.93,3,5,1.4,5106);PP.shrub(Sc,.64,.78,1.3);PP.shrub(Sc,.86,.78,1.31);PP.shrub(Sc,.62,.94,1.42);
      PP.tree(Sc,.94,.2,4,6,1.0,5105);PP.shrub(Sc,.92,.72,1.35);
    });
    const ty=cyG-ZT;spr.smoke=[{dx:cx-44-3,dy:ty-2-118},{dx:cx-44+3,dy:ty-2-118},{dx:cx-44,dy:ty-3-118}];spr.lamp={dx:cx-44-Math.round(prof(ZT))+1,dy:ty-2-118};return spr;};

  // v2 燃氣複循環：燃氣輪機廠房（白色鋼板、藍帶、捲門）＋屋頂進氣過濾室（百葉）＋後方餘熱鍋爐 HRSG（加勁肋）
  //    ＋主煙囪（從地面起、頂部黑環與檢修平台）＋輔助鍋爐細煙囪；右側主變壓器；前右天然氣計量站＋黃色輸氣管
  const pl2=()=>{const L=PL,{P,RC,BL,quad,boxZ,fL,fR,ellF,ellB,rev,cyl,hoop,specks}=L;
    const sp=P(.72,.14),scx=Math.round(sp[0]),scy=Math.round(sp[1]),ZS=58;
    const ap=P(.2,.14),acx=Math.round(ap[0]),acy=Math.round(ap[1]),ZA=40;
    const spr=L.sprite((g,ng,Sc)=>{
      plantGround(g,5201);
      quad(g,.04,.8,.5,.17,C.grass);specks(g,.04,.8,.5,.17,14,5202,[C.grassD,C.grassH]);
      // 輔助細煙囪（後左、從地面）
      Sc.shCyl(acx,acy,2.5,0,ZA);
      Sc.o(0.99,(g,ng)=>{cyl(g,acx,acy,3.5,0,1.5,C.conc,C.conc[1]);cyl(g,acx,acy,2.5,1.5,ZA,STEEL);ellF(g,acx,acy-ZA,2.5,1.25,'#2f3336');hoop(g,acx,acy,2.5,ZA-2,1,'#4a5157');});
      // HRSG
      const hu0=.34,hv0=.08,hdu=.3,hdv=.26,hh=30,hu1=hu0+hdu,hv1=hv0+hdv;Sc.shBox(hu0,hv0,hdu,hdv,hh);
      Sc.o(1.0,(g,ng)=>{boxZ(g,hu0,hv0,hdu,hdv,0,hh,'#6e7b84','#9aa7b0','#76838c');
        for(let z=5;z<hh-1;z+=5){fL(g,hv1,hu0,hu1,z,z+.8,'#7f8c95');fR(g,hu1,hv0,hv1,z,z+.8,'#63707a');}
        fL(g,hv1,hu0,hu1,hh-1,hh,'#c3ccd2');fR(g,hu1,hv0,hv1,hh-1,hh,'#98a4ac');
        quad(g,hu0+.02,hv0+.02,hdu-.04,hdv-.04,'#5d6972',hh);
        boxZ(g,hu0+.02,hv1,.05,.04,0,hh-2,'#8d99a1','#b4bec5','#7f8b93');for(let z=2;z<hh-3;z+=3)BL(g,P(hu0+.025,hv1+.04,z),P(hu0+.065,hv1+.04,z+2),'#5b6770');   // 外掛樓梯塔
        boxZ(g,.4,hv1,.18,.08,5,9,'#79858e','#8f9ba3','#6a757e');
        boxZ(g,hu1-.02,hv0+.04,.08,.1,hh-8,6,'#56626b','#6f7c86','#4f5a62');                               // 出口煙道 → 主煙囪
                fR(g,hu1,hv0+.05,hv0+.1,1,6,'#3a444c');const wl=P(hu1,hv0+.075,7);RC(g,wl[0],wl[1]-1,1,1,'#f0d890');if(ng)RC(ng,wl[0]-1,wl[1]-1,2,2,'#ffe7b0');});
      // 主煙囪
      Sc.shCyl(scx,scy,3.5,0,ZS);
      Sc.o(1.01,(g,ng)=>{cyl(g,scx,scy,5,0,2,C.conc,C.conc[1]);cyl(g,scx,scy,4,2,ZS,STEEL);
        hoop(g,scx,scy,4,ZS-2,2,'#3d4247');hoop(g,scx,scy,4,ZS-12,1,'#6b747b');
        ellF(g,scx,scy-ZS,4,2,'#2f3336');ellB(g,scx,scy-ZS-1,5,2.5,'#59626a','f');
        RC(g,scx-1,scy-ZS-2,2,1,C.red);if(ng)RC(ng,scx-1,scy-ZS-2,2,1,C.redN);});
      // 燃氣輪機廠房
      const gu0=.06,gv0=.4,gdu=.56,gdv=.34,gh=15,gu1=gu0+gdu,gv1=gv0+gdv;Sc.shBox(gu0,gv0,gdu,gdv,gh);
      Sc.o(1.1,(g,ng)=>{boxZ(g,gu0,gv0,gdu,gdv,0,gh,'#9aa2a8','#eef0f1','#c4cbd0');
        fL(g,gv1,gu0,gu1,0,1.5,'#b5bcc1');fR(g,gu1,gv0,gv1,0,1.5,'#9aa2a8');
        fL(g,gv1,gu0,gu1,gh-3,gh-1.5,'#2f6fb3');fR(g,gu1,gv0,gv1,gh-3,gh-1.5,'#244f7e');
        for(let t=gu0+.04;t<gu1-.02;t+=.05)fL(g,gv1,t,t+.01,1.5,gh-3,'#dde1e3');
        fL(g,gv1,.36,.5,0,9,'#7f868b');for(let z=1;z<9;z+=1.5)fL(g,gv1,.36,.5,z,z+.5,'#6c7378');
        for(const t of [.54,.59]){fL(g,gv1,t-.018,t+.018,4,9,'#4b6478');if(ng)fL(ng,gv1,t-.018,t+.018,4,9,C.lit);}
        fL(g,gv1,.29,.33,0,6,'#4c5963');const lp=P(.31,gv1,7.5);RC(g,lp[0],lp[1]-1,2,1,'#f0d890');if(ng)RC(ng,lp[0]-1,lp[1]-1,3,2,'#ffe7b0');
        for(const t of [gv0+.1,gv0+.2]){fR(g,gu1,t-.025,t+.025,5,10,'#3f5566');if(ng)fR(ng,gu1,t-.025,t+.025,5,10,'#f0cf8c');}
        quad(g,gu0+.02,gv0+.02,gdu-.04,gdv-.04,'#8b9398',gh);});
      // 進氣過濾室（坐在廠房屋頂）
      Sc.o(1.11,g=>{const u0=.1,v0=.44,du=.22,dv=.26,z=gh,h=10;boxZ(g,u0,v0,du,dv,z,h,'#aeb6bb','#d6dbde','#a7afb4');
        for(let k=z+1.5;k<z+h-1;k+=1.6){fL(g,v0+dv,u0+.01,u0+du-.01,k,k+.6,'#8c959b');fR(g,u0+du,v0+.01,v0+dv-.01,k,k+.6,'#79838a');}
        boxZ(g,u0+du,v0+.06,.06,.12,z+2,5,'#9aa2a8','#b9c0c4','#8b9398');});
      // 主變壓器
      xfmr(Sc,.72,.4,.14,.16,1.15);
      // 天然氣計量站＋黃色輸氣管
      const Y=['#f2d35d','#e0b93a','#b8931f'];
      Sc.t(1.2,(g,ng)=>{
        const pipeU=(v,ua,ub)=>{const a=P(ua,v,1.5),b=P(ub,v,1.5),n=Math.round(Math.abs(b[0]-a[0]));for(let i=0;i<=n;i++){const x=Math.round(a[0]+(b[0]-a[0])*i/n),y=Math.round(a[1]+(b[1]-a[1])*i/n);RC(g,x,y-1,1,1,Y[0]);RC(g,x,y,1,1,Y[2]);}};
        const pipeV=(u,va,vb)=>{const a=P(u,va,1.5),b=P(u,vb,1.5),n=Math.round(Math.abs(b[0]-a[0]));for(let i=0;i<=n;i++){const x=Math.round(a[0]+(b[0]-a[0])*i/n),y=Math.round(a[1]+(b[1]-a[1])*i/n);RC(g,x,y-1,1,1,Y[0]);RC(g,x,y,1,1,Y[1]);}};
        quad(g,.68,.76,.3,.2,'#b3afa6');quad(g,.69,.77,.28,.18,'#d9d5cc');
        pipeU(.84,.7,.98);pipeU(.9,.7,.98);pipeV(.7,.7,.9);pipeU(.7,.62,.7);
        for(const u of [.76,.93]){const p=P(u,.87,2);RC(g,p[0]-1,p[1]-2,3,1,'#c0392b');}});
      Sc.o(1.21,g=>{for(const[u,v]of[[.8,.8],[.88,.8]]){const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);cyl(g,x,y,2.5,1,8,STEEL,STEEL[1]);RC(g,x-1,y-10,2,1,Y[1]);}
      });
      PP.tree(Sc,.1,.9,4,6,1.4,5203);PP.tree(Sc,.36,.9,3,5,1.42,5204);PP.shrub(Sc,.22,.88,1.41);
    });
    spr.smoke=[{dx:scx-44,dy:scy-ZS-3-118},{dx:scx-44,dy:scy-ZS-5-118},{dx:acx-44,dy:acy-ZA-3-118}];spr.lamp={dx:scx-45,dy:scy-ZS-3-118};return spr;};

  const put=(name,fn)=>{try{fn();}catch(e){ERR.push(name+': '+(e&&e.stack||e));console.error('civic576 '+name,e);}};
  put('waterTower',()=>{const L=[wt0,wt1,wt2,wt3,wt4],out=[];for(let i=0;i<L.length;i++){try{out[i]=L[i]();}catch(e){ERR.push('wt v'+i+': '+(e&&e.stack||e));console.error('civic576 waterTower v'+i,e);}}
    if(!Array.isArray(S.waterTowerVar))S.waterTowerVar=[];if(out[0])S.waterTower=out[0];for(let i=1;i<5;i++)if(out[i])S.waterTowerVar[i]=out[i];});
  put('plant',()=>{const L=[pl0,pl1,pl2],out=[];for(let i=0;i<L.length;i++){try{out[i]=L[i]();}catch(e){ERR.push('plant v'+i+': '+(e&&e.stack||e));console.error('civic576 plant v'+i,e);}}
    if(!Array.isArray(S.plantVar))S.plantVar=[];if(out[0])S.plant=out[0];for(let i=1;i<3;i++)if(out[i])S.plantVar[i]=out[i];});
});
