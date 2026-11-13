'use strict';
// T792 B5：開機烘焙畫布留在 CPU 那一段的守衛轉接。比照 T790、T791（newworld-reset790.test.cjs、loadstale791.test.cjs）：
// 那一段改、刪、重複，或別的原生改動，projectCandidate052 首紅都是 S01 byte-exact；逆轉在自己的輸出上是不動點。
// 注意：把那一段「整段拿掉、還原成原本的錨點」就等於修正前的原生頁，052 守衛照樣會過——那由這裡第 1、2 條、
// 頁面裡的常駐自檢 bootCpuSelftest792（smoke 名 bootCpu792）與真 Chrome 探測 probeBootCpu792.cjs 負責。
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs');
const changes = require('./bootcpu792-projection.json');
const { normalizeBootCpu792 } = require('./bootcpu792-projection.cjs');
const { projectCandidate052 } = require('./single-research052-source.cjs');
const candidate = fs.readFileSync(__dirname + '/index.html', 'utf8');
const c = changes[0];

test('T792 exact inverse: the segment is present exactly once, reverts to its anchor, and the inverse is a fixed point', () => {
  assert.equal(changes.length, 1);
  assert.equal(candidate.split(c.after).length, 2, 'segment present exactly once');
  assert.ok(c.after.startsWith(c.before) && c.after.length > c.before.length, 'segment is the anchor plus the inserted lines');
  const out = normalizeBootCpu792(candidate);
  assert.equal(out.split(c.after).length, 1, 'segment reverted');
  assert.equal(out.length, candidate.length - (c.after.length - c.before.length));
  assert.equal(normalizeBootCpu792(out), out, 'inverse is a fixed point on its own output');
  assert.doesNotThrow(() => projectCandidate052(candidate));
});

test('T792 segment follows the end of bootstrap453, wraps it once, tags only detached 2d canvases and restores getContext', () => {
  assert.match(c.before, /^    const note=\$\('#boot453Note'\);[^\n]*\n  \}\n\}\n$/);
  const inserted = c.after.slice(c.before.length);
  assert.match(inserted, /\nconst __bootstrap453_792=bootstrap453;bootstrap453=async function\(\.\.\.a\)\{\n/);
  assert.match(inserted, /if\(off\)return __bootstrap453_792\(\.\.\.a\);\n/);
  assert.match(inserted, /if\(!live\|\|type!=='2d'\|\|this\.isConnected\)return gc\.apply\(this,arguments\);\n/);
  assert.match(inserted, /return gc\.call\(this,type,Object\.assign\(\{\},opt,\{willReadFrequently:true\}\)\);\n/);
  assert.match(inserted, /try\{return await __bootstrap453_792\(\.\.\.a\);\}finally\{live=false;if\(P\.getContext===wrap\)P\.getContext=gc;st\.restored=P\.getContext!==wrap;\}\n\};\n/);
  assert.match(inserted, /\nwindow\.bootCpuSelftest792=function\(\)\{/);
  assert.equal(candidate.split('const __bootstrap453_792=').length, 2, 'wrapper name used exactly once');
  assert.equal(candidate.split('\nbootstrap453();\n').length, 2, 'bootstrap453 is still called exactly once');
  assert.ok(candidate.indexOf('\nbootstrap453();\n') > candidate.indexOf(c.after), 'the only call comes after the wrapper');
});

test('T792 altered/removed/duplicated segment fails the historical guard first', () => {
  for (const after of ['', c.after + c.after, c.after.replace('{willReadFrequently:true})', '{willReadFrequently:false})'), c.after.replace("||this.isConnected", ''),
    c.after.replace('finally{live=false;', 'finally{'), c.after.replace("if(off)return __bootstrap453_792(...a);\n", ''), c.after + ' ']) {
    assert.notEqual(after, c.after);
    assert.throws(() => projectCandidate052(candidate.replace(c.after, after)), /S01 byte-exact T776 native input/);
  }
});

test('T792 unrelated native edits are not discarded by the inverse', () => {
  for (const mutant of [candidate + '\n<!-- unauthorized -->', candidate.replace('function mulberry32(a){', 'function mulberry32(a){/*bad*/'),
    candidate.replace(c.after, c.after + 'const __probe792=1;\n')]) {
    assert.throws(() => projectCandidate052(mutant), /S01 byte-exact T776 native input/);
  }
});

test('T792 reverting the segment to the bare anchor is the pre-change native page (052 guard cannot see it; tests 1-2, the page self-test and the Chrome probe must)', () => {
  const reverted = candidate.replace(c.after, c.before);
  assert.doesNotThrow(() => projectCandidate052(reverted));
  assert.equal(projectCandidate052(reverted), projectCandidate052(candidate));
});
