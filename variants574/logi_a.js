// T609 logi_a：k165 貨櫃物流中心（內陸 CFS）／k166 鐵公路聯運中心，實驗線重畫。兩類皆 4×4，三變體統一畫布 272×280、錨 136,278。
// 分層合成：地坪（材質鋪面、標線、軌道、落影）直接畫在地面層；立體件走分層場景——每件各自二值化＋深色外框，依深度由後往前疊；
// 鋼索、欄杆等細線走不描邊層。夜圖「先有燈具才有光」：只點白天畫出的高桿燈冠、窗、門燈、閘口棚燈、吊車紅色警示燈、車燈；
// 被前景實體擋住的燈會被擦掉。光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh 決定性雜湊。
(window.__variants574=window.__variants574||[]).push(function logi_a(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const W=272,H=280,AX=136,AY=278,SZ=4;
  const DEV={};            // 迭代用：{165:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位；定稿必須是 {}
  const DEV_THROW=false;   // 迭代用：分類出錯時在批次尾拋出讓報表看得到；定稿為 false（錯誤仍記在 window.__logi_a_errs）
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<4000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const BL2=(g,a,b,c1,c2)=>{BL(g,a,b,c1);BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],c2);};
    // 像素精準多邊形：掃描線取像素中心（無抗鋸齒、相鄰面不留縫）
    const fp=(g,pts,c)=>{g.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)g.fillRect(xa,y,xb-xa+1,1);}}};
    const Q=(u0,v0,du,dv,z=0)=>[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];
    const flat=(g,u0,v0,du,dv,c,z=0)=>fp(g,Q(u0,v0,du,dv,z),c);
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    // 牆面直條（波紋／門縫）：+v 面沿 u、+u 面沿 v
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    // 牆面平行四邊形（窗、門）：winL 在 +v 面、winR 在 +u 面；錨＝左下
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55)=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,.5,glass);pg(g,X,Y,w,1,.5,SH(glass,34));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,'#ffe3a0');}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5)=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,'#f3d68e');}};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z] 方盒（z＝離地高）／['p',u,v,h] 細桿
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      y:{t:['#b8b4a9','#b2aea3','#bebaaf'],j:'#a8a499',s:.25,p:.55},     // 堆場混凝土版
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#b4b0a5',s:.25,p:.6},      // 建物周邊混凝土
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      k:{t:['#a39e92','#9c978b','#aba69a'],j:null,s:.0625,p:.5},         // 碎石
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
      b:{t:['#ab9e8c','#a49784','#b3a695'],j:null,s:.0625,p:.55},        // 鐵道道碴（淺褐灰）
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*16);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62605c':'#7a7873');}}
      if(m==='y'||m==='c'){for(let i=0;i<rnd(du*dv*4);i++){const p=P(u0+.05+hsh(seed,i,41)*(du-.1),v0+.05+hsh(seed,i,42)*(dv-.1));RC(g,p[0]-1,p[1],3,1,SH(M.t[0],-16));RC(g,p[0],p[1]+1,2,1,SH(M.t[0],-10));}}
      if(m==='k'){for(let i=0;i<rnd(du*dv*60);i++){const p=P(u0+hsh(seed,i,51)*du,v0+hsh(seed,i,52)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,53)<.5?'#8f8a7e':'#bab5a8');}}
      if(m==='b'){for(let i=0;i<rnd(du*dv*70);i++){const p=P(u0+hsh(seed,i,56)*du,v0+hsh(seed,i,57)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,58)<.5?'#8e8171':'#c3b8a8');}}
      if(m==='g'){for(let i=0;i<rnd(du*dv*30);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const YEL='#d6b243',WHT='#e6e2d6';
    // 鐵軌（沿 u）：淺褐灰道碴床（兩肩壓暗）＋深色枕木（每 3px 一根）＋亮色雙軌（頂亮底暗）；v＝左軌，軌距 4px
    const GA=.125;
    const rail2=(g,a,b)=>{BL(g,[a[0],a[1]+1],[b[0],b[1]+1],'#383e42');BL(g,a,b,'#e2e5e6');};
    const trackU=(g,v,u0,u1,seed)=>{pave(g,'b',u0,v-.08,u1-u0,GA+.16,seed);lineU(g,v-.08,u0,u1,'#8b7e6f');lineU(g,v+GA+.08,u0,u1,'#7f7365');
      for(let u=u0+.03;u<u1-.01;u+=.125)BL(g,P(u,v-.045),P(u,v+GA+.045),'#6b5a49');
      rail2(g,P(u0,v),P(u1,v));rail2(g,P(u0,v+GA),P(u1,v+GA));};
    const trackV=(g,u,v0,v1,seed)=>{pave(g,'b',u-.08,v0,GA+.16,v1-v0,seed);lineV(g,u-.08,v0,v1,'#8b7e6f');lineV(g,u+GA+.08,v0,v1,'#7f7365');
      for(let v=v0+.03;v<v1-.01;v+=.125)BL(g,P(u-.045,v),P(u+GA+.045,v),'#6b5a49');
      rail2(g,P(u,v0),P(u,v1));rail2(g,P(u+GA,v0),P(u+GA,v1));};
    // 吊車軌道梁（地面）
    const craneRailU=(g,v,u0,u1)=>{flat(g,u0,v-.03,u1-u0,.06,'#9d998f');lineU(g,v,u0,u1,'#555b5f');lineU(g,v-.01,u0,u1,'#b9bec1');};
    const craneRailV=(g,u,v0,v1)=>{flat(g,u-.03,v0,.06,v1-v0,'#9d998f');lineV(g,u,v0,v1,'#555b5f');lineV(g,u-.01,v0,v1,'#b9bec1');};
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const stain=(g,u,v,r,seed)=>{const p=P(u,v);ell(g,p[0],p[1],r,Math.max(1,r>>1),'rgba(60,58,52,.18)');};
    // 圍籬（地面層畫後側、最後畫前側）
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),L=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(3,Math.round(L/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};

    // ---------- 貨櫃 ----------
    const CPAL=[['#a5533f',6],['#4d6f93',5],['#8d9598',3],['#d0cfc7',3],['#5a8464',3],['#6b8fae',2],['#b8763d',2],['#7e5a43',2],['#4f8580',2],['#8a3f36',2],['#b39a4c',1]];
    const CT=CPAL.reduce((a,b)=>a+b[1],0);
    const cpick=t=>{let s=t*CT;for(const[c,w]of CPAL){if(s<w)return c;s-=w;}return CPAL[0][0];};
    // 沿 u 長向：長側（+v 面，亮）波紋；門端（+u 面，暗）門閂
    const ctrU=(g,u0,v0,L,Wd,z,col,th=4)=>{const u1=u0+L,v1=v0+Wd;
      faceL(g,v1,u0,u1,z,z+th,col);faceR(g,u1,v0,v1,z,z+th,SH(col,-48));fp(g,Q(u0,v0,L,Wd,z+th),SH(col,20));
      ribsL(g,u0,u1,v1,z,z+th,SH(col,-16));faceL(g,v1,u0,u1,z,z+1,SH(col,-30));BL(g,P(u0,v1,z),P(u0,v1,z+th-1),SH(col,-36));
      const d=P(u1,v0+Wd*.5,z+th-1);RC(g,d[0],d[1]+1,1,th-2,SH(col,-24));};
    // 沿 v 長向：長側（+u 面，暗）波紋；門端（+v 面，亮）
    const ctrV=(g,u0,v0,L,Wd,z,col,th=4)=>{const u1=u0+Wd,v1=v0+L;
      faceL(g,v1,u0,u1,z,z+th,SH(col,-6));faceR(g,u1,v0,v1,z,z+th,SH(col,-40));fp(g,Q(u0,v0,Wd,L,z+th),SH(col,20));
      ribsR(g,u1,v0,v1,z,z+th,SH(col,-56));faceR(g,u1,v0,v1,z,z+1,SH(col,-60));
      const d=P(u0+Wd*.5,v1,z+th-1);RC(g,d[0],d[1]+1,1,th-2,SH(col,-34));};
    const CW=.085;
    // 堆場（沿 u 長向）：每個 bay 一件；o.tiers(i,j)／o.tw(i)＝20 呎成對
    // 井然的堆場：每 bay 一個主色（同一航商）＋少量雜色；bay 高度走 o.hs 輪廓，前排偶爾少一層（階梯感）
    const stackU=(S,bays,v0,nr,o={})=>{const L=o.L||.4,seed=o.seed||1,tmin=o.tmin||1,tmax=o.tmax||4,pc=o.pitch||CW;   // o.pitch：列距（>CW 時列間留縫）
      bays.forEach((u,i)=>{const bh=o.hs?o.hs[i%o.hs.length]:tmin+Math.floor(hsh(seed,i,77)*(tmax-tmin+1)),tw=o.tw?o.tw(i):hsh(seed,i,78)<.2;
        const dom=o.dom?o.dom[i%o.dom.length]:cpick(hsh(seed,i,901)),sec=cpick(hsh(seed,i,902));
        S.o(u+v0+Math.min(L,nr*CW)-.01,(g)=>{for(let j=0;j<nr;j++){
          let n=o.tiers?o.tiers(i,j):bh-((j===nr-1&&hsh(seed,i,79)<.4)||hsh(seed,i*13+j,5)<.1?1:0);
          n=Math.max(0,Math.min(tmax,n));
          for(let t=0;t<n;t++){const q=hsh(seed,i*31+j,t+7),col=o.col?o.col(i,j,t):(q<.7?dom:q<.88?sec:cpick(hsh(seed,i*17+j*5,t+50)));
            if(tw){ctrU(g,u,v0+j*pc,L/2-.005,CW,t*4,col);ctrU(g,u+L/2+.005,v0+j*pc,L/2-.005,CW,t*4,q<.8?col:cpick(hsh(seed,i+j,t+80)));}
            else ctrU(g,u,v0+j*pc,L,CW,t*4,col);
            if(o.seam&&j>0)BL(g,P(u+.012,v0+j*pc,t*4+4),P(u+L-.012,v0+j*pc,t*4+4),SH(col,-34));}}});});};   // o.seam：列間分縫（頂面後緣壓暗）
    // 堆場（沿 v 長向）：rows＝各列 u；bays＝沿 v 的起點
    const stackV=(S,rows,bays,o={})=>{const L=o.L||.4,seed=o.seed||1,tmax=o.tmax||3;
      rows.forEach((u,i)=>{bays.forEach((v,j)=>{if(o.skip&&o.skip(i,j))return;
        const n=o.tiers?o.tiers(i,j):Math.max(1,Math.min(tmax,1+Math.floor(hsh(seed,i*11+j,5)*tmax)));
        const dom=cpick(hsh(seed,i*7+Math.floor(j/2),903));
        S.o(u+v+CW-.01,(g)=>{for(let t=0;t<n;t++){const q=hsh(seed,i*37+j,t+7),col=o.col?o.col(i,j,t):(q<.62?dom:cpick(hsh(seed,i*19+j*3,t+60)));ctrV(g,u,v,L,CW,t*4,col);}});});});};

    // ---------- 車輛與機具 ----------
    // 貨櫃車：dir＝'u+'|'u-'|'v+'|'v-'（車頭朝向）；(u,v)＝整台車佔地的最小角；load＝貨櫃色|'box'|null（空板架）
    const truck=(S,u,v,dir,cab,load,d)=>{const ax=dir[0],fw=dir[1]==='+',Wd=.08,TL=.44,CL=.11;
      const bx=(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      const pt=(b,a,z)=>ax==='u'?P(u+b,v+a,z):P(u+a,v+b,z);
      const tb=fw?0:CL+.01,cb=fw?TL+.01:0;
      const cabF=(g,n)=>{bx(g,cb,CL,-.005,Wd+.01,1,8,SH(cab,24),cab,SH(cab,-44));bx(g,cb+(fw?.0:.03),.08,.005,Wd-.01,9,1,SH(cab,30),SH(cab,10),SH(cab,-30));
        const fe=fw?cb+CL:cb;   // 車頭面
        if(fw){if(ax==='u')faceR(g,u+fe,v+.01,v+Wd-.005,5,8,'#34495a');else faceL(g,v+fe,u+.005,u+Wd-.005,5,8,'#415f76');
          if(n){const h1=pt(fe,.012,2),h2=pt(fe,Wd-.012,2);RC(n,h1[0],h1[1],1,1,'#fff3c8');RC(n,h2[0],h2[1],1,1,'#fff3c8');}}
        else{if(ax==='u')winL(g,u+cb+.03,v+Wd+.005,5,2,2,'#415f76');else winR(g,u+Wd+.005,v+cb+.05,5,2,2,'#34495a');}
        for(const t of[cb+.02,cb+.08]){const p=pt(t,Wd+.005,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}};
      const trl=(g)=>{bx(g,tb,TL,0,Wd,1,1,'#45494d','#55595d','#34383b');
        for(const t of(fw?[tb+.03,tb+.08,tb+.13]:[tb+TL-.13,tb+TL-.08,tb+TL-.03])){const p=pt(t,Wd,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
        if(load==='box'){const col='#dcdcd6';bx(g,tb,TL,0,Wd,2,8,'#e8e8e3',col,'#a9aba7');
          if(ax==='u')ribsL(g,u+tb,u+tb+TL,v+Wd,2,10,'#c6c7c2',3);else ribsR(g,u+Wd,v+tb,v+tb+TL,2,10,'#8f918d',3);}
        else if(load){if(ax==='u')ctrU(g,u+tb+.02,v-.0025,.4,CW,2,load);else ctrV(g,u-.0025,v+tb+.02,.4,CW,2,load);}
        else{bx(g,tb+.02,.03,0,Wd,2,1,'#6a6e71','#7b7f82','#505457');bx(g,tb+TL-.05,.03,0,Wd,2,1,'#6a6e71','#7b7f82','#505457');}};
      const dd=d!=null?d:u+v+(ax==='u'?TL+CL:Wd)+(ax==='v'?TL+CL:Wd)-.2;
      S.o(dd,(g,n)=>{if(fw){trl(g);cabF(g,n);}else{cabF(g,n);trl(g);}});};
    const car=(S,u,v,alongU,col,d)=>S.o(d!=null?d:u+v+.1,(g)=>{const du=alongU?.14:.075,dv=alongU?.075:.14;
      boxZ(g,u,v,du,dv,1,2,SH(col,16),col,SH(col,-40));boxZ(g,u+(alongU?.035:.008),v+(alongU?.008:.035),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa0b6','#58788e');});
    // 正面吊運機（reach stacker）：ax＝行進軸，fw＝車頭朝正向；lz＝所吊貨櫃底高；dl＝吊物層深度
    const reach=(S,u,v,ax,fw,o={})=>{const col=o.col||'#dfa12c',Cl=col,Ct=SH(col,28),Cd=SH(col,-50),lz=o.lz!=null?o.lz:10,BLn=.38,Wd=.15,am=.06;
      // 局部：b 沿行進軸（0 在最小值端）、a 橫向；fw＝車頭朝 +b
      const bx=(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      const pt=(b,a,z)=>ax==='u'?P(u+b,v+a,z):P(u+a,v+b,z);
      const rear=fw?0:BLn,dir=fw?1:-1,tipB=fw?BLn+.08:-.08;
      const body=(g,n)=>{bx(g,0,BLn,0,Wd,2,5,Ct,Cl,Cd);
        bx(g,fw?0:BLn-.08,.08,0,Wd,2,10,SH('#56595c',22),'#56595c','#3b3e41');                  // 配重
        bx(g,fw?.08:BLn-.18,.1,.01,Wd-.08,7,3,Ct,Cl,Cd);                                             // 引擎蓋
        for(const t of[fw?.07:BLn-.07,fw?BLn-.07:.07]){const p=pt(t,Wd,0);RC(g,p[0]-2,p[1]-4,4,4,'#1c1e21');RC(g,p[0]-1,p[1]-3,2,2,'#5d6164');}
        const c0=fw?.17:BLn-.27;bx(g,c0,.1,.085,Wd-.085,7,9,'#ebebe6','#d6d7d2','#a1a39f');         // 駕駛室（側置）
        if(ax==='u'){winL(g,u+c0+.012,v+Wd,9,3,5,'#3f5f78');winR(g,u+c0+.1,v+.09,9,2,5,'#34506a');}else{winR(g,u+Wd,v+c0+.015,9,3,5,'#34506a');winL(g,u+.09,v+c0+.1,9,2,5,'#3f5f78');}
        if(n){if(ax==='u')winL(n,u+c0+.012,v+Wd,9,3,5,'#ffe2a0');else winR(n,u+Wd,v+c0+.015,9,3,5,'#ffe2a0');}
        const bc=pt(c0+.05,Wd-.04,17);RC(g,bc[0],bc[1]-1,2,1,'#e8a53a');if(n)RC(n,bc[0],bc[1]-1,2,1,'#ffb850');};
      // 伸縮臂：後端鉸點→前端吊具，粗 4px（頂亮、底暗）；油壓缸
      const boom=(g)=>{const a=pt(rear+dir*.08,am,13),b=pt(tipB,am,lz+7);
        fp(g,[[a[0]-1,a[1]-2],[b[0]-1,b[1]-2],[b[0]+1,b[1]+2],[a[0]+1,a[1]+2]],Cl);BL(g,[a[0]-1,a[1]-2],[b[0]-1,b[1]-2],Ct);BL(g,[a[0]+1,a[1]+2],[b[0]+1,b[1]+2],Cd);
        const m=pt(rear+dir*.25,am,8),e=pt(rear+dir*.34,am,17);BL2(g,m,e,'#9ba0a3','#6d7275');};
      const load=(g)=>{const a0=am-.2;if(o.load){if(ax==='u')ctrV(g,u+tipB-.0425,v+a0,.4,CW,lz,o.load);else ctrU(g,u+a0,v+tipB-.0425,.4,CW,lz,o.load);}
        if(ax==='u')boxZ(g,u+tipB-.035,v+a0,.07,.4,lz+4,2,'#f0cf5a','#e5c14a','#b18f2c');else boxZ(g,u+a0,v+tipB-.035,.4,.07,lz+4,2,'#f0cf5a','#e5c14a','#b18f2c');
        const t=pt(tipB,am,lz+6);RC(g,t[0]-1,t[1]-1,3,2,Cd);};
      const db=o.d!=null?o.d:u+v+Wd+BLn*.5;
      if(fw){S.o(db,(g,n)=>{body(g,n);boom(g);});S.o(o.dl!=null?o.dl:db+.3,(g)=>{load(g);});}
      else{S.o(o.dl!=null?o.dl:db-.3,(g)=>{load(g);});S.o(db,(g,n)=>{body(g,n);boom(g);});}};
    // 門式框架（RMG 軌道式門式起重機／跨載機共用）：ax＝行走軸（'u'：軌道沿 u、跨距沿 v）
    // o.a0／o.a1＝兩側腿所在的跨距座標；o.b0、o.bw＝同側兩腿沿行走軸的位置；h＝主樑底高；c0/c1＝兩端懸臂；tr＝小車位置；hs＝吊具高；load＝吊著的貨櫃色
    const portal=(S,ax,o)=>{const C=o.col||'#e3e1da',Ct=SH(C,20),Cl=C,Cd=SH(C,o.cdk!=null?o.cdk:-48),Acc=o.acc||'#3e6c96',h=o.h,a0=o.a0,a1=o.a1,b0=o.b0,bw=o.bw,b1=b0+bw,sc=o.kind==='sc';
      const pt=(a,b,z)=>ax==='u'?P(b,a,z):P(a,b,z);
      const bx=(g,A0,B0,da,db,z,hh,t,l,r)=>ax==='u'?boxZ(g,B0,A0,db,da,z,hh,t,l,r):boxZ(g,A0,B0,da,db,z,hh,t,l,r);
      const lw=sc?.03:.05,c0=o.c0||0,c1=o.c1||0,tr=o.tr!=null?o.tr:(a0+a1)/2,bm=b0+bw/2;
      const side=(g,a)=>{
        bx(g,a-.035,b0-(sc?.03:.07),.07,bw+(sc?.06:.14),0,sc?3:4,'#6c7175','#5a5f63','#404448');                   // 台車梁
        for(const bb of(sc?[b0,b0+bw*.33,b0+bw*.66,b1]:[b0-.04,b0+.03,b1-.03,b1+.04])){const p=pt(a+.035,bb,0);RC(g,p[0]-1,p[1]-2,2,2,'#1f2124');}
        bx(g,a-lw/2,b0-lw/2,lw,lw,sc?3:4,h-(sc?3:4),Ct,Cl,Cd);bx(g,a-lw/2,b1-lw/2,lw,lw,sc?3:4,h-(sc?3:4),Ct,Cl,Cd);   // 腿
        if(sc)bx(g,a-.025,b0-.025,.05,bw+.05,h-3,3,Ct,Cl,Cd);else bx(g,a-.03,b0-.03,.06,bw+.06,h-5,5,Ct,Cl,Cd);   // 門楣
        if(!sc){BL(g,pt(a+.028,b0+.03,7),pt(a+.028,b1-.03,h-6),Cd);BL(g,pt(a+.028,b1-.03,7),pt(a+.028,b0+.03,h-6),Cd);}
        else BL(g,pt(a+.02,b0+.02,5),pt(a+.02,b1-.02,h-6),Cd);};
      const dF=o.dF!=null?o.dF:a0+b0-.12,dN=o.dN!=null?o.dN:(ax==='u'?b1+a1+.06:a1+b1+.06);
      S.o(dF,(g)=>side(g,a0));
      if(o.hs!=null){
        const dL=o.dL!=null?o.dL:dN-.02;
        S.t(dL-.001,(g)=>{for(const db of[-.14,.14]){BL(g,pt(tr,bm+db,h-1),pt(tr,bm+db,o.hs+2),'#3a3f44');}});
        S.o(dL,(g)=>{if(o.load){if(ax==='u')ctrU(g,bm-.2,tr-.0425,.4,CW,o.hs-4,o.load);else ctrV(g,tr-.0425,bm-.2,.4,CW,o.hs-4,o.load);}
          bx(g,tr-.045,bm-.2,.09,.4,o.hs,2,'#f0cf5a','#e5c14a','#b18f2c');});}
      S.o(dN,(g,n)=>{side(g,a1);
        const gd=(b)=>{bx(g,a0-c0-.03,b-.025,a1-a0+c0+c1+.06,.05,sc?h-3:h,sc?3:5,Ct,Cl,Cd);
          if(!sc){const p0=pt(a0-c0-.03,b+.025,h+1),p1=pt(a1+c1+.03,b+.025,h+1);BL(g,p0,p1,SH(Cl,-14));}};
        gd(b0);
        if(sc){bx(g,a0,b0-.02,a1-a0,.1,h,4,SH(Acc,26),Acc,SH(Acc,-42));                                                   // 引擎艙（後端橫跨）
          const cb=o.cabB!=null?o.cabB:b1-.1;bx(g,a1-.06,cb,.085,.1,h-5,9,'#ecece8','#dcdcd6','#a9aaa6');                // 司機室（前端右上角）
          if(ax==='v'){winL(g,a1-.05,cb+.1,h-1,3,4,'#3f5f78');if(n)winL(n,a1-.05,cb+.1,h-1,3,4,'#ffe2a0');}
          else{winR(g,cb+.1,a1+.02,h-1,3,4,'#34506a');if(n)winR(n,cb+.1,a1+.02,h-1,3,4,'#ffe2a0');}
          gd(b1);
          const r=pt(a0+.03,b0+.05,h+6);RC(g,r[0],r[1]-1,1,1,'#e39a2e');if(n){RC(n,r[0],r[1]-1,1,1,'#ffb84a');}}
        else{bx(g,tr-.07,b0-.02,.14,bw+.04,h+5,4,'#c9cbc7','#dcdcd6','#9ea09c');                                          // 小車
          const cabA=o.cabA!=null?o.cabA:tr+.08;bx(g,cabA,b1-.12,.08,.1,h-9,8,'#ecece8','#dcdcd6','#a9aaa6');           // 司機室
          if(ax==='u'){winL(g,b1-.11,cabA+.08,h-6,3,4,'#3f5f78');if(n)winL(n,b1-.11,cabA+.08,h-6,3,4,'#ffe2a0');}
          else{winL(g,cabA+.01,b1-.02,h-6,2,4,'#3f5f78');winR(g,cabA+.08,b1-.02,h-6,3,4,'#34506a');if(n){winR(n,cabA+.08,b1-.02,h-6,3,4,'#ffe2a0');}}
          gd(b1);
          const eh=o.eh!=null?o.eh:a1-.02;bx(g,eh-.05,b0+.1,.1,bw-.2,h+5,5,'#d4d6d2','#e6e7e3','#a4a7a3');              // 機電房
          if(ax==='u'){faceL(g,eh+.05,b0+.1,b1-.1,h+7,h+9,Acc);}else{faceR(g,eh+.05,b0+.1,b1-.1,h+7,h+9,Acc);}
          const red=(p)=>{RC(g,p[0],p[1]-1,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-1,1,1,'#ff5a48');};
          red(pt(a0-c0-.02,b1,h+6));red(pt(a1+c1+.02,b1,h+6));red(pt(eh,bm,h+11));
          for(const a of[a0+.05,a1-.05,...(c1>.2?[a1+c1-.06]:[])]){const p=pt(a,b1+.01,h-1);RC(g,p[0],p[1],2,1,'#e8e2c8');if(n){RC(n,p[0],p[1],2,1,'#fff2cc');}}}});};
    // 跨載機（straddle carrier）：又高又窄的門架車。ax＝行進軸（'v'：沿 v 行駛、跨距沿 u）；a0＝遠側腿（橫向座標小的一側）、b0＝後腿；
    // 兩側各一條下樑（兩端黑輪組）＋前後兩支細腿（中間鏤空）＋頂縱樑；頂上前後兩道橫樑；紅色引擎艙縮成後橫樑遠側的小艙；
    // 司機室在前端近側、掛在頂樑下（車頭一律朝 +b，看得到窗）；hs＝吊具底高、load＝吊著的貨櫃色（懸在兩側腿中間）
    const straddle=(S,ax,a0,b0,o={})=>{const sp=o.sp||.175,ln=o.ln||.3,h=o.h||27,col=o.col||'#e4e2da',acc=o.acc||'#c24a33',lw=.03;
      const a1=a0+sp,b1=b0+ln,am=a0+(sp+lw)/2,bm=b0+(ln+lw)/2,Ct=SH(col,14),Cl=col,Cd=SH(col,-46);
      const bx=(g,A0,B0,da,db,z,hh,t,l,r)=>ax==='u'?boxZ(g,B0,A0,db,da,z,hh,t,l,r):boxZ(g,A0,B0,da,db,z,hh,t,l,r);
      const pt=(a,b,z)=>ax==='u'?P(b,a,z):P(a,b,z);
      const side=(g,a,k=0)=>{const t=SH(Ct,k),l=SH(Cl,k),r=SH(Cd,k);                                                  // k＜0：遠側框略暗，拉開前後層次
        bx(g,a-.005,b0-.05,lw+.01,ln+lw+.1,2,2,'#5f6468','#71767a','#474b4f');                                         // 下樑
        for(const bb of[b0-.03,b0+.03,b1,b1+.06]){const p=pt(a+lw+.005,bb,0);RC(g,p[0]-1,p[1]-2,2,2,'#17191b');}       // 輪組
        bx(g,a,b0,lw,lw,4,h-6,t,l,r);bx(g,a,b1,lw,lw,4,h-6,t,l,r);                                                     // 前後腿（細）
        bx(g,a-.004,b0-.01,lw+.008,ln+lw+.02,h-2,2,t,l,r);                                                               // 頂縱樑
        BL(g,pt(a+lw,b0+lw,h-6),pt(a+lw,b0+lw+.05,h-2),r);BL(g,pt(a+lw,b1,h-6),pt(a+lw,b1-.05,h-2),r);};                 // 角撐（門形轉角）
      const dF=o.dF!=null?o.dF:a0+b0,dL=o.dL!=null?o.dL:a0+b0+.1,dN=o.dN!=null?o.dN:a1+b0+.05;
      S.o(dF,(g)=>side(g,a0,-16));
      if(o.hs!=null){
        S.t(dL-.001,(g)=>{for(const da of[-.025,.025])for(const db of[-.09,.09])BL(g,pt(am+da,bm+db,h-2),pt(am+da,bm+db,o.hs+2),'#3a3f44');});
        S.o(dL,(g)=>{if(o.load){if(ax==='v')ctrV(g,am-CW/2,bm-.2,.4,CW,o.hs-4,o.load);else ctrU(g,bm-.2,am-CW/2,.4,CW,o.hs-4,o.load);}
          bx(g,am-.035,bm-.18,.07,.36,o.hs,1,'#f0cf5a','#e5c14a','#b18f2c');bx(g,am-.025,bm-.04,.05,.08,o.hs+1,2,'#f0cf5a','#e5c14a','#b18f2c');});}
      S.o(dN,(g,n)=>{side(g,a1);
        bx(g,a0-.004,b0-.01,sp+lw+.008,.035,h-2,2,Ct,Cl,Cd);bx(g,a0-.004,b1-.005,sp+lw+.008,.035,h-2,2,Ct,Cl,Cd);      // 前後橫樑（細）
        bx(g,a0-.008,b0-.03,.06,.1,h,3,SH(acc,26),acc,SH(acc,-44));                                                      // 引擎艙（後端遠側小艙）
        bx(g,a1-.03,b1+.015,.06,.06,h-4,5,'#e9ebe9','#2f4a60','#223747');                                                // 司機室（前端近側、玻璃）
        if(n){if(ax==='v')faceL(n,b1+.075,a1-.025,a1+.025,h-3,h-1,'#ffe2a0');else faceR(n,b1+.075,a1-.025,a1+.025,h-3,h-1,'#ffe2a0');}
        const r=pt(a0+.02,b0+.02,h+3);RC(g,r[0],r[1]-1,1,1,'#e39a2e');if(n)RC(n,r[0],r[1]-1,1,1,'#ffb84a');});};
    const straddleSh=(ax,a0,b0,o={})=>{const sp=o.sp||.175,ln=o.ln||.3,h=o.h||27,a1=a0+sp,b1=b0+ln,out=[];
      const Bx=(A0,B0,da,db,hh,z)=>ax==='u'?['b',B0,A0,db,da,hh,z]:['b',A0,B0,da,db,hh,z];
      const Pp=(a,b,hh)=>ax==='u'?['p',b,a,hh]:['p',a,b,hh];
      for(const a of[a0,a1]){out.push(Pp(a,b0,h),Pp(a,b1,h),Bx(a,b0-.015,.04,ln+.06,3,h-3),Bx(a,b0-.05,.04,ln+.13,2,2));}
      out.push(Bx(a0,b0,sp,.04,3,h-2),Bx(a0,b1,sp,.04,3,h-2));
      if(o.hs!=null)out.push(Bx(a0+sp/2-.04,b0+ln/2-.2,.1,.4,6,o.hs-4));return out;};
    // 貨櫃平車（沿 u／沿 v）：vr＝左軌；load＝[色]（40 呎）｜[色,色]（兩個 20 呎）｜{w:[下,上]}（雙層井型車）｜null（空車）
    const railCar=(S,ax,b,r,Lc,load,d)=>{const c=r+GA/2;
      const bx=(g,b0,db,a0,da,z,h,t,l,rr)=>ax==='u'?boxZ(g,b0,a0,db,da,z,h,t,l,rr):boxZ(g,a0,b0,da,db,z,h,t,l,rr);
      const pt=(bb,aa,z)=>ax==='u'?P(bb,aa,z):P(aa,bb,z);
      const ct=(g,b0,L,z,col)=>{if(ax==='u')ctrU(g,b0,c-CW/2,L,CW,z,col);else ctrV(g,c-CW/2,b0,L,CW,z,col);};
      // 轉向架（側架＋看得到那側兩個黑輪）在兩端；中段是魚腹中樑，下方露空；車台側樑在 z4–5；貨櫃只放一層
      const bogie=(g,t,Lb=.1)=>{bx(g,t,Lb,c-.055,.11,1,3,'#3a3d40','#4e5154','#2b2e30');
        for(const w of[t+.014,t+Lb-.03]){const p=ax==='u'?pt(w,c+.055,0):pt(w+.02,c+.055,0);RC(g,p[0]-1,p[1]-2,2,2,'#131517');}};
      S.o(d!=null?d:b+c+.06,(g)=>{const well=load&&load.w;
        for(const t of[b+.03,b+Lc-.13])bogie(g,t);
        // 車台骨架：兩端平台（壓在轉向架上）＋中央脊樑（中段魚腹下垂）＋細橫樑；空車看得到骨架與下方的道碴
        bx(g,b+.18,Lc-.36,c-.02,.04,2,1,'#3f322b','#4d3d33','#30261f');
        bx(g,b+.09,Lc-.18,c-.03,.06,3,2,'#5f4a3d','#513f34','#3d2f27');
        for(const e of[b+.005,b+Lc-.105])bx(g,e,.1,c-.06,.12,4,1,'#9a6a50','#7f4e39','#5c392a');
        for(let t=b+.15;t<b+Lc-.13;t+=.075)bx(g,t,.014,c-.055,.11,4,1,'#8a5c46','#6e4533','#50311f');
        for(const e of[b,b+Lc-.012])bx(g,e,.012,c-.015,.03,3,1,'#2a2c2e','#3a3c3e','#202224');             // 車鉤
        if(well){ct(g,b+.02,.4,5,load.w[0]);if(load.w[1])ct(g,b+.02,.4,9,load.w[1]);}
        else if(load&&load.length===1)ct(g,b+.02,.4,5,load[0]);else if(load&&load.length===2){ct(g,b+.015,.195,5,load[0]);ct(g,b+.225,.195,5,load[1]);}});};
    const loco=(S,ax,b,r,col,fw,d)=>{const c=r+GA/2,Lc=.6;
      const bx=(g,b0,db,a0,da,z,h,t,l,rr)=>ax==='u'?boxZ(g,b0,a0,db,da,z,h,t,l,rr):boxZ(g,a0,b0,da,db,z,h,t,l,rr);
      const pt=(bb,aa,z)=>ax==='u'?P(bb,aa,z):P(aa,bb,z);
      S.o(d!=null?d:b+c+.07,(g,n)=>{for(const t of[b+.05,b+Lc-.19]){bx(g,t,.14,c-.055,.11,1,3,'#3a3d40','#4e5154','#2b2e30');
          for(const w of[t+.014,t+.06,t+.106]){const p=ax==='u'?pt(w,c+.055,0):pt(w+.02,c+.055,0);RC(g,p[0]-1,p[1]-2,2,2,'#131517');}}
        bx(g,b+.21,Lc-.42,c-.04,.08,2,2,'#2f3235','#3b3e41','#26282a');                                  // 油箱
        bx(g,b,Lc,c-.06,.12,4,2,'#3c3f42','#4a4d50','#2e3133');                                           // 車架
        const cb=fw?b+Lc-.14:b+.01;
        bx(g,fw?b+.03:b+.16,Lc-.19,c-.045,.09,6,7,SH(col,24),col,SH(col,-44));               // 機器間
        bx(g,cb,.13,c-.06,.12,6,10,SH(col,24),col,SH(col,-44));                                  // 司機室
        if(ax==='u'){faceL(g,c+.06,b+.02,b+Lc-.02,7,8,'#e2b73e');winL(g,cb+.02,c+.06,12,3,3,'#34495a');if(fw)faceR(g,cb+.13,c-.045,c+.05,12,15,'#2e4252');}
        else{faceR(g,c+.06,b+.02,b+Lc-.02,7,8,'#b08a2c');winR(g,c+.06,cb+.1,12,3,3,'#34495a');if(fw)faceL(g,cb+.13,c-.045,c+.05,12,15,'#3d5a70');}
        for(let t=b+.08;t<b+Lc-.18;t+=.08){const p=pt(t,c,13);RC(g,p[0],p[1],2,1,SH(col,-24));}
        if(n){const hb=fw?cb+.13:cb,h1=pt(hb,c,10);RC(n,h1[0],h1[1],1,1,'#fff3c8');if(ax==='u')winL(n,cb+.02,c+.06,12,3,3,'#ffe2a0');else winR(n,c+.06,cb+.1,12,3,3,'#ffe2a0');}});};
    // 控制塔：細高塔身＋外挑玻璃塔頂
    const tower=(S,u0,v0,s,h,o={})=>S.o(o.d!=null?o.d:u0+v0+s,(g,n)=>{const wl=o.wl||'#e2ded3',wr=o.wr||'#b3aea3',u1=u0+s,v1=v0+s,e=.05;
      boxZ(g,u0,v0,s,s,0,h,wl,wl,wr);
      for(let z=6;z<h-4;z+=6){winL(g,u0+s*.35,v1,z,2,3,'#48708f');winR(g,u1,v0+s*.55,z,2,3,'#48708f');if(n&&hsh(1699,z,1)<.5)winL(n,u0+s*.35,v1,z,2,3,'#ffe3a0');}
      boxZ(g,u0-e,v0-e,s+2*e,s+2*e,h,2,'#c9c5ba','#bdb9ae','#8e8a81');
      boxZ(g,u0-e,v0-e,s+2*e,s+2*e,h+2,6,'#6e7a80','#35516a','#28405a');
      for(let k=0;k<4;k++){const t=u0-e+(s+2*e)*(k+.5)/4;BL(g,P(t,v1+e,h+2),P(t,v1+e,h+7),'#223344');}
      if(n){faceL(n,v1+e,u0-e+.02,u1+e-.02,h+3,h+7,'rgba(255,228,160,.9)');faceR(n,u1+e,v0-e+.02,v1+e-.02,h+3,h+7,'rgba(240,210,140,.8)');}
      boxZ(g,u0-e-.01,v0-e-.01,s+2*e+.02,s+2*e+.02,h+8,2,'#d9dcdc','#cfd2d2','#9ea3a5');
      const a=P(u0+s*.5,v0+s*.5,h+10);RC(g,a[0],a[1]-8,1,8,'#7d858a');RC(g,a[0],a[1]-9,1,1,'#d0392c');if(n)RC(n,a[0],a[1]-9,1,1,'#ff5a48');});
    // 高桿照明：燈冠一圈；夜裡只亮燈冠
    const mast=(S,u,v,h=46,d)=>S.o(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');RC(g,x+1,y-h+2,1,h-4,'#80878c');
      RC(g,x-3,y-h-2,7,2,'#5b6166');RC(g,x-3,y-h-2,7,1,'#9aa1a6');RC(g,x-3,y-h,7,1,'#e9e2c4');
      if(n){RC(n,x-3,y-h,7,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,232,170,.5)');}});
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    // 辦公樓（平頂、女兒牆、分層窗帶、玻璃門廳）
    const office=(S,u0,v0,du,dv,fl,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+Math.min(du,dv)-.01,(g,n)=>{const fh=7,h=fl*fh+3,wl=o.wl||'#e5e1d6',wr=o.wr||'#bbb6ab',gl=o.gl||'#48708f',roof=o.roof||'#8e9598';
      boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.03,v0+.03,du-.06,dv-.06,roof,h);
      BL(g,P(u0+.03,v0+.03,h),P(u0+du-.03,v0+.03,h),SH(roof,-20));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v0+dv-.03,h),SH(roof,-14));BL(g,P(u0,v0+dv,h),P(u0+du,v0+dv,h),SH(wl,18));
      for(let f=0;f<fl;f++){rowL(g,n,u0+.03,u0+du-.03,v0+dv,3+f*fh,4,3,2,gl,seed+f,.6);rowR(g,n,u0+du,v0+.03,v0+dv-.03,3+f*fh,3,3,2,gl,seed+f*7,.5);}
      if(o.band){faceL(g,v0+dv,u0,u0+du,h-2,h,o.band);faceR(g,u0+du,v0,v0+dv,h-2,h,SH(o.band,-40));}
      if(o.door!==false){const um=u0+du*(o.doorAt||.5);boxZ(g,um-.1,v0+dv,.2,.07,6,1,'#eef0f1','#f6f7f8','#b8bfc3');winL(g,um-.05,v0+dv,0,4,6,'#2f4c63');if(n)winL(n,um-.05,v0+dv,0,4,6,'#ffe6a8');}
      boxZ(g,u0+du*.2,v0+dv*.25,.14,.12,h,3,'#c9ced1','#dde1e3','#a9b0b4');boxZ(g,u0+du*.6,v0+dv*.35,.1,.1,h,2,'#b9c0c4','#ced4d7','#9aa2a6');});
    // 拆併櫃倉庫（CFS）：長向沿 u；+v 面成排卸貨門＋雨遮；roof＝'gable'|'flat'；o.back＝-v 側也有門（交叉理貨，看不到就不畫）
    const cfs=(S,u0,v0,du,dv,h,o={})=>{const u1=u0+du,v1=v0+dv,vm=v0+dv/2,rh=o.rh!=null?o.rh:5,roof=o.roof||'gable';
      const wl=o.wl||'#d5d7d2',wr=o.wr||'#a7acaa',rl=o.rl||'#8d989e',rd=o.rd||'#6c777d',nd=o.doors||8,seed=o.seed||1,hc=o.hc||11;
      S.o(o.d!=null?o.d:u0+v1-.02,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
        faceL(g,v1,u0,u1,0,2,'#a39e92');faceR(g,u1,v0,v1,0,2,'#817d73');                         // 混凝土勒腳
        ribsL(g,u0,u1,v1,2,h,SH(wl,-10),3);ribsR(g,u1,v0,v1,2,h,SH(wr,-10),3);
        faceL(g,v1,u0,u1,h-2,h,SH(wl,10));faceR(g,u1,v0,v1,h-2,h,SH(wr,6));                         // 簷口帶
        if(roof==='gable'){const ov=.02;
          fp(g,[P(u0-ov,v0-ov,h),P(u1+ov,v0-ov,h),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);          // 後坡
          fp(g,[P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),P(u1+ov,v1+ov,h),P(u0-ov,v1+ov,h)],rl);          // 前坡（受光）
          fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);                                          // 山牆三角
          for(let t=u0+.05;t<u1-.02;t+=.09)BL(g,P(t,vm,h+rh),P(t,v1+.02,h),SH(rl,-9));                // 屋面浪板
          for(let t=u0+.05;t<u1-.02;t+=.09)BL(g,P(t,vm,h+rh),P(t,v0-.02,h),SH(rd,-8));
          for(let k=0;k<(o.sky||4);k++){const t=u0+du*(k+.5)/(o.sky||4)-.12;fp(g,[P(t,vm-.02,h+rh-1),P(t+.24,vm-.02,h+rh-1),P(t+.24,vm+dv*.3,h+rh*(1-.6)),P(t,vm+dv*.3,h+rh*(1-.6))],'#b8c7cc');}   // 採光帶
          BL(g,P(u0-.02,vm,h+rh),P(u1+.02,vm,h+rh),SH(rl,24));
          for(let k=0;k<(o.vents||3);k++){const t=u0+du*(k+.5)/(o.vents||3);boxZ(g,t-.03,vm-.03,.06,.06,h+rh,2,'#b3b9bc','#c5cacd','#8f969a');}}
        else{flat(g,u0+.03,v0+.03,du-.06,dv-.06,rl,h);BL(g,P(u0+.03,v0+.03,h),P(u1-.03,v0+.03,h),SH(rl,-20));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v1-.03,h),SH(rl,-14));
          for(let k=0;k<(o.sky||5);k++){const t=u0+.12+(du-.34)*k/Math.max(1,(o.sky||5)-1);flat(g,t,v0+.1,.1,dv-.2,'#a3b6bf',h);BL(g,P(t,v0+.1,h),P(t,v1-.1,h),'#c9d7dc');BL(g,P(t+.1,v0+.1,h),P(t+.1,v1-.1,h),SH(rl,-18));}
          for(let k=0;k<(o.units||4);k++){const t=u0+.2+(du-.5)*k/Math.max(1,(o.units||4)-1)+.05;boxZ(g,t,v0+dv*.4,.13,.12,h,4,'#9ea6aa','#b4bbbe','#737b80');const f=P(t+.065,v0+dv*.46,h+4);ell(g,f[0],f[1],2,1,'#5d6569');}}
        // 卸貨門＋門燈
        for(let k=0;k<nd;k++){const t=u0+du*(k+.5)/nd-.06,dh=Math.min(8,hc-3);
          winL(g,t-.01,v1,0,6,dh+1,'#2a2d30');winL(g,t,v1,1,4,dh-1,'#6f787d');for(let z=2;z<dh;z+=2)winL(g,t,v1,z,4,1,'#5c656a');
          const lp=P(t+.06,v1,hc-1);RC(g,lp[0],lp[1]-1,2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1]-1,2,1,'#ffe6a0');}
        // 端牆：人員門、窗、招牌
        if(o.endWin!==false){rowR(g,n,u1,v0+.08,v1-.08,h-7,3,2,3,'#4d6f88',seed,.45);const dp=P(u1,v0+dv*.3,0);pg(g,dp[0],dp[1]-6,3,6,-.5,'#5a4a3c');}
        if(o.sign){faceR(g,u1,v0+dv*.25,v1-dv*.25,h-5,h-2,o.sign);}
        // 雨遮（懸挑）：沿 +v 面
        if(o.canopy!==false){const cd=.12;fp(g,[P(u0,v1,hc),P(u1,v1,hc),P(u1,v1+cd,hc),P(u0,v1+cd,hc)],'#c9ccca');
          faceL(g,v1+cd,u0,u1,hc-1,hc,'#8c9294');faceR(g,u1,v1,v1+cd,hc-1,hc,'#6e7476');
          for(let t=u0+.05;t<u1;t+=.3){BL(g,P(t,v1,hc-1),P(t,v1+cd,hc-1),'#9ca2a4');}}});};
    // 閘口雨棚：跨在沿 ax 的車道上；(u0,v0,du,dv)＝棚頂範圍；lanes＝車道數；島上崗亭
    const gate=(S,u0,v0,du,dv,ax,o={})=>{const hz=o.h||13,lanes=o.lanes||2,fas=o.fas||'#3e6c96';
      const along=ax==='u';          // 車道沿 u：跨距沿 v
      const span0=along?v0:u0,span=along?dv:du,len0=along?u0:v0,len=along?du:dv;
      const pt=(a,b,z)=>along?P(b,a,z):P(a,b,z);
      const bx=(g,A0,B0,da,db,z,h,t,l,r)=>along?boxZ(g,B0,A0,db,da,z,h,t,l,r):boxZ(g,A0,B0,da,db,z,h,t,l,r);
      const isl=[];for(let k=0;k<=lanes;k++)isl.push(span0+span*k/lanes);
      // 島、崗亭、柵欄（在棚頂之前畫）
      S.o(o.d!=null?o.d-.02:(along?u0+v0+dv:u0+du+v0)-.02,(g,n)=>{
        for(const a of isl){bx(g,a-.03,len0+.02,.06,len-.04,0,1,'#d8d4c8','#c9c5b9','#a9a59a');
          bx(g,a-.02,len0+.03,.04,.04,1,hz-1,'#c7cbcd','#b9bec1','#8c9296');bx(g,a-.02,len0+len-.07,.04,.04,1,hz-1,'#c7cbcd','#b9bec1','#8c9296');}
        for(let k=1;k<isl.length-1;k++){const a=isl[k];bx(g,a-.035,len0+len*.35,.07,.12,1,8,'#e6e7e3','#dadbd6','#a8aaa6');
          if(along)winL(g,len0+len*.37,a+.035,4,3,3,'#3f5f78');else winR(g,a+.035,len0+len*.37,4,3,3,'#34506a');
          if(n){if(along)winL(n,len0+len*.37,a+.035,4,3,3,'#ffe2a0');else winR(n,a+.035,len0+len*.37,4,3,3,'#ffe2a0');}}
        for(let k=0;k<lanes;k++){const a=isl[k]+.03,b=len0+len*.8;const p=pt(a,b,4),q=pt(isl[k+1]-.04,b,4);
          RC(g,p[0]-1,p[1]-1,2,5,'#d9d6cc');for(let s=0;s<=6;s++){const t=s/6,x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]-p[1])*t;RC(g,x,y,1,1,s%2?'#c33b2e':'#f2f0ea');}}});
      // 棚頂
      S.o(o.d!=null?o.d:(along?u0+v0+dv:u0+du+v0),(g,n)=>{bx(g,span0-.04,len0,span+.08,len,hz,3,'#e3e5e3','#d4d7d6','#a5aaab');
        if(along){faceL(g,v0+dv+.04,u0,u0+du,hz,hz+3,fas);}else{faceR(g,u0+du+.04,v0,v0+dv,hz,hz+3,SH(fas,-26));}
        for(let k=0;k<lanes;k++){const a=(isl[k]+isl[k+1])/2,p=along?P(u0+du,a,hz):P(a,v0+dv,hz);RC(g,p[0]-1,p[1]-1,3,1,'#e8e2c8');if(n)RC(n,p[0]-1,p[1]-1,3,1,'#fff2cc');}
        if(o.label!==false){const p=along?P(u0+du*.3,v0+dv+.04,hz+2):P(u0+du+.04,v0+dv*.7,hz+2);RC(g,p[0],p[1]-1,4,1,'#f2f0ea');}});};

    return{P,hsh,RC,BL,BL2,fp,Q,flat,boxZ,faceL,faceR,ribsL,ribsR,pg,winL,winR,rowL,rowR,ell,scene,shadow,
      MATS,pave,lineU,lineV,dashU,dashV,YEL,WHT,GA,railCar,loco,tower,trackU,trackV,craneRailU,craneRailV,stallsU,stallsV,stain,fence,
      CPAL,cpick,ctrU,ctrV,CW,stackU,stackV,truck,car,reach,portal,straddle,straddleSh,mast,lamp,tree,bush,office,cfs,gate};
  };

  // 組裝：每類一個 K、每變體獨立畫布；DEV 映射只在迭代時使用
  const build=(k,layouts)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null;
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      // 菱形邊：前緣壓暗、後緣提亮（同 T575 地坪）
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}};
  const E=.04;
  const backFence=(L)=>(g)=>{L.fence(g,[E,E],[SZ-E,E]);L.fence(g,[E,E],[E,SZ-E]);};

  // ================= k165 貨櫃物流中心（內陸 CFS）=================
  try{
    const K165=[
      // v0 大倉庫＋堆場：後側一棟長條拆併櫃倉庫（成排卸貨門＋雨遮、貨車倒車靠台），前方兩個堆場區塊＋前作業道兩部正面吊；右側進出車道＋閘口＋員工停車
      (g,ng,S,L)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsV,stain,stackU,truck,car,reach,mast,lamp,tree,bush,office,cfs,gate}=L;
        pave(g,'y',0,0,SZ,SZ,16501);
        pave(g,'c',.12,.1,3.0,.85,16502);
        pave(g,'a',.12,.95,3.0,.87,16503);
        pave(g,'a',.12,2.24,3.0,.42,16504);pave(g,'a',.12,3.0,3.0,.6,16505);
        pave(g,'a',3.12,.1,.56,3.9,16506);
        pave(g,'a',3.7,.3,.28,2.7,16507);
        pave(g,'g',0,3.62,3.12,.38,16508);pave(g,'g',3.68,3.05,.32,.95,16509);pave(g,'g',3.68,.04,.3,.26,16510);
        backFence(L)(g);
        // 標線：靠台導引線、堆場邊線、車道中線
        lineU(g,.95,.12,3.12,'#d9d5c9');lineU(g,1.82,.12,3.12,YEL);
        for(let k=0;k<9;k++){const t=.22+2.5*(k+.5)/9;lineV(g,t-.02,.97,1.5,YEL);}
        lineU(g,1.88,.12,3.12,YEL);lineU(g,2.24,.12,3.12,YEL);lineU(g,2.66,.12,3.12,YEL);lineU(g,3.0,.12,3.12,YEL);dashU(g,3.3,.2,3.1,WHT,.12,.1);
        dashV(g,3.4,.2,3.95,WHT);lineV(g,3.14,.1,4,'#d9d5c9');lineV(g,3.66,.1,4,'#d9d5c9');
        lineU(g,3.2,3.14,3.66,WHT);lineU(g,3.62,3.14,3.66,WHT);
        stallsV(g,3.72,.36,2.6,13,.24);
        for(const[u,v,r] of[[.8,2.45,3],[1.9,2.42,2],[2.6,3.2,3],[1.2,3.5,2],[.5,1.6,3],[2.3,1.66,2],[3.3,1.2,3],[3.5,2.5,2]])stain(g,u,v,r);
        L.shadow(g,[['b',.22,.2,2.5,.75,20],['b',2.72,.2,.38,.5,21],
          ['b',.3,1.9,2.55,.34,9],['b',.3,2.66,2.55,.34,14]]);
        // 倉庫＋辦公附樓
        cfs(S,.22,.2,2.5,.75,17,{doors:9,seed:1651,sign:'#3e6c96',sky:5,vents:4});
        office(S,2.72,.2,.38,.5,2,1652,{band:'#3e6c96',door:false,d:2.72+.2+.38});
        // 靠台貨車（沿 v、車頭朝 +v）
        const dk=k=>.22+2.5*(k+.5)/9-.05;
        truck(S,dk(0),.97,'v+','#c6463a','box');truck(S,dk(2),.97,'v+','#e3e1da','#4d6f93');
        truck(S,dk(3),.97,'v+','#3f6a8e','box');truck(S,dk(5),.97,'v+','#d8d4c8','#a5533f');truck(S,dk(7),.97,'v+','#5b7a55','box');
        truck(S,.5,1.6,'u+','#e3e1da',null,.5+1.7+.6);
        // 堆場兩區（沿 u，每區 4 列）：A 區低（露出靠台）、B 區高；bay 主色成列
        const bays=(u0,n)=>Array.from({length:n},(_,i)=>u0+i*.43);
        const hsB=[3,4,3,3,4,3];
        stackU(S,bays(.3,6),1.9,4,{seed:61,hs:[2,2,3,1,2,2],tmax:3});
        stackU(S,bays(.3,6),2.66,4,{seed:62,hs:hsB,tmax:4,tiers:(i,j)=>(i===1||i===4)&&j===3?2:(j===3&&i===2?2:hsB[i])});
        truck(S,1.4,2.36,'u+','#3f6a8e','#a5533f',1.4+2.36+.5);
        // 前作業道：兩部正面吊背對鏡頭，把櫃放上 B 區前排
        reach(S,.73+.14,3.037,'v',false,{load:'#5a8464',lz:9,d:.87+3.04+.35,dl:.73+3.0});
        reach(S,2.02+.14,3.037,'v',false,{load:'#d0cfc7',lz:9,col:'#dfa12c',d:2.16+3.04+.35,dl:2.02+3.0});
        truck(S,1.38,3.42,'u+','#c6463a','#4d6f93');
        // 車道上的進出車
        truck(S,3.18,1.9,'v-','#b8452f','#4d6f93');truck(S,3.45,2.5,'v+','#3f6a8e',null);truck(S,3.18,.55,'v-','#d8d4c8','box');
        gate(S,3.12,3.22,.56,.36,'v',{lanes:2,fas:'#3e6c96',d:3.68+3.22});
        for(const[k,c] of[[0,'#b8433a'],[1,'#e8ecee'],[3,'#3d5f8a'],[4,'#c9c3b4'],[6,'#5d6468'],[7,'#e8ecee'],[9,'#9a3a33'],[11,'#3d5f8a']]){car(S,3.74,.36+2.6*(k+.5)/13-.035,true,c);}
        // 照明
        mast(S,.16,2.45,46);mast(S,3.05,2.45,46);mast(S,3.05,1.35,46);mast(S,.16,1.35,46);
        lamp(S,3.1,3.8);lamp(S,3.7,3.8);
        for(const[u,v,s,k] of[[.3,3.82,.9,0],[.75,3.8,.8,1],[1.25,3.82,.9,2],[1.75,3.8,.8,0],[2.25,3.82,.9,1],[2.75,3.8,.8,2],[3.85,3.3,.8,0],[3.85,3.7,.9,1],[3.85,.14,.7,2]])tree(S,u,v,s,k);
        bush(S,.55,3.72);bush(S,1.5,3.74);bush(S,2.5,3.72);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.77,.93]]);}};
      },
      // v1 堆場＋跨載機：沿 v 的單列貨櫃（1–3 層）由跨載機跨行作業；後側維修棚＋控制樓；右側交換區（貨車待裝）＋閘口
      (g,ng,S,L)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stain,stackV,truck,car,straddle,straddleSh,mast,lamp,tree,bush,office,cfs,gate,boxZ,faceL,faceR,ribsL,ribsR,winL,rowR,rowL,flat,CW}=L;
        pave(g,'y',0,0,SZ,SZ,16521);
        pave(g,'c',.1,.1,2.0,.72,16522);
        pave(g,'a',.1,.82,3.0,.3,16523);          // 後側橫向跑道
        pave(g,'a',.1,3.3,3.0,.36,16524);         // 前側橫向跑道
        pave(g,'a',2.86,.82,.3,2.84,16525);       // 交換區車道
        pave(g,'a',3.16,.1,.52,3.9,16526);        // 進出車道
        pave(g,'g',0,3.7,3.14,.3,16527);pave(g,'g',3.7,.1,.3,3.9,16528);
        backFence(L)(g);
        // 跨載機行駛標線：每列兩側
        const rows=[.3,.56,.82,1.08,1.34,1.6,1.86,2.12,2.38];
        // 跨載機配置 [行進軸, 遠側腿 a0, 後腿 b0, 參數]：列上兩部（一部把櫃放進空位、一部在列頭從堆上吊起）、交換區一部跨在貨車上放櫃、前後跑道各一部低位載櫃行駛
        const SCS=[['v',.5,1.585,{hs:9,load:'#a5533f'}],['v',1.28,2.895,{hs:11,load:'#4d6f93',dL:1.28+2.895+.13}],
          ['v',2.8375,1.975,{hs:8,load:'#5a8464',dF:2.83+1.9,dL:2.9+1.92+.44,dN:2.9+1.92+.46}],
          ['u',3.39,2.0,{hs:6,load:'#d0cfc7'}],['u',.88,.42,{hs:6,load:'#b8763d'}]];
        for(const u of rows){lineV(g,u-.07,1.12,3.3,'#d9d5c9');lineV(g,u+CW+.07,1.12,3.3,'#d9d5c9');}
        lineU(g,1.12,.1,2.86,YEL);lineU(g,3.3,.1,2.86,YEL);lineU(g,.82,.1,3.16,YEL);lineU(g,3.66,.1,3.16,YEL);
        for(let k=0;k<6;k++){const v=1.2+k*.36;lineU(g,v,2.86,3.16,WHT);}
        dashV(g,3.42,.2,3.95,WHT);lineV(g,3.16,.1,4,'#d9d5c9');
        for(const[u,v,r] of[[.7,3.45,3],[1.9,3.5,2],[2.5,.95,3],[3.0,2.1,2],[3.4,1.3,3]])stain(g,u,v,r);
        L.shadow(g,[['b',.15,.15,.9,.62,26],['b',1.2,.2,.55,.45,24],['b',1.85,.3,.25,.4,10],['b',2.14,.18,.93,.4,7],
          ...SCS.flatMap(s=>straddleSh(s[0],s[1],s[2],s[3]))]);
        // 維修棚（跨載機高門）
        S.o(.15+.77,(g2,n)=>{const u0=.15,v0=.15,du=.9,dv=.62,h=26,u1=u0+du,v1=v0+dv,wl='#cfd3d0',wr='#9fa5a4';
          boxZ(g2,u0,v0,du,dv,0,h,wl,wl,wr);ribsL(g2,u0,u1,v1,2,h,SH(wl,-10),3);ribsR(g2,u1,v0,v1,2,h,SH(wr,-10),3);
          const vm=v0+dv/2;L.fp(g2,[P(u0-.02,v0-.02,h),P(u1+.02,v0-.02,h),P(u1+.02,vm,h+4),P(u0-.02,vm,h+4)],'#66727a');
          L.fp(g2,[P(u0-.02,vm,h+4),P(u1+.02,vm,h+4),P(u1+.02,v1+.02,h),P(u0-.02,v1+.02,h)],'#87939a');L.fp(g2,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+4)],wr);
          for(let t=u0+.04;t<u1;t+=.08)L.BL(g2,P(t,vm,h+4),P(t,v1+.02,h),'#7b878e');
          for(const t of[u0+.12,u0+.52]){winL(g2,t,v1,0,10,21,'#3a3d40');winL(g2,t+.02,v1,1,8,19,'#737c81');for(let z=3;z<20;z+=3)winL(g2,t+.02,v1,z,8,1,'#626a6f');
            const lp=P(t+.16,v1,23);L.RC(g2,lp[0],lp[1],2,1,'#efe2b0');if(n)L.RC(n,lp[0],lp[1],2,1,'#ffe6a0');}
          rowR(g2,n,u1,v0+.06,v1-.06,h-9,3,3,3,'#4d6f88',1653,.5);faceL(g2,v1,u0,u1,h-3,h-1,'#3e6c96');});
        office(S,1.2,.2,.55,.45,3,1654,{band:'#b8452f'});
        // 燃料／清洗亭
        S.o(1.85+.3+.25,(g2)=>{boxZ(g2,1.85,.3,.25,.4,0,1,'#d8d4c8','#c9c5b9','#a9a59a');boxZ(g2,1.9,.4,.06,.06,1,8,'#c33b2e','#d7574a','#9b3026');boxZ(g2,1.82,.28,.3,.44,9,2,'#e8e8e3','#dcdcd6','#a9aba7');});
        // 冷藏櫃區：冷藏櫃沿 v 排開、機組端（+v 受光面：灰框＋深色格柵＋狀態燈）朝前面的插電架；櫃與櫃之間留縫，20／40 呎混排、1–2 層
        const RW=['#e3e4df','#d6dad8','#e9e6dd','#cfd5d8'];
        const machV=(g2,u0,v1,z)=>{L.faceL(g2,v1,u0,u0+CW,z,z+4,'#7c858a');L.faceL(g2,v1,u0+.018,u0+CW-.012,z+1,z+3,'#454d52');const e=P(u0+.02,v1,z+3);L.RC(g2,e[0],e[1]-1,1,1,'#8fe0a6');};
        for(let k=0;k<8;k++){const u0=2.14+k*.12,nt=[2,2,1,2,2,1,2,1][k],twenty=k===2||k===5;
          const segs=twenty?[[.18,.195],[.385,.195]]:[[.18,.4]];
          segs.forEach(([v0,Lr],si)=>S.o(u0+v0+Lr/2,(g2)=>{for(let t=0;t<(twenty&&si===0?1:nt);t++){L.ctrV(g2,u0,v0,Lr,CW,t*4,RW[(k+t+si)%4]);if(si===segs.length-1)machV(g2,u0,v0+Lr,t*4);}}));}
        // 插電架：細鋼柱（每兩櫃一根）、z4 格柵走道、黃扶手、頂上電纜槽、右端爬梯
        S.t(2.14+.66+.5,(g2)=>{const va=.6,vb=.69,ua=2.12,ub=3.08;
          for(let u=ua;u<=ub+.001;u+=.24)for(const v of[va,vb])L.BL(g2,P(u,v,0),P(u,v,10),v===va?'#6f777c':'#8e969b');
          L.fp(g2,[P(ua,va,4),P(ub,va,4),P(ub,vb,4),P(ua,vb,4)],'#8f989c');for(let u=ua+.03;u<ub;u+=.06)L.BL(g2,P(u,va,4),P(u,vb,4),'#7a8388');
          L.BL(g2,P(ua,vb,4),P(ub,vb,4),'#5d6569');L.BL(g2,P(ua,vb,7),P(ub,vb,7),'#d8b23c');
          L.BL(g2,P(ua,va,10),P(ub,va,10),'#5d6569');L.BL(g2,P(ua,va+.03,10),P(ub,va+.03,10),'#8e969b');
          L.BL(g2,P(ub,vb,4),P(ub+.08,vb,0),'#8e969b');L.BL(g2,P(ub,vb-.03,4),P(ub+.08,vb-.03,0),'#6f777c');});
        // 單列貨櫃（沿 v），每列 5 個 40 呎；空位留給跨載機
        const bays=[1.16,1.59,2.02,2.45,2.88].map(v=>v);
        // 空位與壓低：跨載機兩側鄰列同 bay 壓到 1 層，腿與輪組才看得到
        const gaps={'1,1':1,'3,3':1,'6,0':1,'7,4':1,'2,4':1};
        const low={'0,1':1,'2,1':1,'3,4':1,'5,4':1,'4,4':1};
        stackV(S,rows,bays.map(v=>v-.02),{seed:71,tmax:3,skip:(i,j)=>!!gaps[i+','+j],L:.4,tiers:(i,j)=>low[i+','+j]?1:1+(hsh(72,i*5+j,1)<.62?1:0)+(hsh(73,i*5+j,2)<.12?1:0)});
        // 交換區：貨車等待裝卸（沿 v）
        truck(S,2.9,1.2,'v+','#c6463a','#a5533f');truck(S,2.9,1.92,'v+','#3f6a8e',null);truck(S,2.9,2.64,'v+','#d8d4c8',null);
        for(const s of SCS)straddle(S,s[0],s[1],s[2],s[3]);
        truck(S,3.44,1.6,'v-','#e3e1da','#8d9598');truck(S,3.2,2.6,'v+','#5b7a55',null);truck(S,3.44,.9,'v-','#c6463a','#4d6f93');truck(S,3.2,3.3,'v+','#3f6a8e','#b8763d',3.68+3.26-.01);
        gate(S,3.16,3.26,.52,.34,'v',{lanes:2,fas:'#b8452f',d:3.68+3.26});
        for(const[u,v,c] of[[1.85,.72,'#b8433a']])car(S,u,v,true,c);
        // 照明高桿全放堆場外緣（左後緣一排、後側冷藏區旁、右側車道外）
        mast(S,.1,1.25,46);mast(S,.1,2.65,46);mast(S,1.95,.08,46);mast(S,3.12,.08,44);mast(S,3.74,2.3,44);
        lamp(S,3.12,3.8);lamp(S,3.72,3.8);lamp(S,3.72,.5);
        for(const[u,v,s,k] of[[.3,3.86,.9,0],[.8,3.84,.8,1],[1.3,3.86,.9,2],[1.8,3.84,.8,0],[2.3,3.86,.9,1],[2.8,3.84,.8,2],[3.86,.4,.8,0],[3.86,1.5,.9,1],[3.86,2.6,.8,2],[3.86,3.5,.9,0]])tree(S,u,v,s,k);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.79,.92]]);}};
      },
      // v2 雙倉庫夾中央車道：車道沿 u 從右前緣進；後棟卸貨面朝車道、前棟為交叉理貨倉（前面也有門，停著甩掛板架）；遠端小堆場＋正面吊；右後辦公樓
      (g,ng,S,L)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stallsV,stain,stackU,truck,car,reach,mast,lamp,tree,bush,office,cfs,gate,CW}=L;
        pave(g,'y',0,0,SZ,SZ,16541);
        pave(g,'c',1.0,.1,2.45,1.12,16542);
        pave(g,'a',.9,1.22,3.1,.5,16543);          // 後棟靠台
        pave(g,'a',0,1.72,4.0,.56,16544);          // 中央車道
        pave(g,'c',1.0,2.28,2.45,1.1,16545);
        pave(g,'a',1.0,3.38,2.45,.42,16546);       // 前棟板架區
        pave(g,'a',3.45,2.28,.55,1.72,16547);      // 停車場
        pave(g,'g',1.0,3.8,2.45,.2,16548);pave(g,'g',3.45,.1,.55,.18,16549);
        backFence(L)(g);
        lineU(g,1.72,0,4,YEL);lineU(g,2.28,0,4,YEL);dashU(g,2.0,0,4,WHT);
        for(let k=0;k<8;k++){const t=1.1+2.2*(k+.5)/8;lineV(g,t-.02,1.24,1.6,YEL);}
        for(let k=0;k<7;k++){const t=1.1+2.2*(k+.5)/7;lineV(g,t-.02,3.4,3.78,YEL);}
        stallsU(g,3.5,2.5,.45,3,.22);stallsU(g,3.5,3.1,.45,3,.22);
        lineV(g,.98,0,1.72,'#d9d5c9');lineV(g,.98,2.28,4,'#d9d5c9');
        for(const[u,v,r] of[[.6,1.9,3],[2.2,2.1,2],[3.0,1.45,3],[1.6,3.6,2],[3.7,2.0,2]])stain(g,u,v,r);
        L.shadow(g,[['b',1.1,.25,2.2,.9,18],['b',1.1,2.45,2.2,.85,14],['b',3.5,.3,.45,.5,24],['b',.1,.2,.84,.43,14],['b',.1,.95,.84,.43,12],['b',.1,2.4,.84,.43,14],['b',.1,3.1,.84,.43,12]]);
        // 遠端小堆場（沿 u，兩 bay×四列 ×4 區）
        // 兩 bay 之間留 .04 間隙（露出門端）、列距 .115（列間 1px 縫）、每列換色（每 bay 2–3 個主色）；前排常少一層（階梯）
        const bays=[.1,.54],PAL2=[['#4d6f93','#6b8fae','#8d9598'],['#b8763d','#a5533f','#d0cfc7'],['#5a8464','#8d9598','#4f8580'],['#a5533f','#7e5a43','#b39a4c']];
        const yc=(sd,pb)=>(i,j,t)=>{const p=PAL2[(pb+i)%4];return p[Math.floor(hsh(sd,i*7+j,t)*3)];};
        const yo=(sd,pb,tf)=>({seed:sd,seam:1,pitch:.115,tmax:4,col:yc(sd,pb),tiers:tf});
        stackU(S,bays,.2,4,yo(81,0,(i,j)=>[4,3][i]-(j===3?1:0)-(i===0&&j===2?1:0)));
        stackU(S,bays,.95,4,yo(82,2,(i,j)=>i===0&&j===3?2:(i===1&&j>=2?2:3)));
        stackU(S,bays,2.4,4,yo(83,1,(i,j)=>[3,4][i]-(j===3?1:0)-(i===1&&j===1?1:0)));
        stackU(S,bays,3.1,4,yo(84,3,(i,j)=>[2,3][i]-(j===3&&i===1?1:0)));
        // 正面吊：一部背對鏡頭把櫃放上 v.95 區前排；一部載櫃低位行駛
        reach(S,.12+.14,1.42,'v',false,{load:'#a5533f',lz:9,col:'#c24a33',d:.26+1.42+.4,dl:.12+1.39});
        reach(S,.5,2.02,'u',true,{load:'#6b8fae',lz:3,col:'#c24a33'});
        // 後棟：斜頂、卸貨門朝車道
        cfs(S,1.1,.25,2.2,.9,18,{doors:8,seed:1655,sky:4,vents:3,sign:'#c24a33'});
        const dk=k=>1.1+2.2*(k+.5)/8-.06;
        truck(S,dk(1)-.01,1.17,'v+','#3f6a8e','box');truck(S,dk(2)-.01,1.17,'v+','#e3e1da','#8d9598');truck(S,dk(4)-.01,1.17,'v+','#c6463a','box');truck(S,dk(6)-.01,1.17,'v+','#d8d4c8','#5a8464');
        // 車道上的車
        truck(S,1.4,1.82,'u+','#e3e1da','#a5533f');truck(S,2.5,2.08,'u-','#5b7a55','box');
        // 前棟：平頂交叉理貨倉（前面也有門）
        cfs(S,1.1,2.45,2.2,.85,14,{roof:'flat',doors:7,seed:1656,hc:10,units:4,sky:5,rl:'#8a9296',sign:'#3e6c96'});
        const fk=k=>1.1+2.2*(k+.5)/7-.06;
        // 甩掛板架（無車頭，支腿著地）
        for(const k of[0,2,3,5]){const u=fk(k)-.005,v=3.3;S.o(u+v+.45,(g2)=>{L.boxZ(g2,u,v+.01,.08,.43,1,1,'#45494d','#34383b','#55595d');
          const col=L.cpick(hsh(1657,k,1));L.ctrV(g2,u-.0025,v+.02,.4,CW,2,col);const p=P(u+.08,v+.4,0);L.RC(g2,p[0]-1,p[1]-2,2,2,'#1c1e21');const q=P(u+.08,v+.1,0);L.RC(g2,q[0],q[1]-2,1,2,'#3a3d40');});}
        // 閘口＋辦公樓
        gate(S,3.5,1.68,.4,.64,'u',{lanes:2,fas:'#c24a33',d:3.9+2.3});
        office(S,3.5,.3,.45,.5,3,1658,{band:'#c24a33',doorAt:.5});
        for(const[u,v,c] of[[3.52,2.52,'#b8433a'],[3.52,2.66,'#e8ecee'],[3.52,3.12,'#3d5f8a'],[3.52,3.4,'#c9c3b4'],[3.52,3.26,'#5d6468']])car(S,u,v,true,c);
        mast(S,.06,1.68,46);mast(S,.06,2.32,46);mast(S,3.42,1.6,46);mast(S,3.42,2.4,44);mast(S,.95,3.8,40);
        lamp(S,3.95,1.62);lamp(S,3.95,2.38);
        for(const[u,v,s,k] of[[1.3,3.9,.8,0],[1.8,3.9,.8,1],[2.3,3.9,.8,2],[2.8,3.9,.8,0],[3.3,3.9,.8,1],[3.9,3.9,.9,2],[3.9,3.4,.8,0],[3.9,2.8,.8,1],[3.5,.18,.7,2],[3.9,.2,.7,0]])tree(S,u,v,s,k);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.42,.58]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
    ];
    build(165,K165);
  }catch(e){console.error('logi_a k165',e);errs.push('k165:'+(e&&e.stack||e));}

  // ================= k166 鐵公路聯運中心 =================
  try{
    // RMG 落影（ax='u'：軌道沿 u）
    const rmgSh=(ax,b0,bw,a0,a1,c0,c1,h)=>{const L2=[],b1=b0+bw,sp=a1+c1-(a0-c0)+.06;
      const Bx=(bb,aa,db,da,hh,z)=>ax==='u'?['b',bb,aa,db,da,hh,z]:['b',aa,bb,da,db,hh,z];
      const Pp=(bb,aa,hh)=>ax==='u'?['p',bb,aa,hh]:['p',aa,bb,hh];
      for(const b of[b0,b1])L2.push(Bx(b-.025,a0-c0-.03,.05,sp,6,h));
      for(const a of[a0,a1]){L2.push(Bx(b0-.03,a-.03,bw+.06,.06,5,h-5));L2.push(Pp(b0,a,h));L2.push(Pp(b1,a,h));}
      return L2;};
    const K166=[
      // v0 後側三股軌道＋兩部大跨距 RMG（前側懸臂伸到卡車道）；軌道與卡車道之間一條貨櫃堆存帶；前區地面堆場＋正面吊、板架場、行政樓、閘口
      (g,ng,S,L)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,GA,trackU,craneRailU,stallsU,stallsV,stain,stackU,truck,car,reach,portal,railCar,loco,mast,lamp,tree,bush,office,gate,cpick,CW}=L;
        pave(g,'y',0,0,SZ,SZ,16601);
        pave(g,'b',0,.1,SZ,1.04,16602);
        trackU(g,.28,0,SZ,16603);trackU(g,.58,0,SZ,16604);trackU(g,.88,0,SZ,16605);
        pave(g,'c',0,1.12,SZ,.44,16606);
        pave(g,'a',0,1.66,SZ,.88,16607);
        craneRailU(g,.16,0,SZ);craneRailU(g,1.6,0,SZ);
        pave(g,'a',.1,2.98,2.7,.46,16608);
        pave(g,'c',.1,3.46,1.4,.46,16609);
        pave(g,'g',1.5,3.46,1.3,.54,16610);pave(g,'g',0,3.92,1.5,.08,16611);
        pave(g,'a',2.86,2.54,1.14,1.46,16612);
        lineU(g,1.66,0,SZ,YEL);dashU(g,2.1,.3,SZ,WHT);lineU(g,2.54,0,2.86,YEL);lineU(g,2.98,.1,2.8,YEL);lineU(g,3.44,.1,2.8,YEL);
        lineV(g,2.86,2.54,4,'#d9d5c9');stallsU(g,2.95,3.5,.9,6,.24);stallsU(g,2.95,3.74,.9,6,.2);
        for(let k=0;k<=12;k++)L.BL(g,P(.2+k*.1,3.48),P(.2+k*.1,3.9),'#b0ab9f');
        for(const[u,v,r] of[[.8,1.9,3],[2.0,2.3,2],[3.0,1.8,3],[1.3,3.2,2],[2.2,3.25,3],[3.5,2.2,2]])stain(g,u,v,r);
        L.shadow(g,[...rmgSh('u',.3,.52,.16,1.6,.1,.52,34),...rmgSh('u',1.45,.52,.16,1.6,.1,.52,34),
          ['b',.2,1.14,1.7,.34,4],['b',.2,2.62,2.55,.34,12],['b',3.0,2.66,.6,.5,24],['b',3.65,1.66,.3,.88,13],['b',2.36,.28+GA/2-.06,1.22,.12,16]]);
        L.fence(g,[E,E],[SZ-E,E]);L.fence(g,[E,E],[E,SZ-E],[[.05,.28]]);
        // 列車（貨櫃只放一層）：後軌整列平車＋兩台藍色機車頭；中軌只在吊車下停幾節（一節空車正在裝）；前軌吊車下兩節，右半三股軌道全露（道床、枕木、雙軌）
        const C=(i,s2)=>cpick(hsh(1661,i,s2));
        [[.04,[C(1,1)]],[.5,[C(2,1),C(2,2)]],[.96,[C(3,1)]],[1.42,[C(4,1)]],[1.88,[C(5,1)]]].forEach(([u,ld])=>railCar(S,'u',u,.28,.44,ld));
        loco(S,'u',2.36,.28,'#2f5a86',true);loco(S,'u',2.98,.28,'#2f5a86',true);
        [[.3,null],[.76,[C(12,1)]],[1.22,[C(13,1),C(13,2)]],[1.68,null]].forEach(([u,ld])=>railCar(S,'u',u,.58,.44,ld));
        [[.5,[C(21,1)]],[.96,[C(22,1)]],[1.42,null]].forEach(([u,ld])=>railCar(S,'u',u,.88,.44,ld));
        // 堆存帶：只在吊車下、單層（不擋後面的軌道）
        stackU(S,[.2,.63,1.06,1.49],1.14,4,{seed:1662,hs:[1,1,1,1],tmax:1,tiers:(i,j)=>(i===1&&j<2)||(i===3&&j===3)?0:1});
        // RMG ×2（白色門架，背光面再壓暗一階）
        portal(S,'u',{a0:.16,a1:1.6,b0:.3,bw:.52,h:34,c0:.1,c1:.52,tr:.6425,hs:17,load:'#a5533f',col:'#e1e1dc',acc:'#3e6c96',cdk:-84});
        portal(S,'u',{a0:.16,a1:1.6,b0:1.45,bw:.52,h:34,c0:.1,c1:.52,tr:1.89,hs:9,load:'#4d6f93',col:'#e1e1dc',acc:'#3e6c96',cdk:-84});
        const dn=(b0)=>b0+.52+1.6+.07;
        truck(S,1.49,1.85,'u+','#c6463a',null,dn(1.45));truck(S,.3,1.85,'u+','#3f6a8e','#5a8464',dn(.3)+.05);truck(S,2.6,1.85,'u+','#d8d4c8','#a5533f');
        truck(S,3.1,2.22,'u-','#5b7a55','#8d9598');truck(S,1.9,2.22,'u-','#e3e1da','#b8763d');truck(S,.7,2.22,'u-','#3f6a8e',null);
        // 前區：地面堆場＋正面吊＋板架場
        stackU(S,[.2,.63,1.06,1.49,1.92,2.35],2.62,4,{seed:1663,hs:[2,3,3,2,3,2],tiers:(i,j)=>i===2&&j===3?2:[2,3,3,2,3,2][i]});
        reach(S,1.06+.14,3.017,'v',false,{load:'#4f8580',lz:9,d:1.2+3.02+.35,dl:1.06+2.97});
        truck(S,1.7,3.1,'u+','#c6463a','#a5533f');
        for(let k=0;k<12;k++){const u=.22+k*.1;S.o(u+3.5+.4,(g2)=>{L.boxZ(g2,u,3.48,.075,.42,1,1,'#45494d','#34383b','#55595d');const ld=hsh(1664,k,1);if(ld<.3)L.ctrV(g2,u-.005,3.49,.4,CW,2,cpick(hsh(1664,k,2)));
          else{L.boxZ(g2,u,3.49,.075,.03,2,1,'#6a6e71','#7b7f82','#505457');L.boxZ(g2,u,3.84,.075,.03,2,1,'#6a6e71','#7b7f82','#505457');}const q=P(u+.075,3.88,0);L.RC(g2,q[0]-1,q[1]-2,2,2,'#1c1e21');});}
        office(S,3.0,2.66,.6,.5,3,1665,{band:'#3e6c96'});
        gate(S,3.62,1.66,.34,.88,'u',{lanes:2,fas:'#3e6c96',d:3.96+2.54});
        for(const[u,v,c] of[[3.0,3.52,'#b8433a'],[3.15,3.52,'#e8ecee'],[3.45,3.52,'#3d5f8a'],[3.3,3.76,'#c9c3b4'],[3.6,3.76,'#5d6468']])car(S,u,v,false,c);
        mast(S,.12,2.58,46);mast(S,2.78,2.58,46);mast(S,1.52,3.47,42);
        lamp(S,3.96,2.6);lamp(S,2.9,3.95);
        for(const[u,v,s2,k] of[[1.7,3.7,.9,0],[2.1,3.78,.8,1],[2.5,3.7,.9,2],[1.9,3.95,.7,0],[2.7,3.95,.8,1],[3.95,3.95,.8,2],[.4,3.97,.6,1],[1.0,3.97,.6,2]])tree(S,u,v,s2,k);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.05,.28],[.41,.65]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
      // v1 左側兩股軌道沿 v ＋一部超寬跨距黃色 RMG（懸臂伸到卡車道）；右區：空櫃堆場＋正面吊、控制塔＋行政樓、停車、閘口在左前緣
      (g,ng,S,L)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,GA,trackV,craneRailV,stallsU,stallsV,stain,stackU,stackV,truck,car,reach,portal,railCar,loco,mast,lamp,tree,bush,office,gate,tower,cpick,CW}=L;
        pave(g,'y',0,0,SZ,SZ,16621);
        pave(g,'b',.12,0,.98,SZ,16622);
        trackV(g,.26,0,SZ,16623);trackV(g,.62,0,SZ,16624);
        pave(g,'c',1.1,0,.78,SZ,16625);lineV(g,1.1,0,SZ,'#8b7e6f');
        pave(g,'a',1.35,0,.24,SZ,16630);lineV(g,1.35,0,SZ,YEL);lineV(g,1.59,0,SZ,YEL);dashV(g,1.47,.1,3.9,WHT);    // 兩區塊之間的作業車道
        pave(g,'a',1.96,0,.9,SZ,16626);
        craneRailV(g,.1,0,SZ);craneRailV(g,1.9,0,SZ);
        pave(g,'c',2.9,.1,1.0,.66,16627);
        pave(g,'a',2.9,2.4,1.0,.8,16628);
        pave(g,'g',2.9,3.3,1.1,.7,16629);
        lineV(g,1.96,0,SZ,YEL);dashV(g,2.41,.1,3.9,WHT);lineV(g,2.86,0,SZ,YEL);
        stallsV(g,2.95,2.5,.6,5,.26);stallsV(g,3.62,2.5,.6,5,.26);
        for(const[u,v,r] of[[2.2,1.2,3],[2.6,2.4,2],[1.3,.4,2],[3.4,2.2,3],[2.2,3.3,2]])stain(g,u,v,r);
        L.shadow(g,[...rmgSh('v',1.4,.52,.1,1.9,.08,.52,40),['b',1.155,.1,.185,3.9,8],['b',1.62,.1,.185,3.9,6],['b',3.5,.2,.26,.26,46],['b',2.95,.18,.45,.5,17],['b',3.0,.9,.83,.34,15],['b',3.0,1.62,.83,.34,15]]);
        L.fence(g,[E,E],[SZ-E,E],[[.03,.22]]);L.fence(g,[E,E],[E,SZ-E]);
        // 列車：一軌雙機車頭在前（朝 +v）＋平車；二軌整列平車（吊車下那節空）
        const C=(i,s2)=>cpick(hsh(1671,i,s2));
        // 軌道上的櫃只放一層：平車露出車台、魚腹中樑與轉向架；一軌前端雙機車頭
        [[.1,[C(1,1)]],[.56,null],[1.02,[C(3,1),C(3,2)]],[1.48,[C(4,1)]],[1.94,[C(5,1)]]].forEach(([v,ld])=>railCar(S,'v',v,.26,.44,ld));
        loco(S,'v',2.42,.26,'#b8432f',true);loco(S,'v',3.04,.26,'#b8432f',true);
        [[.1,[C(11,1)]],[.56,[C(12,1),C(12,2)]],[1.02,null],[1.48,null],[1.94,[C(15,1)]],[2.4,[C(16,1)]],[2.86,null],[3.32,[C(18,1),C(18,2)]]].forEach(([v,ld])=>railCar(S,'v',v,.62,.44,ld));
        // 吊車跨下堆場：兩個 3 列區塊（列間留縫），中間一條 RMG 作業車道；每區塊只用 2–3 個主色；bay 1.84 留空當橫向通道
        const rowsA=[1.155,1.255],rowsB=[1.62,1.72],bays=[.12,.55,.98,1.41,1.84,2.27,2.7,3.13,3.56].map(v=>v-.02);
        const pA=['#a5533f','#4d6f93','#8d9598'],pB=['#5a8464','#d0cfc7','#8d9598'];
        const pc3=(p,sd)=>(i,j,t)=>p[hsh(sd,i*9+j,t)<.55?(j%2):hsh(sd,i*9+j,t+3)<.6?2:(j+1)%2];
        stackV(S,rowsA,bays,{seed:1672,skip:(i,j)=>j===4,col:pc3(pA,1672),tiers:(i,j)=>[2,3,2,2,0,2,3,2,2][j]-(i===0&&hsh(1673,j,1)<.4?1:0)});
        stackV(S,rowsB,bays,{seed:1674,skip:(i,j)=>j===4,col:pc3(pB,1674),tiers:(i,j)=>[2,1,1,2,0,2,1,2,1][j]-(i===1&&hsh(1675,j,1)<.4?1:0)});
        portal(S,'v',{a0:.1,a1:1.9,b0:1.4,bw:.52,h:40,c0:.08,c1:.52,tr:.6825,hs:18,load:'#8d9598',col:'#e0a33a',acc:'#3b4a58'});
        const dn=1.9+1.92+.07;
        truck(S,2.02,1.2,'v+','#3f6a8e','#a5533f',dn+.05);truck(S,2.02,.3,'v+','#d8d4c8',null);truck(S,2.02,2.4,'v+','#5b7a55','#4d6f93');
        truck(S,2.5,3.0,'v-','#c6463a',null);truck(S,2.5,1.9,'v-','#e3e1da','#b8763d');truck(S,2.5,.7,'v-','#3f6a8e','#5a8464');
        // 右區：空櫃堆場（四層）＋正面吊
        stackU(S,[3.0,3.43],.9,4,{seed:1676,hs:[4,4],dom:['#8d9598','#d0cfc7']});
        stackU(S,[3.0,3.43],1.62,4,{seed:1677,hs:[3,4],dom:['#4d6f93','#a5533f'],tiers:(i,j)=>i===0&&j===3?2:[3,4][i]});
        reach(S,3.0+.14,1.997,'v',false,{load:'#d0cfc7',lz:9,col:'#e0a33a',d:3.14+2.0+.35,dl:3.0+1.97});
        office(S,2.95,.18,.45,.5,2,1678,{band:'#e0a33a',doorAt:.4});
        tower(S,3.5,.22,.26,40,{d:3.5+.22+.26});
        for(const[u,v,c] of[[2.98,2.53,'#b8433a'],[2.98,2.65,'#e8ecee'],[2.98,2.89,'#3d5f8a'],[3.65,2.53,'#c9c3b4'],[3.65,2.77,'#5d6468'],[3.65,3.01,'#e8ecee']])car(S,u,v,true,c);
        gate(S,1.96,3.34,.9,.34,'v',{lanes:2,fas:'#3b4a58',d:2.86+3.68});
        mast(S,2.88,.9,46);mast(S,2.88,2.3,46);mast(S,3.9,1.4,44);
        lamp(S,2.92,3.95);lamp(S,1.94,3.95);
        for(const[u,v,s2,k] of[[3.1,3.5,.9,0],[3.5,3.45,.8,1],[3.85,3.6,.9,2],[3.2,3.85,.8,1],[3.6,3.9,.8,0],[3.9,.25,.7,2]])tree(S,u,v,s2,k);
        bush(S,3.0,3.7);bush(S,3.4,3.75);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.03,.22],[.48,.72]]);}};
      },
      // v2 中央兩股軌道沿 u（道床拓寬），兩部藍色雙懸臂 RMG 分站左右兩端、中間留一大段完全露出的軌道（碎石道床、枕木、雙軌、一節載櫃平車、綠色機車頭）；
      // 軌道後側一條堆存帶（在軌道後面、不擋軌道），前側只在右吊車下放幾個單層櫃；後側維修棚＋備品櫃＋RMG 供電變電站；前區控制室行政樓＋停車、右緣閘口
      (g,ng,S,L,K)=>{const {P,hsh,pave,lineU,lineV,dashU,dashV,YEL,WHT,GA,trackU,craneRailU,stallsU,stallsV,stain,stackU,truck,car,reach,portal,railCar,loco,mast,lamp,tree,bush,office,gate,tower,cfs,cpick,CW}=L;
        pave(g,'y',0,0,SZ,SZ,16641);
        pave(g,'c',0,.06,SZ,.44,16642);
        pave(g,'a',0,.5,SZ,.42,16643);
        pave(g,'c',0,.96,SZ,.4,16644);
        pave(g,'b',0,1.36,SZ,.66,16645);
        trackU(g,1.47,0,SZ,16646);trackU(g,1.77,0,SZ,16647);
        pave(g,'c',0,2.02,SZ,.38,16648);
        pave(g,'a',0,2.46,SZ,.46,16649);
        craneRailU(g,.94,0,SZ);craneRailU(g,2.42,0,SZ);
        pave(g,'c',.1,2.96,3.3,.6,16650);pave(g,'g',0,3.58,4,.42,16651);
        lineU(g,.5,0,SZ,YEL);lineU(g,.92,0,SZ,YEL);lineU(g,2.48,0,SZ,YEL);lineU(g,2.92,0,SZ,YEL);dashU(g,2.7,.2,3.5,WHT);dashU(g,.71,.2,3.5,WHT);
        lineU(g,2.36,0,SZ,'#d9d5c9');
        stallsU(g,1.25,3.02,1.8,12,.26);stallsU(g,1.25,3.3,1.8,12,.24);
        for(const[u,v,r] of[[.8,.7,3],[2.2,.8,2],[3.2,2.7,3],[1.5,2.6,2],[2.6,3.15,2],[1.3,2.2,2]])stain(g,u,v,r);
        L.shadow(g,[...rmgSh('u',.22,.52,.94,2.42,.4,.4,32),...rmgSh('u',2.92,.52,.94,2.42,.4,.4,32),
          ['b',.12,.98,3.44,.34,9],['b',2.5,2.06,1.0,.1,4],['b',.2,.1,1.3,.34,13],['b',.3,3.02,.55,.45,17],['b',3.66,.12,.26,.28,11],['b',.42,1.77+GA/2-.06,.6,.12,16]]);
        L.fence(g,[E,E],[SZ-E,E]);L.fence(g,[E,E],[E,SZ-E],[[.11,.23],[.33,.51],[.61,.74]]);
        // 後側：維修棚＋備品櫃
        cfs(S,.2,.1,1.3,.34,13,{doors:3,seed:1681,sky:2,vents:2,hc:10,canopy:false,sign:'#4a79a8',endWin:true});
        stackU(S,[1.7,2.13],.12,4,{seed:1682,hs:[2,1]});
        S.o(2.7+.1+.3,(g2)=>{L.boxZ(g2,2.7,.12,.3,.3,0,9,'#9aa3a7','#b3babd','#80898d');for(let k=0;k<3;k++)L.winL(g2,2.73+k*.09,.42,2,2,5,'#6c7478');});
        // 列車（貨櫃一層）：後軌左端一節空車、中段露出的軌道上停一節載櫃平車、右吊車下一列；前軌左段綠色機車頭（露在兩吊車之間）、右吊車下一列（正下方那節已吊空）
        const C=(i,s2)=>cpick(hsh(1683,i,s2));
        [[0,null],[1.3,['#a5533f']],[2.12,[C(3,1)]],[2.58,[C(4,1),C(4,2)]],[3.04,[C(5,1)]],[3.5,[C(6,1)]]].forEach(([u,ld])=>railCar(S,'u',u,1.47,.44,ld));
        loco(S,'u',.42,1.77,'#3d6b4b',true);
        [[2.04,[C(11,1)]],[2.5,[C(12,1)]],[2.96,null],[3.42,[C(14,1),C(14,2)]]].forEach(([u,ld])=>railCar(S,'u',u,1.77,.44,ld));
        // 後側堆存帶（在軌道後面，不擋軌道）；中段兩吊車之間壓低
        const bays=[.12,.55,.98,1.41,1.84,2.27,2.7,3.13];
        stackU(S,bays,.98,4,{seed:1684,hs:[3,2,2,1,1,2,3,2],tmax:3});
        // 前側：只在右吊車下放幾個單層櫃
        stackU(S,[2.52,2.95],2.06,1,{seed:1685,hs:[1,1],tmax:1});
        // RMG ×2（雙懸臂，拉開到兩端）
        const R={a0:.94,a1:2.42,bw:.52,h:32,c0:.4,c1:.4,col:'#4a79a8',acc:'#e3e2dc'};
        portal(S,'u',Object.assign({b0:.22,tr:.71,hs:10,load:'#b8763d',dL:.94+.22-.12-.01},R));
        portal(S,'u',Object.assign({b0:2.92,tr:1.8325,hs:15,load:'#d0cfc7'},R));
        const dn=(b0)=>b0+.52+2.42+.07;
        truck(S,.26,.67,'u+','#d8d4c8',null,.94+.22-.12-.03);truck(S,1.45,.67,'u+','#3f6a8e','#8d9598');truck(S,2.4,.67,'u-','#5b7a55','#b8763d');
        truck(S,2.96,2.65,'u+','#c6463a',null,dn(2.92));truck(S,1.72,2.65,'u+','#e3e1da','#4d6f93');truck(S,.5,2.65,'u+','#3f6a8e',null);
        // 前區
        office(S,.3,3.02,.55,.45,2,1686,{band:'#4a79a8'});
        S.o(.3+3.02+.46,(g2,n2)=>{const u0=.42,v0=3.12,h=17;L.boxZ(g2,u0,v0,.26,.22,h,7,'#6e7a80','#35516a','#28405a');L.boxZ(g2,u0-.01,v0-.01,.28,.24,h+7,2,'#d9dcdc','#cfd2d2','#9ea3a5');
          if(n2){L.faceL(n2,v0+.22,u0+.02,u0+.24,h+2,h+6,'rgba(255,228,160,.9)');L.faceR(n2,u0+.26,v0+.02,v0+.2,h+2,h+6,'rgba(240,210,140,.8)');}});
        // 右後：RMG 供電變電站（主變＋開關室＋門型架）
        S.o(3.3+.1+.28,(g2,n2)=>{L.boxZ(g2,3.28,.1,.62,.36,0,1,'#c9c5bb','#d4d0c7','#b3afa6');K.transformer(g2,n2,3.34,.14);K.transformer(g2,n2,3.54,.14);});
        S.o(3.3+.1+.32,(g2)=>{K.gantry(g2,3.3,.12,.5);});
        S.o(3.62+.28+.05,(g2,n2)=>{L.boxZ(g2,3.66,.12,.26,.28,0,11,'#9aa3a7','#dedad0','#b5b0a5');L.winL(g2,3.7,.4,2,3,6,'#5a4a3c');L.rowR(g2,n2,3.92,.14,.38,6,2,2,3,'#4d6f88',1689,.5);});
        gate(S,3.6,2.46,.36,.46,'u',{lanes:1,fas:'#4a79a8',d:3.96+2.92});
        for(let k=0;k<12;k++){if(hsh(1687,k,1)<.35)continue;car(S,1.25+1.8*(k+.5)/12-.035,3.08,false,['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#9a3a33'][Math.floor(hsh(1687,k,2)*6)]);}
        mast(S,.08,2.94,44);mast(S,1.6,.08,44);mast(S,2.6,.08,44);
        lamp(S,3.95,2.44);lamp(S,3.95,2.94);
        for(const[u,v,s2,k] of[[.3,3.8,.9,0],[.8,3.85,.8,1],[1.3,3.8,.9,2],[1.8,3.85,.8,0],[2.3,3.8,.9,1],[2.8,3.85,.8,2],[3.3,3.8,.9,0],[3.8,3.85,.8,1]])tree(S,u,v,s2,k);
        bush(S,1.05,3.65);bush(S,2.05,3.65);bush(S,3.05,3.65);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.11,.23],[.33,.51],[.61,.74]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
    ];
    build(166,K166);
  }catch(e){console.error('logi_a k166',e);errs.push('k166:'+(e&&e.stack||e));}

  if(errs.length)window.__logi_a_errs=errs;
  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
