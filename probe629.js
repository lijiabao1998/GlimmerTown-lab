// T629 探針：夜間燈光穿牆。種子城三個夜景鏡頭（住宅近景 z=2、近景 z=1.5、中景 z=0.75，午夜），每個鏡頭拍三張：
//   O＝修正前（__noNightOcc629）、N＝修正後、E＝走光層但不擦（__nightOccNoErase629，驗管線等價）。
//   ① 只會變暗：N 與 O 逐像素比，RGB 總和變大超過 3 的像素數，不超過雜訊底線（修正前連拍兩次的變亮數）＋10。
//   ② 管線等價：E 與 O 任一通道差 >2 的像素比例（應 ≤1%）。
//   ③ 被擦掉的燈：N 比 O 暗超過 3 的像素數，以及光層統計（燈、遮擋、實際擦、略過）。
//   ④ 效能：每個鏡頭 O／N 各 forceDraw 20 次的中位數；白天住宅近景也量一次。
// 用法：node probe629.js [--shots=shots629/T629]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['home_night', 12, 12, 2, .02], ['near_night', 36, 36, 1.5, .02], ['mid_night', 36, 36, .75, .02], ['home_day', 12, 12, 2, .5]];
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = {};
    for (const [name, x, y, zz, ph] of VIEWS) {
      out[name] = await ev(`(()=>{const cv=document.getElementById('game'),c=cv.getContext('2d');
        const set=(occ,noErase)=>{window.__noNightOcc629=!occ;window.__nightOccNoErase629=!!noErase;};
        const cap=()=>c.getImageData(0,0,cv.width,cv.height).data.slice();
        const shot=()=>{GV.lookAt(${x},${y});GV.art574.zoom574(${zz});GV.setVisT(GV.art574.cycle574()*${ph});GV.forceDraw();};
        const time=()=>{const t=[];for(let i=0;i<20;i++){const a=performance.now();GV.forceDraw();t.push(performance.now()-a);}t.sort((p,q)=>p-q);return +t[10].toFixed(2);};
        set(false);shot();shot();const O=cap(),uO=cv.toDataURL('image/png'),tO=time();
        shot();const O2=cap();let noiseB=0,noiseD=0;for(let i=0;i<O.length;i+=4){const a1=O[i]+O[i+1]+O[i+2],a2=O2[i]+O2[i+1]+O2[i+2];if(a2>a1+3)noiseB++;else if(a2<a1-3)noiseD++;} // 雜訊底線：修正前連拍兩次
        set(true);shot();shot();const Nn=cap(),uN=cv.toDataURL('image/png'),st=window.__t629||null,tN=time();
        set(true,true);shot();shot();const E=cap();
        set(true,false);
        let brighter=0,darker=0,eqDiff=0,total=O.length/4;
        for(let i=0;i<O.length;i+=4){const so=O[i]+O[i+1]+O[i+2],sn=Nn[i]+Nn[i+1]+Nn[i+2];if(sn>so+3)brighter++;else if(sn<so-3)darker++;
          if(Math.abs(E[i]-O[i])>2||Math.abs(E[i+1]-O[i+1])>2||Math.abs(E[i+2]-O[i+2])>2)eqDiff++;}
        return {brighter,darker,eqPct:+(eqDiff/total*100).toFixed(3),noiseB,noiseD,stats:st,tO,tN,uO,uN};})()`);
    }
    await ev(`(()=>{window.__noNightOcc629=false;window.__nightOccNoErase629=false;return 1;})()`);
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  let pass = true;
  for (const [name] of VIEWS) {
    const q = r.result[name];
    if (SHOTS) for (const [tag, u] of [['old', q.uO], ['new', q.uN]]) { const dest = path.resolve(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); }
    const night = name !== 'home_day';
    const ok = q.brighter <= q.noiseB + 10 && q.eqPct <= 1 && (!night || q.darker > q.noiseD);   // 夜裡有依繪製次數閃動的燈：變亮以「修正前連拍兩次」的雜訊底線為準
    pass = pass && ok;
    const s = q.stats || {};
    console.log(`${name}：[雜訊底線：修正前連拍兩次 變亮 ${q.noiseB}／變暗 ${q.noiseD}] 變亮 ${q.brighter} 像素、被擦掉（變暗）${q.darker} 像素、光層不擦 vs 修正前 ${q.eqPct}%｜燈 ${s.lights ?? '-'}、遮擋 ${s.occ ?? '-'}（擦 ${s.erased ?? '-'}、略過 ${s.skipped ?? '-'}）｜耗時 ${q.tO}→${q.tN}ms（${(q.tN / q.tO * 100 - 100).toFixed(0)}%）${ok ? ' ✓' : ' ✗'}`);
  }
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
