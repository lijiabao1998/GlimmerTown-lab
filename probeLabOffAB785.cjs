'use strict';
/* T785 R3：LAB-03／05／06／07 四個研究區塊的整幀與原生狀態 A/B（真 Chrome）。
 *
 * 原生頁＝候選 index.html 剝掉四個 LAB 區塊（就是 main 的頁面），再加一段觀察器。
 * 在同一座固定種子城市、同一視角下：
 *   OFF：四個閥門先開，再同步安裝四個區塊 → 畫布、原生狀態逐位相同；不新增 DOM；
 *        load／newWorld 仍是原生那一支；沒有亂數、沒有 storage 寫入。
 *   DEFAULT：閥門不開、面板不開，同步安裝 → 畫布、原生狀態逐位相同；不新增 DOM；沒有亂數、沒有 storage 寫入。
 * 另外先量「不安裝時連畫兩次」是否逐位相同（素材可能還在烘焙，最多等 10 秒、每 250ms 量一次）；
 * 相同才把「安裝後強制重繪」也當斷言，等不到穩定就照實記錄、只比同步安裝。
 * 觀察器插在 052 區之後、和四個區塊同一個腳本範圍，用直接 eval 安裝（間接 eval 會跑在全域、碰不到遊戲閉包裡的 load）。
 *
 * 用法：node probeLabOffAB785.cjs   （HTTP 埠取 PROBE_PORT，預設 8199）
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const ROOT = __dirname;
const PORT = +(process.env.PROBE_PORT || 8199);
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BLOCKS = [
  ['/* DSK-018 ROAD DELIVERY 053 BEGIN */', '/* DSK-018 ROAD DELIVERY 053 END */', '__noRoadDelivery053'],
  ['/* DSK-019 RAIL FREIGHT 054 BEGIN */', '/* DSK-019 RAIL FREIGHT 054 END */', '__noRailFreight054'],
  ['/* DSK-020 RAIL BLOCK 055 BEGIN */', '/* DSK-020 RAIL BLOCK 055 END */', '__noRailBlock055'],
  ['/* DSK-025 INTERMODAL 057 BEGIN */', '/* DSK-025 INTERMODAL 057 END */', '__noIntermodal057'],
];

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const texts = [];
let native = html;
for (const [b, e] of BLOCKS) {
  const s = html.indexOf(b), t = html.indexOf(e);
  assert.ok(s > 0 && t > s && html.indexOf(b, s + 1) < 0 && html.indexOf(e, t + 1) < 0, 'T785 R3 unique block ' + b);
  const wrapped = html.slice(s, t + e.length + 1);
  assert.ok(wrapped.endsWith('\n'), 'T785 R3 block ends with newline ' + b);
  texts.push(wrapped);
  native = native.replace(wrapped, '');
}

const OBSERVER = String.raw`
window.__labNative785=()=>{
  let N=0;for(let n=64;n<=256;n+=32){if(!GV.tile(n-1,0))break;N=n;}
  const rows=[];for(let y=0;y<N;y++){const r=[];for(let x=0;x<N;x++)r.push(JSON.stringify(GV.tile(x,y)));rows.push(r.join(','));}
  return JSON.stringify({N,day:GV.stats().day,stats:GV.stats(),tiles:rows.join('\n')});
};
window.__labAB785=(blockTexts,valves,redraw)=>{
  const canvas=document.getElementById('game');
  if(redraw)GV.forceDraw();
  const frameBefore=canvas.toDataURL(),nativeBefore=__labNative785(),domBefore=document.body.getElementsByTagName('*').length;
  const loadBefore=load,worldBefore=newWorld,originalR=R,originalRandom=Math.random;
  const originalSet=Storage.prototype.setItem,originalRemove=Storage.prototype.removeItem,originalClear=Storage.prototype.clear;
  let rng=0,storage=0,error=null;
  try{
    for(const v of valves)window[v]=true;
    R=()=>{rng++;return originalR();};Math.random=()=>{rng++;return originalRandom();};
    Storage.prototype.setItem=function(){storage++;return originalSet.apply(this,arguments);};
    Storage.prototype.removeItem=function(){storage++;return originalRemove.apply(this,arguments);};
    Storage.prototype.clear=function(){storage++;return originalClear.apply(this,arguments);};
    for(const text of blockTexts)eval(text); // 直接 eval：和真的嵌在頁面裡一樣，看得到遊戲同一個範圍的 load／newWorld
  }catch(e){error=String(e&&e.stack||e);}
  finally{R=originalR;Math.random=originalRandom;Storage.prototype.setItem=originalSet;Storage.prototype.removeItem=originalRemove;Storage.prototype.clear=originalClear;}
  const frameSync=canvas.toDataURL();
  if(redraw)GV.forceDraw();
  const frameAfter=canvas.toDataURL();
  return {error,rng,storage,
    canvasEqualSync:frameBefore===frameSync,canvasEqualRedraw:redraw?frameBefore===frameAfter:null,
    nativeEqual:nativeBefore===__labNative785(),domAdded:document.body.getElementsByTagName('*').length-domBefore,
    loadNative:load===loadBefore,worldNative:newWorld===worldBefore,
    apis:{road:!!GV.roadDelivery053,rail:!!GV.railFreight054,block:!!GV.railBlock055,intermodal:!!GV.intermodal057}};
};
window.__labRedrawStable785=()=>{const c=document.getElementById('game');GV.forceDraw();const a=c.toDataURL();GV.forceDraw();const b=c.toDataURL();return a===b;};
`;

function qaRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glimmertown-lab785-ab-'));
  for (const f of fs.readdirSync(ROOT)) {
    if (['.git', '.github', 'index.html', 'harness.js'].includes(f) || f.startsWith('.smoke-profile-')) continue;
    fs.symlinkSync(path.join(ROOT, f), path.join(dir, f), fs.statSync(path.join(ROOT, f)).isDirectory() ? 'dir' : 'file');
  }
  fs.copyFileSync(path.join(ROOT, 'harness.js'), path.join(dir, 'harness.js'));
  const anchor = '/* GPT-052 SINGLE LEDGER END */\n';
  assert.equal(native.split(anchor).length, 2, 'T785 R3 unique 052 end anchor');
  fs.writeFileSync(path.join(dir, 'index.html'), native.replace(anchor, anchor + OBSERVER + '\n'));
  return dir;
}

async function scenario(label, valves) {
  const dir = qaRoot();
  try {
    const { withGame } = require(path.join(dir, 'harness.js'));
    const r = await withGame({ port: PORT, timeout: 300, fresh: true, log: () => {} }, async ({ cdp }) => {
      await cdp.evalJs('GV.setSpeed(0);GV.newWorldSeeded(20261104);GV.forceDraw();true');
      let stable = false, stableTries = 0;
      while (!stable && stableTries < 40) { stableTries++; stable = await cdp.evalJs('__labRedrawStable785()'); if (!stable) await sleep(250); }
      const proof = await cdp.evalJs('__labAB785(' + JSON.stringify(texts) + ',' + JSON.stringify(valves) + ',' + JSON.stringify(stable) + ')');
      return { stable, stableTries, proof, errors: cdp.errors.slice(0, 5) };
    });
    return r && r.result;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { console.log('LAB_OFF_AB785 cleanup skipped: ' + e.code); }
  }
}

(async () => {
  const fails = [];
  const check = (ok, msg) => { if (!ok) fails.push(msg); };
  const off = await scenario('off', BLOCKS.map((b) => b[2]));
  const def = await scenario('default', []);
  for (const [name, r, valvesOn] of [['OFF', off, true], ['DEFAULT', def, false]]) {
    check(r && r.proof, name + ' 沒有結果');
    if (!r || !r.proof) continue;
    const p = r.proof;
    check(!p.error, name + ' 安裝錯誤：' + p.error);
    check(p.canvasEqualSync === true, name + ' 同步安裝後畫布不同');
    if (r.stable) check(p.canvasEqualRedraw === true, name + ' 強制重繪後畫布不同');
    check(p.nativeEqual === true, name + ' 原生狀態不同');
    check(p.domAdded === 0, name + ' 新增了 ' + p.domAdded + ' 個 DOM 節點');
    check(p.rng === 0, name + ' 動用了亂數 ' + p.rng + ' 次');
    check(p.storage === 0, name + ' 寫了 storage ' + p.storage + ' 次');
    if (valvesOn) check(p.loadNative === true && p.worldNative === true, name + ' 閥門開著仍改寫了 load／newWorld');
    check((r.errors || []).length === 0, name + ' console 有錯誤：' + JSON.stringify(r.errors));
  }
  const out = { ok: fails.length === 0, fails, nativeSha256: hash(native), candidateSha256: hash(html), off, default: def };
  console.log('LAB_OFF_AB785 ' + JSON.stringify(out, null, 1));
  console.log('LAB_OFF_AB785 RESULT ' + (out.ok ? 'PASS' : 'FAIL'));
  process.exitCode = out.ok ? 0 : 1;
})().catch((e) => { console.error('LAB_OFF_AB785 ERROR ' + ((e && e.stack) || e)); process.exitCode = 1; });
