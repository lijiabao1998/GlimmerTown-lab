/* GPT-029 / wave03. Original deterministic geometric interpretations.
 * Sources in the first-pushed card; native renderer, palette and model unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "stalbans",
    "nm": "聖奧爾本斯鐘樓",
    "en": "St Albans Clock Tower",
    "shape": "tapered-four-stage-flint-belfry-square-ogee-cusped-windows",
    "note": "四段逐層收窄燧石鐘樓、石帶、鐘盤、雙聯尖窗與城垛；不是城堡塔。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1103127"
  },
  {
    "id": "bessie",
    "nm": "紐卡素商人屋",
    "en": "Bessie Surtees House",
    "shape": "paired-five-storey-jettied-merchant-houses",
    "note": "兩棟五層窄深商人屋，一棟挑層木構、一棟磚面；分格窗與陡屋頂。",
    "url": "https://www.english-heritage.org.uk/visit/places/bessie-surtees-house/"
  },
  {
    "id": "ancient",
    "nm": "伊普斯威奇泥塑屋",
    "en": "Ipswich Ancient House",
    "shape": "l-plan-pargetted-house-four-round-oriels-gabled-dormers",
    "note": "四個臨街圓凸窗、側翼凸窗、泥塑牆、閣樓山牆窗與後院。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1037756"
  },
  {
    "id": "pulteney",
    "nm": "巴斯普爾特尼橋屋",
    "en": "Pulteney Bridge",
    "shape": "three-equal-segmental-arches-two-shop-rows-palladian-south",
    "note": "三個等跨拱與兩列店屋；南面山花威尼斯窗、端亭鉛頂，北面挑出坡頂。歷史外觀展示。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1394514"
  },
  {
    "id": "piecehall",
    "nm": "哈利法克斯布廳",
    "en": "Halifax Piece Hall",
    "shape": "quadrangle-court-two-and-three-storey-gallery-orders",
    "note": "四翼圍院、東高西低、石柱分層廊道、角部石梯與雙坡石板頂。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1273056"
  },
  {
    "id": "exchange",
    "nm": "曼徹斯特交易廳",
    "en": "Manchester Royal Exchange",
    "shape": "giant-arched-order-mansard-three-glazed-domes-corner-turret",
    "note": "厚石砌基座、大跨拱窗、古典柱式、孟莎閣樓、三座玻璃穹頂與角塔。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1200826"
  },
  {
    "id": "chichester",
    "nm": "奇切斯特市集十字亭",
    "en": "Chichester Market Cross",
    "shape": "octagonal-gothic-vault-eight-buttress-piers-clock-belfry",
    "note": "八角尖拱廊、扶壁墩與尖飾，石拱頂匯入中央鐘亭；保留透空底層。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1005890"
  },
  {
    "id": "willis",
    "nm": "伊普斯威奇威利斯樓",
    "en": "Willis Building Ipswich",
    "shape": "curvilinear-hung-bronze-glass-roof-garden-setback-pavilion",
    "note": "曲面連續銅色玻璃皮、草頂與退後綠籬、第四層退縮玻璃亭；不新增辦公或公園機制。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1237417"
  },
  {
    "id": "roundhouse",
    "nm": "卡斯爾卡里圓屋",
    "en": "Castle Cary Round House",
    "shape": "tiny-circular-lockup-beehive-stone-dome-ball-finial",
    "note": "小圓形石體、蜂巢形石圓頂、球飾與四級門階，只有通氣孔不杜撰窗列。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1056279"
  },
  {
    "id": "faversham",
    "nm": "法弗舍姆架空行會廳",
    "en": "Faversham Guildhall",
    "shape": "raised-council-hall-three-column-rows-corner-clock-cupola",
    "note": "三排八角柱架空上廳，南拱窗與北威尼斯窗、兩端山花、角置四段鐘塔與鉛頂小亭。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1343844"
  }
].map((q,i)=>Object.freeze({...q,v:240+4*i})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0')};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      if(kind==='flint')return(u,z)=>{const n=K.hash(Math.floor(u*2.8),Math.floor(z*2.8),2904);return n%7<2?(d?Q.creamD:Q.creamHi):(d?P.stoneD:P.stoneR);};
      if(kind==='brick')return K.brick(d,2901);
      if(kind==='stone')return K.ashlar(d,2902);
      if(kind==='steel')return(u,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(u,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
      return(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),2903)%47===0?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
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
        const tex=kind==='stone'?K.ashlar(dark(Math.cos(m),Math.sin(m)),2927):kind==='lead'?(dark(Math.cos(m),Math.sin(m))?Q.steelD:Q.steel):K.slate(dark(Math.cos(m),Math.sin(m)));
        S.poly([[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,z0],[cx+Math.cos(b)*r0,cy+Math.sin(b)*r0,z0],[cx+Math.cos(b)*r1,cy+Math.sin(b)*r1,z1],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,z1]],tex);
      }
    }
    function parapet(x0,x1,y0,y1,z,battled){
      for(const [xa,xb,ya,yb]of[[x0,x1,y0,y0+.45],[x0,x1,y1-.45,y1],[x0,x0+.45,y0,y1],[x1-.45,x1,y0,y1]])S.box(xa,xb,ya,yb,z,z+1.7,P.stone,P.stoneR,P.stoneHi);
      if(battled)for(let u=x0;u<x1;u+=2.6)for(const y of[y0,y1-.8])S.box(u,Math.min(u+1.35,x1),y,y+.8,z+1.7,z+3,P.stone,P.stoneR,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++)S.box(x0,x1,y0+(y1-y0)*i/n,y1,.42,.42+rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}
    function chimney(x,y,z,h){volume(x-.65,x+.65,y-.7,y+.7,z,z+h,'brick');S.box(x-.9,x+.9,y-.9,y+.9,z+h,z+h+.7,P.stone,P.stoneR,P.stoneHi);for(const dx of[-.38,.38])K.cylinder(S,x+dx,y,z+h+.7,z+h+2.5,.24,.28,Q.red,Q.redD,P.ink,8);}
    if(!root.__wave029GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave029GeometryOnly){K.lantern(S,3.2,28.4,4.3,true);K.lantern(S,28.8,28.4,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave029:1});
    }
    return{...H,S,K,P,Q,mat,volume,roof,pane,windows,polygon,cone,parapet,steps,chimney,finish};
  }


  // Glass is behind projecting jambs/sills, so detail has actual geometric depth.
  function details(A){
    const {S,P,Q}=A,counts={windows:0,sills:0,mullions:0,cornices:0,roofRibs:0};
    function pane(F,u,z,w,h,type,lit){
      A.pane(F,u,z,w,h,type||'ribbon',lit);
      F.block(u-.4,u-.06,.05,.66,z-.35,z+h+.4,P.stoneHi,P.stoneR,P.stoneHi);
      F.block(u+w+.06,u+w+.4,.05,.66,z-.35,z+h+.4,P.stoneHi,P.stoneR,P.stoneHi);
      F.block(u-.52,u+w+.52,.05,1.02,z-.55,z-.12,P.stone,P.stoneR,P.stoneHi);
      F.block(u-.42,u+w+.42,.05,.82,z+h+.12,z+h+.56,P.stone,P.stoneR,P.stoneHi);
      const n=Math.max(2,Math.round(w/2.2));
      for(let j=1;j<n;j++){F.block(u+w*j/n-.07,u+w*j/n+.07,.25,.43,z+.2,z+h-.2,Q.steelD,Q.steelD,Q.steel);counts.mullions++;}
      if(h>5)F.panel(u+.25,u+w-.25,z+h*.5-.08,z+h*.5+.08,Q.steelD,.44);
      counts.windows++;counts.sills++;
    }
    function cornice(F,z){F.block(-.35,F.length+.35,0,.72,z,z+.42,P.stone,P.stoneR,P.stoneHi);F.block(-.48,F.length+.48,.02,1,z+.42,z+.75,P.stoneHi,P.stoneR,P.stoneHi);counts.cornices++;}
    function ribs(a,b){S.beam(a,b,Q.steelD,.22);counts.roofRibs++;}
    return{pane,cornice,ribs,counts};
  }
  function arcade(A,a,b,nx,ny,bays,z0,spring,rise,top){
    const {S,P}=A,F=Object.assign(S.face(a,b,nx,ny),{nx,ny}),step=F.length/bays,pier=.72;
    for(let k=0;k<=bays;k++){
      const u=k*step;F.block(Math.max(0,u-pier/2),Math.min(F.length,u+pier/2),-.4,.4,z0,spring,P.stone,P.stoneR,P.stoneHi);
      F.block(Math.max(-.1,u-.61),Math.min(F.length+.1,u+.61),-.56,.56,spring-.45,spring+.15,P.stoneHi,P.stoneR,P.stoneHi);
    }
    for(let k=0;k<bays;k++)for(let j=0;j<12;j++){
      const left=k*step+pier/2,w=step-pier,at=t=>[left+w*t,spring+rise*Math.sqrt(Math.max(0,1-(2*t-1)**2))],p=at(j/12),q=at((j+1)/12);
      for(const d of[-.4,.4])S.poly([F.point(p[0],d,p[1]),F.point(q[0],d,q[1]),F.point(q[0],d,top),F.point(p[0],d,top)],A.mat('stone',nx*d,ny*d));
      S.poly([F.point(p[0],-.4,p[1]),F.point(q[0],-.4,q[1]),F.point(q[0],.4,q[1]),F.point(p[0],.4,p[1])],P.stoneD);
      if(j%2===0)S.beam(F.point(p[0],.43,p[1]),F.point(p[0],.43,p[1]+.6),P.stoneHi,.16);
    }
    return F;
  }

  function clock(A,F,u,z,r){
    const {S,P}=A,cx=u,cy=z;
    const ring=(radius,col,offset)=>S.poly(Array.from({length:24},(_,i)=>F.point(cx+radius*Math.cos(i*Math.PI/12),offset,cy+radius*Math.sin(i*Math.PI/12))),col);
    ring(r+.38,P.stoneHi,.6);ring(r,P.ironD,.72);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;S.beam(F.point(cx+Math.cos(a)*r*.78,.84,cy+Math.sin(a)*r*.78),F.point(cx+Math.cos(a)*r*.9,.84,cy+Math.sin(a)*r*.9),P.warm,.13);}
    S.beam(F.point(cx,.9,cy),F.point(cx+r*.63,.9,cy),P.warm,.18);S.beam(F.point(cx,.9,cy),F.point(cx,.9,cy+r*.74),P.warm,.16);
  }
  function band(A,F,z,depth){const {P}=A;F.block(-.25,F.length+.25,0,depth||.65,z,z+.65,P.stoneHi,P.stoneR,P.stoneHi);}
  function timber(A,F,z0,z1,bays){
    const {S,P,Q}=A;
    for(const z of[z0,z1])F.block(0,F.length,.05,.42,z,z+.42,Q.oak,Q.oakD,P.woodHi);
    for(let i=0;i<=bays;i++){const u=i*F.length/bays;F.block(u-.16,u+.16,.05,.38,z0,z1,Q.oak,Q.oakD,P.woodHi);}
    for(let i=0;i<bays;i++){const u=i*F.length/bays;S.beam(F.point(u+.25,.4,z0+.5),F.point(u+F.length/bays-.25,.4,z0+2.6),Q.oakD,.23);}
  }
  function dome(A,cx,cy,r,z,h,glass){
    const {S,K,P}=A;
    for(let band=0;band<5;band++)for(let i=0;i<20;i++){
      const a=i*Math.PI/10,b=(i+1)*Math.PI/10,t0=band*Math.PI/10,t1=(band+1)*Math.PI/10,p=(a,t)=>[cx+r*Math.cos(a)*Math.cos(t),cy+r*Math.sin(a)*Math.cos(t),z+h*Math.sin(t)];
      S.poly([p(a,t0),p(b,t0),p(b,t1),p(a,t1)],glass?[A.dark(Math.cos(a),Math.sin(a))?P.glassR:P.glass,P.warm]:K.slate(A.dark(Math.cos(a),Math.sin(a))));
      S.beam(p(a,t0),p(a,t1),P.lead,.16);if(band%2===0)S.beam(p(a,t0),p(b,t0),P.lead,.16);
    }
  }
  function stalbans(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const floors=[];
    for(let i=0;i<4;i++){
      const inset=i*.38,F=volume(10+inset,22-inset,9+inset,21-inset,.45+i*14,14.45+i*14,'flint');floors.push(F);
      for(const f of Object.values(F)){
        // Flint infill and long/short freestone quoins are independent geometry.
        for(let z=.7+i*14;z<14.2+i*14;z+=2.1)for(const u of[.1,f.length-.62])f.block(u,u+.52,.03,.44,z,z+.85,P.stoneHi,P.stoneR,P.stoneHi);
        band(A,f,14.45+i*14,.8);
      }
    }
    for(const f of[floors[0].front,floors[0].back]){D.pane(f,2.6,2,6.8,8.2,'pointed',false);}
    for(const f of Object.values(floors[1])){D.pane(f,4.2,17.6,2.6,4.7,'pointed',false);D.pane(f,4.2,23.4,2.6,3.5,'pointed',false);}
    for(const f of[floors[2].front,floors[2].right])clock(A,f,f.length/2,36.5,3.5);
    for(const f of Object.values(floors[3])){
      D.pane(f,2.2,46,6.1,7.6,'pointed',false);f.block(5.1,5.42,.15,.8,46,53.3,P.stone,P.stoneR,P.stoneHi);
      for(const u of[2.7,6.2])S.beam(f.point(u,.8,49.5),f.point(u+1.4,.8,51.9),P.stoneHi,.3);
    }
    A.parapet(10.5,21.5,9.5,20.5,57,true);
    for(const x of[10.5,21.5])for(const y of[9.5,20.5])S.box(x-.65,x+.65,y-.65,y+.65,55.5,57.4,P.stone,P.stoneR,P.stoneHi);
    A.steps(12,20,21,25,1.1,3);
    return{...A.finish(),details:{...D.counts,stages:4,clockFaces:2,roof:'battlemented-flat-belfry-no-castle-turrets'}};
  }
  function bessie(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    // Two adjoining narrow, deep houses; the timber house has real progressive jetties.
    for(let level=0;level<5;level++){
      const front=27+level*.37,F=volume(3,15.1,6,front,.5+level*9.1,9.6+level*9.1,'plaster');
      for(const f of[F.front,F.back]){timber(A,f,.7+level*9.1,9.1+level*9.1,3);for(let bay=0;bay<3;bay++)D.pane(f,1+bay*3.8,2.2+level*9.1,2.6,5.5,'mullion');}
      for(const f of[F.left,F.right]){timber(A,f,.7+level*9.1,9.1+level*9.1,5);for(let bay=0;bay<4;bay++)A.pane(f,1.4+bay*4.7,2.4+level*9.1,2.9,4.9,'mullion');}
    }
    const B=volume(15.4,28.1,6,27,.5,46,'brick');
    for(const f of Object.values(B)){for(let l=0;l<5;l++)for(let b=0;b<(f.length>15?4:3);b++)D.pane(f,f.length*(b+.5)/(f.length>15?4:3)-1.1,2.2+l*9.1,2.2,5.7,'sash');D.cornice(f,46);}
    A.roof(2.5,15.7,5.6,29,46,9,'y','plaster');A.hip(15,28.5,5.6,27.4,46.6,8,false);
    A.chimney(4.7,9.5,48,5);A.chimney(26.2,22,48,4);
    const F=Object.assign(S.face([3,27],[15.1,27],0,1),{nx:0,ny:1});K.timberDoor(F,4.7,.65,2.7,7.2,true);
    return{...A.finish(),details:{...D.counts,storeys:5,adjoiningHouses:2,jetties:4,roof:'deep-gabled-and-hipped-merchant-house-roofs'}};
  }
  function ancient(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const B=volume(2.8,29.2,17.2,27,.5,9.2,'plaster'),U=volume(2.4,29.6,16.7,27.6,9.2,20,'plaster'),W=volume(2.4,10,3.5,17.2,.5,20,'plaster');
    for(const f of[B.front,B.right,B.left]){for(let j=0;j<Math.floor(f.length/3);j++)D.pane(f,.45+j*3,1.5,2.1,6.4,'mullion');}
    function oriel(F,u){
      const points=[[u,0],[u-.35,.75],[u+.25,1.9],[u+2.4,2.5],[u+4.55,1.9],[u+5.15,.75],[u+4.8,0]];
      for(let i=0;i<points.length-1;i++){
        const p=F.point(points[i][0],points[i][1],0),q=F.point(points[i+1][0],points[i+1][1],0),dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len,f=Object.assign(S.face([p[0],p[1]],[q[0],q[1]],nx,ny),{nx,ny});
        S.wall([p[0],p[1]],[q[0],q[1]],10,19,A.mat('plaster',nx,ny));if(f.length>1.1)D.pane(f,.18,12.2,f.length-.36,5.8,'mullion');band(A,f,10,.45);band(A,f,19,.45);
      }
      S.poly(points.map(p=>F.point(p[0],p[1],19.7)),P.lead);
      // Pargetting remains relief on wall below the bay, not luminous symbols.
      for(let j=0;j<3;j++){const x=u+.8+j*1.2;S.beam(F.point(x,.45,10.2),F.point(x+.35,.7,11.5),P.stoneHi,.18);}
    }
    for(let i=0;i<4;i++)oriel(U.front,.85+i*6.35);oriel(W.left,3.2);
    for(const f of[U.back,W.right,W.back]){timber(A,f,10,19.5,4);for(let j=0;j<3;j++)D.pane(f,f.length*(j+.5)/3-1.4,12,2.8,5.6,'mullion');}
    A.roof(2,30,16.1,28.2,20.5,7,'x','plaster');A.roof(2,10.5,3,17,20.5,6,'y','plaster');
    for(let j=0;j<4;j++){
      const x=4.1+j*6.55,G=volume(x,x+3.7,25.2,28.7,20.3,24.8,'plaster');D.pane(G.front,.65,21.1,2.4,3,'mullion');A.roof(x-.3,x+4,24.9,29,24.8,3,'y','plaster');
    }
    A.chimney(5.8,6,23,3);A.chimney(24.5,20.2,23,3);
    return{...A.finish(),details:{...D.counts,frontRoundedOrielBays:4,sideOrielBays:1,gabledDormers:4,roof:'L-wing-tiled-pitches-four-projecting-gabled-dormers'}};
  }
  function pulteney(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    for(const [a,b,nx,ny]of[[[2,23],[30,23],0,1],[[30,9],[2,9],0,-1]])arcade(A,a,b,nx,ny,3,.45,6.8,6.7,15.6);
    S.box(1.7,30.3,8.7,23.3,15.7,16.5,P.stone,P.stoneR,P.stoneHi);
    const south=volume(2,30,19.3,23,16.5,26,'stone'),north=volume(2,30,8.7,12.7,16.5,24.7,'stone');
    for(let i=0;i<9;i++){D.pane(south.front,.8+i*3,18.6,2,5.1,'sash');D.pane(north.back,.8+i*3,18,2,5.2,'sash');}
    for(const f of[south.front,north.back]){D.cornice(f,26);for(const u of[.3,8.8,18.4,27.2])f.block(u,u+.4,.05,.65,16.8,26,P.stoneHi,P.stoneR,P.stoneHi);}
    const centre=Object.assign(S.face([12.1,23.25],[19.9,23.25],0,1),{nx:0,ny:1});D.pane(centre,2.4,19.2,3,7.5,'arch');D.pane(centre,.2,19.2,1.4,5.1,'sash');D.pane(centre,6,19.2,1.4,5.1,'sash');
    S.poly([[11.5,23.8,26],[20.5,23.8,26],[16,23.8,31]],A.mat('stone',0,1));S.beam([11.5,23.85,26],[16,23.85,31],P.stoneHi,.3);S.beam([16,23.85,31],[20.5,23.85,26],P.stoneHi,.3);
    // The altered north shop row projects and has a continuous pent roof.
    A.shed(1.6,30.4,8.2,13.2,25,3.2);
    for(const x of[2.5,25.5]){const V=volume(x,x+4,19,23.8,26,30.3,'stone');for(const f of[V.front,V.left,V.right])D.pane(f,.9,26.5,2.2,2.6,'sash');dome(A,x+2,21.4,2.7,30.5,3.6,false);}
    A.roof(2,30,19,23.8,26.2,3,'x','stone');S.flat(2,30,13.1,19.1,16.6,K.paving);
    return{...A.finish(),details:{...D.counts,equalSegmentalSpans:3,shopRows:2,roof:'south-pediment-and-lead-pavilion-domes-north-jettied-pent-roof',functionalBridge:false}};
  }
  function piecehall(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const ranges=[{r:[2.8,7.2,2.8,29.2],levels:2,inner:'right'},{r:[24.8,29.2,2.8,29.2],levels:3,inner:'left'},{r:[7.2,24.8,2.8,7.2],levels:3,inner:'front'},{r:[7.2,24.8,24.8,29.2],levels:3,inner:'back'}];
    for(const q of ranges){
      const [x0,x1,y0,y1]=q.r,top=q.levels*8.4+1,F=volume(x0,x1,y0,y1,.5,top,'stone'),f=F[q.inner];
      for(let l=0;l<q.levels;l++){
        const z=1+l*8.4;band(A,f,z,1.9);
        for(let j=0;j<5;j++){
          const u=f.length*(j+.5)/5;D.pane(f,u-.9,z+1.5,1.8,4.6,'mullion');
          const p=f.point(u,1.9,0);if(l===q.levels-1)K.cylinder(S,p[0],p[1],z+.6,z+7.6,.36,.31,P.stone,P.stoneR,P.stoneHi,12);else f.block(u-.37,u+.37,1.5,2.25,z+.6,z+7.6,P.stone,P.stoneR,P.stoneHi);
          f.block(u-.6,u+.6,1.35,2.4,z+7.1,z+7.6,P.stoneHi,P.stoneR,P.stoneHi);
          if(j<4)for(let b=1;b<6;b++)f.block(u+b*.58,u+b*.58+.08,1.88,1.97,z+1,z+2.5,P.ironD,P.ironD,P.iron);
        }
        band(A,f,z+7.7,2.5);
      }
      A.roof(x0-.2,x1+.2,y0-.2,y1+.2,top+.7,3,(x1-x0)>(y1-y0)?'x':'y','stone');
    }
    for(const x of[8.1,22])for(const y of[8.2,22]){for(let s=0;s<8;s++)S.box(x,x+1.8,y+s*.3,y+2.6,.6,1+s*.65,P.stone,P.stoneR,P.stoneHi);}
    // Lower eastern arcade reads as openings between piers; court remains empty.
    arcade(A,[24.65,8],[24.65,24],-1,0,4,.5,4,2.3,7.8);
    const gate=volume(2.4,7.6,13.1,18.9,.5,19,'stone');D.pane(gate.left,1.4,2,3.2,9,'arch',false);A.hip(2.1,7.9,12.8,19.2,19.4,3,true);
    A.polygon(5,16,1.1,22.4,26,8,'stone');A.cone(5,16,1.6,0,26,29,8,'lead');
    return{...A.finish(),details:{...D.counts,courtyard:true,westStoreys:2,eastStoreys:3,cornerStairs:4,roof:'four-double-pitched-stone-slate-ranges-open-quadrangle'}};
  }
  function exchange(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const B=volume(3.2,28.8,4.2,27.8,.5,37,'stone');
    for(const f of Object.values(B)){
      for(let j=0;j<4;j++){
        const u=f.length*(j+.5)/4;D.pane(f,u-1.8,3,3.6,7.8,'arch',false);D.pane(f,u-2.1,13,4.2,17,'arch');D.pane(f,u-1.5,31,3,4.6,'mullion');
        f.block(u-2.7,u-2.12,.05,.85,11.8,35.8,P.stoneHi,P.stoneR,P.stoneHi);f.block(u-3,u-1.8,.04,1.1,34.7,35.5,P.stoneHi,P.stoneR,P.stoneHi);
        if(j<3)f.block(u+2.3,u+2.9,.05,.9,1,10.5,P.stone,P.stoneR,P.stoneHi);
      }
      for(const z of[11,36.5,38])D.cornice(f,z);
    }
    const attic=volume(3.6,28.4,4.6,27.4,38.8,44.4,'stone');for(const f of Object.values(attic)){for(let i=0;i<7;i++)D.pane(f,f.length*(i+.5)/7-1,39.5,2,3.8,'mullion');D.cornice(f,44.4);}
    A.mansard(3,29,4,28,45.2,8.4,3.4);
    for(const [x,r]of[[9,3.1],[16,4.2],[23,3.1]]){A.polygon(x,16,r,52.2,53.2,20,'stone');dome(A,x,16,r,53.4,r*1.25,true);}
    const T=volume(3.1,8.7,4,9.6,38,56.5,'stone');for(const f of Object.values(T)){D.pane(f,1.1,47,3.4,6.4,'arch');D.cornice(f,56.5);}
    A.polygon(5.9,6.8,2.7,57.2,60.7,8,'stone');A.cone(5.9,6.8,3.2,.4,60.7,66,8,'lead');
    A.steps(11.2,20.8,28,30.5,2,4);
    return{...A.finish(),details:{...D.counts,glazedDomes:3,mainStoreys:4,atticStoreys:2,roof:'mansard-three-glazed-trading-hall-domes-and-baroque-corner-turret'}};
  }
  function chichester(row,view){
    const A=context(row,view),{S,K,P,Q}=A,points=Array.from({length:8},(_,i)=>{const t=Math.PI/8+i*Math.PI/4;return[16+10*Math.cos(t),16+10*Math.sin(t)];});
    A.polygon(16,16,11.3,.43,1.1,8,'stone',Math.PI/8);
    for(let i=0;i<8;i++){
      const p=points[i],q=points[(i+1)%8],t=(i+.5)*Math.PI/4+Math.PI/8,nx=Math.cos(t),ny=Math.sin(t),f=arcade(A,p,q,nx,ny,1,1.1,8.3,4.5,15.5);
      band(A,f,15.6,.9);for(let j=0;j<3;j++)f.panel(1.2+j*1.6,2+j*1.6,13.8,14.8,P.stoneHi,.55);
      const [x,y]=p;K.cylinder(S,x,y,1.2,18,.82,.64,P.stone,P.stoneR,P.stoneHi,8);A.cone(x,y,1.2,.12,18,23.5,4,'slate');
      S.poly([[...p,16.3],[...q,16.3],[16,16,29.4]],A.mat('stone',nx,ny));S.beam([...p,16.6],[16,16,29.7],P.stoneHi,.45);
    }
    K.cylinder(S,16,16,1.1,18,.8,.65,P.stone,P.stoneR,P.stoneHi,8);
    const tower=A.polygon(16,16,2.6,28.8,38.2,8,'stone',Math.PI/8);
    for(const [j,f]of tower.entries()){if(j%2===0)clock(A,f,f.length/2,32.7,1.1);}
    A.polygon(16,16,3,38.2,39,8,'stone',Math.PI/8);
    for(let j=0;j<8;j++){const a=Math.PI/8+j*Math.PI/4;K.cylinder(S,16+Math.cos(a)*1.8,16+Math.sin(a)*1.8,39,44,.17,.13,P.stoneHi,P.stoneR,P.stoneHi,8);}
    A.cone(16,16,2.8,.3,44,48.6,8,'lead');S.beam([16,16,48.6],[16,16,51],P.ironD,.2);
    return{...A.finish(),details:{openArches:8,buttressPiers:8,octagonalVault:true,roof:'radial-stone-vault-pinnacles-clock-belfry'}};
  }
  function willis(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,C}=A;
    const bronze=C('4c5953'),bronzeHi=C('758778'),turf=C('819568'),turfR=C('637b54');
    const points=Array.from({length:40},(_,i)=>{const t=i*Math.PI/20,adjust=1+.08*Math.sin(3*t);return[16+12.8*Math.cos(t)*adjust,16+10.7*Math.sin(t)*adjust];});
    for(let j=0;j<points.length;j++){
      const p=points[j],q=points[(j+1)%points.length],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len,F=Object.assign(S.face(p,q,nx,ny),{nx,ny});
      // Three storeys of suspended bronze glazing: joints are patch fittings,
      // not invented regular heavy mullions or a curved concrete parking lip.
      S.wall(p,q,.65,27.6,A.dark(nx,ny)?bronze:bronzeHi);
      for(let l=0;l<3;l++){
        F.panel(.08,F.length-.08,2.1+l*8.4,8.2+l*8.4,[A.dark(nx,ny)?bronze:bronzeHi,P.warm],.07);
        for(const u of[.1,F.length-.1])F.block(u-.07,u+.07,.08,.15,2.5+l*8.4,2.8+l*8.4,P.lead,P.lead,P.lead);
        F.panel(.1,F.length-.1,8.8+l*8.4,9+l*8.4,P.ironD,.13);
      }
      S.beam([...p,27.8],[...q,27.8],P.lead,.25);
      const h=[16+(p[0]-16)*.9,16+(p[1]-16)*.9],k=[16+(q[0]-16)*.9,16+(q[1]-16)*.9];S.beam([...h,29],[...k,29],turfR,.82);
    }
    S.poly(points.map(p=>[...p,28]),(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),2921)%5?turf:turfR);
    const R=A.volume(9.8,22.2,10.1,21.9,28.2,35.3,'steel');for(const f of Object.values(R))D.pane(f,.35,28.8,f.length-.7,5.6,'ribbon');S.box(9.4,22.6,9.7,22.3,35.4,36.1,P.lead,P.lead,P.lead);
    const front=Object.assign(S.face([12,27],[20,27],0,1),{nx:0,ny:1});D.pane(front,2.2,.7,3.6,7.2,'ribbon');K.cylinder(S,16,27.2,.6,7.4,1.6,1.6,[P.glass,P.warm],P.glassR,P.lead,16);
    return{...A.finish(),details:{...D.counts,mainGlazedStoreys:3,setbackFourthStorey:true,roofGarden:true,curvedFacadeSegments:40,roof:'flat-turf-hedge-and-setback-rectangular-glazed-pavilion'}};
  }
  function roundhouse(row,view){
    const A=context(row,view),{S,K,P}=A,cx=16,cy=16;
    A.polygon(cx,cy,5.1,.44,1.3,24,'stone');const faces=A.polygon(cx,cy,4.6,1.3,11.4,24,'stone',Math.PI/24);
    // Tiny lock-up: solid round wall, actual board door and two vents, no window rows.
    const F=Object.assign(S.face([13.8,20.4],[18.2,20.4],0,1),{nx:0,ny:1});K.timberDoor(F,.8,1.3,2.8,7.5,false);band(A,F,9.2,.5);
    for(let j=0;j<4;j++)S.box(13.6,18.4,21.5+j*.75,24.5,.43,1.3+(3-j)*.24,P.stone,P.stoneR,P.stoneHi);
    for(let j=0;j<7;j++){
      const t0=j/7,t1=(j+1)/7,r0=4.9*Math.cos(t0*Math.PI/2),r1=4.9*Math.cos(t1*Math.PI/2),z0=11.7+7.5*t0,z1=11.7+7.5*t1;
      A.cone(cx,cy,r0,r1,z0,z1,24,'stone');if(j<6)A.polygon(cx,cy,r1+.12,z1-.15,z1+.12,24,'stone');
    }
    for(const j of[5,17]){const f=faces[j];f.panel(.12,f.length-.12,10.2,10.8,P.ironD,.35);}
    K.cylinder(S,cx,cy,19.2,20,.32,.32,P.stone,P.stoneR,P.stoneHi,12);K.cylinder(S,cx,cy,20,20.8,.65,.35,P.stone,P.stoneR,P.stoneHi,12);
    return{...A.finish(),details:{circularPlan:true,doorSteps:4,ventilationOpenings:2,windows:0,roof:'seven-course-beehive-stone-dome-and-ball-finial'}};
  }
  function faversham(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    for(let row=0;row<3;row++)for(let col=0;col<8;col++){
      const x=7.6+row*8.4,y=5.7+col*2.9;K.cylinder(S,x,y,.6,12.2,.47,.41,P.stone,P.stoneR,P.stoneHi,8);S.box(x-.7,x+.7,y-.7,y+.7,11.5,12.2,P.stoneHi,P.stoneR,P.stoneHi);
    }
    S.box(6.7,25.3,4.9,26.9,12.3,13.2,P.stone,P.stoneR,P.stoneHi);
    const B=volume(6.8,25.2,5,26.8,13.2,27.1,'plaster');
    for(const f of[B.left,B.right]){for(let j=0;j<5;j++)D.pane(f,f.length*(j+.5)/5-1.2,16,2.4,7.3,'sash');D.cornice(f,27.1);}
    for(let j=0;j<3;j++)D.pane(B.front,2+j*5.9,16,3.4,7.4,'arch');
    D.pane(B.back,7.4,16,3.6,8.5,'arch');D.pane(B.back,3.8,16,2.5,6,'sash');D.pane(B.back,12.1,16,2.5,6,'sash');
    A.hip(6.4,25.6,4.6,27.2,27.6,5,false);
    for(const y of[4.6,27.2]){S.poly([[6.4,y,28],[25.6,y,28],[16,y,33.5]],A.mat('plaster',0,y<16?-1:1));const f=Object.assign(S.face([6.4,y],[25.6,y],0,y<16?-1:1),{nx:0,ny:y<16?-1:1});S.poly(Array.from({length:16},(_,i)=>f.point(9.6+Math.cos(i*Math.PI/8),.65,30+Math.sin(i*Math.PI/8))),P.stoneHi);}
    const T=volume(3.7,9.1,22,27.4,.5,38.3,'plaster');for(const f of Object.values(T)){for(const z of[10,22.5,37.5])D.cornice(f,z);if(f===T.front||f===T.left)clock(A,f,f.length/2,31.2,2.1);else D.pane(f,1.5,25,2.4,8.3,'arch',false);}
    const cup=A.polygon(6.4,24.7,2.4,39,44.5,8,'stone',Math.PI/8);for(const f of cup)A.pane(f,.18,39.5,f.length-.36,3.7,'arch',false);dome(A,6.4,24.7,2.9,44.9,4,false);S.beam([6.4,24.7,49],[6.4,24.7,53.4],P.ironD,.16);S.beam([5.3,24.7,52.4],[7.5,24.7,52.4],P.ironD,.16);
    return{...A.finish(),details:{...D.counts,columnRows:3,octagonalColumns:24,openGroundFloor:true,roof:'pedimented-hall-and-corner-four-stage-clock-lead-cupola'}};
  }

  const AUTHORS=Object.freeze([stalbans,bessie,ancient,pulteney,piecehall,exchange,chichester,willis,roundhouse,faversham]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave029 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture029=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
