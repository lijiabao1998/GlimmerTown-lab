#!/usr/bin/env node
/* 微光小鎮 實驗線 — 開機與繪製量測台 bootperf.js【T735】（零依賴，骨架：harness.js；唯讀，不改遊戲檔、不寫存檔）
 *
 * 為什麼要有它：perf.js（T584/T586）只量 rAF 幀率，無頭環境被螢幕更新率卡住、雜訊大，看不出繪製成本；開機也沒有分段數字。
 * 做什麼：
 *   ① 開機總時間：頁面時間原點 → __bootDone453（用 preScript 在旗標被設成 true 的瞬間記 performance.now()）
 *   ② 變體批次各自耗時：window.__t574.ms
 *   ③ --profile：開 CPU 取樣分析器（0.5 ms），列 bootstrap453 每一步含子呼叫的時間、自身時間最多的 40 個函式
 *      注意：getImageData／putImageData 這類原生呼叫的時間會算在呼叫它的 JS 函式頭上（T735 實測）
 *   ④ 不加 --profile 時：固定種子城 5162026，五個場景（正午 z1／z0.68／z2、午夜 z1、正午旋轉 90°）各強制重畫 15 次，取中位數與 p90 毫秒
 * 用法：node bootperf.js [遊戲目錄，預設本目錄] [--out=bootperf-out.json] [--profile] [--port=8199]
 * 雲端容器的 Chrome 是 --disable-gpu：畫布全靠 CPU 光柵化。夜間繪製（每格約 2.4 s）大多花在 save/restore 觸發的合成光柵化，
 * 有顯示卡的真機可能快很多；真機數字請在遊戲裡開 F12 主控台打 GV.performanceBudget()，看 draw.avg／draw.max（毫秒）。
 * 邊界：自用埠 8199；不碰業主存檔（只設 slot 3）。
 */
'use strict';
const path = require('path'), fs = require('fs');
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const dir = pos[0] || __dirname;
const outPath = (process.argv.find(a => a.startsWith('--out=')) || '--out=' + path.join(__dirname, 'bootperf-out.json')).slice(6);
const PROFILE = process.argv.includes('--profile');
const PORT = +((process.argv.find(a => a.startsWith('--port=')) || '--port=8199').split('=')[1]);
const H = require(path.join(path.resolve(dir), 'harness.js'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const PRE = `(()=>{let v=false;Object.defineProperty(window,'__bootDone453',{configurable:true,get(){return v;},set(x){v=x;if(x&&!window.__bootDoneAt)window.__bootDoneAt=performance.now();}});})();`;

(async () => {
  H.cleanProfiles();
  const srv = await H.startServer(PORT);
  const devPort = PORT + 1000 + (process.pid % 400);
  const profile = path.join(H.ROOT, '.smoke-profile-' + process.pid);
  const chrome = H.launchChrome(devPort, profile);
  const out = { dir, profile: PROFILE };
  let cdp;
  try {
    cdp = await H.cdpConnect(await H.pageWsUrl(devPort, chrome));
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: PRE });
    if (PROFILE) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start'); }
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    const ok = await H.waitFor(cdp, `!!window.__bootDone453`, 180000);
    if (!ok) throw new Error('boot 沒完成');
    let prof = null;
    if (PROFILE) prof = (await cdp.send('Profiler.stop')).profile;
    out.bootMs = await cdp.evalJs(`Math.round(window.__bootDoneAt)`);
    out.t574 = await cdp.evalJs(`JSON.stringify(window.__t574&&window.__t574.ms||{})`).then(JSON.parse);
    out.domContentLoaded = await cdp.evalJs(`Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd)`);
    if (prof) {
      // 每個節點的自身時間＝hitCount×取樣間隔；bootstrap453 底下每個直接呼叫的步驟算含子呼叫總時間
      const byId = new Map(prof.nodes.map(n => [n.id, n]));
      const dt = prof.timeDeltas, samples = prof.samples; const self = new Map();
      for (let i = 0; i < samples.length; i++) self.set(samples[i], (self.get(samples[i]) || 0) + (dt[i + 1] || dt[i] || 0) / 1000);
      const incl = id => { const n = byId.get(id); let t = self.get(id) || 0; for (const c of (n.children || [])) t += incl(c); return t; };
      const steps = {}; const fnSelf = {};
      for (const n of prof.nodes) {
        const f = n.callFrame.functionName || '(anon)';
        fnSelf[f + '@' + n.callFrame.lineNumber] = (fnSelf[f + '@' + n.callFrame.lineNumber] || 0) + (self.get(n.id) || 0);
        if (f === 'bootstrap453') for (const c of (n.children || [])) { const cn = byId.get(c); const k = cn.callFrame.functionName || '(anon)@' + cn.callFrame.lineNumber; steps[k] = (steps[k] || 0) + incl(c); }
      }
      out.steps = Object.fromEntries(Object.entries(steps).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round(v)]));
      out.topSelf = Object.entries(fnSelf).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => [k, Math.round(v)]);
      out.profileTotalMs = Math.round(dt.reduce((a, b) => a + b, 0) / 1000);
    }
    if (!PROFILE) {
      // 種子城＋場景繪製成本
      await cdp.evalJs(`localStorage.setItem('glimmerville.v1.slot','3')`);
      await cdp.evalJs(`(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
      await sleep(2500);
      const SC = [
        ['noon_z1', `GV.setVisT(55);GV.setZoom(1);GV.setRot(0);`],
        ['noon_z068', `GV.setVisT(55);GV.setZoom(.68);GV.setRot(0);`],
        ['noon_z2', `GV.setVisT(55);GV.setZoom(2);GV.setRot(0);`],
        ['night_z1', `GV.setVisT(0);GV.setZoom(1);GV.setRot(0);`],
        ['noon_rot1', `GV.setVisT(55);GV.setZoom(1);GV.setRot(1);`],
      ];
      out.draw = {};
      for (const [id, set] of SC) {
        const r = await cdp.evalJs(`(()=>{${set}GV.lookAt&&GV.lookAt(36,36);for(let i=0;i<3;i++)GV.forceDraw();const t=[];for(let i=0;i<15;i++){const a=performance.now();GV.forceDraw();t.push(performance.now()-a);}t.sort((a,b)=>a-b);return {med:+t[7].toFixed(2),p90:+t[13].toFixed(2),min:+t[0].toFixed(2)};})()`);
        out.draw[id] = r;
      }
      await cdp.evalJs(`GV.setRot(0)`);
      out.counts = await cdp.evalJs(`(()=>{try{const s=GV.stats?GV.stats():null;return s?{pop:s.pop}:null;}catch(e){return null}})()`);
    }
  } catch (e) { out.error = e.message; }
  finally { try { cdp && cdp.close(); } catch {} try { chrome.kill(); } catch {} srv.close(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 1500); }
  fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ bootMs: out.bootMs, draw: out.draw, steps: out.steps && Object.entries(out.steps).slice(0, 8), error: out.error }));
  setTimeout(() => process.exit(0), 1800);
})();
