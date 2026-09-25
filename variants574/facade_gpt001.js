// GPT-001 — Victorian / Edwardian High Street Corner Shop
// 原創像素 facade。研究語彙：Historic England 傳統 shopfront（fascia/cornice/consoles/pilasters/stallriser/recessed doorway）
// 不含任何外部圖片、貼圖或可識別品牌。
(function(){
'use strict';
const REG=window.__facade577=window.__facade577||{}, R=Math.round;
const clamp=(x,a,b)=>x<a?a:x>b?b:x;

function tools001(ctx){
  const A=ctx.A, sh=A.shade;
  const rc=(c,x,y,w,h,col)=>{ w=Math.max(1,R(w)); h=Math.max(1,R(h)); c.fillStyle=col; c.fillRect(R(x),R(y),w,h); };
  const foot=(a,b,x)=>Math.abs(b[0]-a[0])<1e-6?a[1]:a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]);
  const cols=(a,b,fn)=>{const x0=R(Math.min(a[0],b[0])),x1=R(Math.max(a[0],b[0]));for(let x=x0;x<=x1;x++)fn(x,R(foot(a,b,x)));};
  const wall=(c,a,b,h,col)=>{c.fillStyle=col;cols(a,b,(x,y)=>c.fillRect(x,y-h,1,h));};
  const band=(c,a,b,x0,x1,d0,h,col)=>{c.fillStyle=col;for(let x=Math.min(R(x0),R(x1));x<=Math.max(R(x0),R(x1));x++){const y=R(foot(a,b,x));c.fillRect(x,y-d0-h+1,1,h);}};
  const poly=(c,pts,col)=>{let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
    y0=Math.max(0,Math.floor(y0));y1=Math.min(c.canvas.height-1,Math.ceil(y1));c.fillStyle=col;
    for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
      if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      xs.sort((p,q)=>p-q);for(let i=0;i+1<xs.length;i+=2){const xa=Math.ceil(xs[i]-.5),xb=Math.ceil(xs[i+1]-.5);if(xb>xa)c.fillRect(xa,y,xb-xa,1);}}
  };
  return {A,sh,rc,foot,cols,wall,band,poly};
}

