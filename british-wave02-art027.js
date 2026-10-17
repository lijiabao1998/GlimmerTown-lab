/* GPT-027 / wave02. Native geometric prototypes, not copied photo textures.
 * Rows grow to ten before integration; an early preview is explicitly partial.
 * Shared approved Scene, palette, simulation and RNG remain unchanged. */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
    {id:'croydon',nm:'克羅伊登航站樓',en:'Croydon Airport Terminal',shape:'cargo-wings-glazed-booking-dome-square-control-tower',note:'低貨運翼、玻璃採光廳與四層方形控制塔；鋼框窗、深窗台和屋頂天線。',url:'https://www.historiccroydonairport.org.uk/history/building-britains-first-airport-terminal/',imageSource:'https://www.historiccroydonairport.org.uk/image-gallery/'},
    {id:'preston',nm:'普雷斯頓巴士站',en:'Preston Bus Station',shape:'five-open-decks-curved-concrete-lips-glazed-concourse',note:'五層開放車庫、外挑曲面混凝土邊緣、柱列與底層玻璃大廳；無新增交通路線。',url:'https://www.johnputtickassociates.com/project/preston-bus-station/',imageSource:'https://www.johnputtickassociates.com/project/preston-bus-station/'}
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
      for(const x of[8,16,24])for(const y of[10.7,22.1])S.box(x-.25,x+.25,y-.25,y+.25,z+.8,z+5.8,P.stone,P.stoneR,P.stoneHi);
      for(const side of[-1,1])for(let j=0;j<8;j++){
        const a=j*Math.PI/16,b=(j+1)*Math.PI/16,edge=side<0?7.8:25;
        const p=t=>[edge+side*2.1*Math.sin(t),z+.8+2.1*(1-Math.cos(t))],aa=p(a),bb=p(b);
        S.poly([[2.6,aa[0],aa[1]],[29.4,aa[0],aa[1]],[29.4,bb[0],bb[1]],[2.6,bb[0],bb[1]]],A.dark(0,side)?Q.creamD:Q.cream);
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
  const AUTHORS=Object.freeze([croydon,preston]);
  function build(id,view){const i=ROWS.findIndex(q=>q.id===id);if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave027 known prototype and four geometric views required');return AUTHORS[i](ROWS[i],view);}
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture027=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
