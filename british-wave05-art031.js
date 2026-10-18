/* GPT-031 / wave05. Original deterministic coastal and harbour geometry.
 * Primary sources and compressed proportions are recorded in the first-pushed card.
 * Shared approved rasterizer, palette, existing sprites and simulation remain unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "netshops",
    "nm": "黑斯廷斯漁網木鋪",
    "en": "Hastings Net Shops",
    "shape": "three-narrow-weatherboard-stores-stacked-loading-doors-distinct-gables",
    "note": "選取兩至三層窄木鋪、逐層外門及黑色羽邊木板的高低群組；內梯不虛構成外樓梯。",
    "url": "https://hastingstrust.hastingsvoluntaryaction.org.uk/sites/hastingstrust.hastingsvoluntaryaction.org.uk/files/910000%20Fishermen%27s%20Net%20Shops.pdf"
  },
  {
    "id": "burnham",
    "nm": "伯納姆低燈塔",
    "en": "Burnham Low Lighthouse",
    "shape": "square-lightroom-nine-open-piers-hipped-metal-roof-double-rear-stair",
    "note": "方形木板燈室、九支架空木柱、金屬四坡頂、雙扇海窗與後方兩段木梯。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1262771"
  },
  {
    "id": "saltdean",
    "nm": "索爾特迪恩海濱泳場",
    "en": "Saltdean Lido",
    "shape": "semicircular-two-storey-pavilion-curved-wings-five-canopy-piers-roof-terraces-pool",
    "note": "半圓中央樓、曲翼露臺、五柱罩棚、日光室及橢圓收邊水池；歷史地標外觀。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1380905"
  },
  {
    "id": "marinecourt",
    "nm": "聖倫納茲郵輪公寓",
    "en": "Marine Court",
    "shape": "fourteen-storey-liner-block-curved-ends-balcony-decks-four-rear-stair-cores",
    "note": "十四層海向陽臺、低層基座、圓弧端部與四座後樓梯間；長高實物作比例壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1379435"
  },
  {
    "id": "roundtower",
    "nm": "朴茨茅斯圓炮塔",
    "en": "Portsmouth Round Tower",
    "shape": "three-storey-squat-cylinder-projecting-base-three-segmental-gun-ports-flat-platform",
    "note": "三層厚圓塔、凸出底層、石帶、節段拱砲孔與平炮臺；沒有新增戰鬥功能。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1386901"
  },
  {
    "id": "spinnaker",
    "nm": "朴茨茅斯風帆塔",
    "en": "Spinnaker Tower",
    "shape": "twin-hexagonal-shafts-crossed-steel-bows-open-ribs-three-trapezoid-decks-needle",
    "note": "雙六角斜井、交叉鋼弓、開放翼肋、三個梯形觀景層與針狀頂；依原工程設計壓縮。",
    "url": "https://www.lusas.com/case/civil/spinnaker_tower.html"
  },
  {
    "id": "lynncustoms",
    "nm": "金斯林海關",
    "en": "Kings Lynn Custom House",
    "shape": "five-by-four-classical-bays-hip-roof-dormers-greek-cross-arches-hexagonal-ogee-lantern",
    "note": "五乘四開間古典海關、四坡瓦頂與不同面老虎窗、十字四拱燈亭及六角曲帽。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1195414"
  },
  {
    "id": "georgesdock",
    "nm": "喬治碼頭通風塔",
    "en": "Georges Dock Ventilation Station",
    "shape": "art-deco-stone-vent-shaft-rusticated-offices-tall-recesses-and-sculptural-niches",
    "note": "波特蘭石通風塔、刻槽基層辦公翼、深窗凹槽及入口壁龕；僅作歷史外觀展示。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1187177"
  },
  {
    "id": "portlandbill",
    "nm": "波特蘭比爾燈塔",
    "en": "Portland Bill Lighthouse",
    "shape": "tapered-tower-domed-lantern-twelve-balcony-bays-linked-flat-roof-keepers-house",
    "note": "收分塔身、圓頂燈室與十二段欄杆，低廊連四乘三開間住宿樓及四座煙囪。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1280498"
  },
  {
    "id": "cromer",
    "nm": "克羅默碼頭救生艇庫",
    "en": "Cromer Lifeboat Station",
    "shape": "stepped-shallow-barrel-metal-roofs-cedar-cladding-high-strip-windows-piles-slipway",
    "note": "依RNLI實景採淺弧分段金屬頂、木板牆、高窗帶、高架支承與斜下水道；不新增救援玩法。",
    "url": "https://rnli.org/find-my-nearest/lifeboat-stations/cromer-lifeboat-station"
  }
].map((q,i)=>Object.freeze({...q,v:320+4*i})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      const uAt=(x,y)=>Math.abs(nx)>.5?y:x;
      if(kind==='whiteboard')return(x,y,z)=>K.mod(z,1.5)<.13?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
      if(kind==='whiteMetal')return(x,y,z)=>K.mod(uAt(x,y),2.3)<.13?(d?P.lead:Q.creamHi):(d?Q.creamD:Q.cream);
      if(kind==='blackwood')return(x,y,z)=>K.mod(z,1.55)<.16?(d?Q.tar:Q.tarHi):(d?Q.tarD:Q.tar);
      if(kind==='cedar')return(x,y,z)=>K.mod(z,1.8)<.15?(d?Q.cedarD:Q.cedarHi):(d?Q.cedarD:Q.cedar);
      if(kind==='zinc')return(x,y,z)=>K.mod(uAt(x,y),2.1)<.16?(d?Q.steelD:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='flint')return(u,z)=>{const n=K.hash(Math.floor(u*2.8),Math.floor(z*2.8),3004);return n%7<2?(d?Q.creamD:Q.creamHi):(d?P.stoneD:P.stoneR);};
      if(kind==='yellowbrick')return(x,y,z)=>{const u=Math.abs(nx)>.5?y:x;return K.mod(z,1.65)<.18||K.mod(u+(Math.floor(z/1.65)%2)*1.7,3.4)<.13?(d?P.stoneD:P.stoneR):(d?Q.creamD:Q.cream);};
      if(kind==='brick')return K.brick(d,3001);
      if(kind==='stone')return K.ashlar(d,3002);
      if(kind==='steel'||kind==='lead')return(x,y,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(x,y,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
      return(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),3003)%47===0?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
    }
    function volume(x0,x1,y0,y1,z0,z1,kind){
      const f={
        front:Object.assign(S.face([x0,y1],[x1,y1],0,1),{nx:0,ny:1}),
        back:Object.assign(S.face([x1,y0],[x0,y0],0,-1),{nx:0,ny:-1}),
        right:Object.assign(S.face([x1,y1],[x1,y0],1,0),{nx:1,ny:0}),
        left:Object.assign(S.face([x0,y0],[x0,y1],-1,0),{nx:-1,ny:0})
      };
      S.wall([x0,y1],[x1,y1],z0,z1,mat(kind,0,1));S.wall([x1,y0],[x0,y0],z0,z1,mat(kind,0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,mat(kind,1,0));S.wall([x0,y0],[x0,y1],z0,z1,mat(kind,-1,0));
      S.flat(x0,x1,y0,y1,z1,kind==='steel'?Q.steelD:P.stoneR);
      return f;
    }
    function roof(x0,x1,y0,y1,z,rise,axis,kind){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,m=(nx,ny)=>K.slate(dark(nx,ny));
      if(axis!=='y'){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],m(0,-1));S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],m(0,1));
        S.poly([[x0,y0,z],[x0,y1,z],[x0,cy,z+rise]],mat(kind||'stone',-1,0));S.poly([[x1,y0,z],[x1,cy,z+rise],[x1,y1,z]],mat(kind||'stone',1,0));
        S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.36);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],m(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],m(1,0));
        S.poly([[x0,y0,z],[cx,y0,z+rise],[x1,y0,z]],mat(kind||'stone',0,-1));S.poly([[x0,y1,z],[x1,y1,z],[cx,y1,z+rise]],mat(kind||'stone',0,1));
        S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.36);
      }
    }
    function pane(F,u,z,w,h,type,lit){
      const cx=u+w/2,head=type==='pointed'?h*.64:type==='arch'?h*.66:h;
      let outside,inside;
      if(type==='diamond'){
        outside=[[cx,z-.35],[u+w+.35,z+h/2],[cx,z+h+.35],[u-.35,z+h/2]];
        inside=[[cx,z+.35],[u+w-.35,z+h/2],[cx,z+h-.35],[u+.35,z+h/2]];
      }else if(type==='arch'){
        // A round-headed opening is a semicircle above straight jambs.
        // Keep pointed tracery separate; do not substitute a triangular peak.
        const spring=z+h-w/2;
        const arc=(radius,bottom)=>[[cx-radius,bottom],[cx+radius,bottom],...Array.from({length:13},(_,i)=>{const a=i*Math.PI/12;return[cx+Math.cos(a)*radius,spring+Math.sin(a)*radius];})];
        outside=arc(w/2+.35,z-.35);inside=arc(w/2-.22,z+.22);
      }else if(type==='pointed'){
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+head],[cx,z+h+.4],[u-.3,z+head]];
        inside=[[u+.3,z+.35],[u+w-.3,z+.35],[u+w-.3,z+head-.2],[cx,z+h-.35],[u+.3,z+head-.2]];
      }else{
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+h+.35],[u-.3,z+h+.35]];
        inside=[[u+.22,z+.22],[u+w-.22,z+.22],[u+w-.22,z+h-.22],[u+.22,z+h-.22]];
      }
      S.poly(outside.map(p=>F.point(p[0],.13,p[1])),P.stoneHi);
      const glass=dark(F.nx,F.ny)?P.glassR:P.glass;
      S.poly(inside.map(p=>F.point(p[0],.24,p[1])),lit===false?glass:[glass,P.warm]);
      if(type!=='diamond'){
        const bays=type==='ribbon'?Math.max(2,Math.round(w/2.8)):type==='mullion'?3:2;
        for(let b=1;b<bays;b++)F.panel(u+w*b/bays-.10,u+w*b/bays+.10,z+.2,z+h-.3,P.frame,.32);
        if(type!=='ribbon')F.panel(u+.2,u+w-.2,z+h*.48-.10,z+h*.48+.10,P.frame,.33);
      }else{
        S.beam(F.point(cx,.31,z+.45),F.point(cx,.31,z+h-.45),P.frame,.15);
        S.beam(F.point(u+.45,.31,z+h/2),F.point(u+w-.45,.31,z+h/2),P.frame,.15);
      }
    }
    function windows(F,levels,bays,z0,step,w,h,type){
      for(let l=0;l<levels;l++)for(let b=0;b<bays;b++)pane(F,F.length*(b+.5)/bays-w/2,z0+l*step,w,h,type,true);
    }
    function polygon(cx,cy,r,z0,z1,n,kind,phase){
      const points=Array.from({length:n},(_,i)=>{const a=(phase||0)+i*Math.PI*2/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];}),faces=[];
      for(let i=0;i<n;i++){
        const p=points[i],q=points[(i+1)%n],a=(phase||0)+(i+.5)*Math.PI*2/n,nx=Math.cos(a),ny=Math.sin(a);
        S.wall(p,q,z0,z1,mat(kind,nx,ny));faces.push(Object.assign(S.face(p,q,nx,ny),{nx,ny}));
      }
      S.poly(points.map(p=>[...p,z1]),P.stoneR);return faces;
    }
    function cone(cx,cy,r0,r1,z0,z1,n,kind){
      for(let i=0;i<n;i++){
        const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n,m=(a+b)/2;
        const tex=kind==='stone'?K.ashlar(dark(Math.cos(m),Math.sin(m)),3027):kind==='lead'?(dark(Math.cos(m),Math.sin(m))?Q.steelD:Q.steel):K.slate(dark(Math.cos(m),Math.sin(m)));
        S.poly([[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,z0],[cx+Math.cos(b)*r0,cy+Math.sin(b)*r0,z0],[cx+Math.cos(b)*r1,cy+Math.sin(b)*r1,z1],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,z1]],tex);
      }
    }
    function parapet(x0,x1,y0,y1,z,battled){
      for(const [xa,xb,ya,yb]of[[x0,x1,y0,y0+.45],[x0,x1,y1-.45,y1],[x0,x0+.45,y0,y1],[x1-.45,x1,y0,y1]])S.box(xa,xb,ya,yb,z,z+1.7,P.stone,P.stoneR,P.stoneHi);
      if(battled)for(let u=x0;u<x1;u+=2.6)for(const y of[y0,y1-.8])S.box(u,Math.min(u+1.35,x1),y,y+.8,z+1.7,z+3,P.stone,P.stoneR,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++)S.box(x0,x1,y0+(y1-y0)*i/n,y1,.42,.42+rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}
    function chimney(x,y,z,h){volume(x-.65,x+.65,y-.7,y+.7,z,z+h,'brick');S.box(x-.9,x+.9,y-.9,y+.9,z+h,z+h+.7,P.stone,P.stoneR,P.stoneHi);for(const dx of[-.38,.38])K.cylinder(S,x+dx,y,z+h+.7,z+h+2.5,.24,.28,Q.red,Q.redD,P.ink,8);}
    if(!root.__wave031GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave031GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave031:1});
    }
    return{...H,S,K,P,Q,mat,volume,roof,pane,windows,polygon,cone,parapet,steps,chimney,finish};
  }



  function band(A,F,z,depth){const {P}=A;F.block(-.25,F.length+.25,0,depth||.65,z,z+.65,P.stoneHi,P.stoneR,P.stoneHi);}

  function lathe(A,cx,cy,profile,kind,n=24,phase=0){
    const {S}=A;
    for(let k=0;k<profile.length-1;k++)for(let j=0;j<n;j++){
      const a=phase+j*2*Math.PI/n,b=phase+(j+1)*2*Math.PI/n,m=(a+b)/2,[z0,r0]=profile[k],[z1,r1]=profile[k+1];
      S.poly([[cx+r0*Math.cos(a),cy+r0*Math.sin(a),z0],[cx+r0*Math.cos(b),cy+r0*Math.sin(b),z0],[cx+r1*Math.cos(b),cy+r1*Math.sin(b),z1],[cx+r1*Math.cos(a),cy+r1*Math.sin(a),z1]],A.mat(kind,Math.cos(m),Math.sin(m)));
    }
  }
  // Real wall apertures, with jamb and soffit depth. No painted black "holes".
  function archWall(A,F,z0,z1,holes,kind='stone',thickness=.75,trim=null){
    const {S,P}=A;let cursor=0;
    const panel=(u0,u1,a,b)=>{if(u1<=u0||b<=a)return;for(const d of[0,-thickness])S.poly([F.point(u0,d,a),F.point(u1,d,a),F.point(u1,d,b),F.point(u0,d,b)],A.mat(kind,F.nx*(d? -1:1),F.ny*(d? -1:1)));};
    for(const h of holes.toSorted((a,b)=>a.u-b.u)){
      const {u,w,bottom,spring,rise}=h;panel(cursor,u,z0,z1);panel(u,u+w,z0,bottom);
      for(let j=0;j<16;j++){
        const at=t=>[u+w*t,spring+rise*Math.sqrt(Math.max(0,1-(2*t-1)**2))],p=at(j/16),q=at((j+1)/16);
        for(const d of[0,-thickness])S.poly([F.point(p[0],d,p[1]),F.point(q[0],d,q[1]),F.point(q[0],d,z1),F.point(p[0],d,z1)],A.mat(kind,F.nx*(d?-1:1),F.ny*(d?-1:1)));
        S.poly([F.point(p[0],0,p[1]),F.point(q[0],0,q[1]),F.point(q[0],-thickness,q[1]),F.point(p[0],-thickness,p[1])],P.stoneD);
        if(trim)S.poly([F.point(p[0],.08,p[1]),F.point(q[0],.08,q[1]),F.point(q[0],.08,q[1]+.75),F.point(p[0],.08,p[1]+.75)],A.mat(trim,F.nx,F.ny));
      }
      for(const x of[u,u+w])S.poly([F.point(x,0,bottom),F.point(x,0,spring),F.point(x,-thickness,spring),F.point(x,-thickness,bottom)],P.stoneD);
      if(trim){F.panel(u-.48,u,bottom,spring,A.mat(trim,F.nx,F.ny),.08);F.panel(u+w,u+w+.48,bottom,spring,A.mat(trim,F.nx,F.ny),.08);}
      cursor=u+w;
    }
    panel(cursor,F.length,z0,z1);
  }
  function face(A,a,b,nx,ny){return Object.assign(A.S.face(a,b,nx,ny),{nx,ny});}

/* WAVE031 AUTHORED MODELS */
  // New private helpers operate in world coordinates; old modules stay byte-exact.
  function planBlock(A,points,z0,z1,kind,cap){
    const {S,P}=A,faces=[];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;
      S.wall(a,b,z0,z1,A.mat(kind,nx,ny));faces.push(face(A,a,b,nx,ny));
    }
    if(cap!==false)S.poly(points.map(p=>[...p,z1]),cap===undefined?P.stoneHi:cap);
    return faces;
  }
  function roundedPlan(x0,x1,y0,y1,r,n=5){
    const points=[];
    for(const [cx,cy,a]of[[x1-r,y1-r,0],[x0+r,y1-r,Math.PI/2],[x0+r,y0+r,Math.PI],[x1-r,y0+r,Math.PI*1.5]])
      for(let i=0;i<=n;i++){const t=a+i*Math.PI/(2*n);points.push([cx+r*Math.cos(t),cy+r*Math.sin(t)]);}
    return points;
  }
  function rail(A,points,z,h=2,closed=true,col){
    const {S,P}=A,c=col===undefined?P.ironD:col,n=closed?points.length:points.length-1;
    for(let i=0;i<n;i++){
      const a=points[i],b=points[(i+1)%points.length],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2.3));
      for(let j=0;j<=steps;j++){const t=j/steps,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;S.beam([x,y,z],[x,y,z+h],c,.16);}
      for(const dz of[h*.45,h])S.beam([...a,z+dz],[...b,z+dz],c,.19);
    }
  }
  function hipPlateau(A,x0,x1,y0,y1,z,rise,inset,kind){
    const {S,P}=A,out=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],inside=[[x0+inset,y0+inset],[x1-inset,y0+inset],[x1-inset,y1-inset],[x0+inset,y1-inset]];
    for(let i=0;i<4;i++){
      const j=(i+1)%4,nx=[0,1,0,-1][i],ny=[-1,0,1,0][i],m=kind==='tile'?(x,y,z)=>A.K.mod(z,1.25)<.17?A.Q.redD:(A.dark(nx,ny)?A.Q.redD:A.Q.red):A.mat(kind,nx,ny);
      S.poly([[...out[i],z],[...out[j],z],[...inside[j],z+rise],[...inside[i],z+rise]],m);
      S.beam([...out[i],z],[...inside[i],z+rise],P.lead,.22);
    }
    S.flat(x0+inset,x1-inset,y0+inset,y1-inset,z+rise,P.lead);
  }
  function barrel(A,x0,x1,y0,y1,z,rise){
    const {S,P}=A,at=t=>[x0+(x1-x0)*t,z+rise*Math.sin(t*Math.PI)];
    for(let j=0;j<18;j++){
      const a=at(j/18),b=at((j+1)/18),nx=-(b[1]-a[1]);
      S.poly([[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],A.mat('zinc',nx,0));
      for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[a[0],y,z],[b[0],y,z],[b[0],y,b[1]],[a[0],y,a[1]]],A.mat('cedar',0,ny));
    }
    for(let j=0;j<=6;j++){const y=y0+(y1-y0)*j/6;for(let k=0;k<18;k++){const a=at(k/18),b=at((k+1)/18);S.beam([a[0],y,a[1]+.1],[b[0],y,b[1]+.1],P.lead,.17);}}
  }
  function netshops(row,view){
    const A=context(row,view),{S,K,P,Q}=A,chosen=[[3.1,10.1,12,28,26,2],[11.3,18.1,7.2,25.7,42,3],[19.3,28.5,13.8,29.1,35,3]];let doors=0;
    for(const [x0,x1,y0,y1,h,floors]of chosen){
      const F=A.volume(x0,x1,y0,y1,.5,h,'blackwood'),cx=(x0+x1)/2,rise=(x1-x0)*.6;
      for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,h],[x,y1,h],[cx,y1,h+rise],[cx,y0,h+rise]],A.mat('blackwood',nx,0));
      for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[x0,y,h],[x1,y,h],[cx,y,h+rise]],A.mat('blackwood',0,ny));
      S.beam([cx,y0,h+rise],[cx,y1,h+rise],Q.tarHi,.28);
      for(let l=0;l<floors;l++){
        const z=1.1+l*(h-1)/floors,w=(x1-x0)*.43,u=F.front.length*.52-w/2,dh=(h-1)/floors*.73;
        F.front.panel(u,u+w,z,z+dh,Q.tarD,.16);
        for(let j=0;j<5;j++)F.front.block(u+j*w/5,u+j*w/5+.065,.16,.3,z,z+dh,Q.tarHi,Q.tarD,Q.tar);
        for(const zz of[z+.6,z+dh-.6])F.front.panel(u,u+w,zz,zz+.18,Q.tarHi,.34);
        S.beam(F.front.point(u+.2,.37,z+.8),F.front.point(u+w-.2,.37,z+dh-.8),Q.tarHi,.16);
        F.front.block(u-.17,u+w+.17,.05,.52,z-.25,z,P.stoneD,P.stoneD,Q.tarHi);doors++;
        const side=l%2?F.right:F.left;side.panel(side.length*.37,side.length*.37+1.3,z+dh*.64,z+dh*.64+1.2,Q.tarD,.14);
      }
      S.beam([cx,y1-.5,h-.9],[cx,y1+1.6,h-.9],Q.tarHi,.25);
      S.beam([cx,y1+1.6,2],[cx,y1+1.6,h-1],P.ironD,.085);
      F.back.panel(F.back.length/2-.6,F.back.length/2+.6,3.2,5.1,Q.tarD,.18);
      K.wallLamp(S,F.front,.8,6.3);
    }
    return{...A.finish(),details:{selectedStores:3,storeys:[2,3,3],loadingDoors:doors,externalStairs:0,roof:'three-real-black-boarded-gables',notAllSurvivingHuts:true}};
  }
  function saltdean(row,view){
    const A=context(row,view),{S,P,Q}=A,wing=roundedPlan(3,29,5.2,15.8,3.9),W=planBlock(A,wing,.5,9.7,'plaster');
    for(const F of W)if(F.length>3){A.pane(F,.5,2.6,F.length-1,4,'ribbon',true);band(A,F,8.9,.4);}
    rail(A,wing,9.9,1.7);
    const center=[[9.1,7.2],[22.9,7.2],[22.9,14],...Array.from({length:14},(_,i)=>{const t=(i+1)*Math.PI/14;return[16+6.9*Math.cos(t),14+6.9*Math.sin(t)];})],C=planBlock(A,center,.6,17,'plaster');
    let french=0;
    // Fourteen upper French lights follow fourteen outward semicircular facets.
    const front=C.filter(F=>F.ny>0);
    for(const F of C){band(A,F,8.7,.6);if(F.ny<-.2&&F.length>1.2)A.pane(F,.12,10.5,F.length-.24,5.6,'ribbon',true);}
    for(const F of front){A.pane(F,.11,10,F.length-.22,5.9,'ribbon',true);french++;}
    const cap=Array.from({length:23},(_,i)=>{const t=i*Math.PI/22;return[16+8.6*Math.cos(t),14+7.3*Math.sin(t)];});
    const inner=cap.map(([x,y])=>[16+(x-16)*.79,14+(y-14)*.79]);
    for(let i=0;i<cap.length-1;i++)S.poly([[...cap[i],9.1],[...cap[i+1],9.1],[...inner[i+1],9.1],[...inner[i],9.1]],Q.creamHi);
    for(let i=0;i<5;i++){const t=(i+.5)*Math.PI/5,x=16+8.2*Math.cos(t),y=14+7*Math.sin(t);S.box(x-.16,x+.16,y-.16,y+.16,.5,9.1,Q.cream,Q.creamD,Q.creamHi);}
    rail(A,center,17.1,1.8);
    const sol=roundedPlan(11.5,20.5,8.4,15.4,3.4),L=planBlock(A,sol,17.1,22,'plaster');
    for(const F of L)if(F.length>1.2)A.pane(F,.13,18,F.length-.26,3,'ribbon',true);
    planBlock(A,roundedPlan(11.2,20.8,8.1,15.7,3.7),22,22.5,'plaster');
    const pool=[[3.1,23.2],[24.8,23.2],...Array.from({length:13},(_,i)=>[24.8+4.5*Math.sin(i*Math.PI/12),26.4-3.2*Math.cos(i*Math.PI/12)]),[3.1,29.6]];
    planBlock(A,pool,.45,1.4,'stone',P.glassR);
    for(let j=0;j<4;j++)S.beam([4.4,24+j*1.5,1.43],[24,24+j*1.5,1.43],P.glass,.10);
    for(let j=0;j<3;j++)A.polygon(6.1,20.5,1.3-j*.3,1.5+j*.9,2.1+j*.9,16,'stone');
    return{...A.finish(),details:{canopyColumns:5,upperFrenchLights:french,historicalSelection:'1938 pavilion and pool; later community addition omitted',roof:'rounded-solarium-and-open-curved-roof-terraces',newSwimmingMechanics:false}};
  }
  function marinecourt(row,view){
    const A=context(row,view),{S,P,Q}=A,pod=roundedPlan(2.2,29.8,7.3,24.4,4.6),base=planBlock(A,pod,.5,9.5,'plaster');
    for(const F of base)if(F.length>2.1){A.pane(F,.25,1.4,F.length-.5,6.8,'ribbon',true);band(A,F,8.8,.6);}
    rail(A,pod,9.7,1.8);
    let floors=2,balconies=0;
    for(let l=2;l<14;l++){
      const z=9.5+(l-2)*4.1,inset=l>11?(l-11)*1.1:0,pts=roundedPlan(4.6+inset,27.4-inset,11.4,21.3-inset*.35,3.7-inset*.15),faces=planBlock(A,pts,z,z+4.1,'plaster');
      for(const F of faces){if(F.length>.8)A.pane(F,.12,z+.7,Math.max(.5,F.length-.24),2.5,'ribbon',true);}
      // Deck plates project from the actual south wall, leaving a real railing.
      const deck=[[4.4+inset,22.2-inset*.35],[27.6-inset,22.2-inset*.35],[27.6-inset,23-inset*.35],[4.4+inset,23-inset*.35]];
      planBlock(A,deck,z+.12,z+.43,'plaster');rail(A,[deck[0],deck[1]],z+.43,.95,false,Q.creamHi);balconies++;
      floors++;
    }
    for(const x of[6.2,12.6,19,25.4]){
      const F=A.volume(x-.7,x+.7,9.4,12,.5,57.8,'plaster');
      for(let l=0;l<13;l++)A.pane(F.back,.38,2.1+l*4.1,.64,2.4,'sash',true);
      S.flat(x-.9,x+.9,9.2,12.2,58,Q.creamHi);
    }
    for(let i=0;i<12;i++){const z=2+i*4.1,y=7.9+(i%2)*.85;S.beam([13.8,y,z],[18.2,y,z+4.1],P.ironD,.22);}
    const terrace=roundedPlan(9.5,22.5,13.1,18.1,1.7);rail(A,terrace,58.9,1.6);
    for(const x of[11.8,20.2])S.box(x-.4,x+.4,14,15.1,58.8,60.3,Q.cream,Q.creamD,Q.creamHi);
    return{...A.finish(),details:{storeys:floors,podiumStoreys:2,southBalconyDecks:balconies,rearStairCores:4,roof:'flat-liner-decks-rounded-ends-stepped-upper-terraces',compressedLongElevation:true}};
  }
  function roundtower(row,view){
    const A=context(row,view),{S,K,P}=A,cx=16,cy=15,r=10.4,n=24;let guns=0,blocked=0;
    for(let j=0;j<n;j++){const t=j*2*Math.PI/n,u=(j+1)*2*Math.PI/n,m=(t+u)/2,F=face(A,[cx+11.5*Math.cos(t),cy+11.5*Math.sin(t)],[cx+11.5*Math.cos(u),cy+11.5*Math.sin(u)],Math.cos(m),Math.sin(m));archWall(A,F,.5,7.9,j===5?[{u:.19,w:F.length-.38,bottom:.5,spring:5.9,rise:.5}]:[],'stone',1.15);}
    for(let level=0;level<3;level++){
      const z0=level===0?.5:8.1+(level-1)*8,z1=8.1+level*8;
      for(let j=0;j<n;j++){
        const t=j*2*Math.PI/n,u=(j+1)*2*Math.PI/n,m=(t+u)/2,F=face(A,[cx+r*Math.cos(t),cy+r*Math.sin(t)],[cx+r*Math.cos(u),cy+r*Math.sin(u)],Math.cos(m),Math.sin(m)),w=F.length*.71;
        if(level===1&&[11,15,18].includes(j)){archWall(A,F,z0,z1,[{u:(F.length-w)/2,w,bottom:10.3,spring:13.8,rise:.47}],'stone',2.15);guns++;}
        else if(level===0&&j===5){
          archWall(A,F,z0,z1,[{u:.15,w:F.length-.3,bottom:.5,spring:5.9,rise:.5}],'stone',2.15);
          for(let d=0;d<2;d++){const x=.2+d*(F.length-.4)/2;F.panel(x,x+(F.length-.4)/2,.6,5.7,P.woodD,-.5);for(let c=0;c<2;c++)for(let k=0;k<3;k++)A.pane(F,x+.13+c*.42,3.65+k*.53,.32,.42,'plain',false);}
        }else{S.wall(F.point(0,0,0),F.point(F.length,0,0),z0,z1,A.mat('stone',F.nx,F.ny));if(level===1&&[1,5,8].includes(j)){F.panel(.4,F.length-.4,10.4,14.1,P.stoneD,.06);blocked++;}}
        if(level<2)F.block(-.03,F.length+.03,-.02,.22,z1-.2,z1+.2,P.stoneHi,P.stoneR,P.stoneHi);
      }
    }
    // The gun platform is flat asphalt, without invented castle battlements.
    S.poly(Array.from({length:n},(_,j)=>[cx+r*Math.cos(j*2*Math.PI/n),cy+r*Math.sin(j*2*Math.PI/n),24.25]),P.ink);
    for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;S.wall([cx+(r+.2)*Math.cos(a),cy+(r+.2)*Math.sin(a)],[cx+(r+.2)*Math.cos(b),cy+(r+.2)*Math.sin(b)],24.2,25.6,K.ashlar(A.dark(Math.cos((a+b)/2),Math.sin((a+b)/2)),3118));}
    return{...A.finish(),details:{storeys:3,openSegmentalGunPorts:guns,blockedPorts:blocked,projectingLowerStage:true,roof:'flat-asphalt-gun-platform-no-battlements',newCombatMechanics:false}};
  }


  function slantTube(A,a,b,r0,r1,n=6,kind='plaster'){
    const {S}=A;
    for(let j=0;j<n;j++){const t=j*2*Math.PI/n,u=(j+1)*2*Math.PI/n,m=(t+u)/2;S.poly([[a[0]+r0*Math.cos(t),a[1]+r0*Math.sin(t),a[2]],[a[0]+r0*Math.cos(u),a[1]+r0*Math.sin(u),a[2]],[b[0]+r1*Math.cos(u),b[1]+r1*Math.sin(u),b[2]],[b[0]+r1*Math.cos(t),b[1]+r1*Math.sin(t),b[2]]],A.mat(kind,Math.cos(m),Math.sin(m)));}
  }
  function spinnaker(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const plinth=roundedPlan(7,25,9.5,24,3);planBlock(A,plinth,.5,3,'stone');
    for(const side of[-1,1]){
      const lower=[16+side*4.5,15.7,3],merge=[16+side*.85,17.2,42];slantTube(A,lower,merge,1.8,1.75,6);
      slantTube(A,merge,[16+side*.55,17.6,70],1.75,1.4,6);
    }
    // Crossing bows are two open curved structural members, not a filled sail.
    const bow=(side,t)=>[16+side*(8*(1-t)*Math.cos(t*Math.PI*.88)),14.8-10*Math.sin(t*Math.PI*.92),3+68*t];
    for(const side of[-1,1])for(let j=0;j<30;j++)S.beam(bow(side,j/30),bow(side,(j+1)/30),Q.creamHi,.9);
    let ribs=0;
    for(let j=3;j<=23;j+=2){const t=j/30,a=bow(-1,t),b=bow(1,t),mid=[16,(a[1]+17.3)/2,a[2]+1.3];S.beam(a,mid,Q.steel,.28);S.beam(mid,b,Q.steel,.28);ribs++;}
    const decks=[[57,8.6,6.2],[60.1,7.1,4.8],[63.2,5.7,3.2]];
    for(const [z,wide,deep]of decks){
      const points=[[16-wide,15],[16+wide,15],[16+wide*.63,15-deep],[16-wide*.63,15-deep]],F=planBlock(A,points,z,z+2.65,'plaster');
      for(const f of F){A.pane(f,.18,z+.48,f.length-.36,1.75,'ribbon',true);}
      for(let i=0;i<points.length;i++)S.beam([...points[i],z+2.8],[...points[(i+1)%points.length],z+2.8],Q.creamHi,.3);
    }
    slantTube(A,[16,17.5,68],[16,18.1,96],1.15,.08,6,'steel');S.beam([16,18.1,96],[16,18.1,100],P.ironD,.13);
    const entrance=A.volume(10.5,21.5,22,26,3,8.3,'plaster');A.pane(entrance.front,1,3.8,9,3.6,'ribbon',true);
    return{...A.finish(),details:{lowerHexagonalShafts:2,crossedSteelBows:2,openAerofoilRibLevels:ribs,trapezoidalObservationDecks:3,needle:true,roof:'open-sail-structure-and-three-separated-glazed-decks',sourceDesignMetres:170,compressedHeight:true}};
  }
  function lynncustoms(row,view){
    const A=context(row,view),{S,K,P,Q}=A,base=A.volume(4.5,27.5,5.5,27,.5,25.5,'stone');let upper=0,dormers=0;
    for(const [F,bays]of[[base.front,5],[base.back,5],[base.right,4],[base.left,4]]){
      const holes=Array.from({length:bays},(_,i)=>({u:F.length*(i+.5)/bays-1.6,w:3.2,bottom:.7,spring:7.4,rise:1.7}));
      // Blocked original ground arcade remains a recessed masonry arcade.
      archWall(A,F,.6,11.5,holes,'stone',.65);
      for(const h of holes)F.panel(h.u-.05,h.u+h.w+.05,.6,10,P.stoneD,-.71);
      for(let i=0;i<=bays;i++){
        const u=i*F.length/bays;F.block(u-.25,u+.25,.03,.71,.6,11.4,P.stone,P.stoneR,P.stoneHi);F.block(u-.42,u+.42,.03,.83,10.3,11,P.stoneHi,P.stoneR,P.stoneHi);
        F.block(u-.19,u+.19,.04,.5,13.2,24.7,P.stoneHi,P.stoneR,P.stoneHi);for(const dx of[-.28,.28])S.beam(F.point(u+dx,.53,24.1),F.point(u+dx,.53,24.7),P.stoneD,.23);
      }
      for(let i=0;i<bays;i++){A.pane(F,F.length*(i+.5)/bays-1.27,15,2.54,6.9,'mullion',true);upper++;}
      band(A,F,11.7,.7);band(A,F,25,.9);
    }
    K.timberDoor(base.front,base.front.length/2-1.5,.7,3,8,true);
    hipPlateau(A,4.1,27.9,5.1,27.4,25.8,7.4,5.3,'tile');
    const dormer=(x,y,direction,segment)=>{
      const F=A.volume(x-1.45,x+1.45,y-1.1,y+1.1,28.2,32.5,'stone'),f=direction==='front'?F.front:direction==='back'?F.back:direction==='right'?F.right:F.left;
      A.pane(f,f.length/2-.7,29,.14+1.26,2.8,'mullion',true);
      if(segment){
        const cx=f.length/2;S.poly([[...f.point(cx-1.7,.4,32.5)],...Array.from({length:15},(_,j)=>{const t=j*Math.PI/14;return f.point(cx+1.7*Math.cos(t),.4,32.5+1.1*Math.sin(t));})],P.stoneHi);
        S.flat(x-1.45,x+1.45,y-1.1,y+1.1,32.6,P.lead);
      }else{A.roof(x-1.65,x+1.65,y-1.3,y+1.3,32.7,1.9,direction==='front'||direction==='back'?'y':'x','stone');}
      dormers++;
    };
    for(const y of[7.2,25.3])for(let i=0;i<3;i++)dormer(9+i*7,y,y>15?'front':'back',i===1);
    for(const x of[6.2,25.8])for(const y of[12,20.5])dormer(x,y,x>16?'right':'left',false);
    for(const [a,b]of[[[10,11],[22,11]],[[22,11],[22,21.5]],[[22,21.5],[10,21.5]],[[10,21.5],[10,11]]]){
      rail(A,[a,b],33.3,1.75,false,P.woodHi);
      const n=Math.floor(Math.hypot(b[0]-a[0],b[1]-a[1])/1.3);for(let j=1;j<n;j++){const t=j/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;K.cylinder(S,x,y,33.3,34.6,.12,.23,Q.cream,Q.creamD,Q.creamHi,6);}
    }
    const cross=[[14.7,12],[17.3,12],[17.3,14.7],[20,14.7],[20,17.3],[17.3,17.3],[17.3,20],[14.7,20],[14.7,17.3],[12,17.3],[12,14.7],[14.7,14.7]];
    S.flat(12,20,14.7,17.3,33.5,P.woodHi);S.flat(14.7,17.3,12,20,33.5,P.woodHi);
    for(let j=0;j<cross.length;j++){
      const a=cross[j],b=cross[(j+1)%cross.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),F=face(A,a,b,dy/len,-dx/len);
      if([0,3,6,9].includes(j)){archWall(A,F,33.6,41.8,[{u:.35,w:len-.7,bottom:33.6,spring:38.3,rise:1.3}],'wood',.3);S.poly([F.point(-.3,.1,41.8),F.point(len+.3,.1,41.8),F.point(len/2,.1,43.3)],P.woodHi);}
      else{for(const u of[.15,len-.15])S.beam(F.point(u,0,33.6),F.point(u,0,41.8),P.woodHi,.32);}
    }
    S.flat(12,20,14.7,17.3,41.8,P.lead);S.flat(14.7,17.3,12,20,41.8,P.lead);
    const L=A.polygon(16,16,1.75,42.3,47.3,6,'wood',Math.PI/6);for(const F of L)A.pane(F,.16,43,F.length-.32,3.4,'plain',true);
    lathe(A,16,16,[[47.3,2],[48.3,1.9],[49.4,1.25],[50.5,.72],[51.6,.75],[52.7,.34],[53.6,.08]],'lead',12);
    S.beam([16,16,53.5],[16,16,55.3],P.gold,.16);
    return{...A.finish(),details:{northSouthBays:5,eastWestBays:4,upperCrossCasements:upper,dormers,lowerLanternPlan:'Greek cross with four actual arches and pediments',upperLanternSides:6,roof:'hipped-clay-tile-flat-lead-centre-dormers-ogee-hexagonal-lantern'}};
  }
  function portlandbill(row,view){
    const A=context(row,view),{S,K,P,Q}=A,cx=10,cy=13.2,n=24,profile=[[.5,4.6],[5,4.45],[22,4.05],[39,3.57],[55,3.13]];
    for(let i=0;i<profile.length-1;i++){
      const [z0,r0]=profile[i],[z1,r1]=profile[i+1];
      for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,m=(a+b)/2,red=z0>=22&&z1<=39,col=red?(A.dark(Math.cos(m),Math.sin(m))?Q.redD:Q.red):A.mat('plaster',Math.cos(m),Math.sin(m));S.poly([[cx+r0*Math.cos(a),cy+r0*Math.sin(a),z0],[cx+r0*Math.cos(b),cy+r0*Math.sin(b),z0],[cx+r1*Math.cos(b),cy+r1*Math.sin(b),z1],[cx+r1*Math.cos(a),cy+r1*Math.sin(a),z1]],col);}
    }
    let lights=0;
    for(let level=0;level<5;level++){
      const z=4+level*9.5,r=4.55-z*.026,F=face(A,[cx-1.2,cy+r+.02],[cx+1.2,cy+r+.02],0,1);
      F.block(-.15,2.55,-.4,.2,z-.3,z+4.8,Q.cream,Q.creamD,Q.creamHi);A.pane(F,.35,z+.2,1.7,3.8,'mullion',true);lights++;
    }
    for(const [z,r,h]of[[54,3.45,.65],[54.8,4.2,.7],[55.5,4.8,.65]])A.polygon(cx,cy,r,z,z+h,n,'stone');
    const balcony=Array.from({length:12},(_,i)=>[cx+4.55*Math.cos(i*Math.PI/6),cy+4.55*Math.sin(i*Math.PI/6)]);rail(A,balcony,56.2,2.6,true,P.ironD);
    const L=A.polygon(cx,cy,2.9,56.3,64.3,12,'steel');for(const F of L)A.pane(F,.12,57,F.length-.24,6,'plain',true);
    for(let j=0;j<12;j++){const a=j*Math.PI/6;S.beam([cx+2.95*Math.cos(a),cy+2.95*Math.sin(a),56.3],[cx+2.95*Math.cos(a),cy+2.95*Math.sin(a),64.4],Q.redD,.2);}
    // Domed lantern profile, not a copied conical windmill cap.
    lathe(A,cx,cy,[[64.3,3.3],[65.2,3.2],[66.3,2.8],[67.2,2.1],[67.8,1.1],[68,.1]],'lead',24);S.beam([cx,cy,68],[cx,cy,70],P.ironD,.14);
    const link=A.volume(13.2,19.1,12,15.8,.5,6.8,'plaster');A.pane(link.front,1.5,2.1,2.2,3.6,'sash',true);
    const house=A.volume(18.5,29.2,7.4,22.8,.5,17.5,'plaster');
    for(const [F,bays]of[[house.front,4],[house.back,4],[house.left,3],[house.right,3]]){
      for(let l=0;l<2;l++)for(let j=0;j<bays;j++)A.pane(F,F.length*(j+.5)/bays-.73,2+l*7.4,1.46,4.6,'sash',true);band(A,F,16.8,.55);
    }
    A.parapet(18.3,29.4,7.2,23,17.6,false);
    for(const [x,y]of[[20.1,9.6],[27.5,9.6],[20.1,20.5],[27.5,20.5]]){
      const F=A.volume(x-.7,x+.7,y-.9,y+.9,17.6,23.5,'plaster');S.box(x-.9,x+.9,y-1,y+1,23.5,24.1,P.stone,P.stoneR,P.stoneHi);for(const xx of[-.35,.35])K.cylinder(S,x+xx,y,24.1,25.3,.2,.24,Q.red,Q.redD,P.ink,8);
    }
    for(const [x0,x1,y0,y1]of[[2.1,29.8,27.5,28.2],[2.1,2.8,3.2,27.5],[29.1,29.8,3.2,27.5],[2.1,8,3.2,3.9],[12.5,29.8,3.2,3.9]])A.volume(x0,x1,y0,y1,.4,2.6,'stone');
    for(const x of[8,12.5])A.volume(x-.4,x+.4,2.8,4.3,.4,3.7,'stone');
    return{...A.finish(),details:{shaftWindowStages:lights,balconyBays:12,keeperHouseStoreys:2,keeperHouseBays:'4x3',largeStacks:4,lowConnectingRange:true,roof:'tapered-shaft-cylindrical-glazed-lantern-dome-flat-keeper-house',sourceShaftMetres:35,shaftHeightOnly:true}};
  }
  function cromer(row,view){
    const A=context(row,view),{S,K,P,Q}=A,deck=[[4.5,6],[28.1,6],[28.1,24.8],[4.5,24.8]];
    for(const x of[6,16,26.5])for(const y of[7.5,15.6,23.5]){
      S.box(x-.24,x+.24,y-.24,y+.24,.45,10.5,P.ironD,P.ironD,P.iron);
      for(let z=1;z<10;z+=1.5)S.box(x-.38,x+.38,y-.38,y+.38,z,z+.2,P.iron,P.ironD,P.ironHi);
    }
    for(const x of[6,26.5])for(const [a,b]of[[7.5,15.6],[15.6,23.5]]){S.beam([x,a,1],[x,b,9.7],P.ironD,.3);S.beam([x,b,1],[x,a,9.7],P.ironD,.3);}
    planBlock(A,deck,9.7,10.5,'stone');rail(A,deck,10.6,1.5,true,P.lead);
    const main=A.volume(7,22.5,7,20,10.5,24.2,'cedar');
    for(const F of[main.front,main.back])A.pane(F,.75,21.3,F.length-1.5,2,'ribbon',true);
    for(const F of[main.left,main.right])A.pane(F,.7,21.3,F.length-1.4,2,'ribbon',true);
    barrel(A,6.6,22.9,6.7,20.3,24.3,2.6);
    const side=A.volume(22.5,27.1,9.8,22.9,10.5,19.3,'cedar');
    for(const F of[side.front,side.right])A.pane(F,.35,16.5,F.length-.7,1.9,'ribbon',true);barrel(A,22.2,27.4,9.5,23.2,19.4,1.6);
    const front=A.volume(8.4,21,20,24.3,10.5,17.1,'cedar');barrel(A,8.1,21.3,19.8,24.6,17.2,1.8);
    // Wide working aperture is a real recessed roller door facing the slipway.
    front.front.panel(1,11.5,10.7,16.3,Q.tarD,.16);for(let z=11;z<16.3;z+=.55)front.front.panel(1,11.5,z,z+.10,P.lead,.23);
    for(const u of[.7,11.8])front.front.block(u,u+.24,0,.55,10.5,16.7,Q.steel,Q.steelD,Q.steelHi);
    for(const [xa,xb]of[[10.3,11.5],[18.3,19.5]]){
      S.poly([[xa,24.3,10.6],[xb,24.3,10.6],[xb,31,1.6],[xa,31,1.6]],P.stoneHi);
      S.poly([[xa,24.3,9.8],[xb,24.3,9.8],[xb,31,1.1],[xa,31,1.1]],P.stoneR);
      for(const y of[26,28.4,30.5]){const z=10.6-(y-24.3)*9/6.7;S.box(xa+.1,xb-.1,y-.25,y+.25,.45,z-.2,P.stone,P.stoneR,P.stoneHi);}
    }
    S.poly([[11.5,24.3,10.65],[18.3,24.3,10.65],[18.3,31,1.65],[11.5,31,1.65]],P.stoneR);
    for(const x of[10.2,19.6]){for(let j=0;j<=5;j++){const y=24.3+6.7*j/5,z=10.6-9*j/5;S.beam([x,y,z],[x,y,z+1.4],P.ironD,.15);}S.beam([x,24.3,12],[x,31,3],P.ironD,.18);}
    const approach=A.volume(12.4,17.4,.9,7,9.8,10.5,'wood');rail(A,[[12.5,1.1],[12.5,6.9]],10.6,1.5,false);rail(A,[[17.3,1.1],[17.3,6.9]],10.6,1.5,false);
    K.wallLamp(S,main.left,3,17.5);
    return{...A.finish(),details:{mainRoof:'shallow segmental metal barrel',steppedSecondaryRoofs:2,cedarWeatherboards:true,highStripWindows:true,piledPierSupport:true,slopingSlipway:true,newRescueMechanics:false,boathouseCompletion:'October 1998',sourcePhoto:'RNLI Paul Russell'}};
  }

  function georgesdock(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const body=A.volume(3.2,28.8,6,27,.6,28.8,'stone');
    for(const F of[body.front,body.back,body.right,body.left]){
      for(let z=1;z<7.2;z+=1.4)F.panel(0,F.length,z,z+.14,P.stoneD,.08);
      band(A,F,7.2,.7);band(A,F,28.8,.8);
    }
    for(const F of[body.front,body.back]){
      for(let group=0;group<3;group++){
        const center=F.length*(group+1)/4;
        F.block(center-2.1,center+2.1,-.09,.18,8.5,25.1,P.stoneD,P.stoneD,P.stoneR);
        for(const u of[center-1.75,center+.35])for(let l=0;l<3;l++)A.pane(F,u,9.3+l*5.2,1.4,3.7,'mullion',true);
        for(const u of[center-2.25,center+2.05])F.block(u,u+.2,.1,.45,8,26,P.stoneHi,P.stoneR,P.stoneHi);
      }
      for(let j=0;j<6;j++)A.pane(F,F.length*(j+.5)/6-.52,25.9,1.04,1.65,'mullion',true);
    }
    for(const F of[body.left,body.right])for(let j=0;j<4;j++)for(let l=0;l<3;l++)A.pane(F,F.length*(j+.5)/4-.7,9.2+l*5.4,1.4,3.9,'mullion',true);
    // Lower side wings have their own roof height; they are not extra towers.
    for(const [xa,xb]of[[2.6,7.2],[24.8,29.4]]){
      const wing=A.volume(xa,xb,5.4,27.6,.6,25.7,'stone');
      for(const F of[wing.front,wing.back]){F.panel(.55,F.length-.55,8.7,10.8,P.stoneD,.12);band(A,F,25.7,.8);}
    }
    const shaft=A.volume(10.5,21.5,11,22,29.3,70.5,'stone');
    for(const F of[shaft.front,shaft.back,shaft.left,shaft.right]){
      for(const u of[.15,F.length-.45])F.block(u,u+.3,.02,.27,29.3,70.5,P.stoneHi,P.stoneR,P.stoneHi);
      // Shallow carved fluting and raised relief use stone, without lit windows.
      const mid=F.length/2;
      for(const du of[-1,-.65,-.3,.05,.4,.75])F.block(mid+du-.05,mid+du+.05,.03,.23,31.5,57.5,P.stoneHi,P.stoneR,P.stoneHi);
      F.block(mid-1.4,mid+1.4,.04,.38,57.4,63.2,P.stoneHi,P.stoneR,P.stoneHi);
      F.panel(mid-1.13,mid+1.13,57.8,62.8,P.stoneD,.42);
      for(let j=0;j<4;j++){const z=58.4+j*1.05;S.beam(F.point(mid-1,.5,z),F.point(mid+1,.5,z+.35),P.stoneHi,.17);}
      for(const du of[-1.5,1.5]){
        F.block(mid+du-.14,mid+du+.14,.06,.47,57.7,65.5,P.stoneHi,P.stoneR,P.stoneHi);
        S.poly([F.point(mid+du-.65,.5,66.8),F.point(mid+du,.5,65.3),F.point(mid+du+.65,.5,66.8),F.point(mid+du+.3,.5,65.8),F.point(mid+du-.3,.5,65.8)],P.stoneD);
      }
      band(A,F,70.4,.5);
    }
    const top=[[10.35,10.85],[21.65,10.85],[21.65,22.15],[10.35,22.15]];
    for(let j=0;j<4;j++){
      const a=top[j],b=top[(j+1)%4],dx=b[0]-a[0],dy=b[1]-a[1],F=face(A,a,b,dy/11.3,-dx/11.3);
      for(let i=0;i<=10;i++){const u=i*F.length/10;F.block(u-.11,u+.11,-.23,.32,70.8,82.6,P.stone,P.stoneR,P.stoneHi);S.poly([F.point(u-.2,.34,82.6),F.point(u+.2,.34,82.6),F.point(u,.34,83.3)],P.stoneHi);}
      for(let l=0;l<7;l++){const z=71.4+l*1.36;S.poly([F.point(0,-.7,z),F.point(F.length,-.7,z),F.point(F.length,-.12,z+.38),F.point(0,-.12,z+.38)],A.mat('steel',F.nx,F.ny));}
    }
    S.flat(10.5,21.5,11,22,82.3,P.lead);
    const west=body.left,mid=west.length/2;K.timberDoor(west,mid-1.4,.7,2.8,6.4,true);
    for(const du of[-4.1,4.1]){
      west.panel(mid+du-.8,mid+du+.8,1.3,6.9,P.stoneD,.16);
      const p=west.point(mid+du,.5,0);K.cylinder(S,p[0],p[1],2.1,5.3,.28,.39,P.ironD,P.ironD,P.iron,8);K.cylinder(S,p[0],p[1],5.3,6.1,.29,.23,P.ironD,P.ironD,P.iron,8);
    }
    for(let j=0;j<6;j++)west.block(mid-.18,mid+.18,.08,.48,7.5+j*.78,8+j*.78,P.stoneHi,P.stoneR,P.stoneHi);
    A.steps(4,28,28.1,30.3,1.4,4);rail(A,[[3.3,28.1],[3.3,30.2],[28.7,30.2],[28.7,28.1]],1.8,1.9,false);
    return{...A.finish(),details:{mainVentilationShafts:1,ventFaces:4,unlitLouvres:true,lowerOfficeWings:2,deepPairedWindowRecesses:true,carvedReliefCompressed:true,exactStoreyCountClaimed:false,roof:'flat-office-bases-tall-stone-shaft-finned-louvred-crown',newTunnelMechanics:false}};
  }

  function burnham(row,view){
    const A=context(row,view),{S,K,P,Q}=A;let piles=0;
    for(const x of[10.5,16,21.5])for(const y of[9.5,15,20.3]){
      S.box(x-.34,x+.34,y-.34,y+.34,.45,19.7,Q.cream,Q.creamD,Q.creamHi);
      S.box(x-.4,x+.4,y-.4,y+.4,.45,3.7,P.ironD,P.ironD,P.iron);piles++;
    }
    for(const y of[9.5,20.3])S.box(10.1,21.9,y-.4,y+.4,18.6,19.7,Q.cream,Q.creamD,Q.creamHi);
    const B=A.volume(10.1,21.9,9.1,20.7,19.7,46.5,'whiteboard');
    B.front.panel(4.1,7.7,19.7,46.5,(u,z)=>K.mod(z,1.5)<.15?Q.redD:Q.red,.14);
    A.pane(B.front,4.45,23.2,2.9,5.8,'mullion',true);A.pane(B.front,4.55,36.1,2.7,5.2,'mullion',true);
    for(const F of[B.left,B.right]){A.pane(F,3.2,35.3,2.1,4.7,'plain',false);F.panel(3.2,5.3,25.1,29.1,Q.creamD,.15);}
    B.back.panel(0,B.back.length,19.7,30.7,Q.tarD,.12);K.timberDoor(B.back,1.3,19.8,2.8,8.4,false);
    hipPlateau(A,9.7,22.3,8.7,21.1,46.7,4.6,5.55,'whiteMetal');
    const cap=A.volume(14.6,17.4,13.5,16.5,51.3,53.7,'whiteMetal');cap.front.panel(0,cap.front.length,51.3,53.7,Q.red,.12);
    // The seaward stripe continues over the metal hip toward the apex.
    S.poly([[14.7,21.12,46.74],[17.3,21.12,46.74],[16.75,15.58,51.34],[15.25,15.58,51.34]],Q.red);
    S.beam([16,15,53.7],[16,15,55.3],P.ironD,.11);
    const flights=[[21.3,23.8,1.2,5.2,.5,10],[23.7,26.2,5.8,9.3,10,19.7]];
    for(const [xa,xb,ya,yb,za,zb]of flights){
      for(let i=0;i<10;i++){const y=ya+(yb-ya)*i/10,z=za+(zb-za)*(i+1)/10;S.box(xa,xb,y,y+(yb-ya)/10+.05,z-.15,z,Q.tar,Q.tarD,Q.tarHi);}
      for(const x of[xa,xb]){S.beam([x,ya,za],[x,yb,zb],Q.tarD,.31);S.beam([x,ya,za+1.8],[x,yb,zb+1.8],Q.tarD,.18);for(let j=0;j<=5;j++){const y=ya+(yb-ya)*j/5,z=za+(zb-za)*j/5;S.beam([x,y,z],[x,y,z+1.8],Q.tarD,.16);}}
    }
    S.box(21.1,26.4,5,6.2,9.8,10,Q.tar,Q.tarD,Q.tarHi);S.box(18.5,26.4,9.1,10,19.5,19.7,Q.tar,Q.tarD,Q.tarHi);
    for(const [x,y,z]of[[21.3,5.4,10],[26.2,5.4,10],[26.2,9.5,19.7]])S.box(x-.18,x+.18,y-.18,y+.18,.45,z,Q.tar,Q.tarD,Q.tarHi);
    rail(A,[[18.5,9.2],[18.5,9.9],[26.4,9.9]],19.8,1.8,false,Q.tarD);
    return{...A.finish(),details:{woodenPiers:piles,rearStairFlights:2,seawardStripe:'vertical; verified against original 2021 seaward photograph',rearLowerBlackCladding:true,roof:'white-painted-metal-hip-and-oblong-apex-projection',newNavigationMechanics:false}};
  }

  const AUTHORS=Object.freeze([netshops,burnham,saltdean,marinecourt,roundtower,spinnaker,lynncustoms,georgesdock,portlandbill,cromer]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave031 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture031=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
