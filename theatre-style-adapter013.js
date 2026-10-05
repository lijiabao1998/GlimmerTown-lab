#!/usr/bin/env node
'use strict';
// T726 QA only: restore the image-approved candidate's declared-art comparison.
// The sole fp.js source substitution is FP_PATH. All original fingerprint,
// block and style assertions, thresholds, and --expect semantics stay intact.
// A separate complete current-head approved native proof is mandatory first.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { execFileSync, spawnSync } = require('node:child_process');
const fixed = require('./theatre-static-contract013');
const ROOT = __dirname;
const FP_SOURCE_SHA256 = '0cd7196f0a23e19b5d678b2bb252704bbd4248c41222b7c81155246b9a30cae0';
const STYLE_SHA256 = 'a34269841fe08a874d63c8d091f9b16eadf0fd0e9622fca3ef90f93950235c58';
const ORIGINAL_PATH = "const FP_PATH = path.join(ROOT, 'fp.json');";
const SNAPSHOT_RELATIVE = 'theatre-evidence/compatibility/guards/fp-t725.json';
const ADAPTED_PATH = 'const FP_PATH = path.join(ROOT, ' + JSON.stringify(SNAPSHOT_RELATIVE) + ');';
const ARGS = Object.freeze(['--check', '--expect=bld,theatre013']);

function buildStyleAdapter013(inputs = {}) {
 const original = inputs.original ?? fs.readFileSync(path.join(ROOT, 'fp.js'), 'utf8');
 const baseline = inputs.baseline ?? fixed.baseFile('fp.json');
 const style = inputs.style ?? fs.readFileSync(path.join(ROOT, 'style.json'));
 if (fixed.hash(original) !== FP_SOURCE_SHA256 || original !== fixed.baseFile('fp.js').toString()) throw Error('Original fp.js source differs from immutable T725');
 if (fixed.hash(baseline) !== fixed.BASE_FP_SHA256 || !Buffer.from(baseline).equals(fixed.baseFile('fp.json'))) throw Error('Immutable T725 fingerprint snapshot changed');
 if (fixed.hash(style) !== STYLE_SHA256 || !Buffer.from(style).equals(fixed.baseFile('style.json'))) throw Error('Original style baseline changed');
 if (original.split(ORIGINAL_PATH).length !== 2 || original.includes(ADAPTED_PATH)) throw Error('Unique exact FP_PATH substitution required');
 const adapted = original.replace(ORIGINAL_PATH, ADAPTED_PATH);
 if (adapted.split(ADAPTED_PATH).length !== 2 || adapted.replace(ADAPTED_PATH, ORIGINAL_PATH) !== original) throw Error('Only the fingerprint input path may change');
 new vm.Script(adapted, { filename: '.theatre-style-runtime013.js' });
 const fp = JSON.parse(baseline);
 if (fp.version !== '14.29' || fp.anchor !== 'T725' || Object.keys(fp.subs).length !== 2919 || fp.stats.families !== 158 || fp.blocks.count !== 1728) throw Error('Unexpected T725 complete fingerprint inventory');
 return { original, adapted, baseline: Buffer.from(baseline), proof: {
  baselineCommit: fixed.BASE, originalFPSourceSHA256: FP_SOURCE_SHA256,
  adaptedFPSourceSHA256: fixed.hash(adapted), styleSHA256: STYLE_SHA256,
  comparisonFPSHA256: fixed.BASE_FP_SHA256, comparisonFPPath: SNAPSHOT_RELATIVE,
  originalArguments: [...ARGS], substitutions: [{ from: ORIGINAL_PATH, to: ADAPTED_PATH }],
  onlyFPPathChanged: true, originalAssertionsExact: true, originalThresholdsExact: true,
  originalStyleBaselineExact: true, originalDeclaredFamilies: ['bld', 'theatre013'],
  note: 'The original candidate declared-art gate is retained. This is not a claim that undeclared fp.js --check against the promoted baseline passes.'
 } };
}

