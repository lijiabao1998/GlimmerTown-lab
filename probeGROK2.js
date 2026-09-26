// T656（原 GROK-002；合併時埠 8293→8199、樣張改存 shots656/）：把 1×1 馬廄精靈存成白天圖，並在種子城找一棟 v 對上 mews 的住宅拍近景。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(500);
    return await ev(`(()=>{
      const B=GV.block559;B.cache().clear();
      const s=B.make(1,1,1,1,5);
      const sheet=s.img.toDataURL('image/png');
      let spot=null;
      for(let y=2;y<80&&!spot;y++)for(let x=2;x<80&&!spot;x++){
        const t=GV.tile(x,y);if(!t||t.t===0)continue;
        t.bld={k:1,lv:1,v:5,age:40,pw:true,h:1};
        const o=GV.block559.origin(x,y);
        if(o&&o.origin&&o.w===1&&o.h===1)spot={x,y};
        else t.bld=null;
      }
      if(!spot)return {sheet,sty:s.__t547&&s.__t547.sty,spot:null};
      const sg=window.__noSignal;window.__noSignal=true;
      GV.lookAt(spot.x,spot.y);GV.art574.zoom574(2);GV.forceDraw();
      const city=document.getElementById('game').toDataURL('image/png');
      window.__noSignal=sg;
      return {sheet,city,sty:s.__t547&&s.__t547.sty,spot};
    })()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const dir = path.join(ROOT, 'shots656');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'mews-sprite.png'), Buffer.from(q.sheet.split(',')[1], 'base64'));
  if (q.city) fs.writeFileSync(path.join(dir, 'mews-city.png'), Buffer.from(q.city.split(',')[1], 'base64'));
  console.log('sty', q.sty, 'spot', JSON.stringify(q.spot));
  console.log('OK shots656');
  process.exit(q.sty && String(q.sty).indexOf('ukMews') >= 0 ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
