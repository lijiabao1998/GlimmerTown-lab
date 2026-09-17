(window.__variants574=window.__variants574||[]).push(function b01(A){
  const SPR=A.SPR(), B=SPR.bld, sh=A.shade, HL=A.hashLocal479;
  /* ================= b01 交通港埠與大型場站：共用像素工具 ================= */
  const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  // 掃描線多邊形（整數像素、無反鋸齒）
  function poly(g,P,c){
    g.fillStyle=c;let y0=1e9,y1=-1e9;
    for(const p of P){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){
      const yc=y+.5,xs=[];
      for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];
        if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}
    }
  }
  function line(g,x0,y0,x1,y1,c){
    g.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
    const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
    for(let n=0;n<4000;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
  }
  function ellF(g,cx,cy,rx,ry,c){
    g.fillStyle=c;
    for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const t=(y+.5-cy)/ry;if(Math.abs(t)>1)continue;
      const hw=rx*Math.sqrt(1-t*t),xa=Math.round(cx-hw),xb=Math.round(cx+hw);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}
  }
  // 等距格座標：(a,b) → 畫面；(ox,oy)=佔地北頂點。a 向右下、b 向左下，1 單位＝2px 寬 1px 高
  const ISO=(ox,oy)=>(a,b)=>[ox+2*a-2*b,oy+a+b];
  // 平行四邊形頂面：底頂點 (sx,sy)（邊界座標），向左 la、向右 rb 像素
  function para(g,sx,sy,la,rb,c,eL,eD){
    sx=Math.round(sx);sy=Math.round(sy);
    const fL=x=>sy-1-((sx-x)>>1),fR=x=>sy-1-((x-sx+1)>>1);
    for(let x=sx-la;x<sx+rb;x++){
      const f=x<sx?fL(x):fR(x);
      const t=x<sx-la+rb?fR(x+la)-(la>>1)+1:fL(x-rb)-(rb>>1)+1;
      if(f<t)continue;
      g.fillStyle=c;g.fillRect(x,t,1,f-t+1);
      if(eL){g.fillStyle=eL;g.fillRect(x,t,1,1);}
      if(eD&&f>t){g.fillStyle=eD;g.fillRect(x,f,1,1);}
    }
  }
  // 等距長方體：S=前下頂點，la/rb=左/右牆長(px)，h=牆高；回傳牆頂四點
  function prism(g,S,la,rb,h,cL,cR,cT,noEdge){
    const sx=Math.round(S[0]),sy=Math.round(S[1]);
    if(cL){g.fillStyle=cL;for(let dx=1;dx<=la;dx++)g.fillRect(sx-dx,sy-(dx>>1)-h,1,h);}
    if(cR){g.fillStyle=cR;for(let dx=0;dx<rb;dx++)g.fillRect(sx+dx,sy-((dx+1)>>1)-h,1,h);}
    if(cT)para(g,sx,sy-h,la,rb,cT,noEdge?0:sh(cT,16),noEdge?0:sh(cT,-26));
    return {sx,sy,la,rb,h,S:[sx,sy-h],W:[sx-la,sy-h-la/2],E:[sx+rb,sy-h-rb/2],N:[sx-la+rb,sy-h-la/2-rb/2]};
  }
  // 牆面列：左牆 x∈[sx-la,sx-1]、右牆 x∈[sx,sx+rb-1]；hb=離地高度 → 該欄該高度的像素列
  const rowL=(P,x,hb)=>P.sy-1-((P.sx-x)>>1)-hb, rowR=(P,x,hb)=>P.sy-1-((x-P.sx+1)>>1)-hb;
  // 斜切窗（隨牆斜率）：face 'L'/'R'；x0=起始欄、w 欄寬、hb 窗底離地、ht 高
  function win(g,P,face,x0,w,hb,ht,c){g.fillStyle=c;for(let i=0;i<w;i++){const x=x0+i,r=face==='L'?rowL(P,x,hb):rowR(P,x,hb);g.fillRect(x,r-ht+1,1,ht);}}
  // 沿牆水平帶
  function band(g,P,face,hb,ht,c){if(face==='L')win(g,P,'L',P.sx-P.la,P.la,hb,ht,c);else win(g,P,'R',P.sx,P.rb,hb,ht,c);}
  // 拱窗（左牆，頂部半圓收角）
  function archWin(g,ng,P,face,x0,w,hb,ht,glass,frame,lit){
    win(g,P,face,x0-1,w+2,hb-1,ht+2,frame);
    win(g,P,face,x0,w,hb,ht-1,glass);
    win(g,P,face,x0+1,Math.max(1,w-2),hb+ht-1,1,glass);
    if(ng&&lit){win(ng,P,face,x0,w,hb,ht-1,lit);win(ng,P,face,x0+1,Math.max(1,w-2),hb+ht-1,1,lit);}
    win(g,P,face,x0,w,hb,1,sh(frame,-10));
  }
  // 山牆屋頂：ridge='b'＝屋脊平行右牆（山牆落在左牆）；ridge='a'＝屋脊平行左牆（山牆落在右牆）
  function gable(g,P,ridge,rise,cFront,cBack,cGable,cEdge){
    const S=P.S,W=P.W,E=P.E,N=P.N;
    if(ridge==='b'){
      const M=[(W[0]+S[0])/2,(W[1]+S[1])/2-rise],M2=[M[0]+P.rb,M[1]-P.rb/2];
      poly(g,[W,M,M2,N],cBack);poly(g,[S,M,M2,E],cFront);poly(g,[W,M,S],cGable);
      if(cEdge){line(g,M[0],M[1],M2[0],M2[1],cEdge);}
      return {M,M2};
    }else{
      const M=[(S[0]+E[0])/2,(S[1]+E[1])/2-rise],M2=[M[0]-P.la,M[1]-P.la/2];
      poly(g,[E,M,M2,N],cBack);poly(g,[S,M,M2,W],cFront);poly(g,[S,M,E],cGable);
      if(cEdge){line(g,M[0],M[1],M2[0],M2[1],cEdge);}
      return {M,M2};
    }
  }
  // 筒拱屋頂（剖面在左牆，沿 b 延伸）
  function vault(g,P,rise,cHi,cLo,cEnd){
    const S=P.S,W=P.W,V=[P.rb,-P.rb/2],n=P.la,pts=[];
    for(let i=0;i<=n;i++){const t=i/n;pts.push([W[0]+(S[0]-W[0])*t,W[1]+(S[1]-W[1])*t-rise*Math.sin(Math.PI*t)]);}
    for(let i=0;i<n;i++){const t=(i+.5)/n,p=pts[i],q=pts[i+1];
      const k=t<.45?0:(t<.7?1:2);const col=[cHi,sh(cHi,-14),cLo][k];
      poly(g,[p,[q[0]+.6,q[1]],[q[0]+.6+V[0],q[1]+V[1]],[p[0]+V[0],p[1]+V[1]]],col);}
    for(let i=0;i<n;i+=Math.max(2,n>>5)){const p=pts[i];line(g,p[0],p[1],p[0]+V[0],p[1]+V[1],sh(cHi,-22));}
    if(cEnd)poly(g,pts.concat([[S[0],S[1]],[W[0],W[1]]]),cEnd);
    return pts;
  }
  // 等距地面線（沿 a 或 b）
  function isoLine(g,F,a0,b0,a1,b1,c){const p=F(a0,b0),q=F(a1,b1);line(g,p[0],p[1],q[0],q[1],c);}
  // 鐵軌：沿 b 方向，軌距中心 a
  function trackB(g,F,a,b0,b1,bed){
    const pb=F(a+2.5,b1),la=10,rb=2*(b1-b0);para(g,pb[0],pb[1]+1,la,rb,bed);
    for(let b=b0+1;b<b1;b+=2)isoLine(g,F,a-2,b,a+2,b,'#5e4a38');
    isoLine(g,F,a-1,b0,a-1,b1,'#8e9098');isoLine(g,F,a+1,b0,a+1,b1,'#8e9098');
    const p=F(a-1,b0),q=F(a-1,b1);line(g,p[0],p[1]-1,q[0],q[1]-1,'#c6cad2');
    const p2=F(a+1,b0),q2=F(a+1,b1);line(g,p2[0],p2[1]-1,q2[0],q2[1]-1,'#c6cad2');
  }
  /* 後製鏈複刻：T479 建材紋理（與 v0 同函式同種子）＋貼地影橢圓（量自 v0：rgba≈(22,22,33,.16)） */
  function mat479(cv,k,key){
    const g=cv.getContext('2d'),w=cv.width,h=cv.height,seed=479000+k*17+(String(key).length*13);
    g.save();g.globalCompositeOperation='source-atop';
    const grad=g.createLinearGradient(0,0,w,h);
    grad.addColorStop(0,'rgba(255,236,194,.075)');grad.addColorStop(.52,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(28,35,43,.10)');
    g.fillStyle=grad;g.fillRect(0,0,w,h);
    const cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];
    const dens=Math.min(360,Math.max(10,Math.floor(w*h/520)));
    for(let i=0;i<dens;i++){const x=Math.floor(HL(seed,i,47901)*w),y=Math.floor(HL(seed,i,47902)*h);
      const rw=HL(seed,i,47903)<.74?1:2,rh=HL(seed,i,47904)<.88?1:2;
      g.fillStyle=cols[Math.floor(HL(seed,i,47905)*cols.length)%cols.length];g.fillRect(x,y,rw,rh);}
    const cat=[49,50,57,64,100,109,110,116,117,118,121,122,123].includes(k)?'I':'S';
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);
    tint.addColorStop(0,cat==='I'?'rgba(191,142,99,.045)':'rgba(222,213,190,.035)');
    tint.addColorStop(1,cat==='I'?'rgba(67,54,46,.09)':'rgba(43,49,54,.07)');g.fillStyle=tint;g.fillRect(0,0,w,h);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86),step=cat==='I'?9:8;
    g.strokeStyle=cat==='I'?'rgba(54,50,46,.10)':'rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=step){const off=Math.floor(HL(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    if(cat==='I'){g.strokeStyle='rgba(225,215,194,.055)';for(let x=Math.floor(w*.28);x<w*.75;x+=12){g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();}}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');
    g.fillStyle=ao;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();
  }
  const SHADOW={1:[7.5,5,28.5,9],2:[15,10,56,17.5],4:[23.5,19,88.5,36],5:[23.5,18,88.5,34.5]};
  function groundShadow(cv,ax,ay,sz,atop){
    const g=cv.getContext('2d'),s=SHADOW[sz];if(!s)return;
    g.save();if(atop)g.globalCompositeOperation='source-atop';
    ellF(g,ax+s[0],ay-s[1],s[2],s[3],'rgba(22,22,33,.16)');g.restore();
  }
  // 新畫布組：c=日圖、nc=夜圖、s=立體層（描邊用）
  function kit(w,h,ax,ay){const [c,g]=A.cv(w,h),[nc,ng]=A.cv(w,h),[s,sg]=A.cv(w,h);return {c,g,nc,ng,s,sg,w,h,ax,ay};}
  function finish(K,k,v,ol,sz){
    A.outlineSprite(K.s,ol[0],ol[1],ol[2]);K.g.drawImage(K.s,0,0);
    mat479(K.c,k,k+'_1_'+v);groundShadow(K.c,K.ax,K.ay,sz,false);
    B[k+'_1_'+v]={img:K.c,night:K.nc,ax:K.ax,ay:K.ay,w:K.w,h:K.h,smoke:[]};
  }
  // 地坪：v0 同色菱形＋邊光
  function ground(g,ax,ay,hw,col,cD,cL){A.dia(g,ax,ay-hw,hw,col);A.diaEdge(g,6,cD,ax,ay-hw,hw);A.diaEdge(g,9,cL,ax,ay-hw,hw);}
  // 四坡屋頂（沿長邊起脊）
  function hip(g,P,rise,cBL,cBR,cFR,cFL){
    const S=P.S,W=P.W,E=P.E,N=P.N,C=[(W[0]+E[0])/2,(W[1]+E[1])/2];
    if(P.rb>=P.la){const d=(P.rb-P.la)/2,R1=[C[0]+d,C[1]-d/2-rise],R2=[C[0]-d,C[1]+d/2-rise];
      poly(g,[W,N,R1,R2],cBL);poly(g,[N,E,R1],cBR);poly(g,[S,E,R1,R2],cFR);poly(g,[W,S,R2],cFL);return [R1,R2];}
    const d=(P.la-P.rb)/2,R1=[C[0]-d,C[1]-d/2-rise],R2=[C[0]+d,C[1]+d/2-rise];
    poly(g,[W,N,R1],cBL);poly(g,[N,E,R2,R1],cBR);poly(g,[S,E,R2],cFR);poly(g,[W,S,R2,R1],cFL);return [R1,R2];
  }
  // 凹入水池（石岸、內牆、波光）：a0..a1 × b0..b1
  function basin(g,F,a0,a1,b0,b1,d,seed){
    const S=F(a1,b1);para(g,S[0],S[1],2*(a1-a0),2*(b1-b0),'#4a8fb4');
    const off=(p,q,i,c)=>line(g,p[0],p[1]+i,q[0],q[1]+i,c);
    for(let i=1;i<=d;i++){off(F(a0,b0),F(a0,b1),i,'#7a7468');off(F(a0,b0),F(a1,b0),i,'#9a9488');}
    off(F(a0,b0),F(a0,b1),d+1,'#3a7aa0');off(F(a0,b0),F(a1,b0),d+1,'#3a7aa0');
    const n=Math.round((a1-a0)*(b1-b0)/40);
    for(let i=0;i<n;i++){const a=a0+2.5+HL(seed+i,a0,57401)*(a1-a0-5),b=b0+2.5+HL(i,seed+b1,57402)*(b1-b0-5);
      const p=F(a,b);R(g,p[0],p[1],3,1,i%3?'#72b2d4':'#9ad0e8');}
    for(const e of [[a0,b0,a1,b0],[a0,b0,a0,b1],[a0,b1,a1,b1],[a1,b0,a1,b1]])isoLine(g,F,e[0],e[1],e[2],e[3],'#d8d0c0');
  }
  // 小艇（沿 a 向，船頭朝 +a）：kind 'sail'|'motor'
  function boat(g,ng,F,a,b,len,kind,lift){
    const up=lift||0,L=(x,y)=>{const p=F(x,y);return [p[0],p[1]-up];};
    const hw=1.4,st=L(a,b-hw),sb=L(a,b+hw),mb=L(a+len-2,b+hw),mt=L(a+len-2,b-hw),bow=L(a+len,b);
    poly(g,[[st[0],st[1]+1],[sb[0],sb[1]+1],[mb[0],mb[1]+1],[bow[0],bow[1]+1],[mt[0],mt[1]+1]],'#3f6a8f');
    poly(g,[[st[0],st[1]-1],[sb[0],sb[1]-1],[mb[0],mb[1]-1],[bow[0],bow[1]-1],[mt[0],mt[1]-1]],'#f4f4ee');
    line(g,sb[0],sb[1],mb[0],mb[1],'#c8ccd0');line(g,mb[0],mb[1],bow[0],bow[1],'#c8ccd0');
    const c=L(a+len*.35,b+.2);
    if(kind==='sail'){R(g,c[0]-2,c[1]-4,5,2,'#d8dce4');const m=L(a+len*.55,b);R(g,m[0],m[1]-20,1,19,'#8a6a42');
      line(g,m[0],m[1]-5,c[0]-3,c[1]-3,'#8a6a42');R(g,c[0]-2,c[1]-7,m[0]-c[0]+2,2,'#2f5f8f');}
    else{R(g,c[0]-3,c[1]-6,7,4,'#e8e8e0');R(g,c[0]-2,c[1]-5,5,1,'#3a5060');R(g,c[0]-1,c[1]-8,3,2,'#d8dce4');}
  }
  // 等距圓錐台（塔身）：cx,by=地面圓心；colAt(y)→該高度基色；回傳頂面 y
  const fshade=(c,t)=>sh(c,t<-.55?10:t<-.1?4:t<.35?-8:t<.75?-20:-32);
  function frustum(g,cx,by,r0,r1,h,colAt,noCap){
    for(let dx=-r0;dx<=r0;dx++){const e=Math.round((r0/2)*Math.sqrt(Math.max(0,1-(dx/(r0+.5))**2)));if(e>0){g.fillStyle=fshade(colAt(0),dx/r0);g.fillRect(cx+dx,by,1,e);}}
    for(let y=0;y<h;y++){const r=Math.round(r0+(r1-r0)*y/h),base=colAt(y);for(let dx=-r;dx<=r;dx++){g.fillStyle=fshade(base,dx/Math.max(1,r));g.fillRect(cx+dx,by-1-y,1,1);}}
    if(!noCap)ellF(g,cx+.5,by-h,r1+.5,Math.max(1,r1/2),sh(colAt(h-1),14));
    return by-h;
  }
  // 地面波紋（決定性）
  function ripples(g,F,n,a0,a1,b0,b1,seed,c){for(let i=0;i<n;i++){const p=F(a0+HL(seed,i,57501)*(a1-a0),b0+HL(i,seed,57502)*(b1-b0));R(g,p[0],p[1],4,1,c);}}
  // 小貨箱（等距立方）
  function crate(g,S,la,rb,h,col){const P=prism(g,S,la,rb,h,col,sh(col,-30),sh(col,18),true);R(g,P.sx-la,rowL(P,P.sx-la,h>>1),la,1,sh(col,-16));return P;}
  // 抬升：螢幕點上移 up px
  const UP=(p,up)=>[p[0],p[1]-up];
  // 等距飛機：機首 (a,b)，機身沿 (ua,ub) 伸向機尾；len/span 格單位；lift 離地 px；th 機身厚；shd 地影色（畫在 g）
  function plane(g,sg,F,a,b,ua,ub,len,span,lift,liv,shd,th,prop){
    th=th||3;const wa=ub?1:0,wb=ua?1:0,hs=span/2;
    const P=(t,s,up)=>{const p=F(a+ua*t+wa*s,b+ub*t+wb*s);return [p[0],p[1]-(up||0)];};
    const t0=len*.34,sw=len*.18,tc=len*.1,t1=len*.54;
    const wingPts=(sgn,up)=>[P(t0,0,up),P(t0+sw,sgn*hs,up),P(t0+sw+tc,sgn*hs,up),P(t1,0,up)];
    const tailPts=(sgn,up)=>[P(len*.84,0,up),P(len*.94,sgn*hs*.38,up),P(len,sgn*hs*.38,up),P(len,0,up)];
    if(shd){const o=q=>q.map(p=>[p[0]+3,p[1]+1]);
      poly(g,o(wingPts(-1,0)),shd);poly(g,o(wingPts(1,0)),shd);
      for(let i=0;i<2;i++){const p=P(len*.05,0,0),q=P(len,0,0);line(g,p[0]+3,p[1]+1-i,q[0]+3,q[1]+1-i,shd);}}
    poly(sg,wingPts(-1,lift),'#b8bcc4');poly(sg,tailPts(-1,lift+th-1),'#b8bcc4');
    const eng=s=>{const p=P(t0+len*.1,s*hs*.46,lift-1);R(sg,p[0]-1,p[1],3,2,'#6a6e76');};
    eng(-1);
    const body=(up,c,s0)=>{const p=P(s0,0,up),q=P(len,0,up);line(sg,p[0],p[1],q[0],q[1],c);};
    body(lift,'#9aa0aa',len*.06);for(let i=1;i<th-1;i++)body(lift+i,'#e8e8e2',0);body(lift+th-1,'#f8f8f2',len*.08);
    {const p=P(len*.16,0,lift+th-2),q=P(len*.76,0,lift+th-2);line(sg,p[0],p[1],q[0],q[1],'#8aa6c0');}
    {const p=P(len*.05,0,lift+th-2);R(sg,p[0]-1,p[1],2,1,'#2a3a4a');}
    poly(sg,[P(len*.74,0,lift+th-1),P(len*.95,0,lift+th-1+th+3),P(len*1.02,0,lift+th-1+th+3),P(len,0,lift+th-1)],liv);
    poly(sg,tailPts(1,lift+th-1),'#d8dce4');
    eng(1);poly(sg,wingPts(1,lift),'#dfe2e8');
    {const q=wingPts(1,lift);line(sg,q[0][0],q[0][1],q[1][0],q[1][1],'#f4f4ee');}
    if(prop){const p=P(-.3,0,lift+1);R(sg,p[0],p[1]-2,1,5,'#3a3a42');}
  }
  // 跑道：para＋中線虛線＋端線＋邊燈（日有燈座、夜才亮）
  function runway(g,ng,F,a0,a1,b0,b1,ax,col){
    const S=F(a1,b1);para(g,S[0],S[1],2*(a1-a0),2*(b1-b0),col||'#5a5a5a');
    const L=(p,q,r,s,c)=>ax==='b'?isoLine(g,F,p,q,r,s,c):isoLine(g,F,q,p,s,r,c);
    const [c0,c1,d0,d1]=ax==='b'?[a0,a1,b0,b1]:[b0,b1,a0,a1];
    const m=(c0+c1)/2;
    for(let d=d0+5;d<d1-6;d+=5)L(m,d,m,d+2.5,'#e8e8e0');
    for(let c=c0+1.5;c<c1-1;c+=2){L(c,d0+1,c,d0+3,'#d8d8d0');L(c,d1-3,c,d1-1,'#d8d8d0');}
    for(let d=d0+2;d<=d1-2;d+=6)for(const c of [c0+.5,c1-.5]){const p=ax==='b'?F(c,d):F(d,c);R(g,p[0],p[1],2,1,'#c8c098');R(ng,p[0],p[1],2,1,'#ffb050');}
  }
  // 玻璃塔台：S=塔身南頂點（地面），shaftH 塔身高，cw 塔艙半寬（px）
  function ctower(sg,ng,S,sw,shaftH,cw,cols,radarY){
    const [cL,cR]=cols||['#d0d4dc','#a0a6b0'];
    if(radarY!=null){const d0=(cw-sw)/2;shaftH=Math.round(S[1]+d0-8-(cw+2)/2-radarY-3);} // 雷達座模式：塔高由雷達掛點反推
    const P0=prism(sg,S,sw,sw,shaftH,cL,cR,sh(cL,10));
    if(radarY!=null){ // 高塔身：右面電梯玻璃槽＋左面樓梯小窗＋中段接縫帶（低密度，打破長柱單調）
      win(sg,P0,'R',P0.sx+2,2,10,shaftH-18,'#7a8494');win(sg,P0,'R',P0.sx+2,1,10,shaftH-18,'#8e98a8');
      for(let hb=12;hb<shaftH-10;hb+=12)win(sg,P0,'L',P0.sx-4,2,hb,2,'#5a6878');
      band(sg,P0,'L',Math.round(shaftH*.58),2,sh(cL,-18));band(sg,P0,'R',Math.round(shaftH*.58),2,sh(cR,-18));
      win(ng,P0,'R',P0.sx+2,2,Math.round(shaftH*.3),3,'#ffe9a0');}
    const d=(cw-sw)/2,C=prism(sg,[S[0],S[1]-shaftH+d],cw,cw,7,'#8ac0e0','#5a90b8',null);
    band(sg,C,'L',0,1,'#5a6270');band(sg,C,'R',0,1,'#3a4250');
    for(let x=C.sx-cw+2;x<C.sx;x+=3)win(sg,C,'L',x,1,1,6,'#c8d8e8');
    for(let x=C.sx+2;x<C.sx+cw;x+=3)win(sg,C,'R',x,1,1,6,'#8aa8c0');
    band(ng,C,'L',2,4,'#aef0ff');band(ng,C,'R',2,4,'#8ad8f0');
    const r=prism(sg,[S[0],S[1]-shaftH+d+1-7],cw+2,cw+2,2,'#8a929c','#6a7078','#c8ccd4');
    if(radarY!=null){ // 雷達座：屋頂中心起一座小台，頂面落在繪製端雷達支架 (x135..136, y≤69) 下方
      const cy=Math.round(S[1]-shaftH+d-8-(cw+2)/2);
      prism(sg,[S[0],cy+1],2,2,cy+1-radarY,'#8a929c','#5a6068','#c8ccd4',true);
      R(sg,S[0]+3,cy-1,1,1,'#e05252');R(ng,S[0]+3,cy-1,1,1,'#ff5a4a');
      return C;}
    const top=[S[0]+1,S[1]-shaftH-7-2-sw/2+d-1];
    R(sg,top[0],top[1]-7,1,7,'#6a6e76');R(sg,top[0]-1,top[1]-9,2,2,'#e05252');R(ng,top[0]-1,top[1]-9,2,2,'#ff5a4a');
    return C;
  }
  function car(sg,F,a,b,col,along){const p=F(a,b);if(along==='b'){crate(sg,p,2,4,2,col);R(sg,p[0]-1,p[1]-4,4,1,sh(col,34));}
    else{crate(sg,p,4,2,2,col);R(sg,p[0]-3,p[1]-4,4,1,sh(col,34));}}

  /* ================= k19 機場（4×4；繪製端另疊雷達於畫布 (136,70)，故畫布框與 v0 完全同） ================= */
  try{
    const k=19,OL=[26,30,44],GND='#8a8a7a',GD='#78786a',GL='#9c9c8c',SHD='#737366';
    // v1：航站擴建——沿 a 長條兩層玻璃航廈＋雙空橋雙機＋高塔台＋陸側道路停車場（長低＋高瘦塔）
    {const K=kit(272,300,136,298),F=ISO(136,170),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,136,298,128,GND,GD,GL);
     runway(g,ng,F,3,11,8,62,'b');
     {const S=F(50,42);para(g,S[0],S[1],78,52,'#a2a298');}
     for(const a of [26,42]){isoLine(g,F,a,25,a,40,'#d8b840');}
     isoLine(g,F,12,41,50,41,'#d8b840');
     {const S=F(62,62);para(g,S[0],S[1],10,100,'#7a7a70');isoLine(g,F,57,12,57,62,'#a4a498');}
     {const S=F(54,62);para(g,S[0],S[1],32,28,'#6e6e66');for(const b of [52,57])isoLine(g,F,39,b,53,b,'#b8b8b0');}
     // 塔台（北角，最高；頂上雷達座接繪製端雷達 (136,70)，讓 v0 那顆浮空雷達在本變體落地）
     {const B0=prism(sg,F(6,6),8,8,6,'#c8ced6','#98a0aa','#d4d8de');
      win(sg,B0,'L',B0.sx-6,4,2,2,'#3a5060');win(sg,B0,'R',B0.sx+2,3,0,4,'#4a4a52');win(ng,B0,'L',B0.sx-6,4,2,2,'#ffe9a0');
      ctower(sg,ng,B0.S,6,0,12,null,70);}
     // 航廈
     const P=prism(sg,F(54,16),72,24,20,'#b8c8d8','#98a8b8','#7c8c9c');
     band(sg,P,'L',0,2,'#6a7888');band(sg,P,'R',0,2,'#5a6878');
     for(const hb of [3,11]){win(sg,P,'L',P.sx-70,68,hb,6,'#3a5060');}
     for(let x=P.sx-70,i=0;x<P.sx-2;x+=6,i++){win(sg,P,'L',x,1,3,14,'#c8d4e0');
       if(i%3!==1)win(ng,P,'L',x+1,5,3,6,'#ffe9a0');if(i%4===2)win(ng,P,'L',x+1,5,11,6,'#ffe9a0');}
     band(sg,P,'L',18,2,'#dfe6ee');band(sg,P,'R',18,2,'#b4c0cc');
     win(sg,P,'R',P.sx+2,20,13,3,'#2f6fc0');R(sg,P.sx+9,rowR(P,P.sx+9,14),5,1,'#f4f4ee');R(sg,P.sx+11,rowR(P,P.sx+11,15),1,1,'#f4f4ee');
     win(sg,P,'R',P.sx+8,8,0,9,'#3a5060');win(ng,P,'R',P.sx+8,8,0,9,'#ffe9a0');
     {const p=F(20,10),q=F(52,10);line(sg,p[0],p[1]-20,q[0],q[1]-20,'#b0c8dc');line(sg,p[0],p[1]-19,q[0],q[1]-19,'#6a7a8a');}
     crate(sg,UP(F(32,8),20),6,4,3,'#9aa8b8');crate(sg,UP(F(46,8),20),6,4,3,'#9aa8b8');
     // 空橋＋飛機
     for(const [a,liv,len,sp] of [[26,'#e05252',15,12],[42,'#2f6fc0',13,10]]){
       prism(sg,UP(F(a+1,24),5),4,16,4,'#b8bcc4','#8a8e96','#d0d4dc');
       const lg=F(a+.5,23.5);R(sg,lg[0],lg[1]-5,1,5,'#5a5e66');R(sg,lg[0]-1,lg[1],3,1,'#3a3a42');
       plane(g,sg,F,a,25,0,1,len,sp,3,liv,SHD,4);}
     // 地勤車
     car(sg,F,34,34,'#c0402e','b');car(sg,F,18,40,'#3a6ea5');
     // 停車場車輛
     for(const [a,b,c] of [[42,50,'#e05252'],[46,50,'#5aa0e8'],[52,50,'#e8e8e0'],[44,55,'#ffd455'],[50,55,'#3f9a58'],[40,60,'#5aa0e8']])car(sg,F,a,b,c,'b');
     finish(K,k,1,OL,4);}
    // v2：老式通用航空場——前緣沿 a 跑道＋兩座筒拱機庫（大小）＋拱窗航站樓頂塔艙＋螺旋槳機＋風向袋
    {const K=kit(272,300,136,298),F=ISO(136,170),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,136,298,128,GND,GD,GL);
     runway(g,ng,F,3,61,53,61,'a','#62625a');
     {const S=F(58,53);para(g,S[0],S[1],104,26,'#9e9e94');}
     isoLine(g,F,8,52,58,52,'#d8b840');
     // 雷達桁架塔（北角；紅白航空警示分段，頂台承接繪製端雷達 (136,70)）
     {const Pd=prism(sg,F(6,6),8,8,3,'#b8b4a8','#8a867a','#c8c4b8');
      const W0=[Pd.W[0]+2,Pd.W[1]],E0=[Pd.E[0]-2,Pd.E[1]],S0=[Pd.S[0],Pd.S[1]-2],ty=73;
      const W1=[134,ty],E1=[138,ty],S1=[136,ty+1];
      const at=(p,q,t)=>[Math.round(p[0]+(q[0]-p[0])*t),Math.round(p[1]+(q[1]-p[1])*t)];
      const n=10;
      for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,cb=i%2?'#a8a498':'#983820';
        line(sg,...at(W0,W1,t0),...at(S0,S1,t1),cb);line(sg,...at(S0,S1,t0),...at(E0,E1,t1),cb);}
      for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,cl=i%2?'#ece8dc':'#d04a3a',cd=i%2?'#c8c4b8':'#a83a2a';
        line(sg,...at(W0,W1,t0),...at(W0,W1,t1),cl);line(sg,...at(S0,S1,t0),...at(S0,S1,t1),cl);line(sg,...at(E0,E1,t0),...at(E0,E1,t1),cd);}
      prism(sg,[136,ty+1],3,3,2,'#8a929c','#5a6068','#b8bec6',true);
      R(sg,139,ty-1,1,1,'#e05252');R(ng,139,ty-1,1,1,'#ff5a4a');
      {const Q=prism(sg,F(9,3),5,4,5,'#e8e4d8','#b8b4a8','#9aa0a8');win(sg,Q,'R',Q.sx+1,2,0,4,'#5a4a3a');}}
     // 航站樓（後）＋樓頂塔艙
     {const P=prism(sg,F(54,14),36,20,14,'#e8e4d8','#c4bca8','#a8a498');
      band(sg,P,'L',0,2,'#a09888');band(sg,P,'R',0,2,'#8a8270');band(sg,P,'L',12,2,'#f4f0e8');band(sg,P,'R',12,2,'#d8d0c0');
      for(let i=0;i<4;i++)archWin(sg,ng,P,'L',P.sx-32+i*8,3,2,6,'#3a5060','#f4f0e8',i!==2?'#ffe9a0':null);
      for(let i=0;i<2;i++){win(sg,P,'R',P.sx+4+i*9,4,4,4,'#3a5060');if(i)win(ng,P,'R',P.sx+4+i*9,4,4,4,'#ffe9a0');}
      win(sg,P,'L',P.sx-3,2,2,7,'#5a4a3a');
      const C=prism(sg,UP(F(52,10),14),8,8,7,'#8ac0e0','#5a90b8',null);
      band(sg,C,'L',0,1,'#5a6270');band(sg,C,'R',0,1,'#3a4250');win(sg,C,'L',C.sx-4,1,1,6,'#c8d8e8');win(sg,C,'R',C.sx+4,1,1,6,'#8aa8c0');
      band(ng,C,'L',2,4,'#aef0ff');band(ng,C,'R',2,4,'#8ad8f0');
      prism(sg,UP(F(52.5,10.5),21),10,10,2,'#8a929c','#6a7078','#c8ccd4');
      const t=UP(F(50,8),23);R(sg,t[0],t[1]-5,1,5,'#6a6e76');R(sg,t[0]-1,t[1]-7,3,2,'#58c470');R(ng,t[0]-1,t[1]-7,3,2,'#7aff9a');}
     // 大機庫
     {const P=prism(sg,F(26,40),40,40,9,'#b4bcc4','#8a929c',null);
      band(sg,P,'L',0,2,'#7a828c');band(sg,P,'R',0,2,'#6a727c');
      for(let x=P.sx+3;x<P.sx+38;x+=6)win(sg,P,'R',x,1,2,6,'#7a828c');
      vault(sg,P,13,'#c8d0d8','#8a929c','#bcc4cc');
      win(sg,P,'L',P.sx-35,30,0,9,'#4a5058');for(let x=P.sx-30;x<P.sx-5;x+=5)win(sg,P,'L',x,1,0,9,'#5c636c');
      win(ng,P,'L',P.sx-29,18,0,3,'#ffd98a');
      win(sg,P,'L',P.sx-28,16,12,3,'#3a5060');for(let x=P.sx-24;x<P.sx-12;x+=4)win(sg,P,'L',x,1,12,3,'#bcc4cc');
      win(ng,P,'L',P.sx-27,3,12,3,'#ffe9a0');win(ng,P,'L',P.sx-19,3,12,3,'#ffe9a0');
      R(sg,P.S[0]-22,P.S[1]-11,5,1,'#e05252');}
     // 小機庫（暖灰）
     {const P=prism(sg,F(44,40),28,32,7,'#c0b8a8','#948c7c',null);
      band(sg,P,'L',0,2,'#847c6c');band(sg,P,'R',0,2,'#746c5c');
      vault(sg,P,9,'#d0c8b8','#9a927f','#c8c0b0');
      win(sg,P,'L',P.sx-24,20,0,7,'#4a4840');for(let x=P.sx-20;x<P.sx-6;x+=5)win(sg,P,'L',x,1,0,7,'#5c5a50');}
     // 飛機：機庫前一架、跑道上一架滑行
     plane(g,sg,F,16,43,0,1,9,12,2,'#e05252',SHD,2,true);
     plane(g,sg,F,38,57,1,0,10,13,2,'#2f6fc0',SHD,2,true);
     // 油罐車＋風向袋
     {const p=F(52,47);const T=prism(sg,p,8,3,4,'#e8c848','#b89828','#f4dc70',true);crate(sg,F(54,47),3,3,5,'#c0402e');}
     {const p=F(58,44);R(sg,p[0],p[1]-15,1,15,'#d8dce4');R(sg,p[0]+1,p[1]-15,3,2,'#f07830');R(sg,p[0]+4,p[1]-14,2,2,'#f4f0e8');R(sg,p[0]+6,p[1]-14,2,1,'#f07830');}
     finish(K,k,2,OL,4);}
  }catch(e){console.error('v574 k19',e);}

  // 筒拱屋頂（剖面在右牆，沿 a 延伸）
  function vaultR(g,P,rise,cHi,cLo,cEnd){
    const S=P.S,E=P.E,V=[-P.la,-P.la/2],n=P.rb,pts=[];
    for(let i=0;i<=n;i++){const t=i/n;pts.push([S[0]+(E[0]-S[0])*t,S[1]+(E[1]-S[1])*t-rise*Math.sin(Math.PI*t)]);}
    for(let i=n-1;i>=0;i--){const t=(i+.5)/n,p=pts[i],q=pts[i+1];
      const kk=t<.4?0:(t<.62?1:2);const col=[cHi,sh(cHi,-12),cLo][kk];
      poly(g,[p,[q[0]+.6,q[1]],[q[0]+.6+V[0],q[1]+V[1]],[p[0]+V[0],p[1]+V[1]]],col);}
    if(cEnd)poly(g,pts.concat([[E[0],E[1]],[S[0],S[1]]]),cEnd);
    return pts;
  }
  // 圓筒（by＝地面圓心 y；colAt(y) 離地高度→基色）
  function drum(g,cx,by,r,h,colAt){
    const ry=r/2;
    for(let dx=-r;dx<=r;dx++){const e=Math.round(ry*Math.sqrt(Math.max(0,1-(dx/(r+.5))**2)));
      for(let y=0;y<h;y++){const c=colAt(y,dx);if(!c)continue;g.fillStyle=fshade(c,dx/r);g.fillRect(cx+dx,by+e-1-y,1,1);}}
    return by-h;
  }
  const rimY=(r,dx)=>Math.round((r/2)*Math.sqrt(Math.max(0,1-(dx/(r+.5))**2)));
  // 穹頂（cy＝頂面圓心 y）
  function dome(g,cx,cy,r,hd,col){
    for(let y=Math.floor(cy-hd);y<=Math.ceil(cy+r/2);y++){
      const t=y+.5-cy;let u,w;
      if(t<0){u=t/hd;if(u<-1)continue;}else{u=t/(r/2);if(u>1)continue;}
      w=r*Math.sqrt(1-u*u);const lf=t<0?-u:0;
      for(let x=Math.round(cx-w);x<Math.round(cx+w)+1;x++){g.fillStyle=fshade(sh(col,Math.round(lf*12)),(x+.5-cx)/(r+.5));g.fillRect(x,y,1,1);}
    }
  }

  /* ================= k114 國際機場（5×5） ================= */
  try{
    const k=114,OL=[54,54,64],GND='#8f8b80',GD='#7d796e',GL='#a19d92',SHD='#77736a';
    // v1：弧頂主航廈＋中央指廊三機位＋高塔台＋立體停車樓＋貨運機庫
    {const K=kit(328,300,164,298),F=ISO(164,138),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,164,298,160,GND,GD,GL);
     runway(g,ng,F,3,13,4,76,'b','#6a6a72');
     {const S=F(17,76);para(g,S[0],S[1],8,140,'#7c7a7c');isoLine(g,F,15,8,15,74,'#c8a838');}
     {const S=F(66,60);para(g,S[0],S[1],98,80,'#a6a298');}
     for(const [a0,a1,b] of [[50,64,30],[50,64,50],[24,38,40]])isoLine(g,F,a0,b,a1,b,'#d8b840');
     // 主航廈（弧頂，沿 a）
     {const P=prism(sg,F(70,20),96,32,14,'#d8dce4','#b8bcc8',null);
      band(sg,P,'L',0,2,'#9aa0aa');band(sg,P,'R',0,2,'#8a909a');
      win(sg,P,'L',P.sx-94,92,2,10,'#6a9ac0');win(sg,P,'L',P.sx-94,92,7,1,'#c8d0dc');
      for(let x=P.sx-94,i=0;x<P.sx-2;x+=6,i++){win(sg,P,'L',x,1,2,10,'#eef0f4');
        if(i%3!==2)win(ng,P,'L',x+1,5,2,5,'#ffe9b0');if(i%2)win(ng,P,'L',x+1,5,8,4,'#ffd98a');}
      const pts=vaultR(sg,P,10,'#eef0f4','#a8acb8','#7fb0d8');
      for(let x=P.sx+4;x<P.sx+P.rb-2;x+=5){const hh=Math.round(10*Math.sin(Math.PI*(x-P.sx+.5)/P.rb));if(hh>1)win(sg,P,'R',x,1,14,hh,'#c8dcec');}
      win(ng,P,'R',P.sx+8,16,14,4,'#ffe9b0');
      line(sg,P.S[0],P.S[1],P.W[0],P.W[1],'#f8f8fa');
      win(sg,P,'R',P.sx+9,14,0,8,'#3a5060');win(ng,P,'R',P.sx+10,12,0,7,'#ffe9a0');win(sg,P,'R',P.sx+7,18,8,1,'#f4f4f8');
      win(sg,P,'R',P.sx+3,5,9,3,'#2f6fc0');}
     // 西側機位（在指廊後方，先畫）
     plane(g,sg,F,38,40,-1,0,16,14,3,'#e05252',SHD,4);
     prism(sg,UP(F(40,38),5),4,4,4,'#b8bcc4','#8a8e96','#d0d4dc');
     // 中央指廊
     {const P=prism(sg,F(48,60),16,80,8,'#d8dce4','#b8bcc8','#c8ccd4');
      band(sg,P,'R',0,2,'#8a909a');band(sg,P,'L',0,2,'#9aa0aa');
      band(sg,P,'R',3,3,'#6a9ac0');for(let x=P.sx+2,i=0;x<P.sx+78;x+=5,i++){win(sg,P,'R',x,1,3,3,'#eef0f4');if(i%3)win(ng,P,'R',x+1,4,3,3,'#ffe9b0');}
      win(sg,P,'L',P.sx-13,10,3,3,'#6a9ac0');win(ng,P,'L',P.sx-12,8,3,3,'#ffe9b0');
      {const p=F(41,22),q=F(41,58);line(sg,p[0],p[1]-8,q[0],q[1]-8,'#e8ecf0');}}
     // 東側機位
     for(const [b,liv,len,sp] of [[30,'#2f6fc0',16,14],[50,'#e05252',15,13]]){
       const Bp=prism(sg,UP(F(51,b-2),5),6,4,4,'#b8bcc4','#8a8e96','#d0d4dc');
       const lg=F(50.5,b-2.5);R(sg,lg[0],lg[1]-5,1,5,'#5a5e66');R(sg,lg[0]-1,lg[1],3,1,'#3a3a42');
       plane(g,sg,F,50,b,1,0,len,sp,3,liv,SHD,4);
       if(b===30)ctower(sg,ng,F(76,30),6,72,14);}
     car(sg,F,56,40,'#e8c040');car(sg,F,30,52,'#c0402e','b');
     // 貨運機庫（西南）
     {const P=prism(sg,F(36,76),40,28,12,'#9aa0aa','#7a808a',null);
      band(sg,P,'L',0,2,'#6a707a');band(sg,P,'R',0,2,'#5a606a');
      for(let i=0;i<3;i++){const x=P.sx-37+i*12;win(sg,P,'L',x,9,0,9,'#5a6070');for(let j=2;j<9;j+=2)win(sg,P,'L',x,9,j,1,'#6a7080');
        win(sg,P,'L',x+2,5,10,1,'#e8e8d8');win(ng,P,'L',x+1,7,9,2,'#ffe9a8');}
      gable(sg,P,'a',7,'#7a808a','#6a707a','#9aa0aa','#b0b6c0');}
     // 立體停車樓（南）
     {const P=prism(sg,F(76,76),40,28,11,'#b8b8b0','#8e8e86','#a0a098');
      for(const hb of [2,7]){band(sg,P,'L',hb,3,'#4a4a48');band(sg,P,'R',hb,3,'#3a3a3a');}
      for(let x=P.sx-38;x<P.sx;x+=6)win(sg,P,'L',x,2,2,8,'#b8b8b0');for(let x=P.sx+4;x<P.sx+28;x+=6)win(sg,P,'R',x,2,2,8,'#8e8e86');
      {const FU=(a,b)=>UP(F(a,b),11);for(const [a,b,c] of [[62,66,'#e05252'],[66,66,'#5aa0e8'],[70,70,'#ffd455'],[62,72,'#e8e8e0']])car(sg,FU,a,b,c,'b');}
      for(const [a,b] of [[60,64],[74,64]]){const p=UP(F(a,b),11);R(sg,p[0],p[1]-6,1,6,'#6a6e76');R(sg,p[0]-1,p[1]-7,3,1,'#e8e8d8');R(ng,p[0]-1,p[1]-7,3,1,'#ffe9b0');}}
     finish(K,k,1,OL,5);}
    // v2：雙平行跑道＋圓形衛星廳（穹頂）＋高架捷運廊＋摺板屋頂陸側航廈＋蘑菇塔台
    {const K=kit(328,300,164,298),F=ISO(164,138),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,164,298,160,GND,GD,GL);
     runway(g,ng,F,4,76,3,11,'a','#6a6a72');runway(g,ng,F,4,76,69,77,'a','#6a6a72');
     {const S=F(10,69);para(g,S[0],S[1],8,116,'#7c7a7c');isoLine(g,F,8,12,8,68,'#c8a838');}
     {const S=F(62,66);para(g,S[0],S[1],104,104,'#a6a298');}
     {const c=F(30,40);ellF(g,c[0]+.5,c[1],30,15,'#b4b0a6');}
     for(const [a0,b0,a1,b1] of [[30,14,30,30],[30,50,30,66],[11,40,20,40]])isoLine(g,F,a0,b0,a1,b1,'#d8b840');
     // 蘑菇塔台（後方）
     {const p=F(72,14),cx=p[0],by=p[1];
      drum(sg,cx,by,3,56,()=>'#d8d4c8');
      drum(sg,cx,by-56,9,7,(y,dx)=>y<1?'#8a867a':(dx%3===0?'#b8d0e0':'#6a9ac0'));
      ellF(sg,cx+.5,by-63,9.5,4.5,'#9a968a');dome(sg,cx,by-64,8,3,'#d8d4c8');
      for(let dx=-8;dx<=8;dx++)if(dx%3)R(ng,cx+dx,by-56+rimY(9,dx)-1-5,1,5,'#aef0ff');
      R(sg,cx,by-75,1,8,'#6a6e76');R(sg,cx-1,by-77,2,2,'#e05252');R(ng,cx-1,by-77,2,2,'#ff5a4a');}
     // 北、西機位（衛星廳後方）
     prism(sg,UP(F(31,33),4),4,6,3,'#b8bcc4','#8a8e96','#d0d4dc');
     plane(g,sg,F,30,31,0,-1,14,12,3,'#2f6fc0',SHD,4);
     plane(g,sg,F,21,40,-1,0,12,11,3,'#e05252',SHD,3);
     // 衛星廳
     {const c=F(30,40),cx=c[0],by=c[1],r=22;
      const top=drum(sg,cx,by,r,11,(y,dx)=>y<2?'#9aa0aa':(y>=3&&y<8)?(dx%5===0?'#e8ecf0':'#6a9ac0'):'#d8dce4');
      for(let dx=-r+1;dx<r;dx++)if(dx%5)R(ng,cx+dx,by+rimY(r,dx)-1-7,1,5,(dx+40)%3?'#ffe9b0':'#ffd98a');
      dome(sg,cx,top,r,9,'#eef0f4');
      for(const f of [-.5,0,.5]){const x=Math.round(cx+f*r*.8);R(sg,x,top-Math.round(9*Math.sqrt(1-f*f*.64))+1,1,Math.round(5*Math.sqrt(1-f*f)),'#c4c8d0');}
      drum(sg,cx,top-9,3,3,()=>'#c8d0dc');ellF(sg,cx+.5,top-12,3.5,1.5,'#eef0f4');
      R(sg,cx,top-16,1,4,'#6a6e76');R(sg,cx,top-17,1,1,'#e05252');R(ng,cx,top-17,1,1,'#ff5a4a');}
     // 高架捷運廊
     for(const a of [46,56]){const p=F(a,41);R(sg,p[0]-1,p[1]-8,2,8,'#8a909a');}
     {const T=prism(sg,UP(F(62,42),8),44,8,5,'#d8dce4','#b8bcc8','#e8ecf0');
      band(sg,T,'L',1,3,'#6a9ac0');for(let x=T.sx-42;x<T.sx;x+=5)win(sg,T,'L',x,1,1,3,'#eef0f4');band(ng,T,'L',2,1,'#ffe9b0');}
     // 陸側航廈（摺板屋頂）
     {const P=prism(sg,F(76,58),28,80,14,'#d8d4c8','#b0aca0',null);
      band(sg,P,'L',0,2,'#8a867a');band(sg,P,'R',0,2,'#7a766a');
      band(sg,P,'R',3,8,'#5a7a98');for(let x=P.sx+1,i=0;x<P.sx+80;x+=4,i++){win(sg,P,'R',x,1,3,8,'#c4c0b4');if(i%4!==3)win(ng,P,'R',x+1,3,4,5,'#ffe9a0');}
      win(sg,P,'L',P.sx-22,16,0,9,'#3a5060');for(let x=P.sx-18;x<P.sx-6;x+=4)win(sg,P,'L',x,1,0,9,'#e8e4d8');win(ng,P,'L',P.sx-21,14,0,8,'#ffe9a0');
      win(sg,P,'L',P.sx-24,20,9,1,'#f4f0e8');
      const T=(a,b,up)=>UP(F(a,b),14+up);
      for(let i=0;i<5;i++){const b0=18+8*i,bm=b0+4,b1=b0+8;
        poly(sg,[T(76,b0,0),T(76,bm,6),T(62,bm,6),T(62,b0,0)],'#a29e92');
        poly(sg,[T(76,bm,6),T(76,b1,0),T(62,b1,0),T(62,bm,6)],'#e4e0d4');
        const p=T(76,bm,6),q=T(62,bm,6);line(sg,p[0],p[1],q[0],q[1],'#f4f0e4');}
      for(let i=0;i<5;i++){const b0=18+8*i;poly(sg,[T(76,b0,0),T(76,b0+8,0),T(76,b0+4,6)],'#bcb8ac');}}
     // 南機位
     prism(sg,UP(F(31,50),4),4,6,3,'#b8bcc4','#8a8e96','#d0d4dc');
     plane(g,sg,F,30,49,0,1,14,12,3,'#3f9a58',SHD,4);
     car(sg,F,44,56,'#e8c040','b');car(sg,F,16,30,'#c0402e');
     finish(K,k,2,OL,5);}
  }catch(e){console.error('v574 k114',e);}

  /* ================= k110 貨運站 ================= */
  try{
    const k=110,OL=[58,52,40];
    // v1：磚造貨棧＋月台雨棚＋箱車（低而長的山牆量體）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#a89878','#948466','#bcac8a');
     trackB(g,F,27,1,31,'#8c7e66');
     // 月台
     const PL=prism(sg,F(23,29),10,52,3,'#9a8a6a','#7a6a4c','#b4a482');
     for(let b=4;b<29;b+=3){const p=F(22.6,b);R(sg,p[0],p[1]-4,2,1,'#e8c040');}
     // 貨棧
     const P=prism(sg,F(17,28),26,48,20,'#b4745a','#8a5440',null);
     band(sg,P,'L',0,3,'#8a8478');band(sg,P,'R',0,3,'#6a6458');
     band(sg,P,'L',18,2,'#c89078');
     for(let i=0;i<3;i++){const x0=P.sx+6+i*15;win(sg,P,'R',x0-1,9,2,12,'#4a3a2e');win(sg,P,'R',x0,7,3,10,'#6a5240');
       win(sg,P,'R',x0+3,1,3,10,'#4a3a2e');}
     archWin(sg,K.ng,P,'L',P.sx-17,6,5,10,'#3a5060','#e8dcc0','#ffe9a0');
     gable(sg,P,'b',11,'#6e747e','#9aa0a8','#b4745a','#c8ccd4');
     {const M=[(P.W[0]+P.S[0])/2,(P.W[1]+P.S[1])/2];R(sg,M[0]-2,M[1]-6,3,2,'#3a5060');}
     // 雨棚（貨棧右牆伸出）
     for(const b of [6,16,26]){const p=F(22.5,b);R(sg,p[0],p[1]-15,1,12,'#6a6a72');}
     para(sg,F(23,28)[0],F(23,28)[1]-15,12,48,'#c8ccd4',sh('#c8ccd4',16),'#8a8e96');
     for(const b of [9,19]){const p=F(22,b);R(sg,p[0],p[1]-14,2,1,'#f0f0e0');R(ng,p[0]-1,p[1]-14,4,2,'#ffe9a0');}
     // 月台貨物
     crate(sg,F(21,26),4,4,5,'#c9884a');crate(sg,F(21.5,21),4,6,4,'#7be08a');
     {const p=F(21,12);R(sg,p[0]-3,p[1]-9,7,5,'#dbb42c');R(sg,p[0]-3,p[1]-4,2,2,'#3a3a42');R(sg,p[0]+2,p[1]-4,2,2,'#3a3a42');R(sg,p[0]+4,p[1]-12,1,8,'#6a6a72');}
     // 箱車
     {const S0=F(29.5,24);const C=prism(sg,[S0[0],S0[1]-3],9,30,11,'#5aa0e8','#4888c8','#7cb8f0');
      win(sg,C,'R',C.sx+11,8,1,9,'#3a78b0');win(sg,C,'R',C.sx+15,1,1,9,'#2c5e90');
      for(const d of [3,24]){const x=C.sx+d;R(sg,x,rowR(C,x,-2),5,2,'#2a2a32');}
      R(sg,C.sx-8,rowL(C,C.sx-8,-2),5,2,'#2a2a32');}
     // 棧板
     crate(sg,F(10,31),6,6,3,'#b08a5a');
     finish(K,k,1,OL,2);}
    // v2：貨櫃轉運場——跨軌龍門吊（高瘦骨架）＋貨櫃堆＋平車＋調度亭
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#a89878','#948466','#bcac8a');
     trackB(g,F,19,1,31,'#8c7e66');trackB(g,F,26,1,31,'#8c7e66');
     const CC=['#c9884a','#5aa0e8','#7be08a','#e05252'];
     const box=(a1,b1,la,rb,h,lift,col)=>{const S=F(a1,b1);const P=prism(sg,[S[0],S[1]-lift],la,rb,h,col,sh(col,-30),sh(col,20),true);
       for(let x=P.sx+2;x<P.sx+rb-1;x+=3)win(sg,P,'R',x,1,1,h-2,sh(col,-44));
       win(sg,P,'L',P.sx-la+1,la-2,h-2,1,sh(col,14));return P;};
     // 貨櫃堆（後排→前排）
     box(7,15,10,22,7,0,CC[1]);box(7,28,10,22,7,0,CC[3]);box(7,15,10,22,6,7,CC[2]);
     box(13,14,10,22,7,0,CC[0]);box(13,27,10,22,7,0,CC[2]);box(13,27,10,22,6,7,CC[1]);
     // 平車＋櫃
     {const S=F(28,27);const P=prism(sg,[S[0],S[1]-2],8,40,2,'#5a5a62','#3a3a42','#6a6a72',true);
      R(sg,P.sx+4,rowR(P,P.sx+4,-2),3,2,'#2a2a32');R(sg,P.sx+32,rowR(P,P.sx+32,-2),3,2,'#2a2a32');
      box(28,26,8,18,7,4,CC[3]);}
     // 龍門吊
     const Y='#e0a83a';
     const leg=(a,b)=>prism(sg,F(a+.5,b+.5),2,2,38,Y,sh(Y,-40),sh(Y,20),true);
     const girder=b=>{const S=F(31,b+1);prism(sg,[S[0],S[1]-38],36,4,4,Y,sh(Y,-40),sh(Y,24));
       const e=F(13,b);R(sg,e[0]+1,e[1]-44,2,2,'#e05252');R(ng,e[0]+1,e[1]-44,2,2,'#ff5a4a');};
     leg(14,9);leg(29,9);girder(9);
     {const t=F(19,9);// 吊具與吊掛貨櫃
      line(sg,t[0]-2,t[1]-36,t[0]-2,t[1]-20,'#3a3a42');line(sg,t[0]-8,t[1]-33,t[0]-8,t[1]-17,'#3a3a42');
      box(21,15,6,14,6,13,CC[1]);
      const S=F(21,21);prism(sg,[S[0],S[1]-37],8,26,4,'#8a8e96','#5a5e66','#aeb2ba');
      const L=F(20,19);R(sg,L[0],L[1]-35,2,1,'#f0f0e0');R(ng,L[0]-1,L[1]-35,4,2,'#ffe9a0');}
     leg(14,21);leg(29,21);girder(21);
     // 調度亭
     {const P=prism(sg,F(31,31),6,8,11,'#d8d4c8','#aaa498','#8a8e96');
      win(sg,P,'L',P.sx-4,3,0,6,'#6a5a48');band(sg,P,'R',6,3,'#2e4452');
      win(ng,P,'R',P.sx+1,6,6,3,'#ffd98a');}
     finish(K,k,2,OL,2);}
  }catch(e){console.error('v574 k110',e);}

  /* ================= k64 倉儲物流中心 ================= */
  try{
    const k=64,OL=[26,30,44];
    // v1：寬體配送中心——鋸齒天窗屋頂＋右牆五道裝卸門＋兩台半聯結車（胖低）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#8f8a80','#79746a','#a19c92');
     {const S=F(28,30);para(g,S[0],S[1],14,54,'#6e6a64');for(let b=6;b<28;b+=5)isoLine(g,F,21.5,b,27,b,'#e8d080');}
     const a0=3,a1=21,b0=3,b1=29,h=16;
     const P=prism(sg,F(a1,b1),36,52,h,'#9aa2b2','#6e7686','#b0b6c0',true);
     band(sg,P,'L',0,2,'#5a6270');band(sg,P,'R',0,2,'#4a505c');
     // 左牆：藍色招牌帶＋辦公玻璃帶
     win(sg,P,'L',P.sx-34,20,11,4,'#2f6fc0');win(sg,P,'L',P.sx-32,16,12,2,'#e8eef4');
     win(sg,P,'L',P.sx-12,10,4,4,'#3a5060');win(ng,P,'L',P.sx-12,10,4,4,'#ffe9a8');
     // 右牆：五道捲門＋門燈
     for(let i=0;i<5;i++){const x0=P.sx+3+i*10;win(sg,P,'R',x0,7,0,10,'#4a505c');
       for(let j=1;j<5;j++)win(sg,P,'R',x0,7,j*2,1,'#5c636f');
       win(sg,P,'R',x0+2,3,12,1,'#e8e8d8');if(i%2===0)win(ng,P,'R',x0+1,5,11,2,'#ffe9a8');}
     // 鋸齒天窗（後→前）
     for(let a=a0;a<a1;a+=6){const hi=5,up=[0,-h],p1=F(a,b0),p2=F(a,b1),q1=F(a+6,b0),q2=F(a+6,b1);
       poly(sg,[[p1[0],p1[1]-h],[p2[0],p2[1]-h],[q2[0],q2[1]-h-hi],[q1[0],q1[1]-h-hi]],'#b8bec8');
       poly(sg,[[q1[0],q1[1]-h-hi],[q2[0],q2[1]-h-hi],[q2[0],q2[1]-h],[q1[0],q1[1]-h]],'#4e6a82');
       line(sg,q1[0],q1[1]-h-hi,q2[0],q2[1]-h-hi,'#dde2e8');
       poly(sg,[[p2[0],p2[1]-h],[q2[0],q2[1]-h-hi],[q2[0],q2[1]-h]],'#9aa2b2');}
     // 半聯結車 ×2（拖車靠門）
     for(const bb of [9,24]){const T=prism(sg,F(27,bb),12,6,9,'#e8e8e0','#b8b8b0','#f4f4ee',true);
       win(sg,T,'L',T.sx-11,10,5,1,'#2f6fc0');
       R(sg,T.sx-10,rowL(T,T.sx-10,-1),3,2,'#26282c');R(sg,T.sx+2,rowR(T,T.sx+2,-1),3,2,'#26282c');
       const C=prism(sg,F(29.5,bb),5,6,7,'#c0402e','#8a2a20','#d05040',true);win(sg,C,'R',C.sx+1,4,4,2,'#3a5060');}
     // 叉車＋棧板
     {const p=F(26,31);R(sg,p[0]-3,p[1]-8,7,5,'#e0a83a');R(sg,p[0]-2,p[1]-3,2,2,'#26282c');R(sg,p[0]+2,p[1]-3,2,2,'#26282c');R(sg,p[0]+4,p[1]-11,1,8,'#6a7078');}
     crate(sg,F(19,31.5),6,4,3,'#b08a5a');crate(sg,F(15,31.5),6,4,5,'#b08a5a');
     finish(K,k,1,OL,2);}
    // v2：高架自動倉——高聳立體倉＋低層裝卸棟＋貨車場（高瘦＋附屬翼）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#8f8a80','#79746a','#a19c92');
     {const S=F(31,29);para(g,S[0],S[1],10,44,'#6e6a64');}
     const H=prism(sg,F(16,20),24,32,46,'#b8c0cc','#8a92a2','#c4cad2',false);
     for(let x=H.sx-22;x<H.sx;x+=4)win(sg,H,'L',x,1,3,38,'#a8b0bc');
     for(let x=H.sx+2;x<H.sx+31;x+=4)win(sg,H,'R',x,1,3,38,'#7a8292');
     band(sg,H,'L',38,5,'#2f6fc0');band(sg,H,'R',38,5,'#24569a');win(sg,H,'L',H.sx-19,12,40,2,'#e8eef4');
     band(sg,H,'L',0,3,'#6e7686');band(sg,H,'R',0,3,'#5a6270');
     {const p=H.N;R(sg,p[0]+6,p[1]+8,5,3,'#8d959c');R(sg,p[0]-4,p[1]+10,5,3,'#8d959c');}
     R(sg,H.W[0]+2,H.W[1]-2,2,2,'#e05252');R(ng,H.W[0]+2,H.W[1]-2,2,2,'#ff5a4a');
     const L=prism(sg,F(26,26),20,36,12,'#9aa2b2','#6e7686','#aab2bc',false);
     band(sg,L,'L',0,2,'#5a6270');band(sg,L,'R',0,2,'#4a505c');
     for(let i=0;i<3;i++){const x0=L.sx+4+i*11;win(sg,L,'R',x0,8,0,9,'#4a505c');for(let j=1;j<4;j++)win(sg,L,'R',x0,8,j*2,1,'#5c636f');
       win(sg,L,'R',x0+3,2,10,1,'#e8e8d8');win(ng,L,'R',x0+2,4,9,2,'#ffe9a8');}
     win(sg,L,'L',L.sx-17,14,5,3,'#3a5060');win(ng,L,'L',L.sx-17,14,5,3,'#ffe9a8');
     // 樓梯塔（貼高架倉左牆）
     {const T=prism(sg,F(9,23),6,6,30,'#c4cad2','#949cac','#d0d6de');for(let hb=6;hb<28;hb+=7)win(sg,T,'L',T.sx-5,4,hb,2,'#3a5060');
      win(ng,T,'L',T.sx-5,4,20,2,'#ffe9a8');}
     // 貨車
     {const T=prism(sg,F(31,15),10,6,8,'#e8e8e0','#b8b8b0','#f4f4ee',true);win(sg,T,'L',T.sx-9,8,4,1,'#2f6fc0');
      R(sg,T.sx-8,rowL(T,T.sx-8,-1),3,2,'#26282c');}
     {const p=F(29,28);R(sg,p[0]-3,p[1]-8,7,5,'#e0a83a');R(sg,p[0]-2,p[1]-3,2,2,'#26282c');R(sg,p[0]+2,p[1]-3,2,2,'#26282c');R(sg,p[0]+4,p[1]-11,1,8,'#6a7078');}
     crate(sg,F(8,30),6,6,4,'#b08a5a');crate(sg,F(12,31),4,4,3,'#b08a5a');
     finish(K,k,2,OL,2);}
  }catch(e){console.error('v574 k64',e);}

  /* ================= k91 貿易站 ================= */
  try{
    const k=91,OL=[58,52,40];
    const flag=(g,x,y,hgt,col)=>{R(g,x,y-hgt,1,hgt,'#8a6a42');poly(g,[[x+1,y-hgt],[x+9,y-hgt+3],[x+1,y-hgt+6]],col);};
    // v1：筒拱關棧——拱頂貨棧＋拱窗拱門＋桅桿吊臂＋貨箱堆
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#a89878','#948466','#bcac8a');
     trackB(g,F,28,2,30,'#8c7e66');
     prism(sg,F(22,27),8,44,2,'#9a8a6a','#77684c','#b09a72');
     const P=prism(sg,F(18,27),28,40,13,'#d8c8a0','#a89470',null);
     band(sg,P,'L',0,3,'#9a8a6a');band(sg,P,'R',0,3,'#7a6a4c');band(sg,P,'L',12,1,'#efe4c8');band(sg,P,'R',12,1,'#c8b890');
     for(let i=0;i<4;i++)archWin(sg,ng,P,'R',P.sx+4+i*9,4,4,6,'#3a5060','#efe4c8',i%2?'#ffd98a':null);
     const pts=vault(sg,P,12,'#86b09c','#5a806c','#d8c8a0');
     {const cx=P.sx-16;archWin(sg,ng,P,'L',cx,8,0,10,'#5a3a24','#efe4c8',null);win(sg,P,'L',cx+3,2,0,9,'#3a2818');
      archWin(sg,ng,P,'L',P.sx-26,3,4,5,'#3a5060','#efe4c8','#ffd98a');archWin(sg,ng,P,'L',P.sx-6,3,4,5,'#3a5060','#efe4c8',null);
      const top=pts[P.la>>1];R(sg,top[0]-2,top[1]+4,4,3,'#efe4c8');R(sg,top[0]-1,top[1]+5,2,1,'#3a5060');
      R(ng,top[0]-1,top[1]+5,2,1,'#ffd98a');
      flag(sg,top[0]+1,top[1],14,'#e05252');
      const lp=F(18.4,21.5);R(sg,lp[0]-1,lp[1]-13,2,1,'#f0f0e0');R(ng,lp[0]-2,lp[1]-13,4,2,'#ffe9a0');}
     // 桅桿吊臂（右後，吊鉤伸到軌道上方）
     {const m=F(25,4);prism(sg,[m[0]+1,m[1]],2,2,40,'#6a6a72','#4a4a52','#8a8a92',true);
      const tip=F(27,13);line(sg,m[0],m[1]-38,tip[0],tip[1]-30,'#6a6a72');line(sg,m[0],m[1]-37,tip[0],tip[1]-29,'#4a4a52');
      line(sg,tip[0],tip[1]-29,tip[0],tip[1]-18,'#3a3a42');
      prism(sg,[tip[0]+2,tip[1]-11],5,5,5,'#c9884a','#9a6030','#e0a870',true);
      R(sg,m[0],m[1]-41,2,2,'#e05252');R(ng,m[0],m[1]-41,2,2,'#ff5a4a');}
     // 貨箱堆
     crate(sg,F(26,22),6,6,7,'#c9884a');
     {const S=F(26,22);crate(sg,[S[0],S[1]-7],6,6,6,'#5aa0e8');}
     crate(sg,F(26,29),6,8,7,'#7be08a');crate(sg,F(29.5,17),5,6,5,'#c9884a');
     finish(K,k,1,OL,2);}
    // v2：露天集散棚——長條四坡瓦頂開放市棚＋高聳信號旗桿＋帳房小屋
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#a89878','#948466','#bcac8a');
     {const S=F(18,27);para(g,S[0],S[1],28,50,'#b8a888');}
     const post=(a,b)=>{const p=F(a,b);R(sg,p[0],p[1]-12,2,12,'#6a4a32');R(sg,p[0],p[1]-12,1,12,'#8a6442');};
     const sack=(a,b)=>{const p=F(a,b);ellF(sg,p[0],p[1]-3,3,2.5,'#d8c8a0');R(sg,p[0]-2,p[1]-2,5,1,'#b8a47c');};
     const barrel=(a,b)=>{const p=F(a,b);R(sg,p[0]-2,p[1]-7,5,7,'#8a5a34');R(sg,p[0]-2,p[1]-5,5,1,'#5a3a24');R(sg,p[0]-2,p[1]-7,5,1,'#a87a4a');};
     // 信號旗桿（後右）
     {const p=F(25,8),top=[p[0],p[1]-56];
      line(sg,top[0],top[1]+4,F(21,5)[0],F(21,5)[1],'#7a6a58');line(sg,top[0]+1,top[1]+4,F(29,11)[0],F(29,11)[1],'#7a6a58');
      R(sg,p[0]-1,top[1],2,56,'#8a6a42');R(sg,p[0]-1,top[1],1,56,'#a88458');
      const y1=top[1]+10;line(sg,p[0]-7,y1+3,p[0]+7,y1-4,'#6a4a32');
      R(sg,p[0]-7,y1+4,3,4,'#e05252');R(sg,p[0]-2,y1+2,3,4,'#e8c040');R(sg,p[0]+5,y1-2,3,4,'#5aa0e8');
      poly(sg,[[p[0]+1,top[1]],[p[0]+9,top[1]+2],[p[0]+1,top[1]+5]],'#e05252');
      R(sg,p[0]-1,top[1]-2,2,2,'#f0f0e0');R(ng,p[0]-1,top[1]-2,2,2,'#ffe9a0');}
     crate(sg,F(29,15),6,6,6,'#c9884a');barrel(27,18);
     // 市棚（後排柱→貨物→前排柱→屋頂）
     post(5.5,3.5);post(14.5,3.5);post(5.5,10.5);post(5.5,17.5);
     crate(sg,F(12,8),6,6,6,'#c9884a');barrel(11,12);sack(10,15);sack(12,16);crate(sg,F(13,21),6,6,6,'#5aa0e8');barrel(12,19);crate(sg,F(9,20),4,4,4,'#7be08a');
     post(14.5,10.5);post(14.5,17.5);post(14.5,23.5);post(5.5,23.5);
     {const S=F(15.5,24.5),P=prism(sg,[S[0],S[1]-12],22,44,2,'#6a4a32','#4a3222',null);
      hip(sg,P,9,'#d87a60','#b05a44','#9a4230','#c8604a');}
     // 手推車
     {const p=F(20,19);R(sg,p[0]-4,p[1]-7,8,4,'#a8804e');R(sg,p[0]-4,p[1]-7,8,1,'#c8a070');R(sg,p[0]-1,p[1]-3,3,3,'#4a3a2a');R(sg,p[0]+4,p[1]-9,4,1,'#6a4a32');
      crate(sg,[p[0]-1,p[1]-7],4,4,3,'#7be08a');}
     // 帳房（前左）
     {const P=prism(sg,F(23,31),12,12,10,'#d9c4a0','#b09a78',null);
      win(sg,P,'R',P.sx+3,3,0,7,'#5a3a24');win(sg,P,'R',P.sx+8,3,4,3,'#3a5060');win(ng,P,'R',P.sx+8,3,4,3,'#ffd98a');
      win(sg,P,'L',P.sx-8,4,4,3,'#3a5060');win(ng,P,'L',P.sx-8,4,4,3,'#ffd98a');
      gable(sg,P,'a',6,'#9a6a44','#7a4a2c','#b09a78');}
     sack(20,30);barrel(26,30);
     finish(K,k,2,OL,2);}
  }catch(e){console.error('v574 k91',e);}

  /* ================= k90 遊艇碼頭 ================= */
  try{
    const k=90,OL=[58,60,52];
    const lamp=(g,ng,F,a,b,hgt)=>{const p=F(a,b);R(g,p[0],p[1]-hgt,1,hgt,'#5a5a62');R(g,p[0]-1,p[1]-hgt-2,3,2,'#f0f0e0');R(ng,p[0]-1,p[1]-hgt-2,3,2,'#ffe9b0');};
    // v1：遊艇俱樂部——兩層白色會所＋四坡藍瓦＋木棧道＋雙指狀浮橋＋四艇
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#b8a888','#a29272','#c9ba9a');
     basin(g,F,14,30,3,30,3,90);
     {const S=F(14,31);para(g,S[0],S[1],6,56,'#b89868');for(let b=2;b<31;b+=2)isoLine(g,F,11,b,14,b,'#96865f');}
     boat(sg,ng,F,16,7.5,9,'sail');
     prism(sg,F(27,12),26,2,1,'#b89868','#8a6a42','#c8a878',true);lamp(sg,ng,F,26.5,11,8);
     boat(sg,ng,F,16,15,8,'motor');boat(sg,ng,F,16,18.5,10,'sail');
     prism(sg,F(27,23),26,2,1,'#b89868','#8a6a42','#c8a878',true);lamp(sg,ng,F,26.5,22,8);
     boat(sg,ng,F,16,26,8,'motor');
     // 會所後方草坪＋灌木
     {const S=F(11,13);para(g,S[0],S[1],16,18,'#8aa86a');const t=F(6,7);ellF(sg,t[0],t[1]-4,4,3.5,'#5f8f4a');R(sg,t[0]-2,t[1]-6,2,1,'#8ab870');
      const t2=F(9,11);ellF(sg,t2[0],t2[1]-3,3,2.5,'#5f8f4a');}
     // 會所
     const P=prism(sg,F(11,29),18,28,19,'#ece6d8','#c4bca8',null);
     band(sg,P,'L',0,2,'#a8a090');band(sg,P,'R',0,2,'#8a8270');
     band(sg,P,'L',9,2,'#8a6a42');band(sg,P,'R',9,2,'#6a4e30');band(sg,P,'L',11,1,'#b89868');band(sg,P,'R',11,1,'#8a6a42');
     for(let i=0;i<3;i++){const x=P.sx-16+i*5;win(sg,P,'L',x,3,2,5,'#7fb0d8');if(i!==1)win(ng,P,'L',x,3,2,5,'#ffd98a');
       win(sg,P,'L',x,3,13,4,'#7fb0d8');if(i===1)win(ng,P,'L',x,3,13,4,'#ffd98a');}
     for(let i=0;i<4;i++){const x=P.sx+3+i*6;win(sg,P,'R',x,3,13,4,'#5a88b0');win(sg,P,'R',x,3,2,5,'#5a88b0');}
     win(ng,P,'R',P.sx+9,3,2,5,'#ffd98a');win(ng,P,'R',P.sx+21,3,13,4,'#ffd98a');
     hip(sg,P,9,'#6e98bc','#4a7292','#2f5a7a','#3f6a8f');
     // 旗桿
     {const p=F(13,15);R(sg,p[0],p[1]-28,1,28,'#d8dce4');poly(sg,[[p[0]+1,p[1]-28],[p[0]+9,p[1]-26],[p[0]+1,p[1]-24]],'#e05252');R(sg,p[0]+1,p[1]-26,4,1,'#f0f0ea');}
     {const p=F(13,27);ellF(sg,p[0],p[1]-3,2.5,2.5,'#e04848');R(sg,p[0]-1,p[1]-4,2,2,'#f0f0ea');}
     finish(K,k,1,OL,2);}
    // v2：修艇場——大船屋（山牆開口朝水）＋下水滑道與船架＋乾式艇架
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,'#b8a888','#a29272','#c9ba9a');
     basin(g,F,19,30,3,30,3,40);
     {const S=F(25,16);para(g,S[0],S[1],18,12,'#b0aca0');isoLine(g,F,16,11,25,11,'#6a6a72');isoLine(g,F,16,14,25,14,'#6a6a72');}
     // 船屋
     const P=prism(sg,F(16,20),26,30,16,'#d9c4a0','#b09a78',null);
     band(sg,P,'L',0,2,'#9a8a6a');band(sg,P,'R',0,2,'#7a6a4c');
     for(let x=P.sx-24;x<P.sx;x+=3)win(sg,P,'L',x,1,2,13,'#c8b08a');
     win(sg,P,'R',P.sx+7,16,0,14,'#efe4c8');win(sg,P,'R',P.sx+8,14,0,13,'#2a2420');
     win(sg,P,'L',P.sx-20,4,7,4,'#3a5060');win(ng,P,'L',P.sx-20,4,7,4,'#ffd98a');
     win(sg,P,'L',P.sx-10,4,7,4,'#3a5060');
     gable(sg,P,'a',13,'#e89a4a','#c07a3a','#b09a78','#f0b070');
     // 船架上的帆船（滑道）
     {const c1=F(20,11),c2=F(20,14);R(sg,c1[0],c1[1]-4,1,4,'#5a5a62');R(sg,c2[0],c2[1]-4,1,4,'#5a5a62');
      boat(sg,ng,F,17,12.5,9,'sail',4);}
     lamp(sg,ng,F,24,9,9);
     // 乾式艇架（兩層）
     {const posts=[[5,23],[15,23],[5,30],[15,30]];
      const pp=(a,b)=>{const p=F(a,b);R(sg,p[0],p[1]-22,1,22,'#6a7078');};
      pp(5,23);pp(15,23);
      for(const hh of [9,19]){const S=F(15,30);para(sg,S[0],S[1]-hh,20,14,'#8a9098','#aab0b8','#5a6068');
        boat(sg,ng,F,6,26.5,8,hh===9?'motor':'motor',hh+2);}
      pp(5,30);pp(15,30);}
     boat(sg,ng,F,21,22,8,'motor');boat(sg,ng,F,21,26.5,9,'sail');
     finish(K,k,2,OL,2);}
  }catch(e){console.error('v574 k90',e);}

  /* ================= k97 釣魚碼頭（1×1） ================= */
  try{
    const k=97,OL=[52,66,58];
    const lamp=(g,ng,x,y,hgt)=>{R(g,x,y-hgt,1,hgt,'#5a5a62');R(g,x-1,y-hgt-2,3,2,'#e8e8d8');R(ng,x-1,y-hgt-2,3,2,'#ffe9b0');};
    // v1：L 形木棧橋＋岸邊餌料小屋＋繫泊小舟
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,110,32,'#8fa0a0','#7c8d8d','#a2b3b3');
     {const S=F(4,16);para(g,S[0],S[1],8,32,'#b8a888');isoLine(g,F,4,0,4,16,'#d0c4a8');}
     ripples(g,F,6,6,15,1,15,970,'#5a9ec8');
     // 小屋
     {const P=prism(sg,F(4.5,8),7,14,10,'#a8885c','#7a6040',null);
      win(sg,P,'L',P.sx-5,3,4,3,'#3a5060');win(ng,P,'L',P.sx-5,3,4,3,'#ffd98a');
      win(sg,P,'R',P.sx+3,3,0,7,'#4a3424');win(sg,P,'R',P.sx+8,4,6,2,'#e8e0cc');R(sg,P.sx+9,rowR(P,P.sx+9,6),2,1,'#5a9ec8');
      gable(sg,P,'a',5,'#9ab8c4','#6a8a98','#7a6040','#c8dce4');}
     // 棧橋（轉角段→主段）
     prism(sg,F(15,9),8,10,2,'#a8885c','#7a6040','#c0a070',true);
     const D=prism(sg,F(14,12),18,6,2,'#a8885c','#7a6040','#c0a070',true);
     for(let a=6;a<14;a+=2)isoLine(sg,F,a,9,a,12,'#a8885c');
     for(const a of [7,11]){const p=F(a,12);R(sg,p[0],p[1],1,2,'#5a4a36');}
     {const p=F(15,6.5);R(sg,p[0],p[1],1,2,'#5a4a36');}
     {const p=F(14,9);lamp(sg,ng,p[0],p[1]-2,11);}
     {const p=F(9,10.5);R(sg,p[0]-1,p[1]-6,3,3,'#8a8a92');R(sg,p[0]-1,p[1]-6,3,1,'#aab0b8');}
     // 小舟
     {const a=F(7,14),b=F(12,14);poly(sg,[[a[0],a[1]-1],[b[0]-1,b[1]-3],[b[0]+2,b[1]-1],[b[0]-1,b[1]+1],[a[0]+1,a[1]+2]],'#8a5a34');
      poly(sg,[[a[0]+2,a[1]-1],[b[0]-1,b[1]-2],[b[0]-1,b[1]],[a[0]+2,a[1]+1]],'#b08050');}
     finish(K,k,1,OL,1);}
    // v2：石砌防波堤釣台＋紅白航標燈柱＋消波塊
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,110,32,'#8fa0a0','#7c8d8d','#a2b3b3');
     ripples(g,F,7,1,15,1,15,971,'#5a9ec8');
     const P=prism(sg,F(10,15),10,28,5,'#a8a498','#7e7a6e','#bab6aa');
     for(let x=P.sx+3;x<P.sx+27;x+=6)win(sg,P,'R',x,1,0,5,'#6a665a');
     for(let x=P.sx-9;x<P.sx;x+=5)win(sg,P,'L',x,1,0,5,'#8e8a7e');
     for(let b=4;b<15;b+=4)isoLine(sg,F,5.2,b,9.8,b,'#a09c90');
     // 航標燈柱（堤頭）
     {const p=F(7.5,2.5),by=p[1]-5;
      const top=frustum(sg,p[0],by,3,2,18,y=>(y>=6&&y<10)||(y>=14)?'#d04a3a':'#f0ece0');
      R(sg,p[0]-2,top-4,5,4,'#3a4a44');R(sg,p[0]-1,top-4,3,3,'#8ad8a8');R(sg,p[0]-2,top-6,5,2,'#2a2a32');R(sg,p[0],top-8,1,2,'#2a2a32');
      R(ng,p[0]-1,top-4,3,3,'#5aff8a');}
     // 消波塊
     const tp=(a,b)=>{const p=F(a,b);R(sg,p[0]-2,p[1]-2,5,2,'#a8a8a0');R(sg,p[0]-1,p[1]-4,3,2,'#b8b8b0');R(sg,p[0]-1,p[1]-4,1,1,'#d4d4cc');R(sg,p[0]+1,p[1]-2,2,2,'#86867e');};
     tp(13,4);tp(13.5,8.5);tp(13,12.5);tp(12,16);
     // 欄杆樁＋釣客凳＋桶
     for(let b=5;b<15;b+=3){const p=F(5.6,b);R(sg,p[0],p[1]-9,1,4,'#5a5a62');}
     {const p=F(9,10);R(sg,p[0]-2,p[1]-8,4,2,'#c8a050');R(sg,p[0]-2,p[1]-6,1,1,'#8a6a42');R(sg,p[0]+1,p[1]-6,1,1,'#8a6a42');
      const q=F(8.5,13);R(sg,q[0]-1,q[1]-9,3,3,'#8a8a92');}
     {const p=F(9,6);R(sg,p[0],p[1]-12,1,6,'#5a5a62');R(sg,p[0]-1,p[1]-14,3,2,'#e8e8d8');R(ng,p[0]-1,p[1]-14,3,2,'#ffe9b0');}
     finish(K,k,2,OL,1);}
  }catch(e){console.error('v574 k97',e);}

  /* ================= k79 碼頭亭（1×1） ================= */
  try{
    const k=79,OL=[40,30,20];
    // v1：渡輪售票亭——白木低矮亭＋紅四坡頂＋條紋雨遮售票窗＋時刻牌＋長椅（胖低）
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,110,32,'#8f9aa0','#7b848a','#a4adb3');
     ripples(g,F,4,12,16,2,15,790,'#5a9ec8');
     for(const b of [3,14]){const p=F(14.5,b);R(sg,p[0],p[1]-4,3,4,'#6a5a42');}
     const P=prism(sg,F(12,12),16,18,13,'#e8e0cc','#b8ae98',null);
     band(sg,P,'L',0,3,'#9b6636');band(sg,P,'R',0,3,'#7a4a2b');
     {const x=P.sx-12;win(sg,P,'L',x,7,5,5,'#3a5060');win(ng,P,'L',x,7,5,5,'#ffe9a8');win(sg,P,'L',x-1,9,4,1,'#9b6636');
      for(let i=0;i<9;i++)win(sg,P,'L',x-1+i,1,10,2,i%2?'#f4f0e8':'#e63946');}
     {const x=P.sx+4;win(sg,P,'R',x,8,4,6,'#2a3a44');for(let j=0;j<3;j++)win(sg,P,'R',x+1,6,5+j*2,1,'#d8dce4');
      win(sg,P,'R',x+2,4,11,1,'#e8e8d8');win(ng,P,'R',x+1,6,10,1,'#ffe9a8');}
     {const x=P.sx+15;ellF(sg,x,rowR(P,x,7),2.5,2.5,'#e63946');R(sg,x-1,rowR(P,x,8),2,2,'#f4f0e8');}
     {const S=F(13,13),Q=prism(sg,[S[0],S[1]-13],20,20,2,'#7a4a2b','#5a3420',null);
      const r=hip(sg,Q,9,'#df5e48','#aa3828','#9e3324','#c94a36');
      R(sg,r[0][0],r[0][1]-14,1,14,'#5c4033');R(sg,r[0][0]+1,r[0][1]-14,5,2,'#e63946');R(sg,r[0][0]+1,r[0][1]-12,5,1,'#5ec8ff');}
     {const B=prism(sg,F(9,15.5),8,2,3,'#a67c52','#8c6239','#b89060',true);}
     finish(K,k,1,OL,1);}
    // v2：雙重簷霧鐘亭——石台座＋四柱＋銅鐘＋上下兩層紅瓦（高、層疊輪廓）
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,110,32,'#8f9aa0','#7b848a','#a4adb3');
     ripples(g,F,4,13,16,2,15,791,'#5a9ec8');
     prism(sg,F(13,13),20,20,4,'#b8b4a8','#8a867a','#c8c4b8');
     {const p=F(13,9);prism(sg,[p[0]-3,p[1]+2],4,6,2,'#b8b4a8','#8a867a','#c8c4b8',true);}
     // 柱立於四邊中點（不在對角線上），讓正中低垂的銅鐘從簷下露出來
     const PH=21,post=(a,b)=>{const p=F(a,b);R(sg,p[0],p[1]-4-PH,2,PH,'#7a4a2b');R(sg,p[0],p[1]-4-PH,1,PH,'#9b6636');};
     post(8,4.2);post(4.2,8);
     {const c=F(8,8);R(sg,c[0],c[1]-16,1,5,'#5a4a36');poly(sg,[[c[0]-2,c[1]-12],[c[0]+3,c[1]-12],[c[0]+4,c[1]-6],[c[0]-3,c[1]-6]],'#c8a040');
      R(sg,c[0]-3,c[1]-7,8,1,'#a07c28');R(sg,c[0]-1,c[1]-12,2,5,'#e0c060');R(sg,c[0],c[1]-5,1,1,'#6a5020');}
     post(11.8,8);post(8,11.8);
     {const S=F(14,14),Q=prism(sg,[S[0],S[1]-4-PH],24,24,2,'#7a4a2b','#5a3420',null);
      hip(sg,Q,6,'#df5e48','#aa3828','#9e3324','#c94a36');
      for(const q of [Q.W,Q.S]){R(sg,q[0]+(q===Q.W?2:-1),q[1]+2,2,3,'#e05050');R(sg,q[0]+(q===Q.W?2:-1),q[1]+1,2,1,'#5a3420');R(ng,q[0]+(q===Q.W?2:-1),q[1]+2,2,3,'#ffb060');}}
     {const D=prism(sg,[F(10,10)[0],F(10,10)[1]-9-PH],8,8,7,'#9e3324','#7a2418',null);
      win(sg,D,'L',D.sx-6,4,2,3,'#e8c870');win(sg,D,'R',D.sx+2,4,2,3,'#c8a850');win(ng,D,'L',D.sx-6,4,2,3,'#ffd98a');
      const S=F(11.5,11.5),Q=prism(sg,[S[0],S[1]-16-PH],14,14,2,'#7a4a2b','#5a3420',null);
      const r=hip(sg,Q,10,'#df5e48','#aa3828','#9e3324','#c94a36');
      R(sg,r[0][0],r[0][1]-4,1,4,'#ffd700');R(sg,r[0][0]-1,r[0][1]-2,3,1,'#e0b020');}
     finish(K,k,2,OL,1);}
  }catch(e){console.error('v574 k79',e);}

  /* ================= k69 燈塔（1×1） ================= */
  try{
    const k=69,OL=[26,30,44];
    // v1：矮胖石燈塔＋守塔人小屋
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,110,32,'#9a9484','#8a8478','#aca696');
     // 礁石：不規則多邊形塊（深體＋左上受光面），取代原本讀成「圓環」的淺色橢圓
     const rock=(a,b,r)=>{const p=F(a,b),x=p[0],y=p[1],s=r/2.5;
       poly(sg,[[x-4*s,y],[x-3*s,y-3*s],[x,y-4*s],[x+3*s,y-2*s],[x+4*s,y+1],[x-1,y+1]],'#6a665e');
       poly(sg,[[x-3*s,y-1],[x-2*s,y-3*s],[x,y-4*s],[x+1,y-2*s]],'#8e8a80');R(sg,x-1,y-Math.round(3*s),2,1,'#aaa69c');};
     rock(15,3,2.5);rock(2,15,2);
     const c=F(5.5,6.5);
     const top=frustum(sg,c[0],c[1],10,8,30,y=>y%6===5?'#bcb29c':'#d8d0bc');
     R(sg,c[0]-4,c[1]-7,4,7,'#4a3a2a');R(sg,c[0]-3,c[1]-8,2,1,'#4a3a2a');
     for(const hy of [14,23])R(sg,c[0]-2,c[1]-hy,2,3,'#3a4a5a');
     ellF(sg,c[0]+.5,top,11.5,4,'#4a4a52');ellF(sg,c[0]+.5,top-1,10.5,3.5,'#6a6a72');
     const lt=frustum(sg,c[0],top-1,5,5,8,()=>'#fff0b0',true);
     for(let dx=-4;dx<=4;dx+=3)R(sg,c[0]+dx,lt,1,8,'#4a4a5a');
     R(ng,c[0]-5,lt,11,8,'#fff8c0');
     for(let dx=-10;dx<=10;dx+=4)R(sg,c[0]+dx,top-3,1,3,'#3a3a42');R(sg,c[0]-10,top-3,21,1,'#3a3a42');
     {let y=lt;for(let i=0;i<5;i++){R(sg,c[0]-6+i,y-1-i,13-2*i,1,i<2?'#c84a3a':'#a83a2a');}R(sg,c[0],y-8,1,3,'#3a3a42');}
     // 守塔人小屋
     {const P=prism(sg,F(15,14),14,14,9,'#e8e0cc','#b8ae98',null);
      win(sg,P,'L',P.sx-10,3,3,3,'#3a5060');win(ng,P,'L',P.sx-10,3,3,3,'#ffd98a');
      win(sg,P,'R',P.sx+3,3,0,6,'#5a3a24');win(sg,P,'R',P.sx+9,3,3,3,'#3a5060');
      const m=gable(sg,P,'b',6,'#9e3a2c','#c85a48','#e8e0cc');
      R(sg,m.M2[0]-3,m.M2[1]-2,3,5,'#8a7a6a');R(sg,m.M2[0]-3,m.M2[1]-2,3,1,'#6a5a4a');}
     finish(K,k,1,OL,1);}
    // v2：鋼骨桁架燈塔（高瘦，畫布上加 16px）
    {const PT=16,K=kit(72,128,36,126),F=ISO(36,94),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,36,126,32,'#9a9484','#8a8478','#aca696');
     prism(sg,F(13,13),20,20,3,'#b8b4a8','#8a867a','#c8c4b8');
     const c=F(8,8),by=c[1]-3,H=78,cx=c[0],ty=by-H;
     const RED='#c8502e',RD='#983820';
     // 後腿＋中央梯管
     line(sg,cx,by-5,cx,ty-2,RD);
     for(let y=ty;y<by;y++){R(sg,cx-1,y,1,1,'#f0ece0');R(sg,cx,y,1,1,'#d8d4c8');R(sg,cx+1,y,1,1,'#b8b4a8');}
     // 前面三腿與斜撐
     const L0=[cx-13,by],L1=[cx-4,ty],R0=[cx+13,by],R1=[cx+4,ty],F0=[cx,by+6],F1=[cx,ty+2];
     const at=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
     for(let i=0;i<5;i++){const t0=i/5,t1=(i+1)/5;
       line(sg,...at(L0,L1,t0),...at(F0,F1,t1),RD);line(sg,...at(F0,F1,t0),...at(L0,L1,t1),RD);
       line(sg,...at(F0,F1,t0),...at(R0,R1,t1),RD);line(sg,...at(R0,R1,t0),...at(F0,F1,t1),RD);
       if(i)line(sg,...at(L0,L1,t0),...at(F0,F1,t0),RED),line(sg,...at(F0,F1,t0),...at(R0,R1,t0),RED);}
     for(const [p,q] of [[L0,L1],[R0,R1],[F0,F1]]){line(sg,p[0],p[1],q[0],q[1],RED);line(sg,p[0]+1,p[1],q[0]+1,q[1],p===L0?'#e07050':RD);}
     // 燈室平台
     ellF(sg,cx+.5,ty,8.5,3,'#3a3a42');ellF(sg,cx+.5,ty-1,7.5,2.5,'#5a5a62');
     for(let dx=-7;dx<=7;dx+=3)R(sg,cx+dx,ty-3,1,3,'#2a2a32');R(sg,cx-7,ty-3,15,1,'#2a2a32');
     const lt=frustum(sg,cx,ty-1,4,4,7,()=>'#fff0b0',true);
     for(let dx=-3;dx<=3;dx+=3)R(sg,cx+dx,lt,1,7,'#4a4a5a');R(ng,cx-4,lt,9,7,'#fff8c0');
     for(let i=0;i<4;i++)R(sg,cx-5+i,lt-1-i,11-2*i,1,'#2a2a32');R(sg,cx,lt-7,1,3,'#2a2a32');
     // 設備小屋
     {const P=prism(sg,F(15.5,15.5),8,8,7,'#e8e4d8','#b8b4a8','#c8ccd4');win(sg,P,'R',P.sx+2,3,0,5,'#5a4a3a');band(sg,P,'L',6,1,'#9a9ea6');}
     finish(K,k,2,OL,1);}
  }catch(e){console.error('v574 k69',e);}

  /* ================= k181 海豚灣劇場（1×1） ================= */
  try{
    const k=181,OL=[28,22,16];
    const plaza=(g,F)=>{ground(g,36,110,32,'#d8d4c8','#b0aa9a','#ece8dc');};
    // v1：露天海灣劇場——階梯看台＋表演池＋躍身海豚雕塑＋張拉帆篷（低、開放）
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     plaza(g,F);
     // 表演池（前右大半格；後兩緣見池壁，四緣白石壓頂）
     {const S=F(15,14.5);para(g,S[0],S[1],13,25,'#4fa8d0');
      for(let i=1;i<=2;i++){const p=F(8.5,2),q=F(8.5,14.5),r=F(15,2);line(g,p[0],p[1]+i,q[0],q[1]+i,'#86a8b8');line(g,p[0],p[1]+i,r[0],r[1]+i,'#9ab8c4');}
      {const p=F(8.5,2),q=F(8.5,14.5),r=F(15,2);line(g,p[0],p[1]+3,q[0],q[1]+3,'#3a88b0');line(g,p[0],p[1]+3,r[0],r[1]+3,'#3a88b0');}
      for(const e of [[8.5,2,15,2],[8.5,2,8.5,14.5],[8.5,14.5,15,14.5],[15,2,15,14.5]])isoLine(g,F,e[0],e[1],e[2],e[3],'#f4f1e8');
      for(const [a,b,w] of [[10.5,4.5,3],[13.4,6,2],[12.6,12.2,3]]){const p=F(a,b);R(g,p[0],p[1],w,1,'#9ad8f0');}
      for(const [a,b] of [[9.3,6],[9.3,11]]){const p=F(a,b);R(g,p[0],p[1],1,1,'#e8f0f4');R(ng,p[0]-1,p[1]-1,3,2,'#8ae8ff');}}
     const mast=(a,b,hgt)=>{const p=F(a,b);R(sg,p[0],p[1]-hgt,1,hgt,'#9aa8b0');R(sg,p[0],p[1]-2,1,2,'#6a7880');return [p[0],p[1]-hgt];};
     // 後桅（先畫）
     const cN=mast(.6,1.2,24),cW=mast(.6,14.4,17);
     // 看台（後→前，三階）
     for(const [a0,a1,h] of [[1,3.5,10],[3.5,5.5,7],[5.5,7.5,4]]){
       const P=prism(sg,F(a1,14),2*(a1-a0),26,h,'#e8e4da','#c8c2b4','#f4f1e8',true);
       win(sg,P,'R',P.sx+1,24,h-2,1,'#4a90b8');isoLine(sg,F,a1-.6,1.6,a1-.6,13.4,'#4a90b8');}
     // 前桅＋雙曲張拉膜（N/S 高、W/E 低，沿 N–S 脊分兩面：左亮右暗）
     const cS=mast(7.8,14.4,22),cE=mast(7.8,1.2,13);
     {const mid=(p,q,c,t)=>[Math.round((p[0]+q[0])/2+(c[0]-(p[0]+q[0])/2)*t),Math.round((p[1]+q[1])/2+(c[1]-(p[1]+q[1])/2)*t)];
      const C=[(cN[0]+cS[0]+cW[0]+cE[0])/4,(cN[1]+cS[1]+cW[1]+cE[1])/4];
      poly(sg,[cN,mid(cN,cW,C,.14),cW,mid(cW,cS,C,.14),cS],'#f4f1e8');
      poly(sg,[cN,cS,mid(cS,cE,C,.14),cE,mid(cE,cN,C,.14)],'#d4cebe');
      line(sg,cN[0],cN[1],cS[0],cS[1],'#fbfaf4');
      for(const c of [cN,cW,cS,cE]){R(sg,c[0]-1,c[1]-1,3,1,'#b8c0c8');R(ng,c[0],c[1]-1,1,1,'#fff6d0');}}
     // 躍身海豚（斜向躍出：尾鰭點水、吻部朝右上；深背淺腹＋背鰭胸鰭）
     {const map=[".............MS",
                 "...........DMML",
                 "......F...DMMLL",
                 "......FFDDMMLL.",
                 ".......DMMMLL..",
                 ".....DDMMLLP...",
                 "...DDMMMLL.P...",
                 "..DMMMLL.......",
                 ".DMMLL.........",
                 "TDML...........",
                 "TT.L...........",
                 ".T............."];
      const pal={D:'#4d6578',M:'#7d95a8',L:'#dce8ee',T:'#5d7588',S:'#4d6578',F:'#4d6578',P:'#5d7588'},o=F(12.4,10.2),x0=o[0]-8,y0=o[1]-11;
      map.forEach((row,j)=>{for(let i=0;i<row.length;i++){const c=pal[row[i]];if(c)R(sg,x0+i,y0+j,1,1,c);}});
      R(g,x0-2,y0+11,2,1,'#e8f6fc');R(g,x0+2,y0+11,2,1,'#e8f6fc');R(g,x0-4,y0+12,9,1,'#9ad8f0');R(g,x0-2,y0+10,1,1,'#e8f6fc');}
     // 浮球
     {const p=F(13.8,4.6);R(sg,p[0],p[1]-2,3,2,'#e05252');R(sg,p[0]+1,p[1]-2,1,2,'#f4f1e8');}
     finish(K,k,1,OL,1);}
    // v2：筒拱水族廳——白拱頂長廳＋浪紋腰帶＋山牆大拱窗（內有海豚剪影）＋海豚雕像座
    {const K=kit(72,112,36,110),F=ISO(36,78),g=K.g,sg=K.sg,ng=K.ng;
     plaza(g,F);
     for(let i=0;i<3;i++){const p=F(13+i*.9,3+i*2.5);R(g,p[0],p[1],6-i,1,'#5a9ac0');}
     const P=prism(sg,F(11,14),18,22,12,'#e8e4da','#c8c2b4',null);
     band(sg,P,'L',5,3,'#4a90b8');band(sg,P,'R',5,3,'#3a7898');band(sg,P,'R',6,1,'#2e6484');
     for(let i=0;i<3;i++){const x=P.sx+4+i*6;win(sg,P,'R',x,3,1,3,'#26314e');win(ng,P,'R',x,3,1,3,'#96ebff');}
     vault(sg,P,9,'#f4f1e8','#cfc8b8','#e8e4da');
     band(ng,P,'L',6,1,'#78dcff');band(ng,P,'R',6,1,'#78dcff');
     {const x=P.sx-12;archWin(sg,ng,P,'L',x,7,1,15,'#b8e0f0','#7a8288','#96ebff');
      win(sg,P,'L',x,7,1,2,'#4a90b8');win(sg,P,'L',x+3,1,3,11,'#7a8288');win(sg,P,'L',x,7,9,1,'#7a8288');}
     // 海豚噴泉（圓池＋小海豚噴水柱；取代原雕像座＋長椅）
     {const c=F(13.6,8.2),cx=c[0],cy=c[1];
      ellF(sg,cx+.5,cy+1,6.5,3.2,'#b0aa9a');ellF(sg,cx+.5,cy,6.5,3.2,'#ece8dc');ellF(sg,cx+.5,cy,4.8,2.2,'#4fa8d0');R(sg,cx-3,cy,2,1,'#9ad8f0');
      const map=["..S.",".MD.","LMD.","LM..","TT.."],pal={D:'#4d6578',M:'#7d95a8',L:'#dce8ee',T:'#5d7588',S:'#5d7588'};
      map.forEach((row,j)=>{for(let i=0;i<row.length;i++){const q=pal[row[i]];if(q)R(sg,cx-1+i,cy-5+j,1,1,q);}});
      R(sg,cx+1,cy-9,1,3,'#b8e8f8');R(sg,cx+2,cy-8,1,1,'#e8f6fc');R(sg,cx+3,cy-7,1,2,'#b8e8f8');
      R(sg,cx-4,cy+1,1,1,'#e8f0f4');R(sg,cx+4,cy+1,1,1,'#e8f0f4'); // 池緣水下燈座（夜光只落在這兩顆燈上）
      R(ng,cx-5,cy,3,2,'#78dcff');R(ng,cx+3,cy,3,2,'#78dcff');}
     finish(K,k,2,OL,1);}
  }catch(e){console.error('v574 k181',e);}
});
