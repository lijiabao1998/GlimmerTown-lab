/* GPT-017: original British-quayside-inspired dry-land path furniture.
 * Vocabulary consulted 2026-10-06; these are composites, not reconstructions:
 * https://historicengland.org.uk/listing/the-list/list-entry/1255552
 *   Cast-iron mooring furniture and granite dock materials.
 * https://historicengland.org.uk/listing/the-list/list-entry/1138278
 *   Timber capstan, iron fastenings and a supported bearing.
 * https://www.rmg.co.uk/collections/objects/rmgc-object-18183
 *   Admiralty-pattern anchor category and outdoor display context only.
 * https://www.rmg.co.uk/collections/objects/rmgc-object-17697
 *   Lifebuoy category only; no reproduced photograph or collection dimensions.
 * https://nmmc.co.uk/2023/12/the-history-of-cornish-shellfishery/
 *   Traditional home-made withy pots and local willow craft.
 * https://www.lobsterpots.co.uk/corkfloatsandnets.html
 *   Cork floats and pilchard-net vocabulary from search-accessible text only;
 *   direct retrieval failed. No claim of full-page or photograph inspection.
 * No old furniture drawing, tracing, raster, font, storage, simulation RNG or
 * animation. Only unchanged Scene/P/C/paving/cylinder infrastructure is shared.
 * Six themes have four complete geometric rotations each: 1x1, 72x92, ax36,
 * ay90. Every accessory remains on the paid dry-land tile. Raised solids stay
 * outside the central x=5.3..10.7 walking strip. Every visible material is
 * opaque and non-emissive; the ring, basket and net holes are open geometry.
 * Source/syntax review only locally; renderer and pixel checks belong to CI.
 */
