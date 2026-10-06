/* GPT-014: original English collegiate quadrangle and country-manor ensembles.
 * Architectural sources consulted 2026-10-05 (representative composite, no replica):
 * https://archive-cat.magd.ox.ac.uk/guides/buildings
 *   College ranges enclosing a cloister; library and accommodation are distinct.
 * https://visit.bodleian.ox.ac.uk/plan-your-visit/our-spaces
 *   Old Schools Quadrangle and English Gothic library architectural vocabulary.
 * https://www.nationaltrust.org.uk/visit/wiltshire/stourhead/history-of-stourhead-house
 *   English Palladian country-house proportions and a later classical portico.
 * https://www.nationaltrust.org.uk/discover/history/gardens-landscapes/history-of-glasshouses-orangeries-and-garden-sheds
 *   Country-house orangeries and glazed, iron-framed conservatories.
 * https://www.english-heritage.org.uk/visit/places/audley-end-house-and-gardens/history-and-stories/history/description/
 *   Distinct service courts, formal garden compartments and garden terraces.
 *
 * Every view rotates complete 16-unit-cell world geometry, never flips a bitmap.
 * k282/k285 4x4:304x320 ax152 ay318; ancillary 2x2:160x196 ax80 ay194.
 * Native paid walking modules 1x1:72x92 ax36 ay90; clear x=5.3..10.7 strip.
 * Ground and all fine detail are physical geometry. No fonts, imported images,
 * random-number calls, simulation state, storage, halos or additive light plates.
 * Runtime/raster tests deliberately belong to the isolated GitHub Actions job.
 */
