// T575 infra_b1：k155 供水加壓站／k163 配水調壓站（1×1）、k151 河川取水口／k152 地下水井場（2×2）真實設施風格重畫。
// 分層合成：每個立體主體自成一層（hard 二值化＋深色外框），管線／欄杆／細鋼構走不描邊的細線層；
// 水面、草地、路面、標線畫在地面層不描粗。夜光按層遮擋（後層實體擦掉被擋住的燈），水面不發光。
// 零亂數：只用 K.hsh 決定性雜湊。
(window.__variants574=window.__variants574||[]).push(function infra_b1(A){
  const B=A.SPR().bld;
  const SH=A.shade;

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,poly,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<800;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
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
    // 直立圓柱：tones 左亮→右暗
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(rim)ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-(rim?1:0),Math.max(0,ry-(rim?1:0)),top);return[cx,cy-h];};
    // 圓柱正面環縫（下半弧）
    const rings=(g,cx,cy,rx,zs,col)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(const z of zs)for(let x=-rx+1;x<=rx-1;x++){const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=col;g.fillRect(cx+x,cy-z+yb,1,1);}};
    // 臥式圓筒（膠囊）：沿 u 或 v 掃圓，逐像素依法線著色；最後一圈是端蓋
    const hTank=(g,axis,a0,a1,o,zc,r,T,cap)=>{const n=Math.max(2,Math.ceil(Math.abs(a1-a0)*44));
      for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n,c=axis==='u'?P(t,o,zc):P(o,t,zc),cx=Math.round(c[0]),cy=Math.round(c[1]),pal=i===n?cap:T;
        for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const q=dx*dx+dy*dy;if(q>r*r+r*.6)continue;
          let l=-(dx*.45+dy*.9)/r;if(i===n&&q>=(r-1)*(r-1)+r*.6)l=-2;
          g.fillStyle=pal[l>.5?0:l>-.05?1:l>-.6?2:3];g.fillRect(cx+dx,cy+dy,1,1);}}};
    // 雙坡屋頂房：ridge 'v'（山牆朝 +v 亮面）或 'u'（山牆朝 +u 暗面）
    const gable=(g,u0,v0,du,dv,h,rh,ridge,wl,wr,rl,rd,ov=.025)=>{const u1=u0+du,v1=v0+dv;
      boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
      if(ridge==='v'){const um=u0+du/2;
        poly(g,[P(u0-ov,v0-ov,h-1),P(u0-ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rl);
        poly(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
        poly(g,[P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rd);
        BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,24));
        return{um,top:P(um,v1,h+rh)};}
      const vm=v0+dv/2;
      poly(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);
      poly(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
      poly(g,[P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rl);
      BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),SH(rl,24));return{vm};};
    const brickL=(g,v,ua,ub,z0,z1,c)=>{for(let z=z0+2;z<z1;z+=3)BL(g,P(ua,v,z),P(ub,v,z),c);};
    const brickR=(g,u,va,vb,z0,z1,c)=>{for(let z=z0+2;z<z1;z+=3)BL(g,P(u,va,z),P(u,vb,z),c);};
    // 管線（3px：亮／中／暗）
    const PB=['#9cc8ec','#3f7cbc','#274f82'];
    const PG=['#c9d1d5','#8c979d','#555f65'];
    const pipe=(g,a,b,col=PB,th=3)=>{if(th===3){BL(g,[a[0],a[1]-1],[b[0],b[1]-1],col[0]);BL(g,a,b,col[1]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],col[2]);}
      else{BL(g,a,b,col[0]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],col[2]);}};
    const riser=(g,p,z0,z1,col=PB,th=3)=>{const x=Math.round(p[0])-1,y=Math.round(p[1]);RC(g,x,y-z1,1,z1-z0+1,col[0]);RC(g,x+1,y-z1,1,z1-z0+1,col[1]);if(th===3)RC(g,x+2,y-z1,1,z1-z0+1,col[2]);};
    const flange=(g,p,col='#1f3d63')=>{RC(g,p[0]-1,p[1]-2,1,5,col);};
    const collar=(g,p)=>{RC(g,p[0]-3,p[1],7,2,'#a9a59b');RC(g,p[0]-2,p[1]+2,5,1,'#8d8a82');};
    const valve=(g,p,wheel='#c8413a')=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-2,3,4,'#2b3f55');RC(g,x-1,y-2,1,4,'#4d6782');RC(g,x,y-5,1,3,'#59636a');RC(g,x-2,y-6,5,1,wheel);RC(g,x-2,y-6,2,1,'#ec7a6e');};
    const gauge=(g,p)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-3,1,3,'#59636a');RC(g,x-1,y-6,3,3,'#f1f3f4');RC(g,x,y-5,1,1,'#1d2226');};
    const lamp=(S,u,v,h=22)=>S.t(u+v+.001,(s,n)=>{const p=P(u,v);RC(s,p[0],p[1]-h,1,h,'#59636a');RC(s,p[0]+1,p[1]-h,1,h,'#98a1a6');RC(s,p[0]-2,p[1]-h-1,5,2,'#d3d9dc');RC(n,p[0]-2,p[1]-h-1,5,2,'#ffe2a0');RC(n,p[0]-1,p[1]-h+1,3,1,'rgba(255,226,160,.55)');});
    const sign=(S,u,v,c='#2f6fb0')=>S.t(u+v,(s)=>{const p=P(u,v);RC(s,p[0],p[1]-6,1,6,'#5f686e');RC(s,p[0]-2,p[1]-9,5,4,'#f2f4f5');RC(s,p[0]-2,p[1]-9,5,1,c);RC(s,p[0]-1,p[1]-7,3,1,'#8f989d');});
    const cabinet=(S,u0,v0,du,dv,h,opt={})=>S.o(opt.d!=null?opt.d:u0+v0+du+dv,(s,n)=>{boxZ(s,u0,v0,du,dv,0,h,opt.top||'#b6bec2',opt.l||'#d9dee0',opt.r||'#9aa3a7');
      const p=P(u0+du*.5,v0+dv,1);
      BL(s,[p[0],p[1]-1],[p[0],p[1]-h+2],'#8b9498');
      RC(s,p[0]+2,p[1]-h+3,1,1,'#58cf96');RC(n,p[0]+2,p[1]-h+3,1,1,'#7dffc0');
      if(opt.hood)boxZ(s,u0-.02,v0-.02,du+.04,dv+.05,h,1,'#8f989c','#a8b0b4','#7d868a');});
    const bush=(S,u,v,r=3,c=['#8cc45a','#4f8a34','#356224'])=>S.o(u+v,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
      ell(s,x,y-r,r,Math.max(1,r-1),c[1]);ell(s,x-1,y-r-1,Math.max(1,r-2),Math.max(1,r-2),c[0]);RC(s,x+1,y-1,r-1,1,c[2]);});
    const tree=(S,u,v,h=12,r=5)=>S.o(u+v,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-h+r,2,h-r,'#6b5039');
      ell(s,x,y-h,r,r,'#5f8f3f');ell(s,x-1,y-h-1,r-2,r-2,'#86b457');RC(s,x+1,y-h+r-2,r-1,1,'#406a2c');RC(s,x-2,y-h-2,1,1,'#a8d27a');});
    const rail=(g,a,b,h=4,c='#e0c24a',step=4)=>{BL(g,[a[0],a[1]-h],[b[0],b[1]-h],c);BL(g,[a[0],a[1]-h+2],[b[0],b[1]-h+2],SH(c,-40));
      const n=Math.max(1,Math.round(Math.abs(b[0]-a[0])/step));for(let i=0;i<=n;i++){const q=lerp(a,b,i/n);RC(g,q[0],q[1]-h,1,h,SH(c,-60));}};
    // 鵝頸通氣管
    const goose=(g,p,h=7,c=PG)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-h,1,h,c[0]);RC(g,x+1,y-h,1,h,c[2]);RC(g,x,y-h-2,4,2,c[1]);RC(g,x,y-h-2,4,1,c[0]);RC(g,x+3,y-h,1,2,c[2]);};
    // 人孔蓋／檢修艙口（平放）
    const hatch=(g,u0,v0,du,dv,z,c='#7f898e')=>{flatQ(g,u0,v0,du,dv,SH(c,-26),z);flatQ(g,u0+.012,v0+.012,du-.024,dv-.024,c,z);
      const m=P(u0+du*.5,v0+dv*.5,z);RC(g,m[0]-1,m[1],3,1,SH(c,40));};
    // 四坡攢尖屋頂（置於牆頂 h）
    const hip=(g,u0,v0,du,dv,h,rh,cL,cR,cB,ov=.025)=>{const u1=u0+du+ov,v1=v0+dv+ov,a=u0-ov,b=v0-ov,ap=P(u0+du/2,v0+dv/2,h+rh);
      poly(g,[P(a,b,h),P(u1,b,h),ap],cB);poly(g,[P(a,b,h),P(a,v1,h),ap],SH(cL,10));
      poly(g,[P(a,v1,h),P(u1,v1,h),ap],cL);poly(g,[P(u1,b,h),P(u1,v1,h),ap],cR);
      BL(g,P(u1,v1,h),ap,SH(cL,20));};
    const manhole=(g,u,v,z,r=3)=>{const p=P(u,v,z);ell(g,p[0],p[1],r+1,Math.max(1,(r+1)>>1),'#6c6a64');ell(g,p[0],p[1],r,Math.max(1,r>>1),'#4a4d50');RC(g,p[0]-1,p[1],3,1,'#6f7478');};
    // 地面：草地、碎石、混凝土
    const grass=(g,seed,SZ,base='#78a255')=>{A.dia(g,K.AX,K.TOPY,32*SZ,base);
      for(let i=0;i<Math.round(46*SZ*SZ);i++){const u=hsh(seed,i,1)*SZ,v=hsh(seed,i,2)*SZ,p=P(u,v,0),t=hsh(seed,i,3);RC(g,p[0],p[1],t<.3?2:1,1,t<.5?SH(base,-16):SH(base,14));}
      A.diaEdge(g,6,SH(base,-26),K.AX,K.TOPY,32*SZ);A.diaEdge(g,9,SH(base,18),K.AX,K.TOPY,32*SZ);};
    const gravel=(g,u0,v0,du,dv,seed,base='#b3aea3')=>{flatQ(g,u0,v0,du,dv,base);
      const n=Math.round(du*dv*60);for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,5)*du,v0+hsh(seed,i,6)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,7)<.5?SH(base,-14):SH(base,12));}};
    const slab=(g,u0,v0,du,dv,c='#cdc9bf')=>{flatQ(g,u0,v0,du,dv,c);BL(g,P(u0,v0+dv),P(u0+du,v0+dv),SH(c,-22));BL(g,P(u0+du,v0),P(u0+du,v0+dv),SH(c,-30));};
    // 地面疊層：先畫到暫存層→二值化→只落在既有地面上（不外溢菱形）
    const G=(g,fn)=>{const[sc,sx]=A.cv(W,H);fn(sx);K.hard(sc);g.save();g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    const WAT={base:'#3f7ea6',deep:'#336f96',lite:'#79b3d4',foam:'#d2e9f1'};
    const clipQ=(x,u0,v0,du,dv,z,fn)=>{x.save();x.beginPath();const q=[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];x.moveTo(q[0][0],q[0][1]);for(let i=1;i<4;i++)x.lineTo(q[i][0],q[i][1]);x.closePath();x.clip();fn();x.restore();};
    const water=(x,u0,v0,du,dv,seed,z=0,dens=24)=>{flatQ(x,u0,v0,du,dv,WAT.base,z);
      clipQ(x,u0,v0,du,dv,z,()=>{const n=Math.round(du*dv*dens);for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,11)*du,v0+hsh(seed,i,12)*dv,z),t=hsh(seed,i,13);
        RC(x,p[0],p[1],2+Math.floor(t*3),1,t<.5?WAT.lite:WAT.deep);}});};
    const riprap=(x,u0,v0,du,dv,seed,base='#9d998f')=>{flatQ(x,u0,v0,du,dv,base);
      clipQ(x,u0,v0,du,dv,0,()=>{const n=Math.round(du*dv*120);for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,21)*du,v0+hsh(seed,i,22)*dv),t=hsh(seed,i,23);
        RC(x,p[0],p[1],2,1,t<.4?'#c4c0b6':t<.75?'#7c786f':'#b0aca2');}});};
    const asphalt=(x,u0,v0,du,dv,alongV)=>{flatQ(x,u0,v0,du,dv,'#7a7771');
      if(alongV){const um=u0+du/2;for(let t=v0+.04;t<v0+dv-.06;t+=.14)BL(x,P(um,t),P(um,t+.06),'#d9d4c4');BL(x,P(u0,v0),P(u0,v0+dv),'#9a968e');}
      else{const vm=v0+dv/2;for(let t=u0+.04;t<u0+du-.06;t+=.14)BL(x,P(t,vm),P(t+.06,vm),'#d9d4c4');BL(x,P(u0,v0),P(u0+du,v0),'#9a968e');}};
    // 矩形混凝土池（有水）：div=[{a:'u'|'v',t}] 隔牆
    const basin=(s,u0,v0,du,dv,h,seed,div=[],wc='#cfcbc1')=>{const t=.035,u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,h,wc,SH(wc,10),SH(wc,-26));
      const iu0=u0+t,iv0=v0+t,iu1=u1-t,iv1=v1-t;
      flatQ(s,iu0,iv0,iu1-iu0,iv1-iv0,SH(wc,-44),h);
      poly(s,[P(iu0,iv0,h-3),P(iu1,iv0,h-3),P(iu1,iv1,h),P(iu0,iv1,h)],WAT.base);
      poly(s,[P(iu0,iv0,h),P(iu1,iv0,h),P(iu1,iv0,h-3),P(iu0,iv0,h-3)],SH(wc,-18));
      clipQ(s,iu0,iv0,iu1-iu0,iv1-iv0,h,()=>{const n=Math.round(du*dv*30);for(let i=0;i<n;i++){const p=P(iu0+hsh(seed,i,31)*(iu1-iu0),iv0+hsh(seed,i,32)*(iv1-iv0),h-1);RC(s,p[0],p[1],2,1,hsh(seed,i,33)<.5?WAT.lite:WAT.deep);}});
      for(const d of div){if(d.a==='u'){boxZ(s,iu0,d.t-.015,iu1-iu0,.03,h-3,3,wc,SH(wc,10),SH(wc,-26));}else{boxZ(s,d.t-.015,iv0,.03,iv1-iv0,h-3,3,wc,SH(wc,10),SH(wc,-26));}}
      BL(s,P(u0,v1,h),P(u1,v1,h),SH(wc,26));};
    // 攔污柵開口（+v 面）：深水色＋直條鋼柵
    const rackL=(s,u,v,z,w,h)=>{winL(s,u,v,z,w,h,'#1d3a4e');for(let i=0;i<w;i+=2){const p=P(u,v,z);RC(s,Math.round(p[0])+i,Math.round(p[1])-h+Math.floor(i*.5),1,h,'#9aa6ab');}winL(s,u,v,z+h-1,w,1,'#6b767b');};
    const rackR=(s,u,v,z,w,h)=>{winR(s,u,v,z,w,h,'#1d3a4e');const p=P(u,v,z);for(let i=0;i<w;i+=2){RC(s,Math.round(p[0])-i,Math.round(p[1])-h+Math.floor(i*.5),1,h,'#9aa6ab');}winR(s,u,v,z+h-1,w,1,'#6b767b');};
    // 閘門啟閉機（黃色減速機＋螺桿）
    const hoist=(s,u,v,z,c='#e0a83a')=>{boxZ(s,u-.035,v-.03,.07,.06,z,4,SH(c,24),c,SH(c,-44));const p=P(u,v,z+4);RC(s,p[0],p[1]-6,1,6,'#59636a');RC(s,p[0]-1,p[1]-6,3,1,'#8b959a');
      const m=P(u+.035,v,z+2);RC(s,m[0]-1,m[1]-2,3,3,'#4f6f8f');};
    return{G,WAT,clipQ,water,riprap,asphalt,basin,rackL,rackR,hoist,RC,BL,lerp,boxZ,fL,fR,flatQ,pg,winL,winR,louvL,louvR,scene,done,shadow,ell,cyl,rings,hTank,gable,brickL,brickR,PB,PG,pipe,riser,flange,collar,valve,gauge,lamp,sign,cabinet,bush,tree,rail,goose,hatch,hip,manhole,grass,gravel,slab};
  };

  // ================= k155 供水加壓站（1×1，76×96，錨點 38,94） =================
  try{
    const K=A.iso575(76,96,38,94,1),L=LIB(K),{P}=K;
    const {RC,BL,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,rings,hTank,gable,pipe,riser,flange,collar,valve,gauge,goose,hatch}=L;
    const TK=['#f4f7f8','#d3dde2','#a9b8c0','#7d8d96'],TKC=['#e3eaee','#c1ccd2','#9aa9b1','#6f7f88'];
    const BLU=['#8fbde8','#5a92cf','#3d72b0','#2a5388'];
    // 平頂泵房：女兒牆、勒腳、檢修門＋雨遮、通風百葉、藍色機構牌
    const pumpHouse=(S,o)=>S.o(o.d!=null?o.d:o.u0+o.v0+o.du+o.dv,(s,n)=>{
      const {u0,v0,du,dv,h}=o,u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,h,'#b3b0a8',o.wl||'#e4ddcc',o.wr||'#b8ae9b');
      fL(s,v1,u0,u1,0,2,'#a79e8c');fR(s,u1,v0,v1,0,2,'#8a826f');
      flatQ(s,u0+.025,v0+.025,du-.05,dv-.05,'#8f8c85',h);
      BL(s,P(u0,v1,h),P(u1,v1,h),'#f3eee2');
      const du0=u0+du*o.door;
      winL(s,du0-.01,v1,0,5,9,'#cfc7b5');winL(s,du0,v1,0,4,8,'#56697c');winL(s,du0+.06,v1,4,1,1,'#c9d2d8');
      boxZ(s,du0-.02,v1,.16,.03,9,1,'#8d969b','#a9b1b5','#7a8388');
      {const lp=P(du0+.05,v1,11);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');}
      louvL(s,u0+du*o.louv,v1,4,5,3,'#8b8474','#5d584e');
      if(o.plate)winL(s,u0+du*o.plate,v1,9,4,2,'#2f6fb0');
      louvR(s,u1,v0+dv*.66,5,5,3,'#7f7765','#4f4a40');
      if(o.win){winR(s,u1,v0+dv*.3,6,3,4,'#3e5a72');winR(s,u1,v0+dv*.3,9,3,1,'#6f8ea6');winR(n,u1,v0+dv*.3,6,3,4,'#ffd98a');}
      if(o.fan){const f=P(u0+du*.7,v0+dv*.4,h);cyl(s,f[0],f[1],3,3,['#c9d0d3','#a9b1b5','#899297'],'#6c757a','#b8c0c4');}
      if(o.roofHatch)L.hatch(s,u0+du*.2,v0+dv*.25,.1,.08,h,'#9aa2a6');
    });
    const V155=[
      (g,ng,S)=>{ // v0 標準型：平頂泵房＋臥式壓力槽＋藍色管匯
        K.ground(g,1550);
        L.slab(g,.06,.08,.48,.38);L.slab(g,.6,.1,.3,.5,'#c7c3b9');
        L.flatQ(g,.13,.46,.12,.5,'#c4c0b6');
        L.shadow(g,[[.08,.1,.42,.32,14],[.68,.14,.16,.42,11],[.76,.64,.12,.08,10]]);
        K.backFence(g);
        pumpHouse(S,{u0:.08,v0:.1,du:.42,dv:.32,h:14,door:.14,louv:.6,plate:.36,fan:1,roofHatch:1});
        S.o(1.1,(s)=>{ // 壓力槽鞍座＋槽體＋人孔
          for(const t of [.2,.44])boxZ(s,.68,t,.14,.05,0,3,'#b9b5ab','#cfcbc1','#a19d93');
          hTank(s,'v',.12,.54,.75,8,5,TK,TKC);
          const b=P(.75,.3,13);RC(s,b[0]-1,b[1]-1,3,2,'#6c7a82');RC(s,b[0],b[1]-3,1,2,'#6c7a82');
        });
        S.t(1.2,(s)=>{ // 管匯：泵房出水→閥→集管→壓力槽＋埋地幹管
          const y1=.18,y2=.34;
          pipe(s,P(.5,y1,5),P(.62,y1,5));pipe(s,P(.5,y2,5),P(.62,y2,5));pipe(s,P(.62,y1,5),P(.62,.8,5));
          flange(s,P(.53,y1,5));flange(s,P(.53,y2,5));
          valve(s,P(.575,y1,6));valve(s,P(.575,y2,6));
          pipe(s,P(.62,.5,5),P(.7,.5,5));
          const f=P(.62,.8,0);riser(s,f,0,5);collar(s,f);valve(s,P(.62,.7,6),'#2f8f5a');gauge(s,P(.62,.58,8));
        });
        L.cabinet(S,.78,.68,.12,.07,8,{hood:1});
        L.lamp(S,.9,.1);
      },
      (g,ng,S)=>{ // v1 老式磚造泵房（雙坡屋頂）＋立式壓力罐＋桿上變壓器
        L.grass(g,1551,1,'#7ba257');
        L.gravel(g,.08,.1,.84,.62,1551,'#b8b3a7');L.flatQ(g,.16,.6,.14,.36,'#c9c4b8');
        L.shadow(g,[[.1,.12,.36,.4,20],[.62,.2,.22,.22,26]]);
        K.backFence(g);
        S.o(.1+.12+.36+.4,(s,n)=>{
          gable(s,.1,.12,.36,.4,12,8,'v','#b4674c','#8b4b37','#77787b','#56585c');
          L.brickL(s,.52,.1,.46,1,12,'#9c5540');L.brickR(s,.46,.12,.52,1,12,'#743c2c');
          const d=P(.24,.52,0);winL(s,.21,.52,0,5,9,'#e6dccb');winL(s,.225,.52,0,4,8,'#4d3a2e');
          winL(s,.34,.52,4,3,4,'#e6dccb');winL(s,.345,.52,5,2,3,'#3c5870');winL(n,.345,.52,5,2,3,'#ffd98a');
          winR(s,.46,.24,4,3,5,'#e6dccb');winR(s,.46,.25,5,2,3,'#3c5870');
          louvL(s,.26,.52,14,3,1,'#e6dccb','#6b4a3a');
          const m=P(.46,.42,6);RC(s,m[0]-1,m[1]-3,3,4,'#d6d9da');RC(s,m[0],m[1]-2,1,1,'#333');
        });
        S.o(.62+.2+.22+.22,(s)=>{ // 立式壓力罐（碟形頂）＋爬梯
          const c=P(.73,.31,0);RC(s,c[0]-8,c[1]-1,17,3,'#b5b1a7');
          const t=cyl(s,c[0],c[1],7,22,BLU,'#a9cdef','#6d9fd6');
          L.ell(s,t[0],t[1]-1,5,2,'#b9d7f2');L.ell(s,t[0]-1,t[1]-2,2,1,'#d8ebf9');
          L.rings(s,c[0],c[1],7,[7,15],'#3a6aa4');
          RC(s,c[0]-4,c[1]-21,1,20,'#cfd6da');for(let z=3;z<21;z+=3)RC(s,c[0]-5,c[1]-z,3,1,'#cfd6da');
          RC(s,c[0]+3,c[1]-12,2,5,'#e9eef1');RC(s,c[0]+3,c[1]-10,2,1,'#2b3a48');
        });
        S.t(1.3,(s)=>{
          pipe(s,P(.46,.34,4),P(.6,.34,4));valve(s,P(.53,.34,5));
          riser(s,P(.6,.34,0),0,4);pipe(s,P(.6,.34,4),P(.6,.62,4));
          const f=P(.6,.62,0);riser(s,f,0,4);collar(s,f);
          pipe(s,P(.6,.46,4),P(.66,.46,4));valve(s,P(.6,.54,5),'#2f8f5a');
        });
        S.t(.18+.86,(s,n)=>{ // 木電桿＋桿上變壓器＋引下線
          const p=P(.16,.86);RC(s,p[0],p[1]-30,2,30,'#6d5039');RC(s,p[0],p[1]-30,1,30,'#8a6a4d');
          RC(s,p[0]-6,p[1]-28,14,1,'#5a4230');for(const dx of [-6,0,7])RC(s,p[0]+dx,p[1]-30,1,2,'#d9dcdd');
          RC(s,p[0]-4,p[1]-22,4,6,'#8e989d');RC(s,p[0]-4,p[1]-22,1,6,'#b8c0c4');RC(s,p[0]-4,p[1]-23,4,1,'#6b7479');
          L.BL(s,[p[0]-3,p[1]-17],P(.28,.52,9),'#3a3f43');
        });
        L.cabinet(S,.5,.72,.1,.07,8,{top:'#8f9a93',l:'#a9b3ab',r:'#7d877f'});
        L.sign(S,.36,.92,'#b0402f');
      },
      (g,ng,S)=>{ // v2 撬裝式露天加壓機組：立式多級泵×3（不鏽鋼泵體＋藍馬達）＋吸水／出水雙集管＋流量計＋變頻控制盤（遮陽棚）
        K.ground(g,1552);
        L.slab(g,.08,.16,.66,.54);
        L.shadow(g,[[.78,.2,.14,.2,16]]);
        K.backFence(g);
        S.t(.5,(s)=>{ // 吸水集管（後）
          pipe(s,P(.1,.26,4),P(.72,.26,4),L.PG);const f=P(.1,.26,0);riser(s,f,0,4,L.PG);collar(s,f);
          for(const u of [.22,.42,.62]){pipe(s,P(u,.26,4),P(u,.42,4),L.PG);valve(s,P(u,.32,5));}
        });
        for(const u of [.22,.42,.62])S.o(u+.44+.2,(s,n)=>{ // 立式多級泵＋馬達
          const p=P(u,.44);RC(s,p[0]-3,p[1]-1,7,3,'#8f9499');RC(s,p[0]-3,p[1]-1,7,1,'#b3b8bc');
          cyl(s,p[0],p[1]-2,2,9,['#f2f4f5','#c9cfd2','#9ea6aa','#7c858a'],'#dfe4e6');
          RC(s,p[0]-2,p[1]-12,5,1,'#6c757a');
          cyl(s,p[0],p[1]-13,2,5,BLU,'#6e9ed6');
          RC(s,p[0]-1,p[1]-20,3,2,'#b9c1c5');
          RC(s,p[0]+1,p[1]-15,1,1,'#58cf96');RC(n,p[0]+1,p[1]-15,1,1,'#7dffc0');
        });
        S.t(1.4,(s)=>{ // 出水集管（前）＋逆止閥＋流量計＋壓力錶
          for(const u of [.22,.42,.62]){pipe(s,P(u,.46,6),P(u,.62,6));const c=P(u,.55,6);RC(s,c[0]-1,c[1]-2,3,4,'#2f4f6f');}
          pipe(s,P(.14,.62,6),P(.7,.62,6));const f=P(.7,.62,0);riser(s,f,0,6);collar(s,f);
          const m=P(.3,.62,6);RC(s,m[0]-2,m[1]-3,5,6,'#3f8f5f');RC(s,m[0]-2,m[1]-3,5,1,'#7cc79a');RC(s,m[0]-1,m[1]-6,3,3,'#e9eef0');
          gauge(s,P(.54,.62,8));
          const q=P(.14,.62,0);riser(s,q,0,6);collar(s,q);valve(s,P(.14,.62,7),'#e0c24a');
        });
        S.o(.78+.2+.14+.2,(s,n)=>{ // 變頻控制盤＋遮陽棚
          boxZ(s,.8,.22,.1,.16,0,12,'#b6bec2','#d9dee0','#9aa3a7');
          const p=P(.85,.38,1);RC(s,p[0],p[1]-11,1,10,'#8b9498');RC(s,p[0]-3,p[1]-9,2,2,'#2b3a48');RC(s,p[0]+2,p[1]-8,1,1,'#58cf96');RC(n,p[0]+2,p[1]-8,1,1,'#7dffc0');
          for(const [u,v] of [[.77,.19],[.77,.41],[.93,.41]]){const q=P(u,v);RC(s,q[0],q[1]-17,1,17,'#7a8388');}
          boxZ(s,.75,.17,.2,.26,17,1,'#8f989c','#a8b0b4','#7d868a');
        });
        L.lamp(S,.1,.9,20);L.sign(S,.4,.92);
      },
      (g,ng,S)=>{ // v3 地面鋼製儲水槽＋小泵房（槽→泵→配水）
        K.ground(g,1553);
        L.slab(g,.56,.54,.34,.34);
        L.shadow(g,[[.1,.1,.52,.52,20],[.6,.58,.26,.26,11]]);
        K.backFence(g);
        S.o(.72,(s,n)=>{
          const c=P(.36,.36);L.ell(s,c[0],c[1]+1,17,8,'#b5b1a7');
          const TG=['#e9eeea','#d2dad5','#b7c2bc','#9aa6a0','#86928c'];
          const t=cyl(s,c[0],c[1],15,17,TG,'#c7cfca','#a3aea8');
          L.ell(s,t[0],t[1]-1,11,5,'#d6ddd8');L.ell(s,t[0],t[1]-2,6,3,'#e6ebe7');RC(s,t[0]-1,t[1]-5,3,3,'#8b969a');
          L.rings(s,c[0],c[1],15,[6,12],'#a5b1ab');
          const lx=c[0]-9;for(let z=1;z<17;z+=2)RC(s,lx,c[1]+4-z,4,1,'#8a9590');RC(s,lx,c[1]-13,1,17,'#6b7671');RC(s,lx+3,c[1]-13,1,17,'#6b7671');
          RC(s,c[0]+6,c[1]-15,1,18,'#7b8681');RC(s,c[0]+5,c[1]-6,3,2,'#d24a3c');
          const q=P(.36,.36,17);RC(s,q[0]-4,q[1]-9,9,1,'#e0c24a');RC(s,q[0]-4,q[1]-9,1,3,'#e0c24a');RC(s,q[0]+4,q[1]-9,1,3,'#e0c24a');
          RC(s,t[0]+9,t[1]-8,1,8,'#8b969a');RC(n,t[0]+9,t[1]-9,1,1,'#ff5a4a');RC(s,t[0]+9,t[1]-9,1,1,'#c0392b');
        });
        S.t(1.05,(s)=>{pipe(s,P(.62,.46,4),P(.74,.46,4));pipe(s,P(.74,.46,4),P(.74,.58,4));valve(s,P(.68,.46,5));});
        S.o(.6+.58+.52,(s,n)=>{ // 小泵房：平頂、門、側百葉
          const u0=.6,v0=.58,du=.26,dv=.26,h=12,u1=u0+du,v1=v0+dv;
          boxZ(s,u0,v0,du,dv,0,h,'#b3b0a8','#e4ddcc','#b8ae9b');
          fL(s,v1,u0,u1,0,2,'#a79e8c');fR(s,u1,v0,v1,0,2,'#8a826f');flatQ(s,u0+.025,v0+.025,du-.05,dv-.05,'#8f8c85',h);
          winL(s,u0+.06,v1,0,4,8,'#56697c');boxZ(s,u0+.04,v1,.14,.03,9,1,'#8d969b','#a9b1b5','#7a8388');
          louvR(s,u1,v0+.18,4,5,2,'#7f7765','#4f4a40');
          const w=P(u0+.2,v1,1);RC(s,w[0],w[1]-9,2,2,'#2f6fb0');
          const lt=P(u0+.05,v1,9);RC(n,lt[0],lt[1]+1,2,1,'#ffe2a0');RC(s,lt[0],lt[1]+1,2,1,'#f3e6b6');
        });
        S.t(1.8,(s)=>{pipe(s,P(.86,.66,4),P(.94,.66,4));const f=P(.94,.66,0);});
        L.cabinet(S,.14,.74,.1,.07,8);
        L.lamp(S,.08,.64,20);L.sign(S,.36,.92);
      },
      (g,ng,S)=>{ // v4 地下泵井型：混凝土泵井頂板（艙口＋鵝頸通風）＋樓梯間，柴油備用發電機組，進排氣閥
        K.ground(g,1554);
        L.shadow(g,[[.62,.1,.26,.42,13],[.1,.4,.16,.16,12],[.1,.36,.5,.48,3]]);
        K.backFence(g);
        S.o(.6,(s)=>{ // 泵井頂板
          boxZ(s,.1,.36,.5,.48,0,3,'#c9c5bb','#dcd8ce','#b0aca2');
          L.hatch(s,.32,.42,.14,.12,3);L.hatch(s,.32,.62,.14,.12,3,'#737d82');
          L.BL(s,P(.1,.84,3),P(.6,.84,3),'#ebe7dd');
        });
        S.o(.1+.4+.32,(s,n)=>{ // 樓梯間（入口）
          boxZ(s,.1,.4,.16,.16,3,11,'#9d9a93','#e4ddcc','#b8ae9b');
          flatQ(s,.12,.42,.12,.12,'#8f8c85',14);
          winR(s,.26,.52,3,4,8,'#56697c');boxZ(s,.26,.44,.03,.12,12,1,'#8d969b','#a9b1b5','#7a8388');
          const w=P(.26,.46,12);RC(n,w[0]-1,w[1],1,1,'#ffe2a0');RC(s,w[0]-1,w[1],1,1,'#f3e6b6');
        });
        S.t(1.3,(s)=>{goose(s,P(.54,.46,3),8);goose(s,P(.54,.74,3),8);RC(s,P(.2,.82,3)[0],P(.2,.82,3)[1]-6,1,6,'#e0c24a');});
        S.o(.62+.1+.26+.42,(s,n)=>{ // 柴油發電機組（隔音罩）
          boxZ(s,.62,.1,.26,.42,0,2,'#6f777b','#80888c','#5f676b');
          boxZ(s,.63,.11,.24,.4,2,11,'#d8cfa9','#e9e0bb','#b9ae86');
          for(let t=.16;t<.48;t+=.06)winR(s,.87,t,4,2,6,'#8e845e');
          louvL(s,.67,.51,3,6,3,'#b9ae86','#6f6647');
          const ex=P(.7,.22,13);cyl(s,ex[0],ex[1],1,7,['#c9d0d3','#7c858a'],'#40464a');RC(s,ex[0]-2,ex[1]-8,4,1,'#59636a');
          const led=P(.78,.51,9);RC(s,led[0],led[1],1,1,'#e0a23a');RC(n,led[0],led[1],1,1,'#ffc060');
        });
        S.t(1.5,(s)=>{ // 進排氣閥組（黃色護罩）
          const f=P(.76,.72,0);riser(s,f,0,6);collar(s,f);RC(s,f[0]-2,f[1]-10,5,4,'#e0c24a');RC(s,f[0]-2,f[1]-10,5,1,'#f3de84');RC(s,f[0]+2,f[1]-9,1,3,'#a88a2a');
        });
        L.cabinet(S,.66,.62,.12,.07,9,{hood:1});
        S.t(.1+.12,(s,n)=>{const p=P(.14,.12);RC(s,p[0],p[1]-26,1,26,'#7a8388');RC(s,p[0]+1,p[1]-26,1,26,'#a3acb1');
          for(let i=0;i<4;i++)RC(s,p[0]-3+i,p[1]-24+i,1,1,'#c7cdd1');RC(s,p[0]-3,p[1]-20,7,1,'#c7cdd1');RC(n,p[0],p[1]-27,2,1,'#ff5a4a');RC(s,p[0],p[1]-27,2,1,'#c0392b');});
        L.lamp(S,.92,.62,20);
      },
    ];
    for(let v=0;v<5;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V155[v](g,ng,S)||{};S.run();
      B['155_1_'+v]=L.done(c,g,nc,Object.assign({fence:true,gate:[.06,.3]},opt));
    }
  }catch(e){console.error('infra575 k155',e);}
  // ================= k163 配水調壓站（1×1，76×98，錨點 38,96） =================
  try{
    const K=A.iso575(76,98,38,96,1),L=LIB(K),{P}=K;
    const {RC,BL,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,pipe,riser,flange,collar,valve,gauge,goose,hatch,hip}=L;
    const marker=(S,u,v,c='#2f6fb0')=>S.t(u+v,(s)=>{const p=P(u,v);RC(s,p[0],p[1]-5,2,5,'#f2f4f5');RC(s,p[0],p[1]-4,2,2,c);RC(s,p[0]+1,p[1]-5,1,5,'#b9c0c4');});
    const solar=(S,u,v,h=15)=>S.t(u+v+.01,(s,n)=>{const p=P(u,v);RC(s,p[0],p[1]-h,1,h,'#6f787d');RC(s,p[0]+1,p[1]-h,1,h,'#a3acb1');
      const x=Math.round(p[0]),y=Math.round(p[1])-h;L.pg(s,x-4,y-4,9,4,.5,'#35668f');L.pg(s,x-4,y-4,9,1,.5,'#b3cfe2');L.pg(s,x-4,y-1,9,1,.5,'#23425c');RC(s,x,y-2,1,2,'#274b6a');
      RC(s,x-1,y+4,3,4,'#d9dee0');RC(s,x+1,y+5,1,1,'#58cf96');RC(n,x+1,y+5,1,1,'#7dffc0');});
    const V163=[
      (g,ng,S)=>{ // v0 地下閥室：混凝土頂蓋（一開一閉艙口＋爬梯）、鵝頸通氣管、遙測箱＋太陽能板、管線標樁
        L.grass(g,1630,1,'#79a256');
        L.gravel(g,.08,.14,.84,.62,1630,'#b7b2a6');
        L.shadow(g,[[.08,.14,.7,.54,5],[.8,.36,.12,.1,6]]);
        K.backFence(g);
        const HZ=5;
        S.o(.9,(s,n)=>{ // 混凝土頂蓋（主角）
          boxZ(s,.08,.14,.7,.54,0,HZ,'#c6c2b8','#d8d4ca','#aeaaa0');
          L.BL(s,P(.08,.68,HZ),P(.78,.68,HZ),'#e9e5db');
          hatch(s,.13,.3,.14,.14,HZ,'#7f898e');
          L.manhole(s,.26,.6,HZ,2);
          // 掀開的艙口：淺鋼框＋黑色井口（約 18×9px）＋後側井壁
          flatQ(s,.36,.3,.36,.3,'#a3adb2',HZ);flatQ(s,.38,.32,.32,.26,'#0c0f11',HZ);
          L.BL(s,P(.38,.32,HZ-1),P(.7,.32,HZ-1),'#2c3236');L.BL(s,P(.38,.32,HZ-1),P(.38,.58,HZ-1),'#23282c');
          L.BL(s,P(.36,.6,HZ),P(.72,.6,HZ),'#dfe5e8');L.BL(s,P(.72,.3,HZ),P(.72,.6,HZ),'#c6ced2');
        });
        S.o(1.0,(s)=>{ // 豎起的鋼蓋板（鉸鏈在後緣）＋1px 亮邊
          fL(s,.3,.36,.72,HZ+1,HZ+9,'#7f898e');
          L.BL(s,P(.36,.3,HZ+9),P(.72,.3,HZ+9),'#eef3f5');L.BL(s,P(.36,.3,HZ+2),P(.36,.3,HZ+9),'#e2e8eb');
          for(const t of [.45,.54,.63])RC(s,P(t,.3,HZ+5)[0],P(t,.3,HZ+5)[1],1,1,'#a9b2b6');
        });
        S.t(1.05,(s)=>{ // 黃色 U 形爬梯扶手：自井口後緣伸出（不描邊，只蓋住井口 2px）
          const be=(x)=>{const a=P(.38,.32,HZ),b=P(.7,.32,HZ);return a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]);};
          const post=(u,c,d)=>{const x=Math.round(P(u,.335,0)[0]),yb=Math.round(be(x))+2,yt=Math.round(P(u,.335,HZ+12)[1]);
            RC(s,x,yt,1,yb-yt+1,c);RC(s,x+1,yt+1,1,yb-yt,d);return[x,yt];};
          const a=post(.45,'#f2c630','#a8801a'),b=post(.58,'#f2c630','#a8801a');
          BL(s,a,b,'#ffe066');BL(s,[a[0]+1,a[1]+1],[b[0],b[1]+1],'#a8801a');
        });
        S.t(1.3,(s)=>{goose(s,P(.14,.62,HZ),7);goose(s,P(.7,.2,HZ),7);});
        S.o(.8+.36+.22,(s,n)=>{ // 遙測箱（RTU，壓低）
          boxZ(s,.8,.36,.12,.1,0,6,'#c9cfd2','#e3e7e9','#aab2b6');
          const p=P(.86,.46,1);RC(s,p[0],p[1]-5,1,4,'#98a1a5');RC(s,p[0]+2,p[1]-4,1,1,'#58cf96');RC(n,p[0]+2,p[1]-4,1,1,'#7dffc0');
        });
        solar(S,.88,.18,9);
        for(const [u,v] of [[.24,.86],[.9,.62]])marker(S,u,v,'#e0a23a');
        L.sign(S,.44,.9);
      },
      (g,ng,S)=>{ // v1 地上減壓閥組：主線（閘閥→Y 型過濾器→減壓閥＋導閥→閘閥）＋旁通管、壓力錶、管墩、遙測箱
        K.ground(g,1631);
        L.slab(g,.1,.2,.8,.52);
        L.shadow(g,[[.74,.08,.14,.1,6]]);
        K.backFence(g);
        S.o(.74+.08+.22,(s,n)=>{ // 遙測箱（後，低矮淺灰）
          boxZ(s,.74,.08,.14,.1,0,6,'#dde1e3','#eceff0','#c4cacd');
          const p=P(.81,.18,1);RC(s,p[0],p[1]-5,1,4,'#aab2b6');RC(s,p[0]+2,p[1]-4,1,1,'#58cf96');RC(n,p[0]+2,p[1]-4,1,1,'#7dffc0');
        });
        S.t(.8,(s)=>{ // 旁通管（後）
          pipe(s,P(.22,.32,5),P(.76,.32,5));pipe(s,P(.22,.32,5),P(.22,.56,5));pipe(s,P(.76,.32,5),P(.76,.56,5));
          valve(s,P(.5,.32,6));flange(s,P(.42,.32,5));flange(s,P(.58,.32,5));
          pipe(s,P(.8,.18,2),P(.8,.3,2),L.PG,2);
        });
        S.o(.95,(s)=>{for(const u of [.3,.66]){boxZ(s,u,.52,.05,.08,0,3,'#b9b5ab','#cfcbc1','#a19d93');}});
        S.t(1.1,(s)=>{ // 主線
          const a=P(.12,.56,0);riser(s,a,0,5);collar(s,a);const b=P(.86,.56,0);riser(s,b,0,5);collar(s,b);
          pipe(s,P(.12,.56,5),P(.86,.56,5));
          valve(s,P(.17,.56,6));valve(s,P(.81,.56,6));
          flange(s,P(.24,.56,5));flange(s,P(.72,.56,5));
          const y=P(.32,.56,5);RC(s,y[0]-1,y[1]-2,3,4,'#3a4a58');RC(s,y[0],y[1]+2,3,2,'#3a4a58');RC(s,y[0]-1,y[1]-2,3,1,'#6b8193');
          gauge(s,P(.4,.56,7));gauge(s,P(.62,.56,7));
        });
        S.o(.5+.56+.1,(s)=>{ // 減壓閥本體＋膜片蓋
          const c=P(.51,.56,5),x=Math.round(c[0]),y=Math.round(c[1]);
          RC(s,x-3,y-3,7,5,'#b3423a');RC(s,x-3,y-3,7,1,'#dc6b60');RC(s,x+2,y-2,2,4,'#852f29');
          L.ell(s,x,y-5,3,1,'#8f989d');RC(s,x-2,y-6,5,1,'#c9d0d3');RC(s,x,y-8,1,2,'#59636a');
        });
        S.t(1.25,(s)=>{const c=P(.51,.56,5),x=Math.round(c[0]),y=Math.round(c[1]);
          RC(s,x+4,y-7,2,3,'#b87a3e');RC(s,x+4,y-7,2,1,'#e7b27a');BL(s,[x+5,y-4],[x+5,y-1],'#9a6a3a');});
        L.lamp(S,.9,.12,20);L.sign(S,.3,.92);
      },
      (g,ng,S)=>{ // v2 閥室小屋：攢尖頂混凝土小屋（雙扇鋼門）＋閥井圓人孔＋蘑菇頭通氣管＋太陽能遙測桿＋防撞樁
        L.grass(g,1632,1,'#7aa457');
        L.slab(g,.1,.12,.4,.4,'#c9c5bb');L.slab(g,.52,.18,.3,.5,'#c3bfb5');L.flatQ(g,.22,.52,.14,.44,'#c9c5bb');
        L.manhole(g,.66,.3,0,3);L.manhole(g,.66,.54,0,3);
        L.shadow(g,[[.14,.16,.3,.28,19]]);
        K.backFence(g);
        S.o(.14+.16+.3+.28,(s,n)=>{
          boxZ(s,.14,.16,.3,.28,0,12,'#b9b4a8','#e8e2d3','#bdb4a1');
          fL(s,.44,.14,.44,0,2,'#aaa190');fR(s,.44,.16,.44,0,2,'#8f8674');
          hip(s,.14,.16,.3,.28,12,8,'#5f7f73','#44604f','#6f8f83');
          winL(s,.21,.44,0,7,9,'#d6d0c1');winL(s,.22,.44,0,6,8,'#5b6f7e');winL(s,.31,.44,1,1,6,'#3f505c');
          louvR(s,.44,.26,5,4,2,'#9f9684','#5f594c');
          winL(s,.35,.44,9,3,2,'#2f6fb0');
          const lp=P(.26,.44,11);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');
        });
        S.t(1.2,(s)=>{for(const [u,v] of [[.82,.24],[.82,.5]]){const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-7,1,7,'#c9d1d5');RC(s,x+1,y-7,1,7,'#6c757a');L.ell(s,x,y-8,2,1,'#8c979d');RC(s,x-2,y-8,5,1,'#c9d1d5');}});
        S.t(1.5,(s)=>{for(const [u,v] of [[.6,.8],[.82,.74]]){const p=P(u,v);RC(s,p[0],p[1]-5,2,5,'#e0c24a');RC(s,p[0],p[1]-3,2,1,'#2b2f33');}});
        solar(S,.14,.7,16);
        L.sign(S,.44,.9);
        S.t(.98,(s)=>{ // 灌木：實心深綠＋亮綠兩色團塊（不描邊）
          const p=P(.84,.14),x=Math.round(p[0]),y=Math.round(p[1]);
          L.ell(s,x,y-3,4,2,'#3f6d2b');L.ell(s,x+3,y-2,3,2,'#355f25');
          L.ell(s,x-1,y-4,2,1,'#78ad4c');RC(s,x+3,y-3,2,1,'#6a9e44');});
      },
    ];
    for(let v=0;v<3;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V163[v](g,ng,S)||{};S.run();
      B['163_1_'+v]=L.done(c,g,nc,Object.assign({fence:true,gate:[.06,.3]},opt));
    }
  }catch(e){console.error('infra575 k163',e);}
  // ================= k151 河川取水口（2×2，128×145，錨點 64,143） =================
  try{
    const K=A.iso575(128,145,64,143,2),L=LIB(K),{P,hsh,E}=K,SZ=2;
    const {G,WAT,water,riprap,asphalt,basin,rackL,rackR,hoist,RC,BL,lerp,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,rings,gable,hip,pipe,riser,collar,valve,gauge,hatch}=L;
    const PGr=['#c3cbd0','#7f8a90','#4d575d'];
    // 泵房大廳：雙坡（ridge u）或平頂；+v 面高窗、+u 面捲門
    const hall=(S,o)=>S.o(o.d!=null?o.d:o.u0+o.v0+o.du+o.dv,(s,n)=>{
      const {u0,v0,du,dv,h}=o,u1=u0+du,v1=v0+dv,wl=o.wl||'#e6e0d2',wr=o.wr||'#bdb4a2';
      if(o.roof==='gable')gable(s,u0,v0,du,dv,h,o.rh||9,'u',wl,wr,o.rl||'#5a7f9e',o.rd||'#3f607c');
      else{boxZ(s,u0,v0,du,dv,0,h,'#aeaba3',wl,wr);flatQ(s,u0+.03,v0+.03,du-.06,dv-.06,'#8d8a83',h);BL(s,P(u0,v1,h),P(u1,v1,h),SH(wl,14));}
      fL(s,v1,u0,u1,0,2,SH(wl,-40));fR(s,u1,v0,v1,0,2,SH(wr,-36));
      const nw=Math.max(2,Math.floor((du-.1)/(o.ws||.12)));
      for(let i=0;i<nw;i++){const u=u0+.07+i*(du-.14)/Math.max(1,nw-1)-.02;
        winL(s,u,v1,4,2,o.wh||8,'#3e5a72');winL(s,u,v1,4+(o.wh||8)-2,2,1,'#7fa0b8');
        if(hsh(o.seed||1,i,7)<.6)winL(n,u,v1,4,2,o.wh||8,'#ffd98a');}
      if(o.band)winL(s,u0+.05,v1,h-4,Math.round(du*20),2,o.band);
      const dv0=v0+dv*.2;winR(s,u1,dv0,0,6,9,'#8e969a');for(let r=1;r<9;r+=2)winR(s,u1,dv0,r,6,1,'#747c80');
      if(dv>.45)winR(s,u1,v0+dv*.62,0,3,7,'#56697c');
      const lp=P(u1,dv0+.1,11);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');
      if(o.roofBox)boxZ(s,u0+du*.55,v0+dv*.3,.14,.12,o.roof==='gable'?h+2:h,5,'#aab2b6','#c9d0d3','#949ca1');
    });
    const gantry=(S,d,u,va,vb,z,H)=>S.t(d,(s,n)=>{ // 門式吊車（跨 v 向），u 為所在位置
      const Y=['#f0c64a','#c89a2a','#8c6a1c'];
      for(const v of [va,vb]){const a=P(u-.05,v,z),b=P(u+.05,v,z),t=P(u,v,z+H);
        BL(s,a,t,Y[1]);BL(s,[a[0]+1,a[1]],[t[0]+1,t[1]],Y[0]);BL(s,b,t,Y[2]);RC(s,a[0]-1,a[1]-1,Math.round(b[0]-a[0])+3,2,'#59636a');}
      const t0=P(u,va,z+H),t1=P(u,vb,z+H);BL(s,[t0[0],t0[1]-1],[t1[0],t1[1]-1],Y[0]);BL(s,t0,t1,Y[1]);BL(s,[t0[0],t0[1]+1],[t1[0],t1[1]+1],Y[2]);
      const m=lerp(t0,t1,.55);RC(s,m[0]-2,m[1]-3,5,4,'#d8dde0');RC(s,m[0]-2,m[1]-3,5,1,'#f4f6f7');RC(s,m[0],m[1]+1,1,6,'#3a3f43');RC(s,m[0]-1,m[1]+7,3,1,'#3a3f43');
      RC(s,t0[0],t0[1]-3,1,1,'#c0392b');RC(n,t0[0],t0[1]-3,1,1,'#ff5a4a');});
    const fenceSign=(g,u,v)=>{const s=P(u,v,0);RC(g,s[0]-2,s[1]-6,5,4,'#f2f2f2');RC(g,s[0]-1,s[1]-5,3,2,'#c0392b');};
    const lampP=L.lamp;
    const V151=[
      (g,ng,S)=>{ // v0 水在右後：伸入河道的取水墩（三孔攔污柵＋閘槽＋啟閉機）＋門式清污吊車、泵房、雙槽沉砂池
        L.grass(g,1510,SZ,'#78a255');
        G(g,x=>{water(x,0,0,2,.62,1510);riprap(x,0,.6,2,.12,1510);
          L.gravel(x,.08,.72,1.86,1.2,1510,'#b6b1a5');asphalt(x,.95,.8,.2,1.2,true);
          for(let t=.05;t<2;t+=.1){const p=P(t,.6);RC(x,p[0],p[1]-1,3,1,WAT.foam);}
          for(let t=.25;t<.8;t+=.1){const p=P(1.66,t);RC(x,p[0]+1,p[1],3,1,WAT.foam);}});
        L.shadow(g,[[.22,1.12,.64,.46,18],[.9,.24,.74,.54,9],[1.22,1.02,.68,.86,5],[.12,.78,.3,.24,13]]);
        K.fence(g,[E,.74],[E,SZ-E]);K.fence(g,[E,.72],[.88,.72]);K.fence(g,[1.66,.72],[SZ-E,.72]);
        S.o(1.3,(s,n)=>{K.transformer(s,n,.12,.78);});
        S.o(1.8,(s,n)=>{ // 取水墩
          boxZ(s,.9,.24,.74,.54,0,9,'#cdc9bf','#dcd8ce','#aaa69c');
          for(let i=0;i<3;i++){const u0=.95+i*.23;flatQ(s,u0,.28,.17,.14,'#1d3a4e',9);
            for(let t=u0+.02;t<u0+.17;t+=.03)BL(s,P(t,.28,9),P(t,.42,9),'#8a969b');
            BL(s,P(u0,.46,9),P(u0+.17,.46,9),'#565f64');}
          BL(s,P(.9,.78,9),P(1.64,.78,9),'#eeeae0');
          for(const u of [1.1,1.4])winL(s,u,.78,2,2,4,'#98948a');
          for(let t=.3;t<.76;t+=.12)BL(s,P(1.64,t,0),P(1.64,t,7),'#9a968c');
        });
        S.o(1.82,(s)=>{for(let i=0;i<3;i++)hoist(s,1.035+i*.23,.52,9);});
        S.t(1.83,(s)=>{BL(s,P(.92,.26,10),P(1.62,.26,10),'#6f797e');BL(s,P(.92,.74,10),P(1.62,.74,10),'#6f797e');
          L.rail(s,P(.9,.78,9),P(1.64,.78,9),4,'#e0c24a',5);L.rail(s,P(1.64,.24,9),P(1.64,.78,9),4,'#e0c24a',5);});
        gantry(S,1.84,1.32,.26,.74,9,24);
        hall(S,{u0:.22,v0:1.12,du:.64,dv:.46,h:18,roof:'gable',rh:9,seed:1510,band:'#2f6fb0'});
        S.t(2.9,(s)=>{pipe(s,P(.91,.78,3),P(.91,1.3,3),PGr);pipe(s,P(.91,1.3,3),P(.86,1.3,3),PGr);valve(s,P(.91,.95,4));pipe(s,P(1.2,.78,3),P(1.2,.9,3),PGr);const q=P(1.2,.9,0);riser(s,q,0,3,PGr);collar(s,q);});
        S.o(3.6,(s)=>{basin(s,1.22,1.02,.68,.86,5,1511,[{a:'u',t:1.45}]);});
        S.t(3.65,(s)=>{const a=P(1.56,1.04,8),b=P(1.56,1.86,8);BL(s,a,b,'#d7dcdf');BL(s,[a[0],a[1]+1],[b[0],b[1]+1],'#6f797e');L.rail(s,a,b,3,'#e0c24a',6);
          const m=P(1.56,1.3,9);RC(s,m[0]-2,m[1]-4,4,4,'#e0a83a');});
        lampP(S,.1,1.9,22);lampP(S,1.9,.8,22);
        return {fence:false,front:[[[SZ-E,.74],[SZ-E,SZ-E]],[[E,SZ-E],[SZ-E,SZ-E],[.47,.58]]],sign:[.5,SZ-E]};
      },
      (g,ng,S)=>{ // v1 水在左前：臨水取水泵站（正面三孔攔污柵＋清污機＋啟閉機）、平頂泵房、雙槽沉砂池
        L.grass(g,1512,SZ,'#78a255');
        G(g,x=>{L.gravel(x,.06,.06,1.9,1.3,1512,'#b6b1a5');asphalt(x,1.44,1.08,.56,.22,false);
          water(x,0,1.38,2,.62,1512);fL(x,1.38,0,2,-3,0,'#b3afa4');BL(x,P(0,1.38,0),P(2,1.38,0),'#e2ded4');
          for(let t=.05;t<2;t+=.13){const p=P(t,1.38,-4);RC(x,p[0],p[1],3,1,WAT.foam);}});
        L.shadow(g,[[.5,.35,.9,.6,24],[.55,1.05,.9,.57,10],[1.5,.12,.42,.88,4],[.12,.15,.3,.24,13]]);
        K.backFence(g);
        S.o(1.2,(s,n)=>{K.transformer(s,n,.12,.15);});
        hall(S,{u0:.5,v0:.35,du:.9,dv:.6,h:22,roof:'flat',seed:1512,roofBox:1,ws:.1,wh:10,band:'#2f6fb0'});
        S.o(2.9,(s)=>{basin(s,1.5,.12,.42,.88,5,1513,[{a:'v',t:1.71}]);});
        S.t(2.95,(s)=>{const a=P(1.52,.56,8),b=P(1.9,.56,8);BL(s,a,b,'#d7dcdf');BL(s,[a[0],a[1]+1],[b[0],b[1]+1],'#6f797e');L.rail(s,a,b,3,'#e0c24a',6);});
        S.o(2.6,(s,n)=>{ // 取水構造（伸入河道）
          boxZ(s,.55,1.05,.9,.57,0,10,'#cdc9bf','#dcd8ce','#aaa69c');
          fL(s,1.62,.55,1.45,-3,0,'#b8b4aa');
          for(let i=0;i<3;i++)rackL(s,.6+i*.29,1.62,-3,8,11);
          for(let i=0;i<4;i++){const u=.575+i*.29;winL(s,u,1.62,-3,1,13,'#9f9b91');}winL(s,.56,1.62,-3,28,1,WAT.foam);
          for(let i=0;i<3;i++){BL(s,P(.62+i*.28,1.4,10),P(.84+i*.28,1.4,10),'#5d6468');}
          BL(s,P(.55,1.62,10),P(1.45,1.62,10),'#eeeae0');
        });
        S.o(2.62,(s)=>{for(let i=0;i<3;i++)hoist(s,.73+i*.28,1.32,10);
          boxZ(s,1.22,1.46,.14,.1,10,9,'#5f6d72','#7a878c','#4f5b60');boxZ(s,1.2,1.44,.18,.14,19,2,'#e0a83a','#f0c64a','#b8862a');});
        S.t(2.64,(s,n)=>{L.rail(s,P(.55,1.6,10),P(1.45,1.6,10),4,'#e0c24a',5);
          const r=P(1.29,1.56,12);BL(s,r,P(1.29,1.64,-1),'#3a3f43');RC(s,r[0]-1,r[1]-1,3,2,'#59636a');
          pipe(s,P(.8,1.05,4),P(.8,.95,4),PGr);pipe(s,P(1.1,1.05,4),P(1.1,.95,4),PGr);
          const l=P(.6,1.1,10);RC(s,l[0],l[1]-14,1,14,'#59636a');RC(s,l[0]-1,l[1]-15,3,2,'#d3d9dc');RC(n,l[0]-1,l[1]-15,3,2,'#ffe2a0');});
        lampP(S,1.9,1.0,22);
        return {fence:false,front:[[[SZ-E,E],[SZ-E,1.36],[.78,.96]]],sign:[SZ-E,.5],sideSign:1};
      },
      (g,ng,S)=>{ // v2 水在右前：明渠進水口（攔污柵＋清污機架）→ 閘門墩＋啟閉機橋 → 大型沉砂池（刮砂橋）、泵房、控制室
        L.grass(g,1514,SZ,'#78a255');
        G(g,x=>{L.gravel(x,.06,.06,1.36,1.9,1514,'#b6b1a5');asphalt(x,.92,1.2,.24,.8,true);
          water(x,1.45,0,.55,2,1514);fR(x,1.45,0,2,-3,0,'#9d998e');BL(x,P(1.45,0),P(1.45,2),'#dcd8ce');
          water(x,.66,.84,.8,.32,1515,0,30);
          fL(x,.84,.66,1.45,-3,0,'#cfcbc1');fR(x,.66,.84,1.16,-3,0,'#a9a59b');
          BL(x,P(.66,1.16),P(1.45,1.16),'#e6e2d8');
          for(let t=.06;t<2;t+=.14){const p=P(1.45,t,-4);RC(x,p[0]+1,p[1],3,1,WAT.foam);}});
        L.shadow(g,[[.2,.08,.72,.34,18],[.8,.78,.14,.44,18],[.14,.5,.52,.96,4],[1.02,.1,.28,.28,12]]);
        K.backFence(g);
        hall(S,{u0:.2,v0:.08,du:.72,dv:.34,h:18,roof:'gable',rh:8,seed:1514,rl:'#8d5a4a',rd:'#6b4436',ws:.13});
        S.o(1.02+.1+.56,(s,n)=>{boxZ(s,1.02,.1,.28,.28,0,12,'#8f8c85','#e4ddcc','#b8ae9b');flatQ(s,1.04,.12,.24,.24,'#7d7a74',12);
          winL(s,1.06,.38,4,6,4,'#3e5a72');winL(n,1.06,.38,4,6,4,'#ffd98a');winR(s,1.3,.16,0,3,7,'#56697c');
          const a=P(1.16,.2,12);RC(s,a[0],a[1]-8,1,8,'#6f787d');RC(s,a[0]-2,a[1]-8,5,1,'#9aa3a8');});
        S.o(1.9,(s)=>{basin(s,.14,.5,.52,.96,4,1516,[{a:'u',t:.98}]);});
        S.t(1.95,(s)=>{const a=P(.16,.72,7),b=P(.64,.72,7);BL(s,a,b,'#d7dcdf');BL(s,[a[0],a[1]+1],[b[0],b[1]+1],'#6f797e');L.rail(s,a,b,3,'#e0c24a',6);
          for(const q of [a,b]){RC(s,q[0]-1,q[1]-3,3,4,'#e0a83a');}});
        // 閘墩後移到 u .8–.94：渠口（u 1.45）到閘門之間露出一段明渠水面
        S.o(1.78,(s)=>{boxZ(s,.8,.78,.14,.08,-2,18,'#cdc9bf','#dcd8ce','#aaa69c');});
        S.o(1.93,(s)=>{fR(s,.87,.86,1.14,1,7,'#5f7f73');for(let z=2;z<7;z+=2)BL(s,P(.87,.86,z),P(.87,1.14,z),'#4a665b');
          boxZ(s,.8,.78,.14,.44,16,3,'#bfbbb1','#d2cec4','#a09c92');hoist(s,.87,.92,19);hoist(s,.87,1.08,19);});
        S.o(1.98,(s)=>{boxZ(s,.8,1.14,.14,.08,-2,18,'#cdc9bf','#dcd8ce','#aaa69c');});
        S.t(2.03,(s)=>{L.rail(s,P(.8,1.22,19),P(.94,1.22,19),4,'#e0c24a',4);L.rail(s,P(.94,.78,19),P(.94,1.22,19),4,'#e0c24a',4);});
        S.t(2.1,(s)=>{ // 渠道水流紋（閘門下游→渠口）
          for(const [u,v] of [[1.05,.94],[1.2,1.04],[1.12,1.1],[1.3,.92]]){const p=P(u,v);RC(s,p[0],p[1],3,1,WAT.foam);}});
        S.t(2.6,(s,n)=>{rackR(s,1.45,.85,-3,10,6); // 攔污柵＋清污機架
          const a=P(1.47,.8,0),b=P(1.47,1.2,0);RC(s,a[0],a[1]-15,2,15,'#4a5157');RC(s,b[0],b[1]-15,2,15,'#6a737a');
          BL(s,[a[0],a[1]-15],[b[0],b[1]-15],'#8f999e');BL(s,[a[0],a[1]-14],[b[0],b[1]-14],'#4a5157');
          const m=lerp([a[0],a[1]-15],[b[0],b[1]-15],.4);RC(s,m[0]-2,m[1]-3,5,4,'#e0a83a');RC(s,m[0]-2,m[1]-3,5,1,'#f3cf6a');RC(s,m[0],m[1]+1,1,10,'#3a3f43');
          RC(s,a[0],a[1]-17,1,1,'#c0392b');RC(n,a[0],a[1]-17,1,1,'#ff5a4a');});
        S.o(1.32+.3+.24,(s)=>{boxZ(s,1.32,.3,.12,.1,0,5,'#6b5b2a','#e0a83a','#b8862a');flatQ(s,1.34,.32,.08,.06,'#4a4033',5);});
        lampP(S,.1,1.5,22);lampP(S,.8,1.9,20);
        return {fence:false,front:[[[E,SZ-E],[1.43,SZ-E],[.62,.8]],[[1.43,E],[1.43,.76]],[[1.43,1.24],[1.43,SZ-E]]],sign:[.5,SZ-E]};
      },
      (g,ng,S)=>{ // v3 水在左後：河中取水塔（啟閉機房）＋鋼桁架便橋、現代泵站、旋流沉砂槽×2、變電箱
        L.grass(g,1517,SZ,'#78a255');
        G(g,x=>{water(x,0,0,.62,2,1517);riprap(x,.6,0,.12,2,1517);
          L.gravel(x,.72,.08,1.22,1.86,1517,'#b6b1a5');asphalt(x,.9,1.1,.26,.9,true);
          for(let t=.05;t<2;t+=.1){const p=P(.6,t);RC(x,p[0]-3,p[1]-1,3,1,WAT.foam);}
          const c=P(.28,1.0);L.ell(x,c[0]+2,c[1]+2,14,6,WAT.deep);L.ell(x,c[0],c[1]+1,13,6,WAT.foam);});
        L.shadow(g,[[.98,.3,.62,.55,18],[1.64,.12,.3,.24,13]]);
        K.fence(g,[.66,E],[SZ-E,E]);K.fence(g,[.66,E],[.66,SZ-E]);
        S.o(1.25,(s,n)=>{ // 取水塔
          const c=P(.28,1.0);const TC=['#e2ded4','#d2cec4','#bdb9af','#a8a49a','#96928a'];
          cyl(s,c[0],c[1],12,28,TC,'#c9c5bb','#aeaaa0');
          L.rings(s,c[0],c[1],12,[4],'#6f8a96');
          for(const dx of [-6,0,6]){RC(s,c[0]+dx,c[1]-8+(dx===0?1:0),2,4,'#1d3a4e');RC(s,c[0]+dx,c[1]-8,2,1,'#9aa6ab');}
          RC(s,c[0]-4,c[1]-22,2,4,'#3e5a72');RC(n,c[0]-4,c[1]-22,2,4,'#ffd98a');
          const t=[c[0],c[1]-28];boxZ(s,.18,.9,.2,.2,28,10,'#7d8a90','#e8e2d3','#bdb4a1');hip(s,.18,.9,.2,.2,38,5,'#5a7f9e','#3f607c','#6f8fae');
          const w=P(.26,1.1,31);RC(s,w[0],w[1]-4,3,3,'#3e5a72');RC(n,w[0],w[1]-4,3,3,'#ffd98a');
          RC(s,t[0]+8,t[1]-18,1,6,'#59636a');RC(s,t[0]+8,t[1]-19,1,1,'#c0392b');RC(n,t[0]+8,t[1]-19,1,1,'#ff5a4a');
        });
        S.t(1.7,(s)=>{ // 鋼桁架便橋（取水塔→岸）
          const a=P(.4,1.0,30),b=P(.86,1.0,30),a2=P(.4,1.0,24),b2=P(.86,1.0,24);
          BL(s,a2,b2,'#5f6970');BL(s,[a2[0],a2[1]-1],[b2[0],b2[1]-1],'#8f999e');BL(s,a,b,'#b8c1c5');
          for(let i=0;i<=6;i++){const p=lerp(a2,b2,i/6),q=lerp(a,b,(i+.5)/6);BL(s,p,q,'#7f898e');if(i<6){const r=lerp(a2,b2,(i+1)/6);BL(s,q,r,'#7f898e');}}
          pipe(s,P(.86,1.0,21),P(.44,1.0,21),PGr);
        });
        S.o(1.8,(s)=>{boxZ(s,.78,.94,.12,.12,0,30,'#c6c2b8','#dcd8ce','#aaa69c');for(let z=4;z<30;z+=6)BL(s,P(.78,1.06,z),P(.9,1.06,z),'#b0aca2');});
        S.t(1.85,(s)=>{riser(s,P(.9,1.0,0),0,21,PGr);pipe(s,P(.92,1.0,3),P(1.1,1.0,3),PGr);pipe(s,P(1.1,1.0,3),P(1.1,.86,3),PGr);valve(s,P(1.02,1.0,4));});
        S.o(2.5,(s,n)=>{ // 現代泵站
          boxZ(s,.98,.3,.62,.55,0,18,'#a9a69e','#ece8de','#c2bcae');flatQ(s,1.01,.33,.56,.49,'#8f8c85',18);
          for(let z of [6,12]){winL(s,1.02,.85,z,17,3,'#3e5a72');winL(n,1.02,.85,z,17,3,'#ffd98a');}
          for(let z of [6,12])winL(s,1.02,.85,z+2,17,1,'#8fb0c8');
          winR(s,1.6,.62,0,7,10,'#8e969a');for(let r=1;r<10;r+=2)winR(s,1.6,.62,r,7,1,'#747c80');
          boxZ(s,1.1,.42,.14,.12,18,5,'#aab2b6','#c9d0d3','#949ca1');boxZ(s,1.34,.45,.12,.1,18,4,'#aab2b6','#c9d0d3','#949ca1');
          winL(s,1.44,.85,15,6,2,'#2f6fb0');
        });
        S.o(3.0,(s,n)=>{K.transformer(s,n,1.64,.12);});
        for(const [u,v,sd] of [[1.44,1.36,1],[1.72,1.08,2]])S.o(u+v+.2,(s)=>{const c=P(u,v);
          cyl(s,c[0],c[1],10,6,['#dcd8ce','#cfcbc1','#bdb9af','#aaa69c'],'#cfcbc1','#b9b5ab');L.ell(s,c[0],c[1]-6,8,4,WAT.base);L.ell(s,c[0],c[1]-6,4,2,WAT.deep);L.ell(s,c[0],c[1]-6,1,1,'#8a969b');
          for(let i=0;i<4;i++){RC(s,c[0]-8+hsh(1518,sd,i)*14,c[1]-7+hsh(1519,sd,i)*3,2,1,WAT.lite);}
          BL(s,[c[0]-9,c[1]-8],[c[0]+9,c[1]-8],'#d7dcdf');BL(s,[c[0]-9,c[1]-7],[c[0]+9,c[1]-7],'#6f797e');RC(s,c[0]-1,c[1]-11,3,3,'#e0a83a');});
        S.t(3.3,(s)=>{pipe(s,P(1.3,.85,3),P(1.3,1.36,3),PGr);pipe(s,P(1.3,1.1,3),P(1.62,1.1,3),PGr);});
        lampP(S,.74,1.9,22);lampP(S,1.9,.9,22);
        return {fence:false,front:[[[SZ-E,E],[SZ-E,SZ-E]],[[.66,SZ-E],[SZ-E,SZ-E],[.18,.39]]],sign:[1.5,SZ-E]};
      },
      (g,ng,S)=>{ // v4 水在右後：早期石砌取水口（手輪閘門架）＋紅磚蒸汽泵房與煙囪、兩座土堤沉澱池、樹
        L.grass(g,1520,SZ,'#78a255');
        G(g,x=>{water(x,0,0,2,.56,1520);riprap(x,0,.54,2,.1,1521,'#a39c8e');
          flatQ(x,.2,1.46,.72,.44,'#5f8f44');flatQ(x,.26,1.52,.6,.32,WAT.base);
          flatQ(x,1.1,1.1,.8,.8,'#5f8f44');flatQ(x,1.16,1.16,.68,.68,WAT.base);
          for(const [u0,v0,du,dv,sd] of [[.26,1.52,.6,.32,1],[1.16,1.16,.68,.68,2]]){fL(x,v0,u0,u0+du,-3,0,'#4e7a38');fR(x,u0,v0,v0+dv,-3,0,'#6d9c50');
            for(let i=0;i<Math.round(du*dv*40);i++){const p=P(u0+.03+hsh(1522,sd*50+i,1)*(du-.06),v0+.05+hsh(1522,sd*50+i,2)*(dv-.08),0);RC(x,p[0],p[1],2,1,hsh(1522,sd*50+i,3)<.5?WAT.lite:WAT.deep);}}
          flatQ(x,.94,.66,.14,1.34,'#c2b89f');flatQ(x,.2,1.36,.8,.08,'#c2b89f');});
        L.shadow(g,[[.25,.78,.9,.5,20],[1.2,.86,.12,.12,48],[1.2,.3,.44,.4,8]]);
        K.fence(g,[E,.66],[E,SZ-E]);K.fence(g,[E,.66],[1.18,.66]);K.fence(g,[1.66,.66],[SZ-E,.66]);
        S.o(1.9,(s,n)=>{ // 石砌取水墩＋閘門架＋手輪
          boxZ(s,1.2,.3,.44,.4,0,8,'#b9ad96','#cbbfa6','#9d917b');
          for(let z=2;z<8;z+=3){BL(s,P(1.2,.7,z),P(1.64,.7,z),'#a89c84');BL(s,P(1.64,.3,z),P(1.64,.7,z),'#877b66');}
          for(let i=0;i<8;i++){const p=P(1.22+i*.055,.7,2+(i%2)*3);RC(s,p[0],p[1],1,2,'#9c9079');}
          flatQ(s,1.28,.33,.28,.12,'#1d3a4e',8);for(let t=1.3;t<1.56;t+=.04)BL(s,P(t,.33,8),P(t,.45,8),'#8a969b');
        });
        S.t(1.95,(s)=>{ // 閘門架：兩根 2px 深色鋼柱立在墩面（柱腳座板）＋頂橫樑＋啟閉橫樑，實心手輪在柱頂下方
          const a=P(1.28,.5,8),b=P(1.56,.5,8),ax=Math.round(a[0]),ay=Math.round(a[1]),bx=Math.round(b[0]),by=Math.round(b[1]),H=14;
          for(const [x,y] of [[ax,ay],[bx,by]]){RC(s,x,y-H,1,H+1,'#6f7a80');RC(s,x+1,y-H,1,H+1,'#2c3136');RC(s,x-1,y,4,1,'#3a4045');}
          BL(s,[ax,ay-H],[bx+1,by-H],'#7a858b');BL(s,[ax,ay-H+1],[bx+1,by-H+1],'#2c3136');
          BL(s,[ax,ay-7],[bx+1,by-7],'#7a858b');BL(s,[ax,ay-6],[bx+1,by-6],'#2c3136');
          const mx=Math.round((ax+bx+1)/2),my=Math.round((ay+by)/2);
          RC(s,mx,my-5,1,5,'#a3adb2'); // 閘門螺桿（啟閉樑→墩面）
          RC(s,mx,my-12,1,5,'#1f2327'); // 輪軸
          RC(s,mx-2,my-11,5,2,'#c0392b');RC(s,mx-1,my-12,3,1,'#ea6a55');RC(s,mx-1,my-9,3,1,'#7e2519');RC(s,mx,my-11,1,1,'#1f2327');
        });
        S.t(1.96,(s)=>{L.rail(s,P(1.2,.7,8),P(1.64,.7,8),4,'#6f797e',5);});
        S.o(2.4,(s,n)=>{ // 紅磚泵房（高拱窗）
          const u0=.25,v0=.78,du=.9,dv=.5,h=20,u1=u0+du,v1=v0+dv;
          gable(s,u0,v0,du,dv,h,11,'u','#b4674c','#8b4b37','#6b6e73','#505357');
          L.brickL(s,v1,u0,u1,1,h,'#a05a42');L.brickR(s,u1,v0,v1,1,h,'#77402f');
          fL(s,v1,u0,u1,0,3,'#9b9080');fR(s,u1,v0,v1,0,3,'#7c7262');
          for(let i=0;i<5;i++){const u=u0+.1+i*.17;winL(s,u,v1,4,3,11,'#e6dccb');winL(s,u,v1,5,3,9,'#34506a');RC(s,P(u,v1,15)[0]+1,P(u,v1,15)[1]-1,1,1,'#e6dccb');
            if(hsh(1520,i,5)<.6)winL(n,u,v1,5,3,9,'#ffd98a');}
          const c=P(u1,v0+dv/2,h+4);L.ell(s,c[0],c[1],2,2,'#e6dccb');L.ell(s,c[0],c[1],1,1,'#34506a');
          winR(s,u1,v0+dv*.7,0,5,9,'#5a4636');winR(s,u1,v0+dv*.7,9,5,1,'#e6dccb');
          winL(s,u0+.3,v1,h-3,14,2,'#e6dccb');
        });
        S.o(2.45,(s)=>{ // 煙囪
          const c=P(1.26,.92);cyl(s,c[0],c[1],4,48,['#c07052','#a85c42','#8b4b37','#6f3b2c'],'#3a2a24','#8b4b37');
          for(const z of [44,46])L.rings(s,c[0],c[1],4,[z],'#d8cfc0');RC(s,c[0]-4,c[1]-49,9,1,'#6f3b2c');
          for(let z=6;z<42;z+=5)L.rings(s,c[0],c[1],4,[z],'#95513c');
        });
        
        for(const [u,v,h] of [[.1,1.2,15],[.1,1.62,13],[1.92,.8,14]])L.tree(S,u,v,h,5);
        lampP(S,.95,1.94,20);
        return {fence:false,front:[[[SZ-E,.66],[SZ-E,SZ-E]],[[E,SZ-E],[SZ-E,SZ-E],[.46,.55]]],sign:[1.5,SZ-E]};
      },
    ];
    for(let v=0;v<5;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V151[v](g,ng,S)||{};S.run();
      for(const f of (opt.front||[]))K.fence(g,f[0],f[1],f[2]);
      for(const f of [opt.bank,opt.bank2])if(f)K.fence(g,f[0],f[1]);
      if(opt.sign)fenceSign(g,opt.sign[0],opt.sign[1]);
      B['151_1_'+v]=L.done(c,g,nc,{fence:false});
    }
  }catch(e){console.error('infra575 k151',e);}
  // ================= k152 地下水井場（2×2，128×145，錨點 64,143） =================
  try{
    const K=A.iso575(128,145,64,143,2),L=LIB(K),{P,hsh,E}=K,SZ=2;
    const {G,WAT,water,asphalt,basin,RC,BL,lerp,boxZ,fL,fR,flatQ,winL,winR,louvL,louvR,cyl,rings,gable,hip,pipe,riser,collar,valve,gauge,goose,hatch,manhole}=L;
    const PGr=['#c3cbd0','#7f8a90','#4d575d'];
    const MOT=['#63ab9f','#46918a','#34756e','#285c57'];
    // 井房（小屋）：style 'hip'（攢尖）或 'gable'（磚造雙坡）
    const wellHouse=(S,u0,v0,d,o={})=>S.o(u0+v0+2*d,(s,n)=>{const h=o.h||9,u1=u0+d,v1=v0+d;
      if(o.style==='gable'){gable(s,u0,v0,d,d,h,6,'v','#b4674c','#8b4b37','#6b6e73','#505357');L.brickL(s,v1,u0,u1,1,h,'#9c5540');L.brickR(s,u1,v0,v1,1,h,'#743c2c');}
      else{boxZ(s,u0,v0,d,d,0,h,'#a9a69e',o.wl||'#e6e0d2',o.wr||'#bdb4a2');hip(s,u0,v0,d,d,h,6,o.rl||'#5f7f73',o.rd||'#44604f','#6f8f83');}
      fL(s,v1,u0,u1,0,1,'#8f877a');
      winL(s,u0+d*.25,v1,0,4,7,o.style==='gable'?'#4d3a2e':'#56697c');
      louvR(s,u1,v0+d*.35,3,4,2,'#8e8677','#5d584e');
      const lp=P(u0+d*.36,v1,8);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');
      const m=P(u0+d*.8,v1,5);RC(s,m[0],m[1]-3,2,3,'#d6d9da');});
    // 開放式深井泵井頭：混凝土基座＋出水頭＋立式馬達＋風扇罩
    const wellhead=(S,u,v,o={})=>{S.o(u+v+.1,(s,n)=>{boxZ(s,u-.06,v-.06,.12,.12,0,2,'#c9c5bb','#dcd8ce','#aeaaa0');
        const p=P(u,v,2);cyl(s,p[0],p[1],2,3,['#c9d0d3','#9aa3a8','#737c81'],'#b3bbbf');RC(s,p[0]+2,p[1]-2,2,2,'#737c81');
        cyl(s,p[0],p[1]-3,3,5,o.col||MOT,SH((o.col||MOT)[0],14),(o.col||MOT)[1]);
        RC(s,p[0]-1,p[1]-10,3,1,'#c7cdd1');
        RC(s,p[0]+2,p[1]-6,1,1,'#58cf96');RC(n,p[0]+2,p[1]-6,1,1,'#7dffc0');});};
    const panel=(S,u,v)=>S.t(u+v+.05,(s,n)=>{const a=P(u-.03,v),b=P(u+.03,v);RC(s,a[0],a[1]-10,1,10,'#6f787d');RC(s,b[0],b[1]-10,1,10,'#6f787d');
      RC(s,a[0]-1,a[1]-12,Math.round(b[0]-a[0])+3,6,'#d9dee0');RC(s,Math.round(b[0])+1,b[1]-12,1,6,'#9aa3a7');RC(s,a[0]-2,a[1]-13,Math.round(b[0]-a[0])+5,1,'#7d868a');
      RC(s,a[0]+1,a[1]-10,1,1,'#e0a23a');RC(n,a[0]+1,a[1]-10,1,1,'#ffc060');});
    const vbox=(g,u,v)=>{const p=P(u,v);RC(g,p[0]-2,p[1]-1,5,3,'#8d8a82');RC(g,p[0]-1,p[1],3,1,'#5f5c56');};
    const marker=(S,u,v)=>S.t(u+v,(s)=>{const p=P(u,v);RC(s,p[0],p[1]-5,2,5,'#f2f4f5');RC(s,p[0],p[1]-4,2,2,'#2f6fb0');RC(s,p[0]+1,p[1]-5,1,5,'#b9c0c4');});
    const steelTank=(S,u,v,rx,h,T,top,o={})=>S.o(o.d!=null?o.d:u+v+rx/45,(s,n)=>{const c=P(u,v);L.ell(s,c[0],c[1]+1,rx+2,(rx+2)>>1,'#b5b1a7');
      const t=cyl(s,c[0],c[1],rx,h,T,top,SH(T[2],-10));
      if(o.cone){L.ell(s,t[0],t[1]-1,rx-3,(rx-3)>>1,SH(top,12));L.ell(s,t[0],t[1]-2,rx-7>0?rx-7:1,Math.max(1,(rx-7)>>1),SH(top,22));}
      const zs=[];for(let z=o.ring||6;z<h;z+=o.ring||6)zs.push(z);rings(s,c[0],c[1],rx,zs,SH(T[1],-18));
      if(o.seams)for(let x=-rx+3;x<rx;x+=4)RC(s,c[0]+x,c[1]-h+2,1,h-2,SH(T[Math.min(T.length-1,Math.floor((x+rx)/(2*rx+1)*T.length))],-12));
      if(o.ladder){const lx=c[0]-Math.round(rx*.55);RC(s,lx,c[1]-h,1,h+2,'#6b7671');RC(s,lx+3,c[1]-h,1,h+2,'#6b7671');for(let z=1;z<h;z+=2)RC(s,lx,c[1]+2-z,4,1,'#8a9590');}
      if(o.label)RC(s,c[0]-4,c[1]-Math.round(h*.6),9,2,o.label);
      RC(s,t[0]+Math.round(rx*.4),t[1]-3,1,3,'#59636a');RC(s,t[0]+Math.round(rx*.4),t[1]-4,1,1,'#c0392b');RC(n,t[0]+Math.round(rx*.4),t[1]-4,1,1,'#ff5a4a');});
    // 加氯消毒屋：小屋＋氯瓶架（遮棚）＋黃色警示牌
    const chlorHut=(S,u0,v0)=>{S.o(u0+v0+.5,(s,n)=>{boxZ(s,u0,v0,.26,.2,0,10,'#9b9890','#e8e2d3','#bdb4a1');flatQ(s,u0+.02,v0+.02,.22,.16,'#86837c',10);
        winL(s,u0+.04,v0+.2,0,4,7,'#56697c');louvR(s,u0+.26,v0+.05,4,4,2,'#8e8677','#5d584e');
        const w=P(u0+.19,v0+.2,5);RC(s,w[0],w[1]-3,3,3,'#e0c24a');RC(s,w[0]+1,w[1]-2,1,1,'#222');
        const lp=P(u0+.08,v0+.2,9);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');});
      S.o(u0+v0+.62,(s)=>{const b=boxZ(s,u0+.02,v0+.22,.2,.08,0,1,'#b9b5ab','#cfcbc1','#a19d93');
        for(let i=0;i<3;i++){const p=P(u0+.06+i*.06,v0+.26,1);cyl(s,p[0],p[1],1,5,['#e8c24a','#b8922a'],'#8f989d');}
        for(const t of [u0+.02,u0+.22]){const q=P(t,v0+.3);RC(s,q[0],q[1]-9,1,9,'#6f787d');}
        poly2(s,[P(u0,v0+.2,9),P(u0+.24,v0+.2,9),P(u0+.24,v0+.33,8),P(u0,v0+.33,8)],'#8f989c');});};
    const poly2=(g,pts,c)=>K.poly(g,pts,c);
    const V152=[
      (g,ng,S)=>{ // v0 草地井場：四座攢尖頂井房散布＋碎石檢修路、圓形鋼製儲水槽、加氯消毒屋、管線閥箱
        L.grass(g,1520,SZ,'#78a255');
        G(g,x=>{L.gravel(x,.95,1.0,.17,1.0,1520,'#bdb6a6');L.gravel(x,.18,1.0,1.7,.14,1521,'#bdb6a6');
          L.gravel(x,1.28,.44,.26,.56,1522,'#c4bdae');
          for(const [u,v] of [[1.41,.62],[1.41,.86],[.5,1.2],[1.62,1.3],[.28,1.5]])vbox(x,u,v);});
        L.shadow(g,[[.22,.18,.8,.8,20],[1.3,.2,.22,.22,14],[1.56,1.18,.22,.22,14],[.18,1.26,.22,.22,14],[1.16,1.56,.22,.22,14],[.5,1.3,.26,.2,10]]);
        K.backFence(g);
        steelTank(S,.62,.58,18,20,['#e9eeea','#d2dad5','#b7c2bc','#9aa6a0','#86928c'],'#c7cfca',{cone:1,ladder:1,ring:7,d:1.2,label:'#2f6fb0'});
        wellHouse(S,1.3,.2,.22);wellHouse(S,1.56,1.18,.22);wellHouse(S,.18,1.26,.22);wellHouse(S,1.16,1.56,.22);
        chlorHut(S,.5,1.3);
        for(const [u,v] of [[1.6,.5],[.12,1.1],[1.9,1.45]])marker(S,u,v);
        L.tree(S,.12,.62,13,5);L.tree(S,1.88,.2,12,5);L.bush(S,.62,1.86,4);L.bush(S,1.8,1.86,4);
        L.lamp(S,1.14,.98,22);
        return {gate:[.47,.56]};
      },
      (g,ng,S)=>{ // v1 井頭機組列：四口開放式深井泵（立式馬達）＋控制箱、地上集水管（管架）→ 除鐵錳處理房＋壓力濾槽、綠色組合鋼槽
        L.grass(g,1523,SZ,'#78a255');
        G(g,x=>{asphalt(x,.8,.84,.18,1.16,true);asphalt(x,.06,.84,1.88,.16,false);
          L.gravel(x,.18,.3,1.5,.3,1523,'#bdb6a6');});
        L.shadow(g,[[1.2,1.12,.65,.48,16],[.08,1.14,.62,.62,18],[.98,1.24,.1,.1,14],[.98,1.52,.1,.1,14]]);
        K.backFence(g);
        const W=[.3,.66,1.02,1.38];
        for(const u of W){panel(S,u+.1,.28);}
        S.t(1.0,(s)=>{for(const u of W){const b=P(u,.53,0);RC(s,b[0]-1,b[1]-4,2,4,'#7f8a90');}
          const b2=P(1.62,.9,0);RC(s,b2[0]-1,b2[1]-4,2,4,'#7f8a90');});
        for(const u of W)wellhead(S,u,.45);
        S.t(1.45,(s)=>{for(const u of W){pipe(s,P(u,.5,3),P(u,.66,3));pipe(s,P(u,.66,3),P(u,.66,4));valve(s,P(u,.58,4));}
          pipe(s,P(.26,.66,4),P(1.62,.66,4));pipe(s,P(1.62,.66,4),P(1.62,1.12,4));
          const m=P(1.3,.66,4);RC(s,m[0]-2,m[1]-3,5,6,'#3f8f5f');RC(s,m[0]-2,m[1]-3,5,1,'#7cc79a');gauge(s,P(.9,.66,6));});
        S.o(1.2+1.12+1.13,(s,n)=>{ // 處理房
          boxZ(s,1.2,1.12,.65,.48,0,16,'#a9a69e','#ece8de','#c2bcae');flatQ(s,1.23,1.15,.59,.42,'#8f8c85',16);
          for(let i=0;i<4;i++){const u=1.26+i*.14;winL(s,u,1.6,6,3,5,'#3e5a72');if(hsh(1523,i,3)<.6)winL(n,u,1.6,6,3,5,'#ffd98a');}
          winR(s,1.85,1.2,0,6,9,'#8e969a');for(let r=1;r<9;r+=2)winR(s,1.85,1.2,r,6,1,'#747c80');
          boxZ(s,1.5,1.25,.14,.12,16,6,'#aab2b6','#c9d0d3','#949ca1');for(let z=17;z<22;z+=2)BL(s,P(1.5,1.37,z),P(1.64,1.37,z),'#7d868a');
          winL(s,1.24,1.6,12,9,2,'#2f6fb0');});
        for(const v of [1.29,1.57])S.o(1.03+v+.1,(s)=>{const c=P(1.03,v);cyl(s,c[0],c[1],5,14,['#b3c7d6','#8fa9bd','#6d8aa1','#557085'],'#a9bfd0','#6d8aa1');
          L.ell(s,c[0],c[1]-15,3,1,'#c3d4e0');RC(s,c[0]-1,c[1]-17,2,2,'#59636a');L.rings(s,c[0],c[1],5,[3,11],'#557085');});
        S.t(3.0,(s)=>{pipe(s,P(1.08,1.29,6),P(1.2,1.29,6),PGr);pipe(s,P(1.08,1.57,6),P(1.2,1.57,6),PGr);});
        steelTank(S,.38,1.45,14,18,['#8fb07a','#76995f','#5e804b','#4d6b3c'],'#86a871',{seams:1,ring:6,d:2.1});
        L.lamp(S,.1,.88,22);L.lamp(S,1.9,.88,22);
        return {gate:[.39,.49]};
      },
      (g,ng,S)=>{ // v2 高架水塔井場：球形鋼製高架水塔（四腳＋斜撐＋中心立管）、三座紅磚井房、攢尖頂控制室、樹林
        L.grass(g,1524,SZ,'#78a255');
        G(g,x=>{L.gravel(x,.45,.9,.17,1.1,1524,'#bdb6a6');L.gravel(x,.45,.9,1.2,.14,1525,'#bdb6a6');
          for(const [u,v] of [[.36,.68],[.5,1.3],[1.5,1.2]])vbox(x,u,v);});
        L.shadow(g,[[1.16,.4,.3,.3,50],[.2,.25,.2,.2,14],[.26,1.3,.2,.2,14],[1.5,1.45,.2,.2,14],[.72,1.1,.42,.34,16]]);
        K.backFence(g);
        S.t(1.2,(s,n)=>{ // 塔腳＋斜撐＋立管
          const cU=1.3,cV=.55,Z=40,legs=[[1.14,.39],[1.46,.39],[1.14,.71],[1.46,.71]],top=legs.map(([u,v])=>P(cU+(u-cU)*.55,cV+(v-cV)*.55,Z));
          const bot=legs.map(([u,v])=>P(u,v,0));
          const order=[0,1,2,3];
          for(const i of order){BL(s,bot[i],top[i],'#5f6970');BL(s,[bot[i][0]+1,bot[i][1]],[top[i][0]+1,top[i][1]],'#a3adb2');RC(s,bot[i][0]-1,bot[i][1]-1,4,2,'#b5b1a7');}
          for(const f of [.33,.66]){const q=bot.map((b,i)=>lerp(b,top[i],f));for(const [a,b] of [[0,1],[1,3],[3,2],[2,0]])BL(s,q[a],q[b],'#7f898e');
            const q2=bot.map((b,i)=>lerp(b,top[i],f+.33));BL(s,q[2],q2[3],'#8f999e');BL(s,q[3],q2[2],'#8f999e');}
          const r=P(cU,cV,0);RC(s,r[0]-1,r[1]-Z,3,Z,'#9aa3a8');RC(s,r[0]-1,r[1]-Z,1,Z,'#c9d0d3');
        });
        S.o(1.3,(s,n)=>{ // 球形水槽＋走道＋航空警示燈
          const c=P(1.3,.55,48),cx=Math.round(c[0]),cy=Math.round(c[1]),rx=14,ry=12,T=['#f2f5f6','#d7dfe3','#b3c0c7','#8d9ba3'];
          for(let dy=-ry;dy<=ry;dy++)for(let dx=-rx;dx<=rx;dx++){const q=(dx*dx)/(rx*rx)+(dy*dy)/(ry*ry);if(q>1.02)continue;
            const l=-(dx/rx*.6+dy/ry*.8);s.fillStyle=T[l>.45?0:l>-.1?1:l>-.6?2:3];s.fillRect(cx+dx,cy+dy,1,1);}
          L.ell(s,cx,cy+ry-1,5,3,'#8d9ba3');RC(s,cx-1,cy+ry,3,4,'#9aa3a8');
          const wr=rx-3;for(let x=-wr-1;x<=wr+1;x++){const yb=Math.round(3*Math.sqrt(Math.max(0,1-(x*x)/((wr+1.5)*(wr+1.5)))));RC(s,cx+x,cy+8+yb,1,1,'#5f6970');if(x%3===0)RC(s,cx+x,cy+5+yb,1,3,'#7f898e');}
          RC(s,cx-wr-1,cy+5,wr*2+3,1,'#b7c0c5');L.ell(s,cx,cy-ry+1,4,2,'#e9eef0');
          RC(s,cx-7,cy-2,14,4,'#2f6fb0');RC(s,cx-5,cy-1,10,1,'#f2f5f6');
          RC(s,cx,cy-ry-3,1,3,'#59636a');RC(s,cx,cy-ry-4,1,1,'#c0392b');RC(n,cx,cy-ry-4,1,1,'#ff5a4a');RC(n,cx-1,cy-ry-4,3,1,'rgba(255,90,74,.5)');
        });
        wellHouse(S,.2,.25,.2,{style:'gable'});wellHouse(S,.26,1.3,.2,{style:'gable'});wellHouse(S,1.5,1.45,.2,{style:'gable'});
        S.o(.72+1.1+.76,(s,n)=>{boxZ(s,.72,1.1,.42,.34,0,11,'#a9a69e','#e8e2d3','#bdb4a1');hip(s,.72,1.1,.42,.34,11,8,'#6b6e73','#505357','#7a7d82');
          for(let i=0;i<3;i++){const u=.78+i*.12;winL(s,u,1.44,4,3,4,'#3e5a72');if(i!==1)winL(n,u,1.44,4,3,4,'#ffd98a');}
          winR(s,1.14,1.18,0,4,7,'#56697c');});
        for(const [u,v,h] of [[.12,.9,14],[.9,1.88,12],[1.86,.98,13],[.66,.2,12],[1.9,1.6,11]])L.tree(S,u,v,h,5);
        L.bush(S,.18,1.7,4);
        return {gate:[.21,.3]};
      },
      (g,ng,S)=>{ // v3 線性井場：中軸檢修路、兩側各井以小圍籬圈起（井頭＋控制亭）、覆土式清水池（通氣管＋人孔）、加氯屋
        L.grass(g,1526,SZ,'#78a255');
        G(g,x=>{asphalt(x,.06,.9,1.94,.18,false);
          for(const u of [.35,.95,1.55]){L.gravel(x,u-.15,.38,.3,.3,1526+Math.round(u*10),'#c4bdae');flatQ(x,u-.04,.68,.08,.22,'#bdb6a6');}
          for(const u of [.5,1.1]){L.gravel(x,u-.15,1.3,.3,.3,1530+Math.round(u*10),'#c4bdae');flatQ(x,u-.04,1.08,.08,.22,'#bdb6a6');}});
        L.shadow(g,[[1.45,1.26,.47,.64,6],[.1,1.56,.26,.2,10]]);
        K.backFence(g);
        const mini=(u0,v0,back)=>{const a=[u0,v0],b=[u0+.3,v0],c=[u0+.3,v0+.3],d=[u0,v0+.3];
          if(back){S.t(u0+v0,(s)=>{K.fence(s,a,b);K.fence(s,a,d);});}
          else S.t(u0+v0+.62,(s)=>{K.fence(s,b,c);K.fence(s,d,c,[.3,.62]);});};
        for(const u of [.35,.95,1.55]){mini(u-.15,.38,1);wellhead(S,u-.03,.5,{col:['#7aa0c8','#5a82b0','#43688f','#335270']});panel(S,u+.08,.47);mini(u-.15,.38,0);}
        for(const u of [.5,1.1]){mini(u-.15,1.3,1);wellhead(S,u-.03,1.42,{col:['#7aa0c8','#5a82b0','#43688f','#335270']});panel(S,u+.08,1.39);mini(u-.15,1.3,0);}
        S.o(3.4,(s,n)=>{ // 覆土清水池
          boxZ(s,1.45,1.26,.47,.64,0,6,'#86b060','#6f9c4d','#557f3c');
          flatQ(s,1.49,1.3,.39,.56,'#86b060',6);for(let i=0;i<16;i++){const p=P(1.5+hsh(1527,i,1)*.37,1.32+hsh(1527,i,2)*.52,6);RC(s,p[0],p[1],2,1,hsh(1527,i,3)<.5?'#6f9a4f':'#9cc46a');}
          BL(s,P(1.45,1.9,6),P(1.92,1.9,6),'#a8cf78');fL(s,1.9,1.62,1.8,0,5,'#cdc9bf');winL(s,1.68,1.9,0,3,4,'#56697c');
          L.hatch(s,1.56,1.66,.12,.1,6,'#7f898e');
        });
        S.t(3.5,(s)=>{for(const [u,v] of [[1.6,1.38],[1.8,1.5],[1.76,1.76]]){const p=P(u,v,6),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-6,1,6,'#c9d1d5');RC(s,x+1,y-6,1,6,'#6c757a');L.ell(s,x,y-7,2,1,'#8c979d');RC(s,x-2,y-7,5,1,'#c9d1d5');}});
        chlorHut(S,.1,1.56);
        L.tree(S,.1,.2,12,5);L.tree(S,1.92,.14,12,5);L.bush(S,.95,1.8,4);L.bush(S,1.34,1.84,3);
        L.lamp(S,.7,1.12,22);L.lamp(S,1.3,.86,22);
        return {gateR:[.44,.55]};
      },
      (g,ng,S)=>{ // v4 現代化井場：屋頂太陽能泵站、兩座不鏽鋼組合儲槽、加氯接觸池（導流隔板）、井頭閥室×2、箱式變電站
        L.grass(g,1528,SZ,'#78a255');
        G(g,x=>{asphalt(x,1.0,.8,.16,1.2,true);L.gravel(x,.1,.1,1.84,.7,1528,'#bdb6a6');
          L.gravel(x,1.2,1.2,.3,.3,1529,'#c4bdae');L.gravel(x,1.55,1.55,.3,.3,1530,'#c4bdae');});
        L.shadow(g,[[.2,.15,.7,.5,16],[1.14,.18,.44,.44,30],[1.5,.56,.44,.44,30],[.2,.95,.75,.4,4],[.24,1.56,.22,.16,8]]);
        K.backFence(g);
        S.o(1.55,(s,n)=>{ // 泵站主建物＋屋頂太陽能板
          boxZ(s,.2,.15,.7,.5,0,16,'#a9a69e','#ece8de','#c2bcae');flatQ(s,.23,.18,.64,.44,'#8f8c85',16);
          for(let r=0;r<3;r++){const v0=.22+r*.13;boxZ(s,.27,v0,.56,.08,17,1,'#2f5878','#4a78a0','#244660');for(let t=.33;t<.83;t+=.06)BL(s,P(t,v0,18),P(t,v0+.08,18),'#6a96b8');}
          for(let i=0;i<5;i++){const u=.26+i*.13;winL(s,u,.65,5,4,6,'#3e5a72');winL(s,u,.65,10,4,1,'#8fb0c8');if(hsh(1528,i,2)<.55)winL(n,u,.65,5,4,6,'#ffd98a');}
          winR(s,.9,.3,0,7,10,'#8e969a');for(let r=1;r<10;r+=2)winR(s,.9,.3,r,7,1,'#747c80');
          const lp=P(.9,.36,12);RC(s,lp[0],lp[1],2,1,'#f3e6b6');RC(n,lp[0],lp[1],2,1,'#ffe2a0');});
        const SS=['#f2f4f5','#dde2e5','#c3cacf','#a7b0b6','#8d979d'];
        steelTank(S,1.36,.4,10,30,SS,'#d7dde0',{seams:1,ring:10,cone:1,d:1.9});
        steelTank(S,1.72,.78,10,30,SS,'#d7dde0',{seams:1,ring:10,cone:1,d:2.6});
        S.t(2.0,(s)=>{pipe(s,P(.9,.45,4),P(1.2,.45,4),PGr);pipe(s,P(1.5,.62,4),P(1.5,.78,4),PGr);});
        S.o(2.2,(s)=>{basin(s,.2,.95,.75,.4,4,1531,[{a:'u',t:1.08},{a:'u',t:1.21}]);});
        S.o(2.9,(s,n)=>{boxZ(s,.24,1.56,.22,.16,0,8,'#5d7d6a','#6f917c','#4d6a58');for(let t=.28;t<.46;t+=.04)BL(s,P(t,1.72,1),P(t,1.72,7),'#4d6a58');
          RC(s,P(.3,1.72,6)[0],P(.3,1.72,6)[1],3,2,'#e0c24a');});
        for(const [u,v] of [[1.25,1.25],[1.6,1.6]]){
          S.o(u+v+.2,(s)=>{boxZ(s,u,v,.2,.2,0,3,'#c9c5bb','#dcd8ce','#aeaaa0');L.hatch(s,u+.03,v+.03,.1,.1,3,'#7f898e');});
          S.t(u+v+.45,(s,n)=>{const q=P(u+.16,v+.16,3);riser(s,q,3,6);valve(s,[q[0],q[1]-6]);pipe(s,P(u+.16,v+.16,6),P(u+.16,v+.24,6));
            const p=P(u+.26,v+.24),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-9,3,9,'#d9dee0');RC(s,x+2,y-9,1,9,'#9aa3a7');RC(s,x,y-10,3,1,'#7d868a');RC(s,x+1,y-7,1,1,'#58cf96');RC(n,x+1,y-7,1,1,'#7dffc0');});}
        L.lamp(S,.96,.84,22);L.lamp(S,1.9,1.2,22);
        L.bush(S,.14,1.9,4);L.bush(S,.6,1.86,3);
        return {gate:[.5,.58]};
      },
    ];
    for(let v=0;v<5;v++){
      const {c,g,nc,ng}=K.canvases(),S=L.scene(g,ng);
      const opt=V152[v](g,ng,S)||{};S.run();
      if(opt.gateR){K.fence(g,[SZ-E,E],[SZ-E,SZ-E],opt.gateR);K.fence(g,[E,SZ-E],[SZ-E,SZ-E]);const s=P(SZ*.8,SZ-E,0);RC(g,s[0]-2,s[1]-6,5,4,'#f2f2f2');RC(g,s[0]-1,s[1]-5,3,2,'#c0392b');
        B['152_1_'+v]=L.done(c,g,nc,{fence:false});}
      else B['152_1_'+v]=L.done(c,g,nc,{fence:true,gate:opt.gate});
    }
  }catch(e){console.error('infra575 k152',e);}
});
