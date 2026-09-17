(window.__variants574=window.__variants574||[]).push(function b04(A){
  const SPR=A.SPR(), B=SPR.bld;
  const cv=A.cv, shade=A.shade, HL=A.hashLocal479;
  /* ============ b04 共用工具（教育研究與科技）============
     全部整數像素；零共用亂數（只用 A.metroRand516('v574:'+k+':'+v)）。 */
  const put=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  // 掃描線多邊形（硬邊，不反鋸齒）
  function poly(g,pts,col){
    g.fillStyle=col;let y0=1e9,y1=-1e9;
    for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
    y0=Math.floor(y0);y1=Math.ceil(y1);
    for(let y=y0;y<y1;y++){
      const yc=y+.5,xs=[];
      for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
        if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}
    }
  }
  function seg(g,x0,y0,x1,y1,col){
    const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;g.fillStyle=col;
    for(let i=0;i<=n;i++){const t=n?i/n:0;g.fillRect(Math.round(x0+(x1-x0)*t),Math.round(y0+(y1-y0)*t),1,1);}
  }
  function ell(g,cx,cy,rx,ry,col){
    g.fillStyle=col;
    for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){
      const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;
      const hw=rx*Math.sqrt(1-dy*dy),xa=Math.round(cx-hw),xb=Math.round(cx+hw);
      if(xb>xa)g.fillRect(xa,y,xb-xa,1);
    }
  }
  function rell(g,cx,cy,rx,ry,ang,col){ // 旋轉橢圓（碟面）
    const c=Math.cos(ang),s=Math.sin(ang),R=Math.ceil(Math.max(rx,ry))+1;g.fillStyle=col;
    for(let y=Math.floor(cy)-R;y<=Math.floor(cy)+R;y++)for(let x=Math.floor(cx)-R;x<=Math.floor(cx)+R;x++){
      const px=x+.5-cx,py=y+.5-cy,u=px*c+py*s,v=-px*s+py*c;
      if((u*u)/(rx*rx)+(v*v)/(ry*ry)<=1)g.fillRect(x,y,1,1);
    }
  }
  /* 等距稜柱：S=南頂點(地面)；a=沿左牆半單位（W=S+(-2a,-a)）；b=沿右牆（E=S+(2b,-b)）
     與 isoBox 同一套階梯（dx>>1），左亮右暗、頂緣受光、簷口壓暗、底部 AO、前角線。 */
  function prism(g,sx,sy,a,b,h,cL,cR,cT,opt){
    opt=opt||{};
    for(let dx=1;dx<=2*a;dx++){const yF=sy-(dx>>1);g.fillStyle=cL;g.fillRect(sx-dx,yF-h,1,h);}
    for(let dx=0;dx<2*b;dx++){const yF=sy-((dx+1)>>1);g.fillStyle=cR;g.fillRect(sx+dx,yF-h,1,h);}
    if(!opt.noAO){g.fillStyle='rgba(0,0,0,.13)';
      for(let dx=1;dx<=2*a;dx++){const yF=sy-(dx>>1);g.fillRect(sx-dx,yF-3,1,3);}
      for(let dx=0;dx<2*b;dx++){const yF=sy-((dx+1)>>1);g.fillRect(sx+dx,yF-3,1,3);}}
    if(h>2){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(sx,sy-h,1,h);}
    if(cT){
      const lowWS=x=>sy-((sx-x)>>1)-h, lowSE=x=>sy-((x-sx+1)>>1)-h, nx=sx-2*a+2*b;
      for(let x=sx-2*a;x<sx+2*b;x++){
        const low=x<sx?lowWS(x):lowSE(x);
        const up=x<nx?lowSE(x+2*a)-a:lowWS(x-2*b)-b;
        if(low-up<=0)continue;
        g.fillStyle=cT;g.fillRect(x,up,1,low-up);
        if(!opt.flatTop){g.fillStyle=shade(cT,16);g.fillRect(x,up,1,1);
          if(low-up>1){g.fillStyle=shade(cT,-22);g.fillRect(x,low-1,1,1);}}
      }
    }
    return {S:[sx,sy],W:[sx-2*a,sy-a],E:[sx+2*b,sy-b],N:[sx-2*a+2*b,sy-a-b],
      St:[sx,sy-h],Wt:[sx-2*a,sy-a-h],Et:[sx+2*b,sy-b-h],Nt:[sx-2*a+2*b,sy-a-b-h],
      C:[sx-a+b,sy-(a+b)/2-h]};
  }
  // 牆上 y：左牆距 S 水平 d 的地面 y；右牆同理
  const yL=(sy,d)=>sy-(d>>1), yR=(sy,d)=>sy-((d+1)>>1);
  // 沿牆一列窗：face 'L'|'R'；d 由 S 起算；yb＝窗底離地高；kind 交給 winShape570
  function wins(g,ng,face,sx,sy,ds,yb,ww,wh,kind,glass,lit,trim,litFn){
    for(let i=0;i<ds.length;i++){const d=ds[i];
      const x=face==='L'?sx-d-ww:sx+d, mid=d+(ww>>1);
      const y=(face==='L'?yL(sy,mid+1):yR(sy,mid))-yb-wh;
      const on=litFn?litFn(i):false;
      A.winShape570(g,ng,x,y,ww,wh,kind,glass,lit,trim,on);
    }
  }
  // 山牆屋頂：axis 'a' ＝屋脊平行左牆；'b' ＝屋脊平行右牆
  function gable(g,P,a,b,rise,axis,cFront,cBack,cGable){
    const [sx,sy]=P.St;
    if(axis==='a'){
      const Sr=[sx+b,sy-(b>>1)-rise],Wr=[P.Wt[0]+b,P.Wt[1]-(b>>1)-rise];
      poly(g,[Wr,Sr,P.Et,P.Nt],cBack);
      poly(g,[P.St,P.Et,Sr],cGable);
      poly(g,[P.Wt,P.St,Sr,Wr],cFront);
      seg(g,Wr[0],Wr[1],Sr[0],Sr[1],shade(cFront,26));
      seg(g,P.Wt[0],P.Wt[1],P.St[0]-1,P.St[1],shade(cFront,-30));
      return {Sr,Wr};
    }else{
      const Sr=[sx-a,sy-(a>>1)-rise],Er=[P.Et[0]-a,P.Et[1]-(a>>1)-rise];
      poly(g,[P.Wt,Sr,Er,P.Nt],cBack);
      poly(g,[P.Wt,P.St,Sr],cGable);
      poly(g,[P.St,P.Et,Er,Sr],cFront);
      seg(g,Sr[0],Sr[1],Er[0],Er[1],shade(cBack,30));
      seg(g,P.St[0],P.St[1],P.Et[0]-1,P.Et[1],shade(cFront,-26));
      return {Sr,Er};
    }
  }
  function hip(g,P,rise,cL,cR,cBack){ // 方錐頂（四坡）
    const ap=[P.C[0],P.C[1]-rise];
    poly(g,[P.Wt,ap,P.Nt],cBack);poly(g,[ap,P.Et,P.Nt],shade(cBack,-14));
    poly(g,[P.Wt,P.St,ap],cL);poly(g,[P.St,P.Et,ap],cR);
    return ap;
  }
  function cyl(g,cx,cy,r,h,cL,cM,cR,cTop){ // 圓柱；cy＝底橢圓中心
    for(let x=Math.round(cx-r);x<Math.round(cx+r);x++){
      const dx=(x+.5-cx)/r;if(Math.abs(dx)>1)continue;
      const yb=Math.round(cy+(r/2)*Math.sqrt(1-dx*dx)),yt=Math.round(cy-h);
      g.fillStyle=dx<-.4?cL:dx<.3?cM:cR;g.fillRect(x,yt,1,yb-yt);
    }
    if(cTop)ell(g,cx,cy-h,r,r/2,cTop);
  }
  function dome(g,cx,cy,r,C4,ribs){ // 半球；cy＝底橢圓中心；C4=[亮,中,暗,深]
    for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r/2);y++){
      const yc=y+.5;let hw;
      if(yc<=cy){const q=r*r-(cy-yc)*(cy-yc);if(q<=0)continue;hw=Math.sqrt(q);}
      else{const t=(yc-cy)/(r/2);if(t>=1)continue;hw=r*Math.sqrt(1-t*t);}
      const xa=Math.round(cx-hw),xb=Math.round(cx+hw);
      for(let x=xa;x<xb;x++){
        const nx=(x+.5-cx)/r,t=-nx*.85+(cy-yc)/r*.35;
        g.fillStyle=t>.42?C4[0]:t>-.05?C4[1]:t>-.5?C4[2]:C4[3];g.fillRect(x,y,1,1);
      }
    }
    if(ribs){for(const f of ribs){ // 經線肋
      for(let y=Math.floor(cy-r+2);y<cy;y++){const q=r*r-(cy-y-.5)*(cy-y-.5);if(q<=0)continue;
        const x=Math.round(cx+f*Math.sqrt(q));g.fillStyle='rgba(20,28,30,.28)';g.fillRect(x,y,1,1);}}}
  }
  function band(g,sx,sy,a,b,yb,hh,cL,cR){ // 沿兩面牆的水平帶（離地 yb、厚 hh）
    for(let dx=1;dx<=2*a;dx++){g.fillStyle=cL;g.fillRect(sx-dx,sy-(dx>>1)-yb-hh,1,hh);}
    for(let dx=0;dx<2*b;dx++){g.fillStyle=cR;g.fillRect(sx+dx,sy-((dx+1)>>1)-yb-hh,1,hh);}
  }
  function ringFront(g,cx,cy,rx,ry,col,colR){ // 橢圓前半緣線（簷口環）
    for(let x=Math.round(cx-rx);x<Math.round(cx+rx);x++){const dx=(x+.5-cx)/rx;if(Math.abs(dx)>1)continue;
      g.fillStyle=(colR&&dx>.3)?colR:col;g.fillRect(x,Math.round(cy+ry*Math.sqrt(1-dx*dx))-1,1,1);}
  }
  const drumY=(r,dx)=>Math.round((r/2)*Math.sqrt(Math.max(0,1-(dx/r)*(dx/r)))); // 圓柱前緣隨 dx 的下垂量
  function ball(g,cx,cy,r,C4){ // 球（雷達罩）
    for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){
      const nx=(x+.5-cx)/r,ny=(y+.5-cy)/r;if(nx*nx+ny*ny>1)continue;
      const t=-nx*.8-ny*.45;g.fillStyle=t>.45?C4[0]:t>-.05?C4[1]:t>-.5?C4[2]:C4[3];g.fillRect(x,y,1,1);}
  }
  function dish(g,cx,cy,r,ang,C){ // 拋物面碟（面朝西北上方）C=[邊緣,內凹暗,內凹亮,背殼,支架]；回傳饋源點
    const ry=r*.62,c=Math.cos(ang),s=Math.sin(ang);
    rell(g,cx+1,cy+2,r,ry,ang,C[3]);
    rell(g,cx,cy,r,ry,ang,C[0]);
    rell(g,cx+.5,cy+.5,r-2,ry-1.6,ang,C[1]);
    rell(g,cx+1.6,cy+1.4,r*.55,ry*.45,ang,C[2]);
    const fx=Math.round(cx-r*.42),fy=Math.round(cy-r*.62);
    for(const [u,v] of [[-.92,0],[.92,0],[0,.9]]){const px=u*r,py=v*ry;
      seg(g,Math.round(cx+px*c-py*s),Math.round(cy+px*s+py*c),fx,fy,C[4]);}
    put(g,fx-1,fy-1,3,3,C[0]);put(g,fx,fy,1,1,C[4]);
    return [fx,fy];
  }
  function door(g,ng,face,sx,sy,d,w,h,col,top,lit){ // 沿牆斜率逐欄落地的門
    for(let i=0;i<w;i++){const dx=d+1+i,x=face==='L'?sx-dx:sx+dx-1,gy=face==='L'?sy-(dx>>1):sy-((dx)>>1);
      put(g,x,gy-h,1,h,col);if(top)put(g,x,gy-h-1,1,1,top);if(ng&&lit){ng.fillStyle=lit;ng.fillRect(x,gy-h,1,h);}}
  }
  function tree(g,x,y,r,c1,c2){ // 地面點 (x,y)
    put(g,x-1,y-r-2,2,r+2,'#6b4a2f');
    ell(g,x,y-r-3,r,r*.9,c1);ell(g,x-1,y-r-4,r*.55,r*.5,c2);
    put(g,x-2,y,5,1,'rgba(20,26,22,.25)');
  }
  // ---- 與 v0 同一條後製（polish526＋material479）----
  function grainBands(c,pl,pt,h0){
    const g=c.getContext('2d'),w=c.width,h=c.height,im=g.getImageData(0,0,w,h),d=im.data,bandBase=pt+h0-2;
    for(let y=0;y<h;y++){const band=y<=bandBase&&((bandBase-y)%8===0);
      for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]<=40)continue;
        if(((((x-pl)>>1)+((y-pt)>>1))&3)===0){d[i]*=.955;d[i+1]*=.955;d[i+2]*=.955;}
        if(band){d[i]*=.93;d[i+1]*=.93;d[i+2]*=.93;}}}
    g.putImageData(im,0,0);
  }
  function polishFull(c,o){ // 整張重畫用：與 polishAll526 同式
    const g=c.getContext('2d'),w=c.width,h=c.height,sc=Math.max(.6,Math.min(3,w/72));
    g.fillStyle='rgba(10,14,24,.16)';g.beginPath();g.ellipse(o.ax+8*sc,o.ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();
    const im=g.getImageData(0,0,w,h),d=im.data;
    for(let y=0;y<h;y++){let L=-1,R=-1;
      for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>40){if(L<0)L=x;R=x;}}
      if(L<0)continue;
      for(let x=L;x<Math.min(L+2,w);x++){const i=(y*w+x)*4;d[i]=Math.min(255,d[i]*1.14+12);d[i+1]=Math.min(255,d[i+1]*1.14+12);d[i+2]=Math.min(255,d[i+2]*1.14+12);}
      {const i=(y*w+R)*4;d[i]*=.88;d[i+1]*=.88;d[i+2]*=.88;}
    }
    g.putImageData(im,0,0);
    grainBands(c,0,0,h);
  }
  function ellipseAtop(c,o){
    const g=c.getContext('2d'),sc=Math.max(.6,Math.min(3,o.w0/72));
    g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(10,14,24,.16)';
    g.beginPath();g.ellipse(o.ax+8*sc,o.ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();g.restore();
  }
  const ICAT=[49,50,57,64,100,109,110,116,117,118,121,122,123,151,152,153,154,155,156,157,158,161,162,163,164];
  function material(c,o){
    const g=c.getContext('2d'),w=o.w0,h=o.h0,k=o.k,seed=479000+k*17+((k+'_1_0').length*13),I=ICAT.includes(k);
    g.save();g.translate(o.pl,o.pt);g.globalCompositeOperation='source-atop';
    const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,236,194,.075)');gr.addColorStop(.52,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(28,35,43,.10)');
    g.fillStyle=gr;g.fillRect(-o.pl,-o.pt,c.width,c.height);
    const dens=Math.min(360,Math.max(10,Math.floor(w*h/520))),cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];
    for(let i=0;i<dens;i++){const x=Math.floor(HL(seed,i,47901)*w),y=Math.floor(HL(seed,i,47902)*h),rw=HL(seed,i,47903)<.74?1:2,rh=HL(seed,i,47904)<.88?1:2;
      g.fillStyle=cols[Math.floor(HL(seed,i,47905)*cols.length)%cols.length];g.fillRect(x,y,rw,rh);}
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);
    tint.addColorStop(0,I?'rgba(191,142,99,.045)':'rgba(222,213,190,.035)');tint.addColorStop(1,I?'rgba(67,54,46,.09)':'rgba(43,49,54,.07)');
    g.fillStyle=tint;g.fillRect(-o.pl,-o.pt,c.width,c.height);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86),step=I?9:8;
    g.strokeStyle=I?'rgba(54,50,46,.10)':'rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=step){const off=Math.floor(HL(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    if(I){g.strokeStyle='rgba(225,215,194,.055)';for(let x=Math.floor(w*.28);x<w*.75;x+=12){g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();}}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');
    g.fillStyle=ao;g.fillRect(-o.pl,Math.floor(h*.70),c.width,Math.ceil(h*.30)+2);
    g.restore();
  }
  // ---- 畫布 ----
  function base(k,pl,pt,pr){ // compose：以最終 v0 為底
    pl=pl||0;pt=pt||0;pr=pr||0;const s0=B[k+'_1_0'],w=s0.w+pl+pr,h=s0.h+pt;
    const [c,g]=cv(w,h),[nc,ng]=cv(w,h);g.drawImage(s0.img,pl,pt);if(s0.night)ng.drawImage(s0.night,pl,pt);
    return {k,s0,c,g,nc,ng,w,h,w0:s0.w,h0:s0.h,pl,pt,ax:s0.ax+pl,ay:s0.ay+pt};
  }
  function fresh(k){ // redraw：同尺寸同錨點空白畫布
    const s0=B[k+'_1_0'],[c,g]=cv(s0.w,s0.h),[nc,ng]=cv(s0.w,s0.h);
    return {k,s0,c,g,nc,ng,w:s0.w,h:s0.h,w0:s0.w,h0:s0.h,pl:0,pt:0,ax:s0.ax,ay:s0.ay};
  }
  function layer(o){const [c,g]=cv(o.w,o.h),[nc,ng]=cv(o.w,o.h);return {c,g,nc,ng};}
  function commit(o,L,ol){ // 新部件：外框→同式後製→蓋上；夜圖先挖掉被遮住的 v0 燈，再放新燈
    A.outlineSprite(L.c,ol[0],ol[1],ol[2]);
    ellipseAtop(L.c,o);grainBands(L.c,o.pl,o.pt,o.h0);material(L.c,o);
    o.ng.save();o.ng.globalCompositeOperation='destination-out';o.ng.drawImage(L.c,0,0);o.ng.restore();
    o.g.drawImage(L.c,0,0);o.ng.drawImage(L.nc,0,0);
  }
  function reoverlay(o,pts){ // 把 v0 在 pts 多邊形內的像素蓋回來（新部件在 v0 之後）
    const [mc,mg]=cv(o.w,o.h);poly(mg,pts,'#fff');
    const [tc,tg]=cv(o.w,o.h);tg.drawImage(o.s0.img,o.pl,o.pt);tg.globalCompositeOperation='destination-in';tg.drawImage(mc,0,0);
    o.g.drawImage(tc,0,0);
    const [tn,tng]=cv(o.w,o.h);o.ng.save();o.ng.globalCompositeOperation='destination-out';o.ng.drawImage(mc,0,0);o.ng.restore();
    if(o.s0.night){tng.drawImage(o.s0.night,o.pl,o.pt);tng.globalCompositeOperation='destination-in';tng.drawImage(mc,0,0);o.ng.drawImage(tn,0,0);}
  }
  function plateFresh(o,sz,col,e1,e2,rk){
    const hw=32*sz,ty=o.ay-hw;A.dia(o.g,o.ax,ty,hw,col);
    if(rk)for(let i=0;i<26*sz;i++){const yy=1+Math.floor(rk()*(hw-2)),hr=Math.max(1,(yy<hw/2?(yy+1):(hw-yy))*2-2),xx=o.ax-hr+Math.floor(rk()*hr*2);
      o.g.fillStyle=rk()<.5?shade(col,-10):shade(col,8);o.g.fillRect(xx,ty+yy,2,1);}
    A.diaEdge(o.g,6,e1||shade(col,-20),o.ax,ty,hw);A.diaEdge(o.g,9,e2||shade(col,10),o.ax,ty,hw);
  }
  function finishFresh(o,L,ol){ // redraw 收尾：結構層外框→蓋在地塊上→整張 polish526→material479
    A.outlineSprite(L.c,ol[0],ol[1],ol[2]);o.g.drawImage(L.c,0,0);o.ng.drawImage(L.nc,0,0);
    polishFull(o.c,o);material(o.c,o);
  }
  function save(o,v){B[o.k+'_1_'+v]={img:o.c,night:o.s0.night?o.nc:undefined,ax:o.ax,ay:o.ay,w:o.w,h:o.h,smoke:[]};}
  const RK=(k,v)=>A.metroRand516('v574:'+k+':'+v);
  const safe=(k,fn)=>{try{if(B[k+'_1_0'])fn();}catch(e){console.error('b04 k'+k,e);}};
  /* ---- 地面座標（i 沿左緣 S→W、j 沿右緣 S→E；單位＝半格 1px 高）---- */
  const gp=(o,i,j)=>[Math.round(o.ax-2*i+2*j),Math.round(o.ay-i-j)];
  function gq(g,o,i0,i1,j0,j1,col){poly(g,[gp(o,i0,j0),gp(o,i1,j0),gp(o,i1,j1),gp(o,i0,j1)],col);}
  function gell(g,o,ic,jc,qi,pj,col,ex){ // 地面超橢圓（ex=2 橢圓、4 跑道形）
    ex=ex||2;const [cx,cy]=gp(o,ic,jc),R=Math.ceil(2*(qi+pj))+2;g.fillStyle=col;
    for(let y=cy-R;y<=cy+R;y++)for(let x=cx-R;x<=cx+R;x++){
      const X=x+.5-o.ax,Y=o.ay-(y+.5),j=(X/2+Y)/2,i=(Y-X/2)/2;
      if(Math.pow(Math.abs((i-ic)/qi),ex)+Math.pow(Math.abs((j-jc)/pj),ex)<=1)g.fillRect(x,y,1,1);}
  }
  // 筒拱屋頂量體：拱脊平行右牆（b 軸），拱形山牆在左牆（受光）；RC=[脊亮,中,簷暗,背坡]
  function vault(g,sx,sy,a,b,h,rise,cL,cR,RC){
    prism(g,sx,sy,a,b,h,cL,cR,null);
    const z=u=>Math.round(rise*Math.sqrt(Math.max(0,1-Math.pow((u-a)/a,2))));
    for(let u=2*a;u>=0;u--){
      const x0=sx-u,y0=sy-(u>>1)-h-z(u),sl=z(Math.min(2*a,u+1))-z(Math.max(0,u-1));
      const col=Math.abs(sl)<=1?RC[0]:sl>0?(sl>=3?RC[2]:RC[1]):RC[3];
      const th=Math.max(1,Math.abs(z(u)-z(Math.max(0,u-1))))+1;
      for(let k=0;k<2*b;k++){g.fillStyle=col;g.fillRect(x0+k,y0-((k+1)>>1),1,th);}
    }
    for(let u=1;u<=2*a;u++){const x=sx-u,yb=sy-(u>>1)-h,zz=z(u);if(zz>0){put(g,x,yb-zz,1,zz+1,cL);}
      put(g,x,yb-zz,1,1,shade(cL,18));}
    return z;
  }

  /* =================== k32 大學（3×3，英雄素材 compose） =================== */
  safe(32,()=>{
    const OL=[26,30,44],GL='#35404c',LIT='#ffe9c0',TRIM='#8a7a58';
    const WL='#dccfa9',WR='#ab9d7b',RF='#a47d58',RB='#7d5e40';
    // v1：雙翼擴建——左右兩棟山牆講堂夾住主樓，校園變寬
    {const o=base(32),L=layer(o),g=L.g,ng=L.ng,rk=RK(32,1);
      // 西翼（屋脊平行左牆，山牆朝東南）
      let P=prism(g,40,184,12,10,20,WL,WR,null);
      gable(g,P,12,10,9,'a',RF,RB,WR);
      wins(g,ng,'L',40,184,[3,17],6,3,6,'arch',GL,LIT,TRIM,i=>i===0);
      wins(g,ng,'R',40,184,[5,12],6,3,6,'arch',GL,LIT,TRIM,i=>i===1);
      door(g,null,'L',40,184,10,4,6,'#5a4632',TRIM);
      put(g,48,155,3,3,'#e8dcc0');put(g,49,156,1,1,GL); // 山牆圓窗
      // 東翼（屋脊平行右牆，山牆朝西南受光）
      P=prism(g,168,184,10,12,20,WL,WR,null);
      gable(g,P,10,12,9,'b',shade(RF,-18),shade(RB,10),WL);
      wins(g,ng,'L',168,184,[5,12],6,3,6,'arch',GL,LIT,TRIM,i=>i===1);
      wins(g,ng,'R',168,184,[3,17],6,3,6,'arch',GL,LIT,TRIM,i=>i===1);
      door(g,null,'R',168,184,10,4,6,'#4a3a28',shade(TRIM,-20));
      put(g,157,155,3,3,'#f0e6cc');put(g,158,156,1,1,GL);
      commit(o,L,OL);save(o,1);}
    // v2：穹頂＋鐘樓——尖塔換成鼓座穹頂，東角立一座獨立鐘樓（鐘面移到鐘樓）
    {const o=base(32),rk=RK(32,2);
      o.g.clearRect(92,88,25,54);o.ng.clearRect(88,88,33,56);
      const L=layer(o),g=L.g,ng=L.ng;
      // 鼓座
      cyl(g,104,148,14,16,'#e6d8b2','#cdbd95','#a8986f',null);
      for(const dx of [-10,-5,0,5]){const x=104+dx,y=141+drumY(14,dx+1)-6;put(g,x,y,2,6,dx>2?'#2a323c':GL);put(g,x,y-1,2,1,dx>2?'#c4b490':'#f2e8cc');
        if(dx!==0){ng.fillStyle=LIT;ng.fillRect(x,y,2,6);}}
      // 穹頂（銅綠）
      dome(g,104,132,15,['#a9ccb6','#7ea58f','#5f8573','#48685a'],[-.5,0,.5]);
      ringFront(g,104,132,15,7.5,'#f2e8cc','#c4b490');
      // 燈籠亭
      put(g,101,112,6,6,'#e6d8b2');put(g,104,112,3,6,'#b8a880');put(g,102,114,1,3,GL);
      ng.fillStyle=LIT;ng.fillRect(102,114,1,3);
      ell(g,104,112,4,2,'#6f967f');put(g,103,104,2,6,'#d8c070');put(g,103,103,2,1,'#f0dc90');
      // 東角鐘樓
      const P=prism(g,168,184,5,5,62,'#dccfa9','#a99b79','#8f7f5a');
      band(g,168,184,5,5,44,1,'#efe3c0','#b8aa88');band(g,168,184,5,5,60,2,'#efe3c0','#b8aa88');
      for(const d of [3,7]){const x=168-d-2,y=yL(184,d)-58;put(g,x,y,2,7,'#2a2e36');put(g,x,y-1,2,1,'#f0e6cc');}
      for(const d of [2,6]){const x=168+d,y=yR(184,d)-58;put(g,x,y,2,7,'#20242c');put(g,x,y-1,2,1,'#c8ba98');}
      {const cx=163,cy=yL(184,5)-38;ell(g,cx,cy,3,3,'#f4efe0');put(g,cx-1,cy-2,1,2,'#3a3026');put(g,cx-1,cy,2,1,'#3a3026');
        ng.fillStyle='#ffe9a0';ng.fillRect(cx-2,cy-2,4,4);}
      const ap=hip(g,P,13,'#a47d58','#7a5a3c','#8a6a48');
      put(g,ap[0]-1,ap[1]-5,2,5,'#d8c070');
      door(g,null,'L',168,184,3,3,6,'#5a4632',TRIM);
      tree(g,30,178,6,'#4e9148','#74b25e');tree(g,48,186,4,'#4a8a44','#6eab58');
      commit(o,L,OL);save(o,2);}
  });

  /* =================== k45 研究院（2×2，compose） =================== */
  safe(45,()=>{
    const OL=[26,30,44],WL='#a8c0c8',WR='#88a4ac',RT='#6c8890',GL='#2a5a68',LIT='#7ce0f0';
    // v1：加高——屋頂退縮加一層實驗塔＋屋頂大碟形天線
    {const o=base(45),rk=RK(45,1);
      o.g.clearRect(57,62,24,26);o.ng.clearRect(57,56,24,32);
      const L=layer(o),g=L.g,ng=L.ng;
      const P=prism(g,68,111,9,9,26,WL,WR,shade(RT,6));
      for(const yb of [4,11,18])wins(g,ng,'L',68,111,[3,8,13],yb,3,4,'grid',GL,LIT,'#c8d8dc',i=>rk()<.45);
      for(const yb of [4,11,18])wins(g,ng,'R',68,111,[2,7,12],yb,3,4,'grid',GL,LIT,'#9ab0b6',i=>rk()<.55);
      // 碟形天線（仰角朝西南）
      put(g,67,70,3,6,'#8a969c');put(g,65,75,7,2,'#6a767c');
      rell(g,66,64,9,5,-.45,'#c9d3d6');rell(g,66,64,7,3.6,-.45,'#aab6ba');rell(g,65,65,4,2,-.45,'#95a3a8');
      seg(g,60,68,64,60,'#6a767c');seg(g,72,62,64,60,'#6a767c');put(g,63,59,2,2,'#dfe6e8');
      // 天線桿＋警示燈
      put(g,78,64,1,14,'#8a969c');put(g,78,63,1,1,'#d85a4a');ng.fillStyle='#ff6a5a';ng.fillRect(78,63,1,1);
      commit(o,L,OL);save(o,1);}
    // v2：水平園區——西北側低矮實驗翼（藏在主樓後）＋東角地面電波望遠鏡
    {const o=base(45),rk=RK(45,2);
      let L=layer(o),g=L.g,ng=L.ng;
      prism(g,42,134,12,8,14,WL,WR,'#7a9298');
      for(let dx=3;dx<=21;dx++){const x=42-dx,y=yL(134,dx)-10;put(g,x,y,1,3,GL);if(dx%6<3){ng.fillStyle=LIT;ng.fillRect(x,y,1,3);}}
      for(let dx=2;dx<14;dx++){const x=42+dx,y=yR(134,dx)-10;put(g,x,y,1,3,shade(GL,-12));}
      put(g,28,110,5,3,'#b9c0c6');put(g,28,112,5,1,'#8d959c');put(g,38,114,4,3,'#b9c0c6');put(g,38,116,4,1,'#8d959c');
      commit(o,L,OL);
      reoverlay(o,[[39,101],[68,86],[97,101],[97,133],[68,148],[39,133]]);
      // 東角電波望遠鏡
      L=layer(o);g=L.g;ng=L.ng;
      prism(g,112,125,3,3,8,'#b8c4c8','#8a989e','#9aa8ae');
      put(g,111,106,3,12,'#7a868c');put(g,113,106,1,12,'#5e6a70');
      const F=dish(g,112,101,11,-.62,['#e6ecee','#a4b0b6','#c6d0d4','#6e7a80','#6a767c']);
      put(g,98,120,5,4,'#98a6ac');put(g,98,119,5,1,'#c8d2d6'); // 控制箱
      ng.fillStyle='#ff6a5a';ng.fillRect(F[0],F[1]-2,1,1);g.fillStyle='#d85a4a';g.fillRect(F[0],F[1]-2,1,1);
      commit(o,L,OL);
      save(o,2);}
  });

  /* =================== k41 圖書總館（2×2，compose） =================== */
  safe(41,()=>{
    const OL=[26,30,44],GL='#3a4a5a',LIT='#ffe9c0';
    // v1：大穹頂閱覽室＋左立面山花柱廊（新古典）
    {const o=base(41),rk=RK(41,1);
      o.g.clearRect(59,64,19,24);o.ng.clearRect(59,60,19,28);
      const L=layer(o),g=L.g,ng=L.ng;
      // 柱廊：壓暗凹廊＋四柱＋山花
      // 鼓座＋穹頂（先畫：在柱廊之後方）
      cyl(g,68,108,15,12,'#c9bda2','#aea286','#8a7e64',null);
      for(const dx of [-10,-5,0,5,10]){const x=68+dx,y=99+drumY(15,dx+1);put(g,x,y,2,5,dx>3?'#2e3a46':GL);
        if(dx!==5&&dx!==-10){ng.fillStyle=LIT;ng.fillRect(x,y,2,5);}}
      dome(g,68,96,15,['#b4bec6','#8e9ca8','#6c7884','#56606c'],[-.55,0,.55]);
      ringFront(g,68,96,15,7.5,'#ebe0c4','#b8aa88');
      put(g,65,76,6,6,'#dccfb0');put(g,68,76,3,6,'#a89876');put(g,66,78,1,3,GL);ng.fillStyle=LIT;ng.fillRect(66,78,1,3);
      ell(g,68,76,4,2,'#7c8a96');put(g,67,69,2,6,'#d8c070');
      // 柱廊：壓暗凹廊＋六根細柱＋簷帶＋山花（在立面最前）
      poly(g,[[43,112],[61,121],[61,138],[43,129]],'#5e5446');
      for(const d of [8,11,14,17,20,23]){const x=68-d-1,yb=yL(146,d);put(g,x,yb-27,1,24,'#ece2c8');put(g,x+1,yb-27,1,24,'#b4a688');}
      poly(g,[[42,106],[62,116],[62,120],[42,110]],'#d8ccae'); // 簷帶
      poly(g,[[42,106],[62,116],[52,101]],'#e6dabc');          // 山花
      seg(g,42,106,52,101,'#f6eed8');seg(g,53,102,61,115,'#b8aa88');put(g,51,107,3,2,'#b0a282');
      poly(g,[[42,131],[62,141],[62,143],[42,133]],'#c4b696'); // 台基
      commit(o,L,OL);save(o,1);}
    // v2：書塔——屋頂中央升起一座哥德式藏書塔（高瘦），尖錐頂＋角尖塔
    {const o=base(41),rk=RK(41,2);
      o.g.clearRect(59,64,19,24);o.ng.clearRect(59,60,19,28);
      const L=layer(o),g=L.g,ng=L.ng;
      const P=prism(g,68,112,9,9,48,'#cfc09f','#a89876','#8a7a5a');
      for(const yb of [8,26])wins(g,ng,'L',68,112,[3,11],yb,3,10,'arch',GL,LIT,'#e8dcc0',()=>rk()<.55);
      for(const yb of [8,26])wins(g,ng,'R',68,112,[3,11],yb,3,10,'arch','#34424e',LIT,'#bfb192',()=>rk()<.4);
      band(g,68,112,9,9,40,2,'#e6dac0','#b8aa8a');band(g,68,112,9,9,21,1,'#e0d4b8','#b0a282');
      const ap=hip(g,P,18,'#7a6a52','#5a4c3a','#6a5a46');
      for(const p of [P.Wt,P.St,P.Et]){put(g,p[0]-1,p[1]-7,3,7,'#d8cab0');put(g,p[0],p[1]-10,1,3,'#e8dcc0');}
      put(g,67,ap[1]-4,2,4,'#d8c070');
      commit(o,L,OL);save(o,2);}
  });

  /* =================== k51 太空研究中心（3×3，英雄素材 compose） =================== */
  safe(51,()=>{
    const OL=[26,30,44];
    // v1：深空追蹤站——西角加雷達罩＋大型追蹤碟形天線
    {const o=base(51),L=layer(o),g=L.g,ng=L.ng,rk=RK(51,1);
      // 雷達罩（後）
      cyl(g,22,170,7,5,'#c8ccd0','#a8aeb4','#868c94',null);
      ball(g,22,159,9,['#f4f6f8','#dde2e6','#b8c0c8','#98a2ac']);
      for(const yy of [154,161])for(let x=13;x<=31;x++){const dx=(x+.5-22)/9,dy=(yy+.5-159)/9;if(dx*dx+dy*dy<.9)put(g,x,yy,1,1,'rgba(90,100,112,.22)');}
      put(g,21,147,2,3,'#8a9098');put(g,21,146,2,1,'#d85a4a');ng.fillStyle='#ff6a5a';ng.fillRect(21,146,2,1);
      // 追蹤碟（前）
      prism(g,50,190,5,5,6,'#b8bec6','#8a9098','#a0a8b0');
      put(g,48,168,5,18,'#8a9098');put(g,51,168,2,18,'#666e76');put(g,44,176,12,3,'#7a828a');
      dish(g,50,163,14,-.62,['#eceff2','#a6b0b8','#c8d0d6','#6e7880','#6a727a']);
      put(g,60,184,6,4,'#8a9098');put(g,60,183,6,1,'#c0c6cc');put(g,61,185,2,1,'#e0b040'); // 控制櫃
      ng.fillStyle='#ffd070';ng.fillRect(61,185,2,1);
      commit(o,L,OL);save(o,1);}
    // v2：重型運載——西角第二發射台：捆綁助推器的高火箭＋紅色勤務塔
    {const o=base(51),L=layer(o),g=L.g,ng=L.ng,rk=RK(51,2);
      prism(g,40,186,10,10,3,'#b4b8bc','#8a8e94','#a2a6ac');
      poly(g,[[30,172],[40,177],[42,176],[32,171]],'#3a3e44'); // 導焰槽
      // 勤務塔（後）
      const TX=52;
      for(let y=96;y<176;y++){put(g,TX,y,1,1,'#b04a36');put(g,TX+5,y,1,1,'#8a3626');}
      for(let y=98;y<174;y+=6){seg(g,TX+1,y,TX+4,y+5,'#c05a44');seg(g,TX+4,y,TX+1,y+5,'#9a4030');put(g,TX,y,6,1,'#c86450');}
      put(g,TX-1,94,8,2,'#6a6e74');put(g,TX+2,86,2,8,'#8a9098');put(g,TX-8,86,12,1,'#8a9098'); // 塔頂吊臂
      put(g,TX+2,85,1,1,'#ff5a4a');ng.fillStyle='#ff6a5a';ng.fillRect(TX+2,85,1,1);
      put(g,44,120,8,2,'#7a7e84');put(g,44,142,8,2,'#7a7e84'); // 擺臂
      // 助推器
      for(const bx of [31,45]){cyl(g,bx,172,2.5,40,'#f2f4f6','#d6dadf','#aab0b6',null);
        poly(g,[[bx-2,132],[bx+3,132],[bx,124]],'#e6e9ec');put(g,bx,124,1,8,'#c4c9ce');put(g,bx-2,168,5,2,'#44484e');}
      // 芯級
      cyl(g,38,174,4.5,74,'#f6f8fa','#dde1e5','#b0b6bc',null);
      put(g,34,112,9,3,'#2a2e36');put(g,34,150,9,2,'#c8463a');put(g,34,136,9,1,'#2a2e36');
      poly(g,[[33,100],[43,100],[40,92],[38,86],[36,92]],'#eceff2');poly(g,[[38,86],[40,92],[43,100],[39,100]],'#c2c8ce');
      put(g,36,104,2,4,'#3a5a9a');put(g,36,105,2,1,'#e8e8e8');
      put(g,33,172,11,3,'#3a3e44');
      // 泛光燈桿（燈具實畫）
      for(const lx of [22,58]){put(g,lx,158,1,16,'#6a6e74');put(g,lx-1,157,3,2,'#e8e4c8');ng.fillStyle='#fff2c0';ng.fillRect(lx-1,157,3,2);}
      commit(o,L,OL);save(o,2);}
  });

  /* =================== k46 氣象站（1×1；繪製端有雷達動畫掛點 (36,34)，畫布與錨點不動） =================== */
  safe(46,()=>{
    const OL=[26,30,40];
    const stevenson=(g,x,y)=>{ // (x,y)=地面左腳
      put(g,x,y-5,1,5,'#6a6e74');put(g,x+5,y-5,1,5,'#5a5e64');
      put(g,x-1,y-12,8,7,'#f0f0ea');put(g,x+4,y-12,3,7,'#c8c8c0');put(g,x-2,y-13,10,2,'#dcdcd4');
      for(let i=0;i<3;i++)put(g,x,y-10+i*2,6,1,'#b8b8b0');
    };
    // v1：加高觀測艙——屋頂玻璃觀測艙＋延伸桅桿直抵雷達掛點＋地面百葉箱
    {const o=base(46),rk=RK(46,1);
      o.g.clearRect(24,30,25,32);o.ng.clearRect(24,26,25,36);
      const L=layer(o),g=L.g,ng=L.ng;
      prism(g,36,76,6,6,12,'#d6e0ea','#aebdcc','#8898a8');
      for(let dx=2;dx<=10;dx++){const x=36-dx,y=yL(76,dx)-9;put(g,x,y,1,5,dx%4===0?'#c8d4e0':'#3a4a5a');if(dx%4){ng.fillStyle='#ffe9c0';ng.fillRect(x,y,1,5);}}
      for(let dx=1;dx<10;dx++){const x=36+dx,y=yR(76,dx)-9;put(g,x,y,1,5,dx%4===0?'#a8b8c8':'#2e3c4a');}
      put(g,35,34,2,24,'#7a828a');put(g,36,34,1,24,'#5a626a');
      put(g,30,44,12,2,'#a0a8ac');put(g,29,42,3,2,'#e0e6ea');put(g,40,42,3,2,'#e0e6ea');
      put(g,31,38,5,1,'#c8ccd0');put(g,37,37,4,3,'#c8ccd0');
      stevenson(g,10,97);
      put(g,58,92,3,5,'#7fb0d8');put(g,58,91,3,1,'#c8e0f0'); // 雨量筒
      commit(o,L,OL);save(o,1);}
    // v2：低矮觀測小屋＋獨立格構氣象桅（桅頂即雷達掛點）＋屋頂雷達罩
    {const o=fresh(46),rk=RK(46,2);
      plateFresh(o,1,'#9a9c9e',null,null,rk);
      const L=layer(o),g=L.g,ng=L.ng;
      // 格構桅（在小屋後方）
      for(let y=34;y<86;y++){const t=(y-34)/52,xl=Math.round(35-t*4),xr=Math.round(36+t*4);
        put(g,xl,y,1,1,'#b8bec4');put(g,xr,y,1,1,'#8a9096');}
      for(let y=38;y<84;y+=6){const t=(y-34)/52,t2=(y+6-34)/52;
        seg(g,Math.round(35-t*4),y,Math.round(36+t2*4),y+6,'#9aa0a6');put(g,Math.round(35-t*4),y,Math.round(2+t*8),1,'#c8ced4');}
      for(let y=34;y<46;y+=4)put(g,35,y,2,2,'#d05040');
      put(g,31,48,10,1,'#a0a8ac');put(g,30,46,3,2,'#e0e6ea');put(g,39,46,3,2,'#e0e6ea');
      // 小屋
      const P=prism(g,38,104,11,8,14,'#d0dae4','#a4b4c4','#8a9aaa');
      wins(g,ng,'L',38,104,[4,13],5,4,4,'punch','#3a4a5a','#ffe9c0','#e8eef4',i=>i===0);
      door(g,null,'R',38,104,6,4,7,'#5a3a24','#7a8a9a');
      band(g,38,104,11,8,12,2,'#e8eef4','#b8c4d0');
      // 雷達罩
      put(g,43,80,6,3,'#8a9098');ball(g,46,76,5,['#f6f8fa','#e0e4e8','#bcc4cc','#9aa4ae']);
      stevenson(g,9,96);
      put(g,60,82,1,12,'#6a6e74');put(g,57,81,7,1,'#a0a8ac');put(g,56,80,2,2,'#e0e6ea');put(g,62,80,2,2,'#e0e6ea'); // 風速計桿
      put(g,22,101,3,4,'#7fb0d8');put(g,22,100,3,1,'#c8e0f0');
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k116 數據中心（2×2；v0 為 T555 簡單剪影 → redraw） =================== */
  safe(116,()=>{
    const OL=[28,32,44],PL='#6a6e74',LED='#5aff8a';
    // v1：水平機房長廊——長條低矮機房、屋頂排風扇陣、單座冷卻槽、柴油發電貨櫃
    {const o=fresh(116),rk=RK(116,1);
      plateFresh(o,2,PL,shade(PL,-20),shade(PL,12),null);
      const L=layer(o),g=L.g,ng=L.ng;
      // 西角冷卻槽（沿用 v0 的冷卻圓柱語彙）
      cyl(g,22,120,6,22,'#9aa0a8','#8a9098','#6a7078','#c0c4ca');
      for(let x=16;x<28;x++)put(g,x,120+drumY(6,x+.5-22)-8,1,1,'#6a7078');
      put(g,18,106,3,3,'#e05252');ng.fillStyle='#ff6d5f';ng.fillRect(18,106,3,3);
      // 長機房
      const P=prism(g,76,142,22,9,18,'#4a5260','#2e343c','#3a414a');
      for(let dx=2;dx<44;dx+=4){const x=76-dx,y=yL(142,dx)-17;put(g,x,y,1,14,'#3e4552');}
      for(let dx=3;dx<18;dx+=4){const x=76+dx,y=yR(142,dx)-17;put(g,x,y,1,14,'#262b32');}
      for(let dx=4;dx<42;dx++){const x=76-dx,y=yL(142,dx)-12;put(g,x,y,1,2,'#12161c');
        if(dx%3===0){ng.fillStyle=LED;ng.fillRect(x,y,1,1);}}
      door(g,null,'R',76,142,2,5,9,'#20262e',null);put(g,79,133,2,1,LED);ng.fillStyle=LED;ng.fillRect(79,133,2,1);
      // 屋頂風扇陣
      for(const sb of [.3,.72])for(const sa of [.14,.34,.54,.74,.92]){
        const x=Math.round(P.St[0]+sa*(P.Wt[0]-P.St[0])+sb*(P.Et[0]-P.St[0])),y=Math.round(P.St[1]+sa*(P.Wt[1]-P.St[1])+sb*(P.Et[1]-P.St[1]));
        ell(g,x,y,4,2,'#8a9098');ell(g,x,y,3,1.5,'#161a20');put(g,x,y,1,1,'#aab0b8');}
      // 東角發電貨櫃＋排氣管
      prism(g,112,126,2,7,8,'#8a9098','#6a7078','#aab0b8');
      put(g,116,112,2,8,'#5a6068');put(g,115,111,4,1,'#3a4048');
      put(g,108,121,3,2,'#ffb35a');ng.fillStyle='#ffb35a';ng.fillRect(108,121,3,2);
      finishFresh(o,L,OL);save(o,1);}
    // v2：垂直機房塔——高聳無窗塔樓、直向散熱百葉、角柱 LED 燈帶、東側三座冷卻器、西角變電設備
    {const o=fresh(116),rk=RK(116,2);
      plateFresh(o,2,PL,shade(PL,-20),shade(PL,12),null);
      const L=layer(o),g=L.g,ng=L.ng;
      // 變電設備（西角）
      prism(g,26,124,4,4,8,'#8a9098','#6a7078','#9aa0a8');
      for(const bx of [21,25,29]){put(g,bx,104,1,8,'#c8ccd0');put(g,bx-1,103,3,1,'#e0e4e8');}
      // 塔
      const P=prism(g,64,138,13,13,50,'#4a5260','#2e343c','#262c34');
      for(let dx=3;dx<26;dx+=3){const x=64-dx,y=yL(138,dx)-47;put(g,x,y,1,42,'#586070');}
      for(let dx=2;dx<26;dx+=3){const x=64+dx,y=yR(138,dx)-47;put(g,x,y,1,42,'#232830');}
      band(g,64,138,13,13,48,2,'#6a7280','#3a4250');band(g,64,138,13,13,24,1,'#12161c','#0e1116');
      for(let y=92;y<134;y+=3){ng.fillStyle=LED;ng.fillRect(63,y,1,2);}
      put(g,63,90,1,44,'#1a3a28');
      door(g,null,'L',64,138,3,6,9,'#1a1e24',null);put(g,57,129,2,1,LED);ng.fillStyle=LED;ng.fillRect(57,129,2,1);
      // 屋頂冷卻機組＋天線
      prism(g,58,80,3,5,5,'#8a9098','#6a7078','#aab0b8');prism(g,72,80,4,3,5,'#8a9098','#6a7078','#aab0b8');
      put(g,64,56,1,16,'#8a9098');put(g,64,55,1,1,'#e05252');ng.fillStyle='#ff6d5f';ng.fillRect(64,55,1,1);
      put(g,40,76,3,3,'#e05252');put(g,87,76,3,3,'#ffb35a');ng.fillStyle='#ff6d5f';ng.fillRect(40,76,3,3);
      // 東側冷卻器三座
      for(const [cx,cy] of [[100,124],[110,119],[120,114]]){cyl(g,cx,cy,4,10,'#9aa0a8','#8a9098','#6a7078','#c0c4ca');ell(g,cx,cy-10,2.5,1.2,'#3a4048');}
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k84 幼兒園（1×1；v0 平面立面圖 → iso redraw） =================== */
  safe(84,()=>{
    const OL=[64,54,40],GLS='#7fb0d8',LIT='#ffe9b0',RB=['#e05252','#ffb35a','#7be08a','#5ec8ff'];
    // v1：單層長屋——紅山牆屋頂、牆腳高彩度彩虹帶（3px 繞兩面牆）、前院淺沙坑（深框）、東側大型溜滑梯
    {const o=fresh(84);
      plateFresh(o,1,'#9fae74','#8c9a62','#b2c186',null);
      const L=layer(o),g=L.g,ng=L.ng;
      const RB6=['#ff3434','#ff9014','#ffd400','#2fcf3f','#1f8fff','#9a4cff'];
      // 屋身（S 在 i=7,j=1；左牆 16px、右牆 14px）
      const S=gp(o,7,1),P=prism(g,S[0],S[1],8,7,13,'#f6e6b4','#dcc890',null);
      for(let dx=1;dx<=16;dx++){const x=S[0]-dx,y=yL(S[1],dx)-4;put(g,x,y,1,3,RB6[((dx-1)/3|0)%6]);}
      for(let dx=0;dx<14;dx++){const x=S[0]+dx,y=yR(S[1],dx)-4;put(g,x,y,1,3,shade(RB6[((dx+16)/3|0)%6],-18));}
      wins(g,ng,'L',S[0],S[1],[2,10],7,4,4,'punch',GLS,LIT,'#fff8e0',()=>true);
      wins(g,ng,'R',S[0],S[1],[2],7,3,4,'punch','#6a98c0',LIT,'#e8d8a8',()=>true);
      door(g,null,'R',S[0],S[1],8,3,8,'#2f8fe8','#fff8e0');
      gable(g,P,8,7,7,'a','#dc644e','#a84838','#dcc890');
      put(g,30,82,2,2,'#fff8e0');put(g,30,82,1,1,'#7fb0d8');
      // 溜滑梯（東側，塔腳 i=6,j=10）：紅色梯塔（可見梯級）＋亮黃滑道（上陡下緩）＋中段支腳
      {const [bx,by]=gp(o,6,10),H=18;
        put(o.g,bx-1,by,21,2,'rgba(20,26,22,.22)'); // 接地陰影畫在地塊上
        put(g,bx,by-H,1,H,'#d8342a');put(g,bx+3,by-H,1,H,'#b82a22');
        for(let y=by-H+2;y<by;y+=2)put(g,bx+1,y,2,1,'#ff7a5a');
        put(g,bx-1,by-H-1,6,2,'#ffd400');put(g,bx-1,by-H+1,6,1,'#d89a00');
        put(g,bx-1,by-H-5,1,4,'#d8342a');put(g,bx+4,by-H-5,1,4,'#b82a22');put(g,bx-1,by-H-5,6,1,'#ff5a3a');
        const x0=bx+5,x1=bx+16,y0=by-H-1,y1=by-3;let py=y0;
        const cy=x=>Math.round(y0+(y1-y0)*Math.sin((x-x0)/(x1-x0)*Math.PI/2));
        for(let x=x0;x<=x1;x++){const yy=cy(x);
          put(g,x,Math.min(py,yy),1,yy-Math.min(py,yy)+2,'#ffd400');put(g,x,yy,1,1,'#fff080');put(g,x,yy+2,1,1,'#d88a00');py=yy;}
        put(g,x1+1,y1+1,3,1,'#ffd400');put(g,x1+1,y1+2,3,1,'#d88a00');
        {const xl=x0+5,yy=cy(xl);put(g,xl,yy+3,1,by-yy-3,'#b82a22');}
      }
      finishFresh(o,L,OL);
      // 前院沙坑（獨立一層、在地塊陰影之後疊上才讀得出淺沙色）：深色 1px 木框（outline）＋遠側 1px 內陰影
      {const L2=layer(o),g2=L2.g;
        const Q=[gp(o,1,1),gp(o,4,1),gp(o,4,8.5),gp(o,1,8.5)];
        poly(g2,Q,'#e0c47e');poly(g2,Q.map(p=>[p[0],p[1]+1]),'#fbe9ae');
        {const [x,y]=gp(o,1.5,5.5);put(g2,x,y-2,2,2,'#e8302a');put(g2,x,y-3,2,1,'#ff8a70');} // 小紅桶（落在沙面內）
        {const [x,y]=gp(o,2.5,3);put(g2,x-1,y-1,3,1,'#fff6cc');put(g2,x-2,y,5,1,'#e8cf8e');} // 沙堆
        A.outlineSprite(L2.c,58,42,26);grainBands(L2.c,0,0,o.h0);
        o.g.drawImage(L2.c,0,0);}
      save(o,1);}
    // v2：兩層園舍＋蠟筆塔——平屋頂彩色女兒牆、東側黃色蠟筆圓塔（紅錐頂）
    {const o=fresh(84),rk=RK(84,2);
      plateFresh(o,1,'#9fae74','#8c9a62','#b2c186',null);
      const L=layer(o),g=L.g,ng=L.ng;
      const P=prism(g,30,104,9,8,22,'#f6e6b4','#dcc890','#a9bf8e');
      for(let dx=1;dx<=18;dx++){const x=30-dx,y=yL(104,dx)-22;put(g,x,y,1,2,RB[((dx-1)/5|0)%4]);}
      for(let dx=0;dx<16;dx++){const x=30+dx,y=yR(104,dx)-22;put(g,x,y,1,2,shade(RB[((dx)/4|0)%4],-30));}
      wins(g,ng,'L',30,104,[3,11],12,4,5,'arch',GLS,LIT,'#fff8e0',i=>i===0);
      wins(g,ng,'L',30,104,[11],3,4,4,'punch',GLS,LIT,'#fff8e0',()=>true);
      wins(g,ng,'R',30,104,[3,10],12,3,5,'arch','#6a98c0',LIT,'#e8d8a8',i=>i===1);
      door(g,null,'L',30,104,6,4,6,'#5ec8ff','#fff8e0');
      // 蠟筆塔
      cyl(g,49,98,5,24,'#f6d45c','#e8bc38','#c89820',null);
      for(let x=44;x<54;x++){const dy=drumY(5,x+.5-49);put(g,x,98+dy-12,1,2,'#d8503c');}
      put(g,47,82,2,4,GLS);put(g,47,81,2,1,'#fff8e0');ng.fillStyle=LIT;ng.fillRect(47,82,2,4);
      poly(g,[[43,75],[55,75],[49,61]],'#e0583f');poly(g,[[49,61],[55,75],[50,75]],'#b8402c');
      put(g,48,59,2,2,'#ffe07a');
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k68 天文台（2×2；v0 平面立面圖 → iso redraw） =================== */
  safe(68,()=>{
    const OL=[50,50,50],SLIT='#1c1814',SL='#b0e0ff',WARM='#ffd080';
    const W4=['#fbfbf8','#e6e6e0','#c8c8c2','#aeaea8'];
    const slit=(g,ng,cx,cy,r,x0,w)=>{ // 在半球上開觀測縫（x0..x0+w），夜光只落在縫上
      for(let x=x0;x<x0+w;x++){const dx=x+.5-cx;const q=r*r-dx*dx;if(q<=0)continue;
        const yt=Math.round(cy-Math.sqrt(q))+1,yb=Math.round(cy+(r/2)*Math.sqrt(q)/r)-1;
        put(g,x,yt,1,yb-yt,SLIT);ng.fillStyle=SL;ng.fillRect(x,yt,1,yb-yt);}
    };
    // v1：大型單圓頂——粗壯白色鼓座、開縫大穹頂伸出鏡筒、東側辦公附屋
    {const o=fresh(68),rk=RK(68,1);
      plateFresh(o,2,'#8f8b80','#7d796e','#8f8b80',rk);
      const L=layer(o),g=L.g,ng=L.ng;
      cyl(g,66,126,21,28,'#ecece6','#d4d4ce','#b0b0aa',null);
      for(const yb of [2,14])for(let x=45;x<87;x++){const dy=drumY(21,x+.5-66);put(g,x,126+dy-yb-2,1,2,(x-66)>6?'#a8a8a0':'#dcdcd4');}
      put(g,52,122,7,13,'#4a4238');put(g,53,123,5,12,'#8b7355');put(g,55,124,1,10,'#3a3228');
      ng.fillStyle='#e0c090';ng.fillRect(53,123,5,12);
      for(const x of [71,79]){put(g,x,110,3,5,'#3a3832');put(g,x+1,111,1,3,'#a4b8c4');ng.fillStyle=WARM;ng.fillRect(x+1,111,1,3);}
      dome(g,66,98,22,W4,[-.5,.5]);
      ringFront(g,66,98,22,11,'#c4c0b4','#9c988e');
      slit(g,ng,66,98,22,58,5);
      for(let t=0;t<=9;t++){put(g,59-t,85-t,3,2,'#7a7164');put(g,59-t,85-t,3,1,'#948b7c');} // 鏡筒（連續斜筒）
      put(g,48,73,3,3,'#5a5248');put(g,48,73,2,1,'#a49a8a');
      // 附屋
      const P=prism(g,98,132,5,9,14,'#e0ded8','#b0b0a8','#a8a49c');
      wins(g,ng,'R',98,132,[3,11],5,3,4,'punch','#3a3832',WARM,'#8a8a82',()=>true);
      wins(g,ng,'L',98,132,[4],5,3,4,'punch','#3a3832',WARM,'#c8c8c0',()=>false);
      for(let dx=0;dx<18;dx+=3){put(g,98+dx,yR(132,dx)-17,1,3,'#8a8a82');}
      finishFresh(o,L,OL);save(o,1);}
    // v2：雙圓頂觀測站——長條研究樓頂上大小兩座開縫圓頂
    {const o=fresh(68),rk=RK(68,2);
      plateFresh(o,2,'#8f8b80','#7d796e','#8f8b80',rk);
      const L=layer(o),g=L.g,ng=L.ng;
      const P=prism(g,72,138,20,8,16,'#e8e8e2','#c0c0ba','#b8b4a8');
      for(let dx=3;dx<39;dx+=6){const x=72-dx-2,y=yL(138,dx+1)-11;put(g,x,y,3,5,'#3a3832');put(g,x+1,y+1,1,3,'#a4b8c4');
        if(dx%12===3){ng.fillStyle=WARM;ng.fillRect(x+1,y+1,1,3);}}
      put(g,74,128,5,8,'#4a4238');put(g,75,129,3,7,'#8b7355');ng.fillStyle='#e0c090';ng.fillRect(75,129,3,7);
      band(g,72,138,20,8,14,2,'#f4f4ee','#c8c8c2');
      // 大圓頂
      cyl(g,52,105,11,8,'#ecece6','#d4d4ce','#b0b0aa',null);
      dome(g,52,97,12,W4,[0]);ringFront(g,52,97,12,6,'#d8d4c8','#a8a49c');slit(g,ng,52,97,12,48,3);
      put(g,44,86,2,2,'#7a7164');put(g,46,88,2,2,'#7a7164');
      // 小圓頂
      cyl(g,74,115,7,6,'#ecece6','#d4d4ce','#b0b0aa',null);
      dome(g,74,109,8,W4,null);ringFront(g,74,109,8,4,'#d8d4c8','#a8a49c');slit(g,ng,74,109,8,72,2);
      // 天線桿
      put(g,86,96,1,16,'#8a8a82');put(g,84,98,5,1,'#8a8a82');put(g,86,95,1,1,'#e05252');ng.fillStyle='#ff6a5a';ng.fillRect(86,95,1,1);
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k108 高中（2×2；v0 平面立面圖 → iso redraw） =================== */
  safe(108,()=>{
    const OL=[60,56,42],PL='#9aa07e',LIT='#ffe9b0',GLa='#6f9fc8',GLb='#557ea6',TRa='#f4ead0',TRb='#d2bf96';
    const WL='#e8d4a8',WR='#c2a87e',RF='#c4744f',RM='#b86a4a',RD='#8e4e36';
    // v1：L 形三層紅瓦教學樓圍住操場跑道，內角立鐘塔（樓梯間），前方旗桿
    {const o=fresh(108),rk=RK(108,1);
      plateFresh(o,2,PL,'#878d6c','#aab08c',null);
      const L=layer(o),g=L.g,ng=L.ng;
      // 跑道（地面跑道形）＋草皮內場＋中線
      gell(g,o,8,10,6,9,'#c26a50',4);gell(g,o,8,10,3.2,6,'#79b060',4);
      seg(g,...gp(o,8,5),...gp(o,8,15),'#f0ece0');
      // A 翼（後排長樓，脊平行右牆）
      let P=prism(g,36,128,10,28,23,WL,WR,null);
      for(const yb of [3,10,17]){wins(g,ng,'L',36,128,[4,12],yb,3,4,'punch',GLa,LIT,TRa,()=>rk()<.5);
        wins(g,ng,'R',36,128,[3,9,15,21],yb,3,4,'punch',GLb,LIT,TRb,()=>rk()<.45);}
      gable(g,P,10,28,8,'b',shade(RM,-10),RF,WL);
      // B 翼（右排，脊平行左牆）
      P=prism(g,104,126,16,10,23,WL,WR,null);
      for(const yb of [10,17])wins(g,ng,'L',104,126,[3,9,15],yb,3,4,'punch',GLa,LIT,TRa,()=>rk()<.5);
      wins(g,ng,'L',104,126,[3],3,3,4,'punch',GLa,LIT,TRa,()=>true);
      door(g,ng,'L',104,126,9,4,6,'#5a3a24','#b86a4a',null);
      for(const yb of [3,10,17])wins(g,ng,'R',104,126,[4,12],yb,3,4,'punch',GLb,LIT,TRb,()=>rk()<.4);
      gable(g,P,16,10,8,'a',RF,RD,WR);
      // 內角鐘塔
      P=prism(g,72,116,4,4,49,'#f0dfb6','#cdb48a',null);
      band(g,72,116,4,4,42,1,'#fff4dc','#dcc49c');band(g,72,116,4,4,30,1,'#fff4dc','#dcc49c');
      put(g,66,92,2,3,GLa);put(g,66,91,2,1,TRa);ng.fillStyle=LIT;ng.fillRect(66,92,2,3);
      put(g,75,92,2,3,GLb);put(g,75,91,2,1,TRb);
      {const cx=68,cy=75;ell(g,cx,cy,2.6,2.6,'#f8f8f0');put(g,cx-1,cy-2,1,2,'#3a3026');put(g,cx-1,cy-1,2,1,'#3a3026');}
      put(g,76,72,2,4,'#3a3a42');
      const ap=hip(g,P,10,RF,RD,RM);put(g,ap[0],ap[1]-4,1,4,'#8a8a92');
      // 旗桿
      put(g,42,112,1,21,'#8a8a92');put(g,42,111,1,1,'#d8d8d0');
      poly(g,[[43,112],[50,114],[43,117]],'#e05252');put(g,40,132,5,1,'#6a6a62');
      finishFresh(o,L,OL);save(o,1);}
    // v2：五層帶窗現代校舍（高瘦）＋筒拱體育館（矮胖）＋紅土籃球場
    {const o=fresh(108),rk=RK(108,2);
      plateFresh(o,2,PL,'#878d6c','#aab08c',null);
      const L=layer(o),g=L.g,ng=L.ng;
      // 球場
      gq(g,o,2,12,3,15,'#c26a50');
      {const c=[gp(o,2.8,3.8),gp(o,11.2,3.8),gp(o,11.2,14.2),gp(o,2.8,14.2)];
        for(let q=0;q<4;q++)seg(g,...c[q],...c[(q+1)%4],'#f0ece0');
        seg(g,...gp(o,2.8,9),...gp(o,11.2,9),'#f0ece0');}
      for(const jj of [4.6,13.4]){const [x,y]=gp(o,7,jj);put(g,x,y-7,1,7,'#6a6a72');put(g,x-1,y-9,3,2,'#f4f4ee');}
      // 教學樓（五層，連續帶窗）
      const S=[48,130],a=14,b=12,h=38;
      const P=prism(g,S[0],S[1],a,b,h,'#ece2cc','#c2b498','#a09a8c');
      for(let f=0;f<5;f++){const yb=4+f*7;
        for(let dx=2;dx<=2*a-2;dx++){const x=S[0]-dx,y=yL(S[1],dx)-yb-3,m=dx%5===1;put(g,x,y,1,3,m?'#e0d6be':GLa);
          if(!m&&((dx/5|0)+f)%3!==1){ng.fillStyle=LIT;ng.fillRect(x,y,1,3);}}
        for(let dx=2;dx<2*b-1;dx++){const x=S[0]+dx,y=yR(S[1],dx)-yb-3,m=dx%5===0;put(g,x,y,1,3,m?'#b4a68a':GLb);}
      }
      band(g,S[0],S[1],a,b,h-2,2,RF,RD);
      door(g,ng,'L',S[0],S[1],10,4,6,'#3a4a5a','#b86a4a','#ffe0a0');
      // 屋頂：樓梯間＋水塔
      prism(g,48,86,4,3,7,'#e6dcc4','#b8aa8e','#9a9486');
      put(g,37,76,1,5,'#6a6a62');put(g,44,76,1,5,'#5a5a52');
      cyl(g,41,75,4,6,'#d8dce0','#b8bcc4','#8a9098','#e8ecf0');
      // 體育館（筒拱）
      vault(g,100,128,14,12,12,10,'#e0d0b0','#b4a07e',['#d89070','#b86a4a','#8e4e36','#c47a56']);
      for(let u=6;u<=22;u++){const x=100-u,zz=Math.round(10*Math.sqrt(Math.max(0,1-Math.pow((u-14)/14,2))));
        const yt=128-(u>>1)-12-zz+3,yb=128-(u>>1)-4;if(yb>yt){put(g,x,yt,1,yb-yt,u%4===0?'#e8dcc0':GLa);
          if(u%4){ng.fillStyle=LIT;ng.fillRect(x,yt,1,yb-yt);}}}
      door(g,null,'R',100,128,4,4,6,'#5a3a24','#8e4e36');
      // 旗桿
      put(g,42,112,1,21,'#8a8a92');put(g,42,111,1,1,'#d8d8d0');
      poly(g,[[43,112],[50,114],[43,117]],'#e05252');put(g,40,132,5,1,'#6a6a62');
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k109 科技園（3×3；v0 平面立面圖 → iso redraw） =================== */
  safe(109,()=>{
    const OL=[58,72,84],PL='#8f9a94',E1='#7d8882',E2='#a1aca6';
    const GA='#b8d0d8',GB='#98b0b8',GC='#8aa4ac',BAND='#6f9fb8',BANDR='#5a8aa4',NL='#aef0ff',SOL='#28486a',SOL2='#4a78a8';
    // v1：環形總部——兩層玻璃環樓圍住中庭綠地，屋頂一圈太陽能板，東角通訊桅
    {const o=fresh(109),rk=RK(109,1);
      plateFresh(o,3,PL,E1,E2,null);
      const L=layer(o),g=L.g,ng=L.ng;
      const cx=104,cy=172,R=56,RI=34,h=18;
      // 環外樹與桅
      tree(g,24,172,5,'#4e8a4e','#6aa860');tree(g,40,182,4,'#4e8a4e','#6aa860');
      // 外環牆
      cyl(g,cx,cy,R,h,GA,'#a8c2ca',GB,null);
      for(let x=cx-R;x<cx+R;x++){const dx=x+.5-cx;if(Math.abs(dx)>R)continue;const yb=cy+drumY(R,dx),side=dx>R*.3;
        for(const [b0,hh] of [[3,4],[10,5]]){const mul=(x-cx+200)%6===0;
          put(g,x,yb-b0-hh,1,hh,mul?(side?'#88a0a8':'#c8dce2'):(side?BANDR:BAND));
          if(!mul&&(((x-cx+200)/6|0)*7+b0)%5<2){ng.fillStyle=NL;ng.fillRect(x,yb-b0-hh,1,hh);}}}
      // 屋頂環面
      ell(g,cx,cy-h,R,R/2,'#c6d4d8');
      for(let y=cy-h-R/2;y<=cy-h+R/2;y++)for(let x=cx-R;x<=cx+R;x++){
        const dx=x+.5-cx,dy=(y+.5-(cy-h))*2,rho=Math.sqrt(dx*dx+dy*dy);
        if(rho>R-1.2&&rho<=R){put(g,x,y,1,1,'#dfeaee');continue;}
        if(rho>40&&rho<50){const ang=Math.atan2(dy,dx),sgm=Math.floor((ang+Math.PI)/(Math.PI/10));
          const edge=Math.abs(((ang+Math.PI)/(Math.PI/10))-sgm-.5)>.42;put(g,x,y,1,1,edge?SOL2:SOL);}}
      // 中庭：內牆（後半）＋綠地
      ell(g,cx,cy-h,RI,RI/2,GC);
      for(let x=cx-RI;x<cx+RI;x++){const dx=x+.5-cx;if(Math.abs(dx)>=RI)continue;const up=Math.round((RI/2)*Math.sqrt(1-(dx/RI)*(dx/RI)));
        const yT=cy-h-up;put(g,x,yT+4,1,4,(x-cx+200)%6===0?'#9cb4bc':BANDR);
        if((x-cx+200)%6&&((x-cx+200)/6|0)%3===0){ng.fillStyle=NL;ng.fillRect(x,yT+4,1,4);}}
      for(let y=cy-RI;y<=cy+RI/2;y++)for(let x=cx-RI;x<=cx+RI;x++){
        const dx=x+.5-cx,d1=(y+.5-cy)*2,d2=(y+.5-(cy-h))*2;
        if(dx*dx+d1*d1<=RI*RI&&dx*dx+d2*d2<(RI-.5)*(RI-.5))put(g,x,y,1,1,'#7fae6a');}
      put(g,cx-1,cy-RI/2+4,3,6,'#c8c0b0');
      tree(g,cx-14,cy-RI/2+9,4,'#4e8a4e','#6aa860');tree(g,cx+13,cy-RI/2+8,4,'#4e8a4e','#6aa860');
      ringFront(g,cx,cy-h,RI,RI/2,'#e6f0f2','#b8c8cc');
      // 正門雨庇
      put(g,cx-6,cy+R/2-8,13,2,'#e8f0f4');put(g,cx-6,cy+R/2-6,13,1,'#8aa4ac');
      put(g,cx-4,cy+R/2-5,9,5,'#3a5a7a');ng.fillStyle=NL;ng.fillRect(cx-4,cy+R/2-5,9,5);
      // 東角通訊桅＋碟
      put(g,182,138,1,32,'#8a8a92');put(g,180,146,5,1,'#8a8a92');put(g,182,137,1,1,'#e05252');ng.fillStyle='#ff5a4a';ng.fillRect(182,137,1,1);
      put(g,179,170,7,2,'#6a7078');
      finishFresh(o,L,OL);save(o,1);}
    // v2：垂直研發塔（高瘦玻璃塔）＋鋸齒天窗實驗廠房＋太陽能車棚
    {const o=fresh(109),rk=RK(109,2);
      plateFresh(o,3,PL,E1,E2,null);
      const L=layer(o),g=L.g,ng=L.ng;
      gq(g,o,22,44,21,44,'#86a86e');gq(g,o,0,22,20.5,23.5,'#c8c0b0');
      tree(g,...gp(o,40,24),5,'#4e8a4e','#6aa860');tree(g,...gp(o,26,40),4,'#4e8a4e','#6aa860');
      // 衛星碟（後方綠地）
      {const [x,y]=gp(o,32,31);put(g,x-1,y-8,3,8,'#8a9098');dish(g,x,y-12,7,-.62,['#e6ecee','#a4b0b6','#c6d0d4','#6e7a80','#6a767c']);}
      // 塔
      const S=[68,192],a=14,b=14,h=98;
      const P=prism(g,S[0],S[1],a,b,h,GA,GB,'#8aa0a8');
      for(let f=0;f<11;f++){const yb=4+f*8;
        for(let dx=1;dx<=2*a;dx++){const x=S[0]-dx,y=yL(S[1],dx)-yb-5,m=dx%4===0;put(g,x,y,1,5,m?'#d4e4ea':BAND);
          if(!m&&(((dx/4|0)*3+f*5)%7)<3){ng.fillStyle=NL;ng.fillRect(x,y,1,5);}}
        for(let dx=0;dx<2*b;dx++){const x=S[0]+dx,y=yR(S[1],dx)-yb-5,m=dx%4===3;put(g,x,y,1,5,m?'#a8c0c8':BANDR);
          if(!m&&(((dx/4|0)*5+f*3)%7)<2){ng.fillStyle=NL;ng.fillRect(x,y,1,5);}}}
      put(g,S[0],S[1]-h,1,h,'#e8f4f8');
      // 塔頂：退縮機房＋太陽能＋天線
      {const rp=(i,j)=>[68-2*i+2*j,94-i-j];
        poly(g,[rp(2,2),rp(12,2),rp(12,12),rp(2,12)],SOL);
        for(const t of [4.5,7,9.5]){const p0=rp(t,2),p1=rp(t,12);seg(g,p0[0],p0[1],p1[0]-1,p1[1],SOL2);}
        prism(g,...rp(9,9),4,4,6,'#c8dce2','#98b0b8','#7a9098');
        const tp=rp(11,11);put(g,tp[0],tp[1]-30,1,24,'#8a8a92');put(g,tp[0],tp[1]-31,1,1,'#e05252');ng.fillStyle='#ff5a4a';ng.fillRect(tp[0],tp[1]-31,1,1);}
      door(g,ng,'L',S[0],S[1],10,6,7,'#3a5a7a','#e8f0f4','#aef0ff');
      // 鋸齒天窗廠房
      {const sx=146,sy=191,la=18,lb=20,lh=12,T=8,rise=6;
        prism(g,sx,sy,la,lb,lh,'#d8e0e2','#a8b4b8',null);
        for(let dx=3;dx<2*la;dx+=6){put(g,sx-dx-3,yL(sy,dx+2)-9,3,4,BAND);if(dx%12===3){ng.fillStyle=NL;ng.fillRect(sx-dx-3,yL(sy,dx+2)-9,3,4);}}
        const z=u=>{const m=u%T;return m===0&&u>0&&u<2*la?rise:Math.round(rise*(1-m/T));};
        for(let u=2*la;u>=0;u--){const x0=sx-u,yb=sy-(u>>1)-lh,zz=u===2*la?0:z(u);
          if(u%T===0&&u<2*la){for(let k=0;k<2*lb;k++){put(g,x0+k,yb-((k+1)>>1)-rise,1,rise,k%5===4?'#3a5870':SOL2);
              if(k%5!==4&&(u/T+k/5|0)%3===0){ng.fillStyle=NL;ng.fillRect(x0+k,yb-((k+1)>>1)-rise,1,rise);}}}
          const col=u%T===0?'#e8eef0':'#bcc8cc';
          for(let k=0;k<2*lb;k++)put(g,x0+k,yb-((k+1)>>1)-zz,1,1+(u%T===1?0:1),col);}
        for(let u=1;u<2*la;u++){const x=sx-u,yb=sy-(u>>1)-lh,zz=z(u);if(zz>0)put(g,x,yb-zz,1,zz,'#d8e0e2');put(g,x,yb-zz,1,1,'#f0f4f6');}
        door(g,null,'R',sx,sy,6,6,7,'#4a5a64','#e8f0f4');}
      // 太陽能車棚
      {const c=[gp(o,3,3),gp(o,18,3),gp(o,18,19),gp(o,3,19)];
        for(const [cx2,cy2,cc] of [[gp(o,8,8),0,'#e05252'],[gp(o,12,13),0,'#5ec8ff'],[gp(o,7,15),0,'#f0f0ea']]){const [x,y]=cx2;put(g,x-3,y-4,7,3,cc);put(g,x-2,y-5,5,1,shade(cc,20));put(g,x-3,y-1,7,1,'#2a2e36');}
        for(const q of c)put(g,q[0],q[1]-9,1,9,'#8a9098');
        const up=c.map(q=>[q[0],q[1]-10]);poly(g,up,SOL);
        for(let t=1;t<5;t++){const p0=gp(o,3+t*3,3),p1=gp(o,3+t*3,19);seg(g,p0[0],p0[1]-10,p1[0],p1[1]-10,SOL2);}
        for(let q=0;q<4;q++){const p=up[q],n=up[(q+1)%4];seg(g,p[0],p[1],n[0],n[1],'#6a90b8');}}
      finishFresh(o,L,OL);save(o,2);}
  });

  /* =================== k113 大學城（4×4；v0 平面立面圖 → iso redraw） =================== */
  safe(113,()=>{
    const OL=[58,60,46],PL='#9aa07e',E1='#878d6c',E2='#aab08c';
    const BL='#cf9062',BR='#a86a44',ST='#e8d4aa',STR='#bba27a',GL='#4a5a6a',GLR='#3a4652',LIT='#ffd98a',TR='#ecdcb4',TRR='#c4ae88';
    const LAWN='#79b060',PATH='#d9cba8',TC1='#4e8a4e',TC2='#6aa860';
    const pinn=(g,p)=>{put(g,p[0]-1,p[1]-6,3,6,'#e0cca2');put(g,p[0],p[1]-9,1,3,'#f0e2c0');};
    // v1：方庭學院——兩排三層紅磚學舍＋轉角哥德鐘塔圍出方庭，前側低矮拱廊迴廊，中央雕像
    {const o=fresh(113),rk=RK(113,1),Q=(i,j)=>gp(o,i,j);
      plateFresh(o,4,PL,E1,E2,null);
      const L=layer(o),g=L.g,ng=L.ng;
      gq(g,o,14,48,14,48,LAWN);gq(g,o,31,33,14,48,PATH);gq(g,o,14,48,31,33,PATH);
      poly(g,[Q(0,3),Q(3,0),Q(33,30),Q(30,33)],PATH);
      // 後左排 R1（脊平行右牆）
      let P=prism(g,56,222,12,52,28,BL,BR,null);
      for(const yb of [4,12,20]){wins(g,ng,'R',56,222,[4,12,20,28,36,44],yb,3,5,'arch',GLR,LIT,TRR,()=>rk()<.4);
        wins(g,ng,'L',56,222,[5,15],yb,3,5,'arch',GL,LIT,TR,()=>rk()<.5);}
      band(g,56,222,12,52,26,1,'#e0c49a','#b88a62');
      gable(g,P,12,52,12,'b','#7a4e32','#9a6a48',BL);
      // 後右排 R2（脊平行左牆）
      P=prism(g,216,222,40,12,28,BL,BR,null);
      for(const yb of [4,12,20]){wins(g,ng,'L',216,222,[4,12,20,28,36,44],yb,3,5,'arch',GL,LIT,TR,()=>rk()<.45);
        wins(g,ng,'R',216,222,[5,15],yb,3,5,'arch',GLR,LIT,TRR,()=>rk()<.4);}
      band(g,216,222,40,12,26,1,'#e0c49a','#b88a62');
      gable(g,P,40,12,12,'a','#a4704c','#6f4630',BR);
      // 轉角鐘塔
      P=prism(g,136,186,12,12,76,ST,STR,null);
      band(g,136,186,12,12,30,2,'#f4e6c4','#cdb690');band(g,136,186,12,12,56,1,'#f4e6c4','#cdb690');band(g,136,186,12,12,74,2,'#f4e6c4','#cdb690');
      wins(g,ng,'L',136,186,[5,15],60,3,8,'arch','#2a2e36',LIT,'#f4e6c4',()=>false);
      wins(g,ng,'R',136,186,[5,15],60,3,8,'arch','#20242c',LIT,'#cdb690',()=>false);
      wins(g,ng,'L',136,186,[10],34,3,12,'arch',GL,LIT,TR,()=>true);
      wins(g,ng,'R',136,186,[10],34,3,12,'arch',GLR,LIT,TRR,()=>false);
      for(const [cx,cy,c] of [[123,134,'#f8f4e6'],[148,134,'#dcd6c4']]){ell(g,cx,cy,4,4,c);put(g,cx-1,cy-3,1,3,'#3a3026');put(g,cx-1,cy-1,3,1,'#3a3026');
        ng.fillStyle='rgba(255,233,160,.85)';ng.fillRect(cx-3,cy-3,6,6);}
      const ap=hip(g,P,28,'#b86a4a','#8e4e36','#a45c40');
      for(const p of [P.Wt,P.St,P.Et])pinn(g,p);
      put(g,ap[0],ap[1]-6,1,6,'#8a8a92');put(g,ap[0]-2,ap[1]-5,5,1,'#8a8a92');
      // 雕像
      {const [x,y]=Q(32,32);put(g,x-3,y-3,7,3,'#d0c8b8');put(g,x-3,y-1,7,1,'#a8a090');put(g,x-1,y-10,3,7,'#a09080');put(g,x,y-11,1,1,'#c0b0a0');}
      tree(g,...Q(22,42),5,TC1,TC2);tree(g,...Q(42,22),5,TC1,TC2);
      // 前側拱廊（西南、東南）
      P=prism(g,120,254,32,6,10,BL,BR,null);
      for(let d=3;d<62;d+=6){const x=120-d-3,y=yL(254,d+2)-7;put(g,x,y,3,6,'#5a4632');put(g,x+1,y-1,1,1,'#5a4632');}
      gable(g,P,32,6,5,'a','#a4704c','#6f4630',BR);
      P=prism(g,152,254,6,32,10,BL,BR,null);
      for(let d=3;d<62;d+=6){const x=152+d,y=yR(254,d+1)-7;put(g,x,y,3,6,'#4a3826');put(g,x+1,y-1,1,1,'#4a3826');}
      gable(g,P,6,32,5,'b','#7a4e32','#9a6a48',BL);
      // 校門燈柱
      for(const [x,y] of [Q(4,12),Q(12,4)]){put(g,x,y-11,1,11,'#5a5a62');put(g,x-1,y-13,3,2,'#f0e0a0');ng.fillStyle='#ffe9a0';ng.fillRect(x-1,y-13,3,2);}
      finishFresh(o,L,OL);save(o,1);}
    // v2：中軸主塔——方正主樓頂上升起高聳學術塔（兩段退縮＋尖頂），前方林蔭大草坪中軸步道＋噴泉；
    //     西側現代玻璃科學館、東側穹頂圓形講堂
    {const o=fresh(113),rk=RK(113,2),Q=(i,j)=>gp(o,i,j);
      plateFresh(o,4,PL,E1,E2,null);
      const L=layer(o),g=L.g,ng=L.ng;
      gq(g,o,6,34,6,34,LAWN);poly(g,[Q(3,6),Q(6,3),Q(37,34),Q(34,37)],PATH);
      {const [x,y]=Q(20,20);ell(g,x,y,8,4,PATH);ell(g,x,y,6,3,'#4fc3d9');put(g,x,y-5,1,5,'#bfe8f0');put(g,x-1,y-6,3,1,'#dff4f8');}
      // 主樓
      const MS=[136,206],P=prism(g,MS[0],MS[1],22,22,30,BL,BR,'#9a8a78');
      for(const yb of [4,12,20]){wins(g,ng,'L',MS[0],MS[1],[4,11,25,32,39],yb,3,5,'arch',GL,LIT,TR,()=>rk()<.45);
        wins(g,ng,'R',MS[0],MS[1],[4,11,25,32,39],yb,3,5,'arch',GLR,LIT,TRR,()=>rk()<.35);}
      band(g,MS[0],MS[1],22,22,28,2,'#f0e0bc','#c8b08a');
      door(g,ng,'L',MS[0],MS[1],18,6,8,'#5a3a24',TR,null);door(g,null,'R',MS[0],MS[1],18,6,8,'#4a3020',TRR);
      // 主塔（第一段）
      const T=prism(g,136,164,10,10,76,ST,STR,'#b8a27e');
      for(let dx=4;dx<20;dx+=5){put(g,136-dx,yL(164,dx)-76,1,72,'#f4e6c4');put(g,136+dx,yR(164,dx)-76,1,72,'#a8906a');}
      for(let f=0;f<3;f++){const yb=10+f*18;
        wins(g,ng,'L',136,164,[7,12],yb,2,11,'arch',GL,LIT,TR,()=>rk()<.5);
        wins(g,ng,'R',136,164,[6,11],yb,2,11,'arch',GLR,LIT,TRR,()=>rk()<.35);}
      band(g,136,164,10,10,74,2,'#f4e6c4','#cdb690');
      for(const [cx,cy,c] of [[125,92,'#f8f4e6'],[147,92,'#dcd6c4']]){ell(g,cx,cy,3.5,3.5,c);put(g,cx,cy-3,1,3,'#3a3026');put(g,cx,cy,2,1,'#3a3026');
        ng.fillStyle='rgba(255,233,160,.85)';ng.fillRect(cx-2,cy-2,5,5);}
      for(const p of [T.Wt,T.St,T.Et])pinn(g,p);
      // 第二段退縮＋尖頂
      const T2=prism(g,136,84,7,7,14,ST,STR,null);
      wins(g,ng,'L',136,84,[5],4,3,7,'arch','#2a2e36',LIT,'#f4e6c4',()=>false);
      wins(g,ng,'R',136,84,[5],4,3,7,'arch','#20242c',LIT,'#cdb690',()=>false);
      const ap=hip(g,T2,22,'#b86a4a','#8e4e36','#a45c40');
      put(g,ap[0],ap[1]-6,1,6,'#d8c070');
      // 西：玻璃科學館
      {const sx=72,sy=242;prism(g,sx,sy,24,12,22,'#e4e0d6','#bcb6aa','#aaa69c');
        for(const yb of [3,10,17]){for(let dx=2;dx<48;dx++){const x=sx-dx,y=yL(sy,dx)-yb-4,m=dx%4===0;put(g,x,y,1,4,m?'#f0ece4':'#7fb0d8');
            if(!m&&((dx/4|0)+yb)%4===1){ng.fillStyle='#ffe9b0';ng.fillRect(x,y,1,4);}}
          for(let dx=1;dx<23;dx++){const x=sx+dx,y=yR(sy,dx)-yb-4,m=dx%4===0;put(g,x,y,1,4,m?'#c8c2b6':'#5f90b8');}}
        prism(g,48,210,5,4,5,'#d8d4ca','#aca89e','#9a968c');}
      // 東：穹頂圓形講堂
      {const cx=208,cy=222;cyl(g,cx,cy,22,18,BL,'#bc7c52',BR,null);
        for(let x=cx-21;x<cx+22;x+=6){const dx=x+.5-cx,yb=cy+drumY(22,dx);put(g,x,yb-18,1,18,dx>6?'#c4a07a':'#f0dcb4');}
        for(const dx of [-17,-11,-5,1,7,13]){const x=cx+dx+2,yb=cy+drumY(22,dx+2);put(g,x,yb-14,2,8,dx>6?GLR:GL);put(g,x,yb-15,2,1,dx>6?TRR:TR);
          if(dx<7&&dx%2){ng.fillStyle=LIT;ng.fillRect(x,yb-14,2,8);}}
        ell(g,cx,cy-18,22,11,'#8a7a68');ringFront(g,cx,cy-18,22,11,'#f0e0bc','#c8b08a');
        dome(g,cx,cy-20,15,['#a9ccb6','#7ea58f','#5f8573','#48685a'],[-.5,0,.5]);
        put(g,cx-2,cy-40,5,5,'#e8d8b2');put(g,cx+1,cy-40,2,5,'#bca27a');ell(g,cx,cy-40,3,1.5,'#6f967f');put(g,cx,cy-45,1,4,'#d8c070');}
      // 林蔭行道樹
      for(const [i,j] of [[24,34],[34,24],[16,26],[26,16],[8,18],[18,8]])tree(g,...Q(i,j),5,TC1,TC2);
      // 校門柱
      for(const [x,y] of [Q(3,10),Q(10,3)]){put(g,x-1,y-9,4,9,'#c9885a');put(g,x-2,y-10,6,2,'#e2cba0');}
      finishFresh(o,L,OL);save(o,2);}
  });
});
