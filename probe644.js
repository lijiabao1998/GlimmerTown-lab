// T644 像素守衛：種子城摩天樓中景（看 (24,9)、z=1.5），午夜（ph .02 附近、挑警示燈亮的那一幀）：
//   這一幀推進發光層的警示燈筆數（__t644Glow）> 0、關閥門（__noWarnGlow644）時 0；
//   紅色像素（R 高、明顯高於 G、B）新版比關閥門多；正午新舊逐像素相同。午夜、正午都關紅綠燈比（相位跟 draw 次數走，紅燈也是紅色像素，見 probe643）。另存午夜中景。
// 用法：node probe644.js [--shots=shots644/T644]   退出碼 0＝守衛成立
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
    const out = await ev(`(()=>{const sv=window.__noWarnGlow644,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const red=d=>{let n=0;for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2];if(r>150&&r>gg+60&&r>b+60)n++;}return n;};
      try{GV.lookAt(24,9);GV.art574.zoom574(1.5);const C=GV.art574.cycle574();let vt=C*.02;while(Math.floor(vt*3)%2!==0)vt+=.05;o.vt=+vt.toFixed(3);
        for(const [k,off] of [['new',false],['old',true]]){window.__noWarnGlow644=off;
          window.__noSignal=true;window.__t644Glow=0;GV.setVisT(vt);GV.forceDraw();o[k+'Glow']=window.__t644Glow|0;o[k+'Red']=red(g.getImageData(0,0,cv.width,cv.height).data);
          GV.setVisT(C*.5);GV.forceDraw();o[k+'Noon']=g.getImageData(0,0,cv.width,cv.height).data;window.__noSignal=sg;}
        let diff=0;for(let i=0;i<o.newNoon.length;i++)if(o.newNoon[i]!==o.oldNoon[i])diff++;o.noonDiff=diff;delete o.newNoon;delete o.oldNoon;
      }finally{window.__noWarnGlow644=sv;window.__noSignal=sg;}
      return o;})()`);
    if (SHOTS) for (const [k, off] of [['new', false], ['old', true]]) out['url_' + k] = await ev(`(()=>{const sv=window.__noWarnGlow644;try{window.__noWarnGlow644=${off};GV.setVisT(${out.vt});GV.forceDraw();return document.getElementById('game').toDataURL('image/png');}finally{window.__noWarnGlow644=sv;}})()`);
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['new', 'old']) if (q['url_' + k]) { const dest = path.join(ROOT, `${SHOTS}_night_${k}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url_' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`午夜 visT=${q.vt}：警示燈發光筆數 新 ${q.newGlow}／關閥門 ${q.oldGlow}｜紅色像素 新 ${q.newRed}／關閥門 ${q.oldRed}｜正午差 ${q.noonDiff} 位元組`);
  const checks = [
    [`亮燈那一幀發光筆數 ${q.newGlow} > 0，關閥門 0`, q.newGlow > 0 && q.oldGlow === 0],
    [`紅色像素 新 ${q.newRed} > 關閥門 ${q.oldRed}`, q.newRed > q.oldRed],
    ['正午新舊逐像素相同', q.noonDiff === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T644 像素守衛成立' : 'X T644 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