function drawCornerShop001(ctx){
  if(window.__noGPTCornerShop001)return false;
  const {A,sh,rc,foot,wall,band,poly}=tools001(ctx);
  const {g,ng,G,v,wallH}=ctx;
  const xW=R(G.W[0]),xS=R(G.S[0]),xE=R(G.E[0]),yS=R(G.S[1]);
  const fw=Math.max(8,Math.abs(xS-xW)), sw=Math.max(5,Math.abs(xE-xS));
  const H=Math.max(24,wallH|0), shopH=clamp(R(H*.34),10,13);
  const BRICK=['#97513f','#a45b46','#88483a','#b06b52'];
  const WOOD=['#214c3b','#5b2028','#243554','#342922'];
  const DOOR=['#1f3c32','#55242a','#1d3150','#36261f'];
  const brick=BRICK[Math.abs(v|0)%BRICK.length], front=sh(brick,9), side=sh(brick,-24);
  const trim='#d6ccb8', stone='#b9ad98', wood=WOOD[(Math.abs(v|0)+1)%WOOD.length], door=DOOR[Math.abs(v|0)%DOOR.length];
  const glass='#668494', glassHi='#9fc2cf', glassSide=sh(glass,-26), lintel=sh(brick,20);

  // 量體：紅磚正面＋陰面；平屋頂藏在 parapet 後，先畫屋面，再畫女兒牆。
  wall(g,G.W,G.S,H,front); wall(g,G.S,G.E,H,side);
  const roof={W:[G.W[0],G.W[1]-H],S:[G.S[0],G.S[1]-H],E:[G.E[0],G.E[1]-H],N:[G.N[0],G.N[1]-H]};
  poly(g,[roof.N,roof.E,roof.S,roof.W],'#4c5158');
  band(g,G.W,G.S,xW,xS,H-1,2,trim); band(g,G.S,G.E,xS,xE,H-1,2,sh(trim,-18));
  band(g,G.W,G.S,xW,xS,H-4,1,stone); band(g,G.S,G.E,xS,xE,H-4,1,sh(stone,-22));

  // 木製 shopfront：stallriser、plate glass、fascia、cornice、pilaster / console。
  const resW=clamp(R(fw*.18),3,5), shopRight=xS-resW-1;
  const glazeL=xW+2, glazeR=Math.max(glazeL+4,shopRight-2);
  band(g,G.W,G.S,glazeL,glazeR,3,3,sh(wood,-18));
  band(g,G.W,G.S,glazeL,glazeR,8,5,glass);
  band(g,G.W,G.S,glazeL,glazeR,8,1,glassHi);
  band(g,G.W,G.S,xW+1,shopRight,11,3,wood);
  band(g,G.W,G.S,xW,shopRight+1,13,1,trim);
  for(const x of [xW+1,shopRight]){const y=R(foot(G.W,G.S,x));rc(g,x,y-12,1,11,sh(wood,18));rc(g,x-1,y-13,3,1,trim);}

  // Recessed shop door + 獨立樓上住宅門。
  const shopDoor=clamp(R((glazeL+glazeR)*.52),glazeL+2,glazeR-2), yd=R(foot(G.W,G.S,shopDoor));
  rc(g,shopDoor-1,yd-8,3,7,'#172027'); rc(g,shopDoor,yd-7,2,5,'#435866'); rc(g,shopDoor,yd-8,2,1,'#b9c8cb');
  const rx=clamp(xS-resW+1,xW+3,xS-2), yr=R(foot(G.W,G.S,rx));
  rc(g,rx,yr-9,Math.max(2,resW-1),8,door); rc(g,rx,yr-9,Math.max(2,resW-1),2,'#33475a'); rc(g,rx+1,yr-3,1,1,'#d5b36d');
  rc(g,rx-1,yr-10,Math.max(4,resW+1),1,trim);

  // 真正的街角回折：側牆也有櫥窗／fascia，而不是把平面店面貼在盒子上。
  if(sw>=7){
    const sx0=xS+2,sx1=xE-2;
    band(g,G.S,G.E,sx0,sx1,3,3,sh(wood,-30));
    band(g,G.S,G.E,sx0,sx1,8,5,glassSide);
    band(g,G.S,G.E,sx0,sx1,8,1,sh(glassHi,-24));
    band(g,G.S,G.E,xS+1,xE-1,11,3,sh(wood,-22));
    band(g,G.S,G.E,xS,xE,13,1,sh(trim,-20));
  }
  // Canted-corner 語彙用 3px 深色入口提示；不超出 footprint。
  if(fw>=14&&sw>=7){
    rc(g,xS-1,yS-8,3,7,sh(door,-12)); rc(g,xS-2,yS-9,5,1,stone);
    rc(g,xS,yS-6,1,4,'#506777'); rc(g,xS,yS-3,1,1,'#d8bd72');
  }

  // 夜光只畫在白天玻璃；T653 的 occlusion wrapper 仍會做 painter-order 遮擋。
  if(ng){
    band(ng,G.W,G.S,glazeL,glazeR,8,5,'#ffe1a2');
    if(sw>=7)band(ng,G.S,G.E,xS+2,xE-2,8,5,'#d9c38f');
  }

  // 上層 sash windows：楣線／石窗台／橫檔。
  const sash=(a,b,x,d,sideFace,lit)=>{
    const y=R(foot(a,b,x)), gc=sideFace?sh(glass,-28):glass, tc=sideFace?sh(trim,-20):trim, lc=sideFace?sh(lintel,-20):lintel;
    rc(g,x-1,y-d-5,5,1,lc); rc(g,x-1,y-d,5,1,tc); rc(g,x,y-d-4,3,4,gc); rc(g,x,y-d-2,3,1,sh(tc,-20));
    if(ng&&lit)rc(ng,x,y-d-4,3,4,sideFace?'#d9c78f':'#ffdca0');
  };
  const upper=H-shopH-4, nFloors=upper>=16?2:1;
  for(let f=0;f<nFloors;f++){
    const d=shopH+3+f*8, nF=clamp(Math.floor(fw/9),2,5), nS=clamp(Math.floor(sw/9),1,3);
    for(let i=0;i<nF;i++)sash(G.W,G.S,R(xW+(i+1)*(xS-xW)/(nF+1)),d,false,((i+f+Math.abs(v|0))%3)!==0);
    for(let i=0;i<nS;i++)sash(G.S,G.E,R(xS+(i+1)*(xE-xS)/(nS+1)),d,true,((i+f+1+Math.abs(v|0))%3)!==0);
  }

  // Corner quoin + rainwater downpipe，兼作兩立面的乾淨縫線。
  rc(g,xS,yS-H+2,1,H-3,'#6d493d'); rc(g,xS+1,yS-H+2,1,H-3,'#51433d');
  rc(g,xS+1,yS-5,1,4,'#2f3337');

  // 後縮煙囪＋陶土 chimney pots，完全留在建築 footprint 內。
  const cp=A.paraPt559(G,.28,.28), cx=R(cp[0]), cy=R(cp[1])-H;
  rc(g,cx-2,cy-6,2,6,sh(brick,2)); rc(g,cx,cy-6,2,6,sh(brick,-30)); rc(g,cx-3,cy-7,6,1,'#6c4a3a');
  rc(g,cx-2,cy-9,1,2,'#a55b3a'); rc(g,cx+1,cy-9,1,2,'#b46a43'); rc(g,cx-2,cy-10,1,1,'#6b3f2a'); rc(g,cx+1,cy-10,1,1,'#6b3f2a');
  if(ctx.chim)ctx.chim(cx-2,cy-11,'#6b3f2a');

  // 不做真品牌，只留稀疏招牌字點。
  for(let x=xW+4,i=0;x<=Math.min(shopRight-3,xW+16);x+=3,i++)if(i%4!==3){const y=R(foot(G.W,G.S,x));rc(g,x,y-11,1,1,i%2?'#e8d8a7':'#c9b374');}
  return {pitch:false,gpt001:true};
}

