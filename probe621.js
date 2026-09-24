// T621 進場探針：住宅近景（種子城 z=2、看 (12,12)、正午）裡的灰色平板／灰色三角是誰畫的。
// 做法：在遊戲畫布的 ctx 上掛 drawImage 鉤子，forceDraw 一次，記下每次貼圖的目標矩形、圖源與呼叫堆疊；
// 對每個指定的螢幕點，從後往前找「目標矩形蓋到它、而且圖源在那個像素不透明」的最後一次貼圖＝最上層的畫家。
// 用法：node probe621.js [--at=x,y;x,y...] [--z=2] [--look=12,12] [--ph=0.5] [--shot=shots621/probe.png]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PTS = arg('at', '400,170;650,160;770,165;580,445;190,255;1050,425;1125,555').split(';').map(s => s.split(',').map(Number));
const Z = +arg('z', 2), LOOK = arg('look', '12,12').split(',').map(Number), PH = +arg('ph', 0.5);
const SHOT = arg('shot', '');

const HOOK = `(() => {
  const cv = document.getElementById('game'), g = cv.getContext('2d'), orig = g.drawImage, log = [];
  const desc = img => { if (!img) return '?'; const t = img.__t547 ? ' t547=' + JSON.stringify(img.__t547) : '';
    const k = img.__key || img.key || img.__k || ''; return (img.tagName || img.constructor.name) + ' ' + img.width + 'x' + img.height + (k ? ' key=' + k : '') + t; };
  g.drawImage = function (img, ...a) {
    try {
      let sx = 0, sy = 0, sw = img.width, sh = img.height, dx, dy, dw, dh;
      if (a.length === 2) { [dx, dy] = a; dw = sw; dh = sh; } else if (a.length === 4) { [dx, dy, dw, dh] = a; } else { [sx, sy, sw, sh, dx, dy, dw, dh] = a; }
      const m = g.getTransform(), X = m.a * dx + m.e, Y = m.d * dy + m.f, W = m.a * dw, H = m.d * dh;
      const st = (new Error().stack || '').split('\\n').slice(2, 6).map(s => { const f = /at (\\S+)/.exec(s.trim()), l = /index\\.html:(\\d+)/.exec(s); return (f ? f[1] : '?') + '@' + (l ? l[1] : '?'); }).join(' < ');
      log.push({ img, sx, sy, sw, sh, X, Y, W, H, op: g.globalCompositeOperation, alpha: g.globalAlpha, st });
    } catch (e) {}
    return orig.call(this, img, ...a);
  };
  // 填色也要記：fill() 當下用 isPointInPath 問每個查詢點；fillRect 算變換後矩形。與 drawImage 共用同一個順序號。
  const PTS = window.__p621pts || [], oFill = g.fill, oRect = g.fillRect, fills = [];
  const stk = () => (new Error().stack || '').split('\\n').slice(2, 6).map(s => { const f = /at (\\S+)/.exec(s.trim()), l = /index\\.html:(\\d+)/.exec(s); return (f ? f[1] : '?') + '@' + (l ? l[1] : '?'); }).join(' < ');
  g.fill = function (...a) {
    try { const hit = PTS.map(([x, y]) => a[0] && typeof a[0] === 'object' ? g.isPointInPath(a[0], x, y) : g.isPointInPath(x, y)); if (hit.some(Boolean)) fills.push({ n: log.length, hit, col: String(g.fillStyle), op: g.globalCompositeOperation, alpha: g.globalAlpha, st: stk() }); } catch (e) {}
    return oFill.apply(this, a); };
  g.fillRect = function (x0, y0, w, h) {
    try { const m = g.getTransform(), X = m.a * x0 + m.e, Y = m.d * y0 + m.f, W = m.a * w, H = m.d * h;
      const hit = PTS.map(([x, y]) => x >= Math.min(X, X + W) && x < Math.max(X, X + W) && y >= Math.min(Y, Y + H) && y < Math.max(Y, Y + H));
      if (hit.some(Boolean)) fills.push({ n: log.length, hit, col: String(g.fillStyle), op: g.globalCompositeOperation, alpha: g.globalAlpha, st: stk(), rect: true }); } catch (e) {}
    return oRect.call(this, x0, y0, w, h); };
  // 裁切：save/restore 維護裁切堆疊；beginPath 清空、moveTo 記下每根柱子的西側中點（clipBlockDiag555 每格一次 moveTo）；
  // clip() 當下記下這組柱子與各查詢點是否在路徑內。drawImage 記錄當下生效的裁切編號。
  const oSave = g.save, oRestore = g.restore, oClip = g.clip, oBegin = g.beginPath, oMove = g.moveTo, clips = [];
  let stack = [], cur = -1, moves = [];
  g.save = function () { stack.push(cur); return oSave.call(this); };
  g.restore = function () { cur = stack.length ? stack.pop() : -1; return oRestore.call(this); };
  g.beginPath = function () { moves = []; return oBegin.call(this); };
  g.moveTo = function (x, y) { try { const m = g.getTransform(); moves.push([Math.round(m.a * x + m.e), Math.round(m.d * y + m.f)]); } catch (e) {} return oMove.call(this, x, y); };
  g.clip = function (...a) { try { clips.push({ moves: moves.slice(), inside: PTS.map(([x, y]) => g.isPointInPath(x, y)), st: stk() }); cur = clips.length - 1; } catch (e) {} return oClip.apply(this, a); };
  const oDI = g.drawImage;
  g.drawImage = function (img, ...a) { const r = oDI.call(this, img, ...a); if (log.length) log[log.length - 1].clip = cur; return r; };
  window.__p621 = { log, fills, clips, restore: () => { g.drawImage = orig; g.fill = oFill; g.fillRect = oRect; g.save = oSave; g.restore = oRestore; g.clip = oClip; g.beginPath = oBegin; g.moveTo = oMove; } };
  return 1;
})()`;

