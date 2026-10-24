/* GPT-045 wave17: ten original English civic and specialist buildings.
 * World-space bodies authored for the frozen first-card designs. Only unchanged
 * art634 / 021 material and drawing helpers are shared, never prior model bodies.
 * All opaque surfaces and paired window light share the native depth buffer.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "knapmediation",
    "nm": "矢車菊公共調解館",
    "en": "Knapwell Civic Mediation Rooms",
    "v": 800,
    "shape": "two-unequal-triangular-brick-pavilions-diagonal-open-court-low-end-link-three-plane-hip-roofs",
    "design": "兩個不等高的低三角磚調解室分置近方形地塊兩側，中間保留真斜向露天靜院，只在一端以更低的實入口廊相連；各有三片可讀板岩坡面及不同高頂點，外側成對上下拉窗、院側高窄窗與木門，表達分開的安靜會談空間。",
    "distinctionFromPublished160": "Teaselhat是單一窄高三層實三角楔，Sorrelglove是封閉領結腰，Harecase是直角矩形工房加曲玻璃廊；本款是低雙三角、完整斜向真空院及一端低實連接，無中央實腰、玻璃彎橋、塔或整圈內院。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "adderlens",
    "nm": "蛇舌蕨光學工房",
    "en": "Adderwick Optical Works",
    "v": 804,
    "shape": "solid-long-biconvex-lens-plan-workhall-two-pointed-ends-straight-ridge-faceted-slate-roof",
    "design": "單一細長雙凸透鏡形磚工房，兩端真收尖而兩側向外鼓出，沒有凹口或附塔；直線長屋脊配向兩側及尖端落下的分面板岩坡頂，長側寬橫分格工作窗、尖端兩側窄豎窗、側面小凹木門；用途為鏡片研磨與光學器具工藝展示。",
    "distinctionFromPublished160": "LeedsCorn是橢圓鈍端大廳加圓拱穹頂，Rookspiano是深凹腎形加高音室，Teaselhat是三面窄高楔；本款低長雙凸、兩個清楚尖端及直脊分坡屋頂，不能退化成橢圓鼓樓、單三角盒或改色腎形。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "yarrowbraille",
    "nm": "蓍草點字工房",
    "en": "Yarrowfen Braille House",
    "v": 808,
    "shape": "single-long-two-height-brick-workhall-split-pitch-slate-roof-continuous-vertical-clerestory-step",
    "design": "低前室與較高後工作室沿全長相貼成一個長矩形封閉館，兩個相向但不同標高的板岩坡面在中線留下連續直立採光窗帶；前排低寬木格窗、後室高窄成對窗、側面一大一小實木材料門，無外院或附塔；用途為點字轉錄與觸讀材料製作。",
    "distinctionFromPublished160": "Orchardcraft為三段鋸齒和圓樓梯鼓，Flintchart為放射三鋸齒，Willowmusic為分開V翼蝴蝶谷，Sedgephoto為單陡玻璃坡加低橢圓；本款只有一條完整直線採光高差及低前高後兩級實牆，不做鋸齒串、V平面或玻璃楔頂。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "elderdebate",
    "nm": "接骨木辯論會堂",
    "en": "Elderwick Debating Hall",
    "v": 812,
    "shape": "apseless-basilican-brick-hall-high-long-gabled-centre-two-low-continuous-lean-to-aisles",
    "design": "高窄長中央辯論廳兩側各接一條明顯較矮的連續側廊，中央陡板岩山牆頂與兩側向外落低的單坡頂形成真正三級剖面；中央兩側有高成排窄窗，低廊有小圓頭雙窗，正面深石框木門和三聯高窗；無後殿、鐘塔或宗教符號。",
    "distinctionFromPublished160": "Crossness是三個平行近同高山牆跨，Rookhall是錯T截角山牆加後殿，Larkprint是前寬後窄倒T，RCJ有哥德式側塔與複合翼；本款是一條高中央空間夾兩條連續低側廊的清楚剖面，不是普通三山牆排屋或教堂換名。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "osieroral",
    "nm": "柳溪口述歷史館",
    "en": "Osierbrook Oral History Hall",
    "v": 816,
    "shape": "low-rectangular-hall-two-full-length-brick-sidewalls-single-concave-lead-trough-roof",
    "design": "低矩形口述歷史錄音館，兩道完整長磚側牆承托一片淺單向下凹鉛曲頂，屋面只橫向下垂、縱向等截面；正面寬木格玻璃工作窗上緣隨曲頂下降，側牆高窄窗、兩端實木門與石門框，端部明確收水簷；無架空、無附塔。",
    "distinctionFromPublished160": "Willowmusic為兩翼平面V形蝴蝶谷頂，Pondbadminton為對角高低鞍面，Wrenumbrella為一端高拱一端低直的凸conoid；本款平行落地實側牆間一片單向凹曲屋面，不能改成兩塊平斜板、鞍面或凸桶拱。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "cloudmereweather",
    "nm": "雲澤氣象學舍",
    "en": "Cloudmere Weather School",
    "v": 820,
    "shape": "low-decagonal-brick-classroom-shallow-faceted-slate-dome-real-small-central-oculus",
    "design": "低寬十邊磚氣象學舍，淺分面板岩穹頂中央留真開放觀天孔，孔緣厚鉛翻邊及低環梁，孔下只有相應小型露天觀測空間；外牆交替寬平頂雙窗與實牆、單一石框凹入口；開孔有真內側厚度與可見深度，不用黑色圓貼片，無儀器動畫或氣象模擬。",
    "distinctionFromPublished160": "Alaronde為十六邊住宅及分面尖頂菱窗，Roundhouse為實心蜂巢石穹，Fennelhoney為大露天院的厚環形工房，Thistlenursery有高採光亭和雙後殿；本款是低薄穹頂上的小真觀天孔，無塔、中央高亭、外伸翼或大院。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "coppicelecture",
    "nm": "萌林自然講習館",
    "en": "Coppicefield Nature Lecture Rooms",
    "v": 824,
    "shape": "single-grounded-raked-auditorium-wedge-high-rear-foyer-one-unbroken-sloping-slate-roof",
    "design": "單一落地磚講堂，側影由低前端直升高後端，連續板岩大坡頂下容納同寬高後廳，沒有另外加高盒；厚石基及轉角石框、兩側沿斜剖面上升的三組短豎窗、低前端一組寬窗和偏置木門，表達階梯式自然講習室；無架空步道或附塔。",
    "distinctionFromPublished160": "Leicester及Rogerstevens為多塊階梯講堂、塔和架空連廊組合，Sedgephoto是陡玻璃楔加低橢圓接待室，Brooktools是折轉三段單坡；本款僅一個落地、實板岩頂、無凹轉與附樓的長斜楔，不以小坡屋頂普通方盒代替整體斜剖面。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "shellwickpetitions",
    "nm": "貝原市民陳情室",
    "en": "Shellwick Civic Petition Rooms",
    "v": 828,
    "shape": "solid-D-plan-civic-room-straight-brick-back-semicircular-front-single-radial-half-hip-roof",
    "design": "實心低D形市民陳情館，筆直後牆與寬半圓前牆合成一間完整房體，單一半扇形板岩屋面由直背中央高點向弧簷落下；弧面五組窄長平頂木格窗、直背偏置石門，後端不另加塔或接待翼，沒有內院或開放車棚。",
    "distinctionFromPublished160": "Bramblewheel是高直後工房加低半圓開放車棚及真院，LeedsCorn為完整橢圓穹頂，Honeygrocer為四分圓角店加階梯後翼；本款是低寬實心半圓室與直背、無附樓的放射平面坡頂，不能複製空D院、整橢圓或只把角店屋面放大。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "velvetcostume",
    "nm": "絨谷戲服修護亭",
    "en": "Velvetcombe Costume Pavilion",
    "v": 832,
    "shape": "low-square-stone-workroom-dominant-four-sided-ogee-slate-roof-flared-eaves-short-truncated-ridge",
    "design": "低方形石基戲服修護亭，屋頂占整體高度過半，四面真正連續反曲板岩主頂由下部外張簷收至上部短截脊；四角不加塔，兩側成對高橢圓窗、正面三聯矩形工窗及偏置木門，曲面以有厚度的分段屋面表達，無塔身或上下疊帽。",
    "distinctionFromPublished160": "Asterpost為長身折簷截角頂加五邊郵亭，Brassbell為高方鑄房雙層四坡帽，Guildford和Lynncustoms僅在高塔頂有小曲帽；本款整座低寬工作亭以單一四面反曲主屋頂構成，不能把普通金字塔畫曲線或放大既有塔帽充數。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "broomtranslations",
    "nm": "金雀翻譯事務所",
    "en": "Broomfield Translation Rooms",
    "v": 836,
    "shape": "three-contiguous-staggered-brick-room-ranges-two-real-front-recesses-unequal-complete-hip-roofs",
    "design": "三條沿同一軸相貼的低磚工作室，街面逐間前後錯開並形成兩個真凹角，中間較高而兩側低，三個各自完整的四坡板岩頂清楚分離；前窗分別為寬三聯平窗、成對高上下拉窗和短橫窗，兩凹角內設石框門；沒有院落、指狀空隙、架空或外部連橋，用途為市民文件翻譯。",
    "distinctionFromPublished160": "Netshops是分離窄高尖山牆網屋，Crossness為齊平三跨山牆，Alderjoinery為真院E形指廊，Brooktools為Z形逐級單坡，Woldswitch為雙錯位方塊配寬設備連接和不同頂類；本款低、相貼、中央高的三段折退街面，真凹門與三個完整四坡頂共同辨識，不能只多複製一個Wold方盒或把Brook換頂。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
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
    if(!root.__wave045GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave045GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave045:1});
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
      if(!cut)throw Error('wave045 non-simple or degenerate plan');
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

  // Quoins and plinth courses are actual projecting masonry, not image overlays.
  function dress(A,F,z1,quoin=true){
    worldBand(A,F,.65,.3);worldBand(A,F,2.0,.2);
    if(quoin)for(const u of[.05,F.length-.6])for(let z=2.7;z<z1-.6;z+=1.8)faceSolid(A,F,u,u+.55,0,.18,z,Math.min(z+1.2,z1));
  }
  function triangleHip(A,q,z,apex){
    for(let i=0;i<3;i++){roofSheet(A,[[...q[i],z],[...q[(i+1)%3],z],apex]);fascia(A,[...q[i],z],[...q[(i+1)%3],z]);}
    for(const p of q)A.S.beam([...p,z+.04],apex,A.P.lead,.24);
  }
  function completeHip(A,x0,x1,y0,y1,z,rise){
    const inset=Math.min((x1-x0)/2,(y1-y0)*.26),cx=(x0+x1)/2,a=[cx,y0+inset,z+rise],b=[cx,y1-inset,z+rise];
    const q=[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
    for(const pts of[[q[0],q[1],a],[q[1],q[2],b,a],[q[2],q[3],b],[q[3],q[0],a,b]])roofSheet(A,pts);
    for(let i=0;i<4;i++)fascia(A,q[i],q[(i+1)%4]);A.S.beam(a,b,A.P.lead,.3);
  }
  function ovalWindow(A,F,u,z,rx,rz){
    const {S,K,P}=A,pts=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return F.point(u+rx*Math.cos(a),.24,z+rz*Math.sin(a));});
    S.poly(pts,[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]);K.ring(S,F,u,z,rx+.32,rz+.32,.32,.3,P.stoneHi,24);
    S.beam(F.point(u,.35,z-rz+.2),F.point(u,.35,z+rz-.2),P.frame,.18);S.beam(F.point(u-rx+.2,.35,z),F.point(u+rx-.2,.35,z),P.frame,.18);
  }

/* WAVE045 NEW AUTHORED MODELS */
  function knapmediation(row,view){
    const A=context(row,view),{S,P}=A;
    const qa=[[3.5,3.5],[27,3.5],[3.5,23.5]],qb=[[28.5,8],[28.5,28.5],[5,28.5]];
    const fa=planBlock(A,qa,.6,12.2,'brick'),fb=planBlock(A,qb,.6,15.1,'brick');
    triangleHip(A,qa,12.6,[11.1,10.1,21.3]);triangleHip(A,qb,15.5,[21.1,21.6,25.2]);
    for(const [fs,z,diagonal]of[[fa,12.2,1],[fb,15.1,2]])for(let i=0;i<3;i++){
      const F=fs[i];dress(A,F,z);
      if(i===diagonal){for(const f of[.14,.32,.72,.89])A.pane(F,F.length*f-.825,z-7.3,1.65,5,'rect',true);solidDoor(A,F,F.length*.49,.65,2.6,6.4);}
      else for(let j=0;j<3;j++)for(const du of[-1.7,1.7])A.pane(F,F.length*(j+.5)/3+du-1.05,4.3,2.1,5.7,'rect',true);
    }
    // The entrance link occupies only the southwest end. The diagonal court
    // remains open to the sky continuously from this link to the northeast.
    const link=[[3.5,21.8],[6.8,21.8],[8.8,28.5],[3.5,28.5]],lf=planBlock(A,link,.6,7.8,'stone');
    roofShell(A,link.map(p=>[...p,8.2]));solidDoor(A,lf[2],1,.65,3.1,5.8);
    A.pane(lf[1],1.2,2.6,2.4,3.8,'rect',true);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,twoUnequalTriangularPavilions:true,threePlaneTriangularHips:true,trueDiagonalOpenCourt:true,lowSolidEndLinkOnly:true,pairedSashesAndCourtDoors:true}};
  }

  function adderlens(row,view){
    const A=context(row,view),{S,P}=A,N=12,at=(i,sign)=>{const t=i/N;return[3+26*t,16+sign*8.8*Math.sin(Math.PI*t)];};
    const q=[...Array.from({length:N+1},(_,i)=>at(i,-1)),...Array.from({length:N-1},(_,i)=>at(N-1-i,1))],fs=planBlock(A,q,.6,12.7,'brick');
    const crest=i=>{const x=3+26*i/N;return[x,16,13.1+9.1*Math.min(1,(x-3)/6.5,(29-x)/6.5)];};
    for(const sign of[-1,1])for(let i=0;i<N;i++){
      const a=[...at(i,sign),13.1],b=[...at(i+1,sign),13.1],ra=crest(i),rb=crest(i+1);
      const pts=i===0?[a,b,rb]:i===N-1?[a,b,ra]:[a,b,rb,ra];roofSheet(A,pts);fascia(A,a,b);
    }
    S.beam([9.5,16,22.2],[22.5,16,22.2],P.lead,.32);
    for(let i=0;i<fs.length;i++){
      const F=fs[i];dress(A,F,12.7,false);
      if(i===7)solidDoor(A,F,.3,.65,F.length-.6,7.2);
      else if(i<2||i>21||i===10||i===11||i===12||i===13)A.pane(F,F.length/2-.48,4.1,.96,6.1,'rect',true);
      else A.pane(F,.25,5.2,F.length-.5,4.9,'ribbon',true);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleBiconvexLensBody:true,twoTruePointedEnds:true,straightLongRidge:true,facetedSlopingRoof:true,wideWorkWindowsAndNarrowTipLights:true,noConcavityOrAnnex:true}};
  }

  function yarrowbraille(row,view){
    const A=context(row,view),{S,P}=A,x0=3.8,x1=28.2;
    const low=A.volume(x0,x1,16,26,.6,12.6,'brick',false),high=A.volume(x0,x1,6,16,.6,17.6,'brick',false);
    roofShell(A,[[x0,16,17],[x1,16,17],[x1,26,13],[x0,26,13]]);
    roofShell(A,[[x0,6,18],[x1,6,18],[x1,16,24],[x0,16,24]]);
    for(const [F,a,b]of[[low.left,16.6,12.6],[low.right,12.6,16.6],[high.left,17.6,23.6],[high.right,23.6,17.6]])slopeWall(A,F,Math.min(a,b),a,b,'brick');
    S.wall([x0,16],[x1,16],17.6,23.6,A.mat('brick',0,1));
    const clerestory=face(A,[x0,16],[x1,16],0,1);A.pane(clerestory,.8,18.1,22.8,4.7,'ribbon',true);
    A.windows(low.front,1,4,4.3,0,4.5,4.7,'mullion');
    for(let j=0;j<4;j++)for(const d of[-1.15,1.15])A.pane(high.back,high.back.length*(j+.5)/4+d-.65,7.3,1.3,7.5,'rect',true);
    solidDoor(A,low.left,2.2,.65,4.2,7.5);solidDoor(A,high.right,2.6,.65,2.6,8.7);
    A.pane(low.right,2.2,4.8,4.7,4.9,'mullion',true);A.windows(high.left,1,2,6.7,0,2.4,6.4,'rect');
    for(const F of[low.front,low.left,low.right,high.back,high.left,high.right])dress(A,F,F===high.back?17.6:12.6);
    S.beam([x0,16,24.05],[x1,16,24.05],P.lead,.3);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleLongClosedRectangle:true,lowFrontHighRear:true,twoOpposedUnequalSlatePitches:true,oneUnbrokenVerticalClerestory:true,noSawtoothOrCourtyard:true,unequalMaterialDoors:true}};
  }

  function elderdebate(row,view){
    const A=context(row,view),{S,P}=A,y0=3.8,y1=28.2;
    const main=A.volume(11,21,y0,y1,.6,22,'brick',false),left=A.volume(3.5,11,y0,y1,.6,10.8,'brick',false),right=A.volume(21,28.5,y0,y1,.6,10.8,'brick',false);
    roofShell(A,[[11,y0,22.4],[16,y0,33.6],[16,y1,33.6],[11,y1,22.4]]);
    roofShell(A,[[16,y0,33.6],[21,y0,22.4],[21,y1,22.4],[16,y1,33.6]]);
    roofShell(A,[[3.5,y0,11.2],[11,y0,15.2],[11,y1,15.2],[3.5,y1,11.2]]);
    roofShell(A,[[21,y0,15.2],[28.5,y0,11.2],[28.5,y1,11.2],[21,y1,15.2]]);
    for(const [F,h0,h1]of[[left.front,10.8,14.8],[left.back,14.8,10.8],[right.front,14.8,10.8],[right.back,10.8,14.8]])slopeWall(A,F,10.8,h0,h1,'brick');
    for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[11,y,22],[21,y,22],[16,y,33.2]],A.mat('brick',0,ny));
    for(const F of[main.left,main.right])A.windows(F,1,6,16.8,0,2,4.2,'rect');
    for(const F of[left.left,right.right]){A.windows(F,1,6,3.6,0,2.2,5.3,'arch');dress(A,F,10.8);}
    for(const F of[left.front,left.back,right.front,right.back]){A.windows(F,1,2,3.7,0,2,5.3,'arch');dress(A,F,10.8);}
    solidDoor(A,main.front,3.1,.65,3.8,9.7);A.windows(main.front,1,3,13.9,0,1.9,6.7,'rect');
    A.windows(main.back,1,3,13.9,0,1.9,6.7,'rect');A.windows(main.back,1,2,4.8,0,2.6,5.6,'rect');
    for(const F of[main.front,main.back])dress(A,F,22);S.beam([16,y0,33.65],[16,y1,33.65],P.lead,.32);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,apselessBasilicanSection:true,highNarrowLongCentre:true,twoContinuousLowAisles:true,steepGableAndOutwardLeanToRoofs:true,highClerestoryAndLowRoundHeads:true,noTowerOrReligiousEmblems:true}};
  }

  function osieroral(row,view){
    const A=context(row,view),{S,P}=A,N=16,x0=4.5,x1=27.5,y0=4,y1=28,h=x=>13+5.8*((x-16)/11.5)**2;
    const left=face(A,[x0,y0],[x0,y1],-1,0),right=face(A,[x1,y1],[x1,y0],1,0);
    for(const F of[left,right]){S.wall(F.point(0,0,0).slice(0,2),F.point(F.length,0,0).slice(0,2),.6,18.4,A.mat('brick',F.nx,F.ny));dress(A,F,18.4);A.windows(F,1,5,7.1,0,1.8,6.9,'rect');}
    for(let i=0;i<N;i++){
      const xa=x0+(x1-x0)*i/N,xb=x0+(x1-x0)*(i+1)/N,q=[[xa,y0,h(xa)],[xb,y0,h(xb)],[xb,y1,h(xb)],[xa,y1,h(xa)]];
      S.poly(q,A.dark(xa<16?-1:1,0)?P.slateHi:P.lead);S.poly(q.map(p=>[p[0],p[1],p[2]-.4]),P.woodR);
      for(const [y,ny]of[[y0,-1],[y1,1]]){
        S.poly([[xa,y,.6],[xb,y,.6],[xb,y,h(xb)-.4],[xa,y,h(xa)-.4]],A.mat('brick',0,ny));fascia(A,[xa,y,h(xa)],[xb,y,h(xb)]);
      }
      if(i%2===0)S.beam([xa,y0,h(xa)+.03],[xa,y1,h(xa)+.03],P.lead,.14);
    }
    for(const x of[x0,x1])fascia(A,[x,y0,h(x)],[x,y1,h(x)]);
    for(const [y,ny]of[[y0,-1],[y1,1]]){
      const F=face(A,[x0,y],[x1,y],0,ny);worldBand(A,F,.65,.3);worldBand(A,F,2,.2);
      solidDoor(A,F,1.2,.65,3.3,7.5);
      // A single wide glazed work opening has a genuinely curved head, with
      // each timber mullion terminating below the concave masonry roof edge.
      for(let j=0;j<6;j++){
        const a=6.2+j*2.35,b=a+2.15,za=h(x0+a)-2.1,zb=h(x0+b)-2.1;
        framedPolygon(A,F,[[a,4.7],[b,4.7],[b,zb],[a,za]],true);
        F.panel(a+.18,b-.18,7.3,7.48,P.frame,.35);
      }
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,oneAxisConcaveLeadTrough:true,twoFullGroundedLongWalls:true,closedShapedMasonryEnds:true,constantLongitudinalSection:true,curvedHeadWorkingGlazing:true,endDrainFascias:true,noFloatingCanopy:true}};
  }

  function cloudmereweather(row,view){
    const A=context(row,view),{S,P}=A,N=10,phase=-Math.PI/2,ring=(r,z)=>Array.from({length:N},(_,i)=>[16+r*Math.cos(phase+i*2*Math.PI/N),16+r*Math.sin(phase+i*2*Math.PI/N),z]);
    const outer=ring(13,.6),fs=planBlock(A,outer.map(p=>p.slice(0,2)),.6,12.6,'brick',false);
    const levels=[[13,13],[10.6,16.2],[7.4,18.5],[3.25,19.5]];
    for(let k=0;k<levels.length-1;k++){
      const a=ring(...levels[k]),b=ring(...levels[k+1]);
      for(let i=0;i<N;i++)roofSheet(A,[a[i],a[(i+1)%N],b[(i+1)%N],b[i]]);
    }
    const eave=ring(13,13),inside=ring(2.55,18.6),rimOuter=ring(3.25,19.5),rimTop=ring(2.55,20.2);
    for(let i=0;i<N;i++){
      const j=(i+1)%N;fascia(A,eave[i],eave[j]);
      // No disk or cap is ever placed over the observation shaft. The annular
      // roof, lead upstand and full inner reveals leave the same real aperture.
      S.poly([rimOuter[i],rimOuter[j],rimTop[j],rimTop[i]],P.lead);
      S.poly([rimTop[i],rimTop[j],inside[j],inside[i]],P.stoneD);
      S.poly([[rimOuter[i][0],rimOuter[i][1],19.1],[rimOuter[j][0],rimOuter[j][1],19.1],inside[j],inside[i]],P.woodR);
      S.poly([inside[i],inside[j],[inside[j][0],inside[j][1],.6],[inside[i][0],inside[i][1],.6]],A.mat('stone',-Math.cos(phase+(i+.5)*2*Math.PI/N),-Math.sin(phase+(i+.5)*2*Math.PI/N)));
      const F=fs[i];dress(A,F,12.6,false);
      if(i===4)solidDoor(A,F,F.length/2-1.7,.65,3.4,7.8);
      else if(i%2===0)for(const u of[F.length/2-2.5,F.length/2+.45])A.pane(F,u,4.3,2.05,5.6,'rect',true);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,lowDecagonalBrickClassroom:true,shallowFacetedSlateDome:true,realSmallOpenOculus:true,thickLeadRimAndDeepInnerReveal:true,smallObservationShaftNotCourtyard:true,noCentreCapOrLantern:true}};
  }

  function coppicelecture(row,view){
    const A=context(row,view),{S,P}=A,x0=5,x1=27,y0=3.5,y1=28.5,h=y=>27-(y-y0)*14.2/(y1-y0);
    const back=face(A,[x1,y0],[x0,y0],0,-1),front=face(A,[x0,y1],[x1,y1],0,1),left=face(A,[x0,y0],[x0,y1],-1,0),right=face(A,[x1,y1],[x1,y0],1,0);
    S.wall([x1,y0],[x0,y0],.6,26.6,A.mat('brick',0,-1));S.wall([x0,y1],[x1,y1],.6,12.4,A.mat('brick',0,1));
    slopeWall(A,left,.6,26.6,12.4,'brick');slopeWall(A,right,.6,12.4,26.6,'brick');
    roofShell(A,[[x0,y0,27],[x1,y0,27],[x1,y1,12.8],[x0,y1,12.8]]);
    for(const F of[left,right]){
      worldBand(A,F,.65,.4);worldBand(A,F,2.2,.24);
      for(let j=0;j<3;j++){
        const u=4.5+j*8,y=F.point(u,0,0)[1],z=h(y)-8.2;
        for(const d of[-1.3,1.3])A.pane(F,u+d-.8,z,1.6,4.6,'rect',true);
      }
      for(const u of[.1,F.length-.65])for(let z=3;z<h(F.point(u,0,0)[1])-1;z+=1.8)faceSolid(A,F,u,u+.55,0,.18,z,Math.min(z+1.2,h(F.point(u,0,0)[1])-.5));
    }
    dress(A,front,12.4);dress(A,back,26.6);A.pane(front,2.2,4.7,10.7,5,'mullion',true);solidDoor(A,front,16.7,.65,3.3,7.6);
    A.windows(back,2,4,5.4,10.5,3.1,5.6,'rect');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleGroundedAuditoriumWedge:true,oneUnbrokenSlatePlane:true,highRearFoyerWithinSameBody:true,risingPairedSideWindows:true,thickPlinthAndQuoins:true,noSeparateHighBoxOrWalkway:true}};
  }

  function shellwickpetitions(row,view){
    const A=context(row,view),{S,P}=A,N=15,at=i=>[16+13*Math.cos(i*Math.PI/N),13+13*Math.sin(i*Math.PI/N)],q=Array.from({length:N+1},(_,i)=>at(i)),fs=planBlock(A,q,.6,12.8,'brick',false),apex=[16,13,25.6];
    for(let i=0;i<N;i++){
      roofSheet(A,[[...q[i],13.2],[...q[i+1],13.2],apex]);fascia(A,[...q[i],13.2],[...q[i+1],13.2]);
      const F=fs[i];dress(A,F,12.8,false);
      if(i%3===1)for(const d of[-.55,.55])A.pane(F,F.length/2+d-.4,4.1,.8,6.5,'rect',true);
    }
    const rear=fs[N];S.poly([[3,13,12.8],[29,13,12.8],[16,13,25.2]],A.mat('brick',0,-1));dress(A,rear,12.8);
    solidDoor(A,rear,3.4,.65,3.8,8.1);for(const u of[8.8,12.0,15.2])A.pane(rear,u,13.5,2,4.2,'rect',true);A.pane(rear,17,4.6,5.8,5.6,'mullion',true);
    for(const p of[[3,13,13.2],[29,13,13.2]]){S.beam(p,apex,P.lead,.25);fascia(A,p,apex);}
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,solidDPlanRoom:true,straightRearAndSemicircularFront:true,singleRadialHalfHipRoof:true,fivePairedArcWindowGroups:true,offCentreRearStoneDoor:true,noCourtyardOrAnnex:true}};
  }

  function velvetcostume(row,view){
    const A=context(row,view),{S,P}=A,fs=A.volume(5.3,26.7,5.3,26.7,.6,10.8,'stone',false);
    const profiles=[[12.2,12.2,11.2],[10.4,10.4,12.4],[9.1,9.1,14.7],[8.3,8.3,18.4],[7,7,23.4],[4.8,4.8,28],[2.8,2.8,31.3],[1.6,.75,32.7]],ring=p=>{const [x,y,z]=p;return[[16-x,16-y,z],[16+x,16-y,z],[16+x,16+y,z],[16-x,16+y,z]];};
    for(let k=0;k<profiles.length-1;k++){
      const a=ring(profiles[k]),b=ring(profiles[k+1]);for(let i=0;i<4;i++)roofSheet(A,[a[i],a[(i+1)%4],b[(i+1)%4],b[i]]);
    }
    const bottom=ring(profiles[0]),top=ring(profiles.at(-1));for(let i=0;i<4;i++)fascia(A,bottom[i],bottom[(i+1)%4]);S.poly(top,P.lead);S.poly(top.map(p=>[p[0],p[1],p[2]-.4]),P.woodR);
    // Match the continuous flared-eave soffit to the low stone wall head.
    const wall=ring([10.7,10.7,10.8]);for(let i=0;i<4;i++)S.poly([bottom[i].map((v,j)=>j===2?v-.4:v),bottom[(i+1)%4].map((v,j)=>j===2?v-.4:v),wall[(i+1)%4],wall[i]],P.woodR);
    for(const F of[fs.left,fs.right])for(const u of[6.6,14.8])ovalWindow(A,F,u,5.8,1.55,3.1);
    for(const F of Object.values(fs))dress(A,F,10.8);
    for(const u of[1.5,6.2,10.9])A.pane(fs.front,u,4,3.1,4.7,'rect',true);solidDoor(A,fs.front,17.4,.65,2.6,6.3);
    A.windows(fs.back,1,3,3.9,0,3.2,4.8,'mullion');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,lowSquareStoneWorkroom:true,dominantFourSidedOgeeRoof:true,trueInflectedRoofSections:true,flaredContinuousEave:true,shortTruncatedRidge:true,pairedTallOvalWindows:true,noTowerOrStackedHats:true}};
  }

  function broomtranslations(row,view){
    const A=context(row,view),{S,P}=A;
    // Three directly adjoining room ranges, not detached blocks plus a bridge.
    // Their unequal fronts expose two genuine five-unit-deep entrance returns.
    const blocks=[[3.5,11.5,8,27,12],[11.5,20.5,4,22,17],[20.5,28.5,8,17,13.4]],fs=[];
    for(const [x0,x1,y0,y1,z]of blocks){const f=A.volume(x0,x1,y0,y1,.6,z,'brick',false);fs.push(f);completeHip(A,x0,x1,y0,y1,z+.4,z===17?5.4:z===12?5:4.4);for(const F of Object.values(f))dress(A,F,z);}
    A.pane(fs[0].front,.7,4,6.6,5.5,'mullion',true);
    for(const u of[1.6,5.3])A.pane(fs[1].front,u,5.8,2.1,7.5,'rect',true);
    A.pane(fs[2].front,1.1,6,5.8,3.7,'ribbon',true);
    const door1=face(A,[11.5,22],[11.5,27],1,0),door2=face(A,[20.5,17],[20.5,22],1,0);
    solidDoor(A,door1,1,.65,3,7.6);solidDoor(A,door2,1,.65,3,8.3);
    for(let i=0;i<3;i++)A.windows(fs[i].back,1,2,4.6,0,2.3,5.3,'rect');
    A.windows(fs[0].left,1,4,4.4,0,2.8,5.3,'rect');A.windows(fs[2].right,1,2,4.4,0,2.5,6.1,'rect');
    // The upper centre wall has its own high working lights above its two
    // lower neighbours; these remain on real brick, never beyond a roof edge.
    A.windows(fs[1].left,1,3,13.1,0,2.4,2.6,'ribbon');A.windows(fs[1].right,1,3,13.1,0,2.4,2.6,'ribbon');
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,threeContiguousRoomRanges:true,twoDeepActualFrontRecesses:true,highMiddleAndTwoLowSides:true,threeCompleteUnequalHipRoofs:true,threeDistinctFrontWindowTypes:true,twoRecessStoneDoors:true,noCourtyardFingerGapsOrBridge:true}};
  }

  const MODELS=Object.freeze({knapmediation,adderlens,yarrowbraille,elderdebate,osieroral,cloudmereweather,coppicelecture,shellwickpetitions,velvetcostume,broomtranslations});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave045 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave045 four world rotations only');if(!MODELS[id])throw Error('wave045 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave045 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture045=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
