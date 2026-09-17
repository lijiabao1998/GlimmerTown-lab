/* 微光小鎮 實驗線 — 共用測試骨架（零依賴）
 *
 * 把「起靜態伺服器 → 開無頭 Chrome → 走 CDP → 導航 → 設 slot=3 → 進城 → 等烘焙」
 * 這段每個工具都要重寫一次的東西收在一處。smoke.js 與 fp.js 都用它。
 *
 * 邊界（AUTORUN.md）：自用埠 8199；載入前必設 glimmerville.v1.slot='3'；不碰業主存檔。
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname);

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
function findChrome() {
  const p = process.env.CHROME_PATH || CHROME_CANDIDATES.find(x => fs.existsSync(x));
  if (!p) throw new Error('找不到 Chrome/Edge，可設 CHROME_PATH 環境變數');
  return p;
}

function startServer(port) {
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
    srv.listen(port, '127.0.0.1', () => resolve(srv));
  });
}

/* ---------- 極簡 CDP 客戶端（Node 內建 WebSocket） ---------- */
async function cdpConnect(wsUrl, onEvent) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const errors = [];
  const benign = [];
  let id = 0;
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
    if (onEvent) { try { onEvent(m, errors, benign); } catch {} return; }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params?.exceptionDetails || {};
      const head = '未捕捉例外: ' + (d.exception?.description || d.text || '(未知)').split('\n')[0];
      const fr = (d.stackTrace?.callFrames || []).filter(f => !/^\(?(native|internal)/.test(f.functionName || ''))
        .slice(0, 3).map(f => `${f.functionName || '(匿名)'}@${f.lineNumber + 1}:${f.columnNumber + 1}`);
      errors.push(fr.length ? head + '\n        ↳ ' + fr.join('\n        ↳ ') : head);
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params?.type === 'error') {
      errors.push('console.error: ' + (m.params.args || []).map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
    } else if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') {
      const url = String(m.params.entry.url || ''), text = String(m.params.entry.text || '');
      if (/manifest\.json|icon\.svg|sw\.js/.test(url + ' ' + text) || /bad HTTP response code.*fetching the script/i.test(text)) {
        benign.push('PWA 附屬檔 404: ' + (url || text).slice(0, 60)); return;
      }
      errors.push('log: ' + text.slice(0, 200) + (url ? ' @' + url.slice(-60) : ''));
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

function launchChrome(devPort, profile) {
  return spawn(findChrome(), [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--mute-audio', '--window-size=1280,800',
    `--user-data-dir=${profile}`, `--remote-debugging-port=${devPort}`, 'about:blank',
  ], { stdio: 'ignore' });
}

function cleanProfiles() {
  // T574：平行代理人同時跑時，只清「擁有者行程已不在」的 profile，不刪別人正在用的
  let n = 0;
  const alive = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
  try {
    for (const d of fs.readdirSync(ROOT)) {
      if (!d.startsWith('.smoke-profile')) continue;
      const m = /-(\d+)$/.exec(d);
      if (m && +m[1] !== process.pid && alive(+m[1])) continue;
      try { fs.rmSync(path.join(ROOT, d), { recursive: true, force: true }); n++; } catch {}
    }
  } catch {}
  return n;
}

async function waitFor(cdp, expr, timeoutMs, predicate) {
  const ok = predicate || (v => !!v);
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try { const v = await cdp.evalJs(expr); if (ok(v)) return true; } catch {}
    await sleep(700);
  }
  return false;
}

/**
 * 開一個「已經在城市裡、素材也烘好了」的遊戲工作階段。
 * @param {{port?:number, timeout?:number, keep?:boolean, enterCity?:boolean, log?:Function}} opt
 * @param {(ctx:{cdp:object, port:number})=>Promise<any>} fn
 */
