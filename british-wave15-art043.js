/* GPT-043 wave15: ten original English craft and community-lodge buildings.
 * Authored world-space bodies, unchanged art634 palette / projection / opaque
 * glazing semantics. No external photographs or real-landmark claims.
 * Small drawing helpers are inherited from GPT-042; no previous model is reused.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "reedcider",
    "nm": "蘆谷果酒壓榨屋",
    "en": "Reedcombe Cider House",
    "v": 720,
    "shape": "asymmetric-saltbox-stone-two-storey-core-real-recessed-press-veranda",
    "design": "兩層後石屋、一體強不對稱saltbox長斜屋面遮蓋真開放凹壓榨廊；高三聯窗、低橫窗",
    "distinctionFromPublished140": "非D院車輪坊或Coxwell穿廊穀倉，不是普通山牆加小棚",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "pondbadminton",
    "nm": "池原羽球會館",
    "en": "Pondwick Badminton Hall",
    "v": 724,
    "shape": "grounded-diamond-hall-opposite-high-corners-closed-saddle-roof",
    "design": "落地菱形會堂、相對兩高角兩低角真鞍形屋面、封閉屋簷及底面；低磚牆、梯形高側窗",
    "distinctionFromPublished140": "非兩翼V形蝴蝶頂或架高六角帳篷",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "holtscout",
    "nm": "林丘童軍會舍",
    "en": "Holtbank Scout Lodge",
    "v": 728,
    "shape": "steep-near-ground-A-shell-timber-ribs-triangular-glazing-skew-entry",
    "design": "陡A形主殼屋頂近地、可見木肋、三角端窗、斜錯低入口盒",
    "distinctionFromPublished140": "非曲倒船殼或樹枝架高樹屋，不以普通方屋上貼木條充數",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "fennelhoney",
    "nm": "茴庭蜂蜜工房",
    "en": "Fennelfold Honey House",
    "v": 732,
    "shape": "low-dodecagonal-ring-open-hexagonal-court-inward-sloping-roof",
    "design": "低十二邊外環、真開放六邊內院、向內斜環頂和內檐；外六組雙窗、內門",
    "distinctionFromPublished140": "非三層外斜茅頂Globe或實心菱形檔案室，內院不可黑塗偽造",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "ashfives",
    "nm": "白蠟手球院",
    "en": "Ashwick Fives Court",
    "v": 736,
    "shape": "roofless-three-wall-court-stepped-raking-sides-narrow-roofed-rear-club",
    "design": "高無頂三面完整球牆、階梯斜側牆、窄後有頂會所及高窗，正面真開放",
    "distinctionFromPublished140": "非無頂古蹟柱廊或廢墟，不加球場模擬，空院不發光",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "brassbell",
    "nm": "銅原鑄鐘坊",
    "en": "Brassfield Bell Foundry",
    "v": 740,
    "shape": "high-square-foundry-chamfered-buttresses-two-stage-hip-wide-vent",
    "design": "單一高方鑄造室、削角階梯扶壁、兩段四坡高頂及寬方通風帽、低側模具帶、深成對圓窗",
    "distinctionFromPublished140": "非瓶窯、重複方烘房或大鍛造院，不加煙／產業",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "teaselhat",
    "nm": "川續斷製帽樓",
    "en": "Teaselwick Hatters’ House",
    "v": 744,
    "shape": "narrow-scalene-three-storey-wedge-slanted-ridge-four-hip-roof",
    "design": "窄三層不等邊三角楔、單斜脊四坡屋頂、尖角垂直窗、側錯位深窗與凹門",
    "distinctionFromPublished140": "非等邊三山牆Rushton或三角中庭，不能靠招牌辨識",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "withebasket",
    "nm": "柳條編籃工房",
    "en": "Withebrook Basket House",
    "v": 748,
    "shape": "continuous-low-S-plan-workshop-S-ridge-convex-bays-concave-doors",
    "design": "連續低S形兩反向彎折工房、同S形連續坡屋脊、凸窗灣與凹乾燥門交錯",
    "distinctionFromPublished140": "非單彎新月獸醫院、角折工具店或分離S棚；屋頂不可自交",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "gorsearchery",
    "nm": "荊原射藝會舍",
    "en": "Gorsewick Archery Lodge",
    "v": 752,
    "shape": "trapezoid-open-viewing-wedge-rear-supported-folded-canopy",
    "design": "明顯梯形觀景楔、單片後柱支承寬折棚、後窄兩層封閉會所高窗、前真開棚",
    "distinctionFromPublished140": "非多層停車樓或舊板球／草地滾球亭；不加場地或服務數值",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rillramblers",
    "nm": "溪環健行客舍",
    "en": "Rillmere Ramblers’ Lodge",
    "v": 756,
    "shape": "open-near-ring-ascending-spiral-lodge-continuously-rising-slate-roof",
    "design": "近環形開口螺旋屋列、低入口逐段升至高末端、一體升高分段板岩屋面、遞升窗、清楚入口缺口",
    "distinctionFromPublished140": "非等高新月或封閉環；四向須可見高度遞增與真缺口",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and community-lodge design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
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
    if(!root.__wave043GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave043GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave043:1});
    }
    return{...H,S,K,P,Q,mat,volume,roof,pane,windows,polygon,cone,parapet,steps,chimney,finish};
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

  function roundWindow(A,F,u,z,r,lit=true){
    const {S,K,P}=A,points=Array.from({length:24},(_,j)=>{const t=j*2*Math.PI/24;return F.point(u+r*Math.cos(t),.19,z+r*Math.sin(t));});
    S.poly(points,lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    K.ring(S,F,u,z,r+.3,r+.3,.35,.24,P.stoneHi,24);
    for(const t of[0,Math.PI/3,2*Math.PI/3])S.beam(F.point(u+r*Math.cos(t),.33,z+r*Math.sin(t)),F.point(u-r*Math.cos(t),.33,z-r*Math.sin(t)),P.frame,.16);
  }

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

  function hipRoof(A,x0,x1,y0,y1,z,rise,alongX=true){
    const R=orientedRect((x0+x1)/2,(y0+y1)/2,alongX?0:Math.PI/2,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2);
    orientedHip(A,R,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2,z,rise);
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

  // Every roof polygon below is convex. Non-planar saddle cells are explicitly
  // triangulated; no fan is ever drawn across a courtyard, S bend or spiral gap.
  function roofFace(A,points){
    // Warp is allowed only as the explicit native triangle mesh. Shade each
    // actual triangle from its own upward normal, never from a whole bent quad.
    for(let i=1;i<points.length-1;i++){
      const a=points[0],b=points[i],c=points[i+1],u=b.map((v,j)=>v-a[j]),v=c.map((x,j)=>x-a[j]);
      let nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0];
      if(nz<0){nx=-nx;ny=-ny;}const len=Math.hypot(nx,ny)||1;
      A.S.poly([a,b,c],A.K.slate(A.dark(nx/len,ny/len)));
    }
  }
  function roofShell(A,points,thick=.4){
    roofFace(A,points);A.S.poly(points.map(p=>[p[0],p[1],p[2]-thick]),A.P.woodR);
    for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];A.S.poly([a,b,[b[0],b[1],b[2]-thick],[a[0],a[1],a[2]-thick]],A.P.lead);}
  }
  function edgeFace(A,a,b,inward=false){
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),sign=inward?-1:1;
    return face(A,a,b,sign*dy/len,-sign*dx/len);
  }
  function slopeWall(A,F,z0,h0,h1,kind){
    if(Math.max(h0,h1)<=z0+1e-9)return;
    const points=[F.point(0,0,z0),F.point(F.length,0,z0)];
    if(h1>z0+1e-9)points.push(F.point(F.length,0,h1));if(h0>z0+1e-9)points.push(F.point(0,0,h0));
    A.S.poly(points,A.mat(kind,F.nx,F.ny));
  }
  function offsetFace(A,F,d){return Object.assign(A.S.face(F.point(0,d,0).slice(0,2),F.point(F.length,d,0).slice(0,2),F.nx,F.ny),{nx:F.nx,ny:F.ny});}

/* WAVE043 NEW AUTHORED MODELS */
  function reedcider(row,view){
    const A=context(row,view),{S,P}=A,x0=4.6,x1=27.4,y0=5.2,y1=17.2;
    const ridgeY=9.6,peak=30.2,frontY=28.6,frontEave=8.9,backY=4.8,backEave=20.7;
    const height=y=>y<ridgeY?backEave+(peak-backEave)*(y-backY)/(ridgeY-backY):peak-(peak-frontEave)*(y-ridgeY)/(frontY-ridgeY);
    const house=A.volume(x0,x1,y0,y1,.6,20.7,'stone',false);
    // The upper stone gable stops at the rear-house front. Everything farther
    // forward is a genuine low, open press veranda under the SAME long slope.
    for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,20.7],[x,y1,20.7],[x,y1,height(y1)-.42],[x,ridgeY,peak-.42],[x,y0,height(y0)-.42]],A.mat('stone',nx,0));
    S.wall([x0,y1],[x1,y1],20.7,height(y1)-.42,A.mat('stone',0,1));
    S.wall([x1,y0],[x0,y0],20.7,height(y0)-.42,A.mat('stone',0,-1));
    roofShell(A,[[4.2,backY,backEave],[27.8,backY,backEave],[27.8,ridgeY,peak],[4.2,ridgeY,peak]]);
    roofShell(A,[[4.2,ridgeY,peak],[27.8,ridgeY,peak],[27.8,frontY,frontEave],[4.2,frontY,frontEave]]);
    S.beam([4.15,ridgeY,peak+.1],[27.85,ridgeY,peak+.1],P.lead,.35);
    for(const F of[house.front,house.back]){
      A.windows(F,1,3,13.3,0,3.6,5.9,'mullion');
      for(const u of[2.0,16.7])A.pane(F,u,4.8,4.1,2.2,'ribbon',true);
      worldBand(A,F,11.2,.24);
    }
    for(const F of[house.left,house.right]){A.windows(F,1,2,4.8,0,3.5,2.1,'ribbon');A.pane(F,2.2,13.3,3.4,5.7,'mullion',true);}
    solidDoor(A,house.front,9.6,.7,3.6,7.8);
    for(const x of[5.0,27.0]){
      A.volume(x-.45,x+.45,27.25,28.15,.6,8.8,'wood');
      S.beam([x,27.7,6.0],[x,24.9,height(24.9)-.5],P.woodR,.48);
    }
    S.beam([4.7,27.65,8.65],[27.3,27.65,8.65],P.woodR,.48);
    // A small, non-emissive physical press stands below the veranda, not a facade.
    for(const x of[9.0,13.0])A.volume(x-.3,x+.3,22.2,23.0,.6,6.2,'wood');
    S.beam([8.6,22.6,6.2],[13.4,22.6,6.2],P.woodR,.55);
    S.box(9,13,21.5,24.3,.6,2,P.wood,P.woodR,P.woodHi);
    S.beam([11,22.6,2],[11,22.6,6.25],P.ironD,.28);
    A.chimney(24.7,8.3,height(8.3)-1.1,4.5);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,asymmetricSingleSaltbox:true,twoStoreyRearStoneHouse:true,realOpenRecessedPressVeranda:true,highTripleAndLowRibbonWindows:true}};
  }

  function pondbadminton(row,view){
    const A=context(row,view),{S,P}=A,N=10,at=(u,v)=>[16+6.35*(u-v),16+6.35*(u+v),14.2+5.1*u*v];
    const uv=[[-1,-1],[1,-1],[1,1],[-1,1]],q=uv.map(p=>at(...p));
    // Bilinear hypar: opposite corners high, the other two low. Both sheet
    // faces are tessellated identically; four fascia strips close the edges.
    for(let i=0;i<N;i++)for(let j=0;j<N;j++){
      const a=at(-1+2*i/N,-1+2*j/N),b=at(-1+2*(i+1)/N,-1+2*j/N),c=at(-1+2*(i+1)/N,-1+2*(j+1)/N),d=at(-1+2*i/N,-1+2*(j+1)/N);
      for(const tri of[[a,b,c],[a,c,d]]){roofFace(A,tri);S.poly(tri.map(p=>[p[0],p[1],p[2]-.42]),P.woodR);}
    }
    for(let i=0;i<4;i++){
      const a=q[i],b=q[(i+1)%4],F=edgeFace(A,a,b),h0=a[2]-.42,h1=b[2]-.42;
      S.wall(a.slice(0,2),b.slice(0,2),.6,4.2,A.mat('brick',F.nx,F.ny));
      slopeWall(A,F,4.2,h0,h1,'whiteboard');
      S.poly([a,b,[b[0],b[1],h1],[a[0],a[1],h0]],P.lead);
      S.beam([a[0],a[1],a[2]+.08],[b[0],b[1],b[2]+.08],P.lead,.24);
      for(const [s,t]of[[.12,.36],[.58,.82]]){
        const lo=F.length*s,hi=F.length*t,z0=h0+(h1-h0)*s-1.15,z1=h0+(h1-h0)*t-1.15;
        framedPolygon(A,F,[[lo,5.3],[hi,5.3],[hi,z1],[lo,z0]],true);
        S.beam(F.point((lo+hi)/2,.38,5.5),F.point((lo+hi)/2,.38,(z0+z1)/2-.2),P.frame,.18);
      }
      worldBand(A,F,3.55,.23);
    }
    const front=edgeFace(A,q[1],q[2]);solidDoor(A,front,front.length*.43,.65,2.5,4.1,'cedar');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,groundedDiamondHall:true,oppositeHighAndLowCorners:true,trueSaddleRoof:true,closedFasciaAndUnderside:true,lowBrickAndTrapezoidClerestories:true}};
  }

  function holtscout(row,view){
    const A=context(row,view),{S,P}=A,x0=4.4,x1=27.6,y0=5.9,y1=25.1,eave=1.8,peak=32.2,cx=16;
    for(const [x,nx]of[[x0,-1],[x1,1]]){roofShell(A,[[x,y0,eave],[x,y1,eave],[cx,y1,peak],[cx,y0,peak]],.5);S.wall([x,y0],[x,y1],.6,eave-.5,A.mat('stone',nx,0));}
    for(const [y,ny]of[[y0,-1],[y1,1]]){
      const F=face(A,[x0,y],[x1,y],0,ny);
      S.poly([[x0,y,.6],[x1,y,.6],[x1,y,eave],[cx,y,peak-.5],[x0,y,eave]],A.mat('cedar',0,ny));
      framedPolygon(A,F,[[6.5,12],[16.7,12],[11.6,26.1]],true);
      S.beam(F.point(11.6,.4,12.2),F.point(11.6,.4,25.9),P.frame,.22);
      S.beam(F.point(8.8,.4,18),F.point(14.4,.4,18),P.frame,.2);
      for(const u of[6.5,14.2])A.pane(F,u,4.3,2.5,4.9,'rect',true);
      S.beam([x0,y+ny*.12,eave],[cx,y+ny*.12,peak],P.woodR,.58);
      S.beam([cx,y+ny*.12,peak],[x1,y+ny*.12,eave],P.woodR,.58);
      S.beam([8.8,y+ny*.18,11.8],[23.2,y+ny*.18,11.8],P.woodR,.45);
    }
    for(const y of[7.5,12.6,17.7,22.8]){
      S.beam([x0-.03,y,eave+.15],[cx,y,peak+.15],P.woodR,.32);
      S.beam([cx,y,peak+.15],[x1+.03,y,eave+.15],P.woodR,.32);
    }
    S.beam([cx,y0-.2,peak+.14],[cx,y1+.2,peak+.14],P.lead,.4);
    const R=orientedRect(20.9,26.6,.17,-3.4,3.4,2.4),entry=planBlock(A,R.points,.6,7,'stone');
    // A low skewed box, not another gabled lodge. Its back is physically
    // embedded below the low shell; only the three exposed faces get glazing.
    const roof=R.points.map((p,i)=>[...p,7.4+([0,1].includes(i)?1.2:0)]);roofShell(A,roof);
    for(let i=0;i<4;i++)slopeWall(A,entry[i],7,roof[i][2]-.4,roof[(i+1)%4][2]-.4,'stone');
    for(const i of[1,2,3]){const F=entry[i];if(i===2)solidDoor(A,F,F.length/2-1.35,.65,2.7,5);else A.pane(F,.75,3.1,2.5,2.5,'rect',true);}
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,nearGroundSteepAShell:true,visibleStructuralTimberRibs:true,triangularEndGlazing:true,skewLowEntranceBox:true}};
  }

  function fennelhoney(row,view){
    const A=context(row,view),{S,P}=A,cx=16,cy=16,r=13.1,ri=6.7,n=12;
    const outer=Array.from({length:n},(_,i)=>{const t=i*Math.PI/6;return[cx+r*Math.cos(t),cy+r*Math.sin(t)];});
    // Odd vertices are exact edge midpoints, so the inner boundary has SIX
    // straight sides even though the roof has twelve noncrossing sectors.
    const inner=Array.from({length:n},(_,i)=>{const t=Math.floor(i/2)*Math.PI/3,a=[cx+ri*Math.cos(t),cy+ri*Math.sin(t)],b=[cx+ri*Math.cos(t+Math.PI/3),cy+ri*Math.sin(t+Math.PI/3)];return i%2?[(a[0]+b[0])/2,(a[1]+b[1])/2]:a;});
    for(let i=0;i<n;i++){
      const j=(i+1)%n,F=edgeFace(A,outer[i],outer[j]),I=edgeFace(A,inner[i],inner[j],true);
      S.wall(outer[i],outer[j],.6,12.3,A.mat('stone',F.nx,F.ny));
      S.wall(inner[i],inner[j],.6,9.2,A.mat('whiteplaster',I.nx,I.ny));
      roofShell(A,[[...outer[i],12.7],[...outer[j],12.7],[...inner[j],9.6],[...inner[i],9.6]],.4);
      // Neither floor nor ceiling spans the hexagonal courtyard.
      S.poly([[...outer[i],.6],[...outer[j],.6],[...inner[j],.6],[...inner[i],.6]],P.stoneR);
      worldBand(A,F,2,.25);worldBand(A,F,10.9,.23);
      if(i%2===0)for(const u of[.7,3.55])A.pane(F,u,4.8,1.85,4.4,'rect',true);
      if(i%4===1)solidDoor(A,I,I.length/2-1.05,.65,2.1,5.6,'cedar');
      S.beam([...inner[i],9.72],[...inner[j],9.72],P.lead,.23);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,lowDodecagonalOuterRing:true,trueOpenHexagonalCourt:true,inwardSlopingAnnularRoof:true,sixOuterDoubleWindowGroups:true,innerCourtyardDoors:true,noCourtSpanningCap:true}};
  }

  function ashfives(row,view){
    const A=context(row,view),{S,P}=A;
    const club=A.volume(5,27,3.2,9.0,.6,14.1,'brick');hipRoof(A,4.65,27.35,2.85,9.35,14.1,4.7,true);
    A.windows(club.back,1,5,8.3,0,2.7,4.4,'rect');
    for(const F of[club.left,club.right])A.pane(F,1.6,8.3,2.7,4.4,'rect',true);
    solidDoor(A,club.back,9.5,.65,3,6.3);
    // Real entrance-side lamps remain outside the tall court walls. Their
    // opaque lantern casings are present by day; the empty court never glows.
    for(const [x,wallX]of[[4.1,5],[27.9,27]]){S.beam([wallX,5.8,5.5],[x,5.8,7],P.ironD,.24);A.K.lantern(S,x,5.8,7,false);}
    A.volume(5,27,9,10.15,.6,23.1,'stone');
    // Three thick, complete playing walls. There is deliberately no wall,
    // canopy, transparent overlay or emissive polygon across the open front.
    for(const [y0,y1,h]of[[10.15,16.2,22.2],[16.2,22.2,18.1],[22.2,28.7,12.3]])for(const [x0,x1]of[[5,6.15],[25.85,27]]){
      A.volume(x0,x1,y0,y1,.6,h,'stone');S.box(x0-.12,x1+.12,y0,y1,h,h+.45,P.stoneHi,P.stoneR,P.stoneHi);
    }
    S.box(4.85,27.15,8.88,10.25,23.1,23.55,P.stoneHi,P.stoneR,P.stoneHi);
    for(const y of[15.6,21.6])for(const x of[4.5,27.5])A.volume(x-.4,x+.4,y-.55,y+.55,.6,y<17?15:10,'stone');
    S.flat(6.15,25.85,10.16,28.7,.48,P.paveR);
    const rear=face(A,[6.15,10.16],[25.85,10.16],0,1);rear.panel(.2,rear.length-.2,4.3,4.55,P.stoneD,.08);
    for(const [x,nx]of[[6.16,1],[25.84,-1]]){const F=face(A,[x,10.2],[x,28.7],nx,0);F.panel(0,F.length,4.3,4.55,P.stoneD,.06);}
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,threeCompleteRooflessCourtWalls:true,steppedRakingSideWalls:true,narrowRoofedRearClubhouse:true,highClubhouseWindowsOnly:true,trueOpenFront:true,nonEmissiveEmptyCourt:true}};
  }

  function brassbell(row,view){
    const A=context(row,view),{S,P}=A,q=[[8,5.8],[23,5.8],[26,8.8],[26,22.8],[23,25.8],[8,25.8],[5,22.8],[5,8.8]],hall=planBlock(A,q,.6,24,'brick');
    // The four chamfers carry stepped buttresses built as convex solids.
    for(const i of[1,3,5,7]){const F=hall[i];for(const [z0,z1,depth,inset]of[[.6,7.5,1.6,0],[7.5,14.5,1.2,.25],[14.5,21,.7,.5]])faceSolid(A,F,inset,F.length-inset,0,depth,z0,z1);}
    for(const i of[0,2,4,6]){
      const F=hall[i];for(const u of[F.length*.31,F.length*.69])roundWindow(A,F,u,17.1,2.25,true);
      worldBand(A,F,3.2,.28);worldBand(A,F,22.4,.3);
    }
    solidDoor(A,hall[4],5.5,.65,4,9,'blackwood');
    const outer=[[4.7,5.5],[26.3,5.5],[26.3,26.1],[4.7,26.1]],mid=[[8.5,9.3],[22.5,9.3],[22.5,22.3],[8.5,22.3]],top=[[11.2,12],[19.8,12],[19.8,19.6],[11.2,19.6]];
    for(let i=0;i<4;i++){const j=(i+1)%4;roofFace(A,[[...outer[i],24.1],[...outer[j],24.1],[...mid[j],30.5],[...mid[i],30.5]]);roofFace(A,[[...mid[i],30.5],[...mid[j],30.5],[...top[j],35.4],[...top[i],35.4]]);S.beam([...mid[i],30.58],[...mid[j],30.58],P.lead,.28);}
    S.flat(4.7,26.3,5.5,26.1,24.1,P.woodR);
    for(const F of hall)S.wall(F.point(0,0,0).slice(0,2),F.point(F.length,0,0).slice(0,2),24,24.1,A.mat('brick',F.nx,F.ny));
    const vent=A.volume(11.2,19.8,12,19.6,35.4,38.35,'brick');
    for(const F of Object.values(vent))louver(A,F,.7,35.9,F.length-1.4,1.7);
    hipRoof(A,10.75,20.25,11.55,20.05,38.35,2.4,true);
    const mould=A.volume(26,30.2,10,23.2,.6,6.9,'stone');
    roofShell(A,[[25.9,9.7,9.1],[30.5,9.7,7.3],[30.5,23.5,7.3],[25.9,23.5,9.1]]);
    const mouldTop=x=>9.1-(x-25.9)*1.8/4.6-.4;
    for(const F of Object.values(mould))slopeWall(A,F,6.9,mouldTop(F.point(0,0,0)[0]),mouldTop(F.point(F.length,0,0)[0]),'stone');
    for(const F of[mould.front,mould.back])A.pane(F,.85,3.4,2.5,2.3,'rect',true);
    A.windows(mould.right,1,3,3.4,0,2.1,2.3,'rect');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleHighSquareFoundry:true,chamferedSteppedButtresses:true,twoStageFourHipRoof:true,wideSquareVentilator:true,lowSideMouldStrip:true,deepPairedRoundWindows:true}};
  }

  function teaselhat(row,view){
    const A=context(row,view),{S,P}=A,q=[[8.7,4],[25.2,9.3],[13.1,29]],faces=planBlock(A,q,.6,33,'brick');
    const r0=[16.2,10.9,40.4],r1=[14.3,21.1,0],e=q.map(p=>[...p,33.2]);
    // Four distinct planar hip faces partition this scalene triangle. Both
    // ridge ends belong to the B-C plane, whose exact equation sets r1's z.
    // The fourth face is A-r0-r1, rather than a fictitious kink on an edge.
    const area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    r1[2]=33.2+(r0[2]-33.2)*area(e[1],e[2],r1)/area(e[1],e[2],r0);
    for(const F of faces)S.wall(F.point(0,0,0).slice(0,2),F.point(F.length,0,0).slice(0,2),33,33.2,P.lead);
    for(const p of[[e[0],e[1],r0],[e[1],e[2],r1,r0],[e[2],e[0],r1],[e[0],r0,r1]])roofFace(A,p);
    S.beam(r0,r1,P.lead,.34);
    for(let i=0;i<faces.length;i++){
      const F=faces[i];for(const z of[10.6,21.5,31.7])worldBand(A,F,z,.28);
      for(let floor=0;floor<3;floor++){
        const z=3.5+floor*10.7,offset=floor%2?.9:0;
        const us=i===0?[2.0,7.0,12.0]:i===1?[3.0+offset,10.0-offset,17.1+offset]:[3.0+offset,10.9-offset,18.7+offset];
        for(const u of us)if(u+2.5<F.length-.4){A.pane(F,u,z,2.4,5.8,'rect',true);for(const k of[u-.25,u+2.4])faceSolid(A,F,k,k+.24,.12,.65,z-.2,z+6.1);}
      }
    }
    // Paired narrow vertical slits mark the acute tip on its TWO real faces.
    for(const [F,u]of[[faces[1],faces[1].length-2.4],[faces[2],.75]])for(const z of[4,14.7,25.4])A.pane(F,u,z,1.1,5.4,'rect',true);
    solidDoor(A,faces[0],6.9,.65,3.2,6.9,'blackwood');
    for(const u of[6.4,10.35])faceSolid(A,faces[0],u,u+.45,0,.85,.6,8.1);
    faceSolid(A,faces[0],6.4,10.8,0,.85,7.6,8.2);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,narrowThreeStoreyScaleneTriangle:true,singleSlantedRidgeFourHipRoof:true,acuteCornerVerticalWindows:true,staggeredDeepSideWindows:true,recessedDoorFrame:true,noSignDependency:true}};
  }

  function withebasket(row,view){
    const A=context(row,view),{S,P}=A,N=20,half=2.65;
    const sections=Array.from({length:N+1},(_,i)=>{const t=i/N,x=16+5.4*Math.sin(2*Math.PI*t),y=3.25+25.5*t,dx=5.4*2*Math.PI*Math.cos(2*Math.PI*t),dy=25.5,l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;return{c:[x,y],left:[x-nx*half,y-ny*half],right:[x+nx*half,y+ny*half]};});
    // Flatten each tight inner bend into a real recessed drying-door wall.
    // The roof follows this same boundary; no tiny/inverted window is drawn
    // on the compressed offset segments near the centre of curvature.
    for(const [side,lo,hi]of[['left',2,8],['right',12,18]]){const a=sections[lo][side],b=sections[hi][side];for(let i=lo+1;i<hi;i++){const t=(i-lo)/(hi-lo);sections[i][side]=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}}
    for(let i=0;i<N;i++){
      const a=sections[i],b=sections[i+1],left=edgeFace(A,b.left,a.left),right=edgeFace(A,a.right,b.right);
      for(const F of[left,right])S.wall(F.point(0,0,0).slice(0,2),F.point(F.length,0,0).slice(0,2),.6,8.4,A.mat('cedar',F.nx,F.ny));
      // Roof ribbons follow exactly the same bounded, non-self-intersecting
      // offsets as the walls. Each bay closes only its own convex strip.
      roofFace(A,[[...a.left,8.8],[...b.left,8.8],[...b.c,12.9],[...a.c,12.9]]);
      roofFace(A,[[...a.c,12.9],[...b.c,12.9],[...b.right,8.8],[...a.right,8.8]]);
      S.poly([[...a.left,8.4],[...b.left,8.4],[...b.right,8.4],[...a.right,8.4]],P.woodR);
      for(const side of['left','right']){S.wall(a[side],b[side],8.4,8.8,P.lead);S.beam([...a[side],8.86],[...b[side],8.86],P.lead,.18);}
      S.beam([...a.c,12.98],[...b.c,12.98],P.lead,.26);
      for(const [F,side]of[[left,'left'],[right,'right']]){
        const convex=(side==='right'&&i===4)||(side==='left'&&i===14),drying=(side==='left'&&i>=2&&i<8)||(side==='right'&&i>=12&&i<18);
        if(convex){
          const u0=.08,u1=F.length-.08,plan=[F.point(u0,0,0).slice(0,2),F.point(u1,0,0).slice(0,2),F.point(u1-.12,1.25,0).slice(0,2),F.point(u0+.12,1.25,0).slice(0,2)];
          // Use explicit outward-facing bay faces, avoiding a mirrored normal
          // on the left-hand bend. The glass stays on the physical front.
          S.poly(plan.map(p=>[...p,7.1]),P.lead);
          for(let j=0;j<4;j++)S.wall(plan[j],plan[(j+1)%4],.6,7.1,A.mat('cedar',F.nx,F.ny));
          const front=offsetFace(A,F,1.25);A.pane(front,.26,2.9,F.length-.52,3.3,'rect',true);
        }else if(drying){
          if(i===2||i===12){const lo=i,hi=i+6,D=side==='left'?edgeFace(A,sections[hi][side],sections[lo][side]):edgeFace(A,sections[lo][side],sections[hi][side]);solidDoor(A,D,.45,.65,D.length-.9,6.4,'wood');}
        }else if(i%2===0&&F.length>=1.5)A.pane(F,.26,3.2,F.length-.52,3.3,'rect',true);
        F.panel(0,F.length,1.2,1.65,P.stoneR,.12);
      }
    }
    for(const [idx,reverse]of[[0,true],[N,false]]){
      const t=sections[idx],F=reverse?edgeFace(A,t.left,t.right):edgeFace(A,t.right,t.left);
      S.poly([[...t.left,.6],[...t.right,.6],[...t.right,8.8],[...t.c,12.9],[...t.left,8.8]],A.mat('cedar',F.nx,F.ny));
      A.pane(F,1.4,4,2.5,3.6,'rect',true);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,continuousLowSPlan:true,twoReverseBends:true,continuousMatchingSRidge:true,convexGlazedBays:true,alternatingConcaveDryingDoors:true,noDisconnectedCanopy:true}};
  }

  function gorsearchery(row,view){
    const A=context(row,view),{S,P}=A,back=[[10,3.7],[22,3.7],[24,11],[8,11]],club=planBlock(A,back,.6,19.5,'brick');
    const roof=back.map(p=>[...p,19.8]);roofShell(A,roof,.3);
    for(const i of[0,1,2,3]){
      const F=club[i];A.windows(F,1,i===0||i===2?3:2,13.8,0,i===0||i===2?2.3:1.5,4.5,'rect');
      if(i!==2)A.windows(F,1,i===0?3:2,4.7,0,1.8,4.2,'rect');
    }
    solidDoor(A,club[2],6.1,.65,3.3,7,'wood');
    // Two folded plates are one trapezoid canopy, with closed thickness. The
    // front remains free: support posts and knee braces are confined to rear.
    const a=[8,10.8,13.6],b=[24,10.8,13.6],c=[29.3,28.3,10.6],d=[2.7,28.3,10.6],r0=[16,10.8,16.0],r1=[16,28.3,14.59];
    roofShell(A,[a,r0,r1,d],.48);roofShell(A,[r0,b,c,r1],.48);
    S.beam(r0,r1,P.lead,.3);
    for(const x of[8.5,23.5]){
      const shelterUnder=(xx,yy)=>{const t=(yy-10.8)/17.5,edge=8-5.3*t;return 13.6-3*t+.3*((xx<16?xx:32-xx)-edge)-.48;};
      A.volume(x-.38,x+.38,12.2,13,.6,shelterUnder(x,12.6),'wood');
      const bx=x+(x<16?1.3:-1.3);S.beam([x,12.6,10.1],[bx,15.4,shelterUnder(bx,15.4)],P.woodR,.43);
    }
    for(const [p,q]of[[a,d],[b,c],[d,c]])S.beam(p,q,P.lead,.23);
    S.poly([[8,11,.48],[24,11,.48],[29,28,.48],[3,28,.48]],P.paveR);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,trapezoidViewingWedge:true,singleBroadFoldedCanopy:true,rearOnlyPostSupports:true,narrowTwoStoreyRearClubhouse:true,highRealWindows:true,trueOpenFrontShelter:true}};
  }

  function rillramblers(row,view){
    const A=context(row,view),{S,P}=A,N=24,start=Math.PI/4,sweep=5*Math.PI/3,half=2.65;
    const sec=Array.from({length:N+1},(_,i)=>{const t=i/N,theta=start+sweep*t,r=9.8+1.05*t,eave=6.8+16.4*t;return{t,eave,inner:[16+(r-half)*Math.cos(theta),16+(r-half)*Math.sin(theta)],ridge:[16+r*Math.cos(theta),16+r*Math.sin(theta)],outer:[16+(r+half)*Math.cos(theta),16+(r+half)*Math.sin(theta)]};});
    for(let i=0;i<N;i++){
      const a=sec[i],b=sec[i+1],outer=edgeFace(A,a.outer,b.outer),inner=edgeFace(A,a.inner,b.inner,true);
      for(const F of[outer,inner])slopeWall(A,F,.6,a.eave,b.eave,'whiteplaster');
      roofFace(A,[[...a.outer,a.eave+.4],[...b.outer,b.eave+.4],[...b.ridge,b.eave+3.6],[...a.ridge,a.eave+3.6]]);
      roofFace(A,[[...a.ridge,a.eave+3.6],[...b.ridge,b.eave+3.6],[...b.inner,b.eave+.4],[...a.inner,a.eave+.4]]);
      S.poly([[...a.outer,a.eave],[...b.outer,b.eave],[...b.inner,b.eave],[...a.inner,a.eave]],P.woodR);
      for(const side of['inner','outer']){
        S.poly([[...a[side],a.eave],[...b[side],b.eave],[...b[side],b.eave+.4],[...a[side],a.eave+.4]],P.lead);
        S.beam([...a[side],a.eave+.45],[...b[side],b.eave+.45],P.lead,.2);
      }
      S.beam([...a.ridge,a.eave+3.67],[...b.ridge,b.eave+3.67],P.lead,.26);
      const z=2.0+12.8*(i+.5)/N;
      for(const F of[outer,inner]){
        if(i%2===0)A.pane(F,.27,z,F.length-.54,3.35,'rect',true);
        if(i>13&&i%3===0)A.pane(F,.3,3.5,F.length-.6,3.5,'rect',true);
        F.panel(0,F.length,1.3,1.85,P.stoneR,.12);
      }
    }
    // Both ends are closed and separated by a genuine 60-degree entrance gap.
    // No wrapping segment, floor, roof, glazing or beam bridges the opening.
    for(const [i,reverse]of[[0,true],[N,false]]){
      const t=sec[i],F=reverse?edgeFace(A,t.inner,t.outer):edgeFace(A,t.outer,t.inner);
      S.poly([[...t.inner,.6],[...t.outer,.6],[...t.outer,t.eave+.4],[...t.ridge,t.eave+3.6],[...t.inner,t.eave+.4]],A.mat('whiteplaster',F.nx,F.ny));
      if(i===0){solidDoor(A,F,1,.65,3.1,4.7,'wood');framedPolygon(A,F,[[1.5,6.0],[3.8,6.0],[2.65,8.4]],true);}
      else{for(const z of[4,12.2,19.2])A.pane(F,1.25,z,2.8,3.1,'rect',true);}
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,openNearRingSpiral:true,lowEntranceRisesToHighEnd:true,continuousAscendingSegmentedSlateRoof:true,risingWindowSequence:true,trueSixtyDegreeEntranceGap:true,closedSeparateEnds:true}};
  }

  const MODELS=Object.freeze({reedcider,pondbadminton,holtscout,fennelhoney,ashfives,brassbell,teaselhat,withebasket,gorsearchery,rillramblers});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave043 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave043 four world rotations only');if(!MODELS[id])throw Error('wave043 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave043 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture043=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
