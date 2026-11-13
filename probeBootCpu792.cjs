#!/usr/bin/env node
/* T792 真 Chrome 探測：開機烘焙期間建立的畫布留在 CPU（唯讀：不改遊戲檔、不寫存檔；自用埠，預設 8199）
 *
 * 三種開機各跑一次，讀頁面裡的自檢 bootCpuSelftest792()（它看畫布真的屬性，不看計數）：
 *   on            照常開機                              → 自檢全過、mode==='on'
 *   valve-window  載入前設 window.__noBootCpu792=true    → 自檢全過、mode==='valve'（沒有畫布被改）
 *   valve-session sessionStorage 設好後重新整理           → 同上
 * 另外記開機時間、console 錯誤數。--gpu 用這台機器的真顯示卡（D3D11）；不加就是倉庫 harness 的 --disable-gpu。
 * 用法：node probeBootCpu792.cjs [--gpu] [--port=8199]
 */
'use strict';
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const H = require('./harness.js');
const GPU = process.argv.includes('--gpu');
const PORT = +((process.argv.find(a => a.startsWith('--port=')) || '--port=8199').split('=')[1]);
const PRE_T = `(()=>{let v=false;Object.defineProperty(window,'__bootDone453',{configurable:true,get(){return v;},set(x){v=x;if(x&&!window.__bootDoneAt)window.__bootDoneAt=performance.now();}});})();`;
function launchGpu(devPort, profile) {
  const args = ['--headless=new', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--window-size=1280,800',
    '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', `--user-data-dir=${profile}`, `--remote-debugging-port=${devPort}`, 'about:blank'];
  const proc = spawn(H.findChrome(), args, { stdio: ['ignore', 'ignore', 'pipe'] });
  proc.__tail = ''; proc.stderr.on('data', d => { proc.__tail = (proc.__tail + d.toString()).slice(-2048); }); proc.stderr.unref();
  return proc;
}
async function boot(mode, n) {
  const devPort = PORT + 1000 + ((process.pid + n) % 400);
  const profile = path.join(H.ROOT, '.smoke-profile-' + process.pid + '-' + n);
  const chrome = GPU ? launchGpu(devPort, profile) : H.launchChrome(devPort, profile);
  let cdp;
  try {
    cdp = await H.cdpConnect(await H.pageWsUrl(devPort, chrome));
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Log.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: PRE_T + (mode === 'valve-window' ? 'window.__noBootCpu792=true;' : '') });
    const url = `http://127.0.0.1:${PORT}/index.html`;
    await cdp.send('Page.navigate', { url });
    if (!await H.waitFor(cdp, `!!window.__bootDone453`, 400000)) throw new Error(mode + ': boot 沒完成');
    if (mode === 'valve-session') {   // 真機的用法：主控台設好、重新整理
      await cdp.evalJs(`sessionStorage.setItem('glimmerville.noBootCpu792','1');true`);
      await cdp.send('Page.reload', {});
      await H.sleep(1500);
      if (!await H.waitFor(cdp, `!!window.__bootDone453&&!!window.__bootCpu792`, 400000)) throw new Error(mode + ': 重新整理後 boot 沒完成');
    }
    const r = JSON.parse(await cdp.evalJs(`JSON.stringify(Object.assign({bootMs:Math.round(window.__bootDoneAt)},window.bootCpuSelftest792?window.bootCpuSelftest792():{ok:false,checks:['API 不存在']}))`));
    r.gpu = await cdp.evalJs(`(()=>{try{const g=document.createElement('canvas').getContext('webgl');const e=g&&g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'(none)';}catch(e){return '(err)';}})()`);
    r.errors = cdp.errors.slice();
    return r;
  } finally { try { cdp && cdp.close(); } catch {} try { chrome.kill(); } catch {} await H.sleep(1200); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
}
(async () => {
  H.cleanProfiles();
  const srv = await H.startServer(PORT);
  const want = { on: 'on', 'valve-window': 'valve', 'valve-session': 'valve' };
  let bad = 0, n = 0;
  try {
    for (const mode of Object.keys(want)) {
      const r = await boot(mode, n++);
      const pass = r.ok === true && r.mode === want[mode] && r.errors.length === 0;
      if (!pass) bad++;
      console.log(`${pass ? 'PASS' : 'FAIL'} ${mode}: mode=${r.mode} n=${r.n} sprites=${r.sprites} boot=${r.bootMs}ms errors=${r.errors.length} renderer=${r.gpu}`);
      for (const c of r.checks || []) console.log('   ' + c);
      for (const e of r.errors) console.log('   console: ' + e);
    }
  } catch (e) { bad++; console.error('ERR', e && e.message); }
  finally { try { srv.close(); } catch {} }
  console.log(bad ? `probeBootCpu792: FAIL (${bad})` : 'probeBootCpu792: PASS');
  setTimeout(() => process.exit(bad ? 1 : 0), 500);
})();