(function (root) {
  'use strict';
  const H=root.BritishComplexPrimitives014;
  if(!H)throw new Error('BritishComplexPrimitives014 must load before college/manor art');
  const {Scene,P,C,mod,hash,GLOW,brick,paving,slate,band,masonry,cylinder,ring,sash,hippedRoof,
    rainpipe,lantern,wallLamp,leafRelief,blossom,pottedPlant,ironRail,bench,cornice,pilaster,
    archWindow,timberDoor,ashlar,stoneBlock,gableRoof,hedge,grass}=H;
  const WATER=C('557e7b'),WATERHI=C('7b9990'),GRAVEL=C('bfb399'),TILE=C('98664d');
  const themes=['collegeGate','collegeCloister','collegeLibraryWalk','collegeGarden',
    'manorGate','manorTerrace','manorParterre','manorPond'];
  const FEATURES={
    282:['open-quadrangle-lawn','four-low-open-cloisters','carved-gatehouse-passage','traceried-oriel',
      'stepped-gables','long-library-range','residential-staircase-doors','paired-chimney-pots',
      'ashlar-courses','buttress-offsets','lead-roof-flashings','cloister-seat','sundial','real-window-lantern-night'],
    283:['independent-library','tall-transomed-windows','large-traceried-end-window','steep-slate-roof',
      'gabled-entrance-porch','carved-book-shield','buttresses','reading-garden','chimney-stacks'],
    284:['independent-residential-court','open-U-court','paired-staircase-doors','stepped-gable-ends',
      'dormer-windows','chimney-pots','court-lawn','bicycle-stand','terracotta-border-pots'],
    285:['Palladian-principal-block','two-lower-distinct-wings','columned-pedimented-portico',
      'balustraded-garden-terrace','Georgian-sash-proportions','corner-quoins','hipped-slate-roofs',
      'formal-four-compartment-parterre','sunken-reflecting-pond','clipped-topiary','stone-garden-urns'],
    286:['independent-conservatory','raised-central-glass-house','lower-flanking-glass-wings',
      'physical-iron-glazing-bars','masonry-plinth','ridge-ventilators','finials','interior-pot-plants',
      'garden-work-table','external-rainwater-barrel'],
    287:['independent-stable-court','open-U-shaped-yard','brick-coachhouse','boarded-stable-doors',
      'hayloft-doors','roof-ventilator','tether-rings','cobbled-drainage-yard','horse-trough','hay-bales']
  };
  function foundation(S,size) {
    S.box(.25,size-.25,.25,size-.25,0,.55,P.stoneD,P.stoneD,paving);
    for(const y of[.45,size-.7])S.flat(.45,size-.45,y,y+.22,.56,P.stoneR);
    for(const x of[.45,size-.7])S.flat(x,x+.22,.45,size-.45,.56,P.stoneR);
  }
  function gravel(x,y) {
    const n=hash(Math.floor(x*2),Math.floor(y*2),14118);
    return n%29===0?P.stoneHi:n%13===0?P.stoneR:GRAVEL;
  }
  function roofCoping(S,x0,x1,y,z,rise) {
    const cx=(x0+x1)/2;
    S.beam([x0-.1,y,z],[cx,y,z+rise+.1],P.stoneHi,.55);
    S.beam([cx,y,z+rise+.1],[x1+.1,y,z],P.stoneHi,.55);
    S.beam([cx,y,z+rise],[cx,y,z+rise+1.1],P.stone,.32);
  }
  function steppedGable(S,F,w,z,rise) {
    const steps=4,c=w/2;
    for(let i=0;i<steps;i++){
      const u=i*w/(2*steps),zz=z+rise*i/steps;
      F.block(u,u+w/(2*steps)+.18,-.05,.4,zz,zz+rise/steps+.3,P.stone,P.stoneR,P.stoneHi);
      F.block(w-u-w/(2*steps)-.18,w-u,-.05,.4,zz,zz+rise/steps+.3,P.stone,P.stoneR,P.stoneHi);
    }
    F.block(c-.4,c+.4,-.04,.4,z+rise-.3,z+rise+1.2,P.stone,P.stoneR,P.stoneHi);
  }
  function quoin(S,F,u,z,h,w) {
    for(let zz=z;zz<h+z;zz+=2.4)F.block(u,u+w,.02,.32,zz,Math.min(zz+2.13,z+h),P.stoneHi,P.stoneR,P.stoneHi);
  }
  // Restrained Tudor-headed lights with leadwork contained in each glazed opening.
  function collegiateWindow(S,F,u,z,w,h,lights,lit) {
    lights=lights||2;const gap=.33,cell=(w-gap*(lights-1))/lights;
    F.panel(u-.36,u+w+.36,z-.2,z+h+.4,P.stoneD,.07);
    for(let n=0;n<lights;n++){
      const uu=u+n*(cell+gap);
      F.panel(uu,uu+cell,z,z+h,(x,y)=>{
        const crown=h-.52+(.52*(1-Math.abs(x-cell/2)/(cell/2)));
        if(y>crown)return P.stone;
        if(x<.14||x>cell-.14||y<.17||y>crown-.17)return P.stoneHi;
        if(Math.abs(y-h*.46)<.18)return P.stone;
        if(mod(x*1.7+y,2.3)<.095||mod(x*1.7-y,2.3)<.095)return P.lead;
        if(y<h*.14)return P.glassR;
        return lit?(n%2?GLOW[2]:GLOW[0]):n%2?P.glassR:P.glassHi;
      },.16);
    }
    F.block(u-.55,u+w+.55,.02,.71,z-.65,z-.19,P.stone,P.stoneR,P.stoneHi);
    F.block(u-.5,u+w+.5,.02,.56,z+h+.18,z+h+.7,P.stone,P.stoneR,P.stoneHi);
    for(const uu of[u-.54,u+w+.15])F.block(uu,uu+.36,.03,.53,z+h-.95,z+h+.55,P.stone,P.stoneR,P.stoneHi);
  }
  function shield(S,F,u,z,scale,book) {
    const s=scale||1;
    const q=[[u-s,z+s*1.3],[u+s,z+s*1.3],[u+s*.88,z-s*.55],[u,z-s*1.4],[u-s*.88,z-s*.55]];
    S.poly(q.map(p=>F.point(p[0],.64,p[1])),P.stoneD,.035);
    S.poly(q.map(p=>F.point(u+(p[0]-u)*.78,.70,z+(p[1]-z)*.78)),P.stoneHi,.04);
    if(book){
      for(const d of[-1,1])S.poly([[u,z+s*.7],[u+d*s*.68,z+s*.86],[u+d*s*.68,z-s*.4],[u,z-s*.6]].map(p=>F.point(p[0],.76,p[1])),P.stoneR,.04);
      F.panel(u-.065,u+.065,z-s*.6,z+s*.65,P.stoneHi,.80);
    }else{
      F.panel(u-s*.1,u+s*.1,z-s*.72,z+s*.78,P.stoneR,.77);
      F.panel(u-s*.5,u+s*.5,z+s*.13,z+s*.34,P.stoneR,.77);
    }
    for(const d of[-1,1])leafRelief(S,F,u+d*s*1.4,z-s*.7,s*1.75,.51,P.stoneHi);
  }
  function buttress(S,F,u,z,h) {
    F.block(u-.54,u+.54,.03,1.14,z,z+h*.35,P.stone,P.stoneR,P.stoneHi);
    F.block(u-.43,u+.43,.03,.89,z+h*.35,z+h*.70,P.stone,P.stoneR,P.stoneHi);
    F.block(u-.31,u+.31,.03,.63,z+h*.70,z+h,P.stone,P.stoneR,P.stoneHi);
    for(const [zz,d]of[[z+h*.35,1.21],[z+h*.7,.96],[z+h,.72]])F.block(u-.58,u+.58,.02,d,zz-.2,zz+.23,P.stone,P.stoneR,P.stoneHi);
  }
  function chimney(S,x,y,z,height,pots) {
    S.box(x-1.35,x+1.35,y-.95,y+.95,z,z+height,brick(false,144),brick(true,144),P.brick[1]);
    for(const zz of[z+height-2,z+height-.8])S.box(x-1.65,x+1.65,y-1.22,y+1.22,zz,zz+.45,P.brick[1],P.brickR[1],P.stoneD);
    for(let i=0;i<(pots||2);i++){
      const xx=x-(pots-1)*.58+i*1.16;
      cylinder(S,xx,y,z+height,z+height+1.8,.39,.34,P.pot,P.potR,P.ink,8);
      cylinder(S,xx,y,z+height+1.7,z+height+2.1,.48,.48,P.pot,P.potR,P.ink,8);
    }
  }
  // This is an actual empty arch: front/back spandrels and intrados surround air.
  function openArch(S,F,u,z,w,h,depth,cap) {
    const spring=h-w*.48,top=z+h+(cap||1.0),n=16;
    for(let i=0;i<n;i++){
      const a=i*Math.PI/n,b=(i+1)*Math.PI/n;
      const x0=u+w/2+Math.cos(a)*w/2,x1=u+w/2+Math.cos(b)*w/2;
      const za=z+spring+Math.sin(a)*w*.48,zb=z+spring+Math.sin(b)*w*.48;
      for(const d of[0,-depth])S.poly([F.point(x0,d,za),F.point(x1,d,zb),F.point(x1,d,top),F.point(x0,d,top)],i%4?P.stone:P.stoneHi);
      S.poly([F.point(x0,0,za),F.point(x1,0,zb),F.point(x1,-depth,zb),F.point(x0,-depth,za)],P.stoneD);
      const rr=w/2+.45;
      S.poly([F.point(x0,.08,za),F.point(x1,.08,zb),F.point(u+w/2+Math.cos(b)*rr,.08,z+spring+Math.sin(b)*(w*.48+.45)),F.point(u+w/2+Math.cos(a)*rr,.08,z+spring+Math.sin(a)*(w*.48+.45))],i%2?P.stoneHi:P.stone,.03);
    }
    for(const edge of[u-.75,u+w]){
      F.block(edge,edge+.75,-depth,.05,z,z+spring,P.stone,P.stoneR,P.stoneHi);
      for(let zz=z+.4;zz<z+spring;zz+=1.6)F.panel(edge,edge+.75,zz,zz+.11,P.stoneD,.08);
      F.block(edge-.08,edge+.83,-depth-.08,.17,z+spring-.42,z+spring+.1,P.stone,P.stoneR,P.stoneHi);
    }
    S.poly([F.point(u-.75,0,top),F.point(u+w+.75,0,top),F.point(u+w+.75,-depth,top),F.point(u-.75,-depth,top)],P.stoneHi);
  }
  function cloister(S,x0,x1,y0,y1,alongX) {
    const F=alongX?S.face([x0,y1],[x1,y1],0,1):S.face([x1,y1],[x1,y0],1,0);
    const len=F.length,n=Math.max(1,Math.floor(len/6.5)),span=len/n;
    S.flat(x0,x1,y0,y1,.72,paving);
    for(let i=0;i<n;i++)openArch(S,F,i*span+.72,.75,span-1.44,7.0,alongX?y1-y0:x1-x0,.8);
    S.box(x0-.12,x1+.12,y0-.12,y1+.12,8.53,9.12,P.stone,P.stoneR,P.stoneHi);
    if(alongX){
      S.poly([[x0,y0,11],[x1,y0,11],[x1,y1,9.13],[x0,y1,9.13]],slate(false));
      S.wall([x0,y0],[x1,y0],9.12,11,P.stoneR);
      for(const x of[x0,x1])S.poly([[x,y0,9.12],[x,y0,11],[x,y1,9.13]],P.stone);
    }else{
      S.poly([[x0,y0,11],[x1,y0,9.13],[x1,y1,9.13],[x0,y1,11]],slate(false));
      S.wall([x0,y0],[x0,y1],9.12,11,P.stoneR);
      for(const y of[y0,y1])S.poly([[x0,y,9.12],[x1,y,9.13],[x0,y,11]],P.stone);
    }
    for(let u=span/2;u<len;u+=span){
      const p=F.point(u,-.7,6.3);lantern(S,p[0],p[1],p[2],false);
    }
  }
  function dormer(S,x,y,z,alongX) {
    const w=3.1,d=2.7;
    const F=stoneBlock(S,x-w/2,x+w/2,y-d/2,y+d/2,z,z+4.1,1471);
    gableRoof(S,x-w/2-.15,x+w/2+.15,y-d/2-.15,y+d/2+.15,z+4.1,2,false);
    collegiateWindow(S,F.front,.72,z+.7,1.7,2.8,1,true);
  }
  function collegeRange(S,x0,x1,y0,y1,height,library,alongX) {
    const B=stoneBlock(S,x0,x1,y0,y1,.62,height,1464);
    band(S,x0,x1,y0,y1,1.3,.6);band(S,x0,x1,y0,y1,height-.4,.8);
    for(const key of['front','back','left','right']){
      const F=B[key],long=(key==='front'||key==='back')===!!alongX;
      const n=Math.max(1,Math.floor(F.length/(library?7:6.2))),step=F.length/n;
      for(let i=0;i<n;i++){
        const w=library?Math.min(4.6,step-2):Math.min(3.1,step-2),u=(i+.5)*step-w/2;
        if(library)collegiateWindow(S,F,u,5.6,w,height-10,3,(i+key.length)%3!==0);
        else for(const z of[4.2,13.4])if(z+6.6<height)collegiateWindow(S,F,u,z,w,6.2,2,(i+z+key.length)%3!==0);
      }
      if(library&&long)for(let u=.65;u<F.length;u+=step)buttress(S,F,u,.7,height-1.5);
      quoin(S,F,.05,2,height-3,.55);quoin(S,F,F.length-.6,2,height-3,.55);
    }
    gableRoof(S,x0-.4,x1+.4,y0-.4,y1+.4,height+.4,library?13:10.8,alongX);
    if(alongX){
      steppedGable(S,B.left,y1-y0,height+.3,library?13:10.8);
      steppedGable(S,B.right,y1-y0,height+.3,library?13:10.8);
    }else{
      steppedGable(S,B.front,x1-x0,height+.3,library?13:10.8);
      steppedGable(S,B.back,x1-x0,height+.3,library?13:10.8);
    }
    for(const [x,y]of[[x0-.2,y0+.45],[x1+.2,y1-.45]])rainpipe(S,x,y,height+.35);
    return B;
  }
  function urn(S,x,y,z,s) {
    s=s||1;cylinder(S,x,y,z,z+.55*s,.65*s,.65*s,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,z+.55*s,z+1.55*s,.26*s,.43*s,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,z+1.55*s,z+2.5*s,.43*s,.92*s,P.stoneHi,P.stoneR,P.soil,10);
    cylinder(S,x,y,z+2.5*s,z+2.77*s,.96*s,.96*s,P.stone,P.stoneR,P.soil,10);
    for(let k=0;k<6;k++){const a=k*Math.PI/3;blossom(S,x+Math.cos(a)*.55*s,y+Math.sin(a)*.55*s,z+2.8*s,.42*s,P.flower[k%3]);}
  }
  function topiary(S,x,y,z,height) {
    cylinder(S,x,y,z,z+.6,.86,.86,P.stone,P.stoneR,P.soil,8);
    cylinder(S,x,y,z+.6,z+height*.43,.15,.12,P.wood,P.woodR,P.wood,6);
    const hh=height*.6;
    cylinder(S,x,y,z+height-hh,z+height-.3,1.35,1.12,P.leaf[0],P.leaf[3],P.leaf[2],10);
    cylinder(S,x,y,z+height-.3,z+height+.45,1.12,.15,P.leaf[2],P.leaf[0],P.leaf[1],10);
  }
  function sundial(S,x,y,z) {
    S.box(x-1,x+1,y-1,y+1,z,z+.4,P.stone,P.stoneR,P.stoneHi);
    cylinder(S,x,y,z+.4,z+3,.43,.33,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,z+3,z+3.32,.9,.9,P.stone,P.stoneR,P.gold,12);
    S.poly([[x-.1,y-.58,z+3.34],[x-.1,y+.5,z+3.34],[x-.1,y-.45,z+4.4]],P.iron);
  }
  function collegeGatehouse(S) {
    const a=stoneBlock(S,24,28,49,61,.62,36,14282),b=stoneBlock(S,36,40,49,61,.62,36,14282);
    const up=stoneBlock(S,28,36,49,61,14.7,36,14283);
    openArch(S,S.face([28,61],[36,61],0,1),0,.65,8,14,12,.5);
    for(const F of[a.front,b.front,a.back,b.back]){
      collegiateWindow(S,F,1.1,20,1.8,7.8,1,true);
      quoin(S,F,.08,1.3,33.6,.65);quoin(S,F,F.length-.74,1.3,33.6,.65);
    }
    for(const F of[up.front,up.back]){
      F.block(1.1,6.9,.06,1.1,18.3,27.8,P.stone,P.stoneR,P.stoneHi);
      const o=F.point(1.1,1.14,0),q=F.point(6.9,1.14,0),ff=S.face([o[0],o[1]],[q[0],q[1]],F===up.front?0:0,F===up.front?1:-1);
      collegiateWindow(S,ff,.6,19.2,4.6,7.6,3,true);
      F.block(.72,7.28,.08,1.42,27.9,28.5,P.stone,P.stoneR,P.stoneHi);
      shield(S,F,4,32,1.0,true);
      for(const u of[.2,7.8])leafRelief(S,F,u,29.7,3.1,.34,P.stoneHi);
    }
    band(S,24,40,49,61,36,.8);
    for(const y of[49,61])for(let x=24;x<40;x+=2.6)S.box(x,Math.min(x+1.5,40),y-.15,y+.45,36.8,38.5,P.stone,P.stoneR,P.stoneHi);
    hippedRoof(S,24.8,39.2,49.8,60.2,37,6.4,true);
    for(const x of[24.5,39.5])for(const y of[49.5,60.5]){
      S.box(x-.75,x+.75,y-.75,y+.75,35.4,39.7,P.stone,P.stoneR,P.stoneHi);
      cylinder(S,x,y,39.7,42.5,.72,.10,P.stone,P.stoneR,P.stoneHi,4);
      S.beam([x,y,42.4],[x,y,43.25],P.iron,.15);
    }
    for(const x of[26,38])wallLamp(S,S.face([24,61],[40,61],0,1),x-24,10.4);
    for(const x of[28.1,35.5])S.box(x,x+.4,51,59,.7,10.1,P.wood,P.woodR,P.woodHi);
    // Open timber doors are folded against the tunnel reveals, not across entry.
    for(const x of[28.18,35.4])for(const y of[52,56.7])S.box(x,x+.24,y,y+1.4,2.6,2.85,P.iron,P.ironD,P.iron);
  }
  function college(view) {
    const S=Scene(4,view,304,320);foundation(S,64);
    S.flat(15,49,15,49,.62,paving);S.flat(20,44,20,44,.65,grass);
    for(const [x0,x1,y0,y1]of[[20,21,20,44],[43,44,20,44],[20,44,20,21],[20,44,43,44]])S.flat(x0,x1,y0,y1,.7,P.stoneR);
    S.flat(29.8,34.2,20,44,.67,paving);S.flat(20,44,29.8,34.2,.67,paving);
    collegeRange(S,4,60,4,15,26,false,true);
    collegeRange(S,4,15,15,49,24,false,false);
    collegeRange(S,49,60,15,49,27.5,true,false);
    collegeRange(S,4,24,49,60,19,false,true);
    collegeRange(S,40,60,49,60,19,false,true);
    cloister(S,15,49,15,19,true);cloister(S,15,19,19,45,false);
    cloister(S,45,49,19,45,false);cloister(S,19,45,45,49,true);
    collegeGatehouse(S);
    for(const [x,y,z,p]of[[12,9.5,33,3],[28,9.5,34,3],[47,9.5,34,3],[9.5,27,31,2],[9.5,42,31,2],[54.5,26,34,3],[54.5,43,34,3],[13,54.5,26,2],[50,54.5,26,2]])chimney(S,x,y,z,6,p);
    for(const x of[17,38,53])dormer(S,x,12,29,true);
    for(const x of[20,44]){const F=S.face([4,15],[60,15],0,1);timberDoor(F,x-5,.7,2.3,8,true);}
    sundial(S,32,32,.68);
    bench(S,21.7,34,6.8,false);
    for(const [x,y]of[[22.5,22.5],[41.5,41.5]])urn(S,x,y,.7,.75);
    for(const x of[2.2,61.8])for(const y of[20,40])pottedPlant(S,x,y,.6,.85,P.flower[2]);
    for(const x of[20.8,43.2])lantern(S,x,61.5,7.5,true);
    return S.finish({kind:282,design:'collegiate-quadrangle',features:FEATURES[282],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function library(view) {
    const S=Scene(2,view,160,196);foundation(S,32);
    const B=collegeRange(S,4,28,6,23,29,true,true);
    for(const F of[B.left,B.right]){
      collegiateWindow(S,F,4.3,10.5,8.3,16,4,true);
      shield(S,F,8.5,34.3,.85,true);
    }
    const porch=stoneBlock(S,12,20,23,28.8,.6,13,141);
    timberDoor(porch.front,2,.7,4,9.7,true);gableRoof(S,11.7,20.3,22.8,29.2,13,6,false);
    roofCoping(S,11.7,20.3,29.21,13,6);shield(S,porch.front,4,15.5,.7,true);
    for(const x of[7,25])chimney(S,x,14.5,35.2,6,2);
    for(const x of[2,30]){S.flat(x-.9,x+.9,4,22,.58,grass);hedge(S,x-.65,x+.65,5,21,.62,1.8);}
    bench(S,4.4,25.4,4.4,false);pottedPlant(S,24.8,27.5,.62,1,P.flower[2]);
    for(const x of[10.7,21.3])lantern(S,x,28.8,6.8,true);
    return S.finish({kind:283,design:'college-library',features:FEATURES[283],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function cycleStand(S,x,y) {
    // Small empty cycle hoops remain attached to the court paving.
    const F=S.face([x,y],[x,y+4],1,0);
    for(const u of[.5,2,3.5]){
      S.beam(F.point(u-.5,0,.65),F.point(u-.5,0,2.6),P.iron,.18);
      S.beam(F.point(u+.5,0,.65),F.point(u+.5,0,2.6),P.iron,.18);
      S.beam(F.point(u-.5,0,2.6),F.point(u+.5,0,2.6),P.iron,.2);
    }
  }
  function residence(view) {
    const S=Scene(2,view,160,196);foundation(S,32);
    collegeRange(S,3,29,3,11,20,false,true);
    const a=collegeRange(S,3,10,11,27,18,false,false),b=collegeRange(S,22,29,11,27,18,false,false);
    S.flat(10.1,21.9,11.1,29.5,.6,paving);S.flat(12.5,19.5,14.5,23,.66,grass);
    for(const F of[a.right,b.left])timberDoor(F,5,.65,2.5,7.5,true);
    for(const [x,y,z]of[[7,7,25],[25,7,25],[6.5,20,23],[25.5,20,23]])chimney(S,x,y,z,5,2);
    for(const x of[12,20])dormer(S,x,8.5,22,true);
    cycleStand(S,11.6,24.3);
    for(const x of[12,20])pottedPlant(S,x,12.6,.6,.8,P.flower[x===12?0:2]);
    const entry=S.face([10,29],[22,29],0,1);
    for(const u of[.3,11.7])entry.block(u-.6,u+.6,-.35,.35,.62,5,P.stone,P.stoneR,P.stoneHi);
    for(const x of[10.3,21.7])lantern(S,x,29,5,false);
    ironRail(S,[3.8,29],[8.9,29],.65,3.8);ironRail(S,[23.1,29],[28.2,29],.65,3.8);
    return S.finish({kind:284,design:'college-residential-court',features:FEATURES[284],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function manorBlock(S,x0,x1,y0,y1,z,h,wing) {
    const B=wing?masonry(S,x0,x1,y0,y1,z,z+h,1451):stoneBlock(S,x0,x1,y0,y1,z,z+h,1450);
    band(S,x0,x1,y0,y1,z+.35,.65);band(S,x0,x1,y0,y1,z+4.7,.45);
    cornice(S,x0,x1,y0,y1,z+h-.2);
    for(const key of['front','back','left','right']){
      const F=B[key],n=Math.max(1,Math.floor(F.length/(wing?5.8:5.2))),step=F.length/n;
      for(let i=0;i<n;i++){
        const ww=wing?2.7:2.9,u=(i+.5)*step-ww/2;
        for(const [zz,hh]of(wing?[[z+6.0,6.2],[z+14.1,4.7]]:[[z+6.2,9],[z+18.1,7.6]]))
          if(zz+hh<z+h-1.6)sash(S,F,u,zz,ww,hh,(i+key.length)%3!==0);
        F.panel(u,u+ww,z+1.5,z+3.65,(x,y)=>Math.abs(x-ww/2)<.1||Math.abs(y-1.05)<.1?P.iron:P.glassR,.12);
      }
      quoin(S,F,.12,z+.8,h-1.8,.75);quoin(S,F,F.length-.87,z+.8,h-1.8,.75);
      for(let zz=z+1.3;zz<z+4.9;zz+=1.05)F.panel(.05,F.length-.05,zz,zz+.12,P.stoneD,.16);
      if(!wing)for(const u of[.55,F.length-.55])pilaster(S,F,u,z+5.3,h-6.7,.68);
    }
    hippedRoof(S,x0-.5,x1+.5,y0-.5,y1+.5,z+h+.55,wing?6.8:8.6,(x1-x0)>(y1-y0));
    for(const [x,y]of[[x0-.25,y0+.5],[x1+.25,y1-.5]])rainpipe(S,x,y,z+h);
    return B;
  }
  function balustrade(S,a,b,z,h) {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.max(1,Math.floor(len/1.4));
    for(let i=0;i<=n;i++){
      const x=a[0]+dx*i/n,y=a[1]+dy*i/n;
      cylinder(S,x,y,z,z+.4,.26,.26,P.stone,P.stoneR,P.stoneHi,6);
      cylinder(S,x,y,z+.4,z+h*.62,.18,.33,P.stone,P.stoneR,P.stoneHi,6);
      cylinder(S,x,y,z+h*.62,z+h-.2,.33,.15,P.stone,P.stoneR,P.stoneHi,6);
    }
    S.beam([a[0],a[1],z+h],[b[0],b[1],z+h],P.stoneHi,.62);
    S.beam([a[0],a[1],z+.17],[b[0],b[1],z+.17],P.stone,.67);
    for(const p of[a,b])S.box(p[0]-.58,p[0]+.58,p[1]-.58,p[1]+.58,z,z+h+.32,P.stone,P.stoneR,P.stoneHi);
  }
  function classicalColumn(S,x,y,z,h) {
    cylinder(S,x,y,z,z+.45,.9,.9,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,z+.45,z+1.1,.69,.55,P.stone,P.stoneR,P.stoneHi,10);
    cylinder(S,x,y,z+1.1,z+h-1.1,.54,.45,P.stoneHi,P.stoneR,P.stone,10);
    for(let k=0;k<10;k++){
      const a=k*Math.PI/5;S.beam([x+Math.cos(a)*.545,y+Math.sin(a)*.545,z+1.4],[x+Math.cos(a)*.451,y+Math.sin(a)*.451,z+h-1.4],P.stone,.065);
    }
    cylinder(S,x,y,z+h-1.1,z+h-.45,.46,.77,P.stone,P.stoneR,P.stoneHi,10);
    S.box(x-.87,x+.87,y-.87,y+.87,z+h-.45,z+h,P.stone,P.stoneR,P.stoneHi);
  }
  function pediment(S,x0,x1,y0,y1,z,rise) {
    const c=(x0+x1)/2;
    for(const y of[y0,y1]){
      S.poly([[x0,y,z],[x1,y,z],[c,y,z+rise]],P.stone);
      S.poly([[x0+1.0,y+(y===y1?.04:-.04),z+.52],[x1-1,y+(y===y1?.04:-.04),z+.52],[c,y+(y===y1?.04:-.04),z+rise-1.0]],P.stoneR,.03);
      S.beam([x0-.25,y,z],[c,y,z+rise+.25],P.stoneHi,.6);
      S.beam([c,y,z+rise+.25],[x1+.25,y,z],P.stoneHi,.6);
    }
    S.poly([[x0,y0,z],[c,y0,z+rise],[c,y1,z+rise],[x0,y1,z]],slate(false));
    S.poly([[x1,y0,z],[x1,y1,z],[c,y1,z+rise],[c,y0,z+rise]],slate(true));
  }
  function flowerBed(S,x0,x1,y0,y1,z) {
    S.flat(x0,x1,y0,y1,z,P.soil);
    for(let x=x0+.75;x<x1-.35;x+=1.75)for(let y=y0+.75;y<y1-.35;y+=1.65){
      const k=(Math.floor(x)+Math.floor(y))%5;
      S.beam([x,y,z],[x,y,z+1.25],P.leaf[3],.13);
      S.poly([[x-.4,y,z+.4],[x+.2,y+.45,z+.8],[x+.5,y,z+.9]],P.leaf[0]);
      blossom(S,x,y,z+1.2,.42,P.flower[k]);
    }
  }
  function parterre(S,x0,x1,y0,y1,z) {
    S.flat(x0,x1,y0,y1,z,grass);
    for(const [a,b,c,d]of[[x0,x1,y0,y0+1.1],[x0,x1,y1-1.1,y1],[x0,x0+1.1,y0,y1],[x1-1.1,x1,y0,y1]])hedge(S,a,b,c,d,z,1.35);
    flowerBed(S,x0+2,x1-2,y0+2,y1-2,z+.03);
    S.flat((x0+x1)/2-.55,(x0+x1)/2+.55,y0+1.15,y1-1.15,z+.06,gravel);
  }
  function reflectingPond(S,x0,x1,y0,y1,z) {
    const cut=Math.min(1.6,(x1-x0)/6),pts=[[x0+cut,y0],[x1-cut,y0],[x1,y0+cut],[x1,y1-cut],[x1-cut,y1],[x0+cut,y1],[x0,y1-cut],[x0,y0+cut]];
    const cx=(x0+x1)/2,cy=(y0+y1)/2;
    S.poly(pts.map(p=>[p[0],p[1],z+.05]),(x,y)=>{
      const n=hash(Math.floor(x*2),Math.floor(y*2),14195);
      return n%37===0?WATERHI:n%13===0?C('486b68'):WATER;
    });
    for(let i=0;i<pts.length;i++){
      const a=pts[i],b=pts[(i+1)%pts.length];
      S.beam([a[0],a[1],z+.43],[b[0],b[1],z+.43],P.stoneHi,.83);
      S.wall(a,b,z-.4,z+.4,P.stoneD);
    }
    // Physical pale ripples and three lily pads; water has no night emission.
    for(const [x,y,w]of[[cx-2,cy-2,2.1],[cx+.6,cy+2.3,1.7],[cx-1,cy+3.6,1.1]])S.flat(x,x+w,y,y+.11,z+.065,WATERHI);
    for(const [x,y]of[[x0+2.1,y0+2.5],[x0+2.8,y0+3.3],[x1-2.1,y1-2.2]])cylinder(S,x,y,z+.06,z+.12,.45,.45,P.leaf[2],P.leaf[3],P.leaf[2],8);
  }
  function manor(view) {
    const S=Scene(4,view,304,320);foundation(S,64);
    S.flat(1.6,62.4,1.6,62.4,.57,grass);
    S.flat(2.6,61.4,4,38,.61,gravel);S.flat(2.6,61.4,38,61.5,.62,gravel);
    const B=manorBlock(S,18,46,7,28,1.1,31.8,false);
    manorBlock(S,4.2,16,12,29,1.1,22.4,true);manorBlock(S,48,59.8,12,29,1.1,22.4,true);
    // Lower linking corridors are separate masses, preserving the Palladian plan.
    for(const [x0,x1]of[[15.8,18.2],[45.8,48.2]]){
      stoneBlock(S,x0,x1,15,25,1.1,13,1452);hippedRoof(S,x0-.2,x1+.2,14.8,25.2,13.3,3.2,false);
    }
    S.box(4,60,28.5,38,0.63,2.2,P.stone,P.stoneR,paving);
    for(let i=0;i<5;i++)S.box(25-i*.2,39+i*.2,37.8+i*.72,38.8+i*.72,.61,2.2-i*.30,P.stone,P.stoneR,P.stoneHi);
    for(const x of[25.1,29.7,34.3,38.9])classicalColumn(S,x,34.8,2.2,18.6);
    S.box(23.9,40.1,28,36,20.8,22.1,P.stone,P.stoneR,P.stoneHi);
    for(let x=24.4;x<40;x+=1.35)S.box(x,x+.44,35.8,36.45,20.2,20.8,P.stoneHi,P.stoneR,P.stoneHi);
    pediment(S,23.4,40.6,28,36.2,22.2,5.6);
    const front=S.face([18,28],[46,28],0,1);
    timberDoor(front,11.5,2.2,5,12.2,true);archWindow(S,front,11.3,18.3,5.4,8.1,true);
    shield(S,S.face([23.4,36.23],[40.6,36.23],0,1),8.6,24.4,.8,false);
    balustrade(S,[4.6,37.5],[23.5,37.5],2.2,2.8);balustrade(S,[40.5,37.5],[59.4,37.5],2.2,2.8);
    for(const x of[4.6,59.4])balustrade(S,[x,29.4],[x,37.5],2.2,2.8);
    for(const x of[6.4,20.6,43.4,57.6])urn(S,x,35.8,2.2,1.0);
    for(const [x,y,z]of[[22.5,12,37],[41.5,12,37],[8.8,18,27.8],[54.8,18,27.8]])chimney(S,x,y,z,5,3);
    for(const [x0,x1,y0,y1]of[[5,23,41,48.6],[5,23,51,59.6],[41,59,41,48.6],[41,59,51,59.6]])parterre(S,x0,x1,y0,y1,.67);
    reflectingPond(S,26,38,44,59,.67);
    for(const x of[24.5,39.5])for(const y of[42,60.5])topiary(S,x,y,.67,4.1);
    for(const x of[2,62])for(const y of[43.5,57])topiary(S,x,y,.6,5.1);
    for(const x of[16.8,47.2])lantern(S,x,31.7,8.7,true);
    for(const x of[3,61]){S.flat(x-.6,x+.6,2.8,10.5,.65,gravel);pottedPlant(S,x,7,.67,.85,P.flower[2]);}
    return S.finish({kind:285,design:'Palladian-country-manor',features:FEATURES[285],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function glassHouse(S,x0,x1,y0,y1,z,eave,rise,central) {
    const cx=(x0+x1)/2,cy=(y0+y1)/2;
    const B=stoneBlock(S,x0,x1,y0,y1,z,z+2.2,1466);
    const faces=[S.face([x0,y1],[x1,y1],0,1),S.face([x1,y0],[x0,y0],0,-1),S.face([x1,y1],[x1,y0],1,0),S.face([x0,y0],[x0,y1],-1,0)];
    for(const F of faces){
      const n=Math.max(2,Math.round(F.length/2.5)),step=F.length/n;
      for(let i=0;i<n;i++){
        const u=i*step;
        F.panel(u+.12,u+step-.12,z+2.25,eave-.2,(x,y)=>{
          if(Math.abs(y-(eave-z-2.25)*.54)<.12)return P.frame;
          // Muted planted silhouettes are on the greenhouse glazing surface.
          const leaf=(y<3.7&&Math.abs(x-step*.5)<.25+y*.12);
          if(leaf)return P.leaf[i%4];
          if(central&&i%3===1&&y>3.9)return GLOW[2];
          return (i%2?P.canopyR:P.glassHi);
        },.05);
        F.block(u-.08,u+.08,-.08,.15,z+2.15,eave+.18,P.frame,P.frameR,P.frame);
      }
      for(const zz of[z+2.2,eave])F.block(-.1,F.length+.1,-.1,.2,zz-.13,zz+.13,P.frame,P.frameR,P.frame);
    }
    const roofGlass=(x,y,zz)=>{
      const t=mod(y-y0,2.25);if(t<.15||mod(zz-eave,2.6)<.13)return P.frame;
      return hash(Math.floor(x*2),Math.floor(y/2.25),14286)%5===0?P.canopyHi:P.canopy;
    };
    S.poly([[x0,y0,eave],[cx,y0,eave+rise],[cx,y1,eave+rise],[x0,y1,eave]],roofGlass);
    S.poly([[x1,y0,eave],[x1,y1,eave],[cx,y1,eave+rise],[cx,y0,eave+rise]],roofGlass);
    for(const y of[y0,y1]){
      S.poly([[x0,y,eave],[x1,y,eave],[cx,y,eave+rise]],P.glassHi);
      for(let x=x0+1;x<x1;x+=1.5){const hh=rise*(1-Math.abs(x-cx)/((x1-x0)/2));S.beam([x,y,eave],[x,y,eave+hh],P.frame,.16);}
      S.beam([x0,y,eave],[cx,y,eave+rise],P.frame,.22);S.beam([cx,y,eave+rise],[x1,y,eave],P.frame,.22);
    }
    for(let y=y0;y<=y1+.01;y+=2.25){
      S.beam([x0,y,eave],[cx,y,eave+rise],P.frame,.19);S.beam([cx,y,eave+rise],[x1,y,eave],P.frame,.19);
    }
    S.beam([cx,y0,eave+rise+.1],[cx,y1,eave+rise+.1],P.frame,.3);
    for(const y of[y0+.3,cy,y1-.3]){
      cylinder(S,cx,y,eave+rise,eave+rise+.5,.3,.3,P.frame,P.frameR,P.frame,6);
      cylinder(S,cx,y,eave+rise+.5,eave+rise+1.55,.27,0,P.frame,P.frameR,P.frame,6);
    }
    for(const x of[x0,x1])rainpipe(S,x,y0,eave);
    if(central){
      S.box(cx-.65,cx+.65,cy-2.9,cy+2.9,eave+rise-.2,eave+rise+.9,P.frame,P.frameR,P.frame);
      for(let y=cy-2.5;y<cy+2.9;y+=.6)S.box(cx-.7,cx+.7,y,y+.17,eave+rise+.2,eave+rise+.65,P.iron,P.ironD,P.frame);
    }
  }
  function conservatory(view) {
    const S=Scene(2,view,160,196);foundation(S,32);
    S.flat(1,31,1,31,.57,gravel);
    for(const x of[6.2,15.2,25.8])for(const y of[11.5,19.5])pottedPlant(S,x,y,.66,1.45,P.flower[2]);
    glassHouse(S,3,10,8,25,.65,12.7,5.4,false);glassHouse(S,22,29,8,25,.65,12.7,5.4,false);
    glassHouse(S,10,22,5,27,.65,17,8,true);
    const door=S.face([10,27],[22,27],0,1);timberDoor(door,4,.65,4,10.5,true);
    S.box(12.2,19.8,27.4,29.4,.59,.95,P.stone,P.stoneR,P.stoneHi);
    for(const x of[8,24])urn(S,x,28.2,.62,.85);
    // Two actual wall lights provide sparse warm night detail, never glass halos.
    wallLamp(S,door,2.2,8.7);wallLamp(S,door,9.8,8.7);
    S.box(3,7,2.3,4.5,2.6,2.95,P.wood,P.woodR,P.woodHi);
    for(const x of[3.3,6.7])for(const y of[2.5,4.3])S.box(x-.14,x+.14,y-.14,y+.14,.62,2.6,P.wood,P.woodR,P.woodHi);
    for(const x of[3.8,5.3,6.4])pottedPlant(S,x,3.2,2.95,.32,P.flower[1]);
    cylinder(S,28.8,4.8,.62,4.8,1.0,1.1,P.wood,P.woodR,P.woodD,10);
    for(const z of[1.4,3.8])cylinder(S,28.8,4.8,z,z+.23,1.12,1.12,P.iron,P.ironD,P.woodD,10);
    S.beam([29,8,8.5],[29,4.8,4.9],P.iron,.25);
    return S.finish({kind:286,design:'manor-conservatory',features:FEATURES[286],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function stableDoor(S,F,u,z,w,h,openTop) {
    F.block(u-.32,u+w+.32,.02,.33,z,z+h+.45,P.stone,P.stoneR,P.stoneHi);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.15||x>w-.15||y<.15||y>h-.15)return P.woodD;
      if(Math.abs(y-h*.47)<.22||mod(x,.77)<.075)return P.woodD;
      if(openTop&&y>h*.5)return P.ink;
      if(Math.abs(y-(x/w)*(h*.43)-.1)<.17||Math.abs(y-(1-x/w)*(h*.43)-.1)<.17)return P.woodHi;
      return P.wood;
    },.37);
    for(const zz of[z+1.2,z+h*.39,z+h*.76])F.panel(u+.2,u+w-.2,zz,zz+.14,P.iron,.40);
    F.panel(u+w-.55,u+w-.3,z+h*.42,z+h*.55,P.ironD,.43);
    for(const uu of[u-.54,u+w+.54])ring(S,F,uu,z+3,.26,.31,.10,.38,P.iron,10);
  }
  function stableRange(S,x0,x1,y0,y1,h,alongX) {
    const B=masonry(S,x0,x1,y0,y1,.63,h,1487);band(S,x0,x1,y0,y1,h-.5,.65);
    for(const key of['front','back','right','left']){
      const F=B[key];quoin(S,F,.05,.8,h-1.3,.45);quoin(S,F,F.length-.5,.8,h-1.3,.45);
      const n=Math.max(1,Math.floor(F.length/6.2)),step=F.length/n;
      for(let i=0;i<n;i++){
        stableDoor(S,F,(i+.5)*step-1.8,.65,3.6,7.5,(i+key.length)%3===0);
        if(h>15)F.panel((i+.5)*step-1,(i+.5)*step+1,11.9,14.3,(x,y)=>Math.abs(x-1)<.1?P.frame:P.glassR,.10);
      }
    }
    gableRoof(S,x0-.3,x1+.3,y0-.3,y1+.3,h+.15,6.2,alongX,undefined,brick(false,145));
    return B;
  }
  function stable(view) {
    const S=Scene(2,view,160,196);foundation(S,32);
    S.flat(2,30,2,30,.6,(x,y)=>mod(y,1.3)<.13||mod(x+(Math.floor(y/1.3)&1)*.8,1.6)<.13?P.seam:hash(Math.floor(x),Math.floor(y),1477)%5?P.paveR:P.stoneR);
    stableRange(S,3,29,3,11,17,true);
    const left=stableRange(S,3,10,11,27,13,false),right=stableRange(S,22,29,11,27,13,false);
    for(const F of[left.right,right.left])for(const u of[3.5,10.5])stableDoor(S,F,u-1.8,.65,3.6,7.8,true);
    const hay=S.face([3,11],[29,11],0,1);stableDoor(S,hay,10.8,10.2,4.4,5.6,false);
    S.beam([16,11.4,16.2],[16,13.6,16.2],P.woodD,.40);
    S.beam([16,11.4,14.2],[16,13.3,16.2],P.wood,.32);
    S.beam([16,13.6,16.2],[16,13.6,12.4],P.iron,.11);
    // A low functional ridge ventilator, deliberately not a clock tower.
    S.box(14.2,17.8,5.5,8.5,22.8,26.1,P.wood,P.woodR,P.woodHi);
    for(const y of[5.48,8.52])for(let z=23.3;z<25.9;z+=.48)S.box(14.45,17.55,y-.04,y+.04,z,z+.16,P.ink,P.ink,P.woodR);
    hippedRoof(S,13.7,18.3,5,9,26.1,2.3,true);
    S.beam([16,7,28.2],[16,7,30.3],P.iron,.15);
    S.poly([[14.4,7,29.7],[17.4,7,29.7],[16.6,7,30.15],[17.4,7,30.55],[14.4,7,30.55]],P.iron);
    S.box(11.3,12.7,15.1,20.1,.63,2.3,P.stone,P.stoneR,P.stoneHi);
    S.flat(11.55,12.45,15.35,19.85,2.31,WATER);
    for(const [x,y]of[[20.2,14],[20.2,16.5]]){
      S.box(x-1,x+1,y-1,y+1,.62,2.4,C('b99b56'),C('927c46'),C('ccaf67'));
      for(const yy of[y-.65,y+.55])S.beam([x-1.02,yy,1.5],[x+1.02,yy,1.5],P.woodD,.16);
    }
    S.flat(15.6,16.4,12,30,.65,P.ironD);
    for(let y=12;y<30;y+=.7)S.flat(15.67,16.33,y,y+.16,.67,P.lead);
    for(const x of[10.8,21.2])lantern(S,x,28.6,6.7,true);
    return S.finish({kind:287,design:'manor-stable-court',features:FEATURES[287],lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function pathBase(S,collegeTheme) {
    foundation(S,16);
    S.flat(.3,15.7,.3,15.7,.58,collegeTheme?paving:gravel);
    // These are flush paving courses, not raised barriers across pedestrian flow.
    for(const x of[5.05,10.7])S.flat(x,x+.25,.35,15.65,.60,collegeTheme?P.stoneR:P.stone);
    for(let y=1;y<16;y+=3.6)S.flat(5.31,10.69,y,y+.08,.61,P.paveR);
  }
  function moduleSprite(theme,view) {
    const S=Scene(1,view,72,92),col=theme.indexOf('college')===0;
    pathBase(S,col);
    if(theme==='collegeGate'){
      for(const [x,y,h]of[[3.25,4.1,12.0],[12.9,4.1,9.5]]){
        stoneBlock(S,x-.85,x+.85,y-.85,y+.85,.6,h,1440);
        S.box(x-1.13,x+1.13,y-1.08,y+1.08,h-.3,h+.35,P.stone,P.stoneR,P.stoneHi);
        cylinder(S,x,y,h+.35,h+2.45,.75,.12,P.stone,P.stoneR,P.stoneHi,4);
        const F=S.face([x-.85,y+.86],[x+.85,y+.86],0,1);shield(S,F,.85,h-2.7,.42,true);
      }
      ironRail(S,[3.25,6],[3.25,15.3],.62,4.2);
      ironRail(S,[12.9,5.7],[12.9,12.9],.62,4.2);
      lantern(S,3.25,11.1,8.2,true);
      S.flat(12.0,13.8,14.1,15.2,.62,P.stoneHi);
    }else if(theme==='collegeCloister'){
      cloister(S,12.5,15.6,.8,15.2,false);
      // Small carved bosses belong to the side arcade, above the open floor.
      const F=S.face([15.62,15.2],[15.62,.8],1,0);
      for(const u of[3.1,10.3])shield(S,F,u,8.2,.37,false);
      bench(S,1.3,5.1,6.7,false);
      lantern(S,2.8,1.8,7.9,true);
    }else if(theme==='collegeLibraryWalk'){
      S.box(1.1,4.2,2.1,3.0,.62,8.9,P.stone,P.stoneR,P.stoneHi);
      const F=S.face([1.1,3.03],[4.2,3.03],0,1);
      shield(S,F,1.55,6.9,.67,true);
      F.panel(.55,2.55,2.0,4.4,P.woodD,.1);
      for(const z of[2.5,3.1,3.7])F.panel(.9,2.2,z,z+.11,P.gold,.13);
      bench(S,1.55,6.2,7.4,false);
      S.flat(2,3.25,8.2,9.4,2.76,P.paper);
      S.beam([2.625,8.2,2.78],[2.625,9.4,2.78],P.woodR,.09);
      lantern(S,13.8,4.1,9.4,true);
      pottedPlant(S,13.7,12,.62,.7,P.flower[2]);
    }else if(theme==='collegeGarden'){
      S.box(.8,4.6,2.2,13.9,.61,1.03,P.stone,P.stoneR,P.soil);
      flowerBed(S,1.2,4.2,2.6,8.0,1.05);
      hedge(S,1.2,4.2,9.5,13.4,1.03,1.9);
      sundial(S,13.45,6.5,.62);
      pottedPlant(S,13.4,12.8,.62,.7,P.flower[0]);
      lantern(S,2.8,1.2,7.6,true);
    }else if(theme==='manorGate'){
      for(const [x,y,h]of[[3.2,3.2,9.4],[12.8,3.2,10.7]]){
        stoneBlock(S,x-.86,x+.86,y-.86,y+.86,.62,h,1431);
        S.box(x-1.1,x+1.1,y-1.1,y+1.1,h-.2,h+.36,P.stone,P.stoneR,P.stoneHi);
        urn(S,x,y,h+.36,.75);
      }
      ironRail(S,[3.2,5.1],[3.2,15.3],.63,5.7);
      ironRail(S,[12.8,5.1],[12.8,15.3],.63,5.7);
      // Open gate leaves fold parallel to the boundary, keeping central access.
      ironRail(S,[4.0,5.0],[4.0,9.5],.63,4.9);
      lantern(S,12.8,10.7,8.9,true);
    }else if(theme==='manorTerrace'){
      S.flat(.35,15.65,.35,15.65,.62,paving);
      balustrade(S,[14,1],[14,15],.64,4.1);
      for(const y of[1.1,14.8])urn(S,14,y,5.0,.62);
      bench(S,1.5,5.2,7.8,false);
      lantern(S,2.65,1.75,9.4,true);
      S.flat(3.6,4.4,11.4,12.8,.65,P.stoneHi);
    }else if(theme==='manorParterre'){
      parterre(S,.7,4.7,1.2,14.8,.62);
      // Narrow flower ribbons complement rather than obstruct the central path.
      S.flat(11.7,15.3,2.1,12.9,.62,P.soil);
      hedge(S,11.7,12.6,2.1,12.9,.64,1.15);
      flowerBed(S,12.8,15.2,2.5,12.5,.66);
      topiary(S,13.65,14.4,.64,3.8);
      lantern(S,2.7,1.55,8.2,true);
    }else if(theme==='manorPond'){
      reflectingPond(S,1.1,4.5,3.5,13.6,.64);
      S.box(12.2,15.1,5.3,10.7,.62,1.05,P.stone,P.stoneR,P.soil);
      flowerBed(S,12.6,14.7,5.7,10.3,1.07);
      urn(S,13.6,12.8,.65,.7);
      lantern(S,2.8,1.35,8.1,true);
    }
    return S.finish({theme,pathAxis:'y',minimumClearPath:5.4,
      clearWalkStrip:[5.3,10.7],design:theme,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function buildAll() {
    const buildings={282:[],283:[],284:[],285:[],286:[],287:[]},modules={};
    for(let view=0;view<4;view++){
      buildings[282].push(college(view));buildings[283].push(library(view));buildings[284].push(residence(view));
      buildings[285].push(manor(view));buildings[286].push(conservatory(view));buildings[287].push(stable(view));
      for(const theme of themes)modules[theme+'_'+view]=moduleSprite(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishCollegeManor014=Object.freeze({version:'GPT-014-college-manor-r1',original:true,simulationRandomCalls:0,
    nativeCellUnits:16,themes:Object.freeze(themes.slice()),featureManifest:Object.freeze(FEATURES),buildAll});
})(typeof window==='undefined'?globalThis:window);
