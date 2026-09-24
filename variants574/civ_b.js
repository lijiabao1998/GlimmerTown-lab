// T613 civ_b：k61 消防總局（3×3，208×220，錨 104,218）／k95 森林消防瞭望塔（1×1，72×112，錨 36,110）實驗線重畫。
// 分層合成（沿用 logi_b 的做法）：立體主體各自一層（二值化＋深色外框）；旗桿／天線／欄杆走不描邊的細線層；
// 地面（鋪面、標線、水池）直接畫在地面層。夜光按層遮擋（後層實體擦掉被擋住的燈）。
// 零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function civ_b(A){
  // 本批要蓋過較早批次（b03 等）寫入的同鍵變體：不在清單尾端時把自己排到尾端再跑（for-of 會走到新推入的項）
  {const QL=window.__variants574;if(!civ_b.__q&&QL[QL.length-1]!==civ_b){civ_b.__q=1;QL.push(civ_b);return;}}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const BL2=(g,a,b,c1,c2)=>{BL(g,a,b,c1);BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],c2);};
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
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    // 牆面逐欄走訪：+v 面（colsL）／+u 面（colsR）；回呼 (X, 該欄在高度 z 的像素列, 欄序)
    const colsL=(v,ua,ub,z,fn)=>{const a=P(ua,v,z),b=P(ub,v,z),x0=Math.ceil(a[0]-.5);for(let X=x0;X<Math.ceil(b[0]-.5);X++)fn(X,Math.ceil(a[1]+(X+.5-a[0])*.5-.5),X-x0);};
    const colsR=(u,va,vb,z,fn)=>{const a=P(u,vb,z),b=P(u,va,z),x0=Math.ceil(a[0]-.5);for(let X=x0;X<Math.ceil(b[0]-.5);X++)fn(X,Math.ceil(a[1]-(X+.5-a[0])*.5-.5),X-x0);};
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>colsL(v,ua,ub,zb,(X,y,i)=>{if(i>=off&&(i-off)%step===0)RC(g,X,y+1,1,zb-za-2,c);});
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>colsR(u,va,vb,zb,(X,y,i)=>{if(i>=off&&(i-off)%step===0)RC(g,X,y+1,1,zb-za-2,c);});
    const courseL=(g,v,ua,ub,za,zb,c,st=3)=>{for(let z=za+st;z<zb;z+=st)colsL(v,ua,ub,z,(X,y)=>RC(g,X,y,1,1,c));};
    const courseR=(g,u,va,vb,za,zb,c,st=3)=>{for(let z=za+st;z<zb;z+=st)colsR(u,va,vb,z,(X,y)=>RC(g,X,y,1,1,c));};
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    // 牆面上的矩形（像素精準）：+v 面第 i0..i1 欄、高 za..zb
    const recL=(g,v,ua,ub,i0,i1,za,zb,c)=>colsL(v,ua,ub,zb,(X,y,i)=>{if(i>=i0&&i<i1)RC(g,X,y,1,zb-za,c);});
    const recR=(g,u,va,vb,i0,i1,za,zb,c)=>colsR(u,va,vb,zb,(X,y,i)=>{if(i>=i0&&i<i1)RC(g,X,y,1,zb-za,c);});
    const nL=(v,ua,ub)=>Math.ceil(P(ub,v,0)[0]-.5)-Math.ceil(P(ua,v,0)[0]-.5);
    const nR=(u,va,vb)=>Math.ceil(P(u,va,0)[0]-.5)-Math.ceil(P(u,vb,0)[0]-.5);
    // 一列窗：+v 面，寬 w、間距 gap、高 za..zb；o.lit 夜亮機率、o.sill 窗台、o.frame 窗框
    const winsL=(g,n,v,ua,ub,za,zb,w,gap,glass,seed,o={})=>{const N=nL(v,ua,ub),cnt=Math.max(1,Math.floor((N-gap)/(w+gap))),pad=Math.floor((N-cnt*(w+gap)+gap)/2);
      for(let k=0;k<cnt;k++){const i0=pad+k*(w+gap),i1=i0+w;
        if(o.frame)recL(g,v,ua,ub,i0-1,i1+1,za-1,zb+1,o.frame);
        recL(g,v,ua,ub,i0,i1,za,zb,glass);recL(g,v,ua,ub,i0,i1,zb-1,zb,SH(glass,34));
        if(o.mul&&w>=4)recL(g,v,ua,ub,i0+(w>>1),i0+(w>>1)+1,za,zb,o.mul);
        if(o.sill)recL(g,v,ua,ub,i0-1,i1+1,za-1,za,o.sill);
        if(n&&hsh(seed,k,za)<(o.lit==null?.55:o.lit))recL(n,v,ua,ub,i0,i1,za,zb-(o.gl?1:0),o.lc||'#ffe3a0');}};
    const winsR=(g,n,u,va,vb,za,zb,w,gap,glass,seed,o={})=>{const N=nR(u,va,vb),cnt=Math.max(1,Math.floor((N-gap)/(w+gap))),pad=Math.floor((N-cnt*(w+gap)+gap)/2);
      for(let k=0;k<cnt;k++){const i0=pad+k*(w+gap),i1=i0+w;
        if(o.frame)recR(g,u,va,vb,i0-1,i1+1,za-1,zb+1,o.frame);
        recR(g,u,va,vb,i0,i1,za,zb,glass);recR(g,u,va,vb,i0,i1,zb-1,zb,SH(glass,20));
        if(o.mul&&w>=4)recR(g,u,va,vb,i0+(w>>1),i0+(w>>1)+1,za,zb,o.mul);
        if(o.sill)recR(g,u,va,vb,i0-1,i1+1,za-1,za,o.sill);
        if(n&&hsh(seed,k,za+50)<(o.lit==null?.5:o.lit))recR(n,u,va,vb,i0,i1,za,zb,o.lc||'#f3d68e');}};
    const RX=r=>Math.max(1,rnd(r*45.25));
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const ring=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let x=-rx;x<=rx;x++){const y=hx(rx,ry,x);g.fillRect(cx+x,cy+y,1,1);g.fillRect(cx+x,cy-y,1,1);}
      for(let y=-ry;y<=ry;y++){const x=hw(rx,ry,y);g.fillRect(cx+x,cy+y,1,1);g.fillRect(cx-x,cy+y,1,1);}};
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=hx(rx,ry,x);g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h];};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h,z] 方盒／['c',u,v,r,h,z] 圓柱／['p',u,v,h] 細桿
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else if(s[0]==='c'){const[,u,v,r,h,z=0]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45,z);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}
        else{const[,u,v,h]=s,k=h/64;BL(sx,P(u,v),P(u+k,v-k*.45),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      q:{t:['#cdc9be','#c7c3b8','#d3cfc4'],j:'#b9b5aa',s:.25,p:.5},     // 車庫前混凝土坪
      a:{t:['#6f6d69','#6a6864','#75736e'],j:null,s:.125,p:.7},         // 瀝青
      k:{t:['#a9a497','#a29d91','#b1ac9f'],j:null,s:.0625,p:.55},       // 碎石
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.7},         // 草
      c:{t:['#bdb9ae','#b7b3a8','#c3bfb4'],j:'#aba79c',s:.25,p:.6},     // 一般混凝土
      p:{t:['#c7b39a','#bca78e','#d0bda4'],j:'#ad9a82',s:.125,p:.55},    // 廣場磚
      d:{t:['#a38a68','#9a8161','#ab9270'],j:null,s:.0625,p:.6},         // 泥土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0+.04),P(a,v0+dv-.04),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0+.04,b),P(u0+du-.04,b),M.j);}};
    // 硬邊圍籬（取代 K.fence 的抗鋸齒線）：立柱＋頂欄實線＋中欄點線
    const fenceP=(g,a,b,gap)=>{const pa=P(...a),pb=P(...b),n=Math.max(3,Math.round(Math.hypot(pb[0]-pa[0],pb[1]-pa[1])/7));
      const at=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);
      const seg=(t0,t1)=>{BL(g,at(t0,6),at(t1,6),'#b3bbc0');const q0=at(t0,3),q1=at(t1,3),m=Math.max(1,Math.round(Math.abs(q1[0]-q0[0])));for(let k=0;k<=m;k+=2){const q=lerp(q0,q1,k/m);RC(g,q[0],q[1],1,1,'#a3abb0');}};
      if(gap){seg(0,gap[0]);seg(gap[1],1);}else seg(0,1);
      for(let i=0;i<=n;i++){const t=i/n;if(gap&&t>gap[0]&&t<gap[1])continue;const p=at(t,0);RC(g,p[0],p[1]-7,1,7,'#7d868b');}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const stallsU=(g,u0,v0,du,n,dv=.2,c='#dedad0')=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c='#dedad0')=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const curb=(g,u0,v0,du,dv,c='#e2ded4')=>{lineU(g,v0,u0,u0+du,c);lineU(g,v0+dv,u0,u0+du,c);lineV(g,u0,v0,v0+dv,c);lineV(g,u0+du,v0,v0+dv,c);};
    // ---------- 小件 ----------
    const CARC=['#b8bec4','#2f3a48','#e8e8e4','#8e2f2a','#3b5c7e','#6d7470','#c9b48a'];
    const car=(S,u,v,alongU,col,d)=>S.o(d!=null?d:u+v+.1,(g)=>{const du=alongU?.15:.08,dv=alongU?.08:.15;
      boxZ(g,u,v,du,dv,1,2,col,SH(col,20),SH(col,-40));boxZ(g,u+(alongU?.04:.01),v+(alongU?.01:.04),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa3bb','#5a7d94');});
    const lamp=(S,u,v,h=16,d)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const pine=(S,u,v,s=1,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),h=rnd(16*s);
      RC(g,x,y-3,1,3,'#5a4130');for(let i=0;i<h-2;i++){const w=Math.max(0,rnd((i/(h-2))*4.2*s));const yy=y-h+i;RC(g,x-w,yy,w,1,'#3f7a3c');RC(g,x,yy,w+1,1,'#2c5a2e');if(i%3===2)RC(g,x-w,yy,1,1,'#5d9a4e');}});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    // 人：制服深藍或出勤服卡其（黃反光帶）
    const man=(S,u,v,kind=0,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      const body=kind===1?'#b89a5c':kind===2?'#c8553d':'#2f3b57',head=kind===1?'#e8c23a':'#e2b48c';
      RC(g,x,y-2,2,2,'#262a30');RC(g,x,y-5,2,3,body);if(kind===1)RC(g,x,y-4,2,1,'#e9e27a');RC(g,x,y-7,2,2,head);});
    const hydrant=(S,u,v,d)=>S.o(d!=null?d:u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-5,3,5,'#c9362b');RC(g,x-2,y-3,5,1,'#e0584a');RC(g,x-1,y-6,3,1,'#e8e4dc');});
    const cone=(g,u,v)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#d8562a');RC(g,x,y-3,1,2,'#ef7a3a');RC(g,x,y-2,1,1,'#f2f0ea');};
    // 高桿照明
    const mast=(S,u,v,h=34,d)=>S.t(d!=null?d:u+v+.05,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-1,3,1,'#7d8388');RC(g,x,y-h,1,h-1,'#b9c0c4');RC(g,x+1,y-h+2,1,h-3,'#80878c');
      RC(g,x-2,y-h-2,5,2,'#5b6166');RC(g,x-2,y-h,5,1,'#e9e2c4');if(n){RC(n,x-2,y-h,5,1,'#fff2c8');RC(n,x-1,y-h+1,3,1,'rgba(255,232,170,.5)');}});
    // 旗桿群：pts=[[u,v,h,旗色序],...]；main＝掛動態旗的那根序號。
    // 繪製端 SPR.flag（14×22、錨 7,22）自帶 20px 桿身（flagAt.x-1..flagAt.x、flagAt.y-20..flagAt.y-1）＋旗面往右飄約 9px，疊在整張圖之上不受遮擋。
    // 所以主桿只畫 8–12px 下段桿身＋底座，flagAt＝本段第一列（桿頂），兩段顏色一致（#8a8a86）接成一根；
    // 主桿要放在地塊左右角（上方是透明背景），flagAt 上方不得有不透明像素；陪襯桿（靜態小旗）排在主桿左側，旗面不伸進動態旗的範圍。
    const FLAGC=[['#c9362b','#f2f0ea'],['#2c5aa0','#f2f0ea'],['#e8b23c','#c88f28']];
    const flagpoles=(S,pts,main,d)=>{const pp=pts.map(([u,v,h,ci])=>{const p=P(u,v);return[rnd(p[0]),rnd(p[1]),h,ci|0];});
      if(pp[main][2]<8||pp[main][2]>12)throw new Error('主旗桿下段須 8–12px');
      const at=[pp[main][0]+1,pp[main][1]-pp[main][2]];
      S.t(d,(g)=>{pp.forEach(([x,y,h,ci],i)=>{RC(g,x-1,y-2,4,2,'#c9c5ba');RC(g,x-1,y-1,4,1,'#8f8b82');RC(g,x+2,y-2,1,2,'#9e9a90');
        RC(g,x,y-h,2,h-2,'#8a8a86');
        if(i!==main){RC(g,x,y-h,2,2,'#c8ccd2');const fc=FLAGC[ci];
          RC(g,x+2,y-h+1,5,4,fc[0]);RC(g,x+7,y-h+2,1,3,fc[0]);RC(g,x+2,y-h+3,5,1,fc[1]);RC(g,x+4,y-h+2,1,2,SH(fc[0],-30));}});});
      return at;};
    return{P,hsh,RC,BL,BL2,lerp,fp,Q,flat,boxZ,faceL,faceR,colsL,colsR,ribsL,ribsR,courseL,courseR,pg,recL,recR,nL,nR,winsL,winsR,RX,hw,hx,ell,ring,cyl,scene,shadow,
      MATS,pave,fenceP,lineU,lineV,dashU,dashV,stallsU,stallsV,curb,CARC,car,lamp,tree,pine,bush,man,hydrant,cone,mast,flagpoles};
  };

  // ================= 消防元件（k61 用）=================
  const FIRE=(K,L)=>{
    const {P,hsh}=K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,colsL,colsR,ribsL,ribsR,courseL,courseR,recL,recR,nL,nR,winsL,winsR,ell,ring,cyl,pg}=L;
    const RED='#cf3a2e',REDT=SH(RED,34),REDD=SH(RED,-62);
    const BRK={l:'#b35a43',r:'#88402f',j:'#9b4b37',jr:'#763628'};   // 紅磚
    const CON={l:'#e4dfd3',r:'#b8b1a2',j:'#d3cdbf',jr:'#a8a192'};   // 清水混凝土／米色
    // 捲門（+v 面）：i0 起算欄、寬 w、高 h；st 0 關／1 開
    const doorL=(g,n,v,ua,ub,i0,w,h,st,col=RED)=>{recL(g,v,ua,ub,i0-1,i0+w+1,0,h+2,'#ebe7de');recL(g,v,ua,ub,i0-1,i0+w+1,0,1,'#b9b4aa');
      if(!st){recL(g,v,ua,ub,i0,i0+w,0,h,col);for(let z=1;z<h;z+=2)recL(g,v,ua,ub,i0,i0+w,z,z+1,SH(col,-30));recL(g,v,ua,ub,i0,i0+w,h-1,h,SH(col,26));
        recL(g,v,ua,ub,i0+1,i0+w-1,h-5,h-4,'#8fb2c8');}
      else{recL(g,v,ua,ub,i0,i0+w,0,h,'#2a2c30');recL(g,v,ua,ub,i0,i0+w,h-2,h,col);recL(g,v,ua,ub,i0,i0+w,h-3,h-2,SH(col,-50));
        recL(g,v,ua,ub,i0,i0+w,0,1,'#45484d');if(n)recL(n,v,ua,ub,i0,i0+w,1,h-3,'rgba(255,221,150,.42)');}
      const c=Math.floor(i0+w/2);recL(g,v,ua,ub,c-1,c+1,h+3,h+4,'#f4ecc4');if(n)recL(n,v,ua,ub,c-1,c+1,h+3,h+4,'#ffeeb0');};
    const doorR=(g,n,u,va,vb,i0,w,h,st,col=SH(RED,-30))=>{recR(g,u,va,vb,i0-1,i0+w+1,0,h+2,'#c9c4ba');recR(g,u,va,vb,i0-1,i0+w+1,0,1,'#9c978d');
      if(!st){recR(g,u,va,vb,i0,i0+w,0,h,col);for(let z=1;z<h;z+=2)recR(g,u,va,vb,i0,i0+w,z,z+1,SH(col,-26));recR(g,u,va,vb,i0,i0+w,h-1,h,SH(col,18));
        recR(g,u,va,vb,i0+1,i0+w-1,h-5,h-4,'#6f8ea3');}
      else{recR(g,u,va,vb,i0,i0+w,0,h,'#222428');recR(g,u,va,vb,i0,i0+w,h-2,h,col);recR(g,u,va,vb,i0,i0+w,h-3,h-2,SH(col,-40));
        if(n)recR(n,u,va,vb,i0,i0+w,1,h-3,'rgba(255,221,150,.4)');}
      const c=Math.floor(i0+w/2);recR(g,u,va,vb,c-1,c+1,h+3,h+4,'#e8dfb4');if(n)recR(n,u,va,vb,c-1,c+1,h+3,h+4,'#ffeeb0');};
    // 平頂女兒牆屋頂
    const roofFlat=(g,u0,v0,du,dv,z,c='#8b9092')=>{flat(g,u0+.04,v0+.04,du-.08,dv-.08,c,z);
      BL(g,P(u0+.04,v0+.04,z),P(u0+du-.04,v0+.04,z),SH(c,-22));BL(g,P(u0+.04,v0+.04,z),P(u0+.04,v0+dv-.04,z),SH(c,-16));};
    // 消防車：al='u' 車頭朝 +u（左側長邊在 +v 亮面）；al='v' 車頭朝 +v（車頭在 +v 亮面、右側長邊在 +u 暗面）
    // kind：p 水箱車／l 雲梯車／a 救護車／r 救助器材車／t 水庫車
    const engine=(S,u,v,al,kind,d)=>S.o(d,(g,n)=>{
      const amb=kind==='a',L0=kind==='l'?.58:kind==='t'?.52:amb?.36:.48,Wd=.13,cab=amb?.12:.14;
      const bT=amb?'#f4f2ec':REDT,bL=amb?'#f7f5f0':RED,bR=amb?'#c8c5bd':REDD,hb=amb?10:9;
      const ch=['#3a3d40','#2c2f32','#1f2124'];
      if(al==='u'){const u1=u+L0,uc=u1-cab;
        boxZ(g,u,v,L0,Wd,0,2,...ch);
        if(kind==='t'){boxZ(g,u,v,uc-u-.01,Wd,2,1,'#6d7174','#5a5e61','#43474a');const r=P(u+(uc-u)*.5,v+Wd*.5,3);cyl(g,r[0],r[1]-1,4,6,[SH(RED,40),RED,SH(RED,-30),REDD],REDT);}
        else boxZ(g,u,v,uc-u,Wd,2,hb-2,bT,bL,bR);
        boxZ(g,uc,v-.004,cab,Wd+.008,2,hb-3,bT,bL,bR);
        fp(g,[P(u1,v,hb-3+2),P(u1,v+Wd,hb-3+2),P(u1+.015,v+Wd,5),P(u1+.015,v,5)],'#35536b');
        faceR(g,u1+.015,v+.01,v+Wd-.01,2,5,bR);faceR(g,u1+.016,v+.02,v+Wd-.02,2,3,'#b9c0c5');
        faceL(g,v+Wd+.004,uc+.03,u1-.02,5,hb-2,'#35536b');
        if(!amb&&kind!=='t'){colsL(v+Wd,u+.04,uc-.03,hb-2,(X,y,i)=>{RC(g,X,y,1,hb-6,i%3===2?'#9aa2a8':'#c6ccd1');});}
        if(amb){faceL(g,v+Wd,u,uc,4,6,'#d13b2f');faceL(g,v+Wd+.004,uc,u1,4,5,'#d13b2f');}
        else faceL(g,v+Wd+.004,u,u1,3,4,'#f2efe6');
        for(const t of [u+.07,u+.17,u1-.07]){const p=P(t,v+Wd,0);RC(g,p[0]-1,p[1]-2,3,3,'#1c1d20');RC(g,p[0],p[1]-1,1,1,'#8d9196');}
        const lb=P(uc+cab*.5,v+Wd*.5,hb);RC(g,lb[0]-2,lb[1]-1,4,1,'#ff3b2f');RC(g,lb[0]-2,lb[1],4,1,'#9c1e18');
        if(n){RC(n,lb[0]-2,lb[1]-1,4,1,'#ff5a48');const h1=P(u1+.016,v+.02,3),h2=P(u1+.016,v+Wd-.02,3);RC(n,h1[0]-1,h1[1]-1,1,1,'#fff3c8');RC(n,h2[0],h2[1]-1,1,1,'#fff3c8');}
        if(kind==='l'){for(const dv of[.03,Wd-.03]){BL(g,P(u+.02,v+dv,hb+1),P(u1+.08,v+dv,hb+1),'#dfe3e6');}
          for(let t=u+.04;t<u1+.06;t+=.035){BL(g,P(t,v+.03,hb+1),P(t,v+Wd-.03,hb+1),'#aab1b6');}
          boxZ(g,u+.03,v+.02,.08,Wd-.04,hb-1,2,'#e0e4e7','#cfd4d8','#9da4a9');}
        if(kind==='r'){boxZ(g,u+.05,v+.02,uc-u-.1,Wd-.04,hb,1,'#6b7075','#5a5f63','#474b4f');}
      }else{const v1=v+L0,vc=v1-cab;
        boxZ(g,u,v,Wd,L0,0,2,...ch);
        if(kind==='t'){boxZ(g,u,v,Wd,vc-v-.01,2,1,'#6d7174','#5a5e61','#43474a');const r=P(u+Wd*.5,v+(vc-v)*.5,3);cyl(g,r[0],r[1]-1,4,6,[SH(RED,40),RED,SH(RED,-30),REDD],REDT);}
        else boxZ(g,u,v,Wd,vc-v,2,hb-2,bT,bL,bR);
        boxZ(g,u-.004,vc,Wd+.008,cab,2,hb-3,bT,bL,bR);
        fp(g,[P(u,v1,hb-1),P(u+Wd,v1,hb-1),P(u+Wd,v1+.015,5),P(u,v1+.015,5)],'#3d5d77');
        faceL(g,v1+.015,u+.01,u+Wd-.01,2,5,bL);faceL(g,v1+.016,u+.02,u+Wd-.02,2,3,'#d7dcdf');
        faceR(g,u+Wd+.004,vc+.03,v1-.02,5,hb-2,'#2d4659');
        if(!amb&&kind!=='t'){colsR(u+Wd,v+.04,vc-.03,hb-2,(X,y,i)=>{RC(g,X,y,1,hb-6,i%3===2?'#7f878d':'#a4abb0');});}
        if(amb){faceR(g,u+Wd,v,vc,4,6,'#b0302a');}
        else faceR(g,u+Wd+.004,v,v1,3,4,'#cfccc4');
        for(const t of [v+.07,v+.17,v1-.07]){const p=P(u+Wd,t,0);RC(g,p[0]-2,p[1]-2,3,3,'#1c1d20');RC(g,p[0]-1,p[1]-1,1,1,'#7d8186');}
        const lb=P(u+Wd*.5,vc+cab*.5,hb);RC(g,lb[0]-2,lb[1]-1,4,1,'#ff3b2f');RC(g,lb[0]-2,lb[1],4,1,'#9c1e18');
        if(n){RC(n,lb[0]-2,lb[1]-1,4,1,'#ff5a48');const h1=P(u+.02,v1+.016,3),h2=P(u+Wd-.02,v1+.016,3);RC(n,h1[0],h1[1]-1,1,1,'#fff3c8');RC(n,h2[0]-1,h2[1]-1,1,1,'#fff3c8');}
        if(kind==='l'){for(const du of[.03,Wd-.03]){BL(g,P(u+du,v+.02,hb+1),P(u+du,v1+.08,hb+1),'#dfe3e6');}
          for(let t=v+.04;t<v1+.06;t+=.035){BL(g,P(u+.03,t,hb+1),P(u+Wd-.03,t,hb+1),'#aab1b6');}
          boxZ(g,u+.02,v+.03,Wd-.04,.08,hb-1,2,'#e0e4e7','#cfd4d8','#9da4a9');}
        if(kind==='r'){boxZ(g,u+.02,v+.05,Wd-.04,vc-v-.1,hb,1,'#6b7075','#5a5f63','#474b4f');}
      }});
    return{RED,REDT,REDD,BRK,CON,doorL,doorR,roofFlat,engine};
  };

  // ================= k61 消防總局（3×3）=================
  try{
    const o0=B['61_1_0'];const W=o0.w,H=o0.h,AX=o0.ax,AY=o0.ay,SZ=3;
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),F=FIRE(K,L);
    const {P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,colsL,colsR,courseL,courseR,recL,recR,nL,nR,winsL,winsR,ell,cyl,pave,lineU,lineV,dashU,dashV,stallsU,stallsV,curb,car,lamp,tree,bush,man,hydrant,cone,mast,flagpoles,shadow,CARC}=L;
    const {RED,REDT,REDD,BRK,CON,doorL,doorR,roofFlat,engine}=F;
    const HV=(g,u,v,du=.14,dv=.1,z=0,h=4)=>{boxZ(g,u,v,du,dv,z,h,'#c9ced1','#dde1e3','#a9b0b4');const p=P(u+du*.5,v+dv*.5,z+h);RC(g,p[0]-2,p[1]-1,4,1,'#8d9599');};
    // 車庫樓（門在 +v 面、平頂）
    const hallV=(S,u0,v0,du,dv,o,d)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,h1=o.h1||14,h2=o.h2||0,Ht=h1+h2+(h2?3:2),C=o.brick?BRK:CON;
      boxZ(g,u0,v0,du,dv,0,Ht,'#9da1a3',C.l,C.r);
      if(o.brick){courseL(g,v1,u0,u1,1,Ht-1,C.j,3);courseR(g,u1,v0,v1,1,Ht-1,C.jr,3);}
      faceL(g,v1,u0,u1,0,1,SH(C.l,-40));faceR(g,u1,v0,v1,0,1,SH(C.r,-30));
      if(h2){faceL(g,v1,u0,u1,h1+1,h1+3,'#ece8df');faceR(g,u1,v0,v1,h1+1,h1+3,'#c4bfb5');}
      faceL(g,v1,u0,u1,Ht-2,Ht,'#efebe2');faceR(g,u1,v0,v1,Ht-2,Ht,'#c9c4ba');
      roofFlat(g,u0,v0,du,dv,Ht);
      const N=nL(v1,u0,u1),nb=o.nb,bw=N/nb,dw=o.dw||Math.max(6,Math.floor(bw)-3);
      for(let i=0;i<nb;i++){const i0=Math.round(bw*i+(bw-dw)/2);doorL(g,n,v1,u0,u1,i0,dw,h1-3,o.open&&o.open[i]?1:0);}
      if(h2)winsL(g,n,v1,u0,u1,h1+5,h1+5+Math.min(5,h2-3),2,3,'#48677e',6100+nb,{sill:'#ece8df',lit:.5});
      winsR(g,n,u1,v0,v1,5,10,2,4,'#3f5a70',6109,{frame:'#e9e5dc',lit:.4});
      if(h2)winsR(g,n,u1,v0,v1,h1+5,h1+5+Math.min(5,h2-3),2,4,'#3f5a70',6110,{lit:.5});
      if(o.sign){const s=o.sign;recL(g,v1,u0,u1,s[0],s[1],Ht-1,Ht+4,'#f3f0e8');recL(g,v1,u0,u1,s[0]+1,s[1]-1,Ht,Ht+3,RED);
        for(let i=s[0]+2;i<s[1]-2;i+=3)recL(g,v1,u0,u1,i,i+2,Ht+1,Ht+2,'#f3f0e8');if(n)recL(n,v1,u0,u1,s[0]+1,s[1]-1,Ht,Ht+3,'rgba(255,90,70,.55)');}
      for(const [a,b] of (o.hvac||[]))HV(g,u0+a,v0+b,.14,.1,Ht);
    });
    // 側向車庫（門在 +u 面、雙坡金屬屋頂，屋脊沿 v；山牆在 +v 面）
    const hallU=(S,u0,v0,du,dv,o,d)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,h1=o.h1||16,rh=o.rh||9,C=CON,um=u0+du/2,ov=.035;
      boxZ(g,u0,v0,du,dv,0,h1,null,C.l,C.r);
      fp(g,[P(u0,v1,h1),P(u1,v1,h1),P(um,v1,h1+rh)],C.l);
      faceL(g,v1,u0,u1,0,1,SH(C.l,-40));faceR(g,u1,v0,v1,0,1,SH(C.r,-30));
      faceL(g,v1,u0,u1,h1-3,h1-1,RED);faceR(g,u1,v0,v1,h1-3,h1-1,SH(RED,-44));
      const N=nR(u1,v0,v1),nb=o.nb,bw=N/nb,dw=o.dw||Math.max(6,Math.floor(bw)-3);
      for(let i=0;i<nb;i++){const i0=Math.round(bw*i+(bw-dw)/2);doorR(g,n,u1,v0,v1,i0,dw,h1-6,o.open&&o.open[i]?1:0);}
      // 山牆：圓窗＋局徽＋兩扇窗＋側門
      const M=nL(v1,u0,u1),c=M>>1;
      winsL(g,n,v1,u0,u1,3,9,2,5,'#3f5c72',6150,{frame:'#f0ece3',lit:.6});
      recL(g,v1,u0,u1,c-3,c+3,h1+1,h1+6,'#f2efe8');recL(g,v1,u0,u1,c-2,c+2,h1+2,h1+5,RED);recL(g,v1,u0,u1,c-1,c+1,h1+1,h1+6,RED);
      const RL=o.rl||'#b8483b',RD=SH(RL,-52);
      fp(g,[P(u0-ov,v0-ov,h1-1),P(um,v0-ov,h1+rh),P(um,v1+ov,h1+rh),P(u0-ov,v1+ov,h1-1)],RL);
      fp(g,[P(um,v0-ov,h1+rh),P(u1+ov,v0-ov,h1-1),P(u1+ov,v1+ov,h1-1),P(um,v1+ov,h1+rh)],RD);
      for(let v=v0+.05;v<v1;v+=.07){BL(g,P(u0,v,h1),P(um-.01,v,h1+rh-1),SH(RL,-18));BL(g,P(um+.01,v,h1+rh-1),P(u1,v,h1),SH(RD,-14));}
      BL(g,P(um,v0-ov,h1+rh),P(um,v1+ov,h1+rh),SH(RL,40));
      BL(g,P(u0-ov,v1+ov,h1-1),P(um,v1+ov,h1+rh),SH(RL,26));BL(g,P(um,v1+ov,h1+rh),P(u1+ov,v1+ov,h1-1),SH(RD,20));
      // 屋脊通風器
      for(let v=v0+.3;v<v1-.2;v+=.5)boxZ(g,um-.025,v,.05,.08,h1+rh-1,2,'#8f9598','#7a8084','#5f6569');
    });
    // 筒拱車庫（門在 +v 面、拱軸沿 u；東端 +u 面為半圓山牆）
    const hallArch=(S,u0,v0,du,dv,o,d)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,h1=o.h1||16,rh=o.rh||9,C=CON;
      boxZ(g,u0,v0,du,dv,0,h1,null,C.l,C.r);
      faceL(g,v1,u0,u1,0,1,SH(C.l,-40));faceR(g,u1,v0,v1,0,1,SH(C.r,-30));
      const Nn=14,zz=i=>h1+rh*Math.sin(Math.PI*i/Nn),TN=['#5f6a70','#6b767c','#78838a','#859096','#929da2','#9eaaae','#a9b4b8','#b3bdc1','#bcc5c9','#c4ccd0','#cad2d5','#cfd6d9','#d4dadd','#d8dee0'];
      // 端牆（+u 面）半圓
      const pts=[P(u1,v1,h1)];for(let i=Nn;i>=0;i--)pts.push(P(u1,v0+dv*i/Nn,zz(i)));fp(g,pts,C.r);
      const lc=P(u1,v0+dv/2,h1);for(let r=0;r<7;r++){}
      recR(g,u1,v0,v1,Math.floor(nR(u1,v0,v1)/2)-5,Math.floor(nR(u1,v0,v1)/2)+5,h1,h1+rh-3,'#3c586d');
      for(let i=0;i<Nn;i++){const va=v0+dv*i/Nn,vb=v0+dv*(i+1)/Nn;fp(g,[P(u0-.02,va,zz(i)),P(u1+.02,va,zz(i)),P(u1+.02,vb,zz(i+1)),P(u0-.02,vb,zz(i+1))],TN[i]);}
      for(let u=u0+.06;u<u1;u+=.09){for(let i=0;i<Nn;i++){const va=v0+dv*i/Nn,vb=v0+dv*(i+1)/Nn;BL(g,P(u,va,zz(i)),P(u,vb,zz(i+1)),SH(TN[i],-14));}}
      fp(g,[P(u1+.02,v1,h1),P(u1+.02,v1,h1+1),P(u0-.02,v1,h1+1),P(u0-.02,v1,h1)],'#e9e5dc');
      faceL(g,v1,u0,u1,h1-3,h1-1,RED);faceR(g,u1,v0,v1,h1-3,h1-1,SH(RED,-44));
      const N=nL(v1,u0,u1),nb=o.nb,bw=N/nb,dw=o.dw||Math.max(6,Math.floor(bw)-3);
      for(let i=0;i<nb;i++){const i0=Math.round(bw*i+(bw-dw)/2);doorL(g,n,v1,u0,u1,i0,dw,h1-6,o.open&&o.open[i]?1:0);}
      winsR(g,n,u1,v0,v1,4,10,2,4,'#3f5a70',6160,{frame:'#e9e5dc',lit:.5});
      // 天窗帶
    });
    // 指揮大樓：玻璃＋紅磚；o.gl＝+v 面玻璃帷幕區間 [a,b]（比例）；o.pad＝屋頂停機坪；o.ant＝屋頂天線
    const cmdB=(S,u0,v0,du,dv,o,d)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,fl=o.fl,fh=o.fh||9,Ht=fl*fh+4,C=o.con?CON:BRK;
      boxZ(g,u0,v0,du,dv,0,Ht,'#9da1a3',C.l,C.r);
      if(!o.con){courseL(g,v1,u0,u1,1,Ht-1,C.j,3);courseR(g,u1,v0,v1,1,Ht-1,C.jr,3);}
      faceL(g,v1,u0,u1,0,1,SH(C.l,-40));faceR(g,u1,v0,v1,0,1,SH(C.r,-30));
      const N=nL(v1,u0,u1),ga=Math.round(N*o.gl[0]),gb=Math.round(N*o.gl[1]);
      const curtain=(face,a,b)=>{const rec=face==='L'?(i0,i1,za,zb,c)=>recL(g,v1,u0,u1,i0,i1,za,zb,c):(i0,i1,za,zb,c)=>recR(g,u1,v0,v1,i0,i1,za,zb,c);
        const recn=face==='L'?(i0,i1,za,zb,c)=>recL(n,v1,u0,u1,i0,i1,za,zb,c):(i0,i1,za,zb,c)=>recR(n,u1,v0,v1,i0,i1,za,zb,c);
        const G=face==='L'?'#4a7090':'#3b5a73';rec(a,b,2,Ht-3,G);
        for(let f=0;f<fl;f++){const z=2+f*fh;rec(a,b,z+fh-2,z+fh-1,face==='L'?'#86a3b7':'#6a8599');rec(a,b,z+fh-3,z+fh-2,face==='L'?'#6a8aa2':'#557085');
          for(let i=a;i<b;i++){if((i-a)%4===0)rec(i,i+1,z,z+fh-3,'#2d485d');else if(n&&hsh(6120+f,((i-a)>>2)+(face==='L'?0:40),o.seed||1)<(o.lit||.55))recn(i,i+1,z,z+fh-3,'#ffe6a8');}}
        rec(a,a+1,2,Ht-3,face==='L'?'#8fb0c6':'#6d8ca2');};
      if(gb>ga)curtain('L',ga,gb);
      const M=nR(u1,v0,v1);if(o.glr)curtain('R',Math.round(M*o.glr[0]),Math.round(M*o.glr[1]));
      const punchL=(a,b,f)=>{if(b-a<4)return;const z=2+f*fh+2;const w=2,gap=2,cnt=Math.floor((b-a-gap)/(w+gap)),pad=Math.floor((b-a-cnt*(w+gap)+gap)/2);
        for(let k=0;k<cnt;k++){const i0=a+pad+k*(w+gap);recL(g,v1,u0,u1,i0,i0+w,z,z+4,'#3f5c72');recL(g,v1,u0,u1,i0,i0+w,z+3,z+4,'#6d8ea5');recL(g,v1,u0,u1,i0-1,i0+w+1,z-1,z,'#ece8df');if(n&&hsh(6130+f,k,a)<.5)recL(n,v1,u0,u1,i0,i0+w,z,z+4,'#ffe3a0');}};
      const punchR=(a,b,f)=>{if(b-a<4)return;const z=2+f*fh+2;const w=2,gap=2,cnt=Math.floor((b-a-gap)/(w+gap)),pad=Math.floor((b-a-cnt*(w+gap)+gap)/2);
        for(let k=0;k<cnt;k++){const i0=a+pad+k*(w+gap);recR(g,u1,v0,v1,i0,i0+w,z,z+4,'#34495a');recR(g,u1,v0,v1,i0-1,i0+w+1,z-1,z,'#cfcabf');if(n&&hsh(6140+f,k,a)<.45)recR(n,u1,v0,v1,i0,i0+w,z,z+4,'#f3d68e');}};
      for(let f=o.lobby?1:0;f<fl;f++){punchL(0,ga,f);punchL(gb,N,f);}
      const ra=o.glr?Math.round(M*o.glr[0]):M,rb=o.glr?Math.round(M*o.glr[1]):M;
      for(let f=0;f<fl;f++){if(f===0&&o.doorR!=null)continue;punchR(0,ra,f);punchR(rb,M,f);}
      if(!o.con)for(let f=1;f<fl;f++){recL(g,v1,u0,u1,0,ga,2+f*fh,2+f*fh+1,SH(C.l,-24));recL(g,v1,u0,u1,gb,N,2+f*fh,2+f*fh+1,SH(C.l,-24));}
      faceL(g,v1,u0,u1,Ht-2,Ht,'#efebe2');faceR(g,u1,v0,v1,Ht-2,Ht,'#c9c4ba');
      roofFlat(g,u0,v0,du,dv,Ht);
      // 大門（+v 或 +u 面）
      const entL=(dc)=>{recL(g,v1,u0,u1,dc-5,dc+5,0,8,'#2b3f50');recL(g,v1,u0,u1,dc-4,dc+4,0,7,'#5d86a2');recL(g,v1,u0,u1,dc,dc+1,0,7,'#2b3f50');recL(g,v1,u0,u1,dc-4,dc+4,6,7,'#86a8bf');
        if(n)recL(n,v1,u0,u1,dc-4,dc+4,0,6,'#ffe7b0');
        const a=u0+(dc-7)/32,b=u0+(dc+7)/32;for(const t of[a+.01,b-.025])boxZ(g,t,v1+.095,.015,.015,0,9,'#d5d8da','#c9cdd0','#8f959a');boxZ(g,a,v1,b-a,.12,9,2,'#f2efe8','#e0dcd2','#b9b4aa');
        if(n){const q=P((a+b)/2,v1+.12,9);RC(n,q[0]-3,q[1]-1,6,1,'#fff0c0');}
        recL(g,v1,u0,u1,dc-3,dc+3,13,18,'#f2efe8');recL(g,v1,u0,u1,dc-2,dc+2,14,17,RED);recL(g,v1,u0,u1,dc-1,dc+1,13,18,RED);};
      const entR=(dc)=>{recR(g,u1,v0,v1,dc-5,dc+5,0,8,'#23364a');recR(g,u1,v0,v1,dc-4,dc+4,0,7,'#46708e');recR(g,u1,v0,v1,dc,dc+1,0,7,'#23364a');
        if(n)recR(n,u1,v0,v1,dc-4,dc+4,0,6,'#ffe7b0');
        const b=v1-(dc-7)/32,a=v1-(dc+7)/32;for(const t of[a+.01,b-.025])boxZ(g,u1+.095,t,.015,.015,0,9,'#d5d8da','#c9cdd0','#8f959a');boxZ(g,u1,a,.12,b-a,9,2,'#f2efe8','#e0dcd2','#b9b4aa');
        if(n){const q=P(u1+.12,(a+b)/2,9);RC(n,q[0]-3,q[1]-1,6,1,'#fff0c0');}
        recR(g,u1,v0,v1,dc-3,dc+3,13,18,'#e2dfd8');recR(g,u1,v0,v1,dc-2,dc+2,14,17,SH(RED,-20));recR(g,u1,v0,v1,dc-1,dc+1,13,18,SH(RED,-20));};
      if(o.door!=null)entL(Math.round(N*o.door));
      if(o.doorR!=null)entR(Math.round(M*o.doorR));
      for(const [a,b,w,h] of (o.hvac||[]))HV(g,u0+a,v0+b,w||.14,h||.1,Ht);
      if(o.core){const[a,b,w,h]=o.core;boxZ(g,u0+a,v0+b,w,h,Ht,7,'#a3a7a9',C.l,C.r);faceL(g,v0+b+h,u0+a,u0+a+w,Ht+5,Ht+7,'#efebe2');faceR(g,u0+a+w,v0+b,v0+b+h,Ht+5,Ht+7,'#c9c4ba');
        recL(g,v0+b+h,u0+a,u0+a+w,2,5,Ht,Ht+5,'#5a6770');}
      if(o.pad){const [a,b,s]=o.pad,zp=Ht+3;
        for(const [x,y] of [[a+.03,b+.03],[a+s-.05,b+.03],[a+.03,b+s-.05],[a+s-.05,b+s-.05]])boxZ(g,u0+x,v0+y,.02,.02,Ht,3,'#6d7478','#7c8387','#5a6064');
        boxZ(g,u0+a,v0+b,s,s,zp,1,'#5f676b','#8a9195','#6b7276');
        const c=P(u0+a+s/2,v0+b+s/2,zp+1),R=Math.round(s*32*.62);ell(g,c[0],c[1],R,R>>1,'#e7c64a');ell(g,c[0],c[1],R-1,(R>>1)-1,'#5f676b');
        RC(g,c[0]-3,c[1]-2,1,5,'#f1efe8');RC(g,c[0]+2,c[1]-2,1,5,'#f1efe8');RC(g,c[0]-2,c[1],4,1,'#f1efe8');
        for(let i=0;i<6;i++){const t=(i+.5)/6;for(const q of [P(u0+a+s*t,v0+b,zp+1),P(u0+a+s,v0+b+s*t,zp+1),P(u0+a+s*t,v0+b+s,zp+1),P(u0+a,v0+b+s*t,zp+1)]){RC(g,q[0],q[1]-1,1,1,'#a8d86a');if(n)RC(n,q[0],q[1]-1,1,1,'#b8ff7a');}}
        BL(g,P(u0+a,v0+b+s,zp+2),P(u0+a+s,v0+b+s,zp+2),'#c5cace');BL(g,P(u0+a+s,v0+b,zp+2),P(u0+a+s,v0+b+s,zp+2),'#9aa0a4');}
    });
    // 屋頂通訊天線（格構）
    const antenna=(S,u,v,z,h,d)=>S.t(d,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);
      for(let i=0;i<h;i++){RC(g,x-1+(i%4<2?0:0),y-i,1,1,'#8e9599');RC(g,x+1,y-i,1,1,'#6c7377');if(i%4===0)RC(g,x-1,y-i,3,1,'#a9b0b4');if(i%4===2)RC(g,x,y-i,1,1,'#b7bdc1');}
      RC(g,x-3,y-h+6,2,3,'#d7dbde');RC(g,x+2,y-h+10,2,3,'#d7dbde');RC(g,x,y-h-3,1,3,'#8e9599');
      RC(g,x,y-h-4,1,1,'#d23a2e');if(n)RC(n,x,y-h-4,1,1,'#ff5a48');});
    // 訓練塔 A：清水混凝土、每層開口＋側陽台、頂部懸臂吊架
    const drillA=(S,u0,v0,s,fl,d)=>S.o(d,(g,n)=>{const fh=11,Ht=fl*fh+3,u1=u0+s,v1=v0+s;
      boxZ(g,u0,v0,s,s,0,Ht,'#a9a497','#dcd6c8','#b0a999');
      const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
      for(let f=0;f<fl;f++){const z=f*fh;faceL(g,v1,u0,u1,z+fh-1,z+fh,'#c9c2b2');faceR(g,u1,v0,v1,z+fh-1,z+fh,'#988f80');
        recL(g,v1,u0,u1,2,5,z+2,z+8,'#2c2e31');recL(g,v1,u0,u1,N-5,N-2,z+2,z+8,'#2c2e31');recL(g,v1,u0,u1,2,5,z+2,z+3,'#55585c');
        recR(g,u1,v0,v1,Math.floor(M/2)-2,Math.floor(M/2)+2,z+2,z+9,'#232528');
        if(f>0){boxZ(g,u1,v0+s*.28,.07,s*.44,z,1,'#c3bcae','#a9a293','#8a8375');
          for(let t=0;t<=4;t++){const q=P(u1+.07,v0+s*(.28+.11*t),z+1);RC(g,q[0],q[1]-3,1,3,'#9ca1a4');}
          BL(g,P(u1+.07,v0+s*.28,z+4),P(u1+.07,v0+s*.72,z+4),'#c6cbce');}}
      recL(g,v1,u0,u1,0,N,Ht-5,Ht-3,RED);recR(g,u1,v0,v1,0,M,Ht-5,Ht-3,SH(RED,-50));
      faceL(g,v1,u0,u1,Ht-1,Ht,'#efebe2');faceR(g,u1,v0,v1,Ht-1,Ht,'#cfc9bb');
      flat(g,u0+.03,v0+.03,s-.06,s-.06,'#8d9092',Ht);
      const a=P(u0+s*.5,v1,Ht),b=P(u0+s*.5,v1+.16,Ht+5);BL(g,[a[0],a[1]-5],b,'#5f666a');BL(g,[a[0],a[1]],[a[0],a[1]-6],'#5f666a');
      BL(g,[b[0],b[1]+1],[b[0],b[1]+20],'#d9c9a0');
      const lt=P(u1,v1,Ht+1);RC(g,lt[0]-1,lt[1]-2,2,2,'#d23a2e');if(n)RC(n,lt[0]-1,lt[1]-2,2,2,'#ff5a48');
    });
    // 訓練塔 B：紅色鋼構（樓梯核＋開放樓層＋交叉斜撐）
    const drillB=(S,u0,v0,s,fl,d)=>S.o(d,(g,n)=>{const fh=12,Ht=fl*fh,u1=u0+s,v1=v0+s,uc=u0+s*.45,R1='#c9392d',R2='#8e2820';
      boxZ(g,u0,v0,uc-u0,s,0,Ht+6,'#a7a39a','#d8d3c7','#aca698');
      const N=nL(v1,u0,uc);for(let f=0;f<fl;f++){recL(g,v1,u0,uc,2,N-2,f*fh+3,f*fh+9,'#2e3134');recL(g,v1,u0,uc,2,N-2,f*fh+3,f*fh+4,'#56595d');}
      faceL(g,v1,u0,uc,Ht+4,Ht+6,'#efebe2');
      for(let f=1;f<=fl;f++){const z=f*fh;boxZ(g,uc,v0,u1-uc,s,z-2,2,'#8f8d88','#b9b5ab','#8a867d');}
      for(let f=0;f<fl;f++){const z=f*fh;
        BL(g,P(uc,v1,z),P(u1,v1,z+fh-2),R2);BL(g,P(u1,v1,z),P(uc,v1,z+fh-2),R2);
        BL(g,P(u1,v1,z),P(u1,v0,z+fh-2),SH(R2,-20));BL(g,P(u1,v0,z),P(u1,v1,z+fh-2),SH(R2,-20));
        BL(g,P(uc+.02,v1,z+fh+2),P(u1,v1,z+fh+2),'#e8e4dc');BL(g,P(u1,v1,z+fh+2),P(u1,v0,z+fh+2),'#c2beb5');}
      for(const [u,v,c] of [[u1,v0,R2],[u1,v1,R1]]){const a=P(u,v,0),b=P(u,v,Ht+2);RC(g,a[0]-1,b[1],2,a[1]-b[1],c);RC(g,a[0]-1,b[1],1,a[1]-b[1],SH(c,24));}
      flat(g,u0+.02,v0+.02,uc-u0-.04,s-.04,'#8d9092',Ht+6);
      const lt=P(u0,v1,Ht+7);RC(g,lt[0],lt[1]-2,2,2,'#d23a2e');if(n)RC(n,lt[0],lt[1]-2,2,2,'#ff5a48');
      const hk=P(u1,v1-.05,Ht+2);BL(g,[hk[0],hk[1]],[hk[0]+5,hk[1]-3],'#5f666a');BL(g,[hk[0]+5,hk[1]-2],[hk[0]+5,hk[1]+16],'#d9c9a0');
    });
    // 訓練塔 C：磚造水帶塔（高窄拱窗、晾水帶百葉層、四坡攢尖頂）
    const drillC=(S,u0,v0,s,h,d)=>S.o(d,(g,n)=>{const u1=u0+s,v1=v0+s,C=BRK;
      boxZ(g,u0,v0,s,s,0,h,null,C.l,C.r);courseL(g,v1,u0,u1,1,h-1,C.j,3);courseR(g,u1,v0,v1,1,h-1,C.jr,3);
      const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
      for(const z of [16,34,52]){recL(g,v1,u0,u1,0,N,z,z+2,'#e6e1d6');recR(g,u1,v0,v1,0,M,z,z+2,'#bdb7aa');}
      for(const [za,zb] of [[20,31],[38,49]]){recL(g,v1,u0,u1,(N>>1)-2,(N>>1)+2,za,zb,'#34495a');recL(g,v1,u0,u1,(N>>1)-1,(N>>1)+1,zb,zb+1,'#34495a');recR(g,u1,v0,v1,(M>>1)-2,(M>>1)+2,za,zb,'#2b3b48');recR(g,u1,v0,v1,(M>>1)-1,(M>>1)+1,zb,zb+1,'#2b3b48');
        if(n){recL(n,v1,u0,u1,(N>>1)-2,(N>>1)+2,za,zb,'rgba(255,220,150,.7)');}}
      recL(g,v1,u0,u1,(N>>1)-3,(N>>1)+3,0,10,'#e6e1d6');recL(g,v1,u0,u1,(N>>1)-2,(N>>1)+2,0,9,'#5b3c2c');
      // 百葉層
      for(let i=2;i<N-2;i+=2)recL(g,v1,u0,u1,i,i+1,h-10,h-2,'#3a3f44');for(let i=2;i<M-2;i+=2)recR(g,u1,v0,v1,i,i+1,h-10,h-2,'#2c3034');
      recL(g,v1,u0,u1,0,N,h-2,h,'#ece7dc');recR(g,u1,v0,v1,0,M,h-2,h,'#c6c0b3');
      const e=.035,um=u0+s/2,vm=v0+s/2,ap=P(um,vm,h+15);
      fp(g,[P(u0-e,v1+e,h),P(u1+e,v1+e,h),ap],'#5a6168');fp(g,[P(u1+e,v0-e,h),P(u1+e,v1+e,h),ap],'#3e444a');
      fp(g,[P(u0-e,v0-e,h),P(u0-e,v1+e,h),ap],'#666e75');
      BL(g,P(u1+e,v1+e,h),ap,'#7b848b');RC(g,ap[0],ap[1]-4,1,4,'#c8a64a');RC(g,ap[0]-1,ap[1]-2,3,1,'#c8a64a');
      // 時鐘
      const ck=P(u0+s*.5,v1,h-15);ell(g,ck[0],ck[1],2,2,'#f2efe8');RC(g,ck[0],ck[1]-1,1,2,'#2b2d31');if(n)ell(n,ck[0],ck[1],2,2,'rgba(255,240,200,.8)');
    });
    // 火場模擬屋（燒燬痕跡）
    const burnHouse=(S,u0,v0,du,dv,d)=>S.o(d,(g)=>{const u1=u0+du,v1=v0+dv,h=13,rh=7,vm=v0+dv/2,ov=.03;
      boxZ(g,u0,v0,du,dv,0,h,null,'#a39d92','#7d776d');
      fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],'#7d776d');
      recL(g,v1,u0,u1,3,6,2,8,'#26282a');recL(g,v1,u0,u1,3,6,8,11,'#55504b');recL(g,v1,u0,u1,9,12,2,8,'#26282a');recL(g,v1,u0,u1,9,12,8,12,'#4a4541');
      const M=nR(u1,v0,v1);recR(g,u1,v0,v1,2,5,3,8,'#1f2123');recR(g,u1,v0,v1,2,5,8,12,'#3e3b38');recR(g,u1,v0,v1,M-5,M-2,0,8,'#1f2123');recR(g,u1,v0,v1,M-5,M-2,8,13,'#3e3b38');
      fp(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],'#4d5054');
      fp(g,[P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),P(u1+ov,v1+ov,h-1),P(u0-ov,v1+ov,h-1)],'#696d72');
      BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),'#8a8f94');BL(g,P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),'#5d6166');BL(g,P(u1+ov,vm,h+rh),P(u1+ov,v1+ov,h-1),'#7a7f84');
      boxZ(g,u0+du*.3,vm-.03,.06,.06,h+2,7,'#5d5852','#8a847c','#5d5852');});
    // 水帶晾架
    const hoseRack=(S,u,v,len,d)=>S.t(d,(g)=>{const a=P(u,v),b=P(u+len,v);RC(g,a[0],a[1]-12,1,12,'#6d767c');RC(g,b[0],b[1]-12,1,12,'#6d767c');BL(g,[a[0],a[1]-12],[b[0],b[1]-12],'#8e979c');
      for(let t=.1;t<.95;t+=.16){const p=lerp(a,b,t);RC(g,p[0],p[1]-11,1,8,t<.5?'#e8e4d6':'#d8c89a');}});
    // 直升機（機頭朝 +u）
    const heli=(S,u,v,d)=>S.o(d,(g,n)=>{const W0='#f1efe8',Wl='#e6e2d8',Wr='#b3aea4';
      for(const dv of [.015,.115]){BL(g,P(u-.1,v+dv,0),P(u+.16,v+dv,0),'#3a3d40');}
      for(const [du,dv] of [[-.05,.015],[.09,.015],[-.05,.115],[.09,.115]]){const p=P(u+du,v+dv,0);RC(g,p[0],p[1]-2,1,2,'#55595d');}
      boxZ(g,u-.1,v+.01,.2,.12,2,6,W0,Wl,Wr);
      fp(g,[P(u+.1,v+.01,8),P(u+.1,v+.13,8),P(u+.17,v+.13,4),P(u+.17,v+.01,4)],'#5d86a2');
      fp(g,[P(u+.1,v+.13,2),P(u+.17,v+.13,4),P(u+.1,v+.13,8)],'#4a7090');
      faceR(g,u+.17,v+.01,v+.13,2,4,Wr);
      faceL(g,v+.13,u-.1,u+.1,4,5,RED);faceL(g,v+.13,u-.08,u+.04,5,7,'#3d5d77');
      boxZ(g,u-.04,v+.03,.1,.08,8,2,'#d9d6ce','#cfcbc2','#a29d93');
      const t0=P(u-.1,v+.07,6),t1=P(u-.38,v+.07,8);BL(g,t0,t1,'#e6e2d8');BL(g,[t0[0],t0[1]+1],[t1[0],t1[1]+1],'#b3aea4');
      RC(g,t1[0]-1,t1[1]-5,2,6,RED);RC(g,t1[0]-2,t1[1]-2,1,3,'#55595d');
      const hb=P(u+.01,v+.07,11);RC(g,hb[0]-1,hb[1]-1,2,2,'#3a3d40');
      BL(g,P(u-.3,v+.07,11),P(u+.32,v+.07,11),'#44484c');BL(g,P(u+.01,v-.24,11),P(u+.01,v+.38,11),'#44484c');
      const bl=P(u,v+.07,1);RC(g,bl[0],bl[1]-1,1,1,'#ff3b2f');if(n)RC(n,bl[0],bl[1]-1,1,1,'#ff5a48');});
    // 風向袋
    const windsock=(S,u,v,d)=>S.t(d,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-14,1,14,'#8e979c');RC(g,x+1,y-14,2,2,'#f07a2a');RC(g,x+3,y-13,2,2,'#f2efe8');RC(g,x+5,y-13,2,2,'#f07a2a');});
    // 消防水池（下沉水面＋混凝土池緣＋抽水口）
    const pond=(g,u0,v0,du,dv)=>{flat(g,u0,v0,du,dv,'#bdb9ae');const e=.04;flat(g,u0+e,v0+e,du-2*e,dv-2*e,'#2e5f90');
      flat(g,u0+e,v0+e,du-2*e,.035,'#8f8b82');flat(g,u0+e,v0+e,.035,dv-2*e,'#a39f96');
      for(let i=0;i<9;i++){const a=u0+.12+hsh(6190,i,1)*(du-.34),b=v0+.12+hsh(6190,i,2)*(dv-.24);BL(g,P(a,b),P(a+.08,b),i%2?'#4d86bf':'#6aa0d4');}
      lineU(g,v0+dv,u0,u0+du,'#e2ded4');lineV(g,u0+du,v0,v0+dv,'#d2cec4');};
    const cmdCar=(S,u,v,d)=>S.o(d!=null?d:u+v+.1,(g,n)=>{boxZ(g,u,v,.17,.09,1,4,REDT,RED,REDD);boxZ(g,u+.02,v+.005,.1,.08,5,2,'#e9e6de','#5d86a2','#3d5d77');faceL(g,v+.09,u,u+.17,2,3,'#f2efe6');
      const lb=P(u+.07,v+.045,7);RC(g,lb[0]-1,lb[1]-1,3,1,'#ff3b2f');if(n)RC(n,lb[0]-1,lb[1]-1,3,1,'#ff5a48');for(const t of[.04,.13]){const p=P(u+t,v+.09,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1d20');}});
    const hoseLine=(g,pts)=>{for(let i=0;i+1<pts.length;i++){BL(g,P(...pts[i]),P(...pts[i+1]),'#efe9d6');}};
    const bench=(S,u,v,d)=>S.o(d!=null?d:u+v+.02,(g)=>{boxZ(g,u,v,.1,.035,2,1,'#b08a5c','#9c774c','#7c5c38');});
    // 殉職消防員紀念鐘：石階＋石座（+v 面銅牌）＋木鐘架＋銅鐘
    const bellMemorial=(S,u,v,d)=>S.o(d!=null?d:u+v+.05,(g)=>{
      boxZ(g,u-.08,v-.08,.16,.16,0,1,'#bdb9ae','#cfcbc0','#a39f96');
      boxZ(g,u-.055,v-.055,.11,.11,1,6,'#d9d4c6','#e0dbcd','#aca698');
      recL(g,v+.055,u-.055,u+.055,1,3,3,5,'#b8893a');
      const p=P(u,v,7),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-3,y-9,1,9,'#5c4631');RC(g,x+3,y-9,1,9,'#3f3022');RC(g,x-4,y-10,9,1,'#6d543a');
      RC(g,x-1,y-8,3,1,'#c8973a');RC(g,x-2,y-7,5,3,'#a8772a');RC(g,x-2,y-7,2,3,'#d9ab4c');RC(g,x-3,y-4,7,1,'#8a6220');RC(g,x,y-3,1,1,'#5a3e14');});

    const fence=(g,a,b,gap)=>L.fenceP(g,a,b,gap),backFence=g=>{fence(g,[.05,.05],[2.95,.05]);fence(g,[.05,.05],[.05,2.95]);};
    const layouts=[
      // v0 車庫在前：紅磚兩層車庫樓（6 門；水箱車、雲梯車、救護車自 1／3／5 號門露頭）＋右端 4F 指揮大樓（玻璃帷幕＋紅磚＋屋頂天線）＋前廣場旗桿群；
      //    後院：混凝土訓練塔（6 層、側陽台、頂部吊架）＋火場模擬屋＋水帶晾架；東北角吸水訓練池（消防水池）；中段員工停車（東側柵門進出）
      (g,ng,S)=>{
        pave(g,'c',0,0,3,3,6101);
        pave(g,'a',.08,.08,1.44,1.4,6102);
        pave(g,'a',1.52,.74,1.4,.58,6103);
        pave(g,'q',.1,2.2,2.02,.72,6104);
        pave(g,'p',2.14,2.26,.78,.66,6105);
        pave(g,'g',2.18,2.82,.72,.1,6106);pave(g,'g',2.82,2.3,.1,.52,6108);pave(g,'g',1.52,.08,.6,.62,6109);
        pond(g,2.16,.1,.76,.58);
        const u0=.16,u1=2.02,nb=6;
        for(let i=0;i<nb;i++){const uc=u0+(u1-u0)*(i+.5)/nb;dashV(g,uc,2.24,2.76,'#e0b93a',.09,.06);}
        pave(g,'g',.07,2.22,.13,.71,6107);                 // 西角旗桿草帶（沿西北圍籬）
        flat(g,.22,2.8,1.88,.1,'#b8453a');for(let t=.26;t<2.06;t+=.1)BL(g,P(t,2.81),P(t+.06,2.89),'#e7ddd0');
        lineU(g,2.2,.22,2.1,'#e6e2d6');
        for(let t=.4;t<1.5;t+=.3)lineV(g,t,.12,1.44,'#85837e');
        stallsU(g,1.56,.76,1.1,6,.22);dashU(g,1.05,1.56,2.9,'#e8e2c8');
        shadow(g,[['b',.16,1.52,1.86,.68,26],['b',2.18,1.3,.68,.9,40],['b',.3,.24,.34,.34,74],['b',.84,.24,.44,.36,16]]);
        backFence(g);S.t(9,(g)=>fence(g,[2.95,.05],[2.95,2.22],[.34,.58]));
        S.t(.2,(g)=>{for(let i=0;i<=6;i++){const p=P(2.16+.76*i/6,.68),q=P(2.92,.1+.58*i/6);RC(g,p[0],p[1]-6,1,6,'#9aa1a6');RC(g,q[0],q[1]-6,1,6,'#9aa1a6');}
          BL(g,P(2.16,.68,5),P(2.92,.68,5),'#c4c9cc');BL(g,P(2.92,.1,5),P(2.92,.68,5),'#a8adb0');});
        S.o(.9,(g)=>{const p=P(2.2,.4);RC(g,p[0]-1,p[1]-6,3,6,'#c9362b');RC(g,p[0]-2,p[1]-4,5,1,'#e0584a');RC(g,p[0]-1,p[1]-7,3,1,'#e8e4dc');});
        drillA(S,.3,.24,.34,6,1.0);
        burnHouse(S,.84,.24,.44,.36,1.2);
        hoseRack(S,.74,.9,.44,1.7);
        S.t(1.25,(g)=>{cone(g,1.26,.7);cone(g,1.36,.9);cone(g,1.46,1.1);});
        car(S,1.62,.8,false,CARC[0],2.5);car(S,1.8,.8,false,CARC[1],2.7);car(S,2.16,.8,false,CARC[3],3.1);car(S,2.52,.8,false,CARC[4],3.4);
        mast(S,1.54,.72,32,2.3);mast(S,.12,1.44,32,1.6);
        hallV(S,.16,1.52,1.86,.68,{h1:15,h2:9,nb:6,brick:1,open:{1:1,3:1,5:1},sign:[25,37],hvac:[[.3,.2],[1.3,.3]]},2.6);
        cmdB(S,2.18,1.3,.68,.9,{fl:4,fh:9,gl:[.3,.72],door:.5,hvac:[[.1,.12],[.4,.5,.12,.12]],seed:3},3.4);
        antenna(S,2.3,1.42,40,22,3.45);
        const bw=1.86/6;
        engine(S,.16+bw*1.5-.065,2.06,'v','p',4.6);
        engine(S,.16+bw*3.5-.065,2.04,'v','l',4.8);
        engine(S,.16+bw*5.5-.065,2.1,'v','a',5.0);
        // 旗桿群：西角沿圍籬一列三根（主桿在最西角、上方透明；兩根陪襯桿往東北排）
        const fa=flagpoles(S,[[.12,2.26,18,1],[.12,2.54,21,0],[.12,2.86,12,0]],2,2.95);
        bellMemorial(S,2.58,2.66,5.2);
        tree(S,2.24,2.86,1,0,5.1);tree(S,2.88,2.4,.9,2,5.3);bush(S,2.4,2.88,3);bush(S,2.88,2.6,3);bench(S,2.3,2.5);
        man(S,2.34,2.4,0);man(S,.42,2.64,1);man(S,.56,2.7,1);man(S,1.3,2.5,1);man(S,1.42,2.56,0);
        hydrant(S,.24,2.25);lamp(S,2.12,2.92,18);lamp(S,1.09,2.93,18);
        return{flagAt:fa};
      },
      // v1 車庫在側：車庫樓沿 v 軸、6 扇門朝東南（+u 面）、紅色雙坡金屬屋頂；左前 3F 指揮大樓（紅磚＋玻璃大廳＋天線）＋旗桿廣場；
      //    後方地面直升機坪（停一架救援直升機、風向袋）＋紅色鋼構訓練塔；中段員工停車
      (g,ng,S)=>{
        pave(g,'c',0,0,3,3,6111);
        pave(g,'q',2.24,.1,.68,2.82,6112);
        pave(g,'p',.1,2.5,1.5,.42,6113);
        pave(g,'a',.1,1.14,1.46,.56,6114);
        pave(g,'g',.1,.1,1.12,1.0,6115);
        flat(g,.16,.14,1.0,.92,'#9c9a93');flat(g,.2,.18,.92,.84,'#b5b2a9');
        { const c=P(.66,.6);const R=24;ell(g,c[0],c[1],R,R>>1,'#e7c64a');ell(g,c[0],c[1],R-2,(R>>1)-1,'#b5b2a9');
          const hA=[[.56,.46],[.56,.74]],hB=[[.76,.46],[.76,.74]];BL(g,P(.56,.46),P(.56,.74),'#f4f2ec');BL(g,P(.57,.46),P(.57,.74),'#f4f2ec');BL(g,P(.76,.46),P(.76,.74),'#f4f2ec');BL(g,P(.77,.46),P(.77,.74),'#f4f2ec');BL(g,P(.56,.6),P(.77,.6),'#f4f2ec');}
        for(let i=0;i<8;i++){const t=(i+.5)/8;for(const q of [P(.16+1.0*t,.14),P(1.16,.14+.92*t),P(.16+1.0*t,1.06),P(.16,.14+.92*t)]){RC(g,q[0],q[1]-1,1,1,'#e3d27a');RC(ng,q[0],q[1]-1,1,1,'#b8ff7a');}}
        for(let i=0;i<6;i++){const v=.34+i*.33;dashU(g,v,2.26,2.84,'#e0b93a',.09,.06);}
        flat(g,2.8,.14,.1,2.3,'#b8453a');for(let t=.18;t<2.42;t+=.1)BL(g,P(2.81,t),P(2.89,t+.06),'#e7ddd0');
        stallsV(g,.14,1.18,.5,2,.26);stallsU(g,.44,1.18,1.08,6,.24);
        shadow(g,[['b',1.62,.28,.6,2.02,24],['b',.12,1.72,1.4,.76,32],['b',1.24,.14,.3,.3,80]]);
        backFence(g);
        drillB(S,1.24,.14,.3,6,1.0);
        heli(S,.66,.52,1.3);windsock(S,1.12,1.02,1.5);
        car(S,.5,1.2,false,CARC[0],1.8);car(S,.86,1.2,false,CARC[3],2.1);car(S,1.22,1.2,false,CARC[4],2.4);
        mast(S,.14,1.12,32,1.3);
        cmdB(S,.12,1.72,1.4,.76,{fl:3,fh:9,gl:[.38,.62],door:.5,lobby:1,hvac:[[.2,.2],[.9,.3],[1.1,.14,.12,.12]],seed:5},2.9);
        antenna(S,.3,1.84,31,24,3.0);
        hallU(S,1.62,.28,.6,2.02,{h1:16,rh:9,nb:6,open:{1:1,3:1,4:1}},3.2);
        const L6=2.02/6;
        engine(S,2.18,.28+2.02-L6*1.5-.065,'u','p',4.4);
        engine(S,2.18,.28+2.02-L6*3.5-.065,'u','l',4.2);
        engine(S,2.18,.28+2.02-L6*4.5-.065,'u','r',4.0);
        hoseLine(g,[[2.5,1.95],[2.56,2.08],[2.5,2.2],[2.58,2.32],[2.52,2.44],[2.6,2.56],[2.56,2.64]]);hoseLine(g,[[2.44,1.95],[2.4,2.1],[2.46,2.24],[2.42,2.36]]);
        man(S,2.57,2.68,1,5.3);man(S,2.63,2.64,1,5.3);man(S,2.43,2.4,1,4.9);S.t(5.25,(g)=>{const p=P(2.56,2.64);RC(g,p[0]-3,p[1]-4,2,1,'#c8ced2');});
        cmdCar(S,1.8,2.56,4.5);S.t(4.4,(g)=>{cone(g,1.72,2.5);cone(g,2.06,2.5);});
        // 旗桿群：西角沿前緣一列三根（主桿在最西角、上方透明；陪襯桿往東南排到指揮大樓前）
        const fa=flagpoles(S,[[.12,2.88,12,0],[.46,2.88,21,0],[.74,2.88,19,1]],0,5.2);
        tree(S,1.44,2.86,1,1,5.4);tree(S,1.02,2.88,.9,0,5.3);bush(S,1.2,2.88,3);bush(S,.3,2.62,3);bench(S,1.2,2.6);
        man(S,.9,2.62,0);man(S,1.02,2.66,0);man(S,.9,.8,2);
        hydrant(S,2.2,2.46);lamp(S,2.2,2.9,18);lamp(S,2.9,.14,18);lamp(S,1.58,2.9,18);
        return{flagAt:fa};
      },
      // v2 現代總局：前排 8 門單層筒拱車庫＋西端磚造水帶塔（攢尖頂、時鐘）；後方 5F 指揮大樓（玻璃帷幕、屋頂直升機坪）；
      //    東側入口廣場（旗桿群、訪客車位）；西北員工停車場
      (g,ng,S)=>{
        pave(g,'c',0,0,3,3,6121);
        pave(g,'q',.4,2.22,2.26,.7,6122);
        pave(g,'p',2.34,.12,.58,1.36,6123);
        pave(g,'a',.1,.1,.86,1.4,6124);
        pave(g,'g',2.7,1.5,.22,1.42,6125);pave(g,'g',.1,2.2,.28,.72,6126);
        const u0=.44,u1=2.64,nb=8;
        for(let i=0;i<nb;i++){const uc=u0+(u1-u0)*(i+.5)/nb;dashV(g,uc,2.24,2.76,'#e0b93a',.09,.06);}
        flat(g,.42,2.8,2.24,.1,'#b8453a');for(let t=.46;t<2.62;t+=.1)BL(g,P(t,2.81),P(t+.06,2.89),'#e7ddd0');
        stallsV(g,.14,.14,1.2,6,.26);stallsV(g,.62,.14,1.2,6,.26);
        pave(g,'g',2.72,.08,.2,.76,6127);                  // 東角旗桿草坪
        shadow(g,[['b',1.0,.24,1.3,.98,48],['b',.44,1.56,2.2,.66,24],['b',.1,1.62,.3,.3,86]]);
        backFence(g);
        car(S,.2,.16,true,CARC[1],.6);car(S,.2,.56,true,CARC[0],1.0);car(S,.2,.76,true,CARC[3],1.2);car(S,.66,.36,true,CARC[4],1.2);car(S,.66,.96,true,CARC[5],1.8);mast(S,.52,.12,32,.9);
        cmdB(S,1.0,.24,1.3,.98,{fl:5,fh:9,gl:[.12,.88],glr:[.1,.9],doorR:.5,hvac:[[.1,.1]],core:[.12,.62,.2,.26],pad:[.5,.18,.62],seed:7,lit:.42},2.2);
        antenna(S,1.18,.4,49,16,2.25);
        // 旗桿群：東角沿東南緣一列三根（主桿在最東角、上方透明；陪襯桿往西南排）
        const fa=flagpoles(S,[[2.88,.68,19,1],[2.88,.4,21,0],[2.88,.12,12,0]],2,3.7);
        tree(S,2.84,1.0,1,0,3.9);bush(S,2.5,1.36,3);bush(S,2.46,.18,3);bush(S,2.84,.8,2);bench(S,2.46,.66);
        man(S,2.46,.9,0);man(S,2.5,1.1,0);
        hallArch(S,.44,1.56,2.2,.66,{h1:16,rh:8,nb:8,open:{1:1,3:1,6:1}},3.0);
        drillC(S,.1,1.62,.3,64,3.1);
        const b8=2.2/8;
        engine(S,.44+b8*1.5-.065,2.1,'v','p',4.4);
        engine(S,.44+b8*3.5-.065,2.08,'v','l',4.6);
        engine(S,.44+b8*6.5-.065,2.1,'v','t',5.0);
        tree(S,2.8,1.9,1,1,4.8);tree(S,2.82,2.5,.9,0,5.4);bush(S,.22,2.5,3);tree(S,.2,2.8,.9,2,5.1);
        man(S,1.2,2.4,1);man(S,1.1,2.46,1);
        hydrant(S,2.7,2.28);lamp(S,.4,2.92,18);lamp(S,2.7,2.92,18);lamp(S,2.72,1.48,18);
        return{flagAt:fa};
      },
    ];
    for(let v=0;v<3;v++){const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S)||{};S.run(g,ng);const[sc]=A.cv(W,H);
      const spr=K.finish(c,g,sc,nc,{fence:false});if(o.flagAt)spr.flagAt=o.flagAt;
      ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';   // 夜光只留在白天有實體的像素上（燈頭光暈不外溢到天空）
      B['61_1_'+v]=spr;}
  }catch(e){errs.push('k61 '+(e&&e.stack||e));}

  // ================= k95 森林消防瞭望塔（1×1）=================
  try{
    const o0=B['95_1_0'];const W=o0.w,H=o0.h,AX=o0.ax,AY=o0.ay;
    const K=A.iso575(W,H,AX,AY,1),L=LIB(K);
    const {P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,colsL,colsR,courseL,courseR,recL,recR,nL,nR,ell,cyl,pave,shadow,pine,bush,man}=L;
    // 塔架：o={b0,b1,z0,zt,lv,lw,col:{l,d,fl,fr,back},foot,stairs}；中心 (.5,.5)、半寬 b0（底）→ b1（頂）、從高度 z0 起算
    // 畫序（T613 退件修正）：背面兩片斜撐（最暗）→ 前面兩片斜撐（1px、比腿暗）→ 之字形樓梯（亮、2px，蓋在斜撐之上）→ 前三根腿 → 基腳
    // 每層每片只有一組 X；地面那一層不畫橫桿
    const frame=(S,o,d)=>S.t(d,(g)=>{const {b0,b1,z0=0,zt,lv,lw}=o,C=o.col,Z=i=>Math.round(zt*i/lv);
      const pt=(cu,cv,z)=>{const b=b0+(b1-b0)*z/zt;return P(.5+cu*b,.5+cv*b,z0+z);};
      const face=(A0,B0,col)=>{for(let i=0;i<lv;i++){const za=Z(i),zb=Z(i+1);if(i||z0)BL(g,pt(...A0,za),pt(...B0,za),col);
          BL(g,pt(...A0,za),pt(...B0,zb),col);BL(g,pt(...B0,za),pt(...A0,zb),col);}BL(g,pt(...A0,zt),pt(...B0,zt),col);};
      const leg=(cu,cv,c1,c2)=>{const a=pt(cu,cv,0),b=pt(cu,cv,zt);BL(g,a,b,c1);if(lw>1)BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],c2);};
      face([-1,-1],[1,-1],C.back);face([-1,-1],[-1,1],C.back);leg(-1,-1,C.back,C.back);
      face([-1,1],[1,1],C.fl);face([1,-1],[1,1],C.fr);
      if(o.stairs)o.stairs(g,pt,Z,o);
      leg(-1,1,C.l,C.d);leg(1,-1,C.l,C.d);leg(1,1,C.l,C.d);
      if(!z0)for(const [cu,cv] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const p=pt(cu,cv,0);RC(g,p[0]-1,p[1]-1,lw+2,2,o.foot||'#9d998f');}});
    // 之字形樓梯：走塔心對角面（u+v=1 ⇒ 平台在畫面上是水平線），擺在 +v 開口裡（西腳右側 → 南腳左側）；
    // 從地面左側起跑、左右交替折返；梯段是 2px 斜帶（c1 亮、c2 暗），從一個轉折平台爬到對側的下一個平台，橫跨整個開口；
    // 每層一塊水平平台（亮面＋暗邊，寬 Lw，從轉折點往外伸到腳柱）；rail＝與梯段平行的扶手（高 rh）
    const zigzag=(st)=>(g,pt,Z,o)=>{const {lv,lw}=o,Lw=st.lw||4,rh=st.rh||4;
      const xl=z=>Math.round(pt(-1,1,z)[0])+lw,xr=Math.round(pt(1,1,0)[0])-1,y=z=>Math.round(pt(-1,1,z)[1]);
      const vx=i=>i%2?xr-2:xl(Z(i))+1;   // 第 i 層轉折點（梯段 2px 帶的左欄）
      for(let i=0;i<lv;i++){const za=Z(i),zb=Z(i+1),R=i%2===0,a=[vx(i),y(za)-1],b=[vx(i+1),y(zb)];
        if(st.rail)BL(g,[a[0]+(R?0:1),a[1]-rh],[b[0]+(R?0:1),b[1]-rh],st.rail);
        BL(g,a,b,st.c1);BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],st.c2);
        if(i+1<lv){const x0=R?xr-Lw+1:xl(zb),yy=y(zb);RC(g,x0,yy,Lw,1,st.lt);RC(g,x0,yy+1,Lw,1,st.ld);
          if(st.rail){RC(g,x0,yy-rh,Lw,1,st.rail);RC(g,R?xr:x0,yy-rh+1,1,rh-1,st.rail);}}}};
    // 欄杆一段：沿陽台地板邊 A→B（uv、高 z），1px 立柱每 3px 一根（z+1..z+rh-1）、頂欄一條（z+rh）；走細線層、不描外框 ⇒ 柱間透空
    const railRun=(g,A0,B0,z,rh,cp,cr)=>{const a=P(A0[0],A0[1],z),b=P(B0[0],B0[1],z);let xa=Math.round(a[0]),xb=Math.round(b[0]),ya=a[1],yb=b[1];
      if(xa>xb){[xa,xb]=[xb,xa];[ya,yb]=[yb,ya];}const nn=xb-xa;
      for(let x=xa;x<=xb;x++){const yy=Math.round(ya+(yb-ya)*(nn?(x-xa)/nn:0));RC(g,x,yy-rh,1,1,cr);if((x-xa)%3===0||x===xb)RC(g,x,yy-rh+1,1,rh-1,cp);}};
    // 瞭望小屋：中心 (uc,vc)、半寬 s、樓板 z、牆高 hw、屋頂高 rh；四面落地窗；環繞陽台＝2px 地板（實體層）＋欄杆（細線層：後側在小屋前一層、前側在小屋後一層）
    const cab=(S,s,z,hw,rh,pal,d)=>{const uc=.5,vc=.5,u0=uc-s,u1=uc+s,v0=vc-s,v1=vc+s,e=pal.deck||.08,ua=u0-e,ub=u1+e,va=v0-e,vb=v1+e,RH=pal.railH||6;
      S.t(d-.001,(g)=>{railRun(g,[ua,va],[ub,va],z,RH,pal.railB,pal.railB);railRun(g,[ua,va],[ua,vb],z,RH,pal.railB,pal.railB);});
      S.t(d+.001,(g)=>{railRun(g,[ub,va],[ub,vb],z,RH,SH(pal.rail,-44),SH(pal.rail,-30));railRun(g,[ua,vb],[ub,vb],z,RH,pal.rail,SH(pal.rail,14));});
      return S.o(d,(g,n)=>{
      boxZ(g,ua,va,ub-ua,vb-va,z-2,2,pal.dT,pal.dL,pal.dR);
      boxZ(g,u0,v0,2*s,2*s,z,hw,null,pal.wl,pal.wr);
      const zg=z+1,zt=z+hw-1,N=nL(v1,u0,u1),M=nR(u1,v0,v1);
      recL(g,v1,u0,u1,0,N,zg,zt,'#4a6f8a');recL(g,v1,u0,u1,0,N,zt-2,zt,'#8db3cb');
      recR(g,u1,v0,v1,0,M,zg,zt,'#34526a');recR(g,u1,v0,v1,0,M,zt-2,zt,'#5f8199');
      const pn=Math.max(3,Math.round(N/3));
      // 夜：只亮窗格（窗櫺與上下框留暗），上緣一列較暗＝室內天花反光
      if(n){const isM=(i,K)=>{for(let j=0;j<=K;j+=pn)if(Math.min(j,K-1)===i)return true;return false;};
        for(let i=0;i<N;i++){if(isM(i,N))continue;recL(n,v1,u0,u1,i,i+1,zg,zt-1,'#ffd98a');recL(n,v1,u0,u1,i,i+1,zt-1,zt,'#e8b86a');}
        for(let i=0;i<M;i++){if(isM(i,M))continue;recR(n,u1,v0,v1,i,i+1,zg,zt-1,'#f3c878');recR(n,u1,v0,v1,i,i+1,zt-1,zt,'#d6a55c');}}for(let i=0;i<=N;i+=pn)recL(g,v1,u0,u1,Math.min(i,N-1),Math.min(i,N-1)+1,zg,zt,pal.mul);for(let i=0;i<=M;i+=pn)recR(g,u1,v0,v1,Math.min(i,M-1),Math.min(i,M-1)+1,zg,zt,SH(pal.mul,-40));
      recL(g,v1,u0,u1,0,N,zg-1,zg,SH(pal.wl,-22));recR(g,u1,v0,v1,0,M,zg-1,zg,SH(pal.wr,-22));recL(g,v1,u0,u1,0,N,zt,zt+1,pal.mul);recR(g,u1,v0,v1,0,M,zt,zt+1,SH(pal.mul,-40));
      // 四坡屋頂
      const ee=.07,ap=P(uc,vc,z+hw+rh),c00=P(u0-ee,v0-ee,z+hw),c10=P(u1+ee,v0-ee,z+hw),c11=P(u1+ee,v1+ee,z+hw),c01=P(u0-ee,v1+ee,z+hw);
      fp(g,[c00,c01,ap],SH(pal.rl,-10));fp(g,[c00,c10,ap],SH(pal.rr,-10));
      fp(g,[c01,c11,ap],pal.rl);fp(g,[c10,c11,ap],pal.rr);
      for(let t=.25;t<.95;t+=.25){BL(g,lerp(c01,ap,t),lerp(c11,ap,t),SH(pal.rl,-20));BL(g,lerp(c11,ap,t),lerp(c10,ap,t),SH(pal.rr,-16));}
      BL(g,c11,ap,SH(pal.rl,26));BL(g,c01,c11,SH(pal.rl,-34));BL(g,c11,c10,SH(pal.rr,-24));
      // 避雷針／天線
      RC(g,ap[0],ap[1]-(pal.rod||4),1,pal.rod||4,'#5f666a');
      if(pal.beacon){RC(g,ap[0],ap[1]-(pal.rod||4)-1,1,1,'#d23a2e');if(n)RC(n,ap[0],ap[1]-(pal.rod||4)-1,1,1,'#ff5a48');}});};
    // 工具棚（雙坡、屋脊沿 v、山牆朝 +v 有門與門燈）
    const shed=(S,u0,v0,du,dv,h,rh,pal,d)=>S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,um=u0+du/2,ov=.025;
      boxZ(g,u0,v0,du,dv,0,h,null,pal.wl,pal.wr);
      fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],pal.wl);
      if(pal.board){for(let i=1;i<nL(v1,u0,u1);i+=2)recL(g,v1,u0,u1,i,i+1,0,h,SH(pal.wl,-16));for(let i=1;i<nR(u1,v0,v1);i+=2)recR(g,u1,v0,v1,i,i+1,0,h,SH(pal.wr,-14));}
      const N=nL(v1,u0,u1),c=N>>1;recL(g,v1,u0,u1,c-1,c+2,0,6,pal.door);recL(g,v1,u0,u1,c-1,c+2,6,7,SH(pal.wl,-30));
      recR(g,u1,v0,v1,2,5,3,6,'#3d5a70');if(n)recR(n,u1,v0,v1,2,5,3,6,'#f3c878');
      const lp=P(u0+(c+.5)/32,v1,8);RC(g,lp[0],lp[1],2,1,'#f4ecc4');if(n){RC(n,lp[0],lp[1],2,1,'#ffeeb0');RC(n,lp[0]-1,lp[1]+1,4,1,'rgba(255,226,160,.45)');}
      fp(g,[P(u0-ov,v0-ov,h-1),P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),P(u0-ov,v1+ov,h-1)],pal.rl);
      fp(g,[P(um,v0-ov,h+rh),P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh)],pal.rr);
      if(pal.shingle){const r0=P(um,v0-ov,h+rh),r1=P(um,v1+ov,h+rh),e0=P(u1+ov,v0-ov,h-1),e1=P(u1+ov,v1+ov,h-1);   // 右坡木瓦：平行簷口的瓦縫
        for(const t of [.4,.75])BL(g,lerp(r0,e0,t),lerp(r1,e1,t),SH(pal.rr,-16));}
      BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(pal.rl,30));BL(g,P(u0-ov,v1+ov,h-1),P(um,v1+ov,h+rh),SH(pal.rl,20));});
    const barrel=(S,u,v,col,d)=>S.o(d!=null?d:u+v,(g)=>{const p=P(u,v);cyl(g,p[0],p[1],2,6,[SH(col,30),col,SH(col,-30),SH(col,-55)],SH(col,40),SH(col,-20));
      RC(g,p[0]-2,p[1]-4,5,1,SH(col,-45));});
    const bucketRack=(S,u,v,d)=>S.o(d!=null?d:u+v,(g)=>{const a=P(u,v),b=P(u,v+.15);BL(g,[a[0],a[1]-7],[b[0],b[1]-7],'#6d767c');RC(g,a[0],a[1]-7,1,7,'#6d767c');RC(g,b[0],b[1]-7,1,7,'#6d767c');
      for(let t=.25;t<.95;t+=.45){const q=lerp(a,b,t);RC(g,q[0]-1,q[1]-6,3,3,'#c9362b');RC(g,q[0]-1,q[1]-6,3,1,'#e0584a');}});
    const tank=(S,u,v,d)=>S.o(d!=null?d:u+v,(g)=>{const p=P(u,v);cyl(g,p[0],p[1],4,9,['#6f8f7a','#5f7f6a','#4d6b58','#3e584a'],'#7f9f8a','#4d6b58');
      RC(g,p[0]-4,p[1]-6,9,1,'#3e584a');RC(g,p[0]+3,p[1]-2,2,1,'#8e979c');});
    // 森林火災危險度告示牌（半圓色階＋指針）
    const dangerSign=(S,u,v,d)=>S.o(d!=null?d:u+v,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-4,y-5,1,5,'#6b4a2d');RC(g,x+4,y-5,1,5,'#6b4a2d');
      RC(g,x-5,y-10,11,5,'#f2efe6');const C=['#4f9a4a','#3f79c0','#e8c23a','#e8822a','#d23a2e'];for(let i=0;i<5;i++){RC(g,x-4+i*2,y-9,2,2,C[i]);}
      RC(g,x-4,y-7,9,1,'#2b2d31');RC(g,x+1,y-9,1,2,'#2b2d31');});
    const woodpile=(S,u,v,d,len=.2)=>S.o(d!=null?d:u+v,(g)=>{boxZ(g,u,v,len,.08,0,3,'#8a6440','#9a7048','#6a4a2e');const p=P(u,v+.08,0),n=Math.floor(len*32);for(let i=1;i<n;i+=2){RC(g,p[0]+i,p[1]-2+(i>>1),1,1,'#c9a071');}});   // 三層柴（原四層，T613 退件：塔腳旁過擠）
    const groundBase=(g,seed,dirt)=>{pave(g,'g',0,0,1,1,seed);pave(g,dirt||'d',.14,.14,.72,.72,seed+1);pave(g,'k',.42,.86,.18,.14,seed+2);};

    const layouts=[
      // v0 木構塔：四根原木斜腿＋每層 X 斜撐＋塔內之字木梯；木造瞭望小屋（四面窗、綠瓦四坡頂、環繞陽台）；左前木工具棚＋右側雨水桶
      (g,ng,S)=>{
        groundBase(g,9501);
        const fo={b0:.28,b1:.19,zt:56,lv:4,lw:2,col:{l:'#a5774b',d:'#6b4a2d',fl:'#6c4c2f',fr:'#583e26',back:'#45321f'},foot:'#8f8a80'};
        shadow(g,[['p',.23,.77,24],['p',.77,.77,24],['p',.77,.23,24],['b',.01,.67,.18,.28,12]],.28);
        pine(S,.9,.1,1.0,1.0);
        fo.stairs=zigzag({lw:4,c1:'#f0c88a',c2:'#d29f5f',lt:'#f6dcaa',ld:'#7a5634'});
        frame(S,fo,.9);
        cab(S,.21,56,12,9,{dT:'#9a7048',dL:'#a5774b',dR:'#6b4a2d',wl:'#b98e5c',wr:'#83603c',mul:'#efe6d2',rl:'#5b7a4f',rr:'#3f5a38',rail:'#d8b27c',railB:'#7a5634',rod:5},1.2);
        // T613 退件（v0 左前過擠）：原本塔的西腳 (.22,.78) 落在工具棚佔地裡、整根腳沒入棚頂。
        // 工具棚往左平移 2px 並縮小到 u .01–.19、v .67–.95，西腳改立在棚右側牆外；棚在塔的 −u 面之後 ⇒ 先畫棚（d=.85）再畫塔架，腳與斜撐蓋在棚上。
        // 柴堆少一層、縮短到只擋棚門下半，右端和西腳留 3px。
        shed(S,.01,.67,.18,.28,8,5,{wl:'#b0875a',wr:'#7a5836',rl:'#a09684',rr:'#787063',door:'#5a3e28',board:1,shingle:1},.85);   // 棚頂改風化灰木瓦：和棕色塔架、草地都分得開
        woodpile(S,.03,.85,1.35,.16);
        barrel(S,.8,.44,'#3f6fa8',1.4);barrel(S,.86,.56,'#3f6fa8',1.5);bucketRack(S,.44,.78,1.45);
        man(S,.6,.9,1);
      },
      // v1 鋼構塔：鍍鋅鋼格構（五層、密集斜撐）＋塔心折返鋼梯＋鋼板小屋（紅色四坡頂、天線與警示燈）；混凝土基腳；右前綠色儲物貨櫃＋儲水槽＋紅色消防桶架
      (g,ng,S)=>{
        groundBase(g,9511,'k');
        const fo={b0:.27,b1:.18,zt:62,lv:5,lw:2,col:{l:'#d3d9dc',d:'#8c9499',fl:'#98a0a5',fr:'#798186',back:'#50585d'},foot:'#b9b5ab'};
        shadow(g,[['p',.23,.77,24],['p',.77,.77,24],['p',.77,.23,24],['b',.62,.66,.3,.18,10]],.28);
        pine(S,.05,.78,1.0,.9);
        fo.stairs=zigzag({lw:3,c1:'#5f686e',c2:'#2e3438',lt:'#b3bbc0',ld:'#383e42',rail:'#f0c630',rh:3});
        frame(S,fo,.9);
        cab(S,.2,62,11,7,{dT:'#8a9297',dL:'#9ea6ab',dR:'#697176',wl:'#d9dcd6',wr:'#a4a9a3',mul:'#f2f2ee',rl:'#b8483b',rr:'#86332a',rail:'#e4e8ea',railB:'#6f777c',rod:9,beacon:1,deck:.08},1.2);
        S.t(1.25,(g)=>{const p=P(.5,.5,80);RC(g,p[0]+2,p[1]-2,3,1,'#8e979c');RC(g,p[0]+4,p[1]-4,1,2,'#8e979c');RC(g,p[0]+3,p[1]-5,3,1,'#c8ced2');});
        S.o(1.3,(g,n)=>{boxZ(g,.64,.66,.3,.16,0,8,'#5f7f5c','#6f8f6a','#4d6b4a');for(let i=1;i<nL(.82,.64,.94);i+=2)recL(g,.82,.64,.94,i,i+1,1,7,'#5a7a56');
          recR(g,.94,.66,.82,1,4,1,7,'#3d563b');const lp=P(.79,.82,8);RC(g,lp[0],lp[1],2,1,'#f4ecc4');if(n)RC(n,lp[0],lp[1],2,1,'#ffeeb0');});
        tank(S,.84,.18,1.1);   // 儲水槽上移 1px：原位 (.86,.2) 的底緣外框有 2px 越出東南斜邊
        bucketRack(S,.3,.72,1.0);
        man(S,.56,.92,0);
      },
      // v2 石砌基座塔：方錐形毛石基座（拱門、小窗、隅石）＋上段木柱架（外掛直梯）＋木造小屋（深灰四坡頂）；基座旁單坡工具棚＋木桶
      (g,ng,S)=>{
        groundBase(g,9521);
        shadow(g,[['b',.25,.25,.5,.5,30],['b',.64,.08,.28,.22,9]],.3);
        pine(S,.08,.46,.95,.5);
        // 基座（石）
        S.o(1.0,(g,n)=>{const b0=.25,b1=.29,zt=28,sL='#b7ad9b',sR='#8d8373';
          const c=(cu,cv,z)=>{const b=b0+(b1-b0)*z/zt;return[.5+cu*(.5-b),.5+cv*(.5-b)];};
          const [a0u,a0v]=c(-1,-1,0),[a1u,a1v]=c(1,1,0),[t0u,t0v]=c(-1,-1,zt),[t1u,t1v]=c(1,1,zt);
          fp(g,[P(a0u,a1v,0),P(a1u,a1v,0),P(t1u,t1v,zt),P(t0u,t1v,zt)],sL);fp(g,[P(a1u,a0v,0),P(a1u,a1v,0),P(t1u,t1v,zt),P(t1u,t0v,zt)],sR);
          fp(g,[P(t0u,t0v,zt),P(t1u,t0v,zt),P(t1u,t1v,zt),P(t0u,t1v,zt)],'#a39985');
          // 毛石紋：錯縫石塊
          for(let z=2;z<zt;z+=3){const k=(z/3)|0;const pa=P(a0u+(t0u-a0u)*z/zt,a1v+(t1v-a1v)*z/zt,z),pb=P(a1u+(t1u-a1u)*z/zt,a1v+(t1v-a1v)*z/zt,z);
            BL(g,pa,pb,'#9a907f');for(let x=Math.ceil(pa[0])+(k%2?2:4);x<pb[0]-1;x+=5){const y=Math.round(pa[1]+(x-pa[0])*.5);RC(g,x,y-2,1,2,'#9a907f');RC(g,x+1,y-2,1,1,'#cfc6b4');}
            const qa=P(a1u+(t1u-a1u)*z/zt,a1v+(t1v-a1v)*z/zt,z),qb=P(a1u+(t1u-a1u)*z/zt,a0v+(t0v-a0v)*z/zt,z);
            BL(g,qa,qb,'#766d5f');for(let x=Math.ceil(qa[0])+(k%2?2:4);x<qb[0]-1;x+=5){const y=Math.round(qa[1]-(x-qa[0])*.5);RC(g,x,y-2,1,2,'#766d5f');}}
          // 拱門（+v 面）
          const dm=P(.46,a1v,0);RC(g,dm[0]-3,dm[1]-9,6,9,'#e2dccd');RC(g,dm[0]-2,dm[1]-9,4,1,'#e2dccd');RC(g,dm[0]-2,dm[1]-8,4,8,'#4a3424');RC(g,dm[0]-1,dm[1]-9,2,1,'#4a3424');RC(g,dm[0]+1,dm[1]-4,1,1,'#c8a64a');
          const wr=P(a1u-.02,.44,17);RC(g,wr[0]-4,wr[1]-4,3,4,'#2f3a45');if(n)RC(n,wr[0]-4,wr[1]-4,3,4,'#f3c878');
          const wl=P(.36,a1v-.03,19);RC(g,wl[0]-1,wl[1]-4,3,4,'#34495a');
          const lp=P(.46,a1v,11);RC(g,lp[0]-1,lp[1],2,1,'#f4ecc4');if(n){RC(n,lp[0]-1,lp[1],2,1,'#ffeeb0');RC(n,lp[0]-2,lp[1]+1,4,1,'rgba(255,226,160,.45)');}
          // 頂部壓頂
          boxZ(g,t0u-.02,t0v-.02,t1u-t0u+.04,t1v-t0v+.04,zt,2,'#c9c0ad','#d6cebd','#a39985');});
        // 上段木柱架：坐在石基座壓頂上（z=30），兩層、每層一組 X；架內兩跑折返木梯從基座頂的樓梯口上到小屋
        const fo={b0:.19,b1:.17,z0:30,zt:26,lv:2,lw:2,col:{l:'#a5774b',d:'#6b4a2d',fl:'#6c4c2f',fr:'#583e26',back:'#45321f'}};
        fo.stairs=zigzag({lw:3,c1:'#f0c88a',c2:'#d29f5f',lt:'#f6dcaa',ld:'#7a5634'});
        S.t(1.05,(g)=>{const p=P(.5-.19,.5+.19,30);RC(g,Math.round(p[0])+2,Math.round(p[1]),4,1,'#3a2b1e');});   // 基座頂樓梯口
        frame(S,fo,1.1);
        cab(S,.23,56,12,10,{dT:'#8a6440',dL:'#9a7048',dR:'#6b4a2d',wl:'#d8cfbd',wr:'#a39a88',mul:'#f2ecdc',rl:'#5d646b',rr:'#40464c',rail:'#d2a870',railB:'#6b4a2d',rod:4,deck:.08},1.2);
        S.o(1.15,(g)=>{const u0=.66,v0=.08,du=.26,dv=.22,h=9;boxZ(g,u0,v0,du,dv,0,h-2,null,'#9a7048','#6b4a2d');
          for(let i=1;i<nL(v0+dv,u0,u0+du);i+=2)recL(g,v0+dv,u0,u0+du,i,i+1,0,h-2,'#86613c');
          fp(g,[P(u0-.02,v0-.02,h+1),P(u0+du+.03,v0-.02,h-3),P(u0+du+.03,v0+dv+.03,h-3),P(u0-.02,v0+dv+.03,h+1)],'#6d757c');
          BL(g,P(u0-.02,v0+dv+.03,h+1),P(u0+du+.03,v0+dv+.03,h-3),'#8e979c');
          recL(g,v0+dv,u0,u0+du,3,6,0,5,'#4a3424');});
        // 後木桶上移 1px、左前灌木往右上 1px：原位底緣外框各 1px 越出南側斜邊
        barrel(S,.82,.42,'#8a5a36',1.3);barrel(S,.87,.27,'#8a5a36',1.2);dangerSign(S,.2,.8,1.0);
        bush(S,.3,.9,3,1.3);bush(S,.9,.66,3,1.6);
      },
    ];
    for(let v=0;v<3;v++){const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      layouts[v](g,ng,S);S.run(g,ng);const[sc]=A.cv(W,H);
      B['95_1_'+v]=K.finish(c,g,sc,nc,{fence:false});}
  }catch(e){errs.push('k95 '+(e&&e.stack||e));}

  window.__civ_b_errs=errs;
});
