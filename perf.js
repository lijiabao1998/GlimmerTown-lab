#!/usr/bin/env node
/* 微光小鎮 實驗線 — 幀率基線台 perf.js（零依賴，骨架：harness.js）【T584】
 *
 * 為什麼要有它：r32 起每次美術迭代都加 sprite 成本，但全專案沒有幀率數字——
 * 「跑得動」這條紅線沒有量測就等於沒有。本工具量 6 個固定場景的 rAF 幀率，
 * 落地 perf.json，供之後每一輪對照（美術輪跑完跑一次，劣化看得見）。
 *
 * 做什麼：無頭進城（沙盒 72×72，slot=3 保護）→ 用既有只動渲染的測試鉤子
 * （GV.setVisT / setZoom / lookAt / setRot，全都不寫存檔、不消耗模擬 R()）
 * 逐場景設置 → forceDraw 暖機 3 幀丟棄 → rAF 採樣 → 還原狀態 → 下一場景。
 *
 * 用法：
 *   node perf.js              量測並更新 perf.json（印出與舊版的差異）
 *   node perf.js --check      只比對：任一場景 fps 比基線低超過 25% 就 exit 1
 *   node perf.js --sample=3   每場景採樣秒數（預設 2.4）
 *
 * 退出碼 0 = 完成／基線無顯著劣化；1 = 失敗或劣化超標。
 * 邊界：自用埠 8199；進城前一律設 slot=3，不碰業主存檔（AUTORUN.md）。
 * 血淚教訓：本檔曾被 PowerShell Set-Content 加 BOM＋ANSI 轉碼毀掉——
 * 編輯文字檔一律用 editor 工具或 node 顯式 UTF8，禁用 PowerShell 重導向。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PORT = +arg('port', 8199);
const SAMPLE_S = +arg('sample', 2.4);
const CHECK = process.argv.includes('--check');
const PERF_PATH = path.join(ROOT, 'perf.json');
const REGRESS = 0.25; // --check 的劣化門檻：任一場景 fps 低於基線 75% 即紅

/* 場景定義：全部只動渲染層。CYCLE=110：ph=visT/110；正午=.5→55，深夜=0。
 * 注意 rot 會寫 localStorage 偏好 ⇒ 每場景後必還原。 */
const SCENES = [
  { id: 'day_noon',      desc: '正午預設視角',         set: `GV.setVisT(55);GV.setZoom(1);GV.setRot(0);` },
  { id: 'night',         desc: '深夜（夜圖全合成）',    set: `GV.setVisT(0.01);GV.setZoom(1);GV.setRot(0);` },
  { id: 'rot1_day',      desc: '正午旋轉90度',         set: `GV.setVisT(55);GV.setZoom(1);GV.setRot(1);` },
  { id: 'rot3_day',      desc: '正午旋轉270度',        set: `GV.setVisT(55);GV.setZoom(1);GV.setRot(3);` },
  { id: 'zoom_far_day',  desc: '正午拉遠 z=.68',       set: `GV.setVisT(55);GV.setZoom(.68);GV.setRot(0);` },
  { id: 'zoom_near_day', desc: '正午拉近 z=2',         set: `GV.setVisT(55);GV.setZoom(2);GV.setRot(0);` },
];

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 幀率基線台（T584）===');

  const session = await withGame({ port: PORT, timeout: 300, log }, async ({ cdp }) => {
    // 相機對準城中（24,22 是 72×72 沙盒市中心一帶，既有 boot 預設同款）
    await cdp.evalJs(`GV.lookAt(24,22)`);

    const results = [];
    for (const sc of SCENES) {
      await cdp.evalJs(`(()=>{${sc.set}return 1})()`);
      await sleep(300); // 讓 groundDirty/快取失效先重建完
      // 暖機 3 幀丟棄（第一幀含快取重建，不代表穩態）
      await cdp.evalJs(`GV.forceDraw();GV.forceDraw();GV.forceDraw();`);
      await cdp.evalJs(`(()=>{window.__perfStop584=false;window.__perfN584=0;window.__perfT584=performance.now();const step=()=>{if(window.__perfStop584)return;window.__perfN584++;requestAnimationFrame(step);};requestAnimationFrame(step);return 1;})()`);
      await sleep(SAMPLE_S * 1000);
      const r = await cdp.evalJs(`(()=>{window.__perfStop584=true;const n=window.__perfN584|0;const dt=(performance.now()-window.__perfT584)/1000;return JSON.stringify({n,dt});})()`);
      const { n, dt } = JSON.parse(r);
      const fps = n / Math.max(.001, dt);
      results.push({ id: sc.id, desc: sc.desc, frames: n, seconds: +dt.toFixed(2), fps: +fps.toFixed(1) });
      log(sc.id.padEnd(14) + ' ' + String(n).padStart(4) + ' 幀 / ' + dt.toFixed(1) + 's = ' + fps.toFixed(1) + ' fps');
      // 還原（rot 會寫 localStorage 偏好）
      await cdp.evalJs(`(()=>{GV.setRot(0);GV.setZoom(1);GV.setVisT(55);return 1})()`);
    }
    // 總還原（保險）：回到正午預設
    await cdp.evalJs(`(()=>{GV.setRot(0);GV.setZoom(1);GV.setVisT(55);GV.forceDraw();return 1})()`);
    const meta = await cdp.evalJs(`(()=>{const el=document.getElementById('startVersion456');const m=/v([0-9.]+) . (T[0-9]+)/.exec(el?el.textContent:'');return JSON.stringify(m?{version:m[1],anchor:m[2]}:{});})()`);
    return { results, meta: JSON.parse(meta || '{}') };
  });

  if (!session.result) {
    console.log('X 紅燈：' + session.fails.join(' / '));
    process.exit(1);
  }
  const { results, meta } = session.result;
  const cur = { generatedAt: new Date().toISOString(), version: meta.version || '?', anchor: meta.anchor || '?', sampleS: SAMPLE_S, scenes: {} };
  for (const r of results) cur.scenes[r.id] = r;

  const base = (() => { try { return JSON.parse(fs.readFileSync(PERF_PATH, 'utf8')); } catch { return null; } })();
  if (base && base.scenes) {
    log('');
    log('與 perf.json（' + (base.anchor || '?') + ' ' + (base.version || '?') + '）相比：');
    const drops = [];
    for (const r of results) {
      const b = base.scenes[r.id];
      if (!b) { log('  ' + r.id.padEnd(14) + ' 新增場景（基線無）'); continue; }
      const d = (r.fps - b.fps) / Math.max(.001, b.fps);
      log('  ' + r.id.padEnd(14) + ' ' + b.fps.toFixed(1) + ' -> ' + r.fps.toFixed(1) + ' fps（' + (d * 100).toFixed(1) + '%）');
      if (d < -REGRESS) drops.push(r.id + ' ' + b.fps + '->' + r.fps);
    }
    if (drops.length) {
      console.log('');
      console.log('X 幀率劣化超過 ' + (REGRESS * 100) + '%：' + drops.join('；'));
      if (CHECK) process.exit(1);
    } else log('  全部場景在門檻內（+-' + (REGRESS * 100) + '%）');
  } else {
    log('');
    log('（尚無 perf.json，本次建立基線）');
  }

  if (!CHECK) {
    fs.writeFileSync(PERF_PATH, JSON.stringify(cur, null, 1));
    log('已寫入 perf.json');
  }
  console.log('');
  console.log('OK 幀率基線台完成（' + session.seconds.toFixed(1) + 's）');
  process.exit(0);
})().catch(e => { console.error('X 幀率基線台失敗: ' + e.message); process.exit(1); });
