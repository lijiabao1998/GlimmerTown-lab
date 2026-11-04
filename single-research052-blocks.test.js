'use strict';
/* T785 R2：052 投影器擴充（業主 2026-11-04 批准）的負控制（不用 Chrome）。
 * 053／054／055／057 每一塊都故意改壞，斷言首紅落在該塊自己的斷言；區塊順序或縫隙改壞，紅在合併邊界；
 * 052 區被搬離原插入點（不論四塊在不在），紅在合併邊界（既有 052 測試 moved 突變的首紅不能變）；
 * 原樣必須通過，且剝掉五塊後等於原生基準。
 * 用法：node single-research052-blocks.test.js
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = __dirname;
const SOURCE = path.join(ROOT, 'single-research052-source.cjs');
const S = require(SOURCE);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const BLOCKS = [
  ['053', '/* DSK-018 ROAD DELIVERY 053 BEGIN */', '/* DSK-018 ROAD DELIVERY 053 END */', 'road-delivery053-runtime.js', S.block053],
  ['054', '/* DSK-019 RAIL FREIGHT 054 BEGIN */', '/* DSK-019 RAIL FREIGHT 054 END */', 'rail-freight054-runtime.js', S.block054],
  ['055', '/* DSK-020 RAIL BLOCK 055 BEGIN */', '/* DSK-020 RAIL BLOCK 055 END */', 'rail-block055-runtime.js', S.block055],
  ['057', '/* DSK-025 INTERMODAL 057 BEGIN */', '/* DSK-025 INTERMODAL 057 END */', 'intermodal057-runtime.js', S.block057],
];

let checks = 0;
const ok = (name, fn) => { fn(); checks++; console.log('  ok  ' + name); };
const firstRed = (candidate) => { try { S.stripPinned052(candidate); return null; } catch (e) { return e.message.split('\n')[0]; } };
const once = (s, a, b) => { assert.equal(s.split(a).length, 2, 'mutation anchor must be unique: ' + a.slice(0, 40)); return s.replace(a, b); };

ok('原樣通過，剝掉五塊後等於原生基準', () => {
  assert.equal(firstRed(html), null);
  assert.equal(S.hash(S.projectCandidate052(html)), S.baseline);
});

for (const [n, begin, end, , body] of BLOCKS) {
  ok(n + ' 內文改一個字 → 紅在 S01 unchanged' + n + ' block', () => {
    const mid = body.length >> 1;
    const mutated = once(html, body, body.slice(0, mid) + (body[mid] === ' ' ? '\t' : ' ') + body.slice(mid + 1));
    assert.equal(firstRed(mutated), 'S01 unchanged' + n + ' block');
  });
  ok(n + ' 多一個開頭標記 → 紅在 S01 unique' + n + ' begin', () => {
    assert.equal(firstRed(html + '\n// ' + begin + '\n'), 'S01 unique' + n + ' begin');
  });
  ok(n + ' 多一個結尾標記 → 紅在 S01 unique' + n + ' end', () => {
    assert.equal(firstRed(html + '\n// ' + end + '\n'), 'S01 unique' + n + ' end');
  });
}

ok('053 與 054 對調順序 → 紅在 S01 exact052 insertion boundary', () => {
  const w = (b, e, body) => b + '\n' + body + '\n' + e + '\n';
  const a = w(BLOCKS[0][1], BLOCKS[0][2], BLOCKS[0][4]), b = w(BLOCKS[1][1], BLOCKS[1][2], BLOCKS[1][4]);
  assert.equal(firstRed(once(html, a + b, b + a)), 'S01 exact052 insertion boundary');
});

ok('052 區搬到檔尾、四塊也不在（既有 052 測試的 moved 突變）→ 紅在 S01 exact052 insertion boundary', () => {
  assert.equal(firstRed(S.stripPinned052(html) + S.block), 'S01 exact052 insertion boundary');
});

ok('只把 052 區搬到檔尾、四塊留在原處 → 紅在 S01 exact052 insertion boundary', () => {
  assert.equal(firstRed(once(html, S.block, '') + S.block), 'S01 exact052 insertion boundary');
});

ok('兩塊之間塞一個字 → 紅在 S01 exact052 insertion boundary', () => {
  const seam = BLOCKS[1][2] + '\n' + BLOCKS[2][1];
  assert.equal(firstRed(once(html, seam, BLOCKS[1][2] + '\n;' + BLOCKS[2][1])), 'S01 exact052 insertion boundary');
});

for (const [n, , , file] of BLOCKS) {
  ok(n + ' 執行檔本身被改 → 載入時紅在 S01 pinned' + n + ' shipping block', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lab785-pin-'));
    try {
      for (const f of ['single-research052-source.cjs', 'single-research052.js', 'road-delivery053-runtime.js', 'rail-freight054-runtime.js', 'rail-block055-runtime.js', 'intermodal057-runtime.js']) fs.copyFileSync(path.join(ROOT, f), path.join(dir, f));
      fs.appendFileSync(path.join(dir, file), '\n// mutated\n');
      let red = null;
      try { require(path.join(dir, 'single-research052-source.cjs')); } catch (e) { red = e.message.split('\n')[0]; }
      assert.equal(red, 'S01 pinned' + n + ' shipping block');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

console.log('\nSINGLE052_BLOCKS ' + JSON.stringify({ checks, ok: true }));
