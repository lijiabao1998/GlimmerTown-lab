// T619 補驗：市民泡泡、黃昏逐格。種子城 z=2，自動找「傍晚泡泡最多」的鏡頭位置與時刻，
// （泡泡由 drawFestivalDay517 呼叫，入夜 b<.72 就整段 return ⇒ 夜裡本來就不畫泡泡；受 T619 影響的只有 b∈[.72,1) 的傍晚）
// 在同一個 JS 任務裡 forceDraw 後直接 toDataURL 取遊戲畫布（不經主迴圈，新舊兩張是同一瞬間）。
// 輸出：<out>_bubble_{old,new}.png、<out>_dusk_{old,new}_<ph>.png；stdout 印掃描結果（泡泡數、平均單幀繪製毫秒）
// 用法：node probe619b.js [--out=shots619/b]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const OUT = arg('out', 'shots619/b');
const Z = 2;
const DUSK = [0.66, 0.70, 0.73, 0.745, 0.76];

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    const save = (name, dataUrl) => { const dest = path.join(ROOT, `${OUT}_${name}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(dataUrl.split(',')[1], 'base64')); return path.relative(ROOT, dest); };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.art574.zoom574(${Z});return 1;})()`);
    await sleep(1200);
    // 1) 掃描：鏡頭位置（5×5）× 傍晚兩個時刻（ph .62／.67，b≈.87／.74，仍 ≥.72 會畫泡泡），記下 __t521bb（本幀畫出的泡泡數）。同一時刻本來就有 4～8% 的住商在冒，不必掃整個 11 秒週期。
    //    每個位置分開呼叫，避免單次 evaluate 太久；也順便量一次 forceDraw 的耗時。
    const CY = await ev('GV.art574.cycle574()');
    let best = { n: -1 }, ms = 0, draws = 0;
    for (let y = 12; y <= 60; y += 12) for (let x = 12; x <= 60; x += 12) for (const vt of [CY * 0.62, CY * 0.67]) {
      const q = await ev(`(()=>{GV.lookAt(${x},${y});GV.setVisT(${vt});window.__noNightDepth619=false;const t0=performance.now();GV.forceDraw();return {n:window.__t521bb|0,ms:performance.now()-t0};})()`);
      ms += q.ms; draws++;
      if (q.n > best.n) best = { n: q.n, x, y, vt };
    }
    best.avgDrawMs = +(ms / draws).toFixed(1);
    // 2) 同一瞬間的新舊兩張
    const grabAt = (vt, old) => ev(`(()=>{window.__noNightDepth619=${old};GV.lookAt(${best.x},${best.y});GV.setVisT(${vt});GV.forceDraw();
      const n=window.__t521bb|0;const u=document.getElementById('game').toDataURL('image/png');window.__noNightDepth619=false;return {n,u};})()`);
    const shots = {};
    const o = await grabAt(best.vt, true), n = await grabAt(best.vt, false);
    shots.bubble = { bubblesOld: o.n, bubblesNew: n.n, old: save('bubble_old', o.u), new: save('bubble_new', n.u) };
    // 3) 黃昏逐格（同一鏡頭）：每個相位新舊各一張
    shots.dusk = [];
    for (const ph of DUSK) {
      const vt = await ev(`GV.art574.cycle574()*${ph}`);
      const b = await ev(`(GV.setVisT(${vt}),GV.daylightDbg())`);
      const a = await grabAt(vt, true), c = await grabAt(vt, false);
      shots.dusk.push({ ph, b: +b.b.toFixed(3), dusk: +b.dusk.toFixed(3), old: save(`dusk_old_${ph}`, a.u), new: save(`dusk_new_${ph}`, c.u) });
    }
    return { best, shots };
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1));
  process.exit(r.ok && r.result && r.result.best.n > 0 ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
