// GLM-002 守衛：舊牆廣告 A/B + 計數（貼牆層）
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
      GV.setVisT(55); GV.lookAt(40,34); GV.setZoom(2.0);
      const c = document.getElementById('game');
      delete window.__noGhostGLM2; window.__tGLM2GhostCount = 0; GV.forceDraw();
      const on = c.toDataURL();
      const cnt = window.__tGLM2GhostCount | 0;
      window.__noGhostGLM2 = 1; GV.forceDraw();
      const off = c.toDataURL();
      window.__noGhostGLM2 = 0; GV.forceDraw();
      return JSON.stringify({ diff: on !== off, cnt });
    })()`);
    return JSON.parse(r1);
  });
  console.log(JSON.stringify(s.result || s.fails));
  process.exit(s.result && s.result.diff && s.result.cnt > 0 ? 0 : 1);
})().catch(e => { console.error('E', e.message); process.exit(1); });
