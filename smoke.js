#!/usr/bin/env node
/* 微光小鎮 實驗線 — 開機煙霧測試（零依賴）
 *
 * 用途：無頭 Chrome 載入 index.html，斷言三件事
 *   ① 開機管線 pct 走到底（boot453 收掉）
 *   ② 主迴圈真的在跑（frame 計數遞增）
 *   ③ 沒有 console error / 未捕捉例外
 * 並在進入城市後確認烘焙完成（__t519Roof > 0）＝真正跑過一次 buildSprites。
 *
 * 用法：node smoke.js [--port=8199] [--keep] [--timeout=240]
 *   退出碼 0 = 綠燈；1 = 紅燈（錯誤清單會印出來）
 *
 * 存檔保護（AUTORUN.md §1.6）：進入城市前一律把 slot 設成 3，絕不碰業主的槽。
 * 產物：shots/smoke-<timestamp>.png（煙霧測試樣張）
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = __dirname;
const arg = (n, d) => {
  const hit = process.argv.find(a => a.startsWith('--' + n + '='));
  return hit ? hit.split('=').slice(1).join('=') : d;
};
const PORT = +arg('port', 8199);
const TIMEOUT_MS = +arg('timeout', 240) * 1000;
const KEEP = process.argv.includes('--keep');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log('  ' + a.join(' '));

/* ---------- 靜態伺服器（只服務本目錄，唯讀） ---------- */
function startServer() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
      const file = path.join(ROOT, rel);
      if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
        res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'cache-control': 'no-store' });
        res.end(buf);
      });
    });
    srv.on('error', reject);
    srv.listen(PORT, '127.0.0.1', () => resolve(srv));
  });
}

/* ---------- 極簡 CDP 客戶端（Node 內建 WebSocket） ---------- */
async function cdpConnect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const errors = [];
  const benign = [];
  let id = 0;
  let frames = 0;
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', () => rej(new Error('CDP WebSocket 連線失敗')), { once: true });
  });
  ws.addEventListener('message', ev => {
    let m; try { m = JSON.parse(ev.data); } catch { return; }
    if (m.id !== undefined && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      return;
    }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params?.exceptionDetails || {};
      const head = '未捕捉例外: ' + (d.exception?.description || d.text || '(未知)').split('\n')[0];
      // 取前 3 個有意義的堆疊幀（跳過 CDP 內部幀）——沒有堆疊的例外等於沒抓到
      const fr = (d.stackTrace?.callFrames || [])
        .filter(f => !/^\(?(native|internal)/.test(f.functionName || ''))
        .slice(0, 3)
        .map(f => `${f.functionName || '(匿名)'}@${f.lineNumber + 1}:${f.columnNumber + 1}`);
      errors.push(fr.length ? head + '\n        ↳ ' + fr.join('\n        ↳ ') : head);
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params?.type === 'error') {
      errors.push('console.error: ' + (m.params.args || []).map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
    } else if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') {
      const url = String(m.params.entry.url || '');
      const text = String(m.params.entry.text || '');
      // 已知良性：單檔專案刻意不含的 PWA 附屬檔（index.html 的 manifest/icon link 與 sw.js 註冊）
      if (/manifest\.json|icon\.svg|sw\.js/.test(url + ' ' + text) ||
          /bad HTTP response code.*fetching the script/i.test(text)) {
        benign.push('PWA 附屬檔 404: ' + (url || text).slice(0, 60)); return;
      }
      errors.push('log: ' + text.slice(0, 200) + (url ? ' @' + url.slice(-60) : ''));
    } else if (m.method === 'Page.frameNavigated') {
      frames++;
    }
  });
  const send = (method, params) => new Promise((res, rej) => {
    const i = ++id; pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params: params || {} }));
  });
  const evalJs = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('evaluate 例外: ' + (r.exceptionDetails.exception?.description || '').split('\n')[0]);
    return r.result?.value;
  };
  return { send, evalJs, errors, benign, close: () => ws.close() };
}

