'use strict';
const { withGame } = require('./harness.js');
(async () => {
  await withGame({ port: 8203, timeout: 300, fresh: true, log: () => {} }, async ({ cdp }) => {
    const r = await cdp.evalJs(`(() => {
      const gv = window.GV;
      if (!gv) return {err: 'no GV'};
      if (!gv.sheet536) return {err: 'no sheet536'};
      try {
        const r = gv.sheet536('bridge476', '');
        return {ok: true, count: r.leaves.length, first: r.leaves[0] ? r.leaves[0].p : 'none'};
      } catch(e) { return {err: e.message}; }
    })()`);
    console.log(JSON.stringify(r));
  });
})();
