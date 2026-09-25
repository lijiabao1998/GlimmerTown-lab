// T650 像素守衛：種子城港邊工業區 (40,40) z=2、正午，關紅綠燈比（見 probe643）：
//   舊卸貨門的深黑色（#2a2620 ±6）：「關閥門（__noDock650）有、新版沒有」的像素 > 1000（門拿掉了），「新版有、關閥門沒有」＝0（沒冒出新的黑塊）。
//   （卡面原寫「新版比關閥門少九成」；實量新版剩 847 個，全是兩版都有的建築落地陰影，同色但不是門，所以改比兩版的差集。）另存新舊各一張。
// 用法：node probe650.js [--shots=shots650/T650]   退出碼 0＝守衛成立
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
    return await ev(`(()=>{const sv=window.__noDock650,sg=window.__noSignal,o={};
      const cv=document.getElementById('game'),g=cv.getContext('2d');
      const dk=(d,i)=>Math.abs(d[i]-42)<=6&&Math.abs(d[i+1]-38)<=6&&Math.abs(d[i+2]-32)<=6,dark=d=>{let n=0;for(let i=0;i<d.length;i+=4)if(dk(d,i))n++;return n;};
      try{window.__noSignal=true;GV.lookAt(40,40);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);
        window.__noDock650=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;o.oldDark=dark(A);${SHOTS ? "o.urlOld=cv.toDataURL('image/png');" : ''}
        window.__noDock650=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;o.newDark=dark(B);${SHOTS ? "o.urlNew=cv.toDataURL('image/png');" : ''}
        let n=0,gone=0,added=0;for(let i=0;i<A.length;i+=4){if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;const a=dk(A,i),b=dk(B,i);if(a&&!b)gone++;if(b&&!a)added++;}o.diff=n;o.gone=gone;o.added=added;
      }finally{window.__noDock650=sv;window.__noSignal=sg;}
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const k of ['New', 'Old']) if (q['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`正午工業區：差異像素 ${q.diff}｜深黑像素 新 ${q.newDark}／關閥門 ${q.oldDark}｜拿掉 ${q.gone}、新冒出 ${q.added}`);
  const checks = [
    [`新舊有差異（${q.diff} > 0）`, q.diff > 0],
    [`舊門的深黑像素拿掉 ${q.gone} 個（> 1000）`, q.gone > 1000],
    [`沒冒出新的深黑像素（${q.added}＝0）`, q.added === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T650 像素守衛成立' : 'X T650 像素守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
