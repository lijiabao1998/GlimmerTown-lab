#!/usr/bin/env node
'use strict';
// GPT-009: exact T721/candidate old-only simulation and actual save/load in CI.
// The product file is restored in finally; no baseline or save is rewritten.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync}=require('child_process');
const {withGame}=require('./harness');
const {seedApprovedBritishLegacy007}=require('./publiclife-legacy-fixture007');
const {seedApprovedLegacyStation008}=require('./station-legacy-fixture008');
const legacyFixture008='(function(seed){const seedApprovedBritishLegacy007='+seedApprovedBritishLegacy007.toString()+';return ('+seedApprovedLegacyStation008.toString()+')(seed);})';
const ROOT=__dirname,BASE='559a419270e84d7d67b883581ddef8f24302a41b';
const HASH='28eea2184153adb55437958a7055047a09abcd129346607852ecd1e86860afe4';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const current=fs.readFileSync(path.join(ROOT,'index.html'));
const old=execFileSync('git',['show',BASE+':index.html'],{cwd:ROOT,maxBuffer:32*1024*1024});
if(hash(old)!==HASH)throw Error('Pinned baseline HTML mismatch');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Run this browser comparison only in authorized isolated GitHub Actions');
// Both candidates receive the same read-only observation of the seeded PRNG
// closure. The return values and update expression stay byte-identical; reading
// the integer state does not advance it or substitute an alternate RNG.
const originalRng="function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}";
const observedRng="function mulberry32(a){const q=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};Object.defineProperty(q,'__qaSeedState007',{value:()=>a});return q;}";
function observeRng(bytes){
  let s=bytes.toString('utf8');
  if(s.split(originalRng).length!==2||s.split('let R=mulberry32(1);').length!==2)throw Error('Exact baseline RNG observation anchors missing');
  const original=Function(originalRng+';return mulberry32;')(),observed=Function(observedRng+';return mulberry32;')();
  for(const seed of[0,1,5162026,5162027,0xffffffff]){const a=original(seed),b=observed(seed);for(let i=0;i<256;i++){const state=b.__qaSeedState007();if(state!==b.__qaSeedState007()||a()!==b())throw Error('PRNG observation changed sequence or state');}}
  s=s.replace(originalRng,observedRng).replace('let R=mulberry32(1);',"let R=mulberry32(1);window.__qaSeedState007=()=>R.__qaSeedState007();");
  return Buffer.from(s,'utf8');
}
function seedBritishStationLegacy009(seed){
  const q=seedApprovedLegacyStation008(seed);
  q.stationTerrainAudit009=[];q.stationFacilityAudit009=[];q.stationBusAudit009=[];
  const fail=(message,detail)=>{throw Error(message+' '+JSON.stringify(detail));};
  const paid=(id,x,y)=>{const before=GV.tile(x,y),preview=GV.placePreview459(id,x,y),moneyBefore=GV.devMoney516B();if(!preview?.ok||!(preview.cost>0))fail('Approved station native preview rejected',{id,x,y,before,preview,moneyBefore});const placed=GV.place(id,x,y),moneyAfter=GV.devMoney516B(),after=GV.tile(x,y),charged=moneyBefore-moneyAfter,row={id,x,y,before,preview,placed,moneyBefore,moneyAfter,charged,paidExactly:Math.abs(charged-preview.cost)<1e-7,after};if(!placed||!row.paidExactly)fail('Approved station native placement/payment rejected',row);return row;};
  const prepareFacility=(id,x,y)=>{
    const before=GV.tile(x,y),occupied=['bld','road','rail','tram','bridge','dock','wp','hv471','ug471','lv475','ud475','wm472','sm472','am502','parkMeter','bus','fly475','ix475'].filter(k=>!!before[k]);
    // Bound reclamation to this one declared empty facility tile. Existing
    // transport/roots are never cleared or changed to make a preview pass.
    if(occupied.length)fail('Approved station facility is not empty',{id,x,y,before,occupied,preview:GV.placePreview459(id,x,y)});
    if(before.t===2)return;
    if(before.t!==0&&before.t!==1)fail('Unsupported station facility terrain',{id,x,y,before,preview:GV.placePreview459(id,x,y)});
    // T121 tland only accepts water. Native fill is the authorized sand→grass
    // operation; using tland on sand would itself be an invalid native action.
    const tool=before.t===0?'tland':'fill',row=paid(tool,x,y),fields=['bld','road','rail','tram','bridge','dock','wp','hv471','ug471','lv475','ud475','wm472','sm472','am502','parkMeter','bus','fly475','ix475'];
    row.facility=id;row.identityPreserved=fields.every(k=>JSON.stringify(before[k])===JSON.stringify(row.after[k]));row.singleCell=row.preview.cost===(tool==='tland'?60:20);
    q.stationTerrainAudit009.push(row);
    if(row.after.t!==2||!row.identityPreserved||!row.singleCell)fail('Approved station bounded paid terrain contract failed',row);
  };
  // Replace only the two paid native station roots with the approved T721 k139
  // British variants; all47 older British roots and every other tile remain.
  for(const [x,y]of[[50,20],[50,42]]){
    if(!GV.place('doze',x,y))throw Error('Old station whole-root demolition');
    const before=GV.devMoney516B(),p=GV.placePreview459('britishStationNS008',x,y);
    if(!p.ok||!GV.place('britishStationNS008',x,y)||Math.abs(before-GV.devMoney516B()-p.cost)>1e-7)throw Error('Approved station paid replacement');
  }
  for(const x of[51,53])for(let y=19;y<=47;y++){
    if((y>=20&&y<=24)||(y>=42&&y<=46))continue;
    if(!GV.tile(x,y).rail){const p=GV.placePreview459('rail',x,y),m=GV.devMoney516B();if(!p.ok||!GV.place('rail',x,y)||Math.abs(m-GV.devMoney516B()-p.cost)>1e-7)throw Error('Approved station physical rail');}
  }
  // The original T502 transfer requires two distinct stations within five
  // tiles. A real paid bus stop and configured native bus route supply the
  // second station, exactly as in the approved station008 integration fixture.
  // This is a construction/compatibility fixture, not a depot/ridership claim.
  const expectedBusStops=[[49,22],[49,46]];
  for(const [x,y]of expectedBusStops){const tile=GV.tile(x,y);if(!tile.road||!tile.wp||tile.bld||tile.rail||tile.tram)fail('Approved station bus stop requires its existing physical road/pipe corridor',{x,y,tile,preview:GV.placePreview459('stationBus008',x,y)});q.stationBusAudit009.push(paid('stationBus008',x,y));}
  q.approvedBusRoute009={index:0,requested:expectedBusStops,actual:GV.setBusRoute(0,expectedBusStops),routes:GV.busRoutes()};
  if(JSON.stringify(q.approvedBusRoute009.actual)!==JSON.stringify(expectedBusStops)||JSON.stringify(q.approvedBusRoute009.routes[0]?.stops)!==JSON.stringify(expectedBusStops))fail('Approved station native bus route rejected',q.approvedBusRoute009);
  for(const [id,x,y]of[['stationEntrance008',48,20],['stationCycleParking008',47,20],['stationSquare008',46,20],['stationWalkTransfer008',48,21]]){
    prepareFacility(id,x,y);q.stationFacilityAudit009.push(paid(id,x,y));
  }
  q.approvedStations=[[50,20],[50,42]];return q;
}
const stationFixture009='(function(seed){const seedApprovedBritishLegacy007='+seedApprovedBritishLegacy007.toString()+';const seedApprovedLegacyStation008='+seedApprovedLegacyStation008.toString()+';return ('+seedBritishStationLegacy009.toString()+')(seed);})';
function runWorld(seed,fixture){
  // All simulation is advanced synchronously. Cosmetic sampling is pinned too;
  // this does not replace the product simulation R(), which newWorld seeds.
  const random=Math.random;let m=123456789;
  Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
  try{
    const q=fixture?fixture(seed):GV.metroArtSeedWorld516(seed);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);
    const snap=()=>{
      const tiles=[];for(let y=0;y<q.N;y++)for(let x=0;x<q.N;x++)tiles.push(GV.tile(x,y));
      const st=GV.stats(); // Compare every exposed statistic, including cosmetic counters.
      const rng=window.__qaSeedState007();if(rng!==window.__qaSeedState007())throw Error('PRNG observation consumed state');return{stats:st,tiles,rngState:rng,...(Array.isArray(q.roots)?{approvedBritish:q.roots.map(r=>({k:r.k,x:r.x,y:r.y,actual:GV.tile(r.x,r.y).bld})),difficulty:GV.diff(),legacyTransport:q.legacyTransport?GV.line501('rail',q.legacyTransport.line):null,approvedStations:q.approvedStations?.map(p=>GV.stationDistrictAt008(...p))||[],approvedBusRoutes:q.approvedBusRoute009?GV.busRoutes():null}: {})};
    };
    const result=[snap()];if(Array.isArray(q.terrainAudit))result[0].fixtureTerrainAudit=q.terrainAudit;if(Array.isArray(q.stationTerrainAudit009))result[0].stationFixtureAudit={terrain:q.stationTerrainAudit009,facilities:q.stationFacilityAudit009,busStops:q.stationBusAudit009,busRoute:q.approvedBusRoute009};for(const n of[1,4,15]){GV.step(n);result.push(snap());}
    GV.save();if(!GV.load())throw Error('Old-city native slot3 save/load failed');result.push({...snap(),loaded:true});GV.step(1);result.push({...snap(),followingLoadedDay:true});
    return result;
  }finally{Math.random=random;}
}
(async()=>{
  const checkedSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(checkedSHA!==process.env.GITHUB_SHA)throw Error('Exact workflow SHA mismatch');
  const out={checkedSHA,workflowSHA:process.env.GITHUB_SHA,base:BASE,baselineSHA256:HASH,allExposedStatsCompared:true,checkpoints:[0,1,5,20,'native-load',21],currentSHA256:hash(current),runs:[],ok:false};
  const dest=path.join(ROOT,'streetlife-evidence','compatibility','guards');fs.mkdirSync(dest,{recursive:true});
  try{
    for(const [label,bytes]of[['baseline',old],['candidate',current]]){
      const observed=observeRng(bytes);fs.writeFileSync(path.join(ROOT,'index.html'),observed);(out.observation||(out.observation=[])).push({label,originalSHA256:hash(bytes),instrumentedSHA256:hash(observed),method:'Read-only closure-state exposure; original update/return expression exact,1280 controlled draws across5seeds identical, no checkpoint RNG consumption.'});
      const session=await withGame({port:8199,timeout:600,fresh:true,log:console.log},async({cdp})=>{
        const arr=[];for(const seed of[5162026,5162027]){
          const data=await cdp.evalJs('('+runWorld.toString()+')('+seed+')');
          const checkpoints=data.map(q=>({stats:q.stats,rngState:q.rngState,tilesSHA256:hash(JSON.stringify(q.tiles))}));
          arr.push({seed,kind:'exact sandbox showcase',checkpoints});
        }
        const approved=await cdp.evalJs('('+runWorld.toString()+')(7006719,'+legacyFixture008+')');
        if(approved.length!==6||approved.some(q=>q.difficulty!==1||q.approvedBritish.length!==47||q.approvedBritish.some(r=>r.actual?.k!==r.k))||approved.filter(q=>!q.loaded).slice(1).some(q=>q.approvedBritish.some(r=>!r.actual?.pw||!r.actual?.wa)))throw Error('Approved-British normal-difficulty fixture identity/service failed');
        const terrainAudit=approved[0].fixtureTerrainAudit;
        if(!Array.isArray(terrainAudit)||!terrainAudit.length||terrainAudit.some(q=>q.before.t!==0||q.after.t!==2||q.cost!==60||!q.paidExactly||!q.identityPreserved||q.x<1||q.x>49||q.y<1||q.y>63))throw Error('Approved-British bounded paid terrain audit failed');
        arr.push({seed:7006719,kind:'normal-difficulty old-only city with all47 approved T717–T720 British roots, native T612 railway and paid fleets',terrainAudit,checkpoints:approved.map(q=>({stats:q.stats,rngState:q.rngState,difficulty:q.difficulty,approvedBritish:q.approvedBritish,tilesSHA256:hash(JSON.stringify(q.tiles))}))});
        const station=await cdp.evalJs('('+runWorld.toString()+')(800721,'+stationFixture009+')');
        if(station.length!==6||station.some(q=>q.difficulty!==1||q.approvedBritish.length!==47||q.approvedBritish.some(r=>r.actual?.k!==r.k))||station.some(q=>q.approvedStations.length!==2||q.approvedStations.some(r=>r.k!==139||r.v!==3)))throw Error('Approved T721 station identity fixture failed');
        const stationFixtureAudit=station[0].stationFixtureAudit;
        if(!stationFixtureAudit||stationFixtureAudit.facilities.length!==4||stationFixtureAudit.facilities.some(r=>!r.preview.ok||!r.placed||!r.paidExactly||r.charged<=0)||stationFixtureAudit.terrain.some(r=>!r.paidExactly||!r.singleCell||!r.identityPreserved||r.after.t!==2||!['tland','fill'].includes(r.id)))throw Error('Approved T721 paid facility/terrain audit failed '+JSON.stringify(stationFixtureAudit));
        const transfer=stationFixtureAudit.facilities.find(r=>r.id==='stationWalkTransfer008'),stationRefs=transfer?.after?.amx502?.stations;
        if(stationFixtureAudit.busStops.length!==2||stationFixtureAudit.busStops.some(r=>r.id!=='stationBus008'||!r.paidExactly||r.charged<=0||!r.after.bus||r.after.am502!==4)||JSON.stringify(stationFixtureAudit.busRoute.actual)!=='[[49,22],[49,46]]'||!Array.isArray(stationRefs)||new Set(stationRefs).size!==2||!stationRefs.some(r=>r.startsWith('rail|'))||!stationRefs.some(r=>r.startsWith('bus|'))||station.some(q=>JSON.stringify(q.approvedBusRoutes?.[0]?.stops)!=='[[49,22],[49,46]]'))throw Error('Approved T721 genuine paid bus route/two-station transfer audit failed '+JSON.stringify(stationFixtureAudit));
        arr.push({seed:800721,kind:'All47 old British roots plus approved T721 station/physical rail/themes; actual save/load and following day',stationFixtureAudit,checkpoints:station.map(q=>({stats:q.stats,rngState:q.rngState,difficulty:q.difficulty,approvedBritish:q.approvedBritish,approvedStations:q.approvedStations,approvedBusRoutes:q.approvedBusRoutes,legacyTransport:q.legacyTransport,tilesSHA256:hash(JSON.stringify(q.tiles)),loaded:q.loaded,followingLoadedDay:q.followingLoadedDay}))});
        if(cdp.errors.length){out.consoleErrors={label,errors:cdp.errors};throw Error(label+' console or uncaught errors: '+JSON.stringify(cdp.errors));}return arr;
      });
      if(!session.ok||!session.result)throw Error(label+' browser failure: '+JSON.stringify(session.fails));
      out.runs.push({label,result:session.result});
    }
    out.ok=JSON.stringify(out.runs[0].result)===JSON.stringify(out.runs[1].result);
    if(!out.ok)throw Error('Existing-city simulation changed; compare compatibility.json');
  }catch(e){out.error=String(e.stack||e);}
  finally{
    fs.writeFileSync(path.join(ROOT,'index.html'),current);
    out.restored=hash(fs.readFileSync(path.join(ROOT,'index.html')))===out.currentSHA256;
    fs.writeFileSync(path.join(dest,'compatibility.json'),JSON.stringify(out,null,2));
  }
  console.log(JSON.stringify(out,null,2));process.exit(out.ok&&out.restored?0:1);
})().catch(e=>{fs.writeFileSync(path.join(ROOT,'index.html'),current);console.error(e);process.exit(1);});
