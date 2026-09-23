// T609 logi_c：k167 大型配送中心（3×3，畫布 208×220，錨 104,218）／k168 冷鏈倉儲（2×2，畫布 136×150，錨 68,148）實驗線重畫。
// 分層合成（沿用 logi_a）：地坪（材質鋪面、標線、落影）直接畫在地面層；立體件走分層場景——每件各自二值化＋深色外框，依深度由後往前疊；
// 燈桿、欄杆等細線走不描邊層。夜圖「先有燈具才有光」：只點白天畫出的燈桿燈頭、窗、卸貨門燈、崗亭、車燈、高架倉頂紅色警示燈；
// 被前景實體擋住的燈會被擦掉。光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh 決定性雜湊。
// 牆面細節一律走「面座標」FR（逐欄沿牆腳斜線對齊），門封／門板／橫紋／板縫不會半像素錯位。
(window.__variants574=window.__variants574||[]).push(function logi_c(A){
  // 同名去重：index.html 若已整合過舊版 logi_c，注入的新版會先執行、舊版後執行而蓋掉新版；這裡只移除「排在本函式之後」的同名舊副本。
  // 正式整合（只有一份）時為空操作；不動其他批次。
  try{const Lq=window.__variants574,me=Lq?Lq.indexOf(logi_c):-1;if(me>=0)for(let i=Lq.length-1;i>me;i--){const f=Lq[i];if(f&&f!==logi_c&&f.name==='logi_c')Lq.splice(i,1);}}catch(_e){}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{167:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位；定稿必須是 {}
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {P,hsh,W,H}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<4000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    // 像素精準多邊形：掃描線取像素中心（無抗鋸齒、相鄰面不留縫）
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
    // 面座標：'L'＝+v 面（平面 v=pl，從 u=a 起往 u=b）、'R'＝+u 面（平面 u=pl，從 v=a（畫面左端、較大的 v）往 v=b）
    // FR(g,f,i0,i1,z0,z1,c)：第 i0..i1-1 欄、牆腳以上 z0..z1-1 列；每欄沿牆腳斜線精準對齊（同 fp 取像素中心）
    const FA=(face,pl,a,b)=>{const p=face==='L'?P(a,pl,0):P(pl,a,0),q=face==='L'?P(b,pl,0):P(pl,b,0);
      return{px:p[0],py:p[1],X:rnd(p[0]),n:rnd(q[0])-rnd(p[0]),s:face==='L'?.5:-.5,face,pl,a};};
    const FR=(g,f,i0,i1,z0,z1,c)=>{if(z1<=z0)return;g.fillStyle=c;i0=Math.max(0,i0);i1=Math.min(f.n,i1);
      for(let i=i0;i<i1;i++){const x=f.X+i,y=Math.ceil(f.py+(x+.5-f.px)*f.s-.5);g.fillRect(x,y-z1,1,z1-z0);}};
    const col=(f,t)=>f.face==='L'?rnd((t-f.a)*32):rnd((f.a-t)*32);   // 面上某 u（或 v）位置 → 欄號
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run,sh:[]};};   // sh：車輛落影（build 在場景前畫到地面）
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z] 方盒／['p',u,v,h] 細桿
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#b4b0a5',s:.25,p:.6},      // 混凝土版（卸貨坪、人行）
      d:{t:['#bdb9ae','#b7b3a8','#c3bfb4'],j:'#aaa69b',s:.25,p:.6},      // 較暗混凝土（卡車坪）
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      k:{t:['#a39e92','#9c978b','#aba69a'],j:null,s:.0625,p:.5},         // 碎石
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*16);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62605c':'#7a7873');}}
      if(m==='c'||m==='d'){for(let i=0;i<rnd(du*dv*4);i++){const p=P(u0+.05+hsh(seed,i,41)*(du-.1),v0+.05+hsh(seed,i,42)*(dv-.1));RC(g,p[0]-1,p[1],3,1,SH(M.t[0],-16));RC(g,p[0],p[1]+1,2,1,SH(M.t[0],-10));}}
      if(m==='k'){for(let i=0;i<rnd(du*dv*60);i++){const p=P(u0+hsh(seed,i,51)*du,v0+hsh(seed,i,52)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,53)<.5?'#8f8a7e':'#bab5a8');}}
      if(m==='g'){for(let i=0;i<rnd(du*dv*30);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const YEL='#d6b243',WHT='#e6e2d6';
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const stain=(g,u,v,r)=>{const p=P(u,v);ell(g,p[0],p[1],r,Math.max(1,r>>1),'rgba(60,58,52,.18)');};
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),L=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(3,Math.round(L/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};

    // ---------- 車輛 ----------
    // 半聯結車：dir＝'u+'|'u-'|'v+'|'v-'（車頭朝向）；(u,v)＝整台車佔地的最小角；load＝'box'（乾貨廂）|'reefer'（冷凍廂，前端冷凍機）|null（空板架）
    // cab＝null：甩掛拖車（無車頭，前端支腿著地）；o.stripe＝廂側色帶
    const truck=(S,u,v,dir,cab,load,d,o={})=>{const ax=dir[0],fw=dir[1]==='+',Wd=.08,TL=.44,CL=.11,rf=load==='reefer',gap=rf?.035:.01;
      const bx=(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      const pt=(b,a,z)=>ax==='u'?P(u+b,v+a,z):P(u+a,v+b,z);
      const tb=fw?0:CL+gap,cb=fw?TL+gap:0,th=rf?9:8;
      const cabF=(g,n)=>{bx(g,cb,CL,-.005,Wd+.01,1,8,SH(cab,24),cab,SH(cab,-44));if(!rf)bx(g,cb+(fw?.0:.03),.08,.005,Wd-.01,9,1,SH(cab,30),SH(cab,10),SH(cab,-30));
        const fe=fw?cb+CL:cb;
        if(fw){if(ax==='u')faceR(g,u+fe,v+.01,v+Wd-.005,5,8,'#34495a');else faceL(g,v+fe,u+.005,u+Wd-.005,5,8,'#415f76');
          if(n){const h1=pt(fe,.012,2),h2=pt(fe,Wd-.012,2);RC(n,h1[0],h1[1],1,1,'#fff3c8');RC(n,h2[0],h2[1],1,1,'#fff3c8');}}
        else{if(ax==='u')winL(g,u+cb+.03,v+Wd+.005,5,2,2,'#415f76');else winR(g,u+Wd+.005,v+cb+.05,5,2,2,'#34495a');}
        for(const t of[cb+.02,cb+.08]){const p=pt(t,Wd+.005,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}};
      const trl=(g)=>{bx(g,tb,TL,0,Wd,1,1,'#45494d','#55595d','#34383b');
        for(const t of(fw?[tb+.03,tb+.08]:[tb+TL-.08,tb+TL-.03])){const p=pt(t,Wd,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}
        if(load==='box'||rf){const c0=o.body||(rf?'#eef0f0':'#dcdcd6'),cr=o.body?SH(o.body,-40):(rf?'#b4bbbe':'#a9aba7');bx(g,tb,TL,0,Wd,2,th,SH(c0,8),c0,cr);
          if(ax==='u')ribsL(g,u+tb,u+tb+TL,v+Wd,2,2+th,SH(c0,-12),3);else ribsR(g,u+Wd,v+tb,v+tb+TL,2,2+th,SH(cr,-10),3);
          if(o.stripe){if(ax==='u')faceL(g,v+Wd,u+tb+.02,u+tb+TL-.02,th-1,th+1,o.stripe);else faceR(g,u+Wd,v+tb+.02,v+tb+TL-.02,th-1,th+1,SH(o.stripe,-30));}
          if(rf){   // 冷凍機組：廂體前端上緣凸出的深色機殼（z7–15：高出廂頂 4px、車頭 6px；向前凸出約 2px），側面與前面各一片較淺的格柵＋深色百葉
            const a0=fw?tb+TL-.07:tb-.055,len=.125,w0=-.01,w1=Wd+.01;
            bx(g,a0,len,w0,w1-w0,7,8,'#8b959a','#566065','#3f474c');
            const gr=(f,lit)=>{FR(g,f,1,f.n-1,8,14,lit?'#a4aeb3':'#7c868b');for(const z of[9,11,13])FR(g,f,1,f.n-1,z,z+1,lit?'#262d32':'#1f252a');FR(g,f,0,f.n,14,15,lit?'#c3cbcf':'#8e989d');};
            gr(ax==='u'?FA('L',v+w1,u+a0,u+a0+len):FA('R',u+w1,v+a0+len,v+a0),ax==='u');
            if(fw)gr(ax==='u'?FA('R',u+a0+len,v+w1,v+w0):FA('L',v+a0+len,u+w0,u+w1),ax!=='u');}}
        else if(load){bx(g,tb+.02,TL-.04,0,Wd,2,4,SH(load,20),load,SH(load,-48));}
        else{bx(g,tb+.02,.03,0,Wd,2,1,'#6a6e71','#7b7f82','#505457');bx(g,tb+TL-.05,.03,0,Wd,2,1,'#6a6e71','#7b7f82','#505457');}
        if(cab==null){const lg=fw?tb+TL-.07:tb+.07;for(const a of[.015,Wd-.01]){const p=pt(lg,a,0);RC(g,p[0],p[1]-2,1,2,'#2c2f32');}}};
      const dd=d!=null?d:u+v+(ax==='u'?TL+CL:Wd)+(ax==='v'?TL+CL:Wd)-.2;
      const Ln=cab==null?TL:TL+CL+gap;if(ax==='u')S.sh.push(['b',u+tb*(cab==null?1:0),v,Ln,Wd,th+2]);else S.sh.push(['b',u,v+tb*(cab==null?1:0),Wd,Ln,th+2]);
      S.o(dd,(g,n)=>{if(cab==null){trl(g);return;}if(fw){trl(g);cabF(g,n);}else{cabF(g,n);trl(g);}});};
    // 小型配送廂車（最後一哩）：長 .24、寬 .075；o.col＝車身色、stripe＝色帶
    const van=(S,u,v,dir,col,stripe,d)=>{const ax=dir[0],fw=dir[1]==='+',Wd=.075,Lb=.17,Lc=.07;
      const bx=(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,u+b0,v+a0,db,da,z,h,t,l,r):boxZ(g,u+a0,v+b0,da,db,z,h,t,l,r);
      const pt=(b,a,z)=>ax==='u'?P(u+b,v+a,z):P(u+a,v+b,z);
      const bb=fw?0:Lc,cb=fw?Lb:0;
      if(ax==='u')S.sh.push(['b',u,v,Lb+Lc,Wd,8]);else S.sh.push(['b',u,v,Wd,Lb+Lc,8]);
      S.o(d!=null?d:u+v+Wd+.24-.1,(g,n)=>{
        const drawBox=()=>{bx(g,bb,Lb,0,Wd,1,7,SH(col,10),col,SH(col,-40));
          if(stripe){if(ax==='u')faceL(g,v+Wd,u+bb+.01,u+bb+Lb-.01,3,4,stripe);else faceR(g,u+Wd,v+bb+.01,v+bb+Lb-.01,3,4,SH(stripe,-26));}};
        const drawCab=()=>{bx(g,cb,Lc,.004,Wd-.008,1,5,SH(col,14),SH(col,-4),SH(col,-44));
          const fe=fw?cb+Lc:cb;
          if(fw){if(ax==='u')faceR(g,u+fe,v+.01,v+Wd-.01,3,5,'#34495a');else faceL(g,v+fe,u+.01,u+Wd-.01,3,5,'#415f76');
            if(n){const h1=pt(fe,.015,2),h2=pt(fe,Wd-.015,2);RC(n,h1[0],h1[1],1,1,'#fff3c8');RC(n,h2[0],h2[1],1,1,'#fff3c8');}}};
        if(fw){drawBox();drawCab();}else{drawCab();drawBox();}
        for(const t of[.035,.2]){const p=pt(t,Wd,0);RC(g,p[0]-1,p[1]-2,2,2,'#1c1e21');}});};
    // 小汽車（不描外框，免得縮成色點）：座標與尺寸都鎖在 1/32 格（每台車同一副像素，不再各自量化成圓團）
    // 3×5 格：1px 深色落影（右側）＋深色底盤線＋車身（上面亮、右面暗）＋車艙：淺色車頂、前擋風／側窗深色線；fwd＝車頭朝 +軸
    const car=(S,u,v,alongU,c,d,fwd)=>{const q=32,su=Math.round(u*q)/q,sv=Math.round(v*q)/q,Lc=5/q,Wc=3/q,du=alongU?Lc:Wc,dv=alongU?Wc:Lc;
      const f=fwd!=null?fwd:hsh(7713,rnd(su*q),rnd(sv*q))<.5;
      S.t(d!=null?d:su+sv+.1,(g)=>{
        flat(g,su+1/q,sv,du,dv,'#34332f');                             // 硬落影：向右 1px
        boxZ(g,su,sv,du,dv,0,1,'#1e2124','#2a2f34','#181b1e');
        boxZ(g,su,sv,du,dv,1,2,SH(c,12),c,SH(c,-38));
        // 車艙：長 2 格，車頭側留 2 格引擎蓋、車尾 1 格
        const a0=f?1/q:2/q,cu=alongU?su+a0:su,cv=alongU?sv:sv+a0,cdu=alongU?2/q:Wc,cdv=alongU?Wc:2/q;
        boxZ(g,cu,cv,cdu,cdv,3,1,SH(c,46),'#1f2b35','#172029');});};
    // 車色避開與瀝青（#6d6b67）同明度的中灰，否則車子在停車場裡會溶掉
    const CARS=['#e8ecee','#3d5f8a','#b9c1c6','#2a2e31','#b8433a','#d8d0bc','#f0f2f2','#8fb3cf','#4f6f55','#c9ced2','#3f5a70'];
    // ---------- 燈具與植栽 ----------
    const mast=(S,u,v,h=34,d)=>S.o(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');RC(g,x+1,y-h+2,1,h-4,'#80878c');
      RC(g,x-2,y-h-2,5,2,'#5b6166');RC(g,x-2,y-h-2,5,1,'#9aa1a6');RC(g,x-2,y-h,5,1,'#e9e2c4');
      if(n){RC(n,x-2,y-h,5,1,'#fff2c8');RC(n,x-1,y-h+1,3,1,'rgba(255,232,170,.5)');}});
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});

    // ---------- 建築構件 ----------
    // 卸貨門：f＝面、i＝左緣欄；5 欄寬（黑色門封 1＋門板 3＋門封 1）、高 dh；open＝門捲起（廂尾靠著）；門上一顆門燈
    const dock=(g,n,f,i,o={})=>{const dh=o.dh||10,dc=o.dc||'#a2aaae';
      FR(g,f,i,i+5,0,dh+1,'#282b2f');
      if(o.open){FR(g,f,i+1,i+4,1,dh,'#353a3f');FR(g,f,i+1,i+4,dh-3,dh,dc);FR(g,f,i+1,i+4,dh-3,dh-2,SH(dc,-20));}
      else{FR(g,f,i+1,i+4,1,dh,dc);for(let z=3;z<dh;z+=2)FR(g,f,i+1,i+4,z,z+1,SH(dc,-16));}
      FR(g,f,i,i+5,0,1,'#17181a');
      if(o.lamp!==false){FR(g,f,i+2,i+3,dh+2,dh+3,'#efe3b4');if(n)FR(n,f,i+2,i+3,dh+2,dh+3,'#ffe6a0');}};
    // 人員門
    const pdoor=(g,f,i,c='#56626a')=>{FR(g,f,i,i+3,0,7,'#2c3034');FR(g,f,i+1,i+3,0,6,c);};
    // 卸貨雨遮（獨立一件，畫在卡車之後：車尾伸進雨遮下）
    // 雨遮前緣下方每道門一盞燈（lights＝門中心）：日間淺色燈罩、夜間點亮
    const canopyL=(S,a0,a1,V,dp,z,d,lights=[])=>S.o(d,(g,n)=>{fp(g,[P(a0,V,z),P(a1,V,z),P(a1,V+dp,z),P(a0,V+dp,z)],'#d5d8d6');faceL(g,V+dp,a0,a1,z-2,z,'#8f9598');faceR(g,a1,V,V+dp,z-2,z,'#6f7578');
      const f=FA('L',V+dp,a0,a1);for(const t of lights){const i=col(f,t);FR(g,f,i,i+2,z-2,z-1,'#efe6c0');if(n)FR(n,f,i,i+2,z-2,z-1,'#ffe6a0');}});
    const canopyR=(S,a0,a1,U,dp,z,d,lights=[])=>S.o(d,(g,n)=>{fp(g,[P(U,a1,z),P(U+dp,a1,z),P(U+dp,a0,z),P(U,a0,z)],'#d5d8d6');faceL(g,a0,U,U+dp,z-2,z,'#8f9598');faceR(g,U+dp,a1,a0,z-2,z,'#6f7578');
      const f=FA('R',U+dp,a0,a1);for(const t of lights){const i=col(f,t);FR(g,f,i,i+2,z-2,z-1,'#c9c2a0');if(n)FR(n,f,i,i+2,z-2,z-1,'#ffe6a0');}});
    // 屋頂空調箱（RTU）
    const rtu=(g,u,v,z,big)=>{const du=big?.2:.14,dv=big?.13:.1;boxZ(g,u,v,du,dv,z,big?6:5,'#bcc3c6','#d0d6d8','#8f979b');
      const c=P(u+du*.68,v+dv*.5,z+(big?6:5));ell(g,c[0],c[1],2,1,'#5b6468');RC(g,c[0],c[1],1,1,'#a3acb0');
      const l=FA('L',v+dv,u,u+du);FR(g,l,1,Math.max(2,l.n-3),z+1,z+3,'#aab1b4');};
    // 採光天窗排：ax＝'u'（沿 u 的一排）／'v'
    const skyRow=(g,ax,line,a0,a1,z,seg=.16,gp=.06,w=.07)=>{for(let t=a0;t+seg<=a1+1e-6;t+=seg+gp){
      if(ax==='u'){flat(g,t,line,seg,w,'#a4bac5',z);BL(g,P(t,line+w,z),P(t+seg,line+w,z),'#e3ebee');BL(g,P(t+seg,line,z),P(t+seg,line+w,z),'#7d929c');}
      else{flat(g,line,t,w,seg,'#a4bac5',z);BL(g,P(line,t+seg,z),P(line+w,t+seg,z),'#e3ebee');BL(g,P(line+w,t,z),P(line+w,t+seg,z),'#7d929c');}}};
    // 平頂大倉（配送中心）：淺色金屬壁板＋細橫紋＋板縫；女兒牆壓頂；o.docks＝{face:'L'|'R',at:[門中心],open:[...]}
    const WH=(S,o)=>{const u0=o.u0,v0=o.v0,du=o.du,dv=o.dv,h=o.h,u1=u0+du,v1=v0+dv;
      const wl=o.wl||'#dcd9cf',wr=o.wr||'#aba89f',rf=o.rf||'#c9cbc7',acc=o.acc||null;
      S.o(o.d!=null?o.d:u0+v1-.02,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,h,rf,wl,wr);
        const fl=FA('L',v1,u0,u1),fr=FA('R',u1,v1,v0);
        const skin=(f,c,a)=>{FR(g,f,0,f.n,0,2,SH(c,-30));
          for(let z=4;z<h-2;z+=3)FR(g,f,0,f.n,z,z+1,SH(c,-7));
          for(let i=16;i<f.n-3;i+=16)FR(g,f,i,i+1,2,h-1,SH(c,-13));
          if(a)FR(g,f,0,f.n,h-4,h-2,a);
          FR(g,f,0,f.n,h-1,h,SH(c,16));};
        skin(fl,wl,acc);skin(fr,wr,acc&&SH(acc,-34));
        // 屋面：內凹一圈（女兒牆），背側內緣壓暗
        flat(g,u0+.03,v0+.03,du-.06,dv-.06,SH(rf,-6),h);
        // 立邊咬合金屬屋面：沿長軸的咬合縫，每 4px 一道（深 1–2 階），止於檢修走道內側
        if(o.seams!==false){const sa=o.seamAx||'u',sc=SH(rf,-27),e3=.09;
          if(sa==='u'){for(let t=v0+.125;t<v1-e3+1e-6;t+=.125)BL(g,P(u0+e3,t,h),P(u1-e3,t,h),sc);}
          else{for(let t=u0+.125;t<u1-e3+1e-6;t+=.125)BL(g,P(t,v0+e3,h),P(t,v1-e3,h),sc);}}
        // 女兒牆內側檢修走道：沿四邊 1px 亮帶
        {const e2=.065,wk=SH(rf,16);BL(g,P(u0+e2,v1-e2,h),P(u1-e2,v1-e2,h),wk);BL(g,P(u1-e2,v0+e2,h),P(u1-e2,v1-e2,h),wk);
          BL(g,P(u0+e2,v0+e2,h),P(u1-e2,v0+e2,h),wk);BL(g,P(u0+e2,v0+e2,h),P(u0+e2,v1-e2,h),wk);}
        BL(g,P(u0+.03,v0+.03,h),P(u1-.03,v0+.03,h),SH(rf,-24));BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v1-.03,h),SH(rf,-18));
        // 屋頂檢修孔（人孔蓋）：小方盒＋淺色蓋板＋深色蓋縫
        // 檢修孔：4×4px 方座（對齊 1/32 格）＋中灰蓋板＋亮緣；後兩緣一道黃色護欄（3 支柱＋扶手）
        if(o.hatch)for(const[hu0,hv0]of o.hatch){const hu=Math.round(hu0*32)/32,hv=Math.round(hv0*32)/32,s=4/32;
          boxZ(g,hu,hv,s,s,h,3,'#dfe2df','#b3b8b5','#858b88');flat(g,hu+1/32,hv+1/32,2/32,2/32,'#8f9895',h+3);
          BL(g,P(hu,hv+s,h+3),P(hu+s,hv+s,h+3),'#f4f5f2');
          const Y='#d8b23c';for(const[a,b]of[[hu,hv+s],[hu,hv],[hu+s,hv]]){const p=P(a,b,h+3);g.fillStyle='#a88a2c';g.fillRect(rnd(p[0]),rnd(p[1])-3,1,3);}
          BL(g,P(hu,hv+s,h+6),P(hu,hv,h+6),Y);BL(g,P(hu,hv,h+6),P(hu+s,hv,h+6),Y);}
        if(o.sky)for(const s of o.sky)skyRow(g,s[0],s[1],s[2],s[3],h,s[4],s[5]);
        if(o.hvac)for(const r of o.hvac)rtu(g,r[0],r[1],h,r[2]);
        if(o.roof)o.roof(g,n,h);
        if(o.docks){const dk=o.docks,f=dk.face==='L'?fl:fr;
          dk.at.forEach((t,k)=>dock(g,n,f,col(f,t)-2,{open:dk.open&&dk.open[k],dh:dk.dh||10,dc:dk.face==='L'?'#a7afb3':'#848c90'}));}
        if(o.pdoors)for(const[fc,t]of o.pdoors){const f=fc==='L'?fl:fr;pdoor(g,f,col(f,t)-1,fc==='L'?'#5d6a72':'#4a555c');}
        if(o.wall)o.wall(g,n,fl,fr);
      });};
    // 玻璃門廳辦公角：分層帶窗（鋁框竪梃）、轉角全高玻璃門廳、入口雨遮
    const gOffice=(S,o)=>{const u0=o.u0,v0=o.v0,du=o.du,dv=o.dv,fl=o.fl||2,fh=7,h=fl*fh+4,u1=u0+du,v1=v0+dv,gl=o.gl||'#557f9b',wl=o.wl||'#e6e3db',wr=o.wr||'#b6b2a9',seed=o.seed||1;
      S.o(o.d!=null?o.d:u0+v0+Math.min(du,dv)+.01,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,h,'#a4abae',wl,wr);
        flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#8f979a',h);BL(g,P(u0+.03,v0+.03,h),P(u1-.03,v0+.03,h),'#6f777a');BL(g,P(u0+.03,v0+.03,h),P(u0+.03,v1-.03,h),'#767e81');
        const fL=FA('L',v1,u0,u1),fR=FA('R',u1,v1,v0),lc=o.lobby!=null?o.lobby:8;
        const band=(f,glass,mul,lit,skip0,skip1)=>{for(let k=0;k<fl;k++){const z0=2+k*fh,z1=z0+fh-2;
          FR(g,f,1+skip0,f.n-1-skip1,z0,z1,glass);FR(g,f,1+skip0,f.n-1-skip1,z1-1,z1,SH(glass,22));
          for(let i=1+skip0;i<f.n-1-skip1;i+=3)FR(g,f,i,i+1,z0,z1,mul);
          if(n)for(let i=2+skip0;i+2<=f.n-1-skip1;i+=3){if(hsh(seed,k*37+i,f===fL?1:2)<lit)FR(n,f,i,i+2,z0,z1-1,'#ffe3a0');}}};
        band(fL,gl,'#c9d1d4',.62,0,lc);band(fR,SH(gl,-24),'#9ba4a8',.5,lc-3,0);
        // 轉角門廳：全高玻璃＋橫向竪框
        const lob=(f,i0,i1,glass,mul)=>{FR(g,f,i0,i1,0,h-2,glass);for(let i=i0;i<i1;i+=3)FR(g,f,i,i+1,0,h-2,mul);FR(g,f,i0,i1,fh+1,fh+2,mul);FR(g,f,i0,i1,h-3,h-2,SH(glass,26));
          if(n)FR(n,f,i0+1,i1,1,fh,'#ffe8b0');};
        lob(fL,fL.n-lc,fL.n,gl,'#d3d9dc');lob(fR,0,lc-3,SH(gl,-24),'#a5aeb2');
        // 入口雨遮＋門
        const ef=o.entry==='R'?fR:fL,ei=o.entry==='R'?2:fL.n-lc+2;FR(g,ef,ei,ei+4,0,6,'#2b3f4f');
        if(n)FR(n,ef,ei,ei+4,0,6,'#fff0c0');
        if(o.entry==='R'){boxZ(g,u1,v1-.2,.07,.16,6,1,'#eef0f1','#f6f7f8','#b8bfc3');}else{boxZ(g,u1-.26,v1,.2,.07,6,1,'#eef0f1','#f6f7f8','#b8bfc3');}
        if(o.sign){FR(g,fL,3,Math.min(fL.n-lc-2,14),h-2,h,o.sign);}
        rtu(g,u0+du*.25,v0+dv*.25,h,false);
      });};
    // 崗亭＋柵欄臂：arm＝'u'（臂沿 u）|'v'
    // 崗亭＋柵欄臂：aA＝臂根（u,v）、aB＝臂端（u,v）
    const booth=(S,u,v,aA,aB,d)=>{const dd=d!=null?d:u+v+.12;S.o(dd,(g,n)=>{boxZ(g,u,v,.11,.11,0,8,'#e9e9e4','#dcdcd6','#a9aaa6');
        winL(g,u+.02,v+.11,4,3,3,'#3f5f78');winR(g,u+.11,v+.08,4,2,3,'#34506a');if(n){winL(n,u+.02,v+.11,4,3,3,'#ffe2a0');}
        boxZ(g,u-.015,v-.015,.14,.14,8,2,'#cfd2d0','#b9bcba','#8e9190');});
      if(aA)S.t(Math.max(dd,aA[0]+aA[1],aB[0]+aB[1])+.01,(g)=>{const a=P(aA[0],aA[1],5),b=P(aB[0],aB[1],5),r=P(aA[0],aA[1],0);
        RC(g,r[0]-1,r[1]-5,2,5,'#5d6468');const N=Math.max(4,rnd(Math.hypot(b[0]-a[0],b[1]-a[1])));for(let s=0;s<=N;s++){const t=s/N;RC(g,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,1,1,(s>>1)%2?'#c33b2e':'#f2f0ea');}});};

    // ---------- 冷鏈構件 ----------
    // 隔熱板冷庫：白／淺灰夾芯板、豎向板縫、下段保護牆（勒腳）、壓頂；幾乎無窗
    const CS=(S,o)=>{const u0=o.u0,v0=o.v0,du=o.du,dv=o.dv,h=o.h,u1=u0+du,v1=v0+dv;
      const wl=o.wl||'#eceeee',wr=o.wr||'#b9c1c5',rf=o.rf||'#dde1e2',acc=('acc' in o)?o.acc:'#5c8cae';
      S.o(o.d!=null?o.d:u0+v1-.02,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,h,rf,wl,wr);
        const fl=FA('L',v1,u0,u1),fr=FA('R',u1,v1,v0);
        const skin=(f,c,a)=>{const js=o.js||4;for(let i=js;i<f.n-1;i+=js)FR(g,f,i,i+1,3,h-1,SH(c,-10));
          if(o.hj!==false)for(let z=12;z<h-4;z+=12)FR(g,f,0,f.n,z,z+1,SH(c,-8));
          if(o.gz)for(let z=o.gz;z<h-5;z+=o.gz){FR(g,f,0,f.n,z,z+1,SH(c,-22));FR(g,f,0,f.n,z+1,z+2,SH(c,6));}   // 牆面檁條（水平壓條線）
          FR(g,f,0,f.n,0,3,f===fl?'#b3b0a6':'#8d8a82');FR(g,f,0,f.n,3,4,SH(c,-22));           // 防撞勒腳
          if(a)FR(g,f,0,f.n,h-3-(o.accW||1),h-3,a);
          FR(g,f,0,f.n,h-1,h,SH(c,12));};
        skin(fl,wl,acc);skin(fr,wr,acc&&SH(acc,-30));
        flat(g,u0+.025,v0+.025,du-.05,dv-.05,SH(rf,-5),h);
        BL(g,P(u0+.025,v0+.025,h),P(u1-.025,v0+.025,h),SH(rf,-22));BL(g,P(u0+.025,v0+.025,h),P(u0+.025,v1-.025,h),SH(rf,-16));
        if(o.roof)o.roof(g,n,h);
        if(o.docks){const dk=o.docks,f=dk.face==='L'?fl:fr;
          dk.at.forEach((t,k)=>dock(g,n,f,col(f,t)-2,{open:dk.open&&dk.open[k],dh:dk.dh||9,lamp:dk.lamp,dc:dk.face==='L'?'#c9d3d8':'#98a3a8'}));}
        if(o.pdoors)for(const[fc,t]of o.pdoors){const f=fc==='L'?fl:fr;pdoor(g,f,col(f,t)-1,fc==='L'?'#6d8797':'#556b78');}
        if(o.wall)o.wall(g,n,fl,fr);
      });};
    // 冷凝機組：沿 ax 的一排風扇（機架腳＋外殼＋頂面風扇）；z＝所在屋頂高
    const cond=(g,u0,v0,du,dv,z,nf,ax='u')=>{
      for(const t of[.02,.5,.98]){const pu=ax==='u'?u0+du*t:u0+du-.02,pv=ax==='u'?v0+dv-.02:v0+dv*t;const p=P(pu,pv,z);RC(g,p[0],p[1]-2,1,2,'#596166');}
      boxZ(g,u0,v0,du,dv,z+2,6,'#b3bbbf','#cdd3d6','#8b9498');
      const l=FA('L',v0+dv,u0,u0+du),r=FA('R',u0+du,v0+dv,v0);
      for(let i=1;i<l.n-1;i+=2)FR(g,l,i,i+1,z+3,z+7,'#aab2b6');for(let i=1;i<r.n-1;i+=2)FR(g,r,i,i+1,z+3,z+7,'#737c80');   // 側面格柵（盤管）
      FR(g,l,0,l.n,z+2,z+3,'#9aa2a6');
      for(let k=0;k<nf;k++){const cu=ax==='u'?u0+du*(k+.5)/nf:u0+du/2,cv=ax==='u'?v0+dv/2:v0+dv*(k+.5)/nf;const p=P(cu,cv,z+8);
        ell(g,p[0],p[1],3,1,'#394146');ell(g,p[0],p[1],2,1,'#4f595f');RC(g,p[0],p[1],1,1,'#b7bfc2');RC(g,p[0]-3,p[1],1,1,'#dfe4e6');}};
    // 氨製冷機房：混凝土塊＋百葉＋排氣風機＋放散管；NH3 標示
    const eng=(S,o)=>{const u0=o.u0,v0=o.v0,du=o.du,dv=o.dv,h=o.h,u1=u0+du,v1=v0+dv;
      S.o(o.d!=null?o.d:u0+v1-.01,(g,n)=>{boxZ(g,u0,v0,du,dv,0,h,'#a9aca8','#d9d5cb','#a8a49a');
        flat(g,u0+.025,v0+.025,du-.05,dv-.05,'#9da09c',h);
        const fl=FA('L',v1,u0,u1),fr=FA('R',u1,v1,v0);
        FR(g,fl,0,fl.n,0,2,'#b2ada1');FR(g,fr,0,fr.n,0,2,'#8b877e');
        // 百葉（兩片）＋鋼門＋小窗＋NH3 菱形
        const lv=(f,i,w,c)=>{FR(g,f,i,i+w,4,h-3,SH(c,-34));for(let z=5;z<h-3;z+=2)FR(g,f,i,i+w,z,z+1,SH(c,-12));};
        if(o.louverL!==false){lv(fl,2,6,'#d9d5cb');if(fl.n>16)lv(fl,fl.n-8,6,'#d9d5cb');}
        lv(fr,2,Math.min(6,fr.n-4),'#a8a49a');
        pdoor(g,fl,Math.floor(fl.n/2)-1,'#6b6f73');
        const wi=Math.floor(fl.n/2)+3;if(wi+3<fl.n-9){FR(g,fl,wi,wi+3,h-6,h-4,'#4d6f88');if(n)FR(n,fl,wi,wi+3,h-6,h-4,'#ffe3a0');}
        const sg=Math.floor(fl.n/2)-1;FR(g,fl,sg+1,sg+2,9,10,'#f1f1ec');FR(g,fl,sg,sg+3,8,9,'#f1f1ec');FR(g,fl,sg+1,sg+2,7,8,'#f1f1ec');FR(g,fl,sg+1,sg+2,8,9,'#2f6fb0');
        // 屋頂排氣風機
        if(o.fan!==false){const c=P(u0+du*.35,v0+dv*.5,h);boxZ(g,u0+du*.35-.05,v0+dv*.5-.05,.1,.1,h,2,'#9aa2a6','#b1b8bb','#7a8286');ell(g,c[0],c[1]-2,2,1,'#4c555a');}
        // 放散管（兩根細管，頂帶雨帽）
        if(o.vent!==false)for(const[t,hh]of[[.75,14],[.84,11]]){const p=P(u0+du*t,v0+dv*.3,h);RC(g,p[0],p[1]-hh,1,hh,'#c3c9cc');RC(g,p[0]+1,p[1]-hh,1,hh,'#858d91');RC(g,p[0]-1,p[1]-hh-1,3,1,'#6c7478');}
        if(o.extra)o.extra(g,n,fl,fr);
      });};
    // 氨儲液器（臥式筒）：沿 u，鞍座
    const tank=(S,u,v,L=.3,d)=>S.o(d!=null?d:u+v+.1,(g)=>{
      for(const t of[.05,L-.08]){boxZ(g,u+t,v+.005,.03,.06,0,2,'#8e918d','#a3a6a2','#6f726f');}
      const a=P(u,v+.035,6),b=P(u+L,v+.035,6);
      fp(g,[[a[0]-1,a[1]-3],[b[0]-1,b[1]-3],[b[0]+1,b[1]+3],[a[0]+1,a[1]+3]],'#e1e4e4');
      BL(g,[a[0]-1,a[1]-3],[b[0]-1,b[1]-3],'#f4f6f6');BL(g,[a[0]+1,a[1]+2],[b[0]+1,b[1]+2],'#a7adb0');BL(g,[a[0]+1,a[1]+3],[b[0]+1,b[1]+3],'#8c9396');
      ell(g,b[0],b[1],2,3,'#b9bfc2');RC(g,b[0],b[1]-1,1,1,'#d8dddf');
      const m=P(u+L*.5,v+.035,6);RC(g,m[0]-1,m[1]-1,3,1,'#d6b243');});
    // 管架（細線層）：從 A 點沿路徑畫 2 根並行管
    const pipes=(S,pts,d,cols=['#c6ccce','#8f989c'])=>S.t(d,(g)=>{for(let i=0;i+1<pts.length;i++){const a=P(...pts[i]),b=P(...pts[i+1]);BL(g,a,b,cols[0]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],cols[1]);}});
    // 管架立柱：落地混凝土墩＋2px 鋼柱＋頂部橫擔（管子擱在橫擔上）；h＝管底高
    const rack=(S,u,v,h,d)=>S.t(d!=null?d:u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-1,4,2,'#9d9a91');RC(g,x-1,y-1,4,1,'#bcb8ae');
      RC(g,x,y-h,1,h-1,'#9aa3a8');RC(g,x+1,y-h,1,h-1,'#5f686d');
      RC(g,x-2,y-h,5,1,'#7c858a');RC(g,x-2,y-h+1,5,1,'#4c5459');});
    // 冷藏車插電樁：灰色小柱＋淺色插座箱＋橘色電纜（盤在柱上、垂一段到地）
    const plug=(S,u,v,d)=>S.t(d!=null?d:u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-1,3,1,'#55595c');
      RC(g,x,y-6,1,6,'#a7afb3');RC(g,x+1,y-6,1,6,'#626a6f');
      RC(g,x-1,y-9,3,3,'#d5dadc');RC(g,x+1,y-9,1,3,'#8e979b');RC(g,x-1,y-9,3,1,'#eef1f2');RC(g,x,y-8,1,1,'#3a9a58');
      RC(g,x-2,y-6,1,3,'#e8812f');RC(g,x-1,y-3,1,1,'#e8812f');RC(g,x+2,y-6,1,2,'#b9621f');RC(g,x+2,y-4,1,1,'#b9621f');RC(g,x-2,y-2,1,1,'#c86a22');});

    return{P,hsh,RC,BL,fp,Q,flat,boxZ,faceL,faceR,ribsL,ribsR,pg,winL,winR,FA,FR,col,ell,scene,shadow,
      MATS,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stallsV,stain,fence,truck,van,car,CARS,mast,lamp,tree,bush,
      dock,pdoor,canopyL,canopyR,rtu,skyRow,WH,gOffice,booth,CS,cond,eng,tank,pipes,rack,plug};
  };

  // 組裝：每類一個 K、每變體獨立畫布
  const build=(k,dims,layouts)=>{const[W,H,AX,AY,SZ]=dims;const K=A.iso575(W,H,AX,AY,SZ);K.W=W;K.H=H;const L=LIB(K),order=DEV[k]||null;
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      if(S.sh.length)L.shadow(g,S.sh,.2);
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}};
  const E=.04;

  // ================= k167 大型配送中心（3×3）=================
  try{
    const SZ=3;
    const bf=(L)=>(g)=>{L.fence(g,[E,E],[SZ-E,E]);L.fence(g,[E,E],[E,SZ-E]);};
    const K167=[
      // v0 經典 I 字倉：長向沿 u，卸貨門整排在左前（+v）面；門前卡車坪＋對面一排甩掛拖車車位；右端玻璃門廳辦公角＋員工停車；右後甩掛場
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stallsV,stain,truck,car,CARS,mast,lamp,tree,bush,WH,gOffice,booth,canopyL}=L;
        pave(g,'c',0,0,SZ,SZ,16701);
        pave(g,'d',.1,1.5,2.32,.36,16702);                  // 卸貨坪（混凝土）
        pave(g,'a',.1,1.86,2.9,.54,16703);                  // 卡車場車道（右端出閘口）
        pave(g,'a',.1,2.44,2.86,.36,16704);                 // 前側員工停車（背靠背兩排）
        pave(g,'a',2.42,.1,.54,.7,16705);                   // 右後甩掛場
        pave(g,'g',2.86,.82,.12,.7,16708);pave(g,'g',2.46,1.54,.5,.3,16706);pave(g,'g',.1,2.8,2.9,.2,16709);
        for(const u of[.1,1.2,2.3])pave(g,'g',u,2.46,.1,.32,16710+rnd(u*10));
        bf(L)(g);
        lineU(g,1.86,.1,2.42,YEL);dashU(g,2.13,.2,2.95,WHT,.12,.1);lineU(g,2.4,.1,2.96,'#d9d5c9');
        for(let k=0;k<10;k++){const u=.3+k*.2;L.BL(g,P(u-.06,1.52),P(u-.06,1.84),'#d9d5c9');}
        stallsU(g,.2,2.47,1.0,9,.3);stallsU(g,1.3,2.47,1.0,9,.3);stallsU(g,2.4,2.47,.55,5,.3);lineU(g,2.62,.2,2.95,WHT);
        for(const[u,v,r] of[[.6,2.0,3],[1.5,2.3,2],[2.1,1.95,3],[1.0,2.7,2],[2.7,.4,2]])stain(g,u,v,r);
        L.shadow(g,[['b',.14,.14,2.26,1.36,18],['b',2.4,.82,.45,.68,18]]);
        const doors=[...Array(10)].map((_,k)=>.3+k*.2),dockT=[0,2,3,6,8];
        WH(S,{u0:.14,v0:.14,du:2.26,dv:1.36,h:18,acc:'#3e6c96',
          docks:{face:'L',at:doors,open:doors.map((_,k)=>dockT.includes(k))},
          sky:[['u',.46,.35,2.2],['u',.76,.35,2.2],['u',1.06,.35,2.2]],hvac:[[.5,.22],[.95,.22,1],[1.45,.22],[1.9,.22,1],[.7,1.24],[1.6,1.24]],
          hatch:[[2.18,.58],[.42,1.2]],pdoors:[['R',.5]]});
        gOffice(S,{u0:2.4,v0:.82,du:.45,dv:.68,fl:2,seed:16711,lobby:8,entry:'R',sign:'#3e6c96'});
        const TC=['#c6463a','#e3e1da','#3f6a8e','#d8d4c8','#5b7a55'],TB=[null,'#3f6a8e',null,null,'#9a4a3c'];
        dockT.forEach((k,j)=>truck(S,doors[k]-.04,1.505,'v+',TC[j],'box',null,{stripe:j===2?'#3e6c96':null,body:TB[j]}));
        // 出場車：整台在場內、沿 u 軸，車頭停在閘口欄杆前
        truck(S,1.25,1.97,'u-','#c6463a','box',null,{stripe:'#3e6c96'});truck(S,2.1,2.19,'u+','#3f6a8e','box');
        for(let k=0;k<4;k++)truck(S,2.46,.16+k*.15,'u+',null,k===2?'reefer':'box',null,{body:k===1?'#3f6a8e':null});
        // 前側員工停車：兩排垂直停放（跳格），植栽島
        // 背靠背兩排：同一欄只停一排（前後錯開），車不互相壓住，每台都看得到車頂與擋風線
        for(let k=0;k<25;k++){const u=.2+k*.11;if(u>2.9||(u>1.18&&u<1.32)||(u>2.28&&u<2.42))continue;
          const r=L.hsh(16712,k,1);if(r>=.8)continue;const sd=r<.42?1:2;car(S,u+.017,sd===1?2.475:2.625,false,CARS[(k*3+sd)%CARS.length]);}
        booth(S,2.68,2.02,[2.74,2.13],[2.74,2.36]);
        // 停車島燈：原本 (2.38,2.44) 與 (2.35,2.5) 在畫面上只差 3px、疊成一根雙燈頭，刪去前者
        mast(S,.13,2.44,30);lamp(S,1.25,2.5,14);lamp(S,2.35,2.5,14);lamp(S,2.72,1.84);lamp(S,2.44,.84);
        // 前緣綠帶：喬木只種在植栽島正前方與兩端（不擋車位），其餘用低矮灌木
        for(const[u,v,s,k] of[[2.93,.9,.8,0],[2.93,1.2,.9,1],[2.93,1.45,.8,2],[2.6,1.7,.8,1],[2.85,1.72,.7,2],[.15,2.7,.8,0],[1.25,2.7,.8,2],[2.35,2.7,.8,1],[.14,2.9,.7,1],[2.92,2.92,.7,0]])tree(S,u,v,s,k);
        for(const u of[.45,.75,1.05,1.52,1.85,2.15,2.62])bush(S,u,2.9,2);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.63,.8]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
      // v1 縱向倉：長向沿 v，卸貨門整排在右前（+u）面；右側卡車場＋靠圍籬一排甩掛車位；前端（+v）玻璃門廳辦公樓＋前方員工停車；右前閘口
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stallsV,stain,truck,car,CARS,mast,lamp,tree,bush,WH,gOffice,booth,canopyR}=L;
        pave(g,'c',0,0,SZ,SZ,16721);
        pave(g,'d',1.5,.1,.34,2.3,16722);
        pave(g,'a',1.84,.1,.58,2.9,16723);
        pave(g,'a',2.42,.1,.54,2.2,16724);
        pave(g,'a',1.1,2.4,.74,.52,16725);
        pave(g,'g',.1,2.72,.98,.26,16726);pave(g,'g',2.46,2.34,.52,.62,16727);
        bf(L)(g);
        lineV(g,1.84,.1,2.4,YEL);dashV(g,2.13,.2,2.95,WHT,.12,.1);lineV(g,2.42,.1,2.3,YEL);
        for(let k=0;k<=10;k++){const v=.2+k*.2;L.BL(g,P(2.44,v),P(2.94,v),WHT);}
        for(let k=0;k<10;k++){const v=.3+k*.2;L.BL(g,P(1.52,v+.06),P(1.82,v+.06),'#d9d5c9');}
        stallsU(g,1.14,2.42,.68,5,.2);stallsU(g,1.14,2.7,.68,5,.2);
        for(const[u,v,r] of[[2.0,.6,3],[2.2,1.6,2],[1.95,2.2,3],[2.7,.5,2]])stain(g,u,v,r);
        L.shadow(g,[['b',.14,.14,1.36,2.26,18],['b',.14,2.4,.92,.34,19]]);
        const doors=[...Array(10)].map((_,k)=>.3+k*.2),dockT=[0,2,3,5,6,8];
        WH(S,{u0:.14,v0:.14,du:1.36,dv:2.26,h:18,acc:'#b8452f',wl:'#e0ddd3',wr:'#ada99f',seamAx:'v',
          docks:{face:'R',at:doors,open:doors.map((_,k)=>dockT.includes(k))},
          sky:[['v',.46,.3,1.2],['v',.76,.3,1.2],['v',1.06,.3,1.2]],hvac:[[.2,.4],[.2,.9,1],[1.24,.5,1],[1.26,1.05]],
          roof:(g2,n,h)=>{   // 屋頂太陽能板陣列（前半段）：沿 v 的長條、朝南傾斜，深藍面＋淺色格線
            for(let u=.26;u<1.3;u+=.14){L.boxZ(g2,u,1.36,.09,.84,h,2,'#3e668a','#2c4f6e','#20394f');
              for(let v=1.46;v<2.2;v+=.12)L.BL(g2,P(u,v,h+2),P(u+.09,v,h+2),'#6b93b3');L.BL(g2,P(u,1.36,h+2),P(u,2.2,h+2),'#7fa4c0');}},
          hatch:[[1.24,.76],[.6,.66]],pdoors:[['L',.4]]});
        gOffice(S,{u0:.14,v0:2.4,du:.92,dv:.3,fl:3,seed:16731,lobby:9,entry:'L',sign:'#b8452f'});
        const TC=['#3f6a8e','#c6463a','#e3e1da','#5b7a55','#d8d4c8','#b8452f'],TB=[null,null,'#8e969a',null,'#3f6a8e',null];
        dockT.forEach((k,j)=>truck(S,1.505,doors[k]-.04,'u+',TC[j%TC.length],j===3?'reefer':'box',null,{stripe:j===1||j===5?'#b8452f':null,body:TB[j]}));
        for(const k of[0,1,4,5,7,9])truck(S,2.45,.3+k*.2-.04,'u+',null,k===5?'reefer':'box',null,{stripe:k===0||k===7?'#b8452f':null,body:k===4?'#9a4a3c':null});
        truck(S,1.98,1.1,'v-','#3f6a8e','box');truck(S,2.2,2.3,'v+','#c6463a','box',null,{stripe:'#b8452f'});
        [[1.16,2.44],[1.3,2.44],[1.58,2.44],[1.72,2.44],[1.16,2.74],[1.44,2.74],[1.58,2.74]].forEach(([u,v],i)=>car(S,u,v,false,CARS[(i+3)%CARS.length]));
        booth(S,2.46,2.62,[2.44,2.62],[2.14,2.62]);
        // 兩支高桿燈：後桿移到卡車場右後角（與右側圍籬那支在畫面上錯開 17px，不再疊成同一根）
        mast(S,2.43,.14,32);mast(S,2.96,1.2,30);lamp(S,1.12,2.93);lamp(S,1.82,2.93);lamp(S,2.44,2.32);
        for(const[u,v,s,k] of[[.3,2.86,.9,0],[.62,2.9,.8,1],[.94,2.86,.9,2],[2.7,2.55,.9,1],[2.9,2.8,.8,0],[2.62,2.88,.7,2]])tree(S,u,v,s,k);
        bush(S,2.8,2.4);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.6,.82]]);}};
      },
      // v2 雙棟：後側通長主倉（門朝前）＋左端突出的玻璃辦公角；中央卡車場；前方第二棟＝最後一哩分揀站（小門＋一排配送廂車）；左前員工停車；右側閘口
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashU,dashV,YEL,WHT,stallsU,stallsV,stain,truck,van,car,CARS,mast,lamp,tree,bush,WH,gOffice,booth,canopyL}=L;
        pave(g,'c',0,0,SZ,SZ,16741);
        pave(g,'d',.66,1.16,2.3,.3,16742);
        pave(g,'a',.66,1.46,2.34,.56,16743);
        pave(g,'a',1.3,2.44,1.66,.48,16744);
        pave(g,'a',.1,1.58,.54,1.34,16745);pave(g,'a',.64,2.06,.62,.86,16746);
        pave(g,'g',.1,2.93,2.9,.07,16747);
        bf(L)(g);
        lineU(g,1.46,.66,2.96,YEL);dashU(g,1.74,.7,2.98,WHT,.12,.1);lineU(g,2.02,.66,2.96,YEL);
        for(let k=0;k<10;k++){const u=.85+k*.2;L.BL(g,P(u-.06,1.17),P(u-.06,1.44),'#d9d5c9');}
        for(let k=0;k<9;k++){const u=1.45+k*.16;L.BL(g,P(u-.05,2.44),P(u-.05,2.7),WHT);}
        stallsU(g,.14,1.6,.46,3,.2);stallsU(g,.14,2.1,1.08,7,.2);stallsU(g,.14,2.5,1.08,7,.2);
        for(const[u,v,r] of[[1.2,1.6,3],[2.3,1.8,2],[2.6,2.7,2],[.4,2.4,2]])stain(g,u,v,r);
        L.shadow(g,[['b',.14,.14,2.72,1.02,18],['b',.14,1.16,.5,.36,18],['b',1.34,2.06,1.58,.36,11]]);
        const doors=[...Array(10)].map((_,k)=>.85+k*.2),dockT=[0,1,2,4,5,7,9];
        WH(S,{u0:.14,v0:.14,du:2.72,dv:1.02,h:18,acc:'#4f8a5c',wl:'#d8dbd9',wr:'#a6aaa9',rf:'#c7cac8',
          docks:{face:'L',at:doors,open:doors.map((_,k)=>dockT.includes(k))},
          sky:[['u',.4,.3,2.75],['u',.62,.3,2.75],['u',.84,.3,2.75]],hvac:[[.4,.2],[.9,.2,1],[1.5,.2],[2.1,.2,1],[2.6,.2],[1.2,1.0,1],[2.3,1.0]],
          hatch:[[2.68,.49],[1.75,.94]],pdoors:[['R',.6]]});
        gOffice(S,{u0:.14,v0:1.16,du:.5,dv:.36,fl:2,seed:16751,lobby:7,entry:'L',sign:'#4f8a5c',d:.14+1.16+.37});
        const TC=['#4f8a5c','#e3e1da','#c6463a','#3f6a8e','#d8d4c8','#5b7a55','#b8452f'];
        dockT.forEach((k,j)=>truck(S,doors[k]-.04,1.165,'v+',TC[j%TC.length],j===3?'reefer':'box',null,{stripe:j%2?'#4f8a5c':null}));
        truck(S,1.4,1.78,'u+','#3f6a8e','box');
        // 第二棟：分揀站（較矮），+v 面一排小門；深度排在卡車場所有車之後、配送廂車之前
        const vdoors=[...Array(9)].map((_,k)=>1.45+k*.16);
        WH(S,{u0:1.34,v0:2.06,du:1.58,dv:.36,h:11,acc:'#4f8a5c',wl:'#e3e4e1',wr:'#b0b3b1',rf:'#c3c6c4',hatch:[[1.44,2.24]],
          docks:{face:'L',at:vdoors,open:vdoors.map((_,k)=>k%2===0),dh:7},hvac:[[1.6,2.14],[2.3,2.14]],sky:[['u',2.22,1.9,2.8,.12,.05]],d:4.6});
        vdoors.forEach((t,k)=>{if(k%2===0)van(S,t-.037,2.425,'v+','#e9ecea',k%4?'#4f8a5c':'#d17a2e',5+t);});
        van(S,2.2,2.78,'u-','#eef0f0','#d17a2e',6);
        [[.16,1.62],[.44,1.62],[.16,2.12],[.44,2.12],[.58,2.12],[1.0,2.12],[.3,2.52],[.58,2.52],[.86,2.52],[1.14,2.52]].forEach(([u,v],i)=>car(S,u,v,false,CARS[(i+5)%CARS.length]));
        booth(S,2.8,1.3,[2.9,1.46],[2.9,1.72]);
        // 辦公角旁原有兩支燈擠在一起：高桿燈移到分揀站後方、卡車場中段（空著的 4 號門前，桿身落在兩台靠台車之間）；小燈移到停車場左緣
        mast(S,1.84,2.04,30);mast(S,2.96,1.5,32);lamp(S,.12,2.0);lamp(S,1.28,2.9);lamp(S,.12,2.46,15);
        for(const[u,v,s,k] of[[.2,2.97,.7,0],[.6,2.97,.8,1],[1.0,2.97,.7,2]])tree(S,u,v,s,k);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.49,.67]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
    ];
    build(167,[208,220,104,218,SZ],K167);
  }catch(e){console.error('logi_c k167',e);errs.push('k167:'+(e&&e.stack||e));}

  // ================= k168 冷鏈倉儲（2×2）=================
  try{
    const SZ=2;
    const bf=(L)=>(g)=>{L.fence(g,[E,E],[SZ-E,E]);L.fence(g,[E,E],[E,SZ-E]);};
    const K168=[
      // v0 前置低溫理貨區：後側大冷庫（屋頂冷凝機組一排）＋前方較矮的理貨月台（整排門封＋雨遮）＋冷凍車靠台；右側氨機房＋儲液器；右前小停車
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashU,YEL,WHT,stallsV,stain,truck,car,CARS,lamp,tree,bush,CS,cond,eng,tank,pipes,canopyL,plug,booth,flat,BL}=L;
        pave(g,'c',0,0,SZ,SZ,16801);
        pave(g,'a',.1,1.22,1.35,.7,16802);pave(g,'a',1.45,.76,.51,1.16,16803);
        pave(g,'g',.1,1.9,1.35,.1,16804);
        bf(L)(g);
        for(let k=0;k<4;k++){const u=.3+k*.3;L.BL(g,P(u-.06,1.24),P(u-.06,1.8),'#d9d5c9');}
        lineU(g,1.8,.1,1.45,YEL);stallsV(g,1.5,.82,.42,3,.18);stallsV(g,1.71,.82,.28,2,.18);
        stain(g,.7,1.6,2);
        // 右前角：進場車道上的地磅（鋼板台面＋混凝土框＋黃色端線）＋兩格冷藏拖車候車位（黃框、一格停著甩掛冷藏拖車並插著電）
        {const u0=1.5,v0=1.32,du=.28,dv=.15;flat(g,u0-.015,v0-.015,du+.03,dv+.03,'#a8a59b');flat(g,u0,v0,du,dv,'#7b8387');
          for(let t=u0+.07;t<u0+du-.01;t+=.07)BL(g,P(t,v0),P(t,v0+dv),'#687074');BL(g,P(u0,v0+dv),P(u0+du,v0+dv),'#aab2b6');
          BL(g,P(u0,v0),P(u0,v0+dv),YEL);BL(g,P(u0+du,v0),P(u0+du,v0+dv),YEL);}
        for(const v of[1.6,1.75,1.9])lineU(g,v,1.48,1.94,YEL);lineV(g,1.48,1.6,1.9,YEL);
        dashU(g,1.825,1.54,1.9,'#c9a63e',.06,.06);
        L.shadow(g,[['b',.12,.12,1.33,.8,24],['b',.12,.92,1.33,.3,12],['b',1.45,.12,.43,.5,14]]);
        CS(S,{u0:.12,v0:.12,du:1.33,dv:.8,h:24,roof:(g2,n,h)=>{cond(g2,.3,.3,.95,.16,h,5,'u');L.rtu(g2,.2,.6,h,false);}});
        const doors=[.3,.6,.9,1.2];
        CS(S,{u0:.12,v0:.92,du:1.33,dv:.3,h:14,acc:null,hj:false,docks:{face:'L',at:doors,open:[1,1,0,1],dh:9,lamp:false},js:6,d:.12+1.22});
        eng(S,{u0:1.45,v0:.12,du:.43,dv:.5,h:14,fan:false,extra:(g2,n)=>{cond(g2,1.5,.2,.32,.16,14,2,'u');}});
        tank(S,1.52,.66,.3);
        pipes(S,[[1.47,.36,14],[1.47,.36,25],[1.26,.36,25]],1.45+.62);
        const TC=['#2f5d8a','#e3e1da','#3f7f9a'];
        [0,1,3].forEach((k,j)=>truck(S,doors[k]-.04,1.225,'v+',TC[j],'reefer',null,{stripe:'#5c8cae'}));
        canopyL(S,.18,1.4,1.22,.07,13,2.8,doors);
        [[1.5,.84],[1.5,.98],[1.5,1.12],[1.73,.84],[1.73,.98]].forEach(([u,v],i)=>car(S,u,v,true,CARS[(i+2)%CARS.length]));
        booth(S,1.76,1.12,[1.82,1.25],[1.82,1.53]);
        // 候車位上的甩掛冷藏拖車（前端冷凍機朝 -u）＋插電樁；靠台車之間也各一支插電樁
        truck(S,1.355,1.625,'u-',null,'reefer',null,{stripe:'#5c8cae'});plug(S,1.53,1.77,3.5);
        plug(S,.45,1.7);plug(S,1.1,1.68);   // 第二支移到 3 號車左側，免得跟候車位那支在畫面上疊成一對
        lamp(S,1.47,1.26);lamp(S,.47,1.9);lamp(S,1.9,.78);
        // 前緣綠帶：喬木只種在沒有靠台車的門前與左角，車頭正前方改種低矮灌木（不擋冷凍車）
        for(const[u,v,s,k] of[[.16,1.95,.7,0],[.84,1.96,.7,1],[1.03,1.95,.7,2]])tree(S,u,v,s,k);
        for(const u of[.3,.62,1.22])bush(S,u,1.95,2);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.63,.79]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
      // v1 高架自動倉：左後一棟高聳的自動倉（豎向板縫、頂部警示燈、樓梯核）＋右側較矮的出入庫月台（冷凝機組在其屋頂）＋冷凍車靠台；左前氨機房
      // 高架倉身分：整面無窗、只有水平檁條（每 7px）＋品牌色帶；樓梯間獨立成一座窄塔（凸出高架倉前面約 4px，只開細縫窗、夜間只有它亮）；
      // 高架倉右牆伸出一座有頂輸送橋，跨過月台屋面接進屋頂上的轉運小間（輸送橋兩端都有著落，下有短撐腳）
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashU,YEL,WHT,stallsU,stallsV,stain,truck,car,CARS,lamp,tree,bush,CS,cond,eng,tank,pipes,canopyL,FR,FA,boxZ,plug}=L;
        pave(g,'c',0,0,SZ,SZ,16821);
        pave(g,'a',.66,1.0,1.3,.8,16822);pave(g,'g',.66,1.8,1.3,.12,16828);
        pave(g,'g',.1,1.42,.56,.5,16823);pave(g,'g',.1,1.92,1.9,.08,16824);pave(g,'c',.1,1.3,.56,.12,16825);
        bf(L)(g);
        for(let k=0;k<3;k++){const u=1.05+k*.3;L.BL(g,P(u-.06,1.02),P(u-.06,1.56),'#d9d5c9');}
        lineU(g,1.58,.66,1.56,YEL);dashU(g,1.68,.7,1.94,WHT,.1,.08);lineU(g,1.78,.66,1.96,'#d9d5c9');
        // 右前角員工停車：兩欄橫向車位（車沿 u 停），與卸貨門錯開
        pave(g,'a',1.54,1.02,.42,.56,16827);stallsV(g,1.56,1.04,.52,4,.16);stallsV(g,1.76,1.04,.52,4,.16);lineV(g,1.54,1.04,1.56,YEL);
        stain(g,1.1,1.7,2);stain(g,.95,1.3,2);
        L.shadow(g,[['b',.12,.12,.74,.88,54],['b',.62,1.0,.2,.11,54],['b',.86,.12,1.02,.88,14],['b',.12,1.0,.5,.3,11]]);
        CS(S,{u0:.12,v0:.12,du:.74,dv:.88,h:54,js:99,hj:false,gz:7,acc:'#2f6fb0',accW:2,d:.12+1.0-.02,
          roof:(g2,n,h)=>{const r=P(.2,.2,h);L.RC(g2,r[0],r[1]-2,1,2,'#7d858a');L.RC(g2,r[0],r[1]-3,1,1,'#d0392c');if(n)L.RC(n,r[0],r[1]-3,1,1,'#ff5a48');
            const r2=P(.2,.94,h);L.RC(g2,r2[0],r2[1]-2,1,2,'#7d858a');L.RC(g2,r2[0],r2[1]-3,1,1,'#d0392c');if(n)L.RC(n,r2[0],r2[1]-3,1,1,'#ff5a48');
            L.boxZ(g2,.3,.3,.2,.14,h,3,'#b9c0c3','#cdd3d5','#8f979b');}});
        // 樓梯塔：與高架倉同高（頂緣一圈壓頂），凸出前牆約 4px；兩面各一列細縫窗，底部一扇鋼門
        CS(S,{u0:.62,v0:1.0,du:.2,dv:.11,h:54,js:99,hj:false,acc:'#2f6fb0',accW:2,d:.62+1.11-.02,rf:'#cfd5d7',
          wall:(g2,n,fl,fr)=>{const sl=(f,i,c)=>{for(let z=9;z<48;z+=7){FR(g2,f,i,i+1,z,z+3,c);if(n)FR(n,f,i,i+1,z,z+3,'#ffe3a0');}};
            sl(fl,Math.floor(fl.n/2),'#3e5a6e');sl(fr,Math.floor(fr.n/2),'#2e4454');
            FR(g2,fl,1,fl.n-1,0,7,'#34383c');FR(g2,fl,2,fl.n-2,0,6,'#6d8797');}});
        const doors=[1.05,1.35];
        CS(S,{u0:.86,v0:.12,du:1.02,dv:.88,h:14,hj:false,docks:{face:'L',at:doors,open:[1,1],dh:9,lamp:false},pdoors:[['L',1.7]],js:5,
          roof:(g2,n,h)=>{cond(g2,1.38,.22,.44,.16,h,4,'u');
            // 輸送橋：高架倉右牆 z18–23 → 月台屋頂轉運小間；兩支短撐腳落在月台屋面
            for(const t of[.95,1.06]){const p=P(t,.64,h);L.RC(g2,p[0],p[1]-4,1,4,'#6f787c');}
            boxZ(g2,.86,.52,.28,.12,h+4,5,'#c3cacd','#e3e7e8','#a3acb0');
            const f=FA('L',.64,.86,1.14);for(let i=1;i<f.n;i+=2)FR(g2,f,i,i+1,h+5,h+9,'#cfd5d7');FR(g2,f,0,f.n,h+7,h+8,'#2f6fb0');FR(g2,f,0,f.n,h+4,h+5,'#9aa3a7');
            boxZ(g2,1.14,.46,.16,.26,h,11,'#c9d0d3','#e6eaeb','#a7b0b4');
            const t2=FA('L',.72,1.14,1.3);FR(g2,t2,0,t2.n,h+7,h+8,'#2f6fb0');FR(g2,t2,1,3,h,h+5,'#8a9499');}});
        eng(S,{u0:.12,v0:1.0,du:.5,dv:.3,h:11,louverL:true});
        tank(S,.2,1.32,.28,.2+1.32+.2);
        [0,1].forEach((k,j)=>truck(S,doors[k]-.04,1.005,'v+',['#e3e1da','#2f5d8a'][j],'reefer',null,{stripe:'#2f6fb0'}));
        canopyL(S,.92,1.5,1.0,.07,13,2.6,doors);
        plug(S,1.2,1.52);plug(S,.93,1.52);
        // 員工車位移到右前角（原本擠在左前角機房旁）
        [[1.57,0],[1.57,1],[1.57,3],[1.77,0],[1.77,2]].forEach(([u,k],i)=>car(S,u,1.068+k*.13,true,CARS[(i*4+1)%CARS.length]));
        lamp(S,.64,1.9);lamp(S,1.94,1.02);
        for(const[u,v,s,k] of[[.22,1.62,.8,0],[.2,1.96,.7,1],[.52,1.96,.7,2],[1.0,1.88,.7,1],[1.62,1.88,.7,0]])tree(S,u,v,s,k);
        bush(S,.36,1.5);bush(S,.58,1.66,2);for(const u of[.8,1.2,1.4,1.85])bush(S,u,1.87,2);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.78,.88]]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E]);}};
      },
      // v2 雙棟：左側前後兩棟冷庫（後高前矮，中間以封閉連廊＋機房相接），卸貨門都在右前（+u）面、各自雨遮；右側卡車通道＋冷凍車；前緣綠帶
      (g,ng,S,L)=>{const{P,pave,lineU,lineV,dashV,YEL,WHT,stallsU,stain,truck,car,CARS,lamp,tree,bush,CS,cond,eng,tank,pipes,canopyR,boxZ,FA,FR,rack,plug}=L;
        pave(g,'c',0,0,SZ,SZ,16841);
        pave(g,'a',1.0,.1,.96,1.82,16842);
        pave(g,'g',.1,1.8,.9,.2,16843);
        bf(L)(g);
        for(const v of[.3,.6,1.2,1.5])L.BL(g,P(1.02,v+.06),P(1.58,v+.06),'#d9d5c9');
        lineV(g,1.6,.1,1.92,YEL);
        stain(g,1.3,.95,2);stain(g,1.75,1.5,2);
        L.shadow(g,[['b',.12,.12,.88,.66,26],['b',.12,.98,.88,.76,16],['b',.12,.78,.66,.2,12],['b',1.62,.12,.28,.44,12]]);
        CS(S,{u0:.12,v0:.12,du:.88,dv:.66,h:26,acc:'#3f7f9a',docks:{face:'R',at:[.3,.6],open:[0,1],dh:9,lamp:false},
          roof:(g2,n,h)=>{cond(g2,.25,.2,.16,.46,h,3,'v');L.rtu(g2,.6,.3,h,true);}});
        // 兩棟之間的內縮連接體（凹進 .22，右側看得出兩棟分開）
        CS(S,{u0:.12,v0:.78,du:.66,dv:.2,h:12,acc:null,hj:false,js:4,d:.12+.98-.03,
          wall:(g2,n,fl,fr)=>{FR(g2,fr,2,fr.n-2,6,8,'#5c7688');if(n)FR(n,fr,3,5,6,8,'#ffe3a0');}});
        CS(S,{u0:.12,v0:.98,du:.88,dv:.76,h:16,acc:'#3f7f9a',docks:{face:'R',at:[1.2,1.5],open:[1,1],dh:9,lamp:false},js:4,
          roof:(g2,n,h)=>{cond(g2,.25,1.1,.5,.16,h,3,'u');}});
        eng(S,{u0:1.62,v0:.12,du:.28,dv:.44,h:12,louverL:false});
        tank(S,1.6,.6,.28);
        // 機房→後棟的架空管：兩支落地管架立柱承托（第二支的柱腳在機房後方）
        rack(S,1.14,.16,15);rack(S,1.38,.16,15);
        pipes(S,[[1.62,.16,12],[1.62,.16,17],[1.0,.16,17]],1.62+.3);
        canopyR(S,.72,.18,1.0,.07,13,1.9,[.3,.6]);canopyR(S,1.66,1.04,1.0,.07,13,2.8,[1.2,1.5]);
        truck(S,1.005,.56,'u+','#2f5d8a','reefer',null,{stripe:'#3f7f9a'});
        plug(S,1.5,.74);plug(S,1.5,1.35);
        truck(S,1.005,1.16,'u+','#e3e1da','reefer',null,{stripe:'#3f7f9a'});truck(S,1.005,1.46,'u+','#c6463a','reefer',null,{stripe:'#3f7f9a'});
        truck(S,1.7,.86,'v-','#3f7f9a','reefer',null,{stripe:'#3f7f9a'});
        lamp(S,1.93,.66);lamp(S,1.94,1.9);lamp(S,1.02,.9);   // 機房前那盞移到右側圍籬邊，跟插電樁分開
        for(const[u,v,s,k] of[[.2,1.9,.8,0],[.5,1.93,.7,1],[.8,1.9,.8,2]])tree(S,u,v,s,k);
        bush(S,.35,1.82);bush(S,.66,1.84);
        return{front:(g2)=>{L.fence(g2,[SZ-E,E],[SZ-E,SZ-E]);L.fence(g2,[E,SZ-E],[SZ-E,SZ-E],[[.8,.98]]);}};
      },
    ];
    build(168,[136,150,68,148,SZ],K168);
  }catch(e){console.error('logi_c k168',e);errs.push('k168:'+(e&&e.stack||e));}

  if(errs.length)window.__logi_c_errs=errs;
});
