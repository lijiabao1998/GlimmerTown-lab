// civ_f：郵局 k15（v0 紅磚轉角鐘塔／v1 現代白色平頂＋鐘柱／v2 老式木構正面山牆＋門廊）
//        救護站 k28（v0 雙門兩層平頂＋屋頂警示燈／v1 三門正面山牆＋紅十字山牆／v2 單寬門三層＋屋頂直升機坪）
// 1×1、72×112、錨 36,110（開機讀舊物件沿用 w/h/ax/ay）。光從左：+v 面（左前）亮、+u 面（右前）暗；落影向右。
// 分層合成（沿用 civ_a）：每個立體件自成一層（二值化＋深色外框），細線件（旗桿、扶手、燈桿）不描框；夜光按層遮擋。
// Sc.s＝銳角描邊層（補上垂直邊與斜邊交會處缺的角格）：郵局 v1 樓身／方塔／空調箱、郵務車、救護車、擔架坡道用。
// 零亂數：只用 K.hsh。旗桿：繪製端 SPR.flag 自帶約 20px 桿身＋旗面，這裡只畫 11px 下段桿身＋2px 底座，flagAt＝本段桿頂。
(window.__variants574=window.__variants574||[]).push(function civ_f(A){
  const B=A.SPR().bld;
  const ref=B['15_1_0']||{w:72,h:112,ax:36,ay:110};
  const W=ref.w|0||72,H=ref.h|0||112,AX=ref.ax|0||36,AY=ref.ay|0||110;
  const K=A.iso575(W,H,AX,AY,1),{P,hsh,TOPY}=K;
  const REP={dims:{15:[W,H,AX,AY]},err:[],flag:{}};

  // ================= 像素工具 =================
  const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
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
  // 一排窗（+v 面／+u 面）：n 扇、寬 w 像素；o.gl 頂列反光、o.sill 窗台、o.lin 楣、o.mul 中橫檔、o.fr 窗框、o.arch 圓拱頂
  const winsL=(g,ng,v,ua,ub,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=ua+(ub-ua)*(i+.5)/n,a=t-w/64,b=t+w/64;
    if(o.fr)fL(g,v,a-1/32,b+1/32,z0-.5,z1+.5,o.fr);
    if(o.arch){fL(g,v,a,b,z0,z1-1,c);fL(g,v,a+1/32,b-1/32,z1-1,z1,c);if(o.lin)fL(g,v,a+.5/32,b-.5/32,z1,z1+1,o.lin);}
    else{fL(g,v,a,b,z0,z1,c);if(o.lin)fL(g,v,a-.5/32,b+.5/32,z1,z1+1,o.lin);}
    if(o.gl)fL(g,v,a,a+1/32,z1-(o.arch?2:1),z1-(o.arch?1:0),o.gl);if(o.sill)fL(g,v,a-.5/32,b+.5/32,z0-1,z0,o.sill);if(o.mul)fL(g,v,a,b,(z0+z1)/2-.5,(z0+z1)/2+.5,o.mul);
    if(o.bar)fL(g,v,t-.5/32,t+.5/32,z0,z1-(o.arch?1:0),o.bar);
    if(ng&&lit&&hsh(seed,i,z0|0)<p){fL(ng,v,a,b,z0,z1-(o.arch?1:0),lit);if(o.arch)fL(ng,v,a+1/32,b-1/32,z1-1,z1,lit);if(o.bar)fL(ng,v,t-.5/32,t+.5/32,z0,z1-(o.arch?1:0),'#8a6a40');}}};
  const winsR=(g,ng,u,va,vb,n,z0,z1,w,c,lit,seed,p=.6,o={})=>{for(let i=0;i<n;i++){const t=va+(vb-va)*(i+.5)/n,a=t-w/64,b=t+w/64;
    if(o.fr)fR(g,u,a-1/32,b+1/32,z0-.5,z1+.5,o.fr);
    if(o.arch){fR(g,u,a,b,z0,z1-1,c);fR(g,u,a+1/32,b-1/32,z1-1,z1,c);if(o.lin)fR(g,u,a+.5/32,b-.5/32,z1,z1+1,o.lin);}
    else{fR(g,u,a,b,z0,z1,c);if(o.lin)fR(g,u,a-.5/32,b+.5/32,z1,z1+1,o.lin);}
    if(o.gl)fR(g,u,b-1/32,b,z1-(o.arch?2:1),z1-(o.arch?1:0),o.gl);if(o.sill)fR(g,u,a-.5/32,b+.5/32,z0-1,z0,o.sill);if(o.mul)fR(g,u,a,b,(z0+z1)/2-.5,(z0+z1)/2+.5,o.mul);
    if(o.bar)fR(g,u,t-.5/32,t+.5/32,z0,z1-(o.arch?1:0),o.bar);
    if(ng&&lit&&hsh(seed,i,(z0|0)+50)<p){fR(ng,u,a,b,z0,z1-(o.arch?1:0),lit);if(o.arch)fR(ng,u,a+1/32,b-1/32,z1-1,z1,lit);if(o.bar)fR(ng,u,t-.5/32,t+.5/32,z0,z1-(o.arch?1:0),'#7a5c38');}}};

  // ================= 場景：分層描邊＋落影＋夜光遮擋 =================
  // 銳角描邊：先做一般 4 鄰描邊，再把「垂直邊與斜邊交會的頂角／底角」缺的那一格補上（不加粗斜邊），方塔、方箱的角不再被削圓
  const outlineSharp=c=>{const x=c.getContext('2d'),im=x.getImageData(0,0,W,H),a=im.data,M=new Uint8Array(W*H);
    const S=(X,Y)=>X>=0&&Y>=0&&X<W&&Y<H&&a[(Y*W+X)*4+3]>40,m=(X,Y)=>X>=0&&Y>=0&&X<W&&Y<H&&M[Y*W+X]===1;
    for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(!S(X,y)&&(S(X+1,y)||S(X-1,y)||S(X,y+1)||S(X,y-1)))M[y*W+X]=1;
    const add=[];
    for(let y=0;y<H;y++)for(let X=0;X<W;X++){if(S(X,y)||M[y*W+X])continue;
      for(const dx of [1,-1]){if((S(X+dx,y+1)&&m(X,y+1)&&m(X,y+2)&&m(X+dx,y))||(S(X+dx,y-1)&&m(X,y-1)&&m(X,y-2)&&m(X+dx,y))){add.push(y*W+X);break;}}}
    for(const i of add)M[i]=1;
    for(let i=0;i<W*H;i++)if(M[i]){a[i*4]=28;a[i*4+1]=34;a[i*4+2]=42;a[i*4+3]=255;}
    x.putImageData(im,0,0);};
  const scene=()=>{const items=[],SH=[];let n=0;
    return{
      o:(d,fn)=>items.push({d,ol:1,fn,i:n++}),
      s:(d,fn)=>items.push({d,ol:2,fn,i:n++}),
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
        for(const it of items){const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);it.fn(sx,lx);K.hard(sc);if(it.ol===2)outlineSharp(sc);else if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      }};};
  // 南兩斜邊以外一律清掉（外框、落影溢出保險）＋頂端兩列
  const clipLot=c=>{const g=c.getContext('2d');for(let y=AY-16;y<H;y++){const w=2*(AY-y);if(w<=0){g.clearRect(0,y,W,1);continue;}
    g.clearRect(0,y,Math.max(0,AX-w),1);g.clearRect(AX+w,y,W,1);}g.clearRect(0,0,W,2);};
  const sprite=(draw)=>{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const Sc=scene();const extra=draw(g,ng,Sc)||{};Sc.run(g,ng);clipLot(c);clipLot(nc);
    const o={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};if(extra.flagAt)o.flagAt=extra.flagAt;return o;};

  // ================= 色票 =================
  const C={
    grass:'#78a256',grassD:'#6a934b',grassH:'#88b265',
    conc:'#c9c6bd',concJ:'#b9b6ad',concH:'#d5d2c9',concD:'#a39f95',curbD:'#8a857b',curbL:'#d6d1c5',
    pave:'#d3ccbc',paveJ:'#c0b8a6',
    asph:'#6f6d69',asphE:'#8d8a84',
    brick:'#b0503c',brickD:'#823a2c',brickJ:'#9c4533',brickJD:'#71322a',
    stone:'#e4dbc6',stoneD:'#b8ad95',stoneB:'#9a8f78',
    slate:'#5d6570',slateD:'#454b55',slateJ:'#50575f',ridge:'#353a42',
    cu:'#74b39a',cuD:'#4f8a74',cuJ:'#62a088',
    red:'#cf2e26',redD:'#a3221c',redJ:'#ab251f',redH:'#e7493d',
    int:'#2a2522',intD:'#1d1a18',
    win:'#4d7090',winD:'#3c5a74',winGl:'#8fb3cc',frame:'#39434d',
    glass:'#5f8cab',glassD:'#486d86',glassH:'#a6c8dc',
    lit:'#ffe3a2',litW:'#fff1c8',lamp:'#ffe7b0',redN:'#ff5a46',blueN:'#6fb2ff',
    white:'#f2f0ea',wL:'#eef0ef',wR:'#c3c8ca',wT:'#d7dada',roofF:'#9aa0a3',
    hedge:'#4f8a3e',hedgeL:'#62a04c',hedgeD:'#3f7132',trunk:'#6b4a33',
    wood:'#c99f67',woodD:'#98733f',woodJ:'#b08a55',woodJD:'#7f5f33',trim:'#5b3b26',trimL:'#f0ead8',
    tile:'#58616d',tileD:'#444c57',tileJ:'#4b545f',
    grn:'#2f7d4f',grnD:'#23603c',grnH:'#3f9a63',
    yel:'#e9c33c',
  };

  // ================= 共用元件 =================
  const lotEdge=g=>{A.diaEdge(g,6,C.curbD,AX,TOPY,32);A.diaEdge(g,9,C.curbL,AX,TOPY,32);};
  const specks=(g,u0,v0,du,dv,n,seed,cols)=>{for(let i=0;i<n;i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v,0);RC(g,p[0],p[1],1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
  const joints=(g,u0,v0,du,dv,step,c)=>{for(let u=u0+step;u<u0+du-.001;u+=step)BL(g,P(u,v0),P(u,v0+dv),c);for(let v=v0+step;v<v0+dv-.001;v+=step)BL(g,P(u0,v),P(u0+du,v),c);};
  const asphalt=(g,u0,v0,du,dv)=>{quad(g,u0,v0,du,dv,C.asphE);quad(g,u0+.015,v0+.015,du-.03,dv-.03,C.asph);};
  const tree=(Sc,u,v,r,h,d,seed=1,pal)=>{const q=pal||['#3f7331','#548c3f','#6ea84f','#8cc063'];Sc.sh(u-.03,v-.03,.06,.06,h+r);
    Sc.o(d,g=>{const b=P(u,v,0);RC(g,b[0]-1,b[1]-h,2,h+1,C.trunk);RC(g,b[0],b[1]-h,1,h+1,'#523726');
      const cx=b[0],cy=b[1]-h-r+1;ell(g,cx,cy,r,r,q[0]);ell(g,cx-1,cy-1,r-1,r-1,q[1]);ell(g,cx-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),q[2]);
      for(let i=0;i<3;i++){RC(g,cx-r+2+((hsh(seed,i,1)*(2*r-3))|0),cy-r+2+((hsh(seed,i,2)*(2*r-3))|0),1,1,hsh(seed,i,3)<.5?q[3]:q[0]);}});};
  const shrub=(Sc,u,v,d,c=C.hedge)=>{Sc.o(d,g=>{const b=P(u,v,0);ell(g,b[0],b[1]-2,2,2,c);RC(g,b[0]-1,b[1]-3,2,1,C.hedgeL);});};
  const hedge=(Sc,u0,v0,du,dv,h,d)=>{Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,0,h,C.hedgeL,C.hedge,C.hedgeD);});};
  const bollard=(Sc,u,v,d,c='#e9c33c')=>{Sc.o(d,g=>{const p=P(u,v,0),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-4,1,4,c);RC(g,x,y-3,1,1,'#2b2b2b');});};
  // 矮庭園燈／路燈（細線層）
  const lampS=(Sc,u,v,h,d)=>{Sc.t(d,(g,ng)=>{const b=P(u,v,0),t=P(u,v,h),x=Math.round(t[0]),y=Math.round(t[1]),by=Math.round(b[1]);
    RC(g,x-1,by-1,3,1,'#4a5157');RC(g,x,y,1,by-1-y,'#5b636a');RC(g,x-1,y,1,by-1-y,'#7a838a');
    RC(g,x-1,y-2,3,1,'#2b3035');RC(g,x-1,y-1,3,1,'#3a4046');RC(g,x,y-1,1,1,'#f4e8c4');
    if(ng){RC(ng,x-1,y-1,3,1,'#ffeab8');RC(ng,x,y,1,1,'rgba(255,224,160,.55)');}});};
  // 古典燈柱（黑桿燈籠）
  const lampC=(Sc,u,v,h,d)=>{Sc.t(d,(g,ng)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x,y-h+2,1,h-2,'#2e3236');RC(g,x+1,y-h+3,1,h-3,'#4a5055');RC(g,x-1,y-1,3,1,'#2e3236');
    RC(g,x-1,y-h-1,3,1,'#2a2e32');RC(g,x-1,y-h,3,2,'#f3e2a8');RC(g,x,y-h-2,1,1,'#2a2e32');
    if(ng){RC(ng,x-1,y-h,3,2,'#ffe6a0');RC(ng,x-2,y-h+2,5,1,'rgba(255,226,160,.45)');}});};
  // 旗桿（細線層）：底座＋雙色下段桿身；回傳 flagAt＝本段桿頂（其上方留空給繪製端 SPR.flag）
  const flagPole=(Sc,u,v,h,d)=>{const b=P(u,v,0),x=Math.round(b[0]),by=Math.round(b[1]),y=by-h;
    Sc.o(d-.001,g=>{boxZ(g,u-.025,v-.025,.05,.05,0,2,'#d9d6cc','#c9c5ba','#a8a498');});
    Sc.t(d,g=>{RC(g,x-1,y,1,by-2-y,'#a9a9a3');RC(g,x,y,1,by-2-y,'#8a8a86');});
    return [x,y];};
  // 行人（細線層，2×6px）：o.leg 褲色、o.hair 髮色、o.bag 手提物
  const SHD=(c,k)=>A.shade?A.shade(c,k):c;
  const people=(Sc,d,list)=>Sc.t(d,g=>{for(const q of list){const p=P(q[0],q[1]),x=Math.round(p[0]),y=Math.round(p[1]),o=q[3]||{},sh=q[2],lg=o.leg||'#3a3f4d';
    RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SHD(lg,-14));RC(g,x,y-4,2,2,sh);RC(g,x+1,y-4,1,2,SHD(sh,-26));RC(g,x,y-5,2,1,o.skin||'#e8bf97');RC(g,x,y-6,2,1,o.hair||'#3a2c24');
    if(o.bag)RC(g,x+(o.bagL?-1:2),y-3,1,2,o.bag);}});
  // 門燈（+v 面／+u 面）
  const doorLampL=(g,ng,v,u,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,3,1,'#2c3136');RC(g,x,y,1,1,'#f3e6b8');if(ng){RC(ng,x-1,y,3,1,C.lamp);RC(ng,x,y+1,1,1,'rgba(255,231,176,.55)');}};
  const doorLampR=(g,ng,u,v,z)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,3,1,'#24282c');RC(g,x,y,1,1,'#e9dcae');if(ng){RC(ng,x-1,y,3,1,C.lamp);RC(ng,x,y+1,1,1,'rgba(255,231,176,.45)');}};
  // 磚縫（兩個可見面）：外側轉角端內縮 1px
  const brickL=(g,v,ua,ub,z0,z1,c,st=2)=>{for(let z=z0+st;z<z1;z+=st)BL(g,P(ua+1/32,v,z),P(ub,v,z),c);};
  const brickR=(g,u,va,vb,z0,z1,c,st=2)=>{for(let z=z0+st;z<z1;z+=st)BL(g,P(u,va+1/32,z),P(u,vb,z),c);};
  // 拱（+v 面）
  const archL=(g,v,ua,ub,za,rise,c)=>{const n=8,um=(ua+ub)/2,hw=(ub-ua)/2;fL(g,v,ua,ub,0,za+.2,c);
    for(let i=0;i<n;i++){const t0=-1+2*i/n,t1=-1+2*(i+1)/n,tm=(t0+t1)/2,zz=za+rise*Math.sqrt(Math.max(0,1-tm*tm));fL(g,v,um+hw*t0,um+hw*t1,za,zz,c);}};
  // 鐘面（螢幕座標 5×5 圓，中心 p）：石框另畫
  const clock5=(g,ng,p,rim='#2b2f33',face='#f4efdf')=>{const x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-1,y-2,3,1,rim);RC(g,x-1,y+2,3,1,rim);RC(g,x-2,y-1,1,3,rim);RC(g,x+2,y-1,1,3,rim);
    RC(g,x-1,y-1,3,3,face);RC(g,x,y-1,1,2,'#2b2f33');RC(g,x+1,y,1,1,'#2b2f33');
    if(ng){RC(ng,x-1,y-1,3,3,'#fff2c8');RC(ng,x,y-1,1,2,'#6b5a3a');RC(ng,x+1,y,1,1,'#6b5a3a');}};
  // 大鐘面（螢幕座標 7×7 圓：外圈 rim、內面 face、時針 10 點＋分針 12 點）
  const clock7=(g,ng,p,rim='#2b2f33',face='#f4efdf')=>{const x=Math.round(p[0]),y=Math.round(p[1]);
    ell(g,x,y,3,3,rim);ell(g,x,y,2,2,face);RC(g,x,y-2,1,2,'#2b2f33');RC(g,x-1,y-1,1,1,'#2b2f33');RC(g,x,y,1,1,'#2b2f33');
    if(ng){ell(ng,x,y,2,2,'#fff2c8');RC(ng,x,y-2,1,2,'#6b5a3a');RC(ng,x-1,y-1,1,1,'#6b5a3a');RC(ng,x,y,1,1,'#6b5a3a');}};
  // 信封徽記（螢幕座標，左上 x,y，5×4）
  const envelope=(g,x,y,bg,fg,ln)=>{x=Math.round(x);y=Math.round(y);if(bg)RC(g,x-1,y-1,7,6,bg);RC(g,x,y,5,4,fg);RC(g,x,y,1,1,ln);RC(g,x+1,y+1,1,1,ln);RC(g,x+2,y+2,1,1,ln);RC(g,x+3,y+1,1,1,ln);RC(g,x+4,y,1,1,ln);};
  // 四坡屋頂：屋脊沿長邊；可見坡＝+v（亮）與 +u（暗）
  const hip=(g,u0,v0,u1,v1,he,hr,e,col)=>{const um=(u0+u1)/2,vm=(v0+v1)/2,du=u1-u0,dv=v1-v0;
    const E0=P(u0-e,v0-e,he),E1=P(u1+e,v0-e,he),E2=P(u1+e,v1+e,he),E3=P(u0-e,v1+e,he);
    const lp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];let Ra,Rb;
    if(du>=dv){const r=dv/2+e;Ra=P(u0-e+r,vm,hr);Rb=P(u1+e-r,vm,hr);
      fp(g,[E0,E1,Rb,Ra],col.back);fp(g,[E0,Ra,E3],col.back);fp(g,[E3,E2,Rb,Ra],col.front);fp(g,[E1,E2,Rb],col.side);
      for(let i=1;i<col.n;i++){const t=i/col.n;BL(g,lp(E3,Ra,t),lp(E2,Rb,t),col.frontJ);BL(g,lp(E2,Rb,t),lp(E1,Rb,t),col.sideJ);}}
    else{const r=du/2+e;Ra=P(um,v0-e+r,hr);Rb=P(um,v1+e-r,hr);
      fp(g,[E0,E1,Ra],col.back);fp(g,[E0,Ra,Rb,E3],col.back);fp(g,[E3,E2,Rb],col.front);fp(g,[E1,E2,Rb,Ra],col.side);
      for(let i=1;i<col.n;i++){const t=i/col.n;BL(g,lp(E3,Rb,t),lp(E2,Rb,t),col.frontJ);BL(g,lp(E2,Rb,t),lp(E1,Ra,t),col.sideJ);}}
    BL(g,E3,E2,col.eave);BL(g,E2,E1,col.eaveD||col.eave);BL(g,Ra,Rb,col.ridge);BL(g,E2,Rb,col.ridge);
    return{Ra,Rb,E:[E0,E1,E2,E3]};};
  // 四角錐頂（塔頂）
  const pyramid=(g,u0,v0,u1,v1,z,hz,e,cF,cS,cE,cJ)=>{const E=[P(u0-e,v0-e,z),P(u1+e,v0-e,z),P(u1+e,v1+e,z),P(u0-e,v1+e,z)],ap=P((u0+u1)/2,(v0+v1)/2,z+hz);
    fp(g,[E[0],E[1],ap],cS);fp(g,[E[0],ap,E[3]],cF);
    fp(g,[E[3],E[2],ap],cF);fp(g,[E[1],E[2],ap],cS);
    if(cJ)for(let i=1;i<4;i++){const t=i/4,lp=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];BL(g,lp(E[3],ap),lp(E[2],ap),cJ);}
    BL(g,E[2],ap,cE);BL(g,E[3],E[2],'#2d3137');BL(g,E[2],E[1],'#2d3137');return ap;};
  // 正面山牆雙坡（屋脊沿 v，山牆在 +v 立面；看得到 +u 坡）
  const gableV=(g,u0,v0,u1,v1,he,hr,e,col)=>{const um=(u0+u1)/2,s=(hr-he)/(u1-um),zE=he-s*e;
    fp(g,[P(um,v0-e,hr),P(um,v1+e,hr),P(u1+e,v1+e,zE),P(u1+e,v0-e,zE)],col.roof);
    for(let i=1;i<col.n;i++){const f=i/col.n,u=um+(u1+e-um)*f,z=hr+(zE-hr)*f;BL(g,P(u,v0-e,z),P(u,v1+e,z),col.roofJ);}
    BL(g,P(u1+e,v0-e,zE),P(u1+e,v1+e,zE),col.eave||'#2b2f35');
    fp(g,[P(u0,v1,he-.2),P(u1,v1,he-.2),P(um,v1,hr)],col.gable);
    if(col.gableJ)for(let z=he+2;z<hr-1;z+=2){const f=(z-he)/(hr-he),a=u0+(um-u0)*f,b=u1-(u1-um)*f;BL(g,P(a+1/32,v1,z),P(b-1/32,v1,z),col.gableJ);}
    // 封簷板（兩列）
    for(let k=0;k<2;k++){const c=k?col.bargeD:col.barge;BL(g,[P(u0-e,v1+e,zE)[0],P(u0-e,v1+e,zE)[1]+k],[P(um,v1+e,hr)[0],P(um,v1+e,hr)[1]+k],c);
      BL(g,[P(um,v1+e,hr)[0],P(um,v1+e,hr)[1]+k],[P(u1+e,v1+e,zE)[0],P(u1+e,v1+e,zE)[1]+k],c);}
    BL(g,P(um,v1+e,hr),P(um,v0-e,hr),col.ridge);
    return{um,zE};};
  // 單坡雨遮（貼 +u 牆）：牆側高 zh、外緣低 zl
  const leanU=(g,u0,v0,v1,u1,zh,zl,cT,cE,cS)=>{fp(g,[P(u0,v0,zh),P(u0,v1,zh),P(u1,v1,zl),P(u1,v0,zl)],cT);
    fp(g,[P(u1,v0,zl),P(u1,v1,zl),P(u1,v1,zl-1.2),P(u1,v0,zl-1.2)],cE);fp(g,[P(u0,v1,zh),P(u1,v1,zl),P(u1,v1,zl-1.2),P(u0,v1,zh-1.2)],cS);};

  // ---- 郵筒 ----
  // 圓柱郵筒（丸型）：4px 寬、頂部圓帽
  const pillarBox=(Sc,u,v,d)=>{Sc.sh(u-.02,v-.02,.04,.04,9);Sc.o(d,g=>{const p=P(u,v,0),x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-2,y-8,4,8,C.red);RC(g,x-2,y-8,1,8,C.redH);RC(g,x+1,y-8,1,8,C.redD);
    RC(g,x-2,y-9,4,1,C.redD);RC(g,x-1,y-10,2,1,C.red);RC(g,x-1,y-10,1,1,C.redH);
    RC(g,x-1,y-7,2,1,'#2a1a18');RC(g,x-1,y-5,2,1,'#f0e6c8');RC(g,x-2,y-1,4,1,'#3a2a26');});};
  // 方型郵筒（台式）：箱體＋圓頂＋投遞口；c＝[亮,主,暗]
  const boxPost=(Sc,u,v,d,c)=>{Sc.sh(u-.03,v-.03,.06,.05,9);Sc.o(d,g=>{
    boxZ(g,u-.03,v-.025,.06,.05,0,1.2,'#3a3d40','#3a3d40','#2b2d30');
    boxZ(g,u-.028,v-.022,.056,.044,1.2,6.3,c[0],c[1],c[2]);
    const t=P(u,v,7.5),x=Math.round(t[0]),y=Math.round(t[1]);RC(g,x-2,y-1,4,1,c[1]);RC(g,x-1,y-2,2,1,c[0]);
    fL(g,v+.022,u-.02,u+.012,5,5.8,'#1f2224');fL(g,v+.022,u-.018,u+.01,2.5,3.5,'#f2eee2');});};

  // ---- 郵務車（沿 u：車頭朝 +u，車尾貼牆 u0）----
  const vanU=(Sc,d,va,vb,u0,u1,o={})=>{const hb=o.hb||8,hc=o.hc||6,uc=u1-(o.cab||.07),c=o.col;
    Sc.sh(u0,va,u1-u0,vb-va,hb);
    Sc.o(d,(g,ng)=>{
      boxZ(g,u0,va,uc-u0,vb-va,1,hb-1,c[0],c[1],c[2]);
      boxZ(g,uc,va,u1-uc,vb-va,1,hc-1,c[0],c[1],c[2]);
      fp(g,[P(uc,va,hc),P(uc,vb,hc),P(uc+.03,vb,hc),P(uc+.03,va,hc)],c[0]);
      fR(g,u1,va+.012,vb-.012,hc-3,hc-1,'#26313d');fR(g,u1,vb-.04,vb-.012,hc-2,hc-1,'#8fb0c4');
      fL(g,vb,uc+.01,u1-.012,hc-3,hc-1,'#2c3d4f');
      if(o.stripe){fL(g,vb,u0,u1,3,4,o.stripe);fR(g,u1,va,vb,3,4,o.stripe);}
      if(o.emb){const p=P(u0+.08,vb,6.8);envelope(g,p[0],p[1],null,o.emb[0],o.emb[1]);}
      fR(g,u1,va,vb,1,2,'#2e3135');
      {const a=P(u1,va+.02,2.2),b=P(u1,vb-.015,2.2);RC(g,a[0],a[1]-1,1,1,'#fff6d6');RC(g,b[0]-1,b[1]-1,1,1,'#fff6d6');
        if(ng){RC(ng,a[0],a[1]-1,1,1,'#fff3cc');RC(ng,b[0]-1,b[1]-1,1,1,'#fff3cc');}}
      for(const t of [u1-.04,u0+.05])fL(g,vb,t-.022,t+.022,0,1.8,'#202327');
      fL(g,vb,u0,u0+.012,1,hb-1,c[2]);
    });};
  // ---- 郵務車（沿 v：車頭朝 +v）----
  const vanV=(Sc,d,ua,ub,v0,v1,o={})=>{const hb=o.hb||8,hc=o.hc||6,vc=v1-(o.cab||.07),c=o.col;
    Sc.sh(ua,v0,ub-ua,v1-v0,hb);
    Sc.o(d,(g,ng)=>{
      boxZ(g,ua,v0,ub-ua,vc-v0,1,hb-1,c[0],c[1],c[2]);
      boxZ(g,ua,vc,ub-ua,v1-vc,1,hc-1,c[0],c[1],c[2]);
      fp(g,[P(ua,vc,hc),P(ub,vc,hc),P(ub,vc+.03,hc),P(ua,vc+.03,hc)],c[0]);
      fL(g,v1,ua+.012,ub-.012,hc-3,hc-1,'#26313d');fL(g,v1,ua+.012,ua+.04,hc-2,hc-1,'#8fb0c4');
      fR(g,ub,vc+.01,v1-.012,hc-3,hc-1,'#2a3746');
      if(o.stripe){fR(g,ub,v0,v1,3,4,o.stripe);fL(g,v1,ua,ub,3,4,o.stripe);}
      if(o.emb){const p=P(ub,v0+.1,6.6);envelope(g,p[0]-1,p[1],null,o.emb[0],o.emb[1]);}
      if(o.round){fp(g,[P(ua,v0,hb-.8),P(ub,v0,hb-.8),P(ub,v0,hb),P(ua,v0,hb)],c[0]);}
      fL(g,v1,ua,ub,1,2,'#2e3135');
      {const a=P(ua+.015,v1,2.2),b=P(ub-.02,v1,2.2);RC(g,a[0],a[1]-1,1,1,'#fff6d6');RC(g,b[0],b[1]-1,1,1,'#fff6d6');
        if(ng){RC(ng,a[0],a[1]-1,1,1,'#fff3cc');RC(ng,b[0],b[1]-1,1,1,'#fff3cc');}}
      for(const t of [v1-.04,v0+.05])fR(g,ub,t-.022,t+.022,0,1.8,'#202327');
    });};
  // ---- 小客車（沿 u 或 v 停）----
  const car=(Sc,u0,v0,dir,col,d)=>{const L=.18,Wd=.1,du=dir==='u'?L:Wd,dv=dir==='u'?Wd:L;Sc.sh(u0,v0,du,dv,5);
    Sc.o(d,g=>{boxZ(g,u0,v0,du,dv,.8,2.4,col[0],col[1],col[2]);
      const cu=dir==='u'?u0+.045:u0+.015,cv=dir==='u'?v0+.015:v0+.045,cdu=dir==='u'?du-.09:du-.03,cdv=dir==='u'?dv-.03:dv-.09;
      boxZ(g,cu,cv,cdu,cdv,3.2,1.8,col[0],'#3d5566','#2e3e4b');
      if(dir==='u'){fL(g,v0+dv,u0+.03,u0+.06,0,1,'#23262a');fL(g,v0+dv,u0+du-.06,u0+du-.03,0,1,'#23262a');}
      else{fR(g,u0+du,v0+.03,v0+.06,0,1,'#23262a');fR(g,u0+du,v0+dv-.06,v0+dv-.03,0,1,'#23262a');}});};
  // ---- 捲門（+v 面／+u 面）：open＝門扇下緣高度 ----
  // 門扇橫條用 2:1 整數線（BL）畫，每 2px 一條；避免分數高度在斜面上變成棋盤噪點
  const rollL=(g,ng,v,ua,ub,z1,o={})=>{const open=o.open||0,col=o.col||'#a9b0b5',colJ=o.colJ||'#8e969c',fr=o.fr||'#3b4046';
    fL(g,v,ua-1/32,ub+1/32,0,z1+1,fr);
    if(open>0){fL(g,v,ua,ub,0,open,o.int||C.int);fL(g,v,ua,ub,open-1,open,o.intD||C.intD);if(ng)fL(ng,v,ua+1/32,ub-1/32,1,open-1,'#f0cd86');}
    if(z1>open){fL(g,v,ua,ub,open,z1,col);for(let z=open+2;z<z1;z+=2)BL(g,P(ua+1/32,v,z),P(ub,v,z),colJ);
      fL(g,v,ua,ua+1/32,open,z1,o.colH||'#c7cdd1');fL(g,v,ua,ub,open,open+1,o.colB||colJ);
      if(o.win&&z1-open>6){fL(g,v,ua+2/32,ub-1/32,z1-4,z1-3,'#3d5566');}}};
  const rollR=(g,ng,u,va,vb,z1,o={})=>{const open=o.open||0,col=o.col||'#8a9298',colJ=o.colJ||'#737b81',fr=o.fr||'#2e3237';
    fR(g,u,va-1/32,vb+1/32,0,z1+1,fr);
    if(open>0){fR(g,u,va,vb,0,open,C.int);if(ng)fR(ng,u,va+1/32,vb-1/32,1,open-1,'#e2bd78');}
    if(z1>open){fR(g,u,va,vb,open,z1,col);for(let z=open+2;z<z1;z+=2)BL(g,P(u,va+1/32,z),P(u,vb,z),colJ);
      fR(g,u,va,vb,open,open+1,o.colB||colJ);
      if(o.win&&z1-open>6)fR(g,u,va+1/32,vb-2/32,z1-4,z1-3,'#2e3e4b');}};

  // =====================================================================
  // ================= 郵局 k15 =================
  // =====================================================================

  // 3×5 像素字（+v 面上寫字：每欄 1/32、每列 1px，斜面剪切由 fL 自動處理）
  const FONT={P:['###','#.#','###','#..','#..'],O:['###','#.#','#.#','#.#','###'],S:['###','#..','###','..#','###'],T:['###','.#.','.#.','.#.','.#.']};
  // 字本身不剪切（每個字直立、整數像素），字與字之間沿斜面逐字下移 → 階梯基線，字形不會被拆散
  const textL=(g,v,us,zTop,str,col)=>{let u=us;for(const ch of str){const f=FONT[ch],p=P(u,v,zTop),x=Math.round(p[0]),y=Math.round(p[1]);
    if(f)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(f[r][c]==='#')RC(g,x+c,y+r,1,1,col);u+=4/32;}};
  // 塔鐘（7×7：深色外圈、白面、10 點 10 分的 V 形指針＋12 點刻度）
  const clockV=(g,ng,p,rim='#2b2f33',face='#f6f1e2')=>{const x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-1,y-3,3,1,rim);RC(g,x-1,y+3,3,1,rim);RC(g,x-3,y-1,1,3,rim);RC(g,x+3,y-1,1,3,rim);
    RC(g,x-2,y-2,1,1,rim);RC(g,x+2,y-2,1,1,rim);RC(g,x-2,y+2,1,1,rim);RC(g,x+2,y+2,1,1,rim);
    RC(g,x-1,y-2,3,5,face);RC(g,x-2,y-1,5,3,face);
    RC(g,x,y-2,1,3,'#23262a');RC(g,x+1,y,1,1,'#23262a');                                                  // 分針指 12、時針指 3（相連）
    if(ng){RC(ng,x-1,y-2,3,5,'#fff2c8');RC(ng,x-2,y-1,5,3,'#fff2c8');RC(ng,x,y-2,1,3,'#5a4a30');RC(ng,x+1,y,1,1,'#5a4a30');}};
  // 從屋面升起的量體：兩個可見面的下緣沿屋面高度 RH(u,v) 走（塔、煙囪穿出坡頂時不會蓋到前方坡面）
  const riseBox=(g,a0,b0,a1,b1,zt,RH,top,left,right)=>{const N=24,L=[],R=[];
    for(let i=0;i<=N;i++){const u=a0+(a1-a0)*i/N;L.push(P(u,b1,RH(u,b1)));}
    for(let i=0;i<=N;i++){const v=b0+(b1-b0)*i/N;R.push(P(a1,v,RH(a1,v)));}
    if(left)fp(g,[...L,P(a1,b1,zt),P(a0,b1,zt)],left);
    if(right)fp(g,[...R,P(a1,b1,zt),P(a1,b0,zt)],right);
    if(top)fp(g,[P(a0,b0,zt),P(a1,b0,zt),P(a1,b1,zt),P(a0,b1,zt)],top);};
  // 只畫屋面以上的部分：+v 面水平線（磚縫）／+u 面水平線
  const clipLineL=(g,v,ua,ub,z,RH,c)=>{let a=null,b=null;for(let u=ua;u<=ub+1e-6;u+=1/64){if(RH(u,v)<=z-.6){if(a===null)a=u;b=u;}}if(a!==null&&b-a>=1/32)BL(g,P(a,v,z),P(b,v,z),c);};
  const clipLineR=(g,u,va,vb,z,RH,c)=>{let a=null,b=null;for(let v=va;v<=vb+1e-6;v+=1/64){if(RH(u,v)<=z-.6){if(a===null)a=v;b=v;}}if(a!==null&&b-a>=1/32)BL(g,P(u,a,z),P(u,b,z),c);};
  // 小信封徽（5×3，白底＋V 線）
  const env3=(g,x,y,fg,ln)=>{x=Math.round(x);y=Math.round(y);RC(g,x,y,5,3,fg);RC(g,x,y,1,1,ln);RC(g,x+4,y,1,1,ln);RC(g,x+1,y+1,1,1,ln);RC(g,x+3,y+1,1,1,ln);RC(g,x+2,y+2,1,1,ln);};
  // 郵務廂型車（沿 u、車頭朝 +u）：方正貨廂＋較低駕駛室、紅車身、白色小信封徽、無斜紋無梯架
  // 比例：長 .26、寬 .1、貨廂高 7、駕駛室高 5（窄而長，不會縮成一團）
  const postVanU=(Sc,d,va,vb,u0,u1,o={})=>{const hb=o.hb||7,hc=o.hc||5,uc=u1-(o.cab||.06),c=o.col||['#e5574a',C.red,C.redD];
    Sc.sh(u0,va,u1-u0,vb-va,hb);
    Sc.o(d,(g,ng)=>{
      boxZ(g,u0,va,uc-u0,vb-va,1,hb-1,c[0],c[1],c[2]);                                                   // 貨廂
      boxZ(g,uc,va,u1-uc,vb-va,1,hc-1,c[0],c[1],c[2]);                                                   // 駕駛室
      fR(g,u1,va+1/32,vb,hc-2,hc,'#1c232b');                                                               // 擋風玻璃（黑）
      fL(g,vb,uc+1/32,u1,hc-2,hc,'#1c232b');                                                               // 側窗
      fL(g,vb,uc-1/32,uc,1,hb,c[2]);                                                                       // 貨廂與車頭分縫
      {const p=P(u0+(uc-u0)/2,vb,hb-1.5);env3(g,p[0]-2.5,p[1],'#f6f2e6','#b5ad9c');}                       // 白色信封徽
      fL(g,vb,u0,u1,1,2,'#3a2220');fR(g,u1,va,vb,1,2,'#3a2220');                                          // 保險桿
      {const a=P(u1,va+.02,2.6),b=P(u1,vb-.015,2.6);RC(g,a[0],a[1]-1,1,1,'#fff6d6');RC(g,b[0]-1,b[1]-1,1,1,'#fff6d6');
        if(ng){RC(ng,a[0],a[1]-1,1,1,'#fff3cc');RC(ng,b[0]-1,b[1]-1,1,1,'#fff3cc');}}
      for(const t of [u1-.035,u0+.045])fL(g,vb,t-.022,t+.022,0,1.8,'#202327');
    });};
  // 郵務廂型車本體（沿 v、車頭朝 +v；座標一律 1/32 整格、高度整數）：
  //   c＝[貨廂頂, 前臉(+v), 長側(+u), 駕駛室頂]；頂面比白前臉暗一階 → 方箱三個面分得開，不會糊成白蛋
  //   前臉由下而上：1px 深色保險桿（兩端外凸 1px 當輪廓）｜1px 紅帶＋兩端車燈｜2px 黑擋風玻璃（左上 1px 反光）｜退縮的貨廂前臉
  //   長側：深色裙邊、紅帶、黑側窗、分縫、紅信封徽（只畫在 o.embV 指定的位置，讓它落在門外看得到的那段）
  const postVanBodyV=(g,ng,ua,ub,v0,v1,o)=>{const hb=o.hb||7,hc=o.hc||5,vc=v1-(o.cab||2/32),c=o.col;
    boxZ(g,ua,v0,ub-ua,vc-v0,1,hb-1,c[0],c[1],c[2]);                                                       // 貨廂
    boxZ(g,ua,vc,ub-ua,v1-vc,1,hc-1,c[3]||c[0],c[1],c[2]);                                                 // 駕駛室
    fL(g,vc,ua,ub,hc,hb,c[1]);                                                                             // 貨廂前臉（駕駛室頂以上）
    fL(g,v1,ua,ub,hc-2,hc,'#1c232b');fL(g,v1,ua,ua+1/32,hc-1,hc,'#9dbccd');                               // 擋風玻璃 2px＋反光
    fR(g,ub,vc+1/32,v1,hc-2,hc,'#1c232b');                                                                 // 側窗
    fR(g,ub,vc-1/32,vc,1,hb,o.seam||c[2]);                                                                 // 貨廂／駕駛室分縫
    if(o.stripe){fR(g,ub,v0,v1,2,3,o.stripe);fL(g,v1,ua,ub,2,3,o.stripe);}
    if(o.embV!=null){const p=P(ub,o.embV,hb-1.5);env3(g,p[0]-2.5,p[1],o.emb[0],o.emb[1]);}
    fL(g,v1,ua,ub,1,2,'#24272b');fR(g,ub,v0,v1,1,2,'#24272b');                                             // 深色保險桿／裙邊
    {const a=P(ua,v1,3),b=P(ub,v1,3);RC(g,Math.round(a[0]),Math.round(a[1]),1,1,'#fff3c4');RC(g,Math.round(b[0])-1,Math.round(b[1]),1,1,'#fff3c4');
      if(ng){RC(ng,Math.round(a[0]),Math.round(a[1]),1,1,'#fff3cc');RC(ng,Math.round(b[0])-1,Math.round(b[1]),1,1,'#fff3cc');}}
    for(const t of [v1-1.5/32,v0+1.5/32])fR(g,ub,t-1/32,t+1/32,0,2,'#1d2024');};
  // 平頭廂型郵務車（沿 v、車頭朝 +v；step van：前臉一整面平的，比「低駕駛室＋高貨廂」在 5px 寬時好認）：
  //   c＝[頂, 前臉(+v), 長側(+u)]；頂面比白前臉暗一階。前臉由上而下：1px 白車頂緣｜2px 黑擋風玻璃（左上 1px 反光）｜1px 白＋兩端黃車燈｜1px 紅帶｜1px 深色保險桿
  //   長側：深色裙邊、紅帶（與前臉同高、繞過車角）、前端 2px 黑側窗、兩個輪
  const stepVanV=(g,ng,ua,ub,v0,v1,o)=>{const hb=o.hb||7,c=o.col;
    boxZ(g,ua,v0,ub-ua,v1-v0,1,hb-1,c[0],c[1],c[2]);
    fL(g,v1,ua,ub,hb-3,hb-1,'#1c232b');fL(g,v1,ua,ua+1/32,hb-2,hb-1,'#9dbccd');                           // 擋風玻璃
    fR(g,ub,v1-2/32,v1,hb-3,hb-1,'#1c232b');                                                               // 前端側窗
    fL(g,v1,ua,ub,2,3,o.stripe);fR(g,ub,v0,v1,2,3,o.stripe);                                               // 紅帶
    fL(g,v1,ua,ub,1,2,'#24272b');fR(g,ub,v0,v1,1,2,'#24272b');                                             // 保險桿／裙邊
    {const a=P(ua,v1,4),b=P(ub,v1,4);RC(g,Math.round(a[0]),Math.round(a[1]),1,1,'#f4c95a');RC(g,Math.round(b[0])-1,Math.round(b[1]),1,1,'#f4c95a');
      if(ng){RC(ng,Math.round(a[0]),Math.round(a[1]),1,1,'#fff3cc');RC(ng,Math.round(b[0])-1,Math.round(b[1]),1,1,'#fff3cc');}}
    for(const t of [v1-1.5/32,v0+1.5/32])fR(g,ub,t-1/32,t+1/32,0,2,'#1d2024');};
  // 只保留遮罩內的像素（遮罩與內容都是整數列掃描填色，不經 canvas clip，不產生半透明邊）
  const masked=(g,mask,draw)=>{const[tc,tx]=A.cv(W,H),[mc,mx]=A.cv(W,H);draw(tx);mask(mx);tx.globalCompositeOperation='destination-in';tx.drawImage(mc,0,0);g.drawImage(tc,0,0);};
  // 從門洞駛出的車（沿 v、車頭朝 +v）：o.door＝{v,a,b,zt}；車身 v<door.v 的部分在門內，只在門洞（立面 v 上 u∈[a,b]、z<zt）內看得到；
  //   門外部分照常。落影只算門外那段。body(g,ng) 畫完整車身。
  const inDoorV=(Sc,d,ua,ub,v0,v1,o,body)=>{const D=o.door,hb=o.hb||8,hc=o.hc||5,vc=v1-(o.cab||3/32);
    const vo=D?Math.max(v0,D.v):v0;if(v1>vo)Sc.sh(ua,vo,ub-ua,v1-vo,hb);
    Sc.s(d,(g,ng)=>{
      if(!D){body(g,ng);return;}
      const mask=mx=>{fL(mx,D.v,D.a,D.b,0,D.zt,'#000');
        if(v1>D.v){const s=Math.max(v0,D.v);if(vc>s)boxZ(mx,ua,s,ub-ua,vc-s,0,hb,'#000','#000','#000');boxZ(mx,ua,Math.max(vc,s),ub-ua,v1-Math.max(vc,s),0,hc,'#000','#000','#000');
          if(o.bar&&vc>=D.v)boxZ(mx,ua,vc-1/32,ub-ua,1/32,hb,2,'#000','#000','#000');}};                          // 車頂燈條
      masked(g,mask,x=>body(x,null));
      if(ng)masked(ng,mask,x=>{const jx=A.cv(W,H)[1];body(jx,x);});
    });};

  // v0 紅磚後段鐘塔：兩層紅磚主樓（石材牆腳、全寬「POST」石招牌帶、拱形正門＋石階、拱窗、窗楣、簷口）＋石板瓦四坡頂；
  //    鐘塔從屋頂後段（北角）升起：紅磚塔身、石帶、+v 面大鐘、+u 面鐘樓百葉、銅綠四角尖頂；
  //    右側柏油卸貨場：+u 面捲門＋鋼構雨遮、紅色方正郵務廂型車倒車貼門；左前石板前庭：紅色圓郵筒、旗桿；右前草地矮籬、後角樹
  const po0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.pave);joints(g,0,0,1,1,.1,C.paveJ);
    asphalt(g,.64,.02,.36,.6);
    BL(g,P(.66,.3),P(.97,.3),'#d8c25a');BL(g,P(.66,.08),P(.97,.08),'#d8c25a');                             // 卸貨車位黃線
    quad(g,.7,.66,.3,.34,C.grass);specks(g,.7,.66,.3,.34,6,1501,[C.grassD,C.grassH]);
    quad(g,0,.7,.05,.3,C.grass);
    lotEdge(g);
    const u0=.06,v0=.06,u1=.62,v1=.58,he=25,hr=35,e=.03;
    const tu0=.06,tv0=.06,tu1=.34,tv1=.34,th=53;
    const sl=(hr-he)/((v1-v0)/2+e),RH=(u,v)=>Math.min(hr,he+sl*Math.min(u-u0+e,v-v0+e,u1+e-u,v1+e-v));    // 四坡頂屋面高度
    Sc.sh(u0,v0,u1-u0,v1-v0,he+8);Sc.sh(tu0,tv0,tu1-tu0,tv1-tv0,th+12);
    tree(Sc,.93,.05,4,6,.5,1502);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,C.brick,C.brickD);
      brickL(g,v1,u0,u1,0,he,C.brickJ);brickR(g,u1,v0,v1,0,he,C.brickJD);
      fL(g,v1,u0,u1,0,2,C.stoneD);fR(g,u1,v0,v1,0,2,C.stoneB);                                              // 石材牆腳
      for(let z=2;z<he-2;z+=4){fL(g,v1,u1-2/32,u1,z,z+2,C.stone);fR(g,u1,v1-1/32,v1,z+2,z+4,C.stoneD);}      // 南角隅石
      // 全寬石招牌帶＋「POST」字（3×5 深色字、置中於正門上方）
      fL(g,v1,u0,u1,10,17,C.stone);fR(g,u1,v0,v1,10,17,C.stoneD);fL(g,v1,u0,u1,10,11,C.stoneD);fR(g,u1,v0,v1,10,11,C.stoneB);
      textL(g,v1,(u0+u1)/2-7.5/32,16,'POST','#3a2a22');
      if(ng)textL(ng,v1,(u0+u1)/2-7.5/32,16,'POST','#ffe6b0');
      // +u 面招牌帶上的紅底白信封
      {fR(g,u1,.4,.52,11,16,C.redD);const p=P(u1,.46,15.2);envelope(g,p[0]-2.5,p[1],null,'#f4f1e6','#a39b88');if(ng)envelope(ng,p[0]-2.5,p[1],null,'#fff0d0','#b09a70');}
      fL(g,v1,u0,u1,he-2,he,C.stone);fR(g,u1,v0,v1,he-2,he,C.stoneD);                                    // 簷口
      // 一樓：正門左右各一扇拱窗；二樓四窗
      winsL(g,ng,v1,u0,.26,1,3,9,3,C.win,C.lit,1511,.8,{gl:C.winGl,sill:C.stone,arch:1,bar:'#e8e2d2'});
      winsL(g,ng,v1,.42,u1,1,3,9,3,C.win,C.lit,1515,.8,{gl:C.winGl,sill:C.stone,arch:1,bar:'#e8e2d2'});
      winsL(g,ng,v1,u0+.02,u1-.02,4,18,22,2,C.win,C.lit,1512,.6,{gl:C.winGl,sill:C.stone,lin:C.stone});
      // 拱形正門（石框＋雙扇木門＋扇形窗）
      {const da=.34-2/32,db=.34+2/32;
        archL(g,v1,da-1/32,db+1/32,7,2.6,C.stone);archL(g,v1,da,db,7,2,'#4a3226');
        fL(g,v1,.34-.5/32,.34+.5/32,0,7,'#2e1f17');fL(g,v1,da,db,7,8.2,'#8fb3cc');
        if(ng){fL(ng,v1,da,db,7,8.2,C.lit);fL(ng,v1,da,.34-.5/32,1,6.6,'#e8b86a');fL(ng,v1,.34+.5/32,db,1,6.6,'#e8b86a');}}
      // +u 面：卸貨捲門、小窗、樓上窗
      rollR(g,ng,u1,.1,.26,9);
      winsR(g,ng,u1,.29,.38,1,3,9,2,C.winD,C.lit,1513,.6,{sill:C.stoneB});
      winsR(g,ng,u1,v0+.02,v1-.02,3,18,22,2,C.winD,C.lit,1514,.5,{sill:C.stoneB,lin:C.stoneD});
    });
    // 石板瓦四坡頂
    Sc.o(1.01,g=>{hip(g,u0,v0,u1,v1,he,hr,e,{back:C.slateD,front:C.slate,side:C.slateD,frontJ:C.slateJ,sideJ:'#3d434c',eave:'#2d3137',ridge:C.ridge,n:5});});
    // 後段鐘塔（北角穿出屋面）：下緣沿屋面；磚縫只畫屋面以上
    Sc.o(1.02,(g,ng)=>{
      riseBox(g,tu0,tv0,tu1,tv1,th,RH,null,C.brick,C.brickD);
      for(let z=28;z<th-2;z+=2){clipLineL(g,tv1,tu0+1/32,tu1,z,RH,C.brickJ);clipLineR(g,tu1,tv0+1/32,tv1,z,RH,C.brickJD);}
      // 下段：窄拱窗（兩面）
      fL(g,tv1,.2-1/32,.2+1/32,35,39,C.win);fL(g,tv1,.2-.5/32,.2+.5/32,39,40,C.win);fL(g,tv1,.2-1.5/32,.2+1.5/32,34,35,C.stone);
      fR(g,tu1,.2-1/32,.2+1/32,35,39,C.winD);fR(g,tu1,.2-.5/32,.2+.5/32,39,40,C.winD);fR(g,tu1,.2-1.5/32,.2+1.5/32,34,35,C.stoneD);
      if(ng){fL(ng,tv1,.2-1/32,.2+1/32,35,39,C.lit);}
      fL(g,tv1,tu0,tu1,41,42,C.stone);fR(g,tu1,tv0,tv1,41,42,C.stoneD);                                    // 鐘座石帶
      // 鐘面（+v 面 7px 白底圓鐘、V 形指針）；+u 面鐘樓百葉
      clockV(g,ng,P(.2,tv1,46.5));
      fR(g,tu1,.2-2/32,.2+2/32,43,50,'#2e2523');for(let z=44;z<50;z+=2)BL(g,P(tu1,.2-2/32,z),P(tu1,.2+2/32,z),'#6a5448');
      fL(g,tv1,tu0,tu1,th-2,th,C.stone);fR(g,tu1,tv0,tv1,th-2,th,C.stoneD);                                // 鐘樓簷口
    });
    Sc.o(1.021,g=>{const ap=pyramid(g,tu0,tv0,tu1,tv1,th,12,.025,C.cu,C.cuD,'#3f6f5d',C.cuJ);RC(g,ap[0],ap[1]-4,1,4,'#c9a64a');RC(g,ap[0]-1,ap[1]-2,3,1,'#c9a64a');});
    // 右側卸貨：郵務廂型車（倒車貼門）＋鋼構雨遮
    postVanU(Sc,1.05,.13,.23,u1+.005,u1+.265);
    // 卸貨門懸挑雨遮（貼牆、斜撐，無落地柱）
    Sc.o(1.04,g=>{boxZ(g,u1,.08,.06,.2,11,1,'#7b828a','#5f666e','#4b5159');});
    // 石階（兩級）
    Sc.o(1.12,g=>{boxZ(g,.34-3.5/32,v1,7/32,.08,0,1,C.concH,C.stone,C.stoneD);boxZ(g,.34-3.5/32,v1,7/32,.04,1,1,C.concH,C.stone,C.stoneD);});
    // 前庭：郵筒、旗桿、灌木
    pillarBox(Sc,.44,.9,1.3);
    people(Sc,1.31,[[.6,.86,'#4f7fb0',{bag:'#f4f1e6',bagL:1}],[.2,.8,'#b5813d',{leg:'#4a4a52',hair:'#6b4a2e'}]]);
    const fa=flagPole(Sc,.08,.9,13,1.4);                                                               // 下段桿身 11px（底座以上約 9px）
    hedge(Sc,.74,.7,.035,.28,3,1.35);shrub(Sc,.9,.88,1.5);
    return {flagAt:fa};
  });

  // v1 現代白色平頂：三層白色金屬板方盒（窄帶窗、樓層間露白牆；女兒牆一道紅色招牌帶＋白字塊＋白色壓頂）；
  //    一樓左段落地玻璃大廳＋懸挑白色雨遮、右端郵務車庫（捲門半開、白底紅帶郵務車駛出，靠近右側停車場）；
  //    屋頂西側退縮一座銳邊紅色方塔（+v 面 7px 白鐘、+u 面白信封、平整淺灰頂面）＋兩台方正空調箱；
  //    大廳左端紅郵筒、右端綠郵筒（左右分開，不與郵務車擠在同一角）；右側員工停車＋後角樹；右前草地
  const po1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.125,C.concJ);
    quad(g,.03,.53,.38,.47,'#dcd8ce');joints(g,.03,.53,.38,.47,.08,'#cbc6ba');                              // 大廳前鋪面
    asphalt(g,.41,.53,.25,.47);for(const u of [.425,.645])BL(g,P(u,.55),P(u,.98),C.yel);                   // 車庫出入柏油＋黃邊線
    asphalt(g,.68,.03,.32,.5);for(const v of [.05,.28,.51])BL(g,P(.7,v),P(.97,v),'#e6e2d6');
    quad(g,.72,.6,.28,.4,C.grass);specks(g,.72,.6,.28,.4,6,1521,[C.grassD,C.grassH]);
    lotEdge(g);
    // 全部對齊 1/32 格（整數 x）：立面寬 19px；塔身 +v 面 9px、+u 面 8px，自立面退縮 2/32（與紅帶之間隔一道白壓頂＋屋面）
    const u0=2/32,v0=2/32,u1=21/32,v1=17/32,hh=33,tu0=3/32,tu1=12/32,tv0=7/32,tv1=15/32,th=53;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh+2);Sc.sh(tu0,tv0,tu1-tu0,tv1-tv0,th);
    tree(Sc,.93,.06,4,6,.5,1522);
    car(Sc,.74,.3,'u',['#7fa2c4','#5b7fa6','#46668a'],.9);
    Sc.s(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,C.wL,C.wR);
      fL(g,v1,u0,u1,0,1,'#9da3a6');fR(g,u1,v0,v1,0,1,'#80878a');                                         // 牆腳
      // 二、三樓窄帶窗：1px 深色窗楣＋3px 玻璃（頂列反光），豎框每 4px；帶與帶之間露 4px 白牆
      for(const z of [14,22]){const la=u0+2/32,lb=u1-2/32,ra=v0+2/32,rb=v1-2/32,S4=4/32;
        fL(g,v1,la-1/32,lb+1/32,z,z+4,C.frame);fL(g,v1,la,lb,z,z+3,C.glass);fL(g,v1,la,lb,z+2,z+3,'#86aec6');
        fR(g,u1,ra-1/32,rb+1/32,z,z+4,C.frame);fR(g,u1,ra,rb,z,z+3,C.glassD);fR(g,u1,ra,rb,z+2,z+3,'#6f93ab');
        let k=0;for(let t=la;t<lb-.001;t+=S4,k++){if(t>la)fL(g,v1,t,t+1/32,z,z+3,C.frame);if(ng&&hsh(1523,k,z)<.65)fL(ng,v1,t+(t>la?1/32:0),Math.min(lb,t+S4),z,z+3,C.lit);}
        k=0;for(let t=ra;t<rb-.001;t+=S4,k++){if(t>ra)fR(g,u1,t,t+1/32,z,z+3,C.frame);if(ng&&hsh(1524,k,z)<.5)fR(ng,u1,t+(t>ra?1/32:0),Math.min(rb,t+S4),z,z+3,C.lit);}}
      // 女兒牆：唯一一道紅色招牌帶（3px）＋白字塊＋1px 白色壓頂
      fL(g,v1,u0,u1,29,32,C.red);fR(g,u1,v0,v1,29,32,C.redD);
      fL(g,v1,u0,u1,32,33,'#f7f8f7');fR(g,u1,v0,v1,32,33,'#d3d7d8');
      for(let i=0;i<5;i++){const t=u0+3/32+i*3/32;fL(g,v1,t,t+2/32,30,31,'#f6f2e8');if(ng)fL(ng,v1,t,t+2/32,30,31,'#fff6e0');}
      // 一樓：左段落地玻璃大廳（自動門居中）＋右端郵務車庫（5px 門洞、捲門半開：下 8px 開口、上 4px 門扇＋橫條）；兩者之間與東角各留 1px 白牆
      {const la=4/32,lb=11/32;fL(g,v1,la-1/32,lb+1/32,0,11,C.frame);fL(g,v1,la,lb,0,10,C.glass);fL(g,v1,la,lb,9,10,C.glassH);
        if(ng)fL(ng,v1,la,lb,0,10,C.lit);
        fL(g,v1,5/32,10/32,0,8,'#2b3137');fL(g,v1,6/32,9/32,0,7,'#8db6cc');if(ng)fL(ng,v1,6/32,9/32,0,7,C.litW);}   // 自動門
      rollL(g,ng,v1,14/32,19/32,12,{open:9,fr:'#5d646a',col:'#c3c9cd',colJ:'#949ca2',colH:'#dde1e3',colB:'#6d757b',int:'#35302c',intD:'#25211e'});
      // 右面一樓窗
      winsR(g,ng,u1,v0+.04,v1-.04,3,3,9,3,C.glassD,C.lit,1525,.5,{fr:C.frame});
      quad(g,u0,v0,u1-u0,v1-v0,'#e4e7e6',hh);quad(g,u0+1/32,v0+1/32,u1-u0-2/32,v1-v0-2/32,C.roofF,hh);
    });
    // 屋頂兩台方正空調箱（整數格、銳邊；大台頂面一格深色風扇）
    Sc.s(1.01,g=>{boxZ(g,14/32,3/32,5/32,4/32,hh,4,'#d5d9db','#c3c8cb','#9aa1a6');quad(g,15/32,4/32,3/32,2/32,'#6d757b',hh+4);
      boxZ(g,15/32,10/32,4/32,3/32,hh,3,'#d5d9db','#c3c8cb','#9aa1a6');});
    // 屋頂西側白色方塔（現代鐘柱）：白色金屬板＋淺灰板縫；只有 +u 暗面正中一道 2px 紅色直條（紅色面積約一成）；
    //    +v 亮面上段正中單獨一面 7px 鐘（整座塔只有這一個圓，不再與信封並排成「兩隻眼」）；2px 白色壓頂＋1px 陰影線＋平整頂面
    Sc.s(1.02,(g,ng)=>{boxZ(g,tu0,tv0,tu1-tu0,tv1-tv0,hh,th-hh,null,C.wL,C.wR);
      for(const z of [hh+6,hh+11]){BL(g,P(tu0+1/32,tv1,z),P(tu1,tv1,z),'#d3d7d8');BL(g,P(tu1,tv0+1/32,z),P(tu1,tv1,z),'#aab0b3');}
      {const vm=(tv0+tv1)/2;fR(g,tu1,vm-1/32,vm+1/32,hh,th-3,C.redD);}
      {const p=P((tu0+tu1)/2,tv1,th-9);clockV(g,ng,[p[0]-.5,p[1]]);}
      fL(g,tv1,tu0,tu1,th-3,th-2,'#c3c8ca');fR(g,tu1,tv0,tv1,th-3,th-2,'#979ea2');
      fL(g,tv1,tu0,tu1,th-2,th,'#fbfbfa');fR(g,tu1,tv0,tv1,th-2,th,'#d3d7d8');quad(g,tu0,tv0,tu1-tu0,tv1-tv0,'#a7adb0',th);});
    // 大廳雨遮：懸挑白板＋兩根細柱，雨遮下兩盞筒燈；雨遮上立紅底白信封燈箱（郵政徽記唯一的位置）
    Sc.s(1.05,(g,ng)=>{boxZ(g,3/32,v1,9/32,3/32,11,2,'#f4f5f4','#e1e4e4','#b9bec0');
      if(ng){for(const t of [5/32,10/32]){const p=P(t,v1+2.5/32,11);RC(ng,p[0],p[1],2,1,'#fff0c8');}}});
    Sc.t(1.051,g=>{for(const t of [3.5/32,11.5/32]){const b=P(t,v1+2.5/32,0),p=P(t,v1+2.5/32,11);RC(g,b[0],p[1],1,Math.round(b[1]-p[1]),'#8d959a');}});
    Sc.s(1.055,(g,ng)=>{const a=4/32,b=11/32,vv=v1+1/32;boxZ(g,a,vv,b-a,1/32,13,8,'#e7493d',C.red,C.redD);
      const p=P((a+b)/2,vv+1/32,17);envelope(g,p[0]-2.5,p[1]-2,null,'#f8f5ec',C.redD);
      if(ng){fL(ng,vv+1/32,a,b,13,21,'#ff5a46');envelope(ng,p[0]-2.5,p[1]-2,null,'#fff4dc','#c0402e');}});
    // 郵務廂型車：白色平頭車（頂面暗一階）＋紅帶，從半開的捲門下駛出（車尾 2/32 仍在門內，只從門洞看得到；車頂與門扇之間留 2px 暗縫）
    inDoorV(Sc,1.1,14/32,19/32,15/32,23/32,{door:{v:v1,a:14/32,b:19/32,zt:9},hb:7,hc:7,cab:0},
      (g,ng)=>stepVanV(g,ng,14/32,19/32,15/32,23/32,{hb:7,col:['#d0d5d8','#f6f7f6','#c9ced1'],stripe:C.red}));
    people(Sc,1.22,[[.3,.72,'#c24a3a',{leg:'#2f3440'}],[.8,.56,'#3f6f96',{hair:'#8a6a44',bag:'#c9a66a'}]]);
    // 紅、綠兩座方型郵筒並排在大廳左前（同一條螢幕水平線、相隔 4px），不擋自動門、不與駛出的郵務車擠在一起
    boxPost(Sc,.07,.75,1.2,['#e9574b',C.red,C.redD]);boxPost(Sc,.14,.68,1.19,['#4aa872',C.grn,C.grnD]);
    shrub(Sc,.9,.9,1.4);shrub(Sc,.96,.74,1.4);
    lampS(Sc,.06,.96,12,1.5);
    return {};
  });

  // v2 老式木構（西部假立面）：兩層木造（赭黃雨淋板、白色轉角板與窗框）、正面假立面高出屋頂（深綠簷口與托架、「POST OFFICE」木招牌、
  //    中央升起鐘板＋小尖頂）；通長木棧門廊（鐵皮單坡頂、三根白木柱、中央木階）；後方雙坡鐵皮頂＋紅磚煙囪；
  //    右面（+u）側門＋小雨遮，墨綠老郵務車並停於碎石車道；門廊前紅色圓郵筒、古典燈柱；後角樹
  const po2=()=>sprite((g,ng,Sc)=>{
    const CL='#d9b86a',CD='#a8894a',CJ='#c4a258',CJD='#94773c',TR='#f0ead8',TRD='#c9c2ae',GN='#2f5d45',GND='#23473a';
    A.dia(g,AX,TOPY,32,C.grass);specks(g,0,0,1,1,12,1531,[C.grassD,C.grassH]);
    quad(g,.64,.02,.34,.66,'#b3a88f');specks(g,.64,.02,.34,.66,16,1532,['#a0967d','#c4baa2']);             // 右側碎石車道
    quad(g,.04,.66,.62,.3,'#c2b393');specks(g,.04,.66,.62,.3,10,1534,['#b0a282','#cfc2a4']);               // 門前夯土前庭
    quad(g,.27,.66,.14,.34,'#cfc5ad');joints(g,.27,.66,.14,.34,.07,'#bbb198');                              // 石板步道
    lotEdge(g);
    const u0=.08,v0=.08,u1=.6,v1=.5,he=22,vf=v1+.03,ff=32;
    Sc.sh(u0,v0,u1-u0,vf-v0,ff);
    tree(Sc,.93,.05,4,6,.5,1533);
    // 主屋（看得到 +u 面）
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,CL,CD);
      for(let z=1.5;z<he;z+=1.5)BL(g,P(u1,v0+1/32,z),P(u1,v1,z),CJD);
      fR(g,u1,v0,v1,0,1.2,'#554e44');fR(g,u1,v0,v0+.03,0,he,TRD);
      for(const t of [.2,.36]){fR(g,u1,t-.04,t+.04,13.5,20,TRD);fR(g,u1,t-.028,t+.028,14,19.5,C.winD);fR(g,u1,t-.028,t+.028,16.5,17,TRD);
        if(ng&&t<.3){fR(ng,u1,t-.028,t+.028,14,16.5,C.lit);fR(ng,u1,t-.028,t+.028,17,19.5,C.lit);}}
      fR(g,u1,.14,.22,2.5,9.5,TRD);fR(g,u1,.152,.208,3,9,C.winD);fR(g,u1,.152,.208,5.8,6.3,TRD);
      if(ng){fR(ng,u1,.152,.208,3,5.8,C.lit);fR(ng,u1,.152,.208,6.3,9,C.lit);}
      fR(g,u1,.34,.44,0,9.5,TRD);fR(g,u1,.35,.43,0,9,'#6b4a2e');fR(g,u1,.39-.3/32,.39+.3/32,0,9,'#4a311c');     // 側門（對開）
    });
    // 後方雙坡鐵皮頂（屋脊沿 v；前山牆被假立面擋住）＋紅磚煙囪
    Sc.o(1.01,g=>{gableV(g,u0,v0,u1,v1,he,he+9,.035,{roof:'#737a81',roofJ:'#61676e',eave:'#3a3f45',gable:CL,gableJ:null,barge:TR,bargeD:TRD,ridge:'#4a4f55',n:6});});
    Sc.o(1.015,g=>{boxZ(g,.3,.14,.06,.06,he+4,8,'#6e3a2e',C.brick,C.brickD);boxZ(g,.29,.13,.08,.08,he+11.5,1.2,'#5a5550','#8a8577','#6d6a62');});
    // 側門小雨遮＋門燈
    Sc.o(1.02,(g,ng)=>{leanU(g,u1,.32,.46,u1+.07,11.5,10.5,'#7b8288','#5a6066','#687076');doorLampR(g,ng,u1+.001,.39,12.8);});
    // 墨綠老郵務車（並停側牆）
    vanV(Sc,1.05,.7,.82,.14,.42,{col:['#3f7d5a','#2f6b49','#24523a'],stripe:'#e3c667',emb:['#f4f1e6','#a39b88'],round:1});
    // 假立面
    Sc.o(1.1,(g,ng)=>{
      boxZ(g,u0-.015,v1,u1-u0+.03,.03,0,ff,null,CL,CD);
      const L=(a,b,z0,z1,c)=>fL(g,vf,a,b,z0,z1,c),N=(a,b,z0,z1,c)=>fL(ng,vf,a,b,z0,z1,c);
      for(let z=1.5;z<ff-3;z+=1.5)BL(g,P(u0-.015+1/32,vf,z),P(u1+.015,vf,z),CJ);
      L(u0-.015,u1+.015,0,1.2,'#6d6558');
      L(u0-.015,u0+.02,0,ff,TR);L(u1-.02,u1+.015,0,ff,TR);                                                          // 轉角板
      // 一樓：對開木門（上半玻璃）＋兩側四格窗
      L(.29,.39,1.5,10.4,TR);L(.3,.38,1.5,9.9,'#5a3a24');L(.34-.3/32,.34+.3/32,1.5,9.9,'#3e2616');L(.305,.335,5.2,9.2,'#8fb3cc');L(.345,.375,5.2,9.2,'#8fb3cc');
      if(ng){N(.305,.335,5.2,9.2,C.lit);N(.345,.375,5.2,9.2,C.lit);}
      for(const t of [.16,.52]){L(t-.05,t+.05,2.5,10,TR);L(t-.035,t+.035,3,9.5,C.win);L(t-.5/32,t+.5/32,3,9.5,TR);L(t-.035,t+.035,6,6.5,TR);
        if(ng){N(t-.035,t-.5/32,3,6,C.lit);N(t+.5/32,t+.035,3,6,C.lit);N(t-.035,t-.5/32,6.5,9.5,C.lit);N(t+.5/32,t+.035,6.5,9.5,C.lit);}}
      // 二樓兩窗
      for(const [i,t] of [[0,.19],[1,.49]]){L(t-.045,t+.045,14,20.5,TR);L(t-.032,t+.032,14.5,20,C.win);L(t-.032,t+.032,17,17.5,TR);L(t-.032,t-.032+1/32,18.8,20,C.winGl);
        if(ng&&i===0){N(t-.032,t+.032,14.5,17,C.lit);N(t-.032,t+.032,17.5,20,C.lit);}}
      // 招牌：一塊素面淺木板（1px 深木框），收窄到兩扇二樓窗之間的寬度、兩側露出雨淋板；中央只放一枚紅信封；不寫假字
      {const sa=.18,sb=.5;L(sa,sb,22,28,'#7a5530');L(sa+1/32,sb-1/32,23,27,'#e3cf9c');
        const p=P((sa+sb)/2,vf,27);envelope(g,p[0]-2.5,p[1],null,C.red,'#e3cf9c');
        if(ng){N(sa+1/32,sb-1/32,23,27,'rgba(255,232,178,.5)');envelope(ng,p[0]-2.5,p[1],null,'#ff6a55','#ffe8b8');}}
      // 簷口：一道連續的 2px 綠線（整數高度、無托架），通過鐘板底下 → 招牌｜2px 雨淋板｜簷口｜鐘板 四段分得開
      L(u0-.015,u1+.015,30,31,GND);L(u0-.015,u1+.015,31,ff,GN);
      fR(g,u1+.015,v1,vf,30,ff,GND);
    });
    // 中央升起鐘板（與假立面同一平面）：素面木板＋7px 鐘，頂端同一道 2px 綠簷口，無尖頂、無第二層冠飾
    Sc.o(1.11,(g,ng)=>{const a=.2,b=.48,zt=ff+12;boxZ(g,a,v1,b-a,.03,ff,zt-ff,null,CL,CD);
      for(let z=ff+1.5;z<zt-2;z+=1.5)BL(g,P(a+1/32,vf,z),P(b,vf,z),CJ);
      fL(g,vf,a,b,zt-2,zt-1,GND);fL(g,vf,a,b,zt-1,zt,GN);fR(g,b,v1,vf,zt-2,zt,GND);
      clockV(g,ng,P((a+b)/2,vf,ff+5));});
    // 木棧門廊：地台＋木階、三根白柱、鐵皮單坡頂
    Sc.o(1.2,g=>{boxZ(g,u0-.02,vf,u1-u0+.04,.14,0,1.5,'#b08a5c','#8e6f4c','#6f5438');
      for(let t=u0+.01;t<u1+.02;t+=.035)BL(g,P(t,vf,1.5),P(t,vf+.14,1.5),'#9c7a50');
      boxZ(g,.28,vf+.14,.12,.045,0,.8,'#bcae94','#a5977c','#85795f');});
    Sc.o(1.21,g=>{for(const t of [u0-.005,.34,u1+.005])boxZ(g,t-.012,vf+.112,.024,.024,1.5,11.2,TR,TR,TRD);});
    Sc.o(1.22,g=>{const a=u0-.03,b=u1+.03,va=vf,vb=vf+.16,zh=13.6,zl=12.2;
      fp(g,[P(a,va,zh),P(b,va,zh),P(b,vb,zl),P(a,vb,zl)],'#8d949a');
      for(let t=a+.03;t<b;t+=.03)BL(g,P(t,va,zh),P(t,vb,zl),'#767d83');
      fp(g,[P(a,vb,zl),P(b,vb,zl),P(b,vb,zl-1),P(a,vb,zl-1)],'#5d646a');
      fp(g,[P(b,va,zh),P(b,vb,zl),P(b,vb,zl-1),P(b,va,zh-1)],'#4d5359');});
    // 前庭：圓郵筒、燈柱、灌木
    pillarBox(Sc,.5,.76,1.3);
    people(Sc,1.31,[[.44,.8,'#7a5a9a',{leg:'#3b3a44',bag:'#f4f1e6'}]]);
    lampC(Sc,.12,.8,13,1.3);
    shrub(Sc,.9,.86,1.4);shrub(Sc,.96,.72,1.38);shrub(Sc,.04,.62,1.25);
    return {};
  });

  // =====================================================================
  // ================= 救護站 k28 =================
  // =====================================================================
  const REF28=B['28_1_0'];REP.dims[28]=REF28?[REF28.w,REF28.h,REF28.ax,REF28.ay]:null;
  // 救護車色票：頂面比兩個側面都深（#aab2b7），白前臉與淺灰長側分得開，方箱輪廓清楚，不會糊成白蛋
  // 救護車庫內部：比一般門洞亮一階的暖灰（值班車庫開燈），白色車頭與深色外框才分得出來
  const GAR={int:'#4f4943',intD:'#3f3a35'};
  // 亮燈車庫（白天也開燈的值班車位）：暖灰內牆＋頂端深一列（捲門收起處），另在下一列畫燈條
  const LITBAY={int:'#7a7166',intD:'#4f4943'};
  const AMB={top:'#aab2b7',topC:'#b7bec2',front:'#fbfbf8',side:'#dde1e3',glass:'#1a2129',glassH:'#5e7a8e',band:'#d8281f',bandD:'#b3231c',skirt:'#5d646a',tyre:'#1d2024'};
  // 車頂燈條：沿後艙前緣頂邊、高出車頂 1px，前半 c0、後半 c1（整條 4–5px，比單點好認）
  const lightbar=(g,ng,a,b,c0,c1,n0,n1)=>{const x0=Math.round(a[0]),y0=Math.round(a[1])-1,x1=Math.round(b[0]),y1=Math.round(b[1])-1,N=Math.max(Math.abs(x1-x0),1);
    for(let i=0;i<=N;i++){const x=Math.round(x0+(x1-x0)*i/N),y=Math.round(y0+(y1-y0)*i/N),first=i<=N/2;RC(g,x,y,1,1,first?c0:c1);if(ng)RC(ng,x,y,1,1,first?n0:n1);}};
  // 救護車（車頭朝 +v；可見面 +v＝車頭、+u＝右側長面）：銳邊方箱。座標一律 1/32 整格、高度整數：
  //   後艙高 8、駕駛室高 5（前看：高方艙前臉 3 列白＋低駕駛室）；頂面比側面深一階；+v 前臉白、+u 長側淺灰；
  //   駕駛室前臉 2px 黑擋風玻璃、側面 2px 黑側窗；車身下緣 1px 深灰裙邊，長側裙邊上 1px 紅帶；後艙側面正中一個乾淨的 3px 紅「+」；後艙頂前緣紅藍燈條。
  const ambBody=(g,ng,ua,ub,v0,v1,o)=>{const hb=o.hb||8,hc=o.hc||5,vc=v1-(o.cab||3/32);
    boxZ(g,ua,v0,ub-ua,vc-v0,1,hb-1,AMB.top,AMB.front,AMB.side);                                          // 後艙
    boxZ(g,ua,vc,ub-ua,v1-vc,1,hc-1,AMB.topC,AMB.front,AMB.side);                                         // 駕駛室
    fL(g,vc,ua,ub,hc,hb,AMB.front);                                                                        // 後艙前臉（駕駛室頂以上）
    fL(g,v1,ua,ub,hc-2,hc,AMB.glass);fL(g,v1,ua,ua+1/32,hc-1,hc,AMB.glassH);                              // 擋風玻璃 2px
    fR(g,ub,vc+1/32,v1,hc-2,hc,AMB.glass);                                                                 // 側窗 2px
    fL(g,v1,ua,ub,1,2,AMB.skirt);fR(g,ub,v0,v1,1,2,AMB.skirt);                                             // 裙邊
    fR(g,ub,v0,v1,2,3,AMB.bandD);                                                                          // 長側下緣紅帶
    for(const t of [v1-2/32,v0+2/32])fR(g,ub,t-1/32,t+1/32,0,2,AMB.tyre);                                  // 輪
    {const m=P(ub,(v0+vc)/2,6),x=Math.round(m[0]),y=Math.round(m[1]);RC(g,x-1,y,3,1,AMB.band);RC(g,x,y-1,1,3,AMB.band);}   // 3px 紅十字
    {const a=P(ua,v1,2),b=P(ub,v1,2);                                                                      // 車頭燈（白列兩端，琥珀色）
      RC(g,Math.round(a[0]),Math.round(a[1])-1,1,1,'#f4c95a');RC(g,Math.round(b[0])-1,Math.round(b[1])-1,1,1,'#f4c95a');
      if(ng){RC(ng,Math.round(a[0]),Math.round(a[1])-1,1,1,'#fff3cc');RC(ng,Math.round(b[0])-1,Math.round(b[1])-1,1,1,'#fff3cc');}}
    lightbar(g,ng,P(ua+.5/32,vc,hb),P(ub-.5/32,vc,hb),'#e8392c','#3a74d8',C.redN,C.blueN);};
  // o.door＝{v,a,b,zt}：車身 v<door.v 的部分在車庫裡，只在門洞內看得到（inDoorV）；門外部分照常
  const ambV=(Sc,d,ua,ub,v0,v1,o={})=>inDoorV(Sc,d,ua,ub,v0,v1,{...o,bar:1},(g,ng)=>ambBody(g,ng,ua,ub,v0,v1,o));
  // 紅十字燈箱（+v 面／+u 面；s＝邊長像素）
  const crossL=(g,ng,v,uc,zc,s=8)=>{const h=s/64,a=uc-h,b=uc+h,z0=zc-s/2,z1=zc+s/2,k=(s-2)/3;
    fL(g,v,a-.5/32,b+.5/32,z0-.5,z1+.5,'#9aa0a4');fL(g,v,a,b,z0,z1,'#fbfbf8');
    fL(g,v,uc-k/64,uc+k/64,z0+1,z1-1,C.red);fL(g,v,a+1/32,b-1/32,zc-k/2,zc+k/2,C.red);
    if(ng){fL(ng,v,a,b,z0,z1,'#fff4ea');fL(ng,v,uc-k/64,uc+k/64,z0+1,z1-1,'#ff4a3a');fL(ng,v,a+1/32,b-1/32,zc-k/2,zc+k/2,'#ff4a3a');}};
  // +u 面：白底燈箱＋正紅十字，臂寬 k 取整數像素（預設 2px），zc、s 用整數 → 斜面上不出鋸齒
  const crossR=(g,ng,u,vc,zc,s=8,k=2,vmin=-9,vmax=9)=>{const h=s/64,a=vc-h,b=vc+h,z0=zc-s/2,z1=zc+s/2;
    fR(g,u,Math.max(vmin,a-1/32),Math.min(vmax,b+1/32),z0-1,z1+1,'#7d8387');fR(g,u,a,b,z0,z1,'#f4f4f0');
    fR(g,u,vc-k/64,vc+k/64,z0+1,z1-1,C.red);fR(g,u,a+1/32,b-1/32,zc-k/2,zc+k/2,C.red);
    if(ng){fR(ng,u,a,b,z0,z1,'#f2e8de');fR(ng,u,vc-k/64,vc+k/64,z0+1,z1-1,'#ff4a3a');fR(ng,u,a+1/32,b-1/32,zc-k/2,zc+k/2,'#ff4a3a');}};
  // 屋頂警示燈（旋轉燈）
  const beacon=(Sc,u,v,z,d,col='r')=>{Sc.o(d,(g,ng)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);
    RC(g,x-1,y-2,3,2,'#5d646a');RC(g,x-1,y-4,3,2,col==='r'?'#e8392c':'#3a74d8');RC(g,x-1,y-4,1,1,col==='r'?'#ff8a7a':'#8ab4ff');
    if(ng){RC(ng,x-1,y-4,3,2,col==='r'?C.redN:C.blueN);RC(ng,x-2,y-3,5,1,col==='r'?'rgba(255,90,70,.5)':'rgba(111,178,255,.5)');}});};
  // 擔架坡道：一整片均勻單色斜面（無踏面線）＋暗一階的側面，描 1px 深色外框（描框層）；扶手只一條線＋兩端立柱
  // 擔架坡道＝等距楔形：淺色頂面（平台最亮、斜面暗半階，從門檻一路降到地面）＋暗一大階的外側面（梯形＋三角）＋銳角深色外框；
  //   外側一條 1px 扶手＋每 3/32 一根立柱（深鋼色，白牆與灰地前都看得見）；落影分兩段（平台全高、斜面半高），坡腳貼地一道 1px 陰影線
  const RAMP={top:'#e4e1da',slope:'#d2cec5',side:'#8a857c',foot:'#6c6860',rail:'#434b51',post:'#343b40'};
  // 沿 v：平台 vA→vT（高 z），斜面 vT→vL 降到地面；扶手在 +u 外緣
  const rampV=(Sc,d,ua,ub,vA,vT,vL,z)=>{Sc.sh(ua,vA,ub-ua,vT-vA,z);Sc.sh(ua,vT,ub-ua,(vL-vT)*.55,Math.max(1,z*.5));
    Sc.s(d,g=>{
      fp(g,[P(ub,vA,0),P(ub,vL,0),P(ub,vT,z),P(ub,vA,z)],RAMP.side);                                   // +u 外側面（平台段梯形＋斜面段三角）
      BL(g,P(ub,vA,0),P(ub,vL,0),RAMP.foot);                                                            // 側面貼地線
      fp(g,[P(ua,vA,z),P(ub,vA,z),P(ub,vT,z),P(ua,vT,z)],RAMP.top);                                     // 平台
      fp(g,[P(ua,vT,z),P(ub,vT,z),P(ub,vL,0),P(ua,vL,0)],RAMP.slope);});                                // 斜面
    Sc.t(d+.001,g=>{const r=ub-.6/32,H4=4,zf=vv=>vv<=vT?z:z*(1-(vv-vT)/(vL-vT)),e0=vA+1/32,e1=vL-1.5/32;
      const n=Math.max(2,Math.round((e1-e0)/(5/32)));
      for(let i=0;i<=n;i++){const vv=e0+(e1-e0)*i/n,p=P(r,vv,zf(vv)),q=P(r,vv,zf(vv)+H4);RC(g,Math.round(q[0]),Math.round(q[1]),1,Math.max(1,Math.round(p[1]-q[1])),RAMP.post);}
      BL(g,P(r,e0,z+H4),P(r,vT,z+H4),RAMP.rail);BL(g,P(r,vT,z+H4),P(r,e1,zf(e1)+H4),RAMP.rail);});};
  // 沿 u：高端 uT 接牆、向 +u 降到 uL；扶手在 +v 外緣
  const rampU=(Sc,d,va,vb,uT,uL,z)=>{Sc.sh(uT,va,(uL-uT)*.55,vb-va,Math.max(1,z*.5));
    Sc.s(d,g=>{
      fp(g,[P(uT,vb,0),P(uL,vb,0),P(uT,vb,z)],RAMP.side);                                               // +v 外側面（三角）
      BL(g,P(uT,vb,0),P(uL,vb,0),RAMP.foot);
      fp(g,[P(uT,va,z),P(uT,vb,z),P(uL,vb,0),P(uL,va,0)],RAMP.slope);});
    Sc.t(d+.001,g=>{const r=vb-.6/32,H4=4,e0=uT+1/32,e1=uL-1.5/32,zf=uu=>z*(1-(uu-uT)/(uL-uT));
      const n=Math.max(1,Math.round((e1-e0)/(5/32)));
      for(let i=0;i<=n;i++){const uu=e0+(e1-e0)*i/n,p=P(uu,r,zf(uu)),q=P(uu,r,zf(uu)+H4);RC(g,Math.round(q[0]),Math.round(q[1]),1,Math.max(1,Math.round(p[1]-q[1])),RAMP.post);}
      BL(g,P(e0,r,zf(e0)+H4),P(e1,r,zf(e1)+H4),RAMP.rail);});};
  // 門前黃色禁停格（u∈[ua,ub]、v∈[va,vb]）：格內先鋪素面混凝土（蓋掉伸縮縫）→ 規則 45° 斜線（螢幕 1:1 對角、每 4px 一條，
  //   逐像素反算格座標判斷在框內，不用 BL 斜畫，不會出現鋸齒裂紋）→ 最後 1px 黃色外框。hatch=0 只畫外框
  const keepClear=(g,ua,ub,va,vb,hatch=1)=>{quad(g,ua,va,ub-ua,vb-va,C.conc);
    if(hatch){const pts=[P(ua,va),P(ub,va),P(ub,vb),P(ua,vb)],m=1.5/32;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
      for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
      g.fillStyle=C.yel;
      for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){if((((x-y)%4)+4)%4!==0)continue;
        const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;if(u>ua+m&&u<ub-m&&v>va+m&&v<vb-m)g.fillRect(x,y,1,1);}}
    BL(g,P(ua,va),P(ub,va),C.yel);BL(g,P(ub,va),P(ub,vb),C.yel);BL(g,P(ub,vb),P(ua,vb),C.yel);BL(g,P(ua,vb),P(ua,va),C.yel);};
  const antenna=(Sc,u,v,z,h,d)=>{Sc.t(d,(g,ng)=>{const b=P(u,v,z),x=Math.round(b[0]),y=Math.round(b[1]);RC(g,x,y-h,1,h,'#8d959a');RC(g,x-1,y-h+3,3,1,'#8d959a');RC(g,x-1,y-h+7,3,1,'#8d959a');
    RC(g,x,y-h-1,1,1,'#e8392c');if(ng)RC(ng,x,y-h-1,1,1,C.redN);});};

  // v0 雙門兩層平頂：白色兩層站房（一樓兩扇救護車捲門，左門全開救護車露頭、右門關；門間紅柱；紅色腰帶；
  //    二樓窗列＋右端紅十字燈箱）；女兒牆、屋頂旋轉警示燈、空調箱、無線電天線；右面（+u）側門＋平台＋沿牆擔架坡道（欄杆）；
  //    門前黃色禁停格；右前草地與樹
  const am0=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.125,C.concJ);
    keepClear(g,.08,.29,.58,.94);keepClear(g,.32,.53,.58,.94);
    quad(g,.8,.3,.2,.7,C.grass);specks(g,.8,.3,.2,.7,6,2801,[C.grassD,C.grassH]);
    quad(g,.62,.8,.18,.2,C.grass);
    lotEdge(g);
    const u0=.06,v0=.06,u1=.62,v1=.56,hg=13,hh=25;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh+2);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,C.wL,C.wR);
      fL(g,v1,u0,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      fL(g,v1,u0,u1,hg,hg+2,C.red);fR(g,u1,v0,v1,hg,hg+2,C.redD);                                             // 紅腰帶
      rollL(g,ng,v1,.085,.285,11,{open:11,col:'#dde1e3',colJ:'#aeb5ba',colH:'#f4f6f6',fr:'#6d757b',...GAR});
      rollL(g,ng,v1,.325,.525,11,{col:'#dde1e3',colJ:'#aeb5ba',colH:'#f4f6f6',fr:'#6d757b',win:1});
      fL(g,v1,.55,.6,0,8,C.frame);fL(g,v1,.555,.595,0,7.5,'#8db6cc');if(ng)fL(ng,v1,.555,.595,0,7.5,C.litW);
      winsL(g,ng,v1,u0+.02,.46,3,16.5,22,3,C.glass,C.lit,2802,.7,{gl:C.glassH,fr:'#9aa1a6'});
      crossL(g,ng,v1,.54,19.6,8);
      winsR(g,ng,u1,v0+.03,.24,2,16.5,22,3,C.glassD,C.lit,2803,.55,{fr:'#8a9196'});
      winsR(g,ng,u1,.36,v1-.03,2,16.5,22,3,C.glassD,C.lit,2804,.55,{fr:'#8a9196'});
      winsR(g,ng,u1,v0+.03,.2,1,3.5,9.5,3,C.glassD,C.lit,2805,.6,{fr:'#8a9196'});
      // 側門（平台高 4）
      fR(g,u1,.27,.37,4,12,C.frame);fR(g,u1,.28,.36,4,11,'#6f9ab4');fR(g,u1,.32-.5/32,.32+.5/32,4,11,C.frame);
      if(ng)fR(ng,u1,.28,.36,4,11,'#f6e2b0');
      fL(g,v1,u0,u1,hh-1,hh,'#f7f8f7');fR(g,u1,v0,v1,hh-1,hh,'#d3d7d8');
      quad(g,u0+.02,v0+.02,u1-u0-.04,v1-v0-.04,C.roofF,hh);
      for(const t of [.185,.425])doorLampL(g,ng,v1,t,hg-.2);
    });
    Sc.o(1.01,(g)=>{boxZ(g,6/32,5/32,5/32,4/32,hh,4,'#d5d9db','#c3c8cb','#9aa1a6');quad(g,7/32,6/32,3/32,2/32,'#6d757b',hh+4);});   // 方正空調箱（整格、整數高）
    beacon(Sc,u1-.06,v1-.06,hh,1.02,'r');beacon(Sc,u0+.08,v1-.06,hh,1.021,'b');
    antenna(Sc,u0+.44,v0+.08,hh,17,1.015);
    // 側門雨遮＋門燈
    Sc.t(1.05,(g,ng)=>{leanU(g,u1,.25,.39,u1+.06,13,12,'#c9ced1','#6d757b','#9aa1a6');doorLampR(g,ng,u1+.001,.32,14.6);});
    rampV(Sc,1.06,u1,24/32,.24,.4,.68,4);
    ambV(Sc,1.2,4/32,8/32,v1-2/32,v1+7/32,{door:{v:v1,a:.085,b:.285,zt:11}});                            // 左門：車頭朝外、整車幾乎駛出（車尾 2/32 仍在門內）
    tree(Sc,.92,.14,4,6,.9,2806);shrub(Sc,.9,.9,1.5);shrub(Sc,.72,.9,1.48);
    bollard(Sc,.305,.62,1.3);
    people(Sc,1.25,[[.44,.72,'#2f5f8a',{leg:'#23384f'}],[.75,.62,'#2f5f8a',{leg:'#23384f',hair:'#5a4030'}]]);
    return {};
  });

  // v1 三門正面山牆：一層高挑車庫（白牆、正面山牆雙坡灰金屬屋頂、山牆紅十字燈箱＋圓窗）、三扇救護車捲門（中門開、救護車露頭）；
  //    屋脊前端警示燈；右面（+u）值班側門＋垂直於牆的擔架坡道（扶手）；後方格構無線電塔；中門前黃色禁停格、兩側門畫車位框
  // 立面 25px 全部對齊 1/32：1px 牆｜門框 1＋門洞 5＋門框 1｜1px 牆｜…×3｜1px 牆 → 三扇門等寬等距，每扇各自 2px 紅門楣
  const am1=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.125,C.concJ);
    const u0=1/32,v0=.1,u1=26/32,v1=17/32,he=16,hr=33;
    const DR=[[3/32,8/32],[11/32,16/32],[19/32,24/32]];
    DR.forEach(([a,b],i)=>keepClear(g,a-1/32,b+1/32,v1+1/32,.9,i===1));
    quad(g,.84,.02,.16,.3,C.grass);specks(g,.84,.02,.16,.3,3,2814,[C.grassD,C.grassH]);
    quad(g,.84,.62,.16,.38,C.grass);specks(g,.84,.62,.16,.38,4,2811,[C.grassD,C.grassH]);
    lotEdge(g);
    Sc.sh(u0,v0,u1-u0,v1-v0,hr-4);
    tree(Sc,.9,.12,4,6,.8,2815);
    // 後方格構無線電塔
    Sc.t(.7,(g,ng)=>{const b=P(.1,.1,0),x=Math.round(b[0]),y=Math.round(b[1]),h=46;
      RC(g,x-1,y-h,1,h,'#a9b0b5');RC(g,x+1,y-h,1,h,'#7b8287');for(let z=3;z<h;z+=3)RC(g,x,y-z,1,1,'#8d959a');
      RC(g,x,y-h-3,1,3,'#8a9196');RC(g,x,y-h-4,1,1,'#e8392c');if(ng)RC(ng,x,y-h-4,1,1,C.redN);
      RC(g,x-2,y-h+5,1,3,'#e6eaec');RC(g,x+2,y-h+8,1,3,'#e6eaec');});
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,C.wL,C.wR);
      fL(g,v1,u0,u1,0,1,'#9da3a6');fR(g,u1,v0,v1,0,1,'#80878a');
      fR(g,u1,v0,v1,11,13,C.redD);                                                                          // 側面紅腰帶（正面改為每門各自門楣）
      // 三扇捲門（高 10）：1px 淺灰門框＋2px 白色門楣（下緣 1px 陰影線），三個門洞之間露白牆 → 三扇分得開；
      //   左門全開＝空車位、車庫內亮燈（暖灰＋頂上燈條）；中門全開、救護車車頭駛出到禁停格上；右門關＝中灰捲門＋橫條＋一列觀察窗
      DR.forEach(([a,b],i)=>{const open=i<2;
        rollL(g,ng,v1,a,b,10,{open:open?10:0,col:'#c9cfd3',colJ:'#9aa2a8',colH:'#dfe3e5',colB:'#8a9298',fr:'#a3abb1',win:1,...LITBAY});
        if(open){fL(g,v1,a,b,8,9,'#f3e3b6');fL(g,v1,a,b,0,1,'#5f584f');if(ng)fL(ng,v1,a,b,8,9,'#fff4d6');}   // 車庫頂燈條、地坪
        fL(g,v1,a-1/32,b+1/32,11,13,'#fbfbf8');fL(g,v1,a-1/32,b+1/32,11,12,'#c3c8ca');
        const p=P((a+b)/2,v1,14),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,3,1,'#5d646a');RC(g,x,y,1,1,'#f3e6b8');if(ng){RC(ng,x-1,y,3,1,C.lamp);RC(ng,x,y+1,1,1,'rgba(255,231,176,.55)');}});   // 門楣上方小門燈
      // 右面：窗兩扇＋值班側門（坡道頂高 4）
      winsR(g,ng,u1,v0+.03,.3,2,4,10,3,C.glassD,C.lit,2812,.6,{fr:'#8a9196'});
      fR(g,u1,.37,.47,4,12,C.frame);fR(g,u1,.38,.46,4,11,'#6f9ab4');if(ng)fR(ng,u1,.38,.46,4,11,'#f6e2b0');
      doorLampR(g,ng,u1+.001,.42,13.6);
      fL(g,v1,u0,u1,he-1,he,'#f7f8f7');fR(g,u1,v0,v1,he-1,he,'#d3d7d8');
    });
    Sc.o(1.01,(g,ng)=>{const r=gableV(g,u0,v0,u1,v1,he,hr,.03,{roof:'#8a9399',roofJ:'#737c83',eave:'#4a5157',gable:C.wL,gableJ:null,barge:'#c9ced1',bargeD:'#9aa1a6',ridge:'#5d666c',n:8});   // 封簷板改淺灰：紅色只留門楣、十字、警示燈
      crossL(g,ng,v1,(u0+u1)/2,21.4,9);
      const c=P((u0+u1)/2,v1,27.4);RC(g,c[0]-1,c[1]-1,2,2,'#3c5a74');if(ng)RC(ng,c[0]-1,c[1]-1,2,2,C.lit);});
    beacon(Sc,(u0+u1)/2,v1-.02,hr,1.03,'r');
    rampU(Sc,1.05,.37,.47,u1,u1+5/32,4);
    // 中門：救護車車頭駛出門線 6/32（整個白色駕駛室、擋風玻璃、紅藍燈條都在門外禁停格上），後艙 3/32 仍在門內只從門洞看得到；
    //   車身靠門洞左側，右側露 1px 亮燈車庫
    ambV(Sc,1.2,11/32,15/32,v1-3/32,v1+6/32,{door:{v:v1,a:11/32,b:16/32,zt:10}});
    people(Sc,1.25,[[.9,.56,'#2f5f8a',{leg:'#23384f'}],[.88,.7,'#2f5f8a',{leg:'#23384f',hair:'#5a4030'}]]);
    shrub(Sc,.88,.92,1.5);shrub(Sc,.97,.74,1.45);
    return {};
  });

  // v2 單寬門三層＋屋頂直升機坪：三層白色站樓（一樓一扇寬救護車捲門全開救護車露頭；入口門＋沿立面擔架坡道；
  //    紅色腰帶；二、三樓窗列；右面紅十字燈箱）；平頂直升機坪（黃圈白 H、邊燈）、樓梯間（障礙燈）、風向袋；門前黃色禁停格
  const am2=()=>sprite((g,ng,Sc)=>{
    A.dia(g,AX,TOPY,32,C.conc);joints(g,0,0,1,1,.125,C.concJ);
    keepClear(g,3/32,13/32,19/32,.94);
    quad(g,.72,.66,.28,.34,C.grass);specks(g,.72,.66,.28,.34,5,2821,[C.grassD,C.grassH]);
    quad(g,.74,.02,.26,.36,C.grass);
    lotEdge(g);
    const u0=.07,v0=.07,u1=.64,v1=18/32,hg=13,hh=36;
    Sc.sh(u0,v0,u1-u0,v1-v0,hh+2);
    tree(Sc,.9,.12,4,6,.9,2822);
    Sc.o(1,(g,ng)=>{
      boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,null,C.wL,C.wR);
      fL(g,v1,u0,u1,0,.8,'#9da3a6');fR(g,u1,v0,v1,0,.8,'#80878a');
      fL(g,v1,u0,u1,hg,hg+2,C.red);fR(g,u1,v0,v1,hg,hg+2,C.redD);
      rollL(g,ng,v1,4/32,12/32,11,{open:10,col:'#dde1e3',colJ:'#aeb5ba',colH:'#f4f6f6',fr:'#a3abb1',...LITBAY});     // 寬捲門幾乎全開（門洞 8px）、淺灰門框、車庫內亮燈
      fL(g,v1,4/32,12/32,8,9,'#f3e3b6');fL(g,v1,4/32,12/32,0,1,'#5f584f');if(ng)fL(ng,v1,4/32,12/32,8,9,'#fff4d6');   // 頂燈條、地坪
      doorLampL(g,ng,v1,8/32,hg+.8);
      // 入口（平台高 3）
      fL(g,v1,.46,.56,3,12,C.frame);fL(g,v1,.47,.55,3,11,'#8db6cc');fL(g,v1,.51-.5/32,.51+.5/32,3,11,C.frame);if(ng)fL(ng,v1,.47,.55,3,11,C.litW);
      // 二、三樓窗列
      for(const z of [17,27.5]){winsL(g,ng,v1,u0+.02,u1-.02,4,z,z+5.5,3,C.glass,C.lit,2823+z|0,.6,{gl:C.glassH,fr:'#9aa1a6'});
        winsR(g,ng,u1,v0+.02,.27,2,z,z+5.5,3,C.glassD,C.lit,2824+z|0,.5,{fr:'#8a9196'});}
      crossR(g,ng,u1,.43,26,8,2,v0,v1);                                                                    // 白底燈箱＋2px 臂寬正紅十字（整數像素）
      winsR(g,ng,u1,v0+.03,v1-.03,3,4,10,3,C.glassD,C.lit,2825,.5,{fr:'#8a9196'});
      fL(g,v1,u0,u1,hh-1.5,hh,'#f7f8f7');fR(g,u1,v0,v1,hh-1.5,hh,'#d3d7d8');
      // 直升機坪
      quad(g,u0+.02,v0+.02,u1-u0-.04,v1-v0-.04,'#7f878c',hh);
      const cu=(u0+u1)/2+.02,cv=(v0+v1)/2+.02,ring=(r,c)=>{const pts=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2;pts.push(P(cu+r*Math.cos(a),cv+r*Math.sin(a),hh));}fp(g,pts,c);};
      ring(.21,C.yel);ring(.18,'#6c7479');
      {const c=P(cu,cv,hh),x=Math.round(c[0]),y=Math.round(c[1]);RC(g,x-3,y-2,1,5,'#f4f4f0');RC(g,x+3,y-2,1,5,'#f4f4f0');RC(g,x-2,y,5,1,'#f4f4f0');}
      if(ng)for(let i=0;i<8;i++){const a=i/8*Math.PI*2,p=P(cu+.225*Math.cos(a),cv+.225*Math.sin(a),hh);RC(ng,p[0],p[1]-1,1,1,i%2?'#9dffb0':'#fff2c0');}
      {for(let i=0;i<8;i++){const a=i/8*Math.PI*2,p=P(cu+.225*Math.cos(a),cv+.225*Math.sin(a),hh);RC(g,p[0],p[1]-1,1,1,'#f4f4f0');}}
    });
    // 女兒牆欄杆（安全網位）
    Sc.t(1.01,g=>{BL(g,P(u0,v1,hh+2.5),P(u1,v1,hh+2.5),'#b9c0c5');BL(g,P(u1,v0,hh+2.5),P(u1,v1,hh+2.5),'#8a9297');
      for(let t=0;t<=6;t++){const p=P(u0+(u1-u0)*t/6,v1,hh),q=P(u1,v0+(v1-v0)*t/6,hh);RC(g,p[0],p[1]-2,1,2,'#9aa1a6');RC(g,q[0],q[1]-2,1,2,'#7b8287');}});
    // 樓梯間（後角）＋障礙燈、風向袋
    Sc.o(1.005,(g,ng)=>{boxZ(g,u0+.03,v0+.03,.14,.1,hh,6.5,null,C.wL,C.wR);boxZ(g,u0+.02,v0+.02,.16,.12,hh+6.5,1,'#aeb5ba','#c3c8cb','#9aa1a6');
      fL(g,v0+.13,u0+.08,u0+.13,hh,hh+5,'#5d7f96');if(ng)fL(ng,v0+.13,u0+.08,u0+.13,hh,hh+5,'#ffe3a2');
      const p=P(u0+.1,v0+.08,hh+7.5),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-1,1,1,'#e8392c');if(ng){RC(ng,x,y-1,1,1,C.redN);RC(ng,x-1,y,3,1,'rgba(255,90,70,.4)');}});
    // 風向袋：桿立在屋頂板上（離東角內縮，不與牆角垂直邊對齊），只從屋面起算 10px，底有小座
    Sc.t(1.006,g=>{const b=P(u1-.1,v0+.07,hh),x=Math.round(b[0]),y=Math.round(b[1]);RC(g,x-1,y-1,3,1,'#5d646a');RC(g,x,y-10,1,9,'#8d959a');
      RC(g,x+1,y-10,3,2,'#f07a2a');RC(g,x+4,y-9,2,2,'#f4f4f0');RC(g,x+6,y-9,1,1,'#f07a2a');});
    // 擔架坡道：入口門前平台（高 3）垂直立面向前（+v）降到地坪；楔形＋描框＋外側扶手立柱（整格 14/32–18/32）
    rampV(Sc,1.05,14/32,18/32,v1,v1+3/32,v1+11/32,3);
    Sc.t(1.06,(g,ng)=>{const a=.44,b=.58,zh=13,zl=12,vb=v1+.08;fp(g,[P(a,v1,zh),P(b,v1,zh),P(b,vb,zl),P(a,vb,zl)],'#dfe2e3');
      fp(g,[P(a,vb,zl),P(b,vb,zl),P(b,vb,zl-1),P(a,vb,zl-1)],'#8d959a');fp(g,[P(b,v1,zh),P(b,vb,zl),P(b,vb,zl-1),P(b,v1,zh-1)],'#6d757b');
      doorLampL(g,ng,v1+.08,.51,10.8);});
    // 救護車退回寬門正中、車頭沿門的法線朝外：只有駕駛室（3/32）探出門線，後艙在車庫內只從門洞看得到；
    //   車身兩側各露 2px 亮燈車庫、車頂上方露燈條 → 讀成「從門裡探頭」，不是停在門邊
    ambV(Sc,1.2,6/32,10/32,v1-6/32,v1+3/32,{door:{v:v1,a:4/32,b:12/32,zt:10}});
    shrub(Sc,.92,.9,1.5);shrub(Sc,.96,.72,1.45);
    beacon(Sc,u1-.05,v1-.05,hh,1.03,'r');
    people(Sc,1.25,[[.76,.66,'#2f5f8a',{leg:'#23384f'}]]);
    return {};
  });

  // ================= 註冊 =================
  const put=(k,list)=>{const out=[];for(let i=0;i<list.length;i++){try{out[i]=list[i]();}catch(e){REP.err.push('k'+k+' v'+i+': '+(e&&e.message||e));console.error('civ_f k'+k+' v'+i,e);}}
    for(let i=0;i<out.length;i++)if(out[i]){B[k+'_1_'+i]=out[i];if(out[i].flagAt)REP.flag[k+'_'+i]=out[i].flagAt;}
    if(B[k+'_1_3']&&out[0])B[k+'_1_3']=B[k+'_1_0'];if(B[k+'_1_4']&&out[1])B[k+'_1_4']=B[k+'_1_1'];};
  try{put(15,[po0,po1,po2]);}catch(e){REP.err.push('k15 '+e.message);}
  try{if(REF28&&(REF28.w!==W||REF28.h!==H||REF28.ax!==AX||REF28.ay!==AY))REP.err.push('k28 dims differ '+[REF28.w,REF28.h,REF28.ax,REF28.ay]);
    else put(28,[am0,am1,am2]);}catch(e){REP.err.push('k28 '+e.message);}
  window.__civ_f=REP;
});
