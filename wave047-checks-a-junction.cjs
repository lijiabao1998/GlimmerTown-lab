'use strict';
module.exports=function(U){
const {assert,P,close,key,polykey,minz,maxz,area,vertices,uniquePoints,hasVertex,materialPolygons,isPoly,wallQ,requireWall,requireBoxWalls,cast,topsWith,heightsAt,assertOpen,assertSolid,assertGlazingBacking}=U;
function remove(t,p){const i=t.polygons.indexOf(p);assert(i>=0);t.polygons.splice(i,1);t.materials.splice(i,1);t.materialValues.splice(i,1);}
function add(t,p){t.polygons.push(p);t.materials.push('solid');t.materialValues.push(P.stone);}
function spindle(t){
 requireBoxWalls(t,23,30,6,27,.6,14.6,'Spindle substantial complete lodge');
 const tops=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneHi&&p.length===3&&p.every(q=>close(q[2],10.6)));
 assert.equal(tops.length,56,'Spindle fifty-six triangular faces close twenty-eight real thick wall caps');
 for(let i=0;i<28;i++){
  const x=2+21*i/28,y=14+4*Math.sin((x-2)*Math.PI*2/21);assert(tops.some(p=>p.some(q=>Math.hypot(q[0]-x,q[1]-y)<.56)),'Spindle actual opposing concave wall bays');
 }
 assert(tops.every(p=>Math.abs(area(p))>.35),'Spindle masonry wall has real width not a line');
 assertOpen(t,[[7,12],[8,13]],'Spindle first outdoor bay remains roofless');assertSolid(t,[[18,18]],7.5,'Spindle only second bay sheltered');
 requireBoxWalls(t,12.75,13.65,21.2,22,.6,7.85,'Spindle grounded outer shelter support');
 const bearing=t.beams.filter(b=>close(b[0][0],12.5)&&close(b[1][0],23)&&close(b[0][1],21.6)&&close(b[2],.6));assert.equal(bearing.length,1,'Spindle one real front bearing beam');
 for(const b of bearing)for(const p of[b[0],b[1]])assert(p[2]+b[2]/2<=10.5-(p[1]+b[2]/2-10)*.19,'Spindle beam thickness stays below actual sloping roof top');
 for(const p of t.polygons.flat().filter(q=>q[0]>=12.75&&q[0]<=13.65&&q[1]>=21.2&&q[1]<=22&&q[2]<8))assert(p[2]<=10.5-(p[1]-10)*.19,'Spindle shelter column below actual roof surface');assertGlazingBacking(t,'Spindle');
}
function agrimony(t){
 for(const [x,y]of[[5,4],[15,4],[25,4],[5,14],[25,14],[5,24],[15,24],[25,24]])requireBoxWalls(t,x,x+2,y,y+2,.6,8.4,'Agrimony eight grounded masonry piers');
 for(const [a,b,c,d]of[[5,27,4,9],[5,27,21,26],[5,10,9,21],[22,27,9,21]]){requireBoxWalls(t,a,b,c,d,8.7,17.3,'Agrimony four occupied upper ranges');assert(isPoly(t,[[a,c,8],[b,c,8],[b,d,8],[a,d,8]]),'Agrimony real annular underside');}
 assertOpen(t,[[15,14],[17,17],[11,10],[21,20]],'Agrimony large sky court stays open');
 assert(cast(t,0,18,4).every(x=>x<5),'Agrimony horizontal ground sightline east-west beneath complete room ring, excluding outside stair');assert.equal(cast(t,1,19,4).length,0,'Agrimony horizontal ground sightline north-south');
 requireBoxWalls(t,1,5,9.4,12.7,8.1,8.7,'Agrimony upper door stair landing');assertGlazingBacking(t,'Agrimony');
}
function hops(t){
 requireBoxWalls(t,3,16,5,28,.6,16.6,'Hops complete co-dominant long sorting range');
 const walls=materialPolygons(t,'brick').filter(p=>p.length===4&&close(minz(p),.6)&&close(maxz(p),23));assert.equal(walls.length,28,'Hops one complete tall circular kiln');
 for(const p of walls.flat())assert(close((p[0]-21)**2+(p[1]-11)**2,7.7**2),'Hops cylindrical kiln not ellipse or bottle');
 const door=t.polygons.filter(p=>close(minz(p),.7)&&close(maxz(p),6.2)&&p.every(q=>q[0]>28));assert.equal(door.length,1,'Hops actual narrow maintenance door on exposed kiln wall');
 const roof=materialPolygons(t,'slate').filter(p=>maxz(p)>30);assert.equal(roof.length,28,'Hops one full conical roof');assert(roof.every(p=>hasVertex(p,[21,11,43.2])),'Hops true straight cone apex');
 const soffits=t.polygons.filter((p,i)=>t.materialValues[i]===P.slateR&&p.length===3&&p.every(q=>close(q[2],23)));assert.equal(soffits.length,28,'Hops closed underside across all projecting cone eave sectors');for(const p of soffits)assert(hasVertex(p,[21,11,23])&&p.filter(q=>close(Math.hypot(q[0]-21,q[1]-11),8.1)).length===2,'Hops exact full cone underside radial coverage');
 assert(walls.flat().some(p=>p[0]<15&&p[1]>5&&p[1]<28),'Hops finite chord intersection with range');
 for(const p of materialPolygons(t,'emissive').filter(p=>p.every(q=>q[0]<3)))for(const [y0,y1,z0,z1]of[[11.5,13.7,8.6,14],[18,21,.7,6.7]])assert(!(Math.max(...p.map(q=>q[1]))>y0&&Math.min(...p.map(q=>q[1]))<y1&&maxz(p)>z0&&minz(p)<z1),'Hops actual left windows do not overlap either loading or maintenance door');assertGlazingBacking(t,'Hops');
}
function tansy(t){
 requireBoxWalls(t,13.8,16.2,13.8,16.2,.6,13,'Tansy one actual central post');requireBoxWalls(t,8,22,7,26,12.5,23.8,'Tansy complete oblong raised timber cabin');
 const braces=t.beams.filter(b=>close(b[0][2],1.6)&&close(b[1][2],11.8)&&close(b[1][0],15)&&close(b[1][1],15)&&close(b[2],1.35));assert.equal(braces.length,4,'Tansy four real diagonal grounded trestles');
 assert.equal(cast(t,0,10,5).length,0,'Tansy no opaque underbody skirt');
 requireBoxWalls(t,11,20,2,7,12.1,12.7,'Tansy substantial opposite-face rear tail porch');
 assert(19>14*1.3,'Tansy actual long cabin geometry is oblong');
 const sails=t.beams.filter(b=>close(b[0][1],27.2)&&close(b[1][1],27.2));assert(sails.length>=4,'Tansy front sails opposite actual rear porch');assert(t.beams.some(b=>polykey(b.slice(0,2))===polykey([[15,25.5,23.4],[15,27.2,23.4]])&&close(b[2],.8)),'Tansy actual rotor axle joins cabin to front sail cross');
 const rearDoor=t.faces.some(f=>f.a[1]===7&&f.b[1]===7&&f.ny===-1);assert(rearDoor,'Tansy rear entry wall faces rear tail porch');
 assert(t.polygons.some(p=>p.every(q=>close(q[2],12.7))&&p.some(q=>close(q[0],19)&&close(q[1],2))),'Tansy access stair reaches tail floor');assertGlazingBacking(t,'Tansy');
}
function vervain(t){
 const outer=t.polygons.filter((p,i)=>[P.lead,P.slateHi].includes(t.materialValues[i])&&minz(p)>=4.4-1e-8);assert.equal(outer.length,288,'Vervain complete twelve-by-twenty-four outer hemispherical patches');
 for(const p of outer.flat())assert(close((p[0]-16)**2+(p[1]-22)**2+(p[2]-4.4)**2,11.5**2),'Vervain true two-axis spherical curvature');
 const inner=t.polygons.filter((p,i)=>p.some(q=>q[2]>4.41)&&p.every(q=>close((q[0]-16)**2+(q[1]-22)**2+(q[2]-4.4)**2,10.85**2)));assert.equal(inner.length,288,'Vervain complete real inner radial skin');
 const rim=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneHi&&p.every(q=>close(q[1],22))&&maxz(p)>4.4);assert.equal(rim.length,24,'Vervain thick closed front arch rim');
 const hits=cast(t,1,16,9);assert(hits.length>0&&hits.every(y=>y<21),'Vervain deep open front cavity not a painted disc');
 requireBoxWalls(t,5,27,19,28,.6,1.2,'Vervain grounded projecting stage');
 const ribs=t.beams.filter(b=>[.22,.18].some(w=>close(w,b[2]))&&b.slice(0,2).every(p=>close((p[0]-16)**2+(p[1]-22)**2+(p[2]-4.4)**2,10.72**2)));
 assert.equal(ribs.length,108,'Vervain true shallow interior spherical ribs expose both curvatures');
}
const checks={spindlefruit:spindle,agrimonypattern:agrimony,hopdrying:hops,tansymill:tansy,vervainrecital:vervain};
const mutations=[
 {name:'erase-kiln-maintenance-door',id:'hopdrying',mutate:t=>remove(t,t.polygons.find(p=>close(minz(p),.7)&&close(maxz(p),6.2)&&p.every(q=>q[0]>28))),pattern:/maintenance door on exposed kiln wall/},
 {name:'put-glazing-across-loading-door',id:'hopdrying',mutate:t=>{t.polygons.push([[2.7,11.6,10],[2.7,12.6,10],[2.7,12.6,11],[2.7,11.6,11]]);t.materials.push('emissive');t.materialValues.push(null);},pattern:/left windows do not overlap/},
 {name:'disconnect-post-mill-rotor-axle',id:'tansymill',mutate:t=>{const i=t.beams.findIndex(b=>close(b[2],.8)&&close(b[0][1],25.5));assert(i>=0);t.beams.splice(i,1);},pattern:/actual rotor axle joins/},
 {name:'erase-physical-inner-vault-rib',id:'vervainrecital',mutate:t=>{const i=t.beams.findIndex(b=>close(b[2],.22));assert(i>=0);t.beams.splice(i,1);},pattern:/true shallow interior spherical ribs/},
 {name:'open-projecting-kiln-eave-underside',id:'hopdrying',mutate:t=>remove(t,t.polygons.find((p,i)=>t.materialValues[i]===P.slateR&&p.length===3&&p.every(q=>close(q[2],23)))),pattern:/closed underside across/},
 {name:'raise-shelter-bearing-through-roof',id:'spindlefruit',mutate:t=>{const b=t.beams.find(b=>close(b[0][0],12.5)&&close(b[1][0],23)&&close(b[0][1],21.6)&&close(b[2],.6));b[0][2]=8.5;b[1][2]=8.5;},pattern:/beam thickness stays below/},
 {name:'move-front-sails-to-tail-side',id:'tansymill',mutate:t=>{for(const b of t.beams)if(close(b[0][1],27.2)&&close(b[1][1],27.2)){b[0][1]=1;b[1][1]=1;}},pattern:/front sails opposite/},
 {name:'erase-rear-tail-platform',id:'tansymill',mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ([11,2],[20,2],12.1,12.7)))),pattern:/opposite-face rear tail porch/},
 {name:'remove-serpentine-thick-cap',id:'spindlefruit',mutate:t=>remove(t,t.polygons.find((p,i)=>t.materialValues[i]===P.stoneHi&&p.every(q=>close(q[2],10.6)))),pattern:/fifty-six triangular faces/},
 {name:'roof-over-first-open-bay',id:'spindlefruit',mutate:t=>add(t,[[4,9,8],[11,9,8],[11,15,8],[4,15,8]]),pattern:/first outdoor bay remains roofless/},
 {name:'remove-workshop-main-wall',id:'spindlefruit',mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ([23,6],[30,6],.6,14.6)))),pattern:/substantial complete lodge/},
 {name:'close-gallery-court',id:'agrimonypattern',mutate:t=>add(t,[[10,9,17.7],[22,9,17.7],[22,21,17.7],[10,21,17.7]]),pattern:/large sky court stays open/},
 {name:'fill-gallery-ground-side',id:'agrimonypattern',mutate:t=>add(t,[[5,9,.6],[5,21,.6],[5,21,8],[5,9,8]]),pattern:/ground sightline east-west/},
 {name:'remove-gallery-pier-wall',id:'agrimonypattern',mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ([5,4],[7,4],.6,8.4)))),pattern:/eight grounded masonry piers/},
 {name:'deform-cylindrical-kiln',id:'hopdrying',mutate:t=>{const p=materialPolygons(t,'brick').find(p=>close(minz(p),.6)&&close(maxz(p),23));p[0][0]+=.3;},pattern:/cylindrical kiln/},
 {name:'remove-cone-facet',id:'hopdrying',mutate:t=>remove(t,materialPolygons(t,'slate').find(p=>maxz(p)>30)),pattern:/one full conical roof/},
 {name:'remove-sorting-range-wall',id:'hopdrying',mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ([3,5],[16,5],.6,16.6)))),pattern:/complete co-dominant long/},
 {name:'remove-post-mill-central-support',id:'tansymill',mutate:t=>remove(t,t.polygons.find(p=>polykey(p)===polykey(wallQ([13.8,13.8],[16.2,13.8],.6,13)))),pattern:/one actual central post/},
 {name:'remove-diagonal-trestle',id:'tansymill',mutate:t=>{const i=t.beams.findIndex(b=>close(b[0][2],1.6)&&close(b[1][2],11.8));t.beams.splice(i,1);},pattern:/four real diagonal grounded/},
 {name:'fill-post-mill-underbody',id:'tansymill',mutate:t=>add(t,[[7,7,.6],[7,23,.6],[7,23,12.5],[7,7,12.5]]),pattern:/no opaque underbody skirt/},
 {name:'flatten-half-dome-curve',id:'vervainrecital',mutate:t=>{const p=t.polygons.find((p,i)=>[P.lead,P.slateHi].includes(t.materialValues[i])&&maxz(p)>10);p[1][2]+=.4;},pattern:/true two-axis spherical/},
 {name:'remove-half-dome-inner-skin',id:'vervainrecital',mutate:t=>remove(t,t.polygons.find(p=>maxz(p)>10&&p.every(q=>close((q[0]-16)**2+(q[1]-22)**2+(q[2]-4.4)**2,10.85**2)))),pattern:/complete real inner radial skin/},
 {name:'fill-recital-arch-with-panel',id:'vervainrecital',mutate:t=>add(t,[[6,22,1.2],[26,22,1.2],[26,22,14],[6,22,14]]),pattern:/deep open front cavity/}
];
return{checks,mutations};
};
