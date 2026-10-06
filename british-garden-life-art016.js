/* GPT-016: original British garden-life path furniture, source-native geometry.
 * Vocabulary consulted 2026-10-06; these are original composites, not replicas:
 * https://historicengland.org.uk/listing/the-list/list-entry/1260628
 *   Ring-moulded cast-iron pump shaft, curved lever, spout and domed cap.
 * https://www.rhs.org.uk/wildlife/garden-birds
 *   Shallow bird water with gently sloping sides; no simulated wildlife added.
 * https://www.nationaltrust.org.uk/visit/bath-bristol/tyntesfield/visiting-the-garden-at-tyntesfield
 *   Working kitchen-garden vocabulary: potting/tool sheds and an apple store.
 * https://www.croquet.org.uk/?p=games%2Ftech%2FChoosingSet
 *   Timber mallets with bound heads, distinct balls and garden wire hoops.
 * https://museumofcornishlife.co.uk/2023/07/25/the-cider-press-apples-production-and-community/
 *   Timber press structure and screw-driven compression; no production system.
 * No tracing, imported images, fonts or old furniture drawings. Only unchanged
 * BritishComplexPrimitives014 Scene/P/C/paving/cylinder are shared. All other
 * solids below are hand-authored for this family. Six themes, four complete
 * geometric rotations each; 1x1, 72x92, ax36, ay90. The central x=5.3..10.7
 * walking strip stays clear. Ground is flush at z=0. Every material is opaque
 * and non-emissive. No game state, storage, RNG or rendering-time animation.
 * Parsing/source review only locally; real pixel measurements belong to CI.
 */
