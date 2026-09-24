// T614 cul_a：k35 博物館（2×2，136×150，錨 68,148）＋ k36 劇院（2×2，同尺寸）實驗線重畫。
// 分層合成與圖元沿用 civ_d（LIB／scene／shadow／paint／pave、窗列、圓頂、柱列、樹、人、燈），小車印章沿用 trans_a。
// 立體主體各自一層（二值化＋深色外框）；燈桿、欄杆、人走不描邊細線層；地面直接畫在地面層（逐像素取樣不越出佔地菱形）。
// 夜光按層遮擋，只亮白天畫出的窗、門燈、路燈、招牌與雨遮燈泡。零亂數：只用 K.hsh。光從左：+v 面亮、+u 面暗；落影向右。
// 旗桿：繪製端 SPR.flag（14×22、錨 7,22）自帶 20px 桿身（flagAt.x-1..flagAt.x）＋旗面；這裡只畫下段桿身＋底座，flagAt＝本段桿頂。
(window.__variants574=window.__variants574||[]).push(function cul_a(A){
  // 注入測試時本批次排在內嵌 b01…之前（b06 會改寫 35_1_*）⇒ 不是最後一棒就把本體排到隊尾再跑（同 civ_c／civ_d）
  const QL=window.__variants574||[];
  if(!cul_a.__late&&QL.indexOf(cul_a)>=0&&QL.indexOf(cul_a)<QL.length-1){cul_a.__late=1;QL.push(function cul_a_late(A2){cul_a(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{35:[1,2,0]}；定稿必須是 {}
  const errs=[],chk=[];

  // ================= 共用工具（沿用 civ_d 的像素精準圖元）=================
  const LIB=(K)=>{
    const {W,H,AX,SZ,TOPY,P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const fp=(g,pts,c)=>{g.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)g.fillRect(xa,y,xb-xa+1,1);}}};
    const Q=(u0,v0,du,dv,z=0)=>[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];
    const flat=(g,u0,v0,du,dv,c,z=0)=>fp(g,Q(u0,v0,du,dv,z),c);
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const lineU=(g,v,u0,u1,c,z=0)=>BL(g,P(u0,v,z),P(u1,v,z),c);
    const lineV=(g,u,v0,v1,c,z=0)=>BL(g,P(u,v0,z),P(u,v1,z),c);
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h]／['c',u,v,r,h]
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],T=[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,r,h]=s,p=P(u+h/150,v-h/340);ell(sx,p[0]+1,p[1],Math.max(2,rnd(r*1.1)),Math.max(1,rnd(r*.5)),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 逐像素地面著色：只取像素中心落在佔地菱形內的像素（保證不越出下緣）
    const paint=(g,fn)=>{for(let y=0;y<H;y++){let run=null,x0=0;for(let x=0;x<=W;x++){let c=null;
      if(x<W){const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;if(u>0&&v>0&&u<SZ&&v<SZ)c=fn(u,v,x,y)||null;}
      if(c!==run){if(run){g.fillStyle=run;g.fillRect(x0,y,x-x0,1);}run=c;x0=x;}}}};
    const MATS={
      g:{t:['#78a256','#739c51','#7da85b'],s:.125,p:.7},                       // 草
      c:{t:['#d3d0c6','#cdcac0','#d8d5cb'],j:'#bfbcb2',js:.25,s:.125,p:.65},   // 淺色混凝土磚
      a:{t:['#6f6d69','#6c6a66','#72706b'],s:.125,p:.75},                      // 瀝青
      st:{t:['#c9c1ad','#c2baa6','#cfc7b4'],j:'#b0a893',js:.125,s:.125,p:.6},  // 石板
      bp:{t:['#bf9277','#b98c72','#c4977c'],j:'#ab7f66',js:.125,s:.125,p:.6},  // 磚鋪面
      gr:{t:['#6d9a4e','#69954b','#72a053'],s:.125,p:.75},                     // 深一階草
      gv:{t:['#d8cba6','#d2c5a0','#ddd0ab'],s:.0625,p:.6},                     // 黃砂礫步道
      rd:{t:['#9d2f33','#962b2f','#a33437'],s:.125,p:.8},                      // 紅地毯
    };
    const pave=(g,m,u0,v0,du,dv,seed,js)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      const J=js||M.js;if(M.j&&J){for(let a=u0+J;a<u0+du-.04;a+=J)BL(g,P(a,v0+.01),P(a,v0+dv-.035),M.j);for(let b=v0+J;b<v0+dv-.04;b+=J)BL(g,P(u0+.01,b),P(u0+du-.035,b),M.j);}};
    return Object.assign({},K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,lineU,lineV,ell,scene,shadow,paint,pave});
  };

  // ================= 元件 =================
  const KIT=(L)=>{
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ell,lineU,lineV}=L;
    const LIT='#ffe3a0',LIT2='#f3d68e',GL='#4a6d8c',GD='#34506a',GH='#93b5cc';
    const SHD=[];
    const F_=side=>side==='L'?faceL:faceR;
    // ---- 窗（civ_d）----
    const win1=(g,n,side,fx,t,z,w,h,glass,o,seed,i)=>{const F=F_(side),a=t-w/64,b=t+w/64;
      if(o.frame)F(g,fx,a-1/32,b+1/32,z-1,z+h+1,o.frame);else if(o.sill)F(g,fx,a-1/32,b+1/32,z-1,z,o.sill);
      F(g,fx,a,b,z,z+h,glass);
      if(o.hi)F(g,fx,a,b,z+h-2,z+h-1,o.hi);
      if(o.mul)F(g,fx,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.tr!=null)F(g,fx,a,b,z+o.tr,z+o.tr+1,o.trc||o.mul||o.frame||o.sill);
      const arc=o.st==='arch'||o.st==='pt';
      if(arc){F(g,fx,a,a+1/32,z+h-1,z+h,o.wall);F(g,fx,b-1/32,b,z+h-1,z+h,o.wall);
        if(o.hood)F(g,fx,t-1/64,t+1/64,z+h,z+h+1,o.hood);}
      if(n&&hsh(seed,i,rnd(z*7+t*40))<(o.lit!=null?o.lit:.5))F(n,fx,a,b,z,z+h-(arc?1:0),side==='L'?LIT:LIT2);};
    const winRow=(g,n,side,fx,a,b,z,w,h,pitch,glass,o={},skip=[])=>{const len=(b-a)*32,cnt=Math.max(1,Math.floor(len/pitch)),st=(b-a)/cnt;
      for(let i=0;i<cnt;i++){const t=a+st*(i+.5);if(skip.some(s=>t>s[0]&&t<s[1]))continue;win1(g,n,side,fx,t,z,w,h,glass,o,o.seed||7,i);}};
    // 樓體（civ_d mass＋基座高 zb）：牆面＋勒腳＋簷口＋腰線＋各層窗列＋隅石（不含屋頂）；牆 zb..zb+h
    const mass=(g,n,u0,v0,du,dv,h,C,o={})=>{const u1=u0+du,v1=v0+dv,zb=o.zb||0;
      boxZ(g,u0,v0,du,dv,zb,h,null,C.wl,C.wr);
      const pl=o.pl||2;faceL(g,v1,u0,u1,zb,zb+pl,C.bl||SH(C.wl,-36));faceR(g,u1,v0,v1,zb,zb+pl,C.br||SH(C.wr,-30));
      if(C.q){let k=0;for(let z=zb+pl;z<zb+h-2.5;z+=3,k++){const wq=(k%2?2:3)/32;faceL(g,v1,u0,u0+wq,z,z+2,C.q);faceL(g,v1,u1-wq,u1,z,z+2,C.q);faceR(g,u1,v1-wq,v1,z,z+2,SH(C.q,-34));faceR(g,u1,v0,v0+wq,z,z+2,SH(C.q,-34));}}
      const fl=o.fl||0,fh=o.fh||9,z0=zb+(o.z0!=null?o.z0:3),m=o.m!=null?o.m:.04;
      for(let f=0;f<fl;f++){const z=z0+f*fh;
        if(C.cs&&f>0){faceL(g,v1,u0,u1,z-2.5,z-1.5,C.cs);faceR(g,u1,v0,v1,z-2.5,z-1.5,SH(C.cs,-38));}
        const wo={sill:C.sill,hi:o.hi===undefined?GH:o.hi,wall:C.wl,st:Array.isArray(o.st)?o.st[f]:o.st,lit:o.lit,frame:C.frame,mul:o.mul,hood:o.hood&&C.cs,seed:(o.seed||1)+f*17};
        const wh=Array.isArray(o.wh)?o.wh[f]:(o.wh||5);
        if(!o.noL)winRow(g,n,'L',v1,u0+m,u1-m,z,o.w||3,wh,o.pitch||6,C.gl||GL,wo,(o.skipL||[]).concat(f===0?(o.skipL0||[]):[]));
        const wr=Object.assign({},wo,{sill:C.sillR||C.sill,hi:null,wall:C.wr,frame:C.frameR||C.frame,hood:o.hood&&SH(C.cs,-38),seed:(o.seed||1)+f*17+5});
        if(!o.noR)winRow(g,n,'R',u1,v0+m,v1-m,z,o.w||3,wh,o.pitchR||o.pitch||6,C.gd||GD,wr,(o.skipR||[]).concat(f===0?(o.skipR0||[]):[]));}
      if(C.cor){faceL(g,v1,u0,u1,zb+h-2,zb+h,C.cor);faceR(g,u1,v0,v1,zb+h-2,zb+h,SH(C.cor,-40));}};
    // ---- 屋頂（civ_d）----
    const gableU=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,vm=(v0+v1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf;
      if(zt-ze<32*(vm-v0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt),P(u0-ov,vm,zt)],o.rb||SH(rf,-24));
      if(o.wr)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zt)],o.wr);
      fp(g,[P(u1-.005,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt+.6),P(u1-.005,vm,zt+.6)],o.vb||SH(rf,-38));
      fp(g,[P(u0-ov,vm,zt),P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),P(u0-ov,v1+ov,ze)],rf);
      const nl=Math.max(2,Math.floor(((v1+ov-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(v1+ov-vm)*f,z=zt-(zt-ze)*f;BL(g,P(u0-ov+.01,v,z),P(u1+ov-.01,v,z),o.rl||SH(rf,-13));}
      BL(g,P(u0-ov,vm,zt),P(u1+ov,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(u0-ov,v1+ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rf,-32));
      BL(g,P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),o.verge||SH(rf,14));return{vm,zt,ze};};
    const hipU=(g,u0,v0,du,dv,h,rh,o)=>{const ov=o.ov!=null?o.ov:.03,a0=u0-ov,a1=u0+du+ov,b0=v0-ov,b1=v0+dv+ov,vm=(b0+b1)/2,hr=Math.min((b1-b0)/2,(a1-a0)/2),ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      const r0=a0+hr,r1=a1-hr;
      if(zt-ze<32*hr){fp(g,[P(a0,b0,ze),P(a1,b0,ze),P(r1,vm,zt),P(r0,vm,zt)],SH(rf,-22));fp(g,[P(a0,b0,ze),P(r0,vm,zt),P(a0,b1,ze)],SH(rf,-8));}
      fp(g,[P(a1,b0,ze),P(a1,b1,ze),P(r1,vm,zt)],rs);
      fp(g,[P(a0,b1,ze),P(a1,b1,ze),P(r1,vm,zt),P(r0,vm,zt)],rf);
      const nl=Math.max(2,Math.floor(((b1-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(b1-vm)*f,z=zt-(zt-ze)*f;BL(g,P(r0-hr*f+.02,v,z),P(r1+hr*f-.02,v,z),o.rl||SH(rf,-13));}
      const nr=Math.max(2,Math.floor(((a1-r1)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nr;k++){const f=k/nr,u=r1+(a1-r1)*f,z=zt-(zt-ze)*f;BL(g,P(u,vm-hr*f+.02,z),P(u,vm+hr*f-.02,z),SH(rs,-10));}
      BL(g,P(r0,vm,zt),P(r1,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(r1,vm,zt),P(a1,b1,ze),o.hip||SH(rf,18));BL(g,P(r0,vm,zt),P(a0,b1,ze),o.hip||SH(rf,18));
      BL(g,P(a0,b1,ze),P(a1,b1,ze),o.fascia||SH(rf,-32));BL(g,P(a1,b0,ze),P(a1,b1,ze),SH(rs,-20));
      return{vm,zt,r0,r1,b1,ze};};
    const gableV=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,um=(u0+u1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      if(zt-ze<32*(um-u0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(um,v0-ov,zt),P(um,v1+ov,zt),P(u0-ov,v1+ov,ze)],rf);
      if(o.wl)fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zt)],o.wl);
      fp(g,[P(um,v0-ov,zt),P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),P(um,v1+ov,zt)],rs);
      const nl=Math.max(2,Math.floor(((u1+ov-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(u1+ov-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,v0-ov+.01,z),P(u,v1+ov-.01,z),o.rl||SH(rs,-10));}
      BL(g,P(um,v0-ov,zt),P(um,v1+ov,zt),o.ridge||SH(rf,22));
      BL(g,P(u0-ov,v1+ov,ze),P(um,v1+ov,zt),o.verge||SH(rf,12));BL(g,P(um,v1+ov,zt),P(u1+ov,v1+ov,ze),SH(rs,-16));
      BL(g,P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rs,-24));return{um,zt,ze};};
    const pyramid=(g,uc,vc,s,z,rh,rf,rs)=>{const a0=uc-s/2,a1=uc+s/2,b0=vc-s/2,b1=vc+s/2,ap=P(uc,vc,z+rh);
      if(rh<32*s/2){fp(g,[P(a0,b0,z),P(a1,b0,z),ap],SH(rf,-18));fp(g,[P(a0,b0,z),P(a0,b1,z),ap],SH(rf,-8));}
      fp(g,[P(a1,b0,z),P(a1,b1,z),ap],rs);fp(g,[P(a0,b1,z),P(a1,b1,z),ap],rf);BL(g,ap,P(a1,b1,z),SH(rf,22));};
    const flatTop=(g,u0,v0,du,dv,h,roof,o={})=>{const e=o.e||.03;flat(g,u0,v0,du,dv,o.cap||SH(roof,40),h);flat(g,u0+e,v0+e,du-2*e,dv-2*e,roof,h);
      BL(g,P(u0+e,v0+e,h),P(u0+du-e,v0+e,h),SH(roof,-24));BL(g,P(u0+e,v0+e,h),P(u0+e,v0+dv-e,h),SH(roof,-16));};
    // ---- 圓頂／鼓座（civ_d）----
    const dome=(g,uc,vc,r,z,rise,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2,nr=o.ribs||0;
      const x0=Math.floor(cx-Rx)-1,x1=Math.ceil(cx+Rx)+1,y0=Math.floor(cy-rise)-1,y1=Math.ceil(cy+Ry)+1;
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const Y=y+.5-cy,s=Math.sqrt(1-X*X);
        if(Y<-rise*s||Y>Ry*s)continue;
        let lo=Math.abs(X),hi=1;for(let k=0;k<22;k++){const m=(lo+hi)/2,f=Ry*Math.sqrt(Math.max(0,m*m-X*X))-rise*Math.sqrt(Math.max(0,1-m*m));if(f<Y)lo=m;else hi=m;}
        const a=(lo+hi)/2,sp=Math.sqrt(Math.max(0,1-a*a)),st=a>1e-6?Math.max(-1,Math.min(1,X/a)):0,ct=Math.sqrt(Math.max(0,1-st*st));
        const b=a*st*-.62+a*ct*.34+sp*.71;let k=b>.74?0:b>.5?1:b>.26?2:b>.02?3:4;
        if(nr&&sp<.9){const th=Math.asin(st),q=th/(Math.PI/nr),fr=Math.abs(q-Math.round(q))*(Math.PI/nr)*Rx*a;if(fr<.5)k=Math.min(4,k+1);}
        RC(g,x,y,1,1,T5[k]);}};
    const cyl=(g,n,uc,vc,r,z,h,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2;
      for(let x=Math.floor(cx-Rx);x<=Math.ceil(cx+Rx);x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const s=Math.sqrt(1-X*X);
        const b=-X*.62+s*.34+.12;const k=b>.62?0:b>.38?1:b>.12?2:b>-.2?3:4;
        const yb=Math.round(cy+Ry*s),yt=Math.round(cy-h+Ry*s);if(!o.noFill)RC(g,x,yt,1,yb-yt,T5[k]);
        if(o.cap){const yc=Math.round(cy-h-Ry*s);RC(g,x,yc,1,yt-yc,o.cap);}}
      if(o.pil){for(let i=0;i<=o.pil;i++){const th=-Math.PI/2+i*Math.PI/o.pil,x=rnd(cx+Rx*Math.sin(th)-.5),ct=Math.cos(th);if(ct<.2)continue;
        const yb=Math.round(cy+Ry*ct),yt=Math.round(cy-h+Ry*ct);RC(g,x,yt,1,yb-yt,Math.sin(th)<0?(o.pc||T5[0]):(o.pd||T5[2]));}}
      if(o.win){const w=o.win;for(let i=0;i<w.n;i++){const th=-Math.PI/2+(i+.5)*Math.PI/w.n,ct=Math.cos(th);if(ct<.3)continue;const ww=Math.max(1,rnd((w.w||2)*ct)),x=rnd(cx+Rx*Math.sin(th)-ww/2);
        const yb=Math.round(cy+Ry*ct-w.z0),yt=Math.round(cy+Ry*ct-w.z1);RC(g,x,yt,ww,yb-yt,Math.sin(th)<0?(w.glass||GL):(w.gd||GD));if(w.arch){RC(g,x,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);if(ww>1)RC(g,x+ww-1,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);}
        if(n&&hsh(w.seed||31,i,3)<(w.lit!=null?w.lit:.6))RC(n,x,yt+(w.arch?1:0),ww,yb-yt-(w.arch?1:0),LIT);}}};
    // ---- 柱列（civ_d，加 z 基座）----
    const colsL=(g,v,a,b,cnt,z0,h,cl,cr)=>{for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,t-.025,v-.05,.05,.05,z0,h,null,cl,cr);boxZ(g,t-.035,v-.06,.07,.07,z0+h-1,1,null,cl,cr);boxZ(g,t-.035,v-.06,.07,.07,z0,1,null,cl,cr);}};
    const colsR=(g,u,a,b,cnt,z0,h,cl,cr)=>{for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,u-.05,t-.025,.05,.05,z0,h,null,cl,cr);boxZ(g,u-.06,t-.035,.07,.07,z0+h-1,1,null,cl,cr);boxZ(g,u-.06,t-.035,.07,.07,z0,1,null,cl,cr);}};
    // 門（+v 面 doorL／+u 面 doorR）：石框＋木門＋氣窗；zb 門檻高
    const doorL=(g,n,v,t,wd,hd,fr,wood,zb=0)=>{const a=t-wd/64,b=t+wd/64;faceL(g,v,a-1/32,b+1/32,zb,zb+hd+1.5,fr);faceL(g,v,a,b,zb,zb+hd,wood||'#4b3226');faceL(g,v,a,b,zb+hd-2,zb+hd,'#9cc0d6');faceL(g,v,t-1/64,t+1/64,zb,zb+hd-2,SH(wood||'#4b3226',-16));if(n){faceL(n,v,a,b,zb+hd-2,zb+hd,'#ffe9b0');}};
    const doorR=(g,n,u,t,wd,hd,fr,wood,zb=0)=>{const a=t-wd/64,b=t+wd/64;faceR(g,u,a-1/32,b+1/32,zb,zb+hd+1.5,fr);faceR(g,u,a,b,zb,zb+hd,wood||'#3f2a20');faceR(g,u,a,b,zb+hd-2,zb+hd,'#7fa2b8');faceR(g,u,t-1/64,t+1/64,zb,zb+hd-2,SH(wood||'#3f2a20',-14));if(n){faceR(n,u,a,b,zb+hd-2,zb+hd,'#f3d68e');}};
    // 台階：沿 +v 下降（頂緣 vb→底緣 vf）／沿 +u 下降；C＝[踏面,踢面(亮),側面(暗)]
    const stairsV=(g,u0,u1,vb,vf,zt,n,C,cp)=>{const s=(vf-vb)/n;for(let k=0;k<n;k++){const z=zt*(n-k)/n;boxZ(g,u0,vb+k*s,u1-u0,s+.002,0,z,C[0],C[1],C[2]);
      if(cp){flat(g,cp[0],vb+k*s,cp[1]-cp[0],s+.002,cp[2],z);faceL(g,vb+(k+1)*s+.002,cp[0],cp[1],0,z,cp[3]);}}};
    const stairsU=(g,v0,v1,ub,uf,zt,n,C)=>{const s=(uf-ub)/n;for(let k=0;k<n;k++){const z=zt*(n-k)/n;boxZ(g,ub+k*s,v0,s+.002,v1-v0,0,z,C[0],C[2],C[1]);}};
    // 垂直布幔（展覽旗幟）：在 +v（'L'）或 +u（'R'）面；t 中心、z0..z1、w 寬 px；acc＝字色
    const bannerF=(g,side,fx,t,z0,z1,w,col,acc,o={})=>{const F=F_(side),a=t-w/64,b=t+w/64;
      F(g,fx,a-1/32,b+1/32,z1,z1+1,'#3b3631');
      F(g,fx,a,b,z0,z1,col);F(g,fx,a,a+1/32,z0,z1,SH(col,side==='L'?22:12));
      if(o.band)F(g,fx,a,b,z0+(z1-z0)*.52,z0+(z1-z0)*.52+3,o.band);
      let k=0;for(let z=z1-3;z>z0+2;z-=2,k++){if(k===2||k===5)continue;const e=((k*7)%3)/32;F(g,fx,a+1/32,b-1/32-e,z,z+1,acc);}
      F(g,fx,a,b,z0,z0+1,SH(col,-34));};
    // 玻璃帷幕（+v 'L'／+u 'R'）：窗格＋豎框＋橫框；斜向亮格＝反光；n 夜亮（lit 比例）
    const curtain=(g,n,side,fx,a,b,z0,z1,o={})=>{const F=F_(side),L_=side==='L';
      const gl=o.gl||(L_?'#86abc3':'#557a92'),gh=o.gh||SH(gl,24),gm=o.gm||SH(gl,11),mul=o.mul||(L_?'#e9eef1':'#9aa7ae');
      const pitch=(o.pitch||4)/32,fh=o.fh||6,ni=Math.max(1,Math.round((b-a)/pitch)),nj=Math.max(1,Math.round((z1-z0)/fh));
      F(g,fx,a,b,z0,z1,gl);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const ta=a+(b-a)*i/ni,tb=a+(b-a)*(i+1)/ni,za=z0+(z1-z0)*j/nj,zb=z0+(z1-z0)*(j+1)/nj;
        const q=((i+j*(o.sk||1))%(o.per||5)+(o.per||5))%(o.per||5);if(q===0)F(g,fx,ta,tb,za,zb,gh);else if(q===1)F(g,fx,ta,tb,za,zb,gm);
        if(n&&o.lit&&hsh(o.seed||1,i,j)<o.lit)F(n,fx,ta,tb,za,zb,L_?LIT:LIT2);}
      if(o.inner)o.inner(F,ni,nj);
      if(n&&o.lit&&o.innerN)o.innerN(F,n);
      for(let i=0;i<=ni;i++){const t=a+(b-a)*i/ni;F(g,fx,i===ni?t-1/32:t,i===ni?t:t+1/32,z0,z1,mul);if(n&&o.lit)F(n,fx,i===ni?t-1/32:t,i===ni?t:t+1/32,z0,z1,'#2c3239');}
      for(let j=0;j<=nj;j++){const z=z0+(z1-z0)*j/nj;F(g,fx,a,b,j===nj?z-1:z,j===nj?z:z+1,mul);if(n&&o.lit)F(n,fx,a,b,j===nj?z-1:z,j===nj?z:z+1,'#2c3239');}};
    // 玻璃屋頂（平）：底色＋格線＋框
    const glassTop=(g,u0,v0,du,dv,z,o={})=>{const gl=o.gl||'#a4c3d6',fr=o.fr||'#eef2f4',st=o.st||.1;flat(g,u0,v0,du,dv,gl,z);
      for(let a=u0+st;a<u0+du-.02;a+=st)lineV(g,a,v0,v0+dv,SH(gl,-22),z);for(let b=v0+st;b<v0+dv-.02;b+=st)lineU(g,b,u0,u0+du,SH(gl,-22),z);
      lineU(g,v0,u0,u0+du,fr,z);lineV(g,u0,v0,v0+dv,fr,z);lineU(g,v0+dv,u0,u0+du,fr,z);lineV(g,u0+du,v0,v0+dv,fr,z);};
    // ---- 景觀與小件（civ_d）----
    const flagpole=(S,u,v,h,d)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      S.t(d,(g)=>{RC(g,x-1,y-2,4,2,'#cdc8bb');RC(g,x-1,y-1,4,1,'#8f8b82');RC(g,x+2,y-2,1,2,'#9e9a90');RC(g,x,y-h,2,h-2,'#8a8a86');RC(g,x,y-h,1,h-2,'#a9a9a3');});
      return[x+1,y-h];};
    const kid=(g,p,shirt,o={})=>{const x=rnd(p[0]),y=rnd(p[1]),lg=o.leg||'#3a3f4d',sk=o.skin||'#e8bf97',hr=o.hair||'#3a2c24';
      if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-2,1,1,lg);RC(g,x,y-2,1,1,lg);}else{RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SH(lg,-12));}
      RC(g,x,y-4,2,2,shirt);RC(g,x+1,y-4,1,2,SH(shirt,-26));RC(g,x,y-5,2,1,sk);RC(g,x,y-6,2,1,hr);if(o.bag)RC(g,x-1,y-4,1,2,o.bag);
      if(o.dress){RC(g,x-1,y-3,4,1,shirt);RC(g,x,y-2,2,1,shirt);}};
    // z：站在台階／台基上的人（抬高 z px）
    const crowd=(S,d,list)=>S.t(d,(g)=>{for(const q of list){const p=P(q[0],q[1],(q[3]&&q[3].z)||0);kid(g,p,q[2],q[3]||{});}});
    const bench=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.06,(g)=>{if(alongU)boxZ(g,u,v,.12,.035,1,1,'#b0845a','#9a6f48','#7a5638');else boxZ(g,u,v,.035,.12,1,1,'#b0845a','#9a6f48','#7a5638');});
    // 路燈：c 古典（黑桿燈籠）／m 現代（細桿）／g 球形雙燈
    const lamp=(S,u,v,h,d,kind)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      if(kind==='m'){RC(g,x,y-h,1,h,'#7c858b');RC(g,x+1,y-h+1,1,h-1,'#a6aeb3');RC(g,x-1,y-h-1,3,1,'#5c6468');RC(g,x-1,y-h,3,1,'#f2f0e4');if(n){RC(n,x-1,y-h,3,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,236,190,.45)');}return;}
      RC(g,x,y-h+2,1,h-2,'#2e3236');RC(g,x+1,y-h+3,1,h-3,'#4a5055');RC(g,x-1,y-1,3,1,'#2e3236');
      RC(g,x-1,y-h-1,3,1,'#2a2e32');RC(g,x-1,y-h,3,2,'#f3e2a8');RC(g,x,y-h-2,1,1,'#2a2e32');
      if(n){RC(n,x-1,y-h,3,2,'#ffe6a0');RC(n,x-2,y-h+2,5,1,'rgba(255,226,160,.45)');}});
    // 燈桿掛布幔（兩面垂直旗）：c1／c2 顏色
    const bannerPole=(S,u,v,h,d,c1,c2,kind)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pc=kind==='m'?'#7c858b':'#2e3236',pl=kind==='m'?'#a6aeb3':'#4a5055';
      RC(g,x,y-h,1,h,pc);RC(g,x+1,y-h+1,1,h-1,pl);RC(g,x-1,y-1,3,1,pc);
      RC(g,x-2,y-h+3,5,1,pc);RC(g,x-3,y-h+4,2,6,c1);RC(g,x-3,y-h+4,1,6,SH(c1,20));RC(g,x+2,y-h+4,2,6,c2);RC(g,x+3,y-h+4,1,6,SH(c2,-24));
      RC(g,x-3,y-h+6,2,1,'#f4efe2');RC(g,x+2,y-h+6,2,1,'#f4efe2');
      RC(g,x-1,y-h-1,3,1,'#2a2e32');RC(g,x-1,y-h,3,1,'#f3e2a8');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.4)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],['#c8b25a','#a88d3c','#7e6a2c','#574820']];
    const tree=(S,u,v,s=1,kind=0,d)=>{SHD.push(['c',u,v,rnd(4.2*s),rnd(9*s)+3]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const cypress=(S,u,v,h,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,'#4a3727');
      for(let k=0;k<h;k++){const f=k/h,w=Math.max(1,rnd(3.2*Math.sin(Math.PI*Math.min(.95,f*.85+.12))));RC(g,x-w+1,y-2-k,w,1,'#5d8f4a');RC(g,x+1,y-2-k,w,1,'#3c6632');}RC(g,x,y-2-h,1,1,'#3c6632');});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const hedge=(S,u0,v0,du,dv,d,h=3)=>S.o(d!=null?d:u0+du+v0+dv,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#5f9442','#4e7f37','#3b6429');});
    // 花壇（地面層，無外框）
    const flowers=(g,u0,v0,du,dv,seed,cols)=>{flat(g,u0,v0,du,dv,'#4f7f35');const n=Math.floor(du*32)*Math.max(1,Math.floor(dv*16));
      for(let i=0;i<n*2;i++){const u=u0+.02+hsh(seed,i,1)*(du-.04),v=v0+.02+hsh(seed,i,2)*(dv-.04),p=P(u,v);RC(g,p[0],p[1],1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
    const rail=(S,a,b,o={})=>S.t(o.d!=null?o.d:50,(g)=>{const h=o.h||5,pc=o.pc||'#34393e',rc=o.rc||'#4d545a';
      const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],pa=P(a[0],a[1]),pb=P(b[0],b[1]),Lp=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,rnd(Lp/(o.step||3))),gp=o.gap;
      const seg=(t0,t1)=>{const A0=at(t0),A1=at(t1);BL(g,P(A0[0],A0[1],h),P(A1[0],A1[1],h),rc);BL(g,P(A0[0],A0[1],1),P(A1[0],A1[1],1),rc);};
      const segs=gp?[[0,gp[0]],[gp[1],1]]:[[0,1]];for(const s of segs)if(s[1]-s[0]>1e-3)seg(s[0],s[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(gp&&t>gp[0]+1e-6&&t<gp[1]-1e-6)continue;const q=at(t),p=P(q[0],q[1]);RC(g,p[0],p[1]-h,1,h,pc);}});
    const bikes=(S,u0,v0,len,alongU,d,seed)=>S.t(d,(g)=>{const n=Math.max(2,Math.floor(len*32/3));for(let i=0;i<n;i++){const t=len*(i+.5)/n,p=alongU?P(u0+t,v0):P(u0,v0+t),x=rnd(p[0]),y=rnd(p[1]);
      const c=['#c24a3a','#2f5f96','#d9d9d4','#3f7f4a','#e0a83a','#2a2d31'][hsh(seed||3,i,1)*6|0];
      RC(g,x-1,y-1,1,1,'#2a2d31');RC(g,x+1,y,1,1,'#2a2d31');RC(g,x-1,y-2,2,1,c);RC(g,x+1,y-1,1,1,c);RC(g,x,y-3,1,1,'#2a2d31');}});
    const fountain=(S,uc,vc,r,d)=>S.o(d,(g,n)=>{const c=P(uc,vc),x=rnd(c[0]),y=rnd(c[1]),rx=rnd(r*45.25),ry=rnd(r*22.6);
      ell(g,x,y,rx,ry,'#a39c8c');ell(g,x,y-2,rx,ry,'#e3ddcf');ell(g,x,y-2,rx-2,Math.max(1,ry-1),'#4c7f9e');ell(g,x-1,y-2,rx-4,Math.max(1,ry-3),'#5e93b2');
      RC(g,x-2,y-5,5,2,'#e3ddcf');RC(g,x-2,y-4,5,1,'#a39c8c');RC(g,x-1,y-8,2,3,'#cfc8b8');
      RC(g,x,y-13,1,5,'#d8eef8');RC(g,x-1,y-11,1,3,'#b8dcee');RC(g,x+1,y-11,1,3,'#b8dcee');});
    // 銅像（石台座＋青銅人像）
    const statue=(S,u,v,d,s=1,z=0)=>S.o(d!=null?d:u+v+.08,(g)=>{boxZ(g,u-.06*s,v-.06*s,.12*s,.12*s,z,2,'#d9d3c4','#cfc8b8','#9f998b');boxZ(g,u-.04*s,v-.04*s,.08*s,.08*s,z+2,5*s,'#e3ddcf','#d6cfbf','#a39c8c');
      const p=P(u,v,z+2+5*s),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-8,3,8,'#4d6a5e');RC(g,x+1,y-8,1,8,'#35493f');RC(g,x-1,y-10,2,2,'#5c7d70');RC(g,x+2,y-8,1,3,'#4d6a5e');RC(g,x-2,y-7,1,2,'#6d8f81');});
    // 小攤車（冰淇淋／熱狗）：車身＋條紋傘
    const cart=(S,u,v,col,d)=>{SHD.push(['b',u-.05,v-.03,.1,.06,6]);S.o(d!=null?d:u+v+.06,(g,n)=>{boxZ(g,u-.05,v-.03,.1,.06,1,4,'#f2efe6',col,SH(col,-34));
      const w1=P(u-.03,v+.03),w2=P(u+.04,v+.03);RC(g,w1[0],w1[1]-1,1,1,'#2a2d31');RC(g,w2[0],w2[1]-1,1,1,'#2a2d31');
      const p=P(u,v,5),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-5,1,5,'#8a8a86');
      RC(g,x-4,y-6,9,1,SH(col,-26));RC(g,x-3,y-7,7,1,'#f4f1e8');RC(g,x-2,y-8,5,1,col);RC(g,x-1,y-9,3,1,'#f4f1e8');RC(g,x-3,y-7,2,1,col);RC(g,x+2,y-7,2,1,col);
      if(n)RC(n,x-2,y-2,4,1,'#ffe6a0');});};
    // 咖啡座陽傘＋桌椅
    const umbrella=(S,u,v,col,d)=>{S.o(d!=null?d:u+v+.06,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-2,y-3,5,1,'#e9e5da');RC(g,x-1,y-2,3,1,'#b9b4a8');RC(g,x,y-9,1,7,'#6d6a64');
      RC(g,x-3,y-2,1,2,'#6d6a64');RC(g,x+3,y-2,1,2,'#6d6a64');
      RC(g,x-4,y-9,9,1,SH(col,-30));RC(g,x-3,y-10,7,1,col);RC(g,x-2,y-11,5,1,SH(col,18));RC(g,x-1,y-12,3,1,SH(col,30));RC(g,x,y-13,1,1,'#6d6a64');});};
    // 小車（trans_a 印章）：長 .23、寬 .1
    const CL=.23,CW=.1,CST={};
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        fp(x,[pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        fp(x,[pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        fp(x,[pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      let tx=null;if(taxi){const p=pt(CL*.47,CW*.5,4);tx=[rnd(p[0]),rnd(p[1])-1];x.fillStyle='#f6f3e4';x.fillRect(tx[0],tx[1],2,1);}
      return CST[key]={c,ox,oy,tx};};
    const car=(S,u,v,alongU,col,d,taxi)=>{const st=carStamp(alongU?'u':'v',col,taxi),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g,n)=>{g.drawImage(st.c,X0,Y0);if(n&&st.tx)RC(n,X0+st.tx[0],Y0+st.tx[1],2,1,'#fff2c0');});};
    // ---- 劇院元件 ----
    // 雨遮招牌（自 +v 牆 v 外挑 dv；u a..b；底 z、厚 th）：正面／側面字板（深色字）＋上下緣燈泡（亮暗交錯）；o.glass＝鑄鐵玻璃頂
    const marqueeL=(g,n,v,a,b,z,dv,th,o={})=>{const v1=v+dv,body=o.body||'#2a2d31',board=o.board||'#f3ecd6',bl=o.bulb||'#f6d36a',bd=o.bulbD||'#a8842c',ink=o.ink||'#2a2226';
      boxZ(g,a,v,b-a,dv,z,th,o.top||SH(body,26),body,SH(body,-16));
      if(o.glass){flat(g,a+.02,v+.02,b-a-.04,dv-.04,'#a9c6d6',z+th);for(let t=a+.06;t<b-.03;t+=.06)lineV(g,t,v+.02,v1-.02,'#6f8a99',z+th);}
      if(th>=5){faceL(g,v1,a+.03,b-.03,z+1.5,z+th-1.5,board);faceR(g,b,v+.03,v1-.03,z+1.5,z+th-1.5,SH(board,-44));
        const rows=Math.max(1,Math.floor((th-3)/2.5));for(let r=0;r<rows;r++){const zz=z+th-2.5-r*2.5;let t=a+.06,k=0;
          while(t<b-.06){const w=(1+((hsh(o.seed||1,k,r)*3)|0))/32;if(t+w>b-.05)break;faceL(g,v1,t,t+w,zz-1,zz,ink);t+=w+1/32+((k%4===3)?1/32:0);k++;}
          let s=v+.06,j=0;while(s<v1-.06){const w=(1+(j%2))/32;faceR(g,b,s,s+w,zz-1,zz,'#2a2226');s+=w+1/32;j++;}}
        if(n){faceL(n,v1,a+.03,b-.03,z+1.5,z+th-1.5,'rgba(255,244,214,.9)');faceR(n,b,v+.03,v1-.03,z+1.5,z+th-1.5,'rgba(243,226,180,.75)');}}
      const bulbs=(zz)=>{let i=0;for(let t=a+.01;t<=b+1e-6;t+=2/32,i++){const p=P(t,v1,zz);RC(g,p[0],p[1],1,1,i%2?bd:bl);if(n)RC(n,p[0],p[1],1,1,'#fff4c0');}
        i=0;for(let s=v+.02;s<=v1+1e-6;s+=2/32,i++){const p=P(b,s,zz);RC(g,p[0],p[1],1,1,i%2?bd:bl);if(n)RC(n,p[0],p[1],1,1,'#ffeab0');}};
      bulbs(z+th-.6);if(th>=4)bulbs(z+.4);
      if(n){for(let t=a+.04;t<b-.02;t+=.08){const p=P(t,v1-.03,z-1);RC(n,p[0],p[1],2,1,'rgba(255,226,160,.55)');}}};
    // 消防梯（+u 牆面 u）：levels＝各層平台 z（由上而下）；平台跨 va..vb、外挑 dp；之字梯段、欄杆、最底吊梯
    const fireEscR=(S,d,u,va,vb,levels,o={})=>S.t(d,(g)=>{const c=o.col||'#2b2f33',c2=o.rail||'#555c62',dp=o.dp||.08,u1=u+dp;
      for(let k=0;k<levels.length;k++){const z=levels[k];
        fp(g,[P(u,va,z),P(u1,va,z),P(u1,vb,z),P(u,vb,z)],c2);BL(g,P(u1,va,z),P(u1,vb,z),c);
        BL(g,P(u1,va,z+4),P(u1,vb,z+4),c);BL(g,P(u,va,z+4),P(u1,va,z+4),c);BL(g,P(u,vb,z+4),P(u1,vb,z+4),c);
        for(let i=0;i<=4;i++){const t=va+(vb-va)*i/4,p=P(u1,t,z);RC(g,p[0],p[1]-4,1,4,c);}
        if(k+1<levels.length){const z2=levels[k+1],a=(k%2===0)?[vb-.03,va+.09]:[va+.03,vb-.09],um=u+dp*.5;
          BL(g,P(um,a[0],z),P(um,a[1],z2),c);BL(g,P(um,a[0],z+3),P(um,a[1],z2+3),c2);
          for(let i=1;i<6;i++){const f=i/6,p=P(um,a[0]+(a[1]-a[0])*f,z+(z2-z)*f);RC(g,p[0]-1,p[1],2,1,c2);}}}
      const zl=levels[levels.length-1],q0=P(u1-.01,va+.04,zl),q1=P(u1-.01,va+.04,Math.max(5,zl-9));BL(g,q0,q1,c);BL(g,[q0[0]+2,q0[1]+1],[q1[0]+2,q1[1]+1],c);
      for(let y=q0[1]+2;y<q1[1];y+=2)RC(g,q0[0],y,3,1,c);});
    // 消防梯（二次退件重畫，+u 牆面 u）：螢幕空間逐像素構造，只有乾淨的 2:1 等距線，沒有任何散點——
    //   平台＝兩列板（上列頂面 slab2、下列前緣 slab）＋板下 1px 落在牆上的陰影 ud＋上方 RH px 的 1px 欄杆與左中右三根立柱；
    //   梯段＝自上層平台左端（j0＝Lx-1）往右下 2:1 的 1px 斜扶手，其下 RH px 為同色連續踏步線，恰好落在下層平台 j0-dz 處；
    //   出口門＝各層平台左端後方的牆上暗門；吊梯＝兩根豎軌＋橫檔，貼牆掛在最低平台下方。
    //   levels 由上而下，層距 dz 必須為偶數且 ≤ Lx-1（2:1 才能整數落點、梯段不超出平台）
    const fireEsc3=(S,d,u,va,levels,o={})=>S.t(d,(g)=>{const sl=o.slab,sl2=o.slab2||o.slab,ud=o.ud,rl=o.rail,hr=o.hand||o.rail,dr=o.door,dp=o.dp!=null?o.dp:.03,Lx=o.Lx||12,RH=o.rh||3;
      const b0=P(u+dp,va,levels[0]),Bx=rnd(b0[0]),By=rnd(b0[1]),px=(x,y,c)=>RC(g,x,y,1,1,c);
      const lvY=(k,j)=>By+(levels[0]-levels[k])+((j+1)>>1);         // 第 k 層平台前緣、自右端往左第 j 像素的 y
      if(dr)for(let k=0;k<levels.length;k++)for(let j=Lx-3;j<Lx;j++)for(let y=lvY(k,j)-6;y<lvY(k,j)-1;y++)px(Bx-j,y,dr);
      // 梯段（畫在平台之前 ⇒ 平台板與欄杆蓋在上面）
      for(let k=0;k+1<levels.length;k++){const dz=levels[k]-levels[k+1],j0=Lx-1,je=j0-dz,xe=Bx-je,ye=lvY(k+1,je);
        for(let m=0;m<=dz;m++){const x=xe-m,y=ye-((m+(je&1))>>1);px(x,y-RH,hr);if(m>0&&m<dz)px(x,y,hr);}}
      // 平台
      for(let k=0;k<levels.length;k++){for(let j=0;j<=Lx;j++){const y=lvY(k,j);px(Bx-j,y-1,sl2);px(Bx-j,y,sl);if(ud)px(Bx-j,y+1,ud);px(Bx-j,y-RH,rl);}
        for(const j of[0,Lx>>1,Lx])for(let y=lvY(k,j)-RH+1;y<lvY(k,j)-1;y++)px(Bx-j,y,rl);}
      if(o.ladder){const[j,len]=o.ladder,kk=levels.length-1,x=Bx-j,y0=lvY(kk,j)+(ud?2:1);
        for(let y=y0;y<y0+len;y++){px(x,y,rl);px(x-2,y+1,rl);}
        for(let y=y0+2;y<y0+len;y+=2)px(x-1,y,rl);}});
    // 紅絨繩欄柱（兩列）
    const ropes=(S,d,rows)=>S.t(d,(g)=>{for(const row of rows){for(let i=0;i<row.length;i++){const p=P(row[i][0],row[i][1]);RC(g,p[0],p[1]-4,1,4,'#c9a23e');RC(g,p[0],p[1]-5,1,1,'#f2d67a');
        if(i+1<row.length){const q=P(row[i+1][0],row[i+1][1]);BL(g,[p[0],p[1]-3],[q[0],q[1]-3],'#b0242c');}}}});
    // 圓形廣告柱（Litfaß）：綠柱身＋彩色海報帶＋小圓頂
    const litfass=(S,u,v,d)=>{SHD.push(['c',u,v,3,14]);S.o(d!=null?d:u+v+.06,(g,n)=>{const c=P(u,v),cx=c[0],cy=c[1],Rx=.07*45.25,Ry=Rx/2,PC=['#d8574a','#f2c230','#2f5f96','#f4efe2','#3f7f4a','#8a5bb0'];
      for(let x=Math.floor(cx-Rx);x<=Math.ceil(cx+Rx);x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const s=Math.sqrt(1-X*X),yb=Math.round(cy+Ry*s),dk=X>.35?-40:X>-.2?-14:10;
        RC(g,x,yb-2,1,2,SH('#4f6b4a',dk));RC(g,x,yb-12,1,10,SH(PC[((x-Math.floor(cx-Rx))/2|0)%PC.length],dk));RC(g,x,yb-13,1,1,SH('#4f6b4a',dk));}
      dome(g,u,v,.075,13,4,['#7fa07a','#6a8f64','#557a50','#446540','#354f32']);const ap=P(u,v,17);RC(g,ap[0],ap[1]-2,1,2,'#c9a23e');});};
    // 小貨車（沿 +u，車頭朝 +u）
    const truck=(S,u,v,col,d)=>{SHD.push(['b',u,v,.42,.13,10]);S.o(d!=null?d:u+v+.25,(g)=>{boxZ(g,u,v,.28,.13,2,11,'#e9ecee','#dfe3e5','#b3babf');faceL(g,v+.13,u+.02,u+.26,6,8,col);
      boxZ(g,u+.29,v+.01,.11,.12,2,7,SH(col,24),col,SH(col,-34));faceR(g,u+.4,v+.03,v+.11,5,8,'#3a5163');faceL(g,v+.13,u+.31,u+.36,5,8,'#3a5163');
      for(const t of[u+.07,u+.22,u+.34]){const p=P(t,v+.13);RC(g,p[0],p[1]-2,2,2,'#1f2225');}});};
    // 3×5 點陣字（招牌／手繪老牆招）：side 'L' 由左到右；'R' 面 v 增加往畫面左下 ⇒ 鏡像
    const FONT={G:['111','100','101','101','111'],L:['100','100','100','100','111'],I:['111','010','010','010','111'],M:['101','111','111','101','101'],E:['111','100','110','100','111'],
      R:['110','101','110','101','101'],S:['111','100','111','001','111'],H:['101','101','111','101','101'],O:['111','101','101','101','111'],W:['101','101','111','111','101'],
      T:['111','010','010','010','010'],A:['010','101','111','101','101'],U:['101','101','101','101','111'],N:['101','111','111','111','101'],P:['110','101','110','100','100'],C:['111','100','100','100','111']};
    const glyph=(g,side,fx,t0,z0,ch,col)=>{const F=F_(side),gl=FONT[ch];if(!gl)return;for(let r=0;r<5;r++)for(let c=0;c<3;c++){if(gl[r][c]!=='1')continue;const cc=side==='R'?2-c:c;F(g,fx,t0+cc/32,t0+(cc+1)/32,z0+4-r,z0+5-r,col);}};
    // 售票亭（獨立小亭）：石／金屬座＋玻璃窗＋招牌帶（字）＋頂（o.dome 銅頂色階；否則平頂）
    const boxOffice=(S,u,v,o={})=>{const du=.12,dv=.1,h=o.h||8,bd=o.band||'#b8282f',ink=o.ink||'#f2d27a';SHD.push(['b',u,v,du,dv,h+4]);
      S.o(o.d!=null?o.d:u+v+.16,(g,n)=>{const base=o.base||'#8a7a5a';
        boxZ(g,u,v,du,dv,0,2,null,base,SH(base,-30));boxZ(g,u,v,du,dv,2,h-2,null,'#86abc3','#557a92');
        faceL(g,v+dv,u+du*.5-.5/32,u+du*.5+.5/32,2,h,o.fr||'#c9a23e');faceL(g,v+dv,u,u+du,4,5,o.fr||'#c9a23e');
        boxZ(g,u-.01,v-.01,du+.02,dv+.02,h,2.5,o.cap||'#2a2d31',bd,SH(bd,-40));
        for(let t=u+.01,k=0;t<u+du-.01;t+=2/32,k++)if(k%3!==2)faceL(g,v+dv+.01,t,t+1/32,h+.8,h+1.8,ink);
        if(o.dome)dome(g,u+du/2,v+dv/2,.08,h+2.5,5,o.dome);else flat(g,u-.01,v-.01,du+.02,dv+.02,o.roof||'#f2f2ee',h+2.5);
        if(n){faceL(n,v+dv,u,u+du,3,h,LIT);faceR(n,u+du,v,v+dv,3,h,LIT2);for(let t=u+.01,k=0;t<u+du-.01;t+=2/32,k++)if(k%3!==2)faceL(n,v+dv+.01,t,t+1/32,h+.8,h+1.8,'#fff4c0');}});};
    // 大型垃圾箱
    const dumpster=(S,u,v,d)=>{S.o(d!=null?d:u+v+.1,(g)=>{boxZ(g,u,v,.14,.08,0,5,'#3f6b4c','#4f7f5a','#35573f');boxZ(g,u-.005,v-.005,.15,.09,5,1,'#2f5039','#3f6b4c','#2a4632');});};
    return {LIT,LIT2,GL,GD,GH,SHD,win1,winRow,mass,gableU,gableV,hipU,pyramid,flatTop,dome,cyl,colsL,colsR,doorL,doorR,stairsV,stairsU,bannerF,curtain,glassTop,
      flagpole,kid,crowd,bench,lamp,bannerPole,tree,cypress,bush,hedge,flowers,rail,bikes,fountain,statue,cart,umbrella,car,
      marqueeL,fireEscR,fireEsc3,ropes,litfass,truck,dumpster,glyph,boxOffice};
  };

  const build=(k,def,layoutsOf)=>{
    const old=B[k+'_1_0'];
    const W=(old&&old.w)||def.W,H=(old&&old.h)||def.H,AX=(old&&old.ax!=null)?old.ax:def.AX,AY=(old&&old.ay!=null)?old.ay:def.AY;
    const K=A.iso575(W,H,AX,AY,def.SZ),L=LIB(K),order=DEV[k]||null,out=[];
    // 收尾裁切：佔地菱形南側兩條斜邊以外、頂端 2 列以內一律清掉
    const cutAt=[];
    const clip=(c)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;let cut=0;
      for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4+3;if(!a[i])continue;if(y<2||y+.5>AY-Math.abs(xx+.5-AX)/2+.01){a[i]=0;cut++;if(cutAt.length<12)cutAt.push(xx+','+y);}}
      if(cut){x.putImageData(d,0,0);}return cut;};
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;
      try{const T=KIT(L),lay=layoutsOf(L,T);const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
        const o=lay[v](g,ng,S)||{};if(T.SHD.length)L.shadow(g,T.SHD);S.run(g,ng);
        const cut=clip(c),cutN=clip(nc);
        const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:o.smoke||[]};
        if(o.flagAt){spr.flagAt=o.flagAt;const[fx,fy]=o.flagAt,id=c.getContext('2d').getImageData(fx-1,fy-3,2,3).data;let op=0;for(let i=3;i<id.length;i+=4)if(id[i])op++;
          if(op)errs.push('k'+k+'v'+v+' flagAt 上方有不透明像素 '+op);}
        chk.push({k,v,cut,cutN,flagAt:o.flagAt||null,at:cutAt.splice(0).join(' ')});
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('cul_a k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];
  };

  // ================= k35 博物館（2×2）=================
  try{
    build(35,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD;
      return [
      // ---------- v0 古典穹頂：石砌台基上的新古典主館——左右兩座突出端閣（高一截、閣樓、垂掛紅／藍展覽布幔、雕像頂飾）夾中央五開間，
      //      正中六柱山花門廊＋五級大台階（兩側頰牆＋古典路燈），屋頂正中鼓座＋銅綠肋紋圓頂＋採光亭；
      //      前庭石板平台（冰淇淋車、長椅、遊客），中軸步道通前緣、兩側草坪花帶與行道樹、掛布幔燈桿；左角旗桿，右側窄帶樹列 ----------
      (g,ng,S)=>{
        const ST='#e7ddc6',STD='#aa9e83',CR='#f5efdf',LEAD='#8d9196';
        const C={wl:ST,wr:STD,bl:'#cbc0a6',br:'#8d846f',cor:CR,cs:'#efe7d2',sill:'#f7f2e4',sillR:'#c0b59a',gl:GL,gd:GD};
        const ZB=5,COP=['#a6d6c2','#86bda8','#68a28d','#518873','#3d6b5b'],DR=['#f3ebd6','#e7ddc6','#d2c6aa','#b5a88c','#968a70'];
        pave(g,'g',0,0,2,2,3501);
        pave(g,'st',.08,.1,1.86,1.62,3502);
        pave(g,'st',.8,1.72,.4,.28,3503);
        T.flowers(g,.1,1.76,.62,.05,3504,['#c8566a','#e0b24a','#f0e6d8']);T.flowers(g,1.28,1.76,.62,.05,3505,['#c8566a','#e0b24a','#f0e6d8']);
        shadow(g,[['b',.12,.16,1.72,.98,ZB],['b',.16,.2,.3,.92,38],['b',.46,.2,1.04,.86,34],['b',1.5,.2,.3,.92,38],['b',.7,1.06,.56,.28,42],['b',.84,.44,.3,.3,62]]);
        // 台基
        S.o(.5,(g)=>{boxZ(g,.12,.16,1.72,.98,0,ZB,'#ddd4bf','#c9bfa6','#8f8672');boxZ(g,.66,1.14,.64,.2,0,ZB,'#ddd4bf','#c9bfa6','#8f8672');
          faceL(g,1.14,.12,.66,ZB-1,ZB,'#ece5d2');faceL(g,1.14,1.3,1.84,ZB-1,ZB,'#ece5d2');faceR(g,1.84,.16,1.14,ZB-1,ZB,'#a39a84');});
        // 端閣
        const pav=(u0,seed,bc,ba)=>(g,n)=>{const du=.3,v0=.2,dv=.92,h=28,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,C,{zb:ZB,fl:2,z0:3,fh:12,w:3,wh:[8,6],pitch:8,st:'arch',seed,lit:.3,noL:1});
          for(let z=ZB+3;z<ZB+11;z+=3)faceL(g,v1,u0,u0+du,z,z+1,SH(ST,-14));
          faceL(g,v1,u0+.03,u0+.05,ZB+2,ZB+h-2,SH(ST,12));faceL(g,v1,u0+du-.05,u0+du-.03,ZB+2,ZB+h-2,SH(ST,-12));
          T.bannerF(g,'L',v1,u0+du/2,ZB+8,ZB+25,5,bc,ba,{band:'#f4efe2'});
          T.flatTop(g,u0,v0,du,dv,ZB+h,LEAD,{cap:CR});
          // 閣樓（attic）只在前段：壓頂＋頂飾雕像
          boxZ(g,u0,v1-.36,du,.36,ZB+h,4,'#efe7d4',ST,STD);faceL(g,v1,u0,u0+du,ZB+h+3,ZB+h+4,CR);faceR(g,u0+du,v1-.36,v1,ZB+h+3,ZB+h+4,SH(CR,-40));
          for(const uu of[u0+.05,u0+du-.05]){const p=P(uu,v1-.05,ZB+h+4),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-5,2,5,'#d9d1bd');RC(g,x,y-5,1,5,'#b3a88f');RC(g,x-1,y-6,2,1,'#e8e1cf');}};
        S.o(1.0,pav(.16,3511,'#a8323a','#f0d27a'));
        S.o(1.1,(g,n)=>{const u0=.46,v0=.2,du=1.04,dv=.86,h=28,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,C,{zb:ZB,fl:2,z0:3,fh:12,w:3,wh:[8,6],pitch:8,st:'arch',seed:3512,lit:.25,skipL:[[.66,1.3]],noR:1});
          T.flatTop(g,u0,v0,du,dv,ZB+h,LEAD,{cap:CR});
          faceL(g,v1,.7,1.26,ZB,ZB+24,'#9f937a');
          for(const t of[.84,.98,1.12])T.doorL(g,n,v1,t,4,11,'#c9bfa6','#4b3226',ZB);});
        S.o(1.2,pav(1.5,3513,'#2c5fae','#f4efe2'));
        // 圓頂：方座＋鼓座（壁柱、拱窗）＋簷環＋肋紋銅綠圓頂＋採光亭
        S.o(1.3,(g,n)=>{const uc=.98,vc=.62,z=ZB+28;
          boxZ(g,uc-.3,vc-.3,.6,.6,z,2,'#ece4d0',ST,STD);
          T.cyl(g,n,uc,vc,.25,z+2,9,DR,{cap:CR,pil:10,pc:'#fbf6ea',pd:'#c5b99d',win:{n:5,z0:2,z1:7,w:2,glass:GL,gd:GD,arch:1,seed:3514,lit:.5}});
          T.cyl(g,null,uc,vc,.27,z+11,1.5,[CR,CR,'#ddd4bf','#c3b89f','#a59a82'],{cap:CR});
          T.dome(g,uc,vc,.26,z+12.5,15,COP,{ribs:10});
          T.cyl(g,n,uc,vc,.055,z+26,4,DR,{cap:CR,win:{n:2,z0:1,z1:3,w:1,arch:0,seed:3515,lit:1}});
          T.dome(g,uc,vc,.06,z+30,3,COP);const ap=P(uc,vc,z+33);RC(g,ap[0],ap[1]-3,1,3,'#c9a64a');});
        // 門廊（退件重畫）：前排六柱＋右側兩根側柱（側面封住，不留灰板）、三段楣（楣帶刻字點）、柱間三幅展覽長布幔；
        //      山花＝短縱深三角稜柱：屋脊沿 v，三角山花落在 +v 面（與柱列、大台階同向）——深色外框（分層描邊）＋淺色簷線＋暗一階鼓室＋浮雕；
        //      右坡屋面只露 dP 縱深 ≈3px 斜條，稜柱後方是楣頂平台接主樓簷口
        S.o(2.3,(g,n)=>{const a=.7,b=1.26,vw=1.06,vf=1.32,h=24,zE=ZB+h,zb0=zE+3,RISE=13,dP=.09,a0=a-.01,b0=b+.01,vp=vf+.01,um=(a+b)/2,zt=zb0+RISE;
          T.colsR(g,b,vw+.06,vf-.08,2,ZB,h,'#f7f2e6','#c4bca9');
          T.colsL(g,vf,a+.02,b-.02,6,ZB,h,'#f7f2e6','#c4bca9');
          // 柱間展覽布幔：3px×13px（含頂桿），紅／藏青／芥黃，中央一道 1px 淺色印字
          const vB=vf+.004,cell=(t,k,z,c)=>faceL(g,vB,t+k/32,t+(k+1)/32,z,z+1,c);
          for(const[t0,col]of[[.8067,'#b8323a'],[.98,'#27427e'],[1.1533,'#d9a43c']]){const t=vB+Math.round((t0-vB)*32)/32;
            for(let z=zE-12;z<zE-1;z++){cell(t,-1,z,SH(col,16));cell(t,0,z,col);cell(t,1,z,SH(col,-22));}
            for(let z=zE-9;z<zE-3;z++)if(z!==zE-6)cell(t,0,z,'#f4efe2');
            for(const k of[-1,0,1])cell(t,k,zE-12,SH(col,-34));
            for(const k of[-2,-1,0,1,2])cell(t,k,zE-1,'#3b3631');}
          // 楣：額枋陰影＋楣帶刻字點＋簷口亮線；右側面石色
          boxZ(g,a0,vw,b0-a0,vp-vw,zE,3,CR,'#efe7d4',STD);
          faceL(g,vp,a0,b0,zE,zE+1,SH(CR,-20));
          for(let t=a0+.06,k=0;t<b0-.05;t+=2/32,k++)if(k%4!==3)faceL(g,vp,t,t+1/32,zE+1,zE+2,'#9a8f78');
          faceL(g,vp,a0,b0,zE+2,zE+3,'#fffaf0');faceR(g,b0,vw,vp,zE+2,zE+3,SH(STD,16));
          // 右坡屋面斜條（鉛灰，只露 dP 縱深）
          const Ap=P(um,vp,zt),Ab=P(um,vp-dP,zt),Er=P(b0+.012,vp,zb0-.6),Eb=P(b0+.012,vp-dP,zb0-.6);
          fp(g,[Ab,Eb,Er,Ap],'#a3a5a6');BL(g,Ap,Ab,'#e4e6e4');BL(g,Er,Eb,'#74777a');
          // 山花：鼓室（暗一階）＋三邊淺色簷線＋斜簷下 1px 陰影
          const Lp=P(a0,vp,zb0),Rp=P(b0,vp,zb0);
          fp(g,[Lp,Rp,Ap],'#c8b999');
          BL(g,Lp,Ap,'#fffaf0');BL(g,Ap,Rp,'#fffaf0');BL(g,Lp,Rp,'#fffaf0');
          BL(g,P(a0+.07,vp,zb0+1),P(um,vp,zt-2),'#a0937a');BL(g,P(um,vp,zt-2),P(b0-.035,vp,zb0+1),'#a0937a');
          // 浮雕：中央立像（左亮右暗）＋兩側橫臥像（沿 u 的短斜筆）
          const fc=(dt,z,c)=>faceL(g,vp,um+dt/32,um+(dt+1)/32,zb0+z,zb0+z+1,c);
          for(let z=2;z<=6;z++){fc(-1,z,'#f6efe0');fc(0,z,'#8d8066');}fc(-1,7,'#f6efe0');
          for(let dt=-6;dt<=-3;dt++)fc(dt,dt===-6?3:2,'#8d8066');fc(-5,3,'#f6efe0');
          for(let dt=2;dt<=5;dt++)fc(dt,dt===5?3:2,'#8d8066');fc(4,3,'#f6efe0');
          // 頂飾與兩端角飾
          RC(g,Ap[0],Ap[1]-3,1,3,'#d9d1bd');RC(g,Ap[0]-1,Ap[1]-2,3,1,'#d9d1bd');
          for(const q of[Lp,Rp])RC(g,q[0]-1,q[1]-3,2,3,'#d9d1bd');
          if(n){const lp=P(um,vf-.1,zE-1);RC(n,lp[0]-1,lp[1],3,2,'#ffe6a0');}});
        // 大台階＋頰牆
        S.o(2.6,(g)=>{boxZ(g,.58,1.14,.06,.52,0,ZB+1,'#efe8d6','#d6ccb4','#9a917c');
          T.stairsV(g,.64,1.32,1.34,1.66,ZB,5,['#f2ecdc','#b3a88f','#958b76']);
          boxZ(g,1.32,1.14,.06,.52,0,ZB+1,'#efe8d6','#d6ccb4','#9a917c');});
        T.lamp(S,.61,1.62,13,2.9);T.lamp(S,1.35,1.62,13,3.3);
        // 前庭：雕像、攤車、長椅、樹、布幔燈桿
        T.statue(S,.36,1.44,null,1.1);T.statue(S,1.66,1.44,null,1.1);
        T.cart(S,1.62,1.2,'#d8574a');
        T.bench(S,.2,1.3,false);T.bench(S,1.84,1.34,true);
        T.bannerPole(S,.76,1.78,14,null,'#a8323a','#2f5f7e','c');T.bannerPole(S,1.24,1.78,14,null,'#2f5f7e','#a8323a','c');
        T.hedge(S,.12,1.7,.6,.04,null,2);T.hedge(S,1.28,1.7,.6,.04,null,2);
        for(const[u,v]of[[.64,1.86],[1.52,1.86]])T.bush(S,u,v,3);
        for(const[u,v,k,s]of[[.4,1.9,0,1.05],[1.76,1.88,0,1.05],[1.93,.56,1,1],[1.93,.98,2,.95],[1.93,1.42,0,.9]])T.tree(S,u,v,s,k);
        T.crowd(S,3.2,[[.82,1.44,'#c24a3a',{z:3}],[.9,1.52,'#2f5f96',{z:2}],[1.16,1.4,'#f4f4ef',{z:4}],[1.02,1.58,'#e8c23a',{z:1}],[1.24,1.56,'#3f7f4a',{z:1}],
          [.45,1.3,'#8a5bb0'],[.52,1.36,'#d9d9d4'],[1.5,1.28,'#c24a3a'],[1.56,1.24,'#3a3f4d',{dress:1}],[1.7,1.2,'#e0a83a'],[.96,1.8,'#2f5f96'],[1.04,1.92,'#c24a3a',{bag:'#3a3f4d'}],[.24,1.5,'#3f7f4a'],[1.8,1.56,'#f4f4ef']]);
        const fa=T.flagpole(S,.08,1.9,11,3.0);
        return{flagAt:fa};
      },
      // ---------- v1 現代白盒＋玻璃中庭：白石台基（四級寬台階）上，左側高聳白色展廳方盒（石材板縫、屋頂兩條玻璃天窗、正面巨幅蒙德里安式展覽海報），
      //      中段通高玻璃中庭（豎框格、反光格、玻璃屋頂、入口懸挑雨遮），右側挑空白盒（玻璃一樓＋細柱＋二樓橫向帶窗）；
      //      前方淺色廣場：倒影水池＋紅色抽象雕塑、方格植樹草坪、布幔燈桿、單車架與人潮 ----------
      (g,ng,S)=>{
        const W1='#f4f3ef',W2='#bcbfc1',WT='#e2e2dd',WJ='#e1e0da',WJR='#b0b3b5',ZB=4;
        pave(g,'g',0,0,2,2,3521);
        pave(g,'c',.06,.08,1.9,1.88,3522);
        pave(g,'g',.08,1.46,.56,.48,3523);
        flat(g,1.34,1.4,.58,.42,'#e4e1d8');flat(g,1.38,1.44,.5,.34,'#3e6c89');
        for(const[v,a,b]of[[1.52,1.46,1.72],[1.62,1.54,1.84],[1.7,1.42,1.62]])lineU(g,v,a,b,'#6a9bb8');
        lineU(g,1.44,1.38,1.88,'#2b4f66');lineV(g,1.38,1.44,1.78,'#2b4f66');
        shadow(g,[['b',.1,.12,1.82,1.2,ZB],['b',.14,.16,.72,1.1,ZB+40],['b',.86,.3,.4,.84,ZB+30],['b',1.26,.2,.62,.8,ZB+26]]);
        // 白石台基
        S.o(.5,(g)=>{boxZ(g,.1,.12,1.82,1.2,0,ZB,'#ecebe6','#dcdbd5','#a4a7a9');faceL(g,1.32,.1,1.92,ZB-1,ZB,'#f8f8f5');faceR(g,1.92,.12,1.32,ZB-1,ZB,'#b9bcbe');});
        // 左：高展廳
        S.o(1,(g,n)=>{const u0=.14,v0=.16,du=.72,dv=1.1,h=40,u1=u0+du,v1=v0+dv,z0=ZB,zt=ZB+h;
          boxZ(g,u0,v0,du,dv,z0,h,WT,W1,W2);
          for(let z=z0+8;z<zt-2;z+=8){faceL(g,v1,u0,u1,z,z+1,WJ);faceR(g,u1,v0,v1,z,z+1,WJR);}
          for(let t=u0+.18;t<u1-.05;t+=.18)faceL(g,v1,t,t+1/32,z0,zt,WJ);
          for(let t=v0+.18;t<v1-.05;t+=.18)faceR(g,u1,t,t+1/32,z0,zt,WJR);
          T.flatTop(g,u0,v0,du,dv,zt,'#c9cac5',{cap:'#f8f8f5'});
          for(const va of[.32,.74]){boxZ(g,u0+.1,va,du-.2,.14,zt,2,null,'#e6e6e1','#aeb1b3');T.glassTop(g,u0+.1,va,du-.2,.14,zt+2,{st:.09,gl:'#9dbdd1'});}
          const pa=.26,pb=.74,p0=z0+9,p1=z0+35,X=(f)=>pa+(pb-pa)*f,Z=(f)=>p0+(p1-p0)*f;
          faceL(g,v1,pa-1/32,pb+1/32,p0-1,p1+1,'#2a2d31');faceL(g,v1,pa,pb,p0,p1,'#f1eee4');
          faceL(g,v1,X(0),X(.58),Z(.42),Z(1),'#d0342c');faceL(g,v1,X(.64),X(1),Z(.72),Z(1),'#f0f0ea');faceL(g,v1,X(.64),X(1),Z(0),Z(.28),'#2a55a0');faceL(g,v1,X(0),X(.28),Z(0),Z(.36),'#f2c230');
          for(const f of[.58,.64])faceL(g,v1,X(f),X(f)+1/32,p0,p1,'#1e2024');faceL(g,v1,X(.28),X(.28)+1/32,p0,Z(.42),'#1e2024');
          for(const f of[.36,.42,.72])faceL(g,v1,pa,pb,Z(f),Z(f)+1,'#1e2024');faceL(g,v1,X(.64),pb,Z(.28),Z(.28)+1,'#1e2024');
          faceL(g,v1,pa,pb,p0-5,p0-3,'#2a2d31');faceL(g,v1,pa+.04,pa+.3,p0-4.5,p0-3.5,'#f4f3ef');
          faceR(g,u1,v0+.1,v1-.1,zt-7,zt-5,'#3a4e5e');if(n)faceR(n,u1,v0+.1,v1-.1,zt-7,zt-5,T.LIT2);});
        // 中：玻璃中庭
        S.o(1.1,(g,n)=>{const u0=.86,v0=.3,du=.4,dv=.84,h=30,u1=u0+du,v1=v0+dv,z0=ZB,zt=ZB+h;
          boxZ(g,u0,v0,du,dv,z0,h,null,'#86abc3','#557a92');
          T.curtain(g,n,'L',v1,u0,u1,z0,zt,{pitch:4,fh:6,lit:.95,seed:3524,inner:(F)=>{
            for(const t of[.3,.55,.8]){const tt=u0+du*t;F(g,v1,tt,tt+2/32,z0+1,z0+4,'#2e3a44');F(g,v1,tt,tt+2/32,z0+4,z0+5,'#caa27a');}
            F(g,v1,u0+.04,u1-.04,z0+12,z0+13,'#e9eef1');}});
          T.curtain(g,n,'R',u1,v0,v1,z0,zt,{pitch:4,fh:6,lit:.9,seed:3525});
          T.glassTop(g,u0,v0,du,dv,zt,{st:.1});
          faceL(g,v1,u0,u0+1/32,z0,zt,'#fafafa');faceR(g,u1,v1-1/32,v1,z0,zt,'#d5d8da');
          faceL(g,v1,.98,1.14,z0,z0+9,'#2d3b46');faceL(g,v1,1.058,1.062,z0,z0+9,'#9aa7ae');if(n)faceL(n,v1,.98,1.14,z0,z0+9,'#ffe3a0');});
        // 右：挑空白盒
        S.o(1.2,(g,n)=>{const z0=ZB;boxZ(g,1.32,.26,.48,.66,z0,10,'#cfd0cc',null,null);
          T.curtain(g,n,'L',.92,1.32,1.8,z0,z0+10,{pitch:5,fh:10,lit:.8,seed:3526});T.curtain(g,n,'R',1.8,.26,.92,z0,z0+10,{pitch:5,fh:10,lit:.8,seed:3527});
          for(const[u,v]of[[1.84,.97],[1.84,.6],[1.56,.97]])boxZ(g,u-.025,v-.025,.035,.035,z0,10,null,'#eeeeea','#a9acae');
          boxZ(g,1.26,.2,.62,.8,z0+10,16,WT,W1,W2);
          for(let t=1.26+.2;t<1.86;t+=.2)faceL(g,1.0,t,t+1/32,z0+10,z0+26,WJ);
          faceL(g,1.0,1.3,1.84,z0+16,z0+19,'#34495a');faceR(g,1.88,.24,.96,z0+16,z0+19,'#26363f');
          faceL(g,1.0,1.26,1.88,z0+10,z0+11,'#9da0a2');faceR(g,1.88,.2,1.0,z0+10,z0+11,'#7b7e80');
          if(n){for(let i=0;i<6;i++){if(hsh(3528,i,1)<.7)faceL(n,1.0,1.3+i*.09,1.3+i*.09+.08,z0+16,z0+19,T.LIT);if(hsh(3529,i,1)<.7)faceR(n,1.88,.24+i*.12,.24+i*.12+.11,z0+16,z0+19,T.LIT2);}}
          T.flatTop(g,1.26,.2,.62,.8,z0+26,'#c9cac5',{cap:'#f8f8f5'});
          boxZ(g,1.5,.4,.14,.12,z0+26,3,'#b9bdbf','#cfd2d4','#9a9ea1');});
        // 入口懸挑雨遮
        S.o(2.4,(g,n)=>{const z0=ZB;for(const u of[.84,1.28])boxZ(g,u-.015,1.3,.025,.025,z0,11,null,'#f2f2ee','#b0b3b5');
          boxZ(g,.8,1.14,.5,.19,z0+11,2,'#f7f7f4','#e6e6e2','#a9acae');faceL(g,1.33,.8,1.3,z0+11,z0+12,'#b8bbbd');
          if(n){const p=P(1.05,1.28,z0+10);RC(n,p[0]-3,p[1],7,1,'#ffe6a0');}});
        // 寬台階
        S.o(2.6,(g)=>{T.stairsV(g,.7,1.36,1.32,1.56,ZB,4,['#f6f6f2','#c3c6c7','#9fa2a4']);});
        // 紅色抽象雕塑（水池中）
        S.o(3.4,(g)=>{const c='#d4412f',cl='#e2583f',cd='#9a2a20';boxZ(g,1.52,1.56,.05,.05,0,14,c,cl,cd);boxZ(g,1.72,1.56,.05,.05,0,9,c,cl,cd);
          fp(g,[P(1.52,1.61,14),P(1.57,1.61,14),P(1.77,1.61,9),P(1.72,1.61,9)],cl);fp(g,[P(1.52,1.56,14),P(1.57,1.56,14),P(1.57,1.61,14),P(1.52,1.61,14)],c);
          fp(g,[P(1.57,1.56,14),P(1.77,1.56,9),P(1.77,1.61,9),P(1.57,1.61,14)],c);});
        for(const[u,v]of[[.2,1.58],[.48,1.58],[.2,1.86],[.48,1.86]]){S.o(u+v,(g)=>{boxZ(g,u-.06,v-.06,.12,.12,0,2,'#d8d6ce','#cfcdc4','#9c9a92');});T.tree(S,u,v,1.05,(u*10|0)%3===0?2:0,u+v+.05);}
        T.bench(S,.34,1.72,true);
        for(const[u,v]of[[1.42,1.12],[1.66,1.12]])S.o(u+v+.1,(g)=>{boxZ(g,u,v,.14,.06,ZB,1,'#b0845a','#9a6f48','#7a5638');});
        T.bannerPole(S,.66,1.66,14,null,'#d0342c','#2a55a0','m');T.bannerPole(S,1.3,1.9,14,null,'#2a55a0','#f2c230','m');
        T.lamp(S,1.94,1.34,13,null,'m');T.lamp(S,.9,1.94,13,null,'m');
        T.bikes(S,1.94,.3,.5,false,2.5,3530);
        T.crowd(S,3.3,[[.84,1.38,'#2f5f96',{z:3}],[.92,1.46,'#c24a3a',{bag:'#3a3f4d',z:2}],[1.06,1.36,'#f4f4ef',{z:3}],[1.2,1.5,'#3f7f4a',{z:1}],[1.14,1.66,'#e8c23a'],[.84,1.76,'#8a5bb0'],[1.0,1.84,'#2a2d31',{dress:1}],
          [.7,1.36,'#e0a83a',{z:ZB}],[1.24,1.74,'#d9d9d4'],[1.36,1.88,'#c24a3a'],[1.62,1.86,'#2f5f96'],[1.86,1.86,'#f4f4ef'],[.36,1.72,'#3a3f4d'],[1.5,1.2,'#8a2f2a',{z:ZB}],[1.76,1.24,'#f4f4ef',{z:ZB}],[1.0,1.24,'#c24a3a',{z:ZB}]]);
        return{};
      },
      // ---------- v2 紅磚舊館＋新翼：左側維多利亞紅磚舊館（兩層石窗楣拱窗、腰線、四坡石板瓦＋老虎窗＋煙囪），正中突出入口翼——三拱門廊＋館名橫額＋大拱窗、
      //      荷蘭式階梯山牆（頂端旗桿）、兩側尖頂小角塔、三級石階；右側深古銅色金屬新翼（正面整面玻璃帷幕＋兩幅展覽布幔、東南長立面下半通長玻璃帶＋上半亮邊金屬鰭、綠屋頂＋天窗），以玻璃連廊接舊館；
      //      前方碎石中軸步道、兩側草坪綠籬、銅像花壇與樹，新翼前磚鋪廣場（咖啡座兩把陽傘退到前緣）與單車 ----------
      (g,ng,S)=>{
        const BR={wl:'#b65b41',wr:'#803e2d',bl:'#8f897b',br:'#69645a',cor:'#ece2c8',cs:'#e2d5b6',sill:'#f1e9d4',sillR:'#b8ab8d',gl:GL,gd:GD};
        const RF='#5d6672',RS='#444b56',STN='#e6dcc2',BZ='#76665a',BZD='#4d433c';
        pave(g,'g',0,0,2,2,3531);
        pave(g,'bp',.06,.1,1.9,1.2,3532);
        pave(g,'bp',1.3,1.3,.66,.66,3533);
        pave(g,'gv',.54,1.26,.28,.74,3534);
        paint(g,(u,v)=>{const r=Math.hypot(u-.3,v-1.62);if(r<.1)return'#cbc3af';if(r<.15)return(hsh(3536,rnd(u*40),rnd(v*40))<.5)?'#c8566a':'#e0b24a';return null;});
        shadow(g,[['b',.1,.22,1.14,.64,32],['b',.44,.86,.48,.22,36],['b',1.24,.44,.14,.28,14],['b',1.38,.2,.5,1.04,20]]);
        // 舊館主體：兩層紅磚＋石窗楣拱窗＋腰線、四坡石板瓦、兩座老虎窗、兩根煙囪
        S.o(1,(g,n)=>{const u0=.1,v0=.24,du=1.14,dv=.62,h=28;
          T.mass(g,n,u0,v0,du,dv,h,BR,{fl:2,z0:3,fh:12,w:3,wh:[8,7],pitch:4.6,st:'arch',seed:3537,hood:1,skipL:[[.4,.96],[.94,1.02]],lit:.35});T.bannerF(g,'L',v0+dv,.99,5,24,4,'#1f4f7a','#f2d27a',{band:'#f4efe2'});
          T.hipU(g,u0,v0,du,dv,h,12,{rf:RF,rs:RS,ov:.04});
          for(const uc of[.22,1.12]){const va=.72;boxZ(g,uc-.05,va,.1,.08,30,5,null,BR.wl,BR.wr);T.gableV(g,uc-.05,va,.1,.08,35,3,{rf:RF,rs:RS,wl:BR.wl,ov:.015});
            faceL(g,va+.08,uc-.025,uc+.025,30,34,GL);faceL(g,va+.08,uc-.003,uc+.003,30,34,'#e8e1cf');if(n&&hsh(3547,uc*10|0,1)<.6)faceL(n,va+.08,uc-.025,uc+.025,30,34,T.LIT);}
          for(const uc of[.32,1.04]){boxZ(g,uc,.4,.06,.07,h+6,7,'#8a8f93',BR.wl,BR.wr);boxZ(g,uc-.01,.39,.08,.09,h+13,1.5,'#8a8f93','#d8cdb2','#a39880');}});
        // 入口翼：三拱門廊＋館名橫額＋三扇拱窗＋荷蘭式階梯山牆（石壓頂）
        S.o(1.1,(g,n)=>{const u0=.44,v0=.86,du=.48,dv=.22,h=33,u1=u0+du,v1=v0+dv,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,BR,{noL:1,noR:1});
          T.gableV(g,u0,v0-.26,du,dv+.26,h,12,{rf:RF,rs:RS,wl:BR.wl,ov:.02});
          for(let s=0;s<4;s++){const hw=du/2*(1-s*.25)+.01,za=h+s*3;faceL(g,v1,um-hw,um+hw,za-1,za+3,BR.wl);faceL(g,v1,um-hw,um+hw,za+2,za+3,STN);
            faceR(g,um+hw,v1-.03,v1,za-1,za+3,BR.wr);}
          faceL(g,v1,um-.04,um+.04,h+1,h+7,'#3f5d77');faceL(g,v1,um-.003,um+.003,h+1,h+7,STN);faceL(g,v1,um-.04,um-.02,h+6,h+7,BR.wl);faceL(g,v1,um+.02,um+.04,h+6,h+7,BR.wl);if(n)faceL(n,v1,um-.04,um+.04,h+1,h+6,T.LIT);
          faceL(g,v1,u0,u1,2,3,STN);
          for(const t of[um-.14,um,um+.14]){faceL(g,v1,t-.06,t+.06,3,14,STN);faceL(g,v1,t-.045,t+.045,3,12,'#2c2420');faceL(g,v1,t-.045,t-.02,11,12,STN);faceL(g,v1,t+.02,t+.045,11,12,STN);
            if(n)faceL(n,v1,t-.045,t+.045,3,11,'rgba(255,214,140,.75)');}
          faceL(g,v1,u0,u1,15,18,STN);for(let i=0;i<9;i++){const t=u0+.06+i*.042;if(i===4)continue;faceL(g,v1,t,t+.028,16,17,'#4b3a2e');}
          for(const t of[um-.14,um,um+.14])T.win1(g,n,'L',v1,t,19,3,7,GL,{st:'arch',wall:BR.wl,sill:BR.sill,hood:BR.cs,lit:.7},3550,rnd(t*20));
          faceL(g,v1,u0,u0+.03,3,h,BR.q||'#e6dcc2');faceL(g,v1,u1-.03,u1,3,h,'#e6dcc2');faceR(g,u1,v1-.03,v1,3,h,'#b3a88f');});
        S.o(2.0,(g)=>{T.stairsV(g,.48,.88,1.08,1.26,3,3,['#e9e2d0','#b5aa92','#8f8672']);});
        // 玻璃連廊
        S.o(1.3,(g,n)=>{boxZ(g,1.24,.44,.14,.28,0,14,null,'#86abc3','#557a92');T.curtain(g,n,'L',.72,1.24,1.38,0,14,{pitch:4,fh:7,lit:.9,seed:3542});
          T.glassTop(g,1.24,.44,.14,.28,14,{st:.07});});
        // 新翼：古銅金屬＋玻璃帷幕＋綠屋頂
        S.o(1.4,(g,n)=>{const u0=1.38,u1=1.88,v0=.2,v1=1.24,h=20;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,BZ,BZD);
          T.curtain(g,n,'L',v1,u0+.03,u1-.03,0,h-3,{pitch:4,fh:6,mul:'#9a8574',lit:.85,seed:3546,inner:(F)=>{F(g,v1,1.58,1.72,0,8,'#2d3b46');if(n)F(n,v1,1.58,1.72,0,8,T.LIT);}});
          faceL(g,v1,u0,u1,h-3,h,BZ);faceL(g,v1,u0,u1,h-1,h,SH(BZ,24));
          // 東南長立面（退件重畫）：下半通長玻璃帶（豎框、橫框、反光格；夜間同 v1 透光）＋古銅窗間帶（上緣 1px 亮線）；
          //      上半古銅板＋豎向金屬鰭（每道 1px 迎光亮邊＋1px 落影），頂部 1px 亮壓頂
          faceR(g,u1,v0,v1,0,1,SH(BZD,-18));
          T.curtain(g,n,'R',u1,v0+.04,v1-.04,1,9,{pitch:4,fh:4,mul:'#8a7868',gl:'#58798f',lit:.85,seed:3551});
          faceR(g,u1,v0,v1,9,11,SH(BZD,8));faceR(g,u1,v0,v1,10,11,SH(BZD,34));
          for(let t=v0+.07;t<v1-.04;t+=.09){faceR(g,u1,t,t+1/32,11,h-1,'#a38b78');faceR(g,u1,t-1/32,t,11,h-1,'#2b241f');}
          faceR(g,u1,v0,v1,h-1,h,SH(BZD,30));
          // 綠屋頂（二次修）：古銅壓頂＋碎石維修走道底＋一條條沿 u 的景天植栽床（三種綠交替、每床前緣 1px 亮邊），不再用散點
          flat(g,u0,v0,u1-u0,v1-v0,'#9a8878',h);flat(g,u0+.04,v0+.04,u1-u0-.08,v1-v0-.08,'#b3a893',h);
          {const BT=['#7a9850','#88a75b','#6f8d49'];let i=0;for(let v=v0+.07;v<v1-.1;v+=.15,i++){const dv=Math.min(.11,v1-.06-v);
            flat(g,u0+.07,v,u1-u0-.14,dv,BT[i%3],h);lineU(g,v+dv,u0+.07,u1-.07,SH(BT[i%3],22),h);}}
          boxZ(g,u0+.14,v0+.3,.28,.12,h,2,null,'#9a8878','#6d6056');T.glassTop(g,u0+.14,v0+.3,.28,.12,h+2,{st:.07});
          T.bannerF(g,'L',v1+.004,u0+.16,4,19,4,'#d8742e','#f4efe2');T.bannerF(g,'L',v1+.004,u1-.12,4,19,4,'#2a55a0','#f4efe2');});
        // 花園、咖啡座、單車
        T.statue(S,.3,1.62,null,1.1);
        T.hedge(S,.48,1.32,.04,.6,null,3);T.hedge(S,.86,1.32,.04,.6,null,3);
        for(const[u,v,k,s]of[[.18,1.86,2,1],[1.06,1.86,0,1.05],[.06,.96,1,.9]])T.tree(S,u,v,s,k);T.bush(S,.14,1.38,3);T.bush(S,1.2,1.36,3);
        T.bench(S,.3,1.84,true);T.bench(S,.9,1.5,false);
        // 咖啡座退到廣場前緣、只留兩把傘，讓新翼玻璃帷幕與兩幅布幔露出來
        for(const[u,v,c]of[[1.52,1.84,'#2f6f5a'],[1.86,1.72,'#c8563f']])T.umbrella(S,u,v,c);
        T.bannerPole(S,.46,1.94,14,null,'#d8742e','#2a55a0','c');T.bannerPole(S,.84,1.94,14,null,'#2a55a0','#d8742e','c');
        T.lamp(S,1.3,1.3,13,null,'c');T.lamp(S,.08,1.3,13,null,'c');
        T.bikes(S,1.94,1.26,.3,false,3.4,3545);
        T.crowd(S,3.3,[[.6,1.2,'#c24a3a',{z:2}],[.7,1.22,'#2f5f96',{z:1}],[.62,1.52,'#e8c23a',{run:1}],[.66,1.8,'#f4f4ef'],[.42,1.6,'#3f7f4a',{bag:'#6b4a2a'}],[1.42,1.52,'#8a5bb0'],[1.7,1.4,'#d9d9d4'],
          [1.78,1.66,'#3a3f4d'],[1.94,1.78,'#c24a3a',{dress:1}],[1.44,1.82,'#2f5f96'],[1.6,1.9,'#e0a83a'],[1.66,1.3,'#f4f4ef'],[.3,1.2,'#8a2f2a'],[1.0,1.24,'#2f5f96']]);
        const tp=P(.68,1.08,45),fx=rnd(tp[0]),fy=rnd(tp[1]);
        S.t(1.12,(g)=>{RC(g,fx,fy-6,2,6,'#8a8a86');RC(g,fx,fy-6,1,6,'#a9a9a3');});
        return{flagAt:[fx+1,fy-6]};
      },
      ];
    });
  }catch(e){console.error('cul_a k35',e);errs.push('k35:'+(e&&e.stack||e));}

  // ================= k36 劇院（2×2）=================
  try{
    build(36,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD;
      const STN5=['#f1e8d2','#e3d7bd','#cdc1a4','#b0a386','#928669'],GOLD5=['#f6dc8a','#e6c566','#d0ac4c','#b08c34','#8a6c24'];
      return [
      // ---------- v0 巴洛克石造（歌劇院式）：後方石砌舞台塔（飛塔，淺浮雕橫縫、半圓扇形窗（深框＋三道放射豎框＋窗台）、銅綠山花頂＋簷角金色飛馬、
      //      右側卸貨捲門＋三層鐵製消防梯（平台板＋欄杆、2:1 斜扶手梯段、貼牆吊梯）＋佈景貨車），
      //      中段觀眾廳頂上低矮銅綠冠冕圓頂（鼓座壁柱＋金色採光亭）；正面前廳：五拱粗石基座層、雙柱夾拱窗的主層、金字楣帶、銅綠四坡頂與金色雕像群，
      //      左右端閣（圓窗、壁龕、小銅頂＋金像）；中央鑄鐵玻璃雨遮（字板、燈泡），寬台階鋪紅地毯直到人行道、紅絨繩欄柱；前庭圓形廣告柱、古典路燈、盛裝人潮、計程車 ----------
      (g,ng,S)=>{
        const ST='#e3d7bd',STD='#a79a7e',CR='#f4eddb',COPc=['#a3d3bf','#83bba5','#66a28c','#4f8874','#3b6b5b'],COPR='#6aa38c',COPRS='#4c8571',GOLD='#dcb54c',GOLDD='#a8842c';
        const C={wl:ST,wr:STD,bl:'#c7bca2',br:'#8b826e',cor:CR,cs:'#eee5cf',sill:'#f5efe0',sillR:'#bdb296',gl:GL,gd:GD};
        pave(g,'g',0,0,2,2,3601);
        pave(g,'st',.06,.06,1.9,1.66,3602);
        pave(g,'a',1.4,.06,.56,.86,3603);
        pave(g,'c',.06,1.72,1.9,.24,3604);lineU(g,1.72,.08,1.94,'#e9e5db');
        pave(g,'rd',.82,1.46,.16,.52,3605);
        shadow(g,[['b',.52,.06,.76,.4,44],['b',.38,.46,1.04,.54,36],['b',.24,.96,1.32,.38,40]]);
        // 舞台塔（二次退件：右面加寬到 13px 放得下 12px 平台；右面不畫石縫，消防梯後方是乾淨石面）
        S.o(1,(g,n)=>{const u0=.52,v0=.06,du=.76,dv=.4,h=58,u1=u0+du,v1=v0+dv,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,C,{});
          for(let z=5;z<h-3;z+=5)faceL(g,v1,u0,u1,z,z+1,SH(ST,-12));
          for(let z=5;z<28;z+=5)faceR(g,u1,v0,v1,z,z+1,SH(STD,-10));
          // 半圓扇形窗（二次退件重畫）：螢幕空間逐像素取樣——每個像素中心反算回牆面座標（xc 沿 u、zc＝xc/2−dy 向上，與牆面 2:1 同斜），
          //   依半徑分區：淺色石拱圈（拱心石最亮）＋完整 1px 深色半圓窗框（含底邊橫框）＋兩階玻璃＋三道放射豎框（45°／90°／135°）＋中心半圓轂＋淺色窗台與台下陰影
          {const R=7,bp=P(um,v1,45),bx=rnd(bp[0]),by=rnd(bp[1]),FR='#3b3431';
            const cls=(xc,zc)=>{const r=Math.hypot(xc,zc);
              if(zc<-2)return null;
              if(zc<-1)return Math.abs(xc)<=R+1.6?[SH(ST,-30)]:null;
              if(zc<0)return Math.abs(xc)<=R+1.6?['#fbf6ea']:null;
              if(zc<1&&r<=R+.6)return[FR];
              if(r<=R-.5){let m=r<=1.9;for(const a of[45,90,135]){const ra=a*Math.PI/180;if(Math.abs(xc*Math.sin(ra)-zc*Math.cos(ra))<.5&&xc*Math.cos(ra)+zc*Math.sin(ra)>0)m=true;}
                return m?['#f1e9d6']:[zc+xc*.3>R*.5?'#7197b3':GL,1];}
              if(r<=R+.6)return[FR];
              if(r<=R+1.8)return[Math.abs(xc)<.9?'#fffaf0':'#f4ecd8'];
              return null;};
            for(let y=by-R-6;y<=by+R+4;y++)for(let x=bx-R-3;x<=bx+R+3;x++){const xc=x-bx+.5,c=cls(xc,xc*.5-(y-by));
              if(c){RC(g,x,y,1,1,c[0]);if(n&&c[1])RC(n,x,y,1,1,T.LIT);}}}
          T.gableV(g,u0,v0,du,dv,h,7,{rf:COPR,rs:COPRS,wl:'#ddd1b5',ov:.03,verge:CR});
          const ap=P(um,v1+.03,h+7),q1=P(u0-.03,v1+.03,h-1.5),q2=P(u1+.03,v1+.03,h-1.5);BL(g,q1,ap,'#fffaf0');BL(g,ap,q2,'#fffaf0');
          for(const q of[q1,q2]){const x=rnd(q[0]),y=rnd(q[1]);RC(g,x-2,y-4,5,3,GOLD);RC(g,x+1,y-4,2,3,GOLDD);RC(g,x-3,y-6,3,2,'#f0d27a');RC(g,x+2,y-7,2,3,GOLD);RC(g,x-1,y-1,1,1,GOLDD);RC(g,x+2,y-1,1,1,GOLDD);}
          faceR(g,u1,v0+.08,v0+.28,0,13,'#9a9ea2');for(let z=1;z<13;z+=2)faceR(g,u1,v0+.08,v0+.28,z,z+1,'#7d8286');faceR(g,u1,v0+.07,v0+.29,13,14,SH(STD,-30));});
        // 鑄鐵消防梯：黑鐵平台（頂面淺一階）＋牆上板下陰影、欄杆三立柱、同色斜扶手與踏步線、各層出口門、貼牆吊梯
        T.fireEsc3(S,1.05,1.28,.08,[52,42,32],{slab:'#1f2225',slab2:'#596067',ud:'#857a62',rail:'#2b2f33',hand:'#555c62',door:'#3b3431',Lx:12,ladder:[4,11]});
        T.truck(S,1.36,.2,'#c8563f',1.06);
        // 觀眾廳＋冠冕圓頂
        S.o(1.1,(g,n)=>{const u0=.38,v0=.46,du=1.04,dv=.54,h=32;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:1,z0:14,fh:10,w:3,wh:9,pitch:8,st:'arch',seed:3607,noL:1,lit:.45});
          T.flatTop(g,u0,v0,du,dv,h,'#8d9196',{cap:CR});
          T.cyl(g,n,.9,.73,.3,h,4,STN5,{cap:CR,pil:14,pc:'#fbf6ea',pd:'#bfb296',win:{n:7,z0:1,z1:3,w:1,seed:3608,lit:.6}});
          T.dome(g,.9,.73,.31,h+4,10,COPc,{ribs:14});
          T.cyl(g,n,.9,.73,.06,h+13,3,STN5,{cap:CR,win:{n:2,z0:1,z1:2,w:1,seed:3609,lit:1}});
          T.dome(g,.9,.73,.065,h+16,3,GOLD5);const fn=P(.9,.73,h+19);RC(g,fn[0],fn[1]-2,1,2,GOLD);});
        // 端閣
        const pavT=(u0,seed)=>(g,n)=>{const du=.2,v0=.96,dv=.38,h=40,u1=u0+du,v1=v0+dv,um=u0+du/2,vm=v0+dv/2;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:2,z0:4,fh:14,w:2,wh:[8,9],pitch:6,st:'arch',seed,noL:1,lit:.5});
          for(let z=4;z<14;z+=3)faceL(g,v1,u0,u1,z,z+1,SH(ST,-16));faceL(g,v1,u0,u1,0,2,'#c7bca2');
          faceL(g,v1,u0,u1,14,16,CR);
          faceL(g,v1,um-.06,um+.06,4,13,'#d8ccb0');faceL(g,v1,um-.035,um+.035,5,12,'#8a7f6a');const sp=P(um,v1,5);RC(g,sp[0]-1,sp[1]-6,2,6,'#4d6a5e');RC(g,sp[0],sp[1]-6,1,6,'#35493f');RC(g,sp[0]-1,sp[1]-7,2,1,'#5c7d70');
          faceL(g,v1,um-.07,um+.07,17,31,'#fbf6ea');faceL(g,v1,um-.045,um+.045,18,30,GL);faceL(g,v1,um-.045,um-.02,29,30,'#fbf6ea');faceL(g,v1,um+.02,um+.045,29,30,'#fbf6ea');faceL(g,v1,um-.003,um+.003,18,29,'#fbf6ea');
          if(n)faceL(n,v1,um-.045,um+.045,18,29,T.LIT);
          faceL(g,v1,u0,u1,31,33,CR);faceL(g,v1,u0,u1,33,38,'#d6caae');const oc=P(um,v1,35.5);RC(g,oc[0]-1,oc[1]-1,3,3,'#f2ead6');RC(g,oc[0],oc[1],1,1,'#3f5d77');
          faceL(g,v1,u0,u1,38,40,CR);
          T.flatTop(g,u0,v0,du,dv,h,'#8d9196',{cap:CR});
          T.cyl(g,n,um,vm,.075,h,3,STN5,{cap:CR});T.dome(g,um,vm,.085,h+3,8,COPc,{ribs:6});
          const ap=P(um,vm,h+11);RC(g,ap[0]-1,ap[1]-5,3,5,GOLD);RC(g,ap[0]+1,ap[1]-5,1,5,GOLDD);RC(g,ap[0],ap[1]-7,1,2,'#f0d27a');};
        S.o(1.15,pavT(.24,3611));
        // 前廳正立面
        S.o(1.2,(g,n)=>{const u0=.44,v0=1.0,du=.92,dv=.3,h=37,u1=u0+du,v1=v0+dv,nb=5;
          boxZ(g,u0,v0,du,dv,0,h,null,ST,STD);
          for(let z=4;z<14;z+=3)faceL(g,v1,u0,u1,z,z+1,SH(ST,-16));faceL(g,v1,u0,u1,0,2,'#c7bca2');
          for(let i=0;i<nb;i++){const t=u0+du*(i+.5)/nb;faceL(g,v1,t-.05,t+.05,4,13,'#3d2f28');faceL(g,v1,t-.05,t-.02,12,13,ST);faceL(g,v1,t+.02,t+.05,12,13,ST);faceL(g,v1,t-.06,t+.06,13,14,CR);
            if(n)faceL(n,v1,t-.05,t+.05,4,12,'rgba(255,212,140,.85)');}
          faceL(g,v1,u0,u1,14,16,CR);faceL(g,v1,u0,u1,15,16,SH(CR,-26));
          for(let i=0;i<nb;i++){const t=u0+du*(i+.5)/nb;T.win1(g,n,'L',v1,t,18,2,9,GL,{st:'arch',wall:ST,lit:.85},3610,i);}
          for(let i=0;i<=nb;i++){const t=u0+du*i/nb;faceL(g,v1,t-1.5/32,t-.5/32,16,29,'#fbf6ea');faceL(g,v1,t-.5/32,t+.5/32,16,29,SH(ST,-30));faceL(g,v1,t+.5/32,t+1.5/32,16,29,'#f1e8d2');}
          faceL(g,v1,u0,u1,29,30,CR);faceL(g,v1,u0,u1,30,36,'#d6caae');{const um=u0+du/2;let t=um-9.5/32;for(const ch of'OPERA'){T.glyph(g,'L',v1,t,31,ch,GOLD);t+=4/32;}}
          faceL(g,v1,u0,u1,36,37,CR);
          T.hipU(g,u0,v0,du,dv,h,6,{rf:COPR,rs:COPRS,ov:.02});
          for(const t of[u0+.16,u1-.16]){const p=P(t,v1,h),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-2,y-6,4,6,GOLD);RC(g,x+1,y-6,1,6,GOLDD);RC(g,x-1,y-8,2,2,'#f0d27a');RC(g,x-3,y-2,6,2,GOLDD);}});
        S.o(1.25,pavT(1.36,3616));
        // 鑄鐵玻璃雨遮＋字板
        S.o(2.2,(g,n)=>{T.marqueeL(g,n,1.3,.62,1.18,14,.16,6,{glass:1,body:'#2a2d31',seed:3612});});
        // 寬台階＋紅地毯
        S.o(2.4,(g)=>{T.stairsV(g,.44,1.36,1.3,1.46,4,4,['#efe8d6','#b3a88f','#958b76'],[.82,.98,'#a8313a','#7e2229']);});
        // 前庭與人行道
        T.ropes(S,3.0,[[[.8,1.5],[.8,1.62],[.8,1.74]],[[1.0,1.5],[1.0,1.62],[1.0,1.74]]]);
        T.litfass(S,.3,1.56);
        T.lamp(S,.56,1.64,14,null,'c');T.lamp(S,1.24,1.64,14,null,'c');T.lamp(S,1.74,1.02,14,null,'c');
        for(const[u,v,k,s]of[[.14,1.5,0,1],[1.9,1.1,2,1.0],[1.88,1.66,0,.9]])T.tree(S,u,v,s,k);T.boxOffice(S,1.46,1.44,{dome:COPc,band:'#8a2f2a',base:'#c7bca2'});
        T.bench(S,1.7,1.4,true);
        T.car(S,1.26,1.84,true,'#e8c23a',null,true);T.car(S,.4,1.84,true,'#2a2d31');
        T.crowd(S,3.2,[[.7,1.36,'#2a2d31',{z:3}],[.74,1.44,'#8a2f2a',{dress:1,z:1}],[1.1,1.4,'#2a2d31',{z:2}],[1.16,1.36,'#6a3d7a',{dress:1,z:3}],[.9,1.66,'#2a2d31'],[.94,1.58,'#c24a3a',{dress:1}],
          [.62,1.56,'#2f5f96'],[.5,1.5,'#2a2d31'],[1.3,1.56,'#f4f4ef',{dress:1}],[1.4,1.64,'#2a2d31'],[.2,1.66,'#3f7f4a'],[1.52,1.7,'#8a2f2a'],[1.1,1.76,'#2a2d31'],[.66,1.78,'#e8c23a']]);
        return{};
      },
      // ---------- v1 裝飾藝術式（Art Deco 電影宮殿）：後方紅磚舞台塔（磚縫、手繪褪色老牆招 SHOWS），中段紅磚觀眾廳（右側壁柱、屋頂空調箱、兩層鐵製之字消防梯與出口門、後台門燈），
      //      正面米白陶磚高立面：九道凹凸豎向壁柱夾金色窗間板玻璃條、青綠金色鋸齒飾帶、三級階梯式山頭；正中巨型直立招牌（紅底金邊燈泡、GLIMMER 直排字、頂飾）立在大跑馬燈雨遮上，
      //      雨遮下售票亭與金框玻璃門、兩側海報燈箱；人行道紅地毯與紅絨繩、排隊人潮、路樹、黃色計程車；右側後巷垃圾箱與停車 ----------
      (g,ng,S)=>{
        const BRK='#a0583f',BRKD='#6f3b2b',BRKT='#7d4636',TC='#ede1c4',TCD='#b3a384',TCT='#f7efdc',GOLD='#d9b24a',TEAL='#2f7f7a';
        pave(g,'g',0,0,2,2,3621);
        pave(g,'c',.04,.04,1.92,1.92,3622);
        pave(g,'a',1.54,.04,.42,1.1,3623);
        pave(g,'a',.04,1.82,1.92,.14,3624);lineU(g,1.82,.06,1.94,'#e9e5db');
        pave(g,'rd',.82,1.44,.16,.38,3625);
        shadow(g,[['b',.42,.1,.76,.34,44],['b',.3,.44,1.2,.66,34],['b',.3,1.1,1.2,.2,40]]);
        // 磚造舞台塔＋老牆招
        S.o(1,(g,n)=>{const u0=.42,v0=.1,du=.76,dv=.34,h=60,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,BRKT,BRK,BRKD);
          for(let z=4;z<h-2;z+=4){faceL(g,v1,u0,u1,z,z+1,SH(BRK,-10));faceR(g,u1,v0,v1,z,z+1,SH(BRKD,-8));}
          faceL(g,v1,u0,u1,h-2,h,'#c9b89a');faceR(g,u1,v0,v1,h-2,h,'#8f806a');
          const a=u0+.1,b=u1-.1;faceL(g,v1,a,b,41,54,'#b0674e');faceL(g,v1,a,b,53,54,'#d4bf9c');faceL(g,v1,a,b,41,42,'#d4bf9c');
          let t=a+.06;for(const ch of'SHOWS'){T.glyph(g,'L',v1,t,45,ch,'#e0cca8');t+=4/32;}
          for(const z of[48,30])faceR(g,u1,v0+.1,v0+.16,z,z+4,'#3a3230');});
        // 磚造觀眾廳
        S.o(1.1,(g,n)=>{const u0=.3,v0=.44,du=1.2,dv=.66,h=34,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,BRKT,BRK,BRKD);
          for(let z=4;z<h;z+=4)faceR(g,u1,v0,v1,z,z+1,SH(BRKD,-8));
          for(let s=v0+.04;s<v1-.04;s+=.16)faceR(g,u1,s,s+2/32,0,h,SH(BRKD,14));
          faceR(g,u1,v0,v1,h-2,h,'#8f806a');
          T.flatTop(g,u0,v0,du,dv,h,'#7b7f83',{cap:'#b9ab8f'});
          boxZ(g,.5,.6,.16,.12,h,5,'#b9bdbf','#cfd2d4','#9a9ea1');boxZ(g,1.1,.7,.12,.1,h,4,'#b9bdbf','#cfd2d4','#9a9ea1');
          for(const z of[16,26])faceR(g,u1,.6,.68,z,z+7,'#3b3431');
          faceR(g,u1,.88,.98,0,9,'#4a3f3a');const lp=P(u1,.93,10);RC(g,lp[0]-1,lp[1]-1,2,1,'#f3e2a8');if(n)RC(n,lp[0]-1,lp[1]-1,2,1,'#ffe6a0');});
        T.fireEscR(S,1.12,1.5,.52,.9,[26,16],{col:'#3d4348',rail:'#6b737a'});   // 審核建議：鐵梯在深色磚牆上提亮一階
        // Art Deco 正立面
        S.o(1.2,(g,n)=>{const u0=.3,v0=1.1,du=1.2,dv=.2,h=40,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,TCT,TC,TCD);
          boxZ(g,.56,v0,.68,dv,h,5,TCT,TC,TCD);boxZ(g,.68,v0,.44,dv,h+5,5,TCT,TC,TCD);boxZ(g,.8,v0,.2,dv,h+10,5,TCT,TC,TCD);
          for(const[a,b,z]of[[u0,u1,h],[.56,1.24,h+5],[.68,1.12,h+10],[.8,1.0,h+15]])faceL(g,v1,a,b,z-1,z,GOLD);
          const np=9;for(let i=0;i<np;i++){const a=u0+.05+(du-.1)*i/np+2/32,b=u0+.05+(du-.1)*(i+1)/np;faceL(g,v1,a,b,24,37,'#34505f');faceL(g,v1,a,b,30,31,GOLD);
            if(n&&hsh(3626,i,1)<.75){faceL(n,v1,a,b,24,30,T.LIT);faceL(n,v1,a,b,31,37,T.LIT);}}
          for(let i=0;i<=np;i++){const t=u0+.05+(du-.1)*i/np;faceL(g,v1,t,t+1/32,22,h-1,'#fdf8ec');faceL(g,v1,t+1/32,t+2/32,22,h-1,SH(TC,-22));}
          faceL(g,v1,u0,u1,19,22,TEAL);for(let k=0;k*2<du*32;k++){const t=u0+k*2/32;faceL(g,v1,t,t+1/32,k%2?20:21,k%2?21:22,GOLD);faceL(g,v1,t+1/32,t+2/32,k%2?21:20,k%2?22:21,GOLD);}
          faceL(g,v1,u0,u1,0,2,'#8c7f64');
          for(const[a,b]of[[.5,.8],[1.0,1.3]]){faceL(g,v1,a,b,2,12,'#c9a23e');faceL(g,v1,a+.02,b-.02,2,11,'#2d3b46');for(let t=a+.07;t<b-.03;t+=.07)faceL(g,v1,t,t+1/32,2,11,'#c9a23e');if(n)faceL(n,v1,a+.02,b-.02,2,11,T.LIT);}
          for(const[t,c]of[[.38,'#d8574a'],[1.42,'#2f5f96']]){faceL(g,v1,t-.05,t+.05,3,14,'#c9a23e');faceL(g,v1,t-.035,t+.035,4,13,c);faceL(g,v1,t-.035,t+.035,9,10,'#f4efe2');faceL(g,v1,t-.02,t+.02,6,8,'#f2c230');if(n)faceL(n,v1,t-.035,t+.035,4,13,'rgba(255,240,200,.85)');}
          for(let s=v0+.04;s<v1;s+=.05)faceR(g,u1,s,s+1/32,2,h,SH(TCD,-12));});
        // 售票亭（雨遮下）
        S.o(2.1,(g,n)=>{boxZ(g,.84,1.34,.12,.1,0,2,'#c9a23e','#b08a30','#8a6c24');boxZ(g,.84,1.34,.12,.1,2,7,null,'#86abc3','#557a92');faceL(g,1.44,.899,.901,2,9,'#c9a23e');
          boxZ(g,.83,1.33,.14,.12,9,1.5,'#e6c566','#c9a23e','#8a6c24');if(n){faceL(n,1.44,.84,.96,3,9,T.LIT);faceR(n,.96,1.34,1.44,3,9,T.LIT2);}});
        // 跑馬燈雨遮
        S.o(2.2,(g,n)=>{T.marqueeL(g,n,1.3,.46,1.34,13,.24,8,{seed:3627,body:'#2a2d31',board:'#f6f0dc'});
          boxZ(g,.72,1.36,.36,.14,21,2,'#2a2d31','#d9b24a','#8a6c24');});
        // 直立招牌
        S.o(2.3,(g,n)=>{const c=.93,va=1.3,vb=1.48,z0=23,z1=66;
          boxZ(g,c-.05,va,.05,vb-va,z0,z1-z0,GOLD,'#e8c763','#b8282f');
          for(let z=z0+1;z<z1-.5;z+=2){for(const s of[va+.012,vb-.012]){const p=P(c,s,z);RC(g,p[0],p[1],1,1,((z|0)%4<2)?'#ffe07a':'#b88a2a');if(n)RC(n,p[0],p[1],1,1,'#fff4c0');}}
          let z=z1-7;for(const ch of'GLIMMER'){T.glyph(g,'R',c,(va+vb)/2-1.5/32,z,ch,'#fbf3dc');if(n)T.glyph(n,'R',c,(va+vb)/2-1.5/32,z,ch,'#fff8e0');z-=6;}
          boxZ(g,c-.04,va+.03,.03,vb-va-.06,z1,3,GOLD,'#e8c763','#b08a30');
          const tp=P(c-.025,(va+vb)/2,z1+3);RC(g,tp[0]-1,tp[1]-4,2,4,GOLD);RC(g,tp[0]-2,tp[1]-3,4,1,'#f0d27a');RC(g,tp[0],tp[1]-6,1,2,'#f0d27a');if(n)RC(n,tp[0]-1,tp[1]-4,2,1,'#fff4c0');});
        // 後巷
        T.dumpster(S,1.62,.46);T.dumpster(S,1.62,.28);
        T.car(S,1.72,.66,false,'#3f6f9e');
        // 人行道
        T.ropes(S,3.0,[[[.8,1.56],[.8,1.66],[.8,1.76]],[[1.0,1.56],[1.0,1.66],[1.0,1.76]]]);
        T.lamp(S,.34,1.72,14,null,'c');T.lamp(S,1.46,1.72,14,null,'c');
        for(const[u,v,k]of[[.16,1.64,0],[1.66,1.62,2]])T.tree(S,u,v,.95,k);
        T.car(S,1.1,1.86,true,'#e8c23a',null,true);T.car(S,.5,1.86,true,'#c24a3a');
        T.crowd(S,3.2,[[.52,1.42,'#2a2d31'],[.58,1.46,'#8a2f2a',{dress:1}],[.64,1.5,'#2f5f96'],[.7,1.54,'#e8c23a'],[.76,1.6,'#2a2d31'],[.9,1.5,'#c24a3a',{dress:1}],[.9,1.7,'#2a2d31'],
          [1.12,1.44,'#f4f4ef'],[1.2,1.5,'#3f7f4a'],[1.36,1.46,'#2a2d31'],[.28,1.5,'#8a5bb0'],[1.6,1.4,'#d9d9d4'],[1.3,1.72,'#2f5f96',{run:1}]]);
        return{};
      },
      // ---------- v2 現代玻璃：後方深色金屬百葉舞台塔（正面巨幅劇目海報、右側鍍鋅三層逃生梯（平台板＋欄杆、2:1 斜扶手梯段、貼牆吊梯）＋後台貨車），中段耐候鋼板觀眾廳（豎向板縫），
      //      正面通長玻璃前廳（夾層樓板、斜向大樓梯、人影，夜間整面透光）＋整片懸挑白色屋頂板（細柱、前緣 LED 跑馬字幕）；
      //      前方廣場（人、紅地毯、售票亭）＋南角前緣瀝青落客車道（路緣石、計程車與白車停在車道裡）、左前草坪上的直立 LED 看板與樹、長椅、單車架 ----------
      (g,ng,S)=>{
        const DK='#50565b',DKD='#383d41',DKT='#60676c',CT='#b0673f',CTD='#7a4329',CTT='#8e5535';
        pave(g,'g',0,0,2,2,3641);
        pave(g,'c',.06,.06,1.9,1.9,3642);
        pave(g,'g',.08,1.56,.5,.38,3643);
        // 落客車道（退件補畫）：南角沿前緣 7px 寬瀝青車道＋淺色路緣石線＋暗色排水溝線＋兩端斑馬斜紋；車停在車道裡，廣場只留人、紅地毯、售票亭
        pave(g,'a',.62,1.74,1.34,.22,3644);
        for(const u of[1.83,1.89])BL(g,P(u,1.78),P(u+.04,1.93),'#c9b25a');
        lineU(g,1.772,.64,1.96,'#56544f');lineU(g,1.74,.62,1.96,'#eeebe2');lineV(g,.62,1.74,1.96,'#eeebe2');
        pave(g,'rd',.92,1.36,.16,.38,3649);
        shadow(g,[['b',.6,.1,.74,.4,44],['b',.3,.5,1.34,.48,32],['b',.1,.98,1.76,.54,25]]);
        // 舞台塔：深色金屬百葉＋巨幅海報
        S.o(1,(g,n)=>{const u0=.6,v0=.1,du=.74,dv=.4,h=62,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,DKT,DK,DKD);
          // 正面金屬百葉照舊；右面（二次退件）不畫百葉，只留低處幾道，逃生梯後方是乾淨深色金屬板
          for(let z=3;z<h-1;z+=3)faceL(g,v1,u0,u1,z,z+1,SH(DK,-12));
          for(let z=15;z<27;z+=3)faceR(g,u1,v0,v1,z,z+1,SH(DKD,-8));
          faceL(g,v1,u0,u1,h-1,h,'#8a9095');faceR(g,u1,v0,v1,h-1,h,'#6a7075');
          const a=u0+.08,b=u1-.08,z0=35,z1=58,tc=(a+b)/2+.04;
          faceL(g,v1,a-1/32,b+1/32,z0-1,z1+1,'#1e2226');faceL(g,v1,a,b,z0,z1,'#5b2a6e');faceL(g,v1,a,b,z0,z0+7,'#472158');
          for(let dz=-5;dz<=5;dz++){const w=Math.round(Math.sqrt(Math.max(0,30-dz*dz)));if(w>0)faceL(g,v1,tc-w/32,tc+w/32,z0+14+dz,z0+15+dz,'#f2a03c');}
          const fx=(a+b)/2-.06;faceL(g,v1,fx,fx+2/32,z0+9,z0+17,'#f7f1e6');faceL(g,v1,fx-1/32,fx+3/32,z0+17,z0+19,'#f7f1e6');faceL(g,v1,fx+2/32,fx+6/32,z0+15,z0+16,'#f7f1e6');faceL(g,v1,fx-4/32,fx,z0+18,z0+19,'#f7f1e6');
          faceL(g,v1,fx+2/32,fx+5/32,z0+8,z0+9,'#f7f1e6');faceL(g,v1,fx+.5/32,fx+1.5/32,z0+19,z0+21,'#f7f1e6');
          faceL(g,v1,a+.04,b-.04,z0+2,z0+3,'#f4efe2');faceL(g,v1,a+.04,a+.28,z0+4,z0+5,'#f4efe2');
          if(n){faceL(n,v1,a,b,z0,z1,'rgba(255,236,210,.35)');faceL(n,v1,a+.04,b-.04,z0+2,z0+3,'#fff2d8');}
          faceR(g,u1,v0+.05,v0+.25,0,13,'#8d9296');for(let z=1;z<13;z+=2)faceR(g,u1,v0+.05,v0+.25,z,z+1,'#6f7478');});
        // 鍍鋅逃生梯：亮灰平台（頂面暗一階）＋板下陰影、欄杆三立柱、同色斜扶手與連續踏步線、各層出口門、貼牆吊梯
        T.fireEsc3(S,1.03,1.34,.12,[55,45,35],{slab:'#eef2f3',slab2:'#c3cacd',ud:'#24282b',rail:'#b4bcc0',hand:'#b4bcc0',door:'#1b1e21',Lx:12,ladder:[4,11]});
        T.truck(S,1.42,.2,'#2a55a0',1.05);
        // 耐候鋼觀眾廳
        S.o(1.1,(g,n)=>{const u0=.3,v0=.5,du=1.34,dv=.48,h=32,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,CTT,CT,CTD);
          for(let t=u0+.06;t<u1;t+=.06)faceL(g,v1,t,t+1/32,0,h,SH(CT,-14));
          for(let s=v0+.06;s<v1;s+=.06)faceR(g,u1,s,s+1/32,0,h,SH(CTD,-10));
          T.flatTop(g,u0,v0,du,dv,h,'#6d7074',{cap:'#9a5a38'});
          faceR(g,u1,.62,.72,0,10,'#2c2522');});
        // 玻璃前廳
        S.o(1.2,(g,n)=>{const u0=.16,v0=.98,du=1.64,dv=.38,h=22,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,'#d8dadb','#86abc3','#557a92');
          T.curtain(g,n,'L',v1,u0,u1,0,h,{pitch:5,fh:11,lit:.95,seed:3645,inner:(F)=>{
            F(g,v1,u0+.34,u1-.08,10,11,'#e9eef1');
            for(let i=0;i<9;i++)F(g,v1,.46+i*.035,.46+i*.035+1.2/32,10-i*1.15,11-i*1.15,'#f4f4f0');
            for(const[t,z]of[[.28,1],[1.02,1],[1.34,1],[1.2,12],[1.46,12],[1.62,1]]){F(g,v1,t,t+2/32,z,z+4,'#2e3a44');F(g,v1,t,t+2/32,z+4,z+5,'#caa27a');}},
            innerN:(F,n)=>{F(n,v1,u0+.34,u1-.08,10,11,'#6b5a48');for(let i=0;i<9;i++)F(n,v1,.46+i*.035,.46+i*.035+1.2/32,10-i*1.15,11-i*1.15,'#7a6650');
              for(const[t,z]of[[.28,1],[1.02,1],[1.34,1],[1.2,12],[1.46,12],[1.62,1]])F(n,v1,t,t+2/32,z,z+5,'#3a3028');}});
          T.curtain(g,n,'R',u1,v0,v1,0,h,{pitch:5,fh:11,lit:.9,seed:3646});
          faceL(g,v1,.86,1.14,0,8,'#26343e');faceL(g,v1,.998,1.002,0,8,'#9aa7ae');if(n)faceL(n,v1,.86,1.14,0,8,T.LIT);});
        // 懸挑屋頂板＋LED 字幕
        S.o(2.3,(g,n)=>{for(const u of[.36,.98,1.6])boxZ(g,u-.02,1.46,.03,.03,0,22,null,'#f2f2ee','#b0b3b5');
          boxZ(g,.1,.98,1.76,.56,22,3,'#f0f0ec','#e6e6e2','#a9acae');
          faceL(g,1.54,.3,1.7,22.5,24.5,'#1b2833');
          for(let t=.33,k=0;t<1.66;t+=2/32,k++){const on=hsh(3647,k,1);if(on<.55)faceL(g,1.54,t,t+1/32,23,24,on<.2?'#7fe0ff':'#e8f6ff');if(n&&on<.55)faceL(n,1.54,t,t+1/32,23,24,on<.2?'#9ff0ff':'#ffffff');}
          if(n){for(let t=.2;t<1.8;t+=.14){const p=P(t,1.5,21);RC(n,p[0],p[1],2,1,'rgba(255,236,200,.6)');}}});
        // 直立 LED 看板（草坪前角）
        S.o(3.4,(g,n)=>{const u=.22,v=1.7,zt=21;boxZ(g,u,v,.22,.05,0,2,'#b9bdbf','#a9aeb1','#7e8387');boxZ(g,u+.01,v,.2,.04,2,zt-2,'#8a9094','#6a7075','#4a4f53');
          faceL(g,v+.04,u+.03,u+.19,4,zt-1,'#2d1f4a');faceL(g,v+.04,u+.03,u+.19,12,18,'#d2407a');faceL(g,v+.04,u+.06,u+.12,13,17,'#f2a03c');faceL(g,v+.04,u+.03,u+.19,5,6,'#7fe0ff');faceL(g,v+.04,u+.03,u+.14,7.5,8.5,'#e8f6ff');faceL(g,v+.04,u+.03,u+.16,9.5,10.5,'#e8f6ff');
          if(n){faceL(n,v+.04,u+.03,u+.19,4,zt-1,'rgba(210,90,160,.5)');faceL(n,v+.04,u+.03,u+.19,5,6,'#9ff0ff');faceL(n,v+.04,u+.03,u+.14,7.5,8.5,'#ffffff');faceL(n,v+.04,u+.03,u+.16,9.5,10.5,'#ffffff');faceL(n,v+.04,u+.06,u+.12,13,17,'#ffc070');}});
        for(const[u,v,k]of[[.14,1.62,0],[.5,1.9,2]])T.tree(S,u,v,1,k);
        T.bench(S,.62,1.6,true);T.bench(S,1.3,1.6,true);T.boxOffice(S,1.6,1.54,{band:'#1b2833',ink:'#7fe0ff',base:'#9aa0a4',fr:'#dfe6ea',roof:'#f2f2ee',cap:'#d8dadb'});T.ropes(S,3.0,[[[.9,1.46],[.9,1.58],[.9,1.7]],[[1.1,1.46],[1.1,1.58],[1.1,1.7]]]);
        T.bikes(S,1.92,1.0,.5,false,3.0,3648);
        T.lamp(S,1.9,1.62,14,null,'m');T.lamp(S,.64,1.7,14,null,'m');
        T.car(S,.68,1.79,true,'#e8c23a',null,true);T.car(S,1.34,1.79,true,'#d9d9d4');
        T.crowd(S,3.3,[[.86,1.56,'#2a2d31'],[.98,1.5,'#c24a3a',{dress:1}],[1.04,1.58,'#2f5f96'],[.8,1.62,'#f4f4ef'],[1.2,1.5,'#8a5bb0'],[1.46,1.54,'#e8c23a'],[1.8,1.62,'#3f7f4a'],
          [.72,1.46,'#2a2d31'],[.5,1.52,'#d9d9d4'],[1.76,1.48,'#c24a3a'],[.36,1.52,'#2f5f96',{run:1}],[1.16,1.62,'#2a2d31',{bag:'#8a5bb0'}],[1.3,1.66,'#e8c23a',{bag:'#3a3f4d'}]]);
        return{};
      },
      ];
    });
  }catch(e){console.error('cul_a k36',e);errs.push('k36:'+(e&&e.stack||e));}

  window.__cul_a_chk=chk;
  if(errs.length)window.__cul_a_errs=errs;
});
