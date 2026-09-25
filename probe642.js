// T642 像素守衛：種子城住宅中景（看 (12,12)、z=1.5），日出前後兩格 ph .249（日出前約 0.1 秒）→ .251（日出後約 0.1 秒）的整張平均亮度差：
//   新版 < 關閥門（__noDawnFade642）的三分之一，且關閥門時差 > 8（對照有效：舊式在日出那一刻跳亮）。
//   （第一版用 .245→.255，太陽剛升起時日光本身 b 也在快速變亮（d^0.7），新版剩 4.9、舊版 14.1，比值 0.345 分不乾淨；縮窄到 ±0.001 只剩晨昏跳變）；
//   ph .20（淡入還沒開始）新舊逐像素相同。另存日出前後四格。
// 用法：node probe642.js [--shots=shots642/T642]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: process.env.PLOG ? (m => console.log('[h]', m)) : () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = await ev(`(()=>{const sv=window.__noDawnFade642,out={lum:{},shots:{}};
      const cv=document.getElementById('game'),g=cv.getContext('2d',{willReadFrequently:true});
      const grab=()=>g.getImageData(0,0,cv.width,cv.height).data;
      const lum=d=>{let s=0;for(let i=0;i<d.length;i+=4)s+=.299*d[i]+.587*d[i+1]+.114*d[i+2];return s/(d.length/4);};
      try{GV.lookAt(12,12);GV.art574.zoom574(1.5);const C=GV.art574.cycle574();
        for(const [tag,off] of [['new',false],['old',true]]){window.__noDawnFade642=off;
          for(const ph of [.2,.249,.251]){GV.setVisT(C*ph);GV.forceDraw();const d=grab();out.lum[tag+ph]=+lum(d).toFixed(2);if(ph===.2)out['px20'+tag]=d;}}
        const a=out.px20new,b=out.px20old;let diff=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])diff++;out.diff20=diff;delete out.px20new;delete out.px20old;
      }finally{window.__noDawnFade642=sv;}
      return out;})()`);
    if (SHOTS) for (const ph of [.215, .23, .245, .255]) out.shots[ph] = await ev(`(()=>{const sv=window.__noDawnFade642;try{window.__noDawnFade642=false;GV.setVisT(GV.art574.cycle574()*${ph});GV.forceDraw();return document.getElementById('game').toDataURL('image/png');}finally{window.__noDawnFade642=sv;}})()`);
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const [ph, url] of Object.entries(q.shots || {})) { const dest = path.join(ROOT, `${SHOTS}_dawn_${ph}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(url.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  const jn = Math.abs(q.lum['new0.251'] - q.lum['new0.249']), jo = Math.abs(q.lum['old0.251'] - q.lum['old0.249']);
  console.log(`平均亮度 新版 .20/.249/.251＝${q.lum['new0.2']}/${q.lum['new0.249']}/${q.lum['new0.251']}｜關閥門 ${q.lum['old0.2']}/${q.lum['old0.249']}/${q.lum['old0.251']}`);
  const checks = [
    [`日出那一格亮度差 新版 ${jn.toFixed(2)} < 關閥門 ${jo.toFixed(2)} 的三分之一`, jn < jo / 3],
    [`關閥門時日出那一格亮度差 ${jo.toFixed(2)} > 8（對照有效）`, jo > 8],
    [`ph .20 新舊逐像素相同（差 ${q.diff20} 個位元組）`, q.diff20 === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T642 像素守衛成立' : 'X T642 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
