'use strict';
// T791 U6：讀檔時清掉舊存檔殘留那一段的守衛轉接。比照 T790（newworld-reset790.test.cjs）：
// 那一段改、刪、重複，或別的原生改動，projectCandidate052 首紅都是 S01 byte-exact；逆轉在自己的輸出上是不動點。
// 注意：把那兩行「整段拿掉、還原成原本的錨點」就等於修正前的原生頁，052 守衛照樣會過——那由這裡第 1、2 條與行為探測（probeLoadStale791.cjs）負責。
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs');
const changes = require('./loadstale791-projection.json');
const { normalizeLoadStale791 } = require('./loadstale791-projection.cjs');
const { projectCandidate052 } = require('./single-research052-source.cjs');
const candidate = fs.readFileSync(__dirname + '/index.html', 'utf8');
const c = changes[0];

test('T791 exact inverse: the segment is present exactly once, reverts to its anchor, and the inverse is a fixed point', () => {
  assert.equal(changes.length, 1);
  assert.equal(candidate.split(c.after).length, 2, 'segment present exactly once');
  assert.ok(c.after.startsWith(c.before) && c.after.length > c.before.length, 'segment is the anchor plus the inserted lines');
  const out = normalizeLoadStale791(candidate);
  assert.equal(out.split(c.after).length, 1, 'segment reverted');
  assert.equal(out.length, candidate.length - (c.after.length - c.before.length));
  assert.equal(normalizeLoadStale791(out), out, 'inverse is a fixed point on its own output');
  assert.doesNotThrow(() => projectCandidate052(candidate));
});

test('T791 segment follows the native fiscal load call, resets only the five fiscal cadence days, and uses the 14-day threshold', () => {
  assert.match(c.before, /^    fiscalLoad515\(d\.fiscal515,d\.fiscal515==null\);/);
  const inserted = c.after.slice(c.before.length);
  assert.match(inserted, /\n    \{const late791=Math\.max\(fiscal515\.lastAggregateDay,fiscal515\.lastBacklogDay,fiscal515\.lastSettlementDay,fiscal515\.lastAssetScanDay,fiscal515\.lastCompletionScanDay\)-day;if\(late791>14\)fiscal515\.lastAggregateDay=fiscal515\.lastBacklogDay=fiscal515\.lastSettlementDay=fiscal515\.lastAssetScanDay=fiscal515\.lastCompletionScanDay=-999;if\(observatory514\.lastSampleDay-day>14\)observatoryReset514\(\);\}\n$/);
  assert.equal(candidate.split('const late791=').length, 2, 'T791 name used exactly once');
});

test('T791 altered/removed/duplicated segment fails the historical guard first', () => {
  for (const after of ['', c.after + c.after, c.after.replace('late791>14', 'late791>15'), c.after.replace('fiscal515.lastSettlementDay=fiscal515.lastAssetScanDay=', 'fiscal515.lastAssetScanDay='), c.after.replace('=-999;if(observatory514', '=-998;if(observatory514'),
    c.after.replace('if(observatory514.lastSampleDay-day>14)observatoryReset514();', ''), c.after + ' ']) {
    assert.throws(() => projectCandidate052(candidate.replace(c.after, after)), /S01 byte-exact T776 native input/);
  }
});

test('T791 unrelated native edits are not discarded by the inverse', () => {
  for (const mutant of [candidate + '\n<!-- unauthorized -->', candidate.replace('function mulberry32(a){', 'function mulberry32(a){/*bad*/'),
    candidate.replace(c.after, c.after + 'const __probe791=1;\n')]) {
    assert.throws(() => projectCandidate052(mutant), /S01 byte-exact T776 native input/);
  }
});

test('T791 reverting the segment to the bare anchor is the pre-fix native page (052 guard cannot see it; tests 1-2 and the behaviour probe must)', () => {
  const reverted = candidate.replace(c.after, c.before);
  assert.doesNotThrow(() => projectCandidate052(reverted));
  assert.equal(projectCandidate052(reverted), projectCandidate052(candidate));
});
