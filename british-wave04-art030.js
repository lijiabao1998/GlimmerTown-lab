/* GPT-030 / wave04. Original deterministic geometric interpretations.
 * Sources and compressed proportions are recorded in the first-pushed card.
 * Shared approved Scene, palette, game model and existing sprites unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "cley",
    "nm": "克萊風磨",
    "en": "Cley Windmill",
    "shape": "five-storey-tapered-tower-balcony-four-lattice-sails-fantail",
    "note": "五層收分磚塔、白木帽、四面格柵帆、環廊與尾扇，附木板翼。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1049823"
  },
  {
    "id": "crossness",
    "nm": "克羅斯尼斯泵站",
    "en": "Crossness Pumping Station",
    "shape": "yellow-brick-romanesque-two-storey-three-parallel-gabled-ranges",
    "note": "黃磚兩層泵站、三聯圓頭窗、墩帶與三條平行山牆翼；沒有新增抽水機制。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1064241"
  },
  {
    "id": "chatham",
    "nm": "查塔姆繩廠",
    "en": "Chatham Ropery",
    "shape": "long-three-storey-ropery-valley-roofs-louvres-end-engine-stack",
    "note": "長條三層紅磚繩廠、谷形雙坡屋頂、交替通風與山牆窗、端部方煙囪。超長實物作比例壓縮。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1268250"
  },
  {
    "id": "limekilns",
    "nm": "聖島石灰窯",
    "en": "Holy Island Lime Kilns",
    "shape": "squat-sandstone-battery-six-open-kiln-pots-five-tunnel-arches",
    "note": "低厚砂岩窯體、六個下陷窯口、五個拱形通道入口與土坡；非雙高煙囪。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1006434"
  },
  {
    "id": "gladstone",
    "nm": "格拉德斯通陶窯",
    "en": "Gladstone Pottery",
    "shape": "bulbous-bottle-hovels-stepped-muffle-flue-workshop-court",
    "note": "選取瓶形外罩、鼓肚窄頸窯、階梯煙道與紅磚作坊圍院；選取構件不等於全館窯數。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1195854"
  },
  {
    "id": "towanroath",
    "nm": "托溫羅斯引擎房遺構",
    "en": "Towanroath Engine House",
    "shape": "roofless-stone-engine-house-bob-wall-rear-corner-round-stack",
    "note": "無屋頂石砌引擎房、磚拱洞、高 bob wall、後左角圓煙囪及後方引擎基座；不補木樓層。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1141501"
  },
  {
    "id": "sissinghurst",
    "nm": "錫辛赫斯特烘乾窯",
    "en": "Sissinghurst Oast House",
    "shape": "six-small-two-large-square-oasts-pyramidal-roofs-white-cowls",
    "note": "依官方記述採六小、兩大方窯，方錐頂與白色風帽形成成組輪廓；平面為壓縮轉譯。",
    "url": "https://www.nationaltrust.org.uk/visit/kent/sissinghurst-castle-garden/exploring-the-buildings-at-sissinghurst-castle-garden"
  },
  {
    "id": "abbeydale",
    "nm": "阿比代爾水力鍛造廠",
    "en": "Abbeydale Works",
    "shape": "stone-forge-court-exposed-wheel-venetian-gable-six-forge-stacks",
    "note": "石板屋頂多翼鍛造廠、外露水輪、威尼斯式山牆窗、外階與多煙道鍛爐；歷史外觀展示。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1246418"
  },
  {
    "id": "temple",
    "nm": "里茲坦普爾亞麻廠",
    "en": "Temple Mill Leeds",
    "shape": "low-egyptian-mill-papyrus-column-screen-conical-rooflights-office-wing",
    "note": "英格蘭埃及復興廠房：水平主體、紙莎草柱屏、凹檐、圓錐玻璃天窗與凸出辦公翼。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1375162"
  },
  {
    "id": "hoover",
    "nm": "佩里韋爾胡佛廠",
    "en": "Hoover Factory Perivale",
    "shape": "art-deco-two-storey-glazed-front-setback-roof-twin-five-storey-stair-towers",
    "note": "兩層玻璃廠房、退台頂層、兩端五層樓梯塔、彩磚與 Art Deco 門楣；不新增工業產量。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1079353"
  }
].map((q,i)=>Object.freeze({...q,v:280+4*i})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0')};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      if(kind==='flint')return(u,z)=>{const n=K.hash(Math.floor(u*2.8),Math.floor(z*2.8),3004);return n%7<2?(d?Q.creamD:Q.creamHi):(d?P.stoneD:P.stoneR);};
      if(kind==='yellowbrick')return(x,y,z)=>{const u=Math.abs(nx)>.5?y:x;return K.mod(z,1.65)<.18||K.mod(u+(Math.floor(z/1.65)%2)*1.7,3.4)<.13?(d?P.stoneD:P.stoneR):(d?Q.creamD:Q.cream);};
      if(kind==='brick')return K.brick(d,3001);
      if(kind==='stone')return K.ashlar(d,3002);
      if(kind==='steel')return(u,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(u,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
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
    if(!root.__wave030GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave030GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave030:1});
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

  function lathe(A,cx,cy,profile,kind,n=24,phase=0){
    const {S}=A;
    for(let k=0;k<profile.length-1;k++)for(let j=0;j<n;j++){
      const a=phase+j*2*Math.PI/n,b=phase+(j+1)*2*Math.PI/n,m=(a+b)/2,[z0,r0]=profile[k],[z1,r1]=profile[k+1];
      S.poly([[cx+r0*Math.cos(a),cy+r0*Math.sin(a),z0],[cx+r0*Math.cos(b),cy+r0*Math.sin(b),z0],[cx+r1*Math.cos(b),cy+r1*Math.sin(b),z1],[cx+r1*Math.cos(a),cy+r1*Math.sin(a),z1]],A.mat(kind,Math.cos(m),Math.sin(m)));
    }
  }
  function circlePane(A,F,u,z,r,lit){
    const {S,P}=A,ring=(radius,d,col)=>S.poly(Array.from({length:24},(_,i)=>F.point(u+radius*Math.cos(i*Math.PI/12),d,z+radius*Math.sin(i*Math.PI/12))),col);
    ring(r+.35,.16,P.stoneHi);ring(r,.25,lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    for(const [a,b]of[[[-r,0],[r,0]],[[0,-r],[0,r]]])S.beam(F.point(u+a[0],.36,z+a[1]),F.point(u+b[0],.36,z+b[1]),P.frame,.14);
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
  function fineRoundPane(A,F,u,z,w,h){
    const {S,P}=A,cx=u+w/2,spring=z+h-w/2;
    const arc=(r,bottom)=>[[cx-r,bottom],[cx+r,bottom],...Array.from({length:13},(_,i)=>[cx+Math.cos(i*Math.PI/12)*r,spring+Math.sin(i*Math.PI/12)*r])];
    S.poly(arc(w/2+.10,z-.1).map(p=>F.point(p[0],.16,p[1])),P.stoneHi);
    S.poly(arc(w/2-.10,z+.1).map(p=>F.point(p[0],.28,p[1])),[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]);
    F.panel(u+.1,u+w-.1,z+h*.5-.055,z+h*.5+.055,P.frame,.32);
  }
  function pyramid(A,x0,x1,y0,y1,z,rise,kind='slate'){
    const {S,K}=A,c=[(x0+x1)/2,(y0+y1)/2,z+rise],v=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
    for(let j=0;j<4;j++){const p=v[j],q=v[(j+1)%4],nx=[0,1,0,-1][j],ny=[-1,0,1,0][j];S.poly([[...p,z],[...q,z],c],kind==='plaster'?A.mat(kind,nx,ny):K.slate(A.dark(nx,ny)));S.beam([...p,z],c,A.P.lead,.18);}
  }
  function cley(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q}=A;
    const annex=A.volume(19.5,29.2,4.5,18,.45,12,'flint');A.volume(20,29,5,18,12,20,'wood');A.roof(19.5,29.5,4.3,18.4,20.3,5,'y','wood');
    for(const f of[annex.right,annex.back])D.pane(f,2,3,2.5,5.7,'mullion');A.volume(22.5,26.5,17,21,.5,27,'wood');A.roof(22.2,26.8,16.7,21.3,27.2,3,'y','wood');
    lathe(A,15,16,[[.5,7.6],[52,4.7]],'brick');
    for(let l=0;l<5;l++)for(const j of[4,10]){
      const radius=7.6-(l*9.7+2)/51.5*2.9,a=j*Math.PI/10,b=(j+1)*Math.PI/10,m=(a+b)/2,F=face(A,[15+radius*Math.cos(a),16+radius*Math.sin(a)],[15+radius*Math.cos(b),16+radius*Math.sin(b)],Math.cos(m),Math.sin(m));
      D.pane(F,.33,3+l*9.7,Math.max(.85,F.length-.66),5.8,'sash');
    }
    lathe(A,15,16,[[52,4.9],[55,5.4],[59.2,3.7],[62,0]],'plaster');
    for(let j=0;j<24;j++){
      const a=j*Math.PI/12,b=(j+1)*Math.PI/12,pt=(r,t,z)=>[15+r*Math.cos(t),16+r*Math.sin(t),z];
      S.poly([pt(7.1,a,21.2),pt(9.2,a,21.2),pt(9.2,b,21.2),pt(7.1,b,21.2)],Q.cream);
      S.beam(pt(9,a,21.2),pt(9,a,25),Q.creamHi,.21);S.beam(pt(9,a,24.3),pt(9,b,24.3),Q.creamHi,.22);
    }
    S.beam([15,19.5,55.4],[15,24,55.4],Q.creamHi,.8);
    for(let blade=0;blade<4;blade++){
      const a=Math.PI/4+blade*Math.PI/2,dx=Math.cos(a),dz=Math.sin(a),tx=-dz,tz=dx,p=(r,t)=>[15+dx*r+tx*t,24,55.4+dz*r+tz*t];
      S.beam(p(0,0),p(18.8,0),Q.creamHi,.55);
      S.poly([p(5,-1.5),p(18.6,-1.5),p(18.6,1.5),p(5,1.5)],Q.cream);
      for(let r=5;r<=18.5;r+=1.1)S.beam(p(r,-1.55),p(r,1.55),P.woodHi,.15);
      for(const t of[-1.5,0,1.5])S.beam(p(5,t),p(18.7,t),Q.creamHi,.19);
    }
    // The smaller rear fan and its frame are independent of the main sail plane.
    S.beam([15,15,56],[15,6,56],P.ironD,.35);
    for(let j=0;j<8;j++){const a=j*Math.PI/4;S.beam([15,5.5,56],[15+4*Math.cos(a),5.5,56+4*Math.sin(a)],Q.creamHi,.6);}
    const door=face(A,[11.5,23.1],[18.5,23.1],0,1);K.timberDoor(door,2.1,.7,2.8,7,true);
    return{...A.finish(),details:{...D.counts,towerStoreys:5,mainLatticeSails:4,rearFan:true,balcony:true,roof:'white-wood-cap-and-lower-boarded-annex'}};
  }
  function crossness(row,view){
    const A=context(row,view),D=details(A),{S,P,Q}=A;
    const main=A.volume(2.8,29.2,18.5,28.5,.5,28.6,'yellowbrick');let mainLights=0;
    for(const f of[main.front,main.back]){
      for(let level=0;level<2;level++)for(let bay=0;bay<7;bay++)for(let j=0;j<3;j++){fineRoundPane(A,f,f.length*(bay+.5)/7-1.45+j,3.7+level*12,.9,6.8);mainLights++;}
      for(let j=0;j<=7;j++)f.block(j*f.length/7-.21,j*f.length/7+.21,.04,.62,.7,27.6,Q.cream,Q.creamD,Q.creamHi);
      for(let j=0;j<28;j++)f.block(j*f.length/28,j*f.length/28+.4,.08,.92,26.2,27.3,Q.cream,Q.creamD,Q.creamHi);D.cornice(f,28.2);
    }
    A.parapet(2.5,29.5,18.2,28.8,29,false);
    for(const x of[3,10.6,18.2,27.8])S.box(x-.4,x+.4,28.3,29,30.7,31.5,P.stoneHi,P.stoneR,P.stoneHi);
    for(let i=0;i<3;i++){
      const x=3+i*8.8,F=A.volume(x,x+8.4,3.5,18.5,.5,15.3,'yellowbrick');A.roof(x-.2,x+8.6,3.2,18.8,15.5,6.6,'y','yellowbrick');
      for(let j=0;j<3;j++)D.pane(F.back,1.1+j*2.1,4,1.5,7.1,'arch');const gable=face(A,[x+8.6,3.2],[x-.2,3.2],0,-1);circlePane(A,gable,gable.length/2,18,1.4,true);
      if(i===0||i===2)for(let j=0;j<4;j++)D.pane(i===0?F.left:F.right,1.1+j*3.4,4,1.5,7,'arch');
    }
    return{...A.finish(),details:{...D.counts,mainRoundHeadedLights:mainLights,mainStoreys:2,mainBays:7,roundHeadedLightsPerBay:3,parallelGabledRanges:3,roof:'three-rear-gables-and-parapeted-main-block',unverifiedChimneyAdded:false}};
  }
  function chatham(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q}=A,B=A.volume(2,30,10,24,.5,27.3,'brick');
    for(const f of[B.front,B.back]){for(let l=0;l<3;l++)for(let j=0;j<12;j++)D.pane(f,.48+j*2.29,2.5+l*8.1,1.2,5.8,'sash');for(const z of[9,17.1,27])band(A,f,z,.4);}
    for(const f of[B.left,B.right])for(let l=0;l<3;l++)for(let j=0;j<4;j++)D.pane(f,.8+j*3.25,2.5+l*8.1,1.8,5.8,'sash');
    A.roof(1.7,30.3,9.7,17,27.6,5.1,'x','brick');A.roof(1.7,30.3,17,24.3,27.6,5.1,'x','brick');
    for(let i=0;i<5;i++){
      const x=3.8+i*5.3,F=A.volume(x,x+2,22,24.5,28.2,31.7,'brick');D.pane(F.front,.48,28.7,1.04,2,'mullion',false);A.roof(x-.2,x+2.2,21.8,24.7,31.9,2,'y','brick');
      if(i%2===0){A.volume(x,x+1.6,12.5,14,32.2,34.2,'wood');A.hip(x-.2,x+1.8,12.3,14.2,34.4,1.3,false);}
    }
    for(const x of[2,26]){const E=A.volume(x,x+4,8.5,25.5,.5,28.5,'brick');for(const f of[E.left,E.right])for(let l=0;l<3;l++)D.pane(f,6,2.5+l*8,2,5.8,'sash');A.roof(x-.2,x+4.2,8.2,25.8,28.7,5.5,'x','brick');}
    const engine=A.volume(22.5,29.5,2.2,9.8,.5,16.8,'brick');for(const f of[engine.back,engine.right])D.pane(f,2,3,3,9.4,'arch');A.roof(22.2,29.8,2,10,17,4,'y','brick');
    lathe(A,26,5,[[15,2.2],[46,1.1]],'brick',4,Math.PI/4);S.box(24.9,27.1,3.9,6.1,46,47.2,P.stone,P.stoneR,P.stoneHi);
    const door=face(A,[10,24.1],[16,24.1],0,1);K.timberDoor(door,1.1,.6,3.7,6.8,false);
    return{...A.finish(),details:{...D.counts,storeys:3,pairedValleyRoofs:true,alternatingDormersAndLouvres:true,batteredSquareEngineChimney:true,roof:'very-long-twin-valley-roof-ropery-compressed-length'}};
  }
  function limekilns(row,view){
    const A=context(row,view),{S,K,P}=A;
    const walls=[[face(A,[3,29],[29,29],0,1),[{u:4,w:4.6,bottom:.5,spring:5.4,rise:2.8},{u:17.4,w:4.6,bottom:.5,spring:5.4,rise:2.8}]],[face(A,[29,3],[3,3],0,-1),[{u:3,w:4.6,bottom:.5,spring:5.4,rise:2.8}]],[face(A,[3,3],[3,29],-1,0),[{u:10.7,w:4.6,bottom:.5,spring:5.4,rise:2.8}]],[face(A,[29,29],[29,3],1,0),[{u:10.7,w:4.6,bottom:.5,spring:5.4,rise:2.8}]]];
    for(const [F,holes]of walls)archWall(A,F,.5,16,holes,'stone',1.1);
    for(let ix=0;ix<2;ix++)for(let iy=0;iy<3;iy++){
      const x0=3+ix*13,x1=x0+13,y0=3+iy*26/3,y1=y0+26/3,cx=(x0+x1)/2,cy=(y0+y1)/2,r=2.7;
      const ray=(a,z,inner)=>{if(inner)return[cx+r*Math.cos(a),cy+r*Math.sin(a),z];const t=Math.min((x1-cx)/Math.max(1e-9,Math.abs(Math.cos(a))),(y1-cy)/Math.max(1e-9,Math.abs(Math.sin(a))));return[cx+t*Math.cos(a),cy+t*Math.sin(a),z];};
      for(let j=0;j<32;j++){
        const a=j*Math.PI/16,b=(j+1)*Math.PI/16;S.poly([ray(a,16,true),ray(a,16,false),ray(b,16,false),ray(b,16,true)],K.ashlar(false,3031));
        S.poly([ray(a,16,true),ray(b,16,true),[cx+1.25*Math.cos(b),cy+1.25*Math.sin(b),5],[cx+1.25*Math.cos(a),cy+1.25*Math.sin(a),5]],P.stoneD);
      }
      S.poly(Array.from({length:32},(_,j)=>[cx+1.25*Math.cos(j*Math.PI/16),cy+1.25*Math.sin(j*Math.PI/16),5]),P.ironD);
    }
    // The north earth ramp joins the charging level, beside a tunnel entry.
    const earth=A.C('7d8964');S.poly([[12,.9,.45],[20,.9,.45],[20,3,16],[12,3,16]],earth);S.poly([[12,.9,.45],[12,3,16],[12,3,.45]],earth);S.poly([[20,.9,.45],[20,3,.45],[20,3,16]],earth);
    return{...A.finish(),details:{kilnPots:6,externalTunnelEntries:5,roof:'six-real-open-funnels-in-low-square-battery',earthChargingRamp:true,highChimneys:0}};
  }
  function gladstone(row,view){
    const A=context(row,view),D=details(A),{S,K,P}=A;
    const front=A.volume(2.5,29.5,23,29.2,.5,22.8,'brick');
    for(let l=0;l<3;l++)for(let b=0;b<8;b++)D.pane(front.front,.7+b*3.25,2.1+l*6.8,1.7,4.6,'sash');
    const carriage=face(A,[3,29.25],[10,29.25],0,1);D.pane(carriage,1.4,.6,4.2,7.8,'arch',false);A.roof(2.2,29.8,22.7,29.5,23.1,4,'x','brick');
    const wing=A.volume(24,29.4,5,23,.5,17,'brick');for(let l=0;l<2;l++)for(let b=0;b<5;b++)D.pane(wing.left,.8+b*3.4,2.3+l*7,1.7,4.8,'mullion');A.roof(23.7,29.7,4.7,23.3,17.2,3.8,'y','brick');
    const hovel=(x,y,r,height,neck)=>{lathe(A,x,y,[[.6,r*.86],[height*.24,r],[height*.47,r*.91],[height*.72,r*.55],[height*.89,neck],[height,neck]],'brick');S.poly(Array.from({length:24},(_,i)=>[x+neck*Math.cos(i*Math.PI/12),y+neck*Math.sin(i*Math.PI/12),height]),P.ironD);};
    hovel(8,10,4.8,42,.85);hovel(18.2,8.5,4.1,33,1.3);hovel(17,18.5,3.9,29,1.3);
    A.volume(3,12.6,17,22,.5,12.5,'brick');A.roof(2.8,12.8,16.8,22.2,12.8,3,'x','brick');
    for(let i=0;i<4;i++){const r=1.5-i*.22;A.volume(5-r,5+r,18.8-r,18.8+r,12+i*5,17+i*5,'brick');}
    const door=face(A,[24,14],[24,21],-1,0);K.timberDoor(door,1.7,.5,3,6.8,false);
    return{...A.finish(),details:{...D.counts,selectedBottleHovels:3,notTotalMuseumKilnCount:true,steppedMuffleFlue:true,roof:'varied-bulbous-hovels-narrow-necks-and-pitched-workshops'}};
  }
  function towanroath(row,view){
    const A=context(row,view),{S,P}=A;
    const front=face(A,[8,25],[23,25],0,1),back=face(A,[23,7],[8,7],0,-1),right=face(A,[23,25],[23,7],1,0),left=face(A,[8,7],[8,25],-1,0);
    archWall(A,front,.5,35,[{u:4.8,w:5.4,bottom:.5,spring:10.5,rise:2.4}],'stone',1.1,'brick');
    for(const [z0,z1,bottom,spring,rise]of[[.5,12,1,7,2],[12,24,14,20,2],[24,35,26,31,2]])archWall(A,back,z0,z1,[{u:5.5,w:4,bottom,spring,rise}],'stone',1.1,'brick');
    archWall(A,right,.5,8,[{u:12,w:3,bottom:1,spring:5,rise:1.4}],'stone',1.1,'brick');
    archWall(A,right,8,20,[{u:3,w:3,bottom:10,spring:15,rise:1.5},{u:11,w:3,bottom:10,spring:15,rise:1.5}],'stone',1.1,'brick');
    archWall(A,right,20,35,[],'stone',1.1);archWall(A,left,.5,35,[],'stone',1.1);
    // Empty roof and missing timber floors are intentional, not a glass roof.
    S.poly([[8,7,35],[15.5,7,41],[23,7,35]],A.mat('stone',0,-1));
    for(const [x0,x1,y0,y1]of[[8,9.1,7,25],[21.9,23,7,25],[8,23,23.9,25]])S.box(x0,x1,y0,y1,35,35.6,P.stone,P.stoneR,P.stoneHi);
    S.box(8,13,24,25,35.6,37,P.stone,P.stoneR,P.stoneHi);S.box(18,23,24,25,35.6,36.5,P.stone,P.stoneR,P.stoneHi);
    lathe(A,8.6,7.6,[[.5,2.1],[44,1.5]],'stone');lathe(A,8.6,7.6,[[44,1.5],[55.5,1.3]],'brick');A.polygon(8.6,7.6,1.55,55.5,56.4,24,'brick');
    S.box(11,22,2.2,5.5,.5,2.7,P.stone,P.stoneR,P.stoneHi);for(const x of[12.5,18.8])S.box(x,x+1.1,2.8,4.9,2.7,4.3,P.stoneHi,P.stoneR,P.stoneHi);
    return{...A.finish(),details:{roofless:true,timberFloorsAdded:false,bobWall:true,rearLeftRoundChimney:true,roof:'open-ruin-with-gable-and-no-timber-floors',rearEngineFoundation:true}};
  }
  function sissinghurst(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const kiln=(cx,cy,span,z,rise)=>{
      const F=A.volume(cx-span/2,cx+span/2,cy-span/2,cy+span/2,.5,z,'brick');pyramid(A,cx-span/2-.2,cx+span/2+.2,cy-span/2-.2,cy+span/2+.2,z+.2,rise);
      for(const f of[F.front,F.back]){f.panel(f.length/2-.38,f.length/2+.38,3,4.4,P.ironD,.16);f.block(f.length/2-.58,f.length/2+.58,.02,.36,2.7,3,P.stoneHi,P.stoneR,P.stoneHi);}
      const top=z+rise+.2;lathe(A,cx,cy,[[top,1.25],[top+3.2,1.25],[top+4.6,.75]],'plaster',16);
      S.poly([[cx-1.1,cy-1,top+3.3],[cx+1.1,cy-1,top+3.3],[cx+1.1,cy+1.05,top+4.7],[cx-1.1,cy+1.05,top+4.7]],Q.creamHi);
      S.poly([[cx-.85,cy-1.02,top+1],[cx+.85,cy-1.02,top+1],[cx+.85,cy-1.02,top+3],[cx-.85,cy-1.02,top+3]],P.ironD);
    };
    for(const y of[8,17])for(const x of[6,16,26])kiln(x,y,7.5,y===8?17:20,y===8?10.5:12);
    for(const x of[9,23])kiln(x,26,10,23.5,14.5);
    const door=face(A,[4,31.1],[14,31.1],0,1);K.timberDoor(door,3.4,.7,3.2,7,false);
    return{...A.finish(),details:{smallSquareOasts:6,largerSquareOasts:2,whiteVentCowls:8,roof:'eight-square-pyramidal-kiln-roofs-and-white-cowls',compressedPlan:true}};
  }
  function abbeydale(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q}=A;
    const forge=A.volume(6,18.5,7,21.5,.5,17.8,'stone');A.roof(5.7,18.8,6.7,21.8,18,7.2,'y','stone');
    D.pane(forge.front,4.5,9,3.5,7.5,'arch',false);D.pane(forge.front,1.3,9,2,5.5,'sash',false);D.pane(forge.front,9.3,9,2,5.5,'sash',false);K.timberDoor(forge.front,5,.5,2.8,6.5,false);
    const south=A.volume(17.5,29,22,28,.5,10.5,'stone');A.roof(17.2,29.3,21.7,28.3,10.7,4,'x','stone');
    for(let j=0;j<6;j++){const x=18.3+j*1.85;A.volume(x-.35,x+.35,24.4,25.2,13.8,18.8,'stone');S.box(x-.5,x+.5,24.2,25.4,18.8,19.3,P.stoneHi,P.stoneR,P.stoneHi);}
    const furnace=A.volume(6,13,2.5,7,.5,10,'stone');A.roof(5.8,13.2,2.3,7.2,10.2,3,'x','stone');A.volume(7,12,2.7,3.7,10,22,'brick');
    for(let j=0;j<5;j++)S.box(7+j,7.55+j,2.65,3.75,22,23.2,Q.red,Q.redD,P.stoneHi);
    const warehouse=A.volume(23,29,6,21,10.5,22,'stone');for(let j=0;j<4;j++)D.pane(warehouse.left,1+j*3.45,13,1.9,5.4,'mullion');A.roof(22.7,29.3,5.7,21.3,22.2,4.5,'y','stone');
    arcade(A,[22.9,7],[22.9,20],-1,0,3,.5,6.2,2.4,10.3);
    // The wheel is exposed beside the west wall, with real spokes and paddles.
    const cx=4.1,cy=15.1,cz=6.5,r=5.5,point=(a,x)=>[x,cy+r*Math.cos(a),cz+r*Math.sin(a)];
    for(let j=0;j<28;j++){
      const a=j*Math.PI/14,b=(j+1)*Math.PI/14;for(const x of[cx-.65,cx+.65])S.beam(point(a,x),point(b,x),Q.oakD,.45);
      S.beam(point(a,cx-.75),point(a,cx+.75),P.woodHi,.52);if(j%4===0)S.beam([cx,cy,cz],point(a,cx),Q.oak,.28);
    }
    S.beam([2.5,cy,cz],[6.5,cy,cz],P.ironD,.4);S.flat(2,5.3,8.7,21.4,.52,A.C('5c7f80'));
    for(let i=0;i<8;i++)S.box(18.8,21,8+i*.65,13.4,.6,.6+(i+1)*1.25,P.stone,P.stoneR,P.stoneHi);
    return{...A.finish(),details:{...D.counts,exposedWaterWheel:true,venetianGableWindow:true,handForgeRidgeStacks:6,crucibleFlues:5,roof:'stone-slate-forge-warehouse-and-furnace-court'}};
  }
  function temple(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q}=A,main=A.volume(3,29,9,28,.5,18.5,'stone');
    for(const f of[main.front,main.left,main.right]){D.cornice(f,18.4);D.cornice(f,19.2);}
    // Recessed screen and eighteen papyrus columns on the broad street front.
    for(let j=0;j<18;j++){
      const x=3.9+j*1.42;lathe(A,x,28.65,[[2.2,.25],[15.9,.22],[16.4,.53],[17.8,.65]],'stone',12);
      for(const dx of[-.12,.12])S.beam([x+dx,28.9,3],[x+dx,28.9,15.4],P.stoneHi,.07);
      if(j<17)A.pane(main.front,x-3+.36,4,.68,8.3,'mullion',true);
    }
    for(const x of[3,27.6])S.poly([[x,29.2,.5],[x+1.4,29.2,.5],[x+1.05,28.3,18.2],[x+.35,28.3,18.2]],A.mat('stone',0,1));
    S.flat(3.2,28.8,9.2,27.8,19.8,P.lead);
    for(let ix=0;ix<4;ix++)for(let iy=0;iy<3;iy++){
      const x=6+ix*6.1,y=12+iy*6.1;A.polygon(x,y,1.6,19.8,20.3,16,'steel');
      for(let j=0;j<16;j++){
        const a=j*Math.PI/8,b=(j+1)*Math.PI/8;S.poly([[x+1.45*Math.cos(a),y+1.45*Math.sin(a),20.3],[x+1.45*Math.cos(b),y+1.45*Math.sin(b),20.3],[x,y,23.2]],[A.dark(Math.cos(a),Math.sin(a))?P.glassR:P.glass,P.warm]);S.beam([x+1.45*Math.cos(a),y+1.45*Math.sin(a),20.35],[x,y,23.2],P.lead,.11);
      }
    }
    const office=A.volume(20.5,29,2.5,10.2,.5,28,'stone');for(const f of[office.back,office.right]){for(let j=0;j<3;j++)D.pane(f,.8+j*2.5,16.7,1.6,6.6,'mullion');D.cornice(f,28);}
    for(const x of[22,27.5])lathe(A,x,1.8,[[.5,.45],[24,.4],[25.1,1],[27,.75]],'stone',12);
    const door=face(A,[22.3,2.4],[27.2,2.4],0,-1);K.timberDoor(door,1.1,.6,2.7,9,false);
    circlePane(A,door,2.45,12.5,.9,false);S.beam(door.point(.2,.4,12.5),door.point(4.7,.4,12.5),P.stoneHi,.5);
    return{...A.finish(),details:{...D.counts,papyrusFrontColumns:18,selectedConicalRooflights:12,mainTallStoreys:1,northOfficeStoreys:2,roof:'flat-mill-with-conical-glazed-lights-and-projecting-counting-house'}};
  }
  function hoover(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,C}=A,green=C('6a8d77'),red=Q.red;
    const hall=A.volume(7,25,4,26.5,.5,21.5,'plaster');
    for(const f of[hall.front,hall.back])for(let l=0;l<2;l++)for(let j=0;j<11;j++)A.pane(f,.18+j*1.61,2.4+l*9.7,1.22,7.5,'ribbon');
    for(const f of[hall.left,hall.right])for(let l=0;l<2;l++)for(let j=0;j<8;j++)D.pane(f,.8+j*2.7,2.4+l*9.7,1.8,7.5,'ribbon');
    for(const x of[3,25]){
      const tower=A.volume(x,x+4,17.8,28,.5,43.5,'plaster');
      for(const f of[tower.front,tower.back,tower.left,tower.right]){for(let l=0;l<5;l++)A.pane(f,.55,2+l*8.1,Math.min(2.8,f.length-1.1),5.9,'ribbon');f.block(.08,.38,.05,.46,1.3,43.5,green,green,Q.creamHi);D.cornice(f,43.7);}
      S.box(x+.5,x+3.5,18.5,27.5,44.4,45.2,Q.creamHi,Q.creamD,Q.creamHi);
    }
    const top=A.volume(9,23,10,23.5,22.2,30.2,'plaster');for(const f of[top.front,top.back,top.left,top.right]){A.pane(f,.45,23.2,f.length-.9,5.7,'ribbon');f.block(-.2,f.length+.2,0,.5,30.3,31,green,green,green);}
    const entry=A.volume(12,20,26.5,28.3,.5,12.7,'plaster');K.timberDoor(entry.front,2.7,.7,2.6,8.6,true);
    for(let j=0;j<5;j++){
      const inset=j*.55;entry.front.block(.4+inset,7.6-inset,.05,.38,9.8+j*.65,10.3+j*.65,j%2?green:red,j%2?green:red,Q.creamHi);
    }
    for(const f of[hall.front,hall.back])for(const z of[1,11.2,21.6])f.block(0,f.length,.07,.45,z,z+.45,green,green,Q.creamHi);
    S.box(7,25,4,26.5,21.7,22.15,Q.creamHi,Q.creamD,Q.creamHi);
    return{...A.finish(),details:{...D.counts,principalStoreys:2,setbackRoofStorey:true,endStairTowers:2,stairTowerStoreys:5,roof:'stepped-flat-art-deco-front-and-twin-tall-stair-towers'}};
  }
  const AUTHORS=Object.freeze([cley,crossness,chatham,limekilns,gladstone,towanroath,sissinghurst,abbeydale,temple,hoover]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave030 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture030=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
