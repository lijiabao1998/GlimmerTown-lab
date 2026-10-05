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
const {verifyRelease009, BASE} = require('./streetlife-release-contract009');
const {verifyFingerprint009} = require('./streetlife-fingerprint-qa009');
const ROOT = __dirname, OUT = path.join(ROOT, 'streetlife-evidence/public');
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
  const run = event.workflow_run;
  if (run?.name !== 'pages' || run.conclusion !== 'success' || run.head_branch !== 'main' ||
      run.head_sha !== head || run.head_repository?.full_name !== process.env.GITHUB_REPOSITORY) {
    throw Error('Expected successful same-repository main Pages deployment');
  }
} else if (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch') {
  throw Error('Only successful Pages workflow_run or explicit dispatch is allowed');
}
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const localBytes = fs.readFileSync(path.join(ROOT, 'index.html'));
const sourceSHA256 = sha(localBytes);
fs.mkdirSync(OUT, {recursive: true});
const report = {
  checkedSHA: head, expectedDeploySHA: expected, observerWorkflowSHA: process.env.GITHUB_SHA,
  run: process.env.GITHUB_RUN_ID, upstreamPagesRun: event.workflow_run?.id || null,
  officialURL: OFFICIAL, sourceSHA256, startedAt: new Date().toISOString(),
  checks: [], failures: [], documents: [], publicFetches: [], networkFailures: [],
  knownPWA404: [], warnings: [], limits: [
    'CI-only public-origin browser verification; no local game runtime was used.',
    'Uses a new disposable Chrome profile and native slot 3; no existing user profile or save is opened.',
    'Remote traffic is read-only. Only this disposable browser localStorage changes.',
    'Known missing manifest.json, icon.svg and sw.js PWA resources are disclosed separately from game errors.',
    'This basic release check does not replace full nine-day construction, labor and supply-loss integration CI.'
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
  url.searchParams.set('publicqa009', head);
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
    const release = verifyRelease009();
    check('authorized T722/v14.26 release and exact approved promotion', release.release && release.htmlExact && release.fpExact);
    await publicFetch('before-browser');
    profile = fs.mkdtempSync(path.join(os.tmpdir(), 'streetlife-public009-'));
    const port = 9300 + process.pid % 500;
    chrome = launchChrome(port, profile);
    cdp = await cdpConnect(await pageWsUrl(port, chrome), onEvent);
    for (const method of ['Runtime.enable', 'Log.enable', 'Page.enable']) await cdp.send(method);
    // The single HTML document is about 10 MB. Retain its actual decoded bytes
    // for CDP hashing instead of relying on the default per-resource buffer.
    await cdp.send('Network.enable', {maxTotalBufferSize:64*1024*1024,maxResourceBufferSize:32*1024*1024});
    await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
    await cdp.send('Network.setBypassServiceWorker', {bypass: true});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `
      if (location.origin === 'https://lijiabao1998.github.io' && location.pathname === '/GlimmerTown-lab/') {
        localStorage.setItem('glimmerville.v1.slot', '3');
        localStorage.setItem('glimmerville.v1.q', '2');
      }`});
    const target = new URL(OFFICIAL); target.searchParams.set('publicqa009', head);
    const navigation = await cdp.send('Page.navigate', {url: target.href});
    check('public navigation accepted without TLS bypass', !navigation.errorText, navigation);
    check('public main menu booted', await menuReady());
    await documentProof('initial-navigation', 0);
    const boot = await cdp.evalJs(`({ready:!!window.__bootDone453, version:GV.ver(),
      label:document.getElementById('startVersion456')?.textContent.trim(),
      slot:localStorage.getItem('glimmerville.v1.slot'), batches:window.__t574,
      otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})`);
    check('live version, anchor, native boot and isolated slot 3', boot.ready && boot.version === '14.26' &&
      boot.label === 'v14.26 · T722' && boot.slot === '3' && boot.batches &&
      Array.isArray(boot.batches.err) && boot.batches.err.length === 0 && boot.otherSaves.length === 0, boot);
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
    const api = await cdp.evalJs(`({specs:GV.streetLifeSpecs009(),selftest:GV.streetLifeSelftest009(),
      functions:['save','load','step','fp536','blockFp536','streetLifeSpecs009','streetLifeAt009','streetLifeEvidence009',
        'streetLifeSelftest009','stationDistrictAt008'].map(k=>({key:k,type:typeof GV[k]}))})`);
    const expectedBuildings = [[274,'stationHotel009',3],[275,'refreshmentCafe009',2],[276,'stationNewsstand009',1]];
    check('all six public tools and required native APIs exist', api.selftest.ok &&
      equal(api.specs.buildings.map(q=>[q.k,q.id,q.sz]), expectedBuildings) &&
      equal(api.specs.paths.map(q=>q.id).sort(), ['stationBench009','stationFingerpost009','stationPlanter009']) &&
      api.functions.every(q=>q.type==='function'), api);
    const fp = await cdp.evalJs('GV.fp536()');
    const blocks = await cdp.evalJs('GV.blockFp536()');
    const proof = verifyFingerprint009(fp, blocks);
    check('complete public native fingerprints equal the promoted baseline and pinned old records',
      proof.ok && proof.phase === 'release' && proof.promotedNativeRecordsExact &&
      equal(fp.subs, release.releaseBaseline.subs) && equal(fp.families, release.releaseBaseline.families) &&
      equal(fp.stats, release.releaseBaseline.stats) && equal({fam:blocks.fam,count:blocks.count}, release.releaseBaseline.blocks), proof);
    const fpBytes = Buffer.from(JSON.stringify({checkedSHA:head,sourceSHA256,officialURL:OFFICIAL,version:'14.26',anchor:'T722',fp,blocks,proof},null,2));
    fs.writeFileSync(path.join(OUT, 'fingerprint-native.json'), fpBytes);
    report.fingerprint = {file:'fingerprint-native.json',sha256:sha(fpBytes),base:BASE,...proof};
    const saved = await cdp.evalJs(`(() => {
      GV.setSpeed(0);GV.ai(false);const before=GV.stats(),developer=GV.dev516B();
      GV.step(1);GV.setSpeed(0);const after=GV.stats();GV.save();
      const raw=localStorage.getItem('glimmerville.v1.s3');
      return {before,after,developer,difficulty:GV.diff(),raw,
        otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))};
    })()`);
    const stored = JSON.parse(saved.raw || 'null');
    check('ordinary native day and native slot-3 storage work', saved.difficulty === 1 &&
      !saved.developer.sandbox && !saved.developer.god && saved.after.day === saved.before.day + 1 &&
      Number.isFinite(saved.after.money) && stored?.v === 1 && stored.n === 72 && stored.df === 1 &&
      stored.day === saved.after.day && stored.money === Math.round(saved.after.money) && stored.gameVer === '14.26' &&
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
      return {continued:getComputedStyle(document.getElementById('start')).display==='none',after,
        difficulty:GV.diff(),developer,slot:localStorage.getItem('glimmerville.v1.slot')};
    })()`);
    check('native Continue loads saved ordinary city after page reload', loaded.continued &&
      loaded.slot === '3' && loaded.difficulty === 1 && !loaded.developer.sandbox && !loaded.developer.god &&
      loaded.after.day === stored.day && loaded.after.money === stored.money &&
      loaded.after.buildings === saved.after.buildings && loaded.after.roads === saved.after.roads, loaded);
    const following = await cdp.evalJs(`(() => {
      const before=GV.stats().day;GV.step(1);GV.setSpeed(0);GV.forceDraw();
      return {before,after:GV.stats(),selftest:GV.streetLifeSelftest009(),
        otherSaves:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))};
    })()`);
    check('loaded city runs a following ordinary day with intact new tools and untouched other slots',
      following.after.day === following.before + 1 && Number.isFinite(following.after.money) &&
      following.selftest.ok && following.otherSaves.length === 0, following);
    const screenshot = await cdp.send('Page.captureScreenshot', {format:'png'});
    const image = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(path.join(OUT, 'public-slot3.png'), image);
    report.screenshot = {file:'public-slot3.png',sha256:sha(image),checkedSHA:head,sourceSHA256};
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
