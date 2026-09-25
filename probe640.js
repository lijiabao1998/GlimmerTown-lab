// T640 像素守衛：種子城住宅近景（看 (12,12)、z=1.5），同一瞬間 forceDraw 新（T640）與舊（__noDuskFade640）各一張：
//   ph 0.745（日落前）、ph 0.22（日出前）新舊逐像素相同；ph 0.755（剛落下）、0.765 新舊不同。
// 用法：node probe640.js [--shots=shots640/T640]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const PHS = [0.22, 0.745, 0.755, 0.765, 0.78];

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const rows = [];
    for (const ph of PHS) {
      const q = await ev(`(()=>{const c=document.getElementById('game'),g=c.getContext('2d'),sv=window.__noDuskFade640,o={ph:${ph}};
        try{GV.lookAt(12,12);GV.art574.zoom574(1.5);const vt=GV.art574.cycle574()*${ph};const im={};
          for(const [t,off] of [['new',false],['old',true]]){window.__noDuskFade640=off;GV.setVisT(vt);GV.forceDraw();im[t]=g.getImageData(0,0,c.width,c.height).data;o['dusk_'+t]=+GV.daylightDbg().dusk.toFixed(3);${SHOTS ? "o[t+'Url']=c.toDataURL('image/png');" : ''}}
          let diff=0;for(let i=0;i<im.new.length;i+=4)if(im.new[i]!==im.old[i]||im.new[i+1]!==im.old[i+1]||im.new[i+2]!==im.old[i+2])diff++;o.diff=diff;
        }finally{window.__noDuskFade640=sv;}return o;})()`);
      for (const t of ['new', 'old']) if (q[t + 'Url']) {
        const dest = path.join(ROOT, `${SHOTS}_${t}_${ph}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, Buffer.from(q[t + 'Url'].split(',')[1], 'base64')); delete q[t + 'Url'];
      }
      rows.push(q);
    }
    return rows;
  });
  const rows = r.result;
  console.log(JSON.stringify(rows || r.fails));
  if (!rows) process.exit(1);
  const at = ph => rows.find(q => q.ph === ph);
  const checks = [
    ['ph 0.22（日出前）新舊逐像素相同', at(0.22).diff === 0],
    ['ph 0.745（日落前）新舊逐像素相同', at(0.745).diff === 0],
    [`ph 0.755（剛落下）新舊不同（差 ${at(0.755).diff}；dusk 舊 ${at(0.755).dusk_old} → 新 ${at(0.755).dusk_new}）`, at(0.755).diff > 0 && at(0.755).dusk_old === 0 && at(0.755).dusk_new > 0.5],
    [`ph 0.78 dusk 已淡到 ${at(0.78).dusk_new}（< 0.35）`, at(0.78).dusk_new < 0.35],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T640 像素守衛成立' : 'X T640 像素守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
