// T576 civic_d2：診所 k13（SPR.clinic＋clinicVar[1..4]）／醫院 k12（SPR.hospital＋hospitalVar[1..4]）重畫。
// 業主問題：舊圖是「一顆小方塊架在細柱上、浮在灰地坪中央」。本批：主體牆腳落地、佔地 55–80%、落影向右，
// 其餘佔地用基地細節補完（停車格、車、無障礙坡道、雨遮、植栽、長椅）。不描粗的細線只用在地面標線。
// 分層合成：每個立體主體自成一層（hard 二值化＋深色外框）；夜光按層遮擋。零亂數：只用 K.hsh。
// 光從左：+v 面（左前）亮、+u 面（右前）暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function civic_d2(A){
  const S=A.SPR(),SH=A.shade;
  const W=72,H=112,AX=36,AY=110;

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {P,poly,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<900;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      poly(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      poly(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)poly(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const flatQ=(g,u0,v0,du,dv,c,z=0)=>poly(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
    // 牆面座標：F.x0/F.y0＝牆面左端的地面線像素；第 k 欄的地面列＝y0±floor(k/2)（左面向下、右面向上）
    const FL=(v,ua,ub)=>{const p=P(ua,v,0);return{sg:1,x0:Math.round(p[0]),y0:Math.round(p[1]),w:Math.round((ub-ua)*32)};};
    const FR=(u,va,vb)=>{const p=P(u,vb,0);return{sg:-1,x0:Math.round(p[0]),y0:Math.round(p[1]),w:Math.round((vb-va)*32)};};
    const fr=(g,F,o,z,w,h,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const k=o+i;if(k<0||k>=F.w)continue;g.fillRect(F.x0+k,F.y0+F.sg*Math.floor(k/2)-Math.round(z)-h,1,h);}};
    const fpx=(g,F,o,z,c)=>fr(g,F,o,z,1,1,c);
    const fxy=(F,o,z)=>[F.x0+o,F.y0+F.sg*Math.floor(o/2)-Math.round(z)];
    // 一排窗：寬 w 高 h、間距 gap、邊距 m；lit=夜間亮色、p=亮燈機率
    const row=(g,lx,F,z,w,h,gap,m,col,lit,p,seed,sill)=>{const n=Math.max(1,Math.floor((F.w-2*m+gap)/(w+gap)));
      const used=n*w+(n-1)*gap,o0=Math.floor((F.w-used)/2);const out=[];
      for(let i=0;i<n;i++){const o=o0+i*(w+gap);fr(g,F,o,z,w,h,col);if(sill)fr(g,F,o,z-1,w,1,sill);
        if(lx&&lit&&hsh(seed|0,i,z|0)<p)fr(lx,F,o,z,w,h,lit);out.push(o);}return out;};
    // 牆面水平紋（木板／磚縫）
    const courses=(g,F,z0,z1,step,c)=>{for(let z=z0;z<z1;z+=step)fr(g,F,0,z,F.w,1,c);};
    const GL=(g,fn)=>{const[c,x]=A.cv(W,H);fn(x);K.hard(c);g.drawImage(c,0,0);};
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;
        while(k<items.length){const it=items[k];const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      };
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    const done=(c,g,nc)=>{const[sc]=A.cv(W,H);return K.finish(c,g,sc,nc,{fence:false});};
    // 落影（光從左 ⇒ 影子落向右）：list=[u0,v0,du,dv,h]
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H);
      for(const[u0,v0,du,dv,h]of list){const k=Math.min(h/64,.42),u1=u0+du,v1=v0+dv;
        const F=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],T=[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
        poly(sx,F,'#101418');poly(sx,T,'#101418');for(let i=0;i<4;i++)poly(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],'#101418');}
      K.hard(sc);g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const shadowDot=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H);for(const[u,v,r]of list){const p=P(u,v);ell(sx,p[0]+r*.7,p[1],r,Math.max(1,r>>1),'#101418');}
      K.hard(sc);g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 基地：整片鋪面＋細紋＋前緣收邊
    const base=(g,col,seed,n=46)=>{A.dia(g,AX,K.TOPY,32,col);
      for(let i=0;i<n;i++){const p=P(hsh(seed,i,1),hsh(seed,i,2),0);RC(g,p[0],p[1],1,1,hsh(seed,i,3)<.5?SH(col,-9):SH(col,8));}
      A.diaEdge(g,6,SH(col,-42),AX,K.TOPY,32);A.diaEdge(g,9,SH(col,12),AX,K.TOPY,32);};
    const pave=(g,u0,v0,du,dv,c)=>GL(g,x=>flatQ(x,u0,v0,du,dv,c));
    const grassQ=(g,u0,v0,du,dv,seed)=>{pave(g,u0,v0,du,dv,'#6f9a4c');
      const n=Math.round(du*dv*150);for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,4)*du,v0+hsh(seed,i,5)*dv,0);RC(g,p[0],p[1],1,1,hsh(seed,i,6)<.5?'#5f8a40':'#83b05c');}};
    // 停車格線：stallsU＝沿 u 的線（格位沿 v 排）；stallsV＝沿 v 的線
    const stallsU=(g,ua,ub,vs,c='#e9e6dc')=>{for(const v of vs)BL(g,P(ua,v),P(ub,v),c);};
    const stallsV=(g,va,vb,us,c='#e9e6dc')=>{for(const u of us)BL(g,P(u,va),P(u,vb),c);};
    // 車：ax='u' 車身沿 u（長邊朝 +v 亮面）、ax='v' 車身沿 v（長邊朝 +u 暗面）
    const vehicle=(s,n,u,v,ax,kind,col)=>{
      const Lg={car:.19,van:.23,amb:.26}[kind],Wd=kind==='car'?.1:(kind==='amb'?.125:.115),hb={car:3,van:6,amb:7}[kind];
      const du=ax==='u'?Lg:Wd,dv=ax==='u'?Wd:Lg,c=col||{car:'#c04a3a',van:'#eceeee',amb:'#f6f7f6'}[kind];
      boxZ(s,u,v,du,dv,0,hb,SH(c,12),c,SH(c,-40));
      const side=ax==='u'?FL(v+dv,u,u+du):FR(u+du,v,v+dv),end=ax==='u'?FR(u+du,v,v+dv):FL(v+dv,u,u+du);
      if(kind==='car'){const iu=ax==='u'?.045:.014,iv=ax==='u'?.014:.045;boxZ(s,u+iu,v+iv,du-iu*1.6,dv-iv*1.6,hb,2,SH(c,22),'#3d5566','#2b3b47');}
      else{if(ax==='u')fr(s,side,side.w-4,hb-3,3,2,'#3d5566');else fr(s,side,0,hb-3,3,2,'#3d5566');fr(s,end,0,hb-3,end.w,2,'#2b3b47');}
      if(kind==='amb'){fr(s,side,0,2,side.w,1,'#d23a2c');fr(s,end,0,2,end.w,1,'#d23a2c');
        const t=P(u+du*.5,v+dv*.5,hb);RC(s,t[0]-1,t[1]-1,1,1,'#e0402f');RC(s,t[0],t[1]-1,1,1,'#3f6fe0');
        if(n){RC(n,t[0]-1,t[1]-1,1,1,'#ff5a48');RC(n,t[0],t[1]-1,1,1,'#6f9bff');}
        const mo=Math.floor(side.w*.4),q=fxy(side,mo,4);RC(s,q[0],q[1]-2,1,3,'#d23a2c');RC(s,q[0]-1,q[1]-1,3,1,'#d23a2c');}
      fr(s,side,1,0,2,1,'#22272b');fr(s,side,side.w-3,0,2,1,'#22272b');
      if(n){fpx(n,end,0,1,'#fff0b8');fpx(n,end,end.w-1,1,'#fff0b8');}
      return{du,dv};};
    const tree=(S,d,u,v,h=12,r=5,pal=['#5f8f3f','#86b457','#406a2c','#a8d27a'])=>S.o(d,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x,y-h+r,2,h-r,'#6b5039');
      ell(s,x,y-h,r,r,pal[0]);ell(s,x-1,y-h-1,r-2,r-2,pal[1]);RC(s,x+1,y-h+r-2,r-1,1,pal[2]);RC(s,x-2,y-h-2,1,1,pal[3]);});
    const bush=(S,d,u,v,r=2,c=['#8cc45a','#4f8a34','#356224'])=>S.o(d,(s)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
      ell(s,x,y-r,r+1,r,c[1]);ell(s,x-1,y-r-1,Math.max(1,r-1),Math.max(1,r-1),c[0]);RC(s,x+1,y-1,r,1,c[2]);});
    const bench=(S,d,u,v,ax='u')=>S.o(d,(s)=>{if(ax==='u'){boxZ(s,u,v,.12,.035,0,2,'#9a6f45','#b98a58','#7c5a38');boxZ(s,u,v,.12,.012,2,2,'#9a6f45','#b98a58','#7c5a38');}
      else{boxZ(s,u,v,.035,.12,0,2,'#9a6f45','#b98a58','#7c5a38');boxZ(s,u,v,.012,.12,2,2,'#9a6f45','#b98a58','#7c5a38');}});
    const planter=(S,d,u,v,du,dv,c='#bdb8ad')=>S.o(d,(s)=>{boxZ(s,u,v,du,dv,0,3,SH(c,-20),c,SH(c,-26));const p=P(u+du/2,v+dv/2,3);
      ell(s,p[0],p[1]-1,Math.max(2,Math.round((du+dv)*14)),2,'#4f8a34');ell(s,p[0]-1,p[1]-2,Math.max(1,Math.round((du+dv)*8)),1,'#8cc45a');});
    // 雨遮柱（細線層、不描粗）：亮面＋暗面兩像素
    const posts=(S,d,list,h,c=['#e3e7e9','#98a1a6'])=>S.t(d,(s)=>{for(const[u,v]of list){const p=P(u,v,0);RC(s,p[0],p[1]-h,1,h,c[0]);RC(s,p[0]+1,p[1]-h,1,h,c[1]);}});
    // 十字標誌（正面像素圖）：sz=5 或 7
    const cross=(g,x,y,sz,c)=>{x=Math.round(x);y=Math.round(y);const t=sz>=7?3:1,a=(sz-t)>>1;RC(g,x+a,y,t,sz,c);RC(g,x,y+a,sz,t,c);};
    // 屋頂圓形（直升機坪）
    const disc=(g,cu,cv,r,z,c)=>{const pts=[];for(let i=0;i<28;i++){const t=i/28*Math.PI*2;pts.push(P(cu+r*Math.cos(t),cv+r*Math.sin(t),z));}poly(g,pts,c);};
    const helipad=(s,n,cu,cv,r,z)=>{disc(s,cu,cv,r,z,'#eef0ee');disc(s,cu,cv,r*.88,z,'#596066');disc(s,cu,cv,r*.66,z,'#d9b23a');disc(s,cu,cv,r*.56,z,'#596066');
      const c=P(cu,cv,z),x=Math.round(c[0]),y=Math.round(c[1]);RC(s,x-3,y-2,1,5,'#f4f4f2');RC(s,x+2,y-2,1,5,'#f4f4f2');RC(s,x-2,y,4,1,'#f4f4f2');
      for(const[a,b]of[[-1,0],[1,0],[0,-1],[0,1]]){const q=P(cu+a*r*.94,cv+b*r*.94,z);RC(s,q[0],q[1]-1,1,1,'#e0402f');if(n)RC(n,q[0],q[1]-1,1,1,'#ff5040');}};
    // 屋頂設備：冷氣／機房
    const ac=(s,u,v,z,du=.09,dv=.09,h=3)=>{boxZ(s,u,v,du,dv,z,h,'#c9d0d2','#e1e5e6','#a4acb0');const p=P(u+du/2,v+dv/2,z+h);RC(s,p[0]-1,p[1]-1,2,1,'#7f898f');};
    // 雙坡屋頂：ridge 'u'（屋脊沿 u，山牆在 +u 暗面）或 'v'（屋脊沿 v，山牆在 +v 亮面）
    const gable=(g,u0,v0,du,dv,h,rh,ridge,wl,wr,rl,rd,ov=.03)=>{const u1=u0+du,v1=v0+dv;
      if(ridge==='v'){const um=u0+du/2;
        poly(g,[P(u0-ov,v0-ov,h-1),P(u0-ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rl);
        poly(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);
        poly(g,[P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh),P(um,v0-ov,h+rh)],rd);
        BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,24));return{um};}
      const vm=v0+dv/2;
      poly(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);
      poly(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
      poly(g,[P(u0-ov,v1+ov,h-1),P(u1+ov,v1+ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rl);
      BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),SH(rl,24));return{vm};};
    // 有屋脊的四坡頂
    const hipR=(g,u0,v0,du,dv,h,rh,cL,cR,cB,ov=.03)=>{const a=u0-ov,b=v0-ov,u1=u0+du+ov,v1=v0+dv+ov,um=u0+du/2,vm=v0+dv/2;
      let r0,r1;if(du>=dv){r0=P(u0+dv/2,vm,h+rh);r1=P(u0+du-dv/2,vm,h+rh);}else{r0=P(um,v0+du/2,h+rh);r1=P(um,v0+dv-du/2,h+rh);}
      poly(g,[P(a,b,h),P(u1,b,h),du>=dv?r1:r0,r0],cB);poly(g,[P(a,b,h),P(a,v1,h),du>=dv?r0:r1,r0],SH(cB,10));
      if(du>=dv){poly(g,[P(a,v1,h),P(u1,v1,h),r1,r0],cL);poly(g,[P(u1,b,h),P(u1,v1,h),r1],cR);}
      else{poly(g,[P(a,v1,h),P(u1,v1,h),r1],cL);poly(g,[P(u1,b,h),P(u1,v1,h),r1,r0],cR);}
      BL(g,r0,r1,SH(cL,26));BL(g,P(u1,v1,h),r1,SH(cL,16));return{r0,r1};};
    return{posts,P,poly,hsh,RC,BL,boxZ,flatQ,FL,FR,fr,fpx,fxy,row,courses,GL,scene,done,shadow,shadowDot,ell,base,pave,grassQ,stallsU,stallsV,vehicle,tree,bush,bench,planter,cross,disc,helipad,ac,gable,hipR};
  };

  // 建造器：fn(K,L,g,ng,S,v) → sprite
  const make=(name,v,fn)=>{const K=A.iso575(W,H,AX,AY,1),L=LIB(K);const{c,g,nc,ng}=K.canvases();const Sc=L.scene();
    fn(K,L,g,ng,Sc,v);Sc.run(g,ng);return L.done(c,g,nc);};

  // 調色
  const GLS=['#6f98b4','#4d7088'],LIT='#ffe3a6',LITC='#eef6ff';
  // 平頂量體＋女兒牆：回傳兩個牆面
  const block=(L,s,u0,v0,du,dv,h,pal)=>{L.boxZ(s,u0,v0,du,dv,0,h,pal.rim||SH(pal.L,-14),pal.L,pal.R);
    if(pal.roof)L.flatQ(s,u0+.035,v0+.035,du-.07,dv-.07,pal.roof,h);
    return{u0,v0,u1:u0+du,v1:v0+dv,h,fl:L.FL(v0+dv,u0,u0+du),fr:L.FR(u0+du,v0,v0+dv)};};
  const signCross=(L,s,n,F,o,z,sz,bg,fg,glow)=>{const q=L.fxy(F,o,z);if(bg)L.RC(s,q[0]-1,q[1]-sz-1,sz+2,sz+2,bg);L.cross(s,q[0],q[1]-sz,sz,fg);
    if(n){if(bg)L.RC(n,q[0]-1,q[1]-sz-1,sz+2,sz+2,'rgba(240,250,245,.55)');L.cross(n,q[0],q[1]-sz,sz,glow);}};

  // ================= 診所 k13 =================
  const CLINIC=[
    // v0 街角兩層診所：兩層主樓＋一層附屬、綠色招牌帶、大候診窗、雨遮、無障礙坡道、停車格＋白色廂型車
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#cfcac0',1301);
      L.pave(g,.70,.31,.29,.67,'#74716c');L.pave(g,.03,.64,.64,.33,'#dcd7cb');
      L.grassQ(g,.03,.03,.94,.04,11);L.grassQ(g,.03,.07,.04,.55,12);
      L.stallsU(g,.72,.98,[.33,.53,.74,.96]);
      L.pave(g,.73,.755,.24,.19,'#3f6fb0');{const p=P(.85,.85);RC(g,p[0]-1,p[1]-1,3,2,'#e9e6dc');}
      L.shadow(g,[[.08,.08,.6,.53,19],[.68,.06,.25,.24,9]]);
      L.shadowDot(g,[[.1,.88,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.68,.06,.25,.24,9,{L:'#eeebe3',R:'#c7c2b7',roof:'#b3b6b4'});
        row(s,n,b.fr,2,2,4,2,1,GLS[1],LIT,.7,5);fr(s,b.fl,2,0,3,6,'#6b5a48');fr(s,b.fl,1,6,5,1,'#3f8f5a');});
      Sc.o(20,(s,n)=>{const b=block(L,s,.08,.08,.6,.53,19,{L:'#f2efe7',R:'#c9c4b9',roof:'#b3b6b4'});
        const{fl,fr:R}=b;
        fr(s,fl,0,9,fl.w,2,'#3f8f5a');fr(s,R,0,9,R.w,2,'#2f6f45');
        for(let k=3;k<fl.w-3;k+=2)L.fpx(s,fl,k,9.6,'#e8f2ea');
        fr(s,fl,1,1,10,6,'#5d86a2');fr(s,fl,1,6,10,1,'#8fb3c9');fr(s,fl,6,1,1,6,'#e9ece8');
        if(n)fr(n,fl,1,1,10,5,LIT);
        fr(s,fl,13,0,4,7,'#4f6f84');fr(s,fl,15,0,1,7,'#dfe6e8');if(n)fr(n,fl,13,0,4,7,'#ffd88a');
        row(s,n,fl,12,3,4,2,2,GLS[0],LIT,.45,21,'#dcd8ce');
        row(s,n,R,1,3,5,2,2,GLS[1],LIT,.6,22);
        row(s,n,R,12,2,4,2,9,GLS[1],LIT,.4,23);
        signCross(L,s,n,R,R.w-8,11,5,'#f7f8f6','#2f9a52','#52e07c');
        L.ac(s,.16,.2,19);L.ac(s,.44,.13,19,.1,.08,2);});
      Sc.o(40,(s)=>{L.boxZ(s,.4,.61,.2,.06,0,1,'#e6e2d8','#c9c4b8','#b0ab9f');});
      Sc.o(50,(s,n)=>{L.boxZ(s,.38,.61,.24,.09,7,1,'#58b075','#3f8f5a','#2f6f45');if(n){const p=P(.5,.66,6);RC(n,p[0]-1,p[1],3,1,'#ffe2a0');}});
      L.tree(Sc,60,.1,.88,12,5);
      L.bush(Sc,62,.24,.74,2);L.bush(Sc,63,.3,.9,2);
      L.bench(Sc,64,.46,.84);
      Sc.o(70,(s,n)=>L.vehicle(s,n,.735,.37,'u','van'));
    },
    // v1 藥局併設：兩層診所主樓＋一層藥局店面（綠十字招牌、條紋雨篷、櫥窗貨架）、前方停車場兩台車
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#cdc8be',1311);
      L.pave(g,.3,.62,.68,.36,'#74716c');L.pave(g,.04,.57,.94,.05,'#dcd7cb');
      L.grassQ(g,.03,.62,.27,.35,13);
      L.stallsV(g,.64,.97,[.34,.54,.74,.94]);
      L.shadow(g,[[.06,.06,.46,.51,18],[.52,.14,.42,.43,10]]);
      L.shadowDot(g,[[.12,.86,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.06,.06,.46,.51,18,{L:'#efe4cf',R:'#c8b99e',roof:'#aeb0ac'});
        const{fl,fr:R}=b;
        fr(s,fl,0,8,fl.w,1,'#d8cbb2');
        fr(s,fl,2,0,4,7,'#5a4a3c');fr(s,fl,2,7,4,1,'#8a7a64');if(n)fr(n,fl,2,0,4,7,'#ffd88a');
        row(s,n,{...fl,x0:fl.x0+7,y0:fl.y0+3,w:fl.w-7},2,3,4,2,1,GLS[0],LIT,.6,31);
        row(s,n,fl,11,3,4,2,2,GLS[0],LIT,.45,32,'#d8cbb2');
        row(s,n,R,11,3,4,2,2,GLS[1],LIT,.45,33);
        L.ac(s,.12,.14,18);L.ac(s,.3,.12,18,.08,.1,2);});
      Sc.o(20,(s,n)=>{const b=block(L,s,.52,.14,.42,.43,10,{L:'#f4f2ec',R:'#cdd0cc',roof:'#b3b6b4'});
        const{fl,fr:R}=b;
        fr(s,fl,0,7,fl.w,3,'#2f9a52');fr(s,R,0,7,R.w,3,'#237a40');
        for(let k=2;k<fl.w-2;k+=2)L.fpx(s,fl,k,8,'#f2f7f2');
        fr(s,fl,1,1,fl.w-5,5,'#8fb9cf');fr(s,fl,1,2,fl.w-5,1,'#f0f2ee');fr(s,fl,1,4,fl.w-5,1,'#f0f2ee');
        for(let k=2;k<fl.w-5;k+=2){L.fpx(s,fl,k,3,L.hsh(k,3,1)<.5?'#e05a4a':'#f2d060');L.fpx(s,fl,k+1,5,L.hsh(k,5,1)<.5?'#5ab0e0':'#ffffff');}
        fr(s,fl,fl.w-3,0,2,6,'#5d86a2');
        if(n){fr(n,fl,1,1,fl.w-2,5,'#fff2c8');}
        row(s,n,R,1,3,5,2,2,GLS[1],'#fff2c8',.9,34);});
      Sc.o(30,(s)=>{const ua=.54,ub=.86,v=.57;L.poly(s,[P(ua,v,7),P(ub,v,7),P(ub,v+.07,5),P(ua,v+.07,5)],'#f0f2ee');
        const F=L.FL(v+.07,ua,ub);for(let k=0;k<F.w;k++)fr(s,F,k,3,1,2,(k>>1)%2?'#f4f6f2':'#2f9a52');});
      Sc.o(35,(s,n)=>{const q=P(.9,.53,10),x=Math.round(q[0])-3,y=Math.round(q[1])-7;
        L.cross(s,x,y,7,'#2fae5a');RC(s,x+3,y+1,1,5,'#8fe0a8');RC(s,x+1,y+3,5,1,'#8fe0a8');if(n){L.cross(n,x,y,7,'#62ff95');}});
      L.tree(Sc,60,.12,.84,12,5);
      L.bench(Sc,62,.18,.66);
      Sc.o(70,(s,n)=>L.vehicle(s,n,.4,.68,'v','car','#c04a3a'));
      Sc.o(72,(s,n)=>L.vehicle(s,n,.8,.7,'v','car','#3f6fb0'));
    },
    // v2 小兒科／牙醫：粉藍兩層、珊瑚色四坡頂、圓窗、黃色門與雨遮、牙齒招牌、右側停車一台黃色小廂型車
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#d3cec3',1321);
      L.pave(g,.68,.3,.3,.68,'#77746f');L.pave(g,.05,.62,.62,.35,'#e2dccd');
      L.grassQ(g,.05,.8,.24,.17,21);
      L.stallsU(g,.7,.98,[.32,.54,.76,.97]);
      L.shadow(g,[[.08,.08,.58,.52,22]]);
      L.shadowDot(g,[[.12,.9,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.08,.08,.58,.52,15,{L:'#d3e6f0',R:'#9fbccb'});
        const{fl,fr:R}=b;
        fr(s,fl,0,7,fl.w,1,'#f4f6f2');fr(s,R,0,7,R.w,1,'#cfd8dc');
        const port=(F,o,z,col,lit,sd,wall)=>{fr(s,F,o,z,4,4,'#f7f8f6');fr(s,F,o+1,z+1,2,2,col);fr(s,F,o+1,z,2,1,SH(col,20));fr(s,F,o+1,z+3,2,1,'#f7f8f6');
          for(const[a,b]of[[0,0],[3,0],[0,3],[3,3]])L.fpx(s,F,o+a,z+b,wall);
          if(n&&L.hsh(sd,o,z)<.6)fr(n,F,o+1,z+1,2,2,lit);};
        for(let o=2;o+4<fl.w;o+=6)port(fl,o,9,GLS[0],LIT,41,'#d3e6f0');
        for(let o=2;o+4<R.w;o+=6)port(R,o,9,GLS[1],LIT,42,'#9fbccb');
        fr(s,fl,1,1,7,5,'#6f98b4');for(const k of[1,3,5,7])fr(s,fl,k,1,1,5,['#f2c14e','#e87a5a','#6fbf73','#5aa0e0'][k>>1]);if(n)fr(n,fl,2,1,5,4,LIT);
        fr(s,fl,11,0,4,6,'#f2c14e');fr(s,fl,12,1,2,4,'#fbe6a0');if(n)fr(n,fl,12,1,2,4,'#ffd88a');
        row(s,n,{...R,w:R.w-2},1,3,4,2,1,GLS[1],LIT,.6,43);
        L.hipR(s,.08,.08,.58,.52,15,7,'#e07b5a','#b45a3e','#c96a4c');});
      Sc.o(20,(s,n)=>{const ua=.4,ub=.6,v=.6;L.poly(s,[P(ua,v,8),P(ub,v,8),P(ub,v+.07,6),P(ua,v+.07,6)],'#f7d36a');
        const F=L.FL(v+.07,ua,ub);for(let k=0;k<F.w;k++)fr(s,F,k,4,1,2,(k>>1)%2?'#fbf3dc':'#f2c14e');if(n){const p=P(.5,.62,5);RC(n,p[0]-1,p[1],3,1,'#ffe2a0');}});
      Sc.o(66,(s,n)=>{L.boxZ(s,.44,.88,.16,.04,0,6,'#3f7fb8','#4d8fc8','#35699a');const F=L.FL(.92,.44,.6);fr(s,F,1,1,F.w-2,4,'#f7fbff');
        const q=L.fxy(F,1,1),T=['##.##','#####','.###.','.#.#.'];for(let r=0;r<4;r++)for(let c2=0;c2<5;c2++)if(T[r][c2]==='#')RC(s,q[0]+c2,q[1]-4+r+Math.floor(c2/2),1,1,'#4d8fc8');
        if(n)fr(n,F,1,1,F.w-2,4,'rgba(235,245,255,.55)');});
      Sc.o(40,(s)=>{L.boxZ(s,.15,.83,.05,.05,0,5,'#f2c14e','#f7d36a','#c99a2e');L.poly(s,[P(.2,.83,5),P(.2,.88,5),P(.32,.88,0),P(.32,.83,0)],'#e05a4a');L.poly(s,[P(.32,.83,0),P(.32,.88,0),P(.2,.88,5)],'#b8443a');});
      L.tree(Sc,60,.07,.93,12,5,['#6f9f45','#98c45e','#4a7a30','#b8dc82']);
      L.bush(Sc,62,.62,.7,2);
      Sc.o(70,(s,n)=>L.vehicle(s,n,.725,.58,'u','van','#f0c64a'));
    },
    // v3 現代玻璃診所：玻璃帷幕一樓＋白框二樓、綠色 LED 十字、屋頂太陽能板、前方停車含電動車充電樁
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#c9c6bf',1331,30);
      L.pave(g,.08,.64,.9,.33,'#6f6e6c');
      for(let t=.12;t<.62;t+=.1)L.BL(g,P(.04,t),P(.07,t),'#b8b5ae');
      L.stallsV(g,.66,.97,[.28,.48,.68,.88]);
      L.pave(g,.5,.66,.18,.3,'#3f8a5e');L.BL(g,P(.51,.68),P(.51,.95),'#e9e6dc');
      L.grassQ(g,.03,.64,.05,.33,31);
      L.shadow(g,[[.07,.06,.64,.55,18]]);
      Sc.o(10,(s,n)=>{const g0=block(L,s,.11,.1,.56,.47,9,{L:'#86b7d3',R:'#517f9c'});
        for(let k=0;k<g0.fl.w;k+=3)fr(s,g0.fl,k,0,1,9,'#e1eaee');for(let k=0;k<g0.fr.w;k+=3)fr(s,g0.fr,k,0,1,9,'#a9bfcc');
        fr(s,g0.fl,0,4,g0.fl.w,1,'#cfdde4');
        if(n){fr(n,g0.fl,1,1,g0.fl.w-2,7,'rgba(236,246,255,.85)');fr(n,g0.fr,1,1,g0.fr.w-2,7,'rgba(236,246,255,.6)');}
        fr(s,g0.fl,8,0,5,7,'#3e6680');fr(s,g0.fl,10,0,1,7,'#e1eaee');});
      Sc.o(20,(s,n)=>{L.boxZ(s,.07,.06,.64,.55,9,9,'#e4e7e8','#f5f6f5','#cfd5d8');L.flatQ(s,.1,.09,.58,.49,'#b5babc',18);
        const fl=L.FL(.61,.07,.71),R=L.FR(.71,.06,.61);
        const up=(F,c,skip)=>{fr(s,F,1,11,F.w-2-(skip||0),5,c);for(let k=4;k<F.w-2-(skip||0);k+=4)fr(s,F,k,11,1,5,'#e8eef0');};
        up(fl,'#7fb2cf',9);up(R,'#4f7f9e');
        if(n){for(let k=1;k<fl.w-11;k+=4)if(L.hsh(51,k,1)<.6)fr(n,fl,k+1,11,3,5,LITC);for(let k=1;k<R.w-2;k+=4)if(L.hsh(52,k,1)<.5)fr(n,R,k+1,11,3,5,LITC);}
        signCross(L,s,n,fl,fl.w-7,11,5,null,'#27b35a','#5dff95');
        for(let i=0;i<3;i++){const v0=.13+i*.13;L.poly(s,[P(.14,v0,18),P(.46,v0,18),P(.46,v0+.09,20),P(.14,v0+.09,20)],'#2f4f78');L.BL(s,P(.14,v0+.09,20),P(.46,v0+.09,20),'#6f96c0');}
        L.flatQ(s,.52,.12,.13,.4,'#6f9a4c',18);});
      Sc.o(40,(s,n)=>{const q=P(.5,.655,0),x=Math.round(q[0]),y=Math.round(q[1]);RC(s,x,y-6,2,6,'#e9eeee');RC(s,x+2,y-6,1,6,'#b3bcc0');RC(s,x,y-5,2,1,'#39c16a');if(n)RC(n,x,y-5,2,1,'#6dff9e');});
      Sc.o(70,(s,n)=>L.vehicle(s,n,.54,.7,'v','car','#e9edee'));
      Sc.o(72,(s,n)=>L.vehicle(s,n,.74,.72,'v','car','#6d767c'));
      L.bush(Sc,74,.06,.7,2);L.bush(Sc,75,.06,.86,2);
    },
    // v4 木造社區衛生所：一層木構、沿 u 的雙坡紅瓦、右側山牆紅十字、前廊＋木坡道、布告欄、礫石地與小車
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#c8bfa6',1341,70);
      L.grassQ(g,.03,.03,.94,.08,41);L.grassQ(g,.03,.11,.07,.84,42);L.grassQ(g,.1,.8,.3,.17,43);
      L.pave(g,.72,.56,.26,.4,'#b3a98f');
      L.shadow(g,[[.12,.12,.58,.4,17]]);
      L.shadowDot(g,[[.08,.12,5],[.16,.9,3]]);
      L.tree(Sc,5,.08,.12,15,6,['#4f7f38','#76a64e','#355c26','#9cc870']);
      Sc.o(10,(s,n)=>{const b=block(L,s,.12,.12,.58,.4,12,{L:'#bf915f',R:'#8d6441'});
        const{fl,fr:R}=b;
        L.courses(s,fl,2,12,2,'#a87a4d');L.courses(s,R,2,12,2,'#7a5536');
        fr(s,fl,0,0,fl.w,2,'#8a8074');fr(s,R,0,0,R.w,2,'#6a6158');
        for(const o of[2,7]){fr(s,fl,o,4,4,5,'#efe9da');fr(s,fl,o+1,5,2,3,GLS[0]);if(n&&L.hsh(61,o,1)<.85)fr(n,fl,o+1,5,2,3,LIT);}
        fr(s,fl,12,2,4,7,'#5a4030');fr(s,fl,13,4,2,3,'#8fb0c4');if(n)fr(n,fl,12,2,4,7,'#ffcf7a');
        for(const o of[3,9]){fr(s,R,o,4,3,5,'#d9d0bd');fr(s,R,o,5,2,3,GLS[1]);if(n&&L.hsh(62,o,1)<.6)fr(n,R,o,5,2,3,LIT);}
        L.gable(s,.12,.12,.58,.4,12,8,'u','#bf915f','#8d6441','#a33f2f','#6e2a20');
        const G={...R,y0:R.y0-12};for(let z=1;z<8;z+=2)fr(s,G,Math.round((8-z)*.8),z,Math.max(0,R.w-Math.round((8-z)*1.6)),1,'#7a5536');
        const q=P(.7,.32,15),x=Math.round(q[0])-3,y=Math.round(q[1])-4;RC(s,x,y,7,6,'#f4f1ea');L.cross(s,x+1,y,5,'#d23a2c');
        if(n){RC(n,x,y,7,6,'rgba(255,240,220,.5)');L.cross(n,x+1,y,5,'#ff5a48');}});
      Sc.o(20,(s,n)=>{L.boxZ(s,.44,.52,.2,.1,0,2,'#a88259','#9a7650','#7d5d3f');
        for(const u of[.45,.62]){const p=P(u,.61,2);RC(s,p[0],p[1]-7,1,7,'#6b4a30');}
        L.gable(s,.44,.5,.2,.13,9,4,'v','#c89a68','#8d6441','#b84634','#7e2e22',.02);
        const F=L.FL(.63,.44,.64);const tp=L.fxy(F,Math.floor(F.w/2),12);
        if(n){RC(n,tp[0]-1,tp[1]+3,2,1,'#ffe2a0');}});
      Sc.o(25,(s)=>{L.poly(s,[P(.64,.53,2),P(.86,.53,0),P(.86,.61,0),P(.64,.61,2)],'#b08a60');L.poly(s,[P(.64,.61,2),P(.86,.61,0),P(.64,.61,0)],'#8d6a46');});
      Sc.t(26,(s)=>{L.BL(s,P(.64,.61,5),P(.86,.61,3),'#5a3e28');for(const u of[.66,.76,.85]){const z=2-Math.round((u-.64)/.22*2),p=P(u,.61,z+3);RC(s,p[0],p[1],1,3,'#5a3e28');}});
      Sc.o(30,(s)=>{const q=P(.3,.82,0),x=Math.round(q[0]),y=Math.round(q[1]);RC(s,x-4,y-8,2,8,'#6b4a30');RC(s,x+3,y-8,2,8,'#6b4a30');RC(s,x-5,y-11,11,6,'#8a6440');RC(s,x-4,y-10,9,4,'#efe9d8');
        RC(s,x-3,y-9,3,2,'#c95a4a');RC(s,x+1,y-9,2,1,'#5a8ac0');RC(s,x+1,y-8,3,1,'#9a9486');});
      L.bush(Sc,40,.44,.8,2,['#e88fa8','#4f8a34','#356224']);L.bush(Sc,41,.56,.84,2);
      Sc.o(70,(s,n)=>L.vehicle(s,n,.76,.66,'v','van','#f2f3f1'));
      Sc.o(75,(s)=>{for(const[u,v]of[[.62,.9],[.68,.9]]){const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(s,x-2,y-2,5,1,'#3f6fb0');RC(s,x-2,y-1,1,1,'#22272b');RC(s,x+2,y-1,1,1,'#22272b');}});
    },
  ];

  // ================= 醫院 k12 =================
  const HOSP=[
    // v0 寬矮型：三層寬樓、屋頂直升機坪、急診雨遮（右側）＋救護車、正門雨遮與紅十字、門前植栽與院名碑
    (K,L,g,ng,Sc)=>{const{P,RC,fr,row}=L;
      L.base(g,'#cbc7bd',1201);
      L.pave(g,.8,.06,.19,.91,'#77746f');L.pave(g,.04,.66,.76,.31,'#d9d4c8');
      L.grassQ(g,.04,.76,.28,.21,31);
      L.GL(g,x=>{});L.BL(g,P(.81,.36),P(.98,.36),'#e9e6dc');L.BL(g,P(.9,.4),P(.9,.66),'#f2d060');
      L.shadow(g,[[.05,.07,.75,.59,24]]);
      L.shadowDot(g,[[.12,.84,5],[.27,.92,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.05,.07,.75,.59,24,{L:'#f3f4f2',R:'#c6ccd0',roof:'#b9bec0'});
        const{fl,fr:R}=b;
        fr(s,fl,1,1,fl.w-2,6,'#6d93ad');for(let k=4;k<fl.w-2;k+=5)fr(s,fl,k,1,1,6,'#e3e8ea');if(n)fr(n,fl,1,1,fl.w-2,5,LIT);
        fr(s,fl,0,8,fl.w,1,'#d9dcdc');fr(s,R,0,8,R.w,1,'#b3babf');
        const mid=Math.floor(fl.w/2)-3;
        for(const z of[10,16]){for(let k=1;k+2<fl.w;k+=4){if(k+2>=mid&&k<=mid+7)continue;fr(s,fl,k,z,2,4,GLS[0]);if(n&&L.hsh(7,k,z)<.65)fr(n,fl,k,z,2,4,LITC);}}
        signCross(L,s,n,fl,mid+1,12,7,null,'#d8322a','#ff5a4a');
        for(const z of[10,16])for(let k=1;k+2<R.w;k+=4){fr(s,R,k,z,2,4,GLS[1]);if(n&&L.hsh(9,k,z)<.6)fr(n,R,k,z,2,4,LITC);}
        fr(s,R,R.w-13,0,6,7,'#4e6f86');fr(s,R,R.w-10,0,1,7,'#b9c6cd');if(n)fr(n,R,R.w-13,0,6,7,'#fff1c9');
        fr(s,R,1,2,3,4,GLS[1]);
        L.helipad(s,n,.4,.36,.23,24);
        L.ac(s,.64,.12,24,.1,.12,5);});
      Sc.o(30,(s,n)=>L.vehicle(s,n,.83,.38,'v','amb'));
      Sc.o(40,(s,n)=>{L.boxZ(s,.8,.1,.15,.24,10,2,'#e6eaeb','#f2f4f4','#c9d0d3');L.boxZ(s,.8,.1,.15,.24,9,1,null,'#c8342b','#a42a22');
        if(n){const p=P(.87,.34,9);RC(n,p[0]-2,p[1],5,1,'#ff7060');}});
      L.posts(Sc,41,[[.93,.12],[.93,.32]],9);
      Sc.o(50,(s,n)=>{L.boxZ(s,.3,.66,.24,.09,8,1,'#e4e8e6','#b8c0c4','#98a1a6');
        if(n){const p=P(.42,.72,7);RC(n,p[0]-2,p[1],5,1,'#ffe2a0');}});
      L.tree(Sc,60,.12,.84,12,5);L.tree(Sc,61,.27,.92,10,4);
      Sc.o(64,(s,n)=>{L.boxZ(s,.58,.86,.18,.04,0,5,'#d9dcdc','#f2f3f1','#b9bfc2');const F=L.FL(.9,.58,.76);fr(s,F,1,1,F.w-2,3,'#5a6166');
        const q=L.fxy(F,1,1);L.cross(s,q[0]+1,q[1]-3,3,'#e0402f');for(let k=6;k<F.w-2;k+=2)L.fpx(s,F,k,2,'#e9ecee');if(n)L.cross(n,q[0]+1,q[1]-3,3,'#ff6a5a');});
    },
    // v1 高樓型：一層裙樓鋪滿基地、九層病房塔樓、塔頂紅十字與直升機坪、裙樓屋頂花園、右側急診雨遮＋救護車
    (K,L,g,ng,Sc)=>{const{P,RC,fr}=L;
      L.base(g,'#cbc7bd',1211);
      L.pave(g,.82,.06,.17,.91,'#77746f');L.pave(g,.04,.69,.78,.28,'#d9d4c8');
      L.grassQ(g,.04,.8,.22,.17,51);
      L.BL(g,P(.91,.36),P(.91,.95),'#f2d060');L.BL(g,P(.83,.33),P(.98,.33),'#e9e6dc');
      L.shadow(g,[[.05,.06,.77,.63,9],[.14,.1,.4,.38,60]]);
      L.shadowDot(g,[[.1,.88,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.05,.06,.77,.63,9,{L:'#eef0ee',R:'#c3c9cd',roof:'#b3b9bb'});
        const{fl,fr:R}=b;
        fr(s,fl,1,1,fl.w-2,6,'#6d93ad');for(let k=3;k<fl.w-2;k+=4)fr(s,fl,k,1,1,6,'#e3e8ea');if(n)fr(n,fl,1,1,fl.w-2,5,LIT);
        fr(s,R,1,2,R.w-2,4,GLS[1]);for(let k=3;k<R.w-2;k+=4)fr(s,R,k,2,1,4,'#aab6bd');if(n)fr(n,R,1,2,R.w-2,4,'#fff1c9');
        fr(s,R,3,0,6,6,'#4e6f86');if(n)fr(n,R,3,0,6,6,'#fff1c9');
        L.flatQ(s,.58,.12,.19,.52,'#6f9a4c',9);L.flatQ(s,.1,.53,.46,.11,'#6f9a4c',9);
        for(let i=0;i<9;i++){const q=P(.6+L.hsh(3,i,1)*.15,.14+L.hsh(3,i,2)*.48,9);RC(s,q[0],q[1],2,1,L.hsh(3,i,3)<.5?'#8cc45a':'#4f8a34');}});
      Sc.o(20,(s,n)=>{L.boxZ(s,.14,.1,.4,.38,9,51,'#dfe3e4','#f4f5f3','#c8ced2');L.flatQ(s,.165,.125,.35,.33,'#b9bec0',60);
        const fl=L.FL(.48,.14,.54),R=L.FR(.54,.1,.48),mid=Math.floor(fl.w/2)-3;
        for(let f=0;f<7;f++){const z=11+f*6;
          for(let o=1;o+2<=fl.w-1;o+=4){fr(s,fl,o,z,2,4,GLS[0]);if(n&&L.hsh(71,o,z)<.6)fr(n,fl,o,z,2,4,LITC);}
          for(let o=1;o+2<=R.w-1;o+=4){fr(s,R,o,z,2,4,GLS[1]);if(n&&L.hsh(72,o,z)<.55)fr(n,R,o,z,2,4,LITC);}}
        fr(s,fl,0,53,fl.w,7,'#e9ecec');fr(s,R,0,53,R.w,7,'#bfc6ca');
        signCross(L,s,n,fl,mid+1,53,7,null,'#d8322a','#ff5a4a');
        L.helipad(s,n,.34,.29,.15,60);});
      Sc.o(30,(s,n)=>{L.boxZ(s,.82,.1,.14,.2,6,2,'#e6eaeb','#f2f4f4','#c9d0d3');L.boxZ(s,.82,.1,.14,.2,5,1,null,'#c8342b','#a42a22');
        if(n){const p=P(.89,.3,5);RC(n,p[0]-2,p[1],5,1,'#ff7060');}});
      L.posts(Sc,31,[[.945,.12],[.945,.28]],5);
      Sc.o(40,(s,n)=>L.vehicle(s,n,.84,.4,'v','amb'));
      Sc.o(50,(s,n)=>{L.boxZ(s,.3,.69,.22,.09,7,1,'#e4e8e6','#b8c0c4','#98a1a6');if(n){const p=P(.41,.74,6);RC(n,p[0]-2,p[1],5,1,'#ffe2a0');}});
      L.tree(Sc,60,.1,.88,12,5);L.bush(Sc,61,.24,.94,2);
      L.bench(Sc,62,.56,.84);L.bush(Sc,63,.72,.9,2);
    },
    // v2 雙棟連通：前左五層 A 棟（紅十字）＋後右三層 B 棟（屋頂直升機坪）以玻璃空橋相連、B 棟前急診雨遮＋救護車
    (K,L,g,ng,Sc)=>{const{P,RC,fr}=L;
      L.base(g,'#cbc7bd',1221);
      L.grassQ(g,.04,.04,.42,.24,61);
      L.pave(g,.47,.48,.5,.49,'#77746f');L.pave(g,.04,.76,.43,.21,'#d9d4c8');
      L.BL(g,P(.5,.61),P(.97,.61),'#f2d060');L.BL(g,P(.5,.8),P(.97,.8),'#e9e6dc');
      L.shadow(g,[[.05,.3,.4,.44,36],[.6,.06,.35,.4,22],[.45,.33,.15,.1,20]]);
      L.shadowDot(g,[[.07,.9,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.05,.3,.4,.44,36,{L:'#f1efe8',R:'#c9c5bb',roof:'#b3b6b4'});
        const{fl,fr:R}=b,mid=Math.floor(fl.w/2)-3;
        fr(s,fl,1,1,fl.w-2,5,'#6d93ad');for(let k=3;k<fl.w-2;k+=4)fr(s,fl,k,1,1,5,'#e3e8ea');if(n)fr(n,fl,1,1,fl.w-2,4,LIT);
        for(let f=0;f<4;f++){const z=9+f*7;
          for(let o=1;o+2<=fl.w-1;o+=4){if(f===3&&o+2>=mid&&o<=mid+7)continue;fr(s,fl,o,z,2,4,GLS[0]);if(n&&L.hsh(81,o,z)<.6)fr(n,fl,o,z,2,4,LITC);}}
        for(let f=0;f<5;f++){const z=2+f*7;for(let o=1;o+2<=R.w-1;o+=4){fr(s,R,o,z,2,4,GLS[1]);if(n&&L.hsh(82,o,z)<.5)fr(n,R,o,z,2,4,LITC);}}
        for(const z of[8,15,22,29])fr(s,fl,0,z-1,fl.w,1,'#e2ded4');
        signCross(L,s,n,fl,mid+1,29,7,null,'#d8322a','#ff5a4a');
        L.ac(s,.12,.38,36,.14,.12,4);});
      Sc.o(15,(s,n)=>{L.boxZ(s,.45,.33,.15,.1,14,6,'#d7dde0','#88b6d0','#577f98');const F=L.FL(.43,.45,.6);
        for(let k=0;k<F.w;k+=3)fr(s,F,k,14,1,6,'#e3ecf0');fr(s,F,0,14,F.w,1,'#c9d2d6');if(n)fr(n,F,1,15,F.w-2,4,LITC);});
      Sc.o(20,(s,n)=>{const b=block(L,s,.6,.06,.35,.4,22,{L:'#f4f5f3',R:'#c6ccd0',roof:'#b9bec0'});
        const{fl,fr:R}=b;
        fr(s,fl,1,1,fl.w-2,6,'#4e6f86');for(let k=4;k<fl.w-2;k+=4)fr(s,fl,k,1,1,6,'#b9c6cd');if(n)fr(n,fl,1,1,fl.w-2,5,'#fff1c9');
        for(const z of[9,15]){fr(s,fl,1,z,fl.w-2,4,'#7fa6c0');for(let k=4;k<fl.w-2;k+=4)fr(s,fl,k,z,1,4,'#e9edee');
          fr(s,R,1,z,R.w-2,4,'#557a93');for(let k=4;k<R.w-2;k+=4)fr(s,R,k,z,1,4,'#b8c3c9');
          if(n){for(let k=1;k<fl.w-2;k+=4)if(L.hsh(83,k,z)<.6)fr(n,fl,k,z,3,4,LITC);for(let k=1;k<R.w-2;k+=4)if(L.hsh(84,k,z)<.5)fr(n,R,k,z,3,4,LITC);}}
        fr(s,R,1,2,R.w-2,4,GLS[1]);if(n)fr(n,R,1,2,R.w-2,3,'#fff1c9');
        L.helipad(s,n,.775,.26,.15,22);});
      Sc.o(30,(s,n)=>{L.boxZ(s,.64,.46,.26,.1,7,2,'#e6eaeb','#c8342b','#a42a22');
        if(n){const p=P(.77,.56,6);RC(n,p[0]-2,p[1],5,1,'#ff7060');}});
      L.posts(Sc,31,[[.65,.555],[.88,.555]],7);
      Sc.o(40,(s,n)=>L.vehicle(s,n,.66,.65,'u','amb'));
      Sc.o(50,(s,n)=>{L.boxZ(s,.14,.74,.2,.08,7,1,'#e4e8e6','#b8c0c4','#98a1a6');if(n){const p=P(.24,.78,6);RC(n,p[0]-2,p[1],5,1,'#ffe2a0');}});
      L.tree(Sc,60,.06,.9,11,4);L.bush(Sc,61,.4,.92,2);L.bench(Sc,62,.2,.9);
    },
    // v3 老式磚造：紅磚三層＋白石腰線、灰藍四坡頂、中央山牆門廊（紅十字山花）、門前圓環車道＋噴水池、右側救護車道
    (K,L,g,ng,Sc)=>{const{P,RC,fr}=L;
      L.base(g,'#cdc6b6',1231);
      L.grassQ(g,.04,.56,.78,.41,91);
      L.GL(g,x=>{L.disc(x,.43,.78,.17,0,'#7a7670');L.flatQ(x,.36,.5,.14,.14,'#7a7670');});
      L.GL(g,x=>L.disc(x,.43,.78,.09,0,'#6f9a4c'));
      L.pave(g,.82,.08,.16,.89,'#7a7670');
      L.shadow(g,[[.06,.1,.74,.4,26]]);
      L.shadowDot(g,[[.12,.8,5],[.12,.1,4]]);
      L.tree(Sc,5,.1,.12,15,5);
      Sc.o(10,(s,n)=>{const b=block(L,s,.06,.1,.74,.4,22,{L:'#b85c43',R:'#8c4332',rim:'#e6dccb'});
        const{fl,fr:R}=b;
        for(const z of[7,14])fr(s,fl,0,z,fl.w,1,'#e6dccb'),fr(s,R,0,z,R.w,1,'#bdb3a2');
        fr(s,fl,0,20,fl.w,2,'#efe6d6');fr(s,R,0,20,R.w,2,'#c9bfae');
        for(const z of[2,9,15]){for(let o=1;o+2<=fl.w-1;o+=4){fr(s,fl,o,z,2,4,'#58788e');L.fpx(s,fl,o,z+4,'#efe6d6');L.fpx(s,fl,o+1,z+4,'#efe6d6');if(n&&L.hsh(91,o,z)<.55)fr(n,fl,o,z,2,4,LIT);}
          for(let o=1;o+2<=R.w-1;o+=4){fr(s,R,o,z,2,4,'#46606f');L.fpx(s,R,o,z+4,'#c9bfae');L.fpx(s,R,o+1,z+4,'#c9bfae');if(n&&L.hsh(92,o,z)<.5)fr(n,R,o,z,2,4,LIT);}}
        L.hipR(s,.06,.1,.74,.4,22,9,'#6b7580','#4f5760','#5d6670');
        {const q=P(.66,.2,27);RC(s,q[0],q[1]-5,3,6,'#9a5a44');RC(s,q[0],q[1]-5,3,1,'#6a3a2c');}});
      Sc.o(20,(s,n)=>{L.boxZ(s,.28,.46,.28,.1,0,22,'#e6dccb','#b85c43','#8c4332');
        const F=L.FL(.56,.28,.56),R=L.FR(.56,.46,.56);
        fr(s,F,0,0,1,22,'#efe6d6');fr(s,F,F.w-1,0,1,22,'#efe6d6');fr(s,F,0,20,F.w,2,'#efe6d6');fr(s,R,0,20,R.w,2,'#c9bfae');
        for(const z of[7,14])fr(s,F,0,z,F.w,1,'#e6dccb');
        for(const z of[9,15]){for(const o of[2,F.w-4]){fr(s,F,o,z,2,4,'#58788e');L.fpx(s,F,o,z+4,'#efe6d6');L.fpx(s,F,o+1,z+4,'#efe6d6');if(n)fr(n,F,o,z,2,4,LIT);}
          fr(s,F,Math.floor(F.w/2)-1,z,3,5,'#58788e');if(n)fr(n,F,Math.floor(F.w/2)-1,z,3,4,LIT);}
        L.gable(s,.28,.44,.28,.12,22,7,'v','#f1e9da','#c8bda9','#6b7580','#4f5760',.02);
        const tp=L.fxy(F,Math.floor(F.w/2)-2,23);L.cross(s,tp[0],tp[1]-5,5,'#d8322a');if(n)L.cross(n,tp[0],tp[1]-5,5,'#ff5a4a');});
      Sc.o(25,(s,n)=>{L.boxZ(s,.32,.56,.2,.06,0,8,'#efe6d6','#f1e9da','#c8bda9');const F=L.FL(.62,.32,.52);
        fr(s,F,1,0,F.w-2,6,'#3e342c');for(let k=1;k<F.w-1;k+=2)fr(s,F,k,0,1,6,'#f4efe4');fr(s,F,0,6,F.w,2,'#e6dccb');
        if(n)fr(n,F,2,0,F.w-4,5,'rgba(255,216,138,.8)');});
      Sc.o(30,(s,n)=>{const c=P(.43,.78,0),x=Math.round(c[0]),y=Math.round(c[1]);L.ell(s,x,y-1,5,2,'#bdb6a6');L.ell(s,x,y-2,4,1,'#6fa8d0');RC(s,x,y-5,1,3,'#dfe9f0');RC(s,x-1,y-4,3,1,'#bcd8ea');});
      L.tree(Sc,40,.1,.72,12,5);L.tree(Sc,41,.2,.9,11,4);L.bush(Sc,42,.66,.62,2);L.bush(Sc,43,.7,.9,2);
      Sc.o(50,(s,n)=>L.vehicle(s,n,.845,.56,'v','amb'));
    },
    // v4 附停車塔：五層病房主樓（紅十字）＋四層開放式停車塔（樓板間看得到車）、急診雨遮＋救護車、正門雨遮與植栽
    (K,L,g,ng,Sc)=>{const{P,RC,fr}=L;
      L.base(g,'#cbc7bd',1241);
      L.pave(g,.5,.45,.47,.2,'#77746f');L.pave(g,.04,.67,.93,.3,'#d9d4c8');
      L.grassQ(g,.04,.8,.26,.17,71);
      L.BL(g,P(.66,.47),P(.96,.47),'#f2d060');
      L.shadow(g,[[.05,.06,.45,.57,38],[.56,.06,.38,.37,26]]);
      L.shadowDot(g,[[.1,.9,4]]);
      Sc.o(10,(s,n)=>{const b=block(L,s,.05,.06,.45,.57,38,{L:'#f0f1ef',R:'#c4cacd',roof:'#b3b9bb'});
        const{fl,fr:R}=b,mid=Math.floor(fl.w/2)-3;
        fr(s,fl,1,1,fl.w-2,6,'#6d93ad');for(let k=3;k<fl.w-2;k+=4)fr(s,fl,k,1,1,6,'#e3e8ea');if(n)fr(n,fl,1,1,fl.w-2,5,LIT);
        for(let f=0;f<4;f++){const z=10+f*7;
          for(let o=1;o+2<=fl.w-1;o+=4){if(f===3&&o+2>=mid&&o<=mid+7)continue;fr(s,fl,o,z,2,4,GLS[0]);if(n&&L.hsh(101,o,z)<.6)fr(n,fl,o,z,2,4,LITC);}
          for(let o=1;o+2<=R.w-1;o+=4){fr(s,R,o,z,2,4,GLS[1]);if(n&&L.hsh(102,o,z)<.5)fr(n,R,o,z,2,4,LITC);}}
        fr(s,R,1,2,R.w-2,4,GLS[1]);if(n)fr(n,R,1,2,R.w-2,4,'#fff1c9');
        signCross(L,s,n,fl,mid+1,30,7,null,'#d8322a','#ff5a4a');
        L.ac(s,.12,.14,38,.16,.12,5);L.ac(s,.32,.4,38,.08,.08,3);});
      Sc.o(20,(s,n)=>{L.boxZ(s,.56,.06,.38,.37,0,26,'#bdbab3','#d2cfc8','#a6a39c');L.flatQ(s,.58,.08,.34,.33,'#8f8c86',26);
        const fl=L.FL(.43,.56,.94),R=L.FR(.94,.06,.43);
        for(const z of[3,10,17]){fr(s,fl,0,z,fl.w,4,'#34383c');fr(s,R,0,z,R.w,4,'#2b2f33');
          for(let o=2;o<fl.w-3;o+=5){const c=['#c04a3a','#e9edee','#3f6fb0','#8d969b','#e0b040'][Math.floor(L.hsh(111,o,z)*5)];if(L.hsh(112,o,z)<.7){fr(s,fl,o,z,3,2,c);fr(s,fl,o,z+2,3,1,SH(c,-30));}}
          for(let o=2;o<R.w-3;o+=5){const c=['#c04a3a','#e9edee','#3f6fb0','#8d969b','#e0b040'][Math.floor(L.hsh(113,o,z)*5)];if(L.hsh(114,o,z)<.7){fr(s,R,o,z,3,2,SH(c,-30));}}
          if(n){fr(n,fl,0,z+3,fl.w,1,'rgba(255,236,190,.35)');}}
        for(const[u,v,c]of[[.64,.14,'#e9edee'],[.78,.26,'#c04a3a']])L.boxZ(s,u,v,.08,.13,26,2,SH(c,12),c,SH(c,-40));
        const q=L.fxy(R,R.w-6,19);RC(s,q[0],q[1]-6,5,6,'#2f63b0');RC(s,q[0]+1,q[1]-5,1,4,'#ffffff');RC(s,q[0]+2,q[1]-5,2,1,'#ffffff');RC(s,q[0]+2,q[1]-3,2,1,'#ffffff');RC(s,q[0]+3,q[1]-4,1,1,'#ffffff');
        if(n)RC(n,q[0],q[1]-6,5,6,'rgba(120,170,255,.8)');});
      L.posts(Sc,31,[[.625,.61]],7);
      Sc.o(30,(s,n)=>{L.boxZ(s,.5,.46,.14,.16,7,2,'#e6eaeb','#c8342b','#a42a22');
        if(n){const q=P(.57,.62,6);RC(n,q[0]-2,q[1],5,1,'#ff7060');}});
      Sc.o(40,(s,n)=>L.vehicle(s,n,.67,.5,'u','amb'));
      Sc.o(50,(s,n)=>{L.boxZ(s,.14,.63,.22,.09,7,1,'#e4e8e6','#b8c0c4','#98a1a6');if(n){const p=P(.25,.68,6);RC(n,p[0]-2,p[1],5,1,'#ffe2a0');}});
      L.tree(Sc,60,.1,.9,12,5);L.bush(Sc,61,.4,.93,2);L.bench(Sc,62,.5,.86);
    },
  ];

  const run=(name,list,set)=>{try{const out=[];for(let v=0;v<list.length;v++)out.push(make(name,v,list[v]));set(out);}catch(e){console.error('civic576 '+name,e);}};
  run('clinic',CLINIC,o=>{S.clinic=o[0];S.clinicVar=S.clinicVar||[];for(let v=1;v<o.length;v++)S.clinicVar[v]=o[v];});
  run('hospital',HOSP,o=>{S.hospital=o[0];S.hospitalVar=S.hospitalVar||[];for(let v=1;v<o.length;v++)S.hospitalVar[v]=o[v];});
});
