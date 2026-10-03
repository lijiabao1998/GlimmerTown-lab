// GROK-004 守衛：第二批八座的自檢必須全綠。
// 用法：node probeGROK4.js
'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const q = await cdp.send('Runtime.evaluate', { expression: `(()=>{const t=GV.ukRestSelftestGROK4();return {ok:t.ok,fails:t.checks.filter(s=>s.indexOf('✗')>=0),n:t.checks.length};})()`, returnByValue: true, awaitPromise: true });
    if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text);
    return q.result.value;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const { ok, fails, n } = r.result;
  console.log('自檢 ' + n + ' 項');
  for (const f of fails || []) console.log('  ✗ ' + f);
  console.log(ok ? 'OK GROK-004 守衛成立' : 'X GROK-004 守衛不成立');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
