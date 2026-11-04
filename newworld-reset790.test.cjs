'use strict';
// T790 V6：開新城成對重置那一段的守衛轉接。比照 #71 的單段 C4 對照測試（nearest-nodes053.test.cjs）：
// 那一段改、刪、重複，或別的原生改動，projectCandidate052 首紅都是 S01 byte-exact；逆轉在自己的輸出上是不動點。
// 注意：把那一行包裝「整行拿掉、還原成原本的錨點」就等於修正前的原生頁，守衛照樣會過——那是行為檢查（probeNewWorldReset790.cjs）的事。
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs');
const changes = require('./newworld-reset790-projection.json');
const { normalizeNewWorldReset790 } = require('./newworld-reset790-projection.cjs');
const { projectCandidate052 } = require('./single-research052-source.cjs');
const candidate = fs.readFileSync(__dirname + '/index.html', 'utf8');
const c = changes[0];

test('T790 exact inverse: the segment is present exactly once, reverts to its anchor, and the inverse is a fixed point', () => {
  assert.equal(changes.length, 1);
  assert.equal(candidate.split(c.after).length, 2, 'segment present exactly once');
  assert.ok(c.after.startsWith(c.before) && c.after.length > c.before.length, 'segment is the anchor plus one inserted wrapper');
  const out = normalizeNewWorldReset790(candidate);
  assert.equal(out.split(c.after).length, 1, 'segment reverted');
  assert.equal(out.length, candidate.length - (c.after.length - c.before.length));
  assert.equal(normalizeNewWorldReset790(out), out, 'inverse is a fixed point on its own output');
  assert.doesNotThrow(() => projectCandidate052(candidate));
});

test('T790 wrapper follows the native T501–T513 pattern and resets after the inner newWorld returns', () => {
  const inserted = c.after.slice(c.before.length);
  assert.match(inserted, /const __newWorld_513=newWorld;newWorld=function\(\.\.\.a\)\{const r=__newWorld_513\(\.\.\.a\);observatoryReset514\(\);fiscalReset515\(\);return r;\};\n$/);
  assert.equal(candidate.split('const __newWorld_513=').length, 2, 'wrapper name used exactly once');
});

test('T790 altered/removed/duplicated segment fails the historical guard first', () => {
  for (const after of ['', c.after + c.after, c.after.replace('fiscalReset515();return r;', 'return r;'), c.after.replace('observatoryReset514();', ''), c.after + ' ']) {
    assert.throws(() => projectCandidate052(candidate.replace(c.after, after)), /S01 byte-exact T776 native input/);
  }
});

test('T790 unrelated native edits are not discarded by the inverse', () => {
  for (const mutant of [candidate + '\n<!-- unauthorized -->', candidate.replace('function mulberry32(a){', 'function mulberry32(a){/*bad*/'),
    candidate.replace(c.after, c.after + 'const __probe790=1;\n')]) {
    assert.throws(() => projectCandidate052(mutant), /S01 byte-exact T776 native input/);
  }
});

test('T790 reverting the wrapper to the bare anchor is the pre-fix native page (guard cannot see it; behaviour probe must)', () => {
  const reverted = candidate.replace(c.after, c.before);
  assert.doesNotThrow(() => projectCandidate052(reverted));
  assert.equal(projectCandidate052(reverted), projectCandidate052(candidate));
});
