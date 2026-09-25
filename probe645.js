// T645 像素守衛：種子城住宅近景（(12,12)、z=2）與中景（(24,20)、z=1.5），正午：
//   新舊（__noMassWin645）畫面有差異；差異像素裡，舊版是窗玻璃色（偏藍：B ≥ R+15）的佔多數（≥ 0.7）＝差異落在拿掉的窗上。
//   （卡面原寫「地面、道路逐像素相同」，但遊戲沒有只畫地面的開關，改用這個代理；見卡片第 6 節。）
//   關紅綠燈比（相位跟 draw 次數走，見 probe643）。另存近景、中景新舊各一張。
// 用法：node probe645.js [--shots=shots645/T645]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = {};
    for (const [tag, look, z] of [['home', [12, 12], 2], ['mid', [24, 20], 1.5]]) {
      out[tag] = await ev(`(()=>{const sv=window.__noMassWin645,sg=window.__noSignal,o={};
        const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;GV.lookAt(${look[0]},${look[1]});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);
          window.__noMassWin645=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
          window.__noMassWin645=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
          let n=0,glass=0;for(let i=0;i<A.length;i+=4){if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;if(A[i+2]>=A[i]+15)glass++;}}
          o.diff=n;o.glass=glass;
        }finally{window.__noMassWin645=sv;window.__noSignal=sg;}
        return o;})()`);
    }
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const checks = [];
  for (const tag of ['home', 'mid']) {
    const v = q[tag];
    for (const k of ['New', 'Old']) if (v['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${tag}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
    const share = v.diff ? v.glass / v.diff : 0;
    console.log(`${tag}：差異像素 ${v.diff}，其中舊版是窗玻璃色 ${v.glass}（${(share * 100).toFixed(1)}%）`);
    checks.push([`${tag} 新舊有差異（${v.diff} > 0）`, v.diff > 0]);
    checks.push([`${tag} 差異裡舊版是窗玻璃色佔 ${(share * 100).toFixed(1)}% ≥ 70%`, share >= .7]);
  }
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T645 像素守衛成立' : 'X T645 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
