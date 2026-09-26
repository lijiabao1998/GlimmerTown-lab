// T666 守衛：種子城。
//   像素：(50,44) z=2、(48,52) z=1 正午（決策單同鏡頭），新舊（__noWaterGrad666）有差異；關紅綠燈比（見 probe643）。
//   台階：新版深淺層（WG666.scr）左右相鄰像素的透明度差最大值 ≤ 6/255（只量新舊有差的像素，即真的貼了漸層的非靠岸水格）；
//         舊版兩階整格疊色在格內是常數，台階＝相鄰兩格非靠岸水格的透明度差，最大值 ≥ 25/255（.14 → .26）。
//   --shots 時各存新舊一張。
// 用法：node probe666.js [--shots=shots666/T666]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['near', 50, 44, 2], ['mid', 48, 52, 1]];

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const out = { views: [] };
    for (const [n, x, y, z] of VIEWS) {
      const q = await ev(`(()=>{const sv=window.__noWaterGrad666,sg=window.__noSignal,o={};const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);
          window.__noWaterGrad666=true;GV.testRebake592();GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s666o=cv.toDataURL('image/png');" : ''}
          window.__noWaterGrad666=false;GV.testRebake592();GV.forceDraw();o.tiles=window.__t666Tiles|0;const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s666n=cv.toDataURL('image/png');" : ''}
          let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
          const L=GV.WG666.scr,d=L.getContext('2d').getImageData(0,0,L.width,L.height).data,w=L.width;let mx=0;
          const chg=i=>A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]; // 只量真的貼了漸層的像素（新舊有差＝在非靠岸水格裡）
          for(let yy=0;yy<L.height;yy++)for(let xx=1;xx<w;xx++){const i=(yy*w+xx)*4,j=i-4;if(!chg(i)||!chg(j))continue;const a=d[i+3],b=d[j+3];if(Math.abs(a-b)>mx)mx=Math.abs(a-b);}
          o.newJump=mx;
        }finally{window.__noWaterGrad666=sv;window.__noSignal=sg;}return o;})()`);
      if (SHOTS) { q.urlOld = await ev('window.__s666o'); q.urlNew = await ev('window.__s666n'); }
      q.name = n; out.views.push(q);
    }
    out.oldJump = await ev(`(()=>{const T=(x,y)=>GV.tile(x,y);let mx=0;const al=(x,y)=>{const t=T(x,y);if(!t||t.t!==0||t.wm)return null;let land=false;for(let dy=-2;dy<=2&&!land;dy++)for(let dx=-2;dx<=2;dx++){const u=T(x+dx,y+dy);if(u&&u.t!==0){land=true;break;}}return land?.14:.26;};
      for(let y=0;y<256;y++){if(!T(0,y))break;for(let x=0;x<256;x++){if(!T(x,y))break;const a=al(x,y);if(a==null)continue;for(const [dx,dy] of [[1,0],[0,1]]){const b=al(x+dx,y+dy);if(b!=null&&Math.abs(a-b)*255>mx)mx=Math.abs(a-b)*255;}}}return Math.round(mx);})()`);
    return out;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const v of q.views) for (const k of ['New', 'Old']) if (v['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${v.name}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  for (const v of q.views) console.log(`${v.name}：漸層貼了 ${v.tiles} 格｜差異像素 ${v.diff}｜新版深淺層相鄰像素最大差 ${v.newJump}/255`);
  console.log(`舊版兩階整格：相鄰水格最大差 ${q.oldJump}/255`);
  const checks = [
    [`兩個鏡頭新舊都有差異`, q.views.every(v => v.diff > 0)],
    [`新版深淺層相鄰像素最大差 ≤ 6/255（${q.views.map(v => v.newJump).join('、')}）`, q.views.every(v => v.newJump <= 6)],
    [`舊版台階 ≥ 25/255（${q.oldJump}）`, q.oldJump >= 25],
    [`漸層真的有貼（${q.views.map(v => v.tiles).join('、')} 格）`, q.views.every(v => v.tiles > 0)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T666 守衛成立' : 'X T666 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
