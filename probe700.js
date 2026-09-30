// T700 守衛：通用分階段施工。種子城 5162026、水面釘在第 0 幀（__waterF695），種 3×2 超街區 (60,27)。
//   三處代表工地：1×1 住宅 (13,12)、3×2 超街區 (60,27)、2×2 設施 k116 (43,8)。每處：
//   ① 閥門 __noConstr700 開時每幀預掃不跑（站數統計物件沒換）；② 施工中（P5.5）新舊不同；③ 暖機 6 幀後畫面穩定（同設定再畫兩次相同）；
//   ④ 完整自檢 GV.constr13.selftest 全綠（原型第四版的自檢：道具落地、吊鉤在吊臂下、夜光只在地塊與樓體內、P8.999＝完工（量化與精確 P、晴雨雪）、
//      剪影防護架貼牆、量化不倒退…，一處約一分鐘）；另跑煙霧自檢 constrSelftest700。
// 用法：node probe700.js [house,block,fac]   退出碼 0＝守衛成立
'use strict';
const { withGame, sleep } = require('./harness.js');
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const SITES = [['house', 13, 12], ['block', 60, 27], ['fac', 43, 8]].filter(s => !ONLY.length || ONLY.includes(s[0]));
const SEED = `(()=>{window.__waterF695=0;GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);
  window.__live=(x,y)=>{let got=null;Object.defineProperty(Object.prototype,'toJSON',{configurable:true,writable:true,value:function(){if(!got)got=this;return null;}});try{GV.tile(x,y);}finally{delete Object.prototype.toJSON;}return got;};
  GV.art574.plant574([{x:60,y:27,k:2,lv:3,v:0,grid:[3,2]}]);for(let y=22;y<38;y++)for(let x=55;x<72;x++){const t=__live(x,y);if(t&&t.tree)t.tree=0;}return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
const QUICK = (x, y) => `(()=>{const t=__live(${x},${y}),b=t&&t.bld;if(!b)return {err:'沒有建築'};const sv={age:b.age,fr:window.__x13Frac,off:window.__noConstr700,sig:window.__noSignal};
  const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,snap=()=>g.getImageData(0,0,W,H).data,diff=(a,c)=>{let n=0;for(let i=0;i<a.length;i+=4)if(a[i]!==c[i]||a[i+1]!==c[i+1]||a[i+2]!==c[i+2])n++;return n;};
  try{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);b.age=5;window.__x13Frac=.5;
    window.__noConstr700=true;const s0=GV.constr13.stats();GV.forceDraw();const v=snap(),s1=GV.constr13.stats();
    window.__noConstr700=false;for(let i=0;i<6;i++){GV.forceDraw();if(GV.constr13.pending())GV.constr13.flush();} // 暖機：前一兩幀等量體側寫（畫土色地面＋一線圍籬），第 3 幀烘快取，第 4 幀起不再變
    const n1=snap();GV.forceDraw();const n2=snap();return {valveIdle:s0===s1,diff:diff(v,n1),unstable:diff(n1,n2)};}
  finally{b.age=sv.age;window.__x13Frac=sv.fr;window.__noConstr700=sv.off;window.__noSignal=sv.sig;}})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 900, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    const out = { smoke: await ev('GV.constrSelftest700()') };
    for (const [nm, x, y] of SITES) {
      out[nm] = await ev(QUICK(x, y));
      out[nm].self = await ev(`GV.constr13.selftest({x:${x},y:${y}})`);
    }
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result, checks = [];
  console.log('煙霧自檢 constr700：' + (o.smoke.ok ? '綠' : '紅') + '｜' + o.smoke.checks.join('｜'));
  checks.push(['煙霧自檢 constr700 綠', !!o.smoke.ok]);
  for (const [nm] of SITES) {
    const q = o[nm], bad = (q.self && q.self.checks || []).filter(c => /✗/.test(c));
    console.log(`${nm}：閥門開時預掃不跑 ${q.valveIdle}｜P5.5 新舊差 ${q.diff} px｜重畫差 ${q.unstable} px｜完整自檢 ${q.self && q.self.checks ? q.self.checks.length - bad.length : 0}/${q.self && q.self.checks ? q.self.checks.length : 0}` + (bad.length ? '\n   ' + bad.join('\n   ') : ''));
    checks.push([`${nm}：閥門開時每幀預掃不跑`, q.valveIdle === true]);
    checks.push([`${nm}：施工中新舊不同`, q.diff > 500]);
    checks.push([`${nm}：畫面穩定`, q.unstable === 0]);
    checks.push([`${nm}：完整自檢全綠`, !!(q.self && q.self.ok)]);
  }
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T700 守衛成立' : 'X T700 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