async function withGame(opt, fn) {
  const o = opt || {};
  const PORT = o.port || 8199;
  const TIMEOUT = (o.timeout || 300) * 1000;
  const log = o.log || (() => {});
  const enterCity = o.enterCity !== false;
  const fresh = o.fresh === true;   // 清掉自己的測試槽並開新城市：固定 day=1 ⇒ 季節固定 ⇒ 烘焙指紋可重現
  cleanProfiles();
  const profile = path.join(ROOT, '.smoke-profile-' + process.pid);
  const srv = await startServer(PORT);
  const devPort = PORT + 1000 + (process.pid % 400);
  const chrome = launchChrome(devPort, profile);
  let cdp = null;
  const out = { ok: false, fails: [], port: PORT, t0: Date.now() };
  try {
    cdp = await cdpConnect(await pageWsUrl(devPort));
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Page.enable');
    out.cdp = cdp;
    if (o.preScript) { try { await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: o.preScript }); } catch (e) {} }
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    const menuReady = await waitFor(cdp, `(() => {
      const b = document.getElementById('boot453'), s = document.getElementById('start');
      // T575：主選單會在後製鏈跑完前先出現；此時點「開拓新城市」會被忽略 ⇒ 城市沒建立、tiles 為 null（T558 同症）。必須等 __bootDone453。
      return !!window.__bootDone453 && ((b && getComputedStyle(b).visibility === 'hidden') || (s && getComputedStyle(s).display !== 'none'));
    })()`, 120000);
    if (!menuReady) out.fails.push('主選單未在時限內就緒');
    if (enterCity) {
      const seqBefore = await cdp.evalJs(`window.__bootSeq453|0`);   // 進城前記下序號
      await cdp.evalJs(`localStorage.setItem('glimmerville.v1.slot','3')`);   // 保護業主存檔
      if (fresh) {   // 只清自己的測試槽（AUTORUN.md 指定的 slot 3），不動其他槽
        await cdp.evalJs(`(() => { ['s3','s3_bak','s3.sandbox516b','s3.sandbox516b_bak'].forEach(function(k){ try{ localStorage.removeItem('glimmerville.v1.'+k); }catch(e){} }); return 1; })()`);
        await cdp.evalJs(`(() => { const b=[...document.querySelectorAll('#start button')].find(x=>/開拓新城市/.test(x.textContent||'')); if(b)b.click(); return !!b; })()`);
      } else {
        await cdp.evalJs(`(() => { const b=[...document.querySelectorAll('#start button')].find(x=>/繼續|開拓新城市/.test(x.textContent||'')); if(b)b.click(); return !!b; })()`);
      }
      await sleep(1500);
      await cdp.evalJs(`(() => {
        const ov=document.getElementById('startOverlay456'); if(!ov||getComputedStyle(ov).display==='none')return 'no-overlay';
        const T=t=>[...document.querySelectorAll('#startOverlay456 button, #startOverlay456 .mapBtn456')].find(b=>new RegExp(t).test((b.textContent||'').trim()));
        const d=T('沙盒');if(d)d.click();const m=T('^72×72');if(m)m.click();const g=T('建立城市');if(g)g.click();return 'created';
      })()`);
      // 閘門＝真正 boot 完成（__bootDone453），不是 buildSprites 內部的 __t519Roof——
      // 後者在 T464…T480/T539 這串後置 pass 之前就成立，會讓量測漏掉它們（T539 血淚教訓）。
      // 閘門：素材已烘 ＋ 3 秒沉降（讓 T479/T480/T539 這串後置 pass 收尾）。
      const baked = await waitFor(cdp, `(window.__t519Roof|0)`, Math.max(120000, TIMEOUT / 2), v => v > 0);
      if (baked) await sleep(3000);
      if (!baked) out.fails.push('boot 未完成（__bootDone453／__t519Roof）');
      else log('   烘焙完成 ' + ((Date.now() - out.t0) / 1000).toFixed(1) + 's');
    }
    out.result = await fn(out);
    out.ok = out.fails.length === 0;
  } catch (e) {
    out.fails.push('執行期錯誤: ' + e.message);
  } finally {
    try { cdp && cdp.close(); } catch {}
    try { chrome.kill(); } catch {}
    srv.close();
    if (!o.keep) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 1500);
  }
  out.seconds = (Date.now() - out.t0) / 1000;
  return out;
}

module.exports = { ROOT, sleep, startServer, cdpConnect, pageWsUrl, launchChrome, cleanProfiles, waitFor, withGame, findChrome };
