// T613 civ_c：k7 學校（1×1，72×112，錨 36,110）＋ k108 高中（2×2，136×150，錨 68,148）實驗線重畫。
// 分層合成（沿用 logi_b／infra_c2）：立體主體各自一層（二值化＋深色外框）；旗桿、欄杆、單槓、籃框、人走不描邊細線層；
// 地面（鋪面、跑道、球場線）直接畫在地面層，逐像素取樣不越出佔地菱形。夜光按層遮擋，只亮窗、門燈、路燈。
// 零亂數：只用 K.hsh。光從左：+v 面亮、+u 面暗；落影向右。
// flagAt＝自畫下段旗桿（8–12px，#8a8a86）的桿頂畫布座標；繪製端 SPR.flag 以此為桿腳往上接 20px 桿身＋旗面，疊在整張圖之上。
// 所以主桿一律放在地塊左右角（k7 東角、k108 西角），flagAt 上方 3px 是透明背景、旗面範圍內沒有本圖像素；桿色經 poleFix 預補償 T573 邊緣光。
(window.__variants574=window.__variants574||[]).push(function civ_c(A){
  // 注入測試時本批次排在內嵌 b01…之前（b04 會蓋掉 108_1_1/2）⇒ 不是最後一棒就把本體排到隊尾再跑（同 bay_a）；
  // 正式整合時本檔接在最後，直接執行。runVariants574 以 for…of 走陣列，隊尾新增的會被執行到。
  const QL=window.__variants574||[];
  if(!civ_c.__late&&QL.indexOf(civ_c)>=0&&QL.indexOf(civ_c)<QL.length-1){civ_c.__late=1;QL.push(function civ_c_late(A2){civ_c(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{7:[1,2,0]}；定稿必須是 {}
  const errs=[];

  // ================= 共用工具（沿用 logi_b 的像素精準圖元）=================
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
    // 高度場（弧形大跨度屋頂）：逐斜列由後往前；背光面（gu+gv≥32）不畫
    const terrain=(g,u0,v0,u1,v1,st,zf,cf)=>{const nu=rnd((u1-u0)/st),nv=rnd((v1-v0)/st),Z=[];
      for(let i=0;i<=nu;i++){const row=new Float32Array(nv+1);for(let j=0;j<=nv;j++)row[j]=zf(u0+i*st,v0+j*st);Z.push(row);}
      for(let s=0;s<=nu+nv-2;s++)for(let i=Math.max(0,s-nv+1);i<=Math.min(nu-1,s);i++){const j=s-i,u=u0+i*st,v=v0+j*st;
        const a=Z[i][j],b=Z[i+1][j],c=Z[i+1][j+1],d=Z[i][j+1];const gu=(b+c-a-d)/(2*st),gv=(d+c-a-b)/(2*st);
        const col=cf(u+st/2,v+st/2,(a+b+c+d)/4,gu,gv,i,j);if(col)fp(g,[P(u,v,a),P(u+st,v,b),P(u+st,v+st,c),P(u,v+st,d)],col);}};
    // 逐像素地面著色：只取像素中心落在佔地菱形內的像素（保證不越出下緣）
    const paint=(g,fn)=>{for(let y=0;y<H;y++){let run=null,x0=0;for(let x=0;x<=W;x++){let c=null;
      if(x<W){const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;if(u>0&&v>0&&u<SZ&&v<SZ)c=fn(u,v,x,y)||null;}
      if(c!==run){if(run){g.fillStyle=run;g.fillRect(x0,y,x-x0,1);}run=c;x0=x;}}}};
    const MATS={
      g:{t:['#78a256','#739c51','#7da85b'],s:.125,p:.7},                       // 草
      c:{t:['#cdc9be','#c8c4b9','#d2cec3'],j:'#bbb7ac',js:.25,s:.125,p:.65},   // 混凝土步道
      a:{t:['#6f6d69','#6c6a66','#72706b'],s:.125,p:.75},                      // 瀝青
      k:{t:['#cdbf9c','#c7b995','#d2c5a3'],s:.0625,p:.65},                     // 碎石
      st:{t:['#c2bba9','#bbb4a2','#c8c1b0'],j:'#aaa391',js:.125,s:.125,p:.6},  // 石板
      rb:{t:['#4178a6','#3e74a1','#447caa'],s:.125,p:.8},                      // 藍色 PU
      gc:{t:['#4f8d62','#4c895f','#529266'],s:.125,p:.85},                     // 綠色球場
      rr:{t:['#b95a41','#b5563e','#bd5e45'],s:.125,p:.85},                     // 紅色 PU
      sd:{t:['#dcc590','#d6bf8a','#e1ca96'],s:.0625,p:.6},                     // 沙坑
      bp:{t:['#bf9277','#b98c72','#c4977c'],j:'#ab7f66',js:.125,s:.125,p:.6},  // 磚鋪面
      gr:{t:['#6d9a4e','#69954b','#72a053'],s:.125,p:.75},                     // 深一階草（場內）
      pa:{t:['#86847e','#83817b','#8a8882'],s:.125,p:.8},                      // 操場淺瀝青
      lp:{t:['#e2dccb','#dcd6c5','#e7e1d1'],s:.125,p:.72},                     // 小學操場淺色鋪面（襯出彩色跳格子）
    };
    const pave=(g,m,u0,v0,du,dv,seed,js)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      const J=js||M.js;if(M.j&&J){for(let a=u0+J;a<u0+du-1e-6;a+=J)BL(g,P(a,v0+.01),P(a,v0+dv-.01),M.j);for(let b=v0+J;b<v0+dv-1e-6;b+=J)BL(g,P(u0+.01,b),P(u0+du-.01,b),M.j);}};
    // 夜光只落在白天畫出的玻璃像素上：draw(tx) 在暫存畫布畫出玻璃形狀，keep(x,y) 決定哪些像素亮（中梃欄、暗格不亮）
    const litMask=(n,draw,keep,col)=>{const[tc,tx]=A.cv(W,H);draw(tx);const d=tx.getImageData(0,0,W,H).data;n.fillStyle=col;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[((y*W+x)<<2)+3]>0&&keep(x,y))n.fillRect(x,y,1,1);};
    return Object.assign({},K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,lineU,lineV,ell,scene,shadow,terrain,paint,pave,litMask});
  };

  // ================= 學校元件 =================
  const KIT=(L)=>{
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ell,SZ}=L;
    const LIT='#ffe3a0';
    // 窗列：+v 面（亮）／+u 面（暗）。cnt 扇、寬 w 像素、高 h；o.frame 窗框（含窗台）、o.hi 頂列反光、o.arch 圓拱角、o.mul 中梃
    const winL=(g,n,v,ua,ub,cnt,z,w,h,glass,o={})=>{for(let i=0;i<cnt;i++){const t=ua+(ub-ua)*(i+.5)/cnt,a=t-w/64,b=t+w/64;
      if(o.frame)faceL(g,v,a-1/32,b+1/32,z-1,z+h+(o.lintel?1:0),o.frame);else if(o.sill)faceL(g,v,a-1/32,b+1/32,z-1,z,o.sill);
      faceL(g,v,a,b,z,z+h,glass);if(o.hi)faceL(g,v,a,b,z+h-1,z+h,o.hi);
      if(o.tr!=null)faceL(g,v,a,b,z+o.tr,z+o.tr+1,o.trc||o.frame);
      if(o.mul)faceL(g,v,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.arch){faceL(g,v,a,a+1/32,z+h-1,z+h,o.arch);faceL(g,v,b-1/32,b,z+h-1,z+h,o.arch);}
      if(n&&hsh(o.seed||7,i,rnd(z*3+v*50))<(o.lit!=null?o.lit:.55))faceL(n,v,a,b-(o.ni?1/32:0),z,z+h-(o.arch?1:0),o.lc||LIT);}};   // o.ni：窗距緊時夜光右緣退 1px，露出下一扇的窗框
    const winR=(g,n,u,va,vb,cnt,z,w,h,glass,o={})=>{for(let i=0;i<cnt;i++){const t=va+(vb-va)*(i+.5)/cnt,a=t-w/64,b=t+w/64;
      if(o.frame)faceR(g,u,a-1/32,b+1/32,z-1,z+h+(o.lintel?1:0),o.frame);else if(o.sill)faceR(g,u,a-1/32,b+1/32,z-1,z,o.sill);
      faceR(g,u,a,b,z,z+h,glass);if(o.hi)faceR(g,u,a,b,z+h-1,z+h,o.hi);
      if(o.tr!=null)faceR(g,u,a,b,z+o.tr,z+o.tr+1,o.trc||o.frame);
      if(o.mul)faceR(g,u,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.arch){faceR(g,u,a,a+1/32,z+h-1,z+h,o.arch);faceR(g,u,b-1/32,b,z+h-1,z+h,o.arch);}
      if(n&&hsh(o.seed||9,i,rnd(z*3+u*50))<(o.lit!=null?o.lit:.5))faceR(n,u,a+(o.ni?1/32:0),b,z,z+h-(o.arch?1:0),o.lc||'#f3d68e');}};
    // 雙坡屋頂（屋脊沿 u）：前坡朝 +v 受光；+u 端山牆三角；背坡只在坡度低到朝向鏡頭時才畫
    const gableU=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,vm=(v0+v1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf;
      if(zt-ze<32*(vm-v0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt),P(u0-ov,vm,zt)],o.rb||SH(rf,-24));
      if(o.wr)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zt)],o.wr);
      fp(g,[P(u1-.005,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt+.6),P(u1-.005,vm,zt+.6)],o.vb||SH(rf,-38));   // 後坡封簷板
      fp(g,[P(u0-ov,vm,zt),P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),P(u0-ov,v1+ov,ze)],rf);
      const nl=Math.max(2,Math.floor(((v1+ov-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(v1+ov-vm)*f,z=zt-(zt-ze)*f;BL(g,P(u0-ov+.01,v,z),P(u1+ov-.01,v,z),o.rl||SH(rf,-13));}
      BL(g,P(u0-ov,vm,zt),P(u1+ov,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(u0-ov,v1+ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rf,-32));
      BL(g,P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),o.verge||SH(rf,14));};
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
      return{vm,zt,r0,r1,b1,ze};};
    // 雙坡屋頂（屋脊沿 v）：+v 端山牆三角受光；+u 坡暗；-u 坡只在朝向鏡頭時才畫
    const gableV=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,um=(u0+u1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      if(zt-ze<32*(um-u0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(um,v0-ov,zt),P(um,v1+ov,zt),P(u0-ov,v1+ov,ze)],rf);
      if(o.wl)fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zt)],o.wl);
      fp(g,[P(um,v0-ov,zt),P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),P(um,v1+ov,zt)],rs);
      const nl=Math.max(2,Math.floor(((u1+ov-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(u1+ov-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,v0-ov+.01,z),P(u,v1+ov-.01,z),o.rl||SH(rs,-10));}
      BL(g,P(um,v0-ov,zt),P(um,v1+ov,zt),o.ridge||SH(rf,22));
      BL(g,P(u0-ov,v1+ov,ze),P(um,v1+ov,zt),o.verge||SH(rf,12));BL(g,P(um,v1+ov,zt),P(u1+ov,v1+ov,ze),SH(rs,-16));
      BL(g,P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rs,-24));};
    // 四坡屋頂（屋脊沿 v）
    const hipV=(g,u0,v0,du,dv,h,rh,o)=>{const ov=o.ov!=null?o.ov:.03,a0=u0-ov,a1=u0+du+ov,b0=v0-ov,b1=v0+dv+ov,um=(a0+a1)/2,hr=Math.min((a1-a0)/2,(b1-b0)/2),ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      const r0=b0+hr,r1=b1-hr;
      if(zt-ze<32*hr){fp(g,[P(a0,b0,ze),P(a0,b1,ze),P(um,r1,zt),P(um,r0,zt)],SH(rf,-6));fp(g,[P(a0,b0,ze),P(a1,b0,ze),P(um,r0,zt)],SH(rf,-22));}
      fp(g,[P(a1,b0,ze),P(a1,b1,ze),P(um,r1,zt),P(um,r0,zt)],rs);
      fp(g,[P(a0,b1,ze),P(a1,b1,ze),P(um,r1,zt)],rf);
      const nl=Math.max(2,Math.floor(((a1-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(a1-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,r0-hr*f+.02,z),P(u,r1+hr*f-.02,z),SH(rs,-10));}
      const nf=Math.max(2,Math.floor(((b1-r1)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nf;k++){const f=k/nf,v=r1+(b1-r1)*f,z=zt-(zt-ze)*f;BL(g,P(um-hr*f+.02,v,z),P(um+hr*f-.02,v,z),o.rl||SH(rf,-13));}
      BL(g,P(um,r0,zt),P(um,r1,zt),o.ridge||SH(rf,22));BL(g,P(um,r1,zt),P(a1,b1,ze),o.hip||SH(rf,16));BL(g,P(um,r1,zt),P(a0,b1,ze),o.hip||SH(rf,16));
      BL(g,P(a0,b1,ze),P(a1,b1,ze),o.fascia||SH(rf,-32));BL(g,P(a1,b0,ze),P(a1,b1,ze),SH(rs,-22));};
    // 攢尖（方錐）
    const pyramid=(g,uc,vc,s,z,rh,rf,rs)=>{const a0=uc-s/2,a1=uc+s/2,b0=vc-s/2,b1=vc+s/2,ap=P(uc,vc,z+rh);
      if(rh<32*s/2){fp(g,[P(a0,b0,z),P(a1,b0,z),ap],SH(rf,-18));fp(g,[P(a0,b0,z),P(a0,b1,z),ap],SH(rf,-8));}
      fp(g,[P(a1,b0,z),P(a1,b1,z),ap],rs);fp(g,[P(a0,b1,z),P(a1,b1,z),ap],rf);BL(g,ap,P(a1,b1,z),SH(rf,22));};
    // 平頂＋女兒牆（壓頂亮邊、內側陰影線）
    const flatTop=(g,u0,v0,du,dv,h,roof,o={})=>{const e=o.e||.03;flat(g,u0,v0,du,dv,o.cap||SH(roof,40),h);flat(g,u0+e,v0+e,du-2*e,dv-2*e,roof,h);
      BL(g,P(u0+e,v0+e,h),P(u0+du-e,v0+e,h),SH(roof,-24));BL(g,P(u0+e,v0+e,h),P(u0+e,v0+dv-e,h),SH(roof,-16));};
    // 旗桿下段：台座＋兩像素桿；回傳 flagAt＝本段桿頂（第一列）畫布座標。
    // 繪製端 SPR.flag（14×22、錨 7,22）以 flagAt 為桿腳往上接 20px 桿身（x-1..x、flagAt.y-20..flagAt.y-1）與往右飄的旗面，疊在整張圖之上不受遮擋；
    // 所以這裡只畫 8–12px 下段、顏色與繪製端桿身同為 #8a8a86 接成一根，桿頂不加反光頭；主桿放在地塊左右角，flagAt 上方 3px 必須是透明背景。
    const flag=(S,u,v,hp,d)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      if(hp<8||hp>12)throw new Error('旗桿下段須 8–12px');
      S.o(d-.0005,(g)=>{boxZ(g,u-.035,v-.035,.07,.07,0,2,'#dcd8cd','#cbc6ba','#a8a397');});
      S.t(d,(g)=>{RC(g,x-1,y-hp,2,hp-1,'#8a8a86');});
      return[x,y-hp];};
    // 人：p＝腳底畫面座標；small＝兒童（4px），否則青少年（6px）
    const kid=(g,p,shirt,o={})=>{const x=rnd(p[0]),y=rnd(p[1]),lg=o.leg||'#3a3f4d',sk=o.skin||'#e8bf97',hr=o.hair||'#3a2c24';
      if(o.small){if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-1,1,1,lg);}else RC(g,x,y-1,2,1,lg);RC(g,x,y-3,2,2,shirt);RC(g,x,y-4,2,1,sk);RC(g,x,y-5,2,1,hr);
        if(o.arm)RC(g,o.arm>0?x+2:x-1,y-5,1,2,sk);return;}
      if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-2,1,1,lg);RC(g,x,y-2,1,1,lg);}else{RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SH(lg,-12));}
      RC(g,x,y-4,2,2,shirt);RC(g,x+1,y-4,1,2,SH(shirt,-26));RC(g,x,y-5,2,1,sk);RC(g,x,y-6,2,1,hr);};
    // 跳格子（沿 u 或 v）：1-1-2-1-2-1
    const hop=(g,u0,v0,dir,c,c2,s=.06)=>{const pat=[1,1,2,1,2,1];let t=0,k=0;
      const cell=(a,b)=>{flat(g,a+.007,b+.007,s-.014,s-.014,(k++%2)?c2:c);};
      for(const m of pat){if(m===1){dir==='u'?cell(u0+t,v0+s/2):cell(u0+s/2,v0+t);}else for(let q=0;q<2;q++){dir==='u'?cell(u0+t,v0+q*s):cell(u0+q*s,v0+t);}t+=s;}};
    // 單槓：沿 u 排，hs＝各槓高度
    const bars=(S,u0,v,du,hs,d,o={})=>S.t(d,(g)=>{const n=hs.length,bc=o.bc||'#e2e5e7',pc=o.pc||'#7e878d';
      for(let i=0;i<n;i++)BL(g,P(u0+du*i/n,v,hs[i]),P(u0+du*(i+1)/n,v,hs[i]),bc);
      for(let i=0;i<=n;i++){const p=P(u0+du*i/n,v),hh=Math.max(hs[Math.max(0,i-1)],hs[Math.min(n-1,i)]);RC(g,p[0],p[1]-hh,1,hh+1,pc);if(o.foot)RC(g,p[0]-1,p[1],3,1,o.foot);}});
    // 籃球架：桿在 (u,v)，籃板朝 (du,dv) 方向伸出
    const hoop=(S,u,v,du,dv,d,big)=>S.t(d,(g)=>{const b=P(u,v),x=rnd(b[0]),y=rnd(b[1]),hh=big?13:10;
      RC(g,x,y-hh,1,hh+1,'#4f565c');RC(g,x+1,y-hh+1,1,hh,'#343a3f');
      const q=P(u+du,v+dv,hh-1),bx=rnd(q[0]),by=rnd(q[1]);BL(g,[x,y-hh+1],[bx,by+1],'#4f565c');
      RC(g,bx-2,by-3,4,4,'#f3f3ee');RC(g,bx-2,by-3,4,1,'#c9463a');RC(g,bx-1,by-1,2,1,'#c9463a');RC(g,bx-1,by+1,2,1,'#e0702a');});
    // 腳踏車棚（沿 u 長向）：背板＋遮雨板＋前柱＋車
    const bikeShed=(S,u0,v0,du,dv,d,o={})=>{const zc=o.z||7,col=o.col||'#5c8fb0';
      S.t(d-.001,(g)=>{const n=Math.max(2,Math.floor(du*32/3));for(let i=0;i<n;i++){const p=P(u0+du*(i+.5)/n,v0+dv*.55),x=rnd(p[0]),y=rnd(p[1]),c=['#c24a3a','#2f5f96','#d9d9d4','#3f7f4a','#e0a83a'][hsh(o.seed||3,i,1)*5|0];
        RC(g,x-1,y-1,1,1,'#2a2d31');RC(g,x+1,y,1,1,'#2a2d31');RC(g,x-1,y-2,2,1,c);RC(g,x+1,y-1,1,1,c);RC(g,x,y-3,1,1,'#2a2d31');}});
      S.o(d,(g)=>{boxZ(g,u0,v0,du,.02,0,zc,null,'#9aa4aa','#7d868c');
        for(const t of[u0+.01,u0+du-.03]){boxZ(g,t,v0+dv-.03,.02,.02,0,zc,null,'#8e979c','#6b7378');}
        boxZ(g,u0-.01,v0-.01,du+.02,dv+.02,zc,1,col,SH(col,-18),SH(col,-40));
        BL(g,P(u0-.01,v0+dv+.01,zc+1),P(u0+du+.01,v0+dv+.01,zc+1),SH(col,30));});};
    const bench=(S,u,v,alongU,d)=>S.o(d,(g)=>{if(alongU)boxZ(g,u,v,.12,.035,1,1,'#b0845a','#9a6f48','#7a5638');else boxZ(g,u,v,.035,.12,1,1,'#b0845a','#9a6f48','#7a5638');});
    const lamp=(S,u,v,h,d)=>S.t(d,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,3,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    // 灌木：實心深綠球（比草地深一大階，右下暗月牙、左上亮面＋高光），和外框連成一整團，不再像草地上的空心圈
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#3d6b2b');ell(g,x-1,y-r+1,Math.max(1,r-1),Math.max(1,r-1),'#4f8a38');ell(g,x-1,y-r,Math.max(1,r-2),Math.max(1,r-2),'#6aa347');RC(g,x-2,y-r-1,2,1,'#9ccb6a');});
    // 圍籬（細線層）：a→b（uv），高 h，gap＝[t0,t1] 留門
    const fence=(S,a,b,o={})=>S.t(o.d!=null?o.d:50,(g)=>{const h=o.h||4,pc=o.pc||'#58786a',rc=o.rc||'#93b3a0';
      const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],pa=P(a[0],a[1]),pb=P(b[0],b[1]),Lp=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,rnd(Lp/(o.step||6))),gp=o.gap;
      const seg=(t0,t1)=>{const A0=at(t0),A1=at(t1);BL(g,P(A0[0],A0[1],h),P(A1[0],A1[1],h),rc);if(o.mid)BL(g,P(A0[0],A0[1],o.mid),P(A1[0],A1[1],o.mid),rc);};
      if(gp){seg(0,gp[0]);seg(gp[1],1);}else seg(0,1);
      const post=t=>{const q=at(t),p=P(q[0],q[1]);RC(g,p[0],p[1]-h,1,h+1,pc);};
      for(let i=0;i<=n;i++){const t=i/n;if(gp&&t>gp[0]-1e-6&&t<gp[1]+1e-6)continue;post(t);}
      if(gp){post(gp[0]);if(gp[1]<.999)post(gp[1]);}});
    // 跑道（體育場形）：c1、c2＝兩端半圓圓心；逐像素判斷
    const segDist=(u,v,c1,c2)=>{const du=c2[0]-c1[0],dv=c2[1]-c1[1],L2=du*du+dv*dv;let t=L2?((u-c1[0])*du+(v-c1[1])*dv)/L2:0;t=Math.max(0,Math.min(1,t));return Math.hypot(u-c1[0]-du*t,v-c1[1]-dv*t);};
    const trace=(g,c1,c2,r,col,clip)=>{const du=c2[0]-c1[0],dv=c2[1]-c1[1],Ls=Math.hypot(du,dv),tu=Ls?du/Ls:1,tv=Ls?dv/Ls:0,nu=-tv,nv=tu,st=.006;const pts=[];
      for(const s of[1,-1])for(let t=0;t<=Ls;t+=st)pts.push([c1[0]+tu*t+nu*r*s,c1[1]+tv*t+nv*r*s]);
      for(let a=-Math.PI/2;a<=Math.PI/2;a+=st/r){pts.push([c1[0]-tu*r*Math.cos(a)+nu*r*Math.sin(a),c1[1]-tv*r*Math.cos(a)+nv*r*Math.sin(a)]);pts.push([c2[0]+tu*r*Math.cos(a)+nu*r*Math.sin(a),c2[1]+tv*r*Math.cos(a)+nv*r*Math.sin(a)]);}
      g.fillStyle=col;for(const q of pts){if(clip&&!clip(q[0],q[1]))continue;const p=P(q[0],q[1]);g.fillRect(Math.floor(p[0]),Math.floor(p[1]),1,1);}};
    return {winL,winR,gableU,gableV,hipU,hipV,pyramid,flatTop,flag,kid,hop,bars,hoop,bikeShed,bench,lamp,tree,bush,fence,segDist,trace,LIT};
  };

  // 旗桿色預補償：開機時 applyT573Silhouette 會把所有 SPR.bld 的邊緣像素調亮／壓暗（頂緣×1.2+10、左緣×1.1+10〔藍色 +8〕、右緣×0.86、底緣×0.7），
  // 而繪製端的上段桿身（SPR.flag）不經這道處理、是純 #8a8a86。這裡按最終合成圖逐像素反推，讓下段桿身處理後也落在 #8a8a86，兩段無接縫。
  const poleFix=(c,fa)=>{if(window.__noSilhouette573)return;const W=c.width,H=c.height,g=c.getContext('2d'),D=g.getImageData(0,0,W,H),d=D.data,T=[138,138,134];
    const Aa=(x,y)=>(x<0||y<0||x>=W||y>=H)?0:d[((y*W+x)<<2)+3],fix=[];
    for(let x=fa[0]-1;x<=fa[0];x++)for(let y=fa[1];y<H;y++){const i=(y*W+x)<<2;if(!(d[i]===138&&d[i+1]===138&&d[i+2]===134&&d[i+3]===255))break;
      const up=Aa(x,y-1)>=40,dn=Aa(x,y+1)>=40,lf=Aa(x-1,y)>=40,rt=Aa(x+1,y)>=40;if(up&&dn&&lf&&rt)continue;
      let m=1;if(!up)m=1.2;else if(!lf)m=1.1;if(!dn)m=Math.min(m,.7);else if(!rt)m=Math.min(m,.86);if(m!==1)fix.push([i,m]);}
    for(const[i,m]of fix)for(let q=0;q<3;q++)d[i+q]=Math.max(0,Math.min(255,Math.round((T[q]-(m>1?(q<2?10:8):0))/m)));
    g.putImageData(D,0,0);};
  const build=(k,def,layoutsOf)=>{
    const old=B[k+'_1_0'];
    const W=(old&&old.w)||def.W,H=(old&&old.h)||def.H,AX=(old&&old.ax!=null)?old.ax:def.AX,AY=(old&&old.ay!=null)?old.ay:def.AY;
    const K=A.iso575(W,H,AX,AY,def.SZ),L=LIB(K),T=KIT(L),lay=layoutsOf(L,T),order=DEV[k]||null,out=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;
      try{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
        const o=lay[v](g,ng,S)||{};S.run(g,ng);if(o.flagAt)poleFix(c,o.flagAt);
        const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:o.smoke||[]};if(o.flagAt)spr.flagAt=o.flagAt;
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('civ_c k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];
  };

  // ================= k7 學校（1×1）=================
  try{
    build(7,{W:72,H:112,AX:36,AY:110,SZ:1},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV}=L;
      const GL='#46698a',GD='#304b62',GH='#8fb2c9';
      return [
      // ---------- v0 磚造 L 形兩層校舍沿兩條後緣展開（北翼沿 u 縮到 .72、西翼沿 v，緩坡石板瓦＋谷線、整排白框大窗）＋內轉角矮鐘樓（入口、開敞鐘亭＋低攢尖，不做尖塔）；前方淺色操場只放兩件：右區一整條相接的黃橘跳格子、左區橡膠墊上一組單槓；東角升旗小廣場，南角校門＝兩根淺磚門柱＋淺色石楣 ----------
      (g,ng,S)=>{
        const h=21,BK='#b95d43',BD='#7a3829',TR='#efe4cc',TD='#b3a487',ST='#a09a8f',SD='#6c675f',RF='#6f7784',RS='#4c535e';
        const e=.05,w=.24,ov=.03,rh=5,ze=h-1.5,zt=h+rh;   // 兩翼：北翼 u∈[e,.72] v∈[e,e+w]；西翼 u∈[e,e+w] v∈[e+w,.95]；緩坡（rh 7→5）不再像教堂尖山牆
        const t0=.26,t1=.40;                               // 內轉角一層門廊 u,v∈[t0,t1]；鐘亭在兩條屋脊交會處
        pave(g,'g',0,0,1,1,7001);
        pave(g,'lp',.30,.30,.64,.64,7002);
        // T613 r7（退件：紅藍跳格子與單槓散成碎點）：操場只放兩件——右區（向陽）一整條相接的跳格子（沿 u、格與格不留縫、黃橘交替、外圍一圈白色粉筆框），
        // 左區一組單槓立在一塊綠色橡膠墊上；南角校門前一小塊石板門前坪；操場中央留空給校門→門廊的動線
        paint(g,(u,v,x,y)=>(u+v>1.73&&u+v<1.93&&Math.abs(u-v)<.14)?(y%3===0?'#b2ab98':'#c7c0ad'):null);
        {const s=.074,us=.49,vc=.395,cells=[];let t=0;for(const m of[1,1,2,1,2,1]){if(m===1)cells.push([us+t,vc+s/2]);else{cells.push([us+t,vc]);cells.push([us+t,vc+s]);}t+=s;}
          for(const[a,b]of cells)flat(g,a-.01,b-.01,s+.02,s+.02,'#fbf7ec');
          cells.forEach(([a,b],i)=>flat(g,a,b,s,s,i%2?'#e0603a':'#f0c23a'));}
        pave(g,'gc',.37,.55,.12,.32,7005);
        // 東角草坪＋升旗小廣場（北翼縮到 u=.72，把東角讓給旗桿：旗桿頂上方是透明背景）
        pave(g,'c',.80,.04,.16,.16,7003,.125);
        shadow(g,[['b',e,e,.72-e,w,26],['b',e,e+w,w,.90-w,26],['b',t0,t0,t1-t0,t1-t0,13]]);
        // 北翼（沿 u）
        S.o(1,(g,n)=>{const u0=e,u1=.72,v0=e,v1=e+w;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,BK,BD);
          faceL(g,v1,u0,u1,0,2,ST);faceR(g,u1,v0,v1,0,2,SD);
          faceL(g,v1,u0,u1,10,11,TR);faceR(g,u1,v0,v1,10,11,TD);faceL(g,v1,u0,u1,h-1.5,h,TR);faceR(g,u1,v0,v1,h-1.5,h,TD);
          T.winL(g,n,v1,t1+.02,u1-.02,3,3,3,5,GL,{frame:TR,hi:GH,seed:7011,tr:3,trc:TR,ni:1});
          T.winL(g,n,v1,.31,u1-.02,4,13,3,5,GL,{frame:TR,hi:GH,seed:7012,tr:3,trc:TR,ni:1});
          T.winR(g,n,u1,v0+.02,v1-.02,1,3,3,5,GD,{frame:TD,seed:7013,tr:3,trc:TD,ni:1});
          T.winR(g,n,u1,v0+.02,v1-.02,1,13,3,5,GD,{frame:TD,seed:7014,tr:3,trc:TD,ni:1});
          T.gableU(g,u0,v0,u1-u0,v1-v0,h,rh,{rf:RF,wr:BD,ov});
          const oc=P(u1,(v0+v1)/2,h+2.5);RC(g,oc[0]-1,oc[1]-2,2,2,TD);});
        // 西翼（沿 v，+u 坡與北翼前坡交於谷線）
        S.o(1.01,(g,n)=>{const u0=e,u1=e+w,v0=e+w,v1=.95,um=(u0+u1)/2;
          boxZ(g,u0,v0-.02,u1-u0,v1-v0+.02,0,h,null,BK,BD);
          faceL(g,v1,u0,u1,0,2,ST);faceR(g,u1,v0,v1,0,2,SD);
          faceL(g,v1,u0,u1,10,11,TR);faceR(g,u1,v0,v1,10,11,TD);faceL(g,v1,u0,u1,h-1.5,h,TR);faceR(g,u1,v0,v1,h-1.5,h,TD);
          T.winR(g,n,u1,t1+.02,v1-.02,4,3,3,5,GD,{frame:TD,seed:7021,tr:3,trc:TD,ni:1});
          T.winR(g,n,u1,.31,v1-.02,5,13,3,5,GD,{frame:TD,seed:7022,tr:3,trc:TD,ni:1});
          T.winL(g,n,v1,u0+.02,u1-.02,1,3,3,5,GL,{frame:TR,hi:GH,seed:7023,tr:3,trc:TR,ni:1});
          T.winL(g,n,v1,u0+.02,u1-.02,1,13,3,5,GL,{frame:TR,hi:GH,seed:7024,tr:3,trc:TR,ni:1});
          fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zt)],BK);
          const ua=u1+ov;fp(g,[P(um,um,zt),P(um,v1+ov,zt),P(ua,v1+ov,ze),P(ua,ua,ze)],RS);
          const nl=Math.floor(((ua-um)*16+zt-ze)/2.6);for(let k=1;k<nl;k++){const f=k/nl,u=um+(ua-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,u+.01,z),P(u,v1+ov-.01,z),SH(RS,-10));}
          BL(g,P(um,um,zt),P(ua,ua,ze),SH(RF,-20));BL(g,P(um,um+.02,zt),P(um,v1+ov,zt),SH(RF,22));
          BL(g,P(u0-ov,v1+ov,ze),P(um,v1+ov,zt),SH(RF,12));BL(g,P(um,v1+ov,zt),P(ua,v1+ov,ze),SH(RS,-16));BL(g,P(ua,ua,ze),P(ua,v1+ov,ze),SH(RS,-24));
          const oc=P(um,v1,h+2.5);RC(g,oc[0]-1,oc[1]-2,2,2,TR);});
        // 屋脊交會處的白色開敞小鐘亭（校舍式 bell cupola：底座、四角白柱、深色開口裡一口銅鐘、壓頂板＋低攢尖），取代原本從地面拔起的鐘樓
        S.o(1.015,(g)=>{const c=e+w/2,s=.13,a0=c-s/2,a1=c+s/2,zb=zt-2.5,zc=zt+5;
          boxZ(g,a0,a0,s,s,zb,2.5,TR,TR,TD);
          faceL(g,a1,a0,a1,zb+2.5,zc,'#2b2622');faceR(g,a1,a0,a1,zb+2.5,zc,'#201c19');
          faceL(g,a1,a0,a0+.03,zb+2.5,zc,TR);faceL(g,a1,a1-.03,a1,zb+2.5,zc,TR);faceR(g,a1,a0,a0+.03,zb+2.5,zc,TD);
          const bp=P(c+.02,a1,zb+4.5);RC(g,bp[0]-1,bp[1]-2,2,2,'#dcaa3e');RC(g,bp[0]-1,bp[1]-3,2,1,'#f0cf6a');
          boxZ(g,a0-.02,a0-.02,s+.04,s+.04,zc,1,TR,TR,TD);
          T.pyramid(g,c,c,s+.06,zc+1,3,RF,RS);});
        // 內轉角入口門廊（一層奶油色門廊、玻璃門、綠底金字校名牌、四坡小屋頂、門燈）
        S.o(1.02,(g,n)=>{const u0=t0,u1=t1,v0=t0,v1=t1,hp=10,um=(u0+u1)/2;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,hp,null,TR,TD);
          faceL(g,v1,u0,u1,0,1.5,ST);faceR(g,u1,v0,v1,0,1.5,SD);
          const dm=um;faceL(g,v1,dm-.04,dm+.04,0,6.5,'#5d3c2b');faceL(g,v1,dm-.04,dm+.04,4.5,6.5,'#9cc0d6');faceL(g,v1,dm-.004,dm+.004,0,4.5,'#3a261b');
          faceL(g,v1,u0+.01,u1-.01,7,9.5,'#2f6d52');for(let t=u0+.03;t<u1-.03;t+=.045)faceL(g,v1,t,t+1/32,7.8,8.8,'#f1dc8a');
          faceR(g,u1,um-.035,um+.035,2.5,6.5,GD);faceR(g,u1,um-.035,um+.035,6.5,7,TD);
          T.pyramid(g,um,um,u1-u0+.05,hp,4,RF,RS);
          const lp=P(dm+.06,v1,6);RC(g,lp[0],lp[1]-1,1,2,'#f3e2a8');if(n)RC(n,lp[0]-1,lp[1]-2,3,3,'#ffe6a0');
          if(n){faceL(n,v1,dm-.04,dm+.04,4.5,6.5,'#ffe3a0');if(hsh(7032,1,1)<.8)faceR(n,u1,um-.035,um+.035,2.5,6.5,'#f3d68e');}});
        S.o(1.03,(g)=>{boxZ(g,.28,.40,.10,.035,0,1,'#dcd7cb','#cbc6ba','#a39e93');});
        const fa=T.flag(S,.89,.11,10,1.0);
        // 一組單槓（三槓高低排、深灰柱紅槓，沿 v 與西翼平行），整組立在左區的綠色橡膠墊上
        S.t(1.2,(g)=>{const hs=[10,8,6],nb=3,uu=.43,va=.58,dv=.26,bc='#d8483a',pc='#474f57';
          for(let i=0;i<nb;i++)BL(g,P(uu,va+dv*i/nb,hs[i]),P(uu,va+dv*(i+1)/nb,hs[i]),bc);
          for(let i=0;i<=nb;i++){const p=P(uu,va+dv*i/nb),hh=Math.max(hs[Math.max(0,i-1)],hs[Math.min(nb-1,i)]);RC(g,p[0],p[1]-hh,1,hh+1,pc);}});
        S.t(1.7,(g)=>{T.kid(g,P(.46,.66),'#d8483a',{small:1,arm:-1});T.kid(g,P(.62,.64),'#3f78c0',{small:1,run:1});});
        T.bush(S,.92,.34,2);T.bush(S,.34,.90,2);
        // T613 r7（退件：黑白一團）：校門＝兩根淺磚門柱（淺色石帽）＋一道橫跨的淺色石楣，門洞看得穿，不再有深色門扇；柱高 5px，不擋操場
        S.o(1.95,(g)=>{const BA=[.84,.94],BB=[.94,.84],zp=5,q=.02;
          for(const[u,v]of[BA,BB])boxZ(g,u-q,v-q,2*q,2*q,0,zp,null,'#e2a98a','#b98062');
          const a=P(BA[0]-q,BA[1]+q,zp),b=P(BB[0]+q,BB[1]-q,zp),x0=rnd(a[0]),x1=rnd(b[0]),y=rnd(Math.min(a[1],b[1]));
          RC(g,x0-1,y-2,x1-x0+2,1,'#faf4e8');RC(g,x0-1,y-1,x1-x0+2,1,'#e9dcc4');});
        T.fence(S,[.03,.955],[.955,.955],{h:4,d:2.9,gap:[.86,1]});
        T.fence(S,[.955,.03],[.955,.955],{h:4,d:2.8,gap:[.86,1]});
        return{flagAt:fa};
      },
      // ---------- v1 現代玻璃校舍：三層板樓沿北緣 u∈[.05,.95]（三條通長玻璃帶＋整排彩虹垂直遮陽鰭、內凹玻璃門廳＋白雨遮與紅底白字校名帶、薄女兒牆）；屋頂只有太陽能板與一條低矮綠屋頂帶；東端前方一層木作餐廳翼打斷板樓剪影；前庭三件：西側藍色 PU 籃球場（白色外框＋中線、西端一座籃架）、門廳→校門主步道、東側橡膠墊上一排單槓；西角升旗台 ----------
      (g,ng,S)=>{
        const h=31,WL='#f1f2ef',WR='#a3a9aa',RF='#8d9396',u0=.05,u1=.95,v0=.05,v1=.33;   // T613 r5：兩層→三層（本體高 53→62px，達 1×1 的 60px 下限；三條玻璃帶）
        // T613 r7（退件：前庭約 20px 一片碎、三層板樓配滿版彩虹鰭讀成辦公樓／旅館）：前庭只留三件——
        // 西側一整面藍色 PU 球場（白色外框＋中線，拿掉兩端深色禁區塊，一座籃架在西端）｜中間門廳→校門主步道｜東側一層木作餐廳翼（大玻璃帶、白色壓頂），翼前一排單槓立在綠色橡膠墊上；
        // 學生只留兩個，拿掉腳踏車、跳格子、沙坑。門廳雨遮前緣立一道寬的紅底白字校名帶，板樓剪影被一層翼打斷。
        const c0=.17,c1=.50,d0=.45,d1=.92;   // 球場 u∈[c0,c1] v∈[d0,d1]
        const w0=.67,w1=.95,wv=.53,hw=11;     // 東側一層翼 u∈[w0,w1] v∈[v1,wv]
        pave(g,'g',0,0,1,1,7101);
        pave(g,'c',.04,v1,.92,.09,7102,.25);
        pave(g,'c',.53,.42,.10,.54,7106,.125);
        pave(g,'c',.63,wv,.33,.07,7109,.125);
        pave(g,'rb',c0,d0,c1-c0,d1-d0,7103);
        {const LC='#e8eef3',cv=(d0+d1)/2;
          lineU(g,d0+.03,c0+.03,c1-.03,LC);lineU(g,d1-.03,c0+.03,c1-.03,LC);lineV(g,c0+.03,d0+.03,d1-.03,LC);lineV(g,c1-.03,d0+.03,d1-.03,LC);
          lineU(g,cv,c0+.03,c1-.03,LC);}
        pave(g,'rr',.66,.62,.28,.17,7104);
        pave(g,'st',.03,.84,.12,.12,7105,.0625);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,33],['b',w0,v1,w1-w0,wv-v1,hw]]);
        const FIN=['#d9573f','#ee9a38','#e9c83c','#6aa84f','#3f82c4','#8a5bb0'];
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,WL,WR);faceL(g,v1,u0,u1,0,1,'#9aa0a2');faceR(g,u1,v0,v1,0,1,'#767c7f');
          for(const z of[2,12,22]){faceL(g,v1,u0+.02,u1-.02,z,z+7,GL);faceL(g,v1,u0+.02,u1-.02,z+6,z+7,GH);faceR(g,u1,v0+.02,v1-.02,z,z+7,GD);faceL(g,v1,u0+.02,u1-.02,z-1,z,'#d9dcdb');faceR(g,u1,v0+.02,v1-.02,z-1,z,'#b9bebe');}
          faceL(g,v1,.44,.62,0,9,'#2a3f51');faceL(g,v1,.515,.545,0,7.5,'#9cc0d6');
          // 夜：遮陽鰭之間的玻璃格一格格亮（鰭本身在後一層會蓋住），門廳只亮玻璃門
          if(n){for(let i=0;i<8;i++){const a=.09+i*.1+.036;if(!(a>.40&&a<.62)&&hsh(7111,i,1)<.55)faceL(n,v1,a,a+.058,2,8,T.LIT);if(hsh(7112,i,1)<.5)faceL(n,v1,a,a+.058,12,18,T.LIT);if(hsh(7113,i,1)<.42)faceL(n,v1,a,a+.058,22,28,T.LIT);}
            faceL(n,v1,.515,.545,0,7,'#fff0c4');faceR(n,u1,v0+.09,v1-.09,12,18,'#f3d68e');}
          T.flatTop(g,u0,v0,u1-u0,v1-v0,h,RF);
          for(let r=0;r<2;r++){const vv=v0+.05+r*.1;boxZ(g,u0+.05,vv,.34,.07,h,1.5,'#2f4f78','#3f6690','#243d5e');for(let t=u0+.10;t<u0+.38;t+=.06)BL(g,P(t,vv,h+1.5),P(t,vv+.07,h+1.5),'#6f93b8');}
          boxZ(g,.50,.09,.40,.18,h,1,'#6f9f4e','#5d8a40','#4a7033');
          for(let i=0;i<7;i++){const p=P(.53+hsh(7141,i,1)*.34,.11+hsh(7141,i,2)*.14,h+1);RC(g,p[0],p[1]-1,2,1,hsh(7141,i,3)<.5?'#8cc063':'#4f7f35');}});
        // 彩色垂直遮陽鰭：細線層（不描邊），1px 鰭＋2px 玻璃交替，不會把玻璃帶吃掉；夜裡鰭會遮住身後的窗光
        S.t(1.01,(g)=>{let i=0;for(let t=.09;t<.93;t+=.1,i++){const z0=(t>.42&&t<.62)?10:1;const c=FIN[i%FIN.length];boxZ(g,t,v1,1/32,.012,z0,h-1-z0,SH(c,30),c,null);}});
        // 門廳雨遮（白色薄板 z8–9、出挑 .07）＋前緣一道 4px 高紅底校名帶（四個白字塊，夜裡字塊亮）：取代原本太小、讀不成招牌的橘色小雨遮
        S.o(1.02,(g,n)=>{boxZ(g,.40,v1,.26,.07,8,1,'#eef0ee','#dfe2e0','#aeb3b4');
          boxZ(g,.40,v1+.052,.26,.018,9,4,'#ec7a60','#d24a36','#9c3526');
          for(const t of[.44,.50,.56,.62]){faceL(g,v1+.07,t,t+1/32,10,12,'#fff6e0');if(n)faceL(n,v1+.07,t,t+1/32,10,12,'#fff0c4');}
          const lp=P(.53,v1+.07,8);RC(g,lp[0]-1,lp[1],2,1,'#f3e2a8');if(n)RC(n,lp[0]-2,lp[1],4,2,'#ffe6a0');});
        // 東側一層餐廳／活動室翼：木作外牆（直向木條）、+v 面一扇玻璃門＋一整條白框大玻璃帶、+u 面一扇窗；平頂白色壓頂＋兩個採光天窗
        S.o(1.03,(g,n)=>{const TL='#c98f5a',TD2='#96643a';
          boxZ(g,w0,v1,w1-w0,wv-v1,0,hw,null,TL,TD2);faceL(g,wv,w0,w1,0,1,'#8f6a4a');faceR(g,w1,v1,wv,0,1,'#6e4f35');
          for(let t=w0+.04;t<w1-.01;t+=.05)faceL(g,wv,t,t+1/32,1,hw-1.5,SH(TL,-9));
          for(let t=v1+.04;t<wv-.01;t+=.05)faceR(g,w1,t,t+1/32,1,hw-1.5,SH(TD2,-9));
          faceL(g,wv,w0+.02,w0+.075,0,8,'#2a3f51');faceL(g,wv,w0+.03,w0+.065,0,7,'#9cc0d6');
          faceL(g,wv,w0+.10,w1-.02,2,9,'#f4f4ef');faceL(g,wv,w0+.11,w1-.03,3,8,GL);faceL(g,wv,w0+.11,w1-.03,7,8,GH);
          for(let t=w0+.155;t<w1-.04;t+=.045)faceL(g,wv,t,t+1/32,3,8,'#f4f4ef');
          faceR(g,w1,v1+.07,wv-.07,2,9,'#d6d6d0');faceR(g,w1,v1+.08,wv-.08,3,8,GD);
          if(n){faceL(n,wv,w0+.03,w0+.065,0,7,'#fff0c4');for(let t=w0+.11,i=0;t<w1-.04;t+=.045,i++)if(hsh(7151,i,1)<.7)faceL(n,wv,t+1/32,Math.min(w1-.03,t+.045),3,8,T.LIT);faceR(n,w1,v1+.08,wv-.08,3,8,'#f3d68e');}
          T.flatTop(g,w0,v1,w1-w0,wv-v1,hw,'#a9aeae',{cap:'#f4f4ef'});
          for(const[a,b]of[[w0+.06,v1+.08],[w0+.16,v1+.08]])boxZ(g,a,b,.06,.10,hw,1.5,'#b9d3e2','#dfe3e2','#9aa0a2');});
        const fa=T.flag(S,.09,.90,10,1.0);   // 西角升旗台（板樓拉長到 u=.95，旗桿改到西角：上方是透明背景）
        // 籃架：球場西端一座（桿在端線外、籃板朝場內）
        T.hoop(S,(c0+c1)/2,.95,0,-.05,1.88,false);
        // 東側一排單槓（深灰柱紅槓），立在翼前的綠色橡膠墊上
        T.bars(S,.69,.715,.22,[6,8,10],1.62,{pc:'#474f57',bc:'#d8483a'});
        S.t(1.6,(g)=>{T.kid(g,P(.36,.80),'#e8c23a',{small:1,arm:1});T.kid(g,P(.84,.77),'#3f78c0',{small:1,arm:-1});});
        T.bush(S,.10,.58,2);T.bush(S,.08,.72,2);

        T.fence(S,[.03,.955],[.955,.955],{h:4,d:2.9,gap:[.54,.64]});
        T.fence(S,[.955,.03],[.955,.955],{h:4,d:2.8});
        return{flagAt:fa};
      },
      // ---------- v2 石造老校：沿西北緣（沿 v）的兩層石造長樓——長邊一樓整排圓拱迴廊、二樓一整排長方形上下推窗、緩坡雙坡石板瓦與短粗煙囪、煙囪前方屋脊上一座小鐘亭；山牆立面朝前（圓拱大門，拱頂正上方深綠金字校名牌）；東半操場：一整面實心紅色 PU 球場（白色外框＋中線）、前緣一條相接跳格子、球場後方老樹旁一組單槓，東角石板旗座，前緣低鐵欄杆在大門前開校門口 ----------
      (g,ng,S)=>{
        const h=24,SL='#d2cab6',SR='#9a927d',SB='#aca38d',SBR='#7a7260',CR='#e8e1d1',CRD='#b3aa96',RF='#6b7583',RS='#4a525e',DK='#2c2520';   // r6：22→24（二樓推窗 5→6px，屋面放緩後整體仍 ≥60px）
        // T613 r6（退件：zoom 1.5 像小教堂／莊園）：拿掉山尖鐘架（改貼矮平校名牌）、屋面放緩（rh 9→6）、二樓圓拱窗改成成列的長方形上下推窗（上下兩道石帶夾成一整排）、
        // 煙囪改短粗；長樓縮到 v=.72 讓出前庭，校門移到大門正前方；東半操場一路擴到前緣（跳格子、單槓在前緣），老樹移到操場北角
        const u0=.05,u1=.33,v0=.05,v1=.72,um=(u0+u1)/2,rh=6;
        pave(g,'g',0,0,1,1,7201);
        pave(g,'lp',.38,.04,.58,.92,7202);
        pave(g,'st',.04,.72,.33,.24,7203);
        // T613 r7（退件：紅色球場只剩幾條紅線散在奶油色鋪面上）：球場放大、移出老樹下與長樓落影，成一整面實心紅色長方形＋白色外框＋中線，場上不放單槓；
        // 前緣步道一條連續跳格子（格子相接、黃橘交替、深黃外框），單槓移到球場後方老樹旁
        {const q0=.47,q1=.92,r0=.31,r1=.77,LC='#f2eee6',rc=(r0+r1)/2;pave(g,'rr',q0,r0,q1-q0,r1-r0,7205);
          lineU(g,r0+.03,q0+.03,q1-.03,LC);lineU(g,r1-.03,q0+.03,q1-.03,LC);lineV(g,q0+.03,r0+.03,r1-.03,LC);lineV(g,q1-.03,r0+.03,r1-.03,LC);lineU(g,rc,q0+.03,q1-.03,LC);}
        {const s=.058,us=.50,vc=.81,cells=[];let t=0;for(const m of[1,1,2,1,2,1]){if(m===1)cells.push([us+t,vc+s/2]);else{cells.push([us+t,vc]);cells.push([us+t,vc+s]);}t+=s;}
          for(const[a,b]of cells)flat(g,a-.016,b-.016,s+.032,s+.032,'#b8923a');
          cells.forEach(([a,b],i)=>flat(g,a+.004,b+.004,s-.008,s-.008,i%2?'#e0703e':'#f0c63c'));}
        pave(g,'st',.82,.04,.14,.14,7204,.0625);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,24],['c',.44,.08,3,12]]);
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,SL,SR);
          // 長邊（+u）一樓：四孔圓拱迴廊——淺色拱圈襯深色拱洞，拱圈相連成一條迴廊帶
          faceR(g,u1,v0,v1,0,2,SBR);
          const na=4,va=v0+.04,vb=v1-.04,AR='#d8cfba';
          for(let i=0;i<na;i++){const t=va+(vb-va)*(i+.5)/na;
            faceR(g,u1,t-.07,t+.07,0,10,AR);faceR(g,u1,t-.042,t+.042,10,11,AR);
            faceR(g,u1,t-.048,t+.048,1,8,DK);faceR(g,u1,t-.025,t+.025,8,9,DK);faceR(g,u1,t-.048,t+.048,1,2,'#4a403a');
            if(n&&i%2===0)faceR(n,u1,t-.012,t+.012,5,7,'#e9c88a');}
          // 二樓：窗台石帶（11–12）與過梁石帶（19–20）夾出一整排六扇長方形上下推窗（2px 玻璃、中間一道窗框）
          faceR(g,u1,v0,v1,11,12,CRD);faceR(g,u1,v0,v1,19,20,CRD);faceR(g,u1,v0,v1,h-2,h,CRD);
          T.winR(g,n,u1,va,vb,6,13,2,6,'#2d4356',{tr:3,trc:CRD,seed:7212,lit:.5});
          for(let z=3;z<h-2;z+=4){faceR(g,u1,v1-2/32,v1,z,z+2,CRD);faceR(g,u1,v0,v0+2/32,z,z+2,CRD);}
          // 山牆立面（+v）：圓拱大門（淺色拱圈、深色門洞、扇形氣窗）、二樓兩扇長方形上下推窗
          faceL(g,v1,u0,u1,0,2,SB);faceL(g,v1,u0,u1,11,12,CR);faceL(g,v1,u0,u1,19,20,CR);faceL(g,v1,u0,u1,h-2,h,CR);
          for(let z=3;z<h-2;z+=4){faceL(g,v1,u0,u0+2/32,z,z+2,CR);faceL(g,v1,u1-2/32,u1,z,z+2,CR);}
          faceL(g,v1,um-.095,um+.095,0,11,CR);faceL(g,v1,um-.06,um+.06,11,12,CR);
          faceL(g,v1,um-.064,um+.064,0,8.5,'#3e2a1e');faceL(g,v1,um-.034,um+.034,8.5,10,'#3e2a1e');
          faceL(g,v1,um-.064,um+.064,6.5,8.5,'#86a8c0');faceL(g,v1,um-.034,um+.034,8.5,10,'#86a8c0');faceL(g,v1,um-.004,um+.004,0,6.5,'#1e140e');
          // T613 r7（退件：山尖那塊深色牌讀成鐘架、整體像教堂）：山尖清空；校名牌改掛在圓拱大門正上方（深綠底金字、幾乎與山牆同寬），二樓兩扇窗上移 2px 讓出牌位
          faceL(g,v1,um-.11,um+.11,11,14,'#2f5a45');faceL(g,v1,um-.11,um+.11,13.5,14,'#4d7a62');
          for(const t of[um-.075,um-.0125,um+.05])faceL(g,v1,t,t+1/32,12,13,'#ecd27a');
          T.winL(g,n,v1,u0,u1,2,15,3,5,GL,{sill:CR,hi:GH,tr:3,trc:CR,seed:7213,lit:.7});
          if(n)faceL(n,v1,um-.064,um+.064,6.5,8.5,'#ffe3a0');
          T.gableV(g,u0,v0,u1-u0,v1-v0,h,rh,{rf:RF,rs:RS,wl:SL,ov:.03});
          faceL(g,v1,u0,u1,h-.5,h+.5,CR);
          const lp=P(um+.115,v1,8);RC(g,lp[0],lp[1]-2,1,2,'#f3e2a8');if(n)RC(n,lp[0]-1,lp[1]-3,3,3,'#ffe6a0');});
        // 屋脊後段一支短粗煙囪（只高出屋脊 2px，不再像尖塔）；緊貼在煙囪前方的屋脊上一座小鐘亭（奶油色柱、深色開口裡一點銅鐘、小攢尖），比原本山尖那座小一半
        S.o(1.01,(g)=>{boxZ(g,um-.035,.18,.07,.05,h+rh-3,5,'#8d8577','#b3aa98','#7d7565');boxZ(g,um-.041,.174,.082,.062,h+rh+2,1,'#6e675b','#a39a88','#6e675b');});
        S.o(1.011,(g)=>{const s=.065,bv=.28,a0=um-s/2,b0=bv-s/2,zb=h+rh-1.5,zc=zb+4;
          boxZ(g,a0,b0,s,s,zb,1.5,CR,CR,CRD);
          faceL(g,b0+s,a0,a0+s,zb+1.5,zc,DK);faceR(g,a0+s,b0,b0+s,zb+1.5,zc,'#201a16');
          faceL(g,b0+s,a0,a0+1/32,zb+1.5,zc,CR);faceL(g,b0+s,a0+s-1/32,a0+s,zb+1.5,zc,CR);faceR(g,a0+s,b0+s-1/32,b0+s,zb+1.5,zc,CRD);
          const bp=P(um,b0+s,zb+3.5);RC(g,bp[0],bp[1]-1,1,2,'#dcaa3e');
          boxZ(g,a0-.01,b0-.01,s+.02,s+.02,zc,.8,CR,CR,CRD);T.pyramid(g,um,bv,s+.03,zc+.8,2,RF,RS);});
        S.o(1.02,(g)=>{boxZ(g,um-.08,v1,.16,.04,0,1.5,'#d1cabb','#c2bba9','#9d9684');boxZ(g,um-.07,v1+.04,.14,.03,0,.7,'#d1cabb','#c2bba9','#9d9684');});
        T.tree(S,.44,.08,.85,2,1.1);
        // 單槓一組（深灰柱紅槓）移到球場後方、老樹旁，不壓在球場上
        T.bars(S,.56,.22,.22,[6,8,10],1.2,{pc:'#474f57',bc:'#d8483a'});
        const fa=T.flag(S,.89,.11,10,1.0);
        S.t(1.4,(g)=>{T.kid(g,P(.44,.80),'#d8483a',{small:1,arm:1});T.kid(g,P(.72,.26),'#2f5f96',{small:1,arm:-1});T.kid(g,P(.78,.60),'#e8c23a',{small:1,run:1});T.kid(g,P(.24,.86),'#f4f4ef',{small:1});});
        // 前緣一整道低鐵欄杆（看得穿：前緣的跳格子、單槓、山牆大門都不被擋），大門正前方開校門口（前庭淺，任何實心門墩都會蓋住大門、讀成石塊）
        T.fence(S,[.03,.955],[.955,.955],{h:4,d:2.9,pc:'#3a3f45',rc:'#666d75',step:4,mid:1,gap:[.10,.28]});
        T.fence(S,[.955,.03],[.955,.955],{h:4,d:2.8,pc:'#3a3f45',rc:'#666d75',step:4,mid:1});
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_c k7',e);errs.push('k7:'+(e&&e.stack||e));}

  // ================= k108 高中（2×2）=================
  try{
    build(108,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,terrain,lineU,lineV}=L;
      const GL='#4a6d8c',GD='#37536b',GH='#8fb2c9';
      const inLot=(u,v)=>u>.04&&v>.04&&u<1.96&&v<1.96;
      // 三層校舍（平頂女兒牆）：窗列逐層；o.band 校名帶
      const block=(g,n,u0,v0,du,dv,h,fl,C,o={})=>{const u1=u0+du,v1=v0+dv,fh=9;
        boxZ(g,u0,v0,du,dv,0,h,null,C.wl,C.wr);
        faceL(g,v1,u0,u1,0,1.5,C.bl||SH(C.wl,-40));faceR(g,u1,v0,v1,0,1.5,C.br||SH(C.wr,-34));
        for(let f=0;f<fl;f++){const z=2.5+f*fh;
          if(o.nl!==0){const cl=o.nl||Math.max(1,Math.floor(du*32/5));T.winL(g,n,v1,u0+.03,u1-.03,cl,z,3,4,C.gl||GL,{sill:C.sill,hi:GH,seed:(o.seed||1)+f,lit:.55});}
          if(o.nr!==0){const cr=o.nr||Math.max(1,Math.floor(dv*32/5));T.winR(g,n,u1,v0+.03,v1-.03,cr,z,3,4,C.gd||GD,{sill:C.sillR,seed:(o.seed||1)+f+20,lit:.45});}
          if(f>0&&C.string){faceL(g,v1,u0,u1,z-2.5,z-1.5,C.string);faceR(g,u1,v0,v1,z-2.5,z-1.5,SH(C.string,-40));}}
        if(o.band){const[a,b]=o.band;faceL(g,v1,a,b,h-4,h-1,C.band);for(let t=a+.05;t<b-.04;t+=.07)faceL(g,v1,t,t+2/32,h-3,h-2,'#f1dc8a');}
        T.flatTop(g,u0,v0,du,dv,h,C.roof);};
      // 弧形屋頂體育館：ax='v' 屋脊沿 v（拱在 u 方向，+v 端為拱形山牆）；ax='u' 反之
      const gym=(S,u0,v0,du,dv,h,rise,ax,d,C)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv;
        const tones=C.tones;
        boxZ(g,u0,v0,du,dv,0,h,null,C.wl,C.wr);
        faceL(g,v1,u0,u1,0,1.5,SH(C.wl,-36));faceR(g,u1,v0,v1,0,1.5,SH(C.wr,-30));
        if(ax==='v'){const uc=u0+du/2,hw=du/2,zf=(u,v)=>{const x=(u-uc)/hw;return h-1+(rise+1)*Math.sqrt(Math.max(0,1-x*x));};
          // +u 長邊：高側窗＋壁柱
          const nb=Math.max(3,Math.floor(dv*32/5));for(let i=0;i<nb;i++){const t=v0+dv*(i+.5)/nb;faceR(g,u1,t-.035,t+.035,h-6,h-2,C.gd||GD);if(n&&hsh(C.seed||5,i,1)<.6)faceR(n,u1,t-.035,t+.035,h-6,h-2,'#f3d68e');}
          for(let i=0;i<=nb;i++){const t=v0+dv*i/nb;faceR(g,u1,t-.01,t+.01,0,h,SH(C.wr,-14));}
          terrain(g,u0,v0,u1,v1+.02,1/32,(u,v)=>zf(Math.min(u1,Math.max(u0,u)),v),(u,v,z,gu,gv,i,j)=>{if(gu+gv>=31)return null;const nn=Math.hypot(gu/34,1),l=(gu/34*.6+.7)/nn;let k=l>.95?0:l>.8?1:l>.6?2:l>.4?3:4;if(j%5===0)k=Math.min(4,k+1);return tones[k];});
          const pts=[];for(let u=u0;u<=u1+1e-6;u+=1/64)pts.push(P(u,v1,zf(u)));pts.push(P(u1,v1,0),P(u0,v1,0));fp(g,pts,C.wl);
          faceL(g,v1,u0,u1,0,1.5,SH(C.wl,-36));faceL(g,v1,u0,u1,h-1,h,C.trim);
          const lp=[];for(let u=u0+.06;u<=u1-.06+1e-6;u+=1/64)lp.push(P(u,v1,zf(u)-2.5));lp.push(P(u1-.06,v1,h+.5),P(u0+.06,v1,h+.5));fp(g,lp,C.gl||GL);
          const mx=[];for(let k=1;k<5;k++){const u=u0+.06+(du-.12)*k/5;BL(g,P(u,v1,h+.5),P(u,v1,zf(u)-2.5),C.trim);mx.push(rnd(P(u,v1,0)[0]));}
          // 夜：只亮約半數窗格，中梃那一欄保持暗（窗格序號＝左側中梃數）
          if(n){const lit=C.panes||[1,3];L.litMask(n,(t)=>fp(t,lp,'#fff'),(x)=>{if(mx.includes(x))return false;return lit.includes(mx.filter(m=>m<x).length);},'#ffe9b0');}
          const um=u0+du/2;faceL(g,v1,um-.07,um+.07,0,8,C.trim);faceL(g,v1,um-.05,um+.05,0,7,'#3e4d5a');faceL(g,v1,um-.002,um+.002,0,7,'#2a3540');
          for(let u=u0;u<=u1;u+=1/64){const p=P(u,v1,zf(u)+1);RC(g,Math.floor(p[0]),Math.floor(p[1]),1,1,C.edge);}}
        else{const vc=v0+dv/2,hw=dv/2,zf=(u,v)=>{const x=(v-vc)/hw;return h-1+(rise+1)*Math.sqrt(Math.max(0,1-x*x));};
          const nb=Math.max(3,Math.floor(du*32/5));for(let i=0;i<nb;i++){const t=u0+du*(i+.5)/nb;faceL(g,v1,t-.035,t+.035,h-6,h-2,C.gl||GL);if(n&&hsh(C.seed||5,i,2)<.6)faceL(n,v1,t-.035,t+.035,h-6,h-2,T.LIT);}
          for(let i=0;i<=nb;i++){const t=u0+du*i/nb;faceL(g,v1,t-.01,t+.01,0,h,SH(C.wl,-12));}
          terrain(g,u0,v0,u1+.02,v1,1/32,(u,v)=>zf(u,Math.min(v1,Math.max(v0,v))),(u,v,z,gu,gv,i,j)=>{if(gu+gv>=31)return null;const nn=Math.hypot(gv/34,1),l=(-gv/34*.62+.62)/nn;let k=l>.9?0:l>.72?1:l>.52?2:l>.32?3:4;if(i%5===0)k=Math.min(4,k+1);return tones[k];});
          const pts=[];for(let v=v0;v<=v1+1e-6;v+=1/64)pts.push(P(u1,v,zf(0,v)));pts.push(P(u1,v1,0),P(u1,v0,0));fp(g,pts,C.wr);
          faceR(g,u1,v0,v1,h-1,h,SH(C.trim,-40));
          const lp=[];for(let v=v0+.06;v<=v1-.06+1e-6;v+=1/64)lp.push(P(u1,v,zf(0,v)-2.5));lp.push(P(u1,v1-.06,h+.5),P(u1,v0+.06,h+.5));fp(g,lp,C.gd||GD);
          const mx=[];for(let k=1;k<5;k++){const v=v0+.06+(dv-.12)*k/5;BL(g,P(u1,v,h+.5),P(u1,v,zf(0,v)-2.5),SH(C.trim,-40));mx.push(rnd(P(u1,v,0)[0]));}
          // 夜：只亮約半數窗格（此面沿 v，畫面由右往左排；序號＝右側中梃數），中梃欄保持暗
          if(n){const lit=C.panes||[1,3];L.litMask(n,(t)=>fp(t,lp,'#fff'),(x)=>{if(mx.includes(x))return false;return lit.includes(mx.filter(m=>m>x).length);},'#f3d68e');}
          const vm=v0+dv/2;faceR(g,u1,vm-.07,vm+.07,0,8,SH(C.trim,-40));faceR(g,u1,vm-.05,vm+.05,0,7,'#2c3843');
          for(let v=v0;v<=v1;v+=1/64){const p=P(u1,v,zf(0,v)+1);RC(g,Math.floor(p[0]),Math.floor(p[1]),1,1,C.edge);}}});
      const portico=(S,u0,u1,v,dp,h,d,C)=>S.o(d,(g,n)=>{boxZ(g,u0,v,u1-u0,dp,h,2,C.top||'#eeeae0',C.l||'#e1dccf',C.r||'#aba596');
        for(const t of[u0+.02,u1-.035]){boxZ(g,t,v+dp-.035,.02,.02,0,h,null,'#e8e3d6','#b4ad9e');}
        const lp=P((u0+u1)/2,v+dp,h-1);if(n)RC(n,lp[0]-2,lp[1],4,1,'#ffe6a0');});
      const steps=(S,u0,u1,v,d)=>S.o(d,(g)=>{boxZ(g,u0,v,u1-u0,.05,0,1.5,'#d8d3c7','#c9c4b8','#a39e93');boxZ(g,u0+.02,v+.05,u1-u0-.04,.04,0,.7,'#d8d3c7','#c9c4b8','#a39e93');});
      const court=(g,u0,v0,du,dv,alongV)=>{pave(g,'gc',u0,v0,du,dv,1081);const c='#e8ece6',u1=u0+du,v1=v0+dv;
        lineU(g,v0+.02,u0+.02,u1-.02,c);lineU(g,v1-.02,u0+.02,u1-.02,c);lineV(g,u0+.02,v0+.02,v1-.02,c);lineV(g,u1-.02,v0+.02,v1-.02,c);
        if(alongV){lineU(g,v0+dv/2,u0+.02,u1-.02,c);const uc=u0+du/2;flat(g,uc-.06,v0+.02,.12,.14,'#c4674a');flat(g,uc-.06,v1-.16,.12,.14,'#c4674a');}
        else{lineV(g,u0+du/2,v0+.02,v1-.02,c);const vc=v0+dv/2;flat(g,u0+.02,vc-.06,.14,.12,'#c4674a');flat(g,u1-.16,vc-.06,.14,.12,'#c4674a');}};
      const TRK='#b95a41',TRKL='#f2eee6',TRKM='#cd7a5f';
      return [
      // ---------- v0 L 形：三層主校舍（沿 u）＋西翼（沿 v）、中央門廊與校名帶；東端拱頂體育館；前庭籃球場、跑道彎道一角、腳踏車棚與校門；西角磚鋪前庭立旗桿 ----------
      (g,ng,S)=>{
        const C={wl:'#ece2cc',wr:'#a4957b',roof:'#8e9396',sill:'#faf6ec',sillR:'#cfc5b2',string:'#d9ccb0',band:'#2f6d52'};
        pave(g,'g',0,0,2,2,10801);
        pave(g,'c',.44,.44,1.06,.34,10802);
        pave(g,'bp',.10,1.30,.84,.64,10803);
        pave(g,'c',.44,.78,.10,.54,10804,.125);
        court(g,.56,.82,.36,.46,true);
        const c1=[1.42,1.40],c2=[1.42,3.2];
        paint(g,(u,v)=>{if(v<.84||u<.9)return null;const r=T.segDist(u,v,c1,c2);if(r<=.50&&r>=.28)return TRK;if(r<.28)return((u*16|0)+(v*16|0))%2?'#6fa04f':'#76a755';return null;});
        for(let k=0;k<=4;k++)T.trace(g,c1,c2,.28+.055*k,(k===0||k===4)?TRKL:TRKM,(u,v)=>inLot(u,v)&&v>.84);
        paint(g,(u,v)=>{if(u<1.16||u>1.68||v<1.46)return null;const r=T.segDist(u,v,c1,c2);return(r<.26&&Math.abs(v-1.72)<.012)?'#eef2ea':null;});
        shadow(g,[['b',.10,.10,1.34,.34,34],['b',.10,.44,.34,.86,34],['b',1.52,.10,.40,.64,24],['c',.52,.62,4,14],['c',1.30,.62,4,14],['c',.82,1.66,4,14]]);
        // 主校舍 M 與西翼 W
        S.o(1,(g,n)=>{block(g,n,.10,.10,1.34,.34,29,3,C,{band:[.62,1.30],seed:1101});
          boxZ(g,1.08,.18,.14,.12,29,6,'#dfd9cb','#e9e3d5','#b2aa99');faceL(g,.30,1.12,1.18,29,34,'#5d6770');
          boxZ(g,.30,.16,.10,.10,29,5,'#aeb4b7','#c5cacc','#8d9396');});
        S.o(1.2,(g,n)=>{block(g,n,.10,.44,.34,.86,29,3,C,{seed:1111,nl:2});});
        portico(S,.74,1.00,.44,.12,10,1.25,{});
        S.o(1.24,(g,n)=>{const v=.44;faceL(g,v,.80,.94,0,8,'#3d566b');faceL(g,v,.866,.874,0,8,'#8fb2c9');if(n)faceL(n,v,.80,.94,0,8,'#fff0c4');});
        steps(S,.76,.98,.56,1.3);
        // 體育館（拱頂沿 v，+v 端拱形山牆＋扇形窗）
        gym(S,1.52,.10,.40,.64,15,9,'v',1.6,{wl:'#dfe3e2',wr:'#a9b0b1',trim:'#f4f5f2',edge:'#51626a',seed:1121,panes:[0,3],tones:['#9fb3b3','#8ba0a1','#75898b','#617375','#4f5f61']});
        const fa=T.flag(S,.16,1.86,10,2.02);
        T.hoop(S,.74,.84,0,.05,1.3);T.hoop(S,.74,1.27,0,-.05,2.0);
        // 腳踏車棚改淺色遮雨板（不再和樹糊成一團深色）；西前角那棵樹拿掉，只留旗桿與車棚
        T.bikeShed(S,.12,1.34,.30,.10,1.8,{seed:1131,col:'#dfe2dc'});
        T.tree(S,.52,.62,1,0);T.tree(S,1.30,.62,1,1);T.tree(S,.82,1.66,1,0);T.tree(S,1.94-.05,.98,.9,1);
        T.bench(S,1.06,.72,true,1.8);
        S.t(2.2,(g)=>{T.kid(g,P(.66,1.02),'#d8483a');T.kid(g,P(.80,1.14),'#f4f4ef',{run:1});T.kid(g,P(1.02,1.30),'#3f78c0',{run:1});T.kid(g,P(1.86,1.60),'#e8c23a',{run:1});
          T.kid(g,P(.90,.60),'#2f5f96');T.kid(g,P(.96,.62),'#f4f4ef');T.kid(g,P(.40,1.60),'#6aa84f');});
        T.lamp(S,.46,1.40,14,2.0);T.lamp(S,1.46,.80,14,2.3);
        S.o(3.3,(g)=>{for(const u of[.40,.62]){boxZ(g,u,1.90,.05,.05,0,9,'#e6e0d2','#d5cfc0','#a8a193');}const p=P(.45,1.95,6);RC(g,p[0]-1,p[1]-2,5,2,'#2f6d52');});
        T.fence(S,[.06,1.955],[1.955,1.955],{h:5,d:4,gap:[.19,.33]});
        T.fence(S,[1.955,.06],[1.955,1.955],{h:5,d:3.9});
        return{flagAt:fa};
      },
      // ---------- v1 口字形（西半）：北翼、西翼三層白牆（每層紅色走廊欄杆帶、屋頂水塔）＋東翼、南翼一層紅瓦四坡圍出中庭（十字步道、花圃、樹），南翼正中山牆門廳（校名帶）；東側藍色雙坡體育館（屋脊沿 u、山牆大窗朝東）、前方籃球場；前緣三道直線跑道與沙坑、腳踏車棚；西角石板升旗廣場 ----------
      (g,ng,S)=>{
        const C={wl:'#efebe2',wr:'#a8a092',roof:'#8c9194',sill:'#f7f4ee',sillR:'#c9c2b6',string:'#b0493a',band:'#8a2f2a',gl:'#46698a'};
        // 南翼改成一層平頂迴廊（深 .14、高 8px），讓出中庭前半：十字步道＋四塊草坪花圃看得到
        const a0=.06,a1=1.30,b0=.06,th=.26,ci0=a0+th,ci1=a1-.14,cv1=1.30,cvi=cv1-.14;   // 口：u∈[a0,a1] v∈[b0,cv1]；中庭 u∈[ci0,ci1] v∈[b0+th,cvi]；東、南兩面是深 .14 的一層迴廊
        const TL='#b8664a',TD='#8a4633';
        pave(g,'g',0,0,2,2,10811);
        pave(g,'c',.04,1.30,1.92,.22,10812,.25);
        pave(g,'st',ci0,b0+th,ci1-ci0,cvi-b0-th,10813);
        {const cu=(ci0+ci1)/2,cv=(b0+th+cvi)/2,FL=['#e0584a','#f0c64a','#f2a0b8','#f4f1e6'];
          paint(g,(u,v,x,y)=>{if(u<=ci0+.03||u>=ci1-.03||v<=b0+th+.03||v>=cvi-.03)return null;const du=Math.abs(u-cu),dv=Math.abs(v-cv);if(du<.055||dv<.055)return null;
            if((du<.10&&dv>.1)||(dv<.10&&du>.1))return(x+y)%3===0?FL[(x*7+y*3)%4]:'#5f8e44';   // 沿步道兩側的花圃
            return((u*16|0)+(v*16|0))%2?'#78a256':'#72994f';});}
        court(g,1.38,.88,.56,.40,false);
        pave(g,'rr',.32,1.56,1.20,.24,10816);
        pave(g,'st',.06,1.56,.22,.38,10818);
        lineU(g,1.56,.32,1.52,TRKL);lineU(g,1.80,.32,1.52,TRKL);lineU(g,1.64,.32,1.52,TRKM);lineU(g,1.72,.32,1.52,TRKM);
        lineV(g,.40,1.56,1.80,TRKL);lineV(g,1.44,1.56,1.80,TRKL);
        pave(g,'sd',1.58,1.56,.34,.24,10817);
        shadow(g,[['b',a0,b0,a1-a0,th,34],['b',a0,b0+th,th,cv1-b0-th,34],['b',ci1,b0+th,a1-ci1,cvi-b0-th,8],['b',ci0,cvi,a1-ci0,cv1-cvi,8],['b',1.38,.06,.56,.74,24]]);
        // 體育館（東側，屋脊沿 u，+u 山牆大窗）
        S.o(1.6,(g,n)=>{const u0=1.38,u1=1.94,v0=.06,v1=.80,h=14,vm=(v0+v1)/2;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,'#e6e8e4','#a2a8a6');faceL(g,v1,u0,u1,0,1.5,'#9aa0a0');faceR(g,u1,v0,v1,0,1.5,'#737979');
          T.winL(g,n,v1,u0+.04,u1-.04,5,7,2,4,GL,{hi:GH,seed:1241,lit:.6});   // 高側窗 2px 寬、落在壁柱之間，夜裡一扇扇分開
          for(let i=0;i<=5;i++){const t=u0+.04+(u1-u0-.08)*i/5;faceL(g,v1,t-.012,t+.012,0,h,'#cdd0cc');}
          faceL(g,v1,1.58,1.74,0,6,'#8b949a');for(let z=1;z<6;z+=2)faceL(g,v1,1.58,1.74,z,z+.6,'#727b81');
          T.winR(g,n,u1,v0+.05,vm-.2,1,3,3,4,GD,{seed:1242});T.winR(g,n,u1,vm+.2,v1-.05,1,3,3,4,GD,{seed:1243});
          T.gableU(g,u0,v0,u1-u0,v1-v0,h,8,{rf:'#5b8cb4',wr:'#a2a8a6',ov:.03,cs:2.2});
          const gl=[P(u1,vm-.24,h+.5),P(u1,vm+.24,h+.5),P(u1,vm,h+6)],mx=[];fp(g,gl,GD);for(let k=-1;k<=1;k++){BL(g,P(u1,vm+k*.12,h+.5),P(u1,vm+k*.12,h+6-Math.abs(k)*3),'#b9c0c2');mx.push(rnd(P(u1,vm+k*.12,0)[0]));}
          // 夜：山牆三角窗只亮隔一格（中梃欄保持暗），不再整片三角亮起
          if(n)L.litMask(n,(t)=>fp(t,gl,'#fff'),(x)=>{if(mx.includes(x))return false;return[1,3].includes(mx.filter(m=>m<x).length);},'#f3d68e');
          faceR(g,u1,vm-.12,vm+.12,0,7,'#5d666c');});
        // 北翼、西翼（三層）
        S.o(.9,(g,n)=>{block(g,n,a0,b0,a1-a0,th,29,3,C,{seed:1201});
          boxZ(g,.86,.12,.14,.12,29,7,'#c9ced1','#dde1e3','#a9b0b4');faceL(g,.24,.89,.97,29,34,'#b0493a');
          boxZ(g,.22,.12,.10,.10,29,4,'#aeb4b7','#c5cacc','#8d9396');});
        S.o(.95,(g,n)=>{block(g,n,a0,b0+th,th,cv1-b0-th,29,3,C,{seed:1211,nl:1});});
        // 中庭
        T.tree(S,ci0+.13,b0+th+.13,.9,2,1.15);
        for(const[u,v]of[[ci1-.10,b0+th+.10],[ci0+.10,cvi-.12]])T.bush(S,u,v,3,1.15);
        S.t(1.2,(g)=>{T.kid(g,P(.72,.62),'#f4f4ef');T.kid(g,P(.60,.78),'#2f5f96');T.kid(g,P(.86,.80),'#d8483a',{run:1});});
        // 東翼、南翼＝一層平頂迴廊（高 8px、深 .14，外側一排圓拱開口、紅色壓簷帶），正中山牆門廳＋校名帶
        S.o(1.35,(g,n)=>{const u0=ci1,u1=a1,v0=b0+th,v1=cvi,h=8;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,C.wl,C.wr);faceR(g,u1,v0,v1,0,1,'#857d70');
          const na=7;for(let i=0;i<na;i++){const t=v0+(v1-v0)*(i+.5)/na;faceR(g,u1,t-.045,t+.045,0,5,'#403a35');faceR(g,u1,t-.02,t+.02,5,6,'#403a35');if(n&&i%2===1)faceR(n,u1,t-.012,t+.012,4,5,'#f3d68e');}
          faceR(g,u1,v0,v1,h-1.5,h,SH(C.string,-40));
          T.flatTop(g,u0,v0,u1-u0,v1-v0,h,'#9da1a2',{e:.02});});
        S.o(1.5,(g,n)=>{const u0=ci0,u1=a1,v0=cvi,v1=cv1,h=8;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,C.wl,C.wr);faceL(g,v1,u0,u1,0,1,'#b9b2a4');faceR(g,u1,v0,v1,0,1,'#857d70');
          const na=8;for(let i=0;i<na;i++){const t=u0+(u1-u0)*(i+.5)/na;if(t>.66&&t<.96)continue;
            faceL(g,v1,t-.045,t+.045,0,5,'#56504a');faceL(g,v1,t-.02,t+.02,5,6,'#56504a');if(n&&i%2===0)faceL(n,v1,t-.012,t+.012,4,5,'#ffe3a0');}
          faceR(g,u1,v0+.03,v1-.03,0,5,'#403a35');
          faceL(g,v1,u0,u1,h-1.5,h,C.string);faceR(g,u1,v0,v1,h-1.5,h,SH(C.string,-40));
          T.flatTop(g,u0,v0,u1-u0,v1-v0,h,'#9da1a2',{e:.02});});
        S.o(1.55,(g,n)=>{const u0=.70,u1=.92,v0=1.10,v1=1.36,h=13;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,null,'#f4f1ea','#b4ad9f');faceL(g,v1,u0,u1,0,1.5,'#9a948a');faceR(g,u1,v0,v1,0,1.5,'#7d776d');
          faceL(g,v1,.77,.85,0,7,'#35495a');faceL(g,v1,.806,.814,0,7,'#8fb2c9');faceL(g,v1,.77,.85,6,7,'#8fb2c9');if(n)faceL(n,v1,.775,.845,0,6,'#fff0c4');
          faceL(g,v1,u0,u1,8.5,11,C.band);for(let t=u0+.04;t<u1-.03;t+=.055)faceL(g,v1,t,t+2/32,9.5,10.5,'#f1dc8a');
          T.gableV(g,u0,v0,u1-u0,v1-v0,h,5,{rf:TL,rs:TD,wl:'#f4f1ea',ov:.025});
          const ck=P((u0+u1)/2,v1,h+2);RC(g,ck[0]-1,ck[1]-2,3,3,'#f4f1e8');RC(g,ck[0],ck[1]-2,1,2,'#3a3533');
          const lp=P(.87,v1,7);RC(g,lp[0],lp[1]-1,1,2,'#f3e2a8');if(n)RC(n,lp[0]-1,lp[1]-2,3,3,'#ffe6a0');});
        // 西角：石板升旗廣場（旗桿＋兩側矮花台）；前庭：腳踏車棚
        S.o(1.93,(g)=>{boxZ(g,.08,1.62,.05,.12,0,2,'#b8b2a4','#a39c8c','#8a8375');flat(g,.085,1.625,.04,.11,'#6f9a4c',2);});
        const fa=T.flag(S,.16,1.84,10,2.0);
        T.hoop(S,1.41,1.08,.05,0,1.7);T.hoop(S,1.91,1.08,-.05,0,2.4);
        T.bikeShed(S,1.00,1.34,.34,.10,2.1,{seed:1251,col:'#b0493a'});
        T.tree(S,.10,1.42,.9,0);T.tree(S,1.56,1.42,.9,1);T.tree(S,1.88,1.42,.9,2);T.bush(S,.40,1.88,3);T.bush(S,1.10,1.88,3);T.bush(S,1.70,1.88,3);
        S.t(2.4,(g)=>{T.kid(g,P(.40,1.62),'#e8c23a',{run:1});T.kid(g,P(.66,1.70),'#d8483a',{run:1});T.kid(g,P(.94,1.76),'#f4f4ef',{run:1});T.kid(g,P(1.72,1.66),'#3f78c0');
          T.kid(g,P(1.60,1.00),'#f4f4ef',{run:1});T.kid(g,P(1.74,1.14),'#2f5f96');T.kid(g,P(.20,1.44),'#6aa84f');});
        T.lamp(S,.94,1.46,14,2.0);T.lamp(S,1.36,1.40,14,2.2);
        T.fence(S,[.06,1.955],[1.955,1.955],{h:5,d:4});
        T.fence(S,[1.955,.06],[1.955,1.955],{h:5,d:3.9,gap:[.665,.75]});
        return{flagAt:fa};
      },
      // ---------- v2 主樓＋獨立體育館：三層現代主樓（玻璃帶、藍色校名帶、懸挑雨遮）＋東側拱頂體育館（拱沿 v、+u 端拱形山牆）；前半部完整小田徑場（四道跑道＋足球場）、看台、腳踏車棚；西角跑道外石板旗座 ----------
      (g,ng,S)=>{
        const C={wl:'#e6e8e6',wr:'#9aa0a1',roof:'#8a9093',sill:'#9aa3a8',sillR:'#7c858a',band:'#2d5b8f',gl:'#3f6384'};
        pave(g,'g',0,0,2,2,10821);
        pave(g,'c',.08,.44,1.28,.42,10822,.25);
        const c1=[.56,1.46],c2=[1.46,1.46];
        paint(g,(u,v)=>{const r=T.segDist(u,v,c1,c2);if(r<=.46&&r>=.26)return TRK;if(r<.26)return(((u-.1)*10|0)%2)?'#6fa04f':'#78a957';return null;});
        for(let k=0;k<=4;k++)T.trace(g,c1,c2,.26+.05*k,(k===0||k===4)?TRKL:TRKM);
        T.trace(g,[.72,1.46],[1.30,1.46],.17,'#eef2ea');lineV(g,1.01,1.29,1.63,'#eef2ea');
        pave(g,'rr',1.40,.86,.52,.12,10823);
        shadow(g,[['b',.10,.10,1.20,.34,34],['b',1.42,.10,.50,.74,26],['b',.54,.84,.84,.10,6]]);
        S.o(1,(g,n)=>{block(g,n,.10,.10,1.20,.34,29,3,C,{band:[.20,.64],seed:1301});
          for(let f=0;f<3;f++){const z=2.5+f*9;faceL(g,.44,.12,1.28,z+5,z+6,'#c9ced0');}
          boxZ(g,.94,.16,.20,.14,29,7,'#d9dcdc','#e6e8e8','#a9aeae');for(let t=.97;t<1.12;t+=.035)BL(g,P(t,.30,30),P(t,.30,35),'#b9bebe');
          boxZ(g,.30,.18,.12,.10,29,4,'#aeb4b7','#c5cacc','#8d9396');});
        // 玻璃門廳：深色玻璃＋中梃，正中一扇亮框玻璃門；夜裡只亮這扇門（雨遮下露出的部分）＋雨遮前緣一盞門燈
        S.o(1.2,(g,n)=>{const v=.44;faceL(g,v,.72,.92,0,8,'#35516a');for(let t=.75;t<.91;t+=.05)faceL(g,v,t-.004,t+.004,0,8,'#6f8ea6');
          faceL(g,v,.79,.85,0,6.5,'#7fa4c0');faceL(g,v,.816,.824,0,6.5,'#35516a');if(n)faceL(n,v,.79,.85,0,6,'#fff0c4');
          boxZ(g,.66,.44,.32,.14,9,1.5,'#f4f5f2','#dfe2df','#a9aeae');const lp=P(.82,.58,9);RC(g,lp[0]-1,lp[1]-1,2,1,'#f3e2a8');if(n)RC(n,lp[0]-1,lp[1]-1,2,1,'#ffe6a0');
          boxZ(g,.67,.555,.02,.02,0,9,null,'#b8bdbd','#8a8f8f');boxZ(g,.95,.555,.02,.02,0,9,null,'#b8bdbd','#8a8f8f');});
        steps(S,.70,.94,.58,1.3);
        gym(S,1.42,.10,.50,.74,16,11,'u',1.5,{wl:'#e3e4de',wr:'#aab0ad',trim:'#f4f5f2',edge:'#4a5a52',seed:1311,gl:GL,gd:GD,tones:['#b6c2a0','#a0ad89','#8a9675','#737e61','#5f684f']});
        // 看台（跑道北側）
        S.o(1.9,(g)=>{const u0=.60,u1=1.36,v0=.86;for(let k=0;k<3;k++){boxZ(g,u0,v0+k*.035,u1-u0,.035,0,5-k*1.5,'#d9d6cc','#cfccc2','#a19e95');}
          for(let t=u0+.04;t<u1-.02;t+=.06){const p=P(t,v0+.02,5);RC(g,p[0],p[1]-1,2,1,'#3f78c0');}});
        pave(g,'st',.08,1.78,.16,.16,10824);
        const fa=T.flag(S,.15,1.86,10,2.01);
        T.bikeShed(S,.12,.62,.24,.10,1.3,{seed:1321,col:'#2d5b8f'});
        T.hoop(S,1.45,.92,0,0,1.8);
        // 足球門
        S.t(2.6,(g)=>{for(const[u,s]of[[.62,1],[1.40,-1]]){const a=P(u,1.40),b=P(u,1.52);BL(g,[a[0],a[1]-4],[b[0],b[1]-4],'#f4f4ef');RC(g,a[0],a[1]-4,1,4,'#f4f4ef');RC(g,b[0],b[1]-4,1,4,'#f4f4ef');}});
        T.tree(S,.06+.04,.92,1,1,1.0);T.tree(S,1.95-.05,1.00,1,2);T.tree(S,1.40+.02,.99,.8,0,2.5);
        T.bush(S,.14,.50,3);T.bush(S,1.30,.52,3);
        S.t(2.8,(g)=>{T.kid(g,P(.96,1.40),'#d8483a',{run:1});T.kid(g,P(1.12,1.54),'#f4f4ef',{run:1});T.kid(g,P(.80,1.58),'#d8483a');T.kid(g,P(1.26,1.44),'#f4f4ef',{run:1});
          T.kid(g,P(.36,1.52),'#e8c23a',{run:1});T.kid(g,P(1.62,1.88),'#3f78c0',{run:1});T.kid(g,P(.54,.70),'#2f5f96');T.kid(g,P(1.02,.72),'#6aa84f');T.kid(g,P(.80,.90),'#e8c23a');});
        T.lamp(S,.08,.84,16,1.0);T.lamp(S,1.90,.94,16,2.9);
        T.fence(S,[.06,1.955],[1.955,1.955],{h:6,d:4,mid:3});
        T.fence(S,[1.955,.06],[1.955,1.955],{h:6,d:3.9,mid:3});
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_c k108',e);errs.push('k108:'+(e&&e.stack||e));}

  if(errs.length)window.__civ_c_errs=errs;
});
