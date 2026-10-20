'use strict';
// Read the real public Pages origin on GitHub Actions. Never serve local HTML here.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {findChrome,pageWsUrl,cdpConnect,waitFor,sleep}=require('./harness.js');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Run the public-site browser verification only on GitHub Actions');
const URL='https://lijiabao1998.github.io/GlimmerTown-lab/';
// Read the current main as the independent published-source expectation. This
// also lets this one HTTP/browser job verify a new deployment after a merge,
// without re-running smoke/fp or restoring the deleted branch workflow.
cp.execFileSync('git',['fetch','--no-tags','origin','main:refs/remotes/origin/main'],{cwd:__dirname,timeout:60000,stdio:'pipe'});
const BASE=cp.execFileSync('git',['rev-parse','refs/remotes/origin/main'],{cwd:__dirname,encoding:'utf8'}).trim();
assert.match(BASE,/^[0-9a-f]{40}$/,'public037 independent main SHA');
const OUT=path.join(__dirname,'shots','wave037','public-site'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=cp.execFileSync('git',['show',BASE+':index.html'],{cwd:__dirname,maxBuffer:32*1024*1024});
const baselineText=baseline.toString('utf8'),version=/const GAME_VER='([^']+)'/.exec(baselineText)[1],anchor=/const GAME_ANCHOR='([^']+)'/.exec(baselineText)[1];
const expected={sha256:hash(baseline),version,anchor,wave09:baselineText.includes('installBritishWave037();')};
const report={ok:false,head:process.env.GITHUB_SHA,base:BASE,startedAt:new Date().toISOString(),url:URL,expected,files:[],negativeControls:[],runtimeErrors:[],networkFailures:[],notClaimed:['physical mobile, Safari or touch validation','all art states manually inspected']};
fs.mkdirSync(OUT,{recursive:true});
function verifyResponse(r,e=expected){
  assert.equal(r.status,200,'public037 HTTP 200');
  assert.equal(r.url,URL,'public037 exact public URL');
  assert.equal(hash(r.body),e.sha256,'public037 index byte SHA256');
  const text=r.body.toString('utf8');
  assert.equal(/const GAME_VER='([^']+)'/.exec(text)?.[1],e.version,'public037 source version');
  assert.equal(/const GAME_ANCHOR='([^']+)'/.exec(text)?.[1],e.anchor,'public037 source anchor');
}
function write(name,b){fs.writeFileSync(path.join(OUT,name),b);report.files.push({name,bytes:b.length,sha256:hash(b)});}
function transfer(name,b){console.log('WAVE037_PUBLIC_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE037_PUBLIC_FILE_DATA '+s.slice(i,i+4096));console.log('WAVE037_PUBLIC_FILE_END '+name);}
function verifySandboxArguments(args){
  assert(!args.some(a=>/^--(?:no-sandbox|disable-(?:setuid|namespace|seccomp-filter|gpu)-sandbox|single-process|no-zygote)(?:=|$)/.test(a)),'public037 sandbox-disabling launch argument');
}
function launchSandboxedChrome(devPort,profile){
  const args=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--hide-scrollbars','--mute-audio','--window-size=1280,800',`--user-data-dir=${profile}`,`--remote-debugging-port=${devPort}`,'about:blank'];
  verifySandboxArguments(args);
  const proc=cp.spawn(findChrome(),args,{stdio:['ignore','ignore','pipe']});
  report.browserLaunch={executable:proc.spawnfile,args:proc.spawnargs.slice(1),pid:proc.pid};
  verifySandboxArguments(report.browserLaunch.args);
  // Keep the original launch error for pageWsUrl; never retry without sandboxing.
  proc.__tail='';proc.stderr.on('data',d=>{proc.__tail=(proc.__tail+d.toString()).slice(-2048);});proc.stderr.unref();
  proc.on('error',e=>{proc.__spawnErr=e.message;proc.__tail+='\n'+e.message;});
  return proc;
}
function verifySandboxStatus(status){
  assert.equal(status.url,'chrome://sandbox/','public037 sandbox status origin');
  for(const label of ['PID namespaces','Network namespaces','Seccomp-BPF sandbox'])assert.equal(status.rows.find(r=>r[0]===label)?.[1],'Yes','public037 active '+label);
}
(async()=>{
  let chrome,cdp,profile;
  try{
    const response=await fetch(URL,{redirect:'follow',signal:AbortSignal.timeout(45000),headers:{'User-Agent':'GlimmerTown-Lab-readonly-public-verification'}});
    const body=Buffer.from(await response.arrayBuffer()),actual={status:response.status,url:response.url,body};
    report.http={status:response.status,url:response.url,bytes:body.length,sha256:hash(body),headers:Object.fromEntries(['content-type','etag','last-modified','cache-control','age'].map(k=>[k,response.headers.get(k)])),checkedAt:new Date().toISOString()};
    verifyResponse(actual);
    const damaged=Buffer.from(body);damaged[damaged.length-1]^=1;
    const cases=[['status',{...actual,status:404},expected,'public037 HTTP 200'],['URL',{...actual,url:'https://example.invalid/'},expected,'public037 exact public URL'],['one real byte',{...actual,body:damaged},expected,'public037 index byte SHA256'],['version expectation',actual,{...expected,version:'invalid-control'},'public037 source version'],['anchor expectation',actual,{...expected,anchor:'invalid-control'},'public037 source anchor']];
    for(const[name,input,exp,target]of cases){let error;try{verifyResponse(input,exp);}catch(e){error=e;}assert(error&&error.message.includes(target),'public037 negative missed target '+name);report.negativeControls.push({name,target,firstRed:error.message});verifyResponse(actual);}
    profile=fs.mkdtempSync(path.join(os.tmpdir(),'wave037-public-browser-'));
    const devPort=9222;chrome=launchSandboxedChrome(devPort,profile);const ws=await pageWsUrl(devPort,chrome);
    // Prove real Chromium sandbox state before allowing any network-origin script.
    cdp=await cdpConnect(ws);await cdp.send('Page.enable');
    const sandboxNavigation=await cdp.send('Page.navigate',{url:'chrome://sandbox/'});assert(!sandboxNavigation.errorText,'public037 sandbox status navigation');
    assert(await waitFor(cdp,"location.href==='chrome://sandbox/' && document.querySelectorAll('tr').length>2",30000),'public037 sandbox status ready');
    report.sandbox=await cdp.evalJs("({url:location.href,rows:[...document.querySelectorAll('tr')].map(r=>[...r.querySelectorAll('td')].map(c=>c.textContent.trim())),text:document.body.innerText,checkedAt:new Date().toISOString()})");
    verifySandboxStatus(report.sandbox);
    const safeArgs=report.browserLaunch.args;
    let sandboxRed;try{verifySandboxArguments([...safeArgs,'--no-sandbox']);}catch(e){sandboxRed=e;}
    assert(sandboxRed?.message.includes('public037 sandbox-disabling launch argument'),'public037 sandbox launch negative missed target');
    report.negativeControls.push({name:'sandbox disabled argument rejected before spawn',target:'public037 sandbox-disabling launch argument',firstRed:sandboxRed.message});verifySandboxArguments(safeArgs);
    const disabled={...report.sandbox,rows:report.sandbox.rows.map(r=>r[0]==='Seccomp-BPF sandbox'?[r[0],'No']:r)};
    let statusRed;try{verifySandboxStatus(disabled);}catch(e){statusRed=e;}
    assert(statusRed?.message.includes('public037 active Seccomp-BPF sandbox'),'public037 sandbox status negative missed target');
    report.negativeControls.push({name:'inactive sandbox status',target:'public037 active Seccomp-BPF sandbox',firstRed:statusRed.message});verifySandboxStatus(report.sandbox);
    console.log('PUBLIC037_SANDBOX '+JSON.stringify({launch:report.browserLaunch,status:report.sandbox}));
    cdp.close();cdp=null;
    const documents=[];
    cdp=await cdpConnect(ws,m=>{
      if(m.method==='Network.responseReceived'&&m.params.type==='Document')documents.push({requestId:m.params.requestId,url:m.params.response.url,status:m.params.response.status,mimeType:m.params.response.mimeType});
      if(m.method==='Network.loadingFailed')report.networkFailures.push({requestId:m.params.requestId,type:m.params.type,error:m.params.errorText,canceled:!!m.params.canceled});
      if(m.method==='Runtime.exceptionThrown'){const d=m.params.exceptionDetails;report.runtimeErrors.push({kind:'exception',description:d.exception?.description||d.text});}
      if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')report.runtimeErrors.push({kind:'console.error',description:m.params.args.map(a=>a.value??a.description??'').join(' ')});
      if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')report.runtimeErrors.push({kind:'log',description:m.params.entry.text,url:m.params.entry.url});
    });
    for(const method of ['Runtime.enable','Log.enable','Page.enable'])await cdp.send(method);
    await cdp.send('Network.enable',{maxTotalBufferSize:64*1024*1024,maxResourceBufferSize:32*1024*1024});
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:"try{localStorage.setItem('glimmerville.v1.slot','3')}catch(e){}"});
    const navigation=await cdp.send('Page.navigate',{url:URL});report.navigation=navigation;
    assert(!navigation.errorText,'public037 navigation '+navigation.errorText);
    const menuReady=await waitFor(cdp,"!!window.__bootDone453 && document.getElementById('start') && getComputedStyle(document.getElementById('start')).display!=='none'",180000);
    assert(menuReady,'public037 real public menu boot');
    const document=documents.find(d=>d.url===URL);assert(document,'public037 browser main document');
    const received=await cdp.send('Network.getResponseBody',{requestId:document.requestId});
    const browserBody=Buffer.from(received.body,received.base64Encoded?'base64':'utf8');verifyResponse({...document,body:browserBody});
    report.browserDocument={...document,bytes:browserBody.length,sha256:hash(browserBody)};
    report.menu=await cdp.evalJs("({url:location.href,version:GV.ver(),anchor:document.getElementById('startVersion456')?.textContent.match(/T[0-9]+/)?.[0],footer:document.getElementById('startVersion456')?.textContent,slot:localStorage.getItem('glimmerville.v1.slot'),bootDone:!!window.__bootDone453})");
    assert.equal(report.menu.version,version);assert.equal(report.menu.anchor,anchor);assert.equal(report.menu.slot,'3');
    const menu=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-menu.png',Buffer.from(menu.data,'base64'));
    const seq=await cdp.evalJs('window.__bootSeq453|0');
    const clicked=await cdp.evalJs("(()=>{const b=[...document.querySelectorAll('#start button')].find(x=>/開拓新城市/.test(x.textContent||''));if(b)b.click();return !!b})()");assert(clicked,'public037 native new-city button');
    await sleep(1500);
    report.cityCreation=await cdp.evalJs("(()=>{const ov=document.getElementById('startOverlay456');if(!ov||getComputedStyle(ov).display==='none')return 'no-overlay';const T=t=>[...document.querySelectorAll('#startOverlay456 button,#startOverlay456 .mapBtn456')].find(b=>new RegExp(t).test((b.textContent||'').trim()));const d=T('沙盒');if(d)d.click();const m=T('^72×72');if(m)m.click();const g=T('建立城市');if(g)g.click();return g?'native UI city created':'native create button missing'})()");
    // Native begin(true) initializes tiles and hides the menu; it reuses the
    // completed bootstrap, rather than incrementing __bootSeq453 again.
    const baked=await waitFor(cdp,"!!window.__bootDone453 && (window.__bootSeq453|0)==="+seq+" && (window.__t519Roof|0)>0 && getComputedStyle(document.getElementById('start')).display==='none' && !!GV.tile(0,0)",180000);assert(baked,'public037 public native city and sprites baked');await sleep(3000);
    report.city=await cdp.evalJs("(()=>{const c=document.getElementById('game'),g=c.getContext('2d'),a=g.getImageData(0,0,c.width,c.height).data;let opaque=0;const colors=new Set();for(let i=0;i<a.length;i+=4){if(a[i+3])opaque++;if(i%64===0)colors.add(a[i]+','+a[i+1]+','+a[i+2]+','+a[i+3]);}return {url:location.href,version:GV.ver(),anchor:document.getElementById('startVersion456')?.textContent.match(/T[0-9]+/)?.[0],slot:localStorage.getItem('glimmerville.v1.slot'),width:c.width,height:c.height,opaque,colors:colors.size,wave03Rows:GV.britishWave029.rows().map(q=>({id:q.id,v:q.v})),wave03SpriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_2[4-7][0-9]$/.test(k)).length,bootDone:!!window.__bootDone453}})()");
    assert.equal(report.city.version,version);assert.equal(report.city.anchor,anchor);assert.equal(report.city.slot,'3');assert.equal(report.city.wave03Rows.length,10);assert.equal(report.city.wave03SpriteCount,40);assert(report.city.opaque>10000&&report.city.colors>100,'public037 live public canvas nonempty');
    report.priorWave04=await cdp.evalJs("({rows:GV.britishWave030.rows().length,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_(?:2[89]|3[01])[0-9]$/.test(k)).length})");assert.equal(report.priorWave04.rows,10);assert.equal(report.priorWave04.spriteCount,40);
    report.priorWave05=await cdp.evalJs("({rows:GV.britishWave031.rows().length,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_3[2-5][0-9]$/.test(k)).length})");assert.equal(report.priorWave05.rows,10);assert.equal(report.priorWave05.spriteCount,40);
    report.priorWave06=await cdp.evalJs("({rows:GV.britishWave033.rows().length,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_3[6-9][0-9]$/.test(k)).length})");assert.equal(report.priorWave06.rows,10);assert.equal(report.priorWave06.spriteCount,40);
    report.priorWave07=await cdp.evalJs("({rows:GV.britishWave035.rows().length,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_4[0-3][0-9]$/.test(k)).length})");assert.equal(report.priorWave07.rows,10);assert.equal(report.priorWave07.spriteCount,40);
    report.priorWave08=await cdp.evalJs("({rows:GV.britishWave036.rows().length,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_4[4-7][0-9]$/.test(k)).length})");assert.equal(report.priorWave08.rows,10);assert.equal(report.priorWave08.spriteCount,40);
    report.wave09=await cdp.evalJs("({rows:GV.britishWave037?GV.britishWave037.rows().map(q=>({id:q.id,v:q.v})):null,spriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_(?:4[89]|5[01])[0-9]$/.test(k)).length})");
    if(expected.wave09){assert.equal(report.wave09.rows?.length,10,'public037 live ninth-wave catalog');assert.equal(report.wave09.spriteCount,40,'public037 live ninth-wave forty leaves');}else{assert.equal(report.wave09.rows,null,'public037 ninth-wave not yet on main');assert.equal(report.wave09.spriteCount,0,'public037 no unpublished ninth-wave leaves');}
    const cityShot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-city-page.png',Buffer.from(cityShot.data,'base64'));
    const canvas=await cdp.evalJs("document.getElementById('game').toDataURL('image/png')");write('public-city-canvas.png',Buffer.from(canvas.split(',')[1],'base64'));
    const catalogId=expected.wave09?'037':'036';
    const opened=await cdp.evalJs("(()=>{const b=document.getElementById('waveOpen"+catalogId+"');if(b)b.click();return !!document.getElementById('waveDialog"+catalogId+"')?.open})()");assert(opened,'public037 live published catalog button');
    const catalog=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-wave'+(expected.wave09?'09':'08')+'-catalog.png',Buffer.from(catalog.data,'base64'));
    report.liveCanvasCaptured=true;report.localServerUsed=false;assert.equal(report.runtimeErrors.length,0,'public037 actual browser errors: '+JSON.stringify(report.runtimeErrors));report.ok=true;
  }catch(error){report.error={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
  finally{
    try{cdp?.close();}catch{}try{chrome?.kill();}catch{}
    if(profile)setTimeout(()=>{try{fs.rmSync(profile,{recursive:true,force:true});}catch{}},1500);
    report.finishedAt=new Date().toISOString();const manifest=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'public-site-verification.json'),manifest);
    // Raw full-resolution canvas remains in the original artifact. Keep the
    // console transfer below the transport size that lost one base64 chunk.
    for(const f of report.files)if(f.name!=='public-city-canvas.png')transfer(f.name,fs.readFileSync(path.join(OUT,f.name)));transfer('public-site-verification.json',manifest);
    console.log('PUBLIC037_RESULT '+JSON.stringify({ok:report.ok,http:report.http,browserDocument:report.browserDocument,city:report.city,negativeControls:report.negativeControls.length,runtimeErrors:report.runtimeErrors,error:report.error?.message}));
  }
})();