(function (root) {
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw new Error('BritishComplexPrimitives014 must load before garden-life art');
  const {Scene,P,C,paving,cylinder}=H;
  const themes=Object.freeze(['pumpCourt','birdbathCourt','pottingBench','croquetCorner','chessCourt','orchardPress']);
  const T=Object.freeze({
    iron:C('315446'),ironR:C('294439'),ironHi:C('60816b'),
    wornIron:C('7b8b79'),metal:C('88938a'),metalR:C('5d716a'),metalHi:C('bcc3b0'),
    clay:C('b87e5b'),clayR:C('906248'),clayHi:C('d09a70'),
    oak:C('a28557'),oakR:C('796246'),oakHi:C('c1a476'),oakEnd:C('8d714f'),
    water:C('788e87'),waterHi:C('a9bab0'),waterD:C('536d67'),
    chessLight:C('e0d4b7'),chessDark:C('596a5c'),chessBlack:C('37443e'),
    cream:C('e7dfc2'),creamR:C('b8b5a0'),red:C('ab5751'),redR:C('753f3d'),
    blue:C('526f83'),blueR:C('3d556a'),yellow:C('c1a359'),yellowR:C('968042'),
    grass:C('6b8552'),grassHi:C('849761'),grassR:C('526f48'),
    moss:C('7c8760'),mossR:C('667452'),apple:C('a86b4c'),appleHi:C('cba166')
  });
  const FEATURES=Object.freeze({
    pumpCourt:Object.freeze(['ring-moulded-iron-pump','curved-pump-lever','downturned-hollow-spout','stone-drain-grating','offset-bucket-ledge']),
    birdbathCourt:Object.freeze(['shallow-carved-stone-basin','turned-baluster-pedestal','opaque-still-water','low-herbaceous-edge','asymmetric-resting-twig']),
    pottingBench:Object.freeze(['working-timber-bench','open-slatted-lower-shelf','nested-terracotta-pots','divided-seed-trays','handled-watering-can','rear-tool-rail']),
    croquetCorner:Object.freeze(['oak-mallet-rack','bound-mallet-heads','four-colour-balls','two-open-wire-hoops','low-rest-seat']),
    chessCourt:Object.freeze(['stone-pedestal-table','eight-by-eight-inlaid-board','modeled-chess-pieces','offset-stone-seats','asymmetric-game-position']),
    orchardPress:Object.freeze(['oak-press-frame','threaded-screw-and-platen','slatted-press-basket','open-collection-tub','pegged-rear-joinery','offset-fruit-crate'])
  });

  function pathBase(S) {
    S.flat(0,16,0,16,0,paving);
    for(const x of[.28,14.88])for(let y=.30;y<15.5;y+=1.75)
      S.flat(x,x+.82,y,Math.min(y+1.55,15.70),.016,((y*4)|0)%3?P.stoneR:P.stone);
    for(const x of[5.08,10.76])S.flat(x,x+.15,.22,15.78,.021,P.stoneHi);
  }
  function turn(S,x,y,z0,z1,r0,r1,c,side,top,n) {
    cylinder(S,x,y,z0,z1,r0,r1,c,side,top,n||12);
  }
  // A circular solid around any world-space axis, including horizontal heads.
  function tube(S,a,b,r0,r1,c,side,cap,n) {
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz);
    if(len<.000001)return;
    const d=[dx/len,dy/len,dz/len],xy=Math.hypot(dx,dy);
    const u=xy>.000001?[-dy/xy,dx/xy,0]:[1,0,0];
    const v=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];
    const point=(p,r,t)=>p.map((q,k)=>q+r*(u[k]*Math.cos(t)+v[k]*Math.sin(t)));
    const lo=[],hi=[],count=n||8;
    for(let i=0;i<count;i++){
      const angle=i*Math.PI*2/count,next=(i+1)*Math.PI*2/count;
      const A=point(a,r0,angle),B=point(a,r0,next),D=point(b,r1,angle),E=point(b,r1,next);
      S.poly([A,B,E,D],i<count/2?c:side);lo.push(A);hi.push(D);
    }
    if(cap!==null){S.poly(lo,cap===undefined?c:cap);S.poly(hi,cap===undefined?c:cap);}
  }
  function curvedTube(S,points,r,c,side) {
    for(let i=1;i<points.length;i++)tube(S,points[i-1],points[i],r,r,c,side,c,8);
  }
  function arc(S,point,a,b,n,c,width) {
    for(let i=0;i<n;i++)S.beam(point(a+(b-a)*i/n),point(a+(b-a)*(i+1)/n),c,width);
  }
  function annulus(S,x,y,z0,z1,outer,inner,c,n) {
    const count=n||16;
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count,b=(i+1)*Math.PI*2/count;
      S.poly([[x+Math.cos(a)*outer,y+Math.sin(a)*outer,z0],
        [x+Math.cos(b)*outer,y+Math.sin(b)*outer,z0],
        [x+Math.cos(b)*inner,y+Math.sin(b)*inner,z1],
        [x+Math.cos(a)*inner,y+Math.sin(a)*inner,z1]],c);
    }
  }
  function leaf(S,a,b,width,c) {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
    const m=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
    S.poly([a,[m[0]-dy/len*width,m[1]+dx/len*width,m[2]+.15],b],c);
    S.poly([a,b,[m[0]+dy/len*width,m[1]-dx/len*width,m[2]-.08]],P.leaf[3]);
  }
  function sprig(S,x,y,z,h,phase) {
    const p=phase||0;
    S.beam([x,y,z],[x+.12,y+.08,z+h],P.leaf[3],.11);
    for(let i=1;i<=3;i++){
      const a=p+i*2.1,t=i/4,xx=x+.12*t,yy=y+.08*t,zz=z+h*t;
      leaf(S,[xx,yy,zz],[xx+Math.cos(a)*.63,yy+Math.sin(a)*.63,zz+.41],.22,P.leaf[i%3]);
    }
  }
  function clayPot(S,x,y,z,r,h) {
    turn(S,x,y,z,z+h,r*.67,r,T.clay,T.clayR,null,10);
    turn(S,x,y,z+h-.29,z+h+.12,r*1.08,r*1.08,T.clayHi,T.clayR,null,10);
    annulus(S,x,y,z+h+.12,z+h+.10,r*1.08,r*.80,T.clayHi,10);
    annulus(S,x,y,z+h+.10,z+h*.38,r*.80,r*.50,T.clayR,10);
    turn(S,x,y,z+h*.37,z+h*.38,r*.50,r*.50,T.clayR,T.clayR,P.soil,10);
  }
  function metalBucket(S,x,y,z,r,h) {
    turn(S,x,y,z,z+h,r*.75,r,T.metal,T.metalR,null,12);
    turn(S,x,y,z,z+.14,r*.79,r*.79,T.metalR,T.metalR,null,12);
    turn(S,x,y,z+h-.17,z+h+.12,r*1.04,r*1.04,T.metalHi,T.metalR,null,12);
    annulus(S,x,y,z+h+.12,z+h+.06,r*1.04,r*.87,T.metalHi,12);
    annulus(S,x,y,z+h+.06,z+.19,r*.87,r*.60,T.metalR,12);
    turn(S,x,y,z+.18,z+.19,r*.60,r*.60,T.metalR,T.metalR,T.waterD,12);
    for(const q of[-1,1])turn(S,x,y+q*r,z+h-.36,z+h-.06,.13,.13,T.ironHi,T.ironR,T.ironHi,6);
    arc(S,t=>[x,y+Math.cos(t)*r,z+h-.13+Math.sin(t)*r*1.1],0,Math.PI,14,T.metalR,.15);
  }

  function pumpCourt(S) {
    const x=2.95,y=6.65;
    // Circular bolted flange stands on a small flush-set paving slab.
    S.flat(1.12,4.77,4.72,8.28,.027,P.stoneR);
    turn(S,x,y,.03,.49,1.02,1.02,T.iron,T.ironR,T.ironHi,10);
    for(const a of[.5,2.1,3.65,5.2])turn(S,x+Math.cos(a)*.77,y+Math.sin(a)*.77,.49,.64,.12,.12,T.wornIron,T.ironR,T.wornIron,6);
    turn(S,x,y,.49,1.29,.75,.61,T.iron,T.ironR,T.ironHi,10);
    turn(S,x,y,1.29,9.25,.56,.47,T.iron,T.ironR,T.ironHi,12);
    for(const zz of[1.31,2.17,8.55,9.12])turn(S,x,y,zz,zz+.27,.68,.68,T.ironHi,T.ironR,T.iron,12);
    turn(S,x,y,9.39,12.38,.74,.72,T.iron,T.ironR,T.ironHi,12);
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5;
      S.beam([x+Math.cos(a)*.75,y+Math.sin(a)*.75,9.64],
        [x+Math.cos(a)*.73,y+Math.sin(a)*.73,12.18],i%2?T.ironHi:T.ironR,.13);
    }
    turn(S,x,y,12.38,12.82,.86,.86,T.iron,T.ironR,T.ironHi,12);
    turn(S,x,y,12.82,13.69,.86,.34,T.iron,T.ironR,T.ironHi,12);
    turn(S,x,y,13.69,14.06,.34,.10,T.ironHi,T.ironR,T.ironHi,8);
    // Spout curves forward to a physically hollow downturned mouth.
    curvedTube(S,[[x,y+.59,10.74],[x,y+1.18,10.66],[x,y+1.79,10.46],[x,y+2.20,10.07],[x,y+2.26,9.53]],.31,T.ironHi,T.ironR);
    turn(S,x,y+2.26,9.30,9.61,.41,.41,T.iron,T.ironR,null,10);
    annulus(S,x,y+2.26,9.30,9.31,.41,.24,T.ironHi,10);
    turn(S,x,y+2.26,9.40,9.43,.25,.25,T.ironR,T.ironR,P.ink,10);
    // The lever pivots at the rear head, curves away and ends in a timber grip.
    tube(S,[x-.98,y-.27,11.75],[x+.98,y-.27,11.75],.18,.18,T.ironHi,T.ironR,T.wornIron,8);
    curvedTube(S,[[x+.68,y-.30,11.76],[x+.70,y-1.27,12.26],[x+.70,y-2.28,11.87],
      [x+.70,y-2.98,10.28],[x+.70,y-3.49,7.74]],.22,T.iron,T.ironR);
    tube(S,[x+.70,y-3.49,7.89],[x+.70,y-3.68,6.58],.31,.29,T.oak,T.oakR,T.oakHi,8);
    S.beam([x+.40,y-.46,10.38],[x+.65,y-1.26,11.66],T.ironHi,.18);
    // The small receiving drain is recessed, not a service-producing trough.
    S.box(1.39,4.51,8.73,11.00,.03,.31,P.stone,P.stoneR,P.stoneHi);
    S.flat(1.71,4.18,9.01,10.72,.322,P.ink);
    for(let yy=9.20;yy<10.65;yy+=.35)S.box(1.81,4.09,yy,yy+.13,.33,.40,T.metalR,T.ironR,T.wornIron);
    // Off-axis ledge, empty bucket and a low moss seam make the rear distinctive.
    S.box(1.18,3.99,12.00,14.73,.03,.76,P.stone,P.stoneR,P.stoneHi);
    metalBucket(S,2.52,13.31,.76,.88,1.67);
    S.flat(1.34,2.28,14.40,14.57,.779,T.moss);
  }

  function birdbathCourt(S) {
    const x=2.90,y=6.52;
    S.box(x-1.02,x+1.02,y-1.02,y+1.02,.02,.52,P.stone,P.stoneR,P.stoneHi);
    turn(S,x,y,.52,1.00,.94,.88,P.stone,P.stoneR,P.stoneHi,8);
    turn(S,x,y,1.00,1.65,.67,.42,P.stone,P.stoneR,P.stoneHi,10);
    turn(S,x,y,1.65,3.16,.42,.71,P.stone,P.stoneR,P.stoneHi,12);
    turn(S,x,y,3.16,4.42,.71,.35,P.stone,P.stoneR,P.stoneHi,12);
    turn(S,x,y,4.42,5.86,.35,.52,P.stone,P.stoneR,P.stoneHi,12);
    turn(S,x,y,5.86,6.31,.73,.88,P.stone,P.stoneR,P.stoneHi,10);
    // Shallow convex underside, real rim and inward-sloping carved basin.
    turn(S,x,y,6.31,6.78,.74,1.53,P.stone,P.stoneR,null,16);
    turn(S,x,y,6.78,7.42,1.53,1.93,P.stone,P.stoneR,null,16);
    turn(S,x,y,7.42,7.65,1.93,1.93,P.stone,P.stoneR,null,16);
    annulus(S,x,y,7.65,7.60,1.93,1.58,P.stoneHi,16);
    annulus(S,x,y,7.60,7.09,1.58,.97,P.stoneR,16);
    turn(S,x,y,7.08,7.09,.97,.97,P.stoneR,P.stoneR,T.water,16);
    // Still water is an ordinary opaque material; no night emission or ripple.
    annulus(S,x,y,7.12,7.12,1.01,.92,T.waterHi,16);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      S.beam([x+Math.cos(a)*1.07,y+Math.sin(a)*1.07,6.49],
        [x+Math.cos(a)*1.75,y+Math.sin(a)*1.75,7.13],i%3?P.stoneD:P.stoneHi,.11);
    }
    // A short forked twig rests on two rim points, visibly off centre.
    S.beam([1.73,5.17,7.65],[3.73,5.13,7.68],P.woodR,.18);
    S.beam([2.42,5.16,7.67],[2.06,4.77,7.88],P.woodD,.13);
    leaf(S,[2.10,4.81,7.84],[1.65,4.50,8.09],.16,P.leaf[2]);
    // Low planted edge belongs to the opposite verge and never enters the walk.
    S.flat(11.50,15.10,3.02,12.76,.025,P.soil);
    for(const xx of[11.38,15.09])S.box(xx,xx+.20,2.90,12.90,.03,.45,P.stone,P.stoneR,P.stoneHi);
    for(const yy of[2.90,12.70])S.box(11.38,15.29,yy,yy+.20,.03,.45,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<7;i++){
      const xx=12.15+(i%2)*1.27,yy=3.72+i*1.25,h=1.16+(i%3)*.20;
      sprig(S,xx,yy,.10,h,i*.79);
      if(i%2===0)turn(S,xx+.12,yy+.08,.10+h,.34+h,.22,.12,P.flower[2],P.flower[2],P.gold,6);
    }
    S.poly([[1.11,11.77,.028],[3.98,11.41,.028],[4.28,13.25,.028],[1.66,13.69,.028]],P.stoneR);
    for(const [xx,yy]of[[1.71,12.54],[2.58,13.07],[3.61,12.04]])S.flat(xx,xx+.35,yy,yy+.24,.038,T.moss);
  }

  function wateringCan(S,x,y,z) {
    turn(S,x,y,z,z+1.90,.70,.78,T.ironHi,T.ironR,T.iron,12);
    turn(S,x,y,z,z+.16,.77,.77,T.metalR,T.ironR,T.iron,12);
    turn(S,x,y,z+1.68,z+1.86,.80,.80,T.ironHi,T.ironR,T.ironHi,12);
    turn(S,x,y-.10,z+1.90,z+2.13,.34,.34,T.metalHi,T.ironR,null,10);
    annulus(S,x,y-.10,z+2.13,z+2.08,.34,.22,T.metalHi,10);
    turn(S,x,y-.10,z+2.00,z+2.01,.22,.22,T.ironR,T.ironR,P.ink,10);
    // Rose-ended rising spout runs lengthwise along the furniture verge.
    tube(S,[x,y+.49,z+.51],[x,y+1.72,z+2.12],.23,.16,T.ironHi,T.ironR,T.iron,8);
    tube(S,[x,y+1.72,z+2.12],[x,y+1.99,z+2.43],.16,.44,T.metal,T.metalR,T.metalHi,10);
    for(const d of[-.19,0,.19])S.beam([x+d,y+1.96,z+2.56],[x+d,y+2.15,z+2.39],T.metalR,.08);
    arc(S,t=>[x,y-.72-.49*Math.sin(t),z+.99+.87*Math.cos(t)],0,Math.PI,16,T.ironR,.20);
    arc(S,t=>[x,y+Math.cos(t)*.59,z+1.87+Math.sin(t)*.95],0,Math.PI,14,T.metalR,.16);
  }
  function seedTray(S,x0,x1,y0,y1,z,seedlings) {
    S.box(x0,x1,y0,y1,z,z+.46,P.wood,P.woodR,P.soil);
    for(const xx of[x0,x1-.13])S.box(xx,xx+.13,y0,y1,z+.39,z+.62,P.wood,P.woodR,P.woodHi);
    for(const yy of[y0,y1-.13])S.box(x0,x1,yy,yy+.13,z+.39,z+.62,P.wood,P.woodR,P.woodHi);
    for(let i=1;i<3;i++)S.box(x0+(x1-x0)*i/3-.04,x0+(x1-x0)*i/3+.04,y0+.12,y1-.12,z+.45,z+.57,P.woodR,P.woodD,P.wood);
    S.box(x0+.10,x1-.10,(y0+y1)/2-.05,(y0+y1)/2+.05,z+.45,z+.57,P.woodR,P.woodD,P.wood);
    if(seedlings)for(let i=0;i<3;i++)for(let j=0;j<2;j++){
      const x=x0+(x1-x0)*(i+.5)/3,y=y0+(y1-y0)*(j+.5)/2;
      leaf(S,[x,y,z+.48],[x+.20,y+.16,z+1.01],.12,P.leaf[1]);
      leaf(S,[x,y,z+.49],[x-.22,y-.12,z+.88],.12,P.leaf[0]);
    }
  }
  function pottingBench(S) {
    const x0=1.06,x1=4.85,y0=3.36,y1=11.81,top=6.62;
    // Four real feet, pegged aprons and a completely open lower shelf.
    for(const xx of[1.30,4.40])for(const yy of[3.70,11.43])S.box(xx-.24,xx+.24,yy-.26,yy+.26,.02,6.28,P.wood,P.woodR,P.woodHi);
    for(const xx of[1.18,4.46])S.box(xx,xx+.22,y0+.08,y1-.08,5.31,6.31,P.wood,P.woodR,P.woodHi);
    for(const yy of[y0+.14,y1-.36])S.box(x0+.11,x1-.11,yy,yy+.22,5.31,6.31,P.wood,P.woodR,P.woodHi);
    for(let xx=1.13;xx<4.78;xx+=.76)S.box(xx,Math.min(xx+.68,4.86),y0,y1,6.27,top,P.wood,P.woodR,P.woodHi);
    for(let yy=3.65;yy<11.50;yy+=.88)S.box(1.36,4.48,yy,yy+.61,1.59,1.91,P.wood,P.woodR,P.woodHi);
    for(const xx of[1.38,4.25])S.box(xx,xx+.24,3.56,11.65,1.21,1.60,P.wood,P.woodR,P.wood);
    // The high back rail and diagonal rear braces visibly differ from the front.
    for(const yy of[3.69,11.44])S.box(.99,1.36,yy-.21,yy+.21,6.20,10.27,P.wood,P.woodR,P.woodHi);
    S.box(.99,1.31,3.48,11.65,8.48,9.08,P.wood,P.woodR,P.woodHi);
    S.beam([1.04,3.87,2.06],[1.04,11.24,5.23],P.woodR,.28);
    S.beam([1.09,4.00,9.06],[1.09,4.76,10.08],P.wood,.22);
    for(const yy of[3.77,11.36])for(const zz of[1.72,5.69,8.79])tube(S,[.93,yy,zz],[1.43,yy,zz],.10,.10,T.oakEnd,T.oakR,T.oakHi,6);
    // Full tapered pots nest within each other; each exposed rim has a body.
    for(const dz of[0,.48,.96])clayPot(S,3.10,4.63,top+dz,.81,1.58);
    seedTray(S,1.70,4.31,6.01,8.13,top,true);
    wateringCan(S,3.16,9.88,top);
    seedTray(S,1.56,4.26,7.54,10.65,1.91,false);
    clayPot(S,2.13,5.09,1.91,.62,1.24);
    clayPot(S,3.42,5.03,1.91,.49,.97);
    // A hand fork and trowel hang from the rail, never a printed tool icon.
    for(const yy of[6.24,8.74]){
      S.beam([1.26,yy,8.76],[1.55,yy,8.76],T.ironR,.13);
      S.beam([1.55,yy,8.76],[1.55,yy,8.96],T.ironR,.13);
      S.beam([1.50,yy,8.81],[1.50,yy,7.93],T.oakHi,.22);
    }
    S.poly([[1.50,6.02,7.95],[1.50,6.47,7.95],[1.50,6.58,7.15],[1.50,6.24,6.79],[1.50,5.92,7.15]],T.metalHi);
    for(const yy of[8.49,8.74,8.99])S.beam([1.50,yy,7.98],[1.50,yy,7.11],T.metal,.13);
    S.beam([1.50,8.48,7.94],[1.50,9.00,7.94],T.metalR,.18);
    // A small narrow spill lies on the worktop and remains purely decorative.
    S.poly([[3.90,8.39,top+.014],[4.50,8.29,top+.014],[4.65,8.80,top+.014],[4.20,8.97,top+.014]],P.soil);
  }

  function croquetBall(S,x,y,z,r,c,shade) {
    turn(S,x,y,z,z+r*.52,r*.32,r*.87,c,shade,c,10);
    turn(S,x,y,z+r*.52,z+r*1.18,r*.87,r,c,shade,c,10);
    turn(S,x,y,z+r*1.18,z+r*1.74,r,r*.61,c,shade,c,10);
    turn(S,x,y,z+r*1.74,z+r*1.91,r*.61,r*.12,c,shade,c,10);
  }
  function croquetHoop(S,x,y,mark) {
    const z=2.96,r=1.20;
    for(const xx of[x-r,x+r]){
      turn(S,xx,y,.03,z,.18,.18,T.cream,T.creamR,T.cream,8);
      turn(S,xx,y,.03,.35,.27,.20,T.creamR,T.creamR,T.cream,8);
    }
    S.beam([x-r,y,z],[x+r,y,z],T.cream,.36);
    S.beam([x-.56,y,z+.015],[x+.56,y,z+.015],mark,.38);
  }
  function croquetCorner(S) {
    // Rack occupies one margin; two full hoops stand on the opposite grass edge.
    S.box(1.17,4.79,3.28,10.50,.02,.44,P.wood,P.woodR,P.woodHi);
    for(const yy of[3.69,10.06]){
      S.box(1.29,1.67,yy-.23,yy+.23,.44,10.08,P.wood,P.woodR,P.woodHi);
      S.box(4.02,4.40,yy-.23,yy+.23,.44,5.63,P.wood,P.woodR,P.woodHi);
      S.beam([1.48,yy,8.80],[4.17,yy,4.81],P.woodR,.25);
    }
    S.box(1.31,1.68,3.48,10.24,8.82,9.36,P.wood,P.woodR,P.woodHi);
    S.box(1.38,4.35,3.46,3.87,4.93,5.44,P.wood,P.woodR,P.woodHi);
    S.box(1.38,4.35,9.84,10.25,4.93,5.44,P.wood,P.woodR,P.woodHi);
    const colors=[T.red,T.blue,T.chessBlack,T.yellow];
    for(let i=0;i<4;i++){
      const yy=4.40+i*1.39,x=2.86,head=.86;
      // Heads are horizontal cylinders with brass end bands; handles sit in them.
      tube(S,[1.48,yy,head],[4.22,yy,head],.42,.42,T.oak,T.oakR,T.oakEnd,10);
      for(const xx of[1.55,3.94])tube(S,[xx,yy,head],[xx+.20,yy,head],.46,.46,P.gold,P.woodR,P.gold,10);
      S.beam([x,yy,head+.21],[x-.48,yy,10.82+(i%2)*.68],P.woodHi,.24);
      S.beam([x-.43,yy,9.81+(i%2)*.68],[x-.48,yy,10.82+(i%2)*.68],colors[i],.33);
      S.beam([1.61,yy,9.09],[2.68,yy,9.09],T.ironR,.14);
      S.beam([2.68,yy,9.09],[2.68,yy,9.47],T.ironR,.14);
    }
    // Four balls sit in an open low carrying tray, all outside the walking lane.
    S.box(1.13,4.78,11.71,14.58,.02,.31,P.wood,P.woodR,P.woodHi);
    for(const xx of[1.10,4.57])S.box(xx,xx+.24,11.69,14.61,.31,.95,P.wood,P.woodR,P.woodHi);
    for(const yy of[11.68,14.37])S.box(1.10,4.81,yy,yy+.24,.31,.95,P.wood,P.woodR,P.woodHi);
    const ballPos=[[2.10,12.44],[3.67,12.43],[2.16,13.66],[3.66,13.67]];
    const shades=[T.redR,T.blueR,P.ink,T.yellowR];
    for(let i=0;i<4;i++)croquetBall(S,...ballPos[i],.31,.47,colors[i],shades[i]);
    S.flat(11.40,15.33,2.43,11.94,.027,T.grass);
    for(let i=0;i<8;i++)S.flat(11.51+(i%3)*1.14,11.86+(i%3)*1.14,3.02+i*.91,3.20+i*.91,.038,i%2?T.grassHi:T.grassR);
    croquetHoop(S,13.30,4.30,T.blue);
    croquetHoop(S,13.17,9.49,T.red);
    // Low unbacked rest seat has three slats and deliberately offset end trestles.
    for(const yy of[12.68,14.52])S.box(11.93,14.73,yy-.22,yy+.22,.02,2.45,P.wood,P.woodR,P.woodHi);
    for(const xx of[11.79,12.85,13.91])S.box(xx,xx+.90,12.27,14.94,2.45,2.80,P.wood,P.woodR,P.woodHi);
  }

  function chessPiece(S,x,y,z,type,dark) {
    const c=dark?T.chessBlack:T.chessLight,r=dark?P.ink:P.stoneR,hi=dark?T.chessDark:P.stoneHi;
    turn(S,x,y,z,z+.16,.20,.22,c,r,hi,8);
    turn(S,x,y,z+.16,z+.28,.19,.12,c,r,hi,8);
    const h=type==='pawn'?.55:type==='rook'?.74:type==='knight'?.91:1.07;
    turn(S,x,y,z+.28,z+h,.12,.09,c,r,hi,8);
    if(type==='rook'){
      turn(S,x,y,z+h-.10,z+h+.21,.22,.22,c,r,hi,8);
      for(const [dx,dy]of[[.14,0],[-.14,0],[0,.14],[0,-.14]])S.box(x+dx-.065,x+dx+.065,y+dy-.065,y+dy+.065,z+h+.21,z+h+.37,c,r,hi);
    }else if(type==='knight'){
      // Upper-right fan anchor sees every edge of this concave horse profile.
      const outline=[[.23,1.17],[-.12,1.38],[-.29,1.16],[-.03,1.05],[-.17,.59],[.18,.59]];
      for(const side of[-1,1])S.poly(outline.map(p=>[x+p[0],y+side*.13,z+p[1]]),side<0?c:r);
      for(let i=0;i<outline.length;i++){
        const a=outline[i],b=outline[(i+1)%outline.length];
        S.poly([[x+a[0],y-.13,z+a[1]],[x+b[0],y-.13,z+b[1]],
          [x+b[0],y+.13,z+b[1]],[x+a[0],y+.13,z+a[1]]],i===0?hi:c);
      }
    }else{
      turn(S,x,y,z+h,z+h+.25,type==='pawn'?.19:.21,.09,c,r,hi,8);
      if(type==='king'){
        S.beam([x,y,z+h+.18],[x,y,z+h+.67],c,.14);
        S.beam([x,y-.18,z+h+.48],[x,y+.18,z+h+.48],hi,.13);
      }
    }
  }
  function stoneSeat(S,x,y,length) {
    S.box(x-1.09,x+1.09,y-length/2,y+length/2,.02,.37,P.stone,P.stoneR,P.stoneHi);
    S.box(x-.66,x+.66,y-length/2+.22,y+length/2-.22,.37,2.79,P.stone,P.stoneR,P.stone);
    S.box(x-1.12,x+1.12,y-length/2-.05,y+length/2+.05,2.79,3.26,P.stone,P.stoneR,P.stoneHi);
    for(const yy of[y-length/2+.45,y+length/2-.45])S.wall([x+.671,yy-.09],[x+.671,yy+.09],.64,2.49,P.stoneD,.03);
  }
  function chessCourt(S) {
    const x=2.99,y=7.23;
    S.box(x-1.04,x+1.04,y-1.04,y+1.04,.02,.43,P.stone,P.stoneR,P.stoneHi);
    turn(S,x,y,.43,1.10,.97,.78,P.stone,P.stoneR,P.stoneHi,8);
    turn(S,x,y,1.10,4.73,.62,.49,P.stone,P.stoneR,P.stoneHi,8);
    for(const zz of[1.20,4.36])turn(S,x,y,zz,zz+.23,.70,.70,P.stoneHi,P.stoneR,P.stone,8);
    turn(S,x,y,4.73,5.18,.49,1.27,P.stone,P.stoneR,P.stoneHi,8);
    S.box(.78,5.20,5.02,9.44,5.18,5.63,P.stone,P.stoneR,P.stoneHi);
    S.box(.87,5.11,5.11,9.35,5.63,5.78,P.stone,P.stoneR,T.chessDark);
    // A true 8x8 board of shallow stone inlays; no text/font/bitmap texture.
    const bx=1.01,by=5.25,size=.495,level=5.798;
    for(let ix=0;ix<8;ix++)for(let iy=0;iy<8;iy++)S.flat(bx+ix*size,bx+(ix+1)*size,by+iy*size,by+(iy+1)*size,level,(ix+iy)%2?T.chessDark:T.chessLight);
    // Sparse mid-game position keeps individual modeled pieces readable.
    const pieces=[['king',6,0,false],['rook',0,1,false],['knight',4,2,false],['pawn',2,3,false],
      ['pawn',5,3,false],['king',1,7,true],['rook',7,6,true],['knight',3,5,true],['pawn',1,4,true],['pawn',6,5,true]];
    for(const [type,ix,iy,dark]of pieces)chessPiece(S,bx+(ix+.5)*size,by+(iy+.5)*size,level,type,dark);
    // Opposing seats are longitudinally separated and slightly staggered.
    stoneSeat(S,2.56,2.52,2.22);
    stoneSeat(S,3.61,12.34,2.51);
    // Captured pieces sit on the far seat's lip instead of floating off-table.
    chessPiece(S,3.38,12.60,3.26,'pawn',true);
    chessPiece(S,4.04,12.62,3.26,'pawn',false);
    S.flat(11.71,14.93,8.78,12.77,.027,P.stoneR);
    for(const [xx,yy]of[[11.87,8.94],[14.17,11.96]])S.flat(xx,xx+.51,yy,yy+.41,.038,T.mossR);
  }

  function pressBasket(S,x,y,z,r,h) {
    // Separate oak staves with narrow visible seams, reinforced by two hoops.
    const n=16;
    for(let i=0;i<n;i++){
      const a=(i+.035)*Math.PI*2/n,b=(i+.965)*Math.PI*2/n;
      const out=(q,zz)=>[x+Math.cos(q)*r,y+Math.sin(q)*r,zz];
      const inn=(q,zz)=>[x+Math.cos(q)*(r-.22),y+Math.sin(q)*(r-.22),zz];
      S.poly([out(a,z),out(b,z),out(b,z+h),out(a,z+h)],i<8?T.oak:T.oakR);
      S.poly([inn(a,z+h),inn(b,z+h),inn(b,z+.18),inn(a,z+.18)],T.oakR);
      S.poly([out(a,z+h),out(b,z+h),inn(b,z+h),inn(a,z+h)],T.oakHi);
      S.poly([out(a,z),out(a,z+h),inn(a,z+h),inn(a,z)],T.oakEnd);
      S.poly([out(b,z),inn(b,z),inn(b,z+h),out(b,z+h)],T.oakEnd);
    }
    for(const zz of[z+.39,z+h-.69])turn(S,x,y,zz,zz+.30,r+.035,r+.035,T.ironHi,T.ironR,null,16);
    turn(S,x,y,z+.10,z+.12,r-.22,r-.22,T.oak,T.oakR,P.soil,16);
    for(const a of[.32,2.71,4.49]){
      const xx=x+Math.cos(a)*(r+.07),yy=y+Math.sin(a)*(r+.07);
      turn(S,xx,yy,z+h-.61,z+h-.35,.095,.095,T.wornIron,T.ironR,T.wornIron,6);
    }
  }
  function orchardPress(S) {
    const x=2.99,y=7.28;
    // Long splayed feet sit directly on the flags; upright tenons pass the beam.
    for(const yy of[3.86,10.66]){
      S.box(.87,5.11,yy-.48,yy+.48,.02,.63,T.oak,T.oakR,T.oakHi);
      S.box(2.36,3.62,yy-.45,yy+.45,.63,14.20,T.oak,T.oakR,T.oakHi);
      S.beam([1.05,yy,.67],[2.43,yy,3.63],T.oakR,.36);
      S.beam([4.94,yy,.67],[3.55,yy,3.63],T.oak,.36);
      for(const zz of[2.23,12.75])tube(S,[2.23,yy,zz],[3.75,yy,zz],.12,.12,T.oakEnd,T.oakR,T.oakHi,8);
    }
    S.box(2.03,3.95,3.20,11.32,12.41,13.73,T.oak,T.oakR,T.oakHi);
    for(const yy of[3.85,10.67])S.box(2.30,3.68,yy-.28,yy+.28,13.73,14.57,T.oakEnd,T.oakR,T.oakHi);
    // Rear diagonal knee-braces and visible peg heads differ from the open front.
    S.beam([2.26,4.03,9.43],[2.26,5.92,12.46],T.oakR,.43);
    S.beam([2.26,10.48,9.43],[2.26,8.69,12.46],T.oakR,.43);
    for(const yy of[5.71,8.90])tube(S,[2.02,yy,12.22],[2.49,yy,12.22],.12,.12,T.oakEnd,T.oakR,T.oakHi,8);
    // Longitudinal bearers bridge both feet and carry the pressing bed.
    for(const xx of[1.45,3.98])S.box(xx,xx+.55,3.81,10.71,.34,.77,T.oak,T.oakR,T.oakHi);
    S.box(1.20,4.78,4.99,9.57,.65,1.18,T.oak,T.oakR,T.oakHi);
    turn(S,x,y,1.18,1.57,1.74,1.85,T.metal,T.metalR,T.metalHi,16);
    annulus(S,x,y,1.59,1.57,1.85,1.63,T.metalR,16);
    pressBasket(S,x,y,1.59,1.48,4.39);
    // Platen sits within the basket; screw engages both platen and top nut.
    turn(S,x,y,5.63,6.25,1.26,1.26,T.oak,T.oakR,T.oakHi,16);
    for(const yy of[y-.50,y+.50])S.box(1.86,4.12,yy-.12,yy+.12,6.25,6.45,T.oak,T.oakR,T.oakHi);
    turn(S,x,y,6.25,6.57,.47,.47,T.ironHi,T.ironR,T.metal,10);
    turn(S,x,y,6.22,15.53,.29,.29,T.iron,T.ironR,T.ironHi,10);
    for(let z=6.64;z<15.1;z+=.49){
      // Each helical turn is actual continuous sloping metal, not painted bands.
      const pts=[];
      for(let i=0;i<=12;i++){const a=i*Math.PI/6;pts.push([x+Math.cos(a)*.34,y+Math.sin(a)*.34,z+i*.49/12]);}
      curvedTube(S,pts,.075,T.metal,T.ironR);
    }
    turn(S,x,y,12.26,13.91,.49,.49,T.ironHi,T.ironR,T.metal,8);
    turn(S,x,y,14.42,14.85,.45,.45,T.iron,T.ironR,T.ironHi,8);
    S.beam([x,5.15,14.64],[x,9.77,14.64],T.ironR,.29);
    tube(S,[x,5.12,14.64],[x,5.80,14.64],.21,.21,T.oak,T.oakR,T.oakHi,8);
    // A short spout drains towards a small open tub, wholly within the verge.
    S.box(2.66,3.32,9.02,11.67,1.20,1.39,T.metal,T.metalR,T.metalHi);
    for(const xx of[2.61,3.25])S.box(xx,xx+.13,9.01,11.68,1.38,1.69,T.metal,T.metalR,T.metalHi);
    metalBucket(S,3.00,12.49,.03,1.11,1.43);
    // A separate fruit crate makes the reverse angle visibly unlike the front.
    S.box(11.89,14.82,9.27,13.19,.02,.30,T.oak,T.oakR,T.oakHi);
    for(const zz of[.32,.84]){
      for(const xx of[11.86,14.59])S.box(xx,xx+.23,9.23,13.22,zz,zz+.37,T.oak,T.oakR,T.oakHi);
      for(const yy of[9.23,12.99])S.box(11.87,14.82,yy,yy+.23,zz,zz+.37,T.oak,T.oakR,T.oakHi);
    }
    for(const xx of[12.01,14.63])for(const yy of[9.37,13.03])S.box(xx-.11,xx+.11,yy-.11,yy+.11,.30,1.29,T.oakEnd,T.oakR,T.oakHi);
    for(let i=0;i<6;i++){
      const xx=12.59+(i%2)*1.14,yy=9.98+Math.floor(i/2)*.99;
      croquetBall(S,xx,yy,.31,.43,i%2?T.apple:T.appleHi,T.oakR);
      S.beam([xx,yy,1.05],[xx+.06,yy,1.22],P.woodD,.10);
      if(i%2===0)leaf(S,[xx,yy,1.13],[xx+.41,yy+.19,1.27],.13,P.leaf[2]);
    }
  }

  const builders=Object.freeze({pumpCourt,birdbathCourt,pottingBench,croquetCorner,chessCourt,orchardPress});
  function moduleSprite(theme,view) {
    const S=Scene(1,view,72,92);
    pathBase(S);builders[theme](S);
    return S.finish({theme,design:'british-garden-life-'+theme,pathAxis:'y',minimumClearPath:5.4,
      clearWalkStrip:[5.3,10.7],features:FEATURES[theme],lightPolicy:'non-emissive',
      physicalLampCount:0,family:'gardenLife016'});
  }
  function buildAll() {
    const modules={};
    for(const theme of themes)for(let view=0;view<4;view++)modules[theme+'_'+view]=moduleSprite(theme,view);
    return {modules};
  }
  root.BritishGardenLifeArchitecture016=Object.freeze({buildAll,themes});
})(typeof window==='undefined'?globalThis:window);
