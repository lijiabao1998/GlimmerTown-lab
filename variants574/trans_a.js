// T612 trans_a：k139 高速鐵路車站（5×5，畫布 336×420 錨 168,418）／k55 中央車站（3×3，畫布 208×220 錨 104,218），實驗線重畫。
// 分層合成（沿用 T609 logi_a 的做法）：地坪（鋪面、軌道、月台、落影）直接畫在地面層；立體件走分層場景——每件各自二值化＋深色外框，
// 依深度由後往前疊；細線（接觸網、欄杆、人）走不描邊層。夜圖「先有燈具才有光」：只點白天畫出的燈具、窗、月台燈、車窗、車燈；
// 被前景實體擋住的燈會被擦掉。光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh 決定性雜湊。
// 軌道一律沿佔地一軸畫到佔地邊緣，軌道中心盡量落在格中心（x.5），與遊戲鐵軌同一套 2:1 等距，相鄰地塊接得上。
(window.__variants574=window.__variants574||[]).push(function trans_a(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{139:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位；定稿必須是 {}
  const DEV_THROW=false;   // 迭代用；定稿為 false（錯誤仍記在 window.__trans_a_errs）
  const errs=[];
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w,o.h,o.ax,o.ay]:d;};

  // ================= 共用工具 =================
  const LIB=(K,W,H)=>{
    const {P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<4000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
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
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    // 牆面直條（窗框、壁柱）：+v 面沿 u、+u 面沿 v
    const ribsL=(g,ua,ub,v,za,zb,c,step=2,off=1)=>{const a=P(ua,v,zb),b=P(ub,v,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const ribsR=(g,u,va,vb,za,zb,c,step=2,off=1)=>{const a=P(u,vb,zb),b=P(u,va,zb);for(let X=Math.ceil(a[0]-.5)+off;X<Math.ceil(b[0]-.5)-1;X+=step){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);RC(g,X,y+1,1,zb-za-2,c);}};
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55,nc='#ffe3a0')=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,.5,glass);pg(g,X,Y,w,1,.5,SH(glass,30));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,nc);}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5,nc='#f3d68e')=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,nc);}};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#b9b5aa',s:.25,p:.6},      // 混凝土
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      k:{t:['#a39e92','#9c978b','#aba69a'],j:null,s:.0625,p:.5},         // 碎石
      q:{t:['#a8a397','#a39e92','#ada89c'],j:null,s:.125,p:.7},          // 細碎石（低顆粒密度，T612 k55 v2 退件修）
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
      b:{t:['#ab9e8c','#a49784','#b3a695'],j:null,s:.0625,p:.55},        // 道碴
      z:{t:['#d4cdbd','#cec7b7','#d9d2c2'],j:'#c6bfaf',s:.25,p:.55},     // 廣場石材鋪面（淺暖灰）
      r:{t:['#b58f78','#ad8770','#bd9780'],j:'#a47f69',s:.25,p:.55},     // 紅磚鋪面
      s:{t:['#cbc7bd','#c6c2b8','#d0ccc2'],j:null,s:.25,p:.6},           // 人行道
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*16);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62605c':'#7a7873');}}
      if(m==='q'){for(let i=0;i<rnd(du*dv*14);i++){const p=P(u0+hsh(seed,i,51)*du,v0+hsh(seed,i,52)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,53)<.5?'#979286':'#b7b2a6');}}
      if(m==='k'){for(let i=0;i<rnd(du*dv*60);i++){const p=P(u0+hsh(seed,i,51)*du,v0+hsh(seed,i,52)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,53)<.5?'#8f8a7e':'#bab5a8');}}
      if(m==='b'){for(let i=0;i<rnd(du*dv*70);i++){const p=P(u0+hsh(seed,i,56)*du,v0+hsh(seed,i,57)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,58)<.5?'#8e8171':'#c3b8a8');}}
      if(m==='g'){for(let i=0;i<rnd(du*dv*30);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const YEL='#d6b243',WHT='#e6e2d6';
    // 鐵軌：道碴床（兩肩壓暗）＋深色枕木（每 4px 一根）＋亮色雙軌；c＝軌道中心、軌距 4px
    const GA=.125;
    const rail2=(g,a,b)=>{BL(g,[a[0],a[1]+1],[b[0],b[1]+1],'#383e42');BL(g,a,b,'#e2e5e6');};
    const track=(g,ax,c,b0,b1,seed,bed=true)=>{const r0=c-GA/2,r1=c+GA/2;
      const pt=(b,a)=>ax==='u'?P(b,a):P(a,b);
      if(bed){if(ax==='u')pave(g,'b',b0,c-.14,b1-b0,.28,seed);else pave(g,'b',c-.14,b0,.28,b1-b0,seed);
        BL(g,pt(b0,c-.14),pt(b1,c-.14),'#8b7e6f');BL(g,pt(b0,c+.14),pt(b1,c+.14),'#7f7365');}
      for(let b=b0+.03;b<b1-.01;b+=.125)BL(g,pt(b,c-.1),pt(b,c+.1),'#6b5a49');
      rail2(g,pt(b0,r0),pt(b1,r0));rail2(g,pt(b0,r1),pt(b1,r1));};
    // 月台（高 3px）：頂面淺灰、邊緣白線＋黃色導盲磚；ax＝長向
    const platform=(g,ax,a0,a1,b0,b1,o={})=>{const h=o.h||3,top=o.top||'#d3d0c8';
      if(ax==='u'){boxZ(g,b0,a0,b1-b0,a1-a0,0,h,top,'#aaa59b','#8f8a80');
        lineU(g,a0+.012,b0,b1,SH(top,-24));lineU(g,a1-.02,b0,b1,'#eeece6');lineU(g,a0+.05,b0+.02,b1-.02,'#d8b640');lineU(g,a1-.055,b0+.02,b1-.02,'#d8b640');}
      else{boxZ(g,a0,b0,a1-a0,b1-b0,0,h,top,'#aaa59b','#8f8a80');
        lineV(g,a0+.012,b0,b1,SH(top,-24));lineV(g,a1-.02,b0,b1,'#eeece6');lineV(g,a0+.05,b0+.02,b1-.02,'#d8b640');lineV(g,a1-.055,b0+.02,b1-.02,'#d8b640');}};
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const zebraU=(g,u0,u1,v0,v1)=>{for(let u=u0;u<u1-.01;u+=.07)flat(g,u,v0,.035,v1-v0,'#e8e5dc');};
    const zebraV=(g,v0,v1,u0,u1)=>{for(let v=v0;v<v1-.01;v+=.07)flat(g,u0,v,u1-u0,.035,'#e8e5dc');};
    const curb=(g,u0,v0,du,dv,top='#d9d6ce')=>{boxZ(g,u0,v0,du,dv,0,1,top,'#b3aea4','#96918a');};
    const fence=(g,a,b,gaps=[])=>{const pa=P(a[0],a[1]),pb=P(b[0],b[1]),L=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(3,Math.round(L/7));
      const inGap=t=>gaps.some(q=>t>q[0]&&t<q[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(inGap(t))continue;const u=a[0]+(b[0]-a[0])*t,v=a[1]+(b[1]-a[1])*t,p=P(u,v,0);BL(g,p,[p[0],p[1]-7],'#7f888d');}
      const seg=(t0,t1)=>{if(t1-t0<.001)return;const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);BL(g,q(t0,7),q(t1,7),'rgba(170,178,183,.95)');BL(g,q(t0,4),q(t1,4),'rgba(170,178,183,.45)');BL(g,q(t0,1),q(t1,1),'rgba(170,178,183,.35)');};
      let t=0;const gs=[...gaps].sort((p,q)=>p[0]-q[0]);for(const q of gs){seg(t,q[0]);t=q[1];}seg(t,1);};

    // ---------- 軸向工具：b＝沿長向、a＝橫向 ----------
    const AXF=(ax)=>({
      pt:(b,a,z=0)=>ax==='u'?P(b,a,z):P(a,b,z),
      bx:(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,b0,a0,db,da,z,h,t,l,r):boxZ(g,a0,b0,da,db,z,h,t,l,r),
      side:(g,a,b0,b1,za,zb,c)=>ax==='u'?faceL(g,a,b0,b1,za,zb,c):faceR(g,a,b0,b1,za,zb,c),   // 長向側面（a 常數）
      end:(g,b,a0,a1,za,zb,c)=>ax==='u'?faceR(g,b,a0,a1,za,zb,c):faceL(g,b,a0,a1,za,zb,c),    // 端面（b 常數）
      lit:ax==='u'});      // 長向側面是否為受光面

    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const crowd=(S,pts,z,d)=>S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);person(g,p[0],p[1],k);}});
    const scatter=(seed,n,u0,v0,du,dv)=>{const out=[];for(let i=0;i<n;i++)out.push([u0+hsh(seed,i,1)*du,v0+hsh(seed,i,2)*dv,Math.floor(hsh(seed,i,3)*9)]);return out;};

    // ---------- 高鐵列車：白色車體、深色窗帶、藍色飾帶、流線車頭 ----------
    // ax＝行進軸、c＝軌道中心；b0＝車尾（-b 端）；cars＝車廂數；o.noseA／o.noseB＝-b／+b 端是否為車頭；o.dAt(b)＝各廂深度
    const HW=.06;
    const hsr=(S,ax,c,b0,cars,o={})=>{const X=AXF(ax),Lc=o.Lc||.46,NL=o.NL||.3,blue=o.blue||'#2f6fb3',lit=X.lit;
      const TOP='#e8ecef',SL=lit?'#f5f7f8':'#bcc4ca',SD=lit?'#bcc4ca':'#f5f7f8';
      const WIN=lit?'#2d3b4a':'#223040',BLU=lit?blue:SH(blue,-26);
      const body=(g,n,ba,bb)=>{X.bx(g,ba,bb-ba,c-HW+.005,2*HW-.01,1,2,'#4f555a','#60666b','#3d4246');
        X.bx(g,ba,bb-ba,c-HW,2*HW,3,8,TOP,'#f5f7f8','#bcc4ca');
        X.side(g,c+HW,ba,bb,4,5,BLU);X.side(g,c+HW,ba+.012,bb-.012,7,9,WIN);
        if(n)for(let t=ba+.03;t<bb-.04;t+=.055)X.side(n,c+HW,t,t+.03,7,9,'#ffe6ae');};
      const nose=(g,n,ba,dir)=>{const N=7,sl=[];for(let i=0;i<=N;i++){const t=i/N;sl.push({b:ba+dir*NL*t,w:HW*(1-.55*t*t),z:3+8*(1-Math.pow(t,2.1))});}
        X.bx(g,Math.min(ba,ba+dir*(NL-.04)),NL-.04,c-HW*.8,HW*1.6,1,2,'#4f555a','#60666b','#3d4246');
        for(let i=0;i<N;i++){const s0=sl[i],s1=sl[i+1];
          fp(g,[X.pt(s0.b,c+s0.w,2),X.pt(s1.b,c+s1.w,2),X.pt(s1.b,c+s1.w,s1.z),X.pt(s0.b,c+s0.w,s0.z)],SL);
          const t=(i+.5)/N,wind=t>.14&&t<.42;
          fp(g,[X.pt(s0.b,c-s0.w,s0.z),X.pt(s1.b,c-s1.w,s1.z),X.pt(s1.b,c+s1.w,s1.z),X.pt(s0.b,c+s0.w,s0.z)],wind?'#26323f':(i<2?TOP:SH(TOP,dir>0===lit?6:-10)));}
        // 飾帶沿車鼻側面收到鼻尖
        for(let i=0;i<N;i++){const s0=sl[i],s1=sl[i+1];BL(g,X.pt(s0.b,c+s0.w,Math.min(5,s0.z-1)),X.pt(s1.b,c+s1.w,Math.min(5,s1.z-1)),BLU);}
        BL(g,X.pt(sl[0].b,c+HW,8),X.pt(sl[2].b,c+sl[2].w,Math.max(4,sl[2].z-2)),WIN);
        const tip=sl[N],hl=X.pt(tip.b-dir*.03,c+tip.w,3);RC(g,hl[0],hl[1]-1,1,1,'#fff6d8');if(n)RC(n,hl[0],hl[1]-1,1,1,'#fff6d8');};
      const pan=(g,bm)=>{const p=X.pt(bm,c,11),q=X.pt(bm+.05,c,15);BL(g,p,q,'#555b60');BL(g,[q[0]-2,q[1]],[q[0]+2,q[1]],'#555b60');};
      for(let i=0;i<cars;i++){const ba=b0+i*Lc,bb=ba+Lc,isA=i===0&&o.noseA,isB=i===cars-1&&o.noseB;
        const d=o.dAt?o.dAt(ba,bb,i):(ax==='u'?bb+c+HW:c+HW+bb);
        S.o(d,(g,n)=>{const x0=isA?ba+NL:ba,x1=isB?bb-NL:bb;
          if(isA)nose(g,n,x0,-1);
          body(g,n,x0,x1);
          if(isB)nose(g,n,x1,1);
          if(i>0)X.side(g,c+HW,ba,ba+.008,3,11,SH(lit?'#f5f7f8':'#bcc4ca',-40));
          if(i%3===1)pan(g,ba+Lc*.3);
          X.bx(g,ba+Lc*.55,.08,c-.03,.06,11,1,'#c5cbd0','#d5dade','#a4abb1');});}};

    // ---------- 客運列車（古典／通勤）：機車頭＋客車 ----------
    const coachTrain=(S,ax,c,b0,cars,o={})=>{const X=AXF(ax),Lc=o.Lc||.42,col=o.col||'#7c2d2a',roof=o.roof||'#8d9296',lit=X.lit;
      const SC=lit?col:SH(col,-38),WN=lit?'#2f3b44':'#26313a';
      for(let i=0;i<cars;i++){const ba=b0+i*Lc+.01,bb=b0+(i+1)*Lc-.01,loco=o.loco&&i===cars-1;
        const d=o.dAt?o.dAt(ba,bb,i):(ax==='u'?bb+c+HW:c+HW+bb);
        S.o(d,(g,n)=>{X.bx(g,ba+.02,bb-ba-.04,c-.05,.1,0,2,'#2f3235','#3c3f42','#26282a');
          if(loco){const lc=o.locoCol||'#2f4f7a';X.bx(g,ba,bb-ba,c-HW,2*HW,2,7,SH(lc,26),lc,SH(lc,-40));
            X.bx(g,bb-.12,.1,c-HW,2*HW,9,2,SH(lc,30),SH(lc,10),SH(lc,-30));X.side(g,c+HW,ba+.02,bb-.02,5,6,'#e2c050');
            X.side(g,c+HW,bb-.1,bb-.04,7,9,WN);const hl=X.pt(bb,c,6);RC(g,hl[0],hl[1]-1,1,1,'#fff3c8');if(n)RC(n,hl[0],hl[1]-1,1,1,'#fff3c8');}
          else{X.bx(g,ba,bb-ba,c-HW,2*HW,2,7,roof,col,SH(col,-38));
            fp(g,[X.pt(ba,c-HW,9),X.pt(bb,c-HW,9),X.pt(bb,c,10),X.pt(ba,c,10)],SH(roof,-14));fp(g,[X.pt(ba,c,10),X.pt(bb,c,10),X.pt(bb,c+HW,9),X.pt(ba,c+HW,9)],SH(roof,14));
            X.side(g,c+HW,ba,bb,3,4,SH(SC,-18));
            for(let t=ba+.035;t<bb-.04;t+=.05){X.side(g,c+HW,t,t+.025,5,7,WN);if(n&&hsh(ba*100|0,t*100|0,3)<.8)X.side(n,c+HW,t,t+.025,5,7,'#ffe3a0');}
            if(o.band)X.side(g,c+HW,ba,bb,8,9,o.band);}});}};

    // ---------- 桶形拱棚（沿 ax 長向） ----------
    // b∈[b0,b1]、a∈[a0,a1]；簷高 ze、拱高 R；o.zo＝+b 端玻璃山牆下緣（以下為列車出入口，內側陰影另畫）
    const vault=(g,n,ax,b0,b1,a0,a1,ze,R,o={})=>{const X=AXF(ax),N=o.N||30,ac=(a0+a1)/2,hwid=(a1-a0)/2,ex=o.ex||.55,lit=X.lit;
      const zf=a=>{const t=(a-ac)/hwid;return ze+R*Math.pow(Math.max(0,1-t*t),ex);};
      const As=[],Zs=[];for(let i=0;i<=N;i++){const a=a0+(a1-a0)*i/N;As.push(a);Zs.push(zf(a));}
      const roof=o.roof||'#cfd5da',glass=o.glass||'#9fb9c9',rib=o.rib||'#8f99a0',ribStep=o.ribStep||.25,gb=o.glassBand!=null?o.glassBand:.42;
      const ribs=[];for(let b=b0+ribStep;b<b1-.02;b+=ribStep)ribs.push(b);
      // 側牆（+a 側，前）：玻璃帷幕
      if(o.sideWall!==false){X.side(g,a1,b0,b1,0,ze,o.wall||(lit?'#9cb6c6':'#6f8796'));
        for(let b=b0+.06;b<b1-.02;b+=.12)BL(g,X.pt(b,a1,1),X.pt(b,a1,ze-1),o.mull||(lit?'#e3e8eb':'#a9b4bb'));
        BL(g,X.pt(b0,a1,ze*.5|0),X.pt(b1,a1,ze*.5|0),o.mull||(lit?'#e3e8eb':'#a9b4bb'));
        X.side(g,a1,b0,b1,0,2,o.plinth||'#9a958b');
        if(n)for(let b=b0+.06;b<b1-.08;b+=.12)if(hsh(o.seed||7,b*100|0,5)<.55)X.side(n,a1,b+.012,b+.1,3,ze-2,'rgba(255,226,160,.85)');}
      for(let i=0;i<N;i++){const s=Zs[i+1]-Zs[i],t=(As[i]+As[i+1])/2,tt=Math.abs((t-ac)/hwid);
        const k=Math.max(-1,Math.min(1,-s/3));              // >0：朝 +a
        let c=tt<gb?glass:roof;const lk=lit?(k>0?14*k:36*k):(k>0?-40*k:10*(-k));c=SH(c,rnd(lk));
        fp(g,[X.pt(b0,As[i],Zs[i]),X.pt(b1,As[i],Zs[i]),X.pt(b1,As[i+1],Zs[i+1]),X.pt(b0,As[i+1],Zs[i+1])],c);
        for(const b of ribs)BL(g,X.pt(b,As[i],Zs[i]),X.pt(b,As[i+1],Zs[i+1]),SH(rib,rnd(lk*.6)));
        if(Math.abs(tt-gb)<(1/N)*1.2)BL(g,X.pt(b0,As[i],Zs[i]),X.pt(b1,As[i],Zs[i]),SH(rib,-10));}
      BL(g,X.pt(b0,ac,ze+R+1),X.pt(b1,ac,ze+R+1),SH(roof,28));                                      // 屋脊採光帶頂
      X.side(g,a1,b0,b1,ze-2,ze,o.fascia||SH(roof,lit?10:-30));                                       // 簷口
      // +b 端山牆：拱形玻璃、豎櫺、橫檔、白色端拱
      const zo=o.zo||15,EG=o.endGlass||(lit?'#86a6ba':'#557287'),EM=o.endMull||(lit?'#e8edf0':'#9eabb3');
      const poly=[X.pt(b1,a0,zo)];for(let i=0;i<=N;i++)poly.push(X.pt(b1,As[i],Zs[i]));poly.push(X.pt(b1,a1,zo));fp(g,poly,EG);
      for(let i=2;i<N;i+=3)if(Zs[i]>zo+2)BL(g,X.pt(b1,As[i],zo),X.pt(b1,As[i],Zs[i]),EM);
      for(const zz of[zo+9,zo+18])for(let i=0;i<N;i++)if(Zs[i]>zz+1&&Zs[i+1]>zz+1)BL(g,X.pt(b1,As[i],zz),X.pt(b1,As[i+1],zz),EM);
      if(n)for(let i=2;i<N-2;i+=3)for(const[za,zb]of[[zo+1,zo+8],[zo+10,zo+17]])if(Zs[i]>zb+1&&Zs[i+3]>zb+1&&hsh(o.seed||7,i,za)<.6)
        fp(n,[X.pt(b1,As[i]+.01,za),X.pt(b1,As[Math.min(N,i+3)]-.01,za),X.pt(b1,As[Math.min(N,i+3)]-.01,zb),X.pt(b1,As[i]+.01,zb)],'rgba(255,224,150,.8)');
      X.end(g,b1,a0,a1,zo-2,zo,o.beam||'#e9edf0');
      for(let i=0;i<N;i++){BL(g,X.pt(b1,As[i],Zs[i]),X.pt(b1,As[i+1],Zs[i+1]),o.arch||'#f3f5f6');BL(g,X.pt(b1,As[i],Zs[i]-1),X.pt(b1,As[i+1],Zs[i+1]-1),o.arch2||'#c9d0d5');}
      // 端柱（o.endCols===false：拱頂坐在別的量體上時不畫落地端柱）
      if(o.endCols!==false)for(const a of[a0,a1])X.bx(g,b1-.03,.03,a-(a===a1?.03:0),.03,0,ze,'#e2e6e9','#eef1f3','#b6bec4');
      return{zf};};
    // 拱棚開口內側陰影（放在車廂之前畫）
    const vaultMouth=(g,ax,b1,a0,a1,zo)=>{const X=AXF(ax);X.end(g,b1,a0,a1,0,zo,'#3b4249');X.end(g,b1,a0,a1,zo-3,zo,'#2f353b');};

    // ---------- 路燈、樹、車 ----------
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    const mast=(S,u,v,h=40,d)=>S.o(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#7d8388');RC(g,x,y-h,1,h-2,'#b9c0c4');RC(g,x+1,y-h+2,1,h-4,'#80878c');
      RC(g,x-3,y-h-2,7,2,'#5b6166');RC(g,x-3,y-h-2,7,1,'#9aa1a6');RC(g,x-3,y-h,7,1,'#e9e2c4');
      if(n){RC(n,x-3,y-h,7,1,'#fff2c8');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    // 小車（T612 退件修）：一格一輛的等距小車——長 .23、寬 .1；車身 2px＋內縮車艙 2px（兩側深色車窗、淺色車頂）＋輪。
    // 以「印章」預先畫在小畫布（固定次像素相位，所以每輛同色車長得一模一樣），放置時座標取整，各自走分層場景描外框；
    // 落地影列入 SHD，於組裝時統一畫在地坪上。車距由各處擺放保證：同排中心距 ≥.28、前後排間隙 ≥.18、排隊車頭尾間隙 ≥.08。
    const CL=.23,CW=.1,CST={},SHD=[];
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        fp(x,[pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        fp(x,[pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        fp(x,[pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      let tx=null;if(taxi){const p=pt(CL*.47,CW*.5,4);tx=[rnd(p[0]),rnd(p[1])-1];x.fillStyle='#f6f3e4';x.fillRect(tx[0],tx[1],2,1);}
      return CST[key]={c,ox,oy,tx};};
    const car=(S,u,v,alongU,col,d,taxi)=>{const st=carStamp(alongU?'u':'v',col,taxi),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g,n)=>{g.drawImage(st.c,X0,Y0);if(n&&st.tx)RC(n,X0+st.tx[0],Y0+st.tx[1],2,1,'#fff2c0');});};
    // 公車（T612 退件修）：長 .5、寬 .1、車身 5px——長高比約 3.5:1；白色車身、下緣色帶、連續深色窗帶、前擋（車頭那端）或後窗＋尾燈（車尾那端）、
    // 車頂空調、輪。沿 ax、b0 起算；fw＝車頭朝 +b（看得見的那端是車頭）。只畫看得見的面（+a 長側、+b 端）。
    const bus=(S,ax,b0,a0,col,fw=true,d)=>{const X=AXF(ax),Lb=.5,Wb=.1,lit=X.lit,a1=a0+Wb,b1=b0+Lb;
      SHD.push(ax==='u'?['b',b0,a0,Lb,Wb,7]:['b',a0,b0,Wb,Lb,7]);
      S.o(d!=null?d:(ax==='u'?b1+a1:a1+b1),(g,n)=>{const sideC=lit?'#eef1f2':'#b3babf',endC=lit?'#aeb5ba':'#e6e9eb';
        X.bx(g,b0+.03,Lb-.06,a0+.01,Wb-.02,0,1,'#26292c','#2c3033','#1f2225');
        X.bx(g,b0,Lb,a0,Wb,1,5,'#dde1e4',sideC,endC);
        X.side(g,a1,b0,b1,1,2,lit?col:SH(col,-34));
        X.side(g,a1,b0+.02,b1-.03,3,5,lit?'#33485a':'#27384a');
        const dr=fw?b1-.09:b0+.05;X.side(g,a1,dr,dr+.04,1,5,lit?'#2a3947':'#22303d');                       // 車門
        for(const t of[b0+.07,b1-.1]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}                 // 輪
        if(fw){X.end(g,b1,a0+.012,a1-.012,2,5,lit?'#2b3947':'#3b5569');X.end(g,b1,a0,a1,5,6,'#e9b64a');}       // 前擋＋路線牌
        else{X.end(g,b1,a0+.025,a1-.025,4,5,lit?'#33485a':'#3b5569');const r1=X.pt(b1,a0+.012,2),r2=X.pt(b1,a1-.012,2);RC(g,r1[0],r1[1]-1,1,1,'#c0392b');RC(g,r2[0],r2[1]-1,1,1,'#c0392b');}
        X.bx(g,b0+.12,.16,a0+.02,.06,6,1,'#c8cdd0','#d8dcdf','#a8aeb2');
        if(n){for(let t=b0+.04;t<b1-.06;t+=.05)X.side(n,a1,t,t+.03,3,5,'#ffe6ae');
          if(fw){const h1=X.pt(b1,a0+.015,2),h2=X.pt(b1,a1-.015,2);RC(n,h1[0],h1[1]-1,1,1,'#fff3c8');RC(n,h2[0],h2[1]-1,1,1,'#fff3c8');}}});};
    // 接觸網門型架（跨 a0..a1、在 b）
    const catenary=(S,ax,b,a0,a1,h=20,d)=>{const X=AXF(ax);S.t(d!=null?d:(ax==='u'?b+a1:a1+b)+.01,(g)=>{
      for(const a of[a0,a1]){const p=X.pt(b,a,0);RC(g,p[0],p[1]-h,1,h,'#6b747a');RC(g,p[0]+1,p[1]-h+1,1,h-1,'#9aa3a8');}
      BL(g,X.pt(b,a0,h),X.pt(b,a1,h),'#6b747a');BL(g,X.pt(b,a0,h-1),X.pt(b,a1,h-1),'#9aa3a8');});};
    const wires=(S,ax,cs,b0,b1,z,d)=>{const X=AXF(ax);S.t(d,(g)=>{for(const c of cs)BL(g,X.pt(b0,c,z),X.pt(b1,c,z),'rgba(60,66,72,.9)');});};

    // ---------- 立面小件 ----------
    // 站名帶（T612 退件修）：底色＋方塊字。舊版字形畫在帶子上緣之外（帶子是空白的）；改為逐欄取帶子實際上緣列，
    // 字模依帶高分三級：≥7px 用 5×5「中央車站」、5–6px 用 3×3、4px 用 3×2；logo＝帶左端紅圓白槓站徽（帶高 ≥7 才畫）。
    const G5=[['..#..','#####','#.#.#','#####','..#..'],['.###.','.#.#.','#####','..#..','.#.#.'],['#####','.###.','.#.#.','#####','..#..'],['#.###','###..','#.###','##.#.','#.###']];
    const G3=[['###','#.#','###'],['#.#','###','#.#'],['###','.#.','###'],['.##','###','##.'],['#.#','.#.','###'],['###','#..','###']];
    const G2=[['###','#.#'],['#.#','###'],['.#.','###'],['###','.#.'],['##.','.##']];
    const glyphs=(g,n,p,len,hgt,slope,fg,seed,logo)=>{
      const top=X=>Math.ceil(p[1]+(X+.5-p[0])*slope-.5),x0=Math.ceil(p[0]-.5);
      const D=(X,r)=>{RC(g,X,top(X)+r,1,1,fg);if(n)RC(n,X,top(X)+r,1,1,'#fff4d8');};
      const set=hgt>=7?G5:hgt>=5?G3:G2,gw=set[0][0].length,gh=set[0].length,gap=hgt>=7?2:1,pad=Math.max(1,Math.floor((hgt-gh)/2));
      let x=2;
      if(logo&&hgt>=7){const Xc=x0+x+2,Yc=top(Xc)+(hgt>>1);ell(g,Xc,Yc,2,2,'#c8352c');RC(g,Xc-1,Yc,3,1,'#f4f4f2');
        if(n){ell(n,Xc,Yc,2,2,'#ff8f78');RC(n,Xc-1,Yc,3,1,'#fff4e8');}x+=7;}
      const room=len-x-2,nG=Math.max(0,Math.min(set===G5?4:99,Math.floor((room+gap)/(gw+gap)))),tw=nG*(gw+gap)-gap;
      x+=Math.max(0,Math.floor((room-tw)/2));
      for(let k=0;k<nG;k++){const gl=set===G5?G5[k]:set[Math.floor(hsh(seed,k,5)*set.length)];
        for(let c=0;c<gw;c++)for(let r=0;r<gh;r++)if(gl[r][c]==='#')D(x0+x+c,pad+r);x+=gw+gap;}};
    const signL=(g,v,ua,ub,za,zb,bg,fg,seed,n,logo)=>{faceL(g,v,ua,ub,za,zb,bg);glyphs(g,n,P(ua,v,zb),Math.floor((ub-ua)*32),zb-za,.5,fg,seed,logo);};
    const signR=(g,u,va,vb,za,zb,bg,fg,seed,n,logo)=>{faceR(g,u,va,vb,za,zb,bg);glyphs(g,n,P(u,vb,zb),Math.floor((vb-va)*32),zb-za,-.5,fg,seed,logo);};
    const clock=(g,n,p,r=3,rim='#2e3338',face='#f4f1e6')=>{ell(g,p[0],p[1],r+1,r+1,rim);ell(g,p[0],p[1],r,r,face);
      RC(g,p[0],p[1]-r+1,1,r,'#22262a');RC(g,p[0],p[1],r-1,1,'#22262a');if(n){ell(n,p[0],p[1],r,r,'#fff4d6');RC(n,p[0],p[1]-r+1,1,r,'#6a5a3a');RC(n,p[0],p[1],r-1,1,'#6a5a3a');}};
    // 玻璃帷幕（+v 面／+u 面）：底色＋豎櫺＋橫檔＋夜間燈
    const curtainL=(g,n,v,ua,ub,za,zb,o={})=>{const gl=o.glass||'#7fa3bb',m=o.mull||'#dfe6ea';faceL(g,v,ua,ub,za,zb,gl);
      const p=P(ua,v,zb),len=Math.floor((ub-ua)*32);
      for(let z=za+(o.fh||6);z<zb-1;z+=(o.fh||6))BL(g,P(ua,v,z),P(ub,v,z),m);
      for(let x=(o.mw||4);x<len-1;x+=(o.mw||4)){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      faceL(g,v,ua,ub,zb-1,zb,SH(gl,40));
      if(n){const fh=o.fh||6,mw=o.mw||4;for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh(o.seed||3,x,z)>(o.lit||.6))continue;const X=rnd(p[0])+x+1,Y=rnd(P(ua,v,z+1)[1])+Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),.5,o.nc||'#ffe2a2');}}};
    const curtainR=(g,n,u,va,vb,za,zb,o={})=>{const gl=o.glass||'#5b7d94',m=o.mull||'#a9b8c2';faceR(g,u,va,vb,za,zb,gl);
      const p=P(u,vb,zb),len=Math.floor((vb-va)*32);
      for(let z=za+(o.fh||6);z<zb-1;z+=(o.fh||6))BL(g,P(u,va,z),P(u,vb,z),m);
      for(let x=(o.mw||4);x<len-1;x+=(o.mw||4)){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      if(n){const fh=o.fh||6,mw=o.mw||4;for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh((o.seed||3)+9,x,z)>(o.lit||.55))continue;const X=rnd(p[0])+x+1,Y=rnd(P(u,vb,z+1)[1])-Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),-.5,o.nc||'#f3d68e');}}};
    // 電扶梯出入口（月台上往地下通道的梯口）：白框玻璃小亭、白色平頂、+b 端黑色梯口、頂上綠色出口指示燈
    const escal=(S,ax,b0,a0,d,L=.18,Wd=.09)=>{const X=AXF(ax);S.o(d!=null?d:(ax==='u'?b0+L+a0+Wd:a0+Wd+b0+L),(g,n)=>{
      X.bx(g,b0,L,a0,Wd,3,7,'#9fbccc','#9fbccc','#6f8ea2');
      X.side(g,a0+Wd,b0,b0+.015,3,10,'#eef1f3');X.side(g,a0+Wd,b0+L-.015,b0+L,3,10,'#eef1f3');
      for(let b=b0+.05;b<b0+L-.02;b+=.05)BL(g,X.pt(b,a0+Wd,4),X.pt(b,a0+Wd,9),'#dde6ea');
      X.end(g,b0+L,a0+.02,a0+Wd-.02,3,9,'#23282d');
      X.bx(g,b0-.01,L+.02,a0-.01,Wd+.02,10,1,'#f2f4f5','#f6f7f8','#b8bfc4');
      const s=X.pt(b0+L,a0+Wd*.5,10);RC(g,s[0],s[1]-1,2,1,'#3cae6b');if(n){RC(n,s[0],s[1]-1,2,1,'#6dffa8');X.end(n,b0+L,a0+.03,a0+Wd-.03,4,8,'#ffe6ae');}});};
    // 斜向電扶梯廊（月台 → 高架層）：沿 ax、自 bl（低端 zl）升到 bh（高端 zh）；寬 a0..a0+Wd
    const escRamp=(S,ax,bl,bh,a0,Wd,zl,zh,d)=>{const X=AXF(ax);S.o(d,(g,n)=>{const T=6;
      fp(g,[X.pt(bl,a0+Wd,zl),X.pt(bh,a0+Wd,zh),X.pt(bh,a0+Wd,zh+T),X.pt(bl,a0+Wd,zl+T)],X.lit?'#8fb1c5':'#5f7f94');
      fp(g,[X.pt(bl,a0,zl+T),X.pt(bh,a0,zh+T),X.pt(bh,a0+Wd,zh+T),X.pt(bl,a0+Wd,zl+T)],'#c4d4dc');
      for(let k=1;k<6;k++){const t=k/6,b=bl+(bh-bl)*t,z=zl+(zh-zl)*t;BL(g,X.pt(b,a0+Wd,z),X.pt(b,a0+Wd,z+T),'#e6edf1');}
      BL(g,X.pt(bl,a0+Wd,zl),X.pt(bh,a0+Wd,zh),'#6e777d');BL(g,X.pt(bl,a0+Wd,zl+T),X.pt(bh,a0+Wd,zh+T),'#eef2f4');
      X.end(g,bl,a0,a0+Wd,zl,zl+T,'#2a2f34');
      if(n)fp(n,[X.pt(bl,a0+Wd,zl+1),X.pt(bh,a0+Wd,zh+1),X.pt(bh,a0+Wd,zh+T-1),X.pt(bl,a0+Wd,zl+T-1)],'rgba(255,230,170,.75)');});};
    // 波浪屋面：矩形 [u0,u1]×[v0,v1]，高度沿 wd（'u'|'v'）起伏 z＝zb＋amp·(1−cos 2πk t)/2；th＝簷口帶厚
    const waveRoof=(g,wd,u0,u1,v0,v1,zb,amp,k,o={})=>{
      const w0=wd==='u'?u0:v0,w1=wd==='u'?u1:v1,c0=wd==='u'?v0:u0,c1=wd==='u'?v1:u1;
      const N=o.N||Math.max(12,Math.round((w1-w0)*26)),th=o.th||3,top=o.top||'#d6dce0',seam=o.seam||'#bcc4ca';
      const zf=w=>zb+amp*(1-Math.cos(2*Math.PI*k*(w-w0)/(w1-w0)+(o.ph||0)))/2;
      const Wv=[],Zv=[];for(let i=0;i<=N;i++){const w=w0+(w1-w0)*i/N;Wv.push(w);Zv.push(zf(w));}
      const pt=(w,c,z)=>wd==='u'?P(w,c,z):P(c,w,z);
      for(let i=0;i<N;i++){const s=Zv[i+1]-Zv[i],k2=Math.max(-1,Math.min(1,s/1.6));
        const lk=wd==='u'?(k2>0?18*k2:36*k2):(k2>0?-34*k2:-20*k2);
        fp(g,[pt(Wv[i],c0,Zv[i]),pt(Wv[i+1],c0,Zv[i+1]),pt(Wv[i+1],c1,Zv[i+1]),pt(Wv[i],c1,Zv[i])],SH(top,rnd(lk)));
        for(let c=c0+(o.seamStep||.2);c<c1-.03;c+=(o.seamStep||.2))BL(g,pt(Wv[i],c,Zv[i]),pt(Wv[i+1],c,Zv[i+1]),SH(seam,rnd(lk*.7)));}
      const fasL=o.fasL||'#eef1f3',fasD=o.fasD||'#a3acb3';
      for(let i=0;i<N;i++){const q=[pt(Wv[i],c1,Zv[i]-th),pt(Wv[i+1],c1,Zv[i+1]-th),pt(Wv[i+1],c1,Zv[i+1]),pt(Wv[i],c1,Zv[i])];fp(g,q,wd==='u'?fasL:fasD);}
      for(let i=0;i<N;i++)BL(g,pt(Wv[i],c1,Zv[i]),pt(Wv[i+1],c1,Zv[i+1]),wd==='u'?'#ffffff':'#c9d0d5');
      if(wd==='u')faceR(g,u1,v0,v1,Zv[N]-th,Zv[N],fasD);else faceL(g,v1,u0,u1,Zv[N]-th,Zv[N],fasL);
      return zf;};
    // 月台雨棚：一列柱＋薄棚頂（沿 ax）；o.wave＝[amp,k] 棚頂沿長向起伏
    const canopy=(S,ax,b0,b1,a0,a1,z=13,o={})=>{const X=AXF(ax),cm=(a0+a1)/2,step=o.step||.3,d=o.d!=null?o.d:(ax==='u'?b1+a1:a1+b1);
      const zAt=o.wave?(b=>z+o.wave[0]*(1-Math.cos(2*Math.PI*o.wave[1]*(b-b0)/(b1-b0)))/2):(()=>z),z0=o.z0!=null?o.z0:3,cw=o.cw||.024;
      S.o(d,(g,n)=>{for(let b=b0+.08;b<b1-.02;b+=step){X.bx(g,b-cw/2,cw,cm-cw/2,cw,z0,zAt(b)-z0,'#dfe3e6','#eef1f2','#a9b1b7');
          X.bx(g,b-.008,.016,a0+.04,a1-a0-.08,zAt(b)-1,1,'#c9cfd3','#dfe3e6','#9aa2a8');}             // 橫臂縮在棚板下（不再從棚緣下方凸出成一排鋸齒）
        if(o.wave){ax==='u'?waveRoof(g,'u',b0,b1,a0,a1,z,o.wave[0],o.wave[1],{th:2,top:o.top||'#c3cbd1',seamStep:.08}):waveRoof(g,'v',a0,a1,b0,b1,z,o.wave[0],o.wave[1],{th:2,top:o.top||'#c3cbd1',seamStep:.08});}
        else{X.bx(g,b0,b1-b0,a0,a1-a0,z,2,o.top||'#bcc5cc',o.l||'#eef1f2',o.r||'#9aa3aa');
          for(let b=b0+.1;b<b1-.02;b+=.1)BL(g,X.pt(b,a0,z+2),X.pt(b,a1,z+2),SH(o.top||'#bcc5cc',-12));}
        // 棚下燈：畫在棚板前緣側面的下排（不再掛在棚板下方——掛在下方會被描邊成一排鋸齒）
        for(let b=b0+.08;b<b1-.1;b+=step){const p=X.pt(b+step*.5,a1,zAt(b+step*.5)+(o.wave?-1:1));RC(g,p[0],p[1],2,1,'#efe7c6');if(n)RC(n,p[0],p[1],2,1,'#fff0c2');}});};

    return{P,hsh,RC,BL,fp,Q,flat,boxZ,faceL,faceR,pg,winL,winR,ribsL,ribsR,rowL,rowR,ell,scene,shadow,MATS,pave,lineU,lineV,dashU,dashV,YEL,WHT,GA,
      track,platform,stallsU,stallsV,zebraU,zebraV,curb,fence,AXF,person,crowd,scatter,hsr,coachTrain,vault,vaultMouth,lamp,mast,tree,bush,car,bus,CL,CW,SHD,
      catenary,wires,signL,signR,clock,curtainL,curtainR,escal,escRamp,waveRoof,canopy,HW};
  };

  // 組裝：每類一個 K、每變體獨立畫布
  const build=(k,dm,SZ,layouts)=>{const[W,H,AX,AY]=dm;const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H),order=DEV[k]||null;
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();L.SHD.length=0;
      const o=layouts[v](g,ng,S,L,K,SZ)||{};
      if(L.SHD.length)L.shadow(g,L.SHD,.28);                                                                   // 車輛落地影
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';   // 夜光只落在白天畫出的像素上
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}
    if(B[k+'_1_3'])B[k+'_1_3']=B[k+'_1_0'];
    if(B[k+'_1_4'])B[k+'_1_4']=B[k+'_1_1'];};
  const E=.04;

  // ================= k139 高速鐵路車站（5×5）=================
  try{
    const SZ=5;
    // 小工具：四坡屋頂（脊沿 u）
    const hipRoof=(L,g,u0,v0,du,dv,z,rh,c)=>{const {P,fp}=L,u1=u0+du,v1=v0+dv,vm=v0+dv/2,hr=Math.min(dv/2,du/2);
      fp(g,[P(u0,v0,z),P(u1,v0,z),P(u1-hr,vm,z+rh),P(u0+hr,vm,z+rh)],c[2]);
      fp(g,[P(u0,v0,z),P(u0+hr,vm,z+rh),P(u0,v1,z)],c[2]);
      fp(g,[P(u0+hr,vm,z+rh),P(u1-hr,vm,z+rh),P(u1,v1,z),P(u0,v1,z)],c[0]);
      fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1-hr,vm,z+rh)],c[1]);
      L.BL(g,P(u0+hr,vm,z+rh),P(u1-hr,vm,z+rh),c[3]||'#e8ecee');};
    const K139=[
      // v0 大拱棚＋前置大廳：四股軌道沿 u 貫穿，兩座島式月台；白色鋼構大拱棚（屋脊採光帶、端部拱形玻璃山牆）罩住中段，
      // 前（+v）側玻璃大廳（出挑屋簷上的站名帶、中央石柱大時鐘、入口雨遮）；站前廣場：左計程車彎道、中人行廣場與停車、右公車月台；後側電力設備房。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashU,YEL,WHT,track,platform,stallsU,zebraU,curb,fence,crowd,scatter,hsr,vault,vaultMouth,lamp,tree,bush,car,bus,CW,signL,clock,curtainL,curtainR,escal,canopy,boxZ,faceL,faceR,flat,RC,BL,rowR}=L;
        // T612 退件修：拱棚口由 3.55 退到 3.12（外露月台段 1.4→1.9 格），前置大廳同步左移與棚口對齊（u .6–3.1）
        const T=[.8,1.5,1.86,2.5],U0=.35,U1=3.12,HA=.6,HB=3.1;
        pave(g,'c',0,0,SZ,SZ,13901);
        pave(g,'a',0,.1,3.3,.3,13902);pave(g,'k',3.35,.06,1.6,.46,13903);
        pave(g,'b',0,.58,SZ,2.12,13904);
        for(const[i,c]of T.entries())track(g,'u',c,0,SZ,13910+i);
        platform(g,'u',.92,1.38,.22,4.8);platform(g,'u',1.98,2.38,.22,4.8);
        pave(g,'s',0,2.7,SZ,.82,13905);
        pave(g,'a',0,3.52,SZ,.34,13906);lineU(g,3.52,0,SZ,'#d9d6ce');dashU(g,3.69,.1,SZ,WHT,.12,.1);
        pave(g,'a',.1,3.9,1.45,1.0,13907);
        pave(g,'g',.42,4.14,.82,.52,13908);curb(g,.42,4.14,.82,.52,'#8fb56a');
        pave(g,'z',1.6,3.9,1.75,.3,13909);
        // 停車場：兩排各 6 格（中心距 .285）、中間留車道，前後排錯開不疊
        pave(g,'a',1.6,4.2,1.75,.7,13911);stallsU(g,1.62,4.22,1.71,6,.26);stallsU(g,1.62,4.64,1.71,6,.26);
        dashU(g,4.555,1.66,3.3,'#8d8a84',.08,.1);
        pave(g,'a',3.4,3.9,1.55,1.0,13912);
        curb(g,3.45,4.3,1.4,.12,'#dcd8cf');
        for(let k=0;k<2;k++){const u=3.52+k*.62;lineV(g,u,4.44,4.6,YEL);}lineV(g,4.66,4.44,4.6,YEL);
        zebraU(g,1.7,1.99,3.54,3.86);zebraU(g,3.0,3.3,3.54,3.86);
        pave(g,'g',0,4.9,SZ,.1,13913);
        // 右前人行區：第二出口（地下通道）、腳踏車棚、花台
        L.shadow(g,[['b',U0,.6,U1-U0,2.1,40],['b',HA,2.74,HB-HA,.76,28],['b',3.45,.12,.62,.34,14],['b',4.2,.1,.6,.4,12],
          ['b',3.5,2.82,.4,.3,12],['b',4.06,2.82,.84,.22,8]]);
        fence(g,[E,E],[SZ-E,E]);fence(g,[E,E],[E,.56]);
        // ---- 後側：電力設備房＋主變壓器 ----
        S.o(.5,(g2,n2)=>{boxZ(g2,3.45,.12,.62,.34,0,14,'#9aa3a7','#dedad0','#b5b0a5');
          for(let k=0;k<4;k++){const u=3.52+k*.11;faceL(g2,.46,u,u+.06,3,10,'#a9a598');for(let z=4;z<10;z+=2)BL(g2,P(u,.46,z),P(u+.06,.46,z),'#8f8b80');}
          L.winL(g2,3.96,.46,0,3,7,'#5a4a3c');rowR(g2,n2,4.07,.16,.42,8,2,2,3,'#4d6f88',13921,.5);boxZ(g2,3.55,.2,.12,.1,14,3,'#b9c1c6','#cdd4d8','#a7afb4');
          const wl=P(3.9,.46,12);RC(g2,wl[0],wl[1],2,1,'#efe2b0');if(n2)RC(n2,wl[0],wl[1],2,1,'#ffe6a0');});
        S.o(.55,(g2,n2)=>{boxZ(g2,4.2,.1,.62,.38,0,1,'#c9c5bb','#d4d0c7','#b3afa6');K.transformer(g2,n2,4.26,.14);K.transformer(g2,n2,4.5,.14);});
        // ---- 列車（深度：棚內車廂 1.x → 拱棚 4.8 → 外露段依 v 由後往前 5.x）----
        S.o(.9,(g2)=>vaultMouth(g2,'u',U1,.6,2.68,15));
        // 停站列車：車頭＋一節完整車廂駛出棚口（尾端 U1+.94）；第二列整列停在棚內（車頭在棚口內側）
        hsr(S,'u',T[1],U1+.94-.46*8,8,{noseB:true,dAt:(ba,bb)=>bb<=U1+.03?1.0+bb*.01:5.2});
        hsr(S,'u',T[2],U1-.03-.46*6,6,{noseB:true,dAt:(ba,bb)=>1.0+bb*.01});
        // 月台外露段：兩座島式月台各一條對齊的連續長雨棚（同長、同柱距），棚端各一座電扶梯口（同一 u）
        const CA=U1+.1,CB=4.4;
        canopy(S,'u',CA,CB,1.0,1.3,12,{d:5.0,step:.25});canopy(S,'u',CA,CB,2.05,2.33,12,{d:5.6,step:.25});
        escal(S,'u',CB+.07,1.1,5.05);escal(S,'u',CB+.07,2.14,5.62);
        crowd(S,[[3.3,1.33,0],[3.52,1.35,1],[3.9,1.33,2],[4.12,1.34,3],[4.75,1.2,5],[4.72,1.02,6]],3,5.1);
        crowd(S,[[3.36,2.36,4],[3.7,2.35,5],[4.02,2.36,6],[4.28,2.35,7],[4.74,2.22,8]],3,5.65);
        // ---- 大拱棚 ----
        S.o(4.8,(g2,n2)=>vault(g2,n2,'u',U0,U1,.6,2.68,17,27,{seed:13931,ribStep:.25}));
        // ---- 前置大廳 ----
        S.o(7.3,(g2,n2)=>{const u0=HA,u1=HB,v0=2.74,v1=3.5,h=24,um=(u0+u1)/2;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#b7bec3','#e8ebec','#aab1b6');
          curtainL(g2,n2,v1,u0+.04,u1-.04,2,h,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:4,seed:13941,lit:.9});
          curtainR(g2,n2,u1,v0+.02,v1-.02,2,h,{glass:'#58788e',mull:'#9fb0bc',fh:6,mw:5,seed:13942,lit:.8});
          for(let u=u0+.25;u<u1-.1;u+=.25)if(Math.abs(u-um)>.2)BL(g2,P(u,v1,2),P(u,v1,h),'#f4f7f8');          // 豎向白鰭
          faceL(g2,v1,um-.16,um+.16,2,h,'#e9e7e0');faceL(g2,v1,um-.16,um-.14,2,h,'#cfccc3');                 // 中央石柱
          clock(g2,n2,P(um,v1,h-7),4);
          faceL(g2,v1,um-.1,um+.1,2,9,'#2f4354');if(n2)faceL(n2,v1,um-.09,um+.09,3,9,'#ffe6ae');           // 大門
          faceL(g2,v1,u0,u1,0,2,'#9d998f');
          // 出挑屋簷（厚 5px）＋站名帶
          boxZ(g2,u0-.06,v0-.03,u1-u0+.12,v1-v0+.16,h,5,'#dfe3e6','#f2f4f5','#b0b8be');
          signL(g2,v1+.13,u0+.3,um-.22,h,h+5,'#1f3a5c','#e9eef2',13943,n2);signL(g2,v1+.13,um+.22,u1-.3,h,h+5,'#1f3a5c','#e9eef2',13944,n2);
          flat(g2,u0+.02,v0+.02,u1-u0-.04,v1-v0,'#c9d0d5',h+5);
          for(let k=0;k<3;k++){const u=u0+.35+k*.7;boxZ(g2,u,v0+.18,.36,.34,h+5,2,'#9fb9c8','#b4ccd9','#7f98a8');}
          boxZ(g2,u1-.4,v0+.12,.2,.14,h+5,4,'#b9c1c6','#cdd4d8','#a7afb4');
          // 入口雨遮
          boxZ(g2,um-.45,v1,.9,.22,10,2,'#eef1f2','#f6f7f8','#b8bfc4');for(const u of[um-.42,um+.4])boxZ(g2,u,v1+.18,.025,.025,0,10,'#d9dde0','#e6e9eb','#aab1b6');
          if(n2)faceL(n2,v1+.22,um-.43,um+.43,9,10,'#fff0c2');});
        // ---- 站前廣場 ----
        // 計程車排班：沿彎道一輛接一輛（後側車道沿 u 四輛 → 右側車道沿 v 兩輛 → 前側出場一輛），車頭尾間隙 ≥.08
        for(const u of[.14,.45,.76,1.07])car(S,u,3.96,true,'#e8b62c',null,true);
        for(const v of[4.3,4.6])car(S,1.35,v,false,'#e8b62c',null,true);
        car(S,.55,4.74,true,'#e8b62c',null,true);
        car(S,1.72,3.6,true,'#3d5f8a');car(S,2.5,3.72,true,'#e8ecee');
        // 停車場：每格一輛，前後排錯開
        const stall=k=>1.62+.285*(k+.5)-CW/2;
        for(const[k,c]of[[0,'#b8433a'],[1,'#e8ecee'],[3,'#3d5f8a'],[4,'#c9c3b4'],[5,'#5d6468']])car(S,stall(k),4.235,false,c);
        for(const[k,c]of[[0,'#e8ecee'],[2,'#9a3a33'],[3,'#5d6468'],[5,'#3d5f8a']])car(S,stall(k),4.675,false,c);
        // 公車月台：島上候車棚（柱落在 1px 路緣上），公車停在島前車道
        bus(S,'u',3.54,4.46,'#3f8a5a',true);bus(S,'u',4.16,4.46,'#2f6fb3',true);
        car(S,3.62,3.98,true,'#e8b62c',null,true);car(S,4.3,3.98,true,'#e8ecee');
        S.o(3.45+4.42+.02,(g2,n2)=>{for(const u of[3.56,4.1,4.64])boxZ(g2,u,4.33,.045,.045,1,9,'#c7cbcd','#d6dadc','#8c9296');
          boxZ(g2,3.5,4.3,1.3,.12,10,2,'#bcc5cc','#eef1f2','#9aa3aa');for(let u=3.6;u<4.8;u+=.1)BL(g2,P(u,4.3,12),P(u,4.42,12),'#aab3ba');
          for(const u of[3.8,4.35])faceL(g2,4.36,u,u+.18,2,7,'#8fb0c4');
          for(const u of[3.72,4.22,4.72]){const p=P(u,4.42,9);RC(g2,p[0],p[1],2,1,'#efe7c6');if(n2)RC(n2,p[0],p[1],2,1,'#fff0c2');}});
        crowd(S,[[3.7,4.4,1],[3.95,4.41,2],[4.45,4.4,5],[4.62,4.41,7]],1,3.45+4.42+.03);
        crowd(S,scatter(13951,12,1.7,3.93,1.55,.22),0,1.7+3.95+.3);
        crowd(S,scatter(13952,12,HA+.1,3.3,HB-HA-.2,.18),0,7.4);
        // 右前人行區：第二出口（地下通道口，玻璃亭＋白色平頂＋綠色出口燈）、腳踏車棚、三座花台
        S.o(3.9+3.12,(g2,n2)=>{const u0=3.5,u1=3.9,v0=2.82,v1=3.12,h=11;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#9fbccc','#a9c4d3','#6f8ea2');
          for(let u=u0+.07;u<u1-.02;u+=.07)BL(g2,P(u,v1,1),P(u,v1,h-1),'#e6edf1');for(let v=v0+.07;v<v1-.02;v+=.07)BL(g2,P(u1,v,1),P(u1,v,h-1),'#b8c7d0');
          faceL(g2,v1,u0+.12,u0+.3,0,8,'#27303a');faceL(g2,v1,u0+.13,u0+.29,0,2,'#4a545d');
          boxZ(g2,u0-.03,v0-.03,u1-u0+.06,v1-v0+.08,h,2,'#e9ecee','#f6f7f8','#b3bbc1');
          const s=P(u0+.21,v1+.05,h+2);RC(g2,s[0],s[1]-2,3,2,'#2f9a5e');RC(g2,s[0]+1,s[1]-2,1,1,'#e6f5ea');
          if(n2){RC(n2,s[0],s[1]-2,3,2,'#6dffa8');faceL(n2,v1,u0+.13,u0+.29,2,7,'#ffe6ae');}});
        S.o(4.9+3.04,(g2,n2)=>{const u0=4.06,u1=4.9,v0=2.82,v1=3.04;
          for(let u=u0+.05;u<u1-.03;u+=.07){const p=P(u,v0+.12,0),c=['#b8433a','#3d5f8a','#4a6b45','#c49a3a','#5d6468'][Math.round(u*14)%5];
            RC(g2,p[0]-2,p[1]-2,1,2,'#2a2d30');RC(g2,p[0]+2,p[1],1,2,'#2a2d30');BL(g2,[p[0]-1,p[1]-2],[p[0]+1,p[1]-1],c);RC(g2,p[0]-1,p[1]-3,1,1,'#3a3f44');}
          for(const u of[u0+.03,(u0+u1)/2,u1-.06])boxZ(g2,u,v0+.02,.035,.035,0,8,'#8d969c','#a3abb0','#6f787e');
          boxZ(g2,u0-.02,v0-.02,u1-u0+.04,v1-v0+.05,8,1,'#b9c2c8','#dfe4e7','#8f989e');BL(g2,P(u0-.02,v1+.03,8),P(u1+.02,v1+.03,8),'#eef1f3');
          if(n2)for(const u of[u0+.2,u1-.25]){const p=P(u,v1,7);RC(n2,p[0],p[1],2,1,'#fff0c2');}});
        for(const u of[3.42,3.94,4.46])S.o(u+.4+3.38,(g2)=>{boxZ(g2,u,3.24,.42,.16,0,2,'#6f9a4e','#d7d3ca','#b5b0a6');flat(g2,u+.03,3.26,.36,.1,'#7fa95a',2);
          for(let k=0;k<5;k++){const q=P(u+.05+k*.08,3.3,2);RC(g2,q[0],q[1]-1,1,1,k%2?'#9fcf6e':'#e3c14e');}});
        crowd(S,[[3.98,3.18,1],[4.1,3.2,3],[3.6,3.2,5],[4.7,3.15,0]],0,7.1);
        for(const[u,v,s,k]of[[1.75,4.0,.8,0],[2.2,4.02,.8,1],[2.7,4.0,.8,2],[3.2,4.02,.8,0],[.83,4.4,1.0,1],[.1,4.95,.7,2],[4.9,4.95,.7,0],[4.9,3.95,.7,1],
          [3.62,3.32,.6,1],[4.14,3.32,.6,2],[4.66,3.32,.6,0]])tree(S,u,v,s,k);
        bush(S,.55,4.25);bush(S,1.1,4.55);
        for(const u of[.3,1.3,2.3,3.3,4.3])lamp(S,u,3.5);for(const u of[1.6,3.36])lamp(S,u,4.9);
        lamp(S,.05,.45,15,.45);lamp(S,1.5,.45,15,.45);lamp(S,3.0,.45,15,.45);
        return{front:(g2)=>{fence(g2,[SZ-E,E],[SZ-E,.56]);}};
      },
      // v1 波浪頂＋高架大廳與公車轉運區：四股軌道沿 v 貫穿（左半），兩座島式月台；玻璃高架候車大廳橫跨軌道（樓板下列車穿過），
      // 頂上三道波浪大屋頂；大廳右端落地為進站廳。月台兩段波浪雨棚、斜向電扶梯廊接上高架層；右側公車轉運區（島式候車月台＋雨棚）、
      // 前方落客道＋站前廣場、右後停車場與電力設備房。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashU,dashV,YEL,WHT,track,platform,stallsU,stallsV,zebraV,zebraU,curb,fence,crowd,scatter,hsr,lamp,tree,bush,car,bus,catenary,wires,signL,clock,curtainL,curtainR,escRamp,waveRoof,canopy,boxZ,faceL,faceR,flat,RC,BL,rowR}=L;
        const T=[.5,1.14,1.5,2.14],HU0=.12,HU1=3.45,HV0=1.75,HV1=3.05;
        pave(g,'c',0,0,SZ,SZ,13961);
        pave(g,'b',.3,0,2.02,SZ,13962);
        for(const[i,c]of T.entries())track(g,'v',c,0,SZ,13963+i);
        platform(g,'v',.6,1.04,.12,4.88);platform(g,'v',1.6,2.04,.12,4.88);
        pave(g,'a',3.56,.08,1.4,4.84,13967);                          // 公車轉運
        curb(g,3.72,.45,.16,3.95,'#dcd8cf');
        for(let k=0;k<7;k++){const v=.47+k*.65;lineU(g,v,3.88,4.06,YEL);}                                  // 公車格（每格 .65，車長 .5）
        dashV(g,4.3,.2,4.8,WHT,.12,.1);lineV(g,4.56,.3,4.7,'#d9d6ce');
        curb(g,4.6,.3,.3,4.4,'#86ad62');                                                                // 待班車道改為行道樹綠帶
        pave(g,'a',2.36,.5,1.2,1.2,13968);stallsU(g,2.42,.55,1.08,4,.26);stallsU(g,2.42,1.4,1.08,4,.26);   // 停車場（每格 .27）
        pave(g,'k',2.4,.06,1.14,.4,13969);
        pave(g,'s',2.34,3.05,1.22,.16,13970);
        pave(g,'a',2.34,3.2,1.22,.34,13971);dashU(g,3.37,2.4,3.5,WHT,.1,.08);                // 落客道
        pave(g,'z',2.34,3.54,1.22,1.4,13972);
        pave(g,'g',2.5,3.9,.3,.3,13973);pave(g,'g',3.1,3.9,.3,.3,13974);pave(g,'g',2.5,4.45,.3,.3,13975);pave(g,'g',3.1,4.45,.3,.3,13976);
        zebraV(g,3.25,3.5,3.56,3.8);
        L.shadow(g,[['b',HU0,HV0,HU1-HU0,HV1-HV0,26,18],['b',2.35,HV0,1.1,HV1-HV0,18],['b',2.45,.1,.7,.32,13],['b',3.72,.5,.16,3.85,2,10]]);
        fence(g,[E,E],[.28,E]);fence(g,[2.34,E],[SZ-E,E]);fence(g,[E,E],[E,SZ-E]);
        // ---- 右後：電力設備房＋變壓器、停車場 ----
        S.o(2.4,(g2,n2)=>{boxZ(g2,2.45,.1,.7,.32,0,13,'#9aa3a7','#dedad0','#b5b0a5');
          for(let k=0;k<4;k++){const u=2.52+k*.13;faceL(g2,.42,u,u+.07,3,10,'#a9a598');for(let z=4;z<10;z+=2)BL(g2,P(u,.42,z),P(u+.07,.42,z),'#8f8b80');}
          rowR(g2,n2,3.15,.12,.4,8,2,2,3,'#4d6f88',13977,.5);K.transformer(g2,n2,3.2,.1);});
        // 停車場的車都在大廳後方（v<1.75）：深度一律壓在大廳（4.0）之前，被大廳擋住的部分就被擋住，不會疊到大廳立面上
        for(const[k,c]of[[1,'#e8ecee'],[2,'#b8433a'],[3,'#3d5f8a']])car(S,2.42+.27*(k+.5)-.05,.565,false,c,2.5+k*.01);
        car(S,2.42+.27*3.5-.05,1.415,false,'#5d6468',2.63);
        // ---- 列車（沿 v、車頭朝 +v）----
        hsr(S,'v',T[1],4.8-.46*8,8,{noseB:true,dAt:(ba,bb)=>ba<2.95?.5+bb*.01:(bb<4.5?4.3:4.6)});
        hsr(S,'v',T[3],.1,5,{noseB:true,dAt:(ba,bb)=>.5+bb*.01});
        // 後段雨棚
        // 月台雨棚：規整的等距平頂長條＋中央柱列（只有主屋頂保留波浪）
        canopy(S,'v',.2,HV0-.02,.56,1.08,12,{d:1.2,step:.3});canopy(S,'v',.2,HV0-.02,1.56,2.08,12,{d:1.25,step:.3});
        crowd(S,[[1.02,.4,1],[1.0,.9,2],[1.03,1.4,3],[2.02,.6,4],[2.0,1.2,5]],3,1.3);
        // ---- 高架候車大廳（橋墩、樓板、玻璃帷幕、波浪大屋頂）----
        S.o(4.0,(g2,n2)=>{
          for(const u of[.2,.82,1.82])boxZ(g2,u-.035,HV1-.1,.07,.07,0,15,'#d9dcdd','#e8eaea','#a9aeb1');
          // 落地進站廳（右端）
          boxZ(g2,2.35,HV0,HU1-2.35,HV1-HV0,0,18,'#c9cfd3','#e8ebec','#aab1b6');
          curtainL(g2,n2,HV1,2.4,HU1-.04,2,15,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:4,seed:13978,lit:.9});
          curtainR(g2,n2,HU1,HV0+.04,HV1-.04,2,15,{glass:'#58788e',mull:'#9fb0bc',fh:6,mw:5,seed:13979,lit:.8});
          faceL(g2,HV1,2.8,3.0,2,10,'#2f4354');if(n2)faceL(n2,HV1,2.81,2.99,3,10,'#ffe6ae');
          // 樓板
          boxZ(g2,HU0,HV0,2.35-HU0,HV1-HV0,15,3,'#dfe2e3','#eef0f1','#b9bec2');faceL(g2,HV1,HU0,2.35,15,16,'#aab0b4');
          // 高架層玻璃帷幕
          boxZ(g2,HU0,HV0,HU1-HU0,HV1-HV0,18,18,'#b7bec3','#e8ebec','#aab1b6');
          curtainL(g2,n2,HV1,HU0+.03,HU1-.03,18,36,{glass:'#8bb0c6',mull:'#eaf0f2',fh:6,mw:4,seed:13980,lit:.85});
          curtainR(g2,n2,HU1,HV0+.03,HV1-.03,18,36,{glass:'#5a7b91',mull:'#a2b3be',fh:6,mw:5,seed:13981,lit:.8});
          faceL(g2,HV1,HU0,HU1,18,19,'#d4d8da');
          signL(g2,HV1,.45,1.85,25,31,'#1f3a5c','#e9eef2',13982,n2);
          clock(g2,n2,P(2.1,HV1,25),4);
          // 波浪大屋頂
          waveRoof(g2,'u',HU0-.1,HU1+.12,HV0-.1,HV1+.1,36,9,3,{th:4,top:'#dfe4e7',seam:'#c3cbd0',seamStep:.16});});
        // 斜向電扶梯廊（月台 → 高架層）
        escRamp(S,'v',3.62,HV1,.76,.12,3,18,4.15);escRamp(S,'v',3.62,HV1,1.76,.12,3,18,4.35);
        // 前段雨棚
        canopy(S,'v',3.68,4.62,.56,1.08,12,{d:4.25,step:.3});canopy(S,'v',3.68,4.62,1.56,2.08,12,{d:4.4,step:.3});
        crowd(S,[[1.02,3.75,0],[.99,4.05,2],[1.03,4.5,4],[.8,4.7,6],[2.02,3.8,1],[1.99,4.2,3],[2.03,4.6,5]],3,4.45);
        // ---- 公車轉運區：島式候車月台（波浪雨棚）在左，前緣靠站公車在右、最右一排待班公車 ----
        // 島式候車月台：兩段平頂候車棚，柱寬 1.5px、直接落在 1px 高的路緣上
        canopy(S,'v',.5,1.95,3.7,3.9,10,{d:4.5,step:.45,z0:1,cw:.045,top:'#c9d0d5'});canopy(S,'v',2.4,4.3,3.7,3.9,10,{d:4.51,step:.45,z0:1,cw:.045,top:'#c9d0d5'});
        crowd(S,[[3.84,.8,1],[3.82,1.5,2],[3.85,2.1,5],[3.83,2.7,7],[3.84,3.3,0],[3.86,3.9,3]],1,4.52);
        // T612 退件修：公車由 8 輛減為 4 輛（只留靠站車），右側待班車道改成綠帶＋行道樹＋長椅
        for(const[v,c]of[[.54,'#3f8a5a'],[1.84,'#2f6fb3'],[2.49,'#c8563a'],[3.79,'#e0a33a']])bus(S,'v',v,3.93,c,true);
        for(let k=0;k<7;k++)tree(S,4.75,.55+k*.62,.75,k);
        for(let k=0;k<6;k++)bush(S,4.7,.85+k*.62,2);
        for(const v of[1.12,2.36,3.6])S.o(4.67+v+.16,(g2)=>{boxZ(g2,4.62,v,.05,.16,1,2,'#8a6a4a','#a07d58','#6f5438');});
        // ---- 落客道與廣場 ----
        for(const[u,c,t]of[[2.4,'#e8b62c',1],[2.72,'#e8b62c',1],[3.08,'#3d5f8a',0]])car(S,u,3.25,true,c,null,t);
        crowd(S,scatter(13983,16,2.4,3.1,1.1,1.8),0,3.6+4.9);
        for(const[u,v,s,k]of[[2.65,4.05,.9,0],[3.25,4.05,.9,1],[2.65,4.6,.9,2],[3.25,4.6,.9,0],[3.5,4.95,.7,1],[2.36,4.95,.7,2]])tree(S,u,v,s,k);
        for(const v of[3.2,4.0,4.9])lamp(S,2.36,v);for(const v of[.3,1.7,3.1,4.5])lamp(S,4.97,v);lamp(S,3.56,.3);lamp(S,3.56,4.9);
        return{front:(g2)=>{fence(g2,[SZ-E,E],[SZ-E,SZ-E],[[.05,.95]]);}};
      },
      // v2 通過式車站＋側邊站房與跨站天橋：四股軌道沿 u 從中間貫穿（兩側相對式月台、中間兩股通過線），前側一棟長條兩層站房
      // （中央挑高玻璃大廳＋站名帶＋時鐘、兩翼四坡屋頂、沿街雨遮），玻璃跨站天橋從站房二樓跨過所有軌道到後側出口；
      // 前方落客道與停車、右前公車站；後側小廣場、腳踏車架與電力設備房。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashU,dashV,YEL,WHT,track,platform,stallsU,stallsV,zebraU,zebraV,curb,fence,crowd,scatter,hsr,lamp,tree,bush,car,bus,catenary,wires,signL,signR,clock,curtainL,curtainR,escal,canopy,boxZ,faceL,faceR,flat,RC,BL,rowR,rowL,winL}=L;
        const T=[1.5,1.84,2.16,2.5],BU0=2.3,BU1=2.54;       // 天橋 u 範圍
        pave(g,'c',0,0,SZ,SZ,13991);
        pave(g,'z',.15,.12,1.75,.8,13992);                          // 後側小廣場
        pave(g,'k',3.3,.06,1.62,.66,13993);                         // 電力場
        pave(g,'b',0,1.36,SZ,1.28,13994);
        for(const[i,c]of T.entries())track(g,'u',c,0,SZ,13995+i);
        platform(g,'u',1.0,1.4,.2,4.8);platform(g,'u',2.6,3.0,.2,4.8);
        pave(g,'s',0,3.0,SZ,.06,13999);
        // T612 退件修：停車場砍掉約三分之一（兩側各 4 格×2 排），中間騰出的地方做成對準大廳入口的人行廣場（鋪面、樹、噴水池）
        pave(g,'a',.05,3.86,2.9,.28,14001);lineU(g,3.86,.05,2.95,'#d9d6ce');
        pave(g,'a',.12,4.14,.86,.8,14002);stallsU(g,.14,4.16,.8,4,.24);stallsU(g,.14,4.68,.8,4,.24);
        pave(g,'a',2.08,4.14,.87,.8,14018);stallsU(g,2.1,4.16,.8,4,.24);stallsU(g,2.1,4.68,.8,4,.24);
        pave(g,'z',.98,4.14,1.1,.8,14019);curb(g,.98,4.14,.03,.8,'#d9d6ce');curb(g,2.05,4.14,.03,.8,'#d9d6ce');
        zebraU(g,1.33,1.76,3.87,4.13);
        pave(g,'a',2.95,3.08,2.0,1.84,14003);curb(g,3.1,3.8,1.7,.14,'#dcd8cf');
        for(let k=0;k<3;k++){const u=3.2+k*.55;BL(g,P(u,3.66),P(u+.1,3.8),YEL);BL(g,P(u+.2,3.94),P(u+.3,4.08),YEL);}
        // 右前：進出車道中心虛線、計程車排班格、前緣行道樹綠帶（避免大片空柏油）
        dashU(g,3.38,3.0,4.9,YEL,.1,.08);lineU(g,3.12,2.98,4.9,'#d9d6ce');
        lineU(g,4.2,3.1,4.4,WHT);for(let k=0;k<=4;k++)BL(g,P(3.1+k*.325,4.2),P(3.1+k*.325,4.38),WHT);
        curb(g,2.98,4.5,1.94,.4,'#86ad62');
        pave(g,'g',0,4.94,SZ,.06,14004);
        L.shadow(g,[['b',.3,3.06,2.55,.7,20],['b',1.0,3.0,1.1,.84,34],['b',BU0,.9,BU1-BU0,2.2,10,20],['b',1.95,.3,.8,.6,32],['b',3.4,.12,.6,.36,13]]);
        fence(g,[E,E],[SZ-E,E]);fence(g,[E,E],[E,.95]);
        // ---- 後側：出口站屋、腳踏車架、電力設備房 ----
        S.o(.2,(g2,n2)=>{boxZ(g2,3.4,.12,.6,.36,0,13,'#9aa3a7','#dedad0','#b5b0a5');
          for(let k=0;k<4;k++){const u=3.46+k*.13;faceL(g2,.48,u,u+.07,3,10,'#a9a598');for(let z=4;z<10;z+=2)BL(g2,P(u,.48,z),P(u+.07,.48,z),'#8f8b80');}
          rowR(g2,n2,4.0,.14,.46,8,2,2,3,'#4d6f88',14005,.5);});
        S.o(.3,(g2,n2)=>{boxZ(g2,4.1,.1,.75,.5,0,1,'#c9c5bb','#d4d0c7','#b3afa6');K.transformer(g2,n2,4.16,.16);K.transformer(g2,n2,4.46,.16);});
        S.o(.35,(g2)=>{for(let k=0;k<10;k++){const u=.3+k*.08;BL(g2,P(u,.62,0),P(u,.62,3),'#50585e');BL(g2,P(u,.62,3),P(u+.03,.72,3),'#50585e');RC(g2,P(u,.66)[0],P(u,.66)[1]-3,1,3,['#b8433a','#3d5f8a','#4a6b45'][k%3]);}});
        bus(S,'u',.9,.3,'#2f6fb3',true,.5);
        crowd(S,scatter(14006,8,.3,.2,1.5,.6),0,.6);
        S.o(.95,(g2,n2)=>{const u0=1.95,u1=2.75,v0=.3,v1=.9,h=29;boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#b7bec3','#e8ebec','#aab1b6');
          curtainL(g2,n2,v1,u0+.04,u1-.04,2,h-4,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:4,seed:14007,lit:.8});
          curtainR(g2,n2,u1,v0+.04,v1-.04,2,h-4,{glass:'#58788e',mull:'#9fb0bc',fh:6,mw:5,seed:14008,lit:.7});
          boxZ(g2,u0-.03,v0-.03,u1-u0+.06,v1-v0+.06,h,3,'#dfe3e6','#f2f4f5','#b0b8be');
          faceL(g2,v1,u0+.2,u0+.45,2,9,'#2f4354');boxZ(g2,u0+.12,v1,.4,.14,10,2,'#eef1f2','#f6f7f8','#b8bfc4');
          signL(g2,v1+.03,u0+.12,u1-.12,h+1,h+3,'#1f3a5c','#e9eef2',14009);});
        // ---- 後側月台（P1）：樓梯塔、雨棚、候車的人 ----
        S.o(1.3,(g2,n2)=>{const u0=BU0-.28,u1=BU0,v0=1.06,v1=1.34;boxZ(g2,u0,v0,u1-u0,v1-v0,3,28,'#c9d0d5','#e3e7e9','#a6afb5');
          curtainL(g2,n2,v1,u0+.02,u1-.02,5,30,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:3,seed:14010,lit:.8});faceL(g2,v1,u0+.08,u0+.18,3,9,'#2f4354');});
        canopy(S,'u',.45,BU0-.3,1.04,1.36,13,{d:1.35,step:.3});canopy(S,'u',BU1+.05,4.55,1.04,1.36,13,{d:1.36,step:.3});
        crowd(S,[[.6,1.34,0],[.9,1.36,1],[1.2,1.33,2],[1.6,1.35,3],[2.9,1.34,4],[3.3,1.36,5],[3.8,1.33,6],[4.3,1.35,7]],3,1.4);
        // ---- 列車：後線停站列車（車頭朝 +u）、中間通過線列車（車頭朝 -u）----
        hsr(S,'u',T[0],.62,8,{noseA:true,noseB:true,dAt:()=>1.6});
        // ---- 前側月台（P2）：雨棚、電扶梯口、人、樓梯塔 ----
        canopy(S,'u',.45,BU0-.3,2.64,2.96,13,{d:2.9,step:.3});canopy(S,'u',BU1+.05,4.55,2.64,2.96,13,{d:2.91,step:.3});
        
        crowd(S,[[.6,2.95,1],[1.0,2.96,2],[1.7,2.94,3],[2.8,2.95,4],[3.1,2.96,5],[3.9,2.94,6],[4.4,2.96,0]],3,2.95);
        S.o(2.97,(g2,n2)=>{const u0=BU0-.28,u1=BU0,v0=2.66,v1=2.94;boxZ(g2,u0,v0,u1-u0,v1-v0,3,28,'#c9d0d5','#e3e7e9','#a6afb5');
          curtainL(g2,n2,v1,u0+.02,u1-.02,5,30,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:3,seed:14011,lit:.8});faceL(g2,v1,u0+.08,u0+.18,3,9,'#2f4354');});
        catenary(S,'u',.25,1.38,2.62,19,2.99);catenary(S,'u',4.75,1.38,2.62,19,2.99);
        // ---- 跨站天橋（沿 v，自後側出口站屋 → 前側站房二樓）----
        S.o(2.998,(g2,n2)=>{const v0=.9,v1=3.1,z0=20;
          for(const v of[1.2,2.0,2.8])boxZ(g2,BU0+.08,v-.04,.08,.08,v<1.5||v>2.5?3:0,z0-(v<1.5||v>2.5?3:0),'#d9dcdd','#e8eaea','#a9aeb1');
          boxZ(g2,BU0,v0,BU1-BU0,v1-v0,z0,2,'#cfd4d7','#e3e6e8','#a9b0b5');
          boxZ(g2,BU0,v0,BU1-BU0,v1-v0,z0+2,7,'#9fbfd1','#9fbfd1','#5f8095');
          curtainR(g2,n2,BU1,v0,v1,z0+2,z0+9,{glass:'#5f8095',mull:'#b9c7d0',fh:4,mw:4,seed:14012,lit:.9});
          boxZ(g2,BU0-.02,v0,BU1-BU0+.04,v1-v0,z0+9,2,'#e6e9eb','#f3f5f6','#b3bbc1');
          for(let v=v0+.2;v<v1;v+=.3)BL(g2,P(BU1+.02,v,z0+11),P(BU1+.02,v,z0),'#eef2f4');});
        // ---- 前側站房 ----
        // T612 退件修：中央大廳加寬（.8→1.1 格）加高，改成沿 v 的桶形玻璃拱頂——拱形玻璃山牆正對站前廣場、中央大時鐘；
        // 站名帶拉長到大廳全寬（方塊字＋站徽）；兩翼維持兩層四坡頂，沿街雨遮只在兩翼。畫序：左翼 → 大廳 → 右翼（右翼在大廳 +u 面之前）。
        S.o(3.8,(g2,n2)=>{const v0=3.06,v1=3.76,wa=.3,wb=2.85,la=1.0,lb=2.1,h=18,hv0=3.0,hv1=3.84,ze=24,R=15,zo=13,um=(la+lb)/2;
          const wing=(u0,u1)=>{boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#c9c3b6','#ece7dc','#bdb6a8');
            faceL(g2,v1,u0,u1,0,2,'#a39e92');faceL(g2,v1,u0,u1,9,10,'#d9d2c4');
            rowL(g2,n2,u0+.02,u1-.02,v1,2,3,5,2,'#58788e',14013+u0*10|0,.7);rowL(g2,n2,u0+.02,u1-.02,v1,11,3,5,2,'#58788e',14014+u0*10|0,.6);
            rowR(g2,n2,u1,v0+.04,v1-.04,11,3,5,3,'#48677d',14015+u0*10|0,.5);
            hipRoof(L,g2,u0-.03,v0-.03,u1-u0+.06,v1-v0+.06,h,7,['#7e8a93','#5d6870','#57626a','#a5b0b8']);
            boxZ(g2,u0+.08,v1,u1-u0-.16,.16,10,2,'#dfe3e6','#f2f4f5','#b0b8be');if(n2)faceL(n2,v1+.16,u0+.1,u1-.1,9,10,'#fff0c2');};
          wing(wa,la);
          // 中央挑高大廳：牆身到 ze，上面桶形玻璃拱頂（R）；正面下段玻璃門廳＋站名帶，上段拱形玻璃山牆
          boxZ(g2,la,hv0,lb-la,hv1-hv0,0,ze,'#b7bec3','#e8ebec','#aab1b6');
          curtainR(g2,n2,lb,hv0+.03,hv1-.03,h,ze,{glass:'#58788e',mull:'#9fb0bc',fh:6,mw:5,seed:14020,lit:.7});
          L.vault(g2,n2,'v',hv0,hv1,la,lb,ze,R,{sideWall:false,zo,seed:14021,ribStep:.14,glassBand:.5,roof:'#d3d9dd',glass:'#a3bfcf',rib:'#8f99a0',
            endGlass:'#86a6ba',endMull:'#e8edf0',fascia:'#aab1b6'});
          faceL(g2,hv1,la,lb,0,2,'#9d998f');
          curtainL(g2,n2,hv1,la+.04,lb-.04,2,zo-6,{glass:'#86aac0',mull:'#e6ecef',fh:6,mw:4,seed:14016,lit:.9});
          faceL(g2,hv1,um-.18,um+.18,2,zo-6,'#2f4354');for(let u=um-.12;u<um+.18;u+=.12)BL(g2,P(u,hv1,2),P(u,hv1,zo-6),'#9fb0bc');
          if(n2)faceL(n2,hv1,um-.17,um+.17,3,zo-6,'#ffe6ae');
          signL(g2,hv1,la+.02,lb-.02,zo-7,zo,'#1f3a5c','#e9eef2',14017,n2,true);
          clock(g2,n2,P(um,hv1,zo+14),4);
          // 大廳入口前的玻璃雨遮（窄、落在站名帶下緣之下）
          boxZ(g2,um-.3,hv1,.6,.1,zo-8,1,'#cfe0e8','#eef3f5','#9fb3bf');
          wing(lb,wb);});
        // ---- 前方：落客道、停車、公車站 ----
        for(const[u,c,t]of[[.14,'#e8b62c',1],[.44,'#e8b62c',1],[.74,'#e8b62c',1],[1.92,'#3d5f8a',0],[2.4,'#e8ecee',0]])car(S,u,3.92,true,c,null,t);
        const stl=(u0,k)=>u0+.2*(k+.5)-L.CW/2;
        for(const[u0,k,c]of[[.14,0,'#b8433a'],[.14,1,'#e8ecee'],[.14,3,'#3d5f8a'],[2.1,0,'#c9c3b4'],[2.1,2,'#5d6468'],[2.1,3,'#e8ecee']])car(S,stl(u0,k),4.19,false,c);
        for(const[u0,k,c]of[[.14,1,'#5d6468'],[.14,2,'#9a3a33'],[2.1,1,'#3d5f8a'],[2.1,3,'#b8433a']])car(S,stl(u0,k),4.71,false,c);
        // 人行廣場：噴水池、四棵樹（樹穴）、長椅、人群
        S.o(1.53+4.54+.2,(g2,n2)=>{const p=P(1.53,4.54),x=rnd(p[0]),y=rnd(p[1]);L.ell(g2,x,y,8,4,'#b9b3a6');L.ell(g2,x,y-1,8,4,'#d8d2c4');L.ell(g2,x,y-1,6,3,'#6f9fbf');
          L.ell(g2,x-1,y-2,3,1,'#9cc6de');RC(g2,x,y-6,1,5,'#e6f2f8');RC(g2,x-1,y-5,3,1,'#cfe6f2');if(n2)L.ell(n2,x,y-1,5,2,'#8fc6e8');});
        for(const[u,v]of[[1.12,4.26],[1.92,4.26],[1.12,4.84],[1.92,4.84]]){L.flat(g,u-.06,v-.06,.12,.12,'#8a7a62');tree(S,u,v,.85,(u*10|0)%3);}
        for(const v of[4.4,4.66])for(const u of[1.02,1.98])S.o(u+.04+v+.14,(g2)=>{boxZ(g2,u,v,.04,.14,1,2,'#8a6a4a','#a07d58','#6f5438');});
        crowd(S,scatter(14022,12,1.05,4.18,.95,.72),0,1.1+4.9);
        bus(S,'u',3.5,3.97,'#c8563a',false);bus(S,'u',4.1,3.97,'#e0a33a',false);
        S.o(7.3,(g2,n2)=>{for(const u of[3.25,3.85,4.45])boxZ(g2,u,3.84,.02,.02,1,10,'#c7cbcd','#d6dadc','#8c9296');boxZ(g2,3.15,3.8,1.55,.1,11,1,'#bcc5cc','#eef1f2','#9aa3aa');
          for(const u of[3.4,4.0,4.6]){const p=P(u,3.9,10);RC(g2,p[0],p[1],2,1,'#efe7c6');if(n2)RC(n2,p[0],p[1],2,1,'#fff0c2');}});
        crowd(S,[[3.3,3.86,1],[3.6,3.88,2],[4.0,3.86,5],[4.5,3.87,7]],1,7.35);
        for(const u of[3.15,3.475,3.8])car(S,u,4.24,true,'#e8b62c',null,true);
        for(const[u,v,s,k]of[[3.2,4.7,.8,0],[3.7,4.72,.8,1],[4.2,4.7,.8,2],[4.7,4.72,.8,0],[4.9,3.2,.7,2],[.1,4.95,.7,0],[2.9,4.97,.6,2]])tree(S,u,v,s,k);
        for(const u of[3.45,3.95,4.45])bush(S,u,4.66,2);
        for(const u of[3.42,3.92,4.42])S.o(u+.14+4.56,(g2)=>{boxZ(g2,u,4.52,.14,.04,1,2,'#8a6a4a','#a07d58','#6f5438');});
        for(const u of[.1,.92,2.2,2.85])lamp(S,u,3.82);for(const u of[3.0,4.0,4.95])lamp(S,u,4.9);for(const u of[1.02,2.04])lamp(S,u,4.9);lamp(S,1.9,.15,15,.15);lamp(S,.15,.9,15,.9);
        return{front:(g2)=>{fence(g2,[SZ-E,E],[SZ-E,.95]);}};
      },
    ];
    build(139,dims(139,[336,420,168,418]),SZ,K139);
  }catch(e){console.error('trans_a k139',e);errs.push('k139:'+(e&&e.stack||e));}

  // ================= k55 中央車站（3×3）=================
  try{
    const SZ=3;
    // 古典立面小件
    const K55LIB=(L)=>{const {P,fp,pg,RC,BL,ell,faceL,faceR,boxZ}=L;
      // 拱窗（+v 面／+u 面）：矩形＋圓頂（頂排內縮）
      const archL=(g,u,v,z,w,h,c,top)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h+1,w,h-1,.5,c);if(w>2)pg(g,p[0]+1,p[1]-h+1+(w>3?0:0)-1+Math.floor(.5),w-2,1,.5,c);if(top)pg(g,p[0],p[1]-h+1,w,1,.5,top);};
      const archR=(g,u,v,z,w,h,c,top)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h+1,w,h-1,-.5,c);if(w>2)pg(g,p[0]+1,p[1]-h-1,w-2,1,-.5,c);if(top)pg(g,p[0],p[1]-h+1,w,1,-.5,top);};
      // 穹頂：堆疊橢圓（左亮右暗）＋頂塔
      const dome=(g,n,cu,cv,z0,r,Hd,c)=>{for(let k=0;k<=Hd;k++){const rr=r*Math.sqrt(Math.max(0,1-(k/Hd)*(k/Hd))),p=P(cu,cv,z0+k),rx=Math.max(1,Math.round(45*rr)),ry=Math.max(1,Math.round(22.6*rr));
          ell(g,p[0],p[1],rx,ry,c[2]);if(rx>2)ell(g,p[0]-Math.round(rx*.25),p[1],Math.round(rx*.72),Math.max(1,ry-1),c[1]);if(rx>4)ell(g,p[0]-Math.round(rx*.45),p[1]-1,Math.round(rx*.3),Math.max(1,Math.round(ry*.5)),c[0]);}
        
        
        const top=P(cu,cv,z0+Hd);RC(g,top[0]-1,top[1]-5,3,5,'#d9d2bd');RC(g,top[0]+1,top[1]-5,1,5,'#a39a82');RC(g,top[0]-1,top[1]-6,3,1,'#6f9c8a');RC(g,top[0],top[1]-9,1,3,'#c9a64a');};
      // 古典路燈（黑桿＋燈籠）
      const oldLamp=(S,u,v,h=11,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
        RC(g,x-1,y-1,3,1,'#2a2d30');RC(g,x,y-h,1,h-1,'#3a3f44');RC(g,x+1,y-h+2,1,h-3,'#6c737a');
        RC(g,x-1,y-h-2,3,2,'#f1e3b0');RC(g,x-1,y-h-3,3,1,'#2a2d30');RC(g,x,y-h-4,1,1,'#2a2d30');
        if(n)RC(n,x-1,y-h-2,3,2,'#ffe6a0');});
      // 旗桿
      const flag=(S,u,v,h,c,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x,y-h,1,h,'#e4e6e8');RC(g,x+1,y-h+1,1,h-1,'#9aa1a6');RC(g,x+1,y-h,5,3,c);RC(g,x+1,y-h+2,5,1,A.shade(c,-30));RC(g,x,y-h-1,1,1,'#c9a64a');});
      return{archL,archR,dome,oldLamp,flag};};

    const K55=[
      // v0 Beaux-Arts 石造站房＋鐵拱棚：兩股軌道沿 u 貫穿（島式＋側式月台），後方鐵製玻璃拱形列車棚（深色鋼拱、屋脊玻璃、端部扇形玻璃山牆），
      // 前方淺色石造站房：中央穹頂門樓（大半圓窗、四柱門廊＋山花、大時鐘）、兩翼拱窗＋馬薩式屋頂；站前廣場有落客道、計程車、古典路燈、旗桿。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashU,YEL,WHT,track,platform,curb,fence,crowd,scatter,coachTrain,vault,vaultMouth,lamp,tree,bush,car,signL,clock,boxZ,faceL,faceR,flat,fp,RC,BL,rowL,rowR,pg}=L;
        const X=K55LIB(L),T=[.5,1.1],U0=.12,U1=2.3;
        pave(g,'c',0,0,SZ,SZ,5501);pave(g,'k',0,.04,SZ,.28,5502);
        pave(g,'b',0,.34,SZ,.92,5503);
        for(const[i,c]of T.entries())track(g,'u',c,0,SZ,5504+i);
        platform(g,'u',.6,1.0,.06,2.94);platform(g,'u',1.2,1.48,.06,2.94);
        pave(g,'z',0,2.2,SZ,.8,5506);
        pave(g,'a',.1,2.46,2.8,.26,5507);lineU(g,2.46,.1,2.9,'#d9d6ce');lineU(g,2.72,.1,2.9,'#d9d6ce');
        pave(g,'g',0,2.76,.5,.24,5508);pave(g,'g',2.5,2.76,.5,.24,5509);
        L.shadow(g,[['b',U0,.34,U1-U0,1.16,26],['b',.35,1.5,2.3,.7,22],['b',1.1,1.46,.8,.9,32]]);
        fence(g,[E,E],[SZ-E,E]);
        // 列車：客車在棚內，機車頭自 +u 端駛出
        S.o(.9,(g2)=>vaultMouth(g2,'u',U1,.34,1.5,11));
        coachTrain(S,'u',T[1],2.78-6*.44,6,{Lc:.44,col:'#7a2e2a',roof:'#8d9296',loco:true,locoCol:'#2f5a3c',band:'#d8c28a',dAt:(ba,bb,i)=>i===5?3.1:1.0+bb*.01});
        crowd(S,[[2.45,.95,0],[2.6,.97,2],[2.8,.72,4],[2.5,1.43,1],[2.75,1.44,3]],3,3.2);
        S.o(3.0,(g2,n2)=>vault(g2,n2,'u',U0,U1,.34,1.5,12,18,{seed:5510,ribStep:.18,roof:'#7d8b8d',glass:'#a9c2ca',rib:'#46525a',glassBand:.55,sideWall:false,
          endGlass:'#5f7d8a',endMull:'#39444a',arch:'#3b464c',arch2:'#56636a',beam:'#3b464c',fascia:'#58656b'}));
        // 信號機
        S.t(3.05,(g2,n2)=>{const p=P(2.92,.35);RC(g2,p[0],p[1]-14,1,14,'#3a3f44');RC(g2,p[0]-1,p[1]-16,3,4,'#2a2d30');RC(g2,p[0],p[1]-15,1,1,'#58d27a');if(n2)RC(n2,p[0],p[1]-15,1,1,'#7dffa0');});
        // ---- 石造站房 ----
        S.o(4.0,(g2,n2)=>{const v0=1.5,v1=2.2,ST='#e6dcc6',SD='#c4b699',CR='#f2ead8',SL='#5f6b74',SLd='#48525a';
          const wing=(u0,u1,h)=>{boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,ST,ST,SD);
            for(let z=1;z<6;z+=2)BL(g2,P(u0,v1,z),P(u1,v1,z),'#cfc3a9');for(let z=1;z<6;z+=2)BL(g2,P(u1,v0,z),P(u1,v1,z),'#a99c80');   // 粗石基座
            faceL(g2,v1,u0,u1,6,7,CR);faceR(g2,u1,v0,v1,6,7,'#d3c7ad');
            const nw=Math.floor((u1-u0)/.16);for(let k=0;k<nw;k++){const u=u0+(u1-u0)*(k+.5)/nw-.045;X.archL(g2,u,v1,8,3,8,'#4f6b7e');if(n2&&(k%3!==1))X.archL(n2,u,v1,8,3,8,'#ffe0a0');
              const w=P(u,v1,1);pg(g2,w[0],w[1]-4,3,3,.5,'#6a7f8c');}
            for(let k=0;k<3;k++){const v=v0+(v1-v0)*(k+.5)/3-.04;X.archR(g2,u1,v+.08,8,3,8,'#3f5a6c');}
            faceL(g2,v1,u0,u1,h-3,h,CR);faceR(g2,u1,v0,v1,h-3,h,'#d9ceb6');BL(g2,P(u0,v1,h-3),P(u1,v1,h-3),'#b8ab8f');
            // 馬薩式屋頂＋老虎窗
            const zr=h,e=.07;fp(g2,[P(u0,v0,zr),P(u1,v0,zr),P(u1,v1,zr),P(u0,v1,zr)],SLd);
            fp(g2,[P(u0,v1,zr),P(u1,v1,zr),P(u1-e,v1-e,zr+6),P(u0+e,v1-e,zr+6)],SL);
            fp(g2,[P(u1,v0,zr),P(u1,v1,zr),P(u1-e,v1-e,zr+6),P(u1-e,v0+e,zr+6)],SLd);
            fp(g2,[P(u0+e,v0+e,zr+6),P(u1-e,v0+e,zr+6),P(u1-e,v1-e,zr+6),P(u0+e,v1-e,zr+6)],'#6d7880');
            BL(g2,P(u0+e,v1-e,zr+6),P(u1-e,v1-e,zr+6),'#8e99a1');
            for(let k=0;k<nw;k+=2){const u=u0+(u1-u0)*(k+.5)/nw-.03;boxZ(g2,u,v1-.06,.06,.04,zr+1,4,'#e6dcc6','#efe7d4','#c4b699');X.archL(g2,u+.005,v1-.02,zr+2,2,3,'#3f5a6c');}};
          wing(.3,1.12,20);wing(1.88,2.7,20);
          // 中央門樓
          const cu0=1.1,cu1=1.9,cv1=2.3,H=32;boxZ(g2,cu0,v0-.04,cu1-cu0,cv1-v0+.04,0,H,ST,ST,SD);
          for(let z=1;z<6;z+=2)BL(g2,P(cu0,cv1,z),P(cu1,cv1,z),'#cfc3a9');
          faceL(g2,cv1,cu0,cu0+.05,6,H,'#d6cab1');faceL(g2,cv1,cu1-.05,cu1,6,H,'#d6cab1');                 // 角隅壁柱
          // 大拱窗：15px 寬、8px 直段＋半圓拱；白色豎櫺、拱腳橫檔、石框
          const um=(cu0+cu1)/2,pc=P(um,cv1,12),cx=Math.round(pc[0]),cy=Math.round(pc[1]);
          const ht=x=>8+Math.round(Math.sqrt(Math.max(0,7.6*7.6-x*x)));
          for(let x=-8;x<=8;x++){const t=ht(x)+1,y0=cy+Math.floor(x*.5);RC(g2,cx+x,y0-t,1,1,CR);}
          for(let x=-7;x<=7;x++){const t=ht(x),y0=cy+Math.floor(x*.5);
            for(let k=1;k<=t;k++){const mul=(x===-4||x===0||x===4||k===8);RC(g2,cx+x,y0-k,1,1,mul?'#e9e0cb':'#4f6b7e');if(n2&&!mul)RC(n2,cx+x,y0-k,1,1,'#ffe0a0');}}
          for(let x=-9;x<=9;x++)RC(g2,cx+x,cy+Math.floor(x*.5),1,1,CR);
          // 頂部女兒牆帶＋大時鐘
          faceL(g2,cv1,cu0,cu1,H-5,H,CR);BL(g2,P(cu0,cv1,H-5),P(cu1,cv1,H-5),'#b8ab8f');BL(g2,P(cu0,cv1,H),P(cu1,cv1,H),'#fbf6ea');
          clock(g2,n2,P(um,cv1,H-2),3,'#6b5a3a','#f4f1e6');
          // 四柱門廊：柱、刻站名的簷部
          boxZ(g2,cu0+.03,cv1,cu1-cu0-.06,.16,0,1,'#d9d0bb','#e2d9c4','#b8ab8f');
          faceL(g2,cv1,um-.14,um+.14,1,9,'#3a3026');if(n2)faceL(n2,cv1,um-.13,um+.13,2,9,'#ffe0a0');
          for(const u of[cu0+.07,cu0+.27,cu1-.31,cu1-.11])boxZ(g2,u,cv1+.1,.04,.04,1,9,'#f7f2e6','#f7f2e6','#cfc2a6');
          boxZ(g2,cu0+.03,cv1,cu1-cu0-.06,.16,10,4,'#efe7d4','#f2ead8','#c9bc9f');
          signL(g2,cv1+.16,cu0+.1,cu1-.1,10,14,'#34424e','#e9d49a',5511,n2);
          for(let z=1;z<6;z+=2)BL(g2,P(cu1,v0-.04,z),P(cu1,cv1,z),'#a99c80');faceR(g2,cu1,v0-.04,cv1,6,7,'#d3c7ad');faceR(g2,cu1,v0-.04,cv1,H-5,H,'#d9ceb6');BL(g2,P(cu1,v0-.04,H-5),P(cu1,cv1,H-5),'#a99c80');for(const vv of[v0+.12,v0+.4,v0+.68])X.archR(g2,cu1,vv+.08,9,3,11,'#3f5a6c','#e6dcc6');
          // 屋頂＋鼓座＋穹頂
          flat(g2,cu0,v0-.04,cu1-cu0,cv1-v0+.04,'#8e978c',H);boxZ(g2,um-.24,v0+.14,.48,.48,H,4,'#e6dcc6','#efe7d4','#c4b699');
          for(let k=0;k<4;k++)X.archL(g2,um-.2+k*.11,v0+.62,H+1,1,3,'#4f6b7e');
          X.dome(g2,n2,um,v0+.38,H+4,.25,12,['#b6d6c6','#86b09e','#5d8575']);});
        // ---- 站前廣場 ----
        for(const[u,c]of[[.3,'#2b2e33'],[.52,'#e8b62c'],[.74,'#2b2e33'],[2.1,'#e8b62c'],[2.35,'#2b2e33']])car(S,u,2.5,true,c,null,true);
        car(S,1.3,2.6,true,'#8a3a33');
        for(const u of[1.3,1.5,1.7])X.flag(S,u,2.95,20,u===1.5?'#c0392b':(u<1.4?'#2f5a86':'#e8b62c'));
        for(const u of[.2,.95,2.05,2.8])X.oldLamp(S,u,2.32);for(const u of[.8,2.2])X.oldLamp(S,u,2.95);
        crowd(S,scatter(5512,14,.3,2.24,2.4,.2),0,4.5);crowd(S,scatter(5513,8,.6,2.78,1.9,.18),0,5.0);
        tree(S,.2,2.88,.8,0);tree(S,2.85,2.9,.8,1);bush(S,.42,2.86);bush(S,2.6,2.86);
        return{};
      },
      // v1 現代玻璃站房＋平頂懸挑雨棚：兩股軌道沿 v 貫穿（左側，島式＋側式月台），細柱 T 形懸挑平頂雨棚；右側大片玻璃站房
      // （出挑薄屋頂、站名帶、入口玻璃雨遮），廣場上獨立的時鐘塔柱、計程車排班、腳踏車架、旗桿。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashV,dashU,YEL,WHT,track,platform,stallsU,stallsV,curb,fence,crowd,scatter,coachTrain,lamp,tree,bush,car,signL,signR,clock,curtainL,curtainR,boxZ,faceL,faceR,flat,fp,RC,BL,AXF}=L;
        const X=K55LIB(L),T=[.5,1.1];
        pave(g,'c',0,0,SZ,SZ,5521);pave(g,'b',.34,0,.92,SZ,5522);
        for(const[i,c]of T.entries())track(g,'v',c,0,SZ,5523+i);
        platform(g,'v',.6,1.0,.06,2.94);platform(g,'v',1.2,1.48,.06,2.94);
        pave(g,'z',1.5,1.78,1.5,1.22,5525);
        pave(g,'a',1.55,2.0,1.4,.24,5526);lineU(g,2.0,1.55,2.95,'#d9d6ce');lineU(g,2.24,1.55,2.95,'#d9d6ce');
        pave(g,'a',2.78,.2,.2,1.55,5527);
        pave(g,'g',1.6,2.55,.5,.35,5528);pave(g,'g',2.4,2.55,.5,.35,5529);
        L.shadow(g,[['b',1.52,.3,1.23,1.45,26],['b',.56,.1,.48,2.8,1,12],['b',1.16,.1,.34,2.8,1,12]]);
        fence(g,[E,E],[.32,E]);fence(g,[1.5,E],[SZ-E,E]);fence(g,[E,E],[E,SZ-E]);
        // 列車：通勤電聯車沿 v（車頭朝 +v）
        const emu=(S2,c,b0,n,d)=>{const X2=AXF('v');for(let i=0;i<n;i++){const ba=b0+i*.42+.008,bb=b0+(i+1)*.42-.008,cab=i===n-1;
          S2.o(d+i*.001,(g2,n2)=>{X2.bx(g2,ba,bb-ba,c-.05,.1,0,2,'#2f3235','#3c3f42','#26282a');X2.bx(g2,ba,bb-ba,c-.06,.12,2,8,'#9ea6ac','#eef1f3','#b9c1c7');
            X2.bx(g2,ba+.12,.12,c-.035,.07,10,1,'#6f777d','#7f878d','#5c6369');                                      // 車頂空調（灰色車頂與白色棚板分得開）
            X2.side(g2,c+.06,ba,bb,3,4,'#b83a32');X2.side(g2,c+.06,ba+.02,bb-.02,6,8,'#26313a');
            if(n2)for(let t=ba+.03;t<bb-.04;t+=.05)X2.side(n2,c+.06,t,t+.03,6,8,'#ffe6ae');
            if(cab){X2.end(g2,bb,c-.05,c+.05,5,9,'#26313a');X2.end(g2,bb,c-.06,c+.06,2,4,'#c9453b');const h=X2.pt(bb,c+.04,3);RC(g2,h[0],h[1]-1,1,1,'#fff3c8');if(n2)RC(n2,h[0],h[1]-1,1,1,'#fff3c8');}
            const pn=X2.pt(ba+.2,c,10),pq=X2.pt(ba+.25,c,13);if(i%2===0){BL(g2,pn,pq,'#555b60');BL(g2,[pq[0]-2,pq[1]],[pq[0]+2,pq[1]],'#555b60');}});}};
        emu(S,T[1],2.86-6*.42,6,2.1);
        // 平頂懸挑雨棚（細柱＋T 形懸臂、白色薄板、深色簷口）
        // T612 退件修：兩座月台各一道 T 形懸挑雨棚——棚板比月台窄、兩棚之間留 .3 格空隙讓列車（灰色車頂）露出來；
        // 深灰細柱（2px）＋柱頂 Y 形斜撐伸到兩側棚緣；棚板淺色、+u 側深色簷口；最前一根柱落在棚端內 .08，從正面看得到 T 形。
        const cant=(a0,a1,cm,b0,b1,d)=>S.o(d,(g2,n2)=>{const X2=AXF('v'),z=13;
          for(let b=b1-.08;b>b0+.05;b-=.34){X2.bx(g2,b-.012,.024,cm-.012,.024,3,z-3,'#4a5258','#5c656b','#3a4146');
            BL(g2,X2.pt(b,cm,z-4),X2.pt(b,a0+.02,z-1),'#4a5258');BL(g2,X2.pt(b,cm,z-4),X2.pt(b,a1-.02,z-1),'#4a5258');}
          X2.bx(g2,b0,b1-b0,a0,a1-a0,z,1,'#dfe5e8','#f2f5f6','#4d575e');
          for(let b=b0+.1;b<b1-.02;b+=.1)BL(g2,X2.pt(b,a0,z+1),X2.pt(b,a1,z+1),'#c7d0d5');BL(g2,X2.pt(b0,cm,z+1),X2.pt(b1,cm,z+1),'#b9c3c9');
          for(let b=b0+.12;b<b1-.08;b+=.34){const p=X2.pt(b,a1,z);RC(g2,p[0],p[1]-1,2,1,'#efe7c6');if(n2)RC(n2,p[0],p[1]-1,2,1,'#fff0c2');}});
        cant(.64,.96,.8,.12,2.42,2.0);
        crowd(S,[[.95,.4,0],[.97,.9,2],[.96,1.5,4],[.98,2.1,6],[.9,2.62,3]],3,1.9);                                   // 島式月台（在列車後）
        crowd(S,[[1.42,.6,1],[1.44,1.3,3],[1.43,2.0,5],[1.45,2.6,7]],3,2.3);                                          // 側式月台（在列車前）
        cant(1.27,1.47,1.37,.12,2.0,2.2);
        // ---- 玻璃站房 ----
        // T612 退件修：屋頂改成有層次——低層玻璃量體（h18）上坐一段中央高起的大廳量體（玻璃高窗＋弧形屋頂），
        // 兩側屋面各一條有框的採光天窗條帶；立面全寬深藍站名帶（5×5 方塊字＋紅圓站徽，取代量販店式紅色簷帶）；入口淺玻璃雨遮。
        // 量體分三層：月台側一段低矮玻璃連通廊（h9，不擋側式月台雨棚）→ 主玻璃量體（h18）→ 中央高起大廳（h30＋弧頂）。
        S.o(3.0,(g2,n2)=>{const c0=1.52,u0=1.74,u1=2.75,v0=.3,v1=1.75,h=18,ha=1.98,hb=2.52,hv0=.42,hv1=1.56,H=30,um=(u0+u1)/2;
          // 低矮連通廊
          boxZ(g2,c0,v0,u0-c0,v1-v0,0,9,'#c3cbd0','#e8ebec','#aab1b6');
          curtainL(g2,n2,v1,c0+.02,u0-.02,1,9,{glass:'#86aac0',mull:'#e6ecef',fh:4,mw:3,seed:5538,lit:.85});
          flat(g2,c0+.03,v0+.03,u0-c0-.06,v1-v0-.06,'#aab3b9',9);flat(g2,c0+.07,v0+.1,.08,v1-v0-.2,'#9cc0d2',9);
          for(let v=v0+.2;v<v1-.1;v+=.12)BL(g2,P(c0+.07,v,9),P(c0+.15,v,9),'#6f8a99');
          faceL(g2,v1,c0,u0,8,9,'#f2f4f5');
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#b7bec3','#e8ebec','#aab1b6');
          curtainL(g2,n2,v1,u0+.03,u1-.03,1,h-8,{glass:'#86aac0',mull:'#e6ecef',fh:5,mw:4,seed:5530,lit:.9});
          curtainR(g2,n2,u1,v0+.03,v1-.03,1,h,{glass:'#58788e',mull:'#9fb0bc',fh:6,mw:5,seed:5531,lit:.8});
          faceL(g2,v1,u0,u1,0,1,'#8f969b');
          signL(g2,v1,u0+.02,u1-.02,h-8,h-1,'#1c2e3e','#f1f4f6',5532,n2);
          faceL(g2,v1,u0,u1,h-1,h,'#f2f4f5');faceR(g2,u1,v0,v1,h-1,h,'#c3cacf');
          faceL(g2,v1,um-.2,um+.2,1,8,'#2f4354');for(let u=um-.1;u<um+.2;u+=.1)BL(g2,P(u,v1,1),P(u,v1,8),'#9fb0bc');if(n2)faceL(n2,v1,um-.19,um+.19,2,8,'#ffe6ae');
          // 屋面：女兒牆內鋪面＋採光天窗條帶＋空調機
          flat(g2,u0+.03,v0+.03,u1-u0-.06,v1-v0-.06,'#a3acb2',h);
          for(const u of[u0+.07,hb+.06]){flat(g2,u,v0+.22,.1,v1-v0-.32,'#5f7b8b',h);flat(g2,u+.015,v0+.235,.07,v1-v0-.35,'#a6c6d6',h);
            for(let v=v0+.34;v<v1-.12;v+=.12)BL(g2,P(u,v,h),P(u+.1,v,h),'#6f8a99');}
          boxZ(g2,u0+.05,v0+.05,.14,.1,h,3,'#b9c1c6','#cdd4d8','#a7afb4');boxZ(g2,hb+.05,v0+.05,.14,.1,h,3,'#b9c1c6','#cdd4d8','#a7afb4');
          // 中央高起大廳
          boxZ(g2,ha,hv0,hb-ha,hv1-hv0,h,H-h,'#c9d0d5','#e8ebec','#aab1b6');
          curtainL(g2,n2,hv1,ha+.02,hb-.02,h,H,{glass:'#8bb0c6',mull:'#eaf0f2',fh:4,mw:3,seed:5536,lit:.85});
          curtainR(g2,n2,hb,hv0+.02,hv1-.02,h,H,{glass:'#5a7b91',mull:'#a2b3be',fh:4,mw:4,seed:5537,lit:.8});
          L.vault(g2,n2,'v',hv0,hv1,ha,hb,H,6,{sideWall:false,endCols:false,zo:H,seed:5535,ribStep:.2,glassBand:.35,roof:'#dfe4e7',glass:'#a3bfcf',rib:'#9aa4ab',
            endGlass:'#86a6ba',endMull:'#e8edf0',fascia:'#aab1b6'});
          // 站徽：高起大廳正面的紅圓白槓大徽章（白色外環）
          {const p=P((ha+hb)/2,hv1,24);L.ell(g2,p[0],p[1],4,4,'#f4f6f7');L.ell(g2,p[0],p[1],3,3,'#c8352c');RC(g2,p[0]-2,p[1],5,1,'#f4f6f7');
            if(n2){L.ell(n2,p[0],p[1],3,3,'#ff8f78');RC(n2,p[0]-2,p[1],5,1,'#fff4e8');}}
          // 入口雨遮
          boxZ(g2,um-.26,v1,.52,.1,8,1,'#cfe0e8','#eef3f5','#9fb3bf');});
        // ---- 廣場：站鐘柱（細、深金屬灰）、計程車、腳踏車架、旗桿 ----
        // 站鐘柱移到廣場右前角：畫面上整支落在站房立面下緣之下，不再疊在入口或雨棚前面
        S.o(2.9+2.75+.1,(g2,n2)=>{boxZ(g2,2.9,2.75,.045,.045,0,22,'#7a8389','#8d969c','#5f676d');boxZ(g2,2.885,2.735,.075,.075,0,2,'#5f676d','#6f787e','#4f565b');
          clock(g2,n2,P(2.922,2.795,25),3,'#3a4046');});
        for(const[u,c,t]of[[1.62,'#e8b62c',1],[1.84,'#e8b62c',1],[2.06,'#e8b62c',1],[2.4,'#3d5f8a',0],[2.66,'#e8ecee',0]])car(S,u,2.05,true,c,null,t);
        for(const v of[.35,.75,1.2])car(S,2.8,v,false,['#b8433a','#5d6468','#e8ecee'][Math.round(v*3)%3],3.1+v);
        S.o(2.9+2.9,(g2)=>{for(let k=0;k<8;k++){const u=2.35+k*.07;BL(g2,P(u,2.66,0),P(u,2.66,3),'#50585e');RC(g2,P(u,2.7)[0],P(u,2.7)[1]-3,1,3,['#b8433a','#3d5f8a','#4a6b45','#c49a3a'][k%4]);}});
        for(const u of[2.2,2.34,2.48])X.flag(S,u,2.95,18,u===2.34?'#2f5a86':'#c0392b',2.95+u+.05);                   // 旗桿移到廣場前緣，不擋站名帶
        crowd(S,scatter(5533,14,1.6,1.8,1.3,.18),0,3.6);crowd(S,scatter(5534,10,1.6,2.3,1.3,.6),0,4.8);
        tree(S,1.85,2.72,.8,0);tree(S,2.65,2.72,.8,1);tree(S,1.6,2.95,.7,2);
        for(const v of[.1,2.95])lamp(S,1.52,v);lamp(S,2.95,1.85);
        return{front:(g2)=>{fence(g2,[SZ-E,E],[SZ-E,1.72]);}};
      },
      // v2 紅磚維多利亞站房＋鐘塔：兩股軌道沿 v 貫穿（右側，側式＋島式月台）；左側一棟兩層紅磚站房（石材腰線、白框拱窗、灰石板雙坡屋頂、煙囪），
      // 前端高聳鐘塔（四面鐘、尖頂）；軌道上方維多利亞式雙坡列車棚（屋脊玻璃天窗、鋸齒木簷板、鑄鐵柱）；右側號誌樓；站前紅磚廣場。
      (g,ng,S,L,K)=>{const {P,pave,lineU,lineV,dashU,YEL,WHT,track,platform,curb,fence,crowd,scatter,coachTrain,lamp,tree,bush,car,signL,clock,boxZ,faceL,faceR,flat,fp,RC,BL,pg,rowR,rowL,AXF}=L;
        // T612 退件修：列車棚縮到 v 2.1（客車整節露出）；+u 側原本整條空碎石地改成行李包裹側線＋包裹月台（車擋、行李車、推車、郵袋、包裹房）
        const X=K55LIB(L),T=[1.5,2.1],SB1=2.1,TS=2.46;
        pave(g,'c',0,0,SZ,SZ,5541);pave(g,'b',1.36,0,.9,SZ,5542);
        for(const[i,c]of T.entries())track(g,'v',c,0,SZ,5543+i);
        platform(g,'v',1.14,1.4,.06,2.94);platform(g,'v',1.6,2.0,.06,2.94);
        pave(g,'r',0,2.3,1.14,.7,5545);
        pave(g,'a',.06,2.66,1.06,.2,5546);
        pave(g,'q',2.28,.04,.7,1.36,5547);                                               // 號誌樓周邊：低密度細碎石
        track(g,'v',TS,1.36,SZ,5560);                                                    // 包裹側線（-v 端車擋，+v 端接出佔地）
        boxZ(g,2.56,1.44,.36,1.5,0,3,'#cdc6b6','#aaa191','#8f8778');                    // 包裹月台
        lineV(g,2.572,1.44,2.94,'#ebe6da');lineV(g,2.61,1.46,2.92,'#d8b640');
        pave(g,'g',0,0,.24,2.3,5548);
        L.fp(g,L.Q(1.12,.25,1.14,SB1-.25),'rgba(24,30,34,.38)');                         // 棚內暗部（從拱口看進去的軌道與月台）
        L.shadow(g,[['b',.26,.4,.84,1.9,26],['b',.32,2.28,.36,.36,46],['b',1.12,.25,1.14,SB1-.25,20],['b',2.45,.9,.4,.36,20],['b',2.6,1.48,.3,.34,12],['b',TS-.06,1.56,.12,.46,9],['b',2.5,.2,.3,.3,20]]);
        fence(g,[E,E],[SZ-E,E]);fence(g,[E,E],[E,2.28]);
        // 號誌樓（右側）
        S.o(2.45+1.26+.2,(g2,n2)=>{const u0=2.45,v0=.9,u1=2.85,v1=1.26;boxZ(g2,u0,v0,u1-u0,v1-v0,0,12,'#8f3f30','#a4553f','#7a3c2d');
          boxZ(g2,u0-.02,v0-.02,u1-u0+.04,v1-v0+.04,12,7,'#d9d2c0','#e8e1cf','#b9b09c');rowL(g2,n2,u0,u1,v1+.02,13,3,4,1,'#4f6b7e',5549,.9);X.archR(g2,u1+.02,v0+.2,13,3,4,'#3f5a6c');
          const r=[P(u0-.05,v0-.05,19),P(u1+.05,v0-.05,19),P(u1+.05,v1+.05,19),P(u0-.05,v1+.05,19)],tp=P((u0+u1)/2,(v0+v1)/2,26);
          fp(g2,[r[0],r[1],tp],'#4e5860');fp(g2,[r[3],r[0],tp],'#4e5860');fp(g2,[r[2],r[3],tp],'#6a757e');fp(g2,[r[1],r[2],tp],'#434c53');
          for(let z=2;z<11;z+=3)BL(g2,P(u0,v1,z),P(u1,v1,z),'#8f4a38');rowR(g2,n2,u1,v0+.04,v1-.04,4,2,4,3,'#3f5a6c',5550,.3);});
        // 水塔（號誌樓後方：紅磚塔座＋鉚接鐵水箱＋頂蓋）
        S.o(2.8+.5+.2,(g2)=>{boxZ(g2,2.52,.22,.26,.26,0,11,'#8f3f30','#a4553f','#7a3c2d');for(let z=3;z<11;z+=3){BL(g2,P(2.52,.48,z),P(2.78,.48,z),'#8f4a38');BL(g2,P(2.78,.22,z),P(2.78,.48,z),'#6c3427');}
          faceL(g2,.48,2.6,2.68,1,7,'#3a3026');
          boxZ(g2,2.48,.18,.34,.34,11,8,'#3f4a47','#56635f','#39433f');for(const z of[13,16])BL(g2,P(2.48,.52,z),P(2.82,.52,z),'#46524e');for(const z of[13,16])BL(g2,P(2.82,.18,z),P(2.82,.52,z),'#2f3835');
          const tp=[P(2.46,.16,19),P(2.84,.16,19),P(2.84,.54,19),P(2.46,.54,19)],pk=P(2.65,.35,23);fp(g2,[tp[3],tp[0],pk],'#5b666d');fp(g2,[tp[2],tp[3],pk],'#6a757e');fp(g2,[tp[1],tp[2],pk],'#48525b');});
        // ---- 包裹側線與包裹月台 ----
        // 車擋（紅白橫樑＋兩個緩衝器）
        S.o(TS+.08+1.44,(g2)=>{boxZ(g2,TS-.09,1.37,.18,.05,0,5,'#c0392b','#d9483a','#962d22');faceL(g2,1.42,TS-.07,TS+.07,3,4,'#f1ede4');
          for(const a of[TS-.05,TS+.04])boxZ(g2,a,1.42,.02,.03,2,2,'#3a3f44','#4a5055','#2c3034');});
        // 行李車廂（棕色、推拉門）
        S.o(TS+.06+2.06,(g2,n2)=>{const X2=AXF('v');X2.bx(g2,1.6,.42,TS-.04,.08,0,2,'#2f3235','#3c3f42','#26282a');
          X2.bx(g2,1.56,.5,TS-.06,.12,2,7,'#7a8085','#8a5e42','#5f4230');fp(g2,[X2.pt(1.56,TS-.06,9),X2.pt(2.06,TS-.06,9),X2.pt(2.06,TS,10),X2.pt(1.56,TS,10)],'#8a9095');
          X2.side(g2,TS+.06,1.74,1.88,3,8,'#4a3326');BL(g2,X2.pt(1.66,TS+.06,8),X2.pt(1.96,TS+.06,8),'#3a2a20');X2.side(g2,TS+.06,1.6,1.66,5,7,'#2d3a44');
          const p=X2.pt(1.8,TS+.06,5);if(n2)X2.side(n2,TS+.06,1.75,1.87,4,7,'#ffd890');});
        // 包裹房（月台 -v 端、紅磚、雙坡頂、門與窗、招牌）
        S.o(2.9+1.82,(g2,n2)=>{const u0=2.6,u1=2.9,v0=1.48,v1=1.82,h=10;boxZ(g2,u0,v0,u1-u0,v1-v0,3,h,'#8f3f30','#a4553f','#7a3c2d');
          for(let z=5;z<3+h;z+=3){BL(g2,P(u0,v1,z),P(u1,v1,z),'#8f4a38');BL(g2,P(u1,v0,z),P(u1,v1,z),'#6c3427');}
          faceL(g2,v1,u0+.04,u0+.13,3,10,'#3a3026');faceL(g2,v1,u0+.17,u1-.04,6,10,'#4f6b7e');if(n2)faceL(n2,v1,u0+.18,u1-.05,7,10,'#ffe0a0');
          rowR(g2,n2,u1,v0+.04,v1-.04,6,3,4,3,'#3f5a6c',5562,.5);
          const r0=[P(u0-.03,v0-.03,3+h),P(u0-.03,v1+.03,3+h)],um=(u0+u1)/2;
          fp(g2,[P(u0-.03,v0-.03,3+h),P(u0-.03,v1+.03,3+h),P(um,v1+.03,3+h+6),P(um,v0-.03,3+h+6)],'#56606a');
          fp(g2,[P(um,v0-.03,3+h+6),P(um,v1+.03,3+h+6),P(u1+.03,v1+.03,3+h),P(u1+.03,v0-.03,3+h)],'#48525b');
          fp(g2,[P(u0,v1+.03,3+h),P(u1,v1+.03,3+h),P(um,v1+.03,3+h+6)],'#a4553f');BL(g2,P(u0-.03,v1+.03,3+h),P(um,v1+.03,3+h+6),'#e3d6b8');BL(g2,P(um,v1+.03,3+h+6),P(u1+.03,v1+.03,3+h),'#e3d6b8');
          signL(g2,v1+.03,u0+.04,u1-.04,3+h-1,3+h+2,'#2e3a36','#e9d49a',5563,n2);});
        // 推車（行李、包裹、郵袋）
        const trolley=(u,v,kind)=>S.o(u+.08+v+.16,(g2)=>{boxZ(g2,u,v,.08,.16,4,1,'#5a6166','#7a8186','#474d52');
          for(const b of[v+.02,v+.12]){const p=P(u+.08,b,3);RC(g2,p[0],p[1]-1,1,1,'#22262a');}
          if(kind===0){boxZ(g2,u+.01,v+.02,.06,.06,5,3,'#c9a878','#d8b98a','#a8895e');boxZ(g2,u+.01,v+.09,.06,.05,5,2,'#b58a5a','#c69a68','#94714a');}
          else if(kind===1){for(const b of[v+.03,v+.09]){const p=P(u+.04,b,6);L.ell(g2,p[0],p[1],2,2,'#9a8f78');L.ell(g2,p[0]-1,p[1]-1,1,1,'#b9ae95');}}
          else{boxZ(g2,u+.01,v+.02,.06,.12,5,2,'#4f6e8a','#5f82a0','#3f5a72');boxZ(g2,u+.02,v+.04,.04,.06,7,2,'#c0392b','#d9483a','#962d22');}
          BL(g2,P(u,v+.16,4),P(u,v+.16,8),'#3a3f44');});
        trolley(2.7,1.94,0);trolley(2.72,2.2,2);trolley(2.68,2.46,1);trolley(2.74,2.7,0);
        crowd(S,[[2.62,2.4,1],[2.64,2.64,3],[2.62,2.88,7]],3,TS+.2+2.9);
        // 列車（沿 v，機車頭朝 +v）：機車頭＋一節客車在棚外，其餘在棚內（拱口看得到）
        coachTrain(S,'v',T[0],2.94-6*.42,6,{Lc:.42,col:'#6d2a26',roof:'#7f8589',loco:true,locoCol:'#2e5238',band:'#d6bf86',dAt:(ba,bb,i)=>i===5?4.0:(i===4?3.95:1.0+bb*.01)});
        crowd(S,[[1.3,2.25,6],[1.35,2.62,0],[1.26,2.84,2]],3,3.9);crowd(S,[[1.66,2.3,5],[1.94,2.5,1],[1.7,2.8,3]],3,4.1);
        // 維多利亞雙坡列車棚（脊沿 v）
        S.o(3.0,(g2,n2)=>{const X2=AXF('v'),a0=1.12,a1=2.26,b0=.25,b1=SB1,ze=12,zr=22,am=(a0+a1)/2;
          for(let b=b0+.12;b<b1;b+=.4){X2.bx(g2,b-.01,.02,a1-.03,.02,3,ze-3,'#2e3a36','#3c4a45','#26302c');}
          fp(g2,[X2.pt(b0,a0,ze),X2.pt(b1,a0,ze),X2.pt(b1,am,zr),X2.pt(b0,am,zr)],'#5b666d');
          fp(g2,[X2.pt(b0,am,zr),X2.pt(b1,am,zr),X2.pt(b1,a1,ze),X2.pt(b0,a1,ze)],'#4a545b');
          for(let b=b0+.1;b<b1;b+=.1){BL(g2,X2.pt(b,am,zr),X2.pt(b,a1,ze),'#3f484e');BL(g2,X2.pt(b,am,zr),X2.pt(b,a0,ze),'#6b767d');}
          fp(g2,[X2.pt(b0,am-.18,zr-3),X2.pt(b1,am-.18,zr-3),X2.pt(b1,am,zr),X2.pt(b0,am,zr)],'#a9c2ca');
          fp(g2,[X2.pt(b0,am,zr),X2.pt(b1,am,zr),X2.pt(b1,am+.18,zr-3),X2.pt(b0,am+.18,zr-3)],'#7f9aa4');
          for(let b=b0+.1;b<b1;b+=.1)BL(g2,X2.pt(b,am,zr),X2.pt(b,am+.18,zr-3),'#5c7480');
          boxZ(g2,am-.03,b0,.06,b1-b0,zr,2,'#9aa6ac','#8a969c','#6a767c');
          // 鋸齒木簷板（+u 側）
          for(let b=b0;b<b1-.01;b+=.04){const p=X2.pt(b,a1,ze),q=X2.pt(b+.04,a1,ze);fp(g2,[[p[0],p[1]],[q[0],q[1]],[(p[0]+q[0])/2,(p[1]+q[1])/2+3]],'#c9b48a');}
          BL(g2,X2.pt(b0,a1,ze),X2.pt(b1,a1,ze),'#8f7d58');
          // +v 端山牆（T612 退件修）：上半部玻璃扇窗（淺藍＋放射鐵格線＋同心拱環），下半部只留一個跨兩股軌道的大拱口、
          // 兩側紅磚墩；拱口裡面不塗色——直接看到地坪上延伸進棚內的軌道與月台（地坪已壓暗）和棚內的客車。
          const rz=a=>a<=am?ze+(zr-ze)*(a-a0)/(am-a0):ze+(zr-ze)*(a1-a)/(a1-am);
          const oa0=1.2,oa1=2.2,zs=4,zc=13,om=(oa0+oa1)/2,ow=(oa1-oa0)/2,az=(a,s=1)=>zs+s*(zc-zs)*Math.sqrt(Math.max(0,1-((a-om)/(ow*s))**2));
          const NA=36,top=[],arc=[];for(let i=0;i<=NA;i++){const a=a0+(a1-a0)*i/NA;top.push(X2.pt(b1,a,rz(a)));}
          for(let i=0;i<=NA;i++){const a=oa1-(oa1-oa0)*i/NA;arc.push(X2.pt(b1,a,az(a)));}
          fp(g2,[...top,X2.pt(b1,a1,0),X2.pt(b1,oa1,0),...arc,X2.pt(b1,oa0,0),X2.pt(b1,a0,0)],'#a5c4d1');
          // 放射鐵格線（自拱心向外到屋頂線）
          for(let k=1;k<10;k++){const th=Math.PI*k/10,ca=Math.cos(th),sa=Math.sin(th);let s=1,a=om+ow*ca,z=zs+(zc-zs)*sa;const st=[a,z];
            while(s<4){const a2=om+ow*ca*(s+.02),z2=zs+(zc-zs)*sa*(s+.02);if(a2<a0+.02||a2>a1-.02||z2>rz(a2)-.5)break;s+=.02;a=a2;z=z2;}
            BL(g2,X2.pt(b1,st[0],st[1]),X2.pt(b1,a,z),'#3d4c46');}
          // 同心拱環（外環鐵、內環乳白木作）
          for(let i=0;i<NA;i++){const a=oa1-(oa1-oa0)*i/NA,a2=oa1-(oa1-oa0)*(i+1)/NA;
            BL(g2,X2.pt(b1,a,az(a)+1),X2.pt(b1,a2,az(a2)+1),'#ede5cc');BL(g2,X2.pt(b1,a,az(a)+2),X2.pt(b1,a2,az(a2)+2),'#3d4c46');}
          {const s=1.5;let prev=null;for(let i=0;i<=NA;i++){const a=om+ow*s*Math.cos(Math.PI*i/NA),z=zs+(zc-zs)*s*Math.sin(Math.PI*i/NA);
            const ok=a>a0+.02&&a<a1-.02&&z<rz(a)-1;if(ok&&prev)BL(g2,prev,X2.pt(b1,a,z),'#3d4c46');prev=ok?X2.pt(b1,a,z):null;}}
          // 兩側紅磚墩（到簷高）＋石帽
          for(const[p0,p1]of[[a0,oa0],[oa1,a1]]){X2.end(g2,b1,p0,p1,0,ze,'#a4553f');for(let z=3;z<ze;z+=3)BL(g2,X2.pt(b1,p0,z),X2.pt(b1,p1,z),'#8f4a38');X2.end(g2,b1,p0,p1,ze-1,ze+1,'#e3d6b8');}
          BL(g2,X2.pt(b1,a0,ze),X2.pt(b1,am,zr),'#c9b48a');BL(g2,X2.pt(b1,am,zr),X2.pt(b1,a1,ze),'#c9b48a');
          if(n2){for(let a=a0+.12;a<a1-.12;a+=.1){if(L.hsh(5564,a*100|0,1)>.55)continue;const zb=Math.max(az(a),ze-2)+3,zt=rz(a)-2;if(zt-zb>=2)X2.end(n2,b1,a,a+.06,zb,Math.min(zt,zb+4),'rgba(255,224,150,.8)');}}});
        // ---- 紅磚站房（雙坡屋頂、脊沿 v）＋鐘塔 ----
        S.o(3.5,(g2,n2)=>{const u0=.26,u1=1.1,v0=.4,v1=2.3,h=18,BR='#a4553f',BD='#7a3c2d',SB='#e3d6b8';
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,BR,BR,BD);
          for(let z=3;z<h;z+=3){BL(g2,P(u1,v0,z),P(u1,v1,z),'#6c3427');}
          faceR(g2,u1,v0,v1,0,2,'#8a8074');faceR(g2,u1,v0,v1,8,9,'#cdbf9f');faceR(g2,u1,v0,v1,h-2,h,'#cdbf9f');
          faceL(g2,v1,u0,u1,0,2,'#9c9184');faceL(g2,v1,u0,u1,8,9,SB);faceL(g2,v1,u0,u1,h-2,h,SB);
          for(let k=0;k<9;k++){const v=v0+.08+k*.2;X.archR(g2,u1,v+.08,2,3,5,'#3a4f5e',SB);X.archR(g2,u1,v+.08,10,3,6,'#3a4f5e',SB);
            if(n2&&k%2===0)X.archR(n2,u1,v+.08,10,3,6,'#ffe0a0');if(n2&&k%3!==2)X.archR(n2,u1,v+.08,2,3,5,'#ffe0a0');}
          // 月台側鑄鐵玻璃雨遮
          fp(g2,[P(u1,v0+.1,10),P(u1,v1-.1,10),P(u1+.14,v1-.1,8),P(u1+.14,v0+.1,8)],'#9fb4bc');BL(g2,P(u1+.14,v0+.1,8),P(u1+.14,v1-.1,8),'#3c4a45');
          for(let v=v0+.2;v<v1-.1;v+=.3)BL(g2,P(u1+.12,v,8),P(u1+.12,v,3),'#3c4a45');
          // 雙坡石板屋頂（脊沿 v）
          const um=(u0+u1)/2,zr=h+10;fp(g2,[P(u0-.03,v0-.03,h),P(u0-.03,v1+.03,h),P(um,v1+.03,zr),P(um,v0-.03,zr)],'#56606a');
          fp(g2,[P(um,v0-.03,zr),P(um,v1+.03,zr),P(u1+.03,v1+.03,h),P(u1+.03,v0-.03,h)],'#48525b');
          for(let v=v0+.05;v<v1;v+=.08)BL(g2,P(um,v,zr),P(u1+.03,v,h),'#3e474f');
          fp(g2,[P(u0,v1+.03,h),P(u1,v1+.03,h),P(um,v1+.03,zr)],BR);BL(g2,P(u0-.03,v1+.03,h),P(um,v1+.03,zr),SB);BL(g2,P(um,v1+.03,zr),P(u1+.03,v1+.03,h),SB);
          BL(g2,P(um,v0-.03,zr),P(um,v1+.03,zr),'#7b8690');
          for(const v of[.7,1.3,1.9]){boxZ(g2,um+.04,v,.08,.08,zr-4,8,'#8a3f30','#a4553f','#7a3c2d');boxZ(g2,um+.03,v-.01,.1,.1,zr+4,1,'#c9b89a','#d8c8a8','#a8987c');}
          // 入口（+v 端）：拱門＋玻璃雨遮
          X.archL(g2,.78,v1,0,5,9,'#3a3026',SB);if(n2)X.archL(n2,.79,v1,1,3,7,'#ffe0a0');
          fp(g2,[P(.7,v1,10),P(1.02,v1,10),P(1.02,v1+.16,8),P(.7,v1+.16,8)],'#a9c2ca');BL(g2,P(.7,v1+.16,8),P(1.02,v1+.16,8),'#3c4a45');
          // 鐘塔
          const tu0=.3,tu1=.66,tv0=v1-.06,tv1=v1+.3,th=42,tm=(tu0+tu1)/2,tvm=(tv0+tv1)/2;
          boxZ(g2,tu0,tv0,tu1-tu0,tv1-tv0,0,th,BR,BR,BD);
          for(let z=4;z<th;z+=4)BL(g2,P(tu1,tv0,z),P(tu1,tv1,z),'#6c3427');
          faceL(g2,tv1,tu0,tu1,0,2,'#9c9184');faceL(g2,tv1,tu0,tu1,14,15,SB);faceL(g2,tv1,tu0,tu1,26,27,SB);faceR(g2,tu1,tv0,tv1,14,15,'#cdbf9f');faceR(g2,tu1,tv0,tv1,26,27,'#cdbf9f');
          X.archL(g2,tm-.05,tv1,17,3,7,'#3a4f5e',SB);X.archR(g2,tu1,tvm+.06,17,3,7,'#2f4252','#cdbf9f');
          X.archL(g2,tm-.05,tv1,5,3,7,'#3a4f5e',SB);if(n2)X.archL(n2,tm-.05,tv1,5,3,7,'#ffe0a0');
          boxZ(g2,tu0-.03,tv0-.03,tu1-tu0+.06,tv1-tv0+.06,th-8,2,'#e3d6b8','#eee3c9','#c2b391');
          clock(g2,n2,P(tm,tv1+.03,th-2),3,'#3a3026','#f4f1e6');
          {const p=P(tu1+.03,tvm,th-2);L.ell(g2,p[0],p[1],3,3,'#3a3026');L.ell(g2,p[0],p[1],2,3,'#e6e1d2');RC(g2,p[0],p[1]-2,1,2,'#22262a');if(n2)L.ell(n2,p[0],p[1],2,3,'#fff4d6');}
          boxZ(g2,tu0-.03,tv0-.03,tu1-tu0+.06,tv1-tv0+.06,th+4,2,'#e3d6b8','#eee3c9','#c2b391');
          const r=[P(tu0-.04,tv0-.04,th+6),P(tu1+.04,tv0-.04,th+6),P(tu1+.04,tv1+.04,th+6),P(tu0-.04,tv1+.04,th+6)],sp=P(tm,tvm,th+26);
          fp(g2,[r[0],r[1],sp],'#4e5860');fp(g2,[r[3],r[0],sp],'#4e5860');fp(g2,[r[2],r[3],sp],'#66717a');fp(g2,[r[1],r[2],sp],'#434c53');
          BL(g2,r[2],sp,'#8a959e');RC(g2,sp[0],sp[1]-4,1,4,'#c9a64a');});
        // ---- 站前紅磚廣場 ----
        for(const[u,c]of[[.12,'#2b2e33'],[.34,'#e8b62c'],[.9,'#2b2e33']])car(S,u,2.7,true,c,null,true);
        for(const[u,v]of[[.08,2.4],[1.08,2.4],[.08,2.95],[1.08,2.95]])X.oldLamp(S,u,v);
        X.flag(S,1.08,2.56,20,'#2f5a86',1.08+2.56+.02);
        crowd(S,scatter(5551,10,.7,2.36,.4,.28),0,3.6);crowd(S,scatter(5552,6,.1,2.9,1.0,.08),0,4.0);
        tree(S,.12,.6,.9,0);tree(S,.12,1.3,.9,1);tree(S,.12,2.0,.8,2);bush(S,1.0,2.95);
        return{front:(g2)=>{fence(g2,[SZ-E,E],[SZ-E,SZ-E]);}};
      },
    ];
    build(55,dims(55,[208,220,104,218]),SZ,K55);
  }catch(e){console.error('trans_a k55',e);errs.push('k55:'+(e&&e.stack||e));}

  if(errs.length)window.__trans_a_errs=errs;
  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
