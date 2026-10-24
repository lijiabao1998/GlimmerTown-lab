/* GPT-039 wave11: ten original British-inspired buildings.
 * Authored world-space geometry using the unchanged art634 kit and rasterizer.
 * Fictional designs: no real-landmark reproduction, external photo or bitmap input.
 * Pure art source: no simulation state or save access. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "brackenread",
    "nm": "蕨庭閱覽屋",
    "en": "Bracken Fold Reading House",
    "v": 560,
    "shape": "L-plan-unequal-cross-gables-five-sided-oriel-recessed-corner-porch",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "L形低層磚木量體、兩條不等高交叉山牆、五面凸窗、內角退縮門廊、成組煙囪",
    "distinctionFromPublished100": "Cragside: 本款為低矮L形閱覽館，半木上層、凸窗與真實內角門廊；不沿用其不對稱高石宅模型"
  },
  {
    "id": "ferncourt",
    "nm": "銅溪蕨室",
    "en": "Copperbrook Fern Court",
    "v": 564,
    "shape": "unequal-hexagonal-glazed-pavilions-angled-link-pointed-roofs",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "兩座不等高六角玻璃館、斜向低廊、尖形分片玻璃頂、放射窗梃",
    "distinctionFromPublished100": "所有既有穹頂館: 本款兩個六角尖頂與斜接廊，無圓頂或矩形溫室替換"
  },
  {
    "id": "rookhall",
    "nm": "鴉木會館",
    "en": "Rookwood Lantern Hall",
    "v": 568,
    "shape": "cranked-T-plan-jerkinhead-clerestory-rear-apse",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "錯位T形會館、兩端截角山牆、短高側窗帶、背面半圓後殿與成組圓拱窗",
    "distinctionFromPublished100": "Campden/Globe: 非多山牆市場或開放多角劇場；本款封閉T形量體與截角屋頂"
  },
  {
    "id": "cobblefold",
    "nm": "石褶交易亭",
    "en": "Cobblefold Exchange Pavilion",
    "v": 572,
    "shape": "triangular-open-arcade-three-fold-roof-offset-triangular-lantern",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "三角開放拱廊、三片折板石板屋面、偏置三角採光亭、低矮售亭",
    "distinctionFromPublished100": "Stowe未實作且不再復刻；既有三角遊池/市政廳: 本款為通透三角拱廊、折板屋頂"
  },
  {
    "id": "mossgate",
    "nm": "苔門展亭",
    "en": "Mossgate Ticket Lodge",
    "v": 576,
    "shape": "unequal-gate-piers-real-pointed-passage-ogee-and-saddle-caps",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "不等高石門樓、真正貫通的尖拱通道、凹脊連頂、一高一低異形塔帽",
    "distinctionFromPublished100": "Sissinghurst/StAlbans: 不做方塔／鐘塔；本款雙門墩之間明確可見貫通拱道"
  },
  {
    "id": "orchardcraft",
    "nm": "果巷工藝館",
    "en": "Orchardcross Workshop",
    "v": 580,
    "shape": "three-short-sawtooth-monitors-brick-range-fanlight-stair-drum",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "三條短鋸齒採光頂、低磚長屋、圓形樓梯鼓筒與扇形窗",
    "distinctionFromPublished100": "Darlington/Leicester: 非五條百葉山脊或斜網玻璃高塔；本款三短監視頂和獨立低圓鼓"
  },
  {
    "id": "pennyfen",
    "nm": "芬澤船屋展亭",
    "en": "Pennyfen Boathouse Pavilion",
    "v": 584,
    "shape": "inverted-keel-curved-roof-timber-bay-stone-stair-annex",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "上揚倒船底曲屋頂、露木桁架與大窗、偏置石階門房、低側翼",
    "distinctionFromPublished100": "Cromer: 本款陸地k24展亭無棧橋，曲頂尖脊和木架及偏置門房，不複製圓筒救生船站"
  },
  {
    "id": "willowmusic",
    "nm": "柳澤樂亭",
    "en": "Willowmere Music Lodge",
    "v": 588,
    "shape": "cranked-V-plan-butterfly-valley-roofs-staggered-wings",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "折轉V形兩翼、內低外高蝴蝶谷頂、交錯高低簷、深色木窗屏",
    "distinctionFromPublished100": "Saltdean/Eastbourne: 無半圓流線外牆或碟形頂；本款折轉直線V平面、兩段谷頂"
  },
  {
    "id": "hawthornloom",
    "nm": "山楂織屋",
    "en": "Hawthorn Loom House",
    "v": 592,
    "shape": "brick-anchor-rooms-raised-timber-loft-bridge-gambrel-roof",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "兩端磚基房托起木構跨院樓、複折馬廄頂、偏置小坡頂老虎窗、菱形高窗",
    "distinctionFromPublished100": "Thaxted/Faversham: 非柱托單一歇山市場；本款雙磚錨房、真實穿院、複折屋頂"
  },
  {
    "id": "briarwatch",
    "nm": "荊井瞭望屋",
    "en": "Briarwell Beacon House",
    "v": 596,
    "shape": "tapered-hexagonal-timber-lookout-external-stair-two-stage-cap",
    "note": "原創英式外觀，不對應具名真實建築。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original in-repository world geometry using the existing art634 palette, projection, materials and rasterizer.",
    "design": "收分六角木瞭望室、外繞台階與護欄、雙層矮帽、低弓頂附房",
    "distinctionFromPublished100": "Cley/PortlandBill: 無風車葉或燈塔燈室；本款六角木樓、外階、分層帽與弓頂附房"
  }
].map(Object.freeze));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4039'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      const uAt=(x,y)=>Math.abs(nx)>.5?y:x;
      if(kind==='whiteplaster')return(x,y,z)=>K.hash(Math.floor(x*2),Math.floor(y*2),3801)%61===0?(d?C('b8bcb2'):Q.creamHi):(d?C('c4c6bc'):C('e5e4d6'));
      if(kind==='terracotta')return(x,y,z)=>K.mod(z,1.65)<.13?(d?C('8b7360'):C('ad9073')):(d?C('a4876b'):C('c5a17c'));
      if(kind==='vitriolite')return(x,y,z)=>K.mod(z,4.5)<.10?(d?C('617c80'):C('c7d1c7')):(d?C('768c90'):C('9eafb0'));
      if(kind==='copper')return d?P.copperR:P.copper;
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
    function volume(x0,x1,y0,y1,z0,z1,kind,cap=true){
      const f={
        front:Object.assign(S.face([x0,y1],[x1,y1],0,1),{nx:0,ny:1}),
        back:Object.assign(S.face([x1,y0],[x0,y0],0,-1),{nx:0,ny:-1}),
        right:Object.assign(S.face([x1,y1],[x1,y0],1,0),{nx:1,ny:0}),
        left:Object.assign(S.face([x0,y0],[x0,y1],-1,0),{nx:-1,ny:0})
      };
      S.wall([x0,y1],[x1,y1],z0,z1,mat(kind,0,1));S.wall([x1,y0],[x0,y0],z0,z1,mat(kind,0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,mat(kind,1,0));S.wall([x0,y0],[x0,y1],z0,z1,mat(kind,-1,0));
      if(cap)S.flat(x0,x1,y0,y1,z1,kind==='steel'?Q.steelD:P.stoneR);
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
    if(!root.__wave039GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave039GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave039:1});
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

/* WAVE039 AUTHORED MODELS */
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
  // All helpers below are private to GPT-039 and operate in world coordinates.
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

  // GPT-039 helpers are private world-space solids. No bitmap or screen decal.
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


