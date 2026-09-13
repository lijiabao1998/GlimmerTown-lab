#!/usr/bin/env node
/* 微光小鎮 實驗線 — 指紋台 fp.js（零依賴，骨架：harness.js）
 *
 * 為什麼要有它：這條線 crc32 命中 0 ⇒ 沒有任何機制能證明「我只改了卡面宣告的那一族」。
 * 美術要能無限迭代而不靜默誤傷，必須先有指紋差。
 *
 * 做什麼：無頭烘焙整份 SPR，逐家族（頂層鍵）與逐葉子（子家族）算 CRC32，dump 成 fp.json。
 *
 * 用法：
 *   node fp.js                 產生／更新 fp.json，並印出與舊版的差異
 *   node fp.js --check         只比對、不寫檔；有差異就 exit 1（每輪驗收用）
 *   node fp.js --inventory     印盤點表（家族大小、夜圖覆蓋率、自基線以來未動的家族）
 *   node fp.js --expect=a,b,c  宣告本輪應該變動的家族；指紋差必須恰好等於這份清單，否則紅
 *
 * 邊界：自用埠 8199；進城前一律設 slot=3，不碰業主存檔。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PORT = +arg('port', 8199);
const FP_PATH = path.join(ROOT, 'fp.json');
const CHECK = process.argv.includes('--check');
const INVENTORY = process.argv.includes('--inventory');
const EXPECT = arg('expect', '').split(',').map(s => s.trim()).filter(Boolean);

function loadBaseline() {
  try { return JSON.parse(fs.readFileSync(FP_PATH, 'utf8')); } catch { return null; }
}

function diffFp(base, cur) {
  const added = [], removed = [], changed = [];
  const bk = Object.keys(base.subs || {}), ck = Object.keys(cur.subs || {});
  const bset = new Set(bk), cset = new Set(ck);
  for (const k of ck) if (!bset.has(k)) added.push(k);
  for (const k of bk) if (!cset.has(k)) removed.push(k);
  for (const k of ck) {
    if (!bset.has(k)) continue;
    const a = base.subs[k], b = cur.subs[k];
    if (a.d !== b.d || a.n !== b.n || a.w !== b.w || a.h !== b.h) changed.push(k);
  }
  const famChanged = [];
  for (const k of Object.keys(cur.families || {})) {
    const a = (base.families || {})[k], b = cur.families[k];
    if (!a || a.crc !== b.crc) famChanged.push(k);
  }
  return { added, removed, changed, famChanged };
}

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 指紋台 ===');

  const session = await withGame({ port: PORT, timeout: 300, log, fresh: true }, async ({ cdp }) => {   // fresh：乾淨新城市，季節固定 ⇒ 指紋可重現
    const meta = await cdp.evalJs(`(window.GV && window.GV.build534) ? window.GV.build534() : {}`);
    const fp = await cdp.evalJs(`(window.GV && window.GV.fp536) ? window.GV.fp536() : {ok:false,err:'fp536 不存在'}`);
    if (!fp || !fp.ok) throw new Error('指紋失敗: ' + JSON.stringify(fp && (fp.err || fp.skipped || fp)));
    return { meta, fp };
  });

  if (!session.result) {
    console.log('X 紅燈：' + session.fails.join(' / '));
    process.exit(1);
  }

  const { meta, fp } = session.result;
  const cur = {
    generatedAt: new Date().toISOString(),
    version: meta.version || '?',
    anchor: meta.anchor || '?',
    stats: fp.stats,
    families: fp.families,
    subs: fp.subs,
  };

  log('版本 ' + cur.version + ' / ' + cur.anchor);
  log('家族 ' + fp.stats.families + ' 個、葉子 ' + fp.stats.leaves + ' 片');
  log('非空日圖 ' + fp.stats.dayNonEmpty + '、有夜圖 ' + fp.stats.nightNonEmpty
    + '、夜空畫布 ' + fp.stats.nightEmptyCanvas);
  const cov = fp.stats.dayNonEmpty ? (fp.stats.nightNonEmpty / fp.stats.dayNonEmpty * 100) : 0;
  log('夜圖覆蓋率 ' + cov.toFixed(1) + '%');

  const base = loadBaseline();
  if (base) {
    const d = diffFp(base, cur);
    const famTouched = [...new Set(d.famChanged)];
    log('');
    log('與 fp.json（' + (base.anchor || '?') + ' ' + (base.version || '?') + '）相比：');
    log('  新增 ' + d.added.length + ' / 變更 ' + d.changed.length + ' / 移除 ' + d.removed.length
      + ' / 觸及家族 ' + famTouched.length + '（其餘 ' + (fp.stats.families - famTouched.length) + ' 族零變動）');
    if (famTouched.length) log('  觸及：' + famTouched.slice(0, 40).join(', ') + (famTouched.length > 40 ? ' …' : ''));
    if (d.added.length) log('  新增葉子：' + d.added.slice(0, 8).join(', ') + (d.added.length > 8 ? ' …' : ''));
    if (d.changed.length) log('  變更葉子：' + d.changed.slice(0, 8).join(', ') + (d.changed.length > 8 ? ' …' : ''));
    if (d.removed.length) log('  移除葉子：' + d.removed.slice(0, 8).join(', ') + (d.removed.length > 8 ? ' …' : ''));

    /* 每輪驗收：指紋差必須恰好等於卡面宣告的家族清單 */
    if (EXPECT.length) {
      const expectSet = new Set(EXPECT);
      const unexpected = famTouched.filter(f => !expectSet.has(f));
      const missing = EXPECT.filter(f => !famTouched.includes(f));
      log('');
      log('宣稱變動家族：' + EXPECT.join(', '));
      if (unexpected.length) log('  X 多改了：' + unexpected.join(', '));
      if (missing.length) log('  X 宣告了但沒動：' + missing.join(', '));
      if (unexpected.length || missing.length) {
        console.log('X 指紋差與宣告不符');
        process.exit(1);
      }
      log('  OK 指紋差 == 宣告清單');
    } else if (CHECK) {
      const any = famTouched.length > 0;
      if (any) { console.log('X --check：指紋有變動（未宣告）'); process.exit(1); }
      log('  OK --check：零變動');
    }
  } else {
    log('');
    log('（尚未有 fp.json，這是基線）');
  }

  if (!CHECK) {
    fs.writeFileSync(FP_PATH, JSON.stringify(cur, null, 1));
    log('');
    log('已寫入 fp.json');
  }

  if (INVENTORY) {
    const fams = Object.entries(cur.families).sort((a, b) => b[1].leaves - a[1].leaves);
    log('');
    log('--- 盤點：家族大小前 25 ---');
    for (const [k, v] of fams.slice(0, 25)) {
      log('  ' + k.padEnd(22) + ' 葉子 ' + String(v.leaves).padStart(4)
        + '  夜圖 ' + String(v.night).padStart(4) + '  不透明像素 ' + v.op);
    }
    log('');
    log('--- 盤點：完全沒有夜圖的家族（葉子 ≥ 4）---');
    const noNight = fams.filter(([, v]) => v.night === 0 && v.leaves >= 4).map(([k, v]) => k + '(' + v.leaves + ')');
    log('  ' + (noNight.length ? noNight.join(', ') : '（無）'));
    log('  共 ' + noNight.length + ' 族完全無夜圖');
  }

  console.log('');
  console.log('OK 指紋台完成（' + session.seconds.toFixed(1) + 's）');
  process.exit(0);
})().catch(e => { console.error('X 指紋台失敗: ' + e.message); process.exit(1); });
