'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, fresh: true, log: () => {} }, async ({ cdp }) => {
    return await cdp.evalJs(`(() => {
      const keys = Object.keys(window.__facade577 || {});
      GV.block559.cache().clear();
      // k=2 的三個原型 × lv1..2：驗證風格接手
      const probes = [];
      for (const [k,lv,bw,bh] of [[2,1,2,2],[2,1,3,2],[2,2,3,3],[2,2,2,2],[2,3,2,2]]) {
        for (const v of [0,1,2]) {
          GV.block559.cache().clear();
          let sp=null; try{ sp = GV.block559.make(k,lv,bw,bh,v); }catch(e){}
          const sty = sp && sp.__t547 ? sp.__t547.sty : '(fallback)';
          probes.push(k+'_'+lv+'_'+bw+'x'+bh+'_v'+v+' => '+sty);
        }
      }
      return { keys: keys, probes: probes };
    })()`);
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1));
})();
