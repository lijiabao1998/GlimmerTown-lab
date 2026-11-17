#!/usr/bin/env node
/* T793 真 Chrome 探測：新城沒有零售時，商業需求退回既有公式（唯讀：不改遊戲檔；存檔只用第 3 格；自用埠，預設 8199）
 *
 * 新版＝倉庫裡的 index.html；舊版＝同一份頁面把 T793 那一段用守衛轉接清單逆轉回去（CDP 攔截回應換頁，不寫檔）。
 *   plan-777、plan-22  新開 72×72、難度 1 的城，第 1 天放同一份固定規劃（一座電廠、24 格路、住宅 40／商業 20／工業 28 格），
 *                      之後每天買得起就補一座水塔，此外不再操作，跑 30 天，數商業區長出的建築（k===2）。
 *                      驗收 C2：新版每個種子 ≥ 5 棟；舊版每個種子 ≤ 1 棟。
 *   mature             讀成熟城 docs/branch/GPT-022-guard-inputs/native-city-mature36-021.json，新舊各跑 30 天，
 *                      每天的人口、金錢、三項需求、建築數逐位相同（驗收 C3）；零售容量是 0 的日子照實列出。
 *   valve-session      新版先設 sessionStorage 的 glimmerville.noComBoot793='1'，再跑 plan-777：每天的數字要和舊版逐位相同。
 *   valve-window       新版載入前設 window.__noComBoot793=true，再跑 plan-777：同上。
 * 另外在新版頁面跑常駐自檢 comBootSelftest793()，並記 console 錯誤。--gpu 用這台機器的真顯示卡；不加就是倉庫 harness 的 --disable-gpu。
 * 用法：node probeComBoot793.cjs [--gpu] [--port=8199] [--days=30] [--out=<結果 JSON 路徑，寫在倉庫外>]
 */
'use strict';
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const H = require('./harness.js');
const { normalizeComBoot793 } = require('./comboot793-projection.cjs');
const GPU = process.argv.includes('--gpu');
const PORT = +((process.argv.find(a => a.startsWith('--port=')) || '--port=8199').split('=')[1]);
const DAYS = +((process.argv.find(a => a.startsWith('--days=')) || '--days=30').split('=')[1]);
const OUT = (process.argv.find(a => a.startsWith('--out=')) || '').slice(6);
const CAND = fs.readFileSync(path.join(H.ROOT, 'index.html'), 'utf8');
const OLD = normalizeComBoot793(CAND);
if (OLD === CAND) throw new Error('T793 那一段不在 index.html 裡（逆轉沒有作用）');
const OLD_B64 = Buffer.from(OLD, 'utf8').toString('base64');
const MATURE = fs.readFileSync(path.join(H.ROOT, 'docs/branch/GPT-022-guard-inputs/native-city-mature36-021.json'), 'utf8');

function launchGpu(devPort, profile) {
  const args = ['--headless=new', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--window-size=1280,800',
    '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', `--user-data-dir=${profile}`, `--remote-debugging-port=${devPort}`, 'about:blank'];
  const proc = spawn(H.findChrome(), args, { stdio: ['ignore', 'ignore', 'pipe'] });
  proc.__tail = ''; proc.stderr.on('data', d => { proc.__tail = (proc.__tail + d.toString()).slice(-2048); }); proc.stderr.unref();
  return proc;
}

const START = seed => `(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));GV.setMapSize(72);GV.setDiff(1);
  document.getElementById('bNewGame').click();const c=document.getElementById('bStartNew456'),p=document.getElementById('panelNew456');
  for(let i=0;i<100&&!(p&&p.classList.contains('show')&&c&&!c.disabled);i++)await sl(50);await sl(250);c.click();await sl(600);
  GV.setSpeed(0);GV.newWorldSeeded(${seed});await sl(300);return {N:GV.N(),stats:GV.stats()};})()`;
