// T582 守衝 G2：量體分割像素斷言（分割 on/off sprite 差異 + 巷道地坪露出行數）
'use strict';
const { withGame } = require('./harness.js');

(async () => {
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    await new Promise(r => setTimeout(r, 800));
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    return await ev(`(() => {
      try {
      const out = { cases: [], ok: true };
      for (const [k,lv,bw,bh,v] of [[2,2,5,5,0],[2,1,5,5,0],[1,2,5,5,0],[3,1,5,5,0]]) {
        const cache = GV.block559.cache();
        window.__noParcel582 = 1; cache.clear();
        const off = GV.block559.make(k,lv,bw,bh,v);
        delete window.__noParcel582; cache.clear();
        const on = GV.block559.make(k,lv,bw,bh,v);
        const dOff = off.img.getContext('2d').getImageData(0,0,off.w,off.h).data;
        const dOn  = on.img.getContext('2d').getImageData(0,0,on.w,on.h).data;
        let diff = 0, alleyRows = 0;
        const lotBucket = k===2 ? [0x87,0x88,0x8c] : k===3 ? [0x6d,0x67,0x5d] : [0x6f,0x8a,0x58];
        // 巷道偵測：分割 sprite 中，與 lotFill 地坪同色（±6）的像素行數（需 >= 8 行才算縱向巷道）
        for (let y = 0; y < on.h; y++) {
          let rowLot = 0;
          for (let x = 0; x < on.w; x++) {
            const i = (y*on.w+x)*4;
            if (dOff[(y*on.w+x)*4+3] > 40 !== dOn[i+3] > 40) diff++;
            else if (Math.abs(dOff[i]-dOn[i]) + Math.abs(dOff[i+1]-dOn[i+1]) + Math.abs(dOff[i+2]-dOn[i+2]) > 24) diff++;
            if (dOn[i+3] > 40 && Math.abs(dOn[i]-lotBucket[0])<=6 && Math.abs(dOn[i+1]-lotBucket[1])<=6 && Math.abs(dOn[i+2]-lotBucket[2])<=6) rowLot++;
          }
          if (rowLot >= 3) alleyRows++;
        }
        const pass = diff >= 300 && alleyRows >= 8;
        if (!pass) out.ok = false;
        out.cases.push({ k, lv, bw, bh, v, diff, alleyRows, pass, styOn: on.__t547 ? on.__t547.sty : '(legacy)' });
      }
      return out;
      } catch (e) { return { cases: [], ok: false, err: e.message }; }
    })()`);
  });
  const r = session.result || {};
  console.log(JSON.stringify(r, null, 1));
  console.log(r && r.ok ? 'GUARD G2: PASS' : 'GUARD G2: FAIL');
  process.exit(session.ok && r.ok ? 0 : 1);
})().catch(e => { console.error('GUARD FAIL', e.message); process.exit(1); });
