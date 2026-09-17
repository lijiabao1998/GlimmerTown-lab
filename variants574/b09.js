(window.__variants574=window.__variants574||[]).push(function b09(A){
  const SPR=A.SPR(), B=SPR.bld;
  const cv=A.cv, shade=A.shade, HL=A.hashLocal479;
  /* ============ b09 共用工具（農業住宿與回收）============
     全部整數像素；零共用亂數（只用 A.metroRand516('v574:'+k+':'+v)）。
     本批 v0 多為「正立面＋右側暗條」的前視畫法，變體沿用同一語彙：左亮右暗、頂緣受光、同色系外框。 */
  const put=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  function poly(g,pts,col){ // 掃描線多邊形（硬邊）
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
  function mound(g,cx,by,rx,ry,C){ // 上半橢圓堆（by＝底線）C=[頂亮,主,底暗]
    for(let y=Math.floor(by-ry);y<by;y++){
      const dy=(by-(y+.5))/ry;if(dy>1)continue;
      const hw=rx*Math.sqrt(1-dy*dy),xa=Math.round(cx-hw),xb=Math.round(cx+hw);if(xb<=xa)continue;
      g.fillStyle=dy>.62?C[0]:dy>.2?C[1]:C[2];g.fillRect(xa,y,xb-xa,1);
      g.fillStyle=shade(C[1],-14);g.fillRect(xb-Math.max(1,Math.round((xb-xa)*.28)),y,Math.max(1,Math.round((xb-xa)*.28)),1);
    }
  }
  // 直立圓柱（前視 3/4）：cy＝底橢圓中心；C=[亮,中,暗]；top＝頂橢圓色
  function cylV(g,cx,cy,r,h,C,top,ryK){
    const ry=r*(ryK||.5);
    for(let x=Math.round(cx-r);x<Math.round(cx+r);x++){
      const dx=(x+.5-cx)/r;if(Math.abs(dx)>1)continue;
      const yb=Math.round(cy+ry*Math.sqrt(1-dx*dx)),yt=Math.round(cy-h);
      g.fillStyle=dx<-.35?C[0]:dx<.35?C[1]:C[2];g.fillRect(x,yt,1,yb-yt);
    }
    if(top)ell(g,cx,cy-h,r,ry,top);
  }
  function modeColor(img,x0,y0,w,h,fb){ // 取 v0 地塊實際色（眾數，避開顆粒）
    try{const d=img.getContext('2d').getImageData(x0,y0,w,h).data,m=new Map();let best=-1,bn=0;
      for(let i=0;i<d.length;i+=4){if(d[i+3]<250)continue;const key=(d[i]<<16)|(d[i+1]<<8)|d[i+2],n=(m.get(key)||0)+1;m.set(key,n);if(n>bn){bn=n;best=key;}}
      return best<0?fb:'#'+best.toString(16).padStart(6,'0');}catch(e){return fb;}
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
  function polishFull(c,o){
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
  function material(c,o){
    const g=c.getContext('2d'),w=o.w0,h=o.h0,k=o.k,seed=479000+k*17+((k+'_1_0').length*13);
    g.save();g.translate(o.pl,o.pt);g.globalCompositeOperation='source-atop';
    const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,236,194,.075)');gr.addColorStop(.52,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(28,35,43,.10)');
    g.fillStyle=gr;g.fillRect(-o.pl,-o.pt,c.width,c.height);
    const dens=Math.min(360,Math.max(10,Math.floor(w*h/520))),cols=['rgba(255,238,202,.09)','rgba(40,46,52,.075)','rgba(143,123,99,.065)'];
    for(let i=0;i<dens;i++){const x=Math.floor(HL(seed,i,47901)*w),y=Math.floor(HL(seed,i,47902)*h),rw=HL(seed,i,47903)<.74?1:2,rh=HL(seed,i,47904)<.88?1:2;
      g.fillStyle=cols[Math.floor(HL(seed,i,47905)*cols.length)%cols.length];g.fillRect(x,y,rw,rh);}
    const tint=g.createLinearGradient(0,h*.28,w,h*.92);
    tint.addColorStop(0,'rgba(222,213,190,.035)');tint.addColorStop(1,'rgba(43,49,54,.07)');
    g.fillStyle=tint;g.fillRect(-o.pl,-o.pt,c.width,c.height);
    const y0=Math.floor(h*.36),y1=Math.floor(h*.86);
    g.strokeStyle='rgba(68,62,55,.075)';g.lineWidth=1;
    for(let y=y0;y<y1;y+=8){const off=Math.floor(HL(k,y,47941)*5);g.beginPath();g.moveTo(Math.floor(w*.22)+off,y);g.lineTo(Math.floor(w*.78)-off,y);g.stroke();}
    const ao=g.createLinearGradient(0,h*.72,0,h);ao.addColorStop(0,'rgba(25,28,30,0)');ao.addColorStop(1,'rgba(20,23,25,.13)');
    g.fillStyle=ao;g.fillRect(-o.pl,Math.floor(h*.70),c.width,Math.ceil(h*.30)+2);
    g.restore();
  }
  function ellipseAtop(c,o){
    const g=c.getContext('2d'),sc=Math.max(.6,Math.min(3,o.w0/72));
    g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(10,14,24,.16)';
    g.beginPath();g.ellipse(o.ax+8*sc,o.ay-6*sc,30*sc,12*sc,0,0,6.283);g.fill();g.restore();
  }
  // ---- 畫布 ----
  function fresh(k){ // redraw：同尺寸同錨點空白畫布（sg＝結構層）
    const s0=B[k+'_1_0'],[c,g]=cv(s0.w,s0.h),[nc,ng]=cv(s0.w,s0.h),[sc,sg]=cv(s0.w,s0.h);
    return {k,s0,c,g,nc,ng,sc,sg,w:s0.w,h:s0.h,w0:s0.w,h0:s0.h,pl:0,pt:0,ax:s0.ax,ay:s0.ay};
  }
  function base(k,pl,pt,pr){ // compose：以最終 v0 為底
    pl=pl||0;pt=pt||0;pr=pr||0;const s0=B[k+'_1_0'],w=s0.w+pl+pr,h=s0.h+pt;
    const [c,g]=cv(w,h),[nc,ng]=cv(w,h),[sc,sg]=cv(w,h);g.drawImage(s0.img,pl,pt);if(s0.night)ng.drawImage(s0.night,pl,pt);
    return {k,s0,c,g,nc,ng,sc,sg,w,h,w0:s0.w,h0:s0.h,pl,pt,ax:s0.ax+pl,ay:s0.ay+pt};
  }
  function plate(o,hw,col){const ty=o.ay-hw;A.dia(o.g,o.ax,ty,hw,col);A.diaEdge(o.g,6,shade(col,-14),o.ax,ty,hw);A.diaEdge(o.g,9,shade(col,10),o.ax,ty,hw);}
  function finishFresh(o,ol){A.outlineSprite(o.sc,ol[0],ol[1],ol[2]);o.g.drawImage(o.sc,0,0);polishFull(o.c,o);material(o.c,o);}
  function commit(o,ol){ // compose：新部件外框→同式後製→蓋上；夜圖先挖掉被遮住的 v0 燈
    A.outlineSprite(o.sc,ol[0],ol[1],ol[2]);ellipseAtop(o.sc,o);grainBands(o.sc,o.pl,o.pt,o.h0);material(o.sc,o);
    o.ng.save();o.ng.globalCompositeOperation='destination-out';o.ng.drawImage(o.sc,0,0);o.ng.restore();
    o.g.drawImage(o.sc,0,0);
  }
  function save(o,v){B[o.k+'_1_'+v]={img:o.c,night:o.s0.night?o.nc:undefined,ax:o.ax,ay:o.ay,w:o.w,h:o.h,smoke:[]};}
  const RK=(k,v)=>A.metroRand516('v574:'+k+':'+v);
  const safe=(k,fn)=>{try{if(B[k+'_1_0'])fn();}catch(e){console.error('v574 k'+k,e);}};
  const cdist=(a,b)=>{const p=parseInt(a.slice(1),16),q=parseInt(b.slice(1),16);return Math.abs((p>>16)-(q>>16))+Math.abs(((p>>8)&255)-((q>>8)&255))+Math.abs((p&255)-(q&255));};
  // 地塊色：v0 左角/右角各取眾數，挑最接近生成色票者（避開 v0 地面雜物與投影橢圓）
  function plateCol(o,ref,pts){let best=ref,bd=70;
    for(const p of pts){const c=modeColor(o.s0.img,p[0],p[1],p[2],p[3],ref),d=cdist(c,ref);if(d<bd){bd=d;best=c;}}
    return best;}
  const plate1=(o,ref)=>plateCol(o,ref,[[o.ax-24,o.ay-18,6,3],[o.ax+25,o.ay-17,4,2]]);
  // 前視小窗：玻璃＋上框；lit＝夜光色
  function win(g,ng,x,y,w,h,glass,frame,lit){put(g,x,y,w,h,glass);put(g,x,y,w,1,frame);if(ng&&lit){ng.fillStyle=lit;ng.fillRect(x,y+1,w,h-1);}}
  // 梯形逐列（屋頂前坡）：底列 yB-1 的左右界 xl0..xr0，頂列 yT 的左右界 xl1..xr1；每 step 列一條暗線
  function trapRows(g,xl0,xr0,yB,xl1,xr1,yT,col,lineCol,step){
    const n=Math.max(1,yB-1-yT);
    for(let y=yT;y<yB;y++){const t=(yB-1-y)/n,xa=Math.round(xl0+(xl1-xl0)*t),xb=Math.round(xr0+(xr1-xr0)*t);
      put(g,xa,y,xb-xa,1,(lineCol&&step&&((yB-1-y)%step===step-1))?lineCol:col);}
  }
  // 拱窗（前視）：頂一格收圓；lit＝夜光
  function archWin(g,ng,x,y,w,h,glass,trim,lit){
    if(trim){put(g,x-1,y-1,w+2,1,trim);put(g,x-1,y+h,w+2,1,trim);}
    put(g,x+1,y,Math.max(1,w-2),1,glass);put(g,x,y+1,w,h-1,glass);
    if(ng&&lit){ng.fillStyle=lit;ng.fillRect(x+1,y,Math.max(1,w-2),1);ng.fillRect(x,y+1,w,h-1);}
  }
  function lit(ng,x,y,w,h,col){if(!ng)return;ng.fillStyle=col;ng.fillRect(x,y,w,h);}

  /* =================== k70 風車（1×1） =================== */
  safe(70,()=>{
    const OL=[40,30,20];
    // v1：石砌塔式磨坊（胖）——圓錐收分石塔＋木帽＋X 字格柵風帆＋左側磨坊工小屋
    {const o=fresh(70),g=o.sg,ng=o.ng;
      plate(o,32,'#9a9484');
      // 工寮（在塔左後）
      put(g,5,84,14,10,'#e8dcc0');put(g,5,84,14,1,'#f2e8d0');
      poly(g,[[3,85],[12,77],[22,85]],'#8a5a3a');seg(g,4,84,11,77,'#a8704a');
      win(g,ng,8,87,4,4,'#7fb0d8','#5a4a38','#ffd98a');
      // 塔身（收分）
      for(let y=46;y<91;y++){const t=(90-y)/44,hw=Math.round(15-5*t);
        for(let x=36-hw;x<36+hw;x++){const u=(x-(36-hw))/(2*hw);
          let col=u<.34?'#d2c8b4':u<.7?'#bdb29c':'#958a76';
          if((90-y)%7===3)col=shade(col,-12);
          put(g,x,y,1,1,col);}}
      // 石基座
      for(let y=88;y<96;y++){const hw=17;put(g,36-hw,y,11,1,'#a0907a');put(g,36-hw+11,y,13,1,'#8a7a66');put(g,36+hw-10,y,10,1,'#6e604e');}
      put(g,19,88,34,1,'#b4a48c');
      // 木帽（半球）＋頂飾
      for(let y=34;y<46;y++){const dy=(46-y)/12,hw=Math.round(13*Math.sqrt(Math.max(0,1-dy*dy)));
        put(g,36-hw,y,Math.ceil(hw*.7),1,'#86704e');put(g,36-hw+Math.ceil(hw*.7),y,Math.round(hw*.8),1,'#6b5a3e');
        const rx=36-hw+Math.ceil(hw*.7)+Math.round(hw*.8);put(g,rx,y,36+hw-rx,1,'#4e4030');}
      put(g,23,46,26,2,'#5a4a2e');put(g,23,46,10,1,'#7a6444');
      put(g,35,30,2,4,'#5a4a2e');put(g,34,29,4,1,'#6b5a3e');
      // 門（拱）＋台階＋小窗
      put(g,32,81,8,14,'#4a3b2c');put(g,33,80,6,1,'#4a3b2c');put(g,34,79,4,1,'#4a3b2c');put(g,33,82,6,13,'#3a2b1c');
      put(g,31,95,10,1,'#b8b0a0');
      put(g,35,61,3,5,'#2c3e4e');put(g,36,60,1,1,'#2c3e4e');put(g,34,66,5,1,'#b8b0a0');
      ng.fillStyle='#ffcc66';ng.fillRect(35,61,3,5);
      // X 字風帆（兩面布帆、兩面格柵）
      const H=[36,41];
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach((d,i)=>{
        const p=[-d[1],d[0]],P=(t,q)=>[H[0]+d[0]*t+p[0]*q,H[1]+d[1]*t+p[1]*q];
        if(i%2===0)poly(g,[P(9,1.5),P(26,1.5),P(26,5.5),P(9,5.5)],'#e0d4bc');
        const a=P(9,5.5),b=P(26,5.5);seg(g,a[0],a[1],b[0],b[1],'#6b5a3e');
        for(const t of[9,15,21,26]){const s1=P(t,1),s2=P(t,5.5);seg(g,s1[0],s1[1],s2[0],s2[1],'#7a6444');}
        for(let t=3;t<=28;t++){const q=P(t,0);put(g,q[0],q[1],2,1,'#5c4a36');}
      });
      put(g,34,39,4,4,'#3a2e22');put(g,35,40,2,2,'#8b7355');
      finishFresh(o,OL);save(o,1);}
    // v2：美式抽水風車（高瘦）——鋼格構塔＋多葉風輪＋尾舵＋木水槽＋馬燈
    {const o=fresh(70),g=o.sg,ng=o.ng;
      plate(o,32,'#9a9484');
      const xl=y=>Math.round(21+(96-y)*11/68),xr=y=>Math.round(47-(96-y)*11/68);
      // 抽水管
      put(g,34,30,1,58,'#5a5e66');put(g,34,87,16,2,'#6a6e76');
      // 塔腳
      for(let y=28;y<97;y++){put(g,xl(y),y,2,1,'#a8acb4');put(g,xr(y)-1,y,2,1,'#6a6e76');}
      for(const yy of[84,68,52,38])seg(g,xl(yy)+2,yy,xr(yy)-2,yy,'#7a7e86');
      for(const [y1,y2] of[[84,68],[52,38]]){seg(g,xl(y1)+2,y1,xr(y2)-2,y2,'#7a7e86');seg(g,xr(y1)-2,y1,xl(y2)+2,y2,'#7a7e86');}
      put(g,17,96,6,1,'#8a8478');put(g,45,96,6,1,'#8a8478');
      // 平台＋機頭
      put(g,27,28,14,2,'#8a6a42');put(g,27,28,14,1,'#a8865a');
      put(g,32,20,7,8,'#5a5e66');put(g,32,20,3,8,'#7a7e86');
      // 尾舵
      seg(g,38,22,56,19,'#6a6e76');
      poly(g,[[53,12],[66,14],[66,25],[53,23]],'#a8483a');put(g,53,13,1,10,'#c86a58');seg(g,54,22,65,15,'#7a3428');
      // 風輪（斜 3/4，扇葉明暗交錯）
      {const cx=29,cy=21,rx=9,ry=13;
        for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){
          const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry,r=Math.sqrt(nx*nx+ny*ny);if(r>1)continue;
          let col;if(r<.24)col='#3a3e46';else if(r>.88)col='#6a6e76';
          else{const a=Math.atan2(ny,nx),s=Math.floor((a+Math.PI)/(2*Math.PI)*16);col=(s&1)?'#8e949c':'#d0d4da';if(r<.36)col='#5a5e66';}
          put(g,x,y,1,1,col);}}
      // 木水槽
      {const cx=57,cy=94,r=8;
        cylV(g,cx,cy,r,13,['#a8865a','#8a6a42','#6a5032'],'#9a7a50');
        put(g,cx-r,86,2*r,1,'#4a3a2a');put(g,cx-r,91,2*r,1,'#4a3a2a');
        ell(g,cx,cy-13,r-2,3,'#5fb0c8');put(g,cx-4,cy-14,3,1,'#8fd0e0');}
      // 馬燈柱
      put(g,12,80,2,15,'#5a4a38');put(g,11,76,4,4,'#3a3026');put(g,12,77,2,2,'#e8d8a0');
      ng.fillStyle='#ffcc66';ng.fillRect(12,77,2,2);ng.fillStyle='rgba(255,204,102,.35)';ng.fillRect(11,76,4,4);
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k88 堆肥場（1×1） =================== */
  safe(88,()=>{
    const OL=[58,66,38],CP=['#86683f','#5a4430','#4a3a26'];
    // v1：三格堆肥棚——低矮鋼棚下三格混凝土隔間（生／熟／成品三堆）＋前場條垛＋小鏟裝機
    {const o=fresh(88),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#8f7f5e'));
      // 棚內後牆＋地坪
      put(g,10,64,48,20,'#6a5c4a');for(let x=14;x<58;x+=6)put(g,x,64,1,20,'#5e5242');
      put(g,10,84,48,6,'#57493a');
      // 三格隔間牆＋三堆（熟度不同色）
      for(const x of[25,42]){put(g,x,76,3,14,'#bcb8ac');put(g,x,76,3,1,'#d8d4c8');put(g,x+2,77,1,13,'#9a968a');}
      mound(g,18,90,7,9,['#9a8a4c','#6e6436','#56502c']);mound(g,35,90,7,7,['#8a6a40','#634c32','#4e3c28']);mound(g,50,90,6,10,['#7a5a3a','#54402a','#403022']);
      put(g,15,84,2,1,'#7a9a4a');put(g,19,86,2,1,'#7a9a4a');
      // 右牆（暗）
      put(g,58,60,7,30,'#7a8088');for(let x=60;x<65;x+=3)put(g,x,61,1,29,'#6a7078');
      // 柱
      for(const x of[10,56]){put(g,x,64,2,26,'#7a6a52');put(g,x,64,1,26,'#9a8a6e');}
      // 屋頂（前斜面＋右端暗）
      put(g,6,56,54,8,'#a8aeb6');put(g,60,56,6,8,'#848a92');put(g,6,56,60,1,'#c4cad0');
      for(let x=9;x<60;x+=4)put(g,x,57,1,7,'#8e949c');
      put(g,6,64,60,1,'#6a7078');
      // 吊燈
      put(g,33,65,3,1,'#2a2a2a');put(g,33,66,3,2,'#e8e0c0');ng.fillStyle='#ffe9b0';ng.fillRect(33,66,3,2);
      // 前場條垛
      mound(g,28,101,12,6,CP);put(g,22,97,2,1,'#6a8a4a');put(g,32,96,2,1,'#6a8a4a');
      // 小鏟裝機（鏟斗朝左插進條垛）
      put(g,46,88,11,8,'#e0a83a');put(g,46,88,11,1,'#f0c060');put(g,54,88,3,8,'#b07a20');
      put(g,48,81,6,7,'#e0a83a');put(g,49,82,4,3,'#5a7a90');put(g,48,81,6,1,'#f0c060');
      put(g,42,91,4,2,'#c89030');put(g,38,93,5,4,'#5a5e66');put(g,38,93,5,1,'#8a8e96');
      put(g,46,96,4,3,'#26282c');put(g,53,96,4,3,'#26282c');
      finishFresh(o,OL);save(o,1);}
    // v2：臥式轉鼓堆肥機——綠色轉鼓＋進料斗＋出料堆＋成品袋棧板＋控制箱燈
    {const o=fresh(88),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#8f7f5e'));
      // 底座滑軌＋支架
      put(g,16,88,36,2,'#6a6a72');put(g,16,88,36,1,'#8a8a92');
      for(const x of[22,43]){put(g,x-2,72,2,16,'#7a7a82');put(g,x+3,72,2,16,'#5a5a62');put(g,x-2,80,7,1,'#6a6a72');}
      // 轉鼓
      for(let y=54;y<75;y++){const v=(y+.5-64.5)/10.5;put(g,19,y,32,1,v<-.5?'#86ac66':v<.1?'#5e8a4a':v<.6?'#4c7640':'#3c5e34');}
      for(const x of[27,35,43]){put(g,x,54,1,21,'#34502e');put(g,x-1,54,1,21,'#9aba7a');}
      ell(g,19,64.5,3,10.5,'#9aba7a');put(g,18,63,2,2,'#3c5e34');
      put(g,50,56,1,17,'#34502e');
      // 進料斗
      poly(g,[[10,40],[29,40],[24,50],[15,50]],'#9aa0a8');put(g,10,40,19,1,'#c0c6ce');poly(g,[[24,40],[29,40],[24,50],[22,50]],'#7a8088');
      put(g,17,50,5,5,'#7a8088');put(g,17,50,2,5,'#9aa0a8');
      // 馬達箱＋出料口
      put(g,51,59,6,9,'#c8ccd4');put(g,55,59,2,9,'#9a9ea6');put(g,52,70,3,5,'#7a8088');
      // 出料堆
      mound(g,52,94,9,7,CP);
      // 控制箱燈（箱在堆後）
      put(g,60,68,1,22,'#5a5a62');put(g,58,62,5,6,'#d0d4da');put(g,59,64,3,2,'#2a3a4a');put(g,58,60,5,2,'#e8e0c0');put(g,58,59,5,1,'#3a3a42');
      ng.fillStyle='#ffe9b0';ng.fillRect(58,60,5,2);ng.fillStyle='#7be08a';ng.fillRect(59,64,1,1);
      // 成品袋棧板
      put(g,10,95,17,2,'#8a6a42');
      for(const [x,y] of[[10,90],[15,90],[20,90],[13,86],[18,86]]){put(g,x,y,5,y===90?5:4,'#c8a060');put(g,x,y,5,1,'#e0c080');put(g,x+4,y,1,y===90?5:4,'#a88040');}
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k104 社區菜園（1×1） =================== */
  safe(104,()=>{
    const OL=[52,68,42];
    // v1：拱棚＋平地木框畦＋藤架拱門（掛燈）
    {const o=fresh(104),g=o.sg,ng=o.ng;plate(o,32,plate1(o,"#8f9a5e"));
      // 塑膠拱棚（側面長向）
      put(g,14,78,34,10,'#dde6e8');put(g,15,71,32,7,'#eef3f4');put(g,16,70,30,1,'#f8fbfb');put(g,14,72,1,6,'#e6eef0');put(g,47,72,1,6,'#e6eef0');
      for(let x=20;x<48;x+=6)put(g,x,70,1,18,'#aab8be');
      put(g,14,87,34,2,'#8a6a42');
      for(const x of[18,30,40])put(g,x,83,2,2,'#8fb88a');
      poly(g,[[48,70],[52,71],[55,74],[56,78],[56,89],[48,89]],'#c2ccd0');put(g,50,80,4,9,'#8e9ca2');put(g,48,70,1,19,'#aab8be');
      // 木框畦 ×2
      put(g,14,89,18,2,'#5a4030');put(g,14,91,18,6,'#7a5c3a');put(g,14,91,18,1,'#9a7a50');
      for(const x of[16,21,26])put(g,x,86,2,3,'#6aaa48'),put(g,x,86,2,1,'#8ac860');
      put(g,28,95,22,2,'#5a4030');put(g,28,97,22,5,'#7a5c3a');put(g,28,97,22,1,'#9a7a50');
      for(const x of[30,36,42,47])put(g,x,91,2,4,'#5a9a3a');
      put(g,31,92,1,1,'#e05252');put(g,43,91,1,1,'#e05252');
      // 藤架拱門
      put(g,54,76,2,20,'#8a6a42');put(g,62,76,2,20,'#7a5c3a');
      for(let x=54;x<64;x++){const dx=(x+.5-59)/5,y=76-Math.round(5*Math.sqrt(Math.max(0,1-dx*dx)));put(g,x,y,1,2,'#8a6a42');}
      for(const [x,y] of[[53,80],[56,72],[61,71],[63,79],[53,88],[63,86]])put(g,x,y,2,2,'#4e9a4e');
      put(g,54,84,1,1,'#e05a72');put(g,62,74,1,1,'#e05a72');
      put(g,58,73,2,1,'#3a3026');put(g,58,74,2,2,'#e8d8a0');
      ng.fillStyle='#ffe9b0';ng.fillRect(58,74,2,2);
      finishFresh(o,OL);save(o,1);}
    // v2：棚架休憩角＋高架雨水塔＋向日葵＋生菜畦
    {const o=fresh(104),g=o.sg,ng=o.ng;plate(o,32,plate1(o,"#8f9a5e"));
      // 雨水塔
      put(g,46,44,2,48,'#8a6a42');put(g,58,44,2,48,'#7a5c3a');
      seg(g,48,48,57,86,'#7a5c3a');seg(g,57,48,48,86,'#7a5c3a');
      put(g,44,42,16,2,'#9a7a50');
      cylV(g,52,41,8,13,['#6a9a74','#4e7a5a','#3a5e46'],'#5a8a66',.4);
      put(g,44,33,16,1,'#35523f');put(g,44,38,16,1,'#35523f');put(g,50,26,4,2,'#3a5e46');
      put(g,44,44,1,26,'#6a6e76');put(g,43,70,3,2,'#6a6e76');
      // 棚架
      put(g,8,62,2,30,'#9a7a50');put(g,30,62,2,30,'#8a6a42');
      put(g,6,60,30,2,'#8a6a42');put(g,6,60,30,1,'#a8865a');
      for(const x of[10,17,24,31])put(g,x,58,1,2,'#8a6a42');
      ell(g,13,58,4,2.6,'#4e9a4e');ell(g,23,57.5,5,2.6,'#5aa854');ell(g,32,59,3,2,'#4e9a4e');
      put(g,15,61,1,2,'#7a4a8a');put(g,25,61,1,2,'#7a4a8a');put(g,9,64,1,6,'#4e9a4e');
      put(g,14,79,13,2,'#b08a5a');put(g,15,81,1,6,'#8a6a42');put(g,25,81,1,6,'#8a6a42');
      for(const x of[12,20,28]){put(g,x,62,1,1,'#f0e8c8');ng.fillStyle='#ffe9b0';ng.fillRect(x,62,1,2);}
      // 生菜畦
      put(g,18,93,26,2,'#5a4030');put(g,18,95,26,5,'#7a5c3a');put(g,18,95,26,1,'#9a7a50');
      for(let i=0;i<4;i++)put(g,20+i*6,90,3,3,i&1?'#5ec86a':'#7be08a');
      // 向日葵
      put(g,48,80,1,16,'#4e8a3a');put(g,53,84,1,12,'#4e8a3a');put(g,49,88,2,1,'#5a9a3a');put(g,51,91,2,1,'#5a9a3a');
      const sunf=(x,y,Y)=>{put(g,x+1,y,3,1,Y);put(g,x,y+1,5,2,Y);put(g,x+1,y+3,3,1,shade(Y,-24));put(g,x+2,y+1,1,2,'#6a4a2a');};
      sunf(46,76,'#e8c030');sunf(51,80,'#f0c840');put(g,46,84,2,1,'#5a9a3a');put(g,54,88,2,1,'#5a9a3a');
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k120 魚塘（1×1） =================== */
  safe(120,()=>{
    const OL=[52,66,58];
    // v1：落地土岸方塘＋高腳看護屋＋葉輪增氧機＋網箱框＋蘆葦
    {const o=fresh(120),g=o.sg,ng=o.ng;plate(o,32,plate1(o,"#8f9a7e"));
      A.dia(g,36,80,28,'#7a6a4a');A.dia(g,36,82,24,'#3f8fa8');
      put(g,20,92,6,1,'#6fc0d8');put(g,40,99,5,1,'#6fc0d8');put(g,48,88,4,1,'#6fc0d8');
      // 蘆葦
      put(g,10,88,1,5,'#5a8a3a');put(g,12,86,1,7,'#4e7a32');put(g,14,89,1,4,'#5a8a3a');put(g,12,85,1,1,'#8a6a42');
      // 網箱框
      seg(g,50,91,56,94,'#8a6a42');seg(g,56,94,50,97,'#8a6a42');seg(g,50,97,44,94,'#8a6a42');seg(g,44,94,50,91,'#8a6a42');
      // 高腳屋
      for(const x of[29,36,43])put(g,x,76,1,14,'#6a5a42');
      put(g,25,74,24,2,'#a8865a');put(g,25,76,24,1,'#7a5c3a');
      put(g,28,62,14,12,'#d9c4a0');put(g,42,62,5,12,'#b8a07e');
      win(g,ng,31,65,4,4,'#7fb0d8','#5a4a38','#ffd98a');put(g,37,66,4,8,'#5a3a24');
      poly(g,[[26,62],[35,53],[44,62]],'#8a5a3a');poly(g,[[44,62],[35,53],[49,59]],'#6a4229');seg(g,27,61,34,54,'#a8704a');
      put(g,47,70,1,4,'#6a5a42');put(g,46,68,3,2,'#3a3026');put(g,47,69,1,1,'#e8d8a0');
      ng.fillStyle='#ffe9b0';ng.fillRect(46,68,3,2);
      // 葉輪增氧機
      put(g,22,98,11,2,'#e0e4e8');put(g,22,99,11,1,'#a8acb4');
      for(let y=91;y<98;y++)for(let x=24;x<31;x++){const dx=x+.5-27.5,dy=y+.5-94.5,r=Math.sqrt(dx*dx+dy*dy);if(r<=3.6&&r>=2.4)put(g,x,y,1,1,'#c8ccd4');}
      put(g,27,94,1,1,'#5a5e66');put(g,21,97,1,1,'#e8f4f8');put(g,33,96,1,1,'#e8f4f8');put(g,29,101,2,1,'#e8f4f8');
      finishFresh(o,OL);save(o,1);}
    // v2：育苗場——三座大圓形養殖池占滿前半塊地（等距 2×2 佈局：左/右/前三池），矮孵化棚退到後角，小水塔躲在棚後
    {const o=fresh(120),g=o.sg,ng=o.ng;plate(o,32,plate1(o,"#8f9a7e"));
      const WAT='#3f8fa8',WL='#6fc0d8',FISH='#285a6c';
      // 小水箱（縮小，躲在棚屋頂右後方，短腳落在屋頂後）
      put(g,41,70,1,5,'#6e727a');put(g,48,70,1,5,'#5e626a');put(g,41,73,8,1,'#5e626a');
      cylV(g,45,70,4,4,['#c8ccd4','#a8acb4','#888c94'],'#dde0e6',.4);put(g,41,68,8,1,'#8a8e96');
      // 矮孵化棚（後角）：正立面＋右側暗條＋藍色浪板屋頂
      put(g,26,79,16,8,'#d8d4c8');put(g,42,79,6,8,'#b4b0a4');
      put(g,24,75,20,4,'#4a78a8');put(g,44,75,6,4,'#3a5e88');put(g,24,75,26,1,'#6a98c8');
      for(let x=26;x<44;x+=3)put(g,x,76,1,3,'#3e6a98');
      put(g,24,79,26,1,'#2e4e70');
      put(g,28,81,4,6,'#6a7a88');put(g,28,81,1,6,'#8a9aa8');
      win(g,ng,34,81,3,3,'#7fb0d8','#5a6a78','#ffd98a');win(g,ng,38,81,3,3,'#7fb0d8','#5a6a78','#ffd98a');
      // 大圓池：低矮混凝土池緣（2px）＋薄環＋內壁一線＋水面（上緣受光、魚影）
      const tank=(cx,cy,fish)=>{
        const h=2,rx=10.5,ry=5.25,ty=cy-h,irx=9.5,iry=4.75;
        cylV(g,cx,cy,rx,h,['#b4b0a8','#a09c94','#84807a'],null,.5);
        ell(g,cx,ty,rx,ry,'#c8c4bc');
        const inE=(x,y,oy)=>{const dx=(x+.5-cx)/irx,dy=(y+.5-ty-oy)/iry;return dx*dx+dy*dy<=1;};
        for(let y=Math.floor(ty-ry);y<=Math.ceil(ty+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
          if(!inE(x,y,0))continue;
          if(!inE(x,y,1)){put(g,x,y,1,1,'#6e6c66');continue;}
          put(g,x,y,1,1,inE(x,y-1,1)?WAT:WL);
        }
        put(g,cx-rx,ty,1,1,'#e2ded6');put(g,cx-rx+1,ty-2,2,1,'#e2ded6'); // 池緣左側受光
        for(const [fx,fy] of fish){put(g,cx+fx,ty+fy,2,1,FISH);put(g,cx+fx+2,ty+fy,1,1,shade(FISH,14));}
        put(g,cx+2,ty-1,3,1,WL);put(g,cx-5,ty+2,1,1,'#e8f4f8');
      };
      tank(20,94,[[-4,0],[1,2]]);
      tank(52,94,[[-3,1],[3,-1]]);
      tank(36,102,[[-5,1],[0,-1],[3,2]]);
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k81 民宿（1×1） =================== */
  safe(81,()=>{
    const OL=[60,48,32],LT='#ffd98a',GL='#7fb0d8';
    // v1：農舍民宿（低胖）——側山牆長屋＋雙老虎窗＋通長木遊廊＋石徑
    {const o=fresh(81),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#9aa07e'));
      const W='#e8d0a8',WS='#c8b088',RF='#8a5a3a',RD='#6a4229',RL='#a8704a',WD='#7a5a3a',WL='#9a7a50';
      put(g,50,70,10,24,WS);put(g,8,70,42,24,W);
      put(g,8,91,42,3,'#b0a088');put(g,50,91,10,3,'#8e806a'); // 石勒腳
      poly(g,[[50,71],[55,54],[61,65],[61,71]],shade(WS,-6));seg(g,56,55,60,64,RD); // 側山牆端
      trapRows(g,6,52,71,11,57,54,RF,shade(RF,-12),3); // 前坡
      put(g,11,54,46,1,RL);seg(g,51,70,56,55,RD);
      put(g,43,46,4,9,'#9a6a4a');put(g,43,46,1,9,'#b88660');put(g,42,44,6,2,RD); // 煙囪
      for(const dx of[16,35]){ // 老虎窗
        put(g,dx+2,61,7,7,W);put(g,dx+9,61,2,7,WS);
        poly(g,[[dx,62],[dx+5.5,55],[dx+11,62]],RF);poly(g,[[dx+11,62],[dx+5.5,55],[dx+7,55],[dx+12,61]],RD);seg(g,dx,61,dx+5,56,RL);
        archWin(g,ng,dx+4,63,3,4,GL,null,LT);put(g,dx+3,67,5,1,'#f0e0c0');}
      // 遊廊
      put(g,6,76,46,1,RL);put(g,6,77,46,2,RF);put(g,8,79,42,1,shade(W,-26));
      for(const px of[8,21,35,48]){put(g,px,79,2,13,WD);put(g,px,79,1,13,WL);}
      put(g,27,80,6,12,'#5a3a24');put(g,28,81,4,5,'#6e4a30');put(g,31,86,1,1,'#c8a878');lit(ng,28,81,4,10,LT);
      for(const wx of[13,40]){put(g,wx-1,81,8,7,'#5a4a38');put(g,wx,82,6,5,GL);put(g,wx+3,82,1,5,'#5a4a38');lit(ng,wx,82,6,5,LT);
        put(g,wx-1,88,8,2,'#6a8a4a');put(g,wx,88,1,1,'#c85a68');put(g,wx+4,88,1,1,'#e0a040');}
      put(g,29,79,2,1,'#f0e0a0');ng.fillStyle='rgba(255,220,120,.5)';ng.fillRect(27,79,6,2);
      put(g,7,92,44,2,'#a88458');put(g,7,92,44,1,'#c0a070'); // 木台
      put(g,51,75,1,1,'#3a3026');put(g,52,73,7,6,'#3f8f8f');put(g,53,74,5,4,'#eef4ee');put(g,54,75,3,1,'#3f8f8f'); // 青招牌
      put(o.g,28,96,4,2,'#b8b0a0');put(o.g,31,99,4,2,'#b8b0a0');
      finishFresh(o,OL);save(o,1);}
    // v2：維多利亞塔樓民宿（高瘦）——圓塔錐頂＋孟莎屋頂老虎窗＋凸窗＋門廊＋吊牌
    {const o=fresh(81),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#9aa07e'));
      const W='#b8d0c4',WS='#94aca0',TR='#f0e8d8',RF='#5a5e70',RD='#44475a',RL='#767a8c',GD='#c8b060';
      put(g,44,56,8,38,WS);put(g,20,56,24,38,W);
      for(let y=59;y<91;y+=4)put(g,20,y,24,1,shade(W,-8));
      put(g,20,74,24,1,TR);put(g,44,74,8,1,shade(TR,-40));
      poly(g,[[46,57],[54,52],[46,38],[39,40]],RD);
      trapRows(g,18,46,57,26,39,40,RF,shade(RF,-10),3);put(g,26,39,13,1,RL);put(g,26,37,1,2,GD);put(g,38,37,1,2,GD);
      put(g,29,46,7,8,W);poly(g,[[27,47],[32.5,40],[38,47]],RL);archWin(g,ng,31,48,3,5,GL,null,LT);put(g,30,53,5,1,TR);
      for(const wx of[25,35])archWin(g,ng,wx,61,4,8,GL,TR,LT);
      // 門廊＋門
      put(g,21,77,11,2,TR);put(g,21,79,1,13,TR);put(g,31,79,1,13,TR);
      put(g,24,81,5,11,'#6a3a2a');put(g,25,80,3,1,'#6a3a2a');lit(ng,25,82,3,6,LT);
      put(g,26,79,1,1,'#f0e0a0');ng.fillStyle='rgba(255,220,120,.55)';ng.fillRect(25,79,3,2);
      // 凸窗
      put(g,33,80,11,13,W);put(g,32,78,13,2,RF);put(g,32,78,13,1,RL);
      put(g,35,83,7,6,GL);put(g,37,83,1,6,TR);put(g,40,83,1,6,TR);put(g,34,89,9,1,TR);lit(ng,35,83,2,6,LT);lit(ng,38,83,2,6,LT);
      put(g,22,92,9,2,'#b8b0a0');
      // 圓塔
      cylV(g,16,92,6,42,[shade(W,12),W,WS],null,.5);
      put(g,10,74,6,1,TR);put(g,16,74,6,1,shade(TR,-30));
      poly(g,[[9,51],[16,26],[16,51]],RF);poly(g,[[16,51],[16,26],[23,51]],RD);put(g,9,50,14,2,RD);put(g,9,50,7,1,RL);
      put(g,16,22,1,4,GD);
      archWin(g,ng,14,57,3,7,GL,null,LT);archWin(g,ng,14,80,3,7,GL,null,LT);
      // 吊牌＋灌木
      put(g,52,62,6,1,'#3a3026');put(g,53,63,6,7,TR);put(g,54,64,4,5,'#3f8f8f');put(g,55,65,2,1,TR);
      ell(g,8,93,3,2,'#4e8a4a');ell(g,49,94,4,2,'#4e8a4a');put(g,48,92,1,1,'#e05a72');
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k98 青年旅舍（1×1） =================== */
  safe(98,()=>{
    const OL=[64,56,40],W='#f0d9a8',WS='#d8c090',TL='#5aa0a0',RED='#c86a5a',GL='#7fb0d8',FR='#5a4a38',LT='#ffd98a',
      FL=['#e05252','#ffb35a','#7be08a','#5ec8ff','#c88ae0'];
    function bunting(g,ng,x0,y0,x1,y1,sag){ // 萬國旗串（旗間小燈泡）
      for(let x=x0;x<=x1;x++){const t=(x-x0)/(x1-x0),y=Math.round(y0+(y1-y0)*t+sag*Math.sin(Math.PI*t));put(g,x,y,1,1,'#4a4038');
        const i=x-x0;if(i%6===2&&x+2<=x1){const c=FL[(i/6|0)%FL.length];put(g,x,y+1,3,1,c);put(g,x+1,y+2,1,1,c);}
        if(i%6===5){put(g,x,y+1,1,1,'#fff2c0');lit(ng,x,y+1,1,1,'#ffe9a0');}}
    }
    // v1：三層背包客樓（高瘦）——屋頂露台（欄杆＋陽傘＋旗串）＋外掛之字鐵梯＋直立背包旗招
    {const o=fresh(98),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#9aa07e'));
      put(g,42,38,8,56,WS);put(g,16,38,26,56,W);
      put(g,14,33,30,5,RED);put(g,44,33,8,5,shade(RED,-26));put(g,14,33,30,1,'#e08a78');
      put(g,16,55,26,2,TL);put(g,42,55,8,2,shade(TL,-26));put(g,16,74,26,2,'#e0b050');put(g,42,74,8,2,shade('#e0b050',-30));
      // 三樓通鋪長窗、二樓雙窗、一樓店窗＋門
      put(g,18,42,22,1,FR);put(g,18,43,22,6,GL);put(g,25,43,1,6,FR);put(g,33,43,1,6,FR);put(g,18,49,22,1,'#c8b088');
      lit(ng,18,43,7,6,LT);lit(ng,26,43,7,6,'#ffe9b0');
      for(const wx of[19,31]){put(g,wx,60,7,1,FR);put(g,wx,61,7,7,GL);put(g,wx,68,7,1,'#c8b088');}lit(ng,19,61,7,7,LT);
      put(g,18,79,11,1,FR);put(g,18,80,11,8,GL);put(g,23,80,1,8,FR);lit(ng,18,80,11,8,'#ffe9b0');
      put(g,31,78,8,15,'#5a3a24');put(g,32,80,6,5,GL);lit(ng,32,80,6,5,LT);
      put(g,14,89,3,4,'#4e9a4e');put(g,15,88,1,1,'#e05a72');
      // 直立背包旗招
      put(g,12,44,4,20,'#e0b050');put(g,12,44,4,1,'#f0c870');put(g,13,49,2,4,'#a87838');put(g,13,48,2,1,'#6a4a28');put(g,13,56,2,1,'#a87838');put(g,13,59,2,1,'#a87838');
      // 屋頂露台
      put(g,15,29,36,1,'#6a6e76');for(const px of[15,24,33,42,50])put(g,px,29,1,4,'#6a6e76');
      put(g,39,22,1,11,'#6a5a4a');put(g,34,21,11,1,'#e05252');put(g,35,20,9,1,'#f0e8d8');put(g,37,19,5,1,'#e05252');
      put(g,16,10,1,23,'#5a5e66');put(g,49,13,1,20,'#5a5e66');bunting(g,ng,17,11,48,14,3);
      // 外掛之字鐵梯（兩跑＋兩平台）
      put(g,49,75,11,2,'#7a7e86');put(g,49,56,11,2,'#7a7e86');put(g,49,75,11,1,'#a8acb4');put(g,49,56,11,1,'#a8acb4');
      put(g,59,77,1,17,'#5a5e66');put(g,59,58,1,17,'#5a5e66');
      seg(g,50,93,58,77,'#5a5e66');seg(g,50,89,58,73,'#b8bcc4');
      seg(g,58,74,50,58,'#5a5e66');seg(g,58,70,51,56,'#b8bcc4');
      finishFresh(o,OL);save(o,1);}
    // v2：貨櫃旅舍——四只貨櫃錯位堆疊（左懸挑＋右懸挑鋼柱）＋玻璃大堂＋屋頂旗串
    {const o=fresh(98),g=o.sg,ng=o.ng;plate(o,32,plate1(o,'#9aa07e'));
      const box=(x0,y0,x1,y1,sd,c)=>{
        if(sd){put(g,x1,y0,sd,y1-y0,shade(c,-34));put(g,x1,y0,sd,1,shade(c,-14));}
        put(g,x0,y0,x1-x0,y1-y0,c);
        for(let x=x0+3;x<x1-2;x+=4)put(g,x,y0+2,1,y1-y0-4,shade(c,-12));
        put(g,x0,y0,x1-x0,1,shade(c,24));put(g,x0,y1-1,x1-x0,1,shade(c,-28));
        put(g,x0,y0,1,y1-y0,shade(c,-22));put(g,x1-1,y0,1,y1-y0,shade(c,-22));
      };
      box(10,76,36,94,0,'#d8783a');box(36,76,58,94,6,'#3a9a9a');
      box(6,58,40,76,6,'#e0b040');box(30,40,54,58,6,'#c85a68');
      put(g,7,76,2,18,'#5a5e66');put(g,7,76,1,18,'#8a8e96'); // 左懸挑鋼柱
      put(g,52,58,2,18,'#5a5e66');put(g,52,58,1,18,'#8a8e96'); // 右懸挑鋼柱
      // 大堂玻璃門
      put(g,13,79,12,1,'#3a3a42');put(g,14,80,10,13,GL);put(g,19,80,1,13,'#3a3a42');lit(ng,14,80,5,13,'#ffe9b0');lit(ng,20,80,4,13,LT);
      put(g,27,80,7,7,'#f0e8d8');put(g,29,82,3,4,'#a87838');put(g,29,81,3,1,'#6a4a28'); // 背包招牌
      put(g,40,79,13,1,'#2a4a4a');put(g,41,80,11,6,GL);put(g,46,80,1,6,'#2a4a4a');lit(ng,41,80,5,6,LT);
      for(const wx of[11,25]){put(g,wx-1,61,11,1,'#6a5020');put(g,wx,62,9,6,GL);}lit(ng,11,62,9,6,LT);
      put(g,33,43,16,1,'#6a2a3a');put(g,34,44,14,7,GL);put(g,41,44,1,7,'#6a2a3a');lit(ng,34,44,7,7,'#ffe9b0');lit(ng,42,44,6,7,LT);
      // 屋頂欄杆＋旗串
      put(g,30,36,30,1,'#6a6e76');for(const px of[30,40,50,59])put(g,px,36,1,4,'#6a6e76');
      put(g,31,24,1,12,'#5a5e66');put(g,58,27,1,9,'#5a5e66');bunting(g,ng,32,25,57,28,3);
      finishFresh(o,OL);save(o,2);}
  });
  // 2×2 地塊色取樣點（左右角附近，避開 v0 物件）
  const plate2=(o,ref)=>plateCol(o,ref,[[o.ax-54,o.ay-34,8,3],[o.ax+46,o.ay-34,8,3]]);

  /* =================== k63 溫室（2×2） =================== */
  safe(63,()=>{
    const OL=[26,30,44],WF='#e8ecef',GLL='#c8e4ec',GLM='#a8d0dc',GLD='#86b4c4',PG='#6aa060',PL='#88b870',PINK='rgba(255,150,220,.5)';
    // v1：Venlo 連棟玻璃溫室（寬長量體、五連鋸齒山牆）＋後左紅磚鍋爐房高煙囪＋前方育苗箱
    {const o=fresh(63),g=o.sg,ng=o.ng;plate(o,64,plate2(o,'#8a9a6a'));
      // 鍋爐房（後左）
      poly(g,[[8,101],[17,92],[26,101]],'#8a4a3a');seg(g,8,100,16,92,'#a86050');
      put(g,10,100,14,18,'#b0604c');put(g,10,100,2,18,'#c47460');put(g,13,108,4,10,'#5a3a2a');
      put(g,12,72,4,24,'#a8584a');put(g,12,72,1,24,'#c06a58');put(g,11,70,6,2,'#6a3a2e');
      put(g,18,103,3,3,'#e8d8a0');lit(ng,18,103,3,3,'#ffd98a');
      // 屋面後退體＋脊線
      const Fz=[],Bz=[];for(let i=0;i<=10;i++){const x=20+8*i,y=(i&1)?86:94;Fz.push([x,y]);Bz.push([x+18,y-10]);}
      poly(g,Fz.concat(Bz.slice().reverse()),GLM);
      for(let i=0;i<5;i++){seg(g,29+16*i,86,46+16*i,76,WF);if(i<4)seg(g,36+16*i,93,53+16*i,84,'#98b8c4');}
      // 側牆
      poly(g,[[100,94],[118,84],[118,122],[100,122]],GLD);
      for(const x of[106,112])put(g,x,x===106?91:88,1,122-(x===106?91:88),'#b4ccd4');
      seg(g,100,104,117,95,'#b4ccd4');put(g,101,110,17,8,shade(PG,-18));put(g,100,118,18,4,'#98948a');
      // 正面玻璃牆＋植株＋燈條
      put(g,20,94,80,24,GLL);
      put(g,21,110,79,8,PG);for(let x=21;x<99;x+=4){put(g,x,108,3,2,PL);if((x&12)===8)put(g,x+1,112,1,1,'#d04838');}
      for(let x=24;x<96;x+=8)put(g,x,105,4,1,'#f0e8c8');
      for(let x=20;x<=100;x+=8)put(g,x,94,1,24,WF);put(g,20,104,80,1,WF);
      put(g,20,118,80,4,'#b8b4a8');put(g,20,118,80,1,'#d0ccc0');
      for(let i=0;i<5;i++){poly(g,[[20+16*i,95],[28+16*i,86],[36+16*i,95]],GLL);seg(g,20+16*i,94,28+16*i,86,WF);seg(g,28+16*i,86,36+16*i,94,'#c0d0d6');put(g,28+16*i,90,1,4,WF);}
      ng.fillStyle=PINK;ng.fillRect(21,105,79,6);ng.fillRect(101,106,16,5);
      // 門＋礫石徑＋育苗箱
      put(g,59,105,10,17,WF);put(g,60,106,8,16,GLM);put(g,64,106,1,16,WF);lit(ng,60,108,8,4,'rgba(255,225,160,.6)');
      put(o.g,60,122,8,9,'#c8c0a8');put(o.g,61,124,2,1,'#a8a090');put(o.g,65,127,2,1,'#a8a090');
      for(const [bx,by] of[[76,124],[86,124],[80,120]]){put(g,bx,by,9,4,'#b08a5a');put(g,bx,by+1,9,1,'#8a6a40');put(g,bx+1,by-1,2,1,PL);put(g,bx+5,by-1,2,1,PL);}
      finishFresh(o,OL);save(o,1);}
    // v2：維多利亞棕櫚溫室——玻璃穹頂亭（肋拱＋燈籠頂）＋左右弧頂翼廊（拱窗列）＋山花門廊＋燈柱
    {const o=fresh(63),g=o.sg,ng=o.ng;plate(o,64,plate2(o,'#8a9a6a'));
      const IR='#f2f4f2',IRD='#c8d0d4';
      // 翼廊
      for(const [x0,x1,L] of[[18,50,1],[86,114,0]]){
        for(let y=93;y<102;y++){const t=(101-y)/8,ins=Math.round(7*(1-Math.sqrt(Math.max(0,1-t*t))));
          const xa=L?x0+ins:x0,xb=L?x1:x1-ins;put(g,xa,y,xb-xa,1,y<96?GLL:y<99?GLM:GLD);}
        put(g,x0,101,x1-x0,1,IR);
        put(g,x0,102,x1-x0,16,IR);put(g,x0,118,x1-x0,4,'#c8c0b0');put(g,x0,118,x1-x0,1,'#dcd6c8');
        for(let x=x0+2;x+5<=x1-1;x+=7){
          put(g,x+1,104,3,1,GLM);put(g,x,105,5,11,GLM);put(g,x,111,5,5,PG);put(g,x+1,110,1,1,PL);put(g,x+3,110,1,1,PL);
          put(g,x+2,96,1,5,IRD);
          ng.fillStyle=PINK;ng.fillRect(x,111,5,5);}
      }
      // 右翼端面
      for(let y=94;y<122;y++){const t=y<102?(101-y)/8:0,w=Math.round(6*Math.sqrt(Math.max(0,1-t*t)));if(w>0)put(g,114,y,w,1,y<118?GLD:'#a8a090');}
      // 穹頂亭：鼓座
      put(g,50,90,36,33,IR);put(g,50,119,36,4,'#c8c0b0');put(g,48,88,40,2,IR);put(g,48,88,40,1,'#ffffff');
      for(const x of[53,76]){archWin(g,null,x,93,7,23,GLM,null,null);put(g,x,109,7,7,PG);put(g,x+1,108,2,1,PL);put(g,x+4,108,2,1,PL);ng.fillStyle=PINK;ng.fillRect(x,109,7,7);}
      // 穹頂
      for(let y=68;y<88;y++){const dy=(88-y-.5)/20,hw=19*Math.sqrt(Math.max(0,1-dy*dy)),xa=Math.round(68-hw),xb=Math.round(68+hw);
        for(let x=xa;x<xb;x++){const u=(x-xa)/Math.max(1,xb-xa);put(g,x,y,1,1,u<.36?GLL:u<.72?GLM:GLD);}
        for(const s of[-.66,-.33,0,.33,.66])put(g,Math.round(68+hw*s),y,1,1,IR);}
      for(const [fx,fy,fw] of[[58,80,6],[63,77,5],[70,78,6],[72,82,5]])put(g,fx,fy,fw,1,'#6aa878');
      put(g,54,84,28,1,IRD);
      put(g,64,62,8,6,IR);put(g,65,63,6,4,GLM);put(g,63,60,10,2,'#5a6a72');put(g,67,56,2,4,'#c8b060');
      // 山花門廊
      put(g,58,108,20,16,IR);poly(g,[[56,109],[68,100],[80,109]],IR);poly(g,[[60,108],[68,103],[76,108]],IRD);
      put(g,63,113,10,11,'#3a4a50');put(g,64,112,8,1,'#3a4a50');put(g,64,114,8,3,GLM);lit(ng,64,117,8,7,'#ffd98a');
      put(g,60,124,16,1,'#c8c0b0');put(o.g,61,125,14,2,'#b8b0a0');put(o.g,63,127,10,5,'#d8d0b8');
      for(const lx of[53,82]){put(g,lx,113,1,12,'#3a3a42');put(g,lx-1,110,3,3,'#3a3a42');put(g,lx,111,1,1,'#f0e0a0');
        ng.fillStyle='#ffe9b0';ng.fillRect(lx,111,1,1);ng.fillStyle='rgba(255,220,140,.4)';ng.fillRect(lx-1,110,3,3);}
      finishFresh(o,OL);save(o,2);}
  });

  /* =================== k111 資源回收廠（2×2） =================== */
  safe(111,()=>{
    const OL=[56,60,44],HW='#b8bcc4',HS='#989ca4',HR='#7a7e86',GRN='#2e7a3e',LT='#ffe9b0';
    function ring(g,cx,cy,r,col){for(let y=-r-1;y<=r+1;y++)for(let x=-r-1;x<=r+1;x++){const d=Math.sqrt((x+.5)*(x+.5)+(y+.5)*(y+.5));if(d<=r+.5&&d>=r-1.1&&!(x>0&&y<0&&x>-y*.3))put(g,cx+x,cy+y,1,1,col);}}
    // v1：分揀打包大廠——高分揀塔＋跨屋頂輸送廊＋三捲門卸料大廳＋三色打包塊堆
    {const o=fresh(111),g=o.sg,ng=o.ng;plate(o,64,plate2(o,'#8f9a5e'));
      // 分揀塔（後右）
      put(g,104,50,10,56,HS);put(g,84,50,20,56,HW);put(g,82,46,34,4,HR);put(g,82,46,34,1,'#9aa0a8');
      for(let y=52;y<104;y+=5)put(g,84,y,20,1,shade(HW,-7));
      for(const wy of[56,66]){put(g,87,wy,14,3,'#5a7a90');put(g,106,wy,6,3,'#4a6a80');lit(ng,87,wy,14,3,LT);}
      put(g,86,74,16,16,'#f0f0ea');ring(g,94,82,5,GRN);put(g,97,76,3,3,GRN);lit(ng,94,77,1,2,'#7be08a');
      // 卸料大廳
      put(g,80,92,16,30,HS);put(g,18,92,62,30,HW);
      for(let x=21;x<80;x+=6)put(g,x,94,1,26,shade(HW,-8));
      put(g,16,88,66,4,HR);put(g,82,88,16,4,'#6a6e76');put(g,16,88,66,1,'#9aa0a8');
      for(const [dx,open] of[[23,0],[43,1],[63,0]]){put(g,dx-1,101,16,1,'#5a606a');
        if(open){put(g,dx,102,14,20,'#2e323a');put(g,dx+2,113,9,5,'#8ab4d8');put(g,dx+2,113,9,1,'#aac8e4');put(g,dx+6,103,2,1,'#f0e8c0');lit(ng,dx+1,104,12,8,'rgba(255,225,160,.45)');lit(ng,dx+6,103,2,1,LT);}
        else{put(g,dx,102,14,20,'#6a707a');for(let y=104;y<122;y+=3)put(g,dx,y,14,1,'#5a606a');}
        put(g,dx,120,14,2,'#d8b030');}
      // 跨屋頂輸送廊＋支腳
      put(g,58,74,2,14,'#6a6e76');put(g,40,86,2,2,'#6a6e76');
      poly(g,[[34,83],[84,55],[84,61],[34,89]],'#a8acb4');seg(g,34,83,83,55,'#c8ccd4');seg(g,34,88,83,60,'#6a6e76');
      for(let i=0;i<7;i++){const x=40+i*6,y=Math.round(85-(x-34)*28/50);put(g,x,y,2,1,'#5a7a90');}
      // 打包塊堆
      const bale=(x,y,c)=>{put(g,x,y,8,5,c);put(g,x,y,8,1,shade(c,20));put(g,x+7,y,1,5,shade(c,-26));put(g,x+2,y,1,5,shade(c,-18));put(g,x+5,y,1,5,shade(c,-18));};
      for(const [x0,c,sp] of[[30,'#8ab4d8','#f0f0ea'],[50,'#c8ccd4','#d05050'],[70,'#e0a050','#5ec8ff']]){
        bale(x0,124,c);bale(x0+8,124,c);bale(x0+4,119,c);put(g,x0+3,126,1,1,sp);put(g,x0+12,125,1,1,sp);put(g,x0+8,121,1,1,sp);}
      finishFresh(o,OL);save(o,1);}
    // v2：玻璃金屬回收站——黃色龍門抓斗吊＋三格混凝土料倉（綠玻璃／茶玻璃／廢金屬）＋雙筒倉錐斗＋斗式提升塔
    {const o=fresh(111),g=o.sg,ng=o.ng;plate(o,64,plate2(o,'#8f9a5e'));
      const SL=['#dde1e6','#b4b8c0','#868a92'],YL='#e0b030';
      // 斗式提升塔＋筒倉
      put(g,110,30,6,80,'#8a8e96');put(g,110,30,2,80,'#a8acb4');put(g,107,25,12,6,'#6a6e76');put(g,107,25,12,1,'#8a8e96');
      for(let y=40;y<108;y+=10)put(g,110,y,6,1,'#6a6e76');
      put(g,112,23,2,2,'#f0e0a0');lit(ng,112,23,2,2,LT);
      seg(g,107,29,101,40,'#6a6e76');seg(g,107,28,85,40,'#6a6e76');
      for(const cx of[84,100]){
        put(g,cx-6,76,2,34,'#6a6e76');put(g,cx+4,76,2,34,'#5a5e66');seg(g,cx-4,96,cx+3,108,'#7a7e86');
        poly(g,[[cx-7,76],[cx+7,76],[cx+1,88],[cx-1,88]],SL[2]);poly(g,[[cx-7,76],[cx,76],[cx,88],[cx-1,88]],SL[1]);
        cylV(g,cx,76,7,32,SL,'#eceff2',.4);
        for(let y=50;y<76;y+=7)put(g,cx-7,y,14,1,shade(SL[1],-10));}
      put(g,77,55,14,5,GRN);put(g,77,55,5,5,'#3e9a50');put(g,82,56,4,3,'#f0f0ea');
      put(g,84,40,17,2,'#6a6e76');put(g,84,39,17,1,'#8a8e96');
      put(g,85,100,14,10,'#4a8a4a');put(g,85,100,14,1,'#6aaa6a');put(g,97,100,2,10,'#3a6a3a');
      // 三格料倉
      put(g,16,102,56,8,'#a8a498');put(g,16,102,56,1,'#c8c4b8');
      const PILES=[[26,['#9ae0b0','#4aa070','#2e7050'],'#c8f0d8'],[44,['#e8b870','#b07030','#7a4a20'],'#f8d8a0'],[62,['#d0d4da','#8a8e96','#5a5e66'],'#e8a040']];
      for(const [cx,C,sp] of PILES){mound(g,cx,120,8,11,C);put(g,cx-3,113,1,1,sp);put(g,cx+2,116,1,1,sp);}
      for(const x of[16,34,52,70])put(g,x,104,3,16,'#c8c4b8'),put(g,x+2,104,1,16,'#9a968a');
      put(g,16,118,57,2,'#8a867a');
      // 龍門吊
      for(const lx of[16,70]){put(g,lx,70,3,50,YL);put(g,lx,70,1,50,'#f0c850');put(g,lx+2,70,1,50,'#a87a18');put(g,lx-1,118,5,2,'#5a5e66');}
      put(g,14,66,62,5,YL);put(g,14,66,62,1,'#f0c850');put(g,14,70,62,1,'#a87a18');
      seg(g,19,71,25,76,YL);seg(g,69,71,63,76,YL);
      put(g,24,67,10,3,GRN);
      put(g,54,71,11,4,'#5a5e66');put(g,40,72,9,8,YL);put(g,41,74,6,3,'#5a7a90');lit(ng,41,74,6,3,LT);
      put(g,59,75,1,14,'#3a3a42');put(g,56,89,7,3,'#5a5e66');put(g,55,92,2,4,'#3a3e46');put(g,62,92,2,4,'#3a3e46');put(g,58,93,3,3,'#3a3e46');
      put(g,30,71,3,2,'#f0e8c0');lit(ng,30,71,3,2,LT);ng.fillStyle='rgba(255,230,160,.3)';ng.fillRect(29,73,5,3);
      finishFresh(o,OL);save(o,2);}
  });
  /* =================== k82 商務旅館（2×2） =================== */
  safe(82,()=>{
    const OL=[52,58,72],LT='#ffd98a',LT2='#ffe9b0';
    // v1：加高版——細長玻璃鰭條塔（11 層）＋頂樓機房金字招牌＋兩層裙樓（屋頂綠籬）＋紅色落客雨遮雙柱
    {const o=fresh(82),g=o.sg,ng=o.ng,rk=RK(82,1);plate(o,64,plate2(o,'#8f8b80'));
      const TW='#cdd6e4',TS='#aeb8c8',GL='#7fb0d8',GD='#5f90b8';
      put(o.g,40,124,44,6,'#a29e94');put(o.g,40,124,44,1,'#b0aca2');
      // 塔
      put(g,80,12,16,82,TS);put(g,42,12,38,82,TW);put(g,42,12,1,82,'#e4eaf2');
      for(let x=44;x<78;x+=6)put(g,x,14,3,78,GL);
      for(let x=82;x<94;x+=6)put(g,x,14,3,78,GD);
      for(let y=19;y<92;y+=8){put(g,43,y,37,1,TW);put(g,80,y,16,1,TS);}
      for(let y0=20;y0<=84;y0+=8)for(let x=44;x<78;x+=6)if(rk()<.42)lit(ng,x,y0,3,7,rk()<.5?LT:LT2);
      for(let y0=20;y0<=84;y0+=8)if(rk()<.35)lit(ng,82,y0,3,7,LT);
      // 塔冠＋機房招牌
      put(g,40,8,58,4,'#8890a0');put(g,40,8,58,1,'#a8b0bc');
      put(g,74,2,6,6,'#8e98a8');put(g,50,2,24,6,TS);put(g,52,3,20,4,'#dbb42c');put(g,54,4,16,1,'#5a4030');lit(ng,52,3,20,4,'#ffe08a');
      // 裙樓
      put(g,102,96,14,28,'#b8b2a8');put(g,20,96,82,28,'#dcd6cc');
      put(g,18,93,84,3,'#8890a0');put(g,102,93,16,3,'#707888');put(g,18,93,100,1,'#a8b0bc');
      for(const px of[22,34,86])put(g,px,90,10,3,'#4e8a4a'),put(g,px,90,10,1,'#6aaa5a');
      for(let x=24;x<100;x+=8){put(g,x,99,5,5,GL);if(rk()<.5)lit(ng,x,99,5,5,LT);}
      put(g,105,99,3,5,GD);put(g,110,99,3,5,GD);
      put(g,22,109,78,1,'#8890a0');put(g,22,110,78,12,GL);for(let x=22;x<=100;x+=8)put(g,x,110,1,12,'#e8e4dc');
      put(g,105,111,3,10,GD);put(g,110,111,3,10,GD);
      for(let x=23;x<100;x+=8)if(x<44||x>78)lit(ng,x,111,7,10,LT2);
      put(g,20,122,82,2,'#b0aaa0');
      put(g,56,111,12,12,'#3a4a5a');put(g,61,111,2,12,'#8890a0');lit(ng,56,112,5,10,LT);lit(ng,63,112,5,10,LT);
      // 落客雨遮
      put(g,44,105,36,4,'#c04838');put(g,44,105,36,1,'#d86a58');put(g,44,108,36,1,'#8a3028');
      put(g,46,109,2,18,'#8890a0');put(g,46,109,1,18,'#a8b0bc');put(g,76,109,2,18,'#707888');
      ng.fillStyle='rgba(255,210,120,.45)';ng.fillRect(48,109,28,3);
      finishFresh(o,OL);save(o,1);}
    // v2：老派紅磚旅館（寬矮）——凸出中軸＋孟莎屋頂老虎窗＋頂層拱窗＋石砌底層拱窗＋燈泡雨簷＋直立霓虹招牌
    {const o=fresh(82),g=o.sg,ng=o.ng,rk=RK(82,2);plate(o,64,plate2(o,'#8f8b80'));
      const BR='#a85a44',BS='#8a4836',ST='#e8dcc4',SL='#4a5060',SLD='#383d4a',SLL='#646a7a',GL='#7fb0d8';
      put(o.g,48,122,16,3,'#b8b0a0');
      // 翼樓孟莎頂（側坡→前坡）
      poly(g,[[97,57],[115,57],[111,46],[94,46]],SLD);put(g,94,46,17,1,SL);
      trapRows(g,14,98,57,18,94,46,SL,SLD,3);put(g,18,46,76,1,SLL);
      for(const dx of[22,34,76,88]){put(g,dx,48,6,7,ST);put(g,dx,47,6,1,SLL);archWin(g,rk()<.5?ng:null,dx+1,50,4,4,GL,null,LT);}
      // 牆體
      put(g,96,58,18,64,BS);put(g,16,58,80,64,BR);
      for(let y=62;y<100;y+=5){put(g,16,y,80,1,shade(BR,-9));put(g,96,y,18,1,shade(BS,-8));}
      put(g,16,100,80,22,'#d8ccb4');put(g,96,100,18,22,'#b8ac94');for(let y=104;y<122;y+=4){put(g,16,y,80,1,'#c4b8a0');put(g,96,y,18,1,'#a89c84');}
      put(g,16,99,98,1,ST);
      // 中軸凸出
      put(g,44,50,24,50,shade(BR,8));put(g,68,50,2,50,shade(BR,-24));put(g,44,100,26,22,'#e0d4bc');
      for(let y=62;y<100;y+=5)put(g,44,y,24,1,shade(BR,-2));
      put(g,14,56,84,3,ST);put(g,98,56,18,3,shade(ST,-34));put(g,14,56,84,1,'#f8f0e0');
      trapRows(g,42,70,48,46,66,32,SL,SLD,3);put(g,46,32,20,1,SLL);put(g,42,48,28,3,ST);put(g,42,48,28,1,'#f8f0e0');
      put(g,53,37,6,6,ST);put(g,54,38,4,4,GL);lit(ng,54,38,4,4,LT);
      put(g,56,23,1,9,'#5a5a62');put(g,57,23,5,3,'#c04838');
      // 窗
      const cols=[[20,4],[29,4],[38,4],[49,5],[58,5],[73,4],[82,4],[91,4]];
      for(const [wx,ww] of cols){
        archWin(g,rk()<.5?ng:null,wx,61,ww,8,GL,ST,LT);
        for(const wy of[74,87]){put(g,wx-1,wy-1,ww+2,1,ST);put(g,wx,wy,ww,7,GL);if(rk()<.5)lit(ng,wx,wy,ww,7,rk()<.5?LT:LT2);}
      }
      for(const wy of[61,74,87]){put(g,100,wy,3,7,'#5f90b8');put(g,107,wy,3,7,'#5f90b8');if(rk()<.4)lit(ng,100,wy,3,7,LT);}
      for(const wx of[21,32,72,83]){archWin(g,ng,wx,104,7,13,GL,null,LT2);put(g,wx,117,7,1,'#b0a48c');}
      // 入口＋燈泡雨簷＋盆栽
      archWin(g,null,50,104,12,18,'#4a3024',null,null);put(g,52,107,8,6,GL);put(g,55,107,2,15,'#4a3024');lit(ng,52,107,3,6,LT);lit(ng,57,107,3,6,LT);
      put(g,42,96,28,3,'#2a2a30');put(g,42,96,28,1,'#dbb42c');for(let x=43;x<70;x+=3){put(g,x,99,1,1,'#fff2c0');lit(ng,x,99,1,1,'#fff2c0');}
      ng.fillStyle='rgba(255,210,120,.4)';ng.fillRect(44,100,24,3);
      put(g,45,115,3,7,'#4e8a4a');put(g,45,115,1,7,'#6aaa5a');put(g,64,115,3,7,'#4e8a4a');put(g,64,115,1,7,'#6aaa5a');
      // 直立招牌
      put(g,9,62,6,30,'#c04838');put(g,9,62,6,1,'#e06a58');put(g,14,62,1,30,'#8a3028');put(g,15,66,1,2,'#3a3a42');put(g,15,86,1,2,'#3a3a42');
      for(let i=0;i<5;i++){put(g,11,65+i*5,2,3,'#f0d060');lit(ng,11,65+i*5,2,3,'#ffe08a');}
      finishFresh(o,OL);save(o,2);}
  });
  /* =================== k83 度假酒店（3×3） =================== */
  safe(83,()=>{
    const OL=[64,72,88],LT='#ffd98a',LT2='#ffe9b0';
    const plate3=(o,ref)=>plateCol(o,ref,[[o.ax-80,o.ay-50,8,3],[o.ax+72,o.ay-50,8,3]]);
    function palm(g,x,by,h,lean){
      for(let i=0;i<h;i++){const xx=x+Math.round(lean*i*i/(h*h));put(g,xx,by-i,2,1,'#8a6a42');put(g,xx,by-i,1,1,'#a8845a');if(i%3===0)put(g,xx+1,by-i,1,1,'#6a4a2a');}
      const cx=x+lean+1,cy=by-h;
      for(const [dx,dy] of[[-9,3],[9,3],[-7,-3],[7,-3],[-4,6],[5,6],[0,-5]]){seg(g,cx,cy,cx+dx,cy+dy,'#4e9a4e');seg(g,cx,cy+1,cx+dx,cy+dy+1,'#3a7a3a');}
      put(g,cx-1,cy,3,2,'#5aa854');
    }
    function lounge(g,x,y){put(g,x,y,8,2,'#f0e8d8');put(g,x,y+2,8,1,'#c8b898');put(g,x+6,y-1,2,1,'#f0e8d8');}
    function umbrella(g,x,by,c){put(g,x,by-9,1,9,'#8a8a92');put(g,x-4,by-10,9,2,c);put(g,x-2,by-11,5,1,c);put(g,x-4,by-9,9,1,shade(c,-30));}
    // v1：退台綠化酒店——四層階梯退台（通長落地玻璃＋花台陽台）＋頂層藤架空中酒吧＋腰果形無邊際泳池＋棕櫚
    {const o=fresh(83),g=o.sg,ng=o.ng,rk=RK(83,1);const pc=plate3(o,'#d9cba8');plate(o,96,pc);
      const W='#f6ecd8',WS='#d4c6aa',GL='#8fb8d8',GLD='#6f98b8',TC='#b86a4a',RL='#e8dcbc',PL='#4e9a4e',PK='#e07aa0';
      // 泳池（地面層）
      ell(o.g,100,186,45,13,'#efe4cc');ell(o.g,100,186,38,10,'#3aa8c0');ell(o.g,100,185,37,9,'#4fc3d9');
      for(const [lx,ly,lw] of[[78,181,12],[106,184,16],[92,190,10]])put(o.g,lx,ly,lw,1,'#7fd8ea');
      ng.fillStyle='#66d9ec';for(let y=176;y<=195;y++){const dy=(y+.5-186)/10;if(Math.abs(dy)>1)continue;const hw=38*Math.sqrt(1-dy*dy);ng.fillRect(Math.round(100-hw),y,Math.round(2*hw),1);}
      // 退台（由上而下畫：上層在後）
      const T=[[72,136,150,54,72],[58,144,160,76,96],[44,152,170,100,124],[30,160,178,128,160]];
      T.forEach(([x0,x1,xs,yT,yB],ti)=>{
        put(g,x1,yT,xs-x1,yB-yT,WS);put(g,x0,yT,x1-x0,yB-yT,W);put(g,x0,yT,1,yB-yT,'#fffaf0');
        const yEnd=ti===3?148:yB;
        for(let y0=yT;y0+9<=yEnd;y0+=10){
          put(g,x0,y0,x1-x0,1,'#fffaf0');put(g,x0+2,y0+2,x1-x0-4,5,GL);put(g,x1+2,y0+2,xs-x1-4,5,GLD);
          for(let x=x0+11;x<x1-4;x+=10){put(g,x,y0+2,1,5,W);}
          for(let x=x0+2;x<x1-4;x+=10)if(rk()<.45)lit(ng,x,y0+2,Math.min(9,x1-2-x),5,rk()<.5?LT:LT2);
          put(g,x0,y0+6,x1-x0,1,RL);put(g,x1,y0+6,xs-x1,1,shade(RL,-30));
          for(let x=x0+4;x<x1-4;x+=16){put(g,x,y0+7,4,1,PL);put(g,x+1,y0+7,1,1,PK);}
        }
        // 本層屋面＝上層前的露台帶
        put(g,x0-2,yT-4,xs-x0+2,4,'#e8dcbc');put(g,x0-2,yT-4,xs-x0+2,1,'#fff6e4');put(g,x0-2,yT-1,xs-x0+2,1,TC);put(g,x1,yT-1,xs-x1,1,shade(TC,-30));
        for(let x=x0+2;x<xs-6;x+=13){put(g,x,yT-6,6,3,PL);put(g,x,yT-6,6,1,'#6ab85a');put(g,x+2,yT-6,1,1,PK);}
      });
      // 底層大堂柱廊＋入口雨遮
      put(g,30,148,130,12,'#cbb994');put(g,160,148,18,12,'#a89878');
      for(let x=32;x<158;x+=12)put(g,x,149,3,11,W);
      put(g,94,150,20,10,GL);put(g,103,150,2,10,W);lit(ng,94,150,9,10,LT);lit(ng,105,150,9,10,LT);
      put(g,88,146,32,3,TC);put(g,88,146,32,1,'#d88a68');ng.fillStyle='rgba(255,210,120,.45)';ng.fillRect(90,149,28,2);
      // 頂層藤架酒吧
      for(const px of[78,96,114,132])put(g,px,40,2,10,'#8a6a42');
      put(g,76,38,60,3,'#8a6a42');put(g,76,38,60,1,'#a8845a');
      for(const [vx,vw] of[[80,10],[100,8],[118,12]])put(g,vx,36,vw,2,PL);
      put(g,92,44,20,6,'#e8dcbc');put(g,92,44,20,1,'#fff6e4');put(g,95,42,2,1,'#f0e0a0');lit(ng,94,41,5,3,'rgba(255,220,140,.6)');
      // 泳池邊
      palm(g,54,178,22,-3);palm(g,152,180,24,2);palm(g,138,198,16,1);
      umbrella(g,76,172,'#e05252');umbrella(g,126,172,'#f0a040');lounge(g,82,170);lounge(g,112,170);
      finishFresh(o,OL);save(o,1);}
    // v2：水上別墅村（低平舒展）——茅草大屋頂開放式大堂＋潟湖＋四棟高腳水上屋＋木棧道＋沙洲棕櫚
    {const o=fresh(83),g=o.sg,ng=o.ng,rk=RK(83,2);const pc=plate3(o,'#d9cba8');plate(o,96,pc);
      const TH='#c8a860',THD='#a88a48',THL='#dcc07a',WD='#8a6a42',WDL='#b08858';
      const G0=o.g;
      // 潟湖（地面層，裁在地塊內）
      for(let y=150;y<212;y++)for(let x=12;x<198;x++){
        const inP=Math.abs(x+.5-104)/96+Math.abs(y+.5-170)/48<=.9;if(!inP)continue;
        const ex=(x+.5-104)/88,ey=(y+.5-180)/26;if(ex*ex+ey*ey>1)continue;
        put(G0,x,y,1,1,(ex*ex+ey*ey>.86)?'#3aa8c0':'#4fc3d9');}
      for(const [lx,ly,lw] of[[46,176,14],[120,184,18],[88,198,12],[150,172,10]])put(G0,lx,ly,lw,1,'#7fd8ea');
      // 沙洲
      ell(G0,34,164,16,6,'#ecdcb4');ell(G0,176,162,14,6,'#ecdcb4');
      // 木棧道：沿等距軸的菱形環（N 接大堂前台）
      const walk=(ax2,ay2,bx2,by2)=>{const n=Math.abs(bx2-ax2)/2;for(let i=0;i<=n;i++){const x=Math.round(ax2+(bx2-ax2)*i/n),y=Math.round(ay2+(by2-ay2)*i/n);put(G0,x,y,3,1,WDL);put(G0,x,y+1,3,1,'#9a7448');put(G0,x,y+2,3,1,'#2e8aa0');}};
      walk(104,150,52,176);walk(104,150,156,176);walk(52,176,104,202);walk(156,176,104,202);
      // 水上屋
      function hut(cx,by,ri){
        for(const sx of[-7,0,6])put(g,cx+sx,by-4,1,5,'#6a4a2a');
        put(g,cx-9,by-6,19,2,WDL);put(g,cx-9,by-6,19,1,'#c8a070');
        put(g,cx+4,by-14,4,8,'#a87a48');put(g,cx-6,by-14,10,8,'#d8b888');
        put(g,cx-4,by-12,3,6,'#6a4a2a');put(g,cx,by-12,3,3,'#8fb8d8');if(ri)lit(ng,cx,by-12,3,3,LT);
        poly(g,[[cx+9,by-13],[cx+11,by-15],[cx+6,by-21],[cx+3,by-21]],THD);
        trapRows(g,cx-10,cx+9,by-13,cx-5,cx+3,by-21,TH,THD,2);put(g,cx-5,by-21,8,1,THL);
      }
      hut(52,182,1);hut(156,182,rk()<.7);hut(78,195,1);hut(130,195,rk()<.7);
      // 茅草大屋頂大堂（後中）
      put(G0,70,148,68,4,'#b89868');
      put(g,136,124,14,26,'#8a6a42');put(g,72,124,64,26,'#5a4430');
      for(const px of[72,88,104,120,134]){put(g,px,126,3,24,WD);put(g,px,126,1,24,WDL);}
      put(g,72,146,78,4,WDL);put(g,72,146,78,1,'#c8a070');
      for(const lx of[80,96,112,127]){put(g,lx,130,3,4,'#f0d890');put(g,lx+1,128,1,2,'#3a3026');lit(ng,lx,130,3,4,LT);}
      ng.fillStyle='rgba(255,210,120,.35)';ng.fillRect(76,134,56,12);
      poly(g,[[146,127],[162,118],[134,86],[118,92]],THD);
      trapRows(g,62,148,128,90,118,92,TH,THD,3);put(g,90,92,28,1,THL);
      put(g,102,84,4,8,WD);put(g,103,80,2,4,'#6a4a2a');
      // 棕櫚＋陽傘
      palm(g,30,166,20,-2);palm(g,40,162,15,2);palm(g,176,164,22,2);
      umbrella(g,170,162,'#f0a040');
      finishFresh(o,OL);save(o,2);}
  });
  /* =================== k53 大農場（4×4，compose；繪製端走季節分支＝customDrawPath） =================== */
  safe(53,()=>{
    const OL=[26,30,44];
    function patch(o,cx,cy,hw,col,edge){ // 地面鋪面（無外框，同式紋理）
      const [pc,pg]=cv(o.w,o.h);A.dia(pg,cx,cy-hw/2,hw,col);if(edge){A.diaEdge(pg,6,shade(col,-16),cx,cy-hw/2,hw);A.diaEdge(pg,9,shade(col,12),cx,cy-hw/2,hw);}
      grainBands(pc,o.pl,o.pt,o.h0);material(pc,o);ellipseAtop(pc,o);o.g.drawImage(pc,0,0);
    }
    function repaint(o,x0,y0,x1,y1,col){ // 抹去 v0 殘件：地塊內補地塊色（同式紋理＋投影），地塊外只留地面投影
      const [pc,pg]=cv(o.w,o.h),cy=o.ay-80;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(Math.abs(x+.5-o.ax)/160+Math.abs(y+.5-cy)/80<=1)put(pg,x,y,1,1,col);
      grainBands(pc,o.pl,o.pt,o.h0);material(pc,o);ellipseAtop(pc,o);
      const G=o.g;G.save();G.beginPath();G.rect(x0,y0,x1-x0,y1-y0);G.clip();G.clearRect(x0,y0,x1-x0,y1-y0);
      G.fillStyle='rgba(10,14,24,.16)';G.beginPath();G.ellipse(o.ax+24,o.ay-18,90,36,0,0,6.283);G.fill();G.drawImage(pc,0,0);G.restore();
    }
    function isoFence(G,x0,y0,x1,y1){ // 等距白柵欄（無外框，同 v0 圍欄件畫法：雙橫桿＋每 6 列立柱）
      const n=Math.abs(x1-x0),sgn=Math.sign(x1-x0);
      for(let i=0;i<=n;i++){const x=x0+sgn*i,y=Math.round(y0+(y1-y0)*i/n);
        put(G,x,y-3,1,1,'#f4f4ee');put(G,x,y-1,1,1,'#cfcfc6');
        if(i%6===0){put(G,x,y-4,1,4,'#b4b4ac');put(G,x,y,1,1,'#6a6a58');}}
    }
    const cowAt=(g,x,y,f,br)=>{put(g,x,y,7,4,br?'#8a5a3a':'#f0f0ea');if(!br){put(g,x+1,y,2,2,'#2a2a2e');put(g,x+4,y+2,2,1,'#2a2a2e');}
      const hx=f?x+7:x-2;put(g,hx,y-1,2,3,br?'#6a4028':'#2a2a2e');put(g,x,y+4,1,2,'#3a3a3a');put(g,x+5,y+4,1,2,'#3a3a3a');};
    // v1：酪農場——左耕地＋紅色小倉改成「等距長型散放牛舍」（山牆朝西南：紅牆白 X 大門＋乾草閣；長邊開放欄位見牛頭；金屬雙坡頂＋雙通風塔）；
    //     右角果園改白柵欄牧場＋乳牛群；牛舍前包膜圓草捆。前田保留（繪製端 T403 拖拉機動畫沿前田往返，不能蓋掉）
    {const o=base(53),g=o.sg,G0=o.g;
      const PC=modeColor(o.s0.img,64,176,30,14,'#a8a070');
      repaint(o,6,130,98,180,PC);repaint(o,251,136,322,182,PC);
      patch(o,284,160,28,'#8fa860',1);
      // 牧場後側柵欄（在牛之後）
      isoFence(G0,260,161,284,149);isoFence(G0,284,149,308,161);
      // ---- 等距長牛舍：S 角 (sx,sy)；長邊沿 (2,-1) 長 a（暗面）；山牆沿 (-2,-1) 深 b（亮面）----
      const sx=40,sy=176,a=26,b=10,h=13,rh=7;
      const P1=[sx-b,sy-b/2-h+1-rh],P2=[sx-b+2*a,sy-b/2-h+1-rh-a],Wt=[sx-2*b,sy-b-h+1],Nt=[sx+2*a-2*b,sy-a-b-h+1],St=[sx,sy-h+1],Et=[sx+2*a,sy-a-h+1];
      poly(g,[P1,P2,Nt,Wt],'#bcc2ca');                       // 背坡（向西北受光）
      poly(g,[St,Et,P2,P1],'#9aa0a8');                       // 前坡
      for(const t of[.36,.68])seg(g,St[0]+(P1[0]-St[0])*t,St[1]+(P1[1]-St[1])*t,Et[0]+(P2[0]-Et[0])*t,Et[1]+(P2[1]-Et[1])*t,'#8a9098');
      seg(g,P1[0],P1[1],P2[0],P2[1],'#d4dae0');
      // 山牆（亮面）
      for(let x=sx-2*b;x<sx;x++){const base=sy-Math.floor((sx-1-x)/2),ex=Math.round(rh*(1-Math.abs(x+.5-(sx-b))/b)),top=base-h+1-ex;
        for(let y=top;y<=base;y++)put(g,x,y,1,1,x===sx-2*b?'#d4604a':'#c44a36');
        put(g,x,top,1,1,'#ece6d8');put(g,x,base,1,1,'#9a3a2a');}
      {const dw=10,dh=9,d0=sx-2*b+5;
        for(let i=0;i<dw;i++){const x=d0+i,base=sy-Math.floor((sx-1-x)/2);
          for(let r=0;r<dh;r++){const q1=Math.round(i*(dh-1)/(dw-1)),q2=Math.round((dw-1-i)*(dh-1)/(dw-1));
            put(g,x,base-r,1,1,(i===0||i===dw-1||r===dh-1||r===q1||r===q2)?'#ece6d8':'#8a2820');}}
        for(let x=sx-b-2;x<sx-b+2;x++){const base=sy-Math.floor((sx-1-x)/2);put(g,x,base-h-2,1,3,'#5a2a20');put(g,x,base-h-3,1,1,'#ece6d8');}}
      // 長邊（暗面）：勒腳＋開放欄位（立柱每 8 列、牛頭）＋簷下陰影
      for(let x=sx;x<sx+2*a;x++){const i=x-sx,base=sy-Math.floor(i/2),m=i%8;
        for(let r=0;r<h;r++){let c;
          if(r<=2)c=r===2?'#b4b0a4':'#9a968a';else if(r===h-1)c='#5a5650';else if(r===h-2)c='#aca698';
          else c=m===0?'#c8c2b4':m===1?'#a09a8e':'#2e2a28';
          put(g,x,base-r,1,1,c);}
        if(m===4&&i<2*a-4){const bi=i>>3;put(g,x,base-5,1,2,bi&1?'#8a5a3a':'#ecece6');put(g,x+1,base-5,1,1,bi&1?'#6a4028':'#2a2a2e');}}
      // 通風塔
      for(const t of[.3,.7]){const cx=Math.round(P1[0]+(P2[0]-P1[0])*t),cy=Math.round(P1[1]+(P2[1]-P1[1])*t);
        put(g,cx-2,cy-5,5,6,'#e8e2d4');put(g,cx+1,cy-5,2,6,'#c4beb0');put(g,cx-1,cy-3,3,1,'#5a5048');
        poly(g,[[cx-3,cy-5],[cx+.5,cy-9],[cx+4,cy-5]],'#8a9098');seg(g,cx-3,cy-6,cx,cy-9,'#c8ced4');}
      // 包膜圓草捆（牛舍長邊前）
      for(const [bx,by] of[[56,183],[64,183],[60,178]]){put(g,bx+1,by-3,5,6,'#c4c4bc');put(g,bx+1,by-3,5,1,'#e0e0d8');ell(g,bx,by,3,3,'#f0f0ea');put(g,bx,by,1,1,'#cacac2');}
      // 牧場：乳牛＋水槽
      put(g,275,165,8,2,'#8a6a42');put(g,275,165,8,1,'#5fa0b8');
      cowAt(g,265,157,1);cowAt(g,281,152,0,1);cowAt(g,294,158,0);
      commit(o,OL);
      isoFence(G0,260,161,284,173);isoFence(G0,284,173,308,161); // 牧場前側柵欄
      save(o,1);}
    // v2：穀物機械化農場——果園改混凝土場坪上三座鍍鋅穀倉（錐頂）＋高瘦斗式提升塔與溜槽；左田改半圓拱鐵皮機具棚
    {const o=base(53),g=o.sg;
      patch(o,284,161,36,'#b8b4a8',1);patch(o,42,166,28,'#b0aa98',1);
      const SL=['#dde1e6','#b4b8c0','#868a92'];
      function bin(cx,by,r,h){
        cylV(g,cx,by,r,h,SL,null,.4);
        for(let y=by-h+3;y<by;y+=3)put(g,cx-r,y,2*r,1,shade(SL[1],-12));
        put(g,cx-r,by-2,2*r,1,'#6a6e76');
        const tip=Math.round(by-h-r*.8);
        poly(g,[[cx-r-1,by-h+1],[cx,tip],[cx,by-h+1]],'#c8ccd2');poly(g,[[cx,by-h+1],[cx,tip],[cx+r+1,by-h+1]],'#9a9ea6');
        put(g,cx-1,tip-2,3,2,'#6a6e76');put(g,cx-r+2,by-8,3,6,'#6a6e76');
        return tip;}
      // 提升塔（最後方）
      put(g,277,106,3,60,'#8a8e96');put(g,277,106,1,60,'#aeb2ba');for(let y=112;y<164;y+=8)put(g,276,y,5,1,'#6a6e76');
      put(g,273,99,11,8,'#6a6e76');put(g,273,99,11,1,'#8a8e96');put(g,275,96,1,3,'#6a6e76');
      const t3=bin(306,158,8,18),t2=bin(288,164,10,24),t1=bin(262,172,10,20);
      seg(g,274,106,262,t1-2,'#6a6e76');seg(g,282,106,288,t2-2,'#6a6e76');seg(g,283,105,306,t3-2,'#6a6e76');
      put(g,294,168,12,6,'#c83a2c');put(g,294,168,12,1,'#e05a48');put(g,306,170,4,4,'#a82a1c');put(g,307,171,2,1,'#5a7a90');put(g,295,174,3,2,'#26282c');put(g,304,174,3,2,'#26282c'); // 運穀卡車
      // 半圓拱機具棚
      const semi=(cx,cy,rx,ry,col)=>{for(let y=Math.floor(cy-ry);y<cy;y++){const dy=(cy-(y+.5))/ry;if(dy>1)continue;const hw=rx*Math.sqrt(1-dy*dy);put(g,Math.round(cx-hw),y,Math.round(2*hw),1,col);}};
      for(let t=16;t>=1;t--)semi(42+t,172-Math.round(t/2),15,18,t===16?'#6a6e76':(t%4===0?'#8a9098':'#a8aeb6'));
      semi(42,172,15,18,'#c8ccd4');semi(42,172,12,15,'#bcc0c8');semi(42,172,9,12,'#c8ccd4');
      seg(g,42,154,58,146,'#dde1e6');
      put(g,34,160,16,12,'#4a4e56');put(g,34,160,16,1,'#8a8e96');put(g,41,160,1,12,'#6a6e76');
      put(g,36,166,5,6,'#3a7a3a');put(g,36,165,4,1,'#5aa05a');put(g,37,170,2,2,'#26282c'); // 棚內綠拖拉機
      commit(o,OL);save(o,2);}
  });
  /*@@END@@*/
});
