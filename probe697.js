// T697 守衛：多格地標排序改用佔地中線，前面的鄰居不再被地標蓋掉（同一次遊戲開關閥門 __noCenterDep697）。
//   種子城 5162026：原點 (39,25) 的 5×5 公共地標 k139（最前角深度 72、中線 68）；右前 (44,26)、(44,27) 的紅磚工業樓（70、71）原本先畫，左半被車站月台、軌道蓋掉；
//   前面 (39..41,30) 的樓屋頂被停車場斜切。
//   ① 鏡頭對著 (44,26)，正午、午夜各拍新版 N、閥門版 O、再一張新版 N2（確認水面沒換幀）；
//   ② 同鏡頭再拍參照 F：守衛鉤子 __depFirst697='39,25' 讓這座地標排到最前面先畫（＝前面的東西都在它上面，「這棟在最上層」的樣子）；世界不動；
//   ③ 這棟的畫面欄位內新舊不同的像素 >300；其中 ≥95% 新版跟 F 相同、舊版跟 F 相同的 ≤5%（原本是地標蓋在上面）；整個鏡頭的同一比例也列出來；
//   ④ 全城 z=1、z=1.4 新舊差異像素；自檢 centerDep697 綠。
//   參照不用「拆掉 (44,26)」（它是工業超街區的一格，拆掉後相鄰的樓重新拼街區、整片換圖）也不用「拆掉地標」（樓的描邊、牆腳縫合照鄰居重畫、停車場燈光暈一起消失），見卡上第 6 節。
//   --shots=前綴 時存 front{New,Old}_{day,night}.png（鏡頭對著這棟）。
// 用法：node probe697.js [--shots=shots697/T697]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
// 同一次 evaluate：新版 N、閥門版 O、再一張新版 N2（確認水面沒換幀）；參照 F 另一次 evaluate 拍（鉤子 __depFirst697）
const SNAP = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sg=window.__noSignal,sv=window.__noCenterDep697,o={};
  const snap=nc=>{window.__noCenterDep697=nc;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  try{${SHOTS ? "snap(false);o.uNew=cv.toDataURL('image/png');snap(true);o.uOld=cv.toDataURL('image/png');" : ''}
    const N=snap(false),O=snap(true),N2=snap(false);
    const ne=(P,Q,i)=>P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2];let same=true,d=0;for(let i=0;i<N.length;i+=4){if(ne(N,N2,i))same=false;if(ne(N,O,i))d++;}
    o.stable=same;o.fixed=d;window.__p697=window.__p697||{};window.__p697['${T}']={N,O};}
  finally{window.__noCenterDep697=sv;window.__noSignal=sg;}return o;})()`;
const REF = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sg=window.__noSignal,sf=window.__depFirst697,o={};const S=window.__p697['${T}'];
  try{window.__noSignal=true;window.__depFirst697='39,25';GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.forceDraw();const L=g.getImageData(0,0,W,H).data;
    const ne=(P,Q,i)=>P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2];
    // 這棟（(44,26)＋同街區的 (44,27)）在畫面上的欄位：lookAt(44,26) 時 (44,26) 的格在 [W/2−32z, W/2+32z]、(44,27) 在 [W/2−64z, W/2]；往上 100z 到精靈頂、往下到 (44,27) 的底角
    const z=${Z},bx0=W/2-64*z,bx1=W/2+32*z,by0=H/2-100*z,by1=H/2+48*z;
    const all={fixed:0,newIsF:0,oldIsF:0},box={fixed:0,newIsF:0,oldIsF:0};
    for(let i=0;i<L.length;i+=4){if(!ne(S.N,S.O,i))continue;const px=(i>>2)%W,py=(i>>2)/W|0,inB=px>=bx0&&px<bx1&&py>=by0&&py<by1,nl=!ne(S.N,L,i),ol=!ne(S.O,L,i);
      all.fixed++;if(nl)all.newIsF++;if(ol)all.oldIsF++;if(inB){box.fixed++;if(nl)box.newIsF++;if(ol)box.oldIsF++;}}
    o.all=all;o.box=box;}
  finally{window.__noSignal=sg;window.__depFirst697=sf;}return o;})()`;
const CITY = (X, Y, Z) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noCenterDep697,sg=window.__noSignal,o={};
  const snap=nc=>{window.__noCenterDep697=nc;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*.5);GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  try{const C=snap(false),V=snap(true);let d=0;for(let i=0;i<C.length;i+=4)if(C[i]!==V[i]||C[i+1]!==V[i+1]||C[i+2]!==V[i+2])d++;o.diff=d;o.px=W*H;}
  finally{window.__noCenterDep697=sv;window.__noSignal=sg;}return o;})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    await ev('GV.testRebake592();GV.forceDraw();1');
    const out = { k139: await ev(`(()=>{const b=GV.tile(39,25).bld;return b?b.k+'/'+(b.sz||1):null;})()`), b4426: await ev(`(()=>{const b=GV.tile(44,26).bld;return b?b.k+'/'+(b.sz||1):null;})()`) };
    out.day = await ev(SNAP(44, 26, 2, .5)); out.night = await ev(SNAP(44, 26, 2, .02));
    out.city1 = await ev(CITY(32, 32, 1)); out.city14 = await ev(CITY(40, 28, 1.4));
    out.self = await ev('GV.centerDepSelftest697()');
    out.dayRef = await ev(REF(44, 26, 2, .5)); out.nightRef = await ev(REF(44, 26, 2, .02));
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result;
  if (SHOTS) for (const vn of ['day', 'night']) for (const [k, tg] of [['uNew', 'New'], ['uOld', 'Old']]) { const u = o[vn][k]; if (u) { const dest = path.join(ROOT, `${SHOTS}_front${tg}_${vn}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); } }
  for (const vn of ['day', 'night']) { const v = o[vn]; delete v.uNew; delete v.uOld; console.log(vn + '：' + JSON.stringify(v) + ' 參照 ' + JSON.stringify(o[vn + 'Ref'])); }
  console.log('k139 ' + o.k139 + '；(44,26) ' + o.b4426 + '；全城 z=1 ' + JSON.stringify(o.city1) + '、z=1.4 ' + JSON.stringify(o.city14) + '；自檢 ' + o.self.ok);
  const pct = (a, b) => b ? a / b : 0;
  const R = vn => o[vn + 'Ref'];
  const checks = [
    ['場景：(39,25) 是 5×5 的 k139、(44,26) 是 1×1 建築', o.k139 === '139/5' && /\/1$/.test(o.b4426 || '')],
    ['拍攝期間水面沒換幀（新版兩張相同）', o.day.stable && o.night.stable],
    ['正午、午夜：這棟（(44,26)／(44,27) 的畫面欄位）新舊不同的像素 >300', ['day', 'night'].every(vn => R(vn).box.fixed > 300 && R(vn).all.fixed === o[vn].fixed)],
    ['正午、午夜：這些像素 ≥95% 新版跟「地標排最前面先畫」相同（這棟在最上層、完整露出）', ['day', 'night'].every(vn => pct(R(vn).box.newIsF, R(vn).box.fixed) >= .95)],
    ['正午、午夜：這些像素舊版跟參照相同的 ≤5%（原本是地標蓋在上面）', ['day', 'night'].every(vn => pct(R(vn).box.oldIsF, R(vn).box.fixed) <= .05)],
    ['全城 z=1、z=1.4 新舊有差異', o.city1.diff > 0 && o.city14.diff > 0],
    ['自檢 centerDep697 綠', !!(o.self && o.self.ok)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T697 守衛成立' : 'X T697 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
