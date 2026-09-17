(window.__variants574=window.__variants574||[]).push(function b02(A){
  const SPR=A.SPR(), B=SPR.bld, sh=A.shade;
  const ERR=window.__b02err=[];
  const RND=(k,v)=>A.metroRand516('v574:'+k+':'+v);
  const rd=Math.round;
  const P=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(rd(x),rd(y),w,h);};
  const mk=(w,h)=>{const [c,g]=A.cv(w,h),[nc,ng]=A.cv(w,h),[s,sg]=A.cv(w,h);return{c,g,nc,ng,s,sg,w,h};};
  const TC=(ax,ay,n)=>({N:[ax,ay-32*n],E:[ax+32*n,ay-16*n],S:[ax,ay],W:[ax-32*n,ay-16*n]});
  const tp=(C,u,v)=>{const p=A.paraPt559(C,u,v);return[rd(p[0]),rd(p[1])];};
  // ---------- 基本像素工具（整數、零共用亂數） ----------
  function poly(g,pts,col){g.fillStyle=col;let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    y0=Math.floor(y0);y1=Math.ceil(y1);
    for(let y=y0;y<y1;y++){const yc=y+.5,xs=[];
      for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);
      for(let i=0;i+1<xs.length;i+=2){const xa=rd(xs[i]),xb=rd(xs[i+1]);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}}}
  function ln(g,x0,y0,x1,y1,col,t){x0=rd(x0);y0=rd(y0);x1=rd(x1);y1=rd(y1);t=t||1;g.fillStyle=col;
    const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;
    for(let i=0;i<2000;i++){g.fillRect(x0,y0,t,1);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}}
  // 等距長方體：S 角 (sx,sy)，左面寬 2L、右面寬 2R，牆高 h
  function prism(g,sx,sy,L,R,h,cL,cR,cT,o){o=o||{};sx=rd(sx);sy=rd(sy);
    if(h>0){g.fillStyle=cL;for(let dx=1;dx<=2*L;dx++){const yF=sy-(dx>>1);g.fillRect(sx-dx,yF-h,1,h);}
      g.fillStyle=cR;for(let dx=0;dx<2*R;dx++){const yF=sy-((dx+1)>>1);g.fillRect(sx+dx,yF-h,1,h);}
      if(o.ao!==false){g.fillStyle='rgba(0,0,0,.13)';const a=Math.min(3,h);
        for(let dx=1;dx<=2*L;dx++)g.fillRect(sx-dx,sy-(dx>>1)-a,1,a);
        for(let dx=0;dx<2*R;dx++)g.fillRect(sx+dx,sy-((dx+1)>>1)-a,1,a);}
      if(o.corner!==false){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(sx,sy-h,1,h);}
    }
    const Wx=sx-2*L,Nx=sx-2*L+2*R,Ex=sx+2*R,yS=sy-h;
    const low=x=>x<sx?yS-((sx-x)>>1):yS-((x-sx+1)>>1);
    const up=x=>x<Nx?(yS-L)-((x-Wx)>>1):(yS-L-R)+((x-Nx)>>1);
    if(cT){for(let x=Wx;x<Ex;x++){const a=up(x),b=low(x);if(b>a){g.fillStyle=cT;g.fillRect(x,a,1,b-a);
      if(o.rim!==false){g.fillStyle=sh(cT,16);g.fillRect(x,a,1,1);if(b-a>1){g.fillStyle=sh(cT,-24);g.fillRect(x,b-1,1,1);}}}}}
    return{S:[sx,yS],W:[Wx,yS-L],N:[Nx,yS-L-R],E:[Ex,yS-R],sx,sy,L,R,h,low,up};
  }
  const tprism=(g,C,n,us,vs,Lu,Rv,h,cL,cR,cT,o)=>{const p=tp(C,us,vs);return prism(g,p[0],p[1],rd(16*n*Lu),rd(16*n*Rv),h,cL,cR,cT,o);};
  // 牆面窗：side -1 左面 / +1 右面；u=距 S 角水平像素，v=離地高
  function fw(g,pr,side,u,v,w,h,col){g.fillStyle=col;for(let i=0;i<w;i++){const dx=u+i;
    if(side<0)g.fillRect(pr.sx-dx,pr.sy-(dx>>1)-v-h,1,h);else g.fillRect(pr.sx+dx,pr.sy-((dx+1)>>1)-v-h,1,h);}}
  // 雙坡屋頂：屋脊平行左面（右面為山牆），rise=屋脊高
  function gableL(g,pr,rise,cNear,cFar,cGable){const S=pr.S,W=pr.W,N=pr.N,E=pr.E;
    const m1=[(S[0]+E[0])/2,(S[1]+E[1])/2-rise],m2=[(W[0]+N[0])/2,(W[1]+N[1])/2-rise];
    poly(g,[m2,N,E,m1],cFar);poly(g,[S,E,m1],cGable);poly(g,[S,W,m2,m1],cNear);
    ln(g,m2[0],m2[1],m1[0],m1[1],sh(cNear,22));return{m1,m2};}
  // 雙坡屋頂：屋脊平行右面（左面為山牆）
  function gableR(g,pr,rise,cNear,cFar,cGable){const S=pr.S,W=pr.W,N=pr.N,E=pr.E;
    const m1=[(S[0]+W[0])/2,(S[1]+W[1])/2-rise],m2=[(E[0]+N[0])/2,(E[1]+N[1])/2-rise];
    poly(g,[W,N,m2,m1],cFar);poly(g,[S,W,m1],cGable);poly(g,[S,m1,m2,E],cNear);
    ln(g,m1[0],m1[1],m2[0],m2[1],sh(cNear,18));return{m1,m2};}
  // 直立圓柱：(cx,cy)=底橢圓中心
  function cyl(g,cx,cy,r,h,c,o){o=o||{};cx=rd(cx);cy=rd(cy);const ry=r/2;
    for(let dx=-r;dx<r;dx++){const t=(dx+.5)/r,e=rd(ry*Math.sqrt(Math.max(0,1-t*t)));
      g.fillStyle=t<-.72?(c.e0||c.l):t<-.12?c.l:t<.38?c.m:t<.82?c.d:(c.e||sh(c.d,-22));
      if(c.hl&&t>-.6&&t<-.4)g.fillStyle=c.hl;
      g.fillRect(cx+dx,cy-h,1,h+e);}
    if(c.t){for(let dx=-r;dx<r;dx++){const t=(dx+.5)/r,e=rd(ry*Math.sqrt(Math.max(0,1-t*t)));
      g.fillStyle=c.t;g.fillRect(cx+dx,cy-h-e,1,2*e+1);
      if(o.rim!==false){g.fillStyle=c.tl||sh(c.t,16);g.fillRect(cx+dx,cy-h-e,1,1);g.fillStyle=c.tr||sh(c.t,-26);g.fillRect(cx+dx,cy-h+e,1,1);}
      if(o.open&&e>1){g.fillStyle=o.open;g.fillRect(cx+dx,cy-h-e+2,1,Math.max(0,2*e-3));}}}
    return{top:cy-h,cx,cy,r,h};}
  // 橢球穹頂／球：以左上為光源分帶
  function dome(g,cx,ty,r,H,c){cx=rd(cx);ty=rd(ty);const ry=r/2,Hy=Math.sqrt(H*H+ry*ry);
    for(let y=Math.floor(ty-Hy);y<=Math.ceil(ty+ry);y++)for(let dx=-r;dx<r;dx++){const t=(dx+.5)/r,yy=y+.5-ty;
      const q=yy<=0?t*t+(yy/Hy)*(yy/Hy):t*t+(yy/ry)*(yy/ry);if(q>1)continue;
      const hx=t+.38,hy=(yy<=0?yy/Hy:yy/ry)+.5,d=Math.sqrt(hx*hx+hy*hy)/1.5;
      g.fillStyle=d<.2?c.hl:d<.48?c.l:d<.78?c.m:c.d;g.fillRect(cx+dx,y,1,1);}}
  function ball(g,cx,cy,r,c){cx=rd(cx);cy=rd(cy);for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if((dx+.5)*(dx+.5)+(dy+.5)*(dy+.5)>r*r)continue;
    const hx=(dx+.5)/r+.4,hy=(dy+.5)/r+.4,d=Math.sqrt(hx*hx+hy*hy)/1.6;g.fillStyle=d<.18?c.hl:d<.45?c.l:d<.75?c.m:c.d;g.fillRect(cx+dx,cy+dy,1,1);}}
  // 軟蒸汽（不描邊、貼著出口往上）
  function puff(g,x,y,rx,ry,a){x=rd(x);y=rd(y);for(let dy=-ry;dy<=ry;dy++)for(let dx=-rx;dx<=rx;dx++){const q=(dx*dx)/(rx*rx+.5)+(dy*dy)/(ry*ry+.5);if(q>1)continue;
    g.fillStyle=(dy<0&&dx<rx*.3)?'rgba(250,252,253,'+a+')':'rgba(218,226,232,'+(a*.9).toFixed(3)+')';g.fillRect(x+dx,y+dy,1,1);}}
  // 地基板＋點綴＋投影
  function plate(g,ax,ay,n,col,rk,o){o=o||{};const hw=32*n;A.dia(g,ax,ay-hw,hw,col);
    const sp=o.specks||[sh(col,-10),sh(col,10)],cnt=o.cnt===undefined?18*n*n:o.cnt;
    for(let i=0;i<cnt;i++){const yy=2+Math.floor(rk()*(hw-4)),hh=hw>>1,hr=Math.max(1,(yy<hh?(yy+1):(hw-yy))*2-4),xx=ax-hr+Math.floor(rk()*hr*2);P(g,xx,ay-hw+yy,1,1,sp[i%sp.length]);}
    A.diaEdge(g,6,o.dk||sh(col,-16),ax,ay-hw,hw);A.diaEdge(g,9,o.lt||sh(col,14),ax,ay-hw,hw);}
  function shadow(g,cx,cy,rx,ry,a){g.fillStyle='rgba(25,25,31,'+(a||.16)+')';for(let y=-ry;y<=ry;y++){const t=y/(ry+.5),hx=rd(rx*Math.sqrt(Math.max(0,1-t*t)));if(hx>0)g.fillRect(rd(cx)-hx,rd(cy)+y,hx*2,1);}}
  // T479 材質（位元同式重演；hashLocal479 決定性）
  function mat(c,k,cat,seedX){const g=c.getContext('2d'),w=c.width,h=c.height,H=A.hashLocal479,seed=479000+k*17+(seedX|0);
    g.save();g.globalCompositeOperation='source-atop';
    const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,'rgba(255,236,194,.075)');grad.addColorStop(.52,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(28,35,43,.10)');g.fillStyle=grad;g.fillRect(0,0,w,h);
    const dens=Math.min(360,Math.max(10,Math.floor(w*h/520))),cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];
    for(let i=0;i<dens;i++){const x=Math.floor(H(seed,i,47901)*w),y=Math.floor(H(seed,i,47902)*h),rw=H(seed,i,47903)<.74?1:2,rh=H(seed,i,47904)<.88?1:2;g.fillStyle=cols[Math.floor(H(seed,i,47905)*3)%3];g.fillRect(x,y,rw,rh);}
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);tint.addColorStop(0,cat==='I'?'rgba(191,142,99,.045)':'rgba(222,213,190,.035)');tint.addColorStop(1,cat==='I'?'rgba(67,54,46,.09)':'rgba(43,49,54,.07)');g.fillStyle=tint;g.fillRect(0,0,w,h);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86),step=cat==='I'?9:8;g.strokeStyle=cat==='I'?'rgba(54,50,46,.10)':'rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=step){const off=Math.floor(H(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    if(cat==='I'){g.strokeStyle='rgba(225,215,194,.055)';for(let x=Math.floor(w*.28);x<w*.75;x+=12){g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();}}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');g.fillStyle=ao;g.fillRect(0,Math.floor(h*.70),w,Math.ceil(h*.30));
    g.restore();}
  // 分層：每層各自描邊後疊上主畫布（前後物件之間才有分隔線）
  function layer(M,draw,ol){const [s,sg]=A.cv(M.w,M.h);draw(sg);const o=ol||[26,30,44];A.outlineSprite(s,o[0],o[1],o[2]);M.g.drawImage(s,0,0);}
  function save(key,M,ax,ay,o){o=o||{};if(o.mat)mat(M.c,o.k,o.mat,o.seed);B[key]={img:M.c,night:o.noNight?undefined:M.nc,ax,ay,w:M.w,h:M.h,smoke:o.smoke||[]};}
  const safe=(name,fn)=>{try{fn();}catch(e){ERR.push(name+': '+(e&&e.stack||e));console.error('b02 '+name,e);}};

  /* ================= k49 油井 ================= */
  safe('49_1',()=>{ // v1：現代抽油機（驢頭機）＋水泥底座＋井口
    const M=mk(72,112),ax=36,ay=110,rk=RND(49,1),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#4a4038',rk,{specks:['#3e352e','#564c42']});
    P(g,40,99,6,2,'#2a2420');P(g,22,92,5,2,'#2a2420');P(g,44,101,3,1,'#2a2420');
    shadow(g,46,100,24,7);
    layer(M,sg=>{ // 底座
      tprism(sg,C,1,.92,.64,.74,.28,3,'#7a7268','#5e574f','#8a8278');
    });
    layer(M,sg=>{ // 井口＋光桿
      P(sg,22,82,4,7,'#6a6e76');P(sg,22,82,1,7,'#8a8e96');P(sg,21,84,6,1,'#4a4e56');P(sg,20,85,2,2,'#c84a3a');
      P(sg,23,62,1,20,'#a8acb2');
    });
    layer(M,sg=>{ // 齒輪箱＋曲柄配重（前）
      const gb=prism(sg,47,95,3,3,8,'#5a524a','#3e3832','#6a625a');
      poly(sg,[[38,84],[45,86],[45,94],[40,95],[37,90]],'#8a3a2a');P(sg,38,85,2,6,'#a84a36');P(sg,40,94,5,1,'#5e2a20');
      P(sg,44,88,3,2,'#2e2824');
    });
    layer(M,sg=>{ // 三腳塔架
      ln(sg,31,92,36,60,'#4a423a');ln(sg,32,92,37,60,'#3a342e');
      ln(sg,41,89,37,60,'#5a524a');ln(sg,42,89,38,60,'#3a342e');
      ln(sg,37,62,45,86,'#3a342e');
      P(sg,31,74,10,1,'#3a342e');
    });
    layer(M,sg=>{ // 遊樑＋驢頭＋連桿
      for(let x=26;x<=51;x++){const yc=60+(x-37)*.5;P(sg,x,yc-1,1,1,'#d8b060');P(sg,x,yc,1,1,'#b8903a');P(sg,x,yc+1,1,1,'#8a6a2a');}
      for(let y=48;y<=64;y++){const q=(y-56)/8,xl=27-rd(5*Math.sqrt(Math.max(0,1-q*q)));P(sg,xl,y,29-xl,1,y<56?'#d0a448':'#a8822e');P(sg,xl,y,1,1,'#e0bc68');}
      ln(sg,50,67,43,87,'#2e2824');ln(sg,51,67,44,87,'#4a423a');
      P(sg,35,57,4,3,'#3a342e');P(sg,36,55,2,2,'#7a2a22'); // 軸承座＋警示燈座
    });
    P(ng,36,55,2,2,'#ff5030');
    layer(M,sg=>{ // 油桶
      for(const b of[[54,94],[58,96]]){P(sg,b[0],b[1],4,5,'#3a342e');P(sg,b[0],b[1],1,5,'#5a524a');P(sg,b[0],b[1]+2,4,1,'#6a3a2a');P(sg,b[0],b[1]-1,4,1,'#5e564e');}
    });
    save('49_1_1',M,ax,ay,{mat:'I',k:49,seed:1});
  });
  safe('49_2',()=>{ // v2：老式木造井架＋山牆機房＋油池
    const M=mk(72,112),ax=36,ay=110,rk=RND(49,2),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#4a4038',rk,{specks:['#3e352e','#564c42']});
    shadow(g,46,100,26,8);
    poly(g,[[14,98],[22,95],[28,97],[24,101],[16,101]],'#1e1a16');P(g,17,98,3,1,'#4a4a52');
    const bw=tp(C,.2,.74),bs=tp(C,.62,.74),be=tp(C,.62,.32),bn=tp(C,.2,.32);
    const top=[rd((bw[0]+be[0])/2),18];
    const tw=[top[0]-3,top[1]],ts=[top[0],top[1]+2],te=[top[0]+3,top[1]],tn=[top[0],top[1]-2];
    layer(M,sg=>{ // 鑽台
      tprism(sg,C,1,.64,.76,.46,.46,3,'#9a7a52','#7a5e3e','#a8865a');
    });
    layer(M,sg=>{ // 木井架
      const bh=3,W=[bw[0],bw[1]-bh],S=[bs[0],bs[1]-bh],E=[be[0],be[1]-bh],N=[bn[0],bn[1]-bh];
      ln(sg,N[0],N[1],tn[0],tn[1],'#5e4630');
      const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      const lv=[.0,.2,.42,.66,.86];
      for(let i=0;i<lv.length;i++){const t=lv[i],w=lerp(W,tw,t),s=lerp(S,ts,t),e=lerp(E,te,t),n=lerp(N,tn,t);
        ln(sg,w[0],w[1],n[0],n[1],'#5e4630');ln(sg,n[0],n[1],e[0],e[1],'#5e4630');}
      for(let i=0;i<lv.length-1;i++){const a=lv[i],b=lv[i+1];
        const w0=lerp(W,tw,a),s0=lerp(S,ts,a),e0=lerp(E,te,a),w1=lerp(W,tw,b),s1=lerp(S,ts,b),e1=lerp(E,te,b);
        if(i%2===0){ln(sg,w0[0],w0[1],s1[0],s1[1],'#8a6a42');ln(sg,e0[0],e0[1],s1[0],s1[1],'#6e5234');}
        else{ln(sg,s0[0],s0[1],w1[0],w1[1],'#8a6a42');ln(sg,s0[0],s0[1],e1[0],e1[1],'#6e5234');}}
      for(let i=0;i<lv.length;i++){const t=lv[i],w=lerp(W,tw,t),s=lerp(S,ts,t),e=lerp(E,te,t);
        ln(sg,w[0],w[1],s[0],s[1],'#b08a5a');ln(sg,s[0],s[1],e[0],e[1],'#7a5c3a');}
      ln(sg,W[0],W[1],tw[0],tw[1],'#c49a66',2);ln(sg,S[0],S[1],ts[0],ts[1],'#9a7648',2);ln(sg,E[0],E[1],te[0],te[1],'#6e5234',2);
      P(sg,top[0]-4,top[1]-5,9,4,'#5a4636');P(sg,top[0]-4,top[1]-5,9,1,'#7a6450');P(sg,top[0]-1,top[1]-8,3,3,'#3a2e24');
      ln(sg,top[0]+1,top[1],top[0]+1,bs[1]-10,'#2a2622');
    });
    layer(M,sg=>{ // 山牆機房
      const pr=tprism(sg,C,1,.95,.5,.36,.34,11,'#9a7a52','#7a5e3e',null);
      gableL(sg,pr,6,'#6a5446','#4a3c34','#7a5e3e');
      fw(sg,pr,-1,3,0,3,7,'#3a2a1e');fw(sg,pr,1,4,4,3,3,'#e8c880');P(sg,pr.sx-5,pr.sy-11,2,2,'#e8c880');
      ln(sg,pr.W[0]+1,pr.W[1]+4,bs[0]+1,bs[1]-6,'#2a2622');
    });
    const eng=tp(C,.95,.5);P(ng,eng[0]+4,eng[1]-9,3,3,'#ffd890');P(ng,eng[0]-5,eng[1]-11,2,2,'#ffc870');
    layer(M,sg=>{ // 木桶
      for(const b of[[23,96],[27,98],[31,97]]){P(sg,b[0],b[1],4,5,'#6a4a2e');P(sg,b[0],b[1],1,5,'#8a6440');P(sg,b[0],b[1]+1,4,1,'#3a2a1a');P(sg,b[0],b[1]+3,4,1,'#3a2a1a');P(sg,b[0],b[1]-1,4,1,'#7a5a3c');}
    });
    save('49_1_2',M,ax,ay,{mat:'I',k:49,seed:2});
  });

  /* ================= k50 礦場 ================= */
  safe('50_1',()=>{ // v1：鋼構豎井井架（天輪）＋井口房＋捲揚機房
    const M=mk(72,112),ax=36,ay=110,rk=RND(50,1),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#7a6a52',rk,{specks:['#6a5a42','#8a7a5e']});
    shadow(g,46,100,26,8);
    layer(M,sg=>{ // 後斜撐（桁架）
      ln(sg,35,30,43,91,'#8a4632');ln(sg,38,30,46,90,'#6e3424');
      for(let i=1;i<6;i++){const t=i/6;P(sg,rd(35+8*t),rd(30+61*t),3,1,'#6e3424');}
    });
    layer(M,sg=>{ // 捲揚機房
      const pr=tprism(sg,C,1,1,.3,.3,.3,10,'#b07a50','#8a5a3a','#5a4c44');
      fw(sg,pr,-1,3,0,3,6,'#3a2a1e');fw(sg,pr,1,3,4,3,3,'#e8d8a0');
    });
    const wh=tp(C,1,.3);P(ng,wh[0]+3,wh[1]-7,3,3,'#ffe0a0');
    layer(M,sg=>{ // 井口房
      const pr=tprism(sg,C,1,.72,.9,.46,.34,13,'#a0704e','#7a523a','#5a4c44');
      fw(sg,pr,-1,5,0,5,8,'#2e2420');fw(sg,pr,-1,4,8,7,1,'#c8a870');fw(sg,pr,1,4,6,3,3,'#e0d4a8');
    });
    const ch=tp(C,.72,.9);P(ng,ch[0]+4,ch[1]-9,3,3,'#ffe0a0');
    layer(M,sg=>{ // 井架
      const L0=[22,85],L1=[26,28],R0=[36,87],R1=[33,28];
      for(let i=0;i<=5;i++){const t=i/5,y=rd(L0[1]+(L1[1]-L0[1])*t),xl=rd(L0[0]+(L1[0]-L0[0])*t),xr=rd(R0[0]+(R1[0]-R0[0])*t);
        P(sg,xl,y,xr-xl+1,1,'#7a3e2a');
        if(i<5){const t2=(i+1)/5,y2=rd(L0[1]+(L1[1]-L0[1])*t2),xl2=rd(L0[0]+(L1[0]-L0[0])*t2),xr2=rd(R0[0]+(R1[0]-R0[0])*t2);
          ln(sg,xl,y,xr2,y2,'#6e3424');}}
      ln(sg,L0[0],L0[1],L1[0],L1[1],'#b86448');ln(sg,L0[0]+1,L0[1],L1[0]+1,L1[1],'#9a4e36');
      ln(sg,R0[0],R0[1],R1[0],R1[1],'#8a4632');ln(sg,R0[0]+1,R0[1],R1[0]+1,R1[1],'#5e3022');
      P(sg,22,26,17,3,'#5a3024');P(sg,22,26,17,1,'#8a5040');
      P(sg,29,23,2,3,'#7a2a22');
    });
    P(ng,29,23,2,2,'#ff5030');
    const wheel=(sg,cx,cy,r,a,b)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const d=Math.sqrt((dx+.5)*(dx+.5)+(dy+.5)*(dy+.5));if(d<=r&&d>r-2)P(sg,cx+dx,cy+dy,1,1,(dx+dy)<0?a:b);}
      P(sg,cx-r+2,cy,2*r-3,1,b);P(sg,cx,cy-r+2,1,2*r-3,b);P(sg,cx-1,cy-1,2,2,'#2a2622');};
    layer(M,sg=>{wheel(sg,25,19,5,'#8a8078','#4a4440');});
    layer(M,sg=>{wheel(sg,34,22,5,'#a09890','#5a5450');});
    layer(M,sg=>{ln(sg,39,22,50,85,'#3a342e');ln(sg,30,15,48,86,'#3a342e');},[60,56,52]);
    layer(M,sg=>{ // 礦車＋軌道
      ln(sg,9,98,21,92,'#5a5a5a');
      P(sg,12,91,7,4,'#c8a850');P(sg,12,91,7,1,'#e0c878');P(sg,13,90,5,1,'#7a6a52');P(sg,13,95,2,2,'#2a2622');P(sg,17,95,2,2,'#2a2622');
    });
    save('50_1_1',M,ax,ay,{mat:'I',k:50,seed:1});
  });
  safe('50_2',()=>{ // v2：露天礦坑（階梯開挖）＋輸送帶＋礦倉
    const M=mk(72,112),ax=36,ay=110,rk=RND(50,2),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#7a6a52',rk,{specks:['#6a5a42','#8a7a5e']});
    shadow(g,50,102,18,5);
    const cx=31,cy=93;
    const hwAt=(ccy,hw,y)=>{const d=Math.abs(y+.5-ccy);return hw-2*d;};
    const levels=[[22,0,'#8a745a'],[15,6,'#76604a'],[8,12,'#5a4c40']];
    const walls=[['#4e3e2c','#a88c66'],['#463828','#9a8060'],['#3e3224','#8a7254']];
    for(let i=0;i<levels.length;i++){const hw=levels[i][0],d0=levels[i][1],oc=cy+d0;
      for(let y=Math.floor(oc-hw/2)-1;y<=Math.ceil(oc+hw/2+7);y++){
        const wO=hwAt(oc,hw,y);if(wO<=0)continue;
        let lim=wO;if(i>0){const prev=levels[i-1];lim=Math.min(wO,hwAt(cy+prev[1]+6,prev[0],y),hwAt(cy,levels[0][0],y));if(lim<=0)continue;}
        const wF=Math.min(lim,hwAt(oc+6,hw,y));
        P(g,cx-lim,y,lim,1,walls[i][0]);P(g,cx,y,lim,1,walls[i][1]);
        if(wF>0){P(g,cx-wF,y,2*wF,1,levels[i][2]);}
      }
    }
    for(let i=0;i<levels.length;i++){const hw=levels[i][0],oc=cy+levels[i][1];for(let x=-hw+1;x<hw;x+=1){const yy=rd(oc-hw/2+Math.abs(x)/2);if(i===0||hwAt(cy,levels[0][0],yy)>Math.abs(x))P(g,cx+x,yy,1,1,x<0?'#6a5842':'#c0a47c');}}
    P(g,cx-2,cy+9,5,1,'#4a5a5e');P(g,cx-1,cy+10,3,1,'#5a6a6e');
    const hp=tp(C,.9,.25);
    layer(M,sg=>{ // 礦石錐堆（後）
      const b=tp(C,.25,.08);for(let r=0;r<7;r++){P(sg,b[0]-r-1,b[1]-6+r,r+1,1,'#b09c7c');P(sg,b[0],b[1]-6+r,r+1,1,'#86725a');}
      P(sg,b[0]-1,b[1]-7,2,1,'#c8b490');
    });
    layer(M,sg=>{ // 礦倉（木構）
      const pr=prism(sg,hp[0],hp[1],3,3,16,'#a08050','#7a5e3e','#5a4a3a');
      for(let i=0;i<3;i++){fw(sg,pr,-1,1,3+i*4,5,1,'#7a5a34');fw(sg,pr,1,0,3+i*4,5,1,'#5e4630');}
      P(sg,pr.sx-3,pr.sy-2,6,2,'#3a2e24');
      P(sg,pr.sx,pr.sy-26,1,5,'#5a5a62');P(sg,pr.sx-2,pr.sy-28,5,2,'#d8d0b0');
    });
    P(ng,hp[0]-2,hp[1]-28,5,2,'#fff0c0');
    layer(M,sg=>{ // 輸送帶（桁架）
      const a=[cx+3,cy+8],b=[hp[0]-2,hp[1]-19];
      ln(sg,a[0],a[1]-2,b[0],b[1]-2,'#b4b4bc');ln(sg,a[0],a[1]-1,b[0],b[1]-1,'#6a6a72');ln(sg,a[0],a[1],b[0],b[1],'#4a4a52');
      for(const t of[.45,.78]){const x=rd(a[0]+(b[0]-a[0])*t),y=rd(a[1]+(b[1]-a[1])*t);P(sg,x,y+1,1,Math.max(1,rd(cy+4-y)),'#4a4a52');}
    });
    layer(M,sg=>{ // 礦車（坑內台階）
      P(sg,15,91,7,3,'#d8a830');P(sg,15,91,7,1,'#f0c850');P(sg,20,89,3,2,'#8a9aa8');P(sg,16,94,2,1,'#2a2622');P(sg,20,94,2,1,'#2a2622');
    });
    save('50_1_2',M,ax,ay,{mat:'I',k:50,seed:2});
  });

  /* ================= k60 地熱發電 ================= */
  safe('60_1',()=>{ // v1：機械通風冷卻塔（雙風筒）＋綠色汽機房
    const M=mk(72,112),ax=36,ay=110,rk=RND(60,1),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#9a9080',rk);
    shadow(g,46,101,24,7);
    let tw;
    layer(M,sg=>{
      tw=tprism(sg,C,1,.74,.82,.62,.5,19,'#b4bab2','#848c84','#9aa29a');
      for(let i=0;i<4;i++){fw(sg,tw,-1,2,2+i*3,2*tw.L-4,1,'#6e766e');fw(sg,tw,1,2,2+i*3,2*tw.R-4,1,'#5a625a');}
      fw(sg,tw,-1,2,16,2*tw.L-4,1,'#c8cec6');
    });
    const fans=[];
    layer(M,sg=>{
      const c1=[(tw.W[0]+tw.N[0])/2+6,(tw.W[1]+tw.N[1])/2+6],c2=[(tw.S[0]+tw.E[0])/2-6,(tw.S[1]+tw.E[1])/2-6];
      for(const p of[c1,c2]){cyl(sg,p[0],p[1],5,5,{l:'#c8ccc6',m:'#a4aaa2',d:'#7e867c',t:'#3a3e3a'});fans.push(p);}
    });
    layer(M,sg=>{ // 汽機房
      const pr=tprism(sg,C,1,1,.5,.36,.3,12,'#7aa890','#5a8a70','#8fbca4');
      fw(sg,pr,-1,3,4,4,4,'#9cc8e0');fw(sg,pr,-1,9,4,1,4,'#9cc8e0');fw(sg,pr,1,3,0,3,7,'#3e5a4a');
      P(sg,pr.S[0]-8,pr.S[1]-10,5,3,'#6a726a');
    });
    const tb=tp(C,1,.5);for(let i=0;i<4;i++)P(ng,tb[0]-3-i,tb[1]-8-((3+i)>>1),1,4,'#ffe9a8');
    layer(M,sg=>{ // 井口管＋閥
      P(sg,12,90,3,10,'#b8bec6');P(sg,14,90,1,10,'#8f959d');P(sg,10,89,7,2,'#d0d6dc');P(sg,11,94,2,2,'#d84838');
      P(sg,15,92,8,2,'#a8aeb6');
    });
    for(const p of fans){puff(g,p[0]+1,p[1]-10,4,2,.75);puff(g,p[0]+3,p[1]-15,5,3,.55);puff(g,p[0]+6,p[1]-21,4,2,.35);}
    save('60_1_1',M,ax,ay,{mat:'S',k:60,seed:1});
  });
  safe('60_2',()=>{ // v2：雙消音塔（開口圓筒冒汽）＋汽水分離器＋膨脹彎管＋小控制屋
    const M=mk(72,112),ax=36,ay=110,rk=RND(60,2),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#9a9080',rk);
    shadow(g,46,101,24,7);
    const sil={l:'#c4c8c0',m:'#a6aaa2',d:'#80847c',t:'#b8bcb4',hl:'#dde0da'};
    const s1=tp(C,.2,.72),s2=tp(C,.5,.52),sep=tp(C,.72,.22);
    layer(M,sg=>{ // 分離器（後）
      cyl(sg,sep[0],sep[1]-2,4,30,{l:'#d0d6dc',m:'#b8bec6',d:'#8f959d',t:'#c8ced4'});
      dome(sg,sep[0],sep[1]-32,4,3,{hl:'#f0f4f6',l:'#d0d6dc',m:'#b8bec6',d:'#8f959d'});
      P(sg,sep[0]-3,sep[1]-18,6,1,'#8f959d');
    });
    layer(M,sg=>{ // 消音塔 A（後）
      cyl(sg,s1[0],s1[1]-2,7,20,sil,{open:'#4a4e4a'});
      for(let i=0;i<3;i++)P(sg,s1[0]-7,s1[1]-7-i*6,14,1,'#8a8e86');
    });
    layer(M,sg=>{ // 消音塔 B（中）
      cyl(sg,s2[0],s2[1]-2,7,16,sil,{open:'#4a4e4a'});
      for(let i=0;i<2;i++)P(sg,s2[0]-7,s2[1]-7-i*6,14,1,'#8a8e86');
    });
    layer(M,sg=>{ // 連接管（分離器→B）
      P(sg,s2[0]+6,s2[1]-12,sep[0]-s2[0]-9,2,'#b8bec6');P(sg,s2[0]+6,s2[1]-12,sep[0]-s2[0]-9,1,'#d0d6dc');
      P(sg,s1[0]+6,s1[1]-10,s2[0]-s1[0]-12,2,'#b8bec6');P(sg,s1[0]+6,s1[1]-10,s2[0]-s1[0]-12,1,'#d0d6dc');
    });
    layer(M,sg=>{ // 控制屋（v0 綠）
      const pr=tprism(sg,C,1,.98,.98,.26,.24,9,'#7aa890','#5a8a70','#8fbca4');
      fw(sg,pr,-1,2,3,3,3,'#9cc8e0');
    });
    const hu=tp(C,.98,.98);for(let i=0;i<3;i++)P(ng,hu[0]-2-i,hu[1]-6-((2+i)>>1),1,3,'#ffe9a8');
    puff(g,s1[0],s1[1]-27,5,3,.75);puff(g,s1[0]+3,s1[1]-33,6,3,.55);puff(g,s1[0]+7,s1[1]-40,5,3,.35);
    puff(g,s2[0]+1,s2[1]-22,4,2,.65);puff(g,s2[0]+4,s2[1]-27,5,3,.4);
    save('60_1_2',M,ax,ay,{mat:'S',k:60,seed:2});
  });

  /* ================= k117 天然氣井 ================= */
  safe('117_1',()=>{ // v1：壓縮站（浪板機房＋臥式儲罐＋高火炬）
    const M=mk(72,112),ax=36,ay=110,rk=RND(117,1),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#9a9484',rk,{dk:'#8a8478',lt:'#aca696'});
    shadow(g,46,101,24,7);
    const fl=tp(C,.16,.2);
    layer(M,sg=>{ // 火炬塔
      P(sg,fl[0]-1,fl[1]-54,2,54,'#a8acb4');P(sg,fl[0]-1,fl[1]-54,1,54,'#c8ccd4');
      for(let i=0;i<4;i++)P(sg,fl[0]-1,fl[1]-12-i*12,2,1,'#e05252');
      P(sg,fl[0]-3,fl[1]-56,6,2,'#6a6e76');
      ln(sg,fl[0],fl[1]-40,fl[0]-9,fl[1]+2,'#6a6e76');ln(sg,fl[0],fl[1]-40,fl[0]+9,fl[1]+2,'#6a6e76');
    });
    layer(M,sg=>{ // 火焰
      P(sg,fl[0]-1,fl[1]-63,3,7,'#ff9a3a');P(sg,fl[0],fl[1]-66,2,4,'#ffc860');P(sg,fl[0],fl[1]-60,1,3,'#fff0a0');
    },[120,60,30]);
    P(ng,fl[0]-1,fl[1]-63,3,7,'#ffb050');P(ng,fl[0],fl[1]-66,2,4,'#ffe080');
    const tank=(sg,u,v0,v1)=>{const a=tp(C,u,v0),b=tp(C,u,v1),r=4;const n=Math.max(Math.abs(b[0]-a[0]),1);
      for(let i=0;i<=n;i++){const t=i/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t-r-3;
        for(let dy=-r;dy<=r;dy++){P(sg,x,y+dy,1,1,dy<-2?'#f2f4f6':dy<1?'#d8dce2':dy<3?'#b4b8c0':'#8e929a');}}
      for(let dy=-r;dy<=r;dy++){const hx=rd(Math.sqrt(r*r-dy*dy)*.5);P(sg,b[0]-hx,b[1]-r-3+dy,hx+1,1,dy<0?'#e8ecf0':'#c4c8ce');}
      for(const t of[.2,.8]){const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;P(sg,x-1,y-3,3,3,'#6a6e76');}};
    layer(M,sg=>{tank(sg,.66,.12,.46);});
    layer(M,sg=>{tank(sg,.86,.14,.48);});
    layer(M,sg=>{ // 壓縮機房
      const pr=tprism(sg,C,1,.64,.98,.44,.36,13,'#c8ccd4','#a0a4ac','#7a8290');
      for(let x=2;x<2*pr.L;x+=3)fw(sg,pr,-1,x,1,1,11,'#b4b8c0');
      for(let x=1;x<2*pr.R;x+=3)fw(sg,pr,1,x,1,1,11,'#8e929a');
      fw(sg,pr,-1,4,0,7,8,'#6a707a');fw(sg,pr,-1,4,7,7,1,'#4a505a');
      fw(sg,pr,1,4,8,5,2,'#9cc8e0');
      cyl(sg,(pr.W[0]+pr.N[0])/2+5,(pr.W[1]+pr.N[1])/2+5,2,4,{l:'#c8ccd4',m:'#a8acb4',d:'#7a7e86',t:'#5a5e66'});
    });
    const sh1=tp(C,.64,.98);for(let i=0;i<5;i++)P(ng,sh1[0]+4+i,sh1[1]-10-((5+i)>>1),1,2,'#cfe6ff');
    layer(M,sg=>{ // 管線＋閥
      const a=tp(C,.66,.5),b=tp(C,.66,.62);P(sg,a[0]-6,a[1]-5,8,2,'#a8a8b0');P(sg,a[0]-2,a[1]-7,3,3,'#d84838');
    });
    save('117_1_1',M,ax,ay,{mat:'I',k:117,seed:1});
  });
  safe('117_2',()=>{ // v2：導軌式儲氣櫃（圓筒＋格構導柱框）＋井口閥樹
    const M=mk(72,112),ax=36,ay=110,rk=RND(117,2),C=TC(ax,ay,1),g=M.g,ng=M.ng;
    plate(g,ax,ay,1,'#9a9484',rk,{dk:'#8a8478',lt:'#aca696'});
    shadow(g,48,101,26,7);
    const c0=tp(C,.36,.36),r=14,H=22,CH=34,cx=c0[0],cy=c0[1];
    const cols=[-.95,-.55,0,.55,.95];
    const colPos=a=>[rd(cx+Math.sin(a*Math.PI/2)*(r+2)),rd(cy+Math.cos(a*Math.PI/2)*(r+2)*.5)];
    layer(M,sg=>{ // 後導柱
      for(const a of[-.55,.55]){const p=[rd(cx+Math.sin(a*Math.PI/2)*(r+2)),rd(cy-Math.cos(a*Math.PI/2)*(r+2)*.5)];P(sg,p[0]-1,p[1]-CH,2,CH,'#6e3a2c');}
      P(sg,cx-1,cy-(r>>1)-2-CH,2,CH,'#6e3a2c');
    },[40,30,28]);
    layer(M,sg=>{ // 氣櫃
      cyl(sg,cx,cy,r,H,{l:'#c4ceb8',m:'#a8b49c',d:'#7e8a74',t:'#b4c0a8',hl:'#d8e0cc'});
      for(const hh of[8,16]){for(let dx=-r;dx<r;dx++){const t=(dx+.5)/r,e=rd(r/2*Math.sqrt(Math.max(0,1-t*t)));P(sg,cx+dx,cy-hh+e,1,1,t<-.1?'#8e9a84':'#62705a');}}
      dome(sg,cx,cy-H,r,3,{hl:'#dce4d0',l:'#c0cab4',m:'#a8b49c',d:'#8a967e'});
    });
    layer(M,sg=>{ // 前導柱＋頂環
      for(const a of cols){const p=colPos(a);
        P(sg,p[0]-1,p[1]-CH,2,CH,a<0?'#a85e48':'#7a3e2e');for(let y=p[1]-CH+2;y<p[1];y+=6)P(sg,p[0]-1,y,2,1,'#5e2e22');}
      for(let dx=-(r+2);dx<(r+2);dx++){const t=(dx+.5)/(r+2),e=rd((r+2)/2*Math.sqrt(Math.max(0,1-t*t)));P(sg,cx+dx,cy-CH+e,1,1,'#8a4a38');P(sg,cx+dx,cy-CH-e,1,1,'#6e3a2c');}
      const p=colPos(-.95);P(sg,p[0]-1,p[1]-CH-3,2,3,'#7a2a22');
    },[40,30,28]);
    const lp=colPos(-.95);P(ng,lp[0]-1,lp[1]-CH-3,2,2,'#ff5030');
    const W=tp(C,.62,.96),SP=tp(C,.96,.62);
    layer(M,sg=>{ // 地面集氣管（閥樹→分離器）
      ln(sg,W[0]+3,W[1]-3,SP[0]-3,SP[1]-3,'#a8a8b0');ln(sg,W[0]+3,W[1]-2,SP[0]-3,SP[1]-2,'#7a7a82');
    });
    layer(M,sg=>{ // 立式分離器
      P(sg,SP[0]-3,SP[1]-2,1,3,'#5a5e66');P(sg,SP[0]+2,SP[1]-2,1,3,'#5a5e66');
      cyl(sg,SP[0],SP[1]-3,3,13,{l:'#e0e2e6',m:'#c0c4ca',d:'#8e929a',t:'#b0b4ba'});
      dome(sg,SP[0],SP[1]-16,3,2,{hl:'#f4f6f8',l:'#e0e2e6',m:'#c0c4ca',d:'#8e929a'});P(sg,SP[0]-3,SP[1]-9,6,1,'#8e929a');
    });
    layer(M,sg=>{ // 井口聖誕樹（放大、雙手輪）
      const x=W[0],y=W[1];P(sg,x-3,y-2,7,2,'#6a6e76');
      P(sg,x-1,y-16,3,14,'#7a7e86');P(sg,x-1,y-16,1,14,'#a8acb4');
      P(sg,x-4,y-12,9,2,'#8a8e96');P(sg,x-4,y-12,9,1,'#b0b4bc');
      P(sg,x-3,y-7,7,2,'#d84838');P(sg,x-3,y-7,7,1,'#f06a58');P(sg,x-3,y-15,7,2,'#d84838');P(sg,x-3,y-15,7,1,'#f06a58');
      P(sg,x-1,y-19,3,3,'#d0d2d6');
    });
    save('117_1_2',M,ax,ay,{mat:'I',k:117,seed:2});
  });

  const ZZ=C=>(u,v,z)=>{const p=A.paraPt559(C,u,v);return[p[0],p[1]-(z||0)];};

  /* ================= k25 太陽能 ================= */
  const solarPlate=(M,ax,ay)=>layer(M,sg=>{A.dia(sg,ax,ay-64,64,'#7a8a68');A.diaEdge(sg,6,sh('#7a8a68',-20),ax,ay-64,64);A.diaEdge(sg,9,sh('#7a8a68',12),ax,ay-64,64);});
  safe('25_1',()=>{ // v1：塔式聚光電站（定日鏡陣環繞高集熱塔）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng;
    solarPlate(M,ax,ay);
    const T=tp(C,.46,.46);
    const list=[];const us=[.1,.27,.44,.61,.78,.94];
    for(let i=0;i<6;i++)for(let j=0;j<6;j++){if((i+j)%2)continue;const u=us[i],v=us[j];if(Math.abs(u-.46)<.14&&Math.abs(v-.46)<.14)continue;if(u>.85&&v>.85)continue;list.push([u,v]);}
    list.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
    const mirror=(sg,u,v)=>{const p=tp(C,u,v),x=p[0],y=p[1];P(sg,x,y-4,1,4,'#5a5a62');P(sg,x-1,y,3,1,'#5e6c52');
      const left=x<T[0]-4,right=x>T[0]+4;
      const pts=left?[[x-6,y-6],[x+6,y-12],[x+6,y-7],[x-6,y-1]]:right?[[x-6,y-12],[x+6,y-6],[x+6,y-1],[x-6,y-7]]:[[x-6,y-9],[x+6,y-9],[x+6,y-4],[x-6,y-4]];
      poly(sg,pts,'#3e6a90');ln(sg,pts[0][0],pts[0][1],pts[1][0]-1,pts[1][1],'#a8c8dc');
      ln(sg,pts[3][0],pts[3][1]-1,pts[2][0]-1,pts[2][1]-1,'#2c5274');};
    const tsum=.92;
    layer(M,sg=>{for(const q of list)if(q[0]+q[1]<tsum)mirror(sg,q[0],q[1]);});
    layer(M,sg=>{ // 集熱塔
      prism(sg,T[0],T[1]+3,6,6,4,'#b8b8b0','#909088','#c8c8c0');
      cyl(sg,T[0],T[1]-3,4,58,{l:'#e2e2da',m:'#c4c4bc',d:'#9a9a92',hl:'#f2f2ec'});
      const ty=T[1]-61;
      cyl(sg,T[0],ty,6,11,{l:'#fff6d0',m:'#ffe08a',d:'#d8a850',e0:'#fffbe8',t:'#8a8a82'});
      for(let i=0;i<3;i++)P(sg,T[0]-6,ty-2-i*3,12,1,'#c89040');
      cyl(sg,T[0],ty-11,3,5,{l:'#c8c8c0',m:'#a8a8a0',d:'#808078',t:'#6a6a64'});
      P(sg,T[0],ty-19,1,3,'#6a6a64');P(sg,T[0]-1,ty-20,2,1,'#7a2a22');
      P(sg,T[0]-6,T[1]-30,12,1,'#a8a8a0');
    });
    P(ng,T[0]-1,T[1]-81,2,1,'#ff5030');
    layer(M,sg=>{for(const q of list)if(q[0]+q[1]>=tsum)mirror(sg,q[0],q[1]);});
    let cb;
    layer(M,sg=>{cb=tprism(sg,C,2,.99,.97,.2,.15,9,'#c8c8be','#9a9a92','#6a6a64');fw(sg,cb,-1,3,3,4,3,'#6a8aa8');fw(sg,cb,1,2,0,3,6,'#5a5a56');});
    fw(ng,cb,-1,3,3,4,3,'#ffe9a0');
    save('25_1_1',M,ax,ay,{});
  });
  safe('25_2',()=>{ // v2：農光互補（高架長列光電板跨作物畦＋儲能貨櫃＋箱變）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,Z=ZZ(C);
    solarPlate(M,ax,ay);
    for(let i=0;i<10;i++){if(i%2)continue;const a=i/10+.012,b=(i+1)/10-.012;poly(g,[Z(.02,a),Z(.74,a),Z(.74,b),Z(.02,b)],'#6f8a52');}
    const row=vc=>{const u0=.05,u1=.72,hv=.075,z0=15,z1=11;
      poly(M.g,[Z(u0+.05,vc-hv+.06),Z(u1+.05,vc-hv+.06),Z(u1+.05,vc+hv+.06),Z(u0+.05,vc+hv+.06)],'rgba(28,36,26,.20)');
      layer(M,sg=>{
        for(const u of[.1,.3,.5,.7]){const a=Z(u,vc,0);P(sg,rd(a[0]),rd(a[1])-13,1,13,'#6a6e76');P(sg,rd(a[0])-1,rd(a[1]),3,1,'#5a5e52');}
        const p=[Z(u0,vc-hv,z0),Z(u1,vc-hv,z0),Z(u1,vc+hv,z1),Z(u0,vc+hv,z1)];
        poly(sg,p,'#34557f');
        for(let u=u0+.09;u<u1-.02;u+=.09){const a=Z(u,vc-hv,z0),b=Z(u,vc+hv,z1);ln(sg,a[0],a[1],b[0],b[1],'#48699a');}
        ln(sg,p[0][0],p[0][1],p[1][0],p[1][1],'#a8c8dc');ln(sg,p[3][0],p[3][1]-1,p[2][0],p[2][1]-1,'#26405e');
      },[22,26,34]);};
    for(const vc of[.2,.5,.8])row(vc);
    const leds=[];
    for(const vs of[.52,.84])layer(M,sg=>{const pr=tprism(sg,C,2,.97,vs,.13,.28,9,'#dcdcd6','#a8a8a2','#c4c4be');
      for(let i=0;i<4;i++)fw(sg,pr,1,3+i*4,2,2,5,'#9a9a94');fw(sg,pr,-1,3,5,2,2,'#3a6a3a');leds.push(pr);});
    for(const pr of leds)fw(ng,pr,-1,3,5,2,2,'#7aff8a');
    layer(M,sg=>{const pr=tprism(sg,C,2,.99,.99,.1,.1,7,'#6a6e76','#4a4e56','#7a7e86');for(let i=0;i<3;i++)P(sg,pr.S[0]-3+i*3,pr.S[1]-9,1,4,'#e8e8e0');});
    save('25_1_2',M,ax,ay,{});
  });

  /* ================= k59 水力發電廠 ================= */
  safe('59_1',()=>{ // v1：重力壩（斜視）＋進水塔＋壓力鋼管＋壩下廠房
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(59,1),Z=ZZ(C);
    plate(g,ax,ay,2,'#8f9a88',rk,{specks:['#84907e','#9aa694']});
    shadow(g,100,140,38,8);
    poly(g,[Z(.02,.5),Z(.44,.5),Z(.44,1),Z(.02,1)],'#3a78b8');
    for(let i=0;i<5;i++){const a=Z(.08+i*.07,.62+i*.08),b=Z(.14+i*.07,.62+i*.08);ln(g,a[0],a[1],b[0],b[1],'#5a98d0');}
    layer(M,sg=>{ // 水庫
      poly(sg,[Z(0,0,24),Z(.9,0,24),Z(.9,.42,24),Z(0,.42,24)],'#3671b6');
      for(let i=0;i<5;i++){const a=Z(.08+i*.16,.1+(i%2)*.14,24),b=Z(.16+i*.16,.1+(i%2)*.14,24);ln(sg,a[0],a[1],b[0],b[1],'#5a8fd0');}
    },[40,70,110]);
    const towers=[[.3,.2],[.62,.2]];
    for(const t of towers)layer(M,sg=>{const p=Z(t[0],t[1],24);
      P(sg,p[0]-6,p[1]+1,12,1,'#8ab8e8');
      cyl(sg,p[0],p[1],5,16,{l:'#d6d9df',m:'#b8bcc4',d:'#8e949e',t:'#a8acb4'});
      cyl(sg,p[0],p[1]-16,6,3,{l:'#b07a5a',m:'#8a5a44',d:'#6a4434',t:'#c48a6a'});
      const q=Z(t[0],.4,28);for(let i=0;i<=8;i++){const x=rd(p[0]+(q[0]-p[0])*i/8),y=rd(p[1]-14+(q[1]-(p[1]-14))*i/8);P(sg,x,y,2,1,'#9ea4ae');P(sg,x,y-1,1,1,'#6a6e76');}
    });
    let dam;
    layer(M,sg=>{ // 壩體
      dam=tprism(sg,C,2,.88,.5,.88,.12,28,'#c8cbd2','#9ea4ae','#d6d9de');
      for(let dx=6;dx<2*dam.L;dx+=8)fw(sg,dam,-1,dx,0,1,27,'#aeb2ba');
      for(const dx of[10,17]){fw(sg,dam,-1,dx,0,3,27,'#5a6068');fw(sg,dam,-1,dx,0,1,27,'#8a9098');}
      for(let dx=38;dx<50;dx++){fw(sg,dam,-1,dx,0,1,27,(dx%3===0)?'#b8d8ec':'#e8f2f8');}
      for(let dx=2;dx<2*dam.L;dx+=4)fw(sg,dam,-1,dx,28,1,1,'#6a6e76');
    });
    for(let i=0;i<9;i++){const q=Z(.12+i*.02,.53+((i*7)%3)*.02);puff(g,q[0],q[1]-1,2,1,.8);}
    let ph;
    layer(M,sg=>{ // 廠房
      ph=tprism(sg,C,2,.8,.76,.36,.22,13,'#b06a4a','#8a4e34','#c47e5c');
      for(let i=0;i<3;i++)fw(sg,ph,-1,4+i*7,4,4,5,'#9cc8e0');
      fw(sg,ph,1,3,0,4,7,'#5a3a24');
      P(sg,ph.S[0]+6,ph.S[1]-19,4,4,'#6a6e76');P(sg,ph.S[0]+7,ph.S[1]-21,1,2,'#e8e8e0');
    });
    for(let i=0;i<3;i++)fw(ng,ph,-1,4+i*7,4,4,5,'#ffe9a8');
    layer(M,sg=>{ // 右岸山體
      const ab=tprism(sg,C,2,1,.62,.12,.62,30,'#9a8e7a','#6e6658','#7a9a5a');
      for(const z of[8,17,24]){fw(sg,ab,-1,1,z,2*ab.L-2,1,'#7e7464');fw(sg,ab,1,1,z-3,2*ab.R-2,1,'#5a5448');}
      P(sg,ab.E[0]-18,ab.E[1]-3,3,2,'#5a7a4a');P(sg,ab.E[0]-30,ab.E[1]+2,3,2,'#5a7a4a');
    });
    const lp=Z(.5,.44,28);P(M.g,lp[0],lp[1]-6,1,6,'#4a4e56');P(M.g,lp[0]-1,lp[1]-7,3,1,'#d8d8c8');P(ng,lp[0]-1,lp[1]-7,3,1,'#fff0c0');
    const lp2=Z(.18,.44,28);P(M.g,lp2[0],lp2[1]-6,1,6,'#4a4e56');P(M.g,lp2[0]-1,lp2[1]-7,3,1,'#d8d8c8');P(ng,lp2[0]-1,lp2[1]-7,3,1,'#fff0c0');
    save('59_1_1',M,ax,ay,{mat:'S',k:59,seed:1});
  });
  safe('59_2',()=>{ // v2：攔河閘壩（多孔閘門＋龍門吊）＋河床式廠房
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(59,2),Z=ZZ(C);
    plate(g,ax,ay,2,'#8f9a88',rk,{specks:['#84907e','#9aa694']});
    shadow(g,100,140,38,8);
    poly(g,[Z(.56,0),Z(1,0),Z(1,.62),Z(.56,.62)],'#4a88c4');
    for(let i=0;i<5;i++){const a=Z(.7+i*.05,.08+i*.1),b=Z(.8+i*.05,.08+i*.1);ln(g,a[0],a[1],b[0],b[1],'#6aa8d8');}
    for(let i=0;i<4;i++){const q=Z(.6,.1+i*.2);puff(g,q[0]+3,q[1]-1,3,1,.85);puff(g,q[0]+7,q[1]+1,2,1,.6);}
    layer(M,sg=>{poly(sg,[Z(0,0,8),Z(.42,0,8),Z(.42,.84,8),Z(0,.84,8)],'#3671b6');
      for(let i=0;i<4;i++){const a=Z(.06+i*.08,.12+i*.18,8),b=Z(.14+i*.08,.12+i*.18,8);ln(sg,a[0],a[1],b[0],b[1],'#5a8fd0');}},[40,70,110]);
    layer(M,sg=>{tprism(sg,C,2,.6,.84,.2,.84,10,'#c2c5cd','#9ea4ae','#b0b4bc');});
    const piers=[0,.2,.4,.6,.78];
    for(let i=0;i<piers.length;i++){
      const vp=piers[i];
      layer(M,sg=>{const pr=tprism(sg,C,2,.6,vp+.06,.22,.06,34,'#d0d3da','#a4aab4','#b8bcc4');fw(sg,pr,-1,2,30,2*pr.L-3,1,'#b0b4bc');});
      if(i<piers.length-1){const v0=vp+.06,v1=piers[i+1];
        layer(M,sg=>{poly(sg,[Z(.5,v0,19),Z(.5,v1,19),Z(.5,v1,31),Z(.5,v0,31)],'#5a6a7a');
          for(let z=22;z<31;z+=3){const a=Z(.5,v0,z),b=Z(.5,v1,z);ln(sg,a[0],a[1],b[0],b[1],'#46525e');}
          poly(sg,[Z(.52,v0,10),Z(.52,v1,10),Z(.52,v1,18),Z(.52,v0,18)],'#9cc8e8');
          for(let k=0;k<3;k++){const a=Z(.52,v0+(v1-v0)*(.2+k*.3),11),b=Z(.52,v0+(v1-v0)*(.2+k*.3),17);ln(sg,a[0],a[1],b[0],b[1],'#f0f8fc');}
        },[40,48,60]);}
    }
    layer(M,sg=>{const Sd=tp(C,.6,.84),dk=prism(sg,Sd[0],Sd[1]-34,rd(32*.22),rd(32*.84),3,'#b8bcc4','#8e949e','#c8ccd2');
      for(let dx=1;dx<2*dk.R;dx+=3)P(sg,dk.sx+dx,dk.sy-3-((dx+1)>>1)-2,1,2,'#6a6e76');});
    layer(M,sg=>{ // 龍門吊
      for(const v of[.1,.66])for(const u of[.42,.58]){const a=Z(u,v,37);P(sg,a[0]-1,a[1]-16,2,16,u<.5?'#b84a36':'#8a3628');}
      const S2=tp(C,.6,.74),bm=prism(sg,S2[0],S2[1]-53,rd(32*.2),rd(32*.66),4,'#d8584a','#a03a2c','#e87a64');
      const cab=tp(C,.56,.4);prism(sg,cab[0],cab[1]-57,3,3,5,'#e8b840','#b88a28','#f0d060');
    });
    layer(M,sg=>{tprism(sg,C,2,.56,1,.56,.16,10,'#9a8e76','#7a705c','#8a9a6a');});
    let ph;
    layer(M,sg=>{ph=tprism(sg,C,2,1,1,.38,.38,18,'#b06a4a','#8a4e34','#6a6e76');
      for(let i=0;i<3;i++){fw(sg,ph,-1,4+i*7,4,3,9,'#9cc8e0');fw(sg,ph,-1,5+i*7,13,1,1,'#9cc8e0');fw(sg,ph,1,3+i*7,4,3,9,'#7aa6c0');}
      const r0=ph.W,r1=ph.E;ln(sg,(ph.W[0]+ph.S[0])/2,(ph.W[1]+ph.S[1])/2-3,(ph.N[0]+ph.E[0])/2,(ph.N[1]+ph.E[1])/2-3,'#9cc8e0');
    });
    for(let i=0;i<3;i++){fw(ng,ph,-1,4+i*7,4,3,9,'#ffe9a8');fw(ng,ph,1,3+i*7,4,3,9,'#ffe0a0');}
    save('59_1_2',M,ax,ay,{mat:'S',k:59,seed:2});
  });

  /* ================= k118 化肥廠 ================= */
  safe('118_1',()=>{ // v1：造粒塔（高聳）＋廠房＋斜向輸送廊道＋散裝倉
    const M=mk(136,166),ax=68,ay=164,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(118,1);
    plate(g,ax,ay,2,'#a09878',rk,{dk:'#8c8466',lt:'#b4ac8a',specks:['#948c6e','#aca482']});
    shadow(g,100,156,38,8);
    let tw;
    layer(M,sg=>{ // 造粒塔
      tw=tprism(sg,C,2,.42,.36,.24,.24,92,'#d4d8cc','#aeb2a6','#8a8e84');
      fw(sg,tw,-1,1,0,1,92,'#e6eadf');fw(sg,tw,1,2*tw.R-1,0,1,92,'#9a9e92');
      for(let z=12;z<76;z+=13)fw(sg,tw,-1,7,z,3,5,'#7fb0d8');
      for(let z=18;z<76;z+=26)fw(sg,tw,1,6,z,2,6,'#6f9fb8');
      fw(sg,tw,-1,1,78,2*tw.L,3,'#e05252');fw(sg,tw,-1,1,77,2*tw.L,1,'#ffb35a');fw(sg,tw,1,0,78,2*tw.R,3,'#b84040');
      const hh=prism(sg,tw.S[0],tw.S[1]-3,5,5,9,'#c8ccc0','#a8aca0','#7a7e74');
      fw(sg,hh,-1,3,3,4,3,'#7fb0d8');
      P(sg,hh.N[0]+1,hh.N[1]-6,2,8,'#8a8e84');P(sg,hh.N[0]+1,hh.N[1]-6,1,8,'#aeb2a6');
      P(sg,hh.S[0]-1,hh.S[1]-4,2,2,'#7a2a22');
    });
    P(ng,tw.S[0]-1,tw.S[1]-3-9-4,2,2,'#ff5030');
    let wh;
    layer(M,sg=>{ // 散裝倉（雙坡）
      wh=tprism(sg,C,2,.5,1,.42,.45,15,'#b8b0a0','#948c7c',null);
      gableL(sg,wh,8,'#9a9e94','#7a7e74','#948c7c');
      fw(sg,wh,1,9,0,8,9,'#5a5a56');fw(sg,wh,1,9,9,8,1,'#ffb35a');
      for(let i=0;i<3;i++)fw(sg,wh,-1,5+i*9,8,4,2,'#7a7e74');
    });
    layer(M,sg=>{ // 輸送廊道
      const a=[64,73],b=[27,104];
      for(let x=b[0];x<=a[0];x++){const t=(x-b[0])/(a[0]-b[0]),yc=rd(b[1]+(a[1]-b[1])*t);
        P(sg,x,yc-3,1,1,'#dcdfd4');P(sg,x,yc-2,1,4,'#b4b8ac');P(sg,x,yc+2,1,1,'#7a7e74');if(x%5===0)P(sg,x,yc-1,1,2,'#6a7a86');}
      P(sg,49,86,2,28,'#8a8e84');P(sg,49,86,1,28,'#a8aca0');for(let y=90;y<112;y+=6)P(sg,48,y,4,1,'#7a7e74');
    });
    let hall;
    layer(M,sg=>{ // 生產廠房
      hall=tprism(sg,C,2,.96,.62,.4,.34,24,'#c8ccc0','#a8aca0','#8a8e84');
      for(let i=0;i<3;i++)fw(sg,hall,-1,4+i*8,9,5,6,'#7fb0d8');
      fw(sg,hall,-1,1,19,2*hall.L-1,2,'#e05252');fw(sg,hall,-1,1,18,2*hall.L-1,1,'#ffb35a');fw(sg,hall,1,0,19,2*hall.R,2,'#b84040');
      fw(sg,hall,1,4,0,7,10,'#6a6e66');fw(sg,hall,1,14,9,4,5,'#6f9fb8');
      const q=[(hall.W[0]+hall.N[0])/2+8,(hall.W[1]+hall.N[1])/2+6];prism(sg,q[0],q[1],3,3,4,'#b9c0c6','#8d959c','#dfe4e8');
    });
    for(let i=0;i<3;i++)fw(ng,hall,-1,4+i*8,9,5,6,'#ffe9b0');fw(ng,hall,1,14,9,4,5,'#ffe9b0');
    layer(M,sg=>{ // 化肥袋
      for(const b of[[42,147],[49,150],[56,152],[47,145]]){P(sg,b[0],b[1],6,4,'#eef0e6');P(sg,b[0],b[1]+3,6,1,'#cfd4c4');P(sg,b[0]+2,b[1]+1,2,2,'#7fae5a');}
    },[60,62,52]);
    save('118_1_1',M,ax,ay,{mat:'I',k:118,seed:1,smoke:[{x:tw.N[0]+2,y:tw.N[1]-18}]});
  });
  safe('118_2',()=>{ // v2：液氨球罐×2＋拱頂散裝倉
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(118,2),Z=ZZ(C);
    plate(g,ax,ay,2,'#a09878',rk,{dk:'#8c8466',lt:'#b4ac8a',specks:['#948c6e','#aca482']});
    shadow(g,100,140,38,8);
    const sph=(sg,u,v)=>{const p=tp(C,u,v),r=13,cx=p[0],cy=p[1]-21;
      for(const lg of[[-11,-2],[-5,1],[4,1],[10,-2]]){P(sg,cx+lg[0],cy+3,2,p[1]-cy-3+lg[1],'#8a8e96');P(sg,cx+lg[0],cy+3,1,p[1]-cy-3+lg[1],'#aeb2ba');}
      P(sg,cx-11,cy+12,22,1,'#8a8e96');
      ball(sg,cx,cy,r,{hl:'#ffffff',l:'#eceee8',m:'#d0d4cc',d:'#a4a8a0'});
      for(let dx=-12;dx<12;dx++)P(sg,cx+dx,cy+1+rd(Math.sqrt(Math.max(0,144-dx*dx))*.12),1,1,'#b8bcb4');
      P(sg,cx-3,cy-r-1,6,2,'#8a8e96');P(sg,cx-1,cy-r-3,2,2,'#7a2a22');
      return[cx,cy-r-3];};
    const lamps=[];
    layer(M,sg=>{lamps.push(sph(sg,.2,.26));});
    layer(M,sg=>{lamps.push(sph(sg,.56,.1));});
    for(const l of lamps)P(ng,l[0]-1,l[1],2,2,'#ff5030');
    layer(M,sg=>{ // 管架
      const a=Z(.36,.3,8),b=Z(.52,.6,8);ln(sg,a[0],a[1],b[0],b[1],'#8a8e96');ln(sg,a[0],a[1]+1,b[0],b[1]+1,'#6a6e76');
      const c=Z(.64,.22,8),d=Z(.64,.52,8);ln(sg,c[0],c[1],d[0],d[1],'#8a8e96');ln(sg,c[0],c[1]+1,d[0],d[1]+1,'#6a6e76');
      for(const q of[a,b,c,d]){P(sg,q[0],q[1]+1,1,8,'#6a6e76');}
    });
    let door;
    layer(M,sg=>{ // 拱頂倉
      const u0=.18,u1=.96,vc=.76,rv=.2,H=26,N=40;
      const prof=i=>{const s=-1+2*i/N;return[s,vc+s*rv,H*Math.sqrt(Math.max(0,1-s*s))];};
      for(let i=0;i<N;i++){const p0=prof(i),p1=prof(i+1),col=p0[0]<-.3?'#8a8e84':p0[0]<.25?'#b4b8ac':'#d0d4c8';
        poly(sg,[Z(u0,p0[1],p0[2]),Z(u1,p0[1],p0[2]),Z(u1,p1[1],p1[2]),Z(u0,p1[1],p1[2])],col);}
      for(let k=1;k<7;k++){const u=u0+(u1-u0)*k/7;let prev=null;for(let i=0;i<=N;i++){const p=prof(i);if(p[0]<-.35){prev=null;continue;}const q=Z(u,p[1],p[2]);if(prev)ln(sg,prev[0],prev[1],q[0],q[1],'#9a9e94');prev=q;}}
      const ep=[];for(let i=0;i<=N;i++){const p=prof(i);ep.push(Z(u1,p[1],p[2]));}
      poly(sg,ep,'#9a9e94');
      for(let i=0;i<N;i++){ln(sg,ep[i][0],ep[i][1],ep[i+1][0],ep[i+1][1],'#b8bcb0');}
      door=[Z(u1,vc-.08,0),Z(u1,vc+.08,0),Z(u1,vc+.08,13),Z(u1,vc-.08,13)];
      poly(sg,door,'#4a4a46');
      P(sg,(door[2][0]+door[3][0])/2-1,door[3][1]-4,3,2,'#e8e0c0');
    });
    const dl=[(door[2][0]+door[3][0])/2-1,door[3][1]-4];P(ng,dl[0],dl[1],3,2,'#fff0c0');
    layer(M,sg=>{ // 鏟裝機
      const p=Z(.99,.6,0);P(sg,p[0]-6,p[1]-7,9,4,'#e8b840');P(sg,p[0]-6,p[1]-7,9,1,'#f0d060');P(sg,p[0]-3,p[1]-11,4,4,'#8aa0b0');
      P(sg,p[0]+3,p[1]-5,3,2,'#6a6e76');P(sg,p[0]-5,p[1]-3,3,3,'#2a2a2e');P(sg,p[0]+0,p[1]-3,3,3,'#2a2a2e');
    });
    save('118_1_2',M,ax,ay,{mat:'I',k:118,seed:2});
  });

  /* ================= k100 釀酒廠 ================= */
  safe('100_1',()=>{ // v1：老蒸餾廠（紅磚雙坡蒸餾室＋白牆寶塔頂麥芽窯＋橡木桶堆）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(100,1);
    plate(g,ax,ay,2,'#a89684',rk,{specks:['#9a8878','#b4a494']});
    shadow(g,100,140,38,8);
    let kl;
    layer(M,sg=>{ // 麥芽窯
      kl=tprism(sg,C,2,.62,.44,.26,.26,34,'#e0d8c8','#b4ac9c',null);
      const S=kl.S,W=kl.W,N=kl.N,E=kl.E,ap=[S[0],W[1]-18];
      for(let z=8;z<30;z+=10)fw(sg,kl,-1,5,z,4,5,'#6a5a4a');
      fw(sg,kl,1,6,14,3,5,'#6a5a4a');
      poly(sg,[[W[0]-2,W[1]+1],[S[0],S[1]+2],ap],'#707480');poly(sg,[[S[0],S[1]+2],[E[0]+2,E[1]+1],ap],'#4e5058');
      ln(sg,S[0],S[1]+1,ap[0],ap[1]+1,'#8a8e98');
      P(sg,ap[0]-3,ap[1]-4,1,4,'#3a3c44');P(sg,ap[0]+2,ap[1]-4,1,4,'#3a3c44');
      poly(sg,[[ap[0]-6,ap[1]-3],[ap[0]+1,ap[1]-10],[ap[0]+1,ap[1]-3]],'#707480');poly(sg,[[ap[0],ap[1]-10],[ap[0]+7,ap[1]-3],[ap[0],ap[1]-3]],'#4e5058');
      P(sg,ap[0],ap[1]-13,1,3,'#3a3c44');
    });
    let st;
    layer(M,sg=>{ // 蒸餾室
      st=tprism(sg,C,2,.96,.96,.62,.36,22,'#a85e48','#7e4434',null);
      for(let i=0;i<4;i++){const dx=5+i*9;fw(sg,st,-1,dx,5,4,8,'#8ab4d0');fw(sg,st,-1,dx+1,13,2,1,'#8ab4d0');
        fw(sg,st,-1,dx-1,4,6,1,'#e8d8c0');fw(sg,st,-1,dx,13,1,1,'#d8c8b0');fw(sg,st,-1,dx+3,13,1,1,'#d8c8b0');fw(sg,st,-1,dx+1,14,2,1,'#d8c8b0');}
      fw(sg,st,-1,1,18,2*st.L-1,1,'#c47e5c');
      fw(sg,st,1,9,0,6,10,'#4a3020');fw(sg,st,1,10,10,4,1,'#4a3020');fw(sg,st,1,8,11,8,1,'#d8c8b0');
      gableL(sg,st,10,'#5e6068','#46484e','#7e4434');
      const m=[(st.W[0]+st.N[0])/2+10,(st.W[1]+st.N[1])/2-6];cyl(sg,m[0],m[1],2,6,{l:'#c8783a',m:'#a85a2a',d:'#7a3e1e',t:'#5a2e16'});
    });
    for(let i=0;i<4;i++){const dx=5+i*9;fw(ng,st,-1,dx,5,4,8,'#ffd890');fw(ng,st,-1,dx+1,13,2,1,'#ffd890');}
    fw(ng,st,1,10,11,4,1,'#ffc870');
    layer(M,sg=>{ // 橡木桶堆
      const barrel=(x,y)=>{for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const d=(dx+.5)*(dx+.5)+(dy+.5)*(dy+.5);if(d>11)continue;P(sg,x+dx,y+dy,1,1,d>6?'#6a4e30':(dx+dy<0?'#b08a5a':'#9a7a50'));}P(sg,x,y,1,1,'#5a3e24');};
      for(const b of[[116,120],[109,123],[102,126],[113,116],[106,119]])barrel(b[0],b[1]);
    });
    save('100_1_1',M,ax,ay,{mat:'I',k:100,seed:1,smoke:[{x:kl.S[0],y:kl.W[1]-32}]});
  });
  safe('100_2',()=>{ // v2：現代精釀廠（玻璃糖化室見銅鍋＋戶外不鏽鋼發酵罐列＋麥芽筒倉）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(100,2),Z=ZZ(C);
    plate(g,ax,ay,2,'#a89684',rk,{specks:['#9a8878','#b4a494']});
    shadow(g,100,140,38,8);
    const silver={l:'#e0e4e8',m:'#c0c6cc',d:'#8e969e',hl:'#f4f6f8',t:'#d0d4d8'};
    const ferm=(sg,u,v)=>{const p=tp(C,u,v),x=p[0],y=p[1];
      P(sg,x-4,y-5,1,5,'#5a5e66');P(sg,x+3,y-5,1,5,'#5a5e66');P(sg,x,y-3,1,3,'#5a5e66');
      cyl(sg,x,y-5,5,22,silver);
      const ty=y-27;for(let k=0;k<4;k++){const hw=5-k;P(sg,x-hw,ty-1-k,hw,1,'#e8ecf0');P(sg,x,ty-1-k,hw,1,'#a8b0b8');}
      P(sg,x,ty-6,1,2,'#6a6e76');P(sg,x-5,y-14,10,1,'#9aa2aa');};
    for(const v of[.18,.4,.62,.84])layer(M,sg=>ferm(sg,.2,v));
    layer(M,sg=>{ // 麥芽筒倉
      const p=tp(C,.6,.12);cyl(sg,p[0],p[1],7,40,{l:'#dcdcd2',m:'#c0c0b6',d:'#96968c',hl:'#ececE4'.toLowerCase()});
      const ty=p[1]-40;for(let k=0;k<6;k++){const hw=7-k;P(sg,p[0]-hw,ty-1-k,hw,1,'#9a9e94');P(sg,p[0],ty-1-k,hw,1,'#6e7268');}
      for(let z=10;z<40;z+=10)P(sg,p[0]-7,p[1]-z,14,1,'#aaa9a0');
      const q=Z(.66,.5,15);ln(sg,p[0]+2,ty-4,q[0],q[1],'#8a8e96');ln(sg,p[0]+3,ty-4,q[0]+1,q[1],'#6a6e76');
    });
    let hall;
    layer(M,sg=>{ // 糖化廳
      hall=tprism(sg,C,2,.97,.97,.5,.5,15,'#e4dccc','#bab2a2','#8a8478');
      fw(sg,hall,-1,4,3,22,10,'#8ab4d0');
      for(const c of[10,20])for(let dx=c-4;dx<=c+4;dx++){const hk=rd(Math.sqrt(Math.max(0,16-(dx-c)*(dx-c))))+2;fw(sg,hall,-1,dx,3,1,hk,'#c8783a');fw(sg,hall,-1,dx,3+hk-1,1,1,'#e8a060');}
      for(let k=0;k<=4;k++)fw(sg,hall,-1,4+k*5,3,1,10,'#6a7a8a');
      fw(sg,hall,-1,3,13,24,1,'#6a7a8a');
      fw(sg,hall,1,4,0,8,9,'#7a7a74');fw(sg,hall,1,4,9,8,1,'#5a5a56');fw(sg,hall,1,16,10,7,3,'#4e9a4e');
      const q=[(hall.N[0]+hall.E[0])/2-4,(hall.N[1]+hall.E[1])/2+8];prism(sg,q[0],q[1],3,3,4,'#b9c0c6','#8d959c','#dfe4e8');
    });
    fw(ng,hall,-1,4,3,22,10,'#ffe0a0');
    for(const c of[10,20])for(let dx=c-4;dx<=c+4;dx++){const hk=rd(Math.sqrt(Math.max(0,16-(dx-c)*(dx-c))))+2;fw(ng,hall,-1,dx,3,1,hk,'#8a5230');}
    for(let k=0;k<=4;k++)fw(ng,hall,-1,4+k*5,3,1,10,'#3a3a3a');
    fw(ng,hall,1,16,10,7,3,'#8aff9a');
    save('100_1_2',M,ax,ay,{mat:'I',k:100,seed:2});
  });

  /* ================= k119 中央廚房 ================= */
  safe('119_1',()=>{ // v1：兩層物流型中央廚房（長樓＋卸貨月台＋冷鏈廂型車）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(119,1),Z=ZZ(C);
    plate(g,ax,ay,2,'#a89c88',rk,{dk:'#948874',lt:'#bcb09c',specks:['#9c907c','#b4a894']});
    shadow(g,100,140,38,8);
    let bk;
    layer(M,sg=>{ // 後棟：烹調樓（較高，屋頂排油煙罩＋不鏽鋼風管）
      bk=tprism(sg,C,2,.94,.52,.44,.4,34,'#e4e0d4','#bebab0','#9a9a92');
      fw(sg,bk,-1,1,29,2*bk.L-1,3,'#c05a3a');fw(sg,bk,1,0,29,2*bk.R,3,'#963e28');
      for(let i=0;i<3;i++){fw(sg,bk,1,3+i*8,17,4,6,'#7fb0d8');fw(sg,bk,1,3+i*8,6,4,6,'#7fb0d8');}
      const h1=Z(.8,.32,34);prism(sg,h1[0],h1[1],6,5,5,'#b8bec6','#8a9098','#d0d6dc');
      const h2=Z(.6,.36,34);cyl(sg,h2[0],h2[1],3,10,{l:'#e0e4e8',m:'#b8bec6',d:'#8a9098',t:'#4a4e56'});
      P(sg,rd(h2[0])-4,rd(h2[1])-12,8,2,'#8a9098');P(sg,rd(h2[0])-3,rd(h2[1])-14,6,2,'#a8aeb6');
    });
    for(let i=0;i<3;i++)fw(ng,bk,1,3+i*8,17,4,6,i===1?'#ffd890':'#ffe9b0');
    let bd;
    layer(M,sg=>{
      bd=tprism(sg,C,2,.8,.96,.68,.4,24,'#ece8dc','#c8c4b8','#9a9a92');
      fw(sg,bd,-1,1,21,2*bd.L-1,3,'#c05a3a');fw(sg,bd,1,0,21,2*bd.R,3,'#963e28');
      for(let r=0;r<2;r++)for(let i=0;i<4;i++)fw(sg,bd,-1,5+i*10,4+r*9,6,4,'#7fb0d8');
      fw(sg,bd,-1,1,12,2*bd.L-1,1,'#d8d4c8');
      for(let i=0;i<3;i++){fw(sg,bd,1,3+i*8,0,5,9,'#7a808a');fw(sg,bd,1,3+i*8,9,5,1,'#4a505a');fw(sg,bd,1,3+i*8,0,1,2,'#e8c040');}
      fw(sg,bd,1,1,11,2*bd.R-2,1,'#5a5e66');
      const c1=[(bd.W[0]+bd.N[0])/2+10,(bd.W[1]+bd.N[1])/2+8];prism(sg,c1[0],c1[1],4,4,4,'#b9c0c6','#8d959c','#dfe4e8');
      const c2=[(bd.S[0]+bd.E[0])/2-8,(bd.S[1]+bd.E[1])/2-5];prism(sg,c2[0],c2[1],3,3,3,'#b9c0c6','#8d959c','#dfe4e8');
      const c3=[(bd.N[0]+bd.E[0])/2-6,(bd.N[1]+bd.E[1])/2+6];cyl(sg,c3[0],c3[1],2,9,{l:'#d0d6dc',m:'#b0b6bc',d:'#80868c',t:'#6a7078'});P(sg,c3[0]-3,c3[1]-11,6,2,'#8a9098');
    });
    for(let r=0;r<2;r++)for(let i=0;i<4;i++)fw(ng,bd,-1,5+i*10,4+r*9,6,4,(r+i)%3===1?'#ffd890':'#ffe9b0');
    fw(ng,bd,1,1,11,2*bd.R-2,1,'#fff0c0');
    const van=(sg,us,vs,stripe)=>{const pr=tprism(sg,C,2,us,vs,.16,.07,7,'#f0f0ec','#c8c8c4','#e0e0dc');
      fw(sg,pr,-1,2,3,2*pr.L-3,1,stripe);P(sg,pr.S[0]-2,pr.S[1]+1-7,1,1,'#3a3a3a');
      P(sg,pr.sx-3,pr.sy-2,2,2,'#2a2a2e');P(sg,pr.sx-2*pr.L+2,pr.sy-pr.L-2,2,2,'#2a2a2e');return pr;};
    layer(M,sg=>{van(sg,1,.66,'#3a7ab8');});
    layer(M,sg=>{van(sg,1,.84,'#c05a3a');});
    layer(M,sg=>{ // 食材箱
      const p=tp(C,.22,.98);P(sg,p[0]-2,p[1]-7,8,5,'#8a6a42');P(sg,p[0]-2,p[1]-8,8,2,'#d8b070');P(sg,p[0]+5,p[1]-4,6,4,'#8a6a42');P(sg,p[0]+5,p[1]-5,6,2,'#d8b070');
    });
    save('119_1_1',M,ax,ay,{mat:'S',k:119,seed:1});
  });
  safe('119_2',()=>{ // v2：鋸齒天窗食品廠房＋不鏽鋼排煙囪＋冷藏庫
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(119,2),Z=ZZ(C);
    plate(g,ax,ay,2,'#a89c88',rk,{dk:'#948874',lt:'#bcb09c',specks:['#9c907c','#b4a894']});
    shadow(g,100,140,38,8);
    let cr;
    layer(M,sg=>{ // 冷藏庫
      cr=tprism(sg,C,2,.26,.98,.22,.26,11,'#f0f0ec','#c8ccd0','#b8bcc0');
      for(let dx=3;dx<2*cr.L;dx+=4)fw(sg,cr,-1,dx,1,1,9,'#dcdcd8');
      fw(sg,cr,1,5,0,5,8,'#8a9aa8');
      const q=[(cr.W[0]+cr.E[0])/2,(cr.N[1]+cr.S[1])/2+2];prism(sg,q[0],q[1],3,3,4,'#9aa0a8','#707680','#b8bec6');P(sg,q[0]-1,q[1]-9,3,1,'#4a4e56');
    });
    let hall;const teeth=[[.35,.55],[.55,.75],[.75,.95]];
    layer(M,sg=>{ // 鋸齒廠房
      hall=tprism(sg,C,2,.92,.95,.64,.6,14,'#ece8dc','#c8c4b8','#8a8e96');
      for(let i=0;i<3;i++)fw(sg,hall,-1,6+i*12,4,7,5,'#7fb0d8');
      fw(sg,hall,-1,2,0,4,9,'#5a3a24');
      fw(sg,hall,1,6,0,9,9,'#8a8e96');fw(sg,hall,1,6,9,9,1,'#5a5e66');
      fw(sg,hall,-1,1,11,2*hall.L-1,2,'#c05a3a');fw(sg,hall,1,0,11,2*hall.R,2,'#963e28');
      for(const t of teeth){const a=t[0],b=t[1];
        poly(sg,[Z(.28,a,14),Z(.92,a,14),Z(.92,b,22),Z(.28,b,22)],'#8e949c');
        const e0=Z(.28,a,14),e1=Z(.92,a,14);ln(sg,e0[0],e0[1],e1[0],e1[1],'#6e747c');
        poly(sg,[Z(.28,b,22),Z(.92,b,22),Z(.92,b,14),Z(.28,b,14)],'#9cc8e0');
        for(let k=1;k<8;k++){const p=Z(.28+.64*k/8,b,22),q=Z(.28+.64*k/8,b,14);ln(sg,p[0],p[1],q[0],q[1],'#6a8aa0');}
        const t0=Z(.92,a,14),t1=Z(.92,b,14),t2=Z(.92,b,22);poly(sg,[t0,t1,t2],'#c8c4b8');
        const r0=Z(.28,b,22),r1=Z(.92,b,22);ln(sg,r0[0],r0[1],r1[0],r1[1],'#b4bac2');}
    });
    for(let i=0;i<3;i++)fw(ng,hall,-1,6+i*12,4,7,5,'#ffe9b0');
    for(const t of teeth){const b=t[1];const pts=[Z(.28,b,21),Z(.92,b,21),Z(.92,b,15),Z(.28,b,15)];poly(ng,pts,'rgba(255,233,176,.55)');}
    layer(M,sg=>{ // 不鏽鋼排煙囪（落地＋牆撐）
      const p=tp(C,.97,.32);
      cyl(sg,p[0],p[1],3,48,{l:'#e0e4e8',m:'#b8bec6',d:'#8a9098',hl:'#f2f4f6',t:'#5a6068'});
      P(sg,p[0]-4,p[1]-51,8,2,'#6a7078');P(sg,p[0]-3,p[1]-53,6,2,'#8a9098');
      for(const z of[10,20]){const q=Z(.92,.36,z);ln(sg,q[0],q[1],p[0]-3,p[1]-z-2,'#6a7078');}
      P(sg,p[0]-4,p[1]-1,8,2,'#8a8e96');
    });
    layer(M,sg=>{ // 廂型車
      const pr=tprism(sg,C,2,1,.6,.08,.18,7,'#f0f0ec','#c8c8c4','#e0e0dc');fw(sg,pr,1,1,3,2*pr.R-2,1,'#c05a3a');
      P(sg,pr.sx+1,pr.sy-2,2,2,'#2a2a2e');P(sg,pr.sx+2*pr.R-3,pr.sy-pr.R-2,2,2,'#2a2a2e');
    });
    layer(M,sg=>{const p=tp(C,.36,.99);P(sg,p[0]-3,p[1]-6,7,4,'#8a6a42');P(sg,p[0]-3,p[1]-7,7,2,'#d8b070');});
    const ch=tp(C,.97,.32);
    save('119_1_2',M,ax,ay,{mat:'S',k:119,seed:2,smoke:[{x:ch[0],y:ch[1]-54}]});
  });

  /* ================= 共用：雙曲面冷卻塔（v0 四階色帶＋口沿＋紅色航警帶） ================= */
  function hyper(g,cx,by,h,rb,rw,rt,c){cx=rd(cx);by=rd(by);const k=.7*h;
    const hw=r=>r<k?rw+(rb-rw)*Math.pow((k-r)/k,2):rw+(rt-rw)*Math.pow((r-k)/(h-k),2);
    const col=t=>t<-.55?c.l:t<.12?c.m:t<.64?c.d:c.e;
    for(let r=0;r<=h;r++){const w=rd(hw(r)),y=by-r;for(let dx=-w;dx<w;dx++){g.fillStyle=col((dx+.5)/w);g.fillRect(cx+dx,y,1,1);}}
    for(let dx=-rb;dx<rb;dx++){const t=(dx+.5)/rb,e=rd(rb/2*Math.sqrt(Math.max(0,1-t*t)));if(e>0){g.fillStyle=col(t);g.fillRect(cx+dx,by+1,1,e);}}
    for(const b of(c.bands||[])){const r=b[0],w=rd(hw(r));for(let dx=-w;dx<w;dx++){const t=(dx+.5)/w,e=rd(w/2*Math.sqrt(Math.max(0,1-t*t)));g.fillStyle=t<.12?b[1]:b[2];g.fillRect(cx+dx,by-r+e,1,b[3]||1);}}
    const y0=by-h;for(let dx=-rt;dx<rt;dx++){const t=(dx+.5)/rt,e=rd(rt/2*Math.sqrt(Math.max(0,1-t*t)));
      g.fillStyle=c.in;g.fillRect(cx+dx,y0-e,1,2*e+1);if(e>1){g.fillStyle=c.in2||c.in;g.fillRect(cx+dx,y0-e+1,1,1);}
      g.fillStyle=c.rim;g.fillRect(cx+dx,y0-e,1,1);g.fillStyle=c.lip;g.fillRect(cx+dx,y0+e,1,1);}
    return{top:y0,cx,by};}

  /* ================= k58 核電廠 ================= */
  const TWR58={l:'#eef0ea',m:'#d9dbd3',d:'#b2b4ac',e:'#8f918a',rim:'#8f918a',lip:'#f4f6f0',in:'#5a5c56',in2:'#6e706a'};
  const DOME58={hl:'#f8f6ee',l:'#e6e2d6',m:'#cfcbbf',d:'#a8a498'};
  const CONT58={l:'#e6e2d6',m:'#d2cec2',d:'#aeaa9e',e:'#908c82',hl:'#f2efe6'};
  const plate58=(g,ax,ay,rk)=>plate(g,ax,ay,3,'#a8a49a',rk,{specks:['#9c988e','#b4b0a6'],cnt:70,dk:'#918d83',lt:'#bab6ac'});
  safe('58_1',()=>{ // v1：雙機組擴建（單座巨型冷卻塔＋雙安全殼＋格構排氣筒＋長汽機廳＋開關場）
    const M=mk(208,220),ax=104,ay=218,C=TC(ax,ay,3),g=M.g,ng=M.ng,rk=RND(58,1),Z=ZZ(C);
    plate58(g,ax,ay,rk);
    poly(g,[Z(.8,.08),Z(1,.08),Z(1,.52),Z(.8,.52)],'#b4b0a4');
    shadow(g,128,204,72,14,.14);
    const R1=tp(C,.3,.1),R2=tp(C,.66,.3),ST=tp(C,.5,.2),TW=[75,158];
    const contain=(sg,p)=>{cyl(sg,p[0],p[1],16,26,CONT58);dome(sg,p[0],p[1]-26,16,14,DOME58);
      for(const dx of[-9,-1,7])P(sg,p[0]+dx,p[1]-24,1,20,'#c2beb2');
      P(sg,p[0]-5,p[1]-1,5,8,'#5a5e66');P(sg,p[0]-5,p[1]-1,5,1,'#7a7e86');
      for(let i=0;i<3;i++){P(sg,p[0]-9+i*6,p[1]+8-((i*3)>>1),3,1,'#ffd420');}
      P(sg,p[0]+5,p[1]-12,5,5,'#ffd420');P(sg,p[0]+7,p[1]-11,1,1,'#20242c');P(sg,p[0]+6,p[1]-9,1,1,'#20242c');P(sg,p[0]+8,p[1]-9,1,1,'#20242c');};
    layer(M,sg=>contain(sg,R1));
    layer(M,sg=>{hyper(sg,TW[0],TW[1],100,30,19,22,Object.assign({bands:[[90,'#c23c28','#9a2e1e',2],[84,'#c23c28','#9a2e1e',2]]},TWR58));});
    for(const dx of[-21,19])P(ng,TW[0]+dx,TW[1]-100,2,2,'#ff5a4a');
    layer(M,sg=>{ // 格構排氣筒
      const x=ST[0],y=ST[1];
      ln(sg,x-9,y,x-3,y-78,'#7a7e86');ln(sg,x+9,y,x+3,y-78,'#5a5e66');
      for(let i=1;i<5;i++){const yy=y-i*18,hw=rd(9-6*i*18/78);P(sg,x-hw,yy,2*hw+1,1,'#6a6e76');}
      cyl(sg,x,y,3,94,{l:'#e2e4e6',m:'#c4c8cc',d:'#9aa0a6',t:'#4a4e56'});
      P(sg,x-3,y-86,6,3,'#c23c28');P(sg,x-3,y-78,6,2,'#c23c28');
    });
    P(ng,ST[0]-1,ST[1]-97,2,2,'#ff5a4a');
    layer(M,sg=>contain(sg,R2));
    layer(M,sg=>{ // 開關場：三變壓器＋格構電塔
      for(const v of[.22,.34,.46]){const p=tp(C,.92,v);prism(sg,p[0],p[1],4,3,6,'#6a7078','#4e545c','#80868e');P(sg,p[0]-2,p[1]-12,1,3,'#e8eaee');P(sg,p[0]+1,p[1]-13,1,3,'#e8eaee');}
      const p=tp(C,.86,.1);P(sg,p[0]-3,p[1]-24,1,24,'#4a4e56');P(sg,p[0]+3,p[1]-24,1,24,'#4a4e56');
      for(const z of[24,17,10])P(sg,p[0]-5,p[1]-z,11,1,'#4a4e56');
      ln(sg,p[0]-3,p[1]-10,p[0]+3,p[1]-17,'#5a5e66');
    });
    let th;
    layer(M,sg=>{ // 長汽機廳＋採光天窗
      th=tprism(sg,C,3,.95,.9,.53,.28,20,'#98a2b0','#79828e','#a6b0be');
      fw(sg,th,-1,1,0,2*th.L-1,1,'#3a3e46');
      for(let i=0;i<5;i++)fw(sg,th,-1,5+i*9,7,5,5,'#b8c8d8');
      fw(sg,th,1,9,0,8,12,'#5a5e66');fw(sg,th,1,9,12,8,1,'#ffd420');
      const q=Z(.9,.82,20);const cl=prism(sg,q[0],q[1],19,5,5,'#7a8490','#5e6874','#8e98a4');
      fw(sg,cl,-1,2,1,2*cl.L-4,3,'#bfd6e8');
    });
    for(let i=0;i<5;i++)fw(ng,th,-1,5+i*9,7,5,5,'#ffe9a8');
    { const q=Z(.9,.82,20);const x=rd(q[0]),y=rd(q[1]);for(let dx=3;dx<36;dx++)if(dx%6<4)P(ng,x-dx,y-(dx>>1)-4,1,3,'#cfe6ff'); }
    puff(g,TW[0]+3,TW[1]-106,12,4,.72);puff(g,TW[0]+9,TW[1]-114,14,5,.52);puff(g,TW[0]+17,TW[1]-124,12,4,.34);
    save('58_1_1',M,ax,ay,{mat:'S',k:58,seed:1});
  });
  safe('58_2',()=>{ // v2：第三代單機組（圓柱屏蔽廠房＋頂部水箱、輔助廠房、高窗汽機廠房、機力通風冷卻塔排、冷卻水池）
    const M=mk(208,220),ax=104,ay=218,C=TC(ax,ay,3),g=M.g,ng=M.ng,rk=RND(58,2),Z=ZZ(C);
    plate58(g,ax,ay,rk);
    shadow(g,128,204,72,14,.14);
    { // 冷卻水池（下沉）
      poly(g,[Z(.66,.58),Z(1,.58),Z(1,.8),Z(.66,.8)],'#c8c4b8');
      poly(g,[Z(.68,.6),Z(.98,.6),Z(.98,.78),Z(.68,.78)],'#3a78b8');
      const a=Z(.68,.6),b=Z(.98,.6);ln(g,a[0],a[1]+1,b[0],b[1]+1,'#2a5a90');
      for(let i=0;i<3;i++){const p=Z(.74+i*.08,.66+i*.04),q=Z(.8+i*.08,.66+i*.04);ln(g,p[0],p[1],q[0],q[1],'#6aa0d8');}
    }
    const SH=tp(C,.36,.36);
    layer(M,sg=>{ // 屏蔽廠房
      cyl(sg,SH[0],SH[1],26,54,CONT58);
      const top=SH[1]-54;
      for(let dx=-24;dx<24;dx+=4){const t=(dx+.5)/26,e=rd(13*Math.sqrt(Math.max(0,1-t*t)));P(sg,SH[0]+dx,top+e+4,2,2,'#8e8a80');}
      dome(sg,SH[0],top,26,9,DOME58);
      cyl(sg,SH[0],top-7,9,6,{l:'#dcd8cc',m:'#c6c2b6',d:'#a4a094',t:'#b8b4a8'});
      dome(sg,SH[0],top-13,9,3,DOME58);
      P(sg,SH[0]-1,top-21,2,4,'#6a6e76');
    });
    P(ng,SH[0]-1,SH[1]-77,2,2,'#ff5a4a');P(M.g,SH[0]-1,SH[1]-77,2,2,'#c23c28');
    let tb,aux;
    layer(M,sg=>{ // 汽機廠房
      tb=tprism(sg,C,3,.96,.56,.34,.42,30,'#98a2b0','#79828e','#a6b0be');
      for(let i=0;i<5;i++)fw(sg,tb,-1,4+i*6,5,3,18,'#b8c8d8');
      fw(sg,tb,-1,1,26,2*tb.L-1,1,'#b4bcc8');
      for(const z of[16,20])fw(sg,tb,1,4,z,18,1,'#6a7480');
      fw(sg,tb,1,26,0,10,14,'#5a5e66');fw(sg,tb,1,26,14,10,1,'#ffd420');
      const q=Z(.84,.36,30);cyl(sg,q[0],q[1],3,4,{l:'#c8ccd0',m:'#a8acb0',d:'#80848a',t:'#4a4e56'});
    });
    for(let i=0;i<5;i++)fw(ng,tb,-1,4+i*6,5,3,18,(i%2)?'#ffe9a8':'#fff0c8');
    layer(M,sg=>{ // 輔助廠房（包住屏蔽廠房前緣）
      aux=tprism(sg,C,3,.6,.78,.48,.22,24,'#c6c2b6','#a09c90','#b4b0a4');
      for(let i=0;i<5;i++)fw(sg,aux,-1,5+i*8,14,3,3,'#b8c8d8');
      fw(sg,aux,-1,22,0,6,9,'#5a5e66');fw(sg,aux,-1,21,9,8,1,'#ffd420');
      fw(sg,aux,-1,36,4,4,4,'#ffd420');fw(sg,aux,-1,37,5,2,2,'#20242c');
      fw(sg,aux,1,6,10,10,2,'#8e8a80');
    });
    for(const i of[0,2,3])fw(ng,aux,-1,5+i*8,14,3,3,'#ffe9a8');
    const fans=[];
    layer(M,sg=>{ // 機力通風冷卻塔排
      const cb=tprism(sg,C,3,.95,.98,.73,.16,14,'#b4b8b0','#8e928a','#9ea298');
      for(const z of[3,7])fw(sg,cb,-1,3,z,2*cb.L-6,1,'#7e8278');
      fw(sg,cb,1,2,3,2*cb.R-4,1,'#6e7268');
      for(const u of[.34,.5,.66,.82]){const q=Z(u,.9,14);cyl(sg,q[0],q[1],6,4,{l:'#c8ccc4',m:'#aab0a8',d:'#868c84',t:'#3a3e3a'});fans.push(q);}
    });
    for(const q of fans){puff(g,q[0]+1,q[1]-9,4,2,.7);puff(g,q[0]+3,q[1]-14,5,2,.45);}
    save('58_1_2',M,ax,ay,{mat:'S',k:58,seed:2});
  });

  /* ================= k62 垃圾焚化發電廠 ================= */
  // 繪製端 T363 疊層用固定畫布座標：煙囪頂 (111,23)、汽機房夜間冷光 (95..112,133..141)。
  // 兩個變體畫布同 136×150、錨點不變、煙囪頂同點，前右角保留藍色發電機窗承接冷光。
  const plate62=(g,ax,ay,rk)=>plate(g,ax,ay,2,'#8d897d',rk,{dk:'#77746a',lt:'#a39e90',specks:['#828074','#999488'],cnt:30});
  const wteTruck=(sg,C,u,v)=>{const b=tprism(sg,C,2,u,v,.15,.08,7,'#d28b35','#a86a26','#e6a84b');
    fw(sg,b,-1,1,4,2*b.L-2,1,'#b8742c');fw(sg,b,-1,2,-1,2,2,'#25292e');fw(sg,b,-1,7,-1,2,2,'#25292e');
    const c2=tprism(sg,C,2,u+.06,v,.05,.08,6,'#e6e2d6','#b8b4aa','#f0ece4');fw(sg,c2,1,1,3,2*c2.R-2,2,'#8ab4d0');fw(sg,c2,-1,1,-1,2,2,'#25292e');};
  safe('62_1',()=>{ // v1：擴建加高（高鍋爐房＋雙管混凝土煙囪＋袋式集塵器＋獨立傾卸廳＋汽機房）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(62,1),Z=ZZ(C);
    plate62(g,ax,ay,rk);
    shadow(g,88,140,48,10,.15);
    let bo,tip,tb,kk;
    layer(M,sg=>{ // 鍋爐房（加高、帶狀高窗）
      bo=tprism(sg,C,2,.62,.66,.47,.51,44,'#b06a4c','#86503a','#4f555c');
      for(let dx=6;dx<2*bo.L;dx+=6)fw(sg,bo,-1,dx,2,1,26,'#a15f44');
      for(let dx=6;dx<2*bo.R;dx+=6)fw(sg,bo,1,dx,2,1,26,'#7a4834');
      fw(sg,bo,-1,1,29,2*bo.L-1,2,'#c77752');fw(sg,bo,1,0,29,2*bo.R,2,'#a4623f');
      fw(sg,bo,-1,3,34,2*bo.L-5,4,'#91b5c8');fw(sg,bo,1,3,34,2*bo.R-5,4,'#6f93a6');
      const q=Z(.5,.5,44);const rm=prism(sg,q[0],q[1],9,5,6,'#8e969e','#6e767e','#5a6068');
      fw(sg,rm,-1,2,1,14,3,'#91b5c8');
    });
    fw(ng,bo,-1,3,34,9,4,'#ffd98a');fw(ng,bo,-1,16,34,10,4,'#ffd98a');fw(ng,bo,1,8,34,12,4,'#ffc870');
    layer(M,sg=>{ // 袋式集塵器
      const fl=tprism(sg,C,2,.82,.44,.16,.22,22,'#aeb7bd','#7f8990','#939da4');
      for(let i=0;i<2;i++)fw(sg,fl,1,2+i*7,2,5,5,'#5e676e');
      fw(sg,fl,-1,1,17,2*fl.L-1,1,'#d3d9dc');fw(sg,fl,1,0,17,2*fl.R,1,'#c3c9cc');
      const a=Z(.62,.33,16),b=Z(.66,.33,16);P(sg,rd(a[0]),rd(a[1])-2,rd(b[0]-a[0])+1,3,'#939da4');
    });
    layer(M,sg=>{ // 雙管混凝土煙囪（管頂＝T363 疊層點 (111,23)）
      const cx=113,cy=115;
      cyl(sg,cx,cy,6,79,{l:'#e2ded4',m:'#c8c4ba',d:'#9e9a90',e:'#86827a',t:'#6a665e'});
      const band=(y,h2,cl,cr)=>{for(let dx=-6;dx<6;dx++){const t=(dx+.5)/6,e=rd(3*Math.sqrt(Math.max(0,1-t*t)));P(sg,cx+dx,y+e,1,h2,t<.1?cl:cr);}};
      band(40,3,'#c8493f','#9a3a30');band(47,3,'#c8493f','#9a3a30');band(62,1,'#6a665e','#56524a');
      cyl(sg,cx-3,36,2,11,{l:'#b8bec6',m:'#9aa0a8',d:'#6e747c',t:'#3a3e44'});
      cyl(sg,cx+3,36,2,7,{l:'#b8bec6',m:'#9aa0a8',d:'#6e747c',t:'#3a3e44'});
      P(sg,110,23,2,2,'#c8493f');
    });
    P(ng,110,23,2,2,'#ff5848');
    layer(M,sg=>{ // 傾卸廳（三道卸料門）
      tip=tprism(sg,C,2,.56,.88,.38,.22,20,'#8e969e','#6e767e','#5a6068');
      for(let i=0;i<3;i++)fw(sg,tip,-1,2+i*7,0,5,11,'#292d31');
      fw(sg,tip,-1,1,12,2*tip.L-1,1,'#e4b43f');fw(sg,tip,-1,1,17,2*tip.L-1,1,'#b9c1c8');
    });
    for(let i=0;i<3;i++)fw(ng,tip,-1,2+i*7,0,5,11,'rgba(255,178,86,.45)');
    layer(M,sg=>{ // 變壓器亭（藍色發電機窗，承接 T363 冷光）
      kk=tprism(sg,C,2,1,.46,.1,.18,8,'#657786','#4e5e6a','#7f93a3');
      fw(sg,kk,1,2,2,2*kk.R-4,4,'#4f98b8');
    });
    fw(ng,kk,1,2,2,2*kk.R-4,4,'#bfe9ff');
    layer(M,sg=>{ // 汽機房
      tb=tprism(sg,C,2,.96,.84,.3,.34,16,'#657786','#4e5e6a','#7f93a3');
      fw(sg,tb,-1,3,6,2*tb.L-6,4,'#91b5c8');
      fw(sg,tb,1,3,0,6,9,'#3a3e44');fw(sg,tb,1,12,6,2*tb.R-15,4,'#4f98b8');
      const q=Z(.88,.7,16);prism(sg,q[0],q[1],4,4,3,'#b9c0c6','#8d959c','#dfe4e8');
    });
    fw(ng,tb,-1,3,6,2*tb.L-6,4,'#ffd98a');fw(ng,tb,1,12,6,2*tb.R-15,4,'#bfe9ff');
    layer(M,sg=>wteTruck(sg,C,.5,.97));
    save('62_1_1',M,ax,ay,{mat:'S',k:62,seed:1});
  });
  safe('62_2',()=>{ // v2：老派市營焚化廠（紅磚雙坡爐房＋拱窗、方磚收分煙囪、露天垃圾坑＋門式抓斗吊、雙坡發電機房）
    const M=mk(136,150),ax=68,ay=148,C=TC(ax,ay,2),g=M.g,ng=M.ng,rk=RND(62,2),Z=ZZ(C);
    plate62(g,ax,ay,rk);
    shadow(g,88,140,48,10,.15);
    let bh,gh;
    layer(M,sg=>{ // 方磚收分煙囪（頂燈＝T363 疊層點 (111,23)）
      prism(sg,113,120,5,5,40,'#9a5440','#70392a','#5e3226');
      const up=prism(sg,113,79,4,4,46,'#9a5440','#70392a',null);
      prism(sg,113,37,5,5,3,'#b0654c','#7e4232','#3f3530');
      fw(sg,up,-1,1,34,8,3,'#efe6d8');fw(sg,up,1,0,34,8,3,'#cfc6b8');
      fw(sg,up,-1,1,12,8,1,'#86493a');fw(sg,up,1,0,12,8,1,'#5e3024');
      P(sg,112,25,1,4,'#3f3530');P(sg,111,23,2,2,'#c8493f');
    });
    P(ng,111,23,2,2,'#ff5848');
    layer(M,sg=>{ // 紅磚雙坡爐房＋拱窗
      bh=tprism(sg,C,2,.66,.62,.5,.44,26,'#a85e48','#7e4434',null);
      for(let i=0;i<4;i++){const dx=4+i*8;
        fw(sg,bh,-1,dx,6,4,11,'#91b5c8');fw(sg,bh,-1,dx+1,17,2,1,'#91b5c8');
        fw(sg,bh,-1,dx-1,5,6,1,'#d8c8b0');fw(sg,bh,-1,dx,17,1,1,'#c89878');fw(sg,bh,-1,dx+3,17,1,1,'#c89878');fw(sg,bh,-1,dx+1,18,2,1,'#c89878');}
      fw(sg,bh,-1,1,22,2*bh.L-1,1,'#c47e5c');
      fw(sg,bh,1,8,0,9,13,'#2e2a28');fw(sg,bh,1,9,13,7,1,'#2e2a28');fw(sg,bh,1,10,14,5,1,'#2e2a28');
      fw(sg,bh,1,11,19,3,3,'#91b5c8');
      gableL(sg,bh,13,'#5e6068','#46484e','#7e4434');
    });
    for(let i=0;i<4;i++){const dx=4+i*8;fw(ng,bh,-1,dx,6,4,11,'#ffd98a');fw(ng,bh,-1,dx+1,17,2,1,'#ffd98a');}
    fw(ng,bh,1,11,19,3,3,'#ffc870');
    let pit;
    layer(M,sg=>{ // 露天垃圾坑
      pit=tprism(sg,C,2,.62,.98,.46,.28,5,'#b4b0a4','#8e8a80','#4a4238',{rim:false});
      ln(sg,pit.W[0],pit.W[1],pit.N[0],pit.N[1],'#c8c4b8');ln(sg,pit.N[0],pit.N[1],pit.E[0],pit.E[1],'#c8c4b8');
      ln(sg,pit.W[0]+1,pit.W[1]+1,pit.N[0],pit.N[1]+1,'#2e2a24');ln(sg,pit.N[0],pit.N[1]+1,pit.E[0]-1,pit.E[1]+1,'#2e2a24');
      const G=['#6a5a3e','#5a6a4a','#7a4a3a','#8a8270'];
      for(let i=0;i<9;i++){const p=tp(C,.22+rk()*.34,.76+rk()*.18);P(sg,p[0],p[1]-6,2,1,G[i%4]);}
    });
    { // 門式抓斗吊（細桿件直接落筆，不另描邊）
      const cg=M.g,Y='#e0b040',YD='#a87a20';
      for(const u of[.2,.58])for(const v of[.7,.98]){const a=Z(u,v,0);P(cg,rd(a[0]),rd(a[1])-30,1,30,Y);P(cg,rd(a[0])+1,rd(a[1])-30,1,30,YD);}
      for(const u of[.2,.58]){const a=Z(u,.7,30),b=Z(u,.98,30);ln(cg,a[0],a[1],b[0],b[1],Y);ln(cg,a[0],a[1]+1,b[0],b[1]+1,YD);}
      const a=Z(.2,.84,31),b=Z(.58,.84,31);ln(cg,a[0],a[1],b[0],b[1],'#f0c850');ln(cg,a[0],a[1]+1,b[0],b[1]+1,YD);
      const t=Z(.42,.84,31),x=rd(t[0]),y=rd(t[1]);
      P(cg,x-2,y-2,5,3,'#5a5e66');P(cg,x,y+1,1,14,'#2a2622');P(cg,x-2,y+15,5,3,'#6a6e76');P(cg,x-2,y+18,1,1,'#4a4e56');P(cg,x+2,y+18,1,1,'#4a4e56');
    }
    layer(M,sg=>{ // 雙坡發電機房（右面藍色發電機窗承接 T363 冷光）
      gh=tprism(sg,C,2,.98,.8,.28,.46,14,'#a85e48','#7e4434',null);
      for(const dx of[3,9]){fw(sg,gh,1,dx,4,3,6,'#91b5c8');fw(sg,gh,1,dx+1,10,1,1,'#91b5c8');}
      fw(sg,gh,1,17,2,9,6,'#4f98b8');
      fw(sg,gh,-1,4,0,5,8,'#2e2a28');
      gableR(sg,gh,8,'#5e6068','#46484e','#a85e48');
    });
    for(const dx of[3,9])fw(ng,gh,1,dx,4,3,6,'#ffd98a');
    fw(ng,gh,1,17,2,9,6,'#bfe9ff');
    layer(M,sg=>wteTruck(sg,C,.86,.94));
    save('62_1_2',M,ax,ay,{mat:'S',k:62,seed:2});
  });

  /* ================= k57 食品加工廠 ================= */
  const plate57=(g,ax,ay,rk)=>plate(g,ax,ay,3,'#9a9488',rk,{specks:['#8f8a7e','#a6a094'],cnt:80,dk:'#847e72',lt:'#ada79a'});
  safe('57_1',()=>{ // v1：大型食品廠擴建（噴霧乾燥塔＋不鏽鋼筒倉列＋白色加工廳＋冷庫＋月台冷鏈車）
    const M=mk(208,220),ax=104,ay=218,C=TC(ax,ay,3),g=M.g,ng=M.ng,rk=RND(57,1),Z=ZZ(C);
    plate57(g,ax,ay,rk);
    poly(g,[Z(.9,.2),Z(1,.2),Z(1,.9),Z(.9,.9)],'#b3ada1');
    shadow(g,128,204,72,14,.14);
    const silver={l:'#e0e4e8',m:'#c0c6cc',d:'#8e969e',hl:'#f4f6f8',t:'#d0d4d8'};
    let sd,hall,cs;
    layer(M,sg=>{ // 噴霧乾燥塔
      sd=tprism(sg,C,3,.32,.5,.2,.2,78,'#eeeae0','#c8c4b8','#b8b4a8');
      for(let i=0;i<5;i++)fw(sg,sd,-1,4,8+i*13,3,4,'#8ab0c8');
      fw(sg,sd,1,4,0,5,70,'#b4b0a4');
      fw(sg,sd,-1,1,66,2*sd.L-1,3,'#3a6ab0');fw(sg,sd,1,0,66,2*sd.R,3,'#2e5490');
      const q=Z(.22,.4,78);cyl(sg,q[0],q[1],3,9,{l:'#d0d6dc',m:'#b0b6bc',d:'#80868c',t:'#5a6068'});
    });
    fw(ng,sd,-1,4,21,3,4,'#ffe9b0');fw(ng,sd,-1,4,47,3,4,'#ffe9b0');
    for(const u of[.4,.54,.68,.82])layer(M,sg=>{const p=tp(C,u,.12);
      P(sg,p[0]-6,p[1]-3,2,4,'#6a6e76');P(sg,p[0]+5,p[1]-3,2,4,'#5a5e66');
      cyl(sg,p[0],p[1]-3,8,40,silver);
      const ty=p[1]-43;for(let k=0;k<4;k++){const hw=8-2*k;P(sg,p[0]-hw,ty-1-k,hw,1,'#e8ecf0');P(sg,p[0],ty-1-k,hw,1,'#a8b0b8');}
      P(sg,p[0]-8,p[1]-22,16,1,'#9aa2aa');});
    layer(M,sg=>{ // 冷庫
      cs=tprism(sg,C,3,.34,.92,.24,.26,16,'#f2f2ee','#cfd2d4','#b8bcc0');
      for(let dx=5;dx<2*cs.L;dx+=5)fw(sg,cs,-1,dx,1,1,14,'#dedfdc');
      fw(sg,cs,1,8,0,8,11,'#8a9aa8');fw(sg,cs,1,8,11,8,1,'#5a6a78');
      for(const u of[.18,.28]){const q=Z(u,.8,16);prism(sg,q[0],q[1],3,3,3,'#9aa0a8','#707680','#b8bec6');}
    });
    layer(M,sg=>{ // 白色加工廳（藍帶＋黃招牌＋三道月台門）
      hall=tprism(sg,C,3,.9,.82,.54,.46,24,'#ecebe4','#c6c4ba','#9a9a92');
      fw(sg,hall,-1,1,19,2*hall.L-1,2,'#3a6ab0');fw(sg,hall,1,0,19,2*hall.R,2,'#2e5490');
      fw(sg,hall,-1,4,5,12,4,'#9cc8e0');fw(sg,hall,-1,38,5,11,4,'#9cc8e0');
      fw(sg,hall,-1,17,10,19,6,'#e8c84f');for(let i=0;i<3;i++)fw(sg,hall,-1,21+i*5,12,3,2,'#b8562e');
      fw(sg,hall,-1,24,0,5,7,'#5a5e66');
      for(let i=0;i<3;i++){fw(sg,hall,1,5+i*13,0,9,10,'#6a6e76');fw(sg,hall,1,4+i*13,10,11,1,'#4a4e56');fw(sg,hall,1,5+i*13,0,1,2,'#e8c040');}
      for(const q of[Z(.74,.6,24),Z(.56,.74,24)])prism(sg,q[0],q[1],5,4,4,'#b9c0c6','#8d959c','#dfe4e8');
    });
    fw(ng,hall,-1,4,5,12,4,'#ffe9b0');fw(ng,hall,-1,38,5,11,4,'#ffd890');
    for(let i=0;i<3;i++)fw(ng,hall,1,5+i*13,0,9,10,'rgba(255,220,150,.5)');
    const reefer=(sg,vs)=>{const t=tprism(sg,C,3,.99,vs,.07,.2,9,'#f2f2ee','#cfd2d4','#e4e4e0');fw(sg,t,1,2,4,2*t.R-4,1,'#3a6ab0');
      fw(sg,t,1,3,-1,2,2,'#2a2a2e');fw(sg,t,1,2*t.R-6,-1,2,2,'#2a2a2e');
      const cab=tprism(sg,C,3,.99,vs+.07,.07,.06,7,'#4a78b0','#35609a','#5a88c0');fw(sg,cab,-1,1,3,2*cab.L-2,2,'#bfe0f0');fw(sg,cab,1,1,-1,2,2,'#2a2a2e');};
    layer(M,sg=>reefer(sg,.5));layer(M,sg=>reefer(sg,.78));
    save('57_1_1',M,ax,ay,{mat:'I',k:57,seed:1});
  });
  safe('57_2',()=>{ // v2：老罐頭廠（三層紅磚廠樓＋拱窗＋屋頂木水塔、圓磚煙囪＋雙坡鍋爐房、鐵路支線＋棚車＋月台）
    const M=mk(208,220),ax=104,ay=218,C=TC(ax,ay,3),g=M.g,ng=M.ng,rk=RND(57,2),Z=ZZ(C);
    plate57(g,ax,ay,rk);
    shadow(g,128,204,72,14,.14);
    for(let i=0;i<=9;i++){const u=.1+i*.095,a=Z(u,.885),b=Z(u,.965);ln(g,a[0],a[1],b[0],b[1],'#6e5a46');}
    for(const v of[.9,.95]){const a=Z(.06,v),b=Z(.98,v);ln(g,a[0],a[1],b[0],b[1],'#54545a');}
    const CH=tp(C,.78,.12);
    layer(M,sg=>{ // 圓磚煙囪
      cyl(sg,CH[0],CH[1],5,82,{l:'#c47e5c',m:'#a85e48',d:'#7e4434',e:'#643426',t:'#2e2420'});
      cyl(sg,CH[0],CH[1]-79,6,3,{l:'#b8705a',m:'#9a5440',d:'#6e3a2c',t:'#2e2420'},{open:'#221a18'});
      for(const z of[30,60])P(sg,CH[0]-5,CH[1]-z,10,1,'#7e4434');
    });
    let bo,mill;
    layer(M,sg=>{ // 雙坡鍋爐房
      bo=tprism(sg,C,3,.96,.46,.22,.24,16,'#a85e48','#7e4434',null);
      for(const dx of[5,13]){fw(sg,bo,-1,dx,5,3,6,'#8ab4d0');fw(sg,bo,-1,dx+1,11,1,1,'#8ab4d0');}
      fw(sg,bo,1,8,0,7,10,'#3a2e28');
      gableL(sg,bo,7,'#5e6068','#46484e','#7e4434');
    });
    for(const dx of[5,13])fw(ng,bo,-1,dx,5,3,6,'#ffc870');
    layer(M,sg=>{ // 三層紅磚廠樓
      mill=tprism(sg,C,3,.72,.74,.56,.3,40,'#b06a4a','#8a4e34','#6a625a');
      fw(sg,mill,-1,1,37,2*mill.L-1,2,'#c47e5c');fw(sg,mill,1,0,37,2*mill.R,2,'#9a5a40');
      const arch=(side,dx,v)=>{fw(sg,mill,side,dx,v,3,7,'#8ab4d0');fw(sg,mill,side,dx+1,v+7,1,1,'#8ab4d0');fw(sg,mill,side,dx-1,v-1,5,1,'#d8c8b0');
        fw(sg,mill,side,dx,v+7,1,1,'#c89878');fw(sg,mill,side,dx+2,v+7,1,1,'#c89878');fw(sg,mill,side,dx+1,v+8,1,1,'#c89878');};
      for(const v of[14,25])for(let i=0;i<5;i++)arch(-1,5+i*10,v);
      arch(-1,5,3);arch(-1,45,3);
      fw(sg,mill,-1,19,0,16,11,'#3a3a3a');fw(sg,mill,-1,19,11,16,1,'#5a5a5a');
      for(const v of[3,14])for(const dx of[5,13])arch(1,dx,v);
      fw(sg,mill,1,4,26,21,7,'#e8c84f');for(let i=0;i<3;i++)fw(sg,mill,1,8+i*6,28,3,3,'#b8562e');
    });
    for(const v of[14,25])for(let i=0;i<5;i++){if(rk()<.55){const dx=5+i*10;fw(ng,mill,-1,dx,v,3,7,'#ffd890');fw(ng,mill,-1,dx+1,v+7,1,1,'#ffd890');}}
    for(const dx of[5,13])fw(ng,mill,1,dx,14,3,7,'#ffe0a0');
    fw(ng,mill,-1,19,0,16,11,'rgba(255,220,150,.5)');
    layer(M,sg=>{ // 屋頂木水塔
      const q=Z(.34,.58,40),x=rd(q[0]),y=rd(q[1]);
      P(sg,x-5,y-9,1,9,'#4a3a2a');P(sg,x+4,y-9,1,9,'#3a2a1e');P(sg,x-1,y-7,1,8,'#4a3a2a');P(sg,x-5,y-5,10,1,'#4a3a2a');
      cyl(sg,x,y-9,6,9,{l:'#a07a4e',m:'#8a6440',d:'#6a4a2e',e:'#523a24',t:'#8a6440'});
      for(const z of[12,15])P(sg,x-6,y-z,12,1,'#3a2a1e');
      const ty=y-18;for(let k=0;k<4;k++){const hw=7-2*k;P(sg,x-hw,ty-1-k,hw,1,'#6a625a');P(sg,x,ty-1-k,hw,1,'#4a443e');}
    });
    layer(M,sg=>{ // 裝卸月台＋木箱
      tprism(sg,C,3,.7,.86,.5,.1,3,'#b8b2a4','#948e80','#c8c2b4');
      for(const u of[.36,.42,.62]){const q=Z(u,.82,3);prism(sg,q[0],q[1],3,2,4,'#b08a5a','#8a6a42','#c8a070');}
    });
    layer(M,sg=>{ // 鐵路棚車
      const bc=tprism(sg,C,3,.56,.965,.32,.08,11,'#8a4a36','#6a3628','#5e4034');
      fw(sg,bc,-1,12,1,7,9,'#5a2e22');fw(sg,bc,-1,3,-1,2,2,'#2a2622');fw(sg,bc,-1,2*bc.L-5,-1,2,2,'#2a2622');
    });
    save('57_1_2',M,ax,ay,{mat:'I',k:57,seed:2});
  });
});
