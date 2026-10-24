/* GPT-040 wave12: original English village service buildings.
 * Authored world-space geometry using the unchanged art634 kit.
 * Fictional appearances only; no real-landmark, photograph or game-rule claim.
 * Shared local drawing helpers are inherited from GPT-039; all ten model
 * bodies below are newly authored forms. No bitmap or screen-space decals. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "asterpost",
    "nm": "紫菀村郵亭",
    "en": "Asterwick Post House",
    "v": 600,
    "shape": "splayed-five-sided-porch-bellcast-jerkinhead-asymmetric-roof",
    "design": "五邊退縮郵亭、折簷截角主頂、偏置低山牆與高雙煙囪；斜角成組窄窗",
    "distinctionFromPublished110": "蕨庭閱覽屋採L形交叉山牆，本款五邊前廳與折簷截角單主頂",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "barleybake",
    "nm": "麥谷烘焙坊",
    "en": "Barleycombe Bakehouse",
    "v": 604,
    "shape": "two-low-beehive-oven-domes-short-half-hip-bakery",
    "design": "兩座低蜂巢烤爐量體、短半歇山烘焙屋與長遮雨簷；圓拱店窗",
    "distinctionFromPublished110": "格拉德斯通為高瓶窯工場，本款兩低穹爐與短店屋、非瓶窯複製",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "honeygrocer",
    "nm": "蜜溪街角雜貨屋",
    "en": "Honeybrook Corner Stores",
    "v": 608,
    "shape": "quarter-sector-shop-front-radial-hip-stepped-rear-wing",
    "design": "四分圓街角店面、放射扇頂、階梯後翼與平挑店簷；弧面分格櫥窗",
    "distinctionFromPublished110": "既有流線泳場為長弧體，本款小扇形角店與明確矩形後翼",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "foxengine",
    "nm": "狐澤消防亭",
    "en": "Foxmere Engine Lodge",
    "v": 612,
    "shape": "two-engine-bay-gables-open-square-hose-frame",
    "design": "雙高山牆車庫量體、開放方木架乾管塔與單坡側房；兩個寬半圓車庫窗",
    "distinctionFromPublished110": "不複製既有消防屋；本款並列尖山牆與真正通透的木架塔",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "mallowsew",
    "nm": "錦葵裁縫屋",
    "en": "Mallowridge Sewing Rooms",
    "v": 616,
    "shape": "chamfered-mansard-workroom-glazed-wedge-stair",
    "design": "削角單量體複折四坡頂、楔形玻璃樓梯間與三小坡頂老虎窗；階梯菱格窗",
    "distinctionFromPublished110": "山楂織屋有架空橋，本款落地削角作坊，無橋與穿院替換",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "dewbankwash",
    "nm": "露岸洗衣房",
    "en": "Dewbank Wash House",
    "v": 620,
    "shape": "four-low-parallel-barrel-vaults-brick-spine-court",
    "design": "四段低平行圓筒拱頂、窄磚脊與開放石院；四圓拱窗和洗槽展示",
    "distinctionFromPublished110": "芬澤為單高倒船底頂，本款四個低圓拱並列與低長屋",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "cloverseed",
    "nm": "苜蓿種籽屋",
    "en": "Cloverfold Seed Exchange",
    "v": 624,
    "shape": "U-shaped-open-timber-stalls-stepped-gable-store",
    "design": "U形開放木攤廊、後方三級山牆庫房與低棚頂；方格高窗與攤口",
    "distinctionFromPublished110": "石褶為三角折板拱廊，本款U形低木廊及階梯後倉",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "thistlenursery",
    "nm": "薊谷育苗舍",
    "en": "Thistledene Nursery",
    "v": 628,
    "shape": "octagonal-clerestory-pyramid-two-unequal-apsidal-wings",
    "design": "八角高側窗育苗室、四坡分片尖頂與兩個不等半圓翼；扇形高窗",
    "distinctionFromPublished110": "銅溪為雙六角玻璃尖館，本款中央八角實牆與不等半圓低翼",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "brooktools",
    "nm": "溪坳工具借用屋",
    "en": "Brookhollow Tool Library",
    "v": 632,
    "shape": "dog-leg-three-level-skillion-timber-tool-shed",
    "design": "折轉狗腿三段木石量體、三層錯落單坡頂與外置矮工具罩；長短排窗",
    "distinctionFromPublished110": "柳澤為V形蝴蝶谷頂，本款折轉Z形階梯單坡，沒有谷頂",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "hazeldairy",
    "nm": "榛十字乳品坊",
    "en": "Hazelcross Dairy Parlour",
    "v": 636,
    "shape": "T-plan-hipped-dairy-two-squat-tank-domes-canted-cold-room",
    "design": "低T形乳品展示坊、平脊四坡瓦頂、兩低圓頂罐體及斜角冷室；通風圓窗",
    "distinctionFromPublished110": "鴉木為高T形截角會館，本款低平四坡、雙低罐與斜角附房",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  }
].map(Object.freeze));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4040'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
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
    if(!root.__wave040GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave040GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave040:1});
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


  function planBlock(A,points,z0,z1,kind,cap){
    const {S,P}=A,faces=[];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;
      S.wall(a,b,z0,z1,A.mat(kind,nx,ny));faces.push(face(A,a,b,nx,ny));
    }
    if(cap!==false)S.poly(points.map(p=>[...p,z1]),cap===undefined?P.stoneHi:cap);
    return faces;
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
  // All helpers below are private to GPT-040 and operate in world coordinates.

  function roundWindow(A,F,u,z,r,lit=true){
    const {S,K,P}=A,points=Array.from({length:24},(_,j)=>{const t=j*2*Math.PI/24;return F.point(u+r*Math.cos(t),.19,z+r*Math.sin(t));});
    S.poly(points,lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    K.ring(S,F,u,z,r+.3,r+.3,.35,.24,P.stoneHi,24);
    for(const t of[0,Math.PI/3,2*Math.PI/3])S.beam(F.point(u+r*Math.cos(t),.33,z+r*Math.sin(t)),F.point(u-r*Math.cos(t),.33,z-r*Math.sin(t)),P.frame,.16);
  }

  function timber(A,F,z0,z1,bays){
    const {S,P}=A;
    for(let i=0;i<=bays;i++)F.panel(F.length*i/bays-.15,F.length*i/bays+.15,z0,z1,P.woodR,.46);
    for(const z of[z0,z1])F.panel(0,F.length,z-.16,z+.16,P.woodR,.46);
    for(let i=0;i<bays;i++){
      const u0=F.length*i/bays+.2,u1=F.length*(i+1)/bays-.2;
      S.beam(F.point(u0,.43,z0+.25),F.point(u1,.43,z1-.25),P.woodR,.22);
    }
  }

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

  function fanRoof(A,points,cx,cy,z,zTop,glass=false){
    for(let j=0;j<points.length;j++){
      const a=points[j],b=points[(j+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy),d=A.dark(dy/n,-dx/n);
      A.S.poly([[...a,z],[...b,z],[cx,cy,zTop]],glass?(d?A.P.glassR:A.P.glass):A.K.slate(d));
      A.S.beam([...a,z+.08],[cx,cy,zTop+.08],glass?A.P.frame:A.P.lead,.22);
      if(glass)for(const t of[.33,.66])A.S.beam([a[0]+(cx-a[0])*t,a[1]+(cy-a[1])*t,z+(zTop-z)*t+.09],[b[0]+(cx-b[0])*t,b[1]+(cy-b[1])*t,z+(zTop-z)*t+.09],A.P.frame,.15);
    }
  }

  function slab(A,points,z,thick=.45,col){
    const {S,P}=A,c=col===undefined?P.stoneHi:col;
    S.poly(points.map(p=>[...p,z]),c);S.poly(points.map(p=>[...p,z-thick]),P.stoneD);
    for(let i=0;i<points.length;i++)S.wall(points[i],points[(i+1)%points.length],z-thick,z,A.Q.creamD);
  }

  function shallowArch(A,F,u,z,w,h,rise,lit=true){
    const {S,P}=A,spring=z+h-rise,cx=u+w/2;
    const pts=(r,bottom,offset)=>[[cx-r,bottom],[cx+r,bottom],...Array.from({length:17},(_,i)=>{const t=i*Math.PI/16;return[cx+r*Math.cos(t),spring+(rise-offset)*Math.sin(t)];})];
    S.poly(pts(w/2+.25,z-.25,-.25).map(p=>F.point(p[0],.16,p[1])),P.stoneHi);
    S.poly(pts(w/2-.22,z+.25,.22).map(p=>F.point(p[0],.28,p[1])),lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    F.panel(cx-.08,cx+.08,z+.35,spring+rise-.35,P.frame,.4);F.panel(u+.3,u+w-.3,spring-.12,spring+.12,P.frame,.4);
  }

/* WAVE040 NEW AUTHORED MODELS */
  function asterpost(row,view){
    const A=context(row,view),{S,P}=A;
    const main=A.volume(8,27,6,23,.6,17,'brick');
    // A flared lower roof and a separately clipped high ridge make a bellcast
    // jerkinhead, rather than the previous wave's crossing gable roofs.
    const outer=[[7.2,5.2],[27.8,5.2],[27.8,23.8],[7.2,23.8]],inner=[[8.3,6.5],[26.7,6.5],[26.7,22.5],[8.3,22.5]];
    for(let i=0;i<4;i++){const j=(i+1)%4;S.poly([[...outer[i],17],[...outer[j],17],[...inner[j],19],[...inner[i],19]],A.K.slate(A.dark([0,1,0,-1][i],[-1,0,1,0][i])));}
    clippedGable(A,8.3,26.7,6.5,22.5,19,8.5,3.1);
    for(const F of[main.left,main.right]){A.windows(F,1,3,4.5,0,2.7,7.5,'rect');band(A,F,14.8,.5);}
    A.windows(main.back,1,4,4,0,2.4,8,'mullion');
    A.pane(main.front,12.7,4.2,4.5,8.6,'pointed',true);
    // The entrance is a five-sided stone vestibule with splayed window faces.
    const plan=[[6,20],[16,20],[18,26],[12,29],[5,26]],porch=planBlock(A,plan,.6,12,'stone');
    for(let i=0;i<porch.length;i++){const F=porch[i];if(i===2)A.pane(F,1.1,2.3,F.length-2.2,7.2,'arch',true);else if(i!==0)A.pane(F,.8,3,F.length-1.6,6.3,'mullion',true);}
    fanRoof(A,plan,11,24.2,12,17,false);
    const low=A.volume(2.4,7.7,8,18,.6,10.5,'yellowbrick');A.roof(2.1,8,7.6,18.4,10.5,5,'y','yellowbrick');
    A.windows(low.left,1,2,2.4,0,2.3,5.3,'rect');A.pane(low.front,1,2,3.2,6.2,'arch',true);
    A.chimney(22,9,24,5.5);A.chimney(24.7,9,24,4.5);
    A.steps(9,15,28,30.5,1.2,4);
    return{...A.finish(),details:{originalDesign:true,fiveSidedSplayedVestibule:true,flaredClippedMainRoof:true,offsetLowGable:true,pairedUnequalChimneys:true,newModelBody:true}};
  }

  function barleybake(row,view){
    const A=context(row,view),{S,P,K}=A;
    const shop=A.volume(5,28,5,17,.6,13,'brick');
    clippedGable(A,4.6,28.4,4.6,17.4,13,8.5,2.4);
    for(const F of[shop.front,shop.back])A.windows(F,1,4,2.4,0,3.5,7.8,'arch');
    for(const F of[shop.left,shop.right])A.windows(F,1,2,2.8,0,3.1,6.8,'rect');
    for(const [cx,cy,r]of[[9,24,4.8],[23,24,4.1]]){
      A.polygon(cx,cy,r,.6,4.8,20,'stone');
      lathe(A,cx,cy,[[4.8,r],[6.9,r*.94],[9.2,r*.66],[10.8,r*.28],[11.1,.65]],'brick',24);
      A.polygon(cx,cy,.72,10.8,15.9,12,'brick');A.cone(cx,cy,1.1,1.1,15.9,16.6,12,'stone');
      const F=face(A,[cx-2.2,cy+r+.03],[cx+2.2,cy+r+.03],0,1);
      shallowArch(A,F,.7,1,3,3.7,1.1,false);
      for(const z of[5.2,7.2]){
        const points=Array.from({length:32},(_,j)=>{const t=j*Math.PI/16;return[cx+Math.cos(t)*(z===5.2?r:r*.89),cy+Math.sin(t)*(z===5.2?r:r*.89),z];});
        for(let j=0;j<points.length;j++)S.beam(points[j],points[(j+1)%points.length],P.stoneD,.16);
      }
    }
    S.poly([[5,17.2,10],[28,17.2,10],[28,20.7,8.6],[5,20.7,8.6]],K.slate(false));
    for(const x of[5.5,16,27.5])S.beam([x,20.2,.6],[x,20.2,8.7],P.woodR,.34);
    A.chimney(25.5,8.2,20,4);A.steps(13,19,18.5,23,1,3);
    return{...A.finish(),details:{originalDesign:true,twoLowBeehiveOvens:true,shortHalfHipBakehouse:true,coveredShopCanopy:true,closedOvenDoorsNotNewSimulation:true,newModelBody:true}};
  }

  function honeygrocer(row,view){
    const A=context(row,view),{S,P}=A,cx=8,cy=8,r=19;
    const rear=A.volume(3.5,27,3.5,10.2,.6,13,'yellowbrick');
    A.windows(rear.back,1,5,3,0,2.8,6.4,'rect');A.windows(rear.left,1,2,3,0,2.3,6.4,'rect');
    const arc=Array.from({length:13},(_,i)=>{const t=i*Math.PI/24;return[cx+r*Math.cos(t),cy+r*Math.sin(t)];});
    const plan=[[cx,cy],...arc],front=planBlock(A,plan,.6,12,'yellowbrick');
    // A continuous curved corner window, built from physical radial wall bays.
    for(let i=1;i<front.length-1;i++){const F=front[i];A.pane(F,.17,2.2,F.length-.34,7.3,'ribbon',true);F.panel(0,F.length,10.1,11.2,P.woodR,.4);}
    fanRoof(A,plan,cx+2,cy+2,12,22,false);
    const wing=A.volume(3.5,8,10,28,.6,9.2,'brick');A.windows(wing.left,1,4,2,0,2.4,5.6,'rect');
    S.poly([[3,9.5,9.8],[8.6,9.5,10.8],[8.6,28.5,10.8],[3,28.5,9.8]],A.K.slate(true));
    for(let i=0;i<arc.length-1;i++){
      const a=arc[i],b=arc[i+1],out=p=>[cx+(p[0]-cx)*1.08,cy+(p[1]-cy)*1.08];
      S.poly([[...a,9],[...b,9],[...out(b),8.2],[...out(a),8.2]],P.woodHi);
      if(i%3===0)S.beam([...out(a),.6],[...out(a),8.2],P.woodR,.2);
    }
    A.chimney(5.3,6.5,14,6.5);A.steps(8.5,13,26,30.4,1.2,4);
    return{...A.finish(),details:{originalDesign:true,quarterSectorShopFront:true,radialCornerHipRoof:true,steppedNarrowRearWing:true,curvedPhysicalWindowBays:true,newModelBody:true}};
  }

  function foxengine(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [x,z]of[[4,15.5],[15,17]]){
      const b=A.volume(x,x+10,9,26,.6,z,'brick');A.roof(x-.45,x+10.45,8.6,26.4,z,10,'y','brick');
      shallowArch(A,b.front,.9,1.5,8.2,11.4,3.3,true);
      A.windows(b.back,1,2,4,0,3,7,'rect');
      A.windows(x===4?b.left:b.right,1,3,4,0,2.8,7.5,'mullion');
      roundWindow(A,b.front,5,z+3,1.5,true);
    }
    // Four real posts, open between them; a solid painted tower is not used.
    for(const x of[23,29])for(const y of[3,9])S.beam([x,y,.6],[x,y,33],P.woodR,.55);
    for(const z of[8,16,24,31]){
      for(const [a,b]of[[[23,3],[29,3]],[[29,3],[29,9]],[[29,9],[23,9]],[[23,9],[23,3]]])S.beam([...a,z],[...b,z],P.woodR,.4);
    }
    for(const [a,b]of[[[23,3],[29,3]],[[29,3],[29,9]],[[29,9],[23,9]],[[23,9],[23,3]]])for(let z=1;z<24;z+=8){S.beam([...a,z],[...b,z+7],P.woodHi,.22);S.beam([...b,z],[...a,z+7],P.woodHi,.22);}
    hipPlateau(A,22.3,29.7,2.3,9.7,32,5,3.1,'lead');
    const low=A.volume(3,14,3,8.7,.6,8,'stone');A.windows(low.back,1,3,2,0,2.5,4.7,'rect');
    S.poly([[2.5,2.7,8.5],[14.4,2.7,8.5],[14.4,9.1,10.2],[2.5,9.1,10.2]],A.K.slate(true));
    A.steps(5,24,26.3,29.8,.8,3);
    return{...A.finish(),details:{originalDesign:true,twoTallEngineBayGables:true,wideRoundHeadBayWindows:true,openFourPostHoseFrame:true,lowMonoPitchSideRoom:true,appearanceOnly:true,newModelBody:true}};
  }

  function mallowsew(row,view){
    const A=context(row,view),{S,P}=A;
    const outline=[[6,5],[24,5],[28,9],[28,23],[23,28],[7,28],[3.8,24],[3.8,9]],body=planBlock(A,outline,.6,19,'yellowbrick');
    for(const F of body){
      if(F.length>8)A.windows(F,2,Math.max(2,Math.floor(F.length/4)),3.2,7.8,2.6,5.8,'diamond');
      else A.pane(F,.6,4,F.length-1.2,10.2,'mullion',true);
    }
    const cx=15.6,cy=16.4,inside=outline.map(p=>[cx+(p[0]-cx)*.75,cy+(p[1]-cy)*.75]),top=inside.map(p=>[cx+(p[0]-cx)*.47,cy+(p[1]-cy)*.47]);
    for(let i=0;i<outline.length;i++){
      const j=(i+1)%outline.length,nx=outline[j][1]-outline[i][1],ny=outline[i][0]-outline[j][0];
      S.poly([[...outline[i],19],[...outline[j],19],[...inside[j],26],[...inside[i],26]],A.K.slate(A.dark(nx,ny)));
      S.poly([[...inside[i],26],[...inside[j],26],[...top[j],29],[...top[i],29]],A.K.slate(A.dark(nx,ny)));
    }
    S.poly(top.map(p=>[...p,29]),P.lead);
    for(const x of[8,14.2,20.4]){
      const d=A.volume(x,x+3.1,24.1,27.5,21.3,25,'whiteplaster');A.pane(d.front,.35,21.8,2.4,2.5,'rect',true);
      S.poly([[x-.2,23.9,25.8],[x+3.3,23.9,25.8],[x+3.3,27.8,25],[x-.2,27.8,25]],A.K.slate(false));
    }
    const wedge=[[25,9],[30,12],[30,22],[27,24]],glass=planBlock(A,wedge,.6,18,'brick');
    for(let i=0;i<glass.length;i++)if(i!==3){const F=glass[i];A.pane(F,.35,2,F.length-.7,14,'mullion',true);}
    fanRoof(A,wedge,28,16,18,23,true);
    A.chimney(9,7.5,26,5);A.steps(9,20,28,30.6,1.2,4);
    return{...A.finish(),details:{originalDesign:true,chamferedGroundedWorkroom:true,twoStageFourSidedMansard:true,threeSmallShedDormers:true,glazedWedgeStair:true,noLoftBridge:true,newModelBody:true}};
  }

  function dewbankwash(row,view){
    const A=context(row,view),{S,P}=A;
    for(let i=0;i<4;i++){
      const x=3.4+i*6.2,b=A.volume(x,x+5.8,7,24,.6,9,'brick');
      barrel(A,x-.2,x+6,6.7,24.3,9,3.9);
      shallowArch(A,b.front,.6,1.7,4.6,8.5,2.1,true);A.pane(b.back,1.2,2.4,3.4,5.7,'arch',true);
      if(i===0)A.windows(b.left,1,4,2.5,0,2.5,5.7,'rect');
      if(i===3)A.windows(b.right,1,4,2.5,0,2.5,5.7,'rect');
    }
    const spine=A.volume(4,27.5,3.4,7.1,.6,13.4,'stone');S.flat(3.7,27.8,3.1,7.4,14,P.lead);
    A.windows(spine.back,1,5,5,0,2.4,6.4,'rect');
    for(const x of[7.5,23.6])A.chimney(x,5.2,14,7);
    // Empty stone washing troughs are display geometry, without water behavior.
    for(const x of[4.2,15.4]){
      S.box(x,x+8,26.2,29.3,.6,1.7,P.stone,P.stoneR,P.stoneHi);
      S.flat(x+.45,x+7.55,26.65,28.85,1.72,P.stoneD);
      S.beam([x+1,27.7,1.8],[x+1,27.7,4.2],P.ironD,.18);S.beam([x+1,27.7,4.2],[x+2,27.7,4.2],P.ironD,.18);
    }
    return{...A.finish(),details:{originalDesign:true,fourLowParallelVaults:true,brickRangesAndRaisedStoneSpine:true,archedWashRoomFronts:true,emptyDisplayTroughs:true,newModelBody:true}};
  }

  function cloverseed(row,view){
    const A=context(row,view),{S,P}=A;
    const store=A.volume(5,27,4.3,13,.6,13,'brick');
    for(const [x,h]of[[5,6],[12.4,9],[19.8,5]])A.roof(x-.3,x+7.7,4,13.4,13,h,'y','brick');
    A.windows(store.back,1,5,3.1,0,2.6,7,'rect');A.windows(store.front,1,5,3.1,0,2.6,7,'rect');
    for(const [xa,xb]of[[3.5,9],[23,28.5]]){
      const floor=[[xa,12.8],[xb,12.8],[xb,28.5],[xa,28.5]];slab(A,floor,1,.5,P.woodHi);
      for(const y of[13.3,18.1,23,28])for(const x of[xa+.5,xb-.5]){
        S.beam([x,y,1],[x,y,9.3],P.woodR,.32);
        S.beam([x,y,7],[x===xa+.5?x+1.3:x-1.3,y,9.3],P.woodHi,.22);
      }
      const zLeft=xa<10?10.4:8.4,zRight=xa<10?8.4:10.4;
      S.poly([[xa-.3,12.4,zLeft],[xb+.3,12.4,zRight],[xb+.3,29,zRight],[xa-.3,29,zLeft]],A.K.slate(xa>10));
      for(const y of[15.5,22.5])S.box(xa+.6,xb-.6,y,y+2,1,3.7,P.woodHi,P.woodR,P.woodHi);
      S.beam([xa+.5,28,1],[xb-.5,28,1],P.woodR,.2);
    }
    S.flat(9.4,22.6,13.3,29,.5,A.K.paving);A.pane(store.front,8.6,1,4.8,8.8,'arch',true);
    A.chimney(25.4,6.5,18,4.5);
    return{...A.finish(),details:{originalDesign:true,UShapedOpenTimberStalls:true,threeSteppedStoreGables:true,opposedLowLeanToRoofs:true,realOpenCentralCourt:true,newModelBody:true}};
  }

  function thistlenursery(row,view){
    const A=context(row,view),{S,P}=A,cx=16,cy=15;
    const oct=A.polygon(cx,cy,9,.6,14,8,'stone',Math.PI/8);
    for(let i=0;i<oct.length;i++){const F=oct[i];A.pane(F,.55,3,F.length-1.1,8,'arch',true);}
    const upper=A.polygon(cx,cy,6.3,14,21,8,'whiteboard',Math.PI/8);
    for(const F of upper)A.pane(F,.4,15,F.length-.8,4.7,'ribbon',true);
    A.cone(cx,cy,7.7,.1,21,30,8,'slate');
    for(const [side,r,z]of[[-1,6.8,9.5],[1,5.1,11]]){
      const ox=side<0?8.4:23.4,oy=21,arc=Array.from({length:13},(_,i)=>{const a=side<0?Math.PI/2+i*Math.PI/12:-Math.PI/2+i*Math.PI/12;return[ox+r*Math.cos(a),oy+r*Math.sin(a)];}),plan=[...arc];
      const faces=planBlock(A,plan,.6,z,'brick');
      for(let i=0;i<faces.length-1;i++){const F=faces[i];A.pane(F,.13,2,F.length-.26,z-3.1,'ribbon',true);}
      fanRoof(A,plan,ox+side*.9,oy,z,z+4.4,false);
    }
    const vestibule=A.volume(12.8,19.2,23,29.2,.6,9.5,'whiteboard');
    A.pane(vestibule.front,.8,1.5,4.8,6.3,'arch',true);A.roof(12.4,19.6,22.7,29.5,9.5,4.2,'y','whiteboard');
    A.steps(12.4,19.6,28.7,31,1,3);
    return{...A.finish(),details:{originalDesign:true,centralOctagonalMasonryRoom:true,raisedOctagonalClerestory:true,twoUnequalHalfRoundWings:true,smallGabledEntrance:true,newModelBody:true}};
  }

  function brooktools(row,view){
    const A=context(row,view),{S,P}=A;
    const specs=[[3.4,12,5,18,12,'stone'],[10,22,12,23,17,'cedar'],[20,28.7,19,28.7,10,'brick']];
    for(let i=0;i<specs.length;i++){
      const [x0,x1,y0,y1,z,kind]=specs[i],b=A.volume(x0,x1,y0,y1,.6,z,kind),high=i===1?5.5:3;
      S.poly([[x0-.35,y0-.35,z+high],[x1+.35,y0-.35,z+high],[x1+.35,y1+.35,z],[x0-.35,y1+.35,z]],A.K.slate(i!==1));
      for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,z],[x,y1,z],[x,y0,z+high]],A.mat(kind,nx,0));
      for(const F of[b.front,b.back])A.windows(F,1,i===1?3:2,3.2,0,2.7,i===1?9:5.7,'mullion');
      for(const F of[b.left,b.right])A.windows(F,1,2,3,0,2.5,6,'rect');
      if(kind==='cedar')for(const F of Object.values(b))timber(A,F,1,16,Math.max(2,Math.floor(F.length/3.5)));
    }
    const hood=A.volume(3.5,8.8,21,28,.6,5.8,'wood');
    S.poly([[3.1,20.5,7.3],[9.2,20.5,7.3],[9.2,28.4,5.8],[3.1,28.4,5.8]],A.K.slate(false));
    A.pane(hood.front,.7,1.1,3.9,3.6,'rect',true);A.steps(12,18,23,28.5,1.4,4);
    A.chimney(18.4,14,20,6);
    return{...A.finish(),details:{originalDesign:true,threeDogLegStoneAndTimberRanges:true,threeStaggeredSkillionRoofs:true,separateLowToolHood:true,noButterflyValleys:true,newModelBody:true}};
  }

  function hazeldairy(row,view){
    const A=context(row,view),{S,P}=A;
    const cross=A.volume(4.2,27.8,4.8,14,.6,11.8,'whiteplaster'),stem=A.volume(12,21,13.5,27.2,.6,9.6,'brick');
    hipPlateau(A,3.7,28.3,4.3,14.5,11.8,5.4,3.5,'tile');
    hipPlateau(A,11.5,21.5,13,27.7,9.6,4,3.8,'tile');
    for(const F of[cross.back,cross.front])A.windows(F,1,5,2.8,0,2.7,6.3,'arch');
    for(const F of[cross.left,cross.right])roundWindow(A,F,F.length/2,6.5,2.4,true);
    for(const F of[stem.left,stem.right])A.windows(F,1,3,2.8,0,2.5,5.4,'rect');
    A.pane(stem.front,2.3,1.4,4.2,6.9,'arch',true);
    // The squat round tanks are closed display solids, not a new water system.
    for(const [cx,cy,rad,z]of[[6.8,22,4.2,7.3],[26.2,22.5,3.4,9]]){
      A.polygon(cx,cy,rad,.6,z,20,'whiteMetal');
      lathe(A,cx,cy,[[z,rad],[z+1.5,rad*.85],[z+2.8,rad*.45],[z+3.2,.2]],'lead',20);
      S.beam([cx+rad*.65,cy,.8],[cx+rad*.65,cy,z+1.5],P.ironD,.16);
      for(let h=2;h<z;h+=1.2)S.beam([cx+rad*.65,cy-.7,h],[cx+rad*.65,cy+.7,h],P.ironD,.13);
    }
    const cold=[[22,9],[28,9],[30,13],[28,16.8],[22,16.8]],faces=planBlock(A,cold,.6,7.7,'stone');fanRoof(A,cold,25.5,12.8,7.7,10.5,false);
    for(const F of faces)if(F.length>4)A.pane(F,.6,2.5,F.length-1.2,3,'ribbon',true);
    A.steps(12,21,27,30.3,1.1,3);
    return{...A.finish(),details:{originalDesign:true,lowTPlanDairyHall:true,flatRidgeFourHipTileRoofs:true,twoSquatTankDomes:true,cantedColdRoom:true,noProductionRulesAdded:true,newModelBody:true}};
  }

  const MODELS=Object.freeze({asterpost,barleybake,honeygrocer,foxengine,mallowsew,dewbankwash,cloverseed,thistlenursery,brooktools,hazeldairy});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave040 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave040 four world rotations only');if(!MODELS[id])throw Error('wave040 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave040 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture040=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
