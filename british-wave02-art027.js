/* GPT-027 / wave02. Native geometric prototypes, not copied photo textures.
 * Rows grow to ten before integration; an early preview is explicitly partial.
 * Shared approved Scene, palette, simulation and RNG remain unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
    {id:'croydon',nm:'克羅伊登航站樓',en:'Croydon Airport Terminal',shape:'cargo-wings-glazed-booking-dome-square-control-tower',note:'低貨運翼、玻璃採光廳與四層方形控制塔；鋼框窗、深窗台和屋頂天線。',url:'https://www.historiccroydonairport.org.uk/history/building-britains-first-airport-terminal/',imageSource:'https://www.historiccroydonairport.org.uk/image-gallery/'},
    {id:'preston',nm:'普雷斯頓巴士站',en:'Preston Bus Station',shape:'five-open-decks-curved-concrete-lips-glazed-concourse',note:'五層開放車庫、外挑曲面混凝土邊緣、柱列與底層玻璃大廳；無新增交通路線。',url:'https://www.johnputtickassociates.com/project/preston-bus-station/'},
    {id:'arnos',nm:'阿諾斯格羅夫站',en:'Arnos Grove Station',shape:'brick-and-vertical-glass-drum-square-low-base-flat-disc',note:'高圓鼓售票廳，直立鋼窗與磚帶交替；低站翼、深出挑平屋頂。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1358981'},
    {id:'campden',nm:'坎普登石拱市集',en:'Chipping Campden Market Hall',shape:'double-open-stone-arcade-six-gables-valley-roof',note:'雙排透空石拱、中央柱列、六座山牆與谷形石板屋頂；窗為封堵石窗。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1078442'},
    {id:'guildford',nm:'吉爾福德行會廳',en:'Guildford Guildhall',shape:'narrow-jettied-three-bay-facade-projecting-clock-lead-cupola',note:'窄高三開間木造街面、突出鐘架、凸出樓層、分格窗與鉛頂小亭。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1180101'},
    {id:'birmingham',nm:'伯明翰博物館鐘樓',en:'Birmingham Museum and Big Brum',shape:'civic-gallery-pedimented-portico-corner-clock-tower-tile-cap',note:'寬展公共展廳、深門廊與雕刻山花，側置方形鐘塔及瓦頂。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1210333'},
    {id:'coventry',nm:'考文垂現代新堂',en:'Coventry New Cathedral',shape:'folded-window-nave-bowed-baptistery-large-glass-screen',note:'現代折面側窗、弧形洗禮堂彩窗與高玻璃入口；不挪用舊堂哥德尖塔。',url:'https://www.coventrycathedral.org.uk/locations/the-new-cathedral'},
    {id:'spacecentre',nm:'萊斯特太空中心',en:'National Space Centre',shape:'etfe-pillow-rocket-tower-low-perforated-hall-planetarium',note:'高圓胖膜結構火箭塔、低展廳與天象廳；膜枕接縫和鋼骨為實際幾何。',url:'https://grimshaw.global/projects/culture-and-exhibition/national-space-centre/'},
    {id:'penshaw',nm:'彭肖紀念柱廊',en:'Penshaw Monument',shape:'roofless-doric-peristyle-four-by-seven-open-pediments',note:'英格蘭1844年紀念建築；四乘七柱列、深簷楣與山花，保留原型透空屋頂。',url:'https://www.nationaltrust.org.uk/visit/north-east/penshaw-monument/history-of-penshaw-monument'},
    {id:'blackpool',nm:'黑池鐵塔',en:'Blackpool Tower',shape:'four-splayed-lattice-legs-observation-stack-victorian-base',note:'細高四足格構鐵塔、分段觀景台與低層維多利亞公共樓；斜撐有透空結構。',url:'https://www.theblackpooltower.com/history/'}
  ].map((q,i)=>Object.freeze({...q,v:200+4*i})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0')};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      if(kind==='brick')return K.brick(d,2701);
      if(kind==='stone')return K.ashlar(d,2702);
      if(kind==='steel')return(u,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(u,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
      return(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),2703)%47===0?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
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
      }else if(type==='pointed'||type==='arch'){
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
        const tex=kind==='lead'?(dark(Math.cos(m),Math.sin(m))?Q.steelD:Q.steel):K.slate(dark(Math.cos(m),Math.sin(m)));
        S.poly([[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,z0],[cx+Math.cos(b)*r0,cy+Math.sin(b)*r0,z0],[cx+Math.cos(b)*r1,cy+Math.sin(b)*r1,z1],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,z1]],tex);
      }
    }
    function parapet(x0,x1,y0,y1,z,battled){
      for(const [xa,xb,ya,yb]of[[x0,x1,y0,y0+.45],[x0,x1,y1-.45,y1],[x0,x0+.45,y0,y1],[x1-.45,x1,y0,y1]])S.box(xa,xb,ya,yb,z,z+1.7,P.stone,P.stoneR,P.stoneHi);
      if(battled)for(let u=x0;u<x1;u+=2.6)for(const y of[y0,y1-.8])S.box(u,Math.min(u+1.35,x1),y,y+.8,z+1.7,z+3,P.stone,P.stoneR,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++)S.box(x0,x1,y0+(y1-y0)*i/n,y1,.42,.42+rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}
    function chimney(x,y,z,h){volume(x-.65,x+.65,y-.7,y+.7,z,z+h,'brick');S.box(x-.9,x+.9,y-.9,y+.9,z+h,z+h+.7,P.stone,P.stoneR,P.stoneHi);for(const dx of[-.38,.38])K.cylinder(S,x+dx,y,z+h+.7,z+h+2.5,.24,.28,Q.red,Q.redD,P.ink,8);}
    if(!root.__wave027GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave027GeometryOnly){K.lantern(S,3.2,28.4,4.3,true);K.lantern(S,28.8,28.4,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave027:1});
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
  function croydon(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    // Compressed whole-building interpretation: two lower cargo wings and atrium.
    const L=volume(2.4,10.4,12.5,26,.45,11.4,'plaster'),R=volume(21.6,29.6,12.5,26,.45,11.4,'plaster');
    for(const F of[L.left,R.right]){
      for(let b=0;b<4;b++){const u=.75+b*3.15;K.timberDoor(F,u,.55,2.3,6.3,true);F.block(u-.25,u+2.55,.04,.85,6.8,7.4,P.stone,P.stoneR,P.stoneHi);D.pane(F,u+.25,8,1.8,2.1,'ribbon');}
      D.cornice(F,11.4);
    }
    for(const F of[L.front,R.front,L.back,R.back]){D.pane(F,1.5,3.5,4.8,4.7,'ribbon');D.cornice(F,11.4);}
    const B=volume(10.2,21.8,12,26,.45,21.6,'plaster');
    for(const F of[B.front,B.left,B.right,B.back]){for(let j=0;j<2;j++)D.pane(F,F.length*.5-3,3.1+j*9.1,6,6.4,'mullion');D.cornice(F,21.6);}
    // Booking Hall's steel-framed glass dome, not an invented pitched roof.
    const cx=16,cy=18.9,rad=4.5,base=22.5;
    for(let band=0;band<4;band++)for(let j=0;j<16;j++){
      const aa=j*Math.PI/8,bb=(j+1)*Math.PI/8,t0=band*Math.PI/8,t1=(band+1)*Math.PI/8;
      const p=(a,t)=>[cx+Math.cos(a)*rad*Math.cos(t),cy+Math.sin(a)*rad*Math.cos(t),base+4*Math.sin(t)];
      S.poly([p(aa,t0),p(bb,t0),p(bb,t1),p(aa,t1)],[A.dark(Math.cos(aa),Math.sin(aa))?P.glassR:P.glass,P.warm]);
      D.ribs(p(aa,t0),p(aa,t1));if(band===0)D.ribs(p(aa,t0),p(bb,t0));
    }
    // Four-storey, square control tower and roof-mounted radio masts.
    const T=volume(11.6,20.4,3.8,12.6,.45,43,'plaster');
    for(const F of Object.values(T)){
      for(let floor=0;floor<4;floor++)D.pane(F,.95,3.7+floor*9.8,F.length-1.9,6.2,'ribbon');
      for(const z of[11.6,21.4,31.2,43])D.cornice(F,z);
    }
    S.box(10.8,21.2,3,13.4,43.6,44.5,Q.steel,Q.steelD,P.stoneHi);
    for(const x of[13,19]){S.beam([x,8.2,44.5],[x,8.2,64],Q.steelD,.27);S.beam([x-2.2,8.2,59.2],[x+2.2,8.2,59.2],Q.steel,.2);D.ribs([x-2.6,8.2,45],[x,8.2,58.8]);D.ribs([x+2.6,8.2,45],[x,8.2,58.8]);}
    A.steps(12.1,19.9,26,30,1.6,4);K.timberDoor(B.front,4.35,.65,2.9,7.5,true);
    return{...A.finish(),details:{...D.counts,controlFloors:4,cargoBays:8,roof:'steel-framed-glass-dome-and-flat-concrete-caps'}};
  }
  function preston(row,view){
    const A=context(row,view),D=details(A),{S,P,Q,volume}=A;
    const F=volume(4.1,27.9,9.4,23.4,.45,9.3,'plaster');
    for(const side of['front','back'])for(let j=0;j<7;j++)D.pane(F[side],.65+j*3.25,1.45,2.4,6.4,'ribbon');
    for(const side of['left','right'])for(let j=0;j<3;j++)D.pane(F[side],.7+j*4.3,1.45,3.2,6.4,'ribbon');
    for(const x of[3.4,8.4,13.4,18.4,23.4,28.4])for(const y of[8.6,24.2])S.box(x-.24,x+.24,y-.3,y+.3,.45,11,P.stone,P.stoneR,P.stoneHi);
    for(let level=0;level<5;level++){
      const z=10.7+level*5.8;
      S.box(2.6,29.4,7.8,25,z,z+.8,P.stone,P.stoneR,P.stoneHi);
      // Open parking decks: real gaps, columns and rolled concrete parapets.
      // Recessed real deck core makes the open gap read as depth, not a stripe.
      if(level<4){S.box(5.4,26.6,13.8,19.2,z+.8,z+5.8,Q.steelD,P.ironD,P.ironD);for(const x of[8,16,24])for(const y of[10.7,22.1])S.box(x-.35,x+.35,y-.35,y+.35,z+.8,z+5.8,P.stone,P.stoneR,P.stoneHi);}
      for(const side of[-1,1])for(let j=0;j<8;j++){
        const a=j*Math.PI/16,b=(j+1)*Math.PI/16,edge=side<0?7.8:25;
        const p=t=>[edge+side*2.1*Math.sin(t),z+.8+2.1*(1-Math.cos(t))],aa=p(a),bb=p(b);
        const shades=A.dark(0,side)?[Q.creamD,P.stoneR,P.stoneD]:[P.stoneHi,P.stone,Q.creamD],shade=shades[Math.min(2,Math.floor(j/3))];
        S.poly([[2.6,aa[0],aa[1]],[29.4,aa[0],aa[1]],[29.4,bb[0],bb[1]],[2.6,bb[0],bb[1]]],shade);
      }
      for(const x of[2.6,29.4])S.box(x-.16,x+.16,7.8,25,z+.8,z+2.9,P.stone,P.stoneR,P.stoneHi);
      for(let x=5;x<29;x+=4.1)S.beam([x,10,z+.86],[x,21.8,z+.86],P.iron,.08);
    }
    const C=volume(25.6,29,11.7,21.2,.45,40.5,'plaster');
    for(let level=0;level<5;level++)D.pane(C.right,3.8,8.6+level*5.8,1.8,3.6,'ribbon',false);
    for(const f of Object.values(C))D.cornice(f,40.5);
    S.box(25.2,29.4,11.3,21.6,41.1,41.7,P.stone,P.stoneR,P.stoneHi);
    return{...A.finish(),details:{...D.counts,openParkingDecks:5,curvedParapetSegments:80,roof:'open-flat-deck-and-curved-overhangs'}};
  }
  // Openings are actual gaps: no transparent paint over an opaque wall.
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
  function arnos(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume,polygon}=A;
    const B=volume(3,29,6.2,26,.45,9.5,'brick');
    for(const f of Object.values(B)){D.cornice(f,9.5);if(f===B.front){D.pane(f,1,2,7.5,5.3,'ribbon');D.pane(f,17.5,2,7.5,5.3,'ribbon');K.timberDoor(f,10.7,.5,4.6,7.8,true);}else for(let k=0;k<3;k++)D.pane(f,f.length*(k+.5)/3-2.2,2,4.4,5.2,'ribbon');}
    const ring=polygon(16,15.5,8.7,9.6,29.5,24,'brick',Math.PI/24);
    for(let j=0;j<ring.length;j++){
      const f=ring[j];if(j%3!==0)continue;
      A.pane(f,.28,13,f.length-.56,13,'ribbon',true);
      for(const z of[16,19,22,25])S.beam(f.point(.34,.36,z),f.point(f.length-.34,.36,z),P.frame,.17);
    }
    // A flat concrete disc with projecting cornice; no cone or domestic dormers.
    polygon(16,15.5,9.5,29.5,30.5,32,'plaster');polygon(16,15.5,9.8,30.5,31,32,'plaster');
    for(let j=0;j<24;j++){const t=j*Math.PI/12;S.box(16+9.2*Math.cos(t)-.13,16+9.2*Math.cos(t)+.13,15.5+9.2*Math.sin(t)-.13,15.5+9.2*Math.sin(t)+.13,28.9,29.6,P.stone,P.stoneR,P.stoneHi);}
    S.box(2.5,29.5,5.7,26.5,9.6,10.3,P.stone,P.stoneR,P.stoneHi);
    B.front.panel(8.5,17.5,8.1,9.2,Q.steelD,.76);A.steps(12.3,19.7,26,30,1.1,3);
    return{...A.finish(),details:{...D.counts,drumFacets:24,verticalWindowBands:8,roof:'oversailing-flat-concrete-disc-and-low-square-base'}};
  }
  function campden(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    const long=[arcade(A,[3,23],[29,23],0,1,5,.8,7.3,3.2,12.6),arcade(A,[29,9],[3,9],0,-1,5,.8,7.3,3.2,12.6)];
    const ends=[arcade(A,[3,9],[3,23],-1,0,2,.8,7.3,3.2,12.6),arcade(A,[29,23],[29,9],1,0,2,.8,7.3,3.2,12.6)];
    S.box(2.4,29.6,8.4,23.6,.43,1,P.stone,P.stoneR,P.stoneHi);
    for(const x of[3,8.2,13.4,18.6,23.8,29]){S.box(x-.36,x+.36,15.65,16.35,1,12.8,P.stone,P.stoneR,P.stoneHi);S.box(x-.58,x+.58,15.4,16.6,12.1,12.8,P.stoneHi,P.stoneR,P.stoneHi);}
    // The official record gives two rows of three gables and a valley roof.
    for(let k=0;k<3;k++){
      const x0=2.8+k*8.8,x1=x0+8.8,cx=(x0+x1)/2,z=12.8,peak=20.5;
      for(const y of[8.7,23.3]){
        S.poly([[x0,y,z],[x1,y,z],[cx,y,peak]],A.mat('stone',0,y<16?-1:1));
        const f=Object.assign(S.face([x0,y],[x1,y],0,y<16?-1:1),{nx:0,ny:y<16?-1:1});
        f.panel(3.2,5.6,14,16.9,P.stoneD,.12);f.block(3.05,5.75,0,.38,13.6,14.1,P.stoneHi,P.stoneR,P.stoneHi);f.panel(4.31,4.49,14,17.1,P.stoneHi,.3);
        S.beam([x0,y,z],[cx,y,peak],P.stoneHi,.4);S.beam([cx,y,peak],[x1,y,z],P.stoneHi,.4);
        K.cylinder(S,cx,y,20.5,21.5,.25,.32,P.stone,P.stoneR,P.stoneHi,4);A.cone(cx,y,.5,0,21.5,22.8,4,'slate');
      }
      S.poly([[x0,8.7,z],[cx,8.7,peak],[cx,23.3,peak],[x0,23.3,z]],K.slate(A.dark(-1,0)));
      S.poly([[x1,8.7,z],[x1,23.3,z],[cx,23.3,peak],[cx,8.7,peak]],K.slate(A.dark(1,0)));
      S.beam([cx,8.5,peak],[cx,23.5,peak],P.stoneHi,.35);
      if(k>0)S.beam([x0,8.7,z],[x0,23.3,z],P.lead,.32);
    }
    for(const f of long)for(let k=0;k<=5;k++){const u=k*f.length/5;f.block(u-.5,u+.5,.4,1.1,1,3,P.stone,P.stoneR,P.stoneHi);}
    return{...A.finish(),details:{openArcadeBays:14,blockedStoneWindows:6,gables:6,roof:'three-parallel-stone-roofs-with-valleys',centralColonnade:true}};
  }
  function guildford(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const rear=volume(10,22,3.2,24,.5,20,'brick'),upper=volume(8.8,23.2,22,27,11.5,25,'plaster');
    for(const f of[rear.left,rear.right,rear.back]){D.pane(f,f.length/2-2.3,4,4.6,6,'mullion');D.pane(f,f.length/2-2.3,13,4.6,5.6,'mullion');}
    for(let k=0;k<3;k++){
      const x=10.7+k*5.2;S.box(x-.35,x+.35,23.1,26.2,.5,11.8,Q.oak,Q.oakD,Q.oak);K.timberDoor(upper.front,1+k*4.45,.5,3.5,9.4,true);D.pane(upper.front,1+k*4.4,14,3.7,7.2,'mullion');
      S.beam([x,26.9,9],[x,28,11.7],Q.oakD,.5);
    }
    for(const u of[.45,4.95,9.45,13.95])upper.front.block(u-.15,u+.15,.22,.86,12.8,23.2,P.stoneHi,P.stoneR,P.stoneHi);
    D.cornice(upper.front,24.5);A.roof(8.4,23.6,2.8,27.5,25.3,7.8,'y','brick');
    for(const f of[upper.front]){f.block(-.2,f.length+.2,.1,1.4,11.5,12.1,P.stoneHi,P.stoneR,P.stoneHi);S.beam(f.point(-.1,1.5,14.1),f.point(f.length+.1,1.5,14.1),P.iron,.2);for(let u=0;u<=f.length;u+=.75)S.beam(f.point(u,1.5,12.1),f.point(u,1.5,14.1),P.iron,.12);}
    const cup=A.polygon(16,18.5,2.5,31.5,37.5,8,'wood',Math.PI/8);for(const f of cup)A.pane(f,.2,33,f.length-.4,3.7,'arch',false);
    A.cone(16,18.5,3.1,1.4,37.5,40,8,'lead');A.cone(16,18.5,1.4,0,40,41.2,8,'lead');S.beam([16,18.5,41.2],[16,18.5,43.6],P.iron,.18);
    // The clock projects at right angles to the street frontage on a real beam.
    S.beam([16,26.4,27],[16,31,27],Q.oak,.65);S.beam([16,26.8,30],[16,30,27],P.iron,.2);S.beam([14,26.7,27],[16,30,27],P.iron,.16);S.beam([18,26.7,27],[16,30,27],P.iron,.16);
    const clock=volume(15.4,16.6,28.1,31,27,31.7,'wood');for(const f of[clock.left,clock.right]){
      f.panel(.32,f.length-.32,27.5,31.1,P.stoneHi,.12);S.beam(f.point(f.length/2,.2,29.2),f.point(f.length/2,.2,30.6),P.ink,.14);S.beam(f.point(f.length/2,.2,29.2),f.point(f.length/2+.8,.2,28.8),P.ink,.14);
    }
    A.chimney(17.7,11,31,2.4);return{...A.finish(),details:{...D.counts,frontBays:3,projectingClock:true,roof:'plain-tile-long-hall-and-octagonal-ribbed-lead-cupola'}};
  }
  function birmingham(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const G=volume(9,29,5,25,.5,23,'stone');
    for(const f of Object.values(G)){for(let j=0;j<4;j++){D.pane(f,(j+.5)*f.length/4-1.5,4.4,3,5.7,'arch');D.pane(f,(j+.5)*f.length/4-1.65,14.3,3.3,6.5,'arch');}D.cornice(f,23);}
    A.hip(8.5,29.5,4.5,25.5,24,5,true);
    // Deep two-storey museum portico, scaled to preserve its doorway recess.
    for(const x of[13,17,21,25]){
      K.cylinder(S,x,27.5,2,19,1,.7,P.stone,P.stoneR,P.stoneHi,12);S.box(x-1,x+1,26.5,28.5,1.4,2.2,P.stone,P.stoneR,P.stoneHi);S.box(x-1.2,x+1.2,26.3,28.7,18.3,19.5,P.stoneHi,P.stoneR,P.stoneHi);
    }
    S.box(11.2,26.8,25.6,29.2,19.5,21,P.stone,P.stoneR,P.stoneHi);S.poly([[11.2,29.2,21],[26.8,29.2,21],[19,29.2,27]],A.mat('stone',0,1));S.beam([11,29.3,21],[19,29.3,27.2],P.stoneHi,.52);S.beam([19,29.3,27.2],[27,29.3,21],P.stoneHi,.52);
    K.timberDoor(G.front,8.3,.55,3.4,10,true);A.steps(11.3,26.7,28.8,31,1.5,3);
    const T=volume(2.5,10.7,10.7,19,.5,48,'stone');
    for(const f of Object.values(T)){
      for(const z of[10,21,32,44,48])D.cornice(f,z);D.pane(f,2.6,25,3,7,'arch',false);
      f.panel(1.6,6.6,35.5,41,P.stoneHi,.28);const u=f.length/2;S.beam(f.point(u,.4,38.3),f.point(u,.4,40.4),P.ink,.18);S.beam(f.point(u,.4,38.3),f.point(u+1.5,.4,37.6),P.ink,.18);
    }
    A.hip(2.1,11.1,10.3,19.4,49,8,false);S.beam([6.6,14.85,57],[6.6,14.85,60],P.iron,.22);
    return{...A.finish(),details:{...D.counts,clockTower:true,porticoColumns:4,roof:'hipped-tile-gallery-and-taller-tiled-clock-tower'}};
  }
  function coventry(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const N=volume(9.8,22.2,4,27,.5,29,'stone');
    // Ten tall windows sit on angled facets; the walls remain solid between them.
    for(const side of[-1,1])for(let j=0;j<5;j++){
      const y0=4.5+j*4.3,y1=y0+4.3,x=side<0?9.8:22.2,outer=x+side*2.4;
      const a=[x,y0],b=[outer,y0+2.8],c=[x,y1],f=Object.assign(S.face(a,b,side,.5),{nx:side,ny:.5});
      S.wall(a,b,.5,29,A.mat('stone',side,.5));S.wall(b,c,.5,29,A.mat('stone',side,-.7));A.pane(f,.4,5,f.length-.8,21,'mullion');
      for(let k=1;k<=5;k++)S.beam(f.point(.5,.3,5+k*3.3),f.point(f.length-.5,.3,5+k*3.3),P.frame,.16);
      S.poly([[x,y0,29],[outer,y0+2.8,29],[x,y1,29]],P.lead);
    }
    const front=N.front;D.pane(front,.6,1.5,front.length-1.2,25.5,'mullion');for(let k=1;k<6;k++)front.panel(.9,front.length-.9,1.5+k*4,1.5+k*4+.16,P.frame,.46);
    S.box(9.2,22.8,3.4,27.6,29,29.8,P.stone,P.stoneR,P.lead);S.beam([16,3.6,29.9],[16,27.4,29.9],P.lead,.35);
    // Bowed baptistery, coloured narrow glazing in a real curved wall.
    const faces=A.polygon(6.3,23.5,4.1,.5,24,14,'stone',Math.PI/14);
    for(let j=0;j<faces.length;j++){
      const f=faces[j];A.pane(f,.1,2.5,f.length-.2,19.5,'ribbon');
      for(let k=0;k<7;k++){const colors=[Q.red,P.glass,P.warm,Q.steel,P.glassR],col=colors[(j+k)%colors.length];f.panel(.17,f.length-.17,3+k*2.6,5.3+k*2.6,[col,P.warm],.31);}
    }
    A.polygon(6.3,23.5,4.45,24,24.8,14,'stone',Math.PI/14);A.steps(10.5,21.5,27.5,30.5,1.8,4);
    return{...A.finish(),details:{...D.counts,foldedSideWindows:10,bowedBaptistery:true,roof:'low-modern-nave-and-flat-baptistery-no-medieval-spire'}};
  }
  function spacecentre(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const H=volume(2.7,28.8,8.3,27.8,.5,9.5,'steel');
    for(const f of Object.values(H)){D.cornice(f,9.4);for(let u=.5;u<f.length;u+=.85)for(let z=1;z<8.5;z+=1.4)f.panel(u,u+.2,z,z+.28,P.ironD,.16);}
    D.pane(H.front,10.8,1,8.6,6.7,'ribbon');S.box(12.2,24,27.7,29.2,7.9,8.6,Q.steel,Q.steelD,Q.steelHi);
    const cx=10,cy=12,rad=6.25,n=20;
    // Inflated pillow facets: bulges and steel seams are actual world geometry.
    for(let band=0;band<9;band++)for(let j=0;j<n;j++){
      const a=j*Math.PI*2/n,b=(j+1)*Math.PI*2/n,z0=5+band*5.9,z1=z0+5.9;
      const taper=z=>z>50?Math.sqrt(Math.max(.07,1-((z-50)/10)**2)):z<9?.86:1;
      const p=(ang,z,r)=>[cx+Math.cos(ang)*rad*taper(z)*r,cy+Math.sin(ang)*rad*taper(z)*r,z];
      const corners=[p(a,z0,1),p(b,z0,1),p(b,z1,1),p(a,z1,1)],mid=p((a+b)/2,(z0+z1)/2,1.055),shade=A.dark(Math.cos((a+b)/2),Math.sin((a+b)/2));
      for(let k=0;k<4;k++)S.poly([corners[k],corners[(k+1)%4],mid],[shade?Q.steel:Q.steelHi,P.warm]);
      S.beam(corners[0],corners[1],Q.steelD,.18);S.beam(corners[0],corners[3],Q.steelD,.15);
    }
    A.cone(cx,cy,rad*.65,0,58.1,62,20,'lead');
    // The planetarium is a separate low geodesic volume on the exhibition hall.
    const px=23,py=21,r=4.8;
    for(let band=0;band<4;band++)for(let j=0;j<12;j++){
      const a=j*Math.PI/6,b=(j+1)*Math.PI/6,t0=band*Math.PI/8,t1=(band+1)*Math.PI/8,p=(t,z)=>[px+r*Math.cos(t)*Math.cos(z),py+r*Math.sin(t)*Math.cos(z),10+5*Math.sin(z)],aa=p(a,t0),bb=p(b,t0),cc=p(b,t1),dd=p(a,t1);
      S.poly([aa,bb,cc],Q.steel);S.poly([aa,cc,dd],Q.steelHi);S.beam(aa,cc,Q.steelD,.13);S.beam(aa,bb,Q.steelD,.15);
    }
    return{...A.finish(),details:{...D.counts,etfePillows:180,planetarium:true,roof:'pillow-clad-rounded-rocket-tower-geodesic-dome-low-metal-hall'}};
  }
  function penshaw(row,view){
    const A=context(row,view),{S,K,P,Q}=A;
    for(let j=0;j<3;j++)S.box(5+j*.75,27-j*.75,2.5+j*.75,29.5-j*.75,.43,1+j*.72,P.stone,P.stoneR,P.stoneHi);
    const columns=[];for(let j=0;j<7;j++)for(const x of[7.5,24.5])columns.push([x,5+j*3.65]);for(let j=1;j<3;j++)for(const y of[5,26.9])columns.push([7.5+j*17/3,y]);
    for(const[x,y]of columns){
      // Slightly tapered Doric shafts, with necking and square abaci.
      K.cylinder(S,x,y,2.45,25.8,1.15,.84,P.stone,P.stoneR,P.stoneHi,16);K.cylinder(S,x,y,24.7,25.25,.92,.92,P.stoneHi,P.stoneR,P.stoneHi,16);K.cylinder(S,x,y,25.25,26.2,.92,1.24,P.stone,P.stoneR,P.stoneHi,16);S.box(x-1.35,x+1.35,y-1.35,y+1.35,26.2,26.9,P.stoneHi,P.stoneR,P.stoneHi);
    }
    const ring=(z,h,over)=>{for(const [x0,x1,y0,y1]of[[6-over,26+over,3.5-over,6.5],[6-over,26+over,25.4,28.4+over],[6-over,9,6.5,25.4],[23,26+over,6.5,25.4]])S.box(x0,x1,y0,y1,z,z+h,P.stone,P.stoneR,P.stoneHi);};
    ring(26.9,2.5,.15);ring(29.4,1.1,.7);
    for(const y of[3.3,28.6]){
      const inside=y<16?y+1:y-1;
      for(const yy of[y,inside])S.poly([[5.8,yy,30.5],[26.2,yy,30.5],[16,yy,36]],A.mat('stone',0,y<16?-1:1));
      S.poly([[5.5,y,30.5],[16,y,36.4],[16,inside,36.4],[5.5,inside,30.5]],P.stoneHi);S.poly([[26.5,y,30.5],[26.5,inside,30.5],[16,inside,36.4],[16,y,36.4]],P.stoneHi);
    }
    // The source monument has an open roof: leave the whole inner rectangle empty.
    for(const y of[3.2,28.7])for(let x=7;x<=25;x+=2.25)for(let k=0;k<3;k++)S.beam([x+k*.21,y,27.4],[x+k*.21,y,29],P.stoneD,.1);
    return{...A.finish(),details:{doricColumns:18,frontColumns:4,sideColumns:7,openRoof:true,roof:'open-centre-with-two-stone-pediments-no-invented-windows'}};
  }
  function blackpool(row,view){
    const A=context(row,view),D=details(A),{S,K,P,Q,volume}=A;
    const B=volume(3,29,4,28,.5,11.5,'brick');
    for(const f of Object.values(B)){for(let j=0;j<5;j++)D.pane(f,(j+.5)*f.length/5-1.4,2.2,2.8,6.7,'arch');D.cornice(f,11.5);}
    A.hip(2.7,29.3,3.7,28.3,12,3.6,true);
    // Four tapered lattice legs with cross braces and real holes through the tower.
    const levels=[[12,11],[29,7.7],[43,5.2],[57,3.6],[72,2.8],[84,2.1]],centre=16;
    for(let b=0;b<levels.length-1;b++){
      const [z0,r0]=levels[b],[z1,r1]=levels[b+1];
      for(const sx of[-1,1])for(const sy of[-1,1])S.beam([centre+sx*r0,centre+sy*r0,z0],[centre+sx*r1,centre+sy*r1,z1],A.dark(sx,sy)?Q.redD:Q.red,.55);
      for(const axis of[0,1])for(const side of[-1,1]){
        const p=(sign,r,z)=>axis?[centre+side*r,centre+sign*r,z]:[centre+sign*r,centre+side*r,z];
        S.beam(p(-1,r0,z0),p(1,r1,z1),Q.redD,.28);S.beam(p(1,r0,z0),p(-1,r1,z1),Q.red,.28);S.beam(p(-1,r0,z0),p(1,r0,z0),Q.redD,.32);
        const rm=(r0+r1)/2,zm=(z0+z1)/2;S.beam(p(-1,rm,zm),p(1,rm,zm),Q.redD,.2);
      }
    }
    // Enclosed lift core and stacked observation floors stay narrower than the legs.
    const core=volume(15.1,16.9,15.1,16.9,12,83,'steel');for(const f of Object.values(core))for(let z=15;z<80;z+=6)A.pane(f,.2,z,1.4,3,'ribbon',false);
    for(const[z,r]of[[29,8.2],[72,4.1],[78,3.4],[84,2.9]]){
      S.box(16-r,16+r,16-r,16+r,z,z+.8,Q.red,Q.redD,Q.red);for(const x of[16-r,16+r])for(const y of[16-r,16+r])S.beam([x,y,z+.8],[x,y,z+2.4],Q.redD,.15);
      for(const y of[16-r,16+r])S.beam([16-r,y,z+2.4],[16+r,y,z+2.4],Q.redD,.15);for(const x of[16-r,16+r])S.beam([x,16-r,z+2.4],[x,16+r,z+2.4],Q.redD,.15);
    }
    const O=volume(13.1,18.9,13.1,18.9,72.8,77.7,'steel');for(const f of Object.values(O))D.pane(f,.3,73.4,f.length-.6,3.4,'ribbon');A.hip(13.1,18.9,13.1,18.9,85,3.5,true);S.beam([16,16,88.5],[16,16,97],Q.redD,.25);
    return{...A.finish(),details:{...D.counts,latticeLegs:4,latticeStages:5,roof:'victorian-low-base-and-steel-observation-stack'}};
  }
  const AUTHORS=Object.freeze([croydon,preston,arnos,campden,guildford,birmingham,coventry,spacecentre,penshaw,blackpool]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave027 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture027=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
