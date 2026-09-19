'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, fresh: true, log: () => {} }, async ({ cdp }) => {
    return await cdp.evalJs(`(() => {
      const keys = Object.keys(window.__facade577 || {});
      // 取一棟 walkup（k=1 lv=2，ARCHE568 分配 usBrownstone）驗證風格真的接手
      GV.block559.cache().clear();
      const sp = GV.block559.make(1, 2, 2, 2, 0);
      const sty = sp && sp.__t547 ? sp.__t547.sty : null;
      return { keys: keys, count: keys.length, probeStyle: sty };
    })()`);
  });
  console.log(JSON.stringify(r.result || r.fails));
})();
