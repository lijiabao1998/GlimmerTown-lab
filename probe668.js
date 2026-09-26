// T668 守衛：種子城、冬天，(67,23)、(62,27) z=2 正午，關紅綠燈。
//   閥門 __noBareTrunkColor668 在建精靈時讀，所以開兩次遊戲：一次開機前設閥門（舊）、一次不設（新）。
//   舊版禿枝的暗面是描邊色 (24,40,28) × 0.7＝(17,28,20)，畫面上只有舊禿枝會用到它：新版這個色的像素要比舊版少九成以上；兩版畫面雜湊不同。
//   --shots 時各存新舊一張。
// 用法：node probe668.js [--shots=shots668/T668]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['flat', 67, 23], ['mix', 62, 27]];

async function run(old) {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {}, preScript: old ? 'window.__noBareTrunkColor668=true;' : '' }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);GV.setSeason(3);return 1;})()`);
    await sleep(800);
    const out = [];
    for (const [n, x, y] of VIEWS) {
      const q = await ev(`(()=>{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();
        const cv=document.getElementById('game'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let dk=0,h=2166136261>>>0;
        for(let i=0;i<d.length;i+=4){if(d[i]===17&&d[i+1]===28&&d[i+2]===20)dk++;h^=d[i]^(d[i+1]<<8)^(d[i+2]<<16);h=Math.imul(h,16777619)>>>0;}
        return {dk,h,bare:window.__tBareDSK1|0,url:${SHOTS ? "cv.toDataURL('image/png')" : 'null'}};})()`);
      q.name = n; out.push(q);
    }
    return { out, marks: await ev(`(()=>{const S=GV.art574.SPR();return (S.treeWBare||[]).filter(Boolean).map(b=>b.img.__src668||'').join(',');})()`) };
  });
  if (!r.result) throw new Error(JSON.stringify(r.fails));
  return r.result;
}

(async () => {
  const O = await run(true), Nw = await run(false);
  O.out.forEach((o, k) => {
    const n = Nw.out[k];
    for (const [tag, v] of [['old', o], ['new', n]]) if (v.url) { const dest = path.join(ROOT, `${SHOTS}_${o.name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v.url.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
    console.log(`${o.name}：舊禿枝暗面色 (17,28,20) 像素 新 ${n.dk}／舊 ${o.dk}｜畫面雜湊 ${n.h === o.h ? '相同' : '不同'}`);
  });
  console.log(`枝色來源 新：${Nw.marks}｜舊：${O.marks}`);
  const checks = [
    [`兩個鏡頭新舊畫面不同`, O.out.every((o, k) => o.h !== Nw.out[k].h)],
    [`舊禿枝暗面色新版少九成以上（${O.out.map((o, k) => Nw.out[k].dk + '/' + o.dk).join('、')}）`, O.out.every((o, k) => o.dk > 100 && Nw.out[k].dk <= o.dk * 0.1)],
    [`舊版開機真的走閥門（來源都是 old）`, O.marks.split(',').every(m => m === 'old')],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T668 守衛成立' : 'X T668 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
