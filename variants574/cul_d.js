// T614 cul_d：k44 會展中心（3×3，畫布 208×220 錨 104,218）／k47 植物園（3×3，同尺寸），實驗線文化休閒第三刀重畫。
//   k44 v0 連續拱頂展覽館（四跨橫向筒拱、端面扇形玻璃）＋前置玻璃大廳＋旗桿列＋計程車道＋右側停車場＋右側卸貨碼頭
//       v1 平頂大跨度展覽館（屋頂外露鋼桁架＋天窗帶）＋左側玻璃塔樓＋車寄雨棚＋噴泉廣場＋旗桿列＋停車場＋卸貨碼頭
//       v2 雙館（兩座鋸齒屋頂展館）＋中央玻璃山牆連通廊＋中軸旗桿步道＋兩側停車與遊覽車位＋館間與右側卸貨碼頭
//   k47 v0 維多利亞穹頂溫室（中央穹頂＋兩翼筒拱）＋法式花圃格網＋軸線水池噴泉＋入口小屋
//       v1 長拱溫室群（主館兩段式拱頂＋兩座育苗長拱溫室）＋蓮花池木橋＋花境步道
//       v2 現代玻璃塊溫室（三個高低玻璃方塊階梯組合：高塊斜交網格、招牌帶 BOTANIC）＋戶外園（草坪、岩石園、曲線步道、池塘）＋遊客中心咖啡館
// T614 重試輪：靜態旗面改真實國旗構圖（直三色／橫三帶／北歐十字／日章／角旗）；斑馬線改 2px 等寬條；排班計程車拉開車距；
//   k47 v2 折板山牆（遠看像教堂）改成玻璃方塊群，咖啡館招牌移到屋頂立牌、入口改耐候鋼板標牌牆。
// T614 第二次重試（k47 v2 退件）：高塊與中塊改綠色溫室玻璃、亮面玻璃後緊貼大樹冠與棕櫚葉；三塊屋頂改玻璃頂透出樹冠；
//   大廳拿掉 BOTANIC 招牌帶（整面玻璃透出植栽），改成站在大廳屋頂前緣 2px 字座上的立體字；高塊夜光由大菱形格改成兩道 1px 步道燈帶；
//   戶外樹木按種類成群（池畔櫻花叢、主步道南側楓樹列、外圍綠樹），主步道北側一列步道燈，中央草坪加收邊、花境、雕塑花床與腰形花床。
// 分層合成（沿用 trans_a／cul_b）：地坪直接畫在地面層；立體件走分層場景（各自二值化＋深色外框），依深度由後往前；
// 細線件（人、燈桿、旗桿、欄杆）走不描邊層。曲面（筒拱、穹頂、圓鼓座）用逐像素光線投射：等距視線沿 t=u+v 朝觀者，
// 每像素取各實體進入點最大者；法向量點乘光向（光從左：+v 面亮、+u 面暗）分五階上色，格柵線由相鄰像素的格位差畫出。
// 夜圖只點白天畫出的燈具、窗、玻璃格、招牌；零亂數：只用 K.hsh。
(window.__variants574=window.__variants574||[]).push(function cul_d(A){
  // 注入測試時本批次排在內嵌 b0x 之前 ⇒ 不是最後一棒就把本體排到隊尾再跑（同 cul_a／cul_b）
  const QL=window.__variants574||[];
  if(!cul_d.__late&&QL.indexOf(cul_d)>=0&&QL.indexOf(cul_d)<QL.length-1){cul_d.__late=1;QL.push(function cul_d_late(A2){cul_d(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{44:[1,2,0]}；定稿必須是 {}
  const errs=[],chk=[];
  const dims=(k,d)=>{const o=B[k+'_1_0'];return o&&o.w&&o.h?[o.w|0,o.h|0,o.ax|0,o.ay|0]:d;};
  const WHT='#e6e2d6',YEL='#d6b243';
  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    N:['101','111','111','111','101'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],X:['101','101','010','101','101'],Y:['101','101','010','010','010']};

  // ================= 共用工具 =================
  const LIB=(K,W,H)=>{
    const {P,hsh,AX,TOPY,SZ}=K;
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
    const lnL=(g,v,ua,ub,z,c)=>BL(g,P(ua,v,z),P(ub,v,z),c);
    const lnR=(g,u,va,vb,z,c)=>BL(g,P(u,va,z),P(u,vb,z),c);
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 地面橢圓（等距圓）：中心 (u,v)、半徑 r 格
    const disc=(g,u,v,r,c,z=0)=>{const pts=[];for(let i=0;i<40;i++){const a=i/40*Math.PI*2;pts.push(P(u+r*Math.cos(a),v+r*Math.sin(a),z));}fp(g,pts,c);};
    const ring=(g,u,v,r,c,z=0,N=40)=>{for(let i=0;i<N;i++){const a=i/N*Math.PI*2,b=(i+1)/N*Math.PI*2;BL(g,P(u+r*Math.cos(a),v+r*Math.sin(a),z),P(u+r*Math.cos(b),v+r*Math.sin(b),z),c);}};
    // 分層場景：o＝立體件（二值化＋描外框）、t＝細線層（不描邊，相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子向右）：['b',u0,v0,du,dv,h,z]／['p',u,v,h]／['c',u,v,r,z0,z1]（直立圓柱）／['d',u,v,r,h,z0]（穹頂）
    const shadow=(g,list,a=.26)=>{const[sc,sx]=A.cv(W,H),C='#10151a';
      const F=(u0,v0,u1,v1,k)=>[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
      const circ=(u,v,r,z)=>{const k=z/64,pts=[];for(let i=0;i<28;i++){const t=i/28*Math.PI*2;pts.push(P(u+k+r*Math.cos(t),v-k*.45+r*Math.sin(t)));}fp(sx,pts,C);};
      for(const s of list){
        if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k0=z/64,k1=(z+h)/64,u1=u0+du,v1=v0+dv;const A0=F(u0,v0,u1,v1,k0),A1=F(u0,v0,u1,v1,k1);
          fp(sx,A0,C);fp(sx,A1,C);for(let i=0;i<4;i++)fp(sx,[A0[i],A0[(i+1)%4],A1[(i+1)%4],A1[i]],C);}
        else if(s[0]==='p'){const[,u,v,h]=s,a2=P(u,v),b2=P(u+h/64,v-.45*h/64);BL(sx,a2,b2,C);}
        else if(s[0]==='c'){const[,u,v,r,z0,z1]=s;for(let z=z0;z<=z1;z+=2)circ(u,v,r,z);}
        else if(s[0]==='d'){const[,u,v,r,h,z0=0]=s;for(let k=0;k<=10;k++){const f=k/10;circ(u,v,r*Math.sqrt(1-f*f),z0+h*f);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};

    // ---------- 地坪 ----------
    const MATS={
      c:{t:['#c7c3b8','#c1bdb2','#cdc9be'],j:'#b9b5aa',s:.25,p:.6},      // 混凝土
      a:{t:['#6d6b67','#686662','#73716c'],j:null,s:.125,p:.7},          // 瀝青
      q:{t:['#cdbf9f','#c6b898','#d3c6a7'],j:null,s:.125,p:.7},          // 細碎石步道（淺暖）
      g:{t:['#78a255','#70994e','#80a95c'],j:null,s:.125,p:.65},         // 草
      m:{t:['#86b05f','#7ea858','#8eb866'],j:null,s:.125,p:.7},          // 修剪草坪（較亮）
      z:{t:['#d4cdbd','#cec7b7','#d9d2c2'],j:'#c6bfaf',s:.25,p:.55},     // 廣場石材鋪面（淺暖灰）
      r:{t:['#b58f78','#ad8770','#bd9780'],j:'#a47f69',s:.25,p:.55},     // 紅磚鋪面
      s:{t:['#cbc7bd','#c6c2b8','#d0ccc2'],j:null,s:.25,p:.6},           // 人行道
      d:{t:['#7a5c44','#735640','#805f47'],j:null,s:.125,p:.7},          // 花圃土
    };
    const pave=(g,m,u0,v0,du,dv,seed)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      if(M.j){for(let a=u0+s;a<u0+du-1e-6;a+=s)BL(g,P(a,v0+.04),P(a,v0+dv-.04),M.j);for(let b=v0+s;b<v0+dv-1e-6;b+=s)BL(g,P(u0+.04,b),P(u0+du-.04,b),M.j);}
      if(m==='a'){for(let i=0;i<rnd(du*dv*10);i++){const p=P(u0+hsh(seed,i,31)*du,v0+hsh(seed,i,32)*dv);RC(g,p[0],p[1],2,1,hsh(seed,i,33)<.5?'#62605c':'#7a7873');}}
      if(m==='g'||m==='m'){for(let i=0;i<rnd(du*dv*22);i++){const p=P(u0+hsh(seed,i,61)*du,v0+hsh(seed,i,62)*dv);RC(g,p[0],p[1]-1,1,2,hsh(seed,i,63)<.5?'#5f8a41':'#93bb68');}}};
    const lineU=(g,v,u0,u1,c)=>BL(g,P(u0,v),P(u1,v),c);
    const lineV=(g,u,v0,v1,c)=>BL(g,P(u,v0),P(u,v1),c);
    const dashU=(g,v,u0,u1,c,on=.1,off=.08)=>{for(let t=u0;t<u1-.02;t+=on+off)BL(g,P(t,v),P(Math.min(u1,t+on),v),c);};
    const dashV=(g,u,v0,v1,c,on=.1,off=.08)=>{for(let t=v0;t<v1-.02;t+=on+off)BL(g,P(u,t),P(u,Math.min(v1,t+on)),c);};
    const YEL='#d6b243',WHT='#e6e2d6';
    const stallsU=(g,u0,v0,du,n,dv=.2,c=WHT)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),c);}};
    const stallsV=(g,u0,v0,dv,n,du=.2,c=WHT)=>{for(let k=0;k<=n;k++){const v=v0+dv*k/n;BL(g,P(u0,v),P(u0+du,v),c);}};
    // 斑馬線：條寬 1/16 格（螢幕上正好 2px×1px 的斜帶）、週期 1/8 格，起點對齊 1/32 格 ⇒ 每條同寬、不碎成棋盤格
    const zebraU=(g,u0,u1,v0,v1)=>{u0=Math.round(u0*32)/32;for(let u=u0;u<u1-.03;u+=.125)flat(g,u,v0,.0625,v1-v0,'#e8e5dc');};
    const zebraV=(g,v0,v1,u0,u1)=>{v0=Math.round(v0*32)/32;for(let v=v0;v<v1-.03;v+=.125)flat(g,u0,v,u1-u0,.0625,'#e8e5dc');};
    const curb=(g,u0,v0,du,dv,top='#d9d6ce')=>{boxZ(g,u0,v0,du,dv,0,1,top,'#b3aea4','#96918a');};

    // ---------- 軸向工具：b＝沿長向、a＝橫向 ----------
    const AXF=(ax)=>({
      pt:(b,a,z=0)=>ax==='u'?P(b,a,z):P(a,b,z),
      bx:(g,b0,db,a0,da,z,h,t,l,r)=>ax==='u'?boxZ(g,b0,a0,db,da,z,h,t,l,r):boxZ(g,a0,b0,da,db,z,h,t,l,r),
      side:(g,a,b0,b1,za,zb,c)=>ax==='u'?faceL(g,a,b0,b1,za,zb,c):faceR(g,a,b0,b1,za,zb,c),
      end:(g,b,a0,a1,za,zb,c)=>ax==='u'?faceR(g,b,a0,a1,za,zb,c):faceL(g,b,a0,a1,za,zb,c),
      lit:ax==='u'});

    // ---------- 人 ----------
    const PC=['#3b5f8a','#a8473a','#4a6b45','#6a5a8a','#c49a3a','#2f3d4a','#d0d3d6','#8a4f6a','#3f7f86'];
    const person=(g,x,y,k)=>{x=rnd(x);y=rnd(y);RC(g,x,y-1,1,1,'#2d2f33');RC(g,x,y-3,1,2,PC[k%PC.length]);RC(g,x,y-4,1,1,k%3?'#e2b48e':'#b8835e');};
    const crowd=(S,pts,z,d)=>S.t(d,(g)=>{for(const[u,v,k]of pts){const p=P(u,v,z);person(g,p[0],p[1],k);}});
    const scatter=(seed,n,u0,v0,du,dv)=>{const out=[];for(let i=0;i<n;i++)out.push([u0+hsh(seed,i,1)*du,v0+hsh(seed,i,2)*dv,Math.floor(hsh(seed,i,3)*9)]);return out;};

    // ---------- 燈、樹、長椅 ----------
    const lamp=(S,u,v,h=14,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');}});
    const oldLamp=(S,u,v,h=10,d)=>S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-1,3,1,'#2a2d30');RC(g,x,y-h,1,h-1,'#3a3f44');RC(g,x+1,y-h+2,1,h-3,'#6c737a');
      RC(g,x-1,y-h-2,3,2,'#f1e3b0');RC(g,x-1,y-h-3,3,1,'#2a2d30');RC(g,x,y-h-4,1,1,'#2a2d30');if(n)RC(n,x-1,y-h-2,3,2,'#ffe6a0');});
    const mast=(S,u,v,h=26,d)=>{SHD.push(['p',u,v,h]);S.t(d!=null?d:u+v+.02,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-1,y-2,3,2,'#8d9398');RC(g,x,y-h,1,h-2,'#c9ced1');RC(g,x+1,y-h+1,1,h-3,'#7d858a');
      RC(g,x-2,y-h-2,6,2,'#4d5459');RC(g,x-2,y-h,6,1,'#e9e2c4');if(n){RC(n,x-2,y-h,6,1,'#fff2c8');}});};
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],
      ['#e8a6b8','#d27f98','#a85a74','#7a3f55'],['#d9c25a','#b99a3c','#8d7430','#5f4f24']];
    const SHD=[];
    const tree=(S,u,v,s=1,kind=0,d)=>{SHD.push(['p',u,v,rnd(9*s)+6]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const cone=(S,u,v,h=10,d)=>{SHD.push(['p',u,v,h]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,'#4a3727');
      for(let k=0;k<h;k++){const w=Math.max(0,Math.round((h-k)*.28));RC(g,x-w,y-2-k,2*w+1,1,k%3===0?'#2f5a2a':'#3f7036');RC(g,x-w,y-2-k,1,1,'#5c8f45');}});};
    const palm=(S,u,v,h=14,d,g0)=>{const draw=(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
        for(let k=0;k<h;k++){const xx=x+Math.round(Math.sin(k/h*1.2)*1.5);RC(g,xx,y-k,1,1,k%2?'#8a6a48':'#6e5238');}
        const tx=x+Math.round(Math.sin(1.2)*1.5),ty=y-h;
        const fr=[[-5,2],[-4,-1],[-1,-3],[2,-3],[5,-1],[5,2],[0,-4]];
        for(const[dx,dy]of fr){BL(g,[tx,ty],[tx+dx,ty+dy],'#3f7a3a');BL(g,[tx,ty+1],[tx+dx,ty+dy+1],'#2d5a2a');RC(g,tx+dx,ty+dy,1,1,'#6aa94f');}
        RC(g,tx-1,ty,2,2,'#5a3f28');};
      if(g0)return draw(g0);SHD.push(['p',u,v,h]);S.o(d!=null?d:u+v+.03,draw);};
    const bush=(S,u,v,r=3,d,pal)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),c=pal||['#4f7f35','#78a84c','#a3cf72'];ell(g,x,y-r+1,r,Math.max(1,r-1),c[0]);ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),c[1]);RC(g,x-1,y-r-1,1,1,c[2]);});
    const bench=(S,u,v,alongU,d)=>S.t(d!=null?d:u+v+.02,(g)=>{const a=P(u,v),b=alongU?P(u+.1,v):P(u,v+.1);BL(g,[a[0],a[1]-2],[b[0],b[1]-2],'#9a6a3e');BL(g,[a[0],a[1]-1],[b[0],b[1]-1],'#6e4a2a');RC(g,a[0],a[1]-1,1,1,'#3a3d40');RC(g,b[0],b[1]-1,1,1,'#3a3d40');});
    const bollards=(S,pts,d)=>S.t(d,(g)=>{for(const[u,v]of pts){const p=P(u,v);RC(g,p[0],p[1]-3,1,3,'#5a6166');RC(g,p[0],p[1]-3,1,1,'#c9ced1');}});
    // 綠籬：矮方盒（頂亮、側暗）＋頂面葉簇
    const hedge=(g,u0,v0,du,dv,h=3,c=['#5f9446','#4b7a37','#3a6130'])=>{boxZ(g,u0,v0,du,dv,0,h,c[0],c[1],c[2]);
      for(let t=u0+.04;t<u0+du-.02;t+=.09)RC(g,...P(t,v0+dv*.5,h),1,1,SH(c[0],22));};
    // 花圃：土床＋路緣＋逐列花色（規則點陣，不用雜點）
    const FLW=[['#d8434b','#f06a6a'],['#f0c43a','#fbe07a'],['#9a5fc4','#c08ae0'],['#f29ab8','#ffc4d6'],['#f5f2ea','#ffffff'],['#e87a2c','#f7a45a']];
    const bed=(g,u0,v0,du,dv,cols,o={})=>{flat(g,u0,v0,du,dv,o.edge||'#e2dccb');flat(g,u0+.02,v0+.02,du-.04,dv-.04,'#6e5038');
      const alongU=o.alongU!==false,n=Math.max(1,Math.floor((alongU?dv:du)/.05));
      for(let i=0;i<n;i++){const col=FLW[cols[i%cols.length]],t0=(alongU?v0:u0)+.03+i*.05;
        if(alongU){lineU(g,t0+.01,u0+.035,u0+du-.035,'#3f6b2e');for(let t=u0+.04,k=0;t<u0+du-.035;t+=1/32,k++)if((k+i)%2===0)RC(g,...P(t,t0,0),1,1,col[k%4===0?1:0]);}
        else{lineV(g,t0+.01,v0+.035,v0+dv-.035,'#3f6b2e');for(let t=v0+.04,k=0;t<v0+dv-.035;t+=1/32,k++)if((k+i)%2===0)RC(g,...P(t0,t,0),1,1,col[k%4===0?1:0]);}}};

    // ---------- 小車（印章，沿 trans_a）與貨車 ----------
    const CL=.23,CW=.1,CST={};
    const carStamp=(al,col,taxi)=>{const key=al+col+(taxi?'t':'');if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const fp2=(pts,c)=>{x.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
        for(let y=Math.floor(ya);y<=Math.ceil(yb);y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
          if(xs.length<2)continue;xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)x.fillRect(xa,y,xb-xa+1,1);}}};
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        fp2([pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        fp2([pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        fp2([pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      let tx=null;if(taxi){const p=pt(CL*.47,CW*.5,4);tx=[rnd(p[0]),rnd(p[1])-1];x.fillStyle='#f6f3e4';x.fillRect(tx[0],tx[1],2,1);}
      return CST[key]={c,ox,oy,tx};};
    const car=(S,u,v,alongU,col,d,taxi)=>{const st=carStamp(alongU?'u':'v',col,taxi),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g,n)=>{g.drawImage(st.c,X0,Y0);if(n&&st.tx)RC(n,X0+st.tx[0],Y0+st.tx[1],2,1,'#fff2c0');});};
    const CARC=['#c9ccd0','#2b2e33','#8a3a33','#2f5a86','#e8e6df','#5d6b74','#3f6b4c','#b08a3e'];
    // 半聯結車：沿 ax；b0＝車尾（貼卸貨門），車頭朝 +b；o.col 車頭色、o.box 貨櫃色
    const truck=(S,ax,b0,a0,o={},d)=>{const X=AXF(ax),Lt=o.Lt||.28,Lc=.085,Wd=.1,a1=a0+Wd,b1=b0+Lt,b2=b1+.012,b3=b2+Lc,col=o.col||'#c0392b',bxc=o.box||'#e8eaec';
      SHD.push(ax==='u'?['b',b0,a0,b3-b0,Wd,10]:['b',a0,b0,Wd,b3-b0,10]);
      S.o(d!=null?d:(ax==='u'?b3+a1:a1+b3),(g,n)=>{
        X.bx(g,b0+.02,b3-b0-.04,a0+.015,Wd-.03,0,2,'#26292c','#2c3033','#1f2225');
        const L1=SH(bxc,8),D1=SH(bxc,-44);
        X.bx(g,b0,Lt,a0,Wd,2,9,SH(bxc,-6),ax==='u'?L1:D1,ax==='u'?D1:L1);
        X.side(g,a1,b0+.01,b1-.01,4,5,ax==='u'?(o.stripe||col):SH(o.stripe||col,-36));
        for(const t of[b0+.04,b0+.09,b3-.03]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}
        X.bx(g,b2,Lc,a0+.006,Wd-.012,1,8,SH(col,22),ax==='u'?col:SH(col,-40),ax==='u'?SH(col,-40):col);
        X.side(g,a1-.006,b2+.035,b3-.012,5,8,'#2d3b48');
        X.end(g,b3,a0+.02,a1-.02,5,8,'#34495a');
        if(n){const h1=X.pt(b3,a0+.02,2),h2=X.pt(b3,a1-.02,2);RC(n,h1[0],h1[1]-1,1,1,'#fff3c8');RC(n,h2[0],h2[1]-1,1,1,'#fff3c8');}});};
    const bus=(S,ax,b0,a0,col,d)=>{const X=AXF(ax),Lb=.46,Wb=.1,a1=a0+Wb,b1=b0+Lb;
      SHD.push(ax==='u'?['b',b0,a0,Lb,Wb,7]:['b',a0,b0,Wb,Lb,7]);
      S.o(d!=null?d:(ax==='u'?b1+a1:a1+b1),(g,n)=>{const sL='#eef1f2',sD='#b3babf';
        X.bx(g,b0+.03,Lb-.06,a0+.01,Wb-.02,0,1,'#26292c','#2c3033','#1f2225');
        X.bx(g,b0,Lb,a0,Wb,1,6,'#dde1e4',sL,sD);
        X.side(g,a1,b0,b1,1,2,ax==='u'?col:SH(col,-34));
        X.side(g,a1,b0+.02,b1-.03,3,6,ax==='u'?'#33485a':'#27384a');
        for(const t of[b0+.07,b1-.1]){const p=X.pt(t,a1,0);RC(g,p[0],p[1]-1,2,1,'#16181b');}
        X.end(g,b1,a0+.012,a1-.012,2,6,'#2b3947');
        if(n)for(let t=b0+.04;t<b1-.06;t+=.05)X.side(n,a1,t,t+.03,3,6,'#ffe6ae');});};

    // ---------- 立面小件 ----------
    const textL=(g,v,u,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){const gl=FONT[ch],dy=Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    const textR=(g,u,v,z,str,col,n,ncol,sp=1)=>{const p=P(u,v,z),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
      for(const ch of str){const gl=FONT[ch],dy=-Math.round(k/2);if(gl)for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+k+c,y0+dy+r,1,1,col);if(n)RC(n,x0+k+c,y0+dy+r,1,1,ncol);}k+=3+sp;}};
    // 玻璃帷幕（+v 面／+u 面）：底色＋豎櫺＋橫檔＋夜間燈
    const curtainL=(g,n,v,ua,ub,za,zb,o={})=>{const gl=o.glass||'#7fa3bb',m=o.mull||'#dfe6ea';faceL(g,v,ua,ub,za,zb,gl);
      const p=P(ua,v,zb),len=Math.floor((ub-ua)*32),fh=o.fh||6,mw=o.mw||4;
      for(let z=za+fh;z<zb-1;z+=fh)BL(g,P(ua,v,z),P(ub,v,z),m);
      for(let x=mw;x<len-1;x+=mw){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      faceL(g,v,ua,ub,zb-1,zb,SH(gl,40));
      if(n){for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh(o.seed||3,x,z)>(o.lit||.6))continue;const X=rnd(p[0])+x+1,Y=rnd(P(ua,v,z+1)[1])+Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),.5,o.nc||'#ffe2a2');}}};
    const curtainR=(g,n,u,va,vb,za,zb,o={})=>{const gl=o.glass||'#5b7d94',m=o.mull||'#a9b8c2';faceR(g,u,va,vb,za,zb,gl);
      const p=P(u,vb,zb),len=Math.floor((vb-va)*32),fh=o.fh||6,mw=o.mw||4;
      for(let z=za+fh;z<zb-1;z+=fh)BL(g,P(u,va,z),P(u,vb,z),m);
      for(let x=mw;x<len-1;x+=mw){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5);RC(g,X,Y+1,1,zb-za-1,m);}
      if(n){for(let z=za;z<zb-2;z+=fh)for(let x=0;x<len-mw;x+=mw){if(hsh((o.seed||3)+9,x,z)>(o.lit||.55))continue;const X=rnd(p[0])+x+1,Y=rnd(P(u,vb,z+1)[1])-Math.floor((x+1)*.5)-Math.min(fh-1,zb-z-2)+1;
        pg(n,X,Y,mw-1,Math.min(fh-1,zb-z-2),-.5,o.nc||'#f3d68e');}}};
    // 旗桿列：pts=[[u,v,色序],...]、main＝掛動態旗那根；主桿只畫 hp（8–12）px 下段，flagAt＝本段桿頂；
    // 其他桿畫全長（hp+20）＋靜態旗面（與動態旗同尺寸），旗面朝右、不伸進主旗範圍。
    // 靜態旗面 6×5：用真實國旗的構圖類型（直三色、橫三帶、北歐十字、日章、角旗），不再是「單色＋白條」讀成字母 E
    const FLAGS=[{t:'v3',c:['#2f8a5a','#f2f0ea','#c9362b']},{t:'x',c:['#2c5aa0','#e8b23c']},{t:'h3',c:['#f2f0ea','#2c5aa0','#c9362b']},
      {t:'d',c:['#f2f0ea','#c9362b']},{t:'v3',c:['#2c5aa0','#f2f0ea','#c9362b']},{t:'x',c:['#c9362b','#f2f0ea']},{t:'h3',c:['#2b2e33','#c9362b','#e8b23c']},{t:'k',c:['#c9362b','#2c5aa0']}];
    const flagFace=(g,x,y,ci)=>{const f=FLAGS[ci%FLAGS.length],c=f.c;
      for(let r=0;r<5;r++)for(let q=0;q<6;q++){let col;
        if(f.t==='v3')col=c[q>>1];
        else if(f.t==='h3')col=c[r<2?0:r<3?1:2];
        else if(f.t==='x')col=(q===2||r===2)?c[1]:c[0];
        else if(f.t==='d')col=((q===2||q===3)&&r>=1&&r<=3)||((q===1||q===4)&&r===2)?c[1]:c[0];
        else col=(q<3&&r<2)?c[1]:c[0];
        RC(g,x+q,y+r,1,1,col);}
      // 旗面自由端微垂（右下角 1px 缺角），讀起來是布不是牌
      g.clearRect(x+5,y+4,1,1);};
    const flagRow=(S,pts,main,hp)=>{if(hp<8||hp>12)throw new Error('主旗桿下段須 8–12px');
      const pp=pts.map(([u,v,ci])=>{const p=P(u,v);return[rnd(p[0]),rnd(p[1]),ci|0,u,v];});
      const at=[pp[main][0]+1,pp[main][1]-hp];
      for(const[u,v]of pts)SHD.push(['p',u,v,hp+20]);
      pp.forEach(([x,y,ci,u,v],i)=>S.t(u+v+.02,(g)=>{RC(g,x-1,y-2,4,2,'#c9c5ba');RC(g,x-1,y-1,4,1,'#8f8b82');
        const h=i===main?hp:hp+20;RC(g,x,y-h,2,h-2,'#8a8a86');
        if(i!==main){RC(g,x,y-h,2,2,'#c8ccd2');flagFace(g,x+2,y-h+1,ci);}}));
      return at;};

    // ---------- 逐像素光線投射（曲面：筒拱、穹頂、圓鼓座；也可混方盒）----------
    // prim：{q:[型,cu,cv,zc,ru,rv,rz]|null（'cu'沿 u 筒、'cv'沿 v 筒、'cz'直立圓柱、'el'橢球）, u:[a,b], v:[a,b], z:[a,b],
    //        col:(h,rib)=>色, nc:(h,rib)=>夜色|null, grid:(h)=>整數格位|null }；h＝{x,y,f(1:+u 2:+v 3:頂 4:曲面),u,v,z,n,l,ic}
    const LAM=39,LV=(()=>{const a=[-.3,.72,.62],l=Math.hypot(a[0],a[1],a[2]);return a.map(x=>x/l);})();
    const RGB={};const rgb=c=>{if(RGB[c])return RGB[c];const n=parseInt(c.slice(1),16);return RGB[c]=[n>>16,(n>>8)&255,n&255];};
    const mix=(a,b,t)=>{const x=rgb(a),y=rgb(b);const r=rnd(x[0]+(y[0]-x[0])*t),gg=rnd(x[1]+(y[1]-x[1])*t),bb=rnd(x[2]+(y[2]-x[2])*t);return '#'+((r<<16)|(gg<<8)|bb).toString(16).padStart(6,'0');};
    const tone=(pal,l)=>pal[l<-.12?0:l<.22?1:l<.5?2:l<.74?3:4];
    const quad=(q,s,m)=>{const ty=q[0];let a2=0,b1=0,c0=0;
      if(ty!=='cu'){const b=s/2-q[1],r2=q[4]*q[4];a2+=.25/r2;b1+=b/r2;c0+=b*b/r2;}
      if(ty!=='cv'){const b=-s/2-q[2],r2=q[5]*q[5];a2+=.25/r2;b1+=b/r2;c0+=b*b/r2;}
      if(ty!=='cz'){const b=-m-q[3],r2=q[6]*q[6];a2+=256/r2;b1+=32*b/r2;c0+=b*b/r2;}
      const D=b1*b1-4*a2*(c0-1);if(D<0)return null;const sq=Math.sqrt(D);return[(-b1-sq)/(2*a2),(-b1+sq)/(2*a2)];};
    const nrm=(p,f,u,v,z)=>{if(f===1)return[1,0,0];if(f===2)return[0,1,0];if(f===3)return[0,0,1];const q=p.q,ty=q[0];
      const a=ty==='cu'?0:(u-q[1])/(q[4]*q[4]*LAM),b=ty==='cv'?0:(v-q[2])/(q[5]*q[5]*LAM),c=ty==='cz'?0:(z-q[3])/(q[6]*q[6]);const l=Math.hypot(a,b,c)||1;return[a/l,b/l,c/l];};
    const ray=(g,n,prims,o={})=>{const N=W*H,hit=new Int16Array(N).fill(-1),fc=new Uint8Array(N),T=new Float64Array(N),key=new Int32Array(N),hk=new Uint8Array(N);
      const inner=o.inner?o.inner.getContext('2d').getImageData(0,0,W,H).data:null;
      const mk=(p,f,t,s,m,x,y)=>{const u=(t+s)/2,v=(t-s)/2,z=16*t-m,nn=nrm(p,f,u,v,z),l=nn[0]*LV[0]+nn[1]*LV[1]+nn[2]*LV[2];
        let ic=null;if(inner){const j=(y*W+x)*4;if(inner[j+3]>100)ic='#'+((inner[j]<<16)|(inner[j+1]<<8)|inner[j+2]).toString(16).padStart(6,'0');}
        return{x,y,f,u,v,z,n:nn,l,ic,p};};
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const s=(x+.5-AX)/32,m=y+.5-TOPY;let best=-1e9,bi=-1,bf=0;
        for(let i=0;i<prims.length;i++){const p=prims[i];let lo=-1e9,hi=1e9,f=0,a,b;
          if(p.u){a=2*p.u[0]-s;b=2*p.u[1]-s;if(a>lo)lo=a;if(b<hi){hi=b;f=1;}}
          if(p.v){a=2*p.v[0]+s;b=2*p.v[1]+s;if(a>lo)lo=a;if(b<hi){hi=b;f=2;}}
          if(p.z){a=(p.z[0]+m)/16;b=(p.z[1]+m)/16;if(a>lo)lo=a;if(b<hi){hi=b;f=3;}}
          if(p.q){const r=quad(p.q,s,m);if(!r)continue;if(r[0]>lo)lo=r[0];if(r[1]<hi){hi=r[1];f=4;}}
          if(lo>hi||hi>1e8)continue;
          if(hi>=best-1e-7){best=hi;bi=i;bf=f;}}
        if(bi<0)continue;const i=y*W+x;hit[i]=bi;fc[i]=bf;T[i]=best;
        const p=prims[bi];if(p.grid){const k=p.grid(mk(p,bf,best,s,m,x,y));if(k!=null){key[i]=k;hk[i]=1;}}}
      const[tc,tx]=A.cv(W,H),id=tx.createImageData(W,H),d=id.data;let nd=null,nid=null,ntc=null,ntx=null;
      if(n){[ntc,ntx]=A.cv(W,H);nid=ntx.createImageData(W,H);nd=nid.data;}
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(hit[i]<0)continue;const p=prims[hit[i]],s=(x+.5-AX)/32,m=y+.5-TOPY;
        let rib=0;if(hk[i]){if(x>0&&hit[i-1]===hit[i]&&fc[i-1]===fc[i]&&hk[i-1]&&key[i-1]!==key[i])rib=1;
          else if(y>0&&hit[i-W]===hit[i]&&fc[i-W]===fc[i]&&hk[i-W]&&key[i-W]!==key[i])rib=1;}
        const h=mk(p,fc[i],T[i],s,m,x,y);h.key=key[i];const c=p.col(h,rib);
        if(c){const r=rgb(c);d[i*4]=r[0];d[i*4+1]=r[1];d[i*4+2]=r[2];d[i*4+3]=255;}
        if(nd&&p.nc){const c2=p.nc(h,rib);if(c2){const r=rgb(c2);nd[i*4]=r[0];nd[i*4+1]=r[1];nd[i*4+2]=r[2];nd[i*4+3]=255;}}}
      tx.putImageData(id,0,0);g.drawImage(tc,0,0);if(n){ntx.putImageData(nid,0,0);n.drawImage(ntc,0,0);}};
    const ang=(a,b)=>Math.atan2(b,a);   // 0..π（上半）
    // 常用材質色階（暗→亮）
    const MET=['#78828a','#939da4','#aeb8be','#c8cfd4','#e0e5e8'];      // 銀灰金屬屋面
    const GLB=['#4c6f86','#628aa2','#7ea4bb','#9dbccf','#c2d8e4'];      // 藍灰玻璃
    const GLV=['#5b8a90','#78a6aa','#9cc4c3','#bddcd6','#dbeee6'];      // 溫室淡青玻璃
    const WHT5=['#a9b1b6','#c3cacd','#d9dee0','#e9ecee','#f6f7f7'];     // 白色構架

    return{P,hsh,AX,TOPY,SZ,RC,BL,fp,Q,flat,boxZ,faceL,faceR,lnL,lnR,pg,ell,disc,ring,scene,shadow,MATS,pave,lineU,lineV,dashU,dashV,YEL,WHT,
      stallsU,stallsV,zebraU,zebraV,curb,AXF,person,crowd,scatter,lamp,oldLamp,mast,tree,cone,palm,bush,bench,bollards,hedge,bed,FLW,
      CL,CW,car,CARC,truck,bus,SHD,textL,textR,curtainL,curtainR,flagRow,ray,ang,mix,tone,rgb,MET,GLB,GLV,WHT5,LV};
  };

  // 收尾裁切：佔地菱形南側兩條斜邊以外、頂端 2 列以內一律清掉（並記數，定稿要求 0）
  // 判準與遊戲 dia() 的菱形逐列一致：下半部第 y 列（i＝TOPY+HW−1−y）只准 x∈[AX−2(i+1), AX+2(i+1)−1]
  const clip=(c,W,H,AX,AY,at,SZ=3)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;let cut=0;const HW=32*SZ,TY=AY-HW;
    for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4+3;if(!a[i])continue;let bad=y<2;
      if(!bad&&y>=TY+HW/2){const r=TY+HW-1-y;bad=r<0||xx<AX-2*(r+1)||xx>AX+2*(r+1)-1;}
      if(bad){a[i]=0;cut++;if(at&&at.length<10)at.push(xx+','+y);}}
    if(cut)x.putImageData(d,0,0);return cut;};
  // 組裝：每類一個 K、每變體獨立畫布
  const build=(k,dm,SZ,layouts)=>{const[W,H,AX,AY]=dm;const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K,W,H),order=DEV[k]||null,out=[];
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      try{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();L.SHD.length=0;
        const o=layouts[v](g,ng,S,L,K,SZ)||{};
        if(L.SHD.length)L.shadow(g,L.SHD,.28);
        A.diaEdge(g,6,'#8b877e',AX,AY-32*SZ,32*SZ);A.diaEdge(g,9,'#cfcbc1',AX,AY-32*SZ,32*SZ);
        S.run(g,ng);
        if(o.front)o.front(g,ng);
        ng.globalCompositeOperation='destination-in';ng.drawImage(c,0,0);ng.globalCompositeOperation='source-over';   // 夜光只落在白天畫出的像素上
        const[sc]=A.cv(W,H);const spr=K.finish(c,g,sc,nc,{fence:false,smoke:[]});
        const at=[],cut=clip(c,W,H,AX,AY,at),cutN=clip(nc,W,H,AX,AY);
        let fop=0;if(o.flagAt){spr.flagAt=o.flagAt;const[fx,fy]=o.flagAt,idd=c.getContext('2d').getImageData(fx-1,fy-1,2,1).data;for(let i=3;i<idd.length;i+=4)if(idd[i])fop++;}
        chk.push({k,v,cut,cutN,flagAt:o.flagAt||null,fop,at:at.join(' ')});
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('cul_d k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];};

  // ================= k44 會展中心（3×3）=================
  try{
    const SZ=3;
    // 展館共用：卸貨門（+u 面）＋碼頭緩衝墊＋門頂燈
    const dockDoors=(L,g,n,u,vs,w=.17,h=9)=>{const{faceR,lnR,RC,P}=L;
      for(const v of vs){faceR(g,u,v-.01,v+w+.01,0,h+1,'#5d666c');faceR(g,u,v,v+w,0,h,'#9aa3a8');
        for(let z=2;z<h;z+=2)lnR(g,u,v,v+w,z,'#7f898f');faceR(g,u,v,v+w,0,1,'#2b2f33');
        faceR(g,u,v-.012,v,0,h,'#2e3236');faceR(g,u,v+w,v+w+.012,0,h,'#2e3236');
        const p=P(u,v+w/2,h+2);RC(g,p[0]-1,p[1],2,1,'#f1e6b8');if(n)RC(n,p[0]-1,p[1],2,1,'#fff0c0');}};
    // 立式標誌塔（pylon）：白色塔身＋+v 面藍色燈箱，字直書（每字 3×5、字距 1px），頂上圓形徽章；夜裡只亮字與徽章
    const pylon=(S,L,u,v,h,str,col,d)=>{const du=.19,dv=.07;L.SHD.push(['b',u,v,du,dv,h]);S.o(d!=null?d:u+v+.1,(g,n)=>{const{boxZ,faceL,faceR,P,RC}=L;
      boxZ(g,u-.02,v-.015,du+.04,dv+.03,0,3,'#bdb9ae','#d6d2c8','#9d998f');
      boxZ(g,u,v,du,dv,3,h-3,'#e9edf0','#f4f6f7','#b3bcc2');
      const z1=h-6,z0=z1-(str.length*6+3);
      faceL(g,v+dv,u+.02,u+du-.02,z0,z1,col);faceR(g,u+du,v+.01,v+dv-.01,z0,z1,SH(col,-38));
      for(let i=0;i<str.length;i++){const gl=FONT[str[i]],p=P(u+.045,v+dv,z1-2-i*6),x0=rnd(p[0]),y0=rnd(p[1]);if(!gl)continue;
        for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g,x0+c,y0+r,1,1,'#ffffff');if(n)RC(n,x0+c,y0+r,1,1,'#ffffff');}}
      // 頂部圓形徽章（白底藍環＋中心黃點）
      const b=P(u+du*.5,v+dv,h-3),bx=rnd(b[0]),by=rnd(b[1]);
      RC(g,bx-2,by-1,5,3,col);RC(g,bx-1,by-2,3,5,col);RC(g,bx-1,by-1,3,3,'#f4f6f7');RC(g,bx,by,1,1,'#e8b23c');
      if(n){RC(n,bx-1,by-1,3,3,'#e6f4ff');RC(n,bx,by,1,1,'#ffd27a');}});};

    const K44=[
      // v0 連續拱頂：四跨橫向筒拱（銀灰金屬＋拱冠採光帶）罩住展覽館，端面扇形玻璃朝前；前置低矮玻璃大廳（懸挑雨遮＋招牌帶）；
      // 前廣場石材鋪面＋旗桿列＋標誌塔；前緣計程車道；右前停車場；右側服務道三座卸貨門與半聯結車。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,RC,BL,lineU,lineV,dashU,dashV,stallsV,zebraU,curb,crowd,scatter,lamp,mast,tree,bush,bench,bollards,car,CARC,truck,textL,curtainL,curtainR,flagRow,ray,ang,mix,tone,MET,GLB,WHT5,SHD}=L;
        const U0=.12,U1=2.5,V0=.1,V1=1.5,H0=17,RZ=13,NV=4,WU=(U1-U0)/NV;
        pave(g,'c',0,0,SZ,SZ,4401);
        pave(g,'a',U1,.04,SZ-U1-.03,1.9,4402);lineV(g,U1+.02,.06,1.9,'#d9d6ce');dashV(g,2.76,.1,1.9,WHT,.1,.1);
        pave(g,'z',.2,1.9,1.85,.6,4403);for(const u of[.6,1.12,1.64])flat(g,u,1.9,.06,.6,'#bfb6a4');
        pave(g,'a',.04,2.54,2.02,.28,4404);curb(g,.2,2.5,1.85,.04);lineU(g,2.82,.04,2.06,'#d9d6ce');dashU(g,2.68,.1,2.0,WHT,.08,.08);
        pave(g,'s',0,2.84,SZ,.16,4405);
        pave(g,'a',2.1,1.94,.87,.88,4406);
        stallsV(g,2.12,2.0,.8,5,.26);stallsV(g,2.7,2.0,.8,5,.26);dashU(g,2.53,2.14,2.95,'#d8d4c8',.06,.06);
        zebraU(g,1.6,1.9,2.56,2.8);
        // 左緣綠帶
        pave(g,'g',0,1.52,.2,1.3,4407);
        // 落影
        L.shadow(g,[['b',U0,V0,U1-U0,V1-V0,H0],['b',U0+.05,V0,U1-U0-.1,V1-V0,H0+RZ*.8],['b',.3,1.5,2.05,.4,14]]);
        // ---- 展覽館（光線投射）----
        S.o(1.6,(g2,n2)=>{const prims=[];
          prims.push({u:[U0,U1],v:[V0,V1],z:[0,H0],
            grid:h=>h.f===2?Math.floor(h.u/.1):h.f===1?Math.floor(h.v/.1):null,
            col:(h,rib)=>h.f===3?'#8f989e':h.f===2?(h.z>H0-2?'#eef1f2':rib?'#c2c9cd':'#d9dee1'):(h.z>H0-2?'#b8c0c5':h.z<1?'#6f777c':rib?'#8d969c':'#a2abb0')});
          for(let i=0;i<NV;i++){const cu=U0+WU*(i+.5),ru=WU/2;
            prims.push({q:['cv',cu,0,H0,ru,1,RZ],u:[cu-ru,cu+ru],v:[V0,V1],z:[H0,H0+RZ+1],
              grid:h=>{if(h.f===4)return Math.abs(h.u-cu)<.07?1000+Math.floor(h.v/.1):Math.floor(h.v/.35);if(h.f===2)return Math.floor((h.u-cu+ru)/.075)*100+Math.floor((h.z-H0)/5);return null;},
              col:(h,rib)=>{if(h.f===4){const du=Math.abs(h.u-cu);if(du<.07)return rib?'#e8eef2':tone(GLB,h.l+.12);if(du<.085)return '#eef1f2';if(du>ru-.02)return '#6d767c';
                  const c=tone(MET,h.l-.08);return rib?SH(c,-16):c;}
                if(h.f===2){const e=((h.u-cu)/ru)**2+((h.z-H0)/RZ)**2;if(e>.8)return '#eef1f2';if(h.z<H0+1.5)return '#c9d0d4';return rib?'#dfe6ea':(h.z>H0+RZ*.55?'#8fb0c4':'#7497ad');}
                return tone(MET,h.l);},
              nc:(h,rib)=>{if(h.f!==2||rib)return null;const e=((h.u-cu)/ru)**2+((h.z-H0)/RZ)**2;if(e>.8||h.z<H0+1.5)return null;
                const q=A.hashLocal479(i*31+(h.key/100|0),h.key%100,44);return q<.62?'#f2dc9e':q<.9?'#e0c283':null;}});}
          ray(g2,n2,prims);
          dockDoors(L,g2,n2,U1,[.3,.68,1.06]);
          // 館側細長高窗帶
          for(let v=.2;v<1.4;v+=.36)faceR(g2,U1,v,v+.2,13,15,'#56778c');});
        // 卸貨車
        truck(S,'u',U1+.02,.33,{col:'#2f5a86',box:'#e8eaec',stripe:'#2f5a86'});
        truck(S,'u',U1+.02,.71,{col:'#c0392b',box:'#dfe3e6',stripe:'#c0392b'});
        truck(S,'v',1.3,2.72,{col:'#e8e6df',box:'#f0f1f2',stripe:'#3f6b4c'});
        // ---- 前置玻璃大廳 ----
        S.o(2.05,(g2,n2)=>{const u0=.3,u1=2.35,v0=1.5,v1=1.88,h=12;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#cfd5d9','#9fbccc','#5f7f92');
          curtainL(g2,n2,v1,u0,u1,0,h,{glass:'#86a9bf',mull:'#e6ecef',fh:6,mw:4,seed:4411,lit:.75});
          curtainR(g2,n2,u1,v0,v1,0,h,{glass:'#5b7d94',mull:'#a9b8c2',fh:6,mw:4,seed:4412,lit:.6});
          // 入口：三組深色旋轉門＋門框
          for(const u of[.95,1.25,1.55]){faceL(g2,v1,u,u+.12,0,7,'#2d3b48');faceL(g2,v1,u+.055,u+.065,0,7,'#9fb4c2');if(n2)faceL(n2,v1,u+.01,u+.11,1,6,'#ffe6ae');}
          // 雨遮下陰影
          faceL(g2,v1,u0,u1,h-2,h,'#4f6d80');
          // 屋頂（灰色防水層＋女兒牆＋天窗列）＋入口段懸挑雨遮＋立在雨遮緣的招牌帶
          boxZ(g2,u0-.02,v0,u1-u0+.04,v1-v0+.02,h,2,'#b7bfc4','#eef1f2','#b5bec4');
          flat(g2,u0+.02,v0+.03,u1-u0-.04,v1-v0-.05,'#a7b0b6',h+2);
          for(let u=u0+.12;u<u1-.12;u+=.2)boxZ(g2,u,v0+.12,.1,.12,h+2,1,'#9dbccf','#c9d8e2','#6f93aa');
          boxZ(g2,.78,v1,1.14,.16,h-1,2,'#e9edf0','#f4f6f7','#b5bec4');
          boxZ(g2,.62,v1+.12,1.48,.04,h+1,7,'#20384e','#2b4a66','#1d3347');textL(g2,v1+.16,.68,h+6,'EXPO CENTER','#f2f4f5',n2,'#fff4d8',1);});
        // ---- 前廣場 ----
        // 退件修正：左前角只留標誌塔＋旗桿列；樹改成臨街緣一列（與燈桿交錯），廣場中間空出來當鋪面，只有往大廳走的人
        const fa=flagRow(S,[[.34,2.42,0],[.34,2.17,1],[.34,1.92,2]],2,10);
        pylon(S,L,.03,2.4,38,'EXPO','#2f6f9a');
        for(const u of[.9,1.4,1.9])tree(S,u,2.45,.85,2);
        for(const u of[1.15,1.65])lamp(S,u,2.47,14);
        bench(S,1.0,2.36,true);bench(S,1.5,2.36,true);
        crowd(S,scatter(4421,9,.7,1.93,1.3,.18),0,3.3);
        crowd(S,[[1.0,1.95,1],[1.02,1.97,3],[1.3,1.96,5],[1.33,1.94,0],[1.6,1.97,2],[.8,2.2,6],[1.22,2.26,4],[1.7,2.18,8]],0,2.95);
        // 計程車道：排班計程車，車與車之間留 ≥4px 路面（車長 .23、間距 .36），車頂燈＋深色車窗把每部車斷開
        for(const[u,c]of[[.08,'#e8b62c'],[.44,'#e8b62c'],[.8,'#e8b62c'],[1.2,'#2b2e33']])car(S,u,2.58,true,c,null,c==='#e8b62c');
        crowd(S,[[1.46,2.52,4],[1.5,2.51,6],[1.56,2.53,2]],0,4.1);
        // 左緣行道樹（只留後段一棵，左前角讓給標誌塔與旗桿）
        tree(S,.1,1.6,.85,0);
        // 停車場
        const PK=[[2.14,2.03],[2.14,2.19],[2.14,2.51],[2.14,2.67],[2.7,2.03],[2.7,2.35],[2.7,2.51],[2.7,2.67]];
        PK.forEach(([u,v],i)=>car(S,u,v,true,CARC[(i*3+1)%CARC.length]));
        mast(S,2.55,2.4,30);
        tree(S,2.5,2.93,.75,1);   // 人行道樹只留停車場前一棵：排班車前面不種樹，免得樹冠把車列切成黃帶
        return{flagAt:fa};
      },
      // v1 平頂＋玻璃塔樓：右後方大跨度平頂展館（屋頂四道外露白色鋼桁架、桁架間天窗帶、前牆大型看板），左側 18 層玻璃塔樓
      // （塔冠玻璃鰭、頂部標誌），兩者以低矮玻璃大廳相連；塔樓前車寄雨棚與落客道；中前方圓形噴泉廣場＋旗桿列；右前停車場；右側卸貨碼頭。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,lnR,RC,BL,lineU,lineV,dashU,dashV,stallsU,stallsV,curb,crowd,scatter,lamp,mast,tree,bush,bench,bollards,car,CARC,truck,textL,textR,curtainL,curtainR,flagRow,disc,ring,ray,mix,SHD}=L;
        const HU0=.95,HU1=2.55,HV0=.1,HV1=1.45,HH=24;
        pave(g,'c',0,0,SZ,SZ,4431);
        pave(g,'a',HU1,.04,SZ-HU1-.03,2.0,4432);lineV(g,HU1+.02,.06,2.0,'#d9d6ce');
        // 退件修正：左後停車場大半被塔擋住 ⇒ 改成塔後綠地；停車全部移到右前並加大成三列（兩條車道）
        pave(g,'g',.04,.06,.88,.95,4433);
        pave(g,'a',.04,1.9,2.5,.24,4434);lineU(g,2.14,.04,2.54,'#d9d6ce');dashU(g,2.02,.1,2.5,WHT,.08,.08);curb(g,.12,1.86,2.4,.04);
        pave(g,'z',.25,2.18,1.5,.66,4435);for(const v of[2.4,2.62])lineU(g,v,.25,1.75,'#c2b9a7');
        pave(g,'s',0,2.86,SZ,.14,4436);
        // 右前停車場：u 1.7–2.97；A 列（1.7–1.96）｜車道｜B、C 背對背（2.2–2.72）｜車道接服務道
        pave(g,'a',1.76,2.14,1.21,.72,4437);lineV(g,1.76,2.16,2.84,'#d9d6ce');
        stallsV(g,1.78,2.18,.64,4,.26);stallsV(g,2.28,2.18,.64,4,.52);lineV(g,2.54,2.18,2.82,WHT);
        L.shadow(g,[['b',HU0,HV0,HU1-HU0,HV1-HV0,HH],['b',.18,1.1,.6,.62,92],['b',.18,1.45,2.37,.4,13],
          ['b',.14,1.84,.84,.36,2,11],['b',.14,1.84,.84,.36,1,0]]);   // 車寄雨棚：投影＋棚下陰影
        // ---- 大跨度平頂展館 ----
        S.o(1.2,(g2,n2)=>{boxZ(g2,HU0,HV0,HU1-HU0,HV1-HV0,0,HH,'#b3bbc0','#dfe3e6','#a3acb2');
          for(let u=HU0+.1;u<HU1-.02;u+=.1)BL(g2,P(u,HV1,1),P(u,HV1,HH-3),'#cdd2d5');
          for(let v=HV0+.1;v<HV1-.02;v+=.1)BL(g2,P(HU1,v,1),P(HU1,v,HH-3),'#939ca2');
          faceL(g2,HV1,HU0,HU1,HH-2,HH,'#f2f4f5');faceR(g2,HU1,HV0,HV1,HH-2,HH,'#c3cacf');
          // 前牆大型看板
          faceL(g2,HV1,1.05,2.45,15,23,'#1f3346');faceL(g2,HV1,1.07,2.43,16,22,'#2f6f9a');textL(g2,HV1,1.19,21,'EXPO HALL','#ffffff',n2,'#ffffff',1);
          if(n2)faceL(n2,HV1,1.07,2.43,16,17,'#7fc3ea');
          // 屋頂天窗帶
          for(const u of[1.05,1.4,1.75,2.1])flat(g2,u+.05,HV0+.12,.18,HV1-HV0-.24,'#8fb0c4',HH);
          dockDoors(L,g2,n2,HU1,[.28,.62,.96]);
          for(let v=.2;v<1.3;v+=.34)faceR(g2,HU1,v,v+.22,17,19,'#56778c');});
        // 屋頂外露鋼桁架（沿 v 橫跨）
        for(const u of[1.1,1.45,1.8,2.15,2.5])S.t(1.25+u*.001,(g2)=>{const z0=HH,z1=HH+7;
          BL(g2,P(u,HV0,z1),P(u,HV1,z1),'#f4f6f7');BL(g2,P(u,HV0,z1-1),P(u,HV1,z1-1),'#aeb6bb');
          let up=true;for(let v=HV0;v<HV1-.05;v+=.1){BL(g2,P(u,v,up?z0:z1),P(u,v+.1,up?z1:z0),'#dfe4e6');up=!up;}
          for(const v of[HV0,HV1])BL(g2,P(u,v,z0),P(u,v,z1),'#c9d0d4');});
        // ---- 玻璃塔樓 ----
        const TU0=.18,TU1=.78,TV0=1.1,TV1=1.72,TH=92;
        S.o(1.0,(g2,n2)=>{
          // 帷幕以逐像素光線投射上色（輪廓與面界由同一套幾何決定 ⇒ 右暗面邊緣不再有樓層線凸點）：
          // 5px 樓層、4px 豎櫺、轉角鋁鰭；2 層挑高大堂、z48–53 設備層百葉；玻璃由下往上漸亮＋一道天空斜反光；
          // 少數窗格拉下百葉（淺）或深色玻璃，夜裡以「整層開燈」為主、零星單格，讀起來像辦公樓不像方格紙。
          const MECH=z=>z>=48&&z<53,LOB=10;
          const facade=(h)=>{const lit=h.f===2,t=(lit?h.u-TU0:h.v-TV0)*32,Wp=(lit?TU1-TU0:TV1-TV0)*32,z=h.z;
            if(t<1||t>Wp-1)return{c:lit?'#e3ebf0':'#8398a6',k:0};
            if(MECH(z))return{c:(Math.floor(z)%2?(lit?'#c3ced5':'#7f8f99'):(lit?'#9fb0bb':'#66757f')),k:0};
            if(z<LOB){if(z>LOB-1)return{c:lit?'#e3ebf0':'#8398a6',k:0};if(Math.floor(t)%5===0)return{c:lit?'#c8d6df':'#6f8797',k:0};
              return{c:lit?'#4d6f86':'#34506a',k:2,b:Math.floor(t/5),fl:-1};}
            const fl=Math.floor(z/5),fz=z-fl*5,bb=Math.floor(t/4);
            if(fz<1)return{c:lit?'#d3e0e8':'#6c8799',k:0};
            if(t-bb*4<1)return{c:lit?'#b4c9d6':'#557184',k:0};
            const q=A.hashLocal479(lit?4441:4442,bb,fl);
            // 整格上色（同一窗格同一色，不逐像素抖動）：逐層由下往上漸亮；天空斜反光以窗格為單位成階梯斜帶
            let c=lit?mix('#5f87a1','#9fc0d3',Math.min(1,fl*5/TH)):mix('#3d5f76','#5f8299',Math.min(1,fl*5/TH));
            const d=((lit?bb:6-bb)*2+40-fl)%13;if(d<2)c=mix(c,lit?'#d6e7f0':'#8fb0c4',lit?.5:.3);
            if(q<.09)c=lit?'#bcd0dc':'#7d98a9';else if(q<.17)c=lit?'#5a7f98':'#34526a';
            else if(q<.27&&fz>=3)c=lit?'#c4d5df':'#8199a8';   // 半拉百葉：窗格上半淺
            return{c,k:1,b:bb,fl};};
          const nlit=(h)=>{const o=facade(h);if(!o.k)return null;if(o.k===2)return h.f===2?'#ffe6ae':'#f3d68e';
            const on=A.hashLocal479(4443,o.fl,0)<.42?.85:.14;const q=A.hashLocal479(4444+h.f,o.b,o.fl);if(q>=on)return null;
            return q<on*.12?'#e4efff':(h.f===2?'#ffe2a2':'#f0d08a');};
          ray(g2,n2,[{u:[TU0,TU1],v:[TV0,TV1],z:[0,TH],col:h=>h.f===3?'#9fb3c0':facade(h).c,nc:h=>h.f===3?null:nlit(h)}]);
          // 塔冠：玻璃鰭＋頂框
          boxZ(g2,TU0,TV0,TU1-TU0,TV1-TV0,TH,2,'#dfe5e9','#eef2f4','#b8c2c8');
          faceL(g2,TV1,TU0,TU0+.05,TH,TH+10,'#c9d8e2');faceL(g2,TV1,TU1-.05,TU1,TH,TH+10,'#c9d8e2');
          faceR(g2,TU1,TV0,TV0+.05,TH,TH+10,'#9fb0bb');lnL(g2,TV1,TU0,TU1,TH+10,'#eef2f4');
          faceL(g2,TV1,TU0+.03,TU1-.03,TH-9,TH-2,'#2f6f9a');textL(g2,TV1,TU0+.065,TH-3,'EXPO','#ffffff',n2,'#dff2ff',1);
          boxZ(g2,TU0+.16,TV0+.16,.26,.24,TH+2,5,'#aeb7bc','#c9d0d4','#8e979d');for(let u=TU0+.19;u<TU0+.4;u+=.06)BL(g2,P(u,TV0+.4,TH+3),P(u,TV0+.4,TH+6),'#9aa3a8');
          const tp=P(TU0+.29,TV0+.28,TH+7);RC(g2,tp[0],tp[1]-6,1,6,'#6d767c');RC(g2,tp[0],tp[1]-7,1,1,'#c0392b');
          if(n2){faceL(n2,TV1,TU0+.03,TU1-.03,TH-9,TH-8,'#9fd6f5');RC(n2,tp[0],tp[1]-7,1,1,'#ff5a4a');}});
        // ---- 玻璃大廳（連接塔樓與展館）----
        S.o(2.3,(g2,n2)=>{const u0=.18,u1=HU1,v0=1.45,v1=1.84,h=13;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#cfd5d9','#9fbccc','#5f7f92');
          curtainL(g2,n2,v1,u0,u1,0,h,{glass:'#86a9bf',mull:'#e6ecef',fh:6,mw:4,seed:4451,lit:.7});
          curtainR(g2,n2,u1,v0,v1,0,h,{glass:'#5b7d94',mull:'#a9b8c2',fh:6,mw:4,seed:4452,lit:.6});
          boxZ(g2,u0-.02,v0,u1-u0+.04,v1-v0+.03,h,2,'#b7bfc4','#eef1f2','#b5bec4');
          flat(g2,u0+.02,v0+.03,u1-u0-.04,v1-v0-.04,'#a7b0b6',h+2);
          for(let u=u0+.75;u<u1-.12;u+=.2)boxZ(g2,u,v0+.12,.1,.12,h+2,1,'#9dbccf','#c9d8e2','#6f93aa');
          for(const u of[1.2,1.5,1.8]){faceL(g2,v1,u,u+.12,0,7,'#2d3b48');if(n2)faceL(n2,v1,u+.01,u+.11,1,6,'#ffe6ae');}
          boxZ(g2,1.1,v1,.95,.14,h-2,2,'#e9edf0','#f4f6f7','#b5bec4');});
        // 車寄雨棚（塔樓前）：前緣兩端各一根 2px 鋼柱落地（亮面＋暗面），棚板有深色封邊；排在棚下的車與人之後畫
        S.o(2.9,(g2,n2)=>{const u0=.14,u1=.98,v0=1.84,v1=2.2,z=11;
          for(const u of[u0+.03,u1-.09]){boxZ(g2,u,v1-.05,.06,.03,0,z,'#8e979c','#dde2e5','#7d858a');
            const b=P(u,v1-.02,0);RC(g2,b[0]-1,b[1],4,1,'#6f777c');}
          boxZ(g2,u0,v0,u1-u0,v1-v0,z,2,'#dfe4e7','#f3f5f6','#b1bac0');faceL(g2,v1,u0,u1,z,z+1,'#9aa4aa');
          for(let u=u0+.1;u<u1-.05;u+=.14){const p=P(u,v1,z);RC(g2,p[0],p[1],2,1,'#efe7c6');if(n2)RC(n2,p[0],p[1],2,1,'#fff0c2');}});
        car(S,.3,1.95,true,'#2b2e33');car(S,.62,1.95,true,'#e8b62c',null,true);
        crowd(S,[[.35,1.86,1],[.5,1.87,3],[.7,1.86,5],[.82,1.87,0]],0,2.8);
        // ---- 噴泉廣場＋旗桿列 ----
        S.o(3.55,(g2,n2)=>{const cu=.95,cv=2.52;disc(g2,cu,cv,.27,'#cfc8b8');disc(g2,cu,cv,.27,'#bfb6a4',1);disc(g2,cu,cv,.24,'#5f95b4',1);
          disc(g2,cu,cv,.16,'#7bb2cc',1);ring(g2,cu,cv,.25,'#e4ddcd',2);
          const p=P(cu,cv,1);RC(g2,p[0]-1,p[1]-6,3,6,'#d7eef7');RC(g2,p[0],p[1]-9,1,3,'#eef8fb');RC(g2,p[0]-3,p[1]-3,1,2,'#cfe8f2');RC(g2,p[0]+3,p[1]-3,1,2,'#cfe8f2');
          if(n2){RC(n2,p[0]-1,p[1]-6,3,6,'#bfe6ff');}});
        // 旗桿列立在廣場與停車場的分界（u1.52），噴泉左移到廣場中央
        const fa=flagRow(S,[[1.68,2.78,1],[1.68,2.53,2],[1.68,2.28,0]],2,10);
        tree(S,.3,2.6,.85,2);   // 不擋雨棚左柱（雨棚柱在 x≈40，樹在 x≈32）
        bench(S,.5,2.64,true);bench(S,1.22,2.64,true);
        crowd(S,scatter(4461,12,.4,2.24,1.0,.58),0,4.0);
        lamp(S,.9,2.82,14);   // 廣場臨街緣一支；雨棚下與旗桿列旁都不立燈桿（免得被當成雨棚柱、和旗桿糊在一起）
        // 停車場（右前，三列 12 格停 10 部）
        [[1.8,2.21],[1.8,2.37],[1.8,2.69],[2.3,2.21],[2.3,2.53],[2.3,2.69],[2.56,2.21],[2.56,2.37],[2.56,2.53],[1.8,2.53]]
          .forEach(([u,v],i)=>car(S,u,v,true,CARC[(i*5+2)%CARC.length]));
        mast(S,2.9,2.5,30);
        // 塔後綠地（原停車場位置，只露出一角）：一列樹
        for(const u of[.2,.5,.8])tree(S,u,.2,.9,u>.4?0:2,.5+u*.01);
        // 卸貨車
        truck(S,'u',HU1+.02,.31,{col:'#3f6b4c',box:'#e8eaec',stripe:'#3f6b4c'});
        truck(S,'u',HU1+.02,.99,{col:'#2f5a86',box:'#dfe3e6',stripe:'#e8b23c'});
        for(const u of[.5,1.25,2.0,2.6])tree(S,u,2.94,.7,1);
        return{flagAt:fa};
      },
      // v2 雙館：左右兩座鋸齒屋頂展館（玻璃陡面朝前、屋面沿坡接縫、山牆側有卸貨門），中央玻璃山牆連通廊（人字玻璃頂、入口雨遮與招牌）；
      // 館間後院貨車；前庭石材鋪面＋中軸紅磚步道直通入口、旗桿列（4 根）沿前庭臨街緣排開、入口前淨空；左側小停車場、右前遊覽車位；前緣計程車道＋斑馬線。
      // 招牌幾何：前庭上 28px 高的桿件（旗桿）只要立在 v≥2.46，桿頂就低於館前牆 z≥11 的招牌（與 u 無關）⇒ 旗桿列放 v=2.48、招牌板 z11–20、館牆 HH=20。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,lnR,RC,BL,lineU,lineV,dashU,dashV,stallsU,stallsV,zebraU,curb,crowd,scatter,lamp,mast,tree,bush,bench,bollards,car,CARC,truck,bus,textL,curtainL,curtainR,flagRow,SHD}=L;
        const AU0=.1,AU1=1.0,AV0=.1,AV1=1.8,BU0=1.8,BU1=2.62,BV0=.1,BV1=1.5,HH=20,TH=7;
        // 招牌：1px 深框＋深色底板＋淺色字（字距 1px、字間空白 2px）置中；夜裡只亮字
        const TW=s=>{let k=0;for(const ch of s)k+=ch===' '?2:4;return k-1;};
        const signL=(g2,n2,v,ua,ub,za,zb,str,bg)=>{faceL(g2,v,ua,ub,za,zb,'#161a1f');faceL(g2,v,ua+1/32,ub-1/32,za+1,zb-1,bg);
          const u=ua+(((ub-ua)*32-TW(str))/2)/32,p=P(u,v,zb-2),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
          for(const ch of str){if(ch===' '){k+=2;continue;}const gl=FONT[ch],dy=Math.round(k/2);
            for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g2,x0+k+c,y0+dy+r,1,1,'#f4f2ea');if(n2)RC(n2,x0+k+c,y0+dy+r,1,1,'#fff4d8');}k+=4;}};
        pave(g,'c',0,0,SZ,SZ,4471);
        pave(g,'a',AU1,.06,BU0-AU1,.9,4472);
        pave(g,'a',BU1,.04,SZ-BU1-.03,1.5,4473);
        // 退件修正：前庭往前加深到 v2.70（計程車道收窄成單線 v2.74–2.92），旗桿列才能排在臨街緣、和館牆之間留出鋪面。
        // 前庭 u .42–1.8；中軸紅磚步道 u 1.3125–1.5（邊緣落在 1/32 格上＝筆直，螢幕上約 5px 寬的等距帶），從連通廊入口直通臨街緣，兩側 1px 深色收邊。
        const FV=2.70,XU0=1.3125,XU1=1.5;
        pave(g,'z',.42,1.84,1.38,FV-1.84,4474);
        flat(g,XU0,1.86,XU1-XU0,FV-1.86,'#b3765c');
        for(let v=1.86+.0625,k=0;v<FV-.02;v+=.0625,k++)lineU(g,v,XU0+.04,XU1-.04,k%2?'#a0654e':'#c08469');
        flat(g,XU0,1.86,1/32,FV-1.86,'#6b4636');flat(g,XU1-1/32,1.86,1/32,FV-1.86,'#6b4636');
        // 左側小停車場（車頭朝 u）
        pave(g,'a',.04,1.84,.36,FV-1.84,4475);stallsV(g,.06,1.9,.75,5,.26);lineV(g,.4,1.86,FV,'#d9d6ce');
        pave(g,'a',1.84,1.56,1.13,FV-1.56,4476);stallsU(g,2.3,1.62,.6,3,.52,'#d6b243');stallsV(g,1.9,2.2,.45,3,.36);
        pave(g,'a',.04,FV+.04,2.93,.18,4477);curb(g,.42,FV,1.38,.04);
        zebraU(g,1.25,1.57,FV+.05,2.91);
        pave(g,'s',0,2.92,SZ,.08,4478);
        L.shadow(g,[['b',AU0,AV0,AU1-AU0,AV1-AV0,HH+TH],['b',BU0,BV0,BU1-BU0,BV1-BV0,HH+TH],['b',AU1,.95,BU0-AU1,.9,20]]);
        // 鋸齒屋頂展館：齒沿 v、玻璃陡面朝 +v
        const hall=(g2,n2,u0,u1,v0,v1,nT,seed)=>{boxZ(g2,u0,v0,u1-u0,v1-v0,0,HH,'#9aa3a9','#e1e4e2','#a9b1b5');
          for(let u=u0+.1;u<u1-.02;u+=.1)BL(g2,P(u,v1,1),P(u,v1,HH-2),'#cfd3d2');
          for(let v=v0+.1;v<v1-.02;v+=.1)BL(g2,P(u1,v,1),P(u1,v,HH-2),'#949da2');
          faceL(g2,v1,u0,u1,HH-2,HH,'#f3f4f2');faceR(g2,u1,v0,v1,HH-2,HH,'#c3c9cc');
          const dv=(v1-v0)/nT;
          for(let i=0;i<nT;i++){const a=v0+i*dv,b=a+dv;
            fp(g2,[P(u0,a,HH),P(u1,a,HH),P(u1,b,HH+TH),P(u0,b,HH+TH)],'#aab2b8');
            for(let t=u0+.08;t<u1-.02;t+=.08)BL(g2,P(t,a,HH),P(t,b,HH+TH),'#98a1a7');
            fp(g2,[P(u1,a,HH),P(u1,b,HH),P(u1,b,HH+TH)],'#848d93');
            if(i<nT-1||true){faceL(g2,b,u0,u1,HH,HH+TH,'#7fa3bb');for(let t=u0+.07;t<u1-.02;t+=.07)BL(g2,P(t,b,HH),P(t,b,HH+TH),'#dfe6ea');lnL(g2,b,u0,u1,HH+TH,'#eef2f4');
              if(n2)for(let t=u0+.02,k=0;t<u1-.06;t+=.07,k++)if(A.hashLocal479(seed,i,k)<.4)fp(n2,[P(t+.01,b,HH+1),P(t+.06,b,HH+1),P(t+.06,b,HH+TH-1),P(t+.01,b,HH+TH-1)],'#e9d49a');}}};
        // 館前小門（雙扇玻璃門＋雨遮＋門燈）
        const sideDoor=(g2,n2,v,u)=>{faceL(g2,v,u,u+.12,0,7,'#2d3b48');faceL(g2,v,u+.055,u+.065,0,7,'#9fb4c2');
          boxZ(g2,u-.02,v,.16,.06,7,1,'#e9edf0','#f4f6f7','#b5bec4');if(n2)faceL(n2,v,u+.01,u+.11,1,6,'#ffe6ae');};
        S.o(1.3,(g2,n2)=>{hall(g2,n2,AU0,AU1,AV0,AV1,5,4481);dockDoors(L,g2,n2,AU1,[.25,.6]);
          signL(g2,n2,AV1,.16,.94,11,20,'HALL A','#23405c');sideDoor(g2,n2,AV1,.85);});
        S.o(2.95,(g2,n2)=>{hall(g2,n2,BU0,BU1,BV0,BV1,4,4482);dockDoors(L,g2,n2,BU1,[.3,.7,1.1]);
          signL(g2,n2,BV1,1.83,2.6,11,20,'HALL B','#6b2328');sideDoor(g2,n2,BV1,2.3);});
        // 館間後院貨車
        truck(S,'u',AU1+.02,.62,{col:'#c0392b',box:'#e4e7e9',stripe:'#c0392b'},1.75);
        // 右側碼頭貨車
        truck(S,'u',BU1+.02,.33,{col:'#2f5a86',box:'#e8eaec',stripe:'#2f5a86',Lt:.22});
        truck(S,'u',BU1+.02,1.13,{col:'#3f6b4c',box:'#dfe3e6',stripe:'#e8b23c',Lt:.22});
        // ---- 中央玻璃連通廊（人字玻璃頂，脊沿 v）----
        S.o(2.0,(g2,n2)=>{const u0=AU1,u1=BU0,v0=.95,v1=1.86,h=13,rh=9,um=(u0+u1)/2;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#cfd5d9','#9fbccc','#5f7f92');
          curtainR(g2,n2,u1,v0,v1,0,h,{glass:'#5b7d94',mull:'#a9b8c2',fh:6,mw:4,seed:4491,lit:.6});
          // 山牆（+v 面）：五角形玻璃
          fp(g2,[P(u0,v1,0),P(u1,v1,0),P(u1,v1,h),P(um,v1,h+rh),P(u0,v1,h)],'#86a9bf');
          for(let u=u0+.08;u<u1-.02;u+=.08){const zt=h+rh*(1-Math.abs(u-um)/(um-u0));BL(g2,P(u,v1,1),P(u,v1,zt-1),'#e6ecef');}
          for(const z of[6,12,17])for(let u=u0;u<u1;u+=.02){const zt=h+rh*(1-Math.abs(u-um)/(um-u0));if(z<zt-1)RC(g2,...P(u,v1,z),1,1,'#e6ecef');}
          BL(g2,P(u0,v1,h),P(um,v1,h+rh),'#f4f6f7');BL(g2,P(um,v1,h+rh),P(u1,v1,h),'#f4f6f7');
          // 屋頂兩坡
          fp(g2,[P(u0,v0,h),P(um,v0,h+rh),P(um,v1,h+rh),P(u0,v1,h)],'#9dbccf');
          fp(g2,[P(um,v0,h+rh),P(u1,v0,h),P(u1,v1,h),P(um,v1,h+rh)],'#6f93aa');
          for(let v=v0+.1;v<v1-.02;v+=.1){BL(g2,P(u0,v,h),P(um,v,h+rh),'#dfe8ee');BL(g2,P(um,v,h+rh),P(u1,v,h),'#9fb4c2');}
          BL(g2,P(um,v0,h+rh+1),P(um,v1,h+rh+1),'#f4f6f7');
          if(n2)for(let u=u0+.1,k=0;u<u1-.1;u+=.08,k++)if(A.hashLocal479(4492,k,1)<.7)fp(n2,[P(u,v1,2),P(u+.06,v1,2),P(u+.06,v1,11),P(u,v1,11)],'#ffe2a2');
          // 入口雨遮＋招牌
          boxZ(g2,u0+.1,v1,u1-u0-.2,.14,9,2,'#e9edf0','#f4f6f7','#b5bec4');faceL(g2,v1+.14,u0+.1,u1-.1,9,11,'#2b4a66');
          faceL(g2,v1,um-.14,um+.14,0,7,'#2d3b48');if(n2)faceL(n2,v1,um-.13,um+.13,1,6,'#ffe6ae');});
        // ---- 前庭：旗桿列排在臨街緣（v2.64，路緣內 2px），入口與中軸淨空 ----
        // 幾何：桿立在 v 上時，靜態旗面頂比 HALL A 館牆底線低 32v−84.6px ⇒ v2.64 時旗面正好落在牆腳，比招牌下緣低 ~11px，
        // 旗座到館牆之間露出約 20px 前庭鋪面。桿距 .25 格＝8px（旗面 6px＋1px 空隙），主旗（動態）排最右，往右飄向淨空的中軸前方。
        const fa=flagRow(S,[[.45,FV-.06,0],[.7,FV-.06,4],[.95,FV-.06,1],[1.2,FV-.06,2]],3,8);
        for(const[u,v]of[[.7,1.95],[1.08,1.95],[1.7,1.95]])bush(S,u,v,3);
        for(const v of[2.02,2.34])bench(S,1.2,v,false);for(const v of[2.02,2.34])bench(S,1.6,v,false);
        crowd(S,scatter(4493,8,.6,1.95,.6,.5),0,4.2);
        crowd(S,[[1.36,1.95,0],[1.45,1.94,5],[1.43,2.16,4],[1.37,2.4,8],[1.45,2.58,1],[1.66,2.2,3],[1.72,2.46,6]],0,3.6);
        // 停車與遊覽車（左停車場旗面後方只停中性色車，免得旗面後面一團紅黑白）
        [[1,'#c9ccd0'],[2,'#5d6b74'],[3,'#2f5a86'],[4,'#c9ccd0']].forEach(([k,c])=>car(S,.075,1.91+.15*k,true,c));
        bus(S,'v',1.64,2.35,'#2f6f9a');bus(S,'v',1.64,2.75,'#c0392b');
        car(S,1.92,2.23,true,'#5d6b74');car(S,1.92,2.38,true,'#e8e6df');car(S,1.92,2.53,true,'#8a3a33');
        for(const[u,c]of[[.1,'#e8b62c'],[.46,'#e8b62c'],[.84,'#2b2e33'],[1.7,'#e8e6df'],[2.2,'#e8b62c'],[2.56,'#e8b62c']])car(S,u,FV+.07,true,c,null,c==='#e8b62c');
        crowd(S,[[1.62,FV+.02,3],[1.66,FV+.03,0],[1.1,FV+.02,5]],0,4.4);
        // 照明：停車場一支矮燈、遊覽車區兩支；入口正前方不立桿
        for(const[u,v]of[[.05,2.62],[2.46,2.62],[2.86,2.62]])lamp(S,u,v,14);
        // 計程車道前不種人行道樹（樹冠會蓋住排班車）
        mast(S,2.95,2.45,28);
        return{flagAt:fa};
      },
    ];
    build(44,dims(44,[208,220,104,218]),SZ,K44);
  }catch(e){console.error('cul_d k44',e);errs.push('k44:'+(e&&e.stack||e));}

  // ================= k47 植物園（3×3）=================
  try{
    const SZ=3;
    const STONE=['#9d9686','#b3ac9c','#c9c2b2','#dad4c5','#e9e4d7'];
    const PI=Math.PI;
    // 維多利亞溫室玻璃材質：白鐵格柵＋淡青玻璃；低處（牆面）透出室內植栽，屋面淡淡透出；z<pl 為石砌勒腳
    const GLW=['#3d6b73','#4f8088','#66979b','#82b0b0','#a7cdc7'];
    const vic=(L,o={})=>{const{tone,mix}=L;const wallZ=o.wallZ==null?99:o.wallZ,pl=o.plinth==null?2:o.plinth;
      return (h,rib)=>{if(h.z<pl&&h.f!==3)return tone(STONE,h.l);
        if(o.rim&&o.rim(h))return h.l<.1?'#b9c3c2':'#f4f6f1';
        if(rib)return h.l<.05?'#a3aeac':'#eef1ea';
        let c=tone(GLW,h.l-.06);const low=h.z<wallZ;
        if(h.ic)c=mix(c,h.ic,low?.62:.46);else if(low)c=mix(c,'#35503f',.35);
        return c;};};
    const vicN=(o={})=>(h,rib)=>{if(rib||h.z<(o.plinth==null?2:o.plinth))return null;if(h.z>(o.wallZ==null?99:o.wallZ))return null;
      return A.hashLocal479(o.seed||1,h.key|0,7)<(o.p||.42)?'#d8c98f':null;};
    const gBox=(du=.1,dz=5)=>h=>h.f===2?Math.floor(h.u/du)*1000+Math.floor(h.z/dz):h.f===1?Math.floor(h.v/du)*1000+Math.floor(h.z/dz):null;
    const gCz=(cu,cv,N=28,dz=5)=>h=>h.f===4?Math.floor((Math.atan2(h.v-cv,h.u-cu)+PI)/(2*PI)*N)*1000+Math.floor(h.z/dz):null;
    const gEl=(cu,cv,zc,rz,N=24,NR=5)=>h=>{if(h.f!==4)return null;const e=(h.z-zc)/rz;if(e>.9)return 9000;const ring=Math.floor(e*NR),n=e>.7?N/2:N;return ring*1000+Math.floor((Math.atan2(h.v-cv,h.u-cu)+PI)/(2*PI)*n);};
    const gCu=(cv,zc,rv,rz,du=.1,NA=10)=>h=>{if(h.f===4)return Math.floor(h.u/du)*1000+Math.floor(Math.atan2((h.z-zc)/rz,(h.v-cv)/rv)/PI*NA);if(h.f===1)return Math.floor(h.v/.08)*1000+Math.floor(h.z/5);return null;};
    const gCv=(cu,zc,ru,rz,dv=.1,NA=10)=>h=>{if(h.f===4)return Math.floor(h.v/dv)*1000+Math.floor(Math.atan2((h.z-zc)/rz,(h.u-cu)/ru)/PI*NA);if(h.f===2)return Math.floor(h.u/.08)*1000+Math.floor(h.z/5);return null;};
    // 室內植栽（畫在獨立畫布，供玻璃取樣）
    const INP=[['#9ad45e','#5fa83c','#2f6a26'],['#b8d96a','#7fb040','#46782a'],['#7ccf7a','#44a050','#256a32']];
    const inTree=(L,g,u,v,r,h,k=0)=>{const{P,RC,ell}=L;const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=INP[k%3];RC(g,x,y-h,1,h,'#5a4330');const cy=y-h;
      ell(g,x+1,cy+1,r,Math.max(1,r-1),pal[2]);ell(g,x,cy,r,Math.max(1,r-1),pal[1]);ell(g,x-1,cy-1,Math.max(1,r-1),Math.max(1,r-2),pal[0]);};
    // 地面多邊形
    const blobPts=(cu,cv,ru,rv,k=0,N=56,ph=0)=>{const o=[];for(let i=0;i<N;i++){const a=i/N*PI*2,w=1+k*(.1*Math.sin(3*a+1+ph)+.06*Math.sin(5*a+2+ph));o.push([cu+ru*w*Math.cos(a),cv+rv*w*Math.sin(a)]);}return o;};
    const gpoly=(L,g,pts,c,z=0)=>L.fp(g,pts.map(([u,v])=>L.P(u,v,z)),c);
    const spline=(pts,n=8)=>{const o=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
        for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;o.push([0,1].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
      o.push(pts[pts.length-1]);return o;};
    const ribbon=(L,g,pts,w,c)=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1,nu=-dv/l*w/2,nv=du/l*w/2;
        gpoly(L,g,[[a[0]+nu,a[1]+nv],[b[0]+nu,b[1]+nv],[b[0]-nu,b[1]-nv],[a[0]-nu,a[1]-nv]],c);}for(const p of pts)L.disc(g,p[0],p[1],w/2,c);};
    const pond=(L,g,cu,cv,ru,rv,k,seed,o={})=>{const{P,RC,ell,hsh}=L;
      gpoly(L,g,blobPts(cu,cv,ru+.05,rv+.05,k),o.edge||'#c2bba9');
      gpoly(L,g,blobPts(cu,cv,ru+.015,rv+.015,k),'#6f6a5b');
      gpoly(L,g,blobPts(cu,cv,ru,rv,k),'#3d7494');
      gpoly(L,g,blobPts(cu+.03,cv+.03,ru*.8,rv*.78,k),'#4a88aa');
      for(let i=0;i<Math.round(ru*rv*26);i++){const a=hsh(seed,i,1)*6.283,r=Math.sqrt(hsh(seed,i,2))*.72,p=P(cu+ru*r*Math.cos(a),cv+rv*r*Math.sin(a));RC(g,p[0],p[1],3,1,'#86bdd6');}
      for(let i=0;i<(o.lily||0);i++){const a=hsh(seed,i,5)*6.283,r=.4+hsh(seed,i,6)*.45,p=P(cu+ru*r*Math.cos(a),cv+rv*r*Math.sin(a));
        ell(g,p[0],p[1],2,1,'#4f8f3f');RC(g,p[0]-1,p[1]-1,2,1,'#6fb055');if(hsh(seed,i,7)<.45)RC(g,p[0],p[1]-1,1,1,'#f6b0c8');}};
    // 鐵欄杆（細線層）：a→b，每 3px 一根立柱＋上下橫桿；gaps 為開口（比例）
    const rail=(S,L,a,b,d,gaps=[],h=5)=>S.t(d,(g)=>{const{P,RC,BL}=L;const pa=P(a[0],a[1]),pb=P(b[0],b[1]),len=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,Math.round(len/3));
      const inG=t=>gaps.some(q=>t>q[0]&&t<q[1]),q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);
      for(let i=0;i<=n;i++){const t=i/n;if(inG(t))continue;const p=q(t,0);RC(g,p[0],p[1]-h,1,h,'#3b4247');}
      let t0=0;const seg=(x,y)=>{if(y-x<.01)return;BL(g,q(x,h),q(y,h),'#2e3439');BL(g,q(x,1),q(y,1),'#4a5257');};
      for(const gp of[...gaps].sort((p,r)=>p[0]-r[0])){seg(t0,gp[0]);t0=gp[1];}seg(t0,1);});
    // 石柱大門：兩墩＋鐵拱＋門燈
    const gate=(S,L,ua,ub,v,d)=>{const{P,RC,BL,boxZ}=L;L.SHD.push(['b',ua-.025,v-.025,.05,.05,8],['b',ub-.025,v-.025,.05,.05,8]);
      S.o(d,(g,n)=>{for(const u of[ua,ub]){boxZ(g,u-.025,v-.025,.05,.05,0,7,'#b9b09c','#cfc6b2','#9d9582');boxZ(g,u-.032,v-.032,.064,.064,7,1,'#e2dccc','#e6e0d2','#b3ab98');
        const p=P(u,v,8);RC(g,p[0],p[1]-2,1,2,'#2e3439');RC(g,p[0],p[1]-3,1,1,'#f1e3b0');if(n)RC(n,p[0],p[1]-3,1,1,'#ffe6a0');}});
      S.t(d+.001,(g)=>{const N=16;for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N,z0=8+4*Math.sin(PI*t0),z1=8+4*Math.sin(PI*t1);
        BL(g,P(ua+(ub-ua)*t0,v,z0),P(ua+(ub-ua)*t1,v,z1),'#2e3439');}
        BL(g,P(ua,v,8),P(ub,v,8),'#2e3439');
        for(let t=.12;t<.9;t+=.12){const z=8+4*Math.sin(PI*t);BL(g,P(ua+(ub-ua)*t,v,8),P(ua+(ub-ua)*t,v,z),'#4a5257');}
        const m=P((ua+ub)/2,v,12);RC(g,m[0]-2,m[1]-1,5,2,'#3f6b4c');RC(g,m[0]-1,m[1],3,1,'#e9e2c4');});};
    // 四坡屋頂：c＝[前(+v)亮, 右(+u)暗, 後/左, 脊線]
    const hip=(L,g,u0,v0,du,dv,z,rh,c)=>{const{P,fp,BL}=L;const u1=u0+du,v1=v0+dv;
      if(du>=dv){const vm=v0+dv/2,hr=dv/2;fp(g,[P(u0,v0,z),P(u1,v0,z),P(u1-hr,vm,z+rh),P(u0+hr,vm,z+rh)],c[2]);fp(g,[P(u0,v0,z),P(u0+hr,vm,z+rh),P(u0,v1,z)],c[2]);
        fp(g,[P(u0+hr,vm,z+rh),P(u1-hr,vm,z+rh),P(u1,v1,z),P(u0,v1,z)],c[0]);fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1-hr,vm,z+rh)],c[1]);BL(g,P(u0+hr,vm,z+rh),P(u1-hr,vm,z+rh),c[3]);}
      else{const um=u0+du/2,hr=du/2;fp(g,[P(u0,v0,z),P(um,v0+hr,z+rh),P(um,v1-hr,z+rh),P(u0,v1,z)],c[2]);fp(g,[P(u0,v0,z),P(u1,v0,z),P(um,v0+hr,z+rh)],c[2]);
        fp(g,[P(um,v0+hr,z+rh),P(u1,v0,z),P(u1,v1,z),P(um,v1-hr,z+rh)],c[1]);fp(g,[P(u0,v1,z),P(u1,v1,z),P(um,v1-hr,z+rh)],c[0]);BL(g,P(um,v0+hr,z+rh),P(um,v1-hr,z+rh),c[3]);}};
    // 入口小屋（紅磚、四坡石板瓦、售票窗、門燈）
    const lodge=(S,L,u0,v0,du,dv,d)=>{const{P,RC,boxZ,faceL,faceR,lnL,lnR}=L;L.SHD.push(['b',u0,v0,du,dv,14]);
      S.o(d,(g,n)=>{const u1=u0+du,v1=v0+dv,h=9;boxZ(g,u0,v0,du,dv,0,h,'#8f5a45','#b5654a','#86452f');
        for(let z=2;z<h;z+=2){lnL(g,v1,u0,u1,z,'#a45a41');lnR(g,u1,v0,v1,z,'#773c29');}
        faceL(g,v1,u0,u1,0,1,'#cfc6b2');faceR(g,u1,v0,v1,0,1,'#a8a08c');
        const um=(u0+u1)/2;faceL(g,v1,um-.05,um+.03,0,6,'#4a3326');faceL(g,v1,um-.04,um+.02,1,6,'#6e4c34');
        faceL(g,v1,u0+.05,u0+.13,3,6,'#e8e2cc');faceL(g,v1,u0+.06,u0+.12,3,5,'#3d5566');if(n)faceL(n,v1,u0+.06,u0+.12,3,5,'#ffe2a2');
        faceR(g,u1,v0+.06,v0+.14,3,6,'#e8e2cc');faceR(g,u1,v0+.07,v0+.13,3,5,'#34495a');if(n)faceR(n,u1,v0+.07,v0+.13,3,5,'#f3d68e');
        hip(L,g,u0-.03,v0-.03,du+.06,dv+.06,h,7,['#6b7780','#4c565e','#5b666e','#8e9aa2']);
        const p=P(um+.06,v1,7);RC(g,p[0],p[1]-1,1,2,'#f1e3b0');if(n)RC(n,p[0],p[1]-1,1,2,'#ffe6a0');});};
    // 修剪花壇：綠籬框（低矮描邊）＋框內兩床花＋四角圓錐樹
    const parterre=(S,L,u0,v0,du,dv,cols,d,seed)=>{const{bed,hedge,cone}=L;
      S.o(d,(g)=>{const t=.035;hedge(g,u0,v0,du,t,2);hedge(g,u0,v0+dv-t,du,t,2);hedge(g,u0,v0,t,dv,2);hedge(g,u0+du-t,v0,t,dv,2);});
      return(g)=>{const m=.07,bu=(du-3*m)/2;bed(g,u0+m,v0+m,bu,dv-2*m,[cols[0]]);bed(g,u0+2*m+bu,v0+m,bu,dv-2*m,[cols[1]]);};};

    const K47=[
      // v0 維多利亞穹頂溫室：後方中央白鐵玻璃大穹頂（鼓座、簷口、頂塔、尖頂），兩翼筒拱溫室以半穹頂收尾；前方正門小玻璃門廊。
      // 前半為法式花園：中軸碎石步道、十字交叉圓形噴泉池、四塊綠籬框花壇（各兩床不同花色、四角圓錐樹），
      // 右前入口紅磚小屋，前緣鐵欄杆與石柱鐵拱大門，兩側行道樹，古典路燈、長椅、遊客。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,lnR,RC,BL,ell,disc,ring,crowd,scatter,oldLamp,tree,cone,palm,bush,bench,bed,ray,tone,mix,WHT5,SHD}=L;
        const cu=1.5,cv=.8,R=.4,DZ=15;
        pave(g,'m',0,0,SZ,SZ,4701);
        pave(g,'q',.1,.28,2.8,1.04,4702);
        pave(g,'q',1.38,1.3,.24,1.7,4703);pave(g,'q',.14,2.04,2.72,.16,4704);
        pave(g,'q',.2,1.3,.08,1.55,4705);pave(g,'q',2.72,1.3,.08,1.55,4706);
        const beds=[];
        beds.push(parterre(S,L,.34,1.4,.96,.56,[0,1],1.4+1.3+.5,4711));
        beds.push(parterre(S,L,1.7,1.4,.96,.56,[2,3],2.66+1.4+.5,4712));
        beds.push(parterre(S,L,.34,2.28,.96,.54,[3,5],1.3+2.28+.5,4713));
        beds.push(parterre(S,L,1.7,2.28,.36,.54,[1,1],2.06+2.28+.5,4714));
        for(const b of beds)b(g);
        // 十字噴泉池
        disc(g,1.5,2.12,.23,'#cfc7b5');disc(g,1.5,2.12,.2,'#8f8a7b');disc(g,1.5,2.12,.185,'#4a88aa');disc(g,1.5,2.12,.12,'#5b98b8');ring(g,1.5,2.12,.2,'#e6dfcf');
        L.shadow(g,[['c',cu,cv,R,0,DZ],['d',cu,cv,R,24,DZ],['b',.2,.58,2.6,.44,18],['b',1.4,1.18,.2,.18,12]]);
        // ---- 溫室（光線投射）----
        S.o(1.6,(g2,n2)=>{const[ic,ix]=A.cv(K.W,K.H);
          palm(null,cu,cv,30,null,ix);palm(null,cu-.14,cv+.12,21,null,ix);palm(null,cu+.14,cv-.1,24,null,ix);inTree(L,ix,cu+.12,cv+.16,5,12,1);inTree(L,ix,cu-.18,cv-.08,4,14,2);
          for(let u=.3;u<1.1;u+=.2)inTree(L,ix,u,.84,4,10,(u*10|0)%3);for(let u=1.95;u<2.8;u+=.2)inTree(L,ix,u,.84,4,11,(u*10|0)%3);
          palm(null,.75,.8,14,null,ix);palm(null,2.25,.8,15,null,ix);
          const W0=.6,W1=1.0,WC=.8,WZ=10,WR=12,prims=[];
          const wing=(ua,ub,apse)=>{prims.push({u:[ua,ub],v:[W0,W1],z:[0,WZ],grid:gBox(.125,6),col:vic(L,{wallZ:WZ}),nc:vicN({seed:4721,wallZ:WZ})});
            prims.push({q:['cu',0,WC,WZ,1,(W1-W0)/2,WR],u:[ua,ub],z:[WZ,WZ+WR+1],grid:gCu(WC,WZ,(W1-W0)/2,WR,.125,6),col:vic(L,{wallZ:0,rim:h=>h.f===1&&(((h.v-WC)/((W1-W0)/2))**2+((h.z-WZ)/WR)**2)>.78})});
            const ac=apse>0?ub:ua,ar=.2;
            prims.push({q:['cz',ac,WC,0,ar,(W1-W0)/2,1],u:apse>0?[ac,ac+ar]:[ac-ar,ac],z:[0,WZ],grid:gCz(ac,WC,16,6),col:vic(L,{wallZ:WZ}),nc:vicN({seed:4722,wallZ:WZ})});
            prims.push({q:['el',ac,WC,WZ,ar,(W1-W0)/2,WR],u:apse>0?[ac,ac+ar]:[ac-ar,ac],z:[WZ,WZ+WR+1],grid:gEl(ac,WC,WZ,WR,14,3),col:vic(L,{wallZ:0})});};
          wing(.4,1.12,-1);wing(1.88,2.6,1);
          prims.push({q:['cz',cu,cv,0,R+.03,R+.03,1],z:[0,2],col:h=>tone(STONE,h.l)});
          prims.push({q:['cz',cu,cv,0,R,R,1],z:[0,DZ],grid:gCz(cu,cv,22,6),col:vic(L,{wallZ:DZ}),nc:vicN({seed:4723,wallZ:DZ,p:.5})});
          prims.push({q:['cz',cu,cv,0,R+.03,R+.03,1],z:[DZ,DZ+2],col:h=>h.f===3?'#dfe3de':tone(WHT5,h.l)});
          prims.push({q:['el',cu,cv,DZ+2,R,R,24],z:[DZ+2,DZ+27],grid:gEl(cu,cv,DZ+2,24,20,4),col:vic(L,{wallZ:0})});
          prims.push({q:['cz',cu,cv,0,.09,.09,1],z:[DZ+24,DZ+31],grid:gCz(cu,cv,10,4),col:vic(L,{wallZ:0,plinth:0})});
          prims.push({q:['el',cu,cv,DZ+31,.11,.11,5],z:[DZ+31,DZ+37],col:h=>tone(WHT5,h.l)});
          ray(g2,n2,prims,{inner:ic});
          const tp=P(cu,cv,DZ+36);RC(g2,tp[0],tp[1]-5,1,5,'#5b646a');RC(g2,tp[0]-1,tp[1]-2,3,1,'#5b646a');RC(g2,tp[0],tp[1]-6,1,1,'#c9a64a');
          // 正門玻璃門廊（人字頂，脊沿 v）
          const pu0=1.4,pu1=1.6,pv0=1.14,pv1=1.34,ph=9,um=1.5;
          boxZ(g2,pu0,pv0,pu1-pu0,pv1-pv0,0,ph,'#dfe8e4','#a9cbc9','#78a3a6');
          for(let u=pu0+.04;u<pu1;u+=.04)BL(g2,P(u,pv1,1),P(u,pv1,ph-1),'#f2f4ee');for(let v=pv0+.05;v<pv1;v+=.05)BL(g2,P(pu1,v,1),P(pu1,v,ph-1),'#c3cbca');
          faceL(g2,pv1,um-.04,um+.04,0,6,'#3f5a52');if(n2)faceL(n2,pv1,um-.035,um+.035,1,6,'#ffe2a2');
          fp(g2,[P(pu0-.01,pv1,ph),P(pu1+.01,pv1,ph),P(um,pv1,ph+6)],'#bddcd6');BL(g2,P(pu0-.01,pv1,ph),P(um,pv1,ph+6),'#f7f8f4');BL(g2,P(um,pv1,ph+6),P(pu1+.01,pv1,ph),'#f7f8f4');
          fp(g2,[P(um,pv0,ph+6),P(pu1+.01,pv0,ph),P(pu1+.01,pv1,ph),P(um,pv1,ph+6)],'#7fa9ab');BL(g2,P(um,pv0,ph+6),P(um,pv1,ph+6),'#f7f8f4');
          faceL(g2,pv1,pu0,pu1,0,1,'#b3ac9c');});
        // ---- 噴泉 ----
        S.o(1.5+2.12+.2,(g2)=>{const p=P(1.5,2.12,0),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x-1,y-6,3,5,'#cfc7b2');RC(g2,x+1,y-6,1,5,'#a9a18e');ell(g2,x,y-6,3,1,'#e2dccb');ell(g2,x,y-6,2,0,'#6ea8c6');});
        S.t(1.5+2.12+.21,(g2,n2)=>{const p=P(1.5,2.12,0),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x,y-11,1,4,'#e8f6fb');RC(g2,x-1,y-9,1,2,'#cfeaf4');RC(g2,x+1,y-9,1,2,'#cfeaf4');
          RC(g2,x-3,y-7,1,1,'#cfeaf4');RC(g2,x+3,y-7,1,1,'#cfeaf4');RC(g2,x-5,y-3,1,2,'#bfe2f0');RC(g2,x+5,y-3,1,2,'#bfe2f0');RC(g2,x-4,y-5,1,1,'#dff3fa');RC(g2,x+4,y-5,1,1,'#dff3fa');
          if(n2){RC(n2,x,y-11,1,4,'#bfe6ff');RC(n2,x-1,y-9,3,2,'#9fd6f5');}});
        // 綠籬框外角圓錐樹
        for(const[u,v]of[[.36,1.42],[1.28,1.42],[1.72,1.42],[2.64,1.42],[.36,1.94],[2.64,1.94],[.36,2.3],[.36,2.8],[1.28,2.8],[2.04,2.3]])cone(S,u,v,9);
        // 側邊行道樹、後方樹叢
        for(const v of[1.45,1.85,2.3,2.72])tree(S,.11,v,.9,v>2?2:0);
        for(const v of[1.45,1.85])tree(S,2.9,v,.9,1);
        tree(S,.18,.22,1.0,2);tree(S,2.82,.22,1.0,0);tree(S,.12,.6,.9,1);tree(S,2.88,.62,.9,2);tree(S,2.88,1.05,.85,0);tree(S,.12,1.05,.85,2);
        // 入口小屋＋大門＋欄杆
        lodge(S,L,2.14,2.36,.46,.4,2.6+2.76+.2);
        gate(S,L,1.35,1.65,2.87,1.5+2.87+.1);
        rail(S,L,[.06,2.92],[1.3,2.92],2.92+1.3);rail(S,L,[1.7,2.92],[2.92,2.92],2.92+2.92);rail(S,L,[2.92,.06],[2.92,2.92],2.92+2.92+.01);
        // 燈、長椅、遊客
        for(const v of[1.45,1.9,2.45,2.8]){oldLamp(S,1.34,v);oldLamp(S,1.66,v);}
        for(const u of[.6,1.0,2.0,2.4])bench(S,u,2.06,true);
        crowd(S,[[1.46,1.5,1],[1.55,1.62,3],[1.44,1.95,5],[1.58,2.4,0],[1.47,2.6,2],[1.52,2.75,6],[.7,2.1,4],[.9,2.15,7],[2.2,2.1,8],[2.5,2.14,1],[.24,1.7,3],[2.76,1.8,5],[1.2,1.25,2],[1.8,1.24,6]],0,4.0);
        crowd(S,scatter(4731,8,.3,.3,2.4,.25).filter(p=>p[0]<1.0||p[0]>2.0),0,1.2);
        return{};
      },
      // v1 長拱溫室群：後方主館為兩段式拱頂棕櫚館（低側廊筒拱＋高起中殿筒拱，東西兩端半穹頂收尾，正面玻璃門廊）；
      // 右前兩座低矮育苗長拱溫室；左前大蓮花池（木拱橋跨池、垂柳、蓮葉），碎石步道自前門過橋直通主館，沿路花境、長椅、遊客。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,lnR,RC,BL,ell,disc,ring,crowd,scatter,oldLamp,tree,cone,palm,bush,bench,bed,ray,tone,mix,WHT5,SHD}=L;
        const VC=.72,AR=.44,AZ=9,AH=11,NU0=.8,NU1=1.55,NR=.2,NZ=25,NH=9;
        pave(g,'m',0,0,SZ,SZ,4741);
        pave(g,'q',.05,.2,2.9,1.18,4742);
        // 步道：前門→橋→主館
        const path=spline([[1.0,2.92],[1.0,2.62],[.98,2.45]],6);ribbon(L,g,path,.16,'#cdbf9f');
        ribbon(L,g,spline([[.98,1.62],[.98,1.4]],4),.16,'#cdbf9f');
        ribbon(L,g,spline([[.1,1.46],[1.0,1.44],[1.8,1.46],[2.9,1.44]],6),.14,'#cdbf9f');
        ribbon(L,g,spline([[1.8,1.46],[1.78,2.0],[1.82,2.5],[1.8,2.92]],6),.14,'#cdbf9f');
        ribbon(L,g,spline([[1.0,2.72],[1.4,2.7],[1.8,2.72]],6),.12,'#cdbf9f');
        // 蓮花池
        pond(L,g,.95,2.05,.62,.4,1,4743,{lily:26});
        // 花境
        bed(g,1.2,1.56,.5,.14,[0,1,3]);bed(g,1.2,2.4,.5,.14,[2,4,1]);bed(g,.12,2.62,.7,.12,[5,1,0]);bed(g,1.95,2.62,.9,.12,[3,2,4]);
        // 育苗溫室的碎石底
        pave(g,'q',1.92,1.56,.98,.34,4744);pave(g,'q',1.92,2.02,.98,.34,4745);
        L.shadow(g,[['b',.3,.28,1.65,.88,AZ+AH*.7],['b',NU0,.52,NU1-NU0,.4,NZ+NH*.6],['b',1.95,.28,.3,.88,AZ+6],['b',1.95,1.58,.9,.28,11],['b',1.95,2.04,.9,.28,11]]);
        // ---- 主館（光線投射）----
        S.o(1.5,(g2,n2)=>{const[ic,ix]=A.cv(K.W,K.H);
          for(let u=.4;u<1.95;u+=.22){palm(null,u,VC-.05,u>NU0&&u<NU1?26:12,null,ix);inTree(L,ix,u+.1,VC+.22,4,9,(u*10|0)%3);}
          const prims=[];
          prims.push({u:[.3,1.95],v:[VC-AR,VC+AR],z:[0,AZ],grid:gBox(.125,6),col:vic(L,{wallZ:AZ}),nc:vicN({seed:4751,wallZ:AZ})});
          prims.push({q:['cu',0,VC,AZ,1,AR,AH],u:[.3,1.95],z:[AZ,AZ+AH+1],grid:gCu(VC,AZ,AR,AH,.125,8),col:vic(L,{wallZ:0})});
          for(const[ac,s]of[[.3,-1],[1.95,1]]){const ar=.3;
            prims.push({q:['cz',ac,VC,0,ar,AR,1],u:s>0?[ac,ac+ar]:[ac-ar,ac],z:[0,AZ],grid:gCz(ac,VC,18,6),col:vic(L,{wallZ:AZ}),nc:vicN({seed:4752,wallZ:AZ})});
            prims.push({q:['el',ac,VC,AZ,ar,AR,AH],u:s>0?[ac,ac+ar]:[ac-ar,ac],z:[AZ,AZ+AH+1],grid:gEl(ac,VC,AZ,AH,16,3),col:vic(L,{wallZ:0})});}
          prims.push({u:[NU0,NU1],v:[VC-NR,VC+NR],z:[0,NZ],grid:gBox(.125,5),col:vic(L,{wallZ:NZ,plinth:0}),nc:vicN({seed:4753,wallZ:NZ,plinth:AZ+AH,p:.35})});
          prims.push({q:['cu',0,VC,NZ,1,NR,NH],u:[NU0,NU1],z:[NZ,NZ+NH+1],grid:gCu(VC,NZ,NR,NH,.125,5),col:vic(L,{wallZ:0,rim:h=>h.f===1&&(((h.v-VC)/NR)**2+((h.z-NZ)/NH)**2)>.75})});
          ray(g2,n2,prims,{inner:ic});
          // 中殿屋脊通風帽
          BL(g2,P(NU0+.02,VC,NZ+NH+1),P(NU1-.02,VC,NZ+NH+1),'#f7f8f4');
          for(let u=NU0+.1;u<NU1;u+=.15){const p=P(u,VC,NZ+NH+1);RC(g2,p[0],p[1]-2,1,2,'#5b646a');}
          // 正面門廊
          const pu0=.88,pu1=1.08,pv0=VC+AR-.04,pv1=VC+AR+.14,ph=9,um=.98;
          boxZ(g2,pu0,pv0,pu1-pu0,pv1-pv0,0,ph,'#dfe8e4','#a9cbc9','#78a3a6');
          for(let u=pu0+.04;u<pu1;u+=.04)BL(g2,P(u,pv1,1),P(u,pv1,ph-1),'#f2f4ee');
          faceL(g2,pv1,um-.04,um+.04,0,6,'#3f5a52');if(n2)faceL(n2,pv1,um-.035,um+.035,1,6,'#ffe2a2');
          fp(g2,[P(pu0-.01,pv1,ph),P(pu1+.01,pv1,ph),P(um,pv1,ph+6)],'#bddcd6');BL(g2,P(pu0-.01,pv1,ph),P(um,pv1,ph+6),'#f7f8f4');BL(g2,P(um,pv1,ph+6),P(pu1+.01,pv1,ph),'#f7f8f4');
          fp(g2,[P(um,pv0,ph+6),P(pu1+.01,pv0,ph),P(pu1+.01,pv1,ph),P(um,pv1,ph+6)],'#7fa9ab');BL(g2,P(um,pv0,ph+6),P(um,pv1,ph+6),'#f7f8f4');
          faceL(g2,pv1,pu0,pu1,0,1,'#b3ac9c');});
        // ---- 育苗長拱溫室 ×3（右後一座沿 v、右前兩座沿 u）----
        const nursery=(d,ax,b0,b1,ac,ar,wz,rh,seed)=>S.o(d,(g2,n2)=>{const[ic,ix]=A.cv(K.W,K.H);
          for(let b=b0+.06;b<b1;b+=.07){const pu=ax==='u'?b:ac,pv=ax==='u'?ac:b;const p=P(pu,pv),x=rnd(p[0]),y=rnd(p[1]);RC(ix,x-1,y-3,3,2,(b*100|0)%3?'#7fb35a':'#e36a7a');RC(ix,x-1,y-1,3,1,'#6e5238');}
          const pr=[];
          if(ax==='u'){pr.push({u:[b0,b1],v:[ac-ar,ac+ar],z:[0,wz],grid:gBox(.1,4),col:vic(L,{wallZ:wz,plinth:1}),nc:vicN({seed,wallZ:wz,plinth:1,p:.3})});
            pr.push({q:['cu',0,ac,wz,1,ar,rh],u:[b0,b1],z:[wz,wz+rh+1],grid:gCu(ac,wz,ar,rh,.1,5),col:vic(L,{wallZ:0,plinth:0,rim:h=>h.f===1&&(((h.v-ac)/ar)**2+((h.z-wz)/rh)**2)>.72})});}
          else{pr.push({u:[ac-ar,ac+ar],v:[b0,b1],z:[0,wz],grid:gBox(.1,4),col:vic(L,{wallZ:wz,plinth:1}),nc:vicN({seed,wallZ:wz,plinth:1,p:.3})});
            pr.push({q:['cv',ac,0,wz,ar,1,rh],v:[b0,b1],z:[wz,wz+rh+1],grid:gCv(ac,wz,ar,rh,.1,5),col:vic(L,{wallZ:0,plinth:0,rim:h=>h.f===2&&(((h.u-ac)/ar)**2+((h.z-wz)/rh)**2)>.72})});}
          ray(g2,n2,pr,{inner:ic});});
        nursery(1.2,'v',.3,1.18,2.52,.15,5,9,4761);
        nursery(1.92+1.86,'u',1.95,2.85,1.72,.14,4,8,4762);
        nursery(1.92+2.32,'u',1.95,2.85,2.18,.14,4,8,4763);
        // ---- 木拱橋（沿 v 跨池）----
        S.o(.98+2.05+.3,(g2)=>{const u0=.92,u1=1.04,b0=1.58,b1=2.5,N=12,zb=v=>2+5*Math.sin(PI*(v-b0)/(b1-b0));
          for(let i=0;i<N;i++){const a=b0+(b1-b0)*i/N,b=b0+(b1-b0)*(i+1)/N,za=zb(a),zc=zb(b);
            fp(g2,[P(u0,a,za),P(u1,a,za),P(u1,b,zc),P(u0,b,zc)],'#b88a5e');fp(g2,[P(u1,a,za-2),P(u1,b,zc-2),P(u1,b,zc),P(u1,a,za)],'#7a5536');
            fp(g2,[P(u0,b,zc-2),P(u1,b,zc-2),P(u1,b,zc),P(u0,b,zc)],'#9a6e48');BL(g2,P(u0,a,za),P(u0,b,zc),'#8e6440');}
          for(const u of[u0,u1])for(let i=0;i<N;i++){const a=b0+(b1-b0)*i/N,b=b0+(b1-b0)*(i+1)/N;BL(g2,P(u,a,zb(a)+4),P(u,b,zb(b)+4),'#e9e2d0');if(i%2===0)BL(g2,P(u,a,zb(a)),P(u,a,zb(a)+4),'#e9e2d0');}});
        // 池邊垂柳、樹、蘆葦
        const willow=(u,v)=>{SHD.push(['p',u,v,16]);S.o(u+v+.03,(g2)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x,y-10,1,10,'#6e5238');RC(g2,x+1,y-9,1,9,'#4a3727');
          ell(g2,x,y-14,7,5,'#6f9a3e');ell(g2,x-1,y-15,5,3,'#93bb55');for(let k=-6;k<=6;k+=2){const L2=5+((k+6)%4);RC(g2,x+k,y-12,1,L2,k<0?'#86b04c':'#5f8a36');}});};
        willow(.42,1.82);willow(1.5,2.2);
        for(const[u,v]of[[.2,2.45],[.35,2.52],[1.45,1.78]])S.t(u+v,(g2)=>{const p=P(u,v);for(let k=0;k<4;k++)RC(g2,p[0]+k*2-3,p[1]-3-(k%2),1,3+(k%2),'#5f8a36');});
        for(const v of[1.62,2.1,2.6])tree(S,.1,v,.85,v>2?0:2);
        for(const u of[2.2,2.6])tree(S,u,2.9,.8,1);
        tree(S,2.85,1.3,.9,0);tree(S,.15,.18,1,2);tree(S,2.85,.2,1,1);cone(S,1.72,1.6,10);cone(S,1.72,2.35,10);
        // 大門＋售票亭＋欄杆
        gate(S,L,.9,1.1,2.87,1.0+2.87+.1);
        S.o(1.25+2.85+.1,(g2,n2)=>{boxZ(g2,1.18,2.76,.16,.14,0,8,'#3f6b4c','#e8e2cc','#b5ad9a');faceL(g2,2.9,1.21,1.31,3,6,'#3d5566');if(n2)faceL(n2,2.9,1.21,1.31,3,6,'#ffe2a2');
          boxZ(g2,1.16,2.74,.2,.18,8,2,'#3f6b4c','#4f8a5c','#2f5a3c');});
        rail(S,L,[.06,2.92],[.86,2.92],.86+2.92);rail(S,L,[1.14,2.92],[2.92,2.92],2.92+2.92);rail(S,L,[2.92,.06],[2.92,2.92],2.92+2.92+.01);
        for(const v of[1.72,2.62])oldLamp(S,.86,v);for(const v of[1.7,2.2,2.7])oldLamp(S,1.95,v);oldLamp(S,.6,1.36);oldLamp(S,1.5,1.36);oldLamp(S,2.4,1.36);
        bench(S,.5,1.5,true);bench(S,1.3,1.5,true);bench(S,1.66,2.1,false);bench(S,.3,2.66,true);
        crowd(S,[[.98,2.8,1],[1.0,2.6,3],[.97,1.5,5],[1.0,1.45,0],[.5,1.44,2],[1.4,1.47,6],[2.2,1.45,4],[1.8,1.95,7],[1.82,2.45,8],[1.3,2.72,1],[1.6,2.7,3],[.97,1.9,2],[.99,2.1,6]],0,4.2);
        crowd(S,[[.97,1.95,4],[1.0,2.2,0]],7,3.6);
        return{};
      },
      // v2 現代玻璃塊＋戶外園（T614 第三次重試）：左後方三個高低玻璃方塊溫室——後左高塊熱帶館（52px 斜交網格＋三道鋸齒玻璃屋脊）、
      // 後右中塊地中海館（30px＋兩道鋸齒玻璃屋脊）、前方低長入口大廳（20px 平玻璃頂、BOTANIC 單列深色字直接貼在上段玻璃）；
      // 框架一律白色（溫室的白鋼框，不是辦公樓的深色框），玻璃後是貼著玻璃往上長的雨林樹與棕櫚剪影，最上層與屋脊玻璃都透出樹冠。
      // 右後方木構遊客中心＋咖啡露台；前方戶外園：S 形碎石主步道（入口白色拱形花架、兩株紅楓分站兩個轉彎）、不規則池塘（淺灰踏石、
      // 有側面厚度的木平台）、池畔櫻花林、岩石園、一列列植株的薰衣草與金盞花田、中央草坪花境與圓形花床、前緣綠籬與耐候鋼入口標牌牆。
      (g,ng,S,L,K)=>{const {P,pave,flat,fp,boxZ,faceL,faceR,lnL,lnR,RC,BL,ell,disc,ring,crowd,scatter,oldLamp,tree,cone,palm,bush,bench,bed,hedge,SHD,mix,AX,TOPY}=L;
        pave(g,'m',0,0,SZ,SZ,4771);
        pave(g,'z',.12,.14,2.76,1.34,4772);
        flat(g,.12,1.46,2.76,.03,'#b9b19e');
        const EDG='#bdb4a0',PATH='#d2c4a4';
        const main=spline([[2.35,2.92],[2.25,2.6],[1.85,2.3],[1.35,2.12],[1.05,1.8],[.95,1.48]],8);
        const cafeP=spline([[1.85,2.3],[2.1,1.9],[2.15,1.48]],6),westP=spline([[1.35,2.12],[.95,2.62],[.4,2.8],[.1,2.82]],8);
        ribbon(L,g,main,.21,EDG);ribbon(L,g,cafeP,.17,EDG);ribbon(L,g,westP,.15,EDG);
        ribbon(L,g,main,.16,PATH);ribbon(L,g,cafeP,.12,PATH);ribbon(L,g,westP,.1,PATH);
        // 沿路徑取點：t∈[0,1] 依弧長；n＝前進方向的左手法向
        const along=(pts,t)=>{const cl=[0];for(let i=1;i<pts.length;i++)cl.push(cl[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
          const T=t*cl[cl.length-1];let i=1;while(i<pts.length-1&&cl[i]<T)i++;
          const a=pts[i-1],b=pts[i],f=(T-cl[i-1])/((cl[i]-cl[i-1])||1),du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1;
          return{u:a[0]+du*f,v:a[1]+dv*f,nu:-dv/l,nv:du/l};};
        // ---- 池塘：淺灰踏石（池內沿南岸三顆，亮頂＋暗底）＋東岸木平台（有 1px 側面厚度）----
        pond(L,g,.62,2.08,.36,.3,1.2,4773,{lily:6});
        for(const[u,v]of[[.46,2.3],[.58,2.34],[.7,2.33]]){const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
          RC(g,x-2,y,5,1,'#8d887c');RC(g,x-2,y-1,5,1,'#cfcbc0');RC(g,x-1,y-2,3,1,'#e6e2d8');}
        SHD.push(['b',.86,1.9,.2,.24,2]);
        S.o(.96+2.02,(g2)=>{boxZ(g2,.86,1.9,.2,.24,0,2,'#c49a6c','#9a6e48','#6e4c30');
          for(let u=.9;u<1.05;u+=.04)BL(g2,P(u,1.91,2),P(u,2.13,2),'#a8805a');});
        // ---- 薰衣草田、金盞花田：一列列植株（底層葉色＋頂層花色、每 3px 一叢），列與列之間 1px 土縫 ----
        const rowsBed=(u0,v0,du,dv,leaf,fl,fl2)=>{flat(g,u0-.025,v0-.025,du+.05,dv+.05,'#d9d2c0');flat(g,u0,v0,du,dv,'#5a4632');
          for(let v=v0+.035,i=0;v<v0+dv-.01;v+=3/32,i++)for(let u=u0+.02,k=0;u<u0+du-.015;u+=1/32,k++){const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
            RC(g,x,y,1,1,leaf);if((k+i)%3!==2)RC(g,x,y-1,1,1,(k+2*i)%4===0?fl2:fl);}};
        rowsBed(2.3,1.62,.6,.36,'#56664c','#a88ad6','#7a5fb0');
        rowsBed(2.44,2.1,.46,.26,'#3f6b2e','#f4b43a','#d9781c');
        // 中央草坪：沿廣場前緣一條宿根花境；腰形花床；圓形花床（中央一株圓錐造型樹）
        bed(g,1.14,1.52,.84,.14,[2,3,2]);
        const SCU=1.62,SCV=1.86;
        {const pts=blobPts(1.94,1.8,.1,.2,.8,40,1.2);gpoly(L,g,blobPts(1.94,1.8,.115,.215,.8,40,1.2),'#d9d2c0');gpoly(L,g,pts,'#6e5038');
          for(let a=1.84;a<2.05;a+=1/32)for(let b=1.6;b<2.0;b+=.03){const du=(a-1.94)/.1,dv=(b-1.8)/.2;if(du*du+dv*dv>.8)continue;const q=P(a,b),dr=Math.round(b*10)%3;
            RC(g,q[0],q[1],1,1,((Math.round(a*32)+Math.round(b*33))%2)?'#4f7f35':(dr===0?'#f0c43a':dr===1?'#f5f2ea':'#e87a2c'));}}
        disc(g,SCU,SCV,.17,'#d9d2c0');disc(g,SCU,SCV,.15,'#5a8a3e');disc(g,SCU,SCV,.08,'#6e5038');
        for(let i=0;i<30;i++){const a=i/30*PI*2,p=P(SCU+.12*Math.cos(a),SCV+.12*Math.sin(a));RC(g,p[0],p[1],1,1,i%2?'#9a5fc4':'#c08ae0');}
        for(let i=0;i<20;i++){const a=i/20*PI*2+.15,p=P(SCU+.095*Math.cos(a),SCV+.095*Math.sin(a));if(i%2)RC(g,p[0],p[1],1,1,'#f29ab8');}
        cone(S,SCU,SCV,8);
        // 岩石園
        const rock=(u,v,r,c)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),rx=Math.max(2,rnd(r*40)),ry=Math.max(1,rnd(r*20));ell(g,x,y-ry+1,rx,ry,c[0]);ell(g,x-1,y-ry,Math.max(1,rx-1),Math.max(1,ry-1),c[1]);RC(g,x-rx+1,y-ry,2,1,c[2]);};
        flat(g,.22,1.52,.6,.26,'#a79d86');
        for(const[u,v,r]of[[.3,1.58,.08],[.45,1.62,.1],[.62,1.56,.07],[.72,1.7,.09],[.38,1.72,.06],[.55,1.74,.05]])rock(u,v,r,['#8a8579','#aaa498','#cfc9bb']);
        for(const[u,v,c]of[[.36,1.64,'#f06a8a'],[.52,1.68,'#f0c43a'],[.66,1.64,'#c08ae0'],[.8,1.62,'#f5f2ea'],[.3,1.66,'#f0c43a']]){const p=P(u,v);RC(g,p[0],p[1]-1,2,1,c);RC(g,p[0],p[1],2,1,'#4f7a36');}
        // ---- 落影：三個玻璃方塊（含屋脊）＋遊客中心 ----
        const HL=20,HM=30,HT=52;
        L.shadow(g,[['b',.22,.22,.64,.64,HT+6],['b',.86,.3,.7,.56,HM+5],['b',.2,.86,1.3,.46,HL],['b',1.7,.26,.95,.62,11]]);
        // ---- 現代玻璃方塊溫室 ----
        const FOL=[['#a6d86e','#62aa42','#377c2e','#1f5222'],['#bcd96c','#80b03e','#4d802c','#2c5620'],['#96d48c','#52a05a','#2f7542','#1b4c2a']];
        const LOBCAN=[[.4,1.0,.1,1,1],[.7,.98,.08,0,0],[1.3,.99,.1,2,1],[1.06,.95,.07,1,0]];
        const SIGN=[.44,1.34];   // BOTANIC 字列所在的 u 範圍（大廳 +v 面 z12–18）：這段玻璃不分格、字直接貼在玻璃上
        S.o(1.3,(g2,n2)=>{const W=K.W,Hc=K.H;
          const[cT,xT]=A.cv(W,Hc),[cM,xM]=A.cv(W,Hc),[cL,xL]=A.cv(W,Hc);
          // 雨林樹：主幹＋兩根斜枝＋三團分層樹冠（左上亮、右下暗）——貼著玻璃往上長，遠看是一棵棵樹不是綠色色塊
          const rainTree=(c,u,v,h,r,k)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),f=FOL[k%3];
            RC(c,x,y-h,1,h,'#6b5a48');RC(c,x+1,y-h+2,1,h-2,'#4a3d30');
            BL(c,[x,y-h+r+1],[x-r+1,y-h+3],'#5a4a3a');BL(c,[x+1,y-h+r+2],[x+r-1,y-h+4],'#4a3d30');
            const lump=(cx,cy,rr)=>{ell(c,cx+1,cy+1,rr,Math.max(1,rr-2),f[3]);ell(c,cx,cy,rr,Math.max(1,rr-2),f[2]);ell(c,cx-1,cy-1,Math.max(1,rr-1),Math.max(1,rr-3),f[1]);RC(c,cx-rr+2,cy-Math.max(1,rr-2),Math.max(1,rr-2),1,f[0]);};
            const cy=y-h,sr=Math.max(2,Math.ceil(r*.62));lump(x-r+2,cy+3,sr);lump(x+r-1,cy+4,sr);lump(x,cy,r);};
          // 大棕櫚：長葉片下垂
          const bigPalm=(c,u,v,h,sp=8)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
            for(let k=0;k<h;k++){const xx=x+Math.round(Math.sin(k/h*1.2)*1.5);RC(c,xx,y-k,1,1,k%2?'#8a6a48':'#6e5238');}
            const tx=x+Math.round(Math.sin(1.2)*1.5),ty=y-h;
            const fr=[[-sp,3],[-sp+1,0],[-sp+3,-3],[-2,-4],[1,-5],[sp-3,-3],[sp-1,0],[sp,3],[-4,4],[4,4]];
            for(const[dx,dy]of fr){BL(c,[tx,ty+1],[tx+dx,ty+dy+1],'#1f5222');BL(c,[tx,ty],[tx+dx,ty+dy],'#3f8a36');BL(c,[tx,ty-1],[tx+Math.round(dx*.6),ty+Math.round(dy*.6)-1],'#7cc45a');}
            RC(c,tx-1,ty,2,2,'#5a3f28');};
          // 林下蕨叢：一排扇形小葉
          const ferns=(c,ua,ub,v,hh,k)=>{const f=FOL[k%3];for(let u=ua;u<ub;u+=3/32){const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
            for(const[dx,dy]of[[-3,-hh+2],[-1,-hh],[1,-hh],[3,-hh+2]])BL(c,[x,y],[x+dx,y+dy],f[2]);RC(c,x-1,y-hh,1,1,f[0]);RC(c,x+1,y-hh,1,1,f[1]);RC(c,x+3,y-hh+2,1,1,f[1]);}};
          // 高塊（熱帶館）：由後往前——後排一株頂到屋脊的巨樹、中排棕櫚、前排貼 +v 玻璃兩株雨林樹與一株棕櫚；+u 面一株樹一株棕櫚
          rainTree(xT,.46,.46,50,8,1);bigPalm(xT,.66,.4,48,8);rainTree(xT,.3,.56,44,7,2);
          rainTree(xT,.8,.3,44,6,0);bigPalm(xT,.8,.58,42,7);
          rainTree(xT,.34,.8,38,7,0);bigPalm(xT,.56,.8,45,8);rainTree(xT,.76,.8,34,6,2);
          // 中塊（地中海館）：+v 面（大廳屋頂以上）兩株樹冠；+u 面整面可見：底層蕨叢＋一樹一棕櫚
          rainTree(xM,1.12,.8,24,6,2);rainTree(xM,1.36,.78,22,5,1);
          rainTree(xM,1.5,.42,22,6,0);bigPalm(xM,1.5,.68,24,6);ferns(xM,1.5,1.52,.84,5,1);
          for(let v=.36;v<.84;v+=.09){const p=P(1.52,v);ferns(xM,1.515,1.52,v,5,(v*10|0)%3);}
          // 大廳：植栽都壓在 z11 以下（上段玻璃留給字列）——盆栽樹列、兩株矮棕櫚、蕨叢、遊客
          for(let u=.3;u<1.46;u+=.14)if(u<.8||u>1.1){const p=P(u,1.24),x=rnd(p[0]),y=rnd(p[1]);RC(xL,x-1,y-1,3,1,'#8a6a48');rainTree(xL,u,1.24,7,3,(u*10|0)%3);}
          bigPalm(xL,.62,1.28,10,5);bigPalm(xL,1.3,1.28,10,5);ferns(xL,.24,.76,1.3,4,2);ferns(xL,1.12,1.46,1.3,4,0);
          for(const[u,v,k]of[[.9,1.2,1],[.98,1.16,4],[1.12,1.22,6],[.76,1.24,3]]){const p=P(u,v);L.person(xL,p[0],p[1],k);}
          const DT=[cT,cM,cL].map(c=>c.getContext('2d').getImageData(0,0,W,Hc).data);
          const samp=(bi,x,y)=>{if(x<0||y<0||x>=W||y>=Hc)return null;const d=DT[bi],j=(y*W+x)*4;if(d[j+3]<100)return null;return '#'+((d[j]<<16)|(d[j+1]<<8)|d[j+2]).toString(16).padStart(6,'0');};
          // 大廳玻璃頂：底下盆栽樹冠透上來
          const roofCol=(h,rib)=>{let best=null,bz=-1;
            for(const[cu,cv,r,k,hb]of LOBCAN){const du=(h.u-cu)/r,dv=(h.v-cv)/r,d2=du*du+dv*dv;if(d2>=1)continue;const nz=Math.sqrt(1-d2),z=hb*.02+r*nz;if(z>bz){bz=z;best=[du,dv,nz,k];}}
            if(rib)return '#eef4f0';
            if(!best)return '#cfe7e1';
            const[du,dv,nz,k]=best,l=-.3*du+.72*dv+.62*nz,pal=FOL[k%3];
            return mix(pal[l>.8?0:l>.5?1:l>.15?2:3],'#dff2ee',.2);};
          const GB=[{u:[.22,.86],v:[.22,.86],H:HT,dg:1,s:4801,np:.3},
            {u:[.86,1.56],v:[.3,.86],H:HM,s:4802,np:.34,mw:5,fh:10},
            {u:[.2,1.5],v:[.86,1.32],H:HL,s:4803,np:.5,mw:4,fh:7,door:[.87,1.03],lob:1}];
          const prims=GB.map((b,bi)=>{const U0=b.u[0],V0=b.v[0],V1=b.v[1],H=b.H;
            const fx=h=>h.f===2?(h.u-U0)*32:(V1-h.v)*32;
            const cell=h=>{const t=fx(h);return b.dg?[Math.floor((h.z-1.5*t)/16),Math.floor((h.z+1.5*t)/16)]:[Math.floor(t/b.mw),Math.floor(h.z/b.fh)];};
            const isDoor=h=>!!b.door&&h.f===2&&h.u>b.door[0]&&h.u<b.door[1]&&h.z<7;
            const isSign=h=>!!b.lob&&h.f===2&&h.u>SIGN[0]&&h.u<SIGN[1]&&h.z>=12&&h.z<18;
            return{u:b.u,v:b.v,z:[0,H],
              grid:h=>{if(h.f===3)return b.lob?Math.floor((h.u-U0)/.16+1e-6)*1000+Math.floor((h.v-V0)/.16+1e-6):null;
                if(h.z>H-2||h.z<1||isDoor(h))return null;if(isSign(h))return 7;
                const c=cell(h);return c[0]*1000+c[1]+500;},
              col:(h,rib)=>{
                if(h.f===3)return b.lob?roofCol(h,rib):'#d6ebe5';            // 高塊與中塊的平頂之後被鋸齒玻璃屋脊蓋掉
                if(h.z>H-2)return h.f===2?'#f2f6f3':'#b9c6c1';                // 白色頂緣壓條
                if(h.z<1)return h.f===2?'#6d7a74':'#525d58';                  // 基座
                if(isDoor(h)){const t=(h.u-b.door[0])*32;return Math.abs(t-2.5)<.6?'#6b757c':'#1f2a25';}
                if(rib)return h.f===2?'#eef4f0':'#aebfb9';                    // 白鋼框
                const t=Math.min(1,h.z/H),c0=cell(h),refl=!isSign(h)&&(((c0[0]*3+c0[1]*2+b.s)%9)+9)%9<2;
                let c=h.f===2?mix('#b3d8cf','#dcf0ea',t):mix('#78a29b','#a3c7c0',t);if(refl)c=SH(c,10);
                const ic=samp(bi,h.x,h.y);return ic?mix(c,ic,.82):c;},
              nc:(h,rib)=>{if(rib||h.f===3||h.z>H-2||h.z<1)return null;if(isDoor(h))return '#ffe6ae';
                if(b.lob&&h.f===2&&h.z>=11)return null;                        // 字列那段玻璃夜裡不亮，只亮字
                const c0=cell(h);if(A.hashLocal479(b.s,c0[0]+40,c0[1]+40)>b.np)return null;
                return samp(bi,h.x,h.y)?'#8a7f55':'#d8c98f';}};});           // 亮度同 v0／v1 溫室窗；植栽處是暗一階的剪影
          L.ray(g2,n2,prims);
          // 鋸齒玻璃屋脊（沿 u 的等腰屋脊 N 道）：前坡逐像素由螢幕座標反推坡面 (u,v)，玻璃由簷口往屋脊漸亮、透出底下樹冠，白色椽與屋脊壓條；
          // 東端山牆三角（暗面玻璃＋白框）。由後往前畫。
          const ridge=(bi,U0,U1,V0,V1,H,N,R)=>{const w=(V1-V0)/N,k=2*R/w;
            for(let i=0;i<N;i++){const va=V0+i*w,vm=va+w/2,vb=va+w,pts=[P(U0,vm,H+R),P(U1,vm,H+R),P(U1,vb,H),P(U0,vb,H)];
              let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
              for(let y=Math.floor(y0)-1;y<=Math.ceil(y1)+1;y++)for(let x=Math.floor(x0)-1;x<=Math.ceil(x1)+1;x++){
                const s=(x+.5-AX)/32,v=(y+.5-TOPY+H+k*vb-16*s)/(32+k),u=v+s;
                if(v<vm||v>vb||u<U0||u>U1)continue;
                const f=(vb-v)/(w/2),q=(u-U0)/.08,rf=Math.abs(q-Math.round(q))*2.56;
                let c=mix('#a6cec3','#e4f4ef',f);const ic=samp(bi,x,y);if(ic)c=mix(c,ic,.6);
                if(rf<.5&&u>U0+.03&&u<U1-.03)c='#f2f7f4';
                if(f>.84)c='#f8fbf9';
                RC(g2,x,y,1,1,c);}
              BL(g2,P(U0,vb,H),P(U1,vb,H),'#c3d2cc');
              fp(g2,[P(U1,va,H),P(U1,vb,H),P(U1,vm,H+R)],'#86aaa3');BL(g2,P(U1,va,H),P(U1,vm,H+R),'#dce6e2');BL(g2,P(U1,vm,H+R),P(U1,vb,H),'#dce6e2');}};
          ridge(0,.22,.86,.22,.86,HT,3,6);
          ridge(1,.86,1.56,.3,.86,HM,2,5);
          // 門口懸挑白色雨遮
          const cano=(c)=>boxZ(c,.8,1.32,.3,.13,8,1,'#e9edf0','#f4f6f7','#b5bec4');
          cano(g2);if(n2){n2.globalCompositeOperation='destination-out';cano(n2);n2.globalCompositeOperation='source-over';}
          // BOTANIC：單列深綠字（3×5、字距 1px）直接貼在大廳上段不分格的玻璃上；夜裡字背光亮起
          {const p=P(SIGN[0]+.03,1.32,17),x0=rnd(p[0]),y0=rnd(p[1]);let k=0;
            for(const ch of 'BOTANIC'){const gl=FONT[ch],dy=Math.round(k/2);for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(gl[r][c]==='1'){RC(g2,x0+k+c,y0+dy+r,1,1,'#1d3a2a');if(n2)RC(n2,x0+k+c,y0+dy+r,1,1,'#fff1c8');}k+=4;}}});
        // ---- 遊客中心（木構、綠屋頂）----
        S.o(2.2,(g2,n2)=>{const u0=1.72,u1=2.62,v0=.28,v1=.86,h=11;
          boxZ(g2,u0,v0,u1-u0,v1-v0,0,h,'#7a9a4a','#b98a5a','#8a6040');
          for(let u=u0+.03;u<u1;u+=.05)BL(g2,P(u,v1,0),P(u,v1,h),'#a67a4c');for(let v=v0+.03;v<v1;v+=.05)BL(g2,P(u1,v,0),P(u1,v,h),'#76522f');
          L.curtainL(g2,n2,v1,u0+.1,u1-.25,0,h-2,{glass:'#86a9bf',mull:'#4a3a2c',fh:9,mw:5,seed:4791,lit:.35});
          faceL(g2,v1,u0+.35,u0+.47,0,7,'#2d3b48');if(n2)faceL(n2,v1,u0+.36,u0+.46,1,6,'#ffe6ae');
          boxZ(g2,u0-.03,v0-.03,u1-u0+.06,v1-v0+.06,h,2,'#86ab52','#e9e2d0','#b8b09c');
          for(let i=0;i<30;i++){const u=u0+.02+L.hsh(4792,i,1)*(u1-u0-.04),v=v0+.02+L.hsh(4792,i,2)*(v1-v0-.04),p=P(u,v,h+2);RC(g2,p[0],p[1],2,1,L.hsh(4792,i,3)<.5?'#9cc462':'#6a9040');}
          boxZ(g2,u1-.2,v0+.1,.1,.12,h+2,3,'#9aa3a8','#b8c0c4','#7f878c');
          boxZ(g2,2.08,v1-.06,.53,.03,h+2,8,'#2a4a33','#3f6b4c','#2a4a33');L.textL(g2,v1-.03,2.1,h+8,'CAFE','#f2f0ea',n2,'#fff4d8',1);});
        // 咖啡露台
        flat(g,1.76,.9,.82,.3,'#b88a5e');for(let u=1.8;u<2.58;u+=.05)BL(g,P(u,.9),P(u,1.2),'#a07650');
        const umb=(u,v,c)=>{SHD.push(['p',u,v,9]);S.o(u+v+.05,(g2)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g2,x,y-8,1,8,'#5a4a3c');ell(g2,x,y-9,5,2,c);RC(g2,x-5,y-9,11,1,SH(c,-30));RC(g2,x-2,y-3,5,1,'#e9e2d0');});};
        umb(1.95,1.02,'#e9e2d0');umb(2.2,1.02,'#c0392b');umb(2.45,1.02,'#e9e2d0');
        // ---- 樹：池畔西側櫻花林（三株、樹下球根草甸）、兩株紅楓分站 S 形主步道的兩個轉彎、外圍綠樹 ----
        const RED=['#e0704a','#c4502f','#983c25','#6a2a1a'];
        const tree2=(u,v,s,pal)=>{SHD.push(['p',u,v,rnd(9*s)+6]);S.o(u+v+.03,(g2)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g2,x,y-h+r,1,h-r+1,'#6e5238');RC(g2,x+1,y-h+r,1,h-r,'#4a3727');
          const cy=y-h;ell(g2,x+1,cy+1,r,r-1,pal[3]);ell(g2,x,cy,r,r-1,pal[2]);ell(g2,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g2,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
        for(const[u,v,c1,c2]of[[.1,1.82,'#f5f2ea','#f29ab8'],[.1,2.5,'#f29ab8','#f5f2ea']]){flat(g,u,v,.16,.14,'#7fa653');
          for(let a=u+.02,k=0;a<u+.15;a+=1/32,k++)for(let b=v+.02;b<v+.13;b+=.035){const p=P(a,b);if((k+Math.round(b*40))%2===0)RC(g,p[0],p[1],1,1,k%3?c1:c2);}}
        for(const[u,v,s]of[[.16,1.88,.95],[.14,2.22,.9],[.2,2.58,.9]])tree(S,u,v,s,3);
        tree2(2.0,2.66,.95,RED);tree2(1.42,1.96,.9,RED);
        tree(S,.12,1.55,.9,0);tree(S,2.86,.3,1.0,0);tree(S,.14,.25,1,2);tree(S,2.74,1.36,.95,2);
        // 右前野花帶與灌木
        for(const[u,v,c1,c2]of[[1.1,2.52,'#f5f2ea','#f0c43a'],[1.24,2.64,'#c08ae0','#f06a8a']]){flat(g,u,v,.2,.1,'#7fa653');
          for(let a=u+.02,k=0;a<u+.19;a+=1/32,k++)for(let b=v+.02;b<v+.09;b+=.035){const p=P(a,b);if((k+Math.round(b*40))%2===0)RC(g,p[0],p[1],1,1,k%3?c1:c2);}}
        bush(S,1.62,2.76,3);
        // 蘆葦（池西岸、池北岸）
        for(const[u,v]of[[.3,1.92],[.4,1.8],[1.98,1.94]])S.t(u+v,(g2)=>{const p=P(u,v);for(let k=0;k<4;k++)RC(g2,p[0]+k*2-3,p[1]-3-(k%2),1,3+(k%2),'#5f8a36');});
        // 入口拱形花架：主步道入口處兩根白柱＋頂梁，攀著玫瑰
        {const a=along(main,.11),o1=[a.u+.11*a.nu,a.v+.11*a.nv],o2=[a.u-.11*a.nu,a.v-.11*a.nv],Z=13;
          SHD.push(['p',o1[0],o1[1],Z],['p',o2[0],o2[1],Z]);
          S.o(a.u+a.v+.14,(g2)=>{const q1=P(o1[0],o1[1]),q2=P(o2[0],o2[1]),L1=q1[0]<q2[0]?q1:q2,R1=q1[0]<q2[0]?q2:q1;
            for(const q of[L1,R1]){RC(g2,q[0],q[1]-Z,1,Z,'#f2efe6');RC(g2,q[0]+1,q[1]-Z,1,Z,'#b3ad9f');}
            BL(g2,[L1[0],L1[1]-Z-1],[R1[0]+1,R1[1]-Z-1],'#f7f4ec');BL(g2,[L1[0],L1[1]-Z],[R1[0]+1,R1[1]-Z],'#b9b3a6');
            // 玫瑰：梁上一串、柱上幾簇（葉＋花）
            const n=Math.max(2,Math.abs(R1[0]-L1[0]));for(let i=0;i<=n;i++){const x=rnd(L1[0]+(R1[0]+1-L1[0])*i/n),y=rnd(L1[1]-Z-2+(R1[1]-L1[1])*i/n);RC(g2,x,y,1,1,i%2?'#3f7a36':'#e25a7a');if(i%3===0)RC(g2,x,y-1,1,1,'#f39ab0');}
            for(const q of[L1,R1])for(let z=3;z<Z;z+=3){RC(g2,q[0]-1,q[1]-z,1,1,'#3f7a36');if(z%6===0)RC(g2,q[0]+2,q[1]-z-1,1,1,'#e25a7a');}});}
        // 前緣綠籬、入口標牌牆
        S.o(2.95+1.9,(g2)=>{hedge(g2,.06,2.9,2.18,.06,3);hedge(g2,2.52,2.9,.44,.06,3);hedge(g2,2.9,1.5,.06,1.4,3);});
        bed(g,2.46,2.74,.4,.08,[1,5]);
        SHD.push(['b',2.46,2.68,.4,.05,7]);
        S.o(2.66+2.7,(g2,n2)=>{boxZ(g2,2.46,2.68,.4,.05,0,7,'#7a3f22','#a55f36','#6e3a20');faceL(g2,2.73,2.46,2.86,6,7,'#b8703f');
          const p=P(2.52,2.73,5),x=rnd(p[0]),y=rnd(p[1]);
          const leaf=[[1,0],[2,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[1,3],[0,4]];
          for(const[dx,dy]of leaf){RC(g2,x+dx,y+dy,1,1,'#f0e6c8');if(n2)RC(n2,x+dx,y+dy,1,1,'#fff1c8');}
          for(const z of[4,2]){const a=P(2.68,2.73,z),b=P(2.82,2.73,z);BL(g2,a,b,'#e2cfa8');}});
        // 步道燈：主步道北側三支單桿古典燈（深色細桿，不再一整排）；長椅
        for(const t of[.32,.56,.8]){const a=along(main,t);oldLamp(S,a.u+.12*a.nu,a.v+.12*a.nv,10);}
        {const a=along(main,.44);bench(S,a.u+.1*a.nu-.05,a.v+.1*a.nv,true);}
        {const a=along(main,.68);bench(S,a.u+.1*a.nu-.05,a.v+.1*a.nv,true);}
        bench(S,.95,2.7,true);
        crowd(S,[[2.3,2.8,1],[2.24,2.6,3],[1.95,2.36,5],[1.62,2.2,0],[1.3,2.06,2],[1.1,1.85,6],[.97,1.56,4],[1.0,1.95,7],[2.15,1.7,8],[2.1,1.1,1],[2.3,1.0,3],[2.5,1.1,5],[.7,2.72,2],[.5,2.78,6],[1.42,1.8,0],[1.78,1.7,4],[.9,2.2,5]],0,4.3);
        return{};
      },
    ];
    build(47,dims(47,[208,220,104,218]),SZ,K47);
  }catch(e){console.error('cul_d k47',e);errs.push('k47:'+(e&&e.stack||e));}

  window.__cul_d_chk=chk;
  window.__cul_d_errs=errs;
});
