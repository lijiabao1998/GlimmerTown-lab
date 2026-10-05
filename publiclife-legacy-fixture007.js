/* CI-only old-world fixture for the immutable deployed T719 baseline.
   Caller owns a fresh disposable slot3 profile. All27 approved British IDs are
   included; public-life IDs262–273 are absent. Only age/money/rank are seeded.
   Utilities use real ordinary placement; no supply or runtime flags are assigned. */
function seedApprovedBritishLegacy007(seed=7006719){
  if(localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable slot3 required');
  const world=GV.metroArtSeedWorld516(seed);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);
  GV.innovationSetQA507({money:10000000,rank:25,tech:false});GV.setDiff(1);
  // Whole-root ordinary demolition first, including any root outside the clear
  // rectangle whose reference touches it. Direct per-cell clearing must never
  // create orphan references in the baseline or candidate simulation.
  const touched=new Set();for(let y=1;y<=63;y++)for(let x=1;x<=49;x++){const b=GV.tile(x,y).bld;if(b)touched.add(b.ref?b.ref[1]*world.N+b.ref[0]:y*world.N+x);}
  for(const i of touched)if(!GV.place('doze',i%world.N,Math.floor(i/world.N)))throw Error('Cannot demolish old fixture root '+i);
  GV.art574.clear574(1,1,49,63);
  const terrainAudit=[];
  // The seeded road grid crosses water. Only reclaim selected empty footprint
  // cells with the same ordinary paid tool in baseline and candidate profiles.
  const land=(x,y)=>{
    const before=GV.tile(x,y);if(before.t===1||before.t===2)return;
    if(x<1||x>49||y<1||y>63||before.t!==0||before.bld)throw Error('Old fixture terrain outside empty bounded water '+x+','+y);
    const developer=GV.dev516B(),moneyBefore=GV.devMoney516B(),preview=GV.placePreview459('tland',x,y);
    if(GV.diff()!==1||developer.sandbox||developer.god||!preview?.ok||preview.cost!==60||!GV.place('tland',x,y))throw Error('Old fixture requires normal paid single-cell reclamation '+x+','+y);
    const after=GV.tile(x,y),moneyAfter=GV.devMoney516B(),charged=moneyBefore-moneyAfter;
    const fields=['road','rc','bridge','rail','tram','bld','wp','wm472','sm472','hv471','ug471','lv475','ud475'];
    const identityPreserved=fields.every(k=>JSON.stringify(before[k])===JSON.stringify(after[k]));
    const row={x,y,before,after,cost:preview.cost,moneyBefore,moneyAfter,charged,paidExactly:Math.abs(charged-preview.cost)<1e-7,identityPreserved};
    terrainAudit.push(row);
    if(after.t!==2||!identityPreserved||!row.paidExactly)throw Error('Old fixture reclamation changed identity or charge '+JSON.stringify(row));
  };
  const place=(id,x,y,sz=1)=>{for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++)land(x+dx,y+dy);const e=GV.canPlaceTool(id,x,y);if(e!==null||!GV.place(id,x,y))throw Error(id+' '+x+','+y+' rejected: '+e);};
  const roadRows=[10,22,34,46,58];
  for(const y of roadRows){
    for(let x=5;x<=46;x++){place('road',x,y);place('wpipe',x,y);}
    for(const x of[6,46])place('plant',x,y-1);
    for(const x of[8,44])place('water',x,y+1);
  }
  for(let y=10;y<=58;y++){if(!GV.tile(5,y).road)place('road',5,y);if(!GV.tile(5,y).wp)place('wpipe',5,y);}
  const specs=[[219,'britishTerrace',2],[220,'foxFinchPub',2],[221,'edwardianLibrary',3],[238,'coOpStores',2],[239,'stoneBakehouse',2],[240,'coveredMarket',3],[241,'boardSchool',3],[242,'cottageSurgery',2],[243,'highStreetPost',2],[244,'municipalBaths',3],[245,'villageHall',2],
    [246,'georgianRow',2],[247,'georgianCorner',2],[248,'georgianEnd',2],[249,'georgianArea',2],[250,'victorianGabledSemi',2],[251,'victorianBayVilla',2],[252,'victorianGardenVilla',2],[253,'victorianGothicVilla',2],[254,'stoneCottagePair',2],[255,'brickCatslideCottage',2],[256,'courtyardCottages',2],[257,'thatchedLongCottage',2],[258,'workersNarrowRow',2],[259,'workersYardTerrace',2],[260,'workersCourt',2],[261,'workersCornerShop',2]],roots=[];
  for(const[n,[k,id,sz]]of specs.entries()){const x=10+6*(n%6),y=roadRows[Math.floor(n/6)]-sz;place(id,x,y,sz);GV.testAge635(x,y,1,1,30);roots.push({k,id,x,y,sz});}
  for(const y of[11,23,35,47])for(const x of[12,28]){place('britishTerrace',x,y,2);GV.testAge635(x,y,1,1,30);roots.push({k:219,id:'britishTerrace',x,y,sz:2});}
  GV.rebuildCov();GV.testRebake592();
  return{N:world.N,seed,roots,difficulty:GV.diff(),terrainAudit,note:'Every approved T717/T718/T719 identity is placed normally. Age-only fixture seeding and bounded ordinary paid water reclamation; the caller advances ordinary days to prove actual readiness.'};
}
if(typeof module!=='undefined')module.exports={seedApprovedBritishLegacy007};
