/* GPT-038 wave10 original photo-supported commerce and market geometry.
 * Ten source-supported candidates; Silver rear massing is bounded by the600x337 Cank Street reference.
 * Same native kit and rasterizer, true world rotations. No game/save/registry access. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "leedsCorn",
    "nm": "里茲穀物交易所",
    "en": "Leeds Corn Exchange",
    "v": 520,
    "shape": "elliptical-body-two-arched-window-tiers-semicircular-tuscan-porch-elliptical-slate-dome",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1255771",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "8fcb0bbb0d97dc76cc9ce30ee7923e636fb088256117831b23049cf39e4db821",
      "f4c200b008197c68d8fa34ab92a16c03b5f6b567e32740755add71e15938669c"
    ],
    "referenceLimitations": [
      "northern rooflight not visible in acquired south photographs"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "darlington",
    "nm": "達靈頓市場與鐘塔",
    "en": "Darlington Market and Clock Tower",
    "v": 524,
    "shape": "five-roof-ridges-raised-louvred-tops-cast-iron-arcade-adjacent-seven-stage-clock-tower",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1322944",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "d90ce6092f09c4e1fc0e9eed586faa84193e7943434488e3caf2acb5e04b1593"
    ],
    "referenceLimitations": [
      "complete five-ridge roof layout supported by official text, not independently surveyed from street photo"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "halifax",
    "nm": "哈利法克斯自治市集",
    "en": "Halifax Borough Market",
    "v": 528,
    "shape": "three-stone-shop-ranges-crossed-glazed-roofs-octagonal-lantern-north-arcade",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1281516",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "3d1dd07c4b09fbd558a89199c92ea159a514700874a5d7892e1517ea5ca44306",
      "b6f70665860254b098ed3db4c78349f4e1919bbe1a24d843949d337e0c1599d9",
      "67271e2ac4f1fb3e62da5a92c73223b24b6effcb48cbe5b2b78784a5a2b5f038",
      "420c923bc1ecb60d5ca4af0edb546b157c3a729c7996a1e88857d19c9730d945",
      "45e4cc1b713f99cf8e31882e1f5f9336826ff3e012cf9042dd8d77db578a6e49"
    ],
    "referenceLimitations": [
      "historic 2013 street photo and council renovation-era aerial photos; not a new survey"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "bishoplloyd",
    "nm": "切斯特主教萊德雙宅",
    "en": "Bishop Lloyd's House Chester",
    "v": 532,
    "shape": "paired-gables-carved-dark-timber-open-first-floor-rows-gallery-upper-glazed-bays",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1376439",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "3cb1feab0363182bc242bfc83dedd95e0de18be08a18e11e65465d71076627fa"
    ],
    "referenceLimitations": [
      "rear and some roof edge absent from street view"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "burlington",
    "nm": "伯靈頓拱廊街",
    "en": "Burlington Arcade",
    "v": 536,
    "shape": "narrow-double-shop-rows-tent-rooflights-upper-three-arch-piccadilly-loggia-distinct-plain-rear-portal",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1066338",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "66121a36250d4ce4aa2bd844e928b52872b05350a7393efe26e8045a550a3668",
      "ea883481991734cec16eee924e09bf5c9542248dafc4390bacafa72a72515d8e",
      "fa855a5bbefcf7219ada49051ada73b6d1d4ca2d1225ef0452d5416dcbaa064f",
      "607444d3654c60de1f26fede3ac52a2345ffd98481f239c463295f307f9b8a16",
      "42a1c5f7947353999e748f25675097f4b9bfd8aa9e7b3b88bf39b39294ae12ac"
    ],
    "referenceLimitations": [
      "full external long-roof envelope not visible; roof form supported by official HE text plus actual axial/interior roof photographs"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "silver",
    "nm": "萊斯特銀拱廊",
    "en": "Silver Arcade Leicester",
    "v": 540,
    "shape": "four-storey-stone-arcade-splayed-bays-broken-curved-pediments-grey-rear-attic-open-square-cupola",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1074775",
    "note": "原創四向像素轉譯；後立面依已實看600×337街景，只畫可辨量體，照片不嵌入遊戲。",
    "inspectedReferenceSHA256": [
      "55f543a73db4125f6ffeba4b587802461c213056c551eb2c72b0c4cf424f8186",
      "c362fe6c395d5a55b2953e5e78831bfa1a6adc4f9c306276a3aaddaeb019d307",
      "ced445f80b7fde23cd22c4dc3ba8d88031e5d7667c54938b9e2a7597f5664e74",
      "1a5bd0225dc0e71c92ed1e7e3e0c968399783eb690f14c61965dd97d43eb4e81",
      "83fb99d437eb0f8ad656eb47a4601e6b3ca0ad143a5956e709e1b9429150710a",
      "471ea0bd86fe598e0092aa49918b581a23ea51cbd29a5483226ef0953e9824ec"
    ],
    "referenceLimitations": [
      "Cank Street photo is600x337: fine carving, exact rear window counts and hidden roof are unresolved; restrained massing only",
      "Front and interior roof photos support their own visible features; interior galleries are not claimed fully visible from outside",
      "C3 computer cutaway excluded as photograph; C4 office portraits excluded as exterior evidence",
      "Photographs are reference-only; no open image reuse license inferred"
    ],
    "evidenceStatus": "front-interior-and-cank-rear-photos-with-declared-resolution-limits"
  },
  {
    "id": "harrods",
    "nm": "騎士橋百貨大樓",
    "en": "Harrods historic department store",
    "v": 544,
    "shape": "six-storey-terracotta-giant-pilasters-central-octagonal-ribbed-dome-corner-mansards",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1294346",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "ff9f609bd9047cba404ed60e876264e4b460b374130d149db8bd27be7a606935",
      "f63f0704c17a635569409f2078a48f1e1dd4b952ee837ffa6bc290fd69eaafea"
    ],
    "referenceLimitations": [
      "some rooftop edges/rear plan not shown; no claim of surveyed reproduction",
      "shop logos excluded from game art"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "liberty",
    "nm": "倫敦都鐸百貨大樓",
    "en": "Liberty Tudor Building",
    "v": 548,
    "shape": "four-storey-timber-department-store-multiple-gables-oriels-stair-turrets-chimneys-three-roof-wells",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1357064",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "d188bb55861b3e12818b7f8d5ead6dc34481a50aafe4ea99a9a6106e168f6ed1"
    ],
    "referenceLimitations": [
      "rear lightwell plan not visible; restrict any claimed photographed main-shop group accordingly"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "danum",
    "nm": "唐卡斯特合作社百貨",
    "en": "Doncaster Co-operative Emporium Danum House",
    "v": 552,
    "shape": "yellowbrick-centre-blue-vitriolite-stepped-wings-curved-glass-stair-window-bands-canopy",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1031509",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "427d0e1423f9648786af4b1d53ed020c23864b21d6bba2afff2ab2c4504d7009"
    ],
    "referenceLimitations": [
      "unpictured rear roof/wing not claimed as photo verified"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  },
  {
    "id": "willow",
    "nm": "格拉斯哥柳樹茶室",
    "en": "Willow Tea Rooms 217 Sauchiehall Street",
    "v": 556,
    "shape": "narrow-white-four-storey-uneven-sashes-bowed-leaded-window-deep-cornice-low-glazed-hipped-annex",
    "url": "https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,LB33173",
    "note": "原創像素外觀；照片未見部分依官方文字轉譯，限制保留。",
    "inspectedReferenceSHA256": [
      "7e746078f5fe33ce87aad8ed5e70c0ccdc6efa2236929526ee9cf71b4710e80f"
    ],
    "referenceLimitations": [
      "street tree occludes central lower part; rear annex/glazed hip roof only official HES text"
    ],
    "evidenceStatus": "photo-plus-official-text-with-declared-limits"
  }
].map(Object.freeze));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4038'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
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
    if(!root.__wave038GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave038GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave038:1});
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

/* WAVE038 AUTHORED MODELS */
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
  // All helpers below are private to GPT-038 and operate in world coordinates.
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

  // GPT-038 helpers are private world-space solids. No bitmap or screen decal.
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

