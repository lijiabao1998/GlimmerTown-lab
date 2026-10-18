/* GPT-033 / wave06. Original deterministic academic architecture.
 * One primary source per prototype; compressed proportions in the first-pushed card.
 * Approved rasterizer, palette, existing art and native model stay unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "leicester",
    "nm": "萊斯特工程學院",
    "en": "Leicester Engineering Building",
    "shape": "unequal-glazed-and-brick-towers-raked-lecture-theatres-diagonal-glass-workshop-roofs-octagonal-stack",
    "note": "高低雙塔、斜底講堂與45°玻璃工場屋脊；八角煙囪，長校舍作比例壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1074756"
  },
  {
    "id": "norfolk",
    "nm": "東英吉利亞階梯宿舍",
    "en": "UEA Norfolk Terrace",
    "shape": "right-angle-linked-stepped-ziggurat-flats-horizontal-windows-projecting-kitchens-raised-rear-walk",
    "note": "選取六座連續宿舍中的兩段90°退臺、橫窗、凸出廚房與高架後廊，非全校縮圖。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1390647"
  },
  {
    "id": "falmer",
    "nm": "薩塞克斯法爾默樓",
    "en": "Sussex Falmer House",
    "shape": "open-brick-court-segmental-arcades-barrel-refectory-copper-projections-v-roof-stair",
    "note": "紅磚院落、粗混凝土層帶、開放節段拱廊、食堂桶拱與北梯V頂。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1381044"
  },
  {
    "id": "yorkhall",
    "nm": "約克大學中央講堂",
    "en": "York Central Hall",
    "shape": "irregular-hexagonal-cantilever-hall-glazed-understorey-metal-tent-roof-wide-external-stairs",
    "note": "不規則六角懸挑大廳、玻璃基層、外部寬梯與懸吊鋼管金屬屋頂。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1456551"
  },
  {
    "id": "stcatherines",
    "nm": "牛津聖凱瑟琳學院",
    "en": "Oxford St Catherine's College",
    "shape": "flat-roof-hall-library-three-storey-glazed-residential-wings-twin-slab-bell-tower-glass-walkways",
    "note": "平頂餐廳與圖書館、豎梃玻璃住宿翼、覆玻璃步道及兩片混凝土鐘塔，院落比例壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1229934"
  },
  {
    "id": "physicians",
    "nm": "皇家內科醫師學院",
    "en": "Royal College of Physicians",
    "shape": "t-plan-white-cantilever-library-paired-slits-curved-brick-theatre-shallow-pyramid-twin-service-towers",
    "note": "白色懸挑圖書館、成對窄豎窗、曲面磚講堂與淺錐頂、雙服務塔。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1246159"
  },
  {
    "id": "senate",
    "nm": "劍橋議事廳",
    "en": "Cambridge Senate House",
    "shape": "nine-bay-classical-hall-corinthian-centrepiece-alternating-straight-and-curved-window-pediments",
    "note": "九開間長廳、中央三開間柱式及山花、直曲交替窗上山花；非圓頂圖書館。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1322818"
  },
  {
    "id": "glasgow",
    "nm": "格拉斯哥吉爾伯特史考特樓",
    "en": "Glasgow Gilbert Scott Building",
    "shape": "double-quadrangle-six-stage-central-tower-open-pierced-spire-pepperpot-turrets-crowstepped-gables",
    "note": "選取雙院落、六段中央塔與鏤空尖頂、角亭小錐塔及階梯山牆；校園長度作壓縮。",
    "url": "https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,LB32913"
  },
  {
    "id": "dunelm",
    "nm": "杜倫鄧納姆樓",
    "en": "Durham Dunelm House",
    "shape": "asymmetric-descending-riverbank-boxes-straight-spine-stair-serrated-slab-eaves-clerestories",
    "note": "向坡下錯層的混凝土廳體、中央階梯、鋸齒簷與平斜混合頂、突出廳及窄豎梃。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1477064"
  },
  {
    "id": "rogerstevens",
    "nm": "里茲羅傑史蒂文斯講堂",
    "en": "Leeds Roger Stevens Building",
    "shape": "four-stepped-theatre-sections-semicircular-vent-shafts-bulging-stair-pilotis-and-high-walkway",
    "note": "四段階梯講堂、半圓通風竪井、凸出梯灣、架空層與高架通道；依實物壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1393836"
  }
].map((q,i)=>Object.freeze({...q,v:360+4*i})));
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
    if(!root.__wave033GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave033GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave033:1});
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

/* WAVE033 AUTHORED MODELS */
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
  // All helpers below are private to GPT-033 and operate in world coordinates.
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
  function leicester(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const W=A.volume(3,29,3,16,.5,9,'brick');
    for(const F of Object.values(W))A.windows(F,1,Math.max(2,Math.floor(F.length/4)),3.1,0,2.2,3.3,'mullion');
    const rt=Math.SQRT1_2,xy=(u,v,z)=>[(v+u)*rt,(v-u)*rt,z];let ridges=0;
    for(let u=-11;u<19;u+=3.8){
      for(const side of[-1,1]){
        const poly=clipRect([xy(u,-50,12.3),xy(u,60,12.3),xy(u+side*1.9,60,9.1),xy(u+side*1.9,-50,9.1)],3,29,3,16);
        if(poly.length<3)continue;S.poly(poly,(x,y,z)=>K.mod((x+y)*rt,3.3)<.12?P.frame:(A.dark(side,-side)?P.glassR:P.glass));
        for(let j=0;j<poly.length;j++)S.beam(poly[j],poly[(j+1)%poly.length],P.frame,.17);
        // These glazing bars cross the true diagonal roof plane, not a flat decal.
        for(let v=4;v<34;v+=3.3){const q=clipRect([xy(u,v,12.4),xy(u+side*1.9,v,9.2),xy(u+side*1.9,v+.05,9.2),xy(u,v+.05,12.4)],3,29,3,16);if(q.length>=3)S.poly(q,P.frame);}
      }
      ridges++;
    }
    A.polygon(25.2,10,1.3,9,25.5,8,'brick',Math.PI/8);
    A.polygon(25.2,10,1.55,25.5,26,8,'stone',Math.PI/8);S.poly(Array.from({length:8},(_,j)=>[25.2+Math.cos((j+.5)*Math.PI/4)*.85,10+Math.sin((j+.5)*Math.PI/4)*.85,26.05]),P.ink);
    // A pair of separately supported, blind lecture theatres with raking undersides.
    for(const [x0,x1,y0,y1,za,zb]of[[4.4,14.8,17.2,25.4,8.2,16.6],[17,26.5,18.6,27.2,10.6,18]]){
      S.box(x0+2,x0+3,y0+1,y1-1,.5,za,P.stone,P.stoneR,P.stoneHi);
      for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,za],[x,y1,zb],[x,y1,zb+6],[x,y0,za+6]],A.mat('brick',nx,0));
      S.poly([[x0,y0,za],[x1,y0,za],[x1,y1,zb],[x0,y1,zb]],P.stoneD);
      S.poly([[x0,y0,za+6],[x1,y0,za+6],[x1,y1,zb+6],[x0,y1,zb+6]],Q.redD);
      S.wall([x0,y1],[x1,y1],zb,zb+6,A.mat('brick',0,1));
    }
    const O=A.volume(5.2,13.1,16,22,19.2,53,'steel');
    for(const F of Object.values(O))for(let l=0;l<7;l++){glassFace(A,F,20.1+l*4.6,23.4+l*4.6,3);band(A,F,23.65+l*4.6,.25);}
    S.flat(4.9,13.4,15.7,22.3,53.2,Q.steelD);
    const R=A.volume(17.4,25.5,22.4,28.5,23,39.2,'brick');
    for(const F of Object.values(R))for(let l=0;l<4;l++){
      const z=24.1+l*3.6,u=.45,w=F.length-.9,h=1.65;
      S.poly([F.point(u,.14,z),F.point(u+w,.14,z),F.point(u+w,.85,z+h),F.point(u,.85,z+h)],[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]);
      for(const k of[0,1,2,3]){const t=u+w*k/3;S.beam(F.point(t,.15,z),F.point(t,.86,z+h),P.frame,.12);}
      S.beam(F.point(u,.86,z+h),F.point(u+w,.86,z+h),P.frame,.15);
    }
    stairs3(A,27,29.3,28.5,20,.5,10,10);
    return{...A.finish(),details:{towers:2,officeStoreysShown:7,researchGlazingBands:4,lectureTheatres:2,workshopRidgeOrientationDegrees:45,roofRidgeStrips:ridges,octagonalStack:true,roof:'real-diagonal-glazing-ridges-and-two-unequal-flat-towers',compressedComplex:true}};
  }
  function norfolk(row,view){
    const A=context(row,view),{S,P,Q}=A;let flats=0;
    for(let l=0;l<7;l++){
      const z=.6+l*4.2,y=29-l*1.65,x=3.4+l*1.27;
      const F=concreteBox(A,13.2,28.3,12.4,y,z,z+4.2);
      A.pane(F.front,.25,z+.8,F.front.length-.5,2.5,'ribbon',true);A.pane(F.right,.2,z+.8,F.right.length-.4,2.5,'ribbon',true);
      S.box(12.9,28.65,y-.04,y+.35,z+3.5,z+4.25,Q.cream,Q.creamD,Q.creamHi);
      const G=concreteBox(A,x,13.2,3.7,25.5,z,z+4.2);
      A.pane(G.left,.3,z+.8,G.left.length-.6,2.5,'ribbon',true);A.pane(G.back,.25,z+.8,G.back.length-.5,2.5,'ribbon',true);
      S.box(x-.35,x+.04,3.4,25.7,z+3.5,z+4.25,Q.cream,Q.creamD,Q.creamHi);
      const kitchen=concreteBox(A,25.6,29.1,y-2.6,y+.8,z,z+4.2);
      A.pane(kitchen.front,.3,z+.9,kitchen.front.length-.6,2.1,'mullion',true);A.pane(kitchen.right,.3,z+.9,kitchen.right.length-.6,2.1,'mullion',true);
      S.beam([29.1,y+.8,z+3.8],[30,y+1.3,z+3.8],Q.creamD,.28);flats+=2;
    }
    // Rear access is high, with visible bicycle-level open space beneath it.
    for(const x of[14.4,20.2,26.2])S.box(x-.25,x+.25,10.4,10.9,.5,26.1,Q.cream,Q.creamD,Q.creamHi);
    S.box(12.4,29,10,11.5,25.8,26.2,Q.cream,Q.creamD,Q.creamHi);rail(A,[[12.4,10],[29,10],[29,11.5]],26.2,1.4,false);
    const T=concreteBox(A,26,28.2,6,9,.5,35.4);for(let i=0;i<7;i++)A.pane(T.back,.65,2.1+i*4.4,.8,1.7,'plain',true);
    S.box(25.7,28.5,5.7,9.3,35.4,36.5,Q.cream,Q.creamD,Q.creamHi);
    stairs3(A,1.8,3,9,16,.7,13.1,15);stairs3(A,1.8,3,16,9,13.1,26.4,15);
    for(const x of[16,20,24]){S.beam([x,9,.6],[x+.65,9,1.7],P.ironD,.12);S.beam([x+.65,9,1.7],[x+1.2,9,.6],P.ironD,.12);}
    return{...A.finish(),details:{selectedLinkedBlocks:2,wholeTerraceBlocks:6,storeysSelected:7,selectedFlats:flats,linkAngleDegrees:90,rearRaisedWalkway:true,projectingCornerKitchens:7,roof:'stepped-terraces-sculptural-service-tower',notWholeCampus:true}};
  }
  function falmer(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // Three-storey ranges frame an actual open court; no black painted courtyard.
    const B=A.volume(21.9,28.4,5,26.9,7.8,24,'brick'),N=A.volume(10,27.9,4,9,.5,21,'brick');
    for(const F of Object.values(B))for(let l=0;l<2;l++)for(let j=0;j<Math.max(1,Math.floor(F.length/3.8));j++)shallowArch(A,F,F.length*(j+.5)/Math.max(1,Math.floor(F.length/3.8))-1.25,9.4+l*7,2.5,4.5,.65);
    for(const F of Object.values(N)){A.windows(F,2,Math.max(1,Math.floor(F.length/4)),2.5,9,2.3,5,'mullion');for(const z of[7.7,15.6,21])band(A,F,z,.65);}
    for(const z of[7.9,15.9,23.9])for(const F of Object.values(B))band(A,F,z,.6);
    for(const [a,b,nx,ny]of[[[3.8,27.8],[28.4,27.8],0,1],[[28.4,5],[28.4,27.8],1,0]]){
      const F=face(A,a,b,nx,ny),n=Math.floor(F.length/4.4),holes=Array.from({length:n},(_,i)=>({u:F.length*(i+.5)/n-1.5,w:3,bottom:.5,spring:5.3,rise:.9}));archWall(A,F,.5,8,holes,'plaster',.72);
      F.block(0,F.length,-.1,.7,7.7,8.3,P.stoneHi,P.stoneR,P.stoneHi);
    }
    const hall=A.volume(3.8,10.3,8.8,25.2,.5,18.7,'brick');
    for(const F of[hall.left,hall.right])for(let j=0;j<4;j++)shallowArch(A,F,F.length*(j+.5)/4-1.45,7.5,2.9,8.3,1.1);
    // Shallow segmental barrel over the refectory, with copper ribs.
    for(let j=0;j<20;j++){
      const x=3.5+7.2*j/20,xx=3.5+7.2*(j+1)/20,z=18.7+3.5*Math.sin(j*Math.PI/20),zz=18.7+3.5*Math.sin((j+1)*Math.PI/20);
      S.poly([[x,8.5,z],[xx,8.5,zz],[xx,25.5,zz],[x,25.5,z]],A.mat('lead',j<10?-1:1,0));
      for(const [y,ny]of[[8.5,-1],[25.5,1]])S.poly([[x,y,18.7],[xx,y,18.7],[xx,y,zz],[x,y,z]],A.mat('brick',0,ny));
      for(const y of[8.5,12.75,17,21.25,25.5])S.beam([x,y,z+.1],[xx,y,zz+.1],P.lead,.13);
    }
    const stair=A.volume(12,17.2,3.4,8.8,.5,23,'flint');glassFace(A,stair.front,6,20,3);
    S.poly([[11.7,3.1,25],[14.6,3.1,22.9],[14.6,9.1,22.9],[11.7,9.1,25]],Q.steelD);S.poly([[14.6,3.1,22.9],[17.5,3.1,25],[17.5,9.1,25],[14.6,9.1,22.9]],Q.steel);
    const debate=A.polygon(22.5,6.5,3.6,21,24.8,8,'brick',Math.PI/8);A.cone(22.5,6.5,3.9,1.1,24.8,28.2,8,'lead');
    for(const F of debate)A.pane(F,.23,23,F.length-.46,1.2,'plain',true);
    S.flat(12,20.9,11,23,.51,P.pave);S.flat(12.9,20.1,12,13.3,.54,P.glassR);
    stairs3(A,17.5,20.8,29.7,25.3,.5,4.1,7);
    return{...A.finish(),details:{rangeStoreys:3,openCourt:true,realOpenGroundArcades:true,refectory:'shallow-segmental-barrel',northStairRoof:'V-shaped',debateRoof:'octagonal-copper-toplight',roof:'flat-ranges-barrel-and-v-roof',newEducationMechanics:false}};
  }
  function physicians(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const rear=A.volume(10.8,18.9,3.4,15.8,.5,29.3,'brick');
    for(const F of Object.values(rear))A.windows(F,3,Math.max(2,Math.floor(F.length/3)),2.6,8.2,1.4,4.6,'plain');
    for(const x of[5.4,22.4])S.box(x-.55,x+.55,16.6,18,.5,18,Q.cream,Q.creamD,Q.creamHi);
    const library=concreteBox(A,4.2,25.6,14.2,20.8,17,31.5);
    for(const F of Object.values(library))for(let j=0;j<Math.max(2,Math.floor(F.length/3.8));j++){
      const u=F.length*(j+.5)/Math.max(2,Math.floor(F.length/3.8));for(const dx of[-.54,.54])A.pane(F,u+dx-.26,19.3,.52,9.1,'plain',true);
    }
    const glass=A.volume(7.8,19.8,12.4,18.5,5.7,16.7,'steel');for(const F of Object.values(glass))glassFace(A,F,6.1,16.1,4);
    S.box(13.2,13.9,18.5,19.2,.5,17,Q.cream,Q.creamD,Q.creamHi);S.box(7.1,20.3,18.9,20.1,12,12.6,Q.cream,Q.creamD,Q.creamHi);
    const theatre=roundedPlan(19.2,29.2,20.7,29,3.2),F=planBlock(A,theatre,.5,10.8,'brick');
    for(const f of F)if(f.length>2.5)A.pane(f,.55,2,f.length-1.1,1.15,'plain',true);
    for(let j=0;j<theatre.length;j++){const k=(j+1)%theatre.length,a=theatre[j],b=theatre[k];S.poly([[...a,11],[...b,11],[24.2,24.7,14.3]],A.mat('lead',(a[0]+b[0])/2-24.2,(a[1]+b[1])/2-24.7));S.beam([...a,11],[24.2,24.7,14.3],P.lead,.12);}
    const censors=concreteBox(A,3.8,10.4,10,15.2,11,18.6);A.pane(censors.left,.65,12.1,3.6,5.1,'mullion',true);
    for(const [x0,x1]of[[11.1,13.4],[16.1,18.4]])concreteBox(A,x0,x1,7.5,10.2,29.3,39.4);
    S.box(10.8,18.7,7.2,10.5,39.4,40.5,Q.cream,Q.creamD,Q.creamHi);S.box(13.4,16.1,8.5,9,35.6,36.3,Q.cream,Q.creamD,Q.creamHi);
    stairs3(A,8.5,16.7,28.9,20.7,.5,5.6,10);
    return{...A.finish(),details:{plan:'T',libraryCantilever:true,mainSupportingPillars:2,pairedVerticalLights:true,partSunkenCurvedBrickTheatre:true,theatreRoof:'shallow-pyramid',linkedServiceTowers:2,roof:'flat-library-and-sculpted-service-towers',newMedicalMechanics:false}};
  }
  function senate(row,view){
    const A=context(row,view),{S,K,P,Q}=A,F=A.volume(3.2,28.8,10.5,23.7,.5,23.2,'stone');
    for(const [f,bays]of[[F.front,9],[F.back,9],[F.left,3],[F.right,3]]){
      for(let j=0;j<bays;j++){
        const step=f.length/bays,w=step*.6,u=step*(j+.5)-w/2,z=4.5,h=9.5;
        A.pane(f,u,z,w,h,'mullion',true);
        // Alternating triangular and curved window pediments have real depth.
        f.block(u-.35,u+w+.35,.1,.58,z+h+.5,z+h+1,P.stoneHi,P.stoneR,P.stoneHi);
        if(j%2===0){S.poly([f.point(u-.5,.61,z+h+1),f.point(u+w+.5,.61,z+h+1),f.point(u+w/2,.61,z+h+2.6)],A.mat('stone',f.nx,f.ny));}
        else for(let k=0;k<16;k++){const a=k*Math.PI/16,b=(k+1)*Math.PI/16,c=u+w/2,r=w/2+.5;S.poly([f.point(c+r*Math.cos(a),.62,z+h+1),f.point(c+r*Math.cos(b),.62,z+h+1),f.point(c+r*Math.cos(b),.62,z+h+1+1.6*Math.sin(b)),f.point(c+r*Math.cos(a),.62,z+h+1+1.6*Math.sin(a))],A.mat('stone',f.nx,f.ny));}
        A.pane(f,u+.12,17.1,w-.24,5.1,'arch',true);
      }
      for(const z of[3.2,16.9,22.5])band(A,f,z,.58);
    }
    // Four attached Corinthian columns define the central three bays. The real photograph confirms one full-height column per side.
    for(const x of[11.55,20.45]){
      K.cylinder(S,x,24.1,3.4,23.5,.38,.31,Q.cream,Q.creamD,Q.creamHi,12);
      S.box(x-.6,x+.6,23.55,24.65,3.2,3.8,P.stoneHi,P.stoneR,P.stoneHi);
      for(const z of[22.8,23.3])S.box(x-.57,x+.57,23.55,24.65,z,z+.4,P.stoneHi,P.stoneR,P.stoneHi);
      for(const dx of[-.46,.46])S.beam([x+dx,24.5,23.2],[x+dx,24.5,23.9],P.stoneD,.25);
    }
    const C=face(A,[10.6,24.8],[21.4,24.8],0,1);C.block(0,C.length,-1.1,.15,23.5,24.5,P.stoneHi,P.stoneR,P.stoneHi);
    S.poly([[10.3,24.9,24.7],[21.7,24.9,24.7],[16,24.9,29.8]],A.mat('stone',0,1));
    for(const [a,b]of[[[10.3,24.9,24.7],[16,24.9,29.8]],[[16,24.9,29.8],[21.7,24.9,24.7]]])S.beam(a,b,P.stoneHi,.45);
    F.front.panel(F.front.length/2-.95,F.front.length/2+.95,.6,13.7,P.woodD,.35);
    for(const f of Object.values(F))for(let j=0;j<Math.floor(f.length/1.35);j++){const u=f.length*(j+.5)/Math.floor(f.length/1.35);f.block(u-.15,u+.15,.02,.42,23.5,25,P.stoneHi,P.stoneR,P.stoneHi);}
    const E=face(A,[29.1,23.8],[29.1,10.4],1,0);S.poly([E.point(0,.05,23),E.point(E.length,.05,23),E.point(E.length/2,.05,28)],A.mat('stone',1,0));
    A.hip(3.2,28.8,10.5,23.7,23.3,3.4,true);
    for(const x of[10.6,16,21.4]){A.polygon(x,24.4,.6,22.6,24.2,10,'stone');A.polygon(x,24.4,.85,24.2,24.6,10,'stone');A.cone(x,24.4,.8,.45,24.6,25.9,10,'stone');}
    stairs3(A,11.7,20.3,28.9,25,.5,3.2,5);
    return{...A.finish(),details:{longElevationBays:9,endBays:3,centralBays:3,attachedCorinthianColumnsSelected:2,windowPediments:'alternating-straight-and-curved',roof:'low-hip-behind-classical-entablature',compressedElevation:true}};
  }
  function crowGable(A,F,width,z,rise){
    const {S,P}=A,n=7;
    for(let i=0;i<n;i++){
      const za=z+rise*i/n,zb=z+rise*(i+1)/n,inset=i*width/(2*n);
      F.block(inset,width-inset,-.15,.25,za,zb,P.stone,P.stoneR,P.stoneHi);
      F.block(inset-.15,width-inset+.15,-.2,.35,zb-.1,zb+.23,P.stoneHi,P.stoneR,P.stoneHi);
    }
  }
  function glasgow(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const specs=[[3.3,28.7,24,28.4,20.5,'x'],[3.3,28.7,3.6,7.8,19,'x'],[3.3,7.4,7.8,24,19.5,'y'],[24.6,28.7,7.8,24,20.5,'y']];
    for(const [x0,x1,y0,y1,h,axis]of specs){
      const F=A.volume(x0,x1,y0,y1,.6,h,'stone');
      for(const f of Object.values(F))A.windows(f,2,Math.max(1,Math.floor(f.length/3.6)),3.5,8.5,1.7,6.1,'pointed');
      A.roof(x0-.2,x1+.2,y0-.2,y1+.2,h,5,axis,'stone');
      for(const f of axis==='x'?[F.left,F.right]:[F.front,F.back])crowGable(A,f,f.length,h,5.3);
    }
    for(const [x,y]of[[5.4,5.7],[26.6,5.7],[5.4,26.2],[26.6,26.2]]){
      const B=A.volume(x-2.3,x+2.3,y-2.4,y+2.4,.5,26.7,'stone');
      for(const f of Object.values(B))A.windows(f,3,2,3.8,7,1.1,4.6,'pointed');A.hip(x-2.5,x+2.5,y-2.6,y+2.6,26.7,5.2,true);
      for(const [xx,yy]of[[x-2.3,y-2.3],[x+2.3,y+2.3]]){A.polygon(xx,yy,.78,22,29,12,'stone');A.cone(xx,yy,1.05,.03,29,34.2,12,'slate');}
    }
    // Bute Hall divides the real open courts, raised above a rib-vaulted undercroft.
    const hall=A.volume(13,18.5,7.8,24,7,25.6,'stone');
    for(const F of[hall.left,hall.right]){A.windows(F,1,4,11.2,0,2.4,10.3,'pointed');for(let u=.3;u<F.length;u+=4)F.block(u,u+.4,0,.95,7,24,P.stone,P.stoneR,P.stoneHi);}
    for(const [x,nx]of[[13,-1],[18.5,1]]){const F=face(A,[x,7.8],[x,24],nx,0),holes=Array.from({length:4},(_,j)=>({u:j*4.05+.6,w:2.8,bottom:.5,spring:4.7,rise:1.2}));archWall(A,F,.5,7,holes,'stone',.8);}
    A.roof(12.8,18.7,7.5,24.3,25.6,7.5,'y','stone');crowGable(A,hall.front,hall.front.length,25.6,7.6);
    const tower=A.volume(13.3,18.7,24.8,30,.5,43,'stone');
    for(let stage=0;stage<6;stage++)for(const F of Object.values(tower)){
      const z=2.3+stage*6.6;A.pane(F,F.length/2-.65,z,1.3,4.1,'pointed',stage<4);band(A,F,z+4.8,.4);
    }
    S.flat(13,19,24.5,30.3,43.2,P.stoneHi);
    // Open stone tracery spire: actual background gaps between ribs, no solid cone.
    const corners=[[13.65,25.15],[18.35,25.15],[18.35,29.65],[13.65,29.65]];
    for(const [x,y]of corners){S.beam([x,y,43.2],[x,y,48.8],P.stoneHi,.42);S.beam([x,y,48.8],[16,27.4,65.5],P.stoneHi,.42);}
    for(const z of[47.8,52,56.2,60.4]){
      const scale=(65.5-z)/(65.5-48.8),pts=corners.map(([x,y])=>[16+(x-16)*scale,27.4+(y-27.4)*scale,z]);
      for(let i=0;i<4;i++){S.beam(pts[i],pts[(i+1)%4],P.stoneHi,.25);const nxt=pts[(i+1)%4],mid=[(pts[i][0]+nxt[0])/2,(pts[i][1]+nxt[1])/2,z+3.3];S.beam(pts[i],mid,P.stone,.2);S.beam(mid,nxt,P.stone,.2);}
    }
    S.beam([16,27.4,65.5],[16,27.4,68],P.ironD,.14);
    return{...A.finish(),details:{courts:2,centralTowerStages:6,spire:'open-pierced-stone-ribs',cornerPavilions:4,pepperpotAngleTurretsSelected:8,centralHallUndercroft:true,roof:'slate-hips-crowstepped-gables-and-open-spire',wholeCampusCompressed:true}};
  }
  function serratedRoof(A,x0,x1,y0,y1,z,rise){
    const {S,P,Q}=A,mid=(x0+x1)/2;
    S.poly([[x0,y0,z],[mid,y0,z+rise],[mid,y1,z+rise],[x0,y1,z]],concrete(A,-1,0));S.poly([[mid,y0,z+rise],[x1,y0,z],[x1,y1,z],[mid,y1,z+rise]],concrete(A,1,0));
    for(const y of[y0,y1])for(let j=0;j<16;j++){
      const x=x0+(x1-x0)*j/16,xx=x0+(x1-x0)*(j+1)/16,za=z+rise*(1-Math.abs(2*(x-x0)/(x1-x0)-1)),zb=z+rise*(1-Math.abs(2*(xx-x0)/(x1-x0)-1));
      S.poly([[x,y,za-.35],[xx,y,zb-.35],[xx,y,zb+.25],[x,y,za+.75]],Q.creamD);
    }
    S.beam([mid,y0,z+rise],[mid,y1,z+rise],P.stoneHi,.24);
  }
  function dunelm(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const blocks=[[4.2,12.9,5,12,22,36],[19.2,27.4,3.7,10.5,25,41],[3.6,13.1,13.1,20,10,24],[18.7,28.4,12,21.3,14,29.2],[8.5,24.5,22,28.4,.5,13.8]];
    for(let i=0;i<blocks.length;i++){
      const [x0,x1,y0,y1,z0,z1]=blocks[i];
      // Solid lower substructure supports each genuinely different upper box.
      if(z0>1)concreteBox(A,x0+.7,x1-.7,y0+.6,y1-.6,.5,z0);
      const F=concreteBox(A,x0,x1,y0,y1,z0,z1);
      for(const f of Object.values(F)){
        const n=Math.max(2,Math.floor(f.length/2.6));
        for(let j=0;j<n;j++){const w=(j%3===0?.85:1.5),u=f.length*(j+.5)/n-w/2;A.pane(f,u,z1-5.4,w,3.6,'plain',true);f.block(u-.25,u-.06,.12,.7,z1-6,z1-.4,Q.cream,Q.creamD,Q.creamHi);}
      }
      serratedRoof(A,x0-.25,x1+.25,y0-.25,y1+.25,z1, i%2?2.5:0);
    }
    // Projecting ballroom is intentionally mostly blind, not another window box.
    S.wall([9,28.6],[24,28.6],.5,10.9,concrete(A,0,1));
    const cafe=concreteBox(A,17.5,28.5,19.5,22.1,14.2,17.7);glassFace(A,cafe.front,14.7,17.1,6);rail(A,[[18,22.5],[28.7,22.5],[28.7,25]],14.3,1.7,false);
    stairs3(A,14.3,17,29.6,4.2,.5,33,34);
    for(const [x,y,z]of[[4.2,5,36],[27.4,3.7,41],[3.6,13.1,24]]){S.beam([x,y,z],[x,y,.6],P.ironD,.1);S.beam([x,y,z],[x-1.1,y,z-.5],Q.creamD,.23);}
    const boat=concreteBox(A,3.2,8.2,25,29.3,.5,6.7);boat.front.panel(.65,boat.front.length-.65,.8,5.8,P.woodD,.13);for(let j=0;j<4;j++)boat.front.panel(.9+j*.85,1+j*.85,1,5.5,P.woodHi,.23);
    S.box(2.4,8.7,29.5,30.7,.5,1,P.stone,P.stoneR,P.stoneHi);
    return{...A.finish(),details:{asymmetricTerracedBoxes:5,siteLevels:'seven original levels compressed into descending group',centralStraightSpineStair:true,mostlyBlindProjectingBallroom:true,smallBoathouseAndLanding:true,roof:'flat-and-east-west-sloping-with-serrated-slab-eaves',newRiverOrEducationMechanics:false}};
  }
  function yorkhall(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const outer=[[4.8,9.1],[15.5,3.2],[27.1,9.1],[27.1,25],[15.5,30],[4.8,25]],cx=15.8,cy=16.4;
    const low=outer.map(([x,y])=>[cx+(x-cx)*.66,cy+(y-cy)*.64]);
    const ground=planBlock(A,low,.6,10,'brick');for(const F of ground)glassFace(A,F,1.5,9.2,Math.max(2,Math.floor(F.length/2.6)));
    // Concrete raking supports are exposed below the overhanging hall.
    for(let i=0;i<outer.length;i++){
      const j=(i+1)%outer.length,a=outer[i],b=outer[j],p=low[i],q=low[j];
      S.poly([[...p,8.7],[...q,8.7],[...b,14.7],[...a,14.7]],concrete(A,(a[0]+b[0])/2-cx,(a[1]+b[1])/2-cy));
      const ma=[(p[0]+q[0])/2,(p[1]+q[1])/2,1],mb=[(a[0]+b[0])/2,(a[1]+b[1])/2,14.5];S.beam(ma,mb,Q.creamD,.8);
    }
    const upper=planBlock(A,outer,14.7,23.5,'plaster');
    for(const F of upper){
      S.wall(F.point(0,0,0),F.point(F.length,0,0),14.7,21.2,concrete(A,F.nx,F.ny));
      glassFace(A,F,21.3,23.1,Math.max(2,Math.floor(F.length/2.6)));band(A,F,20.6,.44);band(A,F,23.3,.7);
    }
    const balcony=outer.map(([x,y])=>[cx+(x-cx)*1.055,cy+(y-cy)*1.055]);
    for(let i=0;i<outer.length;i++){
      const j=(i+1)%outer.length;S.poly([[...outer[i],14.65],[...outer[j],14.65],[...balcony[j],14.65],[...balcony[i],14.65]],P.stoneHi);
      S.wall(balcony[i],balcony[j],14.65,16,Q.creamHi);
    }
    for(let i=0;i<outer.length;i++){
      const j=(i+1)%outer.length,a=outer[i],b=outer[j],nx=(a[0]+b[0])/2-cx,ny=(a[1]+b[1])/2-cy;
      S.poly([[...a,24],[...b,24],[cx,cy,29.8]],A.mat('zinc',nx,ny));
      S.beam([...a,24.15],[cx,cy,29.95],P.lead,.21);
      for(let k=1;k<5;k++){const t=k/5;S.beam([a[0]+(cx-a[0])*t,a[1]+(cy-a[1])*t,24+5.8*t+.05],[b[0]+(cx-b[0])*t,b[1]+(cy-b[1])*t,24+5.8*t+.05],P.lead,.095);}
    }
    // The apex is the visible open tubular support, as in the source photo.
    const bottom=[[13.5,14.1],[18.1,14.1],[18.1,18.7],[13.5,18.7]],top=[[15.3,15.9],[16.3,15.9],[16.3,16.9],[15.3,16.9]];
    for(let i=0;i<4;i++){S.beam([...bottom[i],29.3],[...top[i],40.5],Q.steelD,.24);S.beam([...top[i],40.5],[...top[(i+1)%4],40.5],Q.steelD,.21);}
    const lift=[[25.2,13.2],[28.5,14.2],[28.5,18],[25.2,18.8]];planBlock(A,lift,17,30.5,'plaster');
    stairs3(A,27.4,29.7,5.7,13,.6,14.8,17);stairs3(A,27.4,29.7,29.4,21,.6,14.8,17);
    S.box(3.2,28.6,4.6,29.7,.42,.7,Q.red,Q.redD,P.stoneHi);
    return{...A.finish(),details:{plan:'irregular-hexagon-straight-east-side',cantileveredLakeSides:true,glazedSmallerGroundFloor:true,externalStairFlights:2,roof:'shallow-six-facet-aluminium-tent-with-open-tubular-apex',apexFromRealSourcePhotograph:true,newLakeTerrain:false}};
  }
  function halfShaft(A,cx,y,r,z0,z1){
    const points=[[cx-r,y],[cx+r,y],...Array.from({length:15},(_,i)=>{const t=(i+1)*Math.PI/16;return[cx+r*Math.cos(t),y+r*Math.sin(t)];})],F=planBlock(A,points,z0,z1,'plaster');
    for(const f of F)A.S.wall(f.point(0,0,0),f.point(f.length,0,0),z0,z1,concrete(A,f.nx,f.ny));
    return F;
  }
  function rogerstevens(row,view){
    const A=context(row,view),{S,P,Q}=A;const heights=[23,28,33,38],floors=[5.3,8.1,10.8,12.4];
    for(let i=0;i<4;i++){
      const x0=3.9+i*6,x1=x0+5.7,z0=floors[i],z1=heights[i],F=concreteBox(A,x0,x1,12.1,25.4,z0,z1);
      for(const [x,y]of[[x0+.7,13.1],[x1-.7,13.1],[x0+.7,24.4],[x1-.7,24.4]])S.box(x-.28,x+.28,y-.28,y+.28,.5,z0,Q.cream,Q.creamD,Q.creamHi);
      for(const f of[F.left,F.right]){
        for(let l=0;l<2;l++)A.pane(f,f.length*.24,z0+2+l*6,1.05,3.6,'plain',true);
      }
      if(i<2){const g=A.volume(x0+.7,x1-.7,13.1,22.9,.5,z0-.1,'steel');glassFace(A,g.front,1,z0-.5,3);}
      // Horizontal seams belong to the actual cast panels; west wall stays solid.
      for(let z=z0+3;z<z1;z+=3.6)F.front.panel(.15,F.front.length-.15,z,z+.09,P.stoneR,.12);
      S.poly([[x0-.2,11.9,z1-1.8],[x1+.2,11.9,z1],[x1+.2,25.6,z1],[x0-.2,25.6,z1-1.8]],concrete(A,-1,0));
      if(i<3){const vent=halfShaft(A,x1+.17,25.55,1.12,.5,z1+3);for(const f of vent)if(f.length>.4)for(let z=z1-.8;z<z1+2.5;z+=.8)f.panel(.04,f.length-.04,z,z+.23,P.ironD,.08);}
    }
    // The east side has a separately expressed blind hall and two glazed stairs.
    const mid=concreteBox(A,12.3,20.6,5.5,12.2,13.6,33.1);mid.back.panel(.3,mid.back.length-.3,18.2,18.3,P.stoneR,.1);
    const cafe=A.volume(12.7,20.1,6.2,10.9,.5,12.8,'steel');for(const f of Object.values(cafe))glassFace(A,f,1.1,12.3,5);
    for(const x0 of[9.6,21]){
      const F=A.volume(x0,x0+2.3,5,13,.5,32.3,'steel');
      for(const f of Object.values(F)){glassFace(A,f,1.1,31.6,Math.max(2,Math.floor(f.length/.9)));for(let z=6;z<31;z+=5.6)f.panel(.15,f.length-.15,z,z+.25,P.frame,.45);}
      S.flat(x0-.1,x0+2.4,4.9,13.1,32.5,Q.steelD);
    }
    // Source-recorded Chattaway wall sculpture, a static metal relief only.
    const f=mid.back,c=f.length*.5;for(const [a,b]of[[[c,24],[c-.6,27]],[[c-.6,27],[c-1.9,28.4]],[[c-.6,27],[c+1,28.5]],[[c,24],[c-1.4,22.1]],[[c,24],[c+1.3,21.8]]])S.beam(f.point(a[0],.35,a[1]),f.point(b[0],.35,b[1]),Q.steelD,.32);
    S.beam(f.point(c-.6,.35,27),f.point(c-.9,.35,29),Q.steelD,.38);
    // High Red Route walkway and lower open ramp pass through the real voids.
    S.box(1.1,9.6,9.3,10.7,17.1,17.7,Q.cream,Q.creamD,Q.creamHi);rail(A,[[1.1,9.3],[9.6,9.3]],17.7,1.3,false);rail(A,[[1.1,10.7],[9.6,10.7]],17.7,1.3,false);
    for(const x of[2.1,6.1])S.box(x-.23,x+.23,9.7,10.3,.5,17.1,Q.cream,Q.creamD,Q.creamHi);
    S.poly([[22.7,2.7,.6],[25.5,2.7,.6],[25.5,17,11.7],[22.7,17,11.7]],P.pave);S.beam([22.7,2.7,.6],[22.7,17,11.7],P.stoneR,.35);
    // Half-round landings expose the external staircase between west sections.
    for(let l=0;l<5;l++){
      const z=7.6+l*4.5;halfShaft(A,16,25.2,1.8,z,z+.3);rail(A,Array.from({length:13},(_,i)=>[16+1.8*Math.cos(i*Math.PI/12),25.2+1.8*Math.sin(i*Math.PI/12)]),z+.3,1.4,false);
      if(l<4)stairs3(A,14.8,16.9,l%2?26.8:25.4,l%2?25.4:26.8,z+.3,z+4.8,8);
    }
    S.box(5.7,27.7,1.4,4.4,.45,.8,P.stone,P.stoneR,P.stoneHi);S.flat(6,27.4,1.7,4.1,.82,P.glassR);
    return{...A.finish(),details:{westSteppedSections:4,semiCircularVentilationShafts:3,externalStair:'semi-circular-projecting-landings',eastGlazedStairBlocks:2,pilotisAndThroughRamp:true,highWalkway:true,staticChattawayRelief:true,roof:'four-different-levels-with-canted-top',sourcePhotoEastFacadeObserved:true,newEducationMechanics:false}};
  }
  function stcatherines(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // Keep the modern Jacobsen site distinct from the college's old premises.
    // Three-storey residential bars: brick lower floor, two continuous glazed floors.
    for(const [x0,x1,y0,y1]of[[3.2,7.5,4.1,28.1],[24.8,29.1,4.1,21.4]]){
      const G=A.volume(x0,x1,y0,y1,.5,18.8,'yellowbrick');
      for(const F of Object.values(G)){
        const bays=Math.max(2,Math.floor(F.length/2.5));
        for(let j=0;j<bays;j++)A.pane(F,F.length*(j+.5)/bays-.48,2.1,.96,3.5,'plain',true);
        for(const [lo,hi]of[[6.4,12.2],[12.6,18.4]])glassFace(A,F,lo,hi,bays*2);
        for(const z of[6.1,12.3,18.6])F.block(0,F.length,.08,.32,z,z+.25,Q.cream,Q.creamD,Q.creamHi);
      }
      S.flat(x0-.15,x1+.15,y0-.15,y1+.15,19.1,P.stoneHi);
    }
    const hall=A.volume(8.3,22.1,3.7,9.4,.5,20.6,'yellowbrick');
    for(const F of[hall.left,hall.right])glassFace(A,F,2.1,19.6,3);
    // Brick hall walls and widely separated full-height lights are not Gothic.
    for(const F of[hall.front,hall.back])for(let j=0;j<4;j++)A.pane(F,F.length*(j+.5)/4-.42,2.2,.84,17.1,'plain',true);
    S.flat(8.1,22.3,3.5,9.6,20.9,P.stoneHi);
    const common=A.volume(20.7,25.1,9.5,13.2,.5,7.8,'yellowbrick');glassFace(A,common.front,1,7.3,5);glassFace(A,common.right,1,7.3,4);
    const recessed=A.volume(9.8,18.8,23.3,27.5,.5,6.7,'yellowbrick');for(const F of Object.values(recessed))glassFace(A,F,1.1,6.1,5);
    const library=A.volume(8.8,19.8,22.4,28.4,6.7,19.2,'steel');
    for(const F of Object.values(library)){
      const n=Math.max(3,Math.floor(F.length/1.6));
      F.panel(0,F.length,6.7,19.2,Q.oakD,.13);
      for(let j=0;j<n;j++){const u=F.length*j/n,w=F.length/n;A.pane(F,u+.16,7.2,w*.48,11.4,'plain',true);F.block(u+w*.71,u+w*.86,.12,.65,6.9,19.1,Q.steel,Q.oakD,Q.steelHi);}
    }
    S.flat(8.6,20,22.2,28.6,19.5,P.lead);
    const theatre=A.volume(20.7,25.1,23,28.8,.5,13.5,'yellowbrick');
    for(const F of Object.values(theatre)){
      glassFace(A,F,6.9,12.9,Math.max(2,Math.floor(F.length/1.4)));
      for(let u=.2;u<F.length;u+=.85)F.block(u,u+.07,.12,.9,6.5,13.2,Q.steelD,Q.steelD,Q.steel);
      S.beam(F.point(0,.9,13.2),F.point(F.length,.9,13.2),P.frame,.15);
    }
    S.flat(20.5,25.3,22.8,29,13.8,P.lead);
    // Four glass covered walks are independent roofs carried on brick piers.
    for(const [x0,x1,y0,y1]of[[7.5,11.7,10.3,11.8],[18.6,24.8,10.3,11.8],[7.5,11.7,20.3,21.8],[18.6,24.8,20.3,21.8]]){
      for(const x of[x0+.22,x1-.22])for(const y of[y0+.2,y1-.2])A.volume(x-.18,x+.18,y-.18,y+.18,.5,4.4,'yellowbrick');
      S.flat(x0,x1,y0,y1,4.5,P.glassR);for(const y of[y0,y1])S.beam([x0,y,4.6],[x1,y,4.6],P.frame,.17);
      for(let x=x0;x<x1;x+=1.3)S.beam([x,y0,4.6],[x,y1,4.6],P.frame,.12);
    }
    // Exact listing identity: two open concrete slabs joined at the top,
    // with vertical bronze bell louvres between them; the lower void stays open.
    for(const [x0,x1]of[[26.4,26.9],[29,29.5]])concreteBox(A,x0,x1,24.1,26.8,.5,36.3);
    S.box(26.4,29.5,24.1,26.8,35.8,36.7,Q.cream,Q.creamD,Q.creamHi);
    for(const y of[24.2,26.7])for(let j=0;j<5;j++)S.box(27.05+j*.36,27.16+j*.36,y-.12,y+.12,27,34.8,Q.steel,Q.oakD,Q.steelHi);
    S.flat(8.6,23.6,13.2,18.8,.51,P.pave);S.flat(10.4,21.7,14.3,17.8,.52,P.green);
    for(const x of[9.2,13.8,18.4]){S.box(x,x+.3,28.9,30,.5,2.6,P.stone,P.stoneR,P.stoneHi);S.box(x,x+3.1,29.4,30,1.1,1.45,P.woodHi,P.woodR,P.woodHi);}
    return{...A.finish(),details:{site:'Jacobsen 1961-66; not old St Catz premises',residentialBars:2,residentialStoreys:3,glazedUpperFloors:2,coveredGlassWalksSelected:4,bellTowerConcreteSlabs:2,bellLouvres:'vertical-bronze',library:'projecting-bronze-panel-gallery-over-recessed-ground',roof:'flat-campus-with-open-twin-slab-bell-tower',compressedCollege:true}};
  }

  const AUTHORS=Object.freeze([leicester,norfolk,falmer,yorkhall,stcatherines,physicians,senate,glasgow,dunelm,rogerstevens]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave033 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture033=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
