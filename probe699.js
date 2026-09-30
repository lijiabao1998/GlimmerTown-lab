// T699 守衛：英美立面街屋加風化（B）。同一次遊戲開關閥門 __noFacadeWx699（N＝新版、V＝閥門版）。
//   種子城 5162026、水面釘在第 0 幀（__waterF695）、全城 300 歲（testAge635）。鏡頭：day (8,24) z2、main (26,30) z2（芝加哥樓＋旅館）。
//   ① 新舊不同的像素：day（近景 z2）>5,000、main >1,000；② 變亮的像素 0；③ 同時關掉 T606 貼牆層（__noWallDetail606）時新舊逐像素相同
//      （差異全部來自貼牆層，精靈與其他層不動）；④ z0.8（貼牆層不畫）新舊相同；⑤ 拍攝期間畫面穩定；自檢 facadeWx699 綠。
//   --shots=前綴 時存 wx{New,Old}_{day,main}.png。
// 用法：node probe699.js [--shots=shots699/T699]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const SEED = `(()=>{window.__waterF695=0;GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`;
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
const VIEW = (X, Y, Z, T) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,sv=window.__noFacadeWx699,sw=window.__noWallDetail606,sg=window.__noSignal,o={};
  const snap=(nf,nw)=>{window.__noFacadeWx699=nf;window.__noWallDetail606=nw;window.__noSignal=true;GV.lookAt(${X},${Y});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${T});GV.forceDraw();return g.getImageData(0,0,W,H).data;};
  try{${SHOTS ? "snap(false,sw);o.uNew=cv.toDataURL('image/png');snap(true,sw);o.uOld=cv.toDataURL('image/png');" : ''}
    const N=snap(false,false),V=snap(true,false),N2=snap(false,false),Wn=snap(false,true),Wv=snap(true,true);
    const L=(P,i)=>.299*P[i]+.587*P[i+1]+.114*P[i+2],ne=(P,Q,i)=>P[i]!==Q[i]||P[i+1]!==Q[i+1]||P[i+2]!==Q[i+2];
    let d=0,br=0,st=0,wd=0;for(let i=0;i<N.length;i+=4){if(ne(N,N2,i))st++;if(ne(Wn,Wv,i))wd++;if(!ne(N,V,i))continue;d++;if(L(N,i)>L(V,i)+.5)br++;}
    o.diff=d;o.bright=br;o.unstable=st;o.diffNoWD=wd;}
  finally{window.__noFacadeWx699=sv;window.__noWallDetail606=sw;window.__noSignal=sg;}return o;})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    await ev('GV.testAge635(1,1,49,47,300);GV.testRebake592();GV.forceDraw();1');
    const out = {};
    out.day = await ev(VIEW(8, 24, 2, .5)); out.main = await ev(VIEW(26, 30, 2, .5)); out.far = await ev(VIEW(8, 24, .8, .5));
    out.self = await ev('GV.facadeWxSelftest699()');
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result;
  if (SHOTS) for (const vn of ['day', 'main']) for (const [k, tg] of [['uNew', 'New'], ['uOld', 'Old']]) { const u = o[vn][k]; if (u) { const dest = path.join(ROOT, `${SHOTS}_wx${tg}_${vn}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); } }
  for (const vn of ['day', 'main', 'far']) { const v = o[vn]; delete v.uNew; delete v.uOld; console.log(vn + '：' + JSON.stringify(v)); }
  console.log('自檢 facadeWx699：' + JSON.stringify(o.self));
  const checks = [
    ['新舊不同的像素：day（近景 z2）>5,000、main >1,000', o.day.diff > 5000 && o.main.diff > 1000],
    ['變亮的像素 0', o.day.bright === 0 && o.main.bright === 0],
    ['同時關掉 T606 貼牆層時新舊逐像素相同（差異全部來自貼牆層）', o.day.diffNoWD === 0 && o.main.diffNoWD === 0],
    ['z0.8（貼牆層不畫）新舊相同', o.far.diff === 0],
    ['拍攝期間畫面穩定（新版兩張相同）', o.day.unstable === 0 && o.main.unstable === 0 && o.far.unstable === 0],
    ['自檢 facadeWx699 綠', !!(o.self && o.self.ok)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T699 守衛成立' : 'X T699 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
