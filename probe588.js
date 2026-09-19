// T588 live demo：注入市民 → 開跟隨 → 推進模擬 → 連拍（鏡頭應隨市民移動）
// 邊界：citizens 在閉包內，eval 不可達；用 testInjectResident534 回傳的 citizen 物件穿閉包。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

(async () => {
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev(`GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';return 1})()`);
    const inj = await ev(`(()=>{GV.art574.clear574(24,22,1,1);const r=GV.testInjectResident534(24,22);if(!r)return 'null';window.__c588=r.c;return JSON.stringify({name:r.c.name,at:r.c.at});})()`);
    const { name } = JSON.parse(inj);
    const start = await ev(`JSON.stringify(GV.follow588Start(window.__c588))`);
    const shoot = async tag => {
      await ev(`GV.forceDraw();1`);
      const d = await ev(`document.getElementById('game').toDataURL('image/png')`);
      const dest = path.join(ROOT, 'shots', `T588_follow_${tag}.png`);
      fs.writeFileSync(dest, Buffer.from(d.split(',')[1], 'base64'));
      return path.relative(ROOT, dest);
    };
    const posOf = () => ev(`JSON.stringify({at:window.__c588.at,fx:+window.__c588.fx.toFixed(2),fy:+window.__c588.fy.toFixed(2)})`);
    const step = async (n, tag) => {
      await ev(`(async()=>{for(let i=0;i<${n};i++)GV.testAdvance588(.25);return 1})()`);
      await ev(`GV.follow588Tick();GV.forceDraw();1`);
      const p = JSON.parse(await posOf());
      const shot = await shoot(tag);
      return { p, shot };
    };
    const shotA = await shoot('a');
    const st1 = await step(120, 'b');
    const st2 = await step(120, 'c');
    const s0 = { at: 'start' }, s1 = st1.p, s2 = st2.p;
    const badge = await ev(`(()=>{const b=document.getElementById('followBadge588');return b?b.textContent:'';})()`);
    const stop = await ev(`(GV.follow588Stop(),{ok:true})`);
    return { name, start: JSON.parse(start), s0, s1, s2, badge, stop, shots: [shotA, st1.shot, st2.shot] };
  });
  console.log(JSON.stringify(session.result || session.fails, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('DEMO FAIL', e.message); process.exit(1); });
