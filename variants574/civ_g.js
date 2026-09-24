// T613 civ_g：k48 綜合醫院（3×3，208×220，錨 104,218）＋ k102 寵物醫院（1×1，72×112，錨 36,110）實驗線重畫。
//   k48 v0 塔樓在後：八層白色病房板樓（屋頂機械層＋直升機停機坪）＋前左三層門診樓（玻璃大廳、車寄雨遮）＋前右低矮急診部（雨遮車道、救護車）
//          東角員工停車場、前緣訪客停車、西前角療癒花園
//       v1 L 形：六層紅磚病房 L 形（背翼＋西翼，轉角機械層、背翼東端停機坪）＋西翼前端兩層門診；L 內側中庭花園；
//          東側急診部（雨遮朝前、救護車兩輛）；前緣大停車場
//       v2 雙塔：兩層裙樓上立兩座七層白色病房塔（空橋相連；右塔停機坪、左塔機械層）＋正面三層玻璃中庭大廳＋前方迴車圓環；
//          西前角急診部（雨遮朝東、救護車）；東側訪客停車；前緣草帶＋人行道，中央一條進場車道接圓環
//   k102 v0 磚造：兩層紅磚四坡頂小樓（大櫥窗、綠雨遮、貓狗招牌）＋前左遛狗草地與白色小柵欄＋右側車位
//        v1 木構：一層半木板屋（正面山牆朝左前＋腳印圓徽、淺綠鐵皮門廊）＋東角遛狗區木柵欄與狗屋＋前右吊臂貓狗招牌＋前左車位
//        v2 現代玻璃：平頂白盒＋轉角落地玻璃＋懸挑雨遮＋屋頂貓狗招牌箱＋前左人工草皮遛狗區（金屬欄）＋右側車位
// 分層合成（沿用 civ_b／civ_d）：立體主體各自一層（二值化＋深色外框）；燈桿、欄杆、人、狗、風向袋走不描邊細線層；
// 地面（鋪面、草坪、標線）直接畫在地面層，最後再按佔地菱形南兩斜邊裁一次。
// 夜光按層遮擋，只亮白天畫出的窗、門、招牌、門燈、路燈、停機坪邊燈與航空障礙燈。零亂數：只用 K.hsh。
// 光從左：+v 面（左前）亮、+u 面（右前）暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function civ_g(A){
  // 本批要蓋過較早批次（b05 以 48_1_0／102_1_0 為底另疊出 _1／_2）寫入的同鍵變體：不在清單尾端時把自己排到尾端再跑
  {const QL=window.__variants574;if(!civ_g.__q&&QL[QL.length-1]!==civ_g){civ_g.__q=1;QL.push(civ_g);return;}}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const REP={err:[],flag:{},keys:{}};window.__civ_g=REP;

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,hsh,AX,AY,SZ}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
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
    // 牆面逐欄走訪：+v 面（colsL，欄 0 在 ua 端）／+u 面（colsR，欄 0 在 vb 端＝南前角）
    const colsL=(v,ua,ub,z,fn)=>{const a=P(ua,v,z),b=P(ub,v,z),x0=Math.ceil(a[0]-.5);for(let X=x0;X<Math.ceil(b[0]-.5);X++)fn(X,Math.ceil(a[1]+(X+.5-a[0])*.5-.5),X-x0);};
    const colsR=(u,va,vb,z,fn)=>{const a=P(u,vb,z),b=P(u,va,z),x0=Math.ceil(a[0]-.5);for(let X=x0;X<Math.ceil(b[0]-.5);X++)fn(X,Math.ceil(a[1]-(X+.5-a[0])*.5-.5),X-x0);};
    const recL=(g,v,ua,ub,i0,i1,za,zb,c)=>colsL(v,ua,ub,zb,(X,y,i)=>{if(i>=i0&&i<i1)RC(g,X,y,1,zb-za,c);});
    const recR=(g,u,va,vb,i0,i1,za,zb,c)=>colsR(u,va,vb,zb,(X,y,i)=>{if(i>=i0&&i<i1)RC(g,X,y,1,zb-za,c);});
    const nL=(v,ua,ub)=>Math.ceil(P(ub,v,0)[0]-.5)-Math.ceil(P(ua,v,0)[0]-.5);
    const nR=(u,va,vb)=>Math.ceil(P(u,va,0)[0]-.5)-Math.ceil(P(u,vb,0)[0]-.5);
    // 牆面第 i 欄在高度 z 的像素座標（直立招牌、圖示的錨點）
    const atL=(v,ua,ub,i,z)=>{const a=P(ua,v,z),X=Math.ceil(a[0]-.5)+i;return[X,Math.ceil(a[1]+(X+.5-a[0])*.5-.5)];};
    const atR=(u,va,vb,i,z)=>{const a=P(u,vb,z),X=Math.ceil(a[0]-.5)+i;return[X,Math.ceil(a[1]-(X+.5-a[0])*.5-.5)];};
    // 像素圖示（直立）：dog 向右、cat 向左坐姿、paw 腳印、plus 小十字
    const ICON={dog:['#...##','.#####','.####.','.#..#.'],cat:['#.#..','###..','.##..','.###.','.####'],paw:['.#.#.','#...#','.###.','.###.'],
      plus:['.#.','###','.#.'],cross5:['.###.','#####','#####','#####','.###.']};
    const icon=(g,x,y,pat,col,col2)=>{for(let r=0;r<pat.length;r++)for(let c=0;c<pat[r].length;c++){const ch=pat[r][c];if(ch==='#')RC(g,x+c,y+r,1,1,col);else if(ch==='o'&&col2)RC(g,x+c,y+r,1,1,col2);}};
    const courseL=(g,v,ua,ub,za,zb,c,st=3)=>{for(let z=za+st;z<zb;z+=st)colsL(v,ua,ub,z,(X,y)=>RC(g,X,y,1,1,c));};
    const courseR=(g,u,va,vb,za,zb,c,st=3)=>{for(let z=za+st;z<zb;z+=st)colsR(u,va,vb,z,(X,y)=>RC(g,X,y,1,1,c));};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h,z] 方盒／['p',u,v,h] 細桿
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,h]=s,k=h/64;BL(sx,P(u,v),P(u+k,v-k*.45),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // ---------- 地坪 ----------
    const MATS={
      a:{t:['#6f6d69','#6a6864','#75736e'],j:null,s:.125,p:.72},         // 瀝青
      c:{t:['#c4c0b5','#bebaaf','#cac6bb'],j:'#b1ada2',s:.25,p:.6},      // 一般混凝土
      w:{t:['#d2cdc0','#ccc7ba','#d8d3c6'],j:'#bfbaad',s:.125,p:.6},     // 人行鋪面（淺）
      p:{t:['#c9b49a','#bea98f','#d2bea5'],j:'#af9b83',s:.125,p:.55},    // 廣場磚
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.7},          // 草
      t:{t:['#5fae5a','#58a553','#67b661'],j:null,s:.0625,p:.7},         // 人工草皮
      d:{t:['#a38a68','#9a8161','#ab9270'],j:null,s:.0625,p:.6},         // 泥土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0+.02),P(a,v0+dv-.02),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0+.02,b),P(u0+du-.02,b),M.j);}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const stallsU=(g,u0,v0,du,n,dv=.2,c='#dedad0')=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c='#dedad0')=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    const curb=(g,u0,v0,du,dv,c='#e2ded4')=>{lineU(g,v0,u0,u0+du,c);lineU(g,v0+dv,u0,u0+du,c);lineV(g,u0,v0,v0+dv,c);lineV(g,u0+du,v0,v0+dv,c);};
    // 硬邊圍籬：立柱＋頂欄實線＋中欄點線（金屬）
    const fenceP=(g,a,b,gap,o={})=>{const pa=P(...a),pb=P(...b),h=o.h||7,n=Math.max(2,Math.round(Math.hypot(pb[0]-pa[0],pb[1]-pa[1])/(o.step||7)));
      const at=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);
      const seg=(t0,t1)=>{BL(g,at(t0,h-1),at(t1,h-1),o.rail||'#b3bbc0');const q0=at(t0,(h>>1)),q1=at(t1,(h>>1)),m=Math.max(1,Math.round(Math.abs(q1[0]-q0[0])));
        for(let k=0;k<=m;k+=(o.solid?1:2)){const q=lerp(q0,q1,k/m);RC(g,q[0],q[1],1,1,o.mid||'#a3abb0');}};
      if(gap){seg(0,gap[0]);seg(gap[1],1);}else seg(0,1);
      for(let i=0;i<=n;i++){const t=i/n;if(gap&&t>gap[0]&&t<gap[1])continue;const p=at(t,0);RC(g,p[0],p[1]-h,1,h,o.post||'#7d868b');}};
    // 白色木樁柵欄（尖頭板條）
    const picket=(g,a,b,o={})=>{const pa=P(...a),pb=P(...b),h=o.h||5,c=o.c||'#f4f1e8',cd=o.cd||'#c9c3b5';
      const m=Math.max(1,Math.round(Math.abs(pb[0]-pa[0])));
      for(let k=0;k<=m;k++){const q=lerp(pa,pb,k/m),x=rnd(q[0]),y=rnd(q[1]);
        if(k%2===0){RC(g,x,y-h,1,h,c);RC(g,x,y-h-1,1,1,cd);}else{RC(g,x,y-h+2,1,1,cd);RC(g,x,y-2,1,1,cd);}}};
    // ---------- 小件 ----------
    const CARC=['#b8bec4','#2f3a48','#e8e8e4','#8e2f2a','#3b5c7e','#6d7470','#c9b48a','#4d6b4a'];
    const car=(S,u,v,alongU,col,d)=>S.o(d!=null?d:u+v+.1,(g)=>{const du=alongU?.15:.08,dv=alongU?.08:.15;
      boxZ(g,u,v,du,dv,1,2,col,SH(col,20),SH(col,-40));boxZ(g,u+(alongU?.04:.01),v+(alongU?.01:.04),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa3bb','#5a7d94');
      if(alongU){for(const t of[u+.03,u+.12]){const p=P(t,v+dv,0);RC(g,p[0]-1,p[1]-1,2,1,'#1c1d20');}}
      else{for(const t of[v+.03,v+.12]){const p=P(u+du,t,0);RC(g,p[0]-1,p[1]-1,2,1,'#1c1d20');}}});
    const lamp=(S,u,v,h=16,d)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#9ccb6a');});
    const hedge=(S,u0,v0,du,dv,h,d)=>S.o(d,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#6ea84f','#548c3f','#3f7331');
      const N=nL(v0+dv,u0,u0+du);for(let i=1;i<N;i+=3)recL(g,v0+dv,u0,u0+du,i,i+1,h-2,h-1,'#6ea84f');});
    const bench=(S,u,v,alongU=true,d)=>S.o(d!=null?d:u+v+.02,(g)=>{if(alongU)boxZ(g,u,v,.1,.035,2,1,'#b08a5c','#9c774c','#7c5c38');else boxZ(g,u,v,.035,.1,2,1,'#b08a5c','#9c774c','#7c5c38');});
    // 人：[u,v,kind]；0 深藍訪客、1 醫師白袍、2 護理師、3 紅衣、4 黃衣、5 綠衣
    const PPL=[['#2f3b57','#262a30','#e2b48c','#3a2c24'],['#f2f2ee','#5d6b76','#e2b48c','#3a2c24'],['#79b9bf','#4f8f94','#e8c39a','#2b2420'],
      ['#b8453a','#3a3f4d','#e2b48c','#6b4a2e'],['#e0b84a','#3a3f4d','#d9a878','#1f1a17'],['#5d8a4e','#3a3f4d','#e2b48c','#8a6a3a']];
    const ppl=(S,list,d)=>S.t(d,(g)=>{for(const [u,v,k] of list){const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),c=PPL[k%PPL.length];
      RC(g,x,y-2,1,2,c[1]);RC(g,x+1,y-2,1,2,SH(c[1],-14));RC(g,x,y-5,2,3,c[0]);RC(g,x+1,y-5,1,3,SH(c[0],-30));RC(g,x,y-7,2,2,c[2]);RC(g,x,y-7,2,1,c[3]);}});
    // 輪椅（坐姿病人＋推的人）
    const wheelchair=(S,u,v,d)=>S.t(d,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-3,3,3,'#2a2d31');RC(g,x,y-2,1,1,'#8a9096');RC(g,x-1,y-6,2,3,'#7fa3c4');RC(g,x-1,y-7,2,1,'#e2b48c');RC(g,x-1,y-8,2,1,'#b9b2a6');
      RC(g,x+2,y-2,1,2,'#262a30');RC(g,x+3,y-2,1,2,'#1c1f23');RC(g,x+2,y-5,2,3,'#79b9bf');RC(g,x+3,y-5,1,3,'#4f8f94');RC(g,x+2,y-7,2,2,'#e8c39a');RC(g,x+2,y-7,2,1,'#2b2420');RC(g,x+1,y-5,1,1,'#555a60');});
    // 3×5 像素字
    const FONT={E:['###','#..','##.','#..','###'],R:['##.','#.#','##.','#.#','#.#'],V:['#.#','#.#','#.#','#.#','.#.'],T:['###','.#.','.#.','.#.','.#.'],
      H:['#.#','#.#','###','#.#','#.#'],P:['##.','#.#','##.','#..','#..'],O:['###','#.#','#.#','#.#','###'],S:['###','#..','###','..#','###'],I:['#','#','#','#','#']};
    // +u 面寫字：沿 −v 方向每字 4px，字直立、逐字沿斜面下移
    const textR=(g,u,vs,zTop,str,col)=>{let v=vs;for(const ch of str){const f=FONT[ch],p=P(u,v,zTop),x=Math.ceil(p[0]-.5),y=Math.ceil(p[1]-.5);
      if(f)for(let r=0;r<5;r++)for(let c=0;c<f[r].length;c++)if(f[r][c]==='#')RC(g,x+c,y+r,1,1,col);v-=((f?f[0].length:3)+1)/32;}};
    const textL=(g,v,us,zTop,str,col)=>{let u=us;for(const ch of str){const f=FONT[ch],p=P(u,v,zTop),x=Math.ceil(p[0]-.5),y=Math.ceil(p[1]-.5);
      if(f)for(let r=0;r<5;r++)for(let c=0;c<f[r].length;c++)if(f[r][c]==='#')RC(g,x+c,y+r,1,1,col);u+=((f?f[0].length:3)+1)/32;}};
    // 南兩斜邊以外一律清掉（外框、落影溢出保險）＋頂端兩列
    const clipLot=c=>{const g=c.getContext('2d');for(let y=AY-16*SZ;y<H;y++){const w=2*(AY-y);if(w<=0){g.clearRect(0,y,W,1);continue;}
      g.clearRect(0,y,Math.max(0,AX-w),1);g.clearRect(AX+w,y,W,1);}g.clearRect(0,0,W,2);};
    return{P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,colsL,colsR,recL,recR,nL,nR,atL,atR,ICON,icon,courseL,courseR,hw,hx,ell,scene,shadow,
      MATS,pave,lineU,lineV,dashU,dashV,stallsU,stallsV,curb,fenceP,picket,CARC,car,lamp,tree,bush,hedge,bench,ppl,wheelchair,FONT,textR,textL,clipLot};
  };

  // ================= 醫院元件 =================
  const RED='#d1352b',REDD='#992620',REDH='#ec5a4c';
  const HOSP=(K,L)=>{
    const {P,hsh}=K,{RC,BL,fp,flat,boxZ,faceL,faceR,recL,recR,nL,nR,atL,atR,courseL,courseR,ell,textR,textL}=L;
    const PAL={
      white:{top:'#9fa4a7',l:'#eceae4',r:'#bfc2c2',baseL:'#b3b7b8',baseR:'#8b9091',bandL:'#d8d5cc',bandR:'#aaadad',parL:'#f8f7f3',parR:'#d0d2d1',
        gl:'#4c7391',glr:'#38566d',glH:'#86a8c0',glHr:'#5f7f96',roof:'#aeb2b3'},
      brick:{top:'#8f8a84',l:'#b4644a',r:'#854533',j:'#a1573f',jr:'#763b2b',baseL:'#d9d0bd',baseR:'#a8a08e',bandL:'#e5ddca',bandR:'#b6ad9a',parL:'#ede7d7',parR:'#c0b8a5',
        gl:'#43627a',glr:'#324a5c',glH:'#7c9ab0',glHr:'#5a7488',roof:'#9a958e',frame:'#efe9da',frameR:'#c5bda9'},
      teal:{top:'#a3a8aa',l:'#f0f0ec',r:'#c4c7c8',baseL:'#8ea2a6',baseR:'#6b7e82',bandL:'#dfe0dc',bandR:'#b2b6b6',parL:'#fafaf8',parR:'#d6d8d8',
        gl:'#3c8797',glr:'#2c6674',glH:'#82c4cf',glHr:'#5a98a4',roof:'#b3b6b6'},
      cream:{top:'#a39d92',l:'#ebe3cf',r:'#bdb5a1',baseL:'#c9b89a',baseR:'#9c8d72',bandL:'#dcd2bb',bandR:'#b0a690',parL:'#f5efe0',parR:'#cfc7b3',
        gl:'#4c7391',glr:'#38566d',glH:'#86a8c0',glHr:'#5f7f96',roof:'#aba69b'},
    };
    const LITC=['#ffe6a8','#eaf3ff','#fff1cc','#dcecff'];
    // 病房／門診量體：o={pal,fl,fh,z0,base,ribbon,pw,pg,seed,lit,core:[a,b],coreR:[a,b],skipL(i0,f),skipR(i0,f)}
    const ward=(g,n,u0,v0,du,dv,o)=>{const C=o.pal,u1=u0+du,v1=v0+dv,fl=o.fl,fh=o.fh||8,z0=o.z0||0,bs=o.base==null?4:o.base,Ht=z0+bs+fl*fh+3;
      boxZ(g,u0,v0,du,dv,z0,Ht-z0,C.top,C.l,C.r);
      const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
      if(C.j){courseL(g,v1,u0,u1,z0+bs,Ht-3,C.j,3);courseR(g,u1,v0,v1,z0+bs,Ht-3,C.jr,3);}
      if(bs>0){recL(g,v1,u0,u1,0,N,z0,z0+bs,C.baseL);recR(g,u1,v0,v1,0,M,z0,z0+bs,C.baseR);}
      const pw=o.pw||2,pg=o.pg||2,lit=o.lit==null?.55:o.lit,seed=o.seed||1;
      for(let f=0;f<fl;f++){const z=z0+bs+f*fh,za=z+2,zb=z+fh-2;
        recL(g,v1,u0,u1,0,N,z,z+1,C.bandL);recR(g,u1,v0,v1,0,M,z,z+1,C.bandR);
        if(o.ribbon){
          recL(g,v1,u0,u1,1,N-1,za,zb,C.gl);recL(g,v1,u0,u1,1,N-1,zb-1,zb,C.glH);recR(g,u1,v0,v1,1,M-1,za,zb,C.glr);recR(g,u1,v0,v1,1,M-1,zb-1,zb,C.glHr);
          for(let i=1;i<N-1;i++){const s=(i-1)/3|0;if((i-1)%3===2)recL(g,v1,u0,u1,i,i+1,za,zb,SH(C.gl,-26));else if(n&&hsh(seed+f*13,s,11)<lit)recL(n,v1,u0,u1,i,i+1,za,zb-1,LITC[(hsh(seed,s,f)*4)|0]);}
          for(let i=1;i<M-1;i++){const s=(i-1)/3|0;if((i-1)%3===2)recR(g,u1,v0,v1,i,i+1,za,zb,SH(C.glr,-20));else if(n&&hsh(seed+f*13,s,29)<lit)recR(n,u1,v0,v1,i,i+1,za,zb-1,LITC[(hsh(seed,s+9,f)*4)|0]);}
        }else{
          const row=(isL,Nn)=>{const cnt=Math.floor((Nn-pg)/(pw+pg)),pad=Math.floor((Nn-cnt*(pw+pg)+pg)/2);
            for(let k=0;k<cnt;k++){const i0=pad+k*(pw+pg);
              if(isL){if(o.skipL&&o.skipL(i0,f))continue;if(C.frame)recL(g,v1,u0,u1,i0-1,i0+pw+1,za-1,za,C.frame);
                recL(g,v1,u0,u1,i0,i0+pw,za,zb,C.gl);recL(g,v1,u0,u1,i0,i0+pw,zb-1,zb,C.glH);
                if(n&&hsh(seed+f*7,k,za)<lit)recL(n,v1,u0,u1,i0,i0+pw,za,zb-1,LITC[(hsh(seed,k,f)*4)|0]);}
              else{if(o.skipR&&o.skipR(i0,f))continue;if(C.frameR)recR(g,u1,v0,v1,i0-1,i0+pw+1,za-1,za,C.frameR);
                recR(g,u1,v0,v1,i0,i0+pw,za,zb,C.glr);recR(g,u1,v0,v1,i0,i0+pw,zb-1,zb,C.glHr);
                if(n&&hsh(seed+f*7+3,k,za)<lit*.9)recR(n,u1,v0,v1,i0,i0+pw,za,zb-1,LITC[(hsh(seed,k+5,f)*4)|0]);}}};
          row(true,N);row(false,M);}
      }
      if(o.core){const[a,b]=o.core;recL(g,v1,u0,u1,a,b,z0+bs,Ht-3,C.gl);for(let f=0;f<fl;f++)recL(g,v1,u0,u1,a,b,z0+bs+f*fh,z0+bs+f*fh+1,C.glH);
        recL(g,v1,u0,u1,a-1,a,z0+bs,Ht-3,C.parL);recL(g,v1,u0,u1,b,b+1,z0+bs,Ht-3,C.parL);if(n)for(let f=0;f<fl;f++)if(hsh(seed,f,77)<.8)recL(n,v1,u0,u1,a,b,z0+bs+f*fh+2,z0+bs+f*fh+fh-1,'#e3f0ff');}
      if(o.coreR){const[a,b]=o.coreR;recR(g,u1,v0,v1,a,b,z0+bs,Ht-3,C.glr);for(let f=0;f<fl;f++)recR(g,u1,v0,v1,a,b,z0+bs+f*fh,z0+bs+f*fh+1,C.glHr);
        recR(g,u1,v0,v1,a-1,a,z0+bs,Ht-3,C.parR);recR(g,u1,v0,v1,b,b+1,z0+bs,Ht-3,C.parR);if(n)for(let f=0;f<fl;f++)if(hsh(seed,f,78)<.8)recR(n,u1,v0,v1,a,b,z0+bs+f*fh+2,z0+bs+f*fh+fh-1,'#cfe2f5');}
      recL(g,v1,u0,u1,0,N,Ht-3,Ht,C.parL);recR(g,u1,v0,v1,0,M,Ht-3,Ht,C.parR);
      flat(g,u0+.035,v0+.035,du-.07,dv-.07,C.roof,Ht);
      BL(g,P(u0+.035,v0+.035,Ht),P(u1-.035,v0+.035,Ht),SH(C.roof,-26));BL(g,P(u0+.035,v0+.035,Ht),P(u0+.035,v1-.035,Ht),SH(C.roof,-18));
      return{Ht,N,M,u1,v1};};
    // 屋頂機械層（百葉＋風機）
    const mech=(g,n,u0,v0,du,dv,z,h)=>{const u1=u0+du,v1=v0+dv;boxZ(g,u0,v0,du,dv,z,h,'#9aa0a2','#cdd0ce','#9fa4a5');
      const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
      for(let zz=z+2;zz<z+h-2;zz+=2){recL(g,v1,u0,u1,1,N-1,zz,zz+1,'#a9aeaf');recR(g,u1,v0,v1,1,M-1,zz,zz+1,'#83888a');}
      recL(g,v1,u0,u1,0,N,z+h-1,z+h,'#e4e6e4');recR(g,u1,v0,v1,0,M,z+h-1,z+h,'#b9bdbd');
      recL(g,v1,u0,u1,(N>>1)-1,(N>>1)+2,z,z+6,'#5b646a');
      const k=Math.max(1,Math.round(du/.22));for(let i=0;i<k;i++){const c=P(u0+du*(i+.5)/k,v0+dv*.5,z+h);ell(g,c[0],c[1],3,1,'#6a7073');ell(g,c[0],c[1],2,1,'#474c4f');RC(g,c[0],c[1],1,1,'#8d9396');}};
    // 屋頂直升機坪：高架平台＋黃圈白 H＋邊燈
    const helipad=(g,n,u0,v0,s,z)=>{const zp=z+3;
      for(const [x,y] of [[.04,.04],[s-.06,.04],[.04,s-.06],[s-.06,s-.06]])boxZ(g,u0+x,v0+y,.02,.02,z,3,'#5d6468','#6f767a','#50575b');
      boxZ(g,u0,v0,s,s,zp,1,'#5a6267','#8a9195','#666d71');
      const c=P(u0+s/2,v0+s/2,zp+1),R=Math.round(s*32*.6);
      ell(g,c[0],c[1],R,R>>1,'#e9c84a');ell(g,c[0],c[1],R-1,(R>>1)-1,'#5a6267');
      RC(g,c[0]-2,c[1]-2,1,5,'#f6f4ee');RC(g,c[0]+2,c[1]-2,1,5,'#f6f4ee');RC(g,c[0]-1,c[1],3,1,'#f6f4ee');
      for(let i=0;i<5;i++){const t=(i+.5)/5;for(const q of [P(u0+s*t,v0,zp+1),P(u0+s,v0+s*t,zp+1),P(u0+s*t,v0+s,zp+1),P(u0,v0+s*t,zp+1)]){RC(g,q[0],q[1]-1,1,1,'#bfe27e');if(n)RC(n,q[0],q[1]-1,1,1,'#c8ff8a');}}
      BL(g,P(u0,v0+s,zp+2),P(u0+s,v0+s,zp+2),'#c5cace');BL(g,P(u0+s,v0,zp+2),P(u0+s,v0+s,zp+2),'#9aa0a4');
      return zp;};
    // 直立紅十字燈箱（掛在立面上的方形燈箱，螢幕座標左上 x,y；sz 7／9／11）
    const crossUp=(g,n,x,y,sz=11,o={})=>{x=rnd(x);y=rnd(y);const bg=o.bg||'#f7f6f2',fg=o.fg||RED,ol=o.ol||'#9aa0a2',t=3,a=sz>=11?2:1,b=sz-a,m=(sz-t)>>1;
      RC(g,x,y,sz,sz,ol);RC(g,x+1,y+1,sz-2,sz-2,bg);RC(g,x+m,y+a,t,b-a,fg);RC(g,x+a,y+m,b-a,t,fg);
      if(n){RC(n,x+1,y+1,sz-2,sz-2,o.nbg||'#fff6ee');RC(n,x+m,y+a,t,b-a,o.nfg||'#ff4636');RC(n,x+a,y+m,b-a,t,o.nfg||'#ff4636');}};
    // 航空障礙燈
    const beacon=(g,n,p)=>{RC(g,p[0],p[1]-2,1,2,'#6b7176');RC(g,p[0],p[1]-3,1,1,'#e2392c');if(n)RC(n,p[0],p[1]-3,1,1,'#ff5a48');};
    // 玻璃大門（+v 面，dc 為中心欄）：兩層高玻璃＋懸挑雨遮＋雨遮下燈
    const entryL=(g,n,v1,u0,u1,dc,o={})=>{const w=o.w||6,h=o.h||12,zc=o.zc||h,C=o.pal;
      recL(g,v1,u0,u1,dc-w-1,dc+w+1,0,h+1,'#2b3f50');recL(g,v1,u0,u1,dc-w,dc+w,0,h,'#5d86a2');
      for(let i=dc-w;i<dc+w;i+=3)recL(g,v1,u0,u1,i,i+1,0,h,'#2b3f50');recL(g,v1,u0,u1,dc-w,dc+w,(h>>1),(h>>1)+1,'#2b3f50');
      recL(g,v1,u0,u1,dc-w,dc+w,h-1,h,'#9dbdd2');recL(g,v1,u0,u1,dc-2,dc+2,0,6,'#2a3a46');
      if(n){for(let i=dc-w;i<dc+w;i++)if((i-dc+w)%3)for(const [za,zb] of [[0,(h>>1)],[(h>>1)+1,h-1]])recL(n,v1,u0,u1,i,i+1,za,zb,'rgba(255,233,184,.85)');}
      const a=u0+(dc-w-3)/32,b=u0+(dc+w+3)/32,dp=o.dp||.16;
      for(const t of[a+.015,b-.03])boxZ(g,t,v1+dp-.03,.015,.015,0,zc,'#d5d8da','#c9cdd0','#8f959a');
      boxZ(g,a,v1,b-a,dp,zc,2,'#f2f1ec','#e4e2dc','#b6b7b3');
      if(n){const q=P((a+b)/2,v1+dp,zc);RC(n,q[0]-4,q[1]-1,8,1,'#fff0c0');}
      return{a,b};};
    const entryR=(g,n,u1,v0,v1,dc,o={})=>{const w=o.w||6,h=o.h||12,zc=o.zc||h;
      recR(g,u1,v0,v1,dc-w-1,dc+w+1,0,h+1,'#23364a');recR(g,u1,v0,v1,dc-w,dc+w,0,h,'#46708e');
      for(let i=dc-w;i<dc+w;i+=3)recR(g,u1,v0,v1,i,i+1,0,h,'#23364a');recR(g,u1,v0,v1,dc-w,dc+w,(h>>1),(h>>1)+1,'#23364a');
      recR(g,u1,v0,v1,dc-2,dc+2,0,6,'#202d38');
      if(n){for(let i=dc-w;i<dc+w;i++)if((i-dc+w)%3)for(const [za,zb] of [[0,(h>>1)],[(h>>1)+1,h-1]])recR(n,u1,v0,v1,i,i+1,za,zb,'rgba(255,233,184,.75)');}
      const vb=v1-(dc-w-3)/32,va=v1-(dc+w+3)/32,dp=o.dp||.16;
      for(const t of[va+.015,vb-.03])boxZ(g,u1+dp-.03,t,.015,.015,0,zc,'#d5d8da','#c9cdd0','#8f959a');
      boxZ(g,u1,va,dp,vb-va,zc,2,'#f2f1ec','#e4e2dc','#b6b7b3');
      if(n){const q=P(u1+dp,(va+vb)/2,zc);RC(n,q[0]-4,q[1]-1,8,1,'#fff0c0');}
      return{va,vb};};
    // 急診雨遮（自牆面伸出、柱在外緣）：7px 紅色招牌帶，長面寫白十字＋ER；底緣白色收邊
    const erSign=(g,n,face,base,a0,a1,z,len)=>{const isR=face==='R',M=isR?nR(base,a0,a1):nL(base,a0,a1),c0=Math.max(1,(M-14)>>1);
      const at=isR?atR(base,a0,a1,c0,z+6):atL(base,a0,a1,c0,z+6);
      const draw=(gg,col)=>{RC(gg,at[0],at[1]+1,5,1,col);RC(gg,at[0]+2,at[1]-1,1,5,col);RC(gg,at[0]+1,at[1],3,3,col);
        if(isR)textR(gg,base,a1-(c0+7)/32,z+6.5,'ER',col);else textL(gg,base,a0+(c0+7)/32,z+6.5,'ER',col);};
      draw(g,'#ffffff');if(n){if(isR)faceR(n,base,a0,a1,z+1,z+7,'rgba(255,70,55,.6)');else faceL(n,base,a0,a1,z+1,z+7,'rgba(255,70,55,.6)');draw(n,'#ffffff');}};
    const erCanopyU=(S,u0,va,vb,len,z,d)=>S.o(d,(g,n)=>{const u1=u0+len,t=7;
      for(const v of [va+.035,vb-.06])boxZ(g,u1-.06,v,.025,.025,0,z,'#d7dadb','#e3e5e5','#a4a8a9');
      boxZ(g,u0,va,len,vb-va,z,t,'#c3c6c6',RED,REDD);
      faceL(g,vb,u0,u1,z,z+1,'#f1efea');faceR(g,u1,va,vb,z,z+1,'#c9c6bf');
      BL(g,P(u0,vb,z+t),P(u1,vb,z+t),REDH);BL(g,P(u1,vb,z+t),P(u1,va,z+t),'#b8342b');
      erSign(g,n,'R',u1,va,vb,z,len);
      if(n){const q=P(u1-.02,(va+vb)/2,z);RC(n,q[0]-3,q[1],6,1,'rgba(255,240,210,.8)');}});
    const erCanopyV=(S,ua,ub,v0,len,z,d)=>S.o(d,(g,n)=>{const v1=v0+len,t=7;
      for(const u of [ua+.035,ub-.06])boxZ(g,u,v1-.06,.025,.025,0,z,'#d7dadb','#e3e5e5','#a4a8a9');
      boxZ(g,ua,v0,ub-ua,len,z,t,'#c3c6c6',RED,REDD);
      faceL(g,v1,ua,ub,z,z+1,'#f1efea');faceR(g,ub,v0,v1,z,z+1,'#c9c6bf');
      BL(g,P(ua,v1,z+t),P(ub,v1,z+t),REDH);BL(g,P(ub,v1,z+t),P(ub,v0,z+t),'#b8342b');
      erSign(g,n,'L',v1,ua,ub,z,len);
      if(n){const q=P((ua+ub)/2,v1-.02,z);RC(n,q[0]-3,q[1],6,1,'rgba(255,240,210,.8)');}});
    // 救護車：al='u' 車頭朝 +u；al='v' 車頭朝 +v
    const AMB={t:'#eeeeea',l:'#f8f8f5',r:'#c6c7c3'};
    const amb=(S,u,v,al,d)=>S.o(d,(g,n)=>{const Lg=.3,Wd=.12,hb=10,hc=7;
      if(al==='u'){const uc=u+.2,u1=u+Lg;
        boxZ(g,u,v,uc-u,Wd,1,hb-1,AMB.t,AMB.l,AMB.r);boxZ(g,uc,v+.006,u1-uc,Wd-.012,1,hc-1,AMB.t,AMB.l,AMB.r);
        fp(g,[P(uc,v+.006,hc),P(uc,v+Wd-.006,hc),P(uc+.03,v+Wd-.006,hc),P(uc+.03,v+.006,hc)],'#dcdcd8');
        faceR(g,u1,v+.02,v+Wd-.02,hc-3,hc-1,'#26394a');faceL(g,v+Wd-.006,uc+.02,u1-.015,hc-3,hc-1,'#2f4456');
        faceL(g,v+Wd,u,uc,3,5,RED);faceL(g,v+Wd-.006,uc,u1,3,4,RED);faceR(g,u1,v+.006,v+Wd-.006,2,3,RED);
        const cc=P(u+.1,v+Wd,7);RC(g,cc[0]-1,cc[1]-1,3,1,RED);RC(g,cc[0],cc[1]-2,1,3,RED);
        fp(g,[P(u+.005,v+.02,hb),P(u+.19,v+.02,hb),P(u+.19,v+Wd-.02,hb),P(u+.005,v+Wd-.02,hb)],'#e2e2de');
        const lb=P(uc-.01,v+Wd/2,hb);RC(g,lb[0]-2,lb[1]-1,2,1,'#ff3b2f');RC(g,lb[0],lb[1]-1,2,1,'#3a7bff');
        for(const t of [u+.05,u1-.05]){const p=P(t,v+Wd,0);RC(g,p[0]-1,p[1]-2,3,2,'#1c1d20');}
        if(n){RC(n,lb[0]-2,lb[1]-1,2,1,'#ff5a48');RC(n,lb[0],lb[1]-1,2,1,'#6fa8ff');const h1=P(u1,v+.025,2.5),h2=P(u1,v+Wd-.025,2.5);RC(n,h1[0]-1,h1[1]-1,1,1,'#fff3c8');RC(n,h2[0],h2[1]-1,1,1,'#fff3c8');}}
      else{const vc=v+.2,v1=v+Lg;
        boxZ(g,u,v,Wd,vc-v,1,hb-1,AMB.t,AMB.l,AMB.r);boxZ(g,u+.006,vc,Wd-.012,v1-vc,1,hc-1,AMB.t,AMB.l,AMB.r);
        fp(g,[P(u+.006,vc,hc),P(u+Wd-.006,vc,hc),P(u+Wd-.006,vc+.03,hc),P(u+.006,vc+.03,hc)],'#dcdcd8');
        faceL(g,v1,u+.02,u+Wd-.02,hc-3,hc-1,'#2f4456');faceR(g,u+Wd-.006,vc+.02,v1-.015,hc-3,hc-1,'#26394a');
        faceR(g,u+Wd,v,vc,3,5,REDD);faceR(g,u+Wd-.006,vc,v1,3,4,REDD);faceL(g,v1,u+.006,u+Wd-.006,2,3,RED);
        const cc=P(u+Wd,v+.1,7);RC(g,cc[0]-1,cc[1]-1,3,1,REDD);RC(g,cc[0],cc[1]-2,1,3,REDD);
        fp(g,[P(u+.02,v+.005,hb),P(u+Wd-.02,v+.005,hb),P(u+Wd-.02,v+.19,hb),P(u+.02,v+.19,hb)],'#e2e2de');
        const lb=P(u+Wd/2,vc-.01,hb);RC(g,lb[0]-2,lb[1]-1,2,1,'#ff3b2f');RC(g,lb[0],lb[1]-1,2,1,'#3a7bff');
        for(const t of [v+.05,v1-.05]){const p=P(u+Wd,t,0);RC(g,p[0]-1,p[1]-2,3,2,'#1c1d20');}
        if(n){RC(n,lb[0]-2,lb[1]-1,2,1,'#ff5a48');RC(n,lb[0],lb[1]-1,2,1,'#6fa8ff');const h1=P(u+.025,v1,2.5),h2=P(u+Wd-.025,v1,2.5);RC(n,h1[0],h1[1]-1,1,1,'#fff3c8');RC(n,h2[0]-1,h2[1]-1,1,1,'#fff3c8');}}});
    // 屋頂空調箱
    const hvac=(g,u,v,du=.12,dv=.09,z=0,h=4)=>{boxZ(g,u,v,du,dv,z,h,'#c9ced1','#dde1e3','#a9b0b4');const p=P(u+du*.5,v+dv*.5,z+h);RC(g,p[0]-2,p[1]-1,4,1,'#8d9599');};
    // 風向袋
    const windsock=(S,u,v,z,d)=>S.t(d,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-10,1,10,'#8e979c');RC(g,x+1,y-10,2,2,'#f07a2a');RC(g,x+3,y-9,2,2,'#f2efe8');RC(g,x+5,y-9,2,1,'#f07a2a');});
    return{PAL,ward,mech,helipad,crossUp,beacon,entryL,entryR,erCanopyU,erCanopyV,amb,hvac,windsock};
  };

  // ================= k48 綜合醫院（3×3）=================
  try{
    const o0=B['48_1_0']||{w:208,h:220,ax:104,ay:218};const W=o0.w|0||208,H=o0.h|0||220,AX=o0.ax|0||104,AY=o0.ay|0||218,SZ=3;
    REP.keys[48]=[W,H,AX,AY];
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),HS=HOSP(K,L);
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,recL,recR,nL,nR,atL,atR,ell,pave,lineU,lineV,dashU,dashV,stallsU,stallsV,curb,fenceP,car,lamp,tree,bush,hedge,bench,ppl,wheelchair,shadow,CARC,textL,textR}=L;
    const {PAL,ward,mech,helipad,crossUp,beacon,entryL,entryR,erCanopyU,erCanopyV,amb,hvac,windsock}=HS;
    const carRowU=(S,u0,v0,dv,n,skip,seed,d0)=>{for(let k=0;k<n;k++){if(skip&&skip.includes(k))continue;car(S,u0,v0+dv*k/n+.02,true,CARC[(hsh(seed,k,1)*CARC.length)|0],d0!=null?d0+k*.001:null);}};
    const carRowV=(S,u0,v0,du,n,skip,seed,d0)=>{for(let k=0;k<n;k++){if(skip&&skip.includes(k))continue;car(S,u0+du*k/n+.015,v0,false,CARC[(hsh(seed,k,2)*CARC.length)|0],d0!=null?d0+k*.001:null);}};
    const layouts=[
      // ---------- v0 塔樓在後 ----------
      (g,ng,S)=>{const C=PAL.white;
        pave(g,'c',0,0,3,3,4801);
        pave(g,'a',2.26,.06,.68,.96,4802);stallsV(g,2.28,.1,.88,8,.18);stallsV(g,2.74,.1,.88,8,.18);dashV(g,2.6,.12,.96,'#d8d4c8');
        pave(g,'a',2.2,1.04,.74,.84,4803);flat(g,2.22,1.06,.08,.8,'#c9b24a');for(let t=1.1;t<1.84;t+=.09)BL(g,P(2.22,t),P(2.29,t+.05),'#6f6d69');
        pave(g,'a',.3,1.96,2.64,.26,4804);dashU(g,2.09,.4,2.9,'#e8e2c8');
        pave(g,'a',1.5,2.24,1.44,.26,4805);stallsU(g,1.54,2.26,1.36,12,.22);
        pave(g,'g',.06,2.26,1.4,.68,4806);pave(g,'g',1.5,2.54,1.44,.4,4807);pave(g,'g',.06,.9,.2,1.04,4808);
        pave(g,'w',.3,2.44,1.12,.14,4809);pave(g,'w',.6,2.26,.14,.66,4810);
        flat(g,.84,2.62,.3,.2,'#8fb7c9');flat(g,.86,2.64,.26,.16,'#5d93b0');curb(g,.84,2.62,.3,.2,'#e2ded4');
        lineU(g,1.95,.3,2.94,'#e6e2d6');lineU(g,2.23,.3,2.94,'#e6e2d6');lineV(g,2.2,1.04,1.88,'#e6e2d6');
        shadow(g,[['b',.25,.2,1.85,.58,74],['b',.25,.95,.95,.95,36],['b',1.4,1.05,.8,.75,18],['b',.52,.78,.4,.17,18],['b',2.2,1.18,.27,.52,17]]);
        fenceP(g,[.05,.05],[2.24,.05]);fenceP(g,[.05,.05],[.05,.88]);
        // 病房大樓
        S.o(1.0,(g,n)=>{const r=ward(g,n,.25,.2,1.85,.58,{pal:C,fl:8,fh:8,base:4,seed:481,core:[27,31],skipL:(i0)=>i0>=25&&i0<=32});
          mech(g,n,.36,.28,.52,.42,r.Ht,8);
          hvac(g,1.02,.3,.14,.1,r.Ht);hvac(g,1.02,.52,.14,.1,r.Ht);
          const zp=helipad(g,n,1.4,.23,.52,r.Ht);
          {const p=atL(.78,.25,2.1,4,r.Ht-5);crossUp(g,n,p[0],p[1],11);}
          beacon(g,n,P(.38,.3,r.Ht+8).map(rnd));beacon(g,n,P(2.07,.75,r.Ht).map(rnd));});
        windsock(S,2.02,.26,71,1.02);
        // 連廊
        S.o(1.5,(g,n)=>{boxZ(g,.52,.78,.4,.17,0,18,'#a3a8aa',C.l,C.r);recL(g,.95,.52,.92,1,12,10,15,C.gl);recR(g,.92,.78,.95,0,5,10,15,C.glr);
          if(n)recL(n,.95,.52,.92,1,12,10,14,'#eaf3ff');});
        // 門診樓
        S.o(2.0,(g,n)=>{const r=ward(g,n,.25,.95,.95,.95,{pal:PAL.cream,fl:3,fh:9,base:4,ribbon:1,seed:482,lit:.6});
          const N=r.N,dc=Math.round(N*.5);
          recL(g,1.9,.25,1.2,dc-8,dc+8,0,14,PAL.cream.l);
          const e=entryL(g,n,1.9,.25,1.2,dc,{w:6,h:13,zc:13,dp:.18});
          recL(g,1.9,.25,1.2,dc-9,dc+9,r.Ht-10,r.Ht-4,'#2f6f9a');recL(g,1.9,.25,1.2,dc-8,dc+8,r.Ht-9,r.Ht-5,'#3d86b6');
          for(let i=dc-3;i<dc+7;i+=2)recL(g,1.9,.25,1.2,i,i+1,r.Ht-8,r.Ht-6,'#e9f2f8');
          recL(g,1.9,.25,1.2,dc-7,dc-6,r.Ht-9,r.Ht-5,'#ffffff');recL(g,1.9,.25,1.2,dc-8,dc-5,r.Ht-8,r.Ht-6,'#ffffff');
          if(n)recL(n,1.9,.25,1.2,dc-8,dc+8,r.Ht-9,r.Ht-5,'rgba(120,190,255,.6)');
          {const p=atR(1.2,.95,1.9,4,r.Ht-4);crossUp(g,n,p[0],p[1],9,{ol:'#8f8a7e'});}
          hvac(g,.4,1.1,.16,.12,r.Ht);hvac(g,.7,1.1,.16,.12,r.Ht);boxZ(g,.9,1.4,.18,.2,r.Ht,6,'#b7bbbc',C.l,C.r);});
        // 急診部（低矮一層半、紅帶）
        S.o(2.6,(g,n)=>{const u0=1.4,v0=1.05,du=.8,dv=.75,u1=u0+du,v1=v0+dv,h=18;
          boxZ(g,u0,v0,du,dv,0,h,'#9fa4a7',C.l,C.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          recL(g,v1,u0,u1,0,N,0,3,C.baseL);recR(g,u1,v0,v1,0,M,0,3,C.baseR);
          recL(g,v1,u0,u1,0,N,h-5,h-2,RED);recR(g,u1,v0,v1,0,M,h-5,h-2,REDD);
          recL(g,v1,u0,u1,0,N,h-2,h,C.parL);recR(g,u1,v0,v1,0,M,h-2,h,C.parR);
          for(let i=3;i<N-3;i+=5){recL(g,v1,u0,u1,i,i+3,4,9,C.gl);recL(g,v1,u0,u1,i,i+3,8,9,C.glH);if(n&&hsh(483,i,1)<.7)recL(n,v1,u0,u1,i,i+3,4,8,'#eaf3ff');}
          // 急診自動門（+u 面，雨遮下）
          const dc=Math.round(M*.5);recR(g,u1,v0,v1,dc-5,dc+5,0,10,'#23364a');recR(g,u1,v0,v1,dc-4,dc+4,0,9,'#46708e');recR(g,u1,v0,v1,dc,dc+1,0,9,'#23364a');
          if(n)recR(n,u1,v0,v1,dc-4,dc+4,0,9,'#f4f8ff');
          flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#aeb2b3',h);
          hvac(g,1.5,1.15,.16,.12,h);hvac(g,1.78,1.15,.16,.12,h);hvac(g,1.5,1.45,.12,.1,h);});
        amb(S,2.24,1.26,'u',3.3);erCanopyU(S,2.2,1.18,1.7,.27,10,3.5);amb(S,2.58,1.48,'u',3.9);
        // 停車
        carRowU(S,2.3,.1,.88,8,[2,5],4811);carRowU(S,2.76,.1,.88,8,[0,6],4812);
        carRowV(S,1.555,2.28,1.36,12,[1,4,5,9],4813,4.3);
        // 植栽、人、燈
        hedge(S,.08,.92,.1,.96,4,1.9);
        tree(S,.2,2.4,1,0,4.6);tree(S,.32,2.84,1,2,4.9);tree(S,1.3,2.4,.9,1,4.8);tree(S,1.34,2.84,1,0,5.0);
        tree(S,1.7,2.84,.9,2,5.3);tree(S,2.2,2.86,1,0,5.6);tree(S,2.7,2.86,.9,1,5.8);
        bush(S,.5,2.7,3);bush(S,1.0,2.9,3);bench(S,.38,2.6,true);bench(S,1.02,2.52,true);
        ppl(S,[[.64,2.12,0],[.7,2.18,3],[1.08,2.3,4],[.84,2.52,5],[.9,2.56,0],[2.62,1.9,1],[2.66,1.95,2],[1.96,.9,1]],4.0);
        wheelchair(S,.46,2.08,3.9);
        lamp(S,.3,2.24,18);lamp(S,1.46,2.24,18);lamp(S,2.9,2.24,18);lamp(S,2.9,1.02,18);lamp(S,2.24,.08,18);
        return{};
      },
      // ---------- v1 L 形 ----------
      (g,ng,S)=>{const C=PAL.brick;
        pave(g,'c',0,0,3,3,4821);
        pave(g,'g',.86,.86,.9,1.16,4822);pave(g,'w',.86,1.36,.9,.14,4823);pave(g,'w',1.24,.86,.14,1.16,4824);
        flat(g,1.16,1.28,.3,.3,'#bfb9ab');flat(g,1.19,1.31,.24,.24,'#5d93b0');
        pave(g,'a',1.82,1.6,1.12,.44,4825);
        pave(g,'a',.9,2.12,2.04,.82,4826);
        stallsU(g,1.0,2.14,1.9,14,.22);stallsU(g,1.0,2.7,1.9,14,.22);dashU(g,2.53,1.0,2.9,'#e8e2c8');
        pave(g,'g',.06,2.62,.8,.32,4827);pave(g,'g',2.66,.06,.28,1.5,4828);
        lineU(g,1.6,1.82,2.94,'#e6e2d6');lineU(g,2.04,.9,2.94,'#e6e2d6');
        shadow(g,[['b',.2,.2,2.1,.58,58],['b',.2,.78,.58,1.3,58],['b',.2,2.08,.66,.5,26],['b',1.84,.86,.8,.74,16]]);
        fenceP(g,[.05,.05],[2.94,.05]);fenceP(g,[.05,.05],[.05,2.6]);
        // L 形病房（背翼＋西翼，同一層）
        S.o(1.0,(g,n)=>{const ra=ward(g,n,.2,.2,2.1,.58,{pal:C,fl:6,fh:8,base:4,seed:491});
          const rb=ward(g,n,.2,.78,.58,1.3,{pal:C,fl:6,fh:8,base:4,seed:492,core:[14,17]});
          mech(g,n,.26,.26,.46,.46,ra.Ht,9);
          const zp=helipad(g,n,1.72,.23,.52,ra.Ht);
          hvac(g,1.0,.3,.14,.1,ra.Ht);hvac(g,1.24,.3,.14,.1,ra.Ht);hvac(g,.3,1.2,.12,.14,rb.Ht);hvac(g,.3,1.6,.12,.14,rb.Ht);
          {const p=atL(2.08,.2,.78,2,rb.Ht-5);crossUp(g,n,p[0],p[1],11,{ol:'#8f8a7e'});}
          beacon(g,n,P(.28,.28,ra.Ht+9).map(rnd));beacon(g,n,P(2.27,.75,ra.Ht).map(rnd));});
        windsock(S,1.62,.26,55,1.02);
        // 門診（西翼前端兩層）
        S.o(2.4,(g,n)=>{const r=ward(g,n,.2,2.08,.66,.5,{pal:PAL.cream,fl:2,fh:9,base:4,ribbon:1,seed:493,lit:.6});
          const M=r.M,dc=Math.round(M*.5);recR(g,.86,2.08,2.58,dc-8,dc+8,0,14,PAL.cream.r);
          entryR(g,n,.86,2.08,2.58,dc,{w:5,h:12,zc:12,dp:.16});
          recR(g,.86,2.08,2.58,dc-7,dc+7,r.Ht-9,r.Ht-4,'#2c6a92');for(let i=dc-2;i<dc+6;i+=2)recR(g,.86,2.08,2.58,i,i+1,r.Ht-8,r.Ht-6,'#e4eef4');
          if(n)recR(n,.86,2.08,2.58,dc-7,dc+7,r.Ht-9,r.Ht-4,'rgba(120,190,255,.55)');});
        // 急診部（東側、雨遮朝前）
        S.o(2.5,(g,n)=>{const u0=1.84,v0=.86,du=.8,dv=.74,u1=u0+du,v1=v0+dv,h=18,W0=PAL.cream;
          boxZ(g,u0,v0,du,dv,0,h,'#a39d92',W0.l,W0.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          recL(g,v1,u0,u1,0,N,0,3,W0.baseL);recR(g,u1,v0,v1,0,M,0,3,W0.baseR);
          recL(g,v1,u0,u1,0,N,h-5,h-2,RED);recR(g,u1,v0,v1,0,M,h-5,h-2,REDD);recL(g,v1,u0,u1,0,N,h-2,h,W0.parL);recR(g,u1,v0,v1,0,M,h-2,h,W0.parR);
          for(let i=3;i<M-3;i+=5){recR(g,u1,v0,v1,i,i+3,4,9,W0.glr);if(n&&hsh(494,i,1)<.7)recR(n,u1,v0,v1,i,i+3,4,8,'#eaf3ff');}
          const dc=Math.round(N*.5);recL(g,v1,u0,u1,dc-5,dc+5,0,10,'#2b3f50');recL(g,v1,u0,u1,dc-4,dc+4,0,9,'#5d86a2');recL(g,v1,u0,u1,dc,dc+1,0,9,'#2b3f50');
          if(n)recL(n,v1,u0,u1,dc-4,dc+4,0,9,'#f4f8ff');
          flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#aba69b',h);hvac(g,1.94,.96,.16,.12,h);hvac(g,2.3,.96,.16,.12,h);});
        amb(S,2.02,1.64,'v',3.7);erCanopyV(S,1.9,2.58,1.6,.26,10,3.95);amb(S,2.6,1.84,'u',4.3);
        // 停車
        carRowV(S,1.005,2.14,1.9,14,[2,3,7,11],4831,4.4);carRowV(S,1.005,2.72,1.9,14,[0,5,6,9,12],4832,5.0);
        // 中庭
        tree(S,.98,1.0,.9,0,2.0);tree(S,1.6,1.0,.9,1,2.6);tree(S,.98,1.8,1,2,2.8);tree(S,1.6,1.84,.9,0,3.44);
        bench(S,1.0,1.3,true);bench(S,1.5,1.62,true);bush(S,1.1,1.66,3);bush(S,1.66,1.34,3);
        ppl(S,[[1.12,1.2,0],[1.5,1.2,2],[1.3,1.74,5],[.98,2.3,0],[.96,2.4,3],[1.8,2.08,1]],3.5);
        wheelchair(S,1.42,1.44,3.0);
        tree(S,.2,2.78,1,1,3.0);tree(S,.6,2.86,.9,0,3.5);bush(S,.4,2.9,3);tree(S,2.8,.3,.9,2,3.2);tree(S,2.82,.9,1,0,3.8);tree(S,2.8,1.4,.9,1,4.3);
        lamp(S,.9,2.1,18);lamp(S,1.9,2.08,18);lamp(S,2.92,2.08,18);lamp(S,.9,2.92,18);lamp(S,2.0,2.92,18);lamp(S,2.92,2.92,18);
        return{};
      },
      // ---------- v2 雙塔 ----------
      (g,ng,S)=>{const C=PAL.teal;
        pave(g,'c',0,0,3,3,4841);
        pave(g,'w',.2,1.72,2.56,.26,4842);
        pave(g,'a',.88,1.98,1.5,.72,4843);
        {const c=P(1.62,2.34);ell(g,c[0],c[1],18,9,'#c9c5ba');ell(g,c[0],c[1],16,8,'#78a255');ell(g,c[0],c[1],6,3,'#8fb7c9');ell(g,c[0],c[1],5,2,'#5d93b0');}
        pave(g,'a',2.42,1.98,.52,.96,4844);stallsV(g,2.44,2.02,.9,6,.2);stallsV(g,2.74,2.02,.9,6,.2);
        // 前緣：草帶＋人行道，中間一條進場車道接迴車圓環（不再在南角擠車）
        pave(g,'g',1.0,2.7,1.38,.24,4845);pave(g,'w',1.0,2.7,1.38,.07,4848);pave(g,'a',1.5,2.7,.26,.26,4850);
        lineV(g,1.5,2.7,2.96,'#e6e2d6');lineV(g,1.76,2.7,2.96,'#e6e2d6');dashV(g,1.63,2.72,2.94,'#e8e2c8',.06,.06);
        pave(g,'g',.06,2.5,.66,.44,4846);pave(g,'g',2.78,.06,.16,1.62,4847);pave(g,'a',.72,1.98,.28,.96,4849);
        lineU(g,1.98,.88,2.38,'#e6e2d6');lineU(g,2.7,1.0,1.5,'#e6e2d6');lineU(g,2.7,1.76,2.38,'#e6e2d6');lineV(g,2.4,1.98,2.94,'#e6e2d6');
        shadow(g,[['b',.2,.25,2.55,1.47,20],['b',.32,.36,.74,.68,84],['b',1.88,.36,.74,.68,84],['b',.1,1.94,.7,.56,16]]);
        fenceP(g,[.05,.05],[2.94,.05]);fenceP(g,[.05,.05],[.05,1.9]);
        // 裙樓＋雙塔＋空橋（同層：塔自裙樓頂升起）
        S.o(1.0,(g,n)=>{const rp=ward(g,n,.2,.25,2.55,1.47,{pal:C,fl:2,fh:8,base:3,ribbon:1,seed:501,lit:.65});
          const z0=rp.Ht;
          const ta=ward(g,n,.32,.36,.74,.68,{pal:C,fl:7,fh:8,base:1,z0,seed:502,coreR:[9,12]});
          boxZ(g,1.06,.56,.82,.26,z0+26,9,'#a3a8aa','#8fc3cc','#5f98a4');
          recL(g,.82,1.06,1.88,0,nL(.82,1.06,1.88),z0+26,z0+27,'#e6e8e6');recL(g,.82,1.06,1.88,0,nL(.82,1.06,1.88),z0+34,z0+35,'#e6e8e6');
          if(n)recL(n,.82,1.06,1.88,1,nL(.82,1.06,1.88)-1,z0+28,z0+33,'rgba(230,242,255,.8)');
          const tb=ward(g,n,1.88,.36,.74,.68,{pal:C,fl:7,fh:8,base:1,z0,seed:503,coreR:[9,12]});
          mech(g,n,.42,.44,.5,.46,ta.Ht,8);helipad(g,n,1.99,.42,.52,tb.Ht);
          {const p=atL(1.04,.32,1.06,3,ta.Ht-5);crossUp(g,n,p[0],p[1],11);}
          beacon(g,n,P(.44,.46,ta.Ht+8).map(rnd));beacon(g,n,P(2.59,1.01,tb.Ht).map(rnd));
          hvac(g,1.98,1.12,.16,.12,z0);hvac(g,2.22,1.12,.16,.12,z0);hvac(g,2.46,1.12,.14,.12,z0);
          const G=(u,v,du,dv,sd)=>{flat(g,u,v,du,dv,'#9b978c',z0);flat(g,u+.025,v+.025,du-.05,dv-.05,'#79a456',z0);BL(g,P(u+.025,v+dv*.5,z0),P(u+du-.025,v+dv*.5,z0),'#c9b89a');
            for(let i=0;i<5;i++){const q=P(u+.06+hsh(sd,i,1)*(du-.12),v+.06+hsh(sd,i,2)*(dv-.12),z0);ell(g,q[0],q[1]-2,2,2,'#4f7f35');ell(g,q[0]-1,q[1]-3,1,1,'#78a84c');}};
          G(.3,1.12,.7,.46,5051);G(1.14,.88,.66,.5,5052);G(1.98,1.3,.68,.34,5053);});
        windsock(S,2.58,.42,82,1.02);
        // 正面三層玻璃中庭大廳
        S.o(2.2,(g,n)=>{const u0=1.12,u1=1.86,v0=1.46,v1=1.74,h=30;
          boxZ(g,u0,v0,u1-u0,v1-v0,0,h,'#a3a8aa','#7fb7c2','#4f8894');
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          for(let i=0;i<N;i+=3)recL(g,v1,u0,u1,i,i+1,0,h,'#e8ecec');for(let z=9;z<h;z+=9)recL(g,v1,u0,u1,0,N,z,z+1,'#e8ecec');
          for(let i=0;i<M;i+=3)recR(g,u1,v0,v1,i,i+1,0,h,'#b8c0c2');for(let z=9;z<h;z+=9)recR(g,u1,v0,v1,0,M,z,z+1,'#b8c0c2');
          recL(g,v1,u0,u1,0,N,h-3,h,'#fafaf8');recR(g,u1,v0,v1,0,M,h-3,h,'#d6d8d8');
          // 夜：一樓大廳整排亮，二三樓按格亮（不讓整塊玻璃盒發白）
          if(n){for(let i=0;i<N;i++)if(i%3)for(let z=0;z<h-3;z+=9){if(z>0&&hsh(5061,(i/3)|0,z)>.55)continue;recL(n,v1,u0,u1,i,i+1,z+1,Math.min(z+9,h-3),z?'rgba(255,236,190,.55)':'rgba(255,236,190,.75)');}
            for(let i=0;i<M;i++)if(i%3)for(let z=0;z<h-3;z+=9){if(z>0&&hsh(5062,(i/3)|0,z)>.5)continue;recR(n,u1,v0,v1,i,i+1,z+1,Math.min(z+9,h-3),'rgba(255,236,190,.45)');}}
          flat(g,u0+.03,v0+.03,u1-u0-.06,v1-v0-.06,'#9fc9d1',h);
          const dc=Math.round(N/2);recL(g,v1,u0,u1,dc-4,dc+4,0,8,'#2b4a55');recL(g,v1,u0,u1,dc-3,dc+3,0,7,'#6aa6b2');
          boxZ(g,u0+.08,v1,u1-u0-.16,.2,10,2,'#f2f1ec','#e4e2dc','#b6b7b3');
          for(const t of[u0+.1,u1-.1])boxZ(g,t,v1+.17,.015,.015,0,10,'#d5d8da','#c9cdd0','#8f959a');
          if(n){const q=P((u0+u1)/2,v1+.2,10);RC(n,q[0]-5,q[1]-1,10,1,'#fff0c0');}
          recL(g,v1,u0,u1,dc-9,dc+9,h-9,h-4,'#1f5f6c');for(let i=dc-5;i<dc+8;i+=2)recL(g,v1,u0,u1,i,i+1,h-8,h-6,'#e6f4f6');
          recL(g,v1,u0,u1,dc-8,dc-5,h-7,h-6,'#ff6a5a');recL(g,v1,u0,u1,dc-7,dc-6,h-8,h-5,'#ff6a5a');
          if(n)recL(n,v1,u0,u1,dc-9,dc+9,h-9,h-4,'rgba(140,220,230,.6)');});
        // 急診部（西前角、雨遮朝東）
        S.o(3.0,(g,n)=>{const u0=.1,v0=1.98,du=.62,dv=.5,u1=u0+du,v1=v0+dv,h=18;
          boxZ(g,u0,v0,du,dv,0,h,'#a3a8aa',C.l,C.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          recL(g,v1,u0,u1,0,N,0,3,C.baseL);recR(g,u1,v0,v1,0,M,0,3,C.baseR);
          recL(g,v1,u0,u1,0,N,h-5,h-2,RED);recR(g,u1,v0,v1,0,M,h-5,h-2,REDD);recL(g,v1,u0,u1,0,N,h-2,h,C.parL);recR(g,u1,v0,v1,0,M,h-2,h,C.parR);
          for(let i=2;i<N-2;i+=5){recL(g,v1,u0,u1,i,i+3,4,9,C.gl);if(n&&hsh(504,i,1)<.7)recL(n,v1,u0,u1,i,i+3,4,8,'#eaf3ff');}
          const dc=Math.round(M*.5);recR(g,u1,v0,v1,dc-5,dc+5,0,10,'#23364a');recR(g,u1,v0,v1,dc-4,dc+4,0,9,'#46708e');recR(g,u1,v0,v1,dc,dc+1,0,9,'#23364a');
          if(n)recR(n,u1,v0,v1,dc-4,dc+4,0,9,'#f4f8ff');
          flat(g,u0+.03,v0+.03,du-.06,dv-.06,'#b3b6b6',h);hvac(g,.2,2.06,.14,.1,h);});
        amb(S,.8,2.06,'v',3.2);erCanopyU(S,.72,1.98,2.48,.26,10,3.35);amb(S,.82,2.58,'v',3.6);
        // 停車與迴車
        carRowU(S,2.46,2.02,.9,6,[1,4],4851,4.6);carRowU(S,2.76,2.02,.9,6,[3,5],4852,5.0);
        car(S,1.3,2.0,true,CARC[2],3.4);car(S,1.9,2.5,false,CARC[4],4.45);
        // 植栽、人、燈
        tree(S,2.84,.3,.9,1,3.2);tree(S,2.86,.8,1,0,3.7);tree(S,2.84,1.3,.9,2,4.2);
        tree(S,.2,2.66,.9,0,3.0);tree(S,.5,2.86,1,1,3.5);bush(S,.76,2.9,3);tree(S,1.62,2.34,.8,2,4.0);
        tree(S,1.18,2.86,.9,1,4.1);tree(S,2.12,2.86,.9,0,5.05);bush(S,1.4,2.88,3,4.3);bush(S,1.9,2.9,3,4.8);bush(S,2.3,2.9,2,5.25);
        ppl(S,[[1.36,1.84,0],[1.44,1.86,3],[1.7,1.88,4],[1.56,1.8,5],[.8,1.86,1],[2.3,1.84,0],[1.1,2.74,5],[2.0,2.74,0]],3.0);
        wheelchair(S,1.26,1.86,3.0);
        lamp(S,.88,1.96,18);lamp(S,2.4,1.96,18);lamp(S,2.4,2.92,18);lamp(S,1.46,2.92,18);lamp(S,1.8,2.92,18);lamp(S,2.92,1.96,18);
        return{};
      },
    ];
    const out=[];
    for(let v=0;v<3;v++){const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S)||{};S.run(g,ng);const[sc]=A.cv(W,H);
      const spr=K.finish(c,g,sc,nc,{fence:false});if(o.flagAt){spr.flagAt=o.flagAt;REP.flag['48_'+v]=o.flagAt;}
      ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';
      L.clipLot(c);L.clipLot(nc);
      out.push(spr);B['48_1_'+v]=spr;}
    for(const k of Object.keys(B)){const m=/^48_1_(\d+)$/.exec(k);if(m&&+m[1]>2)B[k]=out[(+m[1])%3];}
  }catch(e){REP.err.push('k48 '+(e&&e.stack||e));}
  // ================= k102 寵物醫院（1×1）=================
  try{
    const o0=B['102_1_0']||{w:72,h:112,ax:36,ay:110};const W=o0.w|0||72,H=o0.h|0||112,AX=o0.ax|0||36,AY=o0.ay|0||110;
    REP.keys[102]=[W,H,AX,AY];
    const K=A.iso575(W,H,AX,AY,1),L=LIB(K);
    const {P,hsh,RC,BL,lerp,fp,flat,boxZ,faceL,faceR,recL,recR,nL,nR,atL,atR,ICON,icon,courseL,courseR,ell,pave,lineU,lineV,stallsU,stallsV,fenceP,picket,car,lamp,tree,bush,ppl,shadow,CARC}=L;
    const BR={l:'#b0503c',r:'#823a2c',j:'#9c4533',jr:'#71322a'},ST={l:'#e6ddc8',r:'#b9ae96'};
    const GL={l:'#4d7090',r:'#3c5a74',h:'#8fb3cc'},LIT='#ffe3a2',LITR='#f3d68e';
    const VG='#2f7d5a',VGD='#22603f',VGH='#4f9e78',CREAM='#f3ead2',NBG='#fff3d6',NIC='#2a4a3a';
    const WD={l:'#caa06a',r:'#98733f',j:'#b58c58',jr:'#81602f',trim:'#f0ead8',trimR:'#c9c1ad'};
    const MOD={l:'#f1f1ee',r:'#c6c9ca',t:'#b9bcbc',an:'#3b4146',anR:'#2c3135',gl:'#5f8cab',glR:'#486d86',glH:'#a6c8dc'};
    // 四坡屋頂（屋脊沿長邊；先畫背坡再畫前坡）
    const hip=(g,u0,v0,u1,v1,he,hr,e,col)=>{const um=(u0+u1)/2,vm=(v0+v1)/2,du=u1-u0,dv=v1-v0;
      const E0=P(u0-e,v0-e,he),E1=P(u1+e,v0-e,he),E2=P(u1+e,v1+e,he),E3=P(u0-e,v1+e,he);let Ra,Rb;
      if(du>=dv){const r=dv/2+e;Ra=P(u0-e+r,vm,hr);Rb=P(u1+e-r,vm,hr);
        fp(g,[E0,E1,Rb,Ra],col.back);fp(g,[E0,Ra,E3],col.back);fp(g,[E3,E2,Rb,Ra],col.front);fp(g,[E1,E2,Rb],col.side);
        for(let i=1;i<col.n;i++){const t=i/col.n;BL(g,lerp(E3,Ra,t),lerp(E2,Rb,t),col.frontJ);BL(g,lerp(E2,Rb,t),lerp(E1,Rb,t),col.sideJ);}}
      else{const r=du/2+e;Ra=P(um,v0-e+r,hr);Rb=P(um,v1+e-r,hr);
        fp(g,[E0,E1,Ra],col.back);fp(g,[E0,Ra,Rb,E3],col.back);fp(g,[E3,E2,Rb],col.front);fp(g,[E1,E2,Rb,Ra],col.side);
        for(let i=1;i<col.n;i++){const t=i/col.n;BL(g,lerp(E3,Rb,t),lerp(E2,Rb,t),col.frontJ);BL(g,lerp(E2,Rb,t),lerp(E1,Ra,t),col.sideJ);}}
      BL(g,E3,E2,col.eave);BL(g,E2,E1,col.eaveD||col.eave);BL(g,Ra,Rb,col.ridge);BL(g,E2,Rb,col.ridge);return{Ra,Rb};};
    const hipH=(u0,v0,u1,v1,he,hr,e)=>{const r=Math.min(u1-u0,v1-v0)/2+e;return(u,v)=>Math.min(hr,he+(hr-he)*Math.max(0,Math.min(u-(u0-e),(u1+e)-u,v-(v0-e),(v1+e)-v))/r);};
    // 正面山牆雙坡（屋脊沿 v，山牆在 +v 立面；看得到 +u 坡）
    const gableV=(g,u0,v0,u1,v1,he,hr,e,col)=>{const um=(u0+u1)/2,s=(hr-he)/(u1-um),zE=he-s*e;
      fp(g,[P(um,v0-e,hr),P(um,v1+e,hr),P(u1+e,v1+e,zE),P(u1+e,v0-e,zE)],col.roof);
      for(let i=1;i<col.n;i++){const f=i/col.n,u=um+(u1+e-um)*f,z=hr+(zE-hr)*f;BL(g,P(u,v0-e,z),P(u,v1+e,z),col.roofJ);}
      BL(g,P(u1+e,v0-e,zE),P(u1+e,v1+e,zE),col.eave);
      fp(g,[P(u0,v1,he-.2),P(u1,v1,he-.2),P(um,v1,hr)],col.gable);
      if(col.gableJ)for(let z=he+2;z<hr-1;z+=2){const f=(z-he)/(hr-he),a=u0+(um-u0)*f,b=u1-(u1-um)*f;BL(g,P(a+1/32,v1,z),P(b-1/32,v1,z),col.gableJ);}
      for(let k=0;k<2;k++){const c=k?col.bargeD:col.barge;BL(g,[P(u0-e,v1+e,zE)[0],P(u0-e,v1+e,zE)[1]+k],[P(um,v1+e,hr)[0],P(um,v1+e,hr)[1]+k],c);
        BL(g,[P(um,v1+e,hr)[0],P(um,v1+e,hr)[1]+k],[P(u1+e,v1+e,zE)[0],P(u1+e,v1+e,zE)[1]+k],c);}
      BL(g,P(um,v1+e,hr),P(um,v0-e,hr),col.ridge);return{um,zE};};
    // 從屋面升起的量體（煙囪）：兩個可見面的下緣沿屋面高度走
    const riseBox=(g,a0,b0,a1,b1,zt,RH,top,left,right)=>{const N=16,Lp=[],Rp=[];
      for(let i=0;i<=N;i++){const u=a0+(a1-a0)*i/N;Lp.push(P(u,b1,RH(u,b1)));}
      for(let i=0;i<=N;i++){const v=b0+(b1-b0)*i/N;Rp.push(P(a1,v,RH(a1,v)));}
      if(left)fp(g,[...Lp,P(a1,b1,zt),P(a0,b1,zt)],left);if(right)fp(g,[...Rp,P(a1,b1,zt),P(a1,b0,zt)],right);
      if(top)fp(g,[P(a0,b0,zt),P(a1,b0,zt),P(a1,b1,zt),P(a0,b1,zt)],top);};
    // 直立招牌圖塊（外框＋底＋圖示）
    const tileAt=(g,n,x,y,w,h,o)=>{RC(g,x,y,w,h,o.fr);RC(g,x+1,y+1,w-2,h-2,o.bg);o.draw(g,x+1,y+1,false);if(n){RC(n,x+1,y+1,w-2,h-2,o.nbg||NBG);o.draw(n,x+1,y+1,true);}};
    const CATS=['#.#','###','.#.','###'];
    // 狗（細線層）：[u,v,毛色,反向]
    const DOGC=[['#8a5a34','#5e3c22'],['#f2efe8','#b9b1a2'],['#2e2b28','#171514'],['#d9a54a','#a87a2e']];
    const dogs=(S,list,d)=>S.t(d,(g)=>{for(const [u,v,k,fl] of list){const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),c=DOGC[k%DOGC.length];
      for(let r=0;r<4;r++)for(let cc=0;cc<6;cc++)if(ICON.dog[r][cc]==='#'){const X=fl?x+2-cc:x-3+cc;RC(g,X,y-4+r,1,1,(r===3||(r===0&&cc>=4))?c[1]:c[0]);}}});
    // 牽狗的人：人在 (u,v)，狗在右前方，1px 牽繩
    const walker=(S,u,v,pk,dk,d)=>{ppl(S,[[u,v,pk]],d);S.t(d+.001,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),c=DOGC[dk];
      for(let r=0;r<4;r++)for(let cc=0;cc<6;cc++)if(ICON.dog[r][cc]==='#')RC(g,x+4+cc,y-3+r,1,1,(r===3||(r===0&&cc>=4))?c[1]:c[0]);
      BL(g,[x+2,y-4],[x+8,y-4],'#6a4a3a');});};
    // 立牌（對角朝街、直立）：腳印＋綠十字
    const postSign=(S,u,v,h,d,o={})=>S.t(d,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#4a5157');RC(g,x,y-h,1,h,'#4a5157');
      if(o.arm){RC(g,x,y-h,7,1,'#4a5157');RC(g,x+2,y-h+1,1,1,'#4a5157');RC(g,x+5,y-h+1,1,1,'#4a5157');}
      const bx=o.arm?x:x-4,by=o.arm?y-h+2:y-h-7;
      if(o.pair){if(o.arm){RC(g,x+7,y-h,5,1,'#4a5157');RC(g,x+10,y-h+1,1,1,'#4a5157');}
        tileAt(g,n,bx,by,14,8,{fr:o.fr||VGD,bg:o.bg||CREAM,draw:(gg,xx,yy,ni)=>{icon(gg,xx+1,yy+2,ICON.dog,ni?NIC:(o.ic||VG));icon(gg,xx+7,yy+1,ICON.cat,ni?NIC:(o.ic||VG));}});return;}
      tileAt(g,n,bx,by,9,8,{fr:o.fr||VGD,bg:o.bg||CREAM,draw:(gg,xx,yy,ni)=>{icon(gg,xx+1,yy+1,ICON.paw,ni?NIC:(o.ic||VG));}});});
    const wall2=(g,v1,u0,u1,u1b,v0,za,zb,cl,cr)=>{recL(g,v1,u0,u1,0,nL(v1,u0,u1),za,zb,cl);recR(g,u1b,v0,v1,0,nR(u1b,v0,v1),za,zb,cr);};
    const layouts=[
      // ---------- v0 磚造：兩層紅磚四坡頂＋櫥窗綠雨遮＋貓狗招牌；前左遛狗草地（白木樁柵欄）；右側車位 ----------
      (g,ng,S)=>{
        pave(g,'w',0,0,1,1,1021);
        pave(g,'a',.7,.04,.26,.92,1022);lineU(g,.36,.72,.95,'#e2ded4');lineU(g,.64,.72,.95,'#e2ded4');lineV(g,.7,.04,.96,'#d8d3c6');
        pave(g,'g',.04,.66,.46,.3,1023);
        flat(g,.52,.6,.16,.37,'#c9b49a');for(let v=.64;v<.97;v+=.06)BL(g,P(.52,v),P(.68,v),'#b09c84');
        shadow(g,[['b',.08,.08,.6,.52,44]]);
        const u0=.08,v0=.08,u1=.68,v1=.6,Hw=35;
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,Hw,null,BR.l,BR.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          courseL(g,v1,u0,u1,2,Hw-2,BR.j,3);courseR(g,u1,v0,v1,2,Hw-2,BR.jr,3);
          wall2(g,v1,u0,u1,u1,v0,0,2,ST.l,ST.r);wall2(g,v1,u0,u1,u1,v0,21,23,ST.l,ST.r);wall2(g,v1,u0,u1,u1,v0,Hw-2,Hw,ST.l,ST.r);
          recL(g,v1,u0,u1,N-1,N,2,Hw-2,ST.l);recR(g,u1,v0,v1,0,1,2,Hw-2,ST.r);
          // 櫥窗（窗內坐著一隻貓）
          recL(g,v1,u0,u1,1,11,2,11,'#f2efe6');recL(g,v1,u0,u1,2,10,3,10,GL.l);recL(g,v1,u0,u1,6,7,3,10,'#f2efe6');recL(g,v1,u0,u1,2,3,7,10,GL.h);
          if(n){recL(n,v1,u0,u1,2,6,3,10,LIT);recL(n,v1,u0,u1,7,10,3,10,LIT);}
          {const [x,y]=atL(v1,u0,u1,7,7);icon(g,x,y,CATS,'#2e2b28');if(n)icon(n,x,y,CATS,'#4a3a2a');}
          // 門＋門燈
          recL(g,v1,u0,u1,12,17,0,11,'#f2efe6');recL(g,v1,u0,u1,13,16,0,10,VG);recL(g,v1,u0,u1,14,15,5,9,GL.l);recL(g,v1,u0,u1,13,16,0,1,VGD);
          if(n)recL(n,v1,u0,u1,14,15,5,9,LIT);
          {const [x,y]=atL(v1,u0,u1,18,12);RC(g,x,y,1,1,'#2c3136');RC(g,x,y+1,1,1,'#f3e6b8');if(n){RC(n,x,y+1,1,1,'#ffe7b0');}}
          // 綠白條紋雨遮
          {const ua=u0+.5/32,ub=u0+17.5/32,e=.08;fp(g,[P(ua,v1,13.5),P(ub,v1,13.5),P(ub,v1+e,11),P(ua,v1+e,11)],'#f3f0e6');
            for(let i=0;i<17;i+=2){const a=ua+(i+.5)/32;BL(g,P(a,v1,13.5),P(a,v1+e,11),VG);}
            const NN=nL(v1+e,ua,ub);recL(g,v1+e,ua,ub,0,NN,9.5,11,VG);for(let i=1;i<NN;i+=4)recL(g,v1+e,ua,ub,i,i+2,9.5,11,'#f3f0e6');}
          // 招牌：狗＋貓兩塊直立圖塊，沿牆斜面下移
          {const t1=atL(v1,u0,u1,2,21),t2=atL(v1,u0,u1,10,21);
            tileAt(g,n,t1[0],t1[1],8,7,{fr:VGD,bg:CREAM,draw:(gg,x,y,ni)=>icon(gg,x,y+1,ICON.dog,ni?NIC:VG)});
            tileAt(g,n,t2[0],t2[1],8,7,{fr:VGD,bg:CREAM,draw:(gg,x,y,ni)=>icon(gg,x+1,y,ICON.cat,ni?NIC:VG)});}
          // 二樓窗
          for(const c0 of [2,8,14]){recL(g,v1,u0,u1,c0-1,c0+4,24,32,'#f2efe6');recL(g,v1,u0,u1,c0,c0+3,25,31,GL.l);recL(g,v1,u0,u1,c0+1,c0+2,25,31,'#f2efe6');recL(g,v1,u0,u1,c0,c0+1,28,31,GL.h);
            if(n&&hsh(1025,c0,1)<.67)recL(n,v1,u0,u1,c0,c0+3,25,31,LIT);}
          for(const c0 of [3,11])for(const [za,zb] of [[3,10],[25,31]]){recR(g,u1,v0,v1,c0-1,c0+4,za-1,zb+1,'#c9c1ad');recR(g,u1,v0,v1,c0,c0+3,za,zb,GL.r);recR(g,u1,v0,v1,c0+1,c0+2,za,zb,'#c9c1ad');
            if(n&&hsh(1026,c0,za)<.6)recR(n,u1,v0,v1,c0,c0+3,za,zb,LITR);}
          // 四坡石板屋頂＋煙囪
          hip(g,u0,v0,u1,v1,Hw,Hw+11,.035,{back:'#4d5560',front:'#68717c',side:'#4f5660',n:4,frontJ:'#5b636e',sideJ:'#434952',eave:'#2f343b',eaveD:'#2a2e34',ridge:'#7d8691'});
          const RH=hipH(u0,v0,u1,v1,Hw,Hw+11,.035);riseBox(g,.5,.18,.57,.25,Hw+15,RH,'#5a4038',BR.l,BR.r);
          boxZ(g,.49,.17,.09,.09,Hw+15,1,'#8a8f94','#a4a9ad','#7a7f84');});
        // 遛狗區（白木樁柵欄；背欄→狗→前欄）
        S.t(1.5,(g)=>{picket(g,[.06,.67],[.5,.67]);picket(g,[.06,.67],[.06,.95]);});
        dogs(S,[[.2,.8,0,0],[.36,.88,1,1]],1.6);
        S.t(1.62,(g)=>{const p=P(.14,.72),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#3d7fb8');RC(g,x,y-1,1,1,'#8fc1e6');});
        S.t(1.9,(g)=>{picket(g,[.06,.95],[.5,.95]);picket(g,[.5,.67],[.5,.95]);});
        walker(S,.58,.82,5,3,1.95);
        car(S,.78,.42,false,CARC[4],1.4);
        bush(S,.7,.66,2,1.45);tree(S,.88,.14,.8,0,1.1);
        return{};
      },
      // ---------- v1 木構：一層半木板屋（正面山牆、門廊）；東側遛狗區（木欄、狗屋）；前左車位 ----------
      (g,ng,S)=>{
        pave(g,'w',0,0,1,1,1031);
        pave(g,'g',.66,.04,.3,.58,1032);pave(g,'d',.72,.34,.18,.16,1033);
        pave(g,'c',.04,.74,.42,.22,1034);lineV(g,.08,.76,.94,'#e2ded4');lineV(g,.34,.76,.94,'#e2ded4');
        for(let v=.74;v<.95;v+=.07)flat(g,.5,v,.1,.045,'#b9b3a6');
        shadow(g,[['b',.1,.08,.52,.46,40],['b',.1,.54,.52,.19,15]]);
        const u0=.1,v0=.08,u1=.62,v1=.54,he=19,hr=34;
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,he,null,WD.l,WD.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          courseL(g,v1,u0,u1,2,he,WD.j,2);courseR(g,u1,v0,v1,2,he,WD.jr,2);
          wall2(g,v1,u0,u1,u1,v0,0,2,'#6b5a48','#54463a');
          recL(g,v1,u0,u1,0,1,2,he,WD.trim);recL(g,v1,u0,u1,N-1,N,2,he,WD.trim);recR(g,u1,v0,v1,0,1,2,he,WD.trimR);recR(g,u1,v0,v1,M-1,M,2,he,WD.trimR);
          const dc=N>>1;
          recL(g,v1,u0,u1,dc-2,dc+2,2,12,WD.trim);recL(g,v1,u0,u1,dc-1,dc+1,2,11,'#7a3f2a');recL(g,v1,u0,u1,dc-1,dc+1,7,10,GL.l);if(n)recL(n,v1,u0,u1,dc-1,dc+1,7,10,LIT);
          for(const c0 of [2,N-6]){recL(g,v1,u0,u1,c0-1,c0+5,3,12,WD.trim);recL(g,v1,u0,u1,c0,c0+4,4,11,GL.l);recL(g,v1,u0,u1,c0+2,c0+3,4,11,WD.trim);recL(g,v1,u0,u1,c0,c0+1,8,11,GL.h);
            if(n)recL(n,v1,u0,u1,c0,c0+4,4,11,LIT);}
          for(const c0 of [3,10])if(c0+3<M){recR(g,u1,v0,v1,c0-1,c0+4,4,13,WD.trimR);recR(g,u1,v0,v1,c0,c0+3,5,12,GL.r);recR(g,u1,v0,v1,c0+1,c0+2,5,12,WD.trimR);
            if(n&&hsh(1035,c0,1)<.7)recR(n,u1,v0,v1,c0,c0+3,5,12,LITR);}
          gableV(g,u0,v0,u1,v1,he,hr,.04,{roof:'#3f6b58',roofJ:'#345a4a',n:6,eave:'#23352d',gable:WD.l,gableJ:WD.j,barge:WD.trim,bargeD:'#cfc6b0',ridge:'#5b8a74'});
          // 山牆圓徽（腳印）
          {const q=P((u0+u1)/2,v1,he+8),x=rnd(q[0]),y=rnd(q[1]);ell(g,x,y,4,4,VGD);ell(g,x,y,3,3,CREAM);icon(g,x-2,y-2,ICON.paw,VG);
            if(n){ell(n,x,y,3,3,NBG);icon(n,x-2,y-2,ICON.paw,NIC);}}
          // 鐵皮煙管
          {const q=P(.52,.22,he+(hr-he)*.4),x=rnd(q[0]),y=rnd(q[1]);RC(g,x,y-7,2,7,'#5a6166');RC(g,x,y-7,1,7,'#7c848a');RC(g,x-1,y-8,4,1,'#3e4449');}});
        // 門廊（木地板、白柱、欄杆、單坡屋頂、廊燈）
        S.o(1.5,(g,n)=>{const ua=u0+.02,ub=u1-.02,dp=.17,ze=he-1;
          boxZ(g,ua,v1,ub-ua,dp,0,2,'#b58a55','#c99f67','#98733f');
          for(let u=ua+.05;u<ub;u+=.06)BL(g,P(u,v1+.01,2),P(u,v1+dp-.01,2),'#a67f4c');
          boxZ(g,ua+.16,v1+dp,.16,.05,0,1,'#b58a55','#c99f67','#98733f');
          for(const u of [ua+.01,ub-.035])boxZ(g,u,v1+dp-.03,.025,.025,2,ze-4,WD.trim,WD.trim,'#cfc6b0');
          for(const [a,b] of [[ua+.03,ua+.15],[ub-.14,ub-.03]]){BL(g,P(a,v1+dp-.015,7),P(b,v1+dp-.015,7),WD.trim);for(let u=a+.03;u<b;u+=.04){const p=P(u,v1+dp-.015,2);RC(g,p[0],p[1]-5,1,5,'#e2dac6');}}
          // 門廊單坡：比主屋頂淺一階的銅綠鐵皮，壓低貼著山牆底，讓山牆三角完整露出
          fp(g,[P(ua-.03,v1,ze),P(ub+.03,v1,ze),P(ub+.03,v1+dp+.02,ze-2.5),P(ua-.03,v1+dp+.02,ze-2.5)],'#5f8f78');
          for(let u=ua+.03;u<ub;u+=.07)BL(g,P(u,v1+.01,ze-.1),P(u,v1+dp+.01,ze-2.4),'#4f7d68');
          faceL(g,v1+dp+.02,ua-.03,ub+.03,ze-3.5,ze-2.5,WD.trim);faceR(g,ub+.03,v1,v1+dp+.02,ze-3.5,ze-2.5,'#cfc6b0');
          {const q=P((ua+ub)/2+.07,v1+.02,ze-4),x=rnd(q[0]),y=rnd(q[1]);RC(g,x,y,1,1,'#2c3136');RC(g,x,y+1,1,1,'#f3e6b8');if(n){RC(n,x,y+1,1,1,'#ffe7b0');}}});
        // 東側遛狗區：木欄（背、內側）→狗屋→狗→前欄
        const FW={h:5,post:'#6e5034',rail:'#a67f4c',mid:'#8e6a40',solid:1,step:6};
        S.t(1.2,(g)=>{fenceP(g,[.66,.05],[.95,.05],null,FW);fenceP(g,[.66,.05],[.66,.6],null,FW);});
        S.o(1.25,(g)=>{boxZ(g,.8,.1,.1,.1,0,5,null,'#b8503a','#8a3a2a');const m=.85;
          fp(g,[P(.79,.09,5),P(m,.09,8),P(m,.21,8),P(.79,.21,5)],'#4d5560');fp(g,[P(m,.09,8),P(.91,.09,5),P(.91,.21,5),P(m,.21,8)],'#3d434b');
          fp(g,[P(.8,.2,5),P(.9,.2,5),P(m,.2,8)],'#b8503a');recL(g,.2,.8,.9,1,3,0,3,'#2a1e18');});
        tree(S,.9,.08,.8,1,1.22);
        dogs(S,[[.78,.5,3,1],[.84,.28,2,0]],1.35);
        S.t(1.37,(g)=>{const p=P(.72,.24),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-1,3,1,'#c9362b');RC(g,x,y-2,1,1,'#e8e4dc');});
        S.t(1.45,(g)=>{fenceP(g,[.95,.05],[.95,.6],null,FW);fenceP(g,[.66,.6],[.95,.6],[.3,.55],FW);});
        bush(S,.06,.66,2,1.7);
        car(S,.14,.8,true,CARC[3],1.95);
        walker(S,.44,.9,0,1,1.98);
        postSign(S,.92,.7,15,2.1,{arm:1,pair:1});
        return{};
      },
      // ---------- v2 現代玻璃：平頂白盒兩層＋轉角落地玻璃＋玻璃候診翼＋懸挑雨遮＋屋頂燈箱；前左人工草皮遛狗區；前右車位 ----------
      (g,ng,S)=>{
        pave(g,'w',0,0,1,1,1041);
        pave(g,'t',.04,.64,.44,.32,1042);
        pave(g,'a',.62,.62,.34,.34,1043);lineV(g,.66,.64,.95,'#e2ded4');lineV(g,.88,.64,.95,'#e2ded4');
        pave(g,'g',.88,.04,.08,.54,1044);
        shadow(g,[['b',.06,.06,.56,.44,40],['b',.62,.2,.24,.3,14]]);
        const u0=.06,v0=.06,u1=.62,v1=.5,Hm=29;
        S.o(1,(g,n)=>{
          boxZ(g,u0,v0,u1-u0,v1-v0,0,Hm,MOD.t,MOD.l,MOD.r);
          const N=nL(v1,u0,u1),M=nR(u1,v0,v1);
          // 一樓：整面落地玻璃（深框、每 4 欄一支豎框）＋玻璃門
          recL(g,v1,u0,u1,0,N,0,12,MOD.an);recL(g,v1,u0,u1,1,N-1,1,11,MOD.gl);for(let i=4;i<N-1;i+=4)recL(g,v1,u0,u1,i,i+1,1,11,MOD.an);
          recL(g,v1,u0,u1,1,N-1,10,11,MOD.glH);
          recL(g,v1,u0,u1,10,14,1,10,'#8fb8d0');recL(g,v1,u0,u1,12,13,1,10,MOD.an);
          if(n){recL(n,v1,u0,u1,1,N-1,1,10,'#fff0c8');for(let i=4;i<N-1;i+=4)recL(n,v1,u0,u1,i,i+1,1,10,'#6a5a40');}
          recR(g,u1,v0,v1,0,M,0,12,MOD.anR);recR(g,u1,v0,v1,1,M-1,1,11,MOD.glR);for(let i=4;i<M-1;i+=4)recR(g,u1,v0,v1,i,i+1,1,11,MOD.anR);
          if(n)recR(n,u1,v0,v1,1,M-1,1,10,'#f0dca8');
          // 二樓：白牆＋深色框帶狀窗
          recL(g,v1,u0,u1,1,N-1,16,24,MOD.an);recL(g,v1,u0,u1,2,N-2,17,23,MOD.gl);recL(g,v1,u0,u1,2,N-2,22,23,MOD.glH);for(let i=6;i<N-2;i+=5)recL(g,v1,u0,u1,i,i+1,17,23,MOD.an);
          recR(g,u1,v0,v1,2,M-2,16,24,MOD.anR);recR(g,u1,v0,v1,3,M-3,17,23,MOD.glR);
          if(n){for(let i=2;i<N-2;i++)if(hsh(1045,(i/5)|0,1)<.7&&(i-6)%5!==0)recL(n,v1,u0,u1,i,i+1,17,22,'#eaf3ff');recR(n,u1,v0,v1,3,M-3,17,22,'#dfe9f5');}
          wall2(g,v1,u0,u1,u1,v0,Hm-2,Hm,'#fafaf8','#d6d8d8');
          flat(g,u0+.03,v0+.03,u1-u0-.06,v1-v0-.06,'#aeb2b2',Hm);
          boxZ(g,.14,.12,.12,.1,Hm,4,'#c9ced1','#dde1e3','#a9b0b4');});
        // 玻璃候診翼＋懸挑雨遮
        S.o(1.3,(g,n)=>{const a0=.62,a1=.86,b0=.2,h=12;
          boxZ(g,a0,b0,a1-a0,v1-b0,0,h,null,'#8fb8d0','#5f8cab');
          const N=nL(v1,a0,a1),M=nR(a1,b0,v1);for(let i=0;i<N;i+=3)recL(g,v1,a0,a1,i,i+1,0,h,'#e8ecec');for(let i=0;i<M;i+=3)recR(g,a1,b0,v1,i,i+1,0,h,'#b8c0c2');
          if(n){for(let i=0;i<N;i++)if(i%3)recL(n,v1,a0,a1,i,i+1,1,h-2,'rgba(255,236,190,.6)');for(let i=0;i<M;i++)if(i%3&&hsh(1046,(i/3)|0,1)<.6)recR(n,a1,b0,v1,i,i+1,1,h-2,'rgba(255,236,190,.45)');}
          boxZ(g,a0-.01,b0-.01,a1-a0+.02,v1-b0+.01,h,2,'#e9ebea','#fafaf8','#d0d3d3');
          // 懸挑雨遮（橫跨正面）
          boxZ(g,u0,v1,a1-u0+.01,.11,11,2,'#e9ebea','#fafaf8','#d0d3d3');
          faceL(g,v1+.11,u0,a1+.01,11,12,MOD.an);
          if(n){for(const t of [.2,.34,.48]){const q=P(t,v1+.1,11);RC(n,q[0],q[1],2,1,'#fff0c0');}}
          faceL(g,v1+.11,u0,a1+.01,12,13,'#1f6f6a');faceR(g,a1+.01,v1,v1+.11,12,13,'#185955');});
        // 屋頂燈箱（斜對街角、直立）
        S.o(1.05,(g,n)=>{const c=P(.36,.3,Hm),x=rnd(c[0]),y=rnd(c[1]);
          RC(g,x-6,y-4,1,4,'#4a5157');RC(g,x+6,y-4,1,4,'#4a5157');
          RC(g,x-9,y-14,19,10,'#1f6f6a');RC(g,x-8,y-13,17,8,'#f7f7f4');
          icon(g,x-7,y-11,ICON.dog,'#1f6f6a');icon(g,x+3,y-13,ICON.cat,'#1f6f6a');icon(g,x-1,y-12,ICON.plus,'#d1352b');
          if(n){RC(n,x-8,y-13,17,8,'#f0fbff');icon(n,x-7,y-11,ICON.dog,'#1b3a38');icon(n,x+3,y-13,ICON.cat,'#1b3a38');icon(n,x-1,y-12,ICON.plus,'#ff4a3c');}});
        // 人工草皮遛狗區：金屬欄、跨欄、狗
        const FM={h:5,post:'#6d767c',rail:'#aab2b7',mid:'#8e979c',step:6};
        S.t(1.4,(g)=>{fenceP(g,[.05,.64],[.48,.64],null,FM);fenceP(g,[.05,.64],[.05,.95],null,FM);
          const a=P(.18,.76),b=P(.3,.76);RC(g,a[0],a[1]-4,1,4,'#e8e4dc');RC(g,b[0],b[1]-4,1,4,'#e8e4dc');BL(g,[a[0],a[1]-3],[b[0],b[1]-3],'#d1352b');RC(g,rnd((a[0]+b[0])/2),rnd((a[1]+b[1])/2)-3,1,1,'#f2f0ea');});
        dogs(S,[[.22,.86,2,0],[.38,.78,3,1]],1.5);
        S.t(1.8,(g)=>{fenceP(g,[.05,.95],[.48,.95],null,FM);fenceP(g,[.48,.64],[.48,.95],[.35,.7],FM);});
        car(S,.73,.7,false,CARC[2],1.6);
        ppl(S,[[.56,.66,2],[.54,.8,3]],1.7);
        tree(S,.92,.12,.8,2,1.1);bush(S,.92,.4,2,1.35);
        lamp(S,.6,.95,14,1.9);
        return{};
      },
    ];
    const out=[];
    for(let v=0;v<3;v++){const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S)||{};S.run(g,ng);const[sc]=A.cv(W,H);
      const spr=K.finish(c,g,sc,nc,{fence:false});if(o.flagAt){spr.flagAt=o.flagAt;REP.flag['102_'+v]=o.flagAt;}
      ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';
      L.clipLot(c);L.clipLot(nc);
      out.push(spr);B['102_1_'+v]=spr;}
    for(const k of Object.keys(B)){const m=/^102_1_(\d+)$/.exec(k);if(m&&+m[1]>2)B[k]=out[(+m[1])%3];}
  }catch(e){REP.err.push('k102 '+(e&&e.stack||e));}

  if(REP.err.length)throw new Error('civ_g: '+REP.err.join(' | '));
});
