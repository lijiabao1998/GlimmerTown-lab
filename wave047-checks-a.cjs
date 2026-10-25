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
 requireBoxWalls(t,12.75,13.65,21.2,22,.6,8.45,'Spindle grounded outer shelter support');assertGlazingBacking(t,'Spindle');
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
 const roof=materialPolygons(t,'slate').filter(p=>maxz(p)>30);assert.equal(roof.length,28,'Hops one full conical roof');assert(roof.every(p=>hasVertex(p,[21,11,36.2])),'Hops true straight cone apex');
 assert(walls.flat().some(p=>p[0]<15&&p[1]>5&&p[1]<28),'Hops finite chord intersection with range');assertGlazingBacking(t,'Hops');
}
function tansy(t){
 requireBoxWalls(t,13.8,16.2,13.8,16.2,.6,13,'Tansy one actual central post');requireBoxWalls(t,7,23,7,23,12.5,23.8,'Tansy complete oblong raised timber cabin');
 const braces=t.beams.filter(b=>close(b[0][2],1.6)&&close(b[1][2],11.8)&&close(b[1][0],15)&&close(b[1][1],15)&&close(b[2],1.35));assert.equal(braces.length,4,'Tansy four real diagonal grounded trestles');
 assert.equal(cast(t,0,10,5).length,0,'Tansy no opaque underbody skirt');
 requireBoxWalls(t,23,28,16,21,12.1,12.7,'Tansy substantial tail porch');
 assert(t.polygons.some(p=>p.every(q=>close(q[2],12.7))&&p.some(q=>close(q[0],24)&&close(q[1],20.25))),'Tansy access stair reaches tail floor');assertGlazingBacking(t,'Tansy');
}
function vervain(t){
 const outer=t.polygons.filter((p,i)=>[P.lead,P.slateHi].includes(t.materialValues[i])&&minz(p)>=4.4-1e-8);assert.equal(outer.length,288,'Vervain complete twelve-by-twenty-four outer hemispherical patches');
 for(const p of outer.flat())assert(close((p[0]-16)**2+(p[1]-22)**2+(p[2]-4.4)**2,11.5**2),'Vervain true two-axis spherical curvature');
 const inner=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneR&&p.some(q=>q[2]>4.41)&&p.every(q=>close((q[0]-16)**2+(q[1]-22)**2+(q[2]-4.4)**2,10.85**2)));assert.equal(inner.length,288,'Vervain complete real inner radial skin');
 const rim=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneHi&&p.every(q=>close(q[1],22))&&maxz(p)>4.4);assert.equal(rim.length,24,'Vervain thick closed front arch rim');
 const hits=cast(t,1,16,9);assert(hits.length>0&&hits.every(y=>y<21),'Vervain deep open front cavity not a painted disc');
 requireBoxWalls(t,5,27,19,28,.6,1.2,'Vervain grounded projecting stage');
}
const checks={spindlefruit:spindle,agrimonypattern:agrimony,hopdrying:hops,tansymill:tansy,vervainrecital:vervain};
const mutations=[
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
 {name:'remove-half-dome-inner-skin',id:'vervainrecital',mutate:t=>remove(t,t.polygons.find((p,i)=>t.materialValues[i]===P.stoneR&&maxz(p)>10)),pattern:/complete real inner radial skin/},
 {name:'fill-recital-arch-with-panel',id:'vervainrecital',mutate:t=>add(t,[[6,22,1.2],[26,22,1.2],[26,22,14],[6,22,14]]),pattern:/deep open front cavity/}
];
return{checks,mutations};
};