(function (root) {
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw new Error('BritishComplexPrimitives014 must load before quayside art');
  const {Scene,P,C,paving,cylinder}=H;
  const themes=Object.freeze(['mooringBitts','quayCapstan','lifebuoyStand','anchorDisplay','withyPots','netDryingRack']);
  const T=Object.freeze({
    iron:C('455a58'),ironR:C('344745'),ironHi:C('75877b'),ironEdge:C('93a194'),
    rust:C('8c7259'),rustR:C('675947'),
    granite:C('a8aea0'),graniteR:C('818e83'),graniteHi:C('c4c6b4'),graniteD:C('737f76'),
    oak:C('ad9166'),oakR:C('7e694c'),oakHi:C('ceb286'),oakEnd:C('947956'),
    rope:C('c1ae81'),ropeR:C('93805c'),ropeHi:C('ded0a7'),
    vermilion:C('bc7154'),vermilionR:C('8d5343'),cream:C('e8dcc1'),creamR:C('b8b29d'),
    willow:C('b49962'),willowR:C('826c47'),willowHi:C('d0b57d'),
    cork:C('ad9167'),corkR:C('847154'),corkHi:C('d0b784'),
    net:C('7c896e'),netR:C('536859'),netHi:C('a1ac89')
  });
  const FEATURES=Object.freeze({
    mooringBitts:Object.freeze(['paired-tapered-cast-iron-bitts','bolted-granite-pads','tied-figure-eight-rope','connected-offset-rope-coil','weathered-cap-and-collars']),
    quayCapstan:Object.freeze(['staved-timber-capstan','iron-drum-bands','stone-supported-bearing','removable-push-bars','offset-stored-bar-and-chocks','attached-drum-rope']),
    lifebuoyStand:Object.freeze(['open-painted-lifebuoy-ring','attached-grab-line','pegged-timber-holder','hook-and-cradle-supports','braced-feet','small-rope-shelf']),
    anchorDisplay:Object.freeze(['modeled-iron-shank','perpendicular-timber-stock','curved-arms-and-solid-flukes','open-attachment-ring','low-stone-display-setting','rear-iron-support-straps']),
    withyPots:Object.freeze(['curved-open-willow-ribs','woven-domed-pot-shells','open-inward-funnels','woven-base-spokes','offset-cork-floats','short-gathered-rope']),
    netDryingRack:Object.freeze(['pegged-timber-net-frame','splayed-and-braced-feet','hanging-open-diamond-mesh','tied-head-and-foot-ropes','small-cork-floats','asymmetric-folded-net-edge'])
  });

  function pathBase(S) {
    S.flat(0,16,0,16,0,paving);
    // Flush granite setts and narrow joints keep the walking surface continuous.
    for(const x of[.32,14.88])for(let j=0;j<9;j++){
      const y=.36+j*1.72;
      S.flat(x,x+.80,y,Math.min(15.66,y+1.53),.012,j%3===0?T.granite:T.graniteHi);
    }
    for(const x of[5.13,10.72])S.flat(x,x+.13,.24,15.76,.016,P.stoneR);
  }
  function turn(S,x,y,z0,z1,r0,r1,front,side,top,n) {
    cylinder(S,x,y,z0,z1,r0,r1,front,side,top,n||12);
  }
  // Closed faceted round solid between two arbitrary world-space endpoints.
  function rod(S,a,b,r0,r1,front,side,end,n) {
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz);
    if(len<.000001)return;
    const axis=[dx/len,dy/len,dz/len],xy=Math.hypot(dx,dy);
    const u=xy>.000001?[-dy/xy,dx/xy,0]:[1,0,0];
    const v=[axis[1]*u[2]-axis[2]*u[1],axis[2]*u[0]-axis[0]*u[2],axis[0]*u[1]-axis[1]*u[0]];
    const at=(p,r,t)=>p.map((q,k)=>q+r*(u[k]*Math.cos(t)+v[k]*Math.sin(t)));
    const low=[],high=[],count=n||8;
    for(let i=0;i<count;i++){
      const a0=i*Math.PI*2/count,a1=(i+1)*Math.PI*2/count;
      const A=at(a,r0,a0),B=at(a,r0,a1),D=at(b,r1,a0),E=at(b,r1,a1);
      S.poly([A,B,E,D],i<count/2?front:side);low.push(A);high.push(D);
    }
    S.poly(low,end===undefined?front:end);S.poly(high,end===undefined?front:end);
  }
  function cord(S,points,r,front,side) {
    for(let i=1;i<points.length;i++)rod(S,points[i-1],points[i],r,r,front,side,front,6);
  }
  function curve(S,point,start,end,steps,r,front,side) {
    const points=[];
    for(let i=0;i<=steps;i++)points.push(point(start+(end-start)*i/steps));
    cord(S,points,r,front,side);
  }
  // A real toroidal ring: u and v span its plane, axis gives its thickness.
  // No centre polygon is drawn. Stripe colour belongs to the actual ring skin.
  function torus(S,c,u,v,axis,major,minor,front,side,bands,n,m) {
    const count=n||24,sides=m||8;
    const at=(a,b)=>c.map((q,k)=>q+(major+minor*Math.cos(b))*(u[k]*Math.cos(a)+v[k]*Math.sin(a))+axis[k]*minor*Math.sin(b));
    for(let i=0;i<count;i++)for(let j=0;j<sides;j++){
      const a=i*Math.PI*2/count,b=(i+1)*Math.PI*2/count;
      const p=j*Math.PI*2/sides,q=(j+1)*Math.PI*2/sides;
      const pair=bands?bands(i,count):[front,side];
      S.poly([at(a,p),at(b,p),at(b,q),at(a,q)],j<sides/2?pair[0]:pair[1]);
    }
  }
  function loopXY(S,x,y,z,rx,ry,r,front,side,phase) {
    curve(S,a=>[x+Math.cos(a)*rx,y+Math.sin(a)*ry,z],phase||0,(phase||0)+Math.PI*2,28,r,front,side);
  }
  function coil(S,x,y,z,rx,ry,loops) {
    // A continuous spiral has a visible loose inner end and an outer lead.
    curve(S,t=>{
      const scale=.30+.70*t/(loops*Math.PI*2);
      return [x+Math.cos(t)*rx*scale,y+Math.sin(t)*ry*scale,z+.14];
    },0,loops*Math.PI*2,loops*30,.14,T.rope,T.ropeR);
  }
  function bolt(S,x,y,z) {
    turn(S,x,y,z,z+.20,.14,.14,T.ironHi,T.ironR,T.ironEdge,6);
  }
  function stonePad(S,x0,x1,y0,y1,h) {
    S.box(x0,x1,y0,y1,.018,h,T.granite,T.graniteR,T.graniteHi);
    S.box(x0+.12,x1-.12,y0+.12,y1-.12,h,h+.12,T.granite,T.graniteR,T.granite);
    // The few cut seams have real positions on the top, not random noise.
    S.flat(x0+.16,x1-.16,y0+(y1-y0)*.46,y0+(y1-y0)*.46+.07,h+.125,T.graniteR);
  }
  function corkFloat(S,a,b,r) {
    const p=t=>a.map((q,k)=>q+(b[k]-q)*t);
    rod(S,a,p(.18),r*.56,r,T.cork,T.corkR,T.corkHi,8);
    rod(S,p(.18),p(.82),r,r,T.cork,T.corkR,T.corkHi,10);
    rod(S,p(.82),b,r,r*.56,T.cork,T.corkR,T.corkHi,8);
  }

  function mooringBitts(S) {
    const x=2.92;
    for(const [y,h]of[[4.62,6.93],[9.63,6.38]]){
      stonePad(S,.78,5.08,y-1.71,y+1.71,.48);
      turn(S,x,y,.60,.89,1.40,1.40,T.iron,T.ironR,T.ironHi,12);
      for(const a of[.62,2.25,3.76,5.33])bolt(S,x+Math.cos(a)*1.10,y+Math.sin(a)*1.10,.89);
      turn(S,x,y,.89,1.60,1.10,.86,T.iron,T.ironR,T.ironHi,12);
      turn(S,x,y,1.60,h-.79,.86,.68,T.iron,T.ironR,T.ironHi,12);
      turn(S,x,y,h-.79,h-.32,.92,1.25,T.iron,T.ironR,T.ironHi,12);
      turn(S,x,y,h-.32,h,1.25,1.19,T.ironHi,T.ironR,T.ironHi,12);
      turn(S,x,y,h,h+.22,1.19,.91,T.ironHi,T.ironR,T.ironEdge,12);
      // Raised casting spine and worn collar distinguish these from road posts.
      rod(S,[x-.56,y+.43,1.64],[x-.44,y+.38,h-.86],.10,.09,T.ironHi,T.ironR,T.ironHi,6);
      turn(S,x,y,1.59,1.84,.91,.91,T.rust,T.ironR,null,12);
    }
    // One continuous figure-eight is wrapped below both caps, with crossing
    // strands at different heights and no rope projected beyond the land tile.
    curve(S,t=>[x+.97*Math.sin(t*2),7.12+3.40*Math.cos(t),3.17+.29*Math.sin(t)],0,Math.PI*2,64,.18,T.rope,T.ropeR);
    loopXY(S,x,9.63,3.58,1.01,1.01,.17,T.ropeHi,T.ropeR);
    cord(S,[[3.89,9.39,3.57],[4.02,9.61,3.76],[3.77,9.92,3.91],[3.81,10.23,3.50],
      [4.29,10.84,1.66],[4.40,11.67,.21],[4.20,12.96,.17]],.17,T.rope,T.ropeR);
    coil(S,2.90,12.96,.027,1.30,1.67,3);
    cord(S,[[3.29,12.96,.17],[3.55,13.33,.17],[3.10,13.76,.17]],.14,T.rope,T.ropeR);
    // A second short, tied eye lies on the opposite granite inset.
    stonePad(S,11.56,14.87,3.42,6.48,.21);
    loopXY(S,13.09,4.90,.46,1.03,.89,.17,T.rope,T.ropeR);
    cord(S,[[14.04,4.58,.46],[14.22,4.92,.46],[13.94,5.12,.50],[14.02,5.84,.46]],.17,T.ropeHi,T.ropeR);
  }

  function quayCapstan(S) {
    const x=2.93,y=7.18;
    stonePad(S,.79,5.09,4.66,9.68,.64);
    // The spindle actually enters a bolted bearing shoe on the granite bed.
    turn(S,x,y,.76,1.07,1.67,1.67,T.iron,T.ironR,T.ironHi,12);
    for(const a of[.46,1.98,3.68,5.31])bolt(S,x+Math.cos(a)*1.37,y+Math.sin(a)*1.37,1.07);
    turn(S,x,y,1.07,2.14,.69,.69,T.ironHi,T.ironR,T.ironEdge,12);
    turn(S,x,y,1.63,2.24,1.39,1.56,T.oak,T.oakR,T.oakHi,12);
    // A waisted twelve-stave drum; vertical seams stay geometric in all views.
    const profile=[[2.24,1.34],[3.26,1.12],[5.24,1.02],[6.47,1.30],[7.20,1.42]];
    for(let i=0;i<12;i++)for(let j=1;j<profile.length;j++){
      const a=(i+.018)*Math.PI/6,b=(i+.982)*Math.PI/6;
      const [z0,r0]=profile[j-1],[z1,r1]=profile[j];
      const point=(q,z,r)=>[x+Math.cos(q)*r,y+Math.sin(q)*r,z];
      S.poly([point(a,z0,r0),point(b,z0,r0),point(b,z1,r1),point(a,z1,r1)],i<6?T.oak:T.oakR);
    }
    for(const [z,r]of[[2.32,1.34],[3.05,1.19],[6.35,1.33],[6.98,1.45]]){
      turn(S,x,y,z,z+.28,r,r,T.iron,T.ironR,T.ironHi,12);
      for(const a of[.22,2.40,4.47])rod(S,[x+Math.cos(a)*(r-.02),y+Math.sin(a)*(r-.02),z+.14],
        [x+Math.cos(a)*(r+.13),y+Math.sin(a)*(r+.13),z+.14],.10,.10,T.ironHi,T.ironR,T.ironEdge,6);
    }
    turn(S,x,y,7.20,7.89,1.45,1.45,T.oak,T.oakR,T.oakHi,12);
    turn(S,x,y,7.89,8.22,1.53,1.53,T.iron,T.ironR,T.ironHi,12);
    turn(S,x,y,8.22,8.66,.38,.29,T.ironHi,T.ironR,T.ironEdge,10);
    // Removable oak handspikes enter four iron-bound square sockets.
    for(const q of[-1,1]){
      S.box(x-.29,x+.29,y+q*1.20-.36,y+q*1.20+.36,7.14,7.76,T.iron,T.ironR,T.ironHi);
      rod(S,[x,y+q*1.04,7.44],[x,y+q*3.99,7.44],.22,.17,T.oak,T.oakR,T.oakEnd,8);
      S.box(x+q*1.24-.32,x+q*1.24+.32,y-.31,y+.31,7.12,7.75,T.iron,T.ironR,T.ironHi);
      rod(S,[x+q*1.09,y,7.43],[x+q*1.96,y,7.43],.21,.16,T.oak,T.oakR,T.oakEnd,8);
    }
    // Three close helical rope turns stay on the drum and fall to one side.
    curve(S,t=>[x+Math.cos(t)*1.14,y+Math.sin(t)*1.14,3.66+t*.40/(Math.PI*2)],0,Math.PI*6,78,.16,T.rope,T.ropeR);
    cord(S,[[4.07,7.18,4.86],[4.35,8.44,3.19],[4.65,9.72,.28],[4.43,11.09,.18],[4.14,12.90,.18]],.17,T.rope,T.ropeR);
    coil(S,2.96,12.90,.035,1.19,1.42,3);
    // The single stored bar lies lengthwise on two shaped timber chocks.
    for(const yy of[5.03,10.71]){
      S.box(11.84,14.65,yy-.39,yy+.39,.02,.66,T.oak,T.oakR,T.oakHi);
      S.box(11.94,12.54,yy-.29,yy+.29,.66,1.05,T.oak,T.oakR,T.oakHi);
      S.box(13.55,14.44,yy-.29,yy+.29,.66,1.05,T.oak,T.oakR,T.oakHi);
    }
    rod(S,[13.04,3.58,.91],[13.04,12.26,.91],.24,.18,T.oak,T.oakR,T.oakHi,8);
    rod(S,[13.04,3.53,.91],[13.04,4.53,.91],.27,.27,T.iron,T.ironR,T.ironHi,8);
    loopXY(S,13.04,10.71,1.15,.42,.47,.12,T.rope,T.ropeR);
  }

  function lifebuoyStand(S) {
    const x=3.03,y=7.54,z=9.29;
    for(const yy of[3.74,11.34]){
      S.box(.96,4.90,yy-.52,yy+.52,.02,.56,T.oak,T.oakR,T.oakHi);
      S.box(1.69,2.22,yy-.29,yy+.29,.56,13.31,T.oak,T.oakR,T.oakHi);
      S.beam([1.13,yy,.58],[1.74,yy,3.66],T.oakR,.30);
      S.beam([4.69,yy,.58],[2.15,yy,4.72],T.oak,.33);
    }
    S.box(1.65,2.26,3.35,11.73,12.47,13.08,T.oak,T.oakR,T.oakHi);
    S.box(1.71,2.20,3.74,11.34,4.77,5.29,T.oak,T.oakR,T.oakHi);
    S.beam([1.80,3.97,9.84],[1.80,5.95,12.50],T.oakR,.31);
    S.beam([1.80,11.12,10.58],[1.80,9.65,12.50],T.oakR,.31);
    for(const yy of[3.76,11.32])for(const zz of[5.01,12.76])rod(S,[1.58,yy,zz],[2.31,yy,zz],.115,.115,T.oakEnd,T.oakR,T.oakHi,6);
    // Curved iron hook carries the top; a pair of angled cradles locate the base.
    cord(S,[[2.04,y,12.75],[2.73,y,13.00],[3.42,y,12.79],[3.42,y,12.31]],.17,T.iron,T.ironR);
    for(const q of[-1,1]){
      S.beam([2.16,y+q*1.15,5.03],[3.07,y+q*1.15,6.12],T.iron,.28);
      S.beam([3.07,y+q*1.15,6.12],[3.55,y+q*1.15,6.57],T.iron,.24);
    }
    torus(S,[x,y,z],[0,1,0],[0,0,1],[1,0,0],2.66,.60,T.vermilion,T.vermilionR,
      (i,n)=>i%(n/4)<2?[T.cream,T.creamR]:[T.vermilion,T.vermilionR],32,8);
    // A loose grab rope has four tied attachment sleeves, rather than floating
    // outside the ring. Its slight lobes sag between those fixed points.
    curve(S,a=>{
      const r=3.23+.19*Math.sin(a*2)*Math.sin(a*2);
      return [x+.15,y+Math.cos(a)*r,z+Math.sin(a)*r];
    },0,Math.PI*2,48,.12,T.ropeHi,T.ropeR);
    for(let i=0;i<4;i++){
      const a=i*Math.PI/2,dy=Math.cos(a),dz=Math.sin(a);
      cord(S,[[x-.47,y+dy*2.80,z+dz*2.80],[x-.23,y+dy*3.30,z+dz*3.30],
        [x+.35,y+dy*3.30,z+dz*3.30],[x+.54,y+dy*2.80,z+dz*2.80]],.13,T.cream,T.creamR);
    }
    // The lower rope shelf has visible rails and braces on its reverse face.
    for(const yy of[5.19,9.89])S.beam([1.99,yy,1.49],[4.32,yy,3.22],T.oakR,.29);
    for(const xx of[2.13,3.03,3.93])S.box(xx,xx+.59,4.90,10.17,3.14,3.47,T.oak,T.oakR,T.oakHi);
    coil(S,3.20,7.30,3.47,.98,1.61,3);
    cord(S,[[4.18,7.30,3.61],[4.33,8.80,3.57],[4.52,9.37,2.39],[4.47,10.20,.17]],.14,T.rope,T.ropeR);
    loopXY(S,13.17,10.94,.18,1.15,1.75,.15,T.rope,T.ropeR);
    corkFloat(S,[13.17,9.89,.48],[13.17,11.22,.48],.41);
    cord(S,[[13.17,9.41,.18],[13.17,9.89,.48],[13.17,11.22,.48],[13.17,12.28,.18]],.12,T.ropeHi,T.ropeR);
  }

  // A convex polygon in the y/z plane is extruded in x, including its edges.
  function ironPlate(S,x0,x1,points,front,side) {
    S.poly(points.map(p=>[x0,p[0],p[1]]),side);
    S.poly(points.map(p=>[x1,p[0],p[1]]),front);
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length];
      S.poly([[x0,a[0],a[1]],[x1,a[0],a[1]],[x1,b[0],b[1]],[x0,b[0],b[1]]],T.ironHi);
    }
  }
  function anchorDisplay(S) {
    const x=2.91,y=7.65;
    stonePad(S,.84,5.08,3.38,11.91,.80);
    for(const yy of[4.49,10.67])S.box(1.53,4.32,yy-.53,yy+.53,.92,1.53,T.granite,T.graniteR,T.graniteHi);
    // Crown touches the central stone saddle; the rear straps locate the shank.
    S.box(2.27,3.59,6.90,8.39,.92,2.18,T.granite,T.graniteR,T.graniteHi);
    rod(S,[x,y,2.18],[x,y,12.15],.40,.27,T.iron,T.ironR,T.ironHi,8);
    turn(S,x,y,2.11,2.91,.61,.46,T.iron,T.ironR,T.ironHi,10);
    for(const sign of[-1,1]){
      const points=[[x,y,2.38],[x,y+sign*1.57,2.66],[x,y+sign*2.88,3.52],
        [x,y+sign*3.63,4.94],[x,y+sign*3.76,5.63]];
      for(let i=1;i<points.length;i++)rod(S,points[i-1],points[i],.45-(i-1)*.055,.45-i*.055,T.iron,T.ironR,T.ironHi,8);
      // Broad arrow-like palms have actual thickness and taper to raised tips.
      const yy=q=>y+sign*q;
      ironPlate(S,x-.30,x+.33,[[yy(2.39),4.81],[yy(3.09),7.19],[yy(4.55),5.10],[yy(3.67),4.72]],T.iron,T.ironR);
      S.beam([x+.35,yy(3.05),5.07],[x+.35,yy(3.09),6.74],T.ironHi,.15);
    }
    // The stock runs perpendicular to the arms, visibly projecting front/back.
    S.box(.91,4.97,7.18,8.12,10.09,11.05,T.oak,T.oakR,T.oakHi);
    for(const xx of[1.35,2.59,4.30])S.box(xx,xx+.23,7.12,8.18,10.04,11.10,T.iron,T.ironR,T.ironHi);
    S.beam([1.17,7.14,10.55],[4.67,7.14,10.55],T.oakEnd,.10);
    // A forged eye and linked ring are open geometric holes in different planes.
    torus(S,[x,y,12.39],[1,0,0],[0,0,1],[0,1,0],.47,.18,T.ironHi,T.ironR,null,16,6);
    torus(S,[x,y,13.42],[0,1,0],[0,0,1],[1,0,0],.88,.19,T.iron,T.ironR,null,20,6);
    for(const yy of[6.91,8.40]){
      S.box(1.45,2.03,yy-.20,yy+.20,.92,1.20,T.iron,T.ironR,T.ironHi);
      S.beam([1.75,yy,1.18],[2.62,y,6.27],T.ironR,.27);
      bolt(S,1.74,yy,1.20);
    }
    cord(S,[[2.39,y,6.17],[2.62,y-.46,6.18],[3.27,y-.46,6.18],
      [3.43,y,6.18],[3.27,y+.46,6.18],[2.62,y+.46,6.18],[2.39,y,6.17]],.14,T.ironHi,T.ironR);
    // Small weathered patches belong to the iron, not freestanding particles.
    S.beam([x+.37,y-.10,3.31],[x+.31,y-.10,4.56],T.rust,.14);
    S.beam([x+.34,y+2.40,3.30],[x+.34,y+2.90,3.78],T.rustR,.15);
    stonePad(S,11.63,14.88,9.23,13.49,.31);
    coil(S,13.24,11.50,.43,1.16,1.43,3);
  }

  function withyPot(S,x,y,z,r,h,phase) {
    const shape=[[0,1],[.18,1.035],[.43,.99],[.68,.82],[.86,.60],[1,.47]];
    const radius=t=>{
      for(let i=1;i<shape.length;i++)if(t<=shape[i][0]){
        const [a,ra]=shape[i-1],[b,rb]=shape[i];return r*(ra+(rb-ra)*(t-a)/(b-a));
      }
      return r*.47;
    };
    // Broad willow base hoop rests on the flags; the base itself is also woven.
    loopXY(S,x,y,z+.15,r,r,.14,T.willow,T.willowR);
    for(let i=0;i<8;i++){
      const a=phase+i*Math.PI/8;
      cord(S,[[x+Math.cos(a)*r,y+Math.sin(a)*r,z+.15],[x,y,z+.15],
        [x-Math.cos(a)*r,y-Math.sin(a)*r,z+.15]],.095,T.willowR,T.willowR);
    }
    for(let i=0;i<16;i++){
      const a=phase+i*Math.PI/8;
      curve(S,t=>[x+Math.cos(a)*radius(t),y+Math.sin(a)*radius(t),z+.15+t*h],0,1,10,.11,
        i%4===0?T.willowHi:T.willow,i<8?T.willowR:T.willow);
    }
    // Horizontal weavers pass alternately in/out of the ribs; gaps are real.
    for(const t of[.11,.23,.36,.49,.62,.75,.87])curve(S,a=>{
      const rr=radius(t)+Math.cos((a-phase)*16)*.04;
      return [x+Math.cos(a)*rr,y+Math.sin(a)*rr,z+.15+t*h];
    },phase,phase+Math.PI*2,32,.095,T.willow,T.willowR);
    const neck=r*.47,top=z+.15+h;
    loopXY(S,x,y,top,neck,neck,.14,T.willowHi,T.willowR);
    // The entrance turns inward and downward into an open tapering funnel.
    for(let i=0;i<12;i++){
      const a=phase+i*Math.PI/6;
      curve(S,t=>[x+Math.cos(a)*neck*(1-.58*t),y+Math.sin(a)*neck*(1-.58*t),top-h*.42*t],0,1,5,.085,T.willowHi,T.willowR);
    }
    for(const t of[.35,.72,1])loopXY(S,x,y,top-h*.42*t,neck*(1-.58*t),neck*(1-.58*t),.08,T.willow,T.willowR);
    // One deliberately off-centre binding identifies each pot's reverse view.
    const a=phase+.38;
    curve(S,t=>[x+Math.cos(a+t*.045)*radius(t),y+Math.sin(a+t*.045)*radius(t),z+.16+t*h],.12,.60,7,.14,T.rope,T.ropeR);
  }
  function withyPots(S) {
    withyPot(S,2.91,5.62,.018,1.83,5.24,.21);
    withyPot(S,13.20,9.25,.018,1.54,4.13,.78);
    // Rope is tied around the large pot's lower hoop and gathered behind it.
    loopXY(S,2.91,5.62,.66,1.87,1.87,.14,T.rope,T.ropeR);
    cord(S,[[4.71,6.12,.66],[4.79,7.35,.37],[4.60,9.18,.16],[4.26,11.03,.16],[4.14,12.70,.16]],.14,T.rope,T.ropeR);
    coil(S,2.91,12.70,.021,1.23,1.49,3);
    cord(S,[[12.94,10.74,.47],[12.42,11.41,.19],[12.04,12.30,.42],[12.05,13.68,.42],[12.69,14.27,.16]],.12,T.rope,T.ropeR);
    corkFloat(S,[12.04,12.30,.42],[12.05,13.68,.42],.40);
    corkFloat(S,[13.65,12.50,.39],[14.57,13.40,.39],.36);
    cord(S,[[12.69,14.27,.16],[13.34,14.36,.16],[14.76,13.58,.16],[14.57,13.40,.39],
      [13.65,12.50,.39],[13.21,12.22,.16]],.12,T.ropeHi,T.ropeR);
  }

  function netDryingRack(S) {
    const postX=2.23;
    for(const yy of[2.90,12.55]){
      S.box(.80,4.92,yy-.49,yy+.49,.02,.59,T.oak,T.oakR,T.oakHi);
      S.box(postX-.29,postX+.29,yy-.29,yy+.29,.59,14.46,T.oak,T.oakR,T.oakHi);
      S.beam([1.03,yy,.62],[postX-.17,yy,4.83],T.oakR,.33);
      S.beam([4.69,yy,.62],[postX+.17,yy,5.49],T.oak,.36);
      S.box(postX-.38,postX+.38,yy-.37,yy+.37,1.13,1.59,T.iron,T.ironR,T.ironHi);
    }
    S.box(1.87,2.63,2.42,13.08,13.46,14.12,T.oak,T.oakR,T.oakHi);
    S.beam([2.05,3.09,10.65],[2.05,5.67,13.49],T.oakR,.37);
    S.beam([2.05,12.34,11.34],[2.05,10.37,13.49],T.oakR,.37);
    for(const yy of[2.91,12.54])rod(S,[1.76,yy,13.80],[2.74,yy,13.80],.14,.14,T.oakEnd,T.oakR,T.oakHi,6);
    const point=(u,v)=>[2.95+.25*Math.sin(Math.PI*u)*Math.sin(Math.PI*v),
      3.43+8.42*u,4.31+8.20*v-.43*Math.sin(Math.PI*u)];
    // Four boundary ropes terminate in explicit wraps around the timber posts.
    for(const v of[0,1])curve(S,u=>point(u,v),0,1,20,.145,T.rope,T.ropeR);
    for(const u of[0,1])curve(S,v=>point(u,v),0,1,12,.13,T.netHi,T.netR);
    for(const [u,yy]of[[0,2.90],[1,12.55]])for(const v of[0,1]){
      const p=point(u,v),z=p[2];
      cord(S,[p,[2.83,yy,z],[2.23,yy-.38,z],[1.84,yy,z+.10],[2.23,yy+.38,z+.17],[2.83,yy,z]],.14,T.rope,T.ropeR);
    }
    // Two clipped families of diagonal cord form actual open diamond holes.
    // Normalized clipping keeps every cut strand attached to a boundary rope.
    for(let i=-6;i<=6;i++){
      const k=i/6,a=Math.max(0,-k),b=Math.min(1,1-k);
      if(b>a)curve(S,t=>point(t,t+k),a,b,12,.087,T.net,T.netR);
    }
    for(let i=1;i<12;i++){
      const k=i/6,a=Math.max(0,k-1),b=Math.min(1,k);
      if(b>a)curve(S,t=>point(t,k-t),a,b,12,.087,T.netHi,T.netR);
    }
    // The head rope is tied to the top rail; corks sit on that rope.
    for(const u of[.06,.23,.40,.57,.74,.91]){
      const p=point(u,1);
      cord(S,[p,[2.81,p[1],13.55],[2.15,p[1],14.26],[1.76,p[1],13.70],[2.25,p[1],13.35],p],.115,T.rope,T.ropeR);
      corkFloat(S,[p[0],p[1]-.30,p[2]],[p[0],p[1]+.30,p[2]],.24);
    }
    // A folded mesh edge drapes forward from the far end and returns to the
    // existing foot rope. It has its own open cells, with no filled green sheet.
    const folded=(u,v)=>[3.04+1.08*Math.sin(Math.PI*u),11.16+.83*u,4.25+8.24*v];
    for(const u of[0,.33,.67,1])curve(S,v=>folded(u,v),0,1,14,.09,T.netR,T.netR);
    for(let j=0;j<=7;j++)curve(S,u=>folded(u,j/7),0,1,12,.10,T.net,T.netR);
    for(const v of[0,1]){
      cord(S,[point(.918,v),folded(0,v)],.12,T.net,T.netR);
      cord(S,[folded(1,v),point(1,v)],.12,T.net,T.netR);
    }
    // Small reserve float line hangs on a separately pegged cleat at the rear.
    rod(S,[1.56,12.53,8.42],[2.86,12.53,8.42],.18,.18,T.oak,T.oakR,T.oakHi,8);
    curve(S,a=>[1.46,12.53+.57*Math.cos(a),6.80+1.68*Math.sin(a)],0,Math.PI*2,28,.13,T.rope,T.ropeR);
    corkFloat(S,[1.46,12.05,6.13],[1.46,12.05,6.91],.25);
    corkFloat(S,[1.46,13.01,6.34],[1.46,13.01,7.12],.25);
    coil(S,13.08,6.17,.023,1.40,2.12,3);
    corkFloat(S,[13.28,7.87,.40],[14.39,8.44,.40],.37);
    cord(S,[[14.48,6.17,.16],[14.82,7.34,.16],[14.39,8.44,.40],[13.28,7.87,.40],[12.76,8.19,.16]],.12,T.rope,T.ropeR);
  }

  const builders=Object.freeze({mooringBitts,quayCapstan,lifebuoyStand,anchorDisplay,withyPots,netDryingRack});
  function moduleSprite(theme,view) {
    const S=Scene(1,view,72,92);
    pathBase(S);builders[theme](S);
    return S.finish({theme,design:'british-quayside-details-'+theme,pathAxis:'y',minimumClearPath:5.4,
      clearWalkStrip:[5.3,10.7],features:FEATURES[theme],lightPolicy:'non-emissive',
      physicalLampCount:0,family:'quayside017'});
  }
  function buildAll() {
    const modules={};
    for(const theme of themes)for(let view=0;view<4;view++)modules[theme+'_'+view]=moduleSprite(theme,view);
    return {modules};
  }
  root.BritishQuaysideArchitecture017=Object.freeze({buildAll,themes});
})(typeof window==='undefined'?globalThis:window);
