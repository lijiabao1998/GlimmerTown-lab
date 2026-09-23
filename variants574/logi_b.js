// T609 logi_b：k174 大型貨櫃碼頭（5×5，畫布 360×380，錨 180,376）／k173 散裝貨運碼頭（4×4，272×280，錨 136,278）實驗線重畫。
// 分層合成（沿用 infra_c2 的做法）：立體主體各自一層（二值化＋深色外框）；鋼索／欄杆／細桿走不描邊的細線層；
// 地面（鋪面、水面、標線、軌道）直接畫在地面層。夜光按層遮擋（後層實體擦掉被擋住的燈），水面不發光。
// 零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。碼頭岸線一律在後側 v=0 緣（北緣）。
(window.__variants574=window.__variants574||[]).push(function logi_b(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{174:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位看大圖；定稿必須是 {}
  const DEV_THROW=false;   // 迭代用：分類出錯時在批次尾拋出讓報表看得到；定稿必須是 false
  const DEV_HIDE={};       // 迭代用：{sts:1} 暫時不畫岸橋，單獨檢查船；定稿必須是 {}
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,AX,SZ,TOPY,P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c,ok)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){if(!ok||ok(x0,y0))g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const BL2=(g,a,b,c1,c2)=>{BL(g,a,b,c1);BL(g,[a[0]+1,a[1]],[b[0]+1,b[1]],c2);};     // 兩像素鋼構：左亮右暗
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    // 像素精準多邊形：掃描線取像素中心、左閉右開（無抗鋸齒、相鄰面不留縫）
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
    const clipPoly=(g,pts,fn)=>{g.save();g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.clip();fn();g.restore();};
    // 牆面上的直條（波紋、門縫）：+v 面沿 u 每 step 像素一條；+u 面沿 v
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    // 牆面平行四邊形（整數像素）：winL 在 +v 面、winR 在 +u 面；錨點＝左下
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55,frame)=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        if(frame)pg(g,X-1,Y-1,w+2,h+2,.5,frame);pg(g,X,Y,w,h,.5,glass);pg(g,X,Y,w,1,.5,SH(glass,36));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,'#ffe3a0');}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5,frame)=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        if(frame)pg(g,X-1,Y,w+2,h+2,-.5,frame);pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,'#f3d68e');}};
    // 橢圓（等距圓 rx:ry=2:1）
    const RX=r=>Math.max(1,rnd(r*45.25));
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const arcF=(g,cx,cy,rx,ry,c,x0=-1e9,x1=1e9)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let x=Math.max(-rx,x0);x<=Math.min(rx,x1);x++)g.fillRect(cx+x,cy+hx(rx,ry,x),1,1);};
    const arcB=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let x=-rx;x<=rx;x++)g.fillRect(cx+x,cy-hx(rx,ry,x),1,1);};
    // 直立圓柱：tones 左→右
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=hx(rx,ry,x);g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h];};
    const cone=(g,cx,cy,rx,rh,tones)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const yb=hx(rx,ry,x),yt=Math.max(yb,rnd(rh*(1-Math.abs(x)/(rx+.5))+ry*.15));
        const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];g.fillStyle=c;g.fillRect(cx+x,cy-yt,1,yt+yb+1);}};
    // 旋轉體（圓頂倉）：prof(z)→畫面水平半徑；逐像素依法線打光
    const revolve=(g,cx,cy,zh,prof,tones,opt={})=>{cx=rnd(cx);cy=rnd(cy);
      for(let z=0;z<=zh;z++){const rr=prof(z);if(!(rr>=.6))continue;const rx=rnd(rr),ry=Math.max(0,rnd(rr/2));
        const d=(prof(Math.min(zh,z+1))-prof(Math.max(0,z-1)))/2*.866,nn=Math.sqrt(1+d*d),cp=1/nn,sp=-d/nn;
        const band=opt.band&&z>2&&z%opt.band===0;
        for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y),ca=ry?y/(ry+.5):1;
          for(let x=-w;x<=w;x++){const sa=x/(rx+.5);let l=-.62*sa*cp+.6*sp+.3*Math.max(0,ca)*cp+(opt.bias||0);
            let k=l>.42?0:l>.16?1:l>-.08?2:l>-.32?3:4;if(band&&y===hx(rx,ry,x))k=Math.min(4,k+1);
            g.fillStyle=tones[k];g.fillRect(cx+x,cy-z+y,1,1);}}}};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h,z] 方盒／['c',u,v,r,h,z] 圓柱
    const shadow=(g,list,a=.22)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,r,h,z=0]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45,z);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 高度場：zf(u,v)→z、cf(u,v,z,gu,gv,i,j)→色；逐斜列由後往前
    const terrain=(g,u0,v0,u1,v1,st,zf,cf)=>{const nu=rnd((u1-u0)/st),nv=rnd((v1-v0)/st),Z=[];
      for(let i=0;i<=nu;i++){const row=new Float32Array(nv+1);for(let j=0;j<=nv;j++)row[j]=zf(u0+i*st,v0+j*st);Z.push(row);}
      for(let s=0;s<=nu+nv-2;s++)for(let i=Math.max(0,s-nv+1);i<=Math.min(nu-1,s);i++){const j=s-i,u=u0+i*st,v=v0+j*st;
        const a=Z[i][j],b=Z[i+1][j],c=Z[i+1][j+1],d=Z[i][j+1];if(a<=0&&b<=0&&c<=0&&d<=0)continue;const gu=(b+c-a-d)/(2*st),gv=(d+c-a-b)/(2*st);
        const col=cf(u+st/2,v+st/2,(a+b+c+d)/4,gu,gv,i,j);if(col)fp(g,[P(u,v,a),P(u+st,v,b),P(u+st,v+st,c),P(u,v+st,d)],col);}
      return Z;};

    // ---------- 地坪 ----------
    const MATS={
      q:{t:['#c9c5ba','#c3bfb4','#cfcbc0'],j:'#b8b4a9',s:.25,p:.5},     // 碼頭混凝土
      y:{t:['#b2afa6','#aca9a0','#b8b5ac'],j:'#a3a097',s:.25,p:.55},    // 堆場鋪面
      a:{t:['#6f6d69','#6a6864','#75736e'],j:null,s:.125,p:.7},         // 瀝青
      k:{t:['#a9a497','#a29d91','#b1ac9f'],j:null,s:.0625,p:.55},       // 碎石
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.7},         // 草
      c:{t:['#bdb9ae','#b7b3a8','#c3bfb4'],j:'#aba79c',s:.25,p:.6},     // 一般混凝土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*14);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,'#63615d');}}
      if(m==='y'||m==='q'){for(let i=0;i<rnd(du*dv*3);i++){const p=P(u0+.05+hsh(seed,i,41)*(du-.1),v0+.05+hsh(seed,i,42)*(dv-.1));RC(g,p[0]-1,p[1],3,1,SH(M.t[0],-18));RC(g,p[0],p[1]+1,2,1,SH(M.t[0],-12));}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const WAT={b:'#3166a5',d:'#2c5a90',l:'#3973b7',h:'#5d93cf'};
    const water=(g,u0,v0,du,dv,seed)=>{const poly=Q(u0,v0,du,dv);fp(g,poly,WAT.b);
      clipPoly(g,poly,()=>{for(let i=0;i<rnd(du*dv*46);i++){const u=u0+hsh(seed,i,1)*du,v=v0+hsh(seed,i,2)*dv,p=P(u,v),l=2+rnd(hsh(seed,i,3)*4);
        RC(g,p[0],p[1],l,1,hsh(seed,i,4)<.55?WAT.l:WAT.d);}});};
    // 碼頭岸線：壓頂＋黃色警戒線＋繫船柱＋護舷（岸線沿 u、在 v=vq）
    const quayEdge=(g,vq,u0,u1,seed,bol=.42)=>{
      lineU(g,vq-.03,u0,u1,WAT.d);lineU(g,vq-.015,u0,u1,WAT.d);
      lineU(g,vq,u0,u1,'#e9e5da');lineU(g,vq+.04,u0,u1,'#d9b440');
      for(let u=u0+.2;u<u1-.1;u+=bol){const p=P(u,vq+.018);RC(g,p[0]-1,p[1]-2,3,2,'#34383b');RC(g,p[0]-1,p[1]-2,2,1,'#5d6266');
        const f=P(u+bol*.5,vq-.01);RC(g,f[0]-1,f[1]-1,3,2,'#1f2225');}};
    const railLine=(g,v,u0,u1)=>{lineU(g,v,u0,u1,'#6d6f70');lineU(g,v+.012,u0,u1,'#8f9294');};
    const track=(g,v,u0,u1,seed)=>{flat(g,u0,v-.035,u1-u0,.14,'#8e877c');   // 軌道：道碴＋枕木＋雙軌（沿 u）
      for(let u=u0+.02;u<u1-.02;u+=.045){BL(g,P(u,v-.02),P(u,v+.09),'#6a5a4a');}
      lineU(g,v,u0,u1,'#50565b');lineU(g,v+.07,u0,u1,'#50565b');lineU(g,v-.008,u0,u1,'#a3a9ad');lineU(g,v+.062,u0,u1,'#a3a9ad');};
    const trackV=(g,u,v0,v1,seed)=>{flat(g,u-.035,v0,.14,v1-v0,'#8e877c');
      for(let v=v0+.02;v<v1-.02;v+=.045){BL(g,P(u-.02,v),P(u+.09,v),'#6a5a4a');}
      lineV(g,u,v0,v1,'#50565b');lineV(g,u+.07,v0,v1,'#50565b');lineV(g,u-.008,v0,v1,'#a3a9ad');lineV(g,u+.062,v0,v1,'#a3a9ad');};
    const stalls=(g,u0,v0,du,n,dv=.2,c='#dedad0')=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};

    // ---------- 貨櫃 ----------
    const CPAL=[['#a5523d',6],['#4c6f95',5],['#8e969a',3],['#d2d1c9',3],['#5b8765',3],['#6c92b2',2],['#bf7a3c',2],['#82573f',2],['#4d8682',2],['#7a3b37',2],['#b49c4a',1]];
    const CT=CPAL.reduce((a,b)=>a+b[1],0);
    const cpick=t=>{let s=t*CT;for(const[c,w]of CPAL){if(s<w)return c;s-=w;}return CPAL[0][0];};
    const REEF='#dcdedb';
    // 沿 u 長向的貨櫃：長側（+v 面，亮）帶波紋；門端（+u 面，暗）有門閂；冷凍櫃門端換成機組格柵
    const ctrU=(g,u0,v0,L,Wd,z,col,th=4,reefer=false,seam=false)=>{const u1=u0+L,v1=v0+Wd;
      faceL(g,v1,u0,u1,z,z+th,col);
      faceR(g,u1,v0,v1,z,z+th,reefer?'#8c9396':SH(col,-50));
      fp(g,Q(u0,v0,L,Wd,z+th),SH(col,18));
      if(seam)BL(g,P(u0,v1,z+th),P(u1,v1,z+th),SH(col,2));
      ribsL(g,u0,u1,v1,z,z+th,SH(col,-15));
      faceL(g,v1,u0,u1,z,z+1,SH(col,-30));
      BL(g,P(u0,v1,z),P(u0,v1,z+th-1),SH(col,-40));
      if(reefer){const d=P(u1,v0+Wd*.5,z+th-1);RC(g,d[0]-1,d[1],1,1,'#5c6366');RC(g,d[0],d[1]+1,1,1,'#5c6366');}
      else if(L>.25){const d=P(u1,v0+Wd*.5,z+th-1);RC(g,d[0],d[1]+1,1,th-2,SH(col,-30));}};
    // 沿 v 長向的貨櫃：長側（+u 面，暗）波紋、門端（+v 面，亮）
    const ctrV=(g,u0,v0,L,Wd,z,col,th=4)=>{const u1=u0+Wd,v1=v0+L;
      faceL(g,v1,u0,u1,z,z+th,SH(col,-8));
      faceR(g,u1,v0,v1,z,z+th,SH(col,-44));
      fp(g,Q(u0,v0,Wd,L,z+th),SH(col,18));
      ribsR(g,u1,v0,v1,z,z+th,SH(col,-58));
      faceR(g,u1,v0,v1,z,z+1,SH(col,-64));
      if(L>.25){const d=P(u0+Wd*.5,v1,z+th-1);RC(g,d[0],d[1]+1,1,th-2,SH(col,-34));}};
    // 堆場區塊（沿 u）：bays＝各 bay 的 u 起點；nr 列沿 v；tiers(i,j)→層數；col(i,j,t)→色
    const blockU=(g,bays,v0,nr,o={})=>{const L=o.L||.4,Wd=o.w||.085,gv=o.gv!=null?o.gv:.01,seed=o.seed||1,tmax=o.tmax||4,th=o.th||4;
      bays.forEach((u,i)=>{const sec=cpick(hsh(seed,i,902)),bh=o.bh?o.bh(i):2+Math.floor(hsh(seed,i,77)*(tmax-1));
        for(let j=0;j<nr;j++){let n=o.tiers?o.tiers(i,j):Math.max(0,Math.min(tmax,bh+(hsh(seed,i*13+j,5)<.28?-1:0)+(hsh(seed,i*7+j,6)<.12?1:0)));
          if(!o.tiers&&hsh(seed,i*29+j,9)<(o.empty||.06))n=0;
          const dom=cpick(hsh(seed,i*5+Math.floor(j/3),901));
          for(let t=0;t<n;t++){const q=hsh(seed,i*31+j,t+7),col=o.col?o.col(i,j,t):(q<.62?dom:q<.86?sec:cpick(hsh(seed,i*17+j*5,t+50)));
            ctrU(g,u,v0+j*(Wd+gv),L,Wd,t*th,col,th,!!o.reefer,!!o.seam);}}});};
    // 堆場區塊（沿 v）：rows＝各列的 u 起點；bays 沿 v
    const blockV=(g,rows,bays,o={})=>{const L=o.L||.4,Wd=o.w||.085,seed=o.seed||1,tmax=o.tmax||4,th=o.th||4;
      rows.forEach((u,i)=>{bays.forEach((v,j)=>{const dom=cpick(hsh(seed,j*7+Math.floor(i/3),903)),sec=cpick(hsh(seed,j,904)),bh=o.bh?o.bh(i,j):2+Math.floor(hsh(seed,j,79)*(tmax-1));
        let n=o.tiers?o.tiers(i,j):Math.max(0,Math.min(tmax,bh+(hsh(seed,i*11+j,5)<.3?-1:0)));
        if(!o.tiers&&hsh(seed,i*23+j,9)<(o.empty||.05))n=0;
        for(let t=0;t<n;t++){const q=hsh(seed,i*37+j,t+7),col=o.col?o.col(i,j,t):(q<.62?dom:q<.86?sec:cpick(hsh(seed,i*19+j*3,t+60)));ctrV(g,u,v,L,Wd,t*th,col,th);}});});};

    // ---------- 起重機與車輛 ----------
    // 岸橋 STS：u0 遠側、寬 wU（沿岸線）；vw 海側腿、vl 陸側腿；hb 主樑高；vt 臂端（伸出水面，可 <0）；vbk 後伸端
    const sts=(S,u0,o)=>{if(DEV_HIDE.sts)return;const wU=o.wU||.42,vw=o.vw,vl=o.vl,hb=o.hb||54,vt=o.vt!=null?o.vt:-.24,vbk=o.vbk!=null?o.vbk:vl+.26,ah=o.ah||30,u1=u0+wU;
      const C=o.col||'#c4473a',Ct=SH(C,30),Cl=SH(C,12),Cd=SH(C,-42),WT='#dedcd4',WL='#eeece6',WD='#aeaba3';
      const va=vl-.14,hs=o.hs!=null?o.hs:rnd(hb*.42);
      const bog=(g,u,v)=>{boxZ(g,u-.08,v-.035,.16,.07,0,4,'#8a8f93','#6d7276','#4e5357');const p=P(u-.06,v+.035,0),q=P(u+.04,v+.035,0);RC(g,p[0],p[1]-2,2,2,'#26292c');RC(g,q[0],q[1]-2,2,2,'#26292c');};
      const leg=(g,u,v)=>boxZ(g,u-.03,v-.03,.06,.06,4,hb-9,Ct,Cl,Cd);
      const portal=(g,v)=>{boxZ(g,u0-.045,v-.035,wU+.09,.07,hb-11,6,Ct,Cl,Cd);ribsL(g,u0-.045,u1+.045,v+.035,hb-11,hb-5,SH(Cl,-10),4,2);};
      // 海側腿（在船之前、陸側腿之後畫）
      S.o(u0+vw+.02,(g)=>{bog(g,u0,vw);bog(g,u1,vw);leg(g,u0,vw);leg(g,u1,vw);portal(g,vw);});
      // 陸側腿＋側面水平撐＋斜撐＋樓梯
      S.o(u0+vl+.02,(g)=>{for(const us of[u0,u1]){boxZ(g,us-.02,vw+.03,.04,vl-vw-.06,hs,3,Ct,Cl,Cd);
          BL2(g,P(us,vl-.03,hs+3),P(us,vw+.03,hb-11),Cl,Cd);bog(g,us,vl);leg(g,us,vl);}
        portal(g,vl);
        const s=P(u1+.05,vl+.02,0);for(let z=6;z<hs-2;z+=6){const a=[s[0],s[1]-z],b=[s[0]+3,s[1]-z-3];BL(g,a,b,'#9aa0a4');BL(g,[b[0],b[1]],[b[0]-3,b[1]-3],'#9aa0a4');}});
      // 吊具：o.tr＝小車位置（v）、o.hs＝吊具高、o.load＝吊著的貨櫃色
      const trv=o.tr!=null?o.tr:vl-.08;
      if(o.hsp!=null){const um=u0+wU*.5,hsp=o.hsp;
        S.t(um+trv+.001,(g)=>{for(const du of[-.13,.13]){const a=P(um+du,trv,hb-3),b=P(um+du,trv,hsp+2);BL(g,a,b,'#3a3f44');}});
        S.o(um+trv+.002,(g)=>{if(o.load)ctrU(g,um-.2,trv-.042,.4,.085,hsp-4,o.load);boxZ(g,um-.2,trv-.045,.4,.09,hsp,2,'#e9c24a','#f1cf5c','#b8922d');});}
      // 上部結構：遠側 A 架＋主樑 → 小車＋司機室 → 近側 A 架＋主樑 → 頂橫樑、機房
      S.t(u1+vl+.04,(g)=>{for(const us of[u0,u1]){const ap=P(us,va,hb+ah);
        if(o.up){BL(g,ap,P(us,vw-.2,hb+42),'#4a4f54');BL(g,ap,P(us,vw-.12,hb+26),'#4a4f54');}
        else{BL(g,ap,P(us,vw-.42,hb),'#4a4f54');BL(g,ap,P(us,Math.max(vt+.1,vw-.78),hb),'#4a4f54');}
        BL(g,ap,P(us,vbk-.05,hb),'#4a4f54');}});
      S.o(u1+vl+.05,(g,n)=>{
        const afr=(us)=>{const ap=P(us,va,hb+ah);BL2(g,P(us,vw+.02,hb),ap,Cl,Cd);BL2(g,P(us,vl-.02,hb),ap,Cl,Cd);BL(g,P(us,vw+.08,hb+ah*.45),P(us,vl-.08,hb+ah*.45),Cd);};
        const gird=(us)=>{if(o.up){boxZ(g,us-.025,vw-.04,.05,vbk-vw+.04,hb-5,5,Ct,Cl,Cd);
            const tv=vw-.2,th=hb+44;fp(g,[P(us-.03,vw-.02,hb),P(us-.03,vw-.02,hb-6),P(us-.03,tv,th-6),P(us-.03,tv,th)],Cl);fp(g,[P(us+.03,vw-.02,hb-6),P(us+.03,vw-.02,hb),P(us+.03,tv,th),P(us+.03,tv,th-6)],Cd);
            fp(g,[P(us-.03,vw-.02,hb-6),P(us+.03,vw-.02,hb-6),P(us+.03,tv,th-6),P(us-.03,tv,th-6)],SH(Cd,-10));
            BL(g,P(us-.03,vw-.02,hb),P(us-.03,tv,th),Ct);for(let k=1;k<5;k++){const q=P(us+.03,vw-.02-(.18*k/5),hb-6+44*k/5);BL(g,q,[q[0]-1,q[1]+5],SH(Cd,-16));}}
          else{boxZ(g,us-.025,vt,.05,vbk-vt,hb-5,5,Ct,Cl,Cd);ribsL(g,us-.025,us+.025,vbk,hb-5,hb,Cd,3);}};
        afr(u0);gird(u0);
        boxZ(g,u0+.04,trv-.07,wU-.08,.14,hb-1,4,WT,WL,WD);                                           // 小車
        const cb=boxZ(g,u0+.2,trv-.03,.13,.1,hb-15,9,'#e6e4dc','#f0eee8','#b4b1a9');                  // 司機室
        winL(g,u0+.215,trv+.07,hb-13,3,4,'#3d5a72');if(n)winL(n,u0+.215,trv+.07,hb-13,3,4,'#ffe2a0');
        afr(u1);gird(u1);
        boxZ(g,u0-.03,va-.025,wU+.06,.05,hb+ah-3,4,Ct,Cl,Cd);                                           // A 架頂橫樑
        const mh=boxZ(g,u0-.01,vbk-.24,wU+.02,.2,hb,8,WT,WL,WD);                                        // 機房
        ribsL(g,u0-.01,u1+.01,vbk-.04,hb,hb+8,'#c9c6be',3);winL(g,u0+.06,vbk-.04,hb+2,3,3,'#4b6a82');
        ribsR(g,u1+.01,vbk-.24,vbk-.04,hb,hb+8,'#9a978f',3);
        BL(g,P(u0-.01,vbk-.04,hb+9),P(u1+.01,vbk-.04,hb+9),'#c9c6be');
        // 夜：警示紅燈（A 架頂、臂端、機房頂）＋主樑下泛光燈
        const red=(p)=>{RC(g,p[0],p[1]-1,1,1,'#d0392c');if(n){RC(n,p[0],p[1]-1,1,1,'#ff5a48');}};
        red(P(u0,va,hb+ah+1));red(P(u1,va,hb+ah+1));
        if(o.up)red(P(u1,vw-.2,hb+45));else red(P(u1,vt+.02,hb+1));
        red(P(u1+.01,vbk-.24,hb+9));
        const fl=o.up?[vw+.05,vl-.02]:[vw-.35,vw+.05,vl-.02];
        for(const v of fl)for(const us of[u0,u1]){const p=P(us,v,hb-5);RC(g,p[0],p[1],2,1,'#e8e2c8');if(n){RC(n,p[0],p[1],2,1,'#fff2cc');RC(n,p[0],p[1]+1,2,1,'rgba(255,236,180,.45)');}}
      });
    };
    // 門式起重機（RTG／RMG／跨運車共用）：ax='v' 表示跨距沿 v（兩側在 a0／a1 的 v 位置，每側兩腿沿 u：b0、b0+bw）；ax='u' 反之
    const gantry=(S,ax,b0,bw,a0,a1,h,o={})=>{const C=o.col||'#e0b03a',Ct=SH(C,28),Cl=SH(C,8),Cd=SH(C,-46),lw=o.lw||.045;
      const bx=(g,a,b,da,db,z,hh,t,l,r)=>{if(ax==='v')boxZ(g,b,a,db,da,z,hh,t,l,r);else boxZ(g,a,b,da,db,z,hh,t,l,r);};
      const pt=(a,b,z)=>ax==='v'?P(b,a,z):P(a,b,z);
      const side=(g,a)=>{bx(g,a-.035,b0-.06,.07,bw+.12,0,3,'#6a6f73','#585d61','#3e4346');
        for(const bb of[b0-.03,b0+bw+.01]){const p=pt(a+.035,bb,0);RC(g,p[0]-1,p[1]-2,2,2,'#222528');}
        bx(g,a-lw/2,b0-lw/2,lw,lw,3,h-3,Ct,Cl,Cd);bx(g,a-lw/2,b0+bw-lw/2,lw,lw,3,h-3,Ct,Cl,Cd);
        bx(g,a-.02,b0-.02,.04,bw+.04,h-6,3,Ct,Cl,Cd);
        if(o.brace!==false)BL(g,pt(a+.02,b0+.02,5),pt(a+.02,b0+bw-.02,h-6),Cd);};
      const dB=o.dB!=null?o.dB:(ax==='v'?b0+bw*.5+a0:a0+b0+bw*.5),dF=o.dF!=null?o.dF:(ax==='v'?b0+bw+a1+.02:a1+b0+bw+.02);
      S.o(dB,(g)=>side(g,a0));
      if(o.hsp!=null){const tp=o.tr!=null?o.tr:(a0+a1)/2,bm=b0+bw*.5;
        S.t(dF-.02,(g)=>{for(const db of[-.1,.1]){BL(g,pt(tp,bm+db,h-1),pt(tp,bm+db,o.hsp+2),'#3a3f44');}});
        S.o(dF-.015,(g)=>{if(ax==='v'){if(o.load)ctrU(g,bm-.2,tp-.042,.4,.085,o.hsp-4,o.load);boxZ(g,bm-.2,tp-.045,.4,.09,o.hsp,2,'#e9c24a','#f1cf5c','#b8922d');}
          else{if(o.load)ctrV(g,tp-.042,bm-.2,.4,.085,o.hsp-4,o.load);boxZ(g,tp-.045,bm-.2,.09,.4,o.hsp,2,'#e9c24a','#f1cf5c','#b8922d');}});}
      S.o(dF,(g,n)=>{side(g,a1);
        const gw=o.gw||.055,gh=o.gh||4;
        bx(g,a0-.05,b0-gw/2,a1-a0+.1,gw,h,gh,Ct,Cl,Cd);
        const tp=o.tr!=null?o.tr:(a0+a1)/2;
        if(o.top){bx(g,a0+.02,b0+.02,a1-a0-.04,bw-.04,h+1,3,'#8d9498','#a3aaae','#737a7e');                 // 跨運車頂部引擎艙
          bx(g,a0+.01,b0+bw-.1,.09,.1,h+2,6,SH(o.top,26),o.top,SH(o.top,-44));const w=pt(a0+.02,b0+bw,h+5);RC(g,w[0],w[1]-1,3,2,'#34506a');if(n)RC(n,w[0],w[1]-1,3,2,'#ffe2a0');}
        else bx(g,tp-.07,b0+.01,.14,bw-.02,h+gh-2,4,'#e4e6e7','#f0f2f3','#b3b8bb');
        bx(g,a0-.05,b0+bw-gw/2,a1-a0+.1,gw,h,gh,Ct,Cl,Cd);
        if(o.ehouse)bx(g,a1-.14,b0-.03,.12,bw+.06,h+gh,5,'#dfe1e0','#ecedec','#aeb3b4');
        if(o.cab!==false){const ca=o.cabA!=null?o.cabA:a0+.08;bx(g,ca-.04,b0+bw-.02,.1,.08,h-10,7,'#e2e3e2','#eeefee','#aeb2b3');
          const w=pt(ca+.06,b0+bw+.06,h-4);RC(g,w[0]-2,w[1]-2,3,2,'#3d5a72');if(n)RC(n,w[0]-2,w[1]-2,3,2,'#ffe2a0');}
        if(o.eng!==false)bx(g,a1-.03,b0+bw*.25,.1,bw*.5,3,6,'#d2d4d3','#e2e4e3','#a3a8a9');
        const r=pt(a1,b0+bw,h+3);RC(g,r[0],r[1],1,1,'#d0392c');if(n)RC(n,r[0],r[1],1,1,'#ff5a48');
        const f=pt(a0+.1,b0+bw,h-1);RC(g,f[0],f[1],2,1,'#e8e2c8');if(n){RC(n,f[0],f[1],2,1,'#fff2cc');}
      });
    };
    // 貨櫃車：沿 u（車頭朝 +u）或沿 v（車頭朝 +v）；ctr＝貨櫃色（null＝空板架）
    const truck=(S,u,v,alongU,cab,ctr,d)=>S.o(d!=null?d:(alongU?u+.3+v+.04:u+.04+v+.3),(g,n)=>{const Wd=.075;
      if(alongU){boxZ(g,u,v,.44,Wd,1,1,'#44484c','#55595d','#34383b');
        for(const t of[.04,.1,.36,.5])RC(g,P(u+t,v+Wd,0)[0],P(u+t,v+Wd,0)[1]-1,2,2,'#1e2023');
        if(ctr)ctrU(g,u+.02,v,.4,Wd,2,ctr,4);
        boxZ(g,u+.45,v-.005,.1,Wd+.01,1,7,SH(cab,26),cab,SH(cab,-46));faceR(g,u+.55,v+.01,v+Wd-.005,5,7,'#35495a');
        if(n){const h=P(u+.55,v+.01,2),h2=P(u+.55,v+Wd-.01,2);RC(n,h[0],h[1],1,1,'#fff3c8');RC(n,h2[0]-1,h2[1],1,1,'#fff3c8');}}
      else{boxZ(g,u,v,Wd,.44,1,1,'#44484c','#55595d','#34383b');
        for(const t of[.04,.1,.36,.5]){const p=P(u+Wd,v+t,0);RC(g,p[0]-1,p[1]-1,2,2,'#1e2023');}
        if(ctr)ctrV(g,u,v+.02,.4,Wd,2,ctr,4);
        boxZ(g,u-.005,v+.45,Wd+.01,.1,1,7,SH(cab,26),cab,SH(cab,-46));faceL(g,v+.55,u+.005,u+Wd,5,7,'#4a6a82');
        if(n){const h=P(u+.01,v+.55,2),h2=P(u+Wd-.01,v+.55,2);RC(n,h[0],h[1],1,1,'#fff3c8');RC(n,h2[0],h2[1],1,1,'#fff3c8');}}});
    const car=(S,u,v,alongU,col)=>S.o(u+v+.1,(g)=>{const du=alongU?.15:.08,dv=alongU?.08:.15;
      boxZ(g,u,v,du,dv,1,2,col,SH(col,20),SH(col,-40));boxZ(g,u+(alongU?.04:.01),v+(alongU?.01:.04),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa3bb','#5a7d94');});
    // 高桿照明：燈冠一圈；夜裡只亮燈冠
    const mast=(S,u,v,h=46,d)=>S.o(d!=null?d:u+v+.05,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');RC(g,x+1,y-h+2,1,h-4,'#80878c');
      RC(g,x-3,y-h-2,7,2,'#5b6166');RC(g,x-3,y-h-2,7,1,'#9aa1a6');RC(g,x-3,y-h,7,1,'#e9e2c4');
      if(n){RC(n,x-3,y-h,7,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,232,170,.5)');}});
    const lamp=(S,u,v,h=16,d)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    // 平頂建築（行政樓／閘口站房）
    const flatB=(g,u0,v0,du,dv,h,wl,wr,roof)=>{boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.03,v0+.03,du-.06,dv-.06,roof,h);
      BL(g,P(u0+.03,v0+.03,h),P(u0+du-.03,v0+.03,h),SH(roof,-20));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v0+dv-.03,h),SH(roof,-14));BL(g,P(u0,v0+dv,h),P(u0+du,v0+dv,h),SH(wl,18));};
    const office=(S,u0,v0,du,dv,fl,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const fh=7,h=fl*fh+3,wl=o.wl||'#e7e3d9',wr=o.wr||'#bdb8ad',gl=o.gl||'#4b7394';
      flatB(g,u0,v0,du,dv,h,wl,wr,o.roof||'#8d9498');
      for(let f=0;f<fl;f++){rowL(g,n,u0+.03,u0+du-.03,v0+dv,3+f*fh,4,3,2,gl,seed+f,.55);rowR(g,n,u0+du,v0+.03,v0+dv-.03,3+f*fh,3,3,2,gl,seed+f*7,.45);}
      if(o.band)faceL(g,v0+dv,u0,u0+du,h-2,h-1,o.band);
      const um=u0+du*.5;boxZ(g,um-.1,v0+dv,.2,.07,6,1,'#eef0f1','#f6f7f8','#b8bfc3');winL(g,um-.05,v0+dv,0,4,6,'#2f4c63');if(n)winL(n,um-.05,v0+dv,0,4,6,'#ffe6a8');
      boxZ(g,u0+du*.2,v0+dv*.25,.14,.12,h,3,'#c9ced1','#dde1e3','#a9b0b4');boxZ(g,u0+du*.6,v0+dv*.3,.1,.1,h,2,'#b9c0c4','#ced4d7','#9aa2a6');});
    // 山牆廠房（維修棚／貨運站）
    const shed=(S,u0,v0,du,dv,h,rh,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const wl=o.wl||'#cfd5d8',wr=o.wr||'#a1a9ae',rl=o.rl||'#8a959b',rd=o.rd||'#67727a',u1=u0+du,v1=v0+dv,um=u0+du/2,ov=.03;
      boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
      ribsL(g,u0,u1,v1,0,h,SH(wl,-12),3);ribsR(g,u1,v0,v1,0,h,SH(wr,-12),3);
      fp(g,[P(u0-ov,v0-ov,h-1),P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),P(u0-ov,v1+ov,h-1)],rl);
      fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
      fp(g,[P(um,v0-ov,h+rh),P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh)],rd);BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,26));
      const nd=o.doors||2;for(let k=0;k<nd;k++){const t=u0+du*(k+.5)/nd-.07;winL(g,t,v1,0,5,Math.min(9,h-3),'#6f787d');for(let z=1;z<Math.min(9,h-3);z+=2)winL(g,t,v1,z,5,1,'#5c656a');
        const lp=P(t+.08,v1,Math.min(9,h-3)+2);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');}
      rowR(g,n,u1,v0+.04,v1-.04,h-5,3,2,3,'#5a7f99',seed,.4);});
    // ---------- 船 ----------
    // 船（沿 u，船艏在 u0、船艉在 u1）：乾舷 fb；o.cargo='ctr' 甲板貨櫃（o.work＝裝卸中較低的 bay）／'bulk' 艙口蓋（o.open＝開艙序號、o.gear＝甲板吊）
    const ship=(S,u0,u1,v0,v1,o={})=>{const fb=o.fb||10,vc=(v0+v1)/2,bow=o.bow||.55,hull=o.hull||'#2d3b50',seed=o.seed||3,us=o.us!=null?o.us:u1-.72,sh=o.sh||36,dk=o.deck||'#6b5a4c';
      S.o(-9,(g,n)=>{
        fp(g,[P(u0,vc,-1),P(u0+bow,v1,-1),P(u0+bow,v1,fb+1),P(u0-.05,vc,fb+4)],SH(hull,10));        // 船艏外飄
        faceL(g,v1,u0+bow,u1,-1,fb+1,hull);                                                             // 舷側（亮面）
        faceL(g,v1,u0+bow,u1,-1,1,'#8b3a2f');fp(g,[P(u0+.05,vc+.02,-1),P(u0+bow,v1,-1),P(u0+bow,v1,1),P(u0+.04,vc+.02,1)],'#8b3a2f');   // 水線紅帶
        faceL(g,v1,u0+bow,u1,fb,fb+1,SH(hull,38));                                                      // 舷牆頂
        faceR(g,u1,v0,v1,-1,fb+1,SH(hull,-26));                                                          // 船艉
        fp(g,[P(u0-.05,vc,fb+4),P(u0+bow,v0,fb+1),P(u1,v0,fb+1),P(u1,v1,fb+1),P(u0+bow,v1,fb+1)],dk);   // 甲板
        for(let t=u0+bow+.3;t<us-.1;t+=.44){const p=P(t,v1,fb-3);RC(g,p[0],p[1]-1,1,1,'#e6e6e0');}      // 吃水刻度
        const nm=P(u0+bow+.1,v1,fb-2);RC(g,nm[0],nm[1]-2,1,2,'#e6e6e0');RC(g,nm[0]+2,nm[1]-1,1,2,'#e6e6e0');RC(g,nm[0]+4,nm[1],1,2,'#e6e6e0');
        boxZ(g,u0-.02,vc-.06,.26,.12,fb+1,4,dk,SH(dk,18),SH(dk,-20));                                  // 艏樓
      });
      if(o.cargo==='bulk'){
        // 艙口：圍板＋艙蓋（開艙露出貨物）；艙間甲板吊
        S.o(-8.9,(g,n)=>{let i=0;const hl=o.hl||.34;for(let t=u0+bow+.12;t<us-hl-.04;t+=hl+.14,i++){const open=(o.open||[]).includes(i);
            boxZ(g,t,v0+.06,hl,v1-v0-.12,fb+1,3,'#7b6a5a','#8e7c6a','#5f5246');
            if(open){flat(g,t+.03,v0+.09,hl-.06,v1-v0-.18,'#3a332d',fb+4);flat(g,t+.05,v0+.11,hl-.1,v1-v0-.22,o.load||'#2b2a29',fb+3);
              for(let k=0;k<6;k++){const p=P(t+.06+hsh(seed,i,k)*(hl-.12),v0+.12+hsh(seed,k,i)*(v1-v0-.24),fb+3);RC(g,p[0],p[1],1,1,SH(o.load||'#2b2a29',30));}
              boxZ(g,t-.02,v0+.04,.05,v1-v0-.08,fb+4,4,o.hc||'#8b4a38',SH(o.hc||'#8b4a38',14),SH(o.hc||'#8b4a38',-34));}
            else{boxZ(g,t+.01,v0+.07,hl-.02,v1-v0-.14,fb+4,2,o.hc||'#8b4a38',SH(o.hc||'#8b4a38',12),SH(o.hc||'#8b4a38',-34));
              BL(g,P(t+hl*.5,v0+.07,fb+6),P(t+hl*.5,v1-.07,fb+6),SH(o.hc||'#8b4a38',-24));}}
          if(o.gear){let k=0;for(let t=u0+bow+.12+hl+.07;t<us-.2;t+=(hl+.14)*2,k++){const p=P(t,vc,fb+1),x=rnd(p[0]),y=rnd(p[1]);cyl(g,x,y,2,8,['#c9c2b0','#e2dccb','#b7b09e','#9a9383'],'#e8e2d2');
              RC(g,x-2,y-12,5,4,'#e2dccb');RC(g,x+2,y-12,1,4,'#a39c8b');BL2(g,[x,y-10],[x-18+k*2,y-26],'#e2dccb','#a39c8b');BL(g,[x-17+k*2,y-26],[x-17+k*2,y-18],'#3a3f44');}}});
      }else{
        S.o(-8.9,(g)=>{let i=0;for(let t=u0+bow+.08;t<us-.42;t+=.45,i++){const dom=cpick(hsh(seed,i,5)),low=(o.work||[]).includes(i);
          const bh=low?1+Math.floor(hsh(seed,i,8)*2):3+Math.floor(hsh(seed,i,9)*2);
          for(let j=0;j<4;j++){const n=Math.max(1,bh-(hsh(seed,i*5+j,3)<.3?1:0));for(let k=0;k<n;k++){const q=hsh(seed,i*9+j,k+1);ctrU(g,t,v0+.035+j*.085,.4,.08,fb+1+k*4,q<.6?dom:cpick(hsh(seed,i*3+j,k+20)),4);}}}});}
      // 上層建築（船員住艙＋駕駛台）＋煙囪
      S.o(-8.8,(g,n)=>{const h=sh,vd=v1-v0,fl=Math.max(2,Math.floor((h-8)/6));
        boxZ(g,us,v0+.05,.24,vd-.1,fb+1,h,'#e3e1da','#efede7','#bcb9b1');
        for(let f=0;f<fl;f++){rowL(g,n,us+.02,us+.22,v1-.05,fb+5+f*6,2,2,2,'#43627c',seed*7+f,.45);}
        boxZ(g,us-.02,v0,.28,vd,fb+h+1,4,'#dcdad2','#e9e7e1','#b3b0a8');faceL(g,v1,us-.02,us+.26,fb+h+2,fb+h+4,'#2f4a60');
        if(n){for(let k=0;k<3;k++)winL(n,us+.02+k*.08,v1,fb+h+2,2,2,'#ffe3a0');}
        const mp=P(us+.12,vc,fb+h+5);RC(g,mp[0],mp[1]-9,1,9,'#d9d9d4');RC(g,mp[0]-2,mp[1]-6,5,1,'#d9d9d4');RC(g,mp[0],mp[1]-10,1,1,'#f4f4ee');if(n){RC(n,mp[0],mp[1]-10,1,1,'#fff6e0');}
        boxZ(g,us+.32,vc-.07,.14,.14,fb+1,h-4,'#d8d6ce','#e6e4de','#aeaba3');                                  // 煙囪
        faceL(g,vc+.07,us+.32,us+.46,fb+h-12,fb+h-8,o.band||'#b8423a');faceR(g,us+.46,vc-.07,vc+.07,fb+h-12,fb+h-8,SH(o.band||'#b8423a',-40));
        fp(g,Q(us+.34,vc-.05,.1,.1,fb+h-3),'#2a2d30');
        const nl=P(u0+bow,v1,fb+3);if(n){RC(n,nl[0],nl[1],1,1,'#6aff8a');}RC(g,nl[0],nl[1],1,1,'#3f9a55');
      });
    };

    // 貨櫃船（T609 退件重做）：沿 u，船艏在 u0（斜切艏柱＋外飄）、船艉在 u1；中淺藍殼＋白舷緣線＋紅色吃水帶；
    // 甲板貨櫃按 bay 聚色（o.bays＝[{u,t,c:[c1,c2],sp}]），bay 之間有綁紮橋；上層建築整幅跨船寬、兩翼外伸、舷梯落到岸上（o.vq）；
    // o.lines＝繫泊纜（[船上 u, 岸上 u]）
    const cship=(S,u0,u1,v0,v1,o={})=>{const fb=o.fb||11,vc=(v0+v1)/2,bow=o.bow||.5,rake=.12,hull=o.hull||'#3d5d7c',dk=o.deck||'#5b5652',
      HL=SH(hull,16),HD=SH(hull,-34),RED='#a8402f',REDd='#7a2c22',SHE='#dfe1dc',us=o.us,sw=o.sw||.3,sh=o.sh||20,vq=o.vq!=null?o.vq:v1+.1;
      const nr=Math.max(2,Math.floor((v1-v0-.03)/.085)),rv0=vc-nr*.085/2;
      S.o(-9,(g,n)=>{
        // 船艏（+v 側外飄面，朝左前受光）＋舷側＋吃水帶＋舷緣
        fp(g,[P(u0+rake,vc,-1),P(u0+bow,v1,-1),P(u0+bow,v1,fb+1),P(u0-.02,vc,fb+4)],HL);
        fp(g,[P(u0+rake,vc,-1),P(u0+bow,v1,-1),P(u0+bow,v1,2),P(u0+rake-.02,vc,2)],RED);
        faceL(g,v1,u0+bow,u1,-1,fb+1,hull);
        faceL(g,v1,u0+bow,u1,-1,2,RED);faceL(g,v1,u0+bow,u1,-1,0,REDd);
        faceL(g,v1,u0+bow,u1,fb,fb+1,SHE);BL(g,P(u0-.02,vc,fb+4),P(u0+bow,v1,fb+1),SHE);
        faceR(g,u1,v0,v1,-1,fb+1,HD);faceR(g,u1,v0,v1,-1,2,REDd);BL(g,P(u1,v0,fb+1),P(u1,v1,fb+1),SH(SHE,-30));
        // 甲板
        fp(g,[P(u0-.02,vc,fb+4),P(u0+bow,v0,fb+1),P(u1,v0,fb+1),P(u1,v1,fb+1),P(u0+bow,v1,fb+1)],dk);
        // 艏樓：抬高甲板＋擋浪板（V 形）＋前桅
        fp(g,[P(u0-.02,vc,fb+4),P(u0+bow*.7,v0+.04,fb+4),P(u0+bow*.7,v1-.04,fb+4)],SH(dk,14));
        boxZ(g,u0+bow-.05,v0+.03,.04,v1-v0-.06,fb+1,6,'#d9dcd8','#e8eae6','#a9aeab');
        const fm=P(u0+.2,vc,fb+4);RC(g,fm[0],fm[1]-9,1,9,'#cfd2cf');RC(g,fm[0]+1,fm[1]-8,1,8,'#8d9290');RC(g,fm[0],fm[1]-10,1,1,'#f4f4ee');if(n)RC(n,fm[0],fm[1]-10,1,1,'#fff6e0');
        // 錨鏈孔、吃水刻度、船名
        const hp=P(u0+.26,(vc+v1)/2+.06,fb-2);RC(g,hp[0],hp[1],2,2,'#1b1f23');RC(g,hp[0]+1,hp[1]+2,1,3,'#2a2e31');
        for(const t of[u0+bow+.08,u1-.12]){for(let z=3;z<fb-1;z+=2){const p=P(t,v1,z);RC(g,p[0],p[1],2,1,'#e9ebe6');}}
        const nm=P(u0+bow+.3,v1,fb-3);for(let k=0;k<7;k++)RC(g,nm[0]+k*2,nm[1]+(k>>1)-1,1,2,'#eef0ec');
        const nl=P(u0+bow,v1,fb+2);RC(g,nl[0],nl[1],1,1,'#3f9a55');if(n)RC(n,nl[0],nl[1],1,1,'#6aff8a');
      });
      // 甲板貨櫃：bay 由後往前畫；bay 之間的綁紮橋（淺灰鋼架＋黃色欄杆）
      S.o(-8.9,(g)=>{for(const b of(o.bays||[])){const t=b.t|0;
          boxZ(g,b.u-.045,rv0,.03,nr*.085,fb+1,Math.min(10,Math.max(4,t*4-2)),'#bfc3c0','#d3d6d3','#8f9492');
          if(t<=0){boxZ(g,b.u+.01,rv0+.01,.38,nr*.085-.02,fb+1,2,'#6f7f78','#80908a','#56645e');BL(g,P(b.u+.2,rv0+.01,fb+3),P(b.u+.2,rv0+nr*.085-.01,fb+3),'#56645e');continue;}
          for(let j=0;j<nr;j++){const cc=b.c[(b.sp!=null&&j>=b.sp)?1:0]||b.c[0];const tn=Math.max(1,t-((j===0||j===nr-1)&&b.step?1:0));
            for(let k=0;k<tn;k++)ctrU(g,b.u,rv0+j*.085,.4,.085,fb+1+k*4,cc,4,false,true);}}});
      // 上層建築：住艙（整幅）＋駕駛台（兩翼外伸）＋桅＋煙囪
      if(us!=null)S.o(-8.8,(g,n)=>{const h=sh,z0=fb+1,fl=Math.max(2,Math.floor((h-4)/5));
        boxZ(g,us,v0+.03,sw,v1-v0-.06,z0,h,'#e3e1da','#efede7','#bcb9b1');
        faceL(g,v1-.03,us,us+sw,z0,z0+1,'#b9b6ae');
        for(let f=0;f<fl;f++)rowL(g,n,us+.02,us+sw-.02,v1-.03,z0+3+f*5,2,2,2,'#43627c',(o.seed||3)*7+f,.4);
        ribsR(g,us+sw,v0+.03,v1-.03,z0,z0+h,'#aeaba3',4,2);
        boxZ(g,us-.02,v0-.05,sw*.72,v1-v0+.1,z0+h,4,'#dcdad2','#e9e7e1','#b3b0a8');faceL(g,v1+.05,us-.02,us+sw*.72-.02,z0+h+1,z0+h+3,'#2f4a60');
        faceR(g,us+sw*.72-.02,v0-.05,v1+.05,z0+h+1,z0+h+3,'#26394a');
        if(n){for(let k=0;k<3;k++)winL(n,us+.01+k*.07,v1+.05,z0+h+1,2,2,'#ffe3a0');}
        const mp=P(us+.1,vc,z0+h+4);RC(g,mp[0],mp[1]-9,1,9,'#d9d9d4');RC(g,mp[0]-2,mp[1]-6,5,1,'#d9d9d4');RC(g,mp[0],mp[1]-10,1,1,'#f4f4ee');if(n)RC(n,mp[0],mp[1]-10,1,1,'#fff6e0');
        const fu=us+sw*.72+.01;boxZ(g,fu,vc-.07,.13,.14,z0+h-2,8,'#d8d6ce','#e6e4de','#aeaba3');
        faceL(g,vc+.07,fu,fu+.13,z0+h+1,z0+h+4,o.band||'#b8423a');faceR(g,fu+.13,vc-.07,vc+.07,z0+h+1,z0+h+4,SH(o.band||'#b8423a',-40));
        fp(g,Q(fu+.02,vc-.05,.09,.1,z0+h+6),'#2a2d30');
        // 舷梯：從住艙旁的舷緣斜落到岸上
      });
      if(us!=null)S.t(-8.7,(g)=>{const a=P(us-.04,v1,fb),b=P(us+.24,vq+.07,0);BL(g,a,b,'#e4e6e2');BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9ca2a0');
        for(let k=1;k<6;k++){const q=lerp(a,b,k/6);RC(g,q[0],q[1]-2,1,2,'#c3c7c4');}const f=P(us+.24,vq+.07,0);RC(g,f[0]-1,f[1],3,1,'#6d7274');});
      // 繫泊纜：船上導纜孔 → 岸上繫船柱
      if(o.lines)S.t(-8.65,(g)=>{for(const[a,b]of o.lines){const p=P(a,v1,fb-1),q=P(b,vq+.02,2);BL(g,p,q,'#3b3631');}});
    };

    // ---------- 散貨 ----------
    const PT={coal:['#75726d','#5a5753','#44423f','#32312f','#242323'],ore:['#b06c50','#95573f','#7a4533','#603628','#4a2a20'],
      grav:['#cdc9c0','#b6b2a9','#9e9a92','#87837c','#706d67'],sand:['#dbc390','#c6ad79','#ae9566','#937c53','#796643'],lime:['#e3ded2','#ccc7ba','#b4afa3','#9c988d','#848177']};
    const LV=[-.42,.62,.66];
    // 料堆著色：法線打光量化成五階＋沿坡面的流痕（同一條「沿長軸的索引」共用一個偏移）＋零星塊料
    const pileShade=(tones,seed,sk)=>(u,v,z,gu,gv,i,j)=>{const a=-gu/36,b=-gv/36,nn=Math.sqrt(a*a+b*b+1);
      let l=(a*LV[0]+b*LV[1]+LV[2])/nn;const si=sk?sk(u,v,i,j):i+j;
      l+=(hsh(seed,si,7)-.5)*.1+(hsh(seed,i,j)-.5)*.07;if(z<1.6)l-=.12;
      let k=l>.86?0:l>.73?1:l>.56?2:l>.38?3:4;const q=hsh(seed+1,i,j);if(q>.986)k=Math.max(0,k-1);else if(q<.018)k=Math.min(4,k+1);return tones[k];};
    // 截面：直坡＋圓頂（x＝離坡腳的相對距離 0..1）
    const prof=(x,br=.62)=>x<br?x/br*.8:.8+.2*(1-Math.pow((1-x)/(1-br),2));
    // 長條料堆（兩端半圓錐）；cut＝[a,b,底高] 沿長軸的取料缺口（陡面）
    const rowZ=(u0,v0,du,dv,H,seed,cut)=>{const al=du>=dv,hwid=(al?dv:du)/2,Lh=(al?du:dv)/2,uc=u0+du/2,vc=v0+dv/2;
      const f=(u,v)=>{const a=al?u-uc:v-vc,b=al?v-vc:u-uc,ex=Math.max(0,Math.abs(a)-(Lh-hwid)),dd=Math.hypot(ex,b);if(dd>=hwid)return 0;
        const t=a+Lh,Hh=H*(.9+.07*Math.sin(t*6.1+seed)+.03*Math.sin(t*15.3+seed*2));let z=Hh*prof(1-dd/hwid);
        if(cut){const dc=t<cut[0]?cut[0]-t:t>cut[1]?t-cut[1]:0;z=Math.min(z,(cut[2]||1)+dc*70);}return Math.max(0,z);};
      f.sk=al?(u,v,i,j)=>i>>1:(u,v,i,j)=>j>>1;return f;};
    const coneZ=(uc,vc,r,H)=>{const f=(u,v)=>{const dd=Math.hypot(u-uc,v-vc);return dd>=r?0:H*prof(1-dd/r,.78);};f.sk=(u,v)=>rnd((Math.atan2(v-vc,u-uc)+Math.PI)*9);return f;};
    const pile=(S,kind,u0,v0,du,dv,zf,seed,d)=>S.o(d!=null?d:u0+v0+(du+dv)*.5,(g)=>terrain(g,u0,v0,u0+du,v0+dv,1/32,zf,pileShade(PT[kind],seed,zf.sk)));
    // 堆取料機：軌道沿 u（中心 vr），臂架朝 dir（-1＝-v、+1＝+v）；斗輪在臂端
    // o.ax='u'：軌道沿 u（s＝沿軌位置 u、c＝軌道中心 v）；o.ax='v'：軌道沿 v（s＝v、c＝u）
    const stackRec=(S,s,c,dir,o={})=>{const ax=o.ax||'u',Lb=o.L||.62,C=o.col||'#dca63a',Ct=SH(C,26),Cl=SH(C,8),Cd=SH(C,-46),hp=16,tipZ=o.tipZ!=null?o.tipZ:10,ct=c+dir*Lb;
      const PP=(al,ac,z)=>ax==='u'?P(al,ac,z):P(ac,al,z);
      const BX=(g,al,ac,dal,dac,z,h,t,l,r)=>ax==='u'?boxZ(g,al,ac,dal,dac,z,h,t,l,r):boxZ(g,ac,al,dac,dal,z,h,t,l,r);
      const tp=PP(s,c,36);
      const boom=(g)=>{const a=PP(s,c+dir*.05,hp),b=PP(s,ct,tipZ+2),a2=[a[0],a[1]+3],b2=[b[0],b[1]+3];
        BL(g,a,b,Ct);BL(g,a2,b2,Cd);for(let k=0;k<9;k++){BL(g,lerp(a,b,k/9),lerp(a2,b2,(k+1)/9),Cl);}BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#34383b');
        const q=PP(s,ct,tipZ),cx=rnd(q[0]),cy=rnd(q[1]);ell(g,cx,cy,5,5,'#43474b');ell(g,cx,cy,4,4,Cl);ell(g,cx-1,cy-1,2,2,Ct);RC(g,cx,cy,1,1,Cd);
        for(let k=0;k<8;k++){const t=k/8*Math.PI*2;RC(g,cx+rnd(Math.cos(t)*5)-1,cy+rnd(Math.sin(t)*5)-1,2,2,'#2f3336');}};
      const body=(g,n)=>{for(const cc of[c-.09,c+.09]){BX(g,s-.16,cc-.03,.32,.06,0,3,'#6a6f73','#585d61','#3e4346');}
        BX(g,s-.12,c-.1,.24,.2,3,4,Ct,Cl,Cd);BX(g,s-.08,c-.08,.16,.16,7,5,Ct,Cl,Cd);
        const cw=PP(s,c-dir*.32,19);BL2(g,PP(s,c,15),cw,Cl,Cd);BX(g,s-.06,c-dir*.32-.05,.12,.1,12,7,'#7d8286','#8e9397','#5e6367');
        BL2(g,PP(s-.06,c,12),tp,Cl,Cd);BL2(g,PP(s+.06,c,12),tp,Cl,Cd);BL(g,PP(s-.04,c,24),PP(s+.04,c,24),Cd);
        BX(g,s+.02,c+dir*.04-.05,.12,.1,11,7,'#e2e3e2','#eeefee','#aeb2b3');const w=PP(s+.07,c+dir*.04+.05,14);RC(g,w[0]-1,w[1],3,2,'#3d5a72');if(n)RC(n,w[0]-1,w[1],3,2,'#ffe2a0');
        RC(g,tp[0],tp[1]-2,1,1,'#d0392c');if(n)RC(n,tp[0],tp[1]-2,1,1,'#ff5a48');
        const fl=PP(s,c+dir*Lb*.55,hp-3);RC(g,fl[0],fl[1]+3,2,1,'#e8e2c8');if(n){RC(n,fl[0],fl[1]+3,2,1,'#fff2cc');}};
      const d=o.d!=null?o.d:s+c+.12;
      S.t(d-.001,(g)=>{BL(g,tp,PP(s,c+dir*Lb*.55,hp+1),'#4a4f54');BL(g,tp,PP(s,ct-dir*.04,tipZ+3),'#4a4f54');BL(g,tp,PP(s,c-dir*.3,20),'#4a4f54');});
      S.o(d,(g,n)=>{if(dir<0){boom(g);body(g,n);}else{body(g,n);boom(g);}});};
    // 高架輸送廊道（有屋頂的皮帶棧橋）：沿 u 或沿 v，下緣高 za→zb 線性
    // 棧橋支架（細線層、不描邊）：兩根立柱＋之字斜撐＋橫樑；a,b＝兩柱腳 (u,v)
    const trestle=(g,a,b,z)=>{for(const q of[a,b]){const p=P(q[0],q[1],0);RC(g,p[0],p[1]-z,1,z,'#8c959a');RC(g,p[0]+1,p[1]-z+1,1,z-1,'#5b6469');}
      const pa=P(a[0],a[1],0),pb=P(b[0],b[1],0);for(let k=0;k+6<=z;k+=6){BL(g,[pa[0]+1,pa[1]-k],[pb[0],pb[1]-k-6],'#6d767b');}BL(g,[pa[0],pa[1]-z+1],[pb[0],pb[1]-z+1],'#5b6469');};
    const galU=(S,ua,ub,v,za,zb,o={})=>{const w=o.w||.08,gh=o.gh||5,col=o.col||'#bcc5bf',v0=v-w/2,v1=v+w/2,cd=SH(col,-40),ct=o.roof||'#838f89',zf=u=>za+(zb-za)*(u-ua)/(ub-ua),d=o.d!=null?o.d:(ua+ub)/2+v+.05;
      S.t(d-.002,(g)=>{for(let u=ua+(o.first||.14);u<ub-.04;u+=o.sp||.36){const z=rnd(zf(u));if(z<5)continue;trestle(g,[u,v1+.005],[u,v0-.005],z);}});
      S.o(d,(g)=>{
        fp(g,[P(ua,v1,za),P(ub,v1,zb),P(ub,v1,zb+gh),P(ua,v1,za+gh)],col);
        for(let u=ua+.06;u<ub-.03;u+=3/32){const p=P(u,v1,zf(u)+gh);RC(g,p[0],p[1]+1,1,gh-2,SH(col,-13));}
        fp(g,[P(ua,v1,za),P(ub,v1,zb),P(ub,v1,zb+1),P(ua,v1,za+1)],SH(col,-30));
        fp(g,[P(ua,v0,za+gh),P(ub,v0,zb+gh),P(ub,v1,zb+gh),P(ua,v1,za+gh)],ct);BL(g,P(ua,v1,za+gh),P(ub,v1,zb+gh),SH(ct,22));
        faceR(g,ub,v0,v1,zb,zb+gh,cd);});};
    const galV=(S,u,va,vb,za,zb,o={})=>{const w=o.w||.08,gh=o.gh||5,col=o.col||'#bcc5bf',u0=u-w/2,u1=u+w/2,cd=SH(col,-40),ct=o.roof||'#838f89',zf=v=>za+(zb-za)*(v-va)/(vb-va),d=o.d!=null?o.d:u+(va+vb)/2+.05;
      S.t(d-.002,(g)=>{for(let v=va+(o.first||.14);v<vb-.04;v+=o.sp||.36){const z=rnd(zf(v));if(z<5)continue;trestle(g,[u0-.005,v],[u1+.005,v],z);}});
      S.o(d,(g)=>{
        fp(g,[P(u1,va,za),P(u1,vb,zb),P(u1,vb,zb+gh),P(u1,va,za+gh)],cd);
        for(let v=va+.06;v<vb-.03;v+=3/32){const p=P(u1,v,zf(v)+gh);RC(g,p[0],p[1]+1,1,gh-2,SH(cd,-12));}
        fp(g,[P(u1,va,za),P(u1,vb,zb),P(u1,vb,zb+1),P(u1,va,za+1)],SH(cd,-20));
        fp(g,[P(u0,va,za+gh),P(u1,va,za+gh),P(u1,vb,zb+gh),P(u0,vb,zb+gh)],ct);BL(g,P(u1,va,za+gh),P(u1,vb,zb+gh),SH(ct,-16));
        faceL(g,vb,u0,u1,zb,zb+gh,col);});};
    // 地面皮帶機（低支架、無屋頂）
    const beltU=(g,ua,ub,v,z=3)=>{for(let u=ua+.05;u<ub;u+=.16){const p=P(u,v+.03,0);RC(g,p[0],p[1]-z,1,z,'#7a8186');}boxZ(g,ua,v-.03,ub-ua,.06,z,2,'#3b3d3f','#8a9296','#646c71');BL(g,P(ua,v-.02,z+2),P(ub,v-.02,z+2),'#2b2c2d');};
    const beltV=(g,u,va,vb,z=3)=>{for(let v=va+.05;v<vb;v+=.16){const p=P(u+.03,v,0);RC(g,p[0],p[1]-z,1,z,'#7a8186');}boxZ(g,u-.03,va,.06,vb-va,z,2,'#3b3d3f','#8a9296','#646c71');BL(g,P(u-.02,va,z+2),P(u-.02,vb,z+2),'#2b2c2d');};
    // 轉運塔：下半開放鋼架（四柱＋橫撐＋交叉斜撐），上半壓型鋼板機房
    const tower=(S,u0,v0,du,dv,h,o={})=>S.o(o.d!=null?o.d:u0+v0+(du+dv)*.5,(g,n)=>{const wl=o.wl||'#c5ccc7',wr=o.wr||'#98a29d',roof=o.roof||'#6f787c',hh=o.head||13,hf=h-hh,u1=u0+du,v1=v0+dv,c=.035;
      const col=(u,v)=>boxZ(g,u-c/2,v-c/2,c,c,0,hf,'#9aa3a8','#9aa3a8','#6a7378');
      col(u0+c/2,v0+c/2);col(u1-c/2,v0+c/2);col(u0+c/2,v1-c/2);
      for(let z=8;z<hf-2;z+=9){BL(g,P(u0,v1,z),P(u1,v1,z),'#7d868b');BL(g,P(u1,v0,z),P(u1,v1,z),'#5f686d');}
      for(let z=0;z<hf-4;z+=9){const z1=Math.min(hf,z+9);BL(g,P(u0,v1,z),P(u1,v1,z1),'#8d969b');BL(g,P(u1,v0,z),P(u1,v1,z1),'#636c71');}
      if(o.stair!==false){for(let z=3;z<hf-3;z+=6){BL(g,P(u0+.02,v1+.03,z),P(u0+.12,v1+.03,z+3),'#c9a13a');}}
      col(u1-c/2,v1-c/2);
      boxZ(g,u0-.01,v0-.01,du+.02,dv+.02,hf,hh,SH(roof,14),wl,wr);ribsL(g,u0-.01,u1+.01,v1+.01,hf,h,SH(wl,-12),3);ribsR(g,u1+.01,v0-.01,v1+.01,hf,h,SH(wr,-12),3);
      flat(g,u0+.01,v0+.01,du-.02,dv-.02,roof,h);BL(g,P(u0-.01,v1+.01,h),P(u1+.01,v1+.01,h),SH(wl,16));
      rowL(g,n,u0,u1,v1+.01,h-5,3,2,3,'#4d6f88',rnd(u0*100+v0*10),.5);
      const r=P(u1,v0,h+1);RC(g,r[0],r[1]-1,1,1,'#d0392c');if(n)RC(n,r[0],r[1]-1,1,1,'#ff5a48');});
    // 裝船機：沿岸軌道（vw 海側腿、vl 陸側腿）；臂架伸向 -v 至 vt、溜管垂到 hs；o.up＝臂架仰起停機
    const shiploader=(S,u,vw,vl,o={})=>{const C=o.col||'#e0a93a',Ct=SH(C,26),Cl=SH(C,8),Cd=SH(C,-46),hb=o.hb||30,vt=o.vt!=null?o.vt:.12,w=.3,u0=u-w/2,u1=u+w/2,hs=o.hs!=null?o.hs:12;
      const leg=(g,uu,vv)=>{boxZ(g,uu-.07,vv-.03,.14,.06,0,3,'#6a6f73','#585d61','#3e4346');boxZ(g,uu-.025,vv-.025,.05,.05,3,hb-11,Ct,Cl,Cd);};
      S.o(u+vw+.01,(g)=>{leg(g,u0,vw);leg(g,u1,vw);boxZ(g,u0-.03,vw-.03,w+.06,.06,hb-12,4,Ct,Cl,Cd);});
      S.o(u+vl+.02,(g)=>{for(const uu of[u0,u1]){BL2(g,P(uu,vl-.02,4),P(uu,vw+.02,hb-12),Cl,Cd);leg(g,uu,vl);}boxZ(g,u0-.03,vl-.03,w+.06,.06,hb-12,4,Ct,Cl,Cd);});
      const tp=P(u,vl-.06,hb+20);
      S.t(u1+vl+.04,(g)=>{if(o.up){BL(g,tp,P(u,vw-.14,hb+30),'#4a4f54');}else{BL(g,tp,P(u,vt+.06,hb+1),'#4a4f54');BL(g,tp,P(u,(vt+vw)/2,hb+1),'#4a4f54');}});
      S.o(u1+vl+.05,(g,n)=>{boxZ(g,u0-.04,vw-.05,w+.08,vl-vw+.1,hb-8,4,Ct,Cl,Cd);                               // 門架頂框
        boxZ(g,u-.1,vw+.02,.2,vl-vw-.04,hb-4,4,Ct,Cl,Cd);                                                          // 迴轉台
        if(o.up){const a=P(u-.04,vw+.02,hb),tv=vw-.14,tz=hb+30;fp(g,[P(u-.04,vw+.02,hb),P(u-.04,vw+.02,hb-4),P(u-.04,tv,tz-4),P(u-.04,tv,tz)],Cl);fp(g,[P(u+.04,vw+.02,hb-4),P(u+.04,vw+.02,hb),P(u+.04,tv,tz),P(u+.04,tv,tz-4)],Cd);
          BL(g,P(u-.04,vw+.02,hb),P(u-.04,tv,tz),Ct);const r=P(u+.04,tv,tz+1);RC(g,r[0],r[1],1,1,'#d0392c');if(n)RC(n,r[0],r[1],1,1,'#ff5a48');}
        else{boxZ(g,u-.04,vt,.08,vl-vt-.02,hb,4,Ct,Cl,Cd);ribsL(g,u-.04,u+.04,vl-.02,hb,hb+4,Cd,2);BL(g,P(u-.04,vt,hb+4),P(u-.04,vl-.02,hb+4),'#34383b');
          boxZ(g,u-.035,vt-.02,.07,.07,hs,hb-hs,'#9aa1a5','#b3babd','#7e868a');boxZ(g,u-.05,vt-.035,.1,.1,hs-5,5,'#6d7478','#80878b','#565c60');   // 伸縮溜管
          const r=P(u+.04,vt,hb+5);RC(g,r[0],r[1],1,1,'#d0392c');if(n)RC(n,r[0],r[1],1,1,'#ff5a48');
          for(const vv of[vt+.1,(vt+vw)/2]){const f=P(u+.04,vv,hb-1);RC(g,f[0],f[1],2,1,'#e8e2c8');if(n){RC(n,f[0],f[1],2,1,'#fff2cc');RC(n,f[0],f[1]+1,2,1,'rgba(255,236,180,.45)');}}}
        BL2(g,P(u-.06,vl-.06,hb),tp,Cl,Cd);BL2(g,P(u+.06,vl-.06,hb),tp,Cl,Cd);RC(g,tp[0],tp[1]-2,1,1,'#d0392c');if(n)RC(n,tp[0],tp[1]-2,1,1,'#ff5a48');
        boxZ(g,u1-.02,vl-.16,.1,.12,hb-10,7,'#e2e3e2','#eeefee','#aeb2b3');winL(g,u1-.01,vl-.04,hb-7,3,3,'#3d5a72');if(n)winL(n,u1-.01,vl-.04,hb-7,3,3,'#ffe2a0');
        // 尾車：從岸邊皮帶機斜上到臂根
        const a=P(u-.03,vl+.2,4),b=P(u-.03,vl-.02,hb-2);BL(g,a,b,'#5d6468');BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9aa2a6');BL(g,[a[0],a[1]-3],[b[0],b[1]-3],'#34383b');});};
    // 軌道（任意折線，u,v 座標）：道碴、枕木、雙軌
    const pathTrack=(g,pts)=>{const N=pts.length,nr=[];for(let i=0;i<N;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(N-1,i+1)],du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1;nr.push([-dv/l,du/l]);}
      const off=(i,k)=>[pts[i][0]+nr[i][0]*k,pts[i][1]+nr[i][1]*k];
      for(let i=0;i<N-1;i++){const a=off(i,-.075),b=off(i+1,-.075),c=off(i+1,.075),d=off(i,.075);fp(g,[P(...a),P(...b),P(...c),P(...d)],'#8e877c');}
      let acc=0;for(let i=0;i<N-1;i++){const sl=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);let t=(.045-acc%.045)%.045;
        for(;t<sl;t+=.045){const f=t/sl,p=[pts[i][0]+(pts[i+1][0]-pts[i][0])*f,pts[i][1]+(pts[i+1][1]-pts[i][1])*f];BL(g,P(p[0]+nr[i][0]*-.055,p[1]+nr[i][1]*-.055),P(p[0]+nr[i][0]*.055,p[1]+nr[i][1]*.055),'#6a5a4a');}acc+=sl;}
      for(const k of[-.035,.035]){for(let i=0;i<N-1;i++){BL(g,P(...off(i,k),0),P(...off(i+1,k),0),'#50565b');}for(let i=0;i<N-1;i++){BL(g,P(...off(i,k),1),P(...off(i+1,k),1),'#a3a9ad');}}};
    const stadium=(ua,ub,vc,r,st=.06)=>{const pts=[];for(let u=ua;u<=ub;u+=st)pts.push([u,vc+r]);const na=Math.max(8,rnd(Math.PI*r/st));
      for(let k=1;k<=na;k++){const t=Math.PI/2-Math.PI*k/na;pts.push([ub+r*Math.cos(t),vc+r*Math.sin(t)]);}
      for(let u=ub-st;u>=ua;u-=st)pts.push([u,vc-r]);for(let k=1;k<=na;k++){const t=-Math.PI/2-Math.PI*k/na;pts.push([ua+r*Math.cos(t),vc+r*Math.sin(t)]);}return pts;};
    // 漏斗車（沿 u）：車廂＋頂部載料＋底部漏斗
    const hopperU=(g,u,v,L=.34,load='#2b2a29',col='#5d4c40')=>{boxZ(g,u,v,L,.09,3,6,SH(col,14),col,SH(col,-38));ribsL(g,u,u+L,v+.09,3,9,SH(col,-16),4,2);
      fp(g,Q(u+.02,v+.012,L-.04,.066,9),load);const pk=P(u+L*.5,v+.045,10);RC(g,pk[0]-3,pk[1],6,1,SH(load,26));
      for(const t of[.08,L-.12]){const p=P(u+t,v+.09,3);RC(g,p[0],p[1]-1,4,2,SH(col,-30));}for(const t of[.04,L-.06]){const p=P(u+t,v+.09,0);RC(g,p[0],p[1]-2,2,2,'#1e2023');}};
    const hopperV=(g,u,v,L=.34,load='#2b2a29',col='#5d4c40')=>{boxZ(g,u,v,.09,L,3,6,SH(col,14),SH(col,-8),SH(col,-40));ribsR(g,u+.09,v,v+L,3,9,SH(col,-50),4,2);
      fp(g,Q(u+.012,v+.02,.066,L-.04,9),load);const pk=P(u+.045,v+L*.5,10);RC(g,pk[0]-3,pk[1],6,1,SH(load,26));
      for(const t of[.04,L-.06]){const p=P(u+.09,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1e2023');}};
    const loco=(g,u,v,alongU,col='#c9572f')=>{if(alongU){boxZ(g,u,v,.34,.09,3,8,SH(col,20),col,SH(col,-44));boxZ(g,u+.24,v+.005,.1,.08,11,4,SH(col,28),SH(col,8),SH(col,-40));faceR(g,u+.34,v+.015,v+.075,8,11,'#2f4a60');
        BL(g,P(u,v+.09,6),P(u+.34,v+.09,6),'#e8d24a');for(const t of[.05,.27]){const p=P(u+t,v+.09,0);RC(g,p[0],p[1]-2,2,2,'#1e2023');}}
      else{boxZ(g,u,v,.09,.34,3,8,SH(col,20),SH(col,-6),SH(col,-44));boxZ(g,u+.005,v+.24,.08,.1,11,4,SH(col,28),SH(col,8),SH(col,-40));faceL(g,v+.34,u+.015,u+.075,8,11,'#2f4a60');
        BL(g,P(u+.09,v,6),P(u+.09,v+.34,6),'#e8d24a');for(const t of[.05,.27]){const p=P(u+.09,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1e2023');}}};
    // 圓筒倉群：nu×nv 個、半徑 r、高 h；頂部皮帶廊＋一端的升降機塔
    const siloBank=(S,u0,v0,nu,nv,r,h,o={})=>S.o(o.d!=null?o.d:u0+v0+nu*r+nv*r,(g,n)=>{const T=o.tones||['#b3aea2','#dcd8cc','#cfcabe','#bbb6aa','#a39e92'],rx=RX(r);
      const cs=[];for(let i=0;i<nu;i++)for(let j=0;j<nv;j++)cs.push([u0+r+i*2*r,v0+r+j*2*r]);cs.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
      for(const [u,v] of cs){const p=P(u,v);cyl(g,p[0],p[1],rx,h,T,SH(T[1],10),SH(T[3],-6));for(let z=10;z<h-3;z+=10)arcF(g,p[0],p[1]-z,rx,rx>>1,SH(T[3],-10));
        const q=P(u,v,0);RC(g,q[0]-1,q[1]+(rx>>1)-7,3,6,'#6f6a60');}
      const gu0=u0+r*.6,gv=v0+nv*r;boxZ(g,u0+.02,gv-.05,nu*2*r-.04,.1,h,5,'#c9c4b8','#d9d4c8','#a8a397');ribsL(g,u0+.02,u0+nu*2*r-.02,gv+.05,h,h+5,'#b8b3a7',3);
      const eh=o.eh||24;boxZ(g,u0+nu*2*r-.04,v0+nv*r-.12,.2,.24,h,eh,'#cfcabe','#ddd8cc','#aba69a');ribsL(g,u0+nu*2*r-.04,u0+nu*2*r+.16,v0+nv*r+.12,h,h+eh,'#c3beb2',3);
      rowL(g,n,u0+nu*2*r-.03,u0+nu*2*r+.15,v0+nv*r+.12,h+eh-6,2,2,2,'#4d6f88',71,.6);
      const rl=P(u0+nu*2*r+.16,v0+nv*r-.12,h+eh+1);RC(g,rl[0],rl[1]-1,1,1,'#d0392c');if(n)RC(n,rl[0],rl[1]-1,1,1,'#ff5a48');});
    // 圓頂倉（網殼穹頂）＋頂部進料口
    const dome=(S,u,v,r,o={})=>S.o(o.d!=null?o.d:u+v,(g,n)=>{const c=P(u,v),rho=RX(r),zc=rho*.12,zh=rnd((zc+rho)*.866);
      cyl(g,c[0],c[1],rho+1,3,['#a39e92','#cfcabe','#bdb8ac','#a39e92'],null);
      revolve(g,c[0],c[1]-3,zh,z=>Math.sqrt(Math.max(0,rho*rho-(z/.866-zc)*(z/.866-zc))),o.tones||['#f1f2ee','#dfe2dd','#c9cdc7','#aeb3ad','#949993'],{band:7});
      boxZ(g,u-.05,v-.05,.1,.1,zh+2,5,'#cfd3d0','#dde0dd','#a9aeab');
      const dr=P(u,v+r*.98,0);RC(g,dr[0]-3,dr[1]-9,6,8,'#6f7578');RC(g,dr[0]-3,dr[1]-9,6,1,'#9aa1a5');const lp=P(u,v+r*.98,10);RC(g,lp[0]-1,lp[1]-1,2,1,'#efe2b0');if(n)RC(n,lp[0]-1,lp[1]-1,2,1,'#ffe6a0');});
    // 放射狀堆料機：樞軸在 (up,vp) 地面，臂端在 (ut,vt) 高 ht
    const radial=(S,up,vp,ut,vt,ht,o={})=>S.o(o.d!=null?o.d:Math.max(up+vp,ut+vt)+.05,(g,n)=>{const C=o.col||'#dca63a',a=P(up,vp,5),b=P(ut,vt,ht);
      boxZ(g,up-.06,vp-.06,.12,.12,0,5,SH(C,26),C,SH(C,-44));
      const m=[up+(ut-up)*.55,vp+(vt-vp)*.55],mz=5+(ht-5)*.55,mp=P(m[0],m[1],mz);BL2(g,P(m[0]-.05,m[1]+.04,0),mp,'#8d959a','#6d757a');BL2(g,P(m[0]+.05,m[1]-.04,0),mp,'#8d959a','#6d757a');
      for(const q of[[m[0]-.05,m[1]+.04],[m[0]+.05,m[1]-.04]]){const w=P(q[0],q[1],0);RC(g,w[0]-1,w[1]-2,3,2,'#26292c');}
      const a2=[a[0],a[1]+3],b2=[b[0],b[1]+3];BL(g,a,b,SH(C,26));BL(g,a2,b2,SH(C,-46));for(let k=0;k<10;k++)BL(g,lerp(a,b,k/10),lerp(a2,b2,(k+1)/10),C);BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#34383b');
      RC(g,b[0]-1,b[1],3,4,'#6d7478');});
    // 前輪裝載機／自卸卡車
    const loader=(S,u,v,col='#dca63a')=>S.o(u+v+.12,(g)=>{boxZ(g,u,v,.18,.1,2,5,SH(col,24),col,SH(col,-44));boxZ(g,u+.02,v+.015,.07,.07,7,5,'#dfe3e5','#8fb0c4','#6f8fa3');
      boxZ(g,u+.19,v-.01,.04,.12,1,4,'#5d6468','#737a7e','#4a5054');for(const t of[.03,.14]){const p=P(u+t,v+.1,0);RC(g,p[0],p[1]-3,3,3,'#222528');}});
    const dumper=(S,u,v,col='#c9572f',load)=>S.o(u+v+.2,(g)=>{boxZ(g,u,v,.3,.1,1,2,'#44484c','#55595d','#34383b');fp(g,[P(u+.02,v,3),P(u+.24,v,3),P(u+.24,v+.1,3),P(u+.02,v+.1,3)],'#3a3f44');
      boxZ(g,u+.02,v,.22,.1,3,5,SH(col,20),col,SH(col,-44));if(load)fp(g,Q(u+.04,v+.015,.18,.07,8),load);boxZ(g,u+.25,v+.005,.08,.09,2,7,'#e2e3e2','#eeefee','#aeb2b3');faceR(g,u+.33,v+.015,v+.085,6,8,'#2f4a60');
      for(const t of[.05,.2,.29]){const p=P(u+t,v+.1,0);RC(g,p[0],p[1]-2,2,2,'#1e2023');}});
    return{P,hsh,RC,BL,BL2,lerp,fp,Q,flat,boxZ,faceL,faceR,clipPoly,ribsL,ribsR,pg,winL,winR,rowL,rowR,RX,hw,hx,ell,arcF,arcB,cyl,cone,revolve,scene,shadow,terrain,
      ship,cship,PT,pileShade,rowZ,coneZ,pile,stackRec,galU,galV,beltU,beltV,tower,shiploader,pathTrack,stadium,hopperU,hopperV,loco,siloBank,dome,radial,loader,dumper,
      MATS,pave,lineU,lineV,dashU,dashV,WAT,water,quayEdge,railLine,track,trackV,stalls,CPAL,cpick,REEF,ctrU,ctrV,blockU,blockV,sts,gantry,truck,car,mast,lamp,tree,bush,flatB,office,shed};
  };

  // 組裝：每類一個 K、每變體獨立畫布；DEV 映射只在迭代時使用
  const build=(k,W,H,AX,AY,SZ,layouts,nv)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null;
    for(let slot=0;slot<nv;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      S.run(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:o.fence!==false,gate:o.gate,smoke:o.smoke||[]});}};

  // ================= k174 大型貨櫃碼頭（5×5）=================
  try{
    const W=360,H=380,AX=180,AY=376,SZ=5;
    const K174=(L,K)=>{
      const {P,hsh,RC,BL,fp,Q,flat,boxZ,faceL,faceR,winL,winR,rowL,pave,lineU,lineV,dashU,dashV,water,quayEdge,railLine,track,trackV,stalls,ctrU,ctrV,blockU,blockV,sts,gantry,truck,car,mast,lamp,tree,bush,office,shed,cpick,REEF}=L;
      const bays=(u0,n,L0=.4,gap=.03)=>Array.from({length:n},(_,i)=>u0+i*(L0+gap));
      const ship=L.ship;
      const hatch=(S,u,v,n,d)=>S.o(d!=null?d:u+v+.4,(g)=>{for(let k=0;k<n;k++){boxZ(g,u,v,.44,.3,k*3,3,'#6d7d76','#7e8e87','#56645e');BL(g,P(u+.05,v+.3,k*3+1),P(u+.4,v+.3,k*3+1),'#5a6862');}});
      return [
        // v0 經典岸線：三座紅白岸橋＋靠泊大船（艏在西北露出斜切艏柱、甲板 bay 聚色、上層建築在後四分之一、舷梯落岸）；
        // 堆場由後往前三排（4→3→2 層遞減）、區塊之間是有標線的瀝青車道；RTG；冷凍櫃區（插電架）；閘口＋行政樓＋停車場
        (g,ng,S)=>{
          const vq=.56;
          water(g,0,0,SZ,vq,17401);
          pave(g,'q',0,vq,SZ,.96,17402);
          pave(g,'a',0,1.52,SZ,.22,17403);
          pave(g,'y',.3,1.74,SZ-.3,2.4,17404);
          pave(g,'a',.3,2.38,SZ-.3,.48,17431);pave(g,'a',.3,3.34,SZ-.3,.44,17432);pave(g,'a',2.54,1.74,.18,2.4,17433);pave(g,'a',.3,4.08,SZ-.3,.08,17434);
          pave(g,'a',0,1.74,.3,3.26,17405);pave(g,'a',.3,4.16,1.1,.84,17406);
          pave(g,'c',1.4,4.16,3.6,.84,17407);pave(g,'a',2.7,4.3,1.3,.62,17408);
          pave(g,'g',1.45,4.86,1.2,.14,17409);pave(g,'g',4.1,4.9,.9,.1,17410);
          quayEdge(g,vq,0,SZ,1);
          railLine(g,.68,0,SZ);railLine(g,1.18,0,SZ);
          lineU(g,.8,0,SZ,'#d9b440');lineU(g,1.06,0,SZ,'#d9b440');dashU(g,.93,0,SZ,'#f0eee6');
          lineU(g,1.52,0,SZ,'#e2ddcd');dashU(g,1.63,0,SZ,'#e8e2c8');
          // 堆場車道標線：RTG 車道白實線、行車道黃色虛線中線、區塊邊白線；南北向橫越車道
          for(const [a,b,c] of[[2.38,2.6,2.73],[3.34,3.56,3.67]]){lineU(g,a,.3,SZ,'#e6e2d6');lineU(g,b,.3,SZ,'#e6e2d6');dashU(g,c,.3,SZ,'#e3c04e',.14,.1);}
          lineU(g,2.86,.3,SZ,'#e6e2d6');lineU(g,3.78,.3,SZ,'#e6e2d6');lineU(g,1.74,.3,SZ,'#e6e2d6');
          lineV(g,2.54,1.74,4.08,'#e6e2d6');lineV(g,2.72,1.74,4.08,'#e6e2d6');dashV(g,2.63,1.76,4.06,'#e3c04e',.12,.1);
          lineV(g,.3,1.74,4.16,'#d9b440');dashV(g,.15,1.74,4.16,'#e8e2c8');
          for(const u of bays(.4,6))lineV(g,u-.015,3.78,4.08,'#d6d2c6');for(const u of bays(2.74,5))lineV(g,u-.015,3.78,4.08,'#d6d2c6');
          for(const u of[.55,.8,1.05,1.3])dashV(g,u,4.18,4.98,'#e8e2c8',.08,.06);
          stalls(g,2.75,4.36,1.2,8,.2);stalls(g,2.75,4.66,1.2,8,.2);
          L.shadow(g,[['b',.4,1.8,2.12,.57,16],['b',2.74,1.8,2.12,.57,15],['b',.4,2.88,2.12,.48,11],['b',2.74,2.88,1.84,.48,11],['b',.4,3.8,2.12,.29,6],['b',2.74,3.8,1.69,.29,6],
            ['b',1.65,4.2,.9,.52,24],['b',4.12,4.18,.76,.55,14]]);
          // 船與岸橋：船艏在西北（u0=.6，不出佔地），岸橋錯開，縫裡露出整齊的甲板 bay
          // 甲板 bay：船艏側兩個滿載 bay（岸橋外、整排看得到）、岸橋底下的作業 bay 較低、上層建築後一個 bay
          const SB=[{u:1.13,t:4,c:['#d2d1c9','#8e969a'],sp:2,step:1},{u:1.6,t:4,c:['#a5523d'],step:1},{u:2.07,t:1,c:['#4c6f95']},{u:2.54,t:4,c:['#4c6f95','#8e969a'],sp:2,step:1},
            {u:3.01,t:4,c:['#5b8765'],step:1},{u:3.48,t:2,c:['#a5523d','#d2d1c9'],sp:2},{u:4.3,t:3,c:['#8e969a'],step:1}];
          L.cship(S,.6,4.76,.05,.45,{vq,us:3.92,sw:.32,sh:20,fb:11,hull:'#6f8aa0',band:'#b8423a',seed:31,bays:SB,lines:[[.78,.2],[1.02,1.46],[4.42,4.4],[4.7,4.82]]});
          // 岸橋：主樑拉高到 66，陸側門框與機房都落在船頂之上；兩座作業（對準 bay 2.07／3.48，腿柱落在 bay 間的綁紮縫），
          // 第三座停在西北端泊位外、臂樑仰起（不遮船艏）
          const C1='#c4473a',HB=66;
          sts(S,.1,{vw:.68,vl:1.18,col:C1,hb:HB,hs:18,ah:28,tr:1.1,up:true});
          sts(S,2.06,{vw:.68,vl:1.18,col:C1,hb:HB,hs:18,ah:28,vt:.02,tr:.25,hsp:22,load:'#4c6f95'});
          sts(S,3.47,{vw:.68,vl:1.18,col:C1,hb:HB,hs:18,ah:28,vt:.02,tr:.93,hsp:13,load:'#a5523d'});
          truck(S,3.46,.9,true,'#d8d4c8',null);truck(S,1.3,.9,true,'#3f6a8e',null);truck(S,2.58,.9,true,'#c9a13e','#5b8765');truck(S,.66,.9,true,'#e0dcd0',null);
          hatch(S,4.06,.72,2);hatch(S,4.52,.74,1);
          truck(S,3.3,1.56,true,'#b54a3b','#5b8765');truck(S,1.0,1.56,true,'#e0dcd0','#4c6f95');
          // 堆場：每區 2–3 個褪色色相、按 bay 聚色；逐 bay 排序，讓 RTG 前腳正確壓在櫃列前
          const yard=(bs,v0,nr,hues,pat,tiers,o={})=>bs.forEach((u,i)=>S.o(u+.2+v0+nr*.0475,(g)=>blockU(g,[u],v0,nr,{w:.085,gv:.01,
            col:(a,j,t)=>{const h=pat[i%pat.length];return hsh(o.seed||7,i*13+j,t)<(o.odd||.05)?hues[(h+1)%hues.length]:hues[h];},
            tiers:(a,j)=>tiers(i,j),reefer:!!o.reefer,seam:true})));
          // 後排（貼岸、最高 3–4 層）
          yard(bays(.4,5),1.8,6,['#a5523d','#4c6f95','#8e969a'],[0,0,1,1,2],(i,j)=>[4,3,4,4,3][i]-(j===5&&i%2?1:0),{seed:41});
          yard(bays(2.74,5),1.8,6,['#5b8765','#d2d1c9','#b0714a'],[0,0,1,2,2],(i,j)=>[3,4,4,3,4][i]-(j===5&&i%2===0?1:0),{seed:42});
          gantry(S,'v',1.24,.3,1.76,2.6,26,{col:'#e0b03a',ehouse:true,lw:.06,gw:.065,gh:5,hsp:18,tr:2.49,load:null});
          gantry(S,'v',3.58,.3,1.76,2.6,26,{col:'#e0b03a',ehouse:true,lw:.06,gw:.065,gh:5,hsp:6,tr:2.49,load:'#bf7a3c'});
          truck(S,3.5,2.45,true,'#3f6a8e',null);truck(S,1.12,2.45,true,'#d8d4c8','#8e969a');
          // 中排（2–3 層）：西區藍＋青綠；東區冷凍櫃（白）＋插電架
          yard(bays(.4,5),2.88,5,['#6c92b2','#4d8682'],[0,1,1,0,0],(i,j)=>[3,2,3,3,2][i]-(j===4&&i===2?1:0),{seed:43});
          const rb=[2.74,3.22,3.7,4.18];
          yard(rb,2.88,5,[REEF,'#c4c8c6'],[0,0,0,0],(i,j)=>[3,2,3,2][i],{seed:44,reefer:true,odd:.12});
          rb.forEach(u=>S.t(u+.43+3.1,(g)=>{const uu=u+.43;for(let v=2.86;v<=3.36;v+=.1){BL(g,P(uu,v,0),P(uu,v,13),'#6f777c');}
            for(const z of[5,9,13]){BL(g,P(uu,2.86,z),P(uu,3.36,z),'#8e969b');BL(g,P(uu,2.86,z+1),P(uu,3.36,z+1),'#d8b23c');}}));
          gantry(S,'v',.82,.3,2.84,3.56,26,{col:'#e0b03a',ehouse:true,lw:.06,gw:.065,gh:5,hsp:20,tr:3.45});
          gantry(S,'v',3.95,.3,2.84,3.56,26,{col:'#e0b03a',ehouse:true,lw:.06,gw:.065,gh:5,hsp:16,tr:3.1,load:REEF});
          truck(S,.68,3.41,true,'#b54a3b',null);
          // 前排（1–2 層、留空位看得到格線）
          yard(bays(.4,5),3.8,3,['#8e969a','#82573f'],[0,1,1,0,0],(i,j)=>{const b=[2,1,2,1,1][i];return hsh(45,i,j)<.14?0:b;},{seed:45});
          yard(bays(2.74,4),3.8,3,['#bf7a3c','#d2d1c9'],[0,0,1,1],(i,j)=>{const b=[1,2,2,1][i];return hsh(46,i,j)<.14?0:b;},{seed:46});
          // 閘口：三車道雨棚＋崗亭；行政樓；停車場
          for(const u of[.66,.94,1.22])S.o(u+.05+4.6,(g,n)=>{boxZ(g,u-.04,4.5,.08,.16,0,8,'#e4e2dc','#f0eee8','#b8b5ad');winL(g,u-.035,4.66,3,2,3,'#3d5a72');if(n)winL(n,u-.035,4.66,3,2,3,'#ffe2a0');
            const b=P(u+.04,4.5,4);RC(g,b[0],b[1],1,1,'#c0392b');});
          truck(S,.4,4.2,false,'#b54a3b','#4c6f95',4.3+.5+.1);truck(S,.98,4.4,false,'#e0dcd0',null,1.02+4.9);
          S.o(1.4+4.76,(g,n)=>{for(const u of[.38,1.36])for(const v of[4.5,4.68]){boxZ(g,u-.015,v-.015,.03,.03,0,15,'#b9b7b0','#cfcdc6','#9c9a93');}
            boxZ(g,.33,4.44,1.09,.3,15,3,'#e9e7e1','#f3f2ee','#b8b5ad');faceL(g,4.74,.33,1.42,15,17,'#b8423a');
            for(const u of[.5,.8,1.1]){const p=P(u,4.74,15);RC(g,p[0],p[1],2,1,'#f2ecd0');if(n){RC(n,p[0],p[1],2,1,'#fff2cc');RC(n,p[0],p[1]+1,2,1,'rgba(255,236,180,.45)');}}});
          office(S,1.65,4.2,.9,.52,3,1741,{band:'#b8423a'});
          shed(S,4.12,4.18,.76,.55,12,5,1742,{doors:2});
          for(const [u,v,c] of[[2.8,4.4,'#b8433a'],[3.1,4.4,'#e8ecee'],[3.55,4.4,'#3d5f8a'],[2.95,4.7,'#c9cdd0'],[3.4,4.7,'#6f7b3a'],[3.85,4.7,'#e8ecee']])car(S,u,v,false,c);
          for(const [u,v,s,k] of[[1.55,4.92,.9,0],[2.0,4.93,.8,2],[2.5,4.92,.9,1],[4.2,4.95,.8,0],[4.6,4.95,.8,2]])tree(S,u,v,s,k);
          mast(S,.16,1.66,48);mast(S,2.63,1.66,48);mast(S,4.92,1.66,48);mast(S,2.63,3.62,48);mast(S,.16,3.62,48);mast(S,4.92,3.62,48);
          lamp(S,1.5,4.12);lamp(S,2.65,4.2);
          return{gate:[.06,.27]};
        },
        // v1 空泊位＋跨運車堆場：兩座藍色岸橋、泊位無船（拖船待命）、垂直岸線的單層櫃列＋跨運車、空櫃高堆區＋堆高機、維修棚
        (g,ng,S)=>{
          const vq=.56;
          water(g,0,0,SZ,vq,17411);
          pave(g,'q',0,vq,SZ,1.0,17412);
          pave(g,'a',0,1.56,SZ,.22,17413);
          pave(g,'y',0,1.78,3.3,2.2,17414);pave(g,'c',3.3,1.78,1.7,2.2,17415);
          pave(g,'a',0,3.98,SZ,.24,17416);pave(g,'c',0,4.22,SZ,.78,17417);pave(g,'a',2.9,4.22,1.3,.78,17418);
          quayEdge(g,vq,0,SZ,2);
          railLine(g,.7,0,SZ);railLine(g,1.2,0,SZ);lineU(g,.82,0,SZ,'#d9b440');lineU(g,1.08,0,SZ,'#d9b440');
          lineU(g,1.56,0,SZ,'#e2ddcd');dashU(g,1.67,0,SZ,'#e8e2c8');dashU(g,4.1,0,SZ,'#e8e2c8');
          for(let k=0;k<11;k++){const u=.2+k*.28;lineV(g,u-.02,1.84,3.9,'#e6e2d6');}
          for(const u of[3.0,3.3,3.6])dashV(g,u,4.24,4.98,'#e8e2c8',.08,.06);
          L.shadow(g,[['b',3.4,1.9,1.5,.9,20],['b',3.4,2.95,1.5,.9,22],['b',.3,4.3,1.3,.6,18],['b',1.8,4.35,.8,.5,17]]);
          // 拖船
          S.o(-9,(g,n)=>{const u=1.4,v=.18;fp(g,[P(u,v+.1,-1),P(u+.18,v+.2,-1),P(u+.6,v+.2,-1),P(u+.6,v,-1),P(u+.18,v,-1)],'#2a2d30');
            faceL(g,v+.2,u+.18,u+.6,-1,4,'#b8423a');fp(g,[P(u,v+.1,-1),P(u+.18,v+.2,-1),P(u+.18,v+.2,4),P(u-.02,v+.1,5)],'#c95246');faceR(g,u+.6,v,v+.2,-1,4,'#8a3029');
            fp(g,[P(u-.02,v+.1,5),P(u+.18,v,4),P(u+.6,v,4),P(u+.6,v+.2,4),P(u+.18,v+.2,4)],'#e3ddd0');
            boxZ(g,u+.22,v+.04,.2,.12,4,7,'#eceae4','#f4f2ee','#bdb9b1');winL(g,u+.24,v+.16,8,5,2,'#2f4a60');
            boxZ(g,u+.3,v+.07,.07,.06,11,6,'#e0b03a','#e9c04a','#b08a2a');RC(g,P(u+.33,v+.1,17)[0],P(u+.33,v+.1,17)[1]-1,1,1,'#2a2d30');
            if(n){const p=P(u+.24,v+.16,8);RC(n,p[0],p[1]-1,4,1,'#ffe3a0');}});
          const C2='#3d6fa6';
          sts(S,1.0,{vw:.7,vl:1.2,col:C2,tr:1.0,hsp:30});
          sts(S,2.6,{vw:.7,vl:1.2,col:C2,tr:.9,hsp:14,load:'#d2d1c9'});
          truck(S,2.4,.92,true,'#3f6a8e',null);
          hatch(S,3.8,.76,3);hatch(S,4.35,.8,2);hatch(S,.12,.76,2);
          truck(S,.5,1.6,true,'#b54a3b','#a5523d');truck(S,3.6,1.6,true,'#e0dcd0',null);
          // 垂直岸線的櫃列（沿 v 長向，1–2 層），列間是跨運車道
          const rows=Array.from({length:11},(_,k)=>.2+k*.28);
          S.o(1.6+2.9,(g)=>blockV(g,rows,[1.86,2.3,2.74,3.18],{seed:51,tmax:2,bh:()=>2,empty:.12}));
          const SC='#c8c9c4';
          for(const [k,v] of[[2,2.05],[5,2.7],[8,1.95],[9,3.2]]){const u=.2+k*.28;gantry(S,'u',v,.46,u-.07,u+.155,20,{col:'#cfd0cb',lw:.04,gw:.045,gh:3,cab:false,eng:false,brace:false,top:'#d0573a',dB:u-.07+v+.23,dF:u+.155+v+.48,hsp:k===5?8:null,tr:u+.04,load:k===5?'#4c6f95':null});}
          // 空櫃高堆（5 層、同一船公司顏色成塊）＋空櫃堆高機
          S.o(3.4+.9+2.4,(g)=>blockU(g,[3.4,3.84,4.28],1.9,9,{seed:52,tmax:6,tiers:(i,j)=>i===2&&j>6?2:5-(j%4===3?1:0)-(i===1&&j<3?1:0),col:(i,j,t)=>['#4c6f95','#a5523d','#8e969a'][i]}));
          S.o(3.4+.9+3.5,(g)=>blockU(g,[3.4,3.84,4.28],2.95,9,{seed:53,tmax:6,tiers:(i,j)=>i===0&&j<2?2:4+(j%3===0?1:0)-(i===2&&j>5?2:0),col:(i,j,t)=>['#5b8765','#d2d1c9','#bf7a3c'][i]}));
          const handler=(u,v,lift)=>S.o(u+v+.3,(g)=>{boxZ(g,u,v,.26,.12,2,6,'#d9a332','#e6b640','#a87c22');boxZ(g,u+.02,v+.02,.08,.08,8,5,'#dfe3e5','#eaedee','#aeb4b7');winL(g,u+.03,v+.1,9,3,3,'#3d5a72');
            const w1=P(u+.04,v+.12,0),w2=P(u+.2,v+.12,0);RC(g,w1[0],w1[1]-3,3,3,'#222528');RC(g,w2[0],w2[1]-3,3,3,'#222528');
            BL(g,P(u+.27,v+.02,1),P(u+.27,v+.02,26),'#4b5054');BL(g,P(u+.27,v+.1,1),P(u+.27,v+.1,26),'#6b7075');
            ctrV(g,u+.28,v-.14,.4,.085,lift,'#a5523d');boxZ(g,u+.28,v-.15,.09,.42,lift+4,1,'#e9c24a','#f1cf5c','#b8922d');});
          handler(3.05,2.4,14);handler(4.7,3.1,6);
          // 維修棚＋小辦公＋閘口
          shed(S,.3,4.3,1.3,.6,14,6,1751,{doors:3,wl:'#d6d0c2',wr:'#aaa294',rl:'#6f8a9a',rd:'#53697a'});
          office(S,1.8,4.35,.8,.5,2,1752,{wl:'#e6e2d6',band:'#3d6fa6'});
          for(const u of[3.25,3.55,3.85])S.o(u+4.6,(g,n)=>{boxZ(g,u-.04,4.42,.08,.14,0,8,'#e4e2dc','#f0eee8','#b8b5ad');winL(g,u-.035,4.56,3,2,3,'#3d5a72');if(n)winL(n,u-.035,4.56,3,2,3,'#ffe2a0');});
          truck(S,3.07,4.3,false,'#3f6a8e','#5b8765');truck(S,3.4,4.5,false,'#d8d4c8',null);
          for(const [u,v,c] of[[2.75,4.35,'#b8433a'],[2.75,4.6,'#e8ecee']])car(S,u,v,true,c);
          for(const [u,v,s,k] of[[1.75,4.93,.9,0],[2.3,4.93,.8,1],[4.35,4.4,.9,2],[4.7,4.6,.9,0],[4.5,4.88,.8,1]])tree(S,u,v,s,k);
          mast(S,.1,1.7,48);mast(S,1.6,1.72,48);mast(S,3.2,1.72,48);mast(S,4.9,1.72,48);mast(S,3.2,3.95,48);mast(S,.1,3.95,48);
          return{gate:[.6,.8]};
        },
        // v2 自動化碼頭＋碼頭鐵路：短泊位支線船、三座白色岸橋（一座臂樑仰起停機）、垂直岸線的自動堆場區塊＋軌道門吊、碼頭鐵路＋軌道門吊、閘口
        (g,ng,S)=>{
          const vq=.56;
          water(g,0,0,SZ,vq,17421);
          pave(g,'q',0,vq,SZ,1.0,17422);
          pave(g,'a',0,1.56,SZ,.24,17423);
          pave(g,'y',0,1.8,SZ,1.62,17424);
          pave(g,'k',0,3.42,SZ,.62,17425);
          pave(g,'a',0,4.04,SZ,.22,17426);pave(g,'c',0,4.26,SZ,.74,17427);pave(g,'a',.3,4.26,1.2,.74,17428);
          quayEdge(g,vq,0,SZ,3);
          railLine(g,.7,0,SZ);railLine(g,1.2,0,SZ);lineU(g,.82,0,SZ,'#d9b440');lineU(g,1.08,0,SZ,'#d9b440');
          lineU(g,1.56,0,SZ,'#e2ddcd');dashU(g,1.68,0,SZ,'#e8e2c8');dashU(g,4.15,0,SZ,'#e8e2c8');
          const bu=[.25,1.2,2.15,3.1,4.05];
          for(const u of bu){railLine(g,1.82,u-.1,u-.1);lineV(g,u-.09,1.8,3.4,'#6d6f70');lineV(g,u+.67,1.8,3.4,'#6d6f70');}
          track(g,3.56,0,SZ,1);track(g,3.8,0,SZ,2);
          for(const u of[.55,.85,1.15])dashV(g,u,4.28,4.98,'#e8e2c8',.08,.06);
          L.shadow(g,bu.map(u=>['b',u,1.86,.57,1.5,12]).concat([['b',2.0,4.35,.9,.5,24],['b',3.4,4.32,1.0,.55,13]]));
          ship(S,.3,3.2,.07,.45,{seed:33,hull:'#3a3f44',bow:.5,us:2.52,work:[0,2],band:'#2f6fa8'});
          const C3='#e3e1d9';
          sts(S,.7,{vw:.7,vl:1.2,col:C3,tr:.32,hsp:22,load:'#bf7a3c'});
          sts(S,1.85,{vw:.7,vl:1.2,col:C3,tr:.95,hsp:14,load:'#5b8765'});
          sts(S,3.75,{vw:.7,vl:1.2,col:C3,tr:1.1,up:true});
          truck(S,1.64,.92,true,'#d8d4c8',null);truck(S,3.0,.92,true,'#3f6a8e',null);
          truck(S,.4,1.62,true,'#e0dcd0','#8e969a');truck(S,2.6,1.62,true,'#b54a3b',null);
          // 自動堆場：五個沿 v 的區塊，各有一座軌道門吊（RMG）
          bu.forEach((u,i)=>{const rows=Array.from({length:6},(_,k)=>u+k*.095),bb=[1.88,2.32,2.76];const d=u+.3+2.6;
            const gv=[2.2,2.9,2.0,2.6,2.35][i];
            gantry(S,'u',gv,.24,u-.09,u+.67,30,{col:'#aebfcc',lw:.055,gw:.06,gh:5,ehouse:true,dB:d-.02,dF:d+.02,hsp:[24,null,20,null,26][i],tr:u+.3,load:[null,null,'#4c6f95',null,'#a5523d'][i],eng:false});
            S.o(d,(g)=>blockV(g,rows,bb,{seed:61+i,tmax:4,empty:.05}));});
          // 碼頭鐵路：平車＋貨櫃、機車、跨軌門吊
          const train=S.o(3.56+2.5,(g,n)=>{let u=.15;for(let k=0;k<6;k++){boxZ(g,u,3.555,.62,.08,2,2,'#5a5046','#6a5f54','#473f37');
              for(const t of[.05,.55]){const p=P(u+t,3.635,0);RC(g,p[0],p[1]-2,2,2,'#222528');}
              const c1=hsh(71,k,1),c2=hsh(71,k,2);if(c1>.18)ctrU(g,u+.01,3.555,.29,.08,4,cpick(c1),4);if(c2>.25)ctrU(g,u+.31,3.555,.29,.08,4,cpick(c2),4);u+=.64;}
            boxZ(g,u,3.55,.36,.09,2,8,'#3569a0','#4a7fb8','#2a5582');boxZ(g,u+.26,3.55,.1,.09,10,3,'#e0b03a','#e9c04a','#b08a2a');faceR(g,u+.36,3.56,3.63,5,8,'#2f4a60');
            if(n){const h=P(u+.36,3.57,4);RC(n,h[0],h[1],1,1,'#fff3c8');}});
          S.o(3.8+2.2,(g)=>{let u=1.2;for(let k=0;k<3;k++){boxZ(g,u,3.795,.62,.08,2,2,'#5a5046','#6a5f54','#473f37');const c1=hsh(72,k,1);ctrU(g,u+.01,3.795,.4,.08,4,cpick(c1),4);u+=.64;}});
          gantry(S,'v',2.1,.34,3.42,4.02,32,{col:'#e0b03a',ehouse:true,lw:.06,gw:.065,gh:5,hsp:14,tr:3.58,load:'#4d8682',dB:2.1+.17+3.42-.2,dF:2.44+4.02+.2});
          // 閘口、行政樓、檢查站
          for(const u of[.6,.9,1.2])S.o(u+.05+4.5,(g,n)=>{boxZ(g,u-.04,4.42,.08,.16,0,8,'#e4e2dc','#f0eee8','#b8b5ad');winL(g,u-.035,4.58,3,2,3,'#3d5a72');if(n)winL(n,u-.035,4.58,3,2,3,'#ffe2a0');});
          S.o(1.5+4.7,(g,n)=>{for(const u of[.34,1.46])for(const v of[4.38,4.62]){boxZ(g,u-.015,v-.015,.03,.03,0,15,'#b9b7b0','#cfcdc6','#9c9a93');}
            boxZ(g,.29,4.32,1.22,.34,15,3,'#e9e7e1','#f3f2ee','#b8b5ad');faceL(g,4.66,.29,1.51,15,17,'#2f6fa8');
            for(const u of[.45,.75,1.05,1.35]){const p=P(u,4.66,15);RC(g,p[0],p[1],2,1,'#f2ecd0');if(n){RC(n,p[0],p[1],2,1,'#fff2cc');RC(n,p[0],p[1]+1,2,1,'rgba(255,236,180,.45)');}}});
          truck(S,.62,4.3,false,'#3f6a8e','#a5523d',.7+4.5+.2);truck(S,1.2,4.5,false,'#d8d4c8',null,1.3+4.8+.2);
          office(S,2.0,4.35,.9,.5,3,1761,{band:'#2f6fa8',wl:'#eceae3'});
          shed(S,3.4,4.32,1.0,.55,11,4,1762,{doors:3,wl:'#dfe2e3',wr:'#aeb5b9'});
          for(const [u,v,s,k] of[[1.75,4.9,.9,0],[3.1,4.9,.8,2],[4.6,4.93,.9,1],[.15,4.9,.8,0]])tree(S,u,v,s,k);
          mast(S,.12,1.72,48);mast(S,2.0,1.74,48);mast(S,3.9,1.74,48);mast(S,.12,3.95,48);mast(S,4.9,3.95,48);
          return{gate:[.06,.29]};
        },
      ];
    };
    const lay=[0,1,2].map(i=>(g,ng,S,L,K)=>K174(L,K)[i](g,ng,S));
    build(174,W,H,AX,AY,SZ,lay,3);
  }catch(e){console.error('logi_b k174',e);errs.push('k174:'+(e&&e.stack||e));}

  // ================= k173 散裝貨運碼頭（4×4）=================
  try{
    const W=272,H=280,AX=136,AY=278,SZ=4;
    const K173=(L,K)=>{
      const {P,hsh,RC,BL,fp,Q,flat,boxZ,faceL,faceR,winL,rowL,pave,lineU,lineV,dashU,dashV,water,quayEdge,railLine,stalls,truck,car,mast,lamp,tree,bush,office,shed,
        ship,rowZ,coneZ,pile,stackRec,galU,galV,beltU,beltV,tower,shiploader,pathTrack,stadium,hopperU,hopperV,loco,siloBank,dome,radial,loader,dumper}=L;
      const substation=(S,u0,v0)=>S.o(u0+v0+.3,(g,n)=>{boxZ(g,u0,v0,.3,.24,0,2,'#b8b4aa','#c9c5bb','#a29e94');boxZ(g,u0+.04,v0+.05,.12,.12,2,9,'#6f7c80','#83908f','#5f6b70');
        for(let i=0;i<4;i++){const t=u0+.05+i*.025;BL(g,P(t,v0+.17,3),P(t,v0+.17,9),'#4f5a5f');}boxZ(g,u0+.19,v0+.06,.07,.1,2,7,'#9aa4a8','#b0b9bd','#838c90');});
      return [
        // v0 煤＋鐵礦砂雙長堆：堆取料機在兩堆之間、岸邊裝船機正在裝散貨船；轉運塔＋高架廊道沿 v 通岸；前方鐵路環線＋漏斗車＋翻車機房
        (g,ng,S)=>{
          const vq=.48;
          water(g,0,0,SZ,vq,17301);
          pave(g,'q',0,vq,SZ,.64,17302);
          pave(g,'k',0,1.12,SZ,1.92,17303);
          pave(g,'a',0,2.76,SZ,.24,17304);
          pave(g,'k',0,3.0,SZ,1.0,17305);pave(g,'c',3.05,3.05,.95,.95,17306);pave(g,'a',3.1,3.62,.9,.3,17307);
          quayEdge(g,vq,0,SZ,11,.46);railLine(g,.58,0,SZ);railLine(g,.88,0,SZ);lineU(g,.68,0,SZ,'#d9b440');
          flat(g,.2,1.1,3.2,.7,'#6a6660');flat(g,.2,2.03,1.62,.72,'#8f7262');flat(g,2.07,2.03,1.3,.72,'#a6a298');   // 料場底（煤污、礦粉、石粉）
          railLine(g,1.84,.1,3.45);railLine(g,2.0,.1,3.45);
          dashU(g,2.88,0,SZ,'#e8e2c8');
          const loop=stadium(.62,2.6,3.46,.28);pathTrack(g,loop);pathTrack(g,[[0,3.18],[.62,3.18]]);
          stalls(g,3.15,3.66,.8,5,.2);
          L.shadow(g,[['b',3.45,.9,.25,.22,26],['b',3.45,1.7,.25,.22,26],['b',1.22,3.62,.66,.3,14],['b',3.2,3.12,.6,.4,15]]);
          beltU(g,.2,3.45,1.0,4);beltU(g,.2,3.45,1.77,3);
          ship(S,.15,3.86,.06,.4,{cargo:'bulk',open:[1,2],gear:true,hull:'#2c2f33',hc:'#8b4a38',us:3.08,sh:26,fb:9,seed:7,band:'#d9a13a',load:'#2b2a29'});
          shiploader(S,1.45,.58,.88,{vt:.2,hs:13,col:'#3d6fa6'});
          tower(S,3.45,.9,.25,.22,28,{d:3.7+1.12});
          galV(S,3.575,1.12,1.7,17,17,{d:3.575+1.41});
          tower(S,3.45,1.7,.25,.22,28,{d:3.7+1.92});
          pile(S,'coal',.25,1.12,3.1,.66,rowZ(.25,1.12,3.1,.66,17,3,[1.55,1.95,2]),17311,2.6);
          stackRec(S,1.95,1.92,-1,{d:3.7,tipZ:8,L:.6});
          pile(S,'ore',.25,2.06,1.55,.66,rowZ(.25,2.06,1.55,.66,16,5),17312,4.3);
          pile(S,'grav',2.12,2.06,1.2,.66,rowZ(2.12,2.06,1.2,.66,15,8),17313,4.35);
          // 環線上的漏斗車列＋機車
          S.o(1.6+3.2,(g,n)=>{let u=.75;for(let k=0;k<5;k++){hopperU(g,u,3.135,.34,k%2?'#8d503b':'#2b2a29','#5d4c40');u+=.36;}loco(g,u,3.135,true,'#c9572f');if(n){const h=P(u+.34,3.15,4);RC(n,h[0],h[1],1,1,'#fff3c8');}});
          S.o(1.55+3.75+.2,(g,n)=>{hopperU(g,.75,3.695,.34,'#2b2a29','#5d4c40');});
          (()=>{const u0=1.25,v0=3.6,du=.66,dv=.3,h=14;S.o(u0+v0+.5,(g,n)=>{const wl='#c9c3b4',wr='#9f998c',u1=u0+du,v1=v0+dv;
            boxZ(g,u0,v0,du,dv,0,h,'#8c9397',wl,wr);L.ribsL(g,u0,u1,v1,0,h,SH(wl,-12),3);L.ribsR(g,u1,v0,v1,0,h,SH(wr,-12),3);flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#7b8286',h);
            const vm=3.745;faceR(g,u1,vm-.075,vm+.075,0,9,'#3a3632');rowL(g,n,u0+.04,u1-.04,v1,h-6,3,2,3,'#4d6f88',1731,.5);
            const lp=P(u1,vm+.075,11);RC(g,lp[0]-1,lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0]-1,lp[1],2,1,'#ffe6a0');});})();
          office(S,3.2,3.12,.6,.4,2,1732,{band:'#d9a13a',wl:'#e6e1d4'});
          substation(S,3.55,2.62);
          loader(S,.4,2.8,'#dca63a');dumper(S,2.6,2.8,'#c9572f','#2b2a29');
          for(const [u,v,c] of[[3.2,3.68,'#b8433a'],[3.52,3.68,'#e8ecee']])car(S,u,v,false,c);
          for(const [u,v,s,k] of[[.15,3.9,.8,0],[2.95,3.9,.8,2],[3.9,3.05,.8,1],[1.5,3.45,.7,0],[1.9,3.45,.7,2]])tree(S,u,v,s,k);
          mast(S,.1,1.0,40);mast(S,3.9,1.0,40);mast(S,.1,2.9,40);mast(S,3.9,2.9,40);lamp(S,2.95,3.1);
          return{gate:[.76,.9]};
        },
        // v1 雙圓頂倉＋三座錐形堆（砂石、砂、石灰石）：放射狀堆料機；廊道自岸邊沿 v 進場、在場中轉塔分叉；無船，裝船機臂架仰起；前方直線卸車線
        (g,ng,S)=>{
          const vq=.48;
          water(g,0,0,SZ,vq,17321);
          pave(g,'q',0,vq,SZ,.62,17322);
          pave(g,'k',0,1.1,SZ,2.5,17323);
          pave(g,'c',.15,1.15,1.35,2.3,17324);
          pave(g,'a',0,3.4,SZ,.2,17325);pave(g,'k',0,3.6,SZ,.4,17326);
          quayEdge(g,vq,0,SZ,12,.46);railLine(g,.58,0,SZ);railLine(g,.88,0,SZ);lineU(g,.68,0,SZ,'#d9b440');
          dashU(g,3.5,0,SZ,'#e8e2c8');
          pathTrack(g,[[0,3.76],[SZ,3.76]]);
          L.shadow(g,[['c',.82,1.72,.46,20],['c',.82,2.92,.42,18],['b',2.6,.92,.25,.22,24],['b',2.6,2.2,.25,.22,26]]);
          beltU(g,.3,2.6,1.0,4);
          shiploader(S,1.25,.58,.88,{up:true});
          // 岸邊待命：抓斗卸料漏斗（四腳＋斗口）與兩台作業車
          S.o(.45+.75+.2,(g)=>{const u0=.3,v0=.64,du=.3,dv=.26;for(const [u,v] of[[u0,v0],[u0+du,v0],[u0,v0+dv],[u0+du,v0+dv]]){boxZ(g,u-.02,v-.02,.04,.04,0,12,'#9aa3a8','#9aa3a8','#6a7378');}
            fp(g,[P(u0-.03,v0-.03,22),P(u0+du+.03,v0-.03,22),P(u0+du+.03,v0+dv+.03,22),P(u0-.03,v0+dv+.03,22)],'#3a3632');
            fp(g,[P(u0-.03,v0+dv+.03,22),P(u0+du+.03,v0+dv+.03,22),P(u0+du*.6,v0+dv*.6,12),P(u0+du*.4,v0+dv*.6,12)],'#d7a43a');
            fp(g,[P(u0+du+.03,v0-.03,22),P(u0+du+.03,v0+dv+.03,22),P(u0+du*.6,v0+dv*.6,12),P(u0+du*.6,v0+dv*.4,12)],'#a57a22');
            boxZ(g,u0+du*.4,v0+dv*.4,du*.2,dv*.2,8,4,'#6d7478','#80878b','#565c60');});
          loader(S,2.0,.72,'#dca63a');dumper(S,3.1,.66,'#c9572f',null);
          tower(S,2.6,.9,.25,.22,24,{d:2.85+1.12});
          galV(S,2.725,1.12,2.2,16,18,{d:2.725+1.66});
          tower(S,2.6,2.2,.25,.22,26,{d:2.85+2.42});
          dome(S,.82,1.72,.46,{d:.82+1.72});
          dome(S,.82,2.92,.42,{d:.82+2.92});
          galU(S,.82,2.6,2.31,20,20,{d:.82+2.6+.2,first:.3});
          galV(S,.82,1.9,2.26,22,20,{d:.82+2.08});
          galV(S,.82,2.36,2.62,20,20,{d:.82+2.62,w:.09});
          pile(S,'grav',2.95,1.2,.9,.9,coneZ(3.4,1.65,.44,22),17331,3.4+1.65);
          radial(S,2.85,2.2,3.4,1.7,24,{d:3.4+1.7+.3});
          pile(S,'sand',2.95,2.62,.9,.9,coneZ(3.4,3.05,.42,21),17332,3.4+3.05);
          radial(S,2.85,2.42,3.36,3.0,23,{d:3.4+3.05+.3});
          pile(S,'lime',1.7,2.62,.8,.8,coneZ(2.1,3.0,.36,18),17333,2.1+3.0);
          loader(S,2.2,1.4,'#dca63a');dumper(S,1.8,1.55,'#c9572f','#b6b2a9');dumper(S,1.5,3.45,'#3d6fa6','#c6ad79');
          S.o(1.8+3.76,(g,n)=>{let u=.2;for(let k=0;k<6;k++){hopperU(g,u,3.715,.34,k%3===2?'#b6b2a9':'#c6ad79','#6a5a4a');u+=.36;}loco(g,u,3.715,true,'#3d6fa6');});
          (()=>{const u0=2.75,v0=3.62,du=.6,dv=.3,h=13;S.o(u0+v0+.5,(g,n)=>{const wl='#d4cfbf',wr='#a8a293',u1=u0+du,v1=v0+dv;
            boxZ(g,u0,v0,du,dv,0,h,'#7f878b',wl,wr);L.ribsL(g,u0,u1,v1,0,h,SH(wl,-12),3);L.ribsR(g,u1,v0,v1,0,h,SH(wr,-12),3);flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#6f777b',h);
            faceR(g,u1,3.685,3.835,0,9,'#3a3632');rowL(g,n,u0+.04,u1-.04,v1,h-6,3,2,3,'#4d6f88',1735,.5);});})();
          office(S,3.3,1.18,.55,.4,2,1736,{band:'#3d6fa6',wl:'#e6e1d4'});
          substation(S,3.55,2.3);
          for(const [u,v,s,k] of[[.2,3.35,.8,0],[1.2,3.3,.8,2],[3.9,1.25,.8,1],[3.9,3.3,.8,0]])tree(S,u,v,s,k);
          mast(S,.1,1.0,40);mast(S,2.3,1.0,40);mast(S,3.9,1.0,40);mast(S,.1,3.35,40);mast(S,2.3,3.35,40);
          return{gate:[.34,.48]};
        },
        // v2 混凝土筒倉群＋垂直岸線的礦石長堆（軌道沿 v 的堆取料機）；斜升廊道從筒倉頂直下岸邊；前方氣球形環線＋漏斗車；小型散貨船
        (g,ng,S)=>{
          const vq=.48;
          water(g,0,0,SZ,vq,17341);
          pave(g,'q',0,vq,SZ,.64,17342);
          pave(g,'c',0,1.12,1.95,1.2,17343);
          pave(g,'k',1.95,1.12,2.05,2.0,17344);
          pave(g,'a',0,2.32,1.95,.2,17345);pave(g,'k',0,2.52,1.95,1.48,17346);pave(g,'c',1.95,3.12,2.05,.88,17347);pave(g,'a',2.95,3.12,1.05,.36,17348);
          quayEdge(g,vq,0,SZ,13,.46);railLine(g,.58,0,SZ);railLine(g,.88,0,SZ);lineU(g,.68,0,SZ,'#d9b440');
          flat(g,2.08,1.2,.66,1.82,'#8d6a58');flat(g,3.2,1.2,.66,1.82,'#9e9a92');
          railLine(g,2.87,1.14,3.1);lineV(g,2.87,1.14,3.1,'#6d6f70');lineV(g,3.03,1.14,3.1,'#6d6f70');
          dashU(g,2.42,0,1.95,'#e8e2c8');
          const loop=stadium(.7,1.25,3.2,.38);pathTrack(g,loop);pathTrack(g,[[1.25,3.58],[SZ,3.58]]);
          stalls(g,3.02,3.14,.84,5,.2);
          L.shadow(g,[['b',.2,1.5,1.4,.7,44],['b',1.5,.9,.25,.22,24],['b',2.83,.88,.25,.22,24],['b',2.25,3.02,.6,.35,20]]);
          beltU(g,.2,2.83,1.0,4);beltV(g,2.95,1.1,3.05,3);
          ship(S,1.0,3.86,.06,.4,{cargo:'bulk',open:[0],gear:false,hull:'#2e4a3c',hc:'#4f6f84',us:3.14,sh:24,fb:8,bow:.5,seed:9,band:'#e2e2dc',load:'#b6b2a9',hl:.3});
          shiploader(S,1.9,.58,.88,{vt:.2,hs:12,col:'#d0573a'});
          tower(S,1.5,.9,.25,.22,24,{d:1.75+1.12});
          siloBank(S,.2,1.5,4,2,.17,40,{d:1.56+1.84,eh:14});
          galV(S,1.62,1.12,1.72,20,40,{d:1.62+1.42,sp:.3});
          tower(S,2.83,.88,.25,.22,24,{d:3.08+1.1});
          pile(S,'ore',2.1,1.2,.62,1.84,rowZ(2.1,1.2,.62,1.84,20,4,[.9,1.2,2]),17351,2.4+2.1);
          stackRec(S,2.25,2.95,-1,{ax:'v',d:2.95+2.25+.2,tipZ:8,L:.56});
          pile(S,'lime',3.22,1.2,.64,1.84,rowZ(3.22,1.2,.64,1.84,20,6),17352,3.55+2.12);
          S.o(1.0+3.58+.1,(g,n)=>{let u=1.35;loco(g,u,3.535,true,'#d0573a');u+=.36;for(let k=0;k<5;k++){hopperU(g,u,3.535,.34,k%2?'#8d503b':'#b6b2a9','#6a5a4a');u+=.36;}});
          S.o(.9+2.82,(g)=>{for(let k=0;k<3;k++)hopperV(g,.285,2.9+k*.36,.34,'#8d503b','#5d4c40');});
          (()=>{const u0=.1,v0=3.05,du=.3,dv=.62,h=13;S.o(u0+v0+.6,(g,n)=>{const wl='#cfc9ba',wr='#a39d8f',u1=u0+du,v1=v0+dv;
            boxZ(g,u0,v0,du,dv,0,h,'#7f878b',wl,wr);L.ribsL(g,u0,u1,v1,0,h,SH(wl,-12),3);L.ribsR(g,u1,v0,v1,0,h,SH(wr,-12),3);flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#6f777b',h);
            faceL(g,v1,.27,.43,0,9,'#3a3632');L.rowR(g,n,u1,v0+.04,v1-.04,h-6,3,2,3,'#4d6f88',1737,.5);});})();
          office(S,2.25,3.02,.6,.35,2,1738,{band:'#d0573a',wl:'#e6e1d4'});
          substation(S,1.62,2.62);
          loader(S,1.2,2.62,'#dca63a');dumper(S,.6,2.37,'#3d6fa6','#b6b2a9');
          for(const [u,v,c] of[[3.08,3.17,'#b8433a'],[3.42,3.17,'#e8ecee'],[3.6,3.17,'#3d5f8a']])car(S,u,v,false,c);
          for(const [u,v,s,k] of[[3.5,3.85,.8,0],[3.9,3.3,.8,2],[1.6,3.85,.8,1],[2.05,3.85,.7,0]])tree(S,u,v,s,k);
          mast(S,.1,1.0,40);mast(S,3.9,1.0,40);mast(S,1.9,2.4,40);mast(S,3.9,3.05,40);
          return{gate:[.55,.7]};
        },
      ];
    };
    const lay=[0,1,2].map(i=>(g,ng,S,L,K)=>K173(L,K)[i](g,ng,S));
    build(173,W,H,AX,AY,SZ,lay,3);
  }catch(e){console.error('logi_b k173',e);errs.push('k173:'+(e&&e.stack||e));}

  if(errs.length)window.__logi_b_errs=errs;
  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
