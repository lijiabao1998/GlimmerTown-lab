#!/usr/bin/env node
/* 微光小鎮 實驗線 — 接觸表 sheet.js（零依賴，骨架：harness.js）
 *
 * 為什麼要有它：業主的規則②要求每輪出「接觸表 A/B：同一批家族改前改後並排出圖，日夜各一張」。
 * 接觸表比實景圖好裁決——實景圖裡什麼都看得見，等於什麼都看不清。
 *
 * 用法（三步）：
 *   1) 動工前抓基準：  node sheet.js --family=vehTypes --snap=shots/T537_vehTypes_before.json
 *   2) 改美術
 *   3) 出 A/B 接觸表：  node sheet.js --family=vehTypes --ab=shots/T537_vehTypes_before.json --out=shots/T537_vehTypes
 *      會產生 <out>_day.png 與 <out>_night.png（左=before 右=after，同葉子並排）
 *
 * 單張瀏覽：node sheet.js --family=ped --out=shots/ped_now
 * 邊界：自用埠 8199；進城前一律設 slot=3；fresh 模式確保季節固定（指紋可重現）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PORT = +arg('port', 8199);
const FAMILY = arg('family', '');
const SNAP = arg('snap', '');
const AB = arg('ab', '');
const OUT = arg('out', '');
const SCALE = Math.max(1, Math.min(16, +arg('scale', 8) | 0));
const COLS = Math.max(1, +arg('cols', 12) | 0);
const GREP = arg('grep', '');   // 只取路徑符合此 regex 的葉子（大族出可讀切片用）

/* 取葉子：走 index.html 內的唯讀出口 GV.sheet536（SPR 在 IIFE 內，頁面直接抓不到） */
const PAGE_COLLECT = (family, grep) => `(window.GV && window.GV.sheet536) ? window.GV.sheet536(${JSON.stringify(family)}, ${JSON.stringify(grep || '')}) : {ok:false,err:'sheet536 不存在'}`;

/* 在頁面內把多張 dataURL 疊成一張 PNG（棋盤底 + 標籤 + 整數放大） */
const PAGE_SHEET = (items, scale, cols, title, mode) => `(async () => {
  const items = ${JSON.stringify(items)};
  const SC = ${scale}, COLS = Math.min(${cols}, Math.max(1, items.length));
  const PAD = 6, CELLW = 0;
  const imgs = [];
  for (const it of items) {
    const load = (src) => new Promise(res => {
      if (!src) { res(null); return; }
      const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src;
    });
    imgs.push({p: it.p, a: await load(it.a), b: await load(it.b), aw: it.aw, ah: it.ah, bw: it.bw, bh: it.bh});
  }
  let maxW = 4, maxH = 4;
  for (const g of imgs) {
    maxW = Math.max(maxW, (g.aw||0), (g.bw||0));
    maxH = Math.max(maxH, (g.ah||0), (g.bh||0));
  }
  const twoCol = ${JSON.stringify(mode)} === 'ab';
  const cellW = (twoCol ? maxW * 2 + 6 : maxW) * SC + PAD * 2;
  const cellH = maxH * SC + PAD * 2 + 14;
  const rows = Math.ceil(imgs.length / COLS);
  const W = Math.max(240, COLS * cellW), H = 26 + rows * cellH;
  const cvv = document.createElement('canvas'); cvv.width = W; cvv.height = H;
  const g = cvv.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#12161f'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#e8eefc'; g.font = '13px monospace'; g.textBaseline = 'top';
  g.fillText(${JSON.stringify(title)} + '   x' + SC + (${JSON.stringify(mode)}==='ab' ? '   [左 before / 右 after]' : ''), 8, 7);
  const checker = (x, y, w, h) => {
    for (let yy = 0; yy < h; yy += 6) for (let xx = 0; xx < w; xx += 6) {
      g.fillStyle = (((xx / 6) | 0) + ((yy / 6) | 0)) % 2 ? '#1b2130' : '#151a26';
      g.fillRect(x + xx, y + yy, Math.min(6, w - xx), Math.min(6, h - yy));
    }
  };
  for (let i = 0; i < imgs.length; i++) {
    const gx = (i % COLS) * cellW, gy = 26 + ((i / COLS) | 0) * cellH;
    g.fillStyle = '#0b0e15'; g.fillRect(gx, gy, cellW, cellH);
    g.fillStyle = '#8fa0c0'; g.font = '10px monospace';
    g.fillText(imgs[i].p.length > 26 ? imgs[i].p.slice(-26) : imgs[i].p, gx + PAD, gy + PAD);
    const drawOne = (im, sx, sw, sh, label) => {
      if (!im) return;
      const bw = sw * SC, bh = sh * SC;
      const bx = sx + PAD, by = gy + PAD + 12;
      checker(bx, by, bw, bh);
      g.drawImage(im, bx, by, bw, bh);
      if (twoCol) { g.fillStyle = '#6f80a0'; g.font = '9px monospace'; g.fillText(label, bx, by + bh + 1); }
    };
    if (twoCol) {
      drawOne(imgs[i].a, gx, imgs[i].aw, imgs[i].ah, 'before');
      drawOne(imgs[i].b, gx + maxW * SC + 6, imgs[i].bw, imgs[i].bh, 'after');
    } else {
      drawOne(imgs[i].a, gx, imgs[i].aw, imgs[i].ah, '');
    }
  }
  return cvv.toDataURL('image/png');
})()`;