/* WAVE039 ORIGINAL AUTHORED MODELS */
  // Private timber framing follows the facade plane; it is never a screen decal.
  function timber(A,F,z0,z1,bays){
    const {S,P}=A;
    for(let i=0;i<=bays;i++)F.panel(F.length*i/bays-.15,F.length*i/bays+.15,z0,z1,P.woodR,.46);
    for(const z of[z0,z1])F.panel(0,F.length,z-.16,z+.16,P.woodR,.46);
    for(let i=0;i<bays;i++){
      const u0=F.length*i/bays+.2,u1=F.length*(i+1)/bays-.2;
      S.beam(F.point(u0,.43,z0+.25),F.point(u1,.43,z1-.25),P.woodR,.22);
    }
  }
  function fanRoof(A,points,cx,cy,z,zTop,glass=false){
    for(let j=0;j<points.length;j++){
      const a=points[j],b=points[(j+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy),d=A.dark(dy/n,-dx/n);
      A.S.poly([[...a,z],[...b,z],[cx,cy,zTop]],glass?(d?A.P.glassR:A.P.glass):A.K.slate(d));
      A.S.beam([...a,z+.08],[cx,cy,zTop+.08],glass?A.P.frame:A.P.lead,.22);
      if(glass)for(const t of[.33,.66])A.S.beam([a[0]+(cx-a[0])*t,a[1]+(cy-a[1])*t,z+(zTop-z)*t+.09],[b[0]+(cx-b[0])*t,b[1]+(cy-b[1])*t,z+(zTop-z)*t+.09],A.P.frame,.15);
    }
  }
  function brackenread(row,view){
    const A=context(row,view),{S,P}=A;
    const low=A.volume(6,20,9,25,.6,13,'brick'),high=A.volume(6,20,9,25,13,23,'plaster');
    for(const F of[low.front,low.back,low.left,low.right])A.windows(F,1,2,3,0,3.5,7.8,'mullion');
    for(const F of[high.front,high.back,high.left,high.right]){
      A.windows(F,1,2,15,0,3.4,5.5,'rect');timber(A,F,13.4,22.4,4);
    }
    A.roof(5.5,20.5,8.5,25.6,23,10,'y','plaster');
    for(const F of[high.front,high.back])A.pane(F,5.1,24,3.8,5.2,'pointed',true);
    const wing=A.volume(20,28,16,27,.6,16,'whiteplaster');
    for(const F of[wing.front,wing.right,wing.back]){A.windows(F,1,2,3.4,0,2.2,8,'rect');timber(A,F,12.3,15.5,2);}
    A.roof(19.7,28.5,15.5,27.5,16,6,'x','plaster');
    const points=[[9,25],[17,25],[17,27.4],[15,29],[11,29],[9,27.4]],oriel=planBlock(A,points,8.5,20,'plaster');
    for(const F of oriel)if(F.ny>=0&&F.length>1.4)A.pane(F,.23,10,F.length-.46,8.5,'mullion',true);
    fanRoof(A,points,13,26.5,20,24);
    // Recessed porch occupies the open corner of the L, rather than a painted hole.
    slab(A,[[20,11],[27.5,11],[27.5,15.7],[20,15.7]],1,.5);
    for(const x of[21,27])for(const y of[11.5,15])S.box(x-.24,x+.24,y-.24,y+.24,1,8,P.wood,P.woodR,P.woodHi);
    A.roof(20,28,10.7,16,8.2,3.6,'x','wood');A.steps(22,26,8.5,11,1,3);
    A.chimney(7.6,12,29,7);A.chimney(24.5,19.2,21,5);
    return{...A.finish(),details:{originalDesign:true,LPlan:true,unequalCrossGables:true,fiveExposedOrielFaces:true,recessedCornerPorch:true,halfTimberUpperStorey:true}};
  }
  function ferncourt(row,view){
    const A=context(row,view),{S,P}=A;
    const link=planBlock(A,[[14,17],[17,14],[24,20],[21,23]],.6,10,'stone');
    for(const F of link)if(F.length>4)A.pane(F,.4,2.3,F.length-.8,6.8,'ribbon',true);
    slab(A,[[13.8,17],[17,13.8],[24.2,20],[21,23.2]],10.6,.5,P.lead);
    for(const [cx,cy,r,zTop,rise]of[[11,11.8,7.7,21.5,13.5],[24,23,5.6,16.5,10.5]]){
      A.polygon(cx,cy,r,.6,3,6,'stone',Math.PI/6);
      const points=Array.from({length:6},(_,j)=>[cx+r*Math.cos(Math.PI/6+j*Math.PI/3),cy+r*Math.sin(Math.PI/6+j*Math.PI/3)]);
      const walls=planBlock(A,points,3,zTop,'steel');
      for(const F of walls){A.pane(F,.28,3.7,F.length-.56,zTop-4.3,'pointed',true);F.panel(.1,F.length-.1,zTop-.5,zTop,P.frame,.4);}
      fanRoof(A,points,cx,cy,zTop,zTop+rise,true);
      S.beam([cx,cy,zTop+rise],[cx,cy,zTop+rise+2],P.copper,.28);
      for(let j=0;j<6;j++){
        const a=Math.PI/6+j*Math.PI/3,x=cx+(r-.32)*Math.cos(a),y=cy+(r-.32)*Math.sin(a);
        S.beam([x,y,3],[x,y,zTop+.1],P.frame,.3);
      }
    }
    A.steps(7,14,1.6,4.8,1.2,3);
    return{...A.finish(),details:{originalDesign:true,unequalHexagonalPavilions:true,angledLowLink:true,pointedRadialGlazedRoofs:true,realMullions:true}};
  }

  // A clipped gable has a short hip above a four-sided gable end.
  function clippedGable(A,x0,x1,y0,y1,z,rise,clip){
    const {S,P}=A,cy=(y0+y1)/2,cut=rise*.58,dy=(y1-y0)*.21;
    for(const [y,ny,edge]of[[y0,-1,cy-dy],[y1,1,cy+dy]]){
      S.poly([[x0,y,z],[x1,y,z],[x1,edge,z+cut],[x1-clip,cy,z+rise],[x0+clip,cy,z+rise],[x0,edge,z+cut]],A.K.slate(A.dark(0,ny)));
    }
    for(const [x,nx,ridgeX]of[[x0,-1,x0+clip],[x1,1,x1-clip]]){
      S.poly([[x,y0,z],[x,y1,z],[x,cy+dy,z+cut],[x,cy-dy,z+cut]],A.mat('plaster',nx,0));
      S.poly([[x,cy-dy,z+cut],[x,cy+dy,z+cut],[ridgeX,cy,z+rise]],A.K.slate(A.dark(nx,0)));
    }
    S.beam([x0+clip,cy,z+rise+.08],[x1-clip,cy,z+rise+.08],P.lead,.3);
  }
  function rookhall(row,view){
    const A=context(row,view),{S,P}=A;
    const cross=A.volume(5,27,7,17,.6,22,'yellowbrick');
    for(const F of[cross.front,cross.back]){A.windows(F,1,4,4.2,0,3.2,12,'arch');band(A,F,19.8);}
    for(const F of[cross.left,cross.right])A.windows(F,1,2,5,0,2.6,10,'arch');
    clippedGable(A,4.5,27.5,6.5,17.5,22,9,3.4);
    const stem=A.volume(12,21,17,25,.6,18,'flint');
    for(const F of[stem.left,stem.right])A.windows(F,1,2,4.3,0,2.2,9,'arch');
    A.roof(11.6,21.4,16.8,25.5,18,6,'y','stone');
    const apse=Array.from({length:13},(_,j)=>[16.5+6*Math.cos(j*Math.PI/12),24+6*Math.sin(j*Math.PI/12)]);
    const round=planBlock(A,apse,.6,15,'yellowbrick');
    for(const F of round)if(F.ny>0&&F.length>1.3)A.pane(F,.22,4,F.length-.44,8.3,'arch',true);
    fanRoof(A,apse,16.5,24,15,21);
    const lantern=A.volume(10.4,21.7,10.2,13.8,28.1,33.2,'wood');
    for(const F of[lantern.front,lantern.back])A.windows(F,1,5,29.2,0,1.55,3,'rect');
    A.roof(10,22.1,9.8,14.2,33.2,2.5,'x','wood');
    A.steps(11,20,3.2,7,1.3,4);A.chimney(25,9,26.5,7);
    return{...A.finish(),details:{originalDesign:true,crankedTPlan:true,clippedGableEnds:true,shortClerestory:true,segmentedRearApse:true,roundHeadedWindowGroups:true}};
  }
  function cobblefold(row,view){
    const A=context(row,view),{S,P}=A,points=[[4.6,7],[27.4,7],[16,28.4]];
    slab(A,points,.9,.6);
    for(let i=0;i<3;i++){
      const a=points[i],b=points[(i+1)%3],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),F=face(A,a,b,dy/len,-dx/len);
      archWall(A,F,.9,16,[{u:2,w:7.1,bottom:.9,spring:8.6,rise:4.1},{u:len-9.1,w:7.1,bottom:.9,spring:8.6,rise:4.1}],'stone',.8,'stone');
      F.panel(0,len,14.9,15.7,P.stoneHi,.16);
    }
    for(const [x,y]of points)A.polygon(x,y,.9,.9,17,6,'stone',Math.PI/6);
    const top=[[14,11],[19.5,11],[17.8,17]],cent=[17.1,13.1];
    for(let i=0;i<3;i++){
      const j=(i+1)%3;
      S.poly([[...points[i],16.2],[...points[j],16.2],[...top[j],23],[...top[i],23]],A.K.slate(i===1));
      S.beam([...points[i],16.3],[...top[i],23.1],P.lead,.3);
    }
    const lantern=planBlock(A,top,23,27,'whiteboard');
    for(const F of lantern)A.pane(F,.35,23.6,F.length-.7,2.8,'ribbon',true);
    fanRoof(A,top,...cent,27,30);
    const shop=A.volume(6,12,3.3,7.4,.6,8.8,'brick');
    A.pane(shop.back,.55,2,4.9,5.6,'mullion',true);A.roof(5.6,12.4,2.9,7.7,8.8,3.4,'x','brick');
    A.steps(12,20,28.1,30.6,.9,3);
    return{...A.finish(),details:{originalDesign:true,triangularOpenArcade:true,trueArchApertures:true,threeSlopingRoofFolds:true,offsetTriangularLantern:true,lowShopAppendix:true}};
  }
  function pointedPortal(A,F,z1,u,w,spring,rise,thick=.8){
    const {S,P}=A,c=u+w/2,pts=[[u,spring],[c,spring+rise],[u+w,spring]];
    const panel=(a,b,z0,z)=>{if(b>a&&z>z0)for(const d of[0,-thick])S.poly([F.point(a,d,z0),F.point(b,d,z0),F.point(b,d,z),F.point(a,d,z)],A.mat('stone',F.nx,F.ny));};
    panel(0,u,.6,z1);panel(u+w,F.length,.6,z1);
    for(let i=0;i<2;i++){
      const p=pts[i],q=pts[i+1];
      for(const d of[0,-thick])S.poly([F.point(p[0],d,p[1]),F.point(q[0],d,q[1]),F.point(q[0],d,z1),F.point(p[0],d,z1)],A.mat('stone',F.nx,F.ny));
      S.poly([F.point(p[0],0,p[1]),F.point(q[0],0,q[1]),F.point(q[0],-thick,q[1]),F.point(p[0],-thick,p[1])],P.stoneD);
      S.beam(F.point(p[0],.12,p[1]+.25),F.point(q[0],.12,q[1]+.25),P.stoneHi,.55);
    }
    for(const x of[u,u+w]){S.poly([F.point(x,0,.6),F.point(x,0,spring),F.point(x,-thick,spring),F.point(x,-thick,.6)],P.stoneD);F.panel(x-.2,x+.2,.6,spring,P.stoneHi,.16);}
  }
  function mossgate(row,view){
    const A=context(row,view),{S,P}=A;
    const tall=A.volume(4,10,9,24,.6,26,'stone'),low=A.volume(22,28,9,24,.6,20,'stone');
    for(const F of Object.values(tall)){A.windows(F,1,F.length>8?3:1,11,0,2.2,8,'pointed');band(A,F,24.6,.4);}
    for(const F of Object.values(low)){A.windows(F,1,F.length>8?2:1,9.5,0,2.3,5.8,'diamond');band(A,F,18.8,.4);}
    const F=face(A,[10,20],[22,20],0,1),B=face(A,[22,13],[10,13],0,-1);
    pointedPortal(A,F,21,1,10,10.3,8);pointedPortal(A,B,21,1,10,10.3,8);
    // The crossing has a real empty centre below the pointed soffit.
    for(const [a,b]of[[10,16],[16,22]]){
      const za=a===10?24:21,zb=b===22?24:21;
      S.poly([[a,12.6,za],[b,12.6,zb],[b,20.4,zb],[a,20.4,za]],A.mat('lead',0,1));
      for(const [y,ny]of[[13,-1],[20,1]])S.poly([[a,y,21],[b,y,21],[b,y,zb],[a,y,za]],A.mat('stone',0,ny));
    }
    lathe(A,7,16.5,[[26,4],[27.3,4.4],[30,3.1],[33,2.6],[35.2,1.1],[37.2,.12]],'copper',8,Math.PI/8);
    hipPlateau(A,21.4,28.6,8.5,24.5,20,5,2.5,'lead');
    A.roof(23.7,26.3,12.1,20.9,25,3.1,'y','stone');
    S.flat(10.1,21.9,11,22,.52,A.K.paving);
    return{...A.finish(),details:{originalDesign:true,unequalGatePiers:true,truePointedThroughPassage:true,concaveSaddleConnectorRoof:true,ogeeAndClippedCaps:true}};
  }
  function orchardcraft(row,view){
    const A=context(row,view),{S,P}=A,body=A.volume(4,28,7,27,.6,15,'brick');
    for(const F of[body.front,body.back])A.windows(F,1,5,3,0,3,7.2,'arch');
    for(const F of[body.left,body.right])A.windows(F,1,4,3.2,0,2.7,7.1,'rect');
    for(const x of[4,12,20]){
      S.poly([[x,6.5,15],[x+8,6.5,22],[x+8,27.5,22],[x,27.5,15]],A.mat('zinc',-1,0));
      const F=face(A,[x+8,27],[x+8,7],1,0);A.pane(F,.25,15.35,F.length-.5,6.15,'ribbon',true);
      for(const [y,ny]of[[7,-1],[27,1]])S.poly([[x,y,15],[x+8,y,15],[x+8,y,22]],A.mat('brick',0,ny));
      for(const y of[7,12,17,22,27])S.beam([x,y,15.08],[x+8,y,22.08],P.lead,.2);
      S.beam([x+8,6.5,22.12],[x+8,27.5,22.12],P.lead,.28);
    }
    const drum=A.polygon(7.3,7.2,4.3,.6,25,12,'yellowbrick',Math.PI/12);
    drum.forEach((F,i)=>{if(i%2===0)A.pane(F,.22,7+(i%3)*3,F.length-.44,7,'rect',true);});
    lathe(A,7.3,7.2,[[25,4.7],[26,4.7],[28,1.9],[28.6,0]],'lead',12,Math.PI/12);
    roundWindow(A,body.front,12,11,2,true);
    A.steps(19,24,27,30,1.1,3);
    return{...A.finish(),details:{originalDesign:true,threeShortSawtoothMonitors:true,glazedVerticalMonitorFaces:true,lowBrickWorkshopRange:true,fanlightAndStairDrum:true}};
  }
  function keelRoof(A,x0,x1,y0,y1,z,rise){
    const {S,P}=A,at=t=>[x0+(x1-x0)*t,z+rise*(1-Math.abs(2*t-1)**.72)];
    for(let j=0;j<24;j++){
      const p=at(j/24),q=at((j+1)/24);
      S.poly([[p[0],y0,p[1]],[q[0],y0,q[1]],[q[0],y1,q[1]],[p[0],y1,p[1]]],A.mat('lead',j<12?-1:1,0));
      for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[p[0],y,z],[q[0],y,z],[q[0],y,q[1]],[p[0],y,p[1]]],A.mat('cedar',0,ny));
    }
    for(const y of[y0,y0+(y1-y0)/3,y0+(y1-y0)*2/3,y1])for(let j=0;j<24;j++){
      const p=at(j/24),q=at((j+1)/24);S.beam([p[0],y,p[1]+.09],[q[0],y,q[1]+.09],P.woodR,.25);
    }
    const cx=(x0+x1)/2;S.beam([cx,y0-.35,z+rise+.08],[cx,y1+.35,z+rise+.08],P.copper,.45);
  }
  function pennyfen(row,view){
    const A=context(row,view),{S,P}=A,body=A.volume(7,26,6,25,.6,14,'cedar');
    keelRoof(A,6.5,26.5,5.5,25.5,14,17);
    for(const F of[body.front,body.back]){
      // A narrow pointed fanlight fits inside the swept roof profile.
      A.pane(F,6,3.2,7,22,'pointed',true);
      for(const u of[1,4.5,14,17.5])F.panel(u,u+.24,1.2,13.5,P.woodR,.5);
      S.beam(F.point(1,.5,2),F.point(5,.5,12.5),P.woodR,.36);
      S.beam(F.point(18,.5,2),F.point(14,.5,12.5),P.woodR,.36);
    }
    for(const F of[body.left,body.right]){A.windows(F,1,4,3.4,0,3.2,7.3,'mullion');timber(A,F,1.1,13.3,4);}
    const porch=A.volume(3.1,7.2,17,26,.6,10.5,'stone');
    A.pane(porch.front,.65,2.3,2.7,6.4,'arch',true);A.windows(porch.left,1,2,3.2,0,2.1,5,'rect');
    hipPlateau(A,2.7,7.6,16.6,26.4,10.5,3.5,1.8,'lead');
    A.steps(2.6,6.5,26,30.2,2.2,5);rail(A,[[2.6,26],[2.6,30.2]],2.2,1.5,false);
    return{...A.finish(),details:{originalDesign:true,sweptInvertedKeelRoof:true,peakedCopperRidge:true,exposedTimberFrames:true,offsetStoneAccessLodge:true,landBasedNativeCarrier:true}};
  }
  function butterfly(A,points,z){
    const {S,P}=A,a=[(points[0][0]+points[1][0])/2,(points[0][1]+points[1][1])/2],b=[(points[2][0]+points[3][0])/2,(points[2][1]+points[3][1])/2];
    for(const [i,j]of[[0,3],[1,2]])S.poly([[...points[i],z+6],[...points[j],z+6],[...b,z+1],[...a,z+1]],A.mat('lead',i===0?-1:1,0));
    for(const [i,j,m]of[[0,1,a],[3,2,b]]){
      S.poly([[...points[i],z],[...points[j],z],[...points[j],z+6],[...m,z+1],[...points[i],z+6]],A.mat('cedar',0,i===0?-1:1));
    }
    for(const [i,j]of[[0,3],[1,2]])S.wall(points[i],points[j],z,z+6,A.mat('cedar',i===0?-1:1,0));
    S.beam([...a,z+1.05],[...b,z+1.05],P.lead,.4);
  }
  function willowmusic(row,view){
    const A=context(row,view),{S,P}=A,left=[[4,8],[8,4],[19,15],[15,19]],right=[[17,15],[26,5],[30,9],[21,19]];
    const f1=planBlock(A,left,.6,12,'cedar'),f2=planBlock(A,right,.6,15,'whiteplaster');
    for(const F of f1){A.pane(F,.35,2.1,F.length-.7,8.8,'ribbon',true);for(let u=1;u<F.length;u+=2)F.panel(u,u+.16,1.4,11.4,P.woodR,.5);}
    for(const F of f2){A.pane(F,.4,4,F.length-.8,8.8,'mullion',true);for(let u=1;u<F.length;u+=2.5)F.panel(u,u+.18,2,14.4,P.woodR,.5);}
    butterfly(A,left,12);butterfly(A,right,15);
    const join=A.volume(14,22,16,23,.6,10,'brick');A.pane(join.front,.5,2,7,6.4,'ribbon',true);S.flat(13.6,22.4,15.7,23.4,10.5,P.lead);
    slab(A,[[5,21],[12,23],[14,26],[7,24]],1,.4);rail(A,[[5,21],[7,24],[14,26]],1,1.5,false);
    A.steps(15,21,23,27,1.2,4);
    return{...A.finish(),details:{originalDesign:true,crankedVPlan:true,unequalStaggeredWings:true,twoButterflyValleyRoofs:true,deepTimberWindowScreens:true}};
  }
  function gambrel(A,x0,x1,y0,y1,z){
    const {S,P}=A,cy=(y0+y1)/2,profile=[[y0,z],[y0+2.3,z+7],[cy,z+11],[y1-2.3,z+7],[y1,z]];
    for(let j=0;j<4;j++){const p=profile[j],q=profile[j+1];S.poly([[x0,p[0],p[1]],[x1,p[0],p[1]],[x1,q[0],q[1]],[x0,q[0],q[1]]],A.K.slate(j<2));}
    for(const [x,nx]of[[x0,-1],[x1,1]])S.poly(profile.map(p=>[x,p[0],p[1]]),A.mat('whiteboard',nx,0));
    for(const j of[1,2,3])S.beam([x0,profile[j][0],profile[j][1]+.08],[x1,profile[j][0],profile[j][1]+.08],P.lead,.25);
  }
  function hawthornloom(row,view){
    const A=context(row,view),{S,P}=A;
    const anchors=[A.volume(4,11,9,25,.6,14,'brick'),A.volume(21,28,9,25,.6,14,'brick')];
    for(const b of anchors)for(const F of Object.values(b))A.windows(F,1,F.length>10?3:1,3,0,2.7,7.5,'arch');
    const bridge=A.volume(4,28,12,22,14,27,'whiteboard');
    for(const F of[bridge.front,bridge.back]){A.windows(F,1,6,17.1,0,2.4,6.3,'diamond');timber(A,F,14.5,26.5,8);}
    for(const F of[bridge.left,bridge.right]){A.pane(F,3,18,4,6,'mullion',true);timber(A,F,14.5,26.5,3);A.pane(F,3.1,28.2,3.8,5.4,'diamond',true);}
    gambrel(A,3.5,28.5,11.5,22.5,27);
    for(const x of[7.8,19.6]){
      const d=A.volume(x,x+3.3,19.9,23.1,30.8,34.8,'whiteboard');A.pane(d.front,.35,31.4,2.6,2.7,'rect',true);
      S.poly([[x-.25,19.7,36],[x+3.55,19.7,36],[x+3.55,23.4,34.8],[x-.25,23.4,34.8]],A.K.slate(false));
    }
    // The ground between the two anchor rooms stays open under the loft.
    S.flat(11.1,20.9,7,28,.52,A.K.paving);
    for(const y of[12.5,21.5])S.beam([10.5,y,13.7],[21.5,y,13.7],P.woodR,.45);
    return{...A.finish(),details:{originalDesign:true,twoBrickAnchorRooms:true,raisedTimberLoftBridge:true,trueOpenGroundCourt:true,doublePitchGambrelRoof:true,offsetShedDormers:true,diamondClerestory:true}};
  }
  function briarwatch(row,view){
    const A=context(row,view),{S,P}=A,cx=17,cy=14.5,phase=Math.PI/6;
    A.polygon(cx,cy,6.5,.6,7,6,'flint',phase);
    lathe(A,cx,cy,[[7,6.5],[20,4.8]],'cedar',6,phase);
    const lookout=A.polygon(cx,cy,5.8,20,30.5,6,'whiteboard',phase);
    for(const F of lookout){A.pane(F,.4,22,F.length-.8,6.6,'mullion',true);timber(A,F,20.5,30,2);}
    const walk=ellipse(cx,cy,8,8,6,phase);slab(A,walk,20,.55,P.woodHi);rail(A,walk,20,2.3,true,P.woodR);
    A.cone(cx,cy,7,4.1,30.5,35,6,'lead');
    const cap=A.polygon(cx,cy,3.6,35,37.4,6,'wood',phase);
    for(const F of cap)A.pane(F,.24,35.4,F.length-.48,1.5,'ribbon',true);
    A.cone(cx,cy,4.4,.1,37.4,42,6,'slate');
    stairs3(A,26.5,29.5,3.5,13.5,.7,11.5,16);slab(A,[[24,13],[29.5,13],[29.5,16],[24,16]],11.5,.4,P.woodHi);
    stairs3(A,24,26.5,15.8,22.4,11.5,20,12);slab(A,[[21,20.5],[26.5,20.5],[26.5,23.5],[21,23.5]],20,.4,P.woodHi);
    rail(A,[[21,23.5],[26.5,23.5],[26.5,20.5]],20,2,false,P.woodR);
    const annex=A.volume(4,12,21,29,.6,10,'brick');barrel(A,3.5,12.5,20.5,29.5,10,4.5);
    A.pane(annex.front,1.8,2.3,4.4,6.7,'arch',true);A.windows(annex.left,1,2,3,0,2.2,5.8,'rect');
    return{...A.finish(),details:{originalDesign:true,taperedHexagonalTimberBase:true,overhangingSixWindowLookout:true,externalTwoFlightStair:true,hexagonalWrapWalk:true,twoStageCap:true,lowBowRoofAnnex:true}};
  }

  const MODELS=Object.freeze({brackenread,ferncourt,rookhall,cobblefold,mossgate,orchardcraft,pennyfen,willowmusic,hawthornloom,briarwatch});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave039 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave039 four world rotations only');if(!MODELS[id])throw Error('wave039 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture039=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
