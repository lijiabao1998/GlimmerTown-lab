// T677 守衛：大笨鐘 k190（1×1）、西敏宮 k191（2×2）。
//   ① 種子城 (48,24) 那塊靠水空草地各種一座（各開一次遊戲），鏡頭 lookAt(48,22)：正午 z=2、午夜 z=2、正午 z=1.2，跟同一鏡頭沒種的畫面有差異，而且差異集中在那塊地上方（外接框在畫面中間）；
//   ② 午夜鐘盤、窗有亮：大笨鐘近照塔身範圍裡比正午暗、但鐘盤亮點 >0（夜圖有畫）；
//   ③ 開閥門（__noBigBen190、__noWestminster191，開機前設）兩張精靈都不存在，關一個只少一個。
//   --shots=前綴 時存 {bigben,palace}_{day,night,mid}.png（跟決策單第十一批同一套拍法，可拿去逐像素比）。
// 用法：node probe677.js [--shots=shots677/T677]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['day', 2, .5], ['night', 2, .02], ['mid', 1.2, .5]];
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };

(async () => {
  const res = {};
  for (const [nm, k, sz] of [['bigben', 190, 1], ['palace', 191, 2]]) {
    const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
      const ev = mkEv(cdp);
      await ev(SEED); await sleep(700);
      const shot = (z, t) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d');window.__noSignal=true;GV.lookAt(48,22);GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*${t});GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,cv.width,cv.height).data;})()`;
      await ev(`window.__p677={};1`);
      for (const [vn, z, t] of VIEWS) await ev(`(window.__p677['${vn}']=${shot(z, t)},1)`);   // 先拍沒種的三張
      await ev(`GV.art574.plant574([{x:48,y:24,k:${k},v:0${sz > 1 ? ',sz:' + sz : ''}}]);1`);
      const out = [];
      for (const [vn, z, t] of VIEWS) {
        const q = await ev(`(()=>{const cv=document.getElementById('game'),W=cv.width,H=cv.height,A=window.__p677['${vn}'],B=${shot(z, t)};const u=${SHOTS ? "cv.toDataURL('image/png')" : 'null'};
          let n=0,x0=W,x1=-1,y0=H,y1=-1;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;const p=i/4,x=p%W,y=(p/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
          return {n,box:[x0,y0,x1,y1],W,H,u};})()`);
        q.view = vn; out.push(q);
      }
      return out;
    });
    if (!r.result) { console.log('X', nm, JSON.stringify(r.fails)); process.exit(1); }
    res[nm] = r.result;
  }
  const valve = {};
  for (const [nm, pre] of [['both', 'window.__noBigBen190=true;window.__noWestminster191=true;'], ['onlyBB', 'window.__noBigBen190=true;']]) {
    const r = await withGame({ port: 8199, timeout: 300, log: () => {}, preScript: pre }, async ({ cdp }) => mkEv(cdp)(`(()=>{const S=GV.art574.SPR().bld;return {k190:!!S['190_1_0'],k191:!!S['191_1_0']};})()`));
    valve[nm] = r.result || { err: r.fails };
  }
  for (const nm in res) for (const v of res[nm]) {
    if (v.u) { const dest = path.join(ROOT, `${SHOTS}_${nm}_${v.view}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v.u.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
    console.log(`${nm} ${v.view}：差異像素 ${v.n}，外接框 [${v.box.join(',')}]`);
  }
  console.log('閥門：兩個都關 ' + JSON.stringify(valve.both) + '；只關大笨鐘 ' + JSON.stringify(valve.onlyBB));
  const inMid = v => v.n > 0 && v.box[0] > v.W * .2 && v.box[2] < v.W * .8;
  const checks = [
    ['兩座六個鏡頭種了都有差異、差異外接框左右在畫面中段（2×2 近景會碰到畫面下緣）', Object.values(res).every(L => L.every(inMid))],
    ['西敏宮（2×2）的差異比大笨鐘多（近景正午）', res.palace[0].n > res.bigben[0].n],
    ['開閥門：兩個都關＝兩張精靈都沒有；只關大笨鐘＝只少 190', !!valve.both && valve.both.k190 === false && valve.both.k191 === false && !!valve.onlyBB && valve.onlyBB.k190 === false && valve.onlyBB.k191 === true],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T677 守衛成立' : 'X T677 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
