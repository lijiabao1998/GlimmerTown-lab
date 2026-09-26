// T678 守衛：巴特西 2×2（k192）。
//   ① 種子城 (48,24) 那塊靠水空草地種 k192（sz 2），鏡頭 lookAt(48,22)：正午 z=2、午夜 z=2、正午 z=1.2，跟同一鏡頭沒種的畫面有差異、外接框左右在畫面中段；
//   ② 2×2 的差異比同一塊地種舊的 1×1 k189 多（近景正午）；
//   ③ 開閥門 __noBattersea192（開機前設）k192 精靈不存在、k189 還在。
//   --shots=前綴 時存 batt2_{day,night,mid}.png。
// 用法：node probe678.js [--shots=shots678/T678]   退出碼 0＝守衛成立
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
  for (const [nm, k, sz] of [['batt1', 189, 1], ['batt2', 192, 2]]) {
    const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
      const ev = mkEv(cdp);
      await ev(SEED); await sleep(700);
      const shot = (z, t) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d');window.__noSignal=true;GV.lookAt(48,22);GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*${t});GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,cv.width,cv.height).data;})()`;
      await ev(`window.__p678={};1`);
      for (const [vn, z, t] of VIEWS) await ev(`(window.__p678['${vn}']=${shot(z, t)},1)`);   // 先拍沒種的三張
      await ev(`GV.art574.plant574([{x:48,y:24,k:${k},v:0${sz > 1 ? ',sz:' + sz : ''}}]);1`);
      const out = [];
      for (const [vn, z, t] of VIEWS) {
        const q = await ev(`(()=>{const cv=document.getElementById('game'),W=cv.width,H=cv.height,A=window.__p678['${vn}'],B=${shot(z, t)};const u=${SHOTS ? "cv.toDataURL('image/png')" : 'null'};
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
  for (const [nm, pre] of [['off', 'window.__noBattersea192=true;']]) {
    const r = await withGame({ port: 8199, timeout: 300, log: () => {}, preScript: pre }, async ({ cdp }) => mkEv(cdp)(`(()=>{const S=GV.art574.SPR().bld;return {k189:!!S['189_1_0'],k192:!!S['192_1_0']};})()`));
    valve[nm] = r.result || { err: r.fails };
  }
  for (const nm in res) for (const v of res[nm]) {
    if (v.u) { const dest = path.join(ROOT, `${SHOTS}_${nm}_${v.view}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v.u.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
    console.log(`${nm} ${v.view}：差異像素 ${v.n}，外接框 [${v.box.join(',')}]`);
  }
  console.log('閥門 __noBattersea192：' + JSON.stringify(valve.off));
  const inMid = v => v.n > 0 && v.box[0] > v.W * .2 && v.box[2] < v.W * .8;
  const checks = [
    ['k192 三個鏡頭種了都有差異、差異外接框左右在畫面中段', res.batt2.every(inMid)],
    ['2×2 的差異比同一塊地種舊 1×1 k189 多（近景正午）', res.batt2[0].n > res.batt1[0].n],
    ['開閥門 __noBattersea192：k192 精靈不存在、k189 還在', !!valve.off && valve.off.k192 === false && valve.off.k189 === true],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T678 守衛成立' : 'X T678 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
