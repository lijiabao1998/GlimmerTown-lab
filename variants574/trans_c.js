// T612 trans_c：k17 火車站（1×1，畫布 72×112 錨 36,110）／k21 輕軌站（1×1，畫布 72×112 錨 36,110），實驗線重畫。
// 分層合成（沿用 trans_a／logi_a 的做法）：地坪（鋪面、月台、軌道、落影）直接畫在地面層；立體件走分層場景——每件各自二值化＋深色外框，
// 依深度由後往前疊；細線（人、腳踏車、電線、燈桿）走不描邊層。夜圖「先有燈具才有光」：只點白天畫出的燈具、窗、燈箱、站名牌；
// 被前景實體擋住的燈會被擦掉。光從左：+v 面亮、+u 面暗；落影向右。零亂數：只用 K.hsh 決定性雜湊。
// k17：佔地一格、不畫軌道（軌道在相鄰地塊）；三款月台一律沿左前緣（v＝1）貼齊佔地邊緣、跑滿全長，依雜湊選到哪一款都面向同一側。
// k21：三款都是單線、走格中心線 v＝.5（同遊戲輕軌地塊），從 u＝0 畫到 u＝1；深色道床上兩條鋼軌（1px 亮軌頂＋1px 深軌槽）；
// 接觸線 1px 定高 ZW、平行軌道畫到兩端格邊，電桿每側一支、伸臂垂直軌道；v0、v2 有一列低地板電車停靠（集電弓碰到接觸線）。
(window.__variants574=window.__variants574||[]).push(function trans_c(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{17:[1,2,0]}＝把 v1、v2 暫放到 v0、v1 槽位；定稿必須是 {}
  const DEV_THROW=false;   // 迭代用；定稿為 false（錯誤仍記在 window.__trans_c_errs）
  const errs=[];
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w,o.h,o.ax,o.ay]:d;};

  // ================= 共用工具（取自 trans_a LIB，刪去用不到的件、補上小站用的件）=================
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
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    // 牆上小窗：+v 面（winL，斜率 +.5）／+u 面（winR，斜率 −.5）；p 取窗左下角
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    // 拱窗：直段＋圓拱（頂排內縮 1px）
    const archL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h+1,w,h-1,.5,c);if(w>2)pg(g,p[0]+1,p[1]-h+(w>3?1:0),w-2,1,.5,c);};
    const archR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h+1,w,h-1,-.5,c);if(w>2)pg(g,p[0]+1,p[1]-h+(w>3?1:0),w-2,1,-.5,c);};
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
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#bbb7ac',s:.25,p:.6},      // 混凝土
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      q:{t:['#b2ab9c','#aca596','#b8b1a2'],j:null,s:.125,p:.7},          // 細碎石
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
      z:{t:['#d4cdbd','#cec7b7','#d9d2c2'],j:'#c6bfaf',s:.25,p:.55},     // 石材鋪面（淺暖灰）
      r:{t:['#b58f78','#ad8770','#bd9780'],j:'#a47f69',s:.125,p:.55},    // 紅磚鋪面
      s:{t:['#cbc7bd','#c6c2b8','#d0ccc2'],j:'#bfbbb1',s:.125,p:.6},      // 人行道
      t:{t:['#8e8e94','#88888e','#94949a'],j:null,s:.125,p:.6},          // 輕軌軌道鋪面（同遊戲 tramTrack 底色）
      d:{t:['#6f5640','#6a523d','#755b44'],j:null,s:.125,p:.6},          // 花圃土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0),P(a,v0+dv),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0,b),P(u0+du,b),M.j);}
      if(m==='g'){for(let i=0;i<rnd(du*dv*30);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const lineUz=(g,v,u0,u1,z,c)=>BL(g,P(u0,v,z),P(u1,v,z),c);
    const lineVz=(g,u,v0,v1,z,c)=>BL(g,P(u,v0,z),P(u,v1,z),c);
    const YEL='#d8b640',WHT='#eeece6';
    const curb=(g,u0,v0,du,dv,top='#d9d6ce')=>{boxZ(g,u0,v0,du,dv,0,1,top,'#b3aea4','#96918a');};
    const zebraV=(g,v0,v1,u0,u1)=>{for(let v=v0;v<v1-.01;v+=.07)flat(g,u0,v,u1-u0,.035,'#e8e5dc');};

    // ---------- 人、腳踏車 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const crowd=(S,pts,z,d)=>S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);person(g,p[0],p[1],k);}});
    // 腳踏車（沿 v 停放＝車身往左下）：後輪、車架、座墊、把手、前輪；col＝車架色
    const bikeV=(g,x,y,col)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,2,'#2a2d31');RC(g,x-3,y,1,2,'#2a2d31');RC(g,x-1,y-1,2,1,col);RC(g,x-2,y,1,1,col);RC(g,x,y-2,1,1,'#2a2d31');RC(g,x-3,y-1,1,1,'#8a9197');};
    // 腳踏車（沿 u 停放＝車身往右下）
    const bikeU=(g,x,y,col)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,2,'#2a2d31');RC(g,x+3,y,1,2,'#2a2d31');RC(g,x+1,y-1,2,1,col);RC(g,x+2,y,1,1,col);RC(g,x,y-2,1,1,'#2a2d31');RC(g,x+3,y-1,1,1,'#8a9197');};
    const BIKEC=['#9a3c33','#2f5580','#3a6e4a','#35393d','#8a7a52','#5c4c70'];

    // ---------- 樹、燈、車 ----------
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=2)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    // 古典燈柱（黑桿＋燈籠）
    const oldLamp=(S,u,v,h=11,z=0,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-1,3,1,'#2a2d30');RC(g,x,y-h,1,h-1,'#33383d');
      RC(g,x-1,y-h-2,3,2,'#f1e3b0');RC(g,x-1,y-h-3,3,1,'#2a2d30');RC(g,x,y-h-4,1,1,'#2a2d30');
      if(n)RC(n,x-1,y-h-2,3,2,'#ffe6a0');});
    // 現代燈桿（細桿＋平板燈頭）
    const modLamp=(S,u,v,h=13,z=0,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x,y-h,1,h,'#5d666c');RC(g,x-2,y-h-1,4,1,'#3e464b');RC(g,x-2,y-h,3,1,'#eef0e6');if(n)RC(n,x-2,y-h,3,1,'#fff2c8');});
    const CL=.23,CW=.1,CST={},SHD=[];
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const F=(pts,c)=>{x.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
        for(let y=Math.floor(ya);y<=Math.ceil(yb);y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
          xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)x.fillRect(xa,y,xb-xa+1,1);}}};
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        F([pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        F([pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        F([pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      let tx=null;if(taxi){const p=pt(CL*.47,CW*.5,4);tx=[rnd(p[0]),rnd(p[1])-1];x.fillStyle='#f6f3e4';x.fillRect(tx[0],tx[1],2,1);}
      return CST[key]={c,ox,oy,tx};};
    const car=(S,u,v,alongU,col,d,taxi)=>{const st=carStamp(alongU?'u':'v',col,taxi),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g,n)=>{g.drawImage(st.c,X0,Y0);if(n&&st.tx)RC(n,X0+st.tx[0],Y0+st.tx[1],2,1,'#fff2c0');});};

    // ---------- 站名字 ----------
    const G3=[['###','#.#','###'],['#.#','###','#.#'],['###','.#.','###'],['.##','###','##.'],['#.#','.#.','###'],['###','#..','###']];
    const G2=[['###','#.#'],['#.#','###'],['.#.','###'],['###','.#.'],['##.','.##']];
    const glyphs=(g,n,p,len,hgt,slope,fg,seed,nc='#fff4d8')=>{
      const top=X=>Math.ceil(p[1]+(X+.5-p[0])*slope-.5),x0=Math.ceil(p[0]-.5);
      const D=(X,r)=>{RC(g,X,top(X)+r,1,1,fg);if(n)RC(n,X,top(X)+r,1,1,nc);};
      if(hgt<=4){const r=Math.floor((hgt-1)/2);let x=2,k=0;while(x<len-2){const wl=2+Math.floor(hsh(seed,k,7)*3);for(let i=0;i<wl&&x<len-2;i++,x++)D(x0+x,r);x++;k++;}return;}   // 小牌：一行字＝一排短劃
      const set=hgt>=5?G3:G2,gw=3,gh=set[0].length,gap=1,pad=Math.max(1,Math.floor((hgt-gh)/2));
      let x=1;const room=len-2,nG=Math.max(0,Math.floor((room+gap)/(gw+gap))),tw=nG*(gw+gap)-gap;x+=Math.max(0,Math.floor((room-tw)/2));
      for(let k=0;k<nG;k++){const gl=set[Math.floor(hsh(seed,k,5)*set.length)];
        for(let c=0;c<gw;c++)for(let r=0;r<gh;r++)if(gl[r][c]==='#')D(x0+x+c,pad+r);x+=gw+gap;}};
    const signL=(g,v,ua,ub,za,zb,bg,fg,seed,n,nc)=>{faceL(g,v,ua,ub,za,zb,bg);glyphs(g,n,P(ua,v,zb),Math.floor((ub-ua)*32),zb-za,.5,fg,seed,nc);};
    const signR=(g,u,va,vb,za,zb,bg,fg,seed,n,nc)=>{faceR(g,u,va,vb,za,zb,bg);glyphs(g,n,P(u,vb,zb),Math.floor((vb-va)*32),zb-za,-.5,fg,seed,nc);};

    // ---------- 輕軌 ----------
    // 軌道一律走格中心線 v＝.5（同遊戲輕軌地塊），沿 u 從 0 畫到 1，相鄰地塊接得上；半軌距 .078（同遊戲 tramTrack gauge 2.8px）。
    // 道床：深色瀝青（'a'）或草皮（'g'）；每條鋼軌＝1px 亮軌頂＋其下 1px 深色軌槽，兩軌之間露出道床（不再畫三層亮線）。
    const TG=.078,TB0=.37,TB1=.63,ZW=14,WIRE='#7f878e';
    const track=(g,kind,seed,zeb)=>{
      flat(g,0,TB0,1,TB1-TB0,kind==='g'?'#56803f':'#5f5e5a');
      if(zeb)for(let v=TB0+.025;v<TB1-.03;v+=.07)flat(g,zeb[0],v,zeb[1]-zeb[0],.035,'#d6d3ca');     // 斑馬線（橫過軌道）
      lineU(g,TB0,0,1,kind==='g'?'#a29e93':'#aaa69d');lineU(g,TB1,0,1,kind==='g'?'#4a7036':'#45443f');
      for(const s of[-1,1]){const a=P(0,.5+s*TG),b=P(1,.5+s*TG);
        BL(g,[a[0],a[1]+1],[b[0],b[1]+1],kind==='g'?'#40632f':'#2a2d30');BL(g,a,b,'#dde4e9');}};
    // 架空接觸線：1px 淺灰、定高 ZW、平行軌道、畫到兩端格邊（相鄰站接得上）
    const wire=(S,d)=>S.t(d,(g)=>BL(g,P(0,.5,ZW),P(1,.5,ZW),WIRE));
    // 接觸網電桿：一支 2px 寬立柱（左亮右暗）＋垂直於軌道的水平伸臂（沿 v 伸到 v＝.5，高 ZW+1）＋懸吊點；z＝立在月台上時的底高
    const mast=(S,u,v,d,z=0)=>S.t(d!=null?d:u+v+.015,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]),H=ZW+4-z;
      RC(g,x-1,y-1,4,1,'#3b4148');RC(g,x,y-H,1,H,'#9aa3a9');RC(g,x+1,y-H,1,H,'#5a636a');RC(g,x,y-H-1,2,1,'#3b4148');
      const b=P(u,.5,ZW+1),bx=rnd(b[0]),by=rnd(b[1]);BL(g,[v<.5?x:x+1,y-(ZW+1-z)],[bx,by],'#4d555c');RC(g,bx,by,1,1,'#2b3035');});
    // 低地板電車（沿 u，停在 v＝.5）：+v 側窗帶與兩組車門、+u 端駕駛室（大前窗、頭燈、目的地顯示）、車頂設備、單臂集電弓（弓頭碰到接觸線）
    const TW=.085,TH=8,TGR='#3d9c7a',TGD='#2b775c';
    const tram=(S,u0,u1,d)=>{const v0=.5-TW,v1=.5+TW,um=(u0+u1)/2;SHD.push(['b',u0,v0,u1-u0,v1-v0,TH]);
      S.o(d,(g,n)=>{
        boxZ(g,u0,v0,u1-u0,v1-v0,0,2,null,'#30363b','#262a2e');                                   // 裙板
        boxZ(g,u0,v0,u1-u0,v1-v0,2,TH-2,'#dbe4e0',TGR,TGD);                                          // 車身＋車頂
        faceL(g,v1,u0,u1,TH-1,TH,'#eef3f0');faceL(g,v1,u0,u1,2,3,'#e8eeea');faceR(g,u1,v0,v1,2,3,'#b9c4bf');   // 白色車頂緣、腰線
        const wins=[];for(let a=u0+.025;a<u1-.035;a+=.07)wins.push([a,Math.min(a+.055,u1-.03)]);
        for(const[a,b]of wins)faceL(g,v1,a,b,4,7,'#1f3440');
        for(const[a,b]of wins){const p=P(a,v1,7);RC(g,p[0],p[1],1,1,'#6f97aa');}                   // 窗頂反光
        for(const f of[.3,.66]){const a=u0+(u1-u0)*f;faceL(g,v1,a,a+.05,3,7,'#8fb6c4');BL(g,P(a+.025,v1,3),P(a+.025,v1,6),'#3e5f6c');}   // 車門
        faceR(g,u1,v0+.012,v1-.012,4,7,'#1b2f3a');{const p=P(u1,v0+.03,6);RC(g,p[0],p[1],1,1,'#8fb4c6');}   // 大前窗
        faceR(g,u1,v0+.03,v1-.03,7,8,'#e0a838');                                                     // 目的地顯示
        const hl=[P(u1,v1-.02,3),P(u1,v0+.025,3)];for(const p of hl)RC(g,p[0],p[1],1,1,'#fff4d0');   // 頭燈
        for(const f of[.22,.7]){const a=u0+(u1-u0)*f;boxZ(g,a,.46,.08,.08,TH,1,'#c7d0cc','#dfe6e2','#a3adaa');}   // 車頂設備
        if(n){for(const[a,b]of wins)faceL(n,v1,a,b,4,7,'rgba(255,228,160,.95)');faceR(n,u1,v0+.012,v1-.012,4,7,'rgba(255,236,190,.55)');
          faceR(n,u1,v0+.03,v1-.03,7,8,'#ffc050');for(const p of hl)RC(n,p[0],p[1],1,1,'#fff8e0');}});
      S.t(d+.002,(g)=>{const c='#343a40',a=P(um-.07,.5,TH+1),b=P(um,.5,TH+4),h=P(um-.035,.5,ZW);        // 單臂集電弓（貼在車頂中段，弓頭橫跨接觸線）
        BL(g,a,b,c);BL(g,b,h,c);BL(g,P(um-.035,.44,ZW),P(um-.035,.56,ZW),'#23282c');RC(g,a[0]-1,a[1],3,1,'#596167');});};
    // 電車站牌（綠底黃 H 圓牌＋路線牌）
    const stopSign=(S,u,v,z=0,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x,y-12,1,12,'#5d666c');RC(g,x-1,y-15,3,3,'#2f8a55');RC(g,x,y-14,1,1,'#f2c230');RC(g,x-1,y-11,3,2,'#f4f2ea');RC(g,x-1,y-10,3,1,'#2f6fb3');
      if(n){RC(n,x-1,y-15,3,3,'#5fe09a');RC(n,x,y-14,1,1,'#fff09a');}});
    // 售票機（沿 u 的小箱，螢幕朝 +v）
    const ticketM=(S,u,v,z=0,d)=>S.o(d!=null?d:u+v+.04,(g,n)=>{boxZ(g,u,v,.04,.025,z,6,'#3c4a58','#4e6072','#2f3b47');
      const p=P(u+.005,v+.025,z+5);RC(g,p[0],p[1],1,2,'#9fd3e8');RC(g,p[0]+1,p[1]+1,1,1,'#e2c050');if(n){RC(n,p[0],p[1],1,2,'#bff0ff');}});

    return{P,hsh,RC,BL,fp,Q,flat,boxZ,faceL,faceR,pg,winL,winR,archL,archR,ell,scene,shadow,MATS,pave,lineU,lineV,lineUz,lineVz,YEL,WHT,curb,zebraV,
      PC,person,crowd,bikeV,bikeU,BIKEC,tree,bush,oldLamp,modLamp,car,CL,CW,SHD,signL,signR,glyphs,TG,TB0,TB1,ZW,track,wire,mast,tram,stopSign,ticketM};
  };

  // 組裝：每類一個 K、每變體獨立畫布
  const build=(k,dm,SZ,layouts)=>{const[W,H,AX,AY]=dm;const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H),order=DEV[k]||null;
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();L.SHD.length=0;
      const o=layouts[v](g,ng,S,L,K,SZ)||{};
      if(L.SHD.length)L.shadow(g,L.SHD,.28);
      A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
      S.run(g,ng);
      if(o.front)o.front(g,ng);
      ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';   // 夜光只落在白天畫出的像素上
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:false,smoke:[]});}
    if(B[k+'_1_3'])B[k+'_1_3']=B[k+'_1_0'];
    if(B[k+'_1_4'])B[k+'_1_4']=B[k+'_1_1'];};

  // ================= k17 火車站（1×1）=================
  try{
    const SZ=1;
    // 側式月台：沿 v（u∈[a0,a1]，軌側在 +u＝a1）或沿 u（v∈[a0,a1]，軌側在 +v＝a1）；高 h
    const sidePlat=(L,g,ax,a0,a1,b0,b1,h,top)=>{const {boxZ}=L;
      if(ax==='v'){boxZ(g,a0,b0,a1-a0,b1-b0,0,h,top,'#aaa59b','#8f8a80');
        L.lineVz(g,a1-.012,b0,b1,h,'#f1efe9');L.lineVz(g,a1-.05,b0+.01,b1-.01,h,L.YEL);}
      else{boxZ(g,b0,a0,b1-b0,a1-a0,0,h,top,'#aaa59b','#8f8a80');
        L.lineUz(g,a1-.012,b0,b1,h,'#f1efe9');L.lineUz(g,a1-.05,b0+.01,b1-.01,h,L.YEL);}};
    // 雙坡屋頂（脊沿 v）：外挑 oh；左坡（背光側、陡時看不到）先畫、山牆三角、右坡後畫
    const gableV=(L,g,u0,u1,v0,v1,zw,rise,oh,C)=>{const {P,fp,BL}=L,um=(u0+u1)/2,zr=zw+rise;
      fp(g,[P(u0-oh,v0-oh,zw-1),P(um,v0-oh,zr),P(um,v1+oh,zr),P(u0-oh,v1+oh,zw-1)],C.l);
      fp(g,[P(u0,v1,zw),P(u1,v1,zw),P(um,v1,zr)],C.gable);
      fp(g,[P(um,v0-oh,zr),P(u1+oh,v0-oh,zw-1),P(u1+oh,v1+oh,zw-1),P(um,v1+oh,zr)],C.r);
      if(C.rl)for(let k=1;k<3;k++){const t=k/3;BL(g,P(um+(u1+oh-um)*t,v0-oh,zr-(zr-zw+1)*t),P(um+(u1+oh-um)*t,v1+oh,zr-(zr-zw+1)*t),C.rl);}
      BL(g,P(u0-oh,v1+oh,zw-1),P(um,v1+oh,zr),C.barge);BL(g,P(um,v1+oh,zr),P(u1+oh,v1+oh,zw-1),C.barge);
      BL(g,P(um,v0-oh,zr),P(um,v1+oh,zr),C.ridge);return{um,zr};};
    // 雙坡屋頂（脊沿 u）：後坡先畫、+u 山牆三角、前坡（受光）後畫
    const gableU=(L,g,u0,u1,v0,v1,zw,rise,oh,C)=>{const {P,fp,BL}=L,vm=(v0+v1)/2,zr=zw+rise;
      fp(g,[P(u0-oh,v0-oh,zw-1),P(u1+oh,v0-oh,zw-1),P(u1+oh,vm,zr),P(u0-oh,vm,zr)],C.r);
      fp(g,[P(u1,v0,zw),P(u1,v1,zw),P(u1,vm,zr)],C.gable);
      fp(g,[P(u0-oh,vm,zr),P(u1+oh,vm,zr),P(u1+oh,v1+oh,zw-1),P(u0-oh,v1+oh,zw-1)],C.l);
      if(C.ll)for(let k=1;k<3;k++){const t=k/3;BL(g,P(u0-oh,vm+(v1+oh-vm)*t,zr-(zr-zw+1)*t),P(u1+oh,vm+(v1+oh-vm)*t,zr-(zr-zw+1)*t),C.ll);}
      BL(g,P(u1+oh,v0-oh,zw-1),P(u1+oh,vm,zr),C.barge);BL(g,P(u1+oh,vm,zr),P(u1+oh,v1+oh,zw-1),C.barge);
      BL(g,P(u0-oh,vm,zr),P(u1+oh,vm,zr),C.ridge);BL(g,P(u0-oh,v1+oh,zw-1),P(u1+oh,v1+oh,zw-1),C.eave||SH(C.l,-22));return{vm,zr};};
    // 鋸齒簷板：+v 面（valL）／+u 面（valR），下緣隔一像素多掛一格
    const valL=(L,g,v,ua,ub,za,zb,c)=>{L.faceL(g,v,ua,ub,za,zb,c);const a=L.P(ua,v,za),b=L.P(ub,v,za);
      for(let X=Math.ceil(a[0]-.5)+1;X<=Math.ceil(b[0]-.5)-2;X+=2){const y=Math.ceil(a[1]+(X+.5-a[0])*.5-.5);L.RC(g,X,y,1,1,c);}};
    const valR=(L,g,u,va,vb,za,zb,c)=>{L.faceR(g,u,va,vb,za,zb,c);const a=L.P(u,vb,za),b=L.P(u,va,za);
      for(let X=Math.ceil(a[0]-.5)+1;X<=Math.ceil(b[0]-.5)-2;X+=2){const y=Math.ceil(a[1]-(X+.5-a[0])*.5-.5);L.RC(g,X,y,1,1,c);}};
    // 圓鐘（5px）
    const clock5=(L,g,n,p)=>{const x=rnd(p[0]),y=rnd(p[1]);L.ell(g,x,y,2,2,'#3a2d24');L.RC(g,x-1,y-1,3,3,'#f4efe0');L.RC(g,x,y-1,1,2,'#22262a');L.RC(g,x+1,y,1,1,'#22262a');
      if(n){L.RC(n,x-1,y-1,3,3,'#fff1cc');L.RC(n,x,y-1,1,2,'#6a5a3a');}};

    const K17=[
      // v0 紅磚站房＋木雨棚：月台沿左前緣（v＝1）全長；兩層紅磚站房長邊面向月台（石板瓦雙坡、兩支煙囪），
      // 左段凸出一座山形門樓（大拱門、拱窗、山牆圓鐘）；右段掛單坡木雨棚（鑄鐵柱、奶油色鋸齒簷板、簷板上的站名牌、棚燈）蓋住月台；
      // 月台左段露天（燈柱、長椅），候車的人沿月台邊；右側石鋪站前廣場在站房山牆前（牆下長椅、腳踏車架、郵筒、樹、燈）。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,RC,BL,boxZ,faceL,faceR,archL,archR,crowd,oldLamp,tree,car,signL,bikeU,BIKEC}=L;
        pave(g,'c',0,0,1,1,1701);
        pave(g,'z',.68,0,.32,.62,1702);
        sidePlat(L,g,'u',.64,1,0,1,3,'#d3d0c8');
        L.shadow(g,[['b',.06,.16,.58,.34,24],['b',.1,.44,.2,.1,26],['b',.34,.5,.63,.42,2,10]]);
        // ---- 站前廣場（站房 +u 山牆前）：只留一張長椅與腳踏車架，其餘是石鋪空地 ----
        S.o(1.19,(g2)=>{boxZ(g2,.69,.2,.03,.12,0,2,'#8a5a3a','#9c6a45','#6f4a30');});                           // 山牆下長椅
        S.t(1.2,(g2)=>{BL(g2,P(.915,.07,2),P(.915,.31,2),'#9aa2a8');for(let i=0;i<4;i++){const p=P(.92,.1+i*.06);bikeU(g2,p[0],p[1],BIKEC[i%BIKEC.length]);}});
        // ---- 站房 ----
        const u0=.06,u1=.64,v0=.18,v1=.5,Hh=21,BR='#a9543d',BRd='#7c3b2c',CR='#eadfc4',CRd='#b9ab8c',GL='#34495a',NL='#ffe0a0';
        S.o(1.18,(g2,n2)=>{
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,Hh,null,BR,BRd);
          faceL(g2,v1,u0,u1,0,2,'#8e8474');faceR(g2,u1,v0,v1,0,2,'#6e665a');                                  // 石基座
          faceL(g2,v1,u0,u1,11,12,CR);faceR(g2,u1,v0,v1,11,12,CRd);                                          // 腰線（雨棚掛在這條上）
          faceL(g2,v1,u0,u1,Hh-1,Hh,CR);faceR(g2,u1,v0,v1,Hh-1,Hh,CRd);                                      // 簷口
          faceR(g2,u1,v1-.02,v1,2,Hh,CRd);faceR(g2,u1,v0,v0+.02,2,Hh,CRd);                                  // 隅柱
          // 二樓拱窗（一樓在雨棚下）
          for(const u of[.37,.51]){archL(g2,u,v1,13,3,6,GL);archL(g2,u,v1,13,3,1,CR);if(n2)archL(n2,u,v1,14,3,5,NL);}
          // 山牆端（暗面、朝廣場）：拱門、窗、二樓窗
          archR(g2,u1,.39,2,3,8,'#3a2d24');if(n2)archR(n2,u1,.39,3,3,6,'#ffcf80');
          for(const v of[.48,.28]){archR(g2,u1,v,3,3,6,'#2c3d4b');if(n2)archR(n2,u1,v,3,3,6,'#f0c77e');}
          for(const v of[.45,.31]){archR(g2,u1,v,13,3,6,'#2c3d4b');if(n2&&v>.4)archR(n2,u1,v,13,3,6,'#f0c77e');}
          // 屋頂：石板瓦雙坡（脊沿 u）
          const r=gableU(L,g2,u0,u1,v0,v1,Hh,7,.03,{l:'#66717b',r:'#4b545d',ll:'#58636c',gable:BRd,barge:'#efe6cf',ridge:'#8c979f',eave:'#4a535b'});
          {const p=P(u1,r.vm,Hh+3),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x-1,y-1,3,2,CRd);RC(g2,x,y-1,1,2,'#2c3d4b');if(n2)RC(n2,x,y-1,1,2,'#f0c77e');}
          for(const cu of[.2,.52]){boxZ(g2,cu,r.vm-.02,.06,.06,Hh+5,6,'#8f4634',BR,BRd);boxZ(g2,cu-.005,r.vm-.025,.07,.07,Hh+11,1,'#6d6a66','#d8cdb3','#a89c82');}
          // 山形門樓（凸出 .04，山牆朝 +v）
          const pu0=.1,pu1=.3,pv0=v1-.12,pv1=v1+.04,pm=(pu0+pu1)/2;
          boxZ(g2,pu0,pv0,pu1-pu0,pv1-pv0,0,Hh,null,BR,BRd);
          faceL(g2,pv1,pu0,pu1,0,2,'#8e8474');faceL(g2,pv1,pu0,pu1,11,12,CR);faceL(g2,pv1,pu0,pu1,Hh-1,Hh,CR);
          faceL(g2,pv1,pu0,pu0+.025,2,Hh,CR);faceL(g2,pv1,pu1-.025,pu1,2,Hh,CR);faceR(g2,pu1,pv0,pv1,0,Hh,BRd);
          faceR(g2,pu1,pv1-.02,pv1,2,Hh,CRd);
          archL(g2,pm-.045,pv1,2,3,9,'#3a2d24');BL(g2,P(pm-.045,pv1,6),P(pm+.03,pv1,6),'#6f93ab');
          if(n2)archL(n2,pm-.045,pv1,2,3,9,'#ffcf80');
          archL(g2,pm-.045,pv1,13,3,6,GL);if(n2)archL(n2,pm-.045,pv1,13,3,6,NL);
          gableV(L,g2,pu0,pu1,pv0,pv1,Hh,8,.02,{l:'#66717b',r:'#4b545d',rl:null,gable:BR,barge:'#efe6cf',ridge:'#8c979f'});
          BL(g2,P(pu0,pv1,Hh),P(pu1,pv1,Hh),CR);
          clock5(L,g2,n2,P(pm,pv1,Hh+3));
        });
        // ---- 單坡木雨棚（貼站房受光面、蓋月台右段）：波浪板＋隔間採光玻璃 ----
        const cu0=.34,cu1=.97,cv0=.5,cv1=.88,zi=11,zo=9;
        S.o(1.85,(g2,n2)=>{
          for(const u of[.42,.6,.78,.94]){const p=P(u,.84,3);RC(g2,p[0],p[1]-4,1,4,'#2f4a3c');RC(g2,p[0]-1,p[1]-4,3,1,'#2f4a3c');}   // 鑄鐵柱＋托架
          const zAt=v=>zi+(zo-zi)*(v-cv0)/(cv1-cv0);
          fp(g2,[P(cu0,cv0,zi),P(cu1,cv0,zi),P(cu1,cv1,zo),P(cu0,cv1,zo)],'#727d77');
          for(let u=cu0+.05;u<cu1-.01;u+=.05)BL(g2,P(u,cv0,zi),P(u,cv1,zo),'#67726c');                                // 波浪板縫
          {const ga=.6,gb=.74;fp(g2,[P(cu0+.02,ga,zAt(ga)),P(cu1-.02,ga,zAt(ga)),P(cu1-.02,gb,zAt(gb)),P(cu0+.02,gb,zAt(gb))],'#a9bfbd');   // 中央採光玻璃帶
            for(let u=cu0+.07;u<cu1-.03;u+=.07)BL(g2,P(u,ga,zAt(ga)),P(u,gb,zAt(gb)),'#7f9593');
            BL(g2,P(cu0+.02,ga,zAt(ga)),P(cu1-.02,ga,zAt(ga)),'#d9e6e4');}
          BL(g2,P(cu0,cv0+.01,zi),P(cu1,cv0+.01,zi),'#4f5a54');
          fp(g2,[P(cu1,cv0,zi),P(cu1,cv1,zo),P(cu1,cv1,zo-2),P(cu1,cv0,zi-2)],'#cbbfa2');valR(L,g2,cu1,cv1-.02,cv1,zo-2,zo,'#cbbfa2');
          {const a=P(cu1,cv1,zo-2),b=P(cu1,cv0,zi-2);for(let X=Math.ceil(a[0]-.5)+1;X<Math.ceil(b[0]-.5)-1;X+=2){const t=(X+.5-a[0])/(b[0]-a[0]),y=Math.ceil(a[1]+(b[1]-a[1])*t-.5);RC(g2,X,y,1,1,'#cbbfa2');}}
          valL(L,g2,cv1,cu0,cu1,zo-2,zo,'#efe5cc');BL(g2,P(cu0,cv1,zo),P(cu1,cv1,zo),'#fbf6e8');
          signL(g2,cv1+.004,.56,.8,6,9,'#233a52','#f0e2b8',1705,n2,'#ffeebb');
          for(const u of[.38,.46,.84,.92]){const p=P(u,cv1,zo-2);RC(g2,p[0],p[1]+1,1,1,'#2f3437');RC(g2,p[0],p[1]+2,1,1,'#f3e7bf');if(n2)RC(n2,p[0],p[1]+2,1,1,'#ffe9a8');}   // 棚緣吊燈
        });
        // ---- 月台：露天段燈柱、長椅；候車的人 ----
        oldLamp(S,.05,.9,11,3,1.5);
        S.o(1.45,(g2)=>{boxZ(g2,.14,.72,.13,.03,3,2,'#8a5a3a','#9c6a45','#6f4a30');});
        crowd(S,[[.2,.8,0],[.26,.9,3],[.12,.97,5],[.44,.95,1],[.52,.97,6],[.7,.94,2],[.86,.96,7]],3,1.95);
      },
      // v1 現代玻璃站廳＋鋼雨棚：月台沿左前緣（v＝1）全長（三款同一邊）；平頂玻璃站廳退到右後方，長邊玻璃立面朝月台
      // （懸浮屋頂板、木格柵服務核與站徽、立面發車看板、屋頂太陽能板、兩道自動門）；左後方是站前廣場（導盲磚、腳踏車架、樹穴、長椅、藍色站名塔）；
      // 月台右段一列細鋼柱撐起薄平板鋼雨棚（中央採光帶、棚緣燈點），左段露天、立一盞現代燈桿。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,RC,BL,boxZ,faceL,faceR,pg,crowd,modLamp,tree,bush,signL,ell,bikeV,BIKEC,ticketM}=L;
        pave(g,'c',0,0,1,1,1711);
        pave(g,'s',0,.06,.42,.66,1712);
        pave(g,'g',.42,0,.58,.1,1713);pave(g,'g',0,0,.42,.06,1714);
        flat(g,.22,.34,.025,.38,'#d9c25a');flat(g,.22,.34,.24,.025,'#d9c25a');flat(g,.44,.34,.025,.2,'#d9c25a');flat(g,.44,.52,.3,.025,'#d9c25a');                            // 導盲磚：站廳門口→廣場→月台
        sidePlat(L,g,'u',.72,1,0,1,3,'#cfd1d2');
        L.shadow(g,[['b',.46,.14,.48,.36,14],['b',.2,.8,.54,.18,1,11]]);
        bush(S,.56,.05,2);bush(S,.86,.05,2);
        // ---- 站前廣場：後緣腳踏車架、樹穴、長椅、站名塔 ----
        S.t(.4,(g2)=>{BL(g2,P(.06,.13,2),P(.34,.13,2),'#9aa2a8');for(let i=0;i<5;i++){const p=P(.08+i*.055,.15);bikeV(g2,p[0]+2,p[1],BIKEC[(i+1)%BIKEC.length]);}});
        S.o(.84,(g2)=>{boxZ(g2,.05,.34,.1,.1,0,1,'#9a958b','#b9b4aa','#8a857c');});
        tree(S,.1,.39,.8,2);
        S.o(.97,(g2)=>{boxZ(g2,.26,.5,.12,.03,0,2,'#8a5a3a','#9c6a45','#6f4a30');});
        S.o(1.3,(g2,n2)=>{boxZ(g2,.05,.62,.035,.03,0,16,'#1f4f8a','#2a64a8','#1a3f6e');const p=P(.05,.65,14),x=rnd(p[0]),y=rnd(p[1]);
          ell(g2,x+1,y,1,1,'#f4f4f2');RC(g2,x+1,y,1,1,'#2a64a8');if(n2){ell(n2,x+1,y,1,1,'#ffffff');}
          const q=P(.05,.65,10);pg(g2,q[0],q[1]-1,2,1,.5,'#e6eef4');if(n2)pg(n2,q[0],q[1]-1,2,1,.5,'#ffffff');});
        // ---- 玻璃站廳（右後方，長邊沿 u、玻璃立面朝月台）----
        S.o(1.15,(g2,n2)=>{const u0=.46,u1=.94,v0=.14,v1=.5,Hh=12;
          faceL(g2,v1,u0,u1,0,Hh,'#9fc4d6');faceR(g2,u1,v0,v1,0,Hh,'#6a8fa5');
          faceL(g2,v1,u0,u1,0,1,'#5c6e78');faceR(g2,u1,v0,v1,0,1,'#46555e');
          faceL(g2,v1,u0+.14,u1-.06,2,3,'#6f8d9e');                                                          // 室內長椅（隔玻璃）
          for(const[u,c]of[[.62,'#4f6878'],[.66,'#6b5a6a'],[.86,'#5a6b55']]){const p=P(u,v1,1);RC(g2,p[0],p[1]-4,1,3,c);RC(g2,p[0],p[1]-5,1,1,'#9c8a78');}
          {const p=P(u0,v1,Hh),len=Math.floor((u1-u0)*32);for(let x=4;x<len;x+=4){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5);RC(g2,X,Y+1,1,Hh-1,'#e9eff2');}}
          BL(g2,P(u0,v1,8),P(u1,v1,8),'#e9eff2');
          {const p=P(u1,v1,Hh),len=Math.floor((v1-v0)*32);for(let x=4;x<len;x+=4){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5);RC(g2,X,Y+1,1,Hh-1,'#a9b8c2');}}
          BL(g2,P(u1,v0,8),P(u1,v1,8),'#a9b8c2');
          for(const u of[.62,.8])BL(g2,P(u,v1,9),P(u+.03,v1,11),'#d8ecf4');
          faceL(g2,v1,.7,.76,1,7,'#2f4656');BL(g2,P(.73,v1,1),P(.73,v1,7),'#8fa6b4');                     // 自動門（朝廣場／月台）
          faceR(g2,u1,.3,.38,1,7,'#2f4656');BL(g2,P(u1,.34,1),P(u1,.34,7),'#8fa6b4');
          boxZ(g2,u0,v0,.11,v1-v0+.004,0,Hh,null,'#b27d4c',null);                                          // 木格柵服務核（站徽）
          {const p=P(u0,v1+.004,Hh);for(let x=1;x<4;x+=2){RC(g2,rnd(p[0])+x,rnd(p[1])+Math.floor(x*.5)+1,1,Hh-1,'#946338');}}
          {const p=P(u0+.055,v1+.004,7),x=rnd(p[0]),y=rnd(p[1]);ell(g2,x,y,1,1,'#f4f4f2');RC(g2,x,y,1,1,'#c8352c');if(n2)ell(n2,x,y,1,1,'#fff4e8');}
          {const p=P(.74,v1+.005,10);pg(g2,p[0],p[1]-2,5,2,.5,'#1d2328');pg(g2,p[0]+1,p[1]-2,3,1,.5,'#f0a830');if(n2)pg(n2,p[0]+1,p[1]-2,3,1,.5,'#ffc050');}
          if(n2){faceL(n2,v1,u0+.12,u1-.01,2,8,'rgba(255,226,160,.9)');faceR(n2,u1,v0+.02,v1-.02,2,8,'rgba(243,214,142,.85)');}
          boxZ(g2,u0-.02,v0-.02,u1-u0+.04,v1-v0+.04,Hh,2,'#cdd2d5','#f3f5f6','#b3bcc2');                    // 懸浮屋頂板（下緣木紋）＋太陽能板
          faceL(g2,v1+.02,u0-.02,u1+.02,Hh,Hh+1,'#c08a58');faceR(g2,u1+.02,v0-.02,v1+.02,Hh,Hh+1,'#9a6a40');
          for(let i=0;i<4;i++)boxZ(g2,u0+.04+i*.11,v0+.04,.085,.2,Hh+2,1,'#2f5878','#4a78a0','#244660');
          for(let i=0;i<4;i++)BL(g2,P(u0+.04+i*.11,v0+.14,Hh+3),P(u0+.125+i*.11,v0+.14,Hh+3),'#6a96b8');
          signL(g2,v1+.02,u0+.14,u1-.02,Hh,Hh+2,'#23303b','#f2f2ec',1715,n2,'#ffffff');
        });
        ticketM(S,.8,.505,0,1.2);ticketM(S,.84,.505,0,1.21);
        crowd(S,[[.2,.28,4],[.3,.44,7],[.36,.6,1],[.7,.62,8],[.84,.58,3]],0,1.5);
        // ---- 鋼雨棚（沿 u，蓋月台右段）：單列細鋼柱、薄平板、中央採光帶、棚緣燈點 ----
        S.o(1.81,(g2,n2)=>{const u0=.2,u1=.74,v0=.8,v1=.98,z=11;
          for(const u of[.28,.48,.68]){const p=P(u,.89,3);RC(g2,p[0],p[1]-(z-3),1,z-3,'#6b757c');RC(g2,p[0]+1,p[1]-(z-3),1,z-3,'#4b545b');}
          boxZ(g2,u0,v0,u1-u0,v1-v0,z,2,'#c9ced2','#eef1f3','#9aa3aa');
          flat(g2,u0+.03,.86,u1-u0-.06,.06,'#9fc0d0',z+2);
          for(let u=u0+.08;u<u1-.03;u+=.08)BL(g2,P(u,.86,z+2),P(u,.92,z+2),'#e3ecf0');
          for(let u=u0+.05;u<u1-.03;u+=.1){const p=P(u,v1,z);RC(g2,p[0],p[1],1,1,'#f6f1d8');if(n2)RC(n2,p[0],p[1],1,1,'#fff4cc');}
        });
        modLamp(S,.08,.9,13,3,1.9);
        crowd(S,[[.2,.94,0],[.3,.9,3],[.52,.95,5],[.64,.92,1],[.8,.96,6],[.9,.9,2]],3,1.97);
      },
      // v2 石造鄉村小站＋花圃：月台沿左前緣（v＝1）全長，白色月台邊線與黃色導盲磚跑滿全長（含左段雨棚下）；一層石屋長邊朝月台
      // （陡石板瓦雙坡、小煙囪、山形小門廊、白框拱窗與花箱、牆邊長椅），屋前只留碎石小徑與右側一塊花圃（花成三叢），門與一樓前牆完整露出；
      // 月台前緣右段一面雙柱白底站名牌（深色字帶），左段木造雙坡小雨棚（木柱、長椅、簷下吊燈）；右側草地腳踏車架與後角大樹，左側小樹。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,RC,BL,boxZ,faceL,faceR,winL,winR,archL,archR,crowd,oldLamp,tree,bush,signL,bikeU,BIKEC}=L;
        pave(g,'q',0,0,1,1,1721);
        pave(g,'g',.76,0,.24,.68,1724);pave(g,'g',0,0,.28,.68,1725);
        // 花圃：土＋三叢花（每叢一團綠葉托幾朵花，叢與叢之間留土）
        const bed=(u0,v0,du,dv,clumps)=>{flat(g,u0,v0,du,dv,'#6f5640');BL(g,P(u0,v0+dv),P(u0+du,v0+dv),'#9c9280');BL(g,P(u0+du,v0),P(u0+du,v0+dv),'#8c8270');
          for(const[cu,cv,a,b]of clumps){const p=P(cu,cv),x=rnd(p[0]),y=rnd(p[1]);
            RC(g,x-2,y-1,5,2,'#4f7f35');RC(g,x-1,y-2,3,1,'#5f9140');RC(g,x-1,y-2,1,1,a);RC(g,x+1,y-2,1,1,b);RC(g,x,y-3,1,1,a);RC(g,x-2,y-1,1,1,b);RC(g,x+2,y,1,1,a);}};
        bed(.61,.5,.13,.14,[[.64,.55,'#e0483a','#f2c230'],[.71,.56,'#f5f0f2','#c04a8a'],[.66,.62,'#ee8a3a','#e0483a']]);
        flat(g,.47,.46,.12,.26,'#cdc4b0');for(let v=.5;v<.72;v+=.05)BL(g,P(.47,v),P(.59,v),'#b5ac98');
        sidePlat(L,g,'u',.72,1,0,1,3,'#c9c2b0');
        L.shadow(g,[['b',.3,.14,.44,.3,19],['b',.47,.42,.12,.08,11],['b',.08,.75,.24,.14,2,11],['b',.49,.95,.41,.01,4,7]]);
        // ---- 左側小樹、右側大樹與腳踏車架 ----
        tree(S,.08,.3,.85,1);bush(S,.2,.6,2);
        tree(S,.92,.1,1.0,0);
        S.t(1.2,(g2)=>{BL(g2,P(.84,.46,2),P(.84,.66,2),'#9aa2a8');for(let i=0;i<4;i++){const p=P(.85,.48+i*.055);bikeU(g2,p[0],p[1],BIKEC[i%BIKEC.length]);}});
        // ---- 石屋 ----
        const u0=.3,u1=.74,v0=.14,v1=.44,Hh=10,ST='#c2b9a6',STd='#938a79';
        S.o(1.18,(g2,n2)=>{
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,Hh,null,ST,STd);
          for(let z=3,r=0;z<Hh;z+=3,r++){BL(g2,P(u0,v1,z),P(u1,v1,z),'#aea592');BL(g2,P(u1,v0,z),P(u1,v1,z),'#827a6b');
            for(let u=u0+.04+(r%2)*.05;u<u1-.02;u+=.1)BL(g2,P(u,v1,z-2),P(u,v1,z-1),'#aea592');
            for(let v=v0+.04+(r%2)*.05;v<v1-.02;v+=.1)BL(g2,P(u1,v,z-2),P(u1,v,z-1),'#827a6b');}
          faceL(g2,v1,u0,u1,0,1,'#8a8272');faceR(g2,u1,v0,v1,0,1,'#6c6558');
          faceL(g2,v1,u0,u0+.02,1,Hh,'#d8d0bd');faceL(g2,v1,u1-.02,u1,1,Hh,'#d8d0bd');
          // 白框拱窗＋花箱
          for(const u of[u0+.05,u1-.13]){archL(g2,u,v1,2,4,7,'#f1ede2');archL(g2,u+.03,v1,3,2,5,'#34495a');
            if(n2)archL(n2,u+.03,v1,3,2,5,'#ffd890');
            winL(g2,u,v1,1,4,1,'#7a5236');const f=P(u,v1,2);RC(g2,f[0],f[1]-1,1,1,'#e0483a');RC(g2,f[0]+2,f[1],1,1,'#f2c230');RC(g2,f[0]+3,f[1],1,1,'#c04a8a');}
          archR(g2,u1,(v0+v1)/2+.06,2,3,6,'#f1ede2');archR(g2,u1,(v0+v1)/2+.03,3,1,4,'#2c3d4b');
          if(n2)archR(n2,u1,(v0+v1)/2+.03,3,1,4,'#f0c77e');
          // 陡石板瓦雙坡（脊沿 u）＋山牆（圓窗）
          const r=gableU(L,g2,u0,u1,v0,v1,Hh,10,.04,{l:'#707b85',r:'#59636c',ll:'#626d76',gable:STd,barge:'#f0ece0',ridge:'#8c979f',eave:'#4f5961'});
          for(let z=Hh+3;z<Hh+8;z+=3)BL(g2,P(u1,v0+.05,z),P(u1,v1-.05,z),'#827a6b');
          {const p=P(u1,r.vm,Hh+5),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x-1,y-1,3,2,'#f1ede2');RC(g2,x,y-1,1,2,'#2c3d4b');}
          boxZ(g2,u0+.06,r.vm-.03,.05,.05,Hh+8,5,'#a9a08d',ST,STd);boxZ(g2,u0+.07,r.vm-.02,.03,.03,Hh+13,1,'#7a4a3a','#b0654a','#8a4a38');
          // 山形小門廊（山牆朝 +v）
          const pu0=.47,pu1=.59,pv1=v1+.07;
          boxZ(g2,pu0,v1-.01,pu1-pu0,pv1-v1+.01,0,7,null,'#e9e2d0','#b9b09c');
          faceL(g2,pv1,pu0+.025,pu1-.025,0,6,'#5a3e2a');faceL(g2,pv1,pu0+.04,pu1-.04,1,5,'#6d4c34');
          if(n2)faceL(n2,pv1,pu0+.035,pu1-.035,1,5,'#ffcf80');
          gableV(L,g2,pu0,pu1,v1-.03,pv1,7,4,.02,{l:'#707b85',r:'#59636c',rl:null,gable:'#e9e2d0',barge:'#f7f4ea',ridge:'#8c979f'});
          {const p=P((pu0+pu1)/2,pv1,6);RC(g2,p[0],p[1]-1,1,1,'#fff3c8');if(n2)RC(n2,p[0]-1,p[1]-1,3,2,'#ffe6a0');}
          // 牆邊長椅
          boxZ(g2,.63,v1,.08,.025,1,1,'#8a5a3a','#9c6a45','#6f4a30');
        });
        // ---- 月台左段木造雙坡小雨棚：木柱、長椅、吊燈 ----
        S.o(1.6,(g2,n2)=>{const a0=.08,a1=.32,b0=.75,b1=.89,z=3,zc=10,WD='#7a5236';
          for(const u of[a0+.02,a1-.02])for(const v of[b0+.02,b1-.02]){const p=P(u,v,z);RC(g2,p[0],p[1]-(zc-z),1,zc-z,WD);}
          boxZ(g2,a0+.04,b0+.02,a1-a0-.08,.025,z+2,1,'#9c7a52','#a8845a','#7a5c3c');
          {const p=P(a0+.1,b0+.05,z);L.person(g2,p[0],p[1],3);}
          gableU(L,g2,a0,a1,b0,b1,zc,4,.02,{l:'#8a5a3a',r:'#6f4a30',ll:'#7a4f33',gable:'#6b4a30',barge:'#efe6cf',ridge:'#a87a50',eave:'#5a3a24'});
          {const q=P((a0+a1)/2,b1+.02,zc-1);RC(g2,q[0],q[1]+1,1,1,'#2f3437');RC(g2,q[0],q[1]+2,1,1,'#f3e7bf');if(n2)RC(n2,q[0],q[1]+2,1,1,'#ffe6a0');}});
        // ---- 月台前緣站名牌：兩根黑柱撐一面白底牌，中間一條深色字帶 ----
        S.o(1.9,(g2,n2)=>{const ua=.49,ub=.9,v=.955,z=3,zb=7,zt=11;
          for(const u of[ua+.04,ub-.04]){const p=P(u,v,z);RC(g2,p[0],p[1]-(zb-z),1,zb-z,'#2f3437');}
          faceL(g2,v,ua,ub,zb,zt,'#f6f4ec');faceL(g2,v,ua,ub,zb,zb+1,'#c9c3b5');
          // 字帶：兩列高的字形（3×2），置中；牌上下各留一列白
          const G=[['###','#.#'],['#.#','###'],['.#.','###'],['###','.#.'],['##.','.##'],['#.#','.#.']],p=P(ua,v,zt),len=Math.floor((ub-ua)*32);
          const top=X=>Math.ceil(p[1]+(X+.5-p[0])*.5-.5),x0=Math.ceil(p[0]-.5),nG=Math.floor((len-1)/4);let x=1+Math.floor((len-2-(nG*4-1))/2);
          for(let k=0;k<nG;k++,x+=4){const gl=G[Math.floor(L.hsh(1727,k,5)*G.length)];for(let c=0;c<3;c++)for(let r=0;r<2;r++)if(gl[r][c]==='#')RC(g2,x0+x+c,top(x0+x+c)+1+r,1,1,'#1c2329');}
        });
        // ---- 月台：候車的人（前角不放高物件，免得擋住屋前小徑與門廊）----
        crowd(S,[[.2,.96,5],[.34,.95,2],[.47,.93,6],[.94,.95,4],[.78,.84,0]],3,1.95);
      },
    ];
    build(17,dims(17,[72,112,36,110]),SZ,K17);
  }catch(e){console.error('trans_c k17',e);errs.push('k17:'+(e&&e.stack||e));}

  // ================= k21 輕軌站（1×1）=================
  try{
    const SZ=1;
    // 低月台（沿 u）：v∈[a0,a1]、u∈[b0,b1]、高 2；軌側邊（side：-1＝v0 側、+1＝v1 側、0＝兩側）白線＋導盲磚
    const lowPlat=(L,g,a0,a1,b0,b1,side,top='#cfcdc6')=>{L.boxZ(g,b0,a0,b1-b0,a1-a0,0,2,top,'#a9a59c','#8d897f');
      if(side<=0){L.lineUz(g,a0+.012,b0,b1,2,'#f1efe9');L.lineUz(g,a0+.045,b0+.01,b1-.01,2,L.YEL);}
      if(side>=0){L.lineUz(g,a1-.012,b0,b1,2,'#f1efe9');L.lineUz(g,a1-.045,b0+.01,b1-.01,2,L.YEL);}};
    // 坡道（沿 u，由 b0 高 2 降到 b1 地面）
    const ramp=(L,g,a0,a1,b0,b1)=>{const {P,fp}=L;fp(g,[P(b0,a0,2),P(b1,a0,0),P(b1,a1,0),P(b0,a1,2)],'#c2bfb7');fp(g,[P(b0,a1,0),P(b1,a1,0),P(b0,a1,2)],'#a9a59c');};
    // 玻璃候車亭（沿 u）：open＝+1 開口朝 +v（背牆 v0 在後、看得到亭內）、-1 開口朝 −v（背牆 v1 在前）
    // 玻璃只畫框、頂部色帶與斜向反光（中間透空＝看得到後面）；+u 端是廣告燈箱；roof：'flat'｜'arc'
    const shelter=(S,L,u0,u1,v0,v1,z,open,roof,seed,d)=>{const {P,RC,BL,fp,boxZ,faceR,pg,hsh,person}=L,zr=z+7,FR='#56616a',GLS='#e4f1f6',TNT='#a8c6d4';
      const glassL=(g,v)=>{BL(g,P(u0,v,zr-1),P(u1,v,zr-1),TNT);BL(g,P(u0,v,zr-2),P(u1,v,zr-2),TNT);BL(g,P(u0,v,z+1),P(u1,v,z+1),FR);
        for(let u=u0+.1;u<u1-.03;u+=.1)BL(g,P(u,v,z+1),P(u,v,zr-1),FR);
        for(let u=u0+.04;u<u1-.06;u+=.1)BL(g,P(u,v,z+3),P(u+.03,v,zr-3),GLS);};
      const glassR=(g,u)=>{BL(g,P(u,v0,zr-1),P(u,v1,zr-1),TNT);BL(g,P(u,v0,zr-2),P(u,v1,zr-2),TNT);BL(g,P(u,v0,z+1),P(u,v1,z+1),FR);BL(g,P(u,v1-.03,z+3),P(u,v1-.06,zr-3),GLS);};
      const bv=open>0?v0+.015:v1-.04;
      const inner=(g)=>{boxZ(g,u0+.05,bv,u1-u0-.1,.025,z+2,1,'#8a6a4a','#9c7a55','#6f5236');
        const k0=Math.floor(hsh(seed,1,1)*9);for(let i=0;i<2;i++){const p=P(u0+.09+i*.13+hsh(seed,i,2)*.03,bv+.03,z);person(g,p[0],p[1],k0+i*4);}};
      S.t(d-.004,(g)=>{if(open>0)glassL(g,v0);glassR(g,u0);inner(g);if(open<0)glassL(g,v1);
        for(const u of[u0,u1])for(const v of[v0,v1]){if(u===u1)continue;const p=P(u,v,z);RC(g,p[0],p[1]-7,1,7,FR);}});
      S.o(d,(g,n)=>{faceR(g,u1,v0,v1,z,zr,'#e9e4d6');faceR(g,u1,v0+.012,v1-.012,z+1,zr-1,['#d9534a','#3a7fc4','#e0a93a','#4aa36a'][seed%4]);
        {const p=P(u1,v1-.02,z+4);pg(g,p[0],p[1]-2,2,2,-.5,'#f6f2e4');}
        if(n)faceR(n,u1,v0+.012,v1-.012,z+1,zr-1,'rgba(255,244,214,.95)');
        if(roof==='arc'){const N=6,a0=v0-.03,a1=v1+.03,Z=i=>zr+Math.round(2.6*Math.sin(Math.PI*i/N));
          for(let i=0;i<N;i++){const t0=a0+(a1-a0)*i/N,t1=a0+(a1-a0)*(i+1)/N;fp(g,[P(u0-.02,t0,Z(i)),P(u1+.02,t0,Z(i)),P(u1+.02,t1,Z(i+1)),P(u0-.02,t1,Z(i+1))],i<N/2?'#b9ccd6':'#e2ecf0');}
          for(let i=0;i<N;i++){const t0=a0+(a1-a0)*i/N,t1=a0+(a1-a0)*(i+1)/N;fp(g,[P(u1+.02,t0,Z(i)-1),P(u1+.02,t1,Z(i+1)-1),P(u1+.02,t1,Z(i+1)),P(u1+.02,t0,Z(i))],'#7d8a92');}
          BL(g,P(u0-.02,a1,zr),P(u1+.02,a1,zr),'#f4f8f9');}
        else{boxZ(g,u0-.03,v0-.03,u1-u0+.06,v1-v0+.06,zr,1,'#dfe4e7','#f3f5f6','#9fa9b0');}
        {const p=P((u0+u1)/2,v1+.03,zr-1);RC(g,p[0]-1,p[1],3,1,'#f1f0e6');if(n)RC(n,p[0]-1,p[1],3,1,'#fff0c8');}});};

    // 坡道反向（沿 u，由 b0 地面升到 b1 高 2）
    const rampUp=(L,g,a0,a1,b0,b1)=>{const {P,fp}=L;fp(g,[P(b0,a0,0),P(b1,a0,2),P(b1,a1,2),P(b0,a1,0)],'#c2bfb7');fp(g,[P(b0,a1,0),P(b1,a1,0),P(b1,a1,2)],'#a9a59c');};
    // 深度：軌道（v∈[.37,.63]）後方的件用 u+v（<1.4）；電車 1.4、集電弓 1.402、接觸線 1.45；軌道前方的件一律排在後面
    const fd=(u,v)=>1.5+(u+v)/10;
    const bench=(S,L,u,v,du,z,d)=>S.o(d,(g)=>{L.boxZ(g,u,v,du,.03,z,2,'#8a5a3a','#9c6a45','#6f4a30');});

    const K21=[
      // v0 錯開式雙側月台：單線走中心線 v＝.5；後側月台在右半（+u 段）、前側月台在左半（−u 段），各一座平頂玻璃候車亭；
      // 一列低地板電車停靠後側月台（集電弓碰到接觸線）；兩側各一支接觸網電桿；前側月台售票機、角落路燈與長椅。
      (g,ng,S,L,K)=>{const {P,RC,BL,pave,crowd,stopSign,ticketM,modLamp,tree,bikeV,BIKEC,track,mast,wire,tram,TB0,TB1}=L;
        pave(g,'s',0,0,1,1,2101);
        track(g,'a',2102);
        lowPlat(L,g,.1,TB0,.46,1,1);rampUp(L,g,.1,TB0,.4,.46);
        lowPlat(L,g,TB1,.9,0,.54,-1);ramp(L,g,TB1,.9,.54,.6);
        L.shadow(g,[['b',.54,.12,.34,.1,8,2],['b',.1,.78,.34,.1,8,2]]);
        // 軌道後方：樹、腳踏車架、後側電桿、後側候車亭、站牌
        S.t(.45,(g2)=>{BL(g2,P(.14,.24,2),P(.3,.24,2),'#9aa2a8');for(let i=0;i<3;i++){const p=P(.16+i*.06,.22);bikeV(g2,p[0]+2,p[1],BIKEC[(i+2)%BIKEC.length]);}});
        mast(S,.34,.27);
        shelter(S,L,.54,.88,.12,.22,2,1,'flat',3,.95);
        crowd(S,[[.5,.3,2],[.92,.26,5]],2,1.12);
        stopSign(S,.96,.2,2,1.2);
        tram(S,.48,.97,1.4);
        wire(S,1.45);
        // 軌道前方：前側月台（電桿、候車亭、售票機、候車的人）、人行道（長椅、路燈、行人）
        mast(S,.05,.69,fd(.05,.69),2);
        shelter(S,L,.1,.44,.78,.88,2,-1,'flat',4,fd(.44,.88));
        ticketM(S,.47,.8,2,fd(.47,.8));
        crowd(S,[[.24,.7,1],[.4,.71,6]],2,fd(.4,.71));
        bench(S,L,.72,.8,.12,0,fd(.84,.83));
        crowd(S,[[.76,.94,3]],0,fd(.76,.94));
        modLamp(S,.02,.96,13,0,fd(.02,.96));
      },
      // v1 單亭＋綠帶：單線落在格中心線（v＝.5）鋪草皮軌；後側一座側式低月台與弧頂玻璃候車亭，後方腳踏車架、售票機、站牌；
      // 前側是路緣、綠帶（草地、兩段綠籬、兩端小樹）與人行步道；兩側各一支接觸網電桿（後側立在月台上、前側立在綠帶上）。
      (g,ng,S,L,K)=>{const {P,RC,BL,boxZ,pave,lineU,crowd,stopSign,ticketM,modLamp,tree,BIKEC,track,mast,wire,TB0,TB1}=L;
        pave(g,'s',0,0,1,1,2111);
        pave(g,'g',0,TB1,1,.86-TB1,2112);lineU(g,.86,0,1,'#b9b5ab');
        track(g,'g',2113);
        lowPlat(L,g,.13,TB0,.06,.9,1);ramp(L,g,.13,TB0,.9,.95);
        L.shadow(g,[['b',.28,.15,.42,.11,9,2]]);
        S.t(.3,(g2)=>{BL(g2,P(.06,.06,2),P(.3,.06,2),'#9aa2a8');for(let i=0;i<4;i++){const p=P(.08+i*.06,.04);L.bikeV(g2,p[0]+2,p[1],BIKEC[i%BIKEC.length]);}});
        shelter(S,L,.28,.7,.15,.26,2,1,'arc',1,.95);
        ticketM(S,.76,.25,2);stopSign(S,.16,.31,2);
        crowd(S,[[.22,.3,0],[.8,.33,3]],2,1.2);
        mast(S,.86,.3,1.25,2);
        wire(S,1.45);
        mast(S,.14,.72,fd(.14,.72));
        S.t(fd(.8,.78),(g2)=>{for(const[a,b]of[[.24,.44],[.58,.78]]){boxZ(g2,a,.74,b-a,.04,0,2,'#6aa04d','#4f7f35','#3b6428');for(let u=a+.03;u<b-.01;u+=.06){const p=P(u,.78,2);RC(g2,p[0],p[1]-1,1,1,'#8cc063');}}});
        tree(S,.06,.78,.7,2,fd(.06,.78));tree(S,.94,.74,.7,0,fd(.94,.74));
        crowd(S,[[.3,.93,4],[.55,.95,7],[.8,.92,1]],0,fd(.8,.95));
        modLamp(S,.5,.9,13,0,fd(.5,.9));
      },
      // v2 長頂棚側式月台：單線走中心線 v＝.5；後側一座長月台，大半覆筒拱金屬頂棚（左亮、脊中、右暗三段色帶＋每 4px 一道肋、
      // 前簷燈條、簷下發車看板、+u 端弧形端板）；一列低地板電車停靠；+u 端坡道與斑馬線穿越軌道；右端售票機、站牌、電桿與樹；
      // 前側人行道：電桿、長椅、角落樹、路燈與行人。
      (g,ng,S,L,K)=>{const {P,RC,BL,fp,pg,boxZ,faceL,pave,crowd,stopSign,ticketM,modLamp,tree,track,mast,wire,tram,TB0,TB1}=L;
        pave(g,'s',0,0,1,1,2121);
        track(g,'a',2122,[.87,.95]);
        lowPlat(L,g,.08,TB0,.02,.84,1);ramp(L,g,.08,TB0,.84,.9);
        L.shadow(g,[['b',.04,.07,.76,.23,3,12]]);
        tree(S,.95,.04,.75,2);
        mast(S,.95,.27);
        crowd(S,[[.2,.24,0],[.33,.28,3],[.56,.22,6],[.66,.29,2]],2,.8);
        bench(S,L,.4,.13,.14,2,.82);
        S.t(.89,(g2)=>{for(const u of[.1,.42,.74]){const p=P(u,.27,2),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x,y-10,1,10,'#9aa3a9');RC(g2,x+1,y-10,1,10,'#5a636a');}});
        // 筒拱頂棚（脊沿 u）：t 由後（v＝a0）到前（v＝a1）；三段平滑色帶＋每 .125u（4px）一道肋
        S.o(.9,(g2,n2)=>{const u0=.04,u1=.8,a0=.07,a1=.3,z=12,R=3,N=12,V=t=>a0+(a1-a0)*t,Z=t=>z+R*Math.sin(Math.PI*t);
          const band=t=>t<.34?'#6f7f8a':(t<.67?'#95a5af':'#bfcdd4');
          for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N;fp(g2,[P(u0,V(t0),Z(t0)),P(u1,V(t0),Z(t0)),P(u1,V(t1),Z(t1)),P(u0,V(t1),Z(t1))],band((t0+t1)/2));}
          for(let u=u0+.125;u<u1-.02;u+=.125)for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N;BL(g2,P(u,V(t0),Z(t0)),P(u,V(t1),Z(t1)),SH(band((t0+t1)/2),-16));}
          {const pts=[P(u1,a0,z-1)];for(let i=0;i<=N;i++)pts.push(P(u1,V(i/N),Z(i/N)));pts.push(P(u1,a1,z-1));fp(g2,pts,'#5d6b74');}
          faceL(g2,a1,u0,u1,z-1,z,'#e4eaed');
          for(let u=u0+.08;u<u1-.04;u+=.12){const p=P(u,a1,z-1);RC(g2,p[0],p[1],2,1,'#fbf3d6');if(n2)RC(n2,p[0],p[1],2,1,'#fff4cc');}
          {const p=P(.44,a1-.01,z-1);pg(g2,p[0],p[1],6,2,.5,'#1d2328');pg(g2,p[0]+1,p[1],4,1,.5,'#f0a830');if(n2)pg(n2,p[0]+1,p[1],4,1,.5,'#ffc050');}});
        ticketM(S,.8,.16,2,.99);
        stopSign(S,.82,.31,2,1.16);
        tram(S,.1,.7,1.4);
        wire(S,1.45);
        mast(S,.22,.74,fd(.22,.74));
        tree(S,.06,.88,.8,0,fd(.06,.88));
        bench(S,L,.36,.84,.14,0,fd(.5,.87));
        crowd(S,[[.7,.93,4],[.84,.8,7]],0,fd(.84,.93));
        modLamp(S,.64,.97,13,0,fd(.64,.97));
      },
    ];
    build(21,dims(21,[72,112,36,110]),SZ,K21);
  }catch(e){console.error('trans_c k21',e);errs.push('k21:'+(e&&e.stack||e));}

  if(errs.length)window.__trans_c_errs=errs;
  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
