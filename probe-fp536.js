'use strict';
const { withGame } = require('./harness.js');
(async () => {
  await withGame({ port: 8199, timeout: 300, fresh: true, log: console.log }, async ({ cdp }) => {
    const r = await cdp.evalJs(`(() => {
      const gv=window.GV;
      return {hasGV:!!gv, gvKeys:Object.keys(gv||{}).filter(k=>/fp|536|block/i.test(k)),
        hasFn:typeof fpSpr536, hasBlock:typeof blockFp536,
        inGV:gv?{fp536:typeof gv.fp536, blockFp536:typeof gv.blockFp536}:null,
        err:window.__err536||null};
    })()`);
    console.log(JSON.stringify(r,null,1));
  });
})();
