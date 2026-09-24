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
 *   node fp.js --record-env=a.b,c.d  T631：把列出的、目前確實與基線不同的葉子，登記成「本平台環境差」（只改 fp.json 的 envLeaves）
 *   node fp.js --pre="<JS>"    T631：測試用，進城前先執行一段 JS（守衛測試故意改壞東西）
 *
 * T631：fp.json 的葉子是業主 Windows 本機烘的；雲端 Linux 有幾葉因字型繪製永遠不同。envLeaves 登記「這個平台上這幾葉的
 * 正確樣子」：葉子與基線不同、但完全等於本平台登記值，就算已登記環境差（登記值本身變了照樣算真變動）。
 * --check 不再提早退出：葉子差、超街區指紋（block559）、七軸棘輪全部跑完、全部印出，最後才判定紅綠。
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
const RECORD_ENV = arg('record-env', '').split(',').map(s => s.trim()).filter(Boolean);   // T631
const PRE = arg('pre', '');                                                                  // T631：測試用
const PLATFORM = process.platform;

const STYLE_PATH = path.join(ROOT, 'style.json');

/* ===== 七軸計分（定義集中在此，業主可改規則而不必動遊戲檔） =====
   注意：①④⑤ 的滿分門檻是「業界慣例值」，不是 TheoTown 實測值
   （TheoTown 未公開調色上限與道具密度 ⇒ 見 docs/STYLE-THEOTOWN.md §6/§7）。
   因此這三軸只做**自我棘輪**，不做與 TheoTown 的絕對比對。 */
function scoreFamily(f) {
  const L = Math.max(1, f.leaves), op = Math.max(1, f.op);
  const meanColors = f.colors / L;
  const meanBuckets = f.buckets / L;
  const richPer100 = (f.colors / op) * 100;
  const semiRatio = f.semi / op;
  const nightLeafFrac = f.nightLeaves / L;
  const compliance = f.nightOp > 0 ? 1 - (f.nightViol / f.nightOp) : 1;
  const axes = {
    palette:   Math.min(1, meanColors / 16),                     // ① 調色深度
    hardEdge:  Math.max(0, 1 - Math.min(1, semiRatio * 20)),     // ② 日層硬邊（夜層另計）
    lightDir:  f.leftLit / L,                                    // ③ 受光方向一致
    shade:     Math.max(0, Math.min(1, (meanBuckets - 2) / 4)),  // ④ 陰影階數
    density:   Math.min(1, richPer100 / 4),                      // ⑤ 細節密度
    nightRule: 0.5 * nightLeafFrac + 0.5 * compliance,           // ⑥ 夜圖規約
    variants:  Math.min(1, f.leaves / 8),                        // ⑦ 變體數
  };
  const total = Object.values(axes).reduce((a, b) => a + b, 0) / 7;
  return { axes: axes, total: total };
}
function buildStyle(raw) {
  const out = {};
  for (const k of Object.keys(raw.families)) {
    const f = raw.families[k];
    const sc = scoreFamily(f);
    out[k] = { leaves: f.leaves, op: f.op, raw: f, axes: sc.axes, total: +sc.total.toFixed(4) };
  }
  return out;
}
function loadJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

function loadBaseline() {
  try { return JSON.parse(fs.readFileSync(FP_PATH, 'utf8')); } catch { return null; }
}

const sameLeaf = (a, b) => !!a && !!b && a.d === b.d && a.n === b.n && a.w === b.w && a.h === b.h;
function diffFp(base, cur) {
  const env = (base.envLeaves && base.envLeaves[PLATFORM]) || {};   // T631：本平台登記的環境差
  const added = [], removed = [], changed = [], envMatched = [];
  const bk = Object.keys(base.subs || {}), ck = Object.keys(cur.subs || {});
  const bset = new Set(bk), cset = new Set(ck);
  for (const k of ck) if (!bset.has(k)) added.push(k);
  for (const k of bk) if (!cset.has(k)) removed.push(k);
  for (const k of ck) {
    if (!bset.has(k)) continue;
    const a = base.subs[k], b = cur.subs[k];
    if (a.d !== b.d || a.n !== b.n || a.w !== b.w || a.h !== b.h) {
      if (sameLeaf(env[k], b)) envMatched.push(k);   // 與基線不同、但完全等於本平台登記值
      else changed.push(k);
    }
  }
  const famOf = k => k.split('.')[0];
  const explained = new Set(envMatched.map(famOf)), dirty = new Set([...added, ...removed, ...changed].map(famOf));
  const famChanged = [];
  for (const k of Object.keys(cur.families || {})) {
    const a = (base.families || {})[k], b = cur.families[k];
    if (!a || a.crc !== b.crc) { if (explained.has(k) && !dirty.has(k)) continue; famChanged.push(k); }   // 只有已登記環境差的家族不算觸及
  }
  return { added, removed, changed, famChanged, envMatched };
}

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 指紋台 ===');

  const NOSILL = process.argv.includes('--nosill');   // 嚴謹 A/B：關掉 T539 窗台重建基線，再開著跑 --expect
  const NOLEFT = process.argv.includes('--noleft');   // T541：關掉左受光＋夜暈，對同一份代碼做開/關比較
  const pre = [NOSILL ? 'window.__noSill539=true;' : '', NOLEFT ? 'window.__noLeftLight541=true;' : '', PRE ? PRE + ';' : ''].join('');
