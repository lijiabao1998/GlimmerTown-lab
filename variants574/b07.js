(window.__variants574=window.__variants574||[]).push(function b07(A){
  /* T574 批次 b07：地標與景觀塔（67 鐘樓／72 紀念碑／73 觀景塔／75 凱旋門／89 電視塔／103 天際觀景餐廳／
     71 噴泉廣場／184 節慶市集／180 熱氣球基地／186 夜光花園）。
     v0 全是 72×112 的小型正立面地標；本批以 redraw 為主（同佔地、同色票、同外框色），
     重畫後補上與 v0 同款的 T526 打磨＋T479 材質（逐式複刻，決定性雜湊），T573 由後製鏈自動套。 */
  const SPR=A.SPR(), B=SPR.bld;
  const shade=A.shade, HL=A.hashLocal479, R=Math.round;

  /* ---------- 像素基元（全整數、零共用亂數） ---------- */
  const mk=(w,h)=>{const r=A.cv(w,h);return {c:r[0],g:r[1]};};
  const P=(g,x,y,w,h,c)=>{x=R(x);y=R(y);w=R(w);h=R(h);if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(x,y,w,h);};
  function line(g,x0,y0,x1,y1,c){x0=R(x0);y0=R(y0);x1=R(x1);y1=R(y1);
    const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;g.fillStyle=c;
    for(let n=0;n<600;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx;}if(e2<dx){e+=dx;y0+=sy;}}}
  function poly(g,pts,c){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    g.fillStyle=c;const n=pts.length;let ar=0;for(let k=0;k<n;k++){const a=pts[k],b=pts[(k+1)%n];ar+=a[0]*b[1]-b[0]*a[1];}const s=ar>0?1:-1;
    for(let y=Math.floor(y0);y<=Math.ceil(y1);y++)for(let x=Math.floor(x0);x<=Math.ceil(x1);x++){const px=x+.5,py=y+.5;let ok=true;
      for(let k=0;k<n&&ok;k++){const a=pts[k],b=pts[(k+1)%n];if(s*((b[0]-a[0])*(py-a[1])-(b[1]-a[1])*(px-a[0]))<-.01)ok=false;}
      if(ok)g.fillRect(x,y,1,1);}}
  // 逐列區段小雕像：spans=[[列,x0,x1,部件],...]，後者覆蓋前者；pal[部件]=字串（平塗）或 {base,top,left,bot,right,hi}（光從左上：頂/左緣亮、底/右緣暗；不同部件交界也算外露＝自動分件）
  function spanSprite(g,ox,oy,spans,pal){const m=new Map();for(const s of spans)for(let x=s[1];x<=s[2];x++)m.set(x+','+s[0],s[3]);
    for(const [k,pt] of m){const xy=k.split(','),x=+xy[0],y=+xy[1],c=pal[pt];if(typeof c==='string'){P(g,ox+x,oy+y,1,1,c);continue;}
      const ex=(dx,dy)=>m.get((x+dx)+','+(y+dy))!==pt,t=ex(0,-1),l=ex(-1,0),b=ex(0,1),r=ex(1,0);
      P(g,ox+x,oy+y,1,1,t&&l?c.hi:t?c.top:l?c.left:b?c.bot:r?c.right:c.base);}}
  function disc(g,cx,cy,r,c){for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(Math.max(0,r*r+r*.8-dy*dy)));P(g,cx-w,cy+dy,2*w+1,1,c);}}
  function ell(g,cx,cy,rx,ry,c){for(let dy=-ry;dy<=ry;dy++){const t=Math.max(0,Math.abs(dy)-.4)/(ry+.1);const w=R(rx*Math.sqrt(Math.max(0,1-t*t)));P(g,cx-w,cy+dy,2*w+1,1,c);}}
  // 穹頂：底橢圓中心 (cx,cy)、半寬 rx、底半高 ry、頂高 hd；pal=[亮,中,暗,最暗]；光從左上
  function dome(g,cx,cy,rx,ry,hd,pal){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),s=Math.sqrt(Math.max(0,1-u*u));const top=cy-R(hd*s),bot=cy+R(ry*s);
      for(let y=top;y<=bot;y++){const t=bot>top?(bot-y)/(bot-top):1;const b=-.62*u+.58*t+.12;
        P(g,cx+dx,y,1,1,b>.62?pal[0]:b>.28?pal[1]:b>-.08?pal[2]:pal[3]);}}}

  /* ---------- 等距幾何 ---------- */
  // 佔地格座標：N=(ax,ay-32)，i 往右下、j 往左下（各 0..16）
  const GP=(ax,ay)=>(i,j,z)=>[ax+2*i-2*j,ay-32+i+j-(z||0)];
  const fy=(S,d)=>S[1]-((d+1)>>1);                    // 牆面第 d 欄的地面 y（左右同式）
  const fx=(S,side,d)=>side<0?S[0]-1-d:S[0]+d;
  // 長方體：S=南角地面點，lenL/lenR=左右面長（格單位，1 格=2px），h=牆高
  function box(g,S,lenL,lenR,h,cL,cR,cT,o){o=o||{};
    for(let d=0;d<2*lenL;d++)P(g,fx(S,-1,d),fy(S,d)-h,1,h,cL);
    for(let d=0;d<2*lenR;d++)P(g,fx(S,1,d),fy(S,d)-h,1,h,cR);
    if(!o.noAO){for(let d=0;d<2*lenL;d++)P(g,fx(S,-1,d),fy(S,d)-2,1,2,'rgba(0,0,0,.12)');for(let d=0;d<2*lenR;d++)P(g,fx(S,1,d),fy(S,d)-2,1,2,'rgba(0,0,0,.12)');}
    if(!o.noCorner)P(g,S[0],S[1]-h-((1)>>1),1,h,'rgba(0,0,0,.16)');
    if(cT)topFace(g,[S[0],S[1]-h],lenL,lenR,cT,o.eF===undefined?shade(cT,-22):o.eF,o.eB===undefined?shade(cT,14):o.eB);
    return S[1]-h;}
  function topFace(g,S,lenL,lenR,c,eF,eB){const sx=S[0],sy=S[1],nx=sx+2*lenR-2*lenL;
    for(let x=sx-2*lenL;x<sx+2*lenR;x++){
      const L=x<sx?sy-((sx-x)>>1):sy-((x-sx+1)>>1);
      const U=x<nx?sy-lenL-((x-(sx-2*lenL)+1)>>1):sy-lenR-((sx+2*lenR-x)>>1);
      if(L-U<=0)continue;P(g,x,U,1,L-U,c);if(eB)P(g,x,U,1,1,eB);if(eF)P(g,x,L-1,1,1,eF);}}
  // 牆面矩形（沿斜率）：side -1 左 / +1 右；d0 起欄、wd 欄寬、up=底離地、hh=高；arch=首末欄頂部縮 1
  function faceRect(g,S,side,d0,wd,up,hh,c,arch){for(let d=d0;d<d0+wd;d++){const e=arch&&(d===d0||d===d0+wd-1)?1:0;P(g,fx(S,side,d),fy(S,d)-up-hh+e,1,hh-e,c);}}
  // 牆面水平帶
  function band(g,S,side,d0,d1,up,hh,c){for(let d=d0;d<d1;d++)P(g,fx(S,side,d),fy(S,d)-up-hh,1,hh,c);}
  // 方錐屋頂：底面 = box 頂面（S 為頂面南角）＋外挑 ov 格
  function pyramid(g,S,n,hgt,cL,cR,ridge){const W=[S[0]-2*n,S[1]-n],E=[S[0]+2*n,S[1]-n],ap=[S[0],S[1]-n-hgt];
    poly(g,[W,S,ap],cL);poly(g,[S,E,ap],cR);if(ridge)line(g,S[0],S[1]-1,ap[0],ap[1]+1,ridge);return ap;}
  function plate(g,ax,ay,col,dk,lt){A.dia(g,ax,ay-32,32,col);A.diaEdge(g,6,dk||shade(col,-16),ax,ay-32,32);A.diaEdge(g,9,lt||shade(col,12),ax,ay-32,32);}

  /* ---------- 後製對齊：逐式複刻 T526 打磨＋T479 建築材質（v0 在開機時吃過，變體跑在它們之後） ---------- */
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
  // 組裝：地面層 base（不描邊）＋結構層 st（描邊）→ 打磨 → 材質 → 寫鍵
  function finish(k,v,base,st,nt,ax,ay,ol,noNight,post){
    A.outlineSprite(st.c,ol[0],ol[1],ol[2]);base.g.drawImage(st.c,0,0);if(post)post(base.g);
    polish526(base.c,ax,ay);const key=k+'_1_'+v;mat479(base.c,k,key);
    B[key]={img:base.c,night:noNight?undefined:nt.c,ax,ay,w:base.c.width,h:base.c.height,smoke:[]};}
  const lamp=(g,ng,x,y,hh,pole,head,glow)=>{P(g,x,y-hh,1,hh,pole);P(g,x-1,y-hh-2,3,2,head);P(g,x-1,y-hh,3,1,shade(pole,-10));if(ng){P(ng,x-1,y-hh-2,3,2,glow);P(ng,x-2,y-hh-3,5,4,'rgba(255,225,150,.28)');}};
  // 圓柱：底橢圓中心 (cx,by)、rx/ry、高 h；pal=[高光,亮,中,暗]（光從左）；top=頂面色
  function cyl(g,cx,by,rx,ry,h,pal,top,rim){
    for(let dx=-rx;dx<=rx;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));
      const c=u<-.72?pal[1]:u<-.28?pal[0]:u<.22?pal[1]:u<.62?pal[2]:pal[3];P(g,cx+dx,by-h+e,1,h,c);}
    if(top){ell(g,cx,by-h,rx,ry,top);if(rim)for(let dx=-rx+1;dx<=rx-1;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));P(g,cx+dx,by-h+e-1,1,1,rim);}}
    return by-h;}
  // 圓柱窗帶：up=帶底離圓柱底緣、hh=帶高、step=窗櫺間距；lit=夜窗色
  function cylBand(g,ng,cx,by,rx,ry,up,hh,glass,mull,step,lit){
    for(let dx=-rx+1;dx<=rx-1;dx++){const u=dx/(rx+.5),e=R(ry*Math.sqrt(Math.max(0,1-u*u)));const y=by+e-up-hh,m=((dx+rx)%step)===0;
      P(g,cx+dx,y,1,hh,m?mull:(u<-.25?glass[0]:u<.35?glass[1]:glass[2]));if(ng&&lit&&!m)P(ng,cx+dx,y,1,hh,u<.35?lit:shade(lit,-30));}}

  /* ======================== k67 鐘樓 ======================== */
  try{(function(){const K=67,OL=[40,35,25];
    const ST='#d8d0c0',STD='#b0a890',STB='#a09888',STT='#d0c8b8',RED='#cc4a3a',GOLD='#dbb42c',GOLD2='#ecc94c';
    function clock(g,ng,cx,cy,r,face,rim,dark){disc(g,cx,cy,r+1,rim);disc(g,cx,cy,r,face);
      P(g,cx,cy-r+1,1,1,'#3a3026');P(g,cx+r-1,cy,1,1,'#3a3026');P(g,cx,cy+r-1,1,1,'#3a3026');P(g,cx-r+1,cy,1,1,'#3a3026');
      P(g,cx,cy-r+2,1,r-1,'#1a1a1a');P(g,cx,cy,Math.max(2,r-2),1,'#1a1a1a');
      if(ng){disc(ng,cx,cy,r+1,dark?'#e8c880':'#ffe9a8');P(ng,cx,cy-r+2,1,r-1,'#8a6a3a');}}
    /* v1：哥德式高鐘樓——細高方塔＋開放鐘室（見金鐘）＋銅綠尖錐＋四角小尖塔＋右前方小禮拜堂側翼 */
    {const W=72,H=128,ax=36,ay=126,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      // 前庭鋪面：門前石徑
      for(let t=0;t<5;t++){const p=G(12+t,15-0,0);P(base.g,p[0]-6,p[1]-1,4,1,'#b4ad9c');}
      box(g,G(12,12),7,7,5,'#c8c0b0',STB,STT);                          // 台基
      const S1=G(11,11,5);box(g,S1,5,5,57,ST,STD,null);                    // 塔身
      band(g,S1,-1,0,10,20,1,STB);band(g,S1,1,0,10,20,1,shade(STB,-14));
      band(g,S1,-1,0,10,40,1,STB);band(g,S1,1,0,10,40,1,shade(STB,-14));
      faceRect(g,S1,-1,3,4,0,10,'#5a3a24',true);P(g,fx(S1,-1,4),fy(S1,4)-5,1,1,GOLD);  // 拱門
      faceRect(g,S1,-1,4,2,26,6,'#4a4640',true);faceRect(g,S1,1,4,2,26,6,'#3e3a36',true); // 箭窗
      clock(g,ng,30,62,4,'#f8f8f0','#8a8070');clock(g,ng,42,62,3,'#dcd8cc','#7a7062',true);
      const S2=G(12,12,62);box(g,S2,6,6,2,STT,STB,STT,{noAO:1});        // 簷口
      const S3=G(11,11,64);box(g,S3,5,5,13,ST,STD,null,{noAO:1});         // 鐘室
      faceRect(g,S3,-1,3,4,2,9,'#3a3026',true);faceRect(g,S3,1,3,4,2,9,'#2e261e',true);
      P(g,30,44,1,1,GOLD2);P(g,29,45,3,3,GOLD);P(g,28,48,5,1,shade(GOLD,-24));P(g,30,49,1,1,'#3a3026');  // 金鐘
      if(ng){P(ng,29,45,3,3,'rgba(255,214,120,.55)');}
      const S4=G(12,12,77);box(g,S4,6,6,2,STT,STB,STT,{noAO:1});          // 冠簷
      const top=[S4[0],S4[1]-2];
      const ap=pyramid(g,[top[0],top[1]-1],5,24,'#6aa890','#48806c','#8cc8b0');   // 銅綠尖錐
      for(const q of [[top[0]-12,top[1]-6],[top[0],top[1]],[top[0]+12,top[1]-6]]){P(g,q[0]-1,q[1]-5,2,5,STT);P(g,q[0],q[1]-7,1,2,STB);} // 角尖塔
      P(g,ap[0],ap[1]-6,1,7,GOLD);P(g,ap[0]-1,ap[1]-4,3,1,GOLD2);P(g,ap[0]-1,ap[1]-8,3,3,GOLD2);   // 十字尖
      // 側翼小禮拜堂（右前）：i 12..16, j 4..10，山牆朝東南
      {const S=G(16,10);box(g,S,4,6,11,'#d0c8b8','#a8a090',null);
        const eS=[S[0],S[1]-11],eE=[S[0]+12,S[1]-17],pk=[S[0]+6,S[1]-14-6];
        poly(g,[eS,eE,pk],'#a8a090');                                     // 山牆
        poly(g,[[eS[0]-1,eS[1]+1],pk,[pk[0]-8,pk[1]-4],[eS[0]-9,eS[1]-3]],'#b84434'); // 左坡屋面
        line(g,eS[0]-1,eS[1],eS[0]-9,eS[1]-4,'#8a2820');line(g,pk[0],pk[1],pk[0]-8,pk[1]-4,'#e06a58');
        faceRect(g,S,-1,3,3,2,6,'#4a5a6a',true);
        faceRect(g,S,1,3,2,2,6,'#3e4c5a',true);faceRect(g,S,1,7,2,2,6,'#3e4c5a',true);
        P(g,pk[0],pk[1]+4,1,1,'#3e4c5a');
        if(ng){faceRect(ng,S,-1,3,3,2,6,'#ffd98a',true);faceRect(ng,S,1,3,2,2,6,'#f0c878',true);faceRect(ng,S,1,7,2,2,6,'#f0c878',true);}}
      {const p=G(4,14);lamp(g,ng,p[0],p[1],10,'#4a4640','#e8d080','#ffe9a0');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：紅磚粗壯鐘樓——寬方塔＋底層拱廊＋石隅角＋大鐘盤＋八角燈亭＋銅綠圓頂 */
    {const W=72,H=118,ax=36,ay=116,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      const BR='#c47a58',BRD='#9a5a42',QN='#e8dcc8',QND='#c4b8a4';
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      box(g,G(13,13),10,10,3,'#c8c0b0',STB,STT);                         // 台階
      const S1=G(12,12,3);box(g,S1,8,8,59,BR,BRD,null);                   // 磚塔身
      for(let z=0;z<59;z+=6){P(g,S1[0]-2,S1[1]-z-3,2,3,QN);P(g,S1[0],S1[1]-z-6,2,3,QND);  // 隅角石
        P(g,fx(S1,-1,15),fy(S1,15)-z-3,1,3,QN);P(g,fx(S1,1,15),fy(S1,15)-z-6,1,3,QND);}
      for(const up of [14,40]){band(g,S1,-1,0,16,up,2,QN);band(g,S1,1,0,16,up,2,QND);}
      // 底層拱廊（左右各兩拱）
      for(const d0 of [3,9]){faceRect(g,S1,-1,d0,4,0,11,'#3a2a20',true);faceRect(g,S1,1,d0,4,0,11,'#2e221a',true);
        P(g,fx(S1,-1,d0+1),fy(S1,d0+1)-8,2,2,'#e8c060');if(ng)P(ng,fx(S1,-1,d0+1),fy(S1,d0+1)-9,2,3,'#ffd98a');
        if(ng)P(ng,fx(S1,1,d0+1),fy(S1,d0+1)-9,2,3,'rgba(255,210,130,.7)');}
      // 中段拱窗
      faceRect(g,S1,-1,6,4,22,11,'#3a4652',true);faceRect(g,S1,1,6,4,22,11,'#323c46',true);
      band(g,S1,-1,6,10,21,1,QN);band(g,S1,1,6,10,21,1,QND);
      // 大鐘盤（石圈）
      disc(g,27,53,7,QN);clock(g,ng,27,53,5,'#f8f8f0','#8a8070');
      disc(g,45,53,6,QND);clock(g,ng,45,53,4,'#dcd8cc','#7a7062',true);
      const S2=G(13,13,62);box(g,S2,10,10,3,QN,QND,'#d8ccb4',{noAO:1});   // 冠簷
      const S3=G(10,10,65);box(g,S3,4,4,11,QN,QND,null,{noAO:1});          // 燈亭
      faceRect(g,S3,-1,2,4,2,7,'#3a3026',true);faceRect(g,S3,1,2,4,2,7,'#2e261e',true);
      if(ng){faceRect(ng,S3,-1,3,2,3,4,'rgba(255,214,120,.6)');}
      P(g,fx(S3,-1,3),fy(S3,3)-7,2,3,GOLD);                               // 燈亭內小鐘
      const S4=G(11,11,76);box(g,S4,5,5,2,'#d8ccb4',QND,null,{noAO:1});
      const dc=[36,S4[1]-2-5];
      dome(g,dc[0],dc[1],10,4,12,['#8cc8b0','#5fa08a','#3f7a68','#2f5a4e']);
      P(g,36,dc[1]-17,1,6,GOLD);P(g,35,dc[1]-15,3,3,GOLD2);
      {const p=G(16,8);lamp(g,ng,p[0],p[1],9,'#4a4640','#e8d080','#ffe9a0');}
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k67',e);}

  /* ======================== k72 紀念碑 ======================== */
  try{(function(){const K=72,OL=[26,30,44];
    const SL='#e2d6c2',SD='#c2b69a',ST='#d8ccb4',SB='#b8a888',SH='#f0e8d8',GOLD='#d4af37',BZ='#5c6b5e',BZL='#7e8e80',BZD='#3e4a44';
    /* v1：勝利紀念柱——三層台階＋方座（金銘牌）＋高圓柱＋柱頭＋鍍金勝利女神像；兩盞前燈 */
    {const W=72,H=128,ax=36,ay=126,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      box(g,G(14,14),12,12,3,'#e8dcd0','#c8bc9e','#ded2c0');
      box(g,G(13,13,3),10,10,3,'#e8dcd0','#c8bc9e','#ded2c0');
      const S1=G(11,11,6);box(g,S1,6,6,14,SL,SD,null);
      band(g,S1,-1,0,12,0,2,SB);band(g,S1,1,0,12,0,2,shade(SB,-16));
      faceRect(g,S1,-1,3,6,5,4,GOLD);faceRect(g,S1,-1,4,4,6,1,shade(GOLD,-40));
      if(ng)faceRect(ng,S1,-1,3,6,5,4,'#ffe9a8');
      box(g,G(12,12,20),8,8,3,SH,SD,ST);
      // 柱身（圓柱，左亮右暗）＋柱礎
      const cy0=87;ell(g,36,cy0,6,2,ST);ell(g,36,cy0-2,5,2,SH);
      const cols=['#f0e8d8','#e8dcc8','#e2d6c2','#d6caae','#c2b69a','#b0a488','#a8987e'];
      for(let dx=-4;dx<=4;dx++){const c=cols[Math.min(6,Math.floor((dx+4)*7/9))];P(g,36+dx,30,1,cy0-2-30,c);}
      for(const y of [70,52]){P(g,32,y,9,1,SB);P(g,32,y+1,9,1,SH);}
      P(g,31,28,11,2,SH);P(g,30,26,13,2,ST);P(g,30,27,13,1,SD);          // 柱頭
      P(g,34,23,5,3,SL);P(g,38,23,1,3,SD);                               // 像座
      // 鍍金勝利女神（展翼、高舉花環）
      const GL='#ecc46a',GD='#a8862a';
      P(g,35,15,3,8,GOLD);P(g,35,15,1,8,GL);P(g,37,17,1,6,GD);P(g,35,12,2,3,GOLD);P(g,35,12,1,2,GL);
      P(g,32,14,2,5,GL);P(g,31,13,1,4,GOLD);P(g,39,15,2,5,GD);P(g,41,14,1,4,GD);
      P(g,38,9,1,5,GOLD);P(g,37,7,3,2,GL);
      {const p=G(15,5);lamp(g,ng,p[0],p[1],11,'#3e4a44','#e8d080','#ffe9a0');}
      {const p=G(5,15);lamp(g,ng,p[0],p[1],11,'#3e4a44','#e8d080','#ffe9a0');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：騎馬像紀念碑——寬低廣場台＋長方基座（金銘牌）＋青銅騎馬像；兩角燈柱 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      box(g,G(15,15),14,14,2,'#d8ccb8','#b8ac94','#cfc3ae');
      const S1=G(13,10,2);box(g,S1,10,4,13,SL,SD,ST);
      band(g,S1,-1,0,20,0,2,SB);band(g,S1,1,0,8,0,2,shade(SB,-16));
      band(g,S1,-1,0,20,10,1,SH);band(g,S1,1,0,8,10,1,shade(SH,-24));
      faceRect(g,S1,-1,6,8,4,4,GOLD);faceRect(g,S1,-1,7,6,5,1,shade(GOLD,-40));
      if(ng)faceRect(ng,S1,-1,6,8,4,4,'#ffe9a8');
      // 青銅騎馬像（面朝左、近側前蹄抬起、騎士舉劍）：逐列區段＋自動分件受光；蹄底落在基座頂面中心 (36,81)
      {const H={base:BZ,top:BZL,left:'#6d7d6f',bot:BZD,right:'#4a5850',hi:'#9aab9c'},F={base:'#46524a',top:'#56645a',left:'#50604f',bot:'#2e3834',right:'#3a463e',hi:'#5c6b5e'},
          RR={base:'#56655a',top:BZL,left:'#6d7d6f',bot:BZD,right:'#46544a',hi:'#9aab9c'};
        spanSprite(g,26,60,[
          [16,7,8,'F'],[17,7,8,'F'],[18,8,8,'F'],[19,8,8,'F'],[20,8,8,'F'],[21,7,8,'F'],                 // 遠側前腿（立）
          [16,17,17,'F'],[17,17,17,'F'],[18,17,18,'F'],[19,18,18,'F'],[20,18,18,'F'],[21,18,19,'F'],     // 遠側後腿
          [10,18,19,'T'],[11,19,20,'T'],[12,19,20,'T'],[13,20,20,'T'],[14,20,20,'T'],[15,20,20,'T'],[16,20,20,'T'], // 尾
          [3,4,4,'H'],[4,3,4,'H'],[5,2,5,'H'],[6,1,5,'H'],[7,0,3,'H'],[8,0,2,'H'],                      // 頭＋耳
          [7,4,6,'H'],[8,4,7,'H'],[9,5,8,'H'],[10,5,8,'H'],                                             // 頸
          [11,4,7,'H'],[12,4,7,'H'],[13,4,7,'H'],[14,5,7,'H'],                                          // 胸
          [11,7,16,'H'],[12,6,17,'H'],[13,6,17,'H'],[14,6,17,'H'],[15,7,16,'H'],                        // 馬身
          [10,15,17,'H'],[11,15,18,'H'],[12,15,18,'H'],[13,15,18,'H'],[14,16,18,'H'],                   // 臀
          [15,4,5,'H'],[16,3,4,'H'],[17,3,3,'H'],[18,3,3,'H'],                                          // 近側前腿（抬）
          [16,14,15,'H'],[17,14,15,'H'],[18,15,15,'H'],[19,15,15,'H'],[20,15,15,'H'],[21,15,16,'H'],    // 近側後腿
          [7,6,6,'T'],[8,7,7,'T'],[9,8,8,'T'],                                                          // 鬃
          [2,10,11,'R'],[3,10,11,'R'],[4,10,12,'R'],[5,9,12,'R'],[6,9,12,'R'],[7,9,12,'R'],[8,10,12,'R'],[9,10,12,'R'], // 騎士
          [10,9,11,'R'],[11,9,10,'R'],[12,9,10,'R'],[13,10,10,'R'],                                     // 騎士腿
          [6,13,13,'R'],[5,13,14,'R'],[4,14,15,'R'],                                                    // 舉臂
          [0,16,16,'S'],[1,16,16,'S'],[2,15,15,'S'],[3,15,15,'S']                                       // 劍
        ],{H,F,R:RR,T:BZD,S:'#c8d2cc'});}
      {const p=G(14,2,2);lamp(g,ng,p[0],p[1],12,'#3e4a44','#e8d080','#ffe9a0');}
      {const p=G(2,14,2);lamp(g,ng,p[0],p[1],12,'#3e4a44','#e8d080','#ffe9a0');}
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k72',e);}

  /* ======================== k73 觀景塔（天文望遠鏡塔） ======================== */
  try{(function(){const K=73,OL=[50,45,40];
    const WL='#f2efe0',WR='#d9d5c2',WT='#e8e4d4',WB='#b5ae9b',TUB='#b0b4c0',TUBD='#888c94',RING='#606870';
    const domePal=['#fdfbf4','#f0ede0','#d8d4c2','#b8b19e'];
    /* v1：高聳階梯觀測塔——三段收分塔身＋外挑觀景廊＋環窗觀測室＋頂部圓頂與伸出的望遠鏡 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#8f8b80','#a09888','#c6beae');
      const S1=G(14,14);box(g,S1,12,12,7,WL,WR,WT);band(g,S1,-1,0,24,6,1,WB);band(g,S1,1,0,24,6,1,shade(WB,-12));
      faceRect(g,S1,-1,10,4,0,6,'#6a5a48',true);
      const S2=G(12,12,7);box(g,S2,8,8,14,WL,WR,WT);band(g,S2,-1,0,16,13,1,WB);band(g,S2,1,0,16,13,1,shade(WB,-12));
      faceRect(g,S2,-1,7,2,4,5,'#5a6a78',true);faceRect(g,S2,1,7,2,4,5,'#4a5a66',true);
      const S3=G(11,11,21);box(g,S3,6,6,24,WL,WR,null);
      for(const up of [5,14]){faceRect(g,S3,-1,5,2,up,5,'#5a6a78');faceRect(g,S3,1,5,2,up,5,'#4a5a66');}
      if(ng){faceRect(ng,S3,-1,5,2,14,5,'#ffe2a0');}
      const S4=G(12,12,45);box(g,S4,8,8,3,WL,WR,WT,{noAO:1});band(g,S4,-1,0,16,0,1,WB);band(g,S4,1,0,16,0,1,shade(WB,-12)); // 觀景廊
      const S5=G(10,10,48);box(g,S5,4,4,8,WL,WR,null,{noAO:1});
      band(g,S5,-1,1,7,2,4,'#5a6a78');band(g,S5,1,1,7,2,4,'#4a5a66');           // 環窗
      if(ng){band(ng,S5,-1,1,7,2,4,'#ffe2a0');band(ng,S5,1,1,7,2,4,'#e8c888');}
      box(g,G(11,11,56),5,5,2,WT,WR,WT,{noAO:1});
      dome(g,36,35,9,4,10,domePal);
      P(g,33,26,2,12,'#60584c');                                              // 觀測縫
      for(let t=0;t<12;t++){P(g,35+t,31-t,3,1,TUB);P(g,35+t,32-t,3,1,TUBD);}    // 鏡筒
      P(g,47,19,3,2,RING);
      if(ng){P(ng,33,27,2,10,'#c0e8ff');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：電波望遠鏡——低矮白色台基＋控制小屋＋基座塔＋叉架＋大型拋物面天線與饋源支架 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#8f8b80','#a09888','#c6beae');
      const S1=G(14,14);box(g,S1,12,12,5,WL,WR,WT);band(g,S1,-1,0,24,4,1,WB);band(g,S1,1,0,24,4,1,shade(WB,-12));
      const S2=G(10,10,5);box(g,S2,4,4,16,WL,WR,WT);
      faceRect(g,S2,-1,3,3,0,6,'#6a5a48',true);
      // 控制小屋（右前）
      const SC=G(15,7,5);box(g,SC,4,5,9,WL,WR,WT);faceRect(g,SC,1,3,4,3,3,'#5a6a78');faceRect(g,SC,-1,2,3,3,3,'#5a6a78');
      if(ng){faceRect(ng,SC,1,3,4,3,3,'#ffe2a0');faceRect(ng,SC,-1,2,3,3,3,'#ffe2a0');}
      P(g,SC[0]+4,SC[1]-20,1,6,RING);P(g,SC[0]+3,SC[1]-21,3,1,RING);             // 小屋天線
      // 叉架
      P(g,30,66,2,8,TUBD);P(g,41,66,2,8,TUBD);P(g,30,72,13,2,TUB);
      // 拋物面：旋轉橢圓，面朝左上
      const cx=35,cy=56,rx=17,ry=10,rot=-.42,cs=Math.cos(rot),sn=Math.sin(rot);
      for(let y=cy-18;y<=cy+18;y++)for(let x=cx-20;x<=cx+20;x++){const dx=x+.5-cx,dy=y+.5-cy;const u=(dx*cs+dy*sn)/rx,v=(-dx*sn+dy*cs)/ry;const r2=u*u+v*v;
        if(r2>1)continue;const ui=(dx+1.2)*cs+(dy+1.2)*sn,vi=-(dx+1.2)*sn+(dy+1.2)*cs;const inner=(ui*ui)/((rx-2.2)*(rx-2.2))+(vi*vi)/((ry-2.4)*(ry-2.4))<=1;
        let c;if(inner){c=u<-.35?'#c4c8ce':u<.25?'#dde0e4':'#eef0f0';if(r2<.03)c='#9a9ea8';}else c=(v>0||u>.3)?'#8e929c':'#e4e6ea';P(g,x,y,1,1,c);}
      finish(K,2,base,st,nt,ax,ay,OL,false,gg=>{
        line(gg,cx-12,cy+2,cx-6,cy-7,'#9a9ea8');line(gg,cx+8,cy-9,cx-6,cy-7,'#9a9ea8');line(gg,cx+3,cy+7,cx-6,cy-7,'#9a9ea8');
        P(gg,cx-8,cy-9,3,3,'#606870');P(gg,cx-8,cy-9,1,1,'#b0b4c0');});
      P(ng,cx-7,cy-8,1,1,'#ff6a5a');
    }
  })();}catch(e){console.error('v574 k73',e);}

  /* ======================== k75 凱旋門 ======================== */
  try{(function(){const K=75,OL=[40,35,25];
    const SL='#d4ccbc',SD='#b0a898',SA='#e8dcc8',SAD='#c4b8a4',STT='#ddd1bc',DK='#2a1e14',GOLD='#d4a84c',GL='#ecc46a',GD='#b89030';
    // 拱洞：prof=各欄頂部內縮；底部 3 列透見地面
    function archCut(g,S,side,d0,prof,up,hh){for(let q=0;q<prof.length;q++){const d=d0+q,x=fx(S,side,d),yb=fy(S,d)-up;
      P(g,x,yb-hh+prof[q],1,hh-prof[q],DK);P(g,x,yb-4,1,1,'#4a4034');P(g,x,yb-3,1,1,'#7a7264');P(g,x,yb-2,1,2,'#a8a090');}}
    const hangLamp=(g,ng,x,y0,len)=>{P(g,x+1,y0,1,len,'#3a3026');P(g,x,y0+len,3,1,'#3a3026');P(g,x,y0+len+1,3,3,'#e8c060');
      if(ng){P(ng,x,y0+len+1,3,3,'#ffd98a');P(ng,x-2,y0+len,7,6,'rgba(255,214,130,.30)');}};
    /* v1：古典單拱凱旋門——寬厚低矮量體、主面半圓大拱可穿視（內側牆＋地坪＋後方）、墩柱雙壁柱、側面小拱、齒飾橫帶＋刻字女兒牆、拱心懸燈 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#b0a89a','#a09888','#c6beae');
      box(g,G(16,13),15,8,2,'#ccc4b4','#aaa292',STT);
      const lenL=14,lenR=5,hh=29,S=G(15,11,2);box(g,S,lenL,lenR,hh,SL,SD,null,{noAO:1});
      for(const d of [1,4,23,26]){band(g,S,-1,d,d+1,2,20,'#e8e0d0');band(g,S,-1,d+1,d+2,2,20,'#b4ac9c');band(g,S,-1,d,d+2,0,2,'#c4bcac');band(g,S,-1,d,d+2,22,1,'#e2dace');}
      for(const d of [1,8]){band(g,S,1,d,d+1,2,20,'#a8a090');}
      band(g,S,-1,0,28,23,1,'#a09888');band(g,S,-1,0,28,24,4,SA);band(g,S,1,0,10,23,1,'#8a8276');band(g,S,1,0,10,24,4,SAD);
      for(let d=1;d<28;d+=2)band(g,S,-1,d,d+1,24,1,'#c8bca6');
      band(g,S,-1,0,28,28,1,'#f2ece0');
      // 側面小拱（右面）
      {const pr=[4,1,0,0,1,4];for(let q=0;q<6;q++){const d=2+q,x=fx(S,1,d),yb=fy(S,d);P(g,x,yb-15+pr[q],1,15-pr[q],'#4a4034');P(g,x,yb-3,1,1,'#7a7264');P(g,x,yb-2,1,2,'#a8a090');}}
      // 主面半圓大拱（穿視）
      const hd0=6,hd1=21,nA=hd1-hd0+1,hu1=21,dep=2*lenR,xL=S[0]-1-hd1,fF=x=>fy(S,S[0]-1-x);
      const pr=[];for(let q=0;q<nA;q++){const t=(q-(nA-1)/2)/((nA-1)/2+.1);pr.push(R(8*(1-Math.sqrt(Math.max(0,1-t*t)))));}
      for(let d=hd0;d<=hd1;d++){const x=S[0]-1-d,top=fy(S,d)-hu1+pr[d-hd0],bot=fy(S,d)-1,k=x-xL;g.clearRect(x,top,1,bot-top+1);
        if(k<dep){const fl=fF(xL)-((k+1)>>1);for(let y=top;y<=bot;y++)P(g,x,y,1,1,y>=fl?'#bdb5a5':(y<top+2?'#6a6254':'#8a8276'));}
        else{const fl=fF(x-dep)-lenR;for(let y=Math.max(top,fl);y<=bot;y++)P(g,x,y,1,1,'#bdb5a5');}
        P(g,x,top-1,1,1,'#ece4d4');}
      P(g,S[0]-1-13,fy(S,13)-hu1-2,2,2,SAD);
      const SA2=G(15,11,2+hh);box(g,SA2,lenL,lenR,5,SA,SAD,STT,{noAO:1});
      for(const d0 of [7,12,17])band(g,SA2,-1,d0,d0+4,2,1,GD);
      hangLamp(g,ng,S[0]-1-14,fy(S,14)-hu1+2,2);
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：現代不鏽鋼懸鏈線拱門——沿格子東西對角正對觀者的高聳鋼拱（底粗頂細、三角斷面外亮內暗、拱頂觀景窗）
       ＋低矮花崗岩廣場台＋前方淺水鏡池＋拱腳內側投光燈。與 v0 小門樓／v1 厚重古典拱在輪廓上完全不同：高瘦、中空、單一曲線。 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#b0a89a','#a09888','#c6beae');
      box(g,G(16,16),15,15,2,'#dcd6c8','#b4ae9e','#d2cbbb');                        // 花崗岩廣場台（頂面中線 y=93）
      topFace(g,G(7,7,2),5,5,'#7fa468','#6a8c56','#94b87c');                        // 拱後草坪
      topFace(g,G(15,15,2),5,5,'#ece6d8',null,null);                                // 水鏡池石緣
      topFace(g,G(14.5,14.5,2),4,4,'#6f9cb8','#9cc4dc','#4f7a96');                  // 水鏡池
      P(g,32,101,5,1,'#9cc4dc');
      const acx=36,abase=92,aspan=21,aH=62,kk=2.1,chk=Math.cosh(kk)-1,N=720,pts=[];
      for(let q=0;q<=N;q++){const u=-1+2*q/N;pts.push([acx+aspan*u,abase-aH*(Math.cosh(kk)-Math.cosh(kk*u))/chk,u]);}
      const L3=[-.5,-.62,.6],l3=Math.hypot(L3[0],L3[1],L3[2]);
      const tone=d=>d>.68?'#f2f5f7':d>.42?'#d6dce1':d>.14?'#b1b9c1':d>-.14?'#8e97a0':'#6f7882';
      for(let y=abase-aH-3;y<=abase;y++)for(let x=acx-aspan-4;x<=acx+aspan+4;x++){
        const px=x+.5,py=y+.5;let bd=1e9,bi=0;
        for(let q=0;q<=N;q++){const dx=px-pts[q][0],dy=py-pts[q][1],dd=dx*dx+dy*dy;if(dd<bd){bd=dd;bi=q;}}
        const u=pts[bi][2],hw=(2.2+3.8*u*u)/2;if(Math.sqrt(bd)>hw)continue;
        const a=pts[Math.max(0,bi-1)],b=pts[Math.min(N,bi+1)];let tx=b[0]-a[0],ty=b[1]-a[1];const tl=Math.hypot(tx,ty)||1;tx/=tl;ty/=tl;
        const nx=ty,ny=-tx,sg=((px-pts[bi][0])*nx+(py-pts[bi][1])*ny)>=0?1:-1;
        const d=(sg*nx*.87*L3[0]+sg*ny*.87*L3[1]+.5*L3[2])/l3;P(g,x,y,1,1,tone(d));}
      for(const x of [34,36,38])P(g,x,abase-aH,1,1,'#4a525c');                      // 拱頂觀景窗
      // 拱腳內側投光燈
      for(const x of [19,51]){P(g,x,91,2,2,'#7a7468');P(g,x,91,2,1,'#f0e8c8');}
      if(ng){for(const x of [34,36,38])P(ng,x,abase-aH,1,1,'#ffe2a0');
        for(const x of [19,51]){P(ng,x,91,2,1,'#ffe9b0');}
        ng.fillStyle='rgba(255,236,190,.22)';ng.fillRect(16,76,2,15);ng.fillRect(54,76,2,15);}
      finish(K,2,base,st,nt,ax,ay,OL,false,gg=>{gg.fillStyle='rgba(20,18,14,.22)';gg.fillRect(11,93,9,1);gg.fillRect(52,93,9,1);gg.fillRect(12,94,7,1);gg.fillRect(53,94,7,1);});}
  })();}catch(e){console.error('v574 k75',e);}

  /* ======================== k89 電視塔 ======================== */
  try{(function(){const K=89,OL=[70,70,78];
    const RD='#d84838',WH='#f0f0ea',LAT='#a8a8b0',MR='#c8ccd4',MRD='#a8acb8',WIN='#7fb0d8',MAST='#8a8a92';
    const rw=(yy,y0)=>((((y0-yy)/9)|0)%2===0)?RD:WH;
    // 粗腳：兩端點之間逐列 3px
    function leg(g,x0,y0,x1,y1,yBase,wd){for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++){const t=(y-y0)/(y1-y0||1),x=R(x0+(x1-x0)*t);P(g,x-(wd>>1),y,wd,1,rw(y,yBase));}}
    /* v1：四腳展開式鐵塔——落地四腳跨越基座樓、中段觀景平台、上段收分桁架＋天線 */
    {const W=72,H=132,ax=36,ay=130,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      const SB=G(11,11);box(g,SB,6,6,8,MR,MRD,'#b8bcc4');band(g,SB,-1,1,11,3,2,'#5a7890');band(g,SB,1,1,11,3,2,'#4a6478');
      if(ng){band(ng,SB,-1,1,11,3,2,'#ffe2a0');band(ng,SB,1,1,11,3,2,'#e8c888');}
      const yb=126;
      leg(g,12,114,23,80,yb,3);leg(g,60,114,49,80,yb,3);leg(g,36,126,36,84,yb,3);
      const SD=G(11,11,36);box(g,SD,6,6,6,WH,'#d0d0ca','#e0e0da',{noAO:1});band(g,SD,-1,0,12,1,3,'#5a7890');band(g,SD,1,0,12,1,3,'#4a6478');
      if(ng){band(ng,SD,-1,0,12,1,3,'#ffe2a0');band(ng,SD,1,0,12,1,3,'#e8c888');}
      leg(g,25,71,33,36,yb,2);leg(g,47,71,39,36,yb,2);leg(g,36,78,36,38,yb,2);
      const SU=G(9,9,74);box(g,SU,2,2,3,WH,'#d0d0ca','#e0e0da',{noAO:1});
      for(let y=10;y<=34;y++)P(g,35,y,2,1,rw(y,yb));
      P(g,33,22,6,1,MAST);P(g,34,16,4,1,MAST);
      P(g,35,8,2,2,'#e04a3a');if(ng){P(ng,34,7,4,4,'#ff5a4a');P(ng,35,6,2,1,'#ffb0a8');}
      finish(K,1,base,st,nt,ax,ay,OL,false,gg=>{const c='rgba(120,120,132,.85)';
        for(let k=0;k<4;k++){const ya=114-k*9,yb2=ya-9;const xa=R(12+(ya-114)*(-11/34)),xb=R(12+(yb2-114)*(-11/34));
          line(gg,xa+1,ya,36,R(126-(126-84)*((114-ya)/34)),c);line(gg,xb+1,yb2,36,R(126-(126-84)*((114-ya)/34)),c);
          const xr=R(60-(114-ya)*(11/34)),xrb=R(60-(114-yb2)*(11/34));line(gg,xr-1,ya,36,R(126-(126-84)*((114-ya)/34)),c);line(gg,xrb-1,yb2,36,R(126-(126-84)*((114-ya)/34)),c);}
        for(let k=0;k<3;k++){const ya=70-k*11,yb2=ya-11;const xl=R(25+(70-ya)*(8/35)),xlb=R(25+(70-yb2)*(8/35)),xr=R(47-(70-ya)*(8/35)),xrb=R(47-(70-yb2)*(8/35)),ym=R(78-(78-38)*((70-ya)/35));
          line(gg,xl+1,ya,36,ym,c);line(gg,xlb+1,yb2,36,ym,c);line(gg,xr-1,ya,36,ym,c);line(gg,xrb-1,yb2,36,ym,c);}});}
    /* v2：拉索桅杆塔——極細高桅杆＋三向拉索與地錨＋側邊機房（屋頂碟形天線） */
    {const W=72,H=132,ax=36,ay=130,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      const mx=33,mTop=6,mBot=111;
      const anchors=[[10,115],[62,112],[22,124]];
      for(const a of anchors){P(base.g,a[0]-1,a[1]-1,3,2,'#8a8478');}
      const SE=G(15,9);box(g,SE,7,6,11,MR,MRD,'#b8bcc4');
      faceRect(g,SE,-1,9,3,0,7,'#5a3a24');faceRect(g,SE,-1,3,4,4,3,WIN);faceRect(g,SE,1,4,6,5,2,WIN);
      if(ng){faceRect(ng,SE,-1,3,4,4,3,'#ffe9b0');faceRect(ng,SE,1,4,6,5,2,'#ffe2a0');}
      const rt=[SE[0]+2,SE[1]-11-6];
      disc(g,rt[0]-4,rt[1]-3,3,'#d8dce4');P(g,rt[0]-3,rt[1]-3,2,2,'#a8acb8');P(g,rt[0]-4,rt[1],1,3,MAST);
      disc(g,rt[0]+5,rt[1]-1,2,'#d8dce4');P(g,rt[0]+5,rt[1]+1,1,2,MAST);
      P(g,mx-3,mBot-3,9,3,MRD);P(g,mx-3,mBot-3,9,1,MR);
      for(let y=mTop;y<mBot-3;y++){P(g,mx,y,3,1,rw(y,mBot));P(g,mx+2,y,1,1,shade(rw(y,mBot),-40));if(y%5===0)P(g,mx+1,y,1,1,shade(rw(y,mBot),-60));}
      P(g,mx-3,40,2,6,WH);P(g,mx+4,40,2,6,'#d0d0ca');P(g,mx-3,40,2,1,LAT);P(g,mx+4,40,2,1,LAT);
      disc(g,mx+5,66,2,'#d8dce4');P(g,mx+3,66,2,1,MAST);
      P(g,mx+1,mTop-3,1,3,MAST);
      P(g,mx,mTop,3,1,'#e04a3a');P(g,mx,58,3,1,'#e04a3a');
      if(ng){P(ng,mx,mTop-1,3,3,'#ff5a4a');P(ng,mx+1,mTop-2,1,1,'#ffb0a8');P(ng,mx,57,3,3,'#ff5a4a');}
      finish(K,2,base,st,nt,ax,ay,OL,false,gg=>{const c='rgba(64,68,78,.62)';
        for(const a of anchors)for(const yy of [24,58,90]){if(a[0]===22&&yy===90)continue;line(gg,mx+1,yy,a[0],a[1]-1,c);}});}
  })();}catch(e){console.error('v574 k89',e);}

  /* ======================== k103 天際觀景餐廳 ======================== */
  try{(function(){const K=103,OL=[58,62,72];
    const TW='#c8ccd4',TWL='#e0e4ea',TWD='#a8acb8',TWDD='#8890a0',DISC='#d8dce4',DISCU='#b8bcc8',ANT='#8a8a92';
    const GLS=['#9fd0f0','#7fb0d8','#5f88b0'],TPAL=[TWL,TW,TWD,TWDD],DPAL=['#eef0f2',DISC,DISCU,'#9aa0ac'];
    /* v1：細腰針塔——玻璃入口圓亭＋三足收腰塔身（膠囊電梯）＋大飛碟餐廳（環窗）＋頂冠桅杆，比 v0 高出一截 */
    {const W=72,H=136,ax=36,ay=134,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      ell(base.g,36,ay-16,21,10,'#aca696');ell(base.g,36,ay-16,19,9,'#bab4a4');
      // 玻璃入口圓亭
      cyl(g,36,ay-12,12,6,8,DPAL,'#c0c4cc','#e8ecf0');
      cylBand(g,ng,36,ay-12,12,6,2,4,GLS,TWDD,3,'#ffd98a');
      P(g,34,ay-12,4,6,'#5a3a24');P(g,33,ay-13,6,1,TWDD);
      if(ng)P(ng,34,ay-11,4,4,'#ffc870');
      // 塔身（立在圓亭頂心）
      const yb0=ay-20,yt0=ay-97,Hs=yb0-yt0;
      for(let y=yt0;y<=yb0;y++){const t=(yb0-y)/Hs;const hw=t<.62?R(2+5*(.62-t)/.62):R(2+3*(t-.62)/.38);
        for(let dx=-hw;dx<=hw;dx++){const u=dx/(hw+.5);P(g,36+dx,y,1,1,u<-.45?TWL:u<.15?TW:u<.6?TWD:TWDD);}
        if(t<.5&&hw>=4){P(g,33,y,1,1,'#8a90a0');P(g,34,y,1,1,'#6a7080');P(g,38,y,1,1,'#5a6070');P(g,39,y,1,1,TWDD);}}
      P(g,33,ay-66,7,1,TWDD);P(g,34,ay-65,5,1,TWL);                           // 收腰環
      P(g,37,ay-56,2,4,'#dbb42c');P(g,37,ay-56,1,1,'#f0d060');                  // 膠囊電梯
      if(ng)P(ng,37,ay-56,2,4,'#ffe2a0');
      // 飛碟餐廳
      const ys=ay-100;
      ell(g,36,ys+4,17,6,TWD);ell(g,36,ys+6,9,3,TWDD);
      cyl(g,36,ys+1,20,7,6,DPAL,null);
      cylBand(g,ng,36,ys+1,20,7,1,4,GLS,TWDD,4,'#ffd98a');
      ell(g,36,ys-5,20,7,DISC);for(let dx=-19;dx<=19;dx++){const u=dx/20.5,e=R(7*Math.sqrt(Math.max(0,1-u*u)));P(g,36+dx,ys-5+e,1,1,dx<0?'#f2f4f6':DISCU);}
      ell(g,36,ys-7,13,4,'#e4e8ec');
      cyl(g,36,ys-8,5,2,4,DPAL,'#eef0f2');
      P(g,36,ys-30,1,18,ANT);P(g,35,ys-20,3,1,ANT);P(g,35,ys-15,3,1,ANT);
      P(g,35,ys-32,3,2,'#e04a3a');if(ng)P(ng,35,ys-32,3,2,'#ff6a5a');
      {const p=G(15,4);lamp(g,ng,p[0],p[1],8,'#8a8a92','#e8e0c0','#ffe9b0');}
      {const p=G(4,15);lamp(g,ng,p[0],p[1],8,'#8a8a92','#e8e0c0','#ffe9b0');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：矮胖旋轉餐廳——兩層玻璃商場裙樓（屋頂花台）＋粗混凝土筒身（觀光電梯縫）＋上下兩層玻璃圓鼓＋天線 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#9a9484','#8a8478','#aca696');
      const SP=G(14,14);box(g,SP,12,12,12,'#d8dce4','#b0b4c0','#c4c8d0');
      for(const d0 of [2,6,15,19]){faceRect(g,SP,-1,d0,3,3,6,'#7fb0d8');if(ng)faceRect(ng,SP,-1,d0,3,3,6,'#ffd98a');}
      for(const d0 of [2,6,10,14,18]){faceRect(g,SP,1,d0,3,3,6,'#5f88b0');if(ng)faceRect(ng,SP,1,d0,3,3,6,'#e8c070');}
      faceRect(g,SP,-1,10,4,0,8,'#3a4652');band(g,SP,-1,9,15,8,1,TWDD);             // 入口＋雨庇
      if(ng)faceRect(ng,SP,-1,10,4,0,6,'#ffc870');
      band(g,SP,-1,0,24,11,1,'#eef0f2');band(g,SP,1,0,24,11,1,'#c8ccd4');
      for(const q of [[4,12],[12,4]]){const p=G(q[0],q[1],12);P(g,p[0]-2,p[1]-3,5,3,'#6a9a56');P(g,p[0]-1,p[1]-4,3,1,'#7aac62');P(g,p[0]+1,p[1]-2,2,2,'#4a7a3c');}
      // 筒身
      cyl(g,36,ay-28,6,3,36,TPAL,null);
      for(let y=ay-60;y<=ay-34;y++)P(g,33,y,1,1,(y%4)?'#7fb0d8':TWDD);
      if(ng)for(let y=ay-60;y<=ay-34;y++)if(y%4)P(ng,33,y,1,1,'#ffe2a0');
      // 下層旋轉餐廳圓鼓
      const b1=ay-62;ell(g,36,b1+2,15,6,'#7a8090');
      cyl(g,36,b1,17,7,10,DPAL,'#b8bcc8','#dde0e4');
      cylBand(g,ng,36,b1,17,7,2,6,GLS,TWDD,3,'#ffd98a');
      // 上層觀景圓鼓
      const b2=b1-10;cyl(g,36,b2-1,11,5,7,DPAL,DISC,'#f0f2f4');
      cylBand(g,ng,36,b2-1,11,5,1,4,GLS,TWDD,3,'#ffe2a0');
      cyl(g,36,b2-8,4,2,3,DPAL,'#eef0f2');
      P(g,36,b2-28,1,17,ANT);P(g,35,b2-22,3,1,ANT);
      P(g,35,b2-30,3,2,'#e04a3a');if(ng)P(ng,35,b2-30,3,2,'#ff6a5a');
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k103',e);}

  /* ======================== k71 噴泉廣場 ======================== */
  try{(function(){const K=71,OL=[28,22,16];
    const SH='#e8dcc8',SM='#b8a88c',SDK='#907c64',RIM='#d8ccb8',WA='#5a82a8',WL='#80b0e0',WS='#a8d4f0',SPAL=['#efe4d2',SH,SM,SDK];
    // 拋物線水柱：(x0,y0)→(x1,y1)，頂點高 hk（每 2px 一點）
    function jet(g,x0,y0,x1,y1,hk,c){const n=Math.max(6,2*R(Math.abs(x1-x0)+hk));for(let q=0;q<=n;q+=1){const t=q/n,x=R(x0+(x1-x0)*t),y=R(y0+(y1-y0)*t-hk*4*t*(1-t));P(g,x,y,1,1,c);}}
    /* v1：低矮寬池＋雕像噴泉——橢圓大池（矮石緣）＋中央台座捧貝女神像＋兩側拱形水柱＋兩盞池畔燈 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#b0a89a','#a09888','#c6beae');
      cyl(g,36,ay-16,22,11,4,SPAL,RIM);
      ell(g,36,ay-20,20,9,'#8a7c68');ell(g,36,ay-19,20,8,WA);
      for(const q of [[20,ay-21,4],[46,ay-15,5],[27,ay-14,3],[49,ay-23,3],[33,ay-25,4]])P(g,q[0],q[1],q[2],1,WL);
      P(g,24,ay-18,2,1,WS);P(g,42,ay-13,2,1,WS);
      // 台座＋女神像
      cyl(g,36,ay-18,5,2,7,SPAL,SH);
      // 肩扛水瓶的著袍女像（左臂垂、右臂托瓶、瓶口朝右下傾水）：逐列區段＋自動分件受光；袍擺落在台座頂 (36,85)
      const fx0=31,fy0=ay-43;
      spanSprite(g,fx0,fy0,[
        [0,3,4,'Hr'],[1,3,4,'B'],[2,3,4,'B'],[3,4,4,'B'],                                             // 髮＋頭＋頸
        [4,2,5,'B'],[5,2,5,'B'],[6,2,5,'B'],[7,2,5,'B'],[8,2,5,'B'],[9,2,5,'B'],                       // 肩＋軀幹
        [5,1,1,'B'],[6,1,1,'B'],[7,1,1,'B'],[8,1,1,'B'],[9,1,1,'B'],                                  // 垂臂
        [10,2,6,'B'],[11,2,6,'B'],[12,2,6,'B'],[13,2,6,'B'],[14,1,6,'B'],[15,1,7,'B'],[16,1,7,'B'],[17,1,7,'B'], // 袍擺
        [12,4,4,'L'],[13,4,4,'L'],[14,4,4,'L'],[15,5,5,'L'],[16,5,5,'L'],[17,4,4,'L'],                // 衣褶
        [5,6,6,'B'],[6,6,7,'B'],                                                                      // 腰側托瓶臂
        [5,8,9,'U'],[6,7,10,'U'],[7,7,10,'U'],[8,8,10,'U'],[9,9,10,'U'],[10,10,11,'U']               // 水瓶（瓶口朝右下）
      ],{B:{base:SH,top:'#f6eee0',left:'#f6eee0',bot:SM,right:'#cdbfa4',hi:'#fffaf0'},U:{base:'#d0c2a8',top:'#efe4d2',left:'#e4d8c2',bot:SDK,right:SM,hi:'#f6eee0'},L:'#cdbfa4',Hr:'#c8b89c'});
      jet(g,fx0+12,fy0+10,50,ay-20,3,WS);jet(g,fx0+12,fy0+11,47,ay-20,2,WL);
      jet(g,16,ay-22,30,ay-24,10,WS);jet(g,56,ay-22,42,ay-24,10,WS);
      if(ng){ell(ng,36,ay-19,9,3,'rgba(128,176,216,.75)');ell(ng,36,ay-19,5,1,'#a8d0e8');}         // 池面夜光：與 v0（14×3＋8×2）同量級
      {const p=G(15,3);lamp(g,ng,p[0],p[1],10,'#4a4640','#e8d080','#ffe9a0');}
      {const p=G(3,15);lamp(g,ng,p[0],p[1],10,'#4a4640','#e8d080','#ffe9a0');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：方形階池方尖碑噴泉——外方池＋內高台池＋金頂方尖碑（四面獅口吐水）＋兩角絲柏花箱 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#b0a89a','#a09888','#c6beae');
      const cyp=(q)=>{const S=G(q[0],q[1]);box(g,S,2,2,4,SM,SDK,RIM,{noAO:1});const tx=S[0],ty=S[1]-6;
        for(let r=0;r<14;r++){const hw=r<3?R(r*.7+.5):R(2.6-(r-3)*.2);P(g,tx-hw,ty-r,hw+1,1,'#5a8a48');P(g,tx+1,ty-r,Math.max(0,hw),1,'#3e6a34');}
        P(g,tx-1,ty-9,1,4,'#6fa05a');};
      box(g,G(14,14),12,12,3,SH,SM,null);
      topFace(g,[36,ay-7],12,12,RIM,SM,'#f0e6d4');topFace(g,G(13,13,3),10,10,WA,'#46698c',null);
      for(const q of [[5,12],[11,5],[12,11]]){const p=G(q[0],q[1],3);P(g,p[0]-2,p[1],4,1,WL);}
      box(g,G(11,11,3),6,6,5,SH,SM,null,{noAO:1});
      topFace(g,G(11,11,8),6,6,RIM,SM,'#f0e6d4');topFace(g,G(10,10,8),4,4,WA,'#46698c',null);
      box(g,G(9,9,8),2,2,6,SH,SM,RIM,{noAO:1});
      const yb=ay-28;
      for(let r=0;r<32;r++){const hw=R(4-2*r/31),y=yb-r;P(g,36-hw,y,hw,1,r%9===4?SM:SH);P(g,36,y,hw,1,r%9===4?SDK:SM);P(g,36-hw,y,1,1,'#f4ecdc');}
      for(let r=0;r<4;r++){const hw=Math.max(0,2-(r>>1));P(g,36-hw,yb-32-r,hw,1,'#ecc94c');P(g,36,yb-32-r,Math.max(1,hw),1,'#b8902c');}
      P(g,36,yb-36,1,1,'#ecc94c');
      P(g,32,yb+3,2,2,SDK);P(g,39,yb+3,2,2,'#6a5a48');
      jet(g,32,yb+4,27,ay-20,3,WL);jet(g,40,yb+4,45,ay-20,3,WL);
      P(g,26,ay-19,3,1,WS);P(g,44,ay-19,3,1,WS);
      if(ng){topFace(ng,G(10,10,8),4,4,'#80b0d8',null,null);P(ng,24,ay-14,6,1,'#80b0d8');P(ng,43,ay-14,6,1,'#80b0d8');}
      cyp([4,16]);cyp([16,4]);
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k71',e);}

  /* ======================== k184 節慶市集 ======================== */
  /* 夜間疊加層（drawNightFestival517）固定在 v0 位置畫：燈籠光 x20/30/40/50 y84–88、攤檯暖光 x18–33 y96–106、風旗 x15 y68。
     兩個變體都把燈籠串與左前攤檯留在同一處，讓疊加光落在實體燈具上。 */
  try{(function(){const K=184,OL=[28,22,16];
    const PO='#8a5a34',POL='#a06a3e',LR='#e04838',LRD='#c23828',LG='#e8c05a',CR='#f2e6cc',CRD='#d6c8aa',RD='#d84e40',RDD='#a8382e',WD='#c87848',WDD='#a05a30';
    const lantern=(g,ng,x,y)=>{P(g,x,y,5,4,LR);P(g,x,y,1,4,'#ec6a58');P(g,x,y+4,5,1,LRD);P(g,x+1,y-1,1,1,LG);P(g,x+2,y+4,2,1,LG);
      if(ng){P(ng,x,y,5,4,'#ff9a3a');P(ng,x+1,y,2,2,'#ffd06a');}};
    const cobble=(bg,G)=>{for(const q of [[4,8],[8,4],[10,12],[13,9],[6,13],[13,4],[3,3],[9,9]]){const p=G(q[0],q[1]);P(bg,p[0]-1,p[1],3,1,'#97875f');}};
    const post=(g,x,yb,yt)=>{P(g,x,yt,2,yb-yt,PO);P(g,x,yt,1,yb-yt,POL);P(g,x-1,yt,4,1,'#6a4428');};
    /* v1：大篷市集——紅白條紋方錐大帳篷（開口見攤貨）＋頂旗、兩柱燈籠串、左前條紋遮陽攤、右前貨箱 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#a89878','#84744f','#bcac8a');cobble(base.g,G);
      // 大帳篷
      {const S=G(11,10),hh=9;box(g,S,10,10,hh,CR,CRD,null);
        for(let d=0;d<20;d++)if(d%4<2){faceRect(g,S,-1,d,1,0,hh,RD);faceRect(g,S,1,d,1,0,hh,RDD);}
        faceRect(g,S,-1,6,8,0,7,'#3a2a20',true);band(g,S,-1,6,14,2,1,WD);
        for(const q of [[7,'#e8a03a'],[9,'#7ab648'],[11,CR],[12,'#e8a03a']])faceRect(g,S,-1,q[0],1,3,2,q[1]);
        if(ng){faceRect(ng,S,-1,6,8,1,5,'rgba(255,170,80,.75)',true);}
        const Se=[S[0],S[1]-hh+1],We=[S[0]-22,S[1]-hh-10],Ee=[S[0]+22,S[1]-hh-10],ap=[S[0],S[1]-hh-46];
        for(let q=0;q<6;q++){const a=[R(We[0]+(Se[0]-We[0])*q/6),R(We[1]+(Se[1]-We[1])*q/6)],b=[R(We[0]+(Se[0]-We[0])*(q+1)/6),R(We[1]+(Se[1]-We[1])*(q+1)/6)];poly(g,[a,b,ap],q%2?CR:RD);}
        for(let q=0;q<6;q++){const a=[R(Se[0]+(Ee[0]-Se[0])*q/6),R(Se[1]+(Ee[1]-Se[1])*q/6)],b=[R(Se[0]+(Ee[0]-Se[0])*(q+1)/6),R(Se[1]+(Ee[1]-Se[1])*(q+1)/6)];poly(g,[a,b,ap],q%2?CRD:RDD);}
        line(g,We[0],We[1],Se[0],Se[1],'#8a3a2a');line(g,Se[0],Se[1],Ee[0],Ee[1],'#7a3024');
        for(let x=We[0]+1;x<Ee[0];x+=4){const y=x<=Se[0]?R(We[1]+(x-We[0])/2):R(Se[1]-(x-Se[0])/2);P(g,x,y+1,2,1,x<=Se[0]?RD:RDD);}
        P(g,ap[0],ap[1]-7,1,8,'#6a4a30');P(g,ap[0]+1,ap[1]-7,5,1,'#4a90b8');P(g,ap[0]+1,ap[1]-6,3,1,'#4a90b8');P(g,ap[0]+1,ap[1]-5,1,1,'#4a90b8');
        P(g,ap[0]-1,ap[1]-1,3,2,LG);}
      // 燈籠串（左柱頂 x13–14 y70 接夜間風旗）
      post(g,13,97,70);post(g,59,97,74);
      for(let x=15;x<=58;x++){const t=(x-15)/43;P(g,x,R(71+2*t+16*t*(1-t)),1,1,'#5a4030');}
      for(const lx of [20,30,40,50]){const t=(lx+2-15)/43,sy=R(71+2*t+16*t*(1-t));P(g,lx+2,sy+1,1,79-sy-1,'#5a4030');lantern(g,ng,lx,80);}
      // 左前條紋遮陽攤
      {const L2=mk(W,H),g=L2.g;const S=G(11,16);box(g,S,5,3,6,WD,WDD,'#d89060');   // 攤位獨立一層先描邊，與後方條紋大篷分件
        P(g,S[0],S[1]-17,1,11,PO);P(g,S[0]-10,S[1]-5-17,1,11,PO);
        for(let d=0;d<10;d++){const x=S[0]-1-d,y=fy(S,d)-17;P(g,x,y,1,3,(d>>1)%2?'#ece4d4':'#4a90b8');if(d%2===0)P(g,x,y+3,1,1,(d>>1)%2?'#ece4d4':'#4a90b8');}
        for(let d=0;d<6;d++){const x=S[0]+d,y=fy(S,d)-17;P(g,x,y,1,3,(d>>1)%2?'#c8c0b0':'#3a7098');if(d%2===1)P(g,x,y+3,1,1,(d>>1)%2?'#c8c0b0':'#3a7098');}
        topFace(g,[S[0],S[1]-17],5,3,'#5aa0c8',null,'#7ab8d8');
        P(g,19,95,3,2,CR);P(g,23,96,2,2,'#e8a03a');P(g,27,96,2,2,'#7ab648');
        if(ng){faceRect(ng,S,-1,0,10,0,6,'rgba(255,150,60,.55)');P(ng,19,95,3,2,'#ffd06a');}
        A.outlineSprite(L2.c,OL[0],OL[1],OL[2]);st.g.drawImage(L2.c,0,0);}
      box(g,G(16,11),2,2,4,'#7a5434','#5a3c24','#8a6440');box(g,G(15,13),2,2,3,'#8a5a34','#6a4428','#c23828');
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：三間牌樓夜市——四柱三間紅牌樓（中高側低歇山瓦頂＋金匾）、燈籠分掛三間、左前傘攤、右前幡旗與貨箱 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      const PR='#c84030',PRL='#e05a48',PRD='#962c22',TL='#4a5a58',TLL='#62746f',TLD='#2e3a38';
      plate(base.g,ax,ay,'#a89878','#84744f','#bcac8a');cobble(base.g,G);
      for(let y=86;y<=104;y+=3)P(base.g,34,y,4,1,'#b8a888');
      const pillar=(x,yt)=>{P(g,x-2,93,6,3,'#a8a090');P(g,x-2,93,6,1,'#c8c0b0');P(g,x,yt,2,93-yt,PR);P(g,x,yt,1,93-yt,PRL);P(g,x+2,yt,1,93-yt,PRD);};
      pillar(13,66);pillar(25,58);pillar(46,58);pillar(58,66);
      const roof=(y0,rows,xl,xr)=>{for(let r=0;r<rows;r++){const a=xl-r,b=xr+r;P(g,a,y0+r,b-a+1,1,TL);for(let x=a+1;x<b;x++)if((x&1)===0)P(g,x,y0+r,1,1,TLL);}
        P(g,xl-rows,y0+rows-1,xr-xl+2*rows+1,1,TLD);P(g,xl-rows-1,y0+rows-2,1,1,TLD);P(g,xr+rows+1,y0+rows-2,1,1,TLD);
        P(g,xl-1,y0-1,xr-xl+3,1,TLD);P(g,xl-2,y0-2,2,1,LG);P(g,xr+1,y0-2,2,1,LG);};
      P(g,11,66,19,3,PR);P(g,11,68,19,1,PRD);P(g,42,66,19,3,PR);P(g,42,68,19,1,PRD);
      roof(60,6,15,25);roof(60,6,46,56);
      P(g,23,58,26,3,PR);P(g,23,60,26,1,PRD);
      roof(49,9,28,43);P(g,34,44,4,3,LG);P(g,35,43,2,1,'#f4d878');
      P(g,32,61,8,6,'#6a3a24');P(g,33,62,6,4,LG);P(g,34,63,4,1,'#8a5a24');P(g,34,64,2,1,'#8a5a24');
      for(const q of [[20,69],[30,61],[40,61],[50,69]]){P(g,q[0]+2,q[1],1,79-q[1],'#5a4030');lantern(g,ng,q[0],80);}
      // 左前傘攤
      {const L2=mk(W,H),g=L2.g;const S=G(12,16);box(g,S,6,2,5,WD,WDD,'#d89060');   // 傘攤獨立一層先描邊，與後方紅柱分件P(g,17,96,3,2,CR);P(g,22,97,2,2,'#e8a03a');P(g,26,98,2,1,'#7ab648');
        P(g,22,86,1,11,'#6a4a30');
        for(let r=0;r<4;r++){const hw=3+r*2;for(let dx=-hw;dx<=hw;dx++)P(g,22+dx,83+r,1,1,((dx+16)>>2)%2?CR:RD);}
        P(g,15,87,15,1,RDD);P(g,21,82,3,1,RD);
        if(ng){faceRect(ng,S,-1,0,12,0,5,'rgba(255,150,60,.55)');P(ng,17,96,3,2,'#ffd06a');}
        A.outlineSprite(L2.c,OL[0],OL[1],OL[2]);st.g.drawImage(L2.c,0,0);}
      // 右前幡旗＋貨箱
      P(g,57,82,1,19,'#6a4a30');P(g,54,83,3,10,RD);P(g,54,83,1,10,'#ec6a58');P(g,55,85,1,1,LG);P(g,55,88,1,1,LG);P(g,53,82,5,1,'#6a4a30');
      box(g,G(15,12),2,2,4,'#7a5434','#5a3c24','#8a6440');box(g,G(16,9),2,3,3,'#8a5a34','#6a4428','#e8b44a');
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k184',e);}

  /* ======================== k180 熱氣球基地 ======================== */
  /* 夜間疊加層在 (36, ay-58) 畫球體呼吸光暈（±4px 擺動），兩個變體球心都留在該處。 */
  try{(function(){const K=180,OL=[28,22,16];
    const BK='#a87838',BKD='#8a6028',BKL='#c89a58',ROPE='#5a4a34';
    const grass=(bg,G)=>{for(const q of [[4,6],[9,3],[12,11],[6,12],[14,6],[3,10]]){const p=G(q[0],q[1]);P(bg,p[0]-2,p[1],4,1,'#7d9c5c');}};
    const bplate=(bg,ax,ay,G)=>{plate(bg,ax,ay,'#8fae6a','#77965a','#a2c07c');grass(bg,G);};
    /* v1：彩虹淚滴球＋機庫——橫帶彩虹熱氣球（梨形、經線縫）＋吊籃燃燒器＋雙繫留繩、圓木升空坪、右後山牆機庫、風向袋、燃料罐 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      bplate(base.g,ax,ay,G);
      // 機庫（右後；長邊朝左，山牆大門朝右前）
      {const S=G(16,6),hh=10;box(g,S,6,5,hh,'#c8b090','#a89070',null);
        const eS=[S[0],S[1]-hh],eE=[S[0]+10,S[1]-hh-5],pk=[S[0]+5,S[1]-hh-9];
        poly(g,[eS,eE,pk],'#b09878');
        poly(g,[[eS[0]-1,eS[1]+1],pk,[pk[0]-12,pk[1]-6],[eS[0]-13,eS[1]-5]],'#8a8a90');
        for(let q=1;q<6;q++)line(g,eS[0]-2*q,eS[1]-q,pk[0]-2*q,pk[1]-q,'#9c9ca4');
        line(g,eS[0]-1,eS[1]+1,eS[0]-13,eS[1]-5,'#62626a');line(g,pk[0],pk[1],pk[0]-12,pk[1]-6,'#b8b8c0');line(g,eS[0],eS[1],pk[0],pk[1],'#b8b8c0');line(g,pk[0],pk[1],eE[0],eE[1],'#6a6a72');
        faceRect(g,S,1,2,6,0,8,'#4a3a2a');for(let d=2;d<8;d+=2)faceRect(g,S,1,d,1,0,8,'#5a4632');faceRect(g,S,1,2,6,8,1,'#8a6a4a');
        faceRect(g,S,-1,3,2,4,3,'#5a6a78');faceRect(g,S,-1,8,2,4,3,'#5a6a78');
        if(ng){faceRect(ng,S,-1,3,2,4,3,'#ffca6a');faceRect(ng,S,-1,8,2,4,3,'#ffca6a');}}
      // 圓木升空坪
      ell(g,36,ay-16,14,7,'#8a6840');ell(g,36,ay-17,13,6,'#b08858');
      for(const y of [ay-21,ay-18,ay-15,ay-12]){const hw=R(13*Math.sqrt(Math.max(0,1-Math.pow((y-(ay-17))/6.5,2))));P(g,36-hw+1,y,2*hw-1,1,'#9a7448');}
      // 風向袋（左）
      {const p=G(2,14);P(g,p[0],p[1]-22,1,22,'#8a8a90');P(g,p[0]+1,p[1]-22,6,3,'#e87830');P(g,p[0]+3,p[1]-22,2,3,'#f2e6cc');P(g,p[0]+7,p[1]-21,2,2,'#d46020');}
      // 燃料罐（左前）
      {const p=G(9,15);P(g,p[0]-5,p[1]-8,4,8,'#9a9a94');P(g,p[0]-5,p[1]-8,1,8,'#b8b8b2');P(g,p[0]-5,p[1]-9,4,1,'#c04030');
        P(g,p[0],p[1]-6,4,6,'#8a8a84');P(g,p[0],p[1]-6,1,6,'#aaaaa4');P(g,p[0],p[1]-7,4,1,'#c04030');
        if(ng){P(ng,p[0]-4,p[1]-9,2,1,'#ff7a50');}}
      // 繫留繩＋吊籃
      line(g,30,83,17,99,ROPE);line(g,42,83,55,99,ROPE);P(g,16,99,2,2,'#5a4a34');P(g,54,99,2,2,'#5a4a34');
      P(g,29,77,14,7,BK);for(let i=0;i<3;i++)P(g,29,78+i*2,14,1,BKD);P(g,28,76,16,1,'#6a4a20');P(g,29,77,14,1,BKL);P(g,29,77,1,7,BKL);
      for(const q of [[30,31],[34,34],[38,38],[42,41]])line(g,q[0],71,q[1],75,ROPE);
      P(g,34,72,4,3,'#6a6a70');P(g,34,72,1,3,'#8a8a92');P(g,35,71,2,1,'#f0a030');
      // 淚滴球體（橫向彩虹帶＋三條經線縫）
      const bc=['#f0c848','#eb9a3a','#d84e40','#9a5ab0','#4a98c0'],yT=28,yE=46,Rb=17,yB=69;
      for(let y=yT;y<=yB;y++){let r;if(y<=yE+8)r=Math.sqrt(Math.max(0,Rb*Rb-(y-yE)*(y-yE)));else{const r0=Math.sqrt(Rb*Rb-64);r=r0+(4.5-r0)*(y-yE-8)/(yB-yE-8);}
        r=R(r);if(r<1)continue;const band=bc[Math.min(4,Math.floor((y-yT)*5/(yB-yT+1)))];
        for(let dx=-r;dx<=r;dx++){const u=dx/(r+.5);P(g,36+dx,y,1,1,u<-.55?shade(band,18):u>.5?shade(band,-28):band);}
        for(const sN of [-.62,0,.62])P(g,36+R(r*sN),y,1,1,shade(band,-20));
        if(y>=33&&y<=50)P(g,36-R(r*.42),y,1,1,shade(band,34));}
      P(g,32,70,9,1,'#6a4a30');
      if(ng){for(let y=48;y<=69;y++){let r=y<=yE+8?Math.sqrt(Rb*Rb-(y-yE)*(y-yE)):Math.sqrt(Rb*Rb-64)+(4.5-Math.sqrt(Rb*Rb-64))*(y-yE-8)/(yB-yE-8);r=R(r)-2;if(r<1)continue;
          ng.fillStyle='rgba(255,196,120,'+(.25+.5*(y-48)/21).toFixed(2)+')';ng.fillRect(36-r,y,2*r+1,1);}
        P(ng,34,70,4,3,'#ffb040');}
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：繫留氦氣球遊覽站——網格圓球（赤道紅帶）＋環形吊艙＋單纜絞盤、圓形起降環與護欄、左前售票亭 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      bplate(base.g,ax,ay,G);
      ell(base.g,36,ay-16,17,8,'#a8a090');ell(base.g,36,ay-16,16,7,'#c8c0b0');ell(base.g,36,ay-16,11,5,'#b4ac9c');
      // 售票亭（左）
      {const S=G(4,16);box(g,S,4,5,10,'#e8e0d0','#c8c0b0',null);
        const T=[S[0],S[1]-10];box(g,[T[0],T[1]+1],5,6,2,'#4aa8b0','#34868e','#5cc0c8',{noAO:1,noCorner:1});
        faceRect(g,S,1,3,5,4,4,'#3a4652');faceRect(g,S,1,3,5,3,1,'#8a8a92');faceRect(g,S,-1,2,4,0,7,'#6a5040');
        P(g,T[0]-3,T[1]-8,8,4,'#d84e40');P(g,T[0]-2,T[1]-7,6,2,'#f2e6cc');P(g,T[0]-2,T[1]-4,1,2,'#6a6a70');P(g,T[0]+3,T[1]-4,1,2,'#6a6a70');
        if(ng){faceRect(ng,S,1,3,5,4,4,'#ffd98a');}}
      // 起降環護欄（前半）＋絞盤
      for(let a=12;a<=168;a+=3){const rad=a*Math.PI/180,x=R(36+18*Math.cos(rad)),y=R(ay-16+9*Math.sin(rad));P(g,x,y-3,1,1,'#8a8a92');if(a%24===12)P(g,x,y-3,1,3,'#6a6a70');}
      cyl(g,36,ay-16,3,1,3,['#9a9aa0','#7a7a82','#5a5a60','#4a4a50'],'#a8a8b0');
      P(g,36,80,1,11,'#4a4a50');P(g,37,80,1,11,'#6a6a70');
      // 環形吊艙
      cyl(g,36,78,9,3,3,['#6cc4cc','#4aa8b0','#34868e','#2a6a70'],'#e8e0d0');ell(g,36,75,5,1,'#3a5a60');
      for(let dx=-8;dx<=8;dx+=2){const e=R(3*Math.sqrt(Math.max(0,1-(dx/9.5)*(dx/9.5))));P(g,36+dx,75+e-3,1,2,'#d8d0c0');}
      if(ng){for(let dx=-8;dx<=8;dx+=2){const e=R(3*Math.sqrt(Math.max(0,1-(dx/9.5)*(dx/9.5))));P(ng,36+dx,78+e-2,1,1,'#ffe2a0');}}
      for(const q of [[25,58,28,75],[47,58,44,75],[31,64,32,75],[41,64,40,75]])line(g,q[0],q[1],q[2],q[3],'#6a6a70');
      // 網格球體
      const cx=36,cy=49,Rs=17,SP=['#fffaee','#f2e6cc','#dccca8','#bcaa88'];
      for(let y=cy-Rs;y<=cy+Rs;y++){const dy=y-cy,r=R(Math.sqrt(Math.max(0,Rs*Rs+Rs*.6-dy*dy)));if(r<1)continue;
        for(let dx=-r;dx<=r;dx++){const nx=dx/(Rs+.5),ny=dy/(Rs+.5),nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),l=-.55*nx-.45*ny+.7*nz;
          let c=SP[l>.72?0:l>.38?1:l>.05?2:3];if(dy>=-1&&dy<=2)c=l>.55?'#e86a58':l>.2?'#d84e40':l>-.1?'#b03a30':'#8a2e26';P(g,cx+dx,y,1,1,c);}
        if(dy%5===0&&(dy<-1||dy>2))for(let dx=-r+1;dx<=r-1;dx+=1)if((dx&1)===0)P(g,cx+dx,y,1,1,shade(l0(dx/(Rs+.5),dy/(Rs+.5)),-16));
        for(const m of [-.78,-.4,0,.4,.78]){const x=cx+R(r*m);if(dy<-1||dy>2)P(g,x,y,1,1,shade(l0(m*r/(Rs+.5),dy/(Rs+.5)),-16));}}
      function l0(nx,ny){const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),l=-.55*nx-.45*ny+.7*nz;return SP[l>.72?0:l>.38?1:l>.05?2:3];}
      P(g,34,cy-Rs-1,5,2,'#8a8a92');P(g,36,cy-Rs-2,1,1,'#e04a3a');if(ng)P(ng,35,cy-Rs-3,3,2,'#ff6a5a');
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k180',e);}

  /* ======================== k186 夜光花園 ======================== */
  try{(function(){const K=186,OL=[28,22,16];
    const PL='#6fbf7f',BED='#6a9a56',BED2='#5a8a48',POLE='#b0a890',LH='#bff2d8',STN='#9a9080';
    const gplate=(bg,ax,ay,G)=>{plate(bg,ax,ay,'#5f8a52','#4c7342','#71a060');for(const q of [[4,6],[10,3],[13,11],[3,12]]){const p=G(q[0],q[1]);P(bg,p[0],p[1]-2,2,3,'#5d8a4e');}};
    const flower=(g,ng,x,y,col,glow)=>{P(g,x-1,y-2,3,3,PL);P(g,x,y-3,1,1,col);P(g,x-1,y-2,1,1,col);if(ng)P(ng,x-1,y-3,3,4,glow);};
    const glowLamp=(g,ng,x,yb)=>{P(g,x,yb-8,2,8,POLE);P(g,x,yb-8,1,8,'#c8c0a8');P(g,x-1,yb-11,4,3,LH);P(g,x,yb-10,2,1,'#e8fff4');if(ng)P(ng,x-1,yb-11,4,3,'rgba(200,255,230,.9)');};
    /* v1：玻璃溫室花園——石基八角玻璃溫室（白框、穹頂＋小燈亭，內見綠植）、前方彎月花床兩座、石徑、兩盞螢光柱燈 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      gplate(base.g,ax,ay,G);
      const cx=42,by=89,FR='#f0f0e8',FRD='#c4c8c0',GP4=['#dcf2ee','#b8e0d8','#90c4bc','#6e9e98'];
      cyl(g,cx,by,11,5,2,['#e0d8c8','#c8c0b0','#a8a090','#8a8274'],null);
      cyl(g,cx,by-2,11,5,10,GP4,null);
      for(const q of [[-6,82],[-1,84],[4,81],[7,85]]){P(g,cx+q[0],q[1],3,2,'#7ab88a');P(g,cx+q[0]+1,q[1]-1,1,1,'#8cd09a');}
      for(let dx=-10;dx<=10;dx+=4){const u=dx/11.5,e=R(5*Math.sqrt(Math.max(0,1-u*u)));P(g,cx+dx,by-12+e,1,10,dx<2?FR:FRD);}
      for(let dx=-11;dx<=11;dx++){const u=dx/11.5,e=R(5*Math.sqrt(Math.max(0,1-u*u)));P(g,cx+dx,by-7+e,1,1,dx<2?FR:FRD);}
      P(g,cx-2,by-5,4,8,'#4a6a60');P(g,cx-3,by-6,6,1,FR);P(g,cx-3,by-5,1,8,FR);P(g,cx+2,by-5,1,8,FRD);
      if(ng){for(let dx=-10;dx<=10;dx++){if(dx%4===2||dx%4===-2)continue;const u=dx/11.5,e=R(5*Math.sqrt(Math.max(0,1-u*u)));ng.fillStyle=dx<3?'rgba(150,255,210,.72)':'rgba(120,230,190,.5)';ng.fillRect(cx+dx,by-11+e,1,3);ng.fillRect(cx+dx,by-6+e,1,3);}
        P(ng,cx-1,by-4,2,5,'rgba(180,255,220,.7)');}
      ell(g,cx,by-12,11,5,FR);
      dome(g,cx,by-12,10,4,12,['#eaf8f4','#c4e8e0','#98ccc4','#78aaa4']);
      for(const dx of [-8,-4,0,4,8])line(g,cx+R(dx*.2),by-23,cx+dx,by-12+R(4*Math.sqrt(Math.max(0,1-(dx/10.5)*(dx/10.5)))),dx<2?FR:FRD);
      P(g,cx-2,by-26,4,3,FR);P(g,cx+1,by-26,1,3,FRD);P(g,cx-1,by-28,2,2,'#c8a040');
      if(ng)P(ng,cx-1,by-25,2,1,'rgba(200,255,230,.8)');
      for(const q of [[33,104],[35,101],[37,98]])P(g,q[0],q[1],4,2,STN);
      ell(g,24,97,11,5,BED);ell(g,24,98,10,4,BED2);
      for(const q of [[17,97,0],[21,99,1],[25,95,0],[29,98,1],[21,94,1],[27,100,0]])flower(g,ng,q[0],q[1],q[2]?'#7ee0d0':'#f0a0c8',q[2]?'rgba(120,255,210,.9)':'rgba(255,170,220,.85)');
      ell(g,45,100,6,3,BED);
      for(const q of [[42,101],[46,99],[49,101]])flower(g,ng,q[0],q[1],'#ffe08a','rgba(255,220,130,.9)');
      glowLamp(g,ng,12,95);glowLamp(g,ng,56,99);
      finish(K,1,base,st,nt,ax,ay,OL);}
    /* v2：粉牆轉角庭園——沿西北、東北兩緣的 L 形白粉牆＋黛瓦壓頂（東北牆月洞門見竹影、西北牆方形漏窗）、牆角圓冠樹、
       左前荷塘（蓮燈）、右前石燈籠、踏石徑通往月洞門、牆腳螢光花帶。v0 是開放花圃，v1 是中央玻璃溫室，v2 是圍合庭院。 */
    {const W=72,H=112,ax=36,ay=110,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      gplate(base.g,ax,ay,G);
      const hh=17,WLc='#ece6d8',WRc='#cdc5b4',PLN='#b4ac9c',PLND='#a09888';
      const SW=G(2,16),SE=G(16,2);                                                  // 西北牆（右面長）、東北牆（左面長）
      box(g,SW,1,15,hh,WLc,WRc,null);box(g,SE,14,1,hh,WLc,WRc,null);
      band(g,SW,1,0,30,0,2,PLND);band(g,SE,-1,0,28,0,2,PLN);                          // 勒腳
      // 月洞門（東北牆）
      const dc=14,up=8,rr=6,rv=6;
      for(let dd=-rr;dd<=rr;dd++)for(let dh=-rv;dh<=rv;dh++){const q=(dd*dd)/(rr*rr+.5)+(dh*dh)/(rv*rv+.5);if(q>1.2)continue;
        const d=dc+dd,x=fx(SE,-1,d),y=fy(SE,d)-up-dh;
        if(q>.74){P(g,x,y,1,1,dd<0?'#b8b0a0':'#a09888');continue;}
        P(g,x,y,1,1,((d%3)===0)?'#5a8a4a':(dh>2?'#2e4e2e':'#3e6a3a'));if(((d%3)===0)&&(dh+20)%4===0)P(g,x,y,1,1,'#7aaa5a');}
      // 方形漏窗（西北牆）
      faceRect(g,SW,1,11,6,6,6,'#a8a090');faceRect(g,SW,1,12,4,7,4,'#4e5e4c');faceRect(g,SW,1,14,1,7,4,'#a8a090');band(g,SW,1,12,16,9,1,'#a8a090');
      // 黛瓦壓頂（兩段牆頂＋外挑瓦簷）
      topFace(g,[SW[0],SW[1]-hh],1,15,'#4a5048',null,null);topFace(g,[SE[0],SE[1]-hh],14,1,'#4a5048',null,null);
      for(let d=0;d<30;d++){const x=fx(SW,1,d),y=fy(SW,d)-hh-2;P(g,x,y,1,2,(d&1)?'#565c54':'#3e443e');}
      for(let d=0;d<28;d++){const x=fx(SE,-1,d),y=fy(SE,d)-hh-2;P(g,x,y,1,2,(d&1)?'#5a6058':'#3e443e');}
      P(g,SW[0]-3,SW[1]-hh-3,3,1,'#3e443e');P(g,SE[0]+1,SE[1]-hh-3,3,1,'#3e443e');       // 簷端起翹
      // 牆角圓冠樹
      {const tx=31,ty=90;P(g,tx,ty-9,2,9,'#6a4a30');P(g,tx,ty-9,1,9,'#8a6a48');P(g,tx-2,ty-1,6,1,'#4a3a28');
        disc(g,tx,ty-15,5,'#3e6a3a');disc(g,tx+4,ty-19,4,'#467a40');disc(g,tx-3,ty-20,4,'#4a7e44');
        P(g,tx-5,ty-22,4,1,'#6a9a56');P(g,tx+2,ty-22,3,1,'#6a9a56');P(g,tx-4,ty-17,2,1,'#5a8a4a');P(g,tx+3,ty-12,4,2,'#2e5030');}
      // 荷塘（左前）
      ell(g,27,100,10,5,'#8a8274');ell(g,27,100,9,4,'#a09888');ell(g,27,100,8,3,'#3a6a70');P(g,22,99,5,1,'#4f8a90');P(g,28,101,4,1,'#4f8a90');
      for(const q of [[21,100,'#f0a0c8'],[29,98,'#7ee0d0'],[31,101,null]]){P(g,q[0],q[1],3,1,'#5a9a48');P(g,q[0]+1,q[1]+1,1,1,'#4a8a3c');
        if(q[2]){P(g,q[0]+1,q[1]-1,1,1,q[2]);if(ng){P(ng,q[0],q[1]-2,3,3,q[2]==='#7ee0d0'?'rgba(120,255,210,.9)':'rgba(255,170,220,.85)');}}}
      // 踏石徑（前緣→月洞門）
      for(const q of [[38,105],[41,101],[44,97],[46,93]])P(g,q[0],q[1],4,2,STN);
      // 石燈籠（右前）
      {const x=52,yb=102;P(g,x-2,yb-2,6,2,'#8a8274');P(g,x-1,yb-7,3,5,'#a8a090');P(g,x-2,yb-11,6,4,'#b8b0a0');P(g,x-1,yb-10,3,2,'#3a3026');
        P(g,x-3,yb-13,8,2,'#8a8274');P(g,x-2,yb-14,6,1,'#9a9284');P(g,x,yb-16,2,2,'#8a8274');
        if(ng)P(ng,x-1,yb-10,3,2,'#ffd98a');}
      // 牆腳螢光花帶
      for(const q of [[13,96,'#7ee0d0'],[19,93,'#f0a0c8'],[60,97,'#ffe08a'],[56,94,'#c8a0f0'],[39,91,'#7ee0d0']])
        flower(g,ng,q[0],q[1],q[2],q[2]==='#ffe08a'?'rgba(255,220,130,.9)':q[2]==='#7ee0d0'?'rgba(120,255,210,.9)':q[2]==='#f0a0c8'?'rgba(255,170,220,.85)':'rgba(210,170,255,.85)');
      finish(K,2,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k186',e);}

  /* @@NEXT@@ */
});
