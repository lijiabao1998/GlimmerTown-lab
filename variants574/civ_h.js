// T613 civ_h：k42 市政廳（2×2，136×150，錨 68,148）＋ k43 法院（2×2，同尺寸）實驗線重畫。
//   k42 v0 穹頂式：花崗石台基上的三段式議會樓——中央主樓（六柱山花門廊＋大台階）夾兩翼，屋頂正中方座＋列柱鼓座＋金肋鉛灰穹頂＋採光亭；
//          前庭石板廣場（圓噴泉、花壇、路燈）、左緣三杆旗列（中杆掛動態旗）、右側草坪花帶與長椅
//       v1 鐘塔式：紅磚市政廳——長條主樓（銅綠雙坡屋頂＋老虎窗）兩端突出山牆翼樓，正中突出方形鐘塔（拱門入口、陽台、雙面鐘、鐘樓拱窗、銅綠尖頂）；
//          前方磚鋪市集廣場（市集噴泉、攤傘、路燈、樹），左前角旗桿
//       v2 現代玻璃議事廳：後方玻璃帷幕辦公板樓（白色樓板帶＋豎鰭、屋頂機房），前方一層玻璃基座（屋頂花園），基座上圓筒玻璃議事廳＋白色淺碟頂；
//          入口懸挑雨遮、前廣場倒影水池＋噴泉列、方格樹陣、單車架，右前旗桿列
// 分層合成（沿用 cul_a／civ_d 的 LIB／scene／shadow／paint／pave）：立體主體各自一層（二值化＋深色外框）；燈桿、旗桿、人走不描邊細線層；
// 地面直接畫在地面層（逐像素取樣不越出佔地菱形）。夜光按層遮擋，只亮白天畫出的窗、門燈、路燈、鐘面。零亂數：只用 K.hsh。光從左：+v 面亮、+u 面暗；落影向右。
// 旗桿：繪製端 SPR.flag（14×22、錨 7,22）自帶 20px 桿身（flagAt.x-1..flagAt.x）＋旗面；這裡只畫下段桿身＋底座，flagAt＝本段桿頂（其上方 3px 必須透明）。
(window.__variants574=window.__variants574||[]).push(function civ_h(A){
  // 注入測試時本批次排在內嵌 b01…之前（b03 會改寫 42_1_*／43_1_*）⇒ 不是最後一棒就把本體排到隊尾再跑（同 civ_c／cul_a）
  const QL=window.__variants574||[];
  if(!civ_h.__late&&QL.indexOf(civ_h)>=0&&QL.indexOf(civ_h)<QL.length-1){civ_h.__late=1;QL.push(function civ_h_late(A2){civ_h(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{42:[1,2,0]}；定稿必須是 {}
  const errs=[],chk=[];

  // ================= 共用工具（沿用 civ_d／cul_a 的像素精準圖元）=================
  const LIB=(K)=>{
    const {W,H,AX,SZ,TOPY,P,hsh}=K;
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
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
    const lineU=(g,v,u0,u1,c,z=0)=>BL(g,P(u0,v,z),P(u1,v,z),c);
    const lineV=(g,u,v0,v1,c,z=0)=>BL(g,P(u,v0,z),P(u,v1,z),c);
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        while(k<items.length){const it=items[k];sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h]／['c',u,v,r,h]
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],T=[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,r,h]=s,p=P(u+h/150,v-h/340);ell(sx,p[0]+1,p[1],Math.max(2,rnd(r*1.1)),Math.max(1,rnd(r*.5)),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 逐像素地面著色：只取像素中心落在佔地菱形內的像素（保證不越出下緣）
    const paint=(g,fn)=>{for(let y=0;y<H;y++){let run=null,x0=0;for(let x=0;x<=W;x++){let c=null;
      if(x<W){const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;if(u>0&&v>0&&u<SZ&&v<SZ)c=fn(u,v,x,y)||null;}
      if(c!==run){if(run){g.fillStyle=run;g.fillRect(x0,y,x-x0,1);}run=c;x0=x;}}}};
    const MATS={
      g:{t:['#78a256','#739c51','#7da85b'],s:.125,p:.7},                       // 草
      c:{t:['#d3d0c6','#cdcac0','#d8d5cb'],j:'#bfbcb2',js:.25,s:.125,p:.65},   // 淺色混凝土磚
      a:{t:['#6f6d69','#6c6a66','#72706b'],s:.125,p:.75},                      // 瀝青
      st:{t:['#d2cdc0','#cbc6b9','#d8d3c6'],j:'#b8b2a4',js:.125,s:.125,p:.6},  // 花崗石板
      bp:{t:['#b9876c','#b38168','#c08e72'],j:'#9f7059',js:.0625,s:.125,p:.6}, // 磚鋪面（細縫）
      gr:{t:['#6d9a4e','#69954b','#72a053'],s:.125,p:.75},                     // 深一階草
      gv:{t:['#d8cba6','#d2c5a0','#ddd0ab'],s:.0625,p:.6},                     // 黃砂礫步道
      cb:{t:['#a7a39b','#a19d95','#aeaaa2'],j:'#8f8b83',js:.0625,s:.125,p:.6}, // 灰色小方石（市集廣場外圈）
    };
    const pave=(g,m,u0,v0,du,dv,seed,js)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      const J=js||M.js;if(M.j&&J){for(let a=u0+J;a<u0+du-.04;a+=J)BL(g,P(a,v0+.01),P(a,v0+dv-.035),M.j);for(let b=v0+J;b<v0+dv-.04;b+=J)BL(g,P(u0+.01,b),P(u0+du-.035,b),M.j);}};
    return Object.assign({},K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,lineU,lineV,ell,scene,shadow,paint,pave});
  };

  // ================= 元件 =================
  const KIT=(L)=>{
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ell,lineU,lineV}=L;
    const LIT='#ffe3a0',LIT2='#f3d68e',GL='#4a6d8c',GD='#34506a',GH='#93b5cc';
    const SHD=[];
    const F_=side=>side==='L'?faceL:faceR;
    // ---- 窗 ----
    const win1=(g,n,side,fx,t,z,w,h,glass,o,seed,i)=>{const F=F_(side),a=t-w/64,b=t+w/64;
      if(o.frame)F(g,fx,a-1/32,b+1/32,z-1,z+h+1,o.frame);else if(o.sill)F(g,fx,a-1/32,b+1/32,z-1,z,o.sill);
      if(o.lin)F(g,fx,a-1/32,b+1/32,z+h,z+h+1,o.lin);
      F(g,fx,a,b,z,z+h,glass);
      if(o.hi)F(g,fx,a,b,z+h-2,z+h-1,o.hi);
      if(o.mul)F(g,fx,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.tr!=null)F(g,fx,a,b,z+o.tr,z+o.tr+1,o.trc||o.mul||o.frame||o.sill);
      const arc=o.st==='arch'||o.st==='pt';
      if(arc){F(g,fx,a,a+1/32,z+h-1,z+h,o.wall);F(g,fx,b-1/32,b,z+h-1,z+h,o.wall);
        if(o.hood)F(g,fx,t-1/64,t+1/64,z+h,z+h+1,o.hood);}
      if(n&&hsh(seed,i,rnd(z*7+t*40))<(o.lit!=null?o.lit:.5))F(n,fx,a,b,z,z+h-(arc?1:0),side==='L'?LIT:LIT2);};
    const winRow=(g,n,side,fx,a,b,z,w,h,pitch,glass,o={},skip=[])=>{const len=(b-a)*32,cnt=Math.max(1,Math.floor(len/pitch)),st=(b-a)/cnt;
      for(let i=0;i<cnt;i++){const t=a+st*(i+.5);if(skip.some(s=>t>s[0]&&t<s[1]))continue;win1(g,n,side,fx,t,z,w,h,glass,o,o.seed||7,i);}};
    // 樓體（牆面＋勒腳＋簷口＋腰線＋各層窗列＋隅石；不含屋頂）；牆 zb..zb+h
    const mass=(g,n,u0,v0,du,dv,h,C,o={})=>{const u1=u0+du,v1=v0+dv,zb=o.zb||0;
      boxZ(g,u0,v0,du,dv,zb,h,null,C.wl,C.wr);
      const pl=o.pl||2;faceL(g,v1,u0,u1,zb,zb+pl,C.bl||SH(C.wl,-36));faceR(g,u1,v0,v1,zb,zb+pl,C.br||SH(C.wr,-30));
      if(C.q){let k=0;for(let z=zb+pl;z<zb+h-2.5;z+=3,k++){const wq=(k%2?2:3)/32;faceL(g,v1,u0,u0+wq,z,z+2,C.q);faceL(g,v1,u1-wq,u1,z,z+2,C.q);faceR(g,u1,v1-wq,v1,z,z+2,SH(C.q,-34));faceR(g,u1,v0,v0+wq,z,z+2,SH(C.q,-34));}}
      const fl=o.fl||0,fh=o.fh||9,z0=zb+(o.z0!=null?o.z0:3),m=o.m!=null?o.m:.04;
      for(let f=0;f<fl;f++){const z=z0+f*fh;
        if(C.cs&&f>0){faceL(g,v1,u0,u1,z-2.5,z-1.5,C.cs);faceR(g,u1,v0,v1,z-2.5,z-1.5,SH(C.cs,-38));}
        const wo={sill:C.sill,hi:o.hi===undefined?GH:o.hi,wall:C.wl,st:Array.isArray(o.st)?o.st[f]:o.st,lit:o.lit,frame:C.frame,mul:o.mul,hood:o.hood&&C.cs,seed:(o.seed||1)+f*17,tr:o.tr,trc:o.trc,lin:C.lin};
        const wh=Array.isArray(o.wh)?o.wh[f]:(o.wh||5);
        if(!o.noL)winRow(g,n,'L',v1,u0+m,u1-m,z,o.w||3,wh,o.pitch||6,C.gl||GL,wo,(o.skipL||[]).concat(f===0?(o.skipL0||[]):[]));
        const wr=Object.assign({},wo,{sill:C.sillR||C.sill,hi:null,wall:C.wr,frame:C.frameR||C.frame,hood:o.hood&&SH(C.cs,-38),seed:(o.seed||1)+f*17+5,lin:C.linR||C.lin});
        if(!o.noR)winRow(g,n,'R',u1,v0+m,v1-m,z,o.w||3,wh,o.pitchR||o.pitch||6,C.gd||GD,wr,(o.skipR||[]).concat(f===0?(o.skipR0||[]):[]));}
      if(C.cor){faceL(g,v1,u0,u1,zb+h-2,zb+h,C.cor);faceR(g,u1,v0,v1,zb+h-2,zb+h,SH(C.cor,-40));}};
    // ---- 屋頂 ----
    const gableU=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,vm=(v0+v1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf;
      if(zt-ze<32*(vm-v0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt),P(u0-ov,vm,zt)],o.rb||SH(rf,-24));
      if(o.wr)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zt)],o.wr);
      fp(g,[P(u1-.005,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt+.6),P(u1-.005,vm,zt+.6)],o.vb||SH(rf,-38));
      fp(g,[P(u0-ov,vm,zt),P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),P(u0-ov,v1+ov,ze)],rf);
      const nl=Math.max(2,Math.floor(((v1+ov-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(v1+ov-vm)*f,z=zt-(zt-ze)*f;BL(g,P(u0-ov+.01,v,z),P(u1+ov-.01,v,z),o.rl||SH(rf,-13));}
      if(o.seam){for(let t=u0+o.seam;t<u1-.01;t+=o.seam)BL(g,P(t,vm,zt),P(t,v1+ov,ze),SH(rf,-9));}
      BL(g,P(u0-ov,vm,zt),P(u1+ov,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(u0-ov,v1+ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rf,-32));
      BL(g,P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),o.verge||SH(rf,14));return{vm,zt,ze,ov};};
    const hipU=(g,u0,v0,du,dv,h,rh,o)=>{const ov=o.ov!=null?o.ov:.03,a0=u0-ov,a1=u0+du+ov,b0=v0-ov,b1=v0+dv+ov,vm=(b0+b1)/2,hr=Math.min((b1-b0)/2,(a1-a0)/2),ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      const r0=a0+hr,r1=a1-hr;
      if(zt-ze<32*hr){fp(g,[P(a0,b0,ze),P(a1,b0,ze),P(r1,vm,zt),P(r0,vm,zt)],SH(rf,-22));fp(g,[P(a0,b0,ze),P(r0,vm,zt),P(a0,b1,ze)],SH(rf,-8));}
      fp(g,[P(a1,b0,ze),P(a1,b1,ze),P(r1,vm,zt)],rs);
      fp(g,[P(a0,b1,ze),P(a1,b1,ze),P(r1,vm,zt),P(r0,vm,zt)],rf);
      const nl=Math.max(2,Math.floor(((b1-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(b1-vm)*f,z=zt-(zt-ze)*f;BL(g,P(r0-hr*f+.02,v,z),P(r1+hr*f-.02,v,z),o.rl||SH(rf,-13));}
      const nr=Math.max(2,Math.floor(((a1-r1)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nr;k++){const f=k/nr,u=r1+(a1-r1)*f,z=zt-(zt-ze)*f;BL(g,P(u,vm-hr*f+.02,z),P(u,vm+hr*f-.02,z),SH(rs,-10));}
      BL(g,P(r0,vm,zt),P(r1,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(r1,vm,zt),P(a1,b1,ze),o.hip||SH(rf,18));BL(g,P(r0,vm,zt),P(a0,b1,ze),o.hip||SH(rf,18));
      BL(g,P(a0,b1,ze),P(a1,b1,ze),o.fascia||SH(rf,-32));BL(g,P(a1,b0,ze),P(a1,b1,ze),SH(rs,-20));
      return{vm,zt,r0,r1,b1,ze};};
    const gableV=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,um=(u0+u1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      if(zt-ze<32*(um-u0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(um,v0-ov,zt),P(um,v1+ov,zt),P(u0-ov,v1+ov,ze)],rf);
      if(o.wl)fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,zt)],o.wl);
      fp(g,[P(um,v0-ov,zt),P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),P(um,v1+ov,zt)],rs);
      const nl=Math.max(2,Math.floor(((u1+ov-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(u1+ov-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,v0-ov+.01,z),P(u,v1+ov-.01,z),o.rl||SH(rs,-10));}
      BL(g,P(um,v0-ov,zt),P(um,v1+ov,zt),o.ridge||SH(rf,22));
      BL(g,P(u0-ov,v1+ov,ze),P(um,v1+ov,zt),o.verge||SH(rf,12));BL(g,P(um,v1+ov,zt),P(u1+ov,v1+ov,ze),SH(rs,-16));
      BL(g,P(u1+ov,v0-ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rs,-24));return{um,zt,ze};};
    const pyramid=(g,uc,vc,s,z,rh,rf,rs)=>{const a0=uc-s/2,a1=uc+s/2,b0=vc-s/2,b1=vc+s/2,ap=P(uc,vc,z+rh);
      if(rh<32*s/2){fp(g,[P(a0,b0,z),P(a1,b0,z),ap],SH(rf,-18));fp(g,[P(a0,b0,z),P(a0,b1,z),ap],SH(rf,-8));}
      fp(g,[P(a1,b0,z),P(a1,b1,z),ap],rs);fp(g,[P(a0,b1,z),P(a1,b1,z),ap],rf);BL(g,ap,P(a1,b1,z),SH(rf,22));return ap;};
    const flatTop=(g,u0,v0,du,dv,h,roof,o={})=>{const e=o.e||.03;flat(g,u0,v0,du,dv,o.cap||SH(roof,40),h);flat(g,u0+e,v0+e,du-2*e,dv-2*e,roof,h);
      BL(g,P(u0+e,v0+e,h),P(u0+du-e,v0+e,h),SH(roof,-24));BL(g,P(u0+e,v0+e,h),P(u0+e,v0+dv-e,h),SH(roof,-16));};
    // ---- 圓頂／鼓座 ----（o.ribT：肋條另給一組色階＝金肋）
    const dome=(g,uc,vc,r,z,rise,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2,nr=o.ribs||0;
      const x0=Math.floor(cx-Rx)-1,x1=Math.ceil(cx+Rx)+1,y0=Math.floor(cy-rise)-1,y1=Math.ceil(cy+Ry)+1;
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const Y=y+.5-cy,s=Math.sqrt(1-X*X);
        if(Y<-rise*s||Y>Ry*s)continue;
        let lo=Math.abs(X),hi=1;for(let k=0;k<22;k++){const m=(lo+hi)/2,f=Ry*Math.sqrt(Math.max(0,m*m-X*X))-rise*Math.sqrt(Math.max(0,1-m*m));if(f<Y)lo=m;else hi=m;}
        const a=(lo+hi)/2,sp=Math.sqrt(Math.max(0,1-a*a)),st=a>1e-6?Math.max(-1,Math.min(1,X/a)):0,ct=Math.sqrt(Math.max(0,1-st*st));
        const b=a*st*-.62+a*ct*.34+sp*.71;let k=b>.74?0:b>.5?1:b>.26?2:b>.02?3:4;let pal=T5;
        if(nr&&sp<.9){const th=Math.asin(st),q=th/(Math.PI/nr),fr=Math.abs(q-Math.round(q))*(Math.PI/nr)*Rx*a;if(fr<.5){if(o.ribT)pal=o.ribT;else k=Math.min(4,k+1);}}
        if(o.rings&&sp>.06&&sp<.95){const q=sp*o.rings;if(Math.abs(q-Math.round(q))<.5*o.rings/rise)pal=o.ribT||pal;}
        RC(g,x,y,1,1,pal[k]);if(o.n&&o.glow&&pal===T5)RC(o.n,x,y,1,1,k<2?o.glow:o.glow2||o.glow);}};
    const cyl=(g,n,uc,vc,r,z,h,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2;
      for(let x=Math.floor(cx-Rx);x<=Math.ceil(cx+Rx);x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const s=Math.sqrt(1-X*X);
        const b=-X*.62+s*.34+.12;const k=b>.62?0:b>.38?1:b>.12?2:b>-.2?3:4;
        const yb=Math.round(cy+Ry*s),yt=Math.round(cy-h+Ry*s);if(!o.noFill)RC(g,x,yt,1,yb-yt,T5[k]);
        if(o.cap){const yc=Math.round(cy-h-Ry*s);RC(g,x,yc,1,yt-yc,o.cap);}}
      if(o.pil){for(let i=0;i<=o.pil;i++){const th=-Math.PI/2+i*Math.PI/o.pil,x=rnd(cx+Rx*Math.sin(th)-.5),ct=Math.cos(th);if(ct<.2)continue;
        const yb=Math.round(cy+Ry*ct),yt=Math.round(cy-h+Ry*ct);RC(g,x,yt,1,yb-yt,Math.sin(th)<0?(o.pc||T5[0]):(o.pd||T5[2]));}}
      if(o.mull){for(let i=0;i<=o.mull;i++){const th=-Math.PI/2+i*Math.PI/o.mull,x=rnd(cx+Rx*Math.sin(th)-.5),ct=Math.cos(th);if(ct<.15)continue;
        const yb=Math.round(cy+Ry*ct),yt=Math.round(cy-h+Ry*ct);RC(g,x,yt,1,yb-yt,Math.sin(th)<0?(o.mc||'#eef2f4'):(o.md||'#a9b4ba'));
        if(n&&o.litN)RC(n,x,yt,1,yb-yt,'#3a3f44');}}
      if(o.bands){for(const zb of o.bands){for(let x=Math.floor(cx-Rx);x<=Math.ceil(cx+Rx);x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const s=Math.sqrt(1-X*X);
        const y=Math.round(cy-zb+Ry*s);RC(g,x,y-1,1,1,X<.3?(o.mc||'#eef2f4'):(o.md||'#a9b4ba'));}}}
      if(o.win){const w=o.win;for(let i=0;i<w.n;i++){const th=-Math.PI/2+(i+.5)*Math.PI/w.n,ct=Math.cos(th);if(ct<.3)continue;const ww=Math.max(1,rnd((w.w||2)*ct)),x=rnd(cx+Rx*Math.sin(th)-ww/2);
        const yb=Math.round(cy+Ry*ct-w.z0),yt=Math.round(cy+Ry*ct-w.z1);RC(g,x,yt,ww,yb-yt,Math.sin(th)<0?(w.glass||GL):(w.gd||GD));if(w.arch){RC(g,x,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);if(ww>1)RC(g,x+ww-1,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);}
        if(n&&hsh(w.seed||31,i,3)<(w.lit!=null?w.lit:.6))RC(n,x,yt+(w.arch?1:0),ww,yb-yt-(w.arch?1:0),LIT);}}};
    // 列柱鼓座（peristyle）：退縮的內鼓（拱窗）＋前半圈獨立圓柱＋頂部簷環
    const peri=(g,n,uc,vc,r,z,h,o={})=>{const WALL=o.wall,COL=o.col||'#f3f1ea',RING=o.ring;
      cyl(g,null,uc,vc,r+.025,z,1.5,RING,{cap:o.floor||RING[0]});
      cyl(g,n,uc,vc,r*.78,z+1.5,h-3.5,WALL,{win:{n:o.nw||5,z0:3,z1:h-7,w:2,arch:1,seed:o.seed||41,lit:.6,glass:GL,gd:GD}});
      const c=P(uc,vc,z+1.5),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2,nc=o.nc||14,hc=h-3.5;
      for(let i=0;i<nc;i++){const th=-Math.PI+(i+.5)*2*Math.PI/nc,s=Math.sin(th),ct=Math.cos(th);if(ct<.08)continue;
        const x=rnd(cx+Rx*s-.5),yb=Math.round(cy+Ry*ct),yt=Math.round(cy-hc+Ry*ct);
        const cc=s<-.45?COL:s<.2?SH(COL,-16):s<.6?SH(COL,-38):SH(COL,-58);
        RC(g,x,yt,1,yb-yt,cc);RC(g,x+1,yt,1,yb-yt,SH(cc,-30));RC(g,x,yt,2,1,SH(cc,8));}
      cyl(g,null,uc,vc,r+.03,z+h-2,2,RING,{cap:o.top||RING[0]});};
    // ---- 柱列（加 z 基座）----
    const colsL=(g,v,a,b,cnt,z0,h,cl,cr,w=.05)=>{const c=w+.02;for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,t-w/2,v-w,w,w,z0,h,null,cl,cr);boxZ(g,t-c/2,v-c+.005,c,c,z0+h-1.5,1.5,null,cl,cr);boxZ(g,t-c/2,v-c+.005,c,c,z0,1,null,cl,cr);}};
    const colsR=(g,u,a,b,cnt,z0,h,cl,cr,w=.05)=>{const c=w+.02;for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,u-w,t-w/2,w,w,z0,h,null,cl,cr);boxZ(g,u-c+.005,t-c/2,c,c,z0+h-1.5,1.5,null,cl,cr);boxZ(g,u-c+.005,t-c/2,c,c,z0,1,null,cl,cr);}};
    // 門廊：+v 面，u a..b，後牆 vw、前緣 vf；柱底 zb、柱高 h；楣 3px；山花 rise（只露右坡 dP 縱深）；o.side 右側柱數
    const porticoL=(g,n,a,b,vw,vf,zb,h,ncol,rise,o={})=>{const cl=o.cl||'#f7f2e6',cr=o.cr||'#c4bca9',CR=o.cor||'#f5efdf',STD=o.std||'#aa9e83',tym=o.tym||'#d6cab0';
      const zE=zb+h,zb0=zE+3,dP=o.dP||.09,a0=a-.01,b0=b+.01,vp=vf+.01,um=(a+b)/2,zt=zb0+rise;
      if(o.side!==0)colsR(g,b,vw+.06,vf-.08,o.side||2,zb,h,cl,cr,o.cw);
      colsL(g,vf,a+.02,b-.02,ncol,zb,h,cl,cr,o.cw);
      boxZ(g,a0,vw,b0-a0,vp-vw,zE,3,CR,o.ent||SH(CR,-8),STD);
      faceL(g,vp,a0,b0,zE,zE+1,SH(CR,-20));
      for(let t=a0+.06,k=0;t<b0-.05;t+=2/32,k++)if(k%4!==3)faceL(g,vp,t,t+1/32,zE+1,zE+2,o.txt||'#9a8f78');
      faceL(g,vp,a0,b0,zE+2,zE+3,SH(CR,10));faceR(g,b0,vw,vp,zE+2,zE+3,SH(STD,16));
      if(rise<=0)return{um,zt:zb0,zb0,vp,zE};
      const rf=o.roof||'#a3a5a6',Ap=P(um,vp,zt),Ab=P(um,vp-dP,zt),Er=P(b0+.012,vp,zb0-.6),Eb=P(b0+.012,vp-dP,zb0-.6);
      fp(g,[Ab,Eb,Er,Ap],rf);BL(g,Ap,Ab,SH(rf,40));BL(g,Er,Eb,SH(rf,-30));
      const Lp=P(a0,vp,zb0),Rp=P(b0,vp,zb0);fp(g,[Lp,Rp,Ap],tym);
      BL(g,Lp,Ap,SH(CR,10));BL(g,Ap,Rp,SH(CR,10));BL(g,Lp,Rp,SH(CR,10));
      BL(g,P(a0+.07,vp,zb0+1),P(um,vp,zt-2),SH(tym,-38));BL(g,P(um,vp,zt-2),P(b0-.035,vp,zb0+1),SH(tym,-38));
      RC(g,Ap[0],Ap[1]-3,1,3,CR);RC(g,Ap[0]-1,Ap[1]-2,3,1,CR);for(const q of[Lp,Rp])RC(g,q[0]-1,q[1]-3,2,3,CR);
      return{um,zt,zb0,vp,Ap,Lp,Rp,zE};};
    // 門（+v 面 doorL／+u 面 doorR）：石框＋木門＋氣窗；zb 門檻高
    const doorL=(g,n,v,t,wd,hd,fr,wood,zb=0)=>{const a=t-wd/64,b=t+wd/64;faceL(g,v,a-1/32,b+1/32,zb,zb+hd+1.5,fr);faceL(g,v,a,b,zb,zb+hd,wood||'#4b3226');faceL(g,v,a,b,zb+hd-2,zb+hd,'#9cc0d6');faceL(g,v,t-1/64,t+1/64,zb,zb+hd-2,SH(wood||'#4b3226',-16));if(n){faceL(n,v,a,b,zb+hd-2,zb+hd,'#ffe9b0');}};
    const doorR=(g,n,u,t,wd,hd,fr,wood,zb=0)=>{const a=t-wd/64,b=t+wd/64;faceR(g,u,a-1/32,b+1/32,zb,zb+hd+1.5,fr);faceR(g,u,a,b,zb,zb+hd,wood||'#3f2a20');faceR(g,u,a,b,zb+hd-2,zb+hd,'#7fa2b8');faceR(g,u,t-1/64,t+1/64,zb,zb+hd-2,SH(wood||'#3f2a20',-14));if(n){faceR(n,u,a,b,zb+hd-2,zb+hd,'#f3d68e');}};
    // 台階：沿 +v 下降（頂緣 vb→底緣 vf）／沿 +u 下降；C＝[踏面,踢面(亮),側面(暗)]
    const stairsV=(g,u0,u1,vb,vf,zt,n,C)=>{const s=(vf-vb)/n;for(let k=0;k<n;k++){const z=zt*(n-k)/n;boxZ(g,u0,vb+k*s,u1-u0,s+.002,0,z,C[0],C[1],C[2]);}};
    const stairsU=(g,v0,v1,ub,uf,zt,n,C)=>{const s=(uf-ub)/n;for(let k=0;k<n;k++){const z=zt*(n-k)/n;boxZ(g,ub+k*s,v0,s+.002,v1-v0,0,z,C[0],C[2],C[1]);}};
    // 瓶飾欄杆（屋頂女兒牆）：高 3px；上下扶手＋每 2px 一根瓶柱
    const balL=(g,v,a,b,z,c,cd)=>{faceL(g,v,a,b,z+2,z+3,c);faceL(g,v,a,b,z,z+1,cd||SH(c,-24));for(let t=a+1/32;t<b-.5/32;t+=2/32)faceL(g,v,t,t+1/32,z+1,z+2,cd||SH(c,-24));};
    const balR=(g,u,a,b,z,c,cd)=>{faceR(g,u,a,b,z+2,z+3,c);faceR(g,u,a,b,z,z+1,cd||SH(c,-24));for(let t=a+1/32;t<b-.5/32;t+=2/32)faceR(g,u,t,t+1/32,z+1,z+2,cd||SH(c,-24));};
    // 鐘面（牆面上的等距圓盤）：side 'L'／'R'；t 中心、z 中心、r 半徑 px；時針指 10 點、分針指 12 點；夜間鐘面透光
    const clockF=(g,n,side,fx,t,z,r,o={})=>{const F=F_(side),face=o.face||'#f4efe0',rim=o.rim||'#c9a23e',hand=o.hand||'#2a2522',tick=o.tick||'#8a7a5a',sg=side==='R'?-1:1;
      const cell=(G,ds,dz,c)=>F(G,fx,t+ds/32,t+(ds+1)/32,z+dz,z+dz+1,c);
      const IN=(ds,dz)=>ds*ds+dz*dz<=r*r+r*.8;
      for(let dz=-r;dz<=r;dz++)for(let ds=-r;ds<=r;ds++){if(!IN(ds,dz))continue;const edge=!IN(ds+1,dz)||!IN(ds-1,dz)||!IN(ds,dz+1)||!IN(ds,dz-1);
        cell(g,ds,dz,edge?rim:face);if(n&&!edge)cell(n,ds,dz,'#fff0c4');}
      if(r>=4){cell(g,0,r-1,tick);cell(g,0,-(r-1),tick);cell(g,r-1,0,tick);cell(g,-(r-1),0,tick);}
      for(let k=0;k<r-1;k++)cell(g,0,k,hand);
      for(let k=1;k<r-2;k++)cell(g,sg*k,0,hand);
      if(n){for(let k=0;k<r-1;k++)cell(n,0,k,'#5a4a30');for(let k=1;k<r-2;k++)cell(n,sg*k,0,'#5a4a30');}};
    // 老虎窗（屋面 +v 坡上）：正面在 vd、底高 zb、後緣底高 zb2（貼坡）；小山牆頂
    const dormerL=(g,n,t,vd,zb,zb2,o)=>{const w=o.w||.1,d=o.d||.12,h=o.h||6,u0=t-w/2,u1=t+w/2;
      fp(g,[P(u1,vd,zb),P(u1,vd-d,Math.min(zb+h,zb2)),P(u1,vd-d,zb+h),P(u1,vd,zb+h)],o.wr);
      faceL(g,vd,u0,u1,zb,zb+h,o.wl);
      faceL(g,vd,t-1.5/32,t+1.5/32,zb+1,zb+h-1,o.gl||GL);faceL(g,vd,t-.5/32,t+.5/32,zb+1,zb+h-1,o.mul||'#e8e1cf');
      if(n&&hsh(o.seed||5,rnd(t*50),1)<(o.lit!=null?o.lit:.5))faceL(n,vd,t-1.5/32,t+1.5/32,zb+1,zb+h-1,LIT);
      gableV(g,u0-.012,vd-d,w+.024,d+.012,zb+h,4,{rf:o.rf,rs:o.rs,wl:o.wl,ov:.012});};
    // 玻璃帷幕（+v 'L'／+u 'R'）：窗格＋豎框＋橫框；斜向亮格＝反光；n 夜亮（lit 比例）
    const curtain=(g,n,side,fx,a,b,z0,z1,o={})=>{const F=F_(side),L_=side==='L';
      const gl=o.gl||(L_?'#86abc3':'#557a92'),gh=o.gh||SH(gl,24),gm=o.gm||SH(gl,11),mul=o.mul||(L_?'#e9eef1':'#9aa7ae');
      const pitch=(o.pitch||4)/32,fh=o.fh||6,ni=Math.max(1,Math.round((b-a)/pitch)),nj=Math.max(1,Math.round((z1-z0)/fh));
      F(g,fx,a,b,z0,z1,gl);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const ta=a+(b-a)*i/ni,tb=a+(b-a)*(i+1)/ni,za=z0+(z1-z0)*j/nj,zb=z0+(z1-z0)*(j+1)/nj;
        const q=((i+j*(o.sk||1))%(o.per||5)+(o.per||5))%(o.per||5);if(q===0)F(g,fx,ta,tb,za,zb,gh);else if(q===1)F(g,fx,ta,tb,za,zb,gm);
        if(n&&o.lit&&hsh(o.seed||1,i,j)<o.lit)F(n,fx,ta,tb,za,zb,L_?LIT:LIT2);}
      if(o.inner)o.inner(F,ni,nj);
      for(let i=0;i<=ni;i++){const t=a+(b-a)*i/ni;F(g,fx,i===ni?t-1/32:t,i===ni?t:t+1/32,z0,z1,mul);if(n&&o.lit)F(n,fx,i===ni?t-1/32:t,i===ni?t:t+1/32,z0,z1,'#2c3239');}
      for(let j=0;j<=nj;j++){const z=z0+(z1-z0)*j/nj;F(g,fx,a,b,j===nj?z-1:z,j===nj?z:z+1,mul);if(n&&o.lit)F(n,fx,a,b,j===nj?z-1:z,j===nj?z:z+1,'#2c3239');}};
    const glassTop=(g,u0,v0,du,dv,z,o={})=>{const gl=o.gl||'#a4c3d6',fr=o.fr||'#eef2f4',st=o.st||.1;flat(g,u0,v0,du,dv,gl,z);
      for(let a=u0+st;a<u0+du-.02;a+=st)lineV(g,a,v0,v0+dv,SH(gl,-22),z);for(let b=v0+st;b<v0+dv-.02;b+=st)lineU(g,b,u0,u0+du,SH(gl,-22),z);
      lineU(g,v0,u0,u0+du,fr,z);lineV(g,u0,v0,v0+dv,fr,z);lineU(g,v0+dv,u0,u0+du,fr,z);lineV(g,u0+du,v0,v0+dv,fr,z);};
    // 圖樣印章：rows 由上而下，'#'＝色 c、'o'＝色 c2
    const pat=(g,side,fx,t0,z0,rows,c,c2)=>{const F=F_(side),H_=rows.length;t0=side==='L'?fx+Math.round((t0-fx)*32)/32:fx-Math.round((fx-t0)*32)/32;z0=Math.round(z0);for(let r=0;r<H_;r++)for(let k=0;k<rows[r].length;k++){const ch=rows[r][k];if(ch==='.'||ch===' ')continue;
      const kk=side==='R'?rows[r].length-1-k:k;F(g,fx,t0+kk/32,t0+(kk+1)/32,z0+H_-1-r,z0+H_-r,ch==='o'?(c2||c):c);}};
    // ---- 景觀與小件 ----
    const flagpole=(S,u,v,h,d,base)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      S.t(d,(g)=>{if(base!==false){RC(g,x-1,y-2,4,2,'#cdc8bb');RC(g,x-1,y-1,4,1,'#8f8b82');RC(g,x+2,y-2,1,2,'#9e9a90');}RC(g,x,y-h,2,h-2,'#8a8a86');RC(g,x,y-h,1,h-2,'#a9a9a3');});
      return[x+1,y-h];};
    // 靜態旗（群旗中的側杆）：與繪製端旗同尺度（旗面 3 列 × 2px）
    const sflag=(S,u,v,h,d,cols)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      S.t(d,(g)=>{RC(g,x-1,y-2,4,2,'#cdc8bb');RC(g,x-1,y-1,4,1,'#8f8b82');RC(g,x,y-h,2,h-2,'#8a8a86');RC(g,x,y-h,1,h-2,'#a9a9a3');RC(g,x,y-h-1,2,1,'#c8ccd2');
        RC(g,x+2,y-h+1,5,2,cols[0]);RC(g,x+2,y-h+3,6,2,cols[1]);RC(g,x+2,y-h+5,4,2,cols[2]||cols[0]);RC(g,x+2,y-h+1,1,6,SH(cols[0],-34));});};
    const kid=(g,p,shirt,o={})=>{const x=rnd(p[0]),y=rnd(p[1]),lg=o.leg||'#3a3f4d',sk=o.skin||'#e8bf97',hr=o.hair||'#3a2c24';
      if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-2,1,1,lg);RC(g,x,y-2,1,1,lg);}else{RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SH(lg,-12));}
      RC(g,x,y-4,2,2,shirt);RC(g,x+1,y-4,1,2,SH(shirt,-26));RC(g,x,y-5,2,1,sk);RC(g,x,y-6,2,1,hr);if(o.bag)RC(g,x-1,y-4,1,2,o.bag);
      if(o.dress){RC(g,x-1,y-3,4,1,shirt);RC(g,x,y-2,2,1,shirt);}};
    const crowd=(S,d,list)=>S.t(d,(g)=>{for(const q of list){const p=P(q[0],q[1],(q[3]&&q[3].z)||0);kid(g,p,q[2],q[3]||{});}});
    const bench=(S,u,v,alongU,d)=>S.o(d!=null?d:u+v+.06,(g)=>{if(alongU)boxZ(g,u,v,.12,.035,1,1,'#b0845a','#9a6f48','#7a5638');else boxZ(g,u,v,.035,.12,1,1,'#b0845a','#9a6f48','#7a5638');});
    // 路燈：c 古典（黑桿燈籠）／m 現代（細桿）／d 雙臂古典
    const lamp=(S,u,v,h,d,kind,z=0)=>S.t(d!=null?d:u+v+.04,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);
      if(kind==='m'){RC(g,x,y-h,1,h,'#7c858b');RC(g,x+1,y-h+1,1,h-1,'#a6aeb3');RC(g,x-1,y-h-1,3,1,'#5c6468');RC(g,x-1,y-h,3,1,'#f2f0e4');if(n){RC(n,x-1,y-h,3,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,236,190,.45)');}return;}
      if(kind==='d'){RC(g,x,y-h+2,1,h-2,'#2e3236');RC(g,x+1,y-h+3,1,h-3,'#4a5055');RC(g,x-1,y-1,3,1,'#2e3236');RC(g,x-3,y-h+2,7,1,'#2e3236');
        for(const dx of[-3,3]){RC(g,x+dx-1,y-h,3,2,'#f3e2a8');RC(g,x+dx-1,y-h-1,3,1,'#2a2e32');if(n){RC(n,x+dx-1,y-h,3,2,'#ffe6a0');RC(n,x+dx-2,y-h+2,5,1,'rgba(255,226,160,.45)');}}
        RC(g,x,y-h-1,1,2,'#2a2e32');return;}
      RC(g,x,y-h+2,1,h-2,'#2e3236');RC(g,x+1,y-h+3,1,h-3,'#4a5055');RC(g,x-1,y-1,3,1,'#2e3236');
      RC(g,x-1,y-h-1,3,1,'#2a2e32');RC(g,x-1,y-h,3,2,'#f3e2a8');RC(g,x,y-h-2,1,1,'#2a2e32');
      if(n){RC(n,x-1,y-h,3,2,'#ffe6a0');RC(n,x-2,y-h+2,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],['#c8b25a','#a88d3c','#7e6a2c','#574820']];
    const tree=(S,u,v,s=1,kind=0,d)=>{SHD.push(['c',u,v,rnd(4.2*s),rnd(9*s)+3]);S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});};
    const cypress=(S,u,v,h,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,'#4a3727');
      for(let k=0;k<h;k++){const f=k/h,w=Math.max(1,rnd(3.2*Math.sin(Math.PI*Math.min(.95,f*.85+.12))));RC(g,x-w+1,y-2-k,w,1,'#5d8f4a');RC(g,x+1,y-2-k,w,1,'#3c6632');}RC(g,x,y-2-h,1,1,'#3c6632');});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const hedge=(S,u0,v0,du,dv,d,h=3)=>S.o(d!=null?d:u0+du+v0+dv,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#5f9442','#4e7f37','#3b6429');});
    const flowers=(g,u0,v0,du,dv,seed,cols,base)=>{flat(g,u0,v0,du,dv,base||'#4f7f35');const n=Math.floor(du*32)*Math.max(1,Math.floor(dv*16));
      for(let i=0;i<n*2;i++){const u=u0+.02+hsh(seed,i,1)*(du-.04),v=v0+.02+hsh(seed,i,2)*(dv-.04),p=P(u,v);RC(g,p[0],p[1],1,1,cols[(hsh(seed,i,3)*cols.length)|0]);}};
    const rail=(S,a,b,o={})=>S.t(o.d!=null?o.d:50,(g)=>{const h=o.h||5,pc=o.pc||'#34393e',rc=o.rc||'#4d545a';
      const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],pa=P(a[0],a[1]),pb=P(b[0],b[1]),Lp=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,rnd(Lp/(o.step||3))),gp=o.gap;
      const seg=(t0,t1)=>{const A0=at(t0),A1=at(t1);BL(g,P(A0[0],A0[1],h),P(A1[0],A1[1],h),rc);if(!o.one)BL(g,P(A0[0],A0[1],1),P(A1[0],A1[1],1),rc);};
      const segs=gp?[[0,gp[0]],[gp[1],1]]:[[0,1]];for(const s of segs)if(s[1]-s[0]>1e-3)seg(s[0],s[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(gp&&t>gp[0]+1e-6&&t<gp[1]-1e-6)continue;const q=at(t),p=P(q[0],q[1]);RC(g,p[0],p[1]-h,1,h,pc);}});
    const bikes=(S,u0,v0,len,alongU,d,seed)=>S.t(d,(g)=>{const n=Math.max(2,Math.floor(len*32/3));for(let i=0;i<n;i++){const t=len*(i+.5)/n,p=alongU?P(u0+t,v0):P(u0,v0+t),x=rnd(p[0]),y=rnd(p[1]);
      const c=['#c24a3a','#2f5f96','#d9d9d4','#3f7f4a','#e0a83a','#2a2d31'][hsh(seed||3,i,1)*6|0];
      RC(g,x-1,y-1,1,1,'#2a2d31');RC(g,x+1,y,1,1,'#2a2d31');RC(g,x-1,y-2,2,1,c);RC(g,x+1,y-1,1,1,c);RC(g,x,y-3,1,1,'#2a2d31');}});
    // 圓噴泉：石盆＋水面＋中央兩層水盤＋水柱
    const fountain=(S,uc,vc,r,d,o={})=>S.o(d,(g,n)=>{const c=P(uc,vc),x=rnd(c[0]),y=rnd(c[1]),rx=rnd(r*45.25),ry=rnd(r*22.6),st=o.stone||'#e3ddcf',sd=o.stoneD||'#a39c8c';
      ell(g,x,y,rx,ry,sd);ell(g,x,y-2,rx,ry,st);ell(g,x,y-2,rx-2,Math.max(1,ry-1),'#4c7f9e');ell(g,x-1,y-2,rx-4,Math.max(1,ry-3),'#5e93b2');
      for(let i=0;i<5;i++){const a=hsh(o.seed||9,i,1)*6.28,rr=.4+hsh(o.seed||9,i,2)*.5;RC(g,x+Math.cos(a)*(rx-3)*rr,y-2+Math.sin(a)*(ry-2)*rr,2,1,'#9fd0e6');}
      RC(g,x-2,y-5,5,2,st);RC(g,x-2,y-4,5,1,sd);RC(g,x-1,y-8,2,3,SH(st,-14));
      if(o.tier){RC(g,x-3,y-9,7,1,st);RC(g,x-2,y-8,5,1,sd);RC(g,x,y-12,1,3,SH(st,-14));}
      const top=o.tier?y-17:y-13;RC(g,x,top,1,o.tier?5:5,'#d8eef8');RC(g,x-1,top+2,1,3,'#b8dcee');RC(g,x+1,top+2,1,3,'#b8dcee');});
    // 銅像（石台座＋青銅人像）
    const statue=(S,u,v,d,s=1,z=0,o={})=>S.o(d!=null?d:u+v+.08,(g)=>{const st=o.st||'#e3ddcf';boxZ(g,u-.06*s,v-.06*s,.12*s,.12*s,z,2,SH(st,-10),SH(st,-14),SH(st,-68));boxZ(g,u-.04*s,v-.04*s,.08*s,.08*s,z+2,5*s,st,SH(st,-8),SH(st,-64));
      const p=P(u,v,z+2+5*s),x=rnd(p[0]),y=rnd(p[1]),b1=o.b1||'#4d6a5e',b2=o.b2||'#35493f',b3=o.b3||'#6d8f81';RC(g,x-1,y-8,3,8,b1);RC(g,x+1,y-8,1,8,b2);RC(g,x-1,y-10,2,2,SH(b1,16));RC(g,x+2,y-8,1,3,b1);RC(g,x-2,y-7,1,2,b3);});
    const umbrella=(S,u,v,col,d)=>{S.o(d!=null?d:u+v+.06,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      RC(g,x-2,y-3,5,1,'#e9e5da');RC(g,x-1,y-2,3,1,'#b9b4a8');RC(g,x,y-9,1,7,'#6d6a64');
      RC(g,x-3,y-2,1,2,'#6d6a64');RC(g,x+3,y-2,1,2,'#6d6a64');
      RC(g,x-4,y-9,9,1,SH(col,-30));RC(g,x-3,y-10,7,1,col);RC(g,x-2,y-11,5,1,SH(col,18));RC(g,x-1,y-12,3,1,SH(col,30));RC(g,x,y-13,1,1,'#6d6a64');});};
    // 市集攤（帆布頂小攤）
    const stall=(S,u,v,col,d)=>{SHD.push(['b',u,v,.14,.1,9]);S.o(d!=null?d:u+v+.1,(g,n)=>{boxZ(g,u,v,.14,.1,0,4,'#c9a574','#b58d5c','#8a6a44');
      faceL(g,v+.1,u+.01,u+.13,2,3,'#e0584a');faceL(g,v+.1,u+.03,u+.06,3,4,'#f2c230');faceL(g,v+.1,u+.08,u+.11,3,4,'#7fb04a');
      for(const[a,b]of[[u,v+.1],[u+.14,v+.1],[u+.14,v]]){const p=P(a,b,4);RC(g,p[0],p[1]-5,1,5,'#6d5a44');}
      const q=[P(u-.02,v-.02,9),P(u+.16,v-.02,9),P(u+.16,v+.12,8),P(u-.02,v+.12,8)];fp(g,q,col);
      BL(g,P(u+.07,v-.02,9),P(u+.07,v+.12,8),SH(col,30));
      faceL(g,v+.12,u-.02,u+.16,7,8,'#f4efe2');faceR(g,u+.16,v-.02,v+.12,7,8,SH(col,-40));});};
    // 小車：長 .23、寬 .1
    const CL=.23,CW=.1,CST={};
    const carStamp=(al,col)=>{const key=al+col;if(CST[key])return CST[key];
      const ox=al==='u'?4:9,oy=5,[c,x]=A.cv(14,13),lp=(u,v,z)=>[ox+(u-v)*32,oy+(u+v)*16-z];
      const pt=al==='u'?((b,a,z)=>lp(b,a,z)):((b,a,z)=>lp(a,b,z)),lit=al==='u';
      const bx=(b0,db,a0,da,z,h,t,s,e)=>{const b1=b0+db,a1=a0+da;
        fp(x,[pt(b0,a1,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b0,a1,z+h)],s);
        fp(x,[pt(b1,a0,z),pt(b1,a1,z),pt(b1,a1,z+h),pt(b1,a0,z+h)],e);
        fp(x,[pt(b0,a0,z+h),pt(b1,a0,z+h),pt(b1,a1,z+h),pt(b0,a1,z+h)],t);};
      bx(0,CL,0,CW,0,2,SH(col,24),lit?col:SH(col,-40),lit?SH(col,-40):col);
      bx(CL*.22,CL*.5,CW*.12,CW*.76,2,2,SH(col,34),lit?'#3a5163':'#26374a',lit?'#26374a':'#3a5163');
      x.fillStyle='#1a1d20';for(const b of[CL*.2,CL*.78]){const p=pt(b,CW,0);x.fillRect(rnd(p[0]),rnd(p[1])-1,1,1);}
      return CST[key]={c,ox,oy};};
    const car=(S,u,v,alongU,col,d)=>{const st=carStamp(alongU?'u':'v',col),p=P(u,v),X0=rnd(p[0])-st.ox,Y0=rnd(p[1])-st.oy;
      SHD.push(['b',u,v,alongU?CL:CW,alongU?CW:CL,4]);
      S.o(d!=null?d:u+v+.1,(g)=>{g.drawImage(st.c,X0,Y0);});};
    // 3×5 點陣字
    const FONT={C:['111','100','100','100','111'],I:['111','010','010','010','111'],T:['111','010','010','010','010'],Y:['101','101','010','010','010'],H:['101','101','111','101','101'],
      A:['010','101','111','101','101'],L:['100','100','100','100','111'],O:['111','101','101','101','111'],U:['101','101','101','101','111'],R:['110','101','110','101','101'],J:['001','001','001','101','111'],S:['111','100','111','001','111'],E:['111','100','110','100','111']};
    const glyph=(g,side,fx,t0,z0,ch,col)=>{const F=F_(side),gl=FONT[ch];if(!gl)return;t0=side==='L'?fx+Math.round((t0-fx)*32)/32:fx-Math.round((fx-t0)*32)/32;z0=Math.round(z0);for(let r=0;r<5;r++)for(let c=0;c<3;c++){if(gl[r][c]!=='1')continue;const cc=side==='R'?2-c:c;F(g,fx,t0+cc/32,t0+(cc+1)/32,z0+4-r,z0+5-r,col);}};
    // 天平徽記（9×6）：橫樑、吊繩、兩盤、立柱、底座
    const SCALES=['....#....','#########','#...#...#','###.#.###','....#....','..#####..'];
    // 正義女神像（鍍金）：站在 (u,v,z) 上；左手高舉天平、右手持劍下垂
    // 7×10 點陣：h 亮金、# 金、d 暗金、s 劍（淺鋼）；天平高舉過頭
    const JUS=['.hhhhh.','.h.#.d.','hh.#.dd','...#...','..hh...','..##d..','..##ds.','..##ds.','.###dd.','.####d.'];
    const justice=(g,u,v,z,o={})=>{const p=P(u,v,z),x=rnd(p[0])-3,y=rnd(p[1])-JUS.length,C_={h:o.c3||'#f4dc8a','#':o.c1||'#d9b24a',d:o.c2||'#9a7a2c',s:o.sw||'#e8ecee'};
      for(let r=0;r<JUS.length;r++)for(let k=0;k<7;k++){const ch=JUS[r][k];if(C_[ch])RC(g,x+k,y+r,1,1,C_[ch]);}};
    // 前庭正義女神像（大）：兩層石台座＋鍍金立像——左手高舉天平（橫樑＋兩盤）、右手持劍下垂
    const justiceBig=(S,u,v,d,o={})=>{SHD.push(['b',u-.06,v-.06,.12,.12,24]);d=d!=null?d:u+v+.1;const st=o.st||'#e6e2d8',h='#f4dc8a',m='#d4aa44',dk='#8f6f28',bz='#5e4a24',sw='#8e979c';
      const p=P(u,v,9),x=rnd(p[0]),y=rnd(p[1]);
      S.o(d,(g)=>{boxZ(g,u-.06,v-.06,.12,.12,0,2,SH(st,-6),SH(st,-12),SH(st,-70));boxZ(g,u-.04,v-.04,.08,.08,2,6,st,SH(st,-4),SH(st,-64));boxZ(g,u-.05,v-.05,.1,.1,8,1,SH(st,8),SH(st,-2),SH(st,-60));
        RC(g,x-2,y-2,5,2,m);RC(g,x+1,y-2,2,2,dk);RC(g,x-1,y-8,3,6,m);RC(g,x+1,y-8,1,6,dk);RC(g,x-1,y-8,1,5,h);RC(g,x,y-10,2,2,h);RC(g,x+1,y-9,1,1,m);});
      S.t(d+.001,(g)=>{RC(g,x-2,y-9,1,1,m);RC(g,x-3,y-10,1,1,m);RC(g,x-4,y-11,1,1,m);RC(g,x-4,y-12,1,1,dk);
        RC(g,x-8,y-13,9,1,bz);RC(g,x-4,y-13,1,1,h);RC(g,x-8,y-12,1,1,bz);RC(g,x,y-12,1,1,bz);RC(g,x-9,y-11,3,1,m);RC(g,x-1,y-11,3,1,m);
        RC(g,x+2,y-8,1,1,dk);RC(g,x+3,y-8,1,7,sw);RC(g,x+3,y-9,1,1,dk);});};
    // 坐像（台階頰牆上）
    const seated=(g,u,v,z,c)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-3,4,3,SH(c,-10));RC(g,x-1,y-6,3,3,c);RC(g,x+1,y-6,1,3,SH(c,-30));RC(g,x-1,y-8,2,2,SH(c,14));RC(g,x-2,y-3,1,3,SH(c,-24));};
    return {LIT,LIT2,GL,GD,GH,SHD,win1,winRow,mass,gableU,gableV,hipU,pyramid,flatTop,dome,cyl,peri,colsL,colsR,porticoL,doorL,doorR,stairsV,stairsU,balL,balR,clockF,dormerL,pat,curtain,glassTop,
      flagpole,sflag,kid,crowd,bench,lamp,tree,cypress,bush,hedge,flowers,rail,bikes,fountain,statue,umbrella,stall,car,glyph,SCALES,justice,justiceBig,seated};
  };

  const build=(k,def,layoutsOf)=>{
    const old=B[k+'_1_0'];
    const W=(old&&old.w)||def.W,H=(old&&old.h)||def.H,AX=(old&&old.ax!=null)?old.ax:def.AX,AY=(old&&old.ay!=null)?old.ay:def.AY;
    const K=A.iso575(W,H,AX,AY,def.SZ),L=LIB(K),order=DEV[k]||null,out=[];
    // 收尾裁切：佔地菱形南側兩條斜邊以外、頂端 2 列以內一律清掉（並記數）
    const cutAt=[];
    const clip=(c)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;let cut=0;
      for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4+3;if(!a[i])continue;if(y<2||y+.5>AY-Math.abs(xx+.5-AX)/2+.01){a[i]=0;cut++;if(cutAt.length<12)cutAt.push(xx+','+y);}}
      if(cut){x.putImageData(d,0,0);}return cut;};
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;
      try{const T=KIT(L),lay=layoutsOf(L,T);const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
        const o=lay[v](g,ng,S)||{};if(T.SHD.length)L.shadow(g,T.SHD);S.run(g,ng);
        const cut=clip(c),cutN=clip(nc);
        const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:o.smoke||[]};
        if(o.flagAt){spr.flagAt=o.flagAt;const[fx,fy]=o.flagAt,id=c.getContext('2d').getImageData(fx-1,fy-3,2,3).data;let op=0;for(let i=3;i<id.length;i+=4)if(id[i])op++;
          if(op)errs.push('k'+k+'v'+v+' flagAt 上方有不透明像素 '+op);}
        chk.push({k,v,cut,cutN,flagAt:o.flagAt||null,at:cutAt.splice(0).join(' ')});
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('civ_h k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];
  };

  // ================= k42 市政廳（2×2）=================
  try{
    build(42,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD;
      return [
      // ---------- v0 穹頂式 ----------
      (g,ng,S)=>{
        const GR='#e2dfd6',GRD='#a8a49b',CR='#f5f3ed',ZB=6;
        const C={wl:GR,wr:GRD,bl:'#c9c5bb',br:'#8c887f',cor:CR,cs:'#ecE9e1'.toLowerCase(),sill:'#f7f5ef',sillR:'#bdb9af',gl:GL,gd:GD};
        const LEAD=['#b3bfcb','#93a1b0','#768596','#5c6a7b','#46515f'],GOLD=['#fff0b0','#f2d072','#d6aa45','#a8802c','#7a5a1c'];
        const RING=['#f2f0ea','#e2dfd6','#c9c5bb','#a8a49b','#8c887f'];
        pave(g,'g',0,0,2,2,4201);
        pave(g,'st',.08,.12,1.84,1.1,4202);
        pave(g,'st',.6,1.2,.8,.78,4203);
        pave(g,'st',.04,1.1,.2,.86,4204);
        // 廣場：噴泉外圈同心鋪面
        paint(g,(u,v)=>{if(u<.6||u>1.4||v<1.44)return null;const r=Math.hypot(u-1,(v-1.76));if(r<.3&&r>.25)return '#bfb8a8';if(r<=.25)return '#dcd6ca';return null;});
        // 左右草坪：花壇帶
        T.flowers(g,.3,1.24,.26,.06,4205,['#c8566a','#e0b24a','#f0e6d8']);T.flowers(g,1.44,1.24,.4,.06,4206,['#c8566a','#e0b24a','#f0e6d8']);
        T.flowers(g,1.44,1.5,.06,.4,4207,['#d86a4a','#f0d27a','#f0e6d8']);
        shadow(g,[['b',.12,.18,1.76,.98,ZB],['b',.16,.26,.5,.78,ZB+24],['b',.66,.18,.68,.9,ZB+30],['b',1.34,.26,.5,.78,ZB+24],['b',.74,.36,.52,.52,ZB+50],['b',.72,1.08,.56,.24,ZB+40]]);
        // 台基（粗面石、橫縫）
        S.o(.5,(g)=>{boxZ(g,.12,.18,1.76,.98,0,ZB,'#d6d2c8','#cbc7bd','#8f8b82');boxZ(g,.7,1.16,.6,.16,0,ZB,'#d6d2c8','#cbc7bd','#8f8b82');
          for(const z of[2,4]){faceL(g,1.16,.12,.7,z,z+.8,'#b3afa5');faceL(g,1.16,1.3,1.88,z,z+.8,'#b3afa5');faceR(g,1.88,.18,1.16,z,z+.8,'#7b776f');faceL(g,1.32,.7,1.3,z,z+.8,'#b3afa5');}
          faceL(g,1.16,.12,.7,ZB-1,ZB,'#efece4');faceL(g,1.16,1.3,1.88,ZB-1,ZB,'#efece4');faceR(g,1.88,.18,1.16,ZB-1,ZB,'#a39f96');});
        // 兩翼：兩層拱窗＋女兒牆欄杆
        const wing=(u0,seed,right)=>(g,n)=>{const v0=.26,du=.5,dv=.78,h=24,v1=v0+dv,u1=u0+du;
          T.mass(g,n,u0,v0,du,dv,h,C,{zb:ZB,fl:2,z0:3,fh:11,w:3,wh:[7,6],pitch:4.6,m:.02,st:['arch',null],seed,lit:.4,hood:1,noR:!right});
          for(const t of[u0+.035,u1-.035])faceL(g,v1,t-1/32,t+1/32,ZB+2,ZB+h-2,SH(GR,10));
          T.flatTop(g,u0,v0,du,dv,ZB+h,'#bab6ad',{cap:CR});
          T.balL(g,v1,u0,u1,ZB+h,CR);if(right)T.balR(g,u1,v0,v1,ZB+h,SH(CR,-40));};
        S.o(1.0,wing(.16,4211,false));
        // 中央主樓
        S.o(1.1,(g,n)=>{const u0=.66,v0=.18,du=.68,dv=.9,h=30,u1=u0+du,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,C,{zb:ZB,fl:2,z0:4,fh:13,w:3,wh:[8,7],pitch:6,st:'arch',skipL:[[.7,1.3]],seed:4212,lit:.35,hood:1});
          T.flatTop(g,u0,v0,du,dv,ZB+h,'#bab6ad',{cap:CR});
          T.balL(g,v1,u0,u1,ZB+h,CR);T.balR(g,u1,v0,v1,ZB+h,SH(CR,-40));
          // 門廊後牆：深陰影色＋三扇拱門＋二樓三扇拱窗
          faceL(g,v1,.72,1.28,ZB,ZB+30,'#8e8a82');
          for(const t of[.87,1.0,1.13]){T.doorL(g,n,v1,t,4,12,'#b6b2a8','#4b3226',ZB);T.win1(g,n,'L',v1,t,ZB+18,3,7,'#3c5a74',{st:'arch',wall:'#8e8a82',sill:'#b6b2a8',lit:.6},4213,rnd(t*10));}});
        S.o(1.2,wing(1.34,4214,true));
        // 穹頂：方座＋列柱鼓座＋簷環＋金肋鉛灰穹頂＋採光亭＋金頂飾
        S.o(1.3,(g,n)=>{const uc=1.0,vc=.62,z=ZB+30;
          boxZ(g,uc-.26,vc-.26,.52,.52,z,4,'#ece9e1',GR,GRD);T.balL(g,vc+.26,uc-.26,uc+.26,z+4,CR);T.balR(g,uc+.26,vc-.26,vc+.26,z+4,SH(CR,-40));
          T.peri(g,n,uc,vc,.23,z+4,16,{wall:['#c9c5bb','#b5b1a7','#a09c93','#8a867d','#74706a'],ring:RING,col:'#f7f5ef',nc:16,seed:4215});
          T.cyl(g,null,uc,vc,.21,z+20,3,RING,{cap:CR});
          T.dome(g,uc,vc,.215,z+23,17,LEAD,{ribs:12,ribT:GOLD});
          T.cyl(g,n,uc,vc,.055,z+37,6,RING,{cap:CR,win:{n:2,z0:1,z1:5,w:1,seed:4216,lit:1}});
          T.dome(g,uc,vc,.06,z+43,3,GOLD);const ap=P(uc,vc,z+46);RC(g,ap[0],ap[1]-3,1,3,'#e0b84a');RC(g,ap[0]-1,ap[1]-2,3,1,'#c99a36');});
        // 門廊：六柱＋右側兩柱＋楣（刻字點）＋山花（浮雕）
        S.o(2.3,(g,n)=>{const r=T.porticoL(g,n,.72,1.28,1.08,1.3,ZB,27,4,12,{side:1,cw:.045,cl:'#f9f8f4',cr:'#c2beb4',cor:CR,std:GRD,tym:'#d9d5cb',roof:'#9aa3ab'});
          const vp=r.vp,um=r.um,z0=r.zb0,fc=(dt,z,c)=>faceL(g,vp,um+dt/32,um+(dt+1)/32,z0+z,z0+z+1,c);
          for(let dt=-2;dt<=2;dt++)for(let z=2;z<=5;z++)if(Math.abs(dt)+Math.abs(z-3.5)<3.2)fc(dt,z,(dt+z)%2?'#c9a64a':'#e6c86a');
          if(n){const lp=P(um,1.2,ZB+26);RC(n,lp[0]-1,lp[1],3,2,'#ffe6a0');}});
        // 大台階＋頰牆
        S.o(2.6,(g)=>{boxZ(g,.68,1.3,.06,.26,0,ZB+1,'#efece4','#d6d2c8','#9a968d');
          T.stairsV(g,.74,1.26,1.32,1.56,ZB,6,['#efece4','#b9b5ab','#96928a']);
          boxZ(g,1.26,1.3,.06,.26,0,ZB+1,'#efece4','#d6d2c8','#9a968d');});
        T.lamp(S,.66,1.6,14,2.9,'c');T.lamp(S,1.34,1.6,14,3.1,'c');
        // 噴泉
        T.fountain(S,1.0,1.76,.17,3.2,{tier:1,seed:4217});
        // 右草坪：創市者銅像、花壇、長椅
        T.statue(S,1.66,1.56,null,1.2);
        T.bench(S,1.5,1.86,true);T.bench(S,1.78,1.3,false);
        T.lamp(S,1.9,1.9,13,null,'c');T.lamp(S,.62,1.94,13,null,'c');
        // 左側旗列（三杆，沿 v 排開；中杆 flagAt）
        T.sflag(S,.12,1.24,16,3.0,['#c0392b','#f4f1e8','#c0392b']);
        const fa=T.flagpole(S,.12,1.54,10,3.1);
        T.sflag(S,.12,1.84,16,3.2,['#2f5fa0','#f4f1e8','#2f5fa0']);
        // 樹
        for(const[u,v,k,s]of[[1.92,.14,0,1],[1.93,.62,2,.9],[.36,1.9,0,1.05]])T.tree(S,u,v,s,k);
        T.bush(S,.44,1.3,3);T.bush(S,1.5,1.34,3);
        T.crowd(S,3.3,[[.86,1.4,'#2f5f96',{z:3}],[.96,1.46,'#c24a3a',{z:2}],[1.12,1.36,'#2a2d31',{z:4}],[1.18,1.5,'#f4f4ef',{z:1}],
          [.8,1.7,'#3f7f4a'],[1.2,1.8,'#e8c23a'],[.9,1.92,'#2a2d31',{dress:1}],[1.3,1.66,'#8a5bb0'],[.5,1.6,'#d9d9d4'],[1.7,1.7,'#c24a3a'],[1.62,1.4,'#2f5f96']]);
        return{flagAt:fa};
      },
      // ---------- v1 鐘塔式 ----------
      (g,ng,S)=>{
        const BR={wl:'#b5563f',wr:'#833c2c',bl:'#9a9282',br:'#6f685c',cor:'#eadfc6',cs:'#e2d5b6',sill:'#f1e9d4',sillR:'#b8ab8d',gl:GL,gd:GD};
        const CU='#6fae94',CUS='#4f8a74',STN='#e6dcc2',STD='#b3a88f';
        pave(g,'g',0,0,2,2,4221);
        pave(g,'bp',.06,.2,1.9,1.78,4222);
        pave(g,'cb',.06,1.02,1.9,.1,4223);
        paint(g,(u,v)=>{if(v<1.12)return null;const r=Math.hypot(u-1.45,v-1.52);if(r<.24&&r>.2)return '#8f8b83';if(r<=.2)return '#a7a39b';return null;});
        shadow(g,[['b',.16,.3,1.68,.66,44],['b',.16,.3,.3,.78,48],['b',1.54,.3,.3,.78,48],['b',.86,.8,.3,.3,90]]);
        const pav=(u0,seed)=>(g,n)=>{const v0=.3,du=.3,dv=.78,h=28,v1=v0+dv,u1=u0+du,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,BR,{fl:2,z0:4,fh:11,w:3,wh:[8,7],pitch:5,st:'arch',seed,lit:.35,hood:1,pl:3});
          T.gableV(g,u0,v0,du,dv,h,20,{rf:CU,rs:CUS,wl:BR.wl,ov:.025});
          // 山牆：石壓頂線＋圓窗
          BL(g,P(u0-.02,v1+.025,h-1),P(um,v1+.025,h+20),STN);BL(g,P(um,v1+.025,h+20),P(u1+.02,v1+.025,h-1),STD);
          faceL(g,v1,um-2/32,um+2/32,h+5,h+9,GL);faceL(g,v1,um-.5/32,um+.5/32,h+5,h+9,STN);faceL(g,v1,um-2/32,um+2/32,h+6.5,h+7.5,STN);
          if(n&&hsh(seed,1,1)<.7)faceL(n,v1,um-2/32,um+2/32,h+5,h+9,T.LIT);
          const ap=P(um,v1+.02,h+20);RC(g,ap[0],ap[1]-4,1,4,'#c9a64a');RC(g,ap[0]-1,ap[1]-3,3,1,'#c9a64a');};
        // 主樓
        S.o(1.0,(g,n)=>{const u0=.16,v0=.3,du=1.68,dv=.66,h=26,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,BR,{fl:2,z0:4,fh:11,w:3,wh:[8,7],pitch:5.4,st:'arch',seed:4224,lit:.35,hood:1,pl:3,skipL:[[.82,1.18]]});
          const r=T.gableU(g,u0,v0,du,dv,h,18,{rf:CU,ov:.03,seam:.06});
          for(const t of[.58,.72,1.28,1.42]){const vd=.9,f=(vd-r.vm)/(v1+r.ov-r.vm),zb=r.zt-(r.zt-r.ze)*f,vb=vd-.1,f2=(vb-r.vm)/(v1+r.ov-r.vm),zb2=r.zt-(r.zt-r.ze)*f2;
            T.dormerL(g,n,t,vd,zb,zb2,{wl:BR.wl,wr:BR.wr,rf:CU,rs:CUS,w:.08,d:.1,h:5,seed:4225});}
          for(const t of[.5,1.5]){boxZ(g,t,.5,.06,.06,r.zt-6,10,'#8a8f93',BR.wl,BR.wr);boxZ(g,t-.01,.49,.08,.08,r.zt+4,1.5,'#6f7478','#d8cdb2','#a39880');}});
        S.o(1.1,pav(.16,4226));
        S.o(1.2,pav(1.54,4227));
        // 鐘塔
        S.o(2.0,(g,n)=>{const u0=.86,v0=.8,d=.3,u1=u0+d,v1=v0+d,um=u0+d/2,vm=v0+d/2;
          T.mass(g,n,u0,v0,d,d,56,BR,{pl:3});
          for(const z of[15,40])  {faceL(g,v1,u0,u1,z,z+1.5,STN);faceR(g,u1,v0,v1,z,z+1.5,STD);}
          // 拱門入口（石框）
          faceL(g,v1,um-.09,um+.09,0,14,STN);faceL(g,v1,um-.065,um+.065,0,11,'#3a2a20');faceL(g,v1,um-.065,um-.035,10,11,STN);faceL(g,v1,um+.035,um+.065,10,11,STN);
          faceL(g,v1,um-.003,um+.003,0,9,'#5a4030');if(n)faceL(n,v1,um-.06,um+.06,1,10,'rgba(255,214,140,.8)');
          // 陽台
          boxZ(g,um-.1,v1,.2,.05,15,1.5,STN,STN,STD);T.balL(g,v1+.05,um-.1,um+.1,16.5,STN,STD);
          // 塔身窗
          for(const z of[19,28]){T.win1(g,n,'L',v1,um,z,3,7,GL,{st:'arch',wall:BR.wl,sill:BR.sill,lit:.6},4228,z);T.win1(g,n,'R',u1,vm,z,3,7,GD,{st:'arch',wall:BR.wr,sill:BR.sillR,lit:.5},4229,z);}
          // 鐘層（石）
          boxZ(g,u0-.02,v0-.02,d+.04,d+.04,42,14,null,STN,STD);faceL(g,v1+.02,u0-.02,u1+.02,55,56,'#f4ecd8');faceR(g,u1+.02,v0-.02,v1+.02,55,56,SH(STD,-10));
          T.clockF(g,n,'L',v1+.02,um,49,4,{rim:'#2f3a33'});T.clockF(g,n,'R',u1+.02,vm,49,4,{rim:'#2f3a33',face:'#dcd4c0'});
          // 鐘樓（退縮）＋拱窗
          boxZ(g,u0+.02,v0+.02,d-.04,d-.04,56,11,null,BR.wl,BR.wr);
          for(const t of[um-.05,um+.05]){faceL(g,v1-.02,t-.025,t+.025,58,65,'#2a2522');faceL(g,v1-.02,t-.025,t-.005,64,65,BR.wl);faceR(g,u1-.02,t-.025,t+.025,58,65,'#221e1b');}
          faceL(g,v1-.02,u0+.02,u1-.02,66,67,STN);faceR(g,u1-.02,v0+.02,v1-.02,66,67,STD);
          flat(g,u0,v0,d,d,'#8a7f6a',67);
          const ap=T.pyramid(g,um,vm,d+.02,67,26,CU,CUS);
          RC(g,ap[0],ap[1]-3,1,3,'#c9a64a');RC(g,ap[0]-1,ap[1]-2,3,1,'#e0c060');RC(g,ap[0],ap[1]-5,1,1,'#e0c060');
          // 四角小尖塔
          for(const[a,b]of[[u0,v1],[u1,v1],[u1,v0]]){const p=P(a,b,67);RC(g,p[0]-1,p[1]-4,2,4,STN);RC(g,p[0],p[1]-6,1,2,CU);}});
        // 台階
        S.o(2.5,(g)=>{T.stairsV(g,.88,1.14,1.1,1.2,3,3,['#e9e2d0','#b5aa92','#8f8672']);});
        // 廣場：市集噴泉、攤、傘、燈、樹、人
        T.fountain(S,1.45,1.52,.13,3.2,{seed:4230});
        // 市集攤：沿西緣一字排開（間距 .34，帆布頂不互疊）；咖啡傘兩把退到廣場中段
        T.stall(S,.1,1.18,'#c0392b');T.stall(S,.1,1.5,'#2f6f9e');T.stall(S,.1,1.82,'#3f8f5a');
        T.umbrella(S,.52,1.46,'#e8c23a');T.umbrella(S,.6,1.84,'#c0392b');
        T.lamp(S,.7,1.22,14,null,'c');T.lamp(S,1.32,1.22,14,null,'c');T.lamp(S,1.88,1.6,14,null,'c');
        for(const[u,v,k,s]of[[1.9,1.18,0,1],[1.12,1.9,2,1],[.08,.7,0,.95]])T.tree(S,u,v,s,k);
        T.bench(S,1.3,1.8,true);T.bench(S,1.7,1.3,false);
        const fa=T.flagpole(S,1.92,.14,11,2.2);
        T.crowd(S,3.3,[[.98,1.3,'#2f5f96'],[1.06,1.38,'#c24a3a'],[.36,1.36,'#e8c23a'],[.36,1.68,'#3f7f4a',{bag:'#c9a64a'}],[.9,1.6,'#2a2d31'],[1.2,1.54,'#f4f4ef'],
          [1.64,1.7,'#8a5bb0'],[1.3,1.96,'#2f5f96'],[.8,1.72,'#c24a3a',{dress:1}],[1.7,1.5,'#d9d9d4']]);
        return{flagAt:fa};
      },
      // ---------- v2 現代玻璃議事廳 ----------
      (g,ng,S)=>{
        const WH='#f1f2f0',WHD='#b7bbbd',CON='#d9dad6',CONd='#9ea2a4';
        const GLS=['#bfe0ef','#95c0d8','#6f9fbf','#52809f','#3d6582'],FR=['#f4f7f8','#dfe7eb','#c5d0d6','#a9b6bd','#8c9aa2'];
        pave(g,'g',0,0,2,2,4241);
        pave(g,'c',.08,.08,1.86,1.9,4242);
        // 東角旗台（深色花崗石）
        paint(g,(u,v)=>{if(u<1.66||v>.6)return null;return (hsh(4251,rnd(u*24),rnd(v*24))<.5)?'#a9a59c':'#b3afa6';});
        // 倒影水池（淺色石緣＋深水面＋波光）
        flat(g,.22,1.36,.98,.4,'#e4e2da');flat(g,.25,1.39,.92,.34,'#3e6c89');
        for(const[v,a,b]of[[1.47,.36,.66],[1.55,.62,1.0],[1.63,.3,.56],[1.68,.8,1.1]])lineU(g,v,a,b,'#6a9bb8');
        lineU(g,1.39,.25,1.17,'#2b4f66');lineV(g,.25,1.39,1.73,'#2b4f66');
        shadow(g,[['b',.14,.14,1.48,.32,50],['b',.14,.46,1.46,.64,10],['b',.6,.5,.56,.56,32]]);
        // 辦公板樓（後）：玻璃帷幕＋白色樓板帶＋豎向遮陽鰭；東側實牆掛市徽
        S.o(1.0,(g,n)=>{const u0=.14,v0=.14,du=1.48,dv=.32,h=50,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,'#7aa3bd','#4f7690');
          T.curtain(g,n,'L',v1,u0,u1,0,h-4,{pitch:4,fh:8,lit:.42,seed:4244,gl:'#7aa3bd',mul:'#dfe6ea'});
          for(let z=8;z<h-4;z+=8)faceL(g,v1,u0,u1,z-1,z+1,WH);
          for(let t=u0+.12;t<u1-.05;t+=.12){faceL(g,v1+.012,t,t+1/32,1,h-4,'#fbfcfc');faceL(g,v1+.012,t+1/32,t+2/32,1,h-4,'#c7ced2');}
          faceL(g,v1,u0,u1,h-4,h,WH);
          faceR(g,u1,v0,v1,0,h,'#c9cdcf');faceR(g,u1,v0,v1,h-4,h,SH(WHD,6));
          for(let z=8;z<h-12;z+=8){faceR(g,u1,v0+.04,v0+.1,z-5,z-1,'#3f5f78');faceR(g,u1,v1-.1,v1-.04,z-5,z-1,'#3f5f78');
            if(n){if(hsh(4245,z,1)<.6)faceR(n,u1,v0+.04,v0+.1,z-5,z-1,T.LIT2);if(hsh(4245,z,2)<.6)faceR(n,u1,v1-.1,v1-.04,z-5,z-1,T.LIT2);}}
          // 市徽（藍底金邊圓章）
          const vm=(v0+v1)/2;T.clockF(g,null,'R',u1,vm,h-12,4,{face:'#2f5f96',rim:'#c9a64a',hand:'#f2d27a',tick:'#2f5f96'});
          T.flatTop(g,u0,v0,du,dv,h,'#c9cac5',{cap:WH});
          boxZ(g,.9,.2,.44,.2,h,6,'#c3c6c7','#d9dbdc','#9da1a3');for(let t=.94;t<1.32;t+=.04)faceL(g,.4,t,t+1/32,h+1,h+5,'#8d9193');
          const an=P(.4,.3,h);RC(g,an[0],an[1]-12,1,12,'#8d9193');RC(g,an[0],an[1]-13,1,1,'#d0423a');if(n)RC(n,an[0],an[1]-13,1,1,'#ff5a46');});
        // 一層玻璃基座＋屋頂花園
        S.o(1.1,(g,n)=>{const u0=.14,v0=.46,du=1.46,dv=.64,h=10,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,'#86abc3','#557a92');
          T.curtain(g,n,'L',v1,u0,u1,0,h-2,{pitch:5,fh:8,lit:.85,seed:4246});
          T.curtain(g,n,'R',u1,v0,v1,0,h-2,{pitch:5,fh:8,lit:.8,seed:4247});
          faceL(g,v1,u0,u1,h-2,h,WH);faceR(g,u1,v0,v1,h-2,h,WHD);
          flat(g,u0,v0,du,dv,WH,h);flat(g,u0+.04,v0+.04,du-.08,dv-.08,'#7d9a52',h);
          for(let i=0;i<60;i++){const u=u0+.06+hsh(4248,i,1)*(du-.12),v=v0+.06+hsh(4248,i,2)*(dv-.12),p=P(u,v,h);RC(g,p[0],p[1],1,1,hsh(4248,i,3)<.5?'#96b565':'#6a8646');}
          flat(g,.2,.98,1.34,.08,'#d4d2cb',h);
          for(const[u,v]of[[.3,.62],[1.42,.64],[1.42,.92]]){const p=P(u,v,h);ell(g,p[0],p[1]-2,2,2,'#4f7f35');RC(g,p[0]-1,p[1]-3,1,1,'#8cc063');}});
        // 玻璃穹頂議事廳：混凝土鼓座（白色簷環）＋格構玻璃穹頂（經線 16、緯線 4）；夜間整座透光
        S.o(1.3,(g,n)=>{const uc=.87,vc=.78,z=10;
          T.cyl(g,null,uc,vc,.3,z,5,[WH,'#e3e5e4',CON,CONd,'#8a8e90'],{cap:WH});
          T.cyl(g,null,uc,vc,.3,z+2,1,['#3f5f78','#3f5f78','#34506a','#2b4458','#233a4c']);
          T.dome(g,uc,vc,.285,z+5,15,GLS,{ribs:12,rings:3,ribT:FR,n,glow:'rgba(255,232,170,.34)',glow2:'rgba(255,214,140,.2)'});
          const ap=P(uc,vc,z+20);RC(g,ap[0]-1,ap[1]-1,3,1,WH);RC(g,ap[0],ap[1]-3,1,2,'#c9ced1');});
        // 入口雨遮（薄板懸挑＋細柱）
        S.o(2.2,(g,n)=>{for(const u of[.52,.98])boxZ(g,u-.015,1.32,.025,.025,0,9,null,WH,WHD);
          boxZ(g,.44,1.1,.62,.24,9,2,'#f7f7f4','#e6e6e2','#a9acae');
          faceL(g,1.1,.58,.9,0,8,'#26343e');faceL(g,1.1,.74,.745,0,8,'#9aa7ae');if(n)faceL(n,1.1,.58,.9,0,8,T.LIT);
          if(n){const p=P(.75,1.28,8);RC(n,p[0]-4,p[1],9,1,'#ffe6a0');}});
        // 噴泉列（水池中）
        S.t(3.0,(g)=>{for(let i=0;i<5;i++){const p=P(.36+i*.18,1.56);RC(g,p[0],p[1]-6,1,6,'#d8eef8');RC(g,p[0]-1,p[1]-3,1,3,'#b8dcee');RC(g,p[0]+1,p[1]-3,1,3,'#b8dcee');RC(g,p[0]-1,p[1],3,1,'#9fd0e6');}});
        // 右側：方格樹陣（樹池）、長椅、單車架
        for(const[u,v]of[[1.5,1.44],[1.8,1.44],[1.8,1.08]]){S.o(u+v,(g)=>{boxZ(g,u-.06,v-.06,.12,.12,0,2,'#d8d6ce','#cfcdc4','#9c9a92');flat(g,u-.045,v-.045,.09,.09,'#5a4a3a',2);});T.tree(S,u,v,1.0,(u*10|0)%2?2:0,u+v+.05);}
        T.bench(S,1.56,1.7,true);T.bench(S,.4,1.86,true);T.bench(S,.9,1.86,true);
        S.o(3.4,(g)=>{boxZ(g,1.36,1.84,.5,.08,0,3,'#cfcdc4','#d8d6ce','#9c9a92');flat(g,1.38,1.855,.46,.05,'#4f7f35',3);
          for(let i=0;i<9;i++){const p=P(1.4+i*.05,1.88,3);RC(g,p[0],p[1]-1,1,1,i%3?'#78a84c':'#e0b24a');}});
        T.bikes(S,1.68,.7,.24,false,2.5,4250);
        T.lamp(S,1.9,1.9,15,null,'m');T.lamp(S,.18,1.3,15,null,'m');T.lamp(S,1.26,1.9,15,null,'m');T.lamp(S,1.62,1.2,15,null,'m');
        // 東角旗列：前兩杆靜態、最後一杆 flagAt（桿頂上方留空）
        T.sflag(S,1.86,.62,16,2.9,['#c0392b','#f4f1e8','#c0392b']);
        T.sflag(S,1.87,.36,16,2.4,['#2f5fa0','#f4f1e8','#2f5fa0']);
        const fa=T.flagpole(S,1.88,.1,10,2.2);
        T.crowd(S,3.3,[[.6,1.3,'#2a2d31'],[.74,1.36,'#c24a3a',{dress:1}],[.9,1.3,'#2f5f96'],[.5,1.84,'#e8c23a'],[1.12,1.84,'#3f7f4a'],[1.26,1.46,'#f4f4ef'],[1.6,1.9,'#8a5bb0'],[.16,1.6,'#2a2d31'],[1.62,.9,'#2f5f96']]);
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_h k42',e);errs.push('k42:'+(e&&e.stack||e));}

  // ================= k43 法院（2×2）=================
  try{
    build(43,{W:136,H:150,AX:68,AY:148,SZ:2},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD;
      return [
      // ---------- v0 白石古典：通面寬台基上的神殿式正樓（六柱門廊、三角山牆＋天平浮雕、山牆頂鍍金正義女神像），左右兩座平頂翼樓（瓶飾欄杆）；
      //      通寬大台階＋兩側頰牆青銅燈座，前庭石板與古典燈，左草坪柏樹對、長椅與旗桿（西角），右草坪花帶矮籬
      //      （接手修訂：前庭大型正義女神像與頰牆坐像在 1× 下糊成白塊，改為山牆頂鍍金正義女神像） ----------
      (g,ng,S)=>{
        const MB='#eeebe3',MBD='#b5b0a4',CR='#fbfaf6',ZB=5;
        const C={wl:MB,wr:MBD,bl:'#d9d4c8',br:'#9e998e',cor:CR,cs:'#e6e2d8',sill:'#f7f5f0',sillR:'#c3beb2',gl:GL,gd:GD};
        pave(g,'g',0,0,2,2,4301);
        pave(g,'st',.06,.14,1.88,1.36,4302);
        pave(g,'st',.44,1.44,1.12,.54,4303);
        paint(g,(u,v)=>{if(u<.46||u>1.54||v<1.76||v>1.84)return null;return '#bdb6a6';});
        T.flowers(g,1.6,1.5,.3,.06,4304,['#c8566a','#f0e6d8','#e0b24a']);T.flowers(g,1.6,1.66,.06,.28,4305,['#c8566a','#f0e6d8']);
        shadow(g,[['b',.08,.2,1.84,1.24,ZB],['b',.12,.3,.38,.9,ZB+22],['b',.5,.2,1.0,1.24,ZB+46],['b',1.5,.3,.38,.9,ZB+22]]);
        // 台基
        S.o(.5,(g)=>{boxZ(g,.08,.2,1.84,1.24,0,ZB,'#e9e6de','#dcd8ce','#9e998e');
          faceL(g,1.44,.08,1.92,ZB-1,ZB,'#f7f5f0');faceR(g,1.92,.2,1.44,ZB-1,ZB,'#b0ab9f');faceL(g,1.44,.08,1.92,1,1.8,'#c8c3b7');faceR(g,1.92,.2,1.44,1,1.8,'#8a857a');});
        const wing=(u0,seed,right)=>(g,n)=>{const v0=.3,du=.38,dv=.9,h=22,v1=v0+dv,u1=u0+du;
          T.mass(g,n,u0,v0,du,dv,h,C,{zb:ZB,fl:2,z0:3,fh:10,w:3,wh:[7,6],pitch:5.4,seed,lit:.62,hood:1,noR:!right});
          T.flatTop(g,u0,v0,du,dv,ZB+h,'#c4c1b9',{cap:CR});
          T.balL(g,v1,u0,u1,ZB+h,CR);if(right)T.balR(g,u1,v0,v1,ZB+h,SH(CR,-44));};
        S.o(1.0,wing(.12,4311,false));
        // 正樓牆體：+u 側牆（翼樓頂上方露出）＋門廊內深色後牆、青銅大門、二樓窗
        S.o(1.05,(g,n)=>{const u0=.52,u1=1.48,v0=.22,vw=1.14;
          boxZ(g,u0,v0,u1-u0,vw-v0,ZB,28,null,MB,MBD);
          faceL(g,vw,u0,u1,ZB,ZB+28,'#8c877d');
          faceL(g,vw,.9,1.1,ZB,ZB+15,'#a39d91');faceL(g,vw,.93,1.07,ZB,ZB+13,'#6d5433');faceL(g,vw,.999,1.001,ZB,ZB+13,'#4a3822');
          for(const t of[.95,1.05])faceL(g,vw,t-.01,t+.01,ZB+2,ZB+11,'#8a6c42');
          if(n)faceL(n,vw,.93,1.07,ZB+11,ZB+13,'#ffe0a0');
          for(const t of[.66,.8,1.2,1.34]){T.win1(g,n,'L',vw,t,ZB+3,3,9,'#34506a',{wall:'#8c877d',sill:'#a39d91',lit:.6},4312,rnd(t*20));T.win1(g,n,'L',vw,t,ZB+17,3,7,'#34506a',{wall:'#8c877d',sill:'#a39d91',lit:.5},4313,rnd(t*20));}});
        S.o(1.2,wing(1.5,4314,true));
        // 門廊：六柱＋右側兩柱、楣（三段＋刻字點）、低坡山牆屋頂（整座正樓）、山牆浮雕天平、頂端鍍金正義女神
        S.o(2.3,(g,n)=>{const a=.5,b=1.5,v0=.2,vf=1.44,zE=ZB+28;
          T.colsR(g,1.48,1.18,1.4,2,ZB,28,'#fbfaf6','#c2bdb1',.05);
          T.colsL(g,1.42,.53,1.47,6,ZB,28,'#fbfaf6','#c2bdb1',.05);
          boxZ(g,a,v0,b-a,vf-v0,zE,4,CR,'#f1eee7',MBD);
          faceL(g,vf,a,b,zE,zE+1,'#d8d3c7');for(let t=a+.05,k=0;t<b-.04;t+=2/32,k++)if(k%5!==4)faceL(g,vf,t,t+1/32,zE+1.5,zE+2.5,'#a39d8f');
          faceL(g,vf,a,b,zE+3,zE+4,'#ffffff');faceR(g,b,v0,vf,zE+3,zE+4,SH(MBD,14));
          const r=T.gableV(g,a,v0,b-a,vf-v0,zE+4,13,{rf:'#b7bcbd',rs:'#8d9396',wl:'#e2ded4',ov:.03,cs:2.2});
          const um=(a+b)/2,Lp=P(a-.03,vf+.03,zE+2.5),Rp=P(b+.03,vf+.03,zE+2.5),Ap=P(um,vf+.03,r.zt+1);
          BL(g,Lp,Ap,'#ffffff');BL(g,Ap,Rp,'#ffffff');BL(g,P(a,vf,zE+4),P(b,vf,zE+4),'#fbfaf6');
          BL(g,P(a+.08,vf,zE+5),P(um,vf,r.zt-2),'#bdb7aa');BL(g,P(um,vf,r.zt-2),P(b-.06,vf,zE+5),'#bdb7aa');
          T.pat(g,'L',vf,um-4.5/32,zE+5,T.SCALES,'#c9a23e');
          // 山牆頂：石台座＋鍍金正義女神像（高舉天平、垂劍）；兩端角飾
          RC(g,Ap[0]-2,Ap[1]-2,5,2,'#f4f1e9');RC(g,Ap[0]+1,Ap[1]-2,2,2,'#d8d3c7');
          T.justice(g,um,vf+.03,r.zt+3);
          for(const q of[Lp,Rp])RC(g,q[0]-1,q[1]-3,2,3,'#f4f1e9');
          if(n){const lp=P(1.0,1.3,zE-2);RC(n,lp[0]-1,lp[1],3,2,'#ffe6a0');}});
        // 通寬大台階＋頰牆坐像
        S.o(2.6,(g)=>{boxZ(g,.43,1.44,.07,.3,0,ZB+2,'#f4f2ec','#e2ded4','#a5a095');boxZ(g,1.5,1.44,.07,.3,0,ZB+2,'#f4f2ec','#e2ded4','#a5a095');
          T.stairsV(g,.5,1.5,1.44,1.76,ZB,5,['#f4f2ec','#c9c4b8','#a39e92']);});
        // 頰牆頂：青銅燈座（坐像已移除——在 1× 下糊成白塊）
        S.o(2.7,(g)=>{for(const u of[.465,1.535])boxZ(g,u-.025,1.5,.05,.05,ZB+2,2,'#8a7a5a','#6d5f44','#4c422f');});
        T.lamp(S,.465,1.525,11,2.72,'c',ZB+4);T.lamp(S,1.535,1.525,11,2.72,'c',ZB+4);
        T.lamp(S,.4,1.86,14,null,'c');T.lamp(S,1.6,1.86,14,null,'c');
        // 左草坪：矮籬、柏樹對、長椅＋旗桿（西角）；右草坪：矮籬＋長椅；東角樹
        T.hedge(S,.1,1.46,.3,.03,null,2);
        T.cypress(S,.3,1.58,12);T.cypress(S,.3,1.8,11);T.bench(S,.14,1.62,false);
        T.hedge(S,1.58,1.46,.34,.03,null,2);T.bench(S,1.72,1.84,true);T.cypress(S,1.88,1.5,13);
        for(const[u,v,k,s]of[[1.92,.16,0,1],[1.93,.6,2,.9],[.06,.9,0,.9]])T.tree(S,u,v,s,k);
        const fa=T.flagpole(S,.1,1.9,11,3.0);
        T.crowd(S,3.3,[[.7,1.54,'#2a2d31',{z:3}],[.78,1.62,'#3a3f4d',{z:2}],[1.08,1.5,'#2a2d31',{z:4}],[1.24,1.66,'#8a2f2a',{z:1}],[.9,1.86,'#2f5f96'],[1.3,1.9,'#2a2d31',{bag:'#6d5433'}],[1.7,1.64,'#f4f4ef']]);
        return{flagAt:fa};
      },
      // ---------- v1 紅磚聯邦式：草坪中央的方正兩層紅磚法院（白色隅石、白框窗、四坡石板瓦＋兩根煙囪），正中白色四柱山牆門廊（扇形氣窗），
      //      屋脊正中白色八角鐘亭（雙面鐘、百葉、銅綠小圓頂、風向標）；草坪十字步道、紀念方尖碑、右前白色八角音樂亭、老橡樹、長椅路燈，東角旗桿 ----------
      (g,ng,S)=>{
        const BR={wl:'#aa513b',wr:'#7c3629',bl:'#cfc9bb',br:'#948d80',cor:'#f3f0e8',cs:'#ece8de',sill:'#f3f0e8',sillR:'#b9b3a6',gl:'#3e5a72',gd:'#2f465a',q:'#efeae0',lin:'#f3f0e8',linR:'#bdb7aa'};
        const WT='#f4f1ea',WTD='#bdb7aa',SL='#5d6570',SLD='#454b55',CU=['#a6d6c2','#86bda8','#68a28d','#518873','#3d6b5b'];
        pave(g,'g',0,0,2,2,4321);
        pave(g,'c',.32,.24,1.36,1.02,4322);
        pave(g,'c',.92,1.26,.16,.72,4323);
        pave(g,'c',.08,1.64,1.84,.12,4324);
        T.flowers(g,.4,1.28,.4,.05,4325,['#c8566a','#f0e6d8','#e0b24a']);T.flowers(g,1.22,1.28,.4,.05,4326,['#c8566a','#f0e6d8','#e0b24a']);
        shadow(g,[['b',.38,.3,1.24,.9,40],['b',.8,1.2,.4,.22,34],['b',.9,.65,.2,.2,64]]);
        // 主樓
        S.o(1.0,(g,n)=>{const u0=.38,v0=.3,du=1.24,dv=.9,h=26,u1=u0+du,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,BR,{fl:2,z0:5,fh:10,w:3,wh:[7,6],pitch:7,seed:4327,lit:.35,pl:3,skipL:[[.78,1.22]],mul:'#dcd6ca'});
          const r=T.hipU(g,u0,v0,du,dv,h,14,{rf:SL,rs:SLD,ov:.04});
          // 兩端山面煙囪（磚＋石帽）
          for(const t of[.5,1.5]){boxZ(g,t-.03,.72,.06,.06,29,12,'#7a3a2c',BR.wl,BR.wr);boxZ(g,t-.04,.71,.08,.08,41,1.5,'#6c6f73','#e8e2d4','#a8a092');}});
        // 門廊（白色四柱、門廊內後牆、扇形氣窗大門）
        S.o(2.0,(g,n)=>{boxZ(g,.76,1.2,.48,.24,0,3,'#e6e2d8','#d6d1c5','#9e998e');
          faceL(g,1.2,.8,1.2,3,25,'#8e4533');
          faceL(g,1.2,.95,1.05,3,14,WT);faceL(g,1.2,.965,1.035,3,12,'#3b4a3a');faceL(g,1.2,.999,1.001,3,11,'#2a3529');
          for(let k=-2;k<=2;k++){const t=1.0+k/32;faceL(g,1.2,t,t+1/32,12,13+(2-Math.abs(k))*.6,'#9cc0d6');}
          if(n){faceL(n,1.2,.965,1.035,11,13,'#ffe0a0');}
          for(const t of[.88,1.12]){T.win1(g,n,'L',1.2,t,5,3,7,'#3e5a72',{frame:WT,lit:.5},4328,rnd(t*9));T.win1(g,n,'L',1.2,t,15,3,6,'#3e5a72',{frame:WT,lit:.4},4329,rnd(t*9));}
          const rr=T.porticoL(g,n,.8,1.2,1.2,1.42,3,22,4,10,{side:1,cw:.045,cl:'#fbfaf6',cr:'#c9c4b8',cor:'#f6f3ec',std:WTD,tym:'#efebe2',roof:SL,txt:'#c9c4b8'});
          // 山牆扇形窗
          const fc=(dt,z,c)=>faceL(g,rr.vp,rr.um+dt/32,rr.um+(dt+1)/32,rr.zb0+z,rr.zb0+z+1,c);
          for(let dt=-3;dt<=2;dt++)for(let z=1;z<=3;z++){if((dt+.5)*(dt+.5)/9+(z-1)*(z-1)/7>1)continue;fc(dt,z,z===1?'#e9e4d8':'#6f8ea6');}
          if(n)for(let dt=-2;dt<=1;dt++)fc(dt,2,'#ffe3a0');});
        S.o(2.4,(g)=>{T.stairsV(g,.8,1.2,1.44,1.58,3,3,['#ece8de','#c9c4b8','#a39e92']);});
        // 八角鐘亭
        S.o(1.3,(g,n)=>{const uc=1.0,vc=.75;
          // 方座：四角壁柱、正面鐘（金框白面）
          boxZ(g,uc-.11,vc-.11,.22,.22,36,9,null,WT,WTD);
          faceL(g,vc+.11,uc-.11,uc-.09,36,45,'#ffffff');faceL(g,vc+.11,uc+.09,uc+.11,36,45,'#dcd7cc');faceR(g,uc+.11,vc+.09,vc+.11,36,45,'#cfc9bb');
          T.clockF(g,n,'L',vc+.11,uc,40.5,3,{rim:'#c9a23e',face:'#fbfaf6',hand:'#2a2d31'});
          faceR(g,uc+.11,vc-.04,vc+.04,37.5,43,'#6f6a60');faceR(g,uc+.11,vc-.025,vc+.025,43,44,'#6f6a60');for(let z=38.5;z<43;z+=1.5)faceR(g,uc+.11,vc-.04,vc+.04,z,z+.6,'#c9c4b8');
          boxZ(g,uc-.13,vc-.13,.26,.26,45,1.5,'#f7f5f0',WT,WTD);
          // 八角鐘亭：拱形開口、簷環、銅綠小圓頂、風向標
          T.cyl(g,n,uc,vc,.08,46.5,7,[WT,'#e6e2d8','#cfc9bb','#b3ad9f','#9a9487'],{cap:WT,win:{n:3,z0:1,z1:6,w:1,arch:1,seed:4330,lit:.8,glass:'#2e3a44',gd:'#252f37'}});
          T.cyl(g,null,uc,vc,.09,53.5,1,[WT,WT,'#cfc9bb','#b3ad9f','#9a9487'],{cap:WT});
          T.dome(g,uc,vc,.085,54.5,5,CU);
          const ap=P(uc,vc,59.5);RC(g,ap[0],ap[1]-5,1,5,'#3a3d40');RC(g,ap[0]-2,ap[1]-4,4,1,'#3a3d40');RC(g,ap[0]+2,ap[1]-5,1,2,'#3a3d40');RC(g,ap[0],ap[1]-6,1,1,'#c9a23e');});
        // 草坪：老橡樹、紀念方尖碑、長椅、路燈
        for(const[u,v,k,s]of[[.16,.5,0,1.15],[.16,1.1,2,1.1],[.3,1.86,0,1.1],[1.86,1.04,2,1.05],[1.88,.52,0,1],[1.52,1.88,1,.95]])T.tree(S,u,v,s,k);
        // 右前草坪：白色八角音樂亭（石台＋六柱＋欄杆帶＋石板瓦尖頂＋金頂飾）——填掉右前空草地
        T.SHD.push(['c',1.7,1.44,6,14]);
        S.o(2.8,(g)=>{const uc=1.7,vc=1.44,STN5=['#efebe2','#e0dbd0','#c9c4b8','#b3ad9f','#9a9487'];
          T.cyl(g,null,uc,vc,.13,0,2,STN5,{cap:'#f1eee6'});
          // 亭內＝屋簷下的陰影（深色鼓面），前面五根白柱＋低欄杆 ⇒ 讀成「開敞的亭」而不是實心圓塔
          T.cyl(g,null,uc,vc,.1,2,7,['#4e524b','#484c45','#42463f','#3c4039','#363a33']);
          {const c2=P(uc,vc,2),Rx=.1*32*Math.SQRT2,Ry=Rx/2;for(const deg of[-78,-38,0,38,78]){const th=deg*Math.PI/180,x=Math.round(c2[0]+Rx*Math.sin(th)-.5),yb=Math.round(c2[1]+Ry*Math.cos(th));
            RC(g,x,yb-7,1,7,deg<0?'#fbfaf6':deg===0?'#e6e2d8':'#c9c4b8');}}
          T.cyl(g,null,uc,vc,.125,9,1,[WT,WT,'#dcd7cc','#b3ad9f','#9a9487'],{cap:WT});
          const c=P(uc,vc,10),cx=Math.round(c[0]),cy=Math.round(c[1]),rx=5;
          ell(g,cx,cy,rx,2,SLD);fp(g,[[cx-rx,cy],[cx+rx+1,cy],[cx+.5,cy-7]],SLD);fp(g,[[cx-rx,cy],[cx+.5,cy],[cx+.5,cy-7]],SL);
          RC(g,cx,cy-9,1,2,'#c9a23e');});
        S.o(2.75,(g)=>{const u=.46,v=1.7;boxZ(g,u-.07,v-.07,.14,.14,0,2,'#cfc9bb','#c2bcae','#8e887c');boxZ(g,u-.045,v-.045,.09,.09,2,3,'#e6e2d8','#d8d3c7','#a39e92');
          boxZ(g,u-.025,v-.025,.05,.05,5,13,null,'#ece8de','#aaa497');const ap=P(u,v,18);const b0=P(u-.025,v+.025,18),b1=P(u+.025,v+.025,18),b2=P(u+.025,v-.025,18);fp(g,[b0,b1,ap],'#f4f1ea');fp(g,[b1,b2,ap],'#b9b3a6');RC(g,ap[0],ap[1]-2,1,2,'#ece8de');});
        T.bench(S,.64,1.6,true);T.bench(S,1.26,1.6,true);T.bench(S,1.12,1.8,false);
        T.lamp(S,.88,1.9,13,null,'c');T.lamp(S,1.12,1.64,13,null,'c');T.lamp(S,.3,1.62,13,null,'c');T.lamp(S,1.9,1.3,13,null,'c');
        const fa=T.flagpole(S,1.92,.12,11,2.2);
        T.crowd(S,3.3,[[.98,1.5,'#2a2d31',{z:1}],[1.04,1.72,'#3a3f4d'],[.96,1.9,'#8a2f2a'],[.6,1.7,'#2f5f96'],[1.4,1.7,'#f4f4ef'],[1.6,1.7,'#2a2d31',{bag:'#6d5433'}]]);
        return{flagAt:fa};
      },
      // ---------- v2 現代混凝土：石材平台上的清水混凝土量體——上段懸挑盒（直條深窗三層、正中青銅天平徽記、簷帶銅字 COURTHOUSE），
      //      下段內縮玻璃大廳＋六根方柱抽象柱廊；右後高起的樓梯核心筒（豎向玻璃縫）；寬淺台階、防衝撞石墩列、方形樹池，右側停車帶，西角旗桿 ----------
      (g,ng,S)=>{
        const CN='#cbc7bf',CND='#8f8b84',CNT='#d8d5ce',BZ='#9a7440',BZL='#c9a064',SLT='#2f3b44';
        pave(g,'g',0,0,2,2,4341);
        pave(g,'st',.06,.1,1.6,1.88,4342);
        flat(g,1.68,.64,.28,1.32,'#6f6d69');for(let v=.9;v<1.9;v+=.26)lineU(g,v,1.7,1.94,'#e8e4da');lineV(g,1.68,.64,1.96,'#b9b5ad');
        paint(g,(u,v)=>{if(u>1.64||v<1.36||v>1.4)return null;return '#b1aa9a';});
        shadow(g,[['b',.12,.14,1.54,1.0,3],['b',.16,.16,1.48,.94,47],['b',1.64,.16,.26,.44,58]]);
        // 石材平台
        S.o(.5,(g)=>{boxZ(g,.12,.14,1.54,1.0,0,3,'#dedbd3','#d2cec5','#98948c');faceL(g,1.14,.12,1.66,2,3,'#ecE9e2'.toLowerCase());});
        // 樓梯核心筒（右後，較高）
        S.o(.9,(g,n)=>{const u0=1.64,v0=.16,du=.26,dv=.44,h=58;boxZ(g,u0,v0,du,dv,0,h,CNT,CN,CND);
          for(let z=4;z<h;z+=4){faceL(g,v0+dv,u0,u0+du,z,z+.6,SH(CN,-8));faceR(g,u0+du,v0,v0+dv,z,z+.6,SH(CND,-8));}
          faceL(g,v0+dv,u0+.11,u0+.15,6,h-4,SLT);faceR(g,u0+du,v0+.18,v0+.24,6,h-4,'#28323a');
          if(n){faceL(n,v0+dv,u0+.11,u0+.15,6,h-4,'rgba(255,227,160,.8)');}
          T.flatTop(g,u0,v0,du,dv,h,'#b9b6af',{cap:CNT});});
        // 下段內縮玻璃大廳
        S.o(1.0,(g,n)=>{const u0=.26,v0=.24,du=1.3,dv=.66,z0=3,h=12;boxZ(g,u0,v0,du,dv,z0,h,null,'#6f93aa','#4a6d84');
          T.curtain(g,n,'L',v0+dv,u0,u0+du,z0,z0+h,{pitch:5,fh:12,lit:.9,seed:4344,gl:'#6f93aa',mul:'#c9ced1'});
          T.curtain(g,n,'R',u0+du,v0,v0+dv,z0,z0+h,{pitch:5,fh:12,lit:.85,seed:4345,gl:'#4a6d84',mul:'#9aa3a8'});
          faceL(g,v0+dv,.82,1.0,z0,z0+10,'#26343e');faceL(g,v0+dv,.909,.912,z0,z0+10,'#9aa7ae');if(n)faceL(n,v0+dv,.82,1.0,z0,z0+10,T.LIT);
          faceL(g,v0+dv,u0,u0+du,z0+h-3,z0+h,'#3a4f5e');faceR(g,u0+du,v0,v0+dv,z0+h-3,z0+h,'#2c3d4a');});
        // 上段懸挑混凝土盒：簷帶銅字＋三層直條深窗（中央留天平徽記）
        S.o(1.1,(g,n)=>{const u0=.16,v0=.16,du=1.48,dv=.94,z0=15,h=32,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,z0,h,null,CN,CND);
          faceL(g,v1,u0,u1,z0,z0+1,SH(CN,-26));faceR(g,u1,v0,v1,z0,z0+1,SH(CND,-20));
          let t=.9-13.5/32;for(const ch of'JUSTICE'){T.glyph(g,'L',v1,t,z0+3,ch,BZ);t+=4/32;}
          const skip=[[.78,1.02]];
          for(let f=0;f<3;f++){const za=z0+10+f*7,zb=za+5;
            for(let tt=u0+.06;tt<u1-.05;tt+=5/32){if(skip.some(s=>tt>s[0]&&tt<s[1]))continue;faceL(g,v1,tt,tt+2/32,za,zb,SLT);faceL(g,v1,tt,tt+1/32,zb-1,zb,'#5c7384');
              if(n&&hsh(4346,rnd(tt*40),f)<.5)faceL(n,v1,tt,tt+2/32,za,zb,T.LIT);}
            for(let tt=v0+.06;tt<v1-.05;tt+=5/32){faceR(g,u1,tt,tt+2/32,za,zb,'#28323a');if(n&&hsh(4347,rnd(tt*40),f)<.45)faceR(n,u1,tt,tt+2/32,za,zb,T.LIT2);}}
          for(let z=z0+9;z<z0+h-2;z+=7){faceL(g,v1,u0,u1,z-.4,z+.3,SH(CN,-10));faceR(g,u1,v0,v1,z-.4,z+.3,SH(CND,-10));}
          faceL(g,v1,.8,1.0,z0+11,z0+26,SH(CN,-14));T.pat(g,'L',v1,.9-4.5/32,z0+15,T.SCALES,BZL);T.pat(g,'L',v1,.9-4.5/32+1/32,z0+14,['.........'],BZ);
          faceL(g,v1,u0,u1,z0+h-2,z0+h,CNT);faceR(g,u1,v0,v1,z0+h-2,z0+h,SH(CND,12));
          T.flatTop(g,u0,v0,du,dv,z0+h,'#b3afa7',{cap:CNT});
          boxZ(g,.5,.3,.34,.24,z0+h,5,'#bdbab3','#cfccc5','#96928b');for(let tt=.53;tt<.82;tt+=.04)faceL(g,.54,tt,tt+1/32,z0+h+1,z0+h+4,'#8d8a84');});
        // 抽象柱廊：前排六根、右側兩根方柱（撐起懸挑）
        S.o(2.0,(g)=>{for(let i=0;i<6;i++){const t=.24+i*.24;boxZ(g,t-.025,1.04,.05,.05,3,12,null,'#e2dfd8','#a29e96');faceL(g,1.09,t-.025,t-.025+1/32,3,15,'#f2f0ec');}
          for(const v of[.46,.8])boxZ(g,1.58,v-.025,.05,.05,3,12,null,'#e2dfd8','#a29e96');});
        // 寬淺台階
        S.o(2.4,(g)=>{T.stairsV(g,.24,1.5,1.14,1.32,3,3,['#e4e1da','#c3bfb6','#a19d95']);});
        // 防衝撞石墩列、樹池、長椅
        S.t(2.9,(g)=>{for(let u=.22;u<1.56;u+=.12){const p=P(u,1.46),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-3,3,3,'#bcb8b0');RC(g,x-1,y-3,1,3,'#dedad3');RC(g,x+1,y-3,1,3,'#8f8b84');RC(g,x-1,y-4,3,1,'#e6e3dc');}});
        for(const[u,v]of[[.32,1.72],[1.36,1.72]]){S.o(u+v,(g)=>{boxZ(g,u-.1,v-.1,.2,.2,0,3,'#d0cdc6','#c4c1ba','#8f8b84');flat(g,u-.08,v-.08,.16,.16,'#4f7f35',3);});T.tree(S,u,v,1.1,u<1?0:2,u+v+.05);}
        T.bench(S,.66,1.8,true);T.bench(S,1.0,1.8,true);
        T.lamp(S,.16,1.36,15,null,'m');T.lamp(S,1.6,1.36,15,null,'m');T.lamp(S,1.64,1.9,15,null,'m');
        // 停車帶
        T.car(S,1.7,.72,true,'#e8e4da');T.car(S,1.7,1.24,true,'#2f5f96');T.car(S,1.7,1.5,true,'#3a3f4d');
        const fa=T.flagpole(S,.1,1.88,11,3.0);
        T.crowd(S,3.3,[[.6,1.24,'#2a2d31',{z:2}],[.74,1.2,'#3a3f4d',{z:3}],[1.1,1.26,'#8a2f2a',{z:2}],[.5,1.6,'#2f5f96'],[.86,1.66,'#2a2d31',{bag:'#6d5433'}],[1.2,1.9,'#f4f4ef'],[1.84,1.1,'#2a2d31']]);
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_h k43',e);errs.push('k43:'+(e&&e.stack||e));}

  window.__civ_h_chk=chk;
  if(errs.length)window.__civ_h_errs=errs;
});
