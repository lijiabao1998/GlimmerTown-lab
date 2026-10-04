/* GPT-006 read-only resident smoke; safe against an ordinary player's city. */
const RESIDENTIAL_EXPECTED006=Object.freeze([
  [246,'georgianRow','UKR01',36,'mid',1300,3,2.62,2.04,0,160],
  [247,'georgianCorner','UKR02',40,'mid',1600,4,2.8,2.2,0,165],
  [248,'georgianEnd','UKR03',28,'mid',1200,3,2.26,1.72,0,160],
  [249,'georgianArea','UKR04',32,'mid',1400,4,2.44,1.88,0,168],
  [250,'victorianGabledSemi','UKR05',20,'low',950,3,1.9,1.4,0,155],
  [251,'victorianBayVilla','UKR06',12,'low',1100,4,1.54,1.08,0,160],
  [252,'victorianGardenVilla','UKR07',12,'low',1200,4,1.54,1.08,0,150],
  [253,'victorianGothicVilla','UKR08',16,'low',1250,4,1.72,1.24,0,168],
  [254,'stoneCottagePair','UKR09',12,'low',600,2,1.54,1.08,0,135],
  [255,'brickCatslideCottage','UKR10',10,'low',550,2,1.45,1,0,135],
  [256,'courtyardCottages','UKR11',18,'low',800,2,1.81,1.32,0,140],
  [257,'thatchedLongCottage','UKR12',8,'low',500,2,1.36,.92,0,135],
  [258,'workersNarrowRow','UKR13',32,'mid',850,2,2.44,1.88,0,145],
  [259,'workersYardTerrace','UKR14',28,'mid',900,2,2.26,1.72,0,145],
  [260,'workersCourt','UKR15',36,'mid',1000,3,2.62,2.04,0,145],
  [261,'workersCornerShop','UKR16',16,'mid',1200,3,2.72,2.04,6,152]
].map(([k,id,art,capacity,band,cost,rank,power,water,jobs,h])=>Object.freeze({k,id,art,capacity,band,cost,rank,power,water,jobs,h,sz:2,kind:'R',cat:'zone',we:1,w:136,ax:68,ay:h-2})));
function residentialSelftest006(){
  const checks=[],details=[],add=(name,ok,actual)=>{checks.push(name+(ok?' ✓':' ✗'));details.push({name,ok:!!ok,actual});};
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  add('exact sixteen permanent IDs 246–261',same(Object.keys(RESIDENTIAL006).map(Number),RESIDENTIAL_EXPECTED006.map(q=>q.k)),Object.keys(RESIDENTIAL006));
  for(const q of RESIDENTIAL_EXPECTED006){const r=RESIDENTIAL006[q.k],b={k:q.k,lv:1,v:0,age:30,sz:q.sz,pw:false,wa:false},ref={...b,ref:[0,0]},tool=toolMeta434(q.id),s=SPR.bld[q.k+'_1_0'],keys=Object.keys(SPR.bld).filter(k=>Number(k.split('_')[0])===q.k);
    add(q.id+' exact locked metadata',!!r&&Object.entries(q).every(([k,v])=>r[k]===v),{expected:q,actual:r});
    add(q.id+' one searchable normally unlocked catalog entry',TOOLS.filter(t=>t.id===q.id).length===1&&tool?.unlockRank===q.rank&&catalogKeywords458(tool).includes(r.en.toLowerCase())&&RESIDENTIAL_TOOL006[q.id]===r&&KNAME[q.k]===r.nm&&KCB[q.k]==='R'&&COST[q.id]===q.cost&&toolSize458(q.id)===q.sz&&MSZ[q.k]===q.sz,{tool,kind:KCB[q.k],size:MSZ[q.k]});
    add(q.id+' fixed root-only housing authority',housingBand488(b)===q.band&&residentCapacity488(b)===q.capacity&&residentCapacity488(ref)===0&&housingBand488(ref)===null&&!residentEligible488(0,{...b,age:8})&&residentPopulation488(0,{...b,age:8})===0,{band:housingBand488(b),capacity:residentCapacity488(b),construction:residentPopulation488(0,{...b,age:8})});
    add(q.id+' no automatic level or identity mutation',!UP_MAX[q.k]&&!UP_JOB[q.k]&&MAYOR_MANUAL_ONLY470A.has(q.id),{upgrade:UP_MAX[q.k]||0,manual:MAYOR_MANUAL_ONLY470A.has(q.id)});
    add(q.id+' exact nine-day completion',!residentialBuilt006({...b,age:8})&&residentialBuilt006({...b,age:9})&&!residentialBuilt006(ref),{age8:residentialBuilt006({...b,age:8}),age9:residentialBuilt006({...b,age:9})});
    add(q.id+' explicit residential utilities and critical tier',powerLoadBase471(b)===q.power&&WATER_LOAD472.special[q.k]===q.water&&Math.abs(rootWaterDemandBase472(b)-q.water*housingOccupancy488(q.band))<1e-9&&waterProfile472(b)===WATER_PROFILE472.residential&&powerCriticalTier471(q.k)===1&&waterCriticalTier472(b)===1,{power:powerLoadBase471(b),water:rootWaterDemandBase472(b),occupancy:housingOccupancy488(q.band),powerTier:powerCriticalTier471(q.k),waterTier:waterCriticalTier472(b)});
    add(q.id+' reference cells have zero jobs utilities and housing',enterprisePotentialJobs489(0,ref)===0&&publicJobCapacity491(ref)===0&&powerLoadBase471(ref)===0&&rootWaterDemandBase472(ref)===0&&residentPopulation488(0,ref)===0,{jobs:enterprisePotentialJobs489(0,ref),power:powerLoadBase471(ref),water:rootWaterDemandBase472(ref)});
    add(q.id+' nominal commercial jobs separated from civic and industry',enterprisePotentialJobs489(0,b)===q.jobs&&ENTERPRISE_CORE_K489.has(q.k)===(q.jobs>0)&&enterpriseGroupOf489(b)===(q.jobs?'commercial':null)&&publicJobCapacity491(b)===0&&!PUBLIC_JOBS491[q.k]&&!POL_SRC[q.k]&&isSanClient445(q.k),{nominal:enterprisePotentialJobs489(0,b),group:enterpriseGroupOf489(b),public:publicJobCapacity491(b),sanitation:isSanClient445(q.k)});
    add(q.id+' exactly one original canonical asset',same(keys,[q.k+'_1_0'])&&!!s?.img&&!!s?.night&&s.__residential006===1&&[s.w,s.h,s.ax,s.ay].every((v,i)=>v===[q.w,q.h,q.ax,q.ay][i]),{keys,w:s?.w,h:s?.h,ax:s?.ax,ay:s?.ay,tag:s?.__residential006});
  }
  add('low and mid markets genuinely differ',new Set(RESIDENTIAL_EXPECTED006.map(q=>q.capacity)).size>=10&&RESIDENTIAL_EXPECTED006.filter(q=>q.band==='low').length===8&&RESIDENTIAL_EXPECTED006.filter(q=>q.band==='mid').length===8,{capacities:RESIDENTIAL_EXPECTED006.map(q=>q.capacity),bands:RESIDENTIAL_EXPECTED006.map(q=>q.band)});
  add('only corner shop has six commercial jobs',Object.values(RESIDENTIAL006).filter(q=>q.jobs).length===1&&RESIDENTIAL006[261].jobs===6&&RESIDENTIAL006[261].capacity===16,{mixed:RESIDENTIAL006[261]});
  for(let k=222;k<=237;k++)add('rejected gap '+k+' remains unregistered',!RESIDENTIAL006[k]&&!KNAME[k]&&!KCB[k]&&!MSZ[k]&&!ENTERPRISE_CORE_K489.has(k)&&!Object.keys(SPR.bld).some(v=>Number(v.split('_')[0])===k),{k});
  return {ok:details.every(q=>q.ok),checks,details,readOnly:true,assertions:details.length};
}
