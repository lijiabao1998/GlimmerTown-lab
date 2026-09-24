// T613 civ_d：k32 大學（3×3，208×220，錨 104,218）＋ k113 大學城（4×4，272×280，錨 136,278）實驗線重畫。
// 分層合成（沿用 civ_c／logi_b）：立體主體各自一層（二值化＋深色外框）；旗桿、欄杆、人走不描邊細線層；
// 地面（草坪、石板、步道）直接畫在地面層，逐像素取樣不越出佔地菱形。夜光按層遮擋，只亮窗、門燈、路燈、鐘面。
// 零亂數：只用 K.hsh。光從左：+v 面亮、+u 面暗；落影向右。
// 旗桿：繪製端 SPR.flag（14×22、錨 7,22）自帶 20px 桿身（flagAt.x-1..flagAt.x）＋旗面。這裡只畫 10px 下段桿身＋底座，
// 放在地塊左右角（上方是透明背景），flagAt＝本段桿頂；收尾檢查 flagAt 上方 3px 內必須透明。
(window.__variants574=window.__variants574||[]).push(function civ_d(A){
  // 注入測試時本批次排在內嵌 b01…之前 ⇒ 不是最後一棒就把本體排到隊尾再跑（同 civ_c／bay_a）
  const QL=window.__variants574||[];
  if(!civ_d.__late&&QL.indexOf(civ_d)>=0&&QL.indexOf(civ_d)<QL.length-1){civ_d.__late=1;QL.push(function civ_d_late(A2){civ_d(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};            // 迭代用：{32:[1,2,0]}；定稿必須是 {}
  const errs=[],chk=[];

  // ================= 共用工具（沿用 civ_c 的像素精準圖元）=================
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
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h]／['c',u,v,r,h]
    const shadow=(g,list,a=.24)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],T=[P(u0+k,v0-k*.45),P(u1+k,v0-k*.45),P(u1+k,v1-k*.45),P(u0+k,v1-k*.45)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,r,h]=s,p=P(u+h/150,v-h/340);ell(sx,p[0]+1,p[1],Math.max(2,rnd(r*1.1)),Math.max(1,rnd(r*.5)),C);}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 高度場（弧形屋頂）：逐斜列由後往前；背光面（gu+gv≥32）不畫
    const terrain=(g,u0,v0,u1,v1,st,zf,cf)=>{const nu=rnd((u1-u0)/st),nv=rnd((v1-v0)/st),Z=[];
      for(let i=0;i<=nu;i++){const row=new Float32Array(nv+1);for(let j=0;j<=nv;j++)row[j]=zf(u0+i*st,v0+j*st);Z.push(row);}
      for(let s=0;s<=nu+nv-2;s++)for(let i=Math.max(0,s-nv+1);i<=Math.min(nu-1,s);i++){const j=s-i,u=u0+i*st,v=v0+j*st;
        const a=Z[i][j],b=Z[i+1][j],c=Z[i+1][j+1],d=Z[i][j+1];const gu=(b+c-a-d)/(2*st),gv=(d+c-a-b)/(2*st);
        const col=cf(u+st/2,v+st/2,(a+b+c+d)/4,gu,gv,i,j);if(col)fp(g,[P(u,v,a),P(u+st,v,b),P(u+st,v+st,c),P(u,v+st,d)],col);}};
    // 逐像素地面著色：只取像素中心落在佔地菱形內的像素（保證不越出下緣）
    const paint=(g,fn)=>{for(let y=0;y<H;y++){let run=null,x0=0;for(let x=0;x<=W;x++){let c=null;
      if(x<W){const a=(x+.5-AX)/32,b=(y+.5-TOPY)/16,u=(a+b)/2,v=(b-a)/2;if(u>0&&v>0&&u<SZ&&v<SZ)c=fn(u,v,x,y)||null;}
      if(c!==run){if(run){g.fillStyle=run;g.fillRect(x0,y,x-x0,1);}run=c;x0=x;}}}};
    const MATS={
      g:{t:['#78a256','#739c51','#7da85b'],s:.125,p:.7},                       // 草
      c:{t:['#d3d0c6','#cdcac0','#d8d5cb'],j:'#bfbcb2',js:.25,s:.125,p:.65},   // 淺色混凝土磚
      a:{t:['#6f6d69','#6c6a66','#72706b'],s:.125,p:.75},                      // 瀝青
      k:{t:['#cdbf9c','#c7b995','#d2c5a3'],s:.0625,p:.65},                     // 碎石
      st:{t:['#c9c1ad','#c2baa6','#cfc7b4'],j:'#b0a893',js:.125,s:.125,p:.6},  // 石板
      bp:{t:['#bf9277','#b98c72','#c4977c'],j:'#ab7f66',js:.125,s:.125,p:.6},  // 磚鋪面
      gr:{t:['#6d9a4e','#69954b','#72a053'],s:.125,p:.75},                     // 深一階草
      gv:{t:['#d8cba6','#d2c5a0','#ddd0ab'],s:.0625,p:.6},                     // 黃砂礫步道
    };
    const pave=(g,m,u0,v0,du,dv,seed,js)=>{const M=MATS[m],s=M.s;flat(g,u0,v0,du,dv,M.t[0]);
      const ni=Math.ceil(du/s-1e-6),nj=Math.ceil(dv/s-1e-6);
      for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const q=hsh(seed,i+rnd(u0*16)*7,j+rnd(v0*16)*5);if(q<M.p)continue;
        const a=u0+i*s,b=v0+j*s;flat(g,a,b,Math.min(s,u0+du-a),Math.min(s,v0+dv-b),q<M.p+(1-M.p)*.55?M.t[1]:M.t[2]);}
      const J=js||M.js;if(M.j&&J){for(let a=u0+J;a<u0+du-1e-6;a+=J)BL(g,P(a,v0+.01),P(a,v0+dv-.01),M.j);for(let b=v0+J;b<v0+dv-1e-6;b+=J)BL(g,P(u0+.01,b),P(u0+du-.01,b),M.j);}};
    return Object.assign({},K,{RC,BL,fp,Q,flat,boxZ,faceL,faceR,lineU,lineV,ell,scene,shadow,terrain,paint,pave});
  };

  // ================= 大學元件 =================
  const KIT=(L)=>{
    const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,ell,paint,terrain}=L;
    const LIT='#ffe3a0',LIT2='#f3d68e',GL='#4a6d8c',GD='#34506a',GH='#93b5cc';
    // ---- 窗 ----
    // 單窗：side 'L'＝+v 面（fx=v）、'R'＝+u 面（fx=u）；t 中心、z 底、w 寬 px、h 高 px
    // o.st：'rect'｜'arch'（圓拱）｜'pt'（尖拱）；o.wall 牆色（拱角回填）；o.sill 窗台；o.frame 窗框；o.hi 頂列高光；o.mul 中梃；o.tr 橫檔高度；o.lit 夜亮機率
    const win1=(g,n,side,fx,t,z,w,h,glass,o,seed,i)=>{const F=side==='L'?faceL:faceR,a=t-w/64,b=t+w/64;
      if(o.frame)F(g,fx,a-1/32,b+1/32,z-1,z+h+1,o.frame);else if(o.sill)F(g,fx,a-1/32,b+1/32,z-1,z,o.sill);
      F(g,fx,a,b,z,z+h,glass);
      if(o.hi)F(g,fx,a,b,z+h-2,z+h-1,o.hi);
      if(o.mul)F(g,fx,t-1/64,t+1/64,z,z+h,o.mul);
      if(o.tr!=null)F(g,fx,a,b,z+o.tr,z+o.tr+1,o.trc||o.mul||o.frame||o.sill);
      const arc=o.st==='arch'||o.st==='pt';
      if(arc){F(g,fx,a,a+1/32,z+h-1,z+h,o.wall);F(g,fx,b-1/32,b,z+h-1,z+h,o.wall);
        if(o.st==='pt'&&w>=4){F(g,fx,a,a+1/32,z+h-2,z+h-1,o.wall);F(g,fx,b-1/32,b,z+h-2,z+h-1,o.wall);F(g,fx,a+1/32,a+2/32,z+h-1,z+h,o.wall);F(g,fx,b-2/32,b-1/32,z+h-1,z+h,o.wall);}
        if(o.hood)F(g,fx,t-1/64,t+1/64,z+h,z+h+1,o.hood);}
      if(n&&hsh(seed,i,rnd(z*7+t*40))<(o.lit!=null?o.lit:.5))F(n,fx,a,b,z,z+h-(arc?1:0),side==='L'?LIT:LIT2);};
    // 整列窗：[a,b] 以 pitch px 均分，跳過 skip 區段（t 落在區段內）
    const winRow=(g,n,side,fx,a,b,z,w,h,pitch,glass,o={},skip=[])=>{const len=(b-a)*32,cnt=Math.max(1,Math.floor(len/pitch)),st=(b-a)/cnt;
      for(let i=0;i<cnt;i++){const t=a+st*(i+.5);if(skip.some(s=>t>s[0]&&t<s[1]))continue;win1(g,n,side,fx,t,z,w,h,glass,o,o.seed||7,i);}};
    // 樓體：牆面＋勒腳＋簷口＋腰線＋各層窗列＋隅石（不含屋頂）
    // C:{wl,wr,bl,br,cor,cs,sill,sillR,frame,q,gl,gd}；o:{fl,z0,fh,w,wh,pitch,st,skipL,skipR,skipL0,skipR0,noL,noR,seed,lit,mul,hood}
    const mass=(g,n,u0,v0,du,dv,h,C,o={})=>{const u1=u0+du,v1=v0+dv;
      boxZ(g,u0,v0,du,dv,0,h,null,C.wl,C.wr);
      const pl=o.pl||2;faceL(g,v1,u0,u1,0,pl,C.bl||SH(C.wl,-36));faceR(g,u1,v0,v1,0,pl,C.br||SH(C.wr,-30));
      if(C.q){let k=0;for(let z=pl;z<h-2.5;z+=3,k++){const wq=(k%2?2:3)/32;faceL(g,v1,u0,u0+wq,z,z+2,C.q);faceL(g,v1,u1-wq,u1,z,z+2,C.q);faceR(g,u1,v1-wq,v1,z,z+2,SH(C.q,-34));faceR(g,u1,v0,v0+wq,z,z+2,SH(C.q,-34));}}
      const fl=o.fl||0,fh=o.fh||9,z0=o.z0!=null?o.z0:3,m=o.m!=null?o.m:.04;
      for(let f=0;f<fl;f++){const z=z0+f*fh;
        if(C.cs&&f>0){faceL(g,v1,u0,u1,z-2.5,z-1.5,C.cs);faceR(g,u1,v0,v1,z-2.5,z-1.5,SH(C.cs,-38));}
        const wo={sill:C.sill,hi:o.hi===undefined?GH:o.hi,wall:C.wl,st:o.st,lit:o.lit,frame:C.frame,mul:o.mul,hood:o.hood&&C.cs,seed:(o.seed||1)+f*17};
        const wh=Array.isArray(o.wh)?o.wh[f]:(o.wh||5);
        if(!o.noL)winRow(g,n,'L',v1,u0+m,u1-m,z,o.w||3,wh,o.pitch||6,C.gl||GL,wo,(o.skipL||[]).concat(f===0?(o.skipL0||[]):[]));
        const wr=Object.assign({},wo,{sill:C.sillR||C.sill,hi:null,wall:C.wr,frame:C.frameR||C.frame,hood:o.hood&&SH(C.cs,-38),seed:(o.seed||1)+f*17+5});
        if(!o.noR)winRow(g,n,'R',u1,v0+m,v1-m,z,o.w||3,wh,o.pitchR||o.pitch||6,C.gd||GD,wr,(o.skipR||[]).concat(f===0?(o.skipR0||[]):[]));}
      if(C.cor){faceL(g,v1,u0,u1,h-2,h,C.cor);faceR(g,u1,v0,v1,h-2,h,SH(C.cor,-40));}};
    // ---- 屋頂（沿用 civ_c）----
    const gableU=(g,u0,v0,du,dv,h,rh,o)=>{const u1=u0+du,v1=v0+dv,vm=(v0+v1)/2,ov=o.ov!=null?o.ov:.03,ze=h-1.5,zt=h+rh,rf=o.rf;
      if(zt-ze<32*(vm-v0+ov))fp(g,[P(u0-ov,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt),P(u0-ov,vm,zt)],o.rb||SH(rf,-24));
      if(o.wr)fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,zt)],o.wr);
      fp(g,[P(u1-.005,v0-ov,ze),P(u1+ov,v0-ov,ze),P(u1+ov,vm,zt+.6),P(u1-.005,vm,zt+.6)],o.vb||SH(rf,-38));
      fp(g,[P(u0-ov,vm,zt),P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),P(u0-ov,v1+ov,ze)],rf);
      const nl=Math.max(2,Math.floor(((v1+ov-vm)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,v=vm+(v1+ov-vm)*f,z=zt-(zt-ze)*f;BL(g,P(u0-ov+.01,v,z),P(u1+ov-.01,v,z),o.rl||SH(rf,-13));}
      BL(g,P(u0-ov,vm,zt),P(u1+ov,vm,zt),o.ridge||SH(rf,26));
      BL(g,P(u0-ov,v1+ov,ze),P(u1+ov,v1+ov,ze),o.fascia||SH(rf,-32));
      BL(g,P(u1+ov,vm,zt),P(u1+ov,v1+ov,ze),o.verge||SH(rf,14));return{vm,zt,ze};};
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
    const hipV=(g,u0,v0,du,dv,h,rh,o)=>{const ov=o.ov!=null?o.ov:.03,a0=u0-ov,a1=u0+du+ov,b0=v0-ov,b1=v0+dv+ov,um=(a0+a1)/2,hr=Math.min((a1-a0)/2,(b1-b0)/2),ze=h-1.5,zt=h+rh,rf=o.rf,rs=o.rs||SH(rf,-30);
      const r0=b0+hr,r1=b1-hr;
      if(zt-ze<32*hr){fp(g,[P(a0,b0,ze),P(a0,b1,ze),P(um,r1,zt),P(um,r0,zt)],SH(rf,-6));fp(g,[P(a0,b0,ze),P(a1,b0,ze),P(um,r0,zt)],SH(rf,-22));}
      fp(g,[P(a1,b0,ze),P(a1,b1,ze),P(um,r1,zt),P(um,r0,zt)],rs);
      fp(g,[P(a0,b1,ze),P(a1,b1,ze),P(um,r1,zt)],rf);
      const nl=Math.max(2,Math.floor(((a1-um)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nl;k++){const f=k/nl,u=um+(a1-um)*f,z=zt-(zt-ze)*f;BL(g,P(u,r0-hr*f+.02,z),P(u,r1+hr*f-.02,z),SH(rs,-10));}
      const nf=Math.max(2,Math.floor(((b1-r1)*16+zt-ze)/(o.cs||2.6)));
      for(let k=1;k<nf;k++){const f=k/nf,v=r1+(b1-r1)*f,z=zt-(zt-ze)*f;BL(g,P(um-hr*f+.02,v,z),P(um+hr*f-.02,v,z),o.rl||SH(rf,-13));}
      BL(g,P(um,r0,zt),P(um,r1,zt),o.ridge||SH(rf,22));BL(g,P(um,r1,zt),P(a1,b1,ze),o.hip||SH(rf,16));BL(g,P(um,r1,zt),P(a0,b1,ze),o.hip||SH(rf,16));
      BL(g,P(a0,b1,ze),P(a1,b1,ze),o.fascia||SH(rf,-32));BL(g,P(a1,b0,ze),P(a1,b1,ze),SH(rs,-22));};
    const pyramid=(g,uc,vc,s,z,rh,rf,rs)=>{const a0=uc-s/2,a1=uc+s/2,b0=vc-s/2,b1=vc+s/2,ap=P(uc,vc,z+rh);
      if(rh<32*s/2){fp(g,[P(a0,b0,z),P(a1,b0,z),ap],SH(rf,-18));fp(g,[P(a0,b0,z),P(a0,b1,z),ap],SH(rf,-8));}
      fp(g,[P(a1,b0,z),P(a1,b1,z),ap],rs);fp(g,[P(a0,b1,z),P(a1,b1,z),ap],rf);BL(g,ap,P(a1,b1,z),SH(rf,22));};
    const flatTop=(g,u0,v0,du,dv,h,roof,o={})=>{const e=o.e||.03;flat(g,u0,v0,du,dv,o.cap||SH(roof,40),h);flat(g,u0+e,v0+e,du-2*e,dv-2*e,roof,h);
      BL(g,P(u0+e,v0+e,h),P(u0+du-e,v0+e,h),SH(roof,-24));BL(g,P(u0+e,v0+e,h),P(u0+e,v0+dv-e,h),SH(roof,-16));};
    // ---- 古典元件 ----
    // 鐘面（圓形 5 或 7 px）
    const clock=(g,n,x,y,big,dark)=>{x=rnd(x);y=rnd(y);const rim=dark?'#8f8676':'#efe6cc',fc=dark?'#d2cab9':'#fbf8ee',hd='#2a2622';
      if(big){RC(g,x-2,y-3,5,1,rim);RC(g,x-3,y-2,7,5,rim);RC(g,x-2,y+3,5,1,rim);RC(g,x-2,y-2,5,5,fc);RC(g,x-1,y-3,3,1,fc);RC(g,x-1,y+3,3,1,fc);RC(g,x-3,y-1,1,3,fc);RC(g,x+3,y-1,1,3,fc);
        RC(g,x-3,y-3,1,1,rim);RC(g,x,y-2,1,3,hd);RC(g,x+1,y,2,1,hd);if(n){RC(n,x-2,y-2,5,5,'#fff4cc');RC(n,x,y-2,1,3,'#7a6a4a');}}
      else{RC(g,x-1,y-2,3,1,rim);RC(g,x-2,y-1,5,3,rim);RC(g,x-1,y+2,3,1,rim);RC(g,x-1,y-1,3,3,fc);RC(g,x,y-1,1,2,hd);RC(g,x+1,y,1,1,hd);if(n)RC(n,x-1,y-1,3,3,'#fff4cc');}};
    // 圓頂（半橢球，逐像素反解法線打光；ribs＝肋數）：底圓心 (uc,vc)、半徑 r 格、底高 z、拱高 rise px；T5 由亮到暗
    const dome=(g,uc,vc,r,z,rise,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2,nr=o.ribs||0;
      const x0=Math.floor(cx-Rx)-1,x1=Math.ceil(cx+Rx)+1,y0=Math.floor(cy-rise)-1,y1=Math.ceil(cy+Ry)+1;
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const Y=y+.5-cy,s=Math.sqrt(1-X*X);
        if(Y<-rise*s||Y>Ry*s)continue;
        let lo=Math.abs(X),hi=1;for(let k=0;k<22;k++){const m=(lo+hi)/2,f=Ry*Math.sqrt(Math.max(0,m*m-X*X))-rise*Math.sqrt(Math.max(0,1-m*m));if(f<Y)lo=m;else hi=m;}
        const a=(lo+hi)/2,sp=Math.sqrt(Math.max(0,1-a*a)),st=a>1e-6?Math.max(-1,Math.min(1,X/a)):0,ct=Math.sqrt(Math.max(0,1-st*st));
        const b=a*st*-.62+a*ct*.34+sp*.71;let k=b>.74?0:b>.5?1:b>.26?2:b>.02?3:4;
        if(nr&&sp<.9){const th=Math.asin(st),q=th/(Math.PI/nr),fr=Math.abs(q-Math.round(q))*(Math.PI/nr)*Rx*a;if(fr<.5)k=Math.min(4,k+1);}
        RC(g,x,y,1,1,T5[k]);}};
    // 圓柱（鼓座／圓形閱覽室）：可見前半圓柱面＋頂蓋；o.cap 頂蓋色；o.pil 壁柱數；o.win:{n,z0,z1,w,glass}
    const cyl=(g,n,uc,vc,r,z,h,T5,o={})=>{const c=P(uc,vc,z),cx=c[0],cy=c[1],Rx=r*32*Math.SQRT2,Ry=Rx/2;
      for(let x=Math.floor(cx-Rx);x<=Math.ceil(cx+Rx);x++){const X=(x+.5-cx)/Rx;if(Math.abs(X)>=1)continue;const s=Math.sqrt(1-X*X);
        const b=-X*.62+s*.34+.12;const k=b>.62?0:b>.38?1:b>.12?2:b>-.2?3:4;
        const yb=Math.round(cy+Ry*s),yt=Math.round(cy-h+Ry*s);if(!o.noFill)RC(g,x,yt,1,yb-yt,T5[k]);
        if(o.cap){const yc=Math.round(cy-h-Ry*s);RC(g,x,yc,1,yt-yc,o.cap);}}
      if(o.pil){for(let i=0;i<=o.pil;i++){const th=-Math.PI/2+i*Math.PI/o.pil,x=rnd(cx+Rx*Math.sin(th)-.5),ct=Math.cos(th);if(ct<.2)continue;
        const yb=Math.round(cy+Ry*ct),yt=Math.round(cy-h+Ry*ct);RC(g,x,yt,1,yb-yt,Math.sin(th)<0?(o.pc||T5[0]):(o.pd||T5[2]));}}
      if(o.win){const w=o.win;for(let i=0;i<w.n;i++){const th=-Math.PI/2+(i+.5)*Math.PI/w.n,ct=Math.cos(th);if(ct<.3)continue;const ww=Math.max(1,rnd((w.w||2)*ct)),x=rnd(cx+Rx*Math.sin(th)-ww/2);
        const yb=Math.round(cy+Ry*ct-w.z0),yt=Math.round(cy+Ry*ct-w.z1);RC(g,x,yt,ww,yb-yt,Math.sin(th)<0?(w.glass||GL):(w.gd||GD));if(w.arch){RC(g,x,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);if(ww>1)RC(g,x+ww-1,yt,1,1,Math.sin(th)<0?T5[1]:T5[3]);}
        if(n&&hsh(w.seed||31,i,3)<(w.lit!=null?w.lit:.6))RC(n,x,yt+(w.arch?1:0),ww,yb-yt-(w.arch?1:0),LIT);}}};
    // 柱列：+v 面（colsL）或 +u 面（colsR）
    const colsL=(g,v,a,b,cnt,z0,h,cl,cr)=>{for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,t-.025,v-.05,.05,.05,z0,h,null,cl,cr);boxZ(g,t-.035,v-.06,.07,.07,z0+h-1,1,null,cl,cr);}};
    const colsR=(g,u,a,b,cnt,z0,h,cl,cr)=>{for(let i=0;i<cnt;i++){const t=a+(b-a)*(i+.5)/cnt;boxZ(g,u-.05,t-.025,.05,.05,z0,h,null,cl,cr);boxZ(g,u-.06,t-.035,.07,.07,z0+h-1,1,null,cl,cr);}};
    // 門廊（+v 面）：台基＋柱列＋簷部＋山花（屋脊沿 v，+v 端三角山花）
    const porticoL=(g,n,a,b,vw,vf,h,rh,cnt,C)=>{const d=vf-vw;
      boxZ(g,a-.02,vw,b-a+.04,d+.02,0,1.5,SH(C.st,6),SH(C.st,-8),SH(C.st,-44));
      colsL(g,vf,a+.02,b-.02,cnt,1.5,h-1.5,C.col||'#f4efe2',C.colR||'#bdb5a3');
      boxZ(g,a,vw,b-a,d,h,3,C.st,C.st,SH(C.st,-40));faceL(g,vf,a,b,h+2,h+3,SH(C.st,14));
      gableV(g,a,vw,b-a,d,h+3,rh,{rf:C.rf,rs:C.rs,wl:SH(C.st,-10),ov:.02,verge:SH(C.st,18)});
      const um=(a+b)/2;BL(g,P(a,vf,h+3),P(um,vf,h+3+rh),SH(C.st,20));BL(g,P(um,vf,h+3+rh),P(b,vf,h+3),SH(C.st,20));
      if(n){const lp=P(um,vf,h-1);RC(n,lp[0]-2,lp[1],5,1,'#ffe6a0');}};
    const porticoR=(g,n,a,b,uw,uf,h,rh,cnt,C)=>{const d=uf-uw;
      boxZ(g,uw,a-.02,d+.02,b-a+.04,0,1.5,SH(C.st,6),SH(C.st,-8),SH(C.st,-44));
      colsR(g,uf,a+.02,b-.02,cnt,1.5,h-1.5,C.colD||'#d8d1c0',C.colR||'#a39b89');
      boxZ(g,uw,a,d,b-a,h,3,C.st,SH(C.st,-6),SH(C.st,-40));faceR(g,uf,a,b,h+2,h+3,SH(C.st,-24));
      gableU(g,uw,a,d,b-a,h+3,rh,{rf:C.rf,wr:SH(C.st,-46),ov:.02,verge:SH(C.st,-20)});
      if(n){const lp=P(uf,(a+b)/2,h-1);RC(n,lp[0]-2,lp[1],5,1,'#ffe6a0');}};
    // 正面門廊（面向前角 S，法線沿 u=v 對角線 ⇒ 立面在畫面上是正放矩形）：d0＝u−v 中心、sb/sf＝後／前緣 u+v、w＝半寬（格）、h 柱高、rh 山花高、cnt 柱數
    const porticoS=(g,n,d0,sb,sf,w,h,rh,cnt,C)=>{const pf=P((sf+d0)/2,(sf-d0)/2,0),cx=rnd(pf[0]),Y=rnd(pf[1]),hw=rnd(w*32),X0=cx-hw,X1=cx+hw,dy=rnd((sf-sb)*16);
      const st=C.st,stL=SH(st,12),stM=SH(st,-14),stD=SH(st,-44),sh=C.sh||'#6f6656';
      RC(g,X0-4,Y-2-dy,X1-X0+8,dy,SH(st,-4));RC(g,X0-4,Y-2,X1-X0+8,2,stD);RC(g,X0-6,Y-1,X1-X0+12,1,SH(stD,-10));RC(g,X0-6,Y-2,X1-X0+12,1,stM);
      RC(g,X0,Y-h,X1-X0,h-2,sh);RC(g,X0,Y-h,X1-X0,2,SH(sh,-16));
      RC(g,cx-3,Y-11,6,9,C.door||'#5a3a28');RC(g,cx-3,Y-11,6,2,'#9cc0d6');RC(g,cx,Y-9,1,7,SH(C.door||'#5a3a28',-16));if(n){RC(n,cx-3,Y-11,6,2,'#ffe9b0');RC(n,cx-3,Y-9,6,7,'rgba(255,220,150,.35)');}
      for(let i=0;i<cnt;i++){const x=rnd(X0+1+(X1-X0-3)*(i+.5)/cnt);RC(g,x-1,Y-h,1,h-2,stL);RC(g,x,Y-h,1,h-2,st);RC(g,x+1,Y-h,1,h-2,stD);RC(g,x-1,Y-h,3,1,stL);RC(g,x-2,Y-h+1,5,1,st);RC(g,x-1,Y-3,3,1,stM);}
      const ze=Y-h-3;RC(g,X0-2,ze,X1-X0+4,3,st);RC(g,X0-2,ze+2,X1-X0+4,1,stM);RC(g,X0-2,ze,X1-X0+4,1,stL);
      const apx=cx,apy=ze-rh;
      fp(g,[[X0-3,ze-dy],[apx,apy-dy],[apx,apy],[X0-3,ze]],C.rfL);fp(g,[[apx,apy-dy],[X1+3,ze-dy],[X1+3,ze],[apx,apy]],C.rfR);
      for(let x=X0;x<apx-1;x+=3)BL(g,[x,ze-dy+(apx-x)*0-((x-X0+3)/(apx-X0+3))*rh+1],[x,ze-((x-X0+3)/(apx-X0+3))*rh-1],SH(C.rfL,-12));
      for(let x=apx+3;x<X1+2;x+=3)BL(g,[x,ze-dy-((X1+3-x)/(X1+3-apx))*rh+1],[x,ze-((X1+3-x)/(X1+3-apx))*rh-1],SH(C.rfR,-12));
      BL(g,[apx,apy-dy],[apx,apy],SH(C.rfL,24));
      fp(g,[[X0-3,ze+.5],[X1+3,ze+.5],[apx,apy]],st);fp(g,[[X0+2,ze-.5],[X1-2,ze-.5],[apx,apy+3]],SH(st,-18));
      BL(g,[X0-3,ze],[apx,apy],stL);BL(g,[apx,apy],[X1+3,ze],stL);
      if(n){RC(n,cx-2,Y-h+1,4,1,'#ffe6a0');}};
    // 門（+v 面 doorL／+u 面 doorR）：石框＋木門＋氣窗
    const doorL=(g,n,v,t,wd,hd,fr,wood)=>{const a=t-wd/64,b=t+wd/64;faceL(g,v,a-1/32,b+1/32,0,hd+1.5,fr);faceL(g,v,a,b,0,hd,wood||'#4b3226');faceL(g,v,a,b,hd-2,hd,'#9cc0d6');faceL(g,v,t-1/64,t+1/64,0,hd-2,SH(wood||'#4b3226',-16));if(n){faceL(n,v,a,b,hd-2,hd,'#ffe9b0');}};
    const doorR=(g,n,u,t,wd,hd,fr,wood)=>{const a=t-wd/64,b=t+wd/64;faceR(g,u,a-1/32,b+1/32,0,hd+1.5,fr);faceR(g,u,a,b,0,hd,wood||'#3f2a20');faceR(g,u,a,b,hd-2,hd,'#7fa2b8');faceR(g,u,t-1/64,t+1/64,0,hd-2,SH(wood||'#3f2a20',-14));if(n){faceR(n,u,a,b,hd-2,hd,'#f3d68e');}};
    // ---- 哥德元件 ----
    const buttL=(g,v,t,h,wl,wr,top)=>{boxZ(g,t-.03,v,.06,.07,0,h-4,top,wl,wr);boxZ(g,t-.025,v,.05,.04,h-4,3,top,wl,wr);};
    const buttR=(g,u,t,h,wl,wr,top)=>{boxZ(g,u,t-.03,.07,.06,0,h-4,top,wl,wr);boxZ(g,u,t-.025,.04,.05,h-4,3,top,wl,wr);};
    const pinn=(g,u,v,z,h,wl,wr,rf,rs)=>{boxZ(g,u-.03,v-.03,.06,.06,z,h*.45,null,wl,wr);pyramid(g,u,v,.07,z+h*.45,h*.55,rf,rs);};
    // 城垛：沿四邊的護牆＋垛口（後兩邊先畫）
    const cren=(g,u0,v0,du,dv,z,wl,wr,top)=>{const u1=u0+du,v1=v0+dv,e=.045,st=3/32;
      for(let t=u0;t<u1-.01;t+=st)boxZ(g,t,v0,2/32,e,z,4,top,wl,wr);
      for(let t=v0+e;t<v1-.01;t+=st)boxZ(g,u0,t,e,2/32,z,4,top,wl,wr);
      boxZ(g,u0,v1-e,du,e,z,2,top,wl,wr);boxZ(g,u1-e,v0,e,dv,z,2,top,wl,wr);
      for(let t=u0;t<u1-.01;t+=st)boxZ(g,t,v1-e,2/32,e,z+2,2,top,wl,wr);
      for(let t=v0;t<v1-.01;t+=st)boxZ(g,u1-e,t,e,2/32,z+2,2,top,wl,wr);};
    // 玫瑰窗（山牆上，px 中心）
    const rose=(g,n,x,y,dark)=>{x=rnd(x);y=rnd(y);const s=dark?'#9d937c':'#ebe2cb',gl=dark?'#2f475a':'#3f5d77';
      RC(g,x-2,y-3,5,7,s);RC(g,x-3,y-2,7,5,s);RC(g,x-1,y-2,3,5,gl);RC(g,x-2,y-1,5,3,gl);RC(g,x,y-2,1,5,s);RC(g,x-2,y,5,1,s);RC(g,x,y,1,1,'#c9a64a');
      if(n){RC(n,x-1,y-2,3,5,'#ffd98a');RC(n,x-2,y-1,5,3,'#ffd98a');RC(n,x,y,1,1,'#fff2c0');}};
    // ---- 景觀與小件 ----
    const flagpole=(S,u,v,h,d)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      S.t(d,(g)=>{RC(g,x-1,y-2,4,2,'#cdc8bb');RC(g,x-1,y-1,4,1,'#8f8b82');RC(g,x+2,y-2,1,2,'#9e9a90');RC(g,x,y-h,2,h-2,'#8a8a86');RC(g,x,y-h,1,h-2,'#a9a9a3');});
      return[x+1,y-h];};
    const kid=(g,p,shirt,o={})=>{const x=rnd(p[0]),y=rnd(p[1]),lg=o.leg||'#3a3f4d',sk=o.skin||'#e8bf97',hr=o.hair||'#3a2c24';
      if(o.run){RC(g,x-1,y-1,1,1,lg);RC(g,x+1,y-2,1,1,lg);RC(g,x,y-2,1,1,lg);}else{RC(g,x,y-2,1,2,lg);RC(g,x+1,y-2,1,2,SH(lg,-12));}
      RC(g,x,y-4,2,2,shirt);RC(g,x+1,y-4,1,2,SH(shirt,-26));RC(g,x,y-5,2,1,sk);RC(g,x,y-6,2,1,hr);if(o.bag)RC(g,x-1,y-4,1,2,o.bag);};
    const crowd=(S,d,list)=>S.t(d,(g)=>{for(const q of list)kid(g,P(q[0],q[1]),q[2],q[3]||{});});
    const bench=(S,u,v,alongU,d)=>S.o(d,(g)=>{if(alongU)boxZ(g,u,v,.12,.035,1,1,'#b0845a','#9a6f48','#7a5638');else boxZ(g,u,v,.035,.12,1,1,'#b0845a','#9a6f48','#7a5638');});
    // 路燈：c 古典（黑桿燈籠）／m 現代（細桿）
    const lamp=(S,u,v,h,d,kind)=>S.t(d,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
      if(kind==='m'){RC(g,x,y-h,1,h,'#7c858b');RC(g,x+1,y-h+1,1,h-1,'#a6aeb3');RC(g,x-1,y-h-1,3,1,'#5c6468');RC(g,x-1,y-h,3,1,'#f2f0e4');if(n){RC(n,x-1,y-h,3,1,'#fff2c8');RC(n,x-2,y-h+1,5,1,'rgba(255,236,190,.45)');}return;}
      RC(g,x,y-h+2,1,h-2,'#2e3236');RC(g,x+1,y-h+3,1,h-3,'#4a5055');RC(g,x-1,y-1,3,1,'#2e3236');
      RC(g,x-1,y-h-1,3,1,'#2a2e32');RC(g,x-1,y-h,3,2,'#f3e2a8');RC(g,x,y-h-2,1,1,'#2a2e32');
      if(n){RC(n,x-1,y-h,3,2,'#ffe6a0');RC(n,x-2,y-h+2,5,1,'rgba(255,226,160,.45)');}});
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130'],['#c8b25a','#a88d3c','#7e6a2c','#574820']];
    const tree=(S,u,v,s=1,kind=0,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%TREE.length];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);});
    // 柱形樹（義大利柏）
    const cypress=(S,u,v,h,d)=>S.o(d!=null?d:u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-2,1,2,'#4a3727');
      for(let k=0;k<h;k++){const f=k/h,w=Math.max(1,rnd(3.2*Math.sin(Math.PI*Math.min(.95,f*.85+.12))));RC(g,x-w+1,y-2-k,w,1,'#5d8f4a');RC(g,x+1,y-2-k,w,1,'#3c6632');}RC(g,x,y-2-h,1,1,'#3c6632');});
    const bush=(S,u,v,r=3,d)=>S.o(d!=null?d:u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const hedge=(S,u0,v0,du,dv,d,h=3)=>S.o(d,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#5f9442','#4e7f37','#3b6429');});
    // 鐵柵（細線層）：a→b（uv），gap＝[t0,t1]
    const rail=(S,a,b,o={})=>S.t(o.d!=null?o.d:50,(g)=>{const h=o.h||5,pc=o.pc||'#34393e',rc=o.rc||'#4d545a';
      const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],pa=P(a[0],a[1]),pb=P(b[0],b[1]),Lp=Math.hypot(pb[0]-pa[0],pb[1]-pa[1]),n=Math.max(2,rnd(Lp/(o.step||3))),gp=o.gap;
      const seg=(t0,t1)=>{const A0=at(t0),A1=at(t1);BL(g,P(A0[0],A0[1],h),P(A1[0],A1[1],h),rc);BL(g,P(A0[0],A0[1],1),P(A1[0],A1[1],1),rc);};
      const segs=gp?[[0,gp[0]],[gp[1],1]]:[[0,1]];for(const s of segs)if(s[1]-s[0]>1e-3)seg(s[0],s[1]);
      for(let i=0;i<=n;i++){const t=i/n;if(gp&&t>gp[0]+1e-6&&t<gp[1]-1e-6)continue;const q=at(t),p=P(q[0],q[1]);RC(g,p[0],p[1]-h,1,h,pc);}});
    // 磚柱（門柱／圍牆柱）
    const piers=(S,pts,d,C,h=8)=>S.o(d,(g,n)=>{for(const[u,v,lp]of pts){boxZ(g,u-.035,v-.035,.07,.07,0,h,null,C.wl,C.wr);boxZ(g,u-.045,v-.045,.09,.09,h,1.5,C.cap,C.cap,SH(C.cap,-40));
      if(lp){const p=P(u,v,h+1.5),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-3,2,3,'#2e3236');RC(g,x-1,y-3,2,2,'#f3e2a8');if(n)RC(n,x-1,y-3,2,2,'#ffe6a0');}}});
    // 腳踏車（沿 u 或 v 排一列）
    const bikes=(S,u0,v0,len,alongU,d,seed)=>S.t(d,(g)=>{const n=Math.max(2,Math.floor(len*32/3));for(let i=0;i<n;i++){const t=len*(i+.5)/n,p=alongU?P(u0+t,v0):P(u0,v0+t),x=rnd(p[0]),y=rnd(p[1]);
      const c=['#c24a3a','#2f5f96','#d9d9d4','#3f7f4a','#e0a83a','#2a2d31'][hsh(seed||3,i,1)*6|0];
      RC(g,x-1,y-1,1,1,'#2a2d31');RC(g,x+1,y,1,1,'#2a2d31');RC(g,x-1,y-2,2,1,c);RC(g,x+1,y-1,1,1,c);RC(g,x,y-3,1,1,'#2a2d31');}});
    // 噴泉（圓形水池＋中央兩層水盤＋水柱）
    const fountain=(S,uc,vc,r,d)=>S.o(d,(g,n)=>{const c=P(uc,vc),x=rnd(c[0]),y=rnd(c[1]),rx=rnd(r*45.25),ry=rnd(r*22.6);
      ell(g,x,y,rx,ry,'#a39c8c');ell(g,x,y-2,rx,ry,'#e3ddcf');ell(g,x,y-2,rx-2,Math.max(1,ry-1),'#4c7f9e');ell(g,x-1,y-2,rx-4,Math.max(1,ry-3),'#5e93b2');
      for(let k=0;k<5;k++){const a=k*1.3+.4;RC(g,x+rnd((rx-5)*Math.cos(a)),y-2+rnd((ry-2)*Math.sin(a)),2,1,'#a9cfe2');}
      RC(g,x-3,y-5,7,2,'#e3ddcf');RC(g,x-3,y-4,7,1,'#a39c8c');RC(g,x-2,y-5,5,1,'#6ea5c4');RC(g,x-1,y-9,2,4,'#cfc8b8');RC(g,x-2,y-10,4,1,'#e3ddcf');
      RC(g,x,y-15,1,5,'#d8eef8');RC(g,x-1,y-13,1,3,'#b8dcee');RC(g,x+1,y-13,1,3,'#b8dcee');RC(g,x-2,y-11,1,1,'#b8dcee');RC(g,x+2,y-11,1,1,'#b8dcee');});
    // 銅像（石台座＋青銅人像）
    const statue=(S,u,v,d,s=1)=>S.o(d,(g)=>{boxZ(g,u-.06*s,v-.06*s,.12*s,.12*s,0,2,'#d9d3c4','#cfc8b8','#9f998b');boxZ(g,u-.04*s,v-.04*s,.08*s,.08*s,2,5*s,'#e3ddcf','#d6cfbf','#a39c8c');
      const p=P(u,v,2+5*s),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-8,3,8,'#4d6a5e');RC(g,x+1,y-8,1,8,'#35493f');RC(g,x-1,y-10,2,2,'#5c7d70');RC(g,x+2,y-8,1,3,'#4d6a5e');RC(g,x-2,y-7,1,2,'#6d8f81');});
    // 拱頂館（體育館）：ax='v' 屋脊沿 v（拱跨 u，+v 端為拱形山牆，+u 長邊高側窗）；ax='u' 反之（+u 端拱形山牆，+v 長邊高側窗）
    const barrel=(g,n,u0,v0,du,dv,h,rise,ax,C)=>{const u1=u0+du,v1=v0+dv,tones=C.tones;
      boxZ(g,u0,v0,du,dv,0,h,null,C.wl,C.wr);faceL(g,v1,u0,u1,0,1.5,SH(C.wl,-36));faceR(g,u1,v0,v1,0,1.5,SH(C.wr,-30));
      if(ax==='v'){const uc=u0+du/2,hw=du/2,zf=u=>{const x=(u-uc)/hw;return h-1+(rise+1)*Math.sqrt(Math.max(0,1-x*x));};
        const nb=Math.max(3,Math.floor(dv*32/5));for(let i=0;i<nb;i++){const t=v0+dv*(i+.5)/nb;faceR(g,u1,t-.035,t+.035,h-6,h-2,C.gd||GD);if(n&&hsh(C.seed||5,i,1)<.6)faceR(n,u1,t-.035,t+.035,h-6,h-2,LIT2);}
        for(let i=0;i<=nb;i++){const t=v0+dv*i/nb;faceR(g,u1,t-.01,t+.01,0,h,SH(C.wr,-14));}
        terrain(g,u0,v0,u1,v1+.02,1/32,(u,v)=>zf(Math.min(u1,Math.max(u0,u))),(u,v,z,gu,gv,i,j)=>{if(gu+gv>=31)return null;const nn=Math.hypot(gu/34,1),l=(gu/34*.6+.7)/nn;let k=l>.95?0:l>.8?1:l>.6?2:l>.4?3:4;if(j%5===0)k=Math.min(4,k+1);return tones[k];});
        const pts=[];for(let u=u0;u<=u1+1e-6;u+=1/64)pts.push(P(u,v1,zf(u)));pts.push(P(u1,v1,0),P(u0,v1,0));fp(g,pts,C.wl);
        faceL(g,v1,u0,u1,0,1.5,SH(C.wl,-36));faceL(g,v1,u0,u1,h-1,h,C.trim);
        const lp=[];for(let u=u0+.06;u<=u1-.06+1e-6;u+=1/64)lp.push(P(u,v1,zf(u)-2.5));lp.push(P(u1-.06,v1,h+.5),P(u0+.06,v1,h+.5));fp(g,lp,C.gl||GL);
        for(let k=1;k<5;k++){const u=u0+.06+(du-.12)*k/5;BL(g,P(u,v1,h+.5),P(u,v1,zf(u)-2.5),C.trim);}
        if(n)fp(n,lp,'rgba(255,226,160,.5)');
        const um=u0+du/2;faceL(g,v1,um-.08,um+.08,0,8,C.trim);faceL(g,v1,um-.06,um+.06,0,7,'#3e4d5a');faceL(g,v1,um-.002,um+.002,0,7,'#2a3540');if(n)faceL(n,v1,um-.06,um+.06,5,7,'#ffe9b0');
        for(let u=u0;u<=u1;u+=1/64){const p=P(u,v1,zf(u)+1);RC(g,Math.floor(p[0]),Math.floor(p[1]),1,1,C.edge);}}
      else{const vc=v0+dv/2,hw=dv/2,zf=v=>{const x=(v-vc)/hw;return h-1+(rise+1)*Math.sqrt(Math.max(0,1-x*x));};
        const nb=Math.max(3,Math.floor(du*32/5));for(let i=0;i<nb;i++){const t=u0+du*(i+.5)/nb;faceL(g,v1,t-.035,t+.035,h-6,h-2,C.gl||GL);if(n&&hsh(C.seed||5,i,2)<.6)faceL(n,v1,t-.035,t+.035,h-6,h-2,LIT);}
        for(let i=0;i<=nb;i++){const t=u0+du*i/nb;faceL(g,v1,t-.01,t+.01,0,h,SH(C.wl,-12));}
        terrain(g,u0,v0,u1+.02,v1,1/32,(u,v)=>zf(Math.min(v1,Math.max(v0,v))),(u,v,z,gu,gv,i,j)=>{if(gu+gv>=31)return null;const nn=Math.hypot(gv/34,1),l=(-gv/34*.62+.62)/nn;let k=l>.9?0:l>.72?1:l>.52?2:l>.32?3:4;if(i%5===0)k=Math.min(4,k+1);return tones[k];});
        const pts=[];for(let v=v0;v<=v1+1e-6;v+=1/64)pts.push(P(u1,v,zf(v)));pts.push(P(u1,v1,0),P(u1,v0,0));fp(g,pts,C.wr);
        faceR(g,u1,v0,v1,h-1,h,SH(C.trim,-40));
        const lp=[];for(let v=v0+.06;v<=v1-.06+1e-6;v+=1/64)lp.push(P(u1,v,zf(v)-2.5));lp.push(P(u1,v1-.06,h+.5),P(u1,v0+.06,h+.5));fp(g,lp,C.gd||GD);
        for(let k=1;k<5;k++){const v=v0+.06+(dv-.12)*k/5;BL(g,P(u1,v,h+.5),P(u1,v,zf(v)-2.5),SH(C.trim,-40));}
        if(n)fp(n,lp,'#f3d68e');
        const vm=v0+dv/2;faceR(g,u1,vm-.08,vm+.08,0,8,SH(C.trim,-40));faceR(g,u1,vm-.06,vm+.06,0,7,'#2c3843');if(n)faceR(n,u1,vm-.06,vm+.06,5,7,'#f3d68e');
        for(let v=v0;v<=v1;v+=1/64){const p=P(u1,v,zf(v)+1);RC(g,Math.floor(p[0]),Math.floor(p[1]),1,1,C.edge);}}};
    return {LIT,LIT2,GL,GD,GH,win1,winRow,mass,barrel,porticoS,gableU,gableV,hipU,hipV,pyramid,flatTop,clock,dome,cyl,colsL,colsR,porticoL,porticoR,doorL,doorR,buttL,buttR,pinn,cren,rose,
      flagpole,kid,crowd,bench,lamp,tree,cypress,bush,hedge,rail,piers,bikes,fountain,statue};
  };

  const build=(k,def,layoutsOf)=>{
    const old=B[k+'_1_0'];
    const W=(old&&old.w)||def.W,H=(old&&old.h)||def.H,AX=(old&&old.ax!=null)?old.ax:def.AX,AY=(old&&old.ay!=null)?old.ay:def.AY;
    const K=A.iso575(W,H,AX,AY,def.SZ),L=LIB(K),T=KIT(L),lay=layoutsOf(L,T),order=DEV[k]||null,out=[];
    // 收尾裁切：佔地菱形南側兩條斜邊以外、頂端 2 列以內一律清掉（地面本身以像素中心取樣，恰好不受影響）
    const clip=(c,tag)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,W,H),a=d.data;let cut=0;
      for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4+3;if(!a[i])continue;if(y<2||y+.5>AY-Math.abs(xx+.5-AX)/2+.01){a[i]=0;cut++;}}
      if(cut){x.putImageData(d,0,0);}return cut;};
    for(let slot=0;slot<3;slot++){const v=order?order[slot]:slot;
      try{const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
        const o=lay[v](g,ng,S)||{};S.run(g,ng);
        const cut=clip(c),cutN=clip(nc);
        const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:o.smoke||[]};
        if(o.flagAt){spr.flagAt=o.flagAt;const[fx,fy]=o.flagAt,id=c.getContext('2d').getImageData(fx-1,fy-3,2,3).data;let op=0;for(let i=3;i<id.length;i+=4)if(id[i])op++;
          if(op)errs.push('k'+k+'v'+v+' flagAt 上方有不透明像素 '+op);}
        chk.push({k,v,cut,cutN,flagAt:o.flagAt||null});
        B[k+'_1_'+slot]=spr;out[slot]=spr;}
      catch(e){console.error('civ_d k'+k+' v'+v,e);errs.push('k'+k+'v'+v+':'+(e&&e.stack||e));}}
    if(out[0]&&B[k+'_1_3'])B[k+'_1_3']=out[0];
    if(out[1]&&B[k+'_1_4'])B[k+'_1_4']=out[1];
  };

  // ================= k32 大學（3×3）=================
  try{
    build(32,{W:208,H:220,AX:104,AY:218,SZ:3},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD,GH=T.GH;
      const stripe=(a,b)=>(u,v)=>(Math.floor(a*u+b*v)%2)?'#7aa75a':'#72a052';
      return [
      // ---------- v0 古典紅磚＋鐘塔：沿右後緣一字排開的三層紅磚主樓——左右兩翼（四坡石板瓦、煙囪、石窗楣）夾中央石砌門樓（高出一截、平頂護牆、前段突出）＋六柱山花門廊＋四段式鐘塔（磚身、石鐘台雙面鐘、拱窗鐘樓、銅綠尖頂）；
      //      主樓右端（右角）接圓頂圖書館方塊（高拱窗閱覽室、鼓座＋銅綠圓頂、門朝草坪）；沿左後緣兩層教學館（雙坡石板瓦、山牆圓窗、側門雨遮）；
      //      中央割草紋草坪、中軸與右側兩條石板步道通往前緣校門、圓形花壇與銅像、右前樹叢；前緣鐵柵與石門柱；左角旗桿 ----------
      (g,ng,S)=>{
        const C={wl:'#b65b41',wr:'#803e2d',bl:'#8f897b',br:'#69645a',cor:'#ece2c8',cs:'#e2d5b6',sill:'#f1e9d4',sillR:'#b8ab8d',gl:GL,gd:GD};
        const CS={wl:'#e3d8bd',wr:'#a89b7e',bl:'#a39a86',br:'#7c7566',cor:'#f2ead6',cs:'#f2ead6',sill:'#f7f1e2',sillR:'#c2b699',gl:GL,gd:GD};
        const RF='#5d6672',RS='#444b56',ST='#ebe2ca',STD='#b3a68a',COP=['#a6d6c2','#86bda8','#68a28d','#518873','#3d6b5b'];
        const X=1.28,LB={u0:2.40,v0:.18,du:.54,dv:.56};   // X＝中軸
        pave(g,'g',0,0,3,3,3201);
        paint(g,(u,v)=>(v>.96&&u>.70)?stripe(0,7)(u,v):null);
        pave(g,'st',.24,.74,2.70,.10,3202);
        pave(g,'st',X-.46,.84,.92,.28,3208);
        pave(g,'st',X-.10,1.12,.20,1.83,3203);
        pave(g,'st',.68,1.58,X-.78,.13,3204);
        pave(g,'st',2.60,.84,.13,2.11,3205);
        paint(g,(u,v)=>{const r=Math.hypot(u-X,v-1.645);if(r<.07)return'#cfc7b3';if(r<.14)return(hsh(3207,rnd(u*40),rnd(v*40))<.5)?'#c8566a':'#d9788a';if(r<.16)return'#4f7f35';if(r<.24)return'#cbc3af';return null;});
        shadow(g,[['b',.24,.18,2.08,.56,36],['b',.92,.18,.72,.68,40],['b',X-.17,.29,.34,.34,110],['b',.18,.98,.50,1.04,30],['b',LB.u0,LB.v0,LB.du,LB.dv,34],
          ['c',.95,1.30,5,15],['c',.92,2.20,6,16],['c',1.00,2.80,5,15],['c',1.90,1.30,5,15],['c',2.30,1.62,6,16],['c',1.92,2.20,6,16],['c',2.36,2.62,6,16],['c',2.88,1.40,5,15],['c',2.86,2.20,5,15],['c',1.88,2.86,5,14]]);
        // 主樓左翼
        S.o(1,(g,n)=>{const u0=.24,v0=.18,du=.68,dv=.56,h=28;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:3,z0:3.5,fh:8.5,w:3,wh:5,pitch:7,seed:3211,hood:1});
          T.hipU(g,u0,v0,du,dv,h,9,{rf:RF,rs:RS,ov:.04});
          boxZ(g,.46,.42,.07,.08,33,8,'#8a8f93','#b65b41','#803e2d');boxZ(g,.45,.41,.09,.10,41,1.5,'#8a8f93','#d8cdb2','#a39880');});
        // 中央門樓後段（高出兩翼，平頂石欄）
        S.o(1.1,(g,n)=>{const u0=X-.36,v0=.18,du=.72,dv=.56,h=38;
          T.mass(g,n,u0,v0,du,dv,h,CS,{fl:3,z0:4,fh:11,w:3,wh:7,pitch:8,st:'arch',seed:3221,noL:1});
          T.flatTop(g,u0,v0,du,.68,h,'#8c9095',{cap:'#f2ead6'});});
        // 主樓右翼
        S.o(1.2,(g,n)=>{const u0=X+.36,v0=.18,du=.68,dv=.56,h=28;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:3,z0:3.5,fh:8.5,w:3,wh:5,pitch:7,seed:3212,hood:1});
          T.hipU(g,u0,v0,du,dv,h,9,{rf:RF,rs:RS,ov:.04});
          boxZ(g,2.06,.42,.07,.08,33,8,'#8a8f93','#b65b41','#803e2d');boxZ(g,2.05,.41,.09,.10,41,1.5,'#8a8f93','#d8cdb2','#a39880');});
        // 中央門樓前段（突出 .12：圓拱窗、門廊後的陰影與大門）
        S.o(1.3,(g,n)=>{const u0=X-.36,v0=.74,du=.72,dv=.12,h=38,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,CS.wl,CS.wr);faceL(g,v1,u0,u1,0,2,CS.bl);faceR(g,u1,v0,v1,0,2,CS.br);
          for(let f=1;f<3;f++){const z=4+f*11;faceL(g,v1,u0,u1,z-2.5,z-1.5,CS.cs);T.winRow(g,n,'L',v1,u0+.04,u1-.04,z,3,7,8,GL,{st:'arch',wall:CS.wl,sill:CS.sill,hi:GH,seed:3222+f},[]);}
          faceL(g,v1,u0,u1,h-4,h-3,'#c9bd9f');faceL(g,v1,u0,u1,h-2,h,CS.cor);faceR(g,u1,v0,v1,h-2,h,SH(CS.cor,-40));
          faceL(g,v1,X-.28,X+.28,0,15,'#8e8470');faceL(g,v1,X-.26,X+.26,0,1.5,'#7a715f');
          T.doorL(g,n,v1,X,6,10,'#f2ead6','#5a3a28');
          for(const t of[X-.17,X+.17]){faceL(g,v1,t-2/64,t+2/64,4,9,GL);if(n)faceL(n,v1,t-2/64,t+2/64,4,9,T.LIT);}});
        // 鐘塔（磚身→石鐘台→拱窗鐘樓→銅綠尖頂）
        S.o(1.35,(g,n)=>{const uc=X,vc=.46,s=.34,u0=uc-s/2,v0=vc-s/2,u1=u0+s,v1=v0+s;
          boxZ(g,u0,v0,s,s,38,24,null,C.wl,C.wr);
          for(const z of[44,56]){faceL(g,v1,u0,u1,z,z+1,C.cor);faceR(g,u1,v0,v1,z,z+1,SH(C.cor,-40));}
          T.win1(g,n,'L',v1,uc,46,2,8,GL,{st:'arch',wall:C.wl,sill:C.sill},3231,0);T.win1(g,n,'R',u1,vc,46,2,8,GD,{st:'arch',wall:C.wr,sill:C.sillR},3232,0);
          boxZ(g,u0-.025,v0-.025,s+.05,s+.05,62,13,null,ST,STD);faceL(g,v1+.025,u0-.025,u1+.025,62,63,SH(ST,-24));faceL(g,v1+.025,u0-.025,u1+.025,74,75,SH(ST,14));
          const cl=P(uc,v1+.025,68.5),cr=P(u1+.025,vc,68.5);T.clock(g,n,cl[0],cl[1],1,0);T.clock(g,n,cr[0],cr[1],1,1);
          boxZ(g,u0,v0,s,s,75,12,null,C.wl,C.wr);
          for(const t of[uc-.07,uc+.07]){faceL(g,v1,t-.035,t+.035,77,85,'#2a2320');faceL(g,v1,t-.035,t-.005,84,85,C.wl);faceL(g,v1,t+.005,t+.035,84,85,C.wl);faceR(g,u1,vc+(t-uc)-.035,vc+(t-uc)+.035,77,85,'#201b19');faceR(g,u1,vc+(t-uc)-.035,vc+(t-uc)-.005,84,85,C.wr);faceR(g,u1,vc+(t-uc)+.005,vc+(t-uc)+.035,84,85,C.wr);}
          const bp=P(uc,v1-.06,79);RC(g,bp[0]-2,bp[1]-3,4,3,'#c99a3c');RC(g,bp[0]-1,bp[1]-4,2,1,'#e8c566');
          boxZ(g,u0-.03,v0-.03,s+.06,s+.06,87,2,ST,ST,STD);
          for(const[a,b]of[[u0,v0],[u1,v0],[u0,v1],[u1,v1]])boxZ(g,a-.02,b-.02,.04,.04,89,3,ST,ST,STD);
          T.pyramid(g,uc,vc,s-.02,89,24,COP[1],COP[3]);
          const ap=P(uc,vc,113);RC(g,ap[0],ap[1]-4,1,4,'#caa54a');RC(g,ap[0]-1,ap[1]-3,3,1,'#caa54a');});
        // 六柱山花門廊＋台階
        S.o(1.4,(g,n)=>{T.porticoL(g,n,X-.28,X+.28,.86,1.02,15,7,6,{st:'#ebe2ca',rf:RF,rs:RS});});
        S.o(1.42,(g)=>{boxZ(g,X-.24,1.04,.48,.05,0,1,'#d8d0bc','#cbc3af','#a39b87');});
        // 右角圓頂圖書館（石砌方塊、高拱窗閱覽室、鼓座＋銅綠圓頂＋採光亭；門朝草坪）
        S.o(1.5,(g,n)=>{const{u0,v0,du,dv}=LB,h=20,u1=u0+du,v1=v0+dv,uc=u0+du/2,vc=v0+dv/2;
          const CL={wl:'#e6dcc3',wr:'#ab9e80',bl:'#9d937f',br:'#7a7262',cor:'#f3ecdc',cs:'#f3ecdc',sill:'#f5efe0',sillR:'#c2b699',gl:GL,gd:GD};
          T.mass(g,n,u0,v0,du,dv,h,CL,{fl:1,z0:4,fh:0,w:3,wh:11,pitch:7,st:'arch',seed:3261,skipL:[[uc-.07,uc+.07]],lit:.7});
          T.doorL(g,n,v1,uc,5,9,CL.cor,'#4b3226');faceL(g,v1,uc-.1,uc+.1,11,12,CL.cor);
          boxZ(g,u0+.03,v0+.03,du-.06,dv-.06,h,3,'#d6cbb0',SH(CL.wl,-6),SH(CL.wr,-4));
          T.flatTop(g,u0+.03,v0+.03,du-.06,dv-.06,h+3,'#8c9095',{cap:'#efe7d4'});
          T.cyl(g,n,uc,vc,.15,h+3,5,['#f0e8d6','#e2d8c1','#cbbfa4','#b0a488','#958a70'],{pil:8,pc:'#f7f1e2',pd:'#a79b7f'});
          T.dome(g,uc,vc,.15,h+8,9,COP,{ribs:6});
          const lp=P(uc,vc,h+17);RC(g,lp[0]-1,lp[1]-3,3,3,'#efe7d4');RC(g,lp[0]+1,lp[1]-3,1,3,'#b3a68a');RC(g,lp[0]-1,lp[1]-4,3,1,COP[2]);RC(g,lp[0],lp[1]-6,1,2,'#caa54a');});
        S.o(1.52,(g)=>{boxZ(g,LB.u0+.15,.74,.24,.05,0,1,'#d8d0bc','#cbc3af','#a39b87');});
        // 左後教學館（兩層、雙坡石板瓦、+u 面側門與雨遮、山牆圓窗）
        S.o(1.6,(g,n)=>{const u0=.18,v0=.98,du=.50,dv=1.04,h=20,u1=u0+du,v1=v0+dv,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:2,z0:3.5,fh:8.5,w:3,wh:5,pitch:7,seed:3241,hood:1,skipR0:[[1.56,1.74]]});
          T.gableV(g,u0,v0,du,dv,h,10,{rf:RF,rs:RS,wl:C.wl,ov:.04});faceL(g,v1,u0,u1,h-2,h,C.cor);
          const oc=P(um,v1,h+4);RC(g,oc[0]-2,oc[1]-2,5,5,C.cor);RC(g,oc[0]-1,oc[1]-1,3,3,GL);if(n)RC(n,oc[0]-1,oc[1]-1,3,3,T.LIT);
          T.doorR(g,n,u1,1.645,5,8,C.cor,'#3f2a20');boxZ(g,u1,1.57,.07,.15,9,1,'#6b737e','#5d6672','#454c57');});
        T.statue(S,X,1.645,2.2);
        // 樹、花叢、長凳、路燈、腳踏車、人
        T.tree(S,.95,1.30,1.2,0);T.tree(S,.92,2.20,1.3,2);T.tree(S,1.00,2.80,1.2,1);
        T.tree(S,1.90,1.30,1.2,1);T.tree(S,2.30,1.62,1.3,0);T.tree(S,2.36,2.62,1.25,1);T.tree(S,2.88,1.40,1.1,2);T.tree(S,2.86,2.20,1.15,0);T.tree(S,1.88,2.86,1.05,1);
        T.bush(S,X-.22,1.20,2);T.bush(S,X+.22,1.20,2);
        T.bench(S,X-.22,1.34,false,2.7);T.bench(S,X+.12,2.20,false,3.7);T.bench(S,X-.22,2.30,false,3.7);T.bench(S,2.48,1.20,false,3.9);
        T.lamp(S,X-.08,2.00,11,3.4);T.lamp(S,X+.12,2.00,11,3.7);T.lamp(S,X-.08,2.60,11,4.0);T.lamp(S,X+.12,2.60,11,4.3);T.lamp(S,2.58,1.60,11,4.2);T.lamp(S,2.76,2.40,11,5.2);
        T.bikes(S,1.74,.80,.50,true,2.6,3271);
        T.crowd(S,4.4,[[X-.04,1.20,'#c24a3a',{bag:'#2f5f96'}],[X+.02,1.40,'#2f5f96'],[.84,1.62,'#e8c23a',{run:1}],[2.64,1.10,'#f4f4ef'],[X-.06,2.30,'#3f7f4a',{bag:'#6b4a2a'}],[X+.06,2.72,'#8a5bb0'],
          [.84,1.68,'#d9d9d4'],[2.66,1.90,'#c24a3a'],[2.64,2.50,'#2f5f96',{run:1}],[1.62,1.66,'#e0a83a'],[1.50,.96,'#3a3f4d'],[1.10,.94,'#c24a3a'],[2.70,.80,'#2a2d31']]);
        // 前緣鐵柵＋石門柱、兩處校門（門柱燈）；左角旗桿
        const PC={wl:'#ddd3bb',wr:'#a4987c',cap:'#f0e8d4'},L0=.70,LL=2.955-L0;
        T.rail(S,[L0,2.955],[X-.16,2.955],{d:5});T.rail(S,[X+.16,2.955],[2.56,2.955],{d:5});T.rail(S,[2.77,2.955],[2.955,2.955],{d:5});
        T.rail(S,[2.955,1.04],[2.955,2.955],{d:5});
        T.piers(S,[[X-.16,2.955,1],[X+.16,2.955,1],[2.56,2.955],[2.77,2.955],[2.955,2.955]],5.1,PC,6);
        const fa=T.flagpole(S,.10,2.88,10,3.1);
        return{flagAt:fa};
      },
      // ---------- v1 現代白色量體＋玻璃橋：左後五層白色板樓（通長帶窗、灰石樓梯核、內凹玻璃大廳＋懸挑雨遮、屋頂機房）與右後三層教學長樓（整面玻璃＋赤陶色垂直遮陽鰭、綠屋頂＋太陽能板）以二樓玻璃空橋相連；
      //      左前玻璃方盒圖書館（白色懸挑屋頂板、夾層樓板）；右前斜屋頂階梯講堂（鋅板立縫屋面）；中央淺色廣場＋長條倒影池、樹陣、長椅、腳踏車；前緣綠籬；左角旗桿 ----------
      (g,ng,S)=>{
        const W1='#eef0ee',W2='#b2b8ba',WB='#8e9597',GLc='#5b88a8',GDc='#3e6380',GHc='#a6c6da',MUL='#dde7ee',MULd='#97a8b5',FIN='#c56b4c';
        pave(g,'g',0,0,3,3,3301);
        paint(g,(u,v)=>(v>2.26&&u<1.06)||(u>1.94&&v>1.94)?stripe(5,5)(u,v):null);
        pave(g,'c',.12,.90,1.04,.16,3302,.25);
        pave(g,'c',1.14,.72,1.72,.30,3303,.25);
        pave(g,'c',1.14,1.02,.74,1.93,3304,.25);
        pave(g,'c',.12,1.06,.14,1.20,3305,.25);
        pave(g,'c',1.88,1.86,1.07,.10,3306,.25);
        flat(g,1.27,1.21,.44,.80,'#e4e8e6');flat(g,1.29,1.23,.40,.76,'#4f86a6');
        for(let k=0;k<6;k++){const u=1.33+hsh(3307,k,1)*.3,v=1.28+hsh(3307,k,2)*.64,p=P(u,v);RC(g,p[0],p[1],3,1,'#8fbfd8');}
        lineU(g,1.235,1.29,1.69,'#3d6f8e');lineV(g,1.29,1.235,1.99,'#3d6f8e');
        shadow(g,[['b',.18,.18,.96,.72,58],['b',1.58,.18,1.26,.54,36],['b',.22,1.44,.80,.80,26],['b',1.96,1.10,.88,.76,18],
          ['c',1.02,2.40,5,15],['c',1.02,2.74,5,15],['c',1.98,2.36,5,15],['c',2.30,2.36,5,15],['c',2.62,2.36,5,15]]);
        // A 五層板樓
        S.o(1,(g,n)=>{const u0=.18,v0=.18,du=.96,dv=.72,h=46,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,W1,W2);faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          for(let f=0;f<4;f++){const z=12+f*8.4;
            faceL(g,v1,.36,u1-.04,z,z+5,GLc);faceL(g,v1,.36,u1-.04,z+3.5,z+4.5,GHc);for(let t=.36+.125;t<u1-.05;t+=.125)faceL(g,v1,t-1/64,t+1/64,z,z+5,MUL);
            faceR(g,u1,v0+.04,v1-.04,z,z+5,GDc);for(let t=v0+.04+.12;t<v1-.05;t+=.12)faceR(g,u1,t-1/64,t+1/64,z,z+5,MULd);
            faceL(g,v1,.36,u1-.04,z-1,z,'#dfe2e0');
            if(n){for(let i=0;i<6;i++){const a=.37+i*.125;if(hsh(3311,f,i)<.55)faceL(n,v1,a,Math.min(u1-.05,a+.11),z,z+5,T.LIT);}for(let i=0;i<5;i++){const a=v0+.05+i*.12;if(hsh(3312,f,i)<.45)faceR(n,u1,a,Math.min(v1-.05,a+.1),z,z+5,T.LIT2);}}}
          faceL(g,v1,u0,.34,0,h,'#c9cdcc');for(let z=6;z<h-4;z+=8.4)faceL(g,v1,.25,.27,z,z+5,'#6f8292');
          faceL(g,v1,.40,1.08,0,9,'#2d4556');for(let t=.40+.085;t<1.08;t+=.085)faceL(g,v1,t-1/64,t+1/64,0,9,'#9fb6c6');faceL(g,v1,.70,.80,0,7,'#5f86a0');
          if(n){faceL(n,v1,.41,1.07,0,8.5,'#fff0c4');}
          faceR(g,u1,.36,.62,0,9,'#2a3f4f');
          T.flatTop(g,u0,v0,du,dv,h,'#9aa0a2',{cap:'#f6f7f5'});
          boxZ(g,.30,.28,.34,.26,h,6,'#c9cdcc','#dcdfde','#a3a9ab');for(let t=.34;t<.62;t+=.06)faceL(g,.54,t,t+.03,h+1,h+5,'#8e9597');
          boxZ(g,.80,.30,.22,.14,h,2,'#7d8487','#8e9597','#6d7477');});
        S.o(1.05,(g,n)=>{boxZ(g,.38,.90,.74,.13,9,1.5,'#f6f7f5','#e3e6e5','#aab0b2');for(const t of[.42,1.06])boxZ(g,t,1.0,.02,.02,0,9,null,'#d6dad9','#a3a9ab');
          if(n){const p=P(.75,1.03,9);RC(n,p[0]-6,p[1]+1,12,1,'rgba(255,236,190,.6)');}});
        // 玻璃空橋（二樓）
        S.o(1.5,(g,n)=>{const u0=1.14,u1=1.58,v0=.38,v1=.60,z0=16,h=8;
          boxZ(g,u0,v0,u1-u0,v1-v0,z0,h,'#e9eceb',GLc,GDc);faceL(g,v1,u0,u1,z0,z0+1.5,'#f4f5f3');faceL(g,v1,u0,u1,z0+h-1.5,z0+h,'#f4f5f3');
          for(let t=u0+.07;t<u1-.03;t+=.07)faceL(g,v1,t-1/64,t+1/64,z0,z0+h,MUL);faceL(g,v1,u0,u1,z0+2.5,z0+3.5,GHc);
          if(n)faceL(n,v1,u0+.02,u1-.02,z0+1.5,z0+h-1.5,'#fff0c4');});
        // B 三層教學長樓（玻璃＋赤陶遮陽鰭）
        S.o(1.6,(g,n)=>{const u0=1.58,v0=.18,du=1.26,dv=.54,h=30,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,W1,W2);faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          faceL(g,v1,u0+.03,u1-.03,2,h-3,GLc);for(const z of[10.5,19.5])faceL(g,v1,u0+.03,u1-.03,z,z+1.5,'#e8ebea');
          for(const z of[2,11.5,20.5])faceL(g,v1,u0+.03,u1-.03,z+5,z+6,GHc);
          faceL(g,v1,1.80,2.04,0,9,'#2d4556');for(let t=1.84;t<2.04;t+=.06)faceL(g,v1,t-1/64,t+1/64,0,9,'#9fb6c6');
          if(n){for(let f=0;f<3;f++)for(let i=0;i<9;i++){const a=u0+.05+i*.135;if(f===0&&a>1.76&&a<2.06)continue;if(hsh(3321,f,i)<.55)faceL(n,v1,a,a+.12,2.5+f*9,9.5+f*9,T.LIT);}faceL(n,v1,1.81,2.03,.5,8.5,'#fff0c4');}
          for(let f=0;f<3;f++){const z=4+f*9;faceR(g,u1,v0+.06,v1-.06,z,z+4,GDc);for(let t=v0+.06+.1;t<v1-.07;t+=.1)faceR(g,u1,t-1/64,t+1/64,z,z+4,MULd);if(n&&hsh(3322,f,1)<.5)faceR(n,u1,v0+.07,v1-.07,z,z+4,T.LIT2);}
          T.flatTop(g,u0,v0,du,dv,h,'#9aa0a2',{cap:'#f6f7f5'});
          flat(g,u0+.06,v0+.06,.52,dv-.12,'#6c9a4c',h);for(let i=0;i<8;i++){const p=P(u0+.08+hsh(3323,i,1)*.48,v0+.08+hsh(3323,i,2)*(dv-.16),h);RC(g,p[0],p[1]-1,2,1,hsh(3323,i,3)<.5?'#8cc063':'#4f7f35');}
          for(let r=0;r<2;r++){const vv=v0+.08+r*.2;boxZ(g,u0+.66,vv,.52,.12,h,1.5,'#2f4f78','#3f6690','#243d5e');for(let t=u0+.72;t<u0+1.18;t+=.08)BL(g,P(t,vv,h+1.5),P(t,vv+.12,h+1.5),'#6f93b8');}});
        S.o(1.62,(g)=>{for(let t=1.62;t<2.84;t+=.1){if(t>1.78&&t<2.06)continue;boxZ(g,t,.72,1/32,.04,2,26,SH(FIN,30),FIN,SH(FIN,-46));}});
        S.o(1.64,(g,n)=>{boxZ(g,1.78,.72,.28,.12,9,1.5,'#f6f7f5','#e3e6e5','#aab0b2');if(n){const p=P(1.92,.84,9);RC(n,p[0]-4,p[1]+1,8,1,'rgba(255,236,190,.6)');}});
        // 玻璃方盒圖書館（白色懸挑屋頂板）
        S.o(2.6,(g,n)=>{const u0=.24,v0=1.46,du=.76,dv=.76,h=22,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,GLc,GDc);
          faceL(g,v1,u0,u1,0,1,'#dfe3e1');faceR(g,u1,v0,v1,0,1,'#a6adaf');
          faceL(g,v1,u0,u1,10.5,12,'#f1f3f1');faceR(g,u1,v0,v1,10.5,12,'#c3c9ca');
          for(const z of[7,18])faceL(g,v1,u0,u1,z,z+1,GHc);
          for(let t=u0+.095;t<u1-.02;t+=.095){faceL(g,v1,t-1/64,t+1/64,0,h,MUL);}for(let t=v0+.095;t<v1-.02;t+=.095){faceR(g,u1,t-1/64,t+1/64,0,h,MULd);}
          for(let i=0;i<7;i++){const a=u0+.03+i*.1;faceL(g,v1,a,a+.06,1.5,4.5,'#6e5a44');faceL(g,v1,a,a+.06,13,16,'#6e5a44');}
          faceR(g,u1,1.78,1.90,0,8,'#2d4556');
          for(const[a,b]of[[u0,v1],[u1,v1],[u1,v0]])boxZ(g,a-.015,b-.015,.03,.03,0,h,null,'#f4f5f3','#c3c9ca');
          boxZ(g,u0-.07,v0-.07,du+.14,dv+.14,h,3,'#f6f7f5','#e6e8e6','#b3b8b9');
          if(n){for(let i=0;i<7;i++){if(hsh(3331,i,1)<.7)faceL(n,v1,u0+.02+i*.105,u0+.09+i*.105,1.5,10,'#ffe7b0');if(hsh(3331,i,2)<.6)faceL(n,v1,u0+.02+i*.105,u0+.09+i*.105,12.5,20,'#ffe7b0');}
            for(let i=0;i<7;i++){if(hsh(3332,i,1)<.5)faceR(n,u1,v0+.02+i*.105,v0+.09+i*.105,1.5,10,'#f3d68e');}}});
        // 斜屋頂階梯講堂
        S.o(2.9,(g,n)=>{const u0=1.96,u1=2.84,v0=1.10,v1=1.86,zb=22,zf=8;
          fp(g,[P(u1,v0,0),P(u1,v1,0),P(u1,v1,zf),P(u1,v0,zb)],W2);
          faceL(g,v1,u0,u1,0,zf,W1);faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          faceL(g,v1,u0+.12,u1-.12,1.5,6.5,GLc);faceL(g,v1,u0+.12,u1-.12,5,6,GHc);for(let t=u0+.12+.09;t<u1-.13;t+=.09)faceL(g,v1,t-1/64,t+1/64,1.5,6.5,MUL);
          if(n)faceL(n,v1,u0+.13,u1-.13,1.5,6,'#fff0c4');
          for(let t=v0+.12;t<v1-.1;t+=.14){const zz=zb-(zb-zf)*(t-v0)/(v1-v0);faceR(g,u1,t-.02,t+.02,3,Math.max(5,zz-4),GDc);}
          fp(g,[P(u0,v0,zb),P(u1,v0,zb),P(u1,v1,zf),P(u0,v1,zf)],'#7fa39a');
          for(let t=u0+.06;t<u1-.02;t+=.06)BL(g,P(t,v0+.01,zb),P(t,v1-.01,zf),'#6a8d84');
          BL(g,P(u0,v1,zf),P(u1,v1,zf),'#c8d2d8');BL(g,P(u1,v0,zb),P(u1,v1,zf),'#6f7e87');BL(g,P(u0,v0,zb),P(u1,v0,zb),'#b9c5cc');});
        // 景觀：樹陣、長凳、腳踏車、人
        for(const[u,v,k]of[[1.02,2.40,2],[1.02,2.74,0],[1.98,2.36,1],[2.30,2.36,2],[2.62,2.36,0],[1.98,2.70,0],[2.62,2.70,1]])T.tree(S,u,v,1.15,k);
        T.tree(S,.10,1.20,1.1,2,1.3);T.tree(S,2.90,.90,1.1,0);
        S.o(3.3,(g)=>{for(const[u,v]of[[1.18,1.40],[1.18,1.72],[1.76,1.40],[1.76,1.72]])boxZ(g,u,v,.04,.18,0,2,'#e9ebe8','#d6d9d6','#a9aeae');});
        T.bikes(S,.40,1.08,.60,true,2.2,3341);T.bikes(S,2.10,1.02,.60,true,2.3,3342);
        T.lamp(S,1.16,2.10,13,3.3,'m');T.lamp(S,1.84,2.10,13,4.0,'m');T.lamp(S,1.16,2.86,13,4.1,'m');T.lamp(S,1.84,2.86,13,4.8,'m');
        T.crowd(S,4.5,[[1.40,1.10,'#2f5f96',{bag:'#c24a3a'}],[1.50,1.08,'#e8c23a'],[1.22,2.20,'#f4f4ef'],[1.58,2.40,'#c24a3a',{run:1}],[1.46,2.62,'#3f7f4a'],
          [1.80,2.24,'#8a5bb0'],[.70,1.02,'#2a2d31'],[1.10,.98,'#d9d9d4'],[2.40,1.95,'#e0a83a'],[1.30,2.86,'#2f5f96'],[1.36,1.92,'#e8c23a',{bag:'#2a2d31'}]]);
        T.hedge(S,.30,2.90,.80,.05,4.9,3);T.hedge(S,1.94,2.90,.96,.05,5.9,3);T.hedge(S,2.90,1.02,.05,.80,4.5,3);T.hedge(S,2.90,2.00,.05,.90,5.6,3);
        const fa=T.flagpole(S,.12,2.84,10,3.1);
        return{flagAt:fa};
      },
      // ---------- v2 石造哥德式＋中庭：左後轉角高塔（三段、尖拱雙窗、鐘樓百葉、城垛＋四角尖塔、角扶壁）；後翼與左翼兩層石造長樓（扶壁、尖拱窗、陡石板瓦、屋脊煙囪）；
      //      前翼與右翼一層迴廊（尖拱廊）圍出方形中庭（十字石板步道、日晷、修剪草坪）；前翼正中城垛門樓（尖拱大門、兩側小尖塔）；右角禮拜堂式圖書館（扶壁、高尖窗、玫瑰窗、屋脊小尖塔）；前緣矮石牆與門柱；左角旗桿 ----------
      (g,ng,S)=>{
        const SL='#d2c7ad',SR='#958b74',SB='#8b8373',SC='#e9e1cc',RF='#56606c',RS='#3e4550',LG='#3d586c',LGd='#2b4152';
        const C={wl:SL,wr:SR,bl:SB,br:SH(SB,-18),cor:SC,cs:SC,sill:SC,sillR:SH(SC,-40),gl:LG,gd:LGd};
        pave(g,'g',0,0,3,3,3401);
        paint(g,(u,v)=>(u>.66&&u<1.98&&v>.66&&v<1.98)?stripe(0,8)(u,v):null);
        pave(g,'st',1.24,.66,.14,1.32,3402);pave(g,'st',.66,1.24,1.32,.14,3403);
        paint(g,(u,v)=>{const r=Math.hypot(u-1.31,v-1.31);if(r<.16)return'#cbc2ab';if(r<.19)return'#b3aa94';return null;});
        pave(g,'st',1.34,2.36,.16,.60,3404);pave(g,'gv',.70,2.40,2.25,.10,3405);pave(g,'gv',2.36,1.50,.10,.90,3406);
        shadow(g,[['b',.14,.14,.58,.58,82],['b',.70,.18,1.60,.48,36],['b',.18,.70,.48,1.60,36],['b',.66,1.96,1.64,.34,14],['b',1.96,.66,.34,1.30,14],['b',1.22,1.90,.40,.46,30],['b',2.46,.22,.44,1.24,34],
          ['c',.40,2.62,6,17],['c',2.20,2.66,6,17],['c',2.66,2.00,6,17],['c',.92,2.72,5,15]]);
        // 轉角高塔（先畫；兩翼疊在其前）
        S.o(1,(g,n)=>{const u0=.14,v0=.14,s=.58,u1=u0+s,v1=v0+s,uc=u0+s/2,vc=v0+s/2,h=66;
          boxZ(g,u0,v0,s,s,0,h,null,SL,SR);faceL(g,v1,u0,u1,0,2,SB);faceR(g,u1,v0,v1,0,2,SH(SB,-18));
          for(const z of[24,44]){faceL(g,v1,u0,u1,z,z+1.5,SC);faceR(g,u1,v0,v1,z,z+1.5,SH(SC,-40));}
          for(const t of[uc-.08,uc+.08]){T.win1(g,n,'L',v1,t,28,3,11,LG,{st:'pt',wall:SL,sill:SC,hood:SC},3411,rnd(t*50));T.win1(g,n,'R',u1,vc+(t-uc),28,3,11,LGd,{st:'pt',wall:SR,sill:SH(SC,-40)},3412,rnd(t*50));}
          T.win1(g,n,'L',v1,uc,8,3,9,LG,{st:'pt',wall:SL,sill:SC,hood:SC},3413,1);
          for(const t of[uc-.09,uc+.09]){faceL(g,v1,t-.05,t+.05,48,62,'#2a2522');faceL(g,v1,t-.05,t-.02,61,62,SL);faceL(g,v1,t+.02,t+.05,61,62,SL);for(let z=50;z<60;z+=2)faceL(g,v1,t-.05,t+.05,z,z+.8,'#6b625a');
            faceR(g,u1,vc+(t-uc)-.05,vc+(t-uc)+.05,48,62,'#1f1b19');faceR(g,u1,vc+(t-uc)-.05,vc+(t-uc)-.02,61,62,SR);faceR(g,u1,vc+(t-uc)+.02,vc+(t-uc)+.05,61,62,SR);for(let z=50;z<60;z+=2)faceR(g,u1,vc+(t-uc)-.05,vc+(t-uc)+.05,z,z+.8,'#4d4640');}
          
          for(const[a,b]of[[u1,v1],[u0,v1],[u1,v0]]){boxZ(g,a-.04,b-.04,.08,.08,0,h-2,null,SH(SL,6),SH(SR,-4));}
          boxZ(g,u0-.02,v0-.02,s+.04,s+.04,h-1,1.5,SC,SC,SH(SC,-40));
          T.cren(g,u0-.02,v0-.02,s+.04,s+.04,h+.5,SL,SR,SC);
          for(const[a,b]of[[u0,v0],[u1,v0],[u0,v1],[u1,v1]])T.pinn(g,a,b,h+.5,14,SL,SR,SH(SL,10),SR);});
        // 後翼（沿 u）
        S.o(1.2,(g,n)=>{const u0=.70,v0=.18,du=1.60,dv=.48,h=22,u1=u0+du,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:2,z0:3.5,fh:9,w:3,wh:6,pitch:8,st:'pt',seed:3421,hood:1});
          for(let t=u0+.125;t<u1-.05;t+=.25)T.buttL(g,v1,t,18,SL,SR,SC);
          const r=T.gableU(g,u0,v0,du,dv,h,15,{rf:RF,rs:RS,wr:SR,ov:.04});
          T.win1(g,n,'R',u1,v0+dv/2,h+2,3,8,LGd,{st:'pt',wall:SR,sill:SH(SC,-40)},3422,0);

          for(const u of[1.30,1.80])boxZ(g,u,.37,.06,.06,r.zt-2,7,'#8a8f93',SL,SR);});
        // 左翼（沿 v）
        S.o(1.21,(g,n)=>{const u0=.18,v0=.70,du=.48,dv=1.60,h=22,u1=u0+du,v1=v0+dv,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,C,{fl:2,z0:3.5,fh:9,w:3,wh:6,pitch:8,st:'pt',seed:3431,hood:1,noL:1});
          for(let t=v0+.125;t<v1-.05;t+=.25)T.buttR(g,u1,t,18,SL,SR,SC);
          T.gableV(g,u0,v0,du,dv,h,15,{rf:RF,rs:RS,wl:SL,ov:.04});
          T.win1(g,n,'L',v1,um,5,5,22,LG,{st:'pt',wall:SL,sill:SC,mul:SC,tr:11,trc:SC,lit:.8},3432,0);
          for(const t of[u0+.05,u1-.05])T.pinn(g,t,v1-.02,h,10,SL,SR,SH(SL,10),SR);
          T.pinn(g,um,v1-.02,h+15,7,SL,SR,SH(SL,10),SR);});
        // 右翼迴廊（沿 v，+u 面尖拱廊）
        S.o(1.6,(g,n)=>{const u0=1.96,v0=.66,du=.34,dv=1.30,h=11,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,SL,SR);faceR(g,u1,v0,v1,0,1.5,SH(SB,-18));
          for(let t=v0+.05;t<v1-.04;t+=.12){faceR(g,u1,t,t+.08,1.5,8,'#3a3430');faceR(g,u1,t,t+.02,7,8,SR);faceR(g,u1,t+.06,t+.08,7,8,SR);}
          faceL(g,v1,u0+.06,u1-.06,1.5,8,'#4a423c');
          T.gableV(g,u0,v0,du,dv,h,6,{rf:RF,rs:RS,wl:SL,ov:.03});});
        // 前翼（沿 u，+v 面小尖窗）＋門樓
        S.o(1.9,(g,n)=>{const u0=.66,v0=1.96,du=1.64,dv=.34,h=11,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,SL,SR);faceL(g,v1,u0,u1,0,1.5,SB);
          T.winRow(g,n,'L',v1,u0+.04,u1-.04,3,2,6,8,LG,{st:'pt',wall:SL,sill:SC,seed:3441,lit:.45},[[1.16,1.68]]);
          faceR(g,u1,v0+.06,v1-.06,1.5,8,'#3a3430');
          T.gableU(g,u0,v0,du,dv,h,6,{rf:RF,rs:RS,wr:SR,ov:.03});});
        S.o(2.0,(g,n)=>{const u0=1.22,v0=1.90,du=.40,dv=.46,h=24,u1=u0+du,v1=v0+dv,um=u0+du/2;
          boxZ(g,u0,v0,du,dv,0,h,null,SL,SR);faceL(g,v1,u0,u1,0,2,SB);faceR(g,u1,v0,v1,0,2,SH(SB,-18));
          faceL(g,v1,um-.14,um+.14,0,14,SC);faceL(g,v1,um-.11,um+.11,0,12,'#2e2824');faceL(g,v1,um-.11,um-.07,11,12,SC);faceL(g,v1,um+.07,um+.11,11,12,SC);faceL(g,v1,um-.11,um-.09,10,11,SC);faceL(g,v1,um+.09,um+.11,10,11,SC);
          for(let t=um-.09;t<um+.1;t+=.045)faceL(g,v1,t-1/64,t+1/64,2,10,'#5a4a3a');
          T.win1(g,n,'L',v1,um,16,4,5,LG,{st:'pt',wall:SL,sill:SC,mul:SC,lit:.8},3451,0);
          const sh=P(um,v1,20);RC(g,sh[0]-2,sh[1]-2,5,4,'#7a2e2a');RC(g,sh[0]-1,sh[1]-1,3,2,'#c9a64a');
          T.win1(g,n,'R',u1,v0+dv/2,14,3,6,LGd,{st:'pt',wall:SR},3452,0);
          boxZ(g,u0,v0,du,dv,h-1,1.5,SC,SC,SH(SC,-40));T.cren(g,u0,v0,du,dv,h+.5,SL,SR,SC);
          for(const[a,b]of[[u0,v1],[u1,v1]]){boxZ(g,a-.05,b-.05,.10,.10,0,h+6,null,SH(SL,4),SH(SR,-4));T.pinn(g,a,b,h+6,10,SL,SR,SH(SL,10),SR);}
          if(n){const lp=P(um,v1,13);RC(n,lp[0]-2,lp[1],5,1,'#ffe6a0');faceL(n,v1,um-.10,um+.10,1,4,'rgba(255,220,150,.55)');}});
        // 禮拜堂式圖書館（沿 v）
        S.o(1.7,(g,n)=>{const u0=2.46,v0=.22,du=.44,dv=1.24,h=20,u1=u0+du,v1=v0+dv,um=u0+du/2;
          boxZ(g,u0,v0,du,dv,0,h,null,SL,SR);faceL(g,v1,u0,u1,0,2,SB);faceR(g,u1,v0,v1,0,2,SH(SB,-18));
          faceR(g,u1,v0,v1,h-2,h,SH(SC,-40));
          for(let i=0;i<5;i++){const t=v0+.12+i*.25;if(t<v1-.05)T.win1(g,n,'R',u1,t,4,3,13,LGd,{st:'pt',wall:SR,sill:SH(SC,-40),tr:7,trc:SH(SC,-40),lit:.7},3461,i);}
          for(let t=v0+.245;t<v1-.1;t+=.25)T.buttR(g,u1,t,18,SL,SR,SC);
          T.gableV(g,u0,v0,du,dv,h,16,{rf:RF,rs:RS,wl:SL,ov:.04});
          const rp=P(um,v1,h+5);T.rose(g,n,rp[0],rp[1],0);
          faceL(g,v1,um-.06,um+.06,0,9,SC);faceL(g,v1,um-.04,um+.04,0,8,'#4b3226');faceL(g,v1,um-.04,um-.02,7,8,SC);faceL(g,v1,um+.02,um+.04,7,8,SC);
          for(const t of[u0+.04,u1-.04])T.pinn(g,t,v1-.02,h,9,SL,SR,SH(SL,10),SR);
          const fl=P(um,v0+.5,h+16);RC(g,fl[0]-1,fl[1]-7,2,7,'#5c6570');RC(g,fl[0],fl[1]-12,1,5,'#4a525c');RC(g,fl[0],fl[1]-13,1,1,'#caa54a');});
        // 中庭日晷、樹、人、長凳
        S.o(1.4,(g)=>{boxZ(g,1.27,1.27,.08,.08,0,4,'#e3ddcf','#d6cfbf','#a39c8c');const p=P(1.31,1.31,4);RC(g,p[0]-2,p[1]-1,4,1,'#9a8a5a');RC(g,p[0],p[1]-3,1,2,'#6b5e3c');});
        T.crowd(S,1.45,[[1.00,1.30,'#8a2f2a',{bag:'#3a3f4d'}],[1.10,1.36,'#2f5f96'],[1.56,1.10,'#e0d8c4'],[1.46,1.62,'#3f7f4a',{run:1}]]);
        T.tree(S,.40,2.62,1.4,2,2.5);T.tree(S,2.20,2.66,1.4,0);T.tree(S,2.66,2.00,1.35,1);T.tree(S,.92,2.72,1.2,3);T.tree(S,2.80,1.62,1.1,2);
        T.cypress(S,1.16,2.44,12);T.cypress(S,1.70,2.44,12);
        T.bench(S,.80,2.52,true,3.3);T.bench(S,1.90,2.52,true,4.4);
        T.lamp(S,1.30,2.60,11,3.9);T.lamp(S,1.54,2.60,11,4.1);
        T.crowd(S,4.6,[[1.40,2.56,'#2a2d31',{bag:'#8a2f2a'}],[1.46,2.80,'#c24a3a'],[2.00,2.44,'#e8c23a'],[2.40,2.10,'#2f5f96',{run:1}],[.60,2.46,'#d9d9d4'],[.66,2.47,'#3f7f4a']]);
        // 前緣矮石牆（門口留空）
        S.o(5,(g)=>{const w=(a0,a1)=>{boxZ(g,a0,2.91,a1-a0,.05,0,3,'#d9d0b9',SL,SR);};w(.40,1.30);w(1.54,2.95);boxZ(g,2.91,.40,.05,2.51,0,3,'#d9d0b9',SL,SR);
          for(const[u,v]of[[1.30,2.935],[1.54,2.935]])boxZ(g,u-.035,v-.035,.07,.07,0,6,'#d9d0b9',SL,SR);});
        const fa=T.flagpole(S,.12,2.84,10,3.1);
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_d k32',e);errs.push('k32:'+(e&&e.stack||e));}

  // ================= k113 大學城（4×4）=================
  try{
    build(113,{W:272,H:280,AX:136,AY:278,SZ:4},(L,T)=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,pave,shadow,paint,lineU,lineV,ell}=L;
      const GL=T.GL,GD=T.GD,GH=T.GH;
      const stripe=(a,b)=>(u,v)=>(Math.floor(a*u+b*v)%2)?'#7aa75a':'#72a052';
      const flag=(u,v)=>(Math.floor(u*8)+Math.floor(v*8))%2?'#c9c1ad':'#c2baa6';
      const BK={wl:'#b65b41',wr:'#803e2d',bl:'#8f897b',br:'#69645a',cor:'#ece2c8',cs:'#e2d5b6',sill:'#f1e9d4',sillR:'#b8ab8d',gl:GL,gd:GD};
      const STN={wl:'#e6dcc4',wr:'#aa9e82',bl:'#a39a86',br:'#7c7566',cor:'#f3ecdc',cs:'#efe7d4',sill:'#f7f1e2',sillR:'#c2b699',gl:GL,gd:GD};
      const RF='#5d6672',RS='#444b56',COP=['#a6d6c2','#86bda8','#68a28d','#518873','#3d6b5b'],STONE5=['#f2ebda','#e3d9c2','#cdc1a6','#b2a68a','#978b71'];
      return [
      // ---------- v0 圓廳軸線校園（學院村式）：後角（N）石砌圓廳主樓（兩層高窗、簷口、銅綠肋圓頂＋採光亭）正對前角的六柱山花門廊與三級台階；右後沿邊三層紅磚教學翼＋右角四層紅磚宿舍；
      //      左後沿邊石砌圖書館翼（一樓高拱窗閱覽室、山花山牆朝前）＋左角紅磚拱頂體育館；兩翼夾出 V 形前庭：中央對角軸線步道＋橫向步道、圓形噴泉廣場、割草紋草坪與樹列；前緣鐵柵、前角校門；左角旗桿 ----------
      (g,ng,S)=>{
        const R0={u:.80,v:.80,r:.55,h:30};
        pave(g,'g',0,0,4,4,11301);
        paint(g,(u,v)=>(u>1.0&&v>1.0)?stripe(4.5,-4.5)(u+8,v):null);
        pave(g,'st',1.45,.80,2.40,.20,11302);pave(g,'st',.80,1.45,.20,2.40,11303);
        paint(g,(u,v)=>{const d=Math.abs(u-v),s=u+v,r=Math.hypot(u-2.55,v-2.55);
          if(r<.64&&r>.44)return flag(u,v);if(r<=.44)return null;
          if(s>2.2&&s<3.1&&d<.62)return flag(u,v);
          if(d<.11&&s>2.8)return flag(u,v);if(Math.abs(s-5.1)<.13&&u>.95&&v>.95)return flag(u,v);return null;});
        shadow(g,[['c',R0.u,R0.v,26,60],['b',1.45,.30,1.20,.50,34],['b',.30,1.45,.50,1.20,34],['b',2.80,.20,1.05,.60,44],['b',.30,2.82,.80,.98,24],
          ['c',1.80,2.30,6,16],['c',2.30,1.80,6,16],['c',1.55,3.30,6,16],['c',3.30,1.55,6,16],['c',3.30,3.00,5,15],['c',3.00,3.30,5,15],['c',3.62,3.30,5,15],['c',3.30,3.62,5,15]]);
        // 圓廳主樓（N 角）：兩層高窗＋簷口＋女兒牆環＋銅綠肋圓頂＋採光亭
        S.o(1,(g,n)=>{const{u,v,r,h}=R0;
          T.cyl(g,n,u,v,r,0,3,['#c9bea6','#b8ad96','#a79c86','#958b76','#837a66']);
          T.cyl(g,n,u,v,r-.01,3,h-3,STONE5,{pil:14,pc:'#fbf6ea',pd:'#a79b7f'});
          T.cyl(g,n,u,v,r-.01,3,h-3,STONE5,{noFill:1,win:{n:8,z0:3,z1:11,w:3,arch:1,seed:11312,lit:.6}});
          T.cyl(g,n,u,v,r-.01,3,h-3,STONE5,{noFill:1,win:{n:8,z0:15,z1:21,w:3,arch:1,seed:11313,lit:.5}});
          T.cyl(g,n,u,v,r+.02,h-1,2,['#fbf6ea','#f2ebda','#e3d9c2','#cdc1a6','#b2a68a'],{cap:'#efe7d4'});
          T.cyl(g,n,u,v,r-.03,h+1,4,STONE5,{cap:'#d9d0ba'});
          T.dome(g,u,v,r-.08,h+5,20,COP,{ribs:10});
          T.cyl(g,n,u,v,.07,h+25,4,STONE5,{pil:4});T.dome(g,u,v,.075,h+29,4,COP);
          const ap=P(u,v,h+33);RC(g,ap[0],ap[1]-4,1,4,'#caa54a');RC(g,ap[0]-1,ap[1]-3,3,1,'#caa54a');});
        // 正面六柱山花門廊（朝前角）
        S.o(1.05,(g,n)=>{T.porticoS(g,n,0,2.15,2.85,.31,17,9,6,{st:'#efe8d6',rfL:'#7b8490',rfR:'#59616c',sh:'#6f6656'});});
        // 右後教學翼（三層紅磚、四坡瓦、中央石框大門）
        S.o(1.2,(g,n)=>{const u0=1.45,v0=.30,du=1.20,dv=.50,h=26,u1=u0+du,v1=v0+dv,um=2.05;
          T.mass(g,n,u0,v0,du,dv,h,BK,{fl:3,z0:3.5,fh:8,w:3,wh:5,pitch:7,seed:11321,hood:1,skipL0:[[um-.08,um+.08]]});
          T.hipU(g,u0,v0,du,dv,h,9,{rf:RF,rs:RS,ov:.04});
          T.doorL(g,n,v1,um,6,9,BK.cor,'#4b3226');faceL(g,v1,um-.12,um+.12,10.5,11.5,BK.cor);
          boxZ(g,1.75,.52,.07,.08,31,7,'#8a8f93',BK.wl,BK.wr);boxZ(g,2.35,.52,.07,.08,31,7,'#8a8f93',BK.wl,BK.wr);});
        // 左後圖書館翼（石砌、一樓高拱窗閱覽室、二樓小窗、山花山牆朝前）
        S.o(1.21,(g,n)=>{const u0=.30,v0=1.45,du=.50,dv=1.20,h=26,u1=u0+du,v1=v0+dv,um=u0+du/2;
          T.mass(g,n,u0,v0,du,dv,h,STN,{fl:1,z0:4,fh:0,w:3,wh:12,pitch:7,st:'arch',seed:11331,lit:.75,skipL:[[um-.08,um+.08]]});
          T.winRow(g,n,'R',u1,v0+.04,v1-.04,19,3,4,7,GD,{sill:STN.sillR,wall:STN.wr,seed:11332},[]);T.winRow(g,n,'L',v1,u0+.04,u1-.04,19,3,4,7,GL,{sill:STN.sill,hi:GH,wall:STN.wl,seed:11333},[]);
          faceL(g,v1,u0,u1,17,18,STN.cs);faceR(g,u1,v0,v1,17,18,SH(STN.cs,-40));faceL(g,v1,u0,u1,h-2,h,STN.cor);faceR(g,u1,v0,v1,h-2,h,SH(STN.cor,-40));
          T.gableV(g,u0,v0,du,dv,h,9,{rf:RF,rs:RS,wl:SH(STN.wl,-8),ov:.04});
          BL(g,P(u0,v1,h),P(um,v1,h+9),STN.cor);BL(g,P(um,v1,h+9),P(u1,v1,h),STN.cor);
          T.doorL(g,n,v1,um,5,10,STN.cor,'#4b3226');});
        // 右角宿舍（四層紅磚、雙坡瓦、正門雨遮與門楣校徽）
        S.o(1.4,(g,n)=>{const u0=2.80,v0=.20,du=1.05,dv=.60,h=34,u1=u0+du,v1=v0+dv,um=3.32;
          const C2=Object.assign({},BK,{wl:'#a9533c',wr:'#763627'});
          T.mass(g,n,u0,v0,du,dv,h,C2,{fl:4,z0:3,fh:7.8,w:3,wh:4,pitch:6,seed:11341,skipL0:[[um-.08,um+.08]],lit:.6});
          T.gableU(g,u0,v0,du,dv,h,10,{rf:'#6b5a52',rs:'#4e4039',wr:C2.wr,ov:.04});
          T.doorL(g,n,v1,um,6,8,'#e8dcc0','#3a4a58');boxZ(g,um-.12,v1,.24,.10,8.5,1.5,'#dcd3c0','#cfc6b3','#9d9585');
          const sg=P(um,v1,30);RC(g,sg[0]-5,sg[1]-2,11,3,'#efe4c8');});
        // 左角紅磚拱頂體育館（拱形山牆朝前、高側窗）
        S.o(1.6,(g,n)=>{T.barrel(g,n,.30,2.82,.80,.98,16,10,'v',{wl:'#b65b41',wr:'#803e2d',trim:'#ece2c8',edge:'#4d555e',gl:GL,gd:GD,seed:11361,tones:['#aab7bf','#94a2ab','#7e8c96','#6a7781','#58646e']});});
        T.fountain(S,2.55,2.55,.36,3.0);
        // 樹列、長凳、路燈、腳踏車、人
        for(const[u,v,k,s]of[[1.80,2.30,0,1.3],[2.30,1.80,2,1.3],[1.55,3.30,1,1.35],[3.30,1.55,0,1.35],[3.30,3.00,2,1.2],[3.00,3.30,1,1.2],[3.62,3.30,0,1.15],[3.30,3.62,2,1.15],[1.25,2.10,1,1.1],[2.10,1.25,0,1.1],[1.25,3.75,2,1.0],[3.75,1.25,1,1.0]])T.tree(S,u,v,s,k);
        T.bench(S,2.02,2.45,false,4.6);T.bench(S,2.45,2.02,true,4.6);T.bench(S,3.00,2.60,false,5.7);T.bench(S,2.60,3.00,true,5.7);
        T.lamp(S,2.95,3.12,12,6.2);T.lamp(S,3.12,2.95,12,6.2);T.lamp(S,1.50,1.72,12,3.3);T.lamp(S,1.72,1.50,12,3.3);T.lamp(S,1.40,3.62,12,5.1);T.lamp(S,3.62,1.40,12,5.1);
        T.bikes(S,2.95,.88,.60,true,1.9,11371);T.bikes(S,1.04,2.60,.26,false,3.7,11372);
        T.crowd(S,6.5,[[1.52,1.56,'#c24a3a',{bag:'#2f5f96'}],[1.62,1.60,'#2f5f96'],[2.10,2.02,'#e8c23a',{run:1}],[2.96,2.14,'#f4f4ef'],[2.14,2.96,'#3f7f4a',{bag:'#6b4a2a'}],[3.40,3.46,'#8a5bb0'],
          [3.52,3.60,'#d9d9d4'],[2.06,.94,'#c24a3a'],[3.30,.92,'#2f5f96',{run:1}],[.92,1.80,'#e0a83a'],[2.70,2.66,'#3a3f4d'],[1.70,2.90,'#c24a3a'],[2.90,1.70,'#2a2d31'],[3.10,3.14,'#e8c23a'],[.94,2.40,'#8a2f2a',{bag:'#3a3f4d'}]]);
        // 前緣鐵柵、前角校門；左角旗桿
        const PC={wl:'#ddd3bb',wr:'#a4987c',cap:'#f0e8d4'};
        T.rail(S,[1.25,3.955],[3.62,3.955],{d:8});T.rail(S,[3.955,.90],[3.955,3.62],{d:8});
        T.piers(S,[[3.62,3.955,1],[3.955,3.62,1]],8.1,PC,7);
        const fa=T.flagpole(S,.06,3.94,10,4.1);
        return{flagAt:fa};
      },
      // ---------- v1 現代校園：後角八層白色教學塔樓（垂直框柱玻璃立面、玻璃大廳＋雨遮、屋頂機房與藍色校名帶）；右後沿邊懸浮銅板盒圖書館（退縮玻璃基座上方懸挑兩層銅色盒體、橫向長條窗）；
      //      左後沿邊兩棟五層學生宿舍板樓（彩色陽台板）；右角運動中心（淺灰金屬牆、青綠色帶、玻璃高側窗、半透明低坡屋頂、玻璃大門）；
      //      中央淺色鋪面廣場（方形樹池、紅色拱形雕塑、線形噴泉與長凳、圖書館前陽傘咖啡座）、前方草坪與對角步道、腳踏車列、前緣綠籬；左角旗桿 ----------
      (g,ng,S)=>{
        const W1='#eef0ee',W2='#b2b8ba',WB='#8e9597',GLc='#5b88a8',GDc='#3e6380',GHc='#a6c6da',MUL='#dde7ee',MULd='#97a8b5';
        pave(g,'g',0,0,4,4,11401);
        paint(g,(u,v)=>(u+v>5.9)?stripe(5,5)(u,v):null);
        pave(g,'c',1.20,1.15,1.95,1.95,11402,.25);pave(g,'c',.88,1.20,.32,2.60,11403,.25);pave(g,'c',1.20,1.05,2.00,.10,11404,.25);pave(g,'c',3.15,1.60,.70,.30,11405,.25);
        paint(g,(u,v)=>{if(u+v<5.9)return null;if(Math.abs(u-v)<.10)return((Math.floor(u*8)+Math.floor(v*8))%2)?'#d3d0c6':'#cdcac0';if(Math.abs(u-3.4)<.07&&v>3.0)return'#d3d0c6';if(Math.abs(v-3.4)<.07&&u>3.0)return'#d3d0c6';return null;});
        flat(g,1.40,2.62,1.30,.14,'#e4e8e6');flat(g,1.42,2.64,1.26,.10,'#4f86a6');for(let k=0;k<9;k++){const p=P(1.47+k*.14,2.69);RC(g,p[0],p[1]-1,1,1,'#d8eef8');}
        shadow(g,[['b',.25,.25,.90,.80,110],['b',1.35,.22,1.70,.83,50],['b',.25,1.35,.60,.90,48],['b',.25,2.55,.60,.90,48],['b',3.15,.20,.70,1.40,26]]);
        // 八層教學塔樓
        S.o(1,(g,n)=>{const u0=.25,v0=.25,du=.90,dv=.80,h=66,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,W1,W2);faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          for(let f=0;f<7;f++){const z=9.5+f*7.6;faceL(g,v1,u0+.04,u1-.04,z,z+5,GLc);faceL(g,v1,u0+.04,u1-.04,z+4,z+5,GHc);faceR(g,u1,v0+.04,v1-.04,z,z+5,GDc);
            if(n){for(let i=0;i<5;i++){const a=u0+.05+i*.165;if(hsh(11411,f,i)<.5)faceL(n,v1,a,a+.14,z,z+5,T.LIT);}for(let i=0;i<4;i++){const a=v0+.05+i*.175;if(hsh(11412,f,i)<.45)faceR(n,u1,a,a+.15,z,z+5,T.LIT2);}}}
          for(let t=u0+.04;t<=u1-.04+1e-6;t+=5/32)faceL(g,v1,t-1/64,t+1/64,8.5,h-3,W1);for(let t=v0+.04;t<=v1-.04+1e-6;t+=5/32)faceR(g,u1,t-1/64,t+1/64,8.5,h-3,'#c5cacc');
          faceL(g,v1,u0+.22,u1-.06,0,7,'#2d4556');for(let t=u0+.26;t<u1-.06;t+=.08)faceL(g,v1,t-1/64,t+1/64,0,7,'#9fb6c6');if(n)faceL(n,v1,u0+.23,u1-.07,.5,6.5,'#fff0c4');
          faceL(g,v1,u0,u1,h-6,h-2.5,'#2f5f96');for(let t=u0+.1;t<u0+.5;t+=.06)faceL(g,v1,t,t+1/32,h-5,h-3.5,'#f2f2ee');
          T.flatTop(g,u0,v0,du,dv,h,'#9aa0a2',{cap:'#f6f7f5'});boxZ(g,u0+.14,v0+.12,.46,.40,h,6,'#c9cdcc','#dcdfde','#a3a9ab');for(let t=u0+.18;t<u0+.58;t+=.06)faceL(g,v0+.52,t,t+.03,h+1,h+5,'#8e9597');});
        S.o(1.05,(g,n)=>{boxZ(g,.44,1.05,.64,.14,8,1.5,'#f6f7f5','#e3e6e5','#aab0b2');for(const t of[.48,1.02])boxZ(g,t,1.16,.02,.02,0,8,null,'#d6dad9','#a3a9ab');if(n){const p=P(.76,1.19,8);RC(n,p[0]-6,p[1]+1,12,1,'rgba(255,236,190,.6)');}});
        // 左後兩棟宿舍板樓（彩色陽台板）
        const BAL=['#e8a33c','#d9573f','#3f9a8e','#e9c83c'];
        const slab=(v0,seed,d)=>S.o(d,(g,n)=>{const u0=.25,du=.60,dv=.90,h=40,u1=u0+du,v1=v0+dv;
          boxZ(g,u0,v0,du,dv,0,h,null,'#ebe8e1','#aca79d');faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          for(let f=0;f<5;f++){const z=3+f*7.4;
            for(let i=0;i<6;i++){const t=v0+.08+i*.13;faceR(g,u1,t,t+.07,z,z+4.5,GDc);faceR(g,u1,t+.075,t+.12,z,z+3,BAL[(i+f+seed)%4]);if(n&&hsh(seed,f,i)<.55)faceR(n,u1,t,t+.07,z,z+4.5,T.LIT2);}
            boxZ(g,u1,v0+.04,.05,dv-.08,z-.5,1,'#f4f5f3','#dfe2e1','#b3b8b9');
            for(let i=0;i<3;i++){const t=u0+.1+i*.18;faceL(g,v1,t,t+.08,z,z+4.5,GLc);if(n&&hsh(seed+1,f,i)<.55)faceL(n,v1,t,t+.08,z,z+4.5,T.LIT);}}
          T.flatTop(g,u0,v0,du,dv,h,'#9aa0a2',{cap:'#f6f7f5'});boxZ(g,u0+.12,v0+.2,.22,.18,h,5,'#b9bfc1','#cdd2d3','#9aa0a2');});
        slab(1.35,11421,1.2);slab(2.55,11431,1.3);
        // 右後懸浮銅板盒圖書館
        S.o(1.5,(g,n)=>{const a0=1.45,a1=2.95,b0=.32,b1=.95;
          boxZ(g,a0,b0,a1-a0,b1-b0,0,10,null,GLc,GDc);faceL(g,b1,a0,a1,0,1,'#dfe3e1');for(let t=a0+.08;t<a1;t+=.08)faceL(g,b1,t-1/64,t+1/64,0,10,MUL);for(let t=b0+.08;t<b1;t+=.08)faceR(g,a1,t-1/64,t+1/64,0,10,MULd);
          faceL(g,b1,2.10,2.30,0,8,'#2d4556');if(n){faceL(n,b1,a0+.02,a1-.02,1,9,'#ffe7b0');faceR(n,a1,b0+.02,b1-.02,1,9,'#f3d68e');}});
        S.o(1.55,(g,n)=>{const u0=1.35,u1=3.05,v0=.22,v1=1.05,z0=10,h=18,CU='#b87a4e',CUd='#7e5238';
          boxZ(g,u0,v0,u1-u0,v1-v0,z0,h,null,CU,CUd);
          for(let t=u0+.03;t<u1;t+=2/32)faceL(g,v1,t,t+1/32,z0+1,z0+h-1,'#c58a5e');for(let t=v0+.03;t<v1;t+=2/32)faceR(g,u1,t,t+1/32,z0+1,z0+h-1,'#8a5c40');
          for(const z of[z0+4,z0+11]){faceL(g,v1,u0+.08,u1-.08,z,z+3,GLc);faceL(g,v1,u0+.08,u1-.08,z+2,z+3,GHc);faceR(g,u1,v0+.08,v1-.08,z,z+3,GDc);
            if(n){for(let i=0;i<8;i++){const a=u0+.1+i*.2;if(hsh(11441,z,i)<.6)faceL(n,v1,a,a+.18,z,z+3,T.LIT);}faceR(n,u1,v0+.1,v1-.1,z,z+3,T.LIT2);}}
          faceL(g,v1,u0,u1,z0,z0+1,'#5a3a28');T.flatTop(g,u0,v0,u1-u0,v1-v0,z0+h,'#9aa0a2',{cap:'#d4a27a'});
          for(let r=0;r<2;r++){const vv=v0+.12+r*.3;boxZ(g,u0+.3,vv,1.0,.16,z0+h,1.5,'#2f4f78','#3f6690','#243d5e');for(let t=u0+.35;t<u0+1.3;t+=.08)BL(g,P(t,vv,z0+h+1.5),P(t,vv+.16,z0+h+1.5),'#6f93b8');}});
        // 右角運動中心
        S.o(2.0,(g,n)=>{const u0=3.15,v0=.20,du=.70,dv=1.40,h=18,u1=u0+du,v1=v0+dv,um=u0+du/2;
          boxZ(g,u0,v0,du,dv,0,h,null,'#e2e6e7','#9aa3a8');faceL(g,v1,u0,u1,0,1.5,WB);faceR(g,u1,v0,v1,0,1.5,SH(WB,-20));
          for(let t=v0+.03;t<v1;t+=3/32)faceR(g,u1,t,t+1/32,1.5,11,'#8a939a');
          faceR(g,u1,v0,v1,11,13,'#2f8f86');faceL(g,v1,u0,u1,11,13,'#3fb0a4');
          faceR(g,u1,v0+.04,v1-.04,14,17,GDc);for(let t=v0+.12;t<v1;t+=.12)faceR(g,u1,t-1/64,t+1/64,14,17,MULd);if(n)faceR(n,u1,v0+.05,v1-.05,14,17,T.LIT2);
          faceL(g,v1,u0+.1,u1-.1,0,9,GLc);faceL(g,v1,u0+.1,u1-.1,7,8,GHc);for(let t=u0+.16;t<u1-.1;t+=.08)faceL(g,v1,t-1/64,t+1/64,0,9,MUL);faceL(g,v1,um-.07,um+.07,0,7,'#2d4556');if(n)faceL(n,v1,u0+.11,u1-.11,.5,8,'#fff0c4');
          boxZ(g,u0+.06,v1,du-.12,.12,9.5,1.2,'#f4f5f3','#e3e6e5','#aab0b2');
          T.gableV(g,u0,v0,du,dv,h,6,{rf:'#8fa3b3',rs:'#6c7f8e',ov:.03,wl:'#e2e6e7'});boxZ(g,um-.05,v0+.1,.10,dv-.2,h+4.5,2.5,'#dfeaf0','#c9d8e0','#9fb1bc');});
        // 廣場：方形樹池樹陣、紅色拱形雕塑
        const grid=[[1.45,1.45],[2.20,1.45],[2.95,1.45],[1.45,2.20],[2.95,2.20],[1.45,2.95]];
        S.o(1.9,(g)=>{for(const[u,v]of grid)boxZ(g,u-.09,v-.09,.18,.18,0,1.5,'#5e8f45','#bdb9ad','#8f8b80');});
        for(const[u,v]of grid)T.tree(S,u,v,1.15,(rnd(u*10)+rnd(v*10))%3);
        S.o(3.6,(g)=>{boxZ(g,2.00,2.05,.36,.36,0,1.5,'#e9ebe8','#d6d9d6','#a9aeae');
          boxZ(g,2.06,2.18,.06,.06,1.5,14,'#e0503c','#d6453a','#94281f');boxZ(g,2.26,2.18,.06,.06,1.5,14,'#e0503c','#d6453a','#94281f');boxZ(g,2.04,2.16,.30,.10,15.5,3,'#ea6a52','#d6453a','#94281f');});
        // 圖書館前露天咖啡座（陽傘桌）與廣場長凳
        for(const[u,v,c]of[[1.78,1.30,'#e05a48'],[2.08,1.30,'#f2f0e8'],[2.38,1.30,'#3f82c4'],[2.68,1.30,'#e05a48']])S.o(2.4+u*.01,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);
          RC(g,x-1,y-3,3,1,'#b9b4a8');RC(g,x,y-2,1,2,'#6d6a64');RC(g,x,y-9,1,6,'#5d5a55');ell(g,x,y-10,4,1,c);RC(g,x-3,y-11,7,1,SH(c,26));RC(g,x-4,y-10,9,1,SH(c,-30));});
        S.o(3.5,(g)=>{for(const[u,v]of[[1.62,2.40],[2.20,2.40],[1.62,2.95],[2.20,2.95]])boxZ(g,u,v,.22,.05,0,2,'#e9ebe8','#d6d9d6','#a9aeae');});
        T.bikes(S,1.02,1.40,.80,false,1.9,11451);T.bikes(S,1.02,2.60,.80,false,2.9,11452);T.bikes(S,3.25,1.72,.50,true,5.0,11453);
        T.tree(S,3.40,3.00,1.25,2);T.tree(S,3.00,3.40,1.25,0);T.tree(S,3.70,2.60,1.2,1);T.tree(S,2.60,3.70,1.2,2);T.tree(S,3.70,3.40,1.1,0,7.2);T.tree(S,1.30,3.70,1.1,1);
        T.lamp(S,1.26,1.20,14,2.5,'m');T.lamp(S,3.10,1.20,14,4.4,'m');T.lamp(S,1.26,3.04,14,4.4,'m');T.lamp(S,3.10,3.04,14,6.2,'m');
        T.crowd(S,6.3,[[1.70,1.70,'#2f5f96',{bag:'#c24a3a'}],[1.76,1.72,'#e8c23a'],[2.60,1.62,'#f4f4ef'],[1.62,2.50,'#c24a3a',{run:1}],[2.80,2.40,'#3f7f4a'],[2.44,2.84,'#8a5bb0'],
          [3.30,3.34,'#2a2d31'],[3.60,3.64,'#e0a83a',{run:1}],[1.10,1.90,'#d9d9d4'],[1.12,3.10,'#2f5f96'],[3.40,1.76,'#c24a3a'],[2.30,1.20,'#3a3f4d',{bag:'#e0a83a'}],[2.96,2.92,'#e8c23a']]);
        T.hedge(S,1.10,3.90,2.20,.06,7.6,3);T.hedge(S,3.90,1.90,.06,1.40,7.4,3);T.hedge(S,3.60,3.90,.30,.06,8.2,3);T.hedge(S,3.90,3.60,.06,.30,8.2,3);
        const fa=T.flagpole(S,.06,3.94,10,4.1);
        return{flagAt:fa};
      },
      // ---------- v2 紅磚學院群：後角義式紅磚鐘塔（石帶、鐘台四面鐘、三拱開敞鐘樓、四坡尖頂）；右後沿邊三層紅磚主樓（雙坡瓦、中央山牆門廊凸出、石階）；右角石砌圓形圖書館（壁柱、高窗、鉛灰低圓頂＋採光亭、四柱門廊）；
      //      左後沿邊 ㄇ 字形三層紅磚宿舍院（背翼＋上下兩臂、內院草坪）；左前紅磚體育館（雙坡瓦＋屋脊採光天窗、大窗列）；中央圓角方形環狀步道圍出大草坪與八角音樂亭、外圈樹環；前緣矮磚牆、前角校門；左角旗桿 ----------
      (g,ng,S)=>{
        const B2={wl:'#ac553d',wr:'#77372a',bl:'#8f897b',br:'#69645a',cor:'#efe4c8',cs:'#e6d9b8',sill:'#f3ead6',sillR:'#b9ab8c',gl:GL,gd:GD};
        const RT={u:3.30,v:.80,r:.40};
        const sq=(u,v)=>{const x=(u-2.45)/.98,y=(v-2.45)/.98;return x*x*x*x+y*y*y*y;};
        pave(g,'g',0,0,4,4,11501);
        paint(g,(u,v)=>{const f=sq(u,v);if(f<.74)return stripe(0,8)(u,v);if(f<1)return flag(u,v);return null;});
        paint(g,(u,v)=>{if(sq(u,v)<1)return null;const d=Math.abs(u-v);if(d<.09&&u+v>6.2)return flag(u,v);if(Math.abs(u-1.85)<.08&&v>.97&&v<1.6)return flag(u,v);if(Math.abs(v-2.2)<.08&&u>1.40&&u<1.6)return flag(u,v);if(Math.abs(u-RT.u)<.08&&v>1.2&&v<1.62)return flag(u,v);return null;});
        pave(g,'st',.95,.85,1.85,.12,11502);pave(g,'st',.70,1.55,.75,1.20,11503);
        paint(g,(u,v)=>(u>.72&&u<1.43&&v>1.57&&v<2.73)?((Math.abs(v-2.15)<.06||Math.abs(u-1.08)<.06)?flag(u,v):stripe(8,0)(u,v)):null);
        shadow(g,[['b',.30,.30,.50,.50,120],['b',.95,.25,1.80,.60,40],['b',.25,1.15,.45,2.0,36],['b',.70,1.15,.75,.40,36],['b',.70,2.75,.75,.40,36],['b',.30,3.32,1.30,.54,26],['c',RT.u,RT.v,14,34],
          ['c',1.62,1.62,6,16],['c',3.28,1.62,6,16],['c',1.62,3.28,6,16],['c',3.40,3.00,6,16],['c',3.00,3.40,6,16],['c',2.45,1.38,6,16],['c',1.38,2.45,6,16],['c',3.52,2.45,6,16],['c',2.45,3.52,6,16]]);
        // 義式鐘塔（N 角）
        S.o(1,(g,n)=>{const uc=.55,vc=.55,s=.50,u0=uc-s/2,v0=vc-s/2,u1=u0+s,v1=v0+s,C=B2,ST='#efe4c8',STD='#b3a68a';
          boxZ(g,u0,v0,s,s,0,72,null,C.wl,C.wr);faceL(g,v1,u0,u1,0,3,'#b9ae96');faceR(g,u1,v0,v1,0,3,'#857b67');
          for(const z of[24,48]){faceL(g,v1,u0,u1,z,z+1.5,ST);faceR(g,u1,v0,v1,z,z+1.5,SH(ST,-40));}
          for(const[a,b]of[[u0,v1],[u1,v1],[u1,v0]]){boxZ(g,a-.025,b-.025,.05,.05,3,69,null,SH(C.wl,8),SH(C.wr,-6));}
          for(const z of[8,30,54]){T.win1(g,n,'L',v1,uc,z,2,8,GL,{st:'arch',wall:C.wl,sill:ST},11511,z);T.win1(g,n,'R',u1,vc,z,2,8,GD,{st:'arch',wall:C.wr,sill:SH(ST,-40)},11512,z);}
          T.doorL(g,n,v1,uc,5,9,ST,'#4b3226');
          boxZ(g,u0-.03,v0-.03,s+.06,s+.06,72,13,null,ST,STD);faceL(g,v1+.03,u0-.03,u1+.03,72,73,SH(ST,-24));faceL(g,v1+.03,u0-.03,u1+.03,84,85,SH(ST,14));
          const cl=P(uc,v1+.03,78.5),cr=P(u1+.03,vc,78.5);T.clock(g,n,cl[0],cl[1],1,0);T.clock(g,n,cr[0],cr[1],1,1);
          boxZ(g,u0,v0,s,s,85,13,null,C.wl,C.wr);
          for(const k of[-1,0,1]){const t=uc+k*.14;faceL(g,v1,t-.045,t+.045,87,96,'#2a2320');faceL(g,v1,t-.045,t-.015,95,96,C.wl);faceL(g,v1,t+.015,t+.045,95,96,C.wl);
            const tv=vc+k*.14;faceR(g,u1,tv-.045,tv+.045,87,96,'#201b19');faceR(g,u1,tv-.045,tv-.015,95,96,C.wr);faceR(g,u1,tv+.015,tv+.045,95,96,C.wr);}
          const bp=P(uc,v1-.1,89);RC(g,bp[0]-2,bp[1]-3,4,3,'#c99a3c');
          boxZ(g,u0-.04,v0-.04,s+.08,s+.08,98,2.5,ST,ST,STD);
          T.pyramid(g,uc,vc,s+.04,100.5,18,'#b0563f','#7a3a2c');
          const ap=P(uc,vc,118.5);RC(g,ap[0],ap[1]-4,1,4,'#caa54a');RC(g,ap[0]-1,ap[1]-3,3,1,'#caa54a');});
        // 右後三層紅磚主樓
        S.o(1.2,(g,n)=>{const u0=.95,v0=.25,du=1.80,dv=.60,h=28,u1=u0+du,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,B2,{fl:3,z0:3.5,fh:8.5,w:3,wh:5,pitch:7,seed:11521,hood:1,skipL:[[1.64,2.06]]});
          T.gableU(g,u0,v0,du,dv,h,12,{rf:RF,rs:RS,wr:B2.wr,ov:.04});
          for(const u of[1.20,2.50])boxZ(g,u,.50,.07,.08,34,8,'#8a8f93',B2.wl,B2.wr);});
        S.o(1.25,(g,n)=>{const u0=1.64,u1=2.06,v0=.85,v1=.99,h=31,um=1.85;
          boxZ(g,u0,.70,u1-u0,v1-.70,0,h,null,B2.wl,B2.wr);faceL(g,v1,u0,u1,0,2,B2.bl);faceR(g,u1,.70,v1,0,2,B2.br);
          for(let f=1;f<3;f++){const z=3.5+f*8.5;faceL(g,v1,u0,u1,z-2.5,z-1.5,B2.cs);T.winRow(g,n,'L',v1,u0+.04,u1-.04,z,3,6,7,GL,{st:'arch',wall:B2.wl,sill:B2.sill,hi:GH,seed:11522+f},[]);}
          faceL(g,v1,um-.13,um+.13,0,12,B2.cor);faceL(g,v1,um-.10,um+.10,0,10,'#4b3226');faceL(g,v1,um-.10,um+.10,8,10,'#9cc0d6');if(n)faceL(n,v1,um-.10,um+.10,8,10,'#ffe9b0');
          T.gableV(g,u0,.70,u1-u0,v1-.70,h,9,{rf:RF,rs:RS,wl:B2.wl,ov:.03});faceL(g,v1,u0,u1,h-2,h,B2.cor);BL(g,P(u0,v1,h),P(um,v1,h+9),B2.cor);BL(g,P(um,v1,h+9),P(u1,v1,h),B2.cor);
          const oc=P(um,v1,h+3.5);RC(g,oc[0]-1,oc[1]-1,3,3,B2.cor);});
        S.o(1.27,(g)=>{boxZ(g,1.70,.99,.30,.05,0,1.2,'#d8d0bc','#cbc3af','#a39b87');boxZ(g,1.73,1.04,.24,.04,0,.6,'#d8d0bc','#cbc3af','#a39b87');});
        // 左後 ㄇ 字宿舍院
        const RD='#6b5a52',RDs='#4e4039';
        S.o(1.3,(g,n)=>{const u0=.25,v0=1.15,du=.45,dv=2.0,h=26;
          T.mass(g,n,u0,v0,du,dv,h,B2,{fl:3,z0:3,fh:8,w:3,wh:4,pitch:6,seed:11531,lit:.55});
          T.gableV(g,u0,v0,du,dv,h,9,{rf:RD,rs:RDs,wl:B2.wl,ov:.03});faceL(g,v0+dv,u0,u0+du,h-2,h,B2.cor);});
        const arm=(v0,seed,d,door)=>S.o(d,(g,n)=>{const u0=.70,du=.75,dv=.40,h=26,u1=u0+du,v1=v0+dv;
          T.mass(g,n,u0,v0,du,dv,h,B2,{fl:3,z0:3,fh:8,w:3,wh:4,pitch:6,seed,lit:.55,skipL0:door?[[1.00,1.16]]:[]});
          T.gableU(g,u0,v0,du,dv,h,9,{rf:RD,rs:RDs,wr:B2.wr,ov:.03});faceR(g,u1,v0,v1,h-2,h,SH(B2.cor,-40));
          if(door){T.doorL(g,n,v1,1.08,5,8,B2.cor,'#3a4a58');boxZ(g,.98,v1,.20,.08,8.5,1.2,'#dcd3c0','#cfc6b3','#9d9585');}});
        arm(1.15,11541,1.35,1);arm(2.75,11551,1.4,0);
        // 右角石砌圓形圖書館（壁柱、高窗、鉛灰低圓頂、採光亭）＋四柱門廊
        S.o(1.8,(g,n)=>{const{u,v,r}=RT;
          T.cyl(g,n,u,v,r,0,3,['#b9ae96','#a89e87','#978d77','#857b67','#736a58']);
          T.cyl(g,n,u,v,r-.02,3,20,STONE5,{pil:12,pc:'#fbf6ea',pd:'#a79b7f',win:{n:6,z0:3,z1:15,w:3,arch:1,seed:11561,lit:.75}});
          T.cyl(g,n,u,v,r,23,3,['#f7f1e2','#ece4d0','#d8ccb0','#bfb296','#a4987c'],{cap:'#e9e1cc'});
          T.dome(g,u,v,r-.06,26,12,['#9fb0bd','#8698a6','#6f808e','#5a6a77','#495764'],{ribs:10});
          T.cyl(g,n,u,v,.06,38,4,STONE5,{pil:3});T.dome(g,u,v,.065,42,3,['#9fb0bd','#8698a6','#6f808e','#5a6a77','#495764']);
          const ap=P(u,v,45);RC(g,ap[0],ap[1]-3,1,3,'#caa54a');});
        S.o(1.85,(g,n)=>{T.porticoL(g,n,RT.u-.18,RT.u+.18,1.10,1.28,15,6,4,{st:'#efe7d4',rf:'#6f808e',rs:'#5a6a77'});});
        // 左前體育館（雙坡瓦＋屋脊採光天窗）
        S.o(2.4,(g,n)=>{const u0=.30,v0=3.32,du=1.30,dv=.54,h=16,u1=u0+du,v1=v0+dv,vm=v0+dv/2;
          boxZ(g,u0,v0,du,dv,0,h,null,B2.wl,B2.wr);faceL(g,v1,u0,u1,0,2,B2.bl);faceR(g,u1,v0,v1,0,2,B2.br);
          for(let i=0;i<6;i++){const t=u0+.12+i*.2;faceL(g,v1,t-.05,t+.05,4,12,GL);faceL(g,v1,t-.05,t+.05,8,9,B2.cor);faceL(g,v1,t-.05,t+.05,11,12,GH);if(n&&hsh(11571,i,1)<.6)faceL(n,v1,t-.05,t+.05,4,12,T.LIT);}
          for(let t=u0;t<=u1+1e-6;t+=.2)faceL(g,v1,t-.012,t+.012,0,h,SH(B2.wl,-14));
          faceL(g,v1,u0,u1,h-2,h,B2.cor);
          const r=T.gableU(g,u0,v0,du,dv,h,8,{rf:RF,rs:RS,wr:B2.wr,ov:.04});
          const oc=P(u1,vm,h+3);RC(g,oc[0]-2,oc[1]-2,5,5,'#b9ab8c');RC(g,oc[0]-1,oc[1]-1,3,3,GD);if(n)RC(n,oc[0]-1,oc[1]-1,3,3,T.LIT2);
          T.doorR(g,n,u1,vm,6,8,SH(B2.cor,-40),'#3a2a20');
          boxZ(g,u0+.12,vm-.07,du-.24,.14,r.zt-2,4,'#8a939a','#9fc0d4','#6f8ea3');T.gableU(g,u0+.12,vm-.07,du-.24,.14,r.zt+2,2,{rf:'#6b737e',rs:'#4d545e',ov:.02});});
        // 八角音樂亭
        S.o(3.0,(g,n)=>{const u=2.45,v=2.45;boxZ(g,u-.22,v-.22,.44,.44,0,2,'#e3ddcf','#d6cfbf','#a39c8c');
          for(const[a,b]of[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18],[0,.2],[.2,0]])boxZ(g,u+a-.015,v+b-.015,.03,.03,2,9,null,'#f4f1e8','#c9c3b5');
          boxZ(g,u-.23,v-.23,.46,.46,11,1.5,'#f4f1e8','#ece7da','#b9b2a2');T.pyramid(g,u,v,.50,12.5,8,'#5f8f7e','#436a5c');
          const ap=P(u,v,20.5);RC(g,ap[0],ap[1]-2,1,2,'#caa54a');if(n){const p=P(u,v,9);RC(n,p[0]-1,p[1],3,1,'#ffe6a0');}});
        // 樹環、長凳、路燈、人、腳踏車
        for(const[u,v,k]of[[1.62,1.62,0],[3.28,1.62,2],[1.62,3.28,1],[3.40,3.00,0],[3.00,3.40,2],[2.45,1.38,1],[1.38,2.45,0],[3.52,2.45,2],[2.45,3.52,1]])T.tree(S,u,v,1.3,k);
        T.tree(S,3.75,1.40,1.1,0);T.tree(S,1.40,3.10,1.0,2,3.2);
        T.bench(S,2.05,2.05,true,4.1);T.bench(S,2.80,2.02,true,4.8);T.bench(S,2.02,2.80,false,4.8);
        T.lamp(S,1.95,1.60,12,3.55);T.lamp(S,3.00,1.60,12,4.6);T.lamp(S,1.60,3.00,12,4.6);T.lamp(S,3.35,3.35,12,6.7);
        T.bikes(S,1.90,1.02,.50,true,2.95,11581);T.bikes(S,.74,1.60,.60,false,2.4,11582);
        T.crowd(S,6.6,[[1.84,1.20,'#c24a3a',{bag:'#2f5f96'}],[1.88,1.40,'#2f5f96'],[2.20,1.72,'#e8c23a',{run:1}],[3.10,2.30,'#f4f4ef'],[2.30,3.16,'#3f7f4a',{bag:'#6b4a2a'}],[3.60,3.66,'#8a5bb0'],
          [2.70,2.62,'#d9d9d4'],[2.62,2.74,'#c24a3a'],[1.00,2.14,'#2f5f96'],[1.20,2.30,'#e0a83a',{run:1}],[RT.u+.02,1.44,'#3a3f4d'],[3.46,3.52,'#e8c23a'],[1.52,2.18,'#8a2f2a',{bag:'#3a3f4d'}]]);
        // 前緣矮磚牆＋磚柱、前角校門；左角旗桿
        S.o(8,(g)=>{boxZ(g,1.62,3.93,1.98,.05,0,3,'#c9745a',B2.wl,B2.wr);boxZ(g,3.93,1.10,.05,2.50,0,3,'#c9745a',B2.wl,B2.wr);});
        T.piers(S,[[1.62,3.955],[2.62,3.955],[3.60,3.955,1],[3.955,3.60,1],[3.955,2.62],[3.955,1.10]],8.1,{wl:B2.wl,wr:B2.wr,cap:'#efe4c8'},6);
        const fa=T.flagpole(S,.06,3.94,10,4.1);
        return{flagAt:fa};
      },
      ];
    });
  }catch(e){console.error('civ_d k113',e);errs.push('k113:'+(e&&e.stack||e));}

  window.__civ_d_chk=chk;
  if(errs.length)window.__civ_d_errs=errs;
});
