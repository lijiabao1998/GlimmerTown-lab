/* GPT-005 resident smoke: metadata and pure formulas only, safe in a live city.
   Embed before highstreet-gameplay-probe005.js inside the main game IIFE. */
const HIGHSTREET_EXPECTED005=Object.freeze([
  {k:238,id:'coOpStores',art:'UKH01',sz:2,cost:2000,rank:4,kind:'C',jobs:12,power:2.4,water:3,keyword:'co-operative'},
  {k:239,id:'stoneBakehouse',art:'UKH02',sz:2,cost:1500,rank:3,kind:'C',jobs:8,power:2.6,water:3.4,keyword:'bakehouse'},
  {k:240,id:'coveredMarket',art:'UKH03',sz:3,cost:3500,rank:6,kind:'C',jobs:24,power:4.5,water:5,keyword:'market'},
  {k:241,id:'boardSchool',art:'UKH04',sz:3,cost:2200,rank:4,kind:'D',jobs:10,seats:120,upkeep:4,power:2.8,water:2,cov:'school',family:'education',keyword:'school'},
  {k:242,id:'cottageSurgery',art:'UKH05',sz:2,cost:1600,rank:3,kind:'H',jobs:6,beds:6,service:100,upkeep:3.5,power:2.2,water:3,cov:'clinic',family:'health',keyword:'surgery'},
  {k:243,id:'highStreetPost',art:'UKH06',sz:2,cost:1400,rank:3,kind:'S',jobs:6,service:85,upkeep:3,power:1.8,water:1.3,cov:'post',family:'other',keyword:'post'},
  {k:244,id:'municipalBaths',art:'UKH07',sz:3,cost:3000,rank:5,kind:'A',jobs:10,leisure:140,upkeep:5,power:4,water:7,cov:'pool',family:'other',keyword:'baths'},
  {k:245,id:'villageHall',art:'UKH08',sz:2,cost:1200,rank:3,kind:'A',jobs:5,service:70,leisure:85,upkeep:2,power:1.6,water:1.4,cov:'civicc',family:'other',keyword:'hall'}
].map(Object.freeze));
function highStreetSelftest005(){
  const checks=[],details=[],add=(name,ok,actual)=>{checks.push(name+(ok?' ✓':' ✗'));details.push({name,ok:!!ok,actual});};
  add('exact permanent IDs 238–245',JSON.stringify(Object.keys(HIGHSTREET005).map(Number).sort((a,b)=>a-b))===JSON.stringify(HIGHSTREET_EXPECTED005.map(q=>q.k)),Object.keys(HIGHSTREET005));
  const gapTables={HIGHSTREET005,BRITISH004,KNAME,KCB,MSZ,UP_MAX,UP_JOB,PUBLIC_JOBS491,EDUCATION_CAP491,CIVIC_EDU_SEATS495,CIVIC_HEALTH_BEDS495,SERVICE_CAP491,LEISURE_BASE491};
  for(let k=222;k<=237;k++){
    const registrations=Object.entries(gapTables).filter(([,table])=>Object.prototype.hasOwnProperty.call(table,k)).map(([name])=>name),sprites=Object.keys(SPR.bld).filter(key=>Number(key.split('_')[0])===k);
    add('reserved gap ID '+k+' has no building registration or sprite',registrations.length===0&&sprites.length===0&&!ENTERPRISE_CORE_K489.has(k),{k,registrations,sprites,enterprise:ENTERPRISE_CORE_K489.has(k)});
  }
  const approved=[
    {k:219,id:'britishTerrace',art:'UKP01',nm:'維多利亞紅磚連棟屋',sz:2,cost:1100,rank:3,cat:'zone',kind:'R',capacity:32},
    {k:220,id:'foxFinchPub',art:'UKP02',nm:'狐狸與雀鳥街角酒館',sz:2,cost:1800,rank:3,cat:'civic',kind:'C',jobs:10},
    {k:221,id:'edwardianLibrary',art:'UKP03',nm:'愛德華時代公共圖書館',sz:3,cost:2400,rank:6,cat:'culture',kind:'D',jobs:16,seats:160,upkeep:8}
  ];
  for(const e of approved){
    const q=BRITISH004[e.k];
    add('approved ID '+e.k+' exact metadata remains unchanged',!!q&&Object.keys(q).length===Object.keys(e).length&&Object.entries(e).every(([key,value])=>q[key]===value)&&BRITISH_TOOL004[e.id]===q&&!HIGHSTREET005[e.k]&&KNAME[e.k]===e.nm&&KCB[e.k]===e.kind&&MSZ[e.k]===e.sz&&COST[e.id]===e.cost,{expected:e,definition:q,name:KNAME[e.k],kind:KCB[e.k],size:MSZ[e.k],cost:COST[e.id]});
  }
  for(const e of HIGHSTREET_EXPECTED005){
    const q=HIGHSTREET005[e.k],t=toolMeta434(e.id),b={k:e.k,lv:1,v:0,age:30,sz:e.sz};
    const fields=['k','id','art','sz','cost','rank','kind','jobs'];
    add(e.id+' locked card metadata',!!q&&fields.every(k=>q[k]===e[k])&&KNAME[e.k]===q.nm&&kcatOf(e.k)===e.kind,{definition:q,name:KNAME[e.k],kind:kcatOf(e.k)});
    add(e.id+' single catalog entry and full save footprint',TOOLS.filter(z=>z.id===e.id).length===1&&HIGHSTREET_TOOL005[e.id]===q&&t?.unlockRank===e.rank&&toolSize458(e.id)===e.sz&&MSZ[e.k]===e.sz&&COST[e.id]===e.cost,{catalog:t,size:toolSize458(e.id),saveSize:MSZ[e.k],cost:COST[e.id]});
    const keywords=t?catalogKeywords458(t).toLowerCase():'';
    add(e.id+' searchable English role',keywords.includes(e.keyword),{keyword:e.keyword,keywords});
    add(e.id+' fixed mature identity',!UP_MAX[e.k]&&!UP_JOB[e.k],{upgrade:UP_MAX[e.k]??null,upgradeJobs:UP_JOB[e.k]??null});
    add(e.id+' nine-day root-only completion',!highStreetBuilt005({...b,age:8})&&highStreetBuilt005({...b,age:9})&&!highStreetBuilt005({...b,ref:[0,0]}),{age8:highStreetBuilt005({...b,age:8}),age9:highStreetBuilt005({...b,age:9})});
    add(e.id+' exact utility loads',powerLoadBase471(b)===e.power&&rootWaterDemandBase472(b)===e.water,{power:powerLoadBase471(b),water:rootWaterDemandBase472(b)});
    const ref={...b,ref:[0,0]};
    add(e.id+' reference has zero capacities and demand',residentCapacity488(ref)===0&&enterprisePotentialJobs489(0,ref)===0&&publicJobCapacity491(ref)===0&&powerLoadBase471(ref)===0&&rootWaterDemandBase472(ref)===0,{resident:residentCapacity488(ref),enterprise:enterprisePotentialJobs489(0,ref),public:publicJobCapacity491(ref),power:powerLoadBase471(ref),water:rootWaterDemandBase472(ref)});
    const artSize={238:[136,170,68,168],239:[136,150,68,148],240:[208,210,104,208],241:[208,195,104,193],242:[136,145,68,143],243:[136,155,68,153],244:[208,205,104,203],245:[136,145,68,143]}[e.k];
    const keys=Object.keys(SPR.bld).filter(k=>k.split('_')[0]===String(e.k)),s=SPR.bld[e.k+'_1_0'];
    add(e.id+' exactly one original canonical sprite',keys.length===1&&keys[0]===e.k+'_1_0'&&!!s?.img&&!!s?.night&&s.__highStreet005===1&&[s.w,s.h,s.ax,s.ay].every((v,i)=>v===artSize[i]),{keys,width:s?.w,height:s?.h,ax:s?.ax,ay:s?.ay,expected:artSize,tag:s?.__highStreet005,day:!!s?.img,night:!!s?.night});
    if(e.kind==='C'){
      add(e.id+' commerce jobs with no civic alias',ENTERPRISE_CORE_K489.has(e.k)&&enterpriseGroupOf489(b)==='commercial'&&enterprisePotentialJobs489(0,b)===e.jobs&&!PUBLIC_JOBS491[e.k]&&!SERVICE_CAP491[e.k]&&!LEISURE_BASE491[e.k]&&!q.upkeep,{group:enterpriseGroupOf489(b),jobs:enterprisePotentialJobs489(0,b),public:PUBLIC_JOBS491[e.k]||0,upkeep:q.upkeep||0});
      add(e.id+' commercial utility profile',waterProfile472(b)===WATER_PROFILE472.commercial&&powerCriticalTier471(e.k)===2&&waterCriticalTier472(b)===2,{powerTier:powerCriticalTier471(e.k),waterTier:waterCriticalTier472(b),profile:waterProfile472(b)});
    }else{
      add(e.id+' public nominal jobs are fixed and completion gated',PUBLIC_JOBS491[e.k]===e.jobs&&publicJobCapacity491(b)===e.jobs&&publicJobCapacity491({...b,age:8})===0&&!ENTERPRISE_CORE_K489.has(e.k)&&enterprisePotentialJobs489(0,b)===0,{nominal:PUBLIC_JOBS491[e.k],complete:publicJobCapacity491(b),construction:publicJobCapacity491({...b,age:8})});
      add(e.id+' coverage family and capacity metadata',covFieldOfK(e.k)===e.cov&&TOOL_COV459[e.id]===e.cov&&civicFamily495(e.k)===e.family&&(EDUCATION_CAP491[e.k]||0)===(e.seats||0)&&(CIVIC_EDU_SEATS495[e.k]||0)===(e.seats||0)&&(CIVIC_HEALTH_BEDS495[e.k]||0)===(e.beds||0)&&(SERVICE_CAP491[e.k]||0)===(e.service||0)&&(LEISURE_BASE491[e.k]||0)===(e.leisure||0)&&q.upkeep===e.upkeep,{coverage:covFieldOfK(e.k),family:civicFamily495(e.k),seats:EDUCATION_CAP491[e.k]||0,beds:CIVIC_HEALTH_BEDS495[e.k]||0,service:SERVICE_CAP491[e.k]||0,leisure:LEISURE_BASE491[e.k]||0,upkeep:q.upkeep});
    }
  }
  return {ok:details.every(q=>q.ok),checks,details,readOnly:true,assertions:details.length};
}
