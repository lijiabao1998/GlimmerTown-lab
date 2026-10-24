/* GPT-044 wave16: ten original English specialist workshops and services.
 * New world-space bodies, unchanged art634 palette / native projection / opaque
 * glazing semantics. No external images or real-landmark replica claims.
 * Small drawing helpers inherited from GPT-043; no previous model is reused.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "lindenmaps",
    "nm": "椴木地圖修護館",
    "en": "Lindenwick Map Conservation House",
    "v": 760,
    "shape": "square-stone-hall-four-arched-heads-true-intersecting-groin-vault-roof",
    "design": "矮方形厚石牆修護館、兩個垂直相交的淺桶拱構成真交叉拱頂、四面半圓高窗、可見對角屋面交線與角墩；沒有塔或附加院落",
    "distinctionFromPublished150": "Beckstone只有單一縱向淺桶拱與扶壁，Dewbank為四個平行桶拱；本款四面拱頭與雙方向交叉屋面必須真實成立，不能在單桶拱貼十字線",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "wrenumbrella",
    "nm": "鷦鷯修傘工房",
    "en": "Wrenfold Umbrella Works",
    "v": 764,
    "shape": "enclosed-tapering-brick-hall-single-conoid-slate-roof-high-arched-front-low-straight-rear",
    "design": "封閉漸寬磚工房、單一連續板岩曲頂由後方低直簷升至前方高半圓拱頭、可見縱向木肋與實牆承托、前大扇形工作窗及側低橫窗；高前採光端服務修傘工作區",
    "distinctionFromPublished150": "Sedge是單片陡平玻璃頂加低橢圓接待室，Gorse是真開放梯形折棚，Pennyfen是兩端曲倒船殼；本款只有一個高拱端和一個低直端，連續變截面封閉屋面",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "meadowsweetherb",
    "nm": "繡線菊植物標本館",
    "en": "Meadowsweet Herbarium",
    "v": 768,
    "shape": "continuous-quatrefoil-brick-lodge-four-half-dome-lobes-low-square-roof-lantern",
    "design": "連續四葉形低磚館、四個半圓外凸葉瓣而非分離小亭、四片半穹板岩屋面接低方形頂燈、葉瓣三聯拱窗與葉間凹入口；中央為實室而非開院",
    "distinctionFromPublished150": "Thistle為中央高八角尖頂加兩個不等半圓翼，Fern為雙分離六角玻璃亭；本款四葉等級的連續低輪廓、低方燈與凹接縫，不能化成中央八角加附房",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "sorrelglove",
    "nm": "酸模製手套館",
    "en": "Sorrelwick Glovers’ Hall",
    "v": 772,
    "shape": "closed-bow-tie-plan-two-flared-polygonal-workrooms-low-solid-waist-twin-hip-roofs",
    "design": "封閉領結形量體、兩端寬多邊裁剪及整理工房、中間窄矮實接待腰部、兩個向外展開低四坡頂、端面寬三聯窗與腰部窄玻璃；沒有院落或亭間缺口",
    "distinctionFromPublished150": "Rowden為兩方亭加凹中央入口，Celandine為兩鼓樓及玻璃直橋；本款牆身真向中央收腰、兩端同軸外張，不能只用兩個普通方盒換名",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "tamargauge",
    "nm": "塔瑪水位量測屋",
    "en": "Tamar Water-Gauge House",
    "v": 776,
    "shape": "shallow-concave-waisted-stone-gauge-tower-six-continuous-grounded-ribs-modest-upper-collar",
    "design": "淺內收腰石造量測塔、六條從加寬基腳連續承托至上圈的可見石肋、小幅外挑上觀測圈及單層淺板岩帽、腰部錯層窄窗與上圈環列窗；不能細腰懸托巨大頭部",
    "distinctionFromPublished150": "Briar為直收分六角木瞭望樓與外階雙帽，Heather為向上外張雙方樓；本款單塔中段先收後放且有連續承重肋，無外階、帆葉或雙帽；不新增水務模擬",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rookspiano",
    "nm": "鴉井鋼琴工房",
    "en": "Rookswell Piano Workshop",
    "v": 780,
    "shape": "solid-asymmetric-kidney-plan-workshop-curved-hip-apron-offset-raised-sound-room",
    "design": "不對稱實心腎形低工房、前緣深凹入口咬口而非開院、連續低曲四坡簷及偏置長方高音室、弧面寬工作窗與高音室細縫窗；兩端寬窄與曲率不同",
    "distinctionFromPublished150": "Ash是開放月牙及偏置犬舍，Withe是連續長S形，Honey是四分圓扇店；本款寬實心腎形、只有一處凹口、沒有兩條S翼或中央庭院",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "hartcurrier",
    "nm": "鹿谷皮革整飾樓",
    "en": "Hartcombe Currier’s Loft",
    "v": 784,
    "shape": "broad-upper-workroom-over-single-perpendicular-masonry-spine-two-open-side-undercrofts-braced-jetties",
    "design": "寬矩形上工房跨在一條垂直方向落地厚磚脊上、兩側真開放底廊、清楚由脊牆接上樓的木斜托架、淺橫向山牆頂、上層長木格窗及下脊門；不是漂浮盒體",
    "distinctionFromPublished150": "Hawthorn為兩端磚錨房托跨院橋，Faversham為柱列托會堂；本款只有一條完整垂直實脊及兩側底廊，跨度與受力由真托架表達，無雙錨穿院或柱市場",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "sainwax",
    "nm": "紅豆草製蠟屋",
    "en": "Sainfoin Wax House",
    "v": 788,
    "shape": "single-pentagonal-three-tier-setback-workhouse-pentagonal-slate-ledges-truncated-cap",
    "design": "單體五邊三級退縮工屋、每層真五面實牆、寬五邊板岩層簷與頂部截尖低帽、深窄工作窗和斜面地層門；五邊輪廓與退台不能由方盒加貼片假造",
    "distinctionFromPublished150": "Brass為單高方鑄造室配雙四坡頂，Norfolk為直角階梯住宅翼，Sissinghurst為多座烘房；本款單一五邊實體逐層退縮，沒有方塔群、住宅階梯翼或環形院",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "brackenlast",
    "nm": "蕨橋鞋楦工房",
    "en": "Brackenbridge Lastmakers’ House",
    "v": 792,
    "shape": "octagonal-ashlar-ground-shop-rectangular-jettied-timber-upper-room-four-corbel-brackets-steep-gable",
    "design": "寬八角石造底店、上方真正長方且明顯挑出的半木工房、四組落在石牆上的木托架、單陡橫山牆、上大方木格窗與下各斜面小窗；上下平面輪廓清楚不同",
    "distinctionFromPublished150": "Arnos為方矮底座上高圓鼓，Briar為通高六角木塔，Bessie為成對高懸挑街屋；本款是八角底店轉長方上工作房的低兩層異形交接，非圓鼓換色或整棟多角屋",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "harecase",
    "nm": "兔林樂器箱工房",
    "en": "Harewood Instrument-Case Works",
    "v": 796,
    "shape": "separated-perpendicular-unequal-gabled-workshops-low-bowed-glazed-corner-link-open-exterior-wedge",
    "design": "長低裁切房與短高組裝房兩座磚山牆工房互成直角且真正分離、只在相對角以低弧玻璃廊連接、外側保留真開楔形空地；長屋大方卸料門、高屋成對圓拱工作窗、廊細直窗梃",
    "distinctionFromPublished150": "Wold為同向錯位高四坡低平頂磚樓配寬實連接，Fen為高雙折庫與低單坡棚且不相連，Fern為玻璃六角亭；本款直角不同高度山牆加低彎廊，不能退化成平行雙盒或院落環",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
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
    if(!root.__wave044GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave044GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave044:1});
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
    if(cap!==false)for(const t of triangulatePlan(points.map(p=>[...p,z1])))S.poly(t,cap===undefined?P.stoneHi:cap);
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
    A.S.flat(x0,x1,y0,y1,z,A.P.woodR); // Closed overhang soffit, not an open floating hip.
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

  // Ear clipping is required because a concave plan is not a convex fan.
  // Roof cells and both sides of every curved sheet use the same triangles.
  function triangulatePlan(points){
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    let q=points.slice(),area=q.reduce((s,p,i)=>s+p[0]*q[(i+1)%q.length][1]-p[1]*q[(i+1)%q.length][0],0);
    if(area<0)q.reverse();const out=[];
    while(q.length>3){
      let cut=false;
      for(let i=0;i<q.length;i++){
        const a=q[(i+q.length-1)%q.length],b=q[i],c=q[(i+1)%q.length];
        if(cross(a,b,c)<=1e-10)continue;
        if(q.some(p=>p!==a&&p!==b&&p!==c&&cross(a,b,p)>=-1e-10&&cross(b,c,p)>=-1e-10&&cross(c,a,p)>=-1e-10))continue;
        out.push([a,b,c]);q.splice(i,1);cut=true;break;
      }
      if(!cut)throw Error('wave044 non-simple or degenerate plan');
    }
    if(q.length===3&&Math.abs(cross(...q))>1e-10)out.push(q);
    return out;
  }
  function roofFace(A,points){
    for(const [a,b,c]of triangulatePlan(points)){
      const u=b.map((v,j)=>v-a[j]),v=c.map((x,j)=>x-a[j]);
      let nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0];
      if(nz<0){nx=-nx;ny=-ny;}const len=Math.hypot(nx,ny)||1;
      A.S.poly([a,b,c],A.K.slate(A.dark(nx/len,ny/len)));
    }
  }
  function roofSheet(A,points,thick=.4){
    for(const t of triangulatePlan(points)){roofFace(A,t);A.S.poly(t.map(p=>[p[0],p[1],p[2]-thick]),A.P.woodR);}
  }
  function roofShell(A,points,thick=.4){
    roofSheet(A,points,thick);
    for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];A.S.poly([a,b,[b[0],b[1],b[2]-thick],[a[0],a[1],a[2]-thick]],A.P.lead);}
  }
  function fascia(A,a,b,thick=.4){A.S.poly([a,b,[b[0],b[1],b[2]-thick],[a[0],a[1],a[2]-thick]],A.P.lead);}
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

/* WAVE044 NEW AUTHORED MODELS */
  function lindenmaps(row,view){
    const A=context(row,view),{S,P}=A,N=16,lo=5,hi=27,eave=13.8,rise=8.2;
    const height=(x,y)=>eave+rise*Math.sqrt(Math.max(0,1-Math.min(((x-16)/11)**2,((y-16)/11)**2)));
    const at=(i,j)=>{const x=lo+22*i/N,y=lo+22*j/N;return[x,y,height(x,y)];};
    // The envelope of two perpendicular barrels has FOUR arched heads. Grid
    // diagonals follow both actual groins, not a cross painted on one barrel.
    for(let i=0;i<N;i++)for(let j=0;j<N;j++){
      const a=at(i,j),b=at(i+1,j),c=at(i+1,j+1),d=at(i,j+1);
      for(const t of i+j===N-1?[[a,b,d],[b,c,d]]:[[a,b,c],[a,c,d]])roofSheet(A,t);
    }
    const hall=A.volume(lo,hi,lo,hi,.6,eave-.4,'stone',false);
    for(const F of Object.values(hall)){
      for(let i=0;i<N;i++){
        const a=F.point(F.length*i/N,0,0),b=F.point(F.length*(i+1)/N,0,0),h0=height(...a),h1=height(...b);
        const E=face(A,a.slice(0,2),b.slice(0,2),F.nx,F.ny);slopeWall(A,E,eave-.4,h0-.4,h1-.4,'stone');fascia(A,[a[0],a[1],h0],[b[0],b[1],h1]);
      }
      A.pane(F,7.4,7.1,7.2,9.8,'arch',true);
      for(const u of[2.1,17.9])A.pane(F,u,3.7,1.8,5.3,'rect',true);
      worldBand(A,F,2.5,.33);
    }
    for(const x of[5,27])for(const y of[5,27]){
      A.volume(x-.6,x+.6,y-.6,y+.6,.6,13.5,'stone');S.box(x-.8,x+.8,y-.8,y+.8,13.5,14.1,P.stone,P.stoneR,P.stoneHi);
    }
    for(const sign of[-1,1])for(let i=0;i<N;i++){
      const x=lo+22*i/N,xx=lo+22*(i+1)/N,y=16+sign*(x-16),yy=16+sign*(xx-16);
      S.beam([x,y,height(x,y)+.07],[xx,yy,height(xx,yy)+.07],P.lead,.26);
    }
    solidDoor(A,hall.front,9.7,.65,2.6,5.7);A.steps(13.6,18.4,27,29,.5,2);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,truePerpendicularBarrelEnvelope:true,fourArchedHeads:true,diagonalGroins:true,groundedCornerPiers:true,closedTriangulatedRoof:true}};
  }

  function wrenumbrella(row,view){
    const A=context(row,view),{S,P}=A,NU=16,NT=12,eave=13.4;
    const at=(u,t)=>[16+(5.4+5.6*t)*u,4.3+23.4*t,eave+11*t*Math.sqrt(Math.max(0,1-u*u))];
    for(let i=0;i<NU;i++)for(let j=0;j<NT;j++){
      const u=-1+2*i/NU,v=-1+2*(i+1)/NU,t=j/NT,s=(j+1)/NT;
      roofSheet(A,[at(u,t),at(v,t),at(v,s)]);roofSheet(A,[at(u,t),at(v,s),at(u,s)]);
    }
    const plan=[at(-1,0).slice(0,2),at(1,0).slice(0,2),at(1,1).slice(0,2),at(-1,1).slice(0,2)],walls=planBlock(A,plan,.6,eave-.4,'brick',false);
    for(const end of[0,1])for(let i=0;i<NU;i++){
      const a=at(-1+2*i/NU,end),b=at(-1+2*(i+1)/NU,end),F=face(A,a.slice(0,2),b.slice(0,2),0,end?1:-1);
      slopeWall(A,F,eave-.4,a[2]-.4,b[2]-.4,'brick');fascia(A,a,b);
    }
    for(const side of[-1,1])fascia(A,at(side,0),at(side,1));
    // Longitudinal ribs follow each distinct conoid generator from a low
    // straight rear edge to the high semicircular working-window end.
    for(const u of[-1,-.72,-.38,0,.38,.72,1])for(let j=0;j<NT;j++){
      const a=at(u,j/NT),b=at(u,(j+1)/NT);S.beam([a[0],a[1],a[2]+.1],[b[0],b[1],b[2]+.1],P.woodR,.32);
    }
    const front=walls[2];A.pane(front,5.3,8.2,11.4,13.2,'arch',true);
    // Radial fan bars stop inside the true semicircular head.
    const c=front.length/2,spring=15.7,r=5.45;
    for(const t of[Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6])S.beam(front.point(c,.38,spring),front.point(c+r*Math.cos(t),.38,spring+r*Math.sin(t)),P.frame,.19);
    for(const F of[walls[1],walls[3]]){A.windows(F,1,4,4.1,0,3.2,3.2,'ribbon');worldBand(A,F,2.5,.3);}
    A.windows(walls[0],1,3,5,0,2.1,4.1,'rect');
    solidDoor(A,front,1.3,.65,3,6.3);solidDoor(A,front,17.7,.65,3,6.3);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,enclosedTaperingBrickHall:true,singleContinuousConoid:true,highSemicircularFront:true,lowStraightRear:true,longitudinalTimberRibs:true,realFanWindow:true}};
  }

  function meadowsweetherb(row,view){
    const A=context(row,view),{S,P}=A,N=12,R=6.1,NR=7,z=11.2,rise=5.1,outline=[];
    // Four outward half-discs joined directly to the filled central square.
    // Their diameter lines are INTERNAL seams, not pavilion gaps or courts.
    for(let side=0;side<4;side++){
      const angle=side*Math.PI/2,n=[Math.cos(angle),Math.sin(angle)],t=[-n[1],n[0]],c=[16+n[0]*R,16+n[1]*R];
      const at=(phi,r)=>[c[0]+R*r*(n[0]*Math.cos(phi)+t[0]*Math.sin(phi)),c[1]+R*r*(n[1]*Math.cos(phi)+t[1]*Math.sin(phi)),z+rise*Math.sqrt(Math.max(0,1-r*r))];
      for(let i=0;i<N;i++){
        const p=-Math.PI/2+Math.PI*i/N,q=-Math.PI/2+Math.PI*(i+1)/N,a=at(p,1),b=at(q,1),F=edgeFace(A,a,b);
        outline.push(a.slice(0,2));S.wall(a.slice(0,2),b.slice(0,2),.6,z-.4,A.mat('brick',F.nx,F.ny));fascia(A,a,b);
        if([3,5,7].includes(i))A.pane(F,.25,3.7,F.length-.5,4.8,'arch',true);
        if(i===10)solidDoor(A,F,.16,.65,F.length-.32,5.1,'wood');
        for(let j=0;j<NR;j++){
          const r0=j/NR,r1=(j+1)/NR;
          if(j===0)roofSheet(A,[at(p,0),at(p,r1),at(q,r1)]);
          else{roofSheet(A,[at(p,r0),at(p,r1),at(q,r1)]);roofSheet(A,[at(p,r0),at(q,r1),at(q,r0)]);}
        }
      }
      // Close the central roof to the same arched half-dome diameter profile,
      // using a matching radius sample on each half; no fictitious flat seam.
      const boundary=[];
      for(let j=NR;j>=0;j--)boundary.push(at(-Math.PI/2,j/NR));
      for(let j=1;j<=NR;j++)boundary.push(at(Math.PI/2,j/NR));
      for(let j=0;j<boundary.length-1;j++){
        const a=boundary[j],b=boundary[j+1],inset=p=>[16+n[0]*2.9+t[0]*((p[0]-c[0])*t[0]+(p[1]-c[1])*t[1])*2.9/R,16+n[1]*2.9+t[1]*((p[0]-c[0])*t[0]+(p[1]-c[1])*t[1])*2.9/R,16.9];
        roofSheet(A,[a,b,inset(b)]);roofSheet(A,[a,inset(b),inset(a)]);
      }
    }
    for(const t of triangulatePlan(outline.map(p=>[...p,10.8])))S.poly(t,P.woodR);
    const lantern=A.volume(13.1,18.9,13.1,18.9,16.5,20.3,'stone');
    for(const F of Object.values(lantern))A.windows(F,1,2,17.1,0,1.7,2.1,'rect');
    hipRoof(A,12.75,19.25,12.75,19.25,20.3,2.2,true);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,continuousFourHalfDiscPlan:true,fourHalfDomeRoofs:true,solidCentralRoom:true,lowSquareLantern:true,lobeTripleArches:true,reentrantEntranceSeams:true}};
  }

  function sorrelglove(row,view){
    const A=context(row,view),{S,P}=A,left=[[3.3,7.4],[13,12.8],[13,19.2],[3.3,24.6]],right=[[19,12.8],[28.7,7.4],[28.7,24.6],[19,19.2]];
    const waist=A.volume(12.8,19.2,12.8,19.2,.6,9.7,'brick');roofShell(A,[[12.8,12.8,10.1],[19.2,12.8,10.1],[19.2,19.2,10.1],[12.8,19.2,10.1]]);
    for(const [q,apex,end]of[[left,[7.9,16,19.1],3],[right,[24.1,16,19.1],1]]){
      const faces=planBlock(A,q,.6,14.1,'brick');
      for(let i=0;i<4;i++)roofShell(A,[[...q[i],14.5],[...q[(i+1)%4],14.5],apex]);
      for(let i=0;i<4;i++){
        const F=faces[i];if(i===end)A.windows(F,1,3,5.1,0,3.1,6.3,'mullion');else if(F.length>8)A.windows(F,1,2,5.3,0,2.7,5.8,'rect');
        worldBand(A,F,2.8,.24);worldBand(A,F,12.7,.2);
      }
    }
    for(const F of[waist.front,waist.back]){A.pane(F,.6,3.8,1.25,4.2,'rect',true);A.pane(F,4.55,3.8,1.25,4.2,'rect',true);solidDoor(A,F,2.2,.65,2,6.3);}
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,closedBowTiePlan:true,twoFlaredPolygonalWorkrooms:true,narrowLowSolidWaist:true,twoLowFourHipRoofs:true,broadTripleEndWindows:true,noPavilionGap:true}};
  }

  function tamargauge(row,view){
    const A=context(row,view),{S,P}=A,N=12,profile=[[.6,8.4],[4.1,8],[13.1,7.15],[23.1,7.05],[32.1,7.75]],phase=Math.PI/12;
    const at=(i,r,z)=>[16+r*Math.cos(phase+i*2*Math.PI/N),16+r*Math.sin(phase+i*2*Math.PI/N),z];
    for(let j=0;j<profile.length-1;j++){
      const [z0,r0]=profile[j],[z1,r1]=profile[j+1];
      for(let i=0;i<N;i++){
        const a=at(i,r0,z0),b=at(i+1,r0,z0),c=at(i+1,r1,z1),d=at(i,r1,z1),angle=phase+(i+.5)*2*Math.PI/N,nx=Math.cos(angle),ny=Math.sin(angle);
        S.poly([a,b,c,d],A.mat('stone',nx,ny));
        if(j>0&&i%2===j%2){
          const F0=face(A,a.slice(0,2),b.slice(0,2),nx,ny),F={length:F0.length,nx,ny};
          F.point=(u,depth,z)=>{const p=F0.point(u,0,z),scale=(r0+(r1-r0)*(z-z0)/(z1-z0))/r0;return[16+(p[0]-16)*scale+nx*depth,16+(p[1]-16)*scale+ny*depth,z];};
          F.panel=(u0,u1,lo,hi,m,depth)=>S.poly([F.point(u0,depth,lo),F.point(u1,depth,lo),F.point(u1,depth,hi),F.point(u0,depth,hi)],m);
          A.pane(F,F.length/2-.75,z0+1.7,1.5,4.2,'rect',true);
        }
      }
    }
    // All six load-bearing ribs follow every waist station continuously.
    // Their feet are broad and grounded; the upper ring is only modestly wider.
    for(let i=0;i<N;i+=2){
      for(let j=0;j<profile.length-1;j++){
        const [za,ra]=profile[j],[zb,rb]=profile[j+1];S.beam(at(i,ra+.18,za),at(i,rb+.18,zb),P.stoneHi,.9);
      }
      const p=at(i,8.4,.6);A.volume(p[0]-.65,p[0]+.65,p[1]-.65,p[1]+.65,.6,2.4,'stone');
    }
    const collar=[];
    for(let i=0;i<N;i++){
      const a=at(i,8.3,32.1),b=at(i+1,8.3,32.1),F=edgeFace(A,a,b);collar.push(a.slice(0,2));
      S.wall(a.slice(0,2),b.slice(0,2),32.1,39.4,A.mat('stone',F.nx,F.ny));A.pane(F,.55,33.5,F.length-1.1,4.1,'rect',true);
      const innerA=at(i,7.75,32.1),innerB=at(i+1,7.75,32.1);S.poly([a,b,innerB,innerA],P.stoneD);
    }
    for(let i=0;i<N;i++)roofShell(A,[at(i,8.7,39.5),at(i+1,8.7,39.5),at(i+1,2.7,43.3),at(i,2.7,43.3)]);
    S.poly(Array.from({length:N},(_,i)=>at(i,2.7,43.3)),P.lead);
    const frontBase=face(A,at(2,8.4,0).slice(0,2),at(3,8.4,0).slice(0,2),Math.cos(phase+2.5*2*Math.PI/N),Math.sin(phase+2.5*2*Math.PI/N));
    const front={length:frontBase.length,nx:frontBase.nx,ny:frontBase.ny};
    front.point=(u,depth,z)=>{const j=z<4.1?0:1,[za,ra]=profile[j],[zb,rb]=profile[j+1],r=ra+(rb-ra)*(z-za)/(zb-za),p=frontBase.point(u,0,z);return[16+(p[0]-16)*r/8.4+front.nx*depth,16+(p[1]-16)*r/8.4+front.ny*depth,z];};
    front.panel=(u0,u1,z0,z1,m,d)=>S.poly([front.point(u0,d,z0),front.point(u1,d,z0),front.point(u1,d,z1),front.point(u0,d,z1)],m);
    solidDoor(A,front,.75,.65,2.1,5.4);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,shallowConcaveStoneWaist:true,sixContinuousGroundedRibs:true,modestUpperObservationCollar:true,singleShallowSlateCap:true,staggeredWaistSlits:true,upperWindowRing:true}};
  }

  function rookspiano(row,view){
    const A=context(row,view),{S,P}=A,curves=[[[3.7,14],[2.8,6],[10,3.7],[17,5.2]],[[17,5.2],[24,3.7],[29,8],[28.4,15]],[[28.4,15],[29,23],[25,27.4],[21.3,24.9]],[[21.3,24.9],[18.3,23],[19,19.4],[16,19.4]],[[16,19.4],[12.8,18.5],[12.5,25.5],[7.9,25.1]],[[7.9,25.1],[3.3,25],[2.9,19],[3.7,14]]];
    const bez=(p,t)=>[0,1].map(k=>(1-t)**3*p[0][k]+3*(1-t)**2*t*p[1][k]+3*(1-t)*t*t*p[2][k]+t**3*p[3][k]);
    const q=curves.flatMap(p=>Array.from({length:4},(_,i)=>bez(p,i/4))),faces=planBlock(A,q,.6,11.2,'brick');
    const inner=q.map(p=>[16+(p[0]-16)*.7,13.6+(p[1]-13.6)*.7]);
    for(let i=0;i<q.length;i++){
      const j=(i+1)%q.length;roofShell(A,[[...q[i],11.6],[...q[j],11.6],[...inner[j],15.2],[...inner[i],15.2]]);
      const F=faces[i];if(F.length>2.3&&![13,14,15,16].includes(i))A.pane(F,.35,4.0,F.length-.7,4.6,'rect',true);
      F.panel(0,F.length,1.9,2.5,P.stoneR,.12);
    }
    // This is a solid concave kidney, not a court or a self-crossing S ribbon.
    for(const t of triangulatePlan(inner.map(p=>[...p,15.2])))roofFace(A,t);
    const sound=A.volume(18.2,24.6,9,15.8,11.2,23.4,'stone');hipRoof(A,17.9,24.9,8.7,16.1,23.4,3.2,false);
    for(const F of Object.values(sound))A.windows(F,1,2,17,0,1.15,4.8,'rect');
    const door=faces[15];solidDoor(A,door,.2,.65,door.length-.4,6.4,'blackwood');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,solidAsymmetricKidneyPlan:true,singleDeepEntranceNotch:true,continuousCurvedHipApron:true,offsetRectangularSoundRoom:true,unequalLobeCurvatures:true,triangulatedConcaveCaps:true}};
  }

  function hartcurrier(row,view){
    const A=context(row,view),{S,P}=A,spine=A.volume(13,19,4.2,27.8,.6,14.1,'brick'),loft=A.volume(3.8,28.2,8,24,14.1,28.3,'whiteplaster');
    // A single perpendicular solid spine meets the complete upper underside.
    // The two side aisles have no phantom walls, caps or glazing below it.
    S.flat(3.8,28.2,8,24,14.1,P.woodR);
    for(const y of[10.1,21.9])for(const side of[-1,1]){
      const x=side<0?13:19,out=side<0?5.0:27.0;
      S.beam([x,y,7.5],[out,y,14.1],P.woodR,.72);S.beam([x,y,14],[out,y,14],P.woodD,.65);
      S.beam([x,y-.3,6.6],[x,y-.3,14.1],P.woodR,.7);
    }
    roofShell(A,[[3.4,8,28.7],[28.6,8,28.7],[28.6,16,34.7],[3.4,16,34.7]]);
    roofShell(A,[[3.4,16,34.7],[28.6,16,34.7],[28.6,24,28.7],[3.4,24,28.7]]);
    for(const [x,nx]of[[3.8,-1],[28.2,1]])S.poly([[x,8,28.3],[x,24,28.3],[x,16,34.3]],A.mat('whiteplaster',nx,0));
    for(const F of Object.values(loft)){
      for(const z of[14.1,16.1,27.8])F.panel(0,F.length,z,z+.5,P.woodR,.22);
      const bays=F.length>20?4:3;A.windows(F,1,bays,18.5,0,F.length>20?4.4:3.4,6.4,'mullion');
      for(let i=0;i<=bays;i++)F.panel(F.length*i/bays-.18,F.length*i/bays+.18,14.1,28.3,P.woodR,.24);
    }
    solidDoor(A,spine.front,1.25,.65,3.5,7.1);solidDoor(A,spine.back,1.25,.65,3.5,7.1);
    for(const F of[spine.left,spine.right])A.windows(F,1,3,8.8,0,2.1,3.1,'rect');
    S.beam([3.4,16,34.8],[28.6,16,34.8],P.lead,.33);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleGroundedPerpendicularBrickSpine:true,broadTransverseUpperWorkshop:true,twoGenuineOpenUndercrofts:true,fourSpineAnchoredKneeBraces:true,closedUnderside:true,shallowTransverseGable:true}};
  }

  function sainwax(row,view){
    const A=context(row,view),{S,P}=A,n=5,phase=-Math.PI/2,at=(r,z)=>Array.from({length:n},(_,i)=>[16+r*Math.cos(phase+i*2*Math.PI/n),16+r*Math.sin(phase+i*2*Math.PI/n),z]);
    const tiers=[[13,.6,11.2],[9.8,12.7,22.1],[6.8,23.6,31.7]];
    for(let level=0;level<3;level++){
      const [r,z0,z1]=tiers[level],q=at(r,z0).map(p=>p.slice(0,2)),walls=planBlock(A,q,z0,z1,'brick');
      for(let i=0;i<n;i++){
        const F=walls[i];A.windows(F,1,level===0?3:2,z0+2.8,0,level===0?2.6:level===1?2.1:1.6,level===2?4.1:5.1,'rect');
        for(const u of[.25,F.length-.6])faceSolid(A,F,u,u+.35,.05,.42,z0,z1);
        worldBand(A,F,z0+.8,.22);if(level===0&&i===1)solidDoor(A,F,F.length/2-1.4,.65,2.8,6.9);
      }
      const outer=at(r+.55,z1+.4),upper=at(level===0?9.8:level===1?6.8:2.6,level===2?36:tiers[level+1][1]);
      for(let i=0;i<n;i++){
        roofShell(A,[outer[i],outer[(i+1)%n],upper[(i+1)%n],upper[i]]);
        const nextRadius=level===0?9.8:level===1?6.8:2.6,underside=z1+(upper[i][2]-(z1+.4))*.55/(r+.55-nextRadius),F=walls[i];
        S.wall(q[i],q[(i+1)%n],z1,underside,A.mat('brick',F.nx,F.ny));
      }
      if(level===2)S.poly(upper,P.lead);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleTruePentagonalPlan:true,threeFivePlaneSetbackTiers:true,broadPentagonalSlateLedges:true,truncatedLowCap:true,deepNarrowWorkingWindows:true,obliqueGroundDoor:true}};
  }

  function brackenlast(row,view){
    const A=context(row,view),{S,P}=A,q=[[8,7],[24,7],[27,10],[27,22],[24,25],[8,25],[5,22],[5,10]],base=planBlock(A,q,.6,12.7,'stone');
    S.box(2.9,29.1,8.8,23.2,12.7,13.4,P.wood,P.woodR,P.woodHi);
    const loft=A.volume(2.9,29.1,8.8,23.2,13.4,25.6,'whiteplaster');S.flat(2.9,29.1,8.8,23.2,12.7,P.woodR);
    // Four real corbel groups terminate in the octagon's vertical side faces,
    // and rise outward to the rectangular floor. The upper room is not a drum.
    for(const [x,out]of[[5,2.9],[27,29.1]])for(const y of[11.2,20.8]){
      S.beam([x,y,7.5],[out,y,13.4],P.woodR,.75);S.beam([x,y,12.9],[out,y,12.9],P.woodD,.7);
      S.beam([x,y,6.9],[x,y,12.9],P.woodR,.85);
    }
    for(let i=0;i<base.length;i++){
      const F=base[i];if(i%2)A.pane(F,.8,4.6,F.length-1.6,4.8,'rect',true);else if(i===4)solidDoor(A,F,6.1,.65,3.8,7.7);else A.windows(F,1,2,4.5,0,2.9,5.3,'rect');
      worldBand(A,F,2.3,.22);
    }
    for(const F of Object.values(loft)){
      const bays=F.length>20?4:2;A.windows(F,1,bays,16.5,0,F.length>20?4.6:4.4,6.5,'mullion');
      for(const z of[13.5,15.2,25.0])F.panel(0,F.length,z,z+.48,P.woodR,.27);
      for(let i=0;i<=bays;i++)F.panel(F.length*i/bays-.22,F.length*i/bays+.22,13.4,25.6,P.woodR,.3);
    }
    roofShell(A,[[2.5,8.8,26],[29.5,8.8,26],[29.5,16,38.3],[2.5,16,38.3]]);
    roofShell(A,[[2.5,16,38.3],[29.5,16,38.3],[29.5,23.2,26],[2.5,23.2,26]]);
    for(const [x,nx]of[[2.9,-1],[29.1,1]]){
      const F=face(A,[x,8.8],[x,23.2],nx,0);S.poly([[x,8.8,25.6],[x,23.2,25.6],[x,16,37.9]],A.mat('whiteplaster',nx,0));
      S.beam([x+nx*.18,16,25.6],[x+nx*.18,16,37.9],P.woodR,.5);
      for(const yy of[11.7,20.3])S.beam([x+nx*.18,yy,25.6],[x+nx*.18,16,35.5],P.woodR,.45);
      A.pane(F,5.8,28.1,2.8,4.1,'rect',true);
    }
    S.beam([2.5,16,38.4],[29.5,16,38.4],P.lead,.36);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,wideOctagonalStoneBase:true,rectangularJettiedUpperWorkshop:true,fourWallAnchoredCorbelGroups:true,steepTransverseGable:true,largeUpperTimberWindows:true,smallChamferWindows:true,unmistakablyDifferentStoreyPlans:true}};
  }

  function harecase(row,view){
    const A=context(row,view),{S,P}=A,low=A.volume(3.7,21.7,4.5,12,.6,12.2,'brick'),high=A.volume(22,29.1,18,29,.6,20.5,'brick');
    A.roof(3.3,22.1,4.1,12.4,12.2,5.5,'x','brick');S.flat(3.3,22.1,4.1,12.4,12.2,P.woodR);
    A.roof(21.6,29.5,17.6,29.4,20.5,7,'y','brick');S.flat(21.6,29.5,17.6,29.4,20.5,P.woodR);
    A.windows(low.back,1,4,4.6,0,3.1,5,'rect');A.windows(low.left,1,2,4.6,0,2,4.4,'rect');
    solidDoor(A,low.front,2.1,.65,6.5,8,'wood');A.pane(low.front,11.3,4.5,3.6,4.7,'mullion',true);
    for(const F of[high.front,high.back])A.windows(F,1,2,7.5,0,2.2,7.1,'arch');
    for(const F of[high.left,high.right])A.windows(F,1,3,9,0,2.1,6,'arch');
    const N=14,half=1.15,sec=Array.from({length:N+1},(_,i)=>{
      const t=i/N,x=(1-t)**2*18.4+2*(1-t)*t*15.5+t*t*22.6,y=(1-t)**2*11.0+2*(1-t)*t*20+t*t*21.5,dx=2*(1-t)*(15.5-18.4)+2*t*(22.6-15.5),dy=2*(1-t)*(20-11.0)+2*t*(21.5-20),l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;
      return{c:[x,y],left:[x-nx*half,y-ny*half],right:[x+nx*half,y+ny*half]};
    });
    for(let i=0;i<N;i++){
      const a=sec[i],b=sec[i+1];
      for(const [p,q]of[[b.left,a.left],[a.right,b.right]]){
        const F=edgeFace(A,p,q);S.wall(p,q,.6,2,A.mat('stone',F.nx,F.ny));
        S.wall(p,q,2,7.1,P.woodR);F.panel(0,F.length,2.2,7.05,P.frameR,.12);F.panel(.1,F.length-.1,2.5,6.6,[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm],.24);
        S.beam([...p,2],[...p,7.4],P.frame,.18);
      }
      // Only each narrow curved bay is spanned. Nothing crosses the exterior
      // wedge separating the two unequal perpendicular workshop blocks.
      for(const t of triangulatePlan([[...a.left,.6],[...b.left,.6],[...b.right,.6],[...a.right,.6]]))S.poly(t,P.stoneR);
      for(const points of[[[...a.left,7.4],[...b.left,7.4],[...b.c,8.5],[...a.c,8.5]],[[...a.c,8.5],[...b.c,8.5],[...b.right,7.4],[...a.right,7.4]]])for(const t of triangulatePlan(points)){S.poly(t,P.glassR);S.poly(t.map(p=>[p[0],p[1],p[2]-.22]),P.frameR);}
      S.beam([...a.left,7.5],[...a.c,8.6],P.frame,.17);S.beam([...a.c,8.6],[...a.right,7.5],P.frame,.17);
      for(const side of['left','right'])fascia(A,[...a[side],7.4],[...b[side],7.4],.3);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,separateUnequalPerpendicularWorkshops:true,longLowCuttingHouse:true,shortHighAssemblyHouse:true,lowBowedGlazedCornerLink:true,trueOpenExteriorWedge:true,loadingDoorAndPairedArches:true}};
  }

  const MODELS=Object.freeze({lindenmaps,wrenumbrella,meadowsweetherb,sorrelglove,tamargauge,rookspiano,hartcurrier,sainwax,brackenlast,harecase});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave044 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave044 four world rotations only');if(!MODELS[id])throw Error('wave044 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave044 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture044=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
