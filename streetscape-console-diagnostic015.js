#!/usr/bin/env node
'use strict';
// CI-only read-only source attribution on the unchanged official deployment.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Only isolated GitHub Actions may execute Chrome/game');
const {launchChrome,pageWsUrl,cdpConnect,waitFor,sleep}=require('./harness');
const {createConsoleSourceObserver015,enableConsoleSourceDomains015}=require('./console-source-observer015');
const BASE='6d137b6be31a7f07867b8ebb181fb8ed3727b049',OFFICIAL='https://lijiabao1998.github.io/GlimmerTown-lab/',HASH='3a2b5c8f4c1a9fa59a080d9ae7e9ea4dca36a35dc00cd17b9723141f6dedaa0f';
const hash=q=>crypto.createHash('sha256').update(q).digest('hex'),OUT=path.join(__dirname,'streetscape-evidence/console');fs.mkdirSync(OUT,{recursive:true});
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact observer head required');
const observer=createConsoleSourceObserver015(),report={observerHead:head,expectedDeploySHA:BASE,expectedHTMLSHA256:HASH,officialURL:OFFICIAL,run:process.env.GITHUB_RUN_ID,started:new Date().toISOString(),documents:[],resourceProbes:[],checks:[],limits:['Diagnostic only; no original error or warning is suppressed.','No PWA/SW references or files are modified by this observer.','Unattributed URL-less entries remain unclassified; time correlation is not request attribution.']};
const save=()=>{fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));fs.writeFileSync(path.join(OUT,'source-events.json'),JSON.stringify(observer.snapshot(),null,2));};
function check(name,ok,details){report.checks.push({name,ok:!!ok,details});save();if(!ok)throw Error(name);}
let chrome,cdp,profile;
(async()=>{try{
 const source=await fetch(OFFICIAL+'?streetscape015='+head,{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(60000)}),body=Buffer.from(await source.arrayBuffer());
 check('official main source is exact unchanged T727',source.status===200&&hash(body)===HASH,{status:source.status,sha256:hash(body),bytes:body.length});
 for(const file of ['manifest.json','icon.svg','sw.js']){const url=new URL(file,OFFICIAL).href,response=await fetch(url,{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(60000)}),bytes=Buffer.from(await response.arrayBuffer());report.resourceProbes.push({url,status:response.status,mime:response.headers.get('content-type'),bytes:bytes.length,sha256:hash(bytes),method:'independent read-only GET, not a browser log attribution'});}
 profile=fs.mkdtempSync(path.join(os.tmpdir(),'streetscape-console015-'));const port=9300+process.pid%400;chrome=launchChrome(port,profile);
 cdp=await cdpConnect(await pageWsUrl(port,chrome),m=>observer.observe(m));
 for(const method of ['Runtime.enable','Log.enable','Page.enable']){await cdp.send(method);observer.capability(method,true);}
 await cdp.send('Network.enable',{maxTotalBufferSize:64*1024*1024,maxResourceBufferSize:32*1024*1024});observer.capability('Network.enable',true);
 await enableConsoleSourceDomains015(cdp,observer);
 await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1080,deviceScaleFactor:1,mobile:false});
 await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:"if(location.origin==='https://lijiabao1998.github.io'&&location.pathname==='/GlimmerTown-lab/'){localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');}"});
 for(let pass=0;pass<2;pass++){
  observer.mark('official-menu-load-'+pass);const navigation=await cdp.send('Page.navigate',{url:OFFICIAL+'?streetscape015='+head+'&pass='+pass});check('navigation '+pass+' no TLS bypass',!navigation.errorText,navigation);
  check('native menu boot '+pass,await waitFor(cdp,"!!window.__bootDone453&&!!window.GV&&document.getElementById('startVersion456')?.textContent.trim()==='v14.31 · T727'",240000),{});
  await sleep(3000);
  const q=observer.snapshot(),docs=q.events.filter(e=>e.method==='Network.responseReceived'&&e.phase==='official-menu-load-'+pass&&e.params.type==='Document'&&e.params.response.url.startsWith(OFFICIAL)),doc=docs[docs.length-1];
  if(!doc)throw Error('No document Network response');const res=await cdp.send('Network.getResponseBody',{requestId:doc.params.requestId}),bytes=Buffer.from(res.body,res.base64Encoded?'base64':'utf8');
  report.documents.push({pass,url:doc.params.response.url,requestId:doc.params.requestId,status:doc.params.response.status,sha256:hash(bytes),bytes:bytes.length});check('actual Chrome document '+pass+' matches unchanged source',hash(bytes)===HASH,report.documents.at(-1));
  const state=await cdp.evalJs("({version:GV.ver(),slot:localStorage.getItem('glimmerville.v1.slot'),otherSlots:Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s[12](?:$|[._])/.test(k))})");check('isolated native menu '+pass,state.version==='14.31'&&state.slot==='3'&&state.otherSlots.length===0,state);
  const shot=await cdp.send('Page.captureScreenshot',{format:'png'}),image=Buffer.from(shot.data,'base64');fs.writeFileSync(path.join(OUT,'official-menu-'+pass+'.png'),image);report.documents.at(-1).screenshot={file:'official-menu-'+pass+'.png',sha256:hash(image),width:image.readUInt32BE(16),height:image.readUInt32BE(20)};save();
 }
 report.analysis=observer.snapshot().analysis;report.rawStrictConsoleClean=report.analysis.counts.browserErrors===0&&report.analysis.counts.warnings===0&&observer.snapshot().events.every(e=>e.method!=='Runtime.exceptionThrown');
 report.diagnosticComplete=observer.snapshot().captureFailures.length===0&&report.documents.length===2;report.completed=new Date().toISOString();save();console.log(JSON.stringify({diagnosticComplete:report.diagnosticComplete,rawStrictConsoleClean:report.rawStrictConsoleClean,counts:report.analysis.counts,resourceProbes:report.resourceProbes},null,2));
 if(!report.diagnosticComplete)process.exitCode=1;
 }catch(e){report.error=e.stack||String(e);save();console.error(e);process.exitCode=1;}finally{try{cdp?.close();}catch{}try{chrome?.kill();}catch{}if(profile)setTimeout(()=>fs.rmSync(profile,{recursive:true,force:true}),1500);}})();
