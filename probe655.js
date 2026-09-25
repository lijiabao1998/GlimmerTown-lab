// T655 守衛：種子城。
//   全圖：每棵樹的地形分類（水邊／沙岸／高地／平地）與畫出來的樹種對得上的比例，新版 100%、關閥門（__noTerrainTree655）明顯低。
//   近景：水邊、沙岸、高地各挑同類樹最多的一處，z=2 正午（關紅綠燈），新舊有差異；--shots 時各存新舊一張。
// 用法：node probe655.js [--shots=shots655/T655]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const NAMES = ['平地', '水邊', '沙岸', '高地'];

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const o = await ev(`(()=>{const sv=window.__noTerrainTree655,o={};
      const scan=()=>{const cnt=[0,0,0,0],hit=[0,0,0,0];for(let y=0;y<256;y++){if(!GV.tile(0,y))break;for(let x=0;x<256;x++){const t=GV.tile(x,y);if(!t)break;if(!t.tree)continue;const c=GV.terrainClass655(x,y),v=GV.terrainTree655(t.tree,x,y);cnt[c]++;if(GV.TERRAIN_SP655[c].indexOf(v)>=0)hit[c]++;}}return {cnt,hit};};
      try{window.__noTerrainTree655=false;o.new=scan();window.__noTerrainTree655=true;o.old=scan();}finally{window.__noTerrainTree655=sv;}
      o.spots=[];for(const c of [1,2,3]){let best=null;for(let y=4;y<252;y++){if(!GV.tile(0,y))break;for(let x=4;x<252;x++){const t=GV.tile(x,y);if(!t)break;if(!t.tree||GV.terrainClass655(x,y)!==c)continue;let n=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const u=GV.tile(x+dx,y+dy);if(u&&u.tree&&GV.terrainClass655(x+dx,y+dy)===c)n++;}if(!best||n>best.n)best={c,x,y,n};}}o.spots.push(best);}
      return o;})()`);
    o.shots = [];
    for (const sp of o.spots) {
      if (!sp) { o.shots.push(null); continue; }
      const one = await ev(`(()=>{const sv=window.__noTerrainTree655,sg=window.__noSignal,q={};const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;GV.lookAt(${sp.x},${sp.y});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);
          window.__noTerrainTree655=true;GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__shotOld655=cv.toDataURL('image/png');" : ''}
          window.__noTerrainTree655=false;GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__shotNew655=cv.toDataURL('image/png');" : ''}
          let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;q.diff=n;
        }finally{window.__noTerrainTree655=sv;window.__noSignal=sg;}return q;})()`);
      if (SHOTS) { one.urlOld = await ev(`window.__shotOld655`); one.urlNew = await ev(`window.__shotNew655`); await ev(`(delete window.__shotOld655,delete window.__shotNew655,1)`); }
      o.shots.push(one);
    }
    return o;
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const tag = ['', 'water', 'sand', 'high'];
  q.spots.forEach((sp, i) => {
    const s = q.shots[i]; if (!sp || !s) return;
    for (const k of ['New', 'Old']) if (s['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${tag[sp.c]}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(s['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  });
  const pct = (h, c) => c ? +(100 * h / c).toFixed(1) : 100;
  const sum = a => a.reduce((x, y) => x + y, 0);
  const nAll = pct(sum(q.new.hit), sum(q.new.cnt)), oAll = pct(sum(q.old.hit), sum(q.old.cnt));
  console.log('全圖樹的地形分類：' + NAMES.map((n, c) => `${n} ${q.new.cnt[c]}`).join('、'));
  console.log('分類與樹種對得上：' + NAMES.map((n, c) => `${n} 新 ${pct(q.new.hit[c], q.new.cnt[c])}%／關 ${pct(q.old.hit[c], q.old.cnt[c])}%`).join('；') + `｜全部 新 ${nAll}%／關 ${oAll}%`);
  q.spots.forEach((sp, i) => { if (sp) console.log(`近景 ${NAMES[sp.c]} (${sp.x},${sp.y}) 周圍同類 ${sp.n} 棵：差異像素 ${q.shots[i] ? q.shots[i].diff : '—'}`); });
  const checks = [
    [`全圖對得上 新 ${nAll}% = 100%`, nAll === 100],
    [`關閥門明顯低（${oAll}% < 90%）`, oAll < 90],
    [`水邊、沙岸、高地都有樹（${q.new.cnt[1]}／${q.new.cnt[2]}／${q.new.cnt[3]}）`, q.new.cnt[1] > 0 && q.new.cnt[2] > 0 && q.new.cnt[3] > 0],
    [`三處近景新舊都有差異`, q.shots.every(s => s && s.diff > 0)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T655 守衛成立' : 'X T655 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
