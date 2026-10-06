#!/usr/bin/env node
'use strict';
// Static/source and JSON-data tests only. Never require harness or run a game.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const adapter = require('./gardenlife-style016');
const { buildStyleAdapter014, staticTest014 } = adapter;
const q = buildStyleAdapter014(), source = staticTest014();
assert.deepEqual(adapter.ARGS, ['--check', '--expect=bld,complexes014,streetscape015,gardenLife016']);
assert.equal(q.adapted.replace(adapter.ADAPTED_PATH, adapter.ORIGINAL_PATH), q.original);
assert.equal(q.proof.substitutions.length, 1);
// Exercise the exact original ratchet loop as pure data logic, preserving its
// original tolerance and family declaration rule. These scores are synthetic.
const start = '      const expSet = new Set(EXPECT);';
const end = "      log('');";
const a = q.original.indexOf(start), b = q.original.indexOf(end, a);
assert(a >= 0 && b > a);
const ratchet = q.original.slice(a, b);
assert.equal(q.adapted.slice(q.adapted.indexOf(start), q.adapted.indexOf(end, q.adapted.indexOf(start))), ratchet);
function drops(expect, totals, previous) {
 const context = { EXPECT: expect, famNames: Object.keys(totals), curStyle: Object.fromEntries(Object.entries(totals).map(([k, total]) => [k, { total }])), prevStyle: { families: Object.fromEntries(Object.entries(previous).map(([k, total]) => [k, { total }])) } };
 new vm.Script(ratchet + '\nglobalThis.result = drops;').runInNewContext(context);
 return Array.from(context.result);
}
const prior = { bld: 0.9653, grass: 0.8 };
assert.deepEqual(drops(['bld', 'complexes014'], { bld: 0.9651, grass: 0.8, complexes014: 0.5 }, prior), []);
assert.equal(drops([], { bld: 0.9651, grass: 0.8 }, prior).length, 1);
assert.equal(drops(['bld', 'complexes014'], { bld: 0.9651, grass: 0.79 }, prior).length, 1);
assert.equal(drops(['bld', 'complexes014'], { bld: 0.9651, grass: 0.799998 }, prior).length, 1);
assert.equal(drops(['bld', 'complexes014'], { bld: 0.9651, grass: 0.7999995 }, prior).length, 0);
const result = { ok: true, gameExecuted: false, sourceNegatives: source.rejected, exactOriginalRatchetCases: 5,
 sourceOnly: true, nativeEvidenceJSONTested: false };
// Optional independently downloaded original CI data tests the required full
// immutable-prior inventory check without impersonating Actions or invoking native execution.
if (process.argv[2]) {
 const native = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
 const { verifyFingerprint016:verifyFingerprint014 } = require('./gardenlife-fingerprint016');
 const { expectedAdditions } = require('./gardenlife-static-contract016');
 const oldKey = Object.keys(native.fp.subs).find(k => !expectedAdditions.includes(k));
 const newKey = expectedAdditions[0], blockKey = Object.keys(native.blocks.entries)[0];
 const proof = verifyFingerprint014(native.fp, native.blocks);
 assert.equal(proof.oldCompleteRecordsExact, true);
 assert.equal(proof.newArtAwaitingOwnerImageApproval, !proof.release);
 if(proof.release)assert.equal(proof.approvedNativeRecordsExact,true);
 assert.equal(proof.completeBlockRecordsExact, true);
 const rejected = [];
 const cases = [
  ['old leaf full-record mutation', d => { d.fp.subs[oldKey].op++; }],
  ['old leaf deleted', d => { delete d.fp.subs[oldKey]; }],
  ['extra declared-family leaf', d => { d.fp.subs['bld.unapproved_extra'] = structuredClone(d.fp.subs[newKey]); }],
  ['new leaf mutation without rebuilt aggregate', d => { d.fp.subs[newKey].d = '00000000'; }],
  ['family CRC mutation', d => { d.fp.families.grass.crc = '00000000'; }],
  ['complete stats mutation', d => { d.fp.stats.leaves++; }],
  ['block family mutation', d => { d.blocks.fam = '00000000'; }],
  ['block count mutation', d => { d.blocks.count--; }],
  ['complete block record mutation', d => { d.blocks.entries[blockKey] = { unapproved: true }; }]
 ];
 for (const [name, mutate] of cases) {
  const data = structuredClone(native); mutate(data);
  assert.throws(() => verifyFingerprint014(data.fp, data.blocks), undefined, name);
  rejected.push(name);
 }
 result.nativeEvidenceJSONTested = true;
 result.strictNativeDataProof = proof;
 result.nativeDataNegatives = rejected;
}
console.log(JSON.stringify(result, null, 2));
