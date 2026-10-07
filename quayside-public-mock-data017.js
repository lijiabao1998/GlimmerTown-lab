'use strict';
// Synthetic JSON-only fixtures; no game/renderer/browser code.
const c=require('./quayside-public-contract017');
function goodState(){
 const q={version:'14.34',slot:'3',difficulty:1,developer:{sandbox:false,god:false},menuVisible:false,coldFixDisabled:false,stats:{day:10,money:100000,pop:1000,poweredBld:70},physical:{poweredRoads:100,sources:2},districtCache:{districts:1},cells:[],paths:[],water:Array.from({length:70},(_,n)=>({x:n,y:50,t:0})),shoreline:Array.from({length:13},(_,n)=>({x:n,y:49,land:1,water:0})),retained:[],oldMuseums:[],stations:[],otherSlots:{}};
 const add=(k,x,y,sz)=>{const root=y*72+x,r={root,k,sz,v:0,built:true,age:9,operational:true,power:true,powerState:1,powerAllocation:{root,pool:0},water:true,waterState:{code:4},waterDelivered:3.4,waterDemand:3.4,employed:16,positions:16,road:[root-72],refCells:[],activity:{work:16,publicJobs:16,enterpriseJobs:0,shopping:0,education:0,services:0,leisure:200,parking:0}};q.cells.push({i:root,k,ref:null,sz,lv:1,v:0,age:9});for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++)if(dx||dy){const i=(y+dy)*72+x+dx,bld={k,ref:[x,y]};q.cells.push({i,k,ref:[x,y],sz:1,lv:null,v:null,age:null});r.refCells.push({i,bld});}return r;};
 const r=add(281,58,64,3);Object.assign(r,{id:'edwardianTheatre013',staff:{k:281,potentialJobs:16,capacityFactor:1,staffFill:1},factors:{availability:1},capacityFactor:1,coverageStamp:{field:'theater',radius:7},upkeep:10});q.theatre={day:10,roots:[r]};
 q.market={roots:[add(278,58,50,3),add(279,62,50,1),add(280,64,50,1)]};q.market.roots.forEach(r=>r.activity.shopping=30);
 q.street={roots:[add(274,58,20,3),add(275,63,20,2),add(276,67,20,1)]};q.museum={tourists:0,roots:[add(277,58,40,4)]};
 for(let n=0;n<47;n++){const x=(n%10)*4,y=Math.floor(n/10)*4,k=219+n;add(k,x,y,2);q.retained.push({k,x,y,sz:2,bld:{k,sz:2},cells:[{k,sz:2},{k,ref:[x,y]},{k,ref:[x,y]},{k,ref:[x,y]}]});}
 for(let n=0;n<2;n++){q.oldMuseums.push({k:35+n,sz:2,x:64+n*3,y:40,bld:{k:35+n,sz:2}});add(35+n,64+n*3,40,2);q.stations.push({root:26*72+10+n*10,k:139,v:3,age:9,ownedRail:Array(10).fill(1)});}
 q.themes=['ticket','plaza','rail','bench','planter','lamp'].map(theme=>({theme,at:{theme,am502:1,baseWalkCost:.72,amx502:{british013:theme,turn013:0}}}));q.stats.buildings=q.cells.length;return q;
}
function goodComplexState(){
 const q=goodState();q.complexDisabled=false;q.complexArtDisabled=false;const roots=[];
 for(const [n,s]of c.sourcePins.complexCatalog.buildings.entries()){
  const x=6+12*Math.floor(n/3)+(n%3?5:0),y=n%3===2?67:64,root=y*72+x,housing=s.role==='housing';
  const r={root,k:s.k,id:s.id,group:s.group,role:s.role,sz:s.sz,built:true,age:9,operational:true,power:true,powerState:1,powerAllocation:{root,pool:0},water:true,waterState:{code:4},waterDelivered:1,waterDemand:1,road:[root-72],upkeep:s.upkeep,positions:s.jobs,employed:s.jobs,staff:housing?null:{k:s.k,potentialJobs:s.jobs,staffFill:1,capacityFactor:1},factors:{serviceFactor:1},capacityFactor:housing?0:1,activity:{work:s.jobs,publicJobs:s.jobs,enterpriseJobs:0,shopping:0,parking:0,leisure:s.leisure,education:s.seats,services:s.services},coverageStamp:s.coverage?{field:s.coverage,radius:7}:null,housing:housing?{capacity:s.capacity,population:s.capacity,occupancy:1,eligible:true}:null,emergencyReady:s.role==='fire',emergency:s.role==='fire'?{sourceRegistered:true,fieldOnline:true}:null,refCells:[]};
  q.cells.push({i:root,k:s.k,ref:null,sz:s.sz,lv:1,v:0,age:9});
  for(let dy=0;dy<s.sz;dy++)for(let dx=0;dx<s.sz;dx++)if(dx||dy){const i=(y+dy)*72+x+dx;q.cells.push({i,k:s.k,ref:[x,y],sz:1,lv:null,v:null,age:null});r.refCells.push({i,bld:{k:s.k,ref:[x,y]}});}
  roots.push(r);
 }
 q.complexThemes=c.sourcePins.complexCatalog.paths.map(s=>({...s,at:{theme:s.theme,group:s.group,am502:1,baseWalkCost:.72,cost:12,amx502:{british014:s.theme,turn014:0}}}));
 q.complex={day:q.stats.day,roots,paths:q.complexThemes.map(p=>p.at),daily:{syntheticRevenue:0,publicJobs:roots.reduce((n,r)=>n+r.positions,0),upkeep:roots.reduce((n,r)=>n+r.upkeep,0)}};q.stats.buildings=q.cells.length;return q;
}
function goodStreetscapeState(){
 const q=goodComplexState();q.streetscapeDisabled=false;q.streetscapeArtDisabled=false;
 q.streetscapeThemes=c.pins015.streetscapeCatalog.paths.map((s,n)=>{const [x,y]=[[9,68],[11,69],[7,68],[8,68],[18,68],[19,68],[20,68],[21,68]][n],turn=n%4,at={root:y*72+x,x,y,theme:s.theme,am502:1,amx502:{british015:s.theme,turn015:turn},baseWalkCost:.72,cost:12,lighting:{ready:true,service:1,source:{x,y:y+1}}};return{...s,x,y,turn,at,roadSource:{road:1}};});
 q.streetscape={day:q.stats.day,art:{total:32,builds:1},paths:q.streetscapeThemes.map(p=>p.at)};return q;
}
function goodQuayside(){
 const q=goodStreetscapeState();
 for(const f of [
  {key:'garden',themes:'gardenThemes',disabled:'gardenDisabled',artDisabled:'gardenArtDisabled',specs:c.pins016.gardenCatalog.paths,themeKey:'british016',turnKey:'turn016',positions:[[30,68],[31,68],[32,68],[42,68],[43,68],[44,68]]},
  {key:'quayside',themes:'quaysideThemes',disabled:'quaysideDisabled',artDisabled:'quaysideArtDisabled',specs:c.pins017.quaysideCatalog.paths,themeKey:'british017',turnKey:'turn017',positions:[[27,68],[28,68],[29,68],[39,68],[40,68],[41,68]]}
 ]){
  q[f.disabled]=false;q[f.artDisabled]=false;
  q[f.themes]=f.specs.map((p,n)=>{const[x,y]=f.positions[n],turn=n%4,at={root:y*72+x,x,y,theme:p.theme,am502:1,amx502:{[f.themeKey]:p.theme,[f.turnKey]:turn},baseWalkCost:.72,cost:12,lighting:{ready:true,service:1}};return{...p,x,y,turn,at};});
  q[f.key]={day:q.stats.day,art:{total:24,builds:1},paths:q[f.themes].map(p=>p.at)};
 }
 return q;
}
module.exports={goodState,goodComplexState,goodStreetscapeState,goodQuayside};
