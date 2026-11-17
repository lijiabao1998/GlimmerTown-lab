'use strict';
// T793 C7：新城沒有零售時商業需求退回既有公式那一段的守衛轉接。比照 T790～T792（newworld-reset790.test.cjs、loadstale791.test.cjs、bootcpu792.test.cjs）：
// 那一段改、刪、重複，或別的原生改動，projectCandidate052 首紅都是 S01 byte-exact；逆轉在自己的輸出上是不動點。
// 注意：把那一段「整段拿掉、還原成原本的錨點」就等於修正前的原生頁，052 守衛照樣會過——那由這裡第 1、2 條、
// 頁面裡的常駐自檢 comBootSelftest793（smoke 名 comBoot793）與真 Chrome 探測 probeComBoot793.cjs 負責。
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs');
const changes = require('./comboot793-projection.json');
const { normalizeComBoot793 } = require('./comboot793-projection.cjs');
const { projectCandidate052 } = require('./single-research052-source.cjs');
const candidate = fs.readFileSync(__dirname + '/index.html', 'utf8');
const c = changes[0];

test('T793 exact inverse: the segment is present exactly once, reverts to its anchor, and the inverse is a fixed point', () => {
  assert.equal(changes.length, 1);
  assert.equal(candidate.split(c.after).length, 2, 'segment present exactly once');
  assert.ok(c.after.startsWith(c.before) && c.after.length > c.before.length, 'segment is the anchor plus the inserted lines');
  const out = normalizeComBoot793(candidate);
  assert.equal(out.split(c.after).length, 1, 'segment reverted');
  assert.equal(out.length, candidate.length - (c.after.length - c.before.length));
  assert.equal(normalizeComBoot793(out), out, 'inverse is a fixed point on its own output');
  assert.doesNotThrow(() => projectCandidate052(candidate));
});

test('T793 segment follows economyDemands481, wraps it once, replaces only c when there is no retail, and keeps both valves', () => {
  assert.match(c.before, /^function economyDemands481\(legacyR,legacyC,legacyI,laborNow\)\{[^\n]*\}return\{r,c,i\};\}\n$/);
  const inserted = c.after.slice(c.before.length);
  assert.match(inserted, /^\/\/ T793（/);
  assert.match(inserted, /\nconst __economyDemands481_793=economyDemands481;economyDemands481=function\(legacyR,legacyC,legacyI,laborNow\)\{\n/);
  assert.match(inserted, /\n  const o=__economyDemands481_793\(legacyR,legacyC,legacyI,laborNow\);\n/);
  assert.match(inserted, /let off=!!window\.__noComBoot793;try\{off=off\|\|sessionStorage\.getItem\('glimmerville\.noComBoot793'\)==='1';\}catch\(e\)\{\}\n/);
  assert.match(inserted, /\n  if\(off\|\|!economy481\.ready\|\|\(economy481\.consumption\.retailCapacity\|\|0\)>0\)return o;\n/);
  assert.match(inserted, /\n  return \{r:o\.r,c:legacyC,i:o\.i\};\n\};\n/);
  assert.match(inserted, /\nwindow\.comBootSelftest793=function\(\)\{/);
  assert.equal(candidate.split('const __economyDemands481_793=').length, 2, 'wrapper name used exactly once');
  assert.equal(candidate.split('economyDemands481(legacyR481,legacyC481,legacyI481,laborNow481)').length, 2, 'the daily tick still calls it exactly once');
  assert.ok(candidate.indexOf('economyDemands481(legacyR481,legacyC481,legacyI481,laborNow481)') > candidate.indexOf(c.after), 'the only call comes after the wrapper');
});

test('T793 altered/removed/duplicated segment fails the historical guard first', () => {
  for (const after of ['', c.after + c.after, c.after.replace('c:legacyC,i:o.i', 'c:o.c,i:o.i'), c.after.replace('||(economy481.consumption.retailCapacity||0)>0', ''),
    c.after.replace("sessionStorage.getItem('glimmerville.noComBoot793')==='1'", "sessionStorage.getItem('glimmerville.noComBoot793')==='0'"),
    c.after.replace('if(off||!economy481.ready||', 'if(!economy481.ready||'), c.after + ' ']) {
    assert.notEqual(after, c.after);
    assert.throws(() => projectCandidate052(candidate.replace(c.after, after)), /S01 byte-exact T776 native input/);
  }
});

test('T793 unrelated native edits are not discarded by the inverse', () => {
  for (const mutant of [candidate + '\n<!-- unauthorized -->', candidate.replace('function mulberry32(a){', 'function mulberry32(a){/*bad*/'),
    candidate.replace(c.after, c.after + 'const __probe793=1;\n')]) {
    assert.throws(() => projectCandidate052(mutant), /S01 byte-exact T776 native input/);
  }
});

test('T793 reverting the segment to the bare anchor is the pre-change native page (052 guard cannot see it; tests 1-2, the page self-test and the Chrome probe must)', () => {
  const reverted = candidate.replace(c.after, c.before);
  assert.doesNotThrow(() => projectCandidate052(reverted));
  assert.equal(projectCandidate052(reverted), projectCandidate052(candidate));
});
