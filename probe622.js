// T622 像素守衛：種子城住宅近景（看 (12,12)、z=2、正午），四個旋轉各畫兩次：new＝T622；old＝__noRotSwap622（不對調）。
//   rot 1／3：鋪面灰像素 ≤ 200 且 < 舊版的 5%；rot 0／2：新舊逐像素相同（對調只在奇數旋轉生效）。
// 用法：node probe622.js [--shots=shots622/T622]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

const MEASURE = (rot, wantShots) => `(() => {
  const c = document.getElementById('game'), g = c.getContext('2d'), W = c.width, H = c.height, saved = window.__noRotSwap622, out = { rot: ${rot} }, imgs = {};
  try {
    GV.setRot(${rot}); GV.lookAt(12, 12); GV.art574.zoom574(2);
    for (const [tag, off] of [['new', false], ['old', true]]) {
      window.__noRotSwap622 = off; GV.setVisT(GV.art574.cycle574() * .5); GV.forceDraw();
      const d = g.getImageData(0, 0, W, H).data; imgs[tag] = d; let grey = 0;
      for (let i = 0; i < d.length; i += 4) if ((d[i] === 174 && d[i + 1] === 176 && d[i + 2] === 168) || (d[i] === 168 && d[i + 1] === 170 && d[i + 2] === 176)) grey++;
      out[tag] = grey; if (${wantShots}) out[tag + 'Url'] = c.toDataURL('image/png');
    }
    let diff = 0; const a = imgs.new, b = imgs.old; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) diff++;
    out.newVsOld = diff;
  } finally { window.__noRotSwap622 = saved; GV.setRot(0); }
  return out;
})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(1200);
    const rows = [];
    for (const rot of [0, 1, 2, 3]) {
      const q = await ev(MEASURE(rot, !!SHOTS && rot === 3));
      for (const tag of ['new', 'old']) if (q[tag + 'Url']) {
        const dest = path.join(ROOT, `${SHOTS}_rot3_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, Buffer.from(q[tag + 'Url'].split(',')[1], 'base64')); delete q[tag + 'Url'];
      }
      rows.push(q);
    }
    return rows;
  });
  const rows = r.result;
  console.log(JSON.stringify(rows || r.fails));
  if (!rows) process.exit(1);
  const checks = [];
  for (const q of rows) {
    if (q.rot & 1) checks.push([`rot ${q.rot}：鋪面灰 ${q.old}→${q.new}（≤200 且 <舊版 5%）`, q.new <= 200 && q.new < q.old * 0.05]);
    else checks.push([`rot ${q.rot}：新舊逐像素相同（差 ${q.newVsOld}）`, q.newVsOld === 0]);
  }
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T622 像素守衛成立' : 'X T622 像素守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
