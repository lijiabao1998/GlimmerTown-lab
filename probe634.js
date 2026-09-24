// T634 探針：種子城的幽靈崖沿。閥門 __noSeedEl634 開關各生成一次種子城：
//   ① em 與「照現在的 el 重算」不符的格數（GV.elStale634）、水格上帶崖沿的格數；
//   ② Pages 8 個鏡頭修前修後差異像素；--shots 時存港區近景修前修後與洋紅差異圖。
// 用法：node probe634.js [--shots=shots634/T634]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
// 與 gallery.js 同一組鏡頭
const VIEWS = [['mid_day', .75, .5, 36, 36], ['mid_night', .75, .02, 36, 36], ['near_day', 1.5, .5, 36, 36], ['near_night', 1.5, .02, 36, 36],
  ['home_day', 2, .5, 12, 12], ['home_dusk', 2, .73, 12, 12], ['home_night', 2, .02, 12, 12], ['far_day', .45, .5, 22, 44]];
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    const out = { stats: {}, px: {} };
    for (const mode of ['old', 'new']) {
      await ev(`(()=>{window.__noSeedEl634=${mode === 'old'};GV.metroArtSeedWorld516(5162026);window.__noSeedEl634=false;
        const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
      await sleep(400);
      out.stats[mode] = await ev(`(()=>{let water=0,em=0;for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);if(t.em){em++;if(t.t===0)water++;}}return {stale:GV.elStale634(),water,em};})()`);
      out.px[mode] = {};
      for (const [n, z, ph, x, y] of VIEWS)
        out.px[mode][n] = await ev(`(()=>{GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*${ph});GV.forceDraw();
          const c=document.getElementById('game'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;window.__p634=window.__p634||{};
          let diff=-1;if('${mode}'==='old')window.__p634['${n}']=d.slice();else{const a=window.__p634['${n}'];diff=0;for(let i=0;i<d.length;i+=4)if(Math.abs(a[i]-d[i])+Math.abs(a[i+1]-d[i+1])+Math.abs(a[i+2]-d[i+2])>8)diff++;}
          return {u:'${n}'==='near_day'?c.toDataURL('image/png'):'',diff};})()`);
    }
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const { stats, px } = r.result;
  console.log(`① em 與地形不符：修正前 ${stats.old.stale} 格 → 修正後 ${stats.new.stale} 格｜水格上的崖沿 ${stats.old.water} → ${stats.new.water}｜帶崖沿的格子 ${stats.old.em} → ${stats.new.em}`);
  let pass = stats.new.stale === 0 && stats.new.water === 0 && stats.old.stale > 0;
  const diffs = [];
  for (const [n] of VIEWS) {
    diffs.push(`${n} ${px.new[n].diff}`);
    if (SHOTS && n === 'near_day') for (const [tag, u] of [['old', px.old[n].u], ['new', px.new[n].u]]) {
      const dest = path.resolve(ROOT, `${SHOTS}_${n}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64'));
    }
  }
  console.log(`② Pages 鏡頭修前修後差異像素：${diffs.join('、')}`);
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
