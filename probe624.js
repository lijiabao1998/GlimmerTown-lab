// T624 全面守衛：所有住商工街區組合（k 1–3 × lv 1–3 × 寬高 1–4 × 變體 0–11，共 1,728 種）各用修正版與 __noMassOrder624 各產生一次精靈，逐像素比對。
//   預期會變的只有三種：① T582 切兩棟（≥6 格、工業 ≥4 格、原型無第二量體、進深 ≥.5）；② 原型第二量體在主體前方；③ 平屋頂原型、進深 ≥2 的住宅改用英美立面。
//   其他組合必須逐像素相同（沒有誤傷）；預期會變的組合裡，實際有變的比例另外報告。
// 用法：node probe624.js [--shots=shots624/T624]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

const SCAN = `(() => {
  const saved = window.__noMassOrder624, out = { total: 0, expected: 0, expChanged: 0, unexpChanged: [], byWhy: {} };
  const hash = spr => { const c = spr.img, d = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height).data; let h = 2166136261; for (let i = 0; i < d.length; i += 3) { h ^= d[i]; h = Math.imul(h, 16777619); } return c.width + 'x' + c.height + ':' + (h >>> 0); };
  try {
    for (let k = 1; k <= 3; k++) for (let lv = 1; lv <= 3; lv++) for (let bw = 1; bw <= 4; bw++) for (let bh = 1; bh <= 4; bh++) for (let v = 0; v < 12; v++) {
      const ar = GV.arche568(k, lv, v); if (!ar) continue;
      const villa = k === 1 && lv === 1 && bw * bh <= 4 && ar.n === 'villa';
      const why = [];
      if (!ar.ex && !villa && bw * bh >= (k === 3 ? 4 : 6) && (ar.box[3] - ar.box[2]) >= .5) why.push('T582');
      if (ar.ex && GV.exInFront624(ar.ex.box, ar.box)) why.push('exFront');
      if (k === 1 && Math.min(bw, bh) >= 2 && ar.flat) why.push('flatFacade');
      window.__noMassOrder624 = false; const a = hash(GV.makeBlockSprite547(k, lv, bw, bh, v));
      window.__noMassOrder624 = true; const b = hash(GV.makeBlockSprite547(k, lv, bw, bh, v));
      out.total++; const changed = a !== b;
      if (why.length) { out.expected++; if (changed) out.expChanged++; const w = why.join('+'); const r = out.byWhy[w] || (out.byWhy[w] = { n: 0, changed: 0 }); r.n++; if (changed) r.changed++; }
      else if (changed && out.unexpChanged.length < 20) out.unexpChanged.push([k, lv, bw, bh, v, ar.n]);
    }
  } finally { window.__noMassOrder624 = saved; }
  return out;
})()`;

const SHOT = (tag, off, look, z) => `(() => { const saved = window.__noMassOrder624; try { window.__noMassOrder624 = ${off};
  GV.lookAt(${look[0] + 2}, ${look[1]}); GV.forceDraw(); GV.lookAt(${look[0]}, ${look[1]}); GV.art574.zoom574(${z}); GV.setVisT(GV.art574.cycle574() * .5); GV.forceDraw();
  return document.getElementById('game').toDataURL('image/png'); } finally { window.__noMassOrder624 = saved; } })()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(1200);
    const scan = await ev(SCAN);
    if (SHOTS) for (const [name, look, z] of [['home', [12, 12], 2], ['mid', [36, 36], 0.75]]) for (const [tag, off] of [['new', false], ['old', true]]) {
      const u = await ev(SHOT(tag, off, look, z)); const dest = path.join(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64'));
    }
    return scan;
  });
  const q = r.result; console.log(JSON.stringify(q || r.fails)); if (!q) process.exit(1);
  const checks = [
    [`共 ${q.total} 種組合；預期會變 ${q.expected} 種，其中實際有變 ${q.expChanged} 種`, q.expected > 0 && q.expChanged > 0],
    [`預期之外被改到的組合：${q.unexpChanged.length} 種（須 0）${q.unexpChanged.length ? ' ' + JSON.stringify(q.unexpChanged.slice(0, 5)) : ''}`, q.unexpChanged.length === 0],
  ];
  for (const [w, o] of Object.entries(q.byWhy)) console.log(`  · ${w}：${o.changed}/${o.n} 有變`);
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]); console.log(ok ? 'OK T624 全面守衛成立' : 'X T624 全面守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
