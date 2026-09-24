// T625 像素探針：種子城港區近景夜晚（看 (36,36)、z=1.5、午夜），畫兩次：new＝T625；old＝__noNeonAnchor625。
//   攔截主畫布 fillRect，只記 T244 商業霓虹六色的亮招牌矩形：修正後同一位置的招牌只畫一次；修正前有重複（超街區分段重複疊亮）。
// 用法：node probe625.js [--shots=shots625/T625]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const NEON = ['#ff4a8a', '#4affd0', '#ffd23a', '#8a5aff', '#ff6a3a', '#3affff'];

const MEASURE = (off, want) => `(() => {
  const cv = document.getElementById('game'), g = cv.getContext('2d'), o = g.fillRect, seen = new Map(), NEON = ${JSON.stringify(NEON)}, saved = window.__noNeonAnchor625;
  try {
    window.__noNeonAnchor625 = ${off};
    GV.lookAt(36, 36); GV.art574.zoom574(1.5); GV.setVisT(GV.art574.cycle574() * .02); GV.forceDraw();
    g.fillRect = function (x, y, w, h) { try { const c = String(g.fillStyle).toLowerCase(); if (NEON.includes(c)) { const k = [x, y, w, h].map(v => Math.round(v)).join(','); seen.set(k, (seen.get(k) || 0) + 1); } } catch (e) {} return o.call(this, x, y, w, h); };
    GV.forceDraw();
  } finally { g.fillRect = o; window.__noNeonAnchor625 = saved; }
  let total = 0, dup = 0; for (const n of seen.values()) { total += n; if (n > 1) dup += n - 1; }
  const out = { total, unique: seen.size, dup };
  if (${want}) { window.__noNeonAnchor625 = ${off}; GV.forceDraw(); out.url = cv.toDataURL('image/png'); window.__noNeonAnchor625 = saved; }
  return out;
})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(1200);
    const out = {};
    for (const [tag, off] of [['new', false], ['old', true]]) {
      const q = await ev(MEASURE(off, !!SHOTS));
      if (q.url) { const dest = path.join(ROOT, `${SHOTS}_near_night_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.url.split(',')[1], 'base64')); delete q.url; }
      out[tag] = q;
    }
    return out;
  });
  const q = r.result; console.log(JSON.stringify(q || r.fails)); if (!q) process.exit(1);
  const checks = [
    [`修正後：招牌 ${q.new.total} 次繪製、${q.new.unique} 個位置，重複 ${q.new.dup} 次（須 0）`, q.new.total > 0 && q.new.dup === 0],
    [`守衛有效：修正前重複 ${q.old.dup} 次（${q.old.total} 次繪製、${q.old.unique} 個位置）`, q.old.dup >= 1],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]); console.log(ok ? 'OK T625 探針守衛成立' : 'X T625 探針守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