/* WAVE038 NEW AUTHORED MODELS */

  // GPT-038 private four-centred Tudor head: four tangent circular arcs.
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
  function orientedBand(A,F,z,depth=.65){
    // F.block produces an axis-aligned world box. A diagonal wall instead
    // needs the four actual oriented corners, with top, underside and ends.
    const {S,P}=A,points=[[-.25,0],[F.length+.25,0],[F.length+.25,depth],[-.25,depth]].map(([u,d])=>F.point(u,d,0).slice(0,2));
    const a=F.point(0,0,0),b=F.point(F.length,0,0),tx=(b[0]-a[0])/F.length,ty=(b[1]-a[1])/F.length;
    const normals=[[-F.nx,-F.ny],[tx,ty],[F.nx,F.ny],[-tx,-ty]];
    S.poly(points.map(p=>[...p,z]),P.stoneD);S.poly(points.map(p=>[...p,z+.65]),P.stoneHi);
    for(let j=0;j<4;j++)S.wall(points[j],points[(j+1)%4],z,z+.65,A.dark(...normals[j])?P.stoneR:P.stoneHi);
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

  // Photo-supported frozen candidates; original nine authored functions remain unchanged.
  function ellipseDome(A,cx,cy,rx,ry,z,h,northLight=false){
    const {S,P,K}=A,n=40,bands=12;
    for(let k=0;k<bands;k++)for(let j=0;j<n;j++){
      const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,t0=k*Math.PI/(2*bands),t1=(k+1)*Math.PI/(2*bands);
      const point=(a,t)=>[cx+rx*Math.cos(a)*Math.cos(t),cy+ry*Math.sin(a)*Math.cos(t),z+h*Math.sin(t)];
      const light=northLight&&Math.sin((a+b)/2)<-.55&&k>=5&&k<=8;
      S.poly([point(a,t0),point(b,t0),point(b,t1),point(a,t1)],light?P.glass:K.slate(A.dark(Math.cos(a),Math.sin(a))));
      if(light||j%5===0)S.beam(point(a,t0),point(a,t1),P.lead,.16);
    }
  }
  function clock(A,F,u,z,r){
    const {S,P}=A;
    S.poly(Array.from({length:24},(_,i)=>{const t=i*Math.PI/12;return F.point(u+r*Math.cos(t),.35,z+r*Math.sin(t));}),P.paper);
    A.K.ring(S,F,u,z,r+.2,r+.2,.24,.42,P.ironD,24);
    for(let i=0;i<12;i++){const t=i*Math.PI/6;S.beam(F.point(u+r*.78*Math.cos(t),.5,z+r*.78*Math.sin(t)),F.point(u+r*.91*Math.cos(t),.5,z+r*.91*Math.sin(t)),P.ironD,.12);}
    S.beam(F.point(u,.55,z),F.point(u-r*.52,.55,z+r*.22),P.ink,.17);S.beam(F.point(u,.56,z),F.point(u+r*.15,.56,z+r*.73),P.ink,.15);
  }
  function shopFront(A,F,bays,z=1,h=8){
    const step=F.length/bays;
    for(let j=0;j<bays;j++){
      A.pane(F,j*step+.45,z,step-.9,h,'ribbon',true);
      F.panel(j*step+.12,j*step+.38,z-.2,z+h+.7,A.P.iron,.4);
    }
    F.panel(0,F.length,z+h+.3,z+h+1.15,A.P.greenD,.4);
  }
  // The photographed timber buildings have dark window frames, not stone
  // surrounds. These real facade planes retain opaque glass and lead bars.
  function timberPane(A,F,u,z,w,h,bays=3,rows=2){
    const {P,Q}=A,glass=A.dark(F.nx,F.ny)?P.glassR:P.glass;
    F.panel(u-.24,u+w+.24,z-.28,z+h+.28,Q.tar,.20);
    F.panel(u+.12,u+w-.12,z+.15,z+h-.15,[glass,P.warm],.31);
    for(let j=1;j<bays;j++)F.panel(u+w*j/bays-.10,u+w*j/bays+.10,z+.15,z+h-.15,Q.tar,.39);
    for(let j=1;j<rows;j++)F.panel(u+.12,u+w-.12,z+h*j/rows-.10,z+h*j/rows+.10,Q.tar,.4);
  }
  function copperMansard(A,x,y){
    const {S,P}=A;
    // A steep lower slope, a separate shallow upper roof and actual dormers.
    // The earlier single pyramidal cap lost the photographed mansard profile.
    hipPlateau(A,x-2.65,x+2.65,y-2.65,y+2.65,55,6.7,.65,'copper');
    hipPlateau(A,x-2,x+2,y-2,y+2,61.7,2.3,1.1,'copper');
    for(const [dx,dy,nx,ny]of[[0,2.35,0,1],[0,-2.35,0,-1],[2.35,0,1,0],[-2.35,0,-1,0]]){
      const xx=x+dx,yy=y+dy;
      const f=A.volume(xx-(nx?.6:1),xx+(nx?.6:1),yy-(ny?.6:1),yy+(ny?.6:1),57.3,61.8,'terracotta');
      const F=ny>0?f.front:ny<0?f.back:nx>0?f.right:f.left;
      A.pane(F,F.length/2-.55,58,1.1,2.5,'arch',true);
      const a=F.point(0,.12,61.7),b=F.point(F.length/2,.12,63.1),c=F.point(F.length,.12,61.7);
      S.poly([a,b,c],P.stoneHi);S.beam(a,b,P.stoneHi,.28);S.beam(b,c,P.stoneHi,.28);
    }
    A.polygon(x,y,.7,64,66.5,8,'terracotta');A.cone(x,y,1,.05,66.5,69,8,'lead');
  }
  function leedsCorn(row,view){
    const A=context(row,view),{S,P}=A,pts=ellipse(16,15,13,10.4,40),fs=planBlock(A,pts,.6,30,'stone');
    for(const F of fs){
      if(F.length>1.5){A.pane(F,.25,5.4,F.length-.5,6.6,'arch',true);A.pane(F,.25,18.3,F.length-.5,6.3,'arch',true);}
      orientedBand(A,F,14.3,.35);orientedBand(A,F,29.4,.5);
    }
    ellipseDome(A,16,15,13.45,10.8,30.6,13,true);
    const porch=[[9,24.2],[23,24.2],...Array.from({length:17},(_,i)=>{const t=i*Math.PI/16;return[16+7*Math.cos(t),24.2+4.8*Math.sin(t)];})];
    slab(A,porch,13.3,1.1,P.stoneHi);
    for(let j=0;j<7;j++){const t=j*Math.PI/6;column(A,16+6.3*Math.cos(t),24.2+4.25*Math.sin(t),.7,12.5,.42);}
    const portal=face(A,[11.2,25.25],[20.8,25.25],0,1);A.pane(portal,3.15,1.1,3.3,9.2,'arch',false);
    const crest=A.volume(13.4,18.6,25.2,26.1,29.7,35.3,'stone');clock(A,crest.front,2.6,32.7,1.4);
    for(const x of[11.4,20.6]){A.volume(x-.35,x+.35,24.9,25.8,29.5,34,'stone');S.beam([x,25.3,34],[x,25.3,36.1],P.ironD,.2);}
    for(const [x,y]of[[6.8,10.5],[25.2,10.5]])A.chimney(x,y,34.6,3.2);
    return{...A.finish(),details:{ellipticalBody:true,roundArchedWindowTiers:2,semicircularTuscanPorch:true,ellipticalSlateDome:true,northernRooflight:true,photoScope:'1980 full south exterior and2023 porch; north glazing corroborated by HE text'}};
  }
  function darlington(row,view){
    const A=context(row,view),{S,P}=A;
    const market=A.volume(3.1,25.1,4.5,27,.6,17.4,'stone');
    for(const [i,F]of Object.values(market).entries()){
      const bays=i<2?5:6;shopFront(A,F,bays,1.2,5.6);A.windows(F,1,bays,8.6,0,F.length/bays-.8,7.3,'arch');
      for(let j=0;j<=bays;j++)F.panel(j*F.length/bays-.15,j*F.length/bays+.15,.7,17.2,P.greenD,.4);
    }
    for(let j=0;j<5;j++){
      const x0=3+j*4.45,x1=x0+4.35;A.roof(x0,x1,4.2,27.2,17.6,3.2,'y','stone');
      const top=A.volume(x0+1.1,x1-1.1,7,24.5,20.2,22.5,'whiteMetal');
      for(const F of[top.left,top.right]){A.pane(F,.4,20.5,F.length-.8,1.4,'ribbon',false);for(let u=.2;u<F.length;u+=1.25)F.panel(u,u+.12,20.3,22.4,P.greenD,.34);}
      A.roof(x0+.9,x1-.9,6.8,24.7,22.5,.9,'y','stone');
    }
    const tower=A.volume(24.1,29.7,23.8,29.4,.6,58,'stone');
    for(const F of Object.values(tower)){
      for(const z of[8,16,24,33,42,51,57.5])band(A,F,z,.3);
      A.windows(F,2,2,17.2,13,1.2,7.3,'pointed');clock(A,F,F.length/2,46.9,1.6);
      A.windows(F,1,3,52,0,1.05,4.2,'arch');
    }
    A.polygon(26.9,26.6,2.55,58,61.3,8,'stone');A.cone(26.9,26.6,3,.1,61.3,79,8,'slate');
    for(const x of[24.35,29.45])for(const y of[24.05,29.15]){A.volume(x-.3,x+.3,y-.3,y+.3,55.5,60,'stone');A.cone(x,y,.8,.06,60,65,8,'slate');}
    S.beam([26.9,26.6,79],[26.9,26.6,82],P.ironD,.15);
    return{...A.finish(),details:{parallelMarketRoofRidges:5,raisedGlazedLouvredTops:5,castIronArchedGlazing:true,adjacentClockTowerStages:7,spireAndCornerTurrets:true,notOldTownHall:true}};
  }
  function halifax(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [x0,x1,y0,y1,z,bays]of[[3.3,28.7,25,29,26,7],[3.3,7.4,6.2,25,30,5],[24.6,28.7,6.2,25,28,5]]){
      const f=A.volume(x0,x1,y0,y1,.6,z,'stone');
      for(const F of Object.values(f)){
        const n=Math.max(1,Math.round(F.length/3.6));shopFront(A,F,n,1.3,6.8);A.windows(F,2,n,12,8,2.0,5.5,'mullion');band(A,F,10.8,.4);band(A,F,z-.2,.6);
      }
      A.roof(x0-.3,x1+.3,y0-.3,y1+.3,z,5,(x1-x0)>(y1-y0)?'x':'y','stone');
      const alongX=x1-x0>y1-y0,n=alongX?7:5;
      for(let j=0;j<n;j++){
        const x=alongX?x0+(x1-x0)*(j+.5)/n:(x0+x1)/2,y=alongX?(y0+y1)/2:y0+(y1-y0)*(j+.5)/n;
        const d=A.volume(x-1.0,x+1.0,y-.8,y+.8,z+1,z+5,'stone');A.pane(alongX?d.front:d.right,.35,z+1.5,1.3,2.7,'rect',true);A.roof(x-1.25,x+1.25,y-1.05,y+1.05,z+5,1.8,'y','stone');
        S.beam([x,y,z+6.8],[x,y,z+8.4],P.stoneHi,.2);
      }
    }
    for(const [xa,xb]of[[7.8,14.8],[17.2,24.2]])for(const [ya,yb]of[[7,14.8],[17.2,24.4]])for(let j=0;j<3;j++)glassRoof(A,xa+(xb-xa)*j/3,xa+(xb-xa)*(j+1)/3,ya,yb,22.2,2.2,5);
    A.roof(7.4,24.6,14.6,17.4,25,2,'x','stone');A.roof(14.6,17.4,6.8,25,25,2,'y','stone');
    A.polygon(16,16,5.3,25.7,30.2,8,'blackwood',Math.PI/8);
    const low=ellipse(16,16,5.3,5.3,8,Math.PI/8),high=ellipse(16,16,2.3,2.3,8,Math.PI/8);
    for(let j=0;j<8;j++){const k=(j+1)%8;S.poly([[...low[j],30.2],[...low[k],30.2],[...high[k],37],[...high[j],37]],P.glass);S.beam([...low[j],30.25],[...high[j],37.05],P.frame,.2);}
    A.polygon(16,16,2.3,37,40,12,'whiteMetal');ellipseDome(A,16,16,2.6,2.6,40,3.5,false);S.beam([16,16,43.5],[16,16,47],P.ironD,.15);
    const arcade=A.volume(12.8,19.2,1.5,7,1,17,'stone');for(const F of[arcade.left,arcade.right])A.windows(F,1,2,7,0,1.8,6,'arch');glassRoof(A,12.7,19.3,1.3,7.2,17,3.3,4);
    return{...A.finish(),details:{stoneShopEnclosingRanges:3,crossedSlateAndGlazedRoof:true,octagonalGlazedLantern:true,roofCupola:true,northGlazedArcade:true,roofAndExteriorPhotoVerified:true,notPieceHallOpenCourt:true}};
  }
  function bishoplloyd(row,view){
    const A=context(row,view),{S,P,Q}=A;
    for(const [x0,x1]of[[5,16],[16,27]]){
      const ground=A.volume(x0,x1,7.2,25.8,.6,10,'stone');shopFront(A,ground.front,2,1.1,7.2);
      const recessed=A.volume(x0,x1,7.2,24,10.2,20,'blackwood');
      recessed.front.panel(0,recessed.front.length,10.3,19.9,Q.tar,.15);
      for(const u of[2,7])timberPane(A,recessed.front,u,11.8,2.6,4.4,2,2);
      // At this isometric scale a seven-unit floor consumed the visible
      // opening. Keep a genuine three-unit recessed passage, shadowed floor,
      // soffit, separate posts and low rail; there is no front infill plane.
      S.flat(x0-.4,x1+.4,24,27,10.2,Q.tarD);
      S.flat(x0-.45,x1+.45,24,27.3,19.95,Q.tar);
      const gallery=face(A,[x0-.2,26.8],[x1+.2,26.8],0,1);
      for(const u of[.4,gallery.length/2,gallery.length-.4]){
        const p=gallery.point(u,0,0);S.box(p[0]-.3,p[0]+.3,p[1]-.3,p[1]+.3,10.2,20,Q.tar,Q.tarD,Q.tarHi);
        S.box(p[0]-.52,p[0]+.52,p[1]-.48,p[1]+.48,18.7,19.3,Q.tarHi,Q.tarD,Q.tarHi);
        for(const du of[-1.1,1.1])S.beam(gallery.point(u,.06,17.6),gallery.point(Math.max(.1,Math.min(gallery.length-.1,u+du)),.06,19.8),Q.tarHi,.3);
      }
      rail(A,[[x0,26.8],[x1,26.8]],10.3,2.3,false,Q.tarHi);
      for(let u=.8;u<gallery.length-.3;u+=.9){const p=gallery.point(u,0,0);S.beam([p[0],p[1],10.5],[p[0],p[1],12.5],Q.tarHi,.25);}
      const upper=A.volume(x0-.45,x1+.45,6.8,27.3,20,39,'blackwood');
      for(const F of[upper.front,upper.back]){
        for(const z of[23.2,32.3])for(let b=0;b<2;b++)timberPane(A,F,F.length*(b+.5)/2-2.05,z,4.1,5.8,4,3);
        for(const z of[20.5,29.8,38.2])F.panel(0,F.length,z,z+.65,Q.tarHi,.45);
        for(let u=1;u<F.length-1;u+=1.5)for(const z of[21.2,30.5]){
          F.panel(u-.52,u+.52,z,z+1.35,Q.tarHi,.42);F.panel(u-.35,u+.35,z+.19,z+1.13,Q.tar,.5);
          S.beam(F.point(u-.3,.55,z+.35),F.point(u,.55,z+1),Q.oak,.22);S.beam(F.point(u,.55,z+1),F.point(u+.3,.55,z+.35),Q.oak,.22);
        }
      }
      for(const F of[upper.left,upper.right]){for(const z of[23.5,32.5])for(let b=0;b<3;b++)timberPane(A,F,F.length*(b+.5)/3-1.2,z,2.4,5.8,3,2);timberFace(A,F,20.5,38.7,3.2,true);}
      A.roof(x0-.8,x1+.8,6.4,27.7,39,10,'y','blackwood');
      const F=face(A,[x0-.8,27.72],[x1+.8,27.72],0,1),cx=F.length/2;timberPane(A,F,cx-2,40,4,5.6,4,3);
      S.beam(F.point(.2,.08,39),F.point(cx,.08,49),Q.tarHi,.6);S.beam(F.point(cx,.08,49),F.point(F.length-.2,.08,39),Q.tarHi,.6);S.beam(F.point(cx,.1,39),F.point(cx,.1,49),Q.tarHi,.45);
      for(const x of[x0+.3,x1-.3])A.chimney(x,9,43,3.7);
    }
    return{...A.finish(),details:{streetGables:2,openFirstFloorRowsGallery:true,carvedTimberPanels:true,upperJettiedGlazedBays:true,slateGabledRoofs:true,notWholeBishopsPalace:true}};
  }
  function burlington(row,view){
    const A=context(row,view),{S,P}=A;
    for(const [x0,x1]of[[8,12.8],[19.2,24]]){
      const f=A.volume(x0,x1,5,27,.7,20,'stone');
      const inner=x0<16?f.right:f.left,outer=x0<16?f.left:f.right;
      shopFront(A,inner,6,1.2,8.5);A.windows(inner,1,6,12,0,2.0,5.6,'mullion');A.windows(outer,2,6,2.2,10,1.8,6.2,'rect');
      A.roof(x0-.2,x1+.2,4.8,27.2,20,2.3,'y','stone');
    }
    S.flat(12.8,19.2,4.5,27.3,.55,A.K.paving);glassRoof(A,12.65,19.35,5.8,26,20,3.4,12);
    for(let j=0;j<=8;j++){const y=6+j*2.4,F=face(A,[12.7,y],[19.3,y],0,1);archWall(A,F,17.2,23.5,[{u:.35,w:5.9,bottom:17.2,spring:20.3,rise:2.7}],'stone',.28);}
    const front=face(A,[7.3,28],[24.7,28],0,1);
    archWall(A,front,.7,18.4,[{u:3.55,w:10.3,bottom:.7,spring:11.6,rise:2.3}],'stone',1.4,'stone');
    const loggia=face(A,[7.3,27.5],[24.7,27.5],0,1),holes=[1.2,6.75,12.3].map(u=>({u,w:3.9,bottom:19,spring:27.8,rise:1.95}));
    archWall(A,loggia,18.4,32.5,holes,'stone',1.1,'stone');
    for(const x of[8.2,12.4,13.7,17.8,19.2,23.6])column(A,x,27.8,18.5,27.9,.25,true);
    S.box(7.1,24.9,26.2,28.25,32.3,33.5,P.stoneHi,P.stoneR,P.stoneHi);
    for(const x of[7.7,24.3]){S.beam([x,28.15,14],[x,27.8,23.5],P.stoneHi,.5);A.polygon(x,28, .65,18,20,8,'stone');}
    A.polygon(16,27.2,.9,33.5,36,8,'stone');S.beam([16,27.2,36],[16,27.2,38],P.stoneHi,.18);
    const back=face(A,[23.8,4.2],[8.2,4.2],0,-1);archWall(A,back,.7,22.5,[{u:3.7,w:8.2,bottom:.7,spring:15,rise:1.8}],'stone',1.2,'stone');
    S.box(8,24,3.7,4.4,22.5,23.8,P.stoneHi,P.stoneR,P.stoneHi);
    return{...A.finish(),details:{narrowDoubleShopRows:true,tentLikeGlazedRooflights:true,transverseArches:9,piccadillyOpenLoggiaArches:3,distinctPlainBurlingtonGardensPortal:true,fullUpperEntrancePhotoVerified:true,noGenericBarrelVault:true}};
  }
  // Silver alone: photographed front and newly inspected Cank Street rear.
  // Hidden service-roof detail and illegible carving are intentionally unresolved.
  function silver(row,view){
    const A=context(row,view),{S,P,Q,K}=A;
    const x0=4.6,x1=27.4,y0=5.2,y1=27.0,innerL=12.5,innerR=19.5;
    // Two shop ranges bound a genuine central void, not a capped solid box.
    for(const [a,b]of[[x0,innerL],[innerR,x1]]){
      const wing=A.volume(a,b,y0,y1,.6,47,'stone',false),inner=a<16?wing.right:wing.left,outer=a<16?wing.left:wing.right;
      shopFront(A,inner,5,1.1,8.0);
      for(const F of[inner,outer]){
        A.windows(F,3,5,13,10.2,2.2,6.8,'rect');
        for(const z of[10.8,21.2,31.6,44.8])orientedBand(A,F,z,.4);
      }
      A.roof(a-.15,b+.15,y0+.3,y1-.4,47,3.6,'y','stone');
    }
    S.flat(innerL,innerR,y0,y1,.58,K.paving);
    // Stacked gallery slabs and railings have physical support at each level.
    // The glazing/end openings govern what is actually visible in each view.
    for(const z of[11.2,21.6,32])for(const [a,b,edge]of[[innerL,innerL+1.2,innerL+1.2],[innerR-1.2,innerR,innerR-1.2]]){
      slab(A,[[a,y0+.8],[b,y0+.8],[b,y1-.7],[a,y1-.7]],z,.4,P.stoneHi);
      rail(A,[[edge,y0+.8],[edge,y1-.7]],z,1.9,false,P.ironD);
    }
    for(const x of[innerL+.15,innerR-.15])for(let j=0;j<6;j++){
      const y=y0+1+j*3.8;S.beam([x,y,.7],[x,y,43.5],P.ironD,.22);
    }
    // Curved transverse iron roof frames with triangular spandrels, observed
    // in the real interior photograph; they do not become a fictitious cutaway.
    for(let j=0;j<7;j++){
      const y=6.2+j*3.1,F=face(A,[innerL,y],[innerR,y],0,1);
      const at=t=>F.point(F.length*t,0,42.3+3.8*Math.sqrt(Math.max(0,1-(2*t-1)**2)));
      for(let k=0;k<14;k++)S.beam(at(k/14),at((k+1)/14),P.frame,.18);
      S.beam([innerL,y,46.3],[16,y,50.0],P.frame,.2);S.beam([16,y,50.0],[innerR,y,46.3],P.frame,.2);
      for(const x of[innerL,innerR])S.beam([x,y,42.3],[x,y,46.3],P.frame,.21);
    }
    glassRoof(A,innerL-.1,innerR+.1,6.0,25.3,46.3,3.8,13);
    const front=face(A,[x0,27.2],[x1,27.2],0,1),rear=face(A,[x1,4.9],[x0,4.9],0,-1);
    // The central round arch extends through the ground and first storey.
    // Nothing fills the opening with a flat dark decal.
    for(const F of[front,rear]){
      archWall(A,F,.6,32.0,[{u:F.length/2-3.1,w:6.2,bottom:.6,spring:15.9,rise:3.1}],'stone',.9,'stone');
      F.panel(0,F.length,10.5,11.15,P.stoneHi,.3);
      for(const u of[.1,7.2,15.1,F.length-.5])F.panel(u,u+.4,.7,46.8,A.mat('stone',F.nx,F.ny),.5);
      for(const z of[31.4,45.7,47])orientedBand(A,F,z,.5);
      const portal=F.length/2;
      // Open iron entry gate: bars and rails, with a real empty area behind.
      for(let u=portal-2.9;u<=portal+2.9;u+=.48){
        const h=15.9+3.0*Math.sqrt(Math.max(0,1-((u-portal)/3.0)**2));
        S.beam(F.point(u,-.35,.8),F.point(u,-.35,h),P.ironD,.11);
      }
      for(const z of[7.1,13.2])S.beam(F.point(portal-3,-.35,z),F.point(portal+3,-.35,z),P.ironD,.13);
    }
    // Silver Street's two splayed bays, actual world-space faceted solids.
    for(const cx of[8.25,23.75]){
      const pts=[[cx-3.45,25.7],[cx+3.45,25.7],[cx+3.45,27.6],[cx+2.35,28.65],[cx-2.35,28.65],[cx-3.45,27.6]];
      const bay=planBlock(A,pts,11.3,44.8,'stone');
      for(const F of bay)if(F.ny>0){
        for(const z of[12.6,24,35])A.pane(F,.25,z,F.length-.5,7.8,'mullion',true);
        for(const z of[22.4,33.4,44.4])orientedBand(A,F,z,.4);
      }
      slab(A,pts,45.7,.55,P.stoneHi);
      const attic=A.volume(cx-3.2,cx+3.2,25.4,27.6,45.7,54.3,'stone');
      A.windows(attic.front,1,3,47,0,1.25,6.1,'rect');
      for(const u of[.1,attic.front.length-.4])attic.front.panel(u,u+.3,46,54,P.stoneHi,.35);
    }
    // Central projecting oriel on visible stone corbels, distinct from bays.
    function oriel(cx,y,ny,z0,z1,width){
      const back=y-ny*.9,tip=y+ny*1.3,near=y+ny*.7;
      let pts=[[cx-width/2,back],[cx+width/2,back],[cx+width/2,near],[cx+width/2-.7,tip],[cx-width/2+.7,tip],[cx-width/2,near]];
      if(ny<0)pts=pts.toReversed();
      const fs=planBlock(A,pts,z0,z1,'stone');
      for(const F of fs)if(F.ny*ny>0){A.pane(F,.2,z0+1,F.length-.4,z1-z0-2,'mullion',true);}
      slab(A,pts,z1+.5,.55,P.stoneHi);
      for(const x of[cx-width*.31,cx+width*.31]){
        S.poly([[x-.36,back,z0-2],[x+.36,back,z0-2],[x+.36,tip-.2*ny,z0],[x-.36,tip-.2*ny,z0]],P.stoneR);
        S.beam([x,back,z0-2],[x,tip-.2*ny,z0],P.stoneHi,.4);
      }
    }
    const centre=A.volume(12.55,19.45,25.2,27.2,32,56.8,'stone');
    oriel(16,27.2,1,24.1,34.3,6.2);A.windows(centre.front,2,2,36.1,10.8,1.65,6.9,'rect');
    // Three broken curved pediments, built as extruded curved stone bands.
    // There is an open central break, not a complete triangular gable.
    function brokenCurve(cx,y,z,r){
      const inside=r-.48,depth=.8,at=(rad,t,d)=>[cx+rad*Math.cos(t),y-d,z+rad*.84*Math.sin(t)];
      for(let j=0;j<30;j++){
        const a=j*Math.PI/30,b=(j+1)*Math.PI/30;if(a<1.87&&b>1.27)continue;
        for(const d of[0,depth])S.poly([at(r,a,d),at(r,b,d),at(inside,b,d),at(inside,a,d)],d?P.stoneD:P.stoneHi);
        S.poly([at(r,a,0),at(r,b,0),at(r,b,depth),at(r,a,depth)],A.mat('stone',0,1));
        S.poly([at(inside,a,0),at(inside,b,0),at(inside,b,depth),at(inside,a,depth)],P.stoneR);
      }
      S.box(cx-.48,cx+.48,y-.8,y+.05,z+.75,z+1.9,P.stone,P.stoneR,P.stoneHi);
      const low=[[cx-.4,y-.68,z+1.9],[cx+.4,y-.68,z+1.9],[cx+.4,y-.05,z+1.9],[cx-.4,y-.05,z+1.9]],peak=[cx,y-.36,z+6.1];
      for(let k=0;k<4;k++)S.poly([low[k],low[(k+1)%4],peak],k<2?P.stoneHi:P.stoneR);
    }
    for(const [cx,z,r]of[[8.25,54.3,3.8],[16,56.8,3.1],[23.75,54.3,3.8]])brokenCurve(cx,28.0,z,r);
    for(const x of[4.9,12.05,19.95,27.1]){
      S.box(x-.35,x+.35,26.5,27.4,48,50.8,P.stone,P.stoneR,P.stoneHi);
      A.cone(x,26.95,.37,.05,50.8,54.6,4,'stone');
    }
    // Cank Street: only rear features resolved by the600x337 photograph.
    const rearUpper=A.volume(x0,x1,4.9,7.0,32,48,'stone');
    for(const u of[1.3,5.7,15.7,19.9])A.pane(rearUpper.back,u,34.2,1.7,10.4,'rect',true);
    oriel(16,4.9,-1,24.1,35,6.1);
    const attic=A.volume(10.7,21.3,5.0,10.9,48,58.9,'lead');
    // Grey boarding is local to this attic; shared materials are untouched.
    for(const F of Object.values(attic)){
      S.wall(F.point(0,0,0),F.point(F.length,0,0),48,58.9,(x,y,z)=>K.mod(z,1.25)<.12?P.lead:(A.dark(F.nx,F.ny)?Q.steelD:Q.steel));
      for(let j=1;j<Math.floor(F.length/1.4);j++)F.panel(j*1.4-.06,j*1.4+.06,48.3,58.6,P.lead,.06);
    }
    A.windows(attic.back,1,3,50.0,0,2.0,6.8,'rect');A.roof(10.3,21.7,4.65,11.2,58.9,3.0,'y','lead');
    S.box(12.8,19.2,5.0,10.8,61.5,62.15,P.lead,P.ironD,Q.steel);
    // Open square cupola: four posts and rails, no enclosing infill walls.
    const cx=16,cy=7.9,lo=1.62,hi=2.05;
    for(const x of[cx-lo,cx+lo])for(const y of[cy-lo,cy+lo]){
      S.box(x-.22,x+.22,y-.22,y+.22,62.1,69.4,P.lead,P.ironD,Q.steelHi);
      S.box(x-.35,x+.35,y-.35,y+.35,68.6,69.3,Q.steel,Q.steelD,Q.steelHi);
    }
    rail(A,[[cx-lo,cy-lo],[cx+lo,cy-lo],[cx+lo,cy+lo],[cx-lo,cy+lo]],62.5,1.5,true,P.lead);
    for(const y of[cy-lo,cy+lo])S.beam([cx-lo,y,69.25],[cx+lo,y,69.25],P.lead,.3);
    for(const x of[cx-lo,cx+lo])S.beam([x,cy-lo,69.25],[x,cy+lo,69.25],P.lead,.3);
    const base=[[cx-hi,cy-hi,69.5],[cx+hi,cy-hi,69.5],[cx+hi,cy+hi,69.5],[cx-hi,cy+hi,69.5]],tip=[cx,cy,75.1];
    for(let j=0;j<4;j++)S.poly([base[j],base[(j+1)%4],tip],j<2?Q.steelD:Q.steel);
    S.beam(tip,[cx,cy,78.3],P.ironD,.17);
    return{...A.finish(),details:{fourStoreyStoneArcade:true,centralRoundEntryApertures:2,splayedFrontBays:2,centralProjectingOrielOnCorbels:true,brokenCurvedPediments:3,obeliskFinials:true,glazedCentralRoofAndVoid:true,supportedIronGalleries:true,rearGreyBoardedAttic:true,rearOpenSquareCupola:true,rearPhotoDimensions:[600,337],rearFineCarvingUnresolved:true,notInteriorCutaway:true,noPhotographicTexture:true}};
  }
  function harrods(row,view){
    const A=context(row,view),{S,P}=A,body=A.volume(3,29,5,27,.6,54,'terracotta');
    for(const [i,F]of Object.values(body).entries()){
      const bays=i<2?8:6,step=F.length/bays;shopFront(A,F,bays,1.4,8);
      A.windows(F,5,bays,13,8.1,step*.60,5.8,'rect');
      for(let j=0;j<=bays;j++){
        const u=j*step;F.panel(u-.18,u+.18,12,53,A.mat('terracotta',F.nx,F.ny),.55);F.panel(u-.37,u+.37,48.8,50,P.stoneHi,.65);
      }
      for(const z of[11.8,29.2,53.5])orientedBand(A,F,z,.45);
      for(let j=0;j<bays;j++){
        const u0=j*step+.12,u1=(j+1)*step-.12;S.poly([F.point(u0,.5,10.9),F.point(u1,.5,10.9),F.point(u1,2.2,9.9),F.point(u0,2.2,9.9)],P.greenD);
        for(const z of[12,53]){const u=(j+.5)*step,p=F.point(u,.7,z);S.box(p[0]-.13,p[0]+.13,p[1]-.13,p[1]+.13,z,z+.3,[P.paper,P.warmHi],[P.paper,P.warmHi],[P.paper,P.warmHi]);}
      }
    }
    // Recessed roof surface and the photographed balustrade line. No claim
    // that the unphotographed service-roof plan has been surveyed.
    S.flat(3.4,28.6,5.4,26.6,54.04,P.lead);
    for(const [a,b]of[[[3.2,5.2],[28.8,5.2]],[[28.8,5.2],[28.8,26.8]],[[28.8,26.8],[3.2,26.8]],[[3.2,26.8],[3.2,5.2]]]){
      rail(A,[a,b],54.2,2.1,false,P.stoneHi);
      const n=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/4.2);
      for(let j=0;j<=n;j++){const t=j/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;S.box(x-.35,x+.35,y-.35,y+.35,54,57,P.stone,P.stoneR,P.stoneHi);}
    }
    for(const [x,y]of[[5.7,8],[26.3,8],[5.7,24.2],[26.3,24.2]]){
      const f=A.volume(x-2.2,x+2.2,y-2.2,y+2.2,48,55,'terracotta');copperMansard(A,x,y);
      for(const F of Object.values(f))A.pane(F,F.length/2-.6,51,1.2,3.3,'arch',true);
    }
    const cx=16,cy=22.5,drum=A.polygon(cx,cy,4.4,54,64,8,'terracotta',Math.PI/8);
    for(const F of drum){A.pane(F,.35,55.6,F.length-.7,6.8,'arch',true);orientedBand(A,F,63.5,.35);}
    const profile=[[64,4.9],[66.5,4.8],[70.8,4.0],[74,2.7],[76.5,1.25]];
    lathe(A,cx,cy,profile,'copper',8,Math.PI/8);
    for(let j=0;j<8;j++)for(let k=0;k<profile.length-1;k++){
      const t=Math.PI/8+j*Math.PI/4,[za,ra]=profile[k],[zb,rb]=profile[k+1];
      S.beam([cx+ra*Math.cos(t),cy+ra*Math.sin(t),za],[cx+rb*Math.cos(t),cy+rb*Math.sin(t),zb],P.stoneHi,.42);
    }
    const lantern=A.polygon(cx,cy,1.25,76.5,82,8,'terracotta',Math.PI/8);
    for(const F of lantern)A.pane(F,.18,77.4,F.length-.36,3.2,'arch',false);
    A.cone(cx,cy,1.7,.15,82,85.4,8,'lead');S.beam([cx,cy,85.4],[cx,cy,88.5],P.ironD,.18);
    const central=face(A,[12.7,27.3],[19.3,27.3],0,1);A.pane(central,.65,32,5.3,15.2,'arch',true);
    for(const z of[37.1,42.3])central.panel(.7,5.9,z,z+.48,P.stoneHi,.45);
    for(const u of[2.3,4.2])central.panel(u,u+.22,32.3,46.3,P.stoneHi,.46);
    pediment(A,12.2,19.8,27.7,53.5,4.2,1.1);
    return{...A.finish(),details:{terracottaDepartmentStore:true,storeys:6,giantPilasters:true,displayWindowBase:true,centralOctagonalRibbedDome:true,cornerCopperMansards:4,twoSlopeMansardsAndDormers:true,roofBalustrade:true,physicalFixtureNightLights:true,noBrandLogo:true}};
  }
  function liberty(row,view){
    // Keep the body uncapped: a solid flat cap concealed the three actual
    // lightwell bottoms in the first candidate. Roof pieces close the solids.
    const A=context(row,view),{S,P,Q}=A,body=A.volume(3.7,28.3,6,27,.6,43,'plaster',false);
    for(const [i,F]of Object.values(body).entries()){
      const bays=i<2?6:5,step=F.length/bays;
      for(let level=0;level<4;level++)for(let b=0;b<bays;b++)timberPane(A,F,(b+.5)*step-1.4,2.5+level*10.1,2.8,7.2,3,3);
      for(let b=0;b<=bays;b++)F.panel(Math.max(0,b*step-.3),Math.min(F.length,b*step+.3),.8,42.8,Q.tar,.48);
      for(const z of[.9,10.7,21,31.2,42])F.panel(0,F.length,z,z+.85,Q.tar,.5);
      for(let b=0;b<bays;b++)for(const z of[11.6,21.9,32.1]){
        const u=b*step+.5;S.beam(F.point(u,.54,z),F.point(u+step-1,.54,z+1.5),Q.tar,.32);
      }
    }
    // Three original high street gables; rear roof wells are text-derived.
    for(let j=0;j<3;j++){
      const x0=3.3+j*8.45,x1=x0+8.5,cx=(x0+x1)/2;A.roof(x0,x1,19.5,27.7,43,10,'y','plaster');
      const F=face(A,[x0,27.73],[x1,27.73],0,1);timberPane(A,F,2.3,44.4,3.8,5.2,4,2);
      for(const [a,b]of[[[x0,27.8,43],[cx,27.8,53]],[[cx,27.8,53],[x1,27.8,43]],[[cx,27.85,43],[cx,27.85,52.8]]])S.beam(a,b,Q.tar,.75);
      for(const x of[cx-2.5,cx+2.5])S.beam([x,27.85,43],[x,27.85,47],Q.tar,.45);
      const out=[[x0,6],[x1,6],[x1,19.5],[x0,19.5]],inside=[[cx-1.7,10.8],[cx+1.7,10.8],[cx+1.7,15.3],[cx-1.7,15.3]];
      ringSurface(A,out,inside,43.1,45.4,A.K.slate(A.dark(0,1)));
      for(let k=0;k<4;k++){
        const a=inside[k],b=inside[(k+1)%4];S.wall(a,b,40.6,45.4,k<2?Q.tarD:P.slateD);S.beam([...a,45.45],[...b,45.45],P.lead,.28);
      }
      S.flat(cx-1.7,cx+1.7,10.8,15.3,40.6,P.glassR);
    }
    for(const x of[8.2,23.8]){
      const f=A.volume(x-1.7,x+1.7,26,28.4,.7,34,'stone');A.windows(f.front,3,1,4,9.7,1.4,4.3,'mullion');A.hip(x-1.9,x+1.9,25.8,28.6,34,2,true);
    }
    for(const x of[5.7,14.3,26.1]){A.chimney(x,8.1,46,6.5);A.chimney(x+1.45,8.1,46,5);}
    for(const x of[4.9,16,27.1]){const f=A.volume(x-1.1,x+1.1,27,28.1,23,40,'blackwood');for(const z of[24,33])timberPane(A,f.front,.25,z,1.7,6.1,2,3);}
    return{...A.finish(),details:{fourStoreyTimberDepartmentStore:true,frontGables:3,stoneStairTowers:2,projectingGlazedTimberBays:true,groupedChimneys:true,textDerivedRoofWells:3,notLittleMarlboroughWarehouse:true,noBrandLogo:true}};
  }
  function danum(row,view){
    const A=context(row,view),{S,P}=A,base=planBlock(A,roundedPlan(3,29,6,27,2.3),.6,23,'vitriolite');
    for(const F of base){if(F.length>3){shopFront(A,F,Math.max(1,Math.round(F.length/4)),1,7.1);A.windows(F,2,Math.max(1,Math.round(F.length/4)),10.5,6.5,Math.max(1,F.length/Math.max(1,Math.round(F.length/4))-.55),4.2,'ribbon');}}
    const main=planBlock(A,roundedPlan(12,26,9,25.8,1.5),23,47,'yellowbrick');
    for(const F of main)if(F.length>2.2){A.windows(F,3,Math.max(1,Math.round(F.length/4.5)),25,7.2,Math.min(4.1,F.length-.55),4.6,'ribbon');orientedBand(A,F,46.8,.3);}
    const low=A.volume(4,12,8,25,23,30,'vitriolite');for(const F of[low.front,low.left])A.windows(F,1,2,24,0,F.length/2-.6,4.3,'ribbon');
    const stair=A.polygon(20.5,25.3,3.8,.7,49,20,'vitriolite');
    for(const F of stair)for(let j=0;j<5;j++)A.pane(F,.1,2.8+j*9,F.length-.2,7.2,'ribbon',true);
    for(const z of[10.7,19.7,28.7,37.7,48.4]){const ps=ellipse(20.5,25.3,3.9,3.9,20);for(let j=0;j<ps.length;j++)S.beam([...ps[j],z],[...ps[(j+1)%ps.length],z],P.frame,.36);}
    const canopy=roundedPlan(2.6,29.4,5.6,28.2,2.5);slab(A,canopy,8.9,.45,P.lead);
    // The canopy does not cover the upper rounded glass stair. Reapply only
    // the real lower display glazing at the native façade, never a screen decal.
    return{...A.finish(),details:{centralFiveStoreyYellowBrick:true,lowerBlueVitrioliteWings:true,roundedGlazedStairTower:true,horizontalWindowBands:true,continuousShopCanopy:true,steppedStreetMassing:true}};
  }
  function willow(row,view){
    const A=context(row,view),{S,P}=A,body=A.volume(10,22,11,27,.6,48,'whiteplaster');
    for(const F of[body.left,body.right,body.back]){A.windows(F,4,2,3.5,11,1.8,6.2,'rect');band(A,F,47.5,.45);}
    const F=body.front;A.pane(F,1.0,1.4,3.2,7.6,'rect',true);A.pane(F,5,1.4,6.0,7.6,'ribbon',true);
    // Counter-clockwise footprint gives outward normals on every curved
    // facade segment. The C6 clockwise footprint glazed the hidden closure.
    const bow=planBlock(A,[[21.4,27],[20.8,28.1],[18.8,28.8],[13.1,28.8],[11.2,28.1],[10.6,27]],11,21.5,'whiteplaster');
    for(const G of bow)if(G.ny>0&&G.length>1)timberPane(A,G,.15,11.7,G.length-.3,8.6,Math.max(2,Math.round(G.length/.9)),4);
    for(const [u,w]of[[1.0,2.1],[4.4,2.2],[8.2,2.8]])A.pane(F,u,25,w,6.2,'rect',true);
    for(const [u,w]of[[1.1,3.2],[5.6,1.7],[9.0,1.8]])A.pane(F,u,37,w,6.6,'rect',true);
    for(const z of[10.1,22,46.9])F.panel(.15,11.85,z,z+.5,P.stoneHi,.55);
    for(const u of[.35,3.8,7.5,11.25])for(const z of[11,20.7]){F.panel(u,u+.5,z,z+.5,P.ink,.6);F.panel(u+.12,u+.38,z+.12,z+.38,P.stoneHi,.62);}
    S.box(9.45,22.55,10.6,27.6,47.7,49.5,P.stoneHi,P.stoneR,P.stoneHi);S.flat(10,22,11,27,49.55,P.lead);
    const annex=A.volume(10.6,21.4,3.8,11.2,.6,14.4,'plaster');A.windows(annex.back,1,3,4.5,0,1.8,5.9,'rect');
    const outside=[[10.3,3.5],[21.7,3.5],[21.7,11.5],[10.3,11.5]],inside=[[12.6,5.8],[19.4,5.8],[19.4,9.2],[12.6,9.2]];
    for(let j=0;j<4;j++){const k=(j+1)%4;S.poly([[...outside[j],14.4],[...outside[k],14.4],[...inside[k],18],[...inside[j],18]],j<2?P.glass:A.K.slate(A.dark(j===1?1:0,j===2?1:-1)));S.beam([...outside[j],14.5],[...inside[j],18.1],P.frame,.2);}
    S.flat(12.6,19.4,5.8,9.2,18,P.lead);
    return{...A.finish(),details:{correctAddress217SauchiehallStreet:true,narrowWhiteFourStoreyFront:true,unevenUpperSashGroups:true,bowedLeadedFirstFloorWindow:true,squareBorderDetails:true,deepCornice:true,partGlazedHippedRearAnnexTextDerived:true,notBuchananStreetTearooms:true}};
  }
  const MODELS=Object.freeze({leedsCorn,darlington,halifax,bishoplloyd,burlington,silver,harrods,liberty,danum,willow});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave038 unknown frozen prototype '+id);if(!MODELS[id])throw Error('wave038 exterior evidence pending; model deliberately absent: '+id);return MODELS[id](row,view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture038=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
