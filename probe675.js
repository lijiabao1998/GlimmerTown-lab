// T675 守衛：水面紋路打散、再淡一半。種子城 (49,50) z=2、z=1 正午（關紅綠燈），同一次遊戲開關閥門 __noWaterVar675（切換後重烘地面）：
//   ① 新舊有差異；② 差異像素都在水上：沒有畫面座標換格子的函式，用顏色判斷——非水色（被岸邊泡沫、礁石方塊蓋過的水格像素）的差異點 3px 內都有水色像素、而且不到差異的 0.5%；
//   ③ 波光重複：亮點（比水面中位亮度亮 25 以上）往右一格（64×z px）也是亮點的比例，新版明顯低於舊版（< 舊版六成）。
//   --shots=前綴 時存新舊各兩張。
// 用法：node probe675.js [--shots=shots675/T675]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['near', 49, 50, 2], ['mid', 49, 50, 1]];

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(700);
    const out = [];
    for (const [vn, x, y, z] of VIEWS) {
      const q = await ev(`(()=>{const sv=window.__noWaterVar675,sg=window.__noSignal,cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,o={};
        const snap=off=>{window.__noWaterVar675=off;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();return g.getImageData(0,0,W,H).data;};
        try{window.__noSignal=true;
          const A=snap(true);${SHOTS ? "o.uOld=cv.toDataURL('image/png');" : ''}const B=snap(false);${SHOTS ? "o.uNew=cv.toDataURL('image/png');" : ''}
          const blue=(D,i)=>D[i+2]>D[i]+30&&D[i+2]>D[i+1]+10;
          let diff=0,nonWater=0,lone=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2]){diff++;if(!(blue(A,i)&&blue(B,i))){nonWater++;const p=i/4,px=p%W,py=(p/W)|0;let near=false;for(let dy=-3;dy<=3&&!near;dy++)for(let dx=-3;dx<=3;dx++){const X=px+dx,Y=py+dy;if(X<0||Y<0||X>=W||Y>=H)continue;const j=(Y*W+X)*4;if(blue(A,j)&&blue(B,j)){near=true;break;}}if(!near)lone++;}}
          const rep=D=>{const L=[];for(let i=0;i<D.length;i+=4)if(blue(D,i))L.push(.3*D[i]+.59*D[i+1]+.11*D[i+2]);L.sort((a,b)=>a-b);const med=L[L.length>>1]||0,th=med+25,dx=Math.round(64*${z});
            let br=0,same=0;for(let yy=0;yy<H;yy++)for(let xx=0;xx+dx<W;xx++){const i=(yy*W+xx)*4,j=i+dx*4;if(!blue(D,i)||!blue(D,j))continue;const li=.3*D[i]+.59*D[i+1]+.11*D[i+2];if(li<=th)continue;br++;const lj=.3*D[j]+.59*D[j+1]+.11*D[j+2];if(lj>th)same++;}
            return {br,same,p:br?same/br:0,med};};
          o.diff=diff;o.nonWater=nonWater;o.lone=lone;o.old=rep(A);o.nw=rep(B);
        }finally{window.__noWaterVar675=sv;window.__noSignal=sg;GV.testRebake592();}
        return o;})()`);
      q.name = vn; out.push(q);
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const V = r.result;
  for (const v of V) for (const [k, tag] of [['uNew', 'new'], ['uOld', 'old']]) if (v[k]) { const dest = path.join(ROOT, `${SHOTS}_${v.name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v[k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  for (const v of V) console.log(`${v.name}：差異像素 ${v.diff}（非水色 ${v.nonWater}，其中 3px 內沒有水色的 ${v.lone}）；亮點往右一格也亮 舊 ${(v.old.p * 100).toFixed(1)}%（${v.old.same}/${v.old.br}）→ 新 ${(v.nw.p * 100).toFixed(1)}%（${v.nw.same}/${v.nw.br}）`);
  const checks = [
    ['兩個鏡頭新舊有差異', V.every(v => v.diff > 0)],
    ['差異像素都在水上：非水色的都貼著水（3px 內沒有水色的 0 個）、而且不到差異的 0.5%', V.every(v => v.lone === 0 && v.nonWater < v.diff * .005)],
    ['波光往右一格重複的比例新版不到舊版六成', V.every(v => v.old.br > 0 && v.nw.p < v.old.p * .6)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T675 守衛成立' : 'X T675 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
