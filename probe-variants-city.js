// T574 城市實景驗證：在種子城清出一塊地，把同一類建築的 v0/v1/v2 並排種在真實地面上，
// 日夜各截一張。用法：node probe-variants-city.js --ks=67,84,31 --out=shots574/city_a [--zoom=1.5] [--seed=5162026]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const KS = arg('ks', '67,84,31').split(',').map(Number).filter(Boolean);
const OUT = arg('out', 'shots574/city_a');
const ZOOM = +arg('zoom', 1.5);
const SEED = +arg('seed', 5162026);
const EXPLICIT = arg('explicit', '') === '1';
const VN = +arg('vn', 3);
const SZ = JSON.parse(fs.readFileSync(path.join(ROOT, 'scout574/sz.json'), 'utf8'));

(async () => {
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}document.querySelectorAll('.toast,#toast,#toasts,.hint,#hint,.coach,#coach456,.mayorTip,#mayorTip').forEach(e=>e.style.display='none');return 1;})()`);
    const t574 = await ev('window.__t574||null');
    const plan = await ev(`(()=>{
      const A=GV.art574,SPR=A.SPR(),KS=${JSON.stringify(KS)},SZ=${JSON.stringify(SZ)};
      const szOf=k=>{if(SZ[k])return SZ[k];const b=SPR.bld[k+'_1_0']||{w:72};const w=b.w*(b.sc??1);return Math.max(1,Math.round((w-8)/64));};
      const rows=KS.map(k=>({k,sz:szOf(k),has:Array.from({length:${VN}},(_,v)=>!!SPR.bld[k+'_1_'+v])}));
      // 等距地圖裡畫面水平方向是 (x+1,y-1)、垂直向下是 (x+1,y+1)：同類三版本沿水平排、各類沿垂直疊
      const step=r=>r.sz+1;
      const need=rows.reduce((a,r)=>a+3*step(r)+6,0);
      const W=Math.min(66,need+rows.reduce((a,r)=>a+r.sz+3,0)),H=W;
      let best=null;
      for(let y0=2;y0<=70-H&&!best;y0+=2)for(let x0=2;x0<=70-W&&!best;x0+=2){
        let ok=true;for(let y=y0;y<y0+H&&ok;y+=2)for(let x=x0;x<x0+W&&ok;x+=2)if(!A.land574(x,y))ok=false;
        if(ok)best=[x0,y0];}
      if(!best){best=[3,3];}
      const [x0,y0]=best;A.clear574(x0,y0,W,H);
      const list=[];let bx=x0+2,by=y0+Math.floor(H/2);
      for(const r of rows){
        let t=0;
        for(let want=0;want<r.has.length;want++){
          if(!r.has[want])continue;
          const landOK=(x,y,sz)=>{for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++)if(!A.land574(x+dx,y+dy))return false;return true;};
          let tries=0;while(tries<90&&((!${EXPLICIT}&&A.vdraw({x:bx+t,y:by-t},{k:r.k,lv:1,v:0})!==want)||!landOK(bx+t,by-t,r.sz))){t++;tries++;}
          list.push({k:r.k,x:bx+t,y:by-t,sz:r.sz,want,v:${EXPLICIT}?want:0});t+=r.sz+(${EXPLICIT}?1:2);
        }
        bx+=r.sz+3;by+=r.sz+3;
      }
      const placed=A.plant574(list);
      const xs=list.map(q=>q.x+q.sz/2),ys=list.map(q=>q.y+q.sz/2);const cx=Math.round((Math.min(...xs)+Math.max(...xs))/2),cy=Math.round((Math.min(...ys)+Math.max(...ys))/2);
      GV.lookAt(cx,cy);A.zoom574(${ZOOM});
      return {x0,y0,W,H,placed,rows};
    })()`);
    if (plan.err) throw new Error(plan.err);
    const shots = {};
    const CY = await ev('GV.art574.cycle574()');
    for (const [tag, vt] of [['day', CY * 0.5], ['night', 0]]) {
      await ev(`GV.setVisT(${vt});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`);
      await sleep(1200);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const dest = path.join(ROOT, `${OUT}_${tag}.png`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
      shots[tag] = path.relative(ROOT, dest);
    }
    const errs = await ev(`(window.__consoleErr574||[]).length`);
    return { t574, plan, shots, errs };
  });
  const r = session.result || {};
  console.log(JSON.stringify({ ok: session.ok, fails: session.fails, seconds: session.seconds, t574: r.t574,
    placed: r.plan && r.plan.placed && r.plan.placed.map(p => `k${p.k}@${p.x},${p.y} sz${p.sz} v${p.v}`), shots: r.shots }, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('PROBE FAIL', e.message); process.exit(1); });
