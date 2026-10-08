/* GPT-019: original, code-native waterfront cultural-quarter path kit.
 * Eight dry-land modules, four complete world-geometry views each. No copied
 * hall/furniture pixels, image input, font, RNG, storage or simulation state.
 * Only the unchanged Scene/C/cylinder raster infrastructure is shared.
 *
 * One cell is 16 world units; all leaves are 72x92, ax36/ay90, sz1. Surfaces
 * remain within that cell. A 5.4-unit walking cross joins all open edges;
 * the timber shelter spans it above 12.8 units of clear headroom.
 * The arrival and promenade leaves have no above-ground obstacles at all.
 * One physical harbour lantern is the sole emitter. Its actual opaque glass
 * panes share the day/night depth buffer, so neither hidden panes nor empty
 * space can emit. All other leaves have completely transparent night masks.
 *
 * Canonical inventory is exactly 8x4=32. Private, identity-keyed ground/raised
 * layers reproduce each canonical image using the same geometric depth owner.
 * These layers never become atlas leaves. Connection trim remains a private
 * renderer concern; paving/clearance metadata describes the common crossing.
 * Source and geometry mathematics may be checked locally. Actual painting,
 * pixel checks, screenshots and game execution belong to isolated Actions.
 */
(function (root) {
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw new Error('BritishComplexPrimitives014 must load before waterfront-quarter art');
  const {Scene,C,cylinder}=H;
  const THEMES=Object.freeze(['arrivalCourt','brickPromenade','quayEdgeWalk','quayCorner',
    'heritageDisplay','watersideBench','harbourLantern','timberShelter']);
  const T=Object.freeze({
    flag:C('beb9a7'),flagHi:C('cdc6b2'),flagR:C('afa997'),joint:C('999e92'),
    limestone:C('c7c1a9'),limestoneHi:C('e0d5b8'),limestoneR:C('9eaa9b'),
    granite:C('9faa9f'),graniteHi:C('c4c9b8'),graniteR:C('788b81'),
    brick:C('ad7059'),brickHi:C('bf8568'),brickR:C('955e4c'),mortar:C('907d68'),
    oak:C('a78b5f'),oakHi:C('cab080'),oakR:C('7e684b'),oakEnd:C('987951'),
    iron:C('35564c'),ironHi:C('688273'),ironR:C('29443e'),ironEdge:C('8e9e86'),
    slate:C('566b73'),slateHi:C('6f8389'),slateR:C('405a64'),slateJoint:C('344c56'),
    brass:C('b29b64'),brassHi:C('d2bd82'),brassR:C('89784f'),
    enamel:C('dfd5b9'),enamelR:C('b4b499'),map:C('6b8a8a'),mapR:C('4b6e73'),
    soil:C('675d49'),leaf:C('658058'),leafHi:C('8a9e6b'),leafR:C('486c50'),
    flower:C('d1bb84'),glass:C('cabb8a'),glassR:C('9d9e80'),glassHi:C('e4d6a1'),
    warm:C('f4cb88'),warmR:C('dcb276'),warmHi:C('ffe1a3')
  });
  const FEATURES=Object.freeze({
    arrivalCourt:Object.freeze(['open-limestone-entry-court','flush-brick-threshold',
      'inlaid-harbour-compass','paired-flush-granite-corners','unobstructed-crossing']),
    brickPromenade:Object.freeze(['continuous-red-brick-walking-spine','staggered-brick-courses',
      'limestone-guide-bands','flush-side-drain','unobstructed-crossing']),
    quayEdgeWalk:Object.freeze(['continuous-granite-shore-coping','low-open-iron-rail',
      'bolted-rail-shoes','stone-side-bay','open-inland-walking-strip']),
    quayCorner:Object.freeze(['chamfered-lookout-corner','returned-low-iron-railing',
      'corner-stone-rest-ledge','flush-direction-inlay','clear-central-turning-square']),
    heritageDisplay:Object.freeze(['low-sloping-interpretation-table','original-inlaid-harbour-map',
      'paired-braced-iron-supports','bolted-enamel-frame','small-side-object-plinth']),
    watersideBench:Object.freeze(['slatted-oak-seat-and-back','curved-iron-armrests',
      'braced-iron-feet','low-brick-herb-planter','restrained-contained-planting']),
    harbourLantern:Object.freeze(['single-visible-day-lantern','fluted-cast-iron-column',
      'four-opaque-physical-glass-panes','pyramidal-metal-cap','bolted-granite-base']),
    timberShelter:Object.freeze(['open-one-bay-timber-pavilion','four-braced-side-posts',
      'individually-jointed-slate-roof','open-centre-with-headroom','side-rest-bench',
      'physical-gutter-and-downpipe'])
  });
  const freezeRect=r=>Object.freeze(r);
  const obstructionSets={
    arrivalCourt:[],brickPromenade:[],
    quayEdgeWalk:[[.38,2.35,0,16]],
    quayCorner:[[.38,2.35,0,16],[2.35,4.92,.38,2.35],[2.12,4.94,2.30,4.85]],
    heritageDisplay:[[.88,4.99,.71,5.04],[1.21,4.79,12.31,15.08]],
    watersideBench:[[.79,4.99,.77,4.98],[.72,4.99,11.76,15.48]],
    harbourLantern:[[1.02,4.68,1.02,4.78]],
    timberShelter:[[.39,1.81,2.79,4.21],[14.19,15.61,2.79,4.21],
      [.39,1.81,11.79,13.21],[14.19,15.61,11.79,13.21],[1.50,5.25,11.07,14.92]]
  };
  const CLEARANCE=Object.freeze(Object.fromEntries(THEMES.map(theme=>[theme,Object.freeze({
    coordinateSpace:'unrotated-local-16',
    corridor:Object.freeze({x0:5.3,x1:10.7,y0:0,y1:16,minimumWidth:5.4,
      minimumHeadroom:theme==='timberShelter'?12.8:null}),
    centre:freezeRect([5.3,10.7,5.3,10.7]),
    openEdges:Object.freeze(theme==='quayEdgeWalk'||theme==='quayCorner'?[0,1,2]:[0,1,2,3]),
    pathSegments:Object.freeze([freezeRect([5.3,10.7,0,16]),
      freezeRect([theme==='quayEdgeWalk'||theme==='quayCorner'?5.3:0,16,5.3,10.7])]),
    obstacleRects:Object.freeze(obstructionSets[theme].map(freezeRect)),
    overhead:theme==='timberShelter'?Object.freeze({rect:freezeRect([.40,15.60,2.25,14.95]),
      lowestSurface:12.8}):null
  })])));
  const metadata=Object.freeze({
    family:'waterfrontQuarter019',canonicalLeafCount:32,tileWorldSize:16,
    geometry:Object.freeze({w:72,h:92,ax:36,ay:90,sz:1}),
    toolIds:Object.freeze(THEMES.map(theme=>theme+'019')),
    palette:T,walkClearance:CLEARANCE,
    paving:Object.freeze({coordinateSpace:'unrotated-local-16',surfaceHeight:0,
      centre:freezeRect([5.3,10.7,5.3,10.7]),spine:freezeRect([4.94,11.06,0,16]),
      connectorHalfWidth:2.7,centreRole:'red-brick-continuous-connection',
      borderRole:'flush-limestone-guide-band',shoulderRole:'warm-flagstone',
      centreColor:T.brick,borderColor:T.limestoneHi,shoulderColor:T.flag,
      jointColor:T.mortar,guideWidth:.30,minimumWalkingWidth:5.4,
      portOrder:Object.freeze(['north','east','south','west']),portDirections:Object.freeze([0,1,2,3])}),
    physicalLampCounts:Object.freeze(Object.fromEntries(THEMES.map(t=>[t,t==='harbourLantern'?1:0]))),
    lightPolicy:'harbourLantern-only-opaque-physical-panes-shared-depth',
    viewPolicy:'independent-complete-world-geometry-raster-per-view',
    privateLayers:Object.freeze({storage:'WeakMap-keyed-by-canonical-sprite',
      ground:'full-opaque-paving-and-flush-detail',raised:'canonical-day-depth-owned-furniture',
      raisedNight:'canonical-emission-depth-owned-furniture',groundMaxHeight:.10})
  });

  const layerCache=new WeakMap();
  const GROUND_OWNER=0x010101,RAISED_OWNER=0x020202;
  function raisedLayer(source,owners,w,h) {
    const result=document.createElement('canvas');result.width=w;result.height=h;
    const context=result.getContext('2d'),pixels=context.createImageData(w,h);
    const original=source.getContext('2d').getImageData(0,0,w,h).data;
    for(let i=0;i<original.length;i+=4){
      if(owners[i]!==2||owners[i+3]!==255)continue;
      pixels.data[i]=original[i];pixels.data[i+1]=original[i+1];
      pixels.data[i+2]=original[i+2];pixels.data[i+3]=original[i+3];
    }
    context.putImageData(pixels,0,0);return result;
  }
  function layeredScene(view) {
    const full=Scene(1,view,72,92),ground=Scene(1,view,72,92),owner=Scene(1,view,72,92);
    function draw(method,args,maxZ,colorSlots) {
      const isGround=maxZ<=.10,mark=isGround?GROUND_OWNER:RAISED_OWNER,owned=args.slice();
      // Every material authored here is opaque. Preserve omitted top faces,
      // original bias and exact point order in the second geometric channel.
      for(const i of colorSlots)owned[i]=args[i]===null?null:mark;
      full[method](...args);owner[method](...owned);
      if(isGround)ground[method](...args);
    }
    return {
      poly(points,color,bias){draw('poly',[points,color,bias],Math.max(...points.map(p=>p[2])),[1]);},
      flat(x0,x1,y0,y1,z,color,bias){draw('flat',[x0,x1,y0,y1,z,color,bias],z,[5]);},
      wall(a,b,z0,z1,color,bias){draw('wall',[a,b,z0,z1,color,bias],Math.max(z0,z1),[4]);},
      box(x0,x1,y0,y1,z0,z1,front,side,top){
        draw('box',[x0,x1,y0,y1,z0,z1,front,side,top],Math.max(z0,z1),[6,7,8]);
      },
      beam(a,b,color,width){
        draw('beam',[a,b,color,width],Math.max(a[2],b[2])+(width===undefined?.35:width)/2,[2]);
      },
      finish(meta){
        const sprite=full.finish(meta),floor=ground.finish(),ownership=owner.finish();
        const owners=ownership.img.getContext('2d').getImageData(0,0,72,92).data;
        // Raised layers copy canonical pixels only where raised geometry owns
        // the full depth buffer. A ground-only draw plus these opaque pixels
        // therefore equals canonical painting, including low fixture bases.
        layerCache.set(sprite,Object.freeze({ground:floor.img,
          raised:raisedLayer(sprite.img,owners,72,92),
          raisedNight:raisedLayer(sprite.night,owners,72,92)}));
        return sprite;
      }
    };
  }
  function layersFor(sprite) {
    return layerCache.get(sprite)||null;
  }

  const mod=(v,n)=>((v%n)+n)%n;
  function flags(x,y) {
    const row=Math.floor(y/4),u=x+(row%2)*2;
    if(mod(y,4)<.14||mod(u,4)<.13)return T.joint;
    const course=mod(Math.floor(u/4)+row*2,7);
    return course===0?T.flagHi:course===4?T.flagR:T.flag;
  }
  function redBricks(x,y) {
    // A sixteen-unit repeat lets the next paid tile continue the same courses.
    const row=Math.floor(y),u=x+(row%2);
    if(mod(y,1)<.11||mod(u,2)<.10)return T.mortar;
    const course=mod(Math.floor(u/2)+row*3,8);
    return course===1?T.brickHi:course===6?T.brickR:T.brick;
  }
  function masonry(front) {
    return (x,y,z)=>{
      const u=front?x:y,row=Math.floor(z/.85);
      if(mod(z,.85)<.10||mod(u+(row%2),2)<.10)return T.mortar;
      return front?T.brick:T.brickR;
    };
  }
  function quarterPaving(S,arrival) {
    S.flat(0,16,0,16,0,flags);
    if(!arrival){
      S.flat(4.94,11.06,0,16,.009,redBricks);
      S.flat(4.61,4.91,0,16,.012,T.limestoneHi);
      S.flat(11.09,11.39,0,16,.012,T.limestoneHi);
    }
    // Recessed joints are colour on the flush stone, never little raised walls.
    for(const x of[.14,15.12])for(let j=0;j<8;j++)
      S.flat(x,x+.72,j*2+.10,j*2+1.90,.012,j%3===1?T.graniteHi:T.granite);
  }
  function plinth(S,x0,x1,y0,y1,h) {
    S.box(x0,x1,y0,y1,.02,h,T.granite,T.graniteR,T.graniteHi);
    S.box(x0+.13,x1-.13,y0+.13,y1-.13,h,h+.12,T.limestone,T.graniteR,T.limestoneHi);
  }
  function turn(S,x,y,z0,z1,r0,r1,front,side,top,n) {
    cylinder(S,x,y,z0,z1,r0,r1,front,side,top,n||10);
  }
  function bolt(S,x,y,z) {
    turn(S,x,y,z,z+.16,.13,.13,T.ironEdge,T.ironR,T.ironHi,6);
  }
  function strip(S,points,color,width) {
    for(let i=1;i<points.length;i++)S.beam(points[i-1],points[i],color,width);
  }
  function compassInlay(S,x,y,r,z) {
    const centre=[x,y,z],directions=[[0,-1],[1,0],[0,1],[-1,0]];
    for(let i=0;i<directions.length;i++){
      const [dx,dy]=directions[i],tip=[x+dx*r,y+dy*r,z];
      S.poly([centre,tip,[x-dy*r*.24,y+dx*r*.24,z]],i===0?T.brassHi:T.graniteHi);
      S.poly([centre,[x+dy*r*.24,y-dx*r*.24,z],tip],i===0?T.brassR:T.graniteR);
    }
  }
  function flushGrate(S,x0,x1,y0,y1) {
    S.flat(x0,x1,y0,y1,.02,T.ironR);
    for(let y=y0+.14;y<y1-.09;y+=.44)S.flat(x0+.12,x1-.12,y,y+.17,.027,T.ironHi);
    S.flat(x0+.09,x0+.19,y0+.10,y1-.10,.03,T.ironEdge);
  }
  function arrivalCourt(S) {
    // The entry reads as a broad court; the whole threshold is traversable.
    S.flat(.93,15.07,1.03,2.48,.025,redBricks);
    for(const y of[.72,2.57])S.flat(.76,15.24,y,y+.25,.030,T.limestoneHi);
    for(const [x,y]of[[2.12,11.45],[12.03,4.55]]){
      S.flat(x,x+1.90,y,y+2.13,.026,T.graniteR);
      S.flat(x+.18,x+1.72,y+.18,y+1.95,.03,T.graniteHi);
      S.flat(x+.53,x+1.36,y+.53,y+1.61,.034,T.flagR);
    }
    compassInlay(S,8,9.17,2.18,.025);
    S.flat(7.82,8.18,5.75,6.38,.03,T.brass);
    flushGrate(S,12.33,14.66,12.08,13.91);
  }
  function brickPromenade(S) {
    // Small flush heraldic bands distinguish the spine from the open court.
    for(const y of[.32,15.40])S.flat(4.97,11.03,y,y+.21,.025,T.brickR);
    for(const y of[3.90,11.90]){
      S.flat(3.88,4.38,y,y+.20,.023,T.brass);
      S.flat(11.62,12.12,y,y+.20,.023,T.brass);
    }
    flushGrate(S,12.55,14.76,2.32,5.63);
    S.flat(1.35,3.26,12.82,14.39,.025,T.granite);
    S.flat(1.54,3.07,13.02,14.20,.03,T.flagHi);
  }
  function railPost(S,x,y,h) {
    S.box(x-.33,x+.33,y-.33,y+.33,.53,.87,T.iron,T.ironR,T.ironHi);
    bolt(S,x-.24,y-.24,.88);bolt(S,x+.24,y+.24,.88);
    S.box(x-.18,x+.18,y-.18,y+.18,.87,h,T.iron,T.ironR,T.ironHi);
    S.box(x-.26,x+.26,y-.26,y+.26,h,h+.23,T.ironHi,T.ironR,T.ironEdge);
    turn(S,x,y,h+.23,h+.61,.24,.10,T.ironHi,T.ironR,T.ironEdge,8);
  }
  function railSegment(S,a,b) {
    S.beam([a[0],a[1],5.43],[b[0],b[1],5.43],T.ironHi,.34);
    S.beam([a[0],a[1],2.13],[b[0],b[1],2.13],T.iron,.22);
    const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.max(1,Math.round(length/1.35));
    for(let i=1;i<count;i++){
      const x=a[0]+(b[0]-a[0])*i/count,y=a[1]+(b[1]-a[1])*i/count;
      S.beam([x,y,2.15],[x,y,5.40],T.iron,.16);
    }
  }
  function straightCoping(S) {
    S.box(.40,2.30,0,16,.017,.41,T.granite,T.graniteR,T.graniteHi);
    for(let i=0;i<8;i++)S.box(.39,2.32,i*2+.05,i*2+1.94,.41,.54,
      T.granite,T.graniteR,i%3===1?T.limestoneHi:T.graniteHi);
  }
  function quayEdgeWalk(S) {
    straightCoping(S);
    const ys=[.66,5.54,10.42,15.30];
    for(const y of ys)railPost(S,1.29,y,5.61);
    for(let i=1;i<ys.length;i++)railSegment(S,[1.29,ys[i-1]],[1.29,ys[i]]);
    for(const y of[3.15,12.78]){
      S.flat(2.69,4.12,y-.49,y+.49,.028,T.limestoneHi);
      S.flat(2.88,3.93,y-.29,y+.29,.032,T.granite);
    }
    flushGrate(S,12.91,14.66,11.51,14.25);
  }
  function quayCorner(S) {
    straightCoping(S);
    // A short returned rail shapes a lookout without closing the through path.
    S.box(2.30,4.90,.40,2.30,.017,.41,T.granite,T.graniteR,T.graniteHi);
    S.box(2.30,4.92,.39,2.32,.41,.54,T.granite,T.graniteR,T.graniteHi);
    const points=[[4.60,1.29],[3.52,1.29],[1.29,3.52],[1.29,9.37],[1.29,15.30]];
    for(const [x,y]of[points[0],points[2],points[3],points[4]])railPost(S,x,y,5.61);
    for(let i=1;i<points.length;i++)railSegment(S,points[i-1],points[i]);
    // Solid triangular rest ledge follows the chamfer and stays in the bay.
    S.poly([[2.17,4.70,.02],[4.79,2.33,.02],[4.79,4.70,.02]],T.graniteR);
    S.wall([2.17,4.70],[4.79,4.70],.02,1.43,T.granite);
    S.wall([4.79,2.33],[4.79,4.70],.02,1.43,T.graniteR);
    S.wall([2.17,4.70],[4.79,2.33],.02,1.43,T.granite);
    S.poly([[2.17,4.70,1.43],[4.79,2.33,1.43],[4.79,4.70,1.43]],T.limestoneHi);
    compassInlay(S,13.05,11.39,1.41,.032);
    S.flat(11.84,14.53,13.55,13.78,.03,T.brass);
  }
  function interpretationTop(x,y) {
    // Original abstract harbour plan, encoded as material on the sloping panel.
    // These are cartographic strokes and blocks, not a font or copied hall plan.
    const u=(x-1.32)/3.18,v=(y-1.20)/3.15;
    if(u<.05||u>.95||v<.035||v>.965)return T.brass;
    if(v<.115&&u>.13&&u<.76)return T.mapR;
    if(u<.30&&v>.19&&v<.70)return T.map;
    if(u>.30&&u<.38&&v>.19&&v<.81)return T.limestoneHi;
    if(v>.64&&v<.72&&u>.31&&u<.86)return T.map;
    if(u>.48&&u<.76&&((v>.23&&v<.37)||(v>.43&&v<.56)))return T.brick;
    if(u>.47&&u<.84&&v>.82&&v<.855)return T.mapR;
    if(u>.47&&u<.73&&v>.895&&v<.922)return T.graniteR;
    return T.enamel;
  }
  function heritageDisplay(S) {
    const top=x=>5.82-(x-1.07)*.47;
    for(const y of[1.49,4.16]){
      plinth(S,1.26,4.71,y-.51,y+.51,.24);
      S.box(2.46,2.87,y-.26,y+.26,.36,4.95,T.iron,T.ironR,T.ironHi);
      S.beam([1.66,y,.38],[2.57,y,2.50],T.iron,.27);
      S.beam([4.26,y,.38],[2.77,y,3.21],T.ironHi,.28);
      S.beam([1.15,y,top(1.15)-.12],[4.73,y,top(4.73)-.12],T.iron,.26);
    }
    S.poly([[1.07,.93,top(1.07)],[4.82,.93,top(4.82)],
      [4.82,4.77,top(4.82)],[1.07,4.77,top(1.07)]],T.iron);
    S.poly([[1.32,1.20,top(1.32)+.015],[4.50,1.20,top(4.50)+.015],
      [4.50,4.35,top(4.50)+.015],[1.32,4.35,top(1.32)+.015]],interpretationTop);
    for(const y of[.93,4.77])S.beam([1.04,y,top(1.04)],[4.84,y,top(4.84)],T.ironHi,.27);
    for(const x of[1.04,4.84])S.beam([x,.93,top(x)],[x,4.77,top(x)],T.ironHi,.24);
    S.beam([2.66,1.49,4.85],[2.66,4.16,4.85],T.iron,.27);
    for(const x of[1.22,4.64])for(const y of[1.09,4.58])
      turn(S,x,y,top(x)+.025,top(x)+.12,.10,.10,T.brass,T.brassR,T.brassHi,6);
    // A small carved dock-stone sample has its own low, unlit interpretation pad.
    plinth(S,1.26,4.75,12.35,15.03,.44);
    S.box(1.91,3.91,12.91,14.46,.56,1.89,T.granite,T.graniteR,T.graniteHi);
    S.flat(2.17,3.65,13.16,14.21,1.91,T.limestoneHi);
    S.flat(2.83,2.97,13.16,14.21,1.925,T.graniteR);
    S.flat(3.04,3.65,13.75,13.89,1.93,T.graniteR);
    S.flat(3.93,4.45,12.76,14.60,.577,T.brass);
  }
  function bench(S,x0,y0,y1) {
    for(const y of[y0+.61,y1-.61]){
      S.box(x0+.10,x0+.68,y-.29,y+.29,.02,.26,T.iron,T.ironR,T.ironHi);
      S.box(x0+2.88,x0+3.46,y-.29,y+.29,.02,.26,T.iron,T.ironR,T.ironHi);
      S.beam([x0+.40,y,.26],[x0+.67,y,2.55],T.iron,.34);
      S.beam([x0+3.16,y,.26],[x0+2.91,y,2.55],T.iron,.34);
      S.beam([x0+.59,y,2.39],[x0+3.06,y,2.39],T.ironHi,.34);
      S.beam([x0+.45,y,1.34],[x0+3.17,y,1.34],T.iron,.20);
      S.beam([x0+.50,y,2.41],[x0+.18,y,5.83],T.iron,.28);
      strip(S,[[x0+.35,y,4.66],[x0+1.16,y,4.54],[x0+2.60,y,4.33],
        [x0+3.17,y,3.83],[x0+3.12,y,2.74]],T.ironHi,.26);
    }
    for(let i=0;i<4;i++){
      const x=x0+.23+i*.79;
      S.box(x,x+.65,y0,y1,2.55,2.90,T.oak,T.oakR,i%3===1?T.oakHi:T.oak);
      S.flat(x+.13,x+.22,y0+.15,y1-.15,2.915,T.oakEnd);
    }
    for(const z of[3.48,4.34,5.20]){
      const x=x0+.40-(z-3.48)*.085;
      S.box(x-.19,x+.19,y0+.06,y1-.06,z,z+.63,T.oak,T.oakR,T.oakHi);
      S.wall([x+.20,y0+.21],[x+.20,y1-.21],z+.14,z+.24,T.oakEnd,.015);
    }
  }
  function leaf(S,a,b,width,front) {
    const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1;
    const m=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
    S.poly([a,[m[0]-dy/n*width,m[1]+dx/n*width,m[2]+.13],b],front);
    S.poly([a,b,[m[0]+dy/n*width,m[1]-dx/n*width,m[2]-.10]],T.leafR);
  }
  function herb(S,x,y,z,h,phase) {
    S.beam([x,y,z],[x+.10,y-.08,z+h],T.leafR,.12);
    for(let i=0;i<4;i++){
      const angle=phase+i*2.2,zz=z+.20+i*h*.19;
      leaf(S,[x,y,zz],[x+Math.cos(angle)*.69,y+Math.sin(angle)*.72,zz+.68],.22,
        i%2?T.leaf:T.leafHi);
    }
    turn(S,x+.10,y-.08,z+h-.08,z+h+.08,.14,.16,T.flower,T.leafR,T.flower,6);
  }
  function watersideBench(S) {
    bench(S,1.13,1.07,4.69);
    S.box(.87,4.83,12.01,15.21,.02,1.64,masonry(true),masonry(false),T.soil);
    for(const x of[.85,4.37])S.box(x,x+.47,11.99,15.23,1.64,1.87,
      T.limestone,T.limestoneR,T.limestoneHi);
    for(const y of[11.99,14.76])S.box(.85,4.85,y,y+.47,1.64,1.87,
      T.limestone,T.limestoneR,T.limestoneHi);
    S.flat(1.36,4.34,12.49,14.74,1.67,T.soil);
    for(const [x,y,h,p]of[[2.02,13.12,1.87,.2],[3.32,13.02,2.18,1.4],
      [2.21,14.10,1.68,2.8],[3.58,14.09,1.90,4.3]])herb(S,x,y,1.68,h,p);
    S.flat(12.68,14.19,4.10,4.35,.027,T.brass);
  }
  function harbourLantern(S) {
    const x=2.85,y=2.90;
    plinth(S,1.07,4.63,1.07,4.73,.43);
    S.box(1.89,3.81,1.94,3.86,.55,.91,T.iron,T.ironR,T.ironHi);
    for(const dx of[-.70,.70])for(const dy of[-.70,.70])bolt(S,x+dx,y+dy,.92);
    turn(S,x,y,.91,2.05,.71,.47,T.iron,T.ironR,T.ironHi,12);
    turn(S,x,y,2.05,3.07,.47,.34,T.iron,T.ironR,T.ironHi,12);
    turn(S,x,y,3.07,18.65,.34,.25,T.iron,T.ironR,T.ironHi,12);
    for(const z of[3.08,4.01,17.41,18.59])turn(S,x,y,z,z+.27,.45,.45,T.ironHi,T.ironR,T.ironHi,12);
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;
      S.beam([x+Math.cos(a)*.35,y+Math.sin(a)*.35,4.39],
        [x+Math.cos(a)*.28,y+Math.sin(a)*.28,16.76],i%2?T.ironHi:T.ironR,.09);
    }
    turn(S,x,y,18.86,19.63,.43,.91,T.iron,T.ironR,T.ironHi,10);
    S.box(x-1.09,x+1.09,y-1.09,y+1.09,19.63,20.03,T.iron,T.ironR,T.ironHi);
    const z0=20.03,z1=23.79,r0=.79,r1=1.06;
    const glassPairs=[[T.glass,T.warm],[T.glassR,T.warmR],[T.glassHi,T.warmHi],[T.glass,T.warm]];
    const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
    for(let i=0;i<4;i++){
      const a=corners[i],b=corners[(i+1)%4];
      // The pane itself is the day surface and emission source. There is no
      // hidden light box, sprite dilation, halo or separate additive drawing.
      S.poly([[x+a[0]*r0,y+a[1]*r0,z0],[x+b[0]*r0,y+b[1]*r0,z0],
        [x+b[0]*r1,y+b[1]*r1,z1],[x+a[0]*r1,y+a[1]*r1,z1]],glassPairs[i]);
      S.beam([x+a[0]*r0,y+a[1]*r0,z0],[x+a[0]*r1,y+a[1]*r1,z1],T.iron,.18);
      S.beam([x+a[0]*r1,y+a[1]*r1,z1],[x+b[0]*r1,y+b[1]*r1,z1],T.ironHi,.21);
    }
    S.box(x-1.22,x+1.22,y-1.22,y+1.22,23.80,24.15,T.ironHi,T.ironR,T.iron);
    for(let i=0;i<4;i++){
      const a=corners[i],b=corners[(i+1)%4];
      S.poly([[x+a[0]*1.24,y+a[1]*1.24,24.16],
        [x+b[0]*1.24,y+b[1]*1.24,24.16],[x,y,25.80]],i%2?T.iron:T.ironHi);
    }
    turn(S,x,y,25.80,26.34,.28,.18,T.ironHi,T.ironR,T.ironEdge,8);
    turn(S,x,y,26.34,26.94,.18,.035,T.ironHi,T.ironR,T.ironEdge,8);
    S.flat(12.65,14.45,3.16,4.71,.027,T.granite);
    compassInlay(S,13.55,3.94,.61,.033);
  }
  function roofSlate(right) {
    return (x,y,z)=>{
      const row=Math.floor((z-14.40)*1.12),v=y+(row%2)*.86;
      if(mod((z-14.40)*1.12,1)<.12||mod(v,1.72)<.11)return T.slateJoint;
      return mod(Math.floor(v/1.72)+row,9)===2?T.slateHi:right?T.slateR:T.slate;
    };
  }
  function timberShelter(S) {
    const xs=[1.10,14.90],ys=[3.50,12.50];
    for(const x of xs)for(const y of ys){
      plinth(S,x-.62,x+.62,y-.62,y+.62,.33);
      S.box(x-.38,x+.38,y-.38,y+.38,.45,13.82,T.oak,T.oakR,T.oakHi);
      S.box(x-.45,x+.45,y-.45,y+.45,.48,1.05,T.iron,T.ironR,T.ironHi);
      const sx=x<8?1:-1,sy=y<8?1:-1;
      S.beam([x,y,9.94],[x+sx*2.12,y,13.36],T.oakHi,.49);
      S.beam([x,y,10.70],[x,y+sy*1.77,13.35],T.oak,.46);
      S.wall([x+.39,y-.18],[x+.39,y+.18],11.56,11.79,T.oakEnd,.02);
    }
    for(const y of ys)S.box(.47,15.53,y-.40,y+.40,13.22,14.41,T.oak,T.oakR,T.oakHi);
    for(const x of xs)S.box(x-.43,x+.43,2.86,13.14,13.17,14.41,T.oak,T.oakR,T.oakHi);
    for(const y of[3.01,12.99]){
      S.beam([1.17,y,14.53],[8,y,18.80],T.oakHi,.46);
      S.beam([8,y,18.80],[14.83,y,14.53],T.oak,.46);
      S.beam([8,y,13.86],[8,y,18.78],T.oak,.34);
      S.beam([5.20,y,13.88],[8,y,16.61],T.oakR,.33);
      S.beam([10.80,y,13.88],[8,y,16.61],T.oak,.33);
    }
    // The floor corridor is open; the roof is a genuinely depth-ordered solid.
    const x0=.61,x1=15.39,y0=2.31,y1=14.89,eave=14.41,ridge=19.01;
    S.poly([[x0,y0,eave],[x0,y1,eave],[8,y1,ridge],[8,y0,ridge]],roofSlate(false));
    S.poly([[8,y0,ridge],[8,y1,ridge],[x1,y1,eave],[x1,y0,eave]],roofSlate(true));
    for(const y of[y0,y1]){
      S.beam([x0,y,eave],[8,y,ridge],T.oakHi,.31);
      S.beam([8,y,ridge],[x1,y,eave],T.oak,.31);
    }
    S.beam([8,y0-.04,ridge+.07],[8,y1+.04,ridge+.07],T.slateHi,.40);
    for(const x of[x0,x1]){
      S.beam([x,y0,eave-.08],[x,y1,eave-.08],T.iron,.29);
      S.beam([x,y0,eave-.34],[x,y1,eave-.34],T.ironHi,.21);
    }
    // Small rear downpipe attaches to a post, with no runoff or water effect.
    strip(S,[[.77,12.72,14.08],[1.34,12.72,13.71],[1.48,12.72,1.21],
      [1.18,12.72,.44]],T.iron,.24);
    for(const z of[2.21,7.62,12.81])S.box(1.32,1.65,12.50,12.94,z,z+.20,T.ironHi,T.iron,T.ironHi);
    bench(S,1.75,11.17,14.82);
  }

  const builders=Object.freeze({arrivalCourt,brickPromenade,quayEdgeWalk,quayCorner,
    heritageDisplay,watersideBench,harbourLantern,timberShelter});
  function moduleSprite(theme,view) {
    const S=layeredScene(view),hasLamp=theme==='harbourLantern';
    quarterPaving(S,theme==='arrivalCourt');builders[theme](S);
    return S.finish({family:'waterfrontQuarter019',theme,toolId:theme+'019',
      design:'british-waterfront-quarter-'+theme,pathAxis:'y',minimumClearPath:5.4,
      clearWalkStrip:Object.freeze([5.3,10.7]),walkClearance:CLEARANCE[theme],
      features:FEATURES[theme],pavingRole:theme==='arrivalCourt'?'open-arrival-court':'connected-brick-spine',
      pavingCentre:metadata.paving.centre,pavingBorderRole:metadata.paving.borderRole,
      physicalLampCount:hasLamp?1:0,
      lightPolicy:hasLamp?'physical-glazing-only-shared-depth':'non-emissive'});
  }
  function buildAll() {
    const modules={};
    for(const theme of THEMES)for(let view=0;view<4;view++)
      modules[theme+'_'+view]=moduleSprite(theme,view);
    return {modules};
  }
  root.BritishWaterfrontQuarter019=Object.freeze({buildAll,THEMES,metadata,layersFor});
})(typeof window==='undefined'?globalThis:window);
