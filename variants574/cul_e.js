// T614 cul_e：k56 體育園區（3×3，畫布 208×220，錨 104,218）／k65 大型購物中心（4×4，畫布 272×280，錨 136,278）——實驗線文化休閒第三刀重畫。
// 分層合成（沿用 cul_d／trans_a 的做法）：地坪直接畫在地面層；立體件走分層場景（各自二值化＋深色外框），依深度由後往前；
// 細線件（人、燈桿、旗桿、欄杆）走不描邊層。曲面（橢圓看台、巨蛋、筒拱）用逐像素光線步進：等距視線沿 t=u+v 朝觀者，
// 由前往後步進找第一個進入實體的點，再二分求精；法向量用實體距離函數的差分求，點乘光向（光從左：+v 面亮、+u 面暗）分階上色。
// 地面圖案（球場條紋、跑道分道線、停車格）用逐像素反投影畫在格座標上，線寬固定 1px。
// 夜圖只點白天畫出的燈具、窗、玻璃、招牌；零亂數：只用 K.hsh／A.hashLocal479。
(window.__variants574=window.__variants574||[]).push(function cul_e(A){
  // 注入測試時本批次排在內嵌 b0x 之前 ⇒ 不是最後一棒就把本體排到隊尾再跑（同 cul_a／cul_d）
  const QL=window.__variants574||[];
  if(!cul_e.__late&&QL.indexOf(cul_e)>=0&&QL.indexOf(cul_e)<QL.length-1){cul_e.__late=1;QL.push(function cul_e_late(A2){cul_e(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round,PI=Math.PI;
  const DEV={};            // 迭代用：{56:[0,1,2]}；定稿必須是 {}
  const errs=[],chk=[];
  const DBG=[];            // 迭代用：記錄越出佔地菱形的圖層；定稿改 null
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w|0,o.h|0,o.ax|0,o.ay|0]:d;};
  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],J:['001','001','001','101','010'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    N:['101','111','111','111','101'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],Q:['010','101','101','111','011'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],W:['101','101','111','111','101'],
    X:['101','101','010','101','101'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111'],
    '0':['111','101','101','101','111'],'1':['010','110','010','010','111'],'2':['110','001','010','100','111'],'3':['110','001','010','001','110'],
    '4':['101','101','111','001','001'],'5':['111','100','110','001','110'],'6':['011','100','111','101','111'],'7':['111','001','010','010','010'],
    '8':['111','101','111','101','111'],'9':['111','101','111','001','110'],'&':['010','101','010','101','011'],'-':['000','000','111','000','000']};
  const TW=s=>{let k=0;for(const ch of s)k+=ch===' '?2:4;return k-1;};

  // ================= 共用工具 =================
  const LIB=(K,W,H)=>{
    const {P,hsh,AX,TOPY,SZ}=K;
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
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const lnL=(g,v,ua,ub,z,c)=>BL(g,P(ua,v,z),P(ub,v,z),c);
    const lnR=(g,u,va,vb,z,c)=>BL(g,P(u,va,z),P(u,vb,z),c);
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const disc=(g,u,v,r,c,z=0)=>{const pts=[];for(let i=0;i<40;i++){const a=i/40*PI*2;pts.push(P(u+r*Math.cos(a),v+r*Math.sin(a),z));}fp(g,pts,c);};
    const RGB={};const rgb=c=>{if(RGB[c])return RGB[c];const n=parseInt(c.slice(1),16);return RGB[c]=[n>>16,(n>>8)&255,n&255];};
    const mix=(a,b,t)=>{const x=rgb(a),y=rgb(b);const r=rnd(x[0]+(y[0]-x[0])*t),gg=rnd(x[1]+(y[1]-x[1])*t),bb=rnd(x[2]+(y[2]-x[2])*t);return '#'+((r<<16)|(gg<<8)|bb).toString(16).padStart(6,'0');};
    // 逐像素地面圖案：在 [u0,u1]×[v0,v1] 內，每個像素中心反投影到格座標，fn(u,v)→色／null
    const plan=(g,u0,u1,v0,v1,fn,z=0)=>{const xa=Math.max(0,Math.floor(P(u0,v1)[0])-1),xb=Math.min(W-1,Math.ceil(P(u1,v0)[0])+1),
        ya=Math.max(0,Math.floor(P(u0,v0,z)[1])-1),yb=Math.min(H-1,Math.ceil(P(u1,v1,z)[1])+1);
      const[tc,tx]=A.cv(W,H),id=tx.createImageData(W,H),d=id.data;let any=0;
      for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const s=(x+.5-AX)/32,t=(y+.5+z-TOPY)/16,u=(t+s)/2,v=(t-s)/2;
        if(u<u0||u>u1||v<v0||v>v1)continue;const c=fn(u,v,x,y);if(!c)continue;const r=rgb(c),i=(y*W+x)*4;d[i]=r[0];d[i+1]=r[1];d[i+2]=r[2];d[i+3]=255;any=1;}
      if(any){tx.putImageData(id,0,0);g.drawImage(tc,0,0);}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          if(DBG){const dd=sx.getImageData(0,0,W,H).data,HW=32*SZ,TY=TOPY;let nb=0;for(let y=TY+HW/2;y<H;y++)for(let x=0;x<W;x++){if(!dd[(y*W+x)*4+3])continue;const r=TY+HW-1-y;if(r<0||x<AX-2*(r+1)||x>AX+2*(r+1)-1)nb++;}
            if(nb)DBG.push('item d='+it.d.toFixed(2)+' ol='+it.ol+' n='+nb);}
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]／['e',cu,cv,ru,rv,h]（直立橢圓柱）／['d',cu,cv,ru,rv,h,z0]（穹頂）
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      const circ=(u,v,ru,rv,z)=>{const k=z/64,pts=[];for(let i=0;i<32;i++){const t=i/32*PI*2;pts.push(P(u+k+ru*Math.cos(t),v-k*.45+rv*Math.sin(t)));}fp(sx,pts,C);};
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}
        else if(s[0]==='e'){const[,u,v,ru,rv,h]=s;for(let z=0;z<=h;z+=2)circ(u,v,ru,rv,z);}
        else if(s[0]==='d'){const[,u,v,ru,rv,h,z0=0]=s;for(let k=0;k<=12;k++){const f=k/12,q=Math.sqrt(1-f*f);circ(u,v,ru*q,rv*q,z0+h*f);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#b9b5aa',s:.25,p:.6},      // 混凝土
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
      z:{t:['#d4cdbd','#cec7b7','#d9d2c2'],j:'#c6bfaf',s:.25,p:.55},     // 廣場石材鋪面
      r:{t:['#b58f78','#ad8770','#bd9780'],j:'#a47f69',s:.25,p:.55},     // 紅磚鋪面
      s:{t:['#cbc7bd','#c6c2b8','#d0ccc2'],j:null,s:.25,p:.6},           // 人行道
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0+.04),P(a,v0+dv-.04),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0+.04,b),P(u0+du-.04,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*10);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62605c':'#7a7873');}}
      if(m==='g'){for(let i=0;i<rnd(du*dv*22);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const YEL='#d6b243',WHT='#e6e2d6';
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const zebraU=(g,u0,u1,v0,v1)=>{u0=Math.round(u0*32)/32;for(let u=u0;u<u1-.03;u+=.125)flat(g,u,v0,.0625,v1-v0,'#e8e5dc');};
    const zebraV=(g,v0,v1,u0,u1)=>{v0=Math.round(v0*32)/32;for(let v=v0;v<v1-.03;v+=.125)flat(g,u0,v,u1-u0,.0625,'#e8e5dc');};
    const curb=(g,u0,v0,du,dv,top='#d9d6ce')=>{boxZ(g,u0,v0,du,dv,0,1,top,'#b3aea4','#96918a');};

    // ---------- 軸向工具：b＝沿長向、a＝橫向 ----------
    const AXF=(ax)=>({
      pt:(b,a,z=0)=>ax==='u'?P(b,a,z):P(a,b,z),
      bx:(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,b0,a0,db,da,z,h,t,l,r):boxZ(g,a0,b0,da,db,z,h,t,l,r),
      side:(g,a,b0,b1,za,zb,c)=>ax==='u'?faceL(g,a,b0,b1,za,zb,c):faceR(g,a,b0,b1,za,zb,c),
      end:(g,b,a0,a1,za,zb,c)=>ax==='u'?faceR(g,b,a0,a1,za,zb,c):faceL(g,b,a0,a1,za,zb,c),
      lit:ax==='u'});

    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const crowd=(S,pts,z,d)=>S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);person(g,p[0],p[1],k);}});
    const scatter=(seed,n,u0,v0,du,dv)=>{const out=[];for(let i=0;i<n;i++)out.push([u0+hsh(seed,i,1)*du,v0+hsh(seed,i,2)*dv,Math.floor(hsh(seed,i,3)*9)]);return out;};

    // ---------- 燈、樹、長椅 ----------
    const SHD=[];
    const lamp=(S,u,v,h=14,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    // 停車場雙臂燈桿（兩個燈頭朝兩側）
    const mast=(S,u,v,h=26,d)=>{SHD.push(['p',u,v,h]);S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#8d9398');RC(g,x,y-h,1,h-2,'#c9ced1');RC(g,x+1,y-h+1,1,h-3,'#7d858a');
      RC(g,x-3,y-h-1,7,1,'#6d767c');RC(g,x-4,y-h,3,1,'#3e464b');RC(g,x+2,y-h,3,1,'#3e464b');RC(g,x-4,y-h+1,3,1,'#f1e6b8');RC(g,x+2,y-h+1,3,1,'#f1e6b8');
      if(n){RC(n,x-4,y-h+1,3,1,'#fff2c8');RC(n,x+2,y-h+1,3,1,'#fff2c8');}});};
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],
      ['#e8a6b8','#d27f98','#a85a74','#7a3f55'],['#d9c25a','#b99a3c','#8d7430','#5f4f24']];
    const tree=(S,u,v,s=1,kind=0,d)=>{SHD.push(['p',u,v,rnd(9*s)+6]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const bush=(S,u,v,r=3,d,pal)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),c=pal||['#4f7f35','#78a84c','#a3cf72'];ell(g,x,y-r+1,r,Math.max(1,r-1),c[0]);ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),c[1]);RC(g,x-1,y-r-1,1,1,c[2]);});
    const bench=(S,u,v,alongU,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const a=P(u,v),b=alongU?P(u+.1,v):P(u,v+.1);BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9a6a3e');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#6e4a2a');RC(g,a[0],a[1]-1,1,1,'#3a3d40');RC(g,b[0],b[1]-1,1,1,'#3a3d40');});
    const bollards=(S,pts,d)=>S.t(d,(g)=>{for(const[u,v]of pts){const p=P(u,v);RC(g,p[0],p[1]-3,1,3,'#5a6166');RC(g,p[0],p[1]-3,1,1,'#c9ced1');}});
    const hedge=(g,u0,v0,du,dv,h=3,c=['#5f9446','#4b7a37','#3a6130'])=>{boxZ(g,u0,v0,du,dv,0,h,c[0],c[1],c[2]);
      for(let t=u0+.04;t<u0+du-.02;t+=.09)RC(g,...P(t,v0+dv*.5,h),1,1,SH(c[0],22));};
    // 圍籬（鐵網）：沿線立柱＋上下兩道橫桿；gap＝[t0,t1] 開口
    const fenceLine=(S,a,b,gap,d,h=6)=>S.t(d!=null?d:Math.max(a[0]+a[1],b[0]+b[1])+.01,(g)=>{
      const pa=P(...a),pb=P(...b),Lh=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,Math.round(Lh/6));
      const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      const seg=(t0,t1)=>{BL(g,P(...at(t0),h),P(...at(t1),h),'#9aa3a8');BL(g,P(...at(t0),h-3),P(...at(t1),h-3),'#b3bbbf');};
      if(gap){seg(0,gap[0]);seg(gap[1],1);}else seg(0,1);
      for(let i=0;i<=n;i++){const t=i/n;if(gap&&t>gap[0]+1e-6&&t<gap[1]-1e-6)continue;const p=P(...at(t));RC(g,p[0],p[1]-h,1,h,'#6d767c');}});

    // ---------- 小車（印章）、巴士、貨車 ----------
    const CL=.23,CW=.1,CST={};
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const fp2=(pts,c)=>{x.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
        for(let y=Math.floor(ya);y<=Math.ceil(yb);y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
          if(xs.length<2)continue;xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)x.fillRect(xa,y,xb-xa+1,1);}}};
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        fp2([pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        fp2([pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        fp2([pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      let tx=null;if(taxi){const p=pt(CL*.47,CW*.5,4);tx=[rnd(p[0]),rnd(p[1])-1];x.fillStyle='#f6f3e4';x.fillRect(tx[0],tx[1],2,1);}
      return CST[key]={c,ox,oy,tx};};
    const car=(S,u,v,alongU,col,d,taxi)=>{const st=carStamp(alongU?'u':'v',col,taxi),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g,n)=>{g.drawImage(st.c,X0,Y0);if(n&&st.tx)RC(n,X0+st.tx[0],Y0+st.tx[1],2,1,'#fff2c0');});};
    const CARC=['#c9ccd0','#2b2e33','#8a3a33','#2f5a86','#e8e6df','#5d6b74','#3f6b4c','#b08a3e'];
    const truck=(S,ax,b0,a0,o={},d)=>{const X=AXF(ax),Lt=o.Lt||.28,Lc=.085,Wd=.1,a1=a0+Wd,b1=b0+Lt,b2=b1+.012,b3=b2+Lc,col=o.col||'#c0392b',bxc=o.box||'#e8eaec';
      SHD.push(ax==='u'?['b',b0,a0,b3-b0,Wd,10]:['b',a0,b0,Wd,b3-b0,10]);
      S.o(d!=null?d:(ax==='u'?b3+a1:a1+b3),(g,n)=>{
        X.bx(g,b0+.02,b3-b0-.04,a0+.015,Wd-.03,0,2,'#26292c','#2c3033','#1f2225');
        const L1=SH(bxc,8),D1=SH(bxc,-44);
        X.bx(g,b0,Lt,a0,Wd,2,9,SH(bxc,-6),ax==='u'?L1:D1,ax==='u'?D1:L1);
        X.side(g,a1,b0+.01,b1-.01,4,5,ax==='u'?(o.stripe||col):SH(o.stripe||col,-36));
        for(const t of[b0+.04,b0+.09,b3-.03]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}
        X.bx(g,b2,Lc,a0+.006,Wd-.012,1,8,SH(col,22),ax==='u'?col:SH(col,-40),ax==='u'?SH(col,-40):col);
        X.side(g,a1-.006,b2+.035,b3-.012,5,8,'#2d3b48');
        X.end(g,b3,a0+.02,a1-.02,5,8,'#34495a');
        if(n){const h1=X.pt(b3,a0+.02,2),h2=X.pt(b3,a1-.02,2);RC(n,h1[0],h1[1]-1,1,1,'#fff3c8');RC(n,h2[0],h2[1]-1,1,1,'#fff3c8');}});};
    const bus=(S,ax,b0,a0,col,d,Lb=.46)=>{const X=AXF(ax),Wb=.1,a1=a0+Wb,b1=b0+Lb;
      SHD.push(ax==='u'?['b',b0,a0,Lb,Wb,7]:['b',a0,b0,Wb,Lb,7]);
      S.o(d!=null?d:(ax==='u'?b1+a1:a1+b1),(g,n)=>{const sL='#eef1f2',sD='#b3babf';
        X.bx(g,b0+.03,Lb-.06,a0+.01,Wb-.02,0,1,'#26292c','#2c3033','#1f2225');
        X.bx(g,b0,Lb,a0,Wb,1,6,'#dde1e4',X.lit?sL:sD,X.lit?sD:sL);
        X.side(g,a1,b0,b1,1,2,X.lit?col:SH(col,-34));
        X.side(g,a1,b0+.02,b1-.03,3,6,X.lit?'#33485a':'#27384a');
        for(const t of[b0+.07,b1-.1]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}
        X.end(g,b1,a0+.012,a1-.012,2,6,'#2b3947');
        if(n)for(let t=b0+.04;t<b1-.06;t+=.05)X.side(n,a1,t,t+.03,3,6,'#ffe6ae');});};

    // ---------- 立面小件 ----------
    const textL=(g,v,u,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){if(ch===' '){k+=2;continue;}const gl=FONT[ch],dy=Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    const textR=(g,u,v,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){if(ch===' '){k+=2;continue;}const gl=FONT[ch],dy=-Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    // 招牌板（+v 面／+u 面）：1px 深框＋底板＋置中淺字；夜裡只亮字（o.glow 時底板也微亮）
    const signL=(g,n,v,ua,ub,za,zb,str,bg,fg='#f4f2ea',o={})=>{faceL(g,v,ua,ub,za,zb,o.frame||'#161a1f');faceL(g,v,ua+1/32,ub-1/32,za+1,zb-1,bg);
      const u=ua+(((ub-ua)*32-TW(str))/2)/32,p=P(u,v,zb-2),x0=rnd(p[0]),y0=rnd(p[1])+(o.dy||0);let k=0;
      if(n&&o.glow)faceL(n,v,ua+1/32,ub-1/32,za+1,zb-1,o.glow);
      for(const ch of str){if(ch===' '){k+=2;continue;}const gl=FONT[ch],dy=Math.round(k/2);
        if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,fg);if(n)RC(n,x0+k+c,y0+dy+r,1,1,o.nf||'#fff4d8');}k+=4;}};
    const signR=(g,n,u,va,vb,za,zb,str,bg,fg='#f4f2ea',o={})=>{faceR(g,u,va,vb,za,zb,o.frame||'#161a1f');faceR(g,u,va+1/32,vb-1/32,za+1,zb-1,bg);
      const v=va+(((vb-va)*32-TW(str))/2)/32,p=P(u,v,zb-2),x0=rnd(p[0]),y0=rnd(p[1])+(o.dy||0);let k=0;
      if(n&&o.glow)faceR(n,u,va+1/32,vb-1/32,za+1,zb-1,o.glow);
      for(const ch of str){if(ch===' '){k+=2;continue;}const gl=FONT[ch],dy=-Math.round(k/2);
        if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,fg);if(n)RC(n,x0+k+c,y0+dy+r,1,1,o.nf||'#fff4d8');}k+=4;}};
    // 玻璃帷幕（+v 面／+u 面）：底色＋豎櫺＋橫檔＋夜間燈
    const curtainL=(g,n,v,ua,ub,za,zb,o={})=>{const gl=o.glass||'#7fa3bb',m=o.mull||'#dfe6ea';faceL(g,v,ua,ub,za,zb,gl);
      const p=P(ua,v,zb),len=Math.floor((ub-ua)*32),fh=o.fh||6,mw=o.mw||4;
      for(let z=za+fh;z<zb-1;z+=fh)BL(g,P(ua,v,z),P(ub,v,z),m);
      for(let x=mw;x<len-1;x+=mw){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      faceL(g,v,ua,ub,zb-1,zb,SH(gl,40));
      if(n){for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh(o.seed||3,x,z)>(o.lit||.6))continue;const X=rnd(p[0])+x+1,Y=rnd(P(ua,v,z+1)[1])+Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),.5,o.nc||'#ffe2a2');}}};
    const curtainR=(g,n,u,va,vb,za,zb,o={})=>{const gl=o.glass||'#5b7d94',m=o.mull||'#a9b8c2';faceR(g,u,va,vb,za,zb,gl);
      const p=P(u,vb,zb),len=Math.floor((vb-va)*32),fh=o.fh||6,mw=o.mw||4;
      for(let z=za+fh;z<zb-1;z+=fh)BL(g,P(u,va,z),P(u,vb,z),m);
      for(let x=mw;x<len-1;x+=mw){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      if(n){for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh((o.seed||3)+9,x,z)>(o.lit||.55))continue;const X=rnd(p[0])+x+1,Y=rnd(P(u,vb,z+1)[1])-Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),-.5,o.nc||'#f3d68e');}}};
    // 窗列（+v 面／+u 面）：每層一列窗，窗寬 ww px、間距 sp px
    const winsL=(g,n,v,ua,ub,zs,wh,o={})=>{const len=Math.floor((ub-ua)*32),ww=o.ww||2,sp=o.sp||4,c=o.c||'#56778c';
      for(const z of zs)for(let x=o.x0||2,k=0;x+ww<=len-1;x+=sp,k++){const p=P(ua+x/32,v,z+wh);pg(g,p[0],p[1],ww,wh,.5,c);
        if(n&&hsh(o.seed||5,k,z)<(o.lit||.55))pg(n,p[0],p[1],ww,wh,.5,o.nc||'#ffe2a2');}};
    const winsR=(g,n,u,va,vb,zs,wh,o={})=>{const len=Math.floor((vb-va)*32),ww=o.ww||2,sp=o.sp||4,c=o.c||'#3f5a6c';
      for(const z of zs)for(let x=o.x0||2,k=0;x+ww<=len-1;x+=sp,k++){const p=P(u,vb-x/32-ww/32,z+wh);pg(g,p[0],p[1],ww,wh,-.5,c);
        if(n&&hsh((o.seed||5)+7,k,z)<(o.lit||.5))pg(n,p[0],p[1],ww,wh,-.5,o.nc||'#f3d68e');}};
    // 旗桿列：pts=[[u,v,色序],...]、main＝掛動態旗那根；主桿只畫 hp（8–12）px 下段，flagAt＝本段桿頂；其他桿畫全長＋靜態旗面
    const FLAGS=[{t:'v3',c:['#2f8a5a','#f2f0ea','#c9362b']},{t:'x',c:['#2c5aa0','#e8b23c']},{t:'h3',c:['#f2f0ea','#2c5aa0','#c9362b']},
      {t:'d',c:['#f2f0ea','#c9362b']},{t:'v3',c:['#2c5aa0','#f2f0ea','#c9362b']},{t:'x',c:['#c9362b','#f2f0ea']},{t:'h3',c:['#2b2e33','#c9362b','#e8b23c']},{t:'k',c:['#c9362b','#2c5aa0']}];
    const flagFace=(g,x,y,ci)=>{const f=FLAGS[ci%FLAGS.length],c=f.c;
      for(let r=0;r<5;r++)for(let q=0;q<6;q++){let col;
        if(f.t==='v3')col=c[q>>1];else if(f.t==='h3')col=c[r<2?0:r<3?1:2];else if(f.t==='x')col=(q===2||r===2)?c[1]:c[0];
        else if(f.t==='d')col=((q===2||q===3)&&r>=1&&r<=3)||((q===1||q===4)&&r===2)?c[1]:c[0];else col=(q<3&&r<2)?c[1]:c[0];
        RC(g,x+q,y+r,1,1,col);}
      g.clearRect(x+5,y+4,1,1);};
    const flagRow=(S,pts,main,hp)=>{if(hp<8||hp>12)throw new Error('主旗桿下段須 8–12px');
      const pp=pts.map(([u,v,ci])=>{const p=P(u,v);return[rnd(p[0]),rnd(p[1]),ci|0,u,v];});
      const at=[pp[main][0]+1,pp[main][1]-hp];
      for(const[u,v]of pts)SHD.push(['p',u,v,hp+20]);
      pp.forEach(([x,y,ci,u,v],i)=>S.t(u+v+.02,(g)=>{RC(g,x-1,y-2,4,2,'#c9c5ba');RC(g,x-1,y-1,4,1,'#8f8b82');
        const h=i===main?hp:hp+20;RC(g,x,y-h,2,h-2,'#8a8a86');
        if(i!==main){RC(g,x,y-h,2,2,'#c8ccd2');flagFace(g,x+2,y-h+1,ci);}}));
      return at;};

    // ---------- 光線步進（任意實體）----------
    // o.s＝[{d:(u,v,z)=>距離（負＝內部，單位約 px），c:(h)=>色, nc:(h)=>夜色|null}]；o.u/o.v/o.z 外包盒
    // h＝{x,y,u,v,z,n:[nu,nv,nz],l（法向・光向）,i（實體序）}
    const WU=39.2,LV=(()=>{const a=[-.3,.72,.62],l=Math.hypot(a[0],a[1],a[2]);return a.map(x=>x/l);})();
    const march=(g,n,o)=>{const[u0,u1]=o.u,[v0,v1]=o.v,[z0,z1]=o.z,dt=o.dt||1/48,sol=o.s,NS=sol.length;
      const sd=(u,v,z)=>{let d=1e9;for(let i=0;i<NS;i++){const q=sol[i].d(u,v,z);if(q<d)d=q;}return d;};
      const xa=Math.max(0,Math.floor(P(u0,v1)[0])-1),xb=Math.min(W-1,Math.ceil(P(u1,v0)[0])+1);
      const ya=Math.max(0,Math.floor(P(u0,v0,z1)[1])-1),yb=Math.min(H-1,Math.ceil(P(u1,v1,z0)[1])+1);
      const[tc,tx]=A.cv(W,H),id=tx.createImageData(W,H),dd=id.data;let nd=null,nid=null,ntc=null,ntx=null;
      if(n){[ntc,ntx]=A.cv(W,H);nid=ntx.createImageData(W,H);nd=nid.data;}
      for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const s=(x+.5-AX)/32,m=y+.5-TOPY;
        const lo=Math.max(2*u0-s,2*v0+s,(z0+m)/16),hi=Math.min(2*u1-s,2*v1+s,(z1+m)/16);if(lo>hi)continue;
        let t=hi,hit=false;for(;t>=lo-1e-9;t-=dt){if(sd((t+s)/2,(t-s)/2,16*t-m)<0){hit=true;break;}}
        if(!hit)continue;let a=t,b=Math.min(hi,t+dt);
        if(b>a)for(let k=0;k<8;k++){const c=(a+b)/2;if(sd((c+s)/2,(c-s)/2,16*c-m)<0)a=c;else b=c;}
        const u=(a+s)/2,v=(a-s)/2,z=16*a-m;let bi=0,bd=1e9;for(let i=0;i<NS;i++){const q=sol[i].d(u,v,z);if(q<bd){bd=q;bi=i;}}
        const S_=sol[bi],e=.004,ez=.2;
        const gu=(S_.d(u+e,v,z)-S_.d(u-e,v,z))/(2*e*WU),gv=(S_.d(u,v+e,z)-S_.d(u,v-e,z))/(2*e*WU),gz=(S_.d(u,v,z+ez)-S_.d(u,v,z-ez))/(2*ez);
        const Ln=Math.hypot(gu,gv,gz)||1,nn=[gu/Ln,gv/Ln,gz/Ln],l=nn[0]*LV[0]+nn[1]*LV[1]+nn[2]*LV[2];
        const h={x,y,u,v,z,n:nn,l,i:bi};const c=S_.c(h);const i4=(y*W+x)*4;
        if(c){const r=rgb(c);dd[i4]=r[0];dd[i4+1]=r[1];dd[i4+2]=r[2];dd[i4+3]=255;}
        if(nd&&S_.nc){const c2=S_.nc(h);if(c2){const r=rgb(c2);nd[i4]=r[0];nd[i4+1]=r[1];nd[i4+2]=r[2];nd[i4+3]=255;}}}
      tx.putImageData(id,0,0);g.drawImage(tc,0,0);if(n){ntx.putImageData(nid,0,0);n.drawImage(ntc,0,0);}};
    const tone=(pal,l)=>pal[l<-.12?0:l<.22?1:l<.5?2:l<.74?3:4];
    const clamp=(x,a,b)=>x<a?a:x>b?b:x;
    return{P,hsh,AX,TOPY,SZ,W,H,RC,BL,fp,Q,flat,boxZ,faceL,faceR,lnL,lnR,pg,ell,disc,plan,scene,shadow,MATS,pave,lineU,lineV,dashU,dashV,YEL,WHT,
      stallsU,stallsV,zebraU,zebraV,curb,AXF,person,PC,crowd,scatter,lamp,mast,tree,bush,bench,bollards,hedge,fenceLine,
      CL,CW,car,CARC,truck,bus,SHD,textL,textR,signL,signR,curtainL,curtainR,winsL,winsR,flagRow,march,tone,mix,rgb,clamp,WU,LV};
  };

  // 收尾裁切：佔地菱形南側兩條斜邊以外、頂端 2 列以內一律清掉（並記數，定稿要求 0）
  const clip=(c,W,H,AX,AY,at,SZ)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;let cut=0;const HW=32*SZ,TY=AY-HW;
    for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4+3;if(!a[i])continue;let bad=y<2;
      if(!bad&&y>=TY+HW/2){const r=TY+HW-1-y;bad=r<0||xx<AX-2*(r+1)||xx>AX+2*(r+1)-1;}
      if(bad){a[i]=0;cut++;if(at&&at.length<10)at.push(xx+','+y);}}
    if(cut)x.putImageData(d,0,0);return cut;};
  const build=(k,dm,SZ,layouts)=>{const[W,H,AX,AY]=dm;const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H),order=DEV[k]||null,out=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      try{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();L.SHD.length=0;
        const o=layouts[v](g,ng,S,L,K,SZ)||{};
        if(L.SHD.length)L.shadow(g,L.SHD,.28);
        A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
        S.run(g,ng);
        if(o.front)o.front(g,ng);
        ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';
        const[sc]=A.cv(W,H);const spr=K.finish(c,g,sc,nc,{fence:false,smoke:[]});
        const at=[],cut=clip(c,W,H,AX,AY,at,SZ),cutN=clip(nc,W,H,AX,AY,null,SZ);
        let fop=0;if(o.flagAt){spr.flagAt=o.flagAt;const[fx,fy]=o.flagAt,idd=c.getContext('2d').getImageData(fx-1,fy-1,2,1).data;for(let i=3;i<idd.length;i+=4)if(idd[i])fop++;}
        let top=H;{const dd=c.getContext('2d').getImageData(0,0,W,H).data;for(let i=3;i<dd.length;i+=4)if(dd[i]){top=((i-3)/4/W)|0;break;}}
        chk.push({k,v,dims:[W,H,AX,AY],cut,cutN,top,flagAt:o.flagAt||null,fop,at:at.join(' ')});
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('cul_e k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];};

  // ================= k56 體育園區（3×3）=================
  try{
    const SZ=3;
    // ---- 共用：田徑跑道（操場形：兩直道＋兩彎道）；沿 ax 長向，中心 (cu,cv)、直道半長 a、內圈半徑 r0、道寬 lw、道數 nl ----
    const TRK={lane:'#b4533c',lane2:'#a84a35',line:'#f1ece2',inf:['#6aa64e','#5f9a45'],edge:'#8f8b82'};
    const trackPlan=(L,g,o)=>{const{cu,cv,a,r0,lw,nl,ax}=o,r1=r0+lw*nl;
      const dist=(u,v)=>{const b=ax==='u'?u-cu:v-cv,c=ax==='u'?v-cv:u-cu,bb=Math.max(0,Math.abs(b)-a);return[Math.hypot(bb,c),b,c];};
      const ext=(ax==='u'?[a+r1+.03,r1+.03]:[r1+.03,a+r1+.03]);
      L.plan(g,cu-ext[0],cu+ext[0],cv-ext[1],cv+ext[1],(u,v)=>{const[d,b,c]=dist(u,v);
        if(d>r1+.028)return null;if(d>r1)return TRK.edge;
        if(d<r0-.02){// 內場：足球草皮條紋＋白線
          const stripe=Math.floor((b+a+r0)/.09)%2;let col=TRK.inf[stripe];
          const hb=a+r0*.55,hc=r0*.78;       // 內場球場框
          const onL=(q,w)=>Math.abs(q)<w;
          if(Math.abs(b)<=hb+.016&&Math.abs(c)<=hc+.016){
            if(onL(Math.abs(b)-hb,.016)||onL(Math.abs(c)-hc,.016)||onL(b,.016))col=TRK.line;
            else if(Math.abs(Math.hypot(b,c)-.1)<.016)col=TRK.line;
            else if(Math.abs(b)>hb-.16&&Math.abs(c)<hc*.55&&(onL(Math.abs(b)-(hb-.16),.016)||onL(Math.abs(c)-hc*.55,.016)))col=TRK.line;}
          return col;}
        if(d<r0)return TRK.line;
        const k=Math.floor((d-r0)/lw),f=(d-r0)-k*lw;
        if(f<.016&&k>0)return TRK.line;
        // 起跑線：直道一端的橫線
        if(o.start&&Math.abs(b-(o.start*a))<.016&&c*o.side>0)return TRK.line;
        return (k%2)?TRK.lane2:TRK.lane;});
      return{dist,r1};};

    // ---- v0 主館：非對稱橢圓碗＋後側新月形膜屋頂 ----
    // 看台高度隨方位變化：背側（遠離觀者）高、前側（靠近觀者）低，讓球場露出來（真實的單側主看台＋環形矮看台）
    const bowl=(L,o)=>{const{cu,cv,Ru,Rv,ri,ro,hLo,hHi,roof,col}=o,WU=L.WU,clamp=L.clamp;
      const rho=(u,v)=>Math.hypot((u-cu)/Ru,(v-cv)/Rv);
      const wBack=(u,v)=>{const a=(u-cu)/Ru,b=(v-cv)/Rv,l=Math.hypot(a,b)||1;const bk=-(a+b)/(l*Math.SQRT2);return clamp((bk+1)/2,0,1);};
      const Hs=(u,v)=>{const w=wBack(u,v);return hLo+(hHi-hLo)*w*w*(3-2*w);};
      const Rm=Math.min(Ru,Rv)*WU;
      const zSeat=(u,v,r)=>{const hs=Hs(u,v);return 1+clamp((r-ri)/(ro-ri),0,1)*(hs-1);};
      const angOf=(u,v)=>Math.atan2((v-cv)/Rv,(u-cu)/Ru);
      // 屋頂：wBack>w0 的新月形，內緣隨 w 由外緣收進；高 zr
      const rw=roof;
      const roofIn=(u,v)=>{const w=wBack(u,v);if(w<rw.w0)return 9;return 1.04-(1.04-rw.rin)*clamp((w-rw.w0)/(1-rw.w0),0,1)**.7;};
      const zRoof=(u,v)=>Hs(u,v)+rw.dz;
      const S=[];
      // 看台＋外牆（一體）：外牆高度＝看台頂＋2，屋頂段外牆直上屋頂
      S.push({d:(u,v,z)=>{const r=rho(u,v);const dOut=(r-1)*Rm,dIn=(ri-r)*Rm;let top;
          if(r<ro)top=zSeat(u,v,r);else{const w=wBack(u,v);top=Hs(u,v)+2;if(rw&&w>rw.w0){const f=clamp((w-rw.w0)/.12,0,1);top=top+(zRoof(u,v)-2-top)*f;}}
          return Math.max(dOut,dIn,z-top,-z);},
        c:h=>col(h,'b',rho(h.u,h.v),angOf(h.u,h.v),wBack(h.u,h.v),Hs(h.u,h.v),roofIn(h.u,h.v),zRoof(h.u,h.v)),
        nc:h=>col(h,'bn',rho(h.u,h.v),angOf(h.u,h.v),wBack(h.u,h.v),Hs(h.u,h.v),roofIn(h.u,h.v),zRoof(h.u,h.v))});
      if(rw)S.push({d:(u,v,z)=>{const r=rho(u,v),ri2=roofIn(u,v);if(ri2>2)return 50;const zr=zRoof(u,v);
          return Math.max((r-1.05)*Rm,(ri2-r)*Rm,z-zr,zr-2-z);},
        c:h=>col(h,'r',rho(h.u,h.v),angOf(h.u,h.v),wBack(h.u,h.v),Hs(h.u,h.v),roofIn(h.u,h.v),zRoof(h.u,h.v)),
        nc:h=>col(h,'rn',rho(h.u,h.v),angOf(h.u,h.v),wBack(h.u,h.v),Hs(h.u,h.v),roofIn(h.u,h.v),zRoof(h.u,h.v))});
      return{S,rho,wBack,Hs,zSeat,angOf,roofIn,zRoof};};

    // ---- 共用小件 ----
    const fr1=x=>((x%1)+1)%1;
    // 球場：草皮條紋（沿 u 換色）＋白線（邊線、中線、中圈、禁區、球門區）；外圍護坡深綠
    const pitchPlan=(L,g,cu,cv,pu,pv,clipF,apron='#4f8a3c')=>{L.plan(g,cu-pu-.2,cu+pu+.2,cv-pv-.2,cv+pv+.2,(u,v)=>{if(clipF&&!clipF(u,v))return null;
      const b=u-cu,c=v-cv;if(Math.abs(b)>pu+.06||Math.abs(c)>pv+.06)return apron;
      let col=Math.floor((b+pu)/.088)%2?'#6aa64e':'#5f9a45';const on=q=>Math.abs(q)<.016;
      if(Math.abs(b)<=pu+.016&&Math.abs(c)<=pv+.016){
        if(on(Math.abs(b)-pu)||on(Math.abs(c)-pv)||on(b))col='#eef2ea';
        else if(Math.abs(Math.hypot(b,c)-.085)<.016)col='#eef2ea';
        else if(Math.abs(b)>pu-.14&&Math.abs(c)<.16&&(on(Math.abs(b)-(pu-.14))||on(Math.abs(c)-.16)))col='#eef2ea';
        else if(Math.abs(b)>pu-.055&&Math.abs(c)<.075&&(on(Math.abs(b)-(pu-.055))||on(Math.abs(c)-.075)))col='#eef2ea';}
      return col;});};
    const goals=(S,L,cu,cv,pu,d)=>{for(const sg of[-1,1]){const u=cu+sg*(pu+.015);S.t(d,(g2)=>{const a=L.P(u,cv-.04,0),b=L.P(u,cv+.04,0);
      L.BL(g2,[a[0],a[1]-3],[b[0],b[1]-3],'#f4f6f7');L.RC(g2,a[0],a[1]-3,1,3,'#f4f6f7');L.RC(g2,b[0],b[1]-3,1,3,'#f4f6f7');});}};
    // 立式標誌塔：白色塔身＋+v 面色塊燈箱直書字，頂上徽章；夜裡只亮字
    const pylon=(S,L,u,v,h,str,col,d)=>{const du=.19,dv=.07;L.SHD.push(['b',u,v,du,dv,h]);S.o(d!=null?d:u+v+.1,(g2,n2)=>{const{boxZ,faceL,faceR,P,RC}=L;
      boxZ(g2,u-.02,v-.015,du+.04,dv+.03,0,3,'#bdb9ae','#d6d2c8','#9d998f');
      boxZ(g2,u,v,du,dv,3,h-3,'#e9edf0','#f4f6f7','#b3bcc2');
      const z1=h-4,z0=z1-(str.length*6+2);if(z0<4)throw new Error('pylon 太矮：'+str);
      faceL(g2,v+dv,u+.02,u+du-.02,z0,z1,col);faceR(g2,u+du,v+.01,v+dv-.01,z0,z1,SH(col,-38));
      for(let i=0;i<str.length;i++){const gl=FONT[str[i]],p=P(u+.045,v+dv,z1-2-i*6),x0=rnd(p[0]),y0=rnd(p[1]);if(!gl)continue;
        for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g2,x0+c,y0+r,1,1,'#ffffff');if(n2)RC(n2,x0+c,y0+r,1,1,'#ffffff');}}});};
    // 售票亭：白色小亭＋色頂＋售票窗（夜裡亮）
    const booth=(S,L,u,v,roofC,d)=>{const du=.13,dv=.1;L.SHD.push(['b',u,v,du,dv,8]);S.o(d!=null?d:u+du+v+dv,(g2,n2)=>{const{boxZ,faceL}=L;
      boxZ(g2,u,v,du,dv,0,6,'#d9d6ce','#efe9dc','#b9b2a4');
      faceL(g2,v+dv,u+.025,u+du-.025,2,5,'#3a4652');if(n2)faceL(n2,v+dv,u+.025,u+du-.025,2,5,'#ffe2a2');
      boxZ(g2,u-.015,v-.015,du+.03,dv+.04,6,2,roofC,SH(roofC,12),SH(roofC,-40));});};
    // 停車列：格沿 v 排（車身沿 u）／格沿 u 排（車身沿 v）
    const rowV=(g,S,L,u0,v0,n,sp,seed,fill=.72)=>{L.stallsV(g,u0,v0,n*sp,n,.27);for(let k=0;k<n;k++){if(L.hsh(seed,k,1)>fill)continue;L.car(S,u0+.02,v0+k*sp+(sp-L.CW)/2,true,L.CARC[Math.floor(L.hsh(seed,k,2)*8)]);}};
    const rowU=(g,S,L,u0,v0,n,sp,seed,fill=.72)=>{L.stallsU(g,u0,v0,n*sp,n,.27);for(let k=0;k<n;k++){if(L.hsh(seed,k,1)>fill)continue;L.car(S,u0+k*sp+(sp-L.CW)/2,v0+.02,false,L.CARC[Math.floor(L.hsh(seed,k,2)*8)]);}};
    // 跑者（跑道上的人，各自排深度）
    const runners=(S,L,pts)=>{for(const[u,v,k]of pts)S.t(u+v+.01,(g2)=>{const p=L.P(u,v);L.person(g2,p[0],p[1],k);});};
    // 圍籬四邊（後兩邊深度取最小、前兩邊取最大）；gapF／gapR＝前緣／右緣開口
    const fence4=(S,L,u0,u1,v0,v1,gapF,gapR)=>{L.fenceLine(S,[u0,v0],[u1,v0],null,u0+v0);L.fenceLine(S,[u0,v0],[u0,v1],null,u0+v0);
      L.fenceLine(S,[u0,v1],[u1,v1],gapF||null,u1+v1);L.fenceLine(S,[u1,v0],[u1,v1],gapR||null,u1+v1-.005);};
    // 小型直排看台（座位面向 +v）：rows 排由前往後升高；後牆＋頂棚
    const bleacher=(L,g2,u0,u1,vF,rows,dep,rise,seat,roofZ)=>{const{boxZ,P,RC,hsh}=L;const vB=vF-rows*dep;
      boxZ(g2,u0,vB-.03,u1-u0,.03,0,rows*rise+2,'#b9b4a9','#d6d1c6','#9d988f');
      for(let i=rows-1;i>=0;i--){const v0=vF-(i+1)*dep,z=(i+1)*rise;
        boxZ(g2,u0,v0,u1-u0,dep,0,z,'#d6d1c6',seat[i%2],'#8d8a83');
        for(let u=u0+.03,k=0;u<u1-.02;u+=1/16,k++)if(hsh(5690,i,k)<.35){const p=P(u,v0+dep*.6,z);RC(g2,p[0],p[1]-2,1,2,L.PC[(k+i*3)%9]);RC(g2,p[0],p[1]-3,1,1,'#e2b48e');}}
      if(roofZ){for(const u of[u0+.02,(u0+u1)/2,u1-.04])boxZ(g2,u,vB-.025,.02,.02,0,roofZ,'#9aa3a8','#c9d0d4','#7f878c');
        boxZ(g2,u0-.02,vB-.05,u1-u0+.04,rows*dep*.75+.03,roofZ,1,'#dfe4e7','#f3f5f6','#b1bac0');}};
    // 球場照明塔：2px 格構桿身＋頂端燈架（3×2 燈）
    const floodTower=(S,L,u,v,h,d)=>{L.SHD.push(['p',u,v,h]);S.t(d!=null?d:u+v+.02,(g2,n2)=>{const p=L.P(u,v),x=rnd(p[0]),y=rnd(p[1]),RC=L.RC;
      RC(g2,x-1,y-2,4,2,'#8d9398');
      for(let k=2;k<h;k++){RC(g2,x,y-k,1,1,k%4===0?'#6d767c':'#b9c1c6');RC(g2,x+1,y-k,1,1,k%4===2?'#9aa3a8':'#6d767c');}
      const bx=x-3,by=y-h-5;RC(g2,bx,by,8,6,'#3e464b');
      for(let i=0;i<3;i++)for(let j=0;j<2;j++){RC(g2,bx+1+i*2+(i>0?1:0)-(i>1?1:0),by+1+j*2,2,1,'#f1e6b8');if(n2)RC(n2,bx+1+i*2+(i>0?1:0)-(i>1?1:0),by+1+j*2,2,1,'#fff6d6');}});};

    // ==== k56 v0 ====
    // 非對稱橢圓碗主館（環形看台前低後高、後側新月形白色膜屋頂）＋右後筒拱屋頂室內館＋左前田徑練習場（小看台）＋右前停車場＋中前入口廣場
    const V56_0=(g,ng,S,L,K)=>{const {P,pave,flat,plan,boxZ,faceL,faceR,lnL,lnR,RC,BL,dashV,crowd,scatter,lamp,mast,tree,bush,bench,fenceLine,car,CARC,signL,signR,curtainL,curtainR,flagRow,march,tone,mix,clamp,SHD,hsh,WU}=L;
      const cu=1.05,cv=.95,Ru=.98,Rv=.84,ri=.68,ro=.95;
      pave(g,'c',0,0,SZ,SZ,5601);
      pave(g,'g',.03,1.86,1.47,1.11,5602);
      pave(g,'a',2.16,1.22,.81,1.75,5603);
      pave(g,'z',1.5,1.84,.66,1.13,5604);
      pave(g,'z',2.18,1.02,.78,.2,5605);
      // 館外環形步道
      plan(g,0,SZ,0,SZ,(u,v)=>{const r=Math.hypot((u-cu)/Ru,(v-cv)/Rv);if(r>1.1)return null;if(r>1.075)return '#bdb6a6';return ((Math.floor(u*8)+Math.floor(v*8))%2)?'#d4cdbd':'#cec7b7';});
      const pu=.42,pv=.27;
      pitchPlan(L,g,cu,cv,pu,pv,(u,v)=>Math.hypot((u-cu)/Ru,(v-cv)/Rv)<ri+.02);
      goals(S,L,cu,cv,pu,1.4);
      // 看台與屋頂（光線步進）
      const SEAT=['#2f5f9e','#27528a'],FAN=['#f4f6f7','#e8c33c','#d8433b','#f4f6f7'];
      const Bw=bowl(L,{cu,cv,Ru,Rv,ri,ro,hLo:6,hHi:19,roof:{w0:.5,rin:.76,dz:9},
        col:(h,k,r,a,w,hs,rin,zr)=>{
          if(k==='r'||k==='rn'){
            const na=fr1(a/(2*PI)*48),rib=na<.14;
            if(k==='rn'){if(r<rin+.04&&h.n[2]>.6&&Math.floor(na*3)%3===1)return '#fff2c8';return null;}
            if(h.n[2]<.6)return r<rin+.03?'#7f888e':'#aeb6bb';
            if(r<rin+.02)return '#9aa3a8';
            if(r<rin+.04&&Math.floor(na*3)%3===1)return '#f1e6b8';
            const base=h.l>.66?'#f4f6f7':h.l>.55?'#e9ecee':'#d9dee1';return rib?SH(base,-16):base;}
          const under=(rin<2&&r>rin-.01&&h.z<zr-2&&w>.5);
          if(h.n[2]<.35&&r>.97){ // 外牆
            const na=fr1(a/(2*PI)*64),z=h.z,lit=h.l;
            if(k==='bn'){if(z>1&&z<4&&na>.36)return (Math.floor(a*10)%3)?'#ffe2a2':null;return null;}
            if(z<1)return '#5d666c';
            if(z<4)return na<.36?(lit>.3?'#e4e0d6':'#a9a59c'):(lit>.3?'#4a6b82':'#2f4252');
            if(na<.2)return lit>.3?'#f2f0ea':lit>0?'#c9c5bb':'#9d998f';
            if(z>hs+.2&&w<.5)return lit>.3?'#f4f6f7':'#b5bdc2';
            return lit>.3?'#3a7aa8':lit>0?'#2f6690':'#244f70';}
          if(r<ri+.012&&h.n[2]<.5){ // 場邊 LED 廣告牌
            const seg=Math.floor(fr1(a/(2*PI))*14),AD=['#d8433b','#f4f6f7','#2f6f9a','#e8b23c','#3f8a4a','#f4f6f7','#c9362b'];
            if(k==='bn')return h.z>.5?SH(AD[seg%7],30):null;return AD[seg%7];}
          if(r>=ro){if(k==='bn')return null;return under?'#7d8388':'#d8d4ca';}
          if(k==='bn')return null;
          const NR=9,f=(r-ri)/(ro-ri)*NR,row=Math.min(NR-1,Math.floor(f)),fr=f-row,na=fr1(a/(2*PI)*22);
          let c;
          if(row===4)c=(na>.44&&na<.56&&fr>.2)?'#262b31':'#cfcac0';           // 中段走道＋出入口
          else if(na<.05)c=fr<.4?'#9e998f':'#bdb8ad';                          // 走道階梯
          else{c=fr<.3?SEAT[1]:SEAT[0];const cell=Math.floor(a*20);
            if(row<4&&fr>=.3&&(cell+row)%2===0&&hsh(561,cell,row)<.5)c=FAN[Math.floor(hsh(562,cell,row)*4)];}
          if(under)c=mix(c,'#1c2630',.45);return c;}});
      L.shadow(g,[['e',cu,cv,Ru,Rv,16]],.22);
      S.o(cu+cv,(g2,n2)=>{march(g2,n2,{u:[cu-Ru-.06,cu+Ru+.06],v:[cv-Rv-.06,cv+Rv+.06],z:[0,32],s:Bw.S});});
      // ---- 室內館（筒拱屋頂，拱端扇形玻璃朝前）----
      const AU0=2.2,AU1=2.94,AV0=.12,AV1=1.02,HW=12,RZ=10,CA=(AU0+AU1)/2,RA=(AU1-AU0)/2+.025;
      L.shadow(g,[['b',AU0,AV0,AU1-AU0,AV1-AV0,HW+RZ*.7]]);
      S.o(2.9,(g2,n2)=>{
        boxZ(g2,AU0,AV0,AU1-AU0,AV1-AV0,0,HW,'#cfcac0','#e6e2d9','#b3aea4');
        faceR(g2,AU1,AV0+.04,AV1-.04,5,9,'#3f5a6c');
        for(let v=AV0+.07;v<AV1-.04;v+=.07)BL(g2,P(AU1,v,1),P(AU1,v,HW-1),'#8f8a81');
        if(n2)for(let v=AV0+.04,k=0;v<AV1-.08;v+=.07,k++)if(hsh(5621,k,0)<.6)faceR(n2,AU1,v+.01,v+.06,5,9,'#f0d08a');
        faceR(g2,AU1,AV0,AV1,0,1,'#8f8a81');
        curtainL(g2,n2,AV1,AU0+.08,AU1-.08,0,6,{glass:'#86a9bf',mull:'#e6ecef',fh:6,mw:4,seed:5622,lit:.8});
        boxZ(g2,AU0+.16,AV1,AU1-AU0-.32,.1,6,1,'#e9edf0','#f4f6f7','#b5bec4');
        signL(g2,n2,AV1,AU0+.08,AU1-.08,7,HW,'ARENA','#8a2b2b');
        march(g2,n2,{u:[AU0-.05,AU1+.05],v:[AV0-.05,AV1+.05],z:[HW-1,HW+RZ+1],s:[{
          d:(u,v,z)=>Math.max((Math.hypot((u-CA)/RA,(z-HW)/RZ)-1)*RZ,HW-z,(AV0-.03-v)*WU,(v-AV1-.03)*WU),
          c:h=>{const q=Math.hypot((h.u-CA)/RA,(h.z-HW)/RZ);
            if(h.n[1]>.8){if(q>.86||h.z<HW+.8)return '#eef1f2';const col=Math.floor((h.u-AU0)*32);
              if(col%3===0||Math.abs(h.z-(HW+4))<.5)return '#e6ecef';return h.z>HW+4?'#9dbccf':'#7fa3bb';}
            if(Math.abs(h.u-CA)<.045)return fr1((h.v-AV0)/.1)<.2?'#dfe6ea':'#8fb0c4';
            const c=tone(['#7d868c','#959ea4','#aeb7bc','#c7ced2','#dfe4e7'],h.l);return fr1((h.v-AV0)/.06)<.2?SH(c,-14):c;},
          nc:h=>{if(h.n[1]>.8){const q=Math.hypot((h.u-CA)/RA,(h.z-HW)/RZ);if(q>.86||h.z<HW+.8)return null;const col=Math.floor((h.u-AU0)*32);
              if(col%3===0||Math.abs(h.z-(HW+4))<.5)return null;return hsh(5623,col,h.z>HW+4?1:0)<.7?'#ffe2a2':null;}
            if(Math.abs(h.u-CA)<.045&&fr1((h.v-AV0)/.1)>=.2)return '#e8d49a';return null;}}]});});
      // ---- 田徑練習場＋小看台＋圍籬 ----
      trackPlan(L,g,{cu:.77,cv:2.47,a:.3,r0:.19,lw:.045,nl:4,ax:'u'});
      S.o(.5+2.08,(g2)=>bleacher(L,g2,.5,1.06,2.08,3,.036,2.2,['#2f6f9a','#285d82'],0));
      SHD.push(['b',.5,1.95,.56,.13,8]);
      fence4(S,L,.06,1.48,1.9,2.92,null,[.42,.6]);
      runners(S,L,[[.52,2.68,1],[.6,2.72,5],[.66,2.68,3],[1.02,2.24,0],[1.12,2.28,6],[1.3,2.5,2],[.22,2.42,7]]);
      // ---- 停車場 ----
      rowV(g,S,L,2.19,1.28,13,.128,5611);rowV(g,S,L,2.69,1.28,13,.128,5612);dashV(g,2.575,1.3,2.9,'#d6b243',.08,.08);
      mast(S,2.17,1.72,28);mast(S,2.17,2.62,28);
      // ---- 入口廣場 ----
      const fa=flagRow(S,[[1.62,2.08,0],[1.62,2.33,1],[1.62,2.58,2]],0,10);
      pylon(S,L,1.98,2.74,40,'SPORT','#2f6f9a');
      booth(S,L,1.8,1.6,'#c9362b');booth(S,L,1.5,1.78,'#c9362b');
      crowd(S,scatter(5631,20,1.66,1.9,.46,1.0),0,3.6);
      crowd(S,[[1.86,1.8,1],[1.9,1.84,3],[1.94,1.88,5],[1.58,1.96,0],[1.62,2.0,6]],0,3.4);
      crowd(S,scatter(5632,14,.3,.0,1.6,.1).map(([u,v,k])=>{const t=u*2.2,r=1.05;return[cu+r*Ru*Math.cos(.2+t*.5),cv+r*Rv*Math.sin(.2+t*.5),k];}),0,3.2);
      lamp(S,1.56,2.9,14);lamp(S,2.12,2.1,14);lamp(S,1.9,1.92,14);
      bench(S,1.7,2.84,true);
      tree(S,2.1,.1,.9,2);tree(S,2.08,.62,.8,0);tree(S,1.62,2.92,.75,0);tree(S,.02+.06,1.8,.8,2);
      bush(S,1.56,2.84,3);
      return{flagAt:fa};
    };

    // ==== k56 v1 ====
    // 巨蛋（白色膜頂＋鋼索網格＋圓形鼓座與環梁）＋正面玻璃大廳＋兩座閘門；右後田徑練習場（沿 v）；左前方盒室內館（平頂＋天窗帶）；中前廣場；右前停車場＋遊覽車位
    const V56_1=(g,ng,S,L,K)=>{const {P,pave,flat,plan,boxZ,faceL,faceR,lnL,lnR,RC,BL,dashU,crowd,scatter,lamp,mast,tree,bush,bench,car,CARC,bus,signL,signR,curtainL,curtainR,winsL,winsR,flagRow,march,tone,mix,SHD,hsh,WU}=L;
      const cu=1.08,cv=1.04,R=.9,ZW=12,ZR=14,HD=20;
      pave(g,'c',0,0,SZ,SZ,5641);
      plan(g,0,SZ,0,SZ,(u,v)=>{const r=Math.hypot(u-cu,v-cv)/R;if(r>1.16)return null;if(r>1.135)return '#bdb6a6';return ((Math.floor(u*8)+Math.floor(v*8))%2)?'#d4cdbd':'#cec7b7';});
      pave(g,'g',2.12,.04,.85,1.5,5642);
      pave(g,'a',1.5,2.0,1.47,.97,5643);pave(g,'a',2.2,1.56,.77,.46,5644);
      pave(g,'z',.96,2.1,.54,.87,5645);
      // 田徑場（沿 v）
      trackPlan(L,g,{cu:2.54,cv:.78,a:.3,r0:.17,lw:.045,nl:4,ax:'v'});
      fence4(S,L,2.15,2.93,.08,1.5,[.4,.62],null);
      runners(S,L,[[2.25,.6,1],[2.26,.72,4],[2.84,.9,6],[2.83,.5,2],[2.5,1.4,0]]);
      floodTower(S,L,2.16,.1,44);floodTower(S,L,2.92,1.46,44);
      // 巨蛋
      L.shadow(g,[['e',cu,cv,R,R,ZW],['d',cu,cv,R,R,HD,ZR]],.24);
      const MEM=['#b3b0a8','#c9c6be','#dcd9d1','#ebe8e1','#f7f5f0'],CON=['#8e8a82','#a9a59c','#c2beb4','#d6d2c8','#e6e2d8'];
      S.o(cu+cv,(g2,n2)=>{const rho=(u,v)=>Math.hypot(u-cu,v-cv)/R,ang=(u,v)=>Math.atan2(v-cv,u-cu);
        march(g2,n2,{u:[cu-R-.06,cu+R+.06],v:[cv-R-.06,cv+R+.06],z:[0,ZR+HD+1],s:[
          {d:(u,v,z)=>Math.max((rho(u,v)-1)*R*WU,z-ZW,-z),
           c:h=>{const na=fr1(ang(h.u,h.v)/(2*PI)*44),z=h.z;if(z<1)return '#5d666c';
             if(z>=9)return z<10.2?'#2f6f9a':tone(CON,h.l);
             if(na<.26)return tone(CON,h.l);return z>5.5&&z<6.5?tone(CON,h.l-.2):(h.l>.3?'#46677e':h.l>0?'#39566a':'#2c4352');},
           nc:h=>{const na=fr1(ang(h.u,h.v)/(2*PI)*44),z=h.z;if(z<1.5||z>=9||na<.26||(z>5.5&&z<6.5))return null;
             return hsh(5646,Math.floor(ang(h.u,h.v)/(2*PI)*44+44),z>6?1:0)<.55?'#ffe2a2':null;}},
          {d:(u,v,z)=>Math.max((rho(u,v)-1.035)*R*WU,z-ZR,ZW-1-z),
           c:h=>{const na=fr1(ang(h.u,h.v)/(2*PI)*20);return na<.1&&h.z>ZR-1.5?'#f1e6b8':tone(CON,h.l+.1);},
           nc:h=>{const na=fr1(ang(h.u,h.v)/(2*PI)*20);return na<.1&&h.z>ZR-1.5?'#fff2c8':null;}},
          {d:(u,v,z)=>{const a=(u-cu)/(R*.985),b=(v-cv)/(R*.985),c=(z-ZR)/HD;return Math.max((Math.sqrt(a*a+b*b+c*c)-1)*HD,ZR-.5-z);},
           c:h=>{const c=tone(MEM,h.l+.06),cu2=fr1((h.u-cu)/.15+.5),cv2=fr1((h.v-cv)/.15+.5);
             return (cu2<.13||cv2<.13)?SH(c,-22):c;}}]});});
      // 正面玻璃大廳（45° 方位貼鼓座）＋招牌
      const LU0=1.5,LU1=2.04,LV0=1.62,LV1=1.94,LH=12;
      SHD.push(['b',LU0,LV0,LU1-LU0,LV1-LV0,LH+4]);
      S.o(LU1+LV1-.2,(g2,n2)=>{boxZ(g2,LU0,LV0,LU1-LU0,LV1-LV0,0,LH,'#cfd5d9','#9fbccc','#5f7f92');
        curtainL(g2,n2,LV1,LU0,LU1,0,LH-5,{glass:'#86a9bf',mull:'#e6ecef',fh:7,mw:4,seed:5647,lit:.8});
        curtainR(g2,n2,LU1,LV0,LV1,0,LH,{glass:'#5b7d94',mull:'#a9b8c2',fh:6,mw:4,seed:5648,lit:.6});
        boxZ(g2,LU0-.02,LV0,LU1-LU0+.04,LV1-LV0+.02,LH,2,'#b7bfc4','#eef1f2','#b5bec4');
        signL(g2,n2,LV1+.005,LU0+.04,LU1-.04,LH-5,LH+2,'DOME','#1f3346',undefined,{nf:'#dff2ff'});
        boxZ(g2,LU0+.1,LV1,LU1-LU0-.2,.12,6,1,'#e9edf0','#f4f6f7','#b5bec4');
        for(const u of[LU0+.14,LU0+.3]){faceL(g2,LV1,u,u+.1,0,5,'#2d3b48');if(n2)faceL(n2,LV1,u+.01,u+.09,1,5,'#ffe6ae');}});
      // 側閘門（+v 面 A 閘、+u 面 B 閘）
      const gate=(u0,v0,du,dv,face,letter)=>{SHD.push(['b',u0,v0,du,dv,10]);S.o(u0+du+v0+dv,(g2,n2)=>{boxZ(g2,u0,v0,du,dv,0,9,'#cfcac0','#e6e2d9','#b3aea4');
        if(face==='L'){faceL(g2,v0+dv,u0+.05,u0+du-.05,0,5,'#2d3b48');if(n2)faceL(n2,v0+dv,u0+.06,u0+du-.06,1,5,'#ffe6ae');boxZ(g2,u0+.02,v0+dv,du-.04,.07,5,1,'#e9edf0','#f4f6f7','#b5bec4');signL(g2,n2,v0+dv,u0+du/2-.1,u0+du/2+.1,6,9+2,letter,'#2f6f9a');}
        else{faceR(g2,u0+du,v0+.05,v0+dv-.05,0,5,'#2d3b48');if(n2)faceR(n2,u0+du,v0+.06,v0+dv-.06,1,5,'#ffe6ae');boxZ(g2,u0+du,v0+.02,.07,dv-.04,5,1,'#e9edf0','#f4f6f7','#b5bec4');signR(g2,n2,u0+du,v0+dv/2-.1,v0+dv/2+.1,6,9+2,letter,'#2f6f9a');}});};
      gate(cu-.16,cv+R-.06,.32,.16,'L','A');gate(cu+R-.06,cv-.16,.16,.32,'R','B');
      // ---- 室內館（方盒平頂＋天窗帶）----
      const GU0=.1,GU1=.92,GV0=2.16,GV1=2.9,GH=15;
      L.shadow(g,[['b',GU0,GV0,GU1-GU0,GV1-GV0,GH+4]]);
      S.o(GU1+GV1-.3,(g2,n2)=>{boxZ(g2,GU0,GV0,GU1-GU0,GV1-GV0,0,GH,'#b8bec2','#e3e0d8','#b3aea4');
        for(let u=GU0+.05;u<GU1-.02;u+=.06)faceL(g2,GV1,u,u+.02,1,GH-1,'#cfcbc2');
        curtainL(g2,n2,GV1,GU0+.04,GU1-.04,9,13,{glass:'#56778c',mull:'#cfcbc2',fh:9,mw:3,seed:5651,lit:.6});
        signL(g2,n2,GV1,GU0+.06,GU0+.42,2,8,'GYM','#2b6a4a');
        curtainR(g2,n2,GU1,GV0+.2,GV1-.2,0,7,{glass:'#5b7d94',mull:'#a9b8c2',fh:7,mw:4,seed:5652,lit:.8});
        boxZ(g2,GU1,GV0+.26,.1,GV1-GV0-.52,7,1,'#e9edf0','#f4f6f7','#b5bec4');
        winsR(g2,n2,GU1,GV0+.02,GV1-.02,[10],3,{ww:3,sp:5,seed:5653});
        boxZ(g2,GU0-.01,GV0-.01,GU1-GU0+.02,GV1-GV0+.02,GH,1,'#aeb6bb','#eef1f2','#c3cacf');
        flat(g2,GU0+.03,GV0+.03,GU1-GU0-.06,GV1-GV0-.06,'#98a1a7',GH+1);
        for(let v=GV0+.12;v<GV1-.1;v+=.16){boxZ(g2,GU0+.12,v,GU1-GU0-.24,.07,GH+1,2,'#9dbccf','#c9d8e2','#6f93aa');if(n2)faceL(n2,v+.07,GU0+.14,GU1-.14,GH+1,GH+3,'#e8d49a');}
        boxZ(g2,GU1-.18,GV0+.05,.1,.08,GH+1,3,'#b9c1c6','#cdd4d8','#a7afb4');});
      // ---- 停車場（格沿 u 排）＋遊覽車 ----
      rowU(g,S,L,1.54,2.04,11,.128,5661);rowU(g,S,L,1.54,2.66,11,.128,5662);dashU(g,2.47,1.56,2.9,'#d6b243',.08,.08);
      L.stallsV(g,2.24,1.58,.4,2,.72);bus(S,'u',2.26,1.62,'#2f6f9a');bus(S,'u',2.3,1.82,'#c9362b');
      mast(S,1.52,2.5,28);mast(S,2.95,2.5,28);
      // ---- 廣場 ----
      const fa=flagRow(S,[[1.42,2.12,0],[1.42,2.37,1],[1.42,2.62,2]],0,10);
      booth(S,L,1.02,2.2,'#2f6f9a');booth(S,L,1.26,2.2,'#2f6f9a');
      for(const[u,v]of[[1.06,2.62],[1.3,2.86]]){tree(S,u,v,.8,0);}
      bench(S,1.12,2.5,true);bench(S,1.02,2.84,true);
      crowd(S,scatter(5671,22,1.0,2.1,.45,.8),0,3.3);
      crowd(S,[[1.62,1.98,1],[1.7,2.0,3],[1.3,1.95,5],[1.08,2.02,0],[1.14,2.04,4],[2.02,1.3,2],[2.06,1.1,6],[.3,1.9,7],[.5,2.02,3]],0,3.0);
      lamp(S,.98,2.2,14);lamp(S,1.46,2.92,14);lamp(S,2.1,1.55,14);
      tree(S,.08,1.2,.85,0);tree(S,.1,1.62,.8,2);tree(S,.98,2.94,.75,0);bush(S,2.9,1.58,3);
      return{flagAt:fa};
    };

    // ==== k56 v2 ====
    // 英式長方形球場（四面獨立看台：遠側主看台高＋懸挑平屋頂、遠端看台＋屋頂與記分板、近側兩面矮看台無頂）＋四角照明塔；
    // 左後田徑練習場（沿 v）；左前四坡金屬屋頂室內館；前方停車場；中間入口步道與旗桿
    const V56_2=(g,ng,S,L,K)=>{const {P,pave,flat,plan,boxZ,faceL,faceR,lnL,lnR,RC,BL,dashU,crowd,scatter,lamp,mast,tree,bush,bench,car,CARC,bus,textL,textR,signL,signR,curtainL,curtainR,winsL,winsR,flagRow,tone,mix,SHD,hsh,fp}=L;
      const cu=1.92,cv=1.04,pu=.42,pv=.27;
      pave(g,'c',0,0,SZ,SZ,5681);
      pave(g,'g',.04,.04,.88,1.5,5682);
      pave(g,'a',1.2,1.9,1.77,1.07,5683);
      pave(g,'z',.04,2.44,1.14,.53,5684);
      // 球場草皮
      pitchPlan(L,g,cu,cv,pu,pv,(u,v)=>u>1.38&&u<2.46&&v>.68&&v<1.4,'#4f8a3c');
      goals(S,L,cu,cv,pu,1.0);
      const SEATR=['#b8403a','#a3372f'];
      // 主看台（遠側，座位朝 +v）：10 排，後牆直上屋頂；懸挑平屋頂＋白色封簷＋桁架
      const MU0=1.4,MU1=2.44,MVF=.66,MR=10,MD=.044,MRI=2.2,MVB=MVF-MR*MD,MZ=30;
      L.shadow(g,[['b',MU0,.12,MU1-MU0,MVF-.12,MZ]]);
      S.o(1.4+.2,(g2,n2)=>{boxZ(g2,MU0,MVB-.06,MU1-MU0,.06,0,MZ,'#b9b4a9','#d6d1c6','#9d988f');
        for(let i=MR-1;i>=0;i--){const v0=MVF-(i+1)*MD,z=(i+1)*MRI;
          boxZ(g2,MU0,v0,MU1-MU0,MD,0,z,'#a9a49a',SEATR[i%2],'#8d8a83');
          if(i===5){faceL(g2,v0+MD,MU0,MU1,z-2,z,'#cfcac0');for(let u=MU0+.12;u<MU1-.05;u+=.24)faceL(g2,v0+MD,u,u+.05,z-2,z,'#2a2f35');}
          else for(let u=MU0+.02,k=0;u<MU1-.02;u+=1/16,k++){if(hsh(5685,i,k)<.4){const p=P(u,v0+MD*.5,z);RC(g2,p[0],p[1]-1,1,1,['#f4f6f7','#e8c33c','#2f5f9e','#f4f6f7'][k%4]);}}
          for(const u of[MU0+.26,MU0+.52,MU0+.78])faceL(g2,v0+MD,u,u+.02,z-MRI,z,'#bdb8ad');}
        boxZ(g2,MU0-.04,.1,MU1-MU0+.08,.42,MZ,2,'#5d6b78','#eef1f2','#b5bec4');
        for(let u=MU0;u<MU1+.04;u+=.08)BL(g2,P(u,.12,MZ+2),P(u,.5,MZ+2),'#4f5c68');
        faceL(g2,.52,MU0-.04,MU1+.04,MZ-3,MZ,'#eef1f2');
        let up=true;for(let u=MU0-.04;u<MU1+.02;u+=.06){BL(g2,P(u,.52,up?MZ-3:MZ),P(u+.06,.52,up?MZ:MZ-3),'#9aa3a8');up=!up;}
        if(n2)for(let u=MU0+.02;u<MU1;u+=.1){const p=P(u,.52,MZ-3);RC(n2,p[0],p[1]+1,2,1,'#fff2c8');}});
      // 遠端看台（低 u 端，座位朝 +u）＋屋頂＋記分板
      const EU0=.98,EUF=1.36,EV0=.74,EV1=1.34,ER=8,ED=.045,ERI=2,EZ=22;
      L.shadow(g,[['b',.92,EV0-.04,EUF-.92,EV1-EV0+.08,EZ]]);
      S.o(1.36+.74+.05,(g2,n2)=>{boxZ(g2,EU0-.05,EV0,.05,EV1-EV0,0,EZ,'#b9b4a9','#d6d1c6','#9d988f');
        for(let i=ER-1;i>=0;i--){const u0=EUF-(i+1)*ED,z=(i+1)*ERI;
          boxZ(g2,u0,EV0,ED,EV1-EV0,0,z,'#a9a49a','#a9a59c',SEATR[i%2]);
          for(let v=EV0+.03,k=0;v<EV1-.02;v+=1/16,k++){if(hsh(5686,i,k)<.35){const p=P(u0+ED*.5,v,z);RC(g2,p[0],p[1]-1,1,1,['#f4f6f7','#e8c33c','#2f5f9e'][k%3]);}}}
        boxZ(g2,.92,EV0-.04,.36,EV1-EV0+.08,EZ,2,'#5d6b78','#c9d0d4','#8e979c');
        for(let v=EV0-.02;v<EV1+.04;v+=.08)BL(g2,P(.92,v,EZ+2),P(1.28,v,EZ+2),'#4f5c68');
        faceR(g2,1.28,EV0-.04,EV1+.04,EZ-2,EZ,'#c9d0d4');
        // 記分板（立在屋頂上，面朝 +u）
        boxZ(g2,1.0,.86,.05,.36,EZ+2,1,'#3e464b','#4d5459','#2e3438');
        for(const v of[.9,1.16])boxZ(g2,1.02,v,.02,.02,EZ+2,3,'#6d767c','#8d9398','#5d666c');
        boxZ(g2,1.0,.86,.05,.36,EZ+5,9,'#3e464b','#4d5459','#1f2428');
        faceR(g2,1.05,.88,1.2,EZ+6,EZ+13,'#18202a');
        textR(g2,1.05,1.14,EZ+11,'2-1','#f1e6b8',n2,'#fff2c8');
        if(n2)faceR(n2,1.05,.88,1.2,EZ+6,EZ+7,'#5a8fd6');});
      // 近側看台（高 v，座位朝 -v）：看到椅背面與後牆
      const NU0=1.46,NU1=2.38,NV0=1.44,NR=5,ND=.05,NRI=1.8;
      S.o(2.38+1.72,(g2,n2)=>{for(let i=0;i<NR;i++){const v0=NV0+i*ND,z=(i+1)*NRI;boxZ(g2,NU0,v0,NU1-NU0,ND,0,z,SEATR[i%2],'#d6d1c6','#9d988f');}
        const vB=NV0+NR*ND;boxZ(g2,NU0,vB,NU1-NU0,.04,0,NR*NRI+2,'#d6d1c6','#e3ded3','#a9a59c');
        faceL(g2,vB+.04,NU0,NU1,NR*NRI-2,NR*NRI+2,'#2f6f9a');
        for(let u=NU0+.1;u<NU1-.1;u+=.22){faceL(g2,vB+.04,u,u+.06,0,4,'#2a2f35');if(n2)faceL(n2,vB+.04,u+.01,u+.05,1,4,'#ffe6ae');}
        textL(g2,vB+.04,NU0+.33,NR*NRI+1,'UNITED','#f4f6f7',n2,'#fff4d8');});
      // 近端看台（高 u，座位朝 -u）
      const FU0=2.46,FV0=.76,FV1=1.32,FR=5,FD=.05,FRI=1.8;
      S.o(2.8+1.32,(g2,n2)=>{for(let i=0;i<FR;i++){const u0=FU0+i*FD,z=(i+1)*FRI;boxZ(g2,u0,FV0,FD,FV1-FV0,0,z,SEATR[i%2],'#9d988f','#b9b4a9');}
        const uB=FU0+FR*FD;boxZ(g2,uB,FV0,.04,FV1-FV0,0,FR*FRI+2,'#d6d1c6','#b9b4a9','#a9a59c');
        for(let v=FV0+.08;v<FV1-.06;v+=.2){faceR(g2,uB+.04,v,v+.06,0,4,'#22282e');if(n2)faceR(n2,uB+.04,v+.01,v+.05,1,4,'#f3d68e');}});
      // 四角照明塔
      floodTower(S,L,1.3,.58,50);floodTower(S,L,2.52,.6,50);floodTower(S,L,1.32,1.46,46,3.1);floodTower(S,L,2.54,1.44,46,4.2);
      // ---- 田徑練習場（沿 v）----
      trackPlan(L,g,{cu:.48,cv:.8,a:.3,r0:.16,lw:.045,nl:4,ax:'v'});
      fence4(S,L,.08,.9,.1,1.5,[.3,.5],null);
      runners(S,L,[[.2,.6,2],[.21,.7,5],[.78,1.0,1],[.46,1.36,0],[.5,.2,4]]);
      // ---- 室內館（四坡金屬屋頂）----
      const HU0=.1,HU1=1.1,HV0=1.68,HV1=2.38,HWl=12,RH=9,HVm=(HV0+HV1)/2,HR=(HV1-HV0)/2;
      L.shadow(g,[['b',HU0,HV0,HU1-HU0,HV1-HV0,HWl+RH*.6]]);
      S.o(HU1+HV1-.2,(g2,n2)=>{boxZ(g2,HU0,HV0,HU1-HU0,HV1-HV0,0,HWl,'#c9c4b8','#e3ded3','#b5afa3');
        curtainL(g2,n2,HV1,HU0+.06,HU1-.06,6,10,{glass:'#56778c',mull:'#d9d4c8',fh:9,mw:4,seed:5691,lit:.6});
        faceL(g2,HV1,HU0+.4,HU0+.64,0,5,'#2d3b48');if(n2)faceL(n2,HV1,HU0+.41,HU0+.63,1,5,'#ffe6ae');
        boxZ(g2,HU0+.36,HV1,.32,.12,5,1,'#e9edf0','#f4f6f7','#b5bec4');
        winsR(g2,n2,HU1,HV0,HV1,[6],4,{ww:3,sp:6,seed:5692});
        const R0=HU0-.03,R1=HU1+.03,S0=HV0-.03,S1=HV1+.03,rr=(S1-S0)/2,mid=(S0+S1)/2,Z=HWl;
        fp(g2,[P(R0,S0,Z),P(R1,S0,Z),P(R1-rr,mid,Z+RH),P(R0+rr,mid,Z+RH)],'#6f7c86');
        fp(g2,[P(R0,S0,Z),P(R0+rr,mid,Z+RH),P(R0,S1,Z)],'#8a96a0');
        fp(g2,[P(R0,S1,Z),P(R1,S1,Z),P(R1-rr,mid,Z+RH),P(R0+rr,mid,Z+RH)],'#9fb0bd');
        fp(g2,[P(R1,S0,Z),P(R1,S1,Z),P(R1-rr,mid,Z+RH)],'#5d6a74');
        for(let u=R0+.06;u<R1-.02;u+=.06){const uu=Math.min(Math.max(u,R0+rr),R1-rr);BL(g2,P(u,S1,Z),P(uu,mid,Z+RH),'#8b9ca9');}
        for(let v=S0+.06;v<S1-.02;v+=.06){const vv=mid;BL(g2,P(R1,v,Z),P(R1-rr+Math.abs(v-mid)*0,vv,Z+RH),'#526069');}
        BL(g2,P(R0+rr,mid,Z+RH),P(R1-rr,mid,Z+RH),'#c9d3da');
        BL(g2,P(R0,S1,Z),P(R1,S1,Z),'#dfe4e7');
        signL(g2,n2,HV1,HU0+.72,HU1-.04,1,6,'GYM','#8a2b2b');});
      // ---- 停車場（格沿 u 排）----
      rowU(g,S,L,1.24,1.94,13,.128,5695);rowU(g,S,L,1.24,2.6,13,.128,5696);dashU(g,2.42,1.26,2.9,'#d6b243',.08,.08);
      mast(S,1.22,2.44,28);mast(S,2.95,2.44,28);
      // ---- 入口廣場 ----
      const fa=flagRow(S,[[1.08,2.52,0],[.83,2.52,1],[.58,2.52,2]],0,10);
      booth(S,L,1.26,1.72,'#2f6f9a');booth(S,L,2.5,1.66,'#2f6f9a');
      crowd(S,scatter(5697,16,.2,2.56,.9,.36),0,3.4);
      crowd(S,[[1.34,1.86,1],[1.4,1.84,3],[1.6,1.84,5],[1.9,1.84,0],[2.2,1.83,6],[2.6,1.4,2],[2.66,1.1,4],[1.2,1.62,7],[1.16,1.3,3]],0,3.0);
      lamp(S,.1,2.94,14);lamp(S,1.16,2.94,14);
      tree(S,.98,.1,.85,2);tree(S,.95,.62,.8,0);tree(S,2.9,.1,.85,2);tree(S,.4,2.9,.7,0);bush(S,.7,2.94,3);
      return{flagAt:fa};
    };
    const K56=[V56_0,V56_1,V56_2];
    build(56,dims(56,[208,220,104,218]),SZ,K56);
  }catch(e){console.error('cul_e k56',e);errs.push('k56:'+(e&&e.stack||e));}

  window.__cul_e_chk=chk;
  window.__cul_e_errs=errs;
  window.__cul_e_dbg=DBG;
});
