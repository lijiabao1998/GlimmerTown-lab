(window.__variants574=window.__variants574||[]).push(function b08(A){
  /* T574 批次 b08：公園運動與休閒（47 植物園／56 體育園區／74 涼亭／78 古樹神木／92 遛狗公園／93 溜冰場／
     94 滑板公園／96 游泳池／112 中央公園／183 水舞光泉／77 水塔景觀／179 天燈廣場）。
     v0 多為小型平面手繪；本批以 redraw 為主（同佔地、同色票、同外框色），重畫後補上 v0 開機時吃過的
     T526 打磨＋T479 材質（逐式複刻，決定性雜湊），T573 由後製鏈自動套。零共用亂數。 */
  const SPR=A.SPR(),B=SPR.bld;
  const shade=A.shade,HL=A.hashLocal479,R=Math.round;

  /* ---------- 像素基元 ---------- */
  const mk=(w,h)=>{const r=A.cv(w,h);return {c:r[0],g:r[1]};};
  const P=(g,x,y,w,h,c)=>{if(!g)return;x=R(x);y=R(y);w=R(w);h=R(h);if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(x,y,w,h);};
  function line(g,x0,y0,x1,y1,c){if(!g)return;x0=R(x0);y0=R(y0);x1=R(x1);y1=R(y1);
    const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;g.fillStyle=c;
    for(let n=0;n<900;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx;}if(e2<dx){e+=dx;y0+=sy;}}}
  const ln=(g,p,q,c)=>line(g,p[0],p[1],q[0],q[1],c);
  function poly(g,pts,c){if(!g)return;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    g.fillStyle=c;const n=pts.length;let ar=0;for(let k=0;k<n;k++){const a=pts[k],b=pts[(k+1)%n];ar+=a[0]*b[1]-b[0]*a[1];}const s=ar>0?1:-1;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){const px=x+.5,py=y+.5;let ok=true;
      for(let k=0;k<n&&ok;k++){const a=pts[k],b=pts[(k+1)%n];if(s*((b[0]-a[0])*(py-a[1])-(b[1]-a[1])*(px-a[0]))<-.01)ok=false;}
      if(ok)g.fillRect(x,y,1,1);}}
  function ell(g,cx,cy,rx,ry,c){if(!g)return;for(let dy=-ry;dy<=ry;dy++){const t=Math.max(0,Math.abs(dy)-.4)/(ry+.1);const w=R(rx*Math.sqrt(Math.max(0,1-t*t)));P(g,cx-w,cy+dy,2*w+1,1,c);}}
  // 受光球團（樹冠／灌木）：光從左上
  function blob(g,cx,cy,rx,ry,pal){for(let dy=-ry;dy<=ry;dy++){const t=Math.max(0,Math.abs(dy)-.4)/(ry+.1);const w=R(rx*Math.sqrt(Math.max(0,1-t*t)));
    for(let dx=-w;dx<=w;dx++){const b=-(dx/(rx+.5))*.55-(dy/(ry+.5))*.62;P(g,cx+dx,cy+dy,1,1,b>.42?pal[0]:b>-.08?pal[1]:b>-.52?pal[2]:pal[3]);}}}
  function dome(g,cx,cy,rx,ry,hd,pal){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),s=Math.sqrt(Math.max(0,1-u*u));const top=cy-R(hd*s),bot=cy+R(ry*s);
      for(let y=top;y<=bot;y++){const t=bot>top?(bot-y)/(bot-top):1;const b=-.62*u+.58*t+.12;
        P(g,cx+dx,y,1,1,b>.62?pal[0]:b>.28?pal[1]:b>-.08?pal[2]:pal[3]);}}}
  const eh=(rx,ry,dx)=>R(ry*Math.sqrt(Math.max(0,1-(dx*dx)/((rx+.5)*(rx+.5)))));
  // 直立圓柱：底橢圓中心 (cx,by)；cols 由左（亮）到右（暗）
  function cyl(g,cx,by,rx,ry,h,cols,top){const n=cols.length;
    for(let dx=-rx;dx<=rx;dx++){const e=eh(rx,ry,dx),k=Math.min(n-1,Math.floor((dx+rx)/(2*rx+1)*n));P(g,cx+dx,by-h-e,1,h+2*e+1,cols[k]);}
    if(top)ell(g,cx,by-h,rx,ry,top);}
  // 圓錐：頂點 (cx,apY)，底橢圓中心 (cx,by)；colAt(dx,u)
  function cone(g,cx,apY,by,rx,ry,colAt){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));const top=R(apY+(by-apY)*Math.abs(u)*.92);
      P(g,cx+dx,top,1,by+e-top+1,colAt(dx,u));}}
  function catmull(pts,step){const out=[];for(let s=0;s<pts.length-1;s++){const p0=pts[Math.max(0,s-1)],p1=pts[s],p2=pts[s+1],p3=pts[Math.min(pts.length-1,s+2)];
    for(let t=0;t<1;t+=step){const t2=t*t,t3=t2*t;const f=(a,b,c,d)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);
      out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])]);}}out.push(pts[pts.length-1]);return out;}

  /* ---------- 等距幾何 ---------- */
  // n×n 佔地：N=(ax,ay-32n)，i 往右下、j 往左下（各 0..16n），z 往上
  const GPn=(ax,ay,n)=>(i,j,z)=>[ax+2*i-2*j,ay-32*n+i+j-(z||0)];
  const fy=(S,d)=>S[1]-((d+1)>>1);
  const fx=(S,side,d)=>side<0?S[0]-1-d:S[0]+d;
  // 長方體：S=南角地面點，lenL=i 向長（左面）、lenR=j 向長（右面），h=牆高
  function box(g,S,lenL,lenR,h,cL,cR,cT,o){o=o||{};S=[R(S[0]),R(S[1])];
    for(let d=0;d<2*lenL;d++)P(g,fx(S,-1,d),fy(S,d)-h,1,h,cL);
    for(let d=0;d<2*lenR;d++)P(g,fx(S,1,d),fy(S,d)-h,1,h,cR);
    if(!o.noAO&&h>3){for(let d=0;d<2*lenL;d++)P(g,fx(S,-1,d),fy(S,d)-2,1,2,'rgba(0,0,0,.12)');for(let d=0;d<2*lenR;d++)P(g,fx(S,1,d),fy(S,d)-2,1,2,'rgba(0,0,0,.12)');}
    if(!o.noCorner&&h>2)P(g,S[0],S[1]-h,1,h,'rgba(0,0,0,.16)');
    if(cT)topFace(g,[S[0],S[1]-h],lenL,lenR,cT,o.eF===undefined?shade(cT,-22):o.eF,o.eB===undefined?shade(cT,14):o.eB);
    return S[1]-h;}
  function topFace(g,S,lenL,lenR,c,eF,eB){const sx=S[0],sy=S[1],nx=sx+2*lenR-2*lenL;
    for(let x=sx-2*lenL;x<sx+2*lenR;x++){
      const L=x<sx?sy-((sx-x)>>1):sy-((x-sx+1)>>1);
      const U=x<nx?sy-lenL-((x-(sx-2*lenL)+1)>>1):sy-lenR-((sx+2*lenR-x)>>1);
      if(L-U<=0)continue;P(g,x,U,1,L-U,c);if(eB)P(g,x,U,1,1,eB);if(eF)P(g,x,L-1,1,1,eF);}}
  function faceRect(g,S,side,d0,wd,up,hh,c,arch){S=[R(S[0]),R(S[1])];for(let d=d0;d<d0+wd;d++){const e=arch&&(d===d0||d===d0+wd-1)?1:0;P(g,fx(S,side,d),fy(S,d)-up-hh+e,1,hh-e,c);}}
  function band(g,S,side,d0,d1,up,hh,c){S=[R(S[0]),R(S[1])];for(let d=d0;d<d1;d++)P(g,fx(S,side,d),fy(S,d)-up-hh,1,hh,c);}
  function pyramid(g,S,n,hgt,cL,cR,ridge){const W=[S[0]-2*n,S[1]-n],E=[S[0]+2*n,S[1]-n],ap=[S[0],S[1]-n-hgt];
    poly(g,[W,S,ap],cL);poly(g,[S,E,ap],cR);if(ridge)line(g,S[0],S[1]-1,ap[0],ap[1]+1,ridge);return ap;}
  // 四坡屋頂：S=屋簷南角，lenL/lenR 同 box，hgt=屋脊高；cB=背坡（受光面）色
  function hipRoof(g,S,lenL,lenR,hgt,cL,cR,cB){const sx=S[0],sy=S[1];
    const W=[sx-2*lenL,sy-lenL],E=[sx+2*lenR,sy-lenR],N=[sx+2*lenR-2*lenL,sy-lenL-lenR],C=[sx+lenR-lenL,sy-(lenL+lenR)/2-hgt];
    let r1,r2;if(lenR>=lenL){const t=(lenR-lenL)/2;r1=[C[0]-2*t,C[1]+t];r2=[C[0]+2*t,C[1]-t];
      if(cB){poly(g,[W,N,r2,r1],cB);poly(g,[N,E,r2],shade(cB,-18));}
      poly(g,[W,S,r1],cL);poly(g,[S,E,r2,r1],cR);}
    else{const t=(lenL-lenR)/2;r1=[C[0]+2*t,C[1]+t];r2=[C[0]-2*t,C[1]-t];
      if(cB){poly(g,[N,E,r1,r2],shade(cB,-18));poly(g,[W,N,r2],cB);}
      poly(g,[W,S,r1,r2],cL);poly(g,[S,E,r1],cR);}
    return [r1,r2];}
  const quad=(g,G,i0,j0,i1,j1,c,z)=>poly(g,[G(i0,j0,z),G(i1,j0,z),G(i1,j1,z),G(i0,j1,z)],c);
  // 地基板（plate 零亂數版）
  function plate(g,ax,ay,n,col,dk,lt,seed){const hw=32*n,ty=ay-hw;A.dia(g,ax,ty,hw,col);
    if(seed){for(let i=0;i<26*n;i++){const yy=1+Math.floor(HL(seed,i,5741)*(hw-2));const hr=Math.max(1,(yy<hw/2?(yy+1):(hw-yy))*2-2);
      const xx=ax-hr+Math.floor(HL(seed,i,5742)*hr*2);P(g,xx,ty+yy,1,1,HL(seed,i,5743)<.5?shade(col,-10):shade(col,8));}}
    A.diaEdge(g,6,dk||shade(col,-16),ax,ty,hw);A.diaEdge(g,9,lt||shade(col,12),ax,ty,hw);}

  /* ---------- 常用小物 ---------- */
  const TREE=['#7cc062','#58a04a','#3e7a3a','#2c5a2e'];
  function tree(g,x,y,r,pal,sh){pal=pal||TREE;if(sh)ell(sh,x+2,y,r,Math.max(1,r>>2),'rgba(20,34,20,.24)');
    P(g,x-1,y-r-1,2,r+1,'#6e4c2e');P(g,x,y-r-1,1,r+1,'#4e3622');blob(g,x,y-r-R(r*.9)-1,r+1,r,pal);}
  function person(g,x,y,shirt,pants){P(g,x,y-7,2,2,'#e8b890');P(g,x,y-5,2,3,shirt);P(g,x,y-2,2,2,pants||'#3a3a4a');}
  function dog(g,x,y,c,flip){const s=flip?-1:1,o=flip?-3:0;P(g,x+o,y-3,4,2,c);P(g,x+o+(flip?-1:3),y-5,2,2,c);P(g,x+o,y-1,1,1,shade(c,-30));P(g,x+o+3,y-1,1,1,shade(c,-30));P(g,x+o+(flip?4:-1),y-4,1,1,c);if(s<0)return;}
  function lamp(g,ng,x,y,h,sh){if(sh)P(sh,x,y,3,1,'rgba(0,0,0,.2)');P(g,x,y-h,1,h,'#4a4a54');P(g,x-1,y-h-3,3,1,'#2e2e36');P(g,x-1,y-h-2,3,2,'#f2e2a0');
    if(ng){P(ng,x-1,y-h-2,3,2,'#ffe9a8');P(ng,x-2,y-h-3,5,4,'rgba(255,225,150,.22)');}}
  function bench(g,x,y,c){c=c||'#8a6a42';P(g,x,y-2,6,1,c);P(g,x,y-3,6,1,shade(c,18));P(g,x,y-1,1,1,shade(c,-30));P(g,x+5,y-1,1,1,shade(c,-30));}
  // 沿地面線的矮牆／圍欄：p→q 每個 x 一欄高 h
  function wallAlong(g,p,q,h,col,top){const x0=R(p[0]),x1=R(q[0]),n=Math.abs(x1-x0);if(!n)return;const s=x1>x0?1:-1;
    for(let k=0;k<=n;k++){const t=k/n,x=x0+s*k,y=R(p[1]+(q[1]-p[1])*t);P(g,x,y-h,1,h,col);if(top)P(g,x,y-h,1,1,top);}}
  function fence(g,p,q,h,post,rail,every){const x0=R(p[0]),x1=R(q[0]),n=Math.abs(x1-x0);if(!n)return;const s=x1>x0?1:-1;every=every||4;
    for(let k=0;k<=n;k++){const t=k/n,x=x0+s*k,y=R(p[1]+(q[1]-p[1])*t);P(g,x,y-h,1,1,rail);P(g,x,y-R(h/2),1,1,rail);if(k%every===0)P(g,x,y-h,1,h,post);}}

  /* ---------- 後製對齊：逐式複刻 T526 打磨＋T479 建築材質 ---------- */
  function polish526(c,ax,ay){const g=c.getContext('2d'),w=c.width,h=c.height,sc=Math.max(.6,Math.min(3,w/72));
    g.fillStyle='rgba(10,14,24,.16)';g.beginPath();g.ellipse(ax+8*sc,ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();
    const im=g.getImageData(0,0,w,h),d=im.data;
    for(let y=0;y<h;y++){let L=-1,Rr=-1;for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]>40){if(L<0)L=x;Rr=x;}}if(L<0)continue;
      for(let x=L;x<Math.min(L+2,w);x++){const i=(y*w+x)*4;d[i]=Math.min(255,d[i]*1.14+12);d[i+1]=Math.min(255,d[i+1]*1.14+12);d[i+2]=Math.min(255,d[i+2]*1.14+12);}
      const i=(y*w+Rr)*4;d[i]*=.88;d[i+1]*=.88;d[i+2]*=.88;}
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]<=40)continue;if((((x>>1)+(y>>1))&3)===0){d[i]*=.955;d[i+1]*=.955;d[i+2]*=.955;}}
    const rows=[];let topY=-1;
    for(let y=0;y<h;y++){let L=-1,Rr=-1;for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]>40){if(L<0)L=x;Rr=x;}}rows[y]=L>=0?[L,Rr]:null;if(L>=0&&topY<0)topY=y;}
    if(topY>=0)for(let y=h-2;y>topY+8;y-=8){const rb=rows[y];if(!rb)continue;for(let x=rb[0];x<=rb[1];x++){const i=(y*w+x)*4;if(d[i+3]>40){d[i]*=.93;d[i+1]*=.93;d[i+2]*=.93;}}}
    g.putImageData(im,0,0);}
  function mat479(c,k,key){const g=c.getContext('2d'),w=c.width,h=c.height,seed=479000+k*17+(String(key).length*13);
    g.save();g.globalCompositeOperation='source-atop';
    let gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,236,194,.075)');gr.addColorStop(.52,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(28,35,43,.10)');g.fillStyle=gr;g.fillRect(0,0,w,h);
    const density=Math.min(360,Math.max(10,Math.floor(w*h/520)));const cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];
    for(let i=0;i<density;i++){const x=Math.floor(HL(seed,i,47901)*w),y=Math.floor(HL(seed,i,47902)*h);const rw=HL(seed,i,47903)<.74?1:2,rh=HL(seed,i,47904)<.88?1:2;
      g.fillStyle=cols[Math.floor(HL(seed,i,47905)*cols.length)%cols.length];g.fillRect(x,y,rw,rh);}
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);tint.addColorStop(0,'rgba(222,213,190,.035)');tint.addColorStop(1,'rgba(43,49,54,.07)');g.fillStyle=tint;g.fillRect(0,0,w,h);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86);g.strokeStyle='rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=8){const off=Math.floor(HL(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');g.fillStyle=ao;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();}
  // 分層描邊：每層各自外框後疊到 base，前景部件壓在背景部件上仍有輪廓
  function layer(D,fn,ol){const L=mk(D.c.width,D.c.height);fn(L.g);if(ol)A.outlineSprite(L.c,ol[0],ol[1],ol[2]);D.g.drawImage(L.c,0,0);}
  function put(k,v,base,nt,ax,ay,noNight){polish526(base.c,ax,ay);const key=k+'_1_'+v;mat479(base.c,k,key);
    B[key]={img:base.c,night:noNight?undefined:nt.c,ax,ay,w:base.c.width,h:base.c.height,smoke:[]};}
  const setup=(W,H,ax,ay,n)=>({W,H,ax,ay,G:GPn(ax,ay,n||1),base:mk(W,H),nt:mk(W,H)});

  /* ======================== k96 游泳池 ======================== */
  try{(function(){const K=96,OL=[60,74,86];
    /* v1：競技標準池——長方泳道池（浮繩／出發台）＋後方更衣館＋東角三層跳水台 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#b8c4c8','#a4b0b4','#ccd8dc');
      layer(base,g=>{
        quad(g,G,5.5,2.5,15.5,14.5,'#eef2f2');
        quad(g,G,6.5,3.5,14.5,13.5,'#4fc3d9');
        const a=G(6.5,3.5),b=G(6.5,13.5),c=G(14.5,3.5);
        poly(g,[a,b,[b[0],b[1]+2],[a[0],a[1]+2]],'#2f93b0');poly(g,[a,c,[c[0],c[1]+2],[a[0],a[1]+2]],'#3aa2bc');
        for(const j of [6,8.5,11])ln(g,G(7.5,j),G(13.5,j),'#3aa8c4');
        for(const j of [6,8.5,11])for(let i=8;i<=14;i+=2){const p=G(i,j);P(g,p[0],p[1]-1,1,1,'#f4f4f4');}
        for(const j of [4.8,7.3,9.8,12.3]){const p=G(15,j);P(g,p[0]-1,p[1]-2,2,2,'#fafafa');P(g,p[0]-1,p[1],2,1,'#8a969c');}
        {const p=G(9.5,7.3);P(g,p[0],p[1],2,1,'#e8b890');P(g,p[0],p[1]-1,2,1,'#e05252');}
        {const p=G(12,9.8);P(g,p[0],p[1],2,1,'#e8b890');P(g,p[0],p[1]-1,2,1,'#f0c040');}
      },OL);
      quad(ng,G,6.5,3.5,14.5,13.5,'rgba(102,217,236,.5)');
      // 更衣館（沿西北邊，面向泳池一側開門窗）
      layer(base,g=>{
        const S=G(4,15);box(g,S,3,13,11,'#ece4d0','#c9bfa8','#90a2ae');
        band(g,S,1,0,26,9,1,'#3a8ac0');band(g,S,-1,0,6,9,1,'#4a9ad0');
        faceRect(g,S,1,4,3,0,7,'#44525e');faceRect(g,S,1,19,3,0,7,'#44525e');
        faceRect(g,S,1,9,8,4,2,'#7fb0d8');faceRect(g,S,-1,2,2,4,2,'#8cc0e0');
        faceRect(ng,S,1,9,8,4,2,'#ffe9b8');faceRect(ng,S,1,4,3,0,7,'rgba(255,220,150,.3)');faceRect(ng,S,1,19,3,0,7,'rgba(255,220,150,.3)');
      },OL);
      // 跳水台（東北緣，r4 重畫）：兩根細混凝土柱＋三層逐級外挑跳台（淺頂緣／暗底面）＋側梯＋頂台白欄杆；
      // 跳台沿 j 伸出池緣懸在水面上。框架不描外框（外框會把柱間空隙填死成白塊），輪廓靠暗底面與柱暗側自帶。
      {const g0=base.g;
        const PY=(x,z)=>89+((60-x)>>1)-z;                 // 沿 j 的跳台中線，嚴格 2:1 階梯（x 往左＝往池心）
        const COL=['#949ca4','#5e6872'],TOPB='#dfe4e6',TOP='#fafcfc',UND='#46525e';
        // 落地陰影＋跳台投在水面的淡影
        P(g0,56,90,5,1,'rgba(0,0,0,.24)');P(g0,51,93,5,1,'rgba(0,0,0,.24)');
        for(let x=44;x<=50;x++)P(g0,x+3,PY(x,0)+3,1,1,'rgba(20,70,100,.22)');
        layer(base,g=>{
          // 雙柱（灰混凝土，左亮右暗）
          const col=(x,yb,zt)=>{const yt=PY(x,zt)-2;P(g,x,yt,1,yb-yt+1,COL[0]);P(g,x+1,yt,1,yb-yt+1,COL[1]);};
          col(57,90,20);col(52,93,20);
          // 側梯（後柱右側：踏棍＋單側扶手）
          {const yt=PY(61,20)-2;P(g,61,yt,1,92-yt,'#56606a');P(base.g,60,91,3,1,'rgba(0,0,0,.2)');for(let y=yt+1;y<89;y+=2)P(g,59,y,2,1,'#9aa2aa');}
          // 三層跳台：兩列頂面（後淺灰／前緣亮白）＋一列暗底面，端頭封口
          const plat=(z,xt)=>{for(let x=xt;x<=60;x++){const y=PY(x,z);P(g,x,y-2,1,1,TOPB);P(g,x,y-1,1,1,TOP);P(g,x,y,1,1,UND);}
            const y=PY(xt,z);P(g,xt-1,y-2,1,3,'#b8c0c6');P(g,xt-1,y,1,1,UND);};
          plat(6,50);plat(13,47);plat(20,44);
          // 頂台白欄杆（兩根立柱＋扶手，留出跳板端）
          for(let x=52;x<=60;x++)P(g,x,PY(x,20)-5,1,1,'#f4f6f6');
          for(const x of [52,56,60])P(g,x,PY(x,20)-4,1,2,'#c8d0d4');
        });
      }
      layer(base,g=>{
        for(const i of [8,11.5]){const p=G(i,15.4);P(g,p[0],p[1],6,1,'#f0e8d0');P(g,p[0],p[1]+1,6,1,'#b0a488');P(g,p[0]-1,p[1]-1,2,1,'#f0e8d0');}
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：休閒戲水池——自由曲線池＋螺旋滑水道塔（紅頂）＋陽傘躺椅 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#b8c4c8','#a4b0b4','#ccd8dc');
      quad(base.g,G,1.2,1.2,14.8,14.8,'#dccfb4');
      layer(base,g=>{
        ell(g,40,97,17,8,'#eef0ea');ell(g,26,93,9,5,'#eef0ea');
        ell(g,40,97,15,6,'#2f93b0');ell(g,26,93,7,3,'#2f93b0');
        ell(g,40,98,15,5,'#4fc3d9');ell(g,26,94,7,2,'#4fc3d9');
        P(g,21,94,4,1,'#8fdcea');P(g,33,98,4,1,'#9fe6f2');P(g,44,100,3,1,'#9fe6f2');
      },OL);
      ell(ng,40,98,15,5,'rgba(102,217,236,.45)');ell(ng,26,94,7,2,'rgba(102,217,236,.45)');
      layer(base,g=>{
        const S=G(5,4);const ty=box(g,S,3,3,24,'#f0ece2','#c4bfb2','#d2c6ae');
        faceRect(g,S,-1,2,2,8,4,'#5a6670');faceRect(g,S,1,2,2,8,4,'#4a5660');faceRect(g,S,-1,2,2,16,4,'#5a6670');faceRect(g,S,1,2,2,16,4,'#4a5660');
        band(g,S,-1,0,6,20,1,'#e05252');band(g,S,1,0,6,20,1,'#b83a3a');
        const T=[S[0],ty];for(const q of [[T[0]-6,T[1]-3],[T[0],T[1]],[T[0]+6,T[1]-3]])P(g,q[0],q[1]-6,1,6,'#8a8a92');
        pyramid(g,[T[0],T[1]-5],4,6,'#e8e4dc','#e05252');
        const tp=[T[0],T[1]-11];P(g,tp[0],tp[1]-2,1,2,'#8a8a92');P(g,tp[0]+1,tp[1]-2,3,1,'#f0c040');
        P(ng,T[0]-2,T[1]-5,4,2,'rgba(255,220,150,.55)');
      },OL);
      layer(base,g=>{
        const path=catmull([[44,60],[53,63],[57,70],[51,76],[46,81],[52,87],[50,93]],.04);
        P(g,57,71,1,19,'#9a9aa2');P(g,47,82,1,7,'#9a9aa2');
        for(const p of path)P(g,p[0]-1,p[1]-1,3,3,'#b86a10');
        for(const p of path)P(g,p[0]-1,p[1]-2,3,2,'#f4a82a');
        for(const p of path)P(g,p[0]-1,p[1]-2,1,1,'#ffd878');
        P(g,48,94,5,1,'#f4ffff');P(g,47,95,2,1,'#dff6fa');
      },OL);
      layer(base,g=>{
        const par=(x,y,c1,c2)=>{P(base.g,x+1,y,4,1,'rgba(0,0,0,.18)');P(g,x,y-9,1,9,'#8a8a92');
          for(let r=0;r<3;r++){const w=2+r*2;for(let dx=-w;dx<=w;dx++)P(g,x+dx,y-12+r,1,1,((dx+8)>>2)%2?c1:c2);}P(g,x,y-13,1,1,'#8a8a92');};
        par(13,96,'#f4f0e6','#3a8ac0');
        const lo=(x,y)=>{P(g,x,y,6,1,'#f0e8d0');P(g,x,y+1,6,1,'#b0a488');P(g,x-1,y-1,2,1,'#f0e8d0');};
        lo(20,101);lo(57,97);
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k96',e);}

  /* ======================== k93 溜冰場 ======================== */
  try{(function(){const K=93,OL=[60,72,84];
    const oct=(G,i0,j0,i1,j1,c,z)=>[G(i0+c,j0,z),G(i1-c,j0,z),G(i1,j0+c,z),G(i1,j1-c,z),G(i1-c,j1,z),G(i0+c,j1,z),G(i0,j1-c,z),G(i0,j0+c,z)];
    /* v1：標準冰球場——切角長方冰面（界線／球門）＋西北側藍頂冰場館＋兩座泛光燈塔 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#9aa5b0','#87929c','#adb8c2');
      layer(base,g=>{
        const S=G(3,13);const ty=box(g,S,2,11,11,'#dfe3e6','#aeb6be',null);
        faceRect(g,S,1,3,14,4,3,'#8cc0e0');faceRect(g,S,1,19,3,0,7,'#3a4450');faceRect(g,S,-1,1,2,3,3,'#8cc0e0');
        band(g,S,1,0,22,8,1,'#c8d0d6');
        hipRoof(g,[S[0],ty],2,11,4,'#5a88b8','#3e6a98','#6e9cc8');
        faceRect(ng,S,1,3,14,4,3,'#ffe9b8');faceRect(ng,S,-1,1,2,3,3,'#ffe0a8');
      },OL);
      layer(base,g=>{
        const I0=4.5,J0=1.5,I1=15.5,J1=13.5,C=1.6;
        poly(g,oct(G,I0,J0,I1,J1,C),'#dfe6ec');
        const ice=oct(G,I0+.6,J0+.6,I1-.6,J1-.6,C-.2);poly(g,ice,'#cfe9f2');poly(ng,ice,'rgba(191,230,245,.55)');
        poly(g,oct(G,I0+2.2,J0+2.2,I1-2.2,J1-2.2,C),'#c4e2ee');
        ln(g,G(10,2.2),G(10,12.8),'#d84848');ln(g,G(7.4,2.2),G(7.4,12.8),'#5a78d0');ln(g,G(12.6,2.2),G(12.6,12.8),'#5a78d0');
        {const p=G(10,7.5);P(g,p[0]-3,p[1],1,1,'#5a78d0');P(g,p[0]+3,p[1],1,1,'#5a78d0');P(g,p[0]-1,p[1]-2,3,1,'#5a78d0');P(g,p[0]-1,p[1]+2,3,1,'#5a78d0');}
        for(const i of [5.9,14.1]){const p=G(i,7.5);P(g,p[0]-1,p[1]-2,2,2,'#d84848');P(g,p[0]-1,p[1]-2,2,1,'#f4f4f4');}
        const O=oct(G,I0,J0,I1,J1,C);
        // 後側圍板（內側面）
        wallAlong(g,O[6],O[7],3,'#e8eef2','#ffffff');wallAlong(g,O[7],O[0],3,'#e8eef2','#ffffff');wallAlong(g,O[0],O[1],3,'#dde4ea','#ffffff');wallAlong(g,O[1],O[2],3,'#dde4ea','#ffffff');
        person(g,G(8,4.5)[0],G(8,4.5)[1],'#d84860');person(g,G(12,10.5)[0],G(12,10.5)[1],'#4878c8');person(g,G(13.5,4)[0],G(13.5,4)[1],'#7be08a');
        // 前側圍板（外側面，底部廣告帶）
        wallAlong(g,O[2],O[3],3,'#c4ccd4','#f4f8fa');wallAlong(g,O[3],O[4],3,'#c4ccd4','#f4f8fa');
        wallAlong(g,O[4],O[5],3,'#eef2f6','#ffffff');wallAlong(g,O[5],O[6],3,'#eef2f6','#ffffff');
        for(const s of [[O[4],O[5]],[O[2],O[3]]]){const a=s[0],b=s[1],n=Math.abs(R(b[0])-R(a[0])),sg=b[0]>a[0]?1:-1;for(let k=0;k<=n;k++){const t=k/n;P(g,R(a[0])+sg*k,R(a[1]+(b[1]-a[1])*t)-1,1,1,(k>>3)%2?'#4a7ac0':'#d84848');}}
      },OL);
      layer(base,g=>{
        const fl=(p,fl)=>{P(base.g,p[0],p[1],3,1,'rgba(0,0,0,.2)');P(g,p[0],p[1]-28,1,28,'#5a606a');P(g,p[0]-2,p[1]-31,5,3,'#3a3e46');P(g,p[0]-2,p[1]-30,5,2,'#e8ecf2');
          P(ng,p[0]-2,p[1]-30,5,2,'#fff6d8');P(ng,p[0]-3,p[1]-32,7,5,'rgba(255,244,200,.25)');};
        fl(G(15.6,0.8));fl(G(1.2,15.2));
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：環形冰道（r4 重畫）——加寬、淺色的環形冰面（冰刀痕）圍繞中央雪島小聖誕樹；
       租鞋處改為東角地塊邊緣的低矮深色木屋（平頂積雪＋屋頂冰鞋招牌），不再放在圓心（原紅白錐頂亭 1x 讀成旋轉木馬）；雙燈柱 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#aaa89e','#94928a','#bcbab0');
      const CX=36,CY=96,RX=19,RY=9,IX=5,IY=2;
      // 後燈柱（北緣，冰場板牆之後）
      layer(base,g=>{lamp(g,ng,29,82,14,base.g);},OL);
      layer(base,g=>{
        ell(g,CX,CY,RX+1,RY+1,'#d6dee4');ell(g,CX,CY,RX,RY,'#e6f4f9');
        ell(g,CX,CY,IX+3,IY+2,'#d8ecf3');                                  // 島邊略深一圈（冰面陰影）
        ell(ng,CX,CY,RX,RY,'rgba(191,230,245,.42)');
        // 冰刀痕：沿環道的斷續弧線
        const arc=(rx,ry,a0,a1,c)=>{let last='';for(let a=a0;a<=a1;a+=2){const t=a*Math.PI/180,x=R(CX+rx*Math.cos(t)),y=R(CY+ry*Math.sin(t)),k=x+','+y;if(k!==last){P(g,x,y,1,1,c);last=k;}}};
        arc(15,7,195,285,'#bcd6e2');arc(12,6,15,110,'#bcd6e2');arc(16,8,120,165,'#c6dee8');arc(13,6,300,345,'#c6dee8');
        // 後側板牆
        for(let dx=-RX;dx<=RX;dx++){const e=eh(RX+1,RY+1,dx);P(g,CX+dx,CY-e-2,1,2,dx<0?'#eef2f4':'#dde4ea');P(g,CX+dx,CY-e-2,1,1,'#ffffff');}
        // 中央雪島
        ell(g,CX,CY,IX+1,IY+1,'#c4ced6');ell(g,CX,CY,IX,IY,'#f6f9fa');P(g,CX+2,CY+1,3,1,'#e2e9ee');
        person(g,20,98,'#d84860');person(g,47,91,'#4878c8');person(g,28,104,'#f0c040');person(g,49,103,'#7be08a');
        // 前側板牆（外側面，底部色帶）
        for(let dx=-RX-1;dx<=RX+1;dx++){const e=eh(RX+1,RY+1,dx);if(e<=1&&Math.abs(dx)<RX-2)continue;P(g,CX+dx,CY+e-2,1,3,dx<0?'#eef2f6':'#c8d0d8');P(g,CX+dx,CY+e-2,1,1,'#ffffff');P(g,CX+dx,CY+e,1,1,(((dx+40)>>3)&1)?'#4a7ac0':'#d84848');}
      },OL);
      // 雪島小聖誕樹（分層、左亮右暗、枝梢積雪、三顆燈球＋頂星）
      layer(base,g=>{
        const tx=CX,tb=CY;P(g,tx,tb-1,1,2,'#5a3e28');
        const rows=[[tb-2,4],[tb-3,3],[tb-4,2],[tb-5,3],[tb-6,2],[tb-7,1],[tb-8,2],[tb-9,1],[tb-10,0]];
        for(const r of rows){for(let dx=-r[1];dx<=r[1];dx++)P(g,tx+dx,r[0],1,1,dx<0?'#3e7a48':dx===0?'#336a3e':'#285632');}
        for(const r of [rows[0],rows[3],rows[6]])P(g,tx-r[1],r[0],1,1,'#e8f0f2');
        P(g,tx,tb-11,1,1,'#ffd860');P(g,tx-1,tb-10,1,1,'#f0c040');P(g,tx+1,tb-10,1,1,'#c89a30');
        P(g,tx-2,tb-3,1,1,'#e04848');P(g,tx+2,tb-5,1,1,'#f0c040');P(g,tx-1,tb-7,1,1,'#e04848');
      },OL);
      P(ng,CX,CY-11,1,1,'#fff2a8');P(ng,CX-1,CY-12,3,3,'rgba(255,230,140,.3)');
      P(ng,CX-2,CY-3,1,1,'#ff9080');P(ng,CX+2,CY-5,1,1,'#ffe080');P(ng,CX-1,CY-7,1,1,'#ff9080');
      // 租鞋木屋（東角地塊邊緣，冰面之外）：深色木板牆、面向冰場的租鞋窗口、側門、平頂積雪、屋頂冰鞋招牌
      layer(base,g=>{
        const S=G(15.9,3);const Sr=[R(S[0]),R(S[1])];
        box(g,Sr,3,3,7,'#7a5638','#553a26',null);
        band(g,Sr,-1,0,6,4,1,'#654630');band(g,Sr,1,0,6,4,1,'#44301e');
        faceRect(g,Sr,-1,1,4,2,3,'#2a2220');band(g,Sr,-1,1,5,1,1,'#c8a070');

        faceRect(g,Sr,1,2,2,0,6,'#2e1f14');
        const rt=box(g,[Sr[0],Sr[1]-6],4,4,2,'#4a3424','#35251a','#eef3f6');
        const cx=Sr[0],cy=rt-4;
        P(g,cx-3,cy-1,1,3,'#3a2a1e');P(g,cx+2,cy-1,1,3,'#3a2a1e');
        P(g,cx-4,cy-6,8,5,'#2f4f7a');P(g,cx-4,cy-6,8,1,'#4a6c98');
        P(g,cx-1,cy-5,2,2,'#f4f4f0');P(g,cx+1,cy-4,1,1,'#f4f4f0');P(g,cx-2,cy-3,5,1,'#c8d4dc');
      },OL);
      {const S=G(15.9,3);const Sr=[R(S[0]),R(S[1])];faceRect(ng,Sr,-1,1,4,2,3,'#ffd890');}
      layer(base,g=>{lamp(g,ng,8,95,14,base.g);},OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k93',e);}

  /* ======================== k94 滑板公園 ======================== */
  try{(function(){const K=94,OL=[58,58,62];
    /* v1：垂直 U 型台——沿 i 軸的高 U 池（兩側平台＋鐵管 coping）＋前台塗鴉＋後台欄杆 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#9a9aa2','#88888f','#acacb4');
      const I0=3,I1=13,J0=3,J1=13,HH=12;
      const hp=j=>{const t=Math.abs((j-8)/5);return t<.3?0:HH*Math.pow((t-.3)/.7,1.8);};
      layer(base,g=>{lamp(g,ng,G(1.2,9)[0],G(1.2,9)[1],15,base.g);},OL);
      layer(base,g=>{
        box(g,G(I1,J0),I1-I0,2,HH,'#b8b8c0','#8a8a94','#c6c6ce');
        for(let j=J0;j<J1;j+=.25){const j2=j+.25,h1=hp(j),h2=hp(j2),dh=h2-h1;
          const c=dh<-.05?(dh<-.7?'#d4d4dc':'#c4c4cc'):dh>.05?'#8e8e98':'#b0b0b8';
          poly(g,[G(I0,j,h1),G(I1,j,h1),G(I1,j2,h2),G(I0,j2,h2)],c);}
        ln(g,G(I0,J0,HH),G(I1,J0,HH),'#eeeef4');
        for(let j=J0;j<=J1;j+=.5){const p=G(I1,j);const h=R(hp(j));if(h>0)P(g,p[0],p[1]-h,1,h,'#7e7e88');}
        const S=G(I1,15);box(g,S,I1-I0,2,HH,'#bcbcc4','#86868f','#c8c8d0');
        ln(g,G(I0,J1,HH),G(I1,J1,HH),'#eeeef4');
        faceRect(g,S,-1,3,5,3,5,'#e05252');faceRect(g,S,-1,4,3,4,3,'#f08a6a');faceRect(g,S,-1,10,4,5,4,'#5ec8ff');faceRect(g,S,-1,15,4,2,5,'#f0c040');
        band(g,S,-1,2,18,6,1,'rgba(30,30,40,.55)');
        for(let y=2;y<HH;y+=3)P(g,S[0]+1,S[1]-y-1,2,1,'#5a5a64');
        for(const i of [4,8.5,12.5]){const p=G(i,1.2,HH);P(g,p[0],p[1]-4,1,4,'#5a5a64');}
        ln(g,G(4,1.2,HH+4),G(12.5,1.2,HH+4),'#5a5a64');
        {const p=G(6,2,HH);person(g,p[0],p[1],'#e08a3a');P(g,p[0]-1,p[1],4,1,'#c05050');}
        {const p=G(8,5.2);person(g,p[0],p[1],'#4a8ad0');}
      },OL);
      layer(base,g=>{const p=G(15,9);bench(g,p[0]-2,p[1]);const q=G(15.2,14);P(g,q[0]-1,q[1]-5,4,5,'#5a5a62');P(g,q[0]-1,q[1]-5,4,1,'#7a7a82');},OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：街式廣場——塗鴉牆＋帶鐵杆的 funbox 與斜台＋三階樓梯扶手＋角落小樹 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#a4a29c','#908e88','#b6b4ae');
      for(const t of [4,8,12]){ln(base.g,G(t,.5),G(t,15.5),'#9a9892');}
      layer(base,g=>{
        tree(g,G(.9,.9)[0],G(.9,.9)[1],4,null,base.g);
        const S=G(2,14);box(g,S,1,12,11,'#ccc8c0','#a29e96','#dad6ce');
        faceRect(g,S,1,2,6,2,6,'#e05252');faceRect(g,S,1,3,4,3,4,'#f6a07a');faceRect(g,S,1,9,6,4,6,'#5ec8ff');faceRect(g,S,1,10,4,5,3,'#b8ecff');faceRect(g,S,1,17,5,1,6,'#f0c040');
        band(g,S,1,1,22,4,1,'rgba(30,30,40,.6)');
      },OL);
      layer(base,g=>{
        const S=G(12,8);box(g,S,4,5,5,'#c2c2ca','#90909a','#d0d0d8');
        poly(g,[G(12,3,5),G(12,8,5),G(15,8,0),G(15,3,0)],'#b0b0b8');poly(g,[G(12,8,5),G(15,8,0),G(12,8,0)],'#c8c8d0');
        ln(g,G(12,3,5),G(12,8,5),'#e0e0e8');
        {const a=G(8.6,5.5,5),b=G(11.4,5.5,5);P(g,a[0],a[1]-3,1,3,'#4a4a54');P(g,b[0],b[1]-3,1,3,'#4a4a54');line(g,a[0],a[1]-3,b[0],b[1]-3,'#3a3a44');}
        {const p=G(10.5,4.2,5);person(g,p[0],p[1],'#e08a3a');P(g,p[0]-1,p[1],4,1,'#c05050');}
      },OL);
      layer(base,g=>{
        box(g,G(8,12),5,3,6,'#9a968f','#7e7a74','#d8d4cc');
        box(g,G(8,13),5,1,4,'#a29e97','#86827c','#e0dcd4',{noAO:1});
        box(g,G(8,14),5,1,2,'#aaa69f','#8e8a84','#e6e2da',{noAO:1});
        const a=G(5.6,11.6,6),b=G(5.6,14.6,0);P(g,a[0],a[1]-4,1,4,'#4a4a54');P(g,b[0],b[1]-4,1,4,'#4a4a54');line(g,a[0],a[1]-4,b[0],b[1]-4,'#3a3a44');
        {const p=G(14,12);person(g,p[0],p[1],'#4a8ad0');P(g,p[0]-1,p[1],4,1,'#c05050');}
        lamp(g,ng,G(15.4,1.4)[0],G(15.4,1.4)[1],15,base.g);
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k94',e);}

  /* ======================== k92 遛狗公園 ======================== */
  try{(function(){const K=92,OL=[52,72,44];
    const POST='#7a5a38',RAIL='#a07e54';
    /* v1：犬隻敏捷場——四周木柵欄（前緣留門）＋A 字爬坡＋雙跨欄＋繞桿＋藍色隧道 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#79b060','#699a52','#8bc272');
      for(let t=0;t<9;t++){const p=G(3+HL(92,t,1)*10,3+HL(92,t,2)*10);P(base.g,p[0],p[1],3,1,'#6d9a52');}
      layer(base,g=>{fence(g,G(1,15),G(1,1),5,POST,RAIL,4);fence(g,G(1,1),G(15,1),5,POST,RAIL,4);lamp(g,ng,G(1.6,1.6)[0],G(1.6,1.6)[1],14,base.g);},OL);
      layer(base,g=>{
        poly(g,[G(3,3,0),G(5.5,3,7),G(5.5,5.5,7),G(3,5.5,0)],'#f0a838');
        poly(g,[G(5.5,3,7),G(8,3,0),G(8,5.5,0),G(5.5,5.5,7)],'#c87820');
        poly(g,[G(7.1,3,2.5),G(8,3,0),G(8,5.5,0),G(7.1,5.5,2.5)],'#f0d040');
        poly(g,[G(3,5.5,0),G(5.5,5.5,7),G(8,5.5,0)],'#9a7448');ln(g,G(5.5,5.5,7),G(5.5,3,7),'#ffe0a0');
        const tun=[];for(let i=10.5;i<=14.5;i+=.5)tun.push(i);
        for(const i of tun){const p=G(i,7.4,2),dk=(R(i*2)%2)===1;blob(g,p[0],p[1],3,2,dk?['#5a92d8','#3a74c8','#2a56a0','#20447e']:['#8ac0f8','#5a98e8','#3470c4','#285898']);}
        {const p=G(14.7,7.4,2);ell(g,p[0],p[1]+1,2,2,'#1a2e58');}
      },OL);
      layer(base,g=>{
        for(const i of [5,9.5]){const a=G(i,9.6),b=G(i,11.6);P(g,a[0],a[1]-6,1,6,'#f4f4f4');P(g,b[0],b[1]-6,1,6,'#f4f4f4');
          const n=Math.abs(b[0]-a[0]);for(let k=0;k<=n;k++){const x=a[0]-k,y=R(a[1]+(b[1]-a[1])*k/n)-4;P(g,x,y,1,1,(k>>1)%2?'#e05252':'#f4f4f4');}}
        dog(g,G(7.4,11)[0],G(7.4,11)[1],'#8a5a3a');dog(g,G(11.5,11.5)[0],G(11.5,11.5)[1],'#f0ece0',true);
        person(g,G(12.5,12.8)[0],G(12.5,12.8)[1],'#4a78b8');
      },OL);
      layer(base,g=>{
        fence(g,G(15,1),G(15,15),5,POST,RAIL,4);fence(g,G(15,15),G(9.5,15),5,POST,RAIL,4);fence(g,G(6,15),G(1,15),5,POST,RAIL,4);
        {const a=G(9.5,15),b=G(6,15);P(g,a[0],a[1]-7,1,7,'#5a4028');P(g,b[0],b[1]-7,1,7,'#5a4028');P(g,b[0]-4,b[1]-13,9,5,'#e8dcbc');P(g,b[0],b[1]-12,1,5,'#8a7a5a');
          P(g,b[0]-2,b[1]-11,5,2,'#c8784a');P(ng,b[0]-4,b[1]-13,9,5,'rgba(255,233,176,.55)');}
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：樹蔭休憩犬園——後緣綠籬＋紅瓦涼棚（長椅）＋東角大樹＋戲水淺池＋飲水台＋雙柱入口 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#79b060','#699a52','#8bc272');
      for(let t=0;t<4;t++){const p=G(9+t*1.5,13.5-t*.2);P(base.g,p[0],p[1],4,2,'#c8b898');}
      layer(base,g=>{
        wallAlong(g,G(.9,15.2),G(.9,.9),4,'#3e7a36','#6ab052');wallAlong(g,G(.9,.9),G(15.2,.9),4,'#34702e','#62a84a');
        for(let t=1;t<15;t+=2){const p=G(.9,t);P(g,p[0],p[1]-3,1,1,'#78c060');const q=G(t,.9);P(g,q[0],q[1]-3,1,1,'#70b858');}
      },OL);
      layer(base,g=>{
        quad(base.g,G,4.5,4.5,10,10,'rgba(20,40,20,.22)');
        for(const q of [[3.3,3.3],[7.7,3.3],[3.3,7.7],[7.7,7.7]]){const p=G(q[0],q[1]);P(g,p[0],p[1]-9,1,9,'#6a4a2e');}
        {const p=G(5.5,5.8);bench(g,p[0]-3,p[1]+1);}
        hipRoof(g,G(8.6,8.6,9),5.8,5.8,5,'#d0704c','#a24e34','#e08c6a');
        {const p=G(5.5,5.5,9);P(g,p[0],p[1]+1,2,1,'#f2e2a0');P(ng,p[0]-1,p[1]+1,4,2,'#ffe9a8');P(ng,p[0]-3,p[1]+2,8,5,'rgba(255,225,150,.2)');}
        tree(g,G(13.4,2.4)[0],G(13.4,2.4)[1],6,null,base.g);
      },OL);
      layer(base,g=>{
        {const c=G(10.6,10.6);ell(g,c[0],c[1],8,4,'#d8d0bc');ell(g,c[0],c[1],6,3,'#3a9ab8');ell(g,c[0],c[1]+1,6,2,'#6ac8e0');P(g,c[0]-3,c[1],3,1,'#b8ecf6');}
        {const p=G(13.2,7.6);P(g,p[0],p[1]-6,2,6,'#6a7a8a');P(g,p[0]-1,p[1]-7,4,1,'#8a9aaa');P(g,p[0]+2,p[1]-1,3,1,'#7fb0d8');}
        dog(g,G(12.3,5)[0],G(12.3,5)[1],'#8a5a3a',true);dog(g,G(10.6,10.4)[0],G(10.6,10.4)[1],'#f0ece0');dog(g,G(6,11)[0],G(6,11)[1],'#3a3230');
        person(g,G(7.5,12.2)[0],G(7.5,12.2)[1],'#c85a5a');
      },OL);
      layer(base,g=>{
        fence(g,G(15.2,1),G(15.2,15.2),4,POST,RAIL,4);fence(g,G(15.2,15.2),G(12,15.2),4,POST,RAIL,3);fence(g,G(9,15.2),G(1,15.2),4,POST,RAIL,4);
        for(const i of [12,9]){const p=G(i,15.2);P(g,p[0],p[1]-7,2,7,'#e8e0cc');P(g,p[0],p[1]-8,2,1,'#b8b0a0');}
        lamp(g,ng,G(2.2,14)[0],G(2.2,14)[1],14,base.g);
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k92',e);}

  /* ======================== k183 水舞光泉 ======================== */
  // 執行期疊加：日間水珠 (36,80)、夜間色相水柱 x=36 y70..96＋池面光暈 (36,102)——兩個變體都把主水柱留在 x=36
  try{(function(){const K=183,OL=[28,22,16];
    const STONE=['#e4dcc8','#c8bea6','#aca28a'];
    /* v1：三層疊盤古典噴泉——圓形石砌水池＋雙層承水盤與落水簾＋四座燈樁 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#cfc8b4','#a89e86','#e2dcc8');
      for(let t=0;t<4;t++){const w=26-t*5;P(base.g,36-w,86+t*6,2*w,1,'#c4bca6');}
      layer(base,g=>{
        for(let dx=-22;dx<=22;dx++){const e=eh(22,10,dx);P(g,36+dx,95+e,1,3,dx<-6?'#b0a68e':dx<6?'#a0967e':'#8a806a');}
        ell(g,36,95,22,10,'#d0c6ae');ell(g,36,95,20,8,'#3a76a4');ell(g,36,96,20,7,'#4a86b8');
        for(let dx=-20;dx<=20;dx+=5){const e=eh(22,10,dx);P(g,36+dx,95-e,1,1,'#e6dcc4');}
        P(g,22,98,4,1,'#7fc4e0');P(g,44,101,5,1,'#7fc4e0');P(g,30,103,3,1,'#6ab4d8');
      },OL);
      ell(ng,36,96,20,7,'rgba(90,170,220,.42)');
      layer(base,g=>{
        cyl(g,36,95,3,1,9,STONE,null);
        for(let dx=-10;dx<=10;dx++){const e=eh(10,4,dx);P(g,36+dx,86+e,1,2,dx<0?'#bcb29a':'#968c76');}
        ell(g,36,86,10,4,'#e8e0cc');ell(g,36,86,8,3,'#4a8ec0');ell(g,36,87,8,2,'#5aa0d0');
        for(const x of [27,29,43,45])P(g,x,89,1,6,'#bfe6f6');
        cyl(g,36,86,2,1,8,STONE,null);
        for(let dx=-6;dx<=6;dx++){const e=eh(6,2,dx);P(g,36+dx,77+e,1,2,dx<0?'#bcb29a':'#968c76');}
        ell(g,36,77,6,2,'#e8e0cc');ell(g,36,77,4,1,'#5aa0d0');
        for(const x of [31,41])P(g,x,79,1,5,'#bfe6f6');
        P(g,35,67,2,9,'#e4dcc8');P(g,37,67,1,9,'#aca28a');P(g,35,66,3,2,'#e8e0cc');P(g,36,58,1,9,'#d4ecf6');P(g,35,61,1,5,'#aee0f2');P(g,37,61,1,5,'#aee0f2');P(g,34,59,1,2,'#bfe6f6');P(g,38,59,1,2,'#bfe6f6');
        P(ng,36,58,1,9,'rgba(140,220,255,.75)');P(ng,27,89,1,6,'rgba(120,200,240,.6)');P(ng,45,89,1,6,'rgba(120,200,240,.6)');
        ell(ng,36,87,8,2,'rgba(110,190,240,.45)');
      },OL);
      layer(base,g=>{for(const q of [[9,96],[62,96],[26,104],[45,104]]){const x=q[0],y=q[1];P(base.g,x,y,3,1,'rgba(0,0,0,.2)');
        P(g,x,y-5,2,5,'#8a8274');P(g,x,y-5,1,5,'#a29a8a');P(g,x,y-7,2,2,'#ffe08a');P(ng,x,y-7,2,2,'#ffd97a');P(ng,x-1,y-8,4,4,'rgba(255,217,122,.22)');}},OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：現代旱噴廣場——濕石方陣地面噴嘴＋穿環中央高水柱（不鏽鋼環雕）＋L 型花崗岩座牆＋雙 LED 光柱 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#bcc0c4','#9ca0a6','#d0d4d8');
      quad(base.g,G,3,3,13,13,'#7a8690');quad(base.g,G,3.7,3.7,12.3,12.3,'#8a98a4');
      for(const q of [[5,10],[10,6],[7.5,11.5],[11.5,9]]){const p=G(q[0],q[1]);P(base.g,p[0],p[1],4,1,'#a8bccb');}
      quad(ng,G,3.7,3.7,12.3,12.3,'rgba(80,160,220,.28)');
      layer(base,g=>{
        box(g,G(14,2),12,1,3,'#dcdce0','#a8acb2','#ececf0');box(g,G(2,14),1,12,3,'#dcdce0','#a8acb2','#ececf0');
        const pil=(q,col)=>{const S=G(q[0],q[1]);box(g,S,1,1,17,'#eef2f6','#b4bec8','#f8fafc');faceRect(g,S,-1,0,2,2,12,col);faceRect(g,S,1,0,1,2,12,shade(col,-40));
          faceRect(ng,S,-1,0,2,2,12,'#b8f0ff');faceRect(ng,S,1,0,1,2,12,'#8ad8f0');P(ng,S[0]-3,S[1]-18,6,5,'rgba(150,230,255,.18)');};
        pil([15,3],'#8ad0ec');pil([3,15],'#b89ae8');
      },OL);
      const ring=(front)=>{const pts=[];for(let k=0;k<64;k++){const a=k/64*6.2832,c=Math.cos(a),s=Math.sin(a);if(front!==(c>=0))continue;
          pts.push([G(8+4.6*c,8,6.4+6.4*s),s,c]);}return pts;};
      layer(base,g=>{
        for(const q of [[5,5],[8,5],[11,5],[5,8],[11,8],[5,11],[8,11],[11,11]]){const p=G(q[0],q[1]);const hh=(q[0]+q[1])%2?5:7;
          P(g,p[0],p[1]-hh,1,hh,'#d8f2fb');P(g,p[0]-1,p[1]-1,3,1,'#eefaff');P(ng,p[0],p[1]-hh,1,hh,'rgba(150,225,255,.7)');}
        P(g,36,70,1,24,'#e6f6fc');P(g,35,76,1,14,'#b4e2f4');P(g,37,76,1,14,'#b4e2f4');P(g,34,70,1,3,'#cfeefa');P(g,38,70,1,3,'#cfeefa');P(g,33,92,7,1,'#eefaff');
        P(ng,36,70,1,24,'rgba(160,230,255,.8)');
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k183',e);}

  /* ======================== k77 水塔景觀 ======================== */
  // v0 地基畫在 ay-14（下偏半格）；變體依合約把佔地菱形對齊南頂點 (36,110)
  try{(function(){const K=77,OL=[36,30,24];
    const flowerBed=(g,x,y,c)=>{P(g,x,y,6,3,'#5f8a48');P(g,x,y,6,1,'#78a85a');P(g,x+1,y,1,1,c);P(g,x+4,y+1,1,1,c);P(g,x+2,y+2,1,1,'#f0e8d0');};
    /* v1：鉚接鋼構球形水塔——四支斜腳＋X 形斜撐＋中央立管與爬梯＋赤道環形走道＋橘色城鎮色帶＋頂端航空警示燈 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#9a9484','#8c8678','#a8a294');
      quad(base.g,G,3,3,13,13,'#aca696');quad(base.g,G,5,5,11,11,'#b8b2a2');
      const legB={N:G(4,4),E:G(12,4),W:G(4,12),S:G(12,12)},legT={N:[36,57],E:[46,61],W:[26,61],S:[36,65]};
      const leg=(g,k)=>{const b=legB[k],t=legT[k];line(g,b[0],b[1],t[0],t[1],'#8a949e');line(g,b[0]+1,b[1],t[0]+1,t[1],'#58606a');P(base.g,b[0]-1,b[1]-1,4,2,'#7a766c');};
      const mid=(k,t)=>{const b=legB[k],u=legT[k];return [b[0]+(u[0]-b[0])*t,b[1]+(u[1]-b[1])*t];};
      layer(base,g=>{
        leg(g,'N');leg(g,'E');leg(g,'W');
        for(const pr of [['N','E'],['N','W']]){ln(g,mid(pr[0],.1),mid(pr[1],.55),'#6a727c');ln(g,mid(pr[1],.1),mid(pr[0],.55),'#6a727c');ln(g,mid(pr[0],.55),mid(pr[1],.55),'#6a727c');}
        P(g,35,62,3,33,'#9aa2aa');P(g,35,62,1,33,'#b8c0c8');P(g,37,62,1,33,'#6a727c');
      },OL);
      layer(base,g=>{
        blob(g,36,47,13,12,['#eef2f4','#c8d0d6','#a0aab2','#7a848e']);
        for(let dx=-13;dx<=13;dx++){const e=eh(13,3,dx);P(g,36+dx,48+e,1,3,dx<-4?'#f6b86a':dx<5?'#f2a854':'#c88438');}
        for(const x of [30,33,36,39,42])P(g,x,50+(Math.abs(x-36)<4?1:0),2,1,'#fff6e8');
        for(let a=0;a<12;a++){const x=R(36+Math.cos(a/12*6.283)*10),y=R(42+Math.sin(a/12*6.283)*3);if(y<42)continue;P(g,x,y,1,1,'#8a949c');}
        P(g,34,34,5,2,'#b8c0c8');P(g,35,32,3,2,'#d8dee2');P(g,36,29,1,3,'#5a626c');P(g,36,28,1,1,'#e05252');
        P(ng,36,28,1,1,'#ff6a5a');P(ng,35,27,3,3,'rgba(255,90,70,.35)');
      },OL);
      layer(base,g=>{
        leg(g,'S');
        for(const k of ['W','E']){ln(g,mid('S',.1),mid(k,.55),'#6a727c');ln(g,mid(k,.1),mid('S',.55),'#6a727c');ln(g,mid('S',.55),mid(k,.55),'#6a727c');}
        for(let y=64;y<100;y+=3)P(g,39,y,3,1,'#5a626c');P(g,39,63,1,37,'#4a525c');P(g,41,63,1,37,'#4a525c');
        for(let dx=-15;dx<=15;dx++){const e=eh(15,4,dx),y=58+e;P(g,36+dx,y,1,1,'#4e565e');P(g,36+dx,y-3,1,1,'#7a828c');if((dx+15)%4===0)P(g,36+dx,y-3,1,3,'#6a727c');}
        for(const dx of [-9,9]){const y=58+eh(15,4,dx)-4;P(g,36+dx,y,2,1,'#f2e2a0');P(ng,36+dx,y,2,1,'#ffe9a8');P(ng,35+dx,y-1,4,3,'rgba(255,225,150,.2)');}
        flowerBed(g,9,93,'#e86a8a');flowerBed(g,57,93,'#e8b44a');bench(g,20,104);
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：紅磚歷史水塔——圓磚塔身（拱窗／石腰線）＋出挑托架＋米白水櫃層（圓窗）＋石板錐頂＋燈籠亭與風向標 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#9a9484','#8c8678','#a8a294');
      ell(base.g,36,99,17,8,'#aca696');ell(base.g,36,100,12,5,'#b8b2a2');
      const BR=['#dc9474','#c87c58','#b46a46','#a05a3a','#8a4c30'];
      layer(base,g=>{
        cyl(g,36,99,9,4,33,BR,null);
        for(const yy of [89,77])for(let dx=-9;dx<=9;dx++)P(g,36+dx,yy+eh(9,4,dx),1,1,dx<3?'#ece0c8':'#c8bca4');
        for(let yy=70;yy<98;yy+=4)for(let dx=-8;dx<=8;dx+=4)P(g,36+dx+((yy>>2)&1)*2,yy+eh(9,4,dx),1,1,'rgba(90,40,24,.25)');
        const win=(x,y,w,h)=>{P(g,x,y+1,w,h-1,'#3a2a24');if(w>1)P(g,x+1,y,w-2,1,'#3a2a24');P(g,x-1,y+h,w+2,1,'#e0d4bc');};
        win(35,70,3,6);win(29,71,1,5);win(42,71,1,5);win(35,82,3,6);win(29,83,1,5);
        P(g,33,93,6,9,'#e0d4bc');P(g,34,94,4,8,'#4a3226');P(g,35,93,2,1,'#e0d4bc');
        P(ng,35,71,3,5,'#ffe0a0');P(ng,35,83,3,5,'#ffd890');P(ng,34,95,4,7,'rgba(255,214,140,.55)');
        for(let dx=-11;dx<=11;dx++){const e=eh(11,5,dx);P(g,36+dx,65+e,1,2,dx<0?'#9a7458':'#6a4c38');if(dx%3===0)P(g,36+dx,67+e,1,1,'#5a3e2c');}
        cyl(g,36,64,12,5,12,['#f4ead4','#e6dac0','#d4c8ac','#beb094','#a89a7e'],null);
        for(let dx=-12;dx<=12;dx+=4)P(g,36+dx,53+eh(12,5,dx),1,11,'rgba(120,100,70,.28)');
        P(g,35,57,3,3,'#4a5a6a');P(g,36,56,1,1,'#4a5a6a');P(ng,35,57,3,3,'#ffe9b8');
        for(let dx=-13;dx<=13;dx++){const e=eh(13,5,dx);P(g,36+dx,52+e,1,1,'#3a4450');}
        cone(g,36,34,51,13,5,(dx,u)=>u<-.35?'#7e8e9c':u<.25?'#66768a':'#505e6c');
        for(let dx=-12;dx<=12;dx+=3){const top=R(34+(51-34)*Math.abs(dx/13.5)*.92);P(g,36+dx,top+2,1,Math.max(0,51-top-1),'rgba(30,40,50,.18)');}
        cyl(g,36,37,2,1,4,['#e8e0cc','#c8bca4','#a89c84'],null);P(g,35,34,3,2,'#3a4450');P(ng,35,34,3,2,'#ffe0a0');
        cone(g,36,27,32,3,1,(dx,u)=>u<0?'#6a7a88':'#4e5c68');
        P(g,36,21,1,6,'#3a3a3a');P(g,34,22,5,1,'#3a3a3a');P(g,38,21,1,1,'#3a3a3a');
      },OL);
      layer(base,g=>{flowerBed(g,12,96,'#e86a8a');flowerBed(g,54,96,'#e8b44a');lamp(g,ng,23,104,11,base.g);},OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k77',e);}

  /* ======================== k74 涼亭 ======================== */
  // v0 地基畫在 ay-14（下偏半格、被畫布下緣裁掉）；變體依合約把佔地菱形南頂點放在 (36,110)
  try{(function(){const K=74,OL=[26,30,44];
    const STONE=['#e4dccc','#d0c6b2','#b8ae9a','#9c927e'];
    // 翹簷攢尖頂：pw<1 讓坡面近頂陡、近簷緩（凹曲線）；pal 五段＝左側窄面/左面/正面/右面/右側窄面
    const sweep=(g,cx,apY,by,rx,ry,pal,pw)=>{
      for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));const top=R(apY+(by-apY)*Math.pow(Math.abs(u),pw));
        P(g,cx+dx,top,1,by+e-top+1,u<-.92?pal[0]:u<-.38?pal[1]:u<.38?pal[2]:u<.92?pal[3]:pal[4]);}
      for(const u0 of [-.92,-.38,.38,.92]){const yb=by+R(ry*Math.sqrt(1-u0*u0));let lx=null,ly=null;
        for(let t=0;t<=1.0001;t+=.05){const x=R(cx+u0*(rx+.5)*t),y=R(apY+(yb-apY)*Math.pow(t,pw));if(x!==lx||y!==ly)P(g,x,y,1,1,u0<0?shade(pal[1],18):shade(pal[3],-14));lx=x;ly=y;}}
    };
    const eaveTrim=(g,cx,by,rx,ry,trim)=>{for(let dx=-rx;dx<=rx;dx++){const e=eh(rx,ry,dx);P(g,cx+dx,by+e,1,1,dx<0?trim:shade(trim,-26));if(Math.abs(dx)<rx-1)P(g,cx+dx,by+e+1,1,1,'#3a2e28');}
      P(g,cx-rx-1,by-2,1,2,trim);P(g,cx+rx+1,by-2,1,2,shade(trim,-26));};
    /* v1：重簷八角亭——雙層石台基＋八根朱柱＋美人靠＋灰藍琉璃瓦重簷攢尖＋金葫蘆頂；前掛紅燈籠 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#b0a89a','#a09888','#c6beae');
      layer(base,g=>{ // 後方小松＋前左太湖石
        tree(g,57,92,5,['#6aa860','#4a8a4a','#346a3a','#244e2c'],base.g);
      },OL);
      layer(base,g=>{
        cyl(g,36,98,17,7,3,STONE,'#ddd4c2');
        cyl(g,36,95,14,6,2,STONE,'#e8e0d0');
        ell(g,36,93,10,4,'#c4baa6');
        P(g,31,103,10,1,'#e4dccc');P(g,31,104,10,2,'#b8ae9a');P(g,30,105,12,1,'#e4dccc');P(g,30,106,12,1,'#9c927e');
      },OL);
      const cols=[];for(let k=0;k<8;k++){const a=(k+.5)/8*6.2832;cols.push([R(36+Math.cos(a)*11),R(93+Math.sin(a)*4.5),Math.sin(a)]);}
      layer(base,g=>{
        const col=c=>{P(g,c[0]-1,79,2,c[1]-79,'#c44a36');P(g,c[0],79,1,c[1]-79,'#942e22');};
        for(const c of cols)if(c[2]<0)col(c);
        const rail=(a,b)=>{line(g,a[0],a[1]-5,b[0],b[1]-5,'#a83c2c');line(g,a[0],a[1]-3,b[0],b[1]-3,'#7e2c20');};
        rail(cols[4],cols[5]);rail(cols[5],cols[6]);rail(cols[6],cols[7]);
        for(const c of cols)if(c[2]>=0)col(c);
        rail(cols[0],cols[1]);rail(cols[2],cols[3]);rail(cols[3],cols[4]);rail(cols[7],cols[0]);
      },OL);
      layer(base,g=>{
        sweep(g,36,56,80,19,7,['#a4b2b8','#8a9aa2','#6c7c86','#52606a','#46525c'],.6);
        eaveTrim(g,36,80,19,7,'#d8cbb0');
        P(g,36,88,1,2,'#3a2e28');P(g,35,90,3,3,'#d84a3a');P(g,35,90,1,3,'#f07a5a');P(g,35,93,3,1,'#8a2a20');P(g,36,94,1,1,'#e8b44a');
        cyl(g,36,72,8,3,4,['#c4503a','#b0402e','#983426','#7e2a20'],null);
        sweep(g,36,49,67,13,5,['#a4b2b8','#8a9aa2','#6c7c86','#52606a','#46525c'],.6);
        eaveTrim(g,36,67,13,5,'#d8cbb0');
        P(g,35,45,3,4,'#e0b050');P(g,35,45,1,4,'#f4d27a');P(g,36,42,1,3,'#c09030');
      },OL);
      P(ng,35,90,3,3,'#ffb878');P(ng,34,89,5,5,'rgba(255,170,90,.28)');
      put(K,1,base,nt,ax,ay);}
    /* v2：紫藤花架廊＋方亭——右後木構方亭（四坡木瓦頂）接出左前長條花架廊（橫樑／格柵／垂掛紫藤）＋長椅＋小池 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#b0a89a','#a09888','#c6beae');
      for(const q of [[15,11],[13.6,11.6],[12.2,12.2]]){const p=G(q[0],q[1]);ell(base.g,p[0],p[1],2,1,'#cdc4b2');P(base.g,p[0]-2,p[1]+1,5,1,'#9c927e');}
      layer(base,g=>{
        const c=G(13,5.5);ell(g,c[0],c[1],7,3,'#8e8676');ell(g,c[0],c[1],6,2,'#3f93b0');P(g,c[0]-4,c[1],3,1,'#8fd4e6');P(g,c[0]+2,c[1]+1,2,1,'#6ab8d2');
        P(g,c[0]-8,c[1]-2,2,2,'#5e9a50');P(g,c[0]-8,c[1]-3,1,1,'#e06a8a');
      },OL);
      const WD=['#c49a6a','#9a7048','#74522f'];
      layer(base,g=>{ // 方亭：木平台＋四柱＋四坡頂
        box(g,G(8.5,7.5),6,6,2,'#bca078','#8e7452','#cdb28a');
        for(const q of [[3,2],[8,2],[3,7],[8,7]]){const p=G(q[0],q[1],2);P(g,p[0]-1,p[1]-12,2,12,WD[0]);P(g,p[0],p[1]-12,1,12,WD[2]);}
        {const a=G(8,7,2),b=G(8,2,2);line(g,a[0],a[1]-4,b[0],b[1]-4,WD[1]);line(g,a[0],a[1]-2,b[0],b[1]-2,WD[2]);}
        const S=G(9,8,14);pyramid(g,S,7,9,'#96604a','#6a4032','#b88068');
        const W=[S[0]-14,S[1]-7],E=[S[0]+14,S[1]-7];line(g,W[0],W[1]+1,S[0],S[1]+1,'#4a3226');line(g,S[0],S[1]+1,E[0],E[1]+1,'#3a261c');
        P(g,S[0],S[1]-17,1,2,'#6a4a30');
        P(g,S[0]-1,S[1]+2,1,2,'#3a2e28');P(g,S[0]-2,S[1]+4,3,3,'#e0a040');P(g,S[0]-2,S[1]+4,1,3,'#f4c870');
      },OL);
      P(ng,31,85,3,3,'#ffd890');P(ng,30,84,5,5,'rgba(255,200,120,.25)');
      layer(base,g=>{ // 花架廊
        const posts=[[4.5,10],[7.5,10],[4.5,12.5],[7.5,12.5],[4.5,15],[7.5,15]];
        for(const q of posts){const p=G(q[0],q[1]);P(base.g,p[0],p[1],3,1,'rgba(0,0,0,.18)');P(g,p[0]-1,p[1]-12,2,12,WD[0]);P(g,p[0],p[1]-12,1,12,WD[2]);}
        {const a=G(6,10.8),b=G(6,14.2);line(g,a[0],a[1]-3,b[0],b[1]-3,'#a07a50');line(g,a[0],a[1]-2,b[0],b[1]-2,'#6e5034');}
        for(const i of [4.5,7.5]){const a=G(i,8.6,12),b=G(i,15.6,12);line(g,a[0],a[1],b[0],b[1],WD[0]);line(g,a[0],a[1]+1,b[0],b[1]+1,WD[2]);}
        for(let j=9;j<=15.6;j+=1.1){const a=G(3.8,j,13),b=G(8.2,j,13);line(g,a[0],a[1],b[0],b[1],'#d8b488');
          for(let t=1;t<8;t+=2){const x=R(a[0]+(b[0]-a[0])*t/8),y=R(a[1]+(b[1]-a[1])*t/8);const L=2+((R(j*10)+t)%3);
            P(g,x,y+1,1,L,((t+R(j*10))%2)?'#a07ad8':'#7e58b8');P(g,x,y+L+1,1,1,'#5e3e98');}
          P(g,R(a[0]+(b[0]-a[0])*.5),R(a[1]+(b[1]-a[1])*.5)-1,2,1,'#6a9a50');}
      },OL);
      layer(base,g=>{lamp(g,ng,G(12.5,14)[0],G(12.5,14)[1],12,base.g);},OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k74',e);}

  /* ======================== k78 古樹神木 ======================== */
  // v0 地基同樣畫在 ay-14；變體南頂點放 (36,110)
  try{(function(){const K=78,OL=[40,50,30];
    const LEAF=['#8cd473','#6baf55','#4a7c3f','#2d5a27'];
    const TRK=['#9a7050','#7a5636','#5c3e26','#432c1a'];
    /* v1：老榕樹——寬闊傘狀樹冠＋垂落氣根＋石砌樹圍＋紅綢繫幹＋後左土地公小廟＋前右石燈 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#8a9a6a','#6b7a4a','#a4b584');
      layer(base,g=>{ // 土地公小廟
        const S=G(4.5,13.5);box(g,S,2,2,6,'#e8dcc4','#bfae92',null);
        P(g,S[0]-3,S[1]-5,2,4,'#5a3024');
        pyramid(g,[S[0],S[1]-5],3,4,'#d0583e','#9a3a28','#f08a60');
        P(g,S[0]-3,S[1]-5,2,2,'#e8a040');
      },OL);
      P(ng,15,91,2,2,'#ffb070');P(ng,14,90,4,4,'rgba(255,160,90,.25)');
      layer(base,g=>{cyl(g,36,99,15,6,3,['#c8c0ae','#b4ac98','#9c9482','#847c6a'],'#d4ccb8');ell(g,36,96,12,4,'#6a5a40');},OL);
      layer(base,g=>{
        for(let y=58;y<=95;y++){const hw=y>87?5+R((y-87)*.8):y<66?4:5;
          for(let x=-hw;x<hw;x++){const t=(x+hw)/(2*hw);P(g,36+x,y,1,1,t<.25?TRK[0]:t<.55?TRK[1]:t<.8?TRK[2]:TRK[3]);}}
        for(const b of [[33,64,90],[38,60,93],[35,70,80]])P(g,b[0],b[1],1,b[2]-b[1],'rgba(40,24,14,.4)');
        for(let k=0;k<3;k++){line(g,34+k,66,21+k,52,k===0?TRK[0]:k===1?TRK[1]:TRK[2]);line(g,37+k,64,52+k,50,k===0?TRK[1]:k===1?TRK[2]:TRK[3]);}
        for(let x=31;x<41;x++)P(g,x,79,1,2,x<36?'#e05a48':'#b83a30');P(g,40,81,1,4,'#b83a30');P(g,41,82,1,3,'#8e2a22');
      },OL);
      // 氣根（r4 重畫）：1px、長短不一、微彎；僅兩根落地（根腳加粗＋陰影），其餘懸在半空。
      // 不描外框（外框會把 1px 根鬚撐成 3px 暗柱＝讀成亭柱），色調偏灰褐與樹幹區分。
      layer(base,g=>{
        const AR=['#5e4c3a','#8a7358','#a48c6c'];
        // [x0,y0,長度,末端側擺,是否落地]
        const roots=[[8,55,39,-1,1],[20,59,15,1,0],[25,60,8,-1,0],[45,60,12,-1,0],[51,59,31,1,1],[58,57,19,1,0],[62,55,9,0,0]];
        for(const r of roots){const [x0,y0,L,sw,gr]=r;
          for(let n=0;n<L;n++){const t=n/Math.max(1,L-1);const x=x0+R(sw*t*t);
            const c=n<3?AR[0]:(gr&&((n>>2)&3)===1)?AR[2]:((n>>3)&1)?AR[1]:shade(AR[1],-10);
            P(g,x,y0+n,1,1,n===L-1&&!gr?AR[2]:c);}
          if(gr){const x=x0+sw,y=y0+L-1;P(base.g,x-1,y+1,4,1,'rgba(0,0,0,.22)');P(g,x-1,y,3,1,AR[1]);P(g,x-1,y-1,1,1,AR[0]);P(g,x+1,y-1,1,1,AR[0]);P(g,x-2,y,1,1,AR[0]);}
        }
      });
      layer(base,g=>{
        blob(g,36,48,31,12,LEAF);blob(g,21,40,13,8,LEAF);blob(g,50,38,14,9,LEAF);blob(g,35,31,13,8,LEAF);
        for(const t of [[14,50],[30,44],[46,48],[58,46],[40,34]])P(g,t[0],t[1],2,1,'#a3d68b');
      },OL);
      layer(base,g=>{const x=55,y=101;P(base.g,x-1,y,5,1,'rgba(0,0,0,.2)');P(g,x,y-6,3,6,'#a8a298');P(g,x,y-6,1,6,'#c4beb2');P(g,x-1,y-8,5,2,'#8e887c');P(g,x,y-10,3,2,'#b4aea2');P(g,x+1,y-5,1,2,'#ffd97a');},OL);
      P(ng,56,96,1,2,'#ffe08a');P(ng,54,94,5,5,'rgba(255,217,122,.22)');
      put(K,1,base,nt,ax,ay);}
    /* v2：斜幹古松——苔石土丘上斜生的古松（雲片狀平展枝葉）＋木叉支撐架＋注連繩＋前緣石柱繩欄＋石碑＋石燈 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#8a9a6a','#6b7a4a','#a4b584');
      const ROCK=['#c4c0b4','#a6a296','#88847a','#6c685e'];
      layer(base,g=>{
        P(g,10,85,4,7,'#a8a49a');P(g,10,85,1,7,'#c8c4b8');P(g,13,85,1,7,'#86827a');P(g,11,87,2,1,'#6c685e');P(g,11,89,2,1,'#6c685e');
      },OL);
      layer(base,g=>{ell(g,36,96,17,6,'#6e7e50');ell(g,35,95,13,4,'#7e9058');blob(g,23,95,5,3,ROCK);blob(g,48,97,4,2,ROCK);},OL);
      const trunkPath=catmull([[33,95],[31,86],[34,77],[40,68],[43,58],[40,48],[36,40],[37,33]],.08);
      const limb=(g,pts,w0,w1)=>{const p=catmull(pts,.1);p.forEach((q,n)=>{const w=w0+(w1-w0)*n/Math.max(1,p.length-1);const hw=Math.max(1,R(w));
        for(let x=-hw;x<hw;x++)P(g,q[0]+x,q[1],1,2,x<-hw/2?TRK[0]:x<hw/2-.5?TRK[1]:TRK[2]);});};
      const pad=(g,cx,cy,rx,ry)=>{ell(g,cx,cy+1,rx,ry,'#24482a');ell(g,cx,cy,rx,ry,'#3a6a38');ell(g,cx-R(rx*.2),cy-1,R(rx*.65),Math.max(1,ry-1),'#528a44');P(g,cx-R(rx*.45),cy-ry,R(rx*.4),1,'#78b25a');};
      layer(base,g=>{ // 支撐木叉（r4：縮短、斜撐——根腳靠土丘，Y 叉頂托住枝端）
        for(const s of [[19,89,12,71],[44,88,58,66]]){const [fx0,fy0,tx,ty]=s;
          P(base.g,fx0-1,fy0+1,4,1,'rgba(0,0,0,.22)');
          line(g,fx0,fy0,tx,ty,'#b89e7c');line(g,fx0+1,fy0,tx+1,ty,'#8a7456');
          const d=tx<fx0?-1:1;P(g,tx-1,ty-1,1,1,'#9a8466');P(g,tx-2,ty-2,1,1,'#9a8466');P(g,tx+2,ty-1,1,1,'#7e6a50');P(g,tx+3,ty-2,1,1,'#7e6a50');
          P(g,tx,ty+2,2,1,'#e8dcb0');}
      },OL);
      layer(base,g=>{
        limb(g,[[34,77],[26,72],[18,70],[9,68]],2.4,1);
        limb(g,[[41,65],[50,64],[57,63],[63,62]],2.2,1);
        limb(g,[[40,48],[31,45],[24,43]],1.8,1);
        trunkPath.forEach((q,n)=>{const w=4.5-3*n/trunkPath.length,hw=Math.max(1,R(w));for(let x=-hw;x<hw;x++){const t=(x+hw)/(2*hw);P(g,R(q[0])+x,R(q[1]),1,2,t<.3?TRK[0]:t<.6?TRK[1]:t<.85?TRK[2]:TRK[3]);}});
        for(let x=28;x<37;x++){P(g,x,84,1,2,x<32?'#efe4b8':'#cfc394');if(x%3===0)P(g,x,86,1,2,'#f8f8f0');}
      },OL);
      layer(base,g=>{pad(g,11,65,9,3);pad(g,59,59,9,3);pad(g,24,40,8,3);pad(g,46,39,8,3);pad(g,37,29,10,4);},OL);
      layer(base,g=>{
        const ps=[20,55,90,125,160].map(a=>[R(36+19*Math.cos(a*Math.PI/180)),R(96+8*Math.sin(a*Math.PI/180))]);
        for(let n=0;n<ps.length-1;n++){const a=ps[n],b=ps[n+1];const m=Math.abs(b[0]-a[0]);for(let k=0;k<=m;k++){const t=k/m;P(g,R(a[0]+(b[0]-a[0])*t),R(a[1]+(b[1]-a[1])*t)-4+R(Math.sin(t*Math.PI)*2),1,1,'#c8b890');}}
        for(const p of ps){P(g,p[0],p[1]-6,2,6,'#8e8e94');P(g,p[0],p[1]-6,1,6,'#aeaeb4');}
        const x=51,y=91;P(g,x,y-5,3,5,'#a8a298');P(g,x,y-5,1,5,'#c4beb2');P(g,x-1,y-7,5,2,'#8e887c');P(g,x,y-9,3,2,'#b4aea2');P(g,x+1,y-4,1,2,'#ffd97a');
      },OL);
      P(ng,52,87,1,2,'#ffe08a');P(ng,50,85,5,5,'rgba(255,217,122,.22)');
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k78',e);}

  /* ======================== k179 天燈廣場 ======================== */
  // 執行期夜間疊加：天燈自 (36±10, y≈80) 升起——兩個變體都把施放點留在中央
  try{(function(){const K=179,OL=[28,22,16];
    const seams=(g,G)=>{for(const t of [4,8,12]){ln(g,G(t,.6),G(t,15.4),'#bcaa84');ln(g,G(.6,t),G(15.4,t),'#bcaa84');}};
    const stoneLamp=(g,ng,sh,x,y)=>{P(sh,x-1,y,5,1,'rgba(0,0,0,.2)');P(g,x,y-8,2,8,'#9aa0a8');P(g,x,y-8,1,8,'#b8bec6');P(g,x-2,y-10,6,2,'#b8bec6');P(g,x-1,y-13,4,3,'#ffd97a');P(g,x-2,y-14,6,1,'#8a9098');
      P(ng,x-1,y-13,4,3,'#ffdf8a');P(ng,x-2,y-14,6,5,'rgba(255,217,122,.22)');};
    /* v1：放燈高台——方形石砌高台（左前兩階踏步）＋中央燒火石盆與待放天燈＋施放者兩人＋後側三柱燈籠串 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#c9b896','#a89468','#ded0ae');seams(base.g,G);
      const TH=8,POLES=[[4.6,4.6],[11.4,4.6],[4.6,11.4]].map(q=>G(q[0],q[1],TH));
      const balu=(g,i0,j0,i1,j1)=>{const a=G(i0,j0,TH),b=G(i1,j1,TH);line(g,a[0],a[1]-3,b[0],b[1]-3,'#bfae88');
        const n=R(Math.max(Math.abs(i1-i0),Math.abs(j1-j0))/2);for(let k=0;k<=n;k++){const t=k/n,p=G(i0+(i1-i0)*t,j0+(j1-j0)*t,TH);P(g,p[0],p[1]-3,1,3,'#9a8660');}};
      layer(base,g=>{stoneLamp(g,ng,base.g,G(3,15)[0],G(3,15)[1]);stoneLamp(g,ng,base.g,G(15,3)[0],G(15,3)[1]);},OL);
      layer(base,g=>{
        const S=box(g,G(12,12),8,8,TH,'#dccca8','#ad9a72','#e6d8b6')&&G(12,12);
        band(g,S,-1,0,16,4,1,'rgba(120,96,60,.22)');band(g,S,1,0,16,4,1,'rgba(70,54,30,.22)');
        ln(g,G(8,4.3,TH),G(8,11.7,TH),'#d0c098');ln(g,G(4.3,8,TH),G(11.7,8,TH),'#d0c098');
        box(g,G(10,13),3,1,6,'#e2d2ae','#b09c76','#eadcbc',{noAO:1});
        box(g,G(10,14),3,1,4,'#e2d2ae','#b09c76','#eadcbc',{noAO:1});
        box(g,G(10,15),3,1,2,'#e2d2ae','#b09c76','#eadcbc',{noAO:1});
        balu(g,4.3,4.3,4.3,11.7);balu(g,4.3,4.3,11.7,4.3);
      },OL);
      layer(base,g=>{
        for(const p of POLES){P(g,p[0],p[1]-23,1,23,'#6a4a30');P(g,p[0]-1,p[1]-24,3,1,'#8a5a3a');P(g,p[0],p[1]-26,1,2,'#e8b44a');}
        const str=(a,b)=>{const n=Math.abs(b[0]-a[0]);for(let k=0;k<=n;k++){const t=k/n,x=R(a[0]+(b[0]-a[0])*t),y=R(a[1]-22+(b[1]-a[1])*t+Math.sin(t*Math.PI)*4);
          P(g,x,y,1,1,'#5a4030');if(k%4===2&&k<n-1){P(g,x,y+1,2,3,'#e8742e');P(g,x,y+1,1,2,'#ffb060');P(g,x,y+4,1,1,'#c83a30');P(ng,x,y+1,2,3,'#ffb060');}}};
        str(POLES[0],POLES[1]);str(POLES[2],POLES[0]);
      },OL);
      layer(base,g=>{
        cyl(g,36,88,4,2,3,['#9a8a70','#847460','#6e604e'],'#3a2e24');
        for(let y=72;y<=82;y++){const hw=y<79?4:3;for(let x=-hw;x<hw;x++)P(g,36+x,y,1,1,x<-hw+2?'#fbe6b4':x<1?'#f2cc80':'#d8a050');}
        P(g,32,72,8,1,'#c04a34');P(g,36,73,1,9,'rgba(160,60,40,.45)');P(g,33,82,6,1,'#8a4a2a');P(g,35,83,2,1,'#ffd060');
        P(g,34,76,3,3,'#c8342a');P(g,35,77,1,1,'#f0c050');
        person(g,28,89,'#c85050');person(g,43,89,'#4a78b8');P(g,30,83,2,1,'#e8b890');P(g,41,83,2,1,'#e8b890');
      },OL);
      layer(base,g=>{balu(g,4.3,11.7,6.8,11.7);balu(g,10.2,11.7,11.7,11.7);balu(g,11.7,4.3,11.7,11.7);},OL);
      P(ng,32,73,8,9,'rgba(255,200,120,.85)');P(ng,35,83,2,1,'#ffd060');
      put(K,1,base,nt,ax,ay);}
    /* v2：巨型天燈雕塑——圓形鋪面中央石座上的高大紙燈籠（朱框／福字菱）＋右後許願牌木架＋左後天燈小賣亭 */
    {const {ax,ay,G,base,nt}=setup(72,112,36,110);const ng=nt.g;
      plate(base.g,ax,ay,1,'#c9b896','#a89468','#ded0ae');seams(base.g,G);
      ell(base.g,36,95,22,10,'#dccca6');ell(base.g,36,95,19,8,'#c4b28c');ell(base.g,36,95,17,7,'#d2c29e');
      layer(base,g=>{ // 許願牌木架（右後邊）
        const ps=[3,8,13].map(i=>G(i,1.6));
        for(const p of ps){P(g,p[0],p[1]-13,2,13,'#8a5a3a');P(g,p[0],p[1]-13,1,13,'#a8744c');}
        for(const z of [5,10]){const a=G(3,1.6,z),b=G(13,1.6,z);line(g,a[0],a[1],b[0],b[1],'#6a4430');
          for(let k=2;k<b[0]-a[0];k+=2){const x=a[0]+k,y=R(a[1]+(b[1]-a[1])*k/(b[0]-a[0]));P(g,x,y+1,1,2,((k>>1)%3)?'#c83a30':'#e0b040');}}
        {const a=G(2.4,1.6,14),b=G(13.6,1.6,14);line(g,a[0],a[1],b[0],b[1],'#b85a40');line(g,a[0],a[1]+1,b[0],b[1]+1,'#7a3424');}
      },OL);
      layer(base,g=>{ // 天燈小賣亭（左後邊）
        const S=G(5,11);const ty=box(g,S,3,4,9,'#d8b888','#a88658',null);
        faceRect(g,S,1,1,6,3,4,'#4a3226');for(let d=2;d<7;d+=2)faceRect(g,S,1,d,1,4,2,'#f0a040');
        hipRoof(g,[S[0],ty],3,4,4,'#c8503a','#983a2a','#e07050');
        for(let d=1;d<7;d+=2)faceRect(ng,S,1,d,1,4,2,'#ffc070');
      },OL);
      layer(base,g=>{
        cyl(g,36,99,8,3,4,['#e4dccc','#cfc6b2','#b0a690','#968c78'],'#e8e0d0');
        const top=60,bot=90;
        const prof=y=>y<top+3?[6,8,9][y-top]:R(10-4*Math.pow((y-top)/(bot-top),1.6));
        for(let y=top;y<=bot;y++){const hw=prof(y);for(let x=-hw;x<hw;x++){const u=(x+.5)/hw;
          P(g,36+x,y,1,1,u<-.6?'#fbe4ae':u<-.1?'#f6d292':u<.45?'#eab872':'#d49a58');
          P(nt.g,36+x,y,1,1,u<-.1?'rgba(255,214,140,.72)':u<.45?'rgba(250,186,110,.64)':'rgba(230,150,80,.52)');}}
        for(const f of [-.55,0,.55])for(let y=top+2;y<=bot;y++){const hw=prof(y),x=36+R(f*hw);P(g,x,y,1,1,f<0?'#c0543a':f>0?'#8a3424':'#a83e2c');P(nt.g,x,y,1,1,'rgba(150,60,30,.5)');}
        for(let x=-6;x<6;x++)P(g,36+x,top,1,1,x<0?'#d86a50':'#b04a36');
        {const hw=prof(top+12);for(let x=-hw;x<hw;x++)P(g,36+x,top+12,1,1,x<0?'#c04a34':'#9a3426');}
        {const bw=prof(bot);for(let x=-bw;x<bw;x++)P(g,36+x,bot+1,1,1,x<0?'#7a4a2a':'#5a3420');
          P(g,31,bot+2,1,3,'#5a5a62');P(g,40,bot+2,1,3,'#4a4a52');P(g,35,bot+2,2,1,'#ffb040');}
        const fu=(cx,cy)=>{for(let r=-3;r<=3;r++){const w=3-Math.abs(r);P(g,cx-w,cy+r,2*w+1,1,'#c8342a');}P(g,cx,cy-2,1,5,'#f0c050');P(g,cx-2,cy,5,1,'#f0c050');P(nt.g,cx-1,cy-1,3,3,'rgba(255,120,80,.6)');};
        fu(31,78);
      },OL);
      layer(base,g=>{stoneLamp(g,ng,base.g,G(15.2,4.5)[0],G(15.2,4.5)[1]);stoneLamp(g,ng,base.g,G(4.5,15.2)[0],G(4.5,15.2)[1]);},OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k179',e);}

  /* ---------- 3×3 共用（208×220，南頂點 (104,218)） ---------- */
  function fillPoly(g,pts,c){if(!g)return;let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}g.fillStyle=c;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const yc=y+.5,xs=[];
      for(let k=0;k<pts.length;k++){const a=pts[k],b=pts[(k+1)%pts.length];if((a[1]<=yc)!==(b[1]<=yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
      xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const xa=R(xs[k]),xb=R(xs[k+1]);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}}}
  const ringIJ=(ci,cj,rf,n,z)=>{const o=[];for(let k=0;k<n;k++){const a=k/n*6.2832,r=typeof rf==='function'?rf(a):rf;o.push([ci+r*Math.cos(a),cj+r*Math.sin(a),z||0]);}return o;};
  const scr=(G,pts)=>pts.map(p=>G(p[0],p[1],p[2]||0));
  function pathIJ(g,G,pts,w,col,closed){const n=pts.length,m=closed?n:n-1;
    for(let s=0;s<m;s++){const a=pts[s],b=pts[(s+1)%n],di=b[0]-a[0],dj=b[1]-a[1],L=Math.hypot(di,dj)||1,ni=-dj/L*w/2,nj=di/L*w/2;
      poly(g,[G(a[0]+ni,a[1]+nj),G(b[0]+ni,b[1]+nj),G(b[0]-ni,b[1]-nj),G(a[0]-ni,a[1]-nj)],col);}
    for(const p of pts){const q=G(p[0],p[1]);ell(g,R(q[0]),R(q[1]),Math.max(1,R(w*1.3)),Math.max(1,R(w*.6)),col);}}
  const SAK=['#fde0e8','#f4b4c8','#dc8aa6','#b06a84'];
  const TREEA=['#7cc062','#58a04a','#3e7a3a','#2c5a2e'],TREEB=['#94c86a','#6eaa50','#4e8a40','#366a32'];

  /* ======================== k112 中央公園 ======================== */
  try{(function(){const K=112,OL=[44,78,44];
    const bench3=(g,x,y)=>{P(g,x,y-2,7,1,'#9a7448');P(g,x,y-3,7,1,'#b88c5a');P(g,x,y-1,1,1,'#5a4028');P(g,x+6,y-1,1,1,'#5a4028');};
    const lamp3=(g,ng,sh,x,y)=>{P(sh,x,y,4,1,'rgba(0,0,0,.2)');P(g,x,y-13,1,13,'#3e4450');P(g,x-1,y-16,3,3,'#f2e2a0');P(g,x-1,y-17,3,1,'#2e2e36');
      P(ng,x-1,y-16,3,3,'#ffe9a8');P(ng,x-3,y-18,7,7,'rgba(255,225,150,.2)');};
    /* v1：大湖公園——不規則大湖＋湖心島小亭＋石拱橋＋前岸木棧碼頭與划船＋租船亭＋環湖步道＋周邊樹林 */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#8ab464','#76a052','#9cc478',1121);
      const LC=[26,22],rL=a=>11+2.5*Math.sin(2*a+.7)+1.5*Math.cos(3*a);
      pathIJ(base.g,G,ringIJ(LC[0],LC[1],a=>rL(a)+5.2,40),1.8,'#dccfa8',true);
      pathIJ(base.g,G,[[47,47],[40,40],[35.5,35.5]],2,'#dccfa8');
      layer(base,g=>{
        fillPoly(g,scr(G,ringIJ(LC[0],LC[1],a=>rL(a)+1.3,64)),'#d4c698');
        fillPoly(g,scr(G,ringIJ(LC[0],LC[1],rL,64)),'#4390b4');
        fillPoly(g,scr(G,ringIJ(LC[0]-.8,LC[1]-.8,a=>rL(a)-2.2,64)),'#58a8c8');
        for(const q of [[18,26,6],[30,16,5],[24,30,4],[33,24,3],[16,20,3]]){const p=G(q[0],q[1]);P(g,p[0]-q[2],p[1],q[2]*2,1,'#9ad6ea');}
        fillPoly(g,scr(G,ringIJ(20.5,16.5,4.2,24)),'#d4c698');fillPoly(g,scr(G,ringIJ(20.5,16.5,3.4,24)),'#86b464');
      },[36,70,90]);
      layer(base,g=>{ // 湖心島小亭
        const c=G(20.5,16.5);P(base.g,c[0]-2,c[1]+1,10,2,'rgba(20,40,20,.25)');
        for(const dx of [-5,-2,2,5])P(g,c[0]+dx,c[1]-8+(Math.abs(dx)>3?-1:1),1,8,'#f0ece0');
        cone(g,c[0],c[1]-17,c[1]-9,8,3,(dx,u)=>u<-.3?'#d0604a':u<.3?'#b44a36':'#8e3a2a');P(g,c[0],c[1]-19,1,2,'#e0b050');
        tree(g,c[0]+6,c[1]+1,3,TREEB,base.g);
      },OL);
      layer(base,g=>{ // 石拱橋：島→左前岸
        const I0=20.3,I1=21.9,J0=20,J1=32.5,H=6,N=26;
        for(let k=0;k<N;k++){const t0=k/N,t1=(k+1)/N,j0=J0+(J1-J0)*t0,j1=J0+(J1-J0)*t1,z0=H*Math.sin(Math.PI*t0)+1,z1=H*Math.sin(Math.PI*t1)+1;
          const a0=Math.max(0,4.2*Math.sin(Math.PI*(t0-.18)/.64)),a1=Math.max(0,4.2*Math.sin(Math.PI*(t1-.18)/.64));
          const lo0=(t0>.18&&t0<.82)?a0:0,lo1=(t1>.18&&t1<.82)?a1:0;
          poly(g,[G(I1,j0,lo0),G(I1,j1,lo1),G(I1,j1,z1),G(I1,j0,z0)],'#b4aa98');
          poly(g,[G(I0,j0,z0),G(I1,j0,z0),G(I1,j1,z1),G(I0,j1,z1)],'#e0d8c6');}
        for(let k=0;k<=N;k++){const t=k/N,j=J0+(J1-J0)*t,z=H*Math.sin(Math.PI*t)+1;const a=G(I0,j,z+2),b=G(I1,j,z+2);P(g,a[0],a[1],1,1,'#cfc6b2');P(g,b[0],b[1],1,1,'#9a907c');}
        for(let k=0;k<=N;k+=4){const t=k/N,j=J0+(J1-J0)*t,z=H*Math.sin(Math.PI*t)+1;const b=G(I1,j,z);P(g,b[0],b[1]-3,1,3,'#8a806e');const a=G(I0,j,z);P(g,a[0],a[1]-3,1,3,'#c8bea8');}
      },OL);
      layer(base,g=>{ // 木棧碼頭＋小船＋租船亭
        pathIJ(g,G,[[34.5,30.5],[29.5,25.5]],1.6,'#b08858');
        for(let t=0;t<=5;t+=1){const p=G(34.5-t,30.5-t);P(g,p[0]-1,p[1]+1,3,1,'#8a6a42');}
        pathIJ(g,G,[[30.2,25.2],[31.8,23.2]],1.4,'#b08858');
        const boat=(i,j,c)=>{const p=G(i,j);ell(g,p[0],p[1],4,1,'#6a4a2e');ell(g,p[0],p[1]-1,4,1,c);P(g,p[0]-2,p[1]-1,4,1,'#f0e8d8');P(g,p[0]+4,p[1]+1,3,1,'#8fd4e6');};
        boat(28.5,28,'#c85a40');boat(33.5,21.5,'#4a78b8');boat(24,23,'#e8b040');
        const S=G(44,33);const ty=box(g,S,3,3,7,'#f0e6d0','#c8b898',null);faceRect(g,S,-1,1,4,2,4,'#4a5a6a');faceRect(ng,S,-1,1,4,2,4,'#ffe0a0');
        pyramid(g,[S[0],ty+1],4,5,'#3e8a8a','#2a6666','#6ab0b0');
      },OL);
      const trees=[[3,10,8,0],[6,3,7,1],[13,2.5,8,0],[3,20,7,1],[2.5,30,8,0],[5,40,7,1],[11,45,6,0],[40,4,8,1],[46,11,7,0],[32,2.5,7,0],[45,20,6,1],[22,3,6,1],[38,45,6,0]];
      trees.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
      layer(base,g=>{for(const t of trees){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],t[3]?TREEB:TREEA,base.g);}},OL);
      layer(base,g=>{
        {const p=G(14,38);bench3(g,p[0]-3,p[1]);}{const p=G(40,26);bench3(g,p[0]-3,p[1]);}
        for(const q of [[10,33],[46,27],[30,6.5],[38,42]]){const p=G(q[0],q[1]);lamp3(g,ng,base.g,p[0],p[1]);}
        person(g,G(20,36)[0],G(20,36)[1],'#d86a6a');person(g,G(40,36)[0],G(40,36)[1],'#5a8ad0');person(g,G(34,31)[0],G(34,31)[1],'#f0c040');
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：丘陵觀景公園——後方人造丘＋螺旋登山步道＋山頂白色觀景塔＋櫻花林＋左前兒童遊戲場＋右前圓形玫瑰園（日晷） */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#8ab464','#76a052','#9cc478',1122);
      const HC=[17,17],HR=14,HH=24,LV=9;
      const rAt=t=>HR*(1-.8*Math.pow(t,1.3)),tAt=r=>Math.pow(Math.max(0,1-r/HR)/.8,1/1.3);
      pathIJ(base.g,G,[[47,47],[40,40],[30,30],[27,27]],2.2,'#dccfa8');
      pathIJ(base.g,G,[[35,35],[30,40],[22,40]],1.8,'#dccfa8');
      pathIJ(base.g,G,[[35,35],[40,30],[40,20],[33,12]],1.8,'#dccfa8');
      layer(base,g=>{ // 玫瑰園
        const c=[37,37];fillPoly(g,scr(G,ringIJ(c[0],c[1],7,40)),'#4e8a40');fillPoly(g,scr(G,ringIJ(c[0],c[1],6.2,40)),'#dccfa8');
        fillPoly(g,scr(G,ringIJ(c[0],c[1],5.2,40)),'#5e9a4a');fillPoly(g,scr(G,ringIJ(c[0],c[1],3.4,32)),'#dccfa8');fillPoly(g,scr(G,ringIJ(c[0],c[1],2.4,24)),'#5e9a4a');
        for(let k=0;k<22;k++){const a=k/22*6.2832,p=G(c[0]+4.3*Math.cos(a),c[1]+4.3*Math.sin(a));P(g,p[0],p[1]-1,2,1,k%2?'#e0506e':'#f48aa6');}
        for(let k=0;k<9;k++){const a=k/9*6.2832,p=G(c[0]+1.8*Math.cos(a),c[1]+1.8*Math.sin(a));P(g,p[0],p[1]-1,1,1,'#f8e070');}
        const p=G(c[0],c[1]);P(g,p[0]-1,p[1]-4,3,4,'#d8d0c0');P(g,p[0]-1,p[1]-4,1,4,'#ece6da');P(g,p[0]-2,p[1]-5,5,1,'#b8b0a0');P(g,p[0],p[1]-7,1,2,'#8a8270');
      },OL);
      layer(base,g=>{ // 遊戲場沙坑＋鞦韆＋溜滑梯
        fillPoly(g,scr(G,[[8,33],[20,33],[20,46],[8,46]]),'#e2d09c');
        for(const j of [35,43]){const a=G(10,j),b=G(13,j);P(g,a[0],a[1]-13,1,13,'#c84a3a');P(g,b[0],b[1]-13,1,13,'#a83a2c');line(g,a[0],a[1]-13,G(11.5,j,13)[0],G(11.5,j,13)[1],'#c84a3a');}
        {const a=G(11.5,35,13),b=G(11.5,43,13);line(g,a[0],a[1],b[0],b[1],'#8a8a92');
          for(const j of [37.5,40.5]){const t=G(11.5,j,13),s=G(11.5,j,3);line(g,t[0],t[1],s[0],s[1],'#6a6a72');P(g,s[0]-1,s[1],3,1,'#3a78c8');}}
        const T=G(17,37);box(g,T,2,2,9,'#e8c040','#b89020',null);pyramid(g,[T[0],T[1]-8],3,5,'#3a78c8','#2a5a98','#6aa8e8');
        {const a=G(16,39,9),b=G(16,45,1);for(let k=0;k<3;k++)line(g,a[0]-k,a[1],b[0]-k,b[1],k===0?'#f06a5a':k===1?'#d84a3a':'#a83428');}
        person(g,G(14,40)[0],G(14,40)[1],'#e88a3a');
      },OL);
      layer(base,g=>{ // 人造丘
        for(let L=0;L<=LV;L++){const t=L/LV,r=rAt(t),c=G(HC[0],HC[1],HH*t);blob(g,R(c[0]),R(c[1]),R(2.83*r),R(1.41*r),['#aad482','#8ec06a','#74a456','#5e8a46']);}
        for(let th=.25;th<2.3*Math.PI;th+=.02){const r=12.8-9.5*th/(2.3*Math.PI),t=tAt(r),a=th+.8;const ci=Math.cos(a),si=Math.sin(a);if(ci+si<-.35)continue;
          const p=G(HC[0]+r*ci,HC[1]+r*si,HH*t+.5);P(g,R(p[0]),R(p[1]),2,1,'#e6dab6');P(g,R(p[0]),R(p[1])+1,2,1,'#a89870');}
      },[40,70,40]);
      const sak=[[5,28,6],[28,4,6],[3,12,5],[12,3,5],[26,33,5],[33,24,5],[44,12,5]];sak.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
      layer(base,g=>{for(const s of sak){const p=G(s[0],s[1]);tree(g,p[0],p[1],s[2],SAK,base.g);}},OL);
      layer(base,g=>{ // 觀景塔
        const top=G(HC[0],HC[1],HH),x=R(top[0]),y=R(top[1])+2;
        box(g,[x,y],3,3,3,'#d8d0bc','#aca48e','#e4dcc8');
        box(g,[x,y-3],2,2,26,'#f2eee2','#c6bea8',null);
        for(let z=8;z<26;z+=6){faceRect(g,[x,y-3],-1,1,2,z,3,'#5a6a78');faceRect(g,[x,y-3],1,1,2,z,3,'#4a5866');}
        box(g,[x,y-28],3,3,7,'#f6f2e8','#ccc4ae',null);
        faceRect(g,[x,y-28],-1,1,4,2,3,'#3e5264');faceRect(g,[x,y-28],1,1,4,2,3,'#34465a');
        faceRect(ng,[x,y-28],-1,1,4,2,3,'#ffe6a8');faceRect(ng,[x,y-28],1,1,4,2,3,'#f8d890');
        pyramid(g,[x,y-34],4,7,'#4e8a64','#356448','#7ab890');P(g,x,y-50,1,5,'#5a5a62');P(g,x+1,y-50,4,2,'#e05252');
      },OL);
      layer(base,g=>{
        {const p=G(40,15);P(g,p[0]-6,p[1]-1,12,4,'#e05a5a');for(let k=0;k<12;k+=2)P(g,p[0]-6+k,p[1]-1+(k%4?0:2),2,2,'#f4f0e6');person(g,p[0]+8,p[1]+2,'#5a8ad0');}
        {const p=G(29,39);bench3(g,p[0]-3,p[1]);}{const p=G(40,26);bench3(g,p[0]-3,p[1]);}
        for(const q of [[45,40],[31,33],[40,21]]){const p=G(q[0],q[1]);lamp3(g,ng,base.g,p[0]+3,p[1]);}
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k112',e);}

  // 沿 i 軸的筒形拱頂：由後往前（i 遞增）逐條畫剖面弧，前方自然蓋住後方；colAt(φ) φ∈[0,π]，0＝後簷、π＝前簷
  function vaultI(g,G,i0,i1,j0,j1,H,rise,colAt,ribEvery,ribCol){const jc=(j0+j1)/2,hr=(j1-j0)/2,z=j=>H+rise*Math.sqrt(Math.max(0,1-((j-jc)/hr)**2));
    for(let i=i0;i<=i1+1e-6;i+=.5){const rib=ribEvery&&Math.abs(((i-i0)/ribEvery)-R((i-i0)/ribEvery))<.01;
      for(let f=0;f<=Math.PI+1e-6;f+=.015){const j=jc-hr*Math.cos(f),p=G(i,j,H+rise*Math.sin(f));P(g,Math.floor(p[0]),Math.floor(p[1]),1,1,rib?ribCol:colAt(f));}}
    return z;}
  function gableI(g,G,i1,j0,j1,H,rise,col,mull){const jc=(j0+j1)/2,hr=(j1-j0)/2;
    for(let f=0;f<=Math.PI+1e-6;f+=.01){const j=jc-hr*Math.cos(f),t=G(i1,j,H+rise*Math.sin(f)),b=G(i1,j,H);const x=Math.floor(t[0]);
      P(g,x,Math.floor(t[1]),1,Math.floor(b[1])-Math.floor(t[1])+1,mull&&(R(j*2)%4===0)?mull:col);}}
  const mast3=(g,ng,sh,x,y,h)=>{P(sh,x-1,y,6,2,'rgba(0,0,0,.22)');P(g,x,y-h,2,h,'#8a929c');P(g,x,y-h,1,h,'#b4bcc4');
    P(g,x-4,y-h-7,10,7,'#3a3e46');for(let r=0;r<2;r++)for(let c=0;c<4;c++){P(g,x-3+c*2,y-h-6+r*3,1,2,'#f4f6ee');P(ng,x-3+c*2,y-h-6+r*3,1,2,'#fffbe0');}
    P(ng,x-6,y-h-9,14,11,'rgba(255,250,210,.16)');};

  /* ======================== k56 體育園區 ======================== */
  try{(function(){const K=56,OL=[26,30,44];
    const stad=(ci,cj,hl,r,n)=>{n=n||14;const o=[];for(let k=0;k<=n;k++){const a=-Math.PI/2+k/n*Math.PI;o.push([ci+hl+r*Math.cos(a),cj+r*Math.sin(a)]);}
      for(let k=0;k<=n;k++){const a=Math.PI/2+k/n*Math.PI;o.push([ci-hl+r*Math.cos(a),cj+r*Math.sin(a)]);}return o;};
    const outlineS=(g,pts,c)=>{for(let k=0;k<pts.length;k++){const a=pts[k],b=pts[(k+1)%pts.length];line(g,a[0],a[1],b[0],b[1],c);}};
    const board=(g,ng,G,i,j0,j1)=>{for(const j of [j0+1,j1-1]){const p=G(i,j);P(g,p[0],p[1]-7,1,7,'#5a5a62');}
      const S=G(i,j1,7);box(g,S,1,j1-j0,12,'#3e4a42','#26302a','#56625a',{noAO:1});
      for(let d=2;d<2*(j1-j0)-1;d+=3){faceRect(g,S,1,d,2,6,2,'#f0c040');faceRect(ng,S,1,d,2,6,2,'#ffd860');}faceRect(g,S,1,2,2*(j1-j0)-4,2,2,'#c84a3a');faceRect(ng,S,1,2,2*(j1-j0)-4,2,2,'#ff7a5a');};
    /* v1：田徑競技場——紅色跑道（分道線）環繞條紋足球場＋後側三階看台與懸臂頂棚＋西端記分板＋三座泛光燈塔 */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#88b060','#74984e','#9cc474',561);
      const TC=[25,29],HLN=9;
      layer(base,g=>{
        fillPoly(g,scr(G,stad(TC[0],TC[1],HLN,13.3)),'#e8e2d0');
        fillPoly(g,scr(G,stad(TC[0],TC[1],HLN,12.6)),'#c65a40');
        for(const r of [9.4,10.5,11.6])outlineS(g,scr(G,stad(TC[0],TC[1],HLN,r)),'#d8826a');
        fillPoly(g,scr(G,stad(TC[0],TC[1],HLN,8.4)),'#ece6d4');
        fillPoly(g,scr(G,stad(TC[0],TC[1],HLN,7.8)),'#6aa84a');
        for(let k=0;k<8;k++){if(k%2)continue;const a=TC[0]-11+k*2.75;quad(g,G,Math.max(a,TC[0]-11),TC[1]-6.5,Math.min(a+2.75,TC[0]+11),TC[1]+6.5,'#78b656');}
        outlineS(g,scr(G,[[TC[0]-11,TC[1]-6.5],[TC[0]+11,TC[1]-6.5],[TC[0]+11,TC[1]+6.5],[TC[0]-11,TC[1]+6.5]]),'#f4f4ec');
        ln(g,G(TC[0],TC[1]-6.5),G(TC[0],TC[1]+6.5),'#f4f4ec');outlineS(g,scr(G,ringIJ(TC[0],TC[1],2.4,16)),'#f4f4ec');
        for(const i of [TC[0]-11,TC[0]+11]){const a=G(i,TC[1]-1.3),b=G(i,TC[1]+1.3);P(g,a[0],a[1]-4,1,4,'#fafaf4');P(g,b[0],b[1]-4,1,4,'#fafaf4');line(g,a[0],a[1]-4,b[0],b[1]-4,'#fafaf4');}
        ln(g,G(TC[0]+3,TC[1]+8.4),G(TC[0]+3,TC[1]+12.6),'#fafaf4');
      },OL);
      layer(base,g=>{ // 看台（後側）
        box(g,G(37,7),24,2,17,'#c8ccd2','#9aa0a8','#b0b6be');
        box(g,G(37,9),24,2,12,'#dcdfe4','#a4aab2','#3a70b8');
        box(g,G(37,11),24,2,8,'#dcdfe4','#a4aab2','#4a84cc');
        box(g,G(37,13),24,2,4,'#dcdfe4','#a4aab2','#3a70b8');
        for(let n=0;n<40;n++){const i=13.5+HL(56,n,1)*23,t=HL(56,n,2),j=t<.33?8:t<.66?10:12,z=j===8?12:j===10?8:4;const p=G(i,j,z);P(g,R(p[0]),R(p[1])-1,1,1,['#f0c040','#e05a5a','#f4f4f4','#7be08a'][n%4]);}
        for(const i of [14,25,36]){const p=G(i,5.5,17);P(g,p[0],p[1]-6,1,6,'#6a7078');}
        poly(g,[G(13,3.5,25),G(37,3.5,25),G(37,10,21),G(13,10,21)],'#eef2f4');
        line(g,G(13,10,21)[0],G(13,10,21)[1]+1,G(37,10,21)[0],G(37,10,21)[1]+1,'#7a8088');
        {const a=G(37,3.5,25),b=G(37,10,21);line(g,a[0],a[1]+1,b[0],b[1]+1,'#9aa0a8');}
      },OL);
      layer(base,g=>{board(g,ng,G,5,25,31);},OL);
      layer(base,g=>{
        for(const q of [[31,TC[1]+10.5,'#e05a5a'],[21,TC[1]+11.2,'#4a78c8'],[18,TC[1]-10.8,'#f0c040']]){const p=G(q[0],q[1]);person(g,R(p[0]),R(p[1]),q[2]);}
        for(const t of [[46,19,4],[45,33,4],[34,45.5,4],[20,45.5,4]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEA,base.g);}
      },OL);
      layer(base,g=>{const a=G(3,3),b=G(4,44),c=G(44,4);mast3(g,ng,base.g,a[0],a[1],54);mast3(g,ng,base.g,b[0],b[1],46);mast3(g,ng,base.g,c[0],c[1],46);},OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：棒球場＋拱頂體育館——扇形外野（圍牆）＋紅土內野＋本壘後擋網＋兩側休息區＋右後筒拱屋頂室內館（高側窗）＋左後記分板＋泛光燈塔 */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#88b060','#74984e','#9cc474',562);
      const H=[42.5,42.5];
      const fan=(r,n)=>{const o=[[H[0],H[1]]];for(let k=0;k<=n;k++){const a=Math.PI+k/n*Math.PI/2;o.push([H[0]+r*Math.cos(a),H[1]+r*Math.sin(a)]);}return o;};
      layer(base,g=>{
        fillPoly(g,scr(G,fan(28,24)),'#78b654');fillPoly(g,scr(G,fan(24,22)),'#84c060');fillPoly(g,scr(G,fan(20,20)),'#78b654');
        fillPoly(g,scr(G,fan(15.5,18)),'#c89868');
        quad(g,G,33.6,33.6,41.4,41.4,'#80be5c');
        fillPoly(g,scr(G,ringIJ(H[0],H[1],2.2,16)),'#c89868');fillPoly(g,scr(G,ringIJ(37.5,37.5,1.4,12)),'#c08a5a');
        {const p=G(37.5,37.5);P(g,p[0]-1,p[1],2,1,'#fafaf4');}
        ln(g,G(H[0],H[1]),G(42.5,14.6),'#fafaf4');ln(g,G(H[0],H[1]),G(14.6,42.5),'#fafaf4');
        for(const b of [[42.5,32.5],[32.5,32.5],[32.5,42.5],[42.5,42.5]]){const p=G(b[0],b[1]);P(g,p[0]-1,p[1]-1,3,2,'#fafaf4');}
        const arc=fan(28.3,24).slice(1);
        for(let k=0;k<arc.length-1;k++){const a=arc[k],b=arc[k+1];poly(g,[G(a[0],a[1],0),G(b[0],b[1],0),G(b[0],b[1],4),G(a[0],a[1],4)],'#2e6a3a');}
        for(let k=0;k<arc.length-1;k++){const a=G(arc[k][0],arc[k][1],4),b=G(arc[k+1][0],arc[k+1][1],4);line(g,a[0],a[1],b[0],b[1],'#e8c040');}
      },OL);
      layer(base,g=>{for(const t of [[15,4,5],[21,2.5,4]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEB,base.g);}},OL);
      layer(base,g=>{ // 拱頂體育館
        const S=G(46,12);box(g,S,22,11,14,'#dcd8d0','#aaa69e',null);
        for(let d=3;d<42;d+=4){faceRect(g,S,-1,d,3,6,5,'#58788e');faceRect(g,S,-1,d,3,10,1,'#8ab0c8');if((d>>2)%2)faceRect(ng,S,-1,d,3,6,5,'#ffe6a8');}
        faceRect(g,S,-1,19,6,0,5,'#3a4450');faceRect(ng,S,-1,19,6,0,5,'rgba(255,220,150,.5)');
        faceRect(g,S,1,3,16,7,4,'#c84a3a');for(let d=5;d<17;d+=3)faceRect(g,S,1,d,2,8,2,'#f4f0e6');
        gableI(g,G,46,1,12,14,10,'#b8c6ce','#8a98a2');
        vaultI(g,G,24,46,1,12,14,10,f=>f<1.1?'#8a98a4':f<1.9?'#dfe6ea':f<2.6?'#c8d2da':'#aebac4',3,'#98a4ae');
        {const a=G(24,6.5,24),b=G(46,6.5,24);line(g,a[0],a[1],b[0],b[1],'#f2f6f8');}
      },OL);
      layer(base,g=>{board(g,ng,G,10,14,22);},OL);
      layer(base,g=>{ // 休息區＋球員
        box(g,G(47,37),2,7,5,'#d8d4cc','#a8a49c','#3a6aa8');faceRect(g,G(47,37),-1,1,2,0,3,'#2a2e36');
        box(g,G(37,47),7,2,5,'#d8d4cc','#a8a49c','#3a6aa8');faceRect(g,G(37,47),1,1,2,0,3,'#2a2e36');
        for(const q of [[37.5,37.5,'#3a5aa8'],[42,32,'#3a5aa8'],[33,33,'#3a5aa8'],[24,24,'#3a5aa8'],[30,19,'#3a5aa8'],[43.5,43.5,'#c84a3a']]){const p=G(q[0],q[1]);person(g,R(p[0]),R(p[1]),q[2],'#6a6a7a');}
        for(const t of [[6,34,5],[9,43,4]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEB,base.g);}
      },OL);
      layer(base,g=>{ // 本壘後擋網
        const pts=[];for(let k=0;k<=10;k++){const a=-Math.PI/8+k/10*(3*Math.PI/4);pts.push([H[0]+4.3*Math.cos(a),H[1]+4.3*Math.sin(a)]);}
        for(let k=0;k<pts.length-1;k++){const a=G(pts[k][0],pts[k][1]),b=G(pts[k+1][0],pts[k+1][1]);const n=Math.abs(R(b[0])-R(a[0]));
          for(let s=0;s<=n;s++){const t=n?s/n:0,x=R(a[0]+(b[0]-a[0])*t),y=R(a[1]+(b[1]-a[1])*t);if(s%3===0)P(g,x,y-11,1,11,'rgba(110,120,130,.35)');P(g,x,y-11,1,1,'#7a828c');}}
        for(const k of [0,5,10]){const p=G(pts[k][0],pts[k][1]);P(g,p[0],p[1]-12,1,12,'#4a525c');}
      },OL);
      layer(base,g=>{const a=G(4,4),b=G(4,44);mast3(g,ng,base.g,a[0],a[1],54);mast3(g,ng,base.g,b[0],b[1],46);},OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k56',e);}

  /* ======================== k47 植物園 ======================== */
  // v0 在執行期是一根窄玻璃柱溫室（素材極簡），兩個變體都 redraw 成完整的 3×3 植物園
  try{(function(){const K=47,OL=[26,30,44];
    const lamp3=(g,ng,sh,x,y)=>{P(sh,x,y,4,1,'rgba(0,0,0,.2)');P(g,x,y-13,1,13,'#3e4450');P(g,x-1,y-16,3,3,'#f2e2a0');P(g,x-1,y-17,3,1,'#2e2e36');
      P(ng,x-1,y-16,3,3,'#ffe9a8');P(ng,x-3,y-18,7,7,'rgba(255,225,150,.2)');};
    const topiary=(g,x,y)=>{P(g,x-1,y-1,3,1,'rgba(0,0,0,.2)');cone(g,x,y-9,y-1,3,1,(dx,u)=>u<-.3?'#5e9e4c':u<.3?'#447e3a':'#30602c');};
    const palm=(g,x,y,h)=>{for(let t=0;t<h;t++){const xx=x+R(Math.sin(t/h*1.6)*2);P(g,xx,y-t,2,1,t%3?'#9a7a52':'#7a5a38');}
      const tx=x+R(Math.sin(1.6)*2)+1,ty=y-h;for(const f of [[-8,3],[-6,-2],[-3,-5],[3,-5],[7,-2],[9,3],[-4,5],[5,5]]){line(g,tx,ty,tx+f[0],ty+f[1],f[0]<0?'#6ab458':'#3e8a40');}P(g,tx-1,ty-1,3,2,'#8ac860');};
    /* v1：維多利亞棕櫚溫室——後側長筒拱玻璃溫室（白鐵骨架）＋中央玻璃穹頂與燈亭＋前門廊＋前方四畦幾何花壇（修剪錐樹／中央噴泉）＋棕櫚 */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#7a9a5a','#68884a','#8cac6a',471);
      quad(base.g,G,12,21,42,45.5,'#dcd2b6');quad(base.g,G,23,17,27,21,'#dcd2b6');quad(base.g,G,42,32.8,48,35.2,'#dcd2b6');quad(base.g,G,25.8,45.5,28.2,48,'#dcd2b6');
      layer(base,g=>{for(const t of [[46,4,6]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEA,base.g);}},OL);
      layer(base,g=>{ // 溫室本體
        const S=G(42,17);box(g,S,36,11,12,'#a8d4cc','#80b4b2',null);
        faceRect(g,S,-1,0,72,2,4,'#5e9e62');faceRect(g,S,1,0,22,2,4,'#4a8850');
        for(let d=3;d<72;d+=6)faceRect(g,S,-1,d,2,6,3,'#4e8e56');
        band(g,S,-1,0,72,0,2,'#e8e0cc');band(g,S,1,0,22,0,2,'#c4bca8');
        for(let d=0;d<72;d+=3)faceRect(g,S,-1,d,1,2,10,'#f2f8f4');for(let d=0;d<22;d+=3)faceRect(g,S,1,d,1,2,10,'#d4e2de');
        band(g,S,-1,0,72,7,1,'#f2f8f4');band(g,S,1,0,22,7,1,'#d4e2de');band(g,S,-1,0,72,11,1,'#fafcfa');band(g,S,1,0,22,11,1,'#e4ecea');
        faceRect(nt.g,S,-1,0,72,8,3,'rgba(190,255,220,.26)');faceRect(nt.g,S,1,0,22,8,3,'rgba(170,235,210,.2)');
        gableI(g,G,42,6,17,12,10,'#94c4c6','#d4e2de');
        vaultI(g,G,6,42,6,17,12,10,f=>f<1.2?'#8ab8c0':f<1.95?'#e2f2f2':f<2.55?'#c6e6e6':'#a8d2d4',3,'#f4faf8');
        const c=G(24,11.5,22),cx=R(c[0]),cy=R(c[1]);
        cyl(g,cx,cy+1,14,7,5,['#d8eeee','#b8dcdc','#98c4c8','#7eacb2'],null);
        for(let dx=-14;dx<=14;dx+=4)P(g,cx+dx,cy-4+eh(14,7,dx),1,6,'#f4faf8');
        dome(g,cx,cy-4,14,7,18,['#f0fafa','#cce8ea','#a4d0d4','#80b2b8']);
        for(const lon of [-60,-30,0,30,60])for(let lat=0;lat<=84;lat+=2){const la=lat*Math.PI/180,lo=lon*Math.PI/180;P(g,R(cx+14*Math.cos(la)*Math.sin(lo)),R(cy-4+7*Math.cos(la)*Math.cos(lo)-18*Math.sin(la)),1,1,lon<=0?'#fafdfc':'#c8dcdc');}
        for(const lat of [30,58])for(let lon=-88;lon<=88;lon+=3){const la=lat*Math.PI/180,lo=lon*Math.PI/180;P(g,R(cx+14*Math.cos(la)*Math.sin(lo)),R(cy-4+7*Math.cos(la)*Math.cos(lo)-18*Math.sin(la)),1,1,lon<=0?'#fafdfc':'#c8dcdc');}
        cyl(g,cx,cy-21,3,1,4,['#f4f8f6','#d0dcda','#a8b8b8'],'#e8f0ee');P(g,cx,cy-28,1,3,'#8a9aa0');
        dome(nt.g,cx,cy-4,13,6,17,['rgba(210,252,255,.3)','rgba(200,250,255,.24)','rgba(190,240,250,.18)','rgba(170,230,240,.14)']);
        const Pp=G(26,20);const ty=box(g,Pp,4,3,10,'#b8e0da','#8cbcba',null);faceRect(g,Pp,-1,2,4,0,7,'#3e5a58');band(g,Pp,-1,0,8,9,1,'#f4faf8');
        hipRoof(g,[Pp[0],ty],4,3,4,'#e4f4f4','#a8ccd0','#f4fbfb');
        faceRect(nt.g,Pp,-1,2,4,0,7,'rgba(255,230,170,.55)');
      },OL);
      layer(base,g=>{ // 花壇
        const beds=[[13,22,26,33,'#e07aa0'],[28,22,41,33,'#e8c040'],[13,35,26,44.5,'#9a70d0'],[28,35,41,44.5,'#d85050']];
        for(const b of beds){quad(g,G,b[0],b[1],b[2],b[3],'#4e8a40');quad(g,G,b[0]+.8,b[1]+.8,b[2]-.8,b[3]-.8,'#6aa850');
          for(let i=b[0]+1.6;i<b[2]-1.6;i+=2.4)quad(g,G,i,b[1]+1.6,i+1.1,b[3]-1.6,b[4]);}
        fillPoly(g,scr(G,ringIJ(27,34,3.4,24)),'#e4dcc8');fillPoly(g,scr(G,ringIJ(27,34,2.7,24)),'#4f9fc4');fillPoly(g,scr(G,ringIJ(26.6,33.6,1.6,16)),'#6ab8d8');
      },OL);
      layer(base,g=>{
        const c=G(27,34);P(g,c[0]-1,c[1]-4,3,4,'#e4dcc8');P(g,c[0],c[1]-11,1,7,'#e6f6fc');P(g,c[0]-2,c[1]-9,1,4,'#b4e2f4');P(g,c[0]+2,c[1]-9,1,4,'#b4e2f4');
        for(const q of [[12.6,21.6],[41.4,21.6],[12.6,45],[41.4,45],[26,22.6],[28,22.6]]){const p=G(q[0],q[1]);topiary(g,p[0],p[1]);}
        palm(g,G(8,20)[0],G(8,20)[1],15);palm(g,G(44,19)[0],G(44,19)[1],14);
        for(const t of [[4,27,7],[3,38,6],[8,45,5],[46,24,5]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEB,base.g);}
        for(const q of [[43,31],[24,46.5]]){const p=G(q[0],q[1]);lamp3(g,ng,base.g,p[0],p[1]);}
        person(g,G(33,34)[0],G(33,34)[1],'#d86a6a');person(g,G(20,34.2)[0],G(20,34.2)[1],'#5a8ad0');
      },OL);
      put(K,1,base,nt,ax,ay);}
    /* v2：生態穹頂——兩座相交的網格球頂溫室（三角格玻璃）＋木構綠屋頂遊客中心＋右前睡蓮池與折線木棧道＋左前三階梯田花台 */
    {const {ax,ay,G,base,nt}=setup(208,220,104,218,3);const ng=nt.g;
      plate(base.g,ax,ay,3,'#7a9a5a','#68884a','#8cac6a',472);
      const geo=(g,ng,cx,cy,rx,ry,hd)=>{const W=2*rx+1,ids=new Int32Array(W*(ry+hd+3)).fill(-1),Y0=cy-hd-1;
        for(let dx=-rx;dx<=rx;dx++){const X=dx/(rx+.5),m=Math.sqrt(Math.max(0,1-X*X));const top=R(cy-hd*m),bot=R(cy+ry*m);
          for(let y=top;y<=bot;y++){const q=y-cy;let lo=0,hi=m;for(let it=0;it<14;it++){const Z=(lo+hi)/2,v=ry*Math.sqrt(Math.max(0,m*m-Z*Z))-hd*Z;if(v>q)lo=Z;else hi=Z;}
            const Z=(lo+hi)/2,Y=Math.sqrt(Math.max(0,m*m-Z*Z)),lat=Math.asin(Math.min(1,Z))/(Math.PI/2)*5,lon=(Math.atan2(X,Y)/Math.PI+.5)*9;
            const band=Math.floor(lat),off=(band%2)*.5,cell=Math.floor(lon+off),fl=lat-band,fm=lon+off-cell,tri=(band*40+cell)*2+(fl>fm?1:0);
            ids[(dx+rx)+(y-Y0)*W]=tri;
            const b=-.62*X+.3*Y+.72*Z;let c;
            if(Z<.2)c=b>.35?'#9cd49a':b>.05?'#7aba7a':b>-.25?'#5c9c62':'#467e4e';else c=b>.72?'#eef8f6':b>.42?'#cfe8e6':b>.12?'#a8d0d2':'#80aab2';
            P(g,cx+dx,y,1,1,c);if(Z>=.2)P(ng,cx+dx,y,1,1,'rgba(170,240,210,.16)');}}
        for(let dx=-rx;dx<=rx;dx++)for(let y=Y0;y<cy+ry+2;y++){const k=(dx+rx)+(y-Y0)*W;if(ids[k]<0)continue;
          const up=y>Y0?ids[k-W]:-1,lf=dx>-rx?ids[k-1]:-1;if((up>=0&&up!==ids[k])||(lf>=0&&lf!==ids[k]))P(g,cx+dx,y,1,1,dx<rx*.25?'#f6fbfa':'#6e929a');}};
      layer(base,g=>{for(const t of [[44,4,6],[4,30,6]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEA,base.g);}},OL);
      layer(base,g=>{
        const A=G(14,16),Bc=G(31,8.5);
        cyl(g,R(A[0]),R(A[1]),31,15,3,['#d8d2c4','#c4bcac','#aaa292','#948c7c'],null);
        geo(g,ng,R(A[0]),R(A[1])-3,31,15,30);
        cyl(g,R(Bc[0]),R(Bc[1]),22,11,3,['#d8d2c4','#c4bcac','#aaa292','#948c7c'],null);
        geo(g,ng,R(Bc[0]),R(Bc[1])-3,22,11,22);
      },OL);
      layer(base,g=>{ // 遊客中心
        const S=G(35,25.5);const ty=box(g,S,14,5,8,'#c49a6a','#94704a',null);
        for(let d=2;d<27;d+=4)faceRect(g,S,-1,d,3,2,4,'#3e5a64');faceRect(g,S,-1,12,4,0,6,'#2e3e46');
        for(let d=2;d<27;d+=4)faceRect(ng,S,-1,d,3,2,4,'#ffe2a0');
        faceRect(g,S,1,1,8,2,4,'#3e5a64');
        topFace(g,[S[0],ty],14,5,'#78a858','#5a8a44','#9cc878');
        for(let n=0;n<10;n++){const p=G(22+n*1.3,21+HL(47,n,3)*3.5,8);P(g,R(p[0]),R(p[1])-1,2,1,n%3?'#5a9a48':'#e8c040');}
      },OL);
      layer(base,g=>{ // 睡蓮池＋木棧道
        const PC=[38.5,34.5],rP=a=>6+1.2*Math.sin(3*a+.4);
        fillPoly(g,scr(G,ringIJ(PC[0],PC[1],a=>rP(a)+.9,48)),'#b8ae8e');fillPoly(g,scr(G,ringIJ(PC[0],PC[1],rP,48)),'#3f86a4');
        fillPoly(g,scr(G,ringIJ(PC[0]-.6,PC[1]-.6,a=>rP(a)-2,40)),'#4f9ab8');
        for(const q of [[35,31],[41,37],[37,38],[42,31.5],[34,36]]){const p=G(q[0],q[1]);ell(g,p[0],p[1],3,1,'#5a9a48');P(g,p[0]-1,p[1]-1,2,1,'#f0a0c0');}
        const bw=[[30,41],[35,36],[40,40],[45,35.5]];pathIJ(g,G,bw,1.3,'#c49a66');
        for(let k=0;k<bw.length-1;k++)for(let t=.1;t<1;t+=.2){const p=G(bw[k][0]+(bw[k+1][0]-bw[k][0])*t,bw[k][1]+(bw[k+1][1]-bw[k][1])*t);P(g,R(p[0])-1,R(p[1]),3,1,'#8e6a42');}
      },OL);
      layer(base,g=>{ // 梯田花台
        const tiers=[[30,35,6,'#9a7ad0'],[35,40,4,'#e8c040'],[40,45,2,'#e07aa0']];
        for(const t of tiers){const S=G(20,t[1]);const ty=box(g,S,12,t[1]-t[0],t[2],'#cfc3aa','#a0947c','#6aa850');
          for(let i=9;i<20;i+=2.2)quad(g,G,i,t[0]+.8,i+1,t[1]-.8,t[3],t[2]);}
        pathIJ(g,G,[[46,46.5],[36,45],[27,42],[25.5,33],[27,26.5]],1.8,'#dcd2b6');
      },OL);
      layer(base,g=>{
        for(const t of [[46,17,5],[22,46,5]]){const p=G(t[0],t[1]);tree(g,p[0],p[1],t[2],TREEB,base.g);}
        for(const q of [[29,44],[27,30]]){const p=G(q[0],q[1]);lamp3(g,ng,base.g,p[0],p[1]);}
        person(g,G(27,37)[0],G(27,37)[1],'#d86a6a');person(g,G(36.5,37)[0],G(36.5,37)[1]-1,'#5a8ad0');
      },OL);
      put(K,2,base,nt,ax,ay);}
  })();}catch(e){console.error('v574 k47',e);}

  /*__NEXT__*/
});
