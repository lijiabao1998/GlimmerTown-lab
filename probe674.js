// T674 守衛：冬天落葉樹禿枝（主幹往上、細枝多、細枝霧）。禿枝精靈在開機時建，所以開兩次遊戲：預設（新）、預設前設 __noBareTwig674（舊）。
//   冬天 (62,26) z=3、z=1.5 正午：新舊有差異；夏天同鏡頭：新舊逐像素相同（只動冬天）。
//   --shots=資料夾 時存冬天新舊各兩張。
// 用法：node probe674.js [--shots=shots674/T674]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['near', 62, 26, 3], ['mid', 62, 26, 1.5]];

const run = old => withGame({ port: 8199, timeout: 400, log: () => {}, preScript: old ? 'window.__noBareTwig674=true;' : '' }, async ({ cdp }) => {
  const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
    if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
  await ev(`window.GV.metroArtSeedWorld516(5162026)`);
  await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
  await sleep(700);
  const out = {};
  // 每張畫面只回傳雜湊與 PNG（不回傳整張像素陣列，會卡住）
  const snap = (x, y, z) => `(()=>{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();
    const cv=document.getElementById('game'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let h=2166136261>>>0;for(let i=0;i<d.length;i++){if((i&3)===3)continue;h^=d[i];h=Math.imul(h,16777619)>>>0;}
    return {h,u:${SHOTS ? "cv.toDataURL('image/png')" : 'null'}};})()`;
  for (const [season, sv] of [['summer', 1], ['winter', 3]]) {
    await ev(`GV.setSeason(${sv})`); await sleep(300);
    for (const [vn, x, y, z] of VIEWS) out[season + '_' + vn] = await ev(snap(x, y, z));
  }
  return out;
});

(async () => {
  const N = await run(false), O = await run(true);
  if (!N.ok || !O.ok) { console.log(JSON.stringify([N.fails, O.fails])); process.exit(1); }
  const n = N.result, o = O.result;
  if (SHOTS) for (const [vn] of VIEWS) for (const [tag, q] of [['new', n], ['old', o]]) {
    const u = q['winter_' + vn].u; if (!u) continue;
    const dest = path.join(ROOT, `${SHOTS}_${vn}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest));
  }
  for (const k of Object.keys(n)) console.log(`${k}：新 ${n[k].h.toString(16)}／舊 ${o[k].h.toString(16)}${n[k].h === o[k].h ? '（相同）' : '（不同）'}`);
  const checks = [
    ['冬天兩個鏡頭新舊不同', VIEWS.every(([vn]) => n['winter_' + vn].h !== o['winter_' + vn].h)],
    ['夏天兩個鏡頭新舊逐像素相同（只動冬天）', VIEWS.every(([vn]) => n['summer_' + vn].h === o['summer_' + vn].h)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T674 守衛成立' : 'X T674 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
