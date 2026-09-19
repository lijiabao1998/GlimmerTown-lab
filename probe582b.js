// T582 像素探針：直接量化各原型合併 sprite 的牆/頂/地坪顏色與結構
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

(async () => {
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    await new Promise(r => setTimeout(r, 800));
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    return await ev(`(() => {
      const out = {};
      const cases = [[1,1,5,5,0],[1,2,5,5,0],[1,3,4,4,0],[2,1,5,5,0],[2,2,5,5,0],[2,3,5,5,0],[3,1,5,5,0],[3,2,4,4,0],[3,3,4,4,0]];
      for (const [k,lv,bw,bh,v] of cases) {
        let sp = null, err = '';
        try { sp = GV.block559.make(k,lv,bw,bh,v); } catch(e) { err = e.message; }
        if (!sp) { out[k+'_'+lv] = { err }; continue; }
        const g = sp.img.getContext('2d');
        const W = sp.w, H = sp.h;
        // 掃描：統計非透明像素行分布 → 找出「最高的不透明行」(屋頂/牆頂) 與行密度
        const img = g.getImageData(0,0,W,H).data;
        let topY=-1, botY=-1, opaque=0;
        const rowCnt = new Array(H).fill(0);
        for (let y=0;y<H;y++) for (let x=0;x<W;x++) {
          if (img[(y*W+x)*4+3] > 40) { rowCnt[y]++; opaque++; if(topY<0)topY=y; botY=y; }
        }
        // 色彩多樣性（非透明取樣 24 色 top）
        const freq = new Map();
        for (let y=0;y<H;y+=2) for (let x=0;x<W;x+=2) {
          const i=(y*W+x)*4; if (img[i+3]<=40) continue;
          const key = (img[i]>>4)+','+(img[i+1]>>4)+','+(img[i+2]>>4);
          freq.set(key,(freq.get(key)||0)+1);
        }
        const top5 = [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>e[0]+':'+e[1]);
        out[k+'_'+lv+'_'+bw+'x'+bh] = {
          w:W, h:H, opaque, fillPct: Math.round(opaque*100/(W*H)),
          contentH: botY-topY, sty: sp.__t547 ? sp.__t547.sty : '(legacy)',
          topColors: top5
        };
      }
      return out;
    })()`);
  });
  console.log(JSON.stringify(session.result || session.fails, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('PROBE FAIL', e.message); process.exit(1); });
