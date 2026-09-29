// T693 守衛：夠長的直線水橋長成塔橋（同一次遊戲開關閥門 __noTowerBridge693／__noTowerBridgeWide693，切換後 testRebake592 重烘）。
//   ① 種子城 x=40、y=41–50 造路（跨南方河帶的 5 格水橋，同決策單原型鏡頭）：選中 L=5、推 11 個塔橋物件；
//   ② 閥門下 draw 不推塔橋物件；同鏡頭 z=2 正午、午夜新舊差異 >5,000 像素，外接框在畫面中段（左右各留 15%）；
//   ③ 再造 y=55、x=44–54 的 7 格直線橋：選中改成它（一城一座取最長）、寬中跨 3 格；寬閥門下回 1 格；
//   --shots=前綴 時存 tb{New,Old}_{day,night}.png 與 tbL7.png。
// 用法：node probe693.js [--shots=shots693/T693]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
// 同一次 evaluate 裡拍「閥門版→新版→閥門版」：兩張閥門版相同才算水面沒換幀（不同就再來一次）
const PAIR = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noTowerBridge693,sg=window.__noSignal,o={};
  const snap=off=>{window.__noTowerBridge693=off;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  const same=(A,B)=>{for(let i=0;i<A.length;i++)if(A[i]!==B[i])return false;return true;};
  try{for(let k=0;k<3;k++){const A=snap(true);${SHOTS ? "o.uOld=cv.toDataURL('image/png');" : ''}const B=snap(false);${SHOTS ? "o.uNew=cv.toDataURL('image/png');" : ''}o.pushed=window.__tb693Pushed|0;const A2=snap(true);
      if(!same(A,A2))continue;let n=0,x0=W,x1=-1,y0=H,y1=-1;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;const p=i/4,x=p%W,y=(p/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
      o.n=n;o.box=[x0,y0,x1,y1];o.W=W;o.H=H;o.tries=k+1;break;}}
  finally{window.__noTowerBridge693=sv;window.__noSignal=sg;GV.testRebake592();GV.forceDraw();}return o;})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    const o = {};
    o.bad5 = await ev(`(()=>{const bad=[];for(let y=41;y<=50;y++)if(!GV.place('road',40,y))bad.push(y);GV.testRebake592();GV.forceDraw();return bad;})()`);
    o.stat5 = await ev(`(()=>{window.__noSignal=true;GV.lookAt(40,45);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();return {stat:JSON.parse(JSON.stringify(window.__tb693Stat||null)),pushed:window.__tb693Pushed|0};})()`);
    o.valve = await ev(`(()=>{const sv=window.__noTowerBridge693;try{window.__noTowerBridge693=true;window.__tb693Pushed=-1;GV.testRebake592();GV.forceDraw();return window.__tb693Pushed;}finally{window.__noTowerBridge693=sv;GV.testRebake592();GV.forceDraw();}})()`);
    o.city = [];
    for (const [vn, t] of [['day', .5], ['night', .02]]) { const q = await ev(PAIR(40, 45, 2, t)); q.view = vn; o.city.push(q); }
    o.bad7 = await ev(`(()=>{const bad=[];for(let x=44;x<=54;x++)if(!GV.place('road',x,55))bad.push(x);return bad;})()`);
    o.stat7 = await ev(`(()=>{window.__noSignal=true;GV.lookAt(49,55);GV.art574.zoom574(1.5);GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();return {stat:JSON.parse(JSON.stringify(window.__tb693Stat||null)),pushed:window.__tb693Pushed|0${SHOTS ? ",u:document.getElementById('game').toDataURL('image/png')" : ''}};})()`);
    o.stat7w = await ev(`(()=>{const sv=window.__noTowerBridgeWide693;try{window.__noTowerBridgeWide693=true;GV.testRebake592();GV.forceDraw();return JSON.parse(JSON.stringify(window.__tb693Stat||null));}finally{window.__noTowerBridgeWide693=sv;GV.testRebake592();GV.forceDraw();}})()`);
    o.selftest = await ev(`window.GV.towerBridgeSelftest693()`);
    return o;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result;
  const save = (u, nm) => { if (!u) return; const dest = path.join(ROOT, `${SHOTS}_${nm}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); };
  if (SHOTS) { for (const v of o.city) { save(v.uNew, 'tbNew_' + v.view); save(v.uOld, 'tbOld_' + v.view); } save(o.stat7.u, 'tbL7'); }
  const p5 = o.stat5.stat && o.stat5.stat.picked || [], p7 = o.stat7.stat && o.stat7.stat.picked || [], p7w = o.stat7w && o.stat7w.picked || [];
  console.log('造路失敗格 ' + JSON.stringify(o.bad5) + ' / ' + JSON.stringify(o.bad7) + '；5 格：' + JSON.stringify(o.stat5) + '；閥門下推 ' + o.valve);
  for (const v of o.city) console.log(`${v.view}：差異像素 ${v.n}，外接框 [${(v.box || []).join(',')}]，新版推 ${v.pushed}，試 ${v.tries} 次`);
  console.log('7 格：' + JSON.stringify({ picked: p7, pushed: o.stat7.pushed }) + '；寬閥門 ' + JSON.stringify(p7w));
  console.log('自檢 towerBridge693：' + JSON.stringify(o.selftest));
  const checks = [
    ['造路全部成功', o.bad5.length === 0 && o.bad7.length === 0],
    ['5 格水橋被選中（L=5、直線）、推 11 個塔橋物件', p5.length === 1 && p5[0].L === 5 && o.stat5.pushed === 11],
    ['閥門 __noTowerBridge693 下 draw 不推塔橋物件', o.valve === -1],
    ['正午、午夜新舊差異 >5,000 像素，外接框在畫面中段（左右各留 15%）', o.city.every(v => v.n > 5000 && v.box[0] > v.W * .15 && v.box[2] < v.W * .85)],
    ['造了 7 格直線橋後選中改成它（一城一座取最長）、寬中跨 3 格、推 11 個', p7.length === 1 && p7[0].L === 7 && p7[0].wide === true && o.stat7.pushed === 11],
    ['寬閥門 __noTowerBridgeWide693 下 7 格橋中央跨回 1 格', p7w.length === 1 && p7w[0].L === 7 && p7w[0].wide === false],
    ['自檢 towerBridge693 綠', !!(o.selftest && o.selftest.ok)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T693 守衛成立' : 'X T693 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
