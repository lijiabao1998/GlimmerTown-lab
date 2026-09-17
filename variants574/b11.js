(window.__variants574=window.__variants574||[]).push(function b11(A){
  const SPR=A.SPR(), B=SPR.bld, sh=A.shade, HL=A.hashLocal479;
  /* ================= b11 公共設施（防災三件／大型園區四件／車庫機廠四件）：共用像素工具 ================= */
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
  const UP=(p,up)=>[p[0],p[1]-up];
  // 平行四邊形頂面：底頂點 (sx,sy)，向左 la、向右 rb 像素
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
  // 格座標方盒：a∈[a0,a1] b∈[b0,b1]，z＝離地抬升 px
  const boxG=(g,F,a0,a1,b0,b1,h,cL,cR,cT,z,noEdge)=>prism(g,UP(F(a1,b1),z||0),2*(a1-a0),2*(b1-b0),h,cL,cR,cT,noEdge);
  const rowL=(P,x,hb)=>P.sy-1-((P.sx-x)>>1)-hb, rowR=(P,x,hb)=>P.sy-1-((x-P.sx+1)>>1)-hb;
  // 牆面斜切塊：face 'L'/'R'；x0 起始欄、w 欄寬、hb 離地、ht 高
  function win(g,P,face,x0,w,hb,ht,c){g.fillStyle=c;for(let i=0;i<w;i++){const x=x0+i,r=face==='L'?rowL(P,x,hb):rowR(P,x,hb);g.fillRect(x,r-ht+1,1,ht);}}
  function band(g,P,face,hb,ht,c){if(face==='L')win(g,P,'L',P.sx-P.la,P.la,hb,ht,c);else win(g,P,'R',P.sx,P.rb,hb,ht,c);}
  // 拱窗
  function archWin(g,ng,P,face,x0,w,hb,ht,glass,frame,lit){
    win(g,P,face,x0-1,w+2,hb-1,ht+1,frame);
    win(g,P,face,x0,w,hb,ht-1,glass);
    if(w>2)win(g,P,face,x0+1,w-2,hb+ht-1,1,glass);
    if(ng&&lit){win(ng,P,face,x0,w,hb,ht-1,lit);if(w>2)win(ng,P,face,x0+1,w-2,hb+ht-1,1,lit);}
  }
  // 一排窗：沿牆等距；every＝點燈節奏
  function winRow(g,ng,P,face,hb,ht,ww,step,glass,lit,pad,every,phase){
    pad=pad==null?2:pad;const L=face==='L'?P.la:P.rb,x0=face==='L'?P.sx-P.la:P.sx;let i=0;
    for(let o=pad;o+ww<=L-pad+ (face==='L'?0:0);o+=step,i++){
      win(g,P,face,x0+o,ww,hb,ht,glass);
      if(ng&&lit&&((i+(phase|0))%(every||2)===0))win(ng,P,face,x0+o,ww,hb,ht,lit);
    }
  }
  // 山牆屋頂：ridge='b'＝屋脊平行右牆（山牆三角落在左牆）；ridge='a'＝屋脊平行左牆（山牆在右牆）
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
      const kk=t<.45?0:(t<.7?1:2);const col=[cHi,sh(cHi,-14),cLo][kk];
      poly(g,[p,[q[0]+.6,q[1]],[q[0]+.6+V[0],q[1]+V[1]],[p[0]+V[0],p[1]+V[1]]],col);}
    for(let i=0;i<n;i+=Math.max(2,n>>5)){const p=pts[i];line(g,p[0],p[1],p[0]+V[0],p[1]+V[1],sh(cHi,-22));}
    if(cEnd)poly(g,pts.concat([[S[0],S[1]],[W[0],W[1]]]),cEnd);
    return pts;
  }
  // 等距地面線
  function isoLine(g,F,a0,b0,a1,b1,c){const p=F(a0,b0),q=F(a1,b1);line(g,p[0],p[1],q[0],q[1],c);}
  function paveG(g,F,a0,a1,b0,b1,c,eL,eD){const S=F(a1,b1);para(g,S[0],S[1],2*(a1-a0),2*(b1-b0),c,eL,eD);}
  // 圓錐台（塔身）：cx,by=地面圓心
  const fshade=(c,t)=>sh(c,t<-.55?10:t<-.1?4:t<.35?-8:t<.75?-20:-32);
  function frustum(g,cx,by,r0,r1,h,colAt,noCap){
    for(let dx=-r0;dx<=r0;dx++){const e=Math.round((r0/2)*Math.sqrt(Math.max(0,1-(dx/(r0+.5))**2)));if(e>0){g.fillStyle=fshade(colAt(0),dx/r0);g.fillRect(cx+dx,by,1,e);}}
    for(let y=0;y<h;y++){const r=Math.round(r0+(r1-r0)*y/h),base=colAt(y);for(let dx=-r;dx<=r;dx++){g.fillStyle=fshade(base,dx/Math.max(1,r));g.fillRect(cx+dx,by-1-y,1,1);}}
    if(!noCap)ellF(g,cx+.5,by-h,r1+.5,Math.max(1,r1/2),sh(colAt(h-1),14));
    return by-h;
  }
  // 球體（光從左上）
  function sphere(g,cx,cy,r,col){
    for(let dx=-r;dx<=r;dx++){const hh=Math.round(Math.sqrt(Math.max(0,r*r-dx*dx)));
      for(let dy=-hh;dy<hh;dy++){const t=(dx*.8+dy*.6)/r;g.fillStyle=sh(col,t<-.6?16:t<-.15?6:t<.35?-6:t<.7?-18:-30);g.fillRect(cx+dx,cy+dy,1,1);}}
  }
  // 半球圓頂：cx,by＝頂座圓心；r 半徑；hgt 高
  function dome(g,cx,by,r,hgt,col){
    for(let dx=-r;dx<=r;dx++){const u=dx/(r+.5),e=Math.round((r/2)*Math.sqrt(Math.max(0,1-u*u))),top=Math.round(hgt*Math.sqrt(Math.max(0,1-u*u)));
      for(let y=by-top;y<by+e;y++){const vy=(by-y)/Math.max(1,hgt);g.fillStyle=sh(fshade(col,u),vy>.8?10:vy>.5?4:0);g.fillRect(cx+dx,y,1,1);}}
  }
  // 小樹（清晰像素）：x,y＝樹根地面點
  function tree(g,gg,x,y,r,c1,c2){
    r=r||4;const c=c1||'#3d7743',hl=c2||'#5a9a5c';
    if(gg)ellF(gg,x+2,y,r,Math.max(1,r*.45),'rgba(24,34,28,.26)');
    R(g,x,y-r,1,r+1,'#5b412e');
    const cy=y-r-Math.round(r*.8);
    ellF(g,x+.5,cy,r+.5,r,c);
    ellF(g,x-.5-r*.25,cy-r*.3,r*.5,r*.42,hl);
    R(g,x+Math.round(r*.35),cy+Math.round(r*.3),Math.max(1,r>>1),1,sh(c,-16));
  }
  function lamp(g,ng,x,y,h,lit){h=h||7;R(g,x,y-h,1,h+1,'#606a74');R(g,x-1,y-h-1,3,1,'#d6c48c');if(ng)R(ng,x-1,y-h-1,3,2,lit||'#ffe59c');}
  // 桁架塔：x＝中心欄，by＝地面，h 高，bw 半寬
  function lattice(g,x,by,h,bw,col,col2){
    const top=by-h;line(g,x-bw,by,x,top,col);line(g,x+bw,by,x,top,col2||col);
    let flip=0;for(let y=by-3;y>top+4;y-=5){const w0=Math.round(bw*(y-top)/h),y2=y-5,w1=Math.round(bw*Math.max(0,y2-top)/h);
      if(flip)line(g,x-w0,y,x+w1,y2,col2||col);else line(g,x+w0,y,x-w1,y2,col2||col);flip^=1;}
    return top;
  }
  // 碟形天線（朝左上）
  function dish(g,x,y,rx,ry,col){
    ellF(g,x,y,rx,ry,sh(col,-26));ellF(g,x-.5,y-.5,rx-.8,ry-.8,col);ellF(g,x+.5,y+.2,rx*.45,ry*.45,sh(col,-14));
    line(g,x,y,x-rx+1,y-ry+1,'#6a747c');R(g,x-rx+1,y-ry,1,1,'#3a4048');
  }
  // 車輛：along 'a' 長邊在左面；along 'b' 長邊在右面；(a,b)＝最小角
  function veh(sg,F,a,b,len,wid,ht,col,along,glass){
    const la=along==='a'?2*len:2*wid,rb=along==='a'?2*wid:2*len;
    const S=along==='a'?F(a+len,b+wid):F(a+wid,b+len);
    const P=prism(sg,S,la,rb,ht,col,sh(col,-34),sh(col,26));
    const gc=glass||'#2e3e4c';
    if(ht>=4){win(sg,P,'L',P.sx-la+1,la-2,ht-3,2,gc);win(sg,P,'R',P.sx+1,rb-2,ht-3,2,sh(gc,-10));}
    return P;
  }
  function crate(g,S,la,rb,h,col){const P=prism(g,S,la,rb,h,col,sh(col,-30),sh(col,18),true);return P;}
  // 地面 H 停機坪
  function helipad(g,F,a,b,r,base){
    const c=F(a,b);ellF(g,c[0],c[1],r*2+1,r+.5,sh(base||'#3f4a54',-12));ellF(g,c[0],c[1],r*2,r,base||'#3f4a54');
    ellF(g,c[0],c[1],r*2-1,r-.5,'#e0c050');ellF(g,c[0],c[1],r*2-3,r-1.5,base||'#3f4a54');
    const q=r*.45;for(const d of [0,1]){const G=(u,v)=>{const p=F(u,v);return [p[0],p[1]+d];};
      isoLine(g,G,a-q,b-q*.9,a+q,b-q*.9,'#f0f0ea');isoLine(g,G,a-q,b+q*.9,a+q,b+q*.9,'#f0f0ea');}
    isoLine(g,F,a,b-q*.9,a,b+q*.9,'#f0f0ea');
  }
  /* 後製鏈複刻：T479 建材紋理（與 v0 同函式同種子）＋貼地影橢圓 */
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
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);
    tint.addColorStop(0,'rgba(222,213,190,.035)');tint.addColorStop(1,'rgba(43,49,54,.07)');g.fillStyle=tint;g.fillRect(0,0,w,h);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86);
    g.strokeStyle='rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=8){const off=Math.floor(HL(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');
    g.fillStyle=ao;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();
  }
  // 貼地影橢圓（量自 v0）：s=[dx,dy,rx,ry]
  function shadowEll(cv,ax,ay,s){if(!s)return;const g=cv.getContext('2d');g.save();ellF(g,ax+s[0],ay-s[1],s[2],s[3],'rgba(22,22,33,.16)');g.restore();}
  // 新畫布組：c=日圖（地坪）、nc=夜圖、s=立體層（描邊用）
  function kit(w,h,ax,ay){const [c,g]=A.cv(w,h),[nc,ng]=A.cv(w,h),[s,sg]=A.cv(w,h);return {c,g,nc,ng,s,sg,w,h,ax,ay};}
  function up2(src,w,h){const [c,g]=A.cv(w*2,h*2);g.imageSmoothingEnabled=false;g.drawImage(src,0,0,w*2,h*2);return c;}
  // 1× 收尾
  function finish(K,k,v,ol,shd){
    A.outlineSprite(K.s,ol[0],ol[1],ol[2]);K.g.drawImage(K.s,0,0);if(K.after)K.after(K.g);
    mat479(K.c,k,k+'_1_'+v);shadowEll(K.c,K.ax,K.ay,shd);
    B[k+'_1_'+v]={img:K.c,night:K.nc,ax:K.ax,ay:K.ay,w:K.w,h:K.h,smoke:[]};
  }
  // sc=.5 收尾（k131–133：v0 為 2× 原圖＋sc .5）：邏輯尺寸作畫 → 整數 2× 放大 → 紋理與影子在原圖尺度
  function finishSc(K,k,v,ol,shd){
    A.outlineSprite(K.s,ol[0],ol[1],ol[2]);K.g.drawImage(K.s,0,0);if(K.after)K.after(K.g);
    const c2=up2(K.c,K.w,K.h),n2=up2(K.nc,K.w,K.h);
    mat479(c2,k,k+'_1_'+v);shadowEll(c2,K.ax*2,K.ay*2,shd);
    B[k+'_1_'+v]={img:c2,night:n2,ax:K.ax*2,ay:K.ay*2,w:K.w*2,h:K.h*2,smoke:[],sc:.5};
  }
  // 地坪：v0 同色菱形＋邊光
  function ground(g,ax,ay,hw,col,cD,cL){A.dia(g,ax,ay-hw,hw,col);A.diaEdge(g,6,cD,ax,ay-hw,hw);A.diaEdge(g,9,cL,ax,ay-hw,hw);}
  const SHD_SC=[23.5,19,88.5,36],ORG133='#d49a43';   // k131–133 原圖尺度（量自 v0）
  const COOL='#8edcff',WARM='#ffc27a';

  /* ================= k131 防災中心（2×2，sc .5） ================= */
  try{
    const k=131,OL=[26,30,44],PL='#596875',PD='#33414a',PLL=sh('#596875',22);
    const cF='#688091',cS='#465b69',cD='#2d414e',ORG='#d49a43',GLS='#cfe3e8',GLD='#9fbcc6';
    // v1：寬低指揮樓＋救災車庫翼＋獨立通訊桁架塔（橫向展開、三量體）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,17,31,16,26,'#4d5a66');                              // 出勤坪
     for(const a of [21,26])isoLine(g,F,a,17,a,25,'#c8a24a');
     paveG(g,F,3,15,21,30,'#52606c');                               // 塔基碎石
     // 主指揮樓
     const P=boxG(sg,F,2,16,4,18,30,cF,cS,'#5a6c7a');
     band(sg,P,'L',13,2,ORG);band(sg,P,'R',13,2,sh(ORG,-40));
     winRow(sg,ng,P,'L',4,5,3,6,GLS,COOL,3,2,0);winRow(sg,ng,P,'L',19,5,3,6,GLS,COOL,3,2,1);
     winRow(sg,ng,P,'R',4,5,3,6,GLD,COOL,3,3,1);winRow(sg,ng,P,'R',19,5,3,6,GLD,COOL,3,3,0);
     win(sg,P,'L',P.sx-17,5,0,8,cD);win(sg,P,'L',P.sx-18,7,8,1,ORG);                // 入口＋雨庇
     // 屋頂：女兒牆內縮＋碟形天線＋設備
     {const T=boxG(sg,F,4,9,6,11,3,'#7b8f9c','#536877','#8a9ca8',30);
      dish(sg,T.S[0]-2,T.S[1]-8,6,3,'#d4d8d2');R(sg,T.S[0]-2,T.S[1]-5,1,5,'#617884');R(sg,T.S[0]-3,T.S[1]-14,2,2,'#d24d42');R(ng,T.S[0]-3,T.S[1]-14,2,2,'#ff5a4a');}
     boxG(sg,F,11,14,12,15,3,'#8a9aa4','#5e6e78','#9aaab4',30);
     // 車庫翼（門朝左下出勤坪）
     const G=boxG(sg,F,18,30,2,16,14,'#7b8f9c','#536877','#66798a');
     band(sg,G,'L',12,2,ORG);band(sg,G,'R',12,2,sh(ORG,-40));
     for(const x0 of [G.sx-22,G.sx-11]){win(sg,G,'L',x0,9,0,10,'#2a3640');for(let hb=6;hb<10;hb+=2)win(sg,G,'L',x0,9,hb,1,'#c0503f');}
     winRow(sg,ng,G,'R',6,3,3,7,GLD,COOL,3,2,0);
     // 出勤車：消防車半出庫＋指揮車
     veh(sg,F,20,16,3,7,6,'#d24d42','b','#34434e');
     {const p=F(23,19);R(sg,p[0]-1,p[1]-8,3,1,'#f0f0ea');R(ng,p[0]-1,p[1]-8,1,1,'#ff5a4a');R(ng,p[0]+1,p[1]-8,1,1,'#6aa8ff');}
     veh(sg,F,26,18,3,5,5,'#e8e8e0','b','#34434e');
     {const p=F(29,20);R(sg,p[0]-3,p[1]-6,4,1,'#d24d42');}
     // 通訊桁架塔＋機櫃
     {const b=F(8,26),top=lattice(sg,b[0],b[1],52,4,'#617884','#4a5f6b');
      R(sg,b[0]-5,b[1]-1,11,1,'#3d4a54');
      dish(sg,b[0]-3,top+18,4,2,'#d4d8d2');R(sg,b[0]-2,top+8,5,1,'#8a9aa4');R(sg,b[0]-1,top-3,2,3,'#d24d42');R(ng,b[0]-1,top-3,2,2,'#ff5a4a');}
     {const Q=boxG(sg,F,11,14,24,29,7,'#535b5e','#3d4447','#7d8c8c');band(sg,Q,'L',4,1,'#8a9496');win(ng,Q,'L',Q.sx-4,2,2,1,COOL);}
     tree(sg,g,F(4,30)[0],F(4,30)[1],4);tree(sg,g,F(28,30)[0],F(28,30)[1],3);
     finishSc(K,k,1,OL,SHD_SC);}
    // v2：高聳緊急應變塔（玻璃指揮艙）＋筒拱物資倉＋地面直升機坪（高瘦＋矮長）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,4,30,17,31,'#4d5a66');
     helipad(g,F,11,24,6,'#44505a');
     // 應變塔
     const T=boxG(sg,F,5,13,5,13,50,cF,cS,'#5a6c7a');
     for(let hb=6;hb<46;hb+=10){win(sg,T,'L',T.sx-11,2,hb,5,GLS);win(sg,T,'R',T.sx+4,2,hb,5,GLD);}
     for(let hb=6;hb<46;hb+=20){win(ng,T,'L',T.sx-11,2,hb,5,COOL);}
     win(sg,T,'L',T.sx-14,5,0,8,cD);
     band(sg,T,'L',46,2,ORG);band(sg,T,'R',46,2,sh(ORG,-40));
     const C=boxG(sg,F,4,14,4,14,9,'#9cc4d2','#6a93a6','#5a6c7a',50);
     band(sg,C,'L',0,1,'#465b69');band(sg,C,'R',0,1,'#2d414e');
     for(let x=C.sx-C.la+3;x<C.sx;x+=4)win(sg,C,'L',x,1,1,7,'#e6f2f4');
     for(let x=C.sx+3;x<C.sx+C.rb;x+=4)win(sg,C,'R',x,1,1,7,'#a8c4ce');
     band(ng,C,'L',2,5,COOL);band(ng,C,'R',2,5,'#6ec4ea');
     for(let x=C.sx-C.la+3;x<C.sx;x+=4)win(ng,C,'L',x,1,1,7,'#4a8aa8');
     const Rf=boxG(sg,F,3,15,3,15,2,'#7b8f9c','#536877','#8a9ca8',59);
     {const cx=Rf.S[0],cy=Rf.S[1]-6;R(sg,cx-1,cy-26,1,24,'#8a9aa4');R(sg,cx-4,cy-16,7,1,'#8a9aa4');R(sg,cx-2,cy-28,2,2,'#d24d42');R(ng,cx-2,cy-28,2,2,'#ff5a4a');
      dish(sg,cx+7,cy-3,5,2,'#d4d8d2');R(sg,cx+7,cy-1,1,3,'#617884');}
     // 物資倉：筒拱，端牆大門朝左下
     const W=boxG(sg,F,17,31,3,14,12,'#8e9aa2','#5f6c75',null);
     vault(sg,W,7,'#9fb0bb','#62727d','#7f8d96');
     win(sg,W,'L',W.sx-19,11,0,9,'#2d3a44');for(let hb=1;hb<9;hb+=2)win(sg,W,'L',W.sx-19,11,hb,1,ORG);
     win(sg,W,'L',W.sx-6,3,5,2,GLD);win(ng,W,'L',W.sx-6,3,5,2,COOL);
     win(sg,W,'R',W.sx+2,18,4,1,'#4a5660');
     // 停機坪右側一字排開（沿 b 軸一列，東端對齊 a=24/25）：後＝救災貨櫃、前＝指揮車（退件 r3：拿掉藍色廂車）；
     // 前後間距 d=5 格（2d−h−2 外框 ≥3px 地坪），東角 x≤79 不碰機庫門（x≥83）；指揮車縮 1 格長，西角離停機坪外緣再讓 2px
     // 貨櫃保留 5 格長（縮成 4 格會讀成方箱，不像貨櫃）
     {const Cn=crate(sg,F(24,22),10,6,6,'#c8783a');
      for(let x=Cn.sx-8;x<Cn.sx-1;x+=2)win(sg,Cn,'L',x,1,1,4,sh('#c8783a',-12));   // 波紋板肋
      for(const x of [Cn.sx+2,Cn.sx+4])win(sg,Cn,'R',x,1,1,4,sh('#c8783a',-48));     // 端門鎖桿
      band(sg,Cn,'L',5,1,sh('#c8783a',14));}
     {const V=veh(sg,F,21,27,4,3,5,'#e8e8e0','a','#34434e');
      win(sg,V,'L',V.sx-V.la+1,V.la-2,1,1,'#3e7fb8');
      const p=F(23,28.5);R(sg,p[0]-1,p[1]-6,1,1,'#d24d42');R(sg,p[0],p[1]-6,1,1,'#3e7fb8');
      R(ng,p[0]-1,p[1]-6,1,1,'#ff5a4a');R(ng,p[0],p[1]-6,1,1,'#6aa8ff');}
     lamp(sg,ng,F(8,31)[0],F(8,31)[1],8,'#cfeaff');lamp(sg,ng,F(3,22)[0],F(3,22)[1],8,'#cfeaff');
     tree(sg,g,F(31,31)[0]+8,F(31,31)[1]-4,3);
     finishSc(K,k,2,OL,SHD_SC);}
  }catch(e){console.error('v574 k131',e);}

  /* ---------- 共用小件（k132 起） ---------- */
  function post(g,x,y,h,c1,c2){R(g,x-1,y-h,1,h+1,c1);R(g,x,y-h,1,h+1,c2||sh(c1,-30));}
  // 沿等距線的圍欄：每 step 單位一根柱，頂緣一條橫杆
  function fence(g,F,a0,b0,a1,b1,step,col){
    const n=Math.max(1,Math.round(Math.max(Math.abs(a1-a0),Math.abs(b1-b0))/step));
    const p0=F(a0,b0),p1=F(a1,b1);line(g,p0[0],p0[1]-4,p1[0],p1[1]-4,sh(col,22));
    for(let i=0;i<=n;i++){const p=F(a0+(a1-a0)*i/n,b0+(b1-b0)*i/n);R(g,p[0],p[1]-4,1,5,col);R(g,p[0]+1,p[1]-4,1,5,sh(col,-30));}
  }
  // A 字帳篷（屋脊沿 b，開口三角在左面）
  function tent(g,F,a,b,wa,lb,rise,col){
    const P=boxG(g,F,a,a+wa,b,b+lb,1,sh(col,-12),sh(col,-34),null);
    gable(g,P,'b',rise,sh(col,-26),col,sh(col,-6),sh(col,-44));
    const m=[Math.round((P.W[0]+P.S[0])/2),Math.round((P.W[1]+P.S[1])/2)];R(g,m[0]-1,m[1]-3,2,3,sh(col,-58));
    return P;
  }
  // 方形家庭帳（矮牆＋四坡尖頂）
  function houseTent(g,F,a,b,s,h,rise,col){
    const P=boxG(g,F,a,a+s,b,b+s,h,sh(col,-6),sh(col,-34),null);
    const ap=[(P.W[0]+P.E[0])/2,(P.W[1]+P.E[1])/2-rise];
    poly(g,[P.W,P.N,P.E,ap],sh(col,-20));poly(g,[P.W,P.S,ap],sh(col,8));poly(g,[P.S,P.E,ap],sh(col,-24));
    line(g,P.S[0],P.S[1],ap[0],ap[1],sh(col,-40));
    win(g,P,'L',P.sx-7,3,0,h-1,sh(col,-52));
    return P;
  }
  // 警報喇叭桿：x,y＝地面點
  function sirenPole(g,ng,x,y,h,lit){
    post(g,x,y,h,'#8a959c','#5d676e');
    R(g,x-6,y-h+3,5,3,'#d8b34c');R(g,x-7,y-h+2,1,5,'#b8912e');R(g,x+1,y-h+3,5,3,'#c29c3c');R(g,x+6,y-h+2,1,5,'#9a7a2a');
    R(g,x-2,y-h-2,4,2,'#e8e2c8');if(ng)R(ng,x-2,y-h-2,4,2,lit||'#ffe59c');
  }

  /* ================= k132 避難公園（2×2，sc .5） ================= */
  try{
    const k=132,OL=[26,30,44],PL='#62875e',PD='#3f5e45',PLL=sh('#62875e',22);
    // v1：大跨度避難棚（柱列＋山牆鋼屋頂）＋物資倉＋高架水塔＋集合牌（高、有頂）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,0,32,22,25,'#c9b98a');paveG(g,F,12,15,0,32,'#c9b98a');
     paveG(g,F,5,23,5,21,'#b8ad8f');
     tree(sg,g,F(3,2)[0],F(3,2)[1],4);tree(sg,g,F(2,11)[0],F(2,11)[1],3);tree(sg,g,F(11,1)[0],F(11,1)[1],3);
     // 物資倉（右後）
     {const S=boxG(sg,F,25,31,1,8,12,'#ddd8c8','#aca796','#8d928a');
      band(sg,S,'L',9,2,'#e0903a');band(sg,S,'R',9,2,sh('#e0903a',-36));
      win(sg,S,'L',S.sx-10,6,0,7,'#5a5e5c');for(let hb=1;hb<7;hb+=2)win(sg,S,'L',S.sx-10,6,hb,1,'#72787a');
      win(sg,S,'R',S.sx+4,3,6,2,'#9fbcc6');win(ng,S,'R',S.sx+4,3,6,2,WARM);}
     // 避難棚：後排柱 → 棚下物件 → 前排柱 → 屋頂
     const colL='#e6e0cc',colD='#aaa48f';
     for(const [a,b] of [[7,7],[14,7],[21,7],[7,13]])post(sg,F(a,b)[0],F(a,b)[1],16,colL,colD);
     for(const [a,b] of [[10,11],[10,15]]){const p=F(a,b);R(g,p[0]-5,p[1]-1,10,1,'#8a6a42');R(g,p[0]-5,p[1],1,2,'#5f4a30');R(g,p[0]+4,p[1],1,2,'#5f4a30');}
     for(const [a,b] of [[21,13],[7,19],[14,19],[21,19]])post(sg,F(a,b)[0],F(a,b)[1],16,colL,colD);
     {const P=boxG(sg,F,6,22,6,20,3,'#d9d3c0','#a49e8c',null,16);
      gable(sg,P,'b',9,'#4a6d69','#6f948e','#e4ddc8','#34504d');
      const m=[Math.round((P.W[0]+P.S[0])/2),Math.round((P.W[1]+P.S[1])/2)];R(sg,m[0]-2,m[1]-5,4,3,'#4a6d69');
      for(const x of [P.sx-22,P.sx-8]){const r=rowL(P,x,-1);R(sg,x,r,2,1,'#f2e6b0');R(ng,x-1,r,4,2,'#ffe59c');}}
     // 高架水塔（右中）
     {const c=F(28,15);for(const [dx,dy] of [[-4,-1],[4,-1],[-2,1],[2,1]])R(sg,c[0]+dx,c[1]+dy-12,1,13,'#6d7a80');
      line(sg,c[0]-4,c[1]-4,c[0]+4,c[1]-8,'#6d7a80');
      frustum(sg,c[0],c[1]-12,5,5,8,()=>'#5a92c0');R(sg,c[0]-5,c[1]-16,11,1,'#3f6f96');}
     // 集合牌
     {const p=F(25,27);post(sg,p[0]-4,p[1],9,'#8a959c','#5d676e');post(sg,p[0]+4,p[1],9,'#8a959c','#5d676e');
      R(sg,p[0]-6,p[1]-13,13,7,'#3e9a5a');R(sg,p[0]-6,p[1]-7,13,1,'#2c6e40');R(sg,p[0]-2,p[1]-12,2,2,'#f4f4ea');R(sg,p[0]-3,p[1]-10,4,1,'#f4f4ea');R(sg,p[0]-2,p[1]-9,1,2,'#f4f4ea');R(sg,p[0],p[1]-9,1,2,'#f4f4ea');R(sg,p[0]+2,p[1]-11,3,1,'#f4f4ea');}
     lamp(sg,ng,F(4,23)[0],F(4,23)[1],8);lamp(sg,ng,F(17,26)[0],F(17,26)[1],8);
     tree(sg,g,F(30,21)[0],F(30,21)[1],3);tree(sg,g,F(8,30)[0],F(8,30)[1],4);tree(sg,g,F(29,30)[0],F(29,30)[1],3);
     finishSc(K,k,1,OL,SHD_SC);}
    // v2：帳篷營地（草坪畫線）＋覆土物資庫＋警報燈桿＋給水點（低、平、點狀）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,5,28,11,29,'#74a868');
     isoLine(g,F,5,11,28,11,'#e6e8d8');isoLine(g,F,5,29,28,29,'#e6e8d8');isoLine(g,F,5,11,5,29,'#e6e8d8');isoLine(g,F,28,11,28,29,'#e6e8d8');
     paveG(g,F,0,32,29,32,'#c9b98a');paveG(g,F,28,31,0,29,'#c9b98a');
     // 覆土物資庫（後方）
     {const P=boxG(sg,F,3,20,1,8,6,'#a3a296','#77766c',null);
      boxG(sg,F,3,20,1,8,3,'#6a9658','#557d47','#78aa64',6);
      win(sg,P,'L',P.sx-22,8,0,5,'#3b3a36');win(sg,P,'L',P.sx-23,10,5,1,'#e0903a');
      R(sg,P.sx-27,rowL(P,P.sx-27,6)-1,2,2,'#f2e6b0');R(ng,P.sx-28,rowL(P,P.sx-28,6)-1,4,3,'#ffe59c');
      for(const a of [7,13])R(sg,F(a,4)[0],F(a,4)[1]-13,2,4,'#9aa0a0');}
     tree(sg,g,F(24,2)[0],F(24,2)[1],4);
     // 帳篷兩排
     const TC=['#ece6d6','#5a8fc0','#ece6d6','#e0a050','#ece6d6','#5a8fc0'];
     [[7,13],[14,13],[7,21],[21,13],[14,21],[21,21]].forEach((q,i)=>houseTent(sg,F,q[0],q[1],5,4,5,TC[i]));
     // 旗桿
     {const p=F(3,11);post(sg,p[0],p[1],20,'#c8ccd0','#8a9096');R(sg,p[0]+1,p[1]-20,7,4,'#e2a353');R(sg,p[0]+1,p[1]-17,7,1,sh('#e2a353',-34));}
     // 警報燈桿（右後）
     sirenPole(sg,ng,F(30,5)[0],F(30,5)[1],30);
     // 給水點
     {const P=crate(sg,F(26,26),6,6,6,'#4a86b8');R(sg,P.sx-4,P.sy-3,1,2,'#d8dde0');}
     lamp(sg,ng,F(4,30)[0],F(4,30)[1],8);
     tree(sg,g,F(31,14)[0],F(31,14)[1],3);tree(sg,g,F(31,23)[0],F(31,23)[1],3);tree(sg,g,F(18,31)[0],F(18,31)[1],3);
     finishSc(K,k,2,OL,SHD_SC);}
  }catch(e){console.error('v574 k132',e);}

  /* ================= k133 防災雷達（2×2，sc .5） ================= */
  try{
    const k=133,OL=[26,30,44],PL='#596875',PD='#33414a',PLL=sh('#596875',22);
    // v1：氣象雷達罩塔（混凝土圓塔＋白色球罩）＋低矮機房＋備援發電機（高瘦）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,5,19,5,19,'#6b7883');paveG(g,F,19,31,21,26,'#4d5a66');
     // 圓塔＋走道＋球罩
     {const c=F(12,12);frustum(sg,c[0],c[1],8,6,46,y=>y%12===11?'#a4a8a2':'#b9bdb6');
      const top=c[1]-46;ellF(sg,c[0]+.5,top,9.5,3.5,'#79828a');R(sg,c[0]-9,top,19,1,'#5b646c');
      sphere(sg,c[0],top-11,12,'#e9ece6');
      R(sg,c[0]-11,top-12,22,1,'rgba(150,160,166,.55)');
      R(sg,c[0],top-27,1,4,'#6a747c');R(sg,c[0]-1,top-25,3,2,'#d24d42');R(ng,c[0]-1,top-25,3,2,'#ff5a4a');
      win(sg,{sx:c[0],sy:c[1],la:8,rb:8},'L',c[0]-4,3,0,6,'#3a4650');R(ng,c[0]-4,c[1]-19,2,2,COOL);}
     // 機房
     {const P=boxG(sg,F,20,30,6,20,14,'#8fa0a8','#62737c','#7f8f98');
      band(sg,P,'L',11,1,ORG133);band(sg,P,'R',11,1,sh(ORG133,-40));
      win(sg,P,'L',P.sx-17,13,4,4,'#cfe3e8');win(ng,P,'L',P.sx-16,5,4,4,COOL);win(ng,P,'L',P.sx-8,4,4,4,COOL);
      win(sg,P,'R',P.sx+3,4,0,8,'#3a4650');winRow(sg,ng,P,'R',4,4,3,7,'#9fbcc6',COOL,11,3,0);
      dish(sg,P.N[0]+1,P.N[1]+8,5,2,'#d4d8d2');R(sg,P.N[0]+1,P.N[1]+10,1,3,'#617884');
      crate(sg,[P.S[0]+6,P.S[1]-3],4,6,3,'#9aa6ac');}
     // 纜線槽
     {const p=F(19,14),q=F(14,14);line(sg,p[0],p[1]-3,q[0]+4,q[1]-3,'#4a5660');}
     tree(sg,g,F(3,24)[0],F(3,24)[1],3);
     // 發電機
     {const P=crate(sg,F(10,28),10,6,7,'#535b5e');R(sg,P.N[0]+2,P.N[1]-6,2,6,'#3d4447');R(sg,P.sx-8,P.sy-5,5,1,'#d49a43');}
     tree(sg,g,F(28,4)[0],F(28,4)[1],3);
     K.after=gg=>{fence(gg,F,1,31,31,31,4,'#7d878d');fence(gg,F,31,1,31,31,4,'#7d878d');};
     finishSc(K,k,1,OL,SHD_SC);}
    // v2：相位陣列楔形站（斜面圓陣）＋格構警報桿＋工程車（低寬量體）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,4,31,4,29,'#6b7883');
     tree(sg,g,F(2,4)[0],F(2,4)[1],3);
     const Z=(a,b,z)=>UP(F(a,b),z);
     poly(sg,[Z(6,26,6),Z(24,26,6),Z(24,12,34),Z(6,12,34)],'#a3b0b5');
     poly(sg,[Z(6,26,0),Z(24,26,0),Z(24,26,6),Z(6,26,6)],'#8b989e');
     poly(sg,[Z(24,26,0),Z(24,26,6),Z(24,12,34),Z(24,6,34),Z(24,6,0)],'#56646c');
     poly(sg,[Z(6,6,34),Z(24,6,34),Z(24,12,34),Z(6,12,34)],'#b9c3c6');
     {const p=Z(6,12,34),q=Z(24,12,34);line(sg,p[0],p[1],q[0],q[1],'#d6dcdd');}
     {const p=Z(24,26,6),q=Z(24,12,34);line(sg,p[0],p[1],q[0],q[1],'#c2cbcf');}
     // 斜面上的圓形陣列（兩圈）
     const ring=(s,col)=>{const P=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2,u=.5+s*.36*Math.sin(t);P.push(Z(15+s*7.2*Math.cos(t),26-14*u,6+28*u));}poly(sg,P,col);};
     ring(1,'#6d7c84');ring(.82,'#88979e');ring(.2,'#6d7c84');
     {const c=Z(15,19,20);for(let d=-8;d<=8;d+=4){line(sg,c[0]+d-3,c[1]-d*.5-6+3,c[0]+d+3,c[1]-d*.5+6-3,'#7a8990');}}
     // 頂部設備
     {const t=Z(15,9,34);dish(sg,t[0]-6,t[1]-4,4,2,'#d4d8d2');crate(sg,[t[0]+10,t[1]+2],4,4,4,'#9aa6ac');}
     win(sg,{sx:Z(24,26,0)[0],sy:Z(24,26,0)[1],la:36,rb:0},'L',Z(24,26,0)[0]-14,5,0,5,'#3a4650');
     R(sg,Z(24,26,0)[0]-14,Z(24,26,0)[1]-12,5,1,'#f0e6b0');R(ng,Z(24,26,0)[0]-15,Z(24,26,0)[1]-13,7,2,'#ffe59c');
     win(ng,{sx:Z(24,26,0)[0],sy:Z(24,26,0)[1],la:0,rb:28},'R',Z(24,26,0)[0]+4,2,2,3,COOL);
     R(sg,Z(24,26,0)[0]+4,Z(24,26,0)[1]-8,2,3,'#9fbcc6');
     // 格構警報桿（右前）
     {const b=F(29,5),top=lattice(sg,b[0],b[1],38,3,'#6a7d88','#4f606a');
      R(sg,b[0]-8,top+4,6,3,'#d8b34c');R(sg,b[0]-9,top+3,1,5,'#b8912e');R(sg,b[0]+3,top+4,6,3,'#c29c3c');R(sg,b[0]+9,top+3,1,5,'#9a7a2a');
      R(sg,b[0]-1,top-3,2,3,'#d24d42');R(ng,b[0]-1,top-3,2,2,'#ff5a4a');}
     veh(sg,F,26,18,6,3,5,'#e8e8e0','b','#34434e');{const p=F(29,22);R(sg,p[0]-3,p[1]-6,4,1,'#d49a43');}
     tree(sg,g,F(3,29)[0],F(3,29)[1],3);
     K.after=gg=>{fence(gg,F,1,31,31,31,4,'#7d878d');fence(gg,F,31,1,31,31,4,'#7d878d');};
     finishSc(K,k,2,OL,SHD_SC);}
  }catch(e){console.error('v574 k133',e);}

  /* ================= 車庫機廠共用（1× 原圖、T573 會自動補剪影光影） ================= */
  const OLD=[26,30,44],SHD2=[13,16,55,19],SHD3=[20,24,82,27];
  const GL='#34465a',GLL='#5a6f84';
  const ZF=(F,z)=>(a,b)=>UP(F(a,b),z);
  // 任意方向軌道：道碴床＋枕木＋雙軌
  function track(g,F,a0,b0,a1,b1,bed){
    const da=a1-a0,db=b1-b0,L=Math.hypot(da,db),ux=da/L,uy=db/L,px=-uy,py=ux,w=1.7;
    poly(g,[F(a0+px*w,b0+py*w),F(a1+px*w,b1+py*w),F(a1-px*w,b1-py*w),F(a0-px*w,b0-py*w)],bed||'#77716a');
    for(let t=.7;t<L;t+=1.6){const a=a0+ux*t,b=b0+uy*t;isoLine(g,F,a+px*1.4,b+py*1.4,a-px*1.4,b-py*1.4,'#5b4d3e');}
    for(const q of [-.75,.75])isoLine(g,F,a0+px*q,b0+py*q,a1+px*q,b1+py*q,'#b9bdc4');
  }
  // 軌道車輛／公車：分格窗、端面擋風窗、腰帶、頭燈
  function car(g,ng,F,a,b,len,wid,ht,col,along,o){
    o=o||{};const la=along==='a'?2*len:2*wid,rb=along==='a'?2*wid:2*len;
    const S=along==='a'?F(a+len,b+wid):F(a+wid,b+len);
    const P=prism(g,S,la,rb,ht,sh(col,6),sh(col,-30),o.roof||sh(col,22));
    const gl=o.glass||'#2e3e4c',wh=o.wh||2,wb=ht-wh-(o.wtop||2);
    const lf=along==='a'?'L':'R',ef=along==='a'?'R':'L',L=along==='a'?la:rb,x0=along==='a'?P.sx-la:P.sx;
    const step=o.step||5,ww=o.ww||3;let i=0;
    for(let q=2;q+ww<=L-2;q+=step,i++){win(g,P,lf,x0+q,ww,wb,wh,lf==='R'?sh(gl,-6):gl);if(ng&&o.lit&&i%2===0)win(ng,P,lf,x0+q,ww,wb,wh,o.lit);}
    const E=along==='a'?rb:la,e0=along==='a'?P.sx:P.sx-la;
    if(E>=4)win(g,P,ef,e0+1,E-2,wb,wh,ef==='R'?sh(gl,-6):gl);
    if(o.stripe){band(g,P,'L',2,1,o.stripe);band(g,P,'R',2,1,sh(o.stripe,-30));}
    if(o.head&&E>=4){win(g,P,ef,e0+1,1,1,1,'#f4eed0');win(g,P,ef,e0+E-2,1,1,1,'#f4eed0');
      if(ng){win(ng,P,ef,e0+1,1,1,1,'#fff2c0');win(ng,P,ef,e0+E-2,1,1,1,'#fff2c0');}}
    return P;
  }
  // 拱形開口（逐欄高度）：x0 起欄、w 寬、ht 中央高
  function archCut(g,P,face,x0,w,hb,ht,c){
    const r=w/2;for(let i=0;i<w;i++){const d=Math.abs(i+.5-r)/r,hh=ht-Math.round(r*(1-Math.sqrt(Math.max(0,1-d*d))));win(g,P,face,x0+i,1,hb,hh,c);}
  }
  function archOpen(g,P,face,x0,w,hb,ht,c,frame){archCut(g,P,face,x0-1,w+2,hb,ht+1,frame);archCut(g,P,face,x0,w,hb,ht,c);}
  // 3×5 像素字
  const GLY={B:'110101110101110',U:'101101101101111',S:'111100111001111',M:'101111111101101',T:'111010010010010'};
  function word(g,x,y,txt,c){let cx=x;for(const ch of txt){const p=GLY[ch];if(p)for(let i=0;i<15;i++)if(p[i]==='1')R(g,cx+(i%3),y+((i/3)|0),1,1,c);cx+=4;}}

  /* ================= k175 公車車庫（2×2） ================= */
  try{
    const k=175,PL='#8f8a80',PD='#79746a',PLL='#a19c92',BUSC='#e0b64d';
    // v1：鋸齒天窗大車庫（四道鋸齒＋三車位捲門）＋兩輛出庫公車＋站牌柱（封閉、厚重）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,2,30,21,32,'#6f6e69');
     for(const a of [11,19])isoLine(g,F,a,22,a,31,'#d8c070');
     const P=boxG(sg,F,3,27,4,21,18,'#98a0ae','#6e7686',null);
     band(sg,P,'L',15,2,BUSC);band(sg,P,'R',15,2,sh(BUSC,-36));
     for(let i=0;i<4;i++){const ta=3+6*i,H=18,U=9;
       poly(sg,[Z(ta,4,H),Z(ta,21,H),Z(ta+6,21,H+U),Z(ta+6,4,H+U)],'#7c8490');
       poly(sg,[Z(ta+6,4,H),Z(ta+6,21,H),Z(ta+6,21,H+U),Z(ta+6,4,H+U)],'#8fb4c6');
       {const p=Z(ta+6,12.5,H),q=Z(ta+6,12.5,H+U);line(sg,p[0],p[1],q[0],q[1],'#5f7f90');}
       poly(sg,[Z(ta,21,H),Z(ta+6,21,H),Z(ta+6,21,H+U)],'#a7afbc');}
     // 三車位
     const bayX=a=>F(a,21)[0];
     [7,15,23].forEach((a,i)=>{const x0=bayX(a)-5;win(sg,P,'L',x0-1,12,0,14,'#565d68');win(sg,P,'L',x0,10,0,13,'#262b33');
       if(i===1)for(let hb=1;hb<13;hb+=2)win(sg,P,'L',x0,10,hb,1,'#5d6570');
       win(sg,P,'L',x0+3,4,15-1,1,'#f4e6b0');win(ng,P,'L',x0+2,6,14,1,'#ffe59c');});
     win(sg,P,'R',P.sx+26,4,0,8,'#3d4450');
     winRow(sg,ng,P,'R',8,4,4,7,GLL,WARM,3,2,0);
     // 出庫公車
     car(sg,ng,F,5,21,8,4,9,BUSC,'b',{roof:'#f1efe6',stripe:'#b8433a',wh:3,step:5,ww:3,lit:WARM,head:1});
     car(sg,ng,F,21,21,6,4,9,BUSC,'b',{roof:'#f1efe6',stripe:'#b8433a',wh:3,step:5,ww:3,head:1});
     // 站牌柱
     {const p=F(30,30);post(sg,p[0]+6,p[1]-2,16,'#8a959c','#5d676e');R(sg,p[0]+2,p[1]-22,9,9,BUSC);R(sg,p[0]+2,p[1]-14,9,1,sh(BUSC,-40));word(sg,p[0]+5,p[1]-20,'B','#2a2e36');R(ng,p[0]+2,p[1]-22,9,8,'rgba(255,214,120,.85)');}
     finish(K,k,1,OLD,SHD2);}
    // v2：電動公車充電場（兩列太陽能棚＋充電樁）＋兩層調度樓與招牌（開放、輕盈）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,11,32,1,32,'#6f6e69');
     for(const b of [13,25])isoLine(g,F,12,b,31,b,'#d8c070');
     tree(sg,g,F(3,4)[0],F(3,4)[1],4);tree(sg,g,F(8,2)[0],F(8,2)[1],3);
     // 調度樓
     {const P=boxG(sg,F,2,10,14,30,20,'#d8d2c2','#aaa493','#8d8a82');
      band(sg,P,'L',10,1,'#b9b2a0');band(sg,P,'R',10,1,'#8e8878');
      winRow(sg,ng,P,'L',13,4,3,6,GLL,WARM,2,2,0);winRow(sg,ng,P,'R',3,4,3,6,GLL,WARM,3,2,1);winRow(sg,ng,P,'R',13,4,3,6,GLL,WARM,3,3,0);
      win(sg,P,'L',P.sx-6,4,0,7,'#3d4450');R(sg,P.sx-7,rowL(P,P.sx-7,8)-1,6,1,BUSC);
      const sx=P.W[0]+10,sy=P.W[1]-6;post(sg,sx+2,sy+5,4,'#6a747c');post(sg,sx+15,sy-1,4,'#6a747c');
      R(sg,sx-1,sy-6,19,8,'#2a2e36');R(sg,sx,sy-5,17,6,BUSC);word(sg,sx+3,sy-4,'BUS','#2a2e36');R(ng,sx,sy-5,17,6,'rgba(255,214,120,.8)');}
     // 兩列充電棚（後→前）
     const shed=(b0,b1,busB)=>{
       for(const a of [12.5,21.5,30.5])post(sg,F(a,b0+.5)[0],F(a,b0+.5)[1],13,'#9aa0a6','#6e747a');
       car(sg,ng,F,14,busB,14,4,9,'#dfe6e8','a',{roof:'#f4f6f4',stripe:'#3aa06a',wh:3,lit:WARM,head:1});
       {const p=F(29.5,busB+4.5);R(sg,p[0],p[1]-7,2,7,'#3d4450');R(sg,p[0],p[1]-6,1,1,'#6ae08a');R(ng,p[0],p[1]-6,1,1,'#7aff9a');}
       for(const a of [12.5,21.5,30.5])post(sg,F(a,b1-.5)[0],F(a,b1-.5)[1],13,'#9aa0a6','#6e747a');
       const C=boxG(sg,F,12,31,b0,b1,2,'#b8bcc0','#84888c','#3f5f86',13);cutG(ng,F,12,31,b0,b1,2,13);
       for(let a=15;a<31;a+=3){const p=Z(a,b0,15),q=Z(a,b1,15);line(sg,p[0]+1,p[1],q[0]+1,q[1],'#6f93b8');}
       {const p=Z(12,(b0+b1)/2,15),q=Z(31,(b0+b1)/2,15);line(sg,p[0],p[1],q[0],q[1],'#56779e');}
     };
     shed(3,11,5);shed(15,23,17);
     tree(sg,g,F(20,31)[0],F(20,31)[1],3);
     finish(K,k,2,OLD,SHD2);}
  }catch(e){console.error('v574 k175',e);}

  /* ================= k176 輕軌車庫（2×2） ================= */
  try{
    const k=176,PL='#8f8a80',PD='#79746a',PLL='#a19c92',TRC='#55cbd0';
    // v1：紅磚山牆老車庫（雙拱門＋圓窗＋拱窗）＋出庫路面電車＋架空線（歷史、高山牆）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,68,148,64,PL,PD,PLL);
     track(g,F,9.5,20,9.5,32);track(g,F,17.5,20,17.5,32);
     tree(sg,g,F(28,2)[0],F(28,2)[1],4);
     const P=boxG(sg,F,4,26,4,20,20,'#b0704c','#8a5a40',null);
     band(sg,P,'L',0,2,'#c9b89a');band(sg,P,'R',0,2,'#a39478');band(sg,P,'L',18,2,'#dccfb4');band(sg,P,'R',18,2,'#b4a78c');
     const G=gable(sg,P,'b',14,'#5b5763','#7b7784','#b8764f','#3e3b46');
     {const x=Math.round(G.M[0]),y=Math.round(G.M[1])+8;ellF(sg,x+.5,y,3.5,3.5,'#dccfb4');ellF(sg,x+.5,y,2.4,2.4,'#34465a');R(ng,x-1,y-1,3,3,WARM);}
     for(const a of [9.5,17.5]){const cx=F(a,20)[0];archOpen(sg,P,'L',cx-4,8,0,15,'#2a2622','#dccfb4');}
     for(const x of [P.sx+5,P.sx+14,P.sx+23]){archOpen(sg,P,'R',x,4,6,9,'#44586a','#b4a78c');}
     win(ng,P,'R',P.sx+5,4,6,8,WARM);win(ng,P,'R',P.sx+23,4,6,8,WARM);
     for(const a of [9.5,17.5]){const cx=F(a,20)[0];R(sg,cx-1,rowL(P,cx-1,17)-1,2,1,'#f4e6b0');R(ng,cx-2,rowL(P,cx-2,17)-1,4,2,'#ffe59c');}
     // 架空線柱（後排）
     for(const a of [6,21])post(sg,F(a,24)[0],F(a,24)[1],19,'#6a747c','#4a525a');
     car(sg,ng,F,8,20,9,3,9,TRC,'b',{roof:'#ece6d0',stripe:'#f0ead6',wh:3,step:4,ww:2,lit:WARM,head:1});
     {const t=Z(9.5,24,9);line(sg,t[0]-2,t[1],t[0]+1,t[1]-5,'#3a4048');line(sg,t[0]+2,t[1],t[0]-1,t[1]-5,'#3a4048');}
     for(const a of [6,21])post(sg,F(a,30)[0],F(a,30)[1],19,'#6a747c','#4a525a');
     K.after=gg=>{for(const b of [24,30]){const p=Z(6,b,18),q=Z(21,b,18);line(gg,p[0],p[1],q[0],q[1],'#4a525a');}
       for(const a of [9.5,17.5]){const p=Z(a,20,15),q=Z(a,32,15);line(gg,p[0],p[1],q[0],q[1],'#3a4048');}};
     // 值班亭（右側）
     {const Q=boxG(sg,F,27,31,12,17,11,'#d8d2c2','#aaa493','#8a5a40');win(sg,Q,'L',Q.sx-6,3,4,4,GLL);win(ng,Q,'L',Q.sx-6,3,4,4,WARM);win(sg,Q,'R',Q.sx+3,3,0,7,'#3d4450');}
     tree(sg,g,F(30,25)[0],F(30,25)[1],3);
     finish(K,k,1,OLD,SHD2);}
    // v2：開放式筒拱鋼棚（三軌）＋棚內兩列＋出庫一列＋前方電車線門架＋玻璃控制室（現代、通透）
    {const K=kit(136,150,68,148),F=ISO(68,84),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,68,148,64,PL,PD,PLL);
     paveG(g,F,2,26,2,32,'#86817a');
     for(const a of [6.5,13.5,20.5])track(g,F,a,1,a,32);
     tree(sg,g,F(29,3)[0],F(29,3)[1],4);
     const P=prism(sg,UP(F(24,23),16),42,40,2,null,null,null);
     const pts=[];for(let i=0;i<=P.la;i++){const t=i/P.la;pts.push([P.W[0]+(P.S[0]-P.W[0])*t,P.W[1]+(P.S[1]-P.W[1])*t-9*Math.sin(Math.PI*t)]);}
     poly(sg,pts,'#3c4248');
     for(const b of [3.5,10,16.5,23])post(sg,F(3.5,b)[0],F(3.5,b)[1],16,'#a7b0b6','#737c82');
     car(sg,ng,F,12,6,14,3,9,TRC,'b',{roof:'#e8eef0',stripe:'#2f7f86',wh:3,step:4,ww:3,lit:COOL});
     car(sg,ng,F,19,4,12,3,9,'#e8eef0','b',{roof:'#f4f6f6',stripe:TRC,wh:3,step:4,ww:3});
     car(sg,ng,F,5,19,11,3,9,TRC,'b',{roof:'#e8eef0',stripe:'#2f7f86',wh:3,step:4,ww:3,lit:COOL,head:1});
     for(const b of [3.5,10,16.5,23])post(sg,F(24,b)[0],F(24,b)[1],16,'#a7b0b6','#737c82');
     cutG(ng,F,3,24,3,23,11,16);
     {const Bm=boxG(sg,F,3,24,3,23,2,'#b4bcc2','#7f888e',null,16);
      vault(sg,Bm,9,'#cfd6da','#8f989f',null);
      for(let i=0;i+1<pts.length;i++)line(sg,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],'#5d666e');
      for(const a of [8,16]){const p=pts[Math.round((a-3)/21*P.la)];R(sg,p[0],p[1]+2,2,1,'#f4f0d0');R(ng,p[0]-1,p[1]+2,4,2,'#fff0b8');}}
     // 門架與架空線
     K.after=gg=>{const p=Z(2.5,29,17),q=Z(24.5,29,17);line(gg,p[0],p[1],q[0],q[1],'#4a525a');
       for(const a of [6.5,13.5,20.5]){const u=Z(a,23,15),v=Z(a,32,15);line(gg,u[0],u[1],v[0],v[1],'#3a4048');}};
     post(sg,F(2.5,29)[0],F(2.5,29)[1],17,'#6a747c','#4a525a');post(sg,F(24.5,29)[0],F(24.5,29)[1],17,'#6a747c','#4a525a');
     // 玻璃控制室（棚側）
     {const Q=boxG(sg,F,26,31,13,19,12,'#8fb8c8','#62808e','#c4ccd0');
      for(const x of [Q.sx-7,Q.sx-4])win(sg,Q,'L',x,1,0,12,'#4f6a78');band(sg,Q,'L',10,2,'#dfe4e6');band(sg,Q,'R',10,2,'#aab2b6');
      win(ng,Q,'L',Q.sx-9,8,2,7,'rgba(170,230,255,.75)');}
     tree(sg,g,F(29,27)[0],F(29,27)[1],3);
     finish(K,k,2,OLD,SHD2);}
  }catch(e){console.error('v574 k176',e);}

  /* ================= k177 鐵路車輛基地（3×3） ================= */
  try{
    const k=177,PL='#9a9484',PD='#7e786c',PLL='#aaa492',RC='#719be0';
    // v1：三股道檢修庫（山牆＋屋脊通風）＋出庫機車＋側線客車／貨車＋號誌樓＋照明塔（長庫房＋編組）
    {const K=kit(208,220,104,218),F=ISO(104,122),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,104,218,96,PL,PD,PLL);
     for(const a of [7.5,14.5,21.5])track(g,F,a,30,a,48);
     track(g,F,33.5,2,33.5,48);track(g,F,40.5,2,40.5,37);
     tree(sg,g,F(3,3)[0],F(3,3)[1],5);tree(sg,g,F(28,2)[0],F(28,2)[1],4);
     const P=boxG(sg,F,4,26,6,30,26,'#c0ad8e','#8e7f66',null);
     band(sg,P,'L',0,2,'#8e7f66');band(sg,P,'R',0,2,'#6f624e');band(sg,P,'L',24,2,'#d8ccb4');band(sg,P,'R',24,2,'#ab9f88');
     const G=gable(sg,P,'b',12,'#63676e','#8a8e94','#c0ad8e','#4a4e55');
     {const x=Math.round(G.M[0]),y=Math.round(G.M[1])+7;ellF(sg,x+.5,y,3.5,3.5,'#d8ccb4');ellF(sg,x+.5,y,2.4,2.4,GL);R(ng,x-1,y-1,3,3,WARM);}
     for(const t of [.22,.5,.78]){const x=G.M[0]+(G.M2[0]-G.M[0])*t,y=G.M[1]+(G.M2[1]-G.M[1])*t;crate(sg,[x+3,y+1],3,4,3,'#7a7e84');}
     for(const a of [7.5,14.5,21.5]){const cx=F(a,30)[0];archOpen(sg,P,'L',cx-5,10,0,19,'#2a2724','#d8ccb4');
       R(sg,cx-1,rowL(P,cx-1,21)-1,3,1,'#f4e6b0');R(ng,cx-2,rowL(P,cx-2,21)-1,5,2,'#ffe59c');}
     for(let x=P.sx+3,i=0;x+3<=P.sx+P.rb-2;x+=6,i++){win(sg,P,'R',x,3,6,12,GLL);if(i%2===0)win(ng,P,'R',x,3,6,12,WARM);}
     car(sg,ng,F,6,30,7,3,11,RC,'b',{roof:'#d8dce2',stripe:'#e8ecf0',wh:3,step:4,ww:2,lit:WARM});
     car(sg,ng,F,13,30,11,3,12,'#b84a3a','b',{roof:'#5a5f66',stripe:'#e0b64d',wh:3,step:6,ww:3,head:1});
     // 側線：客車兩節、貨車兩節
     car(sg,ng,F,32,4,13,3,11,RC,'b',{roof:'#d8dce2',stripe:'#e8ecf0',wh:3,step:4,ww:2,lit:WARM});
     car(sg,ng,F,32,18,13,3,11,RC,'b',{roof:'#d8dce2',stripe:'#e8ecf0',wh:3,step:4,ww:2});
     for(const b of [6,17]){const Q=crate(sg,F(42,b+10),6,20,12,'#8a5a3a');win(sg,Q,'R',Q.sx+9,3,1,9,'#6a4630');}
     {const p=F(40.5,37);R(sg,p[0]-3,p[1]-4,7,3,'#c0453a');R(sg,p[0]-3,p[1]-1,1,2,'#5a5e62');R(sg,p[0]+3,p[1]-1,1,2,'#5a5e62');}
     // 號誌樓
     {const Q=boxG(sg,F,40,47,40,47,12,'#b0704c','#8a5a40','#6a5a4a');const T=boxG(sg,F,40,47,40,47,6,'#9cc0cc','#6e909c',null,12);
      gable(sg,T,'a',5,'#5b5763','#7b7784','#8a5a40','#3e3b46');win(ng,T,'L',T.sx-12,10,1,4,WARM);win(sg,Q,'L',Q.sx-8,3,0,7,'#3d3a36');}
     // 照明塔
     {const p=F(2,38),top=lattice(sg,p[0],p[1],44,3,'#6a747c','#4f5860');R(sg,p[0]-4,top-2,9,3,'#8a939a');R(sg,p[0]-3,top+1,7,1,'#f4eed0');R(ng,p[0]-4,top+1,9,2,'#fff2c0');}
     finish(K,k,1,OLD,SHD3);}
    // v2：蒸汽時代扇形機車庫（五庫位弧形）＋轉車台＋上台機車＋水塔＋放射股道（圓弧、低矮）
    {const K=kit(208,220,104,218),F=ISO(104,122),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,104,218,96,PL,PD,PLL);
     const C0=30,R0=9,R1=15,R2=29,H=14,D=Math.PI/180,pa=(r,t)=>[C0+r*Math.cos(t*D),C0+r*Math.sin(t*D)];
     // 放射股道（地面）
     for(const t of [0,45,90]){const p=pa(R0,t),q=pa(t===45?24:19,t);track(g,F,p[0],p[1],q[0],q[1]);}
     for(let s2=0;s2<5;s2++){const t=173+26*s2,p=pa(R0,t),q=pa(R1+1,t);track(g,F,p[0],p[1],q[0],q[1]);}
     tree(sg,g,F(3,3)[0],F(3,3)[1],5);tree(sg,g,F(44,4)[0],F(44,4)[1],4);tree(sg,g,F(4,44)[0],F(4,44)[1],4);
     // 屋頂（全部）→ 內牆＋庫門 → 端牆
     const T0=160,NS=5,SW=26,SUB=6;
     const arc=(r,t0,t1,z)=>{const P=[];for(let i=0;i<=SUB;i++)P.push(UP(F(...pa(r,t0+(t1-t0)*i/SUB)),z));return P;};
     for(let s2=0;s2<NS;s2++){const t0=T0+SW*s2,t1=t0+SW;poly(sg,arc(R1,t0,t1,H).concat(arc(R2,t1,t0,H)),'#74695e');}
     {const P=arc(21.5,T0,T0+SW*NS,H+.5);for(let i=0;i+1<P.length;i++){}
      const L=[];for(let i=0;i<=40;i++)L.push(UP(F(...pa(22,T0+SW*NS*i/40)),H));for(let i=0;i+1<L.length;i++)line(sg,L[i][0],L[i][1],L[i+1][0],L[i+1][1],'#9aa6ac');}
     for(let s2=0;s2<NS;s2++){const t0=T0+SW*s2,t1=t0+SW;
       for(let i=0;i<SUB;i++){const ta=t0+SW*i/SUB,tb=t0+SW*(i+1)/SUB,tm=(ta+tb)/2,na=-Math.cos(tm*D),nb=-Math.sin(tm*D);
         const amt=Math.round(10*nb-14*na),p=pa(R1,ta),q=pa(R1,tb);
         poly(sg,[F(...p),F(...q),UP(F(...q),H),UP(F(...p),H)],sh('#a66b4a',amt));}
       const tc=t0+SW/2,d0=pa(R1,tc-6),d1=pa(R1,tc+6);
       poly(sg,[F(...d0),F(...d1),UP(F(...d1),10),UP(F(...d0),10)],'#2c2622');
       {const q=UP(F(...pa(R1,tc)),12);R(sg,q[0]-1,q[1],3,1,'#f4e6b0');R(ng,q[0]-2,q[1],5,2,'#ffe59c');}
       {const v=UP(F(...pa(25,tc)),H);crate(sg,[v[0],v[1]+2],3,3,4,'#4a4440');}
     }
     {const t=T0,p=pa(R1,t),q=pa(R2,t);poly(sg,[F(...p),F(...q),UP(F(...q),H),UP(F(...p),H)],sh('#a66b4a',8));}
     {const t=T0+SW*NS,p=pa(R1,t),q=pa(R2,t);poly(sg,[F(...p),F(...q),UP(F(...q),H),UP(F(...p),H)],sh('#a66b4a',-18));
      const m=pa(22,t);const w=UP(F(...m),7);R(sg,w[0]-2,w[1]-2,4,4,GLL);R(ng,w[0]-2,w[1]-2,4,4,WARM);}
     {const L=arc(R1,T0,T0+SW*NS,H);for(let i=0;i+1<L.length;i++)line(sg,L[i][0],L[i][1],L[i+1][0],L[i+1][1],'#c8b8a0');
      const L2=[];for(let i=0;i<=40;i++)L2.push(UP(F(...pa(R1,T0+SW*NS*i/40)),H));for(let i=0;i+1<L2.length;i++)line(sg,L2[i][0],L2[i][1],L2[i+1][0],L2[i+1][1],'#c8b8a0');}
     // 轉車台（地面坑＋橋＋機車）
     K.after=null;
     {const c=F(C0,C0);ellF(sg,c[0]+.5,c[1],R0*2.83+1.5,R0*1.41+1,'#8a8478');ellF(sg,c[0]+.5,c[1],R0*2.83,R0*1.41,'#4f4a42');ellF(sg,c[0]+.5,c[1]+1,R0*2.83-3,R0*1.41-2,'#5d574d');
      const p=F(C0-R0,C0-.9),q=F(C0+R0,C0-.9),u=F(C0-R0,C0+.9);
      poly(sg,[F(C0-R0,C0-1.2),F(C0+R0,C0-1.2),F(C0+R0,C0+1.2),F(C0-R0,C0+1.2)],'#6e675c');
      isoLine(sg,F,C0-R0,C0-.6,C0+R0,C0-.6,'#b9bdc4');isoLine(sg,F,C0-R0,C0+.6,C0+R0,C0+.6,'#b9bdc4');}
     {const P=car(sg,ng,F,C0-6,C0-1.5,12,3,11,'#2f363d','a',{roof:'#454c54',stripe:'#b8433a',wh:3,step:12,ww:3,head:1});
      const f=UP(F(C0+4,C0),11);R(sg,f[0]-1,f[1]-5,3,5,'#262b30');R(sg,f[0]-2,f[1]-6,5,1,'#3a4046');}
     // 水塔
     {const c=F(42,22);for(const [dx,dy] of [[-5,-1],[5,-1],[-2,2],[2,2]])R(sg,c[0]+dx,c[1]+dy-20,1,21,'#5e5a54');
      line(sg,c[0]-5,c[1]-6,c[0]+5,c[1]-12,'#5e5a54');line(sg,c[0]+5,c[1]-6,c[0]-5,c[1]-12,'#5e5a54');
      frustum(sg,c[0],c[1]-20,7,7,10,y=>y%4===3?'#6d4a36':'#8a5e44');ellF(sg,c[0]+.5,c[1]-31,8,3,'#5e5a54');R(sg,c[0]-1,c[1]-34,3,3,'#4a4440');}
     car(sg,ng,F,28.5,39,9,3,11,RC,'b',{roof:'#d8dce2',stripe:'#e8ecf0',wh:3,step:4,ww:2,lit:WARM});
     lamp(sg,ng,F(20,44)[0],F(20,44)[1],10);lamp(sg,ng,F(44,20)[0],F(44,20)[1],10);
     finish(K,k,2,OLD,SHD3);}
  }catch(e){console.error('v574 k177',e);}

  /* ================= k178 地鐵機廠（3×3） ================= */
  try{
    const k=178,PL='#9a9484',PD='#7e786c',PLL='#aaa492',MC='#d27be0',TS='#c8ccd2';
    // v1：綠屋頂檢修大廳（三門＋天窗帶）＋下沉引道與隧道口＋出洞列車＋變電箱（地下→地面）
    {const K=kit(208,220,104,218),F=ISO(104,122),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z),FT=(a,b)=>UP(F(a,b),-6*Math.max(0,48-b)/26);
     ground(g,104,218,96,PL,PD,PLL);
     for(const a of [23.5,31.5,39.5])track(g,F,a,28,a,48);
     // 下沉引道
     paveG(g,F,4,13,22,48,'#57534c');
     poly(g,[F(4,22),F(4,48),FT(4,22)],'#8f8a80');
     track(g,FT,8.5,22,8.5,48,'#4a4640');
     isoLine(g,F,13,22,13,48,'#c9c3b6');isoLine(g,F,4,22,4,48,'#bdb7aa');
     tree(sg,g,F(4,5)[0],F(4,5)[1],5);tree(sg,g,F(11,3)[0],F(11,3)[1],4);tree(sg,g,F(3,12)[0],F(3,12)[1],3);
     // 隧道口
     {const P=boxG(sg,F,2,15,17,22,21,'#c2bcb0','#948f84','#6f8f5e',-6);
      band(sg,P,'L',18,3,'#dcd6ca');band(sg,P,'R',18,3,'#b0aa9e');
      const cx=F(8.5,22)[0];archOpen(sg,P,'L',cx-7,14,0,15,'#1a1816','#e2dccf');
      R(sg,cx-1,rowL(P,cx-1,16)-1,3,1,'#f4e6b0');R(ng,cx-2,rowL(P,cx-2,16)-1,5,2,'#ffe59c');}
     car(sg,ng,FT,7,22,7,3,9,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,lit:COOL,head:1});
     {const p=F(16,36);post(sg,p[0],p[1],12,'#8a959c','#5d676e');R(sg,p[0]-3,p[1]-19,7,7,MC);word(sg,p[0]-1,p[1]-18,'M','#ffffff');R(ng,p[0]-3,p[1]-19,7,7,'rgba(236,160,255,.85)');}
     // 檢修大廳
     const P=boxG(sg,F,18,44,4,28,22,'#c9ccd0','#9aa0a8',null);
     para(sg,P.S[0],P.S[1],P.la,P.rb,'#7b9a66',sh('#7b9a66',16),sh('#7b9a66',-26));
     {const FR=ZF(F,22);for(const a of [23,30,37])paveG(sg,FR,a,a+2,7,25,'#9cc4d6');}
     band(sg,P,'L',19,2,MC);band(sg,P,'R',19,2,sh(MC,-40));band(sg,P,'L',0,1,'#8a8e94');
     [23.5,31.5,39.5].forEach((a,i)=>{const cx=F(a,28)[0];win(sg,P,'L',cx-6,12,0,15,'#6a7078');win(sg,P,'L',cx-5,10,0,14,'#262a30');
       if(i===2)for(let hb=1;hb<14;hb+=2)win(sg,P,'L',cx-5,10,hb,1,'#5d6570');
       win(sg,P,'L',cx-1,3,16,1,'#f4e6b0');win(ng,P,'L',cx-2,5,16,1,'#ffe59c');});
     winRow(sg,ng,P,'R',9,3,4,6,GLL,COOL,3,2,0);
     car(sg,ng,F,30,28,12,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,lit:COOL,head:1});
     car(sg,ng,F,22,28,5,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3});
     // 變電箱
     {const Q=boxG(sg,F,43,47,33,43,9,'#b4bbc0','#879096','#c4cacd');band(sg,Q,'L',6,1,'#e0c050');band(sg,Q,'R',6,1,'#b09a3a');
      for(let x=Q.sx+2;x<Q.sx+18;x+=4)win(sg,Q,'R',x,2,1,4,'#6f777c');}
     lamp(sg,ng,F(15,46)[0],F(15,46)[1],10);
     finish(K,k,1,OLD,SHD3);}
    // v2：折板屋頂列車停留棚（四股道）＋洗車門架＋高聳行控塔（M 標）（長低棚＋細高塔）
    {const K=kit(208,220,104,218),F=ISO(104,122),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,104,218,96,PL,PD,PLL);
     paveG(g,F,3,36,4,48,'#8a847a');
     for(const a of [7.5,14.5,21.5,28.5])track(g,F,a,3,a,48);
     tree(sg,g,F(44,24)[0],F(44,24)[1],4);
     for(const b of [8,20])post(sg,F(4,b)[0],F(4,b)[1],15,'#a7b0b6','#737c82');
     car(sg,ng,F,6,5,12,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,lit:COOL});
     car(sg,ng,F,6,18,12,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3});
     car(sg,ng,F,13,14,13,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3});
     car(sg,ng,F,13,28,13,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,lit:COOL,head:1});
     car(sg,ng,F,20,6,12,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,lit:COOL});
     car(sg,ng,F,20,19,12,3,10,TS,'b',{roof:'#e6e8ea',stripe:MC,wh:3,step:4,ww:3,head:1});
     for(const b of [8,20])post(sg,F(34,b)[0],F(34,b)[1],15,'#a7b0b6','#737c82');
     for(const a of [4,19,34])post(sg,F(a,32)[0],F(a,32)[1],15,'#a7b0b6','#737c82');
     // 折板屋頂（先擦掉棚下車窗夜光）
     cutG(ng,F,4,34,6,32,6,13);
     for(let i=0;i<6;i++){const a0=4+5*i;
       poly(sg,[Z(a0,6,15),Z(a0,32,15),Z(a0+2.5,32,19),Z(a0+2.5,6,19)],'#dfe3e4');
       poly(sg,[Z(a0+2.5,6,19),Z(a0+2.5,32,19),Z(a0+5,32,15),Z(a0+5,6,15)],'#a3a9ae');
       poly(sg,[Z(a0,32,15),Z(a0+2.5,32,19),Z(a0+2.5,32,17),Z(a0,32,13)],'#c3c8cb');
       poly(sg,[Z(a0+2.5,32,19),Z(a0+5,32,15),Z(a0+5,32,13),Z(a0+2.5,32,17)],'#8e949a');
       {const p=Z(a0+2.5,32,17);R(sg,p[0]-1,p[1]+1,2,1,'#f4f0d0');R(ng,p[0]-2,p[1]+1,4,2,'#fff0b8');}}
     {const p=Z(34,6,15),q=Z(34,32,15),r=Z(34,32,13),t=Z(34,6,13);poly(sg,[p,q,r,t],'#8e949a');}
     // 洗車門架（第四股道前段）
     {for(const a of [26.5,30.5])post(sg,F(a,44)[0],F(a,44)[1],14,'#6a747c','#4a525a');
      const p=Z(26.5,44,14),q=Z(30.5,44,14);R(sg,p[0],p[1]-1,q[0]-p[0]+1,3,'#4f8fc0');
      for(const a of [27.5,29.5]){const u=Z(a,44,12);R(sg,u[0]-1,u[1],2,10,'#3a78b0');}}
     // 行控塔
     {const P=boxG(sg,F,38,46,4,12,40,'#d4d7da','#a4a9ae','#8e949a');
      for(let hb=6;hb<36;hb+=7){win(sg,P,'L',P.sx-14,12,hb,2,GLL);win(sg,P,'R',P.sx+2,12,hb,2,sh(GLL,-10));}
      win(ng,P,'L',P.sx-14,12,20,2,COOL);win(ng,P,'R',P.sx+2,12,6,2,COOL);
      const T=boxG(sg,F,37,47,3,13,8,'#8fb8c8','#62808e','#6a7078',40);
      win(ng,T,'L',T.sx-18,16,1,6,'rgba(170,230,255,.8)');win(ng,T,'R',T.sx+2,16,1,6,'rgba(140,210,240,.7)');
      const c=T.S;R(sg,c[0]-4,c[1]-12,9,8,MC);word(sg,c[0]-1,c[1]-11,'M','#ffffff');R(ng,c[0]-4,c[1]-12,9,8,'rgba(236,160,255,.85)');
      R(sg,T.N[0],T.N[1]-10,1,8,'#6a747c');R(sg,T.N[0]-1,T.N[1]-12,3,2,'#d24d42');R(ng,T.N[0]-1,T.N[1]-12,3,2,'#ff5a4a');}
     tree(sg,g,F(42,30)[0],F(42,30)[1],4);tree(sg,g,F(40,42)[0],F(40,42)[1],3);
     finish(K,k,2,OLD,SHD3);}
  }catch(e){console.error('v574 k178',e);}

  /* ================= 大型園區共用（k135–138，1× 原圖、無貼地影；v0 為 5×5／6×6 英雄園區） ================= */
  // 四坡屋頂（la===rb 時為金字塔頂）：cF 前左坡（受光）、cR 右坡、cB 背坡
  function hip(g,P,rise,cF,cR,cB){
    const S=P.S,W=P.W,E=P.E,N=P.N,mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
    if(P.la>=P.rb){const t=(P.rb/2)/P.la,d=[W[0]-S[0],W[1]-S[1]],m1=mid(S,E),m2=mid(W,N);
      const M1=[m1[0]+d[0]*t,m1[1]+d[1]*t-rise],M2=[m2[0]-d[0]*t,m2[1]-d[1]*t-rise];
      poly(g,[E,N,M2,M1],cB);poly(g,[W,N,M2],sh(cF,-8));poly(g,[S,E,M1],cR);poly(g,[S,W,M2,M1],cF);
      line(g,M1[0],M1[1],M2[0],M2[1],sh(cF,18));line(g,S[0],S[1],M1[0],M1[1],sh(cR,-18));return {M1,M2};}
    const t=(P.la/2)/P.rb,d=[E[0]-S[0],E[1]-S[1]],m1=mid(S,W),m2=mid(E,N);
    const M1=[m1[0]+d[0]*t,m1[1]+d[1]*t-rise],M2=[m2[0]-d[0]*t,m2[1]-d[1]*t-rise];
    poly(g,[W,N,M2,M1],cB);poly(g,[E,N,M2],sh(cR,-6));poly(g,[S,E,M2,M1],cR);poly(g,[S,W,M1],cF);
    line(g,M1[0],M1[1],M2[0],M2[1],sh(cF,18));line(g,S[0],S[1],M1[0],M1[1],sh(cR,-18));return {M1,M2};
  }
  // 帶狀玻璃（豎梃分格）；every＝夜燈節奏（格）
  function ribbon(g,ng,P,face,hb,ht,glass,mull,step,lit,every,p0,p1){
    const L=face==='L'?P.la:P.rb,xs=face==='L'?P.sx-P.la:P.sx,a=xs+(p0==null?3:p0),b=xs+L-(p1==null?3:p1);
    if(b<=a)return;win(g,P,face,a,b-a,hb,ht,glass);win(g,P,face,a,b-a,hb+ht-1,1,sh(glass,22));
    for(let x=a+step;x<b;x+=step)win(g,P,face,x,1,hb,ht,mull);
    if(ng&&lit){let j=0;for(let x=a;x<b;x+=step,j++)if(j%(every||2)===0)win(ng,P,face,x+1,Math.max(1,Math.min(step-1,b-x-1)),hb,ht,lit);}
  }
  // 屋頂直升機坪（螢幕座標）
  function padXY(g,cx,cy,rx){const ry=Math.max(3,rx/2);ellF(g,cx+.5,cy,rx+.5,ry+.5,'#58616a');ellF(g,cx+.5,cy,rx-1,ry-.5,'#e0c050');ellF(g,cx+.5,cy,rx-2,ry-1.5,'#636c72');
    R(g,cx-2,cy-2,1,4,'#f0f0ea');R(g,cx+2,cy-2,1,4,'#f0f0ea');R(g,cx-1,cy-1,3,1,'#f0f0ea');}
  function flag(g,x,y,h,col){R(g,x,y-h,1,h+1,'#8a939a');R(g,x+1,y-h,5,3,col);R(g,x+1,y-h+2,5,1,sh(col,-30));}
  // 牆面紅十字牌（白底）：x0 起欄，面板 9 欄 × 9 高
  function crossPanel(g,ng,P,face,x0,hb,s){s=s||9;const t=(s/3)|0,o=(s-t)>>1;win(g,P,face,x0,s,hb,s,'#f6f7f4');win(g,P,face,x0+o,t,hb+1,s-2,'#d84c47');win(g,P,face,x0+1,s-2,hb+o,t,'#d84c47');
    if(ng){win(ng,P,face,x0+o,t,hb+1,s-2,'#ff7770');win(ng,P,face,x0+1,s-2,hb+o,t,'#ff7770');}}
  // 夜圖遮擋：以方盒剪影擦掉後方已畫的夜光
  function cutG(ng,F,a0,a1,b0,b1,h,z){ng.save();ng.globalCompositeOperation='destination-out';boxG(ng,F,a0,a1,b0,b1,h,'#000','#000','#000',z,true);ng.restore();}
  const WLIT='#ffe7ac';

  /* ================= k135 大型醫學中心（5×5） ================= */
  try{
    const k=135,OL=[52,62,72],GD=['#a5aa96','#8f9580','#b6bba8'],PAVE='#b8b1a7',LAWN='#78ae66';
    const WL='#e7ebed',WR='#c8d0d3',GLS='#55748a';
    // v1：現代醫療巨構——兩層裙樓＋L 形病房板樓（頂樓直升機坪、紅十字）＋急診雨庇與救護車＋停車場（胖、中高、橫向）
    {const K=kit(336,420,168,418),F=ISO(168,258),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,168,418,160,...GD);
     paveG(g,F,20,74,46,58,PAVE);paveG(g,F,58,66,58,80,PAVE);
     paveG(g,F,4,30,50,76,'#6d716c');
     for(let a=8;a<=28;a+=5){isoLine(g,F,a,51,a,57,'#dcd8cc');isoLine(g,F,a,69,a,75,'#dcd8cc');}
     paveG(g,F,32,58,60,80,LAWN);paveG(g,F,66,80,60,80,LAWN);paveG(g,F,2,18,12,44,'#86b86f');
     tree(sg,g,F(8,8)[0],F(8,8)[1],5);tree(sg,g,F(76,8)[0],F(76,8)[1],5);tree(sg,g,F(6,26)[0],F(6,26)[1],4);
     tree(sg,g,F(77,26)[0],F(77,26)[1],4);tree(sg,g,F(12,40)[0],F(12,40)[1],4);tree(sg,g,F(77,42)[0],F(77,42)[1],4);
     // 裙樓
     const P0=boxG(sg,F,20,70,10,46,22,WL,WR,'#bfc6c6');
     ribbon(sg,ng,P0,'L',4,4,GLS,WL,8,WLIT,3,3,58);ribbon(sg,ng,P0,'L',13,4,GLS,WL,8,WLIT,2,3,3);
     ribbon(sg,ng,P0,'R',4,4,sh(GLS,-8),WR,8,WLIT,3,3,3);ribbon(sg,ng,P0,'R',13,4,sh(GLS,-8),WR,8,WLIT,2,3,3);
     {const x=F(38,46)[0];win(sg,P0,'L',x,16,0,9,'#3f4c56');win(sg,P0,'L',x,16,8,1,'#9dbbca');win(ng,P0,'L',x+1,14,1,7,'rgba(255,215,150,.55)');}
     // 病房板樓 A（長）＋ B（短，形成 L）
     const PA=boxG(sg,F,26,64,16,28,72,'#eef1f2',WR,'#d9dedf',22);
     for(let hb=6,r=0;hb<66;hb+=10,r++){winRow(sg,ng,PA,'L',hb,3,4,9,GLS,WLIT,4,2,r);winRow(sg,ng,PA,'R',hb,3,4,9,sh(GLS,-8),WLIT,4,2,r+1);}
     crossPanel(sg,ng,PA,'L',PA.sx-19,52,15);
     padXY(sg,F(36,22)[0],F(36,22)[1]-94,9);
     boxG(sg,F,52,60,18,26,6,'#b9c1c4','#8f989c','#a4acb0',94);
     {const t=UP(F(60,18),100);R(sg,t[0],t[1]-8,1,8,'#7f8b92');R(sg,t[0]-1,t[1]-10,3,2,'#d44e48');R(ng,t[0]-1,t[1]-10,3,2,'#ff665d');}
     const PB=boxG(sg,F,48,62,28,44,44,'#e9edee',WR,'#d0d6d7',22);cutG(ng,F,48,62,28,44,44,22);
     for(let hb=6,r=0;hb<40;hb+=10,r++){winRow(sg,ng,PB,'L',hb,3,4,9,GLS,WLIT,4,2,r+1);winRow(sg,ng,PB,'R',hb,3,4,9,sh(GLS,-8),WLIT,4,2,r);}
     band(sg,PB,'L',42,2,'#d84c47');band(sg,PB,'R',42,2,'#a83a36');
     // 急診雨庇＋救護車
     const CN=boxG(sg,F,34,50,46,54,2,'#d6534d','#a8403a','#e8eceb',10);cutG(ng,F,34,50,46,54,2,10);
     post(sg,F(34,53.5)[0]+1,F(34,53.5)[1],10,'#9aa3a8','#6e777c');post(sg,F(50,53.5)[0],F(50,53.5)[1],10,'#9aa3a8','#6e777c');
     win(ng,CN,'L',CN.sx-CN.la+2,CN.la-4,0,1,'rgba(255,215,150,.6)');
     {const V=veh(sg,F,40,56,5,3,5,'#f2f2ec','b','#34434e');band(sg,V,'L',1,1,'#d6534d');band(sg,V,'R',1,1,'#a8403a');R(sg,V.S[0]-1,V.S[1]-6,2,1,'#d84c47');R(ng,V.S[0]-1,V.S[1]-6,2,1,'#ff665d');}
     // 停車場車輛
     veh(sg,F,9,51,2,5,4,'#5a7ca8','a');veh(sg,F,19,51,2,5,4,'#c8c8c0','a');veh(sg,F,14,70,2,5,4,'#b84a3a','a');veh(sg,F,24,70,2,5,4,'#3e4a52','a');
     for(const [a,b] of [[30,60],[56,52],[72,56],[46,78]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     tree(sg,g,F(42,70)[0],F(42,70)[1],5);tree(sg,g,F(54,76)[0],F(54,76)[1],4);tree(sg,g,F(72,68)[0],F(72,68)[1],5);
     finish(K,k,1,OL,null);}
    // v2：老院區——紅瓦四坡行政樓＋鐘樓＋兩翼山牆病房（拱窗）圍出前庭花園與噴泉；翼端救護車門廊（低矮、展開、古典）
    {const K=kit(336,420,168,418),F=ISO(168,258),g=K.g,sg=K.sg,ng=K.ng;
     const CL='#ede4cf',CR='#cdbfa5',RF='#c45a42',TRIM='#f7f1e3',AG='#55748a';
     ground(g,168,418,160,...GD);
     paveG(g,F,28,80,28,80,'#86b86f');
     paveG(g,F,49,53,34,80,'#d8cdb0');paveG(g,F,34,80,49,53,'#d8cdb0');
     {const c=F(51,51);ellF(g,c[0]+.5,c[1],13,6.5,'#d8cdb0');ellF(g,c[0]+.5,c[1],9,4.5,'#9aa39a');ellF(g,c[0]+.5,c[1]-.5,7.5,3.5,'#54abc0');}
     paveG(g,F,70,80,14,30,PAVE);
     tree(sg,g,F(6,6)[0],F(6,6)[1],5);tree(sg,g,F(8,30)[0],F(8,30)[1],4);tree(sg,g,F(30,8)[0],F(30,8)[1],4);
     // 行政樓＋四坡紅瓦＋鐘樓
     const C=boxG(sg,F,14,36,14,36,30,CL,CR,null);
     band(sg,C,'L',0,2,sh(CR,-10));band(sg,C,'R',0,2,sh(CR,-24));band(sg,C,'L',28,2,TRIM);band(sg,C,'R',28,2,sh(TRIM,-20));
     for(const x of [C.sx-14,C.sx-7])archWin(sg,ng,C,'L',x,3,6,14,AG,TRIM,WLIT);
     archWin(sg,null,C,'R',C.sx+5,3,6,14,sh(AG,-8),sh(TRIM,-20));
     hip(sg,C,12,RF,sh(RF,-26),sh(RF,-14));
     const T=boxG(sg,F,21,29,21,29,30,CL,CR,null,38);
     band(sg,T,'L',27,2,TRIM);band(sg,T,'R',27,2,sh(TRIM,-20));
     archWin(sg,ng,T,'L',T.sx-11,5,15,9,'#3a3f46',TRIM,null);archWin(sg,null,T,'R',T.sx+5,5,15,9,'#30353c',sh(TRIM,-20));
     {const cx=T.sx-8,cy=rowL(T,cx,6)-3;ellF(sg,cx+.5,cy,4,4,sh(CR,-30));ellF(sg,cx+.5,cy,3,3,TRIM);R(sg,cx,cy-2,1,3,'#3a3f46');R(sg,cx,cy,2,1,'#3a3f46');ellF(ng,cx+.5,cy,3,3,'rgba(255,231,172,.85)');}
     hip(sg,T,14,RF,sh(RF,-26),sh(RF,-14));
     {const Q=boxG(sg,F,34,40,34,40,13,CL,CR,null);win(sg,Q,'L',Q.sx-9,6,0,8,'#5b4938');win(sg,Q,'R',Q.sx+3,6,0,8,'#4a3a2c');
      band(sg,Q,'L',11,2,TRIM);band(sg,Q,'R',11,2,sh(TRIM,-20));hip(sg,Q,5,RF,sh(RF,-26),sh(RF,-14));
      win(ng,Q,'L',Q.sx-8,4,1,6,'rgba(255,215,150,.6)');}
     // 左翼（沿 b）與右翼（沿 a）：山牆端、拱窗朝前庭
     const W1=boxG(sg,F,16,28,36,72,24,CL,CR,null),E1=boxG(sg,F,36,72,16,28,24,CL,CR,null);
     for(const [P,face] of [[W1,'R'],[E1,'L']]){
       band(sg,P,'L',0,2,sh(CR,-10));band(sg,P,'R',0,2,sh(CR,-24));band(sg,P,'L',22,2,TRIM);band(sg,P,'R',22,2,sh(TRIM,-20));
       const L=face==='L'?P.la:P.rb,x0=face==='L'?P.sx-P.la:P.sx;let i=0;
       for(let o=5;o+3<=L-4;o+=9,i++)archWin(sg,ng,P,face,x0+o,3,5,13,face==='L'?AG:sh(AG,-8),face==='L'?TRIM:sh(TRIM,-20),i%2===0?WLIT:null);
     }
     gable(sg,W1,'b',10,RF,sh(RF,-14),CL,sh(RF,-36));gable(sg,E1,'a',10,RF,sh(RF,-26),CR,sh(RF,-40));
     crossPanel(sg,ng,W1,'L',W1.sx-16,9);win(sg,W1,'L',W1.sx-8,4,0,8,'#5b4938');
     win(sg,E1,'R',E1.sx+8,8,0,9,'#5b4938');crossPanel(sg,ng,E1,'R',E1.sx+7,12);
     // 救護車門廊（右翼端）
     boxG(sg,F,72,78,17,27,2,'#d6534d','#a8403a','#e8eceb',11);
     post(sg,F(77.5,17.5)[0],F(77.5,17.5)[1],11,'#9aa3a8','#6e777c');post(sg,F(77.5,26.5)[0],F(77.5,26.5)[1],11,'#9aa3a8','#6e777c');
     {const V=veh(sg,F,70,30,6,3,5,'#f2f2ec','a','#34434e');band(sg,V,'L',1,1,'#d6534d');band(sg,V,'R',1,1,'#a8403a');}
     tree(sg,g,F(36,64)[0],F(36,64)[1],5);tree(sg,g,F(64,36)[0],F(64,36)[1],5);tree(sg,g,F(40,77)[0],F(40,77)[1],4);tree(sg,g,F(77,62)[0],F(77,62)[1],4);
     for(const [a,b] of [[46,46],[56,56],[46,70],[70,46]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,2,OL,null);}
  }catch(e){console.error('v574 k135',e);}

  /* ================= k136 文化藝術中心（5×5） ================= */
  try{
    const k=136,OL=[56,60,72],GD=['#9aaa82','#879572','#acb995'],PLZ='#d9cbae',LAWN='#7db166';
    // v1：音樂廳圓廳（柱式鼓座＋銅綠穹頂＋山花門廊）＋左右長廊畫廊（拱窗、天窗）＋前方下沉露天劇場（圓、古典、中央量體）
    {const K=kit(336,400,168,398),F=ISO(168,238),g=K.g,sg=K.sg,ng=K.ng;
     const WL='#eee8dc',WR='#cec5b8',TRIM='#f7f2e6',GLS='#607b8b';
     ground(g,168,398,160,...GD);
     paveG(g,F,20,80,20,50,PLZ);paveG(g,F,28,40,50,80,PLZ);paveG(g,F,40,80,40,80,LAWN);
     // 下沉劇場（階梯同心環＋舞台＋音樂殼）
     {const c=F(62,62);let cy=c[1],rx=46,ry=23;ellF(g,c[0]+.5,cy,rx+1.5,ry+1,'#a89c82');
      for(let i=0;i<6;i++){ellF(g,c[0]+.5,cy,rx,ry,i%2?'#cfc2a6':'#b9ad92');rx-=5;ry-=2.5;cy+=1;}
      ellF(g,c[0]+.5,cy,rx,ry,'#8f8674');
      const sx=c[0],sy=c[1]-4;for(let dx=-13;dx<=13;dx++){const u=dx/13.5,top=Math.round(15*Math.sqrt(Math.max(0,1-u*u)));
        R(sg,sx+dx,sy-top,1,top+1,Math.abs(dx)>=12?'#bdb5a6':sh('#efe9dc',u<-.3?4:u<.3?-6:-18));}
      for(let dx=-10;dx<=10;dx++){const u=dx/10.5,top=Math.round(11*Math.sqrt(Math.max(0,1-u*u)));R(sg,sx+dx,sy-top+2,1,top-1,'#5d5a58');}
      R(sg,sx-12,sy+1,25,3,'#8a7657');R(ng,sx-9,sy-6,19,6,'rgba(255,226,165,.45)');}
     // 左右長廊（先畫，與圓廳不重疊）
     const WG=boxG(sg,F,4,18,36,74,22,'#e3d8c4','#c5b8a1','#b9ad98'),EG=boxG(sg,F,36,74,4,18,22,'#e3d8c4','#c5b8a1','#b9ad98');
     for(const [P,face] of [[WG,'R'],[EG,'L']]){
       band(sg,P,'L',20,2,TRIM);band(sg,P,'R',20,2,sh(TRIM,-22));
       const L=face==='L'?P.la:P.rb,x0=face==='L'?P.sx-P.la:P.sx;let i=0;
       for(let o=6;o+4<=L-5;o+=10,i++)archWin(sg,ng,P,face,x0+o,4,4,12,face==='L'?GLS:sh(GLS,-8),face==='L'?TRIM:sh(TRIM,-22),i%2===0?WLIT:null);
     }
     paveG(sg,ZF(F,22),9,13,38,72,'#9cc4d6');paveG(sg,ZF(F,22),38,72,9,13,'#9cc4d6');
     win(sg,WG,'L',WG.sx-19,8,0,10,'#5b4938');win(ng,WG,'L',WG.sx-18,6,1,8,'rgba(255,215,150,.55)');
     win(sg,EG,'R',EG.sx+10,8,0,10,'#4a3a2c');
     // 圓廳：鼓座＋壁柱＋高窗＋穹頂＋燈亭
     {const c=F(34,34),cx=c[0],by=c[1],r0=30,h=34;
      frustum(sg,cx,by,r0,r0,h,y=>y>=h-4?TRIM:WL,true);
      for(let dx=-r0+3,wi=0;dx<=r0-3;dx+=6,wi++){const e=Math.round((r0/2)*Math.sqrt(Math.max(0,1-(dx/(r0+.5))**2)));
        R(sg,cx+dx,by+e-h+4,1,h-5,sh(fshade(WL,dx/r0),12));
        if(Math.abs(dx+3)<r0-5){const wx=cx+dx+2,ew=Math.round((r0/2)*Math.sqrt(Math.max(0,1-((dx+3)/(r0+.5))**2)));
          R(sg,wx,by+ew-24,2,14,dx<0?GLS:sh(GLS,-12));R(sg,wx,by+ew-25,2,1,sh(TRIM,-10));
          if(wi%2===1)R(ng,wx,by+ew-24,2,14,WLIT);}}
      ellF(sg,cx+.5,by-h,r0+.5,r0/2,sh(TRIM,-8));
      dome(sg,cx,by-h-1,r0-4,22,'#86ad9c');
      for(let dx=-r0+8;dx<=r0-8;dx+=8){const u=dx/(r0-4),top=Math.round(22*Math.sqrt(Math.max(0,1-u*u)));line(sg,cx+dx,by-h-1-top+2,cx+Math.round(dx*.35),by-h-20,sh('#86ad9c',-18));}
      frustum(sg,cx,by-h-22,4,4,6,()=>TRIM,true);dome(sg,cx,by-h-28,4,4,'#86ad9c');R(sg,cx,by-h-36,1,4,'#d5c07b');}
     // 門廊（面向左下）：柱列＋山花
     {const Q=boxG(sg,F,26,42,46,54,22,WL,WR,null);
      win(sg,Q,'L',Q.sx-Q.la,Q.la,0,19,'#6b6358');
      for(let x=Q.sx-Q.la+1;x<Q.sx-1;x+=4){win(sg,Q,'L',x,2,0,19,TRIM);win(sg,Q,'L',x+2,1,0,19,sh(WL,-18));}
      for(let x=Q.sx-Q.la+2;x<Q.sx-2;x+=8)win(ng,Q,'L',x+2,2,1,10,'rgba(255,215,150,.5)');
      band(sg,Q,'L',19,3,TRIM);band(sg,Q,'R',19,3,sh(TRIM,-22));
      gable(sg,Q,'b',9,'#b9ad98','#a89c86',TRIM,sh(TRIM,-40));
      paveG(g,F,24,44,54,58,'#e6dcc4');isoLine(g,F,24,56,44,56,'#bfb49a');}
     for(const [a,b] of [[24,64],[46,60],[60,44],[46,76],[76,46]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     for(const [a,b,r] of [[6,6,5],[22,6,4],[6,24,4],[78,26,5],[26,78,5],[46,68,4],[68,40,4],[16,78,4],[78,16,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     finish(K,k,1,OL,null);}
    // v2：當代美術館（三個錯位白盒懸挑疊在玻璃基座上）＋劇院（紫色舞台塔、雨庇燈箱）＋雕塑庭園（錯位、現代、雙量體）
    {const K=kit(336,400,168,398),F=ISO(168,238),g=K.g,sg=K.sg,ng=K.ng;
     const WH='#f1ede5',WHR='#cfcac0',GLS='#5d7888';
     ground(g,168,398,160,...GD);
     paveG(g,F,2,44,30,80,PLZ);paveG(g,F,40,80,2,44,PLZ);paveG(g,F,44,80,44,80,LAWN);
     for(const a of [56,68])paveG(g,F,a-1,a+1,44,80,'#cdbf9f');for(const b of [56,68])paveG(g,F,44,80,b-1,b+1,'#cdbf9f');
     // 懸挑影
     paveG(g,F,10,32,62,70,'rgba(40,44,52,.28)');
     for(const [a,b,r] of [[6,6,5],[30,6,4],[6,30,4],[20,14,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     // 美術館：玻璃基座 → 中盒（向左前懸挑成入口雨遮，細柱落地）→ 頂盒（向內後退錯位）
     {const B0=boxG(sg,F,10,34,36,62,14,'#5d7888','#4a6270','#9aa6aa');
      for(let x=B0.sx-B0.la+4;x<B0.sx;x+=6)win(sg,B0,'L',x,1,0,14,'#86a0ad');for(let x=B0.sx+4;x<B0.sx+B0.rb;x+=6)win(sg,B0,'R',x,1,0,14,'#6e8894');
      win(sg,B0,'L',B0.sx-B0.la,B0.la,12,1,'#b8c8ce');win(ng,B0,'L',B0.sx-40,30,1,10,'rgba(255,226,165,.55)');
      for(const a of [11,20,31])post(sg,F(a,69.5)[0]+(a===11?1:0),F(a,69.5)[1],14,'#e8e4dc','#b8b2a6');
      const B1=boxG(sg,F,10,32,40,70,16,WH,WHR,'#e2ddd2',14);cutG(ng,F,10,32,40,70,16,14);
      win(sg,B1,'L',B1.sx-B1.la+6,B1.la-14,6,3,'#3c4a54');win(ng,B1,'L',B1.sx-B1.la+10,16,6,3,WLIT);
      win(sg,B1,'R',B1.sx+6,4,2,11,'#3c4a54');
      const B2=boxG(sg,F,12,30,40,60,14,WH,WHR,'#e8e4da',30);
      win(sg,B2,'R',B2.sx+10,20,3,8,'#3c4a54');win(sg,B2,'R',B2.sx+10,20,10,1,'#8aa4b2');win(ng,B2,'R',B2.sx+12,10,3,7,WLIT);
      win(sg,B2,'L',B2.sx-12,6,11,2,'#d0493e');}
     // 劇院：主廳＋舞台塔＋雨庇
     {const H=boxG(sg,F,46,74,8,34,24,'#d6d9de','#b8bdc5','#9aa0a8');
      winRow(sg,ng,H,'R',14,4,4,10,'#536b85',WLIT,5,2,0);
      const FT=boxG(sg,F,54,68,12,26,30,'#8d668a','#695d72','#5a4a68',24);
      band(sg,FT,'L',26,2,'#a784a2');band(sg,FT,'R',26,2,'#7e6d86');
      win(sg,H,'L',H.sx-H.la+4,H.la-8,0,10,'#536b85');for(let x=H.sx-H.la+8;x<H.sx-4;x+=7)win(sg,H,'L',x,1,0,10,'#b8bdc5');
      win(ng,H,'L',H.sx-H.la+5,H.la-10,1,8,'rgba(255,226,165,.6)');
      const CN=boxG(sg,F,48,72,34,40,3,'#3a3440','#2a2430','#6a5f74',12);cutG(ng,F,48,72,34,40,3,12);
      win(sg,CN,'L',CN.sx-CN.la+2,CN.la-4,1,1,'#f4d27a');win(ng,CN,'L',CN.sx-CN.la+2,CN.la-4,0,3,'#ffdf8a');
      post(sg,F(49,39.5)[0]+1,F(49,39.5)[1],12,'#6a6470','#4a4450');post(sg,F(71,39.5)[0],F(71,39.5)[1],12,'#6a6470','#4a4450');}
     // 雕塑庭園：紅色圓環＋白色方塊雕塑
     {const p=F(62,62);for(let t=0;t<48;t++){const an=t/48*Math.PI*2,x=Math.round(p[0]+8*Math.cos(an)),y=Math.round(p[1]-11+10*Math.sin(an));R(sg,x,y,2,2,Math.cos(an)<-.2?'#e0584c':Math.cos(an)>.4?'#a8362e':'#d0493e');}
      R(sg,p[0]-3,p[1]-1,8,2,'#8a8478');}
     crate(sg,F(52,74),4,4,6,'#eeeae2');crate(sg,F(74,52),4,4,4,'#eeeae2');crate(sg,UP(F(74,52),4),3,3,3,'#3e4a52');
     for(const [a,b,r] of [[50,50,4],[74,74,5],[50,62,4],[62,50,4],[78,34,4],[34,78,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     for(const [a,b] of [[42,72],[72,42],[20,74]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,2,OL,null);}
  }catch(e){console.error('v574 k136',e);}

  // 圓鼓座＋穹頂（螢幕座標 cx,by＝鼓座地面圓心）
  function drumDome(g,ng,cx,by,r,h,dh,wall,domeC,trim,glass,lit){
    frustum(g,cx,by,r,r,h,y=>y>=h-3?trim:wall,true);
    for(let dx=-r+3,i=0;dx<=r-3;dx+=5,i++){const e=Math.round((r/2)*Math.sqrt(Math.max(0,1-(dx/(r+.5))**2)));
      if(i%2===0)R(g,cx+dx,by+e-h+3,1,h-4,sh(fshade(wall,dx/r),12));
      else if(glass&&h>=12){R(g,cx+dx,by+e-h+4,2,h-8,dx<0?glass:sh(glass,-12));if(ng&&lit&&i%4===1)R(ng,cx+dx,by+e-h+4,2,h-8,lit);}}
    ellF(g,cx+.5,by-h,r+.5,r/2,sh(trim,-8));dome(g,cx,by-h-1,r-3,dh,domeC);
    for(let dx=-r+9;dx<=r-9;dx+=7){const u=dx/(r-3),top=Math.round(dh*Math.sqrt(Math.max(0,1-u*u)));line(g,cx+dx,by-h-1-top+2,cx+Math.round(dx*.3),by-h-dh+1,sh(domeC,-16));}
    return by-h-dh;
  }

  /* ================= k137 中央行政園區（6×6） ================= */
  try{
    const k=137,OL=[54,60,70],GD=['#9aa58d','#87947c','#adb7a0'],PLZ='#d2c5a8',LAWN='#86b86f';
    const WL='#ece6d8',WR='#c9c0ae',TRIM='#f7f2e6',RF='#736656',GLS='#546b7a';
    // v1：議會大廈——長條主樓＋兩端突出樓閣（四坡頂）＋中央鼓座穹頂＋山花柱廊＋軸線倒影池與旗列（單一連續量體、朝左下的正立面）
    {const K=kit(400,400,200,398),F=ISO(200,206),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,200,398,192,...GD);
     paveG(g,F,6,92,50,58,PLZ);paveG(g,F,38,58,58,96,PLZ);paveG(g,F,14,38,58,92,LAWN);paveG(g,F,58,92,58,92,LAWN);
     paveG(g,F,42,54,62,92,'#c4b596');paveG(g,F,44,52,64,90,'#54abc0');isoLine(g,F,45,66,45,88,'#7ec8d5');
     for(const [a,b,r] of [[6,6,6],[30,4,5],[4,30,5],[60,6,5],[90,8,5],[6,62,5],[92,40,5]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     const pav=(a0,a1,dark)=>{const P=boxG(sg,F,a0,a1,24,48,38,WL,WR,null);
       band(sg,P,'L',0,2,sh(WR,-12));band(sg,P,'R',0,2,sh(WR,-26));band(sg,P,'L',34,3,TRIM);band(sg,P,'R',34,3,sh(TRIM,-22));
       for(let o=5;o+3<=P.la-4;o+=8)archWin(sg,ng,P,'L',P.sx-P.la+o,3,8,16,GLS,TRIM,((o/8)|0)%2?WLIT:null);
       for(let o=5;o+3<=P.rb-4;o+=8)archWin(sg,null,P,'R',P.sx+o,3,8,16,sh(GLS,-8),sh(TRIM,-22));
       hip(sg,P,8,RF,sh(RF,-22),sh(RF,-12));return P;};
     pav(12,26);
     const M=boxG(sg,F,26,70,26,44,30,WL,WR,'#c9c0ae');
     band(sg,M,'L',0,2,sh(WR,-12));band(sg,M,'R',0,2,sh(WR,-26));band(sg,M,'L',26,4,TRIM);band(sg,M,'R',26,4,sh(TRIM,-22));
     for(let o=4,i=0;o+3<=M.la-3;o+=8,i++){win(sg,M,'L',M.sx-M.la+o,3,7,12,GLS);win(sg,M,'L',M.sx-M.la+o,3,18,1,TRIM);if(i%2===1)win(ng,M,'L',M.sx-M.la+o,3,7,12,WLIT);}
     for(let o=4;o+3<=M.rb-3;o+=8)win(sg,M,'R',M.sx+o,3,7,12,sh(GLS,-8));
     {const c=UP(F(48,35),30);const top=drumDome(sg,ng,c[0],c[1],20,16,24,WL,'#e3ddd0',TRIM,GLS,WLIT);
      frustum(sg,c[0],top-1,4,4,6,()=>TRIM,true);dome(sg,c[0],top-7,4,4,'#9aa3a8');flag(sg,c[0],top-11,10,'#d84e48');}
     pav(70,84);
     // 山花柱廊＋台階
     paveG(g,F,38,58,52,58,'#e6dcc4');for(const b of [54,56])isoLine(g,F,38,b,58,b,'#bfb49a');
     {const Q=boxG(sg,F,40,56,44,52,26,WL,WR,null);
      win(sg,Q,'L',Q.sx-Q.la,Q.la,0,22,'#6b6358');
      for(let x=Q.sx-Q.la+1;x<Q.sx-1;x+=4){win(sg,Q,'L',x,2,0,22,TRIM);win(sg,Q,'L',x+2,1,0,22,sh(WL,-18));}
      for(let x=Q.sx-Q.la+3;x<Q.sx-2;x+=8)win(ng,Q,'L',x+2,1,1,12,'rgba(255,215,150,.55)');
      band(sg,Q,'L',22,4,TRIM);band(sg,Q,'R',22,4,sh(TRIM,-22));
      gable(sg,Q,'b',10,sh(RF,30),sh(RF,14),TRIM,sh(TRIM,-44));}
     for(const b of [64,72,80,88]){for(const a of [40,56]){const p=F(a,b);flag(sg,p[0],p[1],16,['#d84e48','#4f79b5','#d9b447'][(b/8|0)%3]);}}
     for(const [a,b,r] of [[22,66,5],[28,84,5],[70,66,5],[80,80,5],[88,64,4],[64,90,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     for(const [a,b] of [[36,60],[60,60],[36,92],[60,92]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,1,OL,null);}
    // v2：現代市政中心——高低雙塔（石材帶窗塔＋玻璃鰭板塔）以空橋相連＋玻璃裙樓＋前方淺碟議事廳＋旗列廣場（高聳、雙塔、圓碟）
    {const K=kit(400,400,200,398),F=ISO(200,206),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,200,398,192,...GD);
     paveG(g,F,6,92,48,92,PLZ);paveG(g,F,10,34,64,88,LAWN);
     {const c=F(22,76);ellF(g,c[0]+.5,c[1],15,7.5,'#c4b596');ellF(g,c[0]+.5,c[1],12,6,'#54abc0');ellF(g,c[0]-2.5,c[1]-1,6,2.5,'#7ec8d5');}
     for(const [a,b,r] of [[6,6,6],[40,6,5],[6,40,5],[84,8,5],[92,30,5]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     // 塔 A（石材、帶窗）
     const TA=boxG(sg,F,14,30,22,38,100,'#e2ded6','#bcb7ad','#9a958c');
     for(let hb=10,r=0;hb<94;hb+=8,r++){ribbon(sg,ng,TA,'L',hb,3,GLS,'#e2ded6',8,WLIT,r%2?4:3,3,3);ribbon(sg,ng,TA,'R',hb,3,sh(GLS,-8),'#bcb7ad',8,WLIT,r%2?3:5,3,3);}
     {const t=TA.N;R(sg,t[0],t[1]-16,1,16,'#7f8b92');R(sg,t[0]-1,t[1]-18,3,2,'#d44e48');R(ng,t[0]-1,t[1]-18,3,2,'#ff665d');}
     boxG(sg,F,18,26,26,34,6,'#aaa59b','#8a857c','#9a958c',100);
     // 空橋
     const BR=boxG(sg,F,30,54,26,34,10,'#6f8796','#546b7a','#8a9aa4',64);cutG(ng,F,30,54,26,34,10,64);
     ribbon(sg,ng,BR,'L',2,6,'#8fb2c4','#5f7a88',6,'rgba(170,230,255,.7)',2,1,1);
     // 塔 B（玻璃、鰭板）
     const TB=boxG(sg,F,54,70,22,38,84,'#6f8796','#546b7a','#7f8f98');cutG(ng,F,54,70,22,38,84,0);
     for(let x=TB.sx-TB.la+3;x<TB.sx;x+=4)win(sg,TB,'L',x,1,0,84,'#9ab4c2');for(let x=TB.sx+3;x<TB.sx+TB.rb;x+=4)win(sg,TB,'R',x,1,0,84,'#6a8190');
     for(let hb=12,r=0;hb<80;hb+=12,r++){win(sg,TB,'L',TB.sx-TB.la,TB.la,hb,1,'#5a7280');win(sg,TB,'R',TB.sx,TB.rb,hb,1,'#465c6a');
       win(ng,TB,'L',TB.sx-TB.la+4+(r*9)%20,8,hb+2,7,'rgba(170,230,255,.6)');}
     {const C=boxG(sg,F,56,68,24,36,5,'#8a9aa4','#6a7a84','#7f8f98',84);padXY(sg,(C.S[0]+C.N[0])>>1,((C.S[1]+C.N[1])>>1),7);}
     // 裙樓（玻璃大廳）＋國徽牌
     const PD=boxG(sg,F,10,74,38,48,14,'#dcd8cf','#b7b2a8','#c9c4ba');cutG(ng,F,10,74,38,48,14,0);
     ribbon(sg,ng,PD,'L',2,9,GLS,'#dcd8cf',8,'rgba(255,226,165,.6)',2,4,4);ribbon(sg,null,PD,'R',2,9,sh(GLS,-8),'#b7b2a8',8,null,2,3,3);
     {const x=F(42,48)[0];win(sg,PD,'L',x-6,12,5,8,'#e3c46a');win(sg,PD,'L',x-4,8,7,4,'#c89b3c');}
     // 議事廳：玻璃鼓座＋淺碟頂
     {const c=F(58,70),cx=c[0],by=c[1],r=28;
      ng.save();ng.globalCompositeOperation='destination-out';ellF(ng,cx+.5,by-8,r+1,r/2+10,'#000');ng.restore();
      frustum(sg,cx,by,r,r,12,y=>y>=10?'#dcd8cf':'#6f8796',true);
      for(let dx=-r+4;dx<=r-4;dx+=5){const e=Math.round((r/2)*Math.sqrt(Math.max(0,1-(dx/(r+.5))**2)));R(sg,cx+dx,by+e-10,1,8,'#b8c6ce');}
      for(let dx=-r+6;dx<=r-8;dx+=10){const e=Math.round((r/2)*Math.sqrt(Math.max(0,1-(dx/(r+.5))**2)));R(ng,cx+dx+1,by+e-10,4,8,'rgba(255,226,165,.6)');}
      ellF(sg,cx+.5,by-12,r+2.5,r/2+1.5,'#dcd8cf');dome(sg,cx,by-13,r-3,15,'#b9c4ca');
      for(let dx=-r+10;dx<=r-10;dx+=8){const u=dx/(r-3),top=Math.round(15*Math.sqrt(Math.max(0,1-u*u)));line(sg,cx+dx,by-13-top+2,cx+Math.round(dx*.3),by-26,'#9aa7ae');}
      ellF(sg,cx+.5,by-28,5,2.5,'#e8eef0');R(sg,cx-2,by-29,3,1,'#ffffff');}
     for(let i=0;i<7;i++){const p=F(8+i*4,60);flag(sg,p[0],p[1],14,['#d84e48','#4f79b5','#d9b447'][i%3]);}
     for(const [a,b,r] of [[40,90,5],[88,56,5],[90,76,5],[76,90,5],[12,62,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     for(const [a,b] of [[38,58],[80,52],[46,80],[78,84]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,2,OL,null);}
  }catch(e){console.error('v574 k137',e);}

  /* ================= k138 科技研究園區（6×6） ================= */
  try{
    const k=138,OL=[48,60,70],GD=['#8fa28f','#7b907c','#a1b3a1'],PTH='#c4b99f',LAWN='#7bb06d';
    const WL='#dbe3e7',WR='#b9c7ce',RFC='#586b78',GLS='#436e8a';
    // v1：天文與電波科學園——鋸齒天窗實驗廠房＋長條研究樓＋白色天文台圓頂＋大型電波望遠鏡碟＋氣象桁架塔（分散、低矮、儀器地標）
    {const K=kit(400,400,200,398),F=ISO(200,206),g=K.g,sg=K.sg,ng=K.ng,Z=(a,b,z)=>UP(F(a,b),z);
     ground(g,200,398,192,...GD);
     paveG(g,F,30,34,28,96,PTH);paveG(g,F,34,96,44,48,PTH);paveG(g,F,40,92,54,92,LAWN);
     for(const [a,b,r] of [[4,6,5],[54,4,5],[4,32,5],[92,70,5]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     // 鋸齒實驗廠房
     {const P=boxG(sg,F,12,48,10,28,18,WL,WR,null);
      band(sg,P,'L',0,2,sh(WR,-10));band(sg,P,'R',0,2,sh(WR,-24));
      winRow(sg,ng,P,'L',6,5,5,12,GLS,WLIT,5,2,0);winRow(sg,ng,P,'R',6,5,5,12,sh(GLS,-8),WLIT,6,2,1);
      win(sg,P,'L',P.sx-12,10,0,11,'#4f5a62');for(let hb=1;hb<11;hb+=2)win(sg,P,'L',P.sx-12,10,hb,1,'#6a767e');
      for(let i=0;i<6;i++){const ta=12+6*i,H=18,U=8;
        poly(sg,[Z(ta,10,H),Z(ta,28,H),Z(ta+6,28,H+U),Z(ta+6,10,H+U)],RFC);
        poly(sg,[Z(ta+6,10,H),Z(ta+6,28,H),Z(ta+6,28,H+U),Z(ta+6,10,H+U)],'#8fb4c6');
        {const p=Z(ta+6,19,H),q=Z(ta+6,19,H+U);line(sg,p[0],p[1],q[0],q[1],'#5f7f90');}
        poly(sg,[Z(ta,28,H),Z(ta+6,28,H),Z(ta+6,28,H+U)],'#cfd9de');
        if(i%2===0){const p=Z(ta+6,23,H+3);R(ng,p[0]-1,p[1]-2,3,3,'rgba(170,230,255,.7)');}}}
     // 天文台
     {const c=F(72,22),cx=c[0],by=c[1];
      frustum(sg,cx,by,18,18,20,y=>y>=17?'#c9d3d8':'#e6ecee',true);
      R(sg,cx-8,by+6-12,4,10,'#4f5a62');R(ng,cx-8,by-5,4,3,'rgba(255,226,165,.6)');
      ellF(sg,cx+.5,by-20,18.5,9,'#b9c7ce');dome(sg,cx,by-21,16,15,'#f2f5f6');
      for(let y=0;y<14;y++){const x=cx-5+Math.round(y*.2);R(sg,x,by-35+y,3,1,'#3f4a54');}
      R(sg,cx-2,by-37,1,3,'#7f8b92');}
     // 研究樓（長條、平頂設備）
     {const P=boxG(sg,F,10,28,36,78,22,WL,WR,'#a9b6bc');
      ribbon(sg,ng,P,'L',5,4,GLS,WL,7,WLIT,3,3,3);ribbon(sg,ng,P,'L',14,4,GLS,WL,7,WLIT,2,3,3);
      ribbon(sg,ng,P,'R',5,4,sh(GLS,-8),WR,7,WLIT,3,3,3);ribbon(sg,ng,P,'R',14,4,sh(GLS,-8),WR,7,WLIT,4,3,3);
      boxG(sg,F,14,22,44,56,5,'#9aa6ac','#78848a','#aab6bc',22);boxG(sg,F,14,20,62,70,4,'#9aa6ac','#78848a','#aab6bc',22);
      {const t=Z(24,50,22);R(sg,t[0],t[1]-12,1,12,'#7f8b92');R(sg,t[0]-1,t[1]-14,3,2,'#d44e48');R(ng,t[0]-1,t[1]-14,3,2,'#ff665d');}}
     // 氣象桁架塔
     {const b=F(90,34),top=lattice(sg,b[0],b[1],64,4,'#6a7d88','#4f606a');R(sg,b[0]-5,b[1]-1,11,1,'#3d4a54');
      R(sg,b[0]-5,top+10,11,1,'#8a9aa4');R(sg,b[0]-6,top+8,2,2,'#d8dde0');R(sg,b[0]+5,top+8,2,2,'#d8dde0');R(sg,b[0]-1,top-3,2,3,'#d24d42');R(ng,b[0]-1,top-3,2,2,'#ff5a4a');}
     // 電波望遠鏡：基座＋叉架＋碟（朝左上）＋饋源三腳
     {const c=F(64,68),cx=c[0],by=c[1];
      ellF(g,cx+4.5,by+1,18,8,'rgba(30,40,40,.22)');
      frustum(sg,cx,by,9,7,10,y=>'#c9d0d3');
      R(sg,cx-6,by-24,2,15,'#a9b2b6');R(sg,cx+5,by-24,2,15,'#7f888c');
      const dx0=cx-3,dy0=by-34;
      ellF(sg,dx0+2.5,dy0+2,25,17,'#8f989c');ellF(sg,dx0+.5,dy0,25,17,'#e9eef0');ellF(sg,dx0+1.5,dy0+1,21,14,'#cdd6da');ellF(sg,dx0+4.5,dy0+4,12,8,'#b7c1c6');
      const fx=dx0-6,fy=dy0-18;for(const [px,py] of [[dx0-18,dy0+9],[dx0+17,dy0+6],[dx0+2,dy0-14]])line(sg,px,py,fx,fy,'#6f787c');
      R(sg,fx-1,fy-2,3,3,'#5a6368');R(sg,fx,fy-4,1,2,'#d24d42');R(ng,fx,fy-4,1,2,'#ff5a4a');}
     for(const [a,b,r] of [[46,86,5],[88,50,5],[82,88,5],[40,58,4],[62,94,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     for(const [a,b] of [[34,50],[36,90],[60,48],[84,48]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,1,OL,null);}
    // v2：創新中心——方環形研究樓（綠屋頂、內庭）＋角落玻璃高塔＋前方太陽能板陣列＋右側資料中心冷卻機組（環形量體＋單塔）
    {const K=kit(400,400,200,398),F=ISO(200,206),g=K.g,sg=K.sg,ng=K.ng;
     ground(g,200,398,192,...GD);
     paveG(g,F,32,56,32,56,LAWN);paveG(g,F,42,46,32,56,PTH);paveG(g,F,68,96,48,52,PTH);paveG(g,F,42,46,68,96,PTH);
     for(const [a,b,r] of [[4,6,5],[40,4,5],[6,40,5],[90,10,5]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     const GRN='#7fa86a',H=26,wall=(P,fl,fr)=>{if(fl)for(const hb of [5,15])ribbon(sg,ng,P,'L',hb,5,GLS,WL,6,WLIT,hb===5?3:4,2,2);
       if(fr)for(const hb of [5,15])ribbon(sg,ng,P,'R',hb,5,sh(GLS,-8),WR,6,WLIT,hb===5?4:3,2,2);band(sg,P,'L',H-2,2,'#eef3f5');band(sg,P,'R',H-2,2,sh('#eef3f5',-20));};
     const R1=boxG(sg,F,20,68,20,32,H,WL,WR,GRN);wall(R1,1,1);paveG(sg,ZF(F,H),20,68,20,32,GRN);
     // 角塔（坐在環的後角）
     {const T=boxG(sg,F,20,32,20,32,72,'#5d8aa6','#476f88','#6f8f9e',H);cutG(ng,F,20,32,20,32,72,H);
      for(let x=T.sx-T.la+4;x<T.sx;x+=4)win(sg,T,'L',x,1,0,72,'#86aec4');for(let x=T.sx+4;x<T.sx+T.rb;x+=4)win(sg,T,'R',x,1,0,72,'#5f889e');
      for(let hb=8,r=0;hb<70;hb+=9,r++){win(sg,T,'L',T.sx-T.la,T.la,hb,1,'#3f6680');win(sg,T,'R',T.sx,T.rb,hb,1,'#335872');
        if(r%2===0)win(ng,T,'L',T.sx-T.la+2+(r*5)%10,10,hb+2,6,'rgba(170,230,255,.6)');else win(ng,T,'R',T.sx+4,8,hb+2,6,'rgba(170,230,255,.5)');}
      boxG(sg,F,23,29,23,29,5,'#9aa6ac','#78848a','#aab6bc',H+72);
      const t=UP(F(26,26),H+77);R(sg,t[0],t[1]-18,1,18,'#7f8b92');R(sg,t[0]-1,t[1]-20,3,2,'#d44e48');R(ng,t[0]-1,t[1]-20,3,2,'#ff665d');}
     const L1=boxG(sg,F,20,32,32,68,H,WL,WR,GRN);cutG(ng,F,20,32,32,68,H,0);wall(L1,1,1);
     const L2=boxG(sg,F,32,56,56,68,H,WL,WR,GRN);cutG(ng,F,32,56,56,68,H,0);wall(L2,1,0);
     const R2=boxG(sg,F,56,68,32,68,H,WL,WR,GRN);cutG(ng,F,56,68,32,68,H,0);wall(R2,1,1);
     {const ZH=ZF(F,H);paveG(sg,ZH,20,32,32,68,GRN);paveG(sg,ZH,32,56,56,68,GRN);paveG(sg,ZH,56,68,32,68,GRN);
      isoLine(sg,ZH,20,68,68,68,sh(GRN,-26));isoLine(sg,ZH,68,20,68,68,sh(GRN,-26));isoLine(sg,ZH,32,20,68,20,sh(GRN,16));isoLine(sg,ZH,20,32,20,68,sh(GRN,16));
      isoLine(sg,ZH,32,32,56,32,sh(GRN,-26));isoLine(sg,ZH,32,32,32,56,sh(GRN,-26));isoLine(sg,ZH,56,32,56,56,sh(GRN,16));isoLine(sg,ZH,32,56,56,56,sh(GRN,16));}
     {const x=F(44,68)[0];win(sg,L2,'L',x-5,10,0,12,'#34465a');win(sg,L2,'L',x-6,12,12,1,'#eef3f5');win(ng,L2,'L',x-4,8,1,10,'rgba(255,226,165,.6)');}
     for(const P of [R1,L1,L2,R2]){const c=[(P.S[0]+P.N[0])>>1,(P.S[1]+P.N[1])>>1];R(sg,c[0]-3,c[1],6,1,'#6a9458');}
     tree(sg,g,F(44,44)[0],F(44,44)[1],6);
     // 太陽能板陣列（左前）
     for(const b of [74,80,86])for(const a0 of [6,24]){const P=boxG(sg,F,a0,a0+16,b,b+3,1,'#2f4a6a','#26405c','#3f5f86',2);
       for(let a=a0+3;a<a0+16;a+=3){const p=UP(F(a,b),3),q=UP(F(a,b+3),3);line(sg,p[0],p[1],q[0],q[1],'#6f93b8');}
       post(sg,F(a0+1,b+2.5)[0]+1,F(a0+1,b+2.5)[1],2,'#6e747a');post(sg,F(a0+15,b+2.5)[0],F(a0+15,b+2.5)[1],2,'#6e747a');}
     // 資料中心＋冷卻風扇
     {const P=boxG(sg,F,76,92,56,84,14,'#c3c9cc','#9aa2a6','#8f989c');
      band(sg,P,'L',11,1,'#e0c050');band(sg,P,'R',11,1,'#b09a3a');win(sg,P,'L',P.sx-12,6,0,9,'#4f5a62');
      for(let x=P.sx+4;x<P.sx+P.rb-3;x+=8)win(sg,P,'R',x,4,4,2,'#6f777c');win(ng,P,'L',P.sx-11,4,6,2,'rgba(170,230,255,.7)');
      for(const b of [60,68,76]){const c=UP(F(84,b+2),14);ellF(sg,c[0]+.5,c[1],5,2.5,'#6f777c');ellF(sg,c[0]+.5,c[1]-.5,3.5,1.5,'#3f464b');R(sg,c[0],c[1]-1,1,1,'#9aa2a6');}}
     for(const [a,b,r] of [[72,40,5],[92,44,4],[60,88,5],[70,76,4],[48,92,4]])tree(sg,g,F(a,b)[0],F(a,b)[1],r);
     for(const [a,b] of [[40,72],[48,90],[70,50],[94,50]]){const p=F(a,b);lamp(sg,ng,p[0],p[1],8);}
     finish(K,k,2,OL,null);}
  }catch(e){console.error('v574 k138',e);}
});
