// cul_b：水族館 k37（2×2，畫布 136×150，錨 68,148）／電影院 k40（1×1，畫布 72×112，錨 36,110）——實驗線文化休閒第三刀重畫。
//   k37 v0 波浪屋頂主館＋海豚表演池（直排看台）＋前廣場＋停車場
//       v1 圓柱大水槽館（玻璃圓筒）＋前翼入口棟＋海獅圓池（弧形看台）＋美食廣場
//       v2 現代方盒主館＋館前看台＋前庭海豚潟湖＋右側入口廣場＋巴士停車場
//   k40 v0 老式單廳 Art Deco：招牌塔＋跑馬燈雨遮＋售票亭，後方無窗放映廳
//       v1 現代影城：玻璃大廳＋深灰金屬放映廳量體＋大海報燈箱
//       v2 紅磚倉庫改建：山牆立面＋鋼構玻璃入口＋橫式燈泡招牌＋側牆舊字
// 分層合成：地坪直接畫；立體件各自二值化＋深色外框，依深度由後往前；細線件（人、欄杆、旗桿）不描邊。
// 光從左：+v 面亮、+u 面暗；落影向右。夜圖只點白天畫出的燈具、窗、招牌。零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function cul_b(A){
  // 注入測試時本批次排在內嵌 b0x（會蓋掉 37／40 的 _1_0…_1_2）之前 ⇒ 不是最後一棒就把本體排到隊尾再跑（同 trans_b／bay_a）；正式整合接在最後則直接執行
  const QL=window.__variants574||[];
  if(!cul_b.__late&&QL.indexOf(cul_b)>=0&&QL.indexOf(cul_b)<QL.length-1){cul_b.__late=1;QL.push(function cul_b_late(A2){cul_b(A2);});return;}
  const B=A.SPR().bld,rnd=Math.round;
  const errs=[];window.__cul_b_errs=errs;
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w|0,o.h|0,o.ax|0,o.ay|0]:d;};

  // 3×5 像素字
  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    N:['101','111','111','111','101'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],Q:['010','101','101','110','011'],
    R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],
    V:['101','101','101','101','010'],W:['101','101','111','111','101'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111']};

  // ================= 共用工具 =================
  const LIB=(K,W,H,SZ)=>{
    const {P,hsh}=K,AX=K.AX,AY=K.AY,TOPY=K.TOPY;
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
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const fL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);   // +v 面（亮）
    const fR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);   // +u 面（暗）
    const lnL=(g,v,ua,ub,z,c)=>BL(g,P(ua,v,z),P(ub,v,z),c);
    const lnR=(g,u,va,vb,z,c)=>BL(g,P(u,va,z),P(u,vb,z),c);
    const vln=(g,u,v,za,zb,c)=>{const a=P(u,v,za),b=P(u,v,zb),x=rnd(a[0]),ya=rnd(a[1]),yb=rnd(b[1]);RC(g,x,Math.min(ya,yb),1,Math.abs(ya-yb),c);};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);rx=rnd(rx);ry=rnd(ry);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 斜面像素圖：+v 面沿 u 往右每 2px 下移 1px；+u 面沿 -v 往右每 2px 上移 1px
    const bmpL=(g,v,u,z,rows,pal,n,npal)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);
      rows.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[j];if(ch==='.'||!pal[ch])continue;const x=x0+j,y=y0+ri+Math.floor(j/2);RC(g,x,y,1,1,pal[ch]);if(n&&npal&&npal[ch])RC(n,x,y,1,1,npal[ch]);}});};
    const bmpR=(g,u,v,z,rows,pal,n,npal)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);
      rows.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[j];if(ch==='.'||!pal[ch])continue;const x=x0+j,y=y0+ri-Math.floor((j+1)/2);RC(g,x,y,1,1,pal[ch]);if(n&&npal&&npal[ch])RC(n,x,y,1,1,npal[ch]);}});};
    // 斜面文字：每個字母本身不剪切（筆畫清楚），字與字之間沿斜面逐字下移／上移
    const textL=(g,v,u,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){const gl=FONT[ch],dy=Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    const textR=(g,u,v,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){const gl=FONT[ch],dy=-Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]／['c',cu,cv,r,h]
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}
        else if(s[0]==='c'){const[,cu,cv,r,h]=s;for(let i=0;i<=8;i++){const k=h/64*i/8,p=P(cu+k,cv-.45*k);ell(sx,p[0],p[1],r*45.25,r*22.6,C);}}
        else if(s[0]==='poly'){fp(sx,s[1].map(([u,v])=>P(u,v)),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 南兩斜邊以外一律清掉（外框、落影溢出保險）；頂端 2 列清空
    const clipLot=c=>{const g=c.getContext('2d');const yE=AY-16*SZ;for(let y=Math.ceil(yE);y<H;y++){const w=2*(AY-y);if(w<=0){g.clearRect(0,y,W,1);continue;}
      g.clearRect(0,y,Math.max(0,AX-w),1);g.clearRect(AX+w,y,W,1);}g.clearRect(0,0,W,2);};
    // ---------- 地坪 ----------
    const pave=(g,u0,v0,du,dv,base,jc,step,seed,alt)=>{flat(g,u0,v0,du,dv,base);
      if(alt){const nu=Math.round(du/step),nv=Math.round(dv/step);for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const h=hsh(seed,i,j);if(h<.14)flat(g,u0+i*step,v0+j*step,step,step,alt[0]);else if(h>.88)flat(g,u0+i*step,v0+j*step,step,step,alt[1]);}}
      if(jc){for(let u=u0+step;u<u0+du-1e-6;u+=step)BL(g,P(u,v0),P(u,v0+dv),jc);for(let v=v0+step;v<v0+dv-1e-6;v+=step)BL(g,P(u0,v),P(u0+du,v),jc);}};
    const lotEdge=(g,dk,lt)=>{A.diaEdge(g,6,dk,AX,TOPY,32*SZ);A.diaEdge(g,9,lt,AX,TOPY,32*SZ);};
    const grass=(g,u0,v0,du,dv,seed)=>{flat(g,u0,v0,du,dv,'#7aa856');const n=Math.round(du*dv*90);
      for(let i=0;i<n;i++){const p=P(u0+hsh(seed,i,1)*du,v0+hsh(seed,i,2)*dv);RC(g,p[0],p[1],1,1,hsh(seed,i,3)<.5?'#6b984a':'#8cba66');}};
    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86','#d06a3a'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const crowd=(S,pts,z,d)=>S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);person(g,p[0],p[1],k);}});
    const scatter=(seed,n,u0,v0,du,dv,z=0)=>{const out=[];for(let i=0;i<n;i++)out.push([u0+hsh(seed,i,1)*du,v0+hsh(seed,i,2)*dv,Math.floor(hsh(seed,i,3)*10)]);return out;};
    // ---------- 路燈、樹、灌木、長椅 ----------
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x,y-h+1,1,1,'rgba(255,226,160,.55)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,SHD,u,v,s=1,kind=0,d)=>{SHD.push(['p',u,v,rnd(9*s)+6]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const bench=(S,u,v,alongU,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const a=P(u,v),b=alongU?P(u+.1,v):P(u,v+.1);BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9a6a3e');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#6e4a2a');RC(g,a[0],a[1]-1,1,1,'#3a3d40');RC(g,b[0],b[1]-1,1,1,'#3a3d40');});
    // 旗桿：底座（描邊）＋下段桿身（細線）；回傳 flagAt（繪製端自帶 20px 上段桿身與旗面）
    const flagPole=(S,u,v,h,d)=>{const b=P(u,v,0),t=P(u,v,h),x=rnd(t[0]),y=rnd(t[1]),by=rnd(b[1]);
      S.o(d-.001,g=>{boxZ(g,u-.03,v-.03,.06,.06,0,2,'#d9d6cc','#c9c5ba','#a8a498');});
      S.t(d,g=>{RC(g,x-1,y,1,by-2-y,'#a9a9a3');RC(g,x,y,1,by-2-y,'#8a8a86');});
      return [x,y];};
    // ---------- 車 ----------
    const CL=.23,CW=.1,CST={};
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const f2=(pts,c2)=>{x.fillStyle=c2;let ya=1e9,yb=-1e9;for(const p of pts){ya=Math.min(ya,p[1]);yb=Math.max(yb,p[1]);}
        for(let y=Math.floor(ya);y<=Math.ceil(yb);y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
          xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)x.fillRect(xa,y,xb-xa+1,1);}}};
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        f2([pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        f2([pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        f2([pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      const SHd=A.shade;
      bx(0,CL,0,CW,0,2,SHd(col,24),lit?col:SHd(col,-40),lit?SHd(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SHd(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      return CST[key]={c,ox,oy};};
    const car=(S,SHD,u,v,alongU,col,d)=>{const st=carStamp(alongU?'u':'v',col),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);S.o(d!=null?d:u+v+.1,(g)=>{g.drawImage(st.c,X0,Y0);});};
    // 車軸對應：ax='u' 長向沿 u（長側＝+v 亮面、端面＝+u 暗面）；ax='v' 長向沿 v（長側＝+u 暗面、端面＝+v 亮面）
    const AXF=ax=>ax==='u'?{pt:(b,a,z)=>P(b,a,z),lit:true}:{pt:(b,a,z)=>P(a,b,z),lit:false};
    const vb=(g,X,b0,db,a0,da,z,h,top,side,end)=>{const b1=b0+db,a1=a0+da,pt=X.pt;
      fp(g,[pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],side);
      fp(g,[pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],end);
      fp(g,[pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],top);};
    const vside=(g,X,a,b0,b1,za,zb,c)=>fp(g,[X.pt(b0,a,za),X.pt(b1,a,za),X.pt(b1,a,zb),X.pt(b0,a,zb)],c);
    const vend=(g,X,b,a0,a1,za,zb,c)=>fp(g,[X.pt(b,a0,za),X.pt(b,a1,za),X.pt(b,a1,zb),X.pt(b,a0,zb)],c);
    // 遊覽巴士：長 .5、寬 .11、高 7；fw＝車頭朝 +b
    const bus=(S,SHD,ax,b0,a0,col,fw,d)=>{const X=AXF(ax),Lb=.5,Wb=.11,a1=a0+Wb,b1=b0+Lb,lit=X.lit;
      SHD.push(ax==='u'?['b',b0,a0,Lb,Wb,7]:['b',a0,b0,Wb,Lb,7]);
      S.o(d!=null?d:b1+a1,(g,n)=>{
        vb(g,X,b0+.03,Lb-.06,a0+.01,Wb-.02,0,1,'#26292c','#2c3033','#1f2225');
        vb(g,X,b0,Lb,a0,Wb,1,6,'#e3e7ea',lit?'#f1f3f4':'#b8bfc4',lit?'#aeb5ba':'#e6e9eb');
        vside(g,X,a1,b0,b1,1.5,3,lit?col:A.shade(col,-34));
        vside(g,X,a1,b0+.03,b1-.04,4,6,lit?'#33485a':'#27384a');
        for(const t of[b0+.08,b1-.1]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}
        if(fw){vend(g,X,b1,a0+.012,a1-.012,3,6.5,lit?'#2b3947':'#3b5569');const h1=X.pt(b1,a0+.02,2),h2=X.pt(b1,a1-.02,2);RC(g,h1[0],h1[1]-1,1,1,'#fff6d6');RC(g,h2[0],h2[1]-1,1,1,'#fff6d6');}
        else{vend(g,X,b1,a0+.025,a1-.025,4.5,6,lit?'#33485a':'#3b5569');const r1=X.pt(b1,a0+.015,2),r2=X.pt(b1,a1-.015,2);RC(g,r1[0],r1[1]-1,1,1,'#c0392b');RC(g,r2[0],r2[1]-1,1,1,'#c0392b');}
        vb(g,X,b0+.14,.14,a0+.025,.06,7,1,'#c8cdd0','#d8dcdf','#a8aeb2');
        if(n){vside(n,X,a1,b0+.03,b1-.04,4.2,5.8,'rgba(255,230,170,.75)');}
      });};
    return {P,hsh,AX,AY,TOPY,RC,BL,fp,Q,flat,boxZ,fL,fR,lnL,lnR,vln,ell,bmpL,bmpR,textL,textR,scene,shadow,clipLot,pave,lotEdge,grass,
      person,crowd,scatter,lamp,tree,bush,bench,flagPole,car,bus,AXF,vb,vside,vend};
  };

  // 組裝：地坪 → 落影 → 分層立體件 → 裁掉佔地南緣外
  const assemble=(W,H,AX,AY,SZ,draw)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H,SZ);const{c,g,nc,ng}=K.canvases();const S=L.scene(),SHD=[];
    const ex=draw(K,L,g,ng,S,SHD)||{};L.shadow(g,SHD);S.run(g,ng);if(ex.post)ex.post(g,ng);L.clipLot(c);L.clipLot(nc);
    const o={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};if(ex.flagAt)o.flagAt=ex.flagAt;return o;};

  // ================= k37 水族館（2×2） =================
  try{
    const [W,H,AX,AY]=dims(37,[136,150,68,148]),SZ=2;
    const C={pave:'#d9d5cb',paveJ:'#cbc6ba',paveL:'#e4e0d7',paveD:'#cfcabe',curbD:'#8a857b',curbL:'#d6d1c5',
      asph:'#6d6b67',asphL:'#7b7974',stripe:'#e8e6df',
      white:'#eef3f6',whiteR:'#bccad3',whiteT:'#f7fafb',whiteS:'#dfe7ec',
      blue:'#2f6fae',blueD:'#24578a',blueL:'#5d9ccc',navy:'#1f4670',
      glass:'#4f8fc2',glassD:'#3a6f9c',glassH:'#9fd0ee',glassR:'#35628a',mull:'#e6eef3',mullR:'#9fb2bf',
      water:'#3b93cc',waterD:'#2f7cb6',waterL:'#6fbce6',waterH:'#c4ecfb',poolWall:'#8fd3e6',coping:'#eeebe3',
      seat:'#2f6fb4',seatL:'#4a8acb',seatD:'#23558c',tread:'#dde2e6',treadR:'#aab4bb',
      lit:'#ffe7a8',litW:'#fff3cf',
      dolph:'#6f8799',dolphD:'#4f6577',dolphL:'#c9d6df',rock:'#8d8579',rockL:'#aaa196',rockD:'#6b645b'};
    // 躍起的海豚（16×12 拱形、朝右）：全身深色外框、背脊受光灰、弧內側白腹線、背鰭向後斜；左下尾鰭出水、右下吻部入水
    //   錨點＝尾端出水點（第 2 欄、最底列下方一列）
    const DOLPH=['....kkk.........','...kdddk........','....kddmkkk.....','....kmmdmmmk....','...kmmdddddmk...','...kmlllllddmk..',
      '..kmmkkkkllddmk.','kkkmk....klldmk.','kdmlk.....kkldmk','kkkdk.......klmk','..kddk.......klk','...kk.........k.'];
    const DOLPH_PAL={d:'#4b5f70',m:'#7890a2',l:'#f4f8fa',k:'#15212b'};          // 日照水面用（深灰身）
    const DOLPH_PAL_L={d:'#5f676d',m:'#949ca2',l:'#ffffff',k:'#121518'};         // 建物落影下的水面用（中性灰身，和偏暗的藍水分得開色相）
    // 海獅：坐在岩上（抬頭朝左）／水中游（頭＋背）；h＝淺色胸腹與吻部反光
    const SEAL_SIT=['.kk...','hbk...','.kbk..','.kbbk.','kbhbbk'];
    const SEAL_SWIM=['.kk...','hbkkk.','.kbbhk'];
    const SEAL_PAL={k:'#261d17',b:'#5a4636',h:'#c4a986'};
    const WHALE=['.....bbbbbb.......','...bbbbbbbbbb...bb','.bbbbbbbbbbbbbbbb.','bbwbbbbbbbbbbbbb..','bbbbbbbbbbbbbbb...','.lllllllbbbbb.....','...lllll..........'];
    const FISH=['..bbb..b','.bbbbbbb','bwbbbbb.','.bbbbbbb','..bbb..b'];
    const PC2=['#c0392b','#f0c040','#3b5f8a','#e8e8e8','#4a6b45','#d06a3a','#8a4f6a'];
    const aq=(K,L)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell}=L;
      // 超橢圓（圓角矩形 n=4、橢圓 n=2）外形點列（uv）
      const shp=(cu,cv,a,b,n=4,N=72)=>ext=>{const o=[];for(let i=0;i<N;i++){const t=i/N*Math.PI*2,c=Math.cos(t),s=Math.sin(t);o.push([cu+(a+ext)*Math.sign(c)*Math.pow(Math.abs(c),2/n),cv+(b+ext)*Math.sign(s)*Math.pow(Math.abs(s),2/n)]);}return o;};
      const toS=(pts,z=0)=>pts.map(([u,v])=>P(u,v,z));
      // 下沉水池：池緣 → 內壁 → 水面（下移 dep px）＋深水核心＋反光短線
      const pool=(g,sh,o={})=>{const cope=o.cope==null?.035:o.cope,dep=o.dep||2;
        if(cope>0)fp(g,toS(sh(cope)),o.copeC||C.coping);
        if(o.copeIn)fp(g,toS(sh(cope*.4)),o.copeIn);
        const inner=toS(sh(0));const[mc,mx]=A.cv(W,H);fp(mx,inner,'#000');
        const[wc,wx]=A.cv(W,H);fp(wx,inner,o.wall||C.poolWall);fp(wx,inner.map(p=>[p[0],p[1]+dep]),o.water||C.water);
        if(o.core!==false)fp(wx,toS(sh(-(o.coreIn||.07))).map(p=>[p[0],p[1]+dep]),o.waterD||C.waterD);
        if(o.rings)for(const[ex,col]of o.rings)fp(wx,toS(sh(-ex)).map(p=>[p[0],p[1]+dep]),col);   // 由淺到深的同心水層
        const md=mx.getImageData(0,0,W,H).data;let xa=1e9,xb=-1e9,ya=1e9,yb=-1e9;for(const p of inner){xa=Math.min(xa,p[0]);xb=Math.max(xb,p[0]);ya=Math.min(ya,p[1]);yb=Math.max(yb,p[1]);}
        const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&md[(y*W+x)*4+3]>100;
        for(let i=0;i<(o.nh||12);i++){const x=rnd(xa+hsh(o.seed||7,i,1)*(xb-xa)),y=rnd(ya+dep+2+hsh(o.seed||7,i,2)*(yb-ya-dep-3)),w=2+((hsh(o.seed||7,i,3)*3)|0);
          if(inside(x,y)&&inside(x+w,y))RC(wx,x,y,w,1,i%3?C.waterL:C.waterH);}
        wx.globalCompositeOperation='destination-in';wx.drawImage(mc,0,0);g.drawImage(wc,0,0);};
      // 直排看台：沿 u 展開、座位面向 +v；每排＝淺色踏階（頂）＋藍色座椅（+v 立面）；中間兩條走道；觀眾坐在踏階上
      const stands=(S,SHD,u0,u1,vF,rows,dep,rise,d,o={})=>{SHD.push(['b',u0,vF-rows*dep,u1-u0,rows*dep,rows*rise]);
        const aisles=o.aisles||[u0+(u1-u0)*.33,u0+(u1-u0)*.67];
        S.o(d,(g)=>{{const vb=vF-rows*dep;boxZ(g,u0,vb-.03,u1-u0,.03,0,rows*rise+3,'#e9eef1','#d3dbe0',C.treadR);}   // 後排擋牆（先畫）
          for(let i=rows-1;i>=0;i--){const v0=vF-(i+1)*dep,zt=(i+1)*rise;
          boxZ(g,u0,v0,u1-u0,dep,0,zt,C.tread,C.seat,C.treadR);
          fL(g,v0+dep,u0,u1,zt-1,zt,C.seatL);                                         // 椅背上緣受光
          for(let t=u0+2/32;t<u1-1/32;t+=2/32)vln(g,t,v0+dep,zt-rise,zt-1,C.seatD);   // 座椅分隔
          for(const a of aisles)fL(g,v0+dep,a-.018,a+.018,zt-rise,zt,'#c9d0d5');}});
        S.t(d+.001,(g)=>{for(let i=0;i<rows;i++){const v0=vF-(i+1)*dep,zt=(i+1)*rise;const m=Math.round((u1-u0)*32/2.2);
          for(let j=0;j<m;j++){if(hsh(o.seed||3,i,j)>(o.pp||.45))continue;const t=u0+.03+(u1-u0-.06)*j/Math.max(1,m-1);if(aisles.some(a=>Math.abs(a-t)<.03))continue;const p=P(t,v0+dep*.55,zt);
            RC(g,p[0],p[1]-1,1,1,PC2[(hsh(o.seed||3,j,i+9)*PC2.length)|0]);RC(g,p[0],p[1]-2,1,1,'#e2b48e');}}});};
      // 躍起海豚：(u,v) 是尾端出水點（水面＝地面下 dep px）；尾端畫白色水花環、吻端畫入水小水花
      const dolphin=(S,u,v,d,flip,pal=DOLPH_PAL,dep=2)=>S.t(d,(g)=>{const p=P(u,v,0),wy=rnd(p[1])+dep,W2=DOLPH[0].length,tx=flip?W2-3:2,x0=rnd(p[0])-tx,y0=wy-DOLPH.length;
        // 尾端水花環（出水處）：白環＋內圈淺水＋上濺水珠
        const rx=rnd(p[0]);RC(g,rx-2,wy-1,5,1,'#ffffff');RC(g,rx-3,wy,2,1,'#ffffff');RC(g,rx+2,wy,2,1,'#ffffff');RC(g,rx-1,wy,3,1,'#bfe6f7');RC(g,rx-2,wy+1,5,1,'#ffffff');
        RC(g,rx-3,wy-3,1,1,'#ffffff');RC(g,rx+3,wy-2,1,1,'#e8f6fc');
        DOLPH.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[flip?r.length-1-j:j];if(ch!=='.')RC(g,x0+j,y0+ri,1,1,pal[ch]);}});
        // 吻端下方入水小水花
        const hx=flip?x0+1:x0+W2-2;RC(g,hx-1,wy+1,3,1,'#e8f6fc');RC(g,hx,wy,1,1,'#ffffff');});
      const splash=(S,u,v,d)=>S.t(d,(g)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-2,y,5,1,'#e8f6fc');RC(g,x-1,y-1,1,1,'#ffffff');RC(g,x+1,y-2,1,1,'#ffffff');RC(g,x-3,y-1,1,1,'#bfe6f7');});
      // 海獅：mode 'sit'（岩上）／'swim'（水中，帶白色水紋）
      const seal=(S,u,v,z,d,mode,flip)=>S.t(d,(g)=>{const p=P(u,v,z),rows=mode==='sit'?SEAL_SIT:SEAL_SWIM,w2=rows[0].length,x0=rnd(p[0])-(w2>>1),y0=rnd(p[1])-rows.length+(mode==='sit'?0:1);
        rows.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[flip?r.length-1-j:j];if(ch!=='.')RC(g,x0+j,y0+ri,1,1,SEAL_PAL[ch]);}});
        if(mode!=='sit'){RC(g,x0-1,y0+rows.length,w2+2,1,'#d8f1fb');RC(g,flip?x0+w2+1:x0-2,y0+rows.length-1,1,1,'#ffffff');}});
      const fin=(S,u,v,d)=>S.t(d,(g)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,C.dolphD);RC(g,x+1,y-1,1,1,C.dolphD);RC(g,x-1,y,4,1,'#9fd6ef');});
      // 售票亭：白盒＋藍簷＋售票窗；n 夜間亮窗
      const booth=(S,SHD,u0,v0,du,dv,d)=>{SHD.push(['b',u0,v0,du,dv,12]);S.o(d,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,9,'#e9eff3',C.white,C.whiteR);
        const nw=Math.max(2,Math.round(du/.1));for(let i=0;i<nw;i++){const a=u0+du*(i+.18)/nw,b=u0+du*(i+.82)/nw;fL(g,v0+dv,a,b,3,7,C.glassD);fL(g,v0+dv,a,a+1/32,6,7,C.glassH);if(n)fL(n,v0+dv,a,b,3,7,C.lit);}
        fL(g,v0+dv,u0,u0+du,2,3,C.blueD);fR(g,u0+du,v0+dv*.3,v0+dv*.7,3,7,C.glassR);
        boxZ(g,u0-.03,v0-.03,du+.06,dv+.06,9,2,C.whiteT,C.blue,C.blueD);});};
      // 排隊欄柱：多列、每列等距立柱＋藍色伸縮帶
      const queue=(S,u0,u1,vs,d)=>S.t(d,(g)=>{for(const v of vs){const m=Math.max(2,Math.round((u1-u0)/.08));let prev=null;
        for(let j=0;j<=m;j++){const t=u0+(u1-u0)*j/m,p=P(t,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-3,1,3,'#474d53');RC(g,x,y-4,1,1,'#c7cdd1');
          if(prev)BL(g,[prev[0],prev[1]-3],[x,y-3],'#2f6fae');prev=[x,y];}}});
      const rock=(g,u,v,r)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]),rx=Math.max(2,rnd(r*45)),ry=Math.max(1,rnd(r*26));
        ell(g,x,y-ry+1,rx,ry,C.rockD);ell(g,x-1,y-ry,Math.max(1,rx-1),Math.max(1,ry-1),C.rock);RC(g,x-rx+2,y-ry*2+2,Math.max(1,rx-2),1,C.rockL);};
      // 玻璃欄杆（細線層）：沿點列
      const glassRail=(S,pts,d)=>S.t(d,(g)=>{for(let i=0;i<pts.length-1;i++){BL(g,P(pts[i][0],pts[i][1],3),P(pts[i+1][0],pts[i+1][1],3),'#d7eef7');BL(g,P(pts[i][0],pts[i][1],0),P(pts[i+1][0],pts[i+1][1],0),'#8fb3c4');
        const L2=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]),m=Math.max(1,Math.round(L2/.08));for(let j=0;j<=m;j++){const u=pts[i][0]+(pts[i+1][0]-pts[i][0])*j/m,v=pts[i][1]+(pts[i+1][1]-pts[i][1])*j/m,p=P(u,v,0);RC(g,p[0],p[1]-3,1,3,'#9fb8c6');}}});
      // 鯨尾噴泉：圓形石砌水盆（石緣頂面＋側面、淺藍水面＋反光）＋盆心一支 V 字鯨尾雕塑（左亮右暗、各自描邊）＋尾尖水珠
      const TAIL=['L..........D','LL........DD','LLL......DDD','.LLL....DDD.','..LLL..DDD..','...LLLDDD...','....LLDD....','....LLDD....','....LLDD....','...LLLDDD...'];
      const tail=(S,SHD,u,v,r,d)=>{SHD.push(['c',u,v,r,3]);
        S.o(d,(g,n)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]),rx=rnd(r*45.25),ry=Math.max(2,rnd(r*22.6));
          ell(g,x,y,rx,ry,'#a39b8d');ell(g,x-1,y,rx-1,ry,'#b9b1a2');                                  // 盆側（左亮右暗）
          ell(g,x,y-2,rx,ry,'#e3ded3');                                                                // 石緣頂面
          ell(g,x,y-2,rx-2,ry-1,'#7cc6ea');ell(g,x+1,y-2,rx-4,Math.max(1,ry-2),'#5cb0de');             // 淺藍水面＋中心略深
          RC(g,x-rx+3,y-2-ry+2,3,1,'#dff4fc');RC(g,x+2,y,3,1,'#bfe6f7');});
        S.o(d+.002,(g)=>{const p=P(u,v,0),x0=rnd(p[0])-6,y0=rnd(p[1])-2-TAIL.length;
          TAIL.forEach((row,ri)=>{for(let j=0;j<row.length;j++){const ch=row[j];if(ch==='L')RC(g,x0+j,y0+ri,1,1,ri<3&&j<2?'#c3d6e3':'#8fb0c8');else if(ch==='D')RC(g,x0+j,y0+ri,1,1,'#557790');}});});
        S.t(d+.003,(g)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1])-2-TAIL.length;
          RC(g,x-7,y-1,1,1,'#ffffff');RC(g,x-8,y+1,1,1,'#bfe6f7');RC(g,x+6,y-1,1,1,'#ffffff');RC(g,x+7,y+1,1,1,'#bfe6f7');
          const b=rnd(p[1])-2;RC(g,x-3,b,2,1,'#ffffff');RC(g,x+2,b,2,1,'#ffffff');RC(g,x-1,b+1,3,1,'#e8f6fc');});};
      return {shp,toS,pool,stands,dolphin,splash,seal,fin,booth,queue,rock,glassRail,tail};};

    // -------- v0 波浪屋頂主館＋海豚表演池 --------
    const v0=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,bmpL,textL}=L,Q=aq(K,L);
      A.dia(g,AX,L.TOPY,64,C.pave);
      L.pave(g,0,0,2,2,C.pave,C.paveJ,.25,370,[C.paveL,C.paveD]);
      // 右前落客區（柏油＋標線）與草帶
      flat(g,1.3,1.58,.7,.42,C.asph);BL(g,P(1.3,1.58),P(2,1.58),'#9a978f');BL(g,P(1.3,1.58),P(1.3,2),'#9a978f');
      for(let u=1.36;u<1.95;u+=.1)BL(g,P(u,1.8),P(u+.05,1.8),C.stripe);
      L.grass(g,1.3,1.5,.7,.08,371);
      // 表演池（右，看台前；往前加大到 v1.46，水面最寬處約 36px，容得下兩隻 16px 躍起的海豚並排）
      const psh=Q.shp(1.665,1.0,.295,.46,4);Q.pool(g,psh,{seed:372,nh:18});
      // 廣場波紋鋪面（藍色曲線，繞開噴泉盆）
      const FU=.8,FV=1.76,FR=.15;
      for(let i=0;i<38;i++){const u=.14+i*.028,u2=u+.028,f=x=>1.84+.03*Math.sin(x*11);if(Math.hypot(u-FU,f(u)-FV)<FR+.06||Math.hypot(u2-FU,f(u2)-FV)<FR+.06)continue;BL(g,P(u,f(u)),P(u2,f(u2)),'#8fb6d6');}
      L.grass(g,0,1.74,.26,.26,374);
      // ===== 主館：波浪屋頂。屋面高度沿 u−v（螢幕水平）起伏 ⇒ 浪形剖面正對觀者、不會自遮；朝左的坡受光、朝右的坡背光；
      //       屋面縫線沿 u+v 走、隨浪起伏（像海面）；左右兩片牆頂緣都跟著浪走，簷口一道藍帶 =====
      const u0=.1,v0=.1,u1=1.24,v1=.96;
      const pN=P(u0,v0),pE=P(u1,v0),pS=P(u1,v1),pW=P(u0,v1);
      const LAM=21.4,zx=x=>29+6*(.5-.5*Math.cos(2*Math.PI*(x-pW[0]+LAM*.5)/LAM));
      const lerpY=(a,b,x)=>a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
      const topE=x=>x<pN[0]?lerpY(pW,pN,x):lerpY(pN,pE,x),botE=x=>x<pS[0]?lerpY(pW,pS,x):lerpY(pS,pE,x);
      const zfL=u=>zx(P(u,v1)[0]),zfR=v=>zx(P(u1,v)[0]);
      SHD.push(['b',u0,v0,u1-u0,v1-v0,34]);
      S.o(.5,(g,n)=>{
        for(let xi=Math.ceil(pW[0]);xi<Math.floor(pE[0]);xi++){const x=xi+.5,z=zx(x),sl=(zx(x+.5)-zx(x-.5));
          const yT=Math.round(topE(x)-z),yB=Math.round(botE(x)-z),yG=Math.round(botE(x));
          const base=sl>.28?'#ffffff':sl>.1?'#f1f6f9':sl>-.1?'#dde9f1':sl>-.28?'#b9d2e4':'#9dbfd9',seam=A.shade(base,-18);
          for(let y=yT;y<yB;y++){const s1=(y+z-L.TOPY)/16,s2=(y+1+z-L.TOPY)/16;g.fillStyle=Math.floor(s1/.25)!==Math.floor(s2/.25)?seam:base;g.fillRect(xi,y,1,1);}
          const wall=x<pS[0]?C.white:C.whiteR,fas=x<pS[0]?C.blue:C.blueD;
          g.fillStyle=wall;g.fillRect(xi,yB,1,Math.max(0,yG-yB));g.fillStyle=fas;g.fillRect(xi,yB,1,3);
          g.fillStyle=x<pS[0]?'#1f4f80':'#183f66';g.fillRect(xi,yB+3,1,1);}
        fL(g,v1,u0,u1,0,2,'#aab5bc');fR(g,u1,v0,v1,0,2,'#8e9aa2');
        // 中段大玻璃中庭（頂隨浪）
        const ga=.54,gb=.84;
        for(let t=ga;t<gb-1e-6;t+=1/64){const t2=t+1/64;fp(g,[P(t,v1,2),P(t2,v1,2),P(t2,v1,zfL(t2)-6),P(t,v1,zfL(t)-6)],C.glass);
          if(n)fp(n,[P(t,v1,2),P(t2,v1,2),P(t2,v1,zfL(t2)-6),P(t,v1,zfL(t)-6)],'#ffe0a0');}
        for(let t=ga;t<=gb+1e-6;t+=3/32)vln(g,t,v1,2,zfL(t)-6,C.mull);
        for(const z of[11,20])lnL(g,v1,ga,gb,z,C.mull);
        fL(g,v1,ga+.04,ga+.1,12,20,C.glassH);
        fL(g,v1,.63,.77,2,9,'#2d4f6c');vln(g,.7,v1,2,9,'#6f8fa8');if(n)fL(n,v1,.63,.77,2,9,'#fff3d0');
        // 兩翼帶狀窗
        bmpL(g,v1,.2,21,WHALE,{b:C.blue,w:'#ffffff',l:'#9ec5e3'});
        for(const[z,a,b]of[[8,.14,.48],[8,.9,1.22],[16,.9,1.22]])for(let t=a;t<b-.03;t+=.07){fL(g,v1,t,t+.045,z,z+3,C.glassD);fL(g,v1,t,t+1/32,z+2,z+3,C.glassH);if(n&&hsh(6,rnd(t*60),z)<.65)fL(n,v1,t,t+.045,z,z+3,C.lit);}
        // 右立面：帶狀窗＋服務門
        for(const z of[9,17]){fR(g,u1,v0+.08,v1-.12,z,z+3,C.glassR);for(let t=v0+.14;t<v1-.12;t+=.12)vln(g,u1,t,z,z+3,C.mullR);
          if(n)for(let t=v0+.1;t<v1-.16;t+=.24){if(hsh(7,rnd(t*100),z)<.6)fR(n,u1,t,t+.1,z,z+3,'#ffdf9a');}}
        fR(g,u1,.82,.9,2,8,'#5f6d77');
      });
      // 入口雨遮（白板＋兩柱）＋魚標誌牌
      SHD.push(['b',.52,.96,.34,.14,2,11]);
      S.o(2.0,(g,n)=>{const a=P(.55,1.08,0),b=P(.83,1.08,0);RC(g,a[0],a[1]-11,1,11,'#c9d3da');RC(g,b[0],b[1]-11,1,11,'#9fb0bc');
        boxZ(g,.52,.96,.34,.14,11,2,C.whiteT,C.white,C.whiteR);fL(g,1.1,.52,.86,11,12,C.blue);
        fL(g,1.03,.58,.8,13,19,C.navy);bmpL(g,1.03,.64,18,FISH,{b:'#ffffff',w:C.navy},n,{b:'#dff4ff'});
        for(const t of[.6,.69,.78]){const p=P(t,1.08,11);RC(g,p[0],p[1],1,1,'#fff6d8');if(n)RC(n,p[0],p[1],1,1,'#fff1c0');}});
      // 看台（池後）＋舞台平台＋海豚
      Q.stands(S,SHD,1.34,1.94,.5,5,.07,2.6,1.0,{seed:375,pp:.6});
      S.o(.9,(g,n)=>{for(const t of[1.5,1.8]){const p=P(t,.11,0);RC(g,p[0],p[1]-26,1,26,'#7d878d');}
        fL(g,.11,1.46,1.84,17,27,'#23282e');fL(g,.11,1.48,1.82,18,26,'#2c5f96');fL(g,.11,1.48,1.82,18,21,'#3f86c6');
        {const p=P(1.62,.11,24),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-3,y,6,1,'#dfe8ee');RC(g,x-2,y-1,3,1,'#dfe8ee');RC(g,x+3,y+1,1,1,'#dfe8ee');RC(g,x-4,y+1,1,1,'#dfe8ee');}
        if(n)fL(n,.11,1.48,1.82,18,26,'rgba(120,190,255,.55)');});
      S.o(1.1,(g)=>{boxZ(g,1.27,.62,.08,.66,0,2,'#aebdc8','#98a9b5','#7d8e9a');});   // 訓練員平台（中灰藍，讓海豚的白腹與深外框都分得開）
      L.crowd(S,[[1.3,.72,6],[1.31,.9,1],[1.3,1.12,4]],2,1.2);
      Q.glassRail(S,[[1.35,1.5],[1.98,1.5],[1.98,.53]],2.9);
      // 兩隻海豚同向接力躍起（各 16px 弧、尾端白水花環），前方一片背鰭
      Q.dolphin(S,1.421875,1.203125,2.5,false,DOLPH_PAL_L);Q.dolphin(S,1.6875,.9375,2.51,false,DOLPH_PAL_L);Q.fin(S,1.82,1.26,2.45);
      // 入口廣場：雨遮（中）→ 排隊欄（雨遮正前）→ 售票亭（左，獨立一座）→ 鯨尾噴泉（前）→ 旗桿（最左）
      Q.booth(S,SHD,.18,1.16,.18,.14,1.62);
      Q.queue(S,.52,.86,[1.18,1.26],2.2);
      L.crowd(S,[[.58,1.22,0],[.63,1.22,3],[.69,1.22,5],[.76,1.23,2],[.82,1.3,7],[.73,1.3,4],[.22,1.37,8],[.28,1.38,1],[.34,1.37,6]],0,2.25);
      L.crowd(S,L.scatter(376,22,.14,1.36,1.08,.52).filter(([u,v])=>Math.hypot(u-FU,v-FV)>FR+.07&&!(u<.44&&v<1.42)&&!(u>.46&&u<.92&&v<1.34)).slice(0,13),0,2.9);
      Q.tail(S,SHD,FU,FV,FR,FU+FV);
      const flagAt=L.flagPole(S,.14,1.5,9,1.66);
      L.tree(S,SHD,.12,1.9,1,1);
      L.bush(S,1.48,1.54,3);L.bush(S,1.66,1.54,3);L.bush(S,1.84,1.54,3);
      L.lamp(S,1.18,1.26,16);L.lamp(S,1.3,.2,16);L.lamp(S,1.32,1.94,16);
      L.bench(S,.42,1.62,true);L.bench(S,1.1,1.72,true);
      // 落客區：遊覽車＋計程車
      L.bus(S,SHD,'u',1.38,1.86,'#2f6fae',true);L.car(S,SHD,1.42,1.64,true,'#e8c33a');L.car(S,SHD,1.7,1.64,true,'#e8e8e8');
      L.lotEdge(g,C.curbD,C.curbL);
      return{flagAt};});

    // -------- v1 圓柱大水槽館 --------
    const v1=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,bmpL,textL}=L,Q=aq(K,L);
      A.dia(g,AX,L.TOPY,64,C.pave);
      L.pave(g,0,0,2,2,C.pave,C.paveJ,.25,380,[C.paveL,C.paveD]);
      L.grass(g,0,0,.1,2,381);L.grass(g,0,0,2,.08,382);
      // 海獅圓池（右後）
      // 實心分層水：外圈淺藍（≥3px）→ 中層 → 池心深藍
      const cu=1.5,cv=.66,pr=.27;
      Q.pool(g,Q.shp(cu,cv,pr,pr,2),{seed:383,nh:8,cope:.045,copeC:'#bdb3a4',copeIn:'#a79d8e',water:'#7cc6ea',core:false,rings:[[.075,'#3f98d0'],[.14,'#2b72ab']]});
      // 美食廣場地坪（右前）：木棧板
      flat(g,1.2,1.12,.74,.8,'#b89a72');for(let v=1.14;v<1.92;v+=.05)BL(g,P(1.2,v),P(1.94,v),'#a5875f');
      // ===== 圓筒大水槽：玻璃筒內是水（上淺下深）、魚群、魟魚剪影；頂上白色冠環＋玻璃穹頂 =====
      const dc=[.6,.6],dr=.5,zg0=5,zg1=42;SHD.push(['c',dc[0],dc[1],dr,50]);
      S.o(.5,(g,n)=>{const rx=dr*32*Math.SQRT2,ry=dr*16*Math.SQRT2;
        const band=(z0,z1,colAt,nAt)=>{const a=P(dc[0],dc[1],z0),b=P(dc[0],dc[1],z1);
          for(let x=Math.floor(a[0]-rx);x<=Math.ceil(a[0]+rx);x++){const dx=(x+.5-a[0])/rx;if(Math.abs(dx)>=1)continue;const f=ry*Math.sqrt(1-dx*dx);
            const yb=Math.round(a[1]+f),yt=Math.round(b[1]+f);for(let y=yt;y<yb;y++){const zz=yb-1-y,col=colAt(dx,zz,x,y);if(col){g.fillStyle=col;g.fillRect(x,y,1,1);}
              if(n&&nAt){const nc=nAt(dx,zz,x,y);if(nc){n.fillStyle=nc;n.fillRect(x,y,1,1);}}}}};
        const sh4=(dx,c)=>dx<-.55?c[0]:dx<0?c[1]:dx<.55?c[2]:c[3];
        const sd=(dx,c)=>A.shade(c,dx<-.55?14:dx<0?0:dx<.55?-16:-32);
        band(0,zg0,(dx)=>sh4(dx,['#eef2f4','#dfe6ea','#c2ced6','#a8b6c0']));
        const H1=zg1-zg0,rib=(dx)=>{const m=(Math.asin(dx)/(Math.PI/2)+1)*5,fr=m-Math.floor(m);return fr<.1;};
        band(zg0,zg1,(dx,zz,x,y)=>{const f=zz/H1;
          if(rib(dx))return dx<0?'#e6eef3':'#a3b4c0';if(zz===Math.round(H1*.5))return dx<0?'#d9e4ea':'#98aab6';
          if(f>.9)return sd(dx,'#b5dcf0');if(f>.86)return '#eaf8ff';                        // 水面線與上方空氣層
          const h=hsh(x,y>>1,5);if(h<.03&&f<.84)return '#173f66';if(h>.988&&f<.8)return hsh(x,y,6)<.5?'#f5c542':'#f08a3a';
          if(f>.74&&hsh(x>>1,y,8)<.25)return sd(dx,'#8fd0f0');
          return sd(dx,f<.28?'#1f5f96':f<.55?'#2c73b0':f<.78?'#3f8dc8':'#5aa7d9');},
          (dx,zz,x,y)=>{const f=zz/H1;if(rib(dx)||zz===Math.round(H1*.5))return null;const pane=Math.floor((Math.asin(dx)/(Math.PI/2)+1)*5)*2+(zz>H1*.5?1:0);
            if(hsh(388,pane,1)>.6)return null;return f>.86?'rgba(200,236,255,.7)':'rgba(70,160,225,.55)';});
        band(zg1,zg1+4,(dx)=>sh4(dx,['#ffffff','#eef3f6','#cdd8df','#b3c1ca']));
        band(zg1+3,zg1+4,(dx)=>sh4(dx,['#3f86c6','#2f6fae','#24578a','#1d4a76']));
        const top=P(dc[0],dc[1],zg1+4);ell(g,top[0],top[1],rx,ry,'#dfe6eb');ell(g,top[0],top[1]+1,rx-3,ry-2,'#c9d4db');
        ell(g,top[0],top[1]-1,10,5,'#7fb0cf');ell(g,top[0]-1,top[1]-2,8,3,'#a9d4ec');RC(g,top[0]-5,top[1]-3,3,1,'#eef8fd');
        if(n){ell(n,top[0],top[1]-1,8,4,'rgba(170,220,255,.55)');}
        // 魟魚剪影（槽內，亮側）
        const mp=P(dc[0],dc[1],32),mx=rnd(mp[0])-15,my=rnd(mp[1]+ry*.8)-3;
        ['...dd.....','.dddddd...','dddddddddd','.dddddd...','...dd.....'].forEach((r,ri)=>{for(let j=0;j<r.length;j++)if(r[j]==='d')RC(g,mx+j,my+ri,1,1,'#1d4468');});
      });
      // 前翼入口棟（低、白、藍帶＋魚標）
      const w0=.06,w1=1.06,wv0=1.08,wv1=1.34,wh=16;SHD.push(['b',w0,wv0,w1-w0,wv1-wv0,wh]);
      S.o(1.5,(g,n)=>{boxZ(g,w0,wv0,w1-w0,wv1-wv0,0,wh,'#d7e0e6',C.white,C.whiteR);
        boxZ(g,w0,wv0,w1-w0,.03,wh,2,C.whiteT,C.white,C.whiteR);boxZ(g,w0,wv1-.03,w1-w0,.03,wh,2,C.whiteT,C.white,C.whiteR);
        boxZ(g,w1-.03,wv0,.03,wv1-wv0,wh,2,C.whiteT,C.white,C.whiteR);
        fL(g,wv1,w0,w1,9,16,C.blue);fR(g,w1,wv0,wv1,9,16,C.blueD);fL(g,wv1,w0,w1,15,16,'#4a8acb');
        textL(g,wv1,w0+.03,14.5,'AQUARIUM','#ffffff',n,'#e4f6ff',1);
        fL(g,wv1,w0,w1,0,2,'#aab5bc');fR(g,w1,wv0,wv1,0,2,'#8e9aa2');
        fL(g,wv1,.36,.78,2,8.5,C.glass);for(let t=.36;t<=.78+1e-6;t+=4/32)vln(g,t,wv1,2,8.5,C.mull);fL(g,wv1,.5,.64,2,8,'#2d4f6c');
        if(n){fL(n,wv1,.36,.78,2,8.5,'#ffe3a0');fL(n,wv1,.5,.64,2,8,'#fff0c8');}
        for(const a of[.14,.25,.8,.9]){fL(g,wv1,a,a+.06,4,8,C.glassD);fL(g,wv1,a,a+1/32,7,8,C.glassH);if(n&&hsh(8,rnd(a*50),1)<.7)fL(n,wv1,a,a+.06,4,8,C.lit);}
        for(let t=wv0+.05;t<wv1-.06;t+=.1){fR(g,w1,t,t+.06,4,8,C.glassR);if(n)fR(n,w1,t,t+.06,4,8,'#ffdf9a');}
        boxZ(g,.3,1.14,.12,.1,wh,3,'#c3ccd2','#d3dbe0','#a7b3bb');});
      S.o(2.4,(g)=>{boxZ(g,.38,1.34,.36,.12,9,1.5,C.whiteT,C.white,C.whiteR);const a=P(.4,1.45,0),b=P(.72,1.45,0);RC(g,a[0],a[1]-9,1,9,'#c9d3da');RC(g,b[0],b[1]-9,1,9,'#9fb0bc');});
      // 弧形看台（池後，座位面向池）
      const t0=205,t1=330,r0=pr+.06,rows=3,drr=.075,rise=3,rm=r0+rows*drr,zm=rows*rise;SHD.push(['b',1.12,.18,.84,.3,12]);
      S.o(1.0,(g)=>{const arc=(r,z,N=30)=>{const o=[];for(let k=0;k<=N;k++){const t=(t0+(t1-t0)*k/N)*Math.PI/180;o.push(P(cu+r*Math.cos(t),cv+r*Math.sin(t),z));}return o;};
        fp(g,arc(rm,zm+3).concat(arc(rm,0).reverse()),'#c3ccd2');fp(g,arc(rm,zm+3).concat(arc(rm-.02,zm+3).reverse()),'#e9eef1');
        for(let i=rows-1;i>=0;i--){const ra=r0+i*drr,rb=ra+drr,zt=(i+1)*rise,zb=i*rise;
          fp(g,arc(rb,zt).concat(arc(ra,zt).reverse()),C.tread);
          fp(g,arc(ra,zt).concat(arc(ra,zb).reverse()),C.seat);
          const a=arc(ra,zt,60);for(let k=0;k<a.length;k+=2)RC(g,a[k][0],a[k][1]+1,1,Math.max(1,rise-2),C.seatD);
          const b2=arc(ra,zt,60);for(let k=0;k<b2.length;k++)RC(g,b2[k][0],b2[k][1],1,1,C.seatL);}
        const cap=t=>{const c=Math.cos(t*Math.PI/180),s=Math.sin(t*Math.PI/180),pt=(r,z)=>P(cu+r*c,cv+r*s,z);const o=[pt(r0,0),pt(rm,0),pt(rm,zm+3)];
          for(let i=rows-1;i>=0;i--){o.push(pt(r0+i*drr,(i+1)*rise));o.push(pt(r0+i*drr,i*rise));}return o;};
        fp(g,cap(t0),'#dfe5e9');fp(g,cap(t1),'#a4afb7');});
      S.t(1.01,(g)=>{for(let i=0;i<rows;i++){const r=r0+i*drr+drr*.5,zt=(i+1)*rise;for(let k=0;k<22;k++){if(hsh(384,i,k)>.55)continue;const t=(t0+5+(t1-t0-10)*k/21)*Math.PI/180,p=P(cu+r*Math.cos(t),cv+r*Math.sin(t),zt);
        RC(g,p[0],p[1]-1,1,1,PC2[(hsh(385,i,k)*PC2.length)|0]);RC(g,p[0],p[1]-2,1,1,'#e2b48e');}}});
      // 池中小岩島（約池寬 1/3）＋岩上一隻坐姿海獅、水中兩隻游動海獅（池前不再拉玻璃欄，水面不被遮）
      S.o(2.0,(g)=>{Q.rock(g,cu+.03,cv-.04,.08);});
      Q.seal(S,cu+.035,cv-.045,3,2.01,'sit');
      Q.seal(S,cu-.15,cv+.05,-2,2.02,'swim');Q.seal(S,cu+.06,cv+.17,-2,2.03,'swim',true);
      // 美食廣場：攤車＋遮陽傘＋桌
      const umb=(u,v,col,d)=>{SHD.push(['p',u,v,9]);S.o(d||u+v,(g)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-8,1,8,'#6b6f73');
        for(let r=0;r<3;r++){const w=2+r*2;RC(g,x-w,y-11+r,2*w+1,1,r%2?col:'#ffffff');}RC(g,x-6,y-8,13,1,A.shade(col,-30));});
        S.t((d||u+v)+.001,(g)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-3,y-3,7,1,'#8a6a48');RC(g,x-2,y-2,1,2,'#5a4632');RC(g,x+2,y-2,1,2,'#5a4632');});};
      umb(1.36,1.56,'#2f6fae');umb(1.54,1.68,'#e0a030');umb(1.42,1.84,'#e0a030');umb(1.72,1.82,'#2f6fae');
      const kiosk=(u0,v0,d)=>{SHD.push(['b',u0,v0,.2,.12,11]);S.o(d,(g,n)=>{boxZ(g,u0,v0,.2,.12,0,8,'#e9eef1','#f2f5f7','#c4ced5');
        fL(g,v0+.12,u0+.02,u0+.18,3,7,'#3a4a58');if(n)fL(n,v0+.12,u0+.02,u0+.18,3,7,C.lit);
        for(let i=0;i<5;i++){const a=u0-.02+i*.048;fp(g,[P(a,v0+.12,9),P(a+.048,v0+.12,9),P(a+.048,v0+.18,6),P(a,v0+.18,6)],i%2?'#ffffff':C.blue);}
        boxZ(g,u0+.04,v0+.02,.12,.08,8,3,'#f0c040','#f6d060','#c89a28');});};
      kiosk(1.72,1.44,3.2);kiosk(1.22,1.66,2.9);
      L.crowd(S,L.scatter(386,14,1.24,1.14,.66,.76),0,3.3);L.bench(S,1.3,1.2,true);L.bench(S,1.5,1.2,true);
      // 前廣場：售票亭＋排隊＋旗桿
      Q.booth(S,SHD,.84,1.5,.2,.14,2.3);
      Q.queue(S,.3,.78,[1.52,1.6],2.3);
      L.crowd(S,[[.34,1.56,0],[.4,1.56,3],[.47,1.57,5],[.55,1.56,2],[.62,1.64,7],[.5,1.64,4],[.9,1.7,8],[.95,1.7,1]],0,2.35);
      L.crowd(S,L.scatter(387,10,.14,1.7,.9,.24),0,3.0);
      const flagAt=L.flagPole(S,.16,1.52,9,1.7);
      L.tree(S,SHD,.1,1.9,1,1);L.tree(S,SHD,.5,1.92,.9,0);L.tree(S,SHD,1.92,1.92,1,2);L.tree(S,SHD,1.95,1.6,.9,0);L.tree(S,SHD,1.14,.12,1,2);
      L.lamp(S,.26,1.74,16);L.lamp(S,.92,1.86,16);L.lamp(S,1.18,1.08,16);
      L.bench(S,.62,1.84,true);L.bench(S,1.86,1.7,false);
      L.lotEdge(g,C.curbD,C.curbL);
      return{flagAt};});

    // -------- v2 現代方盒＋前庭海豚潟湖 --------
    const v2=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,ell,bmpL,bmpR,textL}=L,Q=aq(K,L);
      A.dia(g,AX,L.TOPY,64,C.pave);
      L.pave(g,0,0,2,2,C.pave,C.paveJ,.25,390,[C.paveL,C.paveD]);
      // 停車場（右前）
      flat(g,1.32,1.1,.68,.9,C.asph);for(let u=1.37;u<1.95;u+=.14)BL(g,P(u,1.12),P(u,1.4),C.stripe);
      BL(g,P(1.32,1.1),P(2,1.1),'#9a978f');BL(g,P(1.32,1.1),P(1.32,2),'#9a978f');
      // 潟湖（左前大池）
      Q.pool(g,Q.shp(.68,1.5,.54,.34,3),{seed:391,nh:24,cope:.04,dep:2});
      L.grass(g,1.12,1.0,.18,.1,392);
      // ===== 主館：現代方盒 =====
      const u0=.12,v0=.12,u1=1.02,v1=.82,hh=44;SHD.push(['b',u0,v0,u1-u0,v1-v0,hh]);
      S.o(.5,(g,n)=>{boxZ(g,u0,v0,u1-u0,v1-v0,0,hh,'#cfd9e0',C.white,C.whiteR);
        // 左立面：藍色馬賽克（下深上淺）＋白框＋白色鯨魚
        const mz0=14,mz1=hh-8;for(let z=mz0;z<mz1;z+=3){for(let t=u0+.04;t<u1-.05;t+=3/32){const f=(z-mz0)/(mz1-mz0),h=hsh(rnd(t*64),z,393);
          const col=f<.33?(h<.5?'#1f4f86':'#245a94'):f<.66?(h<.5?'#2f6fae':'#3a7cbc'):(h<.5?'#5d9ccc':'#78b2dc');fL(g,v1,t,Math.min(u1-.04,t+3/32),z,Math.min(mz1,z+3),col);}}
        bmpL(g,v1,u0+.14,31,WHALE,{b:'#ffffff',w:C.blue,l:'#dfeaf2'});
        fL(g,v1,u0,u1,hh-7,hh-1,C.navy);textL(g,v1,u0+.1,hh-2,'OCEAN','#ffffff',n,'#dff4ff',2);
        // 右立面：入口玻璃＋帶狀窗
        fR(g,u1,.28,.66,0,15,C.glassR);for(let t=.28;t<=.66+1e-6;t+=.063)vln(g,u1,t,0,15,C.mullR);lnR(g,u1,.28,.66,8,C.mullR);
        fR(g,u1,.4,.54,0,8,'#253f58');if(n){fR(n,u1,.28,.66,0,15,'#ffdf9a');fR(n,u1,.4,.54,0,8,'#fff0c8');}
        for(const[zc,col]of[[19,'#2a5f94'],[25,'#3d7fb8'],[31,'#6fa6d6']]){for(let t=v0+.04;t<v1-.04-1e-6;t+=1/64){const z=zc+2*Math.sin((t-v0)*2*Math.PI/.34);fR(g,u1,t,t+1/64,z,z+3,col);}}
        fR(g,u1,v0+.06,v1-.06,35,38,'#3d6a92');for(let t=v0+.12;t<v1-.06;t+=.1)vln(g,u1,t,35,38,C.mullR);
        if(n){const ms=[v0+.06];for(let t=v0+.12;t<v1-.06;t+=.1)ms.push(t);ms.push(v1-.06);   // 整條帶狀窗均勻點亮（窗櫺不亮）
          for(let i=0;i+1<ms.length;i++)fR(n,u1,ms[i]+(i?1/64:0),ms[i+1],35,38,'#ffdf9a');}
        fR(g,u1,v0,v1,hh-7,hh-1,C.blueD);
        // 屋頂：女兒牆＋玻璃天窗＋設備
        fp(g,[P(u0+.03,v0+.03,hh),P(u1-.03,v0+.03,hh),P(u1-.03,v1-.03,hh),P(u0+.03,v1-.03,hh)],'#b9c6cf');
        boxZ(g,.36,.26,.36,.32,hh,5,'#9fd0ee','#7fb4d8','#5b8fb5');for(let t=.4;t<.72;t+=.06)BL(g,P(t,.26,hh+5),P(t,.58,hh+5),'#e6f2f8');
        boxZ(g,.18,.62,.12,.1,hh,4,'#aeb9c0','#c3ccd2','#949fa7');boxZ(g,.8,.2,.12,.12,hh,3,'#aeb9c0','#c3ccd2','#949fa7');
        if(n)for(let t=.4;t<.72;t+=.06)fp(n,[P(t,.3,hh+5),P(t+.03,.3,hh+5),P(t+.03,.54,hh+5),P(t,.54,hh+5)],'rgba(200,236,255,.6)');
      });
      // 入口雨遮（右立面外挑）
      S.o(1.6,(g,n)=>{boxZ(g,u1,.26,.14,.42,14,2,C.whiteT,C.blue,C.blueD);const a=P(u1+.12,.3,0),b=P(u1+.12,.64,0);RC(g,a[0],a[1]-14,1,14,'#9fb0bc');RC(g,b[0],b[1]-14,1,14,'#9fb0bc');
        for(const t of[.36,.47,.58]){const p=P(u1+.14,t,14);RC(g,p[0],p[1],1,1,'#fff6d8');if(n)RC(n,p[0],p[1],1,1,'#fff1c0');}});
      // 館前看台（座位朝潟湖）
      Q.stands(S,SHD,u0+.02,u1-.02,v1+.28,4,.07,3,1.0,{seed:395,pp:.6});
      Q.glassRail(S,[[.14,1.12],[1.0,1.12]],1.9);
      // 潟湖內：浮台、海豚、訓練員
      S.o(2.0,(g)=>{boxZ(g,.15,1.5,.12,.3,0,2,'#f2f5f7','#dfe6ea','#b9c5cd');});
      L.crowd(S,[[.21,1.6,6],[.22,1.72,1]],2,2.01);
      // 兩隻 16px 躍起海豚（同向接力跳），尾端白水花環；前方一片背鰭
      Q.dolphin(S,.546875,1.703125,2.3,false);Q.dolphin(S,.8125,1.4375,2.5,false);Q.fin(S,.9,1.8,2.45);
      // 右側入口廣場：售票亭、排隊、旗桿
      Q.booth(S,SHD,1.5,.16,.22,.16,1.1);
      Q.queue(S,1.16,1.5,[.44,.52,.6],1.8);
      L.crowd(S,[[1.2,.48,0],[1.26,.48,3],[1.33,.49,5],[1.4,.56,2],[1.3,.56,7],[1.22,.64,4],[1.58,.38,8],[1.64,.38,1]],0,1.9);
      L.crowd(S,L.scatter(396,12,1.12,.66,.8,.38),0,2.2);
      const flagAt=L.flagPole(S,1.88,.84,9,2.74);
      L.tree(S,SHD,1.9,.2,1,2);L.tree(S,SHD,1.9,.5,.9,0);L.tree(S,SHD,1.22,1.06,.9,1);
      L.lamp(S,1.14,.2,16);L.lamp(S,1.8,1.02,16);L.lamp(S,1.24,1.9,16);L.lamp(S,.06,1.4,16);
      L.bench(S,1.7,.78,true);
      // 停車：前緣巴士（長側朝觀者）＋小車兩排
      L.bus(S,SHD,'u',1.38,1.8,'#2f6fae',true);
      const cc=['#c0392b','#e8e8e8','#2f5d8a','#3a3f45','#d8b24a','#5b8a4a'];
      [1.39,1.53,1.81].forEach((u,i)=>L.car(S,SHD,u,1.15,false,cc[i]));
      L.tree(S,SHD,.1,1.92,.9,0);L.tree(S,SHD,1.2,1.94,.9,2);
      L.lotEdge(g,C.curbD,C.curbL);
      return{flagAt};});

    B['37_1_0']=v0;B['37_1_1']=v1;B['37_1_2']=v2;
    if(B['37_1_3'])B['37_1_3']=B['37_1_0'];if(B['37_1_4'])B['37_1_4']=B['37_1_1'];
  }catch(e){errs.push('k37: '+(e&&e.stack||e));}

  // ================= k40 電影院（1×1） =================
  try{
    const [W,H,AX,AY]=dims(40,[72,112,36,110]),SZ=1;
    const PC_=k=>['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a'][k%8];
    const C={walk:'#cfcac0',walkJ:'#c0bbb1',walkL:'#d8d3c9',walkD:'#c5c0b5',curbD:'#8a857b',curbL:'#d6d1c5',
      bulb:'#ffe9a0',bulbN:'#fff4c4',lit:'#ffe3a2',litW:'#fff1c8'};
    const POSTER=[['#c0392b','#f0c040','#2c2f36'],['#2f6fae','#e8e8e8','#1c2430'],['#3f7a4a','#e0a030','#20251e'],['#8a4f9a','#f06a8a','#241d2c'],['#d06a3a','#f4e2b0','#2a1e18']];
    // 海報框（+v 面）：框＋三色色塊構圖
    const posterL=(L,g,n,v,ua,ub,za,zb,k)=>{const{fL}=L,pc=POSTER[k%POSTER.length];fL(g,v,ua-.015,ub+.015,za-1,zb+1,'#c9a24a');fL(g,v,ua,ub,za,zb,pc[2]);
      fL(g,v,ua,ub,za+(zb-za)*.45,zb,pc[0]);fL(g,v,ua+(ub-ua)*.3,ub-(ub-ua)*.3,za+(zb-za)*.2,za+(zb-za)*.6,pc[1]);if(n){fL(n,v,ua,ub,za,zb,'rgba(255,240,200,.55)');fL(n,v,ua+(ub-ua)*.3,ub-(ub-ua)*.3,za+(zb-za)*.2,za+(zb-za)*.6,pc[1]);}};
    const posterR=(L,g,n,u,va,vb,za,zb,k)=>{const{fR}=L,pc=POSTER[k%POSTER.length];fR(g,u,va-.015,vb+.015,za-1,zb+1,'#9c7c34');fR(g,u,va,vb,za,zb,pc[2]);
      fR(g,u,va,vb,za+(zb-za)*.45,zb,A.shade(pc[0],-30));fR(g,u,va+(vb-va)*.3,vb-(vb-va)*.3,za+(zb-za)*.2,za+(zb-za)*.6,A.shade(pc[1],-30));if(n){fR(n,u,va,vb,za,zb,'rgba(255,240,200,.5)');fR(n,u,va+(vb-va)*.3,vb-(vb-va)*.3,za+(zb-za)*.2,za+(zb-za)*.6,pc[1]);}};
    const ground=(L,g,seed)=>{A.dia(g,L.AX,L.TOPY,32,C.walk);L.pave(g,0,0,1,1,C.walk,C.walkJ,.125,seed,[C.walkL,C.walkD]);};

    // -------- v0 Art Deco 單廳 --------
    const v0=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,bmpL,textL}=L;
      ground(L,g,400);
      const st={t:'#ece1c6',l:'#e8dcc0',r:'#bba886',j:'#d6c8a8',jr:'#a8966f',teal:'#2f7d7a',tealD:'#23615f',gold:'#d9ac3c',red:'#b8322c',redD:'#8e2622'};
      // 放映廳（後方無窗大量體）
      SHD.push(['b',.06,.06,.8,.5,44]);
      S.o(.5,(g,n)=>{boxZ(g,.06,.06,.8,.5,0,44,'#8d877c',st.l,st.r);
        fp(g,[P(.09,.09,44),P(.83,.09,44),P(.83,.53,44),P(.09,.53,44)],'#7a746a');
        for(let t=.12;t<.56;t+=.11)fR(g,.86,t,t+.03,0,44,'#c9b796');                    // 壁柱
        fR(g,.86,.06,.56,38,40,st.teal);fL(g,.56,.06,.86,38,40,st.teal);
        fR(g,.86,.14,.22,0,7,'#6a5a48');fR(g,.86,.13,.23,7,8,st.tealD);                    // 太平門
        boxZ(g,.2,.16,.14,.12,44,4,'#b9b3a8','#c9c3b8','#9e988d');});
      // 門廳量體
      SHD.push(['b',.06,.56,.8,.2,30]);
      S.o(1.0,(g,n)=>{boxZ(g,.06,.56,.8,.2,0,30,st.t,st.l,st.r);
        for(let t=.1;t<.84;t+=.06)vln(g,t,.76,19,28,st.j);                               // 直向溝槽
        fL(g,.76,.06,.86,28,30,st.teal);fR(g,.86,.56,.76,28,30,st.tealD);
        for(const a of[.12,.26,.64,.74]){fL(g,.76,a,a+.06,20,25,'#3e4a56');fL(g,.76,a,a+1/32,24,25,'#8fb3cc');if(n)fL(n,.76,a,a+.06,20,25,C.lit);}
        fL(g,.76,.06,.86,0,1.5,'#9c8a6c');fR(g,.86,.56,.76,0,1.5,'#7c6c52');
        // 雨遮下：銅框玻璃門＋海報框
        fL(g,.76,.26,.66,0,10,'#3a2e28');for(let t=.28;t<.66;t+=.08){fL(g,.76,t,t+.05,1,9,'#6f5a3a');fL(g,.76,t+.005,t+.045,2,8,'#2a3440');if(n)fL(n,.76,t+.005,t+.045,2,8,'#ffdf9a');}
        posterL(L,g,n,.76,.1,.2,2,10,0);posterL(L,g,n,.76,.7,.8,2,10,1);
        posterR(L,g,n,.86,.6,.7,3,11,2);});
      // 招牌塔（騎在雨遮上、靠門廳）
      S.o(1.4,(g,n)=>{boxZ(g,.38,.62,.2,.2,18,40,st.t,st.l,st.r);boxZ(g,.41,.65,.14,.14,58,5,st.t,st.l,st.r);boxZ(g,.44,.68,.08,.08,63,4,st.t,st.l,st.r);
        const sp=P(.48,.72,67);RC(g,sp[0],sp[1]-6,1,6,st.gold);RC(g,sp[0],sp[1]-7,1,1,'#fff2c0');
        fL(g,.82,.39,.57,22,56,st.red);fL(g,.82,.39,.57,56,57,st.gold);fL(g,.82,.39,.57,21,22,st.gold);
        ['C','I','N','E','M','A'].forEach((ch,i)=>textL(g,.82,.43,54-i*5.5,ch,'#ffe9a0',n,'#fff6c8'));
        for(let z=23;z<56;z+=3){const a=P(.395,.82,z),b=P(.565,.82,z);RC(g,a[0],a[1],1,1,C.bulb);RC(g,b[0],b[1],1,1,C.bulb);if(n){RC(n,a[0],a[1],1,1,C.bulbN);RC(n,b[0],b[1],1,1,C.bulbN);}}
        for(let z=24;z<56;z+=4)fR(g,.58,.63,.81,z,z+1,'#a8966f');
        fR(g,.58,.62,.82,56,57,st.gold);});
      // 售票亭（雨遮下）
      S.o(1.6,(g,n)=>{boxZ(g,.42,.8,.12,.08,0,8,st.gold,'#c89a38','#9c7424');fL(g,.88,.43,.53,3,7,'#2a3440');if(n)fL(n,.88,.43,.53,3,7,C.lit);boxZ(g,.41,.79,.14,.1,8,1.5,st.red,st.red,st.redD);});
      // 跑馬燈雨遮
      SHD.push(['b',.12,.76,.66,.18,6,12]);
      S.o(2.0,(g,n)=>{boxZ(g,.12,.76,.66,.18,12,6,'#3a2d2a','#f4efe2','#d8cfbd');
        fL(g,.94,.12,.78,12,13,st.gold);fL(g,.94,.12,.78,17,18,st.gold);fR(g,.78,.76,.94,12,13,'#a8832e');fR(g,.78,.76,.94,17,18,'#a8832e');
        for(let t=.16;t<.74;t+=.045){if(hsh(401,rnd(t*100),1)<.8)fL(g,.94,t,t+.03,15.5,16,'#2a2522');if(hsh(402,rnd(t*100),1)<.75)fL(g,.94,t,t+.03,13.5,14,'#b8322c');}
        for(let t=.8;t<.92;t+=.05)fR(g,.78,t,t+.03,14.5,15,'#2a2522');
        for(let t=.13;t<.78;t+=2/32){const a=P(t,.94,18);RC(g,a[0],a[1],1,1,C.bulb);if(n)RC(n,a[0],a[1],1,1,C.bulbN);const b=P(t+1/32,.94,12);RC(g,b[0],b[1],1,1,C.bulb);if(n)RC(n,b[0],b[1],1,1,C.bulbN);}
        for(let t=.77;t<.94;t+=2/32){const a=P(.78,t,18);RC(g,a[0],a[1],1,1,C.bulb);if(n)RC(n,a[0],a[1],1,1,C.bulbN);}
        if(n){fL(n,.94,.13,.77,13,17,'rgba(255,244,214,.8)');fR(n,.78,.77,.93,13,17,'rgba(255,236,196,.55)');}});
      // 人行道：排隊人群、路燈
      L.crowd(S,[[.2,.97,0],[.26,.97,3],[.33,.98,5],[.62,.98,2],[.9,.62,7],[.92,.3,4]],0,3);
      L.lamp(S,.94,.9,15);
      L.lotEdge(g,C.curbD,C.curbL);
    });

    // -------- v1 現代影城 --------
    const v1=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,bmpL,textL}=L;
      ground(L,g,410);
      const m={t:'#5d626a',l:'#50555d',r:'#3b3f46',seam:'#62676f',seamR:'#484c53'};
      SHD.push(['b',.06,.06,.86,.52,54]);
      S.o(.5,(g,n)=>{boxZ(g,.06,.06,.86,.52,0,54,m.t,m.l,m.r);
        for(let z=6;z<54;z+=6){lnL(g,.58,.07,.91,z,m.seam);lnR(g,.92,.07,.57,z,m.seamR);}
        fp(g,[P(.09,.09,54),P(.89,.09,54),P(.89,.55,54),P(.09,.55,54)],'#6b7078');
        // 右立面巨幅海報燈箱
        fR(g,.92,.14,.5,14,46,'#20242a');fR(g,.92,.16,.48,16,44,'#1c2430');fR(g,.92,.16,.48,30,44,'#2f6fae');fR(g,.92,.24,.4,20,34,'#e8e8e8');fR(g,.92,.28,.36,22,30,'#c0392b');
        fL(g,.58,.1,.88,40,50,'#c0392b');fL(g,.58,.1,.88,49,50,'#e8574a');fL(g,.58,.1,.88,40,41,'#8e2622');textL(g,.58,.14,48,'CINEMA','#ffffff',n,'#fff4e0');
        if(n)fL(n,.58,.1,.88,41,49,'rgba(255,90,70,.35)');
        if(n){fR(n,.92,.16,.48,16,44,'rgba(255,244,220,.35)');fR(n,.92,.16,.48,30,44,'#5aa0e8');fR(n,.92,.24,.4,20,34,'#fff6e8');fR(n,.92,.28,.36,22,30,'#ff6a50');}
        boxZ(g,.52,.14,.14,.1,54,3,'#8a9097','#9aa0a7','#70767d');{const p=P(.59,.19,57);RC(g,p[0]-2,p[1]-1,4,2,'#4e545b');RC(g,p[0]-1,p[1]-1,2,1,'#6a7178');}
        boxZ(g,.74,.3,.1,.08,54,3,'#8a9097','#9aa0a7','#70767d');boxZ(g,.2,.12,.03,.03,54,7,'#9aa0a7','#aab0b7','#80868d');});
      // 玻璃大廳
      SHD.push(['b',.06,.58,.86,.28,30]);
      S.o(1.0,(g,n)=>{boxZ(g,.06,.58,.86,.28,0,28,'#cfd6da','#2e4a5e','#243b4b');
        // 夜：逐片玻璃點亮（一樓暖、二樓略暗、少數不亮），直櫺與樓板不亮
        if(n){const bands=[[1,12,'#ffe2a0','#ffd78a'],[16,23,'#f6d49a','#e9c480']];
          for(const[z0,z1,c1,c2]of bands){for(let t=.06,i=0;t<.92-1e-6;t+=4/32,i++){if(hsh(411,i,z0)<.12)continue;fL(n,.86,t+1/32,Math.min(.92,t+4/32),z0,z1,hsh(412,i,z0)<.5?c1:c2);}
            for(let t=.58,i=0;t<.86-1e-6;t+=4/32,i++){if(hsh(413,i,z0)<.15)continue;fR(n,.92,t+1/32,Math.min(.86,t+4/32),z0,z1,hsh(414,i,z0)<.5?'#e8c07e':'#d9b06c');}}}
        // 室內：夾層樓板、手扶梯、賣店、人影（夜間以剪影壓在亮窗上）
        fL(g,.86,.06,.92,13,15,'#c7cdd1');fR(g,.92,.58,.86,13,15,'#9aa2a8');
        BL(g,P(.3,.86,2),P(.55,.86,13),'#b9c3ca');BL(g,P(.31,.86,2),P(.56,.86,13),'#8a959c');
        if(n){BL(n,P(.3,.86,2),P(.55,.86,13),'#6a6a6a');}
        fL(g,.86,.64,.84,1,5,'#c0392b');fL(g,.86,.64,.84,5,6,'#f0c040');if(n){fL(n,.86,.64,.84,1,5,'#ff7a5a');fL(n,.86,.64,.84,5,6,'#ffe070');}
        for(const[t,z,k]of[[.2,1,1],[.26,1,4],[.7,16,2],[.46,16,6],[.14,16,3]]){const p=P(t,.86,z);RC(g,p[0],p[1]-4,1,3,PC_(k));RC(g,p[0],p[1]-5,1,1,'#d8b08c');if(n)RC(n,p[0],p[1]-5,1,4,'#4a3a30');}
        for(let t=.06;t<=.92+1e-6;t+=4/32)vln(g,t,.86,0,28,'#9fb3bf');for(let t=.58;t<=.86+1e-6;t+=4/32)vln(g,.92,t,0,28,'#7d8f9b');
        lnL(g,.86,.06,.92,24,'#9fb3bf');
        fL(g,.86,.38,.56,0,9,'#1d2a33');vln(g,.47,.86,0,9,'#9fb3bf');if(n)fL(n,.86,.39,.55,1,9,'#fff0c8');
        boxZ(g,.04,.56,.9,.36,28,3,'#f2f4f5','#e6e9eb','#b9bfc3');
        for(const t of[.2,.4,.6,.8]){const p=P(t,.92,28);RC(g,p[0],p[1],1,1,'#fff6d8');if(n)RC(n,p[0],p[1],1,1,'#fff1c0');}});
      // 前緣海報燈柱
      for(const[t,k]of[[.14,0],[.78,3]]){SHD.push(['b',t,.94,.06,.03,12]);S.o(t+.95,(g,n)=>{boxZ(g,t,.93,.06,.03,0,12,'#3a3f45','#2a2e33','#1f2226');const pc=POSTER[k];fL(g,.96,t+.008,t+.052,2,11,pc[0]);fL(g,.96,t+.015,t+.045,4,8,pc[1]);if(n)fL(n,.96,t+.008,t+.052,2,11,'rgba(255,240,210,.8)');});}
      L.crowd(S,[[.32,.95,1],[.38,.96,5],[.6,.95,7],[.66,.97,2],[.96,.6,4],[.95,.3,8]],0,3);
      L.lamp(S,.96,.94,15);
      L.lotEdge(g,C.curbD,C.curbL);
    });

    // -------- v2 紅磚改建 --------
    const v2=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P,hsh}=K,{RC,BL,fp,flat,boxZ,fL,fR,lnL,lnR,vln,bmpL,textL,textR}=L;
      ground(L,g,420);
      const br={l:'#a84a3a',r:'#7e3528',j:'#8f3d2f',jr:'#6a2c22',t:'#b85a48',dk:'#5e261d',slate:'#5a6068',slateD:'#474c53',slateL:'#6c737b',trim:'#e6dccb'};
      const u0=.08,v0=.08,u1=.88,v1=.8,hw=32,um=(u0+u1)/2,rise=14;SHD.push(['b',u0,v0,u1-u0,v1-v0,hw+8]);
      S.o(.5,(g,n)=>{
        // 屋面（+u 坡，可見）
        fp(g,[P(um,v0,hw+rise),P(u1+.02,v0,hw-1),P(u1+.02,v1,hw-1),P(um,v1,hw+rise)],br.slate);
        for(let t=v0+.04;t<v1;t+=.06)BL(g,P(um,t,hw+rise),P(u1+.02,t,hw-1),br.slateD);
        BL(g,P(um,v0,hw+rise),P(um,v1,hw+rise),br.slateL);
        boxZ(g,um-.03,.3,.06,.12,hw+rise-1,4,'#7a7f86','#8a9097','#5f646b');         // 屋脊通風塔
        // 右牆（暗）
        fR(g,u1,v0,v1,0,hw,br.r);for(let z=2;z<hw;z+=2)lnR(g,u1,v0,v1,z,br.jr);
        // 盲拱（封死的舊拱窗）
        for(const t of[.16,.36,.56]){fR(g,u1,t,t+.1,4,22,br.dk);
          fR(g,u1,t+.02,t+.08,22,24,br.dk);fR(g,u1,t-.01,t+.11,24,25,'#9a4636');for(let z=6;z<22;z+=2)lnR(g,u1,t,t+.1,z,'#4e1f18');}
        textR(g,u1,.7,29,'CINEMA','#c2a08c',null,null,1);
        // 山牆立面（亮）
        // 階梯山牆（crow-stepped）：每階一塊磚面＋白石壓頂，階頂略高於屋面線
        const brickL=(ua,ub,za,zb)=>{fL(g,v1,ua,ub,za,zb,br.l);for(let z=za+2;z<zb;z+=2)lnL(g,v1,ua,ub,z,br.j);};
        brickL(u0,u1,0,hw);const NS=4,st=(um-u0)/NS;
        for(let i=0;i<NS;i++){const zt=hw+(rise+1)*(i+1)/NS+1,a=u0+st*i,b=u1-st*i;brickL(a,b,hw,zt);
          fL(g,v1,a-.012,a+st+.004,zt,zt+1.6,br.trim);fL(g,v1,b-st-.004,b+.012,zt,zt+1.6,br.trim);}
        fL(g,v1,um-st*.5,um+st*.5,hw+rise+2,hw+rise+4,br.l);fL(g,v1,um-st*.5-.012,um+st*.5+.012,hw+rise+4,hw+rise+5.6,br.trim);
        // 圓窗
        const oc=P(um,v1,hw+6);RC(g,oc[0]-2,oc[1]-2,5,5,br.trim);RC(g,oc[0]-1,oc[1]-1,3,3,'#34404c');if(n)RC(n,oc[0]-1,oc[1]-1,3,3,'#ffd98a');
        // 兩側高拱窗
        for(const a of[.14,.72]){fL(g,v1,a,a+.06,24,31,'#34404c');fL(g,v1,a-.01,a+.07,31,32,br.trim);fL(g,v1,a+.01,a+.05,32,33,br.trim);fL(g,v1,a-.005,a+.065,23,24,br.trim);
          if(n)fL(n,v1,a,a+.06,24,31,'#ffd98a');}
        // 橫式燈泡招牌
        fL(g,v1,.1,.86,14,22,'#1d1f22');fL(g,v1,.1,.86,21,22,'#c9a24a');fL(g,v1,.1,.86,14,15,'#c9a24a');
        textL(g,v1,.13,20.5,'CINEMA','#ffe9a0',n,'#fff6c8',1);
        for(let t=.11;t<.86;t+=2/32){const a=P(t,v1,22.5);RC(g,a[0],a[1],1,1,C.bulb);if(n)RC(n,a[0],a[1],1,1,C.bulbN);}
        fL(g,v1,u0,u1,0,1.5,'#6a3a30');
      });
      // 鋼構玻璃新入口
      SHD.push(['b',.22,.8,.46,.12,12]);
      S.o(1.2,(g,n)=>{boxZ(g,.22,.8,.46,.12,0,12,'#2b2e32','#3f5566','#2e3f4c');
        for(let t=.22;t<=.68+1e-6;t+=.0625)vln(g,t,.92,0,12,'#1d1f22');lnL(g,.92,.22,.68,7,'#1d1f22');
        fL(g,.92,.38,.52,0,7,'#1a2229');
        for(let t=.8;t<=.92+1e-6;t+=.06)vln(g,.68,t,0,12,'#16181b');
        if(n){fL(n,.92,.23,.67,1,11,'rgba(255,222,150,.8)');fR(n,.68,.81,.91,1,11,'rgba(255,210,140,.55)');}
        boxZ(g,.2,.78,.5,.16,12,1.5,'#3a3d42','#2b2e32','#1d1f22');
        posterL(L,g,n,.92,.24,.32,2,9,4);posterL(L,g,n,.92,.58,.66,2,9,1);});
      // 單車架、咖啡座、人
      S.t(2,(g)=>{for(let i=0;i<3;i++){const p=P(.76+i*.05,.96,0);RC(g,p[0],p[1]-3,1,3,'#3a3d40');RC(g,p[0]-1,p[1]-2,3,1,'#6a7075');}});
      S.o(1.9,(g)=>{const p=P(.1,.92,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-8,1,8,'#5a5f63');RC(g,x-4,y-10,9,1,'#e8e2d0');RC(g,x-3,y-11,7,1,'#c0392b');RC(g,x-2,y-3,5,1,'#6a4a30');});
      L.crowd(S,[[.14,.96,1],[.3,.97,5],[.44,.97,0],[.58,.96,7],[.94,.5,2],[.95,.24,6]],0,3);
      L.lamp(S,.94,.9,15);
      L.lotEdge(g,C.curbD,C.curbL);
    });
    B['40_1_0']=v0;B['40_1_1']=v1;B['40_1_2']=v2;
    if(B['40_1_3'])B['40_1_3']=B['40_1_0'];if(B['40_1_4'])B['40_1_4']=B['40_1_1'];
  }catch(e){errs.push('k40: '+(e&&e.stack||e));}
  if(errs.length)console.warn('cul_b errs',errs);
});
