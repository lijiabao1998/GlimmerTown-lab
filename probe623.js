// T623 像素守衛：種子城正午，住宅近景（看 (12,12)、z=2）與中景（看 (36,36)、z=0.75）各畫兩次：
//   new＝T623；old＝兩個修正閥都關（__noSpokeFix623：路口短線原式 (c+p)*k；__noRoadAxis623：標線對到菱形頂點）。
//   ① 草地上被移走的線：同一像素 old 比 new 亮 ≥20，而且 new 在那裡是草地綠 ⇒ 舊線畫在草地上、修正後消失（應 >0）。
//   ② 草地上新冒出的線：new 比 old 亮 ≥20，而且 old 在那裡是草地綠 ⇒ 修正後的標線跑到草地上（應 ≤ ① 的 5%，下限容忍 20 顆）。
//   ③ 中景路面上的橫向細線（z=0.75 時標線 1px）：同一列連續 ≥8 顆亮像素（亮度 ≥160）且六成以上上下都是暗路面（亮度 ≤110），new 比 old 少 ≥80%。
//   方向是否順著道路由遊戲內自檢 roadMark623 逐段斷言；本探針負責整張畫面的像素事實與修前修後樣張。
//   標線畫在地面快取裡，快取鍵不含閥門 ⇒ 每次切換閥門後先把鏡頭移開兩格再移回，逼地面快取重烘。
// 用法：node probe623.js [--shots=shots623/T623]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [{ name: 'home', at: [12, 12], z: 2 }, { name: 'mid', at: [36, 36], z: 0.75 }];

const MEASURE = (v, wantShots) => `(() => {
  const c = document.getElementById('game'), g = c.getContext('2d'), W = c.width, H = c.height, saved = [window.__noSpokeFix623, window.__noRoadAxis623], out = { view: '${v.name}' }, imgs = {};
  const lum = (d, i) => .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2];
  const grass = (d, i) => d[i + 1] > d[i] + 25 && d[i + 1] > d[i + 2] + 15;
  try {
    for (const [tag, off] of [['new', false], ['old', true]]) {
      window.__noSpokeFix623 = off; window.__noRoadAxis623 = off;
      GV.lookAt(${v.at[0] + 2}, ${v.at[1]}); GV.art574.zoom574(${v.z}); GV.forceDraw();
      GV.lookAt(${v.at[0]}, ${v.at[1]}); GV.art574.zoom574(${v.z}); GV.setVisT(GV.art574.cycle574() * .5); GV.forceDraw();
      const d = g.getImageData(0, 0, W, H).data; imgs[tag] = d; let n = 0;
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = (y * W + x) * 4, mn = Math.min(d[i], d[i + 1], d[i + 2]), mx = Math.max(d[i], d[i + 1], d[i + 2]); if (mn < 170 || mx - mn > 60) continue;
        const nb = [i - 4, i + 4, i - W * 4, i + W * 4].filter(j => grass(d, j)).length; if (nb >= 2) n++;
      }
      let runs = 0;
      for (let y = 1; y < H - 1; y++) { let len = 0, dark = 0;
        for (let x = 0; x <= W; x++) { const i = (y * W + x) * 4, lit = x < W && lum(d, i) >= 160;
          if (lit) { len++; if (lum(d, i - W * 4) <= 110 && lum(d, i + W * 4) <= 110) dark++; }
          else { if (len >= 8 && dark >= len * .6) runs++; len = 0; dark = 0; } } }
      out[tag] = n; out[tag + 'Runs'] = runs; if (${wantShots}) out[tag + 'Url'] = c.toDataURL('image/png');
    }
    let diff = 0, gone = 0, added = 0; const a = imgs.new, b = imgs.old;
    for (let i = 0; i < a.length; i += 4) { if (a[i] === b[i] && a[i + 1] === b[i + 1] && a[i + 2] === b[i + 2]) continue; diff++;
      const dl = lum(b, i) - lum(a, i); if (dl >= 20 && grass(a, i)) gone++; else if (dl <= -20 && grass(b, i)) added++; }
    out.newVsOld = diff; out.goneOnGrass = gone; out.addedOnGrass = added;
  } finally { window.__noSpokeFix623 = saved[0]; window.__noRoadAxis623 = saved[1]; }
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
    for (const v of VIEWS) {
      const q = await ev(MEASURE(v, !!SHOTS));
      for (const tag of ['new', 'old']) if (q[tag + 'Url']) {
        const dest = path.join(ROOT, `${SHOTS}_${v.name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
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
    checks.push([`${q.view}：草地上被移走的舊線 ${q.goneOnGrass} 顆（>0）`, q.goneOnGrass > 0]);
    checks.push([`${q.view}：草地上新冒出的線 ${q.addedOnGrass} 顆（≤ max(20, 移走的 5%)）`, q.addedOnGrass <= Math.max(20, q.goneOnGrass * 0.05)]);
    if (q.view === 'mid') checks.push([`${q.view}：路面上的橫向細線 ${q.oldRuns}→${q.newRuns} 段（少 ≥80%）`, q.oldRuns > 0 && q.newRuns <= q.oldRuns * 0.2]);
    else console.log(`  · ${q.view}：路面橫向細線 ${q.oldRuns}→${q.newRuns}（z=2 標線 2px，此指標只在中景判）；新舊差 ${q.newVsOld} 像素`);
  }
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T623 像素守衛成立' : 'X T623 像素守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
