/* GPT-041 wave13: original English specialist and public-record buildings.
 * Authored world-space geometry using the unchanged art634 kit.
 * Fictional appearances only; no real-landmark, photograph or game-rule claim.
 * Shared local drawing helpers are inherited from GPT-040; all ten model
 * bodies below are newly authored forms. No bitmap or screen-space decals. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "birchbind",
    "nm": "樺庭裝訂所",
    "en": "Birchfold Bindery",
    "v": 640,
    "shape": "H-plan-unequal-twin-barrel-workshops-low-bridge-two-open-courts",
    "design": "H形雙窄長工房、兩座不等高桶拱屋頂、低平頂中橋、兩個真開放院、長圓拱工窗與矮橋方窗",
    "distinctionFromPublished120": "露岸洗衣房為四個平行低拱連脊；Finsbury為外張現代翼，本款窄雙拱H形",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "flintchart",
    "nm": "燧灣測繪所",
    "en": "Flintbay Survey Rooms",
    "v": 644,
    "shape": "fan-wedge-three-radial-northlight-sawtooth-roofs",
    "design": "扇形楔狀主體、三片沿放射方向展開的北光鋸齒屋頂、削角小入口、梯形高窗與窄縫窗",
    "distinctionFromPublished120": "既有Orchardcross平行鋸齒和Leicester斜網格塔群均非放射楔形",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rowanclock",
    "nm": "花楸鐘錶工房",
    "en": "Rowanwick Clock House",
    "v": 648,
    "shape": "four-storey-stepped-townhouse-deep-M-roof-double-height-box-bay",
    "design": "四層窄高退台街屋、深M形雙坡谷頂、兩層凸出矩形窗艙、凹入上層露台、錯層上下拉窗",
    "distinctionFromPublished120": "St Albans為塔樓，錦葵為削角孟莎單屋，本款階梯街屋及M頂",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "sedgephoto",
    "nm": "莎草攝影室",
    "en": "Sedgewick Photographic Rooms",
    "v": 652,
    "shape": "tall-trapezoid-studio-single-steep-glass-roof-low-oval-reception",
    "design": "單一高梯形攝影室、單片陡斜玻璃北頂、前方低扁橢圓接待室、後方實牆暗房翼、斜向高窗與舷窗",
    "distinctionFromPublished120": "Arnos為鼓形車站、Cardington長棚，本款高楔與低橢圓組合",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "elmglass",
    "nm": "榆岬彩窗工坊",
    "en": "Elmreach Glass Atelier",
    "v": 656,
    "shape": "grounded-Y-three-unequal-hip-wings-triangular-clerestory",
    "design": "落地Y形三矩形翼、三座不等四坡屋頂、中央高三角採光亭、尖拱分格窗與矮扶壁",
    "distinctionFromPublished120": "Maggies Oxford為架空分枝，蕨庭雙六角玻璃尖館，薊谷中央八角雙半圓翼",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "bramblewheel",
    "nm": "黑莓輪匠院",
    "en": "Bramblewick Wheelwright",
    "v": 660,
    "shape": "D-plan-asymmetric-roof-workshop-open-semicircular-cart-shed",
    "design": "D形直線後工場、偏心不對稱長短坡頂、低半圓開放車棚與真半圓院、寬車口與高側窗",
    "distinctionFromPublished120": "環球為完整多層環，苜蓿為直線U廊，本款低半環加高直後體",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "heatherdye",
    "nm": "石楠染整屋",
    "en": "Heatherfold Dye House",
    "v": 664,
    "shape": "two-outward-flared-square-drying-towers-open-louver-link",
    "design": "兩座不等高外張方形乾燥樓、窄基寬身、平階通風帽、落地低開放百葉連棚、真百葉縫及高窄雙窗",
    "distinctionFromPublished120": "Sissinghurst為收錐烘爐尖帽，Maggies Leeds植栽碗頂，本款外張方樓平帽",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "hollyrecords",
    "nm": "冬青檔案館",
    "en": "Hollymere Record Office",
    "v": 668,
    "shape": "high-diamond-core-square-reading-ring-four-triangular-lightwells",
    "design": "高菱形斜置檔案核心、低方形閱讀環、四角真三角天井、主體低銅四坡頂與環廊平女兒牆、深窄縫與寬下窗",
    "distinctionFromPublished120": "Piece Hall及四合院學院為中央開院，Rushton實三角，本款中央實菱形與四角開院",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "ashveterinary",
    "nm": "白蠟獸醫舍",
    "en": "Ashcombe Veterinary House",
    "v": 672,
    "shape": "low-crescent-inward-slope-clinic-offset-rectangular-kennel",
    "design": "低連續月牙診療翼、向內斜坡頂、沿弧斷續高側窗、偏置矩形低犬舍、內凹門廊與小雙窗",
    "distinctionFromPublished120": "Saltdean外向兩層泳場、Royal Crescent多層住宅，本款低內向屋頂及犬舍翼",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "celandinewire",
    "nm": "白屈菜電報局",
    "en": "Celandine Telegraph Exchange",
    "v": 676,
    "shape": "unequal-solid-brick-drums-glass-link-disk-and-eccentric-cone",
    "design": "高低相差明顯雙實磚鼓樓、窄直玻璃連接、矮鼓寬平圓盤頂、高鼓偏心錐頂與切入天窗、縱縫與環窗帶",
    "distinctionFromPublished120": "Arnos為單鼓加方底，蕨庭雙玻璃六角尖館，本款不等實鼓與不同頂形",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English specialist-building design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
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
    if(!root.__wave041GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave041GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave041:1});
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
  // All helpers below are private to GPT-041 and operate in world coordinates.

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

/* WAVE041 NEW AUTHORED MODELS */
  function birchbind(row,view){
    const A=context(row,view),{S,P}=A;
    // The three solid rectangles leave both H courts genuinely open to the sky.
    for(const [x0,x1,z,rise]of[[3.8,10.4,16,4.1],[21.6,28.2,21,5.2]]){
      const range=A.volume(x0,x1,4.2,27.4,.6,z,'brick');
      barrel(A,x0-.25,x1+.25,3.9,27.7,z,rise);
      for(const F of[range.left,range.right])A.windows(F,1,5,3.4,0,2.4,z-5.4,'arch');
      for(const F of[range.front,range.back]){A.pane(F,1.15,3.1,F.length-2.3,z-5.2,'arch',true);band(A,F,z-1.6,.45);}
      for(const y of[4.8,11.3,19.7,26.7])for(const x of[x0-.11,x1+.11])S.beam([x,y,1],[x,y,z-.5],P.stoneR,.22);
    }
    const link=A.volume(10.4,21.6,13.3,18.4,.6,9.2,'stone');
    S.flat(10.15,21.85,13.05,18.65,9.55,P.lead);
    for(const F of[link.front,link.back])A.windows(F,1,3,2.6,0,2.5,4.5,'rect');
    A.parapet(10.3,21.7,13.2,18.5,9.55,false);
    A.steps(12.3,19.7,19.1,23.4,1.1,4);
    // Low outdoor binding benches do not bridge, roof or fill either court.
    for(const y of[8.7,25.5]){S.box(12.2,19.8,y,y+1.3,1.9,2.4,P.woodHi,P.woodR,P.woodHi);for(const x of[12.8,19.2])S.box(x,x+.3,y+.25,y+1.05,.6,1.9,P.woodR,P.woodR,P.wood);}
    A.chimney(26,6.7,23.2,4.2);
    return{...A.finish(),details:{originalDesign:true,HPlanTwinNarrowWorkshops:true,unequalBarrelRoofHeights:true,lowFlatRoofBridge:true,twoRealOpenCourts:true,longRoundHeadWorkWindows:true,newModelBody:true}};
  }

  function flintchart(row,view){
    const A=context(row,view),{S,P}=A,cx=16,cy=4.8,inner=4.5,outer=23.2,start=54*Math.PI/180,delta=24*Math.PI/180;
    const at=(a,r)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    // Each radial sawtooth occupies a convex annular wedge, not a parallel shed.
    for(let k=0;k<3;k++){
      const a=start+k*delta,b=a+delta,p=at(a,inner),q=at(a,outer),r=at(b,outer),s=at(b,inner),outline=[p,q,r,s];
      const F=planBlock(A,outline,.6,17.6,'yellowbrick',false),zLow=18,zHigh=24.2;
      S.poly([[...p,zLow],[...q,zLow],[...r,zHigh],[...s,zHigh]],A.K.slate(A.dark(Math.cos((a+b)/2),Math.sin((a+b)/2))));
      S.poly([[...q,17.6],[...r,17.6],[...r,zHigh],[...q,zLow]],A.mat('yellowbrick',F[1].nx,F[1].ny));
      S.poly([[...s,17.6],[...p,17.6],[...p,zLow],[...s,zHigh]],A.mat('yellowbrick',F[3].nx,F[3].ny));
      const north=face(A,r,s,-Math.sin(b),Math.cos(b));
      north.panel(0,north.length,17.6,zHigh,P.stoneR,0);
      for(let j=0;j<5;j++)A.pane(north,.65+j*(north.length-1.3)/5,18.5,(north.length-1.3)/5-.5,4.6,'rect',true);
      const outerFace=F[1],w=outerFace.length/2;
      for(let j=0;j<2;j++){const u=.5+j*w;framedPolygon(A,outerFace,[[u,4.1],[u+w-1,4.1],[u+w-1,15.7+j*1.1],[u,13.6+j*1.1]],true);}
      if(k===0)A.windows(F[0],1,5,3.5,0,1.1,10.8,'rect');
      if(k===2)A.windows(F[2],1,5,3.5,0,1.1,10.8,'rect');
      S.beam([...s,zHigh+.08],[...r,zHigh+.08],P.lead,.3);
      S.beam([...p,zLow+.08],[...q,zLow+.08],P.lead,.25);
    }
    const entryPlan=[[12.2,3],[19.8,3],[21,4.5],[20,10],[12,10],[11,4.5]],entry=planBlock(A,entryPlan,.6,9.4,'stone');
    hipPlateau(A,12.1,19.9,3.8,9.7,9.4,2.6,1.5,'lead');
    A.pane(entry[0],2,1.2,3.6,6.8,'rect',true);
    for(const i of[1,4])A.pane(entry[i],.25,3.3,entry[i].length-.5,4.4,'rect',true);
    A.steps(13,19,1.4,3.1,.8,3);
    return{...A.finish(),details:{originalDesign:true,fanWedgePlan:true,threeRadiallySplayedNorthlightRoofs:true,trapezoidalHighWindows:true,chamferedLowEntrance:true,noParallelSawtoothClone:true,newModelBody:true}};
  }

  function rowanclock(row,view){
    const A=context(row,view),{S,P}=A;
    const stages=[[7.5,24.5,5,24.8,.6,12.3],[7.5,24.5,5,23,12.3,24],[8.8,23.2,5,20,24,35],[10,22,5,17,35,46]];
    for(let i=0;i<stages.length;i++){
      const [x0,x1,y0,y1,z0,z1]=stages[i],b=A.volume(x0,x1,y0,y1,z0,z1,'brick');
      for(const [F,bays]of[[b.front,3],[b.back,3],[b.left,3],[b.right,3]]){
        A.windows(F,1,i===3&&F===b.front?2:bays,z0+2.1+(F===b.left?.6:0),0,i===3?2.1:2.7,i===0?7.3:6.6,'rect');band(A,F,z1-.8,.45);
      }
      if(i>0){S.flat(x0,x1,y1,stages[i-1][3],z0+.12,P.lead);rail(A,[[x0,y1],[x0,stages[i-1][3]],[x1,stages[i-1][3]],[x1,y1]],z0+.2,1.9,false);}
    }
    // Four roof planes meet at a deep central valley; no flat cap spans the M.
    const profile=[[9.6,46],[12.8,53],[16,46.3],[19.2,53],[22.4,46]];
    for(let i=0;i<4;i++){
      const a=profile[i],b=profile[i+1];S.poly([[a[0],4.6,a[1]],[b[0],4.6,b[1]],[b[0],17.4,b[1]],[a[0],17.4,a[1]]],A.K.slate(A.dark(i%2?-1:1,0)));
      for(const [y,ny]of[[5,-1],[17,1]])S.poly([[a[0],y,46],[b[0],y,46],[b[0],y,b[1]],[a[0],y,a[1]]],A.mat('brick',0,ny));
    }
    for(const [x,z]of[profile[1],profile[2],profile[3]])S.beam([x,4.6,z+.1],[x,17.4,z+.1],P.lead,.29);
    // A two-storey rectangular window bay projects from the main street wall.
    const bay=A.volume(11.1,20.9,23,28.2,1.1,23.2,'stone');
    for(const [F,bays]of[[bay.front,3],[bay.left,1],[bay.right,1]])A.windows(F,2,bays,2.8,10.8,F===bay.front?2.3:2.8,7.2,'rect');
    band(A,bay.front,12,.65);S.flat(10.7,21.3,22.7,28.6,23.55,P.lead);
    rail(A,[[10.9,23.2],[10.9,28.4],[21.1,28.4],[21.1,23.2]],23.7,1.9,false);
    A.pane(face(A,[7.5,24.85],[10.5,24.85],0,1),.45,1.2,2.1,8.2,'rect',true);
    const dial=face(A,[10,17.05],[22,17.05],0,1);
    A.K.ring(S,dial,6,41.5,1.9,1.9,.3,.46,P.stoneHi,24);
    S.beam(dial.point(6,.48,41.5),dial.point(6,.48,42.9),P.ironD,.17);S.beam(dial.point(6,.48,41.5),dial.point(7.15,.48,41.5),P.ironD,.17);
    A.chimney(11.4,7,50,4.1);A.steps(7.2,10.7,25.1,29.5,.9,3);
    return{...A.finish(),details:{originalDesign:true,fourSteppedTownhouseStoreys:true,deepTwinPeakMRoof:true,twoStoreyRectangularWindowBay:true,recessedUpperTerraces:true,staggeredSashWindows:true,newModelBody:true}};
  }

  function sedgephoto(row,view){
    const A=context(row,view),{S,P}=A;
    const plan=[[8,6.4],[24,6.4],[27,21.7],[5,21.7]],heights=[34,34,18,18],faces=[];
    for(let i=0;i<4;i++){
      const j=(i+1)%4,a=plan[i],b=plan[j],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),F=face(A,a,b,dy/len,-dx/len);faces.push(F);
      S.poly([[...a,.6],[...b,.6],[...b,heights[j]],[...a,heights[i]]],A.mat('brick',F.nx,F.ny));
      if(i===1||i===3){
        for(let k=0;k<3;k++){const u=1+k*4.8,topA=heights[i]+(heights[j]-heights[i])*u/F.length-2.4,topB=heights[i]+(heights[j]-heights[i])*(u+3.5)/F.length-2.4;framedPolygon(A,F,[[u,8.1],[u+3.5,8.1],[u+3.5,topB],[u,topA]],true);}
      }else if(i===0)A.windows(F,1,4,22.6,0,2.4,7.2,'rect');
      else A.windows(F,1,4,7.3,0,3.2,7.8,'mullion');
    }
    // The roof is one steep plane, subdivided only into opaque glazing panes.
    const roofAt=(u,v)=>[8+16*u+(-3+6*u)*v,6.4+15.3*v,34-16*v];
    for(let u=0;u<4;u++)for(let v=0;v<5;v++){
      const p=[roofAt(u/4,v/5),roofAt((u+1)/4,v/5),roofAt((u+1)/4,(v+1)/5),roofAt(u/4,(v+1)/5)];
      S.poly(p,[A.dark(0,1)?P.glassR:P.glass,P.warm]);
    }
    for(let u=0;u<=4;u++){const a=roofAt(u/4,0),b=roofAt(u/4,1);S.beam([a[0],a[1],a[2]+.12],[b[0],b[1],b[2]+.12],P.frame,.26);}
    for(let v=0;v<=5;v++){const a=roofAt(0,v/5),b=roofAt(1,v/5);S.beam([a[0],a[1],a[2]+.12],[b[0],b[1],b[2]+.12],P.frame,.22);}
    const receptionPlan=ellipsePlan(16,25.4,11.8,4.1,24),reception=planBlock(A,receptionPlan,.6,7.5,'whiteplaster');
    slab(A,ellipsePlan(16,25.4,12.2,4.5,24),8,.45,P.copper);
    for(let i=0;i<reception.length;i++)if(i%3===0){const F=reception[i];roundWindow(A,F,F.length/2,4.7,Math.min(.95,F.length*.36),true);}
    const darkroom=A.volume(9.2,25,2.7,6.4,.6,11.5,'brick');
    S.flat(8.8,25.4,2.3,6.5,11.9,P.lead);A.pane(darkroom.back,1.4,6.8,2.2,2.6,'rect',false);
    for(const x of[13,18,23])S.box(x-.35,x+.35,4,4.8,11.9,13.5,P.iron,P.ironD,P.lead);
    A.steps(12.7,19.3,29,30.7,.8,3);
    return{...A.finish(),details:{originalDesign:true,tallTrapezoidalPhotographicStudio:true,singleSteepGlazedNorthRoof:true,lowFlattenedOvalReception:true,solidRearDarkroomWing:true,slantHeadSideWindowsAndPortholes:true,newModelBody:true}};
  }

  function elmglass(row,view){
    const A=context(row,view),{S,P}=A;
    const specs=[[-Math.PI/2,13,13.5,5.7],[Math.PI/6,13.5,17.5,6.4],[5*Math.PI/6,12.7,15.1,4.8]];
    for(const [angle,len,z,rise]of specs){
      const R=orientedRect(16,16,angle,1.4,len,3.45),walls=planBlock(A,R.points,.6,z,'stone'),Rroof=orientedRect(16,16,angle,1,len+.35,3.8);
      orientedHip(A,Rroof,1,len+.35,3.8,z,rise);
      for(const i of[0,2]){
        const F=walls[i];A.windows(F,1,3,3.6,0,2.3,z-5.5,'pointed');
        for(const u of[.6,F.length-.6]){faceSolid(A,F,u-.25,u+.25,0,.8,.6,5.5);S.poly([F.point(u-.25,0,7),F.point(u+.25,0,7),F.point(u+.25,.8,5.5),F.point(u-.25,.8,5.5)],P.stoneHi);}
      }
      A.pane(walls[1],1,2.8,walls[1].length-2,z-4.8,'pointed',true);
      for(const F of walls)worldBand(A,F,z-1,.35);
    }
    // This central triangular lantern is supported by the grounded wing junction.
    const triangle=Array.from({length:3},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/3;return[16+5*Math.cos(a),16+5*Math.sin(a)];});
    const lantern=planBlock(A,triangle,15,24.6,'stone',false);
    for(const F of lantern){A.pane(F,.7,19,F.length-1.4,5,'pointed',true);S.beam(F.point(.1,.25,15),F.point(.1,.25,24.6),P.stoneHi,.26);}
    for(let i=0;i<3;i++){const j=(i+1)%3;S.poly([[...triangle[i],24.6],[...triangle[j],24.6],[16,16,30.3]],A.K.slate(A.dark(lantern[i].nx,lantern[i].ny)));S.beam([...triangle[i],24.7],[16,16,30.4],P.lead,.24);}
    A.steps(13,19,1.1,3,.8,3);
    return{...A.finish(),details:{originalDesign:true,groundedThreeRectangularYWings:true,threeUnequalFourHipRoofs:true,highTriangularClerestory:true,pointedDividedGlazing:true,lowPhysicalButtresses:true,newModelBody:true}};
  }

  function bramblewheel(row,view){
    const A=context(row,view),{S,P}=A,x0=3.7,x1=28.3,y0=4,y1=12.6,z=19;
    const front=face(A,[x0,y1],[x1,y1],0,1),back=face(A,[x1,y0],[x0,y0],0,-1),left=face(A,[x0,y0],[x0,y1],-1,0),right=face(A,[x1,y1],[x1,y0],1,0);
    for(const F of[back,left,right])S.poly([F.point(0,0,.6),F.point(F.length,0,.6),F.point(F.length,0,z),F.point(0,0,z)],A.mat('brick',F.nx,F.ny));
    archWall(A,front,.6,z,[{u:2.3,w:8,bottom:.6,spring:9,rise:2.6},{u:14.3,w:8,bottom:.6,spring:9,rise:2.6}],'brick',.8,'stone');
    S.flat(x0,x1,y0,y1,z,P.stoneR);
    // The ridge is deliberately off-centre: a short rear pitch and long front pitch.
    S.poly([[3.2,3.5,19],[28.8,3.5,19],[28.8,6.9,29],[3.2,6.9,29]],A.K.slate(A.dark(0,-1)));
    S.poly([[3.2,6.9,29],[28.8,6.9,29],[28.8,13.1,19],[3.2,13.1,19]],A.K.slate(A.dark(0,1)));
    for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,19],[x,6.9,29],[x,y1,19]],A.mat('brick',nx,0));
    S.beam([3.2,6.9,29.1],[28.8,6.9,29.1],P.lead,.34);
    A.windows(back,1,5,6.5,0,2.5,7.7,'rect');for(const F of[left,right])A.windows(F,1,2,10.5,0,2.3,5.6,'rect');
    A.windows(front,1,5,14.5,0,2.5,3.3,'rect');
    // A low half-annular shed encloses no solid disk: every roof bay is a quad.
    const cx=16,cy=12.6,ri=9,ro=13.5,n=16,at=(a,r,h)=>[cx+r*Math.cos(a),cy+r*Math.sin(a),h];
    for(let i=0;i<n;i++){
      const a=i*Math.PI/n,b=(i+1)*Math.PI/n;
      S.poly([at(a,ri,8.4),at(a,ro,10),at(b,ro,10),at(b,ri,8.4)],A.K.slate(A.dark(Math.cos((a+b)/2),Math.sin((a+b)/2))));
      S.beam(at(a,ri,8.5),at(b,ri,8.5),P.woodR,.24);S.beam(at(a,ro,10.1),at(b,ro,10.1),P.woodR,.26);
      if(i%2===0)for(const r of[ri+.15,ro-.15]){const h=r<11?8.4:10;S.beam(at(a,r,.6),at(a,r,h),P.woodR,.4);S.beam(at(a,r,h-2.3),at(a,r===ri+.15?r+1.4:r-1.4,h),P.woodHi,.22);}
    }
    for(const a of[0,Math.PI]){S.beam(at(a,ri,.6),at(a,ri,8.4),P.woodR,.4);S.beam(at(a,ro,.6),at(a,ro,10),P.woodR,.4);}
    // Display wheels use actual open spokes and rims, not dark circular decals.
    for(const [x,y,r]of[[7,16,2.2],[25,16.4,1.9]]){
      const F=face(A,[x-3,y],[x+3,y],0,1);A.K.ring(S,F,3,r+.7,r,r,.28,.05,P.woodHi,24);
      for(let j=0;j<8;j++){const a=j*Math.PI/4;S.beam(F.point(3,.1,r+.7),F.point(3+r*Math.cos(a),.1,r+.7+r*Math.sin(a)),P.woodR,.19);}
    }
    A.chimney(25.8,6.1,27,4.3);
    return{...A.finish(),details:{originalDesign:true,DPlanStraightRearWorkshop:true,eccentricLongShortRoofPitches:true,openSemicircularCartShed:true,realSemicircularYard:true,wideThroughApertures:true,openSpokedDisplayWheels:true,newModelBody:true}};
  }

  function heatherdye(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [cx,cy,top,half]of[[8.5,9,24,4.7],[23,20,29.5,5.1]]){
      const base=3.25,b=A.volume(cx-base,cx+base,cy-base,cy+base,.6,6.5,'stone'),rAt=z=>base+(half-base)*(z-6.5)/(top-6.5);
      const corners=h=>[[cx-h,cy-h],[cx+h,cy-h],[cx+h,cy+h],[cx-h,cy+h]],lo=corners(base),hi=corners(half);
      for(let i=0;i<4;i++){
        const j=(i+1)%4,nx=[0,1,0,-1][i],ny=[-1,0,1,0][i],tx=-ny,ty=nx;
        S.poly([[...lo[i],6.5],[...lo[j],6.5],[...hi[j],top],[...hi[i],top]],A.mat('brick',nx,ny));
        const pos=(u,z,d)=>[cx+nx*(rAt(z)+d)+tx*u,cy+ny*(rAt(z)+d)+ty*u,z];
        for(const u of[-2.1,2.1]){
          const z0=10,z1=top-3.1,w=1.45,outer=[[u-w/2-.25,z0-.3],[u+w/2+.25,z0-.3],[u+w/2+.25,z1+.3],[u-w/2-.25,z1+.3]],inner=[[u-w/2,z0],[u+w/2,z0],[u+w/2,z1],[u-w/2,z1]];
          S.poly(outer.map(p=>pos(p[0],p[1],.1)),P.stoneHi);S.poly(inner.map(p=>pos(p[0],p[1],.2)),[A.dark(nx,ny)?P.glassR:P.glass,P.warm]);
          for(const z of[z0+(z1-z0)/3,z0+(z1-z0)*2/3])S.beam(pos(u-w/2,z,.29),pos(u+w/2,z,.29),P.frame,.19);
        }
      }
      S.flat(cx-half,cx+half,cy-half,cy+half,top,P.lead);
      // Flat stepped ventilator caps stand on posts, leaving real horizontal gaps.
      for(const dx of[-half+.6,half-.6])for(const dy of[-half+.6,half-.6])S.beam([cx+dx,cy+dy,top],[cx+dx,cy+dy,top+4.4],P.woodR,.3);
      for(let j=0;j<3;j++){const h=half+.7-j*.35,z=top+1.1+j*1.6;S.box(cx-h,cx+h,cy-h,cy+h,z,z+.38,P.stone,P.stoneR,P.lead);}
      for(const F of[b.front,b.back])A.pane(F,2.15,1.3,2.2,3.9,'rect',true);
    }
    // An open slatted connector has no backing wall behind its louver openings.
    const R=orientedRect(8.5,9,Math.atan2(11,14.5),3.3,15.3,2.6),plan=R.points;
    slab(A,plan,.9,.3,P.stoneHi);
    for(const s of[3.7,7.4,11.1,14.9])for(const t of[-2.25,2.25]){const p=R.at(s,t);S.beam([...p,.9],[...p,8.4],P.woodR,.28);}
    for(const t of[-2.6,2.6])for(const z of[2.2,3.6,5,6.4]){
      const a=R.at(3.3,t),b=R.at(15.3,t),a2=R.at(3.3,t+.2),b2=R.at(15.3,t+.2);
      S.poly([[...a,z],[...b,z],[...b2,z+.45],[...a2,z+.45]],P.woodHi);
    }
    S.poly(plan.map(p=>[...p,8.8]),A.K.slate(false));
    return{...A.finish(),details:{originalDesign:true,twoUnequalOutwardFlaredSquareTowers:true,narrowGroundedBases:true,steppedFlatVentilatorCaps:true,openGroundedLouverLink:true,realGapsBetweenSlats:true,tallPairedSlopingWallWindows:true,newModelBody:true}};
  }

  function hollyrecords(row,view){
    const A=context(row,view),{S,P}=A;
    // The reading ring is four separate bars. No concave polygon can bridge a well.
    const ranges=[[3,29,3,7],[3,29,25,29],[3,7,7,25],[25,29,7,25]];
    for(let i=0;i<ranges.length;i++){
      const [x0,x1,y0,y1]=ranges[i],b=A.volume(x0,x1,y0,y1,.6,10.5,'stone');
      S.flat(x0,x1,y0,y1,10.9,P.lead);A.parapet(x0,x1,y0,y1,10.9,false);
      for(const F of[i<2?b.front:b.left,i<2?b.back:b.right])A.windows(F,1,i<2?5:4,2.5,0,i<2?3.7:3,5.8,'ribbon');
    }
    const diamond=[[16,6.5],[25.5,16],[16,25.5],[6.5,16]],core=planBlock(A,diamond,.6,30,'brick');
    for(const F of core){
      A.windows(F,2,4,12.2,8.5,1.15,6,'rect');
      for(const u of[.9,F.length-.9])faceSolid(A,F,u-.18,u+.18,0,.45,1,29);
      worldBand(A,F,28.6,.4);
    }
    const top=diamond.map(p=>[16+(p[0]-16)*.25,16+(p[1]-16)*.25]);
    for(let i=0;i<4;i++){
      const j=(i+1)%4;S.poly([[...diamond[i],30],[...diamond[j],30],[...top[j],34],[...top[i],34]],A.mat('copper',core[i].nx,core[i].ny));
      S.beam([...diamond[i],30.1],[...top[i],34.1],P.lead,.23);
    }
    S.poly(top.map(p=>[...p,34]),P.copper);
    // The four corner triangles remain unobstructed above their paved floors.
    for(const triangle of[[[7.2,7.2],[14.9,7.2],[7.2,14.9]],[[24.8,7.2],[24.8,14.9],[17.1,7.2]],[[24.8,24.8],[17.1,24.8],[24.8,17.1]],[[7.2,24.8],[7.2,17.1],[14.9,24.8]]])S.poly(triangle.map(p=>[...p,.5]),A.K.paving);
    const door=face(A,[3,29.04],[29,29.04],0,1);A.pane(door,10.8,1,4.4,8.3,'arch',true);
    A.steps(12,20,29.2,30.8,.7,3);
    return{...A.finish(),details:{originalDesign:true,highSolidDiamondArchiveCore:true,lowSquareReadingRing:true,fourRealTriangularCornerLightwells:true,lowCopperFourHipCoreRoof:true,flatParapetGalleryRoofs:true,deepNarrowArchiveSlits:true,newModelBody:true}};
  }

  function ashveterinary(row,view){
    const A=context(row,view),{S,P}=A,cx=16,cy=16,ro=13.2,n=22,start=70*Math.PI/180,end=290*Math.PI/180;
    const at=(a,r,z)=>[cx+r*Math.cos(a),cy+r*Math.sin(a),z],rInner=t=>12.05-4.45*Math.sin(Math.PI*t);
    for(let i=0;i<n;i++){
      const t0=i/n,t1=(i+1)/n,a=start+(end-start)*t0,b=start+(end-start)*t1,ri0=rInner(t0),ri1=rInner(t1),oa=at(a,ro,12.8),ob=at(b,ro,12.8),ia=at(a,ri0,9.1),ib=at(b,ri1,9.1);
      const outerF=face(A,oa.slice(0,2),ob.slice(0,2),Math.cos((a+b)/2),Math.sin((a+b)/2));
      S.poly([outerF.point(0,0,.6),outerF.point(outerF.length,0,.6),outerF.point(outerF.length,0,12.8),outerF.point(0,0,12.8)],A.mat('yellowbrick',outerF.nx,outerF.ny));
      if(i%2===0)A.pane(outerF,.18,9,outerF.length-.36,2.7,'ribbon',true);
      S.poly([oa,ob,ib,ia],A.K.slate(A.dark(-Math.cos((a+b)/2),-Math.sin((a+b)/2))));
      S.beam([ia[0],ia[1],9.18],[ib[0],ib[1],9.18],P.lead,.22);
      // Recess the central entrance into the crescent instead of painting a void.
      const recessed=i===10||i===11,r0=recessed?ri0+2:ri0,r1=recessed?ri1+2:ri1,ba=at(a,r0,.6),bb=at(b,r1,.6),nx=-Math.cos((a+b)/2),ny=-Math.sin((a+b)/2),F=face(A,bb.slice(0,2),ba.slice(0,2),nx,ny);
      S.poly([F.point(0,0,.6),F.point(F.length,0,.6),F.point(F.length,0,9.1),F.point(0,0,9.1)],A.mat('yellowbrick',nx,ny));
      if(recessed){
        A.pane(F,.18,1.1,F.length-.36,6.7,'rect',true);
        if(i===10)S.poly([at(a,ri0,.6),at(a,r0,.6),at(a,r0,9.1),at(a,ri0,9.1)],P.stoneR);
        if(i===11)S.poly([at(b,ri1,.6),at(b,r1,.6),at(b,r1,9.1),at(b,ri1,9.1)],P.stoneR);
      }else if(i%4===1||i%4===2)A.pane(F,.18,3.4,F.length-.36,3.7,'rect',true);
      if(i===0||i===n-1){const ang=i===0?a:b,ri=i===0?ri0:ri1;S.poly([at(ang,ri,.6),at(ang,ro,.6),at(ang,ro,12.8),at(ang,ri,9.1)],A.mat('yellowbrick',Math.sin(ang),-Math.cos(ang)));}
    }
    const kennel=A.volume(19.5,28.8,22.4,29,.6,7.1,'brick');
    S.poly([[19.1,22,9.3],[29.2,22,9.3],[29.2,29.4,7.2],[19.1,29.4,7.2]],A.K.slate(false));
    for(const [x,nx]of[[19.5,-1],[28.8,1]])S.poly([[x,22.4,7.1],[x,22.4,9.2],[x,29,7.1]],A.mat('brick',nx,0));
    for(const F of[kennel.front,kennel.back])A.windows(F,1,3,2.1,0,1.5,3.5,'rect');
    A.pane(kennel.right,2.1,1,2.2,4.6,'rect',true);
    A.steps(10,14.4,14.2,17.8,.8,3);
    return{...A.finish(),details:{originalDesign:true,continuousLowTaperingCrescentWing:true,inwardSlopingArcRoof:true,interruptedOuterClerestory:true,recessedInnerEntrancePorch:true,offsetLowRectangularKennel:true,smallPairedClinicWindows:true,newModelBody:true}};
  }

  function celandinewire(row,view){
    const A=context(row,view),{S,P}=A;
    const low=A.polygon(8.7,21,6.6,.6,17.8,24,'brick'),high=A.polygon(23,10.5,5.7,.6,32.2,24,'brick');
    for(let i=0;i<low.length;i++){
      const F=low[i];A.pane(F,.14,11.5,F.length-.28,4.3,'ribbon',true);
      if(i%3===0)A.pane(F,.2,3.2,F.length-.4,5.6,'rect',true);
    }
    for(let i=0;i<high.length;i++){
      const F=high[i];if(i%2===0){A.pane(F,.2,4.3,F.length-.4,12.5,'rect',true);A.pane(F,.2,22.7,F.length-.4,6.4,'rect',true);}
    }
    const disk=ellipsePlan(8.7,21,7.4,7.4,32);slab(A,disk,18.7,.7,P.lead);
    for(let j=0;j<disk.length;j++){const k=(j+1)%disk.length;S.beam([...disk[j],18.83],[...disk[k],18.83],P.stoneHi,.23);}
    // A narrow straight glazed corridor physically joins the unequal solid drums.
    const angle=Math.atan2(-10.5,14.3),len=Math.hypot(14.3,10.5),R=orientedRect(8.7,21,angle,5.8,len-5,2.05),bridge=planBlock(A,R.points,.6,12.6,'stone');
    for(const i of[0,2]){const F=bridge[i];A.windows(F,1,3,2.1,0,Math.min(2,(F.length-1.5)/3),8.7,'mullion');}
    S.poly(R.points.map(p=>[...p,13]),P.lead);
    const cx=23,cy=10.5,r=6.05,top=[24.8,9.2,45],n=24;
    const mix=(p,t)=>p.map((v,i)=>v+(top[i]-v)*t);
    for(let j=0;j<n;j++){
      const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,p=[cx+r*Math.cos(a),cy+r*Math.sin(a),32.2],q=[cx+r*Math.cos(b),cy+r*Math.sin(b),32.2],m=(a+b)/2,tex=A.K.slate(A.dark(Math.cos(m),Math.sin(m)));
      if(j===4||j===5){
        const pa=mix(p,.27),qa=mix(q,.27),pb=mix(p,.67),qb=mix(q,.67);
        S.poly([p,q,qa,pa],tex);S.poly([pb,qb,top],tex);
        const recessed=[pa,qa,qb,pb].map(v=>[v[0],v[1],v[2]-.14]);
        S.poly(recessed,[A.dark(Math.cos(m),Math.sin(m))?P.glassR:P.glass,P.warm]);
        for(let k=0;k<4;k++){const v=[pa,qa,qb,pb][k],w=[pa,qa,qb,pb][(k+1)%4];S.beam(v,w,P.frame,.24);S.poly([v,w,[w[0],w[1],w[2]-.14],[v[0],v[1],v[2]-.14]],P.lead);}
      }else S.poly([p,q,top],tex);
      if(j%3===0)S.beam(p,top,P.lead,.18);
    }
    // Small brick entrance jambs keep the low drum's door readable at street level.
    const entry=A.volume(5.5,11.9,25.4,28.1,.6,9.3,'stone');A.pane(entry.front,1.4,1.2,3.6,7.6,'arch',true);
    S.flat(5.2,12.2,25.3,28.4,9.7,P.lead);A.steps(6,11.4,28.3,30,.8,3);
    return{...A.finish(),details:{originalDesign:true,twoUnequalSolidBrickDrums:true,narrowStraightGlazedLink:true,wideFlatLowDiskRoof:true,eccentricHighConicalRoof:true,recessedRoofSkylightPatches:true,verticalSlitsAndRingWindowBand:true,newModelBody:true}};
  }

  const MODELS=Object.freeze({birchbind,flintchart,rowanclock,sedgephoto,elmglass,bramblewheel,heatherdye,hollyrecords,ashveterinary,celandinewire});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave041 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave041 four world rotations only');if(!MODELS[id])throw Error('wave041 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave041 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture041=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
