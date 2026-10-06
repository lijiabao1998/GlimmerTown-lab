/* GPT-015: original, optional British streetscape walking details.
 * Architectural vocabulary consulted 2026-10-06; these are original composites:
 * https://historicengland.org.uk/listing/the-list/list-entry/1065810
 *   Decorative cast-iron street standard, botanical relief and a worked bracket.
 * https://www.camden.gov.uk/documents/20142/7549418/Hampstead%2BAudit.pdf/0d4a3fec-d9c5-ac6e-080e-576ecbbb2f64
 *   Fluted columns, ladder rests and swan-neck lighting heads.
 * https://www.nationaltrust.org.uk/visit/sussex/alfriston-clergy-house/the-garden-at-alfriston-clergy-house
 *   Intimate garden rooms, brick paths, trellis, urns and clipped sundial planting.
 * https://heritagerecords.nationaltrust.org.uk/HBSMR/MonRecord.aspx?skin=printerfriendly&uid=MNA203104
 *   Copper sundial/gnomon on a fluted stone column and octagonal table.
 * https://www.vam.ac.uk/articles/teapots-through-time/
 *   The legible body, handle, spout and lid vocabulary of British tea ware.
 * No photographs, raster traces, fonts, pre-existing furniture designs or sign
 * motifs are copied. Geometry is original; the exact GPT-014 depth-buffer Scene
 * and its basic material/solid primitives are reused without any modification.
 * Eight themes x four complete world-space rotations; 1x1, 72x92, ax36, ay90.
 * All furniture leaves x=5.3..10.7 open. Paving is flush at z=0. Only real lamp
 * glazing supplies an emission pair; all signs, planting and masonry stay dark.
 * No game state, storage, seeded RNG, imported assets or rendering-time effects.
 * Source/parse checks only here; real raster QA belongs to isolated CI.
 */
