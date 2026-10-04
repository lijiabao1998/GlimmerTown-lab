/* CI-only external compatibility fixture; uses the baseline's existing GV API.
   Caller must own a fresh disposable slot-3 browser and guard player storage.
   Only existing IDs219–221 and238–245, plus normal plants/towers/roads/pipes.
   No utility flags, utility capacities, network results or RNG are assigned. */
function seedApprovedBritishLegacy006(seed=6006718){
  if(localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable slot3 required');
  const world=GV.metroArtSeedWorld516(seed);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);
  GV.art574.clear574(1,1,49,41);GV.innovationSetQA507({money:10000000,rank:25,tech:false});GV.setDiff(1);
  const place=(id,x,y)=>{const e=GV.canPlaceTool(id,x,y);if(e!==null||!GV.place(id,x,y))throw Error(id+' '+x+','+y+' rejected: '+e);};
  for(const y of [16,28]){
    for(let x=6;x<=46;x++){place('road',x,y);place('wpipe',x,y);}
    for(const x of [6,46])place('plant',x,y-1);
    for(const x of [8,44])place('water',x,y+1);
  }
  for(let y=16;y<=28;y++){place('road',5,y);place('wpipe',5,y);}
  const specs=[[219,'britishTerrace',2],[220,'foxFinchPub',2],[221,'edwardianLibrary',3],[238,'coOpStores',2],[239,'stoneBakehouse',2],[240,'coveredMarket',3],[241,'boardSchool',3],[242,'cottageSurgery',2],[243,'highStreetPost',2],[244,'municipalBaths',3],[245,'villageHall',2]],roots=[];
  for(const [n,[k,id,sz]]of specs.entries()){
    const x=10+6*(n%6),y=(n<6?16:28)-sz;place(id,x,y);GV.testAge635(x,y,1,1,30);roots.push({k,id,x,y,sz});
  }
  for(const y of [17,29])for(const x of [12,20,28,36]){place('britishTerrace',x,y);GV.testAge635(x,y,1,1,30);roots.push({k:219,id:'britishTerrace',x,y,sz:2});}
  GV.rebuildCov();GV.testRebake592();
  return {N:world.N,seed,roots,difficulty:GV.diff(),note:'Age-only fixture seeding. All readiness is established by the caller’s ordinary GV.step days.'};
}
if(typeof module!=='undefined')module.exports={seedApprovedBritishLegacy006};
