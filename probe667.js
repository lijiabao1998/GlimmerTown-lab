// T667 守衛：種子城。
//   午夜：(44,40) z=1、(50,44) z=2、(48,48) z=0.6（遠景也要壓暗）；水面遮罩內像素平均亮度 新 ≤ 關閥門（__noNightWater667）× 0.8；
//         遮罩外（完全透明處）新舊逐像素相同。正午：新舊逐像素相同。關紅綠燈比（見 probe643）。--shots 時各存新舊一張。
// 用法：node probe667.js [--shots=shots667/T667]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['river', 44, 40, 1, 0], ['bay', 50, 44, 2, 0], ['far', 48, 48, .6, 0], ['noon', 44, 40, 1, .5]];

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = [];
    for (const [n, x, y, z, ph] of VIEWS) {
      const q = await ev(`(()=>{const sv=window.__noNightWater667,sg=window.__noSignal,o={};const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*${ph});GV.testRebake592();
          window.__noNightWater667=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s667o=cv.toDataURL('image/png');" : ''}
          window.__noNightWater667=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s667n=cv.toDataURL('image/png');" : ''}
          const M=GV.NW667.ready?GV.NW667.mask.getContext('2d').getImageData(0,0,cv.width,cv.height).data:null;
          let inN=0,la=0,lb=0,outDiff=0,allDiff=0;const L=(d,i)=>.3*d[i]+.59*d[i+1]+.11*d[i+2];
          for(let i=0;i<A.length;i+=4){const df=A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2];if(df)allDiff++;const m=M?M[i+3]:0;
            if(m===255){inN++;la+=L(A,i);lb+=L(B,i);}else if(m===0&&df)outDiff++;}
          o.inN=inN;o.lumOld=inN?la/inN:0;o.lumNew=inN?lb/inN:0;o.outDiff=outDiff;o.allDiff=allDiff;o.tiles=GV.NW667.tiles;
        }finally{window.__noNightWater667=sv;window.__noSignal=sg;}return o;})()`);
      if (SHOTS) { q.urlOld = await ev('window.__s667o'); q.urlNew = await ev('window.__s667n'); }
      q.name = n; out.push(q);
    }
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const v of q) for (const k of ['New', 'Old']) if (v['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${v.name}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  for (const v of q) console.log(`${v.name}：水格 ${v.tiles}、遮罩內 ${v.inN} px 平均亮度 新 ${v.lumNew.toFixed(1)}／關閥門 ${v.lumOld.toFixed(1)}（${v.lumOld ? (v.lumNew / v.lumOld).toFixed(3) : '-'}）｜遮罩外差異 ${v.outDiff}｜全圖差異 ${v.allDiff}`);
  const night = q.filter(v => v.name !== 'noon'), noon = q.find(v => v.name === 'noon');
  const checks = [
    [`午夜三個鏡頭水面都變暗到 ≤ 0.8（${night.map(v => (v.lumNew / v.lumOld).toFixed(3)).join('、')}）`, night.every(v => v.inN > 1000 && v.lumNew <= v.lumOld * 0.8)],
    [`午夜遮罩外逐像素相同（${night.map(v => v.outDiff).join('、')}）`, night.every(v => v.outDiff === 0)],
    [`正午新舊逐像素相同（${noon.allDiff}）`, noon.allDiff === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T667 守衛成立' : 'X T667 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
