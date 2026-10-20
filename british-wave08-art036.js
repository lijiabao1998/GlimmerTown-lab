/* GPT-036 / wave08. Original deterministic care architecture.
 * Primary photographs verified before modelling; native rasterizer/palette unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
  {
    "id": "finsbury",
    "nm": "芬斯伯里健康中心",
    "en": "Finsbury Health Centre",
    "shape": "splayed-h-plan-two-level-wings-convex-glass-block-entry-ramp-and-rear-barrel",
    "note": "斜張雙翼、凸出玻璃磚入口與直坡道、退台及後側低弧講堂；不附加醫療玩法。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1297993"
  },
  {
    "id": "chelsea",
    "nm": "切爾西皇家醫院",
    "en": "Royal Hospital Chelsea",
    "shape": "open-u-figure-court-three-storey-brick-wards-doric-portico-cupola-low-colonnades",
    "note": "壓縮Figure Court主體：三層磚翼、Doric四柱山花門廊、杯頂與開放柱廊，非完整校區。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1226301"
  },
  {
    "id": "stcross",
    "nm": "溫徹斯特聖十字醫院",
    "en": "Hospital of St Cross Winchester",
    "shape": "flint-gate-hall-cloister-chimney-almshouse-range-cruciform-church-central-tower",
    "note": "門樓、大廳、長煙囪養老院與後方十字教堂大中央塔，選取主要院落體量。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1095374"
  },
  {
    "id": "fords",
    "nm": "考文垂福特醫院",
    "en": "Fords Hospital Coventry",
    "shape": "narrow-open-court-close-studded-jettied-timber-ranges-four-centred-gate",
    "note": "密木骨挑層、狹長露天內院與四心拱通道；歷史建築外觀，不新增養老玩法。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1342891"
  },
  {
    "id": "trinity",
    "nm": "格林威治三一醫院",
    "en": "Trinity Hospital Greenwich",
    "shape": "stucco-seven-bay-gate-clock-tower-stepped-end-gables-open-court",
    "note": "灰白七開間前面、中央鐘塔雉堞與小尖頂、兩端階梯山牆；排除鄰近電站煙囪。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1078961"
  },
  {
    "id": "mineral",
    "nm": "巴斯皇家礦泉醫院",
    "en": "Royal Mineral Water Hospital Bath",
    "shape": "limestone-eleven-bay-two-storey-attic-four-giant-ionic-pilasters-central-pediment",
    "note": "石灰岩十一開間、雙層與高閣、四巨Ionic壁柱及中央山花；展示2019遷出前的舊院址建築。",
    "url": "https://historicengland.org.uk/listing/the-list/list-entry/1395448"
  },
  {
    "id": "dundee",
    "nm": "鄧迪瑪姬關懷中心",
    "en": "Maggies Dundee",
    "shape": "white-cottage-wavy-folded-silver-roof-and-tapered-round-tower",
    "note": "白色低屋、不同波折銀頂與截錐形圓塔；依機構原照轉譯，非住院醫院。",
    "url": "https://www.maggies.org/about-us/buildings-and-architecture/dundee/"
  },
  {
    "id": "leeds",
    "nm": "里茲瑪姬關懷中心",
    "en": "Maggies Leeds Yorkshire",
    "shape": "three-flared-timber-planters-overlapping-planted-roofs-and-glazed-connectors",
    "note": "三座不同高度木肋花盆形室、交疊屋頂花園與玻璃連接空間；非住院醫院。",
    "url": "https://heatherwick.com/studio/news/completion-maggies-leeds/"
  },
  {
    "id": "manchester",
    "nm": "曼徹斯特瑪姬關懷中心",
    "en": "Maggies Manchester",
    "shape": "low-linear-timber-frame-central-raised-roof-mezzanine-and-gable-greenhouse",
    "note": "低長木構、中央抬高閣層、斜撐與玻璃溫室；非住院醫院。",
    "url": "https://www.fosterandpartners.com/projects/maggie-s-manchester"
  },
  {
    "id": "oxford",
    "nm": "牛津瑪姬關懷中心",
    "en": "Maggies Oxford",
    "shape": "stilted-branching-faceted-timber-treehouse-diagonal-glass-and-entry-ramp",
    "note": "架高細柱、多翼折面木屋、斜格玻璃與入口坡道；非住院醫院。",
    "url": "https://www.maggies.org/about-us/buildings-and-architecture/oxford/"
  }
].map((q,i)=>Object.freeze({...q,v:440+4*i})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      const uAt=(x,y)=>Math.abs(nx)>.5?y:x;
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
    if(!root.__wave036GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave036GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave036:1});
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

/* WAVE036 AUTHORED MODELS */
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
  // All helpers below are private to GPT-036 and operate in world coordinates.
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

  // GPT-036 helpers are private world-space solids. No bitmap or screen decal.
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

