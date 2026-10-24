/* GPT-042 wave14: original English town works and craft buildings.
 * Authored world-space geometry using the unchanged art634 kit.
 * Fictional appearances only; no real-landmark, photograph or game-rule claim.
 * Shared local drawing helpers are inherited from GPT-041; all ten model
 * bodies below are newly authored forms. No bitmap or screen-space decals. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "alderjoinery",
    "nm": "榿溪木作院",
    "en": "Alderbrook Joinery Court",
    "v": 680,
    "shape": "low-E-plan-hip-office-three-unequal-gable-fingers-two-open-courts",
    "design": "低E形、後四坡辦公脊、三根不等長山牆工房、兩個真開放院、高側窗及寬材料門",
    "distinctionFromPublished130": "Crossness封閉三跨及樺庭H形雙桶拱不同",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "mereweigh",
    "nm": "米爾稱量所",
    "en": "Mereford Weigh House",
    "v": 684,
    "shape": "low-double-chamfer-weigh-room-wide-hip-tall-rear-monopitch-ledger",
    "design": "低長觀測室雙前削角、寬四坡簷與繞角窗、窄高後帳房陡單坡、低室外秤台",
    "distinctionFromPublished130": "非Settle架高信號樓或翠菀入口小五角",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rushfordlav",
    "nm": "蘆橋公共盥洗亭",
    "en": "Rushford Public Conveniences",
    "v": 688,
    "shape": "low-cruciform-four-outward-monopitch-wings-square-louver-hip",
    "design": "低十字四短翼、兩處凹入入口、向外單坡翼頂、中央矮方百葉四坡帽、高縫窗",
    "distinctionFromPublished130": "非榆岬高Y形及八角育苗房",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "beckvalve",
    "nm": "溪石閥房",
    "en": "Beckstone Valve House",
    "v": 692,
    "shape": "single-shallow-lead-barrel-stone-hall-four-stepped-buttresses",
    "design": "低矩形石機房、兩側各兩階梯扶壁、單一寬淺鉛桶拱、低四坡端門房、高圓端窗及深通風口",
    "distinctionFromPublished130": "非露岸四條平行桶拱或Cromer架高滑道",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "woldswitch",
    "nm": "原丘配電小站",
    "en": "Woldwick Electricity House",
    "v": 696,
    "shape": "staggered-high-hip-and-low-parapet-brick-blocks-solid-equipment-link",
    "design": "斜錯位高低矩形磚樓、寬低實設備連接、高樓陡四坡、低樓平女兒牆、深百葉設備門",
    "distinctionFromPublished130": "非雙圓鼓、外張方塔或細玻璃橋",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "elmstone",
    "nm": "榆原石匠棚",
    "en": "Elmfield Mason’s Lodge",
    "v": 700,
    "shape": "four-stone-pier-open-cutting-shed-wide-hip-rear-monopitch-tool-strip",
    "design": "四粗石柱支承真開放前棚、寬四坡板岩頂、低封閉後工具帶單坡、兩矮窗及側門",
    "distinctionFromPublished130": "非Penshaw無頂柱廊、Campden山牆拱廊、Dunster八角棚",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "fencooper",
    "nm": "芬溝箍桶坊",
    "en": "Fenditch Cooperage",
    "v": 704,
    "shape": "tall-single-gambrel-stave-store-offset-low-steam-shed-open-gap",
    "design": "窄高兩層木板庫雙折坡、後斜錯低蒸汽工房單坡與短方煙道、真開口間隙無橋、上卸料口下百葉",
    "distinctionFromPublished130": "非Net Shops三山牆或山楂架高雙折橋",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "larkprint",
    "nm": "雲雀印刷所",
    "en": "Larkfield Printing Rooms",
    "v": 708,
    "shape": "inverted-T-flat-parapet-typesetting-block-rear-gabled-press-hall",
    "design": "寬矮兩層平女兒牆前排字房、深後中央單層印刷廳成倒T、高山牆與短矩形屋頂燈、密短前窗及寬紙門",
    "distinctionFromPublished130": "非rookhall後殿削角或榛乳四坡與筒罐",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rowdenmortuary",
    "nm": "羅登鎮殮房",
    "en": "Rowden Mortuary Lodge",
    "v": 712,
    "shape": "unequal-square-hip-pavilions-recessed-low-lead-entrance",
    "design": "低三段磚屋、不等深兩方亭陡四坡、凹入更低平鉛中央入口、高三連窄拱窗與實雙門扇窗",
    "distinctionFromPublished130": "非樺庭長工房雙院或蕨庭玻璃六角亭",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "cressice",
    "nm": "水芥儲冰舍",
    "en": "Cresswick Ice Store",
    "v": 716,
    "shape": "half-buried-earth-banked-vault-brick-arch-small-gabled-receiving-room",
    "design": "低半埋庫、模型自身厚側後土岸與覆土低拱、磚拱前臉、小矩形板岩山牆收貨房、短方頂通風口",
    "distinctionFromPublished130": "非Castle Cary外露蜂巢或Lime Kilns多開孔；不改地形及冷藏模擬",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English town-works design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
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
    if(!root.__wave042GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave042GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave042:1});
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
  // All helpers below are private to GPT-042 and operate in world coordinates.

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

  // New local helpers only assemble ordinary convex world-space surfaces.
  function framedPolygon(A,F,points,lit=true){
    const {S,P}=A,cx=points.reduce((n,p)=>n+p[0],0)/points.length,cz=points.reduce((n,p)=>n+p[1],0)/points.length;
    const inner=points.map(p=>[cx+(p[0]-cx)*.86,cz+(p[1]-cz)*.92]);
    S.poly(points.map(p=>F.point(p[0],.15,p[1])),P.stoneHi);
    S.poly(inner.map(p=>F.point(p[0],.27,p[1])),lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    for(let i=0;i<inner.length;i++){const j=(i+1)%inner.length;S.beam(F.point(inner[i][0],.32,inner[i][1]),F.point(inner[j][0],.32,inner[j][1]),P.frame,.16);}
  }
  function orientedRect(cx,cy,angle,s0,s1,half){
    const ux=Math.cos(angle),uy=Math.sin(angle),vx=-uy,vy=ux,at=(s,t)=>[cx+ux*s+vx*t,cy+uy*s+vy*t];
    return{points:[at(s0,-half),at(s1,-half),at(s1,half),at(s0,half)],at,ux,uy,vx,vy};
  }
  function orientedHip(A,R,s0,s1,half,z,rise){
    const {S,P}=A,q=R.points,inset=Math.min(half,(s1-s0)*.27),a=R.at(s0+inset,0),b=R.at(s1-inset,0);
    const pieces=[[[q[0],q[1],b,a],[-R.vx,-R.vy]],[[q[1],q[2],b],[R.ux,R.uy]],[[q[2],q[3],a,b],[R.vx,R.vy]],[[q[3],q[0],a],[-R.ux,-R.uy]]];
    for(const [poly,n]of pieces)S.poly(poly.map(p=>[...p,p===a||p===b?z+rise:z]),A.K.slate(A.dark(...n)));
    S.beam([...a,z+rise+.06],[...b,z+rise+.06],P.lead,.3);
  }
  function faceSolid(A,F,u0,u1,d0,d1,z0,z1){
    const {S,P}=A,a=F.point(u0,d0,z0),b=F.point(u1,d0,z0),c=F.point(u1,d1,z0),d=F.point(u0,d1,z0),up=p=>[p[0],p[1],z1];
    S.poly([up(a),up(b),up(c),up(d)],P.stoneHi);
    for(const [p,q]of[[a,b],[b,c],[c,d],[d,a]])S.poly([p,q,up(q),up(p)],A.dark(F.nx,F.ny)?P.stoneR:P.stone);
  }
  function worldBand(A,F,z,depth){faceSolid(A,F,-.2,F.length+.2,0,depth,z,z+.65);}
  function ellipsePlan(cx,cy,rx,ry,n=24){return Array.from({length:n},(_,j)=>{const t=j*2*Math.PI/n;return[cx+rx*Math.cos(t),cy+ry*Math.sin(t)];});}

  // Wave14-only assemblies. Every surface remains in world coordinates.
  function hipRoof(A,x0,x1,y0,y1,z,rise,alongX=true){
    const R=orientedRect((x0+x1)/2,(y0+y1)/2,alongX?0:Math.PI/2,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2);
    orientedHip(A,R,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2,z,rise);
  }
  function monoRoof(A,x0,x1,y0,y1,z,rise,highSide,kind='brick'){
    const {S,P}=A,q=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],high=highSide==='back'?[1,1,0,0]:highSide==='front'?[0,0,1,1]:highSide==='left'?[1,0,0,1]:[0,1,1,0],zs=high.map(v=>z+rise*v);
    const normal=highSide==='back'?[0,1]:highSide==='front'?[0,-1]:highSide==='left'?[1,0]:[-1,0];
    S.poly(q.map((p,i)=>[...p,zs[i]+.16]),A.K.slate(A.dark(...normal)));
    for(let i=0;i<4;i++){
      const j=(i+1)%4,nx=[0,1,0,-1][i],ny=[-1,0,1,0][i];
      if(high[i]||high[j])S.poly([[...q[i],z],[...q[j],z],[...q[j],zs[j]],[...q[i],zs[i]]],A.mat(kind,nx,ny));
      S.beam([...q[i],zs[i]+.18],[...q[j],zs[j]+.18],P.lead,.22);
    }
  }
  function solidDoor(A,F,u,z,w,h,kind='wood'){
    const {P}=A;F.panel(u-.28,u+w+.28,z-.1,z+h+.3,P.stoneHi,.13);
    F.panel(u,u+w,z,z+h,A.mat(kind,F.nx,F.ny),.24);
    for(const xx of[u+.14,u+w/2,u+w-.14])F.panel(xx-.08,xx+.08,z+.12,z+h-.12,P.woodD,.35);
    for(const zz of[z+h*.32,z+h*.7])F.panel(u+.18,u+w-.18,zz-.09,zz+.09,P.woodR,.35);
    for(const xx of[u+w/2-.25,u+w/2+.25])F.panel(xx-.08,xx+.08,z+h*.45,z+h*.45+.45,P.ironD,.42);
  }
  function louver(A,F,u,z,w,h){
    const {S,P}=A;
    // Recessed dark backing plus projecting slats and jamb depth, never emissive.
    F.panel(u-.25,u+w+.25,z-.25,z+h+.25,P.stoneR,.12);F.panel(u,u+w,z,z+h,P.ironD,.2);
    for(const x of[u,u+w])S.poly([F.point(x,.2,z),F.point(x,.65,z),F.point(x,.65,z+h),F.point(x,.2,z+h)],P.stoneD);
    for(let zz=z+.16;zz<z+h-.16;zz+=.72)S.poly([F.point(u+.16,.27,zz+.44),F.point(u+w-.16,.27,zz+.44),F.point(u+w-.16,.68,zz+.08),F.point(u+.16,.68,zz+.08)],A.dark(F.nx,F.ny)?P.ironD:P.ironHi);
    F.panel(u-.26,u+w+.26,z+h,z+h+.32,P.stoneHi,.7);
  }
  function stoneBarrel(A,x0,x1,y0,y1,z,rise,roofKind='lead'){
    const {S,P}=A,at=t=>[x0+(x1-x0)*t,z+rise*Math.sin(t*Math.PI)];
    for(let j=0;j<20;j++){
      const a=at(j/20),b=at((j+1)/20),nx=a[1]-b[1];
      S.poly([[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],A.mat(roofKind,nx,0));
      for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[a[0],y,z],[b[0],y,z],[b[0],y,b[1]],[a[0],y,a[1]]],A.mat('stone',0,ny));
    }
    for(let j=0;j<=5;j++)for(let i=0;i<20;i++){
      const y=y0+(y1-y0)*j/5,a=at(i/20),b=at((i+1)/20);S.beam([a[0],y,a[1]+.08],[b[0],y,b[1]+.08],P.lead,.16);
    }
  }

/* WAVE042 NEW AUTHORED MODELS */
  function alderjoinery(row,view){
    const A=context(row,view),{S,P}=A;
    // An actual E: only the back office spine joins the three unequal fingers.
    const spine=A.volume(3.5,28.5,3.7,10.2,.6,13.4,'brick');
    hipRoof(A,3.1,28.9,3.3,10.6,13.4,4.5,true);
    A.windows(spine.back,1,6,5,0,2.5,5.7,'rect');
    for(const F of[spine.left,spine.right])A.windows(F,1,2,5,0,1.6,5.7,'rect');
    for(const [x0,x1,y1,z,rise]of[[3.5,8.9,28.2,11.8,4.6],[13.6,18.7,23.3,10.5,4.2],[23.1,28.5,26.2,14,4.9]]){
      const wing=A.volume(x0,x1,10.2,y1,.6,z,'brick');
      A.roof(x0-.28,x1+.28,10,y1+.32,z,rise,'y','brick');
      for(const F of[wing.left,wing.right]){
        A.windows(F,1,4,z-4.3,0,2.1,2.7,'ribbon');
        for(const u of[.55,F.length-.55])F.panel(u-.2,u+.2,.7,z,P.stoneR,.18);
      }
      solidDoor(A,wing.front,.65,.7,x1-x0-1.3,6.2);
      A.pane(wing.front,1.15,z+.6,x1-x0-2.3,1.5,'rect',true);
      band(A,wing.front,z-.75,.35);
    }
    // Both courts stay roofless; thin stock racks do not span either opening.
    for(const [x,y,len]of[[10.2,13.2,5.9],[20,13.5,8]]){
      for(const h of[1.05,1.65,2.25])S.box(x,x+1.25,y,y+len,h,h+.3,P.woodHi,P.woodR,P.woodHi);
      for(const yy of[y+.5,y+len-.5])S.box(x+.35,x+.75,yy,yy+.35,.6,2.55,P.woodR,P.woodR,P.wood);
    }
    for(const [x0,x1]of[[9.3,13.2],[19.2,22.6]]){
      const F=face(A,[x0,10.25],[x1,10.25],0,1);solidDoor(A,F,.6,.7,F.length-1.2,6.4);A.pane(F,.6,8,F.length-1.2,2.2,'ribbon',true);
    }
    A.chimney(26.5,6.7,17,3.3);
    return{...A.finish(),details:{originalDesign:true,lowEPlan:true,hippedRearOfficeSpine:true,threeUnequalGableFingers:true,twoRealOpenCourts:true,highSideLightsAndWideMaterialsDoors:true,newModelBody:true}};
  }

  function mereweigh(row,view){
    const A=context(row,view),{S,P}=A;
    const plan=[[3.7,12.4],[28.3,12.4],[28.3,20.7],[24.8,24.2],[7.2,24.2],[3.7,20.7]],walls=planBlock(A,plan,.6,10.7,'yellowbrick');
    // Both front corners are cut from the whole room and its overhanging hip.
    const cx=16,cy=18.3,out=plan.map(p=>[cx+(p[0]-cx)*1.055,cy+(p[1]-cy)*1.09]),inner=plan.map(p=>[cx+(p[0]-cx)*.54,cy+(p[1]-cy)*.43]);
    for(let i=0;i<out.length;i++){
      const j=(i+1)%out.length,F=walls[i];S.poly([[...out[i],10.8],[...out[j],10.8],[...inner[j],15.5],[...inner[i],15.5]],A.K.slate(A.dark(F.nx,F.ny)));
      S.beam([...out[i],10.87],[...out[j],10.87],P.lead,.3);S.beam([...out[i],10.87],[...inner[i],15.57],P.lead,.21);
    }
    S.poly(inner.map(p=>[...p,15.5]),P.lead);
    for(const i of[1,2,3,4,5]){
      const F=walls[i],bays=i===3?5:i===1||i===5?2:1;
      A.windows(F,1,bays,4,0,(F.length-1)/bays-.36,4.8,'ribbon');band(A,F,9.55,.42);
    }
    const ledger=A.volume(19.2,25.7,3.7,12.4,.6,17.2,'brick');
    monoRoof(A,18.8,26.1,3.3,12.6,17.2,7.1,'back');
    A.windows(ledger.left,2,2,3.3,8.2,1.6,4.4,'rect');
    A.windows(ledger.right,2,2,3.3,8.2,1.6,4.4,'rect');
    A.pane(ledger.back,2.1,11.8,2.3,4.1,'rect',true);solidDoor(A,ledger.back,1.7,.7,3.1,6.6);
    A.pane(walls[0],3.5,4,3.8,4.8,'ribbon',true);solidDoor(A,walls[0],9,.7,3,6.5);
    // Low metal weigh platform, not an elevated signal cabin or added service.
    S.box(6,18.1,26.1,29.8,.55,1.25,P.iron,P.ironD,P.lead);
    for(const x of[6.8,9.1,11.4,13.7,16,17.3])S.beam([x,26.3,1.31],[x,29.6,1.31],P.ironD,.16);
    S.box(7.1,9.6,24.5,25.6,.6,2.25,P.iron,P.ironD,P.ironHi);
    return{...A.finish(),details:{originalDesign:true,lowDoubleChamferObservationRoom:true,wideFacetedHipEaves:true,wrapCornerWindows:true,tallNarrowRearLedgerStore:true,steepRearMonopitch:true,lowOutdoorWeighPlatform:true,newModelBody:true}};
  }

  function rushfordlav(row,view){
    const A=context(row,view),{S,P}=A;
    const core=A.volume(11.2,20.8,11.2,20.8,.6,11.4,'brick');
    // West and east wings fall outwards. There is no Y-plan or octagonal core.
    for(const [x0,x1,highSide]of[[3.9,11.2,'right'],[20.8,28.1,'left']]){
      const wing=A.volume(x0,x1,12,20,.6,8.1,'brick');monoRoof(A,x0-.25,x1+.1,11.75,20.25,8.1,3,highSide);
      for(const F of[wing.front,wing.back])A.windows(F,1,3,5.65,0,1.2,1.5,'rect');
      A.windows(highSide==='right'?wing.left:wing.right,1,3,5.65,0,1.2,1.5,'rect');
    }
    const south=[[12,20.8],[20,20.8],[20,28.1],[17.7,28.1],[17.7,26.25],[14.3,26.25],[14.3,28.1],[12,28.1]];
    const north=[[12,3.9],[14.3,3.9],[14.3,5.75],[17.7,5.75],[17.7,3.9],[20,3.9],[20,11.2],[12,11.2]];
    for(const [plan,y0,y1,highSide,doorIndex]of[[south,20.8,28.1,'back',4],[north,3.9,11.2,'front',2]]){
      const F=planBlock(A,plan,.6,8.1,'brick',false);monoRoof(A,11.75,20.25,y0-.16,y1+.16,8.1,3,highSide);
      solidDoor(A,F[doorIndex],.4,.65,F[doorIndex].length-.8,6.1);
      for(const f of F)if(f.length>5)A.windows(f,1,2,5.8,0,1.6,1.4,'rect');
      // The notch walls and porch floor are actual depth, not dark painted panels.
      S.flat(14.3,17.7,highSide==='back'?26.25:3.9,highSide==='back'?28.1:5.75,.62,P.stoneR);
    }
    const cap=A.volume(12.9,19.1,12.9,19.1,11.4,14.1,'stone');
    for(const F of Object.values(cap))louver(A,F,.65,11.8,F.length-1.3,1.7);
    hipRoof(A,12.35,19.65,12.35,19.65,14.2,3.7,true);
    for(const F of Object.values(core))band(A,F,10.6,.3);
    return{...A.finish(),details:{originalDesign:true,lowCruciformFourShortWings:true,twoRecessedEntranceNotches:true,outwardMonopitchWingRoofs:true,lowSquareLouveredHipCap:true,highSlitWindows:true,newModelBody:true}};
  }

  function beckvalve(row,view){
    const A=context(row,view),{S,P}=A;
    const main=A.volume(7.1,24.9,4,23.5,.6,11.2,'stone');
    stoneBarrel(A,6.8,25.2,3.75,23.7,11.2,5.1,'lead');
    for(const [F,x0,x1]of[[main.left,4.9,7.1],[main.right,24.9,27.1]]){
      for(const y of[8.4,18.7]){
        S.box(x0,x1,y-1.1,y+1.1,.6,3.4,P.stone,P.stoneR,P.stoneHi);
        S.box(x0+(x0<7?.55:0),x1-(x0<7?0:.55),y-.9,y+.9,3.4,6.5,P.stone,P.stoneR,P.stoneHi);
        S.box(x0+(x0<7?1.1:0),x1-(x0<7?0:1.1),y-.7,y+.7,6.5,9.8,P.stone,P.stoneR,P.stoneHi);
      }
      for(const u of[1.8,8.7,15.2])louver(A,F,u,6.2,2.5,3.1);
      band(A,F,10.55,.3);
    }
    for(const F of[main.front,main.back])roundWindow(A,F,F.length/2,12.65,2.15,true);
    const entry=A.volume(11.1,20.9,23.5,29,.6,7.2,'stone');hipRoof(A,10.65,21.35,23.1,29.45,7.25,4.1,true);
    solidDoor(A,entry.front,2.2,.7,5.4,5.9);
    for(const F of[entry.left,entry.right]){
      // Paired small lights are inside one physical vestibule opening per side.
      F.panel(.7,4.7,3,5.8,P.stoneHi,.12);
      A.pane(F,.95,3.25,1.5,2.3,'rect',true);A.pane(F,2.85,3.25,1.5,2.3,'rect',true);
    }
    A.steps(12,20,29.1,30.55,.7,3);
    return{...A.finish(),details:{originalDesign:true,squatStoneMachineRoom:true,singleBroadShallowLeadBarrel:true,twoSteppedButtressesEachLongSide:true,lowHippedEndEntry:true,highRoundEndWindows:true,deepRectangularVents:true,newModelBody:true}};
  }

  function woldswitch(row,view){
    const A=context(row,view),{S,P}=A;
    const high=A.volume(4.3,15.5,3.8,15.5,.6,22.7,'brick');hipRoof(A,3.85,15.95,3.35,15.95,22.7,8.8,true);
    const low=A.volume(19,28.9,18.8,28.8,.6,10.6,'brick');S.flat(18.8,29.1,18.6,29,10.95,P.lead);A.parapet(18.8,29.1,18.6,29,10.95,false);
    const link=A.volume(10.7,23.1,12.1,23.2,.6,7.9,'brick');monoRoof(A,10.45,23.35,11.9,23.45,7.9,2.7,'back');
    for(const F of[high.back,high.left,high.right]){
      A.windows(F,1,3,17,0,1.9,3.7,'rect');louver(A,F,2.6,3.1,5.8,10.7);band(A,F,21.6,.42);
    }
    A.windows(high.front,1,3,17,0,1.9,3.7,'rect');
    louver(A,low.front,1.3,1.2,7.3,7.6);louver(A,low.right,1.3,1.2,7.2,7.6);
    for(const F of[low.back,low.left])A.windows(F,1,2,6.3,0,1.8,2.3,'rect');
    louver(A,link.front,1.8,1.1,6.2,5.4);louver(A,link.left,2.1,1.1,5.1,5.4);
    // A broad opaque equipment bay connects the staggered blocks at ground level.
    for(const [F,z]of[[high.back,1.5],[high.left,1.5],[low.front,1.5]])band(A,F,z,.3);
    S.box(25.6,27.8,20.6,22.8,11,12.1,P.iron,P.ironD,P.lead);
    return{...A.finish(),details:{originalDesign:true,diagonallyStaggeredUnequalBrickBlocks:true,steepHighHipRoof:true,lowFlatParapetBlock:true,broadSolidEquipmentConnector:true,deepLouveredEquipmentDoors:true,noGlazedBridge:true,newModelBody:true}};
  }

  function elmstone(row,view){
    const A=context(row,view),{S,P}=A;
    const tools=A.volume(5.2,26.8,3.8,11.4,.6,7.1,'stone');monoRoof(A,4.85,27.15,3.45,11.65,7.1,3.5,'back','stone');
    // Exactly two squat paired-light windows in the rear tool strip.
    for(const u of[3.1,13.5]){
      tools.back.panel(u-.3,u+4.7,3.5,6.15,P.stoneHi,.13);
      A.pane(tools.back,u,3.8,1.85,2.05,'rect',true);A.pane(tools.back,u+2.55,3.8,1.85,2.05,'rect',true);
    }
    solidDoor(A,tools.right,2,.7,3.3,4.6);
    for(const u of[2.15,3.85])A.pane(tools.right,u,5.6,1.3,1.05,'rect',true);
    // Four and only four substantial piers support the genuinely open shed.
    for(const x of[5.8,26.2])for(const y of[12.5,26.5]){
      S.box(x-1.3,x+1.3,y-1.3,y+1.3,.6,1.6,P.stone,P.stoneR,P.stoneHi);
      A.volume(x-.95,x+.95,y-.95,y+.95,1.6,10.4,'stone');
      S.box(x-1.2,x+1.2,y-1.2,y+1.2,10.4,11.15,P.stone,P.stoneR,P.stoneHi);
    }
    for(const y of[12.5,26.5])S.beam([4.6,y,11],[27.4,y,11],P.woodR,.65);
    for(const x of[5.8,26.2])S.beam([x,11.3,11],[x,27.7,11],P.woodR,.65);
    for(const [x,dx]of[[5.8,1],[26.2,-1]])for(const [y,dy]of[[12.5,1],[26.5,-1]]){
      S.beam([x,y,8.7],[x+dx*2.7,y,11],P.woodR,.35);S.beam([x,y,8.7],[x,y+dy*2.7,11],P.woodR,.35);
    }
    hipRoof(A,3.8,28.2,10.65,28.65,11.3,7.6,true);
    // Separate cutting beds and rough stone blocks stay below the open sightlines.
    for(const [x0,x1,y]of[[9,14,18],[18,23,22]]){
      S.box(x0,x1,y,y+2.3,.6,1.2,P.stoneD,P.stoneD,P.stoneR);
      S.box(x0-.2,x1+.2,y-.2,y+2.5,1.2,2.2,P.stone,P.stoneR,P.stoneHi);
      S.box(x0+.8,x0+2.7,y+.3,y+1.9,2.2,3.6,P.stone,P.stoneD,P.stoneHi);
    }
    return{...A.finish(),details:{originalDesign:true,fourThickStonePiers:true,trueOpenFrontCuttingShed:true,singleBroadSlateHipRoof:true,lowEnclosedRearToolStrip:true,separateMonopitchToolRoof:true,twoSquatPairedLightWindowsAndSideDoor:true,newModelBody:true}};
  }

  function fencooper(row,view){
    const A=context(row,view),{S,P}=A,x0=3.9,x1=14.3,y0=10.2,y1=28.1,z=23.8;
    const front=face(A,[x0,y1],[x1,y1],0,1),back=face(A,[x1,y0],[x0,y0],0,-1),left=face(A,[x0,y0],[x0,y1],-1,0),right=face(A,[x1,y1],[x1,y0],1,0);
    for(const F of[back,left,right])S.poly([F.point(0,0,.6),F.point(F.length,0,.6),F.point(F.length,0,z),F.point(0,0,z)],A.mat('cedar',F.nx,F.ny));
    // The upper loading aperture is omitted from the wall and has real reveals.
    for(const [a,b,c,d]of[[0,3,.6,z],[7.4,10.4,.6,z],[3,7.4,.6,14.4],[3,7.4,21.5,z]])front.panel(a,b,c,d,A.mat('cedar',0,1),0);
    for(const u of[3,7.4])S.poly([front.point(u,0,14.4),front.point(u,-1.2,14.4),front.point(u,-1.2,21.5),front.point(u,0,21.5)],P.woodD);
    for(const h of[14.4,21.5])S.poly([front.point(3,0,h),front.point(7.4,0,h),front.point(7.4,-1.2,h),front.point(3,-1.2,h)],P.woodR);
    front.panel(3,7.4,14.4,21.5,P.woodD,-1.2);
    for(const [u0,u1]of[[1.6,2.9],[7.5,8.8]])front.panel(u0,u1,14.4,21.5,A.mat('cedar',0,1),.22);
    S.beam([9.1,28.4,22.4],[9.1,30,22.4],P.woodR,.4);S.beam([9.1,29.8,22.4],[9.1,29.8,19.3],P.ironD,.14);
    const profile=[[3.45,23.8],[5.45,30.6],[9.1,34.1],[12.75,30.6],[14.75,23.8]];
    for(let j=0;j<4;j++){
      const a=profile[j],b=profile[j+1];S.poly([[a[0],9.8,a[1]],[b[0],9.8,b[1]],[b[0],28.5,b[1]],[a[0],28.5,a[1]]],A.K.slate(A.dark(j<2?-1:1,0)));
      for(const [y,ny]of[[10.2,-1],[28.1,1]])S.poly([[a[0],y,z],[b[0],y,z],[b[0],y,b[1]],[a[0],y,a[1]]],A.mat('cedar',0,ny));
    }
    for(const [x,h]of profile.slice(1,4))S.beam([x,9.8,h+.08],[x,28.5,h+.08],P.lead,.24);
    for(const F of[left,right]){A.windows(F,1,3,16.2,0,2.3,4.1,'rect');for(const u of[1.4,7.6,13.8])louver(A,F,u,3.3,2.6,6.8);band(A,F,12.4,.32);}
    A.windows(back,2,2,4,11.7,2.3,4.9,'rect');louver(A,front,2,3,6.4,6.5);
    const steam=A.volume(19.2,28.6,3.9,15.4,.6,8.3,'brick');monoRoof(A,18.85,28.95,3.55,15.75,8.3,4.6,'back');
    for(const F of[steam.left,steam.right])A.windows(F,1,2,4.4,0,2.1,2.6,'rect');solidDoor(A,steam.front,2.4,.7,4.6,6.2);
    A.volume(24.9,26.8,6.1,8.1,10.8,17.1,'brick');S.box(24.6,27.1,5.8,8.4,17.1,17.7,P.stone,P.stoneR,P.ink);
    // The two buildings do not touch: an open strip remains between x=14.75 and 18.85.
    for(const [x,y]of[[22,23],[26,20]]){
      A.K.cylinder(S,x,y,.6,4.6,1.3,1.15,P.wood,P.woodR,P.woodHi,12);
      for(const h of[1.2,3.8])for(let j=0;j<12;j++){const a=j*Math.PI/6,b=(j+1)*Math.PI/6;S.beam([x+1.3*Math.cos(a),y+1.3*Math.sin(a),h],[x+1.3*Math.cos(b),y+1.3*Math.sin(b),h],P.ironD,.16);}
    }
    return{...A.finish(),details:{originalDesign:true,singleTallTwoStoreyTimberStaveStore:true,twoSlopeGambrelRoof:true,realUpperLoadingApertureAndLowerLouvers:true,rearOffsetLowSteamWorkshop:true,shortSquareFlue:true,trueUnbridgedOpenGap:true,newModelBody:true}};
  }

  function larkprint(row,view){
    const A=context(row,view),{S,P}=A;
    const press=A.volume(11.1,20.9,3.8,20.5,.6,11.5,'brick');A.roof(10.75,21.25,3.45,20.7,11.5,9,'y','brick');
    for(const F of[press.left,press.right])A.windows(F,1,4,7.4,0,2.1,2.6,'rect');
    solidDoor(A,press.back,2.1,.7,5.6,7.1);A.pane(press.back,3.5,11.8,2.8,3.4,'rect',true);
    const front=A.volume(3.8,28.2,20.5,28.5,.6,18.2,'brick');S.flat(3.55,28.45,20.25,28.75,18.55,P.lead);A.parapet(3.55,28.45,20.25,28.75,18.55,false);
    A.windows(front.front,2,7,3.6,8.1,2.35,3.8,'rect');
    for(const F of[front.left,front.right])A.windows(F,2,2,3.6,8.1,2.35,3.8,'rect');
    for(const F of[front.front,front.left,front.right]){band(A,F,9.4,.42);band(A,F,17.2,.35);}
    // The short roof lantern rises from the central rear gable, not a full sawtooth.
    const lamp=A.volume(13.9,18.1,8.2,13.8,17.2,22.3,'stone');
    for(const F of[lamp.left,lamp.right])A.windows(F,1,2,19.7,0,1.8,1.9,'rect');
    for(const F of[lamp.front,lamp.back])A.pane(F,.6,20.1,3,1.5,'ribbon',true);
    S.flat(13.5,18.5,7.8,14.2,22.7,P.lead);
    for(const x of[14.6,16,17.4])S.beam([x,7.8,22.77],[x,14.2,22.77],P.ironD,.13);
    // A paper loading threshold and two stacks remain outside the rear hall.
    S.box(13,19,2.1,3.7,.6,1.1,P.stone,P.stoneR,P.stoneHi);
    for(const [x,y]of[[24.1,15.1],[25.7,16.9]]){
      S.box(x,x+1.8,y,y+1.6,.6,1.1,P.wood,P.woodR,P.woodHi);S.box(x+.1,x+1.7,y+.1,y+1.5,1.1,2.4,P.paper,P.stoneR,P.paper);
    }
    return{...A.finish(),details:{originalDesign:true,invertedTPlan:true,wideSquatTwoStoreyTypesettingFront:true,flatParapetFrontRoof:true,deepSingleStoreyCentralPressHall:true,highRearGableAndShortRooflight:true,denseShortFrontWindowsAndWidePaperDoor:true,newModelBody:true}};
  }

  function rowdenmortuary(row,view){
    const A=context(row,view),{S,P}=A;
    const left=A.volume(2.9,12.9,13.2,23.2,.6,10.6,'brick');hipRoof(A,2.55,13.25,12.85,23.55,10.6,7.2,true);
    const right=A.volume(17,29.1,11.1,23.2,.6,12.2,'brick');hipRoof(A,16.65,29.45,10.75,23.55,12.2,8.1,true);
    // Two genuinely square pavilions differ in depth and height; the middle is solid.
    for(const [body,z]of[[left,10.6],[right,12.2]]){
      for(const F of[body.front,body.back])A.windows(F,1,3,z-5.7,0,1.65,4.2,'arch');
      for(const F of[body.left,body.right])A.windows(F,1,3,z-5.7,0,1.5,4.2,'arch');
      for(const F of Object.values(body)){band(A,F,2.1,.3);band(A,F,z-1,.35);}
    }
    const entry=A.volume(12.9,17,13.8,20.6,.6,7.25,'brick');S.flat(12.65,17.25,13.55,20.85,7.6,P.lead);
    solidDoor(A,entry.front,.55,.75,3,4.65);
    shallowArch(A,entry.front,.55,5.65,3,1.3,.6,true);
    A.pane(entry.back,.65,4.6,2.8,1.7,'ribbon',true);
    for(const x of[12.8,17.1])S.box(x-.22,x+.22,20.4,20.95,.65,7.25,P.stone,P.stoneR,P.stoneHi);
    A.steps(13.2,16.7,20.8,24.6,.85,4);
    return{...A.finish(),details:{originalDesign:true,lowThreePartBrickForm:true,twoUnequalDepthSquarePavilions:true,steepFourHipPavilionRoofs:true,recessedLowerFlatLeadEntrance:true,highTripleNarrowArchedWindows:true,solidDoubleLeavesAndFanlight:true,noThroughCourt:true,newModelBody:true}};
  }

  function cressice(row,view){
    const A=context(row,view),{S,P}=A,x0=7.6,x1=24.4,y0=5.1,y1=22.4,z=3.5,rise=6.9;
    const dirt=(nx,ny)=>(x,y,h)=>A.K.hash(Math.floor(x*2),Math.floor(y*2+h),4242)%13<2?P.soil:(A.dark(nx,ny)?P.greenD:P.green);
    const at=t=>[x0+(x1-x0)*t,z+rise*Math.sin(t*Math.PI)];
    // The soil banks belong to this model, with closed wedges down to its paving.
    for(const [outer,inner,nx]of[[2.8,x0,-1],[29.2,x1,1]]){
      S.poly([[outer,4.2,.6],[inner,5.1,4.2],[inner,22.4,4.2],[outer,24.1,.6]],dirt(nx,0));
      S.poly([[outer,4.2,.6],[inner,5.1,4.2],[inner,5.1,.6]],P.soil);
      S.poly([[outer,24.1,.6],[inner,22.4,.6],[inner,22.4,4.2]],P.soil);
      S.wall([inner,5.1],[inner,22.4],.6,4.2,P.soil);
    }
    S.poly([[2.8,4.2,.6],[7.6,5.1,4.2],[24.4,5.1,4.2],[29.2,4.2,.6],[26.8,2.8,.6],[5.2,2.8,.6]],P.soil);
    for(let j=0;j<24;j++){
      const a=at(j/24),b=at((j+1)/24),nx=a[1]-b[1];
      S.poly([[a[0],y0,a[1]+.7],[b[0],y0,b[1]+.7],[b[0],y1,b[1]+.7],[a[0],y1,a[1]+.7]],dirt(nx,0));
      // The rear earth slope closes the mound; it is not exposed vault masonry.
      S.poly([[a[0],2.9,.6],[b[0],2.9,.6],[b[0],y0,b[1]+.7],[a[0],y0,a[1]+.7]],dirt(0,-1));
      S.poly([[a[0],y1,.6],[b[0],y1,.6],[b[0],y1,b[1]],[a[0],y1,a[1]]],A.mat('brick',0,1));
      S.poly([[a[0],y1+.03,a[1]-.5],[b[0],y1+.03,b[1]-.5],[b[0],y1+.03,b[1]+.48],[a[0],y1+.03,a[1]+.48]],A.mat('brick',0,1));
      S.poly([[a[0],y1,a[1]],[b[0],y1,b[1]],[b[0],y1,b[1]+.7],[a[0],y1,a[1]+.7]],P.soil);
    }
    // The only glazing is in this small, unburied receiving room.
    const receive=A.volume(12,20,22.4,29.1,.6,6.6,'brick');A.roof(11.65,20.35,22.1,29.45,6.6,3.5,'y','brick');
    for(const F of[receive.left,receive.right])A.windows(F,1,2,3.2,0,1.65,2.2,'rect');
    solidDoor(A,receive.front,2.1,.7,3.8,4);
    for(const u of[2.15,4.25])A.pane(receive.front,u,5.15,1.6,1.1,'rect',true);
    // A short, square, non-emissive ventilator sits directly on the earth vault.
    const vent=A.volume(14.9,17.1,11.4,13.6,10.6,13,'brick');
    for(const F of Object.values(vent))louver(A,F,.4,11.4,1.4,.9);
    S.box(14.55,17.45,11.05,13.95,13,13.55,P.stone,P.stoneR,P.lead);
    A.steps(12.5,19.5,29.2,30.55,.6,3);
    return{...A.finish(),details:{originalDesign:true,lowHalfBuriedStore:true,modelOwnedThickSideAndRearEarthBanks:true,lowEarthCoveredVault:true,brickArchedFront:true,smallRectangularSlateGabledReceivingRoom:true,receivingRoomWindowsOnly:true,shortSquareTopVent:true,noTerrainOrCoolingRuleChange:true,newModelBody:true}};
  }

  const MODELS=Object.freeze({alderjoinery,mereweigh,rushfordlav,beckvalve,woldswitch,elmstone,fencooper,larkprint,rowdenmortuary,cressice});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave042 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave042 four world rotations only');if(!MODELS[id])throw Error('wave042 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave042 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture042=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
