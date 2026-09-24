// T619 像素守衛：種子城 z=1.5，同一個 JS 任務內用 forceDraw 連畫，只切 __noNightDepth619。
//   正午：新舊逐像素相同；午夜：新版世界平均亮度 / 舊版 ∈ [0.55, 0.8]。
//   對照：同一狀態連畫兩次必須逐像素相同，否則比較沒有意義。
// 用法：node probe619.js [--shots=shots619/T619]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

const MEASURE = `(() => {
  const cv = document.getElementById('game'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  const grab = () => g.getImageData(0, 0, W, H).data;
  const lum = d => { let s = 0, n = 0; for (let i = 0; i < d.length; i += 16) { s += .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]; n++; } return s / n; };
  const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++; return n; };
  const CY = GV.art574.cycle574(), saved = window.__noNightDepth619;
  const shot = (ph, old) => { window.__noNightDepth619 = old; GV.setVisT(CY * ph); GV.forceDraw(); return grab(); };
  try {
    const out = { W, H };
    for (const [tag, ph] of [['noon', .5], ['midnight', .02]]) {
      const o1 = shot(ph, true), o2 = shot(ph, true), n1 = shot(ph, false);
      out[tag] = { b: GV.daylightDbg().b, controlDiff: diff(o1, o2), abDiff: diff(o1, n1), lumOld: +lum(o1).toFixed(2), lumNew: +lum(n1).toFixed(2) };
      out[tag].ratio = +(out[tag].lumNew / out[tag].lumOld).toFixed(3);
    }
    return out;
  } finally { window.__noNightDepth619 = saved; }
})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.lookAt(36,36);GV.art574.zoom574(1.5);GV.forceDraw();return 1;})()`);
    await sleep(1500);
    const m = await ev(MEASURE);
    if (SHOTS) {   // 樣張：新版日／夜（閥門關），畫面交給主迴圈重畫後截圖
      m.shots = [];
      for (const [tag, ph] of [['day', .5], ['night', .02]]) {
        await ev(`window.__noNightDepth619=false;GV.setVisT(GV.art574.cycle574()*${ph});GV.forceDraw();1`);
        await sleep(900);
        const s = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const dest = path.join(ROOT, `${SHOTS}_${tag}.png`);
        fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(s.data, 'base64'));
        m.shots.push(path.relative(ROOT, dest));
      }
    }
    return m;
  });
  const m = r.result;
  console.log(JSON.stringify(m || r.fails, null, 1));
  if (!m) process.exit(1);
  const checks = [
    ['正午 b=1', m.noon.b === 1],
    ['正午對照：同狀態連畫逐像素相同', m.noon.controlDiff === 0],
    ['正午新舊逐像素相同', m.noon.abDiff === 0],
    ['午夜 b=0.34', Math.abs(m.midnight.b - .34) < 1e-9],
    ['午夜對照：同狀態連畫逐像素相同', m.midnight.controlDiff === 0],
    ['午夜新版較暗，亮度比 ∈ [0.55, 0.8]', m.midnight.ratio >= .55 && m.midnight.ratio <= .8],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T619 像素守衛成立' : 'X T619 像素守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
