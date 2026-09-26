// GLM-001 守衛 v2：岸線 A/B 全畫布像素比對（數量/包圍盒/取樣色）＋深水零污染
'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const s = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev('GV.metroArtSeedWorld516(5162026)');
    const r1 = await ev(`(() => {
      GV.setVisT(55); GV.lookAt(42,42); GV.setZoom(2.2);
      const c = document.getElementById('game'); const g2 = c.getContext('2d');
      const W2 = c.width, H2 = c.height;
      delete window.__noBayBankGLM1; window.__tGLM1BankCount = 0; GV.testRebake592(); GV.forceDraw();
      const dOn = g2.getImageData(0, 0, W2, H2).data;
      const cnt = window.__tGLM1BankCount | 0;
      window.__noBayBankGLM1 = 1; window.__tGLM1BankCount = 0; GV.testRebake592(); GV.forceDraw();
      const dOff = g2.getImageData(0, 0, W2, H2).data;
      window.__noBayBankGLM1 = 0; GV.forceDraw();
      let n = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
      const samples = [];
      for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
        const i = (y * W2 + x) * 4;
        if (dOn[i] !== dOff[i] || dOn[i+1] !== dOff[i+1] || dOn[i+2] !== dOff[i+2]) {
          n++;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
          if (samples.length < 5 && n % 97 === 0) samples.push(x + ',' + y + ' rgb(' + dOn[i] + ',' + dOn[i+1] + ',' + dOn[i+2] + ')');
        }
      }
      let waterDiff = 0;
      const wx = 40, wy = 460;
      for (let y = wy; y < wy + 50; y++) for (let x = wx; x < wx + 80; x++) {
        const i = (y * W2 + x) * 4;
        if (dOn[i] !== dOff[i]) waterDiff++;
      }
      return JSON.stringify({ cnt, diffPx: n, bbox: [minX, minY, maxX, maxY], samples, waterDiff });
    })()`);
    return JSON.parse(r1);
  });
  console.log(JSON.stringify(s.result || s.fails, null, 1));
  process.exit(s.result && s.result.diffPx > 200 && s.result.cnt > 0 && s.result.waterDiff === 0 ? 0 : 1);
})().catch(e => { console.error('E', e.message); process.exit(1); });