const session = await withGame({ port: PORT, timeout: 300, log, fresh: true, preScript: pre || '' }, async ({ cdp }) => {   // fresh：乾淨新城市，季節固定 ⇒ 指紋可重現
    const meta = await cdp.evalJs(`(()=>{const el=document.getElementById('startVersion456');const m=/v([0-9.]+) . (T[0-9]+)/.exec(el?el.textContent:'');if(m)return {version:m[1],anchor:m[2]};return (window.GV&&window.GV.build534)?window.GV.build534():{};})()`); // T606：讀目前版本字串（build534 是 T534 當年凍結的建置紀錄）
    const fp = await cdp.evalJs(`(window.GV && window.GV.fp536) ? window.GV.fp536() : {ok:false,err:'fp536 不存在'}`);
    const style = await cdp.evalJs(`(window.GV && window.GV.style536) ? window.GV.style536() : {ok:false,err:'style536 不存在'}`);
    const blocks = await cdp.evalJs(`(window.GV && window.GV.blockFp536) ? window.GV.blockFp536() : {ok:false,err:'blockFp536 不存在'}`);
    if (!fp || !fp.ok) throw new Error('指紋失敗: ' + JSON.stringify(fp && (fp.err || fp.skipped || fp)));
    return { meta, fp, style, blocks };
  });

  if (!session.result) {
    console.log('X 紅燈：' + session.fails.join(' / '));
    process.exit(1);
  }

  const { meta, fp, style, blocks } = session.result;
  const checkFail = [];   // T631：--check 的所有失敗原因，全部檢查跑完才判定
  const cur = {
    generatedAt: new Date().toISOString(),
    version: meta.version || '?',
    anchor: meta.anchor || '?',
    stats: fp.stats,
    families: fp.families,
    subs: fp.subs,
    blocks: blocks && blocks.ok ? { fam: blocks.fam, count: blocks.count } : null,
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
    if (d.envMatched.length) log('  已登記環境差（' + PLATFORM + '）：' + d.envMatched.length + ' 葉（' + d.envMatched.slice(0, 8).join(', ') + (d.envMatched.length > 8 ? ' …' : '') + '），不算變動');

    /* T631：--record-env 只登記列出的、目前確實與基線不同的葉子；其餘內容照原本的基線寫回（不重錄） */
    if (RECORD_ENV.length) {
      const bad = RECORD_ENV.filter(k => !d.changed.includes(k));
      if (bad.length) { console.log('X --record-env 拒絕：這些葉子目前與基線沒有差異（或不存在／已登記）：' + bad.join(', ')); process.exit(1); }
      base.envLeaves = base.envLeaves || {};
      base.envLeaves[PLATFORM] = Object.assign({}, base.envLeaves[PLATFORM] || {});
      for (const k of RECORD_ENV) base.envLeaves[PLATFORM][k] = cur.subs[k];
      fs.writeFileSync(FP_PATH, JSON.stringify(base, null, 1));
      console.log('OK 已登記 ' + PLATFORM + ' 環境差 ' + RECORD_ENV.length + ' 葉：' + RECORD_ENV.join(', ') + '（fp.json 只改 envLeaves）');
      process.exit(0);
    }

    /* 每輪驗收：指紋差必須恰好等於卡面宣告的家族清單 */
    if (EXPECT.length) {
      const expectSet = new Set(EXPECT);
      const unexpected = famTouched.filter(f => !expectSet.has(f));
      const missing = EXPECT.filter(f => f !== 'block559' && !famTouched.includes(f)); // block559 為偽家族，由上方專責分支對帳
      // 超街區快取偽家族：--expect 可含 'block559'（宣告「本輪改了超街區繪製」）
      const bFam = (blocks && blocks.ok) ? blocks.fam : null;
      const bPrev = (base && base.blocks) ? base.blocks.fam : null;
      if (expectSet.has('block559')) {
        if (bPrev && bFam && bPrev !== bFam) log('  OK block559：超街區快取已變動（如宣告）');
        else if (bPrev) { log('  X block559：宣告了但快取 CRC 與基線相同'); process.exit(1); }
      } else if (bPrev && bFam && bPrev !== bFam) {
        log('  X 多改了：block559（超街區快取變動未宣告）');
        process.exit(1);
      }
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
      if (famTouched.length) checkFail.push('指紋有變動（未宣告）：' + famTouched.slice(0, 12).join(', ') + (famTouched.length > 12 ? ' …' : ''));   // T631：不提早退出，block559 與棘輪照跑
      else log('  OK 葉子零變動' + (d.envMatched.length ? '（已登記環境差 ' + d.envMatched.length + ' 葉）' : ''));
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

  /* ===== 超街區快取指紋（T579）===== */
  let blockFam = null, blockPrevFam = null, blockCount = 0;
  if (blocks && blocks.ok) {
    blockFam = blocks.fam; blockCount = blocks.count;
    log('');
    log('超街區快取：' + blockCount + ' 個決定性枚舉條目，家族 CRC ' + blockFam);
    if (base && base.blocks && base.blocks.fam) {
      blockPrevFam = base.blocks.fam;
      log('  ' + (blockPrevFam === blockFam ? '與基線一致' : '與基線不同（' + blockPrevFam + ' → ' + blockFam + '）'));
      if (CHECK && !EXPECT.length && blockPrevFam !== blockFam) checkFail.push('block559 與基線不同（' + blockPrevFam + ' → ' + blockFam + '）');   // T631
    }
  }

  /* ===== 七軸記分卡 + 棘輪 ===== */
  if (style && style.ok) {
    const curStyle = buildStyle(style);
    const prevStyle = loadJson(STYLE_PATH);
    const famNames = Object.keys(curStyle);

    // 全域平均（各軸）
    const axNames = ['palette','hardEdge','lightDir','shade','density','nightRule','variants'];
    const avg = {};
    for (const a of axNames) avg[a] = famNames.reduce((s2, k) => s2 + curStyle[k].axes[a], 0) / Math.max(1, famNames.length);
    let grand = famNames.reduce((s2, k) => s2 + curStyle[k].total, 0) / Math.max(1, famNames.length);

    log('');
    log('--- 七軸記分卡（全 149 家族平均）---');
    const AX_LABEL = { palette:'(1) 調色深度', hardEdge:'(2) 硬邊', lightDir:'(3) 受光方向',
      shade:'(4) 陰影階數', density:'(5) 細節密度', nightRule:'(6) 夜圖規約', variants:'(7) 變體數' };
    for (const a of axNames) log('  ' + AX_LABEL[a].padEnd(16) + (avg[a] * 100).toFixed(1) + '%');
    log('  總分（七軸平均）  ' + (grand * 100).toFixed(1) + '%');

    // 最低分 × 葉子數最大 ⇒ 下一個該做的家族
    const queue = famNames
      .map(k => ({ k: k, total: curStyle[k].total, leaves: curStyle[k].leaves, gravity: (1 - curStyle[k].total) * curStyle[k].leaves }))
      .sort((a, b) => b.gravity - a.gravity);
    log('');
    log('--- 選題佇列（重力＝(1-總分)×葉子數，前 8）---');
    for (const q of queue.slice(0, 8))
      log('  ' + q.k.padEnd(22) + ' 總分 ' + (q.total * 100).toFixed(1) + '%  葉子 ' + String(q.leaves).padStart(4) + '  重力 ' + q.gravity.toFixed(1));

    if (prevStyle && prevStyle.families) {
      const expSet = new Set(EXPECT);
      const drops = [];
      for (const k of famNames) {
        const pv = prevStyle.families[k];
        if (!pv) continue;                       // 新家族不算退步
        if (expSet.has(k)) continue;             // 本輪宣告的家族允許變動
        const d = curStyle[k].total - pv.total;
        if (d < -1e-6) drops.push(k + ' ' + (pv.total * 100).toFixed(1) + '% → ' + (curStyle[k].total * 100).toFixed(1) + '%');
      }
      log('');
      if (drops.length) {
        log('X 棘輪破裂（非本輪宣告家族分數下降）：');
        drops.slice(0, 12).forEach(d => log('   - ' + d));
        console.log('X 棘輪下降 ⇒ 請 git checkout -- index.html 退回上一個綠點');
        process.exit(1);
      }
      log('棘輪 OK（非宣告家族分數無一下降，共比對 ' + famNames.length + ' 族）');
    } else {
      log('');
      log('（尚未有 style.json，這是記分卡基線）');
    }

    if (!CHECK) {
      fs.writeFileSync(STYLE_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), version: cur.version, anchor: cur.anchor, version_fp: cur.version, averages: avg, grand: +grand.toFixed(4), families: curStyle }, null, 1));
      log('已寫入 style.json');
    }
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

  if (checkFail.length) {   // T631
    console.log('');
    console.log('X --check：' + checkFail.join('；'));
    process.exit(1);
  }
  if (CHECK) log('OK --check：葉子、超街區指紋、棘輪全部零變動');
  console.log('');
  console.log('OK 指紋台完成（' + session.seconds.toFixed(1) + 's）');
  process.exit(0);
})().catch(e => { console.error('X 指紋台失敗: ' + e.message); process.exit(1); });
