'use strict';
const { withGame } = require('./harness.js');
const fs = require('fs');
(async () => {
  await withGame({ port: 8199, timeout: 300, fresh: true, log: () => {} }, async ({ cdp }) => {
    const r = await cdp.evalJs(`(window.GV && window.GV.style536) ? window.GV.style536() : {ok:false}`);
    fs.writeFileSync('shots574/_axes_now.json', JSON.stringify({ anchor:'NOW', families: r.families, stats: r.stats }));
    return { ok: r.ok, fams: Object.keys(r.families).length };
  });
})();
