/* GPT-037 / wave09. Original deterministic civic and justice architecture.
 * Original reference photographs inspected before each model; shared rasterizer unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "belfast",
    "nm": "貝爾法斯特市政廳",
    "en": "Belfast City Hall",
    "shape": "quadrangular-portland-baroque-court-central-ribbed-copper-dome-four-corner-pavilions",
    "note": "石造院落翼、中央銅穹頂與四角塔亭；壓縮歷史主體，僅為原生地標外觀。",
    "url": "https://www.belfastcity.gov.uk/things-to-do/city-hall/history-of-belfast-city-hall"
  },
  {
    "id": "manchester",
    "nm": "曼徹斯特市政廳",
    "en": "Manchester Town Hall",
    "shape": "triangular-gothic-court-steep-slate-ranges-central-tall-clock-tower",
    "note": "Waterhouse三角基地、院落翼與高鐘塔；依歷史外觀，不表示修復或開放現況。",
    "url": "https://www.manchester.gov.uk/the-council-and-democracy/town-hall-complex/town-hall/the-building"
  },
  {
    "id": "leeds",
    "nm": "里茲市民會堂",
    "en": "Leeds Civic Hall",
    "shape": "v-plan-civic-hall-corinthian-pediment-portico-two-wren-towers-golden-owl-finials",
    "note": "V形回翼、巨柱山花門廊及雙塔梟飾；是Civic Hall，非Leeds Town Hall。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1255781"
  },
  {
    "id": "newcastle",
    "nm": "紐卡索市政中心",
    "en": "Newcastle Civic Centre",
    "shape": "twelve-storey-office-slab-west-carillon-tower-low-court-wings-elliptical-chamber-on-columns",
    "note": "辦公板樓、鐘樂塔、低翼與架柱橢圓議事廳；選取建築組主要量體，不新增行政服務。",
    "url": "https://sitelines.newcastle.gov.uk/SMR/9059"
  },
  {
    "id": "london",
    "nm": "倫敦南岸市政廳（2002）",
    "en": "London City Hall South Bank 2002",
    "shape": "south-leaning-modified-sphere-stepped-elliptical-floorplates-triangulated-glass",
    "note": "向南傾移的玻璃卵形量體與退台樓板；歷史南岸建築，非現任GLA總部。",
    "url": "https://www.fosterandpartners.com/projects/city-hall"
  },
  {
    "id": "holyrood",
    "nm": "蘇格蘭議會大樓",
    "en": "Scottish Parliament Holyrood",
    "shape": "linked-organic-committee-towers-curved-roof-tops-irregular-slate-panels-and-boat-shaped-courtyard-rooflights",
    "note": "委員會塔、弧形塔頂、斜折飾板與庭院玻璃天窗；濃縮已核特色建築組，非完整校址測繪。",
    "url": "https://www.mirallestagliabue.com/project/scottish-parliament-building/"
  },
  {
    "id": "thaxted",
    "nm": "薩克斯特德行會廳",
    "en": "Thaxted Guildhall",
    "shape": "open-market-posts-two-jettied-timber-storeys-double-range-hipped-red-tile-roofs",
    "note": "開放木柱底層、兩層懸挑木骨及雙列四坡瓦頂；不套用其他市場亭或泛型木屋。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1112905"
  },
  {
    "id": "abingdon",
    "nm": "阿賓登郡會堂",
    "en": "Abingdon County Hall",
    "shape": "four-by-two-open-stone-arcade-giant-pilasters-round-hall-windows-dormers-cupola-south-stair-tower",
    "note": "四乘二底層拱廊、巨壁柱與圓頭高窗、老虎窗／頂亭及側樓梯塔；歷史郡會堂外觀。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1199601"
  },
  {
    "id": "middlesex",
    "nm": "米德塞克斯行會廳",
    "en": "Middlesex Guildhall",
    "shape": "portland-flemish-burgundian-gothic-front-carved-entry-friezes-oriel-parapet-dormers",
    "note": "Portland石立面、入口雕帶、凸窗與老虎窗；今最高法院建築外觀，不新增司法玩法。",
    "url": "https://supremecourt.uk/about-the-building/architecture"
  },
  {
    "id": "rcj",
    "nm": "皇家司法院",
    "en": "Royal Courts of Justice",
    "shape": "strand-gothic-great-hall-rose-window-pointed-portal-side-clock-tower-steep-roof-ranges",
    "note": "Strand中央大廳玫瑰窗、尖拱門與側鐘塔；依Street歷史主體轉譯，不混入後期擴建。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1264258"
  }
].map((q,i)=>Object.freeze({...q,v:480+4*i})));
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
    if(!root.__wave037GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave037GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave037:1});
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
    const panel=(u0,u1,a,b)=>{if(u1<=u0||b<=a)return;for(const d of[0,-thickness])S.poly([F.point(u0,d,a),F.point(u1,d,a),F.point(u1,d,b),F.point(u0,d,b)],d?P.stoneD:A.mat(kind,F.nx,F.ny));};
    for(const h of holes.toSorted((a,b)=>a.u-b.u)){
      const {u,w,bottom,spring,rise}=h;panel(cursor,u,z0,z1);panel(u,u+w,z0,bottom);
      for(let j=0;j<16;j++){
        const at=t=>[u+w*t,spring+rise*Math.sqrt(Math.max(0,1-(2*t-1)**2))],p=at(j/16),q=at((j+1)/16);
        for(const d of[0,-thickness])S.poly([F.point(p[0],d,p[1]),F.point(q[0],d,q[1]),F.point(q[0],d,z1),F.point(p[0],d,z1)],d?P.stoneD:A.mat(kind,F.nx,F.ny));
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

/* WAVE037 AUTHORED MODELS */
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
  // All helpers below are private to GPT-037 and operate in world coordinates.
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

  // GPT-037 helpers are private world-space solids. No bitmap or screen decal.
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

