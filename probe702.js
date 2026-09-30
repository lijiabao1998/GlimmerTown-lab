// T702 守衛：溫室 k63 v1／v2 重畫。同一份遊戲開機兩次：①閥門 __noGreenhouse702（舊畫法）②預設（新畫法）；逐鍵比較全部建築精靈（白天＋夜圖）的像素雜湊。
//   斷言：②只有 63_1_1、63_1_2 跟①不同（v0 與其他精靈逐像素相同）；②的 v1／v2 尺寸錨點不變、不貼畫布邊、不出地面菱形、
//         夜圖亮像素都落在白天有像素的地方、夜光 ≥1000 且 ≥ 閥門版兩倍；variants574 批次全部跑完沒錯。
// 由 A 組代理人的 check702.js 改成單一份遊戲的閥門 A/B（原版三開機要兩份目錄，進版本庫後沒有「原版」可比）。
// 用法：node probe702.js [--port=8199]   退出碼 0＝守衛成立
'use strict';
const path = require('path');
const PORT = (process.argv.find(a => a.startsWith('--port=')) || '--port=8199').slice(7), DIR = __dirname;
const HASH = `(()=>{const B=GV.art574.SPR().bld,out={};
  const h=c=>{if(!c||!c.getContext)return 'none';const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let a=2166136261>>>0;for(let i=0;i<d.length;i++){a^=d[i];a=Math.imul(a,16777619)>>>0;}return c.width+'x'+c.height+':'+a.toString(16);};
  for(const k of Object.keys(B)){const s=B[k];if(!s||!s.img)continue;out[k]=h(s.img)+'|'+h(s.night)+'|'+s.ax+','+s.ay;}
  const geo={};for(const k of ['63_1_0','63_1_1','63_1_2']){const s=B[k];if(!s)continue;const w=s.w,H=s.h,d=s.img.getContext('2d').getImageData(0,0,w,H).data,n=s.night?s.night.getContext('2d').getImageData(0,0,w,H).data:null;
    let solid=0,edge=0,below=0,lit=0,litOff=0,glassLit=0;const cx=s.ax,cy=s.ay-32;
    for(let y=0;y<H;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>120){solid++;if(x<=1||y<=1||x>=w-2||y>=H-2)edge++;
        const lo=cy+32-Math.abs(x+.5-cx)/2;if(y+.5>lo+1.5||Math.abs(x+.5-cx)>65)below++;}
      if(n&&n[i+3]>40){lit++;if(d[i+3]===0)litOff++;}}
    geo[k]={w,h:H,ax:s.ax,ay:s.ay,solid,edge,below,lit,litOff};}
  return {out,geo,n:Object.keys(out).length};})()`;
async function run(dir, pre) {
  const { withGame } = require(path.resolve(dir, 'harness.js'));
  const r = await withGame({ port: +PORT, timeout: 300, log: () => {}, preScript: pre || undefined }, async ({ cdp }) => {
    const q = await cdp.send('Runtime.evaluate', { expression: HASH, returnByValue: true, awaitPromise: true });
    if (q.exceptionDetails) throw new Error(JSON.stringify(q.exceptionDetails).slice(0, 400));
    const e = await cdp.send('Runtime.evaluate', { expression: 'JSON.stringify(window.__t574||null)', returnByValue: true });
    return { ...q.result.value, t574: e.result.value };
  });
  if (!r.result) throw new Error('開不起來 ' + JSON.stringify(r.fails));
  return r.result;
}
(async () => {
  const A = await run(DIR, 'window.__noGreenhouse702=true;'), C = await run(DIR);
  const checks = [], add = (t, ok) => checks.push((ok ? '✓ ' : '✗ ') + t);
  // 兩邊都有的鍵才比像素；只在套過那邊出現的鍵＝新登記的精靈（T703 k199、T704 k200 疊在同一份時會出現）
  const diff = (X, Y) => Object.keys(X.out).filter(k => (k in Y.out) && X.out[k] !== Y.out[k]), gone = (X, Y) => Object.keys(X.out).filter(k => !(k in Y.out)), added = (X, Y) => Object.keys(Y.out).filter(k => !(k in X.out));
  const dAC = diff(A, C).concat(gone(A, C)), nC = added(A, C);
  add(`閥門關：${A.n} 個建築精靈裡只有 63_1_1、63_1_2 跟閥門版不同（實際：${dAC.join(',')}）`, dAC.length === 2 && dAC.includes('63_1_1') && dAC.includes('63_1_2'));
  add(`兩次開機的精靈鍵一樣（多出：${nC.join(',') || '無'}）`, nC.length === 0);
  add(`v0（63_1_0）逐像素不動`, A.out['63_1_0'] === C.out['63_1_0']);
  for (const k of ['63_1_1', '63_1_2']) {
    const g = C.geo[k], g0 = A.geo[k];
    add(`${k}：尺寸錨點維持 136×150、ax68 ay148（${g.w}×${g.h} ax${g.ax} ay${g.ay}）`, g.w === 136 && g.h === 150 && g.ax === 68 && g.ay === 148);
    add(`${k}：實心像素 ${g.solid}（舊 ${g0.solid}）、不貼畫布邊（${g.edge}）`, g.solid > 3000 && g.edge === 0);
    add(`${k}：不出地面菱形下緣／左右角（${g.below}）`, g.below === 0);
    add(`${k}：夜圖亮像素 ${g.lit}（舊 ${g0.lit}，要 ≥ 兩倍且 ≥1000）都落在白天有像素的地方（落空 ${g.litOff}）`, g.litOff === 0 && g.lit >= Math.max(1000, 2 * g0.lit));
  }
  { const tA = JSON.parse(A.t574 || '{}'), tC = JSON.parse(C.t574 || '{}');
    add(`variants574 批次全部跑完、沒有錯（${tC.ok}/${tC.batches}；b09 耗時 原版 ${tA.ms && tA.ms.b09}ms → ${tC.ms && tC.ms.b09}ms）`, !!tC.batches && tC.err.length === 0 && tC.ok === tC.batches); }
  console.log(checks.join('\n'));
  const ok = checks.every(c => c.startsWith('✓'));
  console.log(ok ? `全綠 ${checks.length}/${checks.length}` : `有紅 ${checks.filter(c => c.startsWith('✗')).length}/${checks.length}`);
    process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
