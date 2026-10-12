/* GPT-021: original hospitality candidate geometry; formal game never loads it.
 * The native carriers, footprint limits, beds/jobs and mechanisms stay unchanged.
 * Uses the unchanged approved rasterizer via the candidate-only architecture kit.
 * Every elevation is drawn in world coordinates and rotates as real geometry.
 * No registry, save, simulation, clock or RNG access; no copied bitmap or text.
 */
(function(root){
  'use strict';
  const specs=Object.freeze([
    {id:'UKH021-S',nm:'磚砌巷口客舍',group:'hotel',scale:'S',sz:1,w:80,h:116,k:81,tool:'guesthouse',floors:2,
      plan:'narrow-house-with-side-entry-and-low-laundry',roof:'steep-cross-gable-and-rear-lean-to',entry:'side-guest-door-with-front-steps',yard:'separate-rear-laundry-court',
      masses:[[1.35,11.45,4.1,13.7,.2,25.5],[10.5,14.1,1.6,5.8,.2,7.1]]},
    {id:'UKH021-M',nm:'石基院落驛館',group:'hotel',scale:'M',sz:2,w:160,h:202,k:82,tool:'hotel',floors:3,
      plan:'three-ranges-around-open-U-court',roof:'three-perpendicular-slate-gables',entry:'court-facing-hall-and-independent-guest-door',yard:'open-coaching-court-and-low-laundry-range',
      masses:[[1.8,29.8,2.1,10.5,.2,36.1],[1.8,9.3,10.5,26.2,.2,34.2],[21.6,29.8,10.5,28.2,.2,36.1],[1.8,9.3,26.2,30.2,.2,7.8]]},
    {id:'UKH021-L',nm:'城鎮孟莎頂鐵道旅館',group:'hotel',scale:'L',sz:3,w:232,h:252,k:274,tool:'stationHotel009',floors:4,
      plan:'asymmetric-H-ranges-with-open-service-court',roof:'mansard-front-and-tall-wing-plus-low-gabled-range',entry:'stone-porte-cochere-and-separate-service-entrance',yard:'rear-delivery-court-and-one-storey-service-wing',
      masses:[[3,44.3,32,43.8,.2,49.2],[3,13.1,8.1,32,.2,37.6],[31.1,44.3,17.5,32,.2,49.2],[13.1,31.1,4.2,11.5,.2,12.1]]},
    {id:'UKD021-S',nm:'山牆茶點屋',group:'dining',scale:'S',sz:1,w:80,h:102,k:196,tool:'tearoom',floors:1,
      plan:'one-room-hall-with-attic-and-rear-scullery',roof:'steep-front-gable-and-low-scullery-shed',entry:'single-front-door-with-separate-scullery-door',yard:'side-delivery-strip-and-rear-wood-court',
      functionalNote:'Native tourism landmark; no private dining/table/recipe mechanism.',
      masses:[[1.35,12.85,4.0,13.45,.2,12.65],[1.5,4.9,1.5,4.0,.2,6.0]]},
    {id:'UKD021-M',nm:'庭院轉角餐室',group:'dining',scale:'M',sz:2,w:160,h:178,k:275,tool:'refreshmentCafe009',floors:2,
      plan:'two-storey-L-restaurant-with-detached-scullery',roof:'cross-ridges-and-low-kitchen-hip',entry:'court-dining-door-and-second-frontage-door',yard:'open-preparation-court-and-separate-loading-back',
      masses:[[1.6,28.6,1.8,11.0,.2,25.5],[19.7,28.6,11.0,28.4,.2,25.5],[2.2,8.7,16.0,25.0,.2,8.9]]},
    {id:'UKD021-L',nm:'穿堂院落客棧餐館',group:'dining',scale:'L',sz:2,w:160,h:204,k:220,tool:'foxFinchPub',floors:3,
      plan:'three-storey-front-with-real-passage-and-two-service-ranges',roof:'long-main-gable-perpendicular-wing-and-low-hip',entry:'open-coaching-passage-with-independent-pub-door',yard:'enclosed-kitchen-delivery-court',
      functionalNote:'Larger architectural mass on native 2x2 pub footprint; no 3x3 dining carrier or added beds.',
      masses:[[1.5,17.3,18.7,29.7,.2,36.3],[22.4,29.5,18.7,29.7,.2,36.3],[17.3,22.4,18.7,29.7,11.5,36.3],[1.5,11.0,3.0,18.7,.2,23.5],[15.0,29.5,2.0,9.6,.2,11.8]]},
    {id:'UKM021-S',nm:'石砌單廳農貿市場',group:'market',scale:'S',sz:2,w:160,h:150,k:87,tool:'market',floors:1,
      plan:'single-stone-hall-and-low-receiving-annex',roof:'single-long-gable-with-side-shed',entry:'two-ended-hall-doors',yard:'side-receiving-strip-and-front-forecourt',
      functionalNote:'Native agricultural-market coverage; not the private-retail market mechanism.',
      masses:[[3.0,25.5,7.0,25.0,.2,18.5],[25.5,29.4,10.0,20.0,.2,6.7]]},
    {id:'UKM021-M',nm:'雙跨玻璃室內市場',group:'market',scale:'M',sz:3,w:232,h:212,k:240,tool:'coveredMarket',floors:1,
      plan:'two-separate-glazed-halls-and-low-crosswise-headhouse',roof:'two-parallel-unequal-glass-ridges-with-low-front-hip',entry:'central-headhouse-door-and-rear-loading-door',yard:'clear-central-delivery-spine-and-rear-loading-court',
      functionalNote:'Alternative art for k240; mutually exclusive with retail UKU021-L on the same carrier.',
      masses:[[2.3,20.9,7.0,35.5,.2,20.4],[25.9,44.5,11.0,35.5,.2,24.5],[2.3,44.5,35.5,44.2,.2,13.0]]},
    {id:'UKM021-L',nm:'四翼環院拱廊市場',group:'market',scale:'L',sz:3,w:232,h:226,k:278,tool:'riversideArcade012',floors:2,
      plan:'closed-quadrangle-with-open-sky-and-true-arcade-voids',roof:'front-mansard-low-side-hips-and-rear-gable',entry:'front-through-arch-and-independent-rear-loading-door',yard:'real-open-court-with-clear-centre-and-perimeter-stalls',
      masses:[[2.0,21.2,35.5,44.5,.2,32.5],[26.8,46.0,35.5,44.5,.2,32.5],[21.2,26.8,35.5,44.5,12.2,32.5],[2.0,10.0,10.5,35.5,.2,15.2],[38.0,46.0,10.5,35.5,.2,15.2],[10.0,38.0,2.0,10.5,.2,16.5]]}
  ].map(s=>Object.freeze({...s,masses:Object.freeze(s.masses.map(m=>Object.freeze(m)))})));

  function trim(c,W,levels){
    for(const F of Object.values(W)){
      for(const z of levels)c.course(F,z);
      for(const u of[.12,F.length-.55])F.block(u,u+.43,.01,.28,.7,levels[levels.length-1]-.4,c.P.stone,c.P.stoneR,c.P.stoneHi);
    }
  }
  function sashRows(c,F,rows,bays,z0,w,h,skip){
    for(let f=0;f<rows;f++)for(let b=0;b<bays;b++){
      if(f===0&&skip&&skip.includes(b))continue;
      c.K.sash(c.S,F,F.length*(b+.5)/bays-w/2,z0+f*11.2,w,h||6.8,(b+f)%3!==1);
    }
  }
  function rain(c,x,y,z){c.K.rainpipe(c.S,x,y,z);}
  function dormer(c,x,y,z,back){
    const W=c.walls(x-1.65,x+1.65,y-1.4,y+1.4,z,z+4.6,21370,'stone');
    c.K.sash(c.S,back?W.back:W.front,.55,z+.7,2.15,3.15,true);
    c.gable(x-1.88,x+1.88,y-1.64,y+1.64,z+4.8,2.0,false);
  }
  function linenCourt(c,x0,x1,y0,y1){
    c.S.flat(x0,x1,y0,y1,.03,c.K.paving);
    for(const x of[x0+.7,x1-.7])c.S.beam([x,y0+.7,.1],[x,y0+.7,4.8],c.P.wood,.26);
    c.S.beam([x0+.7,y0+.7,4.6],[x1-.7,y0+.7,4.6],c.P.ironD,.16);
    // Sheets have their own supported world-space plane, never a floating label.
    for(let x=x0+1.25;x<x1-1.5;x+=1.8)c.S.wall([x,y0+.72],[x+1.25,y0+.72],2.9,4.4,c.P.paper);
  }
  function guesthouse(c){
    const {S,K,P}=c,A=c.walls(1.35,11.45,4.1,13.7,.2,25.5,21301);
    trim(c,A,[.6,12.7,25.0]);
    sashRows(c,A.front,2,2,3.1,3.15,6.9);
    sashRows(c,A.back,2,2,3.1,2.7,6.6,[0]);
    sashRows(c,A.right,2,2,3.1,2.8,6.6,[0]);
    sashRows(c,A.left,2,2,3.1,2.8,6.6);
    c.door(A.right,6.1,2.7,9.6,true);c.door(A.back,6.8,2.15,7.9,false);
    c.gable(1.06,11.74,3.83,13.98,25.75,7.0,false);
    c.chimney(3.15,7.7,31.6,2);
    const B=c.walls(10.5,14.1,1.6,5.8,.2,7.1,21302);
    c.shed(10.25,14.35,1.4,6.02,7.35,2.3);
    c.door(B.back,.55,2.0,5.6,false);K.sash(S,B.right,.8,2.2,2.2,3.2,true);
    linenCourt(c,1.5,9.5,1.2,3.65);
    c.fence(1.35,1.15,8.1,1.15,2.7);c.fence(1.2,1.2,1.2,3.65,2.7);
    S.flat(11.8,14.5,6.2,14.1,.05,P.paveHi);
    for(let n=0;n<2;n++)S.box(11.48,12.08+n*.55,6.3,9.3,.1,.22*(2-n),P.stoneR,P.stoneD,P.stone);
    c.lamps(A.right,5.75,9.7);c.lamps(A.back,5.4,8.5);rain(c,1.1,13.75,25.3);
    c.crates(5.8,1.9,2);
  }
  function coachingInn(c){
    const {S,K,P}=c,A=c.walls(1.8,29.8,2.1,10.5,.2,36.1,21401,'stone'),
      B=c.walls(1.8,9.3,10.5,26.2,.2,34.2,21402),C=c.walls(21.6,29.8,10.5,28.2,.2,36.1,21403);
    for(const [W,h]of[[A,36.1],[B,34.2],[C,36.1]])trim(c,W,[.7,12.5,23.7,h-.6]);
    sashRows(c,A.front,3,5,3.2,3.3,6.8,[2]);sashRows(c,A.back,3,5,3.2,3.2,6.6,[0]);
    for(const F of[A.left,A.right])sashRows(c,F,3,1,3.2,3.0,6.7);
    for(const F of[B.left,B.right])sashRows(c,F,3,3,3.1,2.9,6.8,F===B.right?[1]:[]);
    for(const F of[C.left,C.right])sashRows(c,F,3,3,3.2,3.1,6.8,F===C.left?[1]:[]);
    for(const F of[B.front,C.front])sashRows(c,F,3,1,3.2,3.0,6.6);
    c.door(A.front,11.8,4.4,10.3,true);c.loading(A.back,23.0,4.4,9.4);
    c.door(B.right,6.8,2.65,9.0,true);c.door(C.left,7.2,2.8,9.0,true);
    // Projected hall canopy and two stone columns frame the actual court door.
    for(const x of[13.0,18.6])K.cylinder(S,x,12.15,.2,10.7,.38,.32,P.stone,P.stoneR,P.stoneHi,8);
    S.flat(12.35,19.25,10.45,12.75,10.9,P.lead);
    c.gable(1.48,30.12,1.78,10.78,36.45,7.6,true);
    c.gable(1.5,9.6,10.45,26.5,34.55,6.2,false);
    c.gable(21.3,30.1,10.45,28.5,36.45,6.6,false);
    c.chimney(5.0,6.2,43.6,3);c.chimney(25.6,20.3,43.0,2);
    const D=c.walls(1.8,9.3,26.2,30.2,.2,7.8,21404);
    c.shed(1.53,9.58,26.2,30.42,8.0,2.3);c.loading(D.front,2.0,3.9,6.8);
    K.sash(S,D.right,.75,2.2,2.3,3.6,true);
    S.flat(9.6,21.2,12.8,30.4,.04,(x,y)=>K.mod(x+y,3)<.13?P.seam:P.paveHi);
    c.fence(10.0,30.65,13.2,30.65,2.6);c.fence(20.4,30.65,28.8,30.65,2.6);
    c.crates(10.7,13.6,3);linenCourt(c,10.0,15.5,23.0,26.0);
    c.lamps(B.right,12.1,8.9);c.lamps(C.left,12.5,9.1);c.lamps(A.back,18.6,9.5);
    rain(c,1.56,22.7,33.8);rain(c,30.02,28.1,35.8);
  }
  function railwayHotel(c){
    const {S,K,P}=c,A=c.walls(3,44.3,32,43.8,.2,49.2,21501),
      B=c.walls(3,13.1,8.1,32,.2,37.6,21502),C=c.walls(31.1,44.3,17.5,32,.2,49.2,21503),
      D=c.walls(13.1,31.1,4.2,11.5,.2,12.1,21504);
    for(const [W,h]of[[A,49.2],[B,37.6],[C,49.2]])trim(c,W,[.7,12.5,23.7,34.9,h-.7].filter(z=>z<h));
    sashRows(c,A.front,4,7,3.2,3.5,7.0,[3]);sashRows(c,A.back,4,7,3.2,3.2,6.8,[2]);
    for(const F of[A.left,A.right])sashRows(c,F,4,2,3.2,3.0,6.8);
    for(const F of[B.left,B.right])sashRows(c,F,3,4,3.3,3.1,7.0,F===B.right?[0]:[]);
    for(const F of[B.front,B.back])sashRows(c,F,3,2,3.3,3.0,6.8);
    for(const F of[C.left,C.right])sashRows(c,F,4,2,3.2,3.2,6.8,F===C.left?[0]:[]);
    sashRows(c,C.back,4,2,3.2,3.2,6.8);sashRows(c,C.front,4,2,3.2,3.2,6.8);
    c.door(A.front,17.9,5.5,11.3,true);c.door(A.back,17.9,4.2,9.8,true);
    c.door(B.right,20.3,2.7,9.5,false);c.door(C.left,10.8,2.8,10.2,true);
    for(const F of[D.front,D.back])sashRows(c,F,1,3,3.0,3.1,6.0,[1]);
    sashRows(c,D.left,1,1,3,2.6,6);sashRows(c,D.right,1,1,3,2.6,6);
    c.loading(D.back,7.1,4.6,9.3);c.door(D.front,7.6,3.2,8.7,false);
    c.mansard(2.66,44.64,31.66,44.1,49.55,10.2,2.4);
    c.mansard(30.77,44.64,17.2,31.9,49.55,10.2,2.2);
    c.gable(2.68,13.42,7.78,31.9,37.95,7.1,false);
    c.hip(12.8,31.4,3.9,11.8,12.45,3.8,true);
    for(const x of[9.3,16.3,30.8,38.3])dormer(c,x,42.0,51.7,false);
    for(const y of[21.9,27.5]){
      const W=c.walls(42.1,44.2,y-1.5,y+1.5,51.5,55.8,21507,'stone');
      K.sash(S,W.right,.45,52.2,2.1,3.0,true);c.gable(41.8,44.45,y-1.75,y+1.75,56.0,1.7,true);
    }
    c.chimney(5.1,36.2,58.7,3);c.chimney(36.7,22.2,58.6,3);c.chimney(7.9,15.0,44.4,2);
    // A supported stone porte-cochere distinguishes the railway hotel's entry
    // from both the retail tunnel and the old approved hotel's solid hip block.
    for(const x of[18.95,27.3])for(const y of[44.4,46.15]){
      K.cylinder(S,x,y,.2,11.75,.37,.32,P.stone,P.stoneR,P.stoneHi,10);
      S.box(x-.55,x+.55,y-.55,y+.55,11.4,12.05,P.stone,P.stoneR,P.stoneHi);
    }
    S.flat(18.2,28.0,43.7,46.9,12.2,P.lead);
    S.box(18.1,28.1,46.7,47.0,12.15,12.75,P.stone,P.stoneR,P.stoneHi);
    S.flat(14.3,29.6,12,30.4,.04,(x,y)=>K.mod(x,3.1)<.12||K.mod(y,3.1)<.12?P.seam:P.paveHi);
    c.canopy(15.2,22.5,1.3,3.7,7.9);c.crates(16.1,1.8,4);c.crates(25,12.5,3);
    c.fence(14.4,12.1,14.4,18.5,3.1);c.fence(30.25,12.1,30.25,17.1,3.1);
    c.lamps(A.front,16.8,11.3);c.lamps(A.front,24.7,11.3);c.lamps(D.back,5.7,9.2);c.lamps(B.right,8.7,8.5);
    rain(c,2.75,43.78,48.8);rain(c,44.52,32.9,48.8);rain(c,12.99,10.3,37.2);
  }
  function archPassage(c,x0,x1,y0,y1,spring,ceiling){
    const {S,P}=c,r=(x1-x0)/2,cx=(x0+x1)/2;
    for(let i=0;i<18;i++){
      const a=i*Math.PI/18,b=(i+1)*Math.PI/18;
      const ax=cx+Math.cos(a)*r,bx=cx+Math.cos(b)*r,az=spring+Math.sin(a)*r,bz=spring+Math.sin(b)*r;
      S.poly([[bx,y1,bz],[ax,y1,az],[ax,y1,ceiling],[bx,y1,ceiling]],P.stone);
      S.poly([[ax,y0,az],[bx,y0,bz],[bx,y0,ceiling],[ax,y0,ceiling]],P.stoneR);
      S.poly([[ax,y0,az],[bx,y0,bz],[bx,y1,bz],[ax,y1,az]],P.stoneD);
      const ro=r+.45,ri=r-.03;
      for(const [y,col]of[[y1+.11,i%3?P.stone:P.stoneHi],[y0-.11,i%3?P.stoneR:P.stone]])S.poly([
        [cx+Math.cos(a)*ro,y,spring+Math.sin(a)*ro],[cx+Math.cos(b)*ro,y,spring+Math.sin(b)*ro],
        [cx+Math.cos(b)*ri,y,spring+Math.sin(b)*ri],[cx+Math.cos(a)*ri,y,spring+Math.sin(a)*ri]],col,.03);
    }
    for(const x of[x0-.17,x1+.17])S.box(x-.22,x+.22,y1,y1+.42,.3,spring,P.stone,P.stoneR,P.stoneHi);
    S.flat(x0+.3,x1-.3,y0-.2,y1+.5,.06,P.paveHi);
  }
  function teaHouse(c){
    const {S,K,P}=c,A=c.walls(1.35,12.85,4.0,13.45,.2,12.65,21601);
    trim(c,A,[.65,11.9]);
    K.archWindow(S,A.front,5.2,2.1,5.0,8.7,true);c.door(A.front,.7,2.7,9.2,true);
    for(const F of[A.left,A.right]){
      K.sash(S,F,1.1,2.4,2.7,6.9,true);K.sash(S,F,5.25,2.4,2.7,6.9,true);
      F.block(.1,F.length-.1,.03,.22,10.7,11.2,P.wood,P.woodR,P.woodHi);
    }
    K.sash(S,A.back,1.2,3.1,3.1,5.9,true);c.door(A.back,7.1,2.6,8.0,false);
    c.gable(1.08,13.12,3.73,13.72,12.85,7.1,false);
    const gableFace=S.face([1.08,13.72],[13.12,13.72],0,1);
    // The small attic is glazing in an actual gable, not an extra occupied floor.
    K.sash(S,gableFace,4.9,14.1,2.3,3.1,true);
    for(const x of[2.1,12.1])S.beam([x,13.83,12.9],[7.1,13.83,19.1],P.woodD,.19);
    c.chimney(4.8,7.0,18.9,2);
    const B=c.walls(1.5,4.9,1.5,4.0,.2,6.0,21602,'timber');
    c.shed(1.23,5.17,1.24,4.0,6.25,2.0);c.door(B.back,.65,2.0,4.9,false);
    S.flat(13.2,14.7,4.2,14.1,.05,P.paveHi);c.fence(5.2,1.3,12.6,1.3,2.5);
    c.crates(6.1,1.9,3);c.lamps(A.front,4.3,9.6);c.lamps(A.back,6.25,8.6);rain(c,13.04,12.8,12.4);
    K.cylinder(S,3.3,14.3,.2,1.8,.17,.17,P.iron,P.ironD,P.ironHi,8);
    K.cylinder(S,3.3,14.3,1.8,2.05,.83,.83,P.woodHi,P.woodR,P.woodHi,12);
  }
  function courtyardDining(c){
    const {S,K,P}=c,A=c.walls(1.6,28.6,1.8,11.0,.2,25.5,21701,'stone'),
      B=c.walls(19.7,28.6,11.0,28.4,.2,25.5,21702);
    trim(c,A,[.6,12.4,24.8]);trim(c,B,[.6,12.4,24.8]);
    for(const F of[A.front,A.back]){
      sashRows(c,F,1,4,15.0,3.7,7.0);
      for(const b of[0,1,3])K.archWindow(S,F,F.length*(b+.5)/4-2.2,2.0,4.4,8.7,true);
    }
    c.door(A.front,15.6,3.3,10.0,true);c.loading(A.back,11.6,5.2,9.5);
    for(const F of[A.left,A.right])sashRows(c,F,2,1,3.2,3.4,7.0);
    for(const F of[B.left,B.right]){
      sashRows(c,F,1,3,15.0,3.6,7.0);
      for(let b=0;b<3;b++)if(!(F===B.left&&b===1))K.archWindow(S,F,F.length*(b+.5)/3-1.85,2.1,3.7,8.7,true);
    }
    sashRows(c,B.front,1,1,15.0,3.7,7.0);c.door(B.front,2.6,3.6,10.1,true);
    c.door(B.left,6.65,3.2,9.5,false);
    c.gable(1.26,28.94,1.46,11.32,25.85,6.6,true);
    c.gable(19.37,28.94,11.05,28.73,25.85,6.9,false);
    c.chimney(5.0,6.4,32.2,2);c.chimney(24.8,22.2,32.4,2);
    const D=c.walls(2.2,8.7,16.0,25.0,.2,8.9,21703);
    c.hip(1.92,8.98,15.72,25.28,9.15,2.8,false);
    c.loading(D.right,2.6,4.5,7.3);K.sash(S,D.front,1.3,2.9,3.2,3.9,true);
    c.canopy(2.2,8.6,26,29.7,6.5);c.crates(3.0,26.7,3);
    S.flat(9.3,19.1,12.0,29.8,.035,(x,y)=>K.mod(y,3)<.15?P.seam:P.paveHi);
    c.fence(10.0,30.5,14.0,30.5,2.4);
    c.lamps(A.front,14.65,10.6);c.lamps(B.right,7.0,9.8);c.lamps(A.back,18.3,9.8);
    rain(c,1.35,10.8,25.2);rain(c,28.84,28.4,25.2);
  }
  function coachingPub(c){
    const {S,K,P}=c,A=c.walls(1.5,17.3,18.7,29.7,.2,36.3,21801),
      B=c.walls(22.4,29.5,18.7,29.7,.2,36.3,21802),T=c.walls(17.3,22.4,18.7,29.7,11.5,36.3,21803),
      C=c.walls(1.5,11.0,3.0,18.7,.2,23.5,21804,'stone'),D=c.walls(15.0,29.5,2.0,9.6,.2,11.8,21805);
    for(const W of[A,B])trim(c,W,[.6,12.3,23.5,35.6]);
    for(const W of[A,B,T])for(const F of[W.front,W.back])sashRows(c,F,2,W===A?3:1,15.0,W===A?3.5:3.1,6.9);
    for(const [F,n]of[[A.front,3],[B.front,1],[A.back,3],[B.back,1]]){
      F.block(.35,F.length-.35,.04,.24,.6,11.0,P.burgundy,P.burgundyD,P.burgundyHi);
      for(let i=0;i<n;i++)if(!(F===A.front&&i===1))K.archWindow(S,F,F.length*(i+.5)/n-1.8,2.1,3.6,8.3,true);
      c.course(F,11.4);
    }
    c.door(A.front,6.35,3.1,9.7,true);c.door(A.back,6.0,2.9,9.0,true);
    for(const F of[A.left,B.right])sashRows(c,F,3,2,3.0,3.1,6.9);
    trim(c,C,[.6,11.4,22.8]);
    for(const F of[C.left,C.right])sashRows(c,F,2,3,3.0,2.85,6.5,F===C.right?[0]:[]);
    for(const F of[C.front,C.back])sashRows(c,F,2,1,3.0,3.1,6.5);
    c.door(C.right,2.0,3.15,8.5,false);
    for(const F of[D.front,D.back])sashRows(c,F,1,3,2.7,2.85,6.1,[1]);
    c.loading(D.back,5.1,4.3,9.0);c.loading(D.front,5.1,4.3,9.0);
    for(const F of[D.left,D.right])K.sash(S,F,2.1,3.3,2.85,5.4,true);
    archPassage(c,17.3,22.4,18.7,29.7,8.1,11.5);
    c.gable(1.17,29.83,18.37,30.02,36.65,8.0,true);
    c.gable(1.18,11.32,2.68,18.65,23.85,6.0,false);
    c.hip(14.7,29.8,1.7,9.88,12.15,3.5,true);
    c.chimney(6.0,24.1,44.4,3);c.chimney(6.2,8.4,29.6,2);c.chimney(27.1,5.4,15.3,2);
    S.flat(11.4,28.8,10.1,18.2,.04,(x,y)=>K.mod(x+y,2.8)<.15?P.seam:P.paveHi);
    c.fence(28.85,10.0,28.85,17.7,3.0);c.crates(12.2,12.0,3);
    c.lamps(A.front,14.9,10.2);c.lamps(B.front,.95,10.2);c.lamps(D.back,10.9,9.1);c.lamps(C.left,6.1,8.8);
    rain(c,1.25,29.6,36.1);rain(c,29.75,24.0,36.1);
  }
  function marketHall(c){
    const {S,K,P}=c,A=c.walls(3.0,25.5,7.0,25.0,.2,18.5,21901,'stone');
    trim(c,A,[.7,17.8]);
    for(const F of[A.front,A.back]){
      K.archWindow(S,F,1.5,3.1,4.2,10.8,true);K.archWindow(S,F,16.8,3.1,4.2,10.8,true);
      c.door(F,8.5,5.5,12.8,true);
      F.block(8.0,14.5,.05,.55,14.0,14.8,P.stone,P.stoneR,P.stoneHi);
    }
    for(const F of[A.left,A.right])for(let b=0;b<3;b++)K.archWindow(S,F,1.2+b*5.6,3.0,4.1,11.5,true);
    c.gable(2.64,25.86,6.64,25.36,18.85,7.7,false);
    const gf=S.face([2.64,25.36],[25.86,25.36],0,1),gb=S.face([25.86,6.64],[2.64,6.64],0,-1);
    for(const F of[gf,gb])K.archWindow(S,F,9.1,20.0,5.0,4.6,false);
    const B=c.walls(25.5,29.4,10.0,20.0,.2,6.7,21902,'timber');
    S.poly([[25.5,9.7,9.0],[29.7,9.7,6.9],[29.7,20.3,6.9],[25.5,20.3,9.0]],K.slate(c.dark(1,0)));
    c.loading(B.front,.65,2.6,5.9);c.door(B.back,.65,2.4,5.6,false);
    S.flat(4.0,24.5,26.0,29.8,.04,P.paveHi);c.crates(4.1,3.8,5);c.crates(25.8,21.6,2);
    c.lamps(A.front,6.6,10.1);c.lamps(A.back,15.6,10.1);rain(c,2.73,23.7,18.1);
  }
  function glassRoof(c,x0,x1,y0,y1,z,rise){
    const {S,K,P}=c,cx=(x0+x1)/2;
    const glass=right=>(x,y,zz)=>{
      if(K.mod(y-y0,4.8)<.19||K.mod(x-x0,2.2)<.12)return right?P.ironD:P.lead;
      if(K.mod(x+y*.38,8.0)<.36)return right?P.glass:P.glassHi;
      return right?0x6e8b8c:0x91a7a5;
    };
    S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],glass(c.dark(-1,0)));
    S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],glass(c.dark(1,0)));
    // Opaque patent glazing, with framing in the same world-space depth buffer.
    // Roof reflects sky only; warm interior light comes from vertical hall panes.
    for(const y of[y0,y1])S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],(x,yy,zz)=>
      K.mod(x-x0,3)<.15||K.mod(zz-z,2.9)<.13?P.lead:P.glassHi);
    for(let y=y0+.15;y<y1;y+=4.8){S.beam([x0,y,z+.05],[cx,y,z+rise+.05],P.lead,.20);S.beam([cx,y,z+rise+.05],[x1,y,z+.05],P.iron,.20);}
    S.beam([cx,y0,z+rise+.06],[cx,y1,z+rise+.06],P.ironHi,.36);
    for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.28);
  }
  function doubleGlassMarket(c){
    const {S,K,P}=c,A=c.walls(2.3,20.9,7.0,35.5,.2,20.4,22001),
      B=c.walls(25.9,44.5,11.0,35.5,.2,24.5,22002),C=c.walls(2.3,44.5,35.5,44.2,.2,13.0,22003,'stone');
    for(const [W,h]of[[A,20.4],[B,24.5]]){
      for(const F of[W.left,W.right]){
        const bays=F===W.left||F===W.right?5:3;
        for(let b=0;b<bays;b++){
          const u=F.length*(b+.5)/bays-1.9;
          K.archWindow(S,F,u,3.1,3.8,h-5.1,true);
          F.block(u-.58,u-.2,.04,.36,1.0,h-.5,P.stone,P.stoneR,P.stoneHi);
        }
        c.course(F,h-.6);
      }
      for(const F of[W.front,W.back])for(let b=0;b<3;b++)K.archWindow(S,F,F.length*(b+.5)/3-2.0,3.0,4.0,h-5.0,true);
    }
    c.loading(A.back,6.3,6.0,12.4);c.loading(B.back,6.3,6.0,12.4);
    glassRoof(c,1.98,21.22,6.68,35.5,20.75,8.8);
    glassRoof(c,25.58,44.82,10.68,35.5,24.85,11.0);
    for(const b of[0,1,3,4])K.archWindow(S,C.front,C.front.length*(b+.5)/5-2.45,2.0,4.9,8.9,true);
    c.door(C.front,18.55,5.1,10.4,true);
    for(const F of[C.left,C.right])K.archWindow(S,F,1.5,2.3,4.1,8.2,true);
    c.hip(1.98,44.82,35.32,44.52,13.35,3.5,true);
    c.course(C.front,12.3);c.lamps(C.front,17.3,10.0);c.lamps(C.front,25.4,10.0);
    S.flat(21.6,25.2,7.3,35.1,.04,(x,y)=>K.mod(y,2.8)<.14?P.seam:P.paveHi);
    c.crates(6.0,3.4,6);c.crates(29.2,6.9,6);
    c.canopy(27.4,41.3,1.5,5.8,7.5);c.crates(28.4,2.2,4);
    c.lamps(A.back,2.8,11.1);c.lamps(B.back,15.1,12.0);
    rain(c,2.07,17.5,20.1);rain(c,44.72,23.5,24.2);
  }
  function arcadeBay(c,F,u,w,spring,top){
    const {S,P}=c,pi=.63,ri=(w-2*pi)/2,mid=u+w/2;
    for(const a of[u,u+w-pi])F.block(a,a+pi,0,.73,.2,spring+.2,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<16;i++){
      const a=i*Math.PI/16,b=(i+1)*Math.PI/16;
      const ax=mid+Math.cos(a)*ri,bx=mid+Math.cos(b)*ri,az=spring+Math.sin(a)*ri,bz=spring+Math.sin(b)*ri;
      S.poly([F.point(bx,.45,bz),F.point(ax,.45,az),F.point(ax,.45,top),F.point(bx,.45,top)],P.stone);
      S.poly([F.point(ax,.03,az),F.point(bx,.03,bz),F.point(bx,.45,bz),F.point(ax,.45,az)],P.stoneD);
      const ro=ri+.48;
      S.poly([F.point(mid+Math.cos(a)*ro,.53,spring+Math.sin(a)*ro),F.point(mid+Math.cos(b)*ro,.53,spring+Math.sin(b)*ro),
        F.point(bx,.53,bz),F.point(ax,.53,az)],i%3?P.stone:P.stoneHi);
    }
    F.block(u,u+w,.0,.56,top-.5,top+.15,P.stone,P.stoneR,P.stoneHi);
  }
  function quadrangleMarket(c){
    const {S,K,P}=c,A=c.walls(2.0,21.2,35.5,44.5,.2,32.5,22101,'stone'),
      B=c.walls(26.8,46.0,35.5,44.5,.2,32.5,22102,'stone'),T=c.walls(21.2,26.8,35.5,44.5,12.2,32.5,22103,'stone'),
      rear=c.walls(10.0,38.0,2.0,10.5,.2,16.5,22104);
    for(const W of[A,B]){
      trim(c,W,[.7,14.4,31.8]);
      for(const F of[W.front,W.back]){
        for(let i=0;i<3;i++)K.archWindow(S,F,1.05+i*6.05,2.1,4.2,10.1,true);
        sashRows(c,F,1,3,19.0,3.85,8.4);
      }
    }
    for(const F of[A.left,B.right]){K.archWindow(S,F,2.1,2.1,4.1,10.1,true);sashRows(c,F,1,1,19.0,3.8,8.4);}
    for(const F of[T.front,T.back])sashRows(c,F,1,1,19.0,3.2,8.4);
    archPassage(c,21.2,26.8,35.5,44.5,8.85,12.2);
    c.mansard(1.66,46.34,35.17,44.83,32.85,9.2,2.0);
    for(const x of[7.2,15.7,32.1,40.5])dormer(c,x,42.8,34.7,false);
    // Each side arcade has a thin outer back and real piers/arched spandrels.
    // The centre and the arcaded walkways have no opaque ground-floor infill.
    for(const right of[false,true]){
      const x0=right?38:2,x1=right?46:10,outer=right?
        c.walls(45.0,46.0,10.5,35.5,.2,15.2,22106):c.walls(2.0,3.0,10.5,35.5,.2,15.2,22105);
      const outerF=right?outer.right:outer.left,court=right?S.face([38,35.5],[38,10.5],-1,0):S.face([10,10.5],[10,35.5],1,0);
      for(let b=0;b<4;b++){
        K.sash(S,outerF,1.65+b*6.1,4.0,2.9,6.2,b%3!==1);
        arcadeBay(c,court,b*6.25,6.25,8.9,15.2);
      }
      S.flat(x0,x1,10.5,35.5,15.2,P.stoneR);
      c.hip(x0-.27,x1+.27,10.5,35.5,15.55,3.6,false);
      for(let b=0;b<3;b++){
        const yy=13+b*6.8,xx=right?41.4:4.1;
        S.box(xx,xx+3.1,yy,yy+3.5,.2,2.7,P.wood,P.woodR,P.woodHi);
        c.crates(xx+.25,yy+.3,2);
      }
      c.lamps(outerF,10.8,9.5);c.lamps(court,17.4,9.5);
      rain(c,right?46.2:1.8,32.5,15.0);
    }
    for(const F of[rear.front,rear.back]){
      for(let b=0;b<4;b++)if(b!==1)K.archWindow(S,F,F.length*(b+.5)/4-2.1,3.4,4.2,9.5,true);
      c.loading(F,8.5,5.2,11.0);
      c.course(F,15.8);
    }
    for(const F of[rear.left,rear.right])K.sash(S,F,1.7,4.2,3.0,6.8,true);
    c.gable(9.68,38.32,1.68,10.5,16.85,5.5,true);
    c.chimney(13.1,6.1,21.8,2);
    S.flat(10.7,37.3,11.2,34.8,.035,(x,y)=>K.mod(x,3.1)<.13||K.mod(y,3.1)<.13?P.seam:P.paveHi);
    S.flat(21.5,26.5,11.2,47.0,.05,P.paveHi);
    c.crates(11.2,12.2,4);c.crates(32.0,12.3,3);
    c.lamps(A.front,17.8,11.0);c.lamps(B.front,1.4,11.0);c.lamps(rear.back,23.9,10.1);
    rain(c,1.76,44.5,32.2);rain(c,46.22,44.5,32.2);
  }
  const builders={
    'UKH021-S':guesthouse,'UKH021-M':coachingInn,'UKH021-L':railwayHotel,
    'UKD021-S':teaHouse,'UKD021-M':courtyardDining,'UKD021-L':coachingPub,
    'UKM021-S':marketHall,'UKM021-M':doubleGlassMarket,'UKM021-L':quadrangleMarket
  };
  function build(id,view){
    const spec=specs.find(s=>s.id===id);if(!spec)throw Error('Unknown hospitality candidate '+id);
    if(!root.BritishUseScalesKit021)throw Error('Candidate architecture kit missing');
    const c=root.BritishUseScalesKit021.create(spec,view);
    c.S.flat(.65,c.extent-.65,.65,c.extent-.65,0,c.K.paving);
    builders[id](c);return c.finish({nativeFootprint:true,geometry:'original-hospitality-world-space'});
  }
  root.BritishUseScalesHospitality021=Object.freeze({specs,build,buildAll:()=>specs.flatMap(s=>Array.from({length:4},(_,view)=>build(s.id,view)))});
})(typeof window==='undefined'?globalThis:window);
