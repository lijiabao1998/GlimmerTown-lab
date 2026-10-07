#!/usr/bin/env node
'use strict';
// CI-only, read-only public-origin verification. Never serves a local game copy.
// Official origin evidence: successful existing Pages run 37263663016,
// deploy job 111616138339, 2026-10-05T04:29:51.8319067Z:
// "Evaluated environment url: https://lijiabao1998.github.io/GlimmerTown-lab/".
const fs = require('fs'), path = require('path'), os = require('os');
const {execFileSync} = require('child_process');
const {isDeepStrictEqual: equal} = require('util');
if (process.env.GITHUB_ACTIONS !== 'true') throw Error('GitHub Actions only; no local game runtime');
const {OFFICIAL,BASE,hash:sha,verifyRelease013,fixtureSource013,verifyPublicFingerprint013,verifyCatalog013} = require('./gardenlife-public-contract016');
const ROOT=path.resolve(process.env.EXPECTED_RELEASE_ROOT||path.join(__dirname,'../deployed'));
const release=verifyRelease013(ROOT,process.env.EXPECTED_DEPLOY_SHA,process.env.EXPECTED_RELEASE_HTML_SHA256);
const {launchChrome, pageWsUrl, cdpConnect, waitFor, sleep} = require(path.join(ROOT,'harness.js'));
const {passivePublicState013,functionalPublicState013,theatreAccounting013,ownedIdentity013,summarizePublicResult013} = require('./gardenlife-public-state016');
const {complexFixtureSource014,verifyComplexCatalog014,sourcePins}=require('./gardenlife-public-contract016');
const {passiveComplexState014,complexAccounting014,functionalComplexState014,ownedComplexIdentity014,summarizeComplexResult014}=require('./gardenlife-public-extra016');
const {observeStreetscape015}=require('./gardenlife-public-prior-gameplay016');
const {summarizeStreetscapeResult015}=require('./gardenlife-public-streetscape016');
const {createConsoleSourceObserver015,enableConsoleSourceDomains015}=require('./console-source-observer015');
const sourceObserver=createConsoleSourceObserver015();
const {observeGarden016}=require('./gardenlife-public-gameplay016');
const {summarizeGarden016}=require('./gardenlife-public-new016');
const {reconcilePublicLogs013} = require('./retained015/retained014/complexes-public-log014');
const {seedApprovedBritishLegacy007} = require(path.join(ROOT,'publiclife-legacy-fixture007.js'));
const OUT=path.join(__dirname,'gardenlife-evidence/public');
const requested = process.env.PUBLIC_SITE_URL || OFFICIAL;
if (requested !== OFFICIAL) throw Error('Only the deployment-proven official URL is allowed');
const expected = process.env.EXPECTED_DEPLOY_SHA || '';
if (!/^[0-9a-f]{40}$/.test(expected)) throw Error('EXPECTED_DEPLOY_SHA must be a full commit SHA');
const head = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: ROOT, encoding: 'utf8'}).trim();
if (head !== expected) throw Error('Checkout is not the exact expected deployment head');
// Observer and deployment are separate exact checkouts. The observer cannot
// redefine the product: release pins and the actual HTTPS bytes both must agree.
const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
const observerHead=execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim();
if(observerHead!==process.env.GITHUB_SHA)throw Error('Exact observer workflow checkout required');
if(process.env.GITHUB_REPOSITORY!=='lijiabao1998/GlimmerTown-lab'||
 process.env.GITHUB_REF!=='refs/heads/gpt/gardenlife-public016'||
 !['push','workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME))throw Error('Dedicated same-repository observer branch only');
const pages=JSON.parse(fs.readFileSync(path.join(OUT,'pages-proof.json'),'utf8'));
if(pages.repository!==process.env.GITHUB_REPOSITORY||pages.head_sha!==head||pages.head_branch!=='main'||
 pages.name!=='pages'||pages.conclusion!=='success'||pages.title!==sourcePins.expectedReleaseSubject)throw Error('Successful exact T729 main Pages proof required');
async function screenshot013(file,meta){
  const shot=await cdp.send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
  if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid native screenshot');
  fs.writeFileSync(path.join(OUT,file),bytes);report.artifacts.push({file,bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:sha(bytes),checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,...meta});save();
}
async function captureTheatre013(night,file,kind){
 const scene=await cdp.evalJs('window.__theatrePublic013.nativeScene013(0,'+night+',[60,66],1.5)');
 await screenshot013(file,{kind,night,day:scene.day,roots:scene.roots,geometry:scene.geometry});
 return scene;
}
const localBytes = fs.readFileSync(path.join(ROOT, 'index.html'));
const sourceSHA256 = sha(localBytes);
fs.mkdirSync(OUT, {recursive: true});
const report = {
  checkedSHA: head, expectedDeploySHA: expected, observerWorkflowSHA: process.env.GITHUB_SHA,
  run: process.env.GITHUB_RUN_ID, observerRunURL:'https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/'+process.env.GITHUB_RUN_ID, upstreamPagesRun:pages.id, upstreamPagesURL:pages.html_url, observerSHA:observerHead,
  officialURL: OFFICIAL, sourceSHA256, releaseProof:release, fixtureSHA256:release.fixtureSHA256, startedAt: new Date().toISOString(),
  checks: [], failures: [], artifacts: [], documents: [], publicFetches: [], networkFailures: [], functionalChecksPassed:false,
  knownPWA404: [], rawBrowserErrors: [], rawRuntimeErrors: [], warnings: [], limits: [
    'CI-only public-origin browser verification; no local game runtime was used.',
    'Uses a new disposable Chrome profile and native slot 3; no existing user profile or save is opened.',
    'Remote traffic is read-only. Only this disposable browser game memory and localStorage change.',
    'Known missing manifest.json, icon.svg and sw.js PWA resources are disclosed separately from game errors.',
    'The pinned retained-town fixture seeds old building ages, initial treasury and rank only. The new theatre, six amenities and utilities are actually bought; no new age, power, water, staffing, leisure or fiscal fields are assigned.',
    'Two real Page.reload / native Continue cycles each use the exact current native save and pass three unaided ordinary days with road, power, water, actual public staff, cultural leisure and all six native themes; no fixture, repair, render, recompute or topology/dispatch helper is called in the measured cold phase.',
    'The T729 promoted baseline must match all 3115 complete live records, including 3091 unchanged old leaves and all 1728 old block records.',
    'The inherited T727 functional predicates change only their exact release version through a source-verified reversible adapter. Raw observed state stays v14.33.',
    'Two additional real reload/Continue cycles exercise all eight new paid streetscape themes together with the complete old city. Every first ordinary day must restore actual native services. Paused Continue is not claimed instantly supplied.',
    'The additive raw-console observer retains source events without suppressing anything. URL-less script404 errors remain unclassified unless exact same-session request evidence establishes their URL.',
    'This publication observer does not replace the full approved camera, weather, counterfactual and regression CI suite.'
  ]
};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,(key,value)=>key==='otherSlots'&&value?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,{bytes:Buffer.byteLength(v||''),sha256:sha(v||'')}])):value,2));
let checkScope='provenance';
function check(name, ok, detail, scope=checkScope) {
  report.checks.push({name, ok: !!ok, detail, scope});
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
  url.searchParams.set('theatreqa013', head);
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
    /text\/html/i.test(row.contentType || '') && row.sha256 === sourceSHA256 && bytes.equals(localBytes), row, 'provenance');
}
let chrome, cdp, profile;
const documentResponses = [], finished = new Set();
let reconciledBrowserErrorCount = 0;
function reconcileBrowserErrors013() {
  const pending = report.rawBrowserErrors.slice(reconciledBrowserErrorCount);
  const result = reconcilePublicLogs013(pending, report.knownPWA404);
  cdp.errors.push(...result.errors); cdp.benign.push(...result.known);
  reconciledBrowserErrorCount = report.rawBrowserErrors.length;
}
function onEvent(message, errors, benign) {
  sourceObserver.observe(message);
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
    report.rawRuntimeErrors.push({event:message.method,...p}); errors.push('Uncaught exception: ' + (d.exception?.description || d.text || 'unknown'));
  } else if (message.method === 'Runtime.consoleAPICalled') {
    const text = (p.args || []).map(a => a.value ?? a.description ?? '').join(' ');
    if (p.type === 'error') {report.rawRuntimeErrors.push({event:message.method,...p});errors.push('console.error: ' + text);}
    else if (p.type === 'warning') report.warnings.push({event:message.method,...p,text});
  } else if (message.method === 'Log.entryAdded' && p.entry?.level === 'error') {
    report.rawBrowserErrors.push({...p.entry});
  } else if(message.method==='Log.entryAdded'&&p.entry?.level==='warning')report.warnings.push({event:message.method,...p.entry});
}
async function menuReady() {
  return waitFor(cdp, `!!window.__bootDone453 && !!window.GV &&
    getComputedStyle(document.getElementById('start')).display !== 'none'`, 180000);
}
async function documentProof(label, afterIndex, scope='provenance') {
  sourceObserver.mark(label);
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
    !row.fromServiceWorker && proof.sha256 === sourceSHA256 && bytes.equals(localBytes), proof, scope);
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
    report.error = 'Public verification exceeded 42-minute bounded runtime'; save();
    cleanup().finally(() => process.exit(124));
  }, 42 * 60000);
  watchdog.unref();
  try {
    check('authorized T729/v14.33 release is exactly the approved streetscape product plus three release labels', release.release&&release.htmlExact&&release.sourceSHA256===sourceSHA256,release);
    await publicFetch('before-browser');
    profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gardenlife-public016-'));
    const port = 9300 + process.pid % 500;
    chrome = launchChrome(port, profile);
    cdp = await cdpConnect(await pageWsUrl(port, chrome), onEvent);
    for (const method of ['Runtime.enable', 'Log.enable', 'Page.enable']) await cdp.send(method);
    await enableConsoleSourceDomains015(cdp,sourceObserver);
    report.browser=await cdp.send('Browser.getVersion');
    if(!/^(?:Headless)?Chrome\//.test(report.browser.product||''))throw Error('Actual native Chrome required');
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
    const target = new URL(OFFICIAL); target.searchParams.set('theatreqa013', head);
    sourceObserver.mark('initial-navigation');
    const navigation = await cdp.send('Page.navigate', {url: target.href});
    check('public navigation accepted without TLS bypass', !navigation.errorText, navigation);
    check('public main menu booted', await menuReady());
    await documentProof('initial-navigation', 0);
    const boot = await cdp.evalJs(`({ready:!!window.__bootDone453, version:GV.ver(),
      label:document.getElementById('startVersion456')?.textContent.trim(),
      slot:localStorage.getItem('glimmerville.v1.slot'), batches:window.__t574,
      otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})`);
    check('live version, anchor, native boot and isolated slot 3', boot.ready && boot.version === '14.33' &&
      boot.label === 'v14.33 · T729' && boot.slot === '3' && boot.batches &&
      Array.isArray(boot.batches.err) && boot.batches.err.length === 0 && boot.otherSaves.length === 0, boot);
    await screenshot013('public-menu.png', {kind:'actual official-origin native release menu'});
    checkScope='functional';
    const started = await cdp.evalJs(`(() => {
      const fresh=document.getElementById('bNewGame');
      if(!fresh||getComputedStyle(fresh).display==='none'||fresh.textContent.trim()!=='🌱 開拓新城市')return false; fresh.click();
      const standard=document.querySelector('#diffSeg456 [data-v456="1"]');
      const map=document.querySelector('#mapGrid456 [data-map456="72"]');
      const create=document.getElementById('bStartNew456');
      if(!standard||!map||!create)return false; standard.click();map.click();create.click();
      GV.setSpeed(0);GV.ai(false);return true;
    })()`);
    check('native public menu creates a normal 72x72 city', started && await waitFor(cdp,
      `!!window.__bootDone453 && (window.__t519Roof|0)>0 && !!GV.tile(0,0) && GV.diff()===1 &&
       getComputedStyle(document.getElementById('start')).display==='none'`, 180000));
    await sleep(3000);
    const api=await cdp.evalJs(`({specs:GV.theatreSpecs013(),selftest:GV.theatreSelftest013(),
      functions:['save','step','fp536','blockFp536','theatreSpecs013','theatreAt013','theatreEvidence013',
        'theatreSelftest013','stationDistrictAt008','museumEvidence010','riversideEvidence012'].map(k=>({key:k,type:typeof GV[k]}))})`);
    check('one exact native theatre catalog and six distinct paid native walking themes exist',api.selftest.ok&&
      verifyCatalog013(api.specs)&&api.functions.every(q=>q.type==='function'),api);
    const fp=await cdp.evalJs('GV.fp536()'),blocks=await cdp.evalJs('GV.blockFp536()');
    const proof=verifyPublicFingerprint013(ROOT,fp,blocks);
    check('live 3115 native leaves exactly match promoted T729, preserving 3091 old records and 1728 blocks',
      proof.ok&&proof.promotedNativeRecordsExact&&proof.oldCompleteRecordsExact&&proof.blocksExact,proof,'provenance');
    const fpBytes=Buffer.from(JSON.stringify({checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,version:'14.33',anchor:'T729',fp,blocks,proof},null,2));
    fs.writeFileSync(path.join(OUT,'fingerprint-native.json'),fpBytes);
    report.fingerprint={file:'fingerprint-native.json',sha256:sha(fpBytes),base:BASE,...proof};
    await cdp.evalJs('window.__theatrePublic013=(()=>{'+fixtureSource013(ROOT)+';return{setupTheatre013,snapshot013,step013,nativeScene013,amenityComposition013};})()');
    const fixture=await cdp.evalJs('window.__theatrePublic013.setupTheatre013(('+seedApprovedBritishLegacy007.toString()+'))');
    report.fixture=fixture;
    check('public-origin normal city actually buys age-zero theatre six native amenities and physical roads power water',
      fixture.difficulty===1&&!fixture.developer.sandbox&&!fixture.developer.god&&fixture.roots.length===1&&
      fixture.initial.roots.length===1&&fixture.initial.roots[0].k===281&&fixture.initial.roots[0].age===0&&!fixture.initial.roots[0].built&&!fixture.initial.roots[0].operational&&
      fixture.paid.every(q=>q.exact&&q.charged>0)&&fixture.paid.filter(q=>q.id==='edwardianTheatre013').length===1&&
      ['road','wpipe','plant','water','theatreTicket013','theatrePlaza013','theatreRail013','theatreBench013','theatrePlanter013','theatreLamp013'].every(id=>fixture.paid.some(q=>q.id===id&&q.charged>0))&&
      fixture.paths.length===6&&new Set(fixture.paths.map(p=>p.theme)).size===6&&fixture.pathPlacements.length===6&&
      fixture.retained.length===47&&fixture.priorRiverside.length===3&&fixture.initial.paths.length===6&&fixture.initial.paths.every(p=>!p.lighting.ready&&p.lighting.service===0&&!p.lighting.source),fixture);
    await captureTheatre013(false,'public-theatre-construction.png','actual paid age-zero theatre at official origin');
    report.ordinaryDays=[];
    for(let n=1;n<=9;n++)report.ordinaryDays.push(await cdp.evalJs('window.__theatrePublic013.step013(1)'));
    check('nine real ordinary construction days gate theatre jobs leisure coverage and upkeep until age nine',
      report.ordinaryDays.length===9&&report.ordinaryDays.every((q,n)=>q.day===fixture.placementDay+n+1&&
        q.roots.length===1&&q.roots[0].k===281&&q.roots[0].age===n+1)&&
      report.ordinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational&&r.positions===0&&
        r.employed===0&&r.activity.work===0&&r.activity.leisure===0&&!r.coverageStamp&&r.upkeep===0))&&
      report.ordinaryDays[8].roots[0].age===9&&report.ordinaryDays[8].roots[0].built,report.ordinaryDays);
    const recipe=fixture.recipe;
    const registerPassive=()=>cdp.evalJs('window.__theatrePublicState013='+passivePublicState013.toString());
    const state=label=>cdp.evalJs('window.__theatrePublicState013('+JSON.stringify(label)+','+JSON.stringify(recipe)+')');
    await registerPassive();
    let operational=await state('day-nine');
    report.operationalDays=[operational];
    for(let n=9;n<28&&!functionalPublicState013(operational);n++){
      await cdp.evalJs('window.__theatrePublic013.step013(1)');
      operational=await state('ordinary-operational-day-'+(n+1));report.operationalDays.push(operational);
    }
    report.operational=operational;report.capacity=theatreAccounting013(operational);
    check('actual public theatre has native road allocated power delivered water public staff cultural leisure and all preserved footprints',
      functionalPublicState013(operational),{operational,capacity:report.capacity});
    check('all six native themed paths retain exact independent metadata and all old real water frontage',
      equal(operational.themes.map(p=>p.at.amx502),fixture.pathPlacements.map(p=>
        fixture.initial.identity.paths.find(q=>q.i===p.y*72+p.x)?.amx502)),operational.themes);
    const dayScene=await captureTheatre013(false,'public-theatre-day.png','actual supplied completed theatre at official origin');
    const dayAmenities=await cdp.evalJs('window.__theatrePublic013.amenityComposition013()');
    const nightScene=await captureTheatre013(true,'public-theatre-night.png','actual supplied completed theatre night at official origin');
    const nightAmenities=await cdp.evalJs('window.__theatrePublic013.amenityComposition013()');
    check('native official day and night views show complete canonical theatre and six independently owned amenities',
      [dayScene,nightScene].every(s=>s.geometry.length===1&&s.geometry[0].k===281&&s.geometry.every(g=>g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5)))&&
      [dayAmenities,nightAmenities].every(a=>a.allSixIndependent&&a.allWithin&&a.allNative)&&
      dayScene.time.b>.95&&nightScene.time.b<.45,{day:dayScene.geometry,night:nightScene.geometry,dayAmenities,nightAmenities});
    // Create sentinel saves only in this newly-created disposable profile. No
    // existing user save is connected. Sentinels are native save copies, never
    // substituted into current slot 3, which always saves the live current city.
    await cdp.evalJs(`(()=>{GV.setSpeed(0);GV.ai(false);GV.save();const raw=localStorage.getItem('glimmerville.v1.s3');
      if(!raw||raw.length<1000)throw Error('Valid current native save required');
      for(const key of ['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak']){
        if(localStorage.getItem(key)!==null)throw Error('Fresh disposable other slot must be empty');localStorage.setItem(key,raw);
      }return true;})()`);
    // BEGIN MEASURED COLD PHASE: passive reads, native save, real Page.reload,
    // native Continue, pause/AI-off and ordinary one-day ticks only. No fixture,
    // rendering helper, extra load, placement, repair or dispatch is called.
    report.coldReloads=[];
    for(let cycle=1;cycle<=2;cycle++){
      const row={cycle,days:[]};report.coldReloads.push(row);
      await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
      const raw=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')");
      const stored=JSON.parse(raw||'null');
      row.before=await state('before-cold-reload-'+cycle);
      row.save={bytes:Buffer.byteLength(raw||''),sha256:sha(raw||''),version:stored?.gameVer,schema:stored?.v,day:stored?.day,money:stored?.money};
      check('cold reload '+cycle+': CURRENT native slot-3 save is operational and unmodified before navigation',
        functionalPublicState013(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.33'&&
        stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&
        row.before.cells.length===row.before.stats.buildings&&Object.keys(row.before.otherSlots).length===4,
        {before:row.before,save:row.save});
      const previousDocumentCount=documentResponses.length;
      sourceObserver.mark(checkScope+'-cold-reload-'+cycle);
      await cdp.send('Page.reload',{ignoreCache:true});
      check('cold reload '+cycle+': actual official Page.reload boots the native menu',await menuReady());
      await documentProof('cold-page-reload-'+cycle,previousDocumentCount);
      const menu=await cdp.evalJs(`({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),
        version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),
        continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',
        fixtureAbsent:!window.__theatreQA013&&!window.__riversideQA012&&!window.__theatrePublic013})`);
      row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:sha(menu.raw||'')};
      check('cold reload '+cycle+': exact current native save bytes survive the exact T729 menu and old fixture memory is gone',
        menu.raw===raw&&menu.slot==='3'&&menu.version==='14.33'&&menu.label==='v14.33 · T729'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
      await registerPassive();
      row.immediate=await cdp.evalJs(`(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);
        return window.__theatrePublicState013('cold-Continue-immediate-${cycle}',${JSON.stringify(recipe)});})()`);
      check('cold reload '+cycle+': native Continue preserves every root ref age view theme water cell and other-slot byte',
        !row.immediate.menuVisible&&row.immediate.version==='14.33'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&
        !row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&
        row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&
        row.immediate.stats.buildings===row.before.stats.buildings&&row.immediate.stats.roads===row.before.stats.roads&&
        equal(row.immediate.cells,row.before.cells)&&equal(row.immediate.paths,row.before.paths)&&
        equal(row.immediate.water,row.before.water)&&equal(row.immediate.otherSlots,row.before.otherSlots),row.immediate);
      for(let n=1;n<=2;n++){
        const frame=await cdp.evalJs(`new Promise(resolve=>requestAnimationFrame(()=>resolve(
          window.__theatrePublicState013('cold-paused-RAF-${cycle}-${n}',${JSON.stringify(recipe)}))))`);
        (row.pausedFrames||=[]).push(frame);
        check('cold reload '+cycle+': paused frame '+n+' retains the exact saved day identities paths water and other slots',
          frame.stats.day===stored.day&&equal(frame.cells,row.before.cells)&&equal(frame.paths,row.before.paths)&&
          equal(frame.water,row.before.water)&&equal(frame.otherSlots,row.before.otherSlots),frame);
      }
      // First ordinary day is independently blocking. Later recovery cannot
      // replace this evidence and no helper may rebuild or repair dispatch.
      for(let day=1;day<=3;day++){
        const next=await cdp.evalJs(`(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);
          return{before,state:window.__theatrePublicState013('cold-${cycle}-ordinary-day-${day}',${JSON.stringify(recipe)})};})()`);
        row.days.push(next);
        next.ok=next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalPublicState013(next.state)&&
          equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&
          equal(ownedIdentity013(next.state),ownedIdentity013(row.before));
        check('cold reload '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day retains road power water public staff cultural leisure and every theme',
          next.ok,{state:next.state,capacity:theatreAccounting013(next.state)});
      }
      save();
    }
    // END MEASURED COLD PHASE.
    check('both independent public cold reloads passed their very first ordinary day',
      report.coldReloads.length === 2 && report.coldReloads.every(q => q.days.length === 3 && q.days.every(d=>d.ok===true&&functionalPublicState013(d.state))),
      report.coldReloads.map(q => ({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
    report.functionalChecksPassed=true;
    await screenshot013('public-cold-reload-verified.png',{kind:'actual official second cold reload after three unaided ordinary days'});
    // BEGIN ADDITIONAL FOUR-COMPLEX OBSERVATION. The prior 26 functional
    // checks have already completed without changing their thresholds.
    checkScope='complexes';
    const complexApi=await cdp.evalJs('({specs:GV.complexSpecs014(),selftest:GV.complexSelftest014(),functions:["complexSpecs014","complexAt014","complexEvidence014","complexSelftest014"].map(k=>({key:k,type:typeof GV[k]}))})');
    check('all 12 permanent buildings and 16 independent path registrations exactly match approved source',
      verifyComplexCatalog014(complexApi.specs)&&complexApi.selftest.ok&&complexApi.functions.every(q=>q.type==='function'),complexApi);
    await cdp.evalJs('window.__complexPublic014=(()=>{'+complexFixtureSource014(ROOT)+';return{setupComplexes014,step014,nativeScene014};})()');
    const complexFixture=await cdp.evalJs('window.__complexPublic014.setupComplexes014(('+seedApprovedBritishLegacy007.toString()+'),"college")');
    report.complexFixture=complexFixture;
    check('normal public city genuinely buys all 12 age-zero roots and 16 paid themes with real utilities',
      complexFixture.oldIdentitiesExact&&complexFixture.roots.length===12&&complexFixture.paths.length===16&&
      complexFixture.initial.difficulty===1&&!complexFixture.initial.developer.sandbox&&!complexFixture.initial.developer.god&&
      complexFixture.initial.roots.length===12&&complexFixture.initial.roots.every(r=>r.age===0&&!r.built&&!r.operational)&&
      complexFixture.paid.every(p=>p.exact&&p.charged>0)&&
      [...complexApi.specs.buildings,...complexApi.specs.paths].every(s=>complexFixture.paid.filter(p=>p.id===s.id).length===1)&&
      ['plant','water','road','wpipe'].every(id=>complexFixture.paid.some(p=>p.id===id&&p.charged>0)),complexFixture);
    report.complexOrdinaryDays=[];
    for(let n=1;n<=9;n++)report.complexOrdinaryDays.push(await cdp.evalJs('window.__complexPublic014.step014(1)'));
    check('all 12 new roots require nine genuine ordinary construction days before any service or income',
      report.complexOrdinaryDays.every((q,n)=>q.day===complexFixture.placementDay+n+1&&q.roots.length===12&&q.roots.every(r=>r.age===n+1))&&
      report.complexOrdinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational&&r.positions===0&&r.employed===0&&r.upkeep===0&&
        r.activity.work===0&&r.activity.leisure===0&&r.activity.education===0&&r.activity.services===0&&!r.coverageStamp&&(!r.housing||r.housing.population===0)))&&
      report.complexOrdinaryDays[8].roots.every(r=>r.built&&r.age===9),report.complexOrdinaryDays);
    const complexRecipe=complexFixture.recipe;
    const registerComplexPassive=async()=>{await registerPassive();await cdp.evalJs('window.__complexPublicState014='+passiveComplexState014.toString());};
    const complexState=label=>cdp.evalJs('window.__complexPublicState014('+JSON.stringify(label)+','+JSON.stringify(complexRecipe)+','+JSON.stringify(recipe)+')');
    await registerComplexPassive();
    let complexOperational=await complexState('complex-day-nine');report.complexOperationalDays=[complexOperational];
    for(let n=9;n<28&&!functionalComplexState014(complexOperational);n++){
      await cdp.evalJs('window.__complexPublic014.step014(1)');complexOperational=await complexState('complex-operational-day-'+(n+1));report.complexOperationalDays.push(complexOperational);
    }
    check('all four complexes attain exact native power water jobs education leisure services housing and fire readiness',
      functionalComplexState014(complexOperational),{state:complexOperational,accounting:complexAccounting014(complexOperational)});
    report.complexScenes=[];
    for(const group of ['college','manor','baths','fire'])for(const night of [false,true]){
      const scene=await cdp.evalJs('window.__complexPublic014.nativeScene014(0,'+night+','+JSON.stringify(group)+',1.45)');
      const {png,...meta}=scene;report.complexScenes.push(meta);
      await screenshot013('public-'+group+'-'+(night?'night':'day')+'.png',{kind:'actual official supplied completed '+group,group,night,geometry:scene.geometry,day:scene.day});
    }
    check('all four actual official day and night views retain three complete canonical independently owned buildings',
      report.complexScenes.length===8&&report.complexScenes.every(s=>s.geometry.length===3&&s.geometry.every(g=>g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5))&&(s.night?s.time.b<.45:s.time.b>.95)),report.complexScenes);
    // BEGIN MEASURED COMPLEX COLD PHASE: no fixture/render/repair/dispatch helpers.
    report.complexColdReloads=[];
    for(let cycle=1;cycle<=2;cycle++){
      const row={cycle,days:[]};report.complexColdReloads.push(row);
      await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
      const raw=await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')"),stored=JSON.parse(raw||'null');
      row.before=await complexState('complex-before-reload-'+cycle);
      row.save={bytes:Buffer.byteLength(raw||''),sha256:sha(raw||''),version:stored?.gameVer,schema:stored?.v,day:stored?.day,money:stored?.money};
      check('complex cold '+cycle+': exact current native save contains all 12 operating roots and 16 themes',
        functionalComplexState014(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.33'&&stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&Object.keys(row.before.otherSlots).length===4,{before:row.before,save:row.save});
      const priorDocuments=documentResponses.length;
      sourceObserver.mark(checkScope+'-cold-reload-'+cycle);
      await cdp.send('Page.reload',{ignoreCache:true});
      check('complex cold '+cycle+': actual official Page.reload boots native menu',await menuReady());
      await documentProof('complex-cold-page-reload-'+cycle,priorDocuments,'complexes');
      const menu=await cdp.evalJs(`({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',fixtureAbsent:!window.__complexQA014&&!window.__complexPublic014&&!window.__theatreQA013&&!window.__theatrePublic013})`);
      row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:sha(menu.raw||'')};
      check('complex cold '+cycle+': exact native save bytes survive T729 menu and previous fixture memory is gone',menu.raw===raw&&menu.slot==='3'&&menu.version==='14.33'&&menu.label==='v14.33 · T729'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
      await registerComplexPassive();
      row.immediate=await cdp.evalJs(`(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);return window.__complexPublicState014('complex-cold-immediate-${cycle}',${JSON.stringify(complexRecipe)},${JSON.stringify(recipe)});})()`);
      check('complex cold '+cycle+': paused native Continue preserves all identities themes water and other save slots',
        !row.immediate.menuVisible&&row.immediate.version==='14.33'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&!row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&
        row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&equal(row.immediate.cells,row.before.cells)&&equal(row.immediate.paths,row.before.paths)&&equal(row.immediate.water,row.before.water)&&equal(row.immediate.otherSlots,row.before.otherSlots),row.immediate);
      for(let frame=1;frame<=2;frame++){
        const q=await cdp.evalJs(`new Promise(resolve=>requestAnimationFrame(()=>resolve(window.__complexPublicState014('complex-paused-${cycle}-${frame}',${JSON.stringify(complexRecipe)},${JSON.stringify(recipe)}))))`);
        (row.pausedFrames||=[]).push(q);
        check('complex cold '+cycle+': paused frame '+frame+' retains exact saved day identities paths water and slots',q.stats.day===stored.day&&equal(q.cells,row.before.cells)&&equal(q.paths,row.before.paths)&&equal(q.water,row.before.water)&&equal(q.otherSlots,row.before.otherSlots),q);
      }
      // The first actual day must pass on its own; paused Continue is never
      // falsely required to restore T724 dispatch before an ordinary day.
      for(let day=1;day<=3;day++){
        const next=await cdp.evalJs(`(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);return {before,state:window.__complexPublicState014('complex-cold-${cycle}-day-${day}',${JSON.stringify(complexRecipe)},${JSON.stringify(recipe)})};})()`);
        row.days.push(next);next.ok=next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalComplexState014(next.state)&&equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&equal(ownedComplexIdentity014(next.state),ownedComplexIdentity014(row.before));
        check('complex cold '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day preserves all native services and exact ownership',next.ok,{state:next.state,accounting:complexAccounting014(next.state)});
      }
    }
    // END MEASURED COMPLEX COLD PHASE.
    check('both four-complex cold reloads pass their first and all three unaided ordinary days',report.complexColdReloads.length===2&&report.complexColdReloads.every(q=>q.days.length===3&&q.days.every(d=>d.ok===true&&functionalComplexState014(d.state))),report.complexColdReloads.map(q=>({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
    report.complexChecksPassed=true;
    await screenshot013('public-complexes-cold-reload-verified.png',{kind:'actual official four-complex second cold reload after three unaided ordinary days'});
    // END ADDITIONAL FOUR-COMPLEX OBSERVATION.

    await observeStreetscape015({ROOT,cdp,report,check,documentResponses,documentProof,menuReady,screenshot013,registerComplexPassive,recipe,save,sourceObserver});

    // BEGIN ADDITIVE GARDEN SUITE016
    await observeGarden016({ROOT,OUT,cdp,report,check,documentResponses,documentProof,menuReady,screenshot013,registerComplexPassive,recipe,save,sourceObserver});
    // END ADDITIVE GARDEN SUITE016

    await publicFetch('after-browser');
    report.sourceAndSaveChecksPassed=report.checks.filter(q=>q.scope==='provenance').every(q=>q.ok)&&report.documents.length===9&&report.coldReloads.length===2&&report.coldReloads.every(q=>q.days.length===3);
    check('all exact official document source and native save gates completed',report.sourceAndSaveChecksPassed,{documents:report.documents.map(d=>({label:d.label,sha256:d.sha256})),coldSaves:report.coldReloads.map(q=>({cycle:q.cycle,...q.save}))},'provenance');
    await sleep(1000);
    reconcileBrowserErrors013();
    report.consoleErrors = cdp.errors;
    report.knownPWALogs = cdp.benign;
    report.rawBrowserErrorCount=report.rawBrowserErrors.length;
    report.knownPWAErrorCount=cdp.benign.length;
    report.unknownErrorCount=cdp.errors.length;
    report.rawConsoleClean=report.rawBrowserErrors.length===0&&report.rawRuntimeErrors.length===0&&cdp.errors.length===0&&report.warnings.length===0;
    check('strict raw console is clean with no known or unknown errors warnings or network failures',
      report.rawConsoleClean && report.networkFailures.length === 0,
      {errors:cdp.errors,knownPWA404:report.knownPWA404,knownPWALogs:cdp.benign,warnings:report.warnings},'diagnostics');
    report.ok = true;
  } catch (error) {
    report.ok = false; report.error = String(error.stack || error);
    if (cdp) {reconcileBrowserErrors013();report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;}
    console.error(report.error); process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    if(cdp){reconcileBrowserErrors013();report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;
      report.rawBrowserErrorCount=report.rawBrowserErrors.length;report.knownPWAErrorCount=cdp.benign.length;
      report.unknownErrorCount=cdp.errors.length;report.rawConsoleClean=report.rawBrowserErrors.length===0&&report.rawRuntimeErrors.length===0&&cdp.errors.length===0&&report.warnings.length===0;
      if(!report.rawConsoleClean||report.networkFailures.length){report.ok=false;process.exitCode=1;}}
    try { await cleanup(); } catch (error) {report.cleanupError=String(error);report.ok=false;process.exitCode=1;}
    Object.assign(report,summarizePublicResult013(report));
    report.complexSummary=summarizeComplexResult014(report);
    report.streetscapeSummary=summarizeStreetscapeResult015(report);
    report.gardenSummary=summarizeGarden016(report);
    const attribution=sourceObserver.snapshot();
    report.consoleSourceSummary={captureFailures:attribution.captureFailures,capabilities:attribution.capabilities,counts:attribution.analysis.counts,warningSources:attribution.analysis.warningSources.map(({eventSequences,firstStackTrace,...q})=>q),policy:attribution.analysis.policy};
    fs.writeFileSync(path.join(OUT,'console-source-attribution.json'),JSON.stringify(attribution,null,2));
    if(attribution.captureFailures.length){report.ok=false;process.exitCode=1;}
    const provenance=report.checks.filter(q=>q.scope==='provenance');
    report.provenanceSummary={passed:report.sourceAndSaveChecksPassed===true&&provenance.length===11&&provenance.every(q=>q.ok),expectedChecks:11,checksExecuted:provenance.length,checksPassed:provenance.filter(q=>q.ok).length,checksFailed:provenance.filter(q=>!q.ok).length,documentsObserved:report.documents.length,expectedDocuments:9};
    if(!report.gardenSummary.passed||!report.streetscapeSummary.passed||!report.complexSummary.passed||!report.functionalSummary.passed||!report.provenanceSummary.passed||!report.browserDiagnosticSummary.strictErrorGatePassed){report.ok=false;process.exitCode=1;}
    fs.writeFileSync(path.join(OUT,'raw-console.json'),JSON.stringify({browser:report.rawBrowserErrors,runtime:report.rawRuntimeErrors,warnings:report.warnings,known:report.knownPWALogs||[],unknown:report.consoleErrors||[],knownPWA404:report.knownPWA404,networkFailures:report.networkFailures},null,2));
    report.finishedAt = new Date().toISOString(); save();
    fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({ok:report.ok,checkedSHA:head,sourceSHA256,
      officialURL:OFFICIAL,observerRunURL:report.observerRunURL,sourceAndSaveChecksPassed:report.sourceAndSaveChecksPassed===true,provenanceSummary:report.provenanceSummary,functionalSummary:report.functionalSummary,complexSummary:report.complexSummary,streetscapeSummary:report.streetscapeSummary,gardenSummary:report.gardenSummary,consoleSourceSummary:report.consoleSourceSummary,browserDiagnosticSummary:report.browserDiagnosticSummary,
      error:report.error||null,finishedAt:report.finishedAt},null,2));
    console.log(JSON.stringify({ok:report.ok,checkedSHA:head,officialURL:OFFICIAL,checks:report.checks.length,
      failures:report.failures,functionalSummary:report.functionalSummary,complexSummary:report.complexSummary,streetscapeSummary:report.streetscapeSummary,gardenSummary:report.gardenSummary,consoleSourceSummary:report.consoleSourceSummary,browserDiagnosticSummary:report.browserDiagnosticSummary}));
  }
})();
