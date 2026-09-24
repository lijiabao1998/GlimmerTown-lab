// cul_c：動物園 k38／遊樂園 k39（皆 3×3，畫布 208×220，錨 104,218）——實驗線文化休閒第三刀重畫。
//   k38 v0 左前邊正中大門＋中央火鶴湖（湖心島）＋環湖步道；後方長頸鹿草原、右側象舍＋象欄、左側斑馬草場、右前小賣店
//       v1 右前邊正中大門＋十字步道分四欄；北角大象館＋泥浴池、東側長頸鹿草原＋餵食台、西側火鶴池、前方小賣店野餐區
//       v2 南角正面大門＋中軸大道＋雕像圓環；後方長頸鹿草原（餵食台）、東側象欄＋拱頂象館、西側鳥園網籠＋火鶴潟湖
//   k39 見下方
// iter20–23（重跑一輪）：斑馬重畫成直條紋馬形；v2 象館改桶形拱金屬屋頂（與 v0 紅瓦、v1 茅草區隔）；
//   遊樂園 v0 西角補兩座條紋篷遊戲攤＋陽傘桌、v1 東角補碰碰車館＋陽傘桌（原本是空沙地）；旋轉木馬甲板改深木色讓白馬跳出來
// 修正輪 iter24–26（k39 退件）：入口 FUN 招牌改直橫樑＋逐字直立跑馬燈字牌（v1 原本弧形斜排字看成反 F）、v1 拱門加寬到 0.92 格；
//   v1 海盜船重畫（前 A 字架移到船身後、深藍鋼架、清楚的樞軸樑與 V 形吊臂、新月形紅金船身、小桅杆小旗）；
//   v1 碰碰車館屋頂加黃框白底紅車圖示招牌＋浪板接縫；v0 遊戲攤加寬、簷下吊一排大玩偶、櫃台前一排套圈瓶。k38 本輪未動。
// 分層合成：地坪直接畫；立體件各自二值化＋深色外框，依深度由後往前；細線件（人、欄杆、柵欄、動物小圖）不描邊。
// 光從左：+v 面亮、+u 面暗；落影向右。夜圖只點白天畫出的燈具、窗、招牌。零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function cul_c(A){
  // 注入測試時本批次排在內嵌 b0x（會蓋掉 38／39 的 _1_1、_1_2）之前 ⇒ 不是最後一棒就把本體排到隊尾再跑；正式整合接在最後則直接執行
  const QL=window.__variants574||[];
  if(!cul_c.__late&&QL.indexOf(cul_c)>=0&&QL.indexOf(cul_c)<QL.length-1){cul_c.__late=1;QL.push(function cul_c_late(A2){cul_c(A2);});return;}
  const B=A.SPR().bld,rnd=Math.round;
  const errs=[];window.__cul_c_errs=errs;
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w|0,o.h|0,o.ax|0,o.ay|0]:d;};

  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['1001','1010','1100','1010','1001'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    N:['1001','1101','1011','1001','1001'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],
    W:['101','101','111','111','101'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111']};

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
    const polyUV=(g,pts,c,z=0)=>fp(g,pts.map(([u,v])=>P(u,v,z)),c);
    const inPoly=(pts,u,v)=>{let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[a,b]=pts[i],[c,d]=pts[j];if(((b>v)!==(d>v))&&(u<(c-a)*(v-b)/(d-b)+a))ins=!ins;}return ins;};
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
    // 斜面文字：每個字母本身不剪切，字與字之間沿斜面逐字下移（+v 面）／上移（+u 面）；flat＝正面水平排字
    // 字寬依字形（K 為 4 寬：上下兩斜筆分開、不封口，免得讀成 R）
    const GW=ch=>FONT[ch]?FONT[ch][0].length:3;
    const glyph=(g,n,x,y,gl,col,ncol)=>{if(gl)for(let r=0;r<5;r++)for(let c=0;c<gl[r].length;c++)if(gl[r][c]==='1'){RC(g,x+c,y+r,1,1,col);if(n)RC(n,x+c,y+r,1,1,ncol);}};
    const textL=(g,v,u,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){glyph(g,n,x0+k,y0+Math.round(k/2),FONT[ch],col,ncol);k+=GW(ch)+sp;}};
    const textR=(g,u,v,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){glyph(g,n,x0+k,y0-Math.round(k/2),FONT[ch],col,ncol);k+=GW(ch)+sp;}};
    const textF=(g,x0,y0,str,col,n,ncol,sp=1)=>{let k=0;for(const ch of str){glyph(g,n,x0+k,y0,FONT[ch],col,ncol);k+=GW(ch)+sp;}};
    const textW=(str,sp=1)=>{let w=-sp;for(const ch of str)w+=GW(ch)+sp;return w;};
    // 沿弧形招牌逐字排：axis 'u'（+v 面，字往右下走）／'v'（+u 面，字往右上走）；m＝招牌中點沿軸座標，c＝面的固定座標；zf(s)＝距中點 s 格處的字頂高
    const arcText=(g,n,axis,c,m,zf,str,col,ncol,sp=1)=>{const tw=textW(str,sp);let k=0;
      for(const ch of str){const gw=GW(ch),s=(k-tw/2)/32,sc=s+gw/64,z=zf(sc),p=axis==='u'?P(m+s,c,z):P(c,m-s,z),pc=axis==='u'?P(m+sc,c,z):P(c,m-sc,z);   // x 取字左緣、y 取字中線（字身置中在招牌帶上）
        glyph(g,n,rnd(p[0]),rnd(pc[1]),FONT[ch],col,ncol);k+=gw+sp;}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]／['c',cu,cv,r,h]／['poly',uvPts]
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}
        else if(s[0]==='c'){const[,cu,cv,r,h]=s;for(let i=0;i<=8;i++){const k=h/64*i/8,p=P(cu+k,cv-.45*k);ell(sx,p[0],p[1],r*45.25,r*22.6,C);}}
        else if(s[0]==='l'){const[,u,v,h,u2,v2,h2]=s,a2=P(u+h/64,v-.45*h/64),b2=P(u2+h2/64,v2-.45*h2/64);BL(sx,a2,b2,C);BL(sx,[a2[0],a2[1]+1],[b2[0],b2[1]+1],C);}
        else if(s[0]==='e'){const[,x,y,rx,ry]=s;ell(sx,x,y,rx,ry,C);}
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
    // 多邊形地面材質：底色＋決定性點綴（cols 內的色輪流）＋短草簇（tuft）
    const texture=(g,pts,base,cols,dens,seed,tuft)=>{if(base)polyUV(g,pts,base);let ua=1e9,ub=-1e9,va=1e9,vb=-1e9;for(const[u,v]of pts){ua=Math.min(ua,u);ub=Math.max(ub,u);va=Math.min(va,v);vb=Math.max(vb,v);}
      const n=Math.round((ub-ua)*(vb-va)*dens);for(let i=0;i<n;i++){const u=ua+hsh(seed,i,1)*(ub-ua),v=va+hsh(seed,i,2)*(vb-va);if(!inPoly(pts,u,v))continue;const p=P(u,v),c=cols[(hsh(seed,i,3)*cols.length)|0];
        if(tuft&&hsh(seed,i,4)<tuft){RC(g,p[0],p[1]-1,1,2,c);RC(g,p[0]+1,p[1],1,1,c);}else RC(g,p[0],p[1],hsh(seed,i,5)<.3?2:1,1,c);}};
    const grass=(g,pts,seed,dens=70)=>texture(g,pts,'#7aa856',['#6b984a','#8cba66','#6b984a'],dens,seed);
    const R4=(u0,v0,du,dv)=>[[u0,v0],[u0+du,v0],[u0+du,v0+dv],[u0,v0+dv]];
    // 超橢圓外形點列（uv）：n=2 橢圓、n=4 圓角矩形
    const shp=(cu,cv,a,b,n=2.4,N=64,wob=0,seed=1)=>ext=>{const o=[];for(let i=0;i<N;i++){const t=i/N*Math.PI*2,c=Math.cos(t),s=Math.sin(t),w=1+wob*(Math.sin(t*3+seed)*.6+Math.sin(t*5+seed*2)*.4);
      o.push([cu+(a*w+ext)*Math.sign(c)*Math.pow(Math.abs(c),2/n),cv+(b*w+ext)*Math.sign(s)*Math.pow(Math.abs(s),2/n)]);}return o;};
    const toS=(pts,z=0)=>pts.map(([u,v])=>P(u,v,z));
    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86','#d06a3a'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const kid=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-2,1,1,PC[(k+3)%PC.length]);RC(g,x,y-3,1,1,'#e2b48e');};
    const crowd=(S,pts,z,d)=>{if(d!=null){S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);(k>=10?kid:person)(g,p[0],p[1],k%10);}});return;}
      for(const[u,v,k]of pts)S.t(u+v+.004,(g)=>{const p=P(u,v,z);(k>=10?kid:person)(g,p[0],p[1],k%10);});};
    // 沿多邊形區域撒人（只落在區域內，且避開 avoid 判斷）
    const scatterIn=(seed,n,pts,avoid)=>{const out=[];let ua=1e9,ub=-1e9,va=1e9,vb=-1e9;for(const[u,v]of pts){ua=Math.min(ua,u);ub=Math.max(ub,u);va=Math.min(va,v);vb=Math.max(vb,v);}
      for(let i=0;i<n*6&&out.length<n;i++){const u=ua+hsh(seed,i,1)*(ub-ua),v=va+hsh(seed,i,2)*(vb-va);if(!inPoly(pts,u,v))continue;if(avoid&&avoid(u,v))continue;
        if(out.some(([a,b])=>Math.abs((a-b)-(u-v))*32<2&&Math.abs((a+b)-(u+v))*16<3))continue;out.push([u,v,Math.floor(hsh(seed,i,3)*13)]);}return out;};
    // ---------- 路燈、樹、灌木、長椅 ----------
    const lamp=(S,u,v,h=15,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x,y-h+1,1,1,'rgba(255,226,160,.55)');}});
    // 園區燈柱（復古雙燈頭）
    const lamp2=(S,u,v,h=13,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#2f3a33');RC(g,x-1,y-1,3,1,'#2f3a33');
      RC(g,x-2,y-h,5,1,'#2f3a33');RC(g,x-2,y-h-2,1,2,'#f3e6b8');RC(g,x+2,y-h-2,1,2,'#f3e6b8');RC(g,x-2,y-h-3,1,1,'#2f3a33');RC(g,x+2,y-h-3,1,1,'#2f3a33');
      if(n){RC(n,x-2,y-h-2,1,2,'#ffe6a0');RC(n,x+2,y-h-2,1,2,'#ffe6a0');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,SHD,u,v,s=1,kind=0,d)=>{SHD.push(['p',u,v,rnd(9*s)+6]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    // 金合歡：細幹分叉、平頂傘冠
    const acacia=(S,SHD,u,v,s=1,d)=>{SHD.push(['p',u,v,rnd(12*s)]);SHD.push(['e',P(u+.2*s,v-.08*s)[0],P(u+.2*s,v-.08*s)[1],rnd(7*s),2]);
      S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),h=rnd(12*s),cw=rnd(8*s);
        RC(g,x,y-h+3,1,h-3,'#5e4630');BL(g,[x,y-h+4],[x-3,y-h+1],'#5e4630');BL(g,[x,y-h+4],[x+3,y-h+1],'#4a3727');
        ell(g,x,y-h,cw,2,'#4f6b2c');ell(g,x-1,y-h-1,cw-1,1,'#6e8c3a');RC(g,x-cw+2,y-h-2,cw,1,'#8faf4e');RC(g,x+2,y-h+1,cw-3,1,'#3d5623');});};
    // 棕櫚
    const palm=(S,SHD,u,v,s=1,d)=>{SHD.push(['p',u,v,rnd(14*s)]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),h=rnd(14*s);
      for(let i=0;i<h;i++){const xo=Math.round(Math.sin(i/h*1.6)*2);RC(g,x+xo,y-i,1,1,i%3?'#8a6a45':'#6e5238');}
      const tx=x+Math.round(Math.sin(1.6)*2),ty=y-h;
      for(const[dx,dy]of[[-5,2],[-4,-1],[4,-1],[5,2],[0,-3],[-2,3],[3,3]])BL(g,[tx,ty],[tx+dx,ty+dy],dy<0?'#6fa247':'#4f7f35');RC(g,tx-1,ty,2,1,'#6e5238');});};
    const bush=(S,u,v,r=3,d,pal)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);const c=pal||['#4f7f35','#78a84c','#a3cf72'];ell(g,x,y-r+1,r,Math.max(1,r-1),c[0]);ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),c[1]);RC(g,x-1,y-r-1,1,1,c[2]);});
    const bench=(S,u,v,alongU,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const a=P(u,v),b=alongU?P(u+.1,v):P(u,v+.1);BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9a6a3e');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#6e4a2a');RC(g,a[0],a[1]-1,1,1,'#3a3d40');RC(g,b[0],b[1]-1,1,1,'#3a3d40');});
    const bin=(S,u,v,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-3,2,3,'#3f6b45');RC(g,x,y-3,2,1,'#5f8f65');});
    const rock=(g,x,y,rx,ry,pal)=>{const c=pal||['#6b645b','#8d8579','#aaa196'];ell(g,x,y-ry+1,rx,ry,c[0]);ell(g,x-1,y-ry,Math.max(1,rx-1),Math.max(1,ry-1),c[1]);RC(g,x-rx+2,y-ry*2+2,Math.max(1,rx-2),1,c[2]);};
    // 小圖：rows＋pal（'.' 透明）；flip 水平翻轉；ol 給定則自動描 1px 外框
    const STC={};
    const stamp=(key,rows,pal,ol)=>{if(STC[key])return STC[key];const w=rows[0].length+2,h=rows.length+2,[c,x]=A.cv(w,h);
      rows.forEach((r,ri)=>{for(let j=0;j<r.length;j++){const ch=r[j];if(ch!=='.'&&pal[ch]){x.fillStyle=pal[ch];x.fillRect(j+1,ri+1,1,1);}}});
      if(ol){const d=x.getImageData(0,0,w,h),a=d.data,m=[];for(let y=0;y<h;y++)for(let i=0;i<w;i++){const k=(y*w+i)*4;if(a[k+3])continue;
        const s=(i2,y2)=>i2>=0&&y2>=0&&i2<w&&y2<h&&a[(y2*w+i2)*4+3]>0;if(s(i+1,y)||s(i-1,y)||s(i,y+1)||s(i,y-1))m.push(k);}
        const n=parseInt(ol.slice(1),16);for(const k of m){a[k]=n>>16;a[k+1]=(n>>8)&255;a[k+2]=n&255;a[k+3]=255;}x.putImageData(d,0,0);}
      const[fc,fx]=A.cv(w,h);fx.save();fx.scale(-1,1);fx.drawImage(c,-w,0);fx.restore();
      return STC[key]={c,fc,w,h};};
    // 以腳底中點 (x,y) 為錨點貼小圖
    const put=(g,st,x,y,flip)=>{g.drawImage(flip?st.fc:st.c,rnd(x)-(st.w>>1),rnd(y)-st.h+1);};
    // 圓錐（扇形三角由後往前拼）：底橢圓中心 (cx,cy)、半徑 rx/ry、高 h；colF(i,cos,sin) 給色
    const cone=(g,cx,cy,rx,ry,h,colF,N=16)=>{const ap=[cx,cy-h],segs=[];for(let i=0;i<N;i++){const t0=i/N*Math.PI*2,t1=(i+1)/N*Math.PI*2,tm=(t0+t1)/2;segs.push({i,t0,t1,s:Math.sin(tm),c:Math.cos(tm)});}
      segs.sort((a,b)=>a.s-b.s);for(const s of segs)fp(g,[ap,[cx+rx*Math.cos(s.t0),cy+ry*Math.sin(s.t0)],[cx+rx*Math.cos(s.t1),cy+ry*Math.sin(s.t1)]],colF(s.i,s.c,s.s));};
    // 圓柱：底中心 (cx,cy)、半徑 rx/ry、高 h；左 40% 亮、右暗；top 給色則畫頂蓋
    const cyl=(g,cx,cy,rx,ry,h,lit,dark,top,mid)=>{cx=rnd(cx);cy=rnd(cy);for(let dx=-rx;dx<=rx;dx++){const e=Math.round(ry*Math.sqrt(Math.max(0,1-(dx*dx)/((rx+.5)*(rx+.5)))));
        const c=dx<-rx*.25?lit:(mid&&dx<rx*.35?mid:dark);RC(g,cx+dx,cy-h-e,1,h+2*e+1,c);}
      if(top)ell(g,cx,cy-h,rx,ry,top);};
    // 綠籬（軸向線段，拆小段排深度）
    const hedge=(S,a,b,h=5,d0=0)=>{const alongU=Math.abs(b[1]-a[1])<1e-6,T=.05,L2=Math.abs(alongU?b[0]-a[0]:b[1]-a[1]),n=Math.max(1,Math.round(L2/.3)),s0=alongU?Math.min(a[0],b[0]):Math.min(a[1],b[1]);
      for(let s=0;s<n;s++){const t0=s0+L2*s/n,t1=s0+L2*(s+1)/n;
        S.o((alongU?a[1]:a[0])+(t0+t1)/2+d0,(g)=>{if(alongU)boxZ(g,t0,a[1]-T,t1-t0,2*T,0,h,'#5e9644','#4d8338','#3a6a2b');else boxZ(g,a[0]-T,t0,2*T,t1-t0,0,h,'#5e9644','#4d8338','#3a6a2b');
          for(let t=t0+.03;t<t1;t+=.07){const p=alongU?P(t,a[1],h):P(a[0],t,h);RC(g,p[0],p[1],1,1,'#7fb35e');RC(g,p[0]+2,p[1]+2+(alongU?1:-1),1,1,'#3f7330');}});}};
    // 鐵柵（細線層）：立柱＋上下橫桿；gaps＝[[t0,t1],…] 以沿線參數（0..1）留開口
    const fence=(S,a,b,gaps=[],d0=0,col='#34463c',h=5)=>{const L2=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L2/.25));
      const open=t=>gaps.some(([x,y])=>t>x&&t<y);
      for(let s=0;s<n;s++){const t0=s/n,t1=(s+1)/n;const Pt=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);
        S.t((a[0]+a[1]+b[0]+b[1])/2*0+(a[0]+(b[0]-a[0])*(t0+t1)/2)+(a[1]+(b[1]-a[1])*(t0+t1)/2)+d0,(g)=>{const m=Math.max(1,Math.round((t1-t0)*L2/.05));
          for(let j=0;j<=m;j++){const t=t0+(t1-t0)*j/m;if(open(t))continue;const p=Pt(t,0);RC(g,p[0],p[1]-h,1,h,col);}
          const k=12;for(let j=0;j<k;j++){const ta=t0+(t1-t0)*j/k,tb=t0+(t1-t0)*(j+1)/k;if(open((ta+tb)/2))continue;BL(g,Pt(ta,h-1),Pt(tb,h-1),col);BL(g,Pt(ta,1),Pt(tb,1),col);}});}};
    return {P,hsh,AX,AY,TOPY,RC,BL,fp,Q,flat,polyUV,inPoly,boxZ,fL,fR,lnL,lnR,vln,ell,textL,textR,textF,textW,arcText,scene,shadow,clipLot,pave,lotEdge,texture,grass,R4,shp,toS,
      person,kid,crowd,scatterIn,lamp,lamp2,tree,acacia,palm,bush,bench,bin,rock,stamp,put,cone,cyl,hedge,fence};
  };

  // 組裝：地坪 → 落影 → 分層立體件 → 裁掉佔地南緣外
  const assemble=(W,H,AX,AY,SZ,draw)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H,SZ);const{c,g,nc,ng}=K.canvases();const S=L.scene(),SHD=[];
    const ex=draw(K,L,g,ng,S,SHD)||{};L.shadow(g,SHD);S.run(g,ng);if(ex.post)ex.post(g,ng);L.clipLot(c);L.clipLot(nc);
    const o={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};if(ex.flagAt)o.flagAt=ex.flagAt;return o;};

  // ================= k38 動物園（3×3） =================
  try{
    const [W,H,AX,AY]=dims(38,[208,220,104,218]),SZ=3;
    const C={lawn:'#6f9e4b',lawnD:'#5f8c42',lawnL:'#86b35e',path:'#dfd2b2',pathJ:'#cdbf9c',pathL:'#ebe1c8',pathD:'#d2c4a2',curb:'#a99b78',
      sav:'#bdb46a',savD:'#a79e58',savL:'#d0c882',savT:'#8f8a48',dirt:'#c9a676',dirtD:'#b08c61',dirtL:'#d9bb8f',
      bank:'#cdb88a',bankD:'#9f8a60',water:'#3f93c6',waterD:'#327db0',waterL:'#77bfe6',waterH:'#c4ecfb',
      stone:'#b9ae99',stoneD:'#958b79',stoneT:'#d8cfbb',stoneJ:'#a0967f',
      wood:'#8a6a45',woodD:'#5e4630',woodL:'#b08a5c',
      cream:'#efe4c8',creamR:'#cbbd9c',roof:'#b4583c',roofD:'#8e4330',
      green:'#2f6b45',greenD:'#234f33',greenL:'#4f9a66',yel:'#f0c640',lit:'#ffe7a8'};
    // ---- 動物小圖（腳底中點為錨，全部面右；flip 面左）----
    const GIR=['........k.k.','........###.','........####','.......##.##','.......#s...','......s#....','......#s....',
      '.....s#.....','....##s#....','.#s##s##s...','k##s##s##...','.#s##s#s#...','..d#...d#...','..d#...d#...','..d#...d#...','..kk...kk...'];
    const GIR_PAL={'#':'#dca445',s:'#94581f',d:'#b98433',k:'#3a2512'};
    // 斑馬（iter20 重畫）：馬形剪影——鬃毛立起的頸、向前的頭＋灰色口鼻；身上黑紋各列對齊成直條（白二黑一，錯位會變成斑點）；腿白黑白三段
    const ZEB=['.........k...','........kwww.','.......kwkwwn','.wwkwwkwwk...','kwwkwwkww....','.wwkwwkww....','.ww....ww....','.kk....kk....','.ww....ww....'];
    const ZEB_PAL={w:'#f4f2ea',k:'#2a2a2a',n:'#55504a'};
    const FLA=['...pp','...pk','..p..','...p.','lppp.','.pp..','..d..','..d..','..d..'];
    const FLA2=['.....','.....','.....','lppp.','.ppp.','..pp.','..d..','..d..','..d..'];
    const FLA_PAL={p:'#ee8aa0',l:'#f8c3cd',d:'#b56b7b',k:'#2b2020'};
    const zoo=(K,L)=>{const{P,hsh}=K,{RC,BL,fp,flat,polyUV,boxZ,fL,fR,lnL,lnR,vln,ell,textL,texture,R4,shp,toS,stamp,put}=L;
      const sGir=stamp('gir',GIR,GIR_PAL,'#3a2512'),sZeb=stamp('zeb',ZEB,ZEB_PAL,'#3a3a3a'),sFla=stamp('fla',FLA,FLA_PAL),sFla2=stamp('fla2',FLA2,FLA_PAL);
      // 大象：側面剪影格（b 身、h 頭、e 耳、r 鼻、w 象牙、k 眼、t 尾、l 近側腿、D 遠側腿、d 腹下）
      //   先按朝向排好格子，再逐像素打光（頂緣受光、左緣亮、右緣與腹下暗；耳緣深、近腿左亮右暗），最後描 1px 外框。面右；flip 面左（光仍從左）
      const ELE=['....bbbbb......','..bbbbbbbb.hh..','.bbbbbbbbeehhh.','.bbbbbbbeeehkhh','tbbbbbbbeeehhhh','tbbbbbbbeeeehrr','tbbbbbbbbeebwr.',
        '.DDlldddDDll.r.','.DDll...DDll.r.','.DDll...DDll.r.','.DDll...DDll.rr'];
      const CALF=['..bbbb.hh.','.bbbbbeehh','tbbbbbeekh','.bbbbbbehr','.Dldd.Dl.r','.Dl...Dl.r','.Dl...Dl.r'];
      const mkBeast=(rows,flip)=>{const G=rows.map(r=>flip?r.split('').reverse().join(''):r),h0=G.length,w0=G[0].length,w=w0+2,h=h0+2,[c,x]=A.cv(w,h);
        const at=(i,j)=>(j>=0&&j<h0&&i>=0&&i<w0)?G[j][i]:'.',BD=ch=>ch==='b'||ch==='h';
        const col=(i,j)=>{const ch=at(i,j),up=at(i,j-1),lf=at(i-1,j),rt=at(i+1,j),dn=at(i,j+1);
          if(BD(ch))return up==='.'?'#d2d4d2':lf==='.'?'#bcbebd':rt==='.'?'#8c8e8d':(!BD(dn)&&dn!=='e'&&dn!=='w'&&dn!=='k')?'#909291':'#a8aaa9';
          if(ch==='e')return (lf==='b'||rt==='b'||dn!=='e')?'#626464':'#858786';
          if(ch==='l')return lf==='l'?'#8f9190':'#b2b4b3';
          if(ch==='r')return lf==='.'||lf==='w'?'#b4b6b5':'#989a99';
          return {d:'#7a7c7b',D:'#6a6c6b',t:'#6a6c6b',w:'#faf6ea',k:'#1a1a1a'}[ch]||null;};
        for(let j=0;j<h0;j++)for(let i=0;i<w0;i++){const cc=col(i,j);if(cc){x.fillStyle=cc;x.fillRect(i+1,j+1,1,1);}}
        const d=x.getImageData(0,0,w,h),a=d.data,m=[];for(let y=0;y<h;y++)for(let i=0;i<w;i++){const k=(y*w+i)*4;if(a[k+3])continue;
          const s=(i2,y2)=>i2>=0&&y2>=0&&i2<w&&y2<h&&a[(y2*w+i2)*4+3]>0;if(s(i+1,y)||s(i-1,y)||s(i,y+1)||s(i,y-1))m.push(k);}
        for(const k of m){a[k]=0x34;a[k+1]=0x36;a[k+2]=0x36;a[k+3]=255;}x.putImageData(d,0,0);return{c,w,h};};
      const pair=rows=>{const R0=mkBeast(rows,false),R1=mkBeast(rows,true);return{c:R0.c,fc:R1.c,w:R0.w,h:R0.h};};
      const sEle=pair(ELE),sCalf=pair(CALF);
      const animal=(S,SHD,st,u,v,flip,d,sw)=>{const p=P(u,v);SHD.push(['e',p[0]+2,p[1],sw||4,1]);S.t(d!=null?d:u+v+.01,(g)=>put(g,st,p[0],p[1]+1,flip));};
      const giraffe=(S,SHD,u,v,flip,d)=>animal(S,SHD,sGir,u,v,flip,d,5);
      const elephant=(S,SHD,u,v,flip,d,calf)=>animal(S,SHD,calf?sCalf:sEle,u,v,flip,d,calf?5:8);
      const zebra=(S,SHD,u,v,flip,d)=>animal(S,SHD,sZeb,u,v,flip,d,5);
      const flamingo=(S,u,v,flip,low,d)=>S.t(d!=null?d:u+v+.01,(g)=>{const p=P(u,v);put(g,low?sFla2:sFla,p[0],p[1]+1,flip);RC(g,p[0]-1,p[1]+1,3,1,'#9fd6ef');});
      // 地坪材質
      const path=(g,pts,seed)=>{polyUV(g,pts,C.path);texture(g,pts,null,[C.pathJ,C.pathL,C.pathD],130,seed);};
      const sav=(g,pts,seed)=>texture(g,pts,C.sav,[C.savD,C.savL,C.savT,C.savD],120,seed,.35);
      const dirt=(g,pts,seed)=>texture(g,pts,C.dirt,[C.dirtD,C.dirtL,C.dirtD],100,seed);
      const lawnP=(g,pts,seed)=>texture(g,pts,C.lawn,[C.lawnD,C.lawnL,C.lawnD],90,seed,.3);
      const meadow=(g,pts,seed)=>texture(g,pts,'#8db85c',['#7aa84e','#a3c76c','#7aa84e','#c9b85a'],110,seed,.4);
      // 花圃：土色底＋彩點
      const flowers=(g,pts,seed)=>{texture(g,pts,'#6c8f45',['#e05a6a','#f2c94c','#f4f1e6','#b86ad0','#e0843a'],260,seed);};
      // 天然水池：泥岸 → 下沉水面（深心＋反光）
      const pond=(g,sh,o={})=>{const bank=o.bank==null?.05:o.bank;fp(g,toS(sh(bank)),o.bankC||C.bank);fp(g,toS(sh(bank*.4)),o.bankD||C.bankD);
        const inner=toS(sh(0)),Wd=K.W,Hd=K.H;const[mc,mx]=A.cv(Wd,Hd);fp(mx,inner,'#000');const[wc,wx]=A.cv(Wd,Hd);
        fp(wx,inner,'#4f7d8a');fp(wx,inner.map(p=>[p[0],p[1]+1]),C.water);fp(wx,toS(sh(-(o.core||.09))).map(p=>[p[0],p[1]+1]),C.waterD);
        let xa=1e9,xb=-1e9,ya=1e9,yb=-1e9;for(const p of inner){xa=Math.min(xa,p[0]);xb=Math.max(xb,p[0]);ya=Math.min(ya,p[1]);yb=Math.max(yb,p[1]);}
        const md=mx.getImageData(0,0,Wd,Hd).data,ins=(x,y)=>x>=0&&y>=0&&x<Wd&&y<Hd&&md[(y*Wd+x)*4+3]>100;
        for(let i=0;i<(o.nh||14);i++){const x=rnd(xa+hsh(o.seed||7,i,1)*(xb-xa)),y=rnd(ya+3+hsh(o.seed||7,i,2)*(yb-ya-4)),w=2+((hsh(o.seed||7,i,3)*3)|0);
          if(ins(x,y)&&ins(x+w,y))RC(wx,x,y,w,1,i%3?C.waterL:C.waterH);}
        wx.globalCompositeOperation='destination-in';wx.drawImage(mc,0,0);g.drawImage(wc,0,0);};
      const reeds=(S,pts,seed)=>pts.forEach(([u,v],i)=>S.t(u+v+.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);for(let j=0;j<3;j++){const h=2+((hsh(seed,i,j)*3)|0);RC(g,x+j-1,y-h,1,h,j%2?'#5d8a3a':'#7aa84a');}RC(g,x,y-4,1,1,'#8a5a2b');}));
      // 木柵（兩道橫桿）
      const rail=(S,a,b,d0=0)=>{const L2=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L2/.25));
        for(let s=0;s<n;s++){const t0=s/n,t1=(s+1)/n,u0=a[0]+(b[0]-a[0])*t0,v0=a[1]+(b[1]-a[1])*t0,u1=a[0]+(b[0]-a[0])*t1,v1=a[1]+(b[1]-a[1])*t1;
          S.t((u0+u1+v0+v1)/2+d0,(g)=>{const m=Math.max(1,Math.round(Math.hypot(u1-u0,v1-v0)/.075));
            for(let j=0;j<=m;j++){const p=P(u0+(u1-u0)*j/m,v0+(v1-v0)*j/m);RC(g,p[0],p[1]-5,1,5,C.woodD);}
            BL(g,P(u0,v0,4),P(u1,v1,4),C.woodL);BL(g,P(u0,v0,2),P(u1,v1,2),C.wood);});}};
      // 石砌矮牆（軸向）
      const wall=(S,a,b,h=4,d0=0)=>{const alongU=Math.abs(b[1]-a[1])<1e-6,T=.03;const L2=Math.abs(alongU?b[0]-a[0]:b[1]-a[1]),n=Math.max(1,Math.round(L2/.3)),s0=alongU?Math.min(a[0],b[0]):Math.min(a[1],b[1]);
        for(let s=0;s<n;s++){const t0=s0+L2*s/n,t1=s0+L2*(s+1)/n;
          if(alongU){const v=a[1];S.o(v+(t0+t1)/2+d0,(g)=>{boxZ(g,t0,v-T,t1-t0,T*2,0,h,C.stoneT,C.stone,C.stoneD);for(let t=t0+.06;t<t1;t+=.12)vln(g,t,v+T,1,h-1,C.stoneJ);});}
          else{const u=a[0];S.o(u+(t0+t1)/2+d0,(g)=>{boxZ(g,u-T,t0,T*2,t1-t0,0,h,C.stoneT,C.stone,C.stoneD);for(let t=t0+.06;t<t1;t+=.12)vln(g,u+T,t,1,h-1,'#857b69');});}}};
      // 山牆屋頂房舍（脊沿 u）
      const house=(S,SHD,u0,v0,du,dv,h,rh,o,d)=>{const u1=u0+du,v1=v0+dv,vm=v0+dv/2;SHD.push(['b',u0,v0,du,dv,h+rh*.6]);
        S.o(d!=null?d:u1+v1-.1,(g,n)=>{boxZ(g,u0,v0,du,dv,0,h,null,o.wallL,o.wallR);
          fp(g,[P(u0,v0,h),P(u1,v0,h),P(u1,vm,h+rh),P(u0,vm,h+rh)],o.roofD);
          fp(g,[P(u0-.02,v1+.03,h-1),P(u1+.02,v1+.03,h-1),P(u1+.02,vm,h+rh),P(u0-.02,vm,h+rh)],o.roof);
          for(let t=u0+.05;t<u1;t+=.06)BL(g,P(t,v1+.03,h-1),P(t,vm,h+rh),A.shade(o.roof,-14));
          lnL(g,v1+.03,u0-.02,u1+.02,h-1,A.shade(o.roof,-34));BL(g,P(u0-.02,vm,h+rh),P(u1+.02,vm,h+rh),A.shade(o.roof,26));
          fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],o.gable||o.wallR);
          if(o.deco)o.deco(g,n);});};
      // 山牆屋頂房舍（脊沿 v；+v 面為山牆、+u 面為坡）
      const houseV=(S,SHD,u0,v0,du,dv,h,rh,o,d)=>{const u1=u0+du,v1=v0+dv,um=u0+du/2;SHD.push(['b',u0,v0,du,dv,h+rh*.6]);
        S.o(d!=null?d:u1+v1-.1,(g,n)=>{boxZ(g,u0,v0,du,dv,0,h,null,o.wallL,o.wallR);
          fp(g,[P(u0,v0,h),P(u0,v1,h),P(um,v1,h+rh),P(um,v0,h+rh)],A.shade(o.roof,18));
          fp(g,[P(u1+.03,v0-.02,h-1),P(u1+.03,v1+.02,h-1),P(um,v1+.02,h+rh),P(um,v0-.02,h+rh)],o.roofD);
          for(let t=v0+.05;t<v1;t+=.06)BL(g,P(u1+.03,t,h-1),P(um,t,h+rh),A.shade(o.roofD,-14));
          lnR(g,u1+.03,v0-.02,v1+.02,h-1,A.shade(o.roofD,-30));BL(g,P(um,v0-.02,h+rh),P(um,v1+.02,h+rh),A.shade(o.roof,26));
          fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],o.gable||o.wallL);
          if(o.deco)o.deco(g,n);});};
      // 拱頂象館（iter20，v2 專用，跟 v0 紅瓦山牆、v1 茅草大屋區隔）：磚牆＋桶形拱金屬屋頂（沿 v；左半受光亮、右半背光暗、屋脊一條玻璃天窗帶、等距肋條）
      //   +v 端為半圓拱山牆：奶油牆＋扇形玻璃窗（放射窗櫺）＋底部大拉門；+u 面一排高窗
      const vault=(S,SHD,u0,v0,du,dv,h,rh,d)=>{const u1=u0+du,v1=v0+dv,N=14;SHD.push(['b',u0,v0,du,dv,h+rh*.8]);
        const U=i=>u0+du*i/N,Zr=i=>h+rh*Math.sin(Math.PI*i/N);
        S.o(d!=null?d:u1+v1-.1,(g,n)=>{boxZ(g,u0,v0,du,dv,0,h,null,'#c98a64','#9c6a4c');
          for(let z=3;z<h;z+=3){lnR(g,u1,v0,v1,z,'#8e6048');lnL(g,v1,u0,u1,z,'#b07656');}   // 磚縫
          for(let i=0;i<N;i++){const t=(i+.5)/N,sky=i===6||i===7,col=sky?(i===6?'#bfe0ea':'#8fb8c8'):t<.5?(t<.2?'#c9d3cf':'#b4c0bb'):(t>.8?'#6f7f7b':'#8a9894');
            fp(g,[P(U(i),v0,Zr(i)),P(U(i+1),v0,Zr(i+1)),P(U(i+1),v1+.02,Zr(i+1)),P(U(i),v1+.02,Zr(i))],col);}
          for(let v=v0+.08;v<v1;v+=.1)for(let i=0;i<N;i++)BL(g,P(U(i),v,Zr(i)),P(U(i+1),v,Zr(i+1)),i<N/2?'#a3afab':'#65736f');   // 肋條
          for(let v=v0+.02;v<v1;v+=.05){const a=P(U(6),v,Zr(6)),b=P(U(8),v,Zr(8));RC(g,a[0]+1,a[1],1,1,'#eef8fb');if(n)RC(n,a[0]+1,a[1],1,1,'rgba(255,230,170,.5)');}
          // +v 半圓山牆
          const gab=[P(u0,v1,h)];for(let i=0;i<=N;i++)gab.push(P(U(i),v1,Zr(i)));gab.push(P(u1,v1,h));fp(g,gab,'#efe4c8');
          const fan=[];for(let i=1;i<N;i++)fan.push(P(U(i),v1,h+(Zr(i)-h)*.82));const c0=P(u0+du/2,v1,h+1);
          fp(g,[c0,...fan],'#4d6a78');for(let i=1;i<fan.length;i+=2)BL(g,c0,fan[i],'#d9d0b8');for(let i=0;i<fan.length;i+=3)RC(g,fan[i][0],fan[i][1]+1,1,1,'#9fc4d4');
          if(n){fp(n,[c0,...fan],'rgba(255,214,140,.42)');for(let i=1;i<fan.length;i+=2)BL(n,c0,fan[i],'rgba(40,30,20,.5)');}
          fL(g,v1,u0,u1,h-1,h,'#b89a78');fL(g,v1,u0+du*.3,u1-du*.3,0,h-3,'#3a3230');fL(g,v1,u0+du*.3,u0+du*.34,0,h-3,'#6e5a48');lnL(g,v1,u0+du*.3,u1-du*.3,h-3,'#8a7a64');
          for(let t=v0+.08;t<v1-.08;t+=.14){fR(g,u1,t,t+.07,h-6,h-2,'#3e5261');fR(g,u1,t,t+.02,h-6,h-2,'#6f8fa2');if(n)fR(n,u1,t,t+.07,h-6,h-2,C.lit);}});};
      // 大門：兩座石柱＋橫樑招牌（ZOO）＋頂上長頸鹿剪影；axis 'u'（沿 u、正面 +v）／'v'（沿 v、正面 +u）
      const gate=(S,SHD,axis,c,a0,a1,d)=>{const PH=17;
        if(axis==='u'){const v=c;SHD.push(['b',a0,v-.05,.1,.1,PH]);SHD.push(['b',a1-.1,v-.05,.1,.1,PH]);SHD.push(['b',a0,v-.035,a1-a0,.07,6,PH-5]);
          S.o(d!=null?d:a1+v,(g,n)=>{for(const u of[a0,a1-.1]){boxZ(g,u,v-.05,.1,.1,0,PH,C.stoneT,C.stone,C.stoneD);boxZ(g,u-.015,v-.065,.13,.13,PH,2,'#e3dccb',C.stoneT,C.stone);
              for(let z=4;z<PH;z+=4)lnL(g,v+.05,u,u+.1,z,C.stoneJ);}
            boxZ(g,a0+.08,v-.035,a1-a0-.16,.07,PH-8,8,'#3f7f52',C.green,C.greenD);fL(g,v+.035,a0+.08,a1-.08,PH-1,PH,C.greenL);
            textL(g,v+.035,(a0+a1)/2-.18,PH-3,'ZOO',C.yel,n,'#ffe890',1);});
          S.t((d!=null?d:a1+v)+.01,(g)=>{const p=P((a0+a1)/2+.12,v,PH);put(g,sGir,p[0],p[1],true);});}
        else{const u=c;SHD.push(['b',u-.05,a0,.1,.1,PH]);SHD.push(['b',u-.05,a1-.1,.1,.1,PH]);SHD.push(['b',u-.035,a0,.07,a1-a0,6,PH-5]);
          S.o(d!=null?d:a1+u,(g,n)=>{for(const v of[a0,a1-.1]){boxZ(g,u-.05,v,.1,.1,0,PH,C.stoneT,C.stone,C.stoneD);boxZ(g,u-.065,v-.015,.13,.13,PH,2,'#e3dccb',C.stoneT,C.stone);
              for(let z=4;z<PH;z+=4)lnR(g,u+.05,v,v+.1,z,'#857b69');}
            boxZ(g,u-.035,a0+.08,.07,a1-a0-.16,PH-8,8,'#3f7f52',C.greenL,C.green);fR(g,u+.035,a0+.08,a1-.08,PH-1,PH,C.greenL);
            L.textR(g,u+.035,(a0+a1)/2+.18,PH-3,'ZOO',C.yel,n,'#ffe890',1);});
          S.t((d!=null?d:a1+u)+.01,(g)=>{const p=P(u,(a0+a1)/2-.12,PH);put(g,sGir,p[0],p[1],false);});}};
      // 正面大門（南角，面向觀者）：兩柱在 (ua,va)/(ub,vb)，橫樑為正對螢幕的板
      const gateF=(S,SHD,pa,pb,d)=>{const PH=18;SHD.push(['b',pa[0]-.05,pa[1]-.05,.1,.1,PH]);SHD.push(['b',pb[0]-.05,pb[1]-.05,.1,.1,PH]);
        S.o(d!=null?d:pa[0]+pa[1]+.1,(g,n)=>{for(const p of[pa,pb]){boxZ(g,p[0]-.05,p[1]-.05,.1,.1,0,PH,C.stoneT,C.stone,C.stoneD);boxZ(g,p[0]-.065,p[1]-.065,.13,.13,PH,2,'#e3dccb',C.stoneT,C.stone);
            for(let z=4;z<PH;z+=4){lnL(g,p[1]+.05,p[0]-.05,p[0]+.05,z,C.stoneJ);lnR(g,p[0]+.05,p[1]-.05,p[1]+.05,z,'#857b69');}}
          const a=P(pa[0],pa[1],PH),b=P(pb[0],pb[1],PH),x0=rnd(a[0])+3,x1=rnd(b[0])-3,y=rnd(a[1]);
          RC(g,x0,y-2,x1-x0+1,9,'#2f6b45');RC(g,x0,y-3,x1-x0+1,1,'#4f9a66');RC(g,x0,y+6,x1-x0+1,1,'#234f33');RC(g,x0+1,y-1,x1-x0-1,6,'#3f7f52');
          const tw=11,tx=rnd((x0+x1)/2-tw/2);L.textF(g,tx,y,'ZOO',C.yel,n,'#ffe890',1);});
        S.t((d!=null?d:pa[0]+pa[1]+.1)+.01,(g)=>{const a=P(pa[0],pa[1],PH),b=P(pb[0],pb[1],PH);put(g,sGir,(a[0]+b[0])/2-1,a[1]-4,true);});};
      // 售票亭
      const booth=(S,SHD,u0,v0,du,dv,d)=>{SHD.push(['b',u0,v0,du,dv,12]);S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,9,null,'#e9dcc0','#c3b393');
        fL(g,v0+dv,u0+du*.2,u0+du*.8,4,8,'#3d5a6c');fR(g,u0+du,v0+dv*.2,v0+dv*.8,4,8,'#34505f');if(n){fL(n,v0+dv,u0+du*.2,u0+du*.8,4,8,C.lit);fR(n,u0+du,v0+dv*.2,v0+dv*.8,4,8,'#ffd98a');}
        fL(g,v0+dv,u0,u0+du,3,4,C.woodD);
        boxZ(g,u0-.03,v0-.03,du+.06,dv+.06,9,2,'#4f9a66',C.green,C.greenD);boxZ(g,u0+du*.25,v0+dv*.25,du*.5,dv*.5,11,2,'#6fb384','#4f9a66',C.green);});};
      // 小賣店：黃牆＋綠白條紋遮陽篷（+v 面）
      const kiosk=(S,SHD,u0,v0,du,dv,d)=>{SHD.push(['b',u0,v0,du,dv,14]);S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{const u1=u0+du,v1=v0+dv;
        boxZ(g,u0,v0,du,dv,0,12,'#e8e0cf','#f1d98f','#cdb46c');
        fL(g,v1,u0+.05,u1-.05,3,8,'#6a4a2a');fL(g,v1,u0+.07,u1-.07,4,7,'#3b4f5e');if(n)fL(n,v1,u0+.07,u1-.07,4,7,C.lit);
        fL(g,v1,u0+.05,u1-.05,2,3,'#8a6a45');
        const aw=.09;for(let i=0;i<Math.round(du/.05);i++){const a=u0+i*.05,b=Math.min(u1,a+.05);fp(g,[P(a,v1,11),P(b,v1,11),P(b,v1+aw,7),P(a,v1+aw,7)],i%2?'#f4f1e6':'#3f8a55');}
        fR(g,u1,v0+dv*.25,v0+dv*.75,4,9,'#8f7a4a');fR(g,u1,v0+dv*.3,v0+dv*.7,5,8,'#c64a3a');
        boxZ(g,u0-.02,v0-.02,du+.04,dv+.04,12,1,'#f4efe2','#d9cfb8','#b7ad95');
        const sp=P(u0+du*.5,v0+dv*.5,13);RC(g,sp[0]-5,sp[1]-5,11,5,'#c64a3a');RC(g,sp[0]-4,sp[1]-4,9,3,'#f4d05a');if(n)RC(n,sp[0]-4,sp[1]-4,9,3,'#ffe27a');});};
      const parasol=(S,SHD,u,v,col,d)=>{SHD.push(['e',P(u+.12,v-.05)[0],P(u+.12,v-.05)[1],5,2]);S.o(d!=null?d:u+v+.04,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
        ell(g,x,y-1,3,1,'#b9a98a');RC(g,x-2,y-3,5,1,'#e8e2d2');RC(g,x,y-9,1,7,'#5a5046');
        ell(g,x,y-10,5,2,col);RC(g,x-5,y-10,11,1,A.shade(col,-24));RC(g,x-3,y-11,4,1,A.shade(col,30));RC(g,x,y-12,1,1,'#f4f1e6');});};
      // 象舍：奶油牆＋紅陶瓦＋ +v 面大拱門
      const barn=(S,SHD,u0,v0,du,dv,h,d,big,th)=>house(S,SHD,u0,v0,du,dv,h,big?(th?13:11):9,Object.assign(th?{wallL:'#d2b07c',wallR:'#a88a5c',roof:'#d4b060',roofD:'#a8883f',gable:'#b89a68'}:{wallL:C.cream,wallR:C.creamR,roof:C.roof,roofD:C.roofD,gable:'#d4c6a4'},{
        deco:(g,n)=>{const u1=u0+du,v1=v0+dv,dm=u0+du*.5;
          const ar=P(dm,v1,0),x=rnd(ar[0]),y=rnd(ar[1]),aw=big?5:4,ah=big?11:9;
          for(let i=-aw-1;i<=aw+1;i++){const top=ah+1-Math.round(Math.sqrt(Math.max(0,(aw+1)*(aw+1)-i*i))*.6);RC(g,x+i,y+Math.round(i/2)-top,1,top,'#9a8a6a');}
          for(let i=-aw;i<=aw;i++){const top=ah-Math.round(Math.sqrt(Math.max(0,aw*aw-i*i))*.6);RC(g,x+i,y+Math.round(i/2)-top,1,top,'#2f2a26');}
          for(const t of[u0+du*.16,u1-du*.16]){fL(g,v1,t-.04,t+.04,h-6,h-2,'#4d6272');fL(g,v1,t-.04,t-.02,h-3,h-2,'#8fb0c4');if(n)fL(n,v1,t-.04,t+.04,h-6,h-2,C.lit);}
          for(let t=v0+dv*.25;t<v1-.05;t+=dv*.5){fR(g,u1,t,t+.06,h-6,h-2,'#3e5261');}
          lnL(g,v1,u0,u1,1,th?'#8a6a45':'#b5a684');if(th){for(const t of[u0+.02,u1-.02,u0+du*.33,u1-du*.33])vln(g,t,v1,1,h,'#6e5238');lnL(g,v1,u0,u1,h-1,'#6e5238');}}}),d);
      // 茅草圓亭（獸欄遮蔭）
      const hut=(S,SHD,u,v,r=5,d)=>{SHD.push(['c',u,v,r/45,12]);S.o(d!=null?d:u+v+.05,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
        for(const dx of[-r+1,0,r-1]){RC(g,x+dx,y-7+(dx?0:1),1,7,C.woodD);}
        L.cone(g,x,y-7,r+2,Math.round((r+2)/2),8,(i,c)=>c<-.3?'#d9b86a':c<.35?'#c4a255':'#a4853f',14);
        for(let k=1;k<4;k++)RC(g,x-(r+2)+k*2,y-7+Math.round(k/2),1,1,'#8f7336');});};
      // 餵食台：木平台（高 z）＋欄杆＋樓梯，上有遊客
      const deck=(S,SHD,u0,v0,du,dv,z,d,stairU)=>{SHD.push(['b',u0,v0,du,dv,z]);const dd=d!=null?d:u0+du+v0+dv;
        S.o(dd,(g)=>{for(const[u,v]of[[u0+.02,v0+dv-.02],[u0+du-.02,v0+dv-.02],[u0+du-.02,v0+.02],[u0+.02,v0+.02]]){const p=P(u,v);RC(g,p[0],p[1]-z,1,z,C.woodD);}
          boxZ(g,u0,v0,du,dv,z,2,C.woodL,C.wood,C.woodD);
          boxZ(g,u0+du*.35,v0+dv*.35,du*.3,dv*.3,z+2,12,null,'#d8c9a0','#b4a47c');
          fp(g,[P(u0-.03,v0-.03,z+14),P(u0+du+.03,v0-.03,z+14),P(u0+du+.03,v0+dv+.03,z+14),P(u0-.03,v0+dv+.03,z+14),P(u0+du/2,v0+dv/2,z+19)],'#c4a255');
          fp(g,[P(u0-.03,v0+dv+.03,z+14),P(u0+du+.03,v0+dv+.03,z+14),P(u0+du/2,v0+dv/2,z+19)],'#d9b86a');
          fp(g,[P(u0+du+.03,v0-.03,z+14),P(u0+du+.03,v0+dv+.03,z+14),P(u0+du/2,v0+dv/2,z+19)],'#a4853f');
          for(const[u,v]of[[u0,v0+dv],[u0+du,v0+dv],[u0+du,v0]]){vln(g,u,v,z+2,z+14,C.woodD);}
          if(stairU)for(let i=0;i<5;i++){const t=i/5;boxZ(g,u0+du+.02+t*.16,v0+dv*.3,.035,dv*.4,0,z*(1-t),null,C.woodL,C.woodD);}
          else for(let i=0;i<5;i++){const t=i/5;boxZ(g,u0+du*.3,v0+dv+.02+t*.16,du*.4,.035,0,z*(1-t),null,C.woodL,C.woodD);}});
        S.t(dd+.01,(g)=>{lnL(g,v0+dv,u0,u0+du,z+6,C.woodL);lnR(g,u0+du,v0,v0+dv,z+6,C.woodD);for(let t=u0;t<=u0+du+1e-6;t+=.07)vln(g,t,v0+dv,z+2,z+6,C.woodD);for(let t=v0;t<=v0+dv+1e-6;t+=.07)vln(g,u0+du,t,z+2,z+6,C.woodD);
          const pp=[[u0+du*.25,v0+dv*.85,1],[u0+du*.6,v0+dv*.9,4],[u0+du*.88,v0+dv*.5,7],[u0+du*.85,v0+dv*.2,11]];for(const[u,v,k]of pp){const p=P(u,v,z+2);L.person(g,p[0],p[1],k);}});};
      // 鳥園網籠：木柱環＋網面（半透明格線）＋頂部尖帳
      // 鳥園網罩：半球鋼構穹頂（經線＋緯線；後半淡、前半亮）＋基座矮牆＋頂部小亭
      const aviary=(S,SHD,cu,cv,r,h,d)=>{SHD.push(['c',cu,cv,r,h*.5]);const NM=16,NP=4;
        const Pt=(th,ph)=>P(cu+r*Math.cos(ph)*Math.cos(th),cv+r*Math.cos(ph)*Math.sin(th),3+h*Math.sin(ph));
        const front=th=>Math.sin(th)+Math.cos(th)>0;
        const mesh=(g,wantFront,col,colP)=>{for(let i=0;i<NM;i++){const th=i/NM*Math.PI*2;if(front(th)!==wantFront)continue;for(let k=0;k<8;k++)BL(g,Pt(th,k/8*Math.PI/2),Pt(th,(k+1)/8*Math.PI/2),col);}
          for(let k=1;k<=NP;k++){const ph=k/(NP+1)*Math.PI/2;for(let i=0;i<32;i++){const t0=i/32*Math.PI*2,t1=(i+1)/32*Math.PI*2;if(front((t0+t1)/2)!==wantFront)continue;BL(g,Pt(t0,ph),Pt(t1,ph),colP);}}};
        S.t(d!=null?d:cu+cv-r,(g)=>{mesh(g,false,'rgba(200,210,205,.55)','rgba(200,210,205,.4)');});
        S.o(d!=null?d+.01:cu+cv-r+.01,(g)=>{const p=P(cu,cv),x=rnd(p[0]),y=rnd(p[1]),rx=rnd(r*45.25),ry=rnd(r*22.6);ell(g,x,y,rx,ry,'#a39b8d');ell(g,x,y-2,rx,ry,'#cfc8b8');ell(g,x,y-2,rx-2,ry-1,'#6f9e4b');});
        S.t(d!=null?d+2*r+.05:cu+cv+r+.05,(g)=>{mesh(g,true,'rgba(236,241,238,.85)','rgba(236,241,238,.6)');
          const t=Pt(0,Math.PI/2);RC(g,t[0]-2,t[1]-3,5,3,'#e8ecea');RC(g,t[0]-1,t[1]-5,3,2,'#4f9a66');RC(g,t[0],t[1]-6,1,1,'#2f6b45');});};
      // 鳥（網籠內，小彩點）
      const birds=(S,d,pts)=>S.t(d,(g)=>{for(const[x,y,c]of pts){RC(g,x,y,2,1,c);RC(g,x+1,y-1,1,1,c);}});
      // 餵食站：四根木柱＋單坡茅草頂（向 +v 傾）＋紅色飼料箱（黃標）；木槽另放在獸欄那一側
      const feeder=(S,SHD,u0,v0,du,dv,d)=>{const u1=u0+du,v1=v0+dv;SHD.push(['b',u0,v0,du,dv,11]);S.o(d!=null?d:u1+v1,(g)=>{
        for(const[u,v]of[[u0+.012,v0+.012],[u1-.012,v0+.012],[u0+.012,v1-.012],[u1-.012,v1-.012]])vln(g,u,v,0,10,C.woodD);
        boxZ(g,u0+du*.15,v0+dv*.2,du*.45,dv*.5,0,7,'#d9c9a0','#c64a3a','#9e3a2e');fL(g,v0+dv*.7,u0+du*.2,u0+du*.5,3,5,'#f4d05a');
        fp(g,[P(u0-.02,v0-.02,12),P(u1+.02,v0-.02,12),P(u1+.02,v1+.03,9),P(u0-.02,v1+.03,9)],'#c4a255');
        for(let t=u0+.01;t<u1+.02;t+=.035)BL(g,P(t,v0-.02,12),P(t,v1+.03,9),'#b39448');
        fp(g,[P(u1+.02,v0-.02,12),P(u1+.02,v1+.03,9),P(u1+.02,v1+.03,8),P(u1+.02,v0-.02,11)],'#8f7336');lnL(g,v1+.03,u0-.02,u1+.02,8,'#8f7336');});};
      const trough=(S,u0,v0,du,dv,d)=>S.o(d!=null?d:u0+du+v0+dv,(g)=>{boxZ(g,u0,v0,du,dv,0,2,'#c9b05a',C.woodL,C.woodD);});
      return {sEle,giraffe,elephant,feeder,trough,zebra,flamingo,path,sav,dirt,lawnP,meadow,flowers,pond,reeds,rail,wall,house,houseV,vault,gate,gateF,booth,kiosk,parasol,barn,hut,deck,aviary,birds,sGir};};

    // -------- v0 左前邊正中大門＋中央火鶴湖 --------
    const v0=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{fp,polyUV,R4,shp,toS}=L,Z=zoo(K,L);
      A.dia(g,AX,L.TOPY,96,C.lawn);L.texture(g,R4(0,0,3,3),null,[C.lawnD,C.lawnL],50,380);
      // 獸欄地面：後方長頸鹿草原、右側象欄泥地、左側斑馬草場
      const SAV=[[.12,.12],[1.6,.12],[1.6,.5],[1.2,.78],[.92,.95],[.12,.95]];Z.sav(g,SAV,381);
      Z.dirt(g,R4(1.98,.12,.9,1.08),382);
      Z.meadow(g,R4(.12,1.28,.72,.95),383);
      // 步道：環湖＋入口大道＋東西支線＋前方廣場
      const lk=shp(1.5,1.56,.4,.36,2.2,64,.05,2);
      const ring=lk(.26);Z.path(g,ring,384);
      Z.path(g,R4(1.36,1.9,.28,1.1),385);Z.path(g,R4(1.75,1.3,1.13,.24),386);Z.path(g,R4(.12,1.02,1.2,.2),387);Z.path(g,R4(.9,2.42,2.0,.5),388);Z.path(g,R4(1.1,.8,.86,.24),389);
      Z.path(g,R4(2.1,1.54,.24,.88),398);
      Z.path(g,R4(.16,2.27,.76,.17),403);Z.path(g,R4(.16,2.44,.42,.16),404);   // 左前角：斑馬欄前的餵食小廣場（接前方廣場）
      // 花圃與草帶
      Z.flowers(g,R4(.95,2.3,.36,.1),399);Z.flowers(g,R4(1.7,2.3,.36,.1),400);
      fp(g,toS(lk(.1)),C.lawnL);
      Z.pond(g,lk,{seed:390,nh:22,bank:.05});
      {const is=shp(1.64,1.5,.12,.09,2,32);fp(g,toS(is(.02)),C.bankD);fp(g,toS(is(0)),'#7aa856');}
      const ep=shp(2.5,.95,.2,.12,2.2,40,.08,5);Z.pond(g,ep,{seed:391,nh:6,bank:.04});
      const wh=shp(.55,.55,.16,.1,2,40,.1,7);Z.pond(g,wh,{seed:392,nh:4,bank:.04});
      // 外圍：後兩邊綠籬、前兩邊鐵柵（大門處留口）
      L.hedge(S,[.05,.05],[2.95,.05]);L.hedge(S,[.05,.05],[.05,2.95]);
      L.fence(S,[.05,2.95],[2.95,2.95],[[.4,.62]]);L.fence(S,[2.95,.05],[2.95,2.95]);
      // 長頸鹿草原
      L.acacia(S,SHD,.35,.3,1.1);L.acacia(S,SHD,1.15,.25,.9);L.acacia(S,SHD,.25,.8,.8);Z.hut(S,SHD,.75,.22,5);
      Z.giraffe(S,SHD,.7,.45,false);Z.giraffe(S,SHD,.95,.62,true);Z.giraffe(S,SHD,.48,.78,false);Z.zebra(S,SHD,1.25,.6,true);Z.zebra(S,SHD,1.4,.42,true);
      Z.rail(S,[.12,.12],[1.6,.12]);Z.rail(S,[.12,.12],[.12,.95]);Z.wall(S,[.12,.95],[.92,.95],4);Z.wall(S,[1.6,.12],[1.6,.5],4);
      // 象舍＋象欄
      Z.barn(S,SHD,2.18,.14,.62,.34,15,null,true);
      // 象群：兩頭成象＋一頭小象（腳底離前牆 ≥0.25 格，腿整段露在泥地上；象舍門前那頭排在象舍之後畫）
      Z.elephant(S,SHD,2.06,.875,false);Z.elephant(S,SHD,2.53,.53,true,3.3);Z.elephant(S,SHD,2.484,.891,false,null,true);
      Z.rail(S,[1.98,.12],[2.88,.12]);Z.rail(S,[1.98,.12],[1.98,1.2]);Z.wall(S,[1.98,1.2],[2.88,1.2],4);Z.wall(S,[2.88,.12],[2.88,1.2],4);
      // 斑馬草場（左）
      Z.zebra(S,SHD,.35,1.55,false);Z.zebra(S,SHD,.58,1.7,true);Z.zebra(S,SHD,.62,2.08,true);Z.hut(S,SHD,.34,1.98,4);
      L.tree(S,SHD,.22,1.4,1.1,0);
      // 左前角餵食站：欄外小棚＋欄內木槽＋孩子們；樹下兩張長椅
      Z.feeder(S,SHD,.18,2.27,.16,.1);Z.trough(S,.2,2.15,.14,.05);
      L.bench(S,.42,2.47,true);L.bench(S,.18,2.5,false);L.bin(S,.62,2.46);
      L.crowd(S,[[.22,2.41,11],[.3,2.42,2],[.38,2.4,14],[.46,2.42,6],[.47,2.52,8],[.7,2.36,3],[.8,2.4,12]],0);
      Z.rail(S,[.12,1.28],[.84,1.28]);Z.rail(S,[.12,1.28],[.12,2.23]);Z.rail(S,[.12,2.23],[.84,2.23]);Z.rail(S,[.84,1.28],[.84,2.23]);
      // 湖：火鶴群、島上棕櫚、蘆葦
      const fl=[[1.2,1.48,0,0],[1.26,1.53,1,1],[1.3,1.42,0,0],[1.36,1.56,1,0],[1.24,1.66,0,1],[1.32,1.72,1,0],[1.44,1.75,0,0],[1.78,1.72,1,1],[1.84,1.62,1,0],[1.7,1.8,0,0],[1.5,1.28,0,0],[1.58,1.24,1,1]];
      for(const[u,v,f,lo]of fl)Z.flamingo(S,u,v,!!f,!!lo);
      L.palm(S,SHD,1.64,1.49,.9);
      Z.reeds(S,[[1.14,1.38],[1.9,1.42],[1.2,1.86],[1.86,1.9]],393);
      // 前方廣場：大門＋售票亭
      Z.gate(S,SHD,'u',2.84,1.22,1.78);
      Z.booth(S,SHD,.95,2.55,.2,.16);Z.booth(S,SHD,1.9,2.55,.2,.16);
      // 右前：小賣店＋陽傘桌
      Z.kiosk(S,SHD,2.45,1.62,.44,.3);
      Z.parasol(S,SHD,2.5,2.18,'#c64a3a');Z.parasol(S,SHD,2.78,2.3,'#3f8a55');Z.parasol(S,SHD,2.62,2.02,'#e0a93a');
      L.tree(S,SHD,2.82,2.62,1,2);L.tree(S,SHD,2.5,2.6,.9,0);L.tree(S,SHD,.17,2.8,1.1,1);L.tree(S,SHD,.86,2.84,.9,0);L.bush(S,.52,2.86,3);L.tree(S,SHD,1.02,1.28,.9,2);
      L.bush(S,1.05,2.36,2);L.bush(S,2.02,2.36,2);
      L.lamp2(S,1.3,2.4);L.lamp2(S,1.72,2.4);L.lamp2(S,1.02,1.88);L.lamp2(S,2.05,1.28);L.lamp2(S,1.08,1.1);L.lamp2(S,2.36,1.9);
      L.bench(S,1.92,2.02,false);L.bench(S,1.0,1.55,false);L.bench(S,1.3,1.02,true);L.bin(S,1.95,2.2);
      const walk=[...L.scatterIn(394,14,R4(.95,2.45,1.9,.44)),...L.scatterIn(395,12,ring,(u,v)=>L.inPoly(lk(.03),u,v)),...L.scatterIn(396,5,R4(1.38,1.9,.24,.55)),
        ...L.scatterIn(397,5,R4(1.8,1.32,1.0,.2)),...L.scatterIn(401,4,R4(.15,1.03,1.1,.18)),...L.scatterIn(402,4,R4(2.12,1.56,.2,.8)),[.4,1.0,1],[.46,1.0,15],[.72,1.01,2],[2.22,1.27,3],[2.3,1.28,11],[2.6,1.27,6]];
      L.crowd(S,walk,0);
      L.lotEdge(g,C.lawnD,C.lawnL);
    });

    // -------- v1 右前邊正中大門＋十字步道分四欄 --------
    const v1=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{fp,polyUV,R4,shp,toS}=L,Z=zoo(K,L);
      A.dia(g,AX,L.TOPY,96,C.lawn);L.texture(g,R4(0,0,3,3),null,[C.lawnD,C.lawnL],50,410);
      // 北：象欄（泥地＋泥浴池）；東：長頸鹿草原；西：火鶴池；南：遊客區
      Z.dirt(g,R4(.12,.12,1.16,1.14),411);
      Z.sav(g,R4(1.72,.12,1.16,1.14),412);
      Z.lawnP(g,R4(.12,1.72,1.16,1.16),413);
      // 十字大道＋中央圓環
      Z.path(g,R4(.3,1.32,2.7,.36),414);Z.path(g,R4(1.32,.3,.36,2.6),415);
      const pz=shp(1.5,1.5,.34,.34,2,48);Z.path(g,pz(0),416);
      Z.path(g,R4(1.72,1.72,1.16,.3),417);Z.path(g,R4(1.72,2.02,.3,.86),418);
      Z.flowers(g,R4(2.1,2.1,.24,.24),419);
      const mp=shp(.72,.95,.26,.16,2.2,48,.08,3);Z.pond(g,mp,{seed:420,nh:8,bank:.04,bankC:'#a88b62',bankD:'#8a7050'});
      const fp2=shp(.66,2.26,.44,.4,2.3,64,.06,5);fp(g,toS(fp2(.1)),C.lawnL);Z.pond(g,fp2,{seed:421,nh:18,bank:.05});
      const gp=shp(2.5,.8,.16,.1,2,40,.1,9);Z.pond(g,gp,{seed:422,nh:4,bank:.04});
      // 中央圓環：兩層噴泉（石盆＋中柱＋上盤＋水柱）
      SHD.push(['c',1.5,1.5,.14,4]);
      S.o(3.0,(g,n)=>{const p=P(1.5,1.5),x=Math.round(p[0]),y=Math.round(p[1]);L.ell(g,x,y,13,6,'#a39b8d');L.ell(g,x-1,y,12,6,'#b9b1a2');L.ell(g,x,y-2,13,6,'#e3ded3');L.ell(g,x,y-2,11,5,'#7cc6ea');L.ell(g,x+1,y-2,8,3,'#5cb0de');
        L.RC(g,x-9,y-4,3,1,'#dff4fc');L.RC(g,x+4,y,3,1,'#bfe6f7');L.RC(g,x-1,y-9,3,8,'#c9c1b2');L.RC(g,x+1,y-9,1,8,'#a39b8d');
        L.ell(g,x,y-9,5,2,'#d8d0c2');L.ell(g,x,y-10,4,1,'#7cc6ea');L.RC(g,x,y-15,1,5,'#ffffff');L.RC(g,x-1,y-13,1,2,'#dff4fc');L.RC(g,x+1,y-13,1,2,'#dff4fc');
        for(const[dx,dy]of[[-3,-12],[3,-12],[-5,-10],[5,-10],[-6,-7],[6,-7]])L.RC(g,x+dx,y+dy,1,1,'#e8f6fc');});
      // 外圍
      L.hedge(S,[.05,.05],[2.95,.05]);L.hedge(S,[.05,.05],[.05,2.95]);
      L.fence(S,[.05,2.95],[2.95,2.95]);L.fence(S,[2.95,.05],[2.95,2.95],[[.4,.6]]);
      // 北：大象館＋象群
      Z.barn(S,SHD,.18,.16,.8,.42,16,null,true,true);
      Z.elephant(S,SHD,.25,.9375,false,1.5);Z.elephant(S,SHD,.97,.72,true);Z.elephant(S,SHD,.734,.953,true,null,true);
      S.o(1.5,(g)=>{const p=P(1.12,.32);L.rock(g,p[0],p[1],3,2,['#8a6f50','#a88b62','#c2a67c']);});
      Z.rail(S,[.12,.12],[1.28,.12]);Z.rail(S,[.12,.12],[.12,1.26]);Z.wall(S,[.12,1.26],[1.28,1.26],4);Z.wall(S,[1.28,.12],[1.28,1.26],4);
      // 東：長頸鹿草原＋餵食台
      L.acacia(S,SHD,2.1,.3,1.1);L.acacia(S,SHD,2.7,.5,.9);L.acacia(S,SHD,2.75,1.05,.8);Z.hut(S,SHD,2.2,.95,5);
      Z.giraffe(S,SHD,2.4,.4,true);Z.giraffe(S,SHD,2.0,.66,false);Z.giraffe(S,SHD,2.45,.82,true);Z.zebra(S,SHD,2.72,.75,true);Z.zebra(S,SHD,2.58,1.12,false);Z.zebra(S,SHD,2.28,1.15,true);
      Z.rail(S,[1.72,.12],[2.88,.12]);Z.rail(S,[1.72,.12],[1.72,1.26]);Z.wall(S,[1.72,1.26],[2.88,1.26],4);Z.wall(S,[2.88,.12],[2.88,1.26],4);
      Z.deck(S,SHD,1.76,1.0,.2,.22,9,null,false);
      // 西：火鶴池＋棕櫚＋石牆
      const fl=[[.4,2.1,0,0],[.46,2.16,1,1],[.52,2.06,0,0],[.36,2.28,1,0],[.46,2.36,0,1],[.6,2.4,1,0],[.72,2.34,0,0],[.82,2.2,1,1],[.9,2.3,1,0],[.66,2.2,0,0],[.78,2.46,0,1],[.94,2.44,1,0],[.56,2.5,0,0]];
      for(const[u,v,f,lo]of fl)Z.flamingo(S,u,v,!!f,!!lo);
      L.palm(S,SHD,.22,1.86,1);L.palm(S,SHD,1.12,2.72,.9);L.palm(S,SHD,.2,2.75,.8);
      Z.reeds(S,[[.26,2.0],[1.02,2.1],[.3,2.5],[.98,2.52],[.7,1.92]],423);
      Z.wall(S,[.12,1.72],[1.28,1.72],3);Z.wall(S,[1.28,1.72],[1.28,2.88],3);Z.rail(S,[.12,1.72],[.12,2.88]);Z.rail(S,[.12,2.88],[1.28,2.88]);
      // 南：遊客區（小賣店、陽傘、樹、長椅）
      Z.kiosk(S,SHD,2.3,2.38,.46,.3);
      Z.parasol(S,SHD,2.1,2.78,'#c64a3a');Z.parasol(S,SHD,2.42,2.84,'#3f8a55');Z.parasol(S,SHD,2.72,2.8,'#e0a93a');
      L.tree(S,SHD,2.25,2.15,1,2);L.tree(S,SHD,2.72,2.12,.9,0);L.tree(S,SHD,2.85,2.5,.8,1);
      // 大門＋售票亭
      Z.gate(S,SHD,'v',2.84,1.26,1.74);
      Z.booth(S,SHD,2.55,1.0,.16,.2);Z.booth(S,SHD,2.55,1.84,.16,.2);
      L.lamp2(S,2.2,1.28);L.lamp2(S,2.2,1.72);L.lamp2(S,1.28,.7);L.lamp2(S,1.72,.7);L.lamp2(S,1.28,2.3);L.lamp2(S,1.72,2.3);L.lamp2(S,.7,1.28);
      L.bench(S,1.72,1.9,true);L.bench(S,1.9,1.1,true);L.bench(S,1.12,1.72,true);L.bin(S,1.7,2.1);
      const walk=[...L.scatterIn(424,14,R4(1.7,1.34,1.25,.32),(u,v)=>u>2.5&&u<2.7),...L.scatterIn(425,8,R4(1.34,.32,.32,.95)),...L.scatterIn(426,8,R4(1.34,1.72,.32,1.1)),
        ...L.scatterIn(427,6,R4(.32,1.34,.95,.32)),...L.scatterIn(428,8,pz(0),(u,v)=>Math.hypot(u-1.5,v-1.5)<.2),...L.scatterIn(429,8,R4(1.74,1.74,1.1,.26)),[2.05,1.33,1],[2.12,1.34,12],[2.42,1.33,4],[2.62,1.34,7],[1.34,.52,2],[1.35,.82,9],[.6,1.33,5],[.68,1.34,10]];
      L.crowd(S,walk,0);
      L.lotEdge(g,C.lawnD,C.lawnL);
    });

    // -------- v2 南角正面大門＋中軸大道＋鳥園網籠 --------
    const v2=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{fp,polyUV,R4,shp,toS}=L,Z=zoo(K,L);
      A.dia(g,AX,L.TOPY,96,C.lawn);L.texture(g,R4(0,0,3,3),null,[C.lawnD,C.lawnL],50,440);
      // 後方長頸鹿草原（北）、東側象欄、西側鳥園＋潟湖、南側大道
      const SAV=[[.12,.12],[1.3,.12],[1.3,1.0],[1.0,1.3],[.12,1.3]];Z.sav(g,SAV,441);
      Z.dirt(g,[[1.72,.12],[2.88,.12],[2.88,1.5],[1.72,1.5]],442);
      Z.lawnP(g,[[.12,1.72],[1.5,1.72],[1.5,2.88],[.12,2.88]],443);
      // 中軸大道（沿 u=v，由南角進）＋圓環＋東西支線
      const AVE=[[1.62,1.38],[2.95,2.71],[2.95,2.95],[2.71,2.95],[1.38,1.62]];Z.path(g,AVE,444);
      const pz=shp(1.5,1.5,.3,.3,2,48);Z.path(g,pz(0),445);
      Z.path(g,R4(1.3,.2,.3,1.1),446);Z.path(g,R4(.2,1.36,1.1,.28),447);Z.path(g,R4(1.52,1.52,1.4,.2),448);Z.path(g,R4(1.52,1.52,.2,1.4),449);
      Z.flowers(g,[[1.95,2.1],[2.5,2.65],[2.36,2.72],[1.82,2.18]],450);Z.flowers(g,[[2.1,1.95],[2.65,2.5],[2.72,2.36],[2.18,1.82]],451);
      const lg=shp(.92,2.42,.46,.34,2.2,64,.07,4);fp(g,toS(lg(.1)),C.lawnL);Z.pond(g,lg,{seed:452,nh:18,bank:.05});
      const ep=shp(2.35,1.05,.24,.14,2.2,40,.08,6);Z.pond(g,ep,{seed:453,nh:6,bank:.04});
      const wh=shp(.5,.8,.14,.09,2,40,.1,8);Z.pond(g,wh,{seed:454,nh:4,bank:.04});
      // 外圍
      L.hedge(S,[.05,.05],[2.95,.05]);L.hedge(S,[.05,.05],[.05,2.95]);
      L.fence(S,[.05,2.95],[2.55,2.95]);L.fence(S,[2.95,.05],[2.95,2.55]);
      // 北：長頸鹿草原＋餵食台（圓環旁）
      L.acacia(S,SHD,.3,.3,1.1);L.acacia(S,SHD,1.0,.3,.9);L.acacia(S,SHD,.25,1.0,.9);Z.hut(S,SHD,.62,.2,5);
      Z.giraffe(S,SHD,.6,.52,false);Z.giraffe(S,SHD,.9,.72,true);Z.giraffe(S,SHD,.4,.95,false);Z.giraffe(S,SHD,1.12,.55,true);Z.zebra(S,SHD,.78,1.08,false);Z.zebra(S,SHD,.6,1.18,true);
      Z.rail(S,[.12,.12],[1.3,.12]);Z.rail(S,[.12,.12],[.12,1.3]);Z.wall(S,[.12,1.3],[1.0,1.3],4);Z.wall(S,[1.3,.12],[1.3,1.0],4);
      Z.deck(S,SHD,1.02,1.02,.22,.22,9,null,true);
      // 東：象欄＋象舍（脊沿 v）
      Z.vault(S,SHD,2.4,.14,.46,.62,14,13);
      Z.elephant(S,SHD,1.906,.78,false);Z.elephant(S,SHD,2.5625,.8125,true,3.6);Z.elephant(S,SHD,1.83,1.17,false,null,true);
      Z.rail(S,[1.72,.12],[2.88,.12]);Z.rail(S,[1.72,.12],[1.72,1.5]);Z.wall(S,[1.72,1.5],[2.88,1.5],4);Z.wall(S,[2.88,.12],[2.88,1.5],4);
      // 西：鳥園網籠（罩住潟湖北半）＋火鶴＋棕櫚
      const fl=[[.62,2.3,0,0],[.7,2.36,1,1],[.78,2.26,0,0],[.6,2.48,1,0],[.74,2.52,0,1],[.86,2.6,1,0],[1.0,2.52,0,0],[1.1,2.36,1,1],[1.18,2.46,1,0],[.92,2.36,0,0],[1.02,2.66,0,1],[1.2,2.6,1,0],[.88,2.18,0,0]];
      for(const[u,v,f,lo]of fl)Z.flamingo(S,u,v,!!f,!!lo);
      Z.reeds(S,[[.5,2.2],[1.34,2.34],[.54,2.66],[1.3,2.66]],455);
      Z.aviary(S,SHD,.45,1.98,.28,22);
      L.tree(S,SHD,.4,1.95,1.1,1);L.tree(S,SHD,.56,2.06,.8,0);
      Z.birds(S,.45+1.98+.2,[P(.38,1.9,18),P(.52,1.96,12),P(.4,2.08,9),P(.58,1.86,20)].map((q,i)=>[q[0],q[1],['#e04a3a','#3f7fd0','#f2c94c','#f4f1e6'][i]]));
      Z.rail(S,[.12,1.72],[1.5,1.72]);Z.rail(S,[1.5,1.72],[1.5,2.88]);
      L.palm(S,SHD,1.3,2.78,.9);L.palm(S,SHD,.2,2.84,.8);
      // 左緣：保育員餵食站（小棚＋岸邊木槽＋保育員），三隻火鶴圍過來
      Z.feeder(S,SHD,.15,2.36,.14,.18);Z.trough(S,.34,2.42,.05,.16);
      L.crowd(S,[[.31,2.36,4]],0);
      for(const[u,v,f,lo]of[[.43,2.44,1,0],[.44,2.6,1,1],[.4,2.68,0,0]])Z.flamingo(S,u,v,!!f,!!lo);
      // 南：正面大門＋售票亭＋小賣店
      Z.gateF(S,SHD,[2.52,2.9],[2.9,2.52]);
      Z.booth(S,SHD,2.3,2.62,.16,.16);Z.booth(S,SHD,2.62,2.3,.16,.16);
      Z.kiosk(S,SHD,2.42,1.74,.46,.28);Z.parasol(S,SHD,2.3,2.24,'#c64a3a');Z.parasol(S,SHD,2.62,2.2,'#3f8a55');
      L.tree(S,SHD,2.86,2.14,.9,2);L.tree(S,SHD,1.85,2.8,1,0);L.tree(S,SHD,1.75,2.45,.9,2);
      L.lamp2(S,1.95,1.8);L.lamp2(S,1.8,1.95);L.lamp2(S,2.35,2.18);L.lamp2(S,2.18,2.35);L.lamp2(S,1.3,1.3);L.lamp2(S,1.28,1.72);
      L.bench(S,1.72,1.72,true);L.bench(S,1.2,1.62,true);L.bin(S,2.02,2.08);
      L.bench(S,1.54,2.28,false);L.bench(S,1.54,2.58,false);L.lamp2(S,1.7,2.44);   // 火鶴潟湖觀賞步道：面湖長椅
      const walk=[...L.scatterIn(456,16,AVE),...L.scatterIn(457,8,pz(0)),...L.scatterIn(458,5,R4(1.32,.25,.26,1.0)),...L.scatterIn(459,5,R4(.25,1.38,1.0,.24)),
        ...L.scatterIn(460,5,R4(1.55,1.55,1.3,.16)),...L.scatterIn(461,5,R4(1.55,1.55,.16,1.3)),[2.02,1.57,3],[2.3,1.58,8],[2.5,1.57,11],[1.36,.6,4],[1.37,.8,12]];
      L.crowd(S,walk,0);
      L.lotEdge(g,C.lawnD,C.lawnL);
    });
    B['38_1_0']=v0;B['38_1_1']=v1;B['38_1_2']=v2;
    if(B['38_1_3'])B['38_1_3']=B['38_1_0'];if(B['38_1_4'])B['38_1_4']=B['38_1_1'];
  }catch(e){errs.push('k38: '+(e&&e.stack||e));}
  // ================= k39 遊樂園（3×3） =================
  //   v0 紅色鋼構雲霄飛車：站台沿 -u → 後右邊爬升到北角（高 72）→ 沿後左邊俯衝 → 西側垂直迴環 → 前方駝峰 → 中線回站；右中旋轉木馬；左前邊近南角入口；西角遊戲攤
  //   v1 青綠鋼構雲霄飛車（左右鏡向走向）：沿後左邊爬升 → 沿後右邊俯衝 → 雙駝峰 → 東角螺旋下降；左中海盜船；右前邊近南角入口；東角碰碰車館
  //   v2 白色木造雲霄飛車（往返式，格構木架）：沿後左邊爬升 → 沿後右邊連續起伏 → 東角折返 → 平行回程；右中空中飛椅；南角正面入口
  try{
    const [W,H,AX,AY]=dims(39,[208,220,104,218]),SZ=3;
    const C={pave:'#e4d3b8',paveJ:'#d4c0a0',paveL:'#eee0c8',paveD:'#d8c4a6',brick:'#c7876a',brickJ:'#b27558',brickL:'#d59a7c',
      lawn:'#6f9e4b',lawnD:'#5f8c42',lawnL:'#86b35e',lit:'#ffe7a8',conc:'#c9c6bd',concD:'#aeaaa0'};
    const BUNT=['#e0463a','#f2c230','#3f86d0','#4fae5a','#f07ab0','#f4f1e6'];
    const BULB=['#ffe08a','#ff9a7a','#9ad0ff','#ffe08a','#b8ff9a','#ffb0e0'];
    const park=(K,L)=>{const{P,hsh}=K,{RC,BL,fp,flat,polyUV,boxZ,fL,fR,lnL,lnR,vln,ell,texture,R4,shp,toS,cone,cyl}=L;
      // ---- 地坪 ----
      const pave=(g,pts,seed)=>{polyUV(g,pts,C.pave);texture(g,pts,null,[C.paveJ,C.paveL,C.paveD],130,seed);};
      const brick=(g,pts,seed)=>{polyUV(g,pts,C.brick);texture(g,pts,null,[C.brickJ,C.brickL,C.brickJ],150,seed);};
      const lawn=(g,pts,seed)=>texture(g,pts,C.lawn,[C.lawnD,C.lawnL,C.lawnD],90,seed,.3);
      const flowers=(g,pts,seed)=>texture(g,pts,'#6c8f45',['#e05a6a','#f2c94c','#f4f1e6','#b86ad0','#e0843a'],260,seed);
      // ---- 雲霄飛車 ----
      // 閉合 Catmull-Rom：ctrl=[[u,v,h],…] → 約 0.045 格一點
      const spline=ctrl=>{const out=[],N=ctrl.length;for(let i=0;i<N;i++){const p0=ctrl[(i-1+N)%N],p1=ctrl[i],p2=ctrl[(i+1)%N],p3=ctrl[(i+2)%N];
        const Ls=Math.hypot(p2[0]-p1[0],p2[1]-p1[1])+Math.abs(p2[2]-p1[2])/40,m=Math.max(1,Math.ceil(Ls/.045));
        for(let k=0;k<m;k++){const t=k/m,t2=t*t,t3=t2*t;out.push([0,1,2].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}return out;};
      const loopPts=(u0,vc,rv,hb,R,du,n=18,dir=1)=>{const o=[];for(let i=1;i<n;i++){const t=i/n*Math.PI*2;o.push([u0+du*i/n,vc+dir*rv*Math.sin(t)-dir*rv*0,hb+R*(1-Math.cos(t))]);}return o;};
      const helixPts=(cu,cv,r,h0,h1,turns,a0,n=36)=>{const o=[];for(let i=0;i<=n;i++){const t=i/n,a=a0+t*turns*Math.PI*2;o.push([cu+r*Math.cos(a),cv+r*Math.sin(a),h0+(h1-h0)*t]);}return o;};
      // 軌道一段：高光軌＋主色＋深色脊樑（陡段改左右加粗）
      const seg=(g,a,b,T)=>{const pa=P(a[0],a[1],a[2]),pb=P(b[0],b[1],b[2]);const steep=Math.abs(pb[1]-pa[1])>Math.abs(pb[0]-pa[0])*1.2;
        if(steep){BL(g,[pa[0]+1,pa[1]],[pb[0]+1,pb[1]],T.dk);BL(g,[pa[0]-1,pa[1]],[pb[0]-1,pb[1]],T.hi);BL(g,pa,pb,T.main);}
        else{BL(g,[pa[0],pa[1]+1],[pb[0],pb[1]+1],T.dk);BL(g,[pa[0],pa[1]-1],[pb[0],pb[1]-1],T.hi);BL(g,pa,pb,T.main);}};
      // 鋼構支柱：單柱（高處加 A 字雙腳＋橫撐）
      const steelSupport=(g,u,v,h,T)=>{if(h<5)return;const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]),top=rnd(p[1]-h+2);
        if(h>34){BL(g,[x-3,y],[x,top+2],T.sup);BL(g,[x+3,y],[x+1,top+2],T.supD);for(let z=10;z<h-6;z+=10){const f=1-z/h,w=Math.round(3*f);RC(g,x-w,y-z,2*w+1,1,T.supD);}
          RC(g,x-4,y,3,1,'#8f8b82');RC(g,x+2,y,3,1,'#8f8b82');}
        else{RC(g,x,top,1,y-top,T.sup);RC(g,x+1,top,1,y-top,T.supD);RC(g,x-1,y,4,1,'#8f8b82');}};
      // 木造格構排架：兩柱＋橫擋＋斜撐（沿軌道法向 ±w）
      const woodBent=(g,u,v,h,nu,nv,T)=>{if(h<4)return;const w=.045;const a=P(u-nu*w,v-nv*w,0),b=P(u+nu*w,v+nv*w,0);const xa=rnd(a[0]),ya=rnd(a[1]),xb=rnd(b[0]),yb=rnd(b[1]);
        RC(g,xa,ya-h+1,1,h,T.sup);RC(g,xb,yb-h+1,1,h,T.supD);for(let z=6;z<h-2;z+=6){BL(g,[xa,ya-z],[xb,yb-z],T.supD);}};
      const coaster=(S,SHD,path,T,o={})=>{const N=path.length;
        // 落影：軌道投影線＋支柱
        for(let i=0;i<N;i+=1){const a=path[i],b=path[(i+1)%N];SHD.push(['l',a[0],a[1],a[2],b[0],b[1],b[2]]);}
        // 支柱
        let acc=0;const sups=[];for(let i=0;i<N;i++){const a=path[i],b=path[(i+1)%N];acc+=Math.hypot(b[0]-a[0],b[1]-a[1]);
          const every=o.wood?.06:(o.every||.21);if(acc<every)continue;acc=0;if(o.skip&&o.skip(a))continue;
          const nu=-(b[1]-a[1]),nv=(b[0]-a[0]),nl=Math.hypot(nu,nv)||1;
          if(o.wood){S.t(a[0]+a[1]-.002,(g)=>woodBent(g,a[0],a[1],a[2]-1,nu/nl,nv/nl,T));}
          else{SHD.push(['p',a[0],a[1],a[2]]);S.t(a[0]+a[1]-.002,(g)=>steelSupport(g,a[0],a[1],a[2],T));sups.push(a);}}
        // 鋼構：相鄰支柱之間加水平繫桿＋單向斜撐（桁架），讓疏一點的支柱仍連成一體
        if(o.ties)for(let k=0;k+1<sups.length;k++){const a=sups[k],b=sups[k+1];if(Math.hypot(b[0]-a[0],b[1]-a[1])>.45)continue;const hm=Math.min(a[2],b[2])-6;if(hm<14)continue;
          S.t((a[0]+a[1]+b[0]+b[1])/2-.001,(g)=>{let prev=null;for(let z=12;z<=hm;z+=14){BL(g,P(a[0],a[1],z),P(b[0],b[1],z),T.supD);
            if(prev!=null){if(k%2)BL(g,P(a[0],a[1],prev),P(b[0],b[1],z),T.supD);else BL(g,P(a[0],a[1],z),P(b[0],b[1],prev),T.supD);}prev=z;}});}
        // 木造：相鄰排架間的縱向橫擋（格構牆）
        if(o.wood){for(let i=0;i<N;i+=2){const a=path[i],b=path[(i+2)%N];if(o.skip&&o.skip(a))continue;const hm=Math.min(a[2],b[2])-2;if(hm<8)continue;
          S.t((a[0]+a[1]+b[0]+b[1])/2-.003,(g)=>{for(let z=6;z<hm;z+=6)BL(g,P(a[0],a[1],z),P(b[0],b[1],z),T.lat);if(i%4===0)BL(g,P(a[0],a[1],2),P(b[0],b[1],Math.min(hm,14)),T.lat);});}}
        // 軌道（每 2 段一件，依中點深度）
        for(let i=0;i<N;i+=2){const a=path[i],b=path[(i+1)%N],c=path[(i+2)%N];S.t((a[0]+a[1]+c[0]+c[1])/2+.012,(g)=>{seg(g,a,b,T);seg(g,b,c,T);});}
        // 爬升段鏈條（深色點）
        if(o.lift){const[i0,i1]=o.lift;for(let i=i0;i<i1;i+=2){const a=path[i];S.t(a[0]+a[1]+.014,(g)=>{const p=P(a[0],a[1],a[2]);RC(g,p[0],p[1],1,1,'#2a2a2a');});}}
        // 列車
        if(o.train){const[i0,nc,cols]=o.train;for(let k=0;k<nc;k++){const a=path[(i0-k*3+N)%N];S.t(a[0]+a[1]+.02,(g)=>{const p=P(a[0],a[1],a[2]),x=rnd(p[0]),y=rnd(p[1]);
          RC(g,x-1,y-3,4,3,cols[k%cols.length]);RC(g,x-1,y-3,4,1,A.shade(cols[k%cols.length],30));RC(g,x,y-5,1,2,k%2?'#e2b48e':'#6a4a2a');RC(g,x+2,y-5,1,2,'#e2b48e');});}}};
      // 站台棚：平頂＋柱＋站名板；沿 u（axis 'u'）或 v
      const station=(S,SHD,u0,v0,du,dv,h,col,d)=>{SHD.push(['b',u0,v0,du,dv,h+3]);S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,3,'#cfcac0','#bdb7ab','#a29c90');
        for(const[u,v]of[[u0+.03,v0+dv-.03],[u0+du-.03,v0+dv-.03],[u0+du-.03,v0+.03],[u0+du*.5,v0+dv-.03]]){const p=P(u,v,3);RC(g,p[0],p[1]-h+3,1,h-3,'#5a6066');}
        boxZ(g,u0-.03,v0-.03,du+.06,dv+.06,h,3,A.shade(col,20),col,A.shade(col,-30));
        for(let t=u0;t<u0+du;t+=.1)fL(g,v0+dv+.03,t,t+.05,h,h+3,'#f4f1e6');
        for(let t=v0;t<v0+dv;t+=.1)fR(g,u0+du+.03,t,t+.05,h,h+3,'#d8d4c8');
        if(n){const p=P(u0+du*.5,v0+dv*.5,h-1);RC(n,p[0]-4,p[1],9,1,'rgba(255,230,160,.8)');}});};
      // 排隊欄：多列折返
      const queue=(S,u0,u1,vs,d,col='#c0392b')=>S.t(d,(g)=>{for(const v of vs){const m=Math.max(2,Math.round((u1-u0)/.07));let prev=null;
        for(let j=0;j<=m;j++){const t=u0+(u1-u0)*j/m,p=P(t,v,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-3,1,3,'#474d53');RC(g,x,y-4,1,1,'#e0c060');if(prev)BL(g,[prev[0],prev[1]-3],[x,y-3],col);prev=[x,y];}}});
      const queueV=(S,v0,v1,us,d,col='#c0392b')=>S.t(d,(g)=>{for(const u of us){const m=Math.max(2,Math.round((v1-v0)/.07));let prev=null;
        for(let j=0;j<=m;j++){const t=v0+(v1-v0)*j/m,p=P(u,t,0),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-3,1,3,'#474d53');RC(g,x,y-4,1,1,'#e0c060');if(prev)BL(g,[prev[0],prev[1]-3],[x,y-3],col);prev=[x,y];}}});
      // ---- 旋轉木馬 ----
      const carousel=(S,SHD,cu,cv,r,d)=>{SHD.push(['c',cu,cv,r,22]);const dd=d!=null?d:cu+cv;
        const p=P(cu,cv),x=rnd(p[0]),y=rnd(p[1]),rx=rnd(r*45.25),ry=rnd(r*22.6),N=10,HC=17;
        const HORSE=['.hh.','hhhh','h..h'],HC2=['#f4f1e6','#e8b64a','#f4f1e6','#c9a0d8','#f4f1e6','#e07a6a'];
        const poles=(g,n,front)=>{for(let i=0;i<N;i++){const t=(i+.5)/N*Math.PI*2;if((Math.sin(t)>0)!==front)continue;const px=rnd(x+Math.cos(t)*(rx-3)),py=rnd(y-4+Math.sin(t)*(ry-2));
          RC(g,px,py-HC+2,1,HC-2,'#e8c860');const bob=(i%3)*2;const hy=py-7-bob;HORSE.forEach((row,ri)=>{for(let j=0;j<4;j++)if(row[j]==='h')RC(g,px-2+j,hy+ri,1,1,HC2[i%HC2.length]);});RC(g,px+(Math.cos(t)>0?1:-2),hy-1,1,1,'#6a4a2a');}};
        S.o(dd,(g,n)=>{
          // 轉盤：奶油外緣＋棚下陰影中的木甲板（深暖色，讓白馬與金色立柱跳出來；iter22 前是奶油色甲板、白馬糊在一起）
          cyl(g,x,y,rx+1,ry+1,3,'#c4473a','#8e3028',null,'#a8392f');ell(g,x,y-3,rx+1,ry+1,'#e8dcc0');ell(g,x,y-3,rx-1,ry-1,'#a5754c');ell(g,x+1,y-4,rx-3,ry-2,'#8a5c3a');
          for(let i=0;i<12;i++){const t=(i+.5)/12*Math.PI*2;BL(g,[x,y-3],[rnd(x+Math.cos(t)*(rx-2)),rnd(y-3+Math.sin(t)*(ry-1))],'#7a5034');}
          for(let i=0;i<8;i++){const t=i/8*Math.PI*2;if(Math.sin(t)<=0)continue;RC(g,rnd(x+Math.cos(t)*rx),rnd(y+Math.sin(t)*ry)-2,1,1,'#f2d060');}
          poles(g,n,false);
          cyl(g,x,y-4,3,1,HC-3,'#f6e6b0','#caa45a',null,'#e2c47e');for(let z=6;z<HC-3;z+=4)RC(g,x-3,y-4-z,7,1,'#8fb4d0');
          poles(g,n,true);
          // 頂棚：垂邊（紅白直條＋扇形下緣）＋條紋圓錐頂＋頂飾
          const cy2=y-4-HC;for(let dx=-rx-2;dx<=rx+2;dx++){const e=Math.round((ry+1)*Math.sqrt(Math.max(0,1-(dx*dx)/((rx+2.5)*(rx+2.5)))));const c=((dx+40)>>1)%2?'#f4f1e6':'#d23a2e';
            const cc=dx>rx*.35?A.shade(c,-34):c;RC(g,x+dx,cy2-e,1,4+2*e,cc);if(((dx+40)%3)===0)RC(g,x+dx,cy2+e+4,1,1,cc);}
          cone(g,x,cy2,rx+3,ry+2,12,(i,c)=>{const base=i%2?'#f4f1e6':'#d23a2e';return c>.35?A.shade(base,-40):c>-.3?A.shade(base,-12):base;},16);
          RC(g,x,cy2-15,1,3,'#e8c860');RC(g,x-1,cy2-16,3,1,'#e8c860');
          for(let dx=-rx-2;dx<=rx+2;dx+=2){const e=Math.round((ry+1)*Math.sqrt(Math.max(0,1-(dx*dx)/((rx+2.5)*(rx+2.5)))));RC(g,x+dx,cy2+e+3,1,1,'#fff2c0');if(n)RC(n,x+dx,cy2+e+3,1,1,BULB[(dx+40)%BULB.length]);}
          if(n){for(let dx=-rx+2;dx<=rx-2;dx+=3){RC(n,x+dx,cy2+ry+6,1,1,'rgba(255,220,150,.55)');}RC(n,x,cy2-16,1,1,'#ffe08a');}});};
      // ---- 海盜船（船身沿 u，擺到 +u 側、船尾翹起）：兩側灰鋼 A 字架＋頂部樞軸；長船身兩端高翹、紅金飾帶、甲板一排乘客、桅杆瞭望台＋骷髏旗 ----
      // 修正輪（退件 v1 海盜船）：前 A 字架改畫在船身後面（只露出船身上下兩段腿，不再有斜線橫過船身），
      //   鋼架全改深藍（前腿亮暗各 1px、後腿 1px），在淺色鋪面上輪廓清楚；頂部水平樞軸樑（3px 三色）＋樞軸轂＋前側 V 形吊臂畫在船身前面；
      //   船身改成兩端尖翹的新月形，船首尾舷牆高出甲板（尖角是紅金船殼），受光面亮紅＋金色舷帶＋金色細線、下緣深紅，甲板深木色；
      //   擺角 .42→.30；大骷髏旗拿掉，改船尾一根小桅杆＋瞭望台＋3×2 小黑旗
      // 修正輪二（iter27）：前後兩座 A 字架從 v±.22 收到 v±.15，兩個頂點在畫面上靠近成一座粗 A、不再錯開成網狀；
      //   腿改 2px（亮＋暗）＋離地低處一道橫撐，一看就是 A 字鋼架；擺角 .30→.22，船身新月較對稱
      const pirate=(S,SHD,uc,vc,ang,d)=>{const PH=34,ARM=20,HW=.06,LU=.36,SL=21,FW=.15,dd=d!=null?d:uc+vc+.2;
        SHD.push(['b',uc-.55,vc-.24,1.1,.48,2]);SHD.push(['p',uc,vc-FW,PH]);SHD.push(['p',uc,vc+FW,PH]);SHD.push(['l',uc-.5,vc,14,uc+.5,vc,20]);
        const U=px=>px/35.8,cs=Math.cos(ang),sn=Math.sin(ang);
        const toW=(s,z)=>{const zz=z-ARM;return[uc+U(s*cs-zz*sn),PH+(s*sn+zz*cs)];};
        const W=(s,z,v)=>{const[u,zz]=toW(s,z);return P(u,v,zz);};
        // 新月形：甲板線（上緣）兩端上翹、船底線（下緣）翹得更快，兩端在 ±SL 收成尖
        const Tz=s=>4+10*Math.pow(s/18,2),Kz=s=>Math.min(Tz(s),-6+17.14*Math.pow(s/18,2));
        const Ts=s=>Tz(s)+3.5*Math.pow(Math.abs(s)/SL,3);   // 前舷上緣：船首尾舷牆高出甲板（兩端尖角是紅金船殼，不是一截木甲板）
        const legs=(g,v,col,col2)=>{const t=P(uc,v,PH);for(const u of[uc-LU,uc+LU]){const f=P(u,v,0);if(col2)BL(g,[f[0]+1,f[1]],[t[0]+1,t[1]],col2);BL(g,f,t,col);}
          {const zb=6,k=LU*(1-zb/PH);BL(g,P(uc-k,v,zb),P(uc+k,v,zb),col2||col);}   // 低處橫撐（船身底下露出來）
          for(const u of[uc-LU,uc+LU]){const f=P(u,v,0);RC(g,f[0]-1,f[1],3+(col2?1:0),1,'#5c6166');}};
        const arms=(g,v,c1,c2)=>{const pv=P(uc,v,PH);for(const s of[-9,9]){const q=W(s,Tz(s)+1,v);BL(g,pv,q,c1);BL(g,[pv[0]+1,pv[1]],[q[0]+1,q[1]],c2);}};
        // 底座
        S.o(dd-.4,(g)=>{boxZ(g,uc-.56,vc-.26,1.12,.52,0,2,'#d8d4ca','#c2bdb2','#a8a397');boxZ(g,uc-.4,vc-.12,.8,.24,2,1,'#b9b4a8','#aaa498','#98928a');});
        // 後 A 字架（船身後面，只有兩腿）
        S.t(dd-.3,(g)=>legs(g,vc-FW,'#34507a','#1f3350'));
        // 前 A 字架：只畫兩根腿（亮面＋暗面各 1px，深藍鋼），放在船身後面（被船身遮住中段），不再有斜線橫過船身
        S.t(dd-.2,(g)=>legs(g,vc+FW,'#5a7fb4','#1f3350'));
        S.o(dd,(g,n)=>{const ss=[];for(let s=-SL;s<=SL;s++)ss.push(s);const vF=vc+HW,vB=vc-HW;
          // 甲板（上緣帶；深木色，跟後方淺色鋪面分開）＋中線木紋
          fp(g,[...ss.map(s=>W(s,Tz(s),vB)),...ss.slice().reverse().map(s=>W(s,Tz(s),vF))],'#9a6a3e');
          for(let i=0;i+1<ss.length;i++)BL(g,W(ss[i],Tz(ss[i]),vc-.02),W(ss[i+1],Tz(ss[i+1]),vc-.02),'#b88450');
          // iter27：吊臂改成實心三角桁架板（樞軸 → 甲板 s=±11），深藍底＋左亮右暗邊＋兩道內斜撐；
          //   擋住後方 A 字腿與飛車軌道，船上方不再是一團交叉細線
          {const tp=P(uc,vc,PH-1),l=W(-11,Tz(-11),vc),r=W(11,Tz(11),vc),m=W(0,Tz(0),vc);
            fp(g,[tp,r,l],'#aebfd6');
            const mid=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
            BL(g,mid(tp,l,.45),m,'#56739e');BL(g,mid(tp,r,.45),m,'#56739e');BL(g,mid(tp,l,.45),mid(tp,r,.45),'#56739e');BL(g,mid(tp,l,.8),mid(tp,r,.8),'#56739e');
            BL(g,tp,l,'#e4ecf6');BL(g,[tp[0]-1,tp[1]+1],[l[0]-1,l[1]],'#44679a');BL(g,tp,r,'#2c4a78');BL(g,[tp[0]+1,tp[1]+1],[r[0]+1,r[1]],'#2c4a78');
            // 前 A 字架上段（頂點 → 甲板高度）壓在桁架板前面：淺板上一個深藍 A 字，一眼看出支架；中段由船身蓋住
            const zc=20,k=LU*(1-zc/PH),ta=P(uc,vc+FW,PH);for(const u of[uc-k,uc+k]){const f=P(u,vc+FW,zc);BL(g,[ta[0]+1,ta[1]],[f[0]+1,f[1]],'#16233a');BL(g,ta,f,'#3f6aa8');}}
          // 乘客：坐在船中線，頭與肩露出前舷
          for(let s=-16;s<=16;s+=3){if(Math.abs(s)<3)continue;const q=W(s,Tz(s)+1,vc);const k=(s+30)/3|0;RC(g,q[0],q[1]-1,1,1,k%2?'#e2b48e':'#b8835e');RC(g,q[0],q[1],1,1,['#3b5f8a','#e0463a','#4fae5a','#f2c230','#6a5a8a'][k%5]);}
          // 船側受光面：下半深紅底 → 上半亮紅 → 金色舷帶 → 金色細線
          fp(g,[...ss.map(s=>W(s,Ts(s),vF)),...ss.slice().reverse().map(s=>W(s,Kz(s),vF))],'#a93a2a');
          const band=(o0,o1,col)=>{const q=[];for(const s of ss)q.push(W(s,Math.max(Kz(s),Ts(s)-o0),vF));for(const s of ss.slice().reverse())q.push(W(s,Math.max(Kz(s),Ts(s)-o1),vF));fp(g,q,col);};
          band(0,6,'#e2623f');band(0,2,'#ffd24a');band(0,1,'#fff0a0');band(5,6,'#f2c230');band(8,11,'#7e2a1e');
          // 舷側盾牌圓飾（白底紅心，沿亮紅帶）
          for(let s=-12;s<=12;s+=6){const q=W(s,Ts(s)-3.5,vF);RC(g,q[0],q[1],2,1,'#f4f1e6');RC(g,q[0],q[1]+1,2,1,'#d8d2c2');}
          // 船首金色像飾、船尾燈籠
          {const q=W(SL,Ts(SL),vF);RC(g,q[0],q[1]-2,2,2,'#f2c230');RC(g,q[0]+1,q[1]-3,1,1,'#ffe07a');}
          // 船尾小桅杆＋瞭望台＋3×2 小黑旗（旗往右）
          {const s=-16,b=W(s,Tz(s),vc),t=W(s,Tz(s)+11,vc);BL(g,b,t,'#6a4428');const c=W(s,Tz(s)+7,vc);RC(g,c[0]-1,c[1],3,1,'#8a5a34');
            RC(g,t[0]+1,t[1],3,2,'#1e1e22');RC(g,t[0]+2,t[1],1,1,'#f4f1e6');}
          if(n){for(let s=-16;s<=16;s+=4){const q=W(s,Ts(s)-1,vF);RC(n,q[0],q[1],1,1,BULB[((s+16)/4)%BULB.length]);}}});
        // 船身前面：前吊臂（V 形兩臂＋橫撐）、水平樞軸樑、樞軸轂
        S.t(dd+.01,(g)=>{   // iter27：前側細線 V 吊臂拿掉（吊臂由船身層裡的三角桁架板代表）
          const a=P(uc,vc-FW-.03,PH),b=P(uc,vc+FW+.03,PH);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],'#1f3350');BL(g,a,b,'#44679a');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#8fb0dc');
          const h=P(uc,vc+HW+.02,PH);RC(g,h[0]-1,h[1]-1,3,3,'#17202c');RC(g,h[0],h[1],1,1,'#f2c230');
          for(const v of[vc-FW,vc+FW]){const t=P(uc,v,PH);RC(g,t[0]-1,t[1],3,2,'#1f3350');}});
        L.fence(S,[uc-.56,vc+.28],[uc+.56,vc+.28],[[.42,.58]],.05,'#c0392b',4);};
      // ---- 空中飛椅：糖果條紋塔＋雙層傘蓋＋外甩的鏈條座椅 ----
      const swings=(S,SHD,cu,cv,d)=>{const TH=46,r1=.22,r2=.52,hc=27,NC=16,dd=d!=null?d:cu+cv;SHD.push(['c',cu,cv,r2,10]);SHD.push(['p',cu,cv,TH]);
        const p=P(cu,cv),x=rnd(p[0]),y=rnd(p[1]);const R=(r,a,h)=>{const q=P(cu+r*Math.cos(a),cv+r*Math.sin(a),h);return[rnd(q[0]),rnd(q[1])];};
        const chairs=(g,front)=>{for(let i=0;i<NC;i++){const a=(i+.3)/NC*Math.PI*2;if((Math.sin(a+Math.PI/4)>0)!==front)continue;const top=R(r1,a,TH-5),c=R(r2,a,hc);
          BL(g,top,[c[0],c[1]-3],'#5f676e');RC(g,c[0]-1,c[1]-1,4,2,BUNT[i%BUNT.length]);RC(g,c[0]-1,c[1]-1,4,1,A.shade(BUNT[i%BUNT.length],30));RC(g,c[0],c[1]-3,1,2,['#3b5f8a','#a8473a','#4a6b45','#6a5a8a'][i%4]);RC(g,c[0],c[1]-4,1,1,i%3?'#e2b48e':'#b8835e');RC(g,c[0]+(Math.cos(a)>0?1:-1),c[1]+1,1,1,'#3a3d40');}};
        // 平台：磚紅鋪面圓台（深色側緣＋外圈）、同心接縫圈＋12 道放射接縫、灰色塔基；+v 側入口踏階
        S.o(dd-.05,(g)=>{const rx=rnd(r2*45.25)+3,ry=rnd(r2*22.6)+2;
          ell(g,x,y+1,rx,ry,'#5e3528');ell(g,x,y,rx,ry,'#7e4636');ell(g,x,y-1,rx,ry,'#96533f');ell(g,x,y-1,rx-1,ry-1,'#b86a52');
          for(let i=0;i<12;i++){const a=(i+.5)/12*Math.PI*2;BL(g,[rnd(x+Math.cos(a)*8),rnd(y-1+Math.sin(a)*4)],[rnd(x+Math.cos(a)*(rx-2)),rnd(y-1+Math.sin(a)*(ry-1))],'#9c5845');}
          for(let i=0;i<64;i++){const a=i/64*Math.PI*2;RC(g,rnd(x+Math.cos(a)*rx*.6),rnd(y-1+Math.sin(a)*ry*.6),1,1,'#9c5845');}
          for(let i=0;i<24;i++){const a=i/24*Math.PI*2;if(Math.sin(a)<.2)continue;RC(g,rnd(x+Math.cos(a)*(rx-3)),rnd(y-1+Math.sin(a)*(ry-2)),1,1,'#cc8266');}
          ell(g,x,y-1,7,3,'#7e7a72');ell(g,x,y-2,6,3,'#b9b4a8');ell(g,x-1,y-3,3,1,'#d8d4ca');
          const e=P(cu,cv+r2+.03),ex=rnd(e[0]),ey=rnd(e[1]);RC(g,ex-3,ey-2,7,2,'#c9c6bd');RC(g,ex-3,ey,7,1,'#8f8b82');RC(g,ex-2,ey-1,5,1,'#e0ddd4');});
        L.crowd(S,[[cu+.02,cv+r2+.17,3],[cu-.05,cv+r2+.2,12],[cu+.08,cv+r2+.24,7]],0);
        S.t(dd,(g)=>chairs(g,false));
        S.o(dd+.01,(g,n)=>{cyl(g,x,y-1,3,1,TH-6,'#f4f1e6','#b8bcc0',null,'#dcdfe2');for(let z=4;z<TH-8;z+=6)RC(g,x-3,y-1-z,7,2,'#d23a2e');
          const cy2=y-TH,rx1=rnd(r1*45.25)+2,ry1=rnd(r1*22.6)+1;
          ell(g,x,cy2+6,rx1,ry1,'#2d6aa8');ell(g,x,cy2+5,rx1,ry1,'#f2c230');for(let dx=-rx1;dx<=rx1;dx+=3){const e=Math.round(ry1*Math.sqrt(Math.max(0,1-dx*dx/((rx1+.5)*(rx1+.5)))));RC(g,x+dx,cy2+5+e,2,2,'#d23a2e');}
          cone(g,x,cy2+4,rx1,ry1,9,(i,c)=>{const b=i%2?'#f4f1e6':'#3f86d0';return c>.35?A.shade(b,-40):c>-.3?A.shade(b,-10):b;},14);
          RC(g,x,cy2-8,1,3,'#e8c860');RC(g,x-1,cy2-9,3,1,'#e8c860');
          for(let i=0;i<16;i++){const a=i/16*Math.PI*2;if(Math.sin(a)<-.2)continue;const q=R(r1*1.02,a,TH-6);RC(g,q[0],q[1],1,1,'#fff2c0');if(n)RC(n,q[0],q[1],1,1,BULB[i%BULB.length]);}
          if(n)RC(n,x,cy2-8,1,1,'#ffe08a');});
        S.t(dd+.02,(g)=>chairs(g,true));
        L.fence(S,[cu-r2-.08,cv+r2+.08],[cu+r2+.08,cv+r2+.08],[[.42,.58]],.1,'#3f86d0',4);L.fence(S,[cu+r2+.08,cv-r2-.08],[cu+r2+.08,cv+r2+.08],[],.1,'#3f86d0',4);};
      // ---- 攤位：小亭＋條紋遮陽篷（+v 面）＋頂上招牌；排隊人潮 ----
      const stall=(S,SHD,u0,v0,du,dv,c1,c2,sign,d)=>{SHD.push(['b',u0,v0,du,dv,13]);S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{const u1=u0+du,v1=v0+dv;
        boxZ(g,u0,v0,du,dv,0,10,'#f1ece0','#f4efe4','#cfc8b8');
        fL(g,v1,u0+.03,u1-.03,4,8,'#4a3a2e');if(n)fL(n,v1,u0+.03,u1-.03,4,8,C.lit);fL(g,v1,u0,u1,2,4,c1);
        for(let i=0;i<Math.round(du/.05);i++){const a=u0+i*.05,b=Math.min(u1,a+.05);fp(g,[P(a,v1,10),P(b,v1,10),P(b,v1+.08,6),P(a,v1+.08,6)],i%2?'#f4f1e6':c1);}
        fR(g,u1,v0+.04,v1-.04,3,8,A.shade(c2,-30));
        boxZ(g,u0-.02,v0-.02,du+.04,dv+.04,10,1,'#f4efe2','#d9cfb8','#b7ad95');
        const sp=P(u0+du*.5,v1,11);RC(g,sp[0]-4,sp[1]-5,9,5,c2);RC(g,sp[0]-3,sp[1]-4,7,3,'#f4f1e6');if(sign)sign(g,sp[0]-3,sp[1]-4);if(n)RC(n,sp[0]-3,sp[1]-4,7,3,'#fff0c0');});};
      const ICE=(g,x,y)=>{RC(g,x+2,y,3,1,'#f07ab0');RC(g,x+3,y+1,1,2,'#d8a060');};
      const POP=(g,x,y)=>{RC(g,x+2,y,3,2,'#f2c230');RC(g,x+2,y+2,3,1,'#e0463a');};
      const DOG=(g,x,y)=>{RC(g,x+1,y+1,5,1,'#c0392b');RC(g,x+1,y,5,1,'#e0b060');};
      // ---- 彩旗串：兩桿之間下垂弧線、三角小旗；夜間燈泡 ----
      const bunting=(S,a,b,h,seed,d)=>{const pts=[];const n=Math.max(4,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/.03));for(let i=0;i<=n;i++){const t=i/n;pts.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,h-6*4*t*(1-t)]);}
        for(const q of[a,b])S.t(q[0]+q[1]+.01,(g)=>{const p=P(q[0],q[1]);RC(g,p[0],p[1]-h-1,1,h+1,'#5a6066');RC(g,p[0],p[1]-h-2,1,1,'#e8c860');});
        S.t(d!=null?d:Math.max(a[0]+a[1],b[0]+b[1])+.01,(g,nn)=>{for(let i=0;i<n;i++){BL(g,P(...pts[i]),P(...pts[i+1]),'#6a6a6a');}
          for(let i=1;i<n;i++){const p=P(...pts[i]),x=rnd(p[0]),y=rnd(p[1]),c=BUNT[(i+seed)%BUNT.length];if(i%2){RC(g,x-1,y+1,3,1,c);RC(g,x,y+2,1,1,c);}else{RC(g,x,y+1,1,1,'#fff6d0');if(nn)RC(nn,x,y+1,1,1,BULB[(i+seed)%BULB.length]);}}});};
      // ---- 入口拱門：兩座塔（尖頂）＋弧形招牌 PARK＋燈泡 ----
      // 修正輪（退件 v1 FUN 字變形）：弧形招牌上逐字排的字，被弧線＋斜面一起帶歪（v1 首字看成反 F）。
      //   改成「直橫樑＋立在樑上的跑馬燈字牌」：每個字一塊直立紅牌（頂邊金色燈條），字形不剪切、不鏡像，
      //   由左到右排、牌底沿橫樑斜度逐塊上下錯開；字牌下緣埋進橫樑，不浮空。兩個走向共用同一段程式。
      const archGate=(S,SHD,axis,c,a0,a1,d,word='FUN')=>{const TH=22,BZ=TH-7;
        const tower=(g,u,v)=>{boxZ(g,u-.06,v-.06,.12,.12,0,TH,null,'#3f86d0','#2d6aa8');for(let z=3;z<TH;z+=6)(axis==='u'?fL(g,v+.06,u-.06,u+.06,z,z+2,'#f4f1e6'):fR(g,u+.06,v-.06,v+.06,z,z+2,'#e4e1d6'));
          const p=P(u,v,TH),x=rnd(p[0]),y=rnd(p[1]);cone(g,x,y,4,2,10,(i,cc)=>cc>.35?'#a02a20':cc>-.3?'#c8382b':'#e0564a',12);RC(g,x,y-13,1,3,'#e8c860');};
        const at=(t,z)=>axis==='u'?P(t,c+.02,z):P(c+.02,t,z),T0=a0+.06,T1=a1-.06;
        const tw=(t)=>axis==='u'?[t,c]:[c,t];
        for(const t of[a0,a1]){const[u,v]=tw(t);SHD.push(['b',u-.06,v-.06,.12,.12,TH]);}
        SHD.push(axis==='u'?['b',T0,c-.01,T1-T0,.06,5,BZ]:['b',c-.01,T0,.06,T1-T0,5,BZ]);
        S.o(d!=null?d:a1+c,(g,n)=>{tower(g,...tw(a0));
          // 字牌（先畫，下緣由橫樑蓋住）：牌寬＝字寬＋2，牌高 8（金色頂條 1＋留白 1＋字 5＋留白 1）；相鄰牌留 1px 縫（描框後成深色分隔）
          const top=at(axis==='u'?T0:T1,BZ+5),bot=at(axis==='u'?T1:T0,BZ+5);   // 螢幕上左端、右端（橫樑頂邊）
          const ws=[...word].map(ch=>L.textW(ch)+2),tot=ws.reduce((a,b)=>a+b,0)+ws.length-1,mx=(top[0]+bot[0])/2;let x=rnd(mx-tot/2);
          const slope=(bot[1]-top[1])/(bot[0]-top[0]);
          [...word].forEach((ch,i)=>{const w=ws[i],cx=x+w/2,yb=rnd(top[1]+(cx-top[0])*slope),y0=yb-9;
            RC(g,x,y0,w,12,'#c8302a');RC(g,x,y0,w,1,'#f2c230');for(let k=0;k<w;k+=2){RC(g,x+k,y0,1,1,'#fff6c8');if(n)RC(n,x+k,y0,1,1,'#ffe08a');}
            L.textF(g,x+1,y0+2,ch,'#fff4d0',n,'#fff0b0');x+=w+1;});
          // 直橫樑：金邊紅芯，底緣一排燈泡
          fp(g,[at(T0,BZ),at(T1,BZ),at(T1,BZ+5),at(T0,BZ+5)],'#f2c230');fp(g,[at(T0,BZ+1),at(T1,BZ+1),at(T1,BZ+4),at(T0,BZ+4)],axis==='u'?'#d23a2e':'#b82e22');
          for(let t=T0+.03;t<T1;t+=.06){const p=at(t,BZ);RC(g,p[0],p[1],1,1,'#fff6d0');if(n)RC(n,p[0],p[1],1,1,'#ffe08a');}
          tower(g,...tw(a1));});};
      // 正面拱門（南角）
      const archF=(S,SHD,pa,pb,d)=>{const TH=22;SHD.push(['b',pa[0]-.06,pa[1]-.06,.12,.12,TH]);SHD.push(['b',pb[0]-.06,pb[1]-.06,.12,.12,TH]);
        S.o(d!=null?d:pa[0]+pa[1]+.1,(g,n)=>{for(const[u,v]of[pa,pb]){boxZ(g,u-.06,v-.06,.12,.12,0,TH,null,'#3f86d0','#2d6aa8');for(let z=3;z<TH;z+=6){fL(g,v+.06,u-.06,u+.06,z,z+2,'#f4f1e6');fR(g,u+.06,v-.06,v+.06,z,z+2,'#e4e1d6');}
            const p=P(u,v,TH),x=rnd(p[0]),y=rnd(p[1]);cone(g,x,y,5,3,11,(i,cc)=>cc>.35?'#a02a20':cc>-.3?'#c8382b':'#e0564a',12);RC(g,x,y-14,1,3,'#e8c860');}
          const a=P(pa[0],pa[1],TH),b=P(pb[0],pb[1],TH),x0=rnd(a[0])+4,x1=rnd(b[0])-4,yb=rnd(a[1]);
          for(let x=x0;x<=x1;x++){const t=(x-x0)/(x1-x0),arc=Math.round(4*Math.sin(t*Math.PI));RC(g,x,yb-arc-3,1,9,'#f2c230');RC(g,x,yb-arc-2,1,7,'#d23a2e');if(x%2===0){RC(g,x,yb-arc-3,1,1,'#fff6d0');if(n)RC(n,x,yb-arc-3,1,1,'#ffe08a');}}
          {const str='PARK',tx=rnd((x0+x1)/2-L.textW(str)/2);let k=0;for(const ch of str){const gw=L.textW(ch),xc=tx+k+gw/2,arc=Math.round(4*Math.sin(Math.max(0,Math.min(1,(xc-x0)/(x1-x0)))*Math.PI));
            L.textF(g,tx+k,yb-arc-1,ch,'#fff4d0',n,'#fff0b0',1);k+=gw+1;}}});};
      // 售票亭
      const ticket=(S,SHD,u0,v0,du,dv,col,d)=>{SHD.push(['b',u0,v0,du,dv,13]);S.o(d!=null?d:u0+du+v0+dv,(g,n)=>{
        boxZ(g,u0,v0,du,dv,0,9,null,'#f4efe4','#cfc8b8');fL(g,v0+dv,u0+du*.2,u0+du*.8,4,8,'#3d5a6c');fR(g,u0+du,v0+dv*.2,v0+dv*.8,4,8,'#34505f');
        if(n){fL(n,v0+dv,u0+du*.2,u0+du*.8,4,8,C.lit);fR(n,u0+du,v0+dv*.2,v0+dv*.8,4,8,'#ffd98a');}
        const p=P(u0+du/2,v0+dv/2,9),x=rnd(p[0]),y=rnd(p[1]);cone(g,x,y,rnd((du+dv)*14)+2,rnd((du+dv)*7)+1,7,(i,c)=>{const b=i%2?'#f4f1e6':col;return c>.35?A.shade(b,-40):c>-.3?A.shade(b,-10):b;},12);});};
      // ---- 遊戲攤（iter20：套圈／射擊攤）：三面牆、+v 面敞開（暗色內牆兩排彩色獎品）、櫃台色帶、條紋山形篷（脊沿 u）＋簷口燈泡 ----
      // 修正輪：獎品牆原本 2×2 小點以 1.4px 間距擠成兩排色點、又被篷簷蓋掉一半；改成
      //   (1) 簷下外掛一排大絨毛玩偶（3×3：雙耳＋頭身、左上高光、右下暗角，細繩吊在簷口；不點黑眼，免得看成甜甜圈），一隻一色、兩攤色組不同；
      //   (2) 櫃台降低，暗色內牆前一排套圈瓶（瓶身＋瓶蓋，綠／褐／藍／白輪替）
      const games=(S,SHD,u0,v0,du,dv,c1,seed,d)=>{const u1=u0+du,v1=v0+dv,vm=v0+dv/2,EH=14,RZ=19;SHD.push(['b',u0,v0,du,dv,RZ]);
        const PRZ=seed%2?['#5ec8ff','#ffd23a','#6ee06a','#ff7ab8','#ff9a3a']:['#ff7ab8','#ffd23a','#b07aff','#6ee06a','#ff9a3a'];
        const plush=(g,x,y,c)=>{x=rnd(x);y=rnd(y);RC(g,x,y,1,1,c);RC(g,x+2,y,1,1,c);RC(g,x,y+1,3,2,c);RC(g,x,y+1,1,1,A.shade(c,50));RC(g,x+2,y+2,1,1,A.shade(c,-30));};
        S.o(d!=null?d:u1+v1,(g,n)=>{boxZ(g,u0,v0,du,dv,0,EH,null,'#f1ece0','#cfc8b8');
          fL(g,v1,u0+.025,u1-.025,3,EH,'#2e2622');if(n)fL(n,v1,u0+.025,u1-.025,3,EH,'rgba(255,214,150,.85)');
          {const BT=['#4fae5a','#a0673a','#5ea0e0','#f4f1e6'];let k=seed;for(let t=u0+.05;t<u1-.03;t+=.05){const p=P(t,v1,6);RC(g,p[0],p[1],1,2,BT[k%4]);RC(g,p[0],p[1]-1,1,1,'#e8d8a0');k++;}}
          fL(g,v1,u0,u1,1,3,c1);fL(g,v1,u0,u1,3,4,'#f4f1e6');fR(g,u1,v0,v1,1,3,A.shade(c1,-30));
          const S5=.05,nS=Math.max(2,Math.round(du/S5));
          for(let i=0;i<nS;i++){const a=u0-.02+(du+.04)*i/nS,b=u0-.02+(du+.04)*(i+1)/nS;fp(g,[P(a,v0-.03,EH),P(b,v0-.03,EH),P(b,vm,RZ),P(a,vm,RZ)],i%2?'#d6d0c2':A.shade(c1,-28));}
          for(let i=0;i<nS;i++){const a=u0-.02+(du+.04)*i/nS,b=u0-.02+(du+.04)*(i+1)/nS;fp(g,[P(a,v1+.05,EH-1),P(b,v1+.05,EH-1),P(b,vm,RZ),P(a,vm,RZ)],i%2?'#f4f1e6':c1);
            const m=P((a+b)/2,v1+.05,EH-1);RC(g,m[0],m[1]+1,1,1,i%2?'#d6d0c2':A.shade(c1,-20));if(!(i%2)){RC(g,m[0],m[1],1,1,'#fff6d0');if(n)RC(n,m[0],m[1],1,1,BULB[(i+seed)%BULB.length]);}}
          fp(g,[P(u1+.02,v0-.03,EH),P(u1+.02,v1+.05,EH-1),P(u1+.02,vm,RZ)],'#bdb5a4');
          BL(g,P(u0-.02,vm,RZ),P(u1+.02,vm,RZ),'#fff6d0');const tp=P(u0+du/2,vm,RZ);RC(g,tp[0],tp[1]-3,1,3,'#8a8f96');RC(g,tp[0]+1,tp[1]-3,2,2,c1);
          // 簷下吊掛的大玩偶（在篷簷前面）
          {let k=0;for(let t=u0+.03;t+.09<u1;t+=.11){const p=P(t,v1+.06,EH-3);RC(g,p[0]+1,p[1]-1,1,1,'#3a3030');plush(g,p[0],p[1],PRZ[(k+seed)%PRZ.length]);k++;}}});};
      // ---- 野餐桌＋陽傘 ----
      const table=(S,SHD,u,v,col,d)=>{const q=P(u+.12,v-.05);SHD.push(['e',q[0],q[1],5,2]);S.o(d!=null?d:u+v+.04,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
        RC(g,x-4,y,2,1,'#6e4a2a');RC(g,x+3,y,2,1,'#6e4a2a');RC(g,x-3,y-2,7,1,'#b07a48');RC(g,x-2,y-1,1,1,'#5a4030');RC(g,x+2,y-1,1,1,'#5a4030');RC(g,x,y-9,1,7,'#5a5046');
        ell(g,x,y-10,5,2,col);RC(g,x-5,y-10,11,1,A.shade(col,-24));RC(g,x-3,y-11,4,1,A.shade(col,30));RC(g,x,y-12,1,1,'#f4f1e6');});};
      // ---- 碰碰車館（iter20）：鋼板場地＋黃黑防撞邊、六輛彩色碰碰車（集電桿連頂棚）、四柱平頂棚（紅色簷板＋黃條＋燈泡） ----
      const bumper=(S,SHD,u0,v0,du,dv,d)=>{const u1=u0+du,v1=v0+dv,RH=16,dd=d!=null?d:u1+v1;SHD.push(['b',u0,v0,du,dv,2]);SHD.push(['b',u0,v0,du,dv,3,RH]);
        S.o(dd-.8,(g)=>{boxZ(g,u0,v0,du,dv,0,2,'#6a7078','#f2c230','#b8962a');for(let t=u0+.02;t<u1;t+=.08)fL(g,v1,t,t+.04,0,2,'#2a2a2a');
          for(let t=u0+.1;t<u1-.02;t+=.1)BL(g,P(t,v0,2),P(t,v1,2),'#5c626a');for(let t=v0+.1;t<v1-.02;t+=.1)BL(g,P(u0,t,2),P(u1,t,2),'#5c626a');});
        const CARS=[[.22,.3,'#e0463a',1],[.6,.22,'#f2c230',0],[.82,.52,'#3f86d0',1],[.38,.62,'#4fae5a',0],[.68,.8,'#f07ab0',1],[.18,.84,'#9a5ad0',0]];
        S.t(dd-.7,(g)=>{for(const[a,b,c,f]of CARS){const p=P(u0+du*a,v0+dv*b,2),x=rnd(p[0]),y=rnd(p[1]),t=P(u0+du*a,v0+dv*b,RH);
          BL(g,[x+(f?1:-1),y-4],[rnd(t[0])+(f?1:-1),rnd(t[1])],'#8a939a');RC(g,x-3,y-1,7,2,'#2a2a2a');RC(g,x-2,y-3,5,3,c);RC(g,x-2,y-3,5,1,A.shade(c,40));RC(g,x+(f?1:-2),y-4,2,1,A.shade(c,-20));
          RC(g,x+(f?-1:1),y-5,1,2,['#3b5f8a','#a8473a','#6a5a8a'][(a*10|0)%3]);RC(g,x+(f?-1:1),y-6,1,1,'#e2b48e');}});
        S.o(dd,(g,n)=>{for(const[u,v]of[[u0+.02,v1-.02],[u1-.02,v1-.02],[u1-.02,v0+.02]]){vln(g,u,v,2,RH,'#5a6066');vln(g,u+.012,v,2,RH,'#8a939a');}
          boxZ(g,u0-.03,v0-.03,du+.06,dv+.06,RH,3,'#c9c4b8','#d23a2e','#9e2c22');
          for(let t=u0;t<u1;t+=.1)fL(g,v1+.03,t,t+.05,RH+1,RH+2,'#f2c230');for(let t=v0;t<v1;t+=.1)fR(g,u1+.03,t,t+.05,RH+1,RH+2,'#c8a020');
          for(let t=u0+.02;t<u1+.02;t+=.05){const p=P(t,v1+.03,RH);RC(g,p[0],p[1],1,1,'#fff6d0');if(n)RC(n,p[0],p[1],1,1,BULB[Math.round(t*20)%BULB.length]);}
          for(let t=v0+.02;t<v1+.02;t+=.05){const p=P(u1+.03,t,RH);RC(g,p[0],p[1],1,1,'#f0e2b0');if(n)RC(n,p[0],p[1],1,1,BULB[Math.round(t*20+3)%BULB.length]);}
          for(let t=u0+.06;t<u1;t+=.08)BL(g,P(t,v0,RH+3),P(t,v1,RH+3),'#b3ada0');   // 屋面浪板接縫
          boxZ(g,u0+du*.15,v0+dv*.12,du*.22,dv*.2,RH+3,3,'#b0b4b8','#9aa0a6','#7c8288');   // 屋頂設備箱（退到後方）
          // 修正輪（iter24）原本在屋頂前緣 +v 面立碰碰車招牌、圖示沿斜面逐欄排 → iter27 改成下面的直立看板
          // iter27：斜面上逐欄排的圖示被剪切成一團紅斜塊 ⇒ 改成屋頂正中一塊面向鏡頭的直立看板（兩根短柱撐在屋面上），
          //   黃框深藍底、圖示直立不剪切：碰碰車側面（黑色防撞胎、紅車身、白高光、駕駛人頭）＋車尾集電桿＋頂端火花；框頂一排燈泡
          {const pr=P(u0+du*.58,v0+dv*.58,RH+3),bx=rnd(pr[0])-7,by=rnd(pr[1])-3,BW=15,BH=11;
            RC(g,bx+3,by,1,3,'#5a6066');RC(g,bx+11,by,1,3,'#5a6066');
            RC(g,bx,by-BH,BW,BH,'#f2c230');RC(g,bx+1,by-BH+1,BW-2,BH-2,'#1f3a6a');RC(g,bx+BW-1,by-BH+1,1,BH-1,'#c8a020');RC(g,bx+1,by-1,BW-1,1,'#c8a020');
            if(n)RC(n,bx+1,by-BH+1,BW-2,BH-2,'rgba(70,110,190,.55)');
            const ICON=['......y.y','.......y.','.......s.','..h....s.','.rrrrrrrr','rwwrrrrrr','kkkkkkkkk'],IC={y:'#ffd23a',s:'#b8c0c6',h:'#e2b48e',r:'#e0463a',w:'#ffffff',k:'#0e1016'};
            ICON.forEach((row,j)=>{for(let i=0;i<row.length;i++){const ch=row[i];if(ch==='.')continue;RC(g,bx+3+i,by-BH+2+j,1,1,IC[ch]);if(n)RC(n,bx+3+i,by-BH+2+j,1,1,ch==='k'?'#303a50':IC[ch]);}});
            for(let x=bx+1;x<bx+BW;x+=2){RC(g,x,by-BH,1,1,'#fff6d0');if(n)RC(n,x,by-BH,1,1,'#ffe08a');}}
          if(n){const p=P(u0+du*.5,v0+dv*.5,RH-1);RC(n,p[0]-6,p[1],13,1,'rgba(255,230,160,.6)');}});};
      // 氣球販
      const balloons=(S,u,v)=>S.t(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);L.person(g,x,y,4);
        const B2=[[-2,-12,'#e0463a'],[1,-13,'#f2c230'],[3,-11,'#3f86d0'],[-1,-10,'#4fae5a'],[2,-9,'#f07ab0']];
        for(const[dx,dy,c]of B2){BL(g,[x,y-4],[x+dx,y+dy+2],'#c8c8c8');RC(g,x+dx,y+dy,2,2,c);RC(g,x+dx,y+dy,1,1,'#ffffff');}});
      // 咖啡杯（小型旋轉杯）
      // 咖啡杯：奶油色圓形轉盤（側緣＋外圈）＋三只大杯（粉、天藍兩色；白碟、白杯口、左亮右暗、杯耳、兩名乘客）
      const teacups=(S,SHD,cu,cv,r,d)=>{SHD.push(['c',cu,cv,r,4]);const p=P(cu,cv),x=rnd(p[0]),y=rnd(p[1]),rx=rnd(r*45.25),ry=rnd(r*22.6);
        const cup=(g,cx,cy,c,k)=>{const cL=A.shade(c,34),cD=A.shade(c,-34);ell(g,cx,cy,5,2,'#8f8878');ell(g,cx,cy-1,5,2,'#f6f1e6');
          for(let i=0;i<4;i++){const yy=cy-2-i,hw=i?4:3;RC(g,cx-hw,yy,2*hw+1,1,c);RC(g,cx-hw,yy,2,1,cL);RC(g,cx+hw-1,yy,2,1,cD);}
          RC(g,cx+5,cy-5,1,3,cD);RC(g,cx+4,cy-5,1,1,cD);
          ell(g,cx,cy-6,4,1,'#f6f1e6');RC(g,cx-2,cy-6,5,1,A.shade(c,-60));
          RC(g,cx-1,cy-8,1,2,k%2?'#e2b48e':'#b8835e');RC(g,cx-1,cy-9,1,1,'#4a3424');RC(g,cx+1,cy-7,1,1,'#e2b48e');RC(g,cx+1,cy-8,1,1,'#6a4a2a');};
        S.o(d!=null?d:cu+cv,(g)=>{cyl(g,x,y,rx,ry,3,'#e6dfd0','#aea796',null,'#cdc6b6');ell(g,x,y-3,rx,ry,'#c9b68e');ell(g,x,y-3,rx-1,ry-1,'#efe4c8');
          for(let i=0;i<8;i++){const a=(i+.5)/8*Math.PI*2;RC(g,rnd(x+Math.cos(a)*(rx-2)),rnd(y-3+Math.sin(a)*(ry-1)),1,1,'#d8c9a4');}
          const cols=['#ee78aa','#5eb2e4'],o=Math.max(5,rx-6);
          cup(g,x,y-3-Math.round(ry*.5),cols[1],1);cup(g,x-o,y-2+Math.round(ry*.3),cols[0],0);cup(g,x+o,y-2+Math.round(ry*.3),cols[0],3);});};
      return {pave,brick,lawn,flowers,spline,loopPts,helixPts,coaster,station,queue,queueV,carousel,pirate,swings,stall,ICE,POP,DOG,bunting,archGate,archF,ticket,balloons,teacups,games,table,bumper};};

    // -------- v0 紅色鋼構飛車＋旋轉木馬 --------
    const v0=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{R4,shp}=L,Q=park(K,L);
      A.dia(g,AX,L.TOPY,96,C.pave);Q.pave(g,R4(0,0,3,3),500);
      // 草地與花圃
      Q.lawn(g,R4(.12,.12,2.8,.36),501);Q.lawn(g,[[.12,.5],[.5,.5],[.5,2.3],[.12,2.3]],502);Q.lawn(g,R4(.55,1.1,.6,1.2),503);Q.flowers(g,R4(.62,1.15,.45,.14),504);Q.flowers(g,R4(.62,2.02,.45,.14),505);
      Q.lawn(g,R4(1.45,1.08,1.45,.12),506);
      // 旋轉木馬磚紅圓形廣場
      const cz=shp(2.15,1.72,.44,.44,2,48);Q.brick(g,cz(0),507);
      // 飛車
      const T={main:'#d8402f',hi:'#f58a6a',dk:'#7e1f16',sup:'#eef0f1',supD:'#a9b0b6'};
      const ctrl=[[2.55,.62,6],[2.25,.62,6],[1.95,.62,6],[1.75,.62,10],[1.2,.62,40],[.62,.62,68],[.46,.63,72],[.35,.74,70],[.33,.95,62],[.33,1.25,34],[.34,1.52,8],
        ...Q.loopPts(.34,1.72,.2,6,13,.1,18,1).map(([u,v,h])=>[u,v,h]),[.46,1.95,6],[.48,2.3,7],[.62,2.5,9],[.95,2.53,24],[1.15,2.5,12],[1.3,2.35,8],[1.32,2.05,10],[1.32,1.72,26],[1.32,1.4,9],[1.38,1.1,7],[1.6,.98,8],[2.2,.98,12],[2.58,.97,10],[2.72,.82,8],[2.68,.66,6]];
      const path=Q.spline(ctrl);
      const i0=path.findIndex(p=>p[0]<1.72&&p[1]<.7),i1=path.findIndex(p=>p[2]>69);
      Q.coaster(S,SHD,path,T,{lift:[i0,i1],train:[i0+Math.round((i1-i0)*.55),5,['#f2c230','#3f86d0']]});
      Q.station(S,SHD,1.92,.5,.68,.24,12,'#3f86d0');
      Q.queue(S,1.95,2.5,[.84,.9],1.95+.9+.3);
      // 旋轉木馬＋周邊
      Q.carousel(S,SHD,2.15,1.72,.3);
      Q.stall(S,SHD,1.55,2.12,.26,.18,'#e0463a','#e0463a',Q.POP);Q.stall(S,SHD,2.66,1.2,.2,.26,'#3f86d0','#3f86d0',Q.ICE);
      Q.teacups(S,SHD,.85,1.62,.26);
      // 入口廣場（左前邊近南角）
      Q.archGate(S,SHD,'u',2.86,1.77,2.69);
      Q.ticket(S,SHD,1.56,2.64,.16,.14,'#d23a2e');Q.ticket(S,SHD,2.7,2.64,.16,.14,'#3f86d0');
      Q.queueV(S,2.34,2.66,[2.08,2.15,2.29,2.36],2.08+2.66);
      // 彩旗串
      Q.bunting(S,[1.5,1.2],[2.85,1.2],13,0);Q.bunting(S,[1.5,2.42],[2.85,2.42],13,3);Q.bunting(S,[1.5,1.2],[1.5,2.42],13,1);
      // 樹、燈、長椅、氣球、人潮
      L.tree(S,SHD,.25,.25,1,0);L.tree(S,SHD,1.1,.28,.9,2);L.tree(S,SHD,.22,2.05,1,1);L.tree(S,SHD,.7,2.1,.9,0);L.tree(S,SHD,2.85,2.05,.9,2);L.tree(S,SHD,1.18,2.78,.9,0);
      L.bush(S,.9,1.2,3);L.bush(S,.62,2.28,3);
      L.lamp2(S,1.45,1.3);L.lamp2(S,2.88,1.55);L.lamp2(S,1.45,2.55);L.lamp2(S,2.7,2.5);L.lamp2(S,1.6,.9);
      L.bench(S,1.62,1.5,false);L.bench(S,2.72,1.9,false);
      Q.balloons(S,1.85,2.3);Q.balloons(S,2.55,1.45);
      // 西角遊戲攤區（iter20）：兩座條紋篷套圈／射擊攤＋野餐桌，前面排著玩的人
      Q.games(S,SHD,.08,2.56,.36,.2,'#e0463a',0);Q.games(S,SHD,.48,2.56,.36,.2,'#3f86d0',3);
      Q.table(S,SHD,.92,2.76,'#f2c230');
      L.hedge(S,[.05,.05],[2.95,.05],4);L.hedge(S,[.05,.05],[.05,2.95],4);L.fence(S,[.05,2.95],[2.95,2.95],[[.585,.93]],0,'#3a4a5a');L.fence(S,[2.95,.05],[2.95,2.95],[],0,'#3a4a5a');
      const walk=[...L.scatterIn(510,18,R4(1.45,1.22,1.45,1.18),(u,v)=>Math.hypot(u-2.15,v-1.72)<.36||(u>2.62&&v<1.5)),...L.scatterIn(511,12,R4(1.4,2.5,1.5,.4),(u,v)=>(u>2.0&&u<2.45&&v>2.6)),
        ...L.scatterIn(512,5,R4(1.5,.72,1.3,.24)),[.2,2.84,1],[.27,2.86,12],[.34,2.83,6],[.5,2.85,3],[.57,2.84,15],[.64,2.86,8],[.82,2.8,4],[1.0,2.72,9],[.98,2.84,11],[.76,2.64,2]];
      L.crowd(S,walk,0);
      L.lotEdge(g,'#b9a78a','#efe2cc');
    });
    // -------- v1 青綠鋼構飛車（鏡向走向＋雙駝峰＋螺旋）＋海盜船 --------
    const v1=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{R4,shp}=L,Q=park(K,L);
      A.dia(g,AX,L.TOPY,96,C.pave);Q.pave(g,R4(0,0,3,3),520);
      Q.lawn(g,R4(.12,.12,.36,2.8),521);Q.lawn(g,[[.5,.12],[2.3,.12],[2.3,.5],[.5,.5]],522);Q.lawn(g,R4(1.1,.55,1.2,.6),523);Q.flowers(g,R4(1.15,.62,.14,.45),524);Q.flowers(g,R4(2.02,.62,.14,.45),525);
      Q.lawn(g,R4(1.08,1.45,.12,1.45),526);
      Q.brick(g,R4(1.3,1.42,1.2,.66),527);
      const T={main:'#1f9a8a',hi:'#5fd0bf',dk:'#0f5a50',sup:'#f2d24a',supD:'#b8962a'};
      const helix=Q.helixPts(1.05,1.8,.28,22,8,1,0,30).map(([u,v,h],i)=>[u,v,h]);
      const hx=[];for(let i=1;i<=30;i++){const a=-i/30*Math.PI*2;hx.push([1.05+.28*Math.cos(a),1.8+.28*Math.sin(a),22-14*i/30]);}
      const base=[[2.55,.62,6],[2.25,.62,6],[1.95,.62,6],[1.75,.62,10],[1.2,.62,38],[.62,.62,66],[.46,.63,70],[.35,.74,68],[.33,.95,60],[.33,1.25,32],[.34,1.52,8],
        [.36,1.8,30],[.4,2.05,10],[.48,2.35,8],[.62,2.52,10],[.95,2.53,26],[1.2,2.5,12],[1.34,2.25,16],[1.34,2.02,21],...hx.slice(0,29),[1.36,1.5,8],[1.42,1.18,7],[1.6,.98,8],[2.2,.98,12],[2.58,.97,10],[2.72,.82,8],[2.68,.66,6]];
      const ctrl=base.map(([u,v,h])=>[v,u,h]);
      const path=Q.spline(ctrl);
      const i0=path.findIndex(p=>p[1]<1.72&&p[0]<.7),i1=path.findIndex(p=>p[2]>67);
      Q.coaster(S,SHD,path,T,{lift:[i0,i1],train:[i0+Math.round((i1-i0)*.4),5,['#e0463a','#f4f1e6']],every:.3,ties:1});
      Q.station(S,SHD,.5,1.92,.24,.68,12,'#d23a2e');
      Q.queueV(S,1.95,2.5,[.84,.9],.9+1.95+.3,'#1f9a8a');
      // 海盜船（船身沿 u）
      Q.pirate(S,SHD,1.9,1.72,.22);
      Q.stall(S,SHD,1.35,2.25,.26,.18,'#f2c230','#e0463a',Q.DOG);Q.stall(S,SHD,2.62,1.18,.22,.26,'#4fae5a','#4fae5a',Q.ICE);Q.stall(S,SHD,1.72,2.3,.26,.18,'#f07ab0','#f07ab0',Q.POP);
      // 入口（右前邊近南角）
      Q.archGate(S,SHD,'v',2.86,1.78,2.7);
      Q.ticket(S,SHD,2.64,1.6,.14,.16,'#1f9a8a');Q.ticket(S,SHD,2.64,2.74,.14,.16,'#d23a2e');
      Q.queue(S,2.34,2.66,[2.1,2.17,2.31,2.38],2.66+2.1);
      Q.bunting(S,[1.25,1.35],[1.25,2.85],13,2);Q.bunting(S,[2.5,1.35],[2.5,2.85],13,4);Q.bunting(S,[1.25,2.62],[2.5,2.62],13,0);
      L.tree(S,SHD,.25,.25,1,0);L.tree(S,SHD,.28,1.1,.9,2);L.tree(S,SHD,2.05,.22,1,1);L.tree(S,SHD,2.1,.85,.9,0);L.tree(S,SHD,2.05,2.85,.9,2);L.tree(S,SHD,2.78,1.18,.9,0);
      L.bush(S,1.2,.9,3);L.bush(S,2.28,.62,3);
      L.lamp2(S,1.3,1.45);L.lamp2(S,1.55,2.88);L.lamp2(S,2.5,1.45);L.lamp2(S,2.5,2.7);L.lamp2(S,.9,1.6);
      L.bench(S,1.5,1.35,true);L.bench(S,1.9,2.72,true);
      Q.balloons(S,2.3,2.2);Q.balloons(S,1.45,1.55);
      // 東角（iter20）：碰碰車館＋兩張野餐陽傘桌
      Q.bumper(S,SHD,2.5,.14,.4,.36);
      Q.table(S,SHD,2.6,.78,'#e0463a');L.bench(S,2.88,.8,false);L.bin(S,2.9,.98);
      L.hedge(S,[.05,.05],[2.95,.05],4);L.hedge(S,[.05,.05],[.05,2.95],4);L.fence(S,[.05,2.95],[2.95,2.95],[],0,'#3a4a5a');L.fence(S,[2.95,.05],[2.95,2.95],[[.58,.93]],0,'#3a4a5a');
      const walk=[...L.scatterIn(530,16,R4(1.25,1.4,1.3,1.5),(u,v)=>(u>1.45&&u<2.4&&v>1.5&&v<1.95)||(v>2.2&&v<2.5&&u>1.33&&u<2.0)),...L.scatterIn(531,10,R4(2.5,1.5,.4,1.4),(u,v)=>(v>2.05&&v<2.45&&u>2.6)),
        ...L.scatterIn(532,5,R4(.72,1.5,.24,1.3)),[2.56,.58,2],[2.64,.6,11],[2.72,.57,5],[2.82,.6,13],[2.48,.84,7],[2.72,.8,3],[2.9,.9,9],[2.78,1.02,1]];
      L.crowd(S,walk,0);
      L.lotEdge(g,'#b9a78a','#efe2cc');
    });

    // -------- v2 白色木造往返式飛車＋空中飛椅 --------
    const v2=assemble(W,H,AX,AY,SZ,(K,L,g,ng,S,SHD)=>{const{P}=K,{R4,shp}=L,Q=park(K,L);
      A.dia(g,AX,L.TOPY,96,C.pave);Q.pave(g,R4(0,0,3,3),540);
      Q.lawn(g,R4(.12,.12,2.8,.62),541);Q.lawn(g,R4(.12,.12,.4,2.8),542);Q.lawn(g,R4(1.0,1.05,.9,.28),543);Q.flowers(g,R4(1.1,1.12,.7,.12),544);
      const sz=shp(2.2,1.82,.62,.62,2,48);Q.brick(g,sz(0),545);
      Q.brick(g,[[2.0,2.95],[2.95,2.0],[2.95,2.95]],546);
      const T={main:'#7d746a',hi:'#bdb4a6',dk:'#4a3a2c',sup:'#f1e8d4',supD:'#c9bca0',lat:'#ddd1b8'};
      const ctrl=[[.62,1.5,5],[.62,1.85,5],[.62,2.15,5],[.55,2.4,6],[.4,2.5,8],[.28,2.35,10],[.28,2.1,14],[.28,1.4,38],[.28,.8,58],[.3,.55,62],[.4,.36,62],[.6,.3,58],
        [.9,.3,34],[1.1,.3,8],[1.45,.3,38],[1.8,.3,10],[2.12,.3,28],[2.4,.32,12],[2.62,.4,18],[2.74,.6,22],[2.64,.82,18],[2.35,.9,10],[2.05,.9,24],[1.75,.9,8],[1.45,.9,18],[1.15,.9,6],[.85,.96,5],[.68,1.15,5]];
      const path=Q.spline(ctrl);
      const i0=path.findIndex(p=>p[0]<.3&&p[1]<2.15),i1=path.findIndex(p=>p[2]>61);
      Q.coaster(S,SHD,path,T,{wood:1,lift:[i0,i1],train:[i0+Math.round((i1-i0)*.5),5,['#d23a2e','#f2c230']],skip:(a)=>a[2]<6});
      Q.station(S,SHD,.5,1.45,.24,.72,12,'#4fae5a');
      Q.queueV(S,1.5,2.1,[.84,.9,.96],.96+1.5+.3,'#d23a2e');
      // 空中飛椅
      Q.swings(S,SHD,2.2,1.82);
      Q.teacups(S,SHD,1.32,2.3,.28);
      Q.stall(S,SHD,1.02,1.28,.26,.18,'#3f86d0','#3f86d0',Q.ICE);Q.stall(S,SHD,1.36,1.28,.26,.18,'#e0463a','#f2c230',Q.DOG);Q.stall(S,SHD,.66,2.5,.26,.18,'#f07ab0','#f07ab0',Q.POP);
      // 南角正面入口
      Q.archF(S,SHD,[2.47,2.93],[2.93,2.47]);
      Q.ticket(S,SHD,2.26,2.66,.14,.14,'#d23a2e');Q.ticket(S,SHD,2.66,2.26,.14,.14,'#3f86d0');
      Q.bunting(S,[1.95,2.68],[2.68,1.95],14,1);Q.bunting(S,[1.0,1.5],[1.62,1.5],13,3);Q.bunting(S,[2.86,1.1],[2.86,2.1],13,5);
      L.tree(S,SHD,.9,.22,.9,0);L.tree(S,SHD,1.62,.62,1,1);L.tree(S,SHD,2.5,.62,.9,2);L.tree(S,SHD,.25,2.75,1,0);L.tree(S,SHD,1.1,2.8,1,2);L.tree(S,SHD,1.75,2.82,.9,0);
      L.bush(S,.95,.62,3);L.bush(S,2.0,.62,3);
      L.lamp2(S,1.0,1.4);L.lamp2(S,1.95,1.18);L.lamp2(S,2.35,2.35);L.lamp2(S,1.7,2.5);L.lamp2(S,2.88,1.62);L.lamp2(S,.98,2.66);
      L.bench(S,1.9,1.12,true);L.bench(S,.95,2.0,false);
      Q.balloons(S,2.05,2.5);Q.balloons(S,1.0,1.95);
      L.hedge(S,[.05,.05],[2.95,.05],4);L.hedge(S,[.05,.05],[.05,2.95],4);L.fence(S,[.05,2.95],[2.45,2.95],[],0,'#3a4a5a');L.fence(S,[2.95,.05],[2.95,2.45],[],0,'#3a4a5a');
      const walk=[...L.scatterIn(550,18,[[1.6,2.55],[2.55,1.6],[2.95,2.1],[2.1,2.95]]),...L.scatterIn(551,12,R4(1.0,1.4,1.6,1.4),(u,v)=>Math.hypot(u-2.2,v-1.82)<.58||Math.hypot(u-1.32,v-2.3)<.33),
        ...L.scatterIn(552,5,R4(.72,1.2,.25,1.5)),...L.scatterIn(553,4,R4(1.0,.6,1.6,.2))];
      L.crowd(S,walk,0);
      L.lotEdge(g,'#b9a78a','#efe2cc');
    });
    B['39_1_0']=v0;B['39_1_1']=v1;B['39_1_2']=v2;
    if(B['39_1_3'])B['39_1_3']=B['39_1_0'];if(B['39_1_4'])B['39_1_4']=B['39_1_1'];
  }catch(e){errs.push('k39: '+(e&&e.stack||e));}
});
