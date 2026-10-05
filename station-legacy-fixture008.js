/* CI-only native old-only city: all47 approved British identities plus ordinary
   T612 stations, physical legacy frontage, routes, paid fleets and depots. */
const {seedApprovedBritishLegacy007}=require('./publiclife-legacy-fixture007');
function seedApprovedLegacyStation008(seed=800720){
  const q=seedApprovedBritishLegacy007(seed),paid=[];
  function place(id,x,y,sz=1){for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++){const t=GV.tile(x+dx,y+dy);if(t.t!==1&&t.t!==2){if(t.bld)throw Error('Retained terrain identity');const p=GV.placePreview459('tland',x+dx,y+dy),m=GV.stats().money;if(!p.ok||!GV.place('tland',x+dx,y+dy))throw Error('Old native terrain');if(Math.abs(m-GV.stats().money-p.cost)>1e-6)throw Error('Old terrain charge');}}
    const p=GV.placePreview459(id,x,y),m=GV.stats().money;if(!p.ok||!GV.place(id,x,y))throw Error('Old fixture '+id+' '+x+','+y+': '+JSON.stringify(p));paid.push({id,x,y,cost:p.cost,charged:m-GV.stats().money});}
  for(let x=5;x<=46;x++){place('road',x,4);place('wpipe',x,4);}for(let y=5;y<10;y++){place('road',5,y);place('wpipe',5,y);}place('plant',6,3);place('water',8,5);place('plant',44,3);place('water',42,5);
  const specs=[[262,'historicTownHall',3],[263,'magistratesCourt',3],[264,'boroughPolice',2],[265,'edwardianFireStation',3],[266,'technicalInstitute',3],[267,'grammarSchool',3],[268,'flintParishChurch',3],[269,'nonconformistChapel',2],[270,'cricketPavilion',3],[271,'bowlsClub',2],[272,'ironBandstand',2],[273,'seasideConcertHall',3]];
  for(const [n,[k,id,sz]]of specs.entries()){const x=10+(n%6)*6,y=n<6?4-sz:59;place(id,x,y,sz);q.roots.push({k,id,x,y,sz});}
  for(let y=19;y<=46;y++){place('road',49,y);place('wpipe',49,y);}for(const y of[22,46])for(let x=47;x<49;x++){place('road',x,y);place('wpipe',x,y);}place('plant',48,19);place('water',48,23);place('plant',48,45);place('water',48,47);
  place('hsrStation',50,20,5);place('hsrStation',50,42,5);place('railYard',57,27,3);
  for(const y of[19,41])for(let x=50;x<=55;x++)place('rail',x,y);for(let y=20;y<41;y++)place('rail',55,y);
  const line=GV.railNew463('rail');GV.railAddStop463('rail',line,50,20);GV.railAddStop463('rail',line,50,42);for(let i=0;i<2;i++)if(!GV.railFleet463('rail',line,1))throw Error('Old paid fleet');
  for(let x=49;x<=56;x++){place('road',x,18);place('wpipe',x,18);}for(let y=19;y<=35;y++){place('road',56,y);place('wpipe',56,y);}for(let x=56;x<=60;x++)place('rail',x,41);for(let y=27;y<41;y++)place('rail',60,y);
  q.legacyTransport={line,paid};GV.rebuildCov();GV.testRebake592();return q;
}
module.exports={seedApprovedLegacyStation008};