const PLAN = `(()=>{const n=GV.N(),L=24,out={};
const szP=(GV.placePreview459('plant',10,10)||{}).size||1,szW=(GV.placePreview459('water',10,10)||{}).size||1;
const items=[['plant',L,0]];for(let x=0;x<L;x++)items.push(['road',x,0]);
for(const dy of [-2,-1,1,2]){for(let x=1;x<=10;x++)items.push(['zr',x,dy]);for(let x=11;x<=15;x++)items.push(['zc',x,dy]);for(let x=16;x<=22;x++)items.push(['zi',x,dy]);}
const water=['water',-szW,0];
const okAt=(ox,oy)=>{for(const it of items.concat([water])){const p=GV.placePreview459(it[0],ox+it[1],oy+it[2]);if(!p||p.reason)return false;}return true;};
const c=n>>1,cands=[];for(let oy=4;oy<n-4-Math.max(szP,szW);oy++)for(let ox=szW+2;ox<n-L-szP-2;ox++)cands.push([Math.hypot(ox+L/2-c,oy-c),ox,oy]);
cands.sort((a,b)=>a[0]-b[0]||a[2]-b[2]||a[1]-b[1]);
let site=null;for(const q of cands){if(okAt(q[1],q[2])){site=[q[1],q[2]];break;}}
out.site=site;if(!site)return out;const ox=site[0],oy=site[1];let placed=0;
for(const it of items){if(GV.place(it[0],ox+it[1],oy+it[2]))placed++;}
out.placed=placed;out.items=items.length;window.__plan793={x:ox+water[1],y:oy+water[2],done:false};return out;})()`;
const DAY = `(()=>{const P=window.__plan793;if(P&&!P.done){const p=GV.placePreview459('water',P.x,P.y);if(p&&p.ok)P.done=!!GV.place('water',P.x,P.y);}
GV.step(1);const s=GV.stats(),E=GV.t481().economy;return [s.day,s.pop,s.money,s.dem[1],s.dem[2],s.dem[3],s.buildings,E.ready?E.consumption.retailCapacity:null];})()`;
const COUNT = `(()=>{const n=GV.N();let c=0,c2=0,cz=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const t=GV.tile(x,y);if(!t)continue;if(t.zone===2)cz++;const b=t.bld;if(b&&!b.ref&&b.k===2){c++;if(b.lv>=2)c2++;}}return {com:c,comLv2:c2,czone:cz};})()`;

async function run(cdp, label, { old, seed, mature, valve, valveWindow }) {
  let vw = null;
  if (valveWindow) vw = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__noComBoot793=true;' })).identifier;
  const url = `http://127.0.0.1:${PORT}/index.html${old ? '?pre793=1' : ''}`;
  await cdp.send('Page.navigate', { url });
  if (!await H.waitFor(cdp, `!!window.__bootDone453`, 400000)) throw new Error(label + ': boot 沒完成');
  const isOld = await cdp.evalJs(`typeof window.comBootSelftest793!=='function'`);
  if (isOld !== !!old) throw new Error(label + ': 載到的頁面不對（old=' + old + '）');
  await cdp.evalJs(`try{sessionStorage.removeItem('glimmerville.noComBoot793')}catch(e){};true`);
  if (valve) await cdp.evalJs(`sessionStorage.setItem('glimmerville.noComBoot793','1');true`);
  const r = { label, old: !!old, seed: seed || null };
  if (mature) {
    r.loaded = await cdp.evalJs(`(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));localStorage.setItem('glimmerville.v1.s3',${JSON.stringify(MATURE)});const ok=GV.load();GV.setSpeed(0);await sl(300);return {ok,stats:GV.stats()};})()`);
    if (!r.loaded.ok) throw new Error(label + ': 讀不進成熟城');
  } else {
    r.start = await cdp.evalJs(START(seed));
    r.plan = await cdp.evalJs(PLAN);
    if (!r.plan.site) throw new Error(label + ': 找不到放固定規劃的位置');
  }
  r.days = [];
  for (let d = 0; d < DAYS; d++) r.days.push(await cdp.evalJs(DAY));
  r.count = await cdp.evalJs(COUNT);
  r.state = await cdp.evalJs(`window.__comBoot793?{hits:window.__comBoot793.hits,day:window.__comBoot793.day}:null`);   // 先讀，再跑自檢（自檢會經過包裝，但做完會把內容還原）
  if (!old && !valve && !valveWindow) { r.self = await cdp.evalJs(`window.comBootSelftest793()`); r.stateAfterSelf = await cdp.evalJs(`window.__comBoot793?{hits:window.__comBoot793.hits,day:window.__comBoot793.day}:null`); }
  if (vw) { await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: vw }); r.valveWindowOn = await cdp.evalJs(`window.__noComBoot793===true`); }
  try { await cdp.evalJs(`try{sessionStorage.removeItem('glimmerville.noComBoot793');['s3','s3_bak'].forEach(k=>localStorage.removeItem('glimmerville.v1.'+k))}catch(e){};true`); } catch {}
  return r;
}

