// T669 守衛：閥門 __noBareTrunkW669 在建精靈時讀，開兩次遊戲（一次開機前設閥門＝舊）。
//   精靈：13 種禿枝（treeWBare）逐張比雜湊，只有 11 橡樹、16 懸鈴木不同；這兩種 y30–40 的樹幹描邊色 (24,40,28) 像素：新版（樹幹留著、兩側有描邊）≥16、舊版（只剩枝，枝不用描邊色）≤2。
//   畫面：種子城冬天，找橡樹／懸鈴木最多的一處 z=2 正午（關紅綠燈），新舊有差異；--shots 時各存一張。
// 用法：node probe669.js [--shots=shots669/T669]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

async function run(old, spot) {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {}, preScript: old ? 'window.__noBareTrunkW669=true;' : '' }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    const spr = await ev(`(()=>{const S=GV.art574.SPR(),o={};for(let i=0;i<21;i++){const b=S.treeWBare[i];if(!b)continue;const d=b.img.getContext('2d').getImageData(0,0,40,48).data;let h=2166136261>>>0,tp=0;
      for(let k=0;k<d.length;k++){h^=d[k];h=Math.imul(h,16777619)>>>0;}for(let y=30;y<=40;y++)for(let x=0;x<40;x++){const j=(y*40+x)*4;if(d[j+3]>120&&d[j]===24&&d[j+1]===40&&d[j+2]===28)tp++;}o[i+1]={h,tp};}return o;})()`);
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);GV.setSeason(3);return 1;})()`);
    await sleep(600);
    if (!spot) spot = await ev(`(()=>{let best=null;for(let y=4;y<252;y++){if(!GV.tile(0,y))break;for(let x=4;x<252;x++){const t=GV.tile(x,y);if(!t)break;if(!t.tree)continue;let n=0;
      for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const u=GV.tile(x+dx,y+dy);if(u&&u.tree){const v=GV.terrainTree655(u.tree,x+dx,y+dy);if(v===11||v===16)n++;}}if(!best||n>best.n)best={x,y,n};}}return best;})()`);
    const shot = await ev(`(()=>{window.__noSignal=true;GV.lookAt(${spot.x},${spot.y});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);GV.testRebake592();GV.forceDraw();
      const cv=document.getElementById('game'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let h=2166136261>>>0;for(let i=0;i<d.length;i+=4){h^=d[i]^(d[i+1]<<8)^(d[i+2]<<16);h=Math.imul(h,16777619)>>>0;}
      return {h,url:${SHOTS ? "cv.toDataURL('image/png')" : 'null'}};})()`);
    return { spr, spot, shot };
  });
  if (!r.result) throw new Error(JSON.stringify(r.fails));
  return r.result;
}

(async () => {
  const O = await run(true, null), Nw = await run(false, O.spot);
  for (const [tag, v] of [['old', O], ['new', Nw]]) if (v.shot.url) { const dest = path.join(ROOT, `${SHOTS}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v.shot.url.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  const changed = Object.keys(Nw.spr).filter(k => Nw.spr[k].h !== O.spr[k].h).map(Number);
  console.log(`禿枝精靈不同的樹種：${changed.join('、')}｜樹幹描邊像素 11：新 ${Nw.spr[11].tp}／舊 ${O.spr[11].tp}、16：新 ${Nw.spr[16].tp}／舊 ${O.spr[16].tp}`);
  console.log(`鏡頭 (${O.spot.x},${O.spot.y}) 周圍橡樹／懸鈴木 ${O.spot.n} 棵｜畫面雜湊 ${Nw.shot.h === O.shot.h ? '相同' : '不同'}`);
  const checks = [
    [`只有 11、16 兩種不同（${changed.join('、')}）`, changed.length === 2 && changed.includes(11) && changed.includes(16)],
    [`11、16 樹幹描邊像素 新 ≥16、舊 ≤2（11：${Nw.spr[11].tp}/${O.spr[11].tp}、16：${Nw.spr[16].tp}/${O.spr[16].tp}）`, Nw.spr[11].tp >= 16 && Nw.spr[16].tp >= 16 && O.spr[11].tp <= 2 && O.spr[16].tp <= 2],
    [`畫面新舊不同（附近有 ${O.spot.n} 棵）`, O.spot.n > 0 && Nw.shot.h !== O.shot.h],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T669 守衛成立' : 'X T669 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
