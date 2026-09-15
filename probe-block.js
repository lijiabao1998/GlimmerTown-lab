// 把超街區 sprite 本身倒出來（不是在城市截圖裡找），放大存檔。
const fs = require('fs');
const { withGame } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const OUT = arg('out', 'shots/block_probe.png');
const SCALE = +arg('scale', 4);

(async () => {
  const log = (...a) => console.log(...a);
  const res = await withGame({ port: +arg('port', 8199), timeout: 300, log }, async ({ cdp }) => {
    const ev = async expr => {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || ''));
      return r.result.value;
    };
    const has = await ev("typeof (window.GV&&GV.block559)+'|'+typeof (GV.block559&&GV.block559.get)+'|'+typeof (GV.block559&&GV.block559.kit)");
    log('存在性 roofKit559|getBlockSprite547|paraPt559 =', has);

    const expr = `(()=>{
      const B=GV.block559,getBlockSprite547=B.get; const combos=[[2,2,4,4,1],[2,3,4,4,1],[3,2,4,4,0],[3,3,5,4,0],[1,3,4,4,0],[1,2,4,4,1]];
      let hits=-1;
      B.cache().clear();
      const sps=combos.map(c=>getBlockSprite547.apply(null,c));
      hits=0;
      const S=${SCALE};
      const W=sps.reduce((a,s)=>a+s.w,0)*S+ (sps.length+1)*8;
      const H=Math.max(...sps.map(s=>s.h))*S+16;
      const cc=document.createElement('canvas');cc.width=W;cc.height=H;
      const g=cc.getContext('2d');g.imageSmoothingEnabled=false;
      g.fillStyle='#2b6b34';g.fillRect(0,0,W,H);
      let x=8;
      for(const s of sps){ g.drawImage(s.img,x,8,s.w*S,s.h*S); x+=s.w*S+8; }
      return {png:cc.toDataURL('image/png').split(',')[1],hits,dims:sps.map(s=>s.w+'x'+s.h)};
    })()`;
    const r = await ev(expr);
    log('roofKit559 被呼叫次數 =', r.hits, ' sprite 尺寸 =', r.dims.join(' '));
    fs.writeFileSync(OUT, Buffer.from(r.png, 'base64'));
    log('wrote', OUT);
    return r.hits;
  });
  console.log('done hits=', res);
})().catch(e => { console.error('PROBE FAIL', e.message); process.exit(1); });
