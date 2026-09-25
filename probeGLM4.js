// GLM-004 守衛：繫岸小舟 A/B + 計數 + 深水外零污染
'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const s = await withGame({ port: 8198, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev('GV.metroArtSeedWorld516(5162026)');
    const r1 = await ev(`(() => {
      GV.setVisT(55); GV.lookAt(20,42); GV.setZoom(2.2);
      const c = document.getElementById('game'); const g2 = c.getContext('2d');
      const W2 = c.width, H2 = c.height;
      delete window.__noBoatGLM4; window.__tGLM4BoatCount = 0; GV.testRebake592(); GV.forceDraw();
      const dOn = g2.getImageData(0, 0, W2, H2).data;
      const cnt = window.__tGLM4BoatCount | 0;
      window.__noBoatGLM4 = 1; GV.testRebake592(); GV.forceDraw();
      const dOff = g2.getImageData(0, 0, W2, H2).data;
      window.__noBoatGLM4 = 0; GV.forceDraw();
      let n = 0, samples = [];
      for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
        const i = (y * W2 + x) * 4;
        if (dOn[i] !== dOff[i] || dOn[i+1] !== dOff[i+1] || dOn[i+2] !== dOff[i+2]) {
          n++;
          if (samples.length < 4 && n % 53 === 0) samples.push(x + ',' + y + ' rgb(' + dOn[i] + ',' + dOn[i+1] + ',' + dOn[i+2] + ')');
        }
      }
      return JSON.stringify({ diff: n > 0, cnt, diffPx: n, samples });
    })()`);
    return JSON.parse(r1);
  });
  console.log(JSON.stringify(s.result || s.fails));
  process.exit(s.result && s.result.diff && s.result.cnt > 0 ? 0 : 1);
})().catch(e => { console.error('E', e.message); process.exit(1); });
