#!/usr/bin/env node
'use strict';
// Formal cold-load guard. Runtime runs only in isolated GitHub Actions.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process'),{isDeepStrictEqual:eq}=require('node:util');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only; never run the game locally');
const {withGame,waitFor}=require('./harness');
const {verifyStatic011}=require('./coldload-static-contract011');
const {verifyFingerprint011}=require('./coldload-fingerprint-qa011');
const {seedApprovedBritishLegacy007}=require('./publiclife-legacy-fixture007');
const ROOT=__dirname,MODE=process.env.COLD011_CASE||'all',OUT=path.join(ROOT,'coldload-evidence011'),hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const MODES=['without-museum','with-museum','zero-source','disconnected','escape-disabled'];
if(MODE!=='all'&&!MODES.includes(MODE))throw Error('Unknown cold-load case');
const CASES=MODE==='all'?MODES.slice(0,4):[MODE],head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow-head checkout required');
const source=fs.readFileSync(path.join(ROOT,'index.html')),sourceSHA256=hash(source);
const fixturePins={'streetlife-integration-qa009.js':'6585359c7af48ee68d09f20720d778b12ddf3da687190cc755bd7d34447e1b05','publiclife-legacy-fixture007.js':'f91a1c2b7e79eb635937910535191b842b4f6782cec51e2569a73b04323c6e11'};
for(const[f,pin]of Object.entries(fixturePins))if(hash(fs.readFileSync(path.join(ROOT,f)))!==pin)throw Error('Old paid fixture changed: '+f);
function range(s,a,b){const x=s.indexOf(a),y=s.indexOf(b,x);if(x<0||y<=x)throw Error('Missing fixture range '+a);return s.slice(x,y);}
const street=range(fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8'),'function setupStreet009(','function snapshot009(');
const museum=range(fs.readFileSync(path.join(ROOT,'museum-integration-qa010.js'),'utf8'),'function setupMuseum010(','function assets010(');
if(hash(street)!=='11cebcd7a47343bbe1f0f29d6fe78da92b863973fd157c21ede31626fc2b777f'||hash(museum)!=='37c0be326c5763933e2835accedb9e2fad4403a1167b986bd40bea5dbfca0eb6')throw Error('Approved fixture bodies changed');
const BASELINE011={run:37296616989,url:'https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37296616989',method:'Actual immutable diagnostic R2, same pinned old street-life fixture, same native save in warm and cold paths; new museum absent.',versions:[
 {version:'14.26',anchor:'T722',sha:'d9dfe87689fa841edb8775d0f95db77d9f2deb5b',sourceSHA256:'b00099c4837038812278ee5e3f86528416731e24904559e60befb575b315934f',manifestSHA256:'705579c639f7e9463ecc46f56cd6c11f8a926f7127be9ab6ee6617e3703a8abf'},
 {version:'14.27',anchor:'T723',sha:'759394f8bd48dbe77fb21e8604015e2d1ca56d21',sourceSHA256:'66fff895f7805b6d7945ba737f9d5414af6e911295c48d7509334678976f4921',manifestSHA256:'eb7389c5ce392a81c60c15d3d88af09b58bfb2ab83be46456c78c18e80ed5616'}
 ],observedBoth:{coldFirstDay:{pop:0,poweredBld:0,liveRoads:441,districts:0,staff:[0,0,0]},coldThirdDay:{pop:0,poweredBld:0,liveRoads:441,districts:0,staff:[0,0,0]},warmFirstDay:{pop:1158,poweredBld:97,liveRoads:441,districts:1,staff:[17,8,3]},separatePaidRoadRecovery:true,sameNativeSave:true}};
fs.mkdirSync(OUT,{recursive:true});
const report={checkedSHA:head,workflowSHA:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID,sourceSHA256,mode:MODE,baselineEvidence:BASELINE011,startedAt:new Date().toISOString(),checks:[],cases:[],artifacts:[],limits:[
 'All product/browser/pixel execution occurs only in isolated GitHub Actions.',
 'Initial old town ages, money and rank use the approved pinned fixture. New museum/housing/utilities/path purchases use actual paid tools.',
 'Cold paths have no supply, staff, population, age, cache assignment or recompute/ensure/repair helper calls.',
 'Two native page reloads per case; first ordinary day after each Continue must pass without repair in positive cases.',
 'Negative controls use paid source or road removal and must stay unserved after cold reload.',
 'Causal baseline numbers are separately labeled historical R2 artifacts, not fabricated candidate measurements.'
]};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
function check(name,ok,detail){const q={name,ok:!!ok,detail};report.checks.push(q);if(!ok){report.failures=(report.failures||[]).concat(name);save();throw Error(name);}save();console.log('PASS '+name);}
// The following functions are serialized, never executed by Node.
function coldSnapshot011(label){
 let roads=0,liveRoads=0;const sources=[],storage=[],ids=[],paths=[];
 const sourceKinds=new Set([5,25,26,58,59,60,62,140,141,142,143,144,145,150]);
 for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y),b=t?.bld;if(t?.road){roads++;if(t.rp)liveRoads++;}if(t?.am502)paths.push({i:y*72+x,am502:t.am502,amx502:t.amx502||null});if(!b||b.ref)continue;ids.push({root:y*72+x,k:b.k,lv:b.lv,v:b.v,age:b.age,sz:b.sz||1});if(sourceKinds.has(b.k))sources.push({x,y,k:b.k,pw:!!b.pw,age:b.age});if([146,147,150].includes(b.k))storage.push({x,y,k:b.k});}
 return{label,at:performance.now(),stats:GV.stats(),version:GV.ver(),difficulty:GV.diff(),developer:GV.dev516B(),escapeDisabled:!!window.__noColdLoadPower011,slot:localStorage.getItem('glimmerville.v1.slot'),roads,liveRoads,sources,storage,ids,paths,reach:window.__t444Power?JSON.parse(JSON.stringify(window.__t444Power)):null,districtCache:window.__t450Power?JSON.parse(JSON.stringify(window.__t450Power)):null,street:GV.streetLifeEvidence009(),museum:GV.museumEvidence010()};
}
function paidNegative011(kind){
 const rows=[],kinds=new Set([5,25,26,58,59,60,62,140,141,142,143,144,145,150]),targets=[];
 for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y),b=t?.bld;if(kind==='zero-source'&&b&&!b.ref&&kinds.has(b.k))targets.push({x,y,k:b.k});if(kind==='disconnected'&&t?.road)targets.push({x,y,k:'road'});}
 for(const t of targets){let n=0;do{const before=GV.devMoney516B(),p=GV.placePreview459('doze',t.x,t.y),ok=p?.ok&&p.cost>0&&GV.place('doze',t.x,t.y),charged=before-GV.devMoney516B();if(!ok||Math.abs(charged-p.cost)>1e-7)throw Error('Negative control requires actual paid demolition');rows.push({...t,tool:'doze',cost:p.cost,charged,exact:true});n++;if(n>5)throw Error('Road layers did not clear');}while(kind==='disconnected'&&GV.tile(t.x,t.y).road);}
 return{kind,targets,rows,after:coldSnapshot011('negative-paid-removals')};
}
(async()=>{const watchdog=setTimeout(()=>{report.error='Cold-load formal guard watchdog';save();process.exit(124);},28*60000);watchdog.unref();try{
 report.static=verifyStatic011();check('one authorized cold-load patch and protected product/art sources',report.static.ok===true,report.static);
 const version=(source.toString().match(/const GAME_VER='([^']+)'/)||[])[1],anchor=(source.toString().match(/const GAME_ANCHOR='([^']+)'/)||[])[1];
 check('candidate retains T723 or formally released T724 labels',(version==='14.27'&&anchor==='T723')||(version==='14.28'&&anchor==='T724'),{version,anchor});report.version=version;report.anchor=anchor;
 const session=await withGame({port:8199,timeout:1650,enterCity:false,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');window.__noColdLoadPower011="+(MODE==='escape-disabled')+';',log:console.log},async({cdp})=>{
  const ev=x=>cdp.evalJs(x);
  const register=()=>ev('window.__cold011=(()=>{'+street+'\n'+museum+'\n'+coldSnapshot011.toString()+'\n'+paidNegative011.toString()+';return{setupStreet009,setupMuseum010,coldSnapshot011,paidNegative011};})()');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  const boot=await ev('({ready:!!window.__bootDone453,version:GV.ver(),label:document.getElementById("startVersion456")?.textContent.trim(),batches:window.__t574})');check('native completed boot with exact candidate/release labels',boot.ready&&boot.version===version&&boot.label==='v'+version+' · '+anchor&&!boot.batches.err.length,boot);
  const fp=await ev('GV.fp536()'),blocks=await ev('GV.blockFp536()');report.fingerprint=verifyFingerprint011(fp,blocks);check('all 2895 approved leaves,157 families and1728 blocks stay exact',report.fingerprint.ok===true&&fp.stats.leaves===2895&&fp.stats.families===157&&blocks.count===1728,report.fingerprint);fs.writeFileSync(path.join(OUT,'fingerprint-native.json'),JSON.stringify({checkedSHA:head,sourceSHA256,version,anchor,fp,blocks,proof:report.fingerprint},null,2));
  for(const caseName of CASES){
   const item={case:caseName,expected:caseName==='escape-disabled'?'known regression with escape valve':caseName==='zero-source'||caseName==='disconnected'?'correctly remains unserved':'unaided cold first-day success',snapshots:[],reloads:[],startedAt:new Date().toISOString()},dir=path.join(OUT,caseName);report.cases.push(item);fs.mkdirSync(dir,{recursive:true});const persist=()=>{fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({checkedSHA:head,sourceSHA256,version,anchor,...item},null,2));save();};
   const snap=async(label)=>{const q=await ev('window.__cold011.coldSnapshot011('+JSON.stringify(label)+')');item.snapshots.push(q);persist();return q;};
   const step=async(label)=>{const before=await ev('GV.stats().day');await ev('GV.step(1);GV.setSpeed(0);GV.ai(false)');const q=await snap(label);check(caseName+': '+label+' is one ordinary day',q.stats.day===before+1&&q.difficulty===1&&!q.developer.sandbox&&!q.developer.god);return q;};
   const screenshot=async(file,label)=>{await ev('GV.setRot(0);GV.setZoom(1.5);GV.lookAt('+(caseName==='without-museum'?'59,21':'60,42')+');GV.forceDraw()');const r=await cdp.send('Page.captureScreenshot',{format:'png'}),b=Buffer.from(r.data,'base64');fs.writeFileSync(path.join(dir,file),b);const a={file:caseName+'/'+file,label,sha256:hash(b),checkedSHA:head,sourceSHA256};report.artifacts.push(a);persist();};
   await register();const useMuseum=caseName!=='without-museum';item.fixture=await ev('window.__cold011.'+(useMuseum?'setupMuseum010':'setupStreet009')+'(('+seedApprovedBritishLegacy007.toString()+'))');check(caseName+': pinned ordinary paid fixture',item.fixture.difficulty===1&&!item.fixture.developer.sandbox&&!item.fixture.developer.god&&item.fixture.paid.every(p=>p.exact&&p.charged>0));
   const functional=q=>q.stats.pop>0&&q.stats.poweredBld>0&&(q.districtCache?.districts||0)>0&&q.street.roots.length===3&&q.street.roots.every(r=>r.operational&&r.employed>0)&&(!useMuseum||(q.museum.roots.length===1&&q.museum.roots[0].operational&&q.museum.roots[0].employed>0&&q.museum.roots[0].activity.leisure>0&&q.museum.roots[0].tourism.currentBase>0&&!!q.museum.roots[0].coverageStamp));
   let ready;for(let n=1;n<=24;n++){ready=await step('fixture-day-'+n);if(n>=9&&functional(ready))break;}check(caseName+': real functioning town before load test',functional(ready),ready);item.before=ready;
   if(caseName==='zero-source'||caseName==='disconnected'){item.negative=await ev('window.__cold011.paidNegative011('+JSON.stringify(caseName)+')');check(caseName+': negative control uses strictly paid ordinary changes',item.negative.targets.length>0&&item.negative.rows.every(p=>p.exact&&p.charged>0));ready=await step('negative-established-day');check(caseName+': physically removed source or complete road network',caseName==='zero-source'?ready.sources.length===0&&ready.storage.length===0:ready.sources.length>0&&ready.roads===0,ready);}
   for(let iteration=1;iteration<=2;iteration++){
    // Save and reload immediately while the paused live state matches. Never
    // replace storage with a previous day's bytes before visibilitychange.
    const saved=await ev("(()=>{GV.setSpeed(0);GV.ai(false);GV.save();return{raw:localStorage.getItem('glimmerville.v1.s3'),snapshot:window.__cold011.coldSnapshot011('save-input')};})()");
    check(caseName+': reload'+iteration+' valid ordinary native save',typeof saved.raw==='string'&&saved.raw.length>1000&&saved.snapshot.slot==='3');
    // Fresh isolated profile only: valid native copies are sentinels proving
    // slots1/2 and backups never change during the measured save/load path.
    if(iteration===1)await ev("(()=>{const raw="+JSON.stringify(saved.raw)+";for(const k of ['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak'])localStorage.setItem(k,raw);})()");
    const sentinels=await ev("Object.fromEntries(['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak'].map(k=>[k,localStorage.getItem(k)]))");
    const row={iteration,inputSHA256:hash(saved.raw),inputBytes:Buffer.byteLength(saved.raw),inputDay:saved.snapshot.stats.day,input:saved.snapshot};item.reloads.push(row);persist();
    await cdp.send('Page.reload',{ignoreCache:true});check(caseName+': reload'+iteration+' actual cold page fully boots',await waitFor(cdp,"!!window.__bootDone453&&!!window.GV&&getComputedStyle(document.getElementById('start')).display!=='none'",180000));
    const rawAfter=await ev("localStorage.getItem('glimmerville.v1.s3')");row.beforeContinueSHA256=hash(rawAfter||'');check(caseName+': reload'+iteration+' exact full native save bytes survive navigation',rawAfter===saved.raw);
    await register();row.immediate=await ev("(()=>{const b=document.getElementById('bContinue');if(!b||getComputedStyle(b).display==='none')throw Error('Native Continue missing');b.click();GV.setSpeed(0);GV.ai(false);return window.__cold011.coldSnapshot011('Continue-immediate');})()");item.snapshots.push(row.immediate);
    check(caseName+': reload'+iteration+' exact root identities,ages,path metadata and day',eq(row.immediate.ids,saved.snapshot.ids)&&eq(row.immediate.paths,saved.snapshot.paths)&&row.immediate.stats.day===saved.snapshot.stats.day&&row.immediate.stats.money===Math.round(saved.snapshot.stats.money));
    for(let frame=1;frame<=2;frame++){const q=await ev('new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__cold011.coldSnapshot011('+JSON.stringify('reload'+iteration+'-RAF'+frame)+'))))');item.snapshots.push(q);check(caseName+': reload'+iteration+' RAF'+frame+' paused without advancing day',q.stats.day===row.inputDay);row['frame'+frame]=q;}
    row.firstDay=await step('reload'+iteration+'-first-ordinary-day');
    if(caseName==='zero-source'||caseName==='disconnected'){
     const r=row.firstDay,targets=[...r.street.roots,...r.museum.roots];check(caseName+': reload'+iteration+' cannot invent supplied jobs or museum effects',targets.length===4&&targets.every(q=>!q.operational&&!q.power&&q.positions===0&&q.employed===0&&q.activity.work===0)&&(r.museum.roots[0].tourism.currentBase===0&&!r.museum.roots[0].coverageStamp)&&(caseName==='zero-source'?r.sources.length===0:r.sources.length>0&&r.roads===0),r);row.negativeControlPassed=true;
    }else if(caseName==='escape-disabled'){
     const r=row.firstDay;check(caseName+': reload'+iteration+' explicitly reproduces disabled-fix cold failure',r.escapeDisabled&&r.liveRoads>0&&r.districtCache?.districts===0&&r.stats.poweredBld===0&&!functional(r),r);row.expectedRegressionObserved=true;
    }else{check(caseName+': reload'+iteration+' FIRST ordinary day works without repair',functional(row.firstDay),row.firstDay);row.positivePass=true;}
    const afterSentinels=await ev("Object.fromEntries(['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak'].map(k=>[k,localStorage.getItem(k)]))");check(caseName+': reload'+iteration+' other save slots and backups unchanged',eq(afterSentinels,sentinels));row.otherSlotsUnchanged=true;
    await screenshot('reload'+iteration+'-first-day.png','Actual cold Continue first ordinary day; no repair');persist();
   }
   item.positivePass=item.expected==='unaided cold first-day success'&&item.reloads.every(q=>q.positivePass);item.ok=item.reloads.length===2&&item.reloads.every(q=>q.positivePass||q.negativeControlPassed||q.expectedRegressionObserved);item.finishedAt=new Date().toISOString();
   item.comparison={baseline:BASELINE011,candidate:{checkedSHA:head,sourceSHA256,version,anchor,case:caseName,firstReload:item.reloads[0].firstDay,secondReload:item.reloads[1].firstDay,positivePass:item.positivePass,negativeControl:caseName==='zero-source'||caseName==='disconnected',escapeDisabled:caseName==='escape-disabled'},scope:caseName==='without-museum'?'Same pinned old-fixture before/after comparison':'Candidate scenario extension; historical baseline directly measured the old fixture without the museum.'};fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(item.comparison,null,2));persist();
  }
  report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;check('no native browser exceptions or console errors',cdp.errors.length===0,cdp.errors);return true;
 });report.session={ok:session.ok,fails:session.fails,seconds:session.seconds};check('all selected native cases complete',session.ok&&report.cases.length===CASES.length&&report.cases.every(q=>q.ok),report.session);check('immutable candidate product and baseline stayed unchanged',fs.readFileSync(path.join(ROOT,'index.html')).equals(source));report.ok=true;
 }catch(e){report.error=String(e.stack||e);report.ok=false;process.exitCode=1;}finally{clearTimeout(watchdog);report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify({ok:report.ok,checkedSHA:head,mode:MODE,cases:report.cases.map(q=>({case:q.case,ok:q.ok,positivePass:q.positivePass})),failures:report.failures,error:report.error}));}})();
