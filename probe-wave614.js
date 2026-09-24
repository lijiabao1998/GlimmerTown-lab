#!/usr/bin/env node
/* T614 草稿審查探針：把 variants574 的草稿批次注入遊戲（不改 index.html），對每一類跑 T612 共用自檢 artWaveCheck612，
 * 並收集批次例外、console 錯誤、批次耗時與草稿自帶的 __<名>_chk／__<名>_errs。
 *
 * 用法：node probe-wave614.js [--files=civ_a,cul_d] [--port=8199] [--out=<json>]
 * 注入順序：草稿一律包成「佇列最後才跑」，模擬整合後排在 <!-- T610 batches --> 尾端的真實順序
 * （否則沒帶 __late 守衛的草稿會先跑，被後面的 b01–b11 舊批次蓋掉，審到的是舊圖）。
 * 邊界（AUTORUN.md）：自用埠 8199，進城前設 slot 3。
 */
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };

// 每個草稿負責的類與佔地邊長（與 index.html 的 MSZ 表核對過）
const KINDS = {
  civ_a: [[6, 1], [30, 1]], civ_b: [[61, 3], [95, 1]], civ_c: [[7, 1], [108, 2]], civ_d: [[32, 3], [113, 4]],
  civ_e: [[14, 1], [41, 2]], civ_f: [[15, 1], [28, 1]], civ_g: [[48, 3], [102, 1]], civ_h: [[42, 2], [43, 2]],
  cul_a: [[35, 2], [36, 2]], cul_b: [[37, 2], [40, 1]], cul_c: [[38, 3], [39, 3]], cul_d: [[44, 3], [47, 3]],
  cul_e: [[56, 3], [65, 4]], cul_f: [[84, 1], [87, 2]],
};
const FILES = arg('files', Object.keys(KINDS).join(',')).split(',').filter(Boolean);
const PORT = +arg('port', 8199), OUT = arg('out', '');
if (PORT === 8123) { console.error('埠 8123 禁用'); process.exit(2); }
for (const f of FILES) if (!KINDS[f]) { console.error('未知草稿 ' + f); process.exit(2); }

const FROM = arg('from', '');   // 只審一檔時可指定別的來源（例：git show 取出的舊版），用來驗守衛
if (FROM && FILES.length !== 1) { console.error('--from 只能搭配單一 --files'); process.exit(2); }
const src = FILES.map(f => '/* ' + f + ' */\n' + fs.readFileSync(FROM || path.join(ROOT, 'variants574', f + '.js'), 'utf8')).join('\n;\n');
// 第一個草稿要跑之前記下 SPR.bld 的物件：之後逐類比對「真的換掉了」
// （artWaveCheck612 只驗圖合不合格——cul_e 檔頭列了 k65 卻沒實作，舊圖照樣通過，第一版探針因此把它判成 OK）
const lateWrap = `;(function(){const Q=window.__variants574||[];const mine=Q.splice(0);
  const snap=function(A){if(!window.__probePre614)try{window.__probePre614=Object.assign({},A.SPR().bld);}catch(e){}};
  mine.forEach(function(f){const g=function(A){const QL=window.__variants574;if(!g.__late&&QL.indexOf(g)<QL.length-1){g.__late=1;QL.push(function late614(A2){snap(A2);f(A2);});return;}snap(A);f(A);};
    try{Object.defineProperty(g,'name',{value:f.name});}catch(e){}Q.push(g);});})();`;

(async () => {
  const list = [];
  for (const f of FILES) for (const [k, sz] of KINDS[f]) list.push({ f, k, sz });
  const r = await withGame({ port: PORT, timeout: 400, preScript: src + lateWrap, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const x = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (x.exceptionDetails) throw new Error(x.exceptionDetails.exception && x.exceptionDetails.exception.description || 'eval'); return x.result.value; };
    const per = [];
    for (const q of list) per.push({ f: q.f, k: q.k, sz: q.sz, res: await ev(`(()=>{const r=GV.artWaveCheck612([{k:${q.k},sz:${q.sz}}]);
      const pre=window.__probePre614,B=GV.art574.SPR().bld,stale=[0,1,2].map(v=>'${q.k}_1_'+v).filter(k=>!pre||!B[k]||B[k]===pre[k]);
      r.checks.push((stale.length?'NG ':'OK ')+'草稿真的換掉了舊圖'+(stale.length?'：'+stale.join('、')+' 仍是舊物件':''));r.ok=r.ok&&!stale.length;return r;})()`) });
    const meta = await ev(`(()=>{const t=window.__t574||{};const names=${JSON.stringify(FILES)};const own={};
      names.forEach(n=>{const c=window['__'+n+'_chk'],e=window['__'+n+'_errs'];if(c!==undefined||e!==undefined)own[n]={chk:c,errs:e};});
      const ms={};names.forEach(n=>{ms[n]=t.ms?t.ms[n]:undefined;});return {batches:t.batches,ok:t.ok,err:t.err,ms,own};})()`);
    return { per, meta, errors: cdp.errors.slice(0, 40) };
  });
  const res = r.result || {};
  let bad = 0;
  for (const p of res.per || []) {
    const ng = p.res.checks.filter(c => c.startsWith('NG'));
    if (ng.length) bad++;
    console.log((ng.length ? 'NG ' : 'OK ') + p.f + ' k' + p.k + '@' + p.sz + (ng.length ? '\n     ' + ng.join('\n     ') : ''));
  }
  const m = res.meta || {};
  console.log('批次耗時(ms)：' + JSON.stringify(m.ms));
  if (m.err && m.err.length) console.log('批次例外：' + JSON.stringify(m.err));
  if (m.own && Object.keys(m.own).length) console.log('草稿自帶檢查：' + JSON.stringify(m.own).slice(0, 1500));
  if (res.errors && res.errors.length) console.log('console 錯誤 ' + res.errors.length + ' 筆：\n  ' + res.errors.slice(0, 12).join('\n  '));
  if (r.fails && r.fails.length) console.log('骨架失敗：' + r.fails.join('；'));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  console.log((bad ? '有 ' + bad + ' 類未過' : '全部類別通過共用自檢') + '（' + r.seconds.toFixed(1) + 's）');
  process.exit(bad || (r.fails && r.fails.length) ? 1 : 0);
})();
