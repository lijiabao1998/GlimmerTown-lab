// T582 診斷探針：超街區 sprite 高度普查＋地圖 block547 分布
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

(async () => {
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';return 1;})()`);
    return await ev(`(() => {
      const out = { cache: [], map: {}, flat: [] };
      const cache = GV.block559.cache();
      for (const [key, sp] of cache) {
        const m = key.split('_');
        const k = +m[0], lv = +m[1], dims = m[2].split('x');
        const bw = +dims[0], bh = +dims[1];
        const groundH = (bw + bh) * 16 + 32 + 16; // 菱形高＋上下 pad，無牆
        out.cache.push({ key, w: sp.w, h: sp.h, groundOnlyH: groundH,
          hasWall: sp.h > groundH + 8, sty: sp.__t547 ? sp.__t547.sty : '(legacy)' });
      }
      // 地圖普查
      const tiles = window.tiles, MW = tiles.length ? Math.sqrt(tiles.length) | 0 : 0;
      const inM = (x,y) => x>=0&&y>=0&&x<MW&&y<MW;
      const idx = (x,y) => y*MW+x;
      let bldTotal=0, blkTiles=0, blkByK={1:0,2:0,3:0};
      const seen = new Set();
      for (let y=0;y<MW;y++) for (let x=0;x<MW;x++) {
        const b = tiles[idx(x,y)] && tiles[idx(x,y)].bld;
        if (!b || b.ref) continue;
        bldTotal++;
        const o = b.block547;
        if (o && (o.w>1||o.h>1)) {
          blkTiles++; blkByK[b.k]=(blkByK[b.k]||0)+1;
          const gk = b.k+'_'+(b.lv||1)+'_'+o.w+'x'+o.h;
          out.map[gk] = (out.map[gk]||0)+1;
          if (o.w*o.h>=6 && !seen.has(gk) && out.flat.length<6) {
            seen.add(gk);
            out.flat.push({ k:b.k, lv:b.lv||1, w:o.w, h:o.h, x, y });
          }
        }
      }
      out.bldTotal = bldTotal; out.blkTiles = blkTiles; out.blkByK = blkByK;
      return out;
    })()`);
  });
  const r = session.result || {};
  console.log('== 快取 sprite 高度普查 ==');
  const bad = (r.cache||[]).filter(c => !c.hasWall);
  console.log('sprite 總數:', (r.cache||[]).length, ' 無牆(平板):', bad.length);
  for (const c of bad) console.log('  FLAT', c.key, 'h=', c.h, 'groundOnly=', c.groundOnlyH, c.sty);
  console.log('== 地圖普查 ==');
  console.log('建築總數:', r.bldTotal, ' 超街區 tile 數:', r.blkTiles, r.blkByK);
  const entries = Object.entries(r.map||{}).sort((a,b)=>b[1]-a[1]).slice(0,15);
  for (const [gk,n] of entries) console.log('  ', gk, 'x', n);
  console.log('== 大街廓樣本(截圖用) ==');
  for (const f of r.flat||[]) console.log('  ', JSON.stringify(f));
  fs.writeFileSync(path.join(ROOT,'shots','T582_probe.json'), JSON.stringify(r,null,1));
  process.exit(session.ok?0:1);
})().catch(e => { console.error('PROBE FAIL', e.message); process.exit(1); });
