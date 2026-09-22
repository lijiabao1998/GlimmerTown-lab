// 固定佈局實景探針：清出地圖正中一塊，每類一列、同類各版本沿「畫面水平」(x+1,y-1) 排開。
// node probe-civic.js --rows="52:0,1,2;11:0,1,2,3,4" --zoom=1 --out=shots575/civic_x [--cx=36 --cy=36]
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const ROWS = arg('rows', '52:0,1,2').split(';').map(r => { const [ks, vs] = r.split(':'); const [k, sz] = ks.split('@'); return { k: +k, sz: +(sz || 1), vs: vs.split(',').map(Number) }; }); // T609：「165@4:0,1,2」＝4×4 佔地
const CLEAR = +(process.argv.find(a => a.startsWith('--clear=')) || '--clear=26').split('=')[1];
const ZOOM = +arg('zoom', 1), OUT = arg('out', 'shots575/civic_x'), CX = +arg('cx', 36), CY = +arg('cy', 36), GAP = +arg('gap', 2);
const PORT = +arg('port', 8199), SNIP = arg('snippet', ''); // T609：設計師各用自己的埠、可注入批次檔
if ([8123].includes(PORT)) { console.error('埠 8123 禁用'); process.exit(2); }
const preScript = SNIP ? require('fs').readFileSync(SNIP, 'utf8') : '';
(async () => {
  const s = await withGame({ port: PORT, timeout: 300, preScript, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text); return r.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}document.querySelectorAll('.toast,#toast,#toasts,.hint,#hint,.coach,#coach456').forEach(e=>e.style.display='none');return 1;})()`);
    const plan = await ev(`(()=>{const A=GV.art574,ROWS=${JSON.stringify(ROWS)},CX=${CX},CY=${CY},GAP=${GAP};
      A.clear574(CX-(${CLEAR}>>1),CY-(${CLEAR}>>1),${CLEAR},${CLEAR});const list=[];
      ROWS.forEach((r,ri)=>{const n=r.vs.length;const row=ri-(ROWS.length-1)/2;
        r.vs.forEach((v,j)=>{const t=(j-(n-1)/2)*GAP;const x=Math.round(CX+row*GAP+t),y=Math.round(CY+row*GAP-t);list.push({k:r.k,x,y,sz:r.sz||1,v});});});
      const placed=A.plant574(list);GV.lookAt(CX,CY);A.zoom574(${ZOOM});return placed;})()`);
    const CYC = await ev('GV.art574.cycle574()'); const shots = {};
    for (const [tag, vt] of [['day', CYC * 0.5], ['night', 0]]) {
      await ev(`GV.setVisT(${vt});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`); await sleep(1200);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }); const dest = path.join(ROOT, `${OUT}_${tag}.png`);
      fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(shot.data, 'base64')); shots[tag] = path.relative(ROOT, dest);
    }
    return { placed: plan.map(p => `k${p.k}@${p.x},${p.y} v${p.v}`), shots };
  });
  console.log(JSON.stringify({ ok: s.ok, fails: s.fails, ...(s.result || {}) }, null, 1)); process.exit(s.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
