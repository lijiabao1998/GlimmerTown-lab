// T612 trans_d：k18 港口（1×1，畫布 88×120，錨 44,118）／k20 停車場（2×2，畫布 136×150，錨 68,148）實驗線重畫。
// 分層合成（沿用 logi_b／trans_b）：地坪（鋪面、水面、標線）直接畫在地面層；立體件各自一層二值化＋深色外框，依深度由後往前疊；
// 細線（纜繩、欄杆、吊索）走不描邊的細線層。夜光按層遮擋（後層實體擦掉被擋住的燈），水面不發光。
// 光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh。
// k18 朝向：沿用舊 v0（水波畫在佔地前側）——水域在前側 v∈[VQ,1]（左前緣），岸壁朝左前、船靠在岸壁外，水面比岸面低 3px。
(window.__variants574=window.__variants574||[]).push(function trans_d(A){
  // 注入測試時若本批次不是最後一棒，就把本體排到隊尾再跑（同 trans_b／bay_a）；正式整合接在最後則直接執行
  const QL=window.__variants574||[];
  if(!trans_d.__late&&QL.indexOf(trans_d)>=0&&QL.indexOf(trans_d)<QL.length-1){trans_d.__late=1;QL.push(function trans_d_late(A2){trans_d(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{18:[1,2,0]}；定稿必須是 {}
  const errs=[];
  const DIM={18:[88,120,44,118,1],20:[136,150,68,148,2]};

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,hsh}=K;
    let BB=null;
    const bb=(x0,y0,x1,y1)=>{if(!BB)return;if(x0<BB[0])BB[0]=x0;if(y0<BB[1])BB[1]=y0;if(x1>BB[2])BB[2]=x1;if(y1>BB[3])BB[3]=y1;};
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;x=rnd(x);y=rnd(y);g.fillStyle=c;g.fillRect(x,y,w,h);bb(x,y,x+w,y+h);};
    const BL=(g,a,b,c,ok)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);bb(Math.min(x0,x1),Math.min(y0,y1),Math.max(x0,x1)+1,Math.max(y0,y1)+1);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){if(!ok||ok(x0,y0))g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const BL2=(g,a,b,c1,c2)=>{BL(g,a,b,c1);BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],c2);};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    const fp=(g,pts,c)=>{g.fillStyle=c;let ya=1e9,yb=-1e9,xa=1e9,xb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];if(p[0]<xa)xa=p[0];if(p[0]>xb)xb=p[0];}
      bb(Math.floor(xa),Math.floor(ya),Math.ceil(xb)+1,Math.ceil(yb)+1);
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa2=Math.ceil(xs[k]-.5),xb2=Math.ceil(xs[k+1]-.5)-1;if(xb2>=xa2)g.fillRect(xa2,y,xb2-xa2+1,1);}}};
    const Q=(u0,v0,du,dv,z=0)=>[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];
    const flat=(g,u0,v0,du,dv,c,z=0)=>fp(g,Q(u0,v0,du,dv,z),c);
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const clipPoly=(g,pts,fn)=>{g.save();g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.clip();fn();g.restore();};
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    // 斜面上的像素平行四邊形：s=+.5 沿 +v 面（左前）、s=-.5 沿 +u 面（右前）
    const pg=(g,x0,y0,w,h,s,c)=>{x0=rnd(x0);y0=rnd(y0);g.fillStyle=c;let ya=1e9,yb=-1e9;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(x0+i,y0+o,1,h);if(y0+o<ya)ya=y0+o;if(y0+o+h>yb)yb=y0+o+h;}bb(x0,ya,x0+w,yb);};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    // 沿 +v 面／+u 面一排窗：n＝夜圖畫布（null 不點燈）；lit＝點亮比例
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55,lc='#ffe3a0')=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,.5,glass);if(h>1)pg(g,X,Y,w,1,.5,SH(glass,30));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,lc);}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5,lc='#f3d68e')=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,lc);}};
    const RX=r=>Math.max(1,rnd(r*45.25));
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);RC(g,cx-w,cy+y,2*w+1,1,c);}};
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=hx(rx,ry,x);RC(g,cx+x,cy-h,1,h+yb+1,c);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h];};
    const h2r=c=>{const n=parseInt(c.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
    const mixC=(a,b,t)=>{const x=h2r(a),y=h2r(b),r=[0,1,2].map(i=>Math.max(0,Math.min(255,rnd(x[i]+(y[i]-x[i])*t))));return '#'+((r[0]<<16)|(r[1]<<8)|r[2]).toString(16).padStart(6,'0');};

    // 分層場景：o＝立體主體（二值化＋描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前；只處理該件包圍盒
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];BB=[1e9,1e9,-1e9,-1e9];
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          const x0=Math.max(0,BB[0]-2),y0=Math.max(0,BB[1]-2),x1=Math.min(W,BB[2]+2),y1=Math.min(H,BB[3]+2);BB=null;
          if(x1<=x0||y1<=y0)continue;
          const w=x1-x0,h=y1-y0,im=sx.getImageData(x0,y0,w,h),a=im.data;
          for(let i=3;i<a.length;i+=4)a[i]=a[i]>=110?255:0;
          if(it.ol){const mk=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3])continue;
              if((x+1<w&&a[i+7])||(x>0&&a[i-1])||(y+1<h&&a[i+4*w+3])||(y>0&&a[i-4*w+3]))mk.push(i);}
            for(const i of mk){a[i]=28;a[i+1]=34;a[i+2]=42;a[i+3]=255;}}
          sx.putImageData(im,x0,y0);
          g.drawImage(sc,x0,y0,w,h,x0,y0,w,h);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,x0,y0,w,h,x0,y0,w,h);ng.globalCompositeOperation='source-over';ng.drawImage(lc,x0,y0,w,h,x0,y0,w,h);
          sx.clearRect(x0,y0,w,h);lx.clearRect(x0,y0,w,h);}};
      const late=[];
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),gl:(fn)=>late.push(fn),late,run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h] 細桿／['pz',[[u,v,z],..]] 懸空多邊形
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const sp=(u,v,z)=>{const k=z/64;return P(u+k,v-k*.45);};
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,u1=u0+du,v1=v0+dv,c4=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];const A0=c4.map(q=>sp(q[0],q[1],z)),A1=c4.map(q=>sp(q[0],q[1],z+h));
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='pz'){fp(sx,s[1].map(q=>sp(q[0],q[1],q[2])),C);}
        else if(s[0]==='p'){const[,u,v,h]=s;BL(sx,P(u,v),sp(u,v,h),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      q:{t:['#b6b2a7','#b0aca1','#bcb8ad'],j:'#a7a398',s:.25,p:.55},     // 碼頭混凝土版
      a:{t:['#62615d','#5d5c58','#676662'],j:null,s:.125,p:.72},         // 瀝青
      p:{t:['#d1cdc2','#cbc7bc','#d7d3c8'],j:'#c0bcb1',s:.125,p:.6},     // 人行鋪面
      c:{t:['#a9a69e','#a4a199','#afaca4'],j:'#9b988f',s:.25,p:.6},      // 樓板混凝土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const WHT='#e9e7df',YEL='#dcb641';
    const WAT={b:'#3166a5',d:'#2c5a90',l:'#3a75b9',h:'#5d93cf'};
    // 水面：底色＋稀疏水平波紋（不灑雜點）
    const water=(g,u0,v0,du,dv,seed,dens=26)=>{const poly=Q(u0,v0,du,dv);fp(g,poly,WAT.b);
      clipPoly(g,poly,()=>{for(let i=0;i<rnd(du*dv*dens);i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v),l=2+rnd(hsh(seed,i,3)*3);
        RC(g,p[0],p[1],l,1,hsh(seed,i,4)<.6?WAT.l:WAT.d);}});};

    // ---------- 點景 ----------
    const lamp=(S,u,v,h=16,d,arm=1)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#50575c');RC(g,x,y-h,1,h,'#566066');
      if(arm>0){RC(g,x,y-h-1,3,1,'#3e464b');RC(g,x+1,y-h,2,1,'#efe2b0');if(n)RC(n,x+1,y-h,2,1,'#fff0c0');}
      else{RC(g,x-2,y-h-1,3,1,'#3e464b');RC(g,x-2,y-h,2,1,'#efe2b0');if(n)RC(n,x-2,y-h,2,1,'#fff0c0');}});
    const mastL=(S,u,v,h=26,d)=>S.o(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#6d7378');RC(g,x,y-h,1,h-2,'#a9b0b4');
      RC(g,x-2,y-h-2,5,2,'#5b6166');RC(g,x-2,y-h,5,1,'#e9e2c4');
      if(n){RC(n,x-2,y-h,5,1,'#fff2c8');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const person=(g,u,v,z,shirt)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-4,1,1,'#e2b48c');RC(g,x,y-3,1,2,shirt);RC(g,x,y-1,1,1,'#3a3d44');};
    const fence=(g,a,b,gaps=[],hgt=6)=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),Ln=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),nn=Math.max(2,Math.round(Ln/6));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=nn;i++){const t=i/nn;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-hgt],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,hgt),q(t1,hgt),'rgba(170,178,183,.95)');BL(g,q(t0,rnd(hgt*.55)),q(t1,rnd(hgt*.55)),'rgba(170,178,183,.5)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};
    // 車（尺度對齊道路車流）：alongU＝車身沿 u；L 長、Wd 寬
    const CARC=['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#2f2f33','#8a9aa4','#d8b64a','#4f7a5a','#dfe2e4'];
    const carG=(g,u,v,alongU,col,z=0,L=.18,Wd=.09)=>{const du=alongU?L:Wd,dv=alongU?Wd:L;
      const wh=alongU?[[u+.04,v+dv],[u+L-.05,v+dv]]:[[u+du,v+.04],[u+du,v+L-.05]];for(const[a,b]of wh){const p=P(a,b,z);RC(g,p[0]-1,p[1]-1,2,1,'#1b1d20');}
      boxZ(g,u,v,du,dv,z+1,2,SH(col,18),col,SH(col,-42));
      const iu=alongU?.045:.01,iv=alongU?.01:.045;
      boxZ(g,u+iu,v+iv,du-2*iu,dv-2*iv,z+3,2,SH(col,34),'#86a6bb','#5b7b91');};
    const car=(S,u,v,alongU,col,d,z=0)=>S.o(d!=null?d:u+v+.15,(g)=>carG(g,u,v,alongU,col,z));
    return{P,hsh,RC,BL,BL2,lerp,fp,Q,flat,boxZ,faceL,faceR,clipPoly,ribsL,ribsR,pg,winL,winR,rowL,rowR,RX,ell,cyl,mixC,
      scene,shadow,MATS,pave,lineU,lineV,dashU,dashV,WHT,YEL,WAT,water,lamp,mastL,tree,bush,person,fence,CARC,carG,car};
  };

  // 組裝：每類讀舊物件的 w/h/ax/ay；每變體獨立畫布；DEV 映射只在迭代時使用
  const build=(k,layouts)=>{const d0=DIM[k],o0=B[k+'_1_0'];
    const W=(o0&&o0.w)||d0[0],H=(o0&&o0.h)||d0[1],AX=(o0&&o0.ax!=null)?o0.ax:d0[2],AY=(o0&&o0.ay!=null)?o0.ay:d0[3],SZ=d0[4];
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null,made=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K,SZ)||{};
      // 地面層只留在佔地菱形內
      const[mc,mg]=A.cv(W,H);A.dia(mg,AX,AY-32*SZ,32*SZ,'#ffffff');
      for(const x of[g,ng]){x.save();x.globalCompositeOperation='destination-in';x.drawImage(mc,0,0);x.restore();}
      if(o.edge!==false){A.diaEdge(g,o.edge||6,'#6f7a62',AX,AY-32*SZ,32*SZ);}
      for(const f of S.late)f(g);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      {const im=g.getImageData(0,0,W,H),a=im.data;for(let i=3;i<a.length;i+=4){const x=a[i];if(x&&x<255)a[i]=x>=110?255:0;}g.putImageData(im,0,0);}
      B[k+'_1_'+slot]={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};made.push(slot);}
    // 舊的第 4、5 款（v3、v4）指到新圖，不留舊美術
    for(const key of Object.keys(B)){const m=key.match(new RegExp('^'+k+'_1_(\\d+)$'));if(!m)continue;const i=+m[1];if(i>=3&&made.includes(i%3))B[key]=B[k+'_1_'+(i%3)];}
    return made;};

  // ================= k18 港口（1×1）=================
  // 版面原則（1×1 只有 64×32 地面）：高的量體（臂吊、倉庫、魚市棚、候船室）放後排與右側；岸線前留一條淨空的淺灰碼頭帶；
  // 水道收窄成左前緣一條約 8px 的窄帶（岸壁 3px＋水面約 5px），水面直接貼遊戲本身的水面幀（同一套亮點與波紋），船只佔窄帶。
  try{
    const VQ=.74,WZ=-3;   // 岸線（v）、水面高（比岸面低 3px）
    // 水道：先鋪遊戲水色，再把遊戲的水面幀（SPR.water[0]，含亮點波紋）按本格菱形對位貼上；拿不到時退回同配方的稀疏亮點
    const channel=(g,L,seed)=>{const{P,Q,fp,clipPoly,RC,hsh}=L;const poly=Q(0,VQ,1,1-VQ);fp(g,poly,'#3671b6');
      let WT=null;try{const w=A.SPR().water;WT=w&&w[0]&&w[0].width?w[0]:null;}catch(e){}
      if(WT){const n=P(0,0);clipPoly(g,poly,()=>g.drawImage(WT,rnd(n[0])-32,rnd(n[1])));}
      else clipPoly(g,poly,()=>{for(let i=0;i<9;i++){const p=P(hsh(seed,i,1),VQ+.03+hsh(seed,i,2)*(.95-VQ));RC(g,p[0],p[1],2,1,hsh(seed,i,3)<.5?'#2f65a5':'#3c7ac0');}
        for(let i=0;i<4;i++){const p=P(.08+hsh(seed,i,5)*.84,VQ+.06+hsh(seed,i,6)*(.9-VQ));RC(g,p[0],p[1],3,1,i%3?'#5f9fd8':'#a9d5ef');}});};
    // 碼頭基座：混凝土岸面＋水道＋岸壁（+v 面）＋潮線青苔＋壓頂＋黃色警戒線＋護舷＋繫船柱＋岸壁腳深藍水線
    const quay=(g,L,seed,o={})=>{const{P,RC,BL,faceL,pave,lineU}=L;
      pave(g,o.mat||'q',0,0,1,VQ,seed);
      channel(g,L,seed+7);
      faceL(g,VQ,0,1,WZ,0,o.wall||'#a19d92');
      faceL(g,VQ,0,1,WZ,WZ+1,'#5a675c');
      BL(g,P(0,VQ,WZ-1),P(1,VQ,WZ-1),'#244d80');
      lineU(g,VQ,0,1,'#e4e0d6');
      if(o.safety!==false)lineU(g,VQ-.04,0,1,o.safety||'#d4ae3e');
      for(const u of(o.fenders||[.2,.4,.6,.8])){const p=P(u,VQ,0);RC(g,p[0]-1,p[1]+1,2,2,'#25282b');}
      for(const u of(o.bollards||[])){const p=P(u,VQ-.02,0);RC(g,p[0]-1,p[1]-2,2,2,'#2e3236');RC(g,p[0]-1,p[1]-2,1,1,'#80878b');}
      BL(g,P(1,0),P(1,VQ),'#6f7a62');};
    // 沿 u 的船殼：bowR＝艏在 u1（朝右），否則艏在 u0；艉為方艉；o.sw 舷帶寬、o.bw2 水線帶寬；回傳甲板高
    const hullU=(g,L,o)=>{const{P,fp,faceL,faceR,BL}=L;const{u0,u1,v0,v1}=o,z0=WZ,fb=o.fb||5,zt=z0+fb,vc=(v0+v1)/2,bw=o.bow||.13,H0=o.hull,dk=o.deck||'#8a7a66',HL=SH(H0,34),sw=o.sw||1,bb=o.bw2||1;
      if(o.bowR){const ub=u1-bw;
        faceL(g,v1,u0,ub,z0,zt,H0);
        fp(g,[P(ub,v1,z0),P(u1,vc,z0),P(u1+.03,vc,zt+1),P(ub,v1,zt)],SH(H0,-18));
        if(o.boot){faceL(g,v1,u0,ub,z0,z0+bb,o.boot);fp(g,[P(ub,v1,z0),P(u1-.005,vc+.005,z0),P(u1-.005,vc+.005,z0+bb),P(ub,v1,z0+bb)],SH(o.boot,-14));}
        if(o.stripe){faceL(g,v1,u0,ub,zt-1-sw,zt-1,o.stripe);fp(g,[P(ub,v1,zt-1-sw),P(u1+.01,vc+.02,zt-sw),P(u1+.01,vc+.02,zt),P(ub,v1,zt-1)],SH(o.stripe,-14));}
        faceL(g,v1,u0,ub,zt-1,zt,HL);BL(g,P(ub,v1,zt),P(u1+.03,vc,zt+1),SH(H0,14));
        fp(g,[P(u0,v0,zt),P(ub,v0,zt),P(u1+.03,vc,zt+1),P(ub,v1,zt),P(u0,v1,zt)],dk);
      }else{const ub=u0+bw;
        fp(g,[P(u0,vc,z0),P(ub,v1,z0),P(ub,v1,zt),P(u0-.03,vc,zt+1)],SH(H0,12));
        faceL(g,v1,ub,u1,z0,zt,H0);
        faceR(g,u1,v0,v1,z0,zt,SH(H0,-36));
        if(o.boot){fp(g,[P(u0+.01,vc+.01,z0),P(ub,v1,z0),P(ub,v1,z0+bb),P(u0+.01+.004*bb,vc+.01,z0+bb)],o.boot);faceL(g,v1,ub,u1,z0,z0+bb,o.boot);faceR(g,u1,v0,v1,z0,z0+bb,SH(o.boot,-30));}
        if(o.stripe){faceL(g,v1,ub,u1,zt-1-sw,zt-1,o.stripe);faceR(g,u1,v0,v1,zt-1-sw,zt-1,SH(o.stripe,-30));fp(g,[P(u0-.02,vc+.02,zt-sw),P(ub,v1,zt-1-sw),P(ub,v1,zt-1),P(u0-.02,vc+.02,zt)],SH(o.stripe,12));}
        faceL(g,v1,ub,u1,zt-1,zt,HL);BL(g,P(u0-.03,vc,zt+1),P(ub,v1,zt),HL);
        fp(g,[P(u0-.03,vc,zt+1),P(ub,v0,zt),P(u1,v0,zt),P(u1,v1,zt),P(ub,v1,zt)],dk);}
      return zt;};
    // 沿 u 的貨櫃：長側（+v）波紋、門端（+u）暗
    const ctrU=(g,L,u0,v0,Ln,Wd,z,col,th=5)=>{const{P,RC,fp,Q,faceL,faceR,ribsL}=L;const u1=u0+Ln,v1=v0+Wd;
      faceL(g,v1,u0,u1,z,z+th,col);faceR(g,u1,v0,v1,z,z+th,SH(col,-50));fp(g,Q(u0,v0,Ln,Wd,z+th),SH(col,22));
      ribsL(g,u0,u1,v1,z,z+th,SH(col,-16));faceL(g,v1,u0,u1,z,z+1,SH(col,-32));
      const d=P(u1,v0+Wd*.5,z+th-1);RC(g,d[0],d[1]+1,1,th-2,SH(col,-72));};
    // 雙坡屋頂（屋脊沿 u）：回傳屋脊高
    const gableU=(g,L,u0,u1,v0,v1,he,ri,roof,endC,oh=.02)=>{const{P,fp,BL}=L;const vm=(v0+v1)/2;
      fp(g,[P(u1,v0,he),P(u1,v1,he),P(u1,vm,he+ri)],endC);
      fp(g,[P(u0-oh,v0-oh,he),P(u1+oh,v0-oh,he),P(u1+oh,vm,he+ri),P(u0-oh,vm,he+ri)],SH(roof,-22));
      fp(g,[P(u0-oh,vm,he+ri),P(u1+oh,vm,he+ri),P(u1+oh,v1+oh,he-1),P(u0-oh,v1+oh,he-1)],roof);
      BL(g,P(u1+oh,vm,he+ri),P(u1+oh,v1+oh,he-1),SH(roof,-40));BL(g,P(u1+oh,vm,he+ri),P(u1+oh,v0-oh,he),SH(roof,-40));
      BL(g,P(u0-oh,vm,he+ri),P(u1+oh,vm,he+ri),SH(roof,26));
      return he+ri;};
    // 繫船纜（岸上繫船柱→船舷）
    const lines=(S,L,pairs,d=2.2)=>S.t(d,(g2)=>{const{P,BL}=L;for(const[a,b]of pairs)BL(g2,P(a[0],a[1],a[2]),P(b,VQ-.02,1),'#d8d2c0');});

    const K18=[
      // ---------- v0 貨運小港＋臂吊：後排倉庫、木箱、貨櫃堆；中段淨空碼頭面；右側臂吊長臂伸過水道，把貨櫃吊上靠泊的小貨輪 ----------
      (g,ng,S,L)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ribsL,winL,rowL,rowR,lineU,lineV,shadow,lamp}=L;
        quay(g,L,1801,{bollards:[.1,.3,.5,.7,.9]});
        // 地面標線：貨櫃堆場框線、倉庫前卸貨區框
        lineU(g,.03,.58,.97,'#e6e2d6');lineU(g,.33,.58,.97,'#e6e2d6');lineV(g,.58,.03,.33,'#e6e2d6');
        lineU(g,.33,.08,.4,'#e6e2d6');
        const cu=.88,cv=.56,CC='#e3b23c',Cl=SH(CC,26),Cd=SH(CC,-62);
        const J0=[cu-.07,cv+.04,30],J1=[.37,.86,43];
        shadow(g,[['b',.05,.05,.37,.22,17],['b',.6,.04,.36,.27,10],['b',.47,.1,.07,.1,6],['b',cu-.06,cv-.06,.12,.12,5],['b',cu-.035,cv-.035,.07,.07,27],['b',cu-.1,cv-.08,.22,.13,7,27]]);
        // 倉庫（金屬波浪板、捲門朝碼頭面、雙坡頂）
        S.o(.7,(g2,n2)=>{const u0=.05,v0=.05,u1=.42,v1=.27,he=12;const WL='#d3ccba',WR='#a69f8d';
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,he,null,WL,WR);ribsL(g2,u0,u1,v1,0,he,SH(WL,-13));
          faceL(g2,v1,u0,u1,0,1,'#8e8878');faceR(g2,u1,v0,v1,0,1,'#77705f');
          const d0=.13,d1=.3;faceL(g2,v1,d0,d1,0,8,'#8f969b');for(let z=1;z<8;z+=2)faceL(g2,v1,d0,d1,z,z+1,'#757c81');
          faceL(g2,v1,d0-.015,d0,0,9,'#4f575c');faceL(g2,v1,d1,d1+.015,0,9,'#4f575c');faceL(g2,v1,d0-.015,d1+.015,8,9,'#4f575c');
          winL(g2,.36,v1,0,2,5,'#3e474c');
          rowR(g2,n2,u1,v0+.03,v1-.03,7,2,2,3,'#4d6f88',1811,.5);
          const lp=P(.215,v1,10);RC(g2,lp[0],lp[1]-1,2,1,'#efe2b0');if(n2)RC(n2,lp[0],lp[1]-1,2,1,'#ffe6a0');
          gableU(g2,L,u0,u1,v0,v1,he,5,'#8fa0aa','#958e7c');});
        // 木箱堆（倉庫與貨櫃之間）
        S.o(.76,(g2)=>{boxZ(g2,.47,.1,.07,.06,0,4,'#c49a64','#b48a56','#8a6a40');boxZ(g2,.48,.17,.06,.04,0,3,'#b58d5a','#a57d4c','#7e603a');boxZ(g2,.475,.105,.055,.045,4,2,'#caa36c','#ba935e','#8e6e44');});
        // 貨櫃堆（三列、一到兩層）
        S.o(1.24,(g2)=>{const C=[['#a5523d','#4c6f95'],['#5b8765','#d2d1c9'],['#bf7a3c']];
          C.forEach((col,j)=>col.forEach((c,t)=>ctrU(g2,L,.6,.04+j*.09,.36,.083,t*5,c)));});
        // 臂吊：素面混凝土底座＋迴轉座＋塔身＋機房（左前駕駛室、右後配重）＋A 型架
        S.o(1.5,(g2,n2)=>{boxZ(g2,cu-.06,cv-.06,.12,.12,0,3,'#cfcbc0','#c0bcb1','#99958a');
          boxZ(g2,cu-.045,cv-.045,.09,.09,3,2,'#5d6468','#6f777b','#454b4f');
          boxZ(g2,cu-.035,cv-.035,.07,.07,5,22,Cl,CC,Cd);
          for(let z=10;z<27;z+=5)faceL(g2,cv+.035,cu-.035,cu+.035,z,z+1,SH(CC,-20));
          boxZ(g2,cu+.07,cv-.08,.045,.13,28,6,'#9aa09b','#8a908b','#666c67');
          boxZ(g2,cu-.07,cv-.08,.14,.13,27,7,'#f0ead9',CC,Cd);
          faceL(g2,cv+.05,cu-.07,cu+.07,32,33,Cd);
          boxZ(g2,cu-.11,cv-.01,.06,.07,26,7,'#e9e4d6','#3f5f78','#2d4a60');faceL(g2,cv+.06,cu-.11,cu-.05,32,33,'#e9e4d6');
          if(n2){winL(n2,cu-.1,cv+.06,28,2,3,'#ffe3a0');}
          const ap=P(cu+.02,cv-.04,45),b1=P(cu-.03,cv-.07,34),b2=P(cu+.06,cv-.03,34);
          BL(g2,b1,ap,Cl);BL(g2,[b1[0]+1,b1[1]],[ap[0]+1,ap[1]],Cd);BL(g2,b2,ap,Cd);
          RC(g2,ap[0]-1,ap[1]-2,3,2,Cd);RC(g2,ap[0],ap[1]-3,1,1,'#c0392b');if(n2)RC(n2,ap[0],ap[1]-3,1,1,'#ff5a48');});
        // 小貨輪（艏朝右、艉樓在左）：只佔水道窄帶；艙蓋、甲板上等著吊的位置
        S.o(1.6,(g2,n2)=>{const u0=.08,u1=.54,v0=.775,v1=.945,vc=(v0+v1)/2;
          const zt=hullU(g2,L,{u0,u1,v0,v1,fb:5,bow:.11,bowR:1,hull:'#a04a36',boot:'#2e3033',deck:'#7a7d70'});
          boxZ(g2,.25,v0+.03,.2,v1-v0-.06,zt,2,'#3f6a8a','#4a7899','#2e5470');for(const t of[.3,.35,.4])BL(g2,P(t,v0+.03,zt+2),P(t,v1-.03,zt+2),'#2e5470');
          boxZ(g2,.46,v0+.04,.05,v1-v0-.08,zt,1,'#8a8d80','#9a9d90','#6a6d62');const fm=P(.49,vc,zt+1);RC(g2,fm[0],fm[1]-5,1,5,'#d0d0ca');if(n2)RC(n2,fm[0],fm[1]-5,1,1,'#fff6e0');
          boxZ(g2,.1,v0+.025,.12,v1-v0-.05,zt,5,'#e9e7e0','#f2f0ea','#bcb9b1');
          faceL(g2,v1-.025,.11,.21,zt+2,zt+3,'#43627c');faceR(g2,.22,v0+.04,v1-.04,zt+2,zt+3,'#35506a');
          if(n2)faceL(n2,v1-.025,.12,.2,zt+2,zt+3,'#ffe3a0');
          boxZ(g2,.09,v0+.015,.14,v1-v0-.03,zt+5,3,'#e4e2da','#ecebe5','#b6b3ab');
          faceL(g2,v1-.015,.1,.22,zt+6,zt+7,'#2f4a60');faceR(g2,.23,v0+.02,v1-.02,zt+6,zt+7,'#243a4c');
          if(n2)faceL(n2,v1-.015,.11,.21,zt+6,zt+7,'#ffe3a0');
          boxZ(g2,.12,vc-.03,.04,.06,zt+8,3,'#d0473b','#c0392b','#83302a');
          const nl=P(.22,v1,zt+6);RC(g2,nl[0],nl[1],1,1,'#3f9a55');if(n2)RC(n2,nl[0],nl[1],1,1,'#6aff8a');});
        // 吊臂（格構，左伸過水道）
        S.o(2.0,(g2,n2)=>{const N=14;const pt=(t,dz)=>P(J0[0]+(J1[0]-J0[0])*t,J0[1]+(J1[1]-J0[1])*t,J0[2]+(J1[2]-J0[2])*t+dz);
          BL(g2,pt(0,0),pt(1,0),Cd);BL(g2,pt(0,4),pt(1,1),Cl);
          for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N,h0=4-3*t0,h1=4-3*t1;BL(g2,pt(t0,i%2?0:h0),pt(t1,i%2?h1:0),CC);}
          const tp=pt(1,.5);RC(g2,tp[0]-1,tp[1]-1,3,2,Cd);RC(g2,tp[0],tp[1]-2,1,1,'#c0392b');if(n2)RC(n2,tp[0],tp[1]-2,1,1,'#ff5a48');});
        // 拉桿、吊索、吊具與吊著的貨櫃（在艙蓋正上方）
        S.t(2.01,(g2)=>{const ap=P(cu+.02,cv-.04,45),tp=P(J1[0],J1[1],J1[2]+1);BL(g2,ap,tp,'#4a4f54');
          BL(g2,[tp[0],tp[1]+1],P(J1[0],J1[1],16),'#2e3236');});
        S.o(2.02,(g2)=>{const u=J1[0],v=J1[1];boxZ(g2,u-.09,v-.035,.18,.07,15,1,'#e3b23c','#c99a2a','#8a6a1c');
          ctrU(g2,L,u-.09,v-.04,.18,.075,10,'#4c6f95',5);});
        lines(S,L,[[[.1,.8,2],.1],[[.5,.8,2],.5]]);
        lamp(S,.04,.68,18);
        return{edge:false};
      },

      // ---------- v1 漁港：北角高白製冰廠；後排右側長條開放式魚市棚（紅招牌）；棚前一排整齊魚箱；
      //            左前長拖網漁船（白殼藍帶紅水線、前駕駛艙、桅杆吊桿）；右段水道留空 ----------
      (g,ng,S,L)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ribsL,winL,winR,rowL,rowR,ell,lineU,shadow,lamp}=L;
        quay(g,L,1831,{bollards:[.1,.3,.5,.7],wall:'#9a968a',fenders:[.2,.4,.6],safety:false});
        // 棚前濕地坪（深一階）＋排水溝
        flat(g,.36,.37,.6,.13,'#a4a095');
        BL(g,P(.02,.62),P(.76,.62),'#9a968b');
        shadow(g,[['b',.05,.05,.25,.22,17],['b',.38,.06,.57,.3,12],['b',.45,.45,.42,.05,2]]);
        // 製冰廠（北角；白色冷藏盒＋藍帶＋捲門＋屋頂冷凝機）
        S.o(.5,(g2,n2)=>{const u0=.05,u1=.3,v0=.05,v1=.27,he=17;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,he,'#c9d0d3','#e9ecec','#b9c0c3');
          for(let t=u0+.05;t<u1;t+=.05)BL(g2,P(t,v1,1),P(t,v1,he-4),'#d6dbdc');
          faceL(g2,v1,u0,u1,he-3,he-1,'#3d7fc0');faceR(g2,u1,v0,v1,he-3,he-1,'#2d5f92');
          faceL(g2,v1,u0,u1,0,1,'#a9b0b4');faceR(g2,u1,v0,v1,0,1,'#8d9498');
          faceL(g2,v1,.09,.2,0,8,'#9aa3a8');for(let z=1;z<8;z+=2)faceL(g2,v1,.09,.2,z,z+1,'#87909a');
          rowR(g2,n2,u1,v0+.03,v1-.03,9,2,2,3,'#4d6f88',1836,.6);
          boxZ(g2,.08,.08,.09,.08,he,3,'#a9b0b4','#bfc5c8','#8d9498');const f=P(.125,.12,he+3);RC(g2,f[0]-2,f[1]-1,4,2,'#5d666c');
          boxZ(g2,.2,.09,.06,.1,he,2,'#a9b0b4','#bfc5c8','#8d9498');
          const lp=P(.24,v1,11);RC(g2,lp[0],lp[1]-1,2,1,'#efe2b0');if(n2)RC(n2,lp[0],lp[1]-1,2,1,'#ffe6a0');});
        // 魚市棚（後排右側）：後牆與左端牆（內側暗）、棚下一條不鏽鋼拍賣檯、柱列、雙坡頂、簷口紅招牌
        S.o(1.0,(g2,n2)=>{const u0=.38,u1=.95,v0=.06,v1=.36,he=8;
          flat(g2,u0,v0,u1-u0,v1-v0,'#8d897e');
          faceL(g2,v0+.01,u0,u1,0,he,'#7d7a70');faceR(g2,u0+.01,v0,v1,0,he,'#6b685f');
          boxZ(g2,u0+.06,v0+.12,u1-u0-.12,.07,0,2,'#c9ced1','#aeb5ba','#7f878c');
          for(const[u,v]of[[u0+.01,v1],[u0+.2,v1],[u0+.39,v1],[u1,v1],[u1,v0+.15]]){const a=P(u,v,0),b=P(u,v,he);RC(g2,a[0]-1,b[1],2,a[1]-b[1],'#dcd8ce');RC(g2,a[0],b[1],1,a[1]-b[1],'#9d998f');}
          if(n2){for(const t of[.5,.74]){const p=P(t,v0+.17,he-1);RC(n2,p[0],p[1],2,1,'#fff0c8');}}
          const rz=gableU(g2,L,u0,u1,v0,v1,he,4,'#5f9aa2','#3e6b72',.03);
          for(let t=u0+.03;t<u1+.03;t+=.0625)BL(g2,P(t,(v0+v1)/2,rz),P(t,v1+.03,he-1),'#548a92');
          // 紅招牌：一塊實心板（不畫字，避免碎點）
          faceL(g2,v1+.03,u0+.14,u0+.42,he-3,he,'#b8433a');faceL(g2,v1+.03,u0+.14,u0+.42,he-3,he-2,'#8e3129');});
        // 棚前：一排整齊藍色魚箱（單層、等距，和棚柱之間留一道空）
        S.o(1.4,(g2)=>{for(let k=0;k<6;k++){const u=.45+k*.07;boxZ(g2,u,.45,.05,.05,0,2,'#6aa0d6','#3d7fc0','#2a5c90');}});
        // 拖網漁船（艏朝左、加長）：白殼、藍色舷帶、紅色水線；前段駕駛艙（藍頂、深色窗帶）、桅杆＋橫桁＋吊桿、艉部絞機與門架
        S.o(1.6,(g2,n2)=>{const u0=.04,u1=.64,v0=.775,v1=.95,vc=(v0+v1)/2;
          const zt=hullU(g2,L,{u0,u1,v0,v1,fb:6,bow:.12,hull:'#eceae3',boot:'#b8433a',bw2:2,stripe:'#2f6aa8',sw:2,deck:'#9a958a'});
          boxZ(g2,.15,v0+.03,.12,v1-v0-.06,zt,6,'#e9e7e0','#f2f0ea','#bcb9b1');
          faceL(g2,v1-.03,.16,.26,zt+3,zt+5,'#2f4a60');faceR(g2,.27,v0+.045,v1-.045,zt+3,zt+5,'#243a4c');
          if(n2)faceL(n2,v1-.03,.17,.25,zt+3,zt+5,'#ffe3a0');
          boxZ(g2,.14,v0+.02,.14,v1-v0-.04,zt+6,1,'#3d7fc0','#2f6aa8','#244f7e');
          boxZ(g2,.44,v0+.04,.12,v1-v0-.08,zt,1,'#7d8a90','#8d9aa0','#5d6a70');
          const ms=P(.33,vc,zt),mt=P(.33,vc,zt+17);RC(g2,ms[0],mt[1],1,ms[1]-mt[1],'#e3e0d6');RC(g2,ms[0]+1,mt[1]+3,1,ms[1]-mt[1]-3,'#9a968c');
          RC(g2,mt[0]-2,mt[1]+4,5,1,'#e3e0d6');
          RC(g2,mt[0],mt[1]-1,1,1,'#f4f4ee');if(n2)RC(n2,mt[0],mt[1]-1,1,1,'#fff6e0');
          const nl=P(.14,v1,zt+1);RC(g2,nl[0],nl[1],1,1,'#3f9a55');if(n2)RC(n2,nl[0],nl[1],1,1,'#6aff8a');});
        // 吊桿（桅頂斜拉到艉艙口，細線層）
        S.t(1.61,(g2)=>{BL(g2,P(.33,.8625,WZ+6+12),P(.52,.8625,WZ+6+3),'#d8d4ca');});
        lines(S,L,[[[.08,.8,3],.1],[[.6,.8,3],.62]]);
        lamp(S,.03,.5,15);
        return{edge:false};
      },

      // ---------- v2 客運小碼頭：後排右側拱頂玻璃候船室、左側樹蔭小廣場＋導引線旁候車亭；登船斜橋下到浮箱；
      //            左前深藍殼交通船、右前浮動碼頭 ----------
      (g,ng,S,L)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ribsL,ribsR,winL,winR,rowL,rowR,ell,mixC,lineU,lineV,pave,shadow,lamp,tree,bush}=L;
        quay(g,L,1861,{mat:'p',bollards:[.08,.5],fenders:[.2,.36,.52],safety:false});
        // 廣場：深色鋪面方格、黃色導引線
        for(let a=.06;a<.56;a+=.1)for(let b=.08;b<.56;b+=.1)if(((a*10|0)+(b*10|0))%2&&!(a>.4&&b<.32))flat(g,a,b,.1,Math.min(.1,.56-b),'#c7c3b8');
        lineU(g,VQ-.05,.02,.98,'#d9b440');
        shadow(g,[['b',.42,.05,.53,.28,17],['b',.1,.79,.42,.15,8,WZ+5],['b',.06,.05,.08,.08,12],['b',.06,.28,.08,.08,10],['b',.2,.5,.13,.08,1,7]]);
        // 樹與長椅（後排左側廣場）
        tree(S,.1,.09,.8,2,.4);tree(S,.1,.32,.7,0,.45);
        S.o(.66,(g2)=>{for(const[u,v]of[[.08,.42],[.24,.42]]){boxZ(g2,u,v,.07,.025,1,1,'#b48a56','#9c7446','#6e5232');const a=P(u+.01,v+.025,0),b=P(u+.06,v+.025,0);RC(g2,a[0],a[1]-1,1,1,'#50575c');RC(g2,b[0],b[1]-1,1,1,'#50575c');}});
        // 候車亭（導引線旁）：四柱、藍色平頂、內側長椅
        S.o(.9,(g2)=>{const u0=.2,u1=.33,v0=.5,v1=.58;
          boxZ(g2,u0+.02,v0+.01,u1-u0-.04,.025,1,1,'#b48a56','#9c7446','#6e5232');
          for(const[u,v]of[[u0,v0],[u1,v0],[u0,v1],[u1,v1]]){const a=P(u,v,0),b=P(u,v,7);RC(g2,a[0],b[1],1,a[1]-b[1],'#8e979c');}
          boxZ(g2,u0-.01,v0-.01,u1-u0+.02,v1-v0+.02,7,1,'#6a9fd6','#2f6aa8','#244f7e');});
        // 候船室：玻璃帷幕（規則豎框、一條橫框、一條反光線；左面亮右面暗）＋拱形屋頂（沿 u）＋端部弧形玻璃山牆
        S.o(1.3,(g2,n2)=>{const u0=.43,u1=.94,v0=.06,v1=.31,he=10,GL='#86aec8',GR='#557d98',ML='#4f6b7c',MR='#3a4f5e';
          boxZ(g2,u0-.01,v0-.01,u1-u0+.02,v1-v0+.02,0,1,'#b9b5aa','#a9a59a','#8f8b80');
          boxZ(g2,u0,v0,u1-u0,v1-v0,1,he-1,null,GL,GR);
          faceL(g2,v1,u0,u1,he-2,he-1,'#d2e6f1');faceR(g2,u1,v0,v1,he-2,he-1,'#9dbccf');
          faceL(g2,v1,u0,u1,5,6,ML);faceR(g2,u1,v0,v1,5,6,MR);
          ribsL(g2,u0,u1,v1,1,he+1,ML,4,2);ribsR(g2,u1,v0,v1,1,he+1,MR,4,2);
          faceL(g2,v1,u0,u1,1,2,'#7d8a90');faceR(g2,u1,v0,v1,1,2,'#667277');
          // 入口：深色雙扇門＋門楣站牌
          faceL(g2,v1,.6,.72,1,5,'#2d4658');faceL(g2,v1,.655,.665,1,5,'#8fa3ae');
          if(n2){
            for(let k=0,t=u0;t<u1-.06;t+=.125,k++){if(hsh(1862,k,1)<.3)continue;faceL(n2,v1,t+.035,Math.min(u1,t+.11),2,5,'#ffe6b0');}
            for(let k=0,t=v0;t<v1-.06;t+=.125,k++){if(hsh(1863,k,1)<.4)continue;faceR(n2,u1,t+.035,Math.min(v1,t+.11),2,5,'#f3d68e');}}
          const N=10,rise=5,oh=.035,z0=he,A0=u0-oh,A1=u1+oh,B0=v0-oh,B1=v1+oh;const vs=[],zs=[];
          for(let i=0;i<=N;i++){const t=i/N;vs.push(B0+(B1-B0)*t);zs.push(z0+rise*Math.sin(Math.PI*t));}
          // 端部弧形山牆（玻璃）：牆面 u1 上、拱線以下
          {const lu=[];for(let i=0;i<=N;i++)lu.push(P(u1,v0+(v1-v0)*i/N,z0+(rise-1)*Math.sin(Math.PI*i/N)));fp(g2,lu.concat([P(u1,v1,z0),P(u1,v0,z0)]),GR);
            const m=P(u1,(v0+v1)/2,z0);RC(g2,m[0],m[1]-rise+1,1,rise-1,MR);}
          const cs=[];
          for(let i=0;i<N;i++){const sl=(zs[i]-zs[i+1])/(rise*Math.PI/N);const c=mixC('#3c6591','#86acd2',Math.max(0,Math.min(1,(sl+1)/2)));cs.push(c);
            fp(g2,[P(A0,vs[i],zs[i]),P(A1,vs[i],zs[i]),P(A1,vs[i+1],zs[i+1]),P(A0,vs[i+1],zs[i+1])],c);}
          // 立縫：沿拱線逐段畫、每 8px 一條、比所在段深一階
          for(let t=A0+.25;t<A1-.02;t+=.25)for(let i=0;i<N;i++)BL(g2,P(t,vs[i],zs[i]),P(t,vs[i+1],zs[i+1]),SH(cs[i],-16));
          // 拱端封邊（白）＋前簷口一條實線
          const arch=[];for(let i=0;i<=N;i++)arch.push(P(A1,vs[i],zs[i]));const archB=[];for(let i=N;i>=0;i--)archB.push(P(A1,vs[i],zs[i]-1));
          fp(g2,arch.concat(archB),'#e8ecee');
          BL(g2,P(A0,B1,z0-1),P(A1,B1,z0-1),'#e8ecee');
          // 門楣站牌（貼在玻璃牆上）
          faceL(g2,v1,.585,.735,6,8,'#2f6aa8');faceL(g2,v1,.61,.71,7,8,'#f2f4f4');
          if(n2)faceL(n2,v1,.6,.72,6,8,'#9ccaff');});
        // 浮動碼頭（右前水道）：浮箱＋黃色舷邊、登船斜橋從岸面下到浮箱
        S.o(1.62,(g2,n2)=>{const u0=.56,u1=.93,v0=.79,v1=.87,zf=WZ+2;
          boxZ(g2,u0,v0,u1-u0,v1-v0,WZ,2,'#b9bec0','#c9ced0','#8e979c');faceL(g2,v1,u0,u1,WZ,WZ+1,'#d4ae3e');faceR(g2,u1,v0,v1,WZ,WZ+1,'#a8892f');
          const a0=.72,a1=.8;fp(g2,[P(a0,VQ-.03,0),P(a1,VQ-.03,0),P(a1,v0+.035,zf),P(a0,v0+.035,zf)],'#a3aaae');faceR(g2,a1,VQ-.03,v0+.035,zf-1,0,'#5d666c');
          BL(g2,P(a0,VQ-.03,0),P(a0,v0+.035,zf),'#dfe3e5');
          for(const u of[.6,.9]){const p=P(u,v0+.02,zf);RC(g2,p[0]-1,p[1]-1,2,1,'#3a3f44');}});
        // 浮箱端燈柱（細線層）
        S.t(1.8,(g2,n2)=>{const a=P(.91,.84,WZ+2);RC(g2,a[0],a[1]-8,1,8,'#6d767c');RC(g2,a[0]-1,a[1]-9,3,1,'#3e464b');RC(g2,a[0]-1,a[1]-8,2,1,'#efe2b0');if(n2)RC(n2,a[0]-1,a[1]-8,2,1,'#fff0c0');});
        // 交通船（艏朝左）：深藍殼白舷帶、客艙連續窗帶、前端駕駛台、紅煙囪、艉開放甲板
        S.o(1.7,(g2,n2)=>{const u0=.08,u1=.52,v0=.78,v1=.95,vc=(v0+v1)/2;
          const zt=hullU(g2,L,{u0,u1,v0,v1,fb:5,bow:.1,hull:'#2c4a6e',boot:'#b8433a',stripe:'#e9ebe8',deck:'#c9c4b8'});
          boxZ(g2,.19,v0+.02,.25,v1-v0-.04,zt,5,'#e9ebe8','#f4f5f2','#c3c6c2');
          faceL(g2,v1-.02,.2,.43,zt+2,zt+4,'#35556e');faceR(g2,.44,v0+.03,v1-.03,zt+2,zt+4,'#294459');
          for(let t=.25;t<.43;t+=.125)BL(g2,P(t,v1-.02,zt+2),P(t,v1-.02,zt+3),'#e9ebe8');
          if(n2){for(let k=0,t=.21;t<.42;t+=.0625,k++){if(hsh(1864,k,2)<.3)continue;faceL(n2,v1-.02,t,t+.04,zt+2,zt+4,'#ffe3a0');}}
          boxZ(g2,.18,v0+.03,.08,v1-v0-.06,zt+5,3,'#e8eae6','#f2f3f0','#bec1bd');faceL(g2,v1-.03,.19,.25,zt+6,zt+7,'#22384a');
          if(n2)faceL(n2,v1-.03,.2,.25,zt+6,zt+7,'#ffe8b0');
          boxZ(g2,.34,vc-.03,.04,.06,zt+5,3,'#d0473b','#c0392b','#8a2a20');
          const mp=P(.22,vc,zt+8);RC(g2,mp[0],mp[1]-4,1,4,'#d9d9d4');RC(g2,mp[0],mp[1]-5,1,1,'#f4f4ee');if(n2)RC(n2,mp[0],mp[1]-5,1,1,'#fff6e0');
          for(let t=.45;t<.51;t+=.025){const p=P(t,v1-.02,zt);RC(g2,p[0],p[1]-2,1,2,'#8e979c');}BL(g2,P(.44,v1-.02,zt+2),P(.51,v1-.02,zt+2),'#dfe3e5');
          const nl=P(.17,v1,zt+1);RC(g2,nl[0],nl[1],1,1,'#3f9a55');if(n2)RC(n2,nl[0],nl[1],1,1,'#6aff8a');});
        lines(S,L,[[[.12,.8,2],.08],[[.5,.8,2],.5]]);
        lamp(S,.03,.62,15);
        return{edge:false};
      },
    ];
    build(18,K18);
  }catch(e){console.error('trans_d k18',e);errs.push('k18:'+(e&&e.stack||e));}


  // ================= k20 停車場（2×2）=================
  try{
    // 車位格：沿 u 排開的一排垂直車位（車身沿 v）；回傳每格 u 起點
    const stallRow=(g,L,u0,u1,va,vb,w=.13,c)=>{const{lineV,lineU,WHT}=L;const out=[];c=c||WHT;
      for(let u=u0;u<=u1+1e-6;u+=w){lineV(g,u,va+.02,vb-.02,c);if(u+w<=u1+1e-6)out.push(u);}return out;};
    // 停車（依雜湊決定空位與車色）；facing：車頭朝 -v（back）或 +v
    const parkRow=(S,L,us,va,vb,seed,occ=.62,z=0,dAdd=0)=>{const{hsh,car,CARC}=L;const Lc=.18,Wd=.09;
      us.forEach((u,j)=>{if(hsh(seed,j,7)>occ)return;const c=CARC[Math.floor(hsh(seed,j,9)*CARC.length)];
        const vv=(va+vb)/2-Lc/2+(hsh(seed,j,11)-.5)*.03;car(S,u+(.13-Wd)/2,vv,false,c,u+vv+.3+dAdd,z);});};
    // 地面箭頭（沿 +u 或 -u）
    const arrowU=(g,L,u,v,dir,c)=>{const{BL,P}=L;BL(g,P(u-dir*.07,v),P(u+dir*.05,v),c);BL(g,P(u+dir*.05,v),P(u+dir*.01,v-.03),c);BL(g,P(u+dir*.05,v),P(u+dir*.01,v+.03),c);};
    // 立體停車場主體：開放樓層（暗）＋樓板帶＋柱＋可見車尾＋鋼纜；頂層停車；回傳頂面高
    const garage=(g,n,L,o)=>{const{P,RC,BL,fp,flat,boxZ,faceL,faceR,hsh,carG,CARC,lineV,lineU,WHT}=L;
      const{u0,u1,v0,v1,lv,fh,seed}=o,zt=lv*fh,SLl='#cdcac1',SLr='#a6a39a',OPl='#30353a',OPr='#272b2f';
      faceL(g,v1,u0,u1,0,zt,OPl);faceR(g,u1,v0,v1,0,zt,OPr);
      for(let k=0;k<lv;k++){const z=k*fh;
        // 車尾（從開口看進去）：每層同一組車位、同一高度一排尾燈（每輛車兩顆，只在車尾兩角）
        for(let t=u0+.07,j=0;t<u1-.1;t+=.14,j++){if(hsh(seed,j,40)<.3||(k===0&&hsh(seed,j,41)<.3))continue;if(o.rearU&&(t<o.rearU[0]||t>o.rearU[1]))continue;const c=CARC[Math.floor(hsh(seed,j,k+50)*CARC.length)];
          faceL(g,v1,t,t+.085,z+1,z+4,c);faceL(g,v1,t+.01,t+.075,z+4,z+5,'#5a6a78');
          const pa=P(t+.008,v1,z+3),pb=P(t+.077,v1,z+3);RC(g,pa[0],pa[1],1,1,'#d8443a');RC(g,pb[0]-1,pb[1],1,1,'#d8443a');}
        for(let t=v0+.07,j=0;t<v1-.1;t+=.14,j++){if(hsh(seed,j,k+60)<.35)continue;const c=CARC[Math.floor(hsh(seed,j,k+70)*CARC.length)];
          faceR(g,u1,t,t+.085,z+1,z+4,SH(c,-40));faceR(g,u1,t+.01,t+.075,z+4,z+5,'#3f4d59');}
        if(n){for(let t=u0+.2;t<u1-.1;t+=.3){const p=P(t,v1,z+fh-3);RC(n,p[0],p[1],3,1,'#fff0c8');}
          for(let t=v0+.2;t<v1-.1;t+=.3){const p=P(u1,t,z+fh-3);RC(n,p[0]-2,p[1],3,1,'#f3d68e');}}}
      // 柱
      for(let t=u0;t<=u1-.02;t+=(u1-u0)/Math.round((u1-u0)/.3)){faceL(g,v1,t,t+.035,0,zt,'#bdbab1');}
      for(let t=v0;t<=v1-.02;t+=(v1-v0)/Math.round((v1-v0)/.3)){faceR(g,u1,t,t+.035,0,zt,'#8f8c84');}
      faceR(g,u1,v1-.035,v1,0,zt,'#8f8c84');
      // 樓板帶＋地坪台基
      faceL(g,v1,u0,u1,0,1,'#8e8b83');faceR(g,u1,v0,v1,0,1,'#77746c');
      for(let k=1;k<=lv;k++){faceL(g,v1,u0,u1,k*fh-2,k*fh,SLl);faceR(g,u1,v0,v1,k*fh-2,k*fh,SLr);}
      return zt;};
    // 頂層：女兒牆、車位、車；回傳車位 u 起點（供外部加燈）
    const roofDeck=(g,L,o)=>{const{P,flat,boxZ,faceL,faceR,BL,lineU,lineV,hsh,carG,CARC,WHT}=L;const{u0,u1,v0,v1,zt,seed}=o;
      flat(g,u0,v0,u1-u0,v1-v0,'#8e8d88',zt);
      for(let t=u0+.25;t<u1;t+=.25)BL(g,P(t,v0,zt),P(t,v1,zt),'#858480');
      faceL(g,v0+.03,u0,u1,zt,zt+3,'#b7b4ab');faceR(g,u0+.03,v0,v1,zt,zt+3,'#a5a299');
      flat(g,u0,v0,u1-u0,.03,'#d6d3ca',zt+3);flat(g,u0,v0,.03,v1-v0,'#d6d3ca',zt+3);};
    const parapetFront=(g,L,o)=>{const{faceL,faceR,flat}=L;const{u0,u1,v0,v1,zt}=o;
      faceL(g,v1,u0,u1,zt,zt+3,'#d3d0c7');faceR(g,u1,v0,v1,zt,zt+3,'#aaa79e');
      flat(g,u0,v1-.03,u1-u0,.03,'#e2dfd6',zt+3);flat(g,u1-.03,v0,.03,v1-v0,'#e2dfd6',zt+3);};
    // 收費亭＋柵欄臂
    const booth=(S,L,u,v,d)=>S.o(d,(g,n)=>{const{P,RC,boxZ,faceL,faceR,winL,winR}=L;
      boxZ(g,u-.03,v,.16,.08,0,1,'#e0c040','#c9a82e','#9a7f1e');for(let t=u-.02;t<u+.13;t+=.04)faceL(g,v+.08,t,t+.02,0,1,'#2a2d30');
      boxZ(g,u+.01,v+.005,.09,.07,1,8,null,'#f2f4f4','#c3c8cb');
      faceL(g,v+.075,u+.02,u+.09,4,8,'#3f5f78');faceR(g,u+.1,v+.015,v+.065,4,8,'#2d4a60');
      if(n){faceL(n,v+.075,u+.025,u+.085,4,8,'#ffe6b0');faceR(n,u+.1,v+.02,v+.06,4,8,'#f3d68e');}
      boxZ(g,u,v-.005,.11,.09,9,2,'#4a7fb8','#3d6fa8','#2c5582');});
    const barrier=(S,L,u,v,len,alongV,d)=>S.t(d,(g,n)=>{const{P,RC,BL}=L;const a=P(u,v,0);RC(g,a[0]-1,a[1]-5,2,5,'#e8c23c');RC(g,a[0]-1,a[1]-5,1,1,'#3a3f44');
      const N=6;for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N;const p0=alongV?P(u,v+len*t0,4):P(u+len*t0,v,4),p1=alongV?P(u,v+len*t1,4):P(u+len*t1,v,4);BL(g,p0,p1,i%2?'#f2f2ee':'#c0392b');}
      if(n){RC(n,a[0]-1,a[1]-6,1,1,'#ff5a48');}});
    const pSign=(S,L,u,v,h=16,d)=>S.o(d!=null?d:u+v+.05,(g,n)=>{const{P,RC}=L;const p=P(u,v,0),x=Math.round(p[0]),y=Math.round(p[1]);
      RC(g,x,y-h,1,h,'#6d767c');RC(g,x-3,y-h-6,7,7,'#2f6aa8');RC(g,x-2,y-h-5,1,5,'#f2f4f4');RC(g,x-1,y-h-5,2,1,'#f2f4f4');RC(g,x+1,y-h-4,1,1,'#f2f4f4');RC(g,x-1,y-h-3,2,1,'#f2f4f4');
      if(n){RC(n,x-2,y-h-5,5,5,'#8cc0ff');RC(n,x-2,y-h-5,1,5,'#ffffff');RC(n,x-1,y-h-5,2,1,'#ffffff');RC(n,x+1,y-h-4,1,1,'#ffffff');RC(n,x-1,y-h-3,2,1,'#ffffff');}});
    // 雙頭高桿燈
    const mast2=(S,L,u,v,h=24,d,z=0)=>S.t(d!=null?d:u+v+.05,(g,n)=>{const{P,RC}=L;const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);
      RC(g,x-1,y-2,3,2,'#5d666c');RC(g,x,y-h,1,h,'#7d868c');RC(g,x-3,y-h,7,1,'#4b5358');
      RC(g,x-4,y-h+1,3,1,'#efe2b0');RC(g,x+2,y-h+1,3,1,'#efe2b0');if(n){RC(n,x-4,y-h+1,3,1,'#fff0c0');RC(n,x+2,y-h+1,3,1,'#fff0c0');}});
    // 頂層（屋頂）用的描外框車：先畫到暫存畫布，再把周圍一圈透明像素補成深色外框後合回；實色、不用淡灰
    const RPAL=['#b8433a','#e8ecee','#3d5f8a','#5d6468','#2f2f33','#d8b64a','#4f7a5a','#8a3b37'];
    const carOLf=(K,L)=>(g2,u,v,col,z)=>{const{P}=L,W=K.W,H=K.H,[tc,tx]=A.cv(W,H);L.carG(tx,u,v,false,col,z);
      const xs=[],ys=[];for(const a of[u,u+.09])for(const b of[v,v+.18])for(const zz of[z,z+6]){const p=P(a,b,zz);xs.push(p[0]);ys.push(p[1]);}
      const x0=Math.max(0,Math.floor(Math.min(...xs))-3),y0=Math.max(0,Math.floor(Math.min(...ys))-3),x1=Math.min(W,Math.ceil(Math.max(...xs))+3),y1=Math.min(H,Math.ceil(Math.max(...ys))+3),w=x1-x0,h=y1-y0;
      const im=tx.getImageData(x0,y0,w,h),a=im.data,mk=[];
      for(let i=3;i<a.length;i+=4)a[i]=a[i]>=110?255:0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3])continue;if((x+1<w&&a[i+7])||(x>0&&a[i-1])||(y+1<h&&a[i+4*w+3])||(y>0&&a[i-4*w+3]))mk.push(i);}
      for(const i of mk){a[i]=28;a[i+1]=34;a[i+2]=42;a[i+3]=255;}
      tx.putImageData(im,x0,y0);g2.drawImage(tc,x0,y0,w,h,x0,y0,w,h);};
    // 綠地（割草條紋）
    const lawn=(g,L,u0,v0,du,dv)=>{const{flat,BL,P}=L;flat(g,u0,v0,du,dv,'#76a453');for(let t=v0+.06;t<v0+dv;t+=.12)BL(g,P(u0,t),P(u0+du,t),'#6f9d4e');};

    const K20=[
      // ---------- v0 露天停車場：瀝青地坪、白色車位線、四排車位（中間一組背對背）、兩條車道；右緣出入口收費亭與柵欄；植栽島、高桿燈、前緣人行道與行道樹 ----------
      (g,ng,S,L)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,lineU,lineV,dashU,shadow,lamp,tree,bush,person,car,WHT,YEL}=L;
        lawn(g,L,0,0,2,2);
        pave(g,'a',.08,.08,1.92,1.64,2001);
        pave(g,'a',1.64,1.14,.36,.32,2002);
        pave(g,'p',0,1.78,2,.22,2003);pave(g,'p',1.94,0,.06,1.14,2004);pave(g,'p',1.94,1.46,.06,.34,2005);
        // 路緣
        lineU(g,1.72,.08,1.94,'#c9c6bd');lineU(g,1.78,0,1.94,'#b9b6ad');lineV(g,1.92,.08,1.14,'#c9c6bd');lineV(g,1.92,1.46,1.72,'#c9c6bd');
        // 植栽島（後角、雙排兩端）
        lawn(g,L,.08,.08,.26,.3);BL(g,P(.34,.08),P(.34,.38),'#c9c6bd');BL(g,P(.08,.38),P(.34,.38),'#c9c6bd');
        for(const[a,b]of[[.22,.36],[1.5,1.64]]){lawn(g,L,a,.66,b-a,.48);BL(g,P(a,.66),P(b,.66),'#c9c6bd');BL(g,P(a,1.14),P(b,1.14),'#c9c6bd');BL(g,P(a,.66),P(a,1.14),'#c9c6bd');BL(g,P(b,.66),P(b,1.14),'#c9c6bd');}
        // 車位
        const R1=stallRow(g,L,.4,1.83,.1,.37),R2=stallRow(g,L,.36,1.5,.64,.9),R3=stallRow(g,L,.36,1.5,.9,1.16),R4=stallRow(g,L,.16,1.59,1.44,1.71);
        lineU(g,.9,.36,1.5,WHT);
        // 殘障車位（藍）與車道箭頭、斑馬線
        flat(g,1.59,1.45,.12,.25,'#3d6fa8');
        arrowU(g,L,.9,.5,1,WHT);arrowU(g,L,1.3,.5,1,WHT);arrowU(g,L,.9,1.3,-1,WHT);arrowU(g,L,1.3,1.3,-1,WHT);
        for(let t=1.2;t<1.44;t+=.04)BL(g,P(1.66,t),P(1.74,t),'#e6e4dc');
        shadow(g,[['b',1.8,1.25,.1,.09,10],['p',.2,.2,14],['p',.29,.9,12],['p',1.57,.9,12],['p',.5,1.9,12],['p',1.1,1.9,12]]);
        // 停車
        parkRow(S,L,R1,.1,.37,2011,.66);parkRow(S,L,R2,.64,.9,2012,.62);parkRow(S,L,R3,.9,1.16,2013,.6);parkRow(S,L,R4,1.44,1.71,2014,.55);
        car(S,1.0,1.26,true,'#e8ecee',2.35);car(S,1.72,.48,false,'#b8433a',2.3);
        // 樹、燈、收費亭、柵欄、標誌、繳費機
        tree(S,.2,.22,.85,2);tree(S,.29,.9,.75,0);tree(S,1.57,.9,.75,2);
        for(const u of[.45,1.25])tree(S,u,1.75,.75,(u*10|0)%3,u+1.75+.1);
        for(const u of[.1,.85,1.6]){S.o(u+1.74,(g2)=>{const p=P(u,1.75),x=Math.round(p[0]),y=Math.round(p[1]);L.ell(g2,x,y-2,3,2,'#4f7f35');L.ell(g2,x-1,y-3,2,1,'#78a84c');});}
        mast2(S,L,.29,.72,26);mast2(S,L,1.57,.72,26);mast2(S,L,.9,1.76,20,2.7);
        booth(S,L,1.8,1.25,3.1);barrier(S,L,1.79,1.28,-.11,true,3.12);barrier(S,L,1.87,1.3,.13,true,3.2);
        pSign(S,L,1.97,.9,16);
        S.o(3.2,(g2,n2)=>{boxZ(g2,1.95,1.5,.04,.04,0,6,'#7d868c','#9aa3a8','#6d767c');const p=P(1.99,1.52,4);RC(g2,p[0],p[1]-1,1,2,'#52c79e');if(n2)RC(n2,p[0],p[1]-1,1,2,'#7dffd0');
          person(g2,1.97,1.62,0,'#3d5f8a');person(g2,.7,1.86,0,'#c8413a');});
        return{};
      },

      // ---------- v1 三層開放式混凝土立體停車場：樓板外露、各層車尾可見、鋼纜護欄；右後角樓梯電梯塔；頂層停車＋坡道開口；右側入口車道與收費柵欄 ----------
      (g,ng,S,L,K)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,lineU,lineV,shadow,lamp,tree,bush,person,winL,winR,rowL,rowR,clipPoly,Q,WHT}=L;
        const u0=.12,u1=1.62,v0=.12,v1=1.5,lv=3,fh=9,zt=lv*fh,CH=zt+14;
        const RL=[[.2,.55],[.2,1.18],[1.56,1.18]],carOL=carOLf(K,L);
        lawn(g,L,0,0,2,2);
        pave(g,'p',0,1.56,2,.44,2101);pave(g,'a',1.62,0,.38,1.56,2102);pave(g,'a',.06,.06,1.6,1.5,2103);
        lineV(g,1.66,.06,1.56,'#c9c6bd');lineV(g,1.94,0,1.56,'#c9c6bd');lineU(g,1.56,0,1.94,'#c9c6bd');
        for(let t=.3;t<1.5;t+=.2)BL(g,P(1.8,t),P(1.8,t+.1),'#e6e4dc');
        arrowU(g,L,1.72,1.2,-1,WHT);
        lawn(g,L,0,1.62,2,.1);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,zt+3],['b',1.4,.12,.22,.24,CH]],.26);
        // 主體
        S.o(u1+v1,(g2,n2)=>{garage(g2,n2,L,{u0,u1,v0,v1,lv,fh,seed:2111});
          // 鋼纜（+v 面：二、三層；拉在車頂高度以上，不切過車尾）
          for(let k=1;k<lv;k++){for(const dz of[6])BL(g2,P(u0,v1,k*fh+dz),P(u1,v1,k*fh+dz),'#aeb5ba');}
          // +u 面：綠色鋼格柵（二層以上，中段）
          for(let k=1;k<lv;k++){faceR(g2,u1,.46,1.06,k*fh,k*fh+fh-2,'#4d6b55');for(let t=.48;t<1.06;t+=.04)BL(g2,P(u1,t,k*fh),P(u1,t,k*fh+fh-3),'#6f8f78');BL(g2,P(u1,.46,k*fh+fh-2),P(u1,1.06,k*fh+fh-2),'#8fab96');}
          // 地面層入口（+u 面）
          faceR(g2,u1,1.0,1.4,0,fh-2,'#1c2023');
          // 頂層
          roofDeck(g2,L,{u0,u1,v0,v1,zt,seed:2112});
          // 坡道開口（頂層→二層）：開口暗、坡板向 +u 下降、欄杆
          const hu0=.34,hu1=1.0,hv0=.62,hv1=.84;const hole=Q(hu0,hv0,hu1-hu0,hv1-hv0,zt);fp(g2,hole,'#1a1d20');
          clipPoly(g2,hole,()=>{faceL(g2,hv0,hu0,hu1,zt-fh,zt,'#a9a69d');faceR(g2,hu0,hv0,hv1,zt-fh,zt,'#8a877f');
            fp(g2,[P(hu0,hv0+.02,zt),P(hu1,hv0+.02,zt-fh),P(hu1,hv1-.02,zt-fh),P(hu0,hv1-.02,zt)],'#5b5a56');
            for(let t=hu0+.1;t<hu1;t+=.1){const z=zt-fh*(t-hu0)/(hu1-hu0);BL(g2,P(t,hv0+.02,z),P(t,hv1-.02,z),'#6a6965');}
            for(let t=hu0+.15;t<hu1-.1;t+=.2){const z=zt-fh*(t-hu0)/(hu1-hu0);BL(g2,P(t,(hv0+hv1)/2,z),P(t+.06,(hv0+hv1)/2,z-1),'#e9e7df');}});
          flat(g2,hu0-.02,hv1,hu1-hu0+.04,.02,'#d6d3ca',zt+2);faceL(g2,hv1+.02,hu0-.02,hu1+.02,zt,zt+2,'#bdbab1');
          flat(g2,hu1,hv0,.02,hv1-hv0,'#d6d3ca',zt+2);faceR(g2,hu1+.02,hv0,hv1+.02,zt,zt+2,'#9d9a92');
          // 頂層車位＋車：實色、各自描深色外框；樓梯塔旁（後排 u≥1.25）不停車；離燈桿不到 2px 的車位空著
          const rs=[[.18,.4,1.25],[.92,1.16,1.5],[1.2,1.44,1.5]];for(const[a,b,e]of rs){for(let t=.3;t<=e+1e-6;t+=.13)BL(g2,P(t,a,zt),P(t,b,zt),'#dedbd2');}
          lineU(g2,.4,.3,1.21,'#dedbd2');
          const lampBox=RL.map(([u,v])=>{const p=P(u,v,zt);return[p[0]-6,p[1]-17,p[0]+5,p[1]+2];});
          const carBox=(u,v)=>{const xs=[],ys=[];for(const a of[u,u+.09])for(const b of[v,v+.18])for(const z of[zt,zt+5]){const p=P(a,b,z);xs.push(p[0]);ys.push(p[1]);}return[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];};
          const hit=(A1,B1)=>A1[0]<=B1[2]&&A1[2]>=B1[0]&&A1[1]<=B1[3]&&A1[3]>=B1[1];
          // 佔位：同一排相鄰兩格不同時停（外框才不會黏成一團）；中排只停在前排同格與右側兩格都空的位置（畫面上不疊車）
          const occ=rs.map((r,ri)=>{const o=[];let prev=false;for(let t=.3,k=0;t<r[2]-.05;t+=.13,k++){const on=!prev&&hsh(2113,ri*20+k,1)>=.42;o.push(on);prev=on;}return o;});
          occ[1]=occ[1].map((on,k)=>on&&!occ[2][k]&&!occ[2][k+1]&&!occ[2][k+2]);
          rs.forEach(([a,b],ri)=>occ[ri].forEach((on,k)=>{if(!on)return;const cu=.3+k*.13+.018,cv=(a+b)/2-.095;
            if(lampBox.some(q=>hit(q,carBox(cu,cv))))return;carOL(g2,cu,cv,RPAL[Math.floor(hsh(2113,ri*20+k,2)*RPAL.length)],zt);}));
          // 樓梯電梯塔（右後角，高出頂層）
          const cu0=1.4,cv0=.12,cu1=1.62,cv1=.36,ch=CH;
          faceR(g2,cu1,cv0,cv1,0,ch,'#b9b6ad');boxZ(g2,cu0,cv0,cu1-cu0,cv1-cv0,zt,ch-zt,'#8e9598','#d8d5cc',null);
          for(let z=3;z<ch-3;z+=fh){faceR(g2,cu1,cv0+.07,cv0+.17,z,z+6,'#4d6f88');}
          faceL(g2,cv1,cu0+.05,cu0+.12,zt+2,ch-2,'#4d6f88');
          if(n2){faceL(n2,cv1,cu0+.05,cu0+.12,zt+4,zt+10,'#ffe6b0');for(let z=3;z<ch-3;z+=fh)faceR(n2,cu1,cv0+.08,cv0+.16,z+1,z+4,'#f3d68e');}
          boxZ(g2,cu0+.03,cv0+.03,.12,.14,ch,3,'#9aa1a4','#c3c0b7','#a3a097');
          const sg=P(cu1,cv0+.12,ch-4);RC(g2,sg[0]-3,sg[1]-7,6,7,'#2f6aa8');RC(g2,sg[0]-2,sg[1]-6,1,5,'#f2f4f4');RC(g2,sg[0]-1,sg[1]-6,2,1,'#f2f4f4');RC(g2,sg[0]+1,sg[1]-5,1,1,'#f2f4f4');RC(g2,sg[0]-1,sg[1]-4,2,1,'#f2f4f4');
          if(n2)RC(n2,sg[0]-2,sg[1]-6,4,5,'#8cc0ff');
          parapetFront(g2,L,{u0,u1,v0,v1,zt});});
        // 頂層燈桿（車道兩端，背後那一欄不停車）
        for(const[u,v]of RL)mast2(S,L,u,v,14,u1+v1+.1,zt);
        // 入口收費柵欄、標誌、行道樹
        booth(S,L,1.7,1.44,3.2);barrier(S,L,1.72,1.42,-.4,true,3.25);
        pSign(S,L,1.96,.72,18,2.8);
        for(const u of[.2,.72])tree(S,u,1.78,.8,(u*10|0)%3,u+1.8+2);
        S.o(3.3,(g2)=>{person(g2,.6,1.66,0,'#3d5f8a');person(g2,1.0,1.7,0,'#c8413a');});
        return{};
      },

      // ---------- v2 兩層停車場＋頂層太陽能棚架：一層開放樓層、屋頂停車上方兩列傾斜光電板；右側外掛直坡道上屋頂；前緣電動車充電區（綠色車位、充電樁、儲能櫃） ----------
      (g,ng,S,L,K)=>{const{P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,lineU,lineV,shadow,lamp,tree,bush,person,winL,Q,WHT,CARC,carG,car}=L;const carOL=carOLf(K,L);
        const u0=.12,u1=1.66,v0=.1,v1=1.2,fh=10,zt=fh;
        lawn(g,L,0,0,2,2);
        pave(g,'a',.06,.06,1.94,1.3,2201);pave(g,'a',.06,1.36,1.94,.46,2202);pave(g,'p',0,1.82,2,.18,2203);
        lineU(g,1.8,0,2,'#c9c6bd');
        // 充電區：車頭一條淺色路緣島（充電樁立在上面）＋六格綠色車位＋白框＋閃電符號
        const EVU=[.3,.46,.62,.78,.94,1.1];
        flat(g,.3,1.355,.96,.045,'#c9c6bd');L.faceL(g,1.4,.3,1.26,0,1,'#9e9b93');
        for(const u of EVU){flat(g,u+.01,1.41,.14,.27,'#3f8f5a');BL(g,P(u,1.41),P(u,1.68),WHT);const c=P(u+.08,1.6);RC(g,c[0],c[1]-2,1,2,'#e9e7df');RC(g,c[0]-1,c[1]-1,1,1,'#e9e7df');RC(g,c[0]+1,c[1]-1,1,1,'#e9e7df');RC(g,c[0],c[1]+1,1,1,'#e9e7df');}
        BL(g,P(1.26,1.41),P(1.26,1.68),WHT);
        arrowU(g,L,1.45,1.3,1,WHT);
        shadow(g,[['b',u0,v0,u1-u0,v1-v0,zt+2],['pz',[[.2,.14,22],[1.58,.14,22],[1.58,.44,20],[.2,.44,20]]],['pz',[[.2,.7,22],[1.58,.7,22],[1.58,1.0,20],[.2,1.0,20]]],
          ['b',.07,1.39,.09,.07,8],['b',.18,1.4,.07,.06,6]],.26);
        // 外掛直坡道（右側，沿 v 由前往後爬升到屋頂）
        S.o(1.66+1.2+.01,(g2)=>{const ra=1.7,rb=1.9,va=.24,vb=1.2;
          fp(g2,[P(rb,va,zt),P(rb,vb,0),P(rb,vb,2),P(rb,va,zt+2)],'#8f8c84');
          fp(g2,[P(ra,va,zt+2),P(rb,va,zt+2),P(rb,vb,2),P(ra,vb,2)],'#7a7975');
          for(let t=va+.1;t<vb;t+=.12){const z=zt*(vb-t)/(vb-va)+2;BL(g2,P(ra+.02,t,z),P(rb-.02,t,z),'#86857f');}
          fp(g2,[P(ra,vb,0),P(rb,vb,0),P(rb,vb,2),P(ra,vb,2)],'#b9b6ad');
          BL(g2,P(rb,va,zt+5),P(rb,vb,5),'#c9ced1');BL(g2,P(ra,va,zt+5),P(ra,vb,5),'#dfe3e5');
          for(let t=va+.2;t<vb;t+=.25){const z=zt*(vb-t)/(vb-va);const a=P(rb,t,0),b=P(rb,t,z+2);RC(g2,a[0],b[1],1,a[1]-b[1],'#77746c');}});
        // 主體（一層開放樓層＋屋頂停車＋兩列光電棚）
        S.o(u1+v1,(g2,n2)=>{garage(g2,n2,L,{u0,u1,v0,v1,lv:1,fh,seed:2211,rearU:[1.25,9]});
          faceL(g2,v1,.2,1.6,fh-4,fh-3,'#3f8f5a');
          roofDeck(g2,L,{u0,u1,v0,v1,zt,seed:2212});
          for(const[a,b]of[[.16,.46],[.72,1.02]]){for(let t=.24;t<=1.58;t+=.13)BL(g2,P(t,a,zt),P(t,b,zt),'#dedbd2');}
          // 屋頂車：實色描框、同排相鄰兩格不同時停
          [[.16,.46],[.72,1.02]].forEach(([a,b],ri)=>{let prev=false;for(let t=.24,k=0;t<1.52;t+=.13,k++){const on=!prev&&hsh(2213,ri*20+k,1)>=.4;prev=on;if(on)carOL(g2,t+.018,a+.05,RPAL[Math.floor(hsh(2213,ri*20+k,2)*RPAL.length)],zt);}});
          // 光電棚：柱＋樑＋傾斜板（前低後高，朝 +v）
          for(const[a,b]of[[.14,.44],[.7,1.0]]){const m=(a+b)/2,ZA=22,ZB=20;
            for(let t=.26;t<1.58;t+=.33){const p=P(t,m,zt),q=P(t,m,ZB);RC(g2,p[0],q[1],1,p[1]-q[1],'#5d666c');RC(g2,p[0]+1,q[1]+2,1,p[1]-q[1]-2,'#3a4046');}
            const pa=.2,pb=1.58;fp(g2,[P(pa,a,ZA),P(pb,a,ZA),P(pb,b,ZB),P(pa,b,ZB)],'#2f5a86');
            for(let t=pa+.086;t<pb;t+=.086)BL(g2,P(t,a,ZA),P(t,b,ZB),'#4a79a8');
            BL(g2,P(pa,(a+b)/2,(ZA+ZB)/2),P(pb,(a+b)/2,(ZA+ZB)/2),'#4a79a8');
            fp(g2,[P(pa,b,ZB),P(pb,b,ZB),P(pb,b,ZB-1),P(pa,b,ZB-1)],'#c9ced1');
            fp(g2,[P(pb,a,ZA),P(pb,b,ZB),P(pb,b,ZB-1),P(pb,a,ZA-1)],'#6d767c');
            BL(g2,P(pa,a,ZA),P(pb,a,ZA),'#8fb4d6');}
          parapetFront(g2,L,{u0,u1,v0,v1,zt});
          // 屋頂變流器小屋
          });
        // 充電樁：每格一支、立在路緣島正中、等距；兩輛充電中的車停在完整露出的車位（第 2、5 格）
        for(const u of EVU)S.o(u+1.4+2.05,(g2,n2)=>{boxZ(g2,u+.065,1.365,.03,.025,1,6,'#f2f4f4','#e6eaec','#aeb5ba');const p=P(u+.065,1.39,6);RC(g2,p[0],p[1]-1,2,1,'#35c46a');if(n2)RC(n2,p[0],p[1]-1,2,1,'#7dffb0');});
        [[.46,'#e8ecee'],[.94,'#2e8a8c']].forEach(([u,col])=>{car(S,u+.035,1.47,false,col,u+1.47+2.3);S.t(u+1.47+2.31,(g2)=>{BL(g2,P(u+.08,1.39,4),P(u+.08,1.47,3),'#1f2326');});});
        // 儲能櫃＋箱變（移到最左端，和充電樁隔開）
        S.o(.25+1.46+2.1,(g2,n2)=>{boxZ(g2,.07,1.39,.09,.07,0,8,'#eef0f0','#f6f7f7','#c9ced1');for(let t=.09;t<.16;t+=.03)BL(g2,P(t,1.46,1),P(t,1.46,7),'#d9dde0');
          const p=P(.09,1.46,6);RC(g2,p[0],p[1],1,1,'#52c79e');if(n2)RC(n2,p[0],p[1],1,1,'#7dffd0');
          boxZ(g2,.18,1.4,.07,.06,0,6,'#7f8c85','#95a29b','#66726b');const q=P(.2,1.46,4);RC(g2,q[0],q[1]-1,2,1,'#e3b23c');});
        // 充電站標誌、行道樹、燈
        for(const u of[.12,1.62])tree(S,u,1.88,.8,(u*10|0)%3,u+1.9+2.2);
        lamp(S,.04,1.76,16,3.85);lamp(S,1.9,1.74,16,5.65,-1);
        pSign(S,L,1.96,1.3,16,3.3);
        return{};
      },
    ];
    build(20,K20);
  }catch(e){console.error('trans_d k20',e);errs.push('k20:'+(e&&e.stack||e));}

  if(errs.length)window.__trans_d_errs=errs;
});
