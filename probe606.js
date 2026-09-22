// T606 疊畫落點稽核探針：在種子城幾個位置各畫一幀、抓實際畫到的建築，逐層離線重放量像素落點。
//  node probe606.js [--z=1.5] [--at=30,40;46,30;36,36] [--only=599,421] [--night] [--json=out.json]
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const Z = +arg('z', 1.5), AT = arg('at', '30,40;46,30;36,36;24,24;50,46').split(';').map(p => p.split(',').map(Number));
const ONLY = arg('only', ''), JSONOUT = arg('json', ''), SEED = +arg('seed', 5162026), PORT = +arg('port', 8199), MAX = +arg('max', 260);
const VALVES = arg('valves', ''), EFF = process.argv.includes('--effective');
(async () => {
  const r = await withGame({ port: PORT, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}${VALVES ? VALVES.split(',').map(v => `window.${v}=true;`).join('') : ''}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');
    await ev(`window.__ovCapMax606=${MAX};window.__ovCap606=[];1`);
    for (const [x, y] of AT) { await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${x},${y});GV.art574.zoom574(0.8);(typeof GV.forceDraw==='function')&&GV.forceDraw();1`); await sleep(700); }
    const n = await ev('window.__ovCap606.length');
    await ev('(()=>{const seen=new Set();window.__ovCap606=window.__ovCap606.filter(it=>{const k=it.o.x+","+it.o.y;if(seen.has(k))return false;seen.add(k);return true});window.__ovCapKeep606=window.__ovCap606;window.__ovCap606=null;return 1})()');
    const only = ONLY ? JSON.stringify(ONLY.split(',')) : 'null';
    const day = await ev(`GV.overlayAudit606({z:${Z},night:0,list:window.__ovCapKeep606,only:${only},effective:${EFF}})`);
    const night = await ev(`GV.overlayAudit606({z:${Z},night:1,list:window.__ovCapKeep606,only:${only},effective:${EFF}})`);
    const kinds = await ev(`(()=>{const c={};for(const it of window.__ovCapKeep606){const s=it.s;const k=(it.bd.k)+(s&&s.__t547?(s.__t547.sty&&String(s.__t547.sty).startsWith('f577')?'/立面':'/街區'):'/舊圖');c[k]=(c[k]||0)+1;}return c})()`);
    return { captured: n, day, night, kinds };
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const { day, night, kinds, captured } = r.result;
  if (JSONOUT) fs.writeFileSync(path.join(ROOT, JSONOUT), JSON.stringify(r.result, null, 1));
  console.log(`抓到 ${captured} 次繪製，去重 ${day.n} 棟（街區精靈 ${day.blocks}）；z=${Z}`);
  console.log('種類：' + JSON.stringify(kinds));
  console.log('層    | 日：畫到棟 像素  浮空%  牆%  (街區精靈：浮空% 牆%) | 夜：畫到棟 像素 浮空%');
  for (const k of Object.keys(day.layers)) { const d = day.layers[k], nn = night.layers[k];
    console.log(`${k.padEnd(5)} | ${String(d.drew).padStart(4)} ${String(d.px).padStart(7)} ${String(d.floatPct).padStart(6)} ${String(d.wallPct).padStart(5)}  (${String(d.blkFloatPct).padStart(5)} ${String(d.blkWallPct).padStart(5)}) | ${String(nn.drew).padStart(4)} ${String(nn.px).padStart(7)} ${String(nn.floatPct).padStart(6)}${d.err ? ' 錯' + d.err : ''}`); }
  process.exit(0);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
