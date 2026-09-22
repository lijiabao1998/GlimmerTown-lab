// T610 探針：開機前掛攔截，記下畫在指定尺寸畫布上的橢圓（找農場／牧場那塊大暗影是誰畫的）
'use strict';
const { withGame } = require('./harness.js');
const PRE = String.raw`(()=>{window.__ell610={};const P=CanvasRenderingContext2D.prototype,oE=P.ellipse,oF=P.fill;
  P.ellipse=function(...a){try{const c=this.canvas;if(c&&c.width===136&&c.height===150&&a[2]>=30){this.__e610=(new Error().stack||'').split('\n').slice(2,5).map(s=>{const m=/index\.html:(\d+):\d+/.exec(s);const f=/at (\S+)/.exec(s.trim());return (f?f[1]:'?')+'@'+(m?m[1]:'?');}).join(' <- ')+' r='+Math.round(a[2])+'x'+Math.round(a[3]);}}catch(e){}return oE.apply(this,a)};
  P.fill=function(...a){try{if(this.__e610){const k=this.__e610+' '+String(this.fillStyle);window.__ell610[k]=(window.__ell610[k]||0)+1;this.__e610=null;}}catch(e){}return oF.apply(this,a)};})();`;
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, preScript: PRE, enterCity: false, log: () => {} }, async ({ cdp }) => {
    const q = await cdp.send('Runtime.evaluate', { expression: 'window.__ell610', returnByValue: true });
    return q.result.value;
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