/* WAVE037 NEW AUTHORED MODELS */

  // GPT-037 private four-centred Tudor head: four tangent circular arcs.
  // Two small shoulder circles meet the two large crown circles at 60 degrees.
  function tudorHead(u,w,spring){
    const a=w/2,r=a*.35,h=w*.30,t=Math.PI/3,cx=u+a;
    const p=[-a+r*(1-Math.cos(t)),r*Math.sin(t)],v=[-p[0],h-p[1]],n=[-Math.cos(t),Math.sin(t)];
    const R=-(v[0]*v[0]+v[1]*v[1])/(2*(v[0]*n[0]+v[1]*n[1])),c=[p[0]-R*n[0],p[1]-R*n[1]];
    const left=[];
    for(let j=0;j<=8;j++){const q=t*j/8;left.push([cx-a+r*(1-Math.cos(q)),spring+r*Math.sin(q)]);}
    const start=Math.atan2(p[1]-c[1],p[0]-c[0]),end=Math.atan2(h-c[1],-c[0]);
    for(let j=1;j<=10;j++){const q=start+(end-start)*j/10;left.push([cx+c[0]+R*Math.cos(q),spring+c[1]+R*Math.sin(q)]);}
    return [...left,...left.slice(0,-1).reverse().map(p=>[2*cx-p[0],p[1]])];
  }
  function tudorWall(A,F,z0,z1,holes,kind='plaster',thickness=.65){
    const {S,P}=A,paint=(u0,u1,a,b)=>{if(u1<=u0||b<=a)return;for(const d of[0,-thickness])S.poly([F.point(u0,d,a),F.point(u1,d,a),F.point(u1,d,b),F.point(u0,d,b)],A.mat(kind,F.nx*(d?-1:1),F.ny*(d?-1:1)));};
    let cursor=0;
    for(const h of holes.toSorted((a,b)=>a.u-b.u)){
      paint(cursor,h.u,z0,z1);paint(h.u,h.u+h.w,z0,h.bottom);
      const pts=tudorHead(h.u,h.w,h.spring);
      for(let j=0;j<pts.length-1;j++){
        const p=pts[j],q=pts[j+1];
        for(const d of[0,-thickness])S.poly([F.point(p[0],d,p[1]),F.point(q[0],d,q[1]),F.point(q[0],d,z1),F.point(p[0],d,z1)],A.mat(kind,F.nx*(d?-1:1),F.ny*(d?-1:1)));
        S.poly([F.point(p[0],0,p[1]),F.point(q[0],0,q[1]),F.point(q[0],-thickness,q[1]),F.point(p[0],-thickness,p[1])],P.stoneD);
        S.poly([F.point(p[0],.1,p[1]),F.point(q[0],.1,q[1]),F.point(q[0],.1,q[1]+.55),F.point(p[0],.1,p[1]+.55)],P.stoneHi);
      }
      for(const u of[h.u,h.u+h.w])S.poly([F.point(u,0,h.bottom),F.point(u,0,h.spring),F.point(u,-thickness,h.spring),F.point(u,-thickness,h.bottom)],P.stoneD);
      cursor=h.u+h.w;
    }
    paint(cursor,F.length,z0,z1);
  }
  function column(A,x,y,z0,z1,r,ionic=false){
    const {S,K,P}=A;
    S.box(x-r*1.6,x+r*1.6,y-r*1.6,y+r*1.6,z0,z0+.65,P.stone,P.stoneR,P.stoneHi);
    K.cylinder(S,x,y,z0+.65,z1-.8,r,r*.86,P.stoneHi,P.stoneR,P.stoneHi,12);
    S.box(x-r*1.55,x+r*1.55,y-r*1.55,y+r*1.55,z1-.8,z1,P.stoneHi,P.stoneR,P.stoneHi);
    if(ionic)for(const dx of[-r*1.2,r*1.2]){
      const F=face(A,[x+dx-r*.5,y+r*1.5],[x+dx+r*.5,y+r*1.5],0,1);
      A.K.ring(S,F,r*.5,z1-.45,r*.48,r*.48,r*.2,.12,P.stoneD,12);
    }
  }
  function pediment(A,x0,x1,y,z,h,depth=1.1){
    const {S,P}=A,cx=(x0+x1)/2;
    for(const [yy,ny]of[[y,1],[y-depth,-1]])S.poly([[x0,yy,z],[x1,yy,z],[cx,yy,z+h]],A.mat('stone',0,ny));
    S.poly([[x0,y,z],[cx,y,z+h],[cx,y-depth,z+h],[x0,y-depth,z]],P.stoneHi);
    S.poly([[cx,y,z+h],[x1,y,z],[x1,y-depth,z],[cx,y-depth,z+h]],P.stoneR);
    S.beam([x0,y+.08,z],[cx,y+.08,z+h],P.stoneHi,.45);S.beam([cx,y+.08,z+h],[x1,y+.08,z],P.stoneHi,.45);
    S.box(x0-.3,x1+.3,y-depth,y+.35,z-.75,z,P.stoneHi,P.stoneR,P.stoneHi);
  }
  function timberFace(A,F,z0,z1,step=1.3,diagonal=false){
    const {P}=A;
    for(let u=.2;u<F.length;u+=step)F.panel(u,u+.2,z0,z1,P.woodD,.34);
    for(const z of[z0,z1,(z0+z1)/2])F.panel(0,F.length,z,z+.36,P.woodD,.36);
    if(diagonal)for(let u=.3;u+step*2<F.length;u+=step*3)A.S.beam(F.point(u,.39,z0+.4),F.point(u+step*2,.39,z1-.4),P.woodD,.22);
  }
  function ramp(A,x0,x1,y0,y1,z0,z1){
    const {S,P}=A;
    S.poly([[x0,y0,z0],[x1,y0,z0],[x1,y1,z1],[x0,y1,z1]],P.stoneHi);
    for(const x of[x0,x1]){
      S.poly([[x,y0,.5],[x,y1,.5],[x,y1,z1],[x,y0,z0]],P.stoneR);
      S.beam([x,y0,z0+1.7],[x,y1,z1+1.7],P.ironD,.16);
      for(let j=0;j<=5;j++){const t=j/5,y=y0+(y1-y0)*t,z=z0+(z1-z0)*t;S.beam([x,y,z],[x,y,z+1.7],P.ironD,.13);}
    }
  }
  // Private world-space solids. These do not alter shared art or raster rules.
  function ridgeRange(A,a,b,width,z,rise,kind='stone'){
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len,w=width/2;
    const pts=[[a[0]+nx*w,a[1]+ny*w],[b[0]+nx*w,b[1]+ny*w],[b[0]-nx*w,b[1]-ny*w],[a[0]-nx*w,a[1]-ny*w]],fs=planBlock(A,pts,.7,z,kind);
    for(const [i,j]of[[0,1],[3,2]])A.S.poly([[...pts[i],z],[...pts[j],z],[...b,z+rise],[...a,z+rise]],A.K.slate(A.dark(i===0?nx:-nx,i===0?ny:-ny)));
    for(const [p,q,c]of[[pts[0],pts[3],a],[pts[1],pts[2],b]])A.S.poly([[...p,z],[...q,z],[...c,z+rise]],A.mat(kind,nx,ny));
    A.S.beam([...a,z+rise],[...b,z+rise],A.P.lead,.3);return fs;
  }
  function copperDome(A,x,y,z,r,h){
    const profile=Array.from({length:13},(_,j)=>[z+h*Math.sin(j*Math.PI/24),r*Math.cos(j*Math.PI/24)]),n=28;
    for(let k=0;k<profile.length-1;k++)for(let j=0;j<n;j++){
      const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,m=(a+b)/2,[za,ra]=profile[k],[zb,rb]=profile[k+1];
      A.S.poly([[x+ra*Math.cos(a),y+ra*Math.sin(a),za],[x+ra*Math.cos(b),y+ra*Math.sin(b),za],[x+rb*Math.cos(b),y+rb*Math.sin(b),zb],[x+rb*Math.cos(a),y+rb*Math.sin(a),zb]],A.dark(Math.cos(m),Math.sin(m))?A.P.copperR:A.P.copper);
    }
    for(let j=0;j<12;j++)for(let k=0;k<profile.length-1;k++){
      const t=j*Math.PI/6,[za,ra]=profile[k],[zb,rb]=profile[k+1];A.S.beam([x+ra*Math.cos(t),y+ra*Math.sin(t),za],[x+rb*Math.cos(t),y+rb*Math.sin(t),zb],A.P.copperHi,.13);
    }
  }
  function belfast(row,view){
    const A=context(row,view),{S,P}=A;
    // Text establishes the quadrangle/dome/corner pavilions; the inspected
    // close photograph corroborates the portico and Baroque stone detailing.
    for(const [x0,x1,y0,y1]of[[3.5,28.5,3.5,8.8],[3.5,8.8,8.8,26.5],[23.2,28.5,8.8,26.5],[8.8,23.2,21.8,27.3]]){
      const f=A.volume(x0,x1,y0,y1,.6,29,'stone');
      for(const F of Object.values(f)){
        A.windows(F,2,Math.max(2,Math.round(F.length/3.8)),5,12,2.2,7,'arch');band(A,F,15.2,.35);band(A,F,28.6,.7);
      }
      A.hip(x0-.3,x1+.3,y0-.3,y1+.3,29,5,(x1-x0)>(y1-y0));
      A.parapet(x0-.15,x1+.15,y0-.15,y1+.15,29,false);
    }
    const drum=A.polygon(16,20.7,5.4,29.5,45,16,'stone');
    for(const F of drum)if(F.length>1.8)A.pane(F,.45,35,F.length-.9,7.2,'arch',true);
    copperDome(A,16,20.7,45,6.1,13.5);
    A.polygon(16,20.7,.9,58.5,62.5,8,'stone');copperDome(A,16,20.7,62.5,1.2,2.8);S.beam([16,20.7,65],[16,20.7,69],P.ironD,.16);
    for(const [x,y]of[[6.3,6.3],[25.7,6.3],[6.3,24],[25.7,24]]){
      const p=A.volume(x-2.6,x+2.6,y-2.6,y+2.6,.6,33,'stone');
      for(const F of Object.values(p))A.pane(F,1.3,20,2.6,8,'arch',true);
      A.polygon(x,y,2.45,33,36.5,12,'stone');copperDome(A,x,y,36.5,2.9,4.5);
      S.beam([x,y,41],[x,y,43.2],P.stoneHi,.24);
    }
    for(const x of[11.4,14.4,17.6,20.6])column(A,x,28.7,1,22,.5,true);
    S.box(10.4,21.6,26.7,29.8,22,23.5,P.stoneHi,P.stoneR,P.stoneHi);pediment(A,10,22,29.9,23.5,6.3,3.4);
    A.steps(11,21,30.9,28.9,1.1,3);
    return{...A.finish(),details:{quadrangularCourt:true,centralRibbedCopperDome:true,cornerPavilions:4,baroquePortico:true,wholeBuildingTextDerived:true,photoScope:'portico-and-drum-detail; no claim of a complete exterior photograph'}};
  }
  function manchester(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [a,b]of[[[5,26],[16,5]],[[16,5],[27,26]],[[27,26],[5,26]]]){
      const fs=ridgeRange(A,a,b,4.8,34,10,'stone');
      for(const F of fs){A.windows(F,3,Math.max(2,Math.round(F.length/3.9)),4,10,2.3,6.6,'pointed');for(const z of[13,24,33.5])band(A,F,z,.25);}
    }
    for(const [x,y]of[[5,26],[16,5],[27,26]]){
      const fs=A.polygon(x,y,2.2,.7,41,8,'stone');for(const F of fs)if(F.length>1.5)A.pane(F,.3,30,F.length-.6,7,'pointed',true);
      A.cone(x,y,2.9,.12,41,54,12,'slate');
    }
    const tower=A.volume(13.4,18.6,23.5,28.7,.7,70,'stone');
    for(const F of Object.values(tower)){
      A.windows(F,2,2,21,17,1.6,11,'pointed');roundWindow(A,F,F.length/2,63.8,1.9,false);
      const c=F.length/2;S.beam(F.point(c,.4,63.8),F.point(c,.4,65),P.ink,.16);S.beam(F.point(c,.42,63.8),F.point(c+1.3,.42,63.8),P.ink,.16);
      for(const z of[20,53,59.5,69.4])band(A,F,z,.55);
    }
    A.pane(tower.front,.9,1.8,3.4,14,'pointed',false);
    A.polygon(16,26.1,3,70,75,8,'stone');A.cone(16,26.1,3.4,.14,75,94,8,'slate');S.beam([16,26.1,94],[16,26.1,97],P.ironD,.15);
    for(const x of[13.5,18.5])for(const y of[23.6,28.6]){A.volume(x-.25,x+.25,y-.25,y+.25,68,72,'stone');A.cone(x,y,.55,0,72,77,8,'stone');}
    return{...A.finish(),details:{triangularPlan:true,openInternalCourt:true,steepSlateRanges:true,centralClockTower:true,gothicWindows:true,historicalExterior:true,photoScope:'rear-range-and-secondary-tower; main clock tower and triangular plan corroborated by council description'}};
  }
  function leeds(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [a,b]of[[[7,24],[11.5,5]],[[25,24],[20.5,5]]]){
      const fs=ridgeRange(A,a,b,4.7,36,3.2,'stone');for(const F of fs)A.windows(F,5,Math.max(2,Math.round(F.length/3.4)),3,6.5,1.7,4.6,'rect');
    }
    const hall=A.volume(5.2,26.8,21,27,.6,35.5,'stone');
    for(const F of Object.values(hall)){A.windows(F,2,Math.max(3,Math.round(F.length/3.3)),4,15,2,10,'rect');band(A,F,15.5,.45);band(A,F,34.5,.75);}
    A.hip(5,27,20.8,27.2,35.5,4.5,true);
    for(const x of[10.2,14.1,17.9,21.8])column(A,x,28.5,1.2,32,.57,true);
    S.box(9.2,22.8,27,29.4,31.8,34.5,P.stoneHi,P.stoneR,P.stoneHi);pediment(A,9,23,29.5,34.5,6,2.7);A.steps(9,23,31,28.9,1.2,3);
    for(const x of[6.8,25.2]){
      const base=A.volume(x-1.7,x+1.7,23,26.4,35.5,42.5,'stone');pediment(A,x-2,x+2,26.45,42.5,2.8,3.5);
      const fs=[face(A,[x-1.1,25.9],[x+1.1,25.9],0,1),face(A,[x+1.1,23.7],[x-1.1,23.7],0,-1),face(A,[x+1.1,25.9],[x+1.1,23.7],1,0),face(A,[x-1.1,23.7],[x-1.1,25.9],-1,0)];
      for(const F of fs)archWall(A,F,44.5,56,[{u:.45,w:1.3,bottom:44.5,spring:52,rise:.65}],'stone',.35,'stone');
      for(const z of[44,56,62])S.box(x-1.5,x+1.5,23.3,26.3,z,z+.7,P.stoneHi,P.stoneR,P.stoneHi);
      const upper=A.volume(x-.85,x+.85,24,25.7,56.7,62,'stone');for(const F of Object.values(upper))A.pane(F,.35,57.5,1,3.5,'rect',false);
      A.cone(x,24.8,1.15,.28,62.7,72,4,'stone');
      A.K.cylinder(S,x,24.8,72,73.2,.35,.43,P.gold,P.gold,P.gold,8);A.K.cylinder(S,x,24.8,73.1,74,.42,.36,P.gold,P.gold,P.gold,8);
      for(const dx of[-.26,.26])S.beam([x+dx,24.8,73.8],[x+dx*1.2,24.8,74.5],P.gold,.15);
    }
    return{...A.finish(),details:{vPlan:true,pairedWrenTowers:true,owlFinials:2,pedimentedFourColumnPortico:true,fiveStoreyReturnWings:true,notLeedsTownHall:true}};
  }
  function newcastle(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // Concrete office slab, lower courtyard wings and a physically open
    // colonnade under the separate elliptical council chamber.
    const office=A.volume(5,27,3.5,9,4.7,59,'stone');
    for(const F of[office.front,office.back]){A.windows(F,12,11,6.3,4.25,1.25,2.5,'rect');for(let j=0;j<=11;j++)F.block(j*2-.10,j*2+.10,0,.18,5,59,Q.creamHi,Q.creamD,Q.creamHi);}
    for(const F of[office.left,office.right])A.windows(F,12,2,6.3,4.25,1.4,2.5,'rect');
    for(let x=6;x<27;x+=3.4)S.box(x-.45,x+.45,4.2,8.5,.5,4.7,P.stone,P.stoneR,P.stoneHi);
    for(const [x0,x1,y0,y1]of[[23,28,10,26],[5,23,23,27]]){
      const f=A.volume(x0,x1,y0,y1,.6,20,'stone');for(const F of Object.values(f))A.windows(F,4,Math.max(2,Math.round(F.length/2.7)),2.4,4.4,1.4,2.5,'rect');
      S.box(x0-.25,x1+.25,y0-.25,y1+.25,19.8,20.5,Q.creamHi,Q.creamD,Q.creamHi);
    }
    const out=ellipse(11.8,17.3,8.2,5.3,40);
    for(let j=0;j<16;j++){const t=j*Math.PI/8,x=11.8+6.2*Math.cos(t),y=17.3+3.8*Math.sin(t);A.K.cylinder(S,x,y,.6,8,.23,.23,P.stoneR,P.stoneD,P.stoneR,8);}
    const chamber=planBlock(A,out,8,26,'stone');for(const F of chamber)F.panel(.02,F.length-.02,9,25,(x,y,z)=>A.K.mod(Math.atan2(y-17.3,x-11.8)*23,1)<.15?P.lead:(A.dark(F.nx,F.ny)?P.copperR:P.copper),.06);
    slab(A,out,26.3,.5,P.copper);A.K.cylinder(S,11.8,17.3,26.3,28.4,2,2,P.copper,P.copperR,P.copper,24);
    const carillon=A.volume(3.8,6.8,4.7,8.2,59,68,'stone');
    for(const F of Object.values(carillon))for(let j=0;j<3;j++)F.panel(.25+j*(F.length-.5)/3,.4+j*(F.length-.5)/3,60,67,P.ink,.16);
    A.polygon(5.3,6.45,2,68,70,12,'stone');
    for(let j=0;j<4;j++){const t=j*Math.PI/2,x=5.3+1.5*Math.cos(t),y=6.45+1.5*Math.sin(t);S.beam([x,y,69.5],[x+.4*Math.cos(t),y+.4*Math.sin(t),73],P.copper,.22);S.beam([x+.4*Math.cos(t),y+.4*Math.sin(t),73],[x+.9*Math.cos(t),y+.9*Math.sin(t),72],P.copper,.22);}
    return{...A.finish(),details:{officeStoreys:12,westCarillon:true,lowCourtyardWings:true,ellipticalCouncilChamber:true,openColumnBase:true,finials:'compressed motif, not a counted replica of the sea-horses'}};
  }
  function london(row,view){
    const A=context(row,view),{S,P}=A,n=32,levels=10;
    // Successive floor centres shift toward world south. No bitmap transforms.
    const ring=(j,zOffset=0)=>{const t=j/levels,r=2.2+10.6*Math.sin((.19+.75*t)*Math.PI),cx=16,cy=12.8+7.1*t;return ellipse(cx,cy,r,r*.78,n).map(p=>[...p,3+j*5.8+zOffset]);};
    for(let j=0;j<levels;j++){
      const a=ring(j),b=ring(j+1),z0=a[0][2],z1=b[0][2];
      for(let k=0;k<n;k++){
        const next=(k+1)%n,m=(k+.5)*2*Math.PI/n,glass=A.dark(Math.cos(m),Math.sin(m))?P.glassR:P.glass;
        S.poly([a[k],a[next],b[next],b[k]],[glass,P.warmD]);
        S.beam(a[k],a[next],P.lead,.32);S.beam(a[k],b[k],P.frame,.12);
        if((k+j)%2===0)S.beam(a[k],b[next],P.frame,.11);
      }
      S.poly(b,P.lead);
    }
    const base=ellipse(16,12.8,9,7,32);planBlock(A,base,.6,3,'stone');
    const top=ring(levels);S.poly(top,P.lead);rail(A,top.map(p=>p.slice(0,2)),top[0][2],1,true,P.frame);
    // A small, genuinely glazed projecting entrance under the leaning shell.
    const entry=A.volume(12,20,22.8,25.5,.6,8,'steel');glassFace(A,entry.front,1.3,7,4);
    return{...A.finish(),details:{historicalSouthBank2002:true,leaningModifiedSphere:true,shiftedEllipticalFloorplates:10,triangulatedGlazing:true,currentGLAHeadquarters:false}};
  }
  function holyrood(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // Translate the inspected exterior's committee towers and courtyard roof
    // lights. Do not claim an unobserved complete plan or interior simulation.
    for(const [cx,cy,rx,ry,h]of[[8,8,5.8,4.8,35],[21.5,8.5,6.2,5.1,41],[23,20,5.6,5.8,32]]){
      const pts=roundedPlan(cx-rx,cx+rx,cy-ry,cy+ry,1.6,5),fs=planBlock(A,pts,.7,h,'plaster');
      for(const F of fs){
        if(F.length<3)continue;
        const bays=Math.max(1,Math.round(F.length/4));
        for(let l=0;l<3;l++)for(let b=0;b<bays;b++){
          const u=F.length*(b+.5)/bays-1.05,z=4+l*9;
          F.block(u-.18,u+2.28,0,.72,z-.25,z+6,Q.creamHi,Q.creamD,Q.creamHi);
          const G=face(A,F.point(u,.73,0).slice(0,2),F.point(u+2.1,.73,0).slice(0,2),F.nx,F.ny);
          A.pane(G,.12,z,1.86,5.7,'rect',true);
        }
        for(let l=0;l<3;l++){
          const z=5+l*9,u=F.length*.52,w=Math.min(2,F.length*.28);
          const p=[[u-w,z-1],[u+w,z-1],[u+w,z+4],[u+w*.25,z+4],[u+w*.25,z+7],[u-w,z+7]];
          S.poly(p.map(v=>F.point(v[0],.3,v[1])),P.slateR);
        }
      }
      // A continuous three-dimensional hull roof replaces the flat ring cap.
      // Narrow pointed ends, a curved keel and unequal side slopes remain real
      // world geometry at every camera direction.
      const hull=Array.from({length:17},(_,j)=>{
        const t=j/8-1,w=rx*.93*Math.sqrt(Math.max(0,1-t*t)),y=cy+ry*.94*t,z=h+.35+1.1*t;
        return{left:[cx-w,y,z],right:[cx+w,y,z],ridge:[cx+.4,y,h+.55+6.6*(1-t*t)]};
      });
      for(let j=0;j<hull.length-1;j++){
        const a=hull[j],b=hull[j+1];
        S.poly([a.left,b.left,b.ridge,a.ridge],P.lead);S.poly([a.right,a.ridge,b.ridge,b.right],Q.creamHi);
        if(j%3===0){S.beam(a.left,a.ridge,P.frame,.17);S.beam(a.right,a.ridge,P.frame,.17);}
        S.beam(a.left,b.left,P.frame,.22);S.beam(a.right,b.right,P.frame,.22);
      }
    }
    const link=A.volume(9.5,22,10.5,17,.8,14,'plaster');glassFace(A,link.front,3,12,6);
    // Narrow pointed roof-light boats share a depth buffer with their glazing.
    for(const [cx,cy,w,len,z]of[[7,22,4.5,12,7],[13.5,24,4.8,11,8],[18,20,3.8,10,8.5]]){
      const out=[[cx-w/2,cy],[cx,cy-len/2],[cx+w/2,cy],[cx,cy+len/2]],ridge=[[cx,cy-len*.38,z+3],[cx,cy+len*.38,z+3]];
      planBlock(A,out,.7,z,'plaster');
      for(let j=0;j<4;j++){const next=(j+1)%4,a=[...out[j],z],b=[...out[next],z],p=j<2?ridge[0]:ridge[1];S.poly([a,b,p],[P.glass,P.warmD]);S.beam(a,b,P.frame,.2);S.beam(a,p,P.frame,.19);S.beam(b,p,P.frame,.19);}
      S.beam(ridge[0],ridge[1],P.frame,.25);
    }
    return{...A.finish(),details:{committeeTowerGroup:3,curvedRoofTops:true,irregularSlatePanels:true,projectingWindows:true,glazedCourtyardRooflights:3,wholeSiteSurvey:false,semicircularChamberNotClaimedFromThisExterior:true}};
  }
  function thaxted(row,view){
    const A=context(row,view),{S,P,Q}=A;
    // Photo shows the present pale exposed frame: preserve the open timber
    // ground storey and the two successively jettied upper floors.
    const fs=[face(A,[6,24],[26,24],0,1),face(A,[26,8],[6,8],0,-1),face(A,[26,24],[26,8],1,0),face(A,[6,8],[6,24],-1,0)];
    for(const F of fs){
      const bays=F.length===20?5:4;
      for(let j=0;j<=bays;j++)F.block(j*F.length/bays-.22,j*F.length/bays+.22,-.3,.3,.8,11.5,Q.cream,Q.creamD,Q.creamHi);
      for(let j=0;j<bays;j++){
        const u=j*F.length/bays,mid=u+F.length/bays/2;
        S.beam(F.point(u,.05,8),F.point(mid,.05,11.5),Q.creamHi,.27);S.beam(F.point(u+F.length/bays,.05,8),F.point(mid,.05,11.5),Q.creamHi,.27);
      }
      F.block(0,F.length,-.35,.35,11.2,12.1,Q.cream,Q.creamD,Q.creamHi);
    }
    for(const [x0,x1,y0,y1,z0,z1,levels]of[[5.3,26.7,7.3,24.7,12.1,24,1],[4.6,27.4,6.6,25.4,24,37.3,1]]){
      const f=A.volume(x0,x1,y0,y1,z0,z1,'plaster');
      for(const F of Object.values(f)){
        A.windows(F,levels,Math.max(2,Math.round(F.length/4.1)),z0+3,0,1.9,5.7,z0<20?'arch':'rect');
        for(let u=.15;u<F.length;u+=2.25)F.panel(u,u+.18,z0,z1,Q.creamD,.34);
        F.panel(0,F.length,z0,z0+.4,Q.creamD,.35);F.panel(0,F.length,z1-.4,z1,Q.creamD,.35);
        for(let u=.6;u+3<F.length;u+=5)S.beam(F.point(u,.38,z0+1),F.point(u+3,.38,z1-1),Q.creamD,.2);
      }
    }
    hipPlateau(A,4.1,15.9,6.1,25.9,37.5,7,5.1,'tile');hipPlateau(A,16.1,27.9,6.1,25.9,37.5,7,5.1,'tile');
    // The first upper floor has a real shaded timber underside. Without this
    // surface the open undercroft visually borrowed bright upper-wall pixels.
    S.flat(5.3,26.7,7.3,24.7,12.08,P.woodD);
    A.K.cylinder(S,16,16,.8,12.08,.48,.48,P.wood,P.woodD,P.woodD,8);
    // The isometric ray sees the real covered market paving through the open
    // posts. Shade that physical surface; keep the openings genuinely empty.
    S.box(5.5,26.5,8,24,.5,.8,P.stone,P.stoneR,P.stoneD);
    return{...A.finish(),details:{openTimberMarketBase:true,upperJettiedFloors:2,roofRanges:2,presentHippedTileRoofs:true,paleFrameFromOriginalPhoto:true,notLavenhamOrGuildfordClone:true}};
  }

  // These three models began after their actual C2 exterior photographs were
  // inspected. The other seven models followed their C3 reference inspection.
  function abingdon(row,view){
    const A=context(row,view),{S,P}=A;
    for(let j=0;j<3;j++)S.box(2.7+j*.4,29.3-j*.4,7.1+j*.4,24.9-j*.4,.44+j*.34,.78+j*.34,P.stone,P.stoneR,P.stoneHi);
    const x0=4,x1=28,y0=9,y1=23;
    const fs=[face(A,[x0,y1],[x1,y1],0,1),face(A,[x1,y0],[x0,y0],0,-1),face(A,[x1,y1],[x1,y0],1,0),face(A,[x0,y0],[x0,y1],-1,0)];
    for(let i=0;i<fs.length;i++){
      const F=fs[i],bays=i<2?4:2,step=F.length/bays;
      archWall(A,F,1.45,18,Array.from({length:bays},(_,j)=>({u:j*step+1.05,w:step-2.1,bottom:1.45,spring:12,rise:(step-2.1)/2})),'stone',1,'stone');
    }
    S.flat(x0,x1,y0,y1,17.9,P.woodD);
    S.flat(x0+.7,x1-.7,y0+.7,y1-.7,1.46,P.stoneD);
    const hall=A.volume(x0,x1,y0,y1,18,42,'stone');
    for(const [i,F]of Object.values(hall).entries()){
      const bays=i<2?4:2,step=F.length/bays;
      A.windows(F,1,bays,22,0,step*.55,16,'arch');
      for(let j=0;j<=bays;j++){
        const u=j*step;
        F.block(u-.32,u+.32,0,.42,1.45,41,P.stoneHi,P.stoneR,P.stoneHi);
        F.block(u-.56,u+.56,0,.68,39.7,41,P.stoneHi,P.stoneR,P.stoneHi);
      }
      band(A,F,18,.6);band(A,F,41.4,.85);
    }
    hipPlateau(A,3.4,28.6,8.4,23.6,42.5,9,4,'lead');
    rail(A,[[7.4,12.4],[24.6,12.4],[24.6,19.6],[7.4,19.6]],51.6,2,true,P.stoneHi);
    for(const y of[8.7,23.3])for(const x of[7,13,19,25]){
      const dorm=A.volume(x-1.7,x+1.7,y-.5,y+.5,46,51.5,'plaster'),F=y>16?dorm.front:dorm.back;
      A.pane(F,.65,46.5,2.1,4.2,'rect',true);
      if(y>16)pediment(A,x-2,x+2,y+.6,51.5,1.5,1.25);
      else A.roof(x-2,x+2,y-.8,y+.8,51.5,1.5,'y','plaster');
    }
    for(const x of[3.7,28.3])for(const y of[12.5,19.5]){
      const d=A.volume(x-.5,x+.5,y-1.5,y+1.5,46,51.5,'plaster'),F=x<16?d.left:d.right;
      A.pane(F,.6,46.5,1.8,4.2,'rect',true);
      S.poly([F.point(-.2,.12,51.5),F.point(3.2,.12,51.5),F.point(1.5,.12,53.2)],P.stoneHi);
      A.roof(x-.8,x+.8,y-1.7,y+1.7,51.5,1.7,'x','plaster');
    }
    const tower=A.volume(22.2,27.5,3.8,9,1.45,40,'stone');
    A.windows(tower.right,3,1,7,10,2,5,'rect');A.hip(21.9,27.8,3.5,9.3,40,6,false);
    const cup=A.volume(13.6,18.4,13.6,18.4,51.7,59,'plaster');
    for(const F of Object.values(cup))A.pane(F,1.15,53,2.5,4.4,'rect',true);
    hipPlateau(A,13.1,18.9,13.1,18.9,59,1.7,1.6,'lead');
    lathe(A,16,16,[[60.6,1.25],[62,.75],[64.5,.3],[66.2,.18]],'lead',16);
    S.beam([16,16,66],[16,16,70],P.ironD,.15);
    return{...A.finish(),details:{openArcade:[4,2],upperSessionsHall:true,giantPilasters:true,roundHeadedWindows:true,dormers:true,cupola:true,southStairTower:true,stylobateSteps:3}};
  }
  function middlesex(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const hall=A.volume(3,29,8,24,.65,42,'stone');
    for(const F of Object.values(hall)){
      A.windows(F,3,Math.max(3,Math.round(F.length/4.1)),4,11.3,2.5,6.5,'mullion');
      for(const z of[13.8,25.3,40.5])band(A,F,z,.35);
      for(let u=0;u<=F.length;u+=F.length/6)F.block(u-.22,u+.22,0,.45,.7,41.5,P.stoneHi,P.stoneR,P.stoneHi);
    }
    A.parapet(2.8,29.2,7.8,24.2,42,false);
    hipPlateau(A,4,28,9,23,42.3,8,2.5,'lead');
    for(const x of[6,11,21,26]){
      const d=A.volume(x-1.5,x+1.5,22.2,24.2,43,47,'stone');A.pane(d.front,.6,43.7,1.8,2.8,'rect',true);
      pediment(A,x-1.8,x+1.8,24.25,47,2,1.7);
    }
    const bay=A.volume(12,20,23.7,26,.65,44.8,'stone');
    const F=bay.front;
    A.pane(F,1.1,2,5.8,12,'arch',false);
    F.panel(1.5,6.5,2,11.3,(x,y,z)=>A.K.mod(x,1.1)<.12?P.woodD:P.wood,.4);
    for(let j=0;j<5;j++)F.block(1.1+j*1.2,1.55+j*1.2,0,.65,3.5,10.5,P.wood,P.woodD,P.woodHi);
    F.block(-.25,8.25,0,.75,15,18.3,P.stone,P.stoneR,P.stoneHi);
    // Small solid relief figures stand on the portal's sculpted frieze band.
    for(let j=0;j<8;j++){
      const u=.35+j*.98,p=F.point(u,.9,17);
      A.K.cylinder(S,p[0],p[1],17,17.6,.27,.27,P.stoneHi,P.stoneR,P.stoneHi,8);
      S.beam(F.point(u,.85,15.5),F.point(u,.85,16.8),P.stoneHi,.32);
    }
    const oriel=A.volume(12.8,19.2,25.8,27.1,20,33.2,'stone');
    A.windows(oriel.front,1,3,22,0,1.45,8.6,'pointed');
    for(const G of[oriel.left,oriel.right])A.pane(G,.3,22,.7,8,'pointed',true);
    band(A,oriel.front,20,.6);band(A,oriel.front,33,.7);
    A.pane(F,2.6,35,2.8,7,'pointed',true);
    for(const x of[3.5,10.5,12.3,19.7,21.5,28.5]){
      const z=x<11||x>21?43.8:45.3;
      A.volume(x-.36,x+.36,24,24.8,z-1,z+2.3,'stone');A.cone(x,24.4,.65,.1,z+2.3,z+5.3,8,'stone');
    }
    for(const [x,y]of[[4.5,9.5],[27.5,9.5]])A.chimney(x,y,47,3);
    return{...A.finish(),details:{portlandStoneFront:true,neoGothicEntrance:true,sculptedPortalBand:true,projectingOriel:true,parapetAndDormers:true,courtMechanics:false,compressedFrontRange:true}};
  }
  function rcj(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [x0,x1]of[[3,10.5],[21.5,29]]){
      const f=A.volume(x0,x1,5,24,.6,31,'stone');
      for(const F of Object.values(f))A.windows(F,2,Math.max(2,Math.round(F.length/3.5)),4,13,2,8,'pointed');
      A.roof(x0-.5,x1+.5,4.5,24.5,31,10,'y','stone');
      A.parapet(x0-.15,x1+.15,4.85,24.15,31,false);
    }
    const central=A.volume(10.2,21.8,6,25,.6,47,'stone');
    A.roof(9.8,22.2,5.6,25.4,47,15,'y','stone');
    const F=central.front;
    A.pane(F,2.5,2,6.6,18,'pointed',false);
    for(let d=0;d<3;d++){
      const u=2.0-d*.4,w=7.6+d*.8,z=1.8,h=19.3+d*.7,pts=[[u,z],[u+w,z],[u+w,z+h*.65],[u+w/2,z+h],[u,z+h*.65]];
      for(let j=1;j<4;j++)S.beam(F.point(pts[j][0],.45+d*.12,pts[j][1]),F.point(pts[j+1][0],.45+d*.12,pts[j+1][1]),P.stoneHi,.28);
    }
    for(const u of[.3,9.8])A.pane(F,u,27,1.5,11,'pointed',true);
    A.pane(F,2.1,26,7.4,14,'pointed',true);
    for(let j=1;j<5;j++)F.panel(2.1+7.4*j/5-.08,2.1+7.4*j/5+.08,26.3,37.8,P.frame,.4);
    roundWindow(A,F,F.length/2,44.5,3.4,true);
    for(let j=0;j<8;j++){
      const t=j*Math.PI/4,cx=F.length/2+2.25*Math.cos(t),cz=44.5+2.25*Math.sin(t);
      A.K.ring(S,F,cx,cz,.65,.65,.2,.35,P.stoneHi,12);
    }
    for(const G of[central.left,central.right])A.windows(G,1,5,29,0,2.3,14,'pointed');
    for(const x of[10.15,21.85]){
      A.volume(x-.5,x+.5,24.5,25.7,.7,48,'stone');A.cone(x,25.1,.95,.08,48,57,8,'stone');
    }
    // The asymmetric side clock tower belongs to the Strand main composition.
    const tower=A.volume(24.1,29.3,18,23.2,.7,58,'stone');
    for(const G of Object.values(tower)){
      A.windows(G,2,1,13,14,2,8,'pointed');
      band(A,G,57.5,.6);
    }
    const bracket=A.volume(25.8,27.8,23.2,25.3,50.3,54.5,'stone');
    for(const G of[bracket.left,bracket.right]){
      const c=G.length/2;roundWindow(A,G,c,52.4,.92,false);S.beam(G.point(c,.45,52.4),G.point(c,.45,53.1),P.ink,.14);S.beam(G.point(c,.46,52.4),G.point(c+.65,.46,52.4),P.ink,.14);
    }
    const corners=[[23.7,17.6],[29.7,17.6],[29.7,23.6],[23.7,23.6]];
    for(let j=0;j<4;j++){const a=corners[j],b=corners[(j+1)%4];S.poly([[...a,58],[...b,58],[26.7,20.6,71]],A.K.slate(A.dark([0,1,0,-1][j],[-1,0,1,0][j])));}
    for(const [x,y]of[[24.1,18],[29.3,18],[24.1,23.2],[29.3,23.2]]){A.volume(x-.3,x+.3,y-.3,y+.3,57,61,'stone');A.cone(x,y,.5,0,61,65,8,'stone');}
    S.beam([16,16,62],[16,16,70],P.ironD,.16);
    return{...A.finish(),details:{strandMainRange:true,centralGreatHall:true,pointedPortal:true,roseWindow:true,asymmetricClockTower:true,laterExtensions:false,posterOcclusionDisclosed:true}};
  }

  const MODELS={belfast,manchester,leeds,newcastle,london,holyrood,thaxted,abingdon,middlesex,rcj};
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row||!MODELS[id])throw Error('wave037 exterior-gated model unfinished '+id);return MODELS[id](row,view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture037=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
