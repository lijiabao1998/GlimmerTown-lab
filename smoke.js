#!/usr/bin/env node
/* 微光小鎮 實驗線 — 開機煙霧測試（零依賴，骨架：harness.js）
 *
 * 斷言四層，全部在無頭 Chrome 內執行：
 *   4  主迴圈真的在跑（rAF 遞增）
 *   4b 功能自我測試（純函式斷言：T533 市民履歷、T540 事件流）
 *   4c UI 點擊往返（T534：住宅 → 點名字 → 履歷 → 返回，6 步真 DOM 事件）
 *   4d 事件流往返（T540：指揮中心 → 人生分頁 → 篩選 → 點名字接履歷）
 *   5  console 乾淨
 * 外加進城後確認素材烘焙完成（__t519Roof > 0）。
 *
 * 用法：node smoke.js [--port=8199] [--timeout=300] [--keep]
 * 退出碼 0 = 綠燈；1 = 紅燈（錯誤清單會印出來）
 *
 * 邊界：自用埠 8199；進城前一律設 slot=3，不碰業主存檔（AUTORUN.md）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PORT = +arg('port', 8199);
const TIMEOUT = +arg('timeout', 300);
const KEEP = process.argv.includes('--keep');

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 煙霧測試 ===');
  const fails = [];

  const session = await withGame({ port: PORT, timeout: TIMEOUT, keep: KEEP, log }, async ({ cdp }) => {
    log('1 載入 index.html … / 2 進入城市（slot=3 保護）/ 3 等素材烘焙');

    log('4 確認主迴圈 …');
    const a = await cdp.evalJs(`(window.__smokeFrames|0)`);
    await cdp.evalJs(`(() => { let n=0; const step=()=>{ window.__smokeFrames=++n; requestAnimationFrame(step); }; requestAnimationFrame(step); return 1; })()`);
    await sleep(1200);
    const b = await cdp.evalJs(`(window.__smokeFrames|0)`);
    if (!(b > a)) fails.push('主迴圈沒有在跑（requestAnimationFrame 未遞增）');
    else log('   主迴圈 OK（' + (b - a) + ' frames/1.2s）');

    log('4b 功能自我測試 …');
    const selftests = [
      ['life533', `(window.GV && window.GV.life533Selftest) ? window.GV.life533Selftest() : {ok:false,checks:['API 不存在']}`],
      ['life535', `(window.GV && window.GV.life535Selftest) ? window.GV.life535Selftest() : {ok:false,checks:['API 不存在']}`],
      ['overlay596', `(window.GV && window.GV.overlaySelftest596) ? window.GV.overlaySelftest596() : {ok:false,checks:['API 不存在']}`],
      ['ukStyle596', `(window.GV && window.GV.ukStyleSelftest596) ? window.GV.ukStyleSelftest596() : {ok:false,checks:['API 不存在']}`],
      ['roadPixel596', `(window.GV && window.GV.roadPixelSelftest596) ? window.GV.roadPixelSelftest596() : {ok:false,checks:['API 不存在']}`],
      ['tree596', `(window.GV && window.GV.treeSelftest596) ? window.GV.treeSelftest596() : {ok:false,checks:['API 不存在']}`],
      ['hud598', `(window.GV && window.GV.hudRealtimeSelftest598) ? window.GV.hudRealtimeSelftest598() : {ok:false,checks:['API 不存在']}`],
      ['panel599', `(window.GV && window.GV.panelLiveSelftest599) ? window.GV.panelLiveSelftest599() : {ok:false,checks:['API 不存在']}`],
      ['workshop600', `(window.GV && window.GV.workshopSelftest600) ? window.GV.workshopSelftest600() : {ok:false,checks:['API 不存在']}`],
      ['species601', `(window.GV && window.GV.speciesSelftest601) ? window.GV.speciesSelftest601() : {ok:false,checks:['API 不存在']}`],
      ['moreBld602', `(window.GV && window.GV.moreBldSelftest602) ? window.GV.moreBldSelftest602() : {ok:false,checks:['API 不存在']}`],
      ['terrace603', `(window.GV && window.GV.terraceRowSelftest603) ? window.GV.terraceRowSelftest603() : {ok:false,checks:['API 不存在']}`],
      ['finish604', `(window.GV && window.GV.finishArtSelftest604) ? window.GV.finishArtSelftest604() : {ok:false,checks:['API 不存在']}`],
      ['bay605', `(window.GV && window.GV.bayFlavorSelftest605) ? window.GV.bayFlavorSelftest605() : {ok:false,checks:['API 不存在']}`],
      ['wallDetail606', `(window.GV && window.GV.wallDetailSelftest606) ? window.GV.wallDetailSelftest606() : {ok:false,checks:['API 不存在']}`],
      ['storyBubble607', `(window.GV && window.GV.storyBubbleSelftest607) ? window.GV.storyBubbleSelftest607() : {ok:false,checks:['API 不存在']}`],
      ['industrialRoof608', `(window.GV && window.GV.industrialRoofSelftest608) ? window.GV.industrialRoofSelftest608() : {ok:false,checks:['API 不存在']}`],
      ['bayFarm609', `(window.GV && window.GV.bayFarmSelftest609) ? window.GV.bayFarmSelftest609() : {ok:false,checks:['API 不存在']}`],
      ['ranchPump610', `(window.GV && window.GV.ranchPumpSelftest610) ? window.GV.ranchPumpSelftest610() : {ok:false,checks:['API 不存在']}`],
      ['logistics611', `(window.GV && window.GV.logisticsSelftest611) ? window.GV.logisticsSelftest611() : {ok:false,checks:['API 不存在']}`],
      ['transport612', `(window.GV && window.GV.transportSelftest612) ? window.GV.transportSelftest612() : {ok:false,checks:['API 不存在']}`],
      ['facadeSmoke613', `(window.GV && window.GV.facadeSmokeSelftest613) ? window.GV.facadeSmokeSelftest613() : {ok:false,checks:['API 不存在']}`],
      ['leash613', `(window.GV && window.GV.leashSelftest613) ? window.GV.leashSelftest613() : {ok:false,checks:['API 不存在']}`],
      ['civic614', `(window.GV && window.GV.civicSelftest614) ? window.GV.civicSelftest614() : {ok:false,checks:['API 不存在']}`],
    ];
    const scratch = process.env.GOAL_SCRATCH || path.join(process.env.LOCALAPPDATA || '', 'Temp', 'grok-goal-c80f16d61c81', 'implementer');
    const scratchMap = { overlay596: 'overlay-selftest.json', ukStyle596: 'uk-style-selftest.json', roadPixel596: 'road-pixel-selftest.json', tree596: 'tree-selftest.json', hud598: 'hud-realtime-selftest.json', panel599: 'panel-live-selftest.json', workshop600: 'workshop-selftest.json' };
    try { fs.mkdirSync(scratch, { recursive: true }); } catch (e) {}
    for (const [name, expr] of selftests) {
      try {
        const r = await cdp.evalJs(expr);
        if (scratchMap[name]) {
          try { fs.writeFileSync(path.join(scratch, scratchMap[name]), JSON.stringify(r, null, 2)); } catch (e2) {}
        }
        if (r && r.ok) log('   ' + name + ' OK（' + r.checks.length + ' 項）');
        else { fails.push('自我測試 ' + name + ' 未通過'); (r && r.checks || []).forEach(c => log('     ' + c)); }
      } catch (e) { fails.push('自我測試 ' + name + ' 執行失敗: ' + e.message); }
    }

    log('4c UI 點擊往返 …');
    try {
      const r = await cdp.evalJs(`(window.GV && window.GV.testUiRoundtrip534) ? window.GV.testUiRoundtrip534() : {ok:false,checks:['API 不存在']}`);
      if (r && r.ok) log('   點擊往返 OK（' + r.checks.length + ' 步）');
      else { fails.push('UI 點擊往返未通過'); (r && r.checks || []).forEach(c => log('     ' + c)); }
    } catch (e) { fails.push('UI 點擊往返執行失敗: ' + e.message); }

    log('4d 事件流往返 …');
    try {
      const r = await cdp.evalJs(`(window.GV && window.GV.testUiFeed535) ? window.GV.testUiFeed535() : {ok:false,checks:['API 不存在']}`);
      if (r && r.ok) log('   事件流往返 OK（' + r.checks.length + ' 步）');
      else { fails.push('事件流往返未通過'); (r && r.checks || []).forEach(c => log('     ' + c)); }
    } catch (e) { fails.push('事件流往返執行失敗: ' + e.message); }

    log('4e 幀率快採（T584，只記不判）…');
    try {
      await cdp.evalJs(`(()=>{GV.setVisT(55);GV.setRot(0);GV.setZoom(1);GV.forceDraw();GV.forceDraw();GV.forceDraw();return 1})()`);
      await cdp.evalJs(`(()=>{window.__perfStop584=false;window.__perfN584=0;window.__perfT584=performance.now();const step=()=>{if(window.__perfStop584)return;window.__perfN584++;requestAnimationFrame(step);};requestAnimationFrame(step);return 1;})()`);
      await sleep(1200);
      const pr = JSON.parse(await cdp.evalJs(`(()=>{window.__perfStop584=true;const n=window.__perfN584|0;const dt=(performance.now()-window.__perfT584)/1000;return JSON.stringify({n,dt});})()`));
      log('   正午快採 ' + (pr.n / Math.max(.001, pr.dt)).toFixed(1) + ' fps（' + pr.n + ' 幀/' + pr.dt.toFixed(1) + 's；對照基線見 perf.json day_noon）');
    } catch (e) { log('   幀率快採失敗（不影響判定）: ' + e.message); }

    log('5 錯誤檢查 …');
    if (cdp.errors.length) {
      fails.push('console 有 ' + cdp.errors.length + ' 筆錯誤');
      cdp.errors.slice(0, 10).forEach(e => log('   x ' + e));
    } else log('   0 筆 console error');
    if (cdp.benign.length) log('   （已知良性 ' + cdp.benign.length + ' 筆：PWA 附屬檔 404）');

    try {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
      const out = path.join(ROOT, 'shots', 'smoke-' + Date.now() + '.png');
      fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
      log('   樣張 ' + path.relative(ROOT, out));
    } catch { log('   樣張失敗（不影響判定）'); }
  });

  session.fails.forEach(f => fails.push(f));
  const secs = session.seconds.toFixed(1);
  if (fails.length) {
    console.log('');
    console.log('X 紅燈（' + secs + 's）');
    [...new Set(fails)].forEach(f => console.log('   - ' + f));
    process.exit(1);
  }
  console.log('');
  console.log('OK 綠燈（' + secs + 's）— 開機管線走完、主迴圈在跑、console 乾淨');
  console.log('');
  process.exit(0);
})();
