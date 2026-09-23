// T609 logi_d：k170 燃料儲運站／k171 天然氣儲配站（皆 3×3，畫布 208×220，錨 104,218）實驗線重畫。
// 曲面件（立式油槽、球罐、臥罐、槽車罐體、火炬筒）走「逐像素射線投射」：本作的等距就是真正的正交投影
// （水平 1 格＝45.25px、垂直 1 格＝39.19px），解析求交 → 依法線打光 → 分六階色，得到硬邊色帶；
// 槽壁旋梯、環帶、風樑、浮頂、滾梯、球罐經線梯都是在曲面座標上著色，會跟著曲面走。
// 其餘沿用 logi_a/logi_b 的分層合成：地坪直接畫、立體件各自二值化＋深色外框、細線不描邊；
// 夜圖只點白天畫出的燈具（燈頭、窗、棚下燈條、門口燈、紅色警示燈、火炬火焰），被前景擋住的燈會被擦掉。
// 光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function logi_d(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const W=208,H=220,AX=104,AY=218,SZ=3;
  const DEV={};            // 迭代用：{170:[1,2,0]}；定稿必須是 {}
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {P,hsh}=K,TOPY=AY-32*SZ;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
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
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55)=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,.5,glass);pg(g,X,Y,w,1,.5,SH(glass,36));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,'#ffe3a0');}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5)=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,'#f3d68e');}};
    const RX=r=>Math.max(1,rnd(r*45.25));
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
    // 落影（影子落向右）：['b',u0,v0,du,dv,h] 方盒／['c',u,v,r,h] 立式圓柱／['s',u,v,r,zc] 架高球
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else if(s[0]==='c'){const[,u,v,r,h,z=0]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45,z);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}
        else if(s[0]==='s'){const[,u,v,r,zc]=s,k=zc/64,p=P(u+k,v-k*.45,0);ell(sx,p[0],p[1],RX(r)+1,(RX(r)>>1)+1,C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 射線投射（曲面件）----------
    // 視線方向（朝觀者）D=(DU,DU,DZ)；地面點 O 由畫面像素反解；z 以「格」計（1 格＝ZT px）
    const ZT=39.1918,DU=.61237244,DZ=.5,A2=2*DU*DU;
    const LV=(()=>{const l=[-.34,.74,.58],m=Math.hypot(l[0],l[1],l[2]);return[l[0]/m,l[1]/m,l[2]/m];})();
    const lum=n=>n[0]*LV[0]+n[1]*LV[1]+n[2]*LV[2];
    const TI=[.8,.58,.36,.14,-.1];
    const ti=(n,b=0)=>{const l=lum(n)+b;let k=0;while(k<5&&l<=TI[k])k++;return k;};
    const tone=(pal,n,b=0,dk=0)=>pal[Math.max(0,Math.min(pal.length-1,ti(n,b)+dk))];
    // 基本形（z 以 px 輸入）
    const sph=(u,v,z,r,col)=>({k:'s',u,v,z:z/ZT,r,col,bb:[u-r,u+r,v-r,v+r,z/ZT-r,z/ZT+r]});
    const vcyl=(u,v,r,z0,z1,col,o={})=>({k:'c',u,v,r,z0:z0/ZT,z1:z1/ZT,top:o.top||'flat',rise:(o.rise||0)/ZT,deck:(o.deck||0)/ZT,rim:o.rim||0,arc:o.arc||null,col,
      bb:[u-r,u+r,v-r,v+r,z0/ZT,(z1+(o.rise||0))/ZT]});
    const capU=(u0,u1,v,z,r,col,o={})=>({k:'cu',u0,u1,v,z:z/ZT,r,cap:o.cap!==false,col,bb:[u0-r,u1+r,v-r,v+r,z/ZT-r,z/ZT+r]});
    const capV=(v0,v1,u,z,r,col,o={})=>({k:'cv',v0,v1,u,z:z/ZT,r,cap:o.cap!==false,col,bb:[u-r,u+r,v0-r,v1+r,z/ZT-r,z/ZT+r]});
    const rbox=(u0,v0,du,dv,z0,h,col)=>({k:'b',u0,u1:u0+du,v0,v1:v0+dv,z0:z0/ZT,z1:(z0+h)/ZT,col,bb:[u0,u0+du,v0,v0+dv,z0/ZT,(z0+h)/ZT]});
    const hS=(ou,ov,s)=>{const x=ou-s.u,y=ov-s.v,z=-s.z,b=DU*(x+y)+DZ*z,c=x*x+y*y+z*z-s.r*s.r,d=b*b-c;if(d<0)return null;const t=-b+Math.sqrt(d);
      return{t,n:[(x+DU*t)/s.r,(y+DU*t)/s.r,(z+DZ*t)/s.r],zp:DZ*t*ZT,part:'s'};};
    const inArc=(s,an)=>{if(!s.arc)return true;let a=an;while(a<s.arc[0])a+=2*Math.PI;while(a>s.arc[0]+2*Math.PI)a-=2*Math.PI;return a<=s.arc[1];};
    const hC=(ou,ov,s)=>{const x=ou-s.u,y=ov-s.v,r2=s.r*s.r,b=DU*(x+y),c=x*x+y*y-r2,d=b*b-A2*c;
      if(d<0)return null;const sq=Math.sqrt(d);
      if(s.top==='none'){for(const t of[(-b+sq)/A2,(-b-sq)/A2]){const z=DZ*t;if(z<s.z0||z>s.z1)continue;const px=x+DU*t,py=y+DU*t,an=Math.atan2(py,px);if(!inArc(s,an))continue;
          return{t,n:[px/s.r,py/s.r,0],part:'side',zp:z*ZT,ang:an};}return null;}
      if(s.top==='cone'||s.top==='dome'){const t0=(s.z1+s.rise)/DZ,t1=s.z1/DZ;
        for(let t=t0;t>t1;t-=.004){const a=x+DU*t,bb=y+DU*t,rho=Math.sqrt(a*a+bb*bb);if(rho>s.r)continue;const q=rho/s.r;
          const zr=s.z1+s.rise*(s.top==='cone'?1-q:Math.sqrt(Math.max(0,1-q*q)));
          if(DZ*t<=zr){let k;if(s.top==='cone')k=s.rise/s.r/(rho||1e-6);else{const den=Math.sqrt(Math.max(.02,1-q*q));k=s.rise*q/den/s.r/(rho||1e-6);}
            const gx=k*a,gy=k*bb,m=Math.hypot(gx,gy,1);return{t,n:[gx/m,gy/m,1/m],part:'roof',rho,lu:a,lv:bb,zp:DZ*t*ZT};}}}
      const tt=s.z1/DZ,tx=x+DU*tt,ty=y+DU*tt,rr=tx*tx+ty*ty;
      if(rr<=r2){const rho=Math.sqrt(rr);
        if(s.top==='open'){if(rho>=s.r-s.rim)return{t:tt,n:[0,0,1],part:'rim',rho,lu:tx,lv:ty,zp:s.z1*ZT};
          const r3=s.r-s.rim,zd=s.z1-s.deck,td=zd/DZ,dx=x+DU*td,dy=y+DU*td;
          if(dx*dx+dy*dy<=r3*r3)return{t:td,n:[0,0,1],part:'deck',rho:Math.hypot(dx,dy),lu:dx,lv:dy,zp:zd*ZT};
          const c2=x*x+y*y-r3*r3,d2=b*b-A2*c2;if(d2<0)return null;const tn=(-b-Math.sqrt(d2))/A2,ix=x+DU*tn,iy=y+DU*tn;
          return{t:tn,n:[-ix/r3,-iy/r3,0],part:'inner',zp:DZ*tn*ZT,ang:Math.atan2(iy,ix)};}
        return{t:tt,n:[0,0,1],part:'top',rho,lu:tx,lv:ty,zp:s.z1*ZT};}
      const t=(-b+sq)/A2,z=DZ*t;if(z<s.z0||z>s.z1)return null;const px=x+DU*t,py=y+DU*t;
      return{t,n:[px/s.r,py/s.r,0],part:'side',zp:z*ZT,ang:Math.atan2(py,px)};};
    const hCU=(ou,ov,s)=>{const y=ov-s.v,z=-s.z,a=DU*DU+DZ*DZ,b=DU*y+DZ*z,c=y*y+z*z-s.r*s.r,d=b*b-a*c;let best=null;
      if(d>=0){const t=(-b+Math.sqrt(d))/a,u=ou+DU*t;if(u>=s.u0&&u<=s.u1)best={t,n:[0,(y+DU*t)/s.r,(z+DZ*t)/s.r],part:'side',lu:u-s.u0,zp:DZ*t*ZT};}
      if(s.cap){for(const uc of[s.u0,s.u1]){const h=hS(ou,ov,{u:uc,v:s.v,z:s.z,r:s.r});if(!h)continue;const uu=ou+DU*h.t;
          if(((uc===s.u0&&uu<=s.u0)||(uc===s.u1&&uu>=s.u1))&&(!best||h.t>best.t)){h.part='cap';h.lu=uu-s.u0;best=h;}}}
      else{const t=(s.u1-ou)/DU,y1=y+DU*t,z1=z+DZ*t;if(y1*y1+z1*z1<=s.r*s.r&&(!best||t>best.t))best={t,n:[1,0,0],part:'end',zp:DZ*t*ZT,lu:s.u1-s.u0};}
      return best;};
    const hCV=(ou,ov,s)=>{const x=ou-s.u,z=-s.z,a=DU*DU+DZ*DZ,b=DU*x+DZ*z,c=x*x+z*z-s.r*s.r,d=b*b-a*c;let best=null;
      if(d>=0){const t=(-b+Math.sqrt(d))/a,v=ov+DU*t;if(v>=s.v0&&v<=s.v1)best={t,n:[(x+DU*t)/s.r,0,(z+DZ*t)/s.r],part:'side',lv:v-s.v0,zp:DZ*t*ZT};}
      if(s.cap){for(const vc of[s.v0,s.v1]){const h=hS(ou,ov,{u:s.u,v:vc,z:s.z,r:s.r});if(!h)continue;const vv=ov+DU*h.t;
          if(((vc===s.v0&&vv<=s.v0)||(vc===s.v1&&vv>=s.v1))&&(!best||h.t>best.t)){h.part='cap';h.lv=vv-s.v0;best=h;}}}
      else{const t=(s.v1-ov)/DU,x1=x+DU*t,z1=z+DZ*t;if(x1*x1+z1*z1<=s.r*s.r&&(!best||t>best.t))best={t,n:[0,1,0],part:'end',zp:DZ*t*ZT,lv:s.v1-s.v0};}
      return best;};
    const hB=(ou,ov,s)=>{let tn=-1e9,tf=1e9,ax=-1;
      const sl=(o,d,lo,hi,i)=>{const a=(lo-o)/d,b=(hi-o)/d;if(a>tn)tn=a;if(b<tf){tf=b;ax=i;}};
      sl(ou,DU,s.u0,s.u1,0);sl(ov,DU,s.v0,s.v1,1);sl(0,DZ,s.z0,s.z1,2);
      if(tn>tf)return null;const n=[0,0,0];n[ax]=1;return{t:tf,n,part:'box',zp:DZ*tf*ZT};};
    const HIT={s:hS,c:hC,cu:hCU,cv:hCV,b:hB};
    // 投射：逐像素取最近的交點 → col(hit) 上色；不同件之間的深度斷層在後方那側壓一道暗線（內輪廓）
    const rcast=(g,prims,o={})=>{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
      for(const p of prims){const b=p.bb;for(const u of[b[0],b[1]])for(const v of[b[2],b[3]])for(const z of[b[4],b[5]]){const q=P(u,v,z*ZT);
        if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1];}}
      x0=Math.max(0,Math.floor(x0)-1);x1=Math.min(W-1,Math.ceil(x1)+1);y0=Math.max(0,Math.floor(y0)-1);y1=Math.min(H-1,Math.ceil(y1)+1);
      const w=x1-x0+1,h=y1-y0+1;if(w<=0||h<=0)return;const T=new Float32Array(w*h).fill(-1e9),ID=new Int16Array(w*h).fill(-1),CL=new Array(w*h);
      for(let Y=y0;Y<=y1;Y++){const bq=(Y+.5-TOPY)/16;for(let X=x0;X<=x1;X++){const a=(X+.5-AX)/32,ou=(a+bq)/2,ov=(bq-a)/2;let best=null,bi=-1;
        for(let i=0;i<prims.length;i++){const hh=HIT[prims[i].k](ou,ov,prims[i]);if(hh&&(!best||hh.t>best.t)){best=hh;bi=i;}}
        if(!best||best.zp<-.05)continue;best.u=ou+DU*best.t;best.v=ov+DU*best.t;best.X=X;best.Y=Y;
        const c=prims[bi].col(best,prims[bi]);if(!c)continue;const j=(Y-y0)*w+(X-x0);T[j]=best.t;ID[j]=bi;CL[j]=c;}}
      if(o.edge!==false){const E=o.edgeT||.03,dk=o.edgeD||-34,mk=[];
        for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const j=yy*w+xx;if(ID[j]<0)continue;
          if((xx>0&&ID[j-1]>=0&&ID[j-1]!==ID[j]&&T[j-1]-T[j]>E)||(xx<w-1&&ID[j+1]>=0&&ID[j+1]!==ID[j]&&T[j+1]-T[j]>E)||
             (yy>0&&ID[j-w]>=0&&ID[j-w]!==ID[j]&&T[j-w]-T[j]>E)||(yy<h-1&&ID[j+w]>=0&&ID[j+w]!==ID[j]&&T[j+w]-T[j]>E))mk.push(j);}
        for(const j of mk)CL[j]=SH(CL[j],dk);}
      for(let yy=0;yy<h;yy++){let xx=0;while(xx<w){const j=yy*w+xx;if(ID[j]<0){xx++;continue;}const c=CL[j];let e=xx+1;while(e<w&&ID[yy*w+e]>=0&&CL[yy*w+e]===c)e++;
        g.fillStyle=c;g.fillRect(x0+xx,y0+yy,e-xx,1);xx=e;}}};
    // 單色件（依面向取頂／左／右色）
    const flatCol=(top,left,right)=>(h)=>h.n[2]>.5?top:h.n[1]>.5?left:h.n[0]>.5?right:tone([left,left,top,right,right,SH(right,-14)],h.n);
    const palCol=(pal,b=0)=>(h)=>tone(pal,h.n,b);

    // ---------- 色票 ----------
    const TW=['#fbfbf8','#eff0ec','#dfe1dd','#c8cbc8','#adb2b1','#929899'];      // 白色槽壁
    const TSV=['#e4e7e8','#d2d6d8','#bec3c6','#a6acb0','#8d9498','#757c81'];     // 鋁銀
    const TIN=['#a9adab','#9da1a0','#909595','#838889','#767b7d','#6a6f71'];     // 槽內壁
    const TRF=['#eeeeea','#e0e1dd','#cfd1cd','#b9bcb9','#a1a5a3','#8a8f8e'];     // 固定頂
    const TK=['#f4f6f6','#e2e6e8','#cfd4d7','#b6bcc0','#9aa1a6','#80878c'];      // 槽車罐體
    const STL=['#b9c0c4','#a9b0b4','#98a0a4','#879094','#788085','#6a7277'];     // 鋼構灰
    const CON=['#d8d5cc','#cbc8be','#bdbab0','#aeaba1','#9f9c93','#908d84'];     // 混凝土
    const RED=['#e27a6c','#d4675a','#c2574b','#ad4a3f','#963f36','#7f352d'];
    const DK=['#6d7174','#5f6366','#52565a','#46494d','#3b3e41','#303336'];      // 深色（鐵路槽車）

    // ---------- 地坪 ----------
    const MATS={
      a:{t:['#6f6d69','#6a6864','#75736e'],j:null,s:.125,p:.7},         // 瀝青
      k:{t:['#aaa598','#a39e92','#b2ada0'],j:null,s:.0625,p:.55},       // 碎石
      d:{t:['#9c978a','#958f83','#a39e91'],j:null,s:.0625,p:.5},        // 防溢堤內（壓實碎石）
      c:{t:['#bdb9ae','#b7b3a8','#c3bfb4'],j:'#aba79c',s:.25,p:.6},     // 混凝土
      p:{t:['#c6c3b9','#c0bdb3','#ccc9bf'],j:'#b3b0a6',s:.125,p:.65},   // 設備基座混凝土
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.7},         // 草
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*14);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,'#63615d');}}
      if(m==='k'||m==='d'){for(let i=0;i<rnd(du*dv*10);i++){const p=P(u0+.03+hsh(seed,i,41)*(du-.06),v0+.03+hsh(seed,i,42)*(dv-.06));RC(g,p[0],p[1],1,1,hsh(seed,i,43)<.5?SH(M.t[0],-16):SH(M.t[0],14));}}};
    const lineU=(g,v,u0,u1,c,z=0)=>BL(g,P(u0,v,z),P(u1,v,z),c);
    const lineV=(g,u,v0,v1,c,z=0)=>BL(g,P(u,v0,z),P(u,v1,z),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    // 地面管線（枕木上）：沿 u／沿 v，兩像素（上亮下暗）
    const pipeU=(g,v,u0,u1,c='#a7aeb2',z=2)=>{BL(g,P(u0,v,z),P(u1,v,z),SH(c,26));BL(g,P(u0,v,z-1),P(u1,v,z-1),SH(c,-34));};
    const pipeV=(g,u,v0,v1,c='#a7aeb2',z=2)=>{BL(g,P(u,v0,z),P(u,v1,z),SH(c,18));BL(g,P(u,v0,z-1),P(u,v1,z-1),SH(c,-40));};
    const sleepersU=(g,v,u0,u1,w=.1)=>{for(let u=u0+.05;u<u1;u+=.16)BL(g,P(u,v-w/2),P(u,v+w/2),'#8a857a');};
    const sleepersV=(g,u,v0,v1,w=.1)=>{for(let v=v0+.05;v<v1;v+=.16)BL(g,P(u-w/2,v),P(u+w/2,v),'#8a857a');};
    // 圍籬（後側在地面層、前側最後畫）；gaps＝[[t0,t1],…]
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),L=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(3,Math.round(L/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};
    // 圍籬警示牌（掛在前側圍籬上）：kind 'r' 紅白禁火、'y' 黃黑危險
    const signL=(g,u,v,kind='r')=>{const p=P(u,v,6);if(kind==='r'){RC(g,p[0]-2,p[1]-1,5,4,'#f1efe8');RC(g,p[0]-1,p[1],3,2,'#c0392b');}else{RC(g,p[0]-2,p[1]-1,5,4,'#e8c23a');RC(g,p[0],p[1],1,2,'#2b2b2b');}};
    // 路燈（細桿）：夜裡只亮燈頭
    const lamp=(S,u,v,h=18,d)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const mast=(S,u,v,h=34,d)=>S.o(d!=null?d:u+v+.05,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');RC(g,x+1,y-h+2,1,h-4,'#80878c');
      RC(g,x-2,y-h-2,5,2,'#5b6166');RC(g,x-2,y-h-2,5,1,'#9aa1a6');RC(g,x-2,y-h,5,1,'#e9e2c4');
      if(n){RC(n,x-2,y-h,5,1,'#fff2c8');RC(n,x-1,y-h+1,3,1,'rgba(255,232,170,.5)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const car=(S,u,v,alongU,col)=>S.o(u+v+.1,(g)=>{const du=alongU?.15:.08,dv=alongU?.08:.15;
      boxZ(g,u,v,du,dv,1,2,col,SH(col,20),SH(col,-40));boxZ(g,u+(alongU?.04:.01),v+(alongU?.01:.04),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa3bb','#5a7d94');});
    // 平頂建築（控制室／泵房）：fl 層、窗列、入口雨遮、屋頂空調
    const flatB=(g,u0,v0,du,dv,h,wl,wr,roof)=>{boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.03,v0+.03,du-.06,dv-.06,roof,h);
      BL(g,P(u0+.03,v0+.03,h),P(u0+du-.03,v0+.03,h),SH(roof,-20));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v0+dv-.03,h),SH(roof,-14));BL(g,P(u0,v0+dv,h),P(u0+du,v0+dv,h),SH(wl,18));};
    const office=(S,u0,v0,du,dv,fl,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const fh=7,h=fl*fh+3,wl=o.wl||'#e7e3d9',wr=o.wr||'#bdb8ad',gl=o.gl||'#4b7394';
      flatB(g,u0,v0,du,dv,h,wl,wr,o.roof||'#8d9498');
      for(let f=0;f<fl;f++){rowL(g,n,u0+.03,u0+du-.03,v0+dv,3+f*fh,4,3,2,gl,seed+f,.6);rowR(g,n,u0+du,v0+.03,v0+dv-.03,3+f*fh,3,3,2,gl,seed+f*7,.5);}
      if(o.band)faceL(g,v0+dv,u0,u0+du,h-2,h-1,o.band);
      const um=u0+du*(o.door||.5);boxZ(g,um-.08,v0+dv,.16,.06,6,1,'#eef0f1','#f6f7f8','#b8bfc3');winL(g,um-.04,v0+dv,0,3,6,'#2f4c63');if(n)winL(n,um-.04,v0+dv,0,3,6,'#ffe6a8');
      const lp=P(um,v0+dv+.06,7);RC(g,lp[0]-1,lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0]-1,lp[1],2,1,'#ffe6a0');
      boxZ(g,u0+du*.2,v0+dv*.25,.12,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');boxZ(g,u0+du*.6,v0+dv*.3,.09,.09,h,2,'#b9c0c4','#ced4d7','#9aa2a6');});
    // 小工房（泵房、消防泵房、配電室）：平頂＋捲門＋百葉
    const hut=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const wl=o.wl||'#dcd8cc',wr=o.wr||'#b3aea2',roof=o.roof||'#7d868b';
      flatB(g,u0,v0,du,dv,h,wl,wr,roof);
      if(o.door){const t=u0+du*o.door;winL(g,t,v0+dv,0,6,Math.min(8,h-2),o.doorC||'#8a9296');for(let z=1;z<Math.min(8,h-2);z+=2)winL(g,t,v0+dv,z,6,1,SH(o.doorC||'#8a9296',-16));}
      if(o.louver)for(let z=3;z<h-2;z+=2)winR(g,u0+du,v0+dv*.35,z,4,1,SH(wr,-22));
      if(o.win){winL(g,u0+du*.14,v0+dv,h-7,3,3,'#4b7394');if(n)winL(n,u0+du*.14,v0+dv,h-7,3,3,'#ffe3a0');}
      if(o.lampOver){const lp=P(u0+du*o.door+.1,v0+dv,Math.min(8,h-2)+2);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');}
      if(o.sign){const s=P(u0+du*.8,v0+dv,h-5);RC(g,s[0],s[1]-2,4,3,'#c0392b');RC(g,s[0]+1,s[1]-1,2,1,'#f2eee6');}
      if(o.ac)boxZ(g,u0+du*.55,v0+dv*.3,.1,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');});

    // ---------- 油槽 ----------
    // 立式圓柱儲槽：roof 'open'（外浮頂：頂緣＋內壁＋浮盤＋滾梯）／'cone'（固定錐頂）／'dome'
    // o.stair=[a0,a1]＝旋梯自地面角 a0 繞到槽頂角 a1（弧度；+u＝0、+v＝π/2，看得見的是 −π/4..3π/4）
    // 旋梯色：踏階亮／踏階暗（交錯）、扶手（比槽壁亮一截，暗面更醒目）、立柱
    const STA=['#bfc6ca','#b1b9bd','#a3abb0','#959da2','#889095','#7b8388'],STB=['#6c7479','#636b70','#5a6267','#51595e','#495055','#41484d'];
    const STR=['#f6f8f8','#f2f5f6','#eef1f2','#e6eaec','#dde2e4','#d2d8db'];
    const tankMat=(o)=>(h)=>{const pal=o.pal||TW,H=o.h;
      if(h.part==='side'){const z=h.zp;
        // 旋梯：2px 踏階帶（沿弧長每 2px 交錯深淺）＋上方 1px 扶手（中間 1px 露牆，每 4px 一根立柱）
        if(o.stair){const[a0,a1]=o.stair,f=(h.ang-a0)/(a1-a0);
          // 由上而下：1px 亮扶手／1px 扶手落影／立柱間露牆／1px 亮踏面＋1px 暗踢面（按 2px 一級量化成鋸齒）／1px 梯身落在槽壁上的影
          // 亮扶手在白槽受光面會跟牆糊在一起，所以下面一定壓一道落影，兩者成對才讀得出「凸出來的欄杆」
          if(f>=-.03&&f<=1){const zs=Math.max(0,Math.min(H,f*H)),s=(h.ang-a0)*o.r*45.25,zq=Math.min(H,Math.floor(zs/2)*2+2),dz=z-zq,dr=z-(zs+3),k0=ti(h.n);
            if(dz>=-2&&dz<-1)return tone(STB,h.n,-.06);
            if(dz>=-1&&dz<0)return tone(STA,h.n,.2);
            if(dz>=-3&&dz<-2&&z>=1)return (o.pal||TW)[Math.min(5,k0+2)];
            if(z<H+.5){
              if(dr>=0&&dr<1)return k0<=1?'#ffffff':tone(STR,h.n,.1);
              if(dr>=-1&&dr<0)return k0<=1?'#9aa3a8':tone(STB,h.n,.12);
              if(dz>=0&&dr<-1&&(Math.floor(s)%4===0))return tone(STB,h.n,.1);}}}
        let k=ti(h.n);
        if(o.band&&z>=o.band[0]&&z<o.band[1])return tone(o.band[2],h.n);
        if(z>H-1.4)k=Math.max(0,k-1);else if(z>H-3)k=Math.min(5,k+1);
        else if(o.courses&&z>1.5){const cz=H/o.courses;if(((z%cz)+cz)%cz<.9)k=Math.min(5,k+1);}
        if(z<1.4)k=Math.min(5,k+1);
        if(o.logo&&z>o.logo[0]&&z<o.logo[1]&&Math.abs(h.ang-o.logo[2])<o.logo[3])return tone(o.logo[4],h.n);
        return pal[k];}
      if(h.part==='rim')return pal[1];
      if(h.part==='inner'){const k=ti(h.n);return TIN[Math.min(5,k)];}
      if(h.part==='deck'){const r3=o.r-.02,q=h.rho/r3;
        if(q>.93)return '#5f6567';
        // 滾梯：從旋梯頂端的槽緣斜下到浮盤中心
        if(o.stair){const a=o.stair[1],ex=Math.cos(a)*r3*.9,ey=Math.sin(a)*r3*.9,px=h.lu,py=h.lv,L2=ex*ex+ey*ey,t=Math.max(0,Math.min(1,(px*ex+py*ey)/L2)),dx=px-ex*t,dy=py-ey*t;
          if(t>.25&&dx*dx+dy*dy<.00022)return '#4e5457';}
        if(q<.1)return '#6f7577';
        if(q>.72)return q>.76?'#b4b9b7':'#8c9290';
        const s=(Math.atan2(h.lv,h.lu)+Math.PI)/(Math.PI/4);if(Math.abs(s-Math.round(s))<.05&&q>.2)return '#99a09e';
        return '#a6acaa';}
      if(h.part==='roof'||h.part==='top'){const r=o.roofPal||TRF;
        // 錐頂：簷口一圈暗線、依法線分明暗（亮面 +v、暗面 +u）、每 45° 一道淡板縫
        if(h.part==='roof'&&o.cone){const q=h.rho/o.r;if(q>.94)return r[4];
          const an=Math.atan2(h.lv,h.lu),sg=an/(Math.PI/4);if(q>.25&&Math.abs(sg-Math.round(sg))<.035)return SH(tone(r,h.n,.02),-14);
          return tone(r,h.n,-.04);}
        if(h.part==='roof'&&h.rho<o.r*.12)return r[3];return tone(r,h.n,.05);}
      return pal[2];};
    const tank=(S,u,v,r,h,o={})=>S.o(o.d!=null?o.d:u+v,(g,n)=>{const roof=o.roof||'open';
      const rise=o.rise||(roof==='cone'?Math.max(4,rnd(r*22)):roof==='dome'?Math.max(3,rnd(r*14)):0);
      const mat=tankMat({pal:o.pal,h,r,stair:o.stair,band:o.band,courses:o.courses!=null?o.courses:5,roofPal:o.roofPal,logo:o.logo,cone:roof==='cone'});
      const prims=[vcyl(u,v,r,0,h,mat,{top:roof,rise,deck:o.deck||Math.max(3,rnd(h*.16)),rim:.02})];
      // 頂部護欄：旋梯頂的量油平台一段弧（淺鋼色）
      if(o.stair){const a=o.stair[1];prims.push(vcyl(u,v,r+.012,h+2,h+3,(hh)=>tone(['#d9dee0','#ccd2d5','#bdc4c8','#aeb6ba','#a0a8ad','#939ba0'],hh.n),{top:'none',arc:[a-.55,a+.35]}));}
      // 錐頂透氣帽：短管＋較寬的帽蓋
      if(roof==='cone'){prims.push(vcyl(u,v,.026,h+rise-2,h+rise+2,palCol(STL,.1),{top:'flat'}));prims.push(vcyl(u,v,.046,h+rise+2,h+rise+3.4,palCol(['#9aa2a7','#8c9499','#7f878c','#737b80','#687075','#5d656a'],.2),{top:'flat'}));}
      rcast(g,prims,{edge:false});
      // 梯頂平台：旋梯頂端接到槽頂的小平台（格柵＋外側扶手）
      if(o.stair){const a=o.stair[1],c=Math.cos(a),s=Math.sin(a),pu=u+c*(r+.03),pv=v+s*(r+.03),w=.035;
        const q=[P(pu-w,pv-w,h),P(pu+w,pv-w,h),P(pu+w,pv+w,h),P(pu-w,pv+w,h)];fp(g,q,'#9aa2a6');BL(g,[q[3][0],q[3][1]+1],[q[2][0],q[2][1]+1],'#6c7479');
        const r0=P(pu-w,pv+w,h+3),r1=P(pu+w,pv+w,h+3),r2=P(pu+w,pv-w,h+3);BL(g,r0,r1,'#eef1f2');BL(g,r1,r2,'#dfe4e6');
        for(const e of[r0,r1])RC(g,e[0],e[1]+1,1,2,'#7b8388');}
      if(o.redLamp){const p=P(u+Math.cos(o.stair?o.stair[1]:1.2)*r,v+Math.sin(o.stair?o.stair[1]:1.2)*r,h+4);RC(g,p[0],p[1],1,1,'#d0392c');if(n)RC(n,p[0],p[1],1,1,'#ff5a48');}});
    // 防溢堤：堤內壓實碎石；後側兩道牆一件、前側兩道牆切段（段縫＝伸縮縫）
    const WALL=['#dedace','#cfcbbf','#aaa699'];
    const bund=(S,g,u0,v0,du,dv,h=5,seed=1,o={})=>{const u1=u0+du,v1=v0+dv,t=.045;
      pave(g,'d',u0,v0,du,dv,seed);
      // 堤內側的排水溝（沿牆腳一圈暗線）
      lineU(g,v0+t+.03,u0+t,u1-t,'#857f72');lineV(g,u0+t+.03,v0+t,v1-t,'#857f72');lineU(g,v1-t-.03,u0+t,u1-t,'#8b8578');lineV(g,u1-t-.03,v0+t,v1-t,'#8b8578');
      S.o(u0+v0,(x)=>{boxZ(x,u0,v0,du,t,0,h,...WALL);boxZ(x,u0,v0,t,dv,0,h,...WALL);});
      const n1=Math.max(1,Math.ceil(du/.3));for(let i=0;i<n1;i++){const a=u0+du*i/n1,b=u0+du*(i+1)/n1;S.o((a+b)/2+v1+.02,(x)=>boxZ(x,a,v1-t,b-a,t,0,h,...WALL));}
      const n2=Math.max(1,Math.ceil(dv/.3));for(let i=0;i<n2;i++){const a=v0+dv*i/n2,b=v0+dv*(i+1)/n2;S.o(u1+(a+b)/2+.02,(x)=>boxZ(x,u1-t,a,t,b-a,0,h,...WALL));}
      // 跨堤踏階（前牆）
      if(o.steps)for(const [ax,s] of o.steps){S.t(ax==='v'?s+v1+.08:u1+s+.08,(x)=>{for(let k=0;k<3;k++){if(ax==='v'){const p=P(s,v1+.02+k*.03,h-k*2);RC(x,p[0]-2,p[1]-1,5,1,'#9c988c');RC(x,p[0]-2,p[1],5,1,'#77736a');}
        else{const p=P(u1+.02+k*.03,s,h-k*2);RC(x,p[0]-2,p[1]-1,5,1,'#9c988c');RC(x,p[0]-2,p[1],5,1,'#77736a');}}});}};
    // 堤內隔堤（低矮 2px，直接畫在地面層）
    const dikeU=(g,v,u0,u1)=>boxZ(g,u0,v-.02,u1-u0,.04,0,2,'#d3cfc3','#c3bfb3','#a29e92');
    const dikeV=(g,u,v0,v1)=>boxZ(g,u-.02,v0,.04,v1-v0,0,2,'#d3cfc3','#c3bfb3','#a29e92');

    // ---------- 車輛 ----------
    // 油罐車：ax 'v'（車頭朝 +v）／'u'（車頭朝 +u）；罐體走射線投射
    const tankMatCap=(pal,stripe)=>(h)=>{if(stripe&&h.part==='side'){const m=h.n[2];if(m>-.28&&m<.08)return tone(stripe,h.n);}return tone(pal,h.n,.04);};
    const ttruck=(S,u,v,ax,cab,o={})=>S.o(o.d!=null?o.d:(ax==='v'?u+.05+v+.3:u+.3+v+.05),(g,n)=>{const L=.46,Wd=.09,pal=o.pal||TK,st=o.stripe||null;
      if(ax==='v'){boxZ(g,u,v,Wd,L-.02,1,2,'#3d4145','#4a4e52','#2f3235');
        for(const t of[.05,.11,.33,.4]){const p=P(u+Wd,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1e2023');}
        rcast(g,[capV(v+.05,v+L-.2,u+Wd/2,6,.05,tankMatCap(pal,st))],{edge:false});
        const hb=P(u+Wd/2,v+L-.17,10);RC(g,hb[0]-1,hb[1],2,1,'#5d6468');
        boxZ(g,u-.005,v+L-.13,Wd+.01,.12,1,8,SH(cab,26),cab,SH(cab,-46));faceL(g,v+L-.01,u+.012,u+Wd-.008,5,8,'#34506a');
        if(n){const a=P(u+.012,v+L-.01,2),b=P(u+Wd-.012,v+L-.01,2);RC(n,a[0],a[1],1,1,'#fff3c8');RC(n,b[0]-1,b[1],1,1,'#fff3c8');}}
      else{boxZ(g,u,v,L-.02,Wd,1,2,'#3d4145','#4a4e52','#2f3235');
        for(const t of[.05,.11,.33,.4]){const p=P(u+t,v+Wd,0);RC(g,p[0],p[1]-2,2,2,'#1e2023');}
        rcast(g,[capU(u+.05,u+L-.2,v+Wd/2,6,.05,tankMatCap(pal,st))],{edge:false});
        const hb=P(u+L-.17,v+Wd/2,10);RC(g,hb[0]-1,hb[1],2,1,'#5d6468');
        boxZ(g,u+L-.13,v-.005,.12,Wd+.01,1,8,SH(cab,26),cab,SH(cab,-46));faceR(g,u+L-.01,v+.012,v+Wd-.008,5,8,'#2c465c');
        if(n){const a=P(u+L-.01,v+.012,2),b=P(u+L-.01,v+Wd-.012,2);RC(n,a[0],a[1],1,1,'#fff3c8');RC(n,b[0],b[1],1,1,'#fff3c8');}}});
    // 鐵路：道碴床（沿 v；兩肩較暗、碎石點狀材質）＋木枕＋兩條銀色鋼軌（軌距 ±GA）
    const GA=.06;
    const trackV=(g,u,v0,v1,seed=1)=>{
      flat(g,u-.16,v0,.32,v1-v0,'#716d66');flat(g,u-.125,v0,.25,v1-v0,'#88847c');
      const n=rnd((v1-v0)*150);for(let i=0;i<n;i++){const p=P(u-.15+hsh(seed,i,51)*.3,v0+.01+hsh(seed,i,52)*(v1-v0-.02)),q=hsh(seed,i,53);
        RC(g,p[0],p[1],1,1,q<.36?'#aaa59b':q<.74?'#5f5b55':'#c2bdb2');}
      lineV(g,u+.16,v0,v1,'#5c5852');lineV(g,u-.16,v0,v1,'#98938a');
      // 木枕：每 .09 格一根（1px 深木色、兩端各一點亮），枕木之間露出道碴
      for(let v=v0+.04;v<v1-.01;v+=.09){BL(g,P(u-.1,v),P(u+.1,v),'#5e5044');const e=P(u-.1,v);RC(g,e[0],e[1],1,1,'#7d6e60');}
      for(const k of[-GA,GA]){lineV(g,u+k,v0,v1,'#3d4246');lineV(g,u+k,v0,v1,'#e8ecee',1);}};
    // 油罐車廂：罐身射線投射（頂上受光帶）、中央人孔蓋＋小平台、窄底架、兩端轉向架（輪對壓在 +u 側鋼軌上）、車鉤、端梯、危險品標牌
    const RT={silver:['#e6e9ea','#cfd4d7','#b8bec2','#a2a9ad','#8d9498','#7a8185'],black:['#a3a8ab','#80858a','#62676b','#515559','#43474b','#373a3e'],
      rust:['#d39a82','#bd7f68','#a66a55','#8f5846','#7a4a3b','#663e32']};
    const railTank=(S,u,v,L=.48,o={})=>S.o(o.d!=null?o.d:u+v+L,(g,n)=>{
      // 罐身中心抬到 z=9：罐底與鋼軌之間留出 3–4px，轉向架、車輪、車鉤和兩轉向架之間的道碴才看得見
      const pal=o.pal||RT.silver,r=.08,zc=9;
      boxZ(g,u-.018,v+.05,.036,L-.1,4,1,'#44484b','#55595c','#303336');                 // 中梁（細）
      for(const t of[.09,L-.09]){boxZ(g,u-.05,v+t-.06,.1,.12,1,3,'#3a3e41','#4f5457','#2b2e30');
        const sp=P(u+.05,v+t,3);RC(g,sp[0]-2,sp[1]-1,4,1,'#6a7074');                       // 側架上緣受光
        for(const w of[-.036,.036]){const p=P(u+GA+.004,v+t+w,1);RC(g,p[0]-1,p[1]-2,3,3,'#1c1e20');RC(g,p[0],p[1]-1,1,1,'#b4bbbf');}}
      for(const e of[v+.012,v+L-.032]){boxZ(g,u-.012,e,.024,.02,4,2,'#2f3235','#3d4043','#26282a');}
      rcast(g,[capV(v+.04,v+L-.04,u,zc,r,(h)=>{if(h.part==='side'&&Math.abs(h.lv-(L-.08)/2)<.008)return tone(pal,h.n,-.12);
          if(h.part==='side'&&h.n[2]>.62&&h.n[2]<.8)return tone(pal,h.n,.3);                 // 罐頂受光帶
          return tone(pal,h.n,.12);}),
        vcyl(u,v+L/2,.032,zc+2,zc+5.5,palCol(pal,.24),{top:'flat'})],{edge:false});
      const pw=P(u-.055,v+L/2+.055,zc+4),pe=P(u+.055,v+L/2+.055,zc+4);BL(g,pw,pe,'#dfe4e6');
      const ld=[P(u+.05,v+L-.035,4),P(u+.05,v+L-.035,zc+2)];BL(g,ld[0],ld[1],'#c3cacd');
      const m=P(u+.075,v+L*.3,zc-1);RC(g,m[0],m[1]-1,2,2,o.mark||'#e0892c');RC(g,m[0],m[1]-1,1,1,'#f3b25a');});
    // 淺色鋼梯：自平台端（z0）沿 ax 往 dir 方向下到地面；踏階交錯深淺、外側斜樑＋1px 亮色扶手
    // 側樑（近側）用中灰，讓淺色踏階和亮扶手在淺色地坪上也跳得出來
    const steelStair=(x,ax,u,v,dir,len,z0,w=.08)=>{const at=(f,o,z)=>ax==='v'?P(u+o,v+dir*len*f,z):P(u+dir*len*f,v+o,z),n=Math.max(3,Math.round(z0/2));
      BL(x,at(0,-w/2,z0),at(1,-w/2,0),'#7b8388');
      for(let k=0;k<n;k++){const f=(k+.5)/n,z=Math.max(0,rnd(z0*(1-f))),a=at(f,-w/2,z),b=at(f,w/2,z);BL(x,a,b,k%2?'#d3d9dc':'#eef1f2');BL(x,[a[0],a[1]+1],[b[0],b[1]+1],'#5f676c');}
      BL(x,at(0,w/2,z0),at(1,w/2,0),'#737b80');BL(x,at(0,w/2,z0+4),at(1,w/2,4),'#e8c84e');
      for(const f of[0,.34,.67,1]){const zz=Math.max(0,rnd(z0*(1-f))),a=at(f,w/2,zz),b=at(f,w/2,zz+4);BL(x,a,b,'#b8982c');}};

    // 裝卸棧台懸臂雨棚：頂面沿長軸的壓型鋼板縫、彩色封簷、封簷下緣燈條（夜裡只亮燈條）
    const canopy=(S,u0,v0,u1,v1,z,col,ax,d)=>S.o(d,(x,n)=>{
      boxZ(x,u0,v0,u1-u0,v1-v0,z,3,'#e6e9e8','#f2f3f2','#c2c8cb');
      faceL(x,v1,u0,u1,z,z+2,col);faceR(x,u1,v0,v1,z,z+2,SH(col,-38));
      flat(x,u0+.03,v0+.03,u1-u0-.06,v1-v0-.06,'#dde1e1',z+3);
      if(ax==='v'){for(let u=u0+.07;u<u1-.04;u+=.07)BL(x,P(u,v0+.03,z+3),P(u,v1-.03,z+3),'#cdd2d3');}
      else{for(let v=v0+.07;v<v1-.04;v+=.07)BL(x,P(u0+.03,v,z+3),P(u1-.03,v,z+3),'#cdd2d3');}
      BL(x,P(u0,v1,z+3),P(u1,v1,z+3),'#fbfbfa');
      const nl=Math.max(2,Math.round((u1-u0)/.15));for(let k=0;k<nl;k++){const t=u0+(u1-u0)*(k+.5)/nl,p=P(t,v1,z);RC(x,p[0]-1,p[1],2,1,'#f4eccb');if(n)RC(n,p[0]-1,p[1],2,1,'#fff2cc');}
      const nr=Math.max(2,Math.round((v1-v0)/.15));for(let k=0;k<nr;k++){const t=v0+(v1-v0)*(k+.5)/nr,p=P(u1,t,z);RC(x,p[0]-1,p[1],2,1,'#e8dfbe');if(n)RC(n,p[0]-1,p[1],2,1,'#fff2cc');}});
    // 圍堰矮牆（2px，地面層）
    const curb=(g,u0,v0,du,dv,c=['#d6d2c6','#c6c2b6','#a4a094'])=>{const t=.035;boxZ(g,u0,v0,du,t,0,2,...c);boxZ(g,u0,v0,t,dv,0,2,...c);boxZ(g,u0,v0+dv-t,du,t,0,2,...c);boxZ(g,u0+du-t,v0,t,dv,0,2,...c);};
    // 黃黑警示帶（地面，沿 u／沿 v）
    const hazU=(g,v,u0,u1)=>{let k=0;for(let u=u0;u<u1-.01;u+=.04,k++)BL(g,P(u,v),P(Math.min(u1,u+.04),v),k%2?'#2b2b2b':'#e3bf3a');};
    const hazV=(g,u,v0,v1)=>{let k=0;for(let v=v0;v<v1-.01;v+=.04,k++)BL(g,P(u,v),P(u,Math.min(v1,v+.04)),k%2?'#2b2b2b':'#e3bf3a');};
    // 高架管架（細線層）：沿 u／沿 v；pipes＝各管顏色（沿橫向錯開）；posts 每 .3 格一座 T 型支架
    const prack=(S,ax,c0,a0,a1,hz,pipes,d)=>S.t(d,(x)=>{const pt=(a,o,z)=>ax==='u'?P(a,c0+o,z):P(c0+o,a,z);const w=(pipes.length-1)*.045/2+.04;
      const n=Math.max(1,Math.round((a1-a0)/.3));
      for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;for(const o of[-w,w]){const p=pt(a,o,0);RC(x,p[0],p[1]-hz,1,hz,'#5f686d');RC(x,p[0]+1,p[1]-hz+1,1,hz-1,'#8e979c');}
        BL(x,pt(a,-w,hz),pt(a,w,hz),'#4f575c');}
      pipes.forEach((c,k)=>{const o=-w+.04+k*.045;BL(x,pt(a0,o,hz+2),pt(a1,o,hz+2),SH(c,24));BL(x,pt(a0,o,hz+1),pt(a1,o,hz+1),SH(c,-46));});});
    // 消防水砲（紅柱＋砲管）
    const fireMon=(S,u,v)=>S.o(u+v+.02,(x)=>{const p=P(u,v);RC(x,p[0]-1,p[1]-6,2,6,'#c0392b');RC(x,p[0]+1,p[1]-5,1,5,'#8f2a20');RC(x,p[0]-2,p[1]-1,5,1,'#8f2a20');RC(x,p[0],p[1]-8,3,2,'#d9533f');RC(x,p[0]+3,p[1]-8,1,1,'#3b3f42');});
    // 風向袋（氣體站的招牌小物）
    const windsock=(S,u,v,h=18)=>S.t(u+v+.05,(x)=>{const p=P(u,v),X=rnd(p[0]),Y=rnd(p[1]);RC(x,X,Y-h,1,h,'#6d767b');RC(x,X+1,Y-h+1,1,h-1,'#9aa3a8');
      const cs=['#e8742a','#f2efe8','#e8742a','#f2efe8','#e8742a'];cs.forEach((c,i)=>{RC(x,X+1+i*2,Y-h+Math.floor(i/2),2,3-(i>2?1:0),c);});});
    // 球形儲槽：一圈支柱（下段防火混凝土）、X 撐、赤道環形走道＋護欄、經線梯直上頂部平台、外側斜梯落地
    const sphereTank=(S,u,v,r,zc,o={})=>S.o(o.d!=null?o.d:u+v,(g,nn)=>{const n=o.legs||8,lr=.024,lR=r*.96,pal=o.pal||TW,top=zc+r*ZT,st=o.stair!=null?o.stair:1.2;
      const legs=[];for(let i=0;i<n;i++){const a=(i+.5)*2*Math.PI/n;legs.push([u+Math.cos(a)*lR,v+Math.sin(a)*lR]);}
      const front=a=>{let d=a-Math.PI/4;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)<Math.PI/2;};
      const brace=(i)=>{const a=legs[i],b=legs[(i+1)%n];BL(g,P(a[0],a[1],3),P(b[0],b[1],zc-6),'#7d858a');BL(g,P(b[0],b[1],3),P(a[0],a[1],zc-6),'#7d858a');BL(g,P(a[0],a[1],3),P(b[0],b[1],3),'#6c7479');};
      for(let i=0;i<n;i++)if(!front((i+1)*2*Math.PI/n))brace(i);
      const sm=(h)=>{const nz=h.n[2],sn=Math.sqrt(Math.max(0,1-nz*nz)),az=Math.atan2(h.n[1],h.n[0]);
        if(nz>.03){let d=az-st;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const w=Math.abs(d)*r*sn;
          if(w<.018)return (rnd(h.zp)%2)?'#5c6368':'#737b80';if(w<.03)return tone(['#b0b7ba','#a3aaae','#969ea2','#899195','#7c8488','#70787c'],h.n);}
        if(o.band&&h.zp>zc+o.band[0]&&h.zp<zc+o.band[1])return tone(o.band[2],h.n);
        return tone(pal,h.n,.02);};
      const prims=[sph(u,v,zc,r,sm)];
      for(const [lu,lv] of legs)prims.push(vcyl(lu,lv,lr,0,zc-1,(h)=>h.zp<9?tone(CON,h.n):tone(STL,h.n),{top:'flat'}));
      prims.push(vcyl(u,v,r+.06,zc-1,zc+.6,(h)=>h.part==='top'?'#7a8388':tone(['#8a9398','#7e878c','#737c81','#687176','#5e676c','#555d62'],h.n)));
      prims.push(vcyl(u,v,r+.06,zc+3.2,zc+4.2,()=>'#5d6468',{top:'none'}));
      prims.push(rbox(u-.075,v-.075,.15,.15,top-1.5,2,flatCol('#7d868b','#8a9398','#5a6368')));
      prims.push(vcyl(u,v,.1,top+2,top+3,()=>'#5d6468',{top:'none'}));
      prims.push(vcyl(u+.03,v-.03,.018,top,top+5,palCol(STL),{top:'flat'}));
      rcast(g,prims,{edgeT:.04});
      for(let i=0;i<n;i++)if(front((i+1)*2*Math.PI/n))brace(i);
      // 外側斜梯：自地面沿切線爬到赤道走道
      const sa=o.ladder!=null?o.ladder:1.9,ca=Math.cos(sa),sa_=Math.sin(sa),tu=-sa_,tv=ca,R=r+.1,L_=o.ladderLen||.42;
      const top_=[u+ca*R,v+sa_*R],bot=[top_[0]-tu*L_,top_[1]-tv*L_];
      for(let k=0;k<=12;k++){const f=k/12,pu=bot[0]+(top_[0]-bot[0])*f,pv=bot[1]+(top_[1]-bot[1])*f,z=(zc)*f,p=P(pu,pv,z);RC(g,p[0]-1,p[1]-1,3,1,k%2?'#5c6368':'#8e969b');}
      BL(g,P(bot[0],bot[1],3),P(top_[0],top_[1],zc+3),'#a9b0b4');BL(g,P(bot[0],bot[1],0),P(top_[0],top_[1],zc),'#4c5358');
      // 頂部安全閥與紅色警示燈
      const rl=P(u,v,top+6);RC(g,rl[0]+1,rl[1],1,1,'#d0392c');if(nn)RC(nn,rl[0]+1,rl[1],1,1,'#ff5a48');
      // 底部出液管
      const bp=P(u,v,zc-r*ZT);BL(g,[bp[0],bp[1]],[bp[0],bp[1]+Math.max(0,rnd(zc-r*ZT))],'#9aa1a4');});
    // 臥式子彈型儲槽：半球封頭、兩座混凝土鞍座、頂部人孔與安全閥
    const bullet=(S,ax,a0,a1,c,r,zc,o={})=>S.o(o.d!=null?o.d:(a0+a1)/2+c+.1,(g,n)=>{const pal=o.pal||TW,L=a1-a0;
      const sm=(h)=>{const l=ax==='u'?h.lu:h.lv;if(h.part==='side'){for(const s of[.33,.66])if(Math.abs(l-L*s)<.006)return tone(pal,h.n,-.14);}
        if(o.band&&h.part==='side'&&Math.abs(l-L*.5)<L*.3&&h.n[2]>-.35&&h.n[2]<.05)return tone(o.band,h.n);return tone(pal,h.n,.03);};
      const prims=[ax==='u'?capU(a0,a1,c,zc,r,sm):capV(a0,a1,c,zc,r,sm)];
      for(const s of[.18,.82]){const a=a0+L*s;prims.push(ax==='u'?rbox(a-.04,c-r*.8,.08,r*1.6,0,zc-2,flatCol(...CON.slice(0,1),CON[1],CON[4])):rbox(c-r*.8,a-.04,r*1.6,.08,0,zc-2,flatCol(CON[0],CON[1],CON[4])));}
      const tp=zc+r*ZT;const m=ax==='u'?[a0+L*.25,c]:[c,a0+L*.25];prims.push(vcyl(m[0],m[1],.03,tp-2,tp+2,palCol(STL)));
      const q=ax==='u'?[a0+L*.7,c]:[c,a0+L*.7];prims.push(vcyl(q[0],q[1],.016,tp-1,tp+5,palCol(STL)));
      rcast(g,prims,{edgeT:.04});});
    // 放空火炬塔：細高筒身（頂段紅白帶）、火炬頭、兩層平台、爬梯、拉索、分液罐；火焰白天就看得到，夜裡是真光源
    const flare=(S,u,v,h,o={})=>{const ga=o.guys||[.4,2.5,4.6],gr=o.guyR||.42,gz=rnd(h*.62);
      const guy=(x,a)=>{const e=[u+Math.cos(a)*gr,v+Math.sin(a)*gr];BL(x,P(e[0],e[1],0),P(u,v,gz),'#7c8488');const p=P(e[0],e[1],0);RC(x,p[0]-1,p[1]-1,3,2,'#9c988c');};
      const fr=a=>{let d=a-Math.PI/4;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)<Math.PI/2;};
      S.t(u+v-.3,(x)=>{for(const a of ga)if(!fr(a))guy(x,a);});
      S.o(u+v,(g,n)=>{const ht=h-4;
        // 筒身：頂段四道紅白帶（自火炬頭往下每 5px 一道），其餘鋁灰；爬梯只是一條細暗線
        const sm=(hh)=>{const z=hh.zp;if(hh.part==='side'){const zt=ht-z;if(zt>=0&&zt<20)return (Math.floor(zt/5)%2===0)?tone(RED,hh.n,.08):tone(TW,hh.n);
            if(Math.abs(hh.ang-1.3)<.18&&z>3)return tone(STL,hh.n,-.12);return tone(TSV,hh.n,.1);}return tone(TSV,hh.n,.1);};
        const plat=(z)=>[vcyl(u,v,.07,z-1,z,(hh)=>hh.part==='top'?'#8a9398':'#667075'),vcyl(u,v,.07,z+2,z+3,()=>'#7a8388',{top:'none'})];
        rcast(g,[vcyl(u,v,.038,0,ht,sm),vcyl(u,v,.046,ht,h,palCol(DK,.14)),vcyl(u,v,.065,0,3,palCol(CON)),...plat(rnd(h*.42))],{edgeT:.05});
        // 火焰（向右飄）
        const p=P(u,v,h),X=rnd(p[0]),Y=rnd(p[1]);
        const F=[[0,-1,'#e8742a',2],[0,-2,'#f6c64a',2],[-1,-3,'#e8742a',1],[0,-3,'#fff3c4',2],[2,-3,'#e8742a',1],[-1,-4,'#f6c64a',3],[2,-4,'#e8742a',1],[0,-5,'#f6c64a',2],[2,-5,'#e8742a',1],[1,-6,'#f6c64a',2],[1,-7,'#e8742a',1],[2,-8,'#e8742a',1]];
        for(const [dx,dy,c,w] of F){RC(g,X+dx,Y+dy,w,1,c);if(n)RC(n,X+dx,Y+dy,w,1,c==='#e8742a'?'#ff9a3a':c==='#f6c64a'?'#ffd45a':'#fff6d0');}
        if(n){n.fillStyle='rgba(255,160,80,.35)';n.fillRect(X-2,Y-8,6,1);n.fillRect(X-3,Y-7,1,5);n.fillRect(X+4,Y-7,1,5);}
        const rl=P(u,v,rnd(h*.42)+3);RC(g,rl[0]-3,rl[1],1,1,'#d0392c');if(n)RC(n,rl[0]-3,rl[1],1,1,'#ff5a48');});
      S.t(u+v+.3,(x)=>{for(const a of ga)if(fr(a))guy(x,a);});
      // 分液罐（臥式）＋進火炬管
      if(o.ko){const [ku,kv]=o.ko;S.o(ku+kv+.05,(g)=>{rcast(g,[capU(ku,ku+.2,kv,5,.07,palCol(STL,.05)),rbox(ku+.02,kv-.05,.04,.1,0,3,flatCol(CON[0],CON[1],CON[4])),rbox(ku+.14,kv-.05,.04,.1,0,3,flatCol(CON[0],CON[1],CON[4]))],{edgeT:.04});
        BL(g,P(ku+.2,kv,6),P(u,v,6),'#d9b53a');BL(g,P(ku+.2,kv,5),P(u,v,5),'#8f7420');});}};
    // 壓縮機房：山牆廠房＋百葉＋屋脊通風器＋排氣消音筒
    const compHouse=(S,u0,v0,du,dv,h,rh,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const wl=o.wl||'#d7dcd9',wr=o.wr||'#a7aeac',rl=o.rl||'#7e8a92',rd=o.rd||'#5f6b73',u1=u0+du,v1=v0+dv,ov=.03;
      boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
      ribsL(g,u0,u1,v1,0,h,SH(wl,-10),3);ribsR(g,u1,v0,v1,0,h,SH(wr,-10),3);
      if(o.ridge==='v'){const vm=v0+dv/2;
        fp(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rl);
        fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
        fp(g,[P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),P(u1+ov,v1+ov,h-1),P(u0-ov,v1+ov,h-1)],SH(rl,14));BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),SH(rl,30));
        for(let k=0;k<3;k++){const t=u0+du*(k+.5)/3;boxZ(g,t-.04,vm-.04,.08,.08,h+rh-1,3,'#c3cacd','#d6dcde','#9ba3a7');}}
      else{const um=u0+du/2;
        fp(g,[P(u0-ov,v0-ov,h-1),P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),P(u0-ov,v1+ov,h-1)],rl);
        fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
        fp(g,[P(um,v0-ov,h+rh),P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh)],rd);BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,26));
        for(let k=0;k<3;k++){const t=v0+dv*(k+.5)/3;boxZ(g,um-.04,t-.04,.08,.08,h+rh-1,3,'#c3cacd','#d6dcde','#9ba3a7');}}
      // 大門、百葉窗、門燈
      const dt=u0+du*(o.door||.3);winL(g,dt,v1,0,7,Math.min(10,h-3),'#7c868b');for(let z=1;z<Math.min(10,h-3);z+=2)winL(g,dt,v1,z,7,1,'#667075');
      const lp=P(dt+.12,v1,Math.min(10,h-3)+2);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');
      for(let k=0;k<3;k++){const t=u0+du*(.55+k*.13);for(let z=5;z<h-3;z+=2)winL(g,t,v1,z,4,1,'#8d9794');}
      rowR(g,n,u1,v0+.05,v1-.05,h-6,3,2,3,'#4d6f88',o.seed||1,.5);
      // 排氣消音筒（貫穿屋頂）
      if(o.stacks)rcast(g,o.stacks.map(([a,b])=>vcyl(a,b,.035,h,h+rh+12,palCol(STL,.06),{top:'flat'})),{edgeT:.05});});
    // 空冷器（fin-fan）：四腳架＋管束＋頂上風扇圈
    const finfan=(S,u0,v0,du,dv,h,nf,ax='u')=>S.o(u0+v0+(du+dv)*.5+.05,(g)=>{
      for(const [a,b] of[[u0,v0],[u0+du-.03,v0],[u0,v0+dv-.03],[u0+du-.03,v0+dv-.03]])boxZ(g,a,b,.03,.03,0,h,'#8e979c','#a3abb0','#6f787d');
      boxZ(g,u0,v0,du,dv,h,3,'#9aa3a7','#b8c0c3','#7e878b');boxZ(g,u0,v0,du,dv,h+3,3,'#8b9498','#aab2b6','#737c80');
      for(let k=0;k<nf;k++){const cu=ax==='u'?u0+du*(k+.5)/nf:u0+du/2,cv=ax==='u'?v0+dv/2:v0+dv*(k+.5)/nf,rr=Math.min(ax==='u'?du/nf:dv/nf,ax==='u'?dv:du)*.42,p=P(cu,cv,h+6),rx=RX(rr);
        ell(g,p[0],p[1],rx,rx>>1,'#5c656a');ell(g,p[0],p[1],rx-1,Math.max(1,(rx>>1)-1),'#7a8489');RC(g,p[0]-1,p[1],2,1,'#3f474c');BL(g,[p[0]-rx+2,p[1]],[p[0]+rx-2,p[1]],'#646d72');}});

    return{P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,ribsL,ribsR,pg,winL,winR,rowL,rowR,RX,ell,scene,shadow,
      canopy,curb,hazU,hazV,prack,fireMon,windsock,sphereTank,bullet,flare,compHouse,finfan,
      ZT,ti,tone,sph,vcyl,capU,capV,rbox,rcast,flatCol,palCol,TW,TSV,TIN,TRF,TK,STL,CON,RED,DK,
      MATS,pave,lineU,lineV,dashU,dashV,pipeU,pipeV,sleepersU,sleepersV,fence,signL,lamp,mast,tree,bush,car,flatB,office,hut,
      tankMat,tank,WALL,bund,dikeU,dikeV,tankMatCap,ttruck,trackV,railTank,RT,GA,steelStair};
  };

  // 組裝：每類一個 K、每變體獨立畫布
  const E=.04;
  const build=(k,layouts)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null;
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}};
  const backFence=(L,gU=[],gV=[])=>(g)=>{L.fence(g,[E,E],[SZ-E,E],gU);L.fence(g,[E,E],[E,SZ-E],gV);};

  // ================= k170 燃料儲運站 =================
  try{
    const K170=[
      // v0 方堤四槽：四座外浮頂槽大小遞減（後大前小、前槽為固定錐頂），堤內十字隔堤；右側泵區＋油水分離池；
      // 右前兩車道雙側裝卸棧台（車道沿 v、出口在左前圍籬近南角）；左前控制室、消防水槽＋消防泵房、員工停車
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,pipeU,pipeV,sleepersU,sleepersV,bund,dikeU,dikeV,tank,ttruck,office,hut,lamp,tree,bush,car,boxZ,RC,BL,fp,flat,rcast,capU,vcyl,rbox,tone,palCol,flatCol,RED,STL,CON,TW,TSV}=L;
        pave(g,'k',0,0,SZ,SZ,17001);
        pave(g,'a',2.12,.94,.84,2.06,17002);           // 裝卸車道
        pave(g,'a',.1,2.0,2.02,.17,17003);              // 堤前消防通道
        pave(g,'p',2.06,.12,.88,.7,17004);              // 泵區基座
        pave(g,'c',.12,2.22,1.96,.72,17005);            // 前區混凝土
        pave(g,'g',.06,2.86,1.3,.12,17006);
        backFence(L)(g);
        bund(S,g,.12,.12,1.84,1.8,5,17007,{steps:[['v',1.0],['u',1.46]]});
        dikeU(g,1.01,.17,1.91);dikeV(g,1.01,.17,1.87);
        // 槽根管線 → 堤外集合管（沿 u=1.99）→ 泵區
        for(const [v,z] of[[.5,2],[.62,2],[1.4,2],[1.52,2]]){pipeU(g,v,v<1?1.0:.86,2.0,'#a7aeb2',z);}
        // 十字隔堤前的堤內集合管（前槽右移後露出來）：兩條管沿隔堤走到東側堤邊
        sleepersU(g,1.08,.3,1.95,.1);pipeU(g,1.065,.3,1.95,'#a7aeb2');pipeU(g,1.1,.3,1.95,'#b9a15a');
        pipeV(g,1.08,1.08,1.2,'#a7aeb2');
        sleepersV(g,2.0,.42,1.85,.12);pipeV(g,1.985,.42,1.85,'#a7aeb2');pipeV(g,2.02,.42,1.85,'#b9a15a');
        pipeU(g,.44,2.0,2.24,'#a7aeb2');pipeU(g,.58,2.0,2.24,'#b9a15a');
        pipeU(g,.24,1.96,2.12,'#8f8b80',1);                 // 堤內排水 → 油水分離池
        // 車道標線：分隔島兩側車道、停止線、出口導線
        lineV(g,2.14,.96,2.98,'#e2ddcd');lineV(g,2.94,.96,2.98,'#e2ddcd');
        lineU(g,1.08,2.16,2.92,'#e3c04e');lineU(g,2.24,2.16,2.92,'#e3c04e');
        dashV(g,2.54,2.3,2.96,'#e8e2c8',.08,.07);
        for(const u of[2.3,2.36,2.42])lineU(g,2.9,u-.02,u+.02,'#e8e2c8');
        // 油水分離池（泵區後段，雨棚遮不到）：三格池、隔板、浮油攔油索
        boxZ(g,2.1,.13,.4,.22,0,2,'#d6d2c6','#c6c2b6','#a29e92');flat(g,2.13,.16,.34,.16,'#4b675f',2);
        for(const u of[2.24,2.36])BL(g,P(u,.16,2),P(u,.32,2),'#b9b5a9');BL(g,P(2.14,.2,2),P(2.23,.2,2),'#7d9990');BL(g,P(2.37,.26,2),P(2.46,.26,2),'#e0b33a');
        // 前區步道、停車格
        for(let k=0;k<=4;k++){const u=.24+k*.16;lineV(g,u,2.7,2.92,'#dedad0');}
        L.shadow(g,[['c',.57,.57,.4,27],['c',.55,1.47,.34,24],['c',1.47,.55,.34,24],['c',1.66,1.46,.25,19],
          ['b',2.2,1.1,.66,1.1,24],['c',1.3,2.5,.22,18],['b',.24,2.3,.62,.36,17],['b',1.62,2.3,.38,.28,10],['b',2.64,.18,.26,.22,11]]);
        // 油槽（堤內 2×2，大小遞減）
        tank(S,.57,.57,.4,27,{stair:[-.5,1.6],roof:'open',band:[20,22,['#7fb08a','#6b9f78','#5b8f69','#4d7f5b','#426f4f','#385f44']]});
        tank(S,.55,1.47,.34,24,{stair:[-.45,1.65],roof:'open'});
        tank(S,1.47,.55,.34,24,{stair:[-.45,1.65],roof:'open',pal:TSV});
        // 最前一座固定錐頂槽：縮小並往 +u 挪到堤角，露出十字隔堤與堤內管線；錐頂中心抬高 8px，錐面分明暗、頂端透氣帽
        tank(S,1.66,1.46,.25,19,{stair:[-.4,1.7],roof:'cone',rise:8,band:[13,15,['#7fb08a','#6b9f78','#5b8f69','#4d7f5b','#426f4f','#385f44']]});
        // 泵區：三台臥式泵（馬達＋泵殼）、配電室
        S.o(2.4+.5,(x,n)=>{for(let k=0;k<3;k++){const v=.44+k*.14;
          boxZ(x,2.22,v-.04,.36,.08,0,2,'#cbc8be','#bdbab0','#9f9c93');
          rcast(x,[capU(2.25,2.36,v,5,.035,palCol(['#8fb2cf','#7aa0c0','#678fb1','#577e9f','#4a6d8a','#3e5c75'])),capU(2.4,2.5,v,5,.04,palCol(STL))],{edge:false});
          BL(x,P(2.52,v,5),P(2.58,v,5),'#9aa1a4');}});
        hut(S,2.64,.18,.26,.22,11,{door:.3,louver:1,sign:1,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2'});
        // 管架：泵區 → 棧台平台（跨越左車道）
        S.t(2.1+1.16,(x)=>{for(const u of[2.12,2.32]){const p=P(u,1.16,0);RC(x,p[0],p[1]-12,1,12,'#6d767b');RC(x,p[0]+1,p[1]-11,1,11,'#8e979c');}
          for(const [dv,c] of[[-.02,'#b3babe'],[.02,'#c9b262']]){BL(x,P(2.0,1.16+dv,13),P(2.5,1.16+dv,13),c);BL(x,P(2.0,1.16+dv,12),P(2.5,1.16+dv,12),SH(c,-50));}
          for(const [dv,c] of[[-.02,'#b3babe'],[.02,'#c9b262']]){BL(x,P(1.99+dv,.9,3),P(1.99+dv,1.16,12),c);}});
        // 裝卸棧台：分隔島沿 v（u=2.54），兩車道各一部油罐車，懸臂雨棚
        const uc=2.54,va=1.12,vb=2.12;
        ttruck(S,2.24,1.28,'v','#c9572f',{stripe:['#7fb08a','#6b9f78','#5b8f69','#4d7f5b','#426f4f','#385f44'],d:2.3+1.5});
        S.o(uc+1.62,(x,n)=>{boxZ(x,uc-.06,va,.12,vb-va,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let v=va+.1;v<vb;v+=.3){boxZ(x,uc-.016,v-.016,.032,.032,2,19,'#aeb5b9','#c3c9cc','#848c90');}
          boxZ(x,uc-.07,va+.04,.14,vb-va-.08,12,2,'#707a7f','#8a9398','#5a6368');
          BL(x,P(uc-.07,vb-.04,16),P(uc-.07,va+.04,16),'#e0c24a');BL(x,P(uc+.07,vb-.04,16),P(uc+.07,va+.04,16),'#e0c24a');
          for(let v=va+.2;v<vb-.1;v+=.28){for(const s of[-1,1]){const a=P(uc+s*.06,v,15),b=P(uc+s*.2,v+.04,11),c=P(uc+s*.2,v+.04,8);BL(x,a,b,'#3f464a');BL(x,b,c,'#3f464a');}
            boxZ(x,uc-.04,v-.03,.08,.06,14,4,'#c9cfd2','#d9dee0','#a3aaae');}
        });
        S.t(uc+vb+.12,(x)=>L.steelStair(x,'v',uc,vb-.02,1,.22,12,.08));   // 上平台的樓梯（前端，淺色鋼梯）
        ttruck(S,2.64,1.46,'v','#3d6c9a',{d:2.7+1.7});
        L.canopy(S,uc-.36,va-.04,uc+.36,vb+.02,21,'#c8453a','v',uc+.4+vb+.2);
        // 前區：控制室（兩層）、消防水槽＋消防泵房（紅捲門）、泡沫液罐
        office(S,.24,2.3,.62,.36,2,17011,{band:'#4d7f5b',door:.4});
        tank(S,1.3,2.5,.22,18,{roof:'cone',pal:TW,stair:[-.3,1.8],band:[12,14,RED],courses:4,d:1.3+2.5});
        hut(S,1.62,2.3,.38,.28,10,{door:.35,doorC:'#c0392b',win:1,lampOver:1,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2'});
        S.o(1.62+2.66,(x)=>{rcast(x,[capU(1.66,1.86,2.7,5,.05,palCol(RED)),rbox(1.68,2.65,.03,.1,0,3,flatCol('#b9b6ad','#c9c6bd','#9f9c93')),rbox(1.82,2.65,.03,.1,0,3,flatCol('#b9b6ad','#c9c6bd','#9f9c93'))],{edge:false});});
        for(const [u,c] of[[.28,'#b8433a'],[.44,'#e8ecee'],[.6,'#3d5f8a'],[.92,'#6f7b3a']])car(S,u,2.74,false,c);
        // 警衛亭＋柵欄
        S.o(2.06+2.72,(x,n)=>{boxZ(x,1.98,2.62,.14,.16,0,9,'#e4e2dc','#f0eee8','#b8b5ad');L.winL(x,2.0,2.78,4,3,3,'#3d5a72');if(n)L.winL(n,2.0,2.78,4,3,3,'#ffe2a0');
          boxZ(x,1.96,2.6,.18,.2,9,1,'#8a9398','#9aa3a8','#6f787d');});
        S.t(2.2+2.86,(x)=>{for(let k=0;k<10;k++){const a=P(2.16+k*.04,2.86,5);RC(x,a[0],a[1],2,1,k%2?'#f2f0ea':'#c0392b');}});
        tree(S,.14,2.9,.8,0);tree(S,.5,2.92,.7,2);tree(S,1.06,2.92,.8,1);bush(S,1.9,2.92,3);
        lamp(S,1.98,2.04,20);lamp(S,.1,2.04,20);lamp(S,2.96,1.0,20);lamp(S,2.08,.9,20);lamp(S,2.96,2.2,20);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.73,.985]]);L.signL(g2,1.5,SZ-E,'r');L.signL(g2,SZ-E,1.6,'r');}};
      },
      // v1 單座巨槽：左後一座大型外浮頂槽獨佔一堤；右後小堤四座錐頂槽；中段泵區；
      // 前段橫向裝卸棧台（車道沿 u、出口在右前圍籬）；最前排控制室、消防水槽、停車
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,pipeU,pipeV,sleepersU,bund,dikeU,dikeV,tank,ttruck,office,hut,lamp,tree,bush,car,boxZ,RC,BL,flat,rcast,capU,capV,rbox,palCol,flatCol,RED,STL,TW,TSV}=L;
        pave(g,'k',0,0,SZ,SZ,17101);
        pave(g,'a',.14,1.74,2.84,.72,17102);
        pave(g,'p',1.76,1.4,1.14,.3,17103);
        pave(g,'c',.12,2.5,2.84,.44,17104);
        pave(g,'g',.06,2.9,2.9,.08,17105);
        backFence(L)(g);
        bund(S,g,.12,.12,1.5,1.5,5,17106,{steps:[['v',1.2]]});
        bund(S,g,1.74,.12,1.14,1.2,4,17107,{steps:[['v',2.3]]});
        dikeV(g,2.31,.16,1.28);
        pipeU(g,1.04,1.3,1.76,'#a7aeb2');pipeU(g,1.14,1.3,1.76,'#b9a15a');
        sleepersU(g,1.36,.5,2.9,.1);pipeU(g,1.34,.5,2.9,'#a7aeb2');pipeU(g,1.39,.5,2.9,'#b9a15a');
        for(const u of[2.06,2.6])pipeV(g,u,1.2,1.36,'#a7aeb2');
        // 車道標線
        lineU(g,1.76,.14,2.96,'#e2ddcd');lineU(g,2.44,.14,2.96,'#e2ddcd');
        lineV(g,.36,1.78,2.42,'#e3c04e');lineV(g,1.62,1.78,2.42,'#e3c04e');
        dashU(g,2.1,1.74,2.96,'#e8e2c8',.08,.07);
        for(let k=0;k<=5;k++){const u=2.2+k*.13;lineV(g,u,2.56,2.86,'#dedad0');}
        L.shadow(g,[['c',.87,.87,.62,31],['c',2.04,.44,.21,15],['c',2.6,.44,.21,15],['c',2.04,1.0,.21,15],['c',2.6,1.0,.21,15],
          ['b',.4,1.72,1.26,.76,24],['b',.2,2.56,.66,.32,14],['c',1.3,2.72,.18,17],['b',1.6,2.58,.34,.3,10]]);
        tank(S,.87,.87,.62,31,{stair:[-.55,1.55],roof:'open',courses:6,band:[24,26,['#8fb4d6','#78a2c8','#658fb6','#557ea3','#476d8f','#3b5c7a']]});
        for(const [u,v] of[[2.04,.44],[2.6,.44],[2.04,1.0],[2.6,1.0]])tank(S,u,v,.21,15,{roof:'cone',stair:[-.35,1.75],courses:4,pal:TSV,roofPal:TSV});
        // 泵區（沿 u 一列）
        S.o(2.3+1.6,(x)=>{for(let k=0;k<4;k++){const u=1.86+k*.24;boxZ(x,u-.02,1.46,.08,.2,0,2,'#cbc8be','#bdbab0','#9f9c93');
          rcast(x,[capV(1.49,1.56,u+.02,5,.035,palCol(['#8fb2cf','#7aa0c0','#678fb1','#577e9f','#4a6d8a','#3e5c75'])),capV(1.59,1.64,u+.02,5,.04,palCol(STL))],{edge:false});}});
        // 管架跨越車道到棧台
        S.t(1.0+1.8,(x)=>{for(const v of[1.5,1.72]){const p=P(1.0,v,0);RC(x,p[0],p[1]-12,1,12,'#6d767b');RC(x,p[0]+1,p[1]-11,1,11,'#8e979c');}
          for(const [du,c] of[[-.02,'#b3babe'],[.02,'#c9b262']]){BL(x,P(1.0+du,1.4,13),P(1.0+du,2.08,13),c);BL(x,P(1.0+du,1.4,12),P(1.0+du,2.08,12),SH(c,-50));}});
        // 裝卸棧台（分隔島沿 u，v=2.1）
        const vc=2.1,ua=.46,ub=1.54;
        ttruck(S,.62,1.8,'u','#d8d4c8',{stripe:['#8fb4d6','#78a2c8','#658fb6','#557ea3','#476d8f','#3b5c7a'],d:.9+1.85});
        S.o(1.0+vc,(x,n)=>{boxZ(x,ua,vc-.06,ub-ua,.12,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let u=ua+.1;u<ub;u+=.3){boxZ(x,u-.016,vc-.016,.032,.032,2,19,'#aeb5b9','#c3c9cc','#848c90');}
          boxZ(x,ua+.04,vc-.07,ub-ua-.08,.14,12,2,'#707a7f','#8a9398','#5a6368');
          BL(x,P(ua+.04,vc-.07,16),P(ub-.04,vc-.07,16),'#e0c24a');BL(x,P(ua+.04,vc+.07,16),P(ub-.04,vc+.07,16),'#e0c24a');
          for(let u=ua+.2;u<ub-.1;u+=.28){for(const s of[-1,1]){const a=P(u,vc+s*.06,15),b=P(u+.04,vc+s*.2,11),c=P(u+.04,vc+s*.2,8);BL(x,a,b,'#3f464a');BL(x,b,c,'#3f464a');}
            boxZ(x,u-.03,vc-.04,.06,.08,14,4,'#c9cfd2','#d9dee0','#a3aaae');}
        });
        S.t(ub+vc+.12,(x)=>L.steelStair(x,'u',ub-.02,vc,1,.22,12,.08));
        ttruck(S,.84,2.22,'u','#b8433a',{d:1.2+2.3});
        ttruck(S,2.02,2.24,'u','#e0dcd0',{stripe:['#8fb4d6','#78a2c8','#658fb6','#557ea3','#476d8f','#3b5c7a'],d:2.4+2.3});   // 裝完駛向出口
        L.canopy(S,ua-.04,vc-.36,ub+.02,vc+.36,21,'#3b6fa0','u',ub+.2+vc+.4);
        // 前排
        office(S,.2,2.56,.66,.32,1,17111,{band:'#3b6fa0',door:.3});
        tank(S,1.3,2.72,.18,17,{roof:'cone',stair:[-.3,1.8],band:[11,13,RED],courses:3});
        hut(S,1.6,2.58,.34,.3,10,{door:.3,doorC:'#c0392b',win:1,lampOver:1,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2'});
        for(const [u,c] of[[2.24,'#e8ecee'],[2.37,'#b8433a'],[2.63,'#3d5f8a'],[2.76,'#c9cdd0']])car(S,u,2.62,false,c);
        S.o(2.98+2.0,(x,n)=>{boxZ(x,2.8,2.48,.14,.14,0,9,'#e4e2dc','#f0eee8','#b8b5ad');L.winR(x,2.94,2.5,4,3,3,'#3d5a72');if(n)L.winR(n,2.94,2.5,4,3,3,'#ffe2a0');boxZ(x,2.78,2.46,.18,.18,9,1,'#8a9398','#9aa3a8','#6f787d');});
        S.t(2.9+2.0,(x)=>{for(let k=0;k<9;k++){const a=P(2.9,1.8+k*.04,5);RC(x,a[0]-1,a[1],2,1,k%2?'#f2f0ea':'#c0392b');}});
        tree(S,.1,2.95,.7,1);tree(S,1.98,2.95,.8,0);bush(S,1.1,2.96,3);
        lamp(S,.1,1.7,20);lamp(S,1.68,1.72,20);lamp(S,2.95,1.36,20);lamp(S,1.68,.1,20);lamp(S,2.95,2.5,20);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.575,.83]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);L.signL(g2,1.0,SZ-E,'r');L.signL(g2,SZ-E,.9,'r');}};
      },
      // v2 鐵路收油＋槽列：左後側鐵路專用線（三節油罐車廂＋退到 -u 側的低矮收油棧橋，前段軌道穿過左前圍籬的鐵路門）；後排兩座大型外浮頂槽；
      // 前堤三座錐頂成品槽；右前單車道卡車棧台；前排控制室、消防水槽
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,pipeU,pipeV,sleepersU,sleepersV,bund,dikeU,dikeV,tank,ttruck,trackV,railTank,RT,office,hut,lamp,tree,bush,car,boxZ,RC,BL,fp,flat,rcast,capU,capV,rbox,palCol,flatCol,RED,STL,TW,TSV}=L;
        const AMB=['#e2a45a','#d49248','#c3803a','#ae6f30','#985f28','#7f4f22'];
        // 軌道中心線 u=.52；收油棧橋中心線 u=.2（退到軌道 -u 側 .32 格，走道面只比罐車頂高 4px），車廂圓罐身整條露出；
        // 三節車廂佔後段，前段軌道（枕木、道碴、雙軌）整段露出、一路穿過左前圍籬的鐵路門
        const TU=.52,TB=.2,NC=3,CL=.47,CV=k=>.64+k*.5,BV0=CV(0)-.04,BV1=CV(NC-1)+CL+.04;
        pave(g,'k',0,0,SZ,SZ,17201);
        pave(g,'c',.06,BV0-.1,.27,BV1-BV0+.46,17202);             // 棧橋下混凝土地坪（到樓梯腳）
        trackV(g,TU,.06,SZ,17208);                       // 道碴床一路延伸，穿過左前圍籬的鐵路門
        pave(g,'a',.7,2.08,2.28,.54,17203);
        pave(g,'c',.7,2.64,2.26,.3,17204);
        pave(g,'p',2.1,1.34,.84,.7,17205);
        backFence(L,[],[])(g);
        bund(S,g,.78,.12,2.12,1.14,5,17206,{steps:[['v',1.8]]});
        bund(S,g,.78,1.34,1.26,.66,4,17207,{steps:[['v',1.25]]});
        dikeV(g,1.8,.16,1.22);
        sleepersV(g,.72,.1,2.04,.08);pipeV(g,.71,.1,2.04,'#a7aeb2');pipeV(g,.74,.1,2.04,'#b9a15a');
        pipeU(g,.66,.74,.84,'#a7aeb2');pipeU(g,1.7,.74,.84,'#a7aeb2');
        pipeU(g,1.28,.74,2.2,'#a7aeb2');pipeU(g,1.31,.74,2.2,'#b9a15a');
        lineU(g,2.08,.7,2.98,'#e2ddcd');lineU(g,2.62,.7,2.98,'#e2ddcd');lineU(g,2.35,1.84,2.7,'#e3c04e');dashU(g,2.35,.7,1.8,'#e8e2c8',.08,.07);
        for(const u of[1.78,1.82])lineV(g,u,2.1,2.6,'#e8e2c8');
        for(let k=0;k<=3;k++){lineV(g,.76+k*.13,2.68,2.92,'#dedad0');lineV(g,1.94+k*.13,2.68,2.92,'#dedad0');}
        L.shadow(g,[['c',1.26,.66,.44,28],['c',2.3,.64,.42,27],['c',1.06,1.67,.16,14],['c',1.46,1.67,.16,14],
          ['b',TB-.05,BV0,.1,BV1-BV0,16],['b',TB-.045,BV1,.09,.36,8],['b',TU-.08,CV(0),.16,NC*.5-.03,13],['c',2.66,1.7,.2,18],['b',1.84,2.06,.84,.6,24],['b',1.2,2.66,.66,.26,17]]);
        // 車擋（軌道北端）：鋼座＋紅白緩衝樑
        S.o(TU+.12,(x)=>{boxZ(x,TU-.09,.06,.18,.05,0,3,'#8e979c','#9ea7ac','#6a7378');boxZ(x,TU-.1,.1,.2,.022,3,2,'#e9e6de','#f2efe8','#b5b1a8');
          for(let k=0;k<5;k++)L.faceL(x,.122,TU-.1+k*.04,TU-.06+k*.04,3,5,k%2?'#f2efe8':'#c8413a');});
        // 三節油罐車廂：銀灰／褪色黑（亮受光帶）／鏽紅
        const CARS=[RT.silver,RT.black,RT.rust];
        for(let k=0;k<NC;k++)railTank(S,TU,CV(k),CL,{pal:CARS[k]});
        // 收油棧橋（在車廂之後、-u 側）：混凝土條基、細鋼柱、淺色格柵走道（面高 16px＝罐車頂＋4px）；兩條裝油管走在走道上
        // 條基與鋼柱走細線層（不描黑邊），只有走道板描邊：柱子不再排成一整排黑色籠格
        S.t(.14,(x)=>{const u=TB;boxZ(x,u-.05,BV0,.1,BV1-BV0,0,1,'#d6d2c6','#c6c2b6','#a4a094');
          for(let v=BV0+.05;v<BV1;v+=.34){boxZ(x,u-.014,v-.014,.028,.028,1,13,'#c3c9cc','#d4d9dc','#8a9297');const b=P(u+.014,v+.014,1);RC(x,b[0]-1,b[1]-1,3,1,'#7d858a');}});
        S.o(.15,(x)=>{const u=TB;
          boxZ(x,u-.05,BV0,.1,BV1-BV0,14,2,'#d3d8da','#e2e6e7','#99a1a5');
          for(let v=BV0+.1;v<BV1-.05;v+=.1)BL(x,P(u-.045,v,16),P(u+.045,v,16),'#bec5c8');
          for(const [o,c] of[[-.03,'#b3babe'],[-.012,'#a08a70']]){BL(x,P(u+o,BV0,18),P(u+o,BV1,18),SH(c,22));BL(x,P(u+o,BV0,17),P(u+o,BV1,17),SH(c,-40));}});
        // 欄杆：後側淺鋼、前側安全黃，立柱每 .2 格（稀疏，不做成一整排鋸齒）
        S.t(.16,(x)=>{const u=TB;BL(x,P(u-.05,BV0,20),P(u-.05,BV1,20),'#c9d0d3');BL(x,P(u+.05,BV0,20),P(u+.05,BV1,20),'#e8c84e');
          for(let v=BV0;v<=BV1+.001;v+=.2)for(const o of[-.05,.05]){const a=P(u+o,v,16);RC(x,a[0],a[1]-4,1,4,o>0?'#b8982c':'#8a9398');}});
        // 北端管橋：棧橋裝油管在走道北端立起、跨過鐵軌，落到堤邊管線
        const VP=BV0-.07;
        S.t(VP+.95,(x)=>{for(const u of[.33,.71]){const p=P(u,VP,0);RC(x,p[0],p[1]-21,1,21,'#6d767b');RC(x,p[0]+1,p[1]-20,1,20,'#a3abb0');}
          BL(x,P(.32,VP,21),P(.72,VP,21),'#5b6368');
          for(const [dv,c] of[[-.015,'#b3babe'],[.015,'#a08a70']]){const o=dv>0?-.012:-.03;BL(x,P(TB+o,VP+dv,17),P(TB+o,VP+dv,23),SH(c,-20));
            BL(x,P(TB+o,VP+dv,23),P(.74,VP+dv,23),SH(c,20));BL(x,P(TB+o,VP+dv,22),P(.74,VP+dv,22),SH(c,-44));
            BL(x,P(.74,VP+dv,22),P(.73,VP+.01+dv,2),SH(c,-10));}});
        // 每節車廂一組：黃色活動吊板（走道前緣斜落到罐頂平台）＋一支短鶴管（走道上的立管 → 肘節 → 插進人孔）
        // 最前一節已裝完：吊板收起豎在欄杆邊、鶴管收回平行走道
        for(let k=0;k<NC;k++){const vd=CV(k)+CL/2;S.t(TU+CV(k)+CL+.01,(x)=>{const e0=TB+.05,e1=TU-.04,zd=16,zt=13,vg=vd+.075;
          const r0=P(TB-.005,vd-.07,16),r1=P(TB-.005,vd-.07,21);BL(x,r0,r1,'#6d767b');RC(x,r1[0]-1,r1[1],2,1,'#b39227');
          if(k===NC-1){const a=P(e0,vg-.03,zd),b=P(e0,vg+.03,zd);
            for(let z=1;z<=6;z++){const p=P(e0,vg-.03,zd+z),q=P(e0,vg+.03,zd+z);BL(x,p,q,z%2?'#d9dee0':'#b9c0c3');}
            BL(x,[a[0],a[1]-6],[b[0],b[1]-6],'#e8c84e');BL(x,b,[b[0],b[1]-6],'#b8982c');
            const s1=P(TB-.005,vd+.16,21);BL(x,r1,s1,'#c3cacd');BL(x,[r1[0],r1[1]+1],[s1[0],s1[1]+1],'#6d767b');return;}
          fp(x,[P(e0,vg-.03,zd),P(e1,vg-.03,zt),P(e1,vg+.03,zt),P(e0,vg+.03,zd)],'#dde2e4');
          BL(x,P(e0,vg+.03,zd),P(e1,vg+.03,zt),'#8f979b');BL(x,P(e0,vg+.03,zd+3),P(e1,vg+.03,zt+3),'#e8c84e');
          const kn=P(TU-.02,vd-.05,20),dp=P(TU,vd,15);BL(x,r1,kn,'#c3cacd');BL(x,[r1[0],r1[1]+1],[kn[0],kn[1]+1],'#6d767b');BL(x,kn,dp,'#4a5156');RC(x,kn[0]-1,kn[1]-1,2,2,'#b39227');RC(x,dp[0]-1,dp[1],3,1,'#3f464a');});}
        // 棧橋西端樓梯：淺色鋼梯（踏階交錯深淺、外側斜樑、黃扶手）直接落到混凝土地坪
        S.t(TB+BV1+.4,(x)=>L.steelStair(x,'v',TB,BV1,1,.36,16,.09));
        tank(S,1.26,.66,.44,28,{stair:[-.5,1.6],roof:'open',band:[21,23,AMB]});
        tank(S,2.3,.64,.42,27,{stair:[-.45,1.65],roof:'open',band:[20,22,AMB]});
        for(const u of[1.06,1.46])tank(S,u,1.67,.16,14,{roof:'cone',stair:[-.3,1.8],courses:3,pal:TSV,roofPal:TSV});
        tank(S,1.83,1.67,.13,12,{roof:'cone',stair:[-.25,1.8],courses:3,pal:TSV,roofPal:TSV});
        // 右側泵區（沿 v 一列）＋消防水槽
        S.o(2.3+1.66,(x)=>{for(let k=0;k<3;k++){const v=1.44+k*.18;boxZ(x,2.14,v-.04,.3,.08,0,2,'#cbc8be','#bdbab0','#9f9c93');
          rcast(x,[capU(2.17,2.26,v,5,.035,palCol(['#8fb2cf','#7aa0c0','#678fb1','#577e9f','#4a6d8a','#3e5c75'])),capU(2.3,2.4,v,5,.04,palCol(STL))],{edge:false});}});
        tank(S,2.7,1.66,.2,18,{roof:'cone',stair:[-.3,1.8],band:[12,14,RED],courses:4});
        // 卡車棧台（車道沿 u、右前出口）：棚下兩車、棚外一車排隊
        const vc=2.35,ua=1.9,ub=2.64;
        ttruck(S,1.02,2.43,'u','#b8433a',{stripe:AMB,d:1.3+2.5});
        ttruck(S,2.0,2.12,'u','#e0dcd0',{stripe:AMB,d:2.3+2.16});
        S.o(2.27+vc+.01,(x,n)=>{boxZ(x,ua,vc-.05,ub-ua,.1,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let u=ua+.1;u<ub;u+=.3)boxZ(x,u-.016,vc-.016,.032,.032,2,19,'#aeb5b9','#c3c9cc','#848c90');
          boxZ(x,ua+.04,vc-.06,ub-ua-.08,.12,12,2,'#707a7f','#8a9398','#5a6368');
          BL(x,P(ua+.04,vc-.06,16),P(ub-.04,vc-.06,16),'#e0c24a');BL(x,P(ua+.04,vc+.06,16),P(ub-.04,vc+.06,16),'#e0c24a');
          for(let u=ua+.2;u<ub-.1;u+=.28){for(const s of[-1,1]){const a=P(u,vc+s*.05,15),b=P(u+.04,vc+s*.17,11),c=P(u+.04,vc+s*.17,8);BL(x,a,b,'#3f464a');BL(x,b,c,'#3f464a');}
            boxZ(x,u-.03,vc-.04,.06,.08,14,4,'#c9cfd2','#d9dee0','#a3aaae');}
        });
        S.t(ua+vc-.1+.01,(x)=>L.steelStair(x,'u',ua+.02,vc,-1,.22,12,.08));
        ttruck(S,2.12,2.46,'u','#2f6f7a',{d:2.4+2.5});
        L.canopy(S,ua-.04,vc-.28,ub+.02,vc+.28,21,'#d0802f','u',ub+vc+.5);
        office(S,1.2,2.66,.66,.26,2,17211,{band:'#d0802f',door:.5});   // 控制室讓出軌道視線（u≥1.2）
        for(const [u,c] of[[.8,'#e8ecee'],[.93,'#b8433a'],[1.06,'#3d5f8a'],[1.98,'#c9cdd0'],[2.11,'#6f7b3a'],[2.24,'#e8ecee']])car(S,u,2.7,false,c);
        hut(S,2.46,2.68,.3,.24,10,{door:.3,doorC:'#c0392b',win:1,lampOver:1,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2'});
        tree(S,2.9,2.94,.7,0);bush(S,.9,2.96,3);
        lamp(S,.07,.7,20,.1);lamp(S,.07,1.7,20,.1);lamp(S,2.06,2.04,20);lamp(S,2.96,1.3,20);lamp(S,.08,2.66,20);
        // 鐵路門：軌道穿過左前圍籬；兩根門柱（紅白頂）、門扇向內開、貼著圍籬收好
        const t0=(TU-.17-E)/(SZ-2*E),t1=(TU+.17-E)/(SZ-2*E);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.7,.885]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[t0,t1]]);
          for(const [u,s] of[[TU-.17,-1],[TU+.17,1]]){const p=P(u,SZ-E),X=rnd(p[0]),Y=rnd(p[1]);
            const q=P(u+s*.22,SZ-E-.1);BL(g2,[X,Y-8],[q[0],q[1]-8],'#8a9398');BL(g2,[X,Y-1],[q[0],q[1]-1],'#8a9398');BL(g2,[X,Y-8],[q[0],q[1]-1],'rgba(138,147,152,.8)');BL(g2,[q[0],q[1]-8],[q[0],q[1]],'#6d767b');
            RC(g2,X-1,Y-11,2,11,'#5f686d');RC(g2,X+1,Y-10,1,10,'#3f464a');RC(g2,X-1,Y-11,2,2,'#c8413a');RC(g2,X-1,Y-9,2,1,'#f2efe8');}
          L.signL(g2,1.3,SZ-E,'r');L.signL(g2,SZ-E,1.2,'r');}};
      },
    ];
    build(170,K170);
  }catch(e){console.error('logi_d k170',e);errs.push('k170:'+(e&&e.stack||e));}

  // ================= k171 天然氣儲配站 =================
  try{
    const GY='#d9b53a';   // 燃氣管線黃
    const BLU=['#8fb8e0','#78a6d2','#6594c2','#5582b0','#48719b','#3c6085'];
    const TEAL=['#7cc0b8','#66aea6','#549c94','#468a83','#3a7872','#306661'];
    const ORG=['#f0b070','#e49c58','#d48946','#c07739','#a8662f','#8f5627'];
    // 計量調壓撬：過濾分離器（立式小罐）＋黃色管線＋小遮棚
    const skid=(S,L,u0,v0,du,dv)=>{const {rcast,vcyl,capU,rbox,palCol,flatCol,BL,P,boxZ,STL,CON}=L;
      S.o(u0+v0+(du+dv)*.5,(g)=>{boxZ(g,u0,v0,du,dv,0,1,'#cbc8be','#bdbab0','#9f9c93');
        const Y=['#f0cf5a','#e6c14a','#d9b53a','#c7a32f','#b39227','#9c7f21'];
        rcast(g,[capU(u0+.04,u0+du-.04,v0+dv*.3,4,.025,palCol(Y)),capU(u0+.04,u0+du-.04,v0+dv*.7,4,.025,palCol(Y)),
          vcyl(u0+du*.3,v0+dv*.5,.05,1,11,palCol(STL,.05),{top:'dome',rise:2}),vcyl(u0+du*.6,v0+dv*.5,.05,1,11,palCol(STL,.05),{top:'dome',rise:2}),
          rbox(u0+du*.8,v0+dv*.3,.08,.1,1,6,flatCol('#c9cfd2','#d9dee0','#a3aaae'))],{edgeT:.04});});};
    const K171=[
      // v0 雙球罐：後排兩座大型球罐（圍堰混凝土地坪）；右後角火炬塔自成一區（拉索、分液罐、黃黑警示帶）；
      // 中段黃色管架；左前壓縮機房＋空冷器；右前雙車道液化氣槽車裝卸台；前排控制室、計量撬、停車
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,curb,hazU,hazV,prack,fireMon,windsock,sphereTank,flare,compHouse,finfan,ttruck,office,hut,lamp,tree,bush,car,boxZ,RC,BL,pipeU,pipeV,sleepersV,TW}=L;
        pave(g,'k',0,0,SZ,SZ,17111);
        pave(g,'c',.12,.12,2.06,1.26,17112);curb(g,.12,.12,2.06,1.26);
        pave(g,'k',2.3,.1,.66,.66,17113);hazU(g,.74,2.3,2.96);hazV(g,2.3,.1,.74);
        pave(g,'a',1.9,1.62,1.06,1.34,17114);
        pave(g,'p',.14,1.62,1.62,.62,17115);
        pave(g,'c',.14,2.3,1.7,.64,17116);
        pave(g,'g',.06,2.9,1.2,.08,17117);
        backFence(L)(g);
        L.fence(g,[2.3,.08],[2.3,.74]);
        // 球罐出液管 → 管架（地面黃管）
        for(const u of[.64,1.6]){sleepersV(g,u+.3,.9,1.52,.08);pipeV(g,u+.3,.9,1.52,GY);}
        lineV(g,2.42,1.66,2.9,'#e3c04e');lineV(g,1.92,1.66,2.94,'#e2ddcd');lineV(g,2.94,1.66,2.94,'#e2ddcd');
        lineU(g,1.74,1.94,2.92,'#e3c04e');dashV(g,2.18,2.5,2.94,'#e8e2c8',.08,.07);dashV(g,2.68,2.5,2.94,'#e8e2c8',.08,.07);
        for(let k=0;k<=4;k++){const u=.22+k*.15;lineV(g,u,2.66,2.92,'#dedad0');}
        L.shadow(g,[['s',.64,.72,.42,23],['s',1.6,.72,.42,23],['c',2.62,.42,.04,92],['b',.2,1.66,.84,.52,20],['b',1.14,1.7,.48,.36,15],['b',.22,2.36,.66,.3,11],['b',2.1,1.8,.64,.64,24]]);
        prack(S,'u',1.48,.14,2.9,12,[GY,'#a7aeb2',GY],1.48+1.1);
        sphereTank(S,.64,.72,.42,23,{stair:1.25,ladder:1.95});
        sphereTank(S,1.6,.72,.42,23,{stair:1.1,ladder:1.85});
        flare(S,2.62,.42,92,{ko:[2.36,.62],guys:[.2,2.3,4.4],guyR:.3});
        S.t(2.63+.74,(x)=>{L.fence(x,[2.3,.74],[2.96,.74]);});
        L.signL(g,2.5,.74,'y');
        compHouse(S,.2,1.66,.84,.52,13,6,{ridge:'v',door:.18,stacks:[[.55,1.8],[.8,1.8]],seed:17118});
        finfan(S,1.14,1.7,.48,.36,9,2);
        // 裝卸台（分隔島沿 v，u=2.42）
        const uc=2.42,va=1.8,vb=2.44;
        ttruck(S,2.14,1.86,'v','#e0dcd0',{pal:TW,stripe:TEAL,d:2.2+2.1});
        S.o(uc+2.12,(x,n)=>{boxZ(x,uc-.06,va,.12,vb-va,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let v=va+.1;v<vb;v+=.3)boxZ(x,uc-.016,v-.016,.032,.032,2,17,'#aeb5b9','#c3c9cc','#848c90');
          for(let v=va+.16;v<vb-.05;v+=.3){boxZ(x,uc-.025,v-.025,.05,.05,2,10,'#d9b53a','#e6c14a','#b39227');
            for(const s of[-1,1]){const a=P(uc+s*.02,v,11),b=P(uc+s*.14,v+.06,14),c=P(uc+s*.19,v+.06,9);BL(x,a,b,'#c7a32f');BL(x,b,c,'#c7a32f');BL(x,[a[0],a[1]+1],[b[0],b[1]+1],'#8f7420');}}});
        ttruck(S,2.56,2.0,'v','#3d6c9a',{pal:TW,stripe:TEAL,d:2.62+2.2});
        L.canopy(S,uc-.3,va-.04,uc+.3,vb+.02,19,'#2f8a80','v',uc+.34+vb+.1);
        office(S,.22,2.38,.62,.32,1,17119,{band:'#2f8a80',door:.35});
        skid(S,L,1.1,2.36,.6,.3);
        for(const [u,c] of[[.24,'#e8ecee'],[.4,'#b8433a'],[.56,'#3d5f8a']])car(S,u,2.72,false,c);
        for(const [u,v] of[[.2,1.3],[1.12,1.3],[2.12,1.3],[2.12,.2]])fireMon(S,u,v);
        windsock(S,2.9,.68,22);
        tree(S,.8,2.92,.8,0);tree(S,1.2,2.93,.7,2);bush(S,1.55,2.94,3);
        lamp(S,.14,1.42,20);lamp(S,1.88,1.66,20);lamp(S,2.96,1.66,20);lamp(S,1.14,.1,20);lamp(S,1.86,2.94,20);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.655,.975]]);
          L.signL(g2,.9,SZ-E,'y');L.signL(g2,1.5,SZ-E,'r');L.signL(g2,SZ-E,1.0,'y');L.signL(g2,SZ-E,.5,'r');}};
      },
      // v1 單球＋臥罐組：左後一座特大球罐；右後四支臥式子彈罐並排（頂部橫跨走道）；左前火炬塔獨立圍區；
      // 中段裝卸台（車道沿 v、出口在左前圍籬）；右前壓縮機房＋空冷器＋控制室
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,curb,hazU,hazV,prack,fireMon,windsock,sphereTank,bullet,flare,compHouse,finfan,ttruck,office,lamp,tree,bush,car,boxZ,RC,BL,flat,pipeU,pipeV,sleepersV,sleepersU,TW,ZT}=L;
        pave(g,'k',0,0,SZ,SZ,17121);
        pave(g,'c',.12,.12,1.3,1.3,17122);curb(g,.12,.12,1.3,1.3);
        pave(g,'c',1.52,.12,1.38,1.3,17123);curb(g,1.52,.12,1.38,1.3);
        pave(g,'k',.08,2.2,.66,.76,17124);hazU(g,2.2,.08,.74);hazV(g,.74,2.2,2.96);
        pave(g,'a',.86,1.66,.84,1.3,17125);
        pave(g,'p',1.84,1.66,1.1,.62,17126);
        pave(g,'c',1.84,2.3,1.1,.64,17127);
        backFence(L)(g);
        L.fence(g,[.08,2.2],[.74,2.2]);
        for(const u of[1.72,2.02,2.32,2.62]){pipeV(g,u,1.3,1.56,GY);}
        pipeV(g,1.06,1.26,1.56,GY);
        lineV(g,.88,1.7,2.96,'#e2ddcd');lineV(g,1.68,1.7,2.96,'#e2ddcd');lineV(g,1.28,1.7,2.5,'#e3c04e');dashV(g,1.28,2.52,2.96,'#e8e2c8',.08,.07);
        lineU(g,1.72,.9,1.66,'#e3c04e');
        L.shadow(g,[['s',.76,.76,.5,26],['b',1.62,.3,.2,1.0,13],['b',1.92,.3,.2,1.0,13],['b',2.22,.3,.2,1.0,13],['b',2.52,.3,.2,1.0,13],
          ['c',.4,2.56,.04,84],['b',1.88,1.72,.98,.5,20],['b',1.92,2.34,.56,.3,15],['b',2.54,2.36,.34,.54,12]]);
        prack(S,'u',1.56,.14,2.9,12,[GY,'#a7aeb2',GY],1.56+1.1);
        sphereTank(S,.76,.76,.5,26,{legs:10,stair:1.2,ladder:1.95,ladderLen:.5});
        for(const u of[1.72,2.02,2.32,2.62])bullet(S,'v',.36,1.2,u,.12,8,{d:u+.9});
        // 臥罐頂部橫跨走道＋端梯
        S.o(2.8+.5,(x)=>{const z=rnd(8+.12*ZT)+1;boxZ(x,1.6,.44,1.2,.08,z,1,'#7d868b','#8a9398','#5a6368');
          BL(x,P(1.6,.52,z+4),P(2.8,.52,z+4),'#e0c24a');BL(x,P(1.6,.44,z+4),P(2.8,.44,z+4),'#c7a32f');
          for(let u=1.64;u<2.8;u+=.15){const p=P(u,.52,z+1);RC(x,p[0],p[1]-3,1,3,'#8a9296');}
          for(let k=0;k<6;k++){const p=P(2.82+k*.035,.48,z-k*2);RC(x,p[0]-2,p[1],4,1,'#5d666b');RC(x,p[0]-2,p[1]+1,4,1,'#353b3f');}});
        flare(S,.4,2.56,84,{ko:[.16,2.34],guys:[.3,1.9,3.8],guyR:.28});
        S.t(.75+2.6,(x)=>{L.fence(x,[.74,2.2],[.74,2.96]);});
        // 裝卸台（分隔島沿 v，u=1.28）
        const uc=1.28,va=1.8,vb=2.46;
        ttruck(S,1.0,1.9,'v','#e0dcd0',{pal:TW,stripe:ORG,d:1.06+2.1});
        S.o(uc+2.14,(x)=>{boxZ(x,uc-.06,va,.12,vb-va,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let v=va+.1;v<vb;v+=.3)boxZ(x,uc-.016,v-.016,.032,.032,2,17,'#aeb5b9','#c3c9cc','#848c90');
          for(let v=va+.16;v<vb-.05;v+=.3){boxZ(x,uc-.025,v-.025,.05,.05,2,10,'#d9b53a','#e6c14a','#b39227');
            for(const s of[-1,1]){const a=P(uc+s*.02,v,11),b=P(uc+s*.14,v+.06,14),c=P(uc+s*.19,v+.06,9);BL(x,a,b,'#c7a32f');BL(x,b,c,'#c7a32f');BL(x,[a[0],a[1]+1],[b[0],b[1]+1],'#8f7420');}}});
        ttruck(S,1.42,2.02,'v','#b8433a',{pal:TW,stripe:ORG,d:1.5+2.24});
        L.canopy(S,uc-.3,va-.04,uc+.3,vb+.02,19,'#d0802f','v',uc+.34+vb+.1);
        compHouse(S,1.88,1.72,.98,.5,13,6,{ridge:'v',door:.12,stacks:[[2.5,1.86],[2.72,1.86]],seed:17128});
        finfan(S,1.92,2.34,.56,.3,9,3);
        office(S,2.54,2.36,.34,.54,1,17129,{band:'#d0802f',door:.5});
        for(const [u,v] of[[.14,1.36],[1.4,.2],[1.46,1.36],[2.9,1.36]])fireMon(S,u,v);
        windsock(S,.68,2.26,22);
        for(const [u,c] of[[1.9,'#e8ecee'],[2.06,'#3d5f8a'],[2.22,'#c9cdd0']])car(S,u,2.74,false,c);
        tree(S,2.44,2.95,.7,1);bush(S,1.78,2.94,3);
        lamp(S,.86,1.62,20);lamp(S,1.74,1.64,20);lamp(S,2.96,1.64,20);lamp(S,1.46,.1,20);lamp(S,.1,1.46,20);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.285,.565]]);
          L.signL(g2,.4,SZ-E,'y');L.signL(g2,2.2,SZ-E,'r');L.signL(g2,SZ-E,1.0,'y');L.signL(g2,SZ-E,2.0,'r');}};
      },
      // v2 三球一列＋火炬在後：北角火炬塔最高；三座中型球罐沿後緣一列；左側三支臥罐沿 v；
      // 中段壓縮機房＋空冷器；前段裝卸台（車道沿 u、出口在右前圍籬）；左前計量撬、前排控制室
      (g,ng,S,L)=>{const {P,pave,lineU,lineV,dashU,dashV,curb,hazU,hazV,prack,fireMon,windsock,sphereTank,bullet,flare,compHouse,finfan,ttruck,office,lamp,tree,bush,car,boxZ,RC,BL,flat,pipeU,pipeV,sleepersU,sleepersV,TW,ZT}=L;
        pave(g,'k',0,0,SZ,SZ,17131);
        pave(g,'c',.66,.12,2.24,.9,17132);curb(g,.66,.12,2.24,.9);
        pave(g,'c',.12,.98,.96,1.36,17133);curb(g,.12,.98,.96,1.36);
        hazU(g,.6,.08,.6);hazV(g,.6,.08,.6);
        pave(g,'p',1.22,1.3,1.7,.56,17134);
        pave(g,'a',1.14,1.96,1.84,.66,17135);
        pave(g,'c',1.14,2.64,1.8,.3,17136);
        pave(g,'p',.14,2.44,.9,.5,17137);
        backFence(L)(g);
        L.fence(g,[.6,.08],[.6,.6]);L.fence(g,[.08,.6],[.6,.6]);
        for(const u of[1.0,1.74,2.48]){pipeV(g,u+.26,.8,1.18,GY);}
        pipeU(g,2.3,.3,1.1,GY);pipeU(g,2.36,.3,1.1,'#a7aeb2');
        lineU(g,1.98,1.16,2.98,'#e2ddcd');lineU(g,2.62,1.16,2.98,'#e2ddcd');lineU(g,2.3,1.16,2.2,'#e3c04e');dashU(g,2.3,2.22,2.98,'#e8e2c8',.08,.07);
        for(let k=0;k<=6;k++){const u=2.02+k*.13;lineV(g,u,2.68,2.92,'#dedad0');}
        L.shadow(g,[['c',.33,.34,.04,96],['s',1.0,.56,.32,18],['s',1.74,.56,.32,18],['s',2.48,.56,.32,18],
          ['b',.2,1.16,.2,1.02,12],['b',.48,1.16,.2,1.02,12],['b',.76,1.16,.2,1.02,12],['b',1.3,1.36,.86,.46,20],['b',2.34,1.36,.52,.4,15],['b',1.2,2.68,.7,.24,11]]);
        prack(S,'u',1.2,1.1,2.9,12,[GY,'#a7aeb2',GY],1.2+1.1);
        prack(S,'v',1.12,1.2,2.0,12,[GY,GY],1.12+1.3);
        flare(S,.33,.34,96,{ko:[.1,.14],guys:[.2,1.5,3.2],guyR:.24});
        for(const u of[1.0,1.74,2.48])sphereTank(S,u,.56,.32,18,{stair:1.15,ladder:1.9,ladderLen:.36,legs:8});
        for(const u of[.3,.58,.86])bullet(S,'v',1.24,2.12,u,.11,8,{d:u+1.9});
        S.t(.86+1.35,(x)=>{const z=rnd(8+.11*ZT)+1;boxZ(x,.2,1.3,.8,.07,z,1,'#7d868b','#8a9398','#5a6368');BL(x,P(.2,1.37,z+4),P(1.0,1.37,z+4),'#e0c24a');
          for(let k=0;k<6;k++){const p=P(1.02+k*.035,1.33,z-k*2);RC(x,p[0]-2,p[1],4,1,'#5d666b');RC(x,p[0]-2,p[1]+1,4,1,'#353b3f');}});
        S.t(.6+.64,(x)=>{L.fence(x,[.6,.08],[.6,.6]);L.fence(x,[.08,.6],[.6,.6]);});
        compHouse(S,1.3,1.36,.86,.46,13,6,{ridge:'v',door:.15,stacks:[[1.9,1.5],[2.06,1.5]],seed:17138});
        finfan(S,2.34,1.36,.52,.4,9,2);
        // 裝卸台（分隔島沿 u，v=2.3）
        const vc=2.3,ua=1.62,ub=2.42;
        ttruck(S,1.74,2.06,'u','#e0dcd0',{pal:TW,stripe:BLU,d:2.0+2.1});
        S.o(2.0+vc,(x)=>{boxZ(x,ua,vc-.06,ub-ua,.12,0,2,'#dedace','#cfcbbf','#aaa699');
          for(let u=ua+.1;u<ub;u+=.3)boxZ(x,u-.016,vc-.016,.032,.032,2,17,'#aeb5b9','#c3c9cc','#848c90');
          for(let u=ua+.16;u<ub-.05;u+=.3){boxZ(x,u-.025,vc-.025,.05,.05,2,10,'#d9b53a','#e6c14a','#b39227');
            for(const s of[-1,1]){const a=P(u,vc+s*.02,11),b=P(u+.06,vc+s*.14,14),c=P(u+.06,vc+s*.19,9);BL(x,a,b,'#c7a32f');BL(x,b,c,'#c7a32f');BL(x,[a[0],a[1]+1],[b[0],b[1]+1],'#8f7420');}}});
        ttruck(S,1.9,2.44,'u','#2f6f7a',{pal:TW,stripe:BLU,d:2.2+2.5});
        L.canopy(S,ua-.04,vc-.3,ub+.02,vc+.3,19,'#2d6fb0','u',ub+vc+.4);
        skid(S,L,.2,2.5,.62,.34);
        office(S,1.2,2.68,.7,.24,1,17139,{band:'#2d6fb0',door:.3});
        for(const [u,c] of[[2.04,'#e8ecee'],[2.17,'#b8433a'],[2.43,'#3d5f8a'],[2.56,'#c9cdd0']])car(S,u,2.7,false,c);
        for(const [u,v] of[[.7,.2],[1.37,1.0],[2.12,1.0],[2.86,.2],[1.04,1.9]])fireMon(S,u,v);
        windsock(S,.56,.56,22);
        tree(S,2.9,2.94,.7,0);bush(S,1.1,2.95,3);
        lamp(S,.64,.66,20);lamp(S,1.14,1.94,20);lamp(S,2.96,1.3,20);lamp(S,2.96,2.66,20);lamp(S,.1,2.4,20);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.66,.885]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);
          L.signL(g2,.6,SZ-E,'y');L.signL(g2,1.6,SZ-E,'r');L.signL(g2,SZ-E,.8,'y');L.signL(g2,SZ-E,1.4,'r');}};
      },
    ];
    build(171,K171);
  }catch(e){console.error('logi_d k171',e);errs.push('k171:'+(e&&e.stack||e));}

  if(errs.length)window.__logi_d_errs=errs;
});
