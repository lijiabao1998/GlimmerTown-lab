// T612 trans_b：k114 國際機場（5×5，畫布 328×300，錨 164,298）／k19 機場（4×4，畫布 272×300，錨 136,298）實驗線重畫。
// 分層合成（沿用 logi_a／logi_b）：地坪（草坪、鋪面、跑道與滑行道標線、地面燈具）直接畫在地面層；立體件各自一層二值化＋深色外框，
// 依深度由後往前疊；描邊與二值化只掃該件的包圍盒（開機成本壓低）。任意朝向的稜柱 prism 依面法線打光——飛機、弧形航廈、登機橋、塔台都用它。
// 光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh。夜圖只點白天畫出的燈具（跑道邊燈／入口燈、滑行道藍燈、塔台玻璃、窗、高桿燈、航燈）。
(window.__variants574=window.__variants574||[]).push(function trans_b(A){
  // 注入測試時本批次排在內嵌 b01（會蓋掉 114/19 的 _1_1、_1_2）之前 ⇒ 不是最後一棒就把本體排到隊尾再跑（同 bay_a）；正式整合接在最後則直接執行
  const QL=window.__variants574||[];
  if(!trans_b.__late&&QL.indexOf(trans_b)>=0&&QL.indexOf(trans_b)<QL.length-1){trans_b.__late=1;QL.push(function trans_b_late(A2){trans_b(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{114:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位；定稿必須是 {}
  const DEV_THROW=false;  // 迭代用：分類出錯時在批次尾拋出；定稿為 false（錯誤仍記在 window.__trans_b_errs）
  const errs=[];
  const DIM={114:[328,300,164,298,5],19:[272,300,136,298,4]};

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,hsh}=K;
    let BB=null;
    const bb=(x0,y0,x1,y1)=>{if(!BB)return;if(x0<BB[0])BB[0]=x0;if(y0<BB[1])BB[1]=y0;if(x1>BB[2])BB[2]=x1;if(y1>BB[3])BB[3]=y1;};
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;x=rnd(x);y=rnd(y);g.fillStyle=c;g.fillRect(x,y,w,h);bb(x,y,x+w,y+h);};
    const BL=(g,a,b,c,ok)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);bb(Math.min(x0,x1),Math.min(y0,y1),Math.max(x0,x1)+1,Math.max(y0,y1)+1);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){if(!ok||ok(x0,y0))g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    // 像素精準多邊形：掃描線取像素中心（無抗鋸齒、相鄰面不留縫）
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
      fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const clipPoly=(g,pts,fn)=>{g.save();g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.clip();fn();g.restore();};
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const pg=(g,x0,y0,w,h,s,c)=>{x0=rnd(x0);y0=rnd(y0);g.fillStyle=c;let ya=1e9,yb=-1e9;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(x0+i,y0+o,1,h);if(y0+o<ya)ya=y0+o;if(y0+o+h>yb)yb=y0+o+h;}bb(x0,ya,x0+w,yb);};
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
    const RX=r=>Math.max(1,rnd(r*45.25));
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);RC(g,cx-w,cy+y,2*w+1,1,c);}};
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=hx(rx,ry,x);RC(g,cx+x,cy-h,1,h+yb+1,c);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h];};
    // 顏色混合／依法線打光（光從左：法線朝 (-u,+v) 最亮）
    const h2r=c=>{const n=parseInt(c.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
    const mixC=(a,b,t)=>{const x=h2r(a),y=h2r(b),r=[0,1,2].map(i=>Math.max(0,Math.min(255,rnd(x[i]+(y[i]-x[i])*t))));return '#'+((r[0]<<16)|(r[1]<<8)|r[2]).toString(16).padStart(6,'0');};
    const litT=(nu,nv)=>{const l=Math.hypot(nu,nv)||1,d=(nv-nu)/(l*Math.SQRT2);return Math.max(0,Math.min(1,(d+.7071)/1.4142));};
    const faceC=(nu,nv,Lc,Rc,qz=4)=>mixC(Rc,Lc,Math.round(litT(nu,nv)*qz)/qz);
    // 任意凸多邊形稜柱：pts＝uv 頂點；只畫朝鏡頭的側面（法線·(1,1)>0）＋頂面
    const prismZ=(g,pts,zb,zt,top,Lc,Rc,qz)=>{const n=pts.length;let ar=0;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];ar+=a[0]*b[1]-b[0]*a[1];}const s=ar>0?1:-1;
      for(let i=0;i<n;i++){const j=(i+1)%n,a=pts[i],b=pts[j],eu=b[0]-a[0],ev=b[1]-a[1],nu=s*ev,nv=-s*eu;if(nu+nv<=1e-9)continue;
        fp(g,[P(a[0],a[1],zb[i]),P(b[0],b[1],zb[j]),P(b[0],b[1],zt[j]),P(a[0],a[1],zt[i])],faceC(nu,nv,Lc,Rc,qz));}
      if(top)fp(g,pts.map((p,i)=>P(p[0],p[1],zt[i])),top);};
    const prism=(g,pts,z0,h,top,Lc,Rc,qz)=>prismZ(g,pts,pts.map(()=>z0),pts.map(()=>z0+h),top,Lc,Rc,qz);
    const frame=(cu,cv,a)=>{const c=Math.cos(a),s=Math.sin(a);return(x,y)=>[cu+x*c-y*s,cv+x*s+y*c];};
    const rectPts=(cu,cv,a,len,wid)=>{const T=frame(cu,cv,a);return[T(len/2,wid/2),T(-len/2,wid/2),T(-len/2,-wid/2),T(len/2,-wid/2)];};
    const obox=(g,cu,cv,a,len,wid,z0,h,top,Lc,Rc)=>prism(g,rectPts(cu,cv,a,len,wid),z0,h,top,Lc,Rc);
    const polyC=(cu,cv,r,n,ph=0)=>Array.from({length:n},(_,i)=>{const a=ph+i*2*Math.PI/n;return[cu+r*Math.cos(a),cv+r*Math.sin(a)];});

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
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h] 細桿／['pz',[[u,v,z],..]] 懸空多邊形／['pr',pts,h,z] 多邊形稜柱／['c',u,v,r,h] 圓柱
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const sp=(u,v,z)=>{const k=z/64;return P(u+k,v-k*.45);};
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,u1=u0+du,v1=v0+dv,c4=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];const A0=c4.map(q=>sp(q[0],q[1],z)),A1=c4.map(q=>sp(q[0],q[1],z+h));
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='pr'){const[,pts,h,z=0]=s,n=pts.length,A0=pts.map(q=>sp(q[0],q[1],z)),A1=pts.map(q=>sp(q[0],q[1],z+h));
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<n;i++)fp(sx,[A0[i],A0[(i+1)%n],A1[(i+1)%n],A1[i]],C);}
        else if(s[0]==='pz'){fp(sx,s[1].map(q=>sp(q[0],q[1],q[2])),C);}
        else if(s[0]==='p'){const[,u,v,h]=s;BL(sx,P(u,v),sp(u,v,h),C);}
        else if(s[0]==='c'){const[,u,v,r,h]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      c:{t:['#c3c0b7','#bdbab1','#c9c6bd'],j:'#b1aea5',s:.25,p:.6},      // 機坪混凝土版
      a:{t:['#6d6c68','#686763','#72716c'],j:null,s:.125,p:.7},          // 瀝青
      k:{t:['#a39e92','#9c978b','#aba69a'],j:null,s:.0625,p:.5},         // 碎石
      p:{t:['#d3cfc4','#cdc9be','#d9d5ca'],j:'#c2beb3',s:.125,p:.6},     // 人行鋪面
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*12);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62615d':'#787772');}}
      if(m==='c'){for(let i=0;i<rnd(du*dv*3);i++){const p=P(u0+.05+hsh(seed,i,41)*(du-.1),v0+.05+hsh(seed,i,42)*(dv-.1));RC(g,p[0]-1,p[1],3,1,SH(M.t[0],-14));}}
      if(m==='k'){for(let i=0;i<rnd(du*dv*50);i++){const p=P(u0+hsh(seed,i,51)*du,v0+hsh(seed,i,52)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,53)<.5?'#8f8a7e':'#bab5a8');}}};
    // 草坪：沿跑道方向割草條紋（兩綠交替）＋稀疏草叢
    const grass=(g,u0,v0,du,dv,seed,ax='u')=>{flat(g,u0,v0,du,dv,'#77a454');const st=.25;
      if(ax==='v'){for(let i=0,a=u0;a<u0+du-1e-6;a+=st,i++)if(i%2)flat(g,a,v0,Math.min(st,u0+du-a),dv,'#71a050');}
      else{for(let i=0,b=v0;b<v0+dv-1e-6;b+=st,i++)if(i%2)flat(g,u0,b,du,Math.min(st,v0+dv-b),'#71a050');}
      for(let i=0;i<rnd(du*dv*5);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#62904a':'#8dba66');}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const WHT='#e9e7df',YEL='#dcb641',RED='#b8463c';
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const stain=(g,u,v,r)=>{const p=P(u,v);ell(g,p[0],p[1],r,Math.max(1,r>>1),'rgba(60,58,52,.16)');};

    // ---------- 跑道／滑行道 ----------
    const DIG={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],
      5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','001','001','001'],8:['111','101','111','101','111'],9:['111','101','111','001','111'],
      L:['100','100','100','100','111'],R:['110','101','110','101','101'],C:['111','100','100','100','111']};
    const S16=1/16;
    // 跑道：ax＝長軸；橫向 [c0,c1]、縱向 [a0,a1]；o.nums＝[低端號,高端號]；o.let＝[低端字母,高端字母]；o.bp＝端部防噴區；o.k＝標線尺度
    const runway=(g,ng,ax,c0,c1,a0,a1,o={})=>{
      const pt=(a,c)=>ax==='u'?P(a,c):P(c,a);
      const RQ=(A0,A1,C0,C1,col)=>fp(g,[pt(A0,C0),pt(A1,C0),pt(A1,C1),pt(A0,C1)],col);
      const LA=(c,A0,A1,col)=>BL(g,pt(A0,c),pt(A1,c),col);
      const LC=(a,C0,C1,col)=>BL(g,pt(a,C0),pt(a,C1),col);
      const sh=o.sh!=null?o.sh:.04,e0=c0+sh,e1=c1-sh,cm=(c0+c1)/2,bp=o.bp!=null?o.bp:.2,sk=o.k||1,st=o.st||.125;
      // 鋪面：淺色路肩＋深色瀝青；中央一條略深的輪跡帶（不灑雜點）
      RQ(a0,a1,c0,c1,'#8b8981');RQ(a0,a1,e0,e1,'#5d5c59');RQ(a0+bp+.3,a1-bp-.3,cm-.07,cm+.07,'#585754');
      // 防噴區＋黃色人字
      RQ(a0,a0+bp,e0,e1,'#72706a');RQ(a1-bp,a1,e0,e1,'#72706a');
      for(const[A,dir]of[[a0,1],[a1,-1]])for(let k=0;k<2;k++){const at=A+dir*(.03+k*.075);BL(g,pt(at+dir*.06,cm),pt(at,e0+.03),YEL);BL(g,pt(at+dir*.06,cm),pt(at,e1-.03),YEL);}
      LA(e0+.01,a0+bp,a1-bp,WHT);LA(e1-.01,a0+bp,a1-bp,WHT);
      // 跑道號：3×5 點陣，橫向每格 1/16、縱向每格 st；字頂朝進場方向
      const txt=(A,dir,s)=>{const hv=ax==='u'?[dir,0]:[0,dir],rv=[-hv[1],hv[0]],rs=ax==='u'?rv[1]:rv[0];
        const ch=s.split(''),wd=ch.length*3+(ch.length-1);
        ch.forEach((c,ci)=>{const bm=DIG[c];if(!bm)return;for(let r=0;r<5;r++)for(let cc=0;cc<3;cc++){if(bm[r][cc]!=='1')continue;
          const col=ci*4+cc,lat=cm+rs*(col-(wd-1)/2)*S16,al=A+dir*(4-r)*st;BL(g,pt(al,lat),pt(al+dir*st*.85,lat),WHT);}});};
      const nums=o.nums||['09','27'],lets=o.let||['',''],nEnd=.24*sk+.1+(lets[0]?6*st:0)+5*st;
      [[a0+bp,1,0],[a1-bp,-1,1]].forEach(([A,dir,e])=>{
        LC(A+dir*.012,e0+.01,e1-.01,WHT);
        // 入口斑馬線（琴鍵）：兩格白一格空，中線兩側各一組
        for(let c=e0+.04,ix=0;c<=e1-.04+1e-6;c+=S16,ix++){if(Math.abs(c-cm)<.04)continue;if(ix%3===2)continue;LA(c,A+dir*.05,A+dir*.24*sk,WHT);}
        let at=A+dir*(.24*sk+.1);
        if(lets[e]){txt(at,dir,lets[e]);at+=dir*6*st;}
        txt(at,dir,nums[e]);
        // 瞄準點（中線兩側各一條粗帶）＋一組觸地區標線（距入口的絕對距離）
        const ap=nEnd+.14;
        for(const s of[-1,1]){for(let k=0;k<3;k++)LA(cm+s*(.08+k*S16),A+dir*ap,A+dir*(ap+.26*sk),WHT);}
        if(o.tdz!==false)for(const s of[-1,1])for(let k=0;k<2;k++)LA(cm+s*(.08+k*2*S16),A+dir*(ap+.5*sk),A+dir*(ap+.5*sk+.1),WHT);
        // 入口燈（綠）／終端燈（紅）交錯
        for(let c=e0,ix=0;c<=e1+1e-6;c+=S16*1.5,ix++){const p=pt(A-dir*.03,c);RC(g,p[0],p[1],1,1,ix%2?'#8a5a50':'#5c8a64');RC(ng,p[0],p[1],1,1,ix%2?'#ff5a44':'#78ff96');}});
      const cs=a0+bp+nEnd+.08,ce=a1-bp-nEnd-.08;
      for(let a=cs;a<ce-.04;a+=.22)LA(cm,a,Math.min(ce,a+.13),WHT);
      // 邊燈：每 .25 一盞（白天淺色燈座、夜裡暖白）
      for(let a=a0+bp;a<=a1-bp+1e-6;a+=.25)for(const c of[c0+.016,c1-.016]){const p=pt(a,c);RC(g,p[0],p[1]-1,1,1,'#ece6cc');RC(ng,p[0],p[1]-1,1,1,'#fff3c4');}
    };
    // 滑行道：黃色中線、淺色路肩、藍色邊燈
    const taxiway=(g,ng,ax,c0,c1,a0,a1,o={})=>{const pt=(a,c)=>ax==='u'?P(a,c):P(c,a);
      fp(g,[pt(a0,c0),pt(a1,c0),pt(a1,c1),pt(a0,c1)],'#84827b');
      fp(g,[pt(a0,c0+.025),pt(a1,c0+.025),pt(a1,c1-.025),pt(a0,c1-.025)],'#686763');
      if(o.cl!==false)BL(g,pt(a0,(c0+c1)/2),pt(a1,(c0+c1)/2),YEL);
      if(o.lights!==false)for(let a=a0+.12;a<=a1-.05;a+=.25)for(const c of[c0+.01,c1-.01]){if(o.skip&&o.skip(a,c))continue;const p=pt(a,c);RC(g,p[0],p[1]-1,1,1,'#6f8fb8');RC(ng,p[0],p[1]-1,1,1,'#6aa8ff');}};
    // 等待位置標線（跨滑行道：兩實兩虛），a＝沿滑行道位置、dir＝朝跑道方向
    const holdLine=(g,ax,c0,c1,a,dir)=>{const pt=(A,c)=>ax==='u'?P(A,c):P(c,A);
      BL(g,pt(a,c0+.03),pt(a,c1-.03),YEL);BL(g,pt(a+dir*S16,c0+.03),pt(a+dir*S16,c1-.03),YEL);
      for(const k of[2.2,3.2]){for(let c=c0+.03;c<c1-.04;c+=.06)BL(g,pt(a+dir*S16*k,c),pt(a+dir*S16*k,Math.min(c1-.03,c+.03)),YEL);}};
    // 滑行道指示牌（黃底黑字小牌）
    const tsign=(S,u,v,d)=>S.o(d!=null?d:u+v,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-2,y-4,5,3,'#e2bf3f');RC(g,x-1,y-3,1,1,'#2a2a28');RC(g,x+1,y-3,1,1,'#2a2a28');RC(g,x-2,y-1,1,1,'#555');RC(g,x+2,y-1,1,1,'#555');});

    // ---------- 飛機 ----------
    // 幾何：cu,cv＝機身中心、a＝機頭朝向（uv 平面角）；kind：'jet' 低單翼雙發｜'prop' 上單翼渦槳（T 尾）
    // 尺寸：窄體 len .82／span .76；廣體 len 1.0／span .94（高度比例：尾翼頂≈航廈屋簷的七成）
    const planeGeo=(cu,cv,a,o={})=>{const kind=o.kind||'jet',wide=!!o.wide,L=o.len||(kind==='prop'?.5:wide?1.0:.82),Wf=o.w||(kind==='prop'?.07:wide?.12:.1),sp=o.span||(kind==='prop'?.6:wide?.94:.76),
        fz=o.fz!=null?o.fz:1,fh=o.fh||(kind==='prop'?3:wide?5:4),fin=o.fin||(kind==='prop'?5:wide?10:8),k=L/.66,kw=Wf/.08;
      const T=frame(cu,cv,a),zt=fz+fh,G={T,L,Wf,sp,fz,fh,zt,fin,kind,a,cu,cv,k,wide};
      G.near=(Math.cos(a)-Math.sin(a))>0?1:-1;
      G.fus=[[L/2,0],[L/2-.025*k,Wf*.32],[L/2-.07*k,Wf/2],[-L/2+.13*k,Wf/2],[-L/2+.035*k,Wf*.2],[-L/2,0],[-L/2+.035*k,-Wf*.2],[-L/2+.13*k,-Wf/2],[L/2-.07*k,-Wf/2],[L/2-.025*k,-Wf*.32]].map(p=>T(p[0],p[1]));
      if(kind==='prop'){
        G.wing=s=>[T(.07*k,s*Wf*.3),T(.055*k,s*sp/2),T(-.02*k,s*sp/2),T(-.04*k,s*Wf*.3)];G.wz=zt-.5;
        G.eng=s=>{const y=s*sp*.22;return[T(.16*k,y+.022*kw),T(-.03*k,y+.022*kw),T(-.03*k,y-.022*kw),T(.16*k,y-.022*kw)];};G.ez=zt-2;G.eh=2;
        G.hs=s=>[T(-L/2+.09*k,0),T(-L/2+.045*k,s*sp*.2),T(-L/2+.005*k,s*sp*.2),T(-L/2+.01*k,0)];G.hz=zt+fin-1;G.tt=1;
        G.prop=s=>{const y=s*sp*.22;return[T(.165*k,y-.07),T(.165*k,y+.07)];};G.ey=sp*.22;G.ex=.16*k;
      }else{
        G.wing=s=>[T(.08*k,s*Wf*.4),T(-.09*k,s*sp/2),T(-.145*k,s*sp/2),T(-.12*k,s*Wf*.4)];G.wz=fz;
        G.eng=s=>{const y=s*sp*.24;return[T(.105*k,y+.026*kw),T(.015*k,y+.026*kw),T(.015*k,y-.026*kw),T(.105*k,y-.026*kw)];};G.ez=.3;G.eh=wide?2.4:1.8;G.ey=sp*.24;G.ex=.1*k;
        G.hs=s=>[T(-L/2+.13*k,s*Wf*.35),T(-L/2+.04*k,s*sp*.2),T(-L/2+.005*k,s*sp*.2),T(-L/2+.045*k,s*Wf*.35)];G.hz=zt-1.2;G.tt=0;}
      G.finP=[[-L/2+.15*k,zt],[-L/2+.035*k,zt+fin],[-L/2-.005*k,zt+fin],[-L/2+.015*k,zt]];
      G.door=(s)=>T(L/2-.13*k,s*Wf/2);
      return G;};
    const planeSh=(G)=>{const{T,fz,fh,zt,finP}=G,out=[['pz',G.fus.map(p=>[p[0],p[1],fz+fh*.5])]];
      for(const s of[-1,1]){out.push(['pz',G.wing(s).map(p=>[p[0],p[1],G.wz])],['pz',G.hs(s).map(p=>[p[0],p[1],G.hz])]);}
      out.push(['pz',finP.map(([x,z])=>{const p=T(x,0);return[p[0],p[1],z];})]);return out;};
    const planeDraw=(g,n,G,o={})=>{const{T,L,Wf,sp,fz,fh,zt,fin,near,k}=G,liv=o.liv||'#c8413a',tail=o.tail||liv,far=-near;
      const WC=['#dadfe2','#c8ced1','#8e979d'],EC=o.eng?[SH(o.eng,20),o.eng,SH(o.eng,-50)]:['#c4cace','#b0b7bc','#6e777d'],BC=['#f4f6f6','#e4e8ea','#a3acb2'];
      for(const[x,y]of[[L/2-.1*k,0],[-.07*k,Wf*.55],[-.07*k,-Wf*.55]]){const p=P(...T(x,y),0);RC(g,p[0],p[1]-fz,1,fz+1,'#2b2f33');}
      const side=(s)=>{if(!G.tt)prism(g,G.hs(s),G.hz,1,WC[0],WC[1],WC[2]);
        if(G.kind==='prop'){prism(g,G.wing(s),G.wz,1,WC[0],WC[1],WC[2]);prism(g,G.eng(s),G.ez,G.eh,EC[0],EC[1],EC[2]);const pr=G.prop(s);BL(g,P(...pr[0],G.ez+1),P(...pr[1],G.ez+1),'#4b5156');}
        else{prism(g,G.eng(s),G.ez,G.eh,EC[0],EC[1],EC[2]);prism(g,G.wing(s),G.wz,1,WC[0],WC[1],WC[2]);const ip=P(...T(G.ex,s*G.ey),G.ez+1);RC(g,ip[0],ip[1],1,1,'#39424a');}};
      side(far);
      prism(g,G.fus,fz,fh,BC[0],BC[1],BC[2]);
      // 垂直尾翼（塗裝色；依朝向那一面打光）
      const s0=Math.sin(G.a),c0=Math.cos(G.a),fc=mixC(SH(tail,-46),SH(tail,8),litT(near*-s0,near*c0));
      const fpP=G.finP.map(([x,z])=>P(...T(x,0),z));fp(g,fpP,fc);BL(g,fpP[0],fpP[1],SH(fc,30));
      if(G.tt)for(const s of[far,near])prism(g,G.hs(s),G.hz,1,WC[0],WC[1],WC[2]);
      side(near);
      // 客艙窗列、塗裝腰線、駕駛艙窗
      const yN=near*Wf/2,x0=-L/2+.14*k,x1=L/2-.1*k;
      BL(g,P(...T(-L/2+.17*k,0),zt),P(...T(L/2-.08*k,0),zt),'#ffffff');
      BL(g,P(...T(x0,yN),fz),P(...T(x1,yN),fz),'#aab3b8');
      BL(g,P(...T(x0,yN),fz+1),P(...T(x1-.02*k,yN),fz+1),o.stripe||liv);
      if(G.wide)BL(g,P(...T(x0,yN),fz+2),P(...T(x1-.04*k,yN),fz+2),SH(o.stripe||liv,-30));
      BL(g,P(...T(x0,yN),zt-1),P(...T(x1,yN),zt-1),'#556a7d',(x,y)=>((x+y)&1)===0);
      const dr=P(...G.door(near),zt-2);RC(g,dr[0],dr[1],1,2,'#9aa4aa');
      const ck=P(...T(L/2-.04*k,near*Wf*.22),zt-1);RC(g,ck[0],ck[1],1,1,'#2d3e4e');const ck2=P(...T(L/2-.045*k,0),zt-.5);RC(g,ck2[0],ck2[1],1,1,'#2d3e4e');
      if(n){const r=P(...T(-.12*k,-sp/2),G.wz+1),gr=P(...T(-.12*k,sp/2),G.wz+1),bc=P(...T(0,0),zt+1),tl=P(...T(-L/2,0),zt);
        RC(n,r[0],r[1],1,1,'#ff5040');RC(n,gr[0],gr[1],1,1,'#60ff80');RC(n,bc[0],bc[1],1,1,'#ff5a48');RC(n,tl[0],tl[1],1,1,'#f4f4ff');}};
    const plane=(S,cu,cv,a,o={})=>{const G=planeGeo(cu,cv,a,o);S.o(o.d!=null?o.d:cu+cv+.2,(g,n)=>planeDraw(g,n,G,o));return G;};

    // ---------- 登機橋 ----------
    const slabPts=(A0,B0,w)=>{const du=B0[0]-A0[0],dv=B0[1]-A0[1],l=Math.hypot(du,dv)||1,nu=-dv/l*w/2,nv=du/l*w/2;return[[A0[0]+nu,A0[1]+nv],[B0[0]+nu,B0[1]+nv],[B0[0]-nu,B0[1]-nv],[A0[0]-nu,A0[1]-nv]];};
    const bridgeDraw=(g,n,A0,B0,zA,zB,o={})=>{const w=o.w||.045,pts=slabPts(A0,B0,w),zb=[zA,zB,zB,zA],zt=zb.map(z=>z+3);
      const Sx=lerp(A0,B0,.76),Sz=zA+(zB-zA)*.76,p=P(Sx[0],Sx[1],0);
      RC(g,p[0]-2,p[1]-1,4,2,'#33373b');RC(g,p[0],p[1]-Sz,1,Sz,'#6b7378');RC(g,p[0]-1,p[1]-Sz,1,Sz,'#8d959a');
      prism(g,polyC(A0[0],A0[1],.032,8,Math.PI/8),0,zA+3,'#d9dcdc','#c7ccce','#8a9296');
      prismZ(g,pts,zb,zt,'#e3e6e6','#d2d7d9','#8e979c');
      const du=B0[0]-A0[0],dv=B0[1]-A0[1],l=Math.hypot(du,dv),side=((-dv+du)>0)?0:3;const q0=pts[side],q1=pts[side===0?1:2];
      BL(g,P(q0[0],q0[1],zA+1),P(q1[0],q1[1],zB+1),'#6f8ea3');
      const cab=rectPts(B0[0]-du/l*.02,B0[1]-dv/l*.02,Math.atan2(dv,du),.05,w+.015);prism(g,cab,zB-.5,4,'#d6dadb','#c2c8ca','#848d92');};

    // 兩段式登機橋：F＝航廈立面點、Kn＝轉折圓廳、D＝機門；第一段固定廊（水平）、第二段伸縮廊斜降到機門，支撐腳＋輪架在機門端
    const bridge2=(g,n,F,Kn,D,zA,zB,o={})=>{const w=o.w||.045;
      const p1=slabPts(F,Kn,w);prism(g,p1,zA,3,'#e3e6e6','#d2d7d9','#8e979c');
      const Sx=lerp(Kn,D,.72),Sz=zA+(zB-zA)*.72,p=P(Sx[0],Sx[1],0);
      RC(g,p[0]-2,p[1]-1,4,2,'#33373b');RC(g,p[0],p[1]-Sz,1,Sz,'#6b7378');RC(g,p[0]-1,p[1]-Sz,1,Sz,'#8d959a');
      const q=P(Kn[0],Kn[1],0);RC(g,q[0],q[1]-zA,1,zA,'#7b8388');
      prism(g,polyC(Kn[0],Kn[1],.036,8,Math.PI/8),zA-.5,4,'#dfe2e2','#cdd2d4','#8a9296');
      const p2=slabPts(Kn,D,w-.005);prismZ(g,p2,[zA,zB,zB,zA],[zA+3,zB+3,zB+3,zA+3],'#e6e9e9','#d6dadc','#949da2');
      for(const[a,b]of[[F,Kn],[Kn,D]]){const du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1,nu=-dv/l,nv=du/l,s=(nu+nv)>=0?1:-1;
        const za=a===F?zA:zA,zb=a===F?zA:zB;BL(g,P(a[0]+s*nu*w/2,a[1]+s*nv*w/2,za+1),P(b[0]+s*nu*w/2,b[1]+s*nv*w/2,zb+1),'#6f8ea3');}
      const du=D[0]-Kn[0],dv=D[1]-Kn[1],l=Math.hypot(du,dv)||1;prism(g,rectPts(D[0]-du/l*.02,D[1]-dv/l*.02,Math.atan2(dv,du),.05,w+.015),zB-.5,4,'#d6dadb','#c2c8ca','#848d92');
      if(n){const c=P(Kn[0],Kn[1],zA+2);RC(n,c[0]-1,c[1],2,1,'#e9f0ff');}};
    // ---------- 建築 ----------
    // 線形航廈：長向沿 u；空側（+v 面）整片玻璃帷幕；屋頂沿 u 起拱（弧形屋頂）；+u 端牆看得到拱形輪廓
    const termLin=(S,u0,v0,du,dv,h,o={})=>{const u1=u0+du,v1=v0+dv,rise=o.rise||4,seed=o.seed||1;
      S.o(o.d!=null?o.d:u1+v1,(g,n)=>{
        const zA=v=>h+rise*Math.sin(Math.PI*Math.max(0,Math.min(1,(v-v0)/dv)));
        faceL(g,v1,u0,u1,0,h,'#88adc4');
        const ep=[P(u1,v0,0),P(u1,v1,0),P(u1,v1,h)];for(let i=12;i>=0;i--){const v=v0+dv*i/12;ep.push(P(u1,v,zA(v)));}fp(g,ep,'#b8bcbb');
        faceR(g,u1,v0,v1,0,2,'#8e9290');rowR(g,n,u1,v0+.04,v1-.04,4,3,4,2,'#3f6178',seed+5,.5);
        // 玻璃帷幕：直櫺每 3px、樓板帶、頂部雨庇
        const a=P(u0,v1,h),b=P(u1,v1,h);
        for(let X=Math.ceil(a[0])+1;X<Math.floor(b[0]);X+=3){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,h-1,'#5e8199');}
        const pa=P(u0,v1,0);
        for(let X=Math.ceil(pa[0])+2,k=0;X<Math.floor(b[0])-1;X+=3,k++){const y=Math.ceil(pa[1]+(X+.5-pa[0])*.5-.5);
          if(hsh(seed,k,3)<.28)RC(g,X,y-h+3,2,3,'#a9c8da');
          if(n){if(hsh(seed,k,5)<.62)RC(n,X,y-6,2,4,hsh(seed,k,6)<.5?'#ffe6a8':'#e9f0ff');if(hsh(seed,k,7)<.5)RC(n,X,y-h+2,2,3,'#ffe6a8');}}
        faceL(g,v1,u0,u1,6,8,'#e8ecec');faceL(g,v1,u0,u1,0,1,'#737875');
        // 弧形屋頂
        const N=8;for(let j=0;j<N;j++){const va=v0+dv*j/N,vb=v0+dv*(j+1)/N,za=zA(va),zb=zA(vb);
          fp(g,[P(u0,va,za),P(u1,va,za),P(u1,vb,zb),P(u0,vb,zb)],j<N/2?(j<N/4?'#c3cbcf':'#d3d9dc'):(j<N*3/4?'#e7ebec':'#f1f3f3'));}
        for(let t=u0+.1;t<u1-.05;t+=.1)BL(g,P(t,v0+dv*.1,zA(v0+dv*.1)),P(t,v1-dv*.06,zA(v1-dv*.06)),'#c7ced1',(x,y)=>(y&1)===0);
        // 屋脊採光帶
        fp(g,[P(u0+.08,v0+dv*.42,zA(v0+dv*.42)),P(u1-.08,v0+dv*.42,zA(v0+dv*.42)),P(u1-.08,v0+dv*.56,zA(v0+dv*.56)),P(u0+.08,v0+dv*.56,zA(v0+dv*.56))],'#9fbccb');
        BL(g,P(u0,v1+.01,h),P(u1,v1+.01,h),'#fbfcfc');BL(g,P(u0,v1+.01,h-1),P(u1,v1+.01,h-1),'#6f8a9c');
        if(o.sign){faceR(g,u1,v0+dv*.25,v1-dv*.25,h-4,h-1,o.sign);}
        for(let k=0;k<(o.units||3);k++){const t=u0+du*(k+.6)/(o.units||3);boxZ(g,t,v0+dv*.16,.12,.1,zA(v0+dv*.16)-1,3,'#b4bbbe','#c8ced0','#8b9397');}
      });};
    // 區域機場小航廈：單層、平頂女兒牆；face='v'（+v 面）或 'u'（+u 面）整片玻璃正面＋入口小雨遮；另一面實牆開小窗
    const termSmall=(S,u0,v0,du,dv,h,face,o={})=>{const u1=u0+du,v1=v0+dv,seed=o.seed||1;
      S.o(o.d!=null?o.d:u1+v1,(g,n)=>{const WL='#e6e2d7',WR='#b9b4a8';
        boxZ(g,u0,v0,du,dv,0,h,'#a4abad',WL,WR);
        flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#8f979a',h);BL(g,P(u0+.03,v0+.03,h),P(u1-.03,v0+.03,h),'#767e81');BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v1-.03,h),'#7c8487');
        if(face==='v'){faceL(g,v1,u0+.04,u1-.04,1,h-2,'#8db3ca');for(let t=u0+.04+.07;t<u1-.05;t+=.07)BL(g,P(t,v1,1),P(t,v1,h-2),'#5c7f96');faceL(g,v1,u0,u1,h-2,h,o.band||'#2f6aa8');faceL(g,v1,u0,u1,0,1,'#7a7f7c');
          if(n){for(let k=0,t=u0+.06;t<u1-.08;t+=.07,k++)if(hsh(seed,k,1)<.6){const p=P(t,v1,2);RC(n,p[0],p[1]+Math.floor((t-u0)*0)-4,2,4,'#ffe6a8');}}
          rowR(g,n,u1,v0+.05,v1-.05,3,2,3,4,'#4d6f88',seed+3,.4);
          const um=u0+du*(o.door||.5);boxZ(g,um-.14,v1,.28,.12,h-3,1,'#f1f3f3','#dfe3e5','#9aa2a6');for(const t of[um-.12,um+.12]){const p=P(t,v1+.11,0);RC(g,p[0],p[1]-(h-3),1,h-3,'#8d959a');}
          winL(g,um-.05,v1,0,4,h-4,'#2f4c63');if(n)winL(n,um-.05,v1,0,4,h-4,'#ffe6a8');}
        else{faceR(g,u1,v0+.04,v1-.04,1,h-2,'#6f93aa');for(let t=v0+.04+.07;t<v1-.05;t+=.07)BL(g,P(u1,t,1),P(u1,t,h-2),'#48667a');faceR(g,u1,v0,v1,h-2,h,SH(o.band||'#2f6aa8',-26));faceR(g,u1,v0,v1,0,1,'#5f6462');
          if(n){for(let k=0,t=v0+.06;t<v1-.08;t+=.07,k++)if(hsh(seed,k,1)<.6){const p=P(u1,t,2);RC(n,p[0]-2,p[1]-4,2,4,'#f3d68e');}}
          rowL(g,n,u0+.05,u1-.05,v1,3,2,3,4,'#4d6f88',seed+3,.4);
          const vm=v0+dv*(o.door||.5);boxZ(g,u1,vm-.14,.12,.28,h-3,1,'#f1f3f3','#dfe3e5','#9aa2a6');for(const t of[vm-.12,vm+.12]){const p=P(u1+.11,t,0);RC(g,p[0],p[1]-(h-3),1,h-3,'#8d959a');}
          winR(g,u1,vm+.05,0,4,h-4,'#243c50');if(n)winR(n,u1,vm+.05,0,4,h-4,'#ffe6a8');}
        boxZ(g,u0+du*.3,v0+dv*.3,.12,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');boxZ(g,u0+du*.65,v0+dv*.35,.1,.1,h,2,'#b9c0c4','#ced4d7','#9aa2a6');});};
    // 地面弧帶（以 (cu,cv) 為圓心）
    const arcPts=(cu,cv,r,t0,t1,n)=>Array.from({length:n+1},(_,i)=>{const a=t0+(t1-t0)*i/n;return[cu+r*Math.cos(a),cv+r*Math.sin(a)];});
    const arcBand=(g,cu,cv,r0,r1,t0,t1,col,n=28)=>fp(g,arcPts(cu,cv,r1,t0,t1,n).concat(arcPts(cu,cv,r0,t1,t0,n)).map(q=>P(q[0],q[1])),col);
    const arcLine=(g,cu,cv,r,t0,t1,col,n=40,ok)=>{const q=arcPts(cu,cv,r,t0,t1,n);for(let i=0;i<n;i++)BL(g,P(...q[i]),P(...q[i+1]),col,ok);};
    // 弧形航廈：圓心 (cu,cv)、內外半徑 r0/r1、角度 t0..t1；外牆整片玻璃帷幕（逐段依法線打光）、屋頂沿半徑方向起拱
    const termArc=(S,cu,cv,r0,r1,t0,t1,h,o={})=>{const N=o.n||20,rise=o.rise||4,seed=o.seed||1,M=6;
      S.o(o.d!=null?o.d:0,(g,n)=>{const pt=(r,a,z=0)=>P(cu+r*Math.cos(a),cv+r*Math.sin(a),z),zR=r=>h+rise*Math.sin(Math.PI*(r-r0)/(r1-r0));
        const segs=[];for(let i=0;i<N;i++)segs.push([t0+(t1-t0)*i/N,t0+(t1-t0)*(i+1)/N,i]);
        segs.sort((p,q)=>(Math.cos(p[0]/2+p[1]/2)+Math.sin(p[0]/2+p[1]/2))-(Math.cos(q[0]/2+q[1]/2)+Math.sin(q[0]/2+q[1]/2)));
        const RC4=['#c5ccd0','#d5dbde','#e6eaeb','#f0f2f2','#e9edee','#dfe4e6'];
        for(const[a,b,i]of segs){const am=(a+b)/2,nu=Math.cos(am),nv=Math.sin(am);
          fp(g,[pt(r1,a,0),pt(r1,b,0),pt(r1,b,h),pt(r1,a,h)],faceC(nu,nv,'#93b8cf','#5b7d94',6));
          fp(g,[pt(r1,a,0),pt(r1,b,0),pt(r1,b,1),pt(r1,a,1)],'#6d7471');
          fp(g,[pt(r1,a,6),pt(r1,b,6),pt(r1,b,8),pt(r1,a,8)],faceC(nu,nv,'#eef1f1','#aab2b6',4));
          BL(g,pt(r1,a,1),pt(r1,a,h),faceC(nu,nv,'#5f8299','#3f5a6c',4));BL(g,pt(r1,am,8),pt(r1,am,h),faceC(nu,nv,'#6d90a7','#45627a',4));
          if(hsh(seed,i,3)<.3){const p=pt(r1,a+(b-a)*.3,h-2);RC(g,p[0],p[1],2,1,'#b3d0e0');}
          if(n){for(const[z0,z1,s2]of[[2,5,1],[9,h-2,2]]){if(hsh(seed,i,5+s2)<.62){const a1=a+(b-a)*.18,b1=a+(b-a)*.82;fp(n,[pt(r1,a1,z0),pt(r1,b1,z0),pt(r1,b1,z1),pt(r1,a1,z1)],hsh(seed,i,9+s2)<.5?'#ffe6a8':'#e9f0ff');}}}
          for(let j=0;j<M;j++){const ra=r0+(r1-r0)*j/M,rb=r0+(r1-r0)*(j+1)/M;fp(g,[pt(ra,a,zR(ra)),pt(ra,b,zR(ra)),pt(rb,b,zR(rb)),pt(rb,a,zR(rb))],RC4[j]);}
          if(i%2===0)BL(g,pt(r0+.04,a,zR(r0+.04)),pt(r1-.03,a,zR(r1-.03)),'#c3cacd',(x,y)=>(y&1)===0);
          fp(g,[pt(r0+(r1-r0)*.44,a,zR(r0+(r1-r0)*.44)+.5),pt(r0+(r1-r0)*.44,b,zR(r0+(r1-r0)*.44)+.5),pt(r0+(r1-r0)*.58,b,zR(r0+(r1-r0)*.58)+.5),pt(r0+(r1-r0)*.58,a,zR(r0+(r1-r0)*.58)+.5)],'#a3bfcd');}
        const eave=arcPts(cu,cv,r1+.012,t0,t1,48);for(let i=0;i<48;i++)BL(g,P(...eave[i],h),P(...eave[i+1],h),'#fbfcfc');
        if(o.units)for(let k=0;k<o.units;k++){const a=t0+(t1-t0)*(k+.5)/o.units,r=r0+(r1-r0)*.3,p=[cu+r*Math.cos(a),cv+r*Math.sin(a)];boxZ(g,p[0]-.05,p[1]-.05,.1,.1,zR(r)-1,3,'#b4bbbe','#c8ced0','#8b9397');}
      });};
    // 衛星廊廳：圓形玻璃大廳（多邊形逐面打光）＋淺圓頂＋頂部採光環
    const satellite=(S,cu,cv,r,h,o={})=>S.o(o.d!=null?o.d:cu+cv+r,(g,n)=>{const N=28,ring=polyC(cu,cv,r,N,Math.PI/N);
      const seed=o.seed||5;prism(g,ring,0,h,null,'#93b8cf','#577a91',6);
      for(let i=0;i<N;i++){const a=ring[i],b=ring[(i+1)%N],nu=(a[0]+b[0])/2-cu,nv=(a[1]+b[1])/2-cv;if(nu+nv<=0)continue;
        fp(g,[P(a[0],a[1],0),P(b[0],b[1],0),P(b[0],b[1],1),P(a[0],a[1],1)],'#6d7471');
        fp(g,[P(a[0],a[1],6),P(b[0],b[1],6),P(b[0],b[1],8),P(a[0],a[1],8)],faceC(nu,nv,'#eef1f1','#aab2b6',4));
        BL(g,P(a[0],a[1],1),P(a[0],a[1],h),faceC(nu,nv,'#5f8299','#3f5a6c',4));
        if(n&&hsh(seed,i,1)<.6){const q=P((a[0]+b[0])/2,(a[1]+b[1])/2,4);RC(n,q[0]-1,q[1]-2,2,3,'#ffe6a8');}
        if(n&&hsh(seed,i,2)<.5){const q=P((a[0]+b[0])/2,(a[1]+b[1])/2,h-2);RC(n,q[0]-1,q[1]-2,2,3,'#e9f0ff');}}
      const DC=['#e2e7e9','#eaeef0','#f1f3f3','#f6f7f7'];
      for(let k=0;k<4;k++){const rr=r*(1-.18*k)+.012;prism(g,polyC(cu,cv,rr,N,Math.PI/N),h+k*1.5,1.5,DC[k],'#d4dadc','#9aa3a8',4);}
      prism(g,polyC(cu,cv,r*.34,16,Math.PI/16),h+6,1,'#a3bfcd','#8fb0c2','#6a8a9e',2);
      const e=polyC(cu,cv,r+.012,N,Math.PI/N);for(let i=0;i<N;i++){const a=e[i],b=e[(i+1)%N];if(a[0]+a[1]<cu+cv-.05&&b[0]+b[1]<cu+cv-.05)continue;BL(g,P(a[0],a[1],h),P(b[0],b[1],h),'#fbfcfc');}});
    // 機庫：door='v' 門在 +v 面（拱跨 u、筒拱沿 v）｜door='u' 門在 +u 面；open＝門開幅（0–1），可在門內擺一架飛機
    const hangar=(S,u0,v0,du,dv,h,rise,o={})=>{const u1=u0+du,v1=v0+dv,door=o.door||'v',open=o.open||0;
      const WL=o.wl||'#cfd3d0',WR=o.wr||'#9da4a5',RL=o.rl||'#b9c3c8',RD=o.rd||'#7e8990',DR=o.dc||'#b5bdc1';
      S.o(o.d!=null?o.d:u1+v1,(g,n)=>{const N=14;
        if(door==='v'){const um=(u0+u1)/2,zA=u=>h+rise*Math.sqrt(Math.max(0,1-Math.pow((u-um)/(du/2),2)));
          faceR(g,u1,v0,v1,0,h,WR);ribsR(g,u1,v0,v1,1,h,SH(WR,-10),3);faceR(g,u1,v0,v1,0,1,'#7c8283');
          rowR(g,n,u1,v0+.08,v1-.08,h-6,3,2,4,'#4b6a80',o.seed||3,.4);
          for(let i=0;i<N;i++){const ua=u0+du*i/N,ub=u0+du*(i+1)/N,t=i/(N-1);fp(g,[P(ua,v0,zA(ua)),P(ub,v0,zA(ub)),P(ub,v1,zA(ub)),P(ua,v1,zA(ua))],mixC(RL,RD,Math.round(t*4)/4));}
          for(let i=1;i<N;i+=2){const u=u0+du*i/N;BL(g,P(u,v0+.02,zA(u)),P(u,v1-.01,zA(u)),mixC(SH(RL,-12),SH(RD,-10),i/N));}
          const pts=[P(u0,v1,0),P(u1,v1,0)];for(let i=N;i>=0;i--){const u=u0+du*i/N;pts.push(P(u,v1,zA(u)));}fp(g,pts,WL);
          const da=u0+.04,db=u1-.04,dh=h+rise*.45;fp(g,[P(da,v1,0),P(db,v1,0),P(db,v1,dh),P(da,v1,dh)],DR);
          for(let X=Math.ceil(P(da,v1,0)[0])+3;X<P(db,v1,0)[0]-1;X+=4){const y=Math.ceil(P(da,v1,0)[1]+(X+.5-P(da,v1,0)[0])*.5-.5);RC(g,X,y-dh+1,1,dh-1,SH(DR,-18));}
          faceL(g,v1,da,db,dh,dh+2,'#6d7679');BL(g,P(u0,v1,h),P(u1,v1,h),SH(WL,14));
          if(open>0){const oa=um-(db-da)*open/2,ob=um+(db-da)*open/2;const hole=[P(oa,v1,0),P(ob,v1,0),P(ob,v1,dh-1),P(oa,v1,dh-1)];fp(g,hole,'#2b3035');
            if(o.inside)clipPoly(g,hole.concat([]),()=>o.inside(g,n));
            for(let k=0;k<3;k++){const p=P(oa+(ob-oa)*(k+.5)/3,v1,dh-2);RC(g,p[0],p[1],1,1,'#e9e0b8');if(n)RC(n,p[0],p[1],1,1,'#fff0c0');}}
          if(o.sign){faceL(g,v1,um-.12,um+.12,h+rise*.62,h+rise*.62+2,o.sign);}
          const bl=P(um,v1,h+rise+1);RC(g,bl[0],bl[1]-1,1,1,'#c0392b');if(n)RC(n,bl[0],bl[1]-1,1,1,'#ff5a48');
        }else{const vm=(v0+v1)/2,zA=v=>h+rise*Math.sqrt(Math.max(0,1-Math.pow((v-vm)/(dv/2),2)));
          faceL(g,v1,u0,u1,0,h,WL);ribsL(g,u0,u1,v1,1,h,SH(WL,-10),3);faceL(g,v1,u0,u1,0,1,'#8c918f');
          rowL(g,n,u0+.08,u1-.08,v1,h-6,3,2,4,'#4b6a80',o.seed||3,.4);
          for(let i=0;i<N;i++){const va=v0+dv*i/N,vb=v0+dv*(i+1)/N,t=i/(N-1);fp(g,[P(u0,va,zA(va)),P(u1,va,zA(va)),P(u1,vb,zA(vb)),P(u0,vb,zA(vb))],mixC(RD,RL,Math.round(t*4)/4));}
          for(let i=1;i<N;i+=2){const v=v0+dv*i/N;BL(g,P(u0+.02,v,zA(v)),P(u1-.01,v,zA(v)),mixC(SH(RD,-10),SH(RL,-12),i/N));}
          const pts=[P(u1,v0,0),P(u1,v1,0)];for(let i=N;i>=0;i--){const v=v0+dv*i/N;pts.push(P(u1,v,zA(v)));}fp(g,pts,WR);
          const da=v0+.04,db=v1-.04,dh=h+rise*.45;fp(g,[P(u1,da,0),P(u1,db,0),P(u1,db,dh),P(u1,da,dh)],SH(DR,-30));
          for(let X=Math.ceil(P(u1,db,0)[0])+3;X<P(u1,da,0)[0]-1;X+=4){const y=Math.ceil(P(u1,db,0)[1]-(X+.5-P(u1,db,0)[0])*.5-.5);RC(g,X,y-dh+1,1,dh-1,SH(DR,-44));}
          faceR(g,u1,da,db,dh,dh+2,'#586063');BL(g,P(u1,v0,h),P(u1,v1,h),SH(WR,10));
          if(open>0){const oa=vm-(db-da)*open/2,ob=vm+(db-da)*open/2;const hole=[P(u1,oa,0),P(u1,ob,0),P(u1,ob,dh-1),P(u1,oa,dh-1)];fp(g,hole,'#25292e');
            if(o.inside)clipPoly(g,hole,()=>o.inside(g,n));
            for(let k=0;k<3;k++){const p=P(u1,oa+(ob-oa)*(k+.5)/3,dh-2);RC(g,p[0],p[1],1,1,'#e9e0b8');if(n)RC(n,p[0],p[1],1,1,'#fff0c0');}}
          if(o.sign){faceR(g,u1,vm-.12,vm+.12,h+rise*.62,h+rise*.62+2,SH(o.sign,-30));}
          const bl=P(u1,vm,h+rise+1);RC(g,bl[0],bl[1]-1,1,1,'#c0392b');if(n)RC(n,bl[0],bl[1]-1,1,1,'#ff5a48');}
      });};
    // 控制塔：八角塔身＋外挑陽台＋斜面玻璃塔頂＋屋頂天線；o.base＝[du,dv,h] 塔基建物
    const ctower=(S,u,v,Ht,o={})=>{const r=o.r||.07,rc=o.rc||.13;
      S.o(o.d!=null?o.d:u+v+.3,(g,n)=>{const oct=(rr)=>polyC(u,v,rr,8,Math.PI/8);
        if(o.base){const[bu,bv,bh]=o.base;boxZ(g,u-bu/2,v-bv/2,bu,bv,0,bh,'#b8bdbf','#e4e1d9','#aca89f');rowL(g,n,u-bu/2+.03,u+bu/2-.03,v+bv/2,bh-6,3,3,2,'#4d6f88',71,.5);rowR(g,n,u+bu/2,v-bv/2+.03,v+bv/2-.03,bh-6,3,3,2,'#40607a',72,.5);
          flat(g,u-bu/2+.03,v-bv/2+.03,bu-.06,bv-.06,'#9ba2a5',bh);}
        prism(g,oct(r),0,Ht,'#e6e3dc','#ebe8e1','#a7a39b');
        const sp=P(u+r*.3,v+r*.95,0);for(let z=10;z<Ht-6;z+=7){RC(g,sp[0]-1,sp[1]-z-3,2,3,'#4d6f88');if(n&&hsh(u*100|0,z,3)<.4)RC(n,sp[0]-1,sp[1]-z-3,2,3,'#ffe3a0');}
        prism(g,oct(rc*.95),Ht,2,'#d5d8d9','#c3c7c9','#868d91');
        prism(g,oct(rc),Ht+2,1,'#aab1b4','#9aa2a6','#707a7f');
        prism(g,oct(rc),Ht+3,6,null,'#3e6a86','#274760');
        for(const p of oct(rc)){if((p[0]-u)+(p[1]-v)<-.01)continue;BL(g,P(p[0],p[1],Ht+3),P(p[0],p[1],Ht+8),'#1f3444');}
        if(n){for(const p of oct(rc*1.01)){if((p[0]-u)+(p[1]-v)<-.01)continue;const q=P(p[0],p[1],Ht+5);RC(n,q[0]-1,q[1]-1,2,2,'#bdf0ff');}}
        prism(g,oct(rc+.012),Ht+9,2,'#eef0f0','#dcdfdf','#9ea4a6');
        prism(g,oct(rc*.5),Ht+11,2,'#c9cdcf','#bcc1c3','#899094');
        const a=P(u,v,Ht+13);RC(g,a[0],a[1]-9,1,9,'#7d858a');RC(g,a[0]+1,a[1]-5,2,1,'#7d858a');RC(g,a[0],a[1]-10,1,1,'#d0392c');if(n)RC(n,a[0],a[1]-10,1,1,'#ff5a48');
      });};
    const ctowerSh=(u,v,Ht,o={})=>[['pr',polyC(u,v,o.r||.07,8,Math.PI/8),Ht,0],['pr',polyC(u,v,(o.rc||.13)+.012,8,Math.PI/8),11,Ht]];
    // 油庫：圓柱儲槽（浮頂、梯）＋防溢堤
    const tank=(S,u,v,r,h,d)=>S.o(d!=null?d:u+v+r,(g,n)=>{const p=P(u,v),rx=RX(r);
      const top=cyl(g,p[0],p[1],rx,h,['#f1f2f0','#e6e8e6','#d6d9d8','#c2c6c6','#a9afb0','#949a9c'],'#cfd3d3','#b3b8b9');
      RC(g,p[0]-rx,p[1]-h+3,2*rx+1,1,'#c9ced0');ell(g,top[0],top[1],rx-2,Math.max(0,(rx>>1)-1),'#bfc4c5');
      for(let z=1;z<h;z+=2)RC(g,p[0]+rx-2,p[1]-z,1,1,'#7f878b');
      RC(g,p[0]-2,p[1]-h*.5,5,1,'#c8413a');});
    // 消防站：+v 面三樘紅色鐵捲門＋訓練塔
    const fireSt=(S,u0,v0,du,dv,h,d)=>S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{const u1=u0+du,v1=v0+dv;
      boxZ(g,u0,v0,du,dv,0,h,'#9aa1a4','#e7e2d6','#b6b0a4');flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#868d90',h);
      faceL(g,v1,u0,u1,h-2,h,'#c0392b');faceR(g,u1,v0,v1,h-2,h,'#962b21');
      for(let k=0;k<3;k++){const t=u0+.05+(du-.1)*k/3+.01;winL(g,t,v1,0,6,6,'#b3362b');for(let z=1;z<6;z+=2)winL(g,t,v1,z,6,1,'#8e271f');const lp=P(t+.1,v1,7);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');}
      rowR(g,n,u1,v0+.05,v1-.05,3,3,3,3,'#4d6f88',81,.6);
      boxZ(g,u0+.02,v0+.02,.12,.12,h,9,'#b2b8ba','#e2ddd1','#aea89c');winL(g,u0+.05,v0+.14,h+4,2,3,'#4d6f88');
      const bl=P(u0+.08,v0+.08,h+10);RC(g,bl[0],bl[1]-1,1,1,'#d0392c');if(n)RC(n,bl[0],bl[1]-1,1,1,'#ff5a48');});
    // 立體停車場：每層樓板＋開放立面（暗）＋女兒牆；頂層停車
    const garage=(S,u0,v0,du,dv,lv,seed,d)=>S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{const u1=u0+du,v1=v0+dv,fh=4,h=lv*fh+1;
      boxZ(g,u0,v0,du,dv,0,h,'#aeb0ab','#cfccc3','#a19e95');
      const CC0=['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#9a3a33','#dfe2e4'];
      for(let k=0;k<lv;k++){const z=k*fh+1;faceL(g,v1,u0+.02,u1-.02,z,z+2,'#3a3f43');faceR(g,u1,v0+.02,v1-.02,z,z+2,'#2c3134');
        for(let t=u0+.05,j=0;t<u1-.06;t+=.07,j++){if(hsh(seed,j,k+40)<.3)continue;const p=P(t,v1,z);RC(g,p[0],p[1]-2,2,1,CC0[Math.floor(hsh(seed,j,k+50)*7)]);}
        for(let t=u0+.1;t<u1-.05;t+=.14){const p=P(t,v1,z);RC(g,p[0],p[1]-2,1,2,'#bdbab1');}
        for(let t=v0+.1;t<v1-.05;t+=.14){const p=P(u1,t,z);RC(g,p[0],p[1]-2,1,2,'#8e8b83');}
        if(n){for(let t=u0+.07;t<u1-.05;t+=.14){const p=P(t,v1,z+1);RC(n,p[0],p[1]-1,2,1,'#ffe9b0');}}}
      flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#8d8c87',h);
      for(let t=u0+.08;t<u1-.05;t+=.08){BL(g,P(t,v0+.06,h),P(t,v0+.2,h),'#d9d6cc');BL(g,P(t,v1-.2,h),P(t,v1-.06,h),'#d9d6cc');}
      const CC=['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#2f2f33'];
      for(let k=0;k<Math.floor((du-.12)/.08);k++){for(const vv of[v0+.08,v1-.18]){if(hsh(seed,k,vv*10|0)<.4)continue;const u=u0+.1+k*.08,c=CC[Math.floor(hsh(seed,k,(vv*10|0)+3)*6)];
        boxZ(g,u,vv,.05,.1,h,2,SH(c,16),c,SH(c,-40));boxZ(g,u+.008,vv+.03,.034,.05,h+2,1,SH(c,26),'#7fa0b6','#58788e');}}
      boxZ(g,u1-.16,v0+.04,.12,.14,h,5,'#a9aca7','#d6d3ca','#a3a097');winL(g,u1-.12,v0+.18,h+1,2,3,'#4d6f88');
      // 停車場標誌（藍底白 P）
      {const p=P(u1,v0+dv*.62,h+1);RC(g,p[0]+1,p[1]-6,5,6,'#2f6aa8');RC(g,p[0]+2,p[1]-5,1,4,'#f2f4f4');RC(g,p[0]+3,p[1]-5,2,1,'#f2f4f4');RC(g,p[0]+4,p[1]-4,1,1,'#f2f4f4');RC(g,p[0]+3,p[1]-3,1,1,'#f2f4f4');RC(g,p[0]+3,p[1],1,3,'#7d858a');}});
    const office=(S,u0,v0,du,dv,fl,seed,o={})=>S.o(o.d!=null?o.d:u0+v0+du+dv,(g,n)=>{const fh=6,h=fl*fh+3,wl=o.wl||'#e5e1d6',wr=o.wr||'#bbb6ab',gl=o.gl||'#48708f',roof=o.roof||'#8e9598';
      boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.03,v0+.03,du-.06,dv-.06,roof,h);
      for(let f=0;f<fl;f++){rowL(g,n,u0+.03,u0+du-.03,v0+dv,3+f*fh,3,3,2,gl,seed+f,.6);rowR(g,n,u0+du,v0+.03,v0+dv-.03,3+f*fh,3,3,2,gl,seed+f*7,.5);}
      if(o.band){faceL(g,v0+dv,u0,u0+du,h-2,h,o.band);faceR(g,u0+du,v0,v0+dv,h-2,h,SH(o.band,-40));}
      if(o.door!==false){const um=u0+du*(o.doorAt||.5);winL(g,um-.05,v0+dv,0,4,5,'#2f4c63');if(n)winL(n,um-.05,v0+dv,0,4,5,'#ffe6a8');}
      boxZ(g,u0+du*.25,v0+dv*.3,.12,.1,h,3,'#c9ced1','#dde1e3','#a9b0b4');});

    // ---------- 車輛 ----------
    const car=(S,u,v,alongU,col,d)=>S.o(d!=null?d:u+v+.1,(g)=>{const du=alongU?.13:.07,dv=alongU?.07:.13;
      boxZ(g,u,v,du,dv,1,2,SH(col,16),col,SH(col,-40));boxZ(g,u+(alongU?.032:.008),v+(alongU?.008:.032),alongU?.066:.054,alongU?.054:.066,3,2,SH(col,30),'#7fa0b6','#58788e');});
    const carRow=(S,list,d)=>S.o(d,(g)=>{for(const[u,v,alongU,col]of list){const du=alongU?.13:.07,dv=alongU?.07:.13;
      boxZ(g,u,v,du,dv,1,2,SH(col,16),col,SH(col,-40));boxZ(g,u+(alongU?.032:.008),v+(alongU?.008:.032),alongU?.066:.054,alongU?.054:.066,3,2,SH(col,30),'#7fa0b6','#58788e');}});
    // 機場巴士（低地板、大窗）：ax 行進軸
    const bus=(S,u,v,alongU,col,d)=>S.o(d!=null?d:u+v+.3,(g,n)=>{const L=.26,Wd=.08,du=alongU?L:Wd,dv=alongU?Wd:L;
      for(const t of[.05,.2]){const p=alongU?P(u+t,v+Wd,0):P(u+Wd,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
      boxZ(g,u,v,du,dv,1,5,'#eef0f0',alongU?'#e3e7e8':SH(col,-20),alongU?'#9ea6aa':'#a3abaf');
      if(alongU){faceL(g,v+Wd,u+.02,u+L-.02,3,5,'#3d5a70');faceL(g,v+Wd,u,u+L,1,2,col);if(n)faceL(n,v+Wd,u+.03,u+L-.03,3,5,'#ffe6a8');}
      else{faceR(g,u+Wd,v+.02,v+L-.02,3,5,'#2e475a');faceR(g,u+Wd,v,v+L,1,2,SH(col,-30));if(n)faceR(n,u+Wd,v+.03,v+L-.03,3,5,'#f3d68e');}});
    // 行李拖車列：牽引車＋n 台拖板（彩色行李）
    const bagTrain=(S,u,v,alongU,nC,seed,d)=>S.o(d!=null?d:u+v+.3,(g)=>{const BAG=['#3d5f8a','#b8433a','#5d6468','#2f2f33','#c9a23a','#6b8f5a'];
      const st=.065,W2=.045;for(let k=nC;k>=0;k--){const o=k*st,uu=alongU?u+o:u,vv=alongU?v:v+o;
        if(k===0){boxZ(g,uu,vv,alongU?.055:W2,alongU?W2:.055,1,2,'#f0c43a','#e8b52c','#a8801c');boxZ(g,uu+(alongU?.0:.0),vv,alongU?.025:W2,alongU?W2:.025,3,2,'#3a4046','#50585e','#2c3136');}
        else{boxZ(g,uu,vv,alongU?.052:W2,alongU?W2:.052,1,1,'#8a9094','#737a7e','#50565a');
          for(let b=0;b<2;b++){const c=BAG[Math.floor(hsh(seed,k,b)*6)];boxZ(g,uu+(alongU?.006+b*.022:.006),vv+(alongU?.006:.006+b*.022),alongU?.018:.033,alongU?.033:.018,2,2,SH(c,18),c,SH(c,-38));}}}});
    // 油罐車／空廚車／推機車
    const fuelTruck=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.25,(g)=>{const L=.2,Wd=.07;const bx=(b0,db,a0,da,z,h,t,l,r)=>alongU?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      for(const t of[.03,.12,.17]){const p=alongU?P(u+t,v+Wd,0):P(u+Wd,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
      bx(0,.06,0,Wd,1,5,'#f2f2ee','#e4e4de','#a6a8a4');bx(.065,.135,.005,Wd-.01,1,5,'#f3e3a2','#e7d27a','#a8943f');bx(.07,.12,.02,Wd-.04,6,1,'#c9b664','#c2ae5c','#8d7c3a');
      const w=alongU?P(u+.01,v+Wd,4):P(u+Wd,v+.01,4);RC(g,w[0],w[1]-1,2,1,'#3d5a70');});
    const cater=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.25,(g)=>{const bx=(b0,db,a0,da,z,h,t,l,r)=>alongU?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      for(const t of[.03,.15]){const p=alongU?P(u+t,v+.07,0):P(u+.07,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
      bx(0,.19,0,.07,1,2,'#6a7074','#5a6064','#3e4448');bx(0,.05,0,.07,3,3,'#f0f0ec','#e0e0da','#a3a5a1');
      const a=alongU?P(u+.1,v+.07,3):P(u+.07,v+.1,3),b=alongU?P(u+.16,v+.07,8):P(u+.07,v+.16,8);BL(g,a,b,'#8d9397');BL(g,[a[0],b[1]],[b[0],a[1]],'#8d9397');
      bx(.06,.13,0,.07,8,5,'#f4f4f0','#e7e7e2','#aeb0ac');const s=alongU?P(u+.07,v+.07,11):P(u+.07,v+.07,11);RC(g,s[0],s[1],3,1,'#3d6fa8');});
    const tug=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.1,(g)=>{const du=alongU?.09:.06,dv=alongU?.06:.09;boxZ(g,u,v,du,dv,0,2,'#f0c43a','#e2ae28','#a07b1a');boxZ(g,u+du*.3,v+dv*.3,du*.4,dv*.4,2,2,'#3a4046','#50585e','#2c3136');});
    const arff=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.3,(g,n)=>{const L=.2,Wd=.08,du=alongU?L:Wd,dv=alongU?Wd:L;
      for(const t of[.03,.1,.16]){const p=alongU?P(u+t,v+Wd,0):P(u+Wd,v+t,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
      boxZ(g,u,v,du,dv,1,5,'#d64a3a','#c83c2e','#8e281e');
      if(alongU){faceL(g,v+Wd,u,u+L,3,4,'#f2f0ea');winL(g,u+L-.05,v+Wd,4,3,2,'#34495a');}else{faceR(g,u+Wd,v,v+L,3,4,'#d8d4cc');winR(g,u+Wd,v+L-.05,4,3,2,'#2e4252');}
      const lb=alongU?P(u+L-.04,v+Wd/2,6):P(u+Wd/2,v+L-.04,6);RC(g,lb[0]-1,lb[1]-1,3,1,'#3a7ad0');if(n)RC(n,lb[0]-1,lb[1]-1,3,1,'#6aa8ff');
      const tu=alongU?P(u+.1,v+Wd/2,6):P(u+Wd/2,v+.1,6);RC(g,tu[0],tu[1]-2,2,2,'#e6e2da');});

    // ---------- 點景 ----------
    const mast=(S,u,v,h=40,d)=>S.o(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');
      RC(g,x-3,y-h-2,7,2,'#5b6166');RC(g,x-3,y-h-2,7,1,'#9aa1a6');RC(g,x-3,y-h,7,1,'#e9e2c4');
      if(n){RC(n,x-3,y-h,7,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,232,170,.5)');}});
    const lamp=(S,u,v,h=13,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const windsock=(S,u,v,d)=>S.o(d!=null?d:u+v,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-11,1,11,'#8d959a');
      RC(g,x+1,y-11,2,3,'#e8702a');RC(g,x+3,y-11,2,2,'#f2f0ea');RC(g,x+5,y-10,2,2,'#e8702a');RC(g,x+7,y-10,1,1,'#f2f0ea');if(n)RC(n,x,y-12,1,1,'#ff5a48');});
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),Ln=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),nn=Math.max(3,Math.round(Ln/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=nn;i++){const t=i/nn;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};
    // 雷達塔（格構鐵塔＋頂部平台）；回傳平台頂面中心的畫布座標（繪製端的旋轉雷達錨在此）
    const radarTower=(S,u,v,h,d)=>{const top=P(u,v,h),at=[rnd(top[0]),rnd(top[1])];
      const dd=d!=null?d:u+v+.12,r0=.075,r1=.03,L4=[[-1,-1],[1,-1],[1,1],[-1,1]];
      const leg=(a,b,z)=>{const r=r0+(r1-r0)*z/(h-2);return P(u+a*r,v+b*r,z);};
      // 機房小屋（塔腳旁）
      S.o(dd-.003,(g)=>{boxZ(g,u+.09,v-.06,.12,.1,0,5,'#b9bfc1','#dcd8cd','#a9a498');const p=P(u+.13,v+.04,0);RC(g,p[0],p[1]-4,2,4,'#6b7378');});
      // 格構塔身：細線、不描邊（透空）；前兩腳深、後兩腳淺，每 6px 一道 X 斜撐
      S.t(dd-.002,(g)=>{for(const[a,b]of L4){if(a+b>=-1)continue;BL(g,leg(a,b,0),leg(a,b,h-2),'#a3aaae');}
        for(let z=0;z<h-6;z+=6){for(const[p,q]of[[[-1,1],[1,1]],[[1,-1],[1,1]]]){BL(g,leg(p[0],p[1],z),leg(q[0],q[1],z+6),'#8f979b');BL(g,leg(q[0],q[1],z),leg(p[0],p[1],z+6),'#8f979b');}}
        for(const[a,b]of L4){if(a+b<-1)continue;BL(g,leg(a,b,0),leg(a,b,h-2),a+b>0?'#4f575c':'#6a7277');}
        for(const[a,b]of L4){if(a+b<-1)continue;const p=leg(a,b,0);RC(g,p[0]-1,p[1],3,1,'#8e8b82');}});
      // 頂部平台（欄杆）；繪製端的旋轉雷達錨在平台頂面中心
      S.o(dd,(g,n)=>{boxZ(g,u-.05,v-.05,.1,.1,h-2,2,'#cfd3d5','#b8bec1','#7f878c');
        for(const[a,b]of L4){if(a+b<-1)continue;const p=P(u+a*.05,v+b*.05,h);RC(g,p[0],p[1]-2,1,2,'#8a9196');}
        RC(g,at[0]-1,at[1]-1,3,1,'#e3e6e7');
        const bl=P(u+.05,v+.05,h+1);RC(g,bl[0],bl[1]-1,1,1,'#d0392c');if(n)RC(n,bl[0],bl[1]-1,1,1,'#ff5a48');});
      return at;};

    return{P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,clipPoly,ribsL,ribsR,pg,winL,winR,rowL,rowR,RX,ell,cyl,mixC,prism,prismZ,frame,rectPts,obox,polyC,
      scene,shadow,MATS,pave,grass,lineU,lineV,dashU,dashV,WHT,YEL,RED,stallsU,stallsV,stain,S16,
      runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,slabPts,bridgeDraw,bridge2,termLin,termSmall,arcPts,arcBand,arcLine,termArc,satellite,hangar,ctower,ctowerSh,tank,fireSt,garage,office,
      car,carRow,bus,bagTrain,fuelTruck,cater,tug,arff,mast,lamp,tree,bush,windsock,fence,radarTower};
  };

  // 組裝：每類讀舊物件的 w/h/ax/ay；每變體獨立畫布；DEV 映射只在迭代時使用
  const build=(k,layouts)=>{const d0=DIM[k],o0=B[k+'_1_0'];
    const W=(o0&&o0.w)||d0[0],H=(o0&&o0.h)||d0[1],AX=(o0&&o0.ax!=null)?o0.ax:d0[2],AY=(o0&&o0.ay!=null)?o0.ay:d0[3],SZ=d0[4];
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null,made=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K,SZ)||{};
      // 地面層只留在佔地菱形內（弧形車道、陰影等不外溢）
      const[mc,mg]=A.cv(W,H);A.dia(mg,AX,AY-32*SZ,32*SZ,'#ffffff');
      for(const x of[g,ng]){x.save();x.globalCompositeOperation='destination-in';x.drawImage(mc,0,0);x.restore();}
      A.diaEdge(g,6,'#6f7a62',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#a9c98a',AX,AY-32*SZ,32*SZ);
      for(const f of S.late)f(g);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      // 成品硬邊：圍籬細線落在透明處的半透明像素一律二值化（不留半透明）
      {const im=g.getImageData(0,0,W,H),a=im.data;for(let i=3;i<a.length;i+=4){const x=a[i];if(x&&x<255)a[i]=x>=110?255:0;}g.putImageData(im,0,0);}
      const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[],__t575:1};
      if(o.radarAt)spr.radarAt=o.radarAt;
      B[k+'_1_'+slot]=spr;made.push(slot);}
    // 舊的第 4、5 款（若有）指到新圖，不留舊美術
    for(const key of Object.keys(B)){const m=key.match(new RegExp('^'+k+'_1_(\\d+)$'));if(!m)continue;const i=+m[1];if(i>=3&&made.includes(i%3))B[key]=B[k+'_1_'+(i%3)];}
    return made;};

  // ================= k114 國際機場（5×5）=================
  try{
    const K114=[
      // v0 直線航廈＋兩座機庫：跑道沿 u 橫貫前緣（09/27），平行滑行道＋兩條聯絡道；後側陸側（立體停車場、平面停車場、聯外道路）；
      // 長條玻璃航廈三座登機橋＋三架客機機頭朝內；右側兩座拱頂機庫（一座開門露出機頭）、塔台與油庫在後；左端消防站
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,dashV,WHT,YEL,RED,stallsU,stallsV,stain,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,bridgeDraw,bridge2,termLin,hangar,ctower,ctowerSh,tank,fireSt,garage,
          car,carRow,bus,bagTrain,fuelTruck,cater,tug,arff,mast,lamp,tree,bush,windsock,fence,flat,BL,RC}=L;
        const D=(u,v)=>v*10+u*.3;
        grass(g,0,0,SZ,SZ,11401,'u');
        // 陸側
        pave(g,'a',0,.66,3.42,.64,11402);lineU(g,.66,0,3.42,'#d9d5c9');dashU(g,.8,0,3.3,WHT,.08,.08);lineU(g,.95,0,3.42,YEL);dashU(g,1.12,0,3.3,WHT,.08,.08);
        pave(g,'c',.12,.08,1.3,.58,11403);
        pave(g,'a',1.52,.1,1.8,.54,11404);stallsU(g,1.6,.12,1.6,16,.2);stallsU(g,1.6,.42,1.6,16,.2);
        pave(g,'c',3.42,.06,1.54,1.94,11405);
        // 空側機坪
        pave(g,'c',0,1.3,.72,.7,11406);
        pave(g,'c',0,2.0,SZ,1.44,11407);
        lineU(g,2.0,0,SZ,'#a7a49b');
        // 機坪標線：服務車道（白線＋虛線）、滑行線（黃）、各機位導入線＋停止線、設備限制線（紅）
        const GU=[1.3,2.14,2.98],PV=2.5,GA=-2.02,RS=[4.25,2.72,1.04],gc=Math.cos(GA),gs=Math.sin(GA);
        lineU(g,3.07,0,3.42,WHT);lineU(g,3.2,0,3.42,WHT);dashU(g,3.135,.05,3.4,WHT,.06,.06);
        lineU(g,3.32,0,SZ,YEL);
        // 斜向機頭朝內機位：導入線沿機身軸線接到滑行線，停止線橫在機頭前，兩側紅色設備限制線
        for(const gu of GU){const N=[gu+gc*.43,PV+gs*.43],t1=(3.32-N[1])/(-gs);BL(g,P(...N),P(N[0]-gc*t1,N[1]-gs*t1),YEL);
          BL(g,P(N[0]+gs*.07,N[1]-gc*.07),P(N[0]-gs*.07,N[1]+gc*.07),YEL);
          for(const e of[-1,1]){const o=[-gs*e*.45,gc*e*.45];BL(g,P(gu+o[0]+gc*.42,PV+o[1]+gs*.42),P(gu+o[0]-gc*.5,PV+o[1]-gs*.5),RED);}}
        // 遠機位（機庫前）：斜停一架廣體機，導入線斜接滑行線
        BL(g,P(RS[0]+.62*Math.cos(RS[2]),RS[1]+.62*Math.sin(RS[2])),P(RS[0]-.2*Math.cos(RS[2]),RS[1]-.2*Math.sin(RS[2])),YEL);
        // 滑行道、聯絡道、跑道
        taxiway(g,ng,'u',3.44,3.66,0,SZ);
        for(const cu of[.3,4.45]){taxiway(g,ng,'v',cu,cu+.22,3.66,3.9,{lights:false});holdLine(g,'v',cu,cu+.22,3.73,1);}
        runway(g,ng,'u',3.9,4.5,0,SZ,{nums:['09','27'],seed:11409});
        // 地面落影
        L.shadow(g,[['b',.72,1.3,2.6,.7,18],['b',.14,1.38,.46,.54,9],['b',.16,1.4,.12,.12,19],['b',.18,.12,1.12,.48,13],['b',3.46,1.0,.7,.95,20],['b',4.22,1.0,.7,.95,20],
          ...ctowerSh(3.84,.52,62),['c',4.4,.34,.14,14],['c',4.72,.46,.12,12],['c',4.5,.72,.09,9],
          ...GU.flatMap(gu=>planeSh(planeGeo(gu,PV,GA,{}))),...planeSh(planeGeo(RS[0],RS[1],RS[2],{wide:1}))]);
        // 陸側建物
        garage(S,.18,.12,1.12,.48,3,11410,D(1.3,.6));
        carRow(S,[[1.62,.14,false,'#b8433a'],[1.82,.14,false,'#e8ecee'],[1.92,.14,false,'#3d5f8a'],[2.22,.14,false,'#c9c3b4'],[2.42,.14,false,'#5d6468'],[2.72,.14,false,'#e8ecee'],[2.92,.14,false,'#9a3a33'],[3.12,.14,false,'#3d5f8a'],
          [1.72,.47,false,'#c9c3b4'],[2.02,.47,false,'#3d5f8a'],[2.12,.47,false,'#e8ecee'],[2.52,.47,false,'#b8433a'],[2.82,.47,false,'#2f2f33'],[3.02,.47,false,'#c9c3b4']],D(3.3,.62));
        for(const[u,v,c,al]of[[.3,.7,'#e8ecee',true],[1.9,.84,'#3d5f8a',true],[2.8,.7,'#c9a23a',true]])car(S,u,v,al,c,D(u+.13,v+.07));
        bus(S,.95,.84,true,'#2f6aa8',D(1.2,.92));
        // 塔台、油庫（後側）
        ctower(S,3.84,.52,62,{base:[.42,.36,12],d:D(4.1,.72)});
        S.gl(g2=>fence(g2,[3.44,.06],[4.95,.06]));
        S.o(D(4.95,.95),(g2)=>{L.boxZ(g2,4.22,.16,.72,.76,0,2,'#b3aea3','#c7c2b6','#9a958a');flat(g2,4.25,.19,.66,.7,'#a9a397',2);});
        tank(S,4.4,.34,.14,14,D(4.55,.5));tank(S,4.72,.46,.12,12,D(4.85,.6));tank(S,4.5,.72,.09,9,D(4.6,.82));
        // 航廈＋登機橋
        termLin(S,.72,1.3,2.6,.7,15,{rise:4,seed:11411,d:D(3.32,2.0),sign:'#2f6aa8',units:4});
        fireSt(S,.12,1.36,.5,.58,9,D(.62,1.94));
        arff(S,.16,2.02,false,D(.24,2.22));arff(S,.4,2.04,false,D(.48,2.24));
        const LIV=[['#c8413a','#c8413a'],['#2f5f9a','#2f5f9a'],['#2f8a6a','#e0a030']];
        GU.forEach((gu,i)=>{const G=planeGeo(gu,PV,GA,{}),dr=G.door(-1);
          S.o(D(gu,2.2),(g2,n2)=>bridge2(g2,n2,[dr[0]+.02,2.0],[dr[0]+.02,2.14],[dr[0]-.01,dr[1]],6,3,{}));
          plane(S,gu,PV,GA,{liv:LIV[i][0],tail:LIV[i][1],d:D(gu,2.62)});
          });
        bagTrain(S,GU[0]+.2,2.76,false,3,1,D(GU[0]+.25,3.02));bagTrain(S,GU[1]+.2,2.78,false,2,2,D(GU[1]+.25,3.0));
        fuelTruck(S,GU[2]+.2,2.74,false,D(GU[2]+.27,2.98));
        bus(S,.12,2.62,false,'#2f6aa8',D(.2,2.9));bus(S,.26,2.66,false,'#2f6aa8',D(.34,2.94));
        // 機庫
        hangar(S,3.46,1.0,.7,.95,14,9,{d:D(4.16,1.95)+2,sign:'#2f6aa8',seed:11412});
        hangar(S,4.22,1.0,.7,.95,14,9,{d:D(4.92,1.95)+2,open:.62,seed:11413,
          inside:(g2,n2)=>{const G=planeGeo(4.57,1.52,Math.PI/2,{});planeDraw(g2,null,G,{liv:'#e0a030'});}});
        // 遠機位：廣體機＋推機車
        plane(S,RS[0],RS[1],RS[2],{wide:1,liv:'#6a3f9a',tail:'#6a3f9a',d:D(RS[0],RS[1]+.3)});
        tug(S,RS[0]+.55*Math.cos(RS[2])-.03,RS[1]+.55*Math.sin(RS[2])-.03,false,D(4.6,3.3));
        // 照明、標誌
        mast(S,.64,2.08,34,D(.64,2.08));mast(S,3.38,2.1,34,D(3.38,2.1));
        tsign(S,.2,3.7,D(.2,3.7));tsign(S,4.75,3.7,D(4.75,3.7));tsign(S,2.4,3.74,D(2.4,3.74));
        windsock(S,.5,4.72,D(.5,4.72));windsock(S,4.4,4.7,D(4.4,4.7));
        for(const[u,v,s,k]of[[3.36,.2,.8,0],[3.36,.5,.7,1],[.08,.72,.7,2]])tree(S,u,v,s,k);
        return{front:(g2)=>{fence(g2,[SZ-.05,.06],[SZ-.05,SZ-.05]);fence(g2,[.05,SZ-.05],[SZ-.05,SZ-.05]);fence(g2,[.05,2.0],[.05,SZ-.05]);}};
      },
      // v1 弧形航廈＋單機庫＋兩條平行滑行道：跑道沿 v 在右前緣（18/36）；弧形玻璃航廈環抱後角陸側（放射停車場＋弧形車道＋塔台），
      // 四個登機口放射排開（中間一架廣體機），機坪前方一座拱頂維修機庫；前緣帶：油庫、員工停車、消防站
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,dashV,WHT,YEL,RED,stallsU,stallsV,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,bridgeDraw,bridge2,arcPts,arcBand,arcLine,termArc,hangar,ctower,ctowerSh,tank,fireSt,office,
          car,carRow,bus,bagTrain,fuelTruck,cater,tug,arff,mast,tree,bush,windsock,fence,flat,BL,RC,boxZ}=L;
        const CU=-.35,CV=-.35,R0=1.72,R1=2.28,rad=d=>d*Math.PI/180,T0=rad(15),T1=rad(75),at=(r,t)=>[CU+r*Math.cos(t),CV+r*Math.sin(t)];
        grass(g,0,0,SZ,SZ,11421,'v');
        pave(g,'c',0,0,3.42,3.3,11422);
        // 陸側：後角放射停車場＋弧形車道（兩端出到後側兩緣接城市道路）
        arcBand(g,CU,CV,0,1.42,0,Math.PI/2,'#6d6c68');arcBand(g,CU,CV,1.42,1.72,0,Math.PI/2,'#5f5e5a');
        arcLine(g,CU,CV,1.42,0,Math.PI/2,'#d9d5c9');arcLine(g,CU,CV,1.57,0,Math.PI/2,WHT,40,(x,y)=>(x>>2)%2===0);
        for(const r of[.86,1.2])for(let d=12;d<=78;d+=5){const a=at(r-.12,rad(d)),b=at(r+.12,rad(d));BL(g,P(...a),P(...b),'#c9c5bb');}
        arcLine(g,CU,CV,R1+.02,T0,T1,'#a7a49b');
        // 機坪：各機位導入線（放射）、滑行線弧、設備限制線
        const GT=[21,39,57,73],WD=[0,1,0,0];
        arcLine(g,CU,CV,3.42,rad(8),rad(84),YEL,48);
        GT.forEach((d,i)=>{const t=rad(d);BL(g,P(...at(R1+.1,t)),P(...at(3.42,t)),YEL);const s0=at(R1+.12,t-.02),s1=at(R1+.12,t+.02);BL(g,P(...s0),P(...s1),YEL);
          for(const e of[-1,1]){const tt=t+e*rad(8.2);BL(g,P(...at(R1+.08,tt)),P(...at(3.3,tt)),RED);}});
        // 滑行道 A／B、聯絡道、跑道
        taxiway(g,ng,'v',3.44,3.64,0,SZ);taxiway(g,ng,'v',3.8,4.0,0,SZ);
        for(const v of[1.55,3.35])taxiway(g,ng,'u',v,v+.2,3.64,3.8,{lights:false});
        for(const v of[.3,4.5]){taxiway(g,ng,'u',v,v+.2,4.0,4.28,{lights:false});holdLine(g,'u',v,v+.2,4.07,1);}
        runway(g,ng,'v',4.28,4.88,0,SZ,{nums:['18','36'],seed:11424});
        // 前緣帶鋪面：機庫前坪、員工停車、消防站前坪與出車道
        pave(g,'c',2.3,3.3,1.14,.3,11425);
        pave(g,'a',1.35,3.55,.85,.62,11426);stallsU(g,1.4,3.58,.76,8,.2);stallsU(g,1.4,3.95,.76,8,.2);
        pave(g,'c',2.42,4.12,1.02,.3,11427);lineU(g,4.27,2.42,3.44,YEL);
        L.shadow(g,[['pr',arcPts(CU,CV,R1,T0,T1,20).concat(arcPts(CU,CV,R0,T1,T0,20)),17,0],...ctowerSh(.74,.22,66),['b',.6,.08,.28,.28,10],['b',.08,.32,.38,.4,27],
          ['b',2.4,2.28,.92,.9,21],['b',2.5,3.62,.6,.5,9],['c',.55,3.85,.16,14],['c',.95,4.1,.14,12],['c',.5,4.3,.1,9],
          ...GT.flatMap((d,i)=>{const r=R1+.08+(WD[i]?.5:.41),c=at(r,rad(d));return planeSh(planeGeo(c[0],c[1],rad(d)+Math.PI,{wide:WD[i]}));})]);
        // 陸側：塔台＋停車
        ctower(S,.74,.22,66,{base:[.28,.28,10],d:1.0});office(S,.08,.32,.38,.4,4,11432,{band:'#2f6aa8',d:.95,doorAt:.5});
        for(const[t,al,c]of[[25,false,'#e8ecee'],[58,true,'#c9a23a']]){const p=at(1.5,rad(t));car(S,p[0],p[1],al,c,2.2);}
        {const p=at(1.62,rad(44));bus(S,p[0]-.1,p[1]-.05,true,'#2f6aa8',2.3);}
        // 航廈＋登機橋＋飛機
        termArc(S,CU,CV,R0,R1,T0,T1,14,{rise:5,seed:11430,d:2.6,units:5,n:24});
        const LIV=['#c8413a','#2f5f9a','#e0a030','#2f8a6a'];
        GT.forEach((d,i)=>{const t=rad(d),r=R1+.08+(WD[i]?.5:.41),c=at(r,t),G=planeGeo(c[0],c[1],t+Math.PI,{wide:WD[i]}),dr=G.door(-1),ph=Math.atan2(dr[1]-CV,dr[0]-CU)+.06,F=at(R1-.01,ph),Kn=at(R1+.16,ph);
          const dd=c[0]+c[1];
          S.o(dd-.3,(g2,n2)=>bridge2(g2,n2,F,Kn,dr,6,WD[i]?4:3,{}));
          plane(S,c[0],c[1],t+Math.PI,{wide:WD[i],liv:LIV[i],d:dd});
          });
        {const c=at(2.86,rad(39));bagTrain(S,c[0]+.2,c[1]-.34,true,3,4,c[0]+c[1]+.1);}
        {const c=at(2.77,rad(57));fuelTruck(S,c[0]+.16,c[1]-.02,false,c[0]+c[1]+.4);}
        {const c=at(2.77,rad(21));bagTrain(S,c[0]+.05,c[1]+.24,true,2,5,c[0]+c[1]+.45);}
        // 維修機庫（門朝 +v，前坪）
        hangar(S,2.4,2.28,.92,.9,13,8,{d:6.4,open:.45,sign:'#c8413a',seed:11431,
          inside:(g2)=>{const G=planeGeo(2.86,2.72,Math.PI/2,{kind:'jet',len:.72,span:.7});planeDraw(g2,null,G,{liv:'#2f5f9a'});}});
        tug(S,2.8,3.32,false,6.5);
        // 地勤車輛停放區（滑行道 B 旁）：兩列行李拖板、接駁巴士
        lineV(g,2.98,.12,1.45,WHT);lineV(g,3.4,.12,1.45,WHT);for(let v=.12;v<1.46;v+=.19)BL(g,P(2.98,v),P(3.4,v),'#d9d5c9');
        bagTrain(S,3.03,.16,false,4,21,3.03+.5);bagTrain(S,3.2,.2,false,3,22,3.2+.45);bagTrain(S,3.05,.72,false,2,23,3.05+.95);
        bus(S,3.08,1.1,false,'#2f6aa8',3.2+1.4);bus(S,3.22,1.12,false,'#2f6aa8',3.32+1.42);
        // 前緣帶：油庫、員工停車、消防站
        S.o(4.2,(g2)=>{boxZ(g2,.22,3.6,.98,.95,0,2,'#b3aea3','#c7c2b6','#9a958a');flat(g2,.25,3.63,.92,.89,'#a9a397',2);});
        tank(S,.55,3.85,.16,14,4.6);tank(S,.95,4.1,.14,12,5.2);tank(S,.5,4.3,.1,9,4.9);
        carRow(S,[[1.42,3.6,false,'#b8433a'],[1.62,3.6,false,'#e8ecee'],[1.72,3.6,false,'#3d5f8a'],[1.92,3.6,false,'#c9c3b4'],[1.52,3.97,false,'#5d6468'],[1.82,3.97,false,'#e8ecee'],[2.02,3.97,false,'#2f2f33']],5.9);
        fireSt(S,2.5,3.62,.6,.5,9,6.2);arff(S,2.6,4.15,true,6.9);arff(S,2.95,4.2,true,7.3);
        // 照明、標誌、點景
        mast(S,2.28,3.42,34,5.7);mast(S,3.36,.2,34,3.56);
        tsign(S,3.72,.25,3.97);tsign(S,4.14,4.45,8.6);tsign(S,3.72,3.3,7.02);
        windsock(S,4.14,2.4,6.55);
        for(const[u,v,s,k]of[[1.3,4.5,.8,0],[1.7,4.6,.9,1],[2.1,4.55,.8,2],[.2,4.75,.7,1]])tree(S,u,v,s,k);
        bush(S,1.5,4.3);bush(S,2.3,4.6);
        return{front:(g2)=>{fence(g2,[SZ-.05,.05],[SZ-.05,SZ-.05]);fence(g2,[.05,SZ-.05],[SZ-.05,SZ-.05]);fence(g2,[2.95,.05],[SZ-.05,.05]);fence(g2,[.05,2.95],[.05,SZ-.05]);}};
      },
      // v2 衛星廊廳＋雙跑道段（與 v0 反向配置，剪影分開）：前後兩條平行跑道（09L/27R 在後、09R/27L 在前），各配平行滑行道；
      // 陸側主航廈改在右端（東南緣進出的落客道＋停車場），高架連通廊往左跨機坪通到中央圓形衛星廊廳，四架客機繞衛星停靠（左側一架廣體機）；
      // 左端一座維修機庫（門朝前坪）、塔台獨立立在左前端兩跑道之間的草地上；北角消防站、救援車與油槽
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,dashV,WHT,YEL,RED,stallsU,stallsV,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,bridge2,arcLine,satellite,hangar,ctower,ctowerSh,tank,fireSt,
          car,carRow,bus,bagTrain,fuelTruck,tug,arff,mast,lamp,tree,bush,windsock,fence,flat,BL,RC,boxZ,faceL,faceR,winL,winR}=L;
        const SC=[2.16,2.5],SR=.42,rad=d=>d*Math.PI/180,at=(r,t)=>[SC[0]+r*Math.cos(t),SC[1]+r*Math.sin(t)];
        const TU=3.72,TV=1.28,TDU=1.1,TDV=1.42,TH=17,TWR=[.47,3.25];
        grass(g,0,0,SZ,SZ,11441,'u');
        // 機坪（中段）、左端機庫前坪、右端陸側人行鋪面；北角支援區＋服務道路
        pave(g,'c',.9,1.08,2.76,2.82,11442);pave(g,'c',0,1.08,.9,1.62,11455);pave(g,'p',3.66,1.08,1.34,1.64,11456);
        pave(g,'c',0,0,1.44,1.08,11447);pave(g,'a',.06,.9,1.3,.18,11448);
        // 塔台基地（草地上一塊鋪面＋一條服務小路接前坪）
        pave(g,'a',.42,2.7,.12,.32,11457);pave(g,'p',.22,3.0,.5,.52,11458);
        // 後跑道＋滑行道
        runway(g,ng,'u',.16,.72,1.5,SZ,{nums:['09','27'],let:['L','R'],seed:11443,k:.8,bp:.14,tdz:false});
        taxiway(g,ng,'u',.88,1.08,1.3,SZ);
        for(const u of[1.6,4.6]){taxiway(g,ng,'v',u,u+.2,.68,.88,{lights:false});holdLine(g,'v',u,u+.2,.84,-1);}
        // 前跑道＋滑行道
        taxiway(g,ng,'u',3.9,4.1,0,SZ);
        for(const u of[.4,4.5]){taxiway(g,ng,'v',u,u+.2,4.1,4.3,{lights:false});holdLine(g,'v',u,u+.2,4.14,1);}
        runway(g,ng,'u',4.26,4.82,0,SZ,{nums:['09','27'],let:['R','L'],seed:11444,bp:.16});
        // 機坪標線：衛星外圈滑行線（繞左側）、放射導入線、設備限制線
        arcLine(g,SC[0],SC[1],1.36,rad(30),rad(300),YEL,60);
        const GT=[180,120,60,270],WD=[1,0,0,0];
        GT.forEach((d,i)=>{const t=rad(d);BL(g,P(...at(SR+.1,t)),P(...at(1.36,t)),YEL);for(const e of[-1,1]){const tt=t+e*rad(24);BL(g,P(...at(SR+.1,tt)),P(...at(1.2,tt)),RED);}});
        // 陸側（右端）：航廈前落客道（由東南緣進出）、停車場
        pave(g,'a',3.66,2.72,1.34,.34,11445);lineU(g,2.72,3.66,SZ,'#d9d5c9');dashU(g,2.89,3.7,SZ,WHT,.08,.08);
        pave(g,'a',3.66,3.1,1.3,.76,11446);stallsU(g,3.72,3.14,1.16,12,.22);stallsU(g,3.72,3.6,1.16,12,.22);lineU(g,3.48,3.7,4.9,WHT);
        L.shadow(g,[['b',TU,TV,TDU,TDV,TH],...ctowerSh(TWR[0],TWR[1],58),['b',TWR[0]-.14,TWR[1]-.14,.28,.28,9],['b',.7,.3,.5,.42,9],['b',.72,.32,.12,.12,18],['c',.28,.18,.1,9],['c',.54,.16,.08,7],
          ['b',.08,1.12,.84,.66,20],['c',SC[0],SC[1],SR,16],['b',SC[0]+SR-.02,SC[1]-.06,TU-(SC[0]+SR-.02),.12,5,6],
          ...GT.flatMap((d,i)=>{const r=SR+.08+(WD[i]?.5:.41),c=at(r,rad(d));return planeSh(planeGeo(c[0],c[1],rad(d)+Math.PI,{wide:WD[i]}));})]);
        // 陸側與空側之間的圍籬（先畫在地面層，前方車輛會蓋過）
        S.gl(g2=>fence(g2,[3.64,2.72],[3.64,3.88]));
        // 北角：油槽、消防站（門朝 +v 對服務道路）、救援車
        tank(S,.28,.18,.1,9,.5);tank(S,.54,.16,.08,7,.72);
        fireSt(S,.7,.3,.5,.42,9,1.5);arff(S,.74,.8,true,1.7);
        // 左端：維修機庫（門朝 +v 對前坪）＋推機車
        hangar(S,.08,1.12,.84,.66,14,8,{d:2.4,sign:'#6a3f9a',seed:11452});
        tug(S,.5,1.96,true,2.6);
        // 獨立塔台（左前端、兩跑道之間）
        ctower(S,TWR[0],TWR[1],58,{base:[.28,.28,9],d:TWR[0]+TWR[1]+.3});
        bush(S,.26,3.5,3);bush(S,.7,3.52,2);
        // 衛星廊廳＋登機橋＋飛機（左側 180° 機位是廣體機）
        satellite(S,SC[0],SC[1],SR,13,{d:SC[0]+SC[1]+.1,seed:11451});
        // 高架連通廊（沿 u，架在柱上，往右接陸側主航廈）
        S.o(SC[0]+SC[1]+.14,(g2,n2)=>{const v0=SC[1]-.06,v1=SC[1]+.06,ua=SC[0]+SR-.02,ub=TU+.02,z=6;
          for(let u=ua+.16;u<ub-.08;u+=.3){boxZ(g2,u,v0+.03,.04,.06,0,z,'#c9cdcf','#b9bec1','#7f878b');}
          boxZ(g2,ua,v0,ub-ua,v1-v0,z,5,'#e7ebec','#8fb3c9','#5d7f95');faceL(g2,v1,ua,ub,z,z+1,'#dfe3e5');faceL(g2,v1,ua,ub,z+4,z+5,'#eef1f1');
          if(n2)for(let k=0;k<9;k++){const p=P(ua+.06+k*.12,v1,z+3);if(ua+.06+k*.12>ub-.06)break;RC(n2,p[0],p[1]-1,2,1,'#e9f0ff');}});
        const LIV=['#6a3f9a','#2f8a6a','#c8413a','#2f5f9a'];
        GT.forEach((d,i)=>{const t=rad(d),r=SR+.08+(WD[i]?.5:.41),c=at(r,t),G=planeGeo(c[0],c[1],t+Math.PI,{wide:WD[i]}),back=d===270,dr=G.door(back?-1:1),
            ph=Math.atan2(dr[1]-SC[1],dr[0]-SC[0])+(back?.3:-.3),F=at(SR-.01,ph),Kn=at(SR+.15,ph);
          const dd=c[0]+c[1]+(back?-.6:0),bd=back?dd-.5:d===180?dd+.05:Math.max(dd-.25,SC[0]+SC[1]+.2);
          S.o(bd,(g2,n2)=>bridge2(g2,n2,F,Kn,dr,6,WD[i]?4:3,{}));
          plane(S,c[0],c[1],t+Math.PI,{wide:WD[i],liv:LIV[i],d:dd});});
        {const c=at(.91,rad(120));bagTrain(S,c[0]-.42,c[1]+.08,false,3,6,c[0]+c[1]+.3);}
        {const c=at(.91,rad(60));fuelTruck(S,c[0]+.22,c[1]+.02,false,c[0]+c[1]+.4);}
        bus(S,3.08,3.28,true,'#2f6aa8',3.08+.26+3.36);bus(S,3.08,3.55,true,'#2f6aa8',3.08+.26+3.63);
        // 陸側主航廈（右端）：平頂、+v 面入口玻璃＋下客雨遮、+u 面玻璃；連通廊從看不到的 -u 面接進來
        S.o(TU+TDU+TV,(g2,n2)=>{const u0=TU,v0=TV,du=TDU,dv=TDV,h=TH,u1=u0+du,v1=v0+dv;
          boxZ(g2,u0,v0,du,dv,0,h,'#a9b1b4','#8fb3c9','#5d7f95');
          for(const[za,zb]of[[0,1],[6,8],[h-2,h]]){faceL(g2,v1,u0,u1,za,zb,za?'#eef1f1':'#6d7471');faceR(g2,u1,v0,v1,za,zb,za?'#aab2b6':'#5a605e');}
          L.ribsL(g2,u0,u1,v1,0,h,'#6a8ea6',3,1);L.ribsR(g2,u1,v0,v1,0,h,'#46647a',3,1);
          flat(g2,u0+.04,v0+.04,du-.08,dv-.08,'#c4cbce',h);for(let t=v0+.2;t<v1-.1;t+=.28)flat(g2,u0+.2,t,du-.4,.1,'#9fbccb',h);
          boxZ(g2,u0+.3,v0+.25,.2,.16,h,3,'#b4bbbe','#c8ced0','#8b9397');boxZ(g2,u0+.65,v0+.9,.16,.14,h,3,'#b4bbbe','#c8ced0','#8b9397');
          // 下客雨遮（+v 面）
          boxZ(g2,u0+.08,v1,du-.16,.12,8,1,'#f1f3f3','#dfe3e5','#9aa2a6');for(const t of[u0+.12,u0+.5,u0+.9]){const p=P(t,v1+.11,0);RC(g2,p[0],p[1]-8,1,8,'#8d959a');}
          faceL(g2,v1,u0+.3,u0+.8,h-5,h-2,'#2f6aa8');
          if(n2){for(let k=0;k<13;k++)for(const z of[2,10]){if(hsh(11449,k,z)<.4)continue;winL(n2,u0+.06+k*.08,v1,z,2,3,'#ffe6a8');}
            for(let k=0;k<17;k++)for(const z of[2,10]){if(hsh(11450,k,z)<.45)continue;winR(n2,u1,v1-.1-k*.08,z,2,3,'#e9f0ff');}}});
        // 陸側車輛、停車場、照明
        const lot=[];for(let k=0;k<12;k++)for(const v of[3.15,3.62]){if(hsh(11453,k,v*10|0)<.35)continue;lot.push([3.75+k*.097,v,false,['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#2f2f33'][Math.floor(hsh(11454,k,v*10|0)*6)]]);}
        carRow(S,lot,8.4);
        bus(S,3.8,2.76,true,'#3d8a5a',3.8+.26+2.84);car(S,4.2,2.78,true,'#e8ecee',4.33+2.85);car(S,4.55,2.9,true,'#c9a23a',4.68+2.97);
        lamp(S,3.7,3.48,13);lamp(S,4.92,3.48,13);
        // 照明、標誌、點景
        mast(S,2.62,1.14,34,3.76);
        tsign(S,1.5,.8,2.3);tsign(S,4.55,4.2,8.75);tsign(S,.3,4.2,4.5);
        windsock(S,.25,4.92,5.17);windsock(S,4.8,.8,5.6);
        for(const[u,v,s,k]of[[4.92,1.9,.7,1],[4.92,2.22,.6,2],[.12,2.9,.7,0]])tree(S,u,v,s,k);
        return{front:(g2)=>{fence(g2,[SZ-.05,.05],[SZ-.05,SZ-.05],[[.55,.61]]);fence(g2,[.05,SZ-.05],[SZ-.05,SZ-.05]);fence(g2,[1.45,.05],[SZ-.05,.05]);fence(g2,[3.64,3.88],[SZ-.05,3.88]);}};
      },
    ];
    build(114,K114);
  }catch(e){console.error('trans_b k114',e);errs.push('k114:'+(e&&e.stack||e));}

  // ================= k19 機場（4×4，區域機場；繪製端在 radarAt 畫旋轉雷達）=================
  try{
    const PROP={kind:'prop'},RJ={kind:'jet',len:.62,span:.56,w:.08,fh:3,fin:6};
    const K19=[
      // v0 塔台在航廈旁：跑道沿 u 在前緣（09/27）＋平行滑行道；單層玻璃航廈（空側雨遮）緊鄰塔台，兩架渦槳機斜停機坪；
      // 右側拱頂機庫（半開、機頭在內）；後側停車場與聯外道路；右後角碎石圍場內雷達塔
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,WHT,YEL,RED,stallsU,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,termSmall,hangar,ctower,ctowerSh,
          carRow,car,fuelTruck,bagTrain,tug,mast,tree,bush,windsock,fence,radarTower,flat,BL}=L;
        grass(g,0,0,SZ,SZ,1901,'u');
        pave(g,'a',0,.8,2.6,.2,1902);lineU(g,.8,0,2.6,'#d9d5c9');dashU(g,.9,0,2.5,WHT,.08,.08);
        pave(g,'a',.3,.12,2.0,.64,1903);stallsU(g,.36,.14,1.88,16,.2);stallsU(g,.36,.54,1.88,16,.2);
        pave(g,'c',.2,1.0,2.55,1.45,1904);pave(g,'c',2.72,1.7,1.08,.75,1905);
        pave(g,'k',3.28,.1,.62,.56,1906);
        taxiway(g,ng,'u',2.45,2.63,.15,3.85);
        for(const u of[.3,3.5]){taxiway(g,ng,'v',u,u+.18,2.63,2.95,{lights:false});holdLine(g,'v',u,u+.18,2.7,1);}
        runway(g,ng,'u',2.92,3.48,0,SZ,{nums:['09','27'],seed:1907,k:.7,bp:.14,tdz:false});
        // 機坪：兩個斜停機位（導入線＋停止線）
        const PA=-2.25,PS=[[.86,2.02],[1.72,2.02]];
        for(const[u,v]of PS){const c=Math.cos(PA),s=Math.sin(PA);BL(g,P(u-c*.45,v-s*.45),P(u+c*.2,v+s*.2),YEL);BL(g,P(u+c*.2-s*.05,v+s*.2+c*.05),P(u+c*.2+s*.05,v+s*.2-c*.05),YEL);}
        lineU(g,2.36,.2,2.75,YEL);
        L.shadow(g,[['b',.35,1.0,1.4,.5,9],...ctowerSh(1.98,1.22,30,{r:.055,rc:.1}),['b',1.83,1.08,.3,.28,8],['b',2.78,.85,.9,.85,16],['p',3.58,.36,30],['p',3.62,.4,30],
          ...PS.flatMap(([u,v])=>planeSh(planeGeo(u,v,PA,PROP)))]);
        S.gl(g2=>{fence(g2,[3.28,.1],[3.9,.1]);fence(g2,[3.28,.1],[3.28,.66]);});
        carRow(S,[[.4,.16,false,'#b8433a'],[.6,.16,false,'#e8ecee'],[.72,.16,false,'#3d5f8a'],[1.08,.16,false,'#c9c3b4'],[1.3,.16,false,'#5d6468'],[1.66,.16,false,'#e8ecee'],[1.9,.16,false,'#9a3a33'],
          [.5,.56,false,'#c9c3b4'],[.84,.56,false,'#3d5f8a'],[.96,.56,false,'#e8ecee'],[1.42,.56,false,'#b8433a'],[1.78,.56,false,'#2f2f33'],[2.1,.56,false,'#c9c3b4']],2.9);
        car(S,.5,.84,true,'#e8ecee',1.4);car(S,1.6,.84,true,'#c9a23a',2.5);
        const ra=radarTower(S,3.6,.38,30,4.0);
        termSmall(S,.35,1.0,1.4,.5,9,'v',{seed:1908,d:1.75+1.5});
        ctower(S,1.98,1.22,30,{r:.055,rc:.1,base:[.3,.28,8],d:2.13+1.36});
        hangar(S,2.78,.85,.9,.85,12,7,{d:3.68+1.7,open:.5,sign:'#2f6aa8',seed:1909,inside:(g2)=>{const G=planeGeo(3.23,1.36,Math.PI/2,PROP);planeDraw(g2,null,G,{liv:'#c8413a'});}});
        plane(S,PS[0][0],PS[0][1],PA,Object.assign({liv:'#2f6aa8',d:PS[0][0]+PS[0][1]+.25},PROP));
        plane(S,PS[1][0],PS[1][1],PA,Object.assign({liv:'#c8413a',d:PS[1][0]+PS[1][1]+.25},PROP));
        fuelTruck(S,1.18,1.72,true,1.18+1.72+.25);bagTrain(S,.4,2.2,true,2,1,.4+2.2+.25);tug(S,2.2,1.8,true,2.2+1.86);
        mast(S,.24,1.62,30,1.86);mast(S,2.66,1.62,30,4.28);
        tsign(S,.2,2.72,2.92);tsign(S,3.78,2.72,6.5);
        windsock(S,3.4,3.72,7.12);
        for(const[u,v,s,k]of[[2.45,.2,.8,0],[2.45,.5,.7,1],[.12,.35,.7,2],[3.2,.8,.6,1]])tree(S,u,v,s,k);
        return{radarAt:ra,front:(g2)=>{fence(g2,[SZ-.05,.05],[SZ-.05,SZ-.05]);fence(g2,[.05,SZ-.05],[SZ-.05,SZ-.05]);fence(g2,[3.28,.66],[3.9,.66],[[.35,.6]]);}};
      },
      // v1 塔台獨立在跑道端：跑道沿 v 在右前緣（18/36）＋平行滑行道；塔台單獨立在跑道北端外側草地；
      // 航廈在後（玻璃朝機坪），機坪一架渦槳機＋一架支線噴射機；左前拱頂機庫（門朝 +u 對滑行道）；前緣小油庫；左前角雷達塔
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,WHT,YEL,RED,stallsU,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,termSmall,hangar,ctower,ctowerSh,
          carRow,car,fuelTruck,bagTrain,tug,mast,tree,bush,windsock,fence,radarTower,tank,flat,BL,boxZ}=L;
        grass(g,0,0,SZ,SZ,1921,'v');
        pave(g,'a',0,.74,2.45,.2,1922);lineU(g,.74,0,2.45,'#d9d5c9');dashU(g,.84,0,2.4,WHT,.08,.08);
        pave(g,'a',.3,.1,1.9,.6,1923);stallsU(g,.36,.12,1.78,15,.2);stallsU(g,.36,.48,1.78,15,.2);
        pave(g,'c',.25,.94,2.2,1.46,1924);pave(g,'c',1.25,2.4,1.2,1.2,1925);
        pave(g,'k',.1,3.45,.55,.47,1926);
        taxiway(g,ng,'v',2.45,2.63,.15,3.85);
        for(const v of[.3,3.5]){taxiway(g,ng,'u',v,v+.18,2.63,2.95,{lights:false});holdLine(g,'u',v,v+.18,2.7,1);}
        runway(g,ng,'v',2.92,3.48,0,SZ,{nums:['18','36'],seed:1927,k:.7,bp:.14,tdz:false});
        lineV(g,2.36,.94,3.6,YEL);
        const PA1=[-2.3,-2.2],PS=[[.95,1.9],[1.85,1.95]];
        PS.forEach(([u,v],i)=>{const c=Math.cos(PA1[i]),s=Math.sin(PA1[i]);BL(g,P(u-c*.45,v-s*.45),P(u+c*.2,v+s*.2),YEL);});
        L.shadow(g,[['b',.35,.95,1.3,.48,9],...ctowerSh(3.72,.4,32,{r:.055,rc:.1}),['b',3.58,.26,.28,.28,6],['b',.3,2.65,.95,.85,17],['p',.38,3.68,28],['p',.42,3.72,28],
          ['c',1.85,3.72,.1,8],['c',2.15,3.75,.08,7],...planeSh(planeGeo(PS[0][0],PS[0][1],PA1[0],PROP)),...planeSh(planeGeo(PS[1][0],PS[1][1],PA1[1],RJ))]);
        S.gl(g2=>fence(g2,[.1,3.45],[.65,3.45]));
        carRow(S,[[.4,.14,false,'#b8433a'],[.64,.14,false,'#e8ecee'],[.76,.14,false,'#3d5f8a'],[1.12,.14,false,'#c9c3b4'],[1.36,.14,false,'#5d6468'],[1.72,.14,false,'#e8ecee'],
          [.52,.5,false,'#c9c3b4'],[.88,.5,false,'#3d5f8a'],[1.0,.5,false,'#e8ecee'],[1.48,.5,false,'#b8433a'],[1.84,.5,false,'#2f2f33']],2.7);
        car(S,.9,.78,true,'#e8ecee',1.7);
        termSmall(S,.35,.95,1.3,.48,9,'v',{seed:1928,d:1.65+1.43,band:'#3d8a5a'});
        ctower(S,3.72,.4,32,{r:.055,rc:.1,base:[.28,.28,6],d:4.3});
        hangar(S,.3,2.65,.95,.85,12,7,{door:'u',d:1.25+3.5,open:.55,sign:'#3d8a5a',seed:1929,inside:(g2)=>{const G=planeGeo(.82,3.07,0,PROP);planeDraw(g2,null,G,{liv:'#e0a030'});}});
        plane(S,PS[0][0],PS[0][1],PA1[0],Object.assign({liv:'#3d8a5a',d:PS[0][0]+PS[0][1]+.25},PROP));
        plane(S,PS[1][0],PS[1][1],PA1[1],Object.assign({liv:'#2f5f9a',d:PS[1][0]+PS[1][1]+.3},RJ));
        fuelTruck(S,1.3,1.62,true,1.3+1.62+.3);bagTrain(S,.55,2.12,true,2,2,.55+2.12+.25);tug(S,1.6,2.9,true,1.6+2.96);
        const ra=radarTower(S,.38,3.68,28,4.2);
        S.o(4.6,(g2)=>{boxZ(g2,1.68,3.6,.62,.3,0,1,'#b3aea3','#c7c2b6','#9a958a');});tank(S,1.85,3.72,.1,8,5.7);tank(S,2.15,3.75,.08,7,6.0);
        mast(S,.28,2.3,30,2.58);mast(S,2.38,1.0,30,3.38);
        tsign(S,2.72,.22,2.94);tsign(S,2.72,3.72,6.44);
        windsock(S,3.72,3.3,7.02);
        for(const[u,v,s,k]of[[2.3,.2,.8,0],[2.3,.5,.7,1],[.12,.9,.7,2],[.8,3.8,.7,0],[1.2,3.85,.8,1]])tree(S,u,v,s,k);
        bush(S,1.45,3.8);
        return{radarAt:ra,front:(g2)=>{fence(g2,[SZ-.05,.05],[SZ-.05,SZ-.05]);fence(g2,[.05,SZ-.05],[SZ-.05,SZ-.05]);fence(g2,[.65,3.45],[.65,3.92],[[.3,.7]]);}};
      },
      // v2 兩座機庫＋滑行道環：跑道沿 v 在左後緣（18/36）；平行滑行道、機庫前滑行道、右側聯絡道與機坪前緣滑行線圍成一圈；
      // 後側並排兩座拱頂機庫（門朝 +v，一座開門露出公務機、一架渦槳機正被拖出），前緣小航廈（玻璃正面＋雨遮朝陸側）、右前停車場、右側塔台、右後角雷達塔；
      // 環內機坪：機庫前三架輕型機繫留列、右前直升機坪（停一架直升機）、中央一架渦槳機（避免整片空地）
      (g,ng,S,L,K,SZ)=>{const{P,hsh,pave,grass,lineU,lineV,dashU,dashV,WHT,YEL,RED,stallsU,stallsV,runway,taxiway,holdLine,tsign,planeGeo,planeSh,planeDraw,plane,termSmall,hangar,ctower,ctowerSh,
          carRow,car,fuelTruck,bagTrain,tug,mast,tree,bush,windsock,fence,radarTower,flat,BL}=L;
        grass(g,0,0,SZ,SZ,1941,'v');
        runway(g,ng,'v',.2,.76,0,SZ,{nums:['18','36'],seed:1942,k:.7,bp:.14,tdz:false});
        pave(g,'c',1.13,1.18,2.42,2.24,1943);pave(g,'c',1.45,.84,2.0,.18,1944);
        pave(g,'k',3.5,.08,.45,.5,1945);
        taxiway(g,ng,'v',.95,1.13,.15,3.1);
        for(const v of[.35,2.9]){taxiway(g,ng,'u',v,v+.18,.75,.95,{lights:false});holdLine(g,'u',v,v+.18,.9,-1);}
        taxiway(g,ng,'u',1.0,1.18,1.13,3.73);taxiway(g,ng,'v',3.55,3.73,1.0,3.3);
        lineU(g,3.05,1.13,3.55,YEL);lineU(g,3.05,.95,1.13,YEL);
        // 陸側：航廈前落客道、右前停車場
        pave(g,'a',1.2,3.84,2.8,.16,1946);pave(g,'a',2.98,3.3,1.0,.54,1947);stallsU(g,3.02,3.32,.9,8,.2);stallsU(g,3.02,3.62,.9,8,.2);
        const P1=[1.85,2.62,.8],P2=[2.94,1.6,Math.PI/2];
        {const c=Math.cos(P1[2]),s=Math.sin(P1[2]);BL(g,P(P1[0]-c*.4,P1[1]-s*.4),P(P1[0]+c*.25,P1[1]+s*.25),YEL);}
        lineV(g,2.94,1.18,2.4,YEL);
        // 通用航空繫留列（機庫前滑行道旁三架輕型機，機頭朝滑行道）：每位一條導入線＋機頭橫線
        const GA=[[1.36,1.56],[1.78,1.56],[2.2,1.56]],GAO={kind:'prop',len:.3,span:.38,w:.05,fh:2,fin:4};
        for(const[u,v]of GA){BL(g,P(u,v-.17),P(u,v+.2),YEL);BL(g,P(u-.1,v-.17),P(u+.1,v-.17),YEL);}
        // 直升機坪（深色圓版＋白圈＋H）
        const HC=[3.1,2.62];
        L.fp(g,L.polyC(HC[0],HC[1],.21,24).map(q=>P(q[0],q[1])),'#9a978f');L.arcLine(g,HC[0],HC[1],.18,0,Math.PI*2,WHT,28);
        BL(g,P(HC[0]-.07,HC[1]-.06),P(HC[0]+.07,HC[1]-.06),WHT);BL(g,P(HC[0]-.07,HC[1]+.06),P(HC[0]+.07,HC[1]+.06),WHT);BL(g,P(HC[0],HC[1]-.06),P(HC[0],HC[1]+.06),WHT);
        L.shadow(g,[['b',1.5,.12,.85,.72,21],['b',2.55,.12,.85,.72,21],['b',1.45,3.42,1.4,.42,9],...ctowerSh(3.86,2.2,30,{r:.05,rc:.095}),['p',3.72,.3,28],['p',3.76,.34,28],
          ...planeSh(planeGeo(P1[0],P1[1],P1[2],PROP)),...planeSh(planeGeo(P2[0],P2[1],P2[2],PROP)),...GA.flatMap(([u,v])=>planeSh(planeGeo(u,v,-Math.PI/2,GAO))),['b',HC[0]-.07,HC[1]-.035,.14,.07,4,1]]);
        GA.forEach(([u,v],i)=>plane(S,u,v,-Math.PI/2,Object.assign({liv:['#c8413a','#2f5f9a','#e0a030'][i],d:u+v+.2},GAO)));
        // 停在坪上的直升機：機身（機頭朝 +u、玻璃在 +u 面）、尾桁、滑橇、雙葉旋翼
        S.o(HC[0]+HC[1]+.12,(g2,n2)=>{const[u,v]=HC;
          L.boxZ(g2,u-.21,v-.01,.15,.02,3,1,'#dfe3e5','#cfd4d6','#8e979c');{const t=P(u-.2,v,4);L.RC(g2,t[0],t[1]-3,1,3,'#c8413a');}
          for(const s of[-1,1])BL(g2,P(u-.07,v+s*.045,0),P(u+.08,v+s*.045,0),'#50575c');
          L.boxZ(g2,u-.07,v-.035,.14,.07,1,4,'#f1f3f3','#e2e6e8','#a3acb2');L.faceL(g2,v+.035,u-.07,u+.07,2,3,'#c8413a');L.faceR(g2,u+.07,v-.03,v+.03,2,4,'#3d5a70');
          {const m=P(u,v,5);L.RC(g2,m[0],m[1]-2,1,2,'#6b7378');}
          BL(g2,P(u-.17,v+.1,7),P(u+.17,v-.1,7),'#3a4046');BL(g2,P(u-.1,v-.17,7),P(u+.1,v+.17,7),'#3a4046');
          {const b=P(u,v,8);L.RC(g2,b[0],b[1]-1,1,1,'#c0392b');if(n2)L.RC(n2,b[0],b[1]-1,1,1,'#ff5a48');}});
        S.gl(g2=>{fence(g2,[3.5,.08],[3.95,.08]);fence(g2,[3.5,.08],[3.5,.58]);});
        const ra=radarTower(S,3.72,.3,28,4.05);
        hangar(S,1.5,.12,.85,.72,13,8,{d:2.35+.84,sign:'#c8413a',seed:1948});
        hangar(S,2.55,.12,.85,.72,13,8,{d:3.4+.84,open:.6,seed:1949,inside:(g2)=>{const G=planeGeo(2.975,.5,Math.PI/2,{kind:'jet',len:.5,span:.46,w:.07,fh:3,fin:5});planeDraw(g2,null,G,{liv:'#e8ecee',tail:'#2f2f33'});}});
        plane(S,P2[0],P2[1],P2[2],Object.assign({liv:'#c8413a',d:P2[0]+P2[1]+.3},PROP));tug(S,2.91,1.88,false,2.94+1.97);
        plane(S,P1[0],P1[1],P1[2],Object.assign({liv:'#2f5f9a',d:P1[0]+P1[1]+.3},PROP));
        fuelTruck(S,2.25,2.3,false,2.3+2.5+.1);bagTrain(S,1.35,2.9,true,2,3,1.35+2.95+.2);
        termSmall(S,1.45,3.42,1.4,.42,9,'v',{seed:1950,d:2.85+3.84,band:'#c8413a',door:.45});
        const lot=[];for(let k=0;k<8;k++)for(const v of[3.34,3.64]){if(hsh(1951,k,v*10|0)<.3)continue;lot.push([3.05+k*.112,v,false,['#b8433a','#e8ecee','#3d5f8a','#c9c3b4','#5d6468','#2f2f33'][Math.floor(hsh(1952,k,v*10|0)*6)]]);}
        carRow(S,lot,7.2);car(S,1.6,3.86,true,'#e8ecee',5.6);car(S,2.35,3.86,true,'#c9a23a',6.4);
        ctower(S,3.86,2.2,30,{r:.05,rc:.095,base:[.2,.2,6],d:6.2});
        mast(S,1.18,3.28,30,4.46);mast(S,3.5,1.25,30,4.75);
        tsign(S,.85,.28,1.13);tsign(S,.85,3.2,4.05);
        windsock(S,.88,1.9,2.78);
        for(const[u,v,s,k]of[[1.25,3.9,.6,0],[3.9,3.0,.7,1],[3.9,2.7,.8,2],[1.1,.2,.7,1]])tree(S,u,v,s,k);
        return{radarAt:ra,front:(g2)=>{fence(g2,[SZ-.05,.05],[SZ-.05,3.2]);fence(g2,[.05,SZ-.05],[1.15,SZ-.05]);}};
      },
    ];
    build(19,K19);
  }catch(e){console.error('trans_b k19',e);errs.push('k19:'+(e&&e.stack||e));}

  if(errs.length)window.__trans_b_errs=errs;
  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