(async () => {
  H.cleanProfiles();
  const srv = await H.startServer(PORT);
  const devPort = PORT + 1000 + (process.pid % 400), profile = path.join(H.ROOT, '.smoke-profile-' + process.pid + '-793');
  const chrome = GPU ? launchGpu(devPort, profile) : H.launchChrome(devPort, profile);
  let cdp, bad = 0; const errs = [];
  const res = {}, fail = m => { bad++; console.log('FAIL ' + m); }, pass = m => console.log('PASS ' + m);
  try {
    cdp = await H.cdpConnect(await H.pageWsUrl(devPort, chrome), (m) => {   // 給了 onEvent，harness 就不再自己收錯誤，這裡補上
      if (m.method === 'Fetch.requestPaused') {
        cdp.send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'content-type', value: 'text/html; charset=utf-8' }, { name: 'cache-control', value: 'no-store' }], body: OLD_B64 }).catch(e => errs.push('fulfill: ' + e.message));
      } else if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params?.exceptionDetails || {}; errs.push('未捕捉例外: ' + (d.exception?.description || d.text || '(未知)').split('\n')[0]);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params?.type === 'error') {
        errs.push('console.error: ' + (m.params.args || []).map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
      }
    });
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*index.html?pre793=1*', requestStage: 'Request' }] });
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('glimmerville.v1.slot','3')}catch(e){}` });
    for (const seed of [777, 22]) {
      const n = await run(cdp, 'plan-' + seed + ' new', { seed }), o = await run(cdp, 'plan-' + seed + ' old', { old: true, seed });
      res['plan-' + seed] = { new: n, old: o };
      const msg = `plan-${seed}: 商業建築 新 ${n.count.com}（2 級 ${n.count.comLv2}）／舊 ${o.count.com}；商業需求第 ${n.days[n.days.length - 1][0]} 天 新 ${(+n.days[n.days.length - 1][4]).toFixed(3)}／舊 ${(+o.days[o.days.length - 1][4]).toFixed(3)}；T793 命中 ${n.state ? n.state.hits : 0} 天`;
      (n.count.com >= 5 && o.count.com <= 1 ? pass : fail)(msg);
      if (n.self) (n.self.ok ? pass : fail)(`comBootSelftest793（plan-${seed} 新版）：${n.self.checks.join('；')}`);
      if (n.self) (JSON.stringify(n.state) === JSON.stringify(n.stateAfterSelf) ? pass : fail)(`自檢前後執行期狀態相同：${JSON.stringify(n.state)} → ${JSON.stringify(n.stateAfterSelf)}`);
    }
    {
      const n = await run(cdp, 'mature new', { mature: true }), o = await run(cdp, 'mature old', { old: true, mature: true });
      res.mature = { new: n, old: o };
      const same = JSON.stringify(n.days) === JSON.stringify(o.days), zero = n.days.filter(d => d[7] === 0).map(d => d[0]);
      (same ? pass : fail)(`mature：${DAYS} 天每天的人口、金錢、三項需求、建築數 新舊${same ? '逐位相同' : '不同'}；零售容量 0 的日子 ${zero.length ? zero.join(',') : '沒有'}；T793 命中 ${n.state ? n.state.hits : 0} 天`);
    }
    {
      const v = await run(cdp, 'valve-session', { seed: 777, valve: true }), o = res['plan-777'].old;
      res.valve = v;
      const same = JSON.stringify(v.days) === JSON.stringify(o.days) && v.count.com === o.count.com;
      (same ? pass : fail)(`valve-session：設了 glimmerville.noComBoot793='1' 的新版 plan-777，每天數字與舊版${same ? '逐位相同' : '不同'}（商業建築 ${v.count.com}／舊 ${o.count.com}）`);
    }
    {
      const w = await run(cdp, 'valve-window', { seed: 777, valveWindow: true }), o = res['plan-777'].old;
      res.valveWindow = w;
      const same = JSON.stringify(w.days) === JSON.stringify(o.days) && w.count.com === o.count.com && w.valveWindowOn === true;
      (same ? pass : fail)(`valve-window：載入前設 window.__noComBoot793=true 的新版 plan-777，每天數字與舊版${same ? '逐位相同' : '不同'}（商業建築 ${w.count.com}／舊 ${o.count.com}；閥在 ${w.valveWindowOn}）`);
    }
    (errs.length === 0 ? pass : fail)(`console 錯誤 ${errs.length} 則` + (errs.length ? '：' + errs.slice(0, 3).join(' | ') : ''));
  } catch (e) { fail('ERR ' + (e && e.message)); }
  finally {
    try { cdp && cdp.close(); } catch {} try { chrome.kill(); } catch {} await H.sleep(1200); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} try { srv.close(); } catch {}
    if (OUT) try { fs.writeFileSync(OUT, JSON.stringify(res)); } catch (e) { console.log('寫結果失敗 ' + e.message); }
  }
  console.log(bad ? `probeComBoot793: FAIL (${bad})` : 'probeComBoot793: PASS');
  setTimeout(() => process.exit(bad ? 1 : 0), 500);
})();