REG.ukCornerShopGPT001={name:'ukCornerShopGPT001',draw:drawCornerShop001};

function gptCornerShopSelftest001(){
  const checks=[],GV=window.GV||{},R0=window.__facade577||{},oldForce=window.__facadeForce577,oldOff=window.__noGPTCornerShop001;
  const crc=cv=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let h=2166136261>>>0;for(let i=0;i<d.length;i++){h^=d[i];h=Math.imul(h,16777619);}return h>>>0;};
  const noFloat=s=>{if(!s||!s.img||!s.night)return false;const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;for(let i=3;i<n.length;i+=4)if(n[i]>40&&d[i]<40)return false;return true;};
  checks.push(['ukCornerShopGPT001 已登記',!!(R0.ukCornerShopGPT001&&typeof R0.ukCornerShopGPT001.draw==='function')]);
  const names=[];for(let i=0;i<5;i++){const a=GV.arche568&&GV.arche568(2,1,i);names.push(a&&a.n);}
  checks.push(['商業 lv1 前五原型身份未改／沒有插隊',names.join('|')==='shophouse|market|cornerLot|modernShop|townShop']);
  const ar=GV.arche568&&GV.arche568(2,1,4);
  checks.push(['townShop 只新增 GPT facade',!!ar&&ar.n==='townShop'&&ar.fs==='ukCornerShopGPT001'&&ar.hm===.88]);
  let a=null,b=null;
  try{
    window.__facadeForce577='ukCornerShopGPT001'; window.__noGPTCornerShop001=false; a=GV.makeBlockSprite547&&GV.makeBlockSprite547(2,1,2,2,4);
    window.__noGPTCornerShop001=true; b=GV.makeBlockSprite547&&GV.makeBlockSprite547(2,1,2,2,4);
  }finally{window.__facadeForce577=oldForce;window.__noGPTCornerShop001=oldOff;}
  checks.push(['GPT 店屋產出非空精靈',!!(a&&a.img&&a.__t547&&String(a.__t547.sty).includes('ukCornerShopGPT001'))]);
  checks.push(['逃生閥回核心畫法且 CRC 不同',!!(a&&b&&a.img&&b.img)&&crc(a.img)!==crc(b.img)&&String(b.__t547&&b.__t547.sty||'').indexOf('ukCornerShopGPT001')<0]);
  checks.push(['夜光只在白天實體像素上',!!a&&noFloat(a)]);
  checks.push(['HTML 已含 GPT 逃生閥快取隔離',document.documentElement.innerHTML.indexOf('_gptcs0')>=0]);
  return {ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))};
}
window.GV=window.GV||{};
window.GV.gptCornerShopSelftest001=gptCornerShopSelftest001;
})();