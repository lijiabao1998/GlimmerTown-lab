/* GPT-035 / wave07. Original deterministic leisure architecture.
 * Primary references in the first-pushed card; native rasterizer and palette unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "landmarktheatre",
    "nm": "伊爾弗勒科姆地標劇院",
    "en": "Ilfracombe Landmark Theatre",
    "shape": "unequal-twin-truncated-cones-glazed-curving-foyer-stone-slope-wall",
    "note": "高低雙截錐、前側玻璃foyer與低石牆翼；依設計事務所實物照片壓縮。",
    "url": "https://www.timronalds.co.uk/landmark-ilfracombe"
  },
  {
    "id": "dreamland",
    "nm": "馬蓋特夢境電影院",
    "en": "Dreamland Cinema Margate",
    "shape": "expressionist-tall-brick-fin-l-plan-glass-block-cube-low-panorama-wing",
    "note": "高磚鰭塔、橫帶玻璃磚方體及低景觀窗翼；不是遊樂園整體縮圖。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1260315"
  },
  {
    "id": "eastbourne",
    "nm": "伊斯特本音樂台",
    "en": "Eastbourne Bandstand",
    "shape": "truncated-round-four-column-stage-blue-two-step-saucer-roof-open-curving-colonnades",
    "note": "截圓亭、四巨柱、藍色雙階淺碟頂與開放掃弧看台，異於傳統八角亭。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1385904"
  },
  {
    "id": "alexandra",
    "nm": "亞歷山德拉宮",
    "en": "Alexandra Palace",
    "shape": "long-double-colonnade-central-rose-gable-corner-towers-and-lattice-transmitter",
    "note": "中央山牆圓窗、雙層柱廊、方塔及播送鋼桅；主要宮殿按地塊作壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1268256"
  },
  {
    "id": "jubilee",
    "nm": "彭贊斯銀禧海水池",
    "en": "Penzance Jubilee Pool",
    "shape": "curving-triangular-pool-streamlined-white-sea-wall-stepped-changing-terraces",
    "note": "三角帶曲邊水池、白色擋海牆與台階更衣平台；原生地標外觀，沒有游泳功能。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1221190"
  },
  {
    "id": "dudley",
    "nm": "達德利動物園入口",
    "en": "Dudley Zoo Entrance",
    "shape": "five-ticket-kiosks-eight-openings-stepped-interlocking-s-canopies-slender-columns",
    "note": "五小亭、八入口與隨坡上升的交鎖S形薄板雨棚；未新增動物或票務玩法。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1216535"
  },
  {
    "id": "penguin",
    "nm": "倫敦動物園企鵝池",
    "en": "London Zoo Penguin Pool",
    "shape": "elliptical-pool-two-interlaced-free-cantilever-spiral-ramps-raised-viewing-frame",
    "note": "橢圓池、兩條獨立懸挑螺旋坡道及端部框景；展示歷史建築，沒有動物模擬。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1225665"
  },
  {
    "id": "globe",
    "nm": "莎士比亞環球劇場",
    "en": "Shakespeare's Globe",
    "shape": "three-storey-polygon-timber-white-wall-open-yard-thatch-ring-two-column-stage-canopy",
    "note": "三層木骨白牆、茅頂環廊與開放中庭、雙柱舞台篷；非封閉式劇院量體。",
    "url": "https://www.shakespearesglobe.com/discover/shakespeares-world/the-third-globe/"
  },
  {
    "id": "royalshakespeare",
    "nm": "皇家莎士比亞劇院",
    "en": "Royal Shakespeare Theatre",
    "shape": "bowed-brick-fin-foyer-central-fly-tower-chamfered-viewing-tower-rounded-swan-auditorium",
    "note": "彎曲入口、磚鰭、中央舞台高塔與削角觀景塔、Swan圓弧廳；兩劇場關係壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1207396"
  },
  {
    "id": "wintergardens",
    "nm": "黑池冬季花園",
    "en": "Blackpool Winter Gardens",
    "shape": "faience-classical-entrance-glass-dome-floral-hall-empress-dutch-gable-corner-towers",
    "note": "古典陶面入口、玻璃穹頂與大廳、Empress荷蘭山牆和角塔；選取主要結構。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1072007"
  }
].map((q,i)=>Object.freeze({...q,v:400+4*i})));
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
    if(!root.__wave035GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave035GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave035:1});
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

/* WAVE035 AUTHORED MODELS */
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
  // All helpers below are private to GPT-035 and operate in world coordinates.
  function clipRect(points,x0,x1,y0,y1){
    let out=points;
    for(const [axis,bound,sign]of[[0,x0,1],[0,x1,-1],[1,y0,1],[1,y1,-1]]){
      const src=out;out=[];if(!src.length)break;
      for(let i=0;i<src.length;i++){
        const a=src[i],b=src[(i+1)%src.length],ia=(a[axis]-bound)*sign>=-1e-8,ib=(b[axis]-bound)*sign>=-1e-8;
        if(ia)out.push(a);
        if(ia!==ib){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
      }
    }
    return out;
  }
  function concrete(A,nx,ny){const {K,P,Q}=A,d=A.dark(nx,ny);return(x,y,z)=>K.mod(z,2.1)<.10?(d?P.stoneD:P.stoneR):(d?Q.creamD:Q.cream);}
  function concreteBox(A,x0,x1,y0,y1,z0,z1){
    const f=A.volume(x0,x1,y0,y1,z0,z1,'plaster');
    for(const F of Object.values(f))A.S.wall(F.point(0,0,0),F.point(F.length,0,0),z0,z1,concrete(A,F.nx,F.ny));return f;
  }
  function glassFace(A,F,z0,z1,bays){
    A.pane(F,.18,z0,F.length-.36,z1-z0,'ribbon',true);
    for(let j=1;j<bays;j++)F.panel(F.length*j/bays-.07,F.length*j/bays+.07,z0,z1,A.P.frame,.38);
  }
  function shallowArch(A,F,u,z,w,h,rise,lit=true){
    const {S,P}=A,spring=z+h-rise,cx=u+w/2;
    const pts=(r,bottom,offset)=>[[cx-r,bottom],[cx+r,bottom],...Array.from({length:17},(_,i)=>{const t=i*Math.PI/16;return[cx+r*Math.cos(t),spring+(rise-offset)*Math.sin(t)];})];
    S.poly(pts(w/2+.25,z-.25,-.25).map(p=>F.point(p[0],.16,p[1])),P.stoneHi);
    S.poly(pts(w/2-.22,z+.25,.22).map(p=>F.point(p[0],.28,p[1])),lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    F.panel(cx-.08,cx+.08,z+.35,spring+rise-.35,P.frame,.4);F.panel(u+.3,u+w-.3,spring-.12,spring+.12,P.frame,.4);
  }
  function stairs3(A,x0,x1,y0,y1,z0,z1,n=14){
    const {S,P}=A;
    for(let j=0;j<n;j++){
      const ya=y0+(y1-y0)*j/n,yb=y0+(y1-y0)*(j+1)/n,z=z0+(z1-z0)*(j+1)/n;
      S.box(x0,x1,Math.min(ya,yb),Math.max(ya,yb)+.03,z-.27,z,P.stone,P.stoneR,P.stoneHi);
    }
    for(const x of[x0,x1]){S.beam([x,y0,z0],[x,y1,z1],P.stoneD,.42);S.beam([x,y0,z0+1.6],[x,y1,z1+1.6],P.ironD,.15);for(let j=0;j<=6;j++){const t=j/6;S.beam([x,y0+(y1-y0)*t,z0+(z1-z0)*t],[x,y0+(y1-y0)*t,z0+(z1-z0)*t+1.6],P.ironD,.12);}}
  }

  // GPT-035 helpers are private world-space solids. No bitmap or screen decal.
  const ellipse=(cx,cy,rx,ry,n=40,phase=0)=>Array.from({length:n},(_,j)=>{const t=phase+j*2*Math.PI/n;return[cx+rx*Math.cos(t),cy+ry*Math.sin(t)];});
  function rim(A,out,inside,z0,z1,kind='plaster'){
    const {S,P}=A;
    for(let i=0;i<out.length;i++){
      const j=(i+1)%out.length,a=out[i],b=out[j],c=inside[i],d=inside[j],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;
      S.wall(a,b,z0,z1,A.mat(kind,nx,ny));S.wall(c,d,z0,z1,A.mat(kind,-nx,-ny));
      S.poly([[...a,z1],[...b,z1],[...d,z1],[...c,z1]],P.stoneHi);
    }
  }
  function ringSurface(A,out,inside,zOuter,zInner,material){
    for(let i=0;i<out.length;i++){const j=(i+1)%out.length;A.S.poly([[...out[i],zOuter],[...out[j],zOuter],[...inside[j],zInner],[...inside[i],zInner]],material);}
  }
  function slab(A,points,z,thick=.45,col){
    const {S,P}=A,c=col===undefined?P.stoneHi:col;
    S.poly(points.map(p=>[...p,z]),c);S.poly(points.map(p=>[...p,z-thick]),P.stoneD);
    for(let i=0;i<points.length;i++)S.wall(points[i],points[(i+1)%points.length],z-thick,z,A.Q.creamD);
  }
  function roundWindow(A,F,u,z,r,lit=true){
    const {S,K,P}=A,points=Array.from({length:24},(_,j)=>{const t=j*2*Math.PI/24;return F.point(u+r*Math.cos(t),.19,z+r*Math.sin(t));});
    S.poly(points,lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    K.ring(S,F,u,z,r+.3,r+.3,.35,.24,P.stoneHi,24);
    for(const t of[0,Math.PI/3,2*Math.PI/3])S.beam(F.point(u+r*Math.cos(t),.33,z+r*Math.sin(t)),F.point(u-r*Math.cos(t),.33,z-r*Math.sin(t)),P.frame,.16);
  }
  function glassRoof(A,x0,x1,y0,y1,z,rise,bays=7){
    const {S,P}=A,cx=(x0+x1)/2;
    for(const [x,nx]of[[x0,-1],[x1,1]]){
      S.poly([[x,y0,z],[x,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],A.dark(nx,0)?P.glassR:P.glass);
      for(let j=0;j<=bays;j++){const y=y0+(y1-y0)*j/bays;S.beam([x,y,z+.04],[cx,y,z+rise+.04],P.frame,.17);}
      for(let j=1;j<4;j++){const t=j/4;S.beam([x+(cx-x)*t,y0,z+rise*t+.06],[x+(cx-x)*t,y1,z+rise*t+.06],P.frame,.13);}
    }
    for(const [y,ny]of[[y0,-1],[y1,1]]){
      S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],A.dark(0,ny)?P.glassR:P.glass);
      S.beam([x0,y,z],[cx,y,z+rise],P.frame,.22);S.beam([x1,y,z],[cx,y,z+rise],P.frame,.22);
    }
    S.beam([cx,y0,z+rise+.05],[cx,y1,z+rise+.05],P.lead,.24);
  }

  function landmarktheatre(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // A low stone slope-side wing links two unequal, closed-top truncated cones.
    const wing=planBlock(A,[[3,5],[28,5],[29,14],[24,24],[7,28],[3,20]],.5,5.9,'stone');
    for(const F of wing)if(F.length>6)A.windows(F,1,Math.floor(F.length/4),1.4,0,2.2,2.7,'plain');
    const cones=[[11,21,8.6,4.8,6,32],[23,10.8,7.3,4.1,6,41]];
    for(const [cx,cy,r0,r1,z0,z1]of cones){
      lathe(A,cx,cy,[[z0,r0],[z1,r1]],'plaster',40);
      S.poly(ellipse(cx,cy,r1,r1,40).map(p=>[...p,z1]),Q.creamHi);
      const outer=ellipse(cx,cy,r1+.12,r1+.12,40),inner=ellipse(cx,cy,r1-.2,r1-.2,40);rim(A,outer,inner,z1-.1,z1+.28);
    }
    // Glazed lower foyer runs around the forward cone, with inclined mullions.
    for(let j=0;j<22;j++){
      const a=.02+j*Math.PI/22,b=.02+(j+1)*Math.PI/22,at=(t,r,z)=>[11+r*Math.cos(t),21+r*Math.sin(t),z];
      S.poly([at(a,8.9,.7),at(b,8.9,.7),at(b,8.5,6.1),at(a,8.5,6.1)],[P.glass,P.warm]);
      S.beam(at(a,8.92,.7),at(a,8.53,6.25),P.frame,.22);
    }
    const edge=ellipse(11,21,9.1,9.1,44).filter((_,i)=>i<=22);for(let j=0;j<edge.length-1;j++)S.beam([...edge[j],6.2],[...edge[j+1],6.2],Q.creamHi,.32);
    // Side steps are part of this architecture, not a change to map terrain.
    stairs3(A,26.9,29.4,27.6,15.2,.5,6,13);
    return{...A.finish(),details:{twinTruncatedCones:2,unequalConeHeights:true,closedConeCaps:true,curvedGlazedFoyer:true,stoneSlopeWing:true,roof:'two-flat-capped-truncated-cones',compressedProportions:true}};
  }

  function dreamland(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const auditorium=A.volume(5,26.8,3.8,16,.5,22,'brick');
    A.roof(4.7,27.1,3.5,16.3,22,2.1,'x','brick');
    for(const F of[auditorium.left,auditorium.right])for(let j=0;j<3;j++){const u=F.length*(j+.5)/3;F.block(u-.2,u+.2,0,.42,1,21,Q.red,Q.redD,Q.red);A.pane(F,u-.6,2.4,1.2,2.1,'plain',false);}
    const west=A.volume(3,15.4,17,27,.5,12,'brick');
    A.pane(west.front,.7,5.2,west.front.length-1.4,4.1,'ribbon',true);
    A.pane(west.left,.5,5.2,west.left.length-1,4.1,'ribbon',true);
    const east=A.volume(17.5,28.4,16,27,.5,29,'brick');
    for(const F of[east.front,east.right])for(const z of[10,14,18,22,26]){
      F.panel(.5,F.length-.5,z,z+1.8,(u,v)=>K.mod(u,1)<.12||K.mod(v,1)<.12?P.frame:(A.dark(F.nx,F.ny)?P.glassR:P.glass),.12);
      F.block(.15,F.length-.15,0,.24,z-.5,z-.15,P.stoneHi,P.stoneR,P.stoneHi);
    }
    // Expressionist fin projects above the corner instead of being a square tower.
    const fin=A.volume(15,17.6,22.1,29.2,.5,57,'brick');
    for(const F of[fin.front,fin.left,fin.right]){
      F.block(.18,.38,.02,.24,17,55,P.stone,P.stoneR,P.stoneHi);
      F.block(F.length-.38,F.length-.18,.02,.24,17,55,P.stone,P.stoneR,P.stoneHi);
    }
    // Physical shallow sign box and outline strips; no text fonts or aura.
    fin.front.panel(.52,2.02,23,52,Q.tar,.29);
    for(let j=0;j<9;j++)fin.front.panel(.83,1.7,24+j*3,24.35+j*3,[P.gold,P.warm],.34);
    for(const [x0,x1,z]of[[2.7,29,4],[3,29,11.9]]){
      S.box(x0,x1,27.05,28.2,z,z+.55,P.ink,P.ironD,P.lead);
      S.beam([x0,28.28,z+.18],[x1,28.28,z+.18],[P.gold,P.warm],.15);
    }
    const entrance=A.volume(12,22.3,26.8,28,.5,4.2,'stone');A.pane(entrance.front,.7,1,8.9,2.7,'ribbon',true);
    A.steps(11.8,22.5,28,30.1,1.2,4);
    return{...A.finish(),details:{plan:'L',projectingBrickFin:true,glassBlockBands:5,lowPanoramicRestaurantWing:true,rearAuditoriumPlain:true,physicalSignOutline:true,roof:'low-flat-wing-high-band-cube-and-tall-fin',newAmusementMechanics:false}};
  }

  function eastbourne(row,view){
    const A=context(row,view),{S,K,P,Q}=A,cx=16,cy=12;
    const disc=ellipse(cx,cy,9,7.5,40).map(p=>[p[0],Math.min(p[1],18.1)]);
    planBlock(A,disc,.5,2.8,'plaster');
    // Four fluted giant columns carry the saucer roof; open bays stay empty.
    for(const t of[.14,.38,.62,.86].map(v=>v*Math.PI)){
      const x=cx+8.15*Math.cos(t),y=cy+6.6*Math.sin(t);
      K.cylinder(S,x,y,2.7,3.5,.77,.77,Q.cream,Q.creamD,Q.creamHi,12);
      K.cylinder(S,x,y,3.5,18.4,.58,.56,Q.cream,Q.creamD,Q.creamHi,16);
      for(let j=0;j<8;j++){const a=j*Math.PI/4;S.beam([x+.59*Math.cos(a),y+.59*Math.sin(a),3.8],[x+.57*Math.cos(a),y+.57*Math.sin(a),18],Q.creamD,.1);}
      K.cylinder(S,x,y,18.1,19,.83,.83,Q.cream,Q.creamD,Q.creamHi,12);
    }
    // The truncated rear stage wall is not filled through the audience opening.
    const rear=ellipse(cx,cy,8.2,6.8,40).filter((_,j)=>j>=20);
    for(let j=0;j<rear.length-1;j++)S.wall(rear[j],rear[j+1],2.8,17.8,A.mat('plaster',rear[j][0]-cx,rear[j][1]-cy));
    lathe(A,cx,cy,[[18.8,9.2],[19.4,9.7],[20.1,9.7],[20.4,8.7],[21.2,8.7],[23.2,1.1]],'zinc',40);
    for(const z of[19.4,20.7]){
      const r=z<20?9.73:8.73,pts=ellipse(cx,cy,r,r,40);
      for(let j=0;j<40;j++)S.beam([...pts[j],z],[...pts[(j+1)%40],z],P.glassR,.34);
    }
    K.cylinder(S,cx,cy,23.1,24.6,.35,.2,P.gold,P.woodD,P.gold,10);S.beam([cx,cy,24.6],[cx,cy,26.2],P.gold,.13);
    for(const side of[-1,1]){
      const x0=side<0?2.6:24.2,x1=side<0?7.8:29.4,F=A.volume(x0,x1,18.9,28.8,.5,5.5,'plaster');
      for(const ff of Object.values(F))A.windows(ff,1,Math.max(1,Math.floor(ff.length/2.7)),1.4,0,1.4,2.9,'plain');
      // Viewing terrace has an open colonnade above the low service rooms.
      for(const y of[19.4,22.3,25.2,28.3])for(const x of[x0+.4,x1-.4])K.cylinder(S,x,y,5.5,10.2,.21,.21,Q.cream,Q.creamD,Q.creamHi,8);
      S.box(x0-.25,x1+.25,18.6,29,10,10.55,Q.cream,Q.creamD,Q.creamHi);
      rail(A,[[x0,19],[x0,28.7],[x1,28.7],[x1,19]],5.6,1.6,false,P.glassR);
    }
    for(let j=0;j<12;j++){const t=.06+(j+.5)*Math.PI/12;S.beam([cx+9.15*Math.cos(t),cy+9.15*Math.sin(t),18.75],[cx+9.15*Math.cos(t+.045),cy+9.15*Math.sin(t+.045),18.75],[P.paper,P.warm],.18);}
    A.steps(10.2,21.8,19,22.5,2.35,6);
    return{...A.finish(),details:{truncatedCircularStage:true,giantFlutedColumns:4,roofSteps:2,coveredViewingDecks:2,openColonnades:true,roof:'blue-shallow-stepped-saucer-with-small-finial',newMusicMechanics:false}};
  }

  function alexandra(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const wings=[];
    for(const [x0,x1]of[[3.2,12.4],[19.6,28.8]]){
      const F=A.volume(x0,x1,10.4,26.6,.5,17.4,'yellowbrick');wings.push(F);
      for(const f of[F.front,F.back]){
        // The full fifteen-bay ranges are compressed to five visible bays.
        A.windows(f,2,5,2.2,7.7,1.35,4.4,'arch');
        for(let j=0;j<=5;j++){const u=f.length*j/5;f.block(u-.12,u+.12,.05,.45,.6,17.6,P.stone,P.stoneR,P.stoneHi);}
        for(const z of[8.3,17.4])band(A,f,z,.55);
      }
      glassRoof(A,x0-.2,x1+.2,10.1,26.8,17.6,3.1,8);
    }
    const H=A.volume(12.5,19.5,8,27.5,.5,25,'yellowbrick');
    A.roof(12.2,19.8,7.7,27.8,25,7.2,'y','yellowbrick');
    for(const F of[H.front,H.back]){
      A.windows(F,1,3,3,0,1.15,6.2,'arch');roundWindow(A,F,F.length/2,22.4,2.45);
      for(const u of[.2,F.length-.2])F.block(u-.18,u+.18,.01,.6,.5,25.8,P.stoneHi,P.stoneR,P.stoneHi);
      F.block(-.3,F.length+.3,.05,.75,12.6,13.4,P.stone,P.stoneR,P.stoneHi);
    }
    const towers=[];
    for(const [x,y]of[[4.8,25.2],[27.2,25.2],[4.8,11.1],[27.2,11.1]]){
      const F=A.volume(x-1.8,x+1.8,y-2.1,y+2.1,.5,25.9,'yellowbrick');towers.push(F);
      for(const f of Object.values(F)){A.windows(f,2,2,4,9.1,.72,3.6,'arch');band(A,f,18.7,.38);}
      hipPlateau(A,x-2.05,x+2.05,y-2.35,y+2.35,26,4.4,1.2,'lead');
      S.beam([x,y,30.4],[x,y,32.3],P.ironD,.18);
    }
    // BBC mast is a separate open lattice above the southeast corner tower.
    const tx=27.2,ty=25.2,z0=30.5,z1=62;
    for(let j=0;j<8;j++){
      const za=z0+(z1-z0)*j/8,zb=z0+(z1-z0)*(j+1)/8,r=.95*(1-j/10),rr=.95*(1-(j+1)/10);
      for(const [a,b]of[[[-r,-r],[r,-r]],[[r,-r],[r,r]],[[r,r],[-r,r]],[[-r,r],[-r,-r]]]){
        const aa=[tx+a[0],ty+a[1],za],bb=[tx+b[0],ty+b[1],za],upper=[tx+b[0]/r*rr,ty+b[1]/r*rr,zb];
        S.beam(aa,bb,P.ironD,.14);S.beam(aa,[tx+a[0]/r*rr,ty+a[1]/r*rr,zb],P.ironD,.16);S.beam(aa,upper,P.ironHi,.11);
      }
    }
    S.beam([tx,ty,z1],[tx,ty,z1+4],P.ironD,.15);
    for(const z of[43.1,52.4]){S.beam([tx-1.5,ty,z],[tx+1.5,ty,z],P.ironD,.18);S.beam([tx,ty-1.5,z],[tx,ty+1.5,z],P.ironD,.18);}
    A.steps(11,21,28,30.2,1.6,5);
    return{...A.finish(),details:{selectedLongRanges:2,fullRangeBays:15,shownBaysPerRange:5,centralRoseWindows:2,cornerTowers:4,openLatticeBroadcastMast:true,roof:'central-pitched-hall-glazed-ranges-and-square-tower-caps',notWholeSevenAcreSite:true}};
  }

  function roundedTriangle(points,cut=.13){
    const out=[];
    for(let i=0;i<points.length;i++){
      const p=points[(i+points.length-1)%points.length],q=points[i],r=points[(i+1)%points.length],a=q.map((v,j)=>v+(p[j]-v)*cut),b=q.map((v,j)=>v+(r[j]-v)*cut);
      for(let j=0;j<=8;j++){const t=j/8;out.push(a.map((v,k)=>(1-t)**2*v+2*(1-t)*t*q[k]+t*t*b[k]));}
    }
    return out;
  }
  function jubilee(row,view){
    const A=context(row,view),{S,P,Q}=A,outer=roundedTriangle([[2.3,6],[29.7,4.7],[17.8,29.4]]),scale=f=>outer.map(([x,y])=>[16+(x-16)*f,14+(y-14)*f]);
    // Three curved corners, not a triangular painted patch on a rectangular pool.
    rim(A,outer,scale(.95),.5,5.5,'plaster');
    for(let j=0;j<3;j++)rim(A,scale(.95-j*.06),scale(.89-j*.06),.5,4.4-j*.85,'plaster');
    const wet=scale(.75);S.poly(wet.map(p=>[...p,.72]),(x,y,z)=>A.K.mod(x+y,4.8)<.18?P.glass:P.glassR);
    rim(A,scale(.77),wet,.5,1.15,'plaster');
    // Dressing rooms sit in the broad landward side of the terraced perimeter.
    const rear=A.volume(7.3,25.3,5.6,8.7,1.3,7.1,'plaster');
    for(let j=0;j<9;j++){
      const u=.3+j*1.95;rear.front.panel(u,u+1.3,1.7,5.7,Q.creamD,.13);rear.front.panel(u+.15,u+1.15,1.9,5.4,P.woodR,.18);
      rear.front.panel(u+.1,u+1.2,6,6.6,[P.glass,P.warm],.17);
    }
    S.box(7.1,25.5,5.35,8.95,7.1,7.55,Q.cream,Q.creamD,Q.creamHi);
    for(const [x,y]of[[11.2,10.3],[21.1,10]]){
      for(const dx of[-.45,.45])S.beam([x+dx,y,1.1],[x+dx,y+1.6,.68],P.ironHi,.11);
      for(let j=0;j<4;j++)S.beam([x-.45,y+.4*j,1.1-.1*j],[x+.45,y+.4*j,1.1-.1*j],P.ironHi,.1);
    }
    stairs3(A,3.2,5.1,13.8,8.4,1.2,4.5,7);
    const dive=A.volume(15.8,17,9.1,10.4,1.1,3.5,'plaster');S.box(15.55,17.25,9,12,3.4,3.8,Q.cream,Q.creamD,Q.creamHi);
    return{...A.finish(),details:{poolPlan:'rounded-triangle',streamlinedSeaWalls:true,terraceSteps:3,selectedChangingCubicles:9,opaqueStaticNativePool:true,roof:'low-flat-changing-rooms-open-sky-pool',newSwimmingMechanics:false}};
  }

  function dudley(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    // Stair-height changes belong to the object; map and ground remain unchanged.
    for(let j=0;j<5;j++){
      const x0=2.2+j*5.55,x1=x0+5.55,base=.5+j*.62;
      S.box(x0,x1,11,26.5,.45,base+.3,P.pave,P.paveR,P.pave);
      const kiosk=A.volume(x0+1.5,x0+3.8,14.8,19.3,base,base+5.6,'blackwood');
      for(const F of[kiosk.front,kiosk.back]){
        A.pane(F,.32,base+2.7,F.length-.64,1.9,'plain',true);
        F.panel(.52,F.length-.52,base+.2,base+2.45,P.greenD,.18);
      }
      for(const F of[kiosk.left,kiosk.right])roundWindow(A,F,F.length/2,base+3.2,1.05,false);
      const at=t=>[x0-.3+(x1-x0+.6)*t,8.8+base+1.85*Math.sin((t-.25)*Math.PI*1.2)];
      // Each canopy is a thin S profile, carried through its full depth.
      for(let k=0;k<24;k++){
        const [x,z]=at(k/24),[xx,zz]=at((k+1)/24);
        S.poly([[x,11,z],[xx,11,zz],[xx,26,zz],[x,26,z]],Q.creamHi);
        S.poly([[x,11,z-.38],[xx,11,zz-.38],[xx,26,zz-.38],[x,26,z-.38]],P.stoneD);
        for(const y of[11,26])S.poly([[x,y,z-.38],[xx,y,zz-.38],[xx,y,zz],[x,y,z]],Q.creamD);
      }
      for(const [x,t]of[[x0+.65,.16],[x1-.65,.84]])for(const y of[12,24.8]){
        const z=at(t)[1];K.cylinder(S,x,y,base,z-.38,.14,.14,Q.cream,Q.creamD,Q.creamHi,8);
      }
    }
    // Eight turnstile openings between low rails; no new ticket simulation.
    for(let j=0;j<8;j++){
      const x=3.1+j*3.6,z=.65+Math.floor(j/2)*.62;
      S.beam([x,22,z],[x,22,z+2.3],P.ironD,.17);S.beam([x,22,z+1.5],[x+1.15,22,z+1.5],P.ironHi,.16);
    }
    return{...A.finish(),details:{ticketKiosks:5,turnstileOpenings:8,separateInterlockingCanopies:5,thinSProfiles:true,slenderColumns:true,steppedGroundWithinSprite:true,roof:'five-stepped-thin-concrete-S-canopies',newZooMechanics:false}};
  }

  function penguin(row,view){
    const A=context(row,view),{S,P,Q}=A,out=ellipse(16,16,13.3,10.6,48),inside=ellipse(16,16,12.35,9.65,48);
    rim(A,out,inside,.5,4.3,'plaster');
    S.poly(inside.map(p=>[...p,.8]),(x,y,z)=>A.K.mod(x-y,5)<.2?P.glass:P.glassR);
    // Two independent spiral cantilevers rise from opposite abutments. Their
    // floors, edges and undersides are actual solids with no intermediate posts.
    for(const phase of[0,Math.PI]){
      const strip=t=>{
        const a=phase+t*Math.PI*1.55,r=7.6-3.3*t,cx=16+Math.cos(a)*r,cy=16+Math.sin(a)*r*.73,z=1.25+8.2*t;
        return[[cx+Math.cos(a)*.72,cy+Math.sin(a)*.72,z],[cx-Math.cos(a)*.72,cy-Math.sin(a)*.72,z]];
      };
      for(let j=0;j<56;j++){
        const a=strip(j/56),b=strip((j+1)/56),under=p=>[p[0],p[1],p[2]-.42];
        S.poly([a[0],b[0],b[1],a[1]],Q.creamHi);S.poly([under(a[0]),under(b[0]),under(b[1]),under(a[1])],P.stoneD);
        for(const k of[0,1])S.poly([a[k],b[k],under(b[k]),under(a[k])],A.mat('plaster',Math.cos(phase+j/56*Math.PI*1.55),Math.sin(phase+j/56*Math.PI*1.55)));
      }
      const p=strip(1),end=p[0];concreteBox(A,end[0]-1,end[0]+1,end[1]-1,end[1]+1,.7,9.4);
    }
    // Tall curved end enclosure and rectangular framed viewing aperture.
    for(let j=0;j<15;j++){
      const a=Math.PI*1.02+j*Math.PI*.74/15,b=Math.PI*1.02+(j+1)*Math.PI*.74/15;
      S.wall([16+12.7*Math.cos(a),16+10*Math.sin(a)],[16+12.7*Math.cos(b),16+10*Math.sin(b)],.6,11,A.mat('plaster',Math.cos((a+b)/2),Math.sin((a+b)/2)));
    }
    const F=face(A,[7.1,9],[15.2,5.7],-.4,-.92);
    // A real opening is assembled from jambs and lintel rather than a dark decal.
    for(const [u0,u1]of[[0,.65],[7.45,8.1]]){
      const a=F.point(u0,0,0),b=F.point(u1,0,0);concreteBox(A,Math.min(a[0],b[0])-.2,Math.max(a[0],b[0])+.2,Math.min(a[1],b[1])-.2,Math.max(a[1],b[1])+.2,9.7,15.2);
    }
    S.beam(F.point(0,0,15.2),F.point(8.1,0,15.2),Q.creamHi,.65);S.beam(F.point(0,0,10),F.point(8.1,0,10),Q.creamHi,.55);
    slab(A,[[21,7.5],[25.5,9],[27.7,12.5],[23.2,12]],9,.5);
    for(const [x,y]of[[22,9],[25.5,11]])S.beam([x,y,.6],[x,y,8.5],Q.creamD,.2);
    return{...A.finish(),details:{ellipticalEnclosure:true,separateSpiralCantilevers:2,intermediateRampSupports:0,raisedFramedAperture:true,staticOpaquePool:true,roof:'open-pool-with-small-end-canopy',animalsDrawn:0,newAnimalMechanics:false}};
  }

  function globe(row,view){
    const A=context(row,view),{S,K,P,Q}=A,n=20,cx=16,cy=16,out=ellipse(cx,cy,13,13,n,Math.PI/20),inside=ellipse(cx,cy,9.15,9.15,n,Math.PI/20);
    for(let j=0;j<n;j++){
      const k=(j+1)%n,a=out[j],b=out[k],t=(j+.5)*2*Math.PI/n+Math.PI/20,nx=Math.cos(t),ny=Math.sin(t),F=face(A,a,b,nx,ny);
      S.wall(a,b,.5,26.5,A.mat('plaster',nx,ny));
      // Exposed posts, storey rails and true diagonal timber braces.
      for(const z of[.7,8.9,17.1,26.1])S.beam([...a,z],[...b,z],P.woodD,.36);
      S.beam([...a,.5],[...a,26.6],P.woodD,.33);
      for(const z of[1.1,17.4])S.beam(F.point(.25,.13,z),F.point(F.length-.25,.13,z+7.7),P.woodR,.18);
      if(j%3===0)for(const z of[3.2,11.3,19.5])A.pane(F,F.length/2-.48,z,.96,1.65,'plain',false);
      // Three open inward galleries. Floors and balustrades leave real voids.
      for(const z of[1.1,9.2,17.3]){
        S.poly([[...a,z],[...b,z],[...inside[k],z],[...inside[j],z]],P.woodR);
        S.beam([...inside[j],z],[...inside[j],z+8],P.woodD,.27);
        S.beam([...inside[j],z+2.7],[...inside[k],z+2.7],P.woodD,.21);
        for(let q=0;q<4;q++){const t=q/4,p=inside[j].map((v,i)=>v+(inside[k][i]-v)*t);S.beam([...p,z],[...p,z+2.7],P.woodR,.13);}
      }
    }
    const ridge=ellipse(cx,cy,11.25,11.25,n,Math.PI/20),eaves=ellipse(cx,cy,13.55,13.55,n,Math.PI/20),innerEave=ellipse(cx,cy,8.7,8.7,n,Math.PI/20);
    const straw=(x,y,z)=>K.mod(z,1.05)<.15?P.woodD:K.hash(Math.floor(x*3),Math.floor(y*3),3507)%5===0?P.woodHi:P.wood;
    ringSurface(A,eaves,ridge,26.7,31.5,straw);ringSurface(A,ridge,innerEave,31.5,26.9,straw);
    for(let j=0;j<n;j++){const k=(j+1)%n;S.beam([...ridge[j],31.5],[...ridge[k],31.5],P.woodD,.26);S.beam([...eaves[j],26.7],[...eaves[k],26.7],P.woodD,.28);}
    // The central yard stays open. Only the rear stage carries its own canopy.
    S.poly(inside.map(p=>[...p,.52]),P.soil);
    const stage=A.volume(11,21,7.6,13.1,.6,3.9,'wood');
    const back=A.volume(11,21,7,8.9,3.8,21.3,'plaster');
    for(const F of[back.front]){A.pane(F,1,5.2,2.1,4.7,'plain',true);A.pane(F,6.9,5.2,2.1,4.7,'plain',true);F.panel(3.4,6.6,6,11.1,P.woodR,.2);}
    for(const x of[11.6,20.4]){
      K.cylinder(S,x,13.4,3.8,20,.4,.31,P.woodHi,P.woodR,P.woodHi,10);
      S.box(x-.55,x+.55,12.85,13.95,19.6,20.3,P.gold,P.woodR,P.gold);
    }
    A.roof(10.6,21.4,7.4,14.1,20.3,4.2,'x','wood');
    const entry=A.volume(14.6,17.4,27.2,29.4,.5,9.2,'plaster');A.pane(entry.front,.4,1,2,5.8,'arch',true);A.roof(14.3,17.7,26.9,29.7,9.2,3.1,'y','wood');
    return{...A.finish(),details:{polygonSides:20,storeys:3,openInnerGalleries:3,thatchedRoofRing:true,openCentralYard:true,stageCanopyColumns:2,roof:'pitched-thatch-annulus-and-separate-stage-canopy',newPerformanceMechanics:false}};
  }

  function royalshakespeare(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    // Back-to-back principal and Swan auditoria, with a shared central fly tower.
    const body=A.volume(8.7,25.9,11.6,25.1,.5,22.4,'brick');
    const foyer=roundedPlan(8.2,27.6,21.8,29,3.5,7),front=planBlock(A,foyer,.5,20.7,'brick');
    for(const F of front){
      if(F.length<.7)continue;
      A.pane(F,.15,3,F.length-.3,5.7,'plain',true);A.pane(F,.15,11,F.length-.3,6.3,'plain',true);
      S.beam(F.point(0,.2,1),F.point(0,.2,20.8),Q.redD,.32);
      S.beam(F.point(0,.25,8.9),F.point(F.length,.25,8.9),Q.red,.25);
    }
    slab(A,foyer,21.1,.45,P.lead);
    const restaurant=A.volume(10.4,24,17.8,26.3,22.5,27.2,'zinc');
    for(const F of[restaurant.front,restaurant.left,restaurant.right])glassFace(A,F,23,26.5,Math.max(3,Math.floor(F.length/2)));
    S.box(9.9,24.5,17.4,26.7,27.1,27.6,P.ink,P.ironD,P.lead);
    hipPlateau(A,10.2,24.6,12,22.8,23,5.4,3.7,'zinc');
    const fly=A.volume(11,24,10.3,16.7,22.3,40,'brick');
    for(const F of Object.values(fly))for(let u=1;u<F.length;u+=1.4)F.block(u-.1,u+.1,.01,.25,25,39,Q.red,Q.redD,Q.red);
    S.flat(10.8,24.2,10.1,16.9,40.2,P.lead);
    const swan=roundedPlan(10,25,3.2,11.8,5.9,10),sw=planBlock(A,swan,.5,21,'brick');
    for(const F of sw)if(F.length>1){for(const z of[6.2,13.5,20.5])band(A,F,z,.25);if(F.length>2.2)A.pane(F,F.length/2-.62,9,1.24,4.5,'mullion',false);}
    // The rounded Swan's lead roof and small gabled dormers differ from the
    // polygonal main auditorium and its blind rectangular fly tower.
    const crown=swan.map(([x,y])=>[17.5+(x-17.5)*.46,7.5+(y-7.5)*.46]);ringSurface(A,swan,crown,21,28,A.mat('lead',0,1));S.poly(crown.map(p=>[...p,28]),P.lead);
    for(const [x,y]of[[13,4.4],[20.1,4.4]]){const F=A.volume(x-1,x+1,y-.6,y+.8,23,25.8,'stone');A.pane(F.back,.3,23.3,1.4,1.8,'plain',true);A.roof(x-1.15,x+1.15,y-.75,y+.95,25.8,1.8,'y','stone');}
    // Slender battered tower with chamfered corners and a louvred viewing room.
    const base=[[2.7,23.2],[3.8,22.1],[6.5,22.1],[7.6,23.2],[7.6,27.2],[6.5,28.3],[3.8,28.3],[2.7,27.2]],top=base.map(([x,y])=>[5.15+(x-5.15)*.8,25.2+(y-25.2)*.8]);
    for(let j=0;j<8;j++){
      const k=(j+1)%8,a=base[j],b=base[k],c=top[j],d=top[k],nx=b[1]-a[1],ny=a[0]-b[0];S.poly([[...a,.5],[...b,.5],[...d,49],[...c,49]],A.mat('brick',nx,ny));
      if(j%2===0){const m=a.map((v,i)=>(v+b[i])/2),mm=c.map((v,i)=>(v+d[i])/2);S.beam([...m,2],[...mm,48],[P.glassR,P.warm],.18);}
    }
    const obs=planBlock(A,top,49,55.2,'zinc');
    for(const F of obs){A.pane(F,.12,49.4,F.length-.24,5.1,'ribbon',true);for(let j=0;j<6;j++)F.panel(.05,F.length-.05,49.9+j*.72,50.12+j*.72,P.ironD,.36);}
    slab(A,base,55.7,.5,P.lead);
    const link=A.volume(7.5,9.2,23.8,26.4,.5,10,'zinc');glassFace(A,link.front,1.1,8.7,2);
    const colonnade=A.volume(26,28.6,7.3,23.4,.5,12.3,'zinc');glassFace(A,colonnade.right,1,10.8,8);
    for(let y=7.4;y<23.4;y+=2.2)S.beam([29,y,.5],[29,y,12.8],P.ironD,.23);S.box(25.9,29.3,7.2,23.6,12.6,13.1,P.lead,P.ironD,P.lead);
    return{...A.finish(),details:{backToBackAuditoria:2,centralFlyTower:true,bowed1932Foyer:true,angledBrickFins:true,viewingTower:'battered-chamfered-brick-with-louvred-room',swan:'rounded-wall-lead-roof-gabled-dormers',glazedColonnade:true,roof:'three-distinct-main-fly-swan-and-observation-forms',compressedComplex:true}};
  }

  function wintergardens(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    // The selected church-street entrance, dome and Floral Hall lead to the
    // Empress block; this deliberately omits the remainder of a large complex.
    const hall=A.volume(11.2,19.8,5,24.4,.5,17.1,'yellowbrick');
    for(const F of[hall.left,hall.right])A.windows(F,1,7,3.8,0,1.5,8.6,'arch');
    glassRoof(A,10.9,20.1,4.7,24.7,17.3,4.7,10);
    const entrance=A.volume(3.2,27.8,24.7,28.7,.5,19.9,'plaster');
    for(const F of[entrance.front,entrance.back]){
      A.windows(F,1,7,10.2,0,2.1,5.7,'arch');
      for(const u of[.3,3.6,7.1,17.5,21,24.3]){F.block(u-.2,u+.2,.03,.6,.6,20.2,P.stone,P.stoneR,P.stoneHi);F.block(u-.45,u+.45,.02,.8,18.4,19.1,P.stoneHi,P.stoneR,P.stoneHi);}
      for(const z of[8.4,19.7])band(A,F,z,.65);
    }
    const ef=entrance.front;
    A.pane(ef,8.5,1.1,7.6,6.9,'arch',true);
    for(const u of[7.7,16.9])K.cylinder(S,...ef.point(u,.8,0).slice(0,2),.6,19,.4,.37,P.stoneHi,P.stoneR,P.stoneHi,12);
    S.poly([ef.point(7.3,.75,20),ef.point(17.3,.75,20),ef.point(12.3,.75,25)],Q.creamHi);
    roundWindow(A,ef,12.3,21.3,1.35,false);
    const domeBase=A.polygon(15.5,21.1,5.4,17.4,22.4,24,'plaster');
    for(const F of domeBase)if(F.length>.8)A.pane(F,.1,18,F.length-.2,3.5,'plain',true);
    for(let i=0;i<24;i++){
      const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
      for(let j=0;j<10;j++){
        const t=j*Math.PI/20,tt=(j+1)*Math.PI/20,at=(u,v)=>[15.5+5.7*Math.cos(v)*Math.cos(u),21.1+5.7*Math.cos(v)*Math.sin(u),22.4+5.7*Math.sin(v)];
        S.poly([at(a,t),at(b,t),at(b,tt),at(a,tt)],A.dark(Math.cos(a),Math.sin(a))?P.glassR:P.glass);
        S.beam(at(a,t),at(a,tt),P.frame,.13);
      }
    }
    const empress=A.volume(21,29.1,4.5,21.7,.5,20.4,'brick');barrel(A,20.8,29.3,4.2,22,20.6,5.3);
    for(const F of[empress.left,empress.right]){A.windows(F,2,6,2.8,9.2,1.6,4.8,'arch');for(const z of[9.1,19.8])band(A,F,z,.35);}
    // Dutch end gables use a curving shoulder profile, not a triangle recolour.
    for(const F of[empress.front,empress.back]){
      const w=F.length,profile=[[0,20.4],[0,23.1],[w*.14,23.1],[w*.18,24.3],[w*.29,25.2],[w*.33,27],[w*.67,27],[w*.71,25.2],[w*.82,24.3],[w*.86,23.1],[w,23.1],[w,20.4]];
      // Fan triangulation stays within a convex face split at the centre line.
      const centre=F.point(w/2,.2,20.5);for(let j=0;j<profile.length-1;j++)S.poly([centre,F.point(profile[j][0],.2,profile[j][1]),F.point(profile[j+1][0],.2,profile[j+1][1])],A.mat('brick',F.nx,F.ny));
      for(let j=0;j<profile.length-1;j++)S.beam(F.point(profile[j][0],.3,profile[j][1]),F.point(profile[j+1][0],.3,profile[j+1][1]),P.stoneHi,.25);
      roundWindow(A,F,w/2,23.2,1.15,false);
    }
    for(const [x,y,h]of[[21.4,4.8,29],[28.7,4.8,26],[21.4,21.3,28],[28.7,21.3,25]]){
      const T=A.volume(x-1,x+1,y-1,y+1,18,h,'brick');for(const F of Object.values(T))A.pane(F,.55,h-4,.9,2.3,'arch',true);hipPlateau(A,x-1.25,x+1.25,y-1.25,y+1.25,h,2,.55,'lead');
    }
    A.steps(10,21,29,30.6,1.2,4);
    return{...A.finish(),details:{selectedComplexOnly:true,faienceClassicalEntrance:true,glazedVestibuleDome:true,glazedFloralHall:true,empressDutchGables:2,selectedCornerTowers:4,roof:'glazed-dome-long-glass-hall-and-barrel-empress-roof',notWholeStreetBlock:true}};
  }

  const AUTHORS=Object.freeze([landmarktheatre,dreamland,eastbourne,alexandra,jubilee,dudley,penguin,globe,royalshakespeare,wintergardens]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave035 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture035=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
