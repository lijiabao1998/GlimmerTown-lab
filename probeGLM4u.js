// GLM-004 單元測試：離屏 canvas 直呼，驗證函式本體出像素
'use strict';
const { withGame } = require('./harness.js');
(async () => {
  const s = await withGame({ port: 8198, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    return await ev('(()=>{delete window.__noBoatGLM4;const c=document.createElement("canvas");c.width=128;c.height=64;const g2=c.getContext("2d");g2.fillStyle="#3671b6";g2.fillRect(0,0,128,64);GV.drawMooredBoatGLM4(g2,20,45,0,0,2);const d=g2.getImageData(0,0,128,64).data;let blue=0,other=0,samples=[];for(let y=0;y<64;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;const r2=d[i],g3=d[i+1],b=d[i+2];if(Math.abs(r2-54)<14&&Math.abs(g3-113)<14&&Math.abs(b-182)<14)blue++;else{other++;if(samples.length<4)samples.push(x+","+y+" rgb("+r2+","+g3+","+b+")");}}return JSON.stringify({blue,other,samples});})()');
  });
  console.log(s.result || JSON.stringify(s.fails));
  process.exit(0);
})().catch(e => { console.error('E', e.message); process.exit(1); });
