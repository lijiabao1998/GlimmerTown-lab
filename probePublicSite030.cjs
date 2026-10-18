'use strict';
// Read the real public Pages origin on GitHub Actions. Never serve local HTML here.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {launchChrome,pageWsUrl,cdpConnect,waitFor,sleep}=require('./harness.js');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Run the public-site browser verification only on GitHub Actions');
const URL='https://lijiabao1998.github.io/GlimmerTown-lab/',BASE='9335b08f47ab184ebb5fa7f46b776c1049cd5cc9';
const OUT=path.join(__dirname,'shots','wave030','public-site'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=cp.execFileSync('git',['show',BASE+':index.html'],{cwd:__dirname,maxBuffer:32*1024*1024});
const baselineText=baseline.toString('utf8'),version=/const GAME_VER='([^']+)'/.exec(baselineText)[1],anchor=/const GAME_ANCHOR='([^']+)'/.exec(baselineText)[1];
const expected={sha256:hash(baseline),version,anchor};
const report={ok:false,head:process.env.GITHUB_SHA,base:BASE,startedAt:new Date().toISOString(),url:URL,expected,files:[],negativeControls:[],runtimeErrors:[],networkFailures:[],notClaimed:['physical mobile, Safari or touch validation','fourth-wave art implementation']};
fs.mkdirSync(OUT,{recursive:true});
function verifyResponse(r,e=expected){
  assert.equal(r.status,200,'public030 HTTP 200');
  assert.equal(r.url,URL,'public030 exact public URL');
  assert.equal(hash(r.body),e.sha256,'public030 index byte SHA256');
  const text=r.body.toString('utf8');
  assert.equal(/const GAME_VER='([^']+)'/.exec(text)?.[1],e.version,'public030 source version');
  assert.equal(/const GAME_ANCHOR='([^']+)'/.exec(text)?.[1],e.anchor,'public030 source anchor');
}
function write(name,b){fs.writeFileSync(path.join(OUT,name),b);report.files.push({name,bytes:b.length,sha256:hash(b)});}
function transfer(name,b){console.log('WAVE030_PUBLIC_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE030_PUBLIC_FILE_DATA '+s.slice(i,i+4096));console.log('WAVE030_PUBLIC_FILE_END '+name);}
(async()=>{
  let chrome,cdp,profile;
  try{
    const response=await fetch(URL,{redirect:'follow',signal:AbortSignal.timeout(45000),headers:{'User-Agent':'GlimmerTown-Lab-readonly-public-verification'}});
    const body=Buffer.from(await response.arrayBuffer()),actual={status:response.status,url:response.url,body};
    report.http={status:response.status,url:response.url,bytes:body.length,sha256:hash(body),headers:Object.fromEntries(['content-type','etag','last-modified','cache-control','age'].map(k=>[k,response.headers.get(k)])),checkedAt:new Date().toISOString()};
    verifyResponse(actual);
    const damaged=Buffer.from(body);damaged[damaged.length-1]^=1;
    const cases=[['status',{...actual,status:404},expected,'public030 HTTP 200'],['URL',{...actual,url:'https://example.invalid/'},expected,'public030 exact public URL'],['one real byte',{...actual,body:damaged},expected,'public030 index byte SHA256'],['version expectation',actual,{...expected,version:'invalid-control'},'public030 source version'],['anchor expectation',actual,{...expected,anchor:'invalid-control'},'public030 source anchor']];
    for(const[name,input,exp,target]of cases){let error;try{verifyResponse(input,exp);}catch(e){error=e;}assert(error&&error.message.includes(target),'public030 negative missed target '+name);report.negativeControls.push({name,target,firstRed:error.message});verifyResponse(actual);}
    profile=fs.mkdtempSync(path.join(os.tmpdir(),'wave030-public-browser-'));
    const devPort=9222;chrome=launchChrome(devPort,profile);const ws=await pageWsUrl(devPort,chrome);
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
    assert(!navigation.errorText,'public030 navigation '+navigation.errorText);
    const menuReady=await waitFor(cdp,"!!window.__bootDone453 && document.getElementById('start') && getComputedStyle(document.getElementById('start')).display!=='none'",180000);
    assert(menuReady,'public030 real public menu boot');
    const document=documents.find(d=>d.url===URL);assert(document,'public030 browser main document');
    const received=await cdp.send('Network.getResponseBody',{requestId:document.requestId});
    const browserBody=Buffer.from(received.body,received.base64Encoded?'base64':'utf8');verifyResponse({...document,body:browserBody});
    report.browserDocument={...document,bytes:browserBody.length,sha256:hash(browserBody)};
    report.menu=await cdp.evalJs("({url:location.href,version:GV.ver(),anchor:document.getElementById('startVersion456')?.textContent.match(/T[0-9]+/)?.[0],footer:document.getElementById('startVersion456')?.textContent,slot:localStorage.getItem('glimmerville.v1.slot'),bootDone:!!window.__bootDone453})");
    assert.equal(report.menu.version,version);assert.equal(report.menu.anchor,anchor);assert.equal(report.menu.slot,'3');
    const menu=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-menu.png',Buffer.from(menu.data,'base64'));
    const seq=await cdp.evalJs('window.__bootSeq453|0');
    const clicked=await cdp.evalJs("(()=>{const b=[...document.querySelectorAll('#start button')].find(x=>/開拓新城市/.test(x.textContent||''));if(b)b.click();return !!b})()");assert(clicked,'public030 native new-city button');
    await sleep(1500);
    report.cityCreation=await cdp.evalJs("(()=>{const ov=document.getElementById('startOverlay456');if(!ov||getComputedStyle(ov).display==='none')return 'no-overlay';const T=t=>[...document.querySelectorAll('#startOverlay456 button,#startOverlay456 .mapBtn456')].find(b=>new RegExp(t).test((b.textContent||'').trim()));const d=T('沙盒');if(d)d.click();const m=T('^72×72');if(m)m.click();const g=T('建立城市');if(g)g.click();return g?'native UI city created':'native create button missing'})()");
    const baked=await waitFor(cdp,'!!window.__bootDone453 && (window.__bootSeq453|0)>'+seq+' && (window.__t519Roof|0)>0',180000);assert(baked,'public030 public native city and sprites baked');await sleep(3000);
    report.city=await cdp.evalJs("(()=>{const c=document.getElementById('game'),g=c.getContext('2d'),a=g.getImageData(0,0,c.width,c.height).data;let opaque=0;const colors=new Set();for(let i=0;i<a.length;i+=4){if(a[i+3])opaque++;if(i%64===0)colors.add(a[i]+','+a[i+1]+','+a[i+2]+','+a[i+3]);}return {url:location.href,version:GV.ver(),anchor:document.getElementById('startVersion456')?.textContent.match(/T[0-9]+/)?.[0],slot:localStorage.getItem('glimmerville.v1.slot'),width:c.width,height:c.height,opaque,colors:colors.size,wave03Rows:GV.britishWave029.rows().map(q=>({id:q.id,v:q.v})),wave03SpriteCount:Object.keys(GV.art574.SPR().bld).filter(k=>/^24_1_2[4-7][0-9]$/.test(k)).length,bootDone:!!window.__bootDone453}})()");
    assert.equal(report.city.version,version);assert.equal(report.city.anchor,anchor);assert.equal(report.city.slot,'3');assert.equal(report.city.wave03Rows.length,10);assert.equal(report.city.wave03SpriteCount,40);assert(report.city.opaque>10000&&report.city.colors>100,'public030 live public canvas nonempty');
    const cityShot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-city-page.png',Buffer.from(cityShot.data,'base64'));
    const canvas=await cdp.evalJs("document.getElementById('game').toDataURL('image/png')");write('public-city-canvas.png',Buffer.from(canvas.split(',')[1],'base64'));
    const opened=await cdp.evalJs("(()=>{const b=document.getElementById('waveOpen029');if(b)b.click();return !!document.getElementById('waveDialog029')?.open})()");assert(opened,'public030 live wave03 catalog button');
    const catalog=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});write('public-wave03-catalog.png',Buffer.from(catalog.data,'base64'));
    report.liveCanvasCaptured=true;report.localServerUsed=false;assert.equal(report.runtimeErrors.length,0,'public030 actual browser errors: '+JSON.stringify(report.runtimeErrors));report.ok=true;
  }catch(error){report.error={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
  finally{
    try{cdp?.close();}catch{}try{chrome?.kill();}catch{}
    if(profile)setTimeout(()=>{try{fs.rmSync(profile,{recursive:true,force:true});}catch{}},1500);
    report.finishedAt=new Date().toISOString();const manifest=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'public-site-verification.json'),manifest);
    for(const f of report.files)transfer(f.name,fs.readFileSync(path.join(OUT,f.name)));transfer('public-site-verification.json',manifest);
    console.log('PUBLIC030_RESULT '+JSON.stringify({ok:report.ok,http:report.http,browserDocument:report.browserDocument,city:report.city,negativeControls:report.negativeControls.length,runtimeErrors:report.runtimeErrors,error:report.error?.message}));
  }
})();