function staticTest013() {
 const q = buildStyleAdapter013();
 const rejected = [];
 for (const [name, inputs] of [
  ['changed original assertion', { original: q.original.replace('d < -1e-6', 'd < -1') }],
  ['expanded declared-family exemption', { original: q.original.replace('if (expSet.has(k)) continue;', 'if (true) continue;') }],
  ['changed style baseline', { style: Buffer.concat([fs.readFileSync(path.join(ROOT, 'style.json')), Buffer.from(' ')] ) }],
  ['changed comparison fingerprint', { baseline: Buffer.concat([q.baseline, Buffer.from(' ')]) }],
  ['duplicate FP_PATH assignment', { original: q.original + '\n' + ORIGINAL_PATH }]
 ]) {
  let failed = false; try { buildStyleAdapter013(inputs); } catch { failed = true; }
  if (!failed) throw Error('Source/data negative was accepted: ' + name);
  rejected.push(name);
 }
 return { ok: true, sourceOnly: true, gameExecuted: false, proof: q.proof, rejected };
}

function run013() {
 if (process.argv.length !== 2) throw Error('The runtime command accepts no overrides; its original candidate arguments are fixed');
 if (process.env.GITHUB_ACTIONS !== 'true') throw Error('Style runtime runs only in authorized isolated GitHub Actions');
 const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
 if (head !== process.env.GITHUB_SHA || !/^[0-9a-f]{40}$/.test(head)) throw Error('Exact workflow-head checkout required');
 // Includes exact current product, complete approved2947 leaf/family/stat
 // records, complete1728 blocks, and exact additive release promotion.
 const native = require('./theatre-fingerprint-qa013').readPreflight013();
 const q = buildStyleAdapter013();
 const out = path.join(ROOT, 'theatre-evidence/compatibility/guards');
 const snapshot = path.join(ROOT, SNAPSHOT_RELATIVE);
 const temp = path.join(ROOT, '.theatre-style-runtime013.js');
 const trackedBefore = Object.fromEntries(['fp.js', 'style.json', 'fp.json'].map(p => [p, fs.readFileSync(path.join(ROOT, p))]));
 fs.mkdirSync(out, { recursive: true });
 fs.writeFileSync(snapshot, q.baseline);
 if (fixed.hash(fs.readFileSync(snapshot)) !== fixed.BASE_FP_SHA256) throw Error('Written immutable comparison snapshot differs');
 const audit = { ...q.proof, checkedSHA: head, sourceSHA256: native.product.sourceSHA256,
  version: native.product.version, anchor: native.product.anchor, phase: native.product.phase,
  strictApprovedNativeProof: native.proof, preflightEvidenceSHA256: native.evidenceSHA256,
  originalGateStatus: 'pending' };
 const save = () => fs.writeFileSync(path.join(out, 'style-adapter.json'), JSON.stringify(audit, null, 2));
 save();
 console.log('[Theatre013 style] Original candidate --check --expect=bld,theatre013; only FP_PATH uses pinned T725 bytes. Current-head approved2947/1728 equality passed first.');
 let result, created = false;
 try {
  fs.writeFileSync(temp, q.adapted, { flag: 'wx' });
  created = true;
  result = spawnSync(process.execPath, [temp, ...ARGS], { cwd: ROOT, env: process.env, stdio: 'inherit', timeout: 15 * 60 * 1000 });
  audit.originalGateStatus = result.error ? 'error' : result.status === 0 ? 'passed' : 'failed';
  audit.originalGateExitCode = result.status;
  if (result.error) audit.error = result.error.message;
 } finally {
  if (created) fs.rmSync(temp, { force: true });
  for (const [p, bytes] of Object.entries(trackedBefore)) if (!bytes.equals(fs.readFileSync(path.join(ROOT, p)))) throw Error('Style adapter changed a tracked source/baseline: ' + p);
  if (fixed.hash(fs.readFileSync(snapshot)) !== fixed.BASE_FP_SHA256) throw Error('Original read-only check changed its comparison snapshot');
  audit.trackedFPSourceStyleAndPromotionUnchanged = true;
  save();
 }
 if (result.error) throw result.error;
 if (result.status !== 0) process.exitCode = result.status ?? 1;
}
module.exports = { buildStyleAdapter013, staticTest013, FP_SOURCE_SHA256, STYLE_SHA256, ORIGINAL_PATH, ADAPTED_PATH, ARGS };
if (require.main === module) {
 if (process.argv.length === 3 && process.argv[2] === '--static-test') console.log(JSON.stringify(staticTest013(), null, 2));
 else run013();
}
