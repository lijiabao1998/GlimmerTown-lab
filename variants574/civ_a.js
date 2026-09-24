// civ_a：消防局 k6（v0 英式雙門紅磚站／v1 單門玻璃現代站＋訓練塔／v2 石造老站＋鐘樓）
//        高級消防 k30（v0 三門＋右後訓練塔／v1 雙門＋左前訓練塔／v2 轉角四門＋中後訓練塔）
// 1×1、72×112、錨 36,110。光從左：+v 面（左前）亮、+u 面（右前）暗；落影向右。
// 分層合成：每個立體件自成一層（二值化＋深色外框），細線件（旗桿）不描框；夜光按層遮擋。零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function civ_a(A){
  const B=A.SPR().bld;
  const ref=B['6_1_0']||{w:72,h:112,ax:36,ay:110};
  const W=ref.w|0||72,H=ref.h|0||112,AX=ref.ax|0||36,AY=ref.ay|0||110;
  const K=A.iso575(W,H,AX,AY,1),{P,hsh,TOPY}=K;

  // ================= 像素工具 =================
  const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
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
  const fL=(g,v,ua,ub,z0,z1,c)=>fp(g,[P(ua,v,z0),P(ub,v,z0),P(ub,v,z1),P(ua,v,z1)],c);
  const fR=(g,u,va,vb,z0,z1,c)=>fp(g,[P(u,va,z0),P(u,vb,z0),P(u,vb,z1),P(u,va,z1)],c);
  const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);
    for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
  // 一排窗（+v 面／+u 面）：n 扇、寬 w 像素；o.gl 頂列反光、o.sill 窗台、o.mul 中梃、o.fr 窗框
  const winsL=(g,ng,v,ua,ub,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=ua+(ub-ua)*(i+.5)/n,a=t-w/64,b=t+w/64;
    if(o.fr)fL(g,v,a-1/32,b+1/32,z0-.5,z1+.5,o.fr);
    fL(g,v,a,b,z0,z1,c);if(o.gl)fL(g,v,a,a+1/32,z1-1,z1,o.gl);if(o.sill)fL(g,v,a-.5/32,b+.5/32,z0-1,z0,o.sill);if(o.lin)fL(g,v,a-.5/32,b+.5/32,z1,z1+1,o.lin);if(o.mul)fL(g,v,a,b,(z0+z1)/2-.5,(z0+z1)/2+.5,o.mul);
    if(ng&&lit&&hsh(seed,i,z0|0)<p)fL(ng,v,a,b,z0,z1,lit);}};
  const winsR=(g,ng,u,va,vb,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=va+(vb-va)*(i+.5)/n,a=t-w/64,b=t+w/64;
    if(o.fr)fR(g,u,a-1/32,b+1/32,z0-.5,z1+.5,o.fr);
    fR(g,u,a,b,z0,z1,c);if(o.gl)fR(g,u,b-1/32,b,z1-1,z1,o.gl);if(o.sill)fR(g,u,a-.5/32,b+.5/32,z0-1,z0,o.sill);if(o.lin)fR(g,u,a-.5/32,b+.5/32,z1,z1+1,o.lin);if(o.mul)fR(g,u,a,b,(z0+z1)/2-.5,(z0+z1)/2+.5,o.mul);
    if(ng&&lit&&hsh(seed,i,(z0|0)+50)<p)fR(ng,u,a,b,z0,z1,lit);}};

  // ================= 場景：分層描邊＋落影＋夜光遮擋 =================
  const scene=()=>{const items=[],SH=[];let n=0;
    return{
      o:(d,fn)=>items.push({d,ol:1,fn,i:n++}),
      t:(d,fn)=>items.push({d,ol:0,fn,i:n++}),
      sh:(u0,v0,du,dv,h)=>SH.push([u0,v0,du,dv,h]),
      run(g,ng){
        if(SH.length){const[mc,mx]=A.cv(W,H);
          for(const[u0,v0,du,dv,h]of SH){const hh=Math.min(h,44),k=Math.round(hh*.5),dy=-Math.round(hh*.13);
            const F=[P(u0,v0),P(u0+du,v0),P(u0+du,v0+dv),P(u0,v0+dv)],T=F.map(p=>[p[0]+k,p[1]+dy]);
            fp(mx,F,'#000');fp(mx,T,'#000');for(let i=0;i<4;i++)fp(mx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],'#000');}
          const[tc,tx]=A.cv(W,H);tx.fillStyle='#18212b';tx.fillRect(0,0,W,H);tx.globalCompositeOperation='destination-in';tx.drawImage(mc,0,0);
          g.save();g.globalAlpha=.28;g.globalCompositeOperation='source-atop';g.drawImage(tc,0,0);g.restore();}
        items.sort((a,b)=>a.d-b.d||a.i-b.i);
        for(const it of items){const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);it.fn(sx,lx);K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      }};};
  // 南兩斜邊以外一律清掉（外框、落影溢出保險）
  const clipLot=c=>{const g=c.getContext('2d');for(let y=94;y<H;y++){const w=2*(AY-y);if(w<=0){g.clearRect(0,y,W,1);continue;}
    g.clearRect(0,y,Math.max(0,AX-w),1);g.clearRect(AX+w,y,W,1);}g.clearRect(0,0,W,2);};
  const sprite=(draw)=>{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const Sc=scene();const extra=draw(g,ng,Sc)||{};Sc.run(g,ng);clipLot(c);clipLot(nc);
    const o={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};if(extra.flagAt)o.flagAt=extra.flagAt;return o;};

  // ================= 色票 =================
  const C={
    grass:'#78a256',grassD:'#6a934b',grassH:'#88b265',
    conc:'#c9c6bd',concJ:'#b9b6ad',concH:'#d5d2c9',curbD:'#8a857b',curbL:'#d6d1c5',
    asph:'#6f6d69',asphE:'#8d8a84',
    brick:'#b0503c',brickD:'#823a2c',brickJ:'#9c4533',brickJD:'#71322a',
    stone:'#e4dbc6',stoneD:'#b8ad95',stoneJ:'#cfc5ae',
    slate:'#5d6570',slateD:'#454b55',slateJ:'#50575f',ridge:'#353a42',
    red:'#cf2e26',redD:'#a3221c',redJ:'#ab251f',redH:'#e7493d',
    int:'#2a2522',intD:'#1d1a18',
    win:'#4d7090',winD:'#3c5a74',winGl:'#8fb3cc',frameW:'#efece3',frame:'#39434d',
    glass:'#5f8cab',glassD:'#486d86',glassH:'#a6c8dc',
    lit:'#ffe3a2',litW:'#fff1c8',lamp:'#ffe7b0',redN:'#ff5a46',blueN:'#6fb2ff',
    white:'#f2f0ea',whiteD:'#c8ccce',
    hedge:'#4f8a3e',hedgeL:'#62a04c',hedgeD:'#3f7132',trunk:'#6b4a33',
  };

  // ================= 共用元件 =================
  const lotEdge=g=>{A.diaEdge(g,6,C.curbD,AX,TOPY,32);A.diaEdge(g,9,C.curbL,AX,TOPY,32);};
  const specks=(g,u0,v0,du,dv,n,seed,cols)=>{for(let i=0;i<n;i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v,0);RC(g,p[0],p[1],1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
  const joints=(g,u0,v0,du,dv,step,c)=>{for(let u=u0+step;u<u0+du-.001;u+=step)BL(g,P(u,v0),P(u,v0+dv),c);for(let v=v0+step;v<v0+dv-.001;v+=step)BL(g,P(u0,v),P(u0+du,v),c);};
  // 紅白標線：沿 v 方向的交錯色帶（出車道禁停區）
  const hatchV=(g,u0,v0,du,dv,n)=>{for(let i=0;i<n;i++){quad(g,u0+du*i/n,v0,du/n,dv,i%2?C.white:C.red);}};
  const laneV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
  const tree=(Sc,u,v,r,h,d,seed=1,pal)=>{const q=pal||['#3f7331','#548c3f','#6ea84f','#8cc063'];Sc.sh(u-.03,v-.03,.06,.06,h+r);
    Sc.o(d,g=>{const b=P(u,v,0);RC(g,b[0]-1,b[1]-h,2,h+1,C.trunk);RC(g,b[0],b[1]-h,1,h+1,'#523726');
      const cx=b[0],cy=b[1]-h-r+1;ell(g,cx,cy,r,r,q[0]);ell(g,cx-1,cy-1,r-1,r-1,q[1]);ell(g,cx-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),q[2]);
      for(let i=0;i<3;i++){RC(g,cx-r+2+((hsh(seed,i,1)*(2*r-3))|0),cy-r+2+((hsh(seed,i,2)*(2*r-3))|0),1,1,hsh(seed,i,3)<.5?q[3]:q[0]);}});};
  const shrub=(Sc,u,v,d,c=C.hedge)=>{Sc.o(d,g=>{const b=P(u,v,0);ell(g,b[0],b[1]-2,2,2,c);RC(g,b[0]-1,b[1]-3,2,1,C.hedgeL);});};
  const hedge=(Sc,u0,v0,du,dv,h,d)=>{Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,0,h,C.hedgeL,C.hedge,C.hedgeD);});};
  const hydrant=(Sc,u,v,d)=>{Sc.o(d,g=>{const p=P(u,v,0),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-4,2,4,C.red);RC(g,x-1,y-4,1,4,C.redH);RC(g,x-2,y-3,4,1,C.redD);RC(g,x-1,y-5,2,1,'#e0d27a');});};
  const bollard=(Sc,u,v,d)=>{Sc.o(d,g=>{const p=P(u,v,0),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-4,1,4,'#e9c33c');RC(g,x,y-3,1,1,'#2b2b2b');});};
  // 矮庭園燈（細線層）：短桿＋2px 燈罩（燈頭偏右一格掛臂）
  const lampS=(Sc,u,v,h,d)=>{Sc.t(d,(g,ng)=>{const b=P(u,v,0),t=P(u,v,h),x=Math.round(t[0]),y=Math.round(t[1]),by=Math.round(b[1]);
    RC(g,x-1,by-1,3,1,'#4a5157');RC(g,x,y,1,by-1-y,'#5b636a');RC(g,x-1,y,1,by-1-y,'#7a838a');
    RC(g,x-1,y-2,3,1,'#2b3035');RC(g,x-1,y-1,3,1,'#3a4046');RC(g,x,y-1,1,1,'#f4e8c4');
    if(ng){RC(ng,x-1,y-1,3,1,'#ffeab8');RC(ng,x,y,1,1,'rgba(255,224,160,.55)');}});};
  // 旗桿（細線層）：底座＋雙色桿；回傳桿頂畫布座標
  // 繪製端的動態旗（SPR.flag）自帶 20px 桿身（x-1..x、flagAt.y-20..flagAt.y-1）：這裡畫的是下段桿身＋底座，顏色與之銜接，
  // 回傳的 flagAt＝本段桿頂正上方一列，兩段接成一根。
  const flagPole=(Sc,u,v,z,h,d)=>{const b=P(u,v,z),t=P(u,v,z+h),x=Math.round(t[0]),y=Math.round(t[1]),by=Math.round(b[1]);
    Sc.o(d-.001,g=>{boxZ(g,u-.025,v-.025,.05,.05,z,2,'#d9d6cc','#c9c5ba','#a8a498');});
    Sc.t(d,g=>{RC(g,x-1,y,1,by-2-y,'#a9a9a3');RC(g,x,y,1,by-2-y,'#8a8a86');});
    return [x,y];};
  // 門上鵝頸燈（+v 面）：白天燈罩、夜間燈光
  const doorLampL=(g,ng,v,u,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,3,1,'#2c3136');RC(g,x,y,1,1,'#f3e6b8');if(ng){RC(ng,x-1,y,3,1,C.lamp);RC(ng,x,y+1,1,1,'rgba(255,231,176,.55)');}};
  // 車庫門上緣的門燈（+v 面）：白天 2px 燈罩＋2px 燈泡；夜間 2×2 暖燈＋門楣一列淡光
  const bayLamp=(g,ng,v,u,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,2,1,'#262b30');RC(g,x-1,y,2,1,'#f6e7b4');
    if(ng){RC(ng,x-1,y-1,2,2,'#fff1c4');RC(ng,x-2,y+1,4,1,'rgba(255,214,140,.5)');}};
  const doorLampR=(g,ng,u,v,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,3,1,'#24282c');RC(g,x,y,1,1,'#e9dcae');if(ng){RC(ng,x-1,y,3,1,C.lamp);}};

  // ---- 車庫門（+v 面）：o.style='roll' 紅捲門｜'glass' 玻璃捲門｜'arch' 拱頂木門；o.open＝捲門下緣高度（0＝全關） ----
  const archL=(g,v,ua,ub,za,rise,c)=>{const n=8,um=(ua+ub)/2,hw=(ub-ua)/2;fL(g,v,ua,ub,0,za+.2,c);
    for(let i=0;i<n;i++){const t0=-1+2*i/n,t1=-1+2*(i+1)/n,tm=(t0+t1)/2,zz=za+rise*Math.sqrt(Math.max(0,1-tm*tm));fL(g,v,um+hw*t0,um+hw*t1,za,zz,c);}};
  const bayL=(g,ng,v,ua,ub,z1,o={})=>{const st=o.style||'roll',open=o.open||0,fr=o.fr||'#3b2a26';
    if(st==='arch'){                                           // 石砌拱門：拱圈石＋紅木門扇（敞開時兩扇折向兩側）
      const za=z1-3,um=(ua+ub)/2,dc=o.col||'#b3362b';
      archL(g,v,ua-.02,ub+.02,za,3.8,o.stone||'#efe3c6');
      archL(g,v,ua,ub,za,3,dc);
      if(open>0){archL(g,v,ua+.025,ub-.025,za,2.6,C.int);fL(g,v,ua+.025,ub-.025,za-1,za,C.intD);
        if(ng){archL(ng,v,ua+.035,ub-.035,za-.5,2,'#f0cd86');}}
      else{fL(g,v,um-.4/32,um+.4/32,0,za+2.6,'#6e2018');for(const t of [ua+.035,ub-.045])fL(g,v,t,t+.3/32,1,za-1,'#8e2a21');
        archL(g,v,ua+.03,ub-.03,za+.6,1.8,'#9fc0d0');fL(g,v,ua+.03,ub-.03,0,za+.6,dc);fL(g,v,um-.4/32,um+.4/32,0,za+1.5,'#6e2018');}
      return;}
    {const fw=o.frw||.012;fL(g,v,ua-fw,ub+fw,0,z1+(o.frw?1.5:1),fr);}
    if(open>0){fL(g,v,ua,ub,0,open,C.int);fL(g,v,ua,ub,open-1,open,C.intD);if(ng)fL(ng,v,ua+.01,ub-.01,.5,open-1,'#f0cd86');}
    if(st==='roll'){fL(g,v,ua,ub,open,z1,o.col||C.red);for(let z=open+1.5;z<z1-.4;z+=1.5)fL(g,v,ua,ub,z,z+.5,o.colJ||C.redJ);fL(g,v,ua,ua+.8/32,open,z1,o.colH||C.redH);}
    else{const gz=o.gcol||'#7fa9c2';fL(g,v,ua,ub,open,z1,o.frcol||'#d9dcdc');
      for(let z=open+.8;z<z1-.8;z+=2.4){fL(g,v,ua+.012,ub-.012,z,Math.min(z1-.8,z+1.6),gz);}
      const um=(ua+ub)/2;fL(g,v,um-.3/32,um+.3/32,open,z1,o.frcol||'#d9dcdc');
      if(ng)for(let z=open+.8;z<z1-.8;z+=2.4)fL(ng,v,ua+.012,ub-.012,z,Math.min(z1-.8,z+1.6),open>0?'#ffe6ae':'#c9a970');}
  };
  const bayR=(g,ng,u,va,vb,z1,o={})=>{const st=o.style||'roll',open=o.open||0,fr=o.fr||'#2e211e';
    {const fw=o.frw||.012;fR(g,u,va-fw,vb+fw,0,z1+(o.frw?1.5:1),fr);}
    if(open>0){fR(g,u,va,vb,0,open,C.int);if(ng)fR(ng,u,va+.01,vb-.01,.5,open-1,'#e2bd78');}
    if(st==='roll'){fR(g,u,va,vb,open,z1,o.col||C.redD);for(let z=open+1.5;z<z1-.4;z+=1.5)fR(g,u,va,vb,z,z+.5,o.colJ||'#851b16');}
    else{const gz=o.gcol||'#5b8299';fR(g,u,va,vb,open,z1,o.frcol||'#aeb4b6');
      for(let z=open+.8;z<z1-.8;z+=2.4){fR(g,u,va+.012,vb-.012,z,Math.min(z1-.8,z+1.6),gz);}
      const vm=(va+vb)/2;fR(g,u,vm-.3/32,vm+.3/32,open,z1,o.frcol||'#aeb4b6');
      if(ng)for(let z=open+.8;z<z1-.8;z+=2.4)fR(ng,u,va+.012,vb-.012,z,Math.min(z1-.8,z+1.6),open>0?'#f2d596':'#b39664');}
  };

  // ---- 消防車（車頭朝 +v、自門口駛出）：u∈[ua,ub]、車尾貼門面 v0、車頭 v1；o.ladder 雲梯車 ----
  const engineV=(Sc,d,ua,ub,v0,v1,o={})=>{const hc=o.hc||7,hb=o.hb||8,vc=v1-(o.cab||.07);
    Sc.sh(ua,v0,ub-ua,v1-v0,hb);
    Sc.o(d,(g,ng)=>{
      // 車身（門內側一小段＋出門段）
      boxZ(g,ua,v0,ub-ua,vc-v0,.8,hb-.8,C.redH,C.red,C.redD);
      fR(g,ub,v0,vc,3,4,'#e9e4d8');                                             // 側面白帶
      fR(g,ub,v0+.02,vc-.01,4.5,hb-1,'#8d1c15');                                 // 側面器材箱門
      for(let t=v0+.05;t<vc-.01;t+=.05)fR(g,ub,t,t+.4/32,4.5,hb-1,'#b52a22');
      // 駕駛室
      boxZ(g,ua,vc,ub-ua,v1-vc,.8,hc-.8,C.redH,C.red,C.redD);
      fL(g,v1,ua+.02,ub-.02,hc-3.6,hc-1,'#26313d');fL(g,v1,ua+.02,ua+.045,hc-2,hc-1,'#9fc2d6');         // 擋風玻璃
      fR(g,ub,vc+.01,v1-.012,hc-3.2,hc-1,'#2a3746');                                                   // 側窗
      fL(g,v1,ua,ub,2.6,3.4,'#f1ece0');fR(g,ub,vc,v1,2.6,3.4,'#e9e4d8');                             // 白色腰帶
      fL(g,v1,ua,ub,.8,1.6,'#3a3d42');                                                                  // 保險桿
      {const a=P(ua+.01,v1,2),b=P(ub-.02,v1,2);RC(g,a[0],a[1]-1,1,1,'#fff6d6');RC(g,b[0],b[1]-1,1,1,'#fff6d6');
        if(ng){RC(ng,a[0],a[1]-1,1,1,'#fff3cc');RC(ng,b[0],b[1]-1,1,1,'#fff3cc');}}
      // 車輪（暗面）
      for(const t of [v1-.035,v0+.03]){if(t<v0+.01)continue;fR(g,ub,t-.02,t+.02,0,1.8,'#202327');}
      // 警示燈條
      {const m=P((ua+ub)/2,v1-.02,hc),x=Math.round(m[0]),y=Math.round(m[1]);RC(g,x-2,y-1,2,1,'#e8392c');RC(g,x,y-1,2,1,'#3a74d8');
        if(ng){RC(ng,x-2,y-1,2,1,C.redN);RC(ng,x,y-1,2,1,C.blueN);}}
      // 車頂器材／雲梯
      if(o.ladder){const um=(ua+ub)/2;
        boxZ(g,um-.04,v0+.015,.08,.06,hb,1.4,'#5d646a','#4a5157','#3a4045');                       // 車尾轉台（深色底座）
        // 雲梯：自轉台斜伸到車頭前方；2px 梯身＝上列亮灰梯樑＋下列淺灰梯樑夾深色梯級點，底下一列深影與紅車身分開
        const s=P(um,v0+.02,hb+2.6),e=P(um,v1+.11,hb+1.2),x0=Math.round(s[0]),x1=Math.round(e[0]);
        for(let x=x0,i=0;x>=x1;x--,i++){const f=(x0-x)/Math.max(1,x0-x1),y=Math.round(s[1]+(e[1]-s[1])*f);
          RC(g,x,y,1,1,'#f4f6f7');RC(g,x,y+1,1,1,i%3===1?'#3e464c':'#aeb6bb');RC(g,x,y+2,1,1,'#2a2f33');}}
      else{const zl=hb+.8;for(const uu of [ua+.03,ub-.04])BL(g,P(uu,v0+.01,zl),P(uu,vc-.005,zl),'#d8dcdf');   // 車頂拉梯
        for(let t=v0+.03;t<vc-.01;t+=.035)BL(g,P(ua+.03,t,zl),P(ub-.04,t,zl),'#9aa2a8');}
    });};

  // ---- 消防車（車頭朝 +u、自右前面車庫門駛出）：v∈[va,vb]、車尾 u0、車頭 u1 ----
  const engineU=(Sc,d,va,vb,u0,u1,o={})=>{const hc=o.hc||7,hb=o.hb||8,uc=u1-(o.cab||.07);
    Sc.sh(u0,va,u1-u0,vb-va,hb);
    Sc.o(d,(g,ng)=>{
      boxZ(g,u0,va,uc-u0,vb-va,.8,hb-.8,C.redH,C.red,C.redD);
      fL(g,vb,u0,uc,3,4,'#f1ece0');fL(g,vb,u0+.01,uc-.02,4.5,hb-1,'#b52a22');
      for(let t=u0+.05;t<uc-.01;t+=.05)fL(g,vb,t,t+.4/32,4.5,hb-1,'#8d1c15');
      boxZ(g,uc,va,u1-uc,vb-va,.8,hc-.8,C.redH,C.red,C.redD);
      fR(g,u1,va+.02,vb-.02,hc-3.6,hc-1,'#1f2833');fR(g,u1,vb-.045,vb-.02,hc-2,hc-1,'#7f9fb3');
      fL(g,vb,uc+.012,u1-.012,hc-3.2,hc-1,'#2c3d4f');
      fL(g,vb,uc,u1,2.6,3.4,'#f1ece0');fR(g,u1,va,vb,2.6,3.4,'#d9d3c6');
      fR(g,u1,va,vb,.8,1.6,'#2e3135');
      {const a=P(u1,va+.02,2),b=P(u1,vb-.01,2);RC(g,a[0],a[1]-1,1,1,'#fff6d6');RC(g,b[0]-1,b[1]-1,1,1,'#fff6d6');
        if(ng){RC(ng,a[0],a[1]-1,1,1,'#fff3cc');RC(ng,b[0]-1,b[1]-1,1,1,'#fff3cc');}}
      for(const t of [u1-.035,u0+.04])fL(g,vb,t-.02,t+.02,0,1.8,'#202327');
      {const m=P(u1-.02,(va+vb)/2,hc),x=Math.round(m[0]),y=Math.round(m[1]);RC(g,x-2,y-1,2,1,'#e8392c');RC(g,x,y-1,2,1,'#3a74d8');
        if(ng){RC(ng,x-2,y-1,2,1,C.redN);RC(ng,x,y-1,2,1,C.blueN);}}
      const zl=hb+.8;for(const vv of [va+.03,vb-.04])BL(g,P(u0+.01,vv,zl),P(uc-.005,vv,zl),'#d8dcdf');
      for(let t=u0+.03;t<uc-.01;t+=.035)BL(g,P(t,va+.03,zl),P(t,vb-.04,zl),'#9aa2a8');
    });};

  // ---- 雙坡屋頂（屋脊沿 u，山牆在 +u 端）----
  const gableU=(g,u0,v0,u1,v1,he,hr,e,col)=>{const vm=(v0+v1)/2,s=(hr-he)/(v1-vm),zE=he-s*e;
    fp(g,[P(u1,v0,he),P(u1,v1,he),P(u1,vm,hr)],col.gable);
    if(col.gableJ)for(let z=he+2;z<hr-1;z+=2){const f=(z-he)/(hr-he),a=v1-(v1-vm)*f,b=v0+(vm-v0)*f;BL(g,P(u1,a,z),P(u1,b,z),col.gableJ);}
    // 前坡
    fp(g,[P(u0-e,v1+e,zE),P(u1+e,v1+e,zE),P(u1+e,vm,hr),P(u0-e,vm,hr)],col.roof);
    for(let i=1;i<5;i++){const f=i/5,v=v1+e-(v1+e-vm)*f,z=zE+(hr-zE)*f;BL(g,P(u0-e,v,z),P(u1+e,v,z),col.roofJ);}
    BL(g,P(u0-e,v1+e,zE),P(u1+e,v1+e,zE),col.eave||'#2d3137');
    // 山牆封簷板（厚度）
    const vg=[P(u1+e,v1+e,zE),P(u1+e,vm,hr),P(u1+e,v0-e,zE)];
    for(let k=0;k<2;k++){BL(g,[vg[0][0],vg[0][1]+k],[vg[1][0],vg[1][1]+k],k?col.verge:col.roofJ);BL(g,[vg[1][0],vg[1][1]+k],[vg[2][0],vg[2][1]+k],k?col.verge:col.roofJ);}
    BL(g,P(u0-e,vm,hr),P(u1+e,vm,hr),col.ridge);
    return {vm,zE};};
  // 磚縫（兩個可見面）：外側轉角端內縮 1px，縫線不得頂出面緣（否則外框會被打成鋸齒虛線）
  const brickL=(g,v,ua,ub,z0,z1,c,st=2)=>{for(let z=z0+st;z<z1;z+=st)BL(g,P(ua+1/32,v,z),P(ub,v,z),c);};
  const brickR=(g,u,va,vb,z0,z1,c,st=2)=>{for(let z=z0+st;z<z1;z+=st)BL(g,P(u,va+1/32,z),P(u,vb,z),c);};

  // ================= 消防局 k6 =================
  // ---- 正面山牆雙坡屋頂（屋脊沿 v，山牆在 +v 立面；只看得到 +u 坡）----
  const gableV=(g,u0,v0,u1,v1,he,hr,e,col)=>{const um=(u0+u1)/2,s=(hr-he)/(u1-um),zE=he-s*e;
    // +u 坡
    fp(g,[P(um,v0-e,hr),P(um,v1+e,hr),P(u1+e,v1+e,zE),P(u1+e,v0-e,zE)],col.roof);
    for(let i=1;i<6;i++){const f=i/6,u=um+(u1+e-um)*f,z=hr+(zE-hr)*f;BL(g,P(u,v0-e,z),P(u,v1+e,z),col.roofJ);}
    BL(g,P(u1+e,v0-e,zE),P(u1+e,v1+e,zE),col.eave||'#2b2f35');
    // 山牆三角（立面材質）
    fp(g,[P(u0,v1,he-.2),P(u1,v1,he-.2),P(um,v1,hr)],col.gable);
    if(col.gableJ)for(let z=he+1.5;z<hr-1;z+=2){const f=(z-he)/(hr-he),a=u0+(um-u0)*f,b=u1-(u1-um)*f;BL(g,P(a,v1,z),P(b,v1,z),col.gableJ);}
    // 山牆壓頂（石材）
    fp(g,[P(u0-e,v1+e,zE),P(um,v1+e,hr+1.2),P(um,v1+e,hr-.6),P(u0-e,v1+e,zE-1.6)],col.cope);
    fp(g,[P(um,v1+e,hr+1.2),P(u1+e,v1+e,zE),P(u1+e,v1+e,zE-1.6),P(um,v1+e,hr-.6)],col.copeD||col.cope);
    BL(g,P(um,v1+e,hr+1),P(um,v0-e,hr+1),col.ridge);
    return {um,zE};};

  // v0 英式雙門紅磚站：正面山牆兩層紅磚（石材壓頂、山牆圓窗、石材飾帶「FIRE STATION」）、兩扇紅捲門（右門半開、消防車頭駛出）、
  //    右側石板瓦坡、右後紅磚操練塔（逐層操練窗洞、混凝土壓頂）、側門雨遮＋門燈；前庭混凝土、門前紅白禁停帶、右側草地＋樹＋旗桿
  const fs0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.125,C.concJ);
    quad(g,.7,.3,.3,.7,C.grass);specks(g,.7,.3,.3,.7,8,601,[C.grassD,C.grassH]);
    quad(g,.66,.43,.34,.1,'#d8d4ca');joints(g,.66,.43,.34,.1,.06,'#c6c2b8');                            // 側門步道
    hatchV(g,.08,.87,.56,.1,11);
    for(const u of [.1,.32,.4,.62])laneV(g,u,.61,.87,'#f1efe8');
    lotEdge(g);
    const u0=.05,v0=.08,u1=.67,v1=.6,he=21,hr=33,e=.025,um=(u0+u1)/2;
    Sc.sh(u0,v0,u1-u0,v1-v0,hr-6);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,C.brick,C.brickD);
      brickL(g,v1,u0,u1,0,he,C.brickJ);brickR(g,u1,v0,v1,0,he,C.brickJD);
      fL(g,v1,u0,u1,0,1.2,'#7d7468');fR(g,u1,v0,v1,0,1.2,'#5f574d');                                   // 石材牆腳
      fL(g,v1,u0,u1,12,14.2,C.stone);fR(g,u1,v0,v1,12,14.2,C.stoneD);                                   // 石材飾帶
      for(let i=0;i<9;i++){if(i===4)continue;const t=.12+i*.05;fL(g,v1,t,t+1.2/32,12.6,13.8,'#5b4a3c');}   // FIRE STATION 字
      // 車庫門
      bayL(g,ng,v1,.1,.32,11.5,{style:'roll',open:8.5});
      bayL(g,ng,v1,.4,.62,11.5,{style:'roll'});
      fL(g,v1,.325,.395,1,11.5,'#a4483a');                                                               // 中柱
      // 二樓窗列（白框拉窗）
      winsL(g,ng,v1,u0+.04,u1-.04,3,15.5,20.5,3,C.win,C.lit,612,.6,{gl:C.winGl,sill:C.stone,lin:C.stone});
      // 右面（暗面）：側門、窗
      winsR(g,ng,u1,v0+.04,v1-.04,3,15.5,20.5,2.6,C.winD,C.lit,613,.5,{sill:C.stoneD,lin:C.stoneD});
      winsR(g,ng,u1,v0+.06,v0+.3,2,4,9.5,2.6,C.winD,C.lit,614,.6,{sill:C.stoneD,lin:C.stoneD});
      fR(g,u1,.435,.525,0,8.5,'#2a1f1c');fR(g,u1,.445,.515,0,8,'#27496b');fR(g,u1,.445,.515,6.2,8,'#88a9bd');
      if(ng)fR(ng,u1,.445,.515,6.2,8,C.lit);
      for(const t of [.21,.51])bayLamp(g,ng,v1,t,13.6);                                                  // 兩扇捲門上緣各一盞門燈
    });
    Sc.o(1.02,(g,ng)=>{gableV(g,u0,v0,u1,v1,he,hr,e,{gable:C.brick,gableJ:C.brickJ,roof:C.slateD,roofJ:'#3c424a',cope:C.stone,copeD:C.stoneD,ridge:C.ridge});
      const c=P(um,v1,he+5.5);ell(g,c[0],c[1],2,2,C.stone);ell(g,c[0],c[1],1,1,C.win);RC(g,c[0]-1,c[1]-1,1,1,C.winGl);   // 山牆圓窗
      if(ng)ell(ng,c[0],c[1],1,1,C.lit);});
    // 側門雨遮
    Sc.o(1.1,g=>{boxZ(g,u1,.425,.04,.11,9,1.2,'#5d636a','#4a4f55','#3e434a');});
    engineV(Sc,1.2,.13,.29,v1-.01,v1+.19,{cab:.08});
    // 右後操練塔
    const tu=.74,tv=.06,ts=.2,th=46;
    Sc.sh(tu,tv,ts,ts,th);
    Sc.o(1.05,(g,ng)=>{boxZ(g,tu,tv,ts,ts,0,th,null,C.brick,C.brickD);
      brickL(g,tv+ts,tu,tu+ts,0,th,C.brickJ);brickR(g,tu+ts,tv,tv+ts,0,th,C.brickJD);
      fL(g,tv+ts,tu,tu+ts,0,1.2,'#7d7468');fR(g,tu+ts,tv,tv+ts,0,1.2,'#5f574d');
      for(const z of [13,22,31]){fL(g,tv+ts,tu+.055,tu+ts-.055,z,z+5,C.int);fL(g,tv+ts,tu+.045,tu+ts-.045,z-1,z,C.stone);
        fR(g,tu+ts,tv+.07,tv+ts-.07,z+1,z+5,C.intD);}
      // 頂層曬水帶通風縫＋石材壓頂
      for(let t=tu+.04;t<tu+ts-.03;t+=.045)fL(g,tv+ts,t,t+1/32,th-7,th-2.5,C.int);
      for(let t=tv+.04;t<tv+ts-.03;t+=.045)fR(g,tu+ts,t,t+1/32,th-7,th-2.5,C.intD);
      fL(g,tv+ts,tu,tu+ts,th-2,th,C.stone);fR(g,tu+ts,tv,tv+ts,th-2,th,C.stoneD);
      fL(g,tv+ts,tu+.07,tu+ts-.07,0,7,'#3b2a26');                                                        // 塔底門
    });
    Sc.o(1.051,g=>{const z=th,e=.02,E=[P(tu-e,tv-e,z),P(tu+ts+e,tv-e,z),P(tu+ts+e,tv+ts+e,z),P(tu-e,tv+ts+e,z)],ap=P(tu+ts/2,tv+ts/2,th+9);   // 石板瓦四角錐頂
      fp(g,[E[3],E[2],ap],C.slate);fp(g,[E[1],E[2],ap],C.slateD);BL(g,E[2],ap,C.ridge);BL(g,E[3],E[2],'#2d3137');BL(g,E[2],E[1],'#2d3137');
      RC(g,ap[0],ap[1]-3,1,3,'#6d767d');});
    const fa=flagPole(Sc,.05,.93,0,9,1.5);quad(g,0,.84,.08,.16,C.grass);
    // 前景
    tree(Sc,.97,.37,4,6,1.1,615);hydrant(Sc,.8,.72,1.4);shrub(Sc,.7,.33,1.1);shrub(Sc,.97,.86,1.45);
    return {flagAt:fa};
  });

  // ---- 其他共用 ----
  const asphalt=(g,u0,v0,du,dv)=>{quad(g,u0,v0,du,dv,C.asphE);quad(g,u0+.015,v0+.015,du-.03,dv-.03,C.asph);};
  // 小客車（沿 u 或 v 停）
  const car=(Sc,u0,v0,dir,col,d)=>{const L=.2,Wd=.1,du=dir==='u'?L:Wd,dv=dir==='u'?Wd:L;Sc.sh(u0,v0,du,dv,5);
    Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,.8,2.4,col[0],col[1],col[2]);
      const cu=dir==='u'?u0+.05:u0+.015,cv=dir==='u'?v0+.015:v0+.05,cdu=dir==='u'?du-.1:du-.03,cdv=dir==='u'?dv-.03:dv-.1;
      boxZ(g,cu,cv,cdu,cdv,3.2,1.8,col[0],'#3d5566','#2e3e4b');
      if(dir==='u'){fL(g,v0+dv,u0+.03,u0+.06,0,1,'#23262a');fL(g,v0+dv,u0+du-.06,u0+du-.03,0,1,'#23262a');}
      else{fR(g,u0+du,v0+.03,v0+.06,0,1,'#23262a');fR(g,u0+du,v0+dv-.06,v0+dv-.03,0,1,'#23262a');}});};
  const stallsV=(g,u0,v0,du,dv,n,c)=>{for(let i=0;i<=n;i++){const v=v0+dv*i/n;BL(g,P(u0,v),P(u0+du*.75,v),c);}};
  // 四坡屋頂（屋脊沿 u）
  const hipU=(g,u0,v0,u1,v1,he,hr,e,col)=>{const vm=(v0+v1)/2,r=(v1-v0)/2+e;
    const E=[P(u0-e,v0-e,he),P(u1+e,v0-e,he),P(u1+e,v1+e,he),P(u0-e,v1+e,he)],Ra=P(u0+r-e,vm,hr),Rb=P(u1-r+e,vm,hr);
    fp(g,[E[0],E[1],Rb,Ra],col.back);fp(g,[E[0],Ra,E[3]],col.back);
    fp(g,[E[3],E[2],Rb,Ra],col.front);fp(g,[E[1],E[2],Rb],col.side);
    for(let i=1;i<5;i++){const t=i/5,lp=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];BL(g,lp(E[3],Ra),lp(E[2],Rb),col.frontJ);BL(g,lp(E[2],Rb),lp(E[1],Rb),col.sideJ);}
    BL(g,E[3],E[2],col.eave);BL(g,E[2],E[1],col.eaveD||col.eave);BL(g,Ra,Rb,col.ridge);BL(g,E[2],Rb,col.ridge);
    return {Ra,Rb};};
  // 鐘面（+v 面／+u 面）
  const clockL=(g,ng,v,u,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-2,3,5,'#2b2f33');RC(g,x-2,y-1,5,3,'#2b2f33');RC(g,x-1,y-1,3,3,'#f4efdf');RC(g,x,y-1,1,2,'#2b2f33');RC(g,x,y,2,1,'#2b2f33');
    if(ng){RC(ng,x-1,y-1,3,3,'#fff2c8');RC(ng,x,y-1,1,2,'#6b5a3a');}};
  const clockR=(g,ng,u,v,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-2,3,5,'#23272b');RC(g,x-2,y-1,5,3,'#23272b');RC(g,x-1,y-1,3,3,'#d9d3c1');RC(g,x,y-1,1,2,'#23272b');
    if(ng){RC(ng,x-1,y-1,3,3,'#f1dfae');RC(ng,x,y-1,1,2,'#6b5a3a');}};
  // 現代訓練塔：混凝土塔身、逐層樓板線、+u 面逐層操練窗洞、+v 面外掛紅色之字鋼梯（每段一條斜跑＋端部平台）、頂部紅帶與欄杆
  const drillTowerS=(Sc,d,tu,tv,ts,th,o={})=>{const cL='#cdc9c0',cR='#9c988f',cT='#aba79e',step=o.step||9,vf=tv+ts,u1=tu+ts;
    Sc.sh(tu,tv,ts,ts,th);
    Sc.o(d,(g,ng)=>{boxZ(g,tu,tv,ts,ts,0,th,cT,cL,cR);
      for(let z=step;z<th-3;z+=step){fL(g,vf,tu+1/32,u1,z-1,z,'#aaa69c');fR(g,u1,tv+1/32,vf,z-1,z,'#7d7970');
        fR(g,u1,tv+.05,vf-.05,z+1.5,z+6.5,C.intD);}
      fL(g,vf,tu,u1,th-3,th,C.red);fR(g,u1,tv,vf,th-3,th,C.redD);
      fL(g,vf,tu+.03,tu+.1,0,7,'#3b3632');fL(g,vf,tu+.02,tu+.11,7,7.8,'#8a867e');                          // 塔底門＋門楣
    });
    // 之字鋼梯：浮在 +v 面前 1px；每段斜跑＝亮紅梯樑＋下方暗紅一列；兩端立柱、轉折處 2px 平台
    // 逃生梯式畫法：每層一條橫向平台（亮紅面＋暗紅底）、層間一段斜跑（方向交錯）、兩端細立柱
    Sc.t(d+.002,g=>{const a=tu+.045,b=u1-.02,vs=vf+.03;
      BL(g,P(a,vs,0),P(a,vs,th-4),'#8e221b');BL(g,P(b,vs,0),P(b,vs,th-4),'#8e221b');
      for(let z=0,i=0;z+step<=th-3;z+=step,i++){const L=i%2?b:a,R=i%2?a:b;
        BL(g,P(L,vs,z+1),P(R,vs,z+step-1),'#f0493b');                                                          // 斜跑
        BL(g,P(a,vs,z+step),P(b,vs,z+step),'#f0493b');BL(g,P(a,vs,z+step-1),P(b,vs,z+step-1),'#7e1d17');}});   // 層平台
    Sc.t(d+.003,g=>{for(let t=0;t<=4;t++){const p=P(tu+ts*t/4,vf,th);RC(g,p[0],p[1]-3,1,3,'#5d646a');const q=P(u1,tv+ts*t/4,th);RC(g,q[0],q[1]-3,1,3,'#5d646a');}
      BL(g,P(tu,vf,th+3),P(u1,vf,th+3),'#aab2b8');BL(g,P(u1,tv,th+3),P(u1,vf,th+3),'#7d858b');});};

  // v1 單門玻璃現代站：白色金屬板平頂站房（左段高挑單層車庫：一扇寬玻璃分節門＋正上方紅色招牌簷帶與白字牌；右段兩層辦公、帶狀窗、入口雨遮）、
  //    門扇升起一半、消防車頭駛出；左側獨立混凝土訓練塔（+v 面外掛之字鋼梯、+u 面逐層窗洞、頂欄杆）；左前兩格員工停車（一台紅色指揮車）、
  //    門前紅白禁停帶、右前辦公入口步道＋草地樹、左角旗桿
  const fs1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.1,C.concJ);
    asphalt(g,.02,.6,.25,.38);for(const v of [.63,.76,.89])BL(g,P(.05,v),P(.24,v),'#e6e2d6');                // 員工停車兩格
    quad(g,.74,.58,.26,.42,C.grass);specks(g,.74,.58,.26,.42,6,621,[C.grassD,C.grassH]);
    quad(g,.66,.56,.08,.44,'#d8d4ca');joints(g,.66,.56,.08,.44,.06,'#c6c2b8');                                // 辦公入口步道
    hatchV(g,.31,.86,.32,.1,7);
    for(const u of [.32,.62])laneV(g,u,.57,.86,'#f1efe8');
    lotEdge(g);
    drillTowerS(Sc,.9,.03,.27,.24,46,{step:9});
    const u0=.28,v0=.08,uo=.66,u1=.95,v1=.56,hb=22,ho=29,da=.34,db=.6,op=10,GL='#b3d5e6',GF='#2c343c';
    Sc.sh(u0,v0,u1-u0,v1-v0,hb);Sc.sh(uo,v0,u1-uo,v1-v0,ho);
    Sc.o(1,(g,ng)=>{
      // 車庫段
      boxZ(g,u0,v0,uo-u0,v1-v0,0,hb,null,'#e8eae9','#bfc4c6');
      fL(g,v1,u0,uo,0,.8,'#9da3a6');
      // 寬玻璃分節門：深框；門扇升到 op，露出兩條水平玻璃分節，上緣收在紅簷帶底下
      fL(g,v1,da-.03,db+.03,0,17,GF);
      fL(g,v1,da,db,0,op,C.int);fL(g,v1,da,db,op-1,op,C.intD);
      fL(g,v1,da,db,op+1,op+3,GL);fL(g,v1,da,db,op+4,16,GL);
      fL(g,v1,da,da+1/32,op+1,op+3,'#e2f1f8');fL(g,v1,da,da+1/32,op+4,16,'#e2f1f8');
      if(ng){fL(ng,v1,da+.01,db-.01,.5,op-1,'#f0cd86');fL(ng,v1,da,db,op+1,op+3,'#ffe6ae');fL(ng,v1,da,db,op+4,16,'#ffe6ae');}
      // 紅色招牌簷帶＋一整塊白色字牌
      fL(g,v1,u0,uo,17,hb,C.red);fL(g,v1,u0,uo,17,17.8,C.redD);
      fL(g,v1,.39,.55,18.6,20.8,C.white);
      if(ng)fL(ng,v1,.39,.55,18.6,20.8,'#fff6e0');
      quad(g,u0,v0,uo-u0,v1-v0,'#d3d6d6',hb);quad(g,u0+.03,v0+.03,uo-u0-.03,v1-v0-.06,'#9aa0a3',hb);
      // 辦公段（兩層）
      boxZ(g,uo,v0,u1-uo,v1-v0,0,ho,null,'#eef0ef','#c3c8ca');
      fL(g,v1,uo,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      fL(g,v1,uo+.03,u1-.03,15,21.5,C.frame);fL(g,v1,uo+.045,u1-.045,15.5,21,C.glass);fL(g,v1,uo+.045,u1-.045,20,21,C.glassH);
      for(let t=uo+.1;t<u1-.05;t+=.07)fL(g,v1,t,t+.5/32,15.5,21,C.frame);
      fR(g,u1,v0+.03,v1-.03,15,21.5,C.frame);fR(g,u1,v0+.045,v1-.045,15.5,21,C.glassD);
      for(let t=v0+.1;t<v1-.05;t+=.07)fR(g,u1,t,t+.5/32,15.5,21,C.frame);
      fL(g,v1,uo+.02,uo+.1,0,9,C.frame);fL(g,v1,uo+.03,uo+.09,0,8.5,'#8db6cc');                                // 入口門
      fL(g,v1,uo+.14,u1-.03,3,9,C.frame);fL(g,v1,uo+.155,u1-.045,3.5,8.5,C.glass);fL(g,v1,uo+.155,u1-.045,7.5,8.5,C.glassH);
      winsR(g,ng,u1,v0+.04,v1-.04,4,3,8.5,3,C.glassD,C.lit,622,.5,{});
      fL(g,v1,uo,u1,ho-2.5,ho,C.red);fR(g,u1,v0,v1,ho-2.5,ho,C.redD);                                           // 紅色女兒牆帶
      if(ng){fL(ng,v1,uo+.045,u1-.045,15.5,21,C.lit);for(let t=uo+.1;t<u1-.05;t+=.07)fL(ng,v1,t,t+.5/32,15.5,21,'#6a5a40');
        fL(ng,v1,uo+.155,u1-.045,3.5,8.5,C.lit);fL(ng,v1,uo+.03,uo+.09,0,8.5,C.litW);
        let k=0;for(let t=v0+.045;t<v1-.045;t+=.07,k++)if(hsh(623,k,1)<.6)fR(ng,u1,t+.5/32,Math.min(v1-.045,t+.07),15.5,21,'#f0cf8c');}
      quad(g,uo,v0,u1-uo,v1-v0,'#d7dada',ho);quad(g,uo+.03,v0+.03,u1-uo-.06,v1-v0-.06,'#9aa0a3',ho);
      doorLampL(g,ng,v1,uo+.06,11.8);
    });
    Sc.o(1.02,(g,ng)=>{boxZ(g,uo+.07,v0+.07,.12,.1,ho,2.5,'#d5d9db','#c3c8cb','#9aa1a6');                      // 屋頂空調
      const s=P(u1-.05,v0+.06,ho),x=Math.round(s[0]),y=Math.round(s[1]);RC(g,x,y-7,1,7,'#6d767d');RC(g,x-1,y-8,2,1,'#e8392c');if(ng)RC(ng,x-1,y-8,2,1,C.redN);});
    Sc.o(1.1,g=>{boxZ(g,uo+.005,v1,.11,.08,9.5,1.5,'#e3e6e7','#b9bfc2','#8f969a');});                             // 入口雨遮
    engineV(Sc,1.2,.39,.55,v1-.01,v1+.19,{cab:.08});
    car(Sc,.045,.775,'u',['#c23b30','#d24a3e','#98302a'],1.3);                                                    // 紅色指揮車（第二格）
    const fa=flagPole(Sc,.02,.97,0,9,1.5);
    tree(Sc,.91,.68,4,6,1.4,624);shrub(Sc,.96,.94,1.5);shrub(Sc,.8,.6,1.35);hydrant(Sc,.8,.82,1.45);          // 消防栓移到辦公入口旁草地，與車頭拉開
    return {flagAt:fa};
  });

  // v2 石造老站＋鐘樓：維多利亞式砂岩兩層（粗石牆腳、腰線、拱心石）、四坡石板瓦、兩扇拱頂紅木門（右門敞開、消防車頭駛出）、
  //    右前角鐘樓（鐘面、開敞鐘室與銅鐘、銅綠尖頂、塔頂旗桿）；前庭花崗石鋪面＋紅白禁停帶、左側草地、鐵柵與路燈
  const fs2=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,'#b9b3a6');joints(g,0,0,1,1,.0625,'#aaa497');specks(g,0,0,1,1,26,631,['#c7c1b4','#a39d90']);
    quad(g,0,0,.06,1,C.grass);quad(g,0,.6,.1,.4,C.grass);specks(g,0,.6,.1,.4,5,632,[C.grassD,C.grassH]);
    quad(g,.84,.6,.16,.4,C.grass);quad(g,.62,0,.38,.06,C.grass);quad(g,.84,.06,.16,.54,C.grass);specks(g,.84,.06,.16,.94,6,638,[C.grassD,C.grassH]);
    quad(g,.84,.3,.16,.08,'#cfc9bb');
    hatchV(g,.12,.88,.46,.1,11);
    for(const u of [.14,.32,.38,.56])laneV(g,u,.6,.88,'#f1efe8');
    lotEdge(g);
    const sL='#dcc9a0',sR='#a8956f',sJ='#c9b48a',sJR='#96845f',sT='#efe3c6',u0=.08,v0=.1,u1=.64,v1=.58,he=22,hr=31,e=.03;
    Sc.sh(u0,v0,u1-u0,v1-v0,hr-4);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,sL,sR);
      brickL(g,v1,u0,u1,-.5,11,sJ,2.5);brickR(g,u1,v0,v1,-.5,11,sJR,2.5);                                 // 粗石層
      fL(g,v1,u0,u1,11.5,13,sT);fR(g,u1,v0,v1,11.5,13,'#c2ae86');                                            // 腰線
      bayL(g,ng,v1,.12,.32,11,{style:'arch',open:9,fr:'#6b5a40'});
      bayL(g,ng,v1,.37,.57,11,{style:'arch',fr:'#6b5a40'});
      for(const um of [.22,.47]){const p=P(um,v1,11.2);RC(g,p[0]-1,p[1]-2,2,2,sT);}                              // 拱心石
      winsL(g,ng,v1,u0+.03,u1-.03,4,15,20.5,2.4,'#3f5870',C.lit,633,.6,{gl:'#86a6bd',sill:sT,lin:sT});
      winsR(g,ng,u1,v0+.04,v1-.04,4,15,20.5,2.4,'#324657',C.lit,634,.5,{sill:'#c2ae86',lin:'#c2ae86'});
      winsR(g,ng,u1,v0+.06,v1-.06,3,4,9,2.4,'#324657',C.lit,635,.5,{sill:'#c2ae86'});
      boxZ(g,u0-.012,v0-.012,u1-u0+.024,v1-v0+.024,he-1.5,1.5,sT,sT,'#c2ae86');                              // 簷口
      doorLampL(g,ng,v1,.345,12.4);
    });
    Sc.o(1.02,g=>{hipU(g,u0,v0,u1,v1,he,hr,e,{back:'#4d535c',front:'#5d6570',side:'#454b55',frontJ:'#525962',sideJ:'#3c4149',eave:'#30343a',ridge:'#353a42'});});
    engineV(Sc,1.2,.15,.29,v1-.01,v1+.19,{cab:.08});
    // 右前角鐘樓
    const tu=.64,tv=.43,ts=.17,th=41;
    Sc.sh(tu,tv,ts,ts,th+10);
    Sc.o(1.05,(g,ng)=>{boxZ(g,tu,tv,ts,ts,0,th,null,sL,sR);
      brickL(g,tv+ts,tu,tu+ts,-.5,11,sJ,2.5);brickR(g,tu+ts,tv,tv+ts,-.5,11,sJR,2.5);
      fL(g,tv+ts,tu,tu+ts,11.5,13,sT);fR(g,tu+ts,tv,tv+ts,11.5,13,'#c2ae86');
      fL(g,tv+ts,tu+.04,tu+ts-.04,0,8.5,'#6b5a40');fL(g,tv+ts,tu+.05,tu+ts-.05,0,8,'#4a3423');fL(g,tv+ts,tu+.05,tu+ts-.05,5.5,7.5,'#9cc0d2');  // 塔門
      if(ng)fL(ng,tv+ts,tu+.05,tu+ts-.05,5.5,7.5,C.lit);
      fL(g,tv+ts,tu+.06,tu+ts-.06,16,22,'#3f5870');fL(g,tv+ts,tu+.05,tu+ts-.05,15,16,sT);fL(g,tv+ts,tu+.05,tu+ts-.05,22,23,sT);
      fR(g,tu+ts,tv+.06,tv+ts-.06,16,22,'#324657');
      if(ng)fL(ng,tv+ts,tu+.06,tu+ts-.06,16,22,C.lit);
      fL(g,tv+ts,tu,tu+ts,25.5,27,sT);fR(g,tu+ts,tv,tv+ts,25.5,27,'#c2ae86');
      clockL(g,ng,tv+ts,tu+ts/2,30.5);fR(g,tu+ts,tv+ts/2-.012,tv+ts/2+.012,28.5,32.5,'#4d4332');
      // 鐘室：開敞拱窗＋銅鐘
      fL(g,tv+ts,tu+.03,tu+ts-.03,34.5,39.5,C.int);fR(g,tu+ts,tv+.03,tv+ts-.03,34.5,39.5,C.intD);
      {const p=P(tu+ts/2,tv+ts,36.5);RC(g,p[0]-1,p[1]-1,3,2,'#d8aa44');RC(g,p[0],p[1]-2,1,1,'#a37a2a');}
      boxZ(g,tu-.015,tv-.015,ts+.03,ts+.03,th,1.5,sT,sT,'#c2ae86');
    });
    const ap=P(tu+ts/2,tv+ts/2,th+11);
    Sc.o(1.06,g=>{const z=th+1.5,E=[P(tu-.01,tv-.01,z),P(tu+ts+.01,tv-.01,z),P(tu+ts+.01,tv+ts+.01,z),P(tu-.01,tv+ts+.01,z)];
      fp(g,[E[3],E[2],ap],'#6aa293');fp(g,[E[1],E[2],ap],'#4b7e71');BL(g,E[2],ap,'#3f6b60');BL(g,E[3],E[2],'#5a8f81');});
    Sc.o(1.07,g=>{RC(g,ap[0],ap[1]-3,1,3,'#8d7a3c');RC(g,ap[0]-1,ap[1]-5,2,2,'#d8b24a');});                  // 尖頂銅球
    const fa=flagPole(Sc,.04,.9,0,9,1.5);
    // 左側鐵柵、路燈、樹
    Sc.t(1.3,g=>{for(let v=.62;v<.98;v+=.06){const p=P(.1,v,0);RC(g,p[0],p[1]-4,1,4,'#2e3236');}BL(g,P(.1,.62,3.5),P(.1,.98,3.5),'#2e3236');});
    lampS(Sc,.95,.44,10,1.28);                                                                                // 鐘樓右側草地上的矮庭園燈（與旗桿拉開）
    tree(Sc,.03,.3,4,6,.95,637);tree(Sc,.93,.16,4,6,1.0,639);shrub(Sc,.92,.7,1.45);shrub(Sc,.95,.9,1.5);
    return {flagAt:fa};
  });

  // ================= 高級消防 k30 =================
  const M={wL:'#eef0ef',wR:'#c3c8ca',wJ:'#dcdfdf',wJR:'#b3b8ba',roof:'#9aa0a3',rL:'#cf2e26',rR:'#9f231d',rJ:'#b8271f',rJR:'#861d18',gl:'#6f9fbb',glD:'#4d7690',glH:'#a9cde0'};
  // 格構通訊天線（細線層）＋頂端紅燈
  const mast=(Sc,u,v,z,h,d)=>{Sc.o(d-.001,g=>{boxZ(g,u-.025,v-.025,.05,.05,z,1.5,'#b8bcbe','#c9cccd','#9ea2a4');});
    Sc.t(d,(g,ng)=>{const b=P(u,v,z+1.5),t=P(u,v,z+h),bx=Math.round(b[0]),by=Math.round(b[1]),tx=Math.round(t[0]),ty=Math.round(t[1]);
      BL(g,[bx-2,by],[tx,ty],'#8a949b');BL(g,[bx+2,by],[tx+1,ty],'#5d666d');
      for(let y=by-3;y>ty+1;y-=3){const f=(by-y)/(by-ty),hw=Math.round(2*(1-f));if(hw>0)RC(g,tx-hw,y,2*hw+1,1,'#9aa3a9');}
      RC(g,tx,ty-4,1,4,'#9aa3a9');RC(g,tx,ty-5,1,1,'#e8392c');if(ng)RC(ng,tx,ty-5,1,1,C.redN);});};
  // 屋頂旋轉警示燈
  const beacon=(Sc,u,v,z,d)=>{Sc.o(d,(g,ng)=>{boxZ(g,u-.02,v-.02,.04,.04,z,1,'#6d7479','#8b9297','#5d6368');const p=P(u,v,z+1),x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-1,y-2,2,2,'#e8392c');RC(g,x-1,y-2,1,1,'#ff9a8a');if(ng)RC(ng,x-1,y-2,2,2,C.redN);});};
  // 分節捲門：紅框＋灰色門片＋水平分節線（每 2.4px 一條）＋頂部一列玻璃；o.open＝門片下緣高度（升起後只剩上段）
  const sectL=(g,ng,v,ua,ub,z1,o={})=>{const op=o.open||0,fw=.03,zg=z1-2.4;
    fL(g,v,ua-fw,ub+fw,0,z1+1.5,M.rL);fL(g,v,ua-fw,ua-fw+1/32,0,z1+1.5,'#e7493d');
    if(op>0){fL(g,v,ua,ub,0,op,C.int);fL(g,v,ua,ub,op-1,op,C.intD);if(ng)fL(ng,v,ua+.01,ub-.01,.5,op-1,'#f0cd86');}
    fL(g,v,ua,ub,op,z1,'#cdd3d6');fL(g,v,ua,ua+1/32,op,z1,'#e4e8ea');
    for(let z=op+2.4;z<zg-.5;z+=2.4)fL(g,v,ua,ub,z,z+1,'#8c959b');
    if(zg>=op){fL(g,v,ua,ub,Math.max(op,zg-1),zg,'#8c959b');fL(g,v,ua,ub,zg,z1-.4,M.gl);fL(g,v,ua,ua+1/32,zg,z1-.4,M.glH);
      if(ng)fL(ng,v,ua,ub,zg,z1-.4,op>0?'#ffe6ae':'#d9b878');}};
  const sectR=(g,ng,u,va,vb,z1,o={})=>{const op=o.open||0,fw=.03,zg=z1-2.4;
    fR(g,u,va-fw,vb+fw,0,z1+1.5,M.rR);
    if(op>0){fR(g,u,va,vb,0,op,C.int);if(ng)fR(ng,u,va+.01,vb-.01,.5,op-1,'#e2bd78');}
    fR(g,u,va,vb,op,z1,'#9fa8ad');
    for(let z=op+2.4;z<zg-.5;z+=2.4)fR(g,u,va,vb,z,z+1,'#6c757b');
    if(zg>=op){fR(g,u,va,vb,Math.max(op,zg-1),zg,'#6c757b');fR(g,u,va,vb,zg,z1-.4,M.glD);
      if(ng)fR(ng,u,va,vb,zg,z1-.4,op>0?'#f2d596':'#b39664');}};
  // 白色高塔（紅色轉角條＋紅頂帶；每層樓板線、窗洞寬窄交錯）
  const towerW=(Sc,d,tu,tv,ts,th,o={})=>{const z0=o.z0||0,vf=tv+ts,u1=tu+ts;Sc.sh(tu,tv,ts,ts,th);
    Sc.o(d,(g,ng)=>{boxZ(g,tu,tv,ts,ts,z0,th-z0,M.roof,M.wL,M.wR);
      for(let z=z0+9,i=0;z<th-6;z+=8,i++){fL(g,vf,tu+1/32,u1,z-1,z,'#b9bec1');fR(g,u1,tv+1/32,vf,z-1,z,'#979da1');         // 樓板線
        if(i%2===0){fL(g,vf,tu+.035,u1-.07,z+.8,z+5.5,C.int);fL(g,vf,tu+.035,u1-.07,z+.8,z+1.4,'#5a4a3a');}              // 寬操練窗（含窗台陰影）
        else fL(g,vf,tu+.06,tu+.11,z+.8,z+6,C.int);                                                                   // 窄操練門洞
        if(o.stairR)fR(g,u1,vf-.1,vf-.06,z+.2,z+4.5,C.intD);                                                           // 梯台出入口（貼前角）
        else fR(g,u1,tv+.05,vf-.06,z+1.5,z+5.5,C.intD);}
      fL(g,vf,u1-.04,u1,z0,th,M.rL);fR(g,u1,vf-.04,vf,z0,th,M.rR);                                                     // 轉角紅條
      fL(g,vf,tu,u1,th-5,th,M.rL);fR(g,u1,tv,vf,th-5,th,M.rR);                                                         // 紅頂帶
      for(let t=tu+.03;t<u1-.02;t+=.04)fL(g,vf,t,t+.6/32,th-4.5,th-1,'#8f1f19');
      if(!z0){fL(g,vf,tu+.035,u1-.07,0,7,'#39414a');fL(g,vf,tu+.045,u1-.08,0,6.5,M.glD);
        if(ng)fL(ng,vf,tu+.045,u1-.08,0,6.5,C.lit);}
      quad(g,tu+.02,tv+.02,ts-.04,ts-.04,'#7f868a',th);});
    // +u 面外掛紅色之字逃生梯：兩端立柱、每層一段斜跑（方向交錯）＋層平台（亮面＋暗底），浮在牆面前 1px
    if(o.stairR)Sc.t(d+.0005,g=>{const st=8,a=tv+.03,b=vf-.05,us=u1+.03,zt=th-6;
      BL(g,P(us,a,z0),P(us,a,zt),'#7e1d17');BL(g,P(us,b,z0),P(us,b,zt),'#7e1d17');
      for(let z=z0,i=0;z+st<=zt;z+=st,i++){const L=i%2?a:b,R=i%2?b:a;
        BL(g,P(us,L,z+1),P(us,R,z+st-1),'#e2433a');
        BL(g,P(us,a,z+st),P(us,b,z+st),'#ef5145');BL(g,P(us,a,z+st-1),P(us,b,z+st-1),'#6e1a15');}});
    Sc.t(d+.001,g=>{for(let t=0;t<=4;t++){const p=P(tu+ts*t/4,vf,th);RC(g,p[0],p[1]-3,1,3,'#5d646a');const q=P(u1,tv+ts*t/4,th);RC(g,q[0],q[1]-3,1,3,'#5d646a');}
      BL(g,P(tu,vf,th+3),P(u1,vf,th+3),'#b9c0c5');BL(g,P(u1,tv,th+3),P(u1,vf,th+3),'#8a9297');});};
  // 紅色鋼構訓練塔（開放格構）：後柱與內梯在後；每層平台只畫前緣亮線＋下方暗線；可見三根角柱與兩面斜撐連續貫穿各層
  const towerSteel=(Sc,d,tu,tv,ts,th,step=11)=>{Sc.sh(tu,tv,ts,ts,Math.round(th*.5));const u1=tu+ts,v1=tv+ts,lv=[];for(let z=step;z<th-2;z+=step)lv.push(z);lv.push(th);
    Sc.t(d,g=>{BL(g,P(tu,tv,0),P(tu,tv,th),'#7a1d17');                                                                  // 後柱
      let za=0;lv.forEach((z,i)=>{const A_=i%2?P(u1-.04,v1-.04,za):P(tu+.05,tv+.05,za),B_=i%2?P(tu+.05,tv+.05,z):P(u1-.04,v1-.04,z);BL(g,A_,B_,'#7d868c');za=z;});   // 內梯
    });
    Sc.t(d+.05,g=>{let za=0;
      for(const z of lv){BL(g,P(tu,v1,za+1),P(u1,v1,z-1),'#c3342a');BL(g,P(u1,v1,za+1),P(tu,v1,z-1),'#c3342a');           // +v 面交叉斜撐
        BL(g,P(u1,v1,za+1),P(u1,tv,z-1),'#94261f');BL(g,P(u1,tv,za+1),P(u1,v1,z-1),'#94261f');za=z;}                      // +u 面交叉斜撐
      for(const z of lv){BL(g,P(tu,v1,z),P(u1,v1,z),'#e3e7e9');BL(g,P(u1,v1,z),P(u1,tv,z),'#b9c0c4');                   // 平台前緣亮線
        BL(g,P(tu,v1,z-1),P(u1,v1,z-1),'#4a5156');BL(g,P(u1,v1,z-1),P(u1,tv,z-1),'#3c4247');}                          // 下方暗線
      const top=th;BL(g,P(tu,v1,top+3),P(u1,v1,top+3),'#c9cfd2');BL(g,P(u1,v1,top+3),P(u1,tv,top+3),'#9aa2a7');            // 頂欄杆
      for(const[pu,pv]of[[tu,v1],[u1,v1],[u1,tv]]){const p=P(pu,pv,top);RC(g,Math.round(p[0]),Math.round(p[1])-3,1,3,'#9aa2a7');}
      BL(g,P(tu,v1,0),P(tu,v1,th),'#d2372c');BL(g,P(u1,tv,0),P(u1,tv,th),'#8f221b');                                       // 角柱
      {const a=P(u1,v1,0),b=P(u1,v1,th);BL(g,a,b,'#e0463a');BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],'#a3261f');}});};

  // v0 三門＋右後高塔：兩層白色板牆站房（二樓紅色鋁板帶＋帶狀玻璃窗）、一樓三扇紅框分節捲門（左門升起、雲梯車頭伸出）、
  //    屋頂格構天線＋警示燈、右後獨立白色高塔（紅轉角條、紅頂帶、逐層樓板線、頂欄杆）；前庭寬幅紅白禁停帶、右側草地樹與消防栓
  const af0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.1,C.concJ);
    quad(g,.76,.3,.24,.7,C.grass);specks(g,.76,.3,.24,.7,6,3001,[C.grassD,C.grassH]);
    quad(g,.74,.42,.26,.1,'#d8d4ca');
    hatchV(g,.06,.88,.66,.1,15);
    for(const u of [.07,.27,.29,.49,.51,.71])laneV(g,u,.62,.88,'#f1efe8');
    lotEdge(g);
    const u0=.04,v0=.1,u1=.74,v1=.6,hg=14,hh=26;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,M.wL,M.wR);
      fL(g,v1,u0,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      // 二樓紅鋁板帶＋帶狀窗
      fL(g,v1,u0,u1,hg,hh,M.rL);fR(g,u1,v0,v1,hg,hh,M.rR);
      fL(g,v1,u0+.03,u1-.03,17,22.5,C.frame);fL(g,v1,u0+.04,u1-.04,17.5,22,M.gl);fL(g,v1,u0+.04,u1-.04,21,22,M.glH);
      for(let t=u0+.1;t<u1-.03;t+=.07)fL(g,v1,t,t+.5/32,17.5,22,C.frame);
      fR(g,u1,v0+.03,v1-.03,17,22.5,C.frame);fR(g,u1,v0+.04,v1-.04,17.5,22,M.glD);
      for(let t=v0+.1;t<v1-.03;t+=.07)fR(g,u1,t,t+.5/32,17.5,22,C.frame);
      fL(g,v1,u0,u1,hh-1,hh,'#f4f5f4');fR(g,u1,v0,v1,hh-1,hh,'#d3d7d8');
      if(ng){let k=0;for(let t=u0+.04;t<u1-.04;t+=.07,k++)if(hsh(3002,k,1)<.7)fL(ng,v1,t+.5/32,Math.min(u1-.04,t+.07),17.5,22,C.lit);
        k=0;for(let t=v0+.04;t<v1-.04;t+=.07,k++)if(hsh(3003,k,1)<.6)fR(ng,u1,t+.5/32,Math.min(v1-.04,t+.07),17.5,22,'#f0cf8c');}
      // 三扇分節捲門（左門升起）
      sectL(g,ng,v1,.07,.27,12,{open:10});sectL(g,ng,v1,.29,.49,12);sectL(g,ng,v1,.51,.71,12);
      // 右面：一樓窗＋側門
      winsR(g,ng,u1,v0+.04,v1-.2,3,4,9.5,3,M.glD,C.lit,3004,.5,{});
      fR(g,u1,v1-.15,v1-.06,0,9,C.frame);fR(g,u1,v1-.14,v1-.07,0,8.5,'#8db6cc');if(ng)fR(ng,u1,v1-.14,v1-.07,0,8.5,C.litW);
      quad(g,u0+.02,v0+.02,u1-u0-.04,v1-v0-.04,M.roof,hh);
      doorLampL(g,ng,v1,.28,13.2);doorLampL(g,ng,v1,.5,13.2);
    });
    Sc.o(1.01,(g,ng)=>{boxZ(g,u0+.08,v0+.08,.16,.12,hh,3,'#d5d9db','#c3c8cb','#9aa1a6');                 // 屋頂設備
      boxZ(g,u0+.34,v0+.06,.12,.1,hh,5,'#b3b9bc','#d0d4d5','#a3a9ac');fL(g,v0+.16,u0+.37,u0+.43,hh,hh+4,'#5d6770');});
    mast(Sc,u0+.52,v0+.16,hh,20,1.012);beacon(Sc,u0+.2,v1-.06,hh,1.013);
    engineV(Sc,1.2,.095,.245,v1-.01,v1+.2,{cab:.08,ladder:1});
    towerW(Sc,1.05,.76,.05,.21,62,{stairR:1});
    const fa=flagPole(Sc,.02,.96,0,9,1.5);quad(g,0,.9,.06,.1,C.grass);
    tree(Sc,.95,.62,4,6,1.35,3005);shrub(Sc,.8,.9,1.5);hydrant(Sc,.76,.72,1.4);
    return {flagAt:fa};
  });

  // v1 雙門＋左前高塔：三層白色站房（右段紅色鋁板立面＋玻璃梯間）；一樓整條加高紅帶＋白色站名牌、兩扇寬紅框分節捲門（左門升起、雲梯車已駛出門外）、
  //    右前面一樓再一扇紅框分節捲門；屋頂天線與警示燈；左前角落地紅色開放鋼構訓練塔、左後小草坪樹；門前紅白禁停帶
  const af1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.1,C.concJ);
    quad(g,0,.02,.26,.5,C.grass);specks(g,0,.02,.26,.5,6,3101,[C.grassD,C.grassH]);
    quad(g,.02,.2,.24,.08,'#d8d4ca');
    hatchV(g,.3,.88,.56,.1,13);
    for(const u of [.32,.55,.6,.83])laneV(g,u,.58,.88,'#f1efe8');
    lotEdge(g);
    const u0=.28,v0=.06,u1=.96,v1=.56,hg=18,hh=36,us=.8;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,M.wL,M.wR);
      fL(g,v1,u0,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      for(const z of [hg+.5,hg+9.5]){winsL(g,ng,v1,u0+.02,us-.02,5,z+1.5,z+6.5,3,M.gl,C.lit,3102+z,.6,{gl:M.glH,sill:'#b9bec0'});
        winsR(g,ng,u1,v0+.03,v1-.03,5,z+1.5,z+6.5,3,M.glD,C.lit,3103+z,.5,{sill:'#9ea4a7'});}
      fL(g,v1,us,u1,hg,hh,M.rL);                                                                              // 右段紅鋁板＋玻璃梯間
      fL(g,v1,us+.03,u1-.03,hg+1,hh-2,C.frame);fL(g,v1,us+.04,u1-.04,hg+1.5,hh-2.5,M.gl);
      for(let z=hg+5;z<hh-3;z+=4.5)fL(g,v1,us+.04,u1-.04,z,z+.6,C.frame);
      if(ng)fL(ng,v1,us+.04,u1-.04,hg+1.5,hh-2.5,'#f3d89a');
      // 一樓：整條紅帶（門框頂到二樓窗台）＋一整塊白色站名牌
      fL(g,v1,u0,u1,hg-4.5,hg,M.rL);fR(g,u1,v0,v1,hg-4.5,hg,M.rR);fL(g,v1,u0,u1,hg-4.5,hg-3.9,'#9f231d');
      fL(g,v1,.36,.58,hg-3.5,hg-1.2,C.white);if(ng)fL(ng,v1,.36,.58,hg-3.5,hg-1.2,'#fff6e0');
      fL(g,v1,u0,u1,hh-1,hh,'#f4f5f4');fR(g,u1,v0,v1,hh-1,hh,'#d3d7d8');
      sectL(g,ng,v1,.32,.55,12,{open:10.5});sectL(g,ng,v1,.6,.83,12);
      fL(g,v1,.86,.93,0,9,C.frame);fL(g,v1,.865,.925,0,8.5,'#8db6cc');if(ng)fL(ng,v1,.865,.925,0,8.5,C.litW);
      // 右前面一樓：紅框分節捲門＋一扇窗
      sectR(g,ng,u1,v0+.07,v0+.27,12);
      winsR(g,ng,u1,v0+.34,v1-.04,2,4,10,3,M.glD,C.lit,3104,.4,{});
      quad(g,u0+.02,v0+.02,u1-u0-.04,v1-v0-.04,M.roof,hh);
      doorLampL(g,ng,v1,.575,13.5);
    });
    Sc.o(1.01,(g,ng)=>{boxZ(g,u0+.1,v0+.08,.18,.14,hh,3,'#d5d9db','#c3c8cb','#9aa1a6');});
    mast(Sc,u1-.12,v0+.12,hh,16,1.012);beacon(Sc,u0+.46,v1-.06,hh,1.013);beacon(Sc,u1-.06,v1-.06,hh,1.014);
    engineV(Sc,1.2,.355,.515,v1+.03,v1+.25,{cab:.08,ladder:1});
    towerSteel(Sc,1.3,.04,.62,.19,52,10);
    const fa=flagPole(Sc,.02,.97,0,9,1.5);
    tree(Sc,.2,.1,4,6,.95,3105);tree(Sc,.14,.4,4,6,.99,3106);shrub(Sc,.93,.9,1.5);hydrant(Sc,.9,.64,1.35);
    return {flagAt:fa};
  });

  // v2 轉角四門＋中後方形訓練塔：轉角站房，左前面兩扇、右前面兩扇紅框分節捲門（兩面各一台消防車駛出：雲梯車／水箱車），
  //    屋頂後角升起白色方形訓練塔（逐層樓板線＋開敞操練窗洞、紅色直條、紅色平頂＋欄杆）；屋頂天線與警示燈；兩面前庭紅白禁停帶交會於前角
  const af2=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.1,C.concJ);
    hatchV(g,.1,.9,.5,.08,11);
    for(let i=0;i<9;i++){const v=.12+i*.05;quad(g,.9,v,.08,.05,i%2?C.white:C.red);}
    for(const u of [.12,.33,.38,.59])laneV(g,u,.66,.9,'#f1efe8');
    for(const v of [.14,.35,.4,.61])BL(g,P(.66,v),P(.9,v),'#f1efe8');
    quad(g,.66,.66,.34,.34,C.grass);specks(g,.66,.66,.34,.34,5,3201,[C.grassD,C.grassH]);
    quad(g,0,0,.06,1,C.grass);quad(g,0,0,1,.05,C.grass);
    lotEdge(g);
    const u0=.08,v0=.08,u1=.66,v1=.64,hg=14,hh=24;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,M.wL,M.wR);
      fL(g,v1,u0,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      fL(g,v1,u0,u1,hg,hg+2,M.rL);fR(g,u1,v0,v1,hg,hg+2,M.rR);                                             // 紅色腰帶
      winsL(g,ng,v1,u0+.02,u1-.02,6,hg+3.5,hh-2,3,M.gl,C.lit,3202,.6,{gl:M.glH});
      winsR(g,ng,u1,v0+.02,v1-.02,6,hg+3.5,hh-2,3,M.glD,C.lit,3203,.5,{});
      fL(g,v1,u0,u1,hh-1,hh,'#f4f5f4');fR(g,u1,v0,v1,hh-1,hh,'#d3d7d8');
      sectL(g,ng,v1,.12,.33,12,{open:10});sectL(g,ng,v1,.38,.59,12);
      sectR(g,ng,u1,.14,.35,12);sectR(g,ng,u1,.4,.61,12,{open:10});
      quad(g,u0+.02,v0+.02,u1-u0-.04,v1-v0-.04,M.roof,hh);
      doorLampL(g,ng,v1,.355,13.2);doorLampR(g,ng,u1,.375,13.2);
    });
    // 屋頂方形訓練塔：白色塔身、逐層樓板線＋開敞操練窗洞、前角紅色直條、紅色平頂＋欄杆
    {const tu=.11,tv=.11,ts=.18,tz=44,vf=tv+ts,tu1=tu+ts;
      Sc.sh(tu,tv,ts,ts,tz+2);
      Sc.o(1.01,(g,ng)=>{boxZ(g,tu,tv,ts,ts,hh,tz-hh,null,M.wL,M.wR);
        for(let z=hh+1.5,i=0;z<tz-4;z+=7,i++){fL(g,vf,tu+.035,tu1-.06,z,z+4.5,C.int);fR(g,tu1,tv+.04,vf-.04,z,z+4.5,C.intD);
          if(i)fL(g,vf,tu+1/32,tu1,z-1.5,z-.5,'#b9bec1'),fR(g,tu1,tv+1/32,vf,z-1.5,z-.5,'#979da1');}
        fL(g,vf,tu1-.035,tu1,hh,tz,M.rL);fR(g,tu1,vf-.035,vf,hh,tz,M.rR);
        boxZ(g,tu-.012,tv-.012,ts+.024,ts+.024,tz,1.5,'#b8281f',M.rL,M.rR);});
      Sc.t(1.011,g=>{const z=tz+1.5;for(let t=0;t<=3;t++){const p=P(tu+ts*t/3,vf+.012,z);RC(g,Math.round(p[0]),Math.round(p[1])-3,1,3,'#5d646a');const q=P(tu1+.012,tv+ts*t/3,z);RC(g,Math.round(q[0]),Math.round(q[1])-3,1,3,'#5d646a');}
        BL(g,P(tu-.012,vf+.012,z+3),P(tu1+.012,vf+.012,z+3),'#b9c0c5');BL(g,P(tu1+.012,tv-.012,z+3),P(tu1+.012,vf+.012,z+3),'#8a9297');});}
    Sc.o(1.02,(g,ng)=>{boxZ(g,u0+.32,v0+.12,.14,.12,hh,3,'#d5d9db','#c3c8cb','#9aa1a6');});
    mast(Sc,u1-.08,v0+.09,hh,17,1.021);
    beacon(Sc,u1-.06,v1-.06,hh,1.03);
    engineV(Sc,1.2,.145,.305,v1-.01,v1+.21,{cab:.08,ladder:1});
    engineU(Sc,1.25,.425,.585,u1-.01,u1+.2,{cab:.08});
    const fa=flagPole(Sc,.03,.88,0,9,1.5);
    tree(Sc,.95,.06,4,6,1.0,3204);shrub(Sc,.93,.96,1.52);shrub(Sc,.97,.84,1.52);
    return {flagAt:fa};
  });

  // ================= 註冊 =================
  const put=(k,list)=>{const out=[];for(let i=0;i<list.length;i++){try{out[i]=list[i]();}catch(e){console.error('civ_a k'+k+' v'+i,e);}}
    for(let i=0;i<out.length;i++)if(out[i])B[k+'_1_'+i]=out[i];
    if(B[k+'_1_3']&&out[0])B[k+'_1_3']=B[k+'_1_0'];if(B[k+'_1_4']&&out[1])B[k+'_1_4']=B[k+'_1_1'];};
  try{put(6,[fs0,fs1,fs2]);}catch(e){console.error('civ_a k6',e);}
  try{put(30,[af0,af1,af2]);}catch(e){console.error('civ_a k30',e);}
});
