// T609 logi_e：k169 糧食筒倉／k172 鋼材物流場（皆 2×2，畫布 136×150，錨 68,148）實驗線重畫。
// 曲面件（筒倉、鋼捲、錐頂）走逐像素射線投射（本作等距＝正交投影：水平 1 格＝45.25px、垂直 1 格＝39.19px），
// 依法線打光分六階硬邊色帶；筒倉的波紋、加勁、滑模施工縫、鋼捲端面的捲紋與鋼捲眼都在曲面座標上著色。
// 其餘沿用 logi_a～d 的分層合成：地坪直接畫、立體件各自二值化＋深色外框、細線不描邊；
// 夜圖只點白天畫出的燈具（燈頭、窗、門口燈、吊車紅色警示燈），被前景擋住的燈會被擦掉。
// 光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function logi_e(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const W=136,H=150,AX=68,AY=148,SZ=2;
  const DEV={};            // 迭代用：{169:[1,2,0]}；定稿必須是 {}
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

    // ---------- 射線投射（曲面件）----------
    const ZT=39.1918,DU=.61237244,DZ=.5,A2=2*DU*DU;
    const LV=(()=>{const l=[-.34,.74,.58],m=Math.hypot(l[0],l[1],l[2]);return[l[0]/m,l[1]/m,l[2]/m];})();
    const lum=n=>n[0]*LV[0]+n[1]*LV[1]+n[2]*LV[2];
    const TI=[.8,.58,.36,.14,-.1];
    const ti=(n,b=0)=>{const l=lum(n)+b;let k=0;while(k<5&&l<=TI[k])k++;return k;};
    const tone=(pal,n,b=0,dk=0)=>pal[Math.max(0,Math.min(pal.length-1,ti(n,b)+dk))];
    const vcyl=(u,v,r,z0,z1,col,o={})=>({k:'c',u,v,r,z0:z0/ZT,z1:z1/ZT,top:o.top||'flat',rise:(o.rise||0)/ZT,arc:o.arc||null,col,
      bb:[u-r,u+r,v-r,v+r,z0/ZT,(z1+(o.rise||0))/ZT]});
    const capU=(u0,u1,v,z,r,col,o={})=>({k:'cu',u0,u1,v,z:z/ZT,r,cap:!!o.cap,col,bb:[u0-r,u1+r,v-r,v+r,z/ZT-r,z/ZT+r]});
    const capV=(v0,v1,u,z,r,col,o={})=>({k:'cv',v0,v1,u,z:z/ZT,r,cap:!!o.cap,col,bb:[u-r,u+r,v0-r,v1+r,z/ZT-r,z/ZT+r]});
    const rbox=(u0,v0,du,dv,z0,h,col)=>({k:'b',u0,u1:u0+du,v0,v1:v0+dv,z0:z0/ZT,z1:(z0+h)/ZT,col,bb:[u0,u0+du,v0,v0+dv,z0/ZT,(z0+h)/ZT]});
    const hS=(ou,ov,s)=>{const x=ou-s.u,y=ov-s.v,z=-s.z,b=DU*(x+y)+DZ*z,c=x*x+y*y+z*z-s.r*s.r,d=b*b-c;if(d<0)return null;const t=-b+Math.sqrt(d);
      return{t,n:[(x+DU*t)/s.r,(y+DU*t)/s.r,(z+DZ*t)/s.r],zp:DZ*t*ZT,part:'s'};};
    const inArc=(s,an)=>{if(!s.arc)return true;let a=an;while(a<s.arc[0])a+=2*Math.PI;while(a>s.arc[0]+2*Math.PI)a-=2*Math.PI;return a<=s.arc[1];};
    const hC=(ou,ov,s)=>{const x=ou-s.u,y=ov-s.v,r2=s.r*s.r,b=DU*(x+y),c=x*x+y*y-r2,d=b*b-A2*c;
      if(d<0)return null;const sq=Math.sqrt(d);
      if(s.top==='none'){for(const t of[(-b+sq)/A2,(-b-sq)/A2]){const z=DZ*t;if(z<s.z0||z>s.z1)continue;const px=x+DU*t,py=y+DU*t,an=Math.atan2(py,px);if(!inArc(s,an))continue;
          return{t,n:[px/s.r,py/s.r,0],part:'side',zp:z*ZT,ang:an};}return null;}
      if(s.top==='cone'){const t0=(s.z1+s.rise)/DZ,t1=s.z1/DZ;
        for(let t=t0;t>t1;t-=.004){const a=x+DU*t,bb=y+DU*t,rho=Math.sqrt(a*a+bb*bb);if(rho>s.r)continue;const q=rho/s.r;
          const zr=s.z1+s.rise*(1-q);
          if(DZ*t<=zr){const k=s.rise/s.r/(rho||1e-6);
            const gx=k*a,gy=k*bb,m=Math.hypot(gx,gy,1);return{t,n:[gx/m,gy/m,1/m],part:'roof',rho,lu:a,lv:bb,zp:DZ*t*ZT};}}}
      const tt=s.z1/DZ,tx=x+DU*tt,ty=y+DU*tt,rr=tx*tx+ty*ty;
      if(rr<=r2){const rho=Math.sqrt(rr);return{t:tt,n:[0,0,1],part:'top',rho,lu:tx,lv:ty,zp:s.z1*ZT};}
      const t=(-b+sq)/A2,z=DZ*t;if(z<s.z0||z>s.z1)return null;const px=x+DU*t,py=y+DU*t;
      return{t,n:[px/s.r,py/s.r,0],part:'side',zp:z*ZT,ang:Math.atan2(py,px)};};
    const hCU=(ou,ov,s)=>{const y=ov-s.v,z=-s.z,a=DU*DU+DZ*DZ,b=DU*y+DZ*z,c=y*y+z*z-s.r*s.r,d=b*b-a*c;let best=null;
      if(d>=0){const t=(-b+Math.sqrt(d))/a,u=ou+DU*t;if(u>=s.u0&&u<=s.u1)best={t,n:[0,(y+DU*t)/s.r,(z+DZ*t)/s.r],part:'side',lu:u-s.u0,zp:DZ*t*ZT};}
      const t=(s.u1-ou)/DU,y1=y+DU*t,z1=z+DZ*t;if(y1*y1+z1*z1<=s.r*s.r&&(!best||t>best.t))best={t,n:[1,0,0],part:'end',zp:DZ*t*ZT,lu:s.u1-s.u0,ea:y1,eb:z1};
      return best;};
    const hCV=(ou,ov,s)=>{const x=ou-s.u,z=-s.z,a=DU*DU+DZ*DZ,b=DU*x+DZ*z,c=x*x+z*z-s.r*s.r,d=b*b-a*c;let best=null;
      if(d>=0){const t=(-b+Math.sqrt(d))/a,v=ov+DU*t;if(v>=s.v0&&v<=s.v1)best={t,n:[(x+DU*t)/s.r,0,(z+DZ*t)/s.r],part:'side',lv:v-s.v0,zp:DZ*t*ZT};}
      const t=(s.v1-ov)/DU,x1=x+DU*t,z1=z+DZ*t;if(x1*x1+z1*z1<=s.r*s.r&&(!best||t>best.t))best={t,n:[0,1,0],part:'end',zp:DZ*t*ZT,lv:s.v1-s.v0,ea:x1,eb:z1};
      return best;};
    const hB=(ou,ov,s)=>{let tn=-1e9,tf=1e9,ax=-1;
      const sl=(o,d,lo,hi,i)=>{const a=(lo-o)/d,b=(hi-o)/d;if(a>tn)tn=a;if(b<tf){tf=b;ax=i;}};
      sl(ou,DU,s.u0,s.u1,0);sl(ov,DU,s.v0,s.v1,1);sl(0,DZ,s.z0,s.z1,2);
      if(tn>tf)return null;const n=[0,0,0];n[ax]=1;return{t:tf,n,part:'box',zp:DZ*tf*ZT};};
    const HIT={c:hC,cu:hCU,cv:hCV,b:hB};
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
    const flatCol=(top,left,right)=>(h)=>h.n[2]>.5?top:h.n[1]>.5?left:h.n[0]>.5?right:tone([left,left,top,right,right,SH(right,-14)],h.n);
    const palCol=(pal,b=0)=>(h)=>tone(pal,h.n,b);

    // ---------- 色票 ----------
    const STL=['#b9c0c4','#a9b0b4','#98a0a4','#879094','#788085','#6a7277'];     // 鋼構灰
    const CON=['#d8d5cc','#cbc8be','#bdbab0','#aeaba1','#9f9c93','#908d84'];     // 混凝土
    const CONC=['#f1eee5','#e5e1d6','#d6d1c5','#c3beb2','#aca79b','#948f84'];    // 筒倉滑模混凝土（偏暖）
    const GALV=['#f4f7f8','#e3e8eb','#ccd3d7','#b1b9be','#969fa5','#7d868d'];    // 鍍鋅波紋鋼
    const ROOFG=['#e6eaec','#d3d9dc','#bcc4c8','#a3acb1','#8a949a','#737d83'];   // 錐頂鋼板
    const RED=['#e27a6c','#d4675a','#c2574b','#ad4a3f','#963f36','#7f352d'];

    // ---------- 地坪 ----------
    const MATS={
      a:{t:['#6f6d69','#6a6864','#75736e'],j:null,s:.125,p:.7},         // 瀝青
      k:{t:['#aaa598','#a39e92','#b2ada0'],j:null,s:.0625,p:.55},       // 碎石
      c:{t:['#bdb9ae','#b7b3a8','#c3bfb4'],j:'#aba79c',s:.25,p:.6},     // 混凝土
      p:{t:['#c6c3b9','#c0bdb3','#ccc9bf'],j:'#b3b0a6',s:.125,p:.65},   // 設備基座混凝土
      y:{t:['#9f9a8d','#98938a','#a7a296'],j:'#8f8a7f',s:.25,p:.6},     // 堆場重載混凝土（偏深）
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.7},         // 草
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*14);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,'#63615d');}}
      if(m==='k'){for(let i=0;i<rnd(du*dv*10);i++){const p=P(u0+.03+hsh(seed,i,41)*(du-.06),v0+.03+hsh(seed,i,42)*(dv-.06));RC(g,p[0],p[1],1,1,hsh(seed,i,43)<.5?SH(M.t[0],-16):SH(M.t[0],14));}}};
    const lineU=(g,v,u0,u1,c,z=0)=>BL(g,P(u0,v,z),P(u1,v,z),c);
    const lineV=(g,u,v0,v1,c,z=0)=>BL(g,P(u,v0,z),P(u,v1,z),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const hazU=(g,v,u0,u1)=>{let k=0;for(let u=u0;u<u1-.01;u+=.04,k++)BL(g,P(u,v),P(Math.min(u1,u+.04),v),k%2?'#2b2b2b':'#e3bf3a');};
    const hazV=(g,u,v0,v1)=>{let k=0;for(let v=v0;v<v1-.01;v+=.04,k++)BL(g,P(u,v),P(u,Math.min(v1,v+.04)),k%2?'#2b2b2b':'#e3bf3a');};
    // 圍籬（後側在地面層、前側最後畫）；gaps＝[[t0,t1],…]
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),L=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(3,Math.round(L/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};
    const signL=(g,u,v,kind='r')=>{const p=P(u,v,6);if(kind==='r'){RC(g,p[0]-2,p[1]-1,5,4,'#f1efe8');RC(g,p[0]-1,p[1],3,2,'#c0392b');}else{RC(g,p[0]-2,p[1]-1,5,4,'#e8c23a');RC(g,p[0],p[1],1,2,'#2b2b2b');}};
    // 路燈（細桿）／高桿投光燈：夜裡只亮燈頭
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
    // 平頂建築
    const flatB=(g,u0,v0,du,dv,h,wl,wr,roof)=>{boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.03,v0+.03,du-.06,dv-.06,roof,h);
      BL(g,P(u0+.03,v0+.03,h),P(u0+du-.03,v0+.03,h),SH(roof,-20));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v0+dv-.03,h),SH(roof,-14));BL(g,P(u0,v0+dv,h),P(u0+du,v0+dv,h),SH(wl,18));};
    const office=(S,u0,v0,du,dv,fl,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const fh=7,h=fl*fh+3,wl=o.wl||'#e7e3d9',wr=o.wr||'#bdb8ad',gl=o.gl||'#4b7394';
      flatB(g,u0,v0,du,dv,h,wl,wr,o.roof||'#8d9498');
      for(let f=0;f<fl;f++){rowL(g,n,u0+.03,u0+du-.03,v0+dv,3+f*fh,4,3,2,gl,seed+f,.6);rowR(g,n,u0+du,v0+.03,v0+dv-.03,3+f*fh,3,3,2,gl,seed+f*7,.5);}
      if(o.band)faceL(g,v0+dv,u0,u0+du,h-2,h-1,o.band);
      const um=u0+du*(o.door||.5);boxZ(g,um-.08,v0+dv,.16,.06,6,1,'#eef0f1','#f6f7f8','#b8bfc3');winL(g,um-.04,v0+dv,0,3,6,'#2f4c63');if(n)winL(n,um-.04,v0+dv,0,3,6,'#ffe6a8');
      const lp=P(um,v0+dv+.06,7);RC(g,lp[0]-1,lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0]-1,lp[1],2,1,'#ffe6a0');
      boxZ(g,u0+du*.2,v0+dv*.25,.12,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');});
    const hut=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const wl=o.wl||'#dcd8cc',wr=o.wr||'#b3aea2',roof=o.roof||'#7d868b';
      flatB(g,u0,v0,du,dv,h,wl,wr,roof);
      if(o.door){const t=u0+du*o.door;winL(g,t,v0+dv,0,4,Math.min(7,h-2),o.doorC||'#5d6a72');}
      if(o.win){winL(g,u0+du*o.win,v0+dv,h-7,4,3,'#4b7394');if(n)winL(n,u0+du*o.win,v0+dv,h-7,4,3,'#ffe3a0');}
      if(o.winR){winR(g,u0+du,v0+dv*o.winR,h-7,3,3,'#40637f');if(n)winR(n,u0+du,v0+dv*o.winR,h-7,3,3,'#f3d68e');}
      if(o.lampOver){const lp=P(u0+du*(o.door||.5)+.08,v0+dv,Math.min(8,h-2)+1);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');}
      if(o.ac)boxZ(g,u0+du*.55,v0+dv*.3,.1,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');});
    // 鐵路：道碴床＋木枕＋鋼軌（軌距 ±GA）
    const GA=.06;
    const trackU=(g,v,u0,u1,seed=1)=>{
      flat(g,u0,v-.16,u1-u0,.32,'#716d66');flat(g,u0,v-.125,u1-u0,.25,'#88847c');
      const n=rnd((u1-u0)*150);for(let i=0;i<n;i++){const p=P(u0+.01+hsh(seed,i,52)*(u1-u0-.02),v-.15+hsh(seed,i,51)*.3),q=hsh(seed,i,53);
        RC(g,p[0],p[1],1,1,q<.36?'#aaa59b':q<.74?'#5f5b55':'#c2bdb2');}
      lineU(g,v-.16,u0,u1,'#5c5852');lineU(g,v+.16,u0,u1,'#a09b91');
      for(let u=u0+.035;u<u1-.01;u+=.07){BL(g,P(u,v-.095),P(u,v+.095),'#5a4d42');BL(g,P(u-.018,v-.095),P(u-.018,v+.095),'#7b6c5d');}
      for(const k of[-GA,GA]){lineU(g,v+k,u0,u1,'#43484c');lineU(g,v+k,u0,u1,'#dfe4e6',1);}};
    const trackV=(g,u,v0,v1,seed=1)=>{
      flat(g,u-.16,v0,.32,v1-v0,'#716d66');flat(g,u-.125,v0,.25,v1-v0,'#88847c');
      const n=rnd((v1-v0)*150);for(let i=0;i<n;i++){const p=P(u-.15+hsh(seed,i,51)*.3,v0+.01+hsh(seed,i,52)*(v1-v0-.02)),q=hsh(seed,i,53);
        RC(g,p[0],p[1],1,1,q<.36?'#aaa59b':q<.74?'#5f5b55':'#c2bdb2');}
      lineV(g,u+.16,v0,v1,'#5c5852');lineV(g,u-.16,v0,v1,'#98938a');
      for(let v=v0+.035;v<v1-.01;v+=.07){BL(g,P(u-.095,v),P(u+.095,v),'#5a4d42');BL(g,P(u-.095,v-.018),P(u+.095,v-.018),'#7b6c5d');}
      for(const k of[-GA,GA]){lineV(g,u+k,v0,v1,'#43484c');lineV(g,u+k,v0,v1,'#dfe4e6',1);}};
    // 轉向架＋輪對（沿 ax 的車廂，t＝沿車長位置）
    const bogie=(g,ax,u,v,t)=>{if(ax==='u'){boxZ(g,u+t-.05,v-.05,.1,.1,1,2,'#34373a','#44484b','#2a2d2f');
        for(const s of[-.03,.03]){const p=P(u+t+s,v+GA,1);RC(g,p[0]-1,p[1]-1,3,2,'#1f2123');RC(g,p[0],p[1]-1,1,1,'#8d9498');}}
      else{boxZ(g,u-.05,v+t-.05,.1,.1,1,2,'#34373a','#44484b','#2a2d2f');
        for(const s of[-.03,.03]){const p=P(u+GA,v+t+s,1);RC(g,p[0]-1,p[1]-1,3,2,'#1f2123');RC(g,p[0],p[1]-1,1,1,'#8d9498');}}};
    // 淺色鋼梯：自平台端（z0）沿 ax 往 dir 方向下到地面
    const steelStair=(x,ax,u,v,dir,len,z0,w=.08)=>{const at=(f,o,z)=>ax==='v'?P(u+o,v+dir*len*f,z):P(u+dir*len*f,v+o,z),n=Math.max(3,Math.round(z0/2));
      BL(x,at(0,-w/2,z0),at(1,-w/2,0),'#7b8388');
      for(let k=0;k<n;k++){const f=(k+.5)/n,z=Math.max(0,rnd(z0*(1-f))),a=at(f,-w/2,z),b=at(f,w/2,z);BL(x,a,b,k%2?'#d3d9dc':'#eef1f2');BL(x,[a[0],a[1]+1],[b[0],b[1]+1],'#5f676c');}
      BL(x,at(0,w/2,z0),at(1,w/2,0),'#737b80');BL(x,at(0,w/2,z0+4),at(1,w/2,4),'#e8c84e');};
    // 落影（影子落向右）：['b',u0,v0,du,dv,h] 方盒／['c',u,v,r,h] 立式圓柱
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else if(s[0]==='c'){const[,u,v,r,h,z=0]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45,z);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    return{P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,ribsL,ribsR,pg,winL,winR,rowL,rowR,RX,ell,scene,shadow,
      ZT,ti,tone,vcyl,capU,capV,rbox,rcast,flatCol,palCol,STL,CON,CONC,GALV,ROOFG,RED,
      MATS,pave,lineU,lineV,dashU,dashV,hazU,hazV,fence,signL,lamp,mast,tree,bush,car,flatB,office,hut,
      GA,trackU,trackV,bogie,steelStair};
  };

  // ---------- 車輛（兩類共用）----------
  // 卡車：ax 沿 u／v；(u,v) 為車身最小角；車頭朝 +ax（dir=1）或 −ax（dir=-1）
  // o.load：'hop' 穀物漏斗車（篷布頂＋漏斗底）／'flat' 平板（o.cargo(g,n,deckZ) 自畫貨物）／'box' 廂型
  const truckFn=(L)=>(S,u,v,ax,o={})=>{const {P,RC,boxZ,faceL,faceR,ribsL,ribsR,BL}=L,Ln=o.L||.5,Wd=.1,dir=o.dir||1;
    S.o(o.d!=null?o.d:u+v+Ln*.5+.06,(g,n)=>{const cab=o.cab||'#c9572f';
      const bz=(a0,da,c0,dc,z,h,t,l,r)=>ax==='u'?boxZ(g,u+a0,v+c0,da,dc,z,h,t,l,r):boxZ(g,u+c0,v+a0,dc,da,z,h,t,l,r);
      const cabA=dir>0?Ln-.13:0,trA=dir>0?0:.14,TL=Ln-.14;
      bz(.01,Ln-.02,.01,Wd-.02,1,2,'#3d4145','#4a4e52','#2f3235');
      for(const t of(dir>0?[.05,.12,Ln-.08]:[.08,Ln-.12,Ln-.05])){const p=ax==='u'?P(u+t,v+Wd,0):P(u+Wd,v+t,0);RC(g,p[0]-(ax==='u'?0:1),p[1]-2,2,2,'#1e2023');}
      if(o.load==='hop'){const col=o.col||'#c9c3b4';
        for(let k=0;k<2;k++){const a=trA+.05+k*.17;bz(a,.1,.02,Wd-.04,2,3,SH(col,-30),SH(col,-24),SH(col,-44));}
        bz(trA+.01,TL,0,Wd,5,7,SH(col,14),col,SH(col,-36));
        if(ax==='u')ribsL(g,u+trA+.01,u+trA+TL,v+Wd,5,12,SH(col,-10),3);else ribsR(g,u+Wd,v+trA+.01,v+trA+TL,5,12,SH(col,-10),3);
        bz(trA+.02,TL-.02,.012,Wd-.024,12,1,o.tarp||'#556b45',SH(o.tarp||'#556b45',8),SH(o.tarp||'#556b45',-20));}
      else if(o.load==='flat'){bz(trA+.01,TL,0,Wd,3,2,'#6d6660','#7f776f','#4f4944');if(o.cargo)o.cargo(g,n,5);}
      else{const col=o.col||'#e6e7e3';bz(trA+.01,TL,0,Wd,3,11,SH(col,10),col,SH(col,-34));}
      bz(cabA,.12,-.005,Wd+.01,1,9,SH(cab,26),cab,SH(cab,-46));
      if(dir>0){if(ax==='v'){faceL(g,v+Ln-.01,u+.014,u+Wd-.01,5,8,'#34506a');if(n){const a=P(u+.014,v+Ln-.01,2),b=P(u+Wd-.014,v+Ln-.01,2);RC(n,a[0],a[1],1,1,'#fff3c8');RC(n,b[0]-1,b[1],1,1,'#fff3c8');}}
        else{faceR(g,u+Ln-.01,v+.014,v+Wd-.01,5,8,'#2c465c');if(n){const a=P(u+Ln-.01,v+.014,2),b=P(u+Ln-.01,v+Wd-.014,2);RC(n,a[0],a[1],1,1,'#fff3c8');RC(n,b[0],b[1],1,1,'#fff3c8');}}}
      else{if(ax==='u')faceL(g,v+Wd+.005,u+.02,u+.08,5,8,'#3b5870');else faceR(g,u+Wd+.005,v+.02,v+.08,5,8,'#2c465c');}});};

  // 組裝：每類一個 K、每變體獨立畫布
  const E=.04;
  const build=(k,layouts)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null;L.truck=truckFn(L);
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}};
  const backFence=(L,gU=[],gV=[])=>(g)=>{L.fence(g,[E,E],[SZ-E,E],gU);L.fence(g,[E,E],[E,SZ-E],gV);};
  const frontFence=(L,gU=[],gV=[])=>(g)=>{L.fence(g,[SZ-E,E],[SZ-E,SZ-E],gU);L.fence(g,[E,SZ-E],[SZ-E,SZ-E],gV);};

  // ================= k169 糧食筒倉 =================
  try{
    const SL=(L)=>{const {P,hsh,RC,RX,BL,fp,flat,boxZ,faceL,faceR,ribsL,ribsR,winL,winR,rowL,rowR,vcyl,rbox,rcast,ti,tone,palCol,flatCol,CONC,GALV,ROOFG,STL,CON}=L;
      // 筒倉曲面材質：kind 'c' 混凝土滑模（施工縫、壓頂、雨痕）／'s' 鍍鋅波紋鋼（水平波紋、直向加勁、側梯）
      const siloMat=(o)=>(h)=>{const Hh=o.h,pal=o.pal;
        if(h.part==='side'){const z=h.zp,an=h.ang,C=2*Math.PI*o.r*45.25;let k=ti(h.n,o.b||0);
          if(o.kind==='s'){
            if(o.ladder!=null){let d=an-o.ladder;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const wd=d*C/(2*Math.PI);
              if(wd>-1.5&&wd<1.5&&z>2&&z<Hh){if(wd<-.5||wd>.5)return '#5d656b';return (Math.floor(z)%2)?'#8c959b':'#4d555b';}}
            const n=o.stiff||12,s=an*n/(2*Math.PI),thr=.5*n/C;
            if(z>Hh-1.3)return pal[Math.max(0,k-1)];
            if(z<2)return CON[Math.min(5,k+1)];
            if(Math.abs(s-Math.round(s))<thr)return pal[Math.min(5,k+1)];
            if(Math.floor(z)%3===0)k=Math.min(5,k+1);
            return pal[k];}
          if(z>Hh-1.5)return pal[Math.max(0,k-1)];
          if(z>Hh-3)return pal[Math.min(5,k+1)];
          if(((Math.floor(z)+(o.jo||0))%9)===0&&z>3)k=Math.min(5,k+1);
          const bin=Math.floor((an+Math.PI)*C/(2*Math.PI)/2);if(hsh(o.seed||1,bin,7)<.2&&z>Hh*.5)k=Math.min(5,k+1);
          if(z<1.5)k=Math.min(5,k+1);
          return pal[k];}
        if(h.part==='roof'){const rp=o.roofPal||ROOFG,q=h.rho/o.r;if(q>.93)return rp[4];if(q<.14)return rp[3];
          const an=Math.atan2(h.lv,h.lu),n=o.ribs||16,s=an*n/(2*Math.PI),thr=.5*n/(2*Math.PI*h.rho*45.25);
          if(q>.2&&Math.abs(s-Math.round(s))<thr)return tone(rp,h.n,-.14);return tone(rp,h.n,.02);}
        if(h.part==='top'){const c=o.topCol||'#cfcabe';return h.rho>o.r-.018?SH(c,-22):c;}
        return pal[2];};
      const silo=(u,v,r,h,o={})=>{const kind=o.kind||'c',top=kind==='s'?'cone':'flat',rise=top==='cone'?(o.rise||Math.max(5,rnd(r*34))):0;
        const pal=o.pal||(kind==='s'?GALV:CONC),z0=o.z0||0,m=siloMat({...o,kind,h,r,pal});
        const pr=[vcyl(u,v,r,z0,z0+h,z0?(hh)=>{hh.zp-=z0;return m(hh);}:m,{top,rise})];
        if(top==='cone'){pr.push(vcyl(u,v,.03,z0+h+rise-2,z0+h+rise+2,palCol(GALV,.1)));pr.push(vcyl(u,v,.048,z0+h+rise+2,z0+h+rise+3,palCol(ROOFG,.1)));}
        return pr;};
      // 漏斗底鋼倉（架高、直接裝卡車）：四腳、倒錐底、錐頂
      const hopBin=(S,u,v,r,z0,h,o={})=>S.o(o.d!=null?o.d:u+v+r,(x)=>{const lr=r*.74;
        for(const [a,b] of[[-1,-1],[1,-1],[-1,1]])boxZ(x,u+a*lr-.013,v+b*lr-.013,.026,.026,0,z0+3,'#8e979c','#a9b1b5','#6f787d');
        const c=P(u,v,z0),rx=RX(r),ap=P(u,v,z0-11);
        fp(x,[[c[0]-rx,c[1]],[c[0],c[1]+rx*.5],[ap[0]+1,ap[1]]],'#d3d9dc');fp(x,[[c[0],c[1]+rx*.5],[c[0]+rx+1,c[1]],[ap[0]+1,ap[1]]],'#98a1a6');
        RC(x,ap[0]-1,ap[1],3,3,'#6f787d');RC(x,ap[0],ap[1]+3,1,3,'#5d656a');
        rcast(x,silo(u,v,r,h,{kind:'s',z0,rise:o.rise||6,stiff:8,seed:o.seed||5}),{edgeT:.04});
        boxZ(x,u+lr-.013,v+lr-.013,.026,.026,0,z0+3,'#8e979c','#a9b1b5','#6f787d');
        BL(x,P(u-lr,v+lr,z0*.3),P(u+lr,v+lr,z0*.8),'#9aa3a8');BL(x,P(u-lr,v+lr,z0*.8),P(u+lr,v+lr,z0*.3),'#9aa3a8');});
      // 頭房（升運機塔）：混凝土塔身＋金屬包覆的頂部機房、豎向樓梯窗列、施工縫
      const headhouse=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const u1=u0+du,v1=v0+dv;
        boxZ(g,u0,v0,du,dv,0,h,'#d3cec2',CONC[1],CONC[4]);
        for(let z=9;z<h-3;z+=9){BL(g,P(u0,v1,z),P(u1,v1,z),CONC[2]);BL(g,P(u1,v1,z),P(u1,v0,z),CONC[5]);}
        BL(g,P(u0,v1,h),P(u1,v1,h),CONC[0]);
        // 窗列：+v 面兩列、+u 面一列（夜裡只亮一部分）
        for(const t of(o.winCols||[.3,.72]))for(let z=12,k=0;z<h-6;z+=11,k++){winL(g,u0+du*t,v1,z,2,4,'#4d6f88');if(n&&hsh(o.seed||3,k,t*10|0)<.35)winL(n,u0+du*t,v1,z,2,4,'#ffe3a0');}
        for(let z=16,k=0;z<h-6;z+=11,k++){winR(g,u1,v0+dv*.5,z,2,4,'#3c5a70');if(n&&hsh(o.seed||3,k,9)<.3)winR(n,u1,v0+dv*.5,z,2,4,'#f3d68e');}
        // 頂部機房（波紋鋼板包覆）
        const pu=u0+du*.18,pv=v0+dv*.16,pd=du*.64,pe=dv*.62,ph=o.pent||10;
        boxZ(g,pu,pv,pd,pe,h,ph,'#9aa3a8','#c9cfd2','#8a9398');ribsL(g,pu,pu+pd,pv+pe,h,h+ph,'#b6bdc1',2);ribsR(g,pu+pd,pv,pv+pe,h,h+ph,'#7c858a',2);
        BL(g,P(pu,pv+pe,h+ph),P(pu+pd,pv+pe,h+ph),'#e2e6e8');
        winL(g,pu+pd*.3,pv+pe,h+3,3,3,'#4d6f88');if(n)winL(n,pu+pd*.3,pv+pe,h+3,3,3,'#ffe3a0');
        // 女兒牆扶手
        BL(g,P(u0+.01,v1-.01,h+2),P(u1-.01,v1-.01,h+2),'#e9ecee');BL(g,P(u1-.01,v1-.01,h+2),P(u1-.01,v0+.01,h+2),'#c5cbce');
        // 屋頂紅色航空警示燈
        const rl=P(pu+pd*.5,pv+pe*.5,h+ph+2);RC(g,rl[0],rl[1],1,2,'#6d767b');RC(g,rl[0],rl[1]-1,1,1,'#d0392c');if(n)RC(n,rl[0],rl[1]-1,1,1,'#ff5a48');});
      // 斜槽（分配管）：自頭房頂引到筒倉頂（兩像素：上亮下暗）
      const spout=(g,a,b,c='#a9b1b6')=>{BL(g,a,b,SH(c,22));BL(g,[a[0],a[1]+1],[b[0],b[1]+1],SH(c,-40));};
      // 覆蓋式漏斗車（穀物）：ax 沿 u／v；a0＝車頭端起點、c＝軌道中心
      const hopCar=(S,ax,a0,c,Ln,col,o={})=>S.o(o.d!=null?o.d:a0+Ln*.5+c+.06,(g,n)=>{const w=.11,z0=5,h=10,a1=a0+Ln,M=(a,b,z)=>ax==='u'?P(a,b,z):P(b,a,z);
        const bz=(p0,dp,q0,dq,z,hh,t,l,r)=>ax==='u'?boxZ(g,p0,q0,dp,dq,z,hh,t,l,r):boxZ(g,q0,p0,dq,dp,z,hh,t,l,r);
        if(ax==='u'){L.bogie(g,'u',a0,c,.08);L.bogie(g,'u',a0,c,Ln-.08);}else{L.bogie(g,'v',c,a0,.08);L.bogie(g,'v',c,a0,Ln-.08);}
        const nb=3,seg=(Ln-.14)/nb,s=c+w/2;
        for(let i=0;i<nb;i++){const a=a0+.07+i*seg;
          fp(g,[M(a,s,z0+1),M(a+seg,s,z0+1),M(a+seg*.7,s,2),M(a+seg*.3,s,2)],ax==='u'?SH(col,-26):SH(col,-52));
          fp(g,[M(a+seg,c-w/2,z0+1),M(a+seg,s,z0+1),M(a+seg*.7,s,2),M(a+seg*.7,c-w/2,2)],ax==='u'?SH(col,-52):SH(col,-24));}
        bz(a0+.01,Ln-.02,c-w/2,w,z0,h,SH(col,18),col,SH(col,-36));
        if(ax==='u')ribsL(g,a0+.01,a1-.01,s,z0,z0+h,SH(col,-12),3,1);else ribsR(g,s,a0+.01,a1-.01,z0,z0+h,SH(col,-50),3,1);
        BL(g,M(a0+.02,c,z0+h),M(a1-.02,c,z0+h),SH(col,34));
        for(let k=0;k<4;k++){const a=a0+.07+k*(Ln-.14)/3;bz(a-.02,.04,c-.025,.05,z0+h,1,SH(col,-6),SH(col,8),SH(col,-40));}
        const m=M(a0+Ln*.28,s,z0+7);L.pg(g,m[0],m[1],7,1,ax==='u'?.5:-.5,SH(col,ax==='u'?-44:-64));
        BL(g,M(a0+.012,s,z0+h),M(a0+.012,s,z0),'#e2e4e2');});
      // 升運機塔（格構鋼塔＋兩根升運管＋頂部機頭房＋分配器）
      const legTower=(S,u0,v0,s,h,o={})=>S.o(o.d!=null?o.d:u0+v0+s+.02,(g,n)=>{
        const post=(u,v,c,w=1)=>{const p=P(u,v,0);RC(g,p[0],p[1]-h,w,h,c);};
        post(u0,v0,'#5f686d');post(u0+s,v0,'#5f686d');
        const lg=(t,c)=>boxZ(g,u0+s*t,v0+s*.3,.026,.026,0,h+2,SH(c,14),c,SH(c,-36));
        lg(.2,'#e3e7e9');lg(.62,'#d3d9dc');
        for(let z=0;z<h-5;z+=8){BL(g,P(u0+s,v0,z),P(u0+s,v0+s,z+8),'#6a7378');BL(g,P(u0+s,v0+s,z),P(u0+s,v0,z+8),'#6a7378');BL(g,P(u0+s,v0,z),P(u0+s,v0+s,z),'#5f686d');}
        post(u0,v0+s,'#b6bec2',1);post(u0+s,v0+s,'#8e979c',1);
        for(let z=0;z<h-5;z+=8){BL(g,P(u0,v0+s,z),P(u0+s,v0+s,z+8),'#9aa3a8');BL(g,P(u0+s,v0+s,z),P(u0,v0+s,z+8),'#9aa3a8');BL(g,P(u0,v0+s,z),P(u0+s,v0+s,z),'#838c91');}
        // 走道平台（接倉頂走道橋）
        if(o.plat){const z=o.plat;fp(g,[P(u0-.05,v0-.03,z),P(u0+s+.03,v0-.03,z),P(u0+s+.03,v0+s+.03,z),P(u0-.05,v0+s+.03,z)],'#8e979c');BL(g,P(u0-.05,v0+s+.03,z+3),P(u0+s+.03,v0+s+.03,z+3),'#e0e4e6');}
        // 爬梯（+u 面）
        for(let z=2;z<h;z+=2){const p=P(u0+s,v0+s*.75,z);RC(g,p[0],p[1],2,1,'#4d555b');}
        // 機頭房
        boxZ(g,u0-.02,v0-.01,s+.05,s+.03,h,7,'#9aa3a8','#cdd3d6','#8a9398');ribsL(g,u0-.02,u0+s+.03,v0+s+.02,h,h+7,'#b8bfc3',2);
        fp(g,[P(u0-.02,v0-.01,h+7),P(u0+s+.03,v0-.01,h+7),P(u0+s*.5,v0+s*.5,h+10)],'#7d878c');fp(g,[P(u0-.02,v0-.01,h+7),P(u0-.02,v0+s+.02,h+7),P(u0+s*.5,v0+s*.5,h+10)],'#8f999e');
        fp(g,[P(u0-.02,v0+s+.02,h+7),P(u0+s+.03,v0+s+.02,h+7),P(u0+s*.5,v0+s*.5,h+10)],'#aab3b8');fp(g,[P(u0+s+.03,v0-.01,h+7),P(u0+s+.03,v0+s+.02,h+7),P(u0+s*.5,v0+s*.5,h+10)],'#788287');
        // 分配器（機頭下方的圓筒）
        const dp=P(u0+s*.5,v0+s+.03,h-7);RC(g,dp[0]-2,dp[1]-3,5,4,'#aeb6ba');RC(g,dp[0]-2,dp[1]-3,5,1,'#d9dee1');RC(g,dp[0]+2,dp[1]-2,1,3,'#7a8388');
        const rl=P(u0+s*.5,v0+s*.5,h+11);RC(g,rl[0],rl[1],1,1,'#d0392c');if(n)RC(n,rl[0],rl[1],1,1,'#ff5a48');
        const wl=P(u0+s*.3,v0+s+.02,h+2);RC(g,wl[0],wl[1],2,2,'#4d6f88');if(n)RC(n,wl[0],wl[1],2,2,'#ffe3a0');});
      // 走道橋（桁架）：a、b＝[u,v,z]
      const catwalk=(g,a,b)=>{const pa=P(a[0],a[1],a[2]),pb=P(b[0],b[1],b[2]),L2=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,Math.round(L2/4));
        BL(g,pa,pb,'#5d656b');BL(g,[pa[0],pa[1]-1],[pb[0],pb[1]-1],'#a9b1b6');
        for(let i=0;i<=n;i++){const t=i/n,p=[pa[0]+(pb[0]-pa[0])*t,pa[1]+(pb[1]-pa[1])*t];BL(g,[p[0],p[1]-1],[p[0],p[1]-4],'#7c858a');}
        BL(g,[pa[0],pa[1]-4],[pb[0],pb[1]-4],'#e0e4e6');};
      // 塔式烘乾機：篩網段（孔點）、上方濕糧暫存斗、底部燃燒器＋風機
      const dryer=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const u1=u0+du,v1=v0+dv;
        const hb=h-9;
        boxZ(g,u0,v0,du,dv,0,hb,'#aab2b6','#8f989d','#6a737a');
        for(let z=6;z<hb-2;z+=2){const a=P(u0,v1,z),len=Math.floor(du*32);for(let x=1+(z>>1)%2;x<len-1;x+=2)RC(g,rnd(a[0])+x,rnd(a[1])+Math.floor(x*.5),1,1,'#b4bcc0');
          const b=P(u1,v1,z),ln2=Math.floor(dv*32);for(let x=1+(z>>1)%2;x<ln2-1;x+=2)RC(g,rnd(b[0])+x,rnd(b[1])-Math.floor(x*.5),1,1,'#858e93');}
        for(let z=5;z<hb;z+=9){BL(g,P(u0,v1,z),P(u1,v1,z),'#d4dadd');BL(g,P(u1,v1,z),P(u1,v0,z),'#9aa3a8');}
        BL(g,P(u0+du*.5,v1,1),P(u0+du*.5,v1,hb),'#c2c9cd');BL(g,P(u0,v1,0),P(u0,v1,hb),'#d9dee1');BL(g,P(u1,v1,0),P(u1,v1,hb),'#b8c0c4');
        // 上方濕糧暫存斗（亮面鍍鋅板、壓條）＋平頂護欄
        boxZ(g,u0,v0,du,dv,hb,9,'#c3cacd','#e4e8ea','#a3acb1');ribsL(g,u0,u1,v1,hb,hb+9,'#cfd5d8',3);ribsR(g,u1,v0,v1,hb,hb+9,'#939ca2',3);
        BL(g,P(u0,v1,hb+9),P(u1,v1,hb+9),'#f2f4f5');BL(g,P(u0+.01,v1-.01,hb+12),P(u1-.01,v1-.01,hb+12),'#c9cfd2');
        for(let k=0;k<3;k++){const p=P(u0+du*(k+.5)/3,v1,hb+12);RC(g,p[0],p[1],1,3,'#9aa3a8');}
        // 底部燃燒器／風機箱（+v 側）
        boxZ(g,u0+du*.12,v1,du*.6,.08,0,7,'#6f797e','#8f999e','#586166');const fc=P(u0+du*.42,v1+.08,4);RC(g,fc[0]-2,fc[1]-2,4,4,'#3a4247');RC(g,fc[0]-1,fc[1]-1,2,2,'#59636a');
        const wl=P(u0+du*.82,v1,5);RC(g,wl[0],wl[1]-2,2,2,'#e0b33a');if(n)RC(n,wl[0],wl[1]-2,2,2,'#ffd27a');
        for(let z=2;z<h;z+=2){const p=P(u1,v0+dv*.75,z);RC(g,p[0],p[1],2,1,'#4d555b');}});
      // 單坡雨棚（卸料坑）：四柱＋單坡屋頂（高側在 −v）
      const canopy=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+du+dv,(g,n)=>{const u1=u0+du,v1=v0+dv;
        for(const [a,b] of[[u0,v1-.03],[u1-.03,v1-.03]])boxZ(g,a,b,.03,.03,0,h,'#9aa3a8','#b8c0c3','#7d868b');
        fp(g,[P(u0-.02,v0-.02,h+4),P(u1+.02,v0-.02,h+4),P(u1+.02,v1+.02,h),P(u0-.02,v1+.02,h)],'#c9ced1');
        for(let u=u0+.03;u<u1;u+=.05)BL(g,P(u,v0-.02,h+4),P(u,v1+.02,h),'#b3babe');
        faceL(g,v1+.02,u0-.02,u1+.02,h-2,h,'#e0b33a');faceR(g,u1+.02,v0-.02,v1+.02,h-2,h+4,'#9aa3a8');
        const lp=P(u0+du*.5,v1+.02,h-2);RC(g,lp[0]-1,lp[1],3,1,'#f2e8c2');if(n)RC(n,lp[0]-1,lp[1],3,1,'#fff2cc');});
      // 穿越式卸料棚（屋脊沿 v）：拆成後柱與前柱＋屋頂兩件，讓卡車夾在中間
      const shedBack=(S,u0,v0,u1,v1,eh,rh)=>S.o(u0+v0+.3,(x)=>{const um=(u0+u1)/2;for(const u of[u0,u1-.03])boxZ(x,u,v0,.03,.03,0,eh,'#9aa3a8','#b8c0c3','#7d868b');
        fp(x,[P(u0,v0,eh),P(u1,v0,eh),P(um,v0,eh+rh)],'#7c868b');});
      const shedFront=(S,u0,v0,u1,v1,eh,rh,d)=>S.o(d!=null?d:u0+v1+.3,(x,n)=>{const um=(u0+u1)/2,ov=.03;for(const u of[u0,u1-.03])boxZ(x,u,v1-.03,.03,.03,0,eh,'#9aa3a8','#b8c0c3','#7d868b');
        fp(x,[P(u0-ov,v0-ov,eh),P(um,v0-ov,eh+rh),P(um,v1+ov,eh+rh),P(u0-ov,v1+ov,eh)],'#c3cacd');
        fp(x,[P(um,v0-ov,eh+rh),P(u1+ov,v0-ov,eh),P(u1+ov,v1+ov,eh),P(um,v1+ov,eh+rh)],'#8d969b');
        for(let v=v0+.04;v<v1;v+=.06){BL(x,P(u0-ov,v,eh),P(um,v,eh+rh),'#b2babe');BL(x,P(um,v,eh+rh),P(u1+ov,v,eh),'#7f888d');}
        BL(x,P(um,v0-ov,eh+rh),P(um,v1+ov,eh+rh),'#e4e8ea');
        fp(x,[P(u0,v1,eh),P(u1,v1,eh),P(um,v1,eh+rh)],'#dfe3e5');BL(x,P(u0,v1,eh),P(u1,v1,eh),'#8a9398');
        faceR(x,u1,v0+.02,v1-.02,2,eh-2,'#8b949a');ribsR(x,u1,v0+.02,v1-.02,2,eh-2,'#77818a',2);
        const lp=P(um,v1,eh-1);RC(x,lp[0]-1,lp[1],3,1,'#f2e8c2');if(n)RC(n,lp[0]-1,lp[1],3,1,'#fff2cc');});
      // 斜爬輸送廊（沿 v，自 vb 端低處 za 爬到 va 端高處 zc）
      const conveyorV=(S,ua,ub,va,vb,za,zc,d,bents=[])=>S.o(d,(x)=>{const zb=(v)=>za+(vb-v)/(vb-va)*(zc-za),hh=7;
        for(const v of bents){const z=zb(v);for(const a of[ua,ub]){const p=P(a,v,0);RC(x,p[0],p[1]-z,1,z,'#7d868b');}BL(x,P(ua,v,z*.3),P(ub,v,z*.8),'#8e979c');BL(x,P(ua,v,z*.8),P(ub,v,z*.3),'#8e979c');}
        fp(x,[P(ub,vb,za),P(ub,va,zc),P(ub,va,zc+hh),P(ub,vb,za+hh)],'#8c959a');
        fp(x,[P(ua,vb,za+hh),P(ub,vb,za+hh),P(ub,va,zc+hh),P(ua,va,zc+hh)],'#b3bbbf');
        fp(x,[P(ua,vb,za),P(ub,vb,za),P(ub,vb,za+hh),P(ua,vb,za+hh)],'#c6ccd0');
        for(let t=.05;t<1;t+=.09){const v=va+(vb-va)*t,z=zb(v);BL(x,P(ub,v,z+1),P(ub,v,z+hh-1),'#79838a');}
        BL(x,P(ua,vb,za+hh),P(ua,va,zc+hh),'#d9dee1');});
      // 地磅（鋼面＋混凝土框）
      const scale=(g,u0,v0,du,dv,ax)=>{boxZ(g,u0,v0,du,dv,0,1,'#8e959a','#a2a9ad','#6f767b');flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#7d858a',1);
        for(let k=1;k<4;k++){if(ax==='v')BL(g,P(u0+.03,v0+dv*k/4,1),P(u0+du-.03,v0+dv*k/4,1),'#6a7277');else BL(g,P(u0+du*k/4,v0+.03,1),P(u0+du*k/4,v0+dv-.03,1),'#6a7277');}};
      return{siloMat,silo,hopBin,headhouse,spout,hopCar,legTower,catwalk,dryer,canopy,shedBack,shedFront,conveyorV,scale};};

    const K169=[
      // v0 一列式混凝土筒倉：四座滑模筒倉沿 u 排成一列、頂上通長廊道；西端高聳頭房；
      // 筒倉前方鐵路側線（漏斗車兩節＋裝車樓）；左前卸料棚＋斜爬輸送廊接頭房；前方地磅＋磅房；右前辦公室與停車
      (g,ng,S,L)=>{const {P,pave,lineV,dashU,hazU,trackU,boxZ,BL,winL,ribsL,ribsR,rowL,rcast,rbox,flatCol,lamp,tree,bush,car,office,hut}=L;
        const X=SL(L),HS=50;
        pave(g,'k',0,0,SZ,SZ,16901);
        pave(g,'c',.1,.12,1.8,.64,16902);                 // 筒倉基礎區
        pave(g,'a',.14,1.14,.5,.86,16903);                // 卡車車道（沿 v，閘口在左前）
        pave(g,'a',.64,1.14,1.3,.2,16904);                // 側線前服務道
        pave(g,'c',1.0,1.42,.94,.52,16905);               // 辦公區
        pave(g,'g',.66,1.9,.3,.08,16906);
        trackU(g,.96,0,SZ,16907);
        backFence(L,[],[[.42,.54]])(g);
        lineV(g,.16,1.14,2,'#e2ddcd');lineV(g,.62,1.14,2,'#e2ddcd');
        X.scale(g,.2,1.72,.38,.24,'u');hazU(g,1.7,.2,.58);
        for(let k=0;k<=4;k++)lineV(g,1.12+k*.17,1.76,1.92,'#dedad0');
        dashU(g,1.24,.66,1.9,'#e8e2c8');
        L.shadow(g,[['b',.14,.2,.32,.44,73],['c',.62,.42,.155,HS],['c',.94,.42,.155,HS],['c',1.26,.42,.155,HS],['c',1.58,.42,.155,HS],
          ['b',.14,1.3,.52,.42,20],['b',1.26,1.48,.54,.24,10],['b',1.28,.82,.3,.28,26],['b',.7,1.62,.18,.18,9]]);
        // 頭房
        X.headhouse(S,.14,.2,.32,.44,64,{pent:9,seed:7,d:.7});
        // 筒倉列＋頂部通長廊道（同一次投射）
        S.o(1.0,(x,n)=>{const pr=[];for(const [i,u] of [.62,.94,1.26,1.58].entries())pr.push(...X.silo(u,.42,.155,HS,{kind:'c',seed:30+i,jo:i*3}));
          pr.push(rbox(.62,.33,.96,.18,HS-1,1,flatCol('#cfcabe','#cfcabe','#b9b4a8')));
          pr.push(rbox(.46,.35,1.28,.14,HS,7,flatCol('#8f989d','#c3c9cc','#8a9398')));
          rcast(x,pr,{edgeT:.04});
          ribsL(x,.46,1.74,.49,HS,HS+7,'#b0b7bb',3);
          rowL(x,n,.5,1.7,.49,HS+2,3,2,4,'#4d6f88',41,.35);
          BL(x,P(.46,.49,HS+7),P(1.74,.49,HS+7),'#e3e7e9');});
        // 側線漏斗車兩節＋裝車樓（第二節在裝車溜槽下）
        X.hopCar(S,'u',.66,.96,.48,'#b9b3a4',{d:1.9});
        X.hopCar(S,'u',1.18,.96,.48,'#8d6a55',{d:2.4});
        S.o(2.5,(x,n)=>{for(const [a,b] of[[1.3,.84],[1.54,.84],[1.3,1.07],[1.54,1.07]])boxZ(x,a,b,.025,.025,0,18,'#8e979c','#a9b1b5','#6f787d');
          BL(x,P(1.31,1.095,5),P(1.55,1.095,16),'#8e979c');BL(x,P(1.31,1.095,16),P(1.55,1.095,5),'#8e979c');
          boxZ(x,1.28,.82,.3,.28,18,8,'#aab2b6','#d2d7da','#8e979c');ribsL(x,1.28,1.58,1.1,18,26,'#bcc3c7',2);ribsR(x,1.58,.82,1.1,18,26,'#7e878c',2);
          BL(x,P(1.43,.96,18),P(1.43,.96,14),'#5d656a');BL(x,P(1.44,.96,18),P(1.44,.96,14),'#8b9398');
          winL(x,1.34,1.1,21,3,2,'#4d6f88');if(n)winL(n,1.34,1.1,21,3,2,'#ffe3a0');});
        S.t(2.51,(x)=>X.spout(x,P(1.44,.46,HS+4),P(1.43,.88,26)));
        // 卸料棚（穿越式、屋脊沿 v）＋斜爬輸送廊（自卸料坑爬上頭房）
        X.shedBack(S,.14,1.3,.66,1.72,18,6);
        X.conveyorV(S,.3,.38,.64,1.34,8,46,1.5,[1.12,.84]);
        L.truck(S,.34,1.36,'v',{load:'hop',cab:'#c9572f',col:'#cfc8b6',dir:1,L:.5});
        X.shedFront(S,.14,1.3,.66,1.72,18,6);
        // 磅房、辦公室、停車
        hut(S,.7,1.62,.18,.18,9,{win:.35,winR:.5,roof:'#7d868b',wl:'#e2ded3',wr:'#b8b3a7'});
        office(S,1.26,1.48,.54,.24,1,16911,{band:'#b9942f',door:.3});
        for(const [u,c] of[[1.12,'#b8433a'],[1.29,'#e8ecee'],[1.46,'#3d5f8a']])car(S,u,1.76,false,c);
        tree(S,1.9,1.5,.8,0);tree(S,1.9,1.84,.7,2);bush(S,1.02,1.9,3);
        lamp(S,.1,.86,20);lamp(S,1.94,1.12,20);lamp(S,.72,1.42,18);lamp(S,.1,1.96,18);
        return{front:(g2)=>{frontFence(L,[[.42,.54]],[[.05,.32]])(g2);L.signL(g2,.72,SZ-E,'y');L.signL(g2,SZ-E,1.5,'r');}};
      },
      // v1 鋼倉 2×2 叢集：四座大型鍍鋅波紋鋼倉（錐頂）田字排列；右側格構升運機塔，分配管放射到四倉頂、倉頂走道橋相連；
      // 塔前卸料坑單坡雨棚（卡車自右前閘口出）；左前塔式烘乾機＋濕糧斗；前方地磅（左前閘口進）＋磅房；辦公室與停車
      (g,ng,S,L)=>{const {P,pave,lineV,lineU,dashV,hazV,boxZ,RC,BL,rcast,lamp,tree,bush,car,office,hut}=L;
        const X=SL(L),HB=30,RB=11,BINS=[[.52,.52,1.2],[1.06,.52,.35],[.52,1.06,1.35],[1.06,1.06,.3]];
        pave(g,'k',0,0,SZ,SZ,16921);
        pave(g,'c',.16,.16,1.28,1.28,16922);              // 倉基混凝土
        pave(g,'a',1.3,.86,.66,.44,16923);                // 卸料坑前場（出口在右前）
        pave(g,'a',1.3,1.3,.36,.7,16924);                 // 進場車道（閘口在左前）
        pave(g,'c',.12,1.44,1.18,.48,16925);              // 前場
        pave(g,'g',.06,1.92,1.22,.06,16926);
        backFence(L)(g);
        X.scale(g,1.34,1.58,.28,.34,'v');hazV(g,1.33,1.58,1.92);
        lineV(g,1.31,1.3,2,'#e2ddcd');lineV(g,1.65,1.3,2,'#e2ddcd');lineU(g,.88,1.3,1.96,'#e2ddcd');lineU(g,1.28,1.66,1.96,'#e2ddcd');
        for(let k=0;k<=3;k++)lineV(g,.8+k*.16,1.8,1.92,'#dedad0');
        L.shadow(g,[...BINS.map(b=>['c',b[0],b[1],.25,HB+RB]),['b',1.45,.6,.14,.14,82],['b',.18,1.44,.26,.18,46],['b',1.38,.9,.38,.3,20],['b',.8,1.56,.4,.22,10],['c',.64,1.6,.1,26],['b',1.68,1.56,.18,.16,9]]);
        // 四座鋼倉（同一次投射）＋倉頂爬梯、人孔、底部通風機
        S.o(1.3,(x)=>{const pr=[];BINS.forEach(([u,v,la],i)=>pr.push(...X.silo(u,v,.25,HB,{kind:'s',rise:RB,ladder:la,stiff:14,seed:i})));rcast(x,pr,{edgeT:.04});
          for(const [u,v] of BINS){const a=1.05;BL(x,P(u+Math.cos(a)*.24,v+Math.sin(a)*.24,HB+1),P(u+Math.cos(a)*.05,v+Math.sin(a)*.05,HB+RB-1),'#7f898f');
            const m=P(u+.1,v+.02,HB+RB*.55);RC(x,m[0]-1,m[1],3,2,'#8a949a');}});
        for(const [u,v,du,dv] of[[.47,1.31,.1,.06],[1.31,1.0,.06,.1],[1.31,.46,.06,.1]])S.o(u+v+.1,(x)=>{boxZ(x,u,v,du,dv,0,5,'#9aa3a8','#c3cacd','#7d868b');const c=P(u+du*.5,v+dv,3);RC(x,c[0]-1,c[1]-1,2,2,'#4a5358');});
        // 分配管與走道橋（塔在前，先畫）
        S.t(1.35,(x)=>{for(const [u,v] of BINS)X.spout(x,P(1.52,.77,63),P(u,v,HB+RB+1),'#b9c0c4');
          X.catwalk(x,[1.45,.66,HB+RB+2],[1.06,.52,HB+RB+2]);X.catwalk(x,[1.06,.52,HB+RB+2],[.52,.52,HB+RB+2]);X.catwalk(x,[1.06,.52,HB+RB+2],[1.06,1.06,HB+RB+2]);X.catwalk(x,[.52,.52,HB+RB+2],[.52,1.06,HB+RB+2]);});
        X.legTower(S,1.45,.6,.14,72,{d:2.25,plat:HB+RB+2});
        // 卸料坑：卡車在單坡雨棚下（車頭朝右前出口）
        L.truck(S,1.36,.98,'u',{load:'hop',cab:'#3d6c9a',col:'#d4cdbb',dir:1,L:.5});
        X.canopy(S,1.38,.9,.38,.3,16);
        // 地磅上的進場卡車（車頭朝 −v）
        L.truck(S,1.42,1.44,'v',{load:'hop',cab:'#b8433a',col:'#c7c0ad',dir:-1,L:.5,tarp:'#6b5a3e'});
        hut(S,1.7,1.56,.18,.16,9,{win:.4,winR:.5,roof:'#7d868b',wl:'#e2ded3',wr:'#b8b3a7'});
        // 塔式烘乾機＋濕糧斗（小鋼倉）
        X.dryer(S,.16,1.42,.3,.2,38);
        S.o(.64+1.6,(x)=>{rcast(x,X.silo(.64,1.6,.1,18,{kind:'s',rise:5,stiff:8,seed:9}),{edgeT:.04});});
        S.t(2.3,(x)=>X.spout(x,P(.6,1.58,25),P(.36,1.54,44),'#b9c0c4'));
        office(S,.8,1.56,.4,.22,1,16931,{door:.4,band:'#3f7a5a'});
        car(S,.84,1.8,false,'#e8ecee');car(S,1.0,1.8,false,'#6f7b3a');
        tree(S,.1,1.32,.8,1);tree(S,.14,1.86,.7,0);bush(S,.62,1.92,3);
        lamp(S,1.94,.8,20);lamp(S,.1,1.1,20);lamp(S,1.26,1.46,18);lamp(S,1.94,1.4,18);
        return{front:(g2)=>{frontFence(L,[[.43,.66]],[[.66,.83]])(g2);L.signL(g2,.5,SZ-E,'y');L.signL(g2,SZ-E,1.7,'r');}};
      },
      // v2 鋼倉＋混凝土倉混合：北角 2×2 混凝土筒倉群（頂板＋通長廊道）接頭房；頭房以分配管與走道橋接右側兩座大鋼倉；
      // 右緣鐵路側線沿 v（漏斗車兩節、裝車樓由鋼倉溜槽供料）；頭房正前方卸料棚（車道自左前閘口直入）＋地磅＋磅房；
      // 左側架高漏斗底鋼倉（直接裝卡車）；左前辦公室與停車
      (g,ng,S,L)=>{const {P,pave,lineV,hazU,trackV,boxZ,BL,winL,winR,ribsL,ribsR,rowL,rcast,rbox,flatCol,lamp,tree,bush,car,office,hut}=L;
        const X=SL(L),HC=56,HB=30,RB=10,CB=[[.34,.34],[.64,.34],[.34,.64],[.64,.64]];
        pave(g,'k',0,0,SZ,SZ,16941);
        pave(g,'c',.12,.12,1.02,.74,16942);               // 混凝土倉＋頭房基礎
        pave(g,'c',1.12,.16,.52,1.1,16943);               // 鋼倉基礎
        pave(g,'a',.78,.66,.36,1.34,16944);               // 車道（閘口在左前）
        pave(g,'c',.12,.9,.62,1.02,16945);                // 左側作業＋辦公＋停車
        pave(g,'g',1.16,1.9,.46,.08,16946);
        trackV(g,1.8,0,SZ,16947);
        backFence(L,[[.83,1]],[])(g);
        lineV(g,.79,.66,2,'#e2ddcd');lineV(g,1.13,.66,2,'#e2ddcd');
        X.scale(g,.82,1.56,.28,.3,'v');hazU(g,1.54,.82,1.1);
        for(let k=0;k<=3;k++)lineV(g,.16+k*.16,1.76,1.92,'#dedad0');
        L.shadow(g,[...CB.map(c=>['c',c[0],c[1],.15,HC+7]),['b',.82,.2,.28,.36,79],['c',1.38,.44,.24,HB+RB],['c',1.38,.98,.24,HB+RB],
          ['b',.8,.72,.3,.38,21],['b',1.66,.22,.28,.3,26],['c',.4,1.1,.12,34],['b',.14,1.46,.46,.22,10],['b',1.18,1.54,.16,.16,9]]);
        // 混凝土筒倉群（2×2）＋頂板＋通長廊道（接頭房）
        S.o(.8,(x,n)=>{const pr=[];CB.forEach(([u,v],i)=>pr.push(...X.silo(u,v,.15,HC,{kind:'c',seed:60+i,jo:i*2})));
          pr.push(rbox(.34,.34,.3,.3,HC-1,1,flatCol('#cfcabe','#cfcabe','#b9b4a8')));
          pr.push(rbox(.19,.44,.63,.1,HC,7,flatCol('#8f989d','#c3c9cc','#8a9398')));
          rcast(x,pr,{edgeT:.04});
          ribsL(x,.19,.82,.54,HC,HC+7,'#b0b7bb',3);rowL(x,n,.22,.8,.54,HC+2,3,2,4,'#4d6f88',61,.35);
          BL(x,P(.19,.54,HC+7),P(.82,.54,HC+7),'#e3e7e9');});
        X.headhouse(S,.82,.2,.28,.36,70,{pent:9,seed:11,d:1.05,winCols:[.5]});
        // 卸料棚（頭房正前方）＋棚內卡車
        X.shedBack(S,.8,.72,1.1,1.1,16,5);
        L.truck(S,.9,.76,'v',{load:'hop',cab:'#2f6a9a',col:'#cbc4b2',dir:1,L:.5});
        X.shedFront(S,.8,.72,1.1,1.1,16,5);
        // 右側兩座大鋼倉＋分配管＋走道橋
        S.o(2.3,(x)=>{rcast(x,[...X.silo(1.38,.44,.24,HB,{kind:'s',rise:RB,ladder:.35,stiff:14,seed:3}),...X.silo(1.38,.98,.24,HB,{kind:'s',rise:RB,ladder:.3,stiff:14,seed:4})],{edgeT:.04});
          for(const v of[.44,.98]){const a=1.05;BL(x,P(1.38+Math.cos(a)*.23,v+Math.sin(a)*.23,HB+1),P(1.38+Math.cos(a)*.05,v+Math.sin(a)*.05,HB+RB-1),'#7f898f');}});
        S.t(2.32,(x)=>{X.spout(x,P(1.06,.38,74),P(1.38,.44,HB+RB+1),'#b9c0c4');X.spout(x,P(1.06,.46,74),P(1.38,.98,HB+RB+1),'#b9c0c4');
          X.catwalk(x,[1.1,.42,HB+RB+2],[1.38,.44,HB+RB+2]);X.catwalk(x,[1.38,.44,HB+RB+2],[1.38,.98,HB+RB+2]);});
        // 側線：漏斗車兩節＋裝車樓（鋼倉以溜槽供料）
        X.hopCar(S,'v',.1,1.8,.48,'#9ea7ad',{d:2.4});
        S.o(2.5,(x,n)=>{for(const [a,b] of[[1.68,.24],[1.9,.24],[1.68,.48],[1.9,.48]])boxZ(x,a,b,.025,.025,0,18,'#8e979c','#a9b1b5','#6f787d');
          BL(x,P(1.93,.25,5),P(1.93,.49,16),'#7d868b');BL(x,P(1.93,.25,16),P(1.93,.49,5),'#7d868b');
          boxZ(x,1.66,.22,.28,.3,18,8,'#aab2b6','#d2d7da','#8e979c');ribsL(x,1.66,1.94,.52,18,26,'#bcc3c7',2);ribsR(x,1.94,.22,.52,18,26,'#7e878c',2);
          BL(x,P(1.8,.37,18),P(1.8,.37,14),'#5d656a');winR(x,1.94,.3,21,3,2,'#3c5a70');if(n)winR(n,1.94,.3,21,3,2,'#f3d68e');});
        S.t(2.51,(x)=>X.spout(x,P(1.58,.5,28),P(1.68,.4,26)));
        X.hopCar(S,'v',.64,1.8,.48,'#8d6a55');
        X.hopCar(S,'v',1.18,1.8,.48,'#b9b3a4');
        // 左側：架高漏斗底鋼倉（下方可停卡車裝載）
        X.hopBin(S,.4,1.1,.12,12,16,{seed:6});
        hut(S,1.18,1.54,.16,.16,9,{win:.4,winR:.5,roof:'#7d868b',wl:'#e2ded3',wr:'#b8b3a7'});
        office(S,.14,1.46,.46,.22,1,16951,{door:.35,band:'#b9942f'});
        for(const [u,c] of[[.18,'#3d5f8a'],[.34,'#e8ecee'],[.5,'#b8433a']])car(S,u,1.76,false,c);
        tree(S,.1,1.3,.8,2);bush(S,1.5,1.9,3);bush(S,.1,.92,2);
        lamp(S,.1,.84,20);lamp(S,1.6,1.46,20);lamp(S,.7,1.4,18);lamp(S,1.2,.1,18);
        return{front:(g2)=>{frontFence(L,[],[[.385,.575],[.83,1]])(g2);L.signL(g2,.3,SZ-E,'y');L.signL(g2,SZ-E,1.5,'r');}};
      },
    ];
    build(169,K169);
  }catch(e){errs.push('k169: '+(e&&e.stack||e));}

  // ================= k172 鋼材物流場 =================
  try{
    const ST=(L)=>{const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ribsL,ribsR,pg,winL,winR,rowL,rowR,capU,capV,rcast,ti,tone,ZT}=L;
      // 鋼捲色票：冷軋亮銀／熱軋藍黑／鍍鋅偏藍／預塗鏽紅
      const CP={cr:['#f6f8f9','#e1e6e9','#c6cdd2','#a5aeb4','#858e95','#697279'],
        hr:['#a9b1b9','#8d969f','#747d87','#606872','#4e555e','#3f454d'],
        gv:['#eff5f8','#d5e1e8','#b9cad4','#9cb1be','#8297a5','#6b7f8c'],
        rs:['#c3a18d','#ad8b77','#967563','#7e6253','#685146','#54433b']};
      // 鋼捲著色：端面＝鋼捲眼（暗洞＋亮內緣）＋兩道捲紋＋外緣；側面＝金屬高光＋中央綑帶
      const coilCol=(pal)=>(h,s)=>{const cv=s.k==='cv';
        if(h.part==='end'){const q=Math.hypot(h.ea,h.eb)/s.r,kb=ti(h.n,.1);
          if(q<.3)return h.eb<-.1*s.r?pal[Math.min(5,kb+2)]:'#22272c';
          if(q<.43)return pal[Math.max(0,kb-1)];
          if(q>.88)return pal[Math.min(5,kb+2)];
          if((q>.56&&q<.64)||(q>.73&&q<.79))return pal[Math.min(5,kb+1)];
          return pal[kb];}
        if(h.part==='side'){const l=cv?h.lv:h.lu,Ln=cv?s.v1-s.v0:s.u1-s.u0;if(Math.abs(l-Ln*.5)<.007)return pal[4];return pal[ti(h.n,.08)];}
        return pal[2];};
      const pick=(pals,seed,i,t)=>pals[Math.floor(hsh(seed,i,t)*pals.length)%pals.length];
      // 後排鋼捲（低彩度、低明暗差、無捲眼）：側面只留受光頂緣一道亮線＋背光下半一階暗；端面平塗＋外緣一圈
      const CF={hr:{hi:'#959ca3',base:'#6d747b',sh:'#60666d',end:'#7b8289',rim:'#595f65'},
        cr:{hi:'#cad3d9',base:'#9fabb4',sh:'#8f9ba5',end:'#aeb9c1',rim:'#89959f'}};
      const coilFlat=(c)=>(h,s)=>{if(h.part==='end'){const q=Math.hypot(h.ea,h.eb)/s.r;return q>.84?c.rim:c.end;}
        if(h.part==='side'){if(h.n[2]>.9)return c.hi;return h.n[0]>.5?c.sh:c.base;}return c.base;};
      // 一排鋼捲（沿 u 排、軸沿 v；端面朝 +v 受光）；tier2＝第二層坐在谷位；o.flat＝後排平塗（無捲眼）
      const coilRow=(S,d,u0,v0,n,sp,r,w,pals,o={})=>S.o(d,(x)=>{const pr=[],zc=r*ZT+1,seed=o.seed||1,L1=(n-1)*sp+2*r;
        boxZ(x,u0-r,v0+.012,L1,.022,0,1,'#7d5d40','#8d6d4e','#5e4531');boxZ(x,u0-r,v0+w-.034,L1,.022,0,1,'#7d5d40','#8d6d4e','#5e4531');
        const cf=o.flat?coilFlat(o.flat):null;
        for(let i=0;i<n;i++)if(!(o.skip&&o.skip.includes(i)))pr.push(capV(v0,v0+w,u0+i*sp,zc,r,cf||coilCol(pick(pals,seed,i,1))));
        if(o.tier2){const dz=Math.sqrt(Math.max(0,4*r*r-sp*sp/4))*ZT;for(let i=0;i<n-1;i++)if(!(o.skip2&&o.skip2.includes(i)))pr.push(capV(v0+.006,v0+w-.006,u0+(i+.5)*sp,zc+dz,r,cf||coilCol(pick(o.pals2||pals,seed,i,2))));}
        rcast(x,pr,o.flat?{edgeT:.02,edgeD:-22}:{edgeT:.02,edgeD:-40});});
      // 捆料（沿 u 長條）：kind beam＝H 型鋼（端面 I 字）、rebar＝鋼筋（鏽色、端面點陣）、tube＝鋼管（端面圈）、galv＝鍍鋅管
      // 捆料色票：[頂, 受光長面, 暗端面, 端面斷面, 翼緣高光, 腹板陰影]；型鋼是帶軋皮的藍灰、鋼筋是鏽褐、鋼管是亮灰
      const BK={beam:['#98a2aa','#7c8791','#4b545d','#b7c0c7','#c2cbd2','#555f69'],rebar:['#a8744f','#93603e','#643f2a','#c68d63','#bf8a63','#74482f'],
        tube:['#cdd3d7','#b1b9be','#7b848a','#e4e8ea','#e8ecee','#8a939a'],galv:['#dbe3e8','#c1ccd3','#86949d','#eef3f5','#f1f5f7','#98a6ae'],
        primer:['#b8674f','#a2553f','#6e3527','#d08a70','#d6927a','#7d4030'],   // 紅丹底漆型鋼
        angle:['#8c8781','#736d67','#4e4944','#a59f98','#a09a93','#58534e']};
      // 沿 v 的捆料：長面是 +u 暗面、端面是 +v 受光面（I 字斷面畫在暗底上）
      const bundleV=(x,u0,u1,v0,dv,z,h,kind)=>{const c=BK[kind]||BK.beam,v1=v0+dv,du=u1-u0;if(kind==='primer')kind='beam';boxZ(x,u0,v0,du,dv,z,h,c[0],c[1],c[2]);
        const face=(zz,col)=>BL(x,P(u1,v0,zz),P(u1,v1,zz),col),hi=SH(c[2],24),wb=SH(c[2],-16);
        if(kind==='beam'||kind==='angle'){for(let zz=z;zz+3<=z+h;zz+=4){face(zz+3,hi);face(zz+2,wb);}}else for(let zz=z;zz<z+h;zz+=2){face(zz+1,hi);face(zz,wb);}
        for(let k=1;k<3;k++){const t=v0+dv*k/3;BL(x,P(u1,t,z+1),P(u1,t,z+h),'#b9bcb8');BL(x,P(u0,t,z+h),P(u1,t,z+h),'#e3e5e1');}
        fp(x,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],SH(c[2],6));
        const pitch=kind==='beam'?4:2,n=Math.max(1,Math.floor(du*32/pitch));
        for(let i=0;i<n;i++){const uu=u0+du*(i+.5)/n;
          if(kind==='beam'||kind==='angle'){for(let zz=z;zz+3<=z+h;zz+=4){const p=P(uu,v1,zz);RC(x,p[0]-1,p[1]-3,3,1,c[3]);RC(x,p[0],p[1]-2,1,1,c[3]);RC(x,p[0]-1,p[1]-1,3,1,c[3]);}}
          else for(let zz=z;zz+2<=z+h;zz+=2){const p=P(uu,v1,zz);RC(x,p[0]-1,p[1]-2,2,2,c[3]);if(kind!=='rebar')RC(x,p[0]-1,p[1]-1,1,1,'#2e3337');}}};
      const bundle=(x,u0,u1,v0,dv,z,h,kind)=>{if(dv>(u1-u0)*1.3)return bundleV(x,u0,u1,v0,dv,z,h,kind);
        const c=BK[kind]||BK.beam;if(kind==='primer')kind='beam';boxZ(x,u0,v0,u1-u0,dv,z,h,c[0],c[1],c[2]);
        const face=(zz,col)=>BL(x,P(u0,v0+dv,zz),P(u1,v0+dv,zz),col);
        // 受光長面：型鋼＝上翼緣亮線＋凹進去的腹板暗帶＋下翼緣；鋼管／鋼筋＝每根一道高光一道陰影
        if(kind==='beam'||kind==='angle'){for(let zz=z;zz+3<=z+h;zz+=4){face(zz+3,c[4]);face(zz+2,c[5]);face(zz+1,SH(c[5],10));}}
        else for(let zz=z;zz<z+h;zz+=2){face(zz+1,c[4]);face(zz,c[5]);}
        for(let k=1;k<3;k++){const t=u0+(u1-u0)*k/3;BL(x,P(t,v0+dv,z+1),P(t,v0+dv,z+h),'#d7d9d4');BL(x,P(t,v0,z+h),P(t,v0+dv,z+h),'#e3e5e1');}   // 綑帶
        // 端面（+u 暗面）：型鋼 I 字、鋼管圈、鋼筋點陣
        const pitch=kind==='beam'?4:kind==='rebar'?1.5:2,n=Math.max(1,Math.floor(dv*32/pitch));
        for(let i=0;i<n;i++){const vv=v0+dv*(i+.5)/n;
          if(kind==='beam'||kind==='angle'){for(let zz=z;zz+3<=z+h;zz+=4){const p=P(u1,vv,zz);RC(x,p[0]-1,p[1]-3,3,1,c[3]);RC(x,p[0],p[1]-2,1,1,c[3]);RC(x,p[0]-1,p[1]-1,3,1,c[3]);}}
          else if(kind==='tube'||kind==='galv'){for(let zz=z;zz+2<=z+h;zz+=2){const p=P(u1,vv,zz);RC(x,p[0]-1,p[1]-2,2,2,c[3]);RC(x,p[0],p[1]-1,1,1,'#2e3337');}}
          else for(let zz=z;zz<z+h-1;zz+=2){const p=P(u1,vv,zz);RC(x,p[0],p[1]-1,1,1,(i+zz)%2?c[3]:c[4]);}}};
      // 地面堆垛：layers 層，每層下墊兩根枕木
      const stack=(S,d,u0,len,v0,dv,layers,kinds,o={})=>S.o(d,(x)=>{let z=0;const ks=Array.isArray(kinds)?kinds:[kinds];
        for(let k=0;k<layers;k++){for(const t of[.1,len-.14])boxZ(x,u0+t,v0-.012,.04,dv+.024,z,1,'#8d6d4e','#9c7b5b','#634a35');z+=1;
          const h=o.h||4;bundle(x,u0+(k%2?.02:0),u0+len-(k%2?.03:0),v0,dv,z,h,ks[k%ks.length]);z+=h;}});
      // 鋼板堆：n 張，交錯微偏移，頂板略帶鏽
      const plates=(S,d,u0,v0,du,dv,n,seed)=>S.o(d,(x)=>{let z=0;boxZ(x,u0+.03,v0-.01,.04,dv+.02,0,1,'#8d6d4e','#9c7b5b','#634a35');boxZ(x,u0+du-.07,v0-.01,.04,dv+.02,0,1,'#8d6d4e','#9c7b5b','#634a35');z=1;
        for(let k=0;k<n;k++){const o1=(hsh(seed,k,1)-.5)*.03,o2=(hsh(seed,k,2)-.5)*.03,rust=k===n-1&&hsh(seed,k,3)<.5;
          const top=rust?'#9c8474':'#a4aeb5',lit=rust?'#8a7060':'#8e99a2',dk=rust?'#5f4d42':'#606a73',a=u0+o1,b=v0+o2;
          boxZ(x,a,b,du,dv,z,2,top,lit,dk);
          // 板緣亮／暗交替：每張板上 1px 亮、下 1px 暗（受光面與背光面都畫），1x 讀得出一張一張疊起來
          BL(x,P(a,b+dv,z+2),P(a+du,b+dv,z+2),SH(lit,36));BL(x,P(a,b+dv,z+1),P(a+du,b+dv,z+1),SH(lit,-34));
          BL(x,P(a+du,b,z+2),P(a+du,b+dv,z+2),SH(dk,26));BL(x,P(a+du,b,z+1),P(a+du,b+dv,z+1),SH(dk,-22));z+=2;}
        for(let i=0;i<5;i++){const p=P(u0+.03+hsh(seed,i,7)*(du-.06),v0+.03+hsh(seed,i,8)*(dv-.06),z);RC(x,p[0],p[1],2,1,'#8a6e5c');}});
      // 吊車軌道（混凝土軌道樑＋鋼軌），沿 v
      const craneRailV=(g,u,v0,v1)=>{flat(g,u-.045,v0,.09,v1-v0,'#b3afa4');BL(g,P(u+.045,v0),P(u+.045,v1),'#8e8a80');BL(g,P(u,v0),P(u,v1),'#4a4f53');BL(g,P(u,v0,1),P(u,v1,1),'#d7dcdf');};
      // 門式起重機（主樑沿 u、軌道沿 v）：ua／ub 兩端 A 字門腳（腳在 v 方向張開）、箱型主樑（+u 側懸臂 cant）、小車、鋼索吊鉤、司機室
      const gantry=(S,d,ua,ub,vc,Hh,o={})=>{const Y=o.col||'#e2b23a',YT=SH(Y,24),ut=o.ut!=null?o.ut:(ua+ub)/2,hz=o.hz||16;
        // 鋼索走細線層（不描邊，兩條細索不會糊成黑帶）；吊鉤塊＋吊掛物另成一件描邊
        S.t(d+.001,(x)=>{const hb=P(ut,vc,hz+4);BL(x,P(ut-.025,vc+.02,Hh),[hb[0]-1,hb[1]],'#3b4044');BL(x,P(ut+.025,vc-.02,Hh),[hb[0]+1,hb[1]],'#3b4044');
          if(o.sling){const p=P(ut,vc,hz-1);BL(x,P(ut,vc-o.sling*.35,hz-5),p,'#3b4044');BL(x,P(ut,vc+o.sling*.35,hz-5),p,'#3b4044');}});
        S.o(d+.002,(x,n)=>{const hb=P(ut,vc,hz);RC(x,hb[0]-2,hb[1]-4,5,3,Y);RC(x,hb[0]-2,hb[1]-4,5,1,YT);RC(x,hb[0]-2,hb[1]-2,5,1,'#2f3336');
          if(o.load)o.load(x,n,ut,vc,hz-2);});
        return gantryBody(S,d,ua,ub,vc,Hh,o);};
      const gantryBody=(S,d,ua,ub,vc,Hh,o={})=>S.o(d,(x,n)=>{const Y=o.col||'#e2b23a',YT=SH(Y,24),YD=SH(Y,-44),cant=o.cant||0,ut=o.ut!=null?o.ut:(ua+ub)/2,hz=o.hz||16,w=.028;
        const legQ=(u,vb,vt)=>{fp(x,[P(u-w,vb+w,6),P(u+w,vb+w,6),P(u+w,vt+w,Hh),P(u-w,vt+w,Hh)],Y);
          fp(x,[P(u+w,vb-w,6),P(u+w,vb+w,6),P(u+w,vt+w,Hh),P(u+w,vt-w,Hh)],YD);};
        const frame=(u)=>{for(const s of[-1,1])boxZ(x,u-.05,vc+s*.21-.05,.1,.1,0,4,'#555a5e','#666b6f','#3f4346');
          boxZ(x,u-.035,vc-.25,.07,.5,3,4,YT,Y,YD);
          legQ(u,vc-.21,vc-.045);legQ(u,vc+.21,vc+.045);
          boxZ(x,u-.03,vc-.14,.06,.28,rnd(Hh*.42),3,YT,Y,YD);
          for(let z=8;z<Hh-2;z+=2){const p=P(u+w,vc+.11+(Hh-z)/Hh*.06,z);RC(x,p[0],p[1],2,1,'#3f4549');}};
        frame(ua);
        const g0=ua-.1,g1=ub+cant+.06;
        boxZ(x,g0,vc-.055,g1-g0,.11,Hh,7,YT,Y,YD);
        BL(x,P(g0,vc+.055,Hh+1),P(g1,vc+.055,Hh+1),SH(Y,-22));
        for(let u=g0+.1;u<g1-.05;u+=.1){const p=P(u,vc+.055,Hh+2);RC(x,p[0],p[1]-4,1,4,SH(Y,-12));}
        frame(ub);
        boxZ(x,ub-.06,vc-.08,.12,.16,Hh-3,3,YT,Y,YD);boxZ(x,ua-.06,vc-.08,.12,.16,Hh-3,3,YT,Y,YD);
        BL(x,P(g0,vc+.075,Hh+11),P(g1,vc+.075,Hh+11),'#eef1f2');for(let u=g0+.03;u<g1;u+=.2){const p=P(u,vc+.075,Hh+7);RC(x,p[0],p[1]-4,1,4,'#9aa3a8');}
        // 小車＋鋼索＋吊鉤
        boxZ(x,ut-.07,vc-.07,.14,.14,Hh+7,3,YT,Y,YD);boxZ(x,ut-.045,vc-.05,.08,.09,Hh+10,4,'#8e979c','#b3bbbf','#6f787d');BL(x,P(ut-.045,vc+.04,Hh+14),P(ut+.035,vc+.04,Hh+14),'#d9dee1');
        // 司機室（主樑下，靠 ua 腳）
        const cu=ua+.09;boxZ(x,cu,vc+.03,.1,.08,Hh-11,11,'#d9dde0','#e9eced','#aab2b7');winL(x,cu+.015,vc+.11,Hh-8,3,5,'#3d6a8c');if(n)winL(n,cu+.015,vc+.11,Hh-8,3,5,'#ffe6a8');
        for(const u of[g0+.02,g1-.03]){const p=P(u,vc,Hh+7);RC(x,p[0],p[1]-2,1,2,'#3b4044');RC(x,p[0],p[1]-3,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-3,1,1,'#ff5a48');}});
      // 吊掛中的捆料（吊梁＋兩條吊索＋沿 ax 的一捆）
      const hangBundle=(x,ut,vc,z,ax,len,kind)=>{const top=z;
        if(ax==='v'){   // 吊索（兩條斜索）由 gantry 的細線層畫
          boxZ(x,ut-.012,vc-len*.4,.024,len*.8,top-4,1,'#e2b23a','#e2b23a','#9a7420');
          bundle(x,ut-.05,ut+.05,vc-len/2,len,top-10,4,kind);}
        else{const p=P(ut,vc,top);BL(x,P(ut-len*.35,vc,top-3),[p[0],p[1]],'#3b4044');BL(x,P(ut+len*.35,vc,top-3),[p[0],p[1]],'#3b4044');
          bundle(x,ut-len/2,ut+len/2,vc-.05,.1,top-8,4,kind);}};
      // 懸臂料架：中柱一列、三層懸臂，兩側擱捆料
      const rack=(S,d,u0,u1,vc,kinds,o={})=>S.o(d,(x)=>{const lv=o.levels||[3,9,15],Hh=lv[lv.length-1]+6,nc=o.nc||3,cols=[];for(let i=0;i<nc;i++)cols.push(u0+.03+(u1-u0-.06)*i/(nc-1));
        lv.forEach((z,k)=>bundle(x,u0,u1,vc-.13,.1,z+1,3,kinds[k][0]));
        for(const u of cols){boxZ(x,u-.02,vc-.15,.04,.3,0,1,'#5d656b','#6d757b','#4a5156');boxZ(x,u-.018,vc-.018,.036,.036,0,Hh,'#4c78a8','#3f6893','#2e4d6e');
          for(const z of lv){BL(x,P(u,vc-.14,z),P(u,vc+.14,z+1),'#2e4d6e');}}
        lv.forEach((z,k)=>bundle(x,u0,u1,vc+.03,.1,z+1,3,kinds[k][1]));});
      // 軌道式橋式起重機跑道（柱＋跑道樑，沿 v）
      const runwayV=(S,d,u,v0,v1,cols,Hh)=>S.o(d,(x)=>{for(const v of cols){boxZ(x,u-.02,v-.02,.04,.04,0,Hh-3,'#7f98b1','#6a849e','#4b6179');boxZ(x,u-.03,v-.03,.06,.06,0,2,'#b3afa4','#c3bfb4','#9a968c');}
        boxZ(x,u-.024,v0,.048,v1-v0,Hh-3,3,'#8aa2ba','#6f89a3','#4b6179');BL(x,P(u,v0,Hh),P(u,v1,Hh),'#3b4044');});
      // 橋式起重機（主樑沿 u，跨於兩條跑道樑上）
      const bridge=(S,d,ua,ub,vb,Hh,o={})=>S.o(d,(x,n)=>{const Y=o.col||'#e2b23a',YT=SH(Y,24),YD=SH(Y,-44),ut=o.ut!=null?o.ut:(ua+ub)/2,hz=o.hz||14;
        for(const u of[ua,ub])boxZ(x,u-.05,vb-.1,.1,.2,Hh,3,YT,Y,YD);
        boxZ(x,ua-.02,vb-.045,ub-ua+.04,.09,Hh+2,5,YT,Y,YD);BL(x,P(ua-.02,vb+.045,Hh+3),P(ub+.02,vb+.045,Hh+3),SH(Y,-22));
        boxZ(x,ut-.07,vb-.065,.14,.13,Hh+7,5,'#dfe3e5','#eef1f2','#aab2b7');
        const r1=P(ut-.02,vb+.02,Hh+2),r2=P(ut+.02,vb-.02,Hh+2),hb=P(ut,vb,hz);BL(x,r1,[hb[0]-1,hb[1]-3],'#3b4044');BL(x,r2,[hb[0]+1,hb[1]-3],'#3b4044');
        RC(x,hb[0]-2,hb[1]-4,5,3,Y);RC(x,hb[0]-2,hb[1]-4,5,1,YT);
        if(o.load)o.load(x,n,ut,vb,hz-2);
        for(const u of[ua,ub]){const p=P(u,vb,Hh+7);RC(x,p[0],p[1]-1,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-1,1,1,'#ff5a48');}});
      // 重型堆高機（鋼捲撞桿）：ax 沿 u／v，dir 前方；carry＝撞桿上帶一捲
      const forklift=(S,u,v,ax,dir,o={})=>S.o(o.d!=null?o.d:u+v+.14,(x,n)=>{const Y=o.col||'#e2b23a',Ln=.17,Wd=.1;
        const bz=(a0,da,c0,dc,z,h,t,l,r)=>ax==='u'?boxZ(x,u+a0,v+c0,da,dc,z,h,t,l,r):boxZ(x,u+c0,v+a0,dc,da,z,h,t,l,r);
        const M=(a,c,z)=>ax==='u'?P(u+a,v+c,z):P(u+c,v+a,z);
        const back=dir>0?0:Ln-.06,front=dir>0?Ln:0;
        if(o.carry&&dir<0)rcast(x,[ax==='u'?capV(v+.005,v+Wd-.005,u-.075,9,.075,coilCol(o.carry)):capU(u+.005,u+Wd-.005,v-.075,9,.075,coilCol(o.carry))],{edge:false});
        for(const a of[.03,Ln-.05]){const p=M(a,Wd,0);RC(x,p[0]-1,p[1]-3,3,3,'#1f2225');}
        bz(0,Ln,0,Wd,1,5,SH(Y,20),Y,SH(Y,-40));
        bz(back,.06,.005,Wd-.01,6,3,'#5a5f63','#4a4f53','#35393c');
        const c0=dir>0?.04:.07;for(const [a,c] of[[c0,.01],[c0+.06,.01],[c0,Wd-.01],[c0+.06,Wd-.01]]){BL(x,M(a,c,6),M(a,c,13),'#6d7479');}
        bz(c0+.01,.04,.02,Wd-.04,6,4,'#3b4044','#2f4c63','#26394a');
        bz(c0-.005,.07,0,Wd,13,1,SH(Y,20),Y,SH(Y,-40));
        const mf=dir>0?Ln:0;BL(x,M(mf,.02,1),M(mf,.02,17),'#4a4f53');BL(x,M(mf,Wd-.02,1),M(mf,Wd-.02,17),'#3b4044');BL(x,M(mf,.02,17),M(mf,Wd-.02,17),'#4a4f53');
        const bc=M(back+.03,Wd,8);RC(x,bc[0],bc[1],1,1,'#e8742a');if(n)RC(n,bc[0],bc[1],1,1,'#ffae5a');
        if(o.carry&&dir>0)rcast(x,[ax==='u'?capV(v+.005,v+Wd-.005,u+Ln+.075,9,.075,coilCol(o.carry)):capU(u+.005,u+Wd-.005,v+Ln+.075,9,.075,coilCol(o.carry))],{edge:false});});
      // 鐵路鋼捲車（沿 v，開放式：鋼捲軸沿車長、坐在槽內）／罩蓋式（半圓鋼罩）
      const coilCarV=(S,u,v,Ln,o={})=>S.o(o.d!=null?o.d:u+v+Ln,(x,n)=>{const w=.13,col=o.col||'#5c6a78';
        L.bogie(x,'v',u,v,.09);L.bogie(x,'v',u,v,Ln-.09);
        if(o.hood){const pr=[];for(let k=0;k<3;k++){const a=v+.05+k*(Ln-.1)/3;pr.push(capV(a+.01,a+(Ln-.1)/3-.01,u,9,.075,(h,s)=>h.part==='end'?tone(o.hoodPal,h.n,-.1):tone(o.hoodPal,h.n,.06)));}rcast(x,pr,{edgeT:.02});}
        else{const pr=[];for(let k=0;k<3;k++){if(o.skip&&o.skip.includes(k))continue;const a=v+.06+k*(Ln-.12)/3;pr.push(capV(a+.02,a+.1,u,9,.07,o.flat?coilFlat(o.flat):coilCol(pick(o.pals||[CP.hr],o.seed||3,k,1))));}
          for(let k=0;k<3;k++){const a=v+.06+k*(Ln-.12)/3;boxZ(x,u-.05,a+.01,.1,.02,3,3,'#4d4640','#5d554d','#3d3732');boxZ(x,u-.05,a+.11,.1,.02,3,3,'#4d4640','#5d554d','#3d3732');}
          if(pr.length)rcast(x,pr,{edgeT:.02});}
        faceR(x,u+w/2,v+.01,v+Ln-.01,3,8,SH(col,-30));faceL(x,v+Ln-.01,u-w/2,u+w/2,3,8,col);
        BL(x,P(u+w/2,v+.01,8),P(u+w/2,v+Ln-.01,8),SH(col,20));ribsR(x,u+w/2,v+.01,v+Ln-.01,3,8,SH(col,-46),4,2);});
      // 跑道沿 u（柱＋跑道樑）／橋式起重機主樑沿 v
      const runwayU=(S,d,v,u0,u1,cols,Hh)=>S.o(d,(x)=>{for(const u of cols){boxZ(x,u-.02,v-.02,.04,.04,0,Hh-3,'#7f98b1','#6a849e','#4b6179');boxZ(x,u-.03,v-.03,.06,.06,0,2,'#b3afa4','#c3bfb4','#9a968c');}
        boxZ(x,u0,v-.024,u1-u0,.048,Hh-3,3,'#8aa2ba','#6f89a3','#4b6179');BL(x,P(u0,v,Hh),P(u1,v,Hh),'#3b4044');});
      // C 形夾吊鋼捲（軸沿 v）：吊樑＋後夾臂 → 鋼捲 → 前夾臂；cz＝鋼捲中心高；回傳吊樑頂高（鋼索接點）
      const cHook=(x,u,vt,cz,r,w,pal)=>{const R=r*ZT,top=rnd(cz+R)+3,zb=rnd(cz-R*.2);
        boxZ(x,u-.026,vt-w/2-.03,.052,w+.06,top-1,2,'#f0c850','#e2b23a','#9a7420');
        boxZ(x,u-.012,vt-w/2-.03,.024,.02,zb,top-1-zb,'#c99a2c','#d8a932','#8e6a1c');
        rcast(x,[capV(vt-w/2,vt+w/2,u,cz,r,coilCol(pal))],{edge:false});
        boxZ(x,u-.012,vt+w/2+.01,.024,.02,zb,top-1-zb,'#f0c850','#e2b23a','#9a7420');
        return top+1;};
      // 橋式起重機（主樑沿 v、跨兩條沿 u 的跑道樑）：單箱主樑 3px 高、小車縮小、兩條鋼索＋吊鉤塊＋C 形夾吊捲
      const bridgeV=(S,d,va,vb,ug,Hh,o={})=>{const Y=o.col||'#e2b23a',YT=SH(Y,24),YD=SH(Y,-44),vt=o.vt!=null?o.vt:(va+vb)/2,cz=o.cz||18,r=o.r||.07,top=rnd(cz+r*ZT)+4;
        S.o(d,(x,n)=>{
          for(const v of[va,vb]){boxZ(x,ug-.085,v-.028,.17,.056,Hh,2,YT,Y,YD);for(const s of[-.06,.06]){const p=P(ug+s,v+.028,Hh);RC(x,p[0],p[1]-1,1,1,'#2b2f33');}}
          boxZ(x,ug-.03,va-.03,.06,vb-va+.06,Hh+2,3,YT,Y,YD);
          for(let v=va+.08;v<vb-.02;v+=.12){const p=P(ug+.03,v,Hh+2);RC(x,p[0],p[1]-3,1,3,SH(Y,-60));}
          boxZ(x,ug-.042,vt-.045,.084,.09,Hh+5,2,YT,Y,YD);boxZ(x,ug-.026,vt-.022,.05,.044,Hh+7,2,'#9aa3a8','#c3cace','#737c81');
          for(const v of[va,vb]){const p=P(ug,v,Hh+4);RC(x,p[0],p[1]-1,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-1,1,1,'#ff5a48');}});
        // 鋼索（細線層）→ 吊鉤塊 → C 形夾吊捲
        S.t(d+.001,(x)=>{const hb=P(ug,vt,top+3);BL(x,P(ug-.02,vt+.02,Hh+2),[hb[0]-1,hb[1]-1],'#2f3337');BL(x,P(ug+.02,vt-.02,Hh+2),[hb[0]+1,hb[1]-1],'#2f3337');BL(x,[hb[0],hb[1]+1],P(ug,vt,top),'#2f3337');});
        S.o(d+.002,(x)=>{const hb=P(ug,vt,top+3);RC(x,hb[0]-1,hb[1]-1,3,2,Y);RC(x,hb[0]-1,hb[1]-1,3,1,YT);cHook(x,ug,vt,cz,r,o.w||.09,o.load||CP.gv);});};
      // 橋式起重機（主樑沿 u、跨兩條沿 v 的跑道樑；受光 +v 長面朝鏡頭）：主樑 3px 高、端樑沿 v、小車小、鋼索細線層、C 形夾吊捲（軸沿 v）
      const bridgeU=(S,d,ua,ub,vt,Hh,o={})=>{const Y=o.col||'#e2b23a',YT=SH(Y,24),YD=SH(Y,-44),ut=o.ut!=null?o.ut:(ua+ub)/2,cz=o.cz||16,r=o.r||.066,top=rnd(cz+r*ZT)+4;
        S.o(d,(x,n)=>{
          for(const u of[ua,ub]){boxZ(x,u-.028,vt-.085,.056,.17,Hh,2,YT,Y,YD);for(const s of[-.06,.06]){const p=P(u+.028,vt+s,Hh);RC(x,p[0],p[1]-1,1,1,'#2b2f33');}}
          boxZ(x,ua-.03,vt-.03,ub-ua+.06,.06,Hh+2,3,YT,Y,YD);BL(x,P(ua-.03,vt+.03,Hh+2),P(ub+.03,vt+.03,Hh+2),SH(Y,-26));
          for(let u=ua+.1;u<ub-.04;u+=.14){const p=P(u,vt+.03,Hh+2);RC(x,p[0],p[1]-3,1,3,SH(Y,-18));}
          boxZ(x,ut-.045,vt-.042,.09,.084,Hh+5,2,YT,Y,YD);boxZ(x,ut-.022,vt-.026,.044,.05,Hh+7,2,'#9aa3a8','#c3cace','#737c81');
          for(const u of[ua,ub]){const p=P(u,vt,Hh+5);RC(x,p[0],p[1]-1,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-1,1,1,'#ff5a48');}});
        S.t(d+.001,(x)=>{const hb=P(ut,vt,top+3);BL(x,P(ut-.02,vt+.02,Hh+2),[hb[0]-1,hb[1]-1],'#2f3337');BL(x,P(ut+.02,vt-.02,Hh+2),[hb[0]+1,hb[1]-1],'#2f3337');BL(x,[hb[0],hb[1]+1],P(ut,vt,top),'#2f3337');});
        S.o(d+.002,(x)=>{const hb=P(ut,vt,top+3);RC(x,hb[0]-1,hb[1]-1,3,2,Y);RC(x,hb[0]-1,hb[1]-1,3,1,YT);cHook(x,ut,vt,cz,r,o.w||.1,o.load||CP.gv);});};
      // 平板半拖車（k172 專用）：ax 沿 u／v、車頭朝 +ax；車頭＝擋風玻璃亮面（頂緣反光線）＋側窗＋保險桿＋頭燈＋導流罩；
      // 平板＝木甲板（板縫）＋鋼側樑＋側柱；車輪 3px 黑胎＋輪轂（後雙軸＋前軸）；o.cargo(x,n,甲板頂高)
      const truck2=(S,u,v,ax,o={})=>{const Ln=o.L||.6,Wd=o.W||.13,CL=.16,DL=Ln-CL-.015;
        S.o(o.d!=null?o.d:u+v+Ln*.5+.08,(x,n)=>{const cab=o.cab||'#4d86c2',lit=ax==='u';
          const bz=(a0,da,c0,dc,z,h,t,l,r)=>ax==='u'?boxZ(x,u+a0,v+c0,da,dc,z,h,t,l,r):boxZ(x,u+c0,v+a0,dc,da,z,h,t,l,r);
          const M=(a,c,z)=>ax==='u'?P(u+a,v+c,z):P(u+c,v+a,z);
          const side=(a0,a1,z0,z1,c)=>ax==='u'?faceL(x,v+Wd,u+a0,u+a1,z0,z1,c):faceR(x,u+Wd,v+a0,v+a1,z0,z1,c);
          const front=(c0,c1,z0,z1,c)=>ax==='u'?faceR(x,u+Ln,v+c0,v+c1,z0,z1,c):faceL(x,v+Ln,u+c0,u+c1,z0,z1,c);
          // 平板：木甲板（頂 z4，兩道板縫）＋淺灰鋼側樑（z2–4）＋側柱；甲板下不畫整條底盤，輪與輪之間透出地面
          bz(0,DL,0,Wd,2,2,'#a89274',lit?'#a3abb1':'#848d93',lit?'#848d93':'#6f787e');
          for(const c of[Wd*.34,Wd*.67])BL(x,M(.012,c,4),M(DL-.012,c,4),'#8f785c');
          for(let a=.05;a<DL-.02;a+=.1)BL(x,M(a,Wd,4),M(a,Wd,5),'#4a5055');
          if(o.cargo)o.cargo(x,n,4);
          // 車頭（平頭車）：車身 z1–8＋頂蓋；玻璃帶兩列（前擋＋側窗連成一圈，頂列反光）、暗色水箱罩、黑保險桿、頭燈；車頭與拖車間一道暗縫
          const ca=Ln-CL;
          bz(ca,CL,-.004,Wd+.008,1,7,SH(cab,34),cab,SH(cab,-30));
          bz(ca+.012,CL-.02,.006,Wd-.004,8,1,SH(cab,50),SH(cab,20),SH(cab,-16));
          side(ca,ca+.012,1,8,SH(cab,lit?-40:-60));
          const gF=lit?['#79a2c1','#bcd6e8']:['#8fbbd8','#e2f0f8'],gS=lit?['#8fbbd8','#e2f0f8']:['#6c93b0','#a9c8dc'];
          front(.006,Wd-.006,5,7,gF[0]);front(.006,Wd-.006,6,7,gF[1]);
          side(ca+.05,Ln-.006,5,7,gS[0]);side(ca+.05,Ln-.006,6,7,gS[1]);
          front(.024,Wd-.024,2,4,SH(cab,lit?-66:-46));front(-.004,Wd+.004,1,2,'#1f2225');
          for(const c of[.014,Wd-.018]){const p=M(Ln,c,3);RC(x,p[0],p[1]-1,1,1,'#fbf4dc');if(n)RC(n,p[0],p[1]-1,1,1,'#fff3c8');}
          // 車輪：後雙軸（貼在一起）＋前軸；深灰胎＋亮輪轂
          for(const a of[.07,.15,Ln-.075]){side(a-.038,a+.038,0,3,'#232629');const p=M(a,Wd,1.5);RC(x,p[0],p[1]-1,1,1,'#c9cfd3');}});};
      // 一排鋼捲（沿 v 排、軸沿 u；端面朝 +u）
      const coilRowV=(S,d,u0,v0,n,sp,r,w,pals,o={})=>S.o(d,(x)=>{const pr=[],zc=r*ZT+1,seed=o.seed||1,L1=(n-1)*sp+2*r;
        boxZ(x,u0+.012,v0-r,.022,L1,0,1,'#7d5d40','#8d6d4e','#5e4531');boxZ(x,u0+w-.034,v0-r,.022,L1,0,1,'#7d5d40','#8d6d4e','#5e4531');
        for(let i=0;i<n;i++)pr.push(capU(u0,u0+w,v0+i*sp,zc,r,coilCol(pick(pals,seed,i,1))));
        if(o.tier2){const dz=Math.sqrt(Math.max(0,4*r*r-sp*sp/4))*ZT;for(let i=0;i<n-1;i++)pr.push(capU(u0+.006,u0+w-.006,v0+(i+.5)*sp,zc+dz,r,coilCol(pick(o.pals2||pals,seed,i,2))));}
        rcast(x,pr,{edgeT:.02,edgeD:-40});});
      const craneRailU=(g,v,u0,u1)=>{flat(g,u0,v-.045,u1-u0,.09,'#b3afa4');BL(g,P(u0,v+.045),P(u1,v+.045),'#c9c5ba');BL(g,P(u0,v),P(u1,v),'#4a4f53');BL(g,P(u0,v,1),P(u1,v,1),'#d7dcdf');};
      // 鋼捲場門式起重機（直腿箱型門架；主樑沿 v、沿 u 軌道行走，停在右緣鐵路側線正上方裝車）：
      // 每座門架＝兩組行走台車（騎在沿 u 的軌道上）＋沿 u 地樑＋兩支箱型腳（受光 +v 面 2px、暗 +u 面 2–3px）＋內側一道斜撐＋頂橫樑；
      // 後門架先畫，主樑＋前門架＋小車＋C 形夾吊捲後畫
      const portalV=(S,dBack,dFront,uc,va,vb,Hh,o={})=>{const Y=o.col||'#4a82b8',YT=SH(Y,28),YD=SH(Y,-44),sp=o.sp||.18,Gz=Hh+4,vt=o.vt!=null?o.vt:(va+vb)/2;
        const frame=(x,v)=>{
          for(const s of[-1,1]){const uu=uc+s*sp;boxZ(x,uu-.075,v-.035,.15,.07,0,3,'#4d5256','#5d6266','#3a3e41');
            for(const t of[-.045,.045]){const p=P(uu+t,v+.035,1);RC(x,p[0]-1,p[1]-1,3,2,'#1c1e20');RC(x,p[0],p[1]-1,1,1,'#8a9196');}}
          boxZ(x,uc-sp-.05,v-.03,2*sp+.1,.06,3,2,YT,Y,YD);
          for(const s of[-1,1])boxZ(x,uc+s*sp-.03,v-.04,.06,.08,5,Hh-5,YT,Y,YD);
          const a=P(uc-sp+.03,v+.04,9),b=P(uc+sp-.03,v+.04,Hh-1);BL(x,a,b,YT);BL(x,[a[0],a[1]+1],[b[0],b[1]+1],YD);
          boxZ(x,uc-sp-.05,v-.05,2*sp+.1,.1,Hh,4,YT,Y,YD);BL(x,P(uc-sp-.05,v+.05,Hh+4),P(uc+sp+.05,v+.05,Hh+4),SH(YT,18));
          for(let z=8;z<Hh-1;z+=2){const p=P(uc+sp+.03,v-.01,z);RC(x,p[0],p[1],1,1,'#26292c');}};   // +u 腳暗面爬梯
        S.o(dBack,(x)=>frame(x,va));
        S.o(dFront,(x,n)=>{const g0=va-.06,g1=vb+.06;
          boxZ(x,uc-.05,g0,.1,g1-g0,Gz,6,YT,Y,YD);
          for(let v=g0+.08;v<g1-.03;v+=.1){const p=P(uc+.05,v,Gz+1);RC(x,p[0],p[1]-4,1,4,SH(Y,-60));}
          BL(x,P(uc+.05,g0,Gz+9),P(uc+.05,g1,Gz+9),'#e6eaec');for(let v=g0+.04;v<g1;v+=.12){const p=P(uc+.05,v,Gz+6);RC(x,p[0],p[1]-3,1,3,'#98a1a6');}
          frame(x,vb);
          boxZ(x,uc-.065,vt-.06,.13,.12,Gz+6,3,YT,Y,YD);boxZ(x,uc-.045,vt-.04,.07,.08,Gz+9,3,'#8e979c','#b3bbbf','#6f787d');
          cHook(x,uc,vt,o.cz||20,o.r||.07,o.w||.08,o.load||CP.gv);
          const cv=va+.2;boxZ(x,uc+.05,cv,.08,.09,Hh-3,7,'#b9c4cb','#cdd6dc','#8e9ba4');winL(x,uc+.06,cv+.09,Hh,3,3,'#3d6a8c');winR(x,uc+.13,cv+.015,Hh,2,3,'#34566f');
          if(n)winL(n,uc+.06,cv+.09,Hh,3,3,'#ffe6a8');
          for(const v of[g0+.02,g1-.02]){const p=P(uc,v,Gz+6);RC(x,p[0],p[1]-2,1,2,'#3b4044');RC(x,p[0],p[1]-3,1,1,'#d0392c');if(n)RC(n,p[0],p[1]-3,1,1,'#ff5a48');}});
        // 鋼索走細線層（不描邊）
        S.t(dFront+.001,(x)=>{const cz=o.cz||20,top=rnd(cz+(o.r||.07)*ZT)+4;BL(x,P(uc-.02,vt,Gz),P(uc-.02,vt,top),'#2f3337');BL(x,P(uc+.02,vt,Gz),P(uc+.02,vt,top),'#2f3337');});};
      return{CP,CF,coilCol,coilFlat,coilRow,coilRowV,BK,bundle,stack,plates,craneRailV,craneRailU,gantry,hangBundle,rack,runwayV,runwayU,bridge,bridgeV,bridgeU,cHook,truck2,forklift,coilCarV,portalV};};

    const K172=[
      // v0 露天門式吊車場：跨越堆場的黃色門式起重機（A 字門腳走在沿 v 的兩條軌道上、主樑沿 u、+u 側懸臂伸到卡車道上）；
      // 堆場由後往前：H 型鋼捆兩層、鋼筋捆、鋼板堆、一排鋼捲；右側卡車道平板車正在吊裝型鋼；右後維修間；前區辦公室＋停車
      (g,ng,S,L)=>{const {P,pave,lineV,dashV,hazU,boxZ,lamp,mast,tree,bush,car,office,hut}=L;const T=ST(L);
        pave(g,'k',0,0,SZ,SZ,17201);
        pave(g,'y',.12,.1,1.3,1.5,17202);
        pave(g,'a',1.46,.46,.48,1.54,17203);
        pave(g,'c',.1,1.64,1.3,.3,17204);
        pave(g,'p',1.46,.12,.42,.32,17205);
        pave(g,'g',.06,1.93,1.34,.05,17206);
        backFence(L)(g);
        T.craneRailV(g,.2,.1,1.6);T.craneRailV(g,1.3,.1,1.6);
        lineV(g,1.47,.46,2,'#e2ddcd');lineV(g,1.93,.46,2,'#e2ddcd');dashV(g,1.69,.5,2,'#e8e2c8');
        hazU(g,1.62,.12,1.4);
        for(let k=0;k<=4;k++)lineV(g,.7+k*.16,1.7,1.9,'#dedad0');
        // 卡車（沿 v、車頭朝 +v）停在懸臂正下方、右腳外側：u 1.73–1.86；吊點 ut＝車身中線
        const TU=1.73,TW=.13,UT=TU+TW/2;
        L.shadow(g,[['b',.2,.7,.06,.44,40],['b',1.3,.7,.06,.44,40],['b',.74,.58,1.7,.1,2],['b',.32,.18,.84,.2,10],['b',.32,.5,.84,.18,10],
          ['b',.34,1.12,.84,.18,10],['b',1.48,.14,.38,.26,12],['b',.18,1.68,.4,.22,10],['b',TU,.5,TW,.72,10]],.22);
        T.stack(S,1.0,.32,.84,.18,.2,2,['beam','beam']);
        T.stack(S,1.3,.32,.84,.5,.18,2,['rebar','tube']);
        T.gantry(S,1.5,.2,1.3,.92,40,{cant:UT+.08-1.36,ut:UT,hz:31,sling:.28,load:(x,n,ut,vc,z)=>T.hangBundle(x,ut,vc,z,'v',.28,'primer')});
        T.plates(S,1.97,.36,1.12,.26,.18,4,11);T.stack(S,2.3,.7,.46,1.12,.16,2,['beam','tube'],{h:3});
        T.coilRow(S,2.4,.42,1.38,4,.2,.085,.1,[T.CP.cr,T.CP.hr,T.CP.gv],{seed:5});
        // 平板車：後段已裝一捆鍍鋅鋼管，前段空甲板等著接吊下來的紅丹 H 型鋼
        T.truck2(S,TU,.5,'v',{L:.72,W:TW,cab:'#4d86c2',cargo:(x,n,z)=>{T.bundle(x,TU+.02,TU+TW-.02,.53,.2,z,4,'galv');}});
        hut(S,1.48,.14,.38,.26,12,{door:.3,doorC:'#6f7b84',win:.75,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2',lampOver:1});
        office(S,.18,1.68,.4,.22,1,17211,{door:.4,band:'#e2b23a'});
        for(const [u,c] of[[.72,'#b8433a'],[.88,'#e8ecee'],[1.04,'#3d5f8a']])car(S,u,1.72,false,c);
        tree(S,1.3,1.9,.75,0);bush(S,.1,1.9,3);
        lamp(S,.1,1.58,22);lamp(S,1.94,.08,20);lamp(S,.1,.1,22);lamp(S,1.42,1.93,18);
        return{front:(g2)=>{frontFence(L,[],[[.745,.99]])(g2);L.signL(g2,.4,SZ-E,'y');L.signL(g2,SZ-E,1.2,'y');}};
      },
      // v1 室內鋼棚＋行車：左後長向鋼棚（屋脊沿 u；受光長立面有兩樘捲門、採光帶；東山牆整面開口可見棚內鋼捲），
      // 行車跑道自東山牆延伸到露天吊運段，橋式起重機（主樑沿 v）正把鋼捲吊上平板車；前場型鋼堆、鋼板堆、藍色懸臂料架；左前閘口地磅＋磅房、辦公室
      (g,ng,S,L)=>{const {P,pave,lineV,dashV,hazU,boxZ,RC,BL,fp,flat,faceL,faceR,ribsL,ribsR,pg,rowL,rowR,winL,winR,lamp,tree,bush,car,office,hut}=L;const T=ST(L);
        const u0=.1,u1=1.1,v0=.12,v1=.9,eh=32,rh=9,vm=(v0+v1)/2,HR=33,UA=1.13,UB=1.9,TU=1.6;
        pave(g,'k',0,0,SZ,SZ,17221);
        flat(g,u0,v0,u1-u0,v1-v0,'#8f8c84');                // 棚內地坪
        pave(g,'y',1.1,.12,.82,.8,17222);                 // 露天吊運段
        pave(g,'a',1.5,.92,.3,1.08,17223);                // 卡車道（沿 v，閘口在左前）
        pave(g,'y',.1,.96,1.36,.7,17224);                 // 前場堆料
        pave(g,'c',.1,1.68,.52,.26,17225);
        pave(g,'g',.66,1.93,.7,.05,17226);
        backFence(L)(g);
        lineV(g,1.51,.92,2,'#e2ddcd');lineV(g,1.79,.92,2,'#e2ddcd');hazU(g,.93,1.1,1.92);
        // 吊運區地面：卡車停車框（白框＋黃色吊掛警戒線）
        lineV(g,TU-.03,.24,.88,'#dcd6c4');lineV(g,TU+.16,.24,.88,'#dcd6c4');L.lineU(g,.24,TU-.03,TU+.16,'#dcd6c4');
        L.shadow(g,[['b',u0,v0,u1-u0,v1-v0,eh+5],['b',.2,1.37,.75,.26,21],['b',.14,1.72,.4,.2,10],['b',1.8,1.58,.14,.16,9],
          ['b',UB-.02,.18,.04,.04,27],['b',UB-.02,1.28,.04,.04,27],['b',TU,.26,.13,.58,8]],.22);
        // 棚內（先畫，從東山牆開口看進去）：內牆、成排鋼捲（端面朝開口）
        S.o(.3,(x)=>{faceR(x,u0,v0,v1,0,eh,'#575c61');faceL(x,v0,u0,u1,0,eh,'#6c7176');
          for(let v=v0+.14;v<v1;v+=.2){const p=P(u0,v,0);RC(x,p[0],p[1]-eh,1,eh,'#4a4f53');}
          BL(x,P(u0,v0+.1,25),P(u1,v0+.1,25),'#6a849e');BL(x,P(u0,v1-.1,25),P(u1,v1-.1,25),'#6a849e');});   // 棚內行車跑道（開口內可見）
        T.coilRowV(S,.6,.9,.3,3,.2,.085,.1,[T.CP.cr,T.CP.gv],{seed:21,tier2:true});
        T.stack(S,.7,.3,.5,.7,.14,2,['beam','rebar']);
        // 鋼棚外殼：東山牆（大開口）、受光長立面、雙坡屋頂（前坡採光板）
        S.o(1.5,(x,n)=>{const ov=.03,j=.08;
          fp(x,[P(u0-ov,v0-ov,eh),P(u1+ov,v0-ov,eh),P(u1+ov,vm,eh+rh),P(u0-ov,vm,eh+rh)],'#9aa3a8');
          faceR(x,u1,v0,v0+j,0,eh,'#7d878d');faceR(x,u1,v1-j,v1,0,eh,'#7d878d');faceR(x,u1,v0+j,v1-j,27,eh,'#7d878d');
          fp(x,[P(u1,v0,eh),P(u1,v1,eh),P(u1,vm,eh+rh)],'#7d878d');ribsR(x,u1,v0,v1,27,eh+rh-1,'#6c767c',2);ribsR(x,u1,v0,v0+j,1,27,'#6c767c',2);ribsR(x,u1,v1-j,v1,1,27,'#6c767c',2);
          BL(x,P(u1,v0+j,0),P(u1,v0+j,27),'#4f575d');BL(x,P(u1,v1-j,27),P(u1,v0+j,27),'#4f575d');
          faceL(x,v1,u0,u1,0,eh,'#c9cfd2');ribsL(x,u0,u1,v1,1,eh,'#b6bdc1',2);
          faceL(x,v1,u0+.02,u1-.02,eh-7,eh-3,'#d7e6ec');
          for(const [a,b] of[[.22,.46],[.58,.82]]){faceL(x,v1,a,b,0,19,'#9aa3a8');const p=P(a,v1,0);for(let z=2;z<19;z+=2)pg(x,p[0],p[1]-z,Math.round((b-a)*32),1,.5,'#88919a');
            faceL(x,v1,a-.01,b+.01,19,21,'#6f787d');const lp=P((a+b)/2,v1,22);RC(x,lp[0]-1,lp[1],3,1,'#f2e8c2');if(n)RC(n,lp[0]-1,lp[1],3,1,'#fff2cc');}
          winL(x,.94,v1,0,3,7,'#5d6a72');rowL(x,n,u0+.04,u1-.04,v1,eh-6,3,2,3,'#d7e6ec',231,.35);
          fp(x,[P(u0-ov,vm,eh+rh),P(u1+ov,vm,eh+rh),P(u1+ov,v1+ov,eh),P(u0-ov,v1+ov,eh)],'#c3cacd');
          for(let u=u0+.04;u<u1;u+=.06)BL(x,P(u,vm,eh+rh),P(u,v1+ov,eh),'#b3bbbf');
          for(const a of[.22,.52,.82])fp(x,[P(a,vm+.03,eh+rh-1),P(a+.12,vm+.03,eh+rh-1),P(a+.12,v1-.03,eh+1),P(a,v1-.03,eh+1)],'#d6e4ea');
          BL(x,P(u0-ov,vm,eh+rh),P(u1+ov,vm,eh+rh),'#eef1f2');BL(x,P(u0-ov,v1+ov,eh),P(u1+ov,v1+ov,eh),'#e4e8ea');
          BL(x,P(u1+ov,vm,eh+rh),P(u1+ov,v1+ov,eh),'#9aa3a8');});
        // 露天吊運段：後跑道 → 卡車 → 橋式起重機 → 前跑道
        // 跑道改沿 v：西側跑道樑用牛腿掛在東山牆上（開口上緣當楣樑，不立柱，開口露出棚內鋼捲），東側跑道立柱在 u 1.9；
        // 主樑沿 u 橫跨卡車（受光長面朝鏡頭），前方不再有跑道樑擋住吊掛物
        T.runwayV(S,1.6,UA,.16,.88,[],HR);
        S.o(1.61,(x)=>{for(const v of[.24,.52,.8])boxZ(x,u1,v-.015,UA-u1+.01,.03,HR-6,3,'#7f98b1','#6a849e','#4b6179');});
        T.runwayV(S,2.7,UB,.16,1.34,[.2,1.3],HR);   // 東側跑道柱避開卡車與吊掛物的視線（柱在 v .2／1.3，中間懸空）
        // 紅色平板車：後段已裝一捲（木墊座上），前段空甲板等橋式起重機放下第二捲
        T.truck2(S,TU,.26,'v',{L:.6,W:.13,cab:'#b8433a',cargo:(x,n,z)=>{const r=.066,uc=TU+.065;
          boxZ(x,uc-.05,.305,.1,.018,z,1,'#8d6d4e','#9c7b5b','#634a35');boxZ(x,uc-.05,.4,.1,.018,z,1,'#8d6d4e','#9c7b5b','#634a35');
          L.rcast(x,[L.capV(.31,.41,uc,z+r*L.ZT+.5,r,T.coilCol(T.CP.cr))],{edge:false});}});
        T.bridgeU(S,2.3,UA,UB,.56,HR,{ut:TU+.065,cz:11,r:.066,w:.1,load:T.CP.gv});   // 吊捲壓低到東側跑道樑下緣之下，兩者在畫面上分開
        // 前場：型鋼堆、鋼板堆、懸臂料架、堆高機
        T.stack(S,1.6,.2,.5,1.02,.18,2,['beam','tube']);
        T.plates(S,1.65,.8,1.04,.24,.18,4,31);
        T.rack(S,1.9,.2,.95,1.5,[['rebar','rebar'],['tube','galv'],['angle','beam']]);
        T.forklift(S,1.08,1.3,'u',-1,{d:2.45,carry:T.CP.hr});
        L.scale=null;
        boxZ(g,1.54,1.58,.22,.3,0,1,'#8e959a','#a2a9ad','#6f767b');flat(g,1.57,1.61,.16,.24,'#7d858a',1);
        hut(S,1.82,1.58,.13,.16,9,{win:.4,winR:.5,roof:'#7d868b',wl:'#e2ded3',wr:'#b8b3a7'});
        office(S,.14,1.72,.4,.2,1,17231,{door:.4,band:'#4c78a8'});
        car(S,.66,1.74,false,'#e8ecee');car(S,.82,1.74,false,'#3d5f8a');
        tree(S,.72,1.9,.75,1);bush(S,1.9,1.9,3);tree(S,1.2,1.9,.7,0);
        lamp(S,.1,.98,22);lamp(S,1.94,1.5,20);lamp(S,1.3,1.7,20);lamp(S,1.94,.1,22);
        return{front:(g2)=>{frontFence(L,[],[[.755,.92]])(g2);L.signL(g2,.9,SZ-E,'y');L.signL(g2,SZ-E,1.5,'r');}};
      },
      // v2 鋼捲堆場：左緣是沿 v 的鐵路側線，藍色直腿門式起重機（主樑沿 v、沿 u 軌道行走）騎在側線上方，用 C 形夾把一捲放進開放式鋼捲車的空槽；
      // 右側三排鋼捲沿 u 排開、排間留淺色混凝土走道——後排熱軋暗灰（兩層）、中排冷軋藍灰（單層、抽走一捲）、前排鍍鋅（單層，只有這排畫捲眼）；
      // 吊車在左、鋼捲在右：高聳的門架不再擋住鋼捲排。前段卡車道（邊線＋中心虛線＋停止線，與鐵路平交）停著載捲的平板車；
      // 右後工具間＋枕木堆；前區辦公室、停車
      (g,ng,S,L)=>{const {P,flat,pave,lineU,lineV,dashU,trackV,boxZ,lamp,tree,bush,car,office,hut,RC,BL,GA}=L;const T=ST(L),C=T.CP;
        // 三排：v .1／.54／.98，捲徑 r .075、捲長 .09；單層捲遮地深度約 .215 → 排間可見走道約 .135（≈4px）
        const UR=.3,VA=.06,VB=1.14,HP=30,r=.075,sp=.2,RU=.8,CW=.09,R0=.1,R1=.54,R2=.98,TV=1.355,TU=.7;
        pave(g,'k',0,0,SZ,SZ,17241);
        pave(g,'c',.1,.04,1.86,1.16,17242);                  // 堆場走道（淺色混凝土）
        for(const v0 of[R0,R1,R2])pave(g,'y',.7,v0-.01,1.02,CW+.02,17247+v0*100|0);   // 鋼捲床（深色重載混凝土）
        pave(g,'c',.5,1.54,1.46,.4,17244);
        pave(g,'g',.5,1.93,.86,.05,17245);
        trackV(g,UR,0,SZ,17246);
        pave(g,'a',.1,1.22,1.9,.28,17243);                   // 卡車道（與鐵路平交）
        for(const k of[-GA,GA]){lineV(g,UR+k,1.22,1.5,'#43484c');lineV(g,UR+k,1.22,1.5,'#b9bfc2',1);}
        backFence(L,[[.05,.22]],[])(g);
        lineU(g,1.23,.5,2,'#e2ddcd');lineU(g,1.49,.5,2,'#e2ddcd');dashU(g,1.36,.54,1.96,'#e8e2c8');
        lineV(g,1.38,TV+.01,1.48,'#f0ece0');lineV(g,1.4,TV+.01,1.48,'#f0ece0');   // 停止線
        T.craneRailU(g,VA,.06,1.95);T.craneRailU(g,VB,.06,1.95);
        for(const v of[R0+CW+.075,R1+CW+.075])lineU(g,v,.7,1.72,'#d8b340');   // 走道中線
        for(let k=0;k<=4;k++)lineV(g,.6+k*.16,1.64,1.84,'#dedad0');   // 停車格
        L.shadow(g,[['b',RU-.08,R0,1.0,CW,12],['b',RU-.08,R1,1.0,CW,7],['b',RU+.12,R2,.76,CW,7],['b',1.62,1.64,.34,.2,10],['b',1.76,.12,.18,.26,10],
          ['b',UR-.2,VA-.04,.4,.08,HP],['b',UR-.2,VB-.04,.4,.08,HP],['b',TU,TV,.62,.13,8],['b',UR-.065,.02,.13,1.0,9]],.2);
        T.portalV(S,.2,2.3,UR,VA,VB,HP,{vt:.76,cz:20,r:.07,w:.08,load:C.gv,sp:.17});
        T.coilCarV(S,UR,.02,.44,{hood:1,hoodPal:['#8fb0c9','#79a0bd','#6690b0','#557e9c','#476c87','#3b5a71'],col:'#56636f',d:.8});
        T.coilCarV(S,UR,.5,.52,{pals:[C.gv],flat:T.CF.cr,skip:[1],seed:9,col:'#6b5a4c',d:1.1});
        T.coilRow(S,1.0,RU,R0,5,sp,r,CW,[C.hr],{seed:41,tier2:true,skip2:[3],flat:T.CF.hr});
        T.coilRow(S,1.4,RU,R1,5,sp,r,CW,[C.cr],{seed:42,skip:[1],flat:T.CF.cr});
        T.coilRow(S,1.9,RU+.2,R2,4,sp,r,CW,[C.gv,C.cr],{seed:43});
        // 右後：工具間＋兩垛枕木（捲墊）
        hut(S,1.76,.12,.18,.26,10,{door:.35,doorC:'#6f7b84',winR:.5,roof:'#7d868b',wl:'#dcd8cc',wr:'#b3aea2',lampOver:1});
        for(const v0 of[.5,.78])S.o(1.8+v0,(x)=>{for(let k=0;k<3;k++)for(let i=0;i<4;i++)boxZ(x,1.76+(k%2)*.01,v0+i*.045,.17,.034,k*2,2,'#a3825f','#94734f','#654b34');});
        T.truck2(S,TU,TV,'u',{L:.62,W:.13,cab:'#d9822b',cargo:(x,n,z)=>{const rr=.072,uc=TU+.22;
          boxZ(x,uc-.06,TV+.015,.02,.1,z,1,'#8d6d4e','#9c7b5b','#634a35');boxZ(x,uc+.04,TV+.015,.02,.1,z,1,'#8d6d4e','#9c7b5b','#634a35');
          L.rcast(x,[L.capV(TV+.015,TV+.115,uc,z+rr*L.ZT+.5,rr,T.coilCol(C.cr))],{edge:false});}});
        office(S,1.62,1.64,.34,.2,1,17251,{door:.3,band:'#3d6c9a'});   // 出貨辦公室兼磅房（靠右，不擋卡車）
        for(const [u,c] of[[.64,'#e8ecee'],[.8,'#b8433a'],[1.12,'#3d5f8a']])car(S,u,1.67,false,c);        tree(S,.56,1.9,.7,2);bush(S,1.22,1.9,3);
        lamp(S,1.94,.45,22);lamp(S,.08,1.6,20);lamp(S,1.94,1.58,20);
        return{front:(g2)=>{frontFence(L,[[.61,.76]],[[.05,.22]])(g2);L.signL(g2,.8,SZ-E,'y');L.signL(g2,SZ-E,1.64,'r');}};
      },
    ];
    build(172,K172);
  }catch(e){errs.push('k172: '+(e&&e.stack||e));}

  window.__logiE=errs;
  if(errs.length)throw new Error('logi_e: '+errs.join(' | '));
});
