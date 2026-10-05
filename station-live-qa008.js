#!/usr/bin/env node
'use strict';
// Public-site verification, only in isolated Actions and a fresh disposable profile.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
const {withGame,waitFor,sleep}=require('./harness');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Native browser runtime is Actions-only');
const ROOT=__dirname,head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact verifier-head requirement');
const SITE='https://lijiabao1998.github.io/GlimmerTown-lab/',RELEASE='559a419270e84d7d67b883581ddef8f24302a41b',HTML='28eea2184153adb55437958a7055047a09abcd129346607852ecd1e86860afe4';
const OUT=path.join(ROOT,'station-live-evidence'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
fs.mkdirSync(OUT,{recursive:true});
const report={verifierHead:head,workflowSHA:process.env.GITHUB_SHA,releaseSHA:RELEASE,site:SITE,expectedHTMLSHA256:HTML,checks:[],failures:[],artifacts:[],limits:['Narrow viewport is Chromium emulation, not real-device/touch/FPS certification.','Fresh-city live interaction is separate from the fully checked loaded-city staffing fixture.','The inherited harness discloses benign missing PWA ancillary files separately.']};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
const check=(name,ok,detail)=>{report.checks.push({name,ok:!!ok,detail});if(!ok)report.failures.push(name);save();};
async function screenshot(cdp,name){const q=await cdp.send('Page.captureScreenshot',{format:'png'}),b=Buffer.from(q.data,'base64');fs.writeFileSync(path.join(OUT,name),b);report.artifacts.push({path:name,bytes:b.length,sha256:hash(b),width:b.readUInt32BE(16),height:b.readUInt32BE(20),releaseSHA:RELEASE,verifierHead:head});save();}
(async()=>{try{
  check('verifier uses exactly the approved released product',hash(fs.readFileSync(path.join(ROOT,'index.html')))===HTML);
  const deadline=Date.now()+10*60000;report.httpAttempts=[];
  while(Date.now()<deadline){const r=await fetch(SITE,{headers:{'cache-control':'no-cache'}}),b=Buffer.from(await r.arrayBuffer()),digest=hash(b);report.httpAttempts.push({at:new Date().toISOString(),status:r.status,bytes:b.length,sha256:digest});save();if(r.ok&&digest===HTML){report.http={url:r.url,status:r.status,bytes:b.length,sha256:digest};break;}await sleep(30000);}
  check('public HTTP bytes equal the exact merged T721 product',report.http?.sha256===HTML,report.http);
  if(report.failures.length)throw Error('Exact live product did not become available');
  const session=await withGame({port:8199,timeout:600,enterCity:false,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
    const ev=async expression=>{const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:SITE});
    const ready=await waitFor(cdp,"!!window.__bootDone453&&!!window.GV&&GV.ver()==='14.25'",180000);
    report.menu=await ev("({url:location.href,title:document.title,version:GV.ver(),label:document.getElementById('startVersion456')?.textContent,boot:!!window.__bootDone453,slot:localStorage.getItem('glimmerville.v1.slot'),errors:window.__t574?.err})");
    check('actual public origin boots T721 with the correct identity and no boot errors',ready&&report.menu.url.startsWith(SITE)&&report.menu.label==='v14.25 · T721'&&report.menu.slot==='3'&&report.menu.title.length>0&&!(report.menu.errors||[]).length,report.menu);
    await screenshot(cdp,'live-menu-desktop.png');
    const opened=await ev("(()=>{const b=[...document.querySelectorAll('#start button')].find(b=>/開拓新城市/.test(b.textContent||''));if(!b)return false;b.click();return true;})()");await sleep(700);
    report.creation=await ev("(()=>{const buttons=[...document.querySelectorAll('#diffSeg456 button')],normal=buttons.find(b=>/普通|正常|標準/.test(b.textContent||''))||buttons[0];if(normal)normal.click();const map=[...document.querySelectorAll('#mapGrid456 button')].find(b=>/^72×72/.test((b.textContent||'').trim()));if(map)map.click();const b=document.getElementById('bStartNew456');if(!b)return null;const q={difficultyButtons:buttons.map(b=>b.textContent),normal:normal?.textContent,map:map?.textContent};b.click();return q;})()");
    const cityReady=await waitFor(cdp,"!!window.__bootDone453&&GV.tile(1,1)!==null&&getComputedStyle(document.getElementById('start')).display==='none'",180000);await sleep(3000);
    report.city=await ev("(()=>{GV.setSpeed(0);GV.ai(false);const c=document.getElementById('game'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let visible=0;for(let i=0;i<d.length;i+=64)if(d[i+3]>0&&(d[i]+d[i+1]+d[i+2])>30)visible++;return{version:GV.ver(),difficulty:GV.diff(),developer:GV.dev516B(),width:c.width,height:c.height,visible,station:GV.stationSelftest008(),day:GV.stats().day};})()");
    check('new city opens through actual UI without a blocking start overlay',opened&&cityReady&&report.creation&&report.city.visible>5000&&!report.city.developer.god&&!report.city.developer.sandbox,report.city);
    check('released station tools and canonical native art selftest pass on the public site',report.city.station.ok,report.city.station);
    report.road=await ev("(()=>{for(let y=4;y<20;y++)for(let x=4;x<20;x++){const t=GV.tile(x,y);if(!t||![1,2].includes(t.t)||t.bld||t.road||t.tree)continue;const p=GV.placePreview459('road',x,y);if(!p.ok)continue;const before=GV.stats().money,ok=GV.placeUndo('road',x,y),charged=before-GV.stats().money,placed=GV.tile(x,y).road,undo=GV.undo(),restored=JSON.stringify(t)===JSON.stringify(GV.tile(x,y));return{x,y,cost:p.cost,charged,ok,placed,undo,restored};}return null;})()");
    check('public city charges actual native road placement and exact undo restores its tile',report.road?.ok&&report.road.placed&&report.road.cost>0&&Math.abs(report.road.charged-report.road.cost)<1e-6&&report.road.undo&&report.road.restored,report.road);
    report.camera=await ev("(()=>{const before=GV.rot();GV.setRot((before+1)&3);GV.forceDraw();return{before,after:GV.rot()};})()");
    check('native camera rotation changes the live scene',report.camera.after===((report.camera.before+1)&3),report.camera);
    await screenshot(cdp,'live-city-desktop.png');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await ev('GV.forceDraw()');await sleep(700);
    report.narrow=await ev("(()=>{const c=document.getElementById('game'),r=c.getBoundingClientRect();return{viewport:[innerWidth,innerHeight],canvas:[c.width,c.height],rect:{x:r.x,y:r.y,w:r.width,h:r.height},version:GV.ver()};})()");
    check('narrow viewport retains a visible rendered live game',report.narrow.version==='14.25'&&report.narrow.rect.w>0&&report.narrow.rect.h>0,report.narrow);await screenshot(cdp,'live-city-narrow.png');
    report.console={errors:cdp.errors,benign:cdp.benign};check('no actual console or uncaught errors during live interactions',cdp.errors.length===0,report.console);return true;
  });
  report.session={ok:session.ok,fails:session.fails,seconds:session.seconds};check('native live browser session completed',session.ok&&session.result,report.session);
  check('verifier leaves product bytes unchanged',hash(fs.readFileSync(path.join(ROOT,'index.html')))===HTML);report.ok=report.failures.length===0;save();console.log(JSON.stringify({ok:report.ok,release:RELEASE,head,checks:report.checks.length,failures:report.failures}));process.exit(report.ok?0:1);
}catch(e){report.error=String(e.stack||e);report.ok=false;save();console.error(report.error);process.exit(1);}})();
