#!/usr/bin/env node
'use strict';
// CI-only, read-only public-origin verification. Never serves a local game copy.
// Official origin evidence: successful existing Pages run 37263663016,
// deploy job 111616138339, 2026-10-05T04:29:51.8319067Z:
// "Evaluated environment url: https://lijiabao1998.github.io/GlimmerTown-lab/".
const fs = require('fs'), path = require('path'), os = require('os');
const crypto = require('crypto'), {execFileSync} = require('child_process');
const {isDeepStrictEqual: equal} = require('util');
if (process.env.GITHUB_ACTIONS !== 'true') throw Error('GitHub Actions only; no local game runtime');
const {launchChrome, pageWsUrl, cdpConnect, waitFor, sleep} = require('./harness');
const {aggregate} = require('./streetlife-fingerprint-qa009');
const {seedApprovedBritishLegacy007} = require('./publiclife-legacy-fixture007');
const ROOT = __dirname, OUT = path.join(ROOT, 'museum-evidence/public');
const OFFICIAL = 'https://lijiabao1998.github.io/GlimmerTown-lab/';
const requested = process.env.PUBLIC_SITE_URL || OFFICIAL;
if (requested !== OFFICIAL) throw Error('Only the deployment-proven official URL is allowed');
const expected = process.env.EXPECTED_DEPLOY_SHA || '';
if (!/^[0-9a-f]{40}$/.test(expected)) throw Error('EXPECTED_DEPLOY_SHA must be a full commit SHA');
const head = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: ROOT, encoding: 'utf8'}).trim();
if (head !== expected) throw Error('Checkout is not the exact expected deployment head');
// workflow_run GITHUB_SHA describes the observer workflow, not necessarily the
// deployed commit. Compare HEAD with the upstream run SHA instead.
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
if (process.env.GITHUB_EVENT_NAME === 'workflow_run') {
  const run=event.workflow_run;
  if(run?.name!=='pages'||run.conclusion!=='success'||run.head_branch!=='main'||run.head_sha!==head||
     run.head_repository?.full_name!==process.env.GITHUB_REPOSITORY||!/(?:^|\W)T723(?:$|\W)/.test(run.head_commit?.message||''))
    throw Error('Expected successful same-repository main Pages deployment explicitly labeled T723');
} else if(process.env.GITHUB_EVENT_NAME!=='workflow_dispatch') throw Error('Only release-scoped Pages observer or explicit dispatch is allowed');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const BASE='d9dfe87689fa841edb8775d0f95db77d9f2deb5b';
const APPROVED='d859e7570305fbd8c7b6ae9976c5d3e6d703c81b';
const APPROVED_SOURCE_SHA256='f6d935d79f7766261acfb2f76d12188dd78ab30b53d595bc0191574383b1bb46';
const BASELINE_SHA256='a6419a6ba35a98dd30711ff9c8ebdd0ef467f71a64263968a466b4b36ec83465';
const expectedAdditions=[...[0,1,2,3].map(v=>'bld.277_1_'+v),...['gate','garden','bench'].flatMap(t=>[0,1,2,3].map(v=>'museum010.'+t+'_'+v))].sort();
const gitFile010=(revision,file)=>execFileSync('git',['show',revision+':'+file],{cwd:ROOT,maxBuffer:32*1024*1024});
function verifyRelease010(){
  const approved=gitFile010(APPROVED,'index.html');
  if(sha(approved)!==APPROVED_SOURCE_SHA256)throw Error('Approved R2 product pin changed');
  let normalized=localBytes.toString('utf8');
  for(const[from,to]of [["const GAME_VER='14.27'","const GAME_VER='14.26'"],["const GAME_ANCHOR='T723'","const GAME_ANCHOR='T722'"],['id="startVersion456">v14.27 · T723','id="startVersion456">v14.26 · T722']]){
    if(normalized.split(from).length!==2)throw Error('Release label missing or repeated: '+from);
    normalized=normalized.replace(from,to);
  }
  if(sha(normalized)!==APPROVED_SOURCE_SHA256||!Buffer.from(normalized).equals(approved))throw Error('Release HTML differs beyond the three approved labels');
  // These sources furnish fixture functions only, not the game being tested.
  // The browser always executes the downloaded official-origin product.
  for(const file of ['streetlife-integration-qa009.js','publiclife-legacy-fixture007.js','harness.js','streetlife-fingerprint-qa009.js']){
    if(!fs.readFileSync(path.join(ROOT,file)).equals(gitFile010(APPROVED,file)))throw Error('Pinned public observer dependency changed: '+file);
  }
  // The runner may update its release metadata; the exact fixture bodies used
  // in the public browser remain the approved R2 source bytes without edits.
  const currentMuseum=fs.readFileSync(path.join(ROOT,'museum-integration-qa010.js'),'utf8');
  const approvedMuseum=gitFile010(APPROVED,'museum-integration-qa010.js').toString('utf8');
  for(const [start,end]of [['function setupMuseum010(','function assets010('],['function nativeScene010(','function nativeLight010(']]){
    if(fixtureRange010(currentMuseum,start,end)!==fixtureRange010(approvedMuseum,start,end))
      throw Error('Approved museum fixture body changed: '+start);
  }
  return{release:true,htmlExact:true,version:'14.27',anchor:'T723',approvedSHA:APPROVED,approvedSourceSHA256:APPROVED_SOURCE_SHA256,sourceSHA256,baselineSHA:BASE};
}
function verifyPublicFingerprint010(fp,blocks){
  const raw=gitFile010(BASE,'fp.json');if(sha(raw)!==BASELINE_SHA256)throw Error('Complete T722 baseline pin changed');
  const base=JSON.parse(raw),old=base.subs,projected={};
  if(base.version!=='14.26'||base.anchor!=='T722'||Object.keys(old).length!==2879||base.stats.families!==156||base.stats.leaves!==2879||base.blocks.count!==1728)throw Error('Complete T722 inventory missing');
  if(!fp?.ok||!fp.subs||Array.isArray(fp.subs)||typeof fp.subs!=='object')throw Error('Complete live native fingerprint required');
  const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();
  if(!equal(added,expectedAdditions)||Object.keys(fp.subs).length!==2895)throw Error('Exactly sixteen approved museum additions required');
  for(const[key,value]of Object.entries(fp.subs))if(Object.hasOwn(old,key)){if(!equal(value,old[key]))throw Error('Prior complete leaf changed: '+key);projected[key]=value;}
  if(!equal(projected,old))throw Error('Prior native leaf missing');
  for(const key of expectedAdditions){const q=fp.subs[key];if(!q||!equal(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string')throw Error('Incomplete museum leaf: '+key);}
  const before=aggregate(projected),full=aggregate(fp.subs);
  if(!equal(before.families,base.families)||!equal(before.stats,base.stats))throw Error('Historical full-record aggregation mismatch');
  if(!equal(full.families,fp.families)||!equal(full.stats,fp.stats)||full.stats.families!==157||full.stats.leaves!==2895)throw Error('Live native aggregation/count mismatch');
  if(!blocks?.ok||!equal({fam:blocks.fam,count:blocks.count},base.blocks))throw Error('Historical 1728 block fingerprints changed');
  for(const prefix of['bld.277_1_','museum010.gate_','museum010.garden_','museum010.bench_'])if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Four geometric views required: '+prefix);
  const tracked=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'))),promoted={...base,generatedAt:tracked.generatedAt,version:'14.27',anchor:'T723',subs:fp.subs,families:fp.families,stats:fp.stats};
  if(!Number.isFinite(Date.parse(tracked.generatedAt))||!equal(tracked,promoted))throw Error('T723 promotion differs from exact live 2879+16 records and preserved baseline fields');
  return{ok:true,phase:'release',version:'14.27',anchor:'T723',baselineSHA:BASE,baselineSHA256:BASELINE_SHA256,promotedNativeRecordsExact:true,oldCompleteRecordsExact:true,oldLeaves:2879,newLeaves:16,leaves:2895,oldFamilies:156,currentFamilies:157,oldBlocks:1728,blocksExact:true,added};
}
function fixtureRange010(s,a,b){const start=s.indexOf(a),end=s.indexOf(b,start);if(start<0||end<=start)throw Error('Missing pinned fixture range '+a);return s.slice(start,end);}
function fixture010(){
  const street=fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8');
  const museum=fs.readFileSync(path.join(ROOT,'museum-integration-qa010.js'),'utf8');
  return fixtureRange010(street,'function setupStreet009(','function snapshot009(')+'\n'+
    fixtureRange010(museum,'function setupMuseum010(','function assets010(')+'\n'+
    fixtureRange010(museum,'function nativeScene010(','function nativeLight010(');
}
function rootIdentity010(r){return r?JSON.stringify({root:r.root,k:r.k,id:r.id,v:r.v,age:r.age,sz:r.sz,refCells:r.refCells}):null;}
async function screenshot010(file,meta){
  const shot=await cdp.send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
  if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid native screenshot');
  fs.writeFileSync(path.join(OUT,file),bytes);report.artifacts.push({file,bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:sha(bytes),checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,...meta});save();
}
async function captureMuseum010(night,file,kind){
  const scene=await cdp.evalJs('window.__museumPublic010.nativeScene010(0,'+night+',[60,42],1.8)');
  await screenshot010(file,{kind,night,day:scene.day,roots:scene.roots,geometry:scene.geometry});
}
const localBytes = fs.readFileSync(path.join(ROOT, 'index.html'));
const sourceSHA256 = sha(localBytes);
fs.mkdirSync(OUT, {recursive: true});
const report = {
  checkedSHA: head, expectedDeploySHA: expected, observerWorkflowSHA: process.env.GITHUB_SHA,
  run: process.env.GITHUB_RUN_ID, upstreamPagesRun: event.workflow_run?.id || null,
  officialURL: OFFICIAL, sourceSHA256, startedAt: new Date().toISOString(),
  checks: [], failures: [], artifacts: [], documents: [], publicFetches: [], networkFailures: [],
  knownPWA404: [], warnings: [], limits: [
    'CI-only public-origin browser verification; no local game runtime was used.',
    'Uses a new disposable Chrome profile and native slot 3; no existing user profile or save is opened.',
    'Remote traffic is read-only. Only this disposable browser game memory and localStorage change.',
    'Known missing manifest.json, icon.svg and sw.js PWA resources are disclosed separately from game errors.',
    'The pinned retained-town fixture seeds old building ages, initial treasury and rank only. The new museum, paths, homes and utilities are actually bought; power, water, staffing, tourism and museum age are not assigned.',
    'This publication observer does not replace the full approved camera, weather, counterfactual and regression CI suite.'
  ]
};
const save = () => fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(report, null, 2));
function check(name, ok, detail) {
  report.checks.push({name, ok: !!ok, detail});
  if (!ok) report.failures.push(name);
  save();
  if (!ok) throw Error(name);
  console.log('PASS ' + name);
}
const isPWA = url => {
  try { return ['manifest.json', 'icon.svg', 'sw.js'].some(p => new URL(url).href === new URL(p, OFFICIAL).href); }
  catch { return false; }
};
async function publicFetch(label) {
  const url = new URL(OFFICIAL);
  url.searchParams.set('publicqa010', head);
  url.searchParams.set('check', label);
  const response = await fetch(url, {
    method: 'GET', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(60000),
    headers: {'Cache-Control': 'no-cache', Accept: 'text/html'}
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  const row = {label, url: response.url, status: response.status, bytes: bytes.length,
    sha256: sha(bytes), contentType: response.headers.get('content-type'),
    etag: response.headers.get('etag'), at: new Date().toISOString()};
  report.publicFetches.push(row);
  check(label + ': public HTML is the exact deployed checkout bytes', response.status === 200 &&
    /text\/html/i.test(row.contentType || '') && row.sha256 === sourceSHA256 && bytes.equals(localBytes), row);
}
let chrome, cdp, profile;
const documentResponses = [], finished = new Set();
function onEvent(message, errors, benign) {
  const p = message.params || {};
  if (message.method === 'Network.requestWillBeSent') {
    if (!['GET', 'HEAD'].includes(p.request?.method)) errors.push('Unexpected non-read-only request: ' + p.request?.method + ' ' + p.request?.url);
  } else if (message.method === 'Network.responseReceived') {
    const r = p.response;
    if (p.type === 'Document') documentResponses.push({requestId: p.requestId, ...r});
    if (r.status >= 400) {
      const row = {url: r.url, status: r.status, type: p.type};
      if (r.status === 404 && isPWA(r.url)) report.knownPWA404.push(row);
      else { report.networkFailures.push(row); errors.push('HTTP ' + r.status + ': ' + r.url); }
    }
  } else if (message.method === 'Network.loadingFinished') finished.add(p.requestId);
  else if (message.method === 'Network.loadingFailed') {
    report.networkFailures.push({requestId: p.requestId, error: p.errorText, type: p.type});
    errors.push('Network loading failed: ' + p.errorText);
  } else if (message.method === 'Runtime.exceptionThrown') {
    const d = p.exceptionDetails || {};
    errors.push('Uncaught exception: ' + (d.exception?.description || d.text || 'unknown'));
  } else if (message.method === 'Runtime.consoleAPICalled') {
    const text = (p.args || []).map(a => a.value ?? a.description ?? '').join(' ');
    if (p.type === 'error') errors.push('console.error: ' + text);
    else if (p.type === 'warning') report.warnings.push(text);
  } else if (message.method === 'Log.entryAdded' && p.entry?.level === 'error') {
    const e = p.entry;
    if ((isPWA(e.url) && (/404|not found/i.test(e.text) || report.knownPWA404.some(r=>r.url===e.url))) ||
        /bad HTTP response code \(404\).*fetching the script/i.test(e.text)) {
      benign.push({url: e.url || null, text: e.text});
    } else errors.push('Browser log: ' + e.text + ' @ ' + (e.url || ''));
  }
}
async function menuReady() {
  return waitFor(cdp, `!!window.__bootDone453 && !!window.GV &&
    getComputedStyle(document.getElementById('start')).display !== 'none'`, 180000);
}
async function documentProof(label, afterIndex) {
  const row = documentResponses.slice(afterIndex).at(-1);
  if (!row) throw Error('No actual public document response: ' + label);
  const until = Date.now() + 30000;
  while (!finished.has(row.requestId) && Date.now() < until) await sleep(100);
  if (!finished.has(row.requestId)) throw Error('Public HTML response did not finish');
  const body = await cdp.send('Network.getResponseBody', {requestId: row.requestId});
  const bytes = Buffer.from(body.body, body.base64Encoded ? 'base64' : 'utf8');
  const location = await cdp.evalJs('({href:location.href,origin:location.origin,pathname:location.pathname})');
  const u = new URL(row.url), official = new URL(OFFICIAL);
  const proof = {label, url: row.url, status: row.status, sha256: sha(bytes), bytes: bytes.length,
    mimeType: row.mimeType, fromServiceWorker: !!row.fromServiceWorker, fromDiskCache: !!row.fromDiskCache,
    location, protocol: row.protocol, securityState: row.securityState};
  report.documents.push(proof);
  check(label + ': Chrome truly navigated the exact official public HTML', row.status === 200 &&
    u.origin === official.origin && u.pathname === official.pathname &&
    location.origin === official.origin && location.pathname === official.pathname &&
    !row.fromServiceWorker && proof.sha256 === sourceSHA256 && bytes.equals(localBytes), proof);
}
async function cleanup() {
  // harness exports no cleanup function: own only this newly created profile.
  try { cdp?.close(); } catch {}
  try { chrome?.kill(); } catch {}
  if (chrome && chrome.exitCode === null) await Promise.race([
    new Promise(resolve => chrome.once('exit', resolve)), sleep(2000)
  ]);
  if (chrome && chrome.exitCode === null) { try { chrome.kill('SIGKILL'); } catch {} }
  if (profile) fs.rmSync(profile, {recursive: true, force: true, maxRetries: 3, retryDelay: 500});
}
(async () => {
  const watchdog = setTimeout(() => {
    report.error = 'Public verification exceeded 15-minute bounded runtime'; save();
    cleanup().finally(() => process.exit(124));
  }, 15 * 60000);
  watchdog.unref();
  try {
    const release = verifyRelease010();
    check('authorized T723/v14.27 release retains the exact approved R2 product except three labels', release.release && release.htmlExact, release);
    await publicFetch('before-browser');
    profile = fs.mkdtempSync(path.join(os.tmpdir(), 'museum-public010-'));
    const port = 9300 + process.pid % 500;
    chrome = launchChrome(port, profile);
    cdp = await cdpConnect(await pageWsUrl(port, chrome), onEvent);
    for (const method of ['Runtime.enable', 'Log.enable', 'Page.enable']) await cdp.send(method);
    // The single HTML document is about 10 MB. Retain its actual decoded bytes
    // for CDP hashing instead of relying on the default per-resource buffer.
    await cdp.send('Network.enable', {maxTotalBufferSize:64*1024*1024,maxResourceBufferSize:32*1024*1024});
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1080,deviceScaleFactor:1,mobile:false});
    await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
    await cdp.send('Network.setBypassServiceWorker', {bypass: true});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `
      if (location.origin === 'https://lijiabao1998.github.io' && location.pathname === '/GlimmerTown-lab/') {
        localStorage.setItem('glimmerville.v1.slot', '3');
        localStorage.setItem('glimmerville.v1.q', '2');
      }`});
    const target = new URL(OFFICIAL); target.searchParams.set('publicqa010', head);
    const navigation = await cdp.send('Page.navigate', {url: target.href});
    check('public navigation accepted without TLS bypass', !navigation.errorText, navigation);
    check('public main menu booted', await menuReady());
    await documentProof('initial-navigation', 0);
    const boot = await cdp.evalJs(`({ready:!!window.__bootDone453, version:GV.ver(),
      label:document.getElementById('startVersion456')?.textContent.trim(),
      slot:localStorage.getItem('glimmerville.v1.slot'), batches:window.__t574,
      otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})`);
    check('live version, anchor, native boot and isolated slot 3', boot.ready && boot.version === '14.27' &&
      boot.label === 'v14.27 · T723' && boot.slot === '3' && boot.batches &&
      Array.isArray(boot.batches.err) && boot.batches.err.length === 0 && boot.otherSaves.length === 0, boot);
    await screenshot010('public-menu.png', {kind:'actual official-origin native release menu'});
    const started = await cdp.evalJs(`(() => {
      const fresh=[...document.querySelectorAll('#start button')].find(b=>/開拓新城市/.test(b.textContent));
      if(!fresh)return false; fresh.click();
      const standard=document.querySelector('#diffSeg456 [data-v456="1"]');
      const map=document.querySelector('#mapGrid456 [data-map456="72"]');
      const create=document.getElementById('bStartNew456');
      if(!standard||!map||!create)return false; standard.click();map.click();create.click();
      GV.setSpeed(0);GV.ai(false);return true;
    })()`);
    check('native menu creates a normal 72x72 city', started && await waitFor(cdp,
      `!!window.__bootDone453 && (window.__t519Roof|0)>0 && !!GV.tile(0,0) && GV.diff()===1 &&
       getComputedStyle(document.getElementById('start')).display==='none'`, 180000));
    await sleep(3000);
    const api = await cdp.evalJs(`({specs:GV.museumSpecs010(),selftest:GV.museumSelftest010(),
      functions:['save','load','step','fp536','blockFp536','museumSpecs010','museumAt010','museumEvidence010',
        'museumSelftest010','stationDistrictAt008'].map(k=>({key:k,type:typeof GV[k]}))})`);
    check('live k277 museum and all three native paid path tools exist', api.selftest.ok &&
      equal(api.specs.buildings.map(q=>[q.k,q.id,q.sz]), [[277,'regionalNaturalHistory010',4]]) &&
      equal(api.specs.paths.map(q=>q.id).sort(), ['museumBench010','museumGarden010','museumGate010']) &&
      api.functions.every(q=>q.type==='function'), api);
    const fp = await cdp.evalJs('GV.fp536()');
    const blocks = await cdp.evalJs('GV.blockFp536()');
    const proof = verifyPublicFingerprint010(fp, blocks);
    check('all 2895 live native leaves and 157 families equal T723 promotion, all 2879 old records and 1728 blocks stay exact',
      proof.ok && proof.promotedNativeRecordsExact, proof);
    const fpBytes = Buffer.from(JSON.stringify({checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,version:'14.27',anchor:'T723',fp,blocks,proof},null,2));
    fs.writeFileSync(path.join(OUT, 'fingerprint-native.json'), fpBytes);
    report.fingerprint = {file:'fingerprint-native.json',sha256:sha(fpBytes),base:BASE,...proof};
    await cdp.evalJs('window.__museumPublic010=(()=>{'+fixture010()+';return{setupMuseum010,snapshot010,step010,nativeScene010};})()');
    const fixture = await cdp.evalJs('window.__museumPublic010.setupMuseum010(('+seedApprovedBritishLegacy007.toString()+'))');
    report.fixture = fixture;
    check('public-origin disposable fixture actually pays for a new age-zero museum and all three paths',
      fixture.difficulty===1 && !fixture.developer.sandbox && !fixture.developer.god &&
      fixture.paid.every(q=>q.exact&&q.charged>0) && fixture.initial.roots.length===1 &&
      fixture.initial.roots[0].k===277 && fixture.initial.roots[0].age===0 && fixture.paths.length===3, fixture);
    await captureMuseum010(false, 'public-museum-construction.png', 'actual paid age-zero construction');
    report.ordinaryDays=[];
    for(let n=1;n<=9;n++) report.ordinaryDays.push(await cdp.evalJs('window.__museumPublic010.step010(1)'));
    check('nine actual ordinary days retain zero effects for days one to eight and complete at age nine',
      report.ordinaryDays.length===9 && report.ordinaryDays.every((q,n)=>q.day===fixture.placementDay+n+1) &&
      report.ordinaryDays.slice(0,8).every(q=>q.roots.length===1&&q.roots.every(r=>r.age<9&&!r.built&&!r.operational&&r.positions===0&&r.employed===0&&r.tourism.currentBase===0&&r.activity.leisure===0&&!r.coverageStamp)) &&
      report.ordinaryDays[8].roots[0].age===9, report.ordinaryDays);
    let operational=report.ordinaryDays.at(-1);
    for(let n=9;n<24&&!operational.roots.every(r=>r.operational&&r.employed>0&&r.tourism.currentBase>0);n++) {
      operational=await cdp.evalJs('window.__museumPublic010.step010(1)');
      report.ordinaryDays.push(operational);
    }
    report.operational=operational;
    const r=operational.roots[0];
    check('real public gameplay supplies road, allocated power, delivered water and native public employees',
      operational.roots.length===1&&r.k===277&&r.built&&r.operational&&r.powerState===1&&
      r.powerAllocation?.root===r.root&&r.waterState.code>=2&&r.waterDelivered>0&&r.road.length>0&&
      r.positions>0&&r.positions<=24&&r.employed>0&&r.employed<=r.positions+.005&&r.staff?.k===277&&
      r.activity.publicJobs>0&&r.activity.enterpriseJobs===0&&r.activity.education===0&&r.activity.leisure>0&&
      !!r.coverageStamp&&r.tourism.currentBase>0&&r.tourism.currentBase<=30, operational);
    check('one staff-scaled native museum tourism contribution and one completed upkeep',
      Math.abs(r.tourism.currentBase-30*r.capacityFactor)<1e-8&&r.upkeep===14&&
      Math.abs(operational.tourism.base-r.tourism.currentBase)<1e-8&&
      Math.abs(operational.tourism.weighted-operational.tourism.base*operational.tourism.season*operational.tourism.green)<1e-8&&
      operational.tourism.total===operational.tourists, {root:r,ledger:operational.tourism});
    check('old museums, retained British town and three independent walking themes survive live integration',
      operational.oldMuseums.length===2&&operational.oldMuseums.every(q=>q.bld?.k===q.k&&q.bld.sz===2)&&
      operational.retained.length===47&&operational.retained.every(q=>q.bld?.k===q.k)&&
      operational.paths.length===3&&operational.paths.every(q=>q.am502===1&&q.baseWalkCost===.72)&&
      equal(operational.paths.map(q=>q.theme).sort(),['bench','garden','gate']), operational);
    await captureMuseum010(false, 'public-museum-day.png', 'actual completed paid museum at official public origin');
    await captureMuseum010(true, 'public-museum-night.png', 'actual physical supplied museum night emission at official origin');
    const saved = await cdp.evalJs(`(() => {
      GV.setSpeed(0);GV.ai(false);const before=GV.stats(),developer=GV.dev516B();
      GV.step(1);GV.setSpeed(0);const after=GV.stats();GV.save();
      const raw=localStorage.getItem('glimmerville.v1.s3');
      return {before,after,developer,difficulty:GV.diff(),raw,museum:GV.museumAt010(58,40),paths:[[60,46],[59,45],[61,45]].map(p=>GV.museumAt010(...p)),
        otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))};
    })()`);
    const stored = JSON.parse(saved.raw || 'null');
    check('ordinary native day and native slot-3 storage work', saved.difficulty === 1 &&
      !saved.developer.sandbox && !saved.developer.god && saved.after.day === saved.before.day + 1 &&
      Number.isFinite(saved.after.money) && stored?.v === 1 && stored.n === 72 && stored.df === 1 &&
      stored.day === saved.after.day && stored.money === Math.round(saved.after.money) && stored.gameVer === '14.27' &&
      saved.otherSaves.length === 0, {before:saved.before,after:saved.after,saveBytes:Buffer.byteLength(saved.raw),saveSHA256:sha(saved.raw)});
    const previousDocumentCount = documentResponses.length;
    await cdp.send('Page.reload', {ignoreCache:true});
    check('actual public page reload returned to the native menu', await menuReady());
    await documentProof('page-reload', previousDocumentCount);
    check('native slot-3 bytes survive actual public page reload',
      await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')") === saved.raw);
    const loaded = await cdp.evalJs(`(() => {
      const b=document.getElementById('bContinue');
      if(!b||getComputedStyle(b).display==='none')return {continued:false};
      b.click();GV.setSpeed(0);GV.ai(false);
      const after=GV.stats(),developer=GV.dev516B();
      return {continued:getComputedStyle(document.getElementById('start')).display==='none',after,museum:GV.museumAt010(58,40),paths:[[60,46],[59,45],[61,45]].map(p=>GV.museumAt010(...p)),
        difficulty:GV.diff(),developer,slot:localStorage.getItem('glimmerville.v1.slot')};
    })()`);
    check('native Continue loads saved ordinary city after page reload', loaded.continued &&
      loaded.slot === '3' && loaded.difficulty === 1 && !loaded.developer.sandbox && !loaded.developer.god &&
      loaded.after.day === stored.day && loaded.after.money === stored.money &&
      loaded.after.buildings === saved.after.buildings && loaded.after.roads === saved.after.roads &&
      rootIdentity010(loaded.museum)===rootIdentity010(saved.museum)&&
      equal(loaded.paths.map(p=>p?.amx502),saved.paths.map(p=>p?.amx502)), loaded);
    const following = await cdp.evalJs(`(() => {
      const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.forceDraw();
      return {before,after:GV.stats(),selftest:GV.museumSelftest010(),museum:GV.museumAt010(58,40),
        otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))};
    })()`);
    check('loaded city runs a following ordinary day with intact new tools and untouched other slots',
      following.after.day === following.before + 1 && Number.isFinite(following.after.money) &&
      following.selftest.ok && following.otherSaves.length === 0&&following.museum.operational&&
      following.museum.employed>0&&following.museum.tourism.currentBase>0&&!!following.museum.coverageStamp, following);
    await screenshot010('public-slot3-reloaded.png', {kind:'actual official-origin native reload and following ordinary day'});
    await publicFetch('after-browser');
    await sleep(1000);
    report.consoleErrors = cdp.errors;
    report.knownPWALogs = cdp.benign;
    check('zero game console errors and uncaught exceptions; known PWA 404s disclosed',
      cdp.errors.length === 0 && report.networkFailures.length === 0,
      {errors:cdp.errors,knownPWA404:report.knownPWA404,knownPWALogs:cdp.benign,warnings:report.warnings});
    report.ok = true;
  } catch (error) {
    report.ok = false; report.error = String(error.stack || error);
    if (cdp) {report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;}
    console.error(report.error); process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    try { await cleanup(); } catch (error) {report.cleanupError=String(error);report.ok=false;process.exitCode=1;}
    report.finishedAt = new Date().toISOString(); save();
    console.log(JSON.stringify({ok:report.ok,checkedSHA:head,officialURL:OFFICIAL,checks:report.checks.length,
      failures:report.failures,knownPWA404:report.knownPWA404}));
  }
})();
