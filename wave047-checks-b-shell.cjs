'use strict';
// C3 independent world-space assertions retain every C2 B-group contract.
// The C2 module remains byte-identical; only Campion and Woodruff dimensions change.
// Only recorded drawn surfaces are evidence. Returned model flags are not read.
module.exports=function(U){
  const {assert,P,close,polykey,minz,maxz,area,vertices,uniquePoints,hasVertex,
    materialPolygons,isPoly,wallQ,requireWall,requireBoxWalls,cast,topsWith,
    heightsAt,assertOpen,assertSolid,assertGlazingBacking,assertPartition,
    assertMeshClosed}=U;
  const checks={},mutations=[];
  const roofPolygons=t=>materialPolygons(t,'slate');
  const sumArea=ps=>ps.reduce((s,p)=>s+Math.abs(area(p)),0);
  const flatQ=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
  function requireFace(t,q,label){assert(isPoly(t,q),label);}
  function emptyRay(t,axis,u,v,lo,hi,label){assert(cast(t,axis,u,v).every(n=>n<lo-1e-7||n>hi+1e-7),label);}
  function removeAt(t,i){
    assert(i>=0,'negative fixture must locate its actual drawn surface');
    t.polygons.splice(i,1);t.materials.splice(i,1);t.materialValues.splice(i,1);
  }
  function removeExact(t,q){removeAt(t,t.polygons.findIndex(p=>polykey(p)===polykey(q)));}
  function addFace(t,q,value=P.stoneR){t.polygons.push(q);t.materials.push('solid');t.materialValues.push(value);}
  function negative(name,id,mutate,pattern){mutations.push({name,id,mutate,pattern});}

  // The roof is one short level gable with two genuinely inclined gabled runs.
  // Each run is ten units long and rises eight, with eight distinct full treads.
  function assertCatmint(t){
    for(const [xa,xb]of[[10,11.4],[20.6,22]])for(const [ya,yb]of[[12,13.2],[18.8,20]])
      requireBoxWalls(t,xa,xb,ya,yb,.42,8.15,'Catmint four grounded slender central bearing piers');
    requireBoxWalls(t,10,22,12,20,8.15,8.65,'Catmint thick level central floor joins both stair runs');
    for(const z of[8.15,8.65])requireFace(t,flatQ(10,22,12,20,z),'Catmint real upper floor and exposed central soffit');
    for(const y of[14,16,18])for(const z of[2,5,7.7])
      emptyRay(t,0,y,z,9.9,22.1,'Catmint central span remains genuinely open below its floor');
    for(const reverse of[false,true]){
      for(let i=0;i<8;i++){
        const a=i*1.25,b=(i+1)*1.25,za=.65+.8*a,zb=.65+.8*b;
        const ya=reverse?30-a:2+a,yb=reverse?30-b:2+b;
        requireFace(t,flatQ(11,21,Math.min(ya,yb),Math.max(ya,yb),zb),'Catmint sixteen real rising tread tops meet central landing');
        requireFace(t,[[11,ya,za-.5],[11,yb,zb-.5],[21,yb,zb-.5],[21,ya,za-.5]],'Catmint opposed continuous inclined stair soffits are not ground wedges');
        requireWall(t,[11,ya],[21,ya],za-.5,zb,'Catmint real full-width stair risers visible from open portals');
      }
      const ya=reverse?20:2,yb=reverse?30:12,za=reverse?8.65:.65,zb=reverse?.65:8.65;
      for(const x of[10,11,21,22])requireFace(t,[[x,ya,za-.5],[x,yb,zb-.5],[x,yb,zb+8.15],[x,ya,za+8.15]],'Catmint actual thick enclosed sloping stair sidewalls');
      const y=reverse?26:6;
      emptyRay(t,0,y,1.8,9.8,22.2,'Catmint visible open ground beneath both inclined stair ranges');
      const portal=reverse?[29.4,30]:[2,2.6];
      for(const x of[12.3,16,19.7])for(const z of[2.2,4.5,6.7])
        emptyRay(t,1,x,z,...portal,'Catmint two true open endpoint portals expose the stairs');
      for(const [xa,xb]of[[10,11],[21,22]])requireBoxWalls(t,xa,xb,...portal,.42,8.4,'Catmint both end portals have substantial grounded jambs');
      requireBoxWalls(t,11,21,...portal,7,8.4,'Catmint both end portals have real lintel thickness');
    }
    for(const y of[13,19])for(const z of[10.2,12.6])for(const xx of[[10,11],[21,22]])
      emptyRay(t,0,y,z,...xx,'Catmint actual side landing openings expose the upper stair transition');
    const roof=roofPolygons(t);
    assert.equal(roof.length,12,'Catmint six complete non-overlapping gabled roof slopes');
    assert(close(sumArea(roof),12.6*28),'Catmint roof covers all three contiguous circulation ranges');
    for(const p of roof.flat()){
      const level=p[1]<=12?12+.8*(p[1]-2):p[1]>=20?12+.8*(30-p[1]):20;
      assert(close(p[2],level-Math.abs(p[0]-16)*3.2/6.3),'Catmint opposing descending roof pitches meet the level central crown');
    }
    assertPartition(roof,'Catmint');assertMeshClosed(t,roof,.4,'Catmint');assertGlazingBacking(t,'Catmint');
  }
  checks.catmintbridge=assertCatmint;
  negative('remove-covered-bridge-central-pier-face','catmintbridge',t=>removeExact(t,wallQ([10,12],[11.4,12],.42,8.15)),/four grounded slender central bearing piers/);
  negative('erase-real-upward-stair-tread','catmintbridge',t=>removeExact(t,flatQ(11,21,5.75,7,4.65)),/sixteen real rising tread tops/);
  negative('remove-covered-bridge-ramp-soffit','catmintbridge',t=>removeExact(t,[[11,5.75,3.15],[11,7,4.15],[21,7,4.15],[21,5.75,3.15]]),/continuous inclined stair soffits/);
  negative('seal-covered-bridge-endpoint-portal','catmintbridge',t=>addFace(t,wallQ([11,2],[21,2],.65,7)),/two true open endpoint portals/);
  negative('flatten-covered-bridge-descending-roof','catmintbridge',t=>{
    const q=roofPolygons(t).find(p=>hasVertex(p,[16,2,12]));assert(q,'actual low ridge facet');q.find(p=>close(p[1],2)&&close(p[0],16))[2]+=1;
  },/opposing descending roof pitches/);

  // A square-to-octagon broach is not an octagonal room on a square room.
  // Its cardinal lower facets continue the eight-face spire, while four separate
  // corner planes close the square corners. There are no vertical drum walls.
  function assertPeriwinkle(t){
    for(const box of[[7,25,7,8],[7,8,8,25],[24,25,8,25],[8,13.5,24,25],[18.5,24,24,25]])
      requireBoxWalls(t,...box,.6,11,'Periwinkle low thick square masonry bellroom');
    requireBoxWalls(t,13.5,18.5,24,25,7.6,11,'Periwinkle doorway has an actual thick masonry head');
    for(const x of[14.3,16,17.7])for(const z of[2,5.8])
      emptyRay(t,1,x,z,24.5,25.05,'Periwinkle ground entrance is truly recessed behind the outer wall');
    requireFace(t,wallQ([13.5,24.24],[18.5,24.24],.6,7.6),'Periwinkle real set-back timber loading door');
    const lo=7+27/23.6,hi=25-27/23.6,z=11.4,z1=14.4,apex=[16,16,35];
    const q=[[7,7,z],[25,7,z],[25,25,z],[7,25,z]];
    const r=[[12,lo,z1],[20,lo,z1],[hi,12,z1],[hi,20,z1],[20,hi,z1],[12,hi,z1],[lo,20,z1],[lo,12,z1]];
    const roof=roofPolygons(t);
    for(let i=0;i<4;i++){
      const corner=(i+1)%4,b=2*i+1,next=(2*i+2)%8;
      requireFace(t,[q[corner],r[next],r[b]],'Periwinkle four true corner broach transition planes');
    }
    const spire=roof.filter(p=>hasVertex(p,apex));
    assert.equal(spire.length,8,'Periwinkle exactly eight dominant closed spire faces');
    for(let i=0;i<8;i++)requireFace(t,[r[i],r[(i+1)%8],apex],'Periwinkle eight actual octagonal eaves converge on one central apex');
    const low=roof.filter(p=>maxz(p)<15);
    assert.equal(low.length,12,'Periwinkle four triangular broaches and four triangulated cardinal transitions');
    assert.equal(roof.length,20,'Periwinkle one complete broach roof without a stacked cap');
    assert(close(sumArea(roof),324),'Periwinkle broach and spire cover the complete square without holes');
    const broachKeys=new Set(q.map((_,i)=>polykey([q[(i+1)%4],r[(2*i+2)%8],r[2*i+1]])));
    const cardinal=low.filter(p=>!broachKeys.has(polykey(p)));
    assert.equal(cardinal.length,8,'Periwinkle four complete lower cardinal slopes');
    for(const p of cardinal)assert(
      p.every(v=>close(v[2],35-(35-11.4)*(16-v[1])/9))||
      p.every(v=>close(v[2],35-(35-11.4)*(v[1]-16)/9))||
      p.every(v=>close(v[2],35-(35-11.4)*(16-v[0])/9))||
      p.every(v=>close(v[2],35-(35-11.4)*(v[0]-16)/9)),
      'Periwinkle cardinal lower slopes continue the spire rather than form a drum');
    // Independently prove continuity with the cardinal spire planes. Their
    // normals do not turn into an upright room at the octagonal transition.
    for(const y of[lo,hi])for(const x of[12,20])assert(hasVertex(roof.flat(),[x,y,z1]),'Periwinkle cardinal transition has genuine octagonal eaves');
    assert(maxz(roof.flat())-minz(roof.flat())>2*(11-.6),'Periwinkle roof dominates the low square room');
    for(const p of t.polygons)if(minz(p)>=11.4-1e-7&&maxz(p)>11.8&&Math.abs(area(p))<1e-9)
      assert(maxz(p)-minz(p)<=.400001,'Periwinkle no intervening vertical octagonal room or drum');
    assertPartition(roof,'Periwinkle');assertMeshClosed(t,roof,.4,'Periwinkle');assertGlazingBacking(t,'Periwinkle');
  }
  checks.periwinklebell=assertPeriwinkle;
  negative('remove-bellroom-grounded-masonry-face','periwinklebell',t=>removeExact(t,wallQ([7,7],[25,7],.6,11)),/low thick square masonry bellroom/);
  negative('remove-actual-corner-broach-plane','periwinklebell',t=>{
    const lo=7+27/23.6,hi=25-27/23.6;removeExact(t,[[25,7,11.4],[hi,12,14.4],[20,lo,14.4]]);
  },/four true corner broach transition planes/);
  negative('open-one-of-eight-spire-faces','periwinklebell',t=>removeAt(t,t.polygons.findIndex((p,i)=>t.materials[i]==='slate'&&hasVertex(p,[16,16,35]))),/exactly eight dominant closed spire faces/);
  negative('fill-bellroom-recessed-doorway','periwinklebell',t=>addFace(t,wallQ([13.5,25],[18.5,25],.6,7.6)),/ground entrance is truly recessed/);


  function assertCampion(t){
    // The independent section fixes an upper-floor arrival at z10, a real
    // 12.7-unit bank slope, and the opposite deep ground-level arcade.
    const slope=[[7,1.5,.45],[25,1.5,.45],[25,14.2,10],[7,14.2,10]];
    requireFace(t,slope,'Campion substantial rising bank reaches the upper rear landing');
    requireFace(t,flatQ(7,25,1.5,14.2,.43),'Campion bank is a closed model-owned solid');
    for(const x of[7,25])requireFace(t,[[x,1.5,.43],[x,14.2,.43],[x,14.2,10],[x,1.5,.45]],'Campion bank has real closed side faces');
    requireFace(t,flatQ(7,25,14.2,16,10),'Campion level bank landing and upper door share one floor elevation');
    for(const [x0,x1]of[[6.3,7],[25,25.7]]){
      requireFace(t,[[x0,1.5,.6],[x1,1.5,.6],[x1,14.2,10.15],[x0,14.2,10.15]],'Campion both full sloped masonry retaining cheeks');
      requireBoxWalls(t,x0,x1,14.2,16,.43,10.15,'Campion retaining cheeks continue around the level landing');
    }
    requireBoxWalls(t,3.5,28.5,16,29.5,9.4,10,'Campion real intermediate floor connects bank and lower arcade');
    for(const z of[9.4,10])requireFace(t,flatQ(3.5,28.5,16,29.5,z),'Campion complete upper floor has a real lower soffit');
    for(const [x0,x1]of[[3.5,4.65],[27.35,28.5]])requireBoxWalls(t,x0,x1,16,29.5,.65,9.4,'Campion deep ground-level masonry side enclosure');
    requireBoxWalls(t,4.65,27.35,16,17.15,.65,9.4,'Campion rear ground retaining wall holds the bank outside the arcade');
    for(const [x0,x1]of[[3.5,5],[11.3,12.8],[19.2,20.7],[27,28.5]])requireBoxWalls(t,x0,x1,27.25,29.5,.65,9.4,'Campion four actual grounded front arcade piers');
    for(const c of[8.15,16,23.85])for(const x of[c-1.7,c,c+1.7])for(const z of[1.5,3.5,5.8,7.8])
      emptyRay(t,1,x,z,17.2,29.5,'Campion three genuinely deep open lower arcade bays');
    const arch=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneD&&p.length===4&&minz(p)>=5.4-1e-7&&maxz(p)<=8.8+1e-7&&p.every(v=>close(v[1],27.25)||close(v[1],29.5)));
    assert.equal(arch.length,48,'Campion forty-eight actual thick curved arch soffit facets');
    for(const p of arch){
      assert(close(Math.max(...p.map(v=>v[1]))-Math.min(...p.map(v=>v[1])),2.25),'Campion arcade arches have full masonry depth');
      assert([[8.15,3.15],[16,3.2],[23.85,3.15]].some(([cx,r])=>p.every(v=>close(((v[0]-cx)/r)**2+((v[2]-5.4)/3.4)**2,1))),'Campion three actual curved arch heads rather than painted openings');
    }
    requireBoxWalls(t,12.2,19.8,16.11,16.35,10,19.8,'Campion substantial upper rear loading door is bank-accessible');
    requireFace(t,flatQ(11.85,20.15,15.7,16.75,10),'Campion doorway threshold meets bank and upper floor exactly');
    for(const x of[13,16,19])for(const z of[11,15,19])
      emptyRay(t,1,x,z,15.5,16.05,'Campion bank approach reaches the recessed upper door without an intervening wall');
    const wallTop=20.6+6.9*.8/7.55-.55;
    requireBoxWalls(t,3.5,28.5,28.75,29.5,10,wallTop,'Campion upper barn is a substantial enclosed timber room');
    for(const box of[[3.5,4.25,16,28.75],[27.75,28.5,16,28.75]])requireBoxWalls(t,...box,10,wallTop,'Campion upper barn has both full-height timber side walls');
    for(const x of[3.5,4.25,27.75,28.5])requireFace(t,[[x,16,wallTop],[x,29.5,wallTop],[x,22.75,26.95]],'Campion both thick triangular gables bear against the roof underside');
    const roof=roofPolygons(t);
    assert.equal(roof.length,4,'Campion one complete ordinary two-slope gable');
    assert(close(sumArea(roof),26.5*15.1),'Campion whole broad barn is roofed without internal roof overlap');
    for(const p of roof.flat())assert(close(p[2],27.5-Math.abs(p[1]-22.75)*6.9/7.55),'Campion actual straight gable slopes share one horizontal ridge');
    assertPartition(roof,'Campion');assertMeshClosed(t,roof,.55,'Campion');assertGlazingBacking(t,'Campion');
  }
  checks.campionbarn=assertCampion;
  negative('erase-bank-barn-earth-approach','campionbarn',t=>removeExact(t,[[7,1.5,.45],[25,1.5,.45],[25,14.2,10],[7,14.2,10]]),/substantial rising bank/);
  negative('remove-bank-barn-front-bearing-pier','campionbarn',t=>removeExact(t,wallQ([11.3,29.5],[12.8,29.5],.65,9.4)),/four actual grounded front arcade piers/);
  negative('remove-bank-barn-floor-soffit','campionbarn',t=>removeExact(t,flatQ(3.5,28.5,16,29.5,9.4)),/complete upper floor has a real lower soffit/);
  negative('paint-over-bank-barn-arcade','campionbarn',t=>addFace(t,wallQ([5,29.5],[11.3,29.5],.65,8.8)),/three genuinely deep open lower arcade bays/);
  negative('remove-bank-barn-curved-arch-intrados','campionbarn',t=>removeAt(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.stoneD&&p.length===4&&minz(p)>5.4&&maxz(p)<8.8&&p.every(v=>close(v[1],27.25)||close(v[1],29.5)))),/forty-eight actual thick curved arch soffit facets/);

  function assertWoodruff(t){
    // Every short staddle has a closed tapered stem and independently wider
    // cap; the cap's upper ring is exactly at the continuous floor underside.
    for(const x of[7.5,16,24.5])for(const y of[4.5,15.6,27]){
      for(const [z0,z1,r0,r1,part]of[[.45,3.5,.95,.8,'stem'],[3.5,4.6,1.65,1.45,'mushroom cap']]){
        const lower=[],upper=[];
        for(let i=0;i<12;i++){
          const a=i*Math.PI/6,b=(i+1)*Math.PI/6;
          const p=[x+r0*Math.cos(a),y+r0*Math.sin(a),z0],q=[x+r0*Math.cos(b),y+r0*Math.sin(b),z0],r=[x+r1*Math.cos(b),y+r1*Math.sin(b),z1],v=[x+r1*Math.cos(a),y+r1*Math.sin(a),z1];
          requireFace(t,[p,q,r,v],'Woodruff each short staddle has a complete solid '+part);lower.push(p);upper.push(v);
        }
        requireFace(t,lower,'Woodruff each '+part+' has a real closed underside');
        requireFace(t,upper,'Woodruff each '+part+' has a real closed bearing surface');
      }
    }
    requireBoxWalls(t,7.5,24.5,4.5,27,4.6,5.7,'Woodruff continuous thick granary floor bears on all nine caps');
    for(const z of[4.6,5.7])requireFace(t,flatQ(7.5,24.5,4.5,27,z),'Woodruff full raised floor and exposed underside');
    for(const y of[10,20])for(const z of[.9,1.8,2.8,3.2,4.1])emptyRay(t,0,y,z,7.5,24.5,'Woodruff continuous low air gap remains open across the whole store');
    for(const x of[12,20])for(const z of[.9,1.8,2.8,3.2,4.1])emptyRay(t,1,x,z,4.5,26.9,'Woodruff low underfloor gap has no perimeter skirt or ground room');
    for(const box of[[7.5,8.15,4.5,27],[23.85,24.5,4.5,27],[8.15,23.85,4.5,5.15]])requireBoxWalls(t,...box,5.7,14.85,'Woodruff squat upper store has three complete solid enclosing sides');
    for(const box of[[10.55,11.2,22.1,27],[20.8,21.45,22.1,27]])requireBoxWalls(t,...box,5.7,14.85,'Woodruff recessed end porch has two full-depth solid cheeks');
    requireBoxWalls(t,11.2,20.8,22.1,22.8,5.7,14.85,'Woodruff end-loading porch terminates at a real set-back rear wall');
    for(const x of[12,16,20])for(const z of[6.5,9,13.5])emptyRay(t,1,x,z,23.35,27.05,'Woodruff loading porch is genuinely recessed and open at the short end');
    requireBoxWalls(t,12.9,19.1,22.8,23.04,5.7,11.8,'Woodruff real elevated timber door is deep inside the loading porch');
    for(let i=0;i<5;i++)requireFace(t,flatQ(12.8,19.2,27,31-i*.8,.45+5.25*(i+1)/5),'Woodruff five short loading steps meet the raised porch floor');
    const roof=roofPolygons(t),corners=[[7.5,4.5,15.4],[24.5,4.5,15.4],[24.5,27,15.4],[7.5,27,15.4]],ridge=[[16,12,19.8],[16,19.5,19.8]];
    assert.equal(roof.length,6,'Woodruff one complete broad low hipped roof');
    assert(close(sumArea(roof),17*22.5),'Woodruff hip covers the entire store and recessed porch');
    assert(roof.flat().every(p=>[...corners,...ridge].some(v=>v.every((n,i)=>close(n,p[i])))),'Woodruff actual four hips meet one short low ridge');
    for(const p of [...corners,...ridge])assert(hasVertex(roof.flat(),p),'Woodruff all hip corners and both ridge bearings are present');
    assertPartition(roof,'Woodruff');assertMeshClosed(t,roof,.55,'Woodruff');assertGlazingBacking(t,'Woodruff');
  }
  checks.woodruffgrain=assertWoodruff;
  negative('remove-granary-staddle-stem-face','woodruffgrain',t=>{
    const a=0,b=Math.PI/6;removeExact(t,[[7.5+.95*Math.cos(a),4.5+.95*Math.sin(a),.45],[7.5+.95*Math.cos(b),4.5+.95*Math.sin(b),.45],[7.5+.8*Math.cos(b),4.5+.8*Math.sin(b),3.5],[7.5+.8*Math.cos(a),4.5+.8*Math.sin(a),3.5]]);
  },/complete solid stem/);
  negative('remove-real-mushroom-cap-overhang','woodruffgrain',t=>{
    const a=0,b=Math.PI/6;removeExact(t,[[7.5+1.65*Math.cos(a),4.5+1.65*Math.sin(a),3.5],[7.5+1.65*Math.cos(b),4.5+1.65*Math.sin(b),3.5],[7.5+1.45*Math.cos(b),4.5+1.45*Math.sin(b),4.6],[7.5+1.45*Math.cos(a),4.5+1.45*Math.sin(a),4.6]]);
  },/complete solid mushroom cap/);
  negative('remove-granary-raised-floor-underside','woodruffgrain',t=>removeExact(t,flatQ(7.5,24.5,4.5,27,4.6)),/full raised floor and exposed underside/);
  negative('close-granary-air-gap-with-skirt','woodruffgrain',t=>addFace(t,wallQ([7.5,4.5],[7.5,27],.45,4.6)),/continuous low air gap/);
  negative('paint-over-granary-recessed-end-porch','woodruffgrain',t=>addFace(t,wallQ([11.2,27],[20.8,27],5.7,14.4)),/loading porch is genuinely recessed/);

  function assertSpeedwell(t){
    const roofAt=y=>28-5.2*(y-9.2)/16.1-.55;
    requireWall(t,[3,10],[27,10],.72,roofAt(10),'Speedwell full grounded high rear masonry wall bears the monopitch');
    for(const x of[3,3.85])requireFace(t,[[x,10.85,.72],[x,24.5,.72],[x,24.5,roofAt(24.5)],[x,10.85,roofAt(10.85)]],'Speedwell deep left end wall follows the roof underside');
    requireBoxWalls(t,26.15,27,10.85,24.5,.72,11.1,'Speedwell full lower right masonry end');
    requireBoxWalls(t,3,27,10,24.5,10.3,11.1,'Speedwell exposed thick intermediate floor spans both open work tiers');
    for(const z of[10.3,11.1])requireFace(t,flatQ(3,27,10,24.5,z),'Speedwell actual middle floor top and open ground-tier soffit');
    for(const x of[3.5,11.15,18.85,26.5])requireBoxWalls(t,x-.55,x+.55,23.95,24.85,.72,roofAt(24.4),'Speedwell four full-height grounded front bearing posts');
    for(const x of[7.3,15,22.7])for(const z of[2,5.5,9.2])emptyRay(t,1,x,z,10.86,24.9,'Speedwell ground work bays are genuinely deep open spaces');
    for(const x of[7.3,15,22.7])for(const z of[15,18,21])emptyRay(t,1,x,z,10.86,24.9,'Speedwell upper gallery is a second deep open tier not a closed house');
    for(const y of[12,13.5])for(const z of[12.5,16.8])emptyRay(t,0,y,z,26.15,27.05,'Speedwell upper side doorway is an actual open passage from the landing');
    requireBoxWalls(t,26.15,30.9,11.25,14.25,10.4,11.1,'Speedwell substantial exterior landing joins the open upper doorway');
    requireFace(t,flatQ(26.15,30.9,11.25,14.25,11.1),'Speedwell landing surface aligns exactly with the upper floor');
    for(let i=0;i<12;i++){
      const ya=30-(i+1)*15.75/12,yb=30-i*15.75/12,top=.45+(i+1)*10.65/12;
      requireFace(t,flatQ(27.5,30.9,ya,yb,top),'Speedwell twelve actual exterior treads rise to the gallery landing');
      requireWall(t,[27.5,yb],[30.9,yb],.45+i*10.65/12,top,'Speedwell exterior stair has real visible risers');
    }
    emptyRay(t,0,18,2,27.5,30.9,'Speedwell raised exterior stair is not a solid additional end room');
    const roof=roofPolygons(t);
    assert.equal(roof.length,2,'Speedwell one uninterrupted planar monopitch roof');
    assert(close(sumArea(roof),25.6*16.1),'Speedwell single roof covers both whole open tiers');
    for(const p of roof.flat())assert(close(p[2],28-5.2*(p[1]-9.2)/16.1),'Speedwell real roof descends from high rear masonry to low front posts');
    assertPartition(roof,'Speedwell');assertMeshClosed(t,roof,.55,'Speedwell');assertGlazingBacking(t,'Speedwell');
  }
  checks.speedwellseasoning=assertSpeedwell;
  negative('remove-seasoning-loft-middle-floor-soffit','speedwellseasoning',t=>removeExact(t,flatQ(3,27,10,24.5,10.3)),/actual middle floor top and open ground-tier soffit/);
  negative('erase-seasoning-loft-front-bearing-post','speedwellseasoning',t=>removeExact(t,wallQ([10.6,23.95],[11.7,23.95],.72,28-5.2*(24.4-9.2)/16.1-.55)),/four full-height grounded front bearing posts/);
  negative('fill-seasoning-loft-ground-work-bays','speedwellseasoning',t=>addFace(t,wallQ([4,24.5],[26,24.5],.72,9.85)),/ground work bays are genuinely deep/);
  negative('fill-seasoning-loft-upper-open-gallery','speedwellseasoning',t=>addFace(t,wallQ([4,24.5],[26,24.5],13.25,22)),/upper gallery is a second deep open tier/);
  negative('erase-seasoning-loft-exterior-stair-tread','speedwellseasoning',t=>removeExact(t,flatQ(27.5,30.9,22.125,23.4375,5.775)),/twelve actual exterior treads/);
  negative('flatten-seasoning-loft-single-pitch-roof','speedwellseasoning',t=>{
    const q=roofPolygons(t)[0];assert(q,'actual single-pitch roof facet');q.find(v=>close(v[1],9.2))[2]-=1;
  },/real roof descends from high rear masonry/);


  // C2 repair guards inspect the material bound to a real face, never metadata
  // or a screen-space rectangle. Their mutations remove actual drawn surfaces.
  function requirePaintedFace(t,q,value,label){
    const indices=[];for(let i=0;i<t.polygons.length;i++)if(polykey(t.polygons[i])===polykey(q))indices.push(i);
    assert.equal(indices.length,1,label+' is one actual surface, not a duplicate overlay');
    assert.equal(t.materialValues[indices[0]],value,label+' uses the actual opaque shaded material');
  }
  function worldShade(t,nx,ny,light,dark){
    const normal=[[nx,ny],[-ny,nx],[-nx,-ny],[ny,-nx]][t.view];
    assert(normal,'C2 shaded surface has one of four actual world views');
    return normal[0]>normal[1]?dark:light;
  }
  const campionBase=checks.campionbarn;
  checks.campionbarn=function(t){
    // The dark floor and rear are deep inside the preserved open arcade, not
    // a false dark front panel. Side material follows its inward world normal.
    requirePaintedFace(t,flatQ(3.5,28.5,16,29.5,.65),P.stoneD,'Campion C2 recessed interior floor');
    requirePaintedFace(t,wallQ([4.65,17.15],[27.35,17.15],.65,9.4),P.stoneD,'Campion C2 actual recessed rear wall');
    requirePaintedFace(t,wallQ([4.65,16],[4.65,29.5],.65,9.4),worldShade(t,1,0,P.stoneR,P.stoneD),'Campion C2 left inward masonry face');
    requirePaintedFace(t,wallQ([27.35,16],[27.35,29.5],.65,9.4),worldShade(t,-1,0,P.stoneR,P.stoneD),'Campion C2 right inward masonry face');
    campionBase(t);
  };
  negative('remove-bank-barn-dark-interior-floor','campionbarn',t=>removeExact(t,flatQ(3.5,28.5,16,29.5,.65)),/Campion C2 recessed interior floor/);
  negative('remove-bank-barn-shaded-rear-wall','campionbarn',t=>removeExact(t,wallQ([4.65,17.15],[27.35,17.15],.65,9.4)),/Campion C2 actual recessed rear wall/);
  negative('remove-bank-barn-inward-masonry-face','campionbarn',t=>removeExact(t,wallQ([4.65,16],[4.65,29.5],.65,9.4)),/Campion C2 left inward masonry face/);

  const catmintBase=checks.catmintbridge;
  checks.catmintbridge=function(t){
    catmintBase(t);
    for(const reverse of[false,true])for(let i=0;i<8;i++){
      const front=reverse?30-i*1.25:2+i*1.25;
      const ya=front-(reverse?.16:.20),yb=front+(reverse?.20:.16),top=.65+(i+1),bottom=top-.38;
      requirePaintedFace(t,flatQ(11,21,ya,yb,top),P.woodHi,'Catmint C2 sixteen solid projecting tread nose tops');
      requirePaintedFace(t,flatQ(11,21,ya,yb,bottom),P.woodD,'Catmint C2 sixteen real shaded tread nose undersides');
      for(const [a,b,nx,ny]of[[[11,ya],[21,ya],0,-1],[[11,yb],[21,yb],0,1],[[11,ya],[11,yb],-1,0],[[21,ya],[21,yb],1,0]])
        requirePaintedFace(t,wallQ(a,b,bottom,top),worldShade(t,nx,ny,P.woodR,P.woodD),'Catmint C2 closed tread nose vertical edges follow world normals');
    }
  };
  negative('remove-covered-bridge-projecting-nose-top','catmintbridge',t=>removeExact(t,flatQ(11,21,5.55,5.91,4.65)),/sixteen solid projecting tread nose tops/);
  negative('remove-covered-bridge-real-nose-underside','catmintbridge',t=>removeExact(t,flatQ(11,21,5.55,5.91,4.27)),/sixteen real shaded tread nose undersides/);
  negative('open-covered-bridge-tread-nose-front','catmintbridge',t=>removeExact(t,wallQ([11,5.55],[21,5.55],4.27,4.65)),/closed tread nose vertical edges/);


  // C3 adds exact physical coverage, materials and voids, not model flags.
  // These coordinates are the independently fixed repair section and schedule.
  function campionArchFacet(cx,r,i){
    const a=Math.PI-i*Math.PI/16,b=Math.PI-(i+1)*Math.PI/16;
    const x0=cx+r*Math.cos(a),x1=cx+r*Math.cos(b),z0=5.4+3.4*Math.sin(a),z1=5.4+3.4*Math.sin(b);
    return [[x0,27.25,z0],[x1,27.25,z1],[x1,29.5,z1],[x0,29.5,z0]];
  }
  const campionC2=checks.campionbarn;
  checks.campionbarn=function(t){
    campionC2(t);
    for(const [cx,r]of[[8.15,3.15],[16,3.2],[23.85,3.15]])for(let i=0;i<16;i++){
      const q=campionArchFacet(cx,r,i);
      requirePaintedFace(t,q,P.stoneD,'Campion C3 exact continuous tall arch intrados');
      for(const y of[27.25,29.5])requireFace(t,[[q[0][0],y,q[0][2]],[q[1][0],y,q[1][2]],[q[1][0],y,9.4],[q[0][0],y,9.4]],'Campion C3 complete deep arch spandrel faces');
      requirePaintedFace(t,flatQ(q[0][0],q[1][0],27.25,29.5,9.4),P.stoneHi,'Campion C3 closed arch bearing top');
    }
    for(const c of[8.15,16,23.85])for(const x of[c-.8,c,c+.8])
      emptyRay(t,1,x,8.4,17.2,29.5,'Campion C3 raised arch crowns remain genuinely open');
    for(const x of[8.15,16,23.85]){
      requireBoxWalls(t,x-.24,x+.24,17.15,27.25,8.95,9.4,'Campion C3 three full raised floor joists');
      for(const z of[8.95,9.4])requirePaintedFace(t,flatQ(x-.24,x+.24,17.15,27.25,z),P.woodR,'Campion C3 closed raised floor joist bearing and soffit');
    }
    for(const [xa,xb]of[[11.85,12.2],[19.8,20.15]])requireBoxWalls(t,xa,xb,15.75,16.75,10,20.15,'Campion C3 raised upper loading door jambs');
    requireBoxWalls(t,11.85,20.15,15.75,16.75,19.8,20.15,'Campion C3 raised upper loading door frame head');
    requireBoxWalls(t,11.85,20.15,15.7,16.75,9.7,10,'Campion C3 solid threshold joins upper bank landing');
    for(let i=0;i<6;i++)for(let j=0;j<4;j++){
      const xa=4.85+i*3.7,xb=xa+3.5,ya=17.35+j*2.95,yb=ya+2.65;
      requirePaintedFace(t,flatQ(xa,xb,ya,yb,.9),P.stoneR,'Campion C3 twenty-four exposed physical flagstone tops');
      requirePaintedFace(t,flatQ(xa,xb,ya,yb,.65),P.stoneD,'Campion C3 twenty-four closed flagstone undersides');
      for(const [a,b]of[[[xa,ya],[xb,ya]],[[xa,yb],[xb,yb]],[[xa,ya],[xa,yb]],[[xb,ya],[xb,yb]]])
        requirePaintedFace(t,wallQ(a,b,.65,.9),P.stoneD,'Campion C3 full-thickness flagstone edges retain dark joints');
    }
    // The quarter-unit flags never turn into a floor filling the lower room.
    for(const x of[6,10,14,18,22,26])for(const y of[18,21,24,26.8])
      assert(!heightsAt(t,x,y).some(z=>z>.9000001&&z<8.9499999),'Campion C3 actual raised flagstones leave the entire lower interior empty');
  };
  negative('duplicate-bank-barn-arch-intrados-segment','campionbarn',t=>{
    removeExact(t,campionArchFacet(8.15,3.15,4));addFace(t,campionArchFacet(8.15,3.15,5),P.stoneD);
  },/Campion C3 exact continuous tall arch intrados/);
  negative('remove-bank-barn-arch-back-spandrel','campionbarn',t=>{
    const q=campionArchFacet(8.15,3.15,4);removeExact(t,[[q[0][0],27.25,q[0][2]],[q[1][0],27.25,q[1][2]],[q[1][0],27.25,9.4],[q[0][0],27.25,9.4]]);
  },/Campion C3 complete deep arch spandrel faces/);
  negative('remove-bank-barn-arch-bearing-top','campionbarn',t=>{
    const q=campionArchFacet(8.15,3.15,4);removeExact(t,flatQ(q[0][0],q[1][0],27.25,29.5,9.4));
  },/Campion C3 closed arch bearing top/);
  negative('seal-bank-barn-raised-arch-crown','campionbarn',t=>addFace(t,wallQ([7.35,29.5],[8.95,29.5],7.9,8.5)),/Campion C3 raised arch crowns remain genuinely open/);
  negative('remove-bank-barn-raised-joist-soffit','campionbarn',t=>removeExact(t,flatQ(7.91,8.39,17.15,27.25,8.95)),/Campion C3 closed raised floor joist bearing and soffit/);
  negative('remove-bank-barn-raised-door-frame-head','campionbarn',t=>removeExact(t,wallQ([11.85,15.75],[20.15,15.75],19.8,20.15)),/Campion C3 raised upper loading door frame head/);
  negative('remove-bank-barn-raised-threshold-face','campionbarn',t=>removeExact(t,wallQ([11.85,15.7],[20.15,15.7],9.7,10)),/Campion C3 solid threshold joins upper bank landing/);
  negative('remove-bank-barn-physical-flagstone-top','campionbarn',t=>removeExact(t,flatQ(4.85,8.35,17.35,20,.9)),/Campion C3 twenty-four exposed physical flagstone tops/);
  negative('remove-bank-barn-physical-flagstone-underside','campionbarn',t=>removeExact(t,flatQ(4.85,8.35,17.35,20,.65)),/Campion C3 twenty-four closed flagstone undersides/);
  negative('remove-bank-barn-physical-flagstone-edge','campionbarn',t=>removeExact(t,wallQ([4.85,17.35],[8.35,17.35],.65,.9)),/Campion C3 full-thickness flagstone edges retain dark joints/);
  negative('raise-bank-barn-false-interior-floor','campionbarn',t=>addFace(t,flatQ(5,27,17.3,27,1.2)),/Campion C3 actual raised flagstones leave the entire lower interior empty/);

  const woodruffC2=checks.woodruffgrain;
  const woodruffFloorSides=[[[7.5,4.5],[24.5,4.5],0,-1],[[7.5,27],[24.5,27],0,1],[[7.5,4.5],[7.5,27],-1,0],[[24.5,4.5],[24.5,27],1,0]];
  checks.woodruffgrain=function(t){
    // Verify the original four floor sides themselves, not added shade strips.
    for(const [a,b,nx,ny]of woodruffFloorSides)
      requirePaintedFace(t,wallQ(a,b,4.6,5.7),worldShade(t,nx,ny,P.woodR,P.woodD),'Woodruff C3 original floor edges use rotated world-normal shade');
    woodruffC2(t);
    requirePaintedFace(t,flatQ(7.5,24.5,4.5,27,4.6),P.woodD,'Woodruff C3 original floor has one dark physical soffit');
    requirePaintedFace(t,flatQ(7.5,24.5,4.5,27,5.7),P.woodHi,'Woodruff C3 original floor keeps its single lit bearing top');
  };
  for(const [i,name]of['rear','front','left','right'].entries())negative('remove-granary-shaded-'+name+'-floor-edge','woodruffgrain',t=>{
    const [a,b]=woodruffFloorSides[i];removeExact(t,wallQ(a,b,4.6,5.7));
  },/Woodruff C3 original floor edges use rotated world-normal shade/);
  negative('overlay-granary-floor-soffit','woodruffgrain',t=>addFace(t,flatQ(7.5,24.5,4.5,27,4.6),P.woodR),/Woodruff C3 original floor has one dark physical soffit/);
  negative('overlay-granary-floor-bearing-top','woodruffgrain',t=>addFace(t,flatQ(7.5,24.5,4.5,27,5.7),P.woodR),/Woodruff C3 original floor keeps its single lit bearing top/);

  return {checks,mutations};
};
