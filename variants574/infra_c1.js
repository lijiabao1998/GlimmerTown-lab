// T575 infra_c1：k157 污水提升站（1×1）／k158 再生水中心（3×3）真實設施風格重畫。
// 分層合成：每個立體主體自成一層（hard 二值化＋深色外框），管線／欄杆／細桿走不描邊的細線層；
// 水面、草地、路面、標線畫在地面層不描粗。夜光按層遮擋（後層實體擦掉被擋住的燈），水面不發光。
// 零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function infra_c1(A){
  const B=A.SPR().bld;
  const SH=A.shade;

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,poly,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<900;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      poly(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      poly(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      poly(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const fL=(g,v,ua,ub,za,zb,c)=>poly(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const fR=(g,u,va,vb,za,zb,c)=>poly(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const flatQ=(g,u0,v0,du,dv,c,z=0)=>poly(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(Math.round(x0)+i,Math.round(y0)+o,1,h);}};
    // 牆面上的整數平行四邊形：winL 在 +v 面（錨點＝左下），winR 在 +u 面（錨點＝右下）
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0]-w+1,p[1]-h+Math.floor((w-1)*.5),w,h,-.5,c);};
    const louvL=(g,u,v,z,w,rows,fr,sl)=>{winL(g,u,v,z,w,rows*2+1,fr);for(let r=0;r<rows;r++)winL(g,u,v,z+1+r*2,w,1,sl);};
    const louvR=(g,u,v,z,w,rows,fr,sl)=>{winR(g,u,v,z,w,rows*2+1,fr);for(let r=0;r<rows;r++)winR(g,u,v,z+1+r*2,w,1,sl);};
    // 分層場景：o=立體主體（描外框）、t=細線層（不描邊）；依 d 由後往前
    const scene=(g,ng)=>{const items=[];
      const run=()=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;
        while(k<items.length){const it=items[k];const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      };
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    const done=(c,g,nc,opt)=>{const[sc]=A.cv(W,H);return K.finish(c,g,sc,nc,opt);};
    // 落影（光從左 ⇒ 影子落向右）：list=[u0,v0,du,dv,h]
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H);
      for(const[u0,v0,du,dv,h]of list){const k=h/64,u1=u0+du,v1=v0+dv;
        const F=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],T=[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
        poly(sx,F,'#101418');poly(sx,T,'#101418');for(let i=0;i<4;i++)poly(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],'#101418');}
      K.hard(sc);g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const RX=r=>Math.max(2,Math.round(r*45.25));
    // 直立圓柱：tones 左亮→右暗；回傳頂面中心
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(top){if(rim)ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-(rim?1:0),Math.max(0,ry-(rim?1:0)),top);}return[cx,cy-h];};
    // 圓柱正面環縫（下半弧）
    const rings=(g,cx,cy,rx,zs,col)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(const z of zs)for(let x=-rx+1;x<=rx-1;x++){const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=col;g.fillRect(cx+x,cy-z+yb,1,1);}};
    // 錐頂／穹頂（坐在頂面橢圓上）：tones 左亮→右暗
    const cone=(g,cx,cy,rx,rh,tones,dome)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const q=Math.max(0,1-(x*x)/((rx+.5)*(rx+.5))),yb=Math.round(ry*Math.sqrt(q));
        const yt=dome?-Math.round(rh*Math.sqrt(q)+ry*Math.sqrt(q)*.3):-Math.round(rh*(1-Math.abs(x)/(rx+.5)));
        g.fillStyle=c;g.fillRect(cx+x,cy+yt,1,yb-yt+1);}};
    // 臥式圓筒（膠囊）
    const hTank=(g,axis,a0,a1,o,zc,r,T,cap)=>{const n=Math.max(2,Math.ceil(Math.abs(a1-a0)*44));
      for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n,c=axis==='u'?P(t,o,zc):P(o,t,zc),cx=Math.round(c[0]),cy=Math.round(c[1]),pal=i===n?cap:T;
        for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const q=dx*dx+dy*dy;if(q>r*r+r*.6)continue;
          let l=-(dx*.45+dy*.9)/r;if(i===n&&q>=(r-1)*(r-1)+r*.6)l=-2;
          g.fillStyle=pal[l>.5?0:l>-.05?1:l>-.6?2:3];g.fillRect(cx+dx,cy+dy,1,1);}}};
    // 雙坡屋頂房：ridge 'v'（屋脊沿 v，山牆朝 +v 亮面）或 'u'（屋脊沿 u，山牆朝 +u 暗面）
    const gable=(g,u0,v0,du,dv,h,rh,ridge,wl,wr,rl,rd,ov=.025)=>{const u1=u0+du,v1=v0+dv;
      boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
      if(ridge==='v'){const um=u0+du/2;
        poly(g,[P(u0-ov,v0-ov,h-1),P(u0-ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rl);
        poly(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
        poly(g,[P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rd);
        BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,24));
        return{um};}
      const vm=v0+dv/2;
      poly(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);
      poly(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
      poly(g,[P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rl);
      BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),SH(rl,24));return{vm};};
    // 四坡屋頂（置於牆頂 h）
    const hip=(g,u0,v0,du,dv,h,rh,cL,cR,cB,ov=.025)=>{const u1=u0+du+ov,v1=v0+dv+ov,a=u0-ov,b=v0-ov;
      const long=du>=dv,r0=long?P(u0+dv/2,v0+dv/2,h+rh):P(u0+du/2,v0+du/2,h+rh),r1=long?P(u0+du-dv/2,v0+dv/2,h+rh):P(u0+du/2,v0+dv-du/2,h+rh);
      poly(g,[P(a,b,h),P(u1,b,h),r1,r0],cB);poly(g,[P(a,b,h),P(a,v1,h),long?r0:r1,r0],SH(cL,8));
      poly(g,[P(a,v1,h),P(u1,v1,h),r1,long?r0:r1],cL);poly(g,[P(u1,b,h),P(u1,v1,h),r1],cR);
      if(!long)poly(g,[P(u1,b,h),P(u1,v1,h),r1,r0],cR);
      BL(g,P(u1,v1,h),r1,SH(cL,22));BL(g,r0,r1,SH(cL,26));};
    // 管線（3px：亮／中／暗）
    const PB=['#9cc8ec','#3f7cbc','#274f82'];       // 自來水藍
    const PG=['#c9d1d5','#8c979d','#555f65'];       // 鍍鋅灰
    const PP=['#d2b2ee','#9064c4','#5d3a8c'];       // 再生水紫（真實慣例：紫色管）
    const PK=['#8a8f93','#4c5156','#2c3034'];       // 黑色 HDPE／污水
    const PY=['#f5e08a','#d9b23a','#98771c'];       // 瓦斯／加藥黃
    const pipe=(g,a,b,col=PB,th=3)=>{if(th===3){BL(g,[a[0],a[1]-1],[b[0],b[1]-1],col[0]);BL(g,a,b,col[1]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],col[2]);}
      else{BL(g,a,b,col[0]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],col[2]);}};
    const riser=(g,p,z0,z1,col=PB,th=3)=>{const x=Math.round(p[0])-1,y=Math.round(p[1]);RC(g,x,y-z1,1,z1-z0+1,col[0]);RC(g,x+1,y-z1,1,z1-z0+1,col[1]);if(th===3)RC(g,x+2,y-z1,1,z1-z0+1,col[2]);};
    const flange=(g,p,col='#1f3d63')=>{RC(g,p[0]-1,p[1]-2,1,5,col);};
    const collar=(g,p)=>{RC(g,p[0]-3,p[1],7,2,'#a9a59b');RC(g,p[0]-2,p[1]+2,5,1,'#8d8a82');};
    const valve=(g,p,wheel='#c8413a')=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-2,3,4,'#2b3f55');RC(g,x-1,y-2,1,4,'#4d6782');RC(g,x,y-5,1,3,'#59636a');RC(g,x-2,y-6,5,1,wheel);RC(g,x-2,y-6,2,1,'#ec7a6e');};
    const gauge=(g,p)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-3,1,3,'#59636a');RC(g,x-1,y-6,3,3,'#f1f3f4');RC(g,x,y-5,1,1,'#1d2226');};
    // 鵝頸通氣管（開口朝右下，含防蟲網帽）
    const goose=(g,p,h=10,c=PG)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-h,1,h,c[0]);RC(g,x+1,y-h,1,h,c[2]);RC(g,x,y-h-2,4,2,c[1]);RC(g,x,y-h-2,4,1,c[0]);RC(g,x+3,y-h,1,2,c[2]);RC(g,x+2,y-h+1,3,1,'#e4e8ea');};
    // 雙扇鋁製檢修蓋（平放；花紋鋼板＋中縫＋鉸鏈＋把手）
    const hatch2=(g,u0,v0,du,dv,z,alongV=true)=>{flatQ(g,u0,v0,du,dv,'#565e62',z);flatQ(g,u0+.014,v0+.014,du-.028,dv-.028,'#aab2b7',z);
      if(alongV){BL(g,P(u0+du/2,v0+.012,z),P(u0+du/2,v0+dv-.012,z),'#7c858a');}else{BL(g,P(u0+.012,v0+dv/2,z),P(u0+du-.012,v0+dv/2,z),'#7c858a');}
      const n=Math.round(du*dv*260);for(let i=0;i<n;i++){const q=P(u0+.02+hsh(71,i,Math.round(u0*97+v0*31))*(du-.04),v0+.02+hsh(72,i,Math.round(u0*53+v0*89))*(dv-.04),z);RC(g,q[0],q[1],1,1,'#d9dee1');}
      const m=P(u0+du*.5,v0+dv*.8,z);RC(g,m[0]-1,m[1],3,1,'#e8c547');};
    const manhole=(g,u,v,z,r=3,c='#4a4d50')=>{const p=P(u,v,z);ell(g,p[0],p[1],r+1,Math.max(1,(r+1)>>1),'#6c6a64');ell(g,p[0],p[1],r,Math.max(1,r>>1),c);RC(g,p[0]-1,p[1],3,1,'#6f7478');};
    const hatch=(g,u0,v0,du,dv,z,c='#7f898e')=>{flatQ(g,u0,v0,du,dv,SH(c,-26),z);flatQ(g,u0+.012,v0+.012,du-.024,dv-.024,c,z);
      const m=P(u0+du*.5,v0+dv*.5,z);RC(g,m[0]-1,m[1],3,1,SH(c,40));};
    // 黃色警示燈（旋轉燈）
    const beacon=(s,n,p,c='#f2b418')=>{RC(s,p[0]-1,p[1]-1,3,1,'#59636a');RC(s,p[0]-1,p[1]-3,3,2,c);RC(s,p[0]-1,p[1]-3,1,1,'#ffe68a');
      RC(n,p[0]-1,p[1]-3,3,2,'#ffc83a');RC(n,p[0]-2,p[1]-2,1,1,'rgba(255,200,60,.55)');RC(n,p[0]+2,p[1]-2,1,1,'rgba(255,200,60,.55)');};
    const lamp=(S,u,v,h=22)=>S.t(u+v+.001,(s,n)=>{const p=P(u,v);RC(s,p[0],p[1]-h,1,h,'#59636a');RC(s,p[0]+1,p[1]-h,1,h,'#98a1a6');RC(s,p[0]-2,p[1]-h-1,5,2,'#d3d9dc');RC(n,p[0]-2,p[1]-h-1,5,2,'#ffe2a0');RC(n,p[0]-1,p[1]-h+1,3,1,'rgba(255,226,160,.55)');});
    const sign=(S,u,v,c='#2f6fb0')=>S.t(u+v,(s)=>{const p=P(u,v);RC(s,p[0],p[1]-6,1,6,'#5f686e');RC(s,p[0]-2,p[1]-9,5,4,'#f2f4f5');RC(s,p[0]-2,p[1]-9,5,1,c);RC(s,p[0]-1,p[1]-7,3,1,'#8f989d');});
    const bollard=(S,u,v)=>S.t(u+v,(s)=>{const p=P(u,v);RC(s,p[0],p[1]-5,2,5,'#e0b83a');RC(s,p[0]+1,p[1]-5,1,5,'#a8861f');RC(s,p[0],p[1]-3,2,1,'#2b2f33');});
    const bush=(S,u,v,r=3,c=['#8cc45a','#4f8a34','#356224'])=>S.o(u+v,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
      ell(s,x,y-r,r,Math.max(1,r-1),c[1]);ell(s,x-1,y-r-1,Math.max(1,r-2),Math.max(1,r-2),c[0]);RC(s,x+1,y-1,r-1,1,c[2]);});
    const tree=(S,u,v,h=12,r=5)=>S.o(u+v,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-h+r,2,h-r,'#6b5039');
      ell(s,x,y-h,r,r,'#5f8f3f');ell(s,x-1,y-h-1,r-2,r-2,'#86b457');RC(s,x+1,y-h+r-2,r-1,1,'#406a2c');RC(s,x-2,y-h-2,1,1,'#a8d27a');});
    const rail=(g,a,b,h=4,c='#e0c24a',step=4)=>{BL(g,[a[0],a[1]-h],[b[0],b[1]-h],c);BL(g,[a[0],a[1]-h+2],[b[0],b[1]-h+2],SH(c,-40));
      const n=Math.max(1,Math.round(Math.abs(b[0]-a[0])/step));for(let i=0;i<=n;i++){const q=lerp(a,b,i/n);RC(g,q[0],q[1]-h,1,h,SH(c,-60));}};
    // 地面：草地、碎石、混凝土
    const grass=(g,seed,SZ,base='#78a255')=>{A.dia(g,K.AX,K.TOPY,32*SZ,base);
      for(let i=0;i<Math.round(46*SZ*SZ);i++){const u=hsh(seed,i,1)*SZ,v=hsh(seed,i,2)*SZ,p=P(u,v,0),t=hsh(seed,i,3);RC(g,p[0],p[1],t<.3?2:1,1,t<.5?SH(base,-16):SH(base,14));}
      A.diaEdge(g,6,SH(base,-26),K.AX,K.TOPY,32*SZ);A.diaEdge(g,9,SH(base,18),K.AX,K.TOPY,32*SZ);};
    const gravel=(g,u0,v0,du,dv,seed,base='#b3aea3')=>{flatQ(g,u0,v0,du,dv,base);
      const n=Math.round(du*dv*60);for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,5)*du,v0+hsh(seed,i,6)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,7)<.5?SH(base,-14):SH(base,12));}};
    const slab=(g,u0,v0,du,dv,c='#cdc9bf')=>{flatQ(g,u0,v0,du,dv,c);BL(g,P(u0,v0+dv),P(u0+du,v0+dv),SH(c,-22));BL(g,P(u0+du,v0),P(u0+du,v0+dv),SH(c,-30));};
    const clipQ=(x,u0,v0,du,dv,z,fn)=>{x.save();x.beginPath();const q=[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];x.moveTo(q[0][0],q[0][1]);for(let i=1;i<4;i++)x.lineTo(q[i][0],q[i][1]);x.closePath();x.clip();fn();x.restore();};
    const asphalt=(x,u0,v0,du,dv,alongV,mark=true)=>{flatQ(x,u0,v0,du,dv,'#7a7771');
      if(alongV){const um=u0+du/2;if(mark)for(let t=v0+.04;t<v0+dv-.06;t+=.14)BL(x,P(um,t),P(um,t+.06),'#d9d4c4');BL(x,P(u0,v0),P(u0,v0+dv),'#9a968e');}
      else{const vm=v0+dv/2;if(mark)for(let t=u0+.04;t<u0+du-.06;t+=.14)BL(x,P(t,vm),P(t+.06,vm),'#d9d4c4');BL(x,P(u0,v0),P(u0+du,v0),'#9a968e');}};
    return{RC,BL,lerp,boxZ,fL,fR,flatQ,pg,winL,winR,louvL,louvR,scene,done,shadow,ell,RX,cyl,rings,cone,hTank,gable,hip,
      PB,PG,PP,PK,PY,pipe,riser,flange,collar,valve,gauge,goose,hatch2,hatch,manhole,beacon,lamp,sign,bollard,bush,tree,rail,
      grass,gravel,slab,clipQ,asphalt};
  };

  // ================= k157 污水提升站（1×1，76×96，錨點 38,94） =================
  try{
    const K=A.iso575(76,96,38,94,1),L=LIB(K),{P}=K;
    const {RC,BL,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,ell,rings,pipe,riser,collar,valve,goose,hatch2,beacon}=L;
    const DRUM=['#86b0dc','#5a8cc4','#3f6ea6','#2c5282'];
    // 濕井頂板：抬高混凝土板＋雙扇檢修蓋
    const wetWell=(S,o)=>S.o(o.d!=null?o.d:o.u0+o.v0+o.du+o.dv,(s)=>{
      const {u0,v0,du,dv,h}=o;
      boxZ(s,u0,v0,du,dv,0,h,'#b7b2a5','#d3cec2','#9a9589');
      BL(s,P(u0,v0+dv,h),P(u0+du,v0+dv,h),'#e6e1d5');
      for(const q of o.hatches)hatch2(s,q[0],q[1],q[2],q[3],h,q[4]!==0);
    });
    // 控制盤架：不鏽鋼盤箱×n（腳架抬高）＋遮陽頂＋黃色警示燈桅＋天線
    const panel=(S,o)=>S.o(o.d!=null?o.d:o.u0+o.v0+o.du+o.dv,(s,n)=>{
      const {u0,v0,du,dv}=o,v1=v0+dv,u1=u0+du;
      for(const t of [u0+.02,u1-.02]){const p=P(t,v1-.01);RC(s,p[0],p[1]-3,1,3,'#6d767b');}
      boxZ(s,u0,v0,du,dv,3,11,'#bfc6ca','#e3e8ea','#a2abb0');
      const nb=o.n||2;for(let i=1;i<nb;i++){const t=u0+du*i/nb;BL(s,P(t,v1,4),P(t,v1,13),'#98a1a6');}
      for(let i=0;i<nb;i++){const t=u0+du*(i+.5)/nb;const q=P(t,v1,9);RC(s,q[0]+1,q[1],1,2,'#59636a');
        const l=P(t-.03,v1,11);RC(s,l[0],l[1],1,1,i%2?'#e05a4a':'#52c79e');RC(n,l[0],l[1],1,1,i%2?'#ff7a60':'#7dffd0');}
      boxZ(s,u0-.02,v0-.02,du+.04,dv+.05,14,1,'#8f989c','#aab2b6','#7d868a');
    })&&S.t((o.d!=null?o.d:o.u0+o.v0+o.du+o.dv)+.001,(s,n)=>{
      const {u0,v0,du}=o,u1=u0+du;
      const m=P(u1-.02,v0+.02,15);RC(s,m[0],m[1]-7,1,7,'#59636a');beacon(s,n,[m[0],m[1]-7]);
      if(o.ant){const a=P(u0+.03,v0+.02,15);RC(s,a[0],a[1]-9,1,9,'#59636a');RC(s,a[0]-1,a[1]-7,3,1,'#8a949a');RC(s,a[0]-1,a[1]-4,3,1,'#8a949a');}
    });
    // 緊急發電機：底座油箱＋隔音箱（沿 u 長）＋百葉＋散熱器格柵＋排氣消音管
    const genset=(S,o)=>S.o(o.d!=null?o.d:o.u0+o.v0+o.du+o.dv,(s,n)=>{
      const {u0,v0,du,dv,h}=o,u1=u0+du,v1=v0+dv,c=o.c||['#cfc7a8','#e2dbc0','#aca386'];
      boxZ(s,u0-.01,v0-.01,du+.02,dv+.02,0,3,'#5f666a','#71787c','#4d5357');
      boxZ(s,u0,v0,du,dv,3,h,c[0],c[1],c[2]);
      BL(s,P(u0,v1,3+h),P(u1,v1,3+h),SH(c[1],18));
      louvL(s,u0+du*.1,v1,5,5,2,SH(c[1],-34),SH(c[1],-74));
      BL(s,P(u0+du*.5,v1,4),P(u0+du*.5,v1,2+h),SH(c[1],-30));BL(s,P(u0+du*.8,v1,4),P(u0+du*.8,v1,2+h),SH(c[1],-30));
      {const hd=P(u0+du*.74,v1,7);RC(s,hd[0],hd[1],1,1,SH(c[1],-60));}
      winR(s,u1,v0+dv*.82,4,Math.max(3,Math.round(dv*28)),h-3,SH(c[2],-50));
      for(let z=5;z<h+2;z+=2)winR(s,u1,v0+dv*.82,z,Math.max(3,Math.round(dv*28)),1,SH(c[2],-20));
      const e=P(u0+du*.3,v0+dv*.45,3+h);RC(s,e[0],e[1]-4,2,4,'#3b3f43');RC(s,e[0]-1,e[1]-5,4,1,'#2a2d30');RC(s,e[0],e[1]-4,1,4,'#60666b');
      if(o.tag){const t=P(u0+du*.3,v1,h-1);RC(s,t[0],t[1],3,2,'#c0392b');}
    });
    // 活性碳除臭桶（立式）＋進氣風管
    const drum=(S,o)=>S.o(o.d!=null?o.d:o.u+o.v+.1,(s,n)=>{
      const c=P(o.u,o.v,0),rx=o.rx||4;RC(s,c[0]-rx-1,c[1]-1,2*rx+3,3,'#b5b1a7');
      const t=cyl(s,c[0],c[1],rx,o.h||11,o.tones||DRUM,SH((o.tones||DRUM)[0],10),(o.tones||DRUM)[2]);
      rings(s,c[0],c[1],rx,[3,(o.h||11)-3],(o.tones||DRUM)[3]);
      RC(s,t[0]-1,t[1]-2,3,2,'#59636a');
      if(o.fan){RC(s,c[0]+rx-1,c[1]-6,3,4,'#7c878c');RC(s,c[0]+rx-1,c[1]-6,3,1,'#a9b3b8');}
    });
    const V157=[
      (g,ng,S)=>{ // v0 標準雙泵沉水式：方形濕井頂板（雙檢修蓋）＋閥室＋控制盤架（警示燈）＋活性碳桶＋發電機
        K.ground(g,1570);
        L.slab(g,.3,.32,.62,.46);L.flatQ(g,.1,.72,.22,.26,'#c2beb3');L.flatQ(g,.1,.72,.3,.1,'#c2beb3');
        L.shadow(g,[[.36,.38,.34,.34,3],[.72,.44,.17,.22,2],[.1,.14,.26,.08,15],[.5,.1,.36,.18,12],[.12,.5,.1,.1,12]]);
        K.backFence(g);
        panel(S,{u0:.1,v0:.14,du:.26,dv:.08,n:2,ant:1});
        genset(S,{u0:.5,v0:.1,du:.36,dv:.18,h:9,tag:1});
        drum(S,{u:.17,v:.55,rx:4,h:11,fan:1});
        S.t(.9,(s)=>{pipe(s,P(.23,.55,5),P(.38,.55,5),L.PG,2);});
        wetWell(S,{u0:.36,v0:.38,du:.34,dv:.34,h:3,hatches:[[.39,.42,.13,.13],[.54,.42,.13,.13],[.42,.59,.2,.09,0]]});
        S.o(1.33,(s)=>{boxZ(s,.72,.44,.17,.22,0,2,'#bdb8ac','#d2cec3','#a09b8f');hatch2(s,.745,.475,.12,.15,2);});
        S.t(1.45,(s)=>{goose(s,P(.4,.4,3),12);const r=P(.84,.7,0);RC(s,r[0]-1,r[1]-6,3,6,'#d9b23a');RC(s,r[0]-1,r[1]-6,1,6,'#f5e08a');RC(s,r[0]-2,r[1]-7,5,2,'#2c3034');});
        L.bollard(S,.74,.8);L.bollard(S,.34,.8);
        L.lamp(S,.08,.08,22);
      },
      (g,ng,S)=>{ // v1 乾井式泵房：混凝土磚造四坡頂泵房（捲門＋壁掛控制盤＋警示燈）＋立式除臭洗滌塔＋墨綠發電機＋前庭濕井蓋
        L.grass(g,1571,1,'#7aa256');
        L.gravel(g,.08,.1,.84,.66,1571,'#b6b1a5');L.flatQ(g,.12,.46,.18,.52,'#bdb8ad');L.slab(g,.34,.58,.3,.26,'#c9c5bb');
        L.shadow(g,[[.12,.14,.38,.32,22],[.62,.14,.2,.2,20],[.62,.46,.26,.16,11]]);
        K.backFence(g);
        S.o(.12+.14+.38+.32,(s,n)=>{ // 泵房
          const u0=.12,v0=.14,du=.38,dv=.32,h=14,u1=u0+du,v1=v0+dv;
          boxZ(s,u0,v0,du,dv,0,h,'#d6ccb4','#ddd2b8','#b0a58b');
          for(let z=3;z<h;z+=3){BL(s,P(u0,v1,z),P(u1,v1,z),'#cbbfa4');BL(s,P(u1,v0,z),P(u1,v1,z),'#a29780');}
          fL(s,v1,u0,u1,0,2,'#a99e86');fR(s,u1,v0,v1,0,2,'#8d836d');
          winL(s,u0+.05,v1,0,8,10,'#7d8488');for(let z=1;z<10;z+=2)winL(s,u0+.05,v1,z,8,1,'#9aa1a5');   // 捲門
          winL(s,u0+.05,v1,10,8,1,'#5d6468');
          winL(s,u0+.26,v1,4,5,7,'#e5e8ea');winL(s,u0+.265,v1,5,4,5,'#b9c1c6');BL(s,P(u0+.3,v1,5),P(u0+.3,v1,9),'#8d969b'); // 壁掛控制盤
          {const l=P(u0+.28,v1,10);RC(s,l[0],l[1],1,1,'#52c79e');RC(n,l[0],l[1],1,1,'#7dffd0');}
          louvR(s,u1,v0+dv*.62,5,5,3,'#8b8474','#5d584e');
          L.hip(s,u0,v0,du,dv,h,8,'#7b8580','#5e6762','#6c7570');
          beacon(s,n,P(u0+.04,v1,h+3));
          {const lp=P(u0+.14,v1,12);RC(s,lp[0],lp[1],3,1,'#f3e6b6');RC(n,lp[0],lp[1],3,1,'#ffe2a0');}
        });
        S.o(.62+.14+.4,(s,n)=>{ // 除臭洗滌塔（FRP）＋風機
          const c=P(.72,.24,0);RC(s,c[0]-7,c[1]-1,15,3,'#b5b1a7');
          const T=['#c8d2c2','#aebba8','#92a08c','#74826e'];
          const t=cyl(s,c[0],c[1],6,18,T,'#d6dfd0','#92a08c');
          L.cone(s,t[0],t[1],6,3,['#dfe7da','#c3cfbd','#a7b4a1','#8a9884'],true);
          rings(s,c[0],c[1],6,[5,12],T[3]);
          RC(s,t[0],t[1]-8,2,6,'#8c979d');RC(s,t[0]-1,t[1]-9,4,1,'#59636a');   // 排氣短管
          RC(s,c[0]-5,c[1]-17,1,16,'#e5eae3');for(let z=3;z<17;z+=3)RC(s,c[0]-6,c[1]-z,2,1,'#e5eae3'); // 爬梯
          boxZ(s,.78,.34,.1,.08,0,6,'#8c979d','#a9b3b8','#727d82');const f=P(.83,.42,3);RC(s,f[0]-1,f[1]-2,3,3,'#4b5357');
        });
        S.t(1.2,(s)=>{pipe(s,P(.5,.32,11),P(.66,.32,11),L.PG,2);pipe(s,P(.78,.38,5),P(.76,.3,5),L.PG,2);});
        S.o(1.3,(s)=>{hatch2(s,.38,.62,.13,.13,0);hatch2(s,.52,.62,.1,.1,0);L.manhole(s,.56,.78,0,3);});
        S.t(1.45,(s)=>{goose(s,P(.4,.8,0),9);});
        genset(S,{u0:.62,v0:.46,du:.26,dv:.16,h:8,c:['#5d7560','#6f8a70','#4b614e']});
        L.bush(S,.08,.62,3);L.bush(S,.78,.88,3);L.bush(S,.9,.76,3);
        L.lamp(S,.9,.1,20);
      },
      (g,ng,S)=>{ // v2 預製圓形濕井（FRP）：圓形濕井＋小圓閥井＋不鏽鋼控制亭（遮陽罩／警示燈／八木天線）＋拖車式移動發電機＋活性碳小桶
        K.ground(g,1572);
        L.slab(g,.26,.3,.62,.56,'#c9c5bb');
        L.shadow(g,[[.12,.14,.24,.1,16],[.52,.1,.34,.16,11],[.34,.4,.22,.22,4],[.1,.62,.2,.2,8]]);
        K.backFence(g);
        panel(S,{u0:.12,v0:.14,du:.24,dv:.1,n:2,ant:0});
        S.t(.62,(s)=>{const a=P(.14,.16,0);RC(s,a[0],a[1]-30,1,30,'#6d767b');RC(s,a[0]+1,a[1]-30,1,30,'#a3acb1');   // 八木天線桿
          RC(s,a[0]-3,a[1]-28,8,1,'#b9c1c6');for(let i=0;i<4;i++)RC(s,a[0]-2+i*2,a[1]-30,1,5,'#b9c1c6');});
        S.o(.52+.1+.34+.16,(s)=>{ // 拖車式移動發電機
          const u0=.52,v0=.1,du=.32,dv=.16,u1=u0+du,v1=v0+dv;
          BL(s,P(u0,v0+dv/2,3),P(u0-.08,v0+dv/2,1),'#3b4045');RC(s,P(u0-.08,v0+dv/2,0)[0],P(u0-.08,v0+dv/2,0)[1]-3,1,3,'#3b4045');
          boxZ(s,u0,v0,du,dv,3,1,'#3b4045','#4a5055','#33383c');
          boxZ(s,u0,v0,du,dv,4,9,'#dfe2df','#f0f2ef','#c3c7c4');
          fL(s,v1,u0,u1,7,9,'#2f6fb0');fR(s,u1,v0,v1,7,9,'#24588c');
          louvL(s,u0+.04,v1,5,5,1,'#9aa1a5','#5d6468');
          winR(s,u1,v0+dv*.85,5,4,5,'#6d767b');
          const w=P(u0+du*.55,v1,2);ell(s,w[0],w[1],2,2,'#26292c');RC(s,w[0],w[1],1,1,'#9aa1a5');
          const e=P(u0+du*.25,v0+dv*.5,13);RC(s,e[0],e[1]-3,2,3,'#3b3f43');
        });
        S.o(.46+.52+.2,(s)=>{ // 圓形濕井（FRP 筒身＋混凝土頂蓋＋方形檢修蓋＋雙通氣管）
          const c=P(.46,.52,0),rx=L.RX(.17);
          cyl(s,c[0],c[1],rx,5,['#dcd8ce','#cdc9be','#b6b1a5','#9d988c'],'#c3beb2','#a39e92');
          rings(s,c[0],c[1],rx,[2],'#8f8a7e');
          hatch2(s,.4,.46,.12,.12,5);
          L.ell(s,c[0]-rx+4,c[1]-5,1,0,'#59636a');
        });
        S.t(.46+.52+.21,(s)=>{const c=P(.46,.52,0),rx=L.RX(.17);goose(s,[c[0]+rx-4,c[1]-6],9);goose(s,[c[0]-rx+3,c[1]-6],6);});
        S.o(.74+.68+.1,(s)=>{const c=P(.74,.68,0),rx=L.RX(.08);cyl(s,c[0],c[1],rx,3,['#d0ccc1','#bdb8ac','#a39e92','#8d887c'],'#b3aea2','#9a9589');
          L.ell(s,c[0],c[1]-3,rx-2,Math.max(1,(rx-2)>>1),'#6f777b');RC(s,c[0]-1,c[1]-3,3,1,'#aab2b7');});
        S.t(1.3,(s)=>{pipe(s,P(.58,.6,2),P(.68,.64,2),L.PG,2);const q=P(.62,.8,0);RC(s,q[0]-1,q[1]-6,3,6,'#d9b23a');RC(s,q[0]-1,q[1]-6,1,6,'#f5e08a');RC(s,q[0]-2,q[1]-7,5,2,'#2c3034');});
        drum(S,{u:.14,v:.68,rx:3,h:7,d:.9,tones:['#4d7fb8','#3c6aa0','#2e5585','#223f63']});
        drum(S,{u:.22,v:.76,rx:3,h:7,d:1.05,tones:['#4d7fb8','#3c6aa0','#2e5585','#223f63']});
        S.t(1.0,(s)=>{pipe(s,P(.26,.72,5),P(.36,.58,5),L.PG,2);});
        L.bollard(S,.3,.86);L.bollard(S,.86,.4);
        L.bush(S,.9,.9,3);
      },
      (g,ng,S)=>{ // v3 大型三泵站：平頂控制機房（屋頂空調／警示燈）＋貨櫃式發電機（消音器）＋濕井三檢修蓋＋吊車懸臂＋高塔式生物除臭
        K.ground(g,1573);
        L.slab(g,.08,.08,.86,.84,'#c6c2b8');
        L.shadow(g,[[.1,.12,.32,.24,18],[.52,.1,.38,.2,13],[.38,.44,.38,.3,3],[.09,.63,.14,.14,22]]);
        K.backFence(g);
        S.o(.1+.12+.32+.24,(s,n)=>{ // 控制機房
          const u0=.1,v0=.12,du=.32,dv=.24,h=17,u1=u0+du,v1=v0+dv;
          boxZ(s,u0,v0,du,dv,0,h,'#9aa2a6','#e2ddd0','#bab3a3');
          fL(s,v1,u0,u1,0,2,'#b7af9e');fR(s,u1,v0,v1,0,2,'#978f7f');
          boxZ(s,u0,v0,du,dv,h,2,'#c9c3b5','#d6d0c2','#aba494');L.flatQ(s,u0+.02,v0+.02,du-.04,dv-.04,'#8d969a',h+2);
          winL(s,u0+.04,v1,0,5,10,'#5c6f80');winL(s,u0+.04,v1,10,5,1,'#8a949a');
          winL(s,u0+.18,v1,6,6,4,'#4b6f8a');winL(s,u0+.18,v1,10,6,1,'#7e9db3');winL(n,u0+.18,v1,6,6,4,'#ffe2a0');
          louvR(s,u1,v0+dv*.6,6,4,3,'#8e8777','#5d584e');
          boxZ(s,u0+.14,v0+.05,.1,.08,h+2,4,'#b9c1c6','#cdd4d8','#a7afb4');{const f=P(u0+.19,v0+.09,h+6);RC(s,f[0]-1,f[1],3,1,'#59636a');}
          const b=P(u0+.02,v1-.02,h+2);beacon(s,n,[b[0],b[1]]);
          {const lp=P(u0+.07,v1,12);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');}
        });
        genset(S,{u0:.52,v0:.1,du:.38,dv:.2,h:11,c:['#d9dcda','#eceeec','#b8bdbb']});
        S.t(.52+.1+.38+.2+.001,(s)=>{L.hTank(s,'u',.62,.78,.2,18,2,['#8e969b','#6f777b','#555c60','#3f4548'],['#7a8287','#5f676b','#4a5155','#34393c']);
          const p=P(.8,.2,20);RC(s,p[0],p[1]-3,2,4,'#3b3f43');});
        S.o(.38+.44+.38+.3,(s)=>{ // 濕井頂板＋三檢修蓋
          boxZ(s,.38,.44,.38,.3,0,3,'#b7b2a5','#d3cec2','#9a9589');BL(s,P(.38,.74,3),P(.76,.74,3),'#e6e1d5');
          hatch2(s,.41,.48,.1,.12,3);hatch2(s,.53,.48,.1,.12,3);hatch2(s,.65,.48,.1,.12,3);hatch2(s,.44,.62,.22,.08,3,0);
        });
        S.t(1.52,(s)=>{ // 吊車懸臂（黃）
          const b=P(.74,.46,3),t=[b[0],b[1]-20];RC(s,b[0],b[1]-20,2,20,'#d9a82a');RC(s,b[0],b[1]-20,1,20,'#f2cf5a');
          BL(s,[t[0],t[1]],P(.56,.54,21),'#d9a82a');BL(s,[t[0],t[1]+1],P(.56,.54,20),'#a8801c');
          const k=P(.56,.54,20);RC(s,k[0],k[1],1,8,'#3b3f43');RC(s,k[0]-1,k[1]+8,3,2,'#3b3f43');
          goose(s,P(.4,.72,3),9);
        });
        S.o(.16+.7+.1,(s)=>{ // 高塔生物除臭（靠左角，不擋主體）
          const c=P(.16,.7,0);RC(s,c[0]-7,c[1]-1,15,3,'#a9a59b');
          const T=['#9fb6c4','#7f9aab','#657f90','#4b6272'];
          const t=cyl(s,c[0],c[1],6,24,T,'#b8cbd6','#657f90');
          rings(s,c[0],c[1],6,[6,15],T[3]);
          RC(s,t[0]-1,t[1]-8,3,8,'#8c979d');RC(s,t[0],t[1]-8,1,8,'#c9d1d5');RC(s,t[0]-2,t[1]-9,5,1,'#59636a');
          RC(s,c[0]-5,c[1]-23,1,22,'#dfe7ec');for(let z=3;z<23;z+=3)RC(s,c[0]-6,c[1]-z,2,1,'#dfe7ec');
        });
        S.o(1.0,(s)=>{boxZ(s,.26,.6,.08,.08,0,6,'#8c979d','#a9b3b8','#727d82');const f=P(.3,.68,3);RC(s,f[0]-1,f[1]-2,3,3,'#4b5357');});
        S.t(1.05,(s)=>{pipe(s,P(.34,.62,5),P(.44,.54,5),L.PG,2);});
        L.bollard(S,.36,.8);L.bollard(S,.78,.8);L.bollard(S,.9,.4);
        L.lamp(S,.92,.92,22);
      },
      (g,ng,S)=>{ // v4 路邊地下式：草地上僅露出人孔群＋高聳除臭通氣塔＋綠色路邊控制箱群（警示燈／遙測天線）＋小型發電機箱＋繞流泵快接口＋綠籬
        L.grass(g,1574,1,'#79a458');
        L.gravel(g,.08,.08,.84,.26,1574,'#b3aea2');L.flatQ(g,.12,.34,.2,.64,'#b9b4a8');L.slab(g,.36,.4,.46,.42,'#c8c4ba');
        L.shadow(g,[[.26,.12,.36,.1,12],[.1,.42,.18,.16,8],[.82,.18,.05,.05,26]]);
        K.backFence(g);
        S.o(.26+.12+.36+.1,(s,n)=>{ // 路邊控制箱×3（市政綠）
          boxZ(s,.25,.11,.38,.12,0,1,'#b9b5ab','#cdc9bf','#a19d93');
          for(let i=0;i<3;i++){const u0=.26+i*.125,h=i===1?13:10;
            boxZ(s,u0,.12,.1,.1,1,h,'#557d5b','#4f7f58','#3a6041');
            boxZ(s,u0-.005,.115,.11,.11,h+1,1,'#6a9270','#5f8a66','#46694c');
            BL(s,P(u0+.05,.22,2),P(u0+.05,.22,h),'#3f6a47');
            const l=P(u0+.02,.22,h-1);RC(s,l[0],l[1],1,1,'#52c79e');RC(n,l[0],l[1],1,1,'#7dffd0');
            winL(s,u0+.075,.22,h-5,2,3,'#e6e9ea');}
        });
        S.t(.26+.12+.36+.1+.002,(s,n)=>{const m=P(.44,.13,15);beacon(s,n,[m[0],m[1]]);
          const a=P(.66,.14,0);RC(s,a[0],a[1]-24,1,24,'#6d767b');RC(s,a[0]+1,a[1]-24,1,24,'#a3acb1');RC(s,a[0]-2,a[1]-24,6,1,'#c7cdd1');RC(s,a[0]-1,a[1]-20,4,1,'#c7cdd1');
          RC(s,a[0]+1,a[1]-25,1,1,'#c0392b');RC(n,a[0]+1,a[1]-25,1,1,'#ff5a4a');});
        S.o(.84+.2+.01,(s)=>{ // 除臭通氣塔：高管＋頂部活性碳濾罐＋風帽
          const p=P(.84,.2,0);RC(s,p[0]-4,p[1]-1,9,3,'#a9a59b');
          RC(s,p[0]-1,p[1]-20,1,20,'#dfe5e8');RC(s,p[0],p[1]-20,1,20,'#a9b3b8');RC(s,p[0]+1,p[1]-20,1,20,'#6f797e');
          cyl(s,p[0],p[1]-20,3,7,['#9fb0ba','#7f939f','#657884','#4d5e69'],'#b3c2ca','#657884');
          RC(s,p[0]-2,p[1]-24,5,1,'#4d5e69');
          L.cone(s,p[0],p[1]-28,3,3,['#c9d1d5','#aeb7bc','#8c979d','#6b757a'],true);
        });
        genset(S,{u0:.08,v0:.44,du:.24,dv:.14,h:7,c:['#9aa3a6','#b4bcbf','#80898c']});
        S.o(1.05,(s)=>{L.manhole(s,.52,.56,0,6,'#55595c');L.ell(s,P(.52,.56)[0],P(.52,.56)[1],2,1,'#6f7478');hatch2(s,.62,.62,.14,.14,0);L.manhole(s,.44,.74,0,3);});
        S.t(1.3,(s)=>{const q=P(.4,.64,0);RC(s,q[0]-1,q[1]-7,3,7,'#8c979d');RC(s,q[0]-1,q[1]-7,1,7,'#c9d1d5');RC(s,q[0]-2,q[1]-8,5,2,'#d9b23a');RC(s,q[0]+2,q[1]-4,3,2,'#d9b23a');
          goose(s,P(.72,.46,0),9);goose(s,P(.78,.56,0),6);});
        for(let i=0;i<5;i++)L.bush(S,.5+i*.08,.9,3,['#6fae4a','#3f7a2c','#2d5a20']);
        L.bush(S,.9,.6,3,['#6fae4a','#3f7a2c','#2d5a20']);L.bush(S,.9,.72,3,['#6fae4a','#3f7a2c','#2d5a20']);
        L.lamp(S,.08,.9,20);
      },
    ];
    for(let v=0;v<V157.length;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V157[v](g,ng,S)||{};S.run();
      B['157_1_'+v]=L.done(c,g,nc,Object.assign({fence:true,gate:[.08,.3]},opt));
    }
  }catch(e){console.error('infra575 k157',e);}

  // ================= k158 再生水中心（3×3，192×205，錨點 96,203） =================
  try{
    const SZ=3,K=A.iso575(192,205,96,203,SZ),L=LIB(K),{P,hsh,poly}=K;
    const {RC,BL,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,ell,rings,cone,pipe,riser,collar,valve,gauge,goose,hatch,rail,clipQ}=L;
    const DD=o=>o.d!=null?o.d:o.u0+o.v0+o.du+o.dv;
    // 圓柱正面色帶（沿下半弧）：z0..z1，tones 左亮→右暗
    const band=(g,cx,cy,rx,z0,z1,tones)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=c;g.fillRect(cx+x,cy-z1+yb,1,z1-z0);}};
    const PURP=['#b58ad8','#9468c0','#7a52a6','#5e3d86'];
    // ---- MBR 膜生物反應池：混凝土池體、分格、膜組匣、曝氣泡、走道＋黃欄杆 ----
    const mbr=(S,o)=>{const d=DD(o);S.o(d,(s,n)=>{
      const {u0,v0,du,dv,h,cells,seed}=o,u1=u0+du,v1=v0+dv,t=.045,wc='#cfcbc1';
      boxZ(s,u0,v0,du,dv,0,h,wc,'#dcd8ce','#aaa59a');
      fL(s,v1,u0,u1,0,2,'#b9b4a8');fR(s,u1,v0,v1,0,2,'#9a958a');
      const iu0=u0+t,iv0=v0+t,iu1=u1-t,iv1=v1-t;
      flatQ(s,iu0,iv0,iu1-iu0,iv1-iv0,'#8e897f',h);
      poly(s,[P(iu0,iv0,h-3),P(iu1,iv0,h-3),P(iu1,iv1,h),P(iu0,iv1,h)],'#6b7550');
      poly(s,[P(iu0,iv0,h),P(iu1,iv0,h),P(iu1,iv0,h-3),P(iu0,iv0,h-3)],'#b3ae a3'.replace(' ',''));
      const cw=(iu1-iu0)/cells;
      for(let i=0;i<cells;i++){const cu=iu0+i*cw,memb=o.memb?o.memb.includes(i):i%2===1;
        if(memb){const nr=Math.max(2,Math.round((iv1-iv0)/.16)),nc=Math.max(1,Math.round(cw/.14));
          for(let a=0;a<nc;a++)for(let b=0;b<nr;b++){const mu=cu+.035+a*(cw-.05)/nc,mv=iv0+.03+b*(iv1-iv0-.04)/nr,mdu=(cw-.05)/nc-.03,mdv=(iv1-iv0-.04)/nr-.035;
            boxZ(s,mu,mv,mdu,mdv,h-3,3,'#e9edeb','#f5f7f6','#c3cac7');
            for(let q=mu+.02;q<mu+mdu-.005;q+=.03)BL(s,P(q,mv,h),P(q,mv+mdv,h),'#aab3b0');}
          BL(s,P(cu+.02,iv0+.01,h+1),P(cu+.02,iv1-.01,h+1),'#59636a');BL(s,P(cu+cw-.02,iv0+.01,h+1),P(cu+cw-.02,iv1-.01,h+1),'#59636a');}
        else clipQ(s,cu,iv0,cw,iv1-iv0,h,()=>{const nn=Math.round(cw*(iv1-iv0)*120);for(let k=0;k<nn;k++){const p=P(cu+hsh(seed,i*97+k,31)*cw,iv0+hsh(seed,i*97+k,32)*(iv1-iv0),h-1);
          RC(s,p[0],p[1],hsh(seed,k,34)<.5?2:1,1,hsh(seed,i*97+k,33)<.55?'#c3c8a6':'#56603f');}});
        if(i>0)boxZ(s,cu-.018,iv0,.036,iv1-iv0,h-3,3,wc,'#dcd8ce','#aaa59a');}
      boxZ(s,iu0,iv1-.07,iu1-iu0,.07,h-3,3,'#9ea4a6','#b5bbbd','#868c8e');   // 前緣走道（格柵）
      for(let q=iu0+.02;q<iu1;q+=.04)BL(s,P(q,iv1-.07,h),P(q,iv1,h),'#80878a');
    });
    S.t(d+.002,(s)=>{const {u0,v0,du,dv,h}=o;rail(s,P(u0+.02,v0+dv-.01,h),P(u0+du-.02,v0+dv-.01,h),4,'#e0c24a',5);});};
    // ---- 廠房：金屬浪板牆、混凝土勒腳、色帶、帶狀窗、低坡雙坡頂（屋脊沿長邊）、屋頂通風器 ----
    const hall=(S,o)=>S.o(DD(o),(s,n)=>{
      const {u0,v0,du,dv,h}=o,u1=u0+du,v1=v0+dv,rh=o.rh||6,ov=.03,seed=o.seed||1;
      const wl=o.wl||'#e3e6e6',wr=o.wr||'#b4bbbe',bd=o.band||'#2f6fb0',rl=o.rl||'#9aa5ab',rd=o.rd||'#7b868c';
      boxZ(s,u0,v0,du,dv,0,h,wl,wl,wr);
      for(let q=u0+.035;q<u1-.01;q+=.05)BL(s,P(q,v1,3),P(q,v1,h-1),SH(wl,-14));
      for(let q=v0+.035;q<v1-.01;q+=.05)BL(s,P(u1,q,3),P(u1,q,h-1),SH(wr,-12));
      fL(s,v1,u0,u1,0,3,'#bdb8ac');fR(s,u1,v0,v1,0,3,'#9d988c');
      fL(s,v1,u0,u1,h-5,h-2,bd);fR(s,u1,v0,v1,h-5,h-2,SH(bd,-34));
      // 帶狀窗（+v 面）
      const nw=Math.max(2,Math.round(du/.2));
      for(let i=0;i<nw;i++){const wu=u0+.06+i*(du-.1)/nw;if(o.door!=null&&Math.abs(wu-(u0+du*o.door))<.14)continue;
        winL(s,wu,v1,h-12,6,4,'#4f6f86');winL(s,wu,v1,h-9,6,1,'#7d9bb0');if(hsh(seed,i,3)<.6)winL(n,wu,v1,h-12,6,4,'#ffe2a0');}
      if(o.door!=null){const q=u0+du*o.door;winL(s,q,v1,0,10,13,'#7d8488');for(let z=1;z<13;z+=2)winL(s,q,v1,z,10,1,'#9aa1a5');
        {const lp=P(q+.14,v1,15);RC(s,lp[0],lp[1],3,1,'#f3e6b6');RC(n,lp[0],lp[1],3,1,'#ffe2a0');}}
      winL(s,u0+du*.9,v1,0,4,8,'#56697c');
      louvR(s,u1,v0+dv*.3,5,6,3,SH(wr,-30),SH(wr,-70));
      {const q=v0+dv*.72;winR(s,u1,q,h-12,5,4,'#3f5a70');winR(n,u1,q,h-12,5,4,'#ffd98a');}
      // 屋頂
      if(o.barrel&&du>=dv){const N=10,pts=[],vm=v0+dv/2;   // 拱頂（筒形屋面）
        for(let k=0;k<=N;k++){const vv=v0-ov+(dv+2*ov)*k/N,x=(vv-vm)/(dv/2+ov);pts.push([vv,h-1+rh*(1-x*x)]);}
        poly(s,[P(u1,v0,h),...pts.map(([vv,z])=>P(u1,Math.min(v1,Math.max(v0,vv)),Math.max(h,z))),P(u1,v1,h)],wr);
        for(let k=0;k<N;k++){const[va,za]=pts[k],[vb,zb]=pts[k+1],c=k<N/2-1?rd:k<N/2+1?SH(rl,-8):k<N-2?rl:SH(rl,16);
          poly(s,[P(u0-ov,va,za),P(u1+ov,va,za),P(u1+ov,vb,zb),P(u0-ov,vb,zb)],c);}
        for(let q=u0+.1;q<u1-.05;q+=.1)BL(s,P(q,v1+ov,h-1),P(q,vm,h+rh-1),SH(rl,-14));
        BL(s,P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),SH(rl,28));
        const nv=Math.max(1,Math.round(du/.35));for(let i=0;i<nv;i++){const q=u0+du*(i+.5)/nv;boxZ(s,q-.04,vm-.03,.08,.06,h+rh-2,4,'#b9c1c6','#cdd4d8','#a2abb0');}
      }else if(du>=dv){const vm=v0+dv/2;
        poly(s,[P(u0-ov,v0-ov,h),P(u1+ov,v0-ov,h),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);
        poly(s,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
        poly(s,[P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rl);
        for(let q=u0+.05;q<u1;q+=.05)BL(s,P(q,v1+ov,h-1),P(q,vm,h+rh),SH(rl,-10));
        BL(s,P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),SH(rl,30));
        if(o.sky)for(let q=u0+.12;q<u1-.1;q+=.3)poly(s,[P(q,v1-.04,h),P(q+.12,v1-.04,h),P(q+.12,vm+.04,h+rh-1),P(q,vm+.04,h+rh-1)],'#c7dbe6');
        const nv=Math.max(1,Math.round(du/.4));for(let i=0;i<nv;i++){const q=u0+du*(i+.5)/nv;boxZ(s,q-.04,vm-.04,.08,.08,h+rh-1,4,'#b9c1c6','#cdd4d8','#a2abb0');}
      }else{const um=u0+du/2;
        poly(s,[P(u0-ov,v0-ov,h),P(u0-ov,v1+ov,h),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],SH(rl,6));
        poly(s,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
        poly(s,[P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rd);
        for(let q=v0+.05;q<v1;q+=.05)BL(s,P(u1+ov,q,h-1),P(um,q,h+rh),SH(rd,-10));
        const nv=Math.max(1,Math.round(dv/.4));for(let i=0;i<nv;i++){const q=v0+dv*(i+.5)/nv;boxZ(s,um-.04,q-.04,.08,.08,h+rh-1,4,'#b9c1c6','#cdd4d8','#a2abb0');}
      }
    });
    // ---- 再生水儲槽：鋼板圓槽、環縫、紫色識別帶、斜梯、錐頂、槽頂欄杆與通氣口、出水紫管 ----
    const tank=(S,o)=>S.o(o.d!=null?o.d:o.u+o.v+o.r*1.2,(s,n)=>{
      const c=P(o.u,o.v,0),rx=L.RX(o.r),ry=Math.max(1,rx>>1),h=o.h;
      ell(s,c[0],c[1]+1,rx+2,ry+1,'#a9a59b');
      const T=o.T||['#f1f2ec','#e3e6de','#d0d4cb','#b8bdb3','#9da297'];
      cyl(s,c[0],c[1],rx,h,T,null,null);
      rings(s,c[0],c[1],rx,[Math.round(h*.22),Math.round(h*.44),Math.round(h*.66)],SH(T[2],-14));
      if(o.band!==false)band(s,c[0],c[1],rx,h-7,h-3,PURP);
      // 斜梯（沿左前方弧面上升）
      for(let i=0;i<=rx+2;i++){const x=-rx+2+i,yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5))))),z=Math.round(2+(h-4)*i/(rx+2));
        RC(s,c[0]+x,c[1]+yb-z,1,1,'#6f787d');RC(s,c[0]+x,c[1]+yb-z-3,1,1,'#8b949a');}
      const R=o.RT||['#d5d9d2','#c1c6be','#a9aea6','#8f948c'];
      cone(s,c[0],c[1]-h,rx,o.rh||Math.max(3,rx>>2),R,o.dome);
      RC(s,c[0]-1,c[1]-h-(o.rh||Math.max(3,rx>>2))-2,3,3,'#8c979d');
      RC(n,c[0],c[1]-h-(o.rh||Math.max(3,rx>>2))-3,1,1,'#ff5a4a');RC(s,c[0],c[1]-h-(o.rh||Math.max(3,rx>>2))-3,1,1,'#c0392b');
    });
    // ---- 紫外線消毒渠道：開放混凝土渠＋UV 燈組模組＋控制盤 ----
    const uvCh=(S,o)=>{const d=DD(o);S.o(d,(s,n)=>{
      const {u0,v0,du,dv,h,nb,seed}=o,u1=u0+du,v1=v0+dv,t=.04;
      boxZ(s,u0,v0,du,dv,0,h,'#cfcbc1','#dcd8ce','#aaa59a');
      const iu0=u0+t,iv0=v0+t,iu1=u1-t,iv1=v1-t;
      flatQ(s,iu0,iv0,iu1-iu0,iv1-iv0,'#8e897f',h);
      poly(s,[P(iu0,iv0,h-2),P(iu1,iv0,h-2),P(iu1,iv1,h),P(iu0,iv1,h)],'#4f93a8');
      clipQ(s,iu0,iv0,iu1-iu0,iv1-iv0,h,()=>{for(let k=0;k<Math.round(du*40);k++){const p=P(iu0+hsh(seed,k,41)*(iu1-iu0),iv0+hsh(seed,k,42)*(iv1-iv0),h-1);RC(s,p[0],p[1],3,1,hsh(seed,k,43)<.5?'#86c2d2':'#3f7d91');}});
      for(let i=0;i<nb;i++){const q=u0+du*(i+.8)/(nb+.6);
        boxZ(s,q-.05,v0+.01,.1,dv-.02,h-2,5,'#7d878c','#9aa3a8','#657075');
        for(let z=0;z<3;z++)BL(s,P(q-.05+.02+z*.03,v1-.01,h),P(q-.05+.02+z*.03,v1-.01,h+4),'#c9d1d5');
        const l=P(q+.03,v1-.01,h+4);RC(s,l[0],l[1],1,1,'#6fd0ff');RC(n,l[0],l[1],1,1,'#9fe6ff');}
      // 末端溢流堰閘門
      boxZ(s,u1-.06,v0,.03,dv,h,3,'#6f797e','#8a949a','#59636a');
    });
    S.t(d+.002,(s)=>{const {u0,v0,du,dv,h}=o;rail(s,P(u0+.02,v0+dv,h),P(u0+du-.02,v0+dv,h),4,'#e0c24a',6);});};
    // ---- 加藥區：防溢堤＋立式 PE 藥槽（標示色）＋計量泵撬＋遮雨棚 ----
    const chem=(S,o)=>S.o(DD(o),(s,n)=>{
      const {u0,v0,du,dv}=o,u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,3,'#bdb8ac','#cfcbc1','#a39e92');flatQ(s,u0+.03,v0+.03,du-.06,dv-.06,'#9c978b',3);
      const tk=o.tanks||[[.2,.25,.11,16,'#e0b83a'],[.45,.25,.11,16,'#c0392b'],[.2,.62,.09,12,'#2f6fb0']];
      for(const[a,b,r,h,lab]of tk){const c=P(u0+du*a,v0+dv*b,3),rx=L.RX(r);
        cyl(s,c[0],c[1],rx,h,['#f3f1e6','#e4e1d2','#cfcbba','#b3ae9b'],null,null);
        cone(s,c[0],c[1]-h,rx,2,['#ece9dc','#d9d5c4','#c2bdaa','#a8a38f'],true);
        band(s,c[0],c[1],rx,h-5,h-3,[SH(lab,30),lab,SH(lab,-30)]);
        RC(s,c[0]-1,c[1]-h-3,2,2,'#8c979d');}
      if(o.skid){const[a,b]=o.skid;boxZ(s,u0+du*a,v0+dv*b,.18,.1,3,6,'#6f8fb0','#86a5c4','#557594');}
      if(o.roof){const rz=o.roof>1?o.roof:22;for(const[a,b]of [[u0+.02,v1-.02],[u1-.02,v1-.02],[u1-.02,v0+.02]]){const p=P(a,b,3);RC(s,p[0],p[1]-(rz-2),1,rz-2,'#6d767b');}
        boxZ(s,u0-.02,v0-.02,du+.04,dv+.04,rz,2,'#9fb2a6','#b8c9bd','#7f9387');
        for(let q=u0+.06;q<u1;q+=.1)BL(s,P(q,v0-.02,rz+2),P(q,v1+.02,rz+2),'#8ea195');}
    });
    // ---- 輸水泵房（平頂）＋紫色出水管 ----
    const pumpH=(S,o)=>S.o(DD(o),(s,n)=>{
      const {u0,v0,du,dv,h}=o,u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,h,'#b3b0a8','#e4ddcc','#b8ae9b');
      fL(s,v1,u0,u1,0,3,'#a79e8c');fR(s,u1,v0,v1,0,3,'#8a826f');
      boxZ(s,u0-.01,v0-.01,du+.02,dv+.02,h,2,'#c9c2b0','#d9d2c0','#aea591');flatQ(s,u0+.03,v0+.03,du-.06,dv-.06,'#8f8c85',h+2);
      winL(s,u0+du*.12,v1,0,8,11,'#7d8488');for(let z=1;z<11;z+=2)winL(s,u0+du*.12,v1,z,8,1,'#9aa1a5');
      louvL(s,u0+du*.6,v1,5,6,3,'#8b8474','#5d584e');
      {const q=u0+du*.4;winL(s,q,v1,6,4,4,'#3f5a70');winL(n,q,v1,6,4,4,'#ffd98a');}
      louvR(s,u1,v0+dv*.5,6,6,3,'#7f7765','#4f4a40');
      {const lp=P(u0+du*.28,v1,13);RC(s,lp[0],lp[1],3,1,'#f3e6b6');RC(n,lp[0],lp[1],3,1,'#ffe2a0');}
      boxZ(s,u0+du*.5,v0+dv*.3,.1,.1,h+2,4,'#b9c1c6','#cdd4d8','#a7afb4');
    });
    // ---- 行政／展示中心：石材量體＋玻璃帷幕＋綠屋頂＋入口雨庇 ----
    const admin=(S,o)=>S.o(DD(o),(s,n)=>{
      const {u0,v0,du,dv,h,seed}=o,u1=u0+du,v1=v0+dv,g0=u0+du*(o.g0||.35),g1=u0+du*(o.g1||.95);
      boxZ(s,u0,v0,du,dv,0,h,'#9aa6a0','#ebe7dd','#c6c1b5');
      fL(s,v1,g0,g1,2,h-3,'#5d8aa8');
      for(let q=g0;q<=g1+.001;q+=.06)BL(s,P(q,v1,2),P(q,v1,h-3),'#a9c3d4');
      for(let z=2;z<h-3;z+=7)BL(s,P(g0,v1,z),P(g1,v1,z),'#3e6480');
      for(let q=g0+.02;q<g1-.06;q+=.18){const a=P(q,v1,h-5);BL(s,a,[a[0]+3,a[1]-3],'#cfe2ee');}
      {let i=0;for(let z=2;z<h-4;z+=7)for(let q=g0;q<g1-.03;q+=.06,i++)if(hsh(seed,i,5)<.7)fL(n,v1,q+.008,q+.052,z+1,Math.min(z+6,h-3),'#ffe2a0');}
      // 石材段（+v 面左側）與 +u 面窗
      for(let z=4;z<h-2;z+=5)BL(s,P(u0,v1,z),P(g0,v1,z),'#d9d4c8');
      winL(s,u0+du*.08,v1,4,4,5,'#4b6f8a');winL(n,u0+du*.08,v1,4,4,5,'#ffe2a0');
      for(let z=4;z<h-4;z+=7)for(let q=v0+.08;q<v1-.06;q+=.14){winR(s,u1,q+.06,z,4,4,'#4b6f8a');if(hsh(seed,Math.round(q*100),z)<.55)winR(n,u1,q+.06,z,4,4,'#ffd98a');}
      // 綠屋頂＋女兒牆
      boxZ(s,u0,v0,du,dv,h,2,'#d6d2c6','#e6e2d8','#bcb7ab');
      flatQ(s,u0+.04,v0+.04,du-.08,dv-.08,'#7fa65a',h+2);
      for(let k=0;k<Math.round(du*dv*90);k++){const p=P(u0+.05+hsh(seed,k,61)*(du-.1),v0+.05+hsh(seed,k,62)*(dv-.1),h+2);RC(s,p[0],p[1],2,1,hsh(seed,k,63)<.5?'#95bb6c':'#6a9149');}
      if(o.pv)for(let r=0;r<o.pv;r++)boxZ(s,u0+.1,v0+.08+r*.1,du*.45,.06,h+2,2,'#2f5878','#4a78a0','#244660');
      // 入口雨庇
      const eu=u0+du*(o.ent||.6);boxZ(s,eu-.12,v1,.24,.12,11,2,'#e9eaea','#f4f5f5','#c9cccc');
      for(const q of [eu-.1,eu+.1]){const p=P(q,v1+.1,0);RC(s,p[0],p[1]-11,1,11,'#8a949a');}
      {const lp=P(eu,v1+.06,10);RC(n,lp[0]-2,lp[1],5,1,'#ffe2a0');}
    });
    // ---- 管架（細線層）：鋼構門型支架＋多色管 ----
    const rackV=(S,d,u,va,vb,z,cols)=>S.t(d,(s)=>{
      for(let t=va;t<=vb+1e-6;t+=.25){const a=P(u-.05,t,0),b=P(u+.05,t,0);RC(s,a[0],a[1]-z,1,z,'#5f696e');RC(s,b[0],b[1]-z,1,z,'#7f898e');BL(s,P(u-.06,t,z),P(u+.06,t,z),'#59636a');}
      cols.forEach((col,i)=>{const off=-.04+i*.028;pipe(s,P(u+off,va,z+2),P(u+off,vb,z+2),col,2);});
    });
    const rackU=(S,d,v,ua,ub,z,cols)=>S.t(d,(s)=>{
      for(let t=ua;t<=ub+1e-6;t+=.25){const a=P(t,v-.05,0),b=P(t,v+.05,0);RC(s,a[0],a[1]-z,1,z,'#5f696e');RC(s,b[0],b[1]-z,1,z,'#7f898e');BL(s,P(t,v-.06,z),P(t,v+.06,z),'#59636a');}
      cols.forEach((col,i)=>{const off=-.04+i*.028;pipe(s,P(ua,v+off,z+2),P(ub,v+off,z+2),col,2);});
    });
    // 小汽車：走細線層（不描粗外框），自帶暗色車底，免得停車場糊成黑團
    const car=(S,u,v,k,alongV)=>S.t(u+v+.1,(s)=>{const CC=['#c0392b','#e8e8e4','#2f6fb0','#5b6066','#9aa3a8','#d9b23a'],c=CC[k%CC.length];
      if(alongV){flatQ(s,u-.005,v-.005,.08,.14,'#34383c',0);boxZ(s,u,v,.07,.13,1,3,c,SH(c,14),SH(c,-40));boxZ(s,u+.01,v+.03,.05,.07,4,2,SH(c,-6),'#35505f','#26343d');}
      else{flatQ(s,u-.005,v-.005,.14,.08,'#34383c',0);boxZ(s,u,v,.13,.07,1,3,c,SH(c,14),SH(c,-40));boxZ(s,u+.03,v+.01,.07,.05,4,2,SH(c,-6),'#26343d','#35505f');}});
    // ---- 戶外 UF 膜組架：鋼撬＋直立白色膜管排＋上下集水管 ----
    const ufSkid=(S,o)=>{const {u0,v0,du,dv}=o,rows=o.rows||2;
      S.o(DD(o)-.01,(s)=>{boxZ(s,u0,v0,du,dv,0,2,'#5f6a70','#6f7a80','#4d575c');});
      S.t(DD(o),(s)=>{for(let r=0;r<rows;r++){const vr=v0+dv*(r+.5)/rows;
        {const a=P(u0+.01,vr,0),b=P(u0+du-.01,vr,0);RC(s,a[0],a[1]-17,1,15,'#4d575c');RC(s,b[0],b[1]-17,1,15,'#4d575c');}
        pipe(s,P(u0,vr,3),P(u0+du,vr,3),L.PB,2);
        for(let q=u0+.035;q<u0+du-.02;q+=.034){const p=P(q,vr,4);RC(s,p[0],p[1]-11,1,11,'#f4f6f5');RC(s,p[0]+1,p[1]-11,1,11,'#bfc6c3');RC(s,p[0],p[1]-12,2,1,'#7f898e');}
        pipe(s,P(u0,vr,17),P(u0+du,vr,17),L.PB,2);}});};
    // ---- RO 壓力容器架：多層白色臥管＋藍色端蓋 ----
    const roRack=(S,o)=>S.t(DD(o),(s)=>{const {u0,v0,du,dv}=o,cols=o.cols||2,lv=o.lv||4;
      for(let c=0;c<cols;c++){const vv=v0+dv*(c+.5)/cols;
        for(const q of [u0,u0+du]){const p=P(q,vv,0);RC(s,p[0],p[1]-(4+lv*3),1,4+lv*3,'#4d575c');}
        for(let k=0;k<lv;k++){const z=3+k*3;BL(s,P(u0+.02,vv,z+1),P(u0+du-.02,vv,z+1),'#f4f6f5');BL(s,P(u0+.02,vv,z),P(u0+du-.02,vv,z),'#c3cac7');
          const e=P(u0+du-.02,vv,z+1);RC(s,e[0],e[1]-1,2,2,'#3f7cbc');const f=P(u0+.02,vv,z+1);RC(s,f[0]-1,f[1]-1,2,2,'#2f5f98');}
        pipe(s,P(u0+du,vv,2),P(u0+du,vv,4+lv*3),L.PB,2);}});
    // ---- 雨棚（柱＋薄屋面）----
    const canopy=(S,o)=>{S.o(DD(o)+.02,(s)=>{const {u0,v0,du,dv,z}=o;boxZ(s,u0,v0,du,dv,z,2,o.top||'#b7c2c8',o.l||'#cdd6da',o.r||'#94a0a6');
        for(let q=u0+.08;q<u0+du;q+=.12)BL(s,P(q,v0,z+2),P(q,v0+dv,z+2),SH(o.top||'#b7c2c8',-12));});
      S.t(DD(o)+.03,(s)=>{const {u0,v0,du,dv,z}=o;for(const[a,b]of [[u0+.02,v0+dv-.02],[u0+du-.02,v0+dv-.02],[u0+du-.02,v0+.02],[u0+du*.5,v0+dv-.02]]){const p=P(a,b,0);RC(s,p[0],p[1]-z,1,z,'#59636a');RC(s,p[0]+1,p[1]-z,1,z,'#8a949a');}});};
    // ---- 再生水槽車＋取水鶴管 ----
    const tanker=(S,u0,v0)=>S.o(u0+v0+.55,(s)=>{
      boxZ(s,u0,v0,.44,.12,2,2,'#3b4045','#4a5055','#33383c');
      L.hTank(s,'u',u0+.03,u0+.31,v0+.06,10,5,['#f2f4f3','#d9dedd','#b9c0bf','#98a09f'],['#e6eaea','#cdd3d2','#aeb5b4','#8d9594']);
      {const a=P(u0+.08,v0+.12,8),b=P(u0+.28,v0+.12,8);BL(s,a,b,'#9468c0');BL(s,[a[0],a[1]+1],[b[0],b[1]+1],'#7a52a6');}
      boxZ(s,u0+.33,v0,.11,.12,3,10,'#e8e8e4','#f4f4f0','#c9c9c4');
      winL(s,u0+.35,v0+.12,8,4,3,'#3c5870');winR(s,u0+.44,v0+.1,8,4,3,'#2c3a46');
      for(const q of [.07,.23,.38]){const w=P(u0+q,v0+.12,2);ell(s,w[0],w[1],2,2,'#1f2326');RC(s,w[0],w[1],1,1,'#8a9296');}
    });
    // ---- 抬高的綠地平台（地下式廠房頂）：石材擋土牆＋草坪＋步道＋採光天窗 ----
    const deck=(S,o)=>S.o(DD(o),(s,n)=>{const {u0,v0,du,dv,h,seed}=o,u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,h,'#7fa65a','#c9c2ae','#a39b86');
      for(let z=2;z<h;z+=3){BL(s,P(u0,v1,z),P(u1,v1,z),'#b5ad97');BL(s,P(u1,v0,z),P(u1,v1,z),'#8f8772');}
      for(let k=0;k<Math.round(du*dv*140);k++){const p=P(u0+.03+hsh(seed,k,71)*(du-.06),v0+.03+hsh(seed,k,72)*(dv-.06),h);RC(s,p[0],p[1],2,1,hsh(seed,k,73)<.5?'#95bb6c':'#6a9149');}
      for(const[a,b,c,e]of o.paths||[])flatQ(s,a,b,c,e,'#ddd6c3',h);
      for(const[a,b,c,e]of o.sky||[]){boxZ(s,a,b,c,e,h,2,'#9cc3d6','#c9ced0','#9aa0a2');for(let q=a+.05;q<a+c;q+=.06)BL(s,P(q,b,h+2),P(q,b+e,h+2),'#6f97ab');
        flatQ(n,a+.01,b+.01,c-.02,e-.02,'rgba(255,226,160,.55)',h+2);}
      BL(s,P(u0,v1,h),P(u1,v1,h),'#a8c98a');
    });
    const treeZ=(S,u,v,z,h=12,r=5,d)=>S.o(d!=null?d:u+v,(s)=>{const p=P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-h+r,2,h-r,'#6b5039');
      ell(s,x,y-h,r,r,'#5f8f3f');ell(s,x-1,y-h-1,r-2,r-2,'#86b457');RC(s,x+1,y-h+r-2,r-1,1,'#406a2c');RC(s,x-2,y-h-2,1,1,'#a8d27a');});
    // ---- 通風／除臭塔（方塔＋百葉＋頂蓋）----
    const ventT=(S,u0,v0,z,h,d)=>S.o(d!=null?d:u0+v0+.2,(s)=>{boxZ(s,u0,v0,.12,.12,z,h,'#8f989c','#d8d3c6','#b0aa9b');
      louvL(s,u0+.02,v0+.12,z+h-9,4,3,'#7d7768','#4f4a40');louvR(s,u0+.12,v0+.03,z+h-9,4,3,'#6f695b','#45403a');
      boxZ(s,u0-.02,v0-.02,.16,.16,z+h,2,'#6f797e','#8a949a','#59636a');});
    const parking=(g,u0,v0,du,dv,alongV)=>{flatQ(g,u0,v0,du,dv,'#76736d');
      if(alongV){for(let q=v0+.02;q<v0+dv;q+=.1)BL(g,P(u0+.02,q,0),P(u0+.16,q,0),'#d9d4c4');}
      else{for(let q=u0+.02;q<u0+du;q+=.1)BL(g,P(q,v0+.02,0),P(q,v0+.16,0),'#d9d4c4');}};
    const flags=(S,u,v)=>S.t(u+v,(s)=>{const cs=['#c0392b','#2f6fb0','#9468c0'];for(let i=0;i<3;i++){const p=P(u+i*.07,v,0);RC(s,p[0],p[1]-20,1,20,'#c9d1d5');RC(s,p[0]+1,p[1]-20,4,3,cs[i]);}});
    const pond=(g,u0,v0,du,dv,seed)=>{flatQ(g,u0-.03,v0-.03,du+.06,dv+.06,'#d9d4c6');flatQ(g,u0,v0,du,dv,'#5a9fbf');
      clipQ(g,u0,v0,du,dv,0,()=>{for(let k=0;k<Math.round(du*dv*50);k++){const p=P(u0+hsh(seed,k,51)*du,v0+hsh(seed,k,52)*dv);RC(g,p[0],p[1],3,1,hsh(seed,k,53)<.5?'#8cc6de':'#4a8aa8');}});};

    const V158=[
      (g,ng,S)=>{ // v0 標準型：MBR 開放池＋鼓風機房／UF-RO 廠房＋管架／紫外線渠道／雙再生水儲槽／加藥區／輸水泵房／行政展示中心＋停車場
        L.grass(g,1580,SZ,'#78a255');
        L.asphalt(g,.1,.95,2.8,.2,false);L.asphalt(g,1.55,1.15,.24,1.8,true);
        L.slab(g,.12,.12,1.4,.8,'#c9c5bb');L.slab(g,1.82,.1,1.06,.82,'#c9c5bb');
        L.slab(g,.12,1.2,1.4,.8,'#c9c5bb');L.slab(g,1.9,1.2,.98,.95,'#c6c2b8');L.slab(g,2.06,2.24,.82,.66,'#cfcbc1');
        parking(g,.95,2.12,.5,.74,true);
        pond(g,.25,2.25,.5,.36,1580);
        L.shadow(g,[[.15,.15,1.2,.66,26],[1.85,.42,.4,.4,34],[2.4,.2,.4,.4,34],[.15,1.22,.95,.73,7],[1.12,1.25,.28,.45,16],[1.95,1.25,.9,.25,5],[1.95,1.66,.55,.42,14],[2.58,1.62,.28,.48,15],[2.1,2.3,.75,.55,20]]);
        K.backFence(g);
        hall(S,{u0:.15,v0:.15,du:1.2,dv:.66,h:22,rh:7,door:.12,band:'#9468c0',sky:1,seed:7});
        S.t(2.2,(s)=>{pipe(s,P(1.35,.6,15),P(1.47,.6,15),L.PP,2);});
        rackV(S,2.3,1.47,.5,1.1,14,[L.PP,L.PG,L.PB]);
        rackU(S,2.31,.62,1.6,1.78,14,[L.PP]);
        tank(S,{u:2.05,v:.62,r:.27,h:30});
        tank(S,{u:2.6,v:.4,r:.27,h:30});
        mbr(S,{u0:.15,v0:1.22,du:.95,dv:.73,h:7,cells:3,seed:15801,memb:[1,2]});
        hall(S,{u0:1.12,v0:1.25,du:.28,dv:.45,h:14,rh:4,band:'#2f6fb0',seed:3});
        rackV(S,3.3,1.47,1.1,1.95,14,[L.PP,L.PG,L.PB]);
        S.t(3.31,(s)=>{pipe(s,P(1.4,1.45,12),P(1.47,1.45,12),L.PG,2);});
        uvCh(S,{u0:1.95,v0:1.25,du:.9,dv:.25,h:5,nb:3,seed:5});
        S.t(4.3,(s)=>{pipe(s,P(1.47,1.38,16),P(1.95,1.38,16),L.PP,2);riser(s,P(1.95,1.38,0),5,16,L.PP,2);});
        chem(S,{u0:1.95,v0:1.66,du:.55,dv:.42,skid:[.58,.6]});
        pumpH(S,{u0:2.58,v0:1.62,du:.28,dv:.48,h:15});
        S.t(4.8,(s)=>{for(const v of [1.74,1.96]){pipe(s,P(2.86,v,5),P(2.93,v,5),L.PP);riser(s,P(2.93,v,0),0,5,L.PP);}valve(s,P(2.9,1.96,6),'#9468c0');});
        admin(S,{u0:2.1,v0:2.3,du:.75,dv:.55,h:18,seed:11,ent:.45,pv:2});
        flags(S,1.94,2.84);
        S.t(2.2+.43+2.25,(s)=>{const p=P(.5,2.43,0);for(let z=1;z<9;z++)RC(s,p[0]+((z%3)-1),p[1]-z,1,1,z%2?'#e8f4fa':'#bfe0ee');RC(s,p[0]-2,p[1]-1,5,1,'#e8f4fa');});
        [[.12,2.2],[.14,2.72],[.6,2.86],[1.88,2.9],[2.9,1.16],[2.92,2.2]].forEach(([u,v])=>L.tree(S,u,v,14,5));
        [[.97,2.15],[.97,2.35],[1.28,2.25],[.97,2.55],[1.28,2.65]].forEach(([u,v],i)=>car(S,u,v,i,false));
        L.lamp(S,1.5,1.2,26);L.lamp(S,1.85,2.2,26);L.lamp(S,.1,.1,26);
      },
      (g,ng,S)=>{ // v1 緊湊室內型：拱頂 MBR 廠房／三座細高再生水塔槽＋跨路管橋／UF-RO 廠房＋前方紫色管架／UV 渠＋加藥雨棚／雙量體行政中心／輸水泵房＋水錘消除罐
        L.grass(g,1581,SZ,'#79a357');
        L.asphalt(g,.1,.95,2.8,.2,false);L.asphalt(g,.98,1.15,.24,1.8,true);
        L.slab(g,.12,.12,1.6,.76,'#c9c5bb');L.slab(g,1.76,.14,1.12,.62,'#c6c2b8');
        L.slab(g,1.3,1.22,1.58,.94,'#c9c5bb');L.slab(g,.12,1.2,.8,.96,'#c6c2b8');L.slab(g,2.08,2.28,.8,.6,'#cfcbc1');
        parking(g,1.28,2.3,.66,.54,false);
        L.shadow(g,[[.15,.15,1.5,.65,26],[1.84,.28,.28,.28,46],[2.22,.28,.28,.28,46],[2.6,.28,.28,.28,46],[1.35,1.3,1.5,.65,26],[.15,1.25,.7,.27,5],[.15,1.66,.65,.44,22],[.2,2.3,.65,.55,18],[2.15,2.35,.4,.45,14]]);
        K.backFence(g);
        hall(S,{u0:.15,v0:.15,du:1.5,dv:.65,h:17,rh:9,barrel:1,door:.1,wl:'#d5ddd6',wr:'#a2b2a6',rl:'#93a79d',rd:'#71857b',band:'#2f8f6a',seed:21});
        tank(S,{u:1.98,v:.42,r:.17,h:46,dome:1,rh:3,d:2.72});
        tank(S,{u:2.36,v:.42,r:.17,h:46,dome:1,rh:3,d:3.0});
        tank(S,{u:2.74,v:.42,r:.17,h:46,dome:1,rh:3,d:3.36});
        rackV(S,3.4,2.2,.66,1.3,18,[L.PP,L.PP,L.PG]);
        S.t(3.41,(s)=>{pipe(s,P(1.65,.5,12),P(1.8,.5,12),L.PG,2);for(const u of [1.98,2.36,2.74]){pipe(s,P(u,.6,20),P(u,.66,20),L.PP,2);}pipe(s,P(1.98,.66,20),P(2.74,.66,20),L.PP,2);});
        hall(S,{u0:1.35,v0:1.3,du:1.5,dv:.65,h:20,rh:6,door:.08,band:'#9468c0',sky:1,seed:23});
        rackU(S,4.1,2.1,1.4,2.85,12,[L.PP,L.PP,L.PG,L.PB]);
        uvCh(S,{u0:.15,v0:1.25,du:.7,dv:.27,h:5,nb:2,seed:9});
        chem(S,{u0:.15,v0:1.66,du:.65,dv:.44,roof:18,tanks:[[.22,.3,.1,14,'#e0b83a'],[.52,.3,.1,14,'#c0392b'],[.8,.3,.08,11,'#2f6fb0'],[.3,.72,.08,10,'#e0b83a']]});
        admin(S,{u0:.2,v0:2.3,du:.45,dv:.55,h:22,seed:31,g0:.1,g1:.9,ent:.5,pv:0,d:2.95+.2});
        admin(S,{u0:.65,v0:2.45,du:.25,dv:.4,h:11,seed:32,g0:.05,g1:.95,ent:.5,pv:2});
        pumpH(S,{u0:2.15,v0:2.35,du:.4,dv:.45,h:14});
        S.o(5.4,(s)=>{for(const q of [2.42,2.7])boxZ(s,2.66,q,.12,.04,0,3,'#b9b5ab','#cdc9bf','#a19d93');
          L.hTank(s,'v',2.36,2.78,2.72,9,5,['#e9ecef','#c8d0d6','#a3adb4','#7f8a92'],['#d7dde1','#b8c1c7','#96a0a7','#737e86']);});
        S.t(5.6,(s)=>{pipe(s,P(2.55,2.5,5),P(2.66,2.5,5),L.PP);for(const v of [2.4,2.62]){pipe(s,P(2.78,v,4),P(2.93,v,4),L.PP);riser(s,P(2.93,v,0),0,4,L.PP);}valve(s,P(2.86,2.62,5),'#9468c0');});
        [[1.28,2.35],[1.28,2.55],[1.5,2.35],[1.5,2.55],[1.72,2.35]].forEach(([u,v],i)=>car(S,u+.02,v+.02,i+2,true));
        [[.1,1.1],[.12,2.2],[1.1,2.9],[2.0,2.92],[2.92,1.2],[2.92,2.1],[.9,2.95]].forEach(([u,v])=>L.tree(S,u,v,14,5));
        L.lamp(S,1.24,1.2,26);L.lamp(S,2.9,.95,26);L.lamp(S,.94,2.3,24);
        return{gate:[.3,.41]};
      },
      (g,ng,S)=>{ // v2 開放膜組型：五格 MBR 開放池＋鼓風機組／戶外 UF 膜組架×2／大型穹頂再生水池／RO 小廠房／UV 渠／加藥區／紅磚雙坡行政樓／公共取水站
        L.grass(g,1582,SZ,'#77a054');
        L.asphalt(g,.1,2.0,2.8,.2,false);L.asphalt(g,1.28,2.2,.24,.75,true);
        L.slab(g,.12,.12,1.6,.9,'#c9c5bb');L.slab(g,.14,1.02,1.12,.96,'#c6c2b8');L.slab(g,1.36,1.24,1.52,.72,'#c9c5bb');
        {const c=P(2.3,.72);L.ell(g,c[0],c[1],28,14,'#b9b5aa');}
        L.slab(g,1.9,2.3,.9,.5,'#c6c2b8');
        L.shadow(g,[[.15,.15,1.5,.6,7],[1.95,.35,.7,.7,24],[.2,1.05,1.0,.25,17],[.2,1.4,1.0,.25,17],[1.4,1.3,.5,.65,24],[2.1,1.4,.75,.5,14],[.25,2.35,.85,.45,22],[1.95,2.35,.5,.4,13]]);
        K.backFence(g);
        mbr(S,{u0:.15,v0:.15,du:1.5,dv:.6,h:7,cells:5,seed:15821,memb:[1,3]});
        S.o(1.72,(s)=>{for(let i=0;i<4;i++){const u0=.24+i*.34;boxZ(s,u0,.8,.22,.13,0,8,'#9eb3c2','#b7c9d6','#7f96a6');louvL(s,u0+.03,.93,2,4,1,'#6d8494','#4d6070');
          const e=P(u0+.16,.86,8);RC(s,e[0],e[1]-3,2,3,'#59636a');}});
        S.t(1.73,(s)=>{pipe(s,P(.2,.78,11),P(1.5,.78,11),L.PG,2);});
        tank(S,{u:2.3,v:.72,r:.52,h:20,dome:1,rh:8,d:3.55});
        ufSkid(S,{u0:.2,v0:1.05,du:1.0,dv:.25,rows:2});
        ufSkid(S,{u0:.2,v0:1.4,du:1.0,dv:.25,rows:2});
        uvCh(S,{u0:.2,v0:1.72,du:1.0,dv:.22,h:5,nb:3,seed:12});
        hall(S,{u0:1.4,v0:1.3,du:.5,dv:.65,h:20,rh:6,band:'#9468c0',seed:41});
        S.t(3.3,(s)=>{pipe(s,P(1.2,1.36,15),P(1.4,1.36,15),L.PB,2);pipe(s,P(1.9,1.4,12),P(2.02,1.4,12),L.PP,2);pipe(s,P(2.02,1.4,12),P(2.02,1.1,12),L.PP,2);riser(s,P(2.02,1.1,0),0,12,L.PP,2);});
        chem(S,{u0:2.1,v0:1.4,du:.75,dv:.5,skid:[.6,.62],tanks:[[.18,.3,.1,15,'#e0b83a'],[.42,.3,.1,15,'#c0392b'],[.2,.72,.08,11,'#2f6fb0']]});
        S.o(.25+2.35+.85+.45,(s,n)=>{ // 紅磚雙坡行政樓
          const u0=.25,v0=2.35,du=.85,dv=.45,h=15,u1=u0+du,v1=v0+dv;
          L.gable(s,u0,v0,du,dv,h,9,'u','#b4674c','#8b4b37','#6f7076','#505157');
          for(let z=3;z<h;z+=3){BL(s,P(u0,v1,z),P(u1,v1,z),'#a45d44');BL(s,P(u1,v0,z),P(u1,v1,z),'#7c4231');}
          fL(s,v1,u0,u1,0,2,'#cfc6b4');fR(s,u1,v0,v1,0,2,'#a79e8c');
          for(let i=0;i<6;i++){const q=u0+.05+i*.13;if(i===2){winL(s,q,v1,0,6,10,'#e6dccb');winL(s,q+.01,v1,0,5,9,'#5a4636');continue;}
            for(const z of [3,9]){winL(s,q,v1,z,4,4,'#e6dccb');winL(s,q+.005,v1,z+1,3,3,'#3c5870');if(hsh(51,i,z)<.65)winL(n,q+.005,v1,z+1,3,3,'#ffd98a');}}
          for(const z of [3,9]){winR(s,u1,v0+.2,z,3,4,'#e6dccb');winR(s,u1,v0+.2,z+1,2,3,'#3c5870');}
          {const lp=P(u0+.31,v1,11);RC(s,lp[0],lp[1],3,1,'#f3e6b6');RC(n,lp[0],lp[1],3,1,'#ffe2a0');}
          const ch=P(u0+.7,v0+.1,h+5);RC(s,ch[0],ch[1]-5,3,5,'#8b4b37');RC(s,ch[0],ch[1]-6,3,1,'#5a5b60');
        });
        S.o(1.62+2.42+.3,(s,n)=>{ // 公共再生水取水站（紫色標示亭）
          boxZ(s,1.62,2.42,.16,.12,0,10,'#7a52a6','#9468c0','#5e3d86');boxZ(s,1.6,2.4,.2,.16,10,2,'#e6e6e2','#f2f2ee','#c9c9c4');
          winL(s,1.65,2.54,4,3,3,'#dcd0ec');{const q=P(1.72,2.54,7);RC(n,q[0],q[1],2,1,'#d8b8ff');}
          const t=P(1.86,2.48,0);RC(s,t[0],t[1]-8,2,8,'#9468c0');RC(s,t[0]-3,t[1]-8,4,2,'#9468c0');});
        pumpH(S,{u0:1.95,v0:2.35,du:.5,dv:.4,h:13,d:4.8});
        S.t(4.9,(s)=>{for(const v of [2.48,2.64]){pipe(s,P(2.45,v,4),P(2.93,v,4),L.PP);riser(s,P(2.93,v,0),0,4,L.PP);}valve(s,P(2.65,2.48,5),'#9468c0');valve(s,P(2.72,2.64,5),'#9468c0');});
        [[.12,2.9],[.5,2.92],[1.12,2.92],[2.92,1.35],[2.92,1.95],[2.9,2.9],[2.55,2.9]].forEach(([u,v])=>L.tree(S,u,v,14,5));
        L.lamp(S,1.24,2.22,26);L.lamp(S,2.9,.12,26);L.lamp(S,.1,.1,26);
        return{gate:[.41,.52]};
      },
      (g,ng,S)=>{ // v3 工業供水型：雙大型錐頂儲槽／MBR 池／RO 雨棚（多層壓力容器架＋保安過濾器＋濃水槽）／UV 渠＋加藥／槽車取水站（鶴管）／玻璃展示館＋紫色倒影池
        L.grass(g,1583,SZ,'#78a255');
        L.asphalt(g,.1,.95,2.8,.2,false);L.asphalt(g,1.55,1.15,.24,1.8,true);L.asphalt(g,.18,2.14,1.37,.6,false,false);
        L.slab(g,.12,.12,1.5,.8,'#c9c5bb');L.slab(g,1.66,.12,1.22,.8,'#c6c2b8');L.slab(g,.14,1.2,1.36,.9,'#c9c5bb');L.slab(g,1.9,1.2,.98,.9,'#c6c2b8');
        pond(g,2.08,2.66,.72,.2,1583);
        L.shadow(g,[[.3,.3,.4,.4,30],[1.0,.3,.4,.4,30],[1.72,.18,1.1,.62,7],[.2,1.25,1.2,.55,22],[1.95,1.25,.9,.25,5],[1.95,1.62,.65,.4,14],[.25,2.2,.7,.4,20],[2.05,2.25,.75,.35,13]]);
        K.backFence(g);
        tank(S,{u:.52,v:.52,r:.33,h:28,rh:6});
        tank(S,{u:1.24,v:.5,r:.33,h:28,rh:6});
        mbr(S,{u0:1.72,v0:.18,du:1.12,dv:.62,h:7,cells:4,seed:15831,memb:[0,2]});
        rackU(S,2.96,.95,.5,1.5,16,[L.PP,L.PG]);
        roRack(S,{u0:.28,v0:1.3,du:1.0,dv:.42,cols:2,lv:5,d:2.6});
        canopy(S,{u0:.2,v0:1.22,du:1.2,dv:.3,z:24,d:2.9});
        S.o(3.2,(s)=>{for(let i=0;i<4;i++){const c=P(.36+i*.2,1.92,0);cyl(s,c[0],c[1],3,11,['#eef1f2','#cfd6da','#aab3b8','#879096'],'#dfe5e8','#aab3b8');RC(s,c[0]-1,c[1]-14,3,2,'#59636a');}
          const c=P(1.22,1.95,0);cyl(s,c[0],c[1],6,14,['#8fa8b8','#6f8ea2','#57758a','#415a6c'],'#a6bccb','#57758a');});
        uvCh(S,{u0:1.95,v0:1.25,du:.9,dv:.25,h:5,nb:3,seed:13});
        chem(S,{u0:1.95,v0:1.62,du:.65,dv:.4,roof:16,tanks:[[.2,.3,.09,12,'#e0b83a'],[.5,.3,.09,12,'#c0392b'],[.8,.3,.07,10,'#2f6fb0']]});
        pumpH(S,{u0:2.66,v0:1.62,du:.22,dv:.4,h:13});
        canopy(S,{u0:.25,v0:2.2,du:.7,dv:.4,z:20,top:'#a58cc4',l:'#bba5d6',r:'#8a6fae',d:3.5});
        tanker(S,.38,2.36);
        S.t(3.56,(s)=>{const p=P(.9,2.3,0);RC(s,p[0],p[1]-18,2,18,'#9468c0');RC(s,p[0],p[1]-18,1,18,'#b58ad8');BL(s,[p[0],p[1]-17],P(.66,2.42,19),'#9468c0');BL(s,[p[0],p[1]-16],P(.66,2.42,18),'#7a52a6');
          const q=P(.66,2.42,18);RC(s,q[0],q[1],1,4,'#5e3d86');});
        admin(S,{u0:2.08,v0:2.26,du:.72,dv:.34,h:13,seed:61,g0:.04,g1:.96,ent:.5,pv:0});
        S.t(5.4,(s)=>{for(const u of [2.3,2.58]){const p=P(u,2.76,0);for(let z=1;z<7;z++)RC(s,p[0]+((z%3)-1),p[1]-z,1,1,z%2?'#f0e6fa':'#d8c4ee');}});
        [[.12,2.9],[.9,2.92],[1.3,2.92],[1.92,2.92],[2.92,1.1],[2.92,.2],[.12,1.1]].forEach(([u,v])=>L.tree(S,u,v,14,5));
        L.lamp(S,1.5,1.2,26);L.lamp(S,1.85,2.2,26);L.lamp(S,1.1,2.9,24);
      },
      (g,ng,S)=>{ // v4 公園化半地下式：廠房上覆綠地平台（步道／採光天窗／通風除臭塔／樹）＋後場 UF-RO 廠房＋管枕管線／半埋式穹頂清水池＋覆土坡／玻璃展示館＋再生水溪流＋木棧橋／停車場／輸水泵房
        L.grass(g,1584,SZ,'#7aa457');
        L.asphalt(g,1.9,1.0,.22,1.95,true);L.asphalt(g,2.12,1.92,.78,.18,false);
        L.slab(g,1.96,.12,.92,.84,'#c9c5bb');
        {const c=P(2.5,1.46);L.ell(g,c[0],c[1],24,12,'#6e9a4e');L.ell(g,c[0],c[1],21,10,'#80ab5c');}
        parking(g,2.14,2.14,.7,.3,false);
        {const u0=.2,v0=2.62,du=1.62,dv=.2;L.flatQ(g,u0-.03,v0-.03,du+.06,dv+.06,'#bdb49c');L.flatQ(g,u0,v0,du,dv,'#6a8fbf');
          L.clipQ(g,u0,v0,du,dv,0,()=>{for(let k=0;k<70;k++){const p=P(u0+hsh(1584,k,51)*du,v0+hsh(1584,k,52)*dv);RC(g,p[0],p[1],3,1,hsh(1584,k,53)<.5?'#a9c6e6':'#56789f');}});}
        L.shadow(g,[[.15,.15,1.7,1.7,7],[2.0,.15,.85,.6,24],[2.2,1.2,.55,.55,10],[.3,2.12,.8,.38,14],[2.2,2.5,.55,.35,13]]);
        K.backFence(g);
        deck(S,{u0:.15,v0:.15,du:1.7,dv:1.7,h:7,seed:1584,d:3.7,
          paths:[[.15,.9,1.7,.1],[.9,.15,.1,1.7]],sky:[[.3,.35,.45,.12],[1.15,.35,.45,.12],[.3,1.4,.45,.12]]});
        ventT(S,1.25,1.3,7,13,3.75);ventT(S,1.5,1.3,7,13,3.8);ventT(S,1.25,1.55,7,13,3.95);
        [[.35,.72],[.65,.72],[1.2,.72],[1.55,.72],[.35,1.2],[.65,1.2],[.45,1.65],[.72,1.65]].forEach(([u,v],i)=>treeZ(S,u,v,7,13,5,3.72+i*.01));
        S.o(3.9,(s)=>{const a=P(.95,1.85,0);boxZ(s,.9,1.85,.1,.12,0,4,'#ddd6c3','#c9c2ae','#a39b86');for(let z=1;z<7;z+=2)BL(s,P(.9,1.85+z*.015,7-z),P(1.0,1.85+z*.015,7-z),'#b5ad97');});
        hall(S,{u0:2.0,v0:.15,du:.85,dv:.6,h:20,rh:6,door:.15,band:'#9468c0',sky:1,seed:71,d:3.98});
        S.t(3.99,(s)=>{for(let q=.85;q<1.2;q+=.12){const a=P(2.3,q,0),b=P(2.46,q,0);BL(s,a,b,'#8d887c');}
          pipe(s,P(2.34,.75,3),P(2.34,1.2,3),L.PP);pipe(s,P(2.42,.75,3),P(2.42,1.2,3),L.PG);});
        tank(S,{u:2.5,v:1.46,r:.34,h:9,dome:1,rh:5,d:4.2});
        S.o(.3+2.12+.8+.38,(s,n)=>{ // 玻璃展示館（全玻璃＋懸挑屋頂）
          const o={u0:.3,v0:2.12,du:.8,dv:.38,h:14};
          boxZ(s,o.u0,o.v0,o.du,o.dv,0,o.h,'#9aa6a0','#6f9ab6','#557c96');
          for(let q=o.u0;q<o.u0+o.du;q+=.06)BL(s,P(q,o.v0+o.dv,1),P(q,o.v0+o.dv,o.h-1),'#b7d0de');
          for(let q=o.v0;q<o.v0+o.dv;q+=.06)BL(s,P(o.u0+o.du,q,1),P(o.u0+o.du,q,o.h-1),'#8fb0c4');
          BL(s,P(o.u0,o.v0+o.dv,7),P(o.u0+o.du,o.v0+o.dv,7),'#4f7a96');
          {let i=0;for(const[z0,z1]of [[2,7],[8,13]]){for(let q=o.u0;q<o.u0+o.du-.03;q+=.06,i++)if(hsh(1586,i,1)<.6)fL(n,o.v0+o.dv,q+.01,q+.05,z0,z1,'#ffe2a0');
            for(let q=o.v0;q<o.v0+o.dv-.03;q+=.06,i++)if(hsh(1586,i,2)<.45)fR(n,o.u0+o.du,q+.01,q+.05,z0,z1,'#ffd98a');}}
          boxZ(s,o.u0-.06,o.v0-.06,o.du+.12,o.dv+.12,o.h,2,'#e9eaea','#f4f5f5','#c9cccc');
          flatQ(s,o.u0+.02,o.v0+.02,o.du-.04,o.dv-.04,'#7fa65a',o.h+2);
          for(let k=0;k<30;k++){const p=P(o.u0+.04+hsh(1585,k,1)*(o.du-.08),o.v0+.04+hsh(1585,k,2)*(o.dv-.08),o.h+2);RC(s,p[0],p[1],2,1,hsh(1585,k,3)<.5?'#95bb6c':'#6a9149');}
        });
        S.t(4.8,(s)=>{for(const q of [.9,1.4]){boxZ(s,q,2.58,.08,.28,0,2,'#b08a60','#c49a6c','#8a6a48');}});
        pumpH(S,{u0:2.2,v0:2.5,du:.55,dv:.35,h:13});
        S.t(5.4,(s)=>{for(const v of [2.6,2.75]){pipe(s,P(2.75,v,4),P(2.93,v,4),L.PP);riser(s,P(2.93,v,0),0,4,L.PP);}});
        [[2.2,2.18],[2.42,2.18],[2.64,2.18]].forEach(([u,v],i)=>car(S,u,v,i+1,true));
        [[.12,2.0],[1.3,2.2],[1.62,2.2],[2.92,1.2],[2.92,1.7],[.12,2.9],[1.85,2.9]].forEach(([u,v])=>L.tree(S,u,v,14,5));
        L.lamp(S,1.86,1.0,26);L.lamp(S,2.9,2.1,24);L.lamp(S,1.2,2.55,20);
        return{gate:[.62,.72]};
      },
    ];
    for(let v=0;v<V158.length;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V158[v](g,ng,S)||{};S.run();
      B['158_1_'+v]=L.done(c,g,nc,Object.assign({fence:true,gate:[.5,.62]},opt));
    }
  }catch(e){console.error('infra575 k158',e);}
});
