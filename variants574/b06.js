(window.__variants574=window.__variants574||[]).push(function b06(A){
  const SPR=A.SPR(), B=SPR.bld;
  const shade=A.shade, HL=A.hashLocal479, R=Math.round;
  const OUT=[26,30,44];
  const err=[];

  /* ---------- 像素基元（全整數、零共用亂數） ---------- */
  const mk=(w,h)=>{const r=A.cv(w,h);return {c:r[0],g:r[1]};};
  const P=(g,x,y,w,h,c)=>{w=R(w);h=R(h);if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(R(x),R(y),w,h);};
  const G2=(N,i,j)=>[N[0]+2*i-2*j,N[1]+i+j];                       // 地面座標 → 畫布（i 往右下、j 往左下）
  const eh=(rx,ry,dx)=>R(ry*Math.sqrt(Math.max(0,1-(dx*dx)/((rx+.5)*(rx+.5)))));
  function line(g,x0,y0,x1,y1,c){x0=R(x0);y0=R(y0);x1=R(x1);y1=R(y1);
    const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;g.fillStyle=c;
    for(let n=0;n<400;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx;}if(e2<dx){e+=dx;y0+=sy;}}}
  function ell(g,cx,cy,rx,ry,c){g.fillStyle=c;
    for(let dy=-ry;dy<=ry;dy++){const t=Math.max(0,Math.abs(dy)-.4)/(ry+.1);const w=R(rx*Math.sqrt(Math.max(0,1-t*t)));g.fillRect(cx-w,cy+dy,2*w+1,1);}}
  function poly(g,pts,c){ // 凸多邊形整數光柵化（像素中心取樣，無抗鋸齒）
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    g.fillStyle=c;const n=pts.length;let area=0;for(let k=0;k<n;k++){const a=pts[k],b=pts[(k+1)%n];area+=a[0]*b[1]-b[0]*a[1];}const s=area>0?1:-1;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){const px=x+.5,py=y+.5;let ok=true;
      for(let k=0;k<n&&ok;k++){const a=pts[k],b=pts[(k+1)%n];if(s*((b[0]-a[0])*(py-a[1])-(b[1]-a[1])*(px-a[0]))<-.01)ok=false;}
      if(ok)g.fillRect(x,y,1,1);}}
  // 長方體：S=南角地面點，lenL=左面長（單位，i 向）、lenR=右面長（j 向），h=牆高
  function rbox(g,S,lenL,lenR,h,cL,cR,cT,o){o=o||{};const sx=S[0],sy=S[1];
    for(let dx=1;dx<=2*lenL;dx++){const yF=sy-(dx>>1);P(g,sx-dx,yF-h,1,h,cL);if(!o.noAO)P(g,sx-dx,yF-3,1,3,'rgba(0,0,0,.13)');}
    for(let dx=0;dx<2*lenR;dx++){const yF=sy-((dx+1)>>1);P(g,sx+dx,yF-h,1,h,cR);if(!o.noAO)P(g,sx+dx,yF-3,1,3,'rgba(0,0,0,.13)');}
    P(g,sx,sy-h,1,h,'rgba(0,0,0,.22)');
    if(cT)roofPara(g,[sx,sy-h],lenL,lenR,cT,o.edgeF||shade(cT,-26),o.edgeB||shade(cT,16));
    return sy-h;}
  function roofPara(g,S,lenL,lenR,c,eF,eB){const sx=S[0],sy=S[1],nx=2*lenR-2*lenL;
    for(let dx=-2*lenL;dx<2*lenR;dx++){
      const yb=dx<0?sy-((-dx)>>1):sy-((dx+1)>>1);
      const yt=dx<nx?sy-lenL-((dx+2*lenL+1)>>1):sy-lenL-lenR+((dx-nx)>>1);
      if(yb-yt<=0)continue;P(g,sx+dx,yt,1,yb-yt,c);
      if(eB)P(g,sx+dx,yt,1,1,eB);if(eF)P(g,sx+dx,yb-1,1,1,eF);}}
  const faceY=(S,d,side)=>side<0?S[1]-(d>>1):S[1]-((d+1)>>1);          // 牆面第 d 欄的地面 y
  // 沿牆水平帶：side -1 左面 / +1 右面；y0=離地高度（帶頂），hh=帶高
  function band(g,S,side,d0,d1,y0,hh,col){for(let d=d0;d<d1;d++){const x=side<0?S[0]-1-d:S[0]+d;P(g,x,faceY(S,side<0?d+1:d,side)-y0,1,hh,col);}}
  // 一排窗：寬 w、高 h、離地 yOff（窗頂）
  function winRow(g,ng,S,side,d0,d1,step,yOff,w,h,kind,glass,trim,lit,seed,p){
    for(let d=d0;d+w<=d1;d+=step){const x=side<0?S[0]-d-w:S[0]+d,dm=d+(w>>1);const y=faceY(S,dm,side)-yOff;
      A.winShape570(g,null,x,y,w,h,kind,glass,lit,trim,false);
      if(ng&&HL(seed,d,side+7)<p){if(kind==='arch'){P(ng,x+1,y-1,w-2,1,lit);}P(ng,x,y,w,h,lit);}}}
  // 直立圓柱：底橢圓中心 (cx,by)，cols 由左到右
  function cyl(g,cx,by,rx,ry,h,cols,top,ng,ncol){const n=cols.length;
    for(let dx=-rx;dx<=rx;dx++){const e=eh(rx,ry,dx),k=Math.min(n-1,Math.floor((dx+rx)/(2*rx+1)*n));P(g,cx+dx,by-h-e,1,h+2*e+1,cols[k]);
      if(ng&&ncol)P(ng,cx+dx,by-h-e,1,h+2*e+1,ncol);}
    if(top)ell(g,cx,by-h,rx,ry,top);}
  // 穹頂：底橢圓中心 (cx,cy)、高 hd；pal=[亮,中,暗,最暗]；光從左上
  function dome(g,cx,cy,rx,ry,hd,pal,ng,ncol){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),s=Math.sqrt(Math.max(0,1-u*u));const top=cy-R(hd*s),bot=cy+R(ry*s);
      for(let y=top;y<=bot;y++){const t=bot>top?(bot-y)/(bot-top):1;const b=-.62*u+.58*t+.12;
        const col=b>.62?pal[0]:b>.28?pal[1]:b>-.08?pal[2]:pal[3];P(g,cx+dx,y,1,1,col);if(ng&&ncol)P(ng,cx+dx,y,1,1,ncol);}}}
  // 圓錐：頂點 (cx,apY)，底橢圓中心 (cx,by)；colAt(扇區序, 左右 u) 回傳色
  function cone(g,cx,apY,by,rx,ry,colAt){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));const top=R(apY+(by-apY)*Math.abs(u)*.92);
      P(g,cx+dx,top,1,by+e-top+1,colAt(Math.asin(Math.max(-1,Math.min(1,u))),u));}}
  // 地基（plate 的零亂數版：點綴用 hashLocal479）
  function plateH(g,ax,ay,col,sz,seed){const hw=32*sz,ty=ay-hw;A.dia(g,ax,ty,hw,col);
    for(let i=0;i<26*sz;i++){const yy=1+Math.floor(HL(seed,i,5741)*(hw-2));const hr=Math.max(1,(yy<hw/2?(yy+1):(hw-yy))*2-2);
      const xx=ax-hr+Math.floor(HL(seed,i,5742)*hr*2);P(g,xx,ty+yy,1,1,HL(seed,i,5743)<.5?shade(col,-10):shade(col,8));}
    A.diaEdge(g,6,shade(col,-20),ax,ty,hw);A.diaEdge(g,9,shade(col,10),ax,ty,hw);}
  /* ---------- 後製對齊（重畫版補上 T526／T479 同款質感；疊加版只給新部件顆粒與層理） ---------- */
  function texLayer(c,phase){const g=c.getContext('2d'),w=c.width,h=c.height;const im=g.getImageData(0,0,w,h),d=im.data;
    for(let y=0;y<h;y++){const bandRow=(((y-phase)%8)+8)%8===0;for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]<=40)continue;let m=1;
      if((((x>>1)+(y>>1))&3)===0)m*=.955;if(bandRow)m*=.93;if(m!==1){d[i]*=m;d[i+1]*=m;d[i+2]*=m;}}}
    g.putImageData(im,0,0);
    g.save();g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,0,w,h);
    gr.addColorStop(0,'rgba(255,236,194,.075)');gr.addColorStop(.52,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(28,35,43,.10)');g.fillStyle=gr;g.fillRect(0,0,w,h);g.restore();}
  function polishFull(c,ax,ay,k){const g=c.getContext('2d'),w=c.width,h=c.height;const sc=Math.max(.6,Math.min(3,w/72));
    g.fillStyle='rgba(10,14,24,.16)';g.beginPath();g.ellipse(ax+8*sc,ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();
    const im=g.getImageData(0,0,w,h),d=im.data;let topY=-1;
    for(let y=0;y<h;y++){let L=-1,Rr=-1;for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]>40){if(L<0)L=x;Rr=x;}}if(L<0)continue;if(topY<0)topY=y;
      for(let x=L;x<Math.min(L+2,w);x++){const i=(y*w+x)*4;d[i]=Math.min(255,d[i]*1.14+12);d[i+1]=Math.min(255,d[i+1]*1.14+12);d[i+2]=Math.min(255,d[i+2]*1.14+12);}
      const i=(y*w+Rr)*4;d[i]*=.88;d[i+1]*=.88;d[i+2]*=.88;}
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]<=40)continue;if((((x>>1)+(y>>1))&3)===0){d[i]*=.955;d[i+1]*=.955;d[i+2]*=.955;}}
    if(topY>=0)for(let y=h-2;y>topY+8;y-=8)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>40){d[i]*=.93;d[i+1]*=.93;d[i+2]*=.93;}}
    g.putImageData(im,0,0);
    // T479 buildingMaterial 同款（決定性雜湊點綴）
    const seed=479000+k*17+6*13;g.save();g.globalCompositeOperation='source-atop';
    const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,'rgba(255,236,194,.075)');grad.addColorStop(.52,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(28,35,43,.10)');g.fillStyle=grad;g.fillRect(0,0,w,h);
    const cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];const dens=Math.min(360,Math.max(10,Math.floor(w*h/520)));
    for(let i=0;i<dens;i++){const x=Math.floor(HL(seed,i,47901)*w),y=Math.floor(HL(seed,i,47902)*h);g.fillStyle=cols[Math.floor(HL(seed,i,47905)*3)%3];g.fillRect(x,y,HL(seed,i,47903)<.74?1:2,HL(seed,i,47904)<.88?1:2);}
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);tint.addColorStop(0,'rgba(222,213,190,.035)');tint.addColorStop(1,'rgba(43,49,54,.07)');g.fillStyle=tint;g.fillRect(0,0,w,h);
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');g.fillStyle=ao;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();}
  // 疊加版收尾：新部件層 → 顆粒 → 外框 → 貼上；夜圖先挖掉被新部件擋住的舊燈，再貼新燈
  function stamp(base,L,NL,phase){texLayer(L.c,phase);A.outlineSprite(L.c,OUT[0],OUT[1],OUT[2]);base.g.drawImage(L.c,0,0);
    base.ng.save();base.ng.globalCompositeOperation='destination-out';base.ng.drawImage(L.c,0,0);base.ng.restore();if(NL)base.ng.drawImage(NL.c,0,0);}
  function fromV0(s0,pl,pt,pr,pb){const W=s0.w+pl+(pr||0),H=s0.h+pt+(pb||0);const b=mk(W,H),n=mk(W,H);b.g.drawImage(s0.img,pl,pt);if(s0.night)n.g.drawImage(s0.night,pl,pt);
    return {c:b.c,g:b.g,nc:n.c,ng:n.g,W,H,ax:s0.ax+pl,ay:s0.ay+pt};}
  const put=(key,c,nc,ax,ay)=>{B[key]={img:c,night:nc,ax,ay,w:c.width,h:c.height,smoke:[]};};
  const eraseBelow=(g,x0,x1,topFn)=>{for(let x=x0;x<=x1;x++){const t=topFn(x);g.clearRect(x,t,1,4000);}};
  const LIT='#ffe9b8',LITW='#fff2c8';

  /* ======================= k35 博物館 ======================= */
  try{const s0=B['35_1_0'];if(s0){
    // v1 疊加：屋頂換成鼓座＋銅綠大穹頂；右立面（原入口面）加三角楣列柱門廊
    {const b=fromV0(s0,0,0),L=mk(b.W,b.H),NL=mk(b.W,b.H),lg=L.g,nl=NL.g;
     const sx=68,sy=146,hh=29,tR=d=>sy-((d+1)>>1)-hh,bR=d=>sy-((d+1)>>1);
     for(let d=8;d<=34;d++)P(lg,sx+d,tR(d)+3,1,bR(d)-tR(d)-3,'#968c6e');            // 門廊陰影凹室
     for(let d=6;d<=36;d++){P(lg,sx+d,bR(d)-3,1,2,'#dcd2b4');P(lg,sx+d,bR(d)-1,1,1,'#b2a787');} // 台階
     for(const c0 of [10,16,22,28]){for(let q=0;q<3;q++){const d=c0+q;P(lg,sx+d,tR(d)+3,1,bR(d)-3-(tR(d)+3),q===0?'#f4ecd4':q===1?'#e2d8ba':'#b8ae90');}}
     P(lg,sx+19,tR(19)+10,2,bR(19)-3-(tR(19)+10),'#5a3a2e');                         // 門洞
     for(let d=7;d<=35;d++){P(lg,sx+d,tR(d),1,3,'#e8dec2');P(lg,sx+d,tR(d)+3,1,1,'#a4997a');} // 簷楣
     for(let d=7;d<=35;d++){const rise=R(12*(1-Math.abs(d-21)/14));if(rise>0)P(lg,sx+d,tR(d)-rise,1,rise,'#ddd3b4');
       P(lg,sx+d,tR(d)-rise-1,1,1,d<=21?'#f8f2de':'#e6dec4');}
     for(let d=12;d<=30;d++){const rise=R(6*(1-Math.abs(d-21)/9));if(rise>0)P(lg,sx+d,tR(d)-rise-1,1,rise,'#c6ba96');}
     // 鼓座＋穹頂
     const dcx=68,dby=97,drx=17,dry=8,dh=10;
     cyl(lg,dcx,dby,drx,dry,dh,['#f0e6ca','#e4d8b8','#d4c8a4','#c2b590','#b0a37e'],null);
     for(let dx=-drx;dx<=drx;dx++){const e=eh(drx,dry,dx);P(lg,dcx+dx,dby-dh+e,1,1,'#f6eed8');P(lg,dcx+dx,dby-dh+e+1,1,1,'#a89c78');P(lg,dcx+dx,dby+e-1,1,1,'#b4a886');}
     for(const dx of [-13,-7,-1,5,11]){const yb=dby+eh(drx,dry,dx+1);A.winShape570(lg,null,dcx+dx,yb-8,3,5,'arch','#33465a',LIT,'#f2ead0',false);
       if(dx!==5){P(nl,dcx+dx+1,yb-9,1,1,LIT);P(nl,dcx+dx,yb-8,3,5,LIT);}}
     dome(lg,dcx,dby-dh,18,9,19,['#9fd0bc','#74b09a','#52917e','#3c7466']);
     for(const f of [-.55,0,.55]){for(let t=0;t<=1.001;t+=.05){const s=Math.sqrt(1-t*t);const x=dcx+R(18*s*f),y=dby-dh-R(19*t)+R(9*s*Math.sqrt(1-f*f));P(lg,x,y,1,1,f<0?'#b8e0d0':'#3f7a6a');}}
     cyl(lg,dcx,dby-dh-18,3,1,6,['#f0e6ca','#d8cca8','#b0a37e'],null);
     P(lg,dcx-1,dby-dh-22,2,3,'#33465a');P(nl,dcx-1,dby-dh-22,2,3,LITW);
     dome(lg,dcx,dby-dh-24,4,2,4,['#9fd0bc','#74b09a','#52917e','#3c7466']);
     P(lg,dcx,dby-dh-31,1,3,'#e8c050');
     stamp(b,L,NL,(s0.h-2)%8);
     put('35_1_1',b.c,b.nc,b.ax,b.ay);}
    // v2 重畫：L 形雙翼展廳圍出前庭，前庭中央玻璃金字塔入口（低矮、開放；與 v1 的高穹頂相反）
    {const W=136,H=150,ax=68,ay=148,N=[68,84];const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#9a9484',2,3502);
     A.dia(g,68,110,38,'#b4ac94');A.diaEdge(g,9,'#c8c0a8',68,110,38);
     const wl='#ece2c4',wr='#c8ba96',wt='#aca082';
     const neS=G2(N,30,12),nwS=G2(N,12,30),pvS=G2(N,12,12);
     rbox(sg,neS,27,9,23,wl,wr,wt);rbox(sg,nwS,9,18,23,wl,wr,wt);
     for(const [S0,l,r] of [[neS,27,9],[nwS,9,18]]){band(sg,S0,-1,0,2*l,22,2,'#f6eed8');band(sg,S0,1,0,2*r,22,2,'#d6c9a6');band(sg,S0,-1,0,2*l,20,1,'#9c9070');band(sg,S0,1,0,2*r,20,1,'#8c8062');
       band(sg,S0,-1,0,2*l,4,1,'#b8ac88');band(sg,S0,1,0,2*r,4,1,'#9c9070');}
     winRow(sg,ng,neS,-1,5,33,8,16,3,7,'arch','#33465a','#f6eed8',LIT,351,.5);
     winRow(sg,ng,neS,1,6,17,8,16,3,7,'arch','#2a3a4c','#d8ccaa',LIT,352,.5);
     winRow(sg,ng,nwS,1,5,33,8,16,3,7,'arch','#2a3a4c','#d8ccaa',LIT,353,.5);
     winRow(sg,ng,nwS,-1,6,17,8,16,3,7,'arch','#33465a','#f6eed8',LIT,354,.5);
     rbox(sg,pvS,9,9,28,'#f2e8cc','#cdbf9b','#b2a688');
     band(sg,pvS,-1,0,18,28,3,'#faf4e2');band(sg,pvS,1,0,18,28,3,'#dccfae');band(sg,pvS,-1,0,18,25,1,'#c89e48');band(sg,pvS,1,0,18,25,1,'#a8843c');
     P(sg,pvS[0],pvS[1]-28-18-8,1,9,'#6a6a72');P(sg,pvS[0]+1,pvS[1]-28-18-8,5,3,'#c84a48');
     // 玻璃金字塔
     const pS=G2(N,27,27),pW=G2(N,17,27),pE=G2(N,27,17),pc=G2(N,22,22),ap=[pc[0],pc[1]-21];
     for(let d=-21;d<=21;d++){const x=pS[0]+d;P(sg,x,pS[1]-(Math.abs(d)>>1)-1,1,2,'#cfc6aa');}
     poly(sg,[pW,pS,ap],'#9ec6d6');poly(sg,[pS,pE,ap],'#6892a8');
     poly(ng,[pW,pS,ap],'rgba(255,228,160,.20)');poly(ng,[pS,pE,ap],'rgba(255,228,160,.13)');
     for(const f of [1/3,2/3]){line(sg,ap[0],ap[1],pW[0]+(pS[0]-pW[0])*f,pW[1]+(pS[1]-pW[1])*f,'#d8eef4');line(sg,ap[0],ap[1],pS[0]+(pE[0]-pS[0])*f,pS[1]+(pE[1]-pS[1])*f,'#8fb2c4');}
     line(sg,ap[0]+(pW[0]-ap[0])*.5,ap[1]+(pW[1]-ap[1])*.5,ap[0]+(pS[0]-ap[0])*.5,ap[1]+(pS[1]-ap[1])*.5,'#d8eef4');
     line(sg,ap[0]+(pS[0]-ap[0])*.5,ap[1]+(pS[1]-ap[1])*.5,ap[0]+(pE[0]-ap[0])*.5,ap[1]+(pE[1]-ap[1])*.5,'#8fb2c4');
     line(sg,ap[0],ap[1],pS[0],pS[1]-1,'#eef8fa');
     // 旗陣（沿用 v0 語彙）
     for(const [i,j,col] of [[31,19,'#e05252'],[19,31,'#5aa0e8']]){const p=G2(N,i,j);P(sg,p[0],p[1]-16,1,14,'#7a7a82');P(sg,p[0]+1,p[1]-16,4,6,col);P(sg,p[0]-1,p[1]-2,3,1,'#6a6a70');}
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,35);
     put('35_1_2',D.c,NN.c,ax,ay);}
  }}catch(e){err.push('k35:'+e.message);}

  /* ======================= k36 劇院 ======================= */
  try{
    const N=[68,84],ax=68,ay=148,W=136,H=150;
    // v1 重畫：矮觀眾廳＋後方高聳舞台塔（fly tower）＋轉角直立燈泡招牌（左亮右暗，沿用 v0 酒紅＋金簷）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#8a7a6a',2,3601);
     const wl='#a4526c',wr='#7c3c54',wt='#4a2a3a',gold='#d8a840';
     const tS=G2(N,20,20);rbox(sg,tS,12,12,60,'#9a4c66','#723650','#3e2432',{edgeF:gold,edgeB:'#e8c060'});
     band(sg,tS,-1,0,24,57,2,'#c89a3c');band(sg,tS,1,0,24,57,2,'#9c7430');
     for(const d of [3,9,15,21]){band(sg,tS,-1,d,d+2,55,29,'#ac5a78');band(sg,tS,-1,d+2,d+3,55,29,'#86405a');band(sg,tS,1,d,d+2,55,29,'#86405a');band(sg,tS,1,d+2,d+3,55,29,'#5a2a40');}
     const aS=G2(N,31,31);rbox(sg,aS,21,21,23,wl,wr,wt,{edgeF:gold,edgeB:'#e8c060'});
     band(sg,aS,-1,0,42,23,1,'#e0b24a');band(sg,aS,1,0,42,23,1,'#b08634');
     winRow(sg,ng,aS,-1,17,40,8,19,3,6,'arch','#2a1a22','#e0c070','#ffcf7a',361,.7);
     winRow(sg,ng,aS,1,17,40,8,19,3,6,'arch','#241620','#b89448','#ffcf7a',362,.7);
     // 轉角遮篷（包覆南角）＋門＋柱＋海報
     for(const side of [-1,1]){
       band(sg,aS,side,0,15,9,8,'#1f1b1e');
       band(sg,aS,side,0,15,14,4,'#2a2224');band(sg,aS,side,0,15,14,1,gold);
       for(let d=1;d<15;d+=3){const x=side<0?aS[0]-1-d:aS[0]+d;const y=faceY(aS,side<0?d+1:d,side)-12;P(sg,x,y,1,1,'#ffe9a0');P(ng,x,y,1,1,'#fff2c0');}
       const pd=15,px=side<0?aS[0]-1-pd:aS[0]+pd;P(sg,px-(side<0?1:0),faceY(aS,pd,side)-14,2,14,'#e2d2a8');
       const qd=21,qx=side<0?aS[0]-qd-5:aS[0]+qd;P(sg,qx,faceY(aS,qd+2,side)-13,5,8,'#2a2038');P(sg,qx+1,faceY(aS,qd+2,side)-12,3,2,gold);
       for(let d=2;d<13;d+=4){const x=side<0?aS[0]-d-2:aS[0]+d;P(ng,x,faceY(aS,d+1,side)-8,2,6,'rgba(255,207,122,.75)');}
     }
     P(sg,aS[0]-6,aS[1]-3,12,2,'#8a2030');
     // 直立招牌
     // 左立面外挑直立招牌（刀旗式：垂直於牆、伸出屋頂線）
     {const q=(j,h)=>{const p=G2(N,26,j);return [p[0],p[1]-h];};
      poly(sg,[q(31,18),q(34,18),q(34,42),q(31,42)],'#c89a3c');poly(sg,[q(31.5,19.5),q(33.5,19.5),q(33.5,40.5),q(31.5,40.5)],'#a02434');
      poly(ng,[q(31.5,19.5),q(33.5,19.5),q(33.5,40.5),q(31.5,40.5)],'rgba(255,110,110,.45)');
      for(let k=0;k<6;k++){const p=q(32.5,22+k*3.3);P(sg,R(p[0]),R(p[1]),1,2,'#ffe9a0');P(ng,R(p[0]),R(p[1]),1,2,'#fff6d0');}
      const t=q(32.5,42);P(sg,R(t[0]),R(t[1])-3,1,3,'#8a7040');}
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,36);
     put('36_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：歌劇院——後方高觀眾廳頂銅綠穹頂，前方低矮石造拱廊門廳（不同年代與材質）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#9a9484',2,3602);
     const sl='#e8dcbe',sr='#bfb08c',st='#a89c7c';
     const hS=G2(N,20,20);rbox(sg,hS,16,16,35,sl,sr,st);
     band(sg,hS,-1,0,32,35,3,'#f6eedc');band(sg,hS,1,0,32,35,3,'#d2c4a0');band(sg,hS,-1,0,32,32,1,'#c8a048');band(sg,hS,1,0,32,32,1,'#a07e38');
     winRow(sg,ng,hS,-1,11,31,6,29,2,4,'arch','#3a3040','#f6eedc',LIT,363,.6);winRow(sg,ng,hS,1,11,31,6,29,2,4,'arch','#2e2634','#d2c4a0',LIT,364,.6);
     const rc=[hS[0],hS[1]-35-16];
     ell(sg,rc[0],rc[1],22,11,'#c8a048');
     dome(sg,rc[0],rc[1]-2,21,10,21,['#9fd0bc','#74b09a','#52917e','#3c7466']);
     for(const f of [-.6,-.2,.2,.6]){for(let t=0;t<=1.001;t+=.05){const s=Math.sqrt(1-t*t);P(sg,rc[0]+R(21*s*f),rc[1]-2-R(21*t)+R(10*s*Math.sqrt(1-f*f)),1,1,f<0?'#b8e0d0':'#3f7a6a');}}
     cyl(sg,rc[0],rc[1]-23,3,1,5,['#f6eedc','#d8cca8','#b0a37e'],null);P(sg,rc[0],rc[1]-32,1,4,'#e8c050');
     const fS=G2(N,31,31);rbox(sg,fS,19,19,18,'#efe4c8','#c6b894','#b8ac8c');
     band(sg,fS,-1,0,38,18,3,'#faf4e4');band(sg,fS,1,0,38,18,3,'#d8cbaa');
     for(let d=1;d<38;d+=3){P(sg,fS[0]-1-d,faceY(fS,d+1,-1)-15,1,1,'#b0a282');P(sg,fS[0]+d,faceY(fS,d,1)-15,1,1,'#96886a');}
     band(sg,fS,-1,0,38,3,3,'#cfc3a2');band(sg,fS,1,0,38,3,3,'#a89a78');
     for(const side of [-1,1])for(let d=4;d+4<=37;d+=6){const x=side<0?fS[0]-d-4:fS[0]+d,y=faceY(fS,d+2,side)-13;
       A.winShape570(sg,null,x,y,4,9,'arch',side<0?'#4a3428':'#3a2820',LIT,side<0?'#f8f0dc':'#d6c8a4',false);P(ng,x+1,y-1,2,1,'#ffd98a');P(ng,x,y,4,9,'rgba(255,214,138,.9)');}
     for(const side of [-1,1]){const d=2,x=side<0?fS[0]-d-1:fS[0]+d,y=faceY(fS,d,side)-12;P(sg,x,y,1,3,'#3a3a40');P(sg,x,y-2,1,2,'#f0e0a0');P(ng,x,y-2,1,2,'#fff2c0');}
     P(sg,fS[0]-8,fS[1]-3,16,2,'#8a2030');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,36);
     put('36_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k36:'+e.message);}

  /* ======================= k37 水族館 ======================= */
  try{const s0=B['37_1_0'];if(s0){
    const boxTop=x=>{const dx=x<68?68-x:x-67;return x<40||x>95?96+14:96+Math.ceil(dx/2)-1;};
    const glass=['#b4e2ee','#84c4da','#5aa0bc','#3e7c9a'];
    // v1 疊加：館後升起玻璃海洋穹頂（格構＋鯨影），被原館體遮住下半
    {const b=fromV0(s0,0,0),L=mk(b.W,b.H),NL=mk(b.W,b.H),lg=L.g,nl=NL.g;
     const cx=68,cy=104,rx=27,ry=13,hd=35;
     dome(lg,cx,cy,rx,ry,hd,glass,nl,'rgba(120,214,238,.18)');
     const latt=(x,y,c)=>{P(lg,x,y,1,1,c);nl.clearRect(R(x),R(y),1,1);};
     for(const f of [.4,.72]){const r2=Math.sqrt(1-f*f),rr=R(rx*r2);for(let dx=-rr;dx<=rr;dx++){latt(cx+dx,cy-R(hd*f)+eh(rr,R(ry*r2),dx),dx<0?'#e6f6fa':'#8fbccc');}}
     for(const f of [-.7,-.35,0,.35,.7]){for(let t=0;t<=1.001;t+=.025){const s=Math.sqrt(1-t*t);latt(cx+R(rx*s*f),cy-R(hd*t)+R(ry*s*Math.sqrt(1-f*f)),f<0?'#e6f6fa':f>0?'#8fbccc':'#c8e8f0');}}
     cyl(lg,cx,cy-hd+1,3,1,3,['#b0bcc0','#8a9aa0','#6a7a80'],'#c8d4d8');
     eraseBelow(lg,39,96,x=>boxTop(x)-1);eraseBelow(nl,39,96,x=>boxTop(x)-1);
     stamp(b,L,NL,(s0.h-2)%8);
     put('37_1_1',b.c,b.nc,b.ax,b.ay);}
    // v2 疊加：右後方高聳圓柱水槽塔（魚影、氣泡、鋼環）＋左側海獅池（高瘦 vs v1 的寬圓）
    {const b=fromV0(s0,0,0),L=mk(b.W,b.H),NL=mk(b.W,b.H),lg=L.g,nl=NL.g;
     const tx=110,tby=115;
     cyl(lg,tx,tby+1,11,5,5,['#a8b0b0','#949c9c','#80888a','#6c7476'],'#b8c0c0');
     cyl(lg,tx,tby-4,10,5,46,['#8ad0e4','#6cbcd6','#56a8c6','#4292b2','#347c9c','#2a6886'],null,nl,'rgba(120,214,238,.34)');
     for(const hk of [11,23,35]){for(let dx=-10;dx<=10;dx++)P(lg,tx+dx,tby-4-hk+eh(10,5,dx),1,1,dx<0?'#4a7484':'#2e5462');}
     P(lg,tx-6,tby-18,3,2,'#ff9a50');P(lg,tx-7,tby-18,1,1,'#e07830');P(lg,tx+2,tby-30,3,2,'#f0d040');P(lg,tx+5,tby-30,1,1,'#c0a030');
     P(lg,tx-3,tby-40,5,1,'#244a60');P(lg,tx-2,tby-41,3,1,'#244a60');
     for(let k=0;k<4;k++)P(lg,tx+6,tby-14-k*8,1,1,'#e6f6fa');
     ell(lg,tx,tby-50,11,5,'#6a7c84');ell(lg,tx,tby-50,8,3,'#3a4c54');for(let dx=-11;dx<=0;dx++)P(lg,tx+dx,tby-50-eh(11,5,dx),1,1,'#a8bcc4');
     // 海獅池（在館體之後，被館體遮擋）
     const px=28,py=116;ell(lg,px,py,11,5,'#d0d8d4');ell(lg,px,py,9,4,'#4aa8c4');for(let dx=-7;dx<=3;dx++)P(lg,px+dx,py-eh(9,4,dx)+1,1,1,'#8ad0e0');
     P(lg,px-3,py-3,7,3,'#9a9488');P(lg,px-2,py-4,5,1,'#b8b2a4');P(lg,px-1,py-6,4,2,'#4e4c58');P(lg,px+2,py-7,2,1,'#4e4c58');P(lg,px-2,py-5,1,1,'#4e4c58');
     eraseBelow(lg,39,96,x=>boxTop(x)-1);eraseBelow(nl,39,96,x=>boxTop(x)-1);
     stamp(b,L,NL,(s0.h-2)%8);
     put('37_1_2',b.c,b.nc,b.ax,b.ay);}
  }}catch(e){err.push('k37:'+e.message);}

  /* ======================= k40 電影院（1×1） ======================= */
  try{
    const W=72,H=112,ax=36,ay=110,N=[36,78];
    // v1 重畫：高瘦多廳影城——高樓身＋屋頂斜立大看板＋轉角直立燈泡招牌＋包角遮篷
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#9a9484',1,4001);
     const bS=G2(N,15,15);rbox(sg,bS,13,13,44,'#4c4068','#302848','#221c34');
     band(sg,bS,-1,0,26,44,2,'#6a5c8c');band(sg,bS,1,0,26,44,2,'#463a64');
     // 屋頂看板（立在屋頂後緣的薄板，左面＝畫面）
     const rS=[G2(N,14,5)[0],G2(N,14,5)[1]-44];
     rbox(sg,rS,10,1,15,'#2a2436','#1c1828','#3a3448',{noAO:true});
     for(let d=1;d<19;d++){const x=rS[0]-1-d,yb=faceY(rS,d+1,-1);P(sg,x,yb-14,1,6,'#e8704c');P(sg,x,yb-8,1,6,'#3a7ac8');P(ng,x,yb-14,1,12,'rgba(255,200,150,.55)');}
     P(sg,rS[0]-12,faceY(rS,12,-1)-11,3,3,'#ffe070');P(sg,rS[0]-7,faceY(rS,7,-1)-6,2,3,'#1c1828');P(sg,rS[0]-13,faceY(rS,13,-1)-6,2,3,'#1c1828');
     for(const d of [2,17]){const x=rS[0]-1-d;P(sg,x,faceY(rS,d+1,-1)-1,1,2,'#6a6478');}
     // 右面海報燈箱
     for(const d of [8,17]){const x=bS[0]+d,y=faceY(bS,d+2,1)-34;P(sg,x,y,5,9,'#c8a040');P(sg,x+1,y+1,3,7,d===8?'#d85a6a':'#5aa0d0');P(ng,x+1,y+1,3,7,'rgba(255,220,170,.6)');}
     // 包角遮篷＋玻璃門廳
     for(const side of [-1,1]){band(sg,bS,side,0,20,10,9,side<0?'#2c3848':'#222c3a');
       for(let d=1;d<20;d+=3){const x=side<0?bS[0]-1-d:bS[0]+d,y=faceY(bS,side<0?d+1:d,side)-9;P(ng,x,y,2,7,'rgba(255,214,150,.8)');}
       band(sg,bS,side,0,22,14,4,'#1a1a1e');band(sg,bS,side,0,22,14,1,'#e8b23e');
       for(let d=1;d<22;d+=3){const x=side<0?bS[0]-1-d:bS[0]+d,y=faceY(bS,side<0?d+1:d,side)-12;P(sg,x,y,1,1,'#fff2c0');P(ng,x,y,1,1,'#fff6d8');}}
     const bx=bS[0]-2,by0=bS[1]-44+8;
     P(sg,bx,by0,5,26,'#e8b23e');P(sg,bx+1,by0+1,3,24,'#d84048');
     for(let k=0;k<6;k++){P(sg,bx+2,by0+3+k*4,1,2,'#fff2c0');P(ng,bx+2,by0+3+k*4,1,2,'#fff6d8');}
     P(ng,bx+1,by0+1,1,24,'rgba(255,120,120,.5)');
     P(sg,bS[0]-5,bS[1]-2,10,2,'#8a2030');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,40);
     put('40_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：矮胖裝飾藝術（Art Deco）老戲院——寬扁米白廳身＋南角階梯式塔樓招牌＋湖水綠飾帶
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#a09a88',1,4002);
     const bS=G2(N,15,15);rbox(sg,bS,14,14,19,'#ece2c6','#c6b690','#aa9c7e');
     band(sg,bS,-1,0,28,19,2,'#3f8a8a');band(sg,bS,1,0,28,19,2,'#2e6a6c');band(sg,bS,-1,0,28,16,1,'#e0b448');band(sg,bS,1,0,28,16,1,'#b08a38');
     for(const side of [-1,1])for(let d=12;d<27;d+=5){const x=side<0?bS[0]-1-d:bS[0]+d;P(sg,x,faceY(bS,side<0?d+1:d,side)-14,1,9,side<0?'#fff8e8':'#d8caa6');}
     // 塔樓三階
     const t1=[bS[0],bS[1]];rbox(sg,t1,4,4,36,'#f4ead0','#cdbd98','#b4a686');
     const t2=[bS[0],bS[1]-36-2];rbox(sg,t2,3,3,9,'#f4ead0','#cdbd98','#b4a686');
     const t3=[bS[0],t2[1]-9-2];rbox(sg,t3,2,2,8,'#f4ead0','#cdbd98','#b4a686');
     P(sg,bS[0],t3[1]-8-2-10,1,10,'#c8a040');P(sg,bS[0]-1,t3[1]-8-2-3,3,1,'#c8a040');
     band(sg,t1,-1,0,8,36,2,'#3f8a8a');band(sg,t1,1,0,8,36,2,'#2e6a6c');
     // 塔身直立字牌（湖水綠底＋燈點）
     for(let k=0;k<5;k++){const y=bS[1]-33+k*4;P(sg,bS[0]-6,y-3,4,3,'#2e7a7c');P(sg,bS[0]-5,y-2,2,1,'#fff2c0');P(ng,bS[0]-5,y-2,2,1,'#fff6d8');}
     P(ng,bS[0]-6,bS[1]-36,1,20,'rgba(120,230,220,.45)');
     // 圓角遮篷
     for(const side of [-1,1]){band(sg,bS,side,0,17,11,3,'#e0b448');band(sg,bS,side,0,17,8,1,'#8a6a2a');
       for(let d=1;d<17;d+=2){const x=side<0?bS[0]-1-d:bS[0]+d,y=faceY(bS,side<0?d+1:d,side)-10;P(sg,x,y,1,1,'#fff6d0');if(d%4===1)P(ng,x,y,1,1,'#fffae0');}
       band(sg,bS,side,1,15,7,6,side<0?'#3a2a2a':'#2a1e20');
       for(let d=3;d<15;d+=4){const x=side<0?bS[0]-d-2:bS[0]+d;P(ng,x,faceY(bS,d+1,side)-7,2,5,'rgba(255,210,140,.8)');}}
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,40);
     put('40_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k40:'+e.message);}

  /* ======================= k76 摩天輪（1×1） ======================= */
  const circ=(g,cx,cy,r,c,step)=>{const n=Math.max(24,R(r*7));for(let k=0;k<n;k++){const a=k/n*6.2832;P(g,cx+R(Math.cos(a)*r),cy+R(Math.sin(a)*r),1,1,c);}};
  try{
    const W=72,H=124,ax=36,ay=117,N=[36,85];
    // v1 重畫：大型桁架摩天輪——雙環輪圈＋12 輻條＋垂吊彩色車廂＋前後 A 字腳＋登車月台
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#a8a090',1,7601);
     const C=[36,55],r=31;
     line(sg,C[0]+2,C[1]-1,21,107,'#7a7066');line(sg,C[0]+2,C[1]-1,53,107,'#7a7066');
     const pS=G2(N,13,13);rbox(sg,pS,6,6,5,'#d0c2aa','#a8987e','#dccfb8');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);sg.clearRect(0,0,W,H);
     // 輻條與內環不描外框（細線描框會變成粗黑條）
     for(let k=0;k<12;k++){const a=k/12*6.2832;line(g,C[0],C[1],C[0]+Math.cos(a)*(r-3),C[1]+Math.sin(a)*(r-3),'#d6d0c6');}
     circ(g,C[0],C[1],r-3,'#8a857c');circ(g,C[0],C[1],9,'#8a857c');
     for(let k=0;k<24;k++){const a=k/24*6.2832;line(g,C[0]+Math.cos(a)*(r-3),C[1]+Math.sin(a)*(r-3),C[0]+Math.cos(a+.26)*(r-1),C[1]+Math.sin(a+.26)*(r-1),'#b4aea4');}
     circ(sg,C[0],C[1],r,'#f0ece4');circ(sg,C[0],C[1],r-1,'#f0ece4');
     for(let k=0;k<24;k++){const a=k/24*6.2832,x=C[0]+R(Math.cos(a)*(r-2)),y=C[1]+R(Math.sin(a)*(r-2));if(k%2===0){P(sg,x,y,1,1,'#fff0b0');P(ng,x,y,1,1,'#fff6c8');}}
     const cc=['#e05252','#f0a040','#e8d048','#58c470','#48b0d0','#5a78e0','#a070e0','#e070b0'];
     for(let k=0;k<8;k++){const a=k/8*6.2832+.2,x=C[0]+R(Math.cos(a)*r),y=C[1]+R(Math.sin(a)*r);
       P(sg,x,y,1,2,'#6a6a70');P(sg,x-2,y+2,5,1,shade(cc[k],-20));P(sg,x-2,y+3,5,3,cc[k]);P(sg,x-1,y+4,3,1,'#2a3040');P(ng,x-1,y+4,3,1,'#ffe8a8');}
     P(sg,C[0]-2,C[1]-2,4,4,'#5a5650');P(sg,C[0]-1,C[1]-1,2,2,'#c8c0b0');
     line(sg,C[0]-1,C[1]+1,19,109,'#d8d0c4');line(sg,C[0],C[1]+1,20,109,'#9a9084');
     line(sg,C[0]+1,C[1]+1,52,109,'#b8b0a4');line(sg,C[0],C[1]+1,51,109,'#8a8074');
     line(sg,24,96,48,96,'#a8a098');
     for(let k=0;k<3;k++)P(sg,pS[0]+8+k*2,pS[1]-5+k*1-4+k,2,1,'#8a7a62');
     P(sg,pS[0]-10,pS[1]-9,2,1,'#fff0b0');P(ng,pS[0]-10,pS[1]-9,2,1,'#fff6c8');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,76);
     put('76_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：現代觀景輪——較小白色鋼輪＋外掛膠囊艙，立在玻璃售票航廈屋頂上（有量體底座）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#9aa0a4',1,7602);
     const tS=G2(N,15,15),th=15;rbox(sg,tS,12,12,th,'#dfe4e6','#aab2b8','#c8ced2');
     for(const side of [-1,1]){band(sg,tS,side,1,23,12,6,side<0?'#5a8098':'#3e6278');band(sg,tS,side,1,23,6,1,side<0?'#f0f4f6':'#c0c8cc');
       for(let d=2;d<23;d+=4){const x=side<0?tS[0]-1-d-2:tS[0]+d;P(ng,x,faceY(tS,d+1,side)-12,3,5,'rgba(255,244,214,.7)');}}
     band(sg,tS,-1,4,12,5,5,'#2a3848');
     const C=[36,53],r=24,rc=G2(N,8,8);
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);sg.clearRect(0,0,W,H);
     for(let k=0;k<16;k++){const a=k/16*6.2832+.2;line(g,C[0],C[1],C[0]+Math.cos(a)*(r-2),C[1]+Math.sin(a)*(r-2),'#c8ced4');}
     line(sg,rc[0]-9,rc[1]-th,C[0],C[1],'#f4f6f6');line(sg,rc[0]-8,rc[1]-th,C[0]+1,C[1],'#b8c0c6');
     line(sg,rc[0]+9,rc[1]-th,C[0],C[1],'#dfe4e6');line(sg,rc[0]+10,rc[1]-th,C[0]+1,C[1],'#a0a8ae');
     circ(sg,C[0],C[1],r,'#f8fafa');circ(sg,C[0],C[1],r-1,'#d0d6da');
     for(let k=0;k<10;k++){const a=k/10*6.2832,x=C[0]+R(Math.cos(a)*(r+2)),y=C[1]+R(Math.sin(a)*(r+2));
       P(sg,x-2,y-1,4,3,'#eef2f4');P(sg,x-1,y-1,2,2,'#5aa8c8');P(sg,x-2,y+1,4,1,'#9aa4aa');P(ng,x-1,y-1,2,2,k%3===0?'#ffd0e8':k%3===1?'#c8f0ff':'#fff0b8');}
     P(sg,C[0]-2,C[1]-2,4,4,'#8a9298');P(sg,C[0]-1,C[1]-1,2,2,'#f0f4f6');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,76);
     put('76_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k76:'+e.message);}

  /* ======================= k80 旋轉木馬（1×1） ======================= */
  function carouselTier(sg,ng,cx,floorY,rx,ry,postTop,cols,seed){ // 立柱＋木馬：先後排再前排
    const posts=[];for(let k=0;k<6;k++){const a=k/6*6.2832+.52;posts.push({x:cx+R(Math.cos(a)*rx),y:floorY+R(Math.sin(a)*ry),s:Math.sin(a),k});}
    const drawPost=p=>{const bob=(p.k%2)?2:0;P(sg,p.x,postTop+(p.y-floorY),1,p.y-postTop-(p.y-floorY),'#e8c860');
      const hy=R((postTop+p.y)/2)+bob-1+(p.y-floorY>>1);P(sg,p.x-2,hy,5,2,cols[p.k%cols.length]);P(sg,p.x+(p.k%2?-3:2),hy-2,2,2,cols[p.k%cols.length]);P(sg,p.x-2,hy+2,1,1,'#5a4030');P(sg,p.x+2,hy+2,1,1,'#5a4030');};
    return {back:()=>posts.filter(p=>p.s<0).forEach(drawPost),front:()=>posts.filter(p=>p.s>=0).forEach(drawPost)};}
  try{
    const W=72,H=112,ax=36,ay=105,N=[36,73];
    // v1 重畫：經典單層木馬——木地台＋紅金裙邊＋6 匹木馬＋紅白條紋圓錐頂篷（頂篷與中柱相連，修掉 v0 浮空頂）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#c4ae94',1,8001);
     cyl(sg,36,92,22,11,3,['#c83a3a','#b83434','#a82e2e','#962828'],'#caa06a');
     for(let dx=-22;dx<=22;dx+=3)P(sg,36+dx,92+eh(22,11,dx)-2,1,1,'#f0c850');
     ell(sg,36,89,19,9,'#b88e58');
     const T=carouselTier(sg,ng,36,89,15,7,62,['#f4f0e8','#e8d8b0','#d8a878','#f4f0e8','#c8c8d0','#f0e0c0'],80);
     T.back();
     cyl(sg,36,89,4,2,27,['#f0d890','#e8c860','#c89a40'],null);for(let y=66;y<86;y+=5){P(sg,33,y,2,3,'#e8f0f4');P(ng,33,y,2,3,'rgba(255,236,190,.8)');}
     T.front();
     cone(sg,36,38,60,24,11,(a,u)=>{const st=Math.floor((a+1.5708)/3.1416*10)%2;const base=st?'#f4efe6':'#d8403c';return u>.35?shade(base,-30):u<-.35?shade(base,8):base;});
     for(let dx=-24;dx<=24;dx++){const e=eh(24,11,dx),x=36+dx,y=60+e;const sc=((dx+24)>>2)%2;P(sg,x,y+1,1,sc?2:3,sc?'#f0c850':'#d8403c');}
     for(let dx=-22;dx<=22;dx+=4){const y=60+eh(24,11,dx)+1;P(sg,36+dx,y,1,1,'#fff6c8');P(ng,36+dx,y,1,1,'#fff8d8');}
     P(sg,36,28,1,10,'#6c5c4c');P(sg,37,28,4,1,'#e04040');P(sg,37,29,3,1,'#e04040');P(sg,37,30,1,1,'#e04040');P(sg,35,37,3,2,'#f0c850');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,80);
     put('80_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：雙層威尼斯木馬——上下兩層馬台＋中層金藍裙邊甲板＋藍白條紋尖頂（更高更瘦）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     plateH(g,ax,ay,'#b8b0a4',1,8002);
     cyl(sg,36,93,21,10,3,['#3a64b8','#3258a8','#2c4e98','#264488'],'#c89a60');
     ell(sg,36,90,18,8,'#b88e58');
     const T1=carouselTier(sg,ng,36,90,14,6,72,['#f4f0e8','#e8c8a0','#c8d8f0','#f4f0e8','#e0d0f0','#f0e0c0'],81);
     T1.back();cyl(sg,36,90,4,2,50,['#f0d890','#e8c860','#c89a40'],null);T1.front();
     cyl(sg,36,72,20,10,4,['#e8c050','#d8b048','#c09a3c','#a88430'],'#b88e58');
     for(let dx=-20;dx<=20;dx+=3){const y=72+eh(20,10,dx)-2;P(sg,36+dx,y,1,1,'#fff6c8');P(ng,36+dx,y,1,1,'#fff8d8');}
     const T2=carouselTier(sg,ng,36,68,11,5,50,['#f4f0e8','#c8d8f0','#e8c8a0'],82);
     T2.back();cyl(sg,36,68,3,1,20,['#f0d890','#e8c860','#c89a40'],null);T2.front();
     cone(sg,36,24,48,20,9,(a,u)=>{const st=Math.floor((a+1.5708)/3.1416*8)%2;const base=st?'#f4efe6':'#3a64b8';return u>.35?shade(base,-30):u<-.35?shade(base,8):base;});
     for(let dx=-20;dx<=20;dx++){const y=48+eh(20,9,dx);P(sg,36+dx,y+1,1,((dx+20)>>2)%2?2:1,'#e8c050');}
     for(let dx=-18;dx<=18;dx+=4){const y=48+eh(20,9,dx)+1;P(ng,36+dx,y,1,1,'#fff8d8');}
     P(sg,36,12,1,12,'#6c5c4c');P(sg,35,21,3,3,'#e8c050');P(sg,37,12,4,1,'#3a64b8');P(sg,37,13,3,1,'#3a64b8');
     A.outlineSprite(S.c,OUT[0],OUT[1],OUT[2]);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,80);
     put('80_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k80:'+e.message);}

  /* ======================= k182 星空露營區（1×1） ======================= */
  function campfire(sg,ng,cx,cy){ell(sg,cx,cy,5,2,'#8a8478');for(let k=0;k<6;k++){const a=k*1.047;P(sg,R(cx+5*Math.cos(a))-1,R(cy+2*Math.sin(a))-1,2,2,'#a49e92');}
    P(sg,cx-2,cy-5,4,5,'#c8562a');P(sg,cx-1,cy-7,2,4,'#e8862e');P(sg,cx-1,cy-4,2,2,'#f2c04a');
    P(ng,cx-2,cy-6,4,6,'rgba(255,140,60,.95)');P(ng,cx-1,cy-7,2,2,'rgba(255,200,110,.9)');}
  try{
    const W=72,H=112,ax=36,ay=110,N=[36,78];
    const grass=g=>{plateH(g,ax,ay,'#79a85c',1,18200);A.diaEdge(g,9,'#8cba6c',ax,78,32);for(let k=0;k<5;k++){const p=G2(N,2+k*3,13-k*2);P(g,p[0],p[1]-2,2,3,'#6d9a52');}};
    // v1 重畫：豪華露營——木平台上的大鐘形帳（圓柱壁＋圓錐頂）＋串燈拉到燈柱＋營火與木凳（低矮寬）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     grass(g);const path=G2(N,12,12);A.dia(g,path[0],path[1]-5,10,'#a8906a');
     const dS=G2(N,10,13);rbox(sg,dS,8,8,2,'#c49c68','#8a6a42','#b08a5a',{noAO:true});
     const tc=G2(N,6,9);const tby=tc[1]-2;
     cyl(sg,tc[0],tby,10,5,9,['#f6f0e0','#ece4d0','#d8ccb0','#c0b496','#aa9e80'],null);
     cone(sg,tc[0],tby-27,tby-9,13,6,(a,u)=>u<-.3?'#faf6ea':u<.25?'#e8dfc8':'#c8bc9e');
     for(let dx=-13;dx<=13;dx++){P(sg,tc[0]+dx,tby-9+eh(13,6,dx),1,1,'#b0a486');P(sg,tc[0]+dx,tby-8+eh(13,6,dx),1,1,'#8a7e64');}
     for(const f of [-.55,0,.55])line(sg,tc[0],tby-26,tc[0]+R(13*f),tby-9+eh(13,6,R(13*f)),'#d4c9ae');
     P(sg,tc[0]-4,tby-7,5,9,'#5a4632');P(sg,tc[0]-3,tby-6,3,7,'#e8a860');P(ng,tc[0]-3,tby-6,3,7,'rgba(255,190,110,.95)');
     P(sg,tc[0],tby-30,1,4,'#7a6a50');
     const pp=G2(N,15,4);P(sg,pp[0],pp[1]-18,1,18,'#6a5238');P(sg,pp[0]-1,pp[1]-19,3,1,'#6a5238');
     const a0=[tc[0],tby-28],a1=[pp[0],pp[1]-18];
     for(let t=0;t<=1.001;t+=1/26){const x=a0[0]+(a1[0]-a0[0])*t,y=a0[1]+(a1[1]-a0[1])*t+10*Math.sin(t*3.1416);P(sg,x,y,1,1,'#5a4a3a');}
     for(let k=1;k<9;k++){const t=k/9,x=a0[0]+(a1[0]-a0[0])*t,y=a0[1]+(a1[1]-a0[1])*t+10*Math.sin(t*3.1416)+1;P(sg,x,y,1,1,k%2?'#ffe08a':'#ff9a7a');P(ng,x,y,1,1,'#fff0b8');}
     const fc=G2(N,13,11);campfire(sg,ng,fc[0],fc[1]);
     P(sg,fc[0]-12,fc[1]-2,6,2,'#8a6840');P(sg,fc[0]+7,fc[1]-3,6,2,'#8a6840');P(sg,fc[0]-12,fc[1],1,1,'#5a4030');P(sg,fc[0]+12,fc[1]-1,1,1,'#5a4030');
     A.outlineSprite(S.c,28,22,16);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,182);
     put('182_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：觀星 A 字木屋——陡峭三角山牆落地＋大三角玻璃窗＋側邊觀星木台與望遠鏡＋小營火（高尖）
    {const D=mk(W,H),NN=mk(W,H),S=mk(W,H),g=D.g,ng=NN.g,sg=S.g;
     grass(g);
     const Lp=G2(N,2,12),Rp=G2(N,10,12),mid=G2(N,6,12),ap=[mid[0],mid[1]-32],apB=[G2(N,6,3)[0],G2(N,6,3)[1]-32],eB=G2(N,10,3);
     poly(sg,[ap,apB,eB,Rp],'#6a4a3a');
     for(let k=1;k<6;k++){const t=k/6;line(sg,ap[0]+(Rp[0]-ap[0])*t,ap[1]+(Rp[1]-ap[1])*t,apB[0]+(eB[0]-apB[0])*t,apB[1]+(eB[1]-apB[1])*t,'#58392c');}
     line(sg,ap[0],ap[1],apB[0],apB[1],'#8a6a54');
     poly(sg,[Lp,Rp,ap],'#c49a68');
     line(sg,Lp[0],Lp[1],ap[0],ap[1],'#e0bc88');line(sg,Rp[0],Rp[1]-1,ap[0],ap[1]+1,'#8a6a42');
     const gw=[[mid[0]-6,mid[1]-6],[mid[0]+5,mid[1]-3],[mid[0],mid[1]-24]];poly(sg,gw,'#34465a');poly(ng,gw,'rgba(255,214,140,.85)');
     line(sg,mid[0],mid[1]-24,mid[0],mid[1]-5,'#a07a4a');line(sg,mid[0]-4,mid[1]-12,mid[0]+3,mid[1]-10,'#a07a4a');
     P(sg,mid[0]-2,mid[1]-6,4,6,'#5a3a24');
     P(sg,apB[0]+6,apB[1]+6,2,6,'#3a3a40');P(sg,apB[0]+5,apB[1]+5,4,1,'#5a5a60');
     const kS=G2(N,15,8);rbox(sg,kS,5,5,3,'#c49c68','#8a6a42','#b08a5a',{noAO:true});
     const tp=[kS[0],kS[1]-10];line(sg,tp[0],tp[1],tp[0]-3,kS[1]-4,'#4a4a50');line(sg,tp[0],tp[1],tp[0]+3,kS[1]-4,'#4a4a50');line(sg,tp[0],tp[1],tp[0],kS[1]-3,'#4a4a50');
     line(sg,tp[0]-3,tp[1]+2,tp[0]+5,tp[1]-6,'#e8e8ee');line(sg,tp[0]-3,tp[1]+3,tp[0]+5,tp[1]-5,'#a0a4b0');P(sg,tp[0]+5,tp[1]-7,2,2,'#e8e8ee');
     const fc=G2(N,14,13);campfire(sg,ng,fc[0],fc[1]);P(sg,fc[0]+7,fc[1]-2,6,2,'#8a6840');
     A.outlineSprite(S.c,28,22,16);g.drawImage(S.c,0,0);polishFull(D.c,ax,ay,182);
     put('182_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k182:'+e.message);}

  /* ---------- 大型園區（3×3／2×2）共用：地面座標、像素小圖、圍欄、分層描邊 ---------- */
  const gp=(N,i,j,h)=>[N[0]+2*i-2*j,N[1]+i+j-(h||0)];
  function spr(g,x,y,rows,pal,flip){for(let r=0;r<rows.length;r++){const s=rows[r];for(let c=0;c<s.length;c++){const ch=s[flip?s.length-1-c:c];if(ch!=='.'&&pal[ch])P(g,x+c,y+r,1,1,pal[ch]);}}}
  function sprB(g,x,y,rows,pal,flip){spr(g,x-(rows[0].length>>1),y-rows.length,rows,pal,flip);} // (x,y)=腳底中心
  function fenceG(g,N,i0,j0,i1,j1,rail,post){const a=gp(N,i0,j0),b=gp(N,i1,j1);const n=Math.max(1,Math.abs(b[0]-a[0]));
    for(let s=0;s<=n;s++){const x=R(a[0]+(b[0]-a[0])*s/n),y=R(a[1]+(b[1]-a[1])*s/n);P(g,x,y-4,1,1,rail);P(g,x,y-2,1,1,rail);if(s%4===0)P(g,x,y-5,1,5,post);}}
  function layerOn(D,fn,oc){const L=mk(D.c.width,D.c.height);fn(L.g);oc=oc||OUT;A.outlineSprite(L.c,oc[0],oc[1],oc[2]);D.g.drawImage(L.c,0,0);return L;}
  // 燈柱不進描邊層（1px 柱描邊會變黑粗條）：直接畫在底圖，燈頭自帶深色帽
  function lampPost(g,ng,x,y,h){P(g,x,y,2,1,'rgba(0,0,0,.22)');P(g,x,y-h,1,h,'#4a4a54');P(g,x-1,y-h-3,3,1,'#2e2e36');P(g,x-1,y-h-2,3,2,'#f2e2a0');P(ng,x-1,y-h-2,3,2,'#fff2c0');}
  function treeR(g,x,y,r){P(g,x,y-3,1,3,'#6a4a2e');ell(g,x,y-2-r,r,Math.max(2,r-1),'#3f7636');ell(g,x-1,y-3-r,Math.max(1,r-2),Math.max(1,r-2),'#5a9644');P(g,x-(r>>1)-1,y-3-r-(r>>1),2,1,'#84bc5c');}
  function boulder(g,cx,cy,rx,ry,hd,pal){dome(g,cx,cy,rx,ry,hd,pal||['#dccdae','#bcac8c','#9a8c72','#7a705e']);}
  function tuftsIn(g,N,i0,i1,j0,j1,n,cA,cB,seed){for(let q=0;q<n;q++){const i=i0+HL(seed,q,1)*(i1-i0),j=j0+HL(seed,q,2)*(j1-j0),p=gp(N,i,j);P(g,R(p[0]),R(p[1]),1,1,HL(seed,q,3)<.5?cA:cB);}}
  const GIRAFFE=['.o........','.hh.......','hhh.......','..n.......','..nn......','..sn......','..nn......','..ns......','..nnnsnnn.','..nsnnnsnt','..nnnnsnn.','..l.l..l.l','..l.l..l.l','..d.d..d.d'];
  const GIRP={o:'#6a4a28',h:'#e2b454',n:'#e2b454',s:'#a8682a',l:'#cfa048',d:'#5a4030',t:'#6a4a28'};
  const ELEPH=['......uuuuuuu..','...eebbbbbbbbb.','.hheebbbbbbbbbb','hkheebbbbbbbbbb','hhheebbbbbbbbbb','thheebbbbbbbbbt','tw.ebbbbbbbbbb.','t...ll.ll.ll.l.','t...ll.ll.ll.l.','....dd.dd.dd.d.'];
  const ELEP={u:'#b4b4ae',h:'#acaca6',b:'#9a9a94',e:'#80807a',k:'#2a2a2a',t:'#8e8e88',w:'#f4f0e0',l:'#8a8a84',d:'#66665f'};
  const ELEPC=['...uuuu.','.eebbbbb','hkebbbbb','heebbbbb','t.l.l.l.','t.d.d.d.'];
  const LION=['mm......','mmfbbbb.','mefbbbbt','mmbbbbb.','.l.l..l.'];
  const LIONP={m:'#9a5a26',f:'#e6b866',e:'#3a2a1a',b:'#dcaa56',t:'#7a4a20',l:'#b88840'};

  /* ======================= k38 動物園（3×3） ======================= */
  try{
    const W=208,H=220,ax=104,ay=218,N=[104,122];
    const rail='#8a6a42',post='#5e4428';
    // v1 重畫：非洲草原園——西南邊茅草屋頂大門＋售票亭；後方獅岩（疊石丘＋雄獅）、左前長頸鹿草原、右前象池、右側圓形茅草餐廳
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     plateH(g,ax,ay,'#8aa060',3,3801);
     const path='#cdb88e';
     poly(g,[gp(N,29,2),gp(N,34,2),gp(N,34,48),gp(N,29,48)],path);
     poly(g,[gp(N,2,20),gp(N,46,20),gp(N,46,25),gp(N,2,25)],path);
     line(g,...gp(N,34,25),...gp(N,34,47.5),'#b39e76');line(g,...gp(N,34.5,20),...gp(N,46,20),'#e0cea4');
     poly(g,[gp(N,3,3),gp(N,26,3),gp(N,26,18),gp(N,3,18)],'#b2a86c');tuftsIn(g,N,4,25,4,17,40,'#9a9258','#c8bc80',3811);
     poly(g,[gp(N,3,27),gp(N,26,27),gp(N,26,42),gp(N,3,42)],'#bcae6a');tuftsIn(g,N,4,25,28,41,40,'#a4985a','#d0c282',3812);
     poly(g,[gp(N,37,27),gp(N,46,27),gp(N,46,46),gp(N,37,46)],'#b49c74');tuftsIn(g,N,38,45,28,45,26,'#9c8660','#c8b28a',3813);
     // 後方：獅岩
     fenceG(g,N,3,3,26,3,rail,post);fenceG(g,N,3,3,3,18,rail,post);
     layerOn(D,lg=>{
       treeR(lg,...gp(N,22,6),5);
       boulder(lg,112,146,20,9,15);boulder(lg,130,151,11,5,10);boulder(lg,92,149,11,5,8);
       boulder(lg,106,134,11,5,9,['#e2d4b6','#c4b494','#a09276','#80766a']);
       for(const [x,y] of [[100,146],[118,150],[126,148],[94,151]])P(lg,x,y,2,1,'#8a7e66');
       sprB(lg,106,127,LION,LIONP);sprB(lg,129,145,LION,LIONP,true);
       const bu=gp(N,6,14);ell(lg,bu[0],bu[1]-2,5,3,'#4f7a36');P(lg,bu[0]-3,bu[1]-4,3,1,'#6c9a48');
     });
     fenceG(g,N,3,18,26,18,rail,post);fenceG(g,N,26,3,26,18,rail,post);
     // 右側：圓形茅草餐廳＋樹
     layerOn(D,lg=>{
       treeR(lg,...gp(N,44,5),6);
       const hc=gp(N,41,11),hb=hc[1];
       cyl(lg,hc[0],hb,10,5,8,['#e6d2a8','#d6c094','#c2aa7e','#a89068','#8e7654'],null);
       for(const dx of [-6,-1,4]){P(lg,hc[0]+dx,hb-6+eh(10,5,dx+1),2,3,'#3e4a50');P(ng,hc[0]+dx,hb-6+eh(10,5,dx+1),2,3,LIT);}
       P(lg,hc[0]-3,hb+eh(10,5,-3)-6,3,6,'#5a3a24');P(ng,hc[0]-3,hb+eh(10,5,-3)-5,3,5,'rgba(255,214,140,.85)');
       cone(lg,hc[0],hb-8-15,hb-8,13,6,(a,u)=>u<-.35?'#e4c474':u<.2?'#caa654':'#a4823e');
       for(let dx=-13;dx<=13;dx++){const y=hb-8+eh(13,6,dx);P(lg,hc[0]+dx,y,1,1,(dx&1)?'#8a6a30':'#b08c44');}
       for(const f of [-.5,.1])line(lg,hc[0]+R(f*3),hb-21,hc[0]+R(13*f),hb-8+eh(13,6,R(13*f))-1,'#b89448');
       P(lg,hc[0],hb-26,1,3,'#6a4a28');
     });
     // 左前：長頸鹿草原
     fenceG(g,N,3,27,26,27,rail,post);fenceG(g,N,3,27,3,42,rail,post);
     const wh=gp(N,20,37);ell(g,wh[0],wh[1],6,3,'#7a8a5a');ell(g,wh[0],wh[1],5,2,'#5aa6c0');P(g,wh[0]-3,wh[1]-1,3,1,'#9ad4e0');
     layerOn(D,lg=>{
       const ac=gp(N,8,30);line(lg,ac[0],ac[1],ac[0],ac[1]-10,'#6a4a2e');line(lg,ac[0],ac[1]-6,ac[0]-4,ac[1]-12,'#6a4a2e');line(lg,ac[0],ac[1]-7,ac[0]+5,ac[1]-12,'#6a4a2e');
       ell(lg,ac[0],ac[1]-14,12,2,'#4c7632');P(lg,ac[0]-10,ac[1]-16,15,1,'#6c9a48');P(lg,ac[0]-7,ac[1]-17,9,1,'#80b058');
       sprB(lg,...gp(N,15,31),GIRAFFE,GIRP);sprB(lg,...gp(N,10,38),GIRAFFE,GIRP,true);
     });
     fenceG(g,N,3,42,26,42,rail,post);fenceG(g,N,26,27,26,42,rail,post);
     // 右前：象池
     fenceG(g,N,37,27,46,27,rail,post);fenceG(g,N,37,27,37,46,rail,post);
     const pl=gp(N,42,31);ell(g,pl[0],pl[1],9,4,'#8a7a5a');ell(g,pl[0],pl[1],8,3,'#4f9ab4');P(g,pl[0]-5,pl[1]-2,5,1,'#8acde0');
     layerOn(D,lg=>{
       boulder(lg,...gp(N,44,40),5,2,5);
       sprB(lg,...gp(N,40,38),ELEPH,ELEP);
       sprB(lg,...gp(N,44,44),ELEPC,ELEP);
     });
     fenceG(g,N,37,46,46,46,rail,post);fenceG(g,N,46,27,46,46,rail,post);
     // 廣場燈柱
     lampPost(g,ng,...gp(N,28,26),9);lampPost(g,ng,...gp(N,35,19),9);
     // 大門＋售票亭（最前）
     layerOn(D,lg=>{
       const bS=gp(N,26,47);rbox(lg,bS,3,3,8,'#eadcbc','#bca884','#b04a36');
       band(lg,bS,-1,1,5,6,3,'#34424e');for(let d=1;d<5;d++){const x=bS[0]-1-d;P(ng,x,faceY(bS,d+1,-1)-6,1,3,LIT);}
       band(lg,bS,-1,0,6,8,1,'#d8664e');band(lg,bS,1,0,6,8,1,'#a84434');
       const p1=gp(N,29,47),p2=gp(N,36,47);
       for(const S0 of [p1,p2]){rbox(lg,S0,2,2,15,'#c8b28c','#98845e','#7c6a4c');band(lg,S0,-1,0,4,10,1,'#a8946c');band(lg,S0,1,0,4,10,1,'#7a6a4a');band(lg,S0,-1,0,4,5,1,'#a8946c');band(lg,S0,1,0,4,5,1,'#7a6a4a');
         const lx=S0[0]-3,ly=faceY(S0,3,-1)-13;P(lg,lx,ly,2,2,'#ffe08a');P(ng,lx,ly,2,2,'#fff2c0');}
       const bm=gp(N,36,46.5,15);rbox(lg,bm,9,1,2,'#8a6a42','#664c30','#7a5c3a',{noAO:true});
       band(lg,bm,-1,5,13,-1,4,'#3e5a2e');for(const d of [7,9,11])P(lg,bm[0]-1-d,faceY(bm,d+1,-1)+1,1,2,'#e8d070');
       poly(lg,[gp(N,26.5,48,17),gp(N,36.5,48,17),gp(N,36.5,46,23),gp(N,26.5,46,23)],'#d6b264');
       poly(lg,[gp(N,36.5,48,17),gp(N,36.5,44,17),gp(N,36.5,46,23)],'#a08040');
       line(lg,...gp(N,27,47,20),...gp(N,36,47,20),'#bc9850');
       line(lg,...gp(N,26.5,46,23),...gp(N,36.5,46,23),'#f0d488');
       line(lg,...gp(N,26.5,48,16),...gp(N,36.5,48,16),'#8a6a30');
     });
     polishFull(D.c,ax,ay,38);
     put('38_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：城市動物園——後方鳥園網格穹頂、右側猴島護城河、左前紅磚動物館（拱窗＋玻璃天窗）、前方企鵝池、東南邊石拱門（小象雕像）
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     plateH(g,ax,ay,'#8aa060',3,3802);
     const pave='#c9b294',paveL='#b69e80';
     poly(g,[gp(N,4,28),gp(N,48,28),gp(N,48,33),gp(N,4,33)],pave);
     poly(g,[gp(N,20,3),gp(N,25,3),gp(N,25,28),gp(N,20,28)],pave);
     for(let i=7;i<47;i+=4)line(g,...gp(N,i,28.5),...gp(N,i,32.5),paveL);
     for(let j=6;j<27;j+=4)line(g,...gp(N,20.5,j),...gp(N,24.5,j),paveL);
     // 鳥園地面、猴島水面、企鵝池
     const AC=[96,147],arx=28,ary=14,ahd=40;
     ell(g,AC[0],AC[1],arx,ary,'#6a9446');tuftsIn(g,N,5,17,5,24,30,'#5a8438','#86b05a',3821);
     ell(g,110,153,6,3,'#4f9ab4');P(g,106,152,4,1,'#8acde0');
     for(let dx=-arx;dx<=arx;dx++)P(g,AC[0]+dx,AC[1]-eh(arx,ary,dx),1,1,'#a4aca8');
     ell(g,147,174,27,13,'#8e826a');ell(g,147,174,25,12,'#4a94ae');P(g,128,171,7,1,'#7cc4d8');P(g,158,181,6,1,'#7cc4d8');P(g,162,168,4,1,'#7cc4d8');
     ell(g,149,172,13,6,'#b09c6c');ell(g,148,171,11,5,'#7a9a48');
     poly(g,[gp(N,29,36),gp(N,44,36),gp(N,44,45),gp(N,29,45)],'#e2e8e8');
     poly(g,[gp(N,30,37),gp(N,43,37),gp(N,43,44),gp(N,30,44)],'#4aa8cc');
     line(g,...gp(N,30,37),...gp(N,43,37),'#2e7c9c');line(g,...gp(N,30,37),...gp(N,30,44),'#2e7c9c');line(g,...gp(N,34,41),...gp(N,38,41),'#8ad4e8');
     // 鳥園：樹與基座（描邊層）→ 網格（不描邊）→ 頂亭
     layerOn(D,lg=>{
       treeR(lg,104,143,7);treeR(lg,84,150,6);treeR(lg,98,158,5);
       const fl=[[112,150],[115,151]];for(const [x,y] of fl){P(lg,x,y-5,1,4,'#e87a9a');P(lg,x,y-6,2,1,'#f09ab0');P(lg,x,y-1,1,1,'#b85a70');}
       for(let dx=-arx;dx<=arx;dx++){const e=eh(arx,ary,dx);P(lg,AC[0]+dx,AC[1]+e-2,1,3,dx<-8?'#d2cabc':dx<10?'#b8b0a0':'#968e80');}
     });
     {const sil=[];for(let dx=-arx;dx<=arx;dx++){const u=dx/(arx+.5),s=Math.sqrt(Math.max(0,1-u*u));sil.push([AC[0]+dx,AC[1]-R(ahd*s)]);}
      for(let dx=-arx;dx<=arx;dx++){const u=dx/(arx+.5),s=Math.sqrt(Math.max(0,1-u*u));const top=AC[1]-R(ahd*s),bot=AC[1]+R(ary*s)-2;P(g,AC[0]+dx,top,1,bot-top,'rgba(214,238,246,.16)');}
      for(const f of [-.72,-.38,0,.38,.72]){let pv=null;for(let t=0;t<=1.0001;t+=.04){const s=Math.sqrt(Math.max(0,1-t*t));const p=[AC[0]+R(arx*s*f),AC[1]-R(ahd*t)+R(ary*s*Math.sqrt(1-f*f))-2];
        if(pv)line(g,pv[0],pv[1],p[0],p[1],f<-.1?'#eef6f8':f>.1?'#a8babf':'#d4e2e6');pv=p;}}
      for(const fr of [.36,.7]){const q=Math.sqrt(1-fr*fr),rr=R(arx*q),ry2=Math.max(1,R(ary*q));for(let dx=-rr;dx<=rr;dx++)P(g,AC[0]+dx,AC[1]-R(ahd*fr)+eh(rr,ry2,dx),1,1,dx<-4?'#eef6f8':dx>4?'#a8babf':'#d4e2e6');}
      for(let k=1;k<sil.length;k++){line(g,sil[k-1][0],sil[k-1][1]-1,sil[k][0],sil[k][1]-1,'#3a4850');line(g,sil[k-1][0],sil[k-1][1],sil[k][0],sil[k][1],k<arx-6?'#f4fafa':k>arx+6?'#9aaab0':'#d8e6ea');}
      for(const [x,y,c] of [[90,128,'#e04848'],[102,122,'#4a8ad8'],[110,134,'#f0d040'],[82,138,'#4a8ad8']]){P(g,x,y,2,1,c);P(g,x+1,y-1,1,1,c);}}
     layerOn(D,lg=>{cyl(lg,AC[0],AC[1]-ahd+2,3,1,3,['#f2eee4','#d8d2c4','#aaa496'],'#8a948c');dome(lg,AC[0],AC[1]-ahd-1,4,2,4,['#9fd0bc','#74b09a','#52917e','#3c7466']);P(lg,AC[0],AC[1]-ahd-8,1,3,'#e8c050');});
     // 猴島
     layerOn(D,lg=>{
       treeR(lg,141,172,6);
       boulder(lg,155,172,7,3,9,['#d4d0c4','#b2ac9e','#8e887c','#6e6a60']);
       const MK=['.mm','mfm','m.m'],MKP={m:'#6a4a30',f:'#d8b088'};
       sprB(lg,155,164,MK,MKP);sprB(lg,149,177,MK,MKP,true);
     });
     line(g,142,165,154,163,'#8a6a42');{const MK=['.mm','mfm','m.m'];spr(g,146,165,MK,{m:'#6a4a30',f:'#d8b088'});}
     // 左前紅磚動物館
     layerOn(D,lg=>{
       const S0=gp(N,18,46);rbox(lg,S0,15,10,14,'#c47a58','#94543e','#7a6a62');
       band(lg,S0,-1,0,30,3,3,'#cdbd9e');band(lg,S0,1,0,20,3,3,'#9a8c72');
       band(lg,S0,-1,0,30,14,2,'#ecdec2');band(lg,S0,1,0,20,14,2,'#baa98a');
       winRow(lg,ng,S0,-1,2,12,5,11,3,6,'arch','#2e3a48','#ecdec2',LIT,3831,.6);
       winRow(lg,ng,S0,-1,20,30,5,11,3,6,'arch','#2e3a48','#ecdec2',LIT,3832,.6);
       winRow(lg,ng,S0,1,3,19,5,11,3,6,'arch','#26303c','#baa98a',LIT,3833,.6);
       for(let d=12;d<=18;d++){const rise=R(5*(1-Math.abs(d-15)/4));const x=S0[0]-1-d,yb=faceY(S0,d+1,-1);if(rise>0)P(lg,x,yb-16-rise,1,rise,d<=15?'#f4e8d0':'#e0d2b6');}
       band(lg,S0,-1,13,18,9,9,'#4a3024');band(lg,S0,-1,14,17,10,1,'#4a3024');
       for(let d=13;d<18;d++){const x=S0[0]-1-d;P(ng,x,faceY(S0,d+1,-1)-8,1,7,'rgba(255,214,140,.8)');}
       const lS=gp(N,15,43,14);rbox(lg,lS,9,4,5,'#a4c8d6','#6a92a4','#5a6a74',{noAO:true});
       for(let d=2;d<18;d+=3)band(lg,lS,-1,d,d+1,5,5,'#e8f2f4');for(let d=2;d<8;d+=3)band(lg,lS,1,d,d+1,5,5,'#8aaab8');
     });
     // 前方企鵝池
     layerOn(D,lg=>{
       boulder(lg,...gp(N,31.5,38.5),7,3,5,['#e8eef0','#c4cdd0','#9aa6aa','#78848a']);boulder(lg,...gp(N,34,40.5),3,1,3,['#e8eef0','#c4cdd0','#9aa6aa','#78848a']);
       const PG=['.k.','kwk','kwk','.o.'],PGP={k:'#26262c',w:'#f4f4f0',o:'#e8a030'};
       const r1=gp(N,31.5,38.5,5);sprB(lg,r1[0],r1[1],PG,PGP);
       for(const [i,j] of [[36,35.6],[38,35.6],[44.4,40]])sprB(lg,...gp(N,i,j),PG,PGP);
       const sw=gp(N,38,41);P(lg,sw[0],sw[1],2,1,'#26262c');
     });
     // 東南邊石拱門
     layerOn(D,lg=>{
       const sl='#e6dcc6',sr='#b4a890',st='#cfc4ac';
       const q1=gp(N,48,27),q2=gp(N,48,35);
       rbox(lg,q1,2,2,17,sl,sr,st);band(lg,q1,-1,0,4,17,2,'#f4ecdc');band(lg,q1,1,0,4,17,2,'#c8bca4');band(lg,q1,-1,0,4,3,1,'#c8bca4');band(lg,q1,1,0,4,3,1,'#9a8e76');
       const aS=gp(N,48,33,11);rbox(lg,aS,2,6,4,sl,sr,st,{noAO:true});
       const g0=gp(N,48,33);band(lg,g0,1,0,2,11,2,sr);band(lg,g0,1,10,12,11,2,sr);
       band(lg,aS,1,1,11,3,2,'#3e6a3a');for(const d of [2,4,6,8,9])band(lg,aS,1,d,d+1,3,1,'#e8d070');
       rbox(lg,q2,2,2,17,sl,sr,st);band(lg,q2,-1,0,4,17,2,'#f4ecdc');band(lg,q2,1,0,4,17,2,'#c8bca4');band(lg,q2,-1,0,4,3,1,'#c8bca4');band(lg,q2,1,0,4,3,1,'#9a8e76');
       for(const q of [q1,q2]){const t=[q[0],q[1]-17-2];P(lg,t[0]-1,t[1]-3,3,3,'#f2e2a0');P(lg,t[0]-1,t[1]-4,3,1,'#5a5a60');P(ng,t[0]-1,t[1]-3,3,3,'#fff2c0');}
       const st1=gp(N,47,30,15);sprB(lg,st1[0],st1[1],ELEPC,{u:'#eee6d4',h:'#ddd2bc',b:'#d0c4ac',e:'#b8ac94',k:'#8a806c',t:'#c8bca4',l:'#c0b49c',d:'#a89c84'});
     });
     lampPost(g,ng,...gp(N,19,34),9);lampPost(g,ng,...gp(N,26,27),9);lampPost(g,ng,...gp(N,40,27.4),9);
     polishFull(D.c,ax,ay,38);
     put('38_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k38:'+e.message);}

  /* ---------- 軌道／滑道：Catmull-Rom 取樣（地面座標 i,j,h）→ 畫面折線 ---------- */
  function crPath(pts,closed,step){const out=[],n=pts.length,segs=closed?n:n-1;step=step||1/16;
    for(let s=0;s<segs;s++){const p1=pts[s],p2=pts[(s+1)%n];const p0=(closed||s>0)?pts[(s-1+n)%n]:p1,p3=(closed||s<n-2)?pts[(s+2)%n]:p2;
      for(let t=0;t<1-1e-6;t+=step){const t2=t*t,t3=t2*t;const f=q=>.5*((2*p1[q])+(-p0[q]+p2[q])*t+(2*p0[q]-5*p1[q]+4*p2[q]-p3[q])*t2+(-p0[q]+3*p1[q]-3*p2[q]+p3[q])*t3);out.push([f(0),f(1),f(2)]);}}
    out.push(closed?out[0]:pts[n-1]);return out;}
  function tubeDraw(lg,N,path,cL,cM,cD){for(let k=1;k<path.length;k++){const a=gp(N,...path[k-1]),b=gp(N,...path[k]);
    if(Math.abs(b[1]-a[1])>Math.abs(b[0]-a[0])){line(lg,a[0]-1,a[1],b[0]-1,b[1],cL);line(lg,a[0],a[1],b[0],b[1],cM);line(lg,a[0]+1,a[1],b[0]+1,b[1],cD);}
    else{line(lg,a[0],a[1]-1,b[0],b[1]-1,cL);line(lg,a[0],a[1],b[0],b[1],cM);line(lg,a[0],a[1]+1,b[0],b[1]+1,cD);}}}
  function supportsDraw(g,N,path,every,col,minH){for(let k=0;k<path.length;k+=every){const p=path[k];if(p[2]<(minH||5))continue;const a=gp(N,p[0],p[1],p[2]),b=gp(N,p[0],p[1],0);
    line(g,a[0],a[1]+2,b[0],b[1],col);P(g,R(b[0])-1,R(b[1]),3,1,'rgba(0,0,0,.18)');}}
  function parasol(lg,x,y,c1,c2){P(lg,x,y-9,1,9,'#8a8a92');cone(lg,x,y-13,y-9,6,2,(a,u)=>{const b=(Math.floor((a+1.5708)/3.1416*6)%2)?c1:c2;return u>.4?shade(b,-26):b;});}
  function lounger(g,x,y){P(g,x,y,7,2,'#eee6ce');P(g,x,y+2,7,1,'#b4a88c');P(g,x-1,y-1,2,1,'#eee6ce');}
  const blueCone=(a,u)=>u<-.3?'#6a8ae8':u<.3?'#4a6ad0':'#34509c';
  function turret(lg,ng,cx,by,rx,ry,h,coneH,seed,flag){
    cyl(lg,cx,by,rx,ry,h,['#f8e0ea','#f2cede','#e2b8cc','#cc9eb8','#b4869e'],null);
    for(let dx=-rx;dx<=rx;dx+=2)P(lg,cx+dx,by-h+eh(rx,ry,dx)-2,1,2,dx<0?'#f8e0ea':'#cc9eb8');
    cone(lg,cx,by-h-coneH,by-h-1,rx+1,Math.max(1,ry),blueCone);
    if(flag){P(lg,cx,by-h-coneH-4,1,4,'#6a6a70');P(lg,cx+1,by-h-coneH-4,3,2,flag);}
    if(h>=14){P(lg,cx-2,by-h+6,2,3,'#3a3048');P(lg,cx-2,by-h+5,1,1,'#3a3048');if(HL(seed,1,2)<.75)P(ng,cx-2,by-h+6,2,3,LIT);}}

  /* ======================= k39 遊樂園（3×3） ======================= */
  try{
    const W=208,H=220,ax=104,ay=218,N=[104,122];
    // v1 重畫：雲霄飛車園——後半區鋼構飛車（拉升坡＋垂直大迴環＋車站頂棚）、左前紫黃馬戲大帳篷、右前三間條紋小吃攤、南側彩虹拱門＋氣球
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     plateH(g,ax,ay,'#9a8a6a',3,3901);
     const pv='#d6c4a0',pvL='#c2ae88';
     poly(g,[gp(N,33,22),gp(N,38,22),gp(N,38,48),gp(N,33,48)],pv);
     poly(g,[gp(N,3,22),gp(N,46,22),gp(N,46,27),gp(N,3,27)],pv);
     for(let j=29;j<48;j+=3)line(g,...gp(N,33.5,j),...gp(N,37.5,j),pvL);
     for(let i=5;i<46;i+=3)if(i<32||i>39)line(g,...gp(N,i,22.5),...gp(N,i,26.5),pvL);
     for(const [i,j,c] of [[34.5,23.5,'#d8a0c0'],[36.5,25.5,'#a0c8e0'],[34.5,25.5,'#e8d080'],[36.5,23.5,'#a8d8a0']])poly(g,[gp(N,i-.9,j-.9),gp(N,i+.9,j-.9),gp(N,i+.9,j+.9),gp(N,i-.9,j+.9)],c);
     // 飛車軌道
     const cp=[[37,19,6],[27,19,6],[18,19,30],[9,19,52],[4,15,53],[4,8,44],[10,3.5,14],[20,3.5,8]];
     for(let k=0;k<20;k++){const th=k/20*6.2832;cp.push([28+5.5*Math.sin(th),3.5+1.6*k/20,8+11*(1-Math.cos(th))]);}
     cp.push([38,5.3,8],[45,9,18],[45,15,14],[43,19,7]);
     const trk=crPath(cp,true,1/10);
     supportsDraw(g,N,trk,6,'#d8d2c6',7);
     layerOn(D,lg=>{for(let k=1;k<trk.length;k++){const a=gp(N,...trk[k-1]),b=gp(N,...trk[k]);line(lg,a[0],a[1],b[0],b[1],'#e04848');line(lg,a[0],a[1]+1,b[0],b[1]+1,'#962a2a');}},[70,24,28]);
     // 車站頂棚＋列車
     layerOn(D,lg=>{
       rbox(lg,gp(N,38,21),9,1,3,'#cfc6b4','#a49a88','#dcd4c4',{noAO:true});
       for(let k=0;k<3;k++){const c=gp(N,30+k*2.4,19,8);P(lg,R(c[0])-2,R(c[1])-2,4,3,'#f0c040');P(lg,R(c[0])-1,R(c[1])-3,1,1,'#e8b890');P(lg,R(c[0])+1,R(c[1])-3,1,1,'#5a3a2a');}
       for(const i of [29,37]){const b=gp(N,i,21),t=gp(N,i,21,14);P(lg,b[0],t[1],1,b[1]-t[1],'#8a8a94');}
       poly(lg,[gp(N,28.5,17,14),gp(N,37.5,17,14),gp(N,37.5,21.5,14),gp(N,28.5,21.5,14)],'#f4f0e8');
       for(let i=28.5;i<37.5;i+=1)poly(lg,[gp(N,i,17,14),gp(N,i+.5,17,14),gp(N,i+.5,21.5,14),gp(N,i,21.5,14)],'#d84848');
       for(let s=0;s<18;s++){const i=28.5+s*.5,p=gp(N,i,21.5,13);P(lg,R(p[0]),R(p[1]),1,2,(s&1)?'#f4f0e8':'#b83838');}
       for(const i of [30,33,36]){const p=gp(N,i,21.5,12);P(lg,R(p[0]),R(p[1])+1,1,1,'#fff2c0');P(ng,R(p[0]),R(p[1])+1,1,1,'#fff6d8');}
     });
     layerOn(D,lg=>{treeR(lg,...gp(N,3,4),6);treeR(lg,...gp(N,47,22),5);});
     // 左前：馬戲大帳篷
     layerOn(D,lg=>{
       const tc=gp(N,10,35),cx=tc[0],by=tc[1],rx=18,ry=9,wh=9,cA='#8a4ec0',cB='#f4d04a';
       for(let dx=-rx;dx<=rx;dx++){const e=eh(rx,ry,dx),u=dx/(rx+.5);let c=((dx+rx)>>2)&1?cA:cB;c=u<-.35?shade(c,10):u>.35?shade(c,-26):c;P(lg,cx+dx,by-wh+e,1,wh,c);}
       for(let dx=-9;dx<=-2;dx++){const e=eh(rx,ry,dx);const hh=R((wh-1)*(1-Math.abs(dx+5.5)/4.5));if(hh>0)P(lg,cx+dx,by+e-hh,1,hh,'#3a2440');}
       for(let dx=-8;dx<=-3;dx++){const e=eh(rx,ry,dx);P(ng,cx+dx,by+e-4,1,4,'rgba(255,200,130,.75)');}
       cone(lg,cx,by-36,by-wh,rx+3,ry+1,(a,u)=>{const b=(Math.floor((a+1.5708)/3.1416*12)%2)?cA:cB;return u>.35?shade(b,-30):u<-.35?shade(b,10):b;});
       for(let dx=-(rx+3);dx<=rx+3;dx++){const y=by-wh+eh(rx+3,ry+1,dx);P(lg,cx+dx,y+1,1,((dx+rx+3)>>1)&1?2:1,'#f4d04a');}
       for(let dx=-(rx+1);dx<=rx+1;dx+=4){const y=by-wh+eh(rx+3,ry+1,dx)+1;P(lg,cx+dx,y,1,1,'#fff6c8');P(ng,cx+dx,y,1,1,'#fff8d8');}
       P(lg,cx,by-43,1,7,'#6a5a4a');P(lg,cx+1,by-43,4,2,'#e04848');P(lg,cx+1,by-41,2,1,'#e04848');
     });
     layerOn(D,lg=>{treeR(lg,...gp(N,14,46),5);treeR(lg,...gp(N,21,43),5);});
     // 右前：三間小吃攤
     layerOn(D,lg=>{
       const aw=[['#e86a8a','#f8f0ea'],['#4a9ad8','#f8f0ea'],['#58b870','#f8f0ea']];
       [[47,34],[47,40],[44,46]].forEach(([i,j],n)=>{const S0=gp(N,i,j);rbox(lg,S0,4,3,7,'#f2ece0','#c8c0b0','#b8b0a2');
         band(lg,S0,-1,1,7,5,3,'#3a3440');for(let d=1;d<7;d++)P(ng,S0[0]-1-d,faceY(S0,d+1,-1)-5,1,3,LIT);
         for(let d=0;d<8;d++)band(lg,S0,-1,d,d+1,8,2,(d&1)?aw[n][1]:aw[n][0]);for(let d=0;d<6;d++)band(lg,S0,1,d,d+1,8,2,(d&1)?shade(aw[n][1],-30):shade(aw[n][0],-30));
         const sg0=[S0[0]-3,S0[1]-7-6];P(lg,sg0[0]-2,sg0[1],6,4,aw[n][0]);P(lg,sg0[0]-1,sg0[1]+1,4,2,'#fff6d0');});
     });
     // 南側彩虹拱門＋氣球
     layerOn(D,lg=>{
       for(const i of [32.5,38.5]){rbox(lg,gp(N,i+.5,47.5),1,1,17,'#f2ece0','#c0b8a8','#d8d0c0',{noAO:true});}
       for(let s=0;s<=28;s++){const i=32.5+s*.25,rise=R(4*Math.sin(Math.PI*s/28));const p=gp(N,i,47,17+rise);const x=R(p[0]),y=R(p[1]);
         P(lg,x,y-1,1,1,'#f4d04a');P(lg,x,y,1,2,'#d83a3a');P(lg,x,y+2,1,1,'#4a8ad8');}
       for(let s=2;s<=26;s+=4){const i=32.5+s*.25,rise=R(4*Math.sin(Math.PI*s/28));const p=gp(N,i,47,17+rise);P(lg,R(p[0]),R(p[1]),1,1,'#fff6c8');P(ng,R(p[0]),R(p[1]),1,1,'#fff8d8');}
       for(const [i,cols] of [[31.5,['#e04848','#4a8ad8','#f0c040']],[39.8,['#58c470','#e070b0','#f0c040']]]){const b=gp(N,i,47.8);
         line(lg,b[0],b[1],b[0]-3,b[1]-14,'#d8d8d8');line(lg,b[0],b[1],b[0],b[1]-16,'#d8d8d8');line(lg,b[0],b[1],b[0]+3,b[1]-13,'#d8d8d8');
         [[-3,-16],[0,-18],[3,-15]].forEach(([dx,dy],q)=>{ell(lg,b[0]+dx,b[1]+dy,2,2,cols[q]);P(lg,b[0]+dx-1,b[1]+dy-1,1,1,'#ffffff');P(ng,b[0]+dx-1,b[1]+dy-1,2,2,shade(cols[q],30));});
         P(lg,b[0]-1,b[1]-1,3,2,'#5a5a64');}
     });
     lampPost(g,ng,...gp(N,32,28),9);lampPost(g,ng,...gp(N,39,28),9);
     polishFull(D.c,ax,ay,39);
     put('39_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：童話城堡園——後方粉色城堡（四角塔＋中央主塔）、右後自由落體塔、左前飛椅、前方天鵝船湖、東南邊城堡小塔門
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     plateH(g,ax,ay,'#9a8a6a',3,3902);
     const pv='#dcc4b4',pvL='#c8ae9c';
     poly(g,[gp(N,19,22),gp(N,48,22),gp(N,48,27),gp(N,19,27)],pv);
     for(let i=21;i<47;i+=3)line(g,...gp(N,i,22.5),...gp(N,i,26.5),pvL);
     ell(g,...gp(N,10,36),15,6,'#b8a488');ell(g,...gp(N,10,36),13,5,'#d8c8ac');
     const pc=gp(N,38,38);ell(g,pc[0],pc[1],19,9,'#8a8272');ell(g,pc[0],pc[1],17,8,'#4aa0c0');P(g,pc[0]-10,pc[1]-3,6,1,'#8ad0e0');P(g,pc[0]+4,pc[1]+3,5,1,'#8ad0e0');
     // 右後：自由落體塔
     const tx=168,tb=167;
     layerOn(D,lg=>{
       rbox(lg,gp(N,43,11),6,6,3,'#8a8a94','#62626c','#a4a4ae');
       for(let dx=-9;dx<=9;dx++)P(lg,tx+dx,113-eh(9,3,dx),1,2,'#3a58b8');
       cyl(lg,tx,tb,2,1,84,['#f4f2ec','#dcdad4','#b4b2ac'],null);
       for(let k=1;k<6;k++)P(lg,tx-2,tb-k*14,5,2,'#d84040');
       P(lg,tx-4,tb-88,9,4,'#3a3a44');P(lg,tx-3,tb-89,7,1,'#5a5a64');P(lg,tx-1,tb-92,3,3,'#ff5050');P(ng,tx-1,tb-92,3,3,'#ff9090');
       for(let dx=-9;dx<=9;dx++){const e=eh(9,3,dx);P(lg,tx+dx,113+e,1,3,dx<-3?'#6a8ae8':dx<4?'#4a6ad0':'#34509c');}
       for(const dx of [-7,-3,1,5]){const e=eh(9,3,dx);P(lg,tx+dx,113+e+3,2,2,'#f0c040');P(lg,tx+dx,113+e+5,1,2,'#e8b890');P(lg,tx+dx+1,113+e+5,1,2,'#3a4a6a');}
     });
     // 後方：城堡
     layerOn(D,lg=>{
       turret(lg,ng,...gp(N,6,6),6,3,32,16,3921,null);
       const S0=gp(N,20,20);rbox(lg,S0,14,14,22,'#f2cede','#c89ab4','#b48aa0');
       for(let d=0;d<28;d+=4){band(lg,S0,-1,d,d+2,24,2,'#f2cede');band(lg,S0,1,d,d+2,24,2,'#c89ab4');}
       band(lg,S0,-1,0,28,2,2,'#dcb4c6');band(lg,S0,1,0,28,2,2,'#b088a0');
       winRow(lg,ng,S0,-1,3,11,4,16,2,4,'arch','#3a3048','#f8e0ea',LIT,3922,.5);winRow(lg,ng,S0,-1,19,27,4,16,2,4,'arch','#3a3048','#f8e0ea',LIT,3923,.5);
       winRow(lg,ng,S0,1,4,26,5,16,2,4,'arch','#2e2638','#dcb4c6',LIT,3924,.5);
       for(let d=11;d<=17;d++){const hh=d===11||d===17?8:d===12||d===16?10:11;band(lg,S0,-1,d,d+1,hh,hh,'#3a2a34');}
       for(let d=12;d<=16;d+=2)band(lg,S0,-1,d,d+1,10,10,'#6a5a64');band(lg,S0,-1,11,18,6,1,'#6a5a64');
       for(let d=12;d<=16;d++)P(ng,S0[0]-1-d,faceY(S0,d+1,-1)-5,1,4,'rgba(255,200,130,.6)');
       const dj=gp(N,13,13,22);cyl(lg,dj[0],dj[1],8,4,20,['#f8e0ea','#f2cede','#e2b8cc','#cc9eb8','#b4869e'],null);
       for(let dx=-8;dx<=8;dx+=2)P(lg,dj[0]+dx,dj[1]-20+eh(8,4,dx)-2,1,2,dx<0?'#f8e0ea':'#cc9eb8');
       for(const dx of [-4,1]){P(lg,dj[0]+dx,dj[1]-13,2,4,'#3a3048');P(ng,dj[0]+dx,dj[1]-13,2,4,LIT);}
       cone(lg,dj[0],dj[1]-44,dj[1]-21,10,4,blueCone);P(lg,dj[0],dj[1]-50,1,6,'#6a6a70');P(lg,dj[0]+1,dj[1]-50,4,2,'#f0c040');
       turret(lg,ng,...gp(N,6,20),6,3,30,15,3925,'#e04848');turret(lg,ng,...gp(N,20,6),6,3,30,15,3926,'#4a8ad8');turret(lg,ng,...gp(N,20,20),6,3,28,14,3927,null);
     });
     layerOn(D,lg=>{treeR(lg,...gp(N,28,12),6);treeR(lg,...gp(N,3,30),5);treeR(lg,...gp(N,32,46),5);});
     // 左前：飛椅
     {const sc=gp(N,10,36),cx=sc[0],by=sc[1],cy=by-11,ry=by-26;const cols=['#e04848','#f0c040','#4a8ad8','#58c470'];
      const ch=[];for(let k=0;k<8;k++){const a=k/8*6.2832+.3;ch.push({a,x:cx+R(Math.cos(a)*19),y:cy+R(Math.sin(a)*7),rx:cx+R(Math.cos(a)*12),ry2:ry+R(Math.sin(a)*4),back:Math.sin(a)<0,c:cols[k%4]});}
      const chair=(lg,q)=>{P(lg,q.x-1,q.y,3,2,q.c);P(lg,q.x,q.y-1,1,1,'#e8b890');};
      layerOn(D,lg=>{ch.filter(q=>q.back).forEach(q=>chair(lg,q));});
      for(const q of ch.filter(q=>q.back))line(g,q.rx,q.ry2,q.x,q.y,'#8a8a90');
      layerOn(D,lg=>{cyl(lg,cx,by,1,1,27,['#f0d070','#e0b848','#b88c30'],null);
        cone(lg,cx,by-37,ry,13,5,(a,u)=>{const b=cols[Math.floor((a+1.5708)/3.1416*8)%4];return u>.35?shade(b,-28):u<-.35?shade(b,12):b;});
        for(let dx=-12;dx<=12;dx+=4){const y=ry+eh(13,5,dx);P(lg,cx+dx,y,1,1,'#fff6c8');P(ng,cx+dx,y,1,1,'#fff8d8');}
        P(lg,cx,by-41,1,4,'#6a6a70');});
      for(const q of ch.filter(q=>!q.back))line(g,q.rx,q.ry2+1,q.x,q.y,'#6a6a70');
      layerOn(D,lg=>{ch.filter(q=>!q.back).forEach(q=>chair(lg,q));});}
     // 前方天鵝船
     layerOn(D,lg=>{const SW=['...ww.','...wwo','w..w..','wwwww.','wwwwww','.ssss.'],SWP={w:'#f6f6f2',o:'#f0a030',s:'#b8c0c8'};
       sprB(lg,pc[0]-6,pc[1]+1,SW,SWP);sprB(lg,pc[0]+7,pc[1]-2,SW,SWP,true);});
     // 東南邊小塔門
     layerOn(D,lg=>{
       turret(lg,ng,...gp(N,47,20.5),4,2,17,10,3928,'#e04848');
       for(let s=0;s<=32;s++){const j=20.5+s*.25,rise=R(2*Math.sin(Math.PI*s/32));const p=gp(N,47,j,14+rise);const x=R(p[0]),y=R(p[1]);P(lg,x,y,1,1,'#f4d04a');P(lg,x,y+1,1,2,'#8a4ec0');}
       for(let s=4;s<=28;s+=6){const j=20.5+s*.25,rise=R(2*Math.sin(Math.PI*s/32));const p=gp(N,47,j,14+rise);P(lg,R(p[0]),R(p[1])+1,1,1,'#fff6c8');P(ng,R(p[0]),R(p[1])+1,1,1,'#fff8d8');}
       turret(lg,ng,...gp(N,47,28.5),4,2,17,10,3929,'#4a8ad8');
     });
     lampPost(g,ng,...gp(N,30,21),9);lampPost(g,ng,...gp(N,22,28),9);
     polishFull(D.c,ax,ay,39);
     put('39_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k39:'+e.message);}

  /* ======================= k101 水上樂園（2×2） ======================= */
  try{
    const W=136,H=150,ax=68,ay=148,N=[68,84];
    const tiles=g=>{plateH(g,ax,ay,'#b8c4c8',2,10100);for(let q=4;q<32;q+=4){line(g,...gp(N,q,.5),...gp(N,q,31.5),'#acb8bc');line(g,...gp(N,.5,q),...gp(N,31.5,q),'#acb8bc');}};
    const poolRect=(g,ng,i0,i1,j0,j1)=>{poly(g,[gp(N,i0,j0),gp(N,i1,j0),gp(N,i1,j1),gp(N,i0,j1)],'#eef2f2');
      poly(g,[gp(N,i0+1,j0+1),gp(N,i1-1,j0+1),gp(N,i1-1,j1-1),gp(N,i0+1,j1-1)],'#4fc3d9');
      poly(ng,[gp(N,i0+1,j0+1),gp(N,i1-1,j0+1),gp(N,i1-1,j1-1),gp(N,i0+1,j1-1)],'rgba(102,217,236,.9)');
      line(g,...gp(N,i0+1,j0+1),...gp(N,i1-1,j0+1),'#2e9ab4');line(g,...gp(N,i0+1,j0+1),...gp(N,i0+1,j1-1),'#2e9ab4');
      line(g,...gp(N,i0+1.5,j0+1.5),...gp(N,i1-1.5,j0+1.5),'#3aaec8');};
    // v1 重畫：滑道塔——後方三層鋼架跳台（綠松石尖頂）、黃色直線高速滑道衝入左前大池、藍色 S 形管滑道落入右側戲水池、前方躺椅陽傘與小吃亭
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     tiles(g);
     poolRect(g,ng,2,16,15,30);
     for(let s=0;s<22;s++){const p=gp(N,3+s*.55,22.5);P(g,R(p[0]),R(p[1]),1,1,(s>>1)&1?'#f4f4f0':'#e04848');}
     line(g,...gp(N,6,26),...gp(N,10,26),'#9ae4f0');line(g,...gp(N,11,19),...gp(N,14,19),'#9ae4f0');
     poolRect(g,ng,19,31,2,13);
     line(g,...gp(N,23,8),...gp(N,27,8),'#9ae4f0');
     const ys=[[7.5,11.6,38],[7.5,15,20],[7.5,18.5,4],[7.5,21,1.5]],yp=crPath(ys,false,1/12);
     const bt=[[11.6,7.5,36],[15,4.5,31],[19,4,25],[21.5,7.5,19],[18.5,10.5,13],[21,12,8],[24,9,3.5],[26,7,1.5]],bp=crPath(bt,false,1/12);
     supportsDraw(g,N,yp,4,'#a8b0b4',6);supportsDraw(g,N,bp,5,'#a8b0b4',6);
     // 鋼架塔
     layerOn(D,lg=>{
       const post=(i,j,c)=>{const b=gp(N,i,j),t=gp(N,i,j,38);P(lg,b[0],t[1],2,b[1]-t[1],c);};
       post(4,4,'#8a9096');post(4,11,'#d8dde0');post(11,4,'#9aa2a8');
       for(const h of [19,38]){roofPara(lg,gp(N,11.5,11.5,h),7.5,7.5,'#e89a40','#b86a20','#f6c070');
         for(let d=0;d<15;d++){P(lg,gp(N,11.5,11.5,h)[0]-1-d,faceY(gp(N,11.5,11.5,h),d+1,-1),1,2,'#b86a20');P(lg,gp(N,11.5,11.5,h)[0]+d,faceY(gp(N,11.5,11.5,h),d,1),1,2,'#8a4e18');}}
       for(let k=0;k<4;k++){const h0=2+k*9;line(lg,...gp(N,11.6,5+(k%2?5:0),h0),...gp(N,11.6,5+(k%2?0:5),h0+8),'#f0f2f2');}
       post(11,11,'#c4cacc');
       for(const h of [22,41]){const S0=gp(N,11.5,11.5,h);for(let d=0;d<15;d+=1){P(lg,S0[0]-1-d,faceY(S0,d+1,-1),1,1,'#f4f6f6');P(lg,S0[0]+d,faceY(S0,d,1),1,1,'#c8d0d2');}}
       const ap=gp(N,7.75,7.75,53);
       poly(lg,[gp(N,3,12.5,41),gp(N,12.5,12.5,41),ap],'#48c0b4');poly(lg,[gp(N,12.5,12.5,41),gp(N,12.5,3,41),ap],'#2a8a86');
       for(const f of [.33,.66]){line(lg,...gp(N,3+9.5*f,12.5,41),ap[0],ap[1],'#e8f8f4');line(lg,...gp(N,12.5,12.5-9.5*f,41),ap[0],ap[1],'#9ad8d0');}
       P(lg,ap[0],ap[1]-4,1,4,'#6a6a70');P(lg,ap[0]+1,ap[1]-4,3,2,'#f0c040');
       const lamp=gp(N,11.5,11.5,40);P(lg,lamp[0],lamp[1]-2,1,1,'#fff2c0');P(ng,lamp[0]-1,lamp[1]-2,2,2,'#fff2c0');
     });
     layerOn(D,lg=>{tubeDraw(lg,N,bp,'#8ac4f4','#3a8ad8','#24609c');});
     layerOn(D,lg=>{tubeDraw(lg,N,yp,'#fff0a0','#f0c030','#b88a20');const e=gp(N,7.5,21,1.5);P(lg,R(e[0])-3,R(e[1])-2,2,1,'#ffffff');P(lg,R(e[0])+2,R(e[1])-3,2,1,'#ffffff');});
     // 前方甲板：躺椅、陽傘、小吃亭
     lounger(g,...gp(N,20,21));lounger(g,...gp(N,24,19));lounger(g,...gp(N,18,26));
     layerOn(D,lg=>{parasol(lg,...gp(N,22,23),'#e05252','#f6f2ea');parasol(lg,...gp(N,27,20),'#3a8ad8','#f6f2ea');
       const S0=gp(N,30,30);rbox(lg,S0,4,3,8,'#f2ece0','#c8c0b0','#c04a3a');band(lg,S0,-1,1,7,6,3,'#3a3440');
       for(let d=1;d<7;d++)P(ng,S0[0]-1-d,faceY(S0,d+1,-1)-6,1,3,LIT);
       for(let d=0;d<8;d++)band(lg,S0,-1,d,d+1,8,2,(d&1)?'#f8f0ea':'#f0a030');for(let d=0;d<6;d++)band(lg,S0,1,d,d+1,8,2,(d&1)?'#c8c0b8':'#b87420');});
     polishFull(D.c,ax,ay,101);
     put('101_1_1',D.c,NN.c,ax,ay);}
    // v2 重畫：室內熱帶館——後方玻璃筒拱大廳（拱肋＋端牆玻璃）、橘色管滑道由端牆穿出繞一圈落入前方沙灘潟湖、椰子樹與茅草傘
    {const D=mk(W,H),NN=mk(W,H),g=D.g,ng=NN.g;
     tiles(g);
     const lc=[54,120];
     ell(g,lc[0],lc[1],31,14,'#e8d8a8');ell(g,lc[0],lc[1],27,12,'#7fd8ea');ell(g,lc[0],lc[1],24,10,'#4fc3d9');ell(g,lc[0]+2,lc[1]+1,12,5,'#3aaccc');
     ell(ng,lc[0],lc[1],27,12,'rgba(102,217,236,.85)');
     P(g,lc[0]-14,lc[1]-5,6,1,'#9ae4f0');P(g,lc[0]+6,lc[1]+6,5,1,'#9ae4f0');
     for(let q=0;q<16;q++){const a=HL(10120,q,1)*6.2832,rr=28.5+HL(10120,q,2)*1.5;P(g,R(lc[0]+Math.cos(a)*rr),R(lc[1]+Math.sin(a)*rr*.47),1,1,HL(10120,q,3)<.5?'#d4c290':'#f4e8c0');}
     // 玻璃筒拱大廳
     const I0=4,I1=25,J0=3,J1=12,WH=7,VR=9,jc=(J0+J1)/2,jr=(J1-J0)/2;
     layerOn(D,lg=>{
       rbox(lg,gp(N,I1,J1),I1-I0,J1-J0,WH,'#eef0ee','#c0c6c8',null);
       const S0=gp(N,I1,J1);band(lg,S0,-1,2,40,6,4,'#4a7a90');for(let d=2;d<40;d+=3)band(lg,S0,-1,d,d+1,6,4,'#dfe8ea');
       for(let d=2;d<40;d++)if(d%3)P(ng,S0[0]-1-d,faceY(S0,d+1,-1)-6,1,4,'rgba(255,226,160,.55)');
       band(lg,S0,-1,18,23,6,6,'#2e4050');band(lg,S0,-1,18,23,7,1,'#eef0ee');
       const bandsC=['#c4e8f2','#a4d6ea','#80bcd4','#5e9eb8'];const NB=12;
       for(let i=I0;i<I1-1e-6;i+=.5)for(let b=NB-1;b>=0;b--){const f0=b/NB*Math.PI,f1=(b+1)/NB*Math.PI;
         const q=(f0,ii)=>gp(N,ii,jc+jr*Math.cos(f0),WH+VR*Math.sin(f0));poly(lg,[q(f0,i),q(f0,i+.5),q(f1,i+.5),q(f1,i)],bandsC[Math.min(3,Math.floor(b/NB*4))]);}
       for(const f of [Math.PI/4,Math.PI/2])line(lg,...gp(N,I0,jc+jr*Math.cos(f),WH+VR*Math.sin(f)),...gp(N,I1,jc+jr*Math.cos(f),WH+VR*Math.sin(f)),'#e4f4f8');
       for(let i=I0+3;i<I1;i+=3){let pv=null;for(let f=0;f<=Math.PI*.62;f+=Math.PI/24){const p=gp(N,i,jc+jr*Math.cos(f),WH+VR*Math.sin(f));if(pv)line(lg,pv[0],pv[1],p[0],p[1],'#f4fafc');pv=p;}}
       const sec=[];for(let f=0;f<=Math.PI+1e-6;f+=Math.PI/16)sec.push(gp(N,I1,jc+jr*Math.cos(f),WH+VR*Math.sin(f)));
       poly(lg,[gp(N,I1,J1,WH),...sec,gp(N,I1,J0,WH)],'#5a98b2');
       for(const j of [5,7.5,10]){const h=WH+VR*Math.sqrt(Math.max(0,1-Math.pow((j-jc)/jr,2)));line(lg,...gp(N,I1,j,WH),...gp(N,I1,j,h-.5),'#d4eaf2');}
       line(lg,...gp(N,I1,J1,WH+4),...gp(N,I1,J0,WH+4),'#d4eaf2');
     });
     // 管滑道
     const ot=[[24,9,13],[28,10.5,11.5],[29.5,15,9],[26,18,7],[21.5,16,5],[19.5,20,3],[19,23.5,1]],op=crPath(ot,false,1/12);
     supportsDraw(g,N,op,5,'#a8b0b4',5);
     layerOn(D,lg=>{tubeDraw(lg,N,op,'#ffb878','#f0802e','#b8561c');const e=gp(N,19,23.5,1);P(lg,R(e[0])-3,R(e[1]),2,1,'#ffffff');P(lg,R(e[0])+2,R(e[1])-1,2,1,'#ffffff');});
     // 椰子樹、茅草傘、躺椅
     const palm=(lg,x,y,h,lean)=>{for(let k=0;k<=h;k++){const t=k/h;P(lg,R(x+lean*t*t),y-k,1,1,(k>>1)&1?'#8a6a42':'#a8844e');}
       const tx=R(x+lean),ty=y-h;for(const [dx,dy] of [[-8,3],[-6,-2],[0,-4],[6,-2],[8,3],[3,5],[-3,5]]){for(let s=1;s<=6;s++){const t=s/6;P(lg,R(tx+dx*t),R(ty+dy*t+2.4*t*t*(dy>0?1:1)-(1-t)*t*3),1,1,t<.5?'#3e8a3a':'#5eaa4a');}}
       P(lg,tx-1,ty+1,1,1,'#6a4a28');P(lg,tx+1,ty+1,1,1,'#6a4a28');};
     lounger(g,59,141);lounger(g,76,137);
     layerOn(D,lg=>{palm(lg,22,118,17,-2);palm(lg,42,103,19,-1);palm(lg,50,138,14,1);
       const th=(x,y)=>{P(lg,x,y-9,1,9,'#7a5a3a');cone(lg,x,y-13,y-9,6,2,(a,u)=>u<-.3?'#e0c070':u<.3?'#c8a454':'#a08040');};
       th(68,140);th(88,137);});
     lampPost(g,ng,...gp(N,28,16),8);lampPost(g,ng,...gp(N,12,30),8);
     polishFull(D.c,ax,ay,101);
     put('101_1_2',D.c,NN.c,ax,ay);}
  }catch(e){err.push('k101:'+e.message);}

  if(err.length){window.__b06err=err;console.error('b06',err);}
});
