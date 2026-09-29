// T695 守衛：英式地標近距細節層（C）＋鐘會走（hm）。同一次遊戲開關閥門 __noNearUK695（執行期）。
//   地標輪流種在種子城 (48,24)（k190 大笨鐘、k192 巴特西 2×2、k188 白塔），鏡頭 lookAt(48,22)：
//   ① z=2 正午、z=2 午夜、z=3 午夜：新舊差異 >0，差異外接框不超過「精靈寬高 × 縮放 + 8px」（只改地標自己）；
//   ② z=1.2 正午：新舊相同（低於 1.22 不畫）；
//   ③ 大笨鐘 z=2：鐘面時刻 10:00 與 10:30 兩張不同（鐘會走；差異只在鐘盤，≤300 像素）；閥門下兩張相同（遠景是 T694 烘的 3:00）；
//   ④ 自檢 nearUK695、keepDSK3（T659，閥門下驗舊層）都綠。
// 用法：node probe695.js [--shots=shots695/T695]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
// 同一次 evaluate：閥門版→新版→閥門版（兩張閥門版相同才算水面沒換幀）
const PAIR = (Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noNearUK695,sg=window.__noSignal,o={};
  const snap=off=>{window.__noNearUK695=off;window.__noSignal=true;GV.lookAt(48,22);GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  const same=(A,B)=>{for(let i=0;i<A.length;i++)if(A[i]!==B[i])return false;return true;};
  try{for(let k=0;k<3;k++){const A=snap(true);${SHOTS ? "o.uOld=cv.toDataURL('image/png');" : ''}const B=snap(false);${SHOTS ? "o.uNew=cv.toDataURL('image/png');" : ''}const A2=snap(true);
      if(!same(A,A2))continue;let n=0,x0=W,x1=-1,y0=H,y1=-1;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;const p=i/4,x=p%W,y=(p/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
      o.n=n;o.bw=n?x1-x0+1:0;o.bh=n?y1-y0+1:0;o.tries=k+1;break;}}
  finally{window.__noNearUK695=sv;window.__noSignal=sg;GV.testRebake592();GV.forceDraw();}return o;})()`;
// 大笨鐘鐘面兩個時刻（10:00、10:30；用鐘面時刻鉤子 __clockH695，天光固定正午，只比鐘）同鏡頭 z=2；off＝閥門
const CLOCK = off => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noNearUK695,sg=window.__noSignal;
  const snap=h=>{window.__noNearUK695=${off};window.__clockH695=h;window.__noSignal=true;GV.lookAt(48,22);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  const sh=window.__clockH695;try{const A=snap(10),B=snap(10.5);let n=0,x0=W,x1=-1;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){n++;const x=(i/4)%W;if(x<x0)x0=x;if(x>x1)x1=x;}return n;}finally{window.__noNearUK695=sv;window.__noSignal=sg;window.__clockH695=sh;}})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 600, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    const out = { lm: {} };
    for (const [tag, k, v, sz] of [['k190', 190, 0, 1], ['k192', 192, 0, 2], ['k188', 188, 0, 1]]) {
      await ev(`GV.art574.plant574([{x:48,y:24,k:${k},v:${v}${sz === 2 ? ',sz:2' : ''}}]);1`);
      const s = await ev(`(()=>{const s=GV.art574.SPR().bld['${k}_1_${v}'];return {w:s.w,h:s.h};})()`);
      const q = { s, views: {} };
      for (const [vn, z, t] of [['day', 2, .5], ['night', 2, .02], ['night3', 3, .02], ['mid', 1.2, .5]]) { q.views[vn] = await ev(PAIR(z, t)); q.views[vn].z = z; }
      if (k === 190) { q.clockNew = await ev(CLOCK(false)); q.clockOff = await ev(CLOCK(true)); }
      out.lm[tag] = q;
      if (SHOTS) for (const vn of ['day', 'night3']) for (const [kk, tg] of [['uNew', 'New'], ['uOld', 'Old']]) { const u = q.views[vn][kk]; if (u) { const dest = path.join(ROOT, `${SHOTS}_${tag}_${tg}_${vn}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); } }
      for (const vn in q.views) { delete q.views[vn].uNew; delete q.views[vn].uOld; }
      await ev(`(()=>{for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)GV.place('doze',48+dx,24+dy);GV.testRebake592();GV.forceDraw();return 1;})()`);
    }
    out.self = await ev('GV.nearUKSelftest695()'); out.dsk3 = await ev('GV.keepSelftestDSK3()');
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result;
  for (const [tag, q] of Object.entries(o.lm)) console.log(tag + ' 精靈 ' + q.s.w + '×' + q.s.h + '：' + Object.entries(q.views).map(([vn, v]) => `${vn} 差 ${v.n}（框 ${v.bw}×${v.bh}，試 ${v.tries}）`).join('；') + (q.clockNew != null ? `；鐘 10:00 對 10:30 新 ${q.clockNew}／閥門 ${q.clockOff}` : ''));
  console.log('自檢 nearUK695 ' + o.self.ok + '；keepDSK3 ' + o.dsk3.ok);
  const lm = Object.values(o.lm);
  const checks = [
    ['三座地標 z=2 正午、午夜、z=3 午夜都有差異，外接框不超過精靈 × 縮放 + 8px', lm.every(q => ['day', 'night', 'night3'].every(vn => { const v = q.views[vn]; return v.n > 0 && v.bw <= q.s.w * v.z + 8 && v.bh <= q.s.h * v.z + 8; }))],
    ['z=1.2 正午新舊相同（低於 1.22 不畫）', lm.every(q => q.views.mid.n === 0)],
    ['大笨鐘 z=2：鐘面 10:00 與 10:30 不同（只在鐘盤，≤300 像素）、閥門下相同', o.lm.k190.clockNew > 0 && o.lm.k190.clockNew <= 300 && o.lm.k190.clockOff === 0],
    ['自檢 nearUK695、keepDSK3 都綠', o.self.ok && o.dsk3.ok],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T695 守衛成立' : 'X T695 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