/* WAVE036 NEW AUTHORED MODELS */

  // GPT-036 private four-centred Tudor head: four tangent circular arcs.
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
  function finsbury(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const wings=[[[3.2,4],[9,5.3],[11.2,25],[4,27]],[[23,5.3],[28.8,4],[28,27],[20.8,25]]];
    for(const pts of wings){
      const fs=planBlock(A,pts,.7,25,'plaster');
      for(const F of fs){A.windows(F,2,Math.max(2,Math.floor(F.length/4)),4,11.5,2.5,5.8,'rect');band(A,F,13.1,.25);F.panel(0,F.length,24,24.8,Q.creamHi,.12);}
      slab(A,pts,25.4,.5,Q.creamHi);rail(A,pts,25.5,1.4,true,P.lead);
    }
    const link=A.volume(8.5,23.5,10,17,.8,22,'plaster');
    for(const F of[link.front,link.back])glassFace(A,F,4,10,6);
    A.volume(11,21,10.5,15.7,22,25.7,'plaster');A.parapet(10.7,21.3,10.2,16,25.7,false);
    barrel(A,12,20,3.3,9.7,17,3.8);
    const pts=[[8,16],[24,16],[24,19],...Array.from({length:13},(_,j)=>{const a=j*Math.PI/12;return[16+8*Math.cos(a),19+4*Math.sin(a)];})];
    const foyer=planBlock(A,pts,.8,13,'plaster',Q.creamHi);
    for(let j=2;j<foyer.length;j++){
      const F=foyer[j];if(F.length<.2)continue;
      F.panel(.04,F.length-.04,3,11,(x,y,z)=>A.K.mod(z,1.15)<.10||A.K.mod(Math.abs(F.nx)>.5?y:x,1.15)<.10?Q.creamHi:[P.glassHi,P.warmD],.15);
    }
    const entry=face(A,[13,23],[19,23],0,1);glassFace(A,entry,1.4,10.8,3);
    S.box(7.6,24.4,15.7,19.3,12.8,13.7,Q.creamHi,Q.creamD,Q.creamHi);
    ramp(A,14.2,17.8,30.4,23.1,.6,1.6);
    return{...A.finish(),details:{plan:'splayed-H',twoStoreyWings:2,convexGlassBlockEntry:true,straightRamp:true,recessedRoofTerrace:true,rearBarrelLectureRoof:true,medicalMechanics:false}};
  }
  function chelsea(row,view){
    const A=context(row,view),{S,P}=A;
    const ranges=[[3,8,5,28],[24,29,5,28],[8,24,4,10]];
    for(const [x0,x1,y0,y1]of ranges){
      const fs=A.volume(x0,x1,y0,y1,.6,31,'brick');
      for(const F of Object.values(fs)){A.windows(F,3,Math.max(1,Math.round(F.length/4.5)),4,9,2.2,4.4,'rect');band(A,F,12,.35);band(A,F,30.6,.5);}
      A.mansard(x0-.4,x1+.4,y0-.4,y1+.4,31,7,1.1);
      if(y1-y0>15)for(const y of[9,17,24]){
        const d=A.volume(x0+.8,x1-.8,y-.75,y+.75,34,37,'plaster');A.pane(d.front,.4,34.5,x1-x0-2.4,2,'rect');A.roof(x0+.6,x1-.6,y-.9,y+.9,37,1.5,'y');
      }
    }
    // Open low colonnades at the sides of Figure Court.
    for(const [x0,x1]of[[8,10.6],[21.4,24]]){
      for(const y of[12,16,20,24,27])column(A,(x0+x1)/2,y,.6,10,.38);
      S.box(x0,x1,10.2,28,10,11,P.stone,P.stoneR,P.stoneHi);
      A.hip(x0-.2,x1+.2,10,28.2,11,1.4,false);
    }
    const hall=face(A,[10.5,10.1],[21.5,10.1],0,1);A.windows(hall,1,3,16,8,2.3,9,'arch');
    A.steps(10.5,21.5,12,15.3,1.5,4);
    for(const x of[11.7,14.55,17.45,20.3])column(A,x,13.7,1.8,24.8,.6);
    S.box(10.5,21.5,10,14.5,24.8,26.2,P.stoneHi,P.stoneR,P.stoneHi);
    pediment(A,10.4,21.6,14.6,26.7,5.2,4.6);
    const drum=A.polygon(16,7.3,2.8,36,40,8,'stone',Math.PI/8);
    for(const F of drum)A.pane(F,.35,37,F.length-.7,2.2,'arch');
    for(let j=0;j<8;j++){const a=Math.PI/8+j*Math.PI/4;column(A,16+2.2*Math.cos(a),7.3+2.2*Math.sin(a),40,46,.22);}
    A.cone(16,7.3,3,1.2,46,50,16,'lead');A.polygon(16,7.3,1.15,50,52,8,'stone');A.cone(16,7.3,1.4,0,52,55,16,'lead');
    S.beam([16,7.3,55],[16,7.3,57],P.gold,.18);
    for(const y of[7,20])for(const x of[5.5,26.5])A.chimney(x,y,36,3);
    return{...A.finish(),details:{selectedCourt:'Figure Court',openUPlan:true,wardStoreys:3,doricPorticoColumns:4,openLowColonnades:2,centralCupola:true,compressedMainRanges:true,elderCareMechanics:false}};
  }
  function stcross(row,view){
    const A=context(row,view),{S,P}=A;
    // A cruciform church and square crossing tower sit behind the court.
    for(const [x0,x1,y0,y1,z]of[[10,19,3.2,18,24],[7.5,23,7,12,23]]){
      const fs=A.volume(x0,x1,y0,y1,.6,z,'flint');for(const F of Object.values(fs))A.windows(F,1,Math.max(1,Math.floor(F.length/4)),9,8,2,8,'pointed');A.roof(x0,x1,y0,y1,z,8,(y1-y0>x1-x0)?'y':'x','flint');
    }
    const tower=A.volume(11.2,18,7.4,14.4,29,46,'flint');
    for(const F of Object.values(tower)){A.windows(F,1,2,34,8,1.2,6,'arch');band(A,F,32,.4);}
    A.parapet(10.8,18.4,7,14.8,46,true);
    const homes=A.volume(3,7.8,7,24,.6,17,'flint');
    for(const F of[homes.right,homes.left])A.windows(F,2,5,3,8,1.5,4,'rect');
    A.roof(2.8,8,6.8,24.2,17,7,'y','flint');
    for(const y of[8.4,12.2,16,19.8,23]){S.box(6.1,7.1,y-.65,y+.65,12,29,P.stone,P.stoneR,P.stoneHi);S.box(5.9,7.3,y-.8,y+.8,28.5,29.2,P.stoneHi,P.stoneR,P.stoneHi);}
    const hall=A.volume(13,28,23,28.6,.6,19,'flint');A.windows(hall.front,1,3,6,9,3,8,'pointed');A.roof(12.8,28.2,22.8,28.8,19,8,'x','flint');
    const gateFront=face(A,[4,29],[11,29],0,1),gateBack=face(A,[11,23],[4,23],0,-1);
    for(const F of[gateFront,gateBack])archWall(A,F,.6,24,[{u:2.2,w:2.6,bottom:.6,spring:6.3,rise:1.3}],'flint',.9,'stone');
    for(const x of[4,11])S.wall([x,23],[x,29],.6,24,A.mat('flint',x===4?-1:1,0));
    for(const F of[gateFront,gateBack])A.windows(F,1,2,13,8,1.5,5,'rect');
    A.roof(3.7,11.3,22.7,29.3,24,5.5,'y','flint');
    // Open cloister, rather than a painted dark strip on a solid wall.
    const cf=face(A,[24.4,10],[24.4,22],-1,0);
    archWall(A,cf,.6,8,[{u:1,w:2,bottom:.6,spring:4.3,rise:1},{u:4,w:2,bottom:.6,spring:4.3,rise:1},{u:7,w:2,bottom:.6,spring:4.3,rise:1},{u:10,w:1.5,bottom:.6,spring:4.3,rise:.75}],'stone',.6);
    S.box(24.1,28,9.7,22.3,8,8.6,P.stone,P.stoneR,P.stoneHi);A.hip(24,28.1,9.5,22.5,8.6,2,false);
    return{...A.finish(),details:{selectedMedievalCourt:true,beaufortGate:true,twoLightHallWindows:true,tallAlmshouseChimneys:5,openCloister:true,cruciformChurch:true,massiveCrossingTower:true,notGenericCastle:true}};
  }
  function fords(row,view){
    const A=context(row,view),{S,P}=A;
    const ranges=[[5,10.5,5,28],[21.5,27,5,28],[10.5,21.5,5,10]];
    for(const [x0,x1,y0,y1]of ranges){
      const low=A.volume(x0,x1,y0,y1,.6,13,'plaster'),upper=A.volume(x0-.55,x1+.55,y0-.45,y1+.45,13,25,'plaster');
      for(const F of Object.values(low)){timberFace(A,F,.8,12.8,1.25,true);A.windows(F,1,Math.max(1,Math.floor(F.length/4.8)),4,8,2,5,'diamond');}
      for(const F of Object.values(upper)){timberFace(A,F,13.2,24.8,1.05,true);A.windows(F,1,Math.max(1,Math.floor(F.length/4.8)),16,8,2.2,5.4,'diamond');}
      A.roof(x0-.8,x1+.8,y0-.7,y1+.7,25,7,(y1-y0>x1-x0)?'y':'x','plaster');
    }
    const F=face(A,[9,29],[23,29],0,1),B=face(A,[23,25.4],[9,25.4],0,-1);
    for(const f of[F,B]){tudorWall(A,f,.6,13,[{u:5.2,w:3.6,bottom:.6,spring:6}],'plaster',.65);timberFace(A,f,10,13,1.2);}
    for(const [a,b,nx]of[[[9,25.4],[9,29],-1],[[23,29],[23,25.4],1]])S.wall(a,b,.6,13,A.mat('plaster',nx,0));
    const top=A.volume(8.5,23.5,25.1,29.5,13,25,'plaster');
    for(const f of Object.values(top)){timberFace(A,f,13,25,1.1,true);A.windows(f,1,Math.max(1,Math.floor(f.length/5)),16,8,2.5,5.5,'diamond');}
    for(const [x0,x1]of[[8.3,13.3],[13.3,18.3],[18.3,23.7]]){
      A.roof(x0,x1,24.9,29.7,25,6,'y','plaster');
      S.beam([x0,29.8,25],[(x0+x1)/2,29.8,31],P.woodD,.35);S.beam([(x0+x1)/2,29.8,31],[x1,29.8,25],P.woodD,.35);
      S.beam([(x0+x1)/2,29.8,25],[(x0+x1)/2,29.8,31],P.woodD,.3);
    }
    for(const y of[9,21])A.chimney(7.8,y,30,3);
    return{...A.finish(),details:{narrowOpenCourtyard:true,closeStudding:true,jettiedUpperFloor:true,trueFourCentredGate:true,selectedFrontGables:3,polygonalGlobeReuse:false,postWarRestoredBuilding:true,elderCareMechanics:false}};
  }
  function trinity(row,view){
    const A=context(row,view),{S,P,Q}=A;
    for(const [x0,x1,y0,y1]of[[3,8,7,24],[24,29,7,24],[8,24,6,10]]){
      const f=A.volume(x0,x1,y0,y1,.6,22,'yellowbrick');
      for(const F of Object.values(f))A.windows(F,2,Math.max(1,Math.floor(F.length/4.3)),4,10,2.2,4.6,'mullion');
      A.roof(x0-.2,x1+.2,y0-.2,y1+.2,22,7,(y1-y0>x1-x0)?'y':'x','plaster');
    }
    // Seven bays including the central gate. The stucco street front is opaque.
    for(const [x0,x1,bays]of[[3,13,3],[19,29,3]]){
      const f=A.volume(x0,x1,23,28,.6,22,'plaster');A.windows(f.front,2,bays,3.5,10,2.1,4.7,'mullion');A.windows(f.back,2,bays,3.5,10,2.1,4.7,'mullion');band(A,f.front,12,.3);A.roof(x0-.2,x1+.2,22.8,28.2,22,7,'x','plaster');
    }
    const F=face(A,[13,28.5],[19,28.5],0,1),B=face(A,[19,23],[13,23],0,-1);
    for(const f of[F,B]){tudorWall(A,f,.6,36,[{u:1.3,w:3.4,bottom:.6,spring:6.8}],'plaster',.7);A.pane(f,2,14,2,5,'mullion');}
    for(const x of[13,19])S.wall([x,23],[x,28.5],.6,36,A.mat('plaster',x===13?-1:1,0));
    A.parapet(12.7,19.3,22.7,28.8,36,true);
    const clockFace=face(A,[13,28.65],[19,28.65],0,1);
    const disc=Array.from({length:24},(_,j)=>clockFace.point(3+1.55*Math.cos(j*Math.PI/12),.05,29+1.55*Math.sin(j*Math.PI/12)));
    S.poly(disc,P.ink);A.K.ring(S,clockFace,3,29,1.8,1.8,.22,.13,P.gold,24);
    for(let j=0;j<12;j++){const a=j*Math.PI/6;S.beam(clockFace.point(3+1.22*Math.cos(a),.19,29+1.22*Math.sin(a)),clockFace.point(3+1.5*Math.cos(a),.19,29+1.5*Math.sin(a)),P.gold,.13);}
    S.beam(clockFace.point(3,.23,29),clockFace.point(3,.23,30.1),P.gold,.17);S.beam(clockFace.point(3,.24,29),clockFace.point(3.9,.24,29.5),P.gold,.17);
    for(const x of[4.2,27.8]){
      const gf=face(A,[x-2.6,28.7],[x+2.6,28.7],0,1);
      for(let j=0;j<4;j++){const w=2.6-j*.55;gf.block(2.6-w,2.6+w,0,.75,22+j*2,24+j*2,Q.cream,Q.creamD,Q.creamHi);}
      for(const xx of[x-2.4,x+2.4]){S.box(xx-.18,xx+.18,28.4,28.85,22,28,Q.creamHi,Q.creamD,Q.creamHi);A.cone(xx,28.65,.6,0,28,30,8,'lead');}
    }
    for(let j=0;j<4;j++){const a=j*Math.PI/2+Math.PI/4;S.box(16+1.7*Math.cos(a)-.16,16+1.7*Math.cos(a)+.16,25.8+1.7*Math.sin(a)-.16,25.8+1.7*Math.sin(a)+.16,39,43,Q.cream,Q.creamD,Q.creamHi);}
    A.cone(16,25.8,2.1,0,43,48,8,'lead');S.beam([16,25.8,48],[16,25.8,49.5],P.gold,.15);
    // The rear power-station stacks in the source photograph are deliberately absent.
    return{...A.finish(),details:{streetFront:'off-white stucco',frontBays:7,centralGateClockTower:true,fourCentredPassage:true,steppedEndGables:2,smallSpire:true,realInnerCourt:true,neighbouringPowerStationExcluded:true}};
  }
  function mineral(row,view){
    const A=context(row,view),{S,P}=A;
    const f=A.volume(3,29,8,23,.6,33,'stone');
    for(const F of[f.front,f.back]){A.windows(F,2,11,5,11.5,1.45,6.5,'rect');A.windows(F,1,11,28.5,8,1.4,3,'rect');band(A,F,16,.5);band(A,F,27.8,.7);band(A,F,33,.8);}
    for(const F of[f.left,f.right]){A.windows(F,2,4,5,11.5,1.6,6.5,'rect');A.windows(F,1,4,28.5,8,1.4,3,'rect');}
    A.mansard(2.7,29.3,7.7,23.3,33.5,6.5,2);
    // Four giant unfluted Ionic pilasters are real shallow projections.
    for(const x of[10.9,14.3,17.7,21.1]){
      S.box(x-.42,x+.42,23.05,23.9,2,28,P.stoneHi,P.stoneR,P.stoneHi);
      S.box(x-.65,x+.65,23,24.05,1.4,2.3,P.stoneHi,P.stoneR,P.stoneHi);
      S.box(x-.68,x+.68,23,24.08,27.7,28.6,P.stoneHi,P.stoneR,P.stoneHi);
      const F=face(A,[x-.8,24.13],[x+.8,24.13],0,1);for(const u of[.25,1.35])A.K.ring(S,F,u,28,.28,.28,.12,.12,P.stoneD,12);
    }
    pediment(A,10,22,24.2,31.2,6.8,1.5);
    const F=face(A,[13.7,24],[18.3,24],0,1);A.pane(F,.9,1.7,2.8,8,'rect');pediment(A,13.7,18.3,24.7,11.8,1.7,.75);
    A.steps(13.5,18.5,24.4,28.7,1.4,5);
    // Only the photograph-verified central facade/range is selected; no invented bridge.
    return{...A.finish(),details:{historicSiteVacated:2019,selectedCentralRangeOnly:true,frontBays:11,bayGrouping:'4+3+4',storeys:2,highAttic:true,giantIonicPilasters:4,centralPediment:true,unverifiedWestBridgeOmitted:true,medicalMechanics:false}};
  }
  function dundee(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const pts=[[4,8],[26,7],[28,12],[27,25],[20,27],[17,23],[13,23],[12,27],[4,25],[3,16]];
    const fs=planBlock(A,pts,.6,21,'plaster',Q.creamHi);
    for(const F of fs)if(F.length>4)A.pane(F,.7,5,F.length-1.4,8,'ribbon');
    const xs=[2.8,6.4,10,13.5,17.2,21,25,29],front=[22,19.5,25,21.5,26,21,24.5,21.5],back=[24,27,23.5,28,24,28.5,25,24];
    for(let j=0;j<xs.length-1;j++){
      const m=A.dark((j&1)?-1:1,0)?Q.steel:Q.steelHi;
      S.poly([[xs[j],7,back[j]],[xs[j+1],7,back[j+1]],[xs[j+1],27.4,front[j+1]],[xs[j],27.4,front[j]]],m);
      S.poly([[xs[j],27.4,front[j]],[xs[j+1],27.4,front[j+1]],[xs[j+1],27.4,front[j+1]-.55],[xs[j],27.4,front[j]-.55]],Q.creamHi);
      for(let k=0;k<4;k++){const t=k/4,x=xs[j]+(xs[j+1]-xs[j])*t;S.beam([x,7,back[j]+(back[j+1]-back[j])*t+.06],[x,27.4,front[j]+(front[j+1]-front[j])*t+.06],P.lead,.10);}
    }
    lathe(A,22,11,[[19,4.1],[26,4.05],[43,3.3]],'plaster',28);
    S.poly(ellipse(22,11,3.3,3.3,28).map(p=>[...p,43]),Q.creamHi);
    rim(A,ellipse(22,11,3.4,3.4,28),ellipse(22,11,3.15,3.15,28),42.8,43.3,'plaster');
    const entry=face(A,[13,23.1],[17,23.1],0,1);glassFace(A,entry,.8,15,2);A.steps(12.5,17.5,25,29,1,4);
    return{...A.finish(),details:{whiteCottageBody:true,irregularSilverRoofFolds:7,unequalFoldProfiles:true,taperedRoundTower:true,actualGehryExteriorReference:true,inpatientHospital:false,medicalMechanics:false}};
  }
  function roofGarden(A,cx,cy,r,z,seed){
    const {S,K,P}=A;
    S.poly(ellipse(cx,cy,r,r*.86,24).map(p=>[...p,z]),(x,y)=>P.leaf[K.hash(Math.floor(x*2),Math.floor(y*2),seed)%4]);
    for(let j=0;j<9;j++){
      const a=j*2.4,rr=r*(.2+.055*j),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.83,h=1.3+(j%3)*.7;
      K.cylinder(S,x,y,z,z+h,.45,.7,P.leaf[j%4],P.leaf[(j+1)%4],P.leaf[(j+2)%4],8);
      S.beam([x,y,z],[x,y,z+h+1],P.woodD,.12);
      if(j%3===0)S.poly(ellipse(x,y,.9,.7,9).map(p=>[...p,z+h+1.2]),P.leaf[j%4]);
    }
  }
  function leeds(row,view){
    const A=context(row,view),{S,P}=A;
    const core=A.volume(9,25,10,24,.6,15,'wood');
    for(const F of Object.values(core))glassFace(A,F,2,13,Math.max(2,Math.round(F.length/3)));
    const pots=[{x:9,y:10,r:7.5,z:32},{x:23,y:12,r:6.6,z:26},{x:17,y:24,r:7.6,z:21}];
    for(const [i,q]of pots.entries()){
      const profile=[[.7,q.r*.43],[q.z*.44,q.r*.45],[q.z*.76,q.r*.55],[q.z*.92,q.r*.78],[q.z,q.r]];
      lathe(A,q.x,q.y,profile,'cedar',32);
      for(let j=0;j<32;j++){
        const a=j*2*Math.PI/32,pts=profile.map(([z,r])=>[q.x+(r+.07)*Math.cos(a),q.y+(r+.07)*Math.sin(a),z]);
        for(let k=0;k<pts.length-1;k++)S.beam(pts[k],pts[k+1],A.dark(Math.cos(a),Math.sin(a))?P.woodR:P.woodHi,.2);
      }
      const top=ellipse(q.x,q.y,q.r,q.r,32),inside=ellipse(q.x,q.y,q.r-.4,q.r-.4,32);
      rim(A,top,inside,q.z-.4,q.z+.25,'wood');roofGarden(A,q.x,q.y,q.r-.45,q.z+.3,3600+i);
    }
    ramp(A,26.8,29,30,21,.6,1.5);
    return{...A.finish(),details:{flaredTimberPlanters:3,differentRoofHeights:[32,26,21],curvedVerticalRibs:true,connectedGlazing:true,plantedRoof:true,plantsConfinedToNewSprite:true,inpatientHospital:false,medicalMechanics:false}};
  }
  function manchester(row,view){
    const A=context(row,view),{S,P}=A;
    const body=A.volume(3.2,28.8,5,23,.6,16,'wood');
    for(const F of Object.values(body))glassFace(A,F,2,14.7,Math.max(2,Math.floor(F.length/3.4)));
    // A low spreading timber frame surrounds a higher central mezzanine roof.
    for(const x of[3,7,11,21,25,29])for(const y of[5,13,23]){
      S.beam([x,y,.6],[x,y,18],P.woodHi,.42);
      S.beam([x,y,6],[Math.min(29,x+2.7),y,18],P.woodHi,.32);
    }
    for(const [x0,x1]of[[2.2,12.1],[19.9,29.8]]){
      S.poly([[x0,4,18.4],[x1,4,19.7],[x1,25,19.7],[x0,25,18.4]],A.mat('zinc',x0<16?-1:1,0));
      for(const y of[4,10,17,25])S.beam([x0,y,18.4],[x1,y,19.7],P.woodHi,.38);
    }
    const nave=A.volume(12,20,7,22,15.5,24,'wood');
    for(const F of[nave.left,nave.right])glassFace(A,F,18,23,5);
    A.roof(11.7,20.3,4,25,24,10,'y','wood');
    for(const y of[5,10,15,20,24])for(const x of[11.8,20.2]){
      S.beam([x,y,.7],[x,y,24],P.woodHi,.44);S.beam([x,y,18],[16,y,34],P.woodHi,.38);
    }
    // Separate genuine gabled glasshouse, not a bright painted roof decal.
    glassRoof(A,12.5,19.5,23,30,15,13,5);
    for(const [x,nx]of[[12.5,-1],[19.5,1]]){
      const F=face(A,[x,30],[x,23],nx,0);glassFace(A,F,1,15,4);
    }
    const end=face(A,[12.5,30],[19.5,30],0,1);glassFace(A,end,.7,15,3);
    for(const x of[12.5,19.5])S.beam([x,30,.6],[16,30,28],P.woodHi,.4);
    S.beam([16,30,.6],[16,30,28],P.woodHi,.32);
    for(const x of[4,8,24,28]){S.box(x-.7,x+.7,27.1,28.5,.5,2,P.wood,P.woodR,P.soil);S.poly(ellipse(x,27.8,.9,.8,10).map(p=>[...p,3]),P.green);}
    return{...A.finish(),details:{lowSpreadingTimberFrame:true,centralRaisedMezzanineRoof:true,exposedDiagonalBraces:true,separateGabledGreenhouse:true,roofNotAllGlass:true,inpatientHospital:false,medicalMechanics:false}};
  }
  function oxford(row,view){
    const A=context(row,view),{S,P,Q}=A;
    const wings=[
      {p:[[3.5,19],[11.5,13.6],[17.2,19.8],[12.2,28.8],[4.5,26]],z:27,roof:[29,30.5,28.5,27.5,28]},
      {p:[[9,5],[21,3.5],[25,9],[18,15],[10,12]],z:29,roof:[31,33,30.5,29.5,30]},
      {p:[[19,13],[28.8,12],[29,23],[22,26],[17,20]],z:25,roof:[28,29,26.5,25.8,27]}
    ];
    for(const [k,q]of wings.entries()){
      for(const p of q.p)S.beam([p[0],p[1],.6],[p[0],p[1],8],P.steelHi||P.lead,.3);
      const fs=planBlock(A,q.p,7.5,q.z,'whiteboard',false);
      for(let j=0;j<fs.length;j++){
        const F=fs[j];
        if(j===1||j===3){
          glassFace(A,F,9,q.z-1,Math.max(2,Math.floor(F.length/2.8)));
          for(let u=.2;u+2.2<F.length;u+=2.4){
            S.beam(F.point(u,.45,9),F.point(Math.min(u+3.4,F.length),.45,q.z-1),P.woodHi,.25);
            S.beam(F.point(u,.46,q.z-1),F.point(Math.min(u+3.4,F.length),.46,9),P.woodHi,.25);
          }
        }else for(let u=.2;u<F.length;u+=.9)F.panel(u,u+.11,8,q.z,Q.creamD,.12);
        S.beam(F.point(0,.1,7.5),F.point(F.length,.1,7.5),P.woodD,.3);
        const a=q.p[j],b=q.p[(j+1)%q.p.length];
        S.poly([[...a,q.z],[...b,q.z],[...b,q.roof[(j+1)%q.p.length]],[...a,q.roof[j]]],A.mat('whiteboard',F.nx,F.ny));
      }
      S.poly(q.p.map((p,j)=>[...p,q.roof[j]]),A.mat('zinc',k===0?-1:1,k===1?-1:1));
      for(let j=0;j<q.p.length;j++){const a=q.p[j],b=q.p[(j+1)%q.p.length];S.beam([...a,q.roof[j]],[...b,q.roof[(j+1)%q.p.length]],P.woodD,.35);}
    }
    // Thin posts leave the raised undercroft genuinely open.
    ramp(A,14.5,17,30.3,21,.7,7.6);
    return{...A.finish(),details:{stiltedOpenUndercroft:true,angularBranchingWings:3,foldedRoofProfiles:3,diagonalLatticeGlazing:true,independentEntryRamp:true,planterReuse:false,inpatientHospital:false,medicalMechanics:false}};
  }

  const AUTHORS=Object.freeze([finsbury,chelsea,stcross,fords,trinity,mineral,dundee,leeds,manchester,oxford]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave036 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture036=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