const QUERY = (pts) => `(() => {
  const { log, fills, clips, restore } = window.__p621; restore();
  const alphaAt = (e, px, py) => { try {
      const u = e.sx + (px - e.X) * e.sw / e.W, v = e.sy + (py - e.Y) * e.sh / e.H;
      if (u < 0 || v < 0 || u >= e.img.width || v >= e.img.height) return 0;
      const c = e.img.getContext ? e.img.getContext('2d') : null; if (!c) return 255;
      return c.getImageData(u | 0, v | 0, 1, 1).data[3]; } catch (err) { return -1; } };
  const rgbAt = (e, px, py) => { try { const u = e.sx + (px - e.X) * e.sw / e.W, v = e.sy + (py - e.Y) * e.sh / e.H;
      const d = e.img.getContext('2d').getImageData(u | 0, v | 0, 1, 1).data; return [d[0], d[1], d[2], d[3]]; } catch (err) { return null; } };
  const desc = img => { const t = img.__t547 ? ' t547=' + JSON.stringify(img.__t547) : ''; return (img.tagName || img.constructor.name) + ' ' + img.width + 'x' + img.height + t; };
  const out = [];
  for (const [px, py] of ${JSON.stringify(pts)}) {
    const hits = [];
    for (let i = log.length - 1; i >= 0 && hits.length < 3; i--) { const e = log[i];
      if (px < e.X || py < e.Y || px >= e.X + e.W || py >= e.Y + e.H) continue;
      const a = alphaAt(e, px, py); if (a > 0) { const pi = ${JSON.stringify(pts)}.findIndex(p => p[0] === px && p[1] === py), c = e.clip >= 0 ? clips[e.clip] : null;
        hits.push({ i, img: desc(e.img), op: e.op, alpha: e.alpha, rgba: rgbAt(e, px, py), rect: [e.X, e.Y, e.W, e.H].map(v => Math.round(v)), st: e.st,
          clip: c ? { insideClip: c.inside[pi], columnsWestMid: c.moves, clipSt: c.st } : null }); } }
    const pi = ${JSON.stringify(pts)}.findIndex(p => p[0] === px && p[1] === py);
    const lastImg = hits.length ? hits[0].i : -1;
    const laterFills = fills.filter(f => f.hit[pi] && f.n > lastImg && f.op !== 'multiply' && f.op !== 'screen' && f.op !== 'lighter').slice(-3)
      .map(f => ({ afterDrawImage: f.n, col: f.col, op: f.op, alpha: f.alpha, rect: !!f.rect, st: f.st }));
    // 同一張圖（同一棟樓）的所有分段：各自的裁切柱子、點在不在裡面
    const same = hits.length ? log.map((e, i) => ({ e, i })).filter(({ e }) => e.img === log[hits[0].i].img && e.X === log[hits[0].i].X && e.Y === log[hits[0].i].Y)
      .map(({ e, i }) => ({ i, cols: e.clip >= 0 ? clips[e.clip].moves : null, inside: e.clip >= 0 ? clips[e.clip].inside[pi] : null })) : [];
    out.push({ at: [px, py], top: hits.slice(0, 1), strips: same, fillsAfterTopImage: laterFills });
  }
  return { draws: log.length, out };
})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(1200);
    await ev(`GV.lookAt(${LOOK[0]},${LOOK[1]});GV.art574.zoom574(${Z});GV.setVisT(GV.art574.cycle574()*${PH});GV.forceDraw();1`);
    await ev(`window.__p621pts=${JSON.stringify(PTS)};1`);
    await ev(HOOK);
    await ev(`GV.setVisT(GV.art574.cycle574()*${PH});GV.forceDraw();1`);
    const q = await ev(QUERY(PTS));
    if (SHOT) { const u = await ev(`document.getElementById('game').toDataURL('image/png')`);
      const dest = path.join(ROOT, SHOT); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); q.shot = SHOT; }
    return q;
  });
  console.log(JSON.stringify(r.result || r.fails, null, 1));
  process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
