#!/usr/bin/env node
'use strict';
// Read-only public verification, intended only for a GitHub Actions runner.
// A fresh private Chrome profile and slot3 cannot access any owner's saves.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const repoRoot=path.resolve(__dirname,'..');
const {withGame,waitFor,sleep}=require(path.join(repoRoot,'harness.js'));
const out=path.join(repoRoot,'scratchpad/GPT-022-public-verification');fs.mkdirSync(out,{recursive:true});
const config=JSON.parse(fs.readFileSync(path.join(repoRoot,'docs/branch/GPT-022-public-verification.json'),'utf8'));
if(!/^[a-f0-9]{40}$/.test(config.expectedMainSHA))throw Error('Exact authorized main SHA required');
const URL022='https://lijiabao1998.github.io/GlimmerTown-lab/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const report={kind:'Actual public Pages HTML and fresh native browser',url:URL022,expectedMainSHA:config.expectedMainSHA,checks:[],photos:[],ok:false};
function check(name,ok,data){report.checks.push({name,ok:!!ok,data});if(!ok)throw Error(name);}
async function click(cdp,selector){const p=await cdp.evalJs(`(()=>{const b=document.querySelector(${JSON.stringify(selector)});if(!b)throw Error('Public control absent');const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);for(const type of['mouseMoved','mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,...p,button:type==='mouseMoved'?'none':'left',clickCount:1});}
async function photo(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}),b=Buffer.from(r.data,'base64');fs.writeFileSync(path.join(out,name),b);report.photos.push({name,bytes:b.length,sha256:hash(b)});}
(async()=>{try{
 const expected=cp.execFileSync('git',['show',config.expectedMainSHA+':index.html'],{cwd:repoRoot,maxBuffer:16*1024*1024});
 const response=await fetch(URL022,{headers:{'Cache-Control':'no-cache'}}),served=Buffer.from(await response.arrayBuffer());
 report.response={status:response.status,bytes:served.length,sha256:hash(served),expectedSHA256:hash(expected)};
 check('public HTML exactly equals authorized main commit',response.ok&&served.equals(expected),report.response);
 check('public release labels',served.includes(Buffer.from("const GAME_VER='14.41';"))&&served.includes(Buffer.from("const GAME_ANCHOR='T739';")));
 const session=await withGame({enterCity:false,timeout:300,preScript:'localStorage.setItem("glimmerville.v1.slot","3");',log:console.log},async({cdp})=>{
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:URL022});
  check('public real menu boot completes',await waitFor(cdp,'window.__bootDone453&&window.GV&&document.querySelector("#bNewGame")',150000));
  const meta=await cdp.evalJs('({version:document.querySelector("#startVersion456").textContent,inspectorPresent:!!window.N021,slot:localStorage.getItem("glimmerville.v1.slot")})');
  check('public product version and private slot, no test inspector',meta.version.includes('v14.41')&&meta.version.includes('T739')&&!meta.inspectorPresent&&meta.slot==='3',meta);await photo(cdp,'public-menu-T739.png');
  await click(cdp,'#bNewGame');
  check('public new-city options open',await waitFor(cdp,'document.querySelector("#startOverlay456")&&getComputedStyle(document.querySelector("#startOverlay456")).display!=="none"',15000));
  // The product's ordinary new-city flow, in this disposable public profile.
  const buttons=await cdp.evalJs('(()=>{const b=[...document.querySelectorAll("#startOverlay456 button, #startOverlay456 .mapBtn456")];return b.map((q,i)=>({i,text:q.textContent.trim()}));})()');
  const choose=async(pattern)=>{const q=buttons.find(b=>pattern.test(b.text));if(!q)throw Error('Public new-city option missing');const p=await cdp.evalJs('(()=>{const b=[...document.querySelectorAll("#startOverlay456 button, #startOverlay456 .mapBtn456")]['+q.i+'];const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()');for(const type of['mouseMoved','mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,...p,button:type==='mouseMoved'?'none':'left',clickCount:1});};
  await choose(/沙盒/);await choose(/^72×72/);await choose(/建立城市/);
  check('public actual city and baking complete',await waitFor(cdp,'window.__bootDone453&&(window.__t519Roof|0)>0&&window.GV&&GV.stats().day>=1',150000));await sleep(3000);
  const facts=await cdp.evalJs('({stats:GV.stats(),selftest:GV.useScales021.selftest(),rows:GV.useScales021.rows().length,slot:localStorage.getItem("glimmerville.v1.slot"),inspectorPresent:!!window.N021})');
  check('public useScales API passes in the real game',facts.rows===36&&facts.selftest.ok===true&&facts.slot==='3'&&!facts.inspectorPresent,facts);await photo(cdp,'public-city-T739.png');
  await click(cdp,'#useScalesOpen021');const catalog=await cdp.evalJs('({open:document.querySelector("#useScalesDialog021").open,forms:document.querySelectorAll("#useScalesDialog021 [data-use021]").length})');
  check('public catalog opens all36 forms',catalog.open&&catalog.forms===36,catalog);await photo(cdp,'public-catalog-T739.png');
  await click(cdp,'#useScalesClose021');return{errors:cdp.errors,benign:cdp.benign};
 });report.session={ok:session.ok,fails:session.fails,seconds:session.seconds,result:session.result};check('public browser has zero console errors',session.ok&&!session.result?.errors?.length,report.session);report.ok=report.checks.every(c=>c.ok);
}catch(e){report.error=e.stack;}finally{fs.writeFileSync(path.join(out,'public-verification022.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.ok)process.exitCode=1;}})();
