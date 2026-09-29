// T696 守衛：地標外擴前庭、周界綠籬不再蓋到前面的建築（同一次遊戲開關閥門 __noRingDepth696）。
//   種子城 5162026：原點 (39,25) 的 5×5 公共地標 k139，前庭格 (44,24) 在它後側；前面的工業樓 (45,24) 原本被前庭石板蓋掉左半邊。
//   ① 建築遮罩：「關地坪 __noPlaza」與「關地坪＋拆掉 (45,24) 這棟」兩張的差＝這棟建築的像素（最後才拆）；量測的幾張都關落地影 __noShadow596
//     （新版建築的影子落在前庭石板上、舊版被石板蓋掉、關地坪落在草地上，三者本來就不同）；
//   ② 遮罩內新舊不同的像素 >500（原本被前庭蓋掉的部分），而且這些像素新版 ≥95% 跟「關地坪」相同（露出來的是建築本身）；
//   ③ 全城（z=1）新舊差異像素、抽出的格數；自檢 ringDepth696 綠。
//   --shots=前綴 時存 ring{New,Old}_{day,night}.png（鏡頭對著這棟）。
// 用法：node probe696.js [--shots=shots696/T696]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
// 同一次 evaluate：關地坪 A、新版 C、閥門版 V、再一張關地坪 A2（確認水面沒換幀）；遮罩要的「沒有這棟」B 在最後拆掉 (45,24) 後另拍（GV.tile 回傳的是拷貝，只能用拆除）
const SNAP3 = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sg=window.__noSignal,svP=window.__noPlaza,svR=window.__noRingDepth696,o={};
  const svS=window.__noShadow596,snap=(np,nr,ns)=>{window.__noPlaza=np;window.__noRingDepth696=nr;window.__noShadow596=ns;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  try{${SHOTS ? "snap(false,false,svS);o.uNew=cv.toDataURL('image/png');snap(false,true,svS);o.uOld=cv.toDataURL('image/png');" : ''}
    const A=snap(true,false,true),C=snap(false,false,true);o.nNew=window.__ring696N;const V=snap(false,true,true);const A2=snap(true,false,true);
    const ne=(P,Q,i)=>P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2];let same=true,cv2=0;for(let i=0;i<A.length;i+=4){if(ne(A,A2,i))same=false;if(ne(C,V,i))cv2++;}
    o.stable=same;o.newVsOld=cv2;window.__p696=window.__p696||{};window.__p696['${T}']={A,C,V};}
  finally{window.__noPlaza=svP;window.__noRingDepth696=svR;window.__noShadow596=svS;window.__noSignal=sg;}return o;})()`;
const MASK = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sg=window.__noSignal,svP=window.__noPlaza,o={};const S=window.__p696['${T}'];
  const svS=window.__noShadow596;try{window.__noPlaza=true;window.__noShadow596=true;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.forceDraw();const B=g.getImageData(0,0,W,H).data;
    const ne=(P,Q,i)=>P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2];const far=(P,Q,i)=>Math.abs(P[i]-Q[i])+Math.abs(P[i+1]-Q[i+1])+Math.abs(P[i+2]-Q[i+2])>40;   // 遮罩只收「有這棟／沒這棟」差得明顯的像素（拆掉後地面重烘的草色小變化不算）
    let m=0,c=0,v=0,cv=0,good=0;for(let i=0;i<B.length;i+=4){if(!far(S.A,B,i))continue;m++;if(ne(S.C,S.A,i))c++;if(ne(S.V,S.A,i))v++;if(ne(S.C,S.V,i)){cv++;if(!ne(S.C,S.A,i))good++;}}o.mask=m;o.newDiff=c;o.oldDiff=v;o.fixed=cv;o.fixedShowBld=good;}
  finally{window.__noPlaza=svP;window.__noShadow596=svS;window.__noSignal=sg;}return o;})()`;
const CITY = `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noRingDepth696,sg=window.__noSignal,o={};
  const snap=nr=>{window.__noRingDepth696=nr;window.__noSignal=true;GV.lookAt(32,32);GV.art574.zoom574(1);GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  try{const C=snap(false);o.n=window.__ring696N;const V=snap(true);let d=0;for(let i=0;i<C.length;i+=4)if(C[i]!==V[i]||C[i+1]!==V[i+1]||C[i+2]!==V[i+2])d++;o.diff=d;}
  finally{window.__noRingDepth696=sv;window.__noSignal=sg;}return o;})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    await ev('GV.testRebake592();GV.forceDraw();1');
    const out = { k139: await ev(`(()=>{const b=GV.tile(39,25).bld;return b?b.k+'/'+(b.sz||1):null;})()`), b4524: await ev(`(()=>{const b=GV.tile(45,24).bld;return b?b.k:null;})()`) };
    out.day = await ev(SNAP3(45, 23, 2, .5)); out.night = await ev(SNAP3(45, 23, 2, .02));
    out.city = await ev(CITY);
    out.self = await ev('GV.ringDepthSelftest696()');
    out.doze = await ev(`(()=>{const ok=GV.place('doze',45,24);GV.testRebake592();GV.forceDraw();return ok&&!GV.tile(45,24).bld;})()`);
    Object.assign(out.day, await ev(MASK(45, 23, 2, .5))); Object.assign(out.night, await ev(MASK(45, 23, 2, .02)));
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result;
  if (SHOTS) for (const vn of ['day', 'night']) for (const [k, tg] of [['uNew', 'New'], ['uOld', 'Old']]) { const u = o[vn][k]; if (u) { const dest = path.join(ROOT, `${SHOTS}_ring${tg}_${vn}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); } }
  for (const vn of ['day', 'night']) { const v = o[vn]; delete v.uNew; delete v.uOld; console.log(vn + '：' + JSON.stringify(v)); }
  console.log('k139 ' + o.k139 + '；(45,24) k' + o.b4524 + '；全城 z=1 ' + JSON.stringify(o.city) + '；自檢 ' + o.self.ok);
  const pct = (a, b) => b ? a / b : 1;
  const checks = [
    ['場景：(39,25) 是 5×5 的 k139、(45,24) 有建築（量遮罩時拆掉成功）', o.k139 === '139/5' && !!o.b4524 && o.doze === true],
    ['拍攝期間水面沒換幀（關地坪兩張相同）', o.day.stable && o.night.stable],
    ['正午、午夜：這棟建築的遮罩內，新舊不同的像素 >500（原本被前庭蓋掉的部分）', ['day', 'night'].every(vn => o[vn].mask > 1000 && o[vn].fixed > 500)],
    ['正午、午夜：這些像素新版 ≥95% 跟「關地坪」相同（露出來的是建築本身，不是別的東西）', ['day', 'night'].every(vn => pct(o[vn].fixedShowBld, o[vn].fixed) >= .95)],
    ['這個鏡頭抽出的後側格子 >0、全城 z=1 新舊有差異', o.day.nNew > 0 && o.city.n > 0 && o.city.diff > 0],
    ['自檢 ringDepth696 綠', !!(o.self && o.self.ok)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T696 守衛成立' : 'X T696 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
