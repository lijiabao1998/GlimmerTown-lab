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
const {BASE, verifyStatic011} = require('./coldload-static-contract011');
const {verifyFingerprint011} = require('./coldload-fingerprint-qa011');
const {passivePublicState011, functionalPublicState011} = require('./coldload-public-state011');
const {reconcilePublicLogs011} = require('./coldload-public-log011');
const {seedApprovedBritishLegacy007} = require('./publiclife-legacy-fixture007');
const ROOT = __dirname, OUT = path.join(ROOT, 'coldload-evidence/public');
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
     run.head_repository?.full_name!==process.env.GITHUB_REPOSITORY||!(run.head_commit?.message||'').startsWith('T724 '))
    throw Error('Expected successful same-repository main Pages deployment starting with T724 followed by a space');
} else if(process.env.GITHUB_EVENT_NAME!=='workflow_dispatch') throw Error('Only release-scoped Pages observer or explicit dispatch is allowed');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function verifyRelease011() {
  const proof = verifyStatic011();
  if (!proof.ok || !proof.release || proof.version !== '14.28' || proof.anchor !== 'T724' ||
      !proof.fixProofExact || !proof.htmlExact || !proof.protectedExact || !proof.fpExact ||
      proof.sourceSHA256 !== sourceSHA256) throw Error('Exact authorized T724 release/static contract required');
  // The strict static contract pins every existing T723 fixture and harness byte.
  // Only these pinned fixture bodies are sent to Chrome; game bytes always come
  // from the real HTTPS document, never interception or a local server.
  const {protectedManifest, releaseLogEntry, ...summary} = proof;
  return {...summary, protectedFiles:Object.keys(protectedManifest).length};
}
function fixtureRange010(s,a,b){const start=s.indexOf(a),end=s.indexOf(b,start);if(start<0||end<=start)throw Error('Missing pinned fixture range '+a);return s.slice(start,end);}
function fixture010(){
  const street=fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8');
  const museum=fs.readFileSync(path.join(ROOT,'museum-integration-qa010.js'),'utf8');
  return fixtureRange010(street,'function setupStreet009(','function snapshot009(')+'\n'+
    fixtureRange010(museum,'function setupMuseum010(','function assets010(')+'\n'+
    fixtureRange010(museum,'function nativeScene010(','function nativeLight010(');
}
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
  knownPWA404: [], rawBrowserErrors: [], warnings: [], limits: [
    'CI-only public-origin browser verification; no local game runtime was used.',
    'Uses a new disposable Chrome profile and native slot 3; no existing user profile or save is opened.',
    'Remote traffic is read-only. Only this disposable browser game memory and localStorage change.',
    'Known missing manifest.json, icon.svg and sw.js PWA resources are disclosed separately from game errors.',
    'The pinned retained-town fixture seeds old building ages, initial treasury and rank only. The new museum, paths, homes and utilities are actually bought; power, water, staffing, tourism and museum age are not assigned.',
    'Two actual cold Page.reload / native Continue cycles each must retain power and staffing on their first ordinary day, without any repair or topology/dispatch helper calls.',
    'The tracked fingerprint baseline remains byte-exact T723; a power-load fix has no sprite promotion.',
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
  url.searchParams.set('coldloadqa011', head);
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
let reconciledBrowserErrorCount = 0;
function reconcileBrowserErrors011() {
  const pending = report.rawBrowserErrors.slice(reconciledBrowserErrorCount);
  const result = reconcilePublicLogs011(pending, report.knownPWA404);
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
    const release = verifyRelease011();
    check('authorized T724/v14.28 release is exactly the approved one-hunk cold-load fix plus three release labels', release.release && release.htmlExact && release.fpExact, release);
    await publicFetch('before-browser');
    profile = fs.mkdtempSync(path.join(os.tmpdir(), 'coldload-public011-'));
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
    const target = new URL(OFFICIAL); target.searchParams.set('coldloadqa011', head);
    const navigation = await cdp.send('Page.navigate', {url: target.href});
    check('public navigation accepted without TLS bypass', !navigation.errorText, navigation);
    check('public main menu booted', await menuReady());
    await documentProof('initial-navigation', 0);
    const boot = await cdp.evalJs(`({ready:!!window.__bootDone453, version:GV.ver(),
      label:document.getElementById('startVersion456')?.textContent.trim(),
      slot:localStorage.getItem('glimmerville.v1.slot'), batches:window.__t574,
      otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})`);
    check('live version, anchor, native boot and isolated slot 3', boot.ready && boot.version === '14.28' &&
      boot.label === 'v14.28 · T724' && boot.slot === '3' && boot.batches &&
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
    const proof = verifyFingerprint011(fp, blocks);
    check('all 2895 live native leaves, 157 families and 1728 blocks remain exact T723 with no promotion',
      proof.ok && proof.trackedBaselineExact && proof.oldCompleteRecordsExact && proof.blocksExact, proof);
    const fpBytes = Buffer.from(JSON.stringify({checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,version:'14.28',anchor:'T724',fp,blocks,proof},null,2));
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
    for(let n=9;n<24&&(!operational.roots.every(r=>r.operational&&r.employed>0&&r.tourism.currentBase>0)||!operational.legacy.roots.every(r=>r.operational&&r.employed>0));n++) {
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
    // From this point on, only passive reads, native save, native Continue,
    // pausing and ordinary one-day ticks are allowed. No fixture is re-created,
    // and no building/road/utility is added or repaired after a cold reload.
    const retained = fixture.retained;
    const registerPassive = () => cdp.evalJs('window.__coldloadPublicState011=' + passivePublicState011.toString());
    const state = label => cdp.evalJs('window.__coldloadPublicState011(' + JSON.stringify(label) + ',' + JSON.stringify(retained) + ')');
    await registerPassive();
    report.coldReloads = [];
    for (let cycle = 1; cycle <= 2; cycle++) {
      const row = {cycle, days:[]}; report.coldReloads.push(row);
      await cdp.evalJs('GV.setSpeed(0);GV.ai(false);GV.save()');
      const raw = await cdp.evalJs("localStorage.getItem('glimmerville.v1.s3')");
      const stored = JSON.parse(raw || 'null');
      row.before = await state('before-cold-reload-' + cycle);
      row.save = {bytes:Buffer.byteLength(raw || ''), sha256:sha(raw || ''),
        version:stored?.gameVer, schema:stored?.v, day:stored?.day, money:stored?.money};
      check('cold reload ' + cycle + ': native ordinary slot-3 save is operational before navigation',
        functionalPublicState011(row.before) && stored?.v === 1 && stored.n === 72 && stored.df === 1 &&
        stored.gameVer === '14.28' && stored.day === row.before.stats.day &&
        stored.money === row.before.stats.money && row.before.cells.length === row.before.stats.buildings &&
        Object.keys(row.before.otherSlots).length === 0, {before:row.before, save:row.save});
      const previousDocumentCount = documentResponses.length;
      await cdp.send('Page.reload', {ignoreCache:true});
      check('cold reload ' + cycle + ': actual public Page.reload returns to the native menu', await menuReady());
      await documentProof('cold-page-reload-' + cycle, previousDocumentCount);
      const menu = await cdp.evalJs(`({raw:localStorage.getItem('glimmerville.v1.s3'),
        slot:localStorage.getItem('glimmerville.v1.slot'), version:GV.ver(),
        label:document.getElementById('startVersion456')?.textContent.trim(),
        continueVisible:!!document.getElementById('bContinue') && getComputedStyle(document.getElementById('bContinue')).display !== 'none'})`);
      row.menu = {slot:menu.slot, version:menu.version, label:menu.label,
        continueVisible:menu.continueVisible, saveSHA256:sha(menu.raw || '')};
      check('cold reload ' + cycle + ': exact native save bytes survive in the exact T724 menu',
        menu.raw === raw && menu.slot === '3' && menu.version === '14.28' &&
        menu.label === 'v14.28 · T724' && menu.continueVisible, row.menu);
      await registerPassive();
      // One synchronous browser evaluation clicks the real Continue button,
      // pauses, and reads. No opportunity for a harness repair is introduced.
      row.immediate = await cdp.evalJs(`(() => {
        document.getElementById('bContinue').click();GV.setSpeed(0);GV.ai(false);
        return window.__coldloadPublicState011('cold-Continue-immediate-${cycle}',${JSON.stringify(retained)});
      })()`);
      check('cold reload ' + cycle + ': Continue preserves every building/ref cell, path theme and other slot',
        !row.immediate.menuVisible && row.immediate.version === '14.28' && row.immediate.slot === '3' &&
        row.immediate.difficulty === 1 && !row.immediate.developer.sandbox && !row.immediate.developer.god &&
        row.immediate.stats.day === stored.day && row.immediate.stats.money === stored.money &&
        row.immediate.stats.buildings === row.before.stats.buildings &&
        row.immediate.stats.roads === row.before.stats.roads &&
        equal(row.immediate.cells,row.before.cells) && equal(row.immediate.paths,row.before.paths) &&
        equal(row.immediate.otherSlots,row.before.otherSlots), row.immediate);
      for (let n = 1; n <= 2; n++) {
        const frame = await cdp.evalJs(`new Promise(resolve => requestAnimationFrame(() =>
          resolve(window.__coldloadPublicState011('cold-paused-RAF-${cycle}-${n}',${JSON.stringify(retained)}))))`);
        (row.pausedFrames ||= []).push(frame);
        check('cold reload ' + cycle + ': paused animation frame ' + n + ' keeps day and exact saved identities',
          frame.stats.day === stored.day && equal(frame.cells,row.before.cells) &&
          equal(frame.paths,row.before.paths) && equal(frame.otherSlots,row.before.otherSlots), frame);
      }
      // The first day is a hard independent gate. A later recovery, paid road,
      // extra load, or dispatch call can never turn this result into a pass.
      for (let day = 1; day <= 3; day++) {
        const next = await cdp.evalJs(`(() => {
          const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.ai(false);
          return {before,state:window.__coldloadPublicState011('cold-${cycle}-ordinary-day-${day}',${JSON.stringify(retained)})};
        })()`);
        row.days.push(next);
        check('cold reload ' + cycle + ': ' + (day === 1 ? 'FIRST' : day) + ' ordinary day retains native power, water and staff without repair',
          next.before === stored.day + day - 1 && next.state.stats.day === next.before + 1 &&
          functionalPublicState011(next.state) && equal(next.state.paths,row.before.paths) &&
          equal(next.state.otherSlots,row.before.otherSlots), next);
      }
      save();
    }
    await screenshot010('public-cold-reload-verified.png', {kind:'actual official-origin second cold reload after three unassisted ordinary days'});
    await publicFetch('after-browser');
    await sleep(1000);
    reconcileBrowserErrors011();
    report.consoleErrors = cdp.errors;
    report.knownPWALogs = cdp.benign;
    check('zero game console errors and uncaught exceptions; known PWA 404s disclosed',
      cdp.errors.length === 0 && report.networkFailures.length === 0,
      {errors:cdp.errors,knownPWA404:report.knownPWA404,knownPWALogs:cdp.benign,warnings:report.warnings});
    check('both independent public cold reloads passed their very first ordinary day',
      report.coldReloads.length === 2 && report.coldReloads.every(q => q.days.length === 3 && functionalPublicState011(q.days[0].state)),
      report.coldReloads.map(q => ({cycle:q.cycle,save:q.save,firstDay:q.days[0]})));
    report.ok = true;
  } catch (error) {
    report.ok = false; report.error = String(error.stack || error);
    if (cdp) {reconcileBrowserErrors011();report.consoleErrors=cdp.errors;report.knownPWALogs=cdp.benign;}
    console.error(report.error); process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    try { await cleanup(); } catch (error) {report.cleanupError=String(error);report.ok=false;process.exitCode=1;}
    report.finishedAt = new Date().toISOString(); save();
    console.log(JSON.stringify({ok:report.ok,checkedSHA:head,officialURL:OFFICIAL,checks:report.checks.length,
      failures:report.failures,knownPWA404:report.knownPWA404}));
  }
})();