(function (root) {
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw new Error('BritishComplexPrimitives014 must load before streetscape art');
  const {Scene,P,C,brick,paving,cylinder,hedge}=H;
  const themes=Object.freeze(['heritageLantern','basketLamp','teaTradeSign','bookTradeSign',
    'ironUrn','roseTrellis','sundialCourt','wicketCourt']);
  const T=Object.freeze({
    iron:C('30463f'),ironHi:C('657665'),ironD:C('263732'),
    brass:C('b99a5e'),brassHi:C('d6bc80'),brassD:C('887149'),
    ivory:C('eee1bc'),ivoryR:C('c9bd9c'),
    tea:C('426356'),teaHi:C('638370'),teaD:C('2e4a41'),
    book:C('743c43'),bookHi:C('a4635e'),bookD:C('4d2d36'),
    wicker:C('9a7651'),wickerHi:C('bea073'),wickerD:C('705941'),
    rose:C('bd6681'),roseHi:C('e3a3ae'),roseD:C('934858'),
    petal:C('e6ddc1'),brickInset:C('9b6954'),brickInsetHi:C('b88768'),
    dial:C('969b77'),dialHi:C('c0bc8b'),dialD:C('697659')
  });
  const FEATURES=Object.freeze({
    heritageLantern:Object.freeze(['stepped-plinth','fluted-iron-post','six-glazed-faces','ladder-rest','vented-pagoda-cap']),
    basketLamp:Object.freeze(['swan-neck-bracket','pendant-opal-cup','chain-hung-basket','woven-liner','trailing-flowers']),
    teaTradeSign:Object.freeze(['freestanding-iron-bracket','two-sided-scalloped-board','teapot-handle-spout-lid','hanging-links']),
    bookTradeSign:Object.freeze(['freestanding-iron-bracket','burgundy-gilt-board','open-book-pages-spine','hanging-links']),
    ironUrn:Object.freeze(['stone-pedestal','fluted-cast-iron-bowl','paired-scroll-handles','radial-paving','planted-crown']),
    roseTrellis:Object.freeze(['timber-trough','round-arched-frame','open-diamond-lattice','trained-rose-canes','rose-rosettes']),
    sundialCourt:Object.freeze(['fluted-stone-baluster','octagonal-copper-dial','triangular-gnomon','radial-brick-inset','clipped-corners']),
    wicketCourt:Object.freeze(['low-coped-brick-wall','open-timber-wicket','diagonal-gate-brace','hinges-latch','espalier-branches'])
  });

  function pathBase(S) {
    S.flat(0,16,0,16,0,paving);
    // Small edge setts run along the furniture margins, flush with the flags.
    for(const x of[.25,14.85])for(let y=.28;y<15.5;y+=1.75)
      S.flat(x,x+.86,y,Math.min(y+1.57,15.72),.018,((y*4)|0)%3?P.stoneR:P.stone);
    for(const x of[5.10,10.73])S.flat(x,x+.15,.2,15.8,.021,P.stoneHi);
  }
  function mould(S,x,y,z0,z1,r0,r1,front,side,top,n) {
    cylinder(S,x,y,z0,z1,r0,r1,front,side,top,n||8);
  }
  function arcBeam(S,point,from,to,steps,color,width) {
    for(let i=0;i<steps;i++)S.beam(point(from+(to-from)*i/steps),point(from+(to-from)*(i+1)/steps),color,width);
  }
  // A flat motif is attached to a real board face; each ring has a genuine hole.
  function oval(S,point,u,z,rx,rz,color,n) {
    const pts=[];
    for(let i=0;i<(n||16);i++){const a=i*Math.PI*2/(n||16);pts.push(point(u+Math.cos(a)*rx,z+Math.sin(a)*rz));}
    S.poly(pts,color,.035);
  }
  function ovalRing(S,point,u,z,rx,rz,thickness,color,n) {
    const steps=n||18;
    for(let i=0;i<steps;i++){
      const a=i*Math.PI*2/steps,b=(i+1)*Math.PI*2/steps;
      S.poly([point(u+Math.cos(a)*rx,z+Math.sin(a)*rz),point(u+Math.cos(b)*rx,z+Math.sin(b)*rz),
        point(u+Math.cos(b)*(rx-thickness),z+Math.sin(b)*(rz-thickness)),
        point(u+Math.cos(a)*(rx-thickness),z+Math.sin(a)*(rz-thickness))],color,.04);
    }
  }
  function roundPaving(S,x,y,inner,outer,count,brickCourse) {
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count+.023,b=(i+1)*Math.PI*2/count-.023;
      S.poly([[x+Math.cos(a)*inner,y+Math.sin(a)*inner,.028],
        [x+Math.cos(a)*outer,y+Math.sin(a)*outer,.028],
        [x+Math.cos(b)*outer,y+Math.sin(b)*outer,.028],
        [x+Math.cos(b)*inner,y+Math.sin(b)*inner,.028]],
      brickCourse?(i%4===0?T.brickInsetHi:T.brickInset):(i%3===0?P.stoneHi:P.stoneR));
    }
  }
  function leaf(S,a,b,width,color) {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
    const mx=(a[0]+b[0])*.5,my=(a[1]+b[1])*.5,mz=(a[2]+b[2])*.5;
    const l=[mx-dy/len*width,my+dx/len*width,mz+.24],r=[mx+dy/len*width,my-dx/len*width,mz-.1];
    S.poly([a,l,b],color);S.poly([a,b,r],P.leaf[3]);
  }
  function rosette(S,x,y,z,r,pink) {
    const c=pink?T.rose:T.petal,d=pink?T.roseD:P.gold,h=pink?T.roseHi:T.ivory;
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3,xx=x+Math.cos(a)*r*.54,yy=y+Math.sin(a)*r*.54;
      S.poly([[xx-r*.43,yy,z],[xx,yy-r*.43,z+.18],[xx+r*.43,yy,z+.34],[xx,yy+r*.43,z+.15]],i%3?c:h);
    }
    mould(S,x,y,z+.21,z+.46,r*.23,r*.14,d,d,h,6);
  }
  function plantCrown(S,x,y,z,r,pink) {
    for(let i=0;i<9;i++){
      const a=i*Math.PI*2/9,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;
      const zz=z+.8+(i%3)*.5;
      S.beam([x,y,z-.25],[xx,yy,zz],P.leaf[3],.14);
      leaf(S,[x,y,z],[xx,yy,zz+.65],r*.28,P.leaf[i%3]);
      leaf(S,[xx*.45+x*.55,yy*.45+y*.55,zz-.35],
        [xx+Math.cos(a+.6)*r*.4,yy+Math.sin(a+.6)*r*.4,zz+.2],r*.19,P.leaf[(i+1)%3]);
      if(i%2===0)rosette(S,xx*.72+x*.28,yy*.72+y*.28,zz+.45,r*.36,pink);
    }
  }

  function flutedPost(S,x,y,z0,height) {
    mould(S,x,y,z0,z0+.7,.87,.87,T.iron,T.ironD,T.ironHi,8);
    mould(S,x,y,z0+.7,z0+2.2,.71,.52,T.iron,T.ironD,T.ironHi,8);
    mould(S,x,y,z0+2.2,z0+height-1.6,.49,.30,T.iron,T.ironD,T.ironHi,10);
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5,ca=Math.cos(a),sa=Math.sin(a);
      S.beam([x+ca*.49,y+sa*.49,z0+2.35],[x+ca*.30,y+sa*.30,z0+height-1.8],i%3?T.ironHi:T.ironD,.105);
    }
    mould(S,x,y,z0+height-1.6,z0+height-.9,.42,.63,T.iron,T.ironD,T.ironHi,8);
    mould(S,x,y,z0+height-.9,z0+height,.63,.47,T.iron,T.ironD,T.ironHi,8);
    for(const zz of[z0+3.2,z0+height-2.3])mould(S,x,y,zz,zz+.32,.56,.56,T.brass,T.brassD,T.brassHi,10);
  }
  function hexLantern(S,x,y,z) {
    const n=6,angle=Math.PI/6,lower=1.12,upper=1.67,h=5.8;
    mould(S,x,y,z-.48,z,.91,1.24,T.iron,T.ironD,T.ironHi,n);
    for(let i=0;i<n;i++){
      const a=angle+i*Math.PI/3,b=angle+(i+1)*Math.PI/3;
      const p=(theta,r,zz)=>[x+Math.cos(theta)*r,y+Math.sin(theta)*r,zz];
      // There is no interior glow box: these six physical panes emit directly.
      const pane=i%3===0?[C('b9c4a8'),C('ffe0a3')]:i%3===1?[C('a4b49b'),C('f4ce8d')]:[C('829486'),C('dfb475')];
      S.poly([p(a,lower,z),p(b,lower,z),p(b,upper,z+h),p(a,upper,z+h)],pane);
      S.beam(p(a,lower,z),p(a,upper,z+h),T.iron,.25);
      for(const [zz,rr]of[[z,lower],[z+h,upper],[z+1.0,lower+(upper-lower)/h]])S.beam(p(a,rr,zz),p(b,rr,zz),T.iron,.23);
      S.poly([p(a,upper+.25,z+h+.15),p(b,upper+.25,z+h+.15),p(b,.65,z+h+1.9),p(a,.65,z+h+1.9)],i%3?T.iron:T.ironHi);
    }
    mould(S,x,y,z+h-.05,z+h+.32,1.82,1.91,T.iron,T.ironD,T.ironHi,6);
    mould(S,x,y,z+h+1.65,z+h+2.5,.65,.51,T.iron,T.ironD,T.ironHi,6);
    // Vent slots are unlit, with the little finial solidly seated above them.
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;
      S.beam([x+Math.cos(a)*.60,y+Math.sin(a)*.60,z+h+1.9],[x+Math.cos(a)*.53,y+Math.sin(a)*.53,z+h+2.35],P.ink,.17);
    }
    mould(S,x,y,z+h+2.45,z+h+3.2,.66,.06,T.ironHi,T.ironD,T.iron,6);
    mould(S,x,y,z+h+3.18,z+h+3.78,.18,.03,T.brass,T.brassD,T.brassHi,6);
  }
  function heritageLantern(S) {
    const x=3.15,y=5.85;
    S.box(x-1.43,x+1.43,y-1.43,y+1.43,.02,.55,P.stone,P.stoneR,P.stoneHi);
    S.box(x-1.12,x+1.12,y-1.12,y+1.12,.55,1.18,P.stone,P.stoneR,P.stoneHi);
    flutedPost(S,x,y,1.18,27.9);
    // Ladder rest is deliberately along the margin, away from the walking strip.
    S.beam([x,y-2.0,26.1],[x,y+2.0,26.1],T.iron,.34);
    for(const yy of[y-2.0,y+2.0])mould(S,x,yy,25.85,26.48,.29,.17,T.brass,T.brassD,T.brassHi,6);
    hexLantern(S,x,y,29.15);
    // The small access door is part of the post base, never a floating sign.
    S.wall([x+.72,y-.33],[x+.72,y+.33],2.02,3.62,T.ironD,.025);
    S.box(x+.73,x+.80,y+.16,y+.28,2.75,2.96,T.brass,T.brassD,T.brassHi);
    S.flat(1.4,4.65,11.4,13.1,.026,P.stoneR);
    S.flat(1.66,4.39,11.65,12.85,.033,P.paveHi);
    for(const yy of[11.92,12.35])S.flat(2.07,4.01,yy,yy+.10,.041,P.stoneD);
  }
  function pendantCup(S,x,y,z) {
    const n=8;
    for(let i=0;i<n;i++){
      const a=i*Math.PI/4,b=(i+1)*Math.PI/4;
      const p=(q,r,zz)=>[x+Math.cos(q)*r,y+Math.sin(q)*r,zz];
      const glass=i<4?[C('d8d6b2'),C('ffe4ab')]:[C('b6baa1'),C('ebc78e')];
      S.poly([p(a,.48,z),p(b,.48,z),p(b,1.18,z+3.0),p(a,1.18,z+3.0)],glass);
      if(i%2===0)S.beam(p(a,.48,z),p(a,1.18,z+3),T.iron,.18);
    }
    mould(S,x,y,z-.24,z+.15,.42,.59,T.iron,T.ironD,T.ironHi,8);
    mould(S,x,y,z+2.98,z+3.32,1.43,1.43,T.iron,T.ironD,T.ironHi,10);
    mould(S,x,y,z+3.32,z+4.05,1.43,.38,T.iron,T.ironD,T.ironHi,10);
    mould(S,x,y,z+4.02,z+4.48,.34,.17,T.iron,T.ironD,T.ironHi,8);
  }
  function hangingBasket(S,x,y,z,hook) {
    mould(S,x,y,z,z+.42,.5,.85,T.wicker,T.wickerD,T.wickerHi,12);
    mould(S,x,y,z+.42,z+1.35,.85,1.38,T.wicker,T.wickerD,P.soil,12);
    for(const zz of[.40,.72,1.04])mould(S,x,y,z+zz,z+zz+.12,.78+zz*.49,.84+zz*.49,T.wickerHi,T.wickerD,null,12);
    mould(S,x,y,z+1.26,z+1.54,1.44,1.44,T.iron,T.ironD,P.soil,12);
    for(let i=0;i<3;i++){
      const a=i*Math.PI*2/3+.35,xx=x+Math.cos(a)*1.37,yy=y+Math.sin(a)*1.37;
      S.beam([xx,yy,z+1.47],hook,T.iron,.16);
    }
    plantCrown(S,x,y,z+1.56,1.20,true);
    for(const a of[.5,2.4,4.2]){
      const xx=x+Math.cos(a)*1.55,yy=y+Math.sin(a)*1.55;
      S.beam([x+Math.cos(a),y+Math.sin(a),z+1.9],[xx,yy,z-.3],P.leaf[3],.16);
      leaf(S,[xx,yy,z+.9],[xx+Math.cos(a)*.4,yy+Math.sin(a)*.4,z-.6],.33,P.leaf[0]);
      rosette(S,xx,yy,z+.16,.42,false);
    }
  }
  function basketLamp(S) {
    const x=3.10,y=7.65;
    S.box(x-.94,x+.94,y-.94,y+.94,.02,.57,P.stone,P.stoneR,P.stoneHi);
    flutedPost(S,x,y,.57,23.05);
    // A continuous swan neck bends over the lantern; its pendant meets the neck.
    const neck=t=>[x,7.65+2.20*(1-Math.cos(t)),23.62+4.25*Math.sin(t)];
    arcBeam(S,neck,0,Math.PI,24,T.iron,.43);
    pendantCup(S,x,12.05,19.14);
    // The opposite scroll arm supports three real chains, with basket below.
    S.beam([x,y,20.2],[x,4.15,20.2],T.iron,.34);
    arcBeam(S,t=>[x,4.15+.65*Math.cos(t),20.2+.65*Math.sin(t)],0,Math.PI*1.45,12,T.iron,.26);
    S.beam([x,7.55,18.0],[x,4.7,20.18],T.iron,.27);
    hangingBasket(S,x,4.05,12.45,[x,4.05,19.55]);
    // An inset service cover helps distinguish the back quarter without extras.
    S.flat(1.47,4.33,14.0,15.30,.027,T.ironD);
    for(let yy=14.18;yy<15.2;yy+=.32)S.flat(1.73,4.07,yy,yy+.12,.036,T.ironHi);
  }

  function signBoard(S,x,y,z,outline,front,edge,motif) {
    const half=.28;
    for(let i=0;i<outline.length;i++){
      const a=outline[i],b=outline[(i+1)%outline.length];
      S.poly([[x-half,y+a[0],z+a[1]],[x+half,y+a[0],z+a[1]],
        [x+half,y+b[0],z+b[1]],[x-half,y+b[0],z+b[1]]],edge);
    }
    for(const side of[-1,1]){
      const point=(u,zz)=>[x+side*half,y+u,z+zz];
      S.poly(outline.map(p=>point(p[0],p[1])),front,.015);
      for(let i=0;i<outline.length;i++)S.beam(point(...outline[i]),point(...outline[(i+1)%outline.length]),T.brass,.19);
      // Each side has its own fully painted motif on the outward surface.
      motif((u,zz)=>[x+side*(half+.035),y+(side===1?u:7.8-u),z+zz]);
    }
  }
  function signStandard(S,x,y,height,book) {
    S.box(x-.88,x+.88,y-.88,y+.88,.02,.54,P.stone,P.stoneR,P.stoneHi);
    mould(S,x,y,.54,1.60,.49,.38,T.iron,T.ironD,T.ironHi,8);
    mould(S,x,y,1.6,height,.30,.22,T.iron,T.ironD,T.ironHi,8);
    for(const zz of[2.0,height-2.15])mould(S,x,y,zz,zz+.40,.39,.39,T.brass,T.brassD,T.brassHi,8);
    S.beam([x,y,height-.95],[x,y+8.9,height-.95],T.iron,.37);
    S.beam([x,y,height-6.1],[x,y+5.7,height-.95],T.iron,.28);
    const point=(u,zz)=>[x,y+u,zz];
    ovalRing(S,point,2.55,height-2.70,1.15,1.32,.20,T.ironHi,16);
    ovalRing(S,point,8.35,height-.65,.65,.68,.21,T.iron,14);
    mould(S,x,y,height-.1,height+.62,.51,.04,book?T.brass:T.ironHi,T.ironD,T.brassHi,6);
  }
  function teaTradeSign(S) {
    const x=3.05,y=3.0,z=12.0;
    signStandard(S,x,y,27.2,false);
    for(const yy of[y+3.2,y+6.6]){
      S.beam([x,yy,26.25],[x,yy,22.75],T.iron,.20);
      ovalRing(S,(u,zz)=>[x,yy+u,zz],0,22.56,.31,.46,.13,T.brass,12);
    }
    const outline=[[.0,2.2],[.50,.9],[2.0,.15],[5.8,.15],[7.3,.9],[7.8,2.2],[7.8,8.2],[7.05,9.25],[5.9,10.4],[1.9,10.4],[.75,9.25],[0,8.2]];
    signBoard(S,x,y+1.0,z,outline,T.tea,T.teaD,point=>{
      ovalRing(S,point,3.9,5.35,3.24,3.61,.18,T.brassHi,22);
      // Open handle + bulbous pot + rising spout remain distinct at native size.
      ovalRing(S,point,1.93,5.16,.88,1.30,.34,T.ivory,16);
      oval(S,point,3.95,4.96,1.83,1.73,T.ivory,18);
      S.poly([[5.32,4.65],[6.33,5.13],[7.01,6.65],[6.44,6.83],[5.57,5.67]].map(p=>point(...p)),T.ivory,.045);
      S.poly([[2.44,6.20],[2.80,6.65],[4.98,6.65],[5.45,6.20]].map(p=>point(...p)),T.brassHi,.05);
      oval(S,point,3.94,6.87,.34,.36,T.ivory,10);
      S.poly([[2.58,3.30],[5.24,3.30],[5.48,3.03],[2.39,3.03]].map(p=>point(...p)),T.brassHi,.05);
      S.poly([[3.13,5.56],[3.83,5.89],[4.57,5.45],[3.86,5.15]].map(p=>point(...p)),T.teaHi,.055);
    });
  }
  function bookTradeSign(S) {
    const x=3.05,y=2.80,z=11.20;
    signStandard(S,x,y,26.75,true);
    for(const yy of[y+3.2,y+6.6]){
      S.beam([x,yy,25.80],[x,yy,22.44],T.iron,.20);
      ovalRing(S,(u,zz)=>[x,yy+u,zz],0,22.24,.30,.43,.13,T.brass,12);
    }
    const outline=[[0,.6],[.62,0],[7.18,0],[7.8,.6],[7.8,9.7],[6.65,9.7],[6.15,10.9],[1.65,10.9],[1.15,9.7],[0,9.7]];
    signBoard(S,x,y+1,z,outline,T.book,T.bookD,point=>{
      // An open volume has two separately tilted pages, dark spine and gilt cover.
      S.poly([[.82,3.01],[.82,7.53],[2.6,7.91],[3.90,7.15],[5.17,7.91],[6.98,7.53],[6.98,3.01],[5.10,3.36],[3.90,2.69],[2.70,3.36]].map(p=>point(...p)),T.brassHi,.04);
      S.poly([[1.20,3.55],[1.20,7.20],[2.63,7.55],[3.75,6.95],[3.75,3.41],[2.65,3.97]].map(p=>point(...p)),T.ivory,.05);
      S.poly([[4.05,3.41],[4.05,6.95],[5.18,7.55],[6.60,7.20],[6.60,3.55],[5.18,3.97]].map(p=>point(...p)),T.ivoryR,.05);
      S.beam(point(3.90,2.94),point(3.90,7.13),T.bookD,.22);
      for(const zz of[4.35,5.22,6.10]){
        S.beam(point(1.65,zz+.23),point(3.26,zz),T.brassD,.12);
        S.beam(point(4.48,zz),point(6.05,zz+.23),T.brassD,.12);
      }
      S.poly([[4.46,3.51],[4.88,3.70],[4.88,2.04],[4.67,2.36],[4.46,2.12]].map(p=>point(...p)),T.bookHi,.06);
      for(const u of[1.05,6.75])S.poly([[u-.29,8.89],[u,9.48],[u+.29,8.89],[u,8.31]].map(p=>point(...p)),T.brassHi,.05);
    });
    // The low cobbled setting is distinct from the tea-room sign's plain flags.
    for(let yy=12.1;yy<14.9;yy+=.90)for(let xx=1.2;xx<4.6;xx+=1.15)
      S.flat(xx,xx+1.02,yy,yy+.72,.026,P.stoneR);
  }

  function ironUrn(S) {
    const x=3.10,y=8.80;
    roundPaving(S,x,y,1.68,2.83,18,false);
    S.box(x-1.22,x+1.22,y-1.22,y+1.22,.03,.61,P.stone,P.stoneR,P.stoneHi);
    S.box(x-.89,x+.89,y-.89,y+.89,.61,2.50,P.stone,P.stoneR,P.stone);
    S.box(x-1.13,x+1.13,y-1.13,y+1.13,2.5,3.08,P.stone,P.stoneR,P.stoneHi);
    mould(S,x,y,3.08,3.6,.90,.65,T.iron,T.ironD,T.ironHi,10);
    mould(S,x,y,3.6,4.8,.44,.52,T.iron,T.ironD,T.ironHi,10);
    mould(S,x,y,4.8,5.85,.54,1.40,T.iron,T.ironD,T.ironHi,12);
    mould(S,x,y,5.85,7.30,1.40,1.55,T.iron,T.ironD,T.ironHi,12);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      S.beam([x+Math.cos(a)*.62,y+Math.sin(a)*.62,4.98],[x+Math.cos(a)*1.50,y+Math.sin(a)*1.50,7.07],i%2?T.ironHi:T.ironD,.14);
    }
    mould(S,x,y,7.15,7.66,1.60,1.68,T.iron,T.ironD,P.soil,12);
    for(const side of[-1,1]){
      const p=(u,zz)=>[x,y+side*u,zz];
      ovalRing(S,p,1.53,6.13,.73,1.15,.22,T.ironHi,16);
      S.beam([x,y+side*1.24,6.94],[x,y+side*1.73,6.98],T.iron,.25);
    }
    plantCrown(S,x,y,7.68,1.36,false);
    // A little chamfered stone set into the rear edge anchors the composition.
    S.poly([[1.65,2.1,.025],[4.45,2.1,.025],[4.05,3.5,.025],[2.0,3.5,.025]],P.stoneHi);
  }
  function roseTrellis(S) {
    const x=2.82,y0=3.55,y1=13.05;
    // A real open-topped trough, with end grain, feet and three horizontal boards.
    for(const yy of[y0+.8,y1-.8])S.box(1.41,4.23,yy-.3,yy+.3,.02,.55,P.woodR,P.woodD,P.wood);
    S.box(1.22,4.44,y0,y1,.53,2.61,P.wood,P.woodR,P.soil);
    S.flat(1.59,4.07,y0+.38,y1-.38,2.64,P.soil);
    for(const xx of[1.20,4.28])S.box(xx,xx+.18,y0-.08,y1+.08,2.46,2.86,P.wood,P.woodR,P.woodHi);
    for(const yy of[y0-.06,y1-.17])S.box(1.19,4.47,yy,yy+.23,2.46,2.86,P.wood,P.woodR,P.woodHi);
    for(const zz of[1.15,1.88])for(const xx of[1.205,4.455])S.wall([xx,y0+.06],[xx,y1-.06],zz,zz+.10,P.woodD,.035);
    for(const yy of[4.12,12.47]){
      S.box(x-.22,x+.22,yy-.24,yy+.24,2.61,13.15,P.wood,P.woodR,P.woodHi);
      for(const zz of[3.4,11.7])S.box(x+.23,x+.30,yy-.13,yy+.13,zz,zz+.25,T.iron,T.ironD,T.ironHi);
    }
    const cy=8.295,ry=4.175,spring=13.0;
    for(const xx of[x-.12,x+.12])arcBeam(S,t=>[xx,cy+Math.cos(t)*ry,spring+Math.sin(t)*4.65],0,Math.PI,22,P.woodHi,.31);
    // Open diamond lattice terminates at the arch, rather than filling its sky.
    const upper=y=>spring+4.65*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));
    for(const slope of[-1,1])for(let z=1;z<23;z+=2.7){
      let previous=null;
      for(let i=0;i<=36;i++){
        const yy=4.25+(12.34-4.25)*i/36,zz=z+slope*(yy-8.295)*.9;
        const next=zz>=3.05&&zz<=upper(yy)-.35?[x,yy,zz]:null;
        if(previous&&next)S.beam(previous,next,P.woodR,.16);
        previous=next;
      }
    }
    for(const side of[-1,1]){
      let p=[x+side*.32,side<0?4.92:11.76,2.67];
      for(let i=1;i<=6;i++){
        const q=[x+side*(.31+(i%2)*.13),p[1]+side*-.17+(i%2?.18:-.12),2.67+i*2.18];
        S.beam(p,q,P.leaf[3],.20);
        for(const d of[-1,1])leaf(S,q,[q[0]+d*.56,q[1]+d*.89,q[2]+.45],.32,P.leaf[(i+1)%3]);
        if(i%2===0)rosette(S,q[0],q[1]-.25,q[2]+.25,.70,true);
        p=q;
      }
    }
    for(const [yy,zz]of[[6.55,16.05],[8.48,17.65],[10.36,16.45]]){
      S.beam([x,yy-.65,zz-.45],[x,yy+.6,zz+.1],P.leaf[3],.19);
      leaf(S,[x,yy,zz-.2],[x+.6,yy+.85,zz+.55],.35,P.leaf[0]);
      rosette(S,x,yy,zz+.15,.64,true);
    }
  }
  function sundialCourt(S) {
    const x=3.0,y=7.80;
    roundPaving(S,x,y,1.40,2.63,20,true);
    roundPaving(S,x,y,2.68,2.91,20,false);
    S.box(x-1.19,x+1.19,y-1.19,y+1.19,.03,.65,P.stone,P.stoneR,P.stoneHi);
    mould(S,x,y,.65,1.30,1.04,.94,P.stone,P.stoneR,P.stoneHi,8);
    mould(S,x,y,1.30,2.08,.72,.57,P.stone,P.stoneR,P.stoneHi,8);
    mould(S,x,y,2.08,5.42,.57,.42,P.stone,P.stoneR,P.stoneHi,10);
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5;
      S.beam([x+Math.cos(a)*.58,y+Math.sin(a)*.58,2.24],[x+Math.cos(a)*.44,y+Math.sin(a)*.44,5.35],i%2?P.stoneHi:P.stoneD,.11);
    }
    mould(S,x,y,5.42,6.40,.42,.98,P.stone,P.stoneR,P.stoneHi,8);
    mould(S,x,y,6.40,6.96,1.21,1.30,P.stone,P.stoneR,P.stoneHi,8);
    mould(S,x,y,6.96,7.13,1.16,1.16,T.dial,T.dialD,T.dialHi,8);
    // Dial ticks and triangular brass gnomon are unlit solid geometry.
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8,outer=1.05,inner=i%2?.80:.66;
      S.beam([x+Math.cos(a)*inner,y+Math.sin(a)*inner,7.16],[x+Math.cos(a)*outer,y+Math.sin(a)*outer,7.16],T.dialD,.10);
    }
    for(const xx of[x-.075,x+.075])S.poly([[xx,y-.77,7.18],[xx,y+.69,7.18],[xx,y+.69,9.64]],T.brass,.02);
    S.beam([x,y-.77,7.18],[x,y+.69,9.64],T.brassHi,.16);
    for(const [y0,y1]of[[1.05,3.73],[12.25,14.95]]){
      S.box(11.68,15.18,y0,y1,.02,.50,P.stone,P.stoneR,P.soil);
      hedge(S,12.01,14.84,y0+.31,y1-.31,.50,2.35);
    }
    // A single flush axial accent points towards the dial without crossing it.
    for(const yy of[4.70,10.88])S.flat(2.81,3.19,yy,yy+.83,.033,T.brickInset);
  }
  function wicketCourt(S) {
    const z=.02;
    for(const [x0,x1]of[[.66,4.44],[11.62,15.34]]){
      S.box(x0,x1,3.28,4.48,z,4.70,brick(false,15051),brick(true,15051),P.brick[0]);
      S.box(x0-.12,x1+.12,3.12,4.64,4.7,5.14,P.stone,P.stoneR,P.stoneHi);
    }
    for(const x of[4.18,11.95]){
      S.box(x-.54,x+.54,3.19,4.57,z,6.93,brick(false,15052),brick(true,15052),P.brick[0]);
      S.box(x-.72,x+.72,3.0,4.76,6.93,7.42,P.stone,P.stoneR,P.stoneHi);
      mould(S,x,3.88,7.42,8.00,.44,.05,P.stone,P.stoneR,P.stoneHi,4);
    }
    // The wicket is swung fully open and parallel to the margin. Its free end
    // is supported by its rails/bracing; nothing projects into x=5.3..10.7.
    const x=4.12,ya=4.56,yb=11.70;
    for(const yy of[ya,yb])S.box(x-.22,x+.22,yy-.23,yy+.23,.38,6.0,P.wood,P.woodR,P.woodHi);
    for(const zz of[1.29,4.89])S.beam([x,ya,zz],[x,yb,zz],P.wood,.49);
    S.beam([x-.05,ya+.10,1.44],[x-.05,yb-.12,4.82],P.woodR,.36);
    for(let yy=ya+.78;yy<yb-.35;yy+=1.10){
      S.box(x-.17,x+.17,yy-.20,yy+.20,.64,5.57,P.wood,P.woodR,P.woodHi);
      S.poly([[x-.17,yy-.20,5.57],[x-.17,yy,6.18],[x-.17,yy+.20,5.57]],P.woodHi);
      S.poly([[x+.17,yy-.20,5.57],[x+.17,yy,6.18],[x+.17,yy+.20,5.57]],P.wood);
    }
    for(const zz of[1.46,4.82]){
      S.box(x-.37,x+.37,ya-.28,ya+.14,zz-.14,zz+.20,T.iron,T.ironD,T.ironHi);
      S.beam([x+.24,ya,zz],[x+.24,ya+1.43,zz],T.iron,.18);
    }
    S.beam([x+.25,yb-.50,4.73],[x+.25,yb+.25,4.73],T.iron,.23);
    // A short side wall holds a trained espalier, away from the open entry.
    S.box(14.18,15.24,7.28,14.75,z,4.83,brick(false,15053),brick(true,15053),P.brick[0]);
    S.box(14.02,15.39,7.12,14.91,4.83,5.23,P.stone,P.stoneR,P.stoneHi);
    const ex=13.83,ey=10.95;
    for(const yy of[7.65,14.31])S.beam([ex,yy,.15],[ex,yy,9.45],P.woodR,.22);
    for(const zz of[4.05,6.30,8.55])S.beam([ex,7.65,zz],[ex,14.31,zz],T.ironD,.10);
    S.beam([ex-.12,ey,.05],[ex-.12,ey,9.17],P.woodD,.29);
    for(const zz of[3.68,5.93,8.18])for(const side of[-1,1]){
      const a=[ex-.15,ey,zz],b=[ex-.15,ey+side*2.85,zz+.49];
      S.beam(a,b,P.woodR,.20);
      for(let i=1;i<=3;i++){
        const yy=ey+side*i*.83;
        leaf(S,[ex-.15,yy,zz+.15],[ex-.73,yy+side*.37,zz+.95],.30,P.leaf[(i+1)%3]);
        leaf(S,[ex-.15,yy,zz+.15],[ex+.20,yy-side*.28,zz+.77],.26,P.leaf[i%3]);
      }
    }
    S.flat(12.43,14.11,8.04,14.38,.026,P.soil);
  }

  const builders=Object.freeze({heritageLantern,basketLamp,teaTradeSign,bookTradeSign,ironUrn,roseTrellis,sundialCourt,wicketCourt});
  function moduleSprite(theme,view) {
    const S=Scene(1,view,72,92);
    pathBase(S);builders[theme](S);
    const lamp=theme==='heritageLantern'||theme==='basketLamp';
    return S.finish({theme,design:'british-streetscape-'+theme,pathAxis:'y',minimumClearPath:5.4,
      clearWalkStrip:[5.3,10.7],features:FEATURES[theme],lightPolicy:lamp?'physical-glazing-only-shared-depth':'non-emissive',
      physicalLampCount:lamp?1:0,family:'streetscape015'});
  }
  function buildAll() {
    const modules={};
    for(const theme of themes)for(let view=0;view<4;view++)modules[theme+'_'+view]=moduleSprite(theme,view);
    return {modules};
  }
  root.BritishStreetscapeArchitecture015=Object.freeze({buildAll,themes});
})(typeof window==='undefined'?globalThis:window);
