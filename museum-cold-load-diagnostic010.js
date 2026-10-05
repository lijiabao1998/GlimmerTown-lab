#!/usr/bin/env node
'use strict';
// Diagnostic only. Product bytes are immutable; game/browser execution is CI-only.
// A completed diagnostic does NOT certify that cold loading works.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only; no local game execution');
const TARGET=path.resolve(process.env.COLD010_TARGET||''),OUT=path.resolve(process.env.COLD010_OUT||'cold-load-evidence010');
const TARGETS={
 'd9dfe87689fa841edb8775d0f95db77d9f2deb5b':{name:'T722',version:'14.26',sourceSHA256:'b00099c4837038812278ee5e3f86528416731e24904559e60befb575b315934f'},
 '759394f8bd48dbe77fb21e8604015e2d1ca56d21':{name:'T723',version:'14.27',sourceSHA256:'66fff895f7805b6d7945ba737f9d5414af6e911295c48d7509334678976f4921'}
};
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const targetSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:TARGET,encoding:'utf8'}).trim(),target=TARGETS[targetSHA];
if(!target||targetSHA!==process.env.COLD010_TARGET_SHA)throw Error('Exact allowlisted immutable target required');
const product=fs.readFileSync(path.join(TARGET,'index.html'));if(hash(product)!==target.sourceSHA256)throw Error('Target product pin changed');
const pins={'streetlife-integration-qa009.js':'6585359c7af48ee68d09f20720d778b12ddf3da687190cc755bd7d34447e1b05','publiclife-legacy-fixture007.js':'f91a1c2b7e79eb635937910535191b842b4f6782cec51e2569a73b04323c6e11'};
for(const[f,pin]of Object.entries(pins))if(hash(fs.readFileSync(path.join(TARGET,f)))!==pin)throw Error('Old fixture pin changed: '+f);
const {withGame,waitFor}=require(path.join(TARGET,'harness'));
const {seedApprovedBritishLegacy007}=require(path.join(TARGET,'publiclife-legacy-fixture007'));
const old=fs.readFileSync(path.join(TARGET,'streetlife-integration-qa009.js'),'utf8'),start=old.indexOf('function setupStreet009('),end=old.indexOf('function snapshot009(',start);
if(start<0||end<start)throw Error('Pinned old fixture range missing');
const setup=old.slice(start,end);
fs.mkdirSync(OUT,{recursive:true});
const report={targetSHA,release:target.name,version:target.version,sourceSHA256:target.sourceSHA256,observerSHA:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID,fixtureSourcePins:pins,fixtureRangeSHA256:hash(setup),startedAt:new Date().toISOString(),checks:[],snapshots:[],artifacts:[],limits:[
 'Observation-only CI on two immutable product commits; no main/release/deployment changes.',
 'Same byte-pinned old T722 street-life fixture in each target. No museum is added, so T723 is tested through inherited authorities.',
 'Fixture seeds old building ages, initial money and rank. New streetlife, housing, utility and road purchases are native paid actions.',
 'No POWER arrays, utility flags, staff, population, game age or district cache are assigned during measured load paths.',
 'Passive snapshots never call t450/t471/powerAt/ensure/dispatch/recompute helpers.',
 'The separate paid-road intervention happens only after all unassisted cold-load observations; recovery cannot count as cold-load success.',
 'diagnosticComplete means evidence collection completed, not that gameplay passed.'
]};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
const assert=(name,ok,detail)=>{report.checks.push({name,ok:!!ok,detail});save();if(!ok)throw Error(name);};
// Serialized into the CI browser. Reads only already-existing public snapshots
// and tile flags. No injected game getter or product-byte instrumentation.
function passiveCold010(label){
 const tiles=[];let roads=0,poweredRoads=0,sources=0,poweredSources=0;const sourceRows=[];
 for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);if(t?.road){roads++;if(t.rp)poweredRoads++;}const b=t?.bld;if(b&&!b.ref&&b.k===5){sources++;if(b.pw)poweredSources++;sourceRows.push({x,y,k:b.k,age:b.age,pw:!!b.pw,wa:!!b.wa});}}
 const e=GV.streetLifeEvidence009();return{label,at:performance.now(),stats:GV.stats(),difficulty:GV.diff(),developer:GV.dev516B(),slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),menuVisible:getComputedStyle(document.getElementById('start')).display!=='none',physical:{roads,poweredRoads,sources,poweredSources,sourceRows},powerReach:window.__t444Power?JSON.parse(JSON.stringify(window.__t444Power)):null,powerDistrictCache:window.__t450Power?JSON.parse(JSON.stringify(window.__t450Power)):null,street:e,otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](?:$|[._])/.test(k))};
}
function saveIdentityCold010(){const rows=[];for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);if(t?.bld&&!t.bld.ref){const b=t.bld;rows.push({root:y*72+x,k:b.k,lv:b.lv,v:b.v,age:b.age,sz:b.sz||1});}}return rows;}
function paidRoadCold010(){
 const candidates=[[49,50],[49,51],[49,52],[56,38],[69,38]];
 for(const[x,y]of candidates){const t=GV.tile(x,y);if(!t||t.bld||t.road||t.rail||t.tram||t.am502)continue;const p=GV.placePreview459('road',x,y);if(!p?.ok||!(p.cost>0))continue;const before=GV.devMoney516B(),placed=GV.place('road',x,y),charged=before-GV.devMoney516B();return{x,y,tool:'road',preview:p,before,after:GV.devMoney516B(),placed,charged,exact:placed&&charged===p.cost,previous:t,next:GV.tile(x,y),phase:'separate recovery intervention; not a cold-load pass'};
 }throw Error('No bounded ordinary paid road-touch plot');
}
(async()=>{const watchdog=setTimeout(()=>{report.error='Diagnostic watchdog';save();process.exit(124);},20*60000);watchdog.unref();try{
 const session=await withGame({port:8199,timeout:1100,enterCity:false,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  const ev=expr=>cdp.evalJs(expr),register=()=>ev('window.__cold010=(()=>{'+setup+'\n'+passiveCold010.toString()+'\n'+saveIdentityCold010.toString()+'\n'+paidRoadCold010.toString()+';return{setupStreet009,passiveCold010,saveIdentityCold010,paidRoadCold010};})()');
  const snap=async(label)=>{const q=await ev('window.__cold010.passiveCold010('+JSON.stringify(label)+')');report.snapshots.push(q);console.log(label,JSON.stringify({day:q.stats.day,pop:q.stats.pop,powered:q.stats.poweredBld,liveRoads:q.physical.poweredRoads,districts:q.powerDistrictCache?.districts,staff:q.street.roots.map(r=>r.employed)}));save();return q;};
  const day=async(label)=>{const before=await ev('GV.stats().day');await ev('GV.step(1);GV.setSpeed(0);GV.ai(false)');const q=await snap(label);assert(label+' advances exactly one ordinary day',q.stats.day===before+1&&q.difficulty===1&&!q.developer.sandbox&&!q.developer.god);return q;};
  const raf=async(label)=>{const before=await ev('GV.stats().day');const q=await ev('new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__cold010.passiveCold010('+JSON.stringify(label)+'))))');report.snapshots.push(q);assert(label+' does not advance a day',q.stats.day===before);return q;};
  const shot=async(file,label)=>{const r=await cdp.send('Page.captureScreenshot',{format:'png'}),b=Buffer.from(r.data,'base64');fs.writeFileSync(path.join(OUT,file),b);report.artifacts.push({file,label,sha256:hash(b),targetSHA,sourceSHA256:target.sourceSHA256});save();};
  report.boot=await ev('({done:!!window.__bootDone453,version:GV.ver(),label:document.getElementById("startVersion456")?.textContent.trim(),slot:localStorage.getItem("glimmerville.v1.slot")})');assert('exact target boot and isolated slot3',report.boot.done&&report.boot.version===target.version&&report.boot.label==='v'+target.version+' · '+target.name&&report.boot.slot==='3',report.boot);
  await register();report.fixture=await ev('window.__cold010.setupStreet009(('+seedApprovedBritishLegacy007.toString()+'))');assert('same ordinary paid fixture starts age-zero streetlife',report.fixture.difficulty===1&&!report.fixture.developer.sandbox&&!report.fixture.developer.god&&report.fixture.paid.every(q=>q.exact&&q.charged>0)&&report.fixture.initial.roots.every(q=>q.age===0),report.fixture);
  let ready;for(let n=1;n<=24;n++){ready=await day('fixture-day-'+n);if(n>=9&&ready.street.roots.length===3&&ready.street.roots.every(q=>q.operational&&q.employed>0))break;}
  assert('fixture truly operational before save comparisons',ready.street.roots.length===3&&ready.street.roots.every(q=>q.operational&&q.employed>0)&&ready.stats.pop>0,ready);
  await ev('GV.save()');const raw=await ev("localStorage.getItem('glimmerville.v1.s3')");assert('native original slot3 save exists',typeof raw==='string'&&raw.length>1000);report.originalSave={sha256:hash(raw),bytes:Buffer.byteLength(raw),day:ready.stats.day,rootIdentity:await ev('window.__cold010.saveIdentityCold010()')};
  // Cold path first: the currently paused world is exactly the just-saved
  // native state, so visibilitychange/autosave cannot replace it with a later
  // warm-control day during Page.reload. Preserve the full byte comparison.
  assert('cold input is the same exact native save bytes',await ev("localStorage.getItem('glimmerville.v1.s3')")===raw);
  await cdp.send('Page.reload',{ignoreCache:true});assert('actual cold page returns to fully baked menu',await waitFor(cdp,"!!window.__bootDone453&&!!window.GV&&getComputedStyle(document.getElementById('start')).display!=='none'",180000));
  report.beforeContinue=await ev("({version:GV.ver(),slot:localStorage.getItem('glimmerville.v1.slot'),saved:localStorage.getItem('glimmerville.v1.s3'),continueVisible:getComputedStyle(document.getElementById('bContinue')).display!=='none',reach:window.__t444Power||null,districtCache:window.__t450Power||null})");assert('before Continue original save bytes and target version persist',report.beforeContinue.saved===raw&&report.beforeContinue.version===target.version&&report.beforeContinue.slot==='3'&&report.beforeContinue.continueVisible);report.beforeContinue.savedSHA256=hash(report.beforeContinue.saved);delete report.beforeContinue.saved;
  await register();report.coldImmediate=await ev("(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);return window.__cold010.passiveCold010('cold-Continue-immediate');})()");report.snapshots.push(report.coldImmediate);assert('cold Continue keeps exact native root identities and day',JSON.stringify(await ev('window.__cold010.saveIdentityCold010()'))===JSON.stringify(report.originalSave.rootIdentity)&&report.coldImmediate.stats.day===report.originalSave.day);
  await raf('cold-first-RAF');await raf('cold-second-RAF');await shot('cold-after-RAF.png','unassisted cold Continue after actual paused RAFs');
  report.coldFirstDay=await day('cold-first-ordinary-day');report.coldSecondDay=await day('cold-second-ordinary-day');report.coldThirdDay=await day('cold-third-ordinary-day');await shot('cold-third-day.png','unassisted cold load after three ordinary days');
  report.intervention=await ev('window.__cold010.paidRoadCold010()');assert('separate recovery intervention is a paid ordinary road placement',report.intervention.exact&&report.intervention.charged>0,report.intervention);await snap('paid-road-immediate');
  report.recovery=[];for(let n=1;n<=3;n++)report.recovery.push(await day('paid-road-recovery-day-'+n));await shot('paid-road-recovery.png','separate native paid-road recovery intervention');
  // Warm control runs only after the untouched cold observations and separate
  // recovery intervention. Restore the same original native bytes and load
  // them synchronously in one evaluation; no subsequent navigation can trigger
  // visibilitychange autosave of the recovery world over that input.
  await snap('before-warm-GV-load');
  report.warmInput=await ev("(()=>{localStorage.setItem('glimmerville.v1.s3',"+JSON.stringify(raw)+");const input=localStorage.getItem('glimmerville.v1.s3');const loaded=GV.load();GV.setSpeed(0);GV.ai(false);return{input,loaded};})()");
  assert('warm control consumes the exact original native save bytes',report.warmInput.input===raw&&report.warmInput.loaded);
  report.warmInput.savedSHA256=hash(report.warmInput.input);delete report.warmInput.input;
  const warmImmediate=await snap('warm-immediate');
  assert('warm load keeps exact original root identities and day',JSON.stringify(await ev('window.__cold010.saveIdentityCold010()'))===JSON.stringify(report.originalSave.rootIdentity)&&warmImmediate.stats.day===report.originalSave.day);
  await raf('warm-first-RAF');await raf('warm-second-RAF');report.warmFirstDay=await day('warm-first-ordinary-day');
  const functional=q=>!!q&&q.stats.pop>0&&q.stats.poweredBld>0&&q.street.roots.length===3&&q.street.roots.every(r=>r.operational&&r.employed>0);
  report.findings={warmFirstDayFunctional:functional(report.warmFirstDay),coldFirstDayFunctional:functional(report.coldFirstDay),coldThirdDayFunctional:functional(report.coldThirdDay),paidRoadRecoveryFunctional:report.recovery.some(functional),coldPhysicalRoadsWithEmptyDistrictCache:report.coldFirstDay.physical.poweredRoads>0&&report.coldFirstDay.powerDistrictCache?.districts===0,strictlySameNativeSave:report.beforeContinue.savedSHA256===report.originalSave.sha256&&report.warmInput.savedSHA256===report.originalSave.sha256,doesNotCertifyColdLoadSuccess:true};
  report.consoleErrors=cdp.errors;assert('no browser game exceptions',cdp.errors.length===0,cdp.errors);return true;
 });report.session={ok:session.ok,fails:session.fails,seconds:session.seconds};assert('diagnostic session completed',session.ok,report.session);assert('target product bytes untouched',hash(fs.readFileSync(path.join(TARGET,'index.html')))===target.sourceSHA256);report.diagnosticComplete=true;report.ok=true;
 }catch(e){report.error=String(e.stack||e);report.diagnosticComplete=false;report.ok=false;process.exitCode=1;}finally{clearTimeout(watchdog);report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({diagnosticComplete:report.diagnosticComplete,targetSHA,findings:report.findings,error:report.error}));}})();
