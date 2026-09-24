// T613 civ_e：k14 圖書館（1×1，72×112，錨 36,110）＋ k41 圖書總館（2×2，136×150，錨 68,148）實驗線重畫。
// 分層合成（沿用 civ_c／civ_d）：立體主體各自一層（二值化＋深色外框）；燈桿、腳踏車、人、噴泉水柱走不描邊細線層；
// 地面（草坪、石板、磚鋪、水池底）直接畫在地面層，逐像素取樣不越出佔地菱形。夜光按層遮擋，只亮窗、門楣氣窗、門燈、路燈、招牌。
// 零亂數：只用 K.hsh。光從左：+v 面亮、+u 面暗；落影向右。
// 圓頂／鼓座用取樣曲面（只畫朝鏡頭的半面、按法線對光源挑色階），不是貼一張圓。
// 收尾自檢：南兩斜邊以外、y<2 的像素一律清掉並記數（window.__civ_e_chk），flagAt 上方 3px 必須透明。
(window.__variants574=window.__variants574||[]).push(function civ_e(A){
  // 注入測試時本批次排在內嵌 b01…之前（b04 會蓋掉 41_1_1/2）⇒ 不是最後一棒就把本體排到隊尾再跑（同 civ_c／civ_d）
  const QL=window.__variants574||[];
  if(!civ_e.__late&&QL.indexOf(civ_e)>=0&&QL.indexOf(civ_e)<QL.length-1){civ_e.__late=1;QL.push(function civ_e_late(A2){civ_e(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{14:[1,2,0]}；定稿必須是 {}
  const errs=[],chk=[];

  // ================= 共用工具（沿用 civ_c 的像素精準圖元）=================
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
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
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
      gd:{t:['#6d9a4e','#69954b','#72a053'],s:.125,p:.75},                     // 深一階草（花圃）
      c:{t:['#cdc9be','#c8c4b9','#d2cec3'],j:'#bbb7ac',js:.25,s:.125,p:.65},   // 混凝土
      st:{t:['#d2cab6','#cbc3af','#d8d0bd'],j:'#b9b19c',js:.125,s:.125,p:.6},  // 石板
      bp:{t:['#bf8a6f','#b9846a','#c49075'],j:'#a4735c',js:.0625,s:.125,p:.6}, // 紅磚鋪面
      gv:{t:['#d9cfae','#d3c9a7','#ddd4b5'],s:.0625,p:.65},                    // 碎石步道
      a:{t:['#6f6d69','#6c6a66','#72706b'],s:.125,p:.75},                      // 瀝青
    };
    const pave=(g,m,u0,v0,du,dv,seed,js)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      const J=js||M.js;if(M.j&&J){for(let a=u0+J;a<u0+du-1e-6;a+=J)BL(g,P(a,v0+.01),P(a,v0+dv-.01),M.j);for(let b=v0+J;b<v0+dv-1e-6;b+=J)BL(g,P(u0+.01,b),P(u0+du-.01,b),M.j);}};
    // 夜光只落在白天畫出的玻璃像素上：draw(tx) 在暫存畫布畫出玻璃形狀，keep(x,y) 決定哪些像素亮
    const litMask=(n,draw,keep,col)=>{const[tc,tx]=A.cv(W,H);draw(tx);const d=tx.getImageData(0,0,W,H).data;n.fillStyle=col;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[((y*W+x)<<2)+3]>0&&keep(x,y))n.fillRect(x,y,1,1);};
    return Object.assign({},K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,lineU,lineV,ell,scene,shadow,paint,pave,litMask});
  };

  // ================= 圖書館元件 =================
  const KIT=(L)=>{
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ell,SZ}=L;
    const LIT='#ffe3a0';
    // 窗列：+v 面（亮）／+u 面（暗）。cnt 扇、寬 w 像素、高 h；o.frame 窗框、o.hi 頂列反光、o.arch 圓拱角、o.mul 中梃、o.tr 橫楣
    const winL=(g,n,v,ua,ub,cnt,z,w,h,glass,o={})=>{for(let i=0;i<cnt;i++){const t=ua+(ub-ua)*(i+.5)/cnt,a=t-w/64,b=t+w/64;
      if(o.frame)faceL(g,v,a-1/32,b+1/32,z-1,z+h+(o.lintel?1:0),o.frame);else if(o.sill)faceL(g,v,a-1/32,b+1/32,z-1,z,o.sill);
      faceL(g,v,a,b,z,z+h,glass);if(o.hi)faceL(g,v,a,b,z+h-1,z+h,o.hi);
      if(o.tr!=null)faceL(g,v,a,b,z+o.tr,z+o.tr+1,o.trc||o.frame);
      if(o.mul)faceL(g,v,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.arch){faceL(g,v,a,a+1/32,z+h-1,z+h,o.arch);faceL(g,v,b-1/32,b,z+h-1,z+h,o.arch);}
      if(n&&hsh(o.seed||7,i,rnd(z*3+v*50))<(o.lit!=null?o.lit:.7))faceL(n,v,a,b-(o.ni?1/32:0),z,z+h-(o.arch?1:0),o.lc||LIT);}};
    const winR=(g,n,u,va,vb,cnt,z,w,h,glass,o={})=>{for(let i=0;i<cnt;i++){const t=va+(vb-va)*(i+.5)/cnt,a=t-w/64,b=t+w/64;
      if(o.frame)faceR(g,u,a-1/32,b+1/32,z-1,z+h+(o.lintel?1:0),o.frame);else if(o.sill)faceR(g,u,a-1/32,b+1/32,z-1,z,o.sill);
      faceR(g,u,a,b,z,z+h,glass);if(o.hi)faceR(g,u,a,b,z+h-1,z+h,o.hi);
      if(o.tr!=null)faceR(g,u,a,b,z+o.tr,z+o.tr+1,o.trc||o.frame);
      if(o.mul)faceR(g,u,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.arch){faceR(g,u,a,a+1/32,z+h-1,z+h,o.arch);faceR(g,u,b-1/32,b,z+h-1,z+h,o.arch);}
      if(n&&hsh(o.seed||9,i,rnd(z*3+u*50))<(o.lit!=null?o.lit:.62))faceR(n,u,a+(o.ni?1/32:0),b,z,z+h-(o.arch?1:0),o.lc||'#f3d68e');}};
    // 圓拱（面內）：中心 t、半寬 hw（格）、z0 窗台、z1 起拱線、rise 拱高；[ca,cb] 只畫這段（中梃兩側分開點亮用）
    const archF=(face,g,s,t,hw,z0,z1,rise,col,ca=-1e9,cb=1e9)=>{const F=face==='L'?faceL:faceR,cl=(a,b)=>[Math.max(a,ca),Math.min(b,cb)];
      {const[a,b]=cl(t-hw,t+hw);if(b>a)F(g,s,a,b,z0,z1,col);}
      for(let z=z1;z<z1+rise-.01;z+=1){const f=(z+.5-z1)/rise,w=hw*Math.sqrt(Math.max(0,1-f*f));if(w<.3/32)continue;const[a,b]=cl(t-w,t+w);if(b>a)F(g,s,a,b,z,Math.min(z+1,z1+rise),col);}};
    // 大拱窗：石框＋玻璃＋中梃（＋橫楣）＋夜光（中梃不亮）
    const bigArch=(face,g,n,s,t,hw,z0,z1,rise,o)=>{const F=face==='L'?faceL:faceR;
      if(o.frame)archF(face,g,s,t,hw+1/32,z0-1,z1,rise+1,o.frame);
      archF(face,g,s,t,hw,z0,z1,rise,o.glass);
      if(o.hi)F(g,s,face==='L'?t-hw:t+hw-1/32,face==='L'?t-hw+1/32:t+hw,z0+1,z1,o.hi);
      if(o.mul){F(g,s,t-.5/32,t+.5/32,z0,z1+rise-.6,o.mul);if(o.tr!=null)F(g,s,t-hw,t+hw,o.tr,o.tr+1,o.mul);}
      if(n&&(o.lit==null||o.lit)){const lc=o.lc||(face==='L'?LIT:'#f3d68e');
        if(o.mul){archF(face,n,s,t,hw,z0,z1,rise,lc,-1e9,t-.5/32);archF(face,n,s,t,hw,z0,z1,rise,lc,t+.5/32,1e9);}
        else archF(face,n,s,t,hw,z0,z1,rise,lc);
        if(o.mul&&o.tr!=null){n.save();n.globalCompositeOperation='destination-out';F(n,s,t-hw,t+hw,o.tr,o.tr+1,'#000');n.restore();}}};
    // 四坡屋頂（屋脊沿 u）
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
      return{vm,zt,r0,r1,b1,ze,hr};};
    // 雙坡屋頂（屋脊沿 u）：前坡朝 +v 受光；+u 端山牆三角
    const gableU=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,vm=(v0+v1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf;
      if(zt-ze<32*(vm-v0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt),P(u0-ov,vm,zt)],o.rb||SH(rf,-24));
      if(o.wr)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zt)],o.wr);
      fp(g,[P(u1-.005,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt+.6),P(u1-.005,vm,zt+.6)],o.vb||SH(rf,-38));
      fp(g,[P(u0-ov,vm,zt),P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),P(u0-ov,v1+ov,ze)],rf);
      const nl=Math.max(2,Math.floor(((v1+ov-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(v1+ov-vm)*f,z=zt-(zt-ze)*f;BL(g,P(u0-ov+.01,v,z),P(u1+ov-.01,v,z),o.rl||SH(rf,-13));}
      BL(g,P(u0-ov,vm,zt),P(u1+ov,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(u0-ov,v1+ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rf,-32));
      BL(g,P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),o.verge||SH(rf,14));
      return{vm,zt,ze};};
    // 雙坡屋頂（屋脊沿 v）：+v 端山牆三角受光；+u 坡暗
    const gableV=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,um=(u0+u1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      if(zt-ze<32*(um-u0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(um,v0-ov,zt),P(um,v1+ov,zt),P(u0-ov,v1+ov,ze)],rf);
      if(o.wl)fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zt)],o.wl);
      fp(g,[P(um,v0-ov,zt),P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),P(um,v1+ov,zt)],rs);
      const nl=Math.max(2,Math.floor(((u1+ov-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(u1+ov-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,v0-ov+.01,z),P(u,v1+ov-.01,z),o.rl||SH(rs,-10));}
      BL(g,P(um,v0-ov,zt),P(um,v1+ov,zt),o.ridge||SH(rf,22));
      BL(g,P(u0-ov,v1+ov,ze),P(um,v1+ov,zt),o.verge||SH(rf,12));BL(g,P(um,v1+ov,zt),P(u1+ov,v1+ov,ze),SH(rs,-16));
      BL(g,P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rs,-24));
      return{um,zt,ze};};
    // 攢尖（方錐）
    const pyramid=(g,uc,vc,s,z,rh,rf,rs)=>{const a0=uc-s/2,a1=uc+s/2,b0=vc-s/2,b1=vc+s/2,ap=P(uc,vc,z+rh);
      if(rh<32*s/2){fp(g,[P(a0,b0,z),P(a1,b0,z),ap],SH(rf,-18));fp(g,[P(a0,b0,z),P(a0,b1,z),ap],SH(rf,-8));}
      fp(g,[P(a1,b0,z),P(a1,b1,z),ap],rs);fp(g,[P(a0,b1,z),P(a1,b1,z),ap],rf);BL(g,ap,P(a1,b1,z),SH(rf,22));return ap;};
    // 平頂＋女兒牆（壓頂亮邊、內側陰影線）
    const flatTop=(g,u0,v0,du,dv,h,roof,o={})=>{const e=o.e||.03;flat(g,u0,v0,du,dv,o.cap||SH(roof,40),h);flat(g,u0+e,v0+e,du-2*e,dv-2*e,roof,h);
      BL(g,P(u0+e,v0+e,h),P(u0+du-e,v0+e,h),SH(roof,-24));BL(g,P(u0+e,v0+e,h),P(u0+e,v0+dv-e,h),SH(roof,-16));};
    // 旗桿下段（8–12px）；回傳 flagAt＝本段桿頂
    const flag=(S,u,v,hp,d)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      if(hp<8||hp>12)throw new Error('旗桿下段須 8–12px');
      S.o(d-.0005,(g)=>{boxZ(g,u-.035,v-.035,.07,.07,0,2,'#dcd8cd','#cbc6ba','#a8a397');});
      S.t(d,(g)=>{RC(g,x-1,y-hp,2,hp-1,'#8a8a86');});
      return[x,y-hp];};
    // 人：p＝腳底畫面座標
    const man=(g,p,shirt,o={})=>{const x=rnd(p[0]),y=rnd(p[1]),lg=o.leg||'#3a3f4d',sk=o.skin||'#e8bf97',hr=o.hair||'#3a2c24';
      if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-2,1,1,lg);RC(g,x,y-2,1,1,lg);}else{RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SH(lg,-12));}
      RC(g,x,y-4,2,2,shirt);RC(g,x+1,y-4,1,2,SH(shirt,-26));RC(g,x,y-5,2,1,sk);RC(g,x,y-6,2,1,hr);
      if(o.book)RC(g,x-1,y-4,1,2,o.book);};
    const bench=(S,u,v,alongU,d)=>S.o(d,(g)=>{if(alongU)boxZ(g,u,v,.12,.035,1,1,'#b0845a','#9a6f48','#7a5638');else boxZ(g,u,v,.035,.12,1,1,'#b0845a','#9a6f48','#7a5638');});
    const lamp=(S,u,v,h,d)=>S.t(d,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,3,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    // 古典燈柱：黑鐵柱＋乳白燈球
    const globe=(S,u,v,z,h,d)=>S.t(d,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#2f3438');RC(g,x,y-h,1,h,'#3c4247');RC(g,x-1,y-h-2,2,2,'#f3ecd6');RC(g,x-1,y-h-2,1,1,'#fffaf0');RC(g,x,y-h-1,1,1,'#d9ceb0');
      if(n){RC(n,x-1,y-h-2,2,2,'#fff2c0');RC(n,x-2,y-h-1,4,1,'rgba(255,226,160,.5)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#3d6b2b');ell(g,x-1,y-r+1,Math.max(1,r-1),Math.max(1,r-1),'#4f8a38');ell(g,x-1,y-r,Math.max(1,r-2),Math.max(1,r-2),'#6aa347');RC(g,x-2,y-r-1,2,1,'#9ccb6a');});
    // 修剪綠籬（立體方塊）
    const hedge=(S,u0,v0,du,dv,h,d)=>S.o(d,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#5f9a45','#4f8a38','#3d6b2b');});
    // 腳踏車（細線層）：沿 (du,dv) 排 n 台＋一條架管
    const bikes=(S,u0,v0,du,dv,n,d,seed=3)=>S.t(d,(g)=>{const COL=['#c24a3a','#2f5f96','#d9d9d4','#3f7f4a','#e0a83a'];
      BL(g,P(u0,v0,2),P(u0+du,v0+dv,2),'#9aa3a8');
      for(let i=0;i<n;i++){const f=n>1?i/(n-1):.5,p=P(u0+du*f,v0+dv*f),x=rnd(p[0]),y=rnd(p[1]),c=COL[hsh(seed,i,1)*5|0];
        RC(g,x-1,y-1,1,1,'#2a2d31');RC(g,x+1,y,1,1,'#2a2d31');RC(g,x-1,y-2,2,1,c);RC(g,x+1,y-1,1,1,c);RC(g,x,y-3,1,1,'#2a2d31');}});
    // 還書箱（藍色郵筒式）
    const dropBox=(S,u,v,d)=>S.o(d,(g)=>{boxZ(g,u,v,.04,.035,0,4,'#5b8ccc','#3f6fb0','#2b5288');const p=P(u+.02,v+.035,3);RC(g,p[0]-1,p[1],2,1,'#1c2f4a');});
    // 書本招牌（立牌）：石座＋深色牌面＋白色翻開書本；夜間書本圖示微亮
    const bookSign=(S,u,v,w,h,d,o={})=>S.o(d,(g,n)=>{const bc=o.bc||'#2c4a6b',dp=o.dp||.035;
      boxZ(g,u-.012,v-.006,w+.024,dp+.012,0,1.5,'#dcd5c4','#cbc3b0','#a19986');
      boxZ(g,u,v,w,dp,1.5,h,SH(bc,24),bc,SH(bc,-34));
      const t=u+w/2,vf=v+dp,zc=1.5+h/2,s=o.s||1;
      faceL(g,vf,t-(1+2*s)/64*2,t-.5/32,zc-s,zc+s,'#f6f3ea');faceL(g,vf,t+.5/32,t+(1+2*s)/64*2,zc-s,zc+s,'#e2ddcf');faceL(g,vf,t-.5/32,t+.5/32,zc-s-.5,zc+s-.5,'#b7ae98');
      if(o.band)faceL(g,vf,u+.01,u+w-.01,1.5+h-1.5,1.5+h-.5,o.band);
      if(n){faceL(n,vf,t-(1+2*s)/64*2,t-.5/32,zc-s,zc+s,'#fff4d6');faceL(n,vf,t+.5/32,t+(1+2*s)/64*2,zc-s,zc+s,'#f4e6c0');}});
    // 台階（沿 +v 下降）：u∈[ua,ub]，自 v0 起 n 級，每級深 d（格）、高 r（px）
    const stepsV=(g,ua,ub,v0,n,d,r,c)=>{for(let i=0;i<n;i++){boxZ(g,ua,v0,ub-ua,(n-i)*d,i*r,r,c.t,c.l,c.r);}};
    const stepsU=(g,va,vb,u0,n,d,r,c)=>{for(let i=0;i<n;i++){boxZ(g,u0,va,(n-i)*d,vb-va,i*r,r,c.t,c.l,c.r);}};
    // 柱列（前緣在 v 面）：us＝各柱 u 起點；柱亮面寬 cw、暗面深 cd（格）
    const colsU=(g,v,us,z0,z1,c,cw=1/32,cd=1/32)=>{for(const u of us){boxZ(g,u,v-cd,cw,cd,z0,z1-z0,null,c.l,c.r);
      faceL(g,v,u-.5/32,u+cw+.5/32,z1-1,z1,c.cap);faceL(g,v,u-.5/32,u+cw+.5/32,z0,z0+1,c.base);}};
    const colsV=(g,u,vs,z0,z1,c,cw=1/32,cd=1/32)=>{for(const v of vs){boxZ(g,u-cd,v,cd,cw,z0,z1-z0,null,c.l,c.r);
      faceR(g,u,v-.5/32,v+cw+.5/32,z1-1,z1,c.capR||c.cap);faceR(g,u,v-.5/32,v+cw+.5/32,z0,z0+1,c.baseR||c.base);}};
    // 山花（+v 面三角）＋其後 +u 坡屋面（屋脊沿 v，從 vb 接到 vf）
    const pediment=(g,u0,u1,vb,vf,z,rise,c)=>{const um=(u0+u1)/2;
      fp(g,[P(um,vb,z+rise),P(um,vf,z+rise),P(u1,vf,z),P(u1,vb,z)],c.rs);
      if(c.rl){const nl=Math.max(2,Math.floor(((u1-um)*16+rise)/2.6));for(let k=1;k<nl;k++){const f=k/nl,u=um+(u1-um)*f,zz=z+rise-rise*f;BL(g,P(u,vb+.01,zz),P(u,vf-.01,zz),c.rl);}}
      fp(g,[P(u0,vf,z),P(u1,vf,z),P(um,vf,z+rise)],c.tri);
      if(c.tym)fp(g,[P(u0+2/32,vf,z+1),P(u1-2/32,vf,z+1),P(um,vf,z+rise-1.3)],c.tym);
      BL(g,P(u0,vf,z),P(um,vf,z+rise),c.edge);BL(g,P(um,vf,z+rise),P(u1,vf,z),c.edgeD||c.edge);
      BL(g,P(um,vb,z+rise),P(um,vf,z+rise),c.ridge||c.edge);};
    // 階梯山牆（荷蘭／法蘭德斯式 crow-step）：畫在 v 平面，u∈[u0,u1]；屋面線 ze→zt；每級寬 sw（格）；o.cap 每級石壓頂
    const stepGable=(g,v,u0,u1,ze,zt,sw,col,o={})=>{const um=(u0+u1)/2,half=(u1-u0)/2,rl=u=>zt-(zt-ze)*Math.abs(u-um)/half;
      const n=Math.max(1,Math.floor((half-sw/2)/sw+1e-6)),us=[],zs=[];for(let k=0;k<n;k++){us.push(u0+k*sw);zs.push(rl(u0+(k+1)*sw)+1.2);}
      const un=u0+n*sw,ztop=zt+(o.top||2.5),L=[],R=[];
      L.push([u0,ze]);for(let k=0;k<n;k++){L.push([us[k],zs[k]]);L.push([us[k]+sw,zs[k]]);}L.push([un,ztop]);
      for(const[u,z]of L.slice().reverse())R.push([2*um-u,z]);
      fp(g,[...L,...R].map(([u,z])=>P(u,v,z)),col);
      if(o.cap){for(let k=0;k<n;k++){faceL(g,v,us[k],us[k]+sw,zs[k]-1,zs[k],o.cap);faceL(g,v,2*um-us[k]-sw,2*um-us[k],zs[k]-1,zs[k],o.cap);}faceL(g,v,un,2*um-un,ztop-1,ztop,o.cap);}
      return{ztop,un,n,zs,us};};
    // 圓窗（v 平面，直徑約 d px）
    const oculus=(g,n,v,t,zc,col,frame,lc)=>{faceL(g,v,t-1.5/32,t+1.5/32,zc-1,zc+1,frame);faceL(g,v,t-.5/32,t+.5/32,zc-2,zc+2,frame);
      faceL(g,v,t-.5/32,t+.5/32,zc-1,zc+1,col);if(n&&lc)faceL(n,v,t-.5/32,t+.5/32,zc-1,zc+1,lc);};
    // ---- 取樣曲面：光從左上（+v 亮、+u 暗、頂中亮）；px 空間（1 格＝32）中視線方向為 (1,1,1) ----
    const LG=(()=>{const l=[-.35,.8,.62],m=Math.hypot(l[0],l[1],l[2]);return l.map(x=>x/m);})();
    const tone=(nu,nv,nz,tones,bias=0)=>{const m=Math.hypot(nu,nv,nz)||1,d=(nu*LG[0]+nv*LG[1]+nz*LG[2])/m,I=.5+.5*d;
      const k=Math.floor((1-I)*tones.length*1.25+bias);return tones[Math.max(0,Math.min(tones.length-1,k))];};
    const circ=(uc,vc,r,z,n=48)=>{const pts=[];for(let i=0;i<n;i++){const a=i/n*2*Math.PI;pts.push(P(uc+r*Math.cos(a),vc+r*Math.sin(a),z));}return pts;};
    // 圓頂（半橢球）：底圓心 (uc,vc)、半徑 r（格）、底高 zb、頂高 hd（px）；o.ribs 肋數
    const dome=(g,uc,vc,zb,r,hd,tones,o={})=>{const R=r*32,st=.3/Math.max(R,hd,4);
      for(let th=0;th<=Math.PI/2+1e-9;th+=st){const c=Math.cos(th),s=Math.sin(th),dp=st/Math.max(.1,c);
        for(let ph=0;ph<2*Math.PI;ph+=dp){const cu=c*Math.cos(ph),cv=c*Math.sin(ph),nu=cu/R,nv=cv/R,nz=s/hd;
          if(nu+nv+nz<=1e-6)continue;const p=P(uc+r*cu,vc+r*cv,zb+hd*s);g.fillStyle=tone(nu,nv,nz,tones);g.fillRect(Math.floor(p[0]),Math.floor(p[1]),1,1);}}
      if(o.ribs)for(let i=0;i<o.ribs;i++){const ph=(i+.5)/o.ribs*2*Math.PI+(o.ro||0);
        for(let th=.05;th<Math.PI/2-(o.rtop||.25);th+=st*.5){const c=Math.cos(th),s=Math.sin(th),cu=c*Math.cos(ph),cv=c*Math.sin(ph),nu=cu/R,nv=cv/R,nz=s/hd;
          if(nu+nv+nz<=.2*Math.hypot(nu,nv,nz))continue;const p=P(uc+r*cu,vc+r*cv,zb+hd*s);g.fillStyle=o.ribc||tone(nu,nv,nz,tones,1.2);g.fillRect(Math.floor(p[0]),Math.floor(p[1]),1,1);}}};
    // 鼓座（圓柱側面）：o.win={n,hw(弧度),z0,z1,glass,frame}；o.cols＝壁柱數
    const drum=(g,n,uc,vc,z0,z1,r,tones,o={})=>{const R=r*32,st=.25/Math.max(R,4);
      for(let ph=-Math.PI/4+st/2;ph<Math.PI*3/4;ph+=st){const cu=Math.cos(ph),cv=Math.sin(ph);
        const a=P(uc+r*cu,vc+r*cv,z0),b=P(uc+r*cu,vc+r*cv,z1),x=Math.floor(a[0]);let col=tone(cu,cv,0,tones);
        g.fillStyle=col;g.fillRect(x,Math.floor(b[1]),1,Math.floor(a[1])-Math.floor(b[1]));
        const W_=o.win;if(W_){const k=Math.round(ph/(2*Math.PI)*W_.n),dph=Math.abs(ph-k*2*Math.PI/W_.n);
          if(dph<W_.hw){const c0=P(uc+r*cu,vc+r*cv,W_.z0),c1=P(uc+r*cu,vc+r*cv,W_.z1);g.fillStyle=W_.glass;g.fillRect(x,Math.floor(c1[1]),1,Math.floor(c0[1])-Math.floor(c1[1]));
            if(n&&hsh(W_.seed||5,k+20,1)<(W_.lit!=null?W_.lit:.8)){n.fillStyle=W_.lc||LIT;n.fillRect(x,Math.floor(c1[1]),1,Math.floor(c0[1])-Math.floor(c1[1]));}}
          else if(W_.frame&&dph<W_.hw+st*1.5){const c0=P(uc+r*cu,vc+r*cv,W_.z0-1),c1=P(uc+r*cu,vc+r*cv,W_.z1+1);g.fillStyle=W_.frame;g.fillRect(x,Math.floor(c1[1]),1,Math.floor(c0[1])-Math.floor(c1[1]));}}}
      if(o.top)fp(g,circ(uc,vc,r,z1),o.top);};
    // 雕像：石座＋青銅立像（舉書）
    const statue=(S,u,v,ph,d,o={})=>S.o(d,(g)=>{const s=o.s||.045;boxZ(g,u-s,v-s,2*s,2*s,0,ph-1,'#e2dac6','#d6ccb6','#a59b85');boxZ(g,u-s-.012,v-s-.012,2*s+.024,2*s+.024,ph-1,1,'#efe8d6','#e3dac4','#b3a992');
      const p=P(u,v,ph),x=rnd(p[0]),y=rnd(p[1]),b='#5f8272',bl='#86ab97',bd='#3d5a4c';
      RC(g,x-1,y-2,1,2,bd);RC(g,x,y-2,1,2,b);RC(g,x-1,y-7,2,5,b);RC(g,x-1,y-7,1,5,bl);RC(g,x-1,y-9,2,2,bl);RC(g,x,y-9,1,1,b);
      RC(g,x+1,y-11,1,4,b);RC(g,x+1,y-12,1,1,'#e7d38a');RC(g,x-2,y-6,1,3,bd);});
    // 矩形水池：石緣＋水面＋反光；o.jets 噴泉數
    const pool=(S,u0,v0,du,dv,d,o={})=>{const e=o.e||.035;S.o(d,(g)=>{boxZ(g,u0,v0,du,dv,0,2,'#e6dfcd','#d5cdb9','#a69e8a');
        flat(g,u0+e,v0+e,du-2*e,dv-2*e,'#4a82a9',2);BL(g,P(u0+e,v0+e,2),P(u0+du-e,v0+e,2),'#34678c');BL(g,P(u0+e,v0+e,2),P(u0+e,v0+dv-e,2),'#3a6f95');
        for(let i=0;i<(o.ripples||3);i++){const a=u0+e+.05+(du-2*e-.14)*hsh(o.seed||1,i,1),b=v0+e+.03+(dv-2*e-.06)*hsh(o.seed||1,i,2);BL(g,P(a,b,2),P(a+.06,b,2),'#8fc3df');}});
      if(o.jets)S.t(d+.001,(g)=>{for(let i=0;i<o.jets;i++){const f=o.jets>1?i/(o.jets-1):.5,p=P(u0+du/2+(o.jetU?(f-.5)*o.jetU:0),v0+dv/2+(o.jetV?(f-.5)*o.jetV:0),2),x=rnd(p[0]),y=rnd(p[1]),h=o.jh||5;
        RC(g,x,y-h,1,h,'#e4f3fb');RC(g,x-1,y-h+1,1,1,'#cfe8f5');RC(g,x+1,y-h+1,1,1,'#cfe8f5');RC(g,x-1,y-1,3,1,'#bfe0f0');}});};
    // 圓形水池
    const basin=(S,uc,vc,r,d,o={})=>S.o(d,(g)=>{fp(g,circ(uc,vc,r,0),'#a69e8a');fp(g,circ(uc,vc,r,2.5),'#e6dfcd');fp(g,circ(uc,vc,r-.04,2.5),'#4a82a9');
      fp(g,circ(uc-.012,vc-.012,r-.06,2.5),'#4f89b1');for(let i=0;i<4;i++){const a=hsh(o.seed||2,i,1)*6.28,rr=(r-.08)*hsh(o.seed||2,i,2);const q=P(uc+rr*Math.cos(a),vc+rr*Math.sin(a),2.5);RC(g,q[0],q[1],2,1,'#8fc3df');}});
    // ---- T613 退件修正：像素圖樣貼面（書本圖示要逐像素準，不能靠小數 faceL 糊出來）----
    // glyphL：貼在 +v 面，每字＝1/32 格寬×1px 高，rows 由上往下（zTop 取整數）；glyphR：貼在 +u 面，由左往右＝v 由大到小。pal 查不到的字元透明
    // 取像素規則與 fp 一致（像素中心落在格內才算）：欄 px=ceil(左緣x−.5)，列 m=ceil(該欄中心處的 Y−zTop+j−.5)；半格起點也不會偏半像素
    const glyphL=(g,v,u0,zTop,rows,pal)=>{const x0=P(u0,v)[0];rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const c=pal[r[i]];if(!c)continue;
      const px=Math.ceil(x0+i-.5),Y=P(u0+(px+.5-x0)/32,v)[1];g.fillStyle=c;g.fillRect(px,Math.ceil(Y-zTop+j-.5),1,1);}});};
    const glyphR=(g,u,vL,zTop,rows,pal)=>{const x0=P(u,vL)[0];rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const c=pal[r[i]];if(!c)continue;
      const px=Math.ceil(x0+i-.5),Y=P(u,vL-(px+.5-x0)/32)[1];g.fillStyle=c;g.fillRect(px,Math.ceil(Y-zTop+j-.5),1,1);}});};
    // 翻開的書：BOOK7＝深藍底上的白書（7×4：兩頁外角上翹、書脊頂 V 形下凹、底角收圓；左頁亮右頁略暗）。
    // 試過奶油底上的深藍描邊書（9×4），剪切到等距面上讀成「∞」→ 一律改成「深藍牌＋白書」，嵌在淺色石帶裡
    const BOOK7=['W.....S','WWW.SSS','WWWKSSS','.WWKSS.'];
    const BOOK9=['.NNN.NNN.','NWWWNSSSN','NWWWNSSSN','.NNNNNNN.'];
    const BPAL={W:'#f7f4ec',S:'#dcd6c6',K:'#8d96a0',N:'#23395a'},BPALN={W:'#fff4d6',S:'#f4e6c0',K:'#d9c89a'};
    // 深藍牌（+v 面，u0 起 cols 格、z0 起 6 列）＋正中白書；cols 為奇數時置中
    const plaqueL=(g,n,v,u0,cols,z0,bc)=>{faceL(g,v,u0,u0+cols/32,z0,z0+6,bc||'#2c4a6b');const bu=u0+Math.floor((cols-7)/2)/32;
      glyphL(g,v,bu,z0+5,BOOK7,BPAL);if(n)glyphL(n,v,bu,z0+5,BOOK7,BPALN);};
    // 館名立牌：石座＋深藍牌身＋白色翻開書本（7×4，四周留 1px 深藍邊）＋石壓頂；牌面朝 +v、自 u0 起 cols 格寬；v 須落在 1/32 格線上
    const nameSign=(S,u0,v,d,o={})=>S.o(d,(g,n)=>{const cols=o.cols||9,w=cols/32,bc=o.bc||'#2c4a6b',zb=o.zb||2,ph=6;
      boxZ(g,u0-.5/32,v-1.5/32,w+1/32,2/32,0,zb,'#dcd5c4','#cbc3b0','#a19986');
      boxZ(g,u0,v-1/32,w,1/32,zb,ph,SH(bc,20),bc,SH(bc,-34));
      boxZ(g,u0-.5/32,v-1.25/32,w+1/32,1.5/32,zb+ph,1,'#efe8d6','#e3dac4','#b3a992');
      const bu=u0+Math.floor((cols-7)/2)/32;glyphL(g,v,bu,zb+ph-1,BOOK7,BPAL);if(n)glyphL(n,v,bu,zb+ph-1,BOOK7,BPALN);});
    // T613 退件二修：小型館名牌（1×1 用）——7×5 深藍牌面、四周 1px 深藍邊、正中 5×3 白色翻開書本；牌下 1px 深色矮座，不再用白石座與石壓頂
    const BOOK5=['W...S','WW.SS','WWKSS'];
    const miniSign=(S,u0,v,d,o={})=>S.o(d,(g,n)=>{const bc=o.bc||'#2c4a6b';
      boxZ(g,u0+1/32,v-1/32,5/32,1/32,0,1,'#4a525c','#3b424b','#2c3238');
      boxZ(g,u0,v-1/32,7/32,1/32,1,5,SH(bc,18),bc,SH(bc,-34));
      glyphL(g,v,u0+1/32,5,BOOK5,BPAL);if(n)glyphL(n,v,u0+1/32,5,BOOK5,BPALN);});
    return {miniSign,BOOK5,LIT,winL,winR,archF,bigArch,hipU,gableU,gableV,pyramid,flatTop,stepGable,oculus,flag,man,bench,lamp,globe,tree,bush,hedge,bikes,dropBox,bookSign,stepsV,stepsU,colsU,colsV,pediment,tone,circ,dome,drum,statue,pool,basin,glyphL,glyphR,BOOK7,BOOK9,BPAL,BPALN,nameSign,plaqueL};
  };

  // 旗桿色預補償（同 civ_c）：T573 邊緣光會把桿身邊緣像素調亮／壓暗；按最終合成圖反推，處理後落在 #8a8a86 與繪製端上段無接縫
  const poleFix=(c,fa)=>{if(window.__noSilhouette573)return;const W=c.width,H=c.height,g=c.getContext('2d'),D=g.getImageData(0,0,W,H),d=D.data,T=[138,138,134];
    const Aa=(x,y)=>(x<0||y<0||x>=W||y>=H)?0:d[((y*W+x)<<2)+3],fix=[];
    for(let x=fa[0]-1;x<=fa[0];x++)for(let y=fa[1];y<H;y++){const i=(y*W+x)<<2;if(!(d[i]===138&&d[i+1]===138&&d[i+2]===134&&d[i+3]===255))break;
      const up=Aa(x,y-1)>=40,dn=Aa(x,y+1)>=40,lf=Aa(x-1,y)>=40,rt=Aa(x+1,y)>=40;if(up&&dn&&lf&&rt)continue;
      let m=1;if(!up)m=1.2;else if(!lf)m=1.1;if(!dn)m=Math.min(m,.7);else if(!rt)m=Math.min(m,.86);if(m!==1)fix.push([i,m]);}
    for(const[i,m]of fix)for(let q=0;q<3;q++)d[i+q]=Math.max(0,Math.min(255,Math.round((T[q]-(m>1?(q<2?10:8):0))/m)));
    g.putImageData(D,0,0);};
  // 收尾：南兩斜邊以外、y<2 的像素清掉並記數（日夜兩張）
  const clipLot=(L,c,nc)=>{const{W,H,AX,SZ,TOPY}=L;let n=0;const pts=[];
    for(const cc of [c,nc]){const g=cc.getContext('2d'),D=g.getImageData(0,0,W,H),d=D.data;let m=0;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)<<2;if(!d[i+3])continue;const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;
        if(y<2||u>SZ+1e-6||v>SZ+1e-6){d[i+3]=0;m++;if(cc===c&&pts.length<24)pts.push([x,y]);}}
      if(m){g.putImageData(D,0,0);}if(cc===c)n=m;}
    clipLot.pts=pts;return n;};
  const build=(k,def,layoutsOf)=>{
    const old=B[k+'_1_0'];
    const W=(old&&old.w)||def.W,H=(old&&old.h)||def.H,AX=(old&&old.ax!=null)?old.ax:def.AX,AY=(old&&old.ay!=null)?old.ay:def.AY;
    const K=A.iso575(W,H,AX,AY,def.SZ),L=LIB(K),T=KIT(L),lay=layoutsOf(L,T),order=DEV[k]||null,out=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;
      try{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
        const o=lay[v](g,ng,S)||{};S.run(g,ng);const cut=clipLot(L,c,nc);
        let top=H;{const d=c.getContext('2d').getImageData(0,0,W,H).data;for(let i=3;i<d.length;i+=4)if(d[i]){top=Math.floor(((i-3)>>2)/W);break;}}
        let flagOk=null;if(o.flagAt){const d=c.getContext('2d').getImageData(0,0,W,H).data;flagOk=true;
          for(let y=o.flagAt[1]-3;y<o.flagAt[1];y++)for(let x=o.flagAt[0]-1;x<=o.flagAt[0];x++)if(y>=0&&d[((y*W+x)<<2)+3])flagOk=false;
          poleFix(c,o.flagAt);}
        chk.push({k,slot,v,cut,cutPts:cut?clipLot.pts:null,top,height:AY-top,flagAt:o.flagAt||null,flagOk});
        const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:o.smoke||[]};if(o.flagAt)spr.flagAt=o.flagAt;
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('civ_e k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];
  };

  // ================= k14 圖書館（1×1）=================
  try{
    build(14,{W:72,H:112,AX:36,AY:110,SZ:1},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,litMask,lineU,lineV}=L;
      const GL='#46698a',GD='#304b62',GH='#8fb2c9';
      return [
      // ---------- v0 卡內基式石造：石灰岩單層閱覽廳坐在粗面石基座上（石縫、轉角隅石）；正面入口是四柱內凹門廊（柱列立在立面、其後陰影廊與雙扇木門＋拱形氣窗），立面山花＋其後小坡屋頂接主屋面；
      //            門廊前四級大台階；門廊左右各一扇高大拱窗、右側面三扇高拱窗、基座小窗；銅綠四坡屋頂，屋脊上一座高側窗採光塔（高窗）；
      //            前庭石板廣場＋步道，牆腳綠籬，西角一棵樹、西前草坪館名立牌（深藍牌＋白色翻開書本 7×4）、右側鋪面腳踏車架 ----------
      //            T613 接手：立牌由步道口移到西側草坪。退件（書牌躲在樹幹後、台階右側灰燈桿像一根擋門的柱子）→ 樹退到西角、立牌與樹幹隔 2px、
      //            書本改成逐像素白書嵌深藍牌；燈桿刪掉
      (g,ng,S)=>{
        const ST='#e4d9c0',SD='#b3a78d',SJ='#d3c8ad',SJD='#a2977e',PL='#cabc9d',PLD='#978a70',PLJ='#b2a587',PLJD='#80755e';
        const TR='#f3eddc',TRD='#c9bea5',RF='#7aa996',RS='#557f71',CL='#f6f1e3',CD='#c3b89f',DOOR='#5b3b27';
        const u0=2/32,u1=30/32,v0=4/32,v1=19/32,zP=6,zW=22,zE=26;
        const pu0=10/32,pu1=22/32,sv=v1+4/32;
        pave(g,'g',0,0,1,1,1401);
        pave(g,'st',.30,sv,.52,.86-sv,1402);
        pave(g,'st',.38,.86,.24,.12,1403);   // 止於 v=.98：最後一條石縫線不再壓到南斜邊
        pave(g,'c',.78,.66,.19,.24,1404,.11);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,34]]);
        // 主體閱覽廳
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,zE,null,ST,SD);
          for(let z=zP+3;z<zW;z+=3){BL(g,P(u0+1/32,v1,z),P(u1,v1,z),SJ);BL(g,P(u1,v0+1/32,z),P(u1,v1,z),SJD);}
          faceL(g,v1,u0,u1,0,zP,PL);faceR(g,u1,v0,v1,0,zP,PLD);
          for(let z=2;z<zP-1;z+=2){BL(g,P(u0+1/32,v1,z),P(u1,v1,z),PLJ);BL(g,P(u1,v0+1/32,z),P(u1,v1,z),PLJD);}
          faceL(g,v1,u0,u1,zP-1,zP,TR);faceR(g,u1,v0,v1,zP-1,zP,TRD);
          // 簷部：額枋／飾帶／簷口
          faceL(g,v1,u0,u1,zW,zE,TR);faceR(g,u1,v0,v1,zW,zE,TRD);
          faceL(g,v1,u0,u1,zW+1,zW+2.5,ST);faceR(g,u1,v0,v1,zW+1,zW+2.5,SD);
          // 隅石
          for(let z=zP,i=0;z<zW-.5;z+=2,i++){const w=(i%2?2:3)/32;faceL(g,v1,u0,u0+w,z,z+1.4,TR);faceL(g,v1,u1-w,u1,z,z+1.4,TR);faceR(g,u1,v1-w,v1,z,z+1.4,TRD);faceR(g,u1,v0,v0+w,z,z+1.4,TRD);}
          // 正面兩扇高拱窗（門廊兩側）
          for(const t of [6/32,26/32]){T.bigArch('L',g,n,v1,t,2/32,zP+3,zW-4,2,{frame:TR,glass:GL,hi:GH,mul:'#d9d2bf',tr:zP+9});
            faceL(g,v1,t-1/32,t+1/32,1.5,3.5,GD);}
          // 側面三扇高拱窗
          for(let i=0;i<3;i++){const t=v0+(v1-v0)*(i+.5)/3;T.bigArch('R',g,n,u1,t,1.5/32,zP+3,zW-4,2,{frame:TRD,glass:GD,mul:'#a9a18c',lc:'#f3d68e'});
            faceR(g,u1,t-1/32,t+1/32,1.5,3.5,'#27394a');}
          // 內凹門廊：陰影廊＋雙扇木門＋拱形氣窗（柱縫間露出）
          faceL(g,v1,pu0,pu1,zP,zW,'#83775f');faceL(g,v1,pu0,pu1,zW-1.5,zW,'#6c624f');
          faceL(g,v1,13/32,19/32,zP,zP+9,DOOR);for(const t of [14.5/32,17.5/32])faceL(g,v1,t,t+.4/32,zP+1,zP+8,'#7a5237');
          T.archF('L',g,v1,16/32,3/32,zP+9.5,zP+9.5,3,'#9cc0d6');
          if(n){T.archF('L',n,v1,16/32,3/32,zP+9.5,zP+9.5,3,'#ffe7b0');faceL(n,v1,13/32,19/32,zP,zP+9,'rgba(255,210,130,.28)');}
          for(let t=pu0+1/32;t<pu1-1/32;t+=1.5/32)faceL(g,v1,t,t+.7/32,zW+1.3,zW+2.2,'#6f6655');
          T.hipU(g,u0,v0,u1-u0,v1-v0,zE+1.5,8,{rf:RF,rs:RS,ov:.03,ridge:'#a6d0bf',hip:'#9cc6b4'});
        });
        // 屋脊高側窗採光塔（高窗）
        S.o(1.05,(g,n)=>{const a0=.36,a1=.64,b0=.26,b1=.42,zb=33.5,zt=39;
          boxZ(g,a0,b0,a1-a0,b1-b0,zb,zt-zb,null,'#e9e1cc','#b9ad93');
          T.winL(g,n,b1,a0+.02,a1-.02,3,zb+1,2,3.5,GL,{seed:1406,lit:.95});T.winR(g,n,a1,b0+.02,b1-.02,2,zb+1,2,3.5,GD,{seed:1407,lit:.9});
          T.hipU(g,a0,b0,a1-a0,b1-b0,zt+1.5,3,{rf:RF,rs:RS,ov:.02,ridge:'#a6d0bf'});});
        // 門廊柱列＋立面山花（其後小坡屋頂接主屋面）
        S.o(1.1,(g)=>{
          T.colsU(g,v1+1/32,[11/32,14/32,17/32,20/32],zP,zW,{l:CL,r:CD,cap:TR,base:TR});
          // 立面山花（站在簷口上的三角牆，內凹山花面＋斜簷亮邊）
          {const a=pu0-1/32,b=pu1+1/32,vf=v1+.03,m=(a+b)/2;fp(g,[P(a,vf,zE-.5),P(b,vf,zE-.5),P(m,vf,zE+6)],TR);
            fp(g,[P(a+2/32,vf,zE+.5),P(b-2/32,vf,zE+.5),P(m,vf,zE+4.6)],ST);
            BL(g,P(a,vf,zE),P(m,vf,zE+6),'#fbf7ec');BL(g,P(m,vf,zE+6),P(b,vf,zE),TRD);const k=P(m,vf,zE+6.5);RC(g,k[0]-1,k[1]-1,2,1,'#fbf7ec');}
        });
        // 大台階（T613 退件二修：每級踢面底下一條 1px 深色線，四級一級一級分得出來；踏面與踢面上半同一個亮色）
        S.o(1.2,(g)=>{const a=pu0-1/32,b=pu1+1/32;T.stepsV(g,a,b,v1,4,1/32,1.5,{t:'#ebe3cf',l:'#e3d9c1',r:'#a3977e'});
          for(let i=0;i<4;i++){const vf=v1+(4-i)/32;faceL(g,vf,a,b,i*1.5,i*1.5+1,'#9a8e74');faceR(g,b,v1+(3-i)/32,vf,i*1.5,i*1.5+1,'#786d58');}});
        // 牆腳綠籬
        T.hedge(S,u0+.02,v1+.005,pu0-u0-.06,.04,2.5,1.15);T.hedge(S,pu1+.04,v1+.005,u1-pu1-.06,.04,2.5,1.16);
        // T613 退件修正：樹退到西角（樹冠右緣 x≤10），館名立牌放在西前草坪、與樹幹隔開 2px，白色翻開書本 7×4；台階右側那根燈桿刪掉
        T.tree(S,.04,.96,1.0,0,1.5);
        // T613 退件二修：館名牌縮成 7×5 深藍小牌（只留白色書本），挪到西前草坪、牌右緣離台階左端 3px 以上
        T.miniSign(S,5/32,31/32,1.45);
        T.bikes(S,.91,.70,0,.16,4,1.4,1405);   // T613 接手：車架往南挪 .05，不再被東側牆腳綠籬蓋住半截
        // 持書行人移到台階前石板步道上（不夾在立牌與台階之間）；另一位移到台階右下角的廣場上，兩人不疊成一根
        S.t(1.9,(g)=>{T.man(g,P(.56,.93),'#b8483a',{book:'#e9d9a0'});T.man(g,P(.80,.78),'#3f6fa8');});
        return{};
      },
      // ---------- v1 現代玻璃盒：兩層挑高玻璃閱覽廳（通高帷幕、夾層樓板線、窗後一排排彩色書脊），白色厚屋頂板向前懸挑成入口雨遮（兩根細鋼柱）、屋頂三格天窗；
      //            東側木格柵書庫量體（直條木格柵、兩層、規則直窗、二樓正面深藍牌＋白色翻開書本）；前緣兩級通長台階，西前角方形樹池，塔前腳踏車架、長椅 ----------
      //            T613 接手：原 15px 白立柱讀成柱子，改低牌。退件（木塔比閱覽廳又高又寬、三條長縫窗，讀成辦公樓／旅館加一間店；塔頂標誌讀成 E/S；
      //            玻璃盒夜裡幾乎全亮）→ 塔 46→32px、退後露出玻璃廳側面、分兩層加規則窗格、標誌改逐像素翻開書本；夜光改逐層整條亮、樓板與中梃留暗；
      //            東前角低牌拿掉（書牌就是二樓那面）
      (g,ng,S)=>{
        // T613 接手：量高 59px 低於 60–90 規格 → 玻璃廳上層加高 2px（zG 25→27、屋頂板 28→30），書庫量體同步 32→34（仍只比屋頂板高 4px）
        const u0=3/32,u1=22/32,v0=3/32,v1=21/32,zB=2,zG=27,zS=30,cv=26/32;
        // T613 退件修正：書庫塔由 46px 降到 32px（只比閱覽廳屋頂板高 4px、讀成同一棟的木構量體，不再是塔樓）、往後退到 v≤13/32（露出玻璃廳東側面），
        //            分兩層（樓板帶對齊玻璃廳夾層樓板）＋規則窗格
        const cu0=22/32,cu1=31/32,cv0=1/32,cv1=13/32,zC=34;
        const GLS='#5a86a6',GLD='#3d6480',MUL='#e4e8e9',MULD='#aab2b5';
        pave(g,'g',0,0,1,1,1411);
        pave(g,'c',.02,.60,.74,.40,1412,.125);
        pave(g,'c',.70,.50,.26,.34,1413,.125);   // 止於 u=.96：縫線端點四捨五入不越東南斜邊
        shadow(g,[['b',u0-.03,v0-.03,u1-u0+.03,cv-v0+.03,zS],['b',cu0,cv0,cu1-cu0,cv1-cv0,zC]],.26);
        // 玻璃閱覽廳
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,zB,null,'#c4c8c6','#8f9594');
          faceL(g,v1,u0,u1,zB,zG,GLS);faceR(g,u1,v0,v1,zB,zG,GLD);
          // 書架（T613 退件二修）：原本 1px 書脊按雜湊取七色，城市實景裡讀成一塊塊橘紅斑（雜點）→
          //   每層樓一列水平書架：上下兩條深色層板線（間距 4px），中間 3px 高書脊只用三種低彩度（灰藍／米／淺褐），
          //   按玻璃格固定節奏重複（每格 2 欄：灰藍＋米、淺褐＋米 交替），不再有單獨的暖色塊
          const SHF='#3f362e',SHFD='#2e2822',BK3=[['#74879b','#c4b99c'],['#9c8266','#c4b99c']];
          for(const z0 of [zB+1,zB+13]){
            faceL(g,v1,u0,u1,z0,z0+1,SHF);faceL(g,v1,u0,u1,z0+4,z0+5,SHF);faceR(g,u1,v0,v1,z0,z0+1,SHFD);faceR(g,u1,v0,v1,z0+4,z0+5,SHFD);
            for(let i=0;i<Math.round((u1-u0)*32);i++){const k=i%3;if(k===0)continue;faceL(g,v1,u0+i/32,u0+(i+1)/32,z0+1,z0+4,BK3[((i/3)|0)%2][k-1]);}
            for(let i=0;i<Math.round((v1-v0)*32);i++){const k=i%3;if(k===0)continue;faceR(g,u1,v0+i/32,v0+(i+1)/32,z0+1,z0+4,SH(BK3[((i/3)|0)%2][k-1],-34));}}
          // 夾層樓板＋頂框
          faceL(g,v1,u0,u1,zB+11,zB+12,MUL);faceR(g,u1,v0,v1,zB+11,zB+12,MULD);
          // 直向中梃
          for(let t=u0;t<=u1+1e-6;t+=3/32)faceL(g,v1,t,t+1/32,zB,zG,MUL);
          for(let t=v0;t<=v1+1e-6;t+=3/32)faceR(g,u1,t,t+1/32,zB,zG,MULD);
          // 入口雙扇玻璃門
          faceL(g,v1,11/32,15/32,zB,zB+8,'#e9eef0');faceL(g,v1,11.5/32,14.5/32,zB,zB+7.5,'#8fb8d2');faceL(g,v1,12.9/32,13.1/32,zB,zB+7.5,'#e9eef0');
          // 夜：逐層亮——每層只亮書架上方那條玻璃帶（整條連續），樓板、頂框、中梃、書架都留暗
          if(n){const GD_=g.getImageData(0,0,L.W,L.H).data;
            const glass=(x,y)=>{const i=(y*L.W+x)<<2,h=(GD_[i]<<16)|(GD_[i+1]<<8)|GD_[i+2];return h===0x5a86a6||h===0x3d6480;};
            litMask(n,(tx)=>{faceL(tx,v1,u0,u1,zB+6,zB+11,'#fff');faceL(tx,v1,u0,u1,zB+18,zG,'#fff');},glass,'#ffe0a0');
            litMask(n,(tx)=>{faceR(tx,u1,v0,v1,zB+6,zB+11,'#fff');faceR(tx,u1,v0,v1,zB+18,zG,'#fff');},glass,'#f0cf8a');
            faceL(n,v1,11.5/32,14.5/32,zB,zB+7.5,'#fff0c8');}
        });
        // 懸挑屋頂板＋天窗
        S.o(1.05,(g)=>{const a0=u0-.03,b0=v0-.03;
          boxZ(g,a0,b0,u1-a0,cv-b0,zG,zS-zG,'#d5d8d4','#f2f3ef','#b4b9b7');
          faceL(g,cv,a0,u1,zG,zG+.8,'#c9ccc8');
          for(const b of [.20,.38,.56]){boxZ(g,.12,b,.40,.08,zS,1.5,'#6f96b0','#e6e8e6','#a9afae');flat(g,.13,b+.01,.38,.06,'#4f7c9c',zS+1.5);
            for(let t=.13+.06;t<.5;t+=.06)BL(g,P(t,b+.01,zS+1.5),P(t,b+.07,zS+1.5),'#c9d6dc');BL(g,P(.13,b+.01,zS+1.5),P(.51,b+.01,zS+1.5),'#8fb6cf');}
          boxZ(g,.56,.12,.08,.07,zS,3,'#c6cbcc','#dde0e0','#9ea5a7');});
        // 雨遮細鋼柱
        S.t(1.06,(g)=>{for(const u of [u0+.02,u1-.035]){const p=P(u,cv-.03),q=P(u,cv-.03,zG);RC(g,p[0],q[1],1,p[1]-q[1],'#5d666c');}});
        // 木格柵書庫塔
        S.o(1.1,(g,n)=>{
          boxZ(g,cu0,cv0,cu1-cu0,cv1-cv0,0,zC,null,'#bb8753','#86593a');
          for(let t=cu0+1/32;t<cu1-.5/32;t+=2/32)faceL(g,cv1,t,t+1/32,1,zC-1,'#a37140');
          for(let t=cv0+1/32;t<cv1-.5/32;t+=2/32)faceR(g,cu1,t,t+1/32,1,zC-1,'#704a2d');
          faceL(g,cv1,cu0,cu1,0,1.5,'#8f9594');faceR(g,cu1,cv0,cv1,0,1.5,'#6d7372');
          // 樓板帶（z=13，對齊玻璃廳夾層樓板）把量體分成兩層；細 1px、色階貼近木色，不做成白色橫條
          faceL(g,cv1,cu0,cu1,13,14,'#c9b79c');faceR(g,cu1,cv0,cv1,13,14,'#8f7a60');
          // 規則窗格（2px 寬直窗、底下一條窗台）：一樓正面兩扇、側面三扇；二樓側面三扇；二樓正面是書本標誌牌
          const WG='#34506a',WGD='#2a4152',WH='#6d8ea6';
          for(const a of [cu0+2/32,cu0+5/32]){faceL(g,cv1,a,a+2/32,3,4,'#d9dcdc');faceL(g,cv1,a,a+2/32,4,11,WG);faceL(g,cv1,a,a+2/32,10,11,WH);
            if(n&&hsh(1417,1,rnd(a*32))<.85)faceL(n,cv1,a,a+2/32,4,10,T.LIT);}
          for(const[z0,z1,f]of[[4,11,0],[18,29,1]])for(const a of [cv0+1/32,cv0+5/32,cv0+9/32]){faceR(g,cu1,a,a+2/32,z0-1,z0,'#a9aeae');faceR(g,cu1,a,a+2/32,z0,z1,WGD);
            if(n&&hsh(1418,f,rnd(a*32))<.75)faceR(n,cu1,a,a+2/32,z0,z1-1,'#f3d68e');}
          // 二樓正面：深藍牌面＋白色翻開書本（7×4，逐像素），上下各一條窄木邊
          faceL(g,cv1,cu0,cu1,20,26,'#2c4a6b');T.glyphL(g,cv1,cu0+1/32,25,T.BOOK7,T.BPAL);if(n)T.glyphL(n,cv1,cu0+1/32,25,T.BOOK7,T.BPALN);
          T.flatTop(g,cu0,cv0,cu1-cu0,cv1-cv0,zC,'#7a5a3e',{cap:'#d9dcdc'});
          boxZ(g,cu0+.08,cv0+.08,.1,.1,zC,3,'#c6cbcc','#dde0e0','#9ea5a7');
        });
        // 前緣通長台階
        S.o(1.2,(g)=>{T.stepsV(g,u0-.01,u1+.01,v1,2,1.5/32,1,{t:'#dcd9d1',l:'#c4c1b8',r:'#9ea09c'});});
        // 樹池
        S.o(1.3,(g)=>{boxZ(g,.07,.80,.16,.14,0,2,'#6f9a4c','#c8c6bf','#9a9892');});
        T.tree(S,.15,.87,1.1,2,1.35);
        // T613 退件修正：書本招牌就是塔頂層那面深藍牌（7×4 翻開書本）；原東前角低矮立牌拿掉，1×1 前庭只留樹池、腳踏車、長椅
        T.bikes(S,.74,.60,.17,0,4,1.4,1418);
        T.bench(S,.40,.86,true,1.5);
        // T613 退件二修：玻璃前那位橘衣行人換成暗青色，免得又在玻璃前留一塊橘斑
        S.t(1.9,(g)=>{T.man(g,P(.30,.78),'#4f7f86');T.man(g,P(.52,.90),'#3f78c0',{book:'#e9d9a0'});T.man(g,P(.62,.74),'#e2dccb',{run:1});});
        return{};
      },
      // ---------- v2 紅磚山牆：主閱覽廳屋脊縱深、石板瓦雙坡，正面是法蘭德斯式階梯山牆（逐級石壓頂、山尖圓窗），牆面石材招牌帶（書本標誌）、其上三連拱高窗（中窗較高、橫楣）；
      //            山牆正中石框圓拱木門＋扇形氣窗、兩盞壁燈、兩級台階；右側面四扇高窗夾磚壁柱；背面階梯山牆露出屋脊後方並頂一座煙囪；
      //            西側矮一層閱覽側翼（四坡頂＋煙囪）；前庭紅磚鋪面，西前老樹、東側腳踏車架、庭園燈 ----------
      //            T613 退件（山牆上的書本招牌帶在城市裡只有幾個像素）→ 加寬成 16×6px 淺色石帶、正中嵌深藍牌＋白色翻開書本；三連拱窗與山尖圓窗上移 1px 讓位
      (g,ng,S)=>{
        const BK='#b85a40',BD='#7c3a2a',BJ='#a24c36',BJD='#693022',TR='#efe4cc',TD='#b8a88a',RF='#646c79',RS='#4a515d',ST='#a39c90',SD='#6d675f';
        const u0=10/32,u1=28/32,v0=3/32,v1=22/32,zW=20,rh=15,um=(u0+u1)/2;
        const wu0=2/32,wu1=10/32,wv0=7/32,wv1=20/32,zw=12;
        pave(g,'g',0,0,1,1,1421);
        pave(g,'bp',.36,.74,.48,.25,1422);   // 止於 v=.99：磚縫線不壓南斜邊
        pave(g,'gv',.12,.78,.24,.10,1423);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,36],['b',wu0,wv0,wu1-wu0,wv1-wv0,16]]);
        // 西側矮側翼
        S.o(.9,(g,n)=>{
          boxZ(g,wu0,wv0,wu1-wu0,wv1-wv0,0,zw,null,BK,BD);
          for(let z=2;z<zw;z+=2){BL(g,P(wu0+1/32,wv1,z),P(wu1,wv1,z),BJ);}
          faceL(g,wv1,wu0,wu1,0,1.5,ST);faceL(g,wv1,wu0,wu1,zw-1,zw,TR);
          T.winL(g,n,wv1,wu0+.01,wu1-.01,2,3,2,6,GL,{frame:TR,hi:GH,seed:1424,tr:3,trc:TR});
          const r=T.hipU(g,wu0,wv0,wu1-wu0,wv1-wv0,zw+1.5,5,{rf:RF,rs:RS,ov:.025});
          boxZ(g,wu0+.05,wv0+.06,.05,.05,zw+2,10,'#c9c2b6',BK,BD);boxZ(g,wu0+.045,wv0+.055,.06,.06,zw+12,1,'#d9d2c4',TR,TD);
        });
        // 主閱覽廳（階梯山牆朝前；背面山牆的階梯露出屋脊後方，頂上一座煙囪）
        S.o(1,(g,n)=>{
          const zt=zW+rh;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,zW,null,BK,BD);
          T.stepGable(g,v0,u0,u1,zW,zt,2/32,BK,{cap:TR});
          T.gableV(g,u0,v0+.03,u1-u0,v1-v0-.06,zW+1.5,rh-1.5,{rf:RF,rs:RS,ov:.03});
          const sg=T.stepGable(g,v1,u0,u1,zW,zt,2/32,BK,{cap:TR});
          const ext=z=>{if(z<=zW)return[u0,u1];for(let k=0;k<sg.n;k++)if(sg.zs[k]>z+1)return[sg.us[k],2*um-sg.us[k]];if(z<sg.ztop-1)return[sg.un,2*um-sg.un];return null;};
          for(let z=2;z<sg.ztop-1.5;z+=2){const e=ext(z);if(e)BL(g,P(e[0]+1/32,v1,z),P(e[1]-1/32,v1,z),BJ);}
          for(let z=2;z<zW;z+=2)BL(g,P(u1,v0+1/32,z),P(u1,v1,z),BJD);
          faceL(g,v1,u0,u1,0,2,ST);faceR(g,u1,v0,v1,0,2,SD);
          faceR(g,u1,v0,v1,4,5,TD);faceR(g,u1,v0,v1,zW-1.5,zW,TD);
          // 側面磚壁柱＋四扇高窗
          for(let i=0;i<=4;i++){const t=v0+(v1-v0)*i/4;faceR(g,u1,t-.5/32,t+.5/32,2,zW-1.5,'#86412f');}
          for(let i=0;i<4;i++){const t=v0+(v1-v0)*(i+.5)/4;T.bigArch('R',g,n,u1,t,1.5/32,6,15,1.5,{frame:TD,glass:GD,mul:'#8e8778',lc:'#f3d68e'});}
          // 山牆：石材招牌帶（書本標誌＋字條）、三連拱高窗、山尖圓窗
          // T613 退件修正：招牌帶加寬成一整條淺色石帶（16px×6px，底下一條陰影線），正中嵌深藍牌＋白色翻開書本（9×6 牌、書 7×4，逐像素）；三連拱窗上移 1px 讓位
          faceL(g,v1,11/32,27/32,8,14,TR);faceL(g,v1,11/32,27/32,8,9,TD);
          T.plaqueL(g,n,v1,um-4.5/32,9,8);
          T.bigArch('L',g,n,v1,14.5/32,1.5/32,15,21,1.5,{frame:TR,glass:GL,hi:GH});
          T.bigArch('L',g,n,v1,23.5/32,1.5/32,15,21,1.5,{frame:TR,glass:GL,hi:GH});
          T.bigArch('L',g,n,v1,um,2/32,15,23,2,{frame:TR,glass:GL,hi:GH,mul:'#e8dcc2',tr:19});
          T.oculus(g,n,v1,um,zW+9,GL,TR,T.LIT);
          boxZ(g,um-1.5/32,v0-.5/32,3/32,2.5/32,sg.ztop-3,7,'#c9c2b6',BK,BD);boxZ(g,um-2/32,v0-1/32,4/32,3.5/32,sg.ztop+4,1,'#d9d2c4',TR,TD);
        });
        // 山牆正中石框入口（圓拱木門＋扇形氣窗）＋兩盞壁燈
        // T613 退件二修（入口一帶在 zoom 1 糊成一團、拱門看不出來）：拿掉奶油色門套方塊（它跟上方招牌帶連成一片），
        //   改成磚牆上直接開圓拱門洞：外圈 1px 亮石框（6px 寬、拱頂 z=7，與招牌帶之間留 1px 磚）、4px 木門、拱頂扇形氣窗；門洞自成一層描深色外框
        S.o(1.1,(g,n)=>{
          T.archF('L',g,v1,um,3/32,0,4,3,'#fbf4e2');
          T.archF('L',g,v1,um,2/32,0,4,2,'#2e2320');
          faceL(g,v1,um-2/32,um+2/32,0,4,'#6b3f28');faceL(g,v1,um-.5/32,um+.5/32,0,4,'#4a2c1d');
          T.archF('L',g,v1,um,1.5/32,4.5,4.5,1.5,'#9cc0d6');
          if(n){T.archF('L',n,v1,um,1.5/32,4.5,4.5,1.5,'#ffe7b0');faceL(n,v1,um-2/32,um+2/32,0,4,'rgba(255,210,130,.25)');}
        });
        // 兩盞壁燈：走不描邊的細線層（1px 鐵架＋1px 燈），與門洞外框各隔 1px
        S.t(1.12,(g,n)=>{for(const t of [um-6/32,um+5/32]){const lp=P(t,v1,5.5);RC(g,lp[0],lp[1]-2,1,1,'#2c3136');RC(g,lp[0],lp[1]-1,1,1,'#f3e2a8');if(n){RC(n,lp[0],lp[1]-1,1,1,'#ffe6a0');RC(n,lp[0]-1,lp[1],3,1,'rgba(255,226,160,.45)');}}});
        // 台階壓暗一階（灰石），不再跟門洞亮石框連成一塊白
        S.o(1.15,(g)=>{T.stepsV(g,um-4/32,um+4/32,v1,2,1.2/32,.9,{t:'#c7beac',l:'#aea593',r:'#8a8273'});});
        T.tree(S,.14,.88,1.15,1,1.5);
        T.bush(S,.34,.80,2,1.3);T.bush(S,.90,.14,2,1.2);
        // T613 退件二修：壁燈＋燈柱＋兩個行人＋書牌＋台階＋腳踏車疊在入口同一小塊 → 腳踏車架移到東側牆腳（沿側立面）、
        //   燈柱立在車架北端（對齊側面磚壁柱）、行人只留一位站在台階前磚鋪上
        T.bikes(S,.95,.56,0,.18,4,1.4,1426);
        T.lamp(S,.95,.48,9,1.39);
        S.t(1.9,(g)=>{T.man(g,P(.66,.98),'#3f6fa8',{book:'#e9d9a0'});});
        return{};
      },
      ];
    });
  }catch(e){console.error('civ_e k14',e);errs.push('k14:'+(e&&e.stack||e));}

  // ================= k41 圖書總館（2×2）=================
  try{
    build(41,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,litMask,lineU,lineV,paint}=L;
      const GL='#46698a',GD='#304b62',GH='#8fb2c9';
      return [
      // ---------- v0 古典穹頂：大理石長向閱覽大廳（粗面石基座＋基座小窗、整排高拱窗、簷部＋欄杆女兒牆）正中突出六柱門廊＋三角山花（浮雕）；
      //            屋頂正中方形基座上立鼓座（一圈拱窗＝高窗）、銅綠肋拱圓頂、頂上採光亭與尖頂；門廊前五級大台階、兩側基座青銅立像；
      //            前庭石板廣場＋長方形倒影水池（三道噴泉）、左右花圃綠籬與四棵樹、燈球燈柱、長椅；西角旗桿 ----------
      //            T613 退件（可能被讀成市政廳／議會）→ 門廊簷部加深 2px，飾帶改館名帶：兩側刻字短橫、正中嵌深藍牌＋白色翻開書本
      (g,ng,S)=>{
        const ST='#e9e1cd',SD='#b8ac93',SJ='#d9ceb4',SJD='#a69a81',PL='#cdbf9f',PLD='#998c72',PLJ='#b5a889',PLJD='#82775f';
        const TR='#f5efdf',TRD='#cbc0a7',CL='#f7f2e4',CD='#c6bba2',DOOR='#4a3624',LEAD='#9aa09f';
        const DOME=['#b7dfce','#93c6b1','#76ab96','#5a8e7b','#436f60'],STN=['#f2ead8','#e2d8c2','#cfc4ab','#b7ab92','#9f937b'];
        const u0=6/32,u1=58/32,v0=6/32,v1=1,zP=7,zW=27,zE=31,zB=34;
        const pu0=21/32,pu1=43/32,pvf=36/32,uc=1,vc=(v0+v1)/2;
        pave(g,'g',0,0,2,2,4101);
        pave(g,'st',.40,1.0,1.20,.96,4102);
        pave(g,'st',u0-.04,v1,u1-u0+.08,.08,4103);
        pave(g,'gd',.10,1.14,.26,.78,4104);pave(g,'gd',1.64,1.14,.26,.78,4105);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,40],['b',.72,.31,.56,.56,64]]);
        // 主體閱覽大廳
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,zB,null,ST,SD);
          for(let z=zP+3;z<zW;z+=3){BL(g,P(u0+1/32,v1,z),P(u1,v1,z),SJ);BL(g,P(u1,v0+1/32,z),P(u1,v1,z),SJD);}
          faceL(g,v1,u0,u1,0,zP,PL);faceR(g,u1,v0,v1,0,zP,PLD);
          for(let z=2;z<zP-1;z+=2){BL(g,P(u0+1/32,v1,z),P(u1,v1,z),PLJ);BL(g,P(u1,v0+1/32,z),P(u1,v1,z),PLJD);}
          faceL(g,v1,u0,u1,zP-1,zP,TR);faceR(g,u1,v0,v1,zP-1,zP,TRD);
          faceL(g,v1,u0,u1,zW,zE,TR);faceR(g,u1,v0,v1,zW,zE,TRD);faceL(g,v1,u0,u1,zW+1,zW+2.5,ST);faceR(g,u1,v0,v1,zW+1,zW+2.5,SD);
          // 欄杆女兒牆：壓頂＋一排瓶柱
          faceL(g,v1,u0,u1,zE,zB,'#ece5d3');faceR(g,u1,v0,v1,zE,zB,'#c0b59c');
          for(let t=u0+1/32;t<u1-.5/32;t+=2/32)faceL(g,v1,t,t+1/32,zE+.6,zB-1,'#bcb098');
          for(let t=v0+1/32;t<v1-.5/32;t+=2/32)faceR(g,u1,t,t+1/32,zE+.6,zB-1,'#998e77');
          faceL(g,v1,u0,u1,zB-1,zB,TR);faceR(g,u1,v0,v1,zB-1,zB,TRD);
          // 隅石
          for(let z=zP,i=0;z<zW-.5;z+=2,i++){const w=(i%2?2:3)/32;faceL(g,v1,u0,u0+w,z,z+1.4,TR);faceL(g,v1,u1-w,u1,z,z+1.4,TR);faceR(g,u1,v1-w,v1,z,z+1.4,TRD);faceR(g,u1,v0,v0+w,z,z+1.4,TRD);}
          // 整排高拱窗＋基座小窗
          for(const c of [8.5,13.5,18.5,45.5,50.5,55.5]){const t=c/32;T.bigArch('L',g,n,v1,t,1.5/32,zP+4,zW-5,2,{frame:TR,glass:GL,hi:GH,mul:'#dcd4c0',tr:zP+11});faceL(g,v1,t-1/32,t+1/32,2.5,4.5,GD);}
          for(let i=0;i<5;i++){const t=v0+(v1-v0)*(i+.5)/5;T.bigArch('R',g,n,u1,t,1.5/32,zP+4,zW-5,2,{frame:TRD,glass:GD,mul:'#aaa28d',tr:zP+11,lc:'#f3d68e'});faceR(g,u1,t-1/32,t+1/32,2.5,4.5,'#27394a');}
          T.flatTop(g,u0,v0,u1-u0,v1-v0,zB,LEAD,{cap:'#efe8d6',e:.04});
          // 門廊後的陰影廊＋青銅大門＋拱形氣窗
          faceL(g,v1,pu0,pu1,zP,zW,'#8a7e67');faceL(g,v1,pu0,pu1,zW-1.5,zW,'#6f6552');
          faceL(g,v1,28/32,36/32,zP,zP+11,DOOR);for(const t of [30/32,32/32,34/32])faceL(g,v1,t-.2/32,t+.2/32,zP+1,zP+10,'#6b5236');
          T.archF('L',g,v1,1,4/32,zP+11.5,zP+11.5,4,'#9cc0d6');
          if(n){T.archF('L',n,v1,1,4/32,zP+11.5,zP+11.5,4,'#ffe7b0');faceL(n,v1,28/32,36/32,zP,zP+11,'rgba(255,210,130,.3)');}
        });
        // 方形基座＋鼓座＋圓頂＋採光亭
        S.o(1.05,(g,n)=>{
          boxZ(g,.72,.31,.56,.56,zB-3,8,'#ddd4bf',ST,SD);faceL(g,.87,.72,1.28,zB+3,zB+5,TR);faceR(g,1.28,.31,.87,zB+3,zB+5,TRD);
          const zd=zB+5,zr=zd+12;
          T.drum(g,n,uc,vc,zd,zr,.235,STN,{win:{n:12,hw:.09,z0:zd+2.5,z1:zr-2,glass:GL,frame:TR,seed:4107,lit:.9}});
          T.drum(g,null,uc,vc,zr,zr+2,.255,[TR,'#ece5d3','#d9cfb8','#bfb49b','#a79c84'],{top:'#e6ddc8'});
          T.dome(g,uc,vc,zr+2,.24,16,DOME,{ribs:12,rtop:.3});
          const zl=zr+2+16;
          T.drum(g,n,uc,vc,zl-1,zl+5,.055,STN,{win:{n:6,hw:.4,z0:zl,z1:zl+4,glass:GL,seed:4108,lit:1}});
          T.dome(g,uc,vc,zl+5,.065,3.5,DOME);
          const tp=P(uc,vc,zl+8.5);RC(g,tp[0]-1,tp[1]-3,1,4,'#caa94a');RC(g,tp[0]-1,tp[1]-4,1,1,'#f0d880');
        });
        // 六柱門廊＋簷部＋山花
        S.o(1.1,(g)=>{
          boxZ(g,pu0,v1,pu1-pu0,pvf-v1,0,zP,'#e2d9c2',PL,PLD);
          for(let z=2;z<zP-1;z+=2)BL(g,P(pu0+1/32,pvf,z),P(pu1,pvf,z),PLJ);
          faceR(g,pu1,v1,pvf,zP,zW,'#6e6453');
          const C={l:CL,r:CD,cap:TR,base:TR};
          T.colsU(g,pvf,[21,25,29,33,37,41].map(x=>x/32),zP,zW,C);
          T.colsV(g,pu1,[v1+1/32],zP,zW,{l:CL,r:CD,cap:TRD,base:TRD});
          // T613 退件修正：門廊簷部加深 2px（飾帶 6px 高），飾帶改成館名帶（免得讀成市政廳／議會）——兩側刻字短橫、正中嵌深藍牌＋白色翻開書本（牌 9×6、書 7×4）
          const zE2=zE+2;
          boxZ(g,pu0,v1,pu1-pu0,pvf-v1,zW,zE2-zW,TR,TR,TRD);
          T.glyphL(g,pvf,pu0,zW+4,['.LL.L...........L.LL..'],{L:'#9d9178'});
          T.plaqueL(g,null,pvf,1-4.5/32,9,zW);
          T.pediment(g,pu0-.5/32,pu1+.5/32,v1-.06,pvf+.3/32,zE2,8,{rs:'#8b918f',rl:'#7a807e',tri:TR,tym:ST,edge:'#fdfaf0',edgeD:TRD,ridge:'#c9cfcd'});
          {const m=P(1,pvf+.3/32,zE2+3);RC(g,m[0]-3,m[1],6,1,'#c8bda3');RC(g,m[0]-1,m[1]-2,2,2,'#c8bda3');RC(g,m[0]-2,m[1]-1,4,1,'#d6ccb3');}
        });
        // 五級大台階＋兩側基座立像
        S.o(1.2,(g)=>{T.stepsV(g,17/32,47/32,pvf,5,1.5/32,1.4,{t:'#e9e0ca',l:'#d3c8ae',r:'#a69a81'});});
        T.statue(S,15/32,pvf+.16,8,1.25,{s:.05});T.statue(S,49/32,pvf+.16,8,1.26,{s:.05});
        // 前庭：倒影水池、花圃綠籬、樹、燈、長椅
        T.pool(S,.66,1.50,.68,.30,1.6,{jets:3,jetU:.44,seed:4109,ripples:4});
        for(const u of [.10,1.64]){T.hedge(S,u,1.14,.26,.03,2,1.5);T.hedge(S,u,1.89,.26,.03,2,1.9);}
        T.tree(S,.24,1.34,1.3,0,1.6);T.tree(S,.26,1.72,1.2,2,1.95);T.tree(S,1.76,1.30,1.3,2,1.62);T.tree(S,1.78,1.70,1.2,0,1.96);
        T.tree(S,1.92,.30,1.1,1,1.0);
        for(const[u,v]of[[.46,1.44],[1.54,1.44],[.46,1.88],[1.54,1.88]])T.globe(S,u,v,0,9,1.7+v/10);
        T.bench(S,.52,1.58,false,1.65);T.bench(S,1.44,1.58,false,1.66);
        const fa=T.flag(S,.10,1.90,10,1.97);
        S.t(1.98,(g)=>{T.man(g,P(.62,1.40),'#b8483a',{book:'#e9d9a0'});T.man(g,P(1.40,1.42),'#3f6fa8');T.man(g,P(1.0,1.90),'#6a8f4a',{run:1});T.man(g,P(.52,1.84),'#d8b24a');T.man(g,P(1.46,1.76),'#e2dccb');});
        return{flagAt:fa};
      },
      // ---------- v1 現代懸挑玻璃：石材基座閱覽層（入口通長玻璃帶、側面玻璃帶＋遮陽鰭）上疊一整塊菱格鋼構玻璃盒，向前懸挑 12px、向西 5px 蓋住入口平台（地面深影）；
      //            玻璃盒逐層樓板線、按菱格分面反光、屋頂長條天窗與白色梯間塔（書本標誌）；懸挑下三組 V 形鋼斜撐落在入口平台；基座東段屋頂綠化平台（草皮、小樹、玻璃欄杆）；
      //            入口平台前三級通長大台階，前庭長條倒影池、疊書雕塑、館名書本立牌、東側樹陣、西側腳踏車架、東側停車場（三部車）----------
      //            T613 接手：原菱格斜桿沒裁切、整片畫出立面外（248px 被收尾清掉仍留長線）→ 改 Liang–Barsky 裁切；夜光由 4×8 像素塊改成整格菱格亮暗；
      //            紅色鋼拱雕塑讀成一條紅褲子 → 換疊書雕塑；五道噴泉讀成噪點 → 倒影池不加噴泉
      //            T613 退件（夜裡菱格約一半亂亮成迷彩；菱格在 zoom 1 太密；前緣一條塞滿水池、彩色雕塑、立牌、燈、腳踏車、車；V 形斜撐讀不出來；車被擋一半）
      //            → 菱格放寬 1.5 倍、玻璃盒讀成兩層；夜光逐層一條連續暖光帶、樓板上下留暗；前緣只留入口中軸倒影池＋一面館名立牌；
      //            V 撐換兩根白色方柱；東側停車場重畫（四個垂直車格、三部 5px 長的車整台落在格內、前方不擺樹）；屋頂梯間塔標誌換成同一套翻開書本
      (g,ng,S)=>{
        const SL='#dcd8cf',SR='#a8a59e',GLV='#5b8fb3',GLR='#3e6a8a',DG='#e9eef0',DGR='#b3bec4';
        const pu0=10/32,pu1=54/32,pv0=8/32,pv1=32/32,zP=13;
        const bu0=5/32,bu1=44/32,bv0=12/32,bv1=44/32,zT=36;
        pave(g,'g',0,0,2,2,4111);
        pave(g,'c',.06,1.0,1.44,.96,4112,.25);
        pave(g,'c',1.50,1.0,.46,.96,4113,.25);
        pave(g,'gd',1.54,1.10,.38,.80,4114);
        shadow(g,[['b',pu0,pv0,pu1-pu0,pv1-pv0,20],['b',bu0,bv0,bu1-bu0,bv1-bv0,48]],.26);
        // 懸挑下方入口平台（深影）
        S.o(.95,(g)=>{boxZ(g,.22,1.0,1.14,.40,0,3,'#9d9c97','#b9b7b0','#8a8984');for(let t=.22+.125;t<1.36;t+=.125)BL(g,P(t,1.01,3),P(t,1.39,3),'#8e8d88');});
        // 石材基座閱覽層
        S.o(1,(g,n)=>{
          boxZ(g,pu0,pv0,pu1-pu0,pv1-pv0,0,zP,null,SL,SR);
          faceL(g,pv1,pu0,pu1,0,3,'#bdb9b0');faceR(g,pu1,pv0,pv1,0,3,'#8d8a84');
          // 入口通長玻璃帶（懸挑下，偏暗）
          faceL(g,pv1,14/32,42/32,3,12,'#3b5f7a');for(let t=14/32;t<=42/32+1e-6;t+=3/32)faceL(g,pv1,t,t+1/32,3,12,'#9aa7ad');
          faceL(g,pv1,26/32,30/32,3,10,'#8fb8d2');faceL(g,pv1,27.9/32,28.1/32,3,10,'#9aa7ad');
          if(n){litMask(n,(tx)=>faceL(tx,pv1,14/32,42/32,3,12,'#fff'),(x,y)=>{const a=(x+.5-L.AX)/32,b=(y+.5-L.TOPY)/16;const u=(a+b)/2;return ((Math.round(u*32)-14)%3)!==0;},'#ffe2a6');}
          // 側面玻璃帶＋遮陽鰭
          faceR(g,pu1,pv0+.06,pv1-.06,4,11,'#35546d');for(let t=pv0+.06;t<pv1-.06;t+=2/32)faceR(g,pu1,t,t+1/32,3.5,11.5,'#c9c6bf');
          if(n)for(let t=pv0+.06+1/32;t<pv1-.07;t+=2/32)if(hsh(4115,rnd(t*32),1)<.8)faceR(n,pu1,t,t+1/32,4,11,'#f3d68e');
          faceL(g,pv1,pu0,pu1,zP-1,zP,'#efece6');faceR(g,pu1,pv0,pv1,zP-1,zP,'#c4c1ba');
          // 東段屋頂綠化平台
          flat(g,bu1,pv0,pu1-bu1,pv1-pv0,'#efece6',zP);flat(g,bu1+.02,pv0+.03,pu1-bu1-.05,pv1-pv0-.06,'#6f9c4e',zP);
          for(let i=0;i<10;i++){const a=bu1+.04+(pu1-bu1-.1)*hsh(4116,i,1),b=pv0+.05+(pv1-pv0-.1)*hsh(4116,i,2);flat(g,a,b,.03,.03,hsh(4116,i,3)<.5?'#5f8c43':'#86b35f',zP);}
        });
        // T613 退件修正：V 形斜撐在 zoom 1 讀不出來 → 改成懸挑前緣兩根白色方柱（平台面 z=3 → 玻璃盒底 z=zP），避開入口中軸
        S.o(1.15,(g)=>{for(const u of [.36,1.18])boxZ(g,u,1.31,.05,.05,3,zP-3,null,'#eeece6','#b4b2ab');});
        // 懸挑菱格玻璃盒
        S.o(1.2,(g,n)=>{
          boxZ(g,bu0,bv0,bu1-bu0,bv1-bv0,zP,zT-zP,null,GLV,GLR);
          // 菱格座標：A 組斜桿 (z-zP)-sl*(s-s0)=−m·hz、B 組 (z-zP)+sl*(s-s0)=m·hz；cell 回傳像素所在的菱格
          // T613 退件修正：菱格放寬 1.5 倍（6px→9px 寬、每格高 H/3→H/2），玻璃盒改讀成兩層，樓板線過菱格頂點
          const H=zT-zP,pu=9/32,hz=H/2,sl=hz/pu,TY=L.TOPY;
          const cell=(s,s0,z)=>[Math.floor(((z-zP)-sl*(s-s0))/hz),Math.floor(((z-zP)+sl*(s-s0))/hz)];
          const cL=(x,y)=>{const u=(x+.5-L.AX)/32+bv1;return cell(u,bu0,TY+(u+bv1)*16-(y+.5));};
          const cR=(x,y)=>{const v=bu1-(x+.5-L.AX)/32;return cell(v,bv0,TY+(bu1+v)*16-(y+.5));};
          // 玻璃按菱格分面反光（整格換色階，不是噪點）
          litMask(g,(tx)=>faceL(tx,bv1,bu0,bu1,zP,zT,'#fff'),(x,y)=>{const c=cL(x,y);return hsh(4131,c[0]+40,c[1]+40)<.3;},'#7fb0cf');
          litMask(g,(tx)=>faceR(tx,bu1,bv0,bv1,zP,zT,'#fff'),(x,y)=>{const c=cR(x,y);return hsh(4132,c[0]+40,c[1]+40)<.28;},'#4f7d9c');
          // 樓板線（過菱格頂點）
          for(const z of [zP+hz-.5])faceL(g,bv1,bu0,bu1,z,z+1.5,'#2f4b61'),faceR(g,bu1,bv0,bv1,z,z+1.5,'#253c4e');
          // 菱格鋼構：兩組斜桿在「面座標 (沿面格數, z)」裡以 Liang–Barsky 裁到立面矩形內，再投影成像素線（不會畫出立面外）
          const clip=(x0,y0,x1,y1,xa,xb,ya,yb)=>{let t0=0,t1=1;const dx=x1-x0,dy=y1-y0,p=[-dx,dx,-dy,dy],q=[x0-xa,xb-x0,y0-ya,yb-y0];
            for(let i=0;i<4;i++){if(Math.abs(p[i])<1e-12){if(q[i]<0)return null;}else{const r=q[i]/p[i];if(p[i]<0){if(r>t1)return null;if(r>t0)t0=r;}else{if(r<t0)return null;if(r<t1)t1=r;}}}
            return t1-t0>1e-6?[x0+t0*dx,y0+t0*dy,x0+t1*dx,y0+t1*dy]:null;};
          const grid=(s0,s1,map,col)=>{const run=H/sl;
            for(let a=s0-run;a<s1+1e-6;a+=pu){const c=clip(a,zP,a+run,zT,s0,s1,zP,zT);if(c)BL(g,map(c[0],c[1]),map(c[2],c[3]),col);}
            for(let a=s0;a<s1+run+1e-6;a+=pu){const c=clip(a,zP,a-run,zT,s0,s1,zP,zT);if(c)BL(g,map(c[0],c[1]),map(c[2],c[3]),col);}};
          grid(bu0,bu1,(u,z)=>P(u,bv1,z),DG);
          grid(bv0,bv1,(v,z)=>P(bu1,v,z),DGR);
          faceL(g,bv1,bu0,bu1,zP,zP+1.5,DG);faceR(g,bu1,bv0,bv1,zP,zP+1.5,DGR);faceL(g,bv1,bu0,bu1,zT-1.5,zT,DG);faceR(g,bu1,bv0,bv1,zT-1.5,zT,DGR);
          // 夜（T613 退件二修）：原本每層一條整寬暖光帶（業主否決過的大片夜光）→ 光帶照菱格開間切成一格一格的窗：
          //   開間＝兩組斜桿圍出的菱格（同一格跨樓板時上下層各算一格），每層每面依 K.hsh 約 45% 不亮（留深藍玻璃）；
          //   只點「四角都落在同一格」的像素 ⇒ 斜桿經過的像素一律不亮，斜桿在光帶上是實心連續的深色 1px 線（不再半亮成鋸齒）；
          //   亮格上緣 1px 用較暗的暖色（天花陰影）；右面（暗面）整體比左面低一階
          if(n){const GD_=g.getImageData(0,0,L.W,L.H).data;
            const isGlass=(x,y)=>{if(x<0||y<0||x>=L.W||y>=L.H)return false;const i=(y*L.W+x)<<2,h=(GD_[i]<<16)|(GD_[i+1]<<8)|GD_[i+2];return h===0x5b8fb3||h===0x3e6a8a||h===0x7fb0cf||h===0x4f7d9c;};
            const face=(isL,seed,col,colTop)=>{
              const fc=isL?((px,py)=>{const u=(px-L.AX)/32+bv1,z=TY+(u+bv1)*16-py;return[cell(u,bu0,z),z];})
                          :((px,py)=>{const v=bu1-(px-L.AX)/32,z=TY+(bu1+v)*16-py;return[cell(v,bv0,z),z];});
              const[mc,mx]=A.cv(L.W,L.H);if(isL)faceL(mx,bv1,bu0,bu1,zP,zT,'#fff');else faceR(mx,bu1,bv0,bv1,zP,zT,'#fff');const M=mx.getImageData(0,0,L.W,L.H).data;
              // 只點「整格落在同一層」的菱格（兩組斜桿序號和 c0+c1＝0／2 ⇒ 菱格中心在第 1／2 層正中）；跨樓板的半格一律留暗（讀成樓板上下的窗間牆）
              const lit=(x,y)=>{if(x<0||y<0||x>=L.W||y>=L.H||!M[((y*L.W+x)<<2)+3]||!isGlass(x,y))return false;
                const[c]=fc(x+.5,y+.5),sm=c[0]+c[1];if(sm!==0&&sm!==2)return false;
                for(const[dx,dy]of[[.1,.1],[.9,.1],[.1,.9],[.9,.9]]){const q=fc(x+dx,y+dy)[0];if(q[0]!==c[0]||q[1]!==c[1])return false;}
                return hsh(seed,c[0]+40,c[1]+40)<.55;};
              for(let y=0;y<L.H;y++)for(let x=0;x<L.W;x++)if(lit(x,y)){n.fillStyle=lit(x,y-1)?col:colTop;n.fillRect(x,y,1,1);}};
            face(true,4141,'#ffdf9e','#d9a35e');face(false,4142,'#e3bd7c','#b8844c');}
          T.flatTop(g,bu0,bv0,bu1-bu0,bv1-bv0,zT,'#b9bdbc',{cap:'#eef0ef',e:.03});
          for(const b of [.52,.80,1.08]){flat(g,.30,b,.80,.10,'#e9ebea',zT);flat(g,.31,b+.012,.78,.076,'#5e8cab',zT);for(let t=.36;t<1.1;t+=.08)BL(g,P(t,b+.012,zT),P(t,b+.088,zT),'#c9d6dc');}
        });
        // 屋頂白色梯間塔（書本標誌）
        S.o(1.25,(g,n)=>{const a0=6/32,b0=14/32,du=10/32,dv=8/32,z=zT,h=8,vf=b0+dv;boxZ(g,a0,b0,du,dv,z,h,null,'#f1f2ef','#b9bfc0');T.flatTop(g,a0,b0,du,dv,z+h,'#c9cdcc',{cap:'#f4f5f2',e:.02});
          // T613：深藍牌面＋白色翻開書本（7×4，逐像素，與其他款同一套圖示）
          faceL(g,vf,a0+.5/32,a0+du-.5/32,z+1,z+7,'#2c4a6b');T.glyphL(g,vf,a0+1/32,z+6,T.BOOK7,T.BPAL);if(n)T.glyphL(n,vf,a0+1/32,z+6,T.BOOK7,T.BPALN);});
        // 屋頂綠化平台：玻璃欄杆＋小樹
        S.t(1.3,(g)=>{BL(g,P(bu1+.01,pv1-.01,zP+3),P(pu1-.01,pv1-.01,zP+3),'#cfe3ec');BL(g,P(pu1-.01,pv0+.01,zP+3),P(pu1-.01,pv1-.01,zP+3),'#a9c3cf');});
        for(const[u,v]of[[1.52,.46],[1.58,.80]])S.o(1.31+v/100,(g)=>{const p=P(u,v,zP),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-4,1,4,'#6e5238');L.ell(g,x,y-6,3,2,'#4f7f35');L.ell(g,x-1,y-7,2,1,'#6fa247');});
        // 三級通長大台階
        S.o(1.4,(g)=>{T.stepsV(g,.22,1.36,1.40,3,1.6/32,1,{t:'#d9d7d1',l:'#c2c0b9',r:'#9a9994'});});
        // 東側員工／訪客停車場（瀝青、白色車格線、三部車、一盞燈）
        // T613 退件修正：東側停車場整片畫清楚——瀝青、四個垂直車格、三部車整台落在車格內（車身 5px 長），前方不擺樹與燈，不再被擋一半
        pave(g,'a',1.72,.14,.26,.84,4133);
        for(let v=.16;v<1.0;v+=.20)BL(g,P(1.76,v),P(1.96,v),'#e6e4dc');BL(g,P(1.76,.16),P(1.76,.96),'#e6e4dc');
        for(const[v,c]of[[.21,'#c24a3a'],[.61,'#e2e2dc'],[.81,'#2f5f96']])S.o(1.0+v/100,(g)=>{boxZ(g,1.79,v,.16,.10,.5,2.5,SH(c,10),c,SH(c,-30));
          boxZ(g,1.83,v+.015,.08,.07,3,1.5,SH(c,22),'#9cc3da','#5d7f96');});
        T.lamp(S,1.74,.46,12,1.02);
        // 入口廣場（T613 退件修正：原本一條前緣塞了倒影池、彩色雕塑、立牌、燈、腳踏車、長椅）→ 只留入口中軸上一座長條倒影池＋東側一面館名立牌
        T.pool(S,.39,1.64,.80,.20,1.8,{seed:4118,ripples:3});
        // T613 接手：2×2 要有雕像——倒影池西端水中一座石座青銅讀書像（單色青銅，不再用彩色抽象雕塑）
        T.statue(S,.50,1.74,7,1.81,{s:.04});
        T.nameSign(S,42/32,54/32,1.75,{cols:11});
        T.tree(S,1.64,1.20,1.2,2,1.5);T.tree(S,1.88,1.34,1.1,0,1.7);T.tree(S,1.92,1.56,1.2,0,1.85);
        T.tree(S,.10,1.72,1.2,1,1.8);
        S.t(1.97,(g)=>{T.man(g,P(.62,1.54),'#d07a3a');T.man(g,P(.92,1.50),'#3f78c0',{book:'#e9d9a0'});T.man(g,P(1.14,1.90),'#e2dccb',{run:1});T.man(g,P(.30,1.90),'#6a8f4a');});
        return{};
      },
      // ---------- v2 磚造塔樓式：長向紅磚閱覽大廳（整排高拱窗夾扶壁、石材腰線、簷下磚牙、石板瓦雙坡＋屋脊長條天窗、東山牆玫瑰窗）；
      //            西端方形紅磚鐘塔（隅石、正面大拱門入口、兩段尖拱窗、白色鐘面、鐘樓雙拱開口、角尖塔＋方錐尖頂）；東端向前伸出的山牆閱覽翼（通到山尖的大拱高窗）；
      //            鐘塔前五級大台階，塔與翼之間的前院石板廣場中央圓形水池＋雕像，前緣草坪、三棵樹、步道、燈與長椅、館名書本立牌 ----------
      //            T613 接手：隅石由 2–3px 收成 1–2px（原本塔面一半是奶油色、讀成花紋）；加書本立牌，免得整棟讀成教堂
      //            T613 退件（尖頂高塔＋雙坡長廳＋東翼通高尖拱與玫瑰窗，zoom 1／1.5 一眼讀成教堂；前院燈、雕像、水池擠成一團）→
      //            塔 78→64px、方錐尖頂與四角尖塔換平頂磚女兒牆、鐘面與鐘樓雙拱換深藍書本館徽、入口上方一條寬石材館名帶（嵌深藍牌＋白書）、
      //            尖拱窗全改圓拱；大廳四扇尖拱窄窗＋扶壁 → 三扇 4px 圓拱閱覽高窗；玫瑰窗 → 山尖小方窗；東翼尖拱大窗 → 閱覽室大方窗（兩層彩色書脊書架）；
      //            前院只留圓池＋雕像，燈只留步道口兩盞；立牌、長椅、灌木拿掉
      (g,ng,S)=>{
        const BK='#b3573f',BD='#78382a',BJ='#9e4b36',BJD='#652f22',TR='#eee3cb',TD='#b6a687',RF='#5f6874',RS='#474e59',ST='#a39c90',SD='#6d675f';
        const hu0=16/32,hu1=58/32,hv0=6/32,hv1=28/32,zW=24,rh=14;
        const tu0=4/32,tu1=16/32,tv0=18/32,tv1=30/32,zT=64;   // T613：塔身 78→64（少一段，不再是多段鐘樓比例），頂上改平頂女兒牆
        const wu0=44/32,wu1=58/32,wv0=28/32,wv1=44/32,zw=22,wrh=12;
        pave(g,'g',0,0,2,2,4121);
        pave(g,'st',.10,.92,1.30,.52,4122);
        pave(g,'st',.80,1.44,.30,.54,4123);   // 止於 v=1.98：縫線端點不越西南斜邊
        // T613 退件二修（前緣圓池到南頂點一大片純草皮）：自前院南緣（塔前台階軸線往前）拉一條石板步道斜向南頂點。
        //   方向 (u,v)=(1,.5) ⇒ 畫面上每 2px 右移、3px 下降，邊緣是乾淨的 2:3 階；水平寬 5px；每 4px 一道橫向石縫、石板按列取三種石色
        {const X0=68+(.90-1.44)*32,Y0=84+(.90+1.44)*16,SLB=['#d2cab6','#cbc3af','#d8d0bd'];
          paint(g,(u,v,x,y)=>{if(v<1.44)return null;const t=(y+.5-Y0)/24,dx=x+.5-(X0+16*t);if(Math.abs(dx)>=2.5)return null;
            const r=Math.floor((y-Math.floor(Y0))/4),q=(y-Math.floor(Y0))-4*r;if(q===0)return '#b3aa94';
            return dx>1.5?'#c2baa5':SLB[(hsh(4127,r,1)*3)|0];});}
        shadow(g,[['b',hu0,hv0,hu1-hu0,hv1-hv0,36],['b',tu0,tv0,tu1-tu0,tv1-tv0,zT+10],['b',wu0,wv0,wu1-wu0,wv1-wv0,30]]);
        const brickL=(g,v,ua,ub,z0,z1)=>{for(let z=z0+2;z<z1;z+=2)BL(g,P(ua+1/32,v,z),P(ub,v,z),BJ);};
        const brickR=(g,u,va,vb,z0,z1)=>{for(let z=z0+2;z<z1;z+=2)BL(g,P(u,va+1/32,z),P(u,vb,z),BJD);};
        // 鐘塔
        S.o(.9,(g,n)=>{
          boxZ(g,tu0,tv0,tu1-tu0,tv1-tv0,0,zT,null,BK,BD);
          brickL(g,tv1,tu0,tu1,3,zT);brickR(g,tu1,tv0,tv1,3,zT);
          faceL(g,tv1,tu0,tu1,0,3,ST);faceR(g,tu1,tv0,tv1,0,3,SD);
          for(const z of [40,58])faceL(g,tv1,tu0,tu1,z,z+1.5,TR),faceR(g,tu1,tv0,tv1,z,z+1.5,TD);
          for(let z=3,i=0;z<zT-1;z+=3,i++){const w=(i%2?1:2)/32;faceL(g,tv1,tu0,tu0+w,z,z+2,TR);faceL(g,tv1,tu1-w,tu1,z,z+2,TR);faceR(g,tu1,tv1-w,tv1,z,z+2,TD);faceR(g,tu1,tv0,tv0+w,z,z+2,TD);}
          const tc=(tu0+tu1)/2,vcc=(tv0+tv1)/2;
          // 正面大拱門入口
          T.archF('L',g,tv1,tc,3.5/32,0,11,3.5,TR);T.archF('L',g,tv1,tc,2.5/32,0,11,2.5,'#2e2320');
          faceL(g,tv1,tc-2.5/32,tc+2.5/32,0,9,'#6b3f28');faceL(g,tv1,tc-.2/32,tc+.2/32,0,9,'#3e251a');T.archF('L',g,tv1,tc,2/32,9.5,9.5,2.5,'#9cc0d6');
          if(n){T.archF('L',n,tv1,tc,2/32,9.5,9.5,2.5,'#ffe7b0');faceL(n,tv1,tc-2.5/32,tc+2.5/32,0,9,'rgba(255,210,130,.28)');}
          // T613 退件修正（原本讀成教堂）：入口拱門上方一條寬石材館名帶（正面 12px×8px，正中嵌深藍牌＋白色翻開書本；側面續接、刻字短橫）
          faceL(g,tv1,tu0,tu1,15,23,TR);faceR(g,tu1,tv0,tv1,15,23,TD);faceL(g,tv1,tu0,tu1,15,16,'#d8ccb0');faceR(g,tu1,tv0,tv1,15,16,'#a39377');
          T.plaqueL(g,n,tv1,tc-4.5/32,9,16);
          T.glyphR(g,tu1,tv1,20,['.LL.L.LL.LL.'],{L:'#857559'});
          // 一段圓拱高窗（尖拱→圓拱，4px 寬、中梃＋橫楣）
          T.bigArch('L',g,n,tv1,tc,2/32,26,35,2,{glass:GL,frame:TR,hi:GH,mul:'#e8dcc2',tr:30});
          T.bigArch('R',g,n,tu1,vcc,2/32,26,35,2,{glass:GD,frame:TD,mul:'#8e8778',tr:30,lc:'#f3d68e'});
          // 頂段：正面石框嵌深藍牌＋白色翻開書本（館徽，取代鐘面與鐘樓雙拱開口）；側面一扇小圓拱窗
          faceL(g,tv1,tu0+1/32,tu1,46,54,TR);faceL(g,tv1,tu0+1/32,tu1,46,47,'#d8ccb0');T.plaqueL(g,n,tv1,tu0+2/32,9,47);
          T.bigArch('R',g,n,tu1,vcc,1.5/32,47,52,1.5,{glass:GD,frame:TD,lit:false});
          loggia(g);
        });
        // T613 退件二修（建議項）：平頂磚女兒牆遠看像煙囪／水塔 → 頂段改一圈開口拱廊（每面兩個 3px 圓拱開口、中間與兩角磚墩、石窗台）
        //   ＋石簷口＋低矮銅綠四坡頂（坡高 5.5px，不加尖頂與十字，免得又讀成教堂尖塔）；總高與原女兒牆頂相同
        //   與塔身同一層（不在塔身與拱廊之間多描一條黑外框）
        const loggia=(g)=>{const z0=zT,z1=zT+6.5,tc=(tu0+tu1)/2,vcc=(tv0+tv1)/2;
          boxZ(g,tu0,tv0,tu1-tu0,tv1-tv0,z0,z1-z0,null,BK,BD);
          faceL(g,tv1,tu0,tu1,z0,z0+1,TR);faceR(g,tu1,tv0,tv1,z0,z0+1,TD);
          for(const c of [tu0+3.5/32,tu0+8.5/32])T.archF('L',g,tv1,c,1.5/32,z0+1,z0+4.5,1.5,'#2a1f1b');
          for(const c of [tv0+3.5/32,tv0+8.5/32])T.archF('R',g,tu1,c,1.5/32,z0+1,z0+4.5,1.5,'#1f1714');
          boxZ(g,tu0-.03,tv0-.03,tu1-tu0+.06,tv1-tv0+.06,z1,1.5,TR,TR,TD);
          T.pyramid(g,tc,vcc,tu1-tu0+.08,z1+1.5,5.5,'#7aa996','#557f71');};
        // 長向閱覽大廳
        S.o(1,(g,n)=>{
          boxZ(g,hu0,hv0,hu1-hu0,hv1-hv0,0,zW,null,BK,BD);
          brickL(g,hv1,hu0,hu1,3,zW);brickR(g,hu1,hv0,hv1,3,zW);
          faceL(g,hv1,hu0,hu1,0,3,ST);faceR(g,hu1,hv0,hv1,0,3,SD);
          faceL(g,hv1,hu0,hu1,5,6,TR);faceR(g,hu1,hv0,hv1,5,6,TD);
          faceL(g,hv1,hu0,hu1,zW-2,zW,TR);faceR(g,hu1,hv0,hv1,zW-2,zW,TD);
          for(let t=hu0+1/32;t<hu1;t+=2/32)faceL(g,hv1,t,t+1/32,zW-3,zW-2,'#8e4332');
          // T613 退件修正：原本四扇 3px 尖拱窄窗夾扶壁（教堂味）→ 三扇 4px 寬圓拱閱覽高窗（中梃＋橫楣），拿掉扶壁線
          for(const c of [21,30,39]){T.bigArch('L',g,n,hv1,c/32,2/32,8,18,2,{frame:TR,glass:GL,hi:GH,mul:'#e8dcc2',tr:13});}
          // 東山牆：兩扇圓拱高窗＋山尖一扇小方窗（取代玫瑰窗）
          for(const c of [.36,.70])T.bigArch('R',g,n,hu1,c,2/32,8,18,2,{frame:TD,glass:GD,mul:'#8e8778',tr:13,lc:'#f3d68e'});
          const r=T.gableU(g,hu0+.03,hv0,hu1-hu0-.03,hv1-hv0,zW+1.5,rh-1.5,{rf:RF,wr:BK,ov:.03});
          fp(g,[P(hu1,hv0,zW),P(hu1,hv1,zW),P(hu1,(hv0+hv1)/2,zW+rh)],BK);brickR(g,hu1,hv0+.05,hv1-.05,zW,zW+rh-3);
          fp(g,[P(hu1,hv0,zW),P(hu1,hv1,zW),P(hu1,(hv0+hv1)/2,zW+rh)].map(p=>p),BK);
          {const vm=(hv0+hv1)/2;faceR(g,hu1,vm-2/32,vm+2/32,zW+2,zW+7,TD);faceR(g,hu1,vm-1.5/32,vm+1.5/32,zW+3,zW+6,GD);faceR(g,hu1,vm-.5/32,vm+.5/32,zW+3,zW+6,TD);}
          BL(g,P(hu1+.01,hv0-.02,zW-.5),P(hu1+.01,(hv0+hv1)/2,zW+rh+.5),TD);BL(g,P(hu1+.01,(hv0+hv1)/2,zW+rh+.5),P(hu1+.01,hv1+.02,zW-.5),TD);
          // 屋脊長條天窗（前坡）
          {const vm=(hv0+hv1)/2,zt=zW+rh,s=(zt-zW)/((hv1+.03)-vm),va=vm+.03,vb=vm+.13;
            fp(g,[P(.62,va,zt-s*(va-vm)),P(1.72,va,zt-s*(va-vm)),P(1.72,vb,zt-s*(vb-vm)),P(.62,vb,zt-s*(vb-vm))],'#dfe3e3');
            fp(g,[P(.64,va+.015,zt-s*(va+.015-vm)+.5),P(1.70,va+.015,zt-s*(va+.015-vm)+.5),P(1.70,vb-.015,zt-s*(vb-.015-vm)+.5),P(.64,vb-.015,zt-s*(vb-.015-vm)+.5)],'#6f9ab6');
            for(let t=.70;t<1.7;t+=.08)BL(g,P(t,va+.015,zt-s*(va+.015-vm)+.5),P(t,vb-.015,zt-s*(vb-.015-vm)+.5),'#c9d6dc');
            // T613 退件二修：夜間天窗原本照玻璃條紋逐格點亮，屋脊上一排 W 形鋸齒亮點 → 只亮天窗正中一條 1px 連續細線（偏暗的暖光）
            if(n){const vc=(va+vb)/2;BL(n,P(.66,vc,zt-s*(vc-vm)+.5),P(1.68,vc,zt-s*(vc-vm)+.5),'#d9b46e');}}
        });
        // 東端山牆閱覽翼（向前伸出）
        S.o(1.1,(g,n)=>{
          boxZ(g,wu0,wv0,wu1-wu0,wv1-wv0,0,zw,null,BK,BD);
          const um=(wu0+wu1)/2,zt=zw+wrh;
          fp(g,[P(wu0,wv1,zw),P(wu1,wv1,zw),P(um,wv1,zt)],BK);
          for(let z=5;z<zt-1;z+=2){const f=z<=zw?0:(z-zw)/wrh,a=wu0+(um-wu0)*f+1/32,b=wu1-(wu1-um)*f;if(b>a)BL(g,P(a,wv1,z),P(b,wv1,z),BJ);}
          brickR(g,wu1,wv0,wv1,3,zw);
          faceL(g,wv1,wu0,wu1,0,3,ST);faceR(g,wu1,wv0,wv1,0,3,SD);faceL(g,wv1,wu0,wu1,5,6,TR);faceR(g,wu1,wv0,wv1,5,6,TD);faceR(g,wu1,wv0,wv1,zw-2,zw,TD);
          // T613 退件修正：通高尖拱大窗（教堂味）→ 閱覽室大方窗：石框、石楣＋拱心石、兩道中梃、一道橫楣；下半窗格露出兩層書架（彩色書脊）
          {const wa=46/32,wb=56/32,BC=['#9a4a3c','#c49a52','#3f5f8c','#58784a','#d6cdb8','#6f5a82','#a8683e'];   // T613 接手：書脊壓低彩度（同 k14 v1）
            faceL(g,wv1,wa-1/32,wb+1/32,7,22,TR);faceL(g,wv1,wa,wb,8,21,GL);faceL(g,wv1,wa,wb,20,21,GH);
            for(const z of [8,11,14])faceL(g,wv1,wa,wb,z,z+1,'#5a3e2b');
            const books=(gg)=>{for(const z0 of [9,12])for(let i=0;i<10;i++)faceL(gg,wv1,wa+i/32,wa+(i+1)/32,z0,z0+2,BC[hsh(4126,(i+(z0>9?1:0))>>1,z0)*7|0]);};books(g);
            faceL(g,wv1,wa,wb,15,16,TR);
            for(const t of [49/32,52/32])faceL(g,wv1,t,t+1/32,8,21,'#e8dcc2');
            faceL(g,wv1,wa-1/32,wb+1/32,22,23,TD);faceL(g,wv1,um-1/32,um+1/32,22,24,TR);
            if(n){const GD_=g.getImageData(0,0,L.W,L.H).data;
              litMask(n,(tx)=>faceL(tx,wv1,wa,wb,16,21,'#fff'),(x,y)=>{const i=(y*L.W+x)<<2,h=(GD_[i]<<16)|(GD_[i+1]<<8)|GD_[i+2];return h===0x46698a||h===0x8fb2c9;},T.LIT);
              n.save();n.globalAlpha=.5;books(n);n.restore();}}
          for(const t of [32/32,40/32])T.bigArch('R',g,n,wu1,t,2/32,8,17,2,{frame:TD,glass:GD,mul:'#8e8778',tr:12,lc:'#f3d68e'});
          T.gableV(g,wu0,.66,wu1-wu0,wv1-.66,zw+1.5,wrh-1.5,{rf:RF,rs:RS,ov:.03});
          for(let k=0;k<2;k++){const a=P(wu0-.02,wv1+.01,zw-.5),m=P(um,wv1+.01,zt+1),b=P(wu1+.02,wv1+.01,zw-.5);BL(g,[a[0],a[1]-k],[m[0],m[1]-k],k?'#fbf6ea':TR);BL(g,[m[0],m[1]-k],[b[0],b[1]-k],k?TR:TD);}
        });
        // 鐘塔前五級大台階
        S.o(1.2,(g)=>{T.stepsV(g,tu0-.04,tu1+.06,tv1,4,2/32,1,{t:'#d8d1c3',l:'#c3bba9',r:'#9d9585'});});
        // 前院圓池＋雕像
        // T613 接手：圓池＋雕像沿視線往前挪（u、v 各 +.04～.06）、池縮小、石座 9→7px，立像頭頂不再蓋住大廳第一扇拱窗
        T.basin(S,.98,1.22,.17,1.3,{seed:4124});
        T.statue(S,.98,1.22,7,1.31,{s:.04});
        // 前緣草坪：樹、燈、長椅、花圃
        T.hedge(S,.12,1.46,.60,.035,2,1.5);T.hedge(S,1.50,1.46,.30,.035,2,1.52);   // 東段綠籬縮到東翼正前（讓出斜步道）
        // T613 退件二修：斜步道兩側各一段綠籬（沿步道方向的斜向方塊：+v 長面亮、朝 +u 的端面暗、頂面），步道西側一張長椅、東側一盞燈
        const hedgeDir=(ua,va,ub,vb,w,h,d)=>S.o(d,(g)=>{const Z=(u,v,z)=>P(u,v,z);
          fp(g,[Z(ua,va+w,0),Z(ub,vb+w,0),Z(ub,vb+w,h),Z(ua,va+w,h)],'#4f8a38');
          fp(g,[Z(ub,vb,0),Z(ub,vb+w,0),Z(ub,vb+w,h),Z(ub,vb,h)],'#3d6b2b');
          fp(g,[Z(ua,va,h),Z(ub,vb,h),Z(ub,vb+w,h),Z(ua,va+w,h)],'#5f9a45');});
        {const cv=u=>1.44+.5*(u-.90);
          hedgeDir(1.15,cv(1.15)+.10,1.50,cv(1.50)+.10,.035,2.5,1.5+cv(1.3)/10);
          hedgeDir(1.15,cv(1.15)-.135,1.50,cv(1.50)-.135,.035,2.5,1.5+cv(1.3)/10-.02);
          T.bench(S,1.58,cv(1.64)+.12,true,1.5+(cv(1.64)+.12)/10+.02);
          T.lamp(S,1.62,cv(1.62)-.13,12,1.5+(cv(1.62)-.13)/10+.05);}
        T.tree(S,.26,1.72,1.3,0,1.9);T.tree(S,1.92,1.72,1.2,1,1.96);   // 東樹移到東前角，樹冠在閱覽大窗下緣以下，不擋書架窗
        T.tree(S,.60,1.86,1.2,2,1.97);   // T613 接手：原 (1.56,1.74) 那棵正好疊在圓池＋雕像與東翼轉角前，挪到西前草坪（步道西側）
        // T613 退件修正：前院只留圓池＋雕像，燈只留步道口兩盞；館名改刻在塔門上方石帶（立牌、長椅、灌木、另兩盞燈拿掉）
        // T613 退件二修：原步道口東側那盞燈夾在兩條步道之間，拿掉（斜步道自己有一盞）；西側一盞保留
        for(const[u,v]of[[.76,1.92]])T.lamp(S,u,v,13,1.7+v/10);
        S.t(1.98,(g)=>{T.man(g,P(.40,1.08),'#3f6fa8',{book:'#e9d9a0'});T.man(g,P(.70,1.28),'#c9a13a');T.man(g,P(.96,1.62),'#b8483a',{run:1});T.man(g,P(.62,1.12),'#6a8f4a');T.man(g,P(1.40,1.69),'#7a5f96',{book:'#e9d9a0'});});
        return{};
      },
      ];
    });
  }catch(e){console.error('civ_e k41',e);errs.push('k41:'+(e&&e.stack||e));}

  window.__civ_e_errs=errs.length?errs:null;window.__civ_e_chk=chk;
});
