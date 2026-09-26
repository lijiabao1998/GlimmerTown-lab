// T679 守衛：白塔打磨（開機時烘，所以開兩次遊戲：預設／開機前設閥門 __noKeepPolish679）。
//   ① 精靈層：預設 v0、v1 的鉛灰、金色像素比閥門版多（蔥頂、風標），v0 最高列往上（旗移到蔥頂）；閥門版的數字等於 T678 量的舊精靈（v0 鉛灰 54／v1 80、金 6／6、v0 最高列 74）；
//      兩版 v0、v1 精靈 CRC 都不同，尺寸錨點相同。
//   ② 城中：種子城 (48,24) 種 k188 v0，鏡頭 lookAt(48,22) 正午／午夜 z=2（跟決策單第十一批同一套拍法）；--shots=前綴 時存 keep{New,Old}_{day,night}.png 與 v0／v1 精靈近照。
// 用法：node probe679.js [--shots=shots679/T679]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const STAT = `(()=>{const crc=d=>{let h=2166136261>>>0;for(let i=0;i<d.length;i++){h^=d[i];h=Math.imul(h,16777619)>>>0;}return h;};const out={};for(const k of ['188_1_0','188_1_1']){const s=GV.art574.SPR().bld[k];const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
  let top=999,lead=0,gold=0;for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=(y*s.w+x)*4;if(d[i+3]<=40)continue;if(y<top)top=y;const r=d[i],g=d[i+1],b=d[i+2];if(b>r+6&&b>=g&&r>90&&r<200&&d[i+3]>200)lead++;if(r>170&&g>130&&b<90)gold++;}
  out[k]={w:s.w,h:s.h,ax:s.ax,ay:s.ay,top,lead,gold,crc:crc(d),u:${SHOTS ? "(()=>{const c=document.createElement('canvas');c.width=s.w*3;c.height=s.h*3;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#cfd6cf';g.fillRect(0,0,c.width,c.height);g.drawImage(s.img,0,0,c.width,c.height);return c.toDataURL('image/png');})()" : 'null'}};}return out;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };

(async () => {
  const R = {};
  for (const [nm, pre] of [['New', ''], ['Old', 'window.__noKeepPolish679=true;']]) {
    const r = await withGame({ port: 8199, timeout: 400, log: () => {}, preScript: pre || undefined }, async ({ cdp }) => {
      const ev = mkEv(cdp);
      const st = await ev(STAT);
      await ev(SEED); await sleep(700);
      await ev(`GV.art574.plant574([{x:48,y:24,k:188,v:0}]);1`);
      const shots = {};
      if (SHOTS) for (const [vn, t] of [['day', .5], ['night', .02]])
        shots[vn] = await ev(`(()=>{window.__noSignal=true;GV.lookAt(48,22);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*${t});GV.testRebake592();GV.forceDraw();return document.getElementById('game').toDataURL('image/png');})()`);
      return { st, shots };
    });
    if (!r.result) { console.log('X', nm, JSON.stringify(r.fails)); process.exit(1); }
    R[nm] = r.result;
  }
  const save = (n, u) => { const dest = path.join(ROOT, `${SHOTS}_${n}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); };
  if (SHOTS) for (const nm of ['New', 'Old']) { for (const vn in R[nm].shots) save(`keep${nm}_${vn}`, R[nm].shots[vn]); for (const k of ['188_1_0', '188_1_1']) save(`keep${nm}_sprite_v${k.slice(-1)}`, R[nm].st[k].u); }
  const N0 = R.New.st['188_1_0'], N1 = R.New.st['188_1_1'], O0 = R.Old.st['188_1_0'], O1 = R.Old.st['188_1_1'];
  for (const [n, a] of [['新 v0', N0], ['新 v1', N1], ['閥門 v0', O0], ['閥門 v1', O1]]) console.log(`${n}：最高列 ${a.top}、鉛灰 ${a.lead}、金 ${a.gold}、CRC ${a.crc}`);
  const geo = a => a.w === 72 && a.h === 136 && a.ax === 36 && a.ay === 134;
  const checks = [
    ['四張精靈尺寸錨點相同（72×136、36,134）', [N0, N1, O0, O1].every(geo)],
    ['閥門版等於舊精靈（v0 鉛灰 54、金 6、最高列 74；v1 鉛灰 80、金 6）', O0.lead === 54 && O0.gold === 6 && O0.top === 74 && O1.lead === 80 && O1.gold === 6],
    ['新版蔥頂、風標：鉛灰與金色都比閥門版多（v0、v1）', N0.lead > O0.lead + 40 && N1.lead > O1.lead + 40 && N0.gold > O0.gold + 2 && N1.gold > O1.gold + 2],
    ['新版 v0 旗移到蔥頂上：最高列往上 ≥6', N0.top <= O0.top - 6],
    ['v0、v1 新舊 CRC 都不同', N0.crc !== O0.crc && N1.crc !== O1.crc],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T679 守衛成立' : 'X T679 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
