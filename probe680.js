// T680 守衛：街角店屋加高到三層＋孟莎屋頂老虎窗（同一次遊戲開關閥門 __noShopTall680，切換後清街區快取、重烘）。
//   ① 街區精靈：2×2 與 2×1 店屋（k2 lv1 v4）新版都比閥門版高（最高點離地多 ≥12px）、夜裡亮像素多；
//   ② 城中：種子城把 (13,2) 一塊 2×1 換成店屋（{k:2,lv:1,v:4,grid:[2,1]}），鏡頭 (12,5) 正午／午夜 z=2：新舊有差異，差異外接框在店屋那一帶（畫面右半、上半）；
//   --shots=前綴 時存 shop{New,Old}_{day,night}.png。
// 用法：node probe680.js [--shots=shots680/T680]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    const spr = await ev(`(()=>{const B=GV.block559,sv=window.__noShopTall680,out={};const st=s=>{const d=s.img.getContext('2d').getImageData(0,0,s.img.width,s.img.height).data,W=s.img.width;let top=1e9;for(let i=3;i<d.length;i+=4)if(d[i]>40){top=Math.floor((i>>2)/W);break;}
      let lit=0;if(s.night){const n=s.night.getContext('2d').getImageData(0,0,s.night.width,s.night.height).data;for(let i=3;i<n.length;i+=4)if(n[i]>40)lit++;}return {up:(s.ay|0)-top,lit};};
      try{for(const [nm,w,h] of [['2x2',2,2],['2x1',2,1]])for(const off of [false,true]){window.__noShopTall680=off;B.cache().clear();out[nm+(off?'old':'new')]=st(B.make(2,1,w,h,4));}}finally{window.__noShopTall680=sv;B.cache().clear();}return out;})()`);
    await ev(SEED); await sleep(700);
    await ev(`GV.art574.plant574([{x:13,y:2,k:2,lv:1,v:4,grid:[2,1]}]);GV.forceDraw();1`);
    const sty = await ev(`(()=>{const o=GV.block559.origin(13,2);const s=o&&o.k?GV.block559.get(o.k,o.lv,o.w,o.h,o.v):null;return s&&s.__t547&&String(s.__t547.sty);})()`);
    const city = [];
    for (const [vn, t] of [['day', .5], ['night', .02]]) {
      const q = await ev(`(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noShopTall680,sg=window.__noSignal,o={};
        const snap=off=>{window.__noShopTall680=off;GV.block559.cache().clear();window.__noSignal=true;GV.lookAt(12,5);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*${t});GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,W,H).data;};
        try{const A=snap(true);${SHOTS ? "o.uOld=cv.toDataURL('image/png');" : ''}const B=snap(false);${SHOTS ? "o.uNew=cv.toDataURL('image/png');" : ''}
          let n=0,x0=W,x1=-1,y0=H,y1=-1;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;const p=i/4,x=p%W,y=(p/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
          o.n=n;o.box=[x0,y0,x1,y1];o.W=W;o.H=H;}
        finally{window.__noShopTall680=sv;window.__noSignal=sg;GV.block559.cache().clear();}return o;})()`);
      q.view = vn; city.push(q);
    }
    return { spr, sty, city };
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const { spr, sty, city } = r.result;
  for (const v of city) for (const [k, tag] of [['uNew', 'New'], ['uOld', 'Old']]) if (v[k]) { const dest = path.join(ROOT, `${SHOTS}_shop${tag}_${v.view}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v[k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log('精靈 ' + JSON.stringify(spr) + '；(13,2) 立面 ' + sty);
  for (const v of city) console.log(`${v.view}：差異像素 ${v.n}，外接框 [${v.box.join(',')}]`);
  const checks = [
    ['(13,2) 換成店屋後立面是 ukCornerShopGPT001', String(sty).indexOf('ukCornerShopGPT001') >= 0],
    ['2×2、2×1 新版都比閥門版高 ≥12px、夜裡亮像素多', spr['2x2new'].up - spr['2x2old'].up >= 12 && spr['2x1new'].up - spr['2x1old'].up >= 12 && spr['2x2new'].lit > spr['2x2old'].lit && spr['2x1new'].lit > spr['2x1old'].lit],
    ['城中正午、午夜新舊有差異，外接框在畫面右上那一帶（店屋）', city.every(v => v.n > 0 && v.box[0] > v.W * .45 && v.box[3] < v.H * .6)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T680 守衛成立' : 'X T680 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
