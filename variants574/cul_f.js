// T614 cul_f：k84 幼兒園（1×1，72×112，錨 36,110）／k87 農貿市場（2×2，136×150，錨 68,148）實驗線重畫（文化休閒第三刀）。
// 分層合成（沿用 cul_c／cul_a）：地坪（草地、鋪面、塑膠地墊、沙坑、標線、落影）直接畫在地面層；立體件各自二值化＋深色外框，
// 依深度由後往前疊；細線件（人、欄杆、籬笆、鞦韆鏈、燈桿）走不描邊細線層。夜光按層遮擋，只亮白天畫出的窗、門燈、路燈、招牌、串燈。
// 光從左：+v 面（左前）亮、+u 面（右前）暗；落影向右。零亂數：只用 K.hsh。座標多以 T(n)=n/32（1px）表示，讓邊緣落在整數像素。
(window.__variants574=window.__variants574||[]).push(function cul_f(A){
  // 注入測試時本批次排在內嵌 b05／b06（會改寫 84／87）之前 ⇒ 不是最後一棒就把本體排到隊尾再跑；正式整合接在最後則直接執行
  const QL=window.__variants574||[];
  if(!cul_f.__late&&QL.indexOf(cul_f)>=0&&QL.indexOf(cul_f)<QL.length-1){cul_f.__late=1;QL.push(function cul_f_late(A2){cul_f(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round,T=n=>n/32;
  const errs=[];window.__cul_f_errs=errs;
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w|0,o.h|0,o.ax|0,o.ay|0]:d;};

  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['1001','1010','1100','1010','1001'],L:['100','100','100','100','111'],M:['10001','11011','10101','10001','10001'],
    N:['1001','1101','1011','1001','1001'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],
    W:['10001','10001','10101','11011','10001'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111']};

  // ================= 共用工具 =================
  const LIB=(K,W,H,SZ)=>{
    const {P,hsh}=K,AX=K.AX,AY=K.AY,TOPY=K.TOPY;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<4000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const fp=(g,pts,c)=>{g.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)g.fillRect(xa,y,xb-xa+1,1);}}};
    const Q=(u0,v0,du,dv,z=0)=>[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];
    const flat=(g,u0,v0,du,dv,c,z=0)=>fp(g,Q(u0,v0,du,dv,z),c);
    const polyUV=(g,pts,c,z=0)=>fp(g,pts.map(([u,v])=>P(u,v,z)),c);
    const inPoly=(pts,u,v)=>{let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[a,b]=pts[i],[c,d]=pts[j];if(((b>v)!==(d>v))&&(u<(c-a)*(v-b)/(d-b)+a))ins=!ins;}return ins;};
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const fL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);   // +v 面（亮）
    const fR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);   // +u 面（暗）
    const lnL=(g,v,ua,ub,z,c)=>BL(g,P(ua,v,z),P(ub-1/32,v,z),c);
    const lnR=(g,u,va,vb,z,c)=>BL(g,P(u,va,z),P(u,vb-1/32,z),c);
    const vln=(g,u,v,za,zb,c)=>{const a=P(u,v,za),b=P(u,v,zb),x=rnd(a[0]),ya=rnd(a[1]),yb=rnd(b[1]);RC(g,x,Math.min(ya,yb),1,Math.abs(ya-yb),c);};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);rx=rnd(rx);ry=rnd(ry);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const GW=ch=>FONT[ch]?FONT[ch][0].length:3;
    const glyph=(g,n,x,y,gl,col,ncol)=>{if(gl)for(let r=0;r<5;r++)for(let c=0;c<gl[r].length;c++)if(gl[r][c]==='1'){RC(g,x+c,y+r,1,1,col);if(n)RC(n,x+c,y+r,1,1,ncol);}};
    const textL=(g,v,u,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0,i=0;
      for(const ch of str){const cc=Array.isArray(col)?col[i%col.length]:col;glyph(g,n,x0+k,y0+Math.round(k/2),FONT[ch],cc,ncol);k+=GW(ch)+sp;i++;}};
    const textR=(g,u,v,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0,i=0;
      for(const ch of str){const cc=Array.isArray(col)?col[i%col.length]:col;glyph(g,n,x0+k,y0-Math.round(k/2),FONT[ch],cc,ncol);k+=GW(ch)+sp;i++;}};
    const textF=(g,x0,y0,str,col,n,ncol,sp=1)=>{let k=0,i=0;for(const ch of str){const cc=Array.isArray(col)?col[i%col.length]:col;glyph(g,n,x0+k,y0,FONT[ch],cc,ncol);k+=GW(ch)+sp;i++;}};
    const textW=(str,sp=1)=>{let w=-sp;for(const ch of str)w+=GW(ch)+sp;return w;};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]／['c',cu,cv,r,h]／['e',x,y,rx,ry]／['poly',uvPts]
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}
        else if(s[0]==='c'){const[,cu,cv,r,h]=s;for(let i=0;i<=8;i++){const k=h/64*i/8,p=P(cu+k,cv-.45*k);ell(sx,p[0],p[1],r,r/2,C);}}
        else if(s[0]==='e'){const[,x,y,rx,ry]=s;ell(sx,x,y,rx,ry,C);}
        else if(s[0]==='poly'){fp(sx,s[1].map(([u,v])=>P(u,v)),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 南兩斜邊以外一律清掉（外框、落影溢出保險）；頂端 2 列清空
    const clipLot=c=>{const g=c.getContext('2d');const yE=AY-16*SZ;for(let y=Math.ceil(yE);y<H;y++){const w=2*(AY-y);if(w<=0){g.clearRect(0,y,W,1);continue;}
      g.clearRect(0,y,Math.max(0,AX-w),1);g.clearRect(AX+w,y,W,1);}g.clearRect(0,0,W,2);};
    // ---------- 地坪 ----------
    const lotEdge=(g,dk,lt)=>{A.diaEdge(g,6,dk,AX,TOPY,32*SZ);A.diaEdge(g,9,lt,AX,TOPY,32*SZ);};
    const texture=(g,pts,base,cols,dens,seed,tuft)=>{if(base)polyUV(g,pts,base);let ua=1e9,ub=-1e9,va=1e9,vb=-1e9;for(const[u,v]of pts){ua=Math.min(ua,u);ub=Math.max(ub,u);va=Math.min(va,v);vb=Math.max(vb,v);}
      const n=Math.round((ub-ua)*(vb-va)*dens);for(let i=0;i<n;i++){const u=ua+hsh(seed,i,1)*(ub-ua),v=va+hsh(seed,i,2)*(vb-va);if(!inPoly(pts,u,v))continue;const p=P(u,v),c=cols[(hsh(seed,i,3)*cols.length)|0];
        if(tuft&&hsh(seed,i,4)<tuft){RC(g,p[0],p[1]-1,1,2,c);RC(g,p[0]+1,p[1],1,1,c);}else RC(g,p[0],p[1],hsh(seed,i,5)<.3?2:1,1,c);}};
    const R4=(u0,v0,du,dv)=>[[u0,v0],[u0+du,v0],[u0+du,v0+dv],[u0,v0+dv]];
    const grass=(g,pts,seed,dens=60)=>texture(g,pts,'#79a854',['#6a9848','#8bb964','#6a9848'],dens,seed,.3);
    // 鋪面：底色＋格縫（step 為 uv）
    const pave=(g,u0,v0,du,dv,base,jc,step,seed,alt)=>{flat(g,u0,v0,du,dv,base);
      if(alt){const nu=Math.round(du/step),nv=Math.round(dv/step);for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const h=hsh(seed,i,j);if(h<.14)flat(g,u0+i*step,v0+j*step,step,step,alt[0]);else if(h>.88)flat(g,u0+i*step,v0+j*step,step,step,alt[1]);}}
      if(jc){for(let u=u0+step;u<u0+du-1e-6;u+=step)BL(g,P(u,v0),P(u,v0+dv-1/32),jc);for(let v=v0+step;v<v0+dv-1e-6;v+=step)BL(g,P(u0,v),P(u0+du-1/32,v),jc);}};
    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86','#d06a3a'];
    const KC=['#e8463a','#f2b632','#3f8fd8','#56b85a','#e86aa8','#f28a2a','#8a5cc8'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const kid=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,k%2?'#2d4a7a':'#2d2f33');RC(g,x,y-2,1,1,KC[k%KC.length]);RC(g,x,y-3,1,1,k%3?'#f0c49c':'#c08a60');};
    // pts：[u,v,k]；k>=10 為小孩
    const crowd=(S,pts,z=0,d)=>{for(const[u,v,k]of pts)S.t(d!=null?d:u+v+.004,(g)=>{const p=P(u,v,z);(k>=10?kid:person)(g,p[0],p[1],k%10);});};
    const scatterIn=(seed,n,pts,avoid)=>{const out=[];let ua=1e9,ub=-1e9,va=1e9,vb=-1e9;for(const[u,v]of pts){ua=Math.min(ua,u);ub=Math.max(ub,u);va=Math.min(va,v);vb=Math.max(vb,v);}
      for(let i=0;i<n*8&&out.length<n;i++){const u=ua+hsh(seed,i,1)*(ub-ua),v=va+hsh(seed,i,2)*(vb-va);if(!inPoly(pts,u,v))continue;if(avoid&&avoid(u,v))continue;
        if(out.some(([a,b])=>Math.abs((a-b)-(u-v))*32<2&&Math.abs((a+b)-(u+v))*16<3))continue;out.push([u,v,Math.floor(hsh(seed,i,3)*10)]);}return out;};
    // ---------- 路燈、樹、灌木、長椅 ----------
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x-1,y-1,3,1,'#3e464b');
      RC(g,x-1,y-h-1,3,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x,y-h+1,1,1,'rgba(255,226,160,.55)');}});
    const lamp2=(S,u,v,h=13,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#2f3a33');RC(g,x-1,y-1,3,1,'#2f3a33');
      RC(g,x-2,y-h,5,1,'#2f3a33');RC(g,x-2,y-h-2,1,2,'#f3e6b8');RC(g,x+2,y-h-2,1,2,'#f3e6b8');RC(g,x-2,y-h-3,1,1,'#2f3a33');RC(g,x+2,y-h-3,1,1,'#2f3a33');
      if(n){RC(n,x-2,y-h-2,1,2,'#ffe6a0');RC(n,x+2,y-h-2,1,2,'#ffe6a0');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],['#f4b8c8','#e08aa4','#b86680','#8a4a60']];
    const tree=(S,SHD,u,v,s=1,kind=0,d)=>{SHD.push(['c',u,v,rnd(4.2*s),rnd(9*s)+3]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const bush=(S,u,v,r=3,d,pal)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);const c=pal||['#4f7f35','#78a84c','#a3cf72'];ell(g,x,y-r+1,r,Math.max(1,r-1),c[0]);ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),c[1]);RC(g,x-1,y-r-1,1,1,c[2]);});
    const bench=(S,u,v,alongU,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const a=P(u,v),b=alongU?P(u+T(4),v):P(u,v+T(4));BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9a6a3e');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#6e4a2a');RC(g,a[0],a[1]-1,1,1,'#3a3d40');RC(g,b[0],b[1]-1,1,1,'#3a3d40');});
    // 小圖：rows＋pal（'.' 透明）
    const STC={};
    const stamp=(key,rows,pal)=>{if(STC[key])return STC[key];const w=rows[0].length,h=rows.length,[c,x]=A.cv(w,h);
      rows.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[j];if(ch!=='.'&&pal[ch]){x.fillStyle=pal[ch];x.fillRect(j,ri,1,1);}}});
      const[fc,fx]=A.cv(w,h);fx.save();fx.scale(-1,1);fx.drawImage(c,-w,0);fx.restore();return STC[key]={c,fc,w,h};};
    const put=(g,st,x,y,flip)=>{g.drawImage(flip?st.fc:st.c,rnd(x)-(st.w>>1),rnd(y)-st.h+1);};
    // 籬笆（細線層）：a→b（uv），每 step px 一根柱，cols 輪流；gaps 以沿線參數 0..1 留開口
    const picket=(S,a,b,o={})=>{const h=o.h||4,step=o.step||2,gaps=o.gaps||[],cols=o.cols||['#f4f1e8'],rail=o.rail||null;
      S.t(o.d!=null?o.d:(a[0]+a[1]+b[0]+b[1])/2,(g)=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),n=Math.max(1,Math.round(Math.abs(pb[0]-pa[0])));
        const open=t=>gaps.some(([x,y])=>t>x-1e-6&&t<y+1e-6);
        if(rail)for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n;if(open((t0+t1)/2))continue;const q0=P(a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0,h-2),q1=P(a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1,h-2);BL(g,q0,q1,rail);}
        for(let i=0;i<=n;i+=step){const t=i/n;if(open(t))continue;const p=P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);const c=cols[(i/step|0)%cols.length];
          RC(g,p[0],p[1]-h+1,1,h,c);if(o.tip)RC(g,p[0],p[1]-h,1,1,o.tip);}});};
    // ---------- 屋頂 ----------
    // 山牆屋頂（屋脊 ∥ u）：牆 [u0,u1]×[v0,v1] 高 h，屋脊高 h+r；+v 坡亮、+u 端山牆（gab）、+u 端封簷（fas）
    const gableU=(g,u0,u1,v0,v1,h,r,o)=>{const vm=(v0+v1)/2,ov=o.ov!=null?o.ov:T(1),ou=o.ou!=null?o.ou:T(1),dz=r*ov/(vm-v0),ze=h-dz,th=o.th||2,zr=h+r;
      if(o.gab)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zr)],o.gab);
      if(o.gabFn)o.gabFn(g,vm,zr);
      fp(g,[P(u0-ou,v1+ov,ze),P(u1+ou,v1+ov,ze),P(u1+ou,vm,zr),P(u0-ou,vm,zr)],o.roof);
      if(o.line){const nr=o.rows||Math.max(2,Math.floor((zr-ze)/3));for(let i=1;i<nr;i++){const f=i/nr,vv=v1+ov-(v1+ov-vm)*f,zz=ze+(zr-ze)*f;BL(g,P(u0-ou,vv,zz),P(u1+ou-T(1),vv,zz),o.line);
        if(o.joint){for(let uu=u0-ou+T(i%2?1:3);uu<u1+ou-T(1);uu+=T(4)){const a=P(uu,vv,zz);RC(g,a[0],a[1]+1,1,2,o.joint);}}}}
      BL(g,P(u0-ou,vm,zr),P(u1+ou-T(1),vm,zr),o.ridge||SH(o.roof,26));
      fp(g,[P(u1+ou,v1+ov,ze),P(u1+ou,vm,zr),P(u1+ou,vm,zr-th),P(u1+ou,v1+ov,ze-th)],o.fas);
      fp(g,[P(u1+ou,vm,zr),P(u1+ou,v0-ov,ze),P(u1+ou,v0-ov,ze-th),P(u1+ou,vm,zr-th)],o.fasD||o.fas);
      fL(g,v1+ov,u0-ou,u1+ou,ze-th,ze,o.fasL||o.fas);
      return{vm,ze,zr};};
    // 山牆屋頂（屋脊 ∥ v）：+v 端山牆（gab，亮）、+u 坡（暗）
    const gableV=(g,u0,u1,v0,v1,h,r,o)=>{const um=(u0+u1)/2,ou=o.ou!=null?o.ou:T(1),ov=o.ov!=null?o.ov:T(1),dz=r*ou/(um-u0),ze=h-dz,th=o.th||2,zr=h+r,vb=o.vb!=null?o.vb:v0-ov;
      if(o.gab)fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zr)],o.gab);
      if(o.gabFn)o.gabFn(g,um,zr);
      const vbR=o.vbR!=null?o.vbR:vb,vbE=o.vbE!=null?o.vbE:vb;   // 天溝裁切：屋脊端 vbR、簷口端 vbE
      fp(g,[P(u1+ou,vbE,ze),P(u1+ou,v1+ov,ze),P(um,v1+ov,zr),P(um,vbR,zr)],o.roof);
      if(o.line){const nr=o.rows||Math.max(2,Math.floor((zr-ze)/3));for(let i=1;i<nr;i++){const f=i/nr,uu=u1+ou-(u1+ou-um)*f,zz=ze+(zr-ze)*f,vs=vbE+(vbR-vbE)*f;BL(g,P(uu,vs,zz),P(uu,v1+ov-T(1),zz),o.line);
        if(o.joint){for(let vv=vb+T(i%2?1:3);vv<v1+ov-T(1);vv+=T(4)){const a=P(uu,vv,zz);RC(g,a[0],a[1]+1,1,2,o.joint);}}}}
      BL(g,P(um,vbR,zr),P(um,v1+ov-T(1),zr),o.ridge||SH(o.roof,26));if(o.vbR!=null)BL(g,P(um,vbR,zr),P(u1+ou,vbE,ze),o.valley||SH(o.roof,-22));
      fp(g,[P(u0-ou,v1+ov,ze),P(um,v1+ov,zr),P(um,v1+ov,zr-th),P(u0-ou,v1+ov,ze-th)],o.fasL||o.fas);
      fp(g,[P(um,v1+ov,zr),P(u1+ou,v1+ov,ze),P(u1+ou,v1+ov,ze-th),P(um,v1+ov,zr-th)],o.fas);
      fR(g,u1+ou,vbE,v1+ov,ze-th,ze,o.fasD||o.fas);
      return{um,ze,zr};};
    // 四坡頂（屋脊 ∥ u）：+v 坡亮、+u 端斜坡暗
    const hipU=(g,u0,u1,v0,v1,h,r,o)=>{const vm=(v0+v1)/2,ov=o.ov!=null?o.ov:T(1),hw=vm-v0,dz=r*ov/hw,ze=h-dz,th=o.th||2,zr=h+r,ra=u0+hw,rb=Math.max(ra,u1-hw);
      const U0=u0-ov,U1=u1+ov,V0=v0-ov,V1=v1+ov;
      fp(g,[P(U0,V1,ze),P(U1,V1,ze),P(rb,vm,zr),P(ra,vm,zr)],o.roof);
      fp(g,[P(U1,V1,ze),P(U1,V0,ze),P(rb,vm,zr)],o.roofD);
      if(o.line){const nr=o.rows||Math.max(2,Math.floor((zr-ze)/3));for(let i=1;i<nr;i++){const f=i/nr,zz=ze+(zr-ze)*f,vv=V1-(V1-vm)*f,ua=U0+(ra-U0)*f,ub=U1-(U1-rb)*f;
        BL(g,P(ua,vv,zz),P(ub,vv,zz),o.line);const uu=U1-(U1-rb)*f,va=V0+(vm-V0)*f;BL(g,P(uu,va,zz),P(uu,vv,zz),o.lineD||o.line);}}
      BL(g,P(ra,vm,zr),P(rb,vm,zr),o.ridge||SH(o.roof,26));BL(g,P(U1,V1,ze),P(rb,vm,zr),o.ridge||SH(o.roof,26));BL(g,P(U0,V1,ze),P(ra,vm,zr),o.ridge||SH(o.roof,26));
      fL(g,V1,U0,U1,ze-th,ze,o.fasL||o.fas);fR(g,U1,V0,V1,ze-th,ze,o.fas);
      return{vm,ze,zr,ra,rb};};
    // ---------- 窗 ----------
    // +v 面窗：glass ua..ua+w（u）、za..zb；fr 外框 1px；arch 圓頂；mull 中豎框；tr 橫框高度；n 夜光
    const winL=(g,n,v,ua,w,za,zb,o)=>{const e=T(1);
      if(o.fr){fL(g,v,ua-e,ua+w+e,za-1,zb+(o.arch?1:1),o.fr);if(o.arch)fL(g,v,ua,ua+w,zb+1,zb+2,o.fr);}
      if(o.sill)fL(g,v,ua-e,ua+w+e,za-2,za-1,o.sill);
      fL(g,v,ua,ua+w,za,zb,o.gl);if(o.arch)fL(g,v,ua+e,ua+w-e,zb,zb+1,o.gl);
      if(o.hi)fL(g,v,ua,ua+e,za+1,zb-1,o.hi);
      if(o.mull)vln(g,ua+w/2,v,za,zb+(o.arch?1:0),o.mc||o.fr);
      if(o.tr!=null)lnL(g,v,ua,ua+w,o.tr,o.mc||o.fr);
      if(n){fL(n,v,ua,ua+w,za,zb,o.lit||'#ffe2a0');if(o.arch)fL(n,v,ua+e,ua+w-e,zb,zb+1,o.lit||'#ffe2a0');if(o.mull)vln(n,ua+w/2,v,za,zb,'rgba(90,70,40,.8)');}};
    const winR=(g,n,u,va,w,za,zb,o)=>{const e=T(1);
      if(o.fr){fR(g,u,va-e,va+w+e,za-1,zb+1,o.fr);if(o.arch)fR(g,u,va,va+w,zb+1,zb+2,o.fr);}
      if(o.sill)fR(g,u,va-e,va+w+e,za-2,za-1,o.sill);
      fR(g,u,va,va+w,za,zb,o.gl);if(o.arch)fR(g,u,va+e,va+w-e,zb,zb+1,o.gl);
      if(o.hi)fR(g,u,va,va+e,za+1,zb-1,o.hi);
      if(o.mull){const p=P(u,va+w/2,za),q=P(u,va+w/2,zb+(o.arch?1:0));RC(g,p[0],q[1],1,p[1]-q[1],o.mc||o.fr);}
      if(o.tr!=null)lnR(g,u,va,va+w,o.tr,o.mc||o.fr);
      if(n){fR(n,u,va,va+w,za,zb,o.litD||'#f0cf88');if(o.arch)fR(n,u,va+e,va+w-e,zb,zb+1,o.litD||'#f0cf88');}};
    return {P,hsh,AX,AY,TOPY,RC,BL,fp,Q,flat,polyUV,inPoly,boxZ,fL,fR,lnL,lnR,vln,ell,textL,textR,textF,textW,glyph,scene,shadow,clipLot,lotEdge,texture,R4,grass,pave,
      person,kid,crowd,scatterIn,lamp,lamp2,tree,bush,bench,stamp,put,picket,gableU,gableV,hipU,winL,winR,KC,PC};
  };

  // 組裝：地坪 → 落影 → 分層立體件 → 裁掉佔地南緣外
  const assemble=(W,H,AX,AY,SZ,draw)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H,SZ);const{c,g,nc,ng}=K.canvases();const S=L.scene(),SHD=[];
    const ex=draw(K,L,g,ng,S,SHD)||{};L.shadow(g,SHD,ex.shA||.26);S.run(g,ng);if(ex.post)ex.post(g,ng);L.clipLot(c);L.clipLot(nc);
    const o={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};if(ex.flagAt)o.flagAt=ex.flagAt;return o;};
  const install=(k,out)=>{if(!out.length)return;for(let v=0;v<out.length;v++)if(out[v])B[k+'_1_'+v]=out[v];
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];};

  // ================= k84 幼兒園（1×1） =================
  try{
    const [W,H,AX,AY]=dims(84,[72,112,36,110]),SZ=1;
    const LIT='#ffe2a0',LITD='#f0cf88';
    // ---- 遊具 ----
    // 溜滑梯：塔（u,v 為塔西北角、邊長 s）＋平台 z7＋尖頂小屋頂；滑道往 +u（dir 'u'）或 +v 下滑
    const slide=(L,S,SHD,u,v,o)=>{const{P,RC,BL,fp,boxZ,fL,fR}=L,s=o.s||T(4),zp=o.zp||7,len=o.len||T(9),pc=o.post||'#e8463a',ch=o.chute||'#f2c230',rf=o.roof||'#3f8fd8',dir=o.dir||'u';
      SHD.push(['b',u,v,s,s,zp+7]);SHD.push(dir==='u'?['b',u+s,v+T(1),len,T(2),3]:['b',u+T(1),v+s,T(2),len,3]);
      S.o(o.d!=null?o.d:u+v+s,(g)=>{
        // 塔柱與平台
        for(const[a,b]of[[0,0],[s,0],[0,s],[s,s]]){const p=P(u+a,v+b,0);RC(g,p[0],p[1]-zp-1,1,zp+1,pc);}
        boxZ(g,u,v,s,s,zp,1,'#b9824c','#a06a38','#86582e');
        // 欄杆
        fL(g,v+s,u,u+s,zp+1,zp+3,SH(pc,20));fR(g,u+s,v,v+s,zp+1,zp+3,SH(pc,-30));
        // 小尖頂
        const c=P(u+s/2,v+s/2,zp+10);for(const[a,b]of[[s,0],[s,s]]){}
        fp(g,[P(u,v+s,zp+5),P(u+s,v+s,zp+5),c],SH(rf,18));fp(g,[P(u+s,v,zp+5),P(u+s,v+s,zp+5),c],SH(rf,-22));
        for(const[a,b]of[[s,0],[0,s],[s,s]]){const p=P(u+a,v+b,zp+2);RC(g,p[0],p[1]-3,1,3,pc);}
        // 滑道
        if(dir==='u'){const a0=u+s,a1=u+s+len;fp(g,[P(a0,v+T(1),zp),P(a0,v+T(3),zp),P(a1,v+T(3),1),P(a1,v+T(1),1)],ch);
          BL(g,P(a0,v+T(3),zp+1),P(a1,v+T(3),2),SH(ch,-40));BL(g,P(a0,v+T(3),zp),P(a1,v+T(3),1),SH(ch,-20));BL(g,P(a0,v+T(1),zp+1),P(a1,v+T(1),2),SH(ch,30));
          fp(g,[P(a1,v+T(1),1),P(a1+T(2),v+T(1),0),P(a1+T(2),v+T(3),0),P(a1,v+T(3),1)],ch);}
        else{const a0=v+s,a1=v+s+len;fp(g,[P(u+T(1),a0,zp),P(u+T(3),a0,zp),P(u+T(3),a1,1),P(u+T(1),a1,1)],ch);
          BL(g,P(u+T(3),a0,zp+1),P(u+T(3),a1,2),SH(ch,-40));BL(g,P(u+T(1),a0,zp+1),P(u+T(1),a1,2),SH(ch,30));
          fp(g,[P(u+T(1),a1,1),P(u+T(1),a1+T(2),0),P(u+T(3),a1+T(2),0),P(u+T(3),a1,1)],ch);}
        // 梯子（背側，-v 或 -u 側看不到 ⇒ 畫在 -u 側可見邊）
        if(o.ladder!==false){const lx=dir==='u'?P(u,v+s,0):P(u+s,v,0),x=rnd(lx[0]),y=rnd(lx[1]);for(let k=1;k<zp;k+=2)RC(g,x-2,y-k,2,1,'#c9ccd0');RC(g,x-2,y-zp,1,zp,'#9aa0a6');}
      });};
    // 鞦韆：沿 u 的 A 字架（兩端）＋橫樑＋兩座鞦韆
    const swing=(L,S,SHD,u,v,len,o={})=>{const{P,RC,BL}=L,hz=o.h||10,fc=o.col||'#3f8fd8';SHD.push(['p',u,v,hz]);SHD.push(['p',u+len,v,hz]);
      S.t(o.d!=null?o.d:u+len+v+.02,(g)=>{for(const a of[u,u+len]){const t=P(a,v,hz),l=P(a,v-T(3),0),r=P(a,v+T(3),0);BL(g,t,l,SH(fc,-30));BL(g,t,r,fc);}
        BL(g,P(u,v,hz),P(u+len,v,hz),'#5a6066');
        const seats=o.seats||[.3,.7];seats.forEach((f,i)=>{const p=P(u+len*f,v,hz),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y+1,1,hz-3,'#8a9096');RC(g,x+2,y+2,1,hz-3,'#8a9096');RC(g,x,y+hz-2,3,1,KC_[i%KC_.length]);});});};
    const KC_=['#e8463a','#f2b632','#3f8fd8'];
    // 沙坑（地面層）
    const sandbox=(L,g,u,v,du,dv,seed)=>{const{flat,RC,P,hsh,BL}=L;flat(g,u,v,du,dv,'#a0703e');flat(g,u+T(1),v+T(1),du-T(2),dv-T(2),'#ecd79c');
      for(let i=0;i<Math.round(du*dv*900);i++){const p=P(u+T(1)+hsh(seed,i,1)*(du-T(2)),v+T(1)+hsh(seed,i,2)*(dv-T(2)));RC(g,p[0],p[1],1,1,hsh(seed,i,3)<.5?'#dcc486':'#f6e6b4');}
      BL(g,P(u,v+dv),P(u+du,v+dv),'#c89456');BL(g,P(u+du,v),P(u+du,v+dv),'#7e5630');};
    const toys=(L,S,list)=>{const{P,RC}=L;for(const[u,v,c]of list)S.t(u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,2,2,c);RC(g,x,y-2,2,1,SH(c,30));});};
    // 彩虹拱門（沿 +v 面平面，a0..a1 為 u）
    const rainbowGate=(L,S,v,a0,a1,z0,o={})=>{const{P,RC,BL,fp}=L,cols=['#e8463a','#f28a2a','#f2d33c','#56b85a','#3f8fd8'];
      S.t(o.d!=null?o.d:a1+v+.05,(g,n)=>{for(const a of[a0,a1]){const p=P(a,v,0);RC(g,p[0],p[1]-z0-1,1,z0+1,'#f4f1e8');RC(g,p[0],p[1]-1,1,1,'#8a9096');}
        const N=24;cols.forEach((c,i)=>{let prev=null;for(let k=0;k<=N;k++){const t=k/N,u=a0+(a1-a0)*t,z=z0+(5-i)*1+Math.sin(Math.PI*t)*(5-i*.2);const p=P(u,v,z),q=[rnd(p[0]),rnd(p[1])];if(prev)BL(g,prev,q,c);prev=q;}});});};

    // 小鐘亭（坐在屋脊上）：u,v 西北角、3px 方
    const cupola=(L,g,n,u,v,z,o)=>{const{boxZ,fp,P,RC,fL,fR}=L,s=T(3);
      boxZ(g,u,v,s,s,z,6,null,o.wall,o.wallD);fL(g,v+s,u+T(1),u+T(2),z+2,z+5,'#5a4a3c');fR(g,u+s,v+T(1),v+T(2),z+2,z+5,'#3e3228');
      const c=P(u+s/2,v+s/2,z+12);fp(g,[P(u-T(1),v+s+T(1),z+6),P(u+s+T(1),v+s+T(1),z+6),c],o.roof);fp(g,[P(u+s+T(1),v-T(1),z+6),P(u+s+T(1),v+s+T(1),z+6),c],o.roofD);
      RC(g,c[0],c[1]-3,1,3,'#5a6066');RC(g,c[0]-1,c[1]-2,3,1,'#5a6066');};
    // +v 面門（拱頂＋門框＋小氣窗）
    const doorL=(L,g,n,v,ua,w,h,o)=>{const{fL,vln}=L;fL(g,v,ua-T(1),ua+w+T(1),0,h+2,o.fr);fL(g,v,ua,ua+w,0,h,o.col);fL(g,v,ua+T(1),ua+w-T(1),h,h+1,o.col);
      fL(g,v,ua,ua+w,h-3,h-1,o.gl||'#a6d2ee');if(w>=T(3))vln(g,ua+w/2,v,0,h-3,SH(o.col,-30));if(n)fL(n,v,ua,ua+w,h-3,h-1,'#ffe2a0');};
    const kid=(g,x,y,k)=>{x=rnd(x);y=rnd(y);const KC=['#e8463a','#f2b632','#3f8fd8','#56b85a','#e86aa8','#f28a2a','#8a5cc8'];g.fillStyle=k%2?'#2d4a7a':'#2d2f33';g.fillRect(x,y-1,1,1);g.fillStyle=KC[k%KC.length];g.fillRect(x,y-2,1,1);g.fillStyle=k%3?'#f0c49c':'#c08a60';g.fillRect(x,y-3,1,1);};
    // 彈簧搖搖馬（小動物＋彈簧）
    const rider=(L,S,u,v,col,flip)=>{const{P,RC}=L;S.o(u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,'#8a9096');
      RC(g,x-1,y-4,3,2,col);RC(g,flip?x-2:x+2,y-5,1,2,col);RC(g,x-1,y-4,3,1,SH(col,34));});};
    // 蹺蹺板
    const seesaw=(L,S,u,v,len,col)=>{const{P,RC,BL}=L;S.t(u+v+len+.01,(g)=>{const a=P(u,v,3),b=P(u+len,v,1),m=P(u+len/2,v,0);RC(g,m[0]-1,m[1]-2,2,2,'#5a6066');BL(g,a,b,col);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],SH(col,-40));
      RC(g,a[0],a[1]-2,1,2,'#f2d33c');RC(g,b[0]-1,b[1]-2,1,2,'#f2d33c');});};

    // v0 木構：後緣一字長屋（木板牆、紅瓦山牆頂、屋脊小鐘亭、中央紅門＋黃雨遮）；前院左沙坑、右溜滑梯＋蹺蹺板，白色尖樁籬笆＋彩虹拱門
    const V0=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,grass,pave,gableU,winL,winR,tree,bush,crowd,picket,lamp}=L;
      const C={wall:'#ecc271',wallD:'#b98a3e',sid:'#d6a655',sidD:'#9a6d30',trim:'#f7f1e2',trimD:'#cfc6b2',plinth:'#8a7a66',plinthD:'#6b5d4d',
        roof:'#d65a3c',roofL:'#ec7a58',roofLn:'#b2432c',fas:'#7c3222',gl:'#4c86b4',glD:'#35658e',hi:'#a6d2ee'};
      grass(g,[[0,0],[1,0],[1,1],[0,1]],8401,50);
      // 前院：右側塑膠地墊、左側沙坑、中央入口步道、屋前簷下走廊
      flat(g,T(17),T(15),T(14),T(16),'#72b560');
      for(let i=0;i<5;i++)for(let j=0;j<6;j++)if((i+j)%2===0)flat(g,T(17+i*2.8),T(15+j*2.67),T(2.8),T(2.67),'#66aa56');
      flat(g,T(1),T(13),T(24),T(2),'#d9cba8');
      pave(g,T(10),T(15),T(6),T(17),'#e4d8bc','#cfc1a0',T(3),5,null);
      sandbox(L,g,T(2),T(17),T(7),T(8),841);
      L.lotEdge(g,'#5d7f3f','#9cc377');
      // 主屋
      const u0=T(2),u1=T(24),v0=T(2),v1=T(13),h=15,r=9;
      SHD.push(['b',u0,v0,u1-u0,v1-v0,h+5]);
      S.o(.5,(g2,n)=>{boxZ(g2,u0,v0,u1-u0,v1-v0,0,2,null,C.plinth,C.plinthD);boxZ(g2,u0,v0,u1-u0,v1-v0,2,h-2,null,C.wall,C.wallD);
        for(let z=4;z<h;z+=2){lnL(g2,v1,u0,u1,z,C.sid);lnR(g2,u1,v0,v1,z,C.sidD);}
        vln(g2,u0,v1,2,h,C.trim);vln(g2,u1-T(1),v1,2,h,C.trim);
        const FR=['#3f8fd8','#56b85a','#56b85a','#3f8fd8'];
        [[T(3.5),0],[T(7.5),1],[T(15.5),2],[T(19.5),3]].forEach(([ua,i])=>winL(g2,n,v1,ua,T(3),4,11,{fr:C.trim,gl:C.gl,hi:C.hi,tr:8,sill:FR[i],lit:LIT}));
        doorL(L,g2,n,v1,T(11.5),T(3),8,{fr:C.trim,col:'#d8463a',gl:'#f4e0a0'});
        boxZ(g2,T(10.5),v1,T(5),T(2),10,1,'#f2c230','#f2b632','#c88a18');
        [[T(4)],[T(8)]].forEach(([va])=>winR(g2,n,u1,va,T(3),4,11,{fr:C.trimD,gl:C.glD,tr:8,sill:C.trimD,litD:LITD}));
        gableU(g2,u0,u1,v0,v1,h,r,{roof:C.roof,line:C.roofLn,joint:C.roofLn,rows:5,fas:C.fas,fasL:'#8e3a28',gab:C.wallD,ridge:C.roofL,
          gabFn:(g3,vm,zr)=>{for(let z=h+2;z<zr-1;z+=2){const w=(vm-v0)*(1-(z-h)/r);lnR(g3,u1,vm-w,vm+w,z,C.sidD);}
            const p=P(u1,vm,h+4),x=rnd(p[0]),y=rnd(p[1]);RC(g3,x-1,y-2,3,4,C.trimD);RC(g3,x,y-1,1,2,C.glD);if(n)RC(n,x,y-1,1,2,LITD);}});
        cupola(L,g2,n,T(11.5),T(6),22,{wall:C.trim,wallD:C.trimD,roof:'#3f8fd8',roofD:'#2c6aa8'});
        const lp=P(T(16),v1,9);RC(g2,lp[0],lp[1],1,1,'#f4e0a0');if(n)RC(n,lp[0],lp[1],1,2,LIT);
      });
      // 屋前花台
      bush(S,T(3.5),T(14.5),2,.7,['#4f7f35','#e86aa8','#f7b8d0']);bush(S,T(21),T(14.5),2,.75,['#4f7f35','#f2d33c','#fbe89a']);
      // 遊具
      slide(L,S,SHD,T(25),T(17),{s:T(3),zp:5,len:T(6),dir:'v',post:'#e8463a',chute:'#f2c230',roof:'#3f8fd8',d:1.3});
      seesaw(L,S,T(19),T(19),T(4),'#3f8fd8');
      // 樹
      tree(S,SHD,T(28.5),T(5),.95,0,.9);tree(S,SHD,T(2.5),T(28),.7,2,1.4);
      // 白色尖樁籬笆（左、前、右三緣）＋彩虹拱門
      picket(S,[T(1),T(15)],[T(1),T(31)],{cols:['#f4f1e8'],h:4,step:2,rail:'#d9d3c4',d:.9});
      picket(S,[T(1),T(31)],[T(31),T(31)],{cols:['#f4f1e8'],h:4,step:2,rail:'#d9d3c4',gaps:[[.3,.53]],d:2.1});
      picket(S,[T(31),T(2)],[T(31),T(31)],{cols:['#e2ddd0'],h:4,step:2,rail:'#bdb6a6',d:2.05});
      rainbowGate(L,S,T(31),T(10),T(17),7,{d:2.2});
      crowd(S,[[T(4),T(20),11],[T(7),T(22),12],[T(24.5),T(27),13],[T(20),T(21),14],[T(13),T(26),3],[T(14.5),T(26.5),15],[T(27),T(23),16],[T(13),T(18),17]]);
      S.t(1.02,(g2)=>{const p=P(T(26.5),T(18.5),6);kid(g2,p[0],p[1],5);});
      toys(L,S,[[T(5),T(23),'#e8463a']]);
      return{};};

    // v1 磚造：L 形紅磚園舍沿兩後緣（北翼沿 u、西翼沿 v），兩翼石板山牆頂在內角交成天溝；西翼山牆朝西南街面為正門（石框拱門＋圓窗＋壁燈），
    //   北翼 +u 端山牆＋紅磚煙囪；兩翼內側立面（磚拱窗、庭院門）圍出東南庭院：紅色地墊上的溜滑梯、沙坑、蹺蹺板、長椅；綠鐵欄
    const V1=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,grass,pave,gableU,gableV,winL,winR,tree,bush,crowd,picket,lamp2,bench,polyUV,R4}=L;
      const C={brick:'#c96044',brickD:'#98402d',mortar:'#b05139',mortarD:'#823626',stone:'#ece2c8',stoneD:'#bcae92',plinth:'#7a6e62',plinthD:'#5c5248',
        roof:'#6f7d8e',roofD:'#56626f',roofLn:'#5f6c7b',roofLnD:'#4a5561',ridge:'#97a3b1',gl:'#4c86b4',glD:'#35658e',hi:'#a6d2ee'};
      grass(g,[[0,0],[1,0],[1,1],[0,1]],8411,50);
      // 庭院：草坪＋紅色 PU 地墊（遊具區）＋沙坑；沿兩翼簷下走廊；正門前石階
      flat(g,T(11),T(11),T(20),T(2),'#d6c7a6');flat(g,T(11),T(13),T(2),T(18),'#d6c7a6');
      flat(g,T(19),T(19),T(12),T(12),'#d77a55');for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2)flat(g,T(19+i*3),T(19+j*3),T(3),T(3),'#cc6c48');
      sandbox(L,g,T(15),T(14),T(8),T(6),842);
      pave(g,T(1),T(30),T(11),T(2),'#d9cfbb','#c2b59a',T(2.5),7,null);
      L.lotEdge(g,'#5d7f3f','#9cc377');
      const h=14,r=9;
      SHD.push(['b',T(2),T(2),T(28),T(9),h+6]);SHD.push(['b',T(2),T(11),T(9),T(19),h+6]);
      S.o(.6,(g2,n)=>{
        // ---- 北翼（沿 u）----
        const a0=T(2),a1=T(30),b0=T(2),b1=T(11);
        boxZ(g2,a0,b0,a1-a0,b1-b0,0,2,null,C.plinth,C.plinthD);boxZ(g2,a0,b0,a1-a0,b1-b0,2,h-2,null,C.brick,C.brickD);
        for(let z=4;z<h;z+=2){lnL(g2,b1,a0,a1,z,C.mortar);lnR(g2,a1,b0,b1,z,C.mortarD);}
        [T(13),T(17.5),T(26)].forEach(ua=>winL(g2,n,b1,ua,T(3),4,10,{fr:C.stone,gl:C.gl,hi:C.hi,arch:1,sill:C.stone,mull:1,mc:'#f4efe2',lit:LIT}));
        doorL(L,g2,n,b1,T(22),T(2.5),8,{fr:C.stone,col:'#56b85a'});
        winR(g2,n,a1,T(4),T(3),4,10,{fr:C.stoneD,gl:C.glD,arch:1,sill:C.stoneD,litD:LITD});
        gableU(g2,a0,a1,b0,b1,h,r,{roof:C.roof,line:C.roofLn,rows:4,fas:'#3a424a',fasL:'#3a424a',gab:C.brickD,ridge:C.ridge,
          gabFn:(g3,vm,zr)=>{for(let z=h+2;z<zr-1;z+=2){const w=(vm-b0)*(1-(z-h)/r);lnR(g3,a1,vm-w,vm+w,z,C.mortarD);}
            const p=P(a1,vm,h+4),x=rnd(p[0]),y=rnd(p[1]);RC(g3,x-1,y-1,3,3,C.stoneD);RC(g3,x,y,1,1,'#3a3230');}});
        // 煙囪（北翼後坡、近東端）
        boxZ(g2,T(23),T(6),T(3),T(2),20,12,'#5a4a42',C.brick,C.brickD);boxZ(g2,T(22.5),T(5.5),T(4),T(3),32,1,'#6f6a66','#d0c4a8','#8a7e6a');
        for(let z=22;z<32;z+=2)lnL(g2,T(8),T(23),T(26),z,C.mortar);
        // ---- 西翼（沿 v，山牆朝 +v 為正門）----
        const c0=T(2),c1=T(11),d0=T(11),d1=T(30);
        boxZ(g2,c0,d0,c1-c0,d1-d0,0,2,null,C.plinth,C.plinthD);boxZ(g2,c0,d0,c1-c0,d1-d0,2,h-2,null,C.brick,C.brickD);
        for(let z=4;z<h;z+=2){lnL(g2,d1,c0,c1,z,C.mortar);lnR(g2,c1,T(12),d1,z,C.mortarD);}
        [T(14),T(18.5),T(26)].forEach(va=>winR(g2,n,c1,va,T(3),4,10,{fr:C.stoneD,gl:C.glD,arch:1,sill:C.stoneD,litD:LITD}));
        // 庭院側門（+u 面）
        {const va=T(22),vb=T(24.5);fR(g2,c1,va-T(1),vb+T(1),0,10,C.stoneD);fR(g2,c1,va,vb,0,8,'#3f8fd8');fR(g2,c1,va,vb,5,7,'#9cc4e0');if(n)fR(n,c1,va,vb,5,7,LITD);}
        // 正門：石框拱門＋門楣＋兩側壁燈
        fL(g2,d1,T(4),T(9),0,11,C.stone);doorL(L,g2,n,d1,T(5),T(3),8,{fr:C.stone,col:'#f2b632'});
        for(const uu of[T(3.5),T(9.5)]){const lp=P(uu,d1,8);RC(g2,lp[0],lp[1],1,2,'#f4e0a0');if(n)RC(n,lp[0],lp[1],1,2,LIT);}
        gableV(g2,c0,c1,d0,d1,h,r,{vbR:T(6.5),vbE:T(12),roof:C.roofD,line:C.roofLnD,rows:4,fas:'#3a424a',fasL:'#e6ddc8',fasD:'#3a424a',gab:C.brick,ridge:C.ridge,valley:'#434d58',
          gabFn:(g3,um,zr)=>{for(let z=h+2;z<zr-1;z+=2){const w=(um-c0)*(1-(z-h)/r);lnL(g3,d1,um-w,um+w,z,C.mortar);}
            const p=P(um,d1,h+4),x=rnd(p[0]),y=rnd(p[1]);ell(g3,x,y,2,2,C.stone);RC(g3,x-1,y-1,3,3,'#f2d33c');RC(g3,x,y,1,1,'#e8463a');if(n)RC(n,x-1,y-1,3,3,LIT);}});
      });
      // 遊具與庭院
      slide(L,S,SHD,T(23),T(20),{s:T(4),zp:6,len:T(6),dir:'v',post:'#3f8fd8',chute:'#e8463a',roof:'#f2b632',d:1.5});
      seesaw(L,S,T(14),T(25),T(5),'#56b85a');rider(L,S,T(27),T(19),'#f2b632');
      // 彩旗串：北翼簷口東端 → 庭院西南燈桿
      S.t(1.9,(g2)=>{const a=P(T(29),T(12),12),b=P(T(13),T(29),12),cols=['#e8463a','#f2d33c','#3f8fd8','#56b85a'];const N=16;
        for(let i=0;i<=N;i++){const t=i/N,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t+Math.sin(Math.PI*t)*3;RC(g2,x,y,1,1,'#6a6e76');if(i%2===0&&i<N)RC(g2,x,y+1,1,1,cols[(i/2)%4]);}});
      lamp2(S,T(13),T(29),12,1.95);
      tree(S,SHD,T(29),T(28),.75,2,2.0);bush(S,T(12.5),T(12.5),2,.99);
      picket(S,[T(31),T(12)],[T(31),T(31)],{cols:['#2f6b45'],h:5,step:2,rail:'#2f6b45',d:2.05});
      picket(S,[T(12),T(31)],[T(31),T(31)],{cols:['#2f6b45'],h:5,step:2,rail:'#2f6b45',gaps:[[.04,.3]],d:2.1});
      bench(S,T(19),T(29.5),true,2.0);
      crowd(S,[[T(17),T(16),11],[T(20),T(18),12],[T(26),T(27),13],[T(21),T(24),15],[T(17),T(22),16],[T(29),T(22),10],[T(6),T(31),2],[T(7.5),T(31.3),17],[T(15),T(28),14],[T(22),T(29),5]]);
      S.t(1.6,(g2)=>{const p=P(T(24.5),T(21.5),6);kid(g2,p[0],p[1],3);});
      toys(L,S,[[T(18),T(16.5),'#3f8fd8']]);
      return{};};

    // v2 現代：西半白色平頂園舍（東側整面玻璃＋彩色直鰭、入口挑出雨遮、屋頂人工草皮遊戲平台＋欄杆、後段黃色量體 ABC 立體字）＋滾筒滑梯自屋頂滑到東半遊戲場；彩色地墊、沙池遮陽篷、淺灰格柵圍籬
    const V2=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,grass,pave,winL,winR,tree,bush,crowd,picket,lamp,textL,polyUV}=L;
      const C={wall:'#f2f1ec',wallD:'#c7cacf',gl:'#5a8fb8',glD:'#3b6488',hi:'#b8dcf0',turf:'#6cbf4e',turfD:'#5aa840',yel:'#f4c430',yelD:'#c89818'};
      grass(g,[[0,0],[1,0],[1,1],[0,1]],8421,45);
      polyUV(g,[[T(16),T(1)],[T(31),T(1)],[T(31),T(31)],[T(16),T(31)]],'#4f9fcf');
      const circ=(cu,cv,r,c)=>{const pts=[];for(let i=0;i<24;i++){const t=i/24*Math.PI*2;pts.push([cu+r*Math.cos(t),cv+r*Math.sin(t)]);}polyUV(g,pts,c);};
      circ(T(21),T(8),T(3.5),'#f2c230');circ(T(27.5),T(15),T(2.5),'#e8574a');circ(T(21),T(21),T(3),'#6cc05a');circ(T(27),T(26),T(2.5),'#f28a3a');
      flat(g,T(24),T(3),T(6),T(6),'#ecd79c');BL(g,P(T(24),T(9)),P(T(30),T(9)),'#c9b27a');BL(g,P(T(30),T(3)),P(T(30),T(9)),'#b89e66');
      pave(g,T(16),T(14),T(15),T(3),'#e8e4da','#cfc9ba',T(3),3,null);
      flat(g,T(1),T(30),T(15),T(1.5),'#d8d4ca');
      L.lotEdge(g,'#5d7f3f','#9cc377');
      const u0=T(2),u1=T(15),v0=T(12),v1=T(30),h=13,tb=T(2),te=T(12),th=25;
      SHD.push(['b',u0,v0,u1-u0,v1-v0,h+2]);SHD.push(['b',u0,tb,T(12),te-tb,th]);
      S.o(.5,(g2,n)=>{// 黃色量體＋ABC 立體字
        boxZ(g2,u0,tb,T(12),te-tb,0,th,'#e3dfd4',C.yel,C.yelD);
        for(let z=6;z<th;z+=6){lnR(g2,T(14),tb,te,z,'#b88a14');lnL(g2,te,u0,T(14),z,'#e0b020');}
        [T(4),T(8)].forEach(va=>{fR(g2,T(14),va,va+T(2),15,21,C.glD);if(n)fR(n,T(14),va,va+T(2),15,21,LITD);});
        boxZ(g2,u0,tb,T(12),te-tb,th,1,'#d8d4c8','#f4efe2','#c9c3b6');
        L.textL(g2,te,T(3),22,'ABC',['#e8463a','#2f9a4a','#2f6fc8'],n,'#ffe9b8',1);
      });
      S.o(.9,(g2,n)=>{
        boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,null,C.wall,C.wallD);
        fR(g2,u1,v0+T(1),v1-T(1),2,h-2,C.glD);lnR(g2,u1,v0+T(1),v1-T(1),7,'#2e5070');
        for(let va=v0+T(2),i=0;va<v1-T(1);va+=T(2.5),i++){const p=P(u1,va,0),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x,y-h+2,1,h-3,['#e8463a','#f2b632','#56b85a','#3f8fd8','#8a5cc8'][i%5]);}
        if(n)fR(n,u1,v0+T(1),v1-T(1),3,h-3,'rgba(255,226,160,.8)');
        boxZ(g2,u1,T(13.5),T(4),T(5),h-2,1,'#fbfaf6','#e0ded6','#b9bcc2');for(const vv of[T(14),T(18)]){const p=P(u1+T(3.5),vv,0);RC(g2,p[0],p[1]-h+2,1,h-2,'#9aa0a6');}
        if(n){const p=P(u1+T(2),T(16),h-3);RC(n,p[0],p[1],2,1,LIT);}
        const RB=['#e8463a','#f28a2a','#f2d33c','#56b85a','#3f8fd8','#8a5cc8'];
        for(let i=0;i<5;i++){const ua=u0+T(1+i*2);fL(g2,v1,ua,ua+T(2),2,h-2,RB[i]);}
        winL(g2,n,v1,T(12),T(2),3,10,{gl:C.gl,hi:C.hi,lit:LIT});
        boxZ(g2,u0,v0,u1-u0,v1-v0,h,1,'#e6e4de',C.wall,C.wallD);flat(g2,u0+T(1),v0+T(1),u1-u0-T(2),v1-v0-T(2),C.turf,h+1);
        for(let i=0;i<5;i++)flat(g2,u0+T(2+i*2.2),v0+T(3),T(1),v1-v0-T(6),C.turfD,h+1);
      });
      S.t(.95,(g2)=>{const z=h+1;for(const[a,b]of[[[u1-T(.5),v0+T(.5)],[u1-T(.5),v1-T(.5)]],[[u0+T(.5),v1-T(.5)],[u1-T(.5),v1-T(.5)]]]){const pa=P(a[0],a[1],z+3),pb=P(b[0],b[1],z+3);BL(g2,pa,pb,'#e8ecef');
          const nn=Math.round(Math.abs(pb[0]-pa[0])/2);for(let i=0;i<=nn;i++){const t=i/nn,p=P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);RC(g2,p[0],p[1]-2,1,2,'#cfd4d8');}}
        for(const[u,v,k]of[[T(6),T(18),1],[T(9),T(22),2],[T(5),T(25),3],[T(11),T(16),4]]){const p=P(u,v,h+1);kid(g2,p[0],p[1],k);}});
      // 滾筒滑梯：自屋頂東緣前段沿 +u 斜下，末端緩出
      SHD.push(['b',u1,T(27),T(11),T(3),7]);
      S.o(1.6,(g2)=>{const N=44,rb=[];for(let i=0;i<=N;i++){const t=i/N,u=u1+T(11)*t,z=Math.max(1.5,h+.5-(h-1)*Math.min(1,t*1.15)),p=P(u,T(28.5),z);
          RC(g2,p[0]-1,p[1]-3,3,3,'#f28a2a');RC(g2,p[0]-1,p[1]-3,3,1,'#f9b56a');RC(g2,p[0]-1,p[1]-1,3,1,'#c8641c');if(i%4===0)rb.push(p);}
        for(const p of rb)RC(g2,p[0],p[1]-3,1,3,'#d8701e');
        for(const t of[.3,.62]){const p=P(u1+T(11)*t,T(28.5),0),q=P(u1+T(11)*t,T(28.5),h+.5-(h-1)*t*1.15-2);RC(g2,p[0],q[1],1,p[1]-q[1],'#8a9096');}
        const top=P(u1,T(28.5),h);RC(g2,top[0]-1,top[1]-6,3,6,'#f28a2a');RC(g2,top[0]-1,top[1]-6,3,1,'#f9b56a');});
      // 沙池遮陽篷（四柱方形布篷，扇形垂邊）
      SHD.push(['b',T(24),T(3),T(6),T(6),12,9]);
      S.o(.95,(g2)=>{for(const[a,b]of[[T(24),T(9)],[T(30),T(9)],[T(30),T(3)]]){const p=P(a,b,0);RC(g2,p[0],p[1]-10,1,10,'#8a9096');}
        const c=P(T(27),T(6),14);fp(g2,[P(T(23.5),T(9.5),10),P(T(30.5),T(9.5),10),c],'#f4efe2');fp(g2,[P(T(30.5),T(2.5),10),P(T(30.5),T(9.5),10),c],'#d8d0c0');
        for(let k=0;k<7;k++){const p=P(T(23.5+k),T(9.5),10);RC(g2,p[0],p[1],1,1,k%2?'#f4efe2':'#f28a3a');}for(let k=0;k<7;k++){const p=P(T(30.5),T(9.5-k),10);RC(g2,p[0],p[1],1,1,k%2?'#d8d0c0':'#c86a28');}
        fp(g2,[P(T(27),T(9.5),10),P(T(30.5),T(9.5),10),c],'#f28a3a');RC(g2,c[0],c[1]-2,1,2,'#8a9096');});
      tree(S,SHD,T(29.5),T(19),.75,2,1.5);bush(S,T(17),T(29.5),2,1.98);bush(S,T(30),T(30),2,2.3);
      picket(S,[T(31),T(1)],[T(31),T(31)],{cols:['#dfe4e8','#aab2b9'],h:5,step:1,d:2.05});
      picket(S,[T(16),T(31)],[T(31),T(31)],{cols:['#dfe4e8','#aab2b9'],h:5,step:1,gaps:[[.02,.2]],d:2.1});
      crowd(S,[[T(21),T(8),11],[T(25),T(5),12],[T(27),T(14),13],[T(22),T(20),14],[T(25),T(18),15],[T(20),T(11),16],[T(24),T(29),17],[T(19),T(15.5),3],[T(17.5),T(16),5],[T(26.5),T(26),10]]);
      lamp(S,T(29.5),T(16),13,1.46);
      return{};};
    const out=[];
    const VV=[V0,V1,V2];
    for(let v=0;v<3;v++){try{out[v]=assemble(W,H,AX,AY,SZ,VV[v]);}catch(e){errs.push('k84v'+v+': '+(e&&e.stack||e));}}
    install(84,out);
  }catch(e){errs.push('k84: '+(e&&e.stack||e));}

  // ================= k87 農貿市場（2×2） =================
  try{
    const [W,H,AX,AY]=dims(87,[136,150,68,148]),SZ=2;
    const LIT='#ffe2a0',LITD='#f0cf88';
    const PROD=[['#d8412f','#f47a5c'],['#f08a24','#f9b86a'],['#5fa843','#92d064'],['#f2d046','#fbeb94'],['#7a4a8a','#a878b8'],['#86c45a','#bfe88a'],['#c8302a','#ec6a5a'],['#b88a55','#dcb888'],['#e07a1f','#f4a860'],['#3f8a3a','#6cb860']];
    const AW=[['#d8453a','#f4efe2'],['#3f8f55','#f4efe2'],['#f2c230','#f4efe2'],['#2f6fb0','#f4efe2'],['#e8762a','#fbe3c0'],['#8a4f9a','#f4efe2']];
    // 共用元件工廠（綁定 L／S／SHD）
    const MK=(L,S,SHD)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,hsh}=L;
      // 菜箱：頂面＝作物色（兩色點），側面木板
      const crate=(g,u,v,du,dv,z,k)=>{const pc=PROD[((k%PROD.length)+PROD.length)%PROD.length];boxZ(g,u,v,du,dv,z,2,pc[0],'#c09258','#8e6a3e');
        const p=P(u+du*.5,v+dv*.3,z+2);RC(g,p[0],p[1],1,1,pc[1]);const q=P(u+du*.2,v+dv*.7,z+2);RC(g,q[0],q[1],1,1,pc[1]);};
      // 條紋遮陽篷面：a..b（u）、後 vb 高 zb → 前 vf 高 zf；sw 條寬（u）
      const awnU=(g,a,b,vb,zb,vf,zf,cols,sw=T(2))=>{let i=0;for(let t=a;t<b-1e-6;t+=sw,i++){const e=Math.min(b,t+sw);fp(g,[P(t,vb,zb),P(e,vb,zb),P(e,vf,zf),P(t,vf,zf)],cols[i%2]);
          fL(g,vf,t,e,zf-2-(i%2),zf,cols[i%2]===cols[1]?SH(cols[1],-18):SH(cols[0],-24));}
        BL(g,P(a,vb,zb),P(b-T(1),vb,zb),SH(cols[0],30));};
      // 面向 +v 的攤位：桌 u..u+len、v..v+3；後柱在 v-1、前柱在 v+6；篷 zb→zf；作物箱排在桌上
      const stallV=(u,v,len,aw,seed,o={})=>{const dt=T(3),vb=v-T(1),vf=v+T(6),zb=o.zb||12,zf=o.zf||9;
        SHD.push(['b',u,vb,len,vf-vb,2,zf-2]);
        S.t(u+v+len*.5-.02,(g)=>{const p=P(u+len*.45,v-T(.5));person(g,p[0],p[1],(seed*7)%10);});
        S.o(u+v+len+T(6),(g,n)=>{for(const uu of[u,u+len-T(1)]){const p=P(uu,vb,0);RC(g,p[0],p[1]-zb,1,zb,'#6a6e76');const q=P(uu,vf,0);RC(g,q[0],q[1]-zf,1,zf,'#8a9096');}
          boxZ(g,u,v,len,dt,0,3,'#d6b98a','#b8935e','#8e6a3e');
          let k=0;for(let t=u+T(.5);t<u+len-T(2);t+=T(2.5),k++)crate(g,t,v+T(.5),T(2),T(2),3,seed+k);
          if(o.ground!==false){let j=0;for(let t=u+T(1);t<u+len-T(2.5);t+=T(3.5),j++)crate(g,t,v+dt+T(.5),T(2.5),T(2),0,seed+5+j);}
          awnU(g,u,u+len,vb,zb,vf,zf,aw);
          if(n&&o.bulbs!==false){for(let t=u+T(1);t<u+len-T(.5);t+=T(3)){const p=P(t,vf,zf-3);RC(g,p[0],p[1],1,1,'#f6d36a');RC(n,p[0],p[1],1,1,'#fff0b8');}}
          else if(o.bulbs!==false){for(let t=u+T(1);t<u+len-T(.5);t+=T(3)){const p=P(t,vf,zf-3);RC(g,p[0],p[1],1,1,'#f6d36a');}}});};
      // 面向 +u 的攤位（桌沿 v 排；篷往 +u 下斜）
      const stallU=(u,v,len,aw,seed,o={})=>{const dt=T(3),ub=u-T(1),uf=u+T(6),zb=o.zb||12,zf=o.zf||9;
        SHD.push(['b',ub,v,uf-ub,len,2,zf-2]);
        S.t(u+v+len*.5-.02,(g)=>{const p=P(u-T(.5),v+len*.5);person(g,p[0],p[1],(seed*3)%10);});
        S.o(u+v+len+T(6),(g,n)=>{for(const vv of[v,v+len-T(1)]){const p=P(ub,vv,0);RC(g,p[0],p[1]-zb,1,zb,'#6a6e76');const q=P(uf,vv,0);RC(g,q[0],q[1]-zf,1,zf,'#8a9096');}
          boxZ(g,u,v,dt,len,0,3,'#d6b98a','#b8935e','#8e6a3e');
          let k=0;for(let t=v+T(.5);t<v+len-T(2);t+=T(2.5),k++)crate(g,u+T(.5),t,T(2),T(2),3,seed+k);
          let i=0;for(let t=v;t<v+len-1e-6;t+=T(2),i++){const e=Math.min(v+len,t+T(2));fp(g,[P(ub,t,zb),P(ub,e,zb),P(uf,e,zf),P(uf,t,zf)],i%2?SH(aw[1],-26):SH(aw[0],-22));
            fR(g,uf,t,e,zf-2-(i%2),zf,i%2?SH(aw[1],-44):SH(aw[0],-44));}
          for(let t=v+T(1);t<v+len-T(.5);t+=T(3)){const p=P(uf,t,zf-3);RC(g,p[0],p[1],1,1,'#f6d36a');if(n)RC(n,p[0],p[1],1,1,'#fff0b8');}});};
      // 地上菜箱堆（兩層）
      const stack=(u,v,nu,nv,seed,two)=>{S.o(u+v+nu*T(2.5)+nv*T(2.5),(g)=>{for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){crate(g,u+i*T(2.5),v+j*T(2.5),T(2.2),T(2.2),0,seed+i*3+j);
          if(two&&(i+j)%2===0)crate(g,u+i*T(2.5)+T(.2),v+j*T(2.5)+T(.2),T(2),T(2),2,seed+i+j*5+1);}});};
      // 小貨車（農用輕型卡車）沿 u、車頭朝 +u：u,v＝車尾西北角；貨斗堆滿菜箱
      const keiU=(u,v,col,seed,d)=>{const Lb=T(8),Lc=T(4),Wd=T(5);SHD.push(['b',u,v,Lb+Lc,Wd,7]);
        S.o(d!=null?d:u+v+Lb+Lc+Wd,(g,n)=>{boxZ(g,u,v,Lb+Lc,Wd,1,1,null,'#2a2d31','#1f2225');
          boxZ(g,u,v,Lb,Wd,2,3,null,SH(col,-6),SH(col,-40));
          for(let i=0;i<3;i++)for(let j=0;j<2;j++)crate(g,u+T(.5)+i*T(2.5),v+T(.5)+j*T(2.2),T(2.2),T(2),3,seed+i*2+j);
          boxZ(g,u+Lb,v,Lc,Wd,2,6,SH(col,24),col,SH(col,-32));fL(g,v+Wd,u+Lb+T(1),u+Lb+Lc-T(.5),5,7,'#3a5163');fR(g,u+Lb+Lc,v+T(.5),v+Wd-T(.5),5,7,'#2e4252');
          for(const t of[u+T(2),u+Lb+T(1.5)]){const p=P(t,v+Wd,0);RC(g,p[0],p[1]-2,2,2,'#1a1d20');}
          const hl=P(u+Lb+Lc,v+T(1),3);RC(g,hl[0],hl[1],1,1,'#f4f0d8');if(n){RC(n,hl[0],hl[1],1,1,'#fff6d0');const h2=P(u+Lb+Lc,v+Wd-T(1),3);RC(n,h2[0],h2[1],1,1,'#fff6d0');}});};
      // 小貨車沿 v、車頭朝 +v
      const keiV=(u,v,col,seed,d)=>{const Lb=T(8),Lc=T(4),Wd=T(5);SHD.push(['b',u,v,Wd,Lb+Lc,7]);
        S.o(d!=null?d:u+v+Lb+Lc+Wd,(g,n)=>{boxZ(g,u,v,Wd,Lb+Lc,1,1,null,'#2a2d31','#1f2225');
          boxZ(g,u,v,Wd,Lb,2,3,null,SH(col,10),SH(col,-40));
          for(let i=0;i<2;i++)for(let j=0;j<3;j++)crate(g,u+T(.5)+i*T(2.2),v+T(.5)+j*T(2.5),T(2),T(2.2),3,seed+i*2+j);
          boxZ(g,u,v+Lb,Wd,Lc,2,6,SH(col,24),SH(col,6),SH(col,-32));fL(g,v+Lb+Lc,u+T(.5),u+Wd-T(.5),5,7,'#4a6378');fR(g,u+Wd,v+Lb+T(1),v+Lb+Lc-T(.5),5,7,'#2e4252');
          for(const t of[v+T(2),v+Lb+T(1.5)]){const p=P(u+Wd,t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1a1d20');}
          const hl=P(u+T(1),v+Lb+Lc,3);RC(g,hl[0],hl[1],1,1,'#f4f0d8');if(n){RC(n,hl[0],hl[1],1,1,'#fff6d0');const h2=P(u+Wd-T(1),v+Lb+Lc,3);RC(n,h2[0],h2[1],1,1,'#fff6d0');}});};
      // 小客車（沿 v 停，車頭朝 +v）
      const carV=(u,v,col,d)=>{const Lc=T(7),Wd=T(4);SHD.push(['b',u,v,Wd,Lc,4]);
        S.o(d!=null?d:u+v+Lc+Wd,(g)=>{boxZ(g,u,v,Wd,Lc,1,2,SH(col,20),SH(col,8),SH(col,-34));boxZ(g,u+T(.5),v+T(1.5),Wd-T(1),T(3.5),3,2,SH(col,30),'#4a6378','#2e4252');
          for(const t of[v+T(1.5),v+T(5.5)]){const p=P(u+Wd,t,0);RC(g,p[0]-1,p[1]-1,1,1,'#1a1d20');}});};
      const carU=(u,v,col,d)=>{const Lc=T(7),Wd=T(4);SHD.push(['b',u,v,Lc,Wd,4]);
        S.o(d!=null?d:u+v+Lc+Wd,(g)=>{boxZ(g,u,v,Lc,Wd,1,2,SH(col,20),col,SH(col,-34));boxZ(g,u+T(1.5),v+T(.5),T(3.5),Wd-T(1),3,2,SH(col,30),'#4a6378','#2e4252');
          for(const t of[u+T(1.5),u+T(5.5)]){const p=P(t,v+Wd,0);RC(g,p[0],p[1]-1,1,1,'#1a1d20');}});};
      // 市集陽傘攤（桌＋大傘）
      const umb=(u,v,col,seed,d)=>{SHD.push(['e',P(u+T(3),v-T(1.5))[0],P(u+T(3),v-T(1.5))[1],6,3]);
        S.o(d!=null?d:u+v+T(3),(g)=>{boxZ(g,u-T(2),v-T(1),T(4),T(2.5),0,3,'#d6b98a','#b8935e','#8e6a3e');crate(g,u-T(1.5),v-T(.5),T(1.5),T(1.5),3,seed);crate(g,u+T(.3),v-T(.5),T(1.5),T(1.5),3,seed+3);
          const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-12,1,9,'#6d6a64');
          ell(g,x,y-12,6,2,SH(col,-30));ell(g,x,y-13,6,2,col);for(let k=-5;k<=5;k+=3)RC(g,x+k,y-14,1,3,SH(col,40));RC(g,x-2,y-15,5,1,SH(col,24));RC(g,x,y-16,1,1,'#6d6a64');});};
      // 路燈
      const lampP=(u,v,h=17,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#4e585e');RC(g,x-1,y-1,3,1,'#3e464b');
        RC(g,x-2,y-h-1,5,1,'#3e464b');RC(g,x-2,y-h,5,1,'#efe2b0');if(n){RC(n,x-2,y-h,5,1,'#ffe6a0');RC(n,x-1,y-h+1,3,1,'rgba(255,226,160,.5)');}});
      const person=L.person;
      return{crate,awnU,stallV,stallU,stack,keiU,keiV,carV,carU,umb,lampP,person};};
    // 開放式棚架（屋脊 ∥ u）：柱列＋山牆頂（+u 端露出桁架）＋屋脊通風氣窗；bays＝柱距（u）
    const shedU=(L,S,SHD,u0,u1,v0,v1,h,r,o)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,lnL,vln,gableU}=L,vm=(v0+v1)/2,bay=o.bay||T(8);
      SHD.push(['b',u0,v0,u1-u0,v1-v0,r+2,h-1]);
      // 後柱（細線，最先畫）
      S.t(o.dBack!=null?o.dBack:u0+v0,(g)=>{for(let u=u0;u<=u1+1e-6;u+=bay){const p=P(u,v0,0);RC(g,p[0],p[1]-h,1,h,o.post||'#4a5058');}});
      // 屋頂
      S.o(o.d,(g,n)=>{const R=gableU(g,u0,u1,v0,v1,h,r,{ov:T(2),ou:T(1.5),roof:o.roof,line:o.line,rows:o.rows||5,fas:o.fas,fasL:o.fasL||o.fas,fasD:o.fasD,gab:o.under||'#3a3f44',ridge:o.ridge,
          gabFn:(g3,vmm,zr)=>{BL(g3,P(u1,v0,h),P(u1,v1-T(1),h),o.truss||'#7a828a');BL(g3,P(u1,vmm,zr),P(u1,vmm,h),o.truss||'#7a828a');
            BL(g3,P(u1,v0+(vmm-v0)*.5,h+(zr-h)*.5),P(u1,vmm,h),o.truss||'#7a828a');BL(g3,P(u1,vmm+(v1-vmm)*.5,h+(zr-h)*.5),P(u1,vmm,h),o.truss||'#7a828a');}});
        // 屋脊通風氣窗（連續小山牆）
        if(o.vent){const a=u0+T(3),b=u1-T(3),w=T(2.5);boxZ(g,a,vm-w,b-a,2*w,R.zr-2,4,null,o.ventWall||'#d9dcd6',SH(o.ventWall||'#d9dcd6',-40));
          for(let t=a+T(1);t<b;t+=T(2))fL(g,vm+w,t,t+T(1),R.zr-1,R.zr+1,'#4a5058');
          fp(g,[P(a-T(.5),vm+w+T(1),R.zr+2),P(b+T(.5),vm+w+T(1),R.zr+2),P(b+T(.5),vm,R.zr+5),P(a-T(.5),vm,R.zr+5)],o.ventRoof||o.roof);
          fp(g,[P(b+T(.5),vm+w+T(1),R.zr+2),P(b+T(.5),vm,R.zr+5),P(b+T(.5),vm-w-T(1),R.zr+2)],SH(o.ventRoof||o.roof,-40));}
        // 簷下吊燈（白天燈罩、夜間發光）
        for(let u=u0+bay/2;u<u1;u+=bay){const p=P(u,v1-T(1),h-3);RC(g,p[0]-1,p[1]-1,3,1,'#3a3f44');RC(g,p[0],p[1],1,1,'#f4e0a0');if(n){RC(n,p[0],p[1],1,1,'#fff0c0');RC(n,p[0]-1,p[1]+1,3,1,'rgba(255,226,160,.45)');}}});
      // 前柱與 +u 端柱（細線，壓在屋頂之後的簷下）
      S.t(o.d+.001,(g)=>{for(let u=u0;u<=u1+1e-6;u+=bay){const p=P(u,v1,0),q=P(u,v1,h-1);RC(g,p[0],q[1],1,p[1]-q[1],o.post||'#4a5058');RC(g,p[0]+1,q[1],1,p[1]-q[1],SH(o.post||'#4a5058',-20));}
        for(const v of[v0+(v1-v0)/2]){const p=P(u1,v,0),q=P(u1,v,h-1);RC(g,p[0],q[1],1,p[1]-q[1],o.post||'#4a5058');}});};
    // 開放式棚架（屋脊 ∥ v）
    const shedV=(L,S,SHD,u0,u1,v0,v1,h,r,o)=>{const{P,RC,BL,fp,gableV}=L,um=(u0+u1)/2,bay=o.bay||T(8);
      SHD.push(['b',u0,v0,u1-u0,v1-v0,r+2,h-1]);
      S.t(o.dBack!=null?o.dBack:u0+v0,(g)=>{for(let v=v0;v<=v1+1e-6;v+=bay){const p=P(u0,v,0);RC(g,p[0],p[1]-h,1,h,o.post||'#4a5058');}});
      S.o(o.d,(g,n)=>{gableV(g,u0,u1,v0,v1,h,r,{ov:T(1.5),ou:T(2),roof:o.roof,line:o.line,rows:o.rows||4,fas:o.fas,fasL:o.fasL||o.fas,fasD:o.fasD,gab:o.under||'#3a3f44',ridge:o.ridge,
          gabFn:(g3,umm,zr)=>{BL(g3,P(u0,v1,h),P(u1-T(1),v1,h),o.truss||'#7a828a');BL(g3,P(umm,v1,zr),P(umm,v1,h),o.truss||'#7a828a');}});
        for(let v=v0+bay/2;v<v1;v+=bay){const p=P(u1-T(1),v,h-3);RC(g,p[0]-1,p[1]-1,3,1,'#3a3f44');RC(g,p[0],p[1],1,1,'#f4e0a0');if(n){RC(n,p[0],p[1],1,1,'#fff0c0');RC(n,p[0]-1,p[1]+1,3,1,'rgba(255,226,160,.45)');}}});
      S.t(o.d+.001,(g)=>{for(let v=v0;v<=v1+1e-6;v+=bay){const p=P(u1,v,0),q=P(u1,v,h-1);RC(g,p[0],q[1],1,p[1]-q[1],o.post||'#4a5058');RC(g,p[0]+1,q[1],1,p[1]-q[1],SH(o.post||'#4a5058',-20));}
        const p=P(um,v1,0),q=P(um,v1,h-1);RC(g,p[0],q[1],1,p[1]-q[1],o.post||'#4a5058');});};
    // 棚下長桌（沿 u）＋菜箱
    const tableU=(L,S,M,u0,u1,v,seed,d)=>{const{boxZ}=L;S.o(d,(g)=>{boxZ(g,u0,v,u1-u0,T(3),0,3,'#d6b98a','#b8935e','#8e6a3e');let k=0;for(let t=u0+T(.5);t<u1-T(2);t+=T(2.5),k++)M.crate(g,t,v+T(.5),T(2),T(2),3,seed+k);});};
    const tableV=(L,S,M,u,v0,v1,seed,d)=>{const{boxZ}=L;S.o(d,(g)=>{boxZ(g,u,v0,T(3),v1-v0,0,3,'#d6b98a','#b8935e','#8e6a3e');let k=0;for(let t=v0+T(.5);t<v1-T(2);t+=T(2.5),k++)M.crate(g,u+T(.5),t,T(2),T(2),3,seed+k);});};
    // 停車格線（地面）：沿 u 排、車頭朝 +v；n 格、格寬 w
    const bays=(L,g,u0,v0,n,w,dep)=>{const{P,BL}=L;for(let i=0;i<=n;i++){const u=u0+i*w;BL(g,P(u,v0),P(u,v0+dep-T(1)),'#e8e6de');}};

    // v0 長棚：中段一座鋼構長棚（紅色浪板山牆頂＋屋脊通風氣窗、柱列、+u 端露桁架），棚下三排長桌堆滿菜箱；
    //   棚前一排條紋遮陽篷露天攤＋人潮步道；東角兩輛農用小貨車直接開斗賣菜；後側卸貨巷停小貨車；前緣一排停車格
    const V0=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,fp,flat,boxZ,fL,fR,grass,pave,tree,bush,crowd,scatterIn,texture,R4}=L;const M=MK(L,S,SHD);
      grass(g,[[0,0],[2,0],[2,2],[0,2]],8701,40);
      // 地坪：後巷柏油、棚下水泥、前廣場磚鋪、前緣停車場柏油
      flat(g,T(2),T(2),T(60),T(10),'#6f6e6a');texture(g,R4(T(2),T(2),T(60),T(10)),null,['#666561','#7a7974'],300,871);
      flat(g,T(4),T(12),T(56),T(22),'#b9b3a6');
      pave(g,T(2),T(34),T(60),T(15),'#d8c8a8','#c4b28e',T(4),8702,['#cfbc98','#e2d4b6']);
      flat(g,T(2),T(49),T(60),T(13),'#6f6e6a');texture(g,R4(T(2),T(49),T(60),T(13)),null,['#666561','#7a7974'],260,872);
      bays(L,g,T(6),T(50),8,T(6),T(11));BL(g,P(T(2),T(49)),P(T(61),T(49)),'#a8a294');
      L.lotEdge(g,'#6b6860','#a9a497');
      // 後巷卸貨小貨車
      M.keiU(T(8),T(4),'#e8ecef',11,.4);M.keiU(T(26),T(4),'#6fa0c8',21,.45);M.keiU(T(44),T(4),'#e8ecef',31,.5);
      // 長棚
      const u0=T(5),u1=T(59),v0=T(13),v1=T(33),h=16,r=11;
      shedU(L,S,SHD,u0,u1,v0,v1,h,r,{d:1.4,dBack:.55,bay:T(9),roof:'#c85a3c',line:'#a8452c',rows:6,fas:'#7c3222',fasL:'#e8e2d4',fasD:'#6a2a1c',under:'#4a3a34',ridge:'#e07a5a',vent:1,ventWall:'#e8e2d4',ventRoof:'#b04a30',truss:'#8a8278'});
      // 棚下三排長桌＋攤商
      for(const[v,s,dd]of[[T(15),1,.6],[T(22),9,.8],[T(28.5),17,1.0]]){for(let a=T(7);a<T(50);a+=T(12)){tableU(L,S,M,a,a+T(10),v,s+((a*32)|0),dd+a*.01);}
        crowd(S,[[T(12),v-T(1),s%10],[T(30),v-T(1),(s+3)%10],[T(47),v-T(1),(s+6)%10]],0,dd-.05);}
      crowd(S,scatterIn(8703,10,R4(T(6),T(19),T(50),T(2.5))),0,.75);crowd(S,scatterIn(8704,8,R4(T(6),T(25.5),T(50),T(2.5))),0,.95);
      // 棚前露天攤（五攤條紋篷）
      [[T(4),0],[T(12),1],[T(20),2],[T(28),3],[T(36),4]].forEach(([u,i])=>M.stallV(u,T(37),T(7),AW[i],3+i*4));
      // 東角：開斗賣菜的小貨車＋菜箱堆
      M.keiV(T(46),T(35),'#e8ecef',41,1.98);M.keiV(T(54),T(35),'#d8453a',51,2.1);
      M.stack(T(44),T(49),1,1,61);
      // 人潮
      crowd(S,scatterIn(8705,16,R4(T(3),T(34),T(42),T(3))));crowd(S,scatterIn(8706,18,R4(T(3),T(45),T(56),T(4))));crowd(S,scatterIn(8707,6,R4(T(44),T(34),T(18),T(14))));
      // 前緣停車
      const CC=['#c8463a','#e8e6de','#3f6f9e','#2a2d31','#d8b43a','#5f8f5a','#9aa0a6'];
      [0,1,3,4,6].forEach((i,k)=>M.carV(T(7)+i*T(6),T(51),CC[k%CC.length]));M.keiV(T(7)+T(12)+T(.5),T(49.5),'#e8ecef',71);
      M.lampP(T(3),T(35),17);M.lampP(T(44),T(47),17);M.lampP(T(61),T(33),17);
      tree(S,SHD,T(2.5),T(46),.95,0);tree(S,SHD,T(61.5),T(47),.95,2);tree(S,SHD,T(61),T(10),1,0);
      return{};};

    // v1 紅磚市場廳（T615 接手補畫；原稿 v1／v2 為 V0 佔位）：屋脊沿 v 的室內菜市場，山牆正面朝前廣場（大門＋綠底 MARKET 招牌＋山牆圓窗），
    //   屋脊採光氣樓、+u 側拱窗列與卸貨月台；前廣場兩座條紋篷攤＋陽傘攤；西側一排停車格；東側卸貨區兩輛小貨車與菜箱堆
    const V1=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,flat,boxZ,fL,fR,lnL,lnR,grass,pave,tree,crowd,scatterIn,texture,R4,gableV,winL,winR,textL}=L;const M=MK(L,S,SHD);
      grass(g,[[0,0],[2,0],[2,2],[0,2]],8711,40);
      // 地坪：西側停車柏油、中央磚鋪、東側卸貨水泥
      flat(g,T(2),T(2),T(13),T(60),'#6f6e6a');texture(g,R4(T(2),T(2),T(13),T(60)),null,['#666561','#7a7974'],260,8713);
      for(let v=T(6);v<T(60);v+=T(8))BL(g,P(T(3),v),P(T(14),v),'#e8e6de');
      pave(g,T(15),T(2),T(32),T(60),'#d8c8a8','#c4b28e',T(4),8712,['#cfbc98','#e2d4b6']);
      flat(g,T(47),T(2),T(15),T(60),'#b9b3a6');texture(g,R4(T(47),T(2),T(15),T(60)),null,['#aea89a','#c4bfb2'],200,8714);
      L.lotEdge(g,'#6b6860','#a9a497');
      // 西側停車（車頭朝 +u）
      const CC=['#c8463a','#e8e6de','#3f6f9e','#2a2d31','#d8b43a','#5f8f5a','#9aa0a6'];
      [T(7),T(15),T(31),T(47)].forEach((v,k)=>M.carU(T(4),v+T(1.5),CC[(k*3+1)%CC.length]));
      // 市場廳：紅磚牆＋石基＋灰浪板山牆頂（屋脊 ∥ v）
      const u0=T(17),u1=T(47),v0=T(8),v1=T(40),h=15,r=10,um=(u0+u1)/2;
      SHD.push(['b',u0,v0,u1-u0,v1-v0,h+r-3]);
      S.o(1.9,(g2,n)=>{
        boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,null,'#b8603e','#8a4430');
        for(let z=3;z<h;z+=3){lnL(g2,v1,u0,u1,z,'#a45538');lnR(g2,u1,v0,v1,z,'#7a3c2a');}
        fL(g2,v1,u0,u1,0,2,'#9a948a');fR(g2,u1,v0,v1,0,2,'#76716a');
        for(let v=v0+T(3);v<v1-T(3);v+=T(6))winR(g2,n,u1,v,T(3),5,11,{gl:'#4f6c82',fr:'#e8e2d4',arch:1,hi:'#7fa0b8'});
        // 正面：大門（拉門豎條）、兩側小窗、綠底招牌
        fL(g2,v1,um-T(5),um+T(5),0,9,'#e8e2d4');fL(g2,v1,um-T(4),um+T(4),0,8,'#3a2e28');
        for(let u=um-T(4);u<um+T(4);u+=T(2))BL(g2,P(u,v1,0),P(u,v1,8),'#4e3f36');
        if(n)fL(n,v1,um-T(4),um+T(4),0,8,'#ffe2a0');
        for(const ua of[u0+T(2),u1-T(5)])winL(g2,n,v1,ua,T(3),3,7,{gl:'#4f6c82',fr:'#e8e2d4',hi:'#7fa0b8'});
        fL(g2,v1,u0+T(1),u1-T(1),10,15,'#2f5e3a');lnL(g2,v1,u0+T(1),u1-T(1),15,'#e8e2d4');
        textL(g2,v1,u0+T(2),14,'MARKET','#f4efe2',n,'#fff6d0');
        const R=gableV(g2,u0,u1,v0,v1,h,r,{ov:T(1.5),ou:T(1.5),roof:'#5d6770',line:'#4c555d',rows:5,fas:'#3f464c',fasL:'#e8e2d4',fasD:'#343a40',gab:'#c06a48',ridge:'#8a949c'});
        {const p=P(um,v1,h+4);RC(g2,p[0]-1,p[1]-1,3,3,'#e8e2d4');RC(g2,p[0],p[1],1,1,'#4f6c82');if(n)RC(n,p[0],p[1],1,1,'#ffe2a0');}
        // 屋脊採光氣樓（小屋頂＋+u 側玻璃帶）
        const a=v0+T(4),b=v1-T(4),w=T(3);
        boxZ(g2,um-w,a,2*w,b-a,R.zr-2,4,null,'#e8e2d4','#b8b2a6');
        for(let v=a+T(1);v<b-T(1);v+=T(2)){fR(g2,um+w,v,v+T(1),R.zr-1,R.zr+1,'#4f6c82');if(n)fR(n,um+w,v,v+T(1),R.zr-1,R.zr+1,'#f0cf88');}
        gableV(g2,um-w,um+w,a,b,R.zr+2,3,{ov:T(1),ou:T(1),roof:'#6d7780',fas:'#3f464c',fasL:'#e8e2d4',gab:'#e8e2d4',ridge:'#98a2aa'});
      });
      // 東側卸貨月台、菜箱堆、兩輛小貨車
      S.o(2.0,(g2)=>{boxZ(g2,u1,T(14),T(3),T(16),0,3,'#b8b2a6','#a8a294','#8a857c');});
      M.stack(T(50.5),T(19),1,2,81,true);
      M.keiV(T(52),T(5),'#e8ecef',83);M.keiV(T(55),T(24),'#6fa0c8',85);
      M.stack(T(50),T(44),2,1,87,true);
      // 前廣場：兩座條紋篷攤、陽傘攤、人潮、路燈
      M.stallV(T(16),T(46),T(8),AW[0],5);M.stallV(T(38),T(46),T(8),AW[3],9);
      M.umb(T(22),T(57),'#3f8f55',13);M.umb(T(42),T(58),'#d8453a',17);   // 陽傘避開大門正前方
      crowd(S,scatterIn(8715,14,R4(T(16),T(41),T(30),T(4))));crowd(S,scatterIn(8716,12,R4(T(16),T(53),T(30),T(8))));
      M.lampP(T(16),T(41),17);M.lampP(T(48),T(41),17);
      tree(S,SHD,T(4),T(4),1,0);tree(S,SHD,T(60),T(50),.95,2);tree(S,SHD,T(3),T(58),.9,1);
      return{};};

    // v2 露天農夫市集（T615 接手補畫）：沒有大棚——磚鋪廣場上三排小攤（條紋篷攤、陽傘攤），產地直送小貨車開斗賣菜，
    //   西角木造服務亭，燈串掛在兩根路燈之間，四周行道樹與矮灌木；剪影低而碎，與 v0 長棚、v1 市場廳明顯不同
    const V2=(K,L,g,ng,S,SHD)=>{const{P,RC,BL,boxZ,lnL,lnR,grass,pave,tree,bush,bench,crowd,scatterIn,R4,gableU,winL}=L;const M=MK(L,S,SHD);
      grass(g,[[0,0],[2,0],[2,2],[0,2]],8721,50);
      pave(g,T(4),T(4),T(56),T(56),'#cdb48e','#b89e78',T(4),8722,['#c4aa84','#dcc6a2']);
      L.lotEdge(g,'#6b6860','#a9a497');
      // 三排之間留足前後距（排距不足時中排陽傘會壓在後排篷頂上＝疊在一起）；中排與後排錯位，不成一直列
      // 後排：四座條紋篷攤
      [[T(8),0],[T(19),1],[T(30),2],[T(41),3]].forEach(([u,i])=>M.stallV(u,T(6),T(9),AW[i],21+i*4));
      // 中排：陽傘攤
      [[T(14),'#d8453a'],[T(24),'#f2c230'],[T(34),'#3f8f55'],[T(44),'#2f6fb0']].forEach(([u,c],i)=>M.umb(u,T(27),c,41+i*3));
      // 前排：三座條紋篷攤
      [[T(16),4],[T(27),5],[T(38),1]].forEach(([u,i])=>M.stallV(u,T(42),T(8),AW[i],51+i*5));
      // 東側：產地直送小貨車＋菜箱堆
      M.keiV(T(52),T(18),'#e8ecef',61);M.keiV(T(52),T(36),'#d8453a',63);
      M.stack(T(48),T(22),1,2,65,true);M.stack(T(48),T(40),1,2,67,false);
      // 西角服務亭（木牆＋綠山牆頂，屋脊 ∥ u）
      const ku0=T(4),ku1=T(12),kv0=T(46),kv1=T(54),kh=8;SHD.push(['b',ku0,kv0,ku1-ku0,kv1-kv0,kh+4]);
      S.o(ku0+kv1,(g2,n)=>{boxZ(g2,ku0,kv0,ku1-ku0,kv1-kv0,0,kh,null,'#c8a070','#9a7650');
        for(let z=2;z<kh;z+=2){lnL(g2,kv1,ku0,ku1,z,'#b48c5e');lnR(g2,ku1,kv0,kv1,z,'#88683f');}
        winL(g2,n,kv1,ku0+T(2),T(4),3,6,{gl:'#4f6c82',fr:'#f4efe2',hi:'#7fa0b8'});
        gableU(g2,ku0,ku1,kv0,kv1,kh,5,{ov:T(1),ou:T(1),roof:'#4f7f55',line:'#3f6a45',rows:3,fas:'#2f4a33',fasL:'#f4efe2',gab:'#c8a070',ridge:'#6f9f75'});});
      // 燈串：兩根路燈之間下垂的電線，白天是燈泡、夜裡發光
      const su0=T(6),su1=T(58),sv=T(35),sz=14;
      M.lampP(su0,sv,17);M.lampP(su1,sv,17);
      S.t(su0+sv+.9,(g2,n)=>{const a=P(su0,sv,sz),b=P(su1,sv,sz),N=Math.round(b[0]-a[0]);
        for(let i=0;i<=N;i++){const t=i/N,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t+4*Math.sin(Math.PI*t);
          RC(g2,x,y,1,1,'#3a3d40');if(i%3===1){RC(g2,x,y+1,1,1,'#f6d36a');if(n)RC(n,x,y+1,1,1,'#fff0b8');}}});
      // 前廣場野餐長椅、人潮
      bench(S,T(24),T(52),true);bench(S,T(34),T(55),true);
      crowd(S,scatterIn(8723,12,R4(T(6),T(15),T(46),T(8))));crowd(S,scatterIn(8724,10,R4(T(6),T(31),T(40),T(8))));
      crowd(S,scatterIn(8725,14,R4(T(14),T(51),T(34),T(9))));
      // 行道樹與矮灌木
      tree(S,SHD,T(3),T(20),.95,0);tree(S,SHD,T(3),T(36),.9,2);tree(S,SHD,T(24),T(3),.95,1);tree(S,SHD,T(46),T(3),.9,0);tree(S,SHD,T(60),T(58),.95,2);
      for(const[u,v]of[[T(61),T(10)],[T(61),T(28)],[T(61),T(46)],[T(20),T(61)],[T(34),T(61)],[T(48),T(61)]])bush(S,u,v,2);
      return{};};

    const out=[];
    const VV=[V0,V1,V2];
    for(let v=0;v<3;v++){try{out[v]=assemble(W,H,AX,AY,SZ,VV[v]);}catch(e){errs.push('k87v'+v+': '+(e&&e.stack||e));}}
    install(87,out);
  }catch(e){errs.push('k87: '+(e&&e.stack||e));}
});
