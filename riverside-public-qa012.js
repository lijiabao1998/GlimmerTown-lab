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
const {OFFICIAL,BASE,hash:sha,verifyRelease012,fixtureSource012,verifyPublicFingerprint012} = require('./riverside-public-contract012');
const ROOT=path.resolve(process.env.EXPECTED_RELEASE_ROOT||path.join(__dirname,'../deployed'));
const release=verifyRelease012(ROOT,process.env.EXPECTED_DEPLOY_SHA);
const {launchChrome, pageWsUrl, cdpConnect, waitFor, sleep} = require(path.join(ROOT,'harness.js'));
const {passivePublicState012,functionalPublicState012,retailAccounting012,marketIdentity012,summarizePublicResult012} = require('./riverside-public-state012');
const {reconcilePublicLogs012} = require('./riverside-public-log012');
const {seedApprovedBritishLegacy007} = require(path.join(ROOT,'publiclife-legacy-fixture007.js'));
const OUT=path.join(__dirname,'riverside-evidence/public');
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
 process.env.GITHUB_REF!=='refs/heads/gpt/riverside-public012'||
 !['push','workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME))throw Error('Dedicated same-repository observer branch only');
const pages=JSON.parse(fs.readFileSync(path.join(OUT,'pages-proof.json'),'utf8'));
if(pages.repository!==process.env.GITHUB_REPOSITORY||pages.head_sha!==head||pages.head_branch!=='main'||
 pages.name!=='pages'||pages.conclusion!=='success'||!pages.title.startsWith('T725 '))throw Error('Successful exact T725 main Pages proof required');
async function screenshot012(file,meta){
  const shot=await cdp.send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
  if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid native screenshot');
  fs.writeFileSync(path.join(OUT,file),bytes);report.artifacts.push({file,bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:sha(bytes),checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,...meta});save();
}
async function captureMarket012(night,file,kind){
 const scene=await cdp.evalJs('window.__riversidePublic012.nativeScene012(0,'+night+',[62,53],1.5)');
 await screenshot012(file,{kind,night,day:scene.day,roots:scene.roots,geometry:scene.geometry});
 return scene;
}
const localBytes = fs.readFileSync(path.join(ROOT, 'index.html'));
const sourceSHA256 = sha(localBytes);
fs.mkdirSync(OUT, {recursive: true});
const report = {
  checkedSHA: head, expectedDeploySHA: expected, observerWorkflowSHA: process.env.GITHUB_SHA,
  run: process.env.GITHUB_RUN_ID, upstreamPagesRun:pages.id, upstreamPagesURL:pages.html_url, observerSHA:observerHead,
  officialURL: OFFICIAL, sourceSHA256, startedAt: new Date().toISOString(),
  checks: [], failures: [], artifacts: [], documents: [], publicFetches: [], networkFailures: [], functionalChecksPassed:false,
  knownPWA404: [], rawBrowserErrors: [], warnings: [], limits: [
    'CI-only public-origin browser verification; no local game runtime was used.',
    'Uses a new disposable Chrome profile and native slot 3; no existing user profile or save is opened.',
    'Remote traffic is read-only. Only this disposable browser game memory and localStorage change.',
    'Known missing manifest.json, icon.svg and sw.js PWA resources are disclosed separately from game errors.',
    'The pinned retained-town fixture seeds old building ages, initial treasury and rank only. The new market, paths, homes, canal and utilities are actually bought; new age, power, water, staffing and tax are not assigned.',
    'Two real Page.reload / native Continue cycles each use the exact current native save and pass three unaided ordinary days with power, water, staff, shopping, actual tax and all three path themes; no repair, render or topology/dispatch helper is called in the measured cold phase.',
    'The T725 promoted baseline must match all 2919 complete live records, including 2895 unchanged old leaves and all 1728 old block records.',
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
  url.searchParams.set('riversideqa012', head);
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
function reconcileBrowserErrors012() {
  const pending = report.rawBrowserErrors.slice(reconciledBrowserErrorCount);
  const result = reconcilePublicLogs012(pending, report.knownPWA404);
  cdp.errors.push(...result.errors); cdp.benign.push(...result.known);
  reconciledBrowserErrorCount = report.rawBrowserErrors.length;
}
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
    report.rawBrowserErrors.push({...p.entry});
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
    !row.fromServiceWorker && proof.sha256 === sourceSHA256 && bytes.equals(localBytes), proof, 'provenance');
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
    report.error = 'Public verification exceeded 20-minute bounded runtime'; save();
    cleanup().finally(() => process.exit(124));
  }, 20 * 60000);
  watchdog.unref();
  try {
    check('authorized T725/v14.29 release is exactly the approved market plus three release labels', release.release&&release.htmlExact&&release.sourceSHA256===sourceSHA256,release);
    await publicFetch('before-browser');
    profile = fs.mkdtempSync(path.join(os.tmpdir(), 'riverside-public012-'));
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
    const target = new URL(OFFICIAL); target.searchParams.set('riversideqa012', head);
    const navigation = await cdp.send('Page.navigate', {url: target.href});
    check('public navigation accepted without TLS bypass', !navigation.errorText, navigation);
    check('public main menu booted', await menuReady());
    await documentProof('initial-navigation', 0);
    const boot = await cdp.evalJs(`({ready:!!window.__bootDone453, version:GV.ver(),
      label:document.getElementById('startVersion456')?.textContent.trim(),
      slot:localStorage.getItem('glimmerville.v1.slot'), batches:window.__t574,
      otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})`);
    check('live version, anchor, native boot and isolated slot 3', boot.ready && boot.version === '14.29' &&
      boot.label === 'v14.29 · T725' && boot.slot === '3' && boot.batches &&
      Array.isArray(boot.batches.err) && boot.batches.err.length === 0 && boot.otherSaves.length === 0, boot);
    await screenshot012('public-menu.png', {kind:'actual official-origin native release menu'});
    checkScope='functional';
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
    const api=await cdp.evalJs(`({specs:GV.riversideSpecs012(),selftest:GV.riversideSelftest012(),
      functions:['save','step','fp536','blockFp536','riversideSpecs012','riversideAt012','riversideEvidence012',
        'riversideSelftest012','stationDistrictAt008','museumEvidence010'].map(k=>({key:k,type:typeof GV[k]}))})`);
    check('three bounded native retail buildings and three independent native walking themes exist',api.selftest.ok&&
      equal(api.specs.buildings.map(q=>[q.k,q.sz]),[[278,3],[279,1],[280,1]])&&
      equal(api.specs.paths.map(q=>q.theme).sort(),['promenade','quay','rail'])&&api.functions.every(q=>q.type==='function'),api);
    const fp=await cdp.evalJs('GV.fp536()'),blocks=await cdp.evalJs('GV.blockFp536()');
    const proof=verifyPublicFingerprint012(ROOT,fp,blocks);
    check('live 2919 native leaves exactly match promoted T725, preserving 2895 old records and 1728 blocks',
      proof.ok&&proof.promotedNativeRecordsExact&&proof.oldCompleteRecordsExact&&proof.blocksExact,proof,'provenance');
    const fpBytes=Buffer.from(JSON.stringify({checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,version:'14.29',anchor:'T725',fp,blocks,proof},null,2));
    fs.writeFileSync(path.join(OUT,'fingerprint-native.json'),fpBytes);
    report.fingerprint={file:'fingerprint-native.json',sha256:sha(fpBytes),base:BASE,...proof};
    await cdp.evalJs('window.__riversidePublic012=(()=>{'+fixtureSource012(ROOT)+';return{setupRiverside012,snapshot012,step012,nativeScene012,retailWitness012};})()');
    const fixture=await cdp.evalJs('window.__riversidePublic012.setupRiverside012(('+seedApprovedBritishLegacy007.toString()+'))');
    report.fixture=fixture;
    check('public-origin normal city actually buys age-zero market buildings, all three themes and real canal',
      fixture.difficulty===1&&!fixture.developer.sandbox&&!fixture.developer.god&&
      fixture.paid.every(q=>q.exact&&q.charged>0)&&fixture.initial.roots.length===3&&
      fixture.initial.roots.every(r=>[278,279,280].includes(r.k)&&r.age===0&&!r.built&&!r.operational)&&
      fixture.paths.length===3&&new Set(fixture.paths.map(p=>p.theme)).size===3&&fixture.pathPlacements.length===36&&
      fixture.waterCells.length===70&&fixture.waterCells.every(p=>p.terrain===0&&p.payments.every(q=>q.exact&&q.charged>0))&&
      fixture.shoreline.length===13&&fixture.shoreline.every(p=>p.land!==0&&p.water===0),fixture);
    await captureMarket012(false,'public-market-construction.png','actual paid age-zero market at official origin');
    report.ordinaryDays=[];
    for(let n=1;n<=9;n++)report.ordinaryDays.push(await cdp.evalJs('window.__riversidePublic012.step012(1)'));
    check('nine real ordinary construction days suppress jobs shopping and tax before age nine',
      report.ordinaryDays.length===9&&report.ordinaryDays.every((q,n)=>q.day===fixture.placementDay+n+1&&
        q.roots.length===3&&q.roots.every(r=>r.age===n+1))&&
      report.ordinaryDays.slice(0,8).every(q=>q.roots.every(r=>!r.built&&!r.operational&&r.positions===0&&
        r.employed===0&&r.activity.work===0&&r.activity.shopping===0&&(!r.tax||r.tax.tax===0))&&
        q.taxLedger.current&&q.taxLedger.total===0)&&report.ordinaryDays[8].roots.every(r=>r.age===9&&r.built),report.ordinaryDays);
    const recipe=fixture.recipe;
    const registerPassive=()=>cdp.evalJs('window.__riversidePublicState012='+passivePublicState012.toString());
    const state=label=>cdp.evalJs('window.__riversidePublicState012('+JSON.stringify(label)+','+JSON.stringify(recipe)+')');
    await registerPassive();
    let operational=await state('day-nine');
    report.operationalDays=[operational];
    for(let n=9;n<24&&!functionalPublicState012(operational);n++){
      await cdp.evalJs('window.__riversidePublic012.step012(1)');
      operational=await state('ordinary-operational-day-'+(n+1));report.operationalDays.push(operational);
    }
    report.operational=operational;report.retail=retailAccounting012(operational.market);
    check('actual public market has native road allocated power delivered water enterprise staff shopping and positive fiscal tax',
      functionalPublicState012(operational),{operational,retail:report.retail});
    check('all 36 native themed paths retain exact independent metadata and real water frontage',
      equal(operational.themes.map(p=>p.at.amx502),fixture.pathPlacements.map(p=>
        fixture.initial.identity.paths.find(q=>q.i===p.y*72+p.x)?.amx502)),operational.themes);
    const dayScene=await captureMarket012(false,'public-market-day.png','actual supplied completed market at official origin');
    const nightScene=await captureMarket012(true,'public-market-night.png','actual supplied completed market night at official origin');
    check('native official day and night views show all three complete canonical market facades',
      [dayScene,nightScene].every(s=>s.geometry.length===3&&s.geometry.every(g=>g.canonical&&g.within&&g.anchorError.every(v=>Math.abs(v)<1e-5)))&&
      dayScene.time.b>.95&&nightScene.time.b<.45,{day:dayScene.geometry,night:nightScene.geometry});
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
        functionalPublicState012(row.before)&&stored?.v===1&&stored.n===72&&stored.df===1&&stored.gameVer==='14.29'&&
        stored.day===row.before.stats.day&&stored.money===row.before.stats.money&&
        row.before.cells.length===row.before.stats.buildings&&Object.keys(row.before.otherSlots).length===4,
        {before:row.before,save:row.save});
      const previousDocumentCount=documentResponses.length;
      await cdp.send('Page.reload',{ignoreCache:true});
      check('cold reload '+cycle+': actual official Page.reload boots the native menu',await menuReady());
      await documentProof('cold-page-reload-'+cycle,previousDocumentCount);
      const menu=await cdp.evalJs(`({raw:localStorage.getItem('glimmerville.v1.s3'),slot:localStorage.getItem('glimmerville.v1.slot'),
        version:GV.ver(),label:document.getElementById('startVersion456')?.textContent.trim(),
        continueVisible:!!document.getElementById('bContinue')&&getComputedStyle(document.getElementById('bContinue')).display!=='none',
        fixtureAbsent:!window.__riversideQA012&&!window.__riversidePublic012})`);
      row.menu={slot:menu.slot,version:menu.version,label:menu.label,continueVisible:menu.continueVisible,fixtureAbsent:menu.fixtureAbsent,saveSHA256:sha(menu.raw||'')};
      check('cold reload '+cycle+': exact current native save bytes survive the exact T725 menu and old fixture memory is gone',
        menu.raw===raw&&menu.slot==='3'&&menu.version==='14.29'&&menu.label==='v14.29 · T725'&&menu.continueVisible&&menu.fixtureAbsent,row.menu);
      await registerPassive();
      row.immediate=await cdp.evalJs(`(()=>{document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);
        return window.__riversidePublicState012('cold-Continue-immediate-${cycle}',${JSON.stringify(recipe)});})()`);
      check('cold reload '+cycle+': native Continue preserves every root ref age view theme water cell and other-slot byte',
        !row.immediate.menuVisible&&row.immediate.version==='14.29'&&row.immediate.slot==='3'&&row.immediate.difficulty===1&&
        !row.immediate.developer.sandbox&&!row.immediate.developer.god&&!row.immediate.coldFixDisabled&&
        row.immediate.stats.day===stored.day&&row.immediate.stats.money===stored.money&&
        row.immediate.stats.buildings===row.before.stats.buildings&&row.immediate.stats.roads===row.before.stats.roads&&
        equal(row.immediate.cells,row.before.cells)&&equal(row.immediate.paths,row.before.paths)&&
        equal(row.immediate.water,row.before.water)&&equal(row.immediate.otherSlots,row.before.otherSlots)&&
        row.immediate.market.taxLedger.current===false,row.immediate);
      for(let n=1;n<=2;n++){
        const frame=await cdp.evalJs(`new Promise(resolve=>requestAnimationFrame(()=>resolve(
          window.__riversidePublicState012('cold-paused-RAF-${cycle}-${n}',${JSON.stringify(recipe)}))))`);
        (row.pausedFrames||=[]).push(frame);
        check('cold reload '+cycle+': paused frame '+n+' retains the exact saved day identities paths water and other slots',
          frame.stats.day===stored.day&&equal(frame.cells,row.before.cells)&&equal(frame.paths,row.before.paths)&&
          equal(frame.water,row.before.water)&&equal(frame.otherSlots,row.before.otherSlots),frame);
      }
      // First ordinary day is independently blocking. Later recovery cannot
      // replace this evidence and no helper may rebuild or repair dispatch.
      for(let day=1;day<=3;day++){
        const next=await cdp.evalJs(`(()=>{const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);
          return{before,state:window.__riversidePublicState012('cold-${cycle}-ordinary-day-${day}',${JSON.stringify(recipe)})};})()`);
        row.days.push(next);
        check('cold reload '+cycle+': '+(day===1?'FIRST':day)+' unaided ordinary day retains power water staff shopping actual tax and every theme',
          next.before===stored.day+day-1&&next.state.stats.day===next.before+1&&functionalPublicState012(next.state)&&
          equal(next.state.paths,row.before.paths)&&equal(next.state.water,row.before.water)&&equal(next.state.otherSlots,row.before.otherSlots)&&
          equal(marketIdentity012(next.state),marketIdentity012(row.before)),
          {state:next.state,retail:retailAccounting012(next.state.market)});
      }
      save();
    }
    // END MEASURED COLD PHASE.
    check('both independent public cold reloads passed their very first ordinary day',
      report.coldReloads.length === 2 && report.coldReloads.every(q => q.days.length === 3 && functionalPublicState012(q.days[0].state)),
      report.coldReloads.map(q => ({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
    report.functionalChecksPassed=true;
    await screenshot012('public-cold-reload-verified.png',{kind:'actual official second cold reload after three unaided ordinary days'});
    await publicFetch('after-browser');
    await sleep(1000);
    reconcileBrowserErrors012();
    report.consoleErrors = cdp.errors;
    report.knownPWALogs = cdp.benign;
    report.rawBrowserErrorCount=report.rawBrowserErrors.length;
    report.knownPWAErrorCount=cdp.benign.length;
    report.unknownErrorCount=cdp.errors.length;
    report.rawConsoleClean=report.rawBrowserErrors.length===0&&cdp.errors.length===0;
    check('no unknown browser/game errors or network failures; every precise known PWA 404 remains in raw evidence',
      cdp.errors.length === 0 && report.networkFailures.length === 0,
      {errors:cdp.errors,knownPWA404:report.knownPWA404,knownPWALogs:cdp.benign,warnings:report.warnings},'diagnostics');
    report.ok = true;
  } catch (error) {
    report.ok = false; report.error = String(error.stack || error);
    if (cdp) {reconcileBrowserErrors012();report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;}
    console.error(report.error); process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    if(cdp){reconcileBrowserErrors012();report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;
      report.rawBrowserErrorCount=report.rawBrowserErrors.length;report.knownPWAErrorCount=cdp.benign.length;
      report.unknownErrorCount=cdp.errors.length;report.rawConsoleClean=report.rawBrowserErrors.length===0&&cdp.errors.length===0;
      if(cdp.errors.length||report.networkFailures.length){report.ok=false;process.exitCode=1;}}
    try { await cleanup(); } catch (error) {report.cleanupError=String(error);report.ok=false;process.exitCode=1;}
    Object.assign(report,summarizePublicResult012(report));
    report.finishedAt = new Date().toISOString(); save();
    fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({ok:report.ok,checkedSHA:head,sourceSHA256,
      officialURL:OFFICIAL,functionalSummary:report.functionalSummary,browserDiagnosticSummary:report.browserDiagnosticSummary,
      error:report.error||null,finishedAt:report.finishedAt},null,2));
    console.log(JSON.stringify({ok:report.ok,checkedSHA:head,officialURL:OFFICIAL,checks:report.checks.length,
      failures:report.failures,functionalSummary:report.functionalSummary,browserDiagnosticSummary:report.browserDiagnosticSummary}));
  }
})();