function dataUrlToFile(u, file) {
  const b64 = u.split(',')[1];
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
}

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 接觸表 ===');
  if (!FAMILY) { console.log('X 需要 --family=<家族名>'); process.exit(1); }
  if (!SNAP && !AB && !OUT) { console.log('X 需要 --snap=<...> 或 --ab=<...> --out=<...>'); process.exit(1); }

  const session = await withGame({ port: PORT, timeout: 300, log, fresh: true }, async ({ cdp }) => {
    /* 抓目前狀態 */
    const cur = await cdp.evalJs(PAGE_COLLECT(FAMILY, GREP));
    if (!cur || !cur.ok) throw new Error('取葉子失敗: ' + JSON.stringify(cur));
    if (GREP) { const re = new RegExp(GREP); cur.leaves = cur.leaves.filter(l => re.test(l.p)); }
    log('家族 ' + FAMILY + '：' + cur.leaves.length + ' 片葉子');

    if (SNAP) {
      fs.mkdirSync(path.dirname(path.resolve(ROOT, SNAP)), { recursive: true });
      fs.writeFileSync(path.resolve(ROOT, SNAP), JSON.stringify({ family: FAMILY, leaves: cur.leaves }));
      log('已存基準：' + SNAP);
    }

    if (AB) {
      const before = JSON.parse(fs.readFileSync(path.resolve(ROOT, AB), 'utf8'));
      if (GREP) { const re = new RegExp(GREP); before.leaves = before.leaves.filter(l => re.test(l.p)); }
      const bmap = new Map(before.leaves.map(l => [l.p, l]));
      const items = [];
      const keys = new Set([...before.leaves.map(l => l.p), ...cur.leaves.map(l => l.p)]);
      for (const k of [...keys].sort()) {
        const b = bmap.get(k), a2 = cur.leaves.find(l => l.p === k);
        items.push({
          p: k,
          a: b ? b.day : null, aw: b ? b.w : 0, ah: b ? b.h : 0,
          b: a2 ? a2.day : null, bw: a2 ? a2.w : 0, bh: a2 ? a2.h : 0,
        });
      }
      const dayPng = await cdp.evalJs(PAGE_SHEET(items, SCALE, COLS, 'T537 ' + FAMILY + ' DAY', 'ab'));
      const nightItems = [];
      for (const k of [...keys].sort()) {
        const b = bmap.get(k), a2 = cur.leaves.find(l => l.p === k);
        nightItems.push({
          p: k,
          a: b && b.night ? b.night : null, aw: b ? b.w : 0, ah: b ? b.h : 0,
          b: a2 && a2.night ? a2.night : null, bw: a2 ? a2.w : 0, bh: a2 ? a2.h : 0,
        });
      }
      const nightPng = await cdp.evalJs(PAGE_SHEET(nightItems, SCALE, COLS, 'T537 ' + FAMILY + ' NIGHT', 'ab'));
      const base = path.resolve(ROOT, OUT);
      fs.mkdirSync(path.dirname(base), { recursive: true });
      dataUrlToFile(dayPng, base + '_day.png');
      dataUrlToFile(nightPng, base + '_night.png');
      log('已出接觸表：' + OUT + '_day.png / _night.png');
    } else if (OUT) {
      const items = cur.leaves.map(l => ({ p: l.p, a: l.day, aw: l.w, ah: l.h, b: null, bw: 0, bh: 0 }));
      const png = await cdp.evalJs(PAGE_SHEET(items, SCALE, COLS, FAMILY + ' DAY', 'one'));
      const base = path.resolve(ROOT, OUT);
      fs.mkdirSync(path.dirname(base), { recursive: true });
      dataUrlToFile(png, base + '_day.png');
      const nitems = cur.leaves.map(l => ({ p: l.p, a: l.night, aw: l.w, ah: l.h, b: null, bw: 0, bh: 0 }));
      const npng = await cdp.evalJs(PAGE_SHEET(nitems, SCALE, COLS, FAMILY + ' NIGHT', 'one'));
      dataUrlToFile(npng, base + '_night.png');
      log('已出接觸表：' + OUT + '_day.png / _night.png');
    }
  });

  if (session.fails.length) { console.log('X 失敗：' + session.fails.join(' / ')); process.exit(1); }
  console.log('');
  console.log('OK 接觸表完成（' + session.seconds.toFixed(1) + 's）');
  process.exit(0);
})().catch(e => { console.error('X 接觸表失敗: ' + e.message); process.exit(1); });
