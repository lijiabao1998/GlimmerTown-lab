#!/usr/bin/env node
/* T620 樣張頁：開一次遊戲、載種子城、暫停，逐一設鏡頭／縮放／時刻，forceDraw 後直接取遊戲畫布（不含 HUD），
 * 寫出 PNG 與手機友善的 index.html。GitHub Pages 工作流程用它產生 /shots/。
 *
 * 用法：node gallery.js [--out=shots620/site/shots] [--sha=<commit>] [--seed=5162026]
 * 邊界：自用埠 8199；進城前 slot=3（harness 處理），不碰業主存檔。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const OUT = path.resolve(ROOT, arg('out', 'shots620/site/shots'));
const SHA = arg('sha', process.env.GITHUB_SHA || '');
const SEED = +arg('seed', 5162026);

// 種子城：港區在 (36,36)、住宅在 (12,12)（T619 補驗找到的泡泡區）、遠景看城郊 (22,44)
const VIEWS = [
  { name: 'mid_day',       label: '中景・白天',     z: 0.75, ph: 0.5,  at: [36, 36] },
  { name: 'mid_night',     label: '中景・夜晚',     z: 0.75, ph: 0.02, at: [36, 36] },
  { name: 'near_day',      label: '近景・白天',     z: 1.5,  ph: 0.5,  at: [36, 36] },
  { name: 'near_night',    label: '近景・夜晚',     z: 1.5,  ph: 0.02, at: [36, 36] },
  { name: 'home_day',      label: '住宅近景・白天', z: 2,    ph: 0.5,  at: [12, 12] },
  { name: 'home_dusk',     label: '住宅近景・黃昏', z: 2,    ph: 0.73, at: [12, 12] },
  { name: 'home_night',    label: '住宅近景・夜晚', z: 2,    ph: 0.02, at: [12, 12] },
  { name: 'far_day',       label: '遠景・白天',     z: 0.45, ph: 0.5,  at: [22, 44] },
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function page(meta, shots) {
  const cards = shots.map(s => `
    <figure><a href="${esc(s.file)}"><img src="${esc(s.file)}" width="${s.w}" height="${s.h}" loading="lazy" alt="${esc(s.label)}"></a>
      <figcaption>${esc(s.label)}<span>z ${s.z}・ph ${s.ph}・b ${s.b}</span></figcaption></figure>`).join('');
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>微光小鎮實驗線 樣張</title>
<style>
  :root{color-scheme:dark;--bg:#16181f;--card:#1f222b;--fg:#eceef5;--dim:#9aa1b2;--acc:#8fb4ff}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,"Noto Sans CJK TC","WenQuanYi Zen Hei",sans-serif}
  header{padding:16px;max-width:1300px;margin:auto}h1{font-size:20px;margin:0 0 4px}
  header p{margin:2px 0;color:var(--dim)}a{color:var(--acc)}
  .play{display:inline-block;margin-top:8px;padding:8px 14px;border-radius:8px;background:#2b3550;text-decoration:none;font-weight:600}
  main{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,560px),1fr));gap:12px;padding:0 16px 24px;max-width:1300px;margin:auto}
  figure{margin:0;background:var(--card);border-radius:10px;overflow:hidden}
  img{display:block;width:100%;height:auto;image-rendering:pixelated}
  figcaption{padding:8px 10px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
  figcaption span{color:var(--dim);font-size:13px}
</style></head><body>
<header><h1>微光小鎮・實驗線　樣張</h1>
  <p>版本 v${esc(meta.ver)} / ${esc(meta.anchor)}${meta.sha ? `・commit <code>${esc(meta.sha.slice(0, 7))}</code>` : ''}・拍攝 ${esc(meta.time)}（UTC）</p>
  <p>種子城 ${meta.seed}，直接取遊戲畫布（不含介面）。點圖看原尺寸。</p>
  <a class="play" href="../">▶ 開始玩這一版</a></header>
<main>${cards}
</main></body></html>
`;
}

(async () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const ver = (/const GAME_VER='([^']+)'/.exec(html) || [])[1] || '?';
  const anchor = (/const GAME_ANCHOR='([^']+)'/.exec(html) || [])[1] || '?';
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(1200);
    fs.mkdirSync(OUT, { recursive: true });
    const shots = [];
    for (const v of VIEWS) {
      const q = await ev(`(()=>{GV.lookAt(${v.at[0]},${v.at[1]});GV.art574.zoom574(${v.z});GV.setVisT(GV.art574.cycle574()*${v.ph});GV.forceDraw();
        const c=document.getElementById('game');return {u:c.toDataURL('image/png'),w:c.width,h:c.height,b:GV.daylightDbg().b};})()`);
      const file = v.name + '.png';
      fs.writeFileSync(path.join(OUT, file), Buffer.from(q.u.split(',')[1], 'base64'));
      shots.push({ file, label: v.label, z: v.z, ph: v.ph, b: +q.b.toFixed(2), w: q.w, h: q.h });
    }
    return shots;
  });
  if (!r.ok || !r.result) { console.error('X 樣張失敗：', r.fails.join(' / ')); process.exit(1); }
  const meta = { ver, anchor, sha: SHA, seed: SEED, time: new Date().toISOString().slice(0, 16).replace('T', ' ') };
  fs.writeFileSync(path.join(OUT, 'index.html'), page(meta, r.result));
  const cm = r.chromeMs ? `，Chrome 冷啟動 ${(r.chromeMs.ms / 1000).toFixed(1)}s${r.chromeMs.attempt > 1 ? '（第 2 次才成功）' : ''}` : '';   // T627：Actions 紀錄裡看得到 runner 上的冷啟動時間
  console.log(`OK 樣張 ${r.result.length} 張 → ${path.relative(ROOT, OUT)}（${r.seconds.toFixed(1)}s，v${ver}/${anchor}${cm}）`);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