/* ---------- 取得頁面 target 的 WS 端點 ---------- */
async function pageWsUrl(devPort) {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${devPort}/json/list`).then(r => r.json());
      const page = (list || []).find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* 還沒起來 */ }
    await sleep(250);
  }
  throw new Error('等不到 Chrome 的 page target');
}

/* ---------- 主流程 ---------- */
(async () => {
  const t0 = Date.now();
  const fails = [];
  const chromePath = process.env.CHROME_PATH || CHROME_CANDIDATES.find(p => fs.existsSync(p));
  if (!chromePath) { console.error('找不到 Chrome/Edge，可設 CHROME_PATH 環境變數'); process.exit(1); }

  fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
  // 每輪唯一的 profile 與 debug 埠：前一輪 Chrome 尚未完全退出時，共用資源會造成偶發「等不到 target」。
  // 先清掉歷史遺留目錄（盡力而為，被佔住就跳過）。
  for (const d of fs.readdirSync(ROOT)) {
    if (d.startsWith('.smoke-profile')) { try { fs.rmSync(path.join(ROOT, d), { recursive: true, force: true }); } catch {} }
  }
  const profile = path.join(ROOT, '.smoke-profile-' + process.pid);

  console.log('\n=== 微光小鎮 煙霧測試 ===');
  log('根目錄', ROOT);
  log('瀏覽器', chromePath);
  log('埠', PORT);

  const srv = await startServer();
  const devPort = PORT + 1000 + (process.pid % 400);   // 唯一 debug 埠，避開殘留 Chrome
  const chrome = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--mute-audio', '--window-size=1280,800',
    `--user-data-dir=${profile}`, `--remote-debugging-port=${devPort}`, 'about:blank',
  ], { stdio: 'ignore' });

  let cdp = null;
  try {
    cdp = await cdpConnect(await pageWsUrl(devPort));
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Page.enable');

    /* 階段 1：載入主選單 */
    log('① 載入 index.html …');
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    const menuReady = await waitFor(cdp, `(() => {
      const b = document.getElementById('boot453'), s = document.getElementById('start');
      return (b && getComputedStyle(b).visibility === 'hidden') || (s && getComputedStyle(s).display !== 'none');
    })()`, 120000);
    if (!menuReady) fails.push('主選單未在時限內就緒（開機管線沒跑完）');
    else log('   主選單就緒', ((Date.now() - t0) / 1000).toFixed(1) + 's');

    /* 階段 2：進城（先把 slot 設成 3 —— 絕不碰業主的槽） */
    log('② 進入城市（slot=3 保護）…');
    await cdp.evalJs(`localStorage.setItem('glimmerville.v1.slot','3')`);
    await cdp.evalJs(`(() => {
      const btn = [...document.querySelectorAll('#start button')].find(b => /繼續|開拓新城市/.test(b.textContent||''));
      if (btn) btn.click(); return !!btn;
    })()`);
    // 若跳出「新城市」面板，選沙盒 + 72×72 + 建立
    await sleep(1500);
    await cdp.evalJs(`(() => {
      const txt = t => [...document.querySelectorAll('#startOverlay456 button, #startOverlay456 .mapBtn456')]
        .find(b => new RegExp(t).test((b.textContent||'').trim()));
      const ov = document.getElementById('startOverlay456');
      if (!ov || getComputedStyle(ov).display === 'none') return 'no-overlay';
      const d = txt('沙盒'); if (d) d.click();
      const m = txt('^72×72'); if (m) m.click();
      const g = txt('建立城市'); if (g) g.click();
      return 'created';
    })()`);

    /* 階段 3：烘焙完成（＝真的跑過一次 buildSprites） */
    log('③ 等素材烘焙完成 …');
    const baked = await waitFor(cdp, `window.__t519Roof|0`, 200000, v => v > 0);
    if (!baked) fails.push('素材烘焙未完成（__t519Roof 一直為 0）');
    else log('   烘焙完成', ((Date.now() - t0) / 1000).toFixed(1) + 's');

    /* 階段 4：主迴圈在跑 */
    log('④ 確認主迴圈 …');
    const a = await cdp.evalJs(`(window.__smokeFrames|0)`);
    await cdp.evalJs(`(() => { let n = 0; const step = () => { window.__smokeFrames = ++n; requestAnimationFrame(step); }; requestAnimationFrame(step); return 1; })()`);
    await sleep(1200);
    const b2 = await cdp.evalJs(`(window.__smokeFrames|0)`);
    if (!(b2 > a)) fails.push('主迴圈沒有在跑（requestAnimationFrame 未遞增）');
    else log('   主迴圈 OK（' + (b2 - a) + ' frames/1.2s）');

    /* 階段 5：console 乾淨 */
    log('⑤ 錯誤檢查 …');
    if (cdp.errors.length) {
      fails.push('console 有 ' + cdp.errors.length + ' 筆錯誤');
      cdp.errors.slice(0, 10).forEach(e => log('   ✗ ' + e));
    } else log('   0 筆 console error');
    if (cdp.benign.length) log('   （已知良性 ' + cdp.benign.length + ' 筆：manifest/icon 404，單檔專案刻意不含）');

    /* 樣張 */
    try {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const out = path.join(ROOT, 'shots', 'smoke-' + Date.now() + '.png');
      fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
      log('   樣張', path.relative(ROOT, out));
    } catch (e) { log('   樣張失敗（不影響判定）'); }
  } catch (e) {
    fails.push('執行期錯誤: ' + e.message);
  } finally {
    try { cdp && cdp.close(); } catch {}
    try { chrome.kill(); } catch {}
    srv.close();
    if (!KEEP) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 1500);
  }

  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  if (fails.length) {
    console.log('\n❌ 紅燈（' + secs + 's）');
    fails.forEach(f => console.log('   - ' + f));
    process.exit(1);
  }
  console.log('\n✅ 綠燈（' + secs + 's）— 開機管線走完、主迴圈在跑、console 乾淨\n');
  process.exit(0);
})();

/* 輪詢直到表達式為真（或 predicate 通過） */
async function waitFor(cdp, expr, timeoutMs, predicate) {
  const ok = predicate || (v => !!v);
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try { const v = await cdp.evalJs(expr); if (ok(v)) return true; } catch { /* 過渡期 */ }
    await sleep(700);
  }
  return false;
}
