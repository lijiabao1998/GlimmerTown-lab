#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {guardOutput022,baselineHTML022}=require('./use-scales-guard-paths022');
const {makeHarness}=require('./use-scales-test-harness021');
const OUT=guardOutput022();fs.mkdirSync(OUT,{recursive:true});
const ATTEMPT=process.env.USE021_ATTEMPT||'04',REUSE=process.argv.includes('--reuse-background');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const legacy=fs.readFileSync(path.join(__dirname,'publiclife-legacy-fixture007.js'),'utf8');
const H=makeHarness(),report={kind:'Rebuilt candidate native construction/growth; seeded legacy QA background, not organically earned rank',source:H.proof,legacyFixtureSHA256:hash(legacy),checks:[],runs:[],photos:[],ok:false};
const background=REUSE?fs.readFileSync(path.join(OUT,'legal-background021.json'),'utf8'):null;
const preScript="window.__useScaleQA021=true;localStorage.setItem('glimmerville.v1.slot','3');"+(background?'localStorage.setItem("glimmerville.v1.s3",'+JSON.stringify(background)+');':'');
async function click(cdp,selector){const r=await cdp.evalJs(`(()=>{const b=document.querySelector(${JSON.stringify(selector)});if(!b)throw Error('Control absent');const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);for(const type of['mouseMoved','mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:r.x,y:r.y,button:type==='mouseMoved'?'none':'left',clickCount:1});}
async function screenshot(cdp,name){const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const b=Buffer.from(r.data,'base64');fs.writeFileSync(path.join(OUT,name),b);report.photos.push({name,sha256:hash(b),bytes:b.length,kind:'Actual Chromium native game viewport'});}
(async()=>{try{
const s=await H.withGame({fresh:!REUSE,timeout:300,preScript,log:console.log},async({cdp})=>{
 await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
 if(!REUSE){
 const initial=await cdp.evalJs(legacy+`;(()=>{GV.useScales021.close();const q=seedApprovedBritishLegacy007(210021);GV.editorExit();GV.setSpeed(0);GV.ai(false);GV.save();return{fixture:q,state:N021.state(),control:N021.controls(),raw:localStorage.getItem('glimmerville.v1.s3')};})()`);
 fs.writeFileSync(path.join(OUT,'legal-background021.json'),initial.raw);report.initial={...initial,raw:undefined,rawSHA256:hash(initial.raw)};
 await cdp.send('Page.reload',{ignoreCache:true});
 if(!await H.waitFor(cdp,'window.__bootDone453&&document.querySelector("#bContinue")',150000))throw Error('Native continue boot timeout');
 await click(cdp,'#bContinue');
 if(!await H.waitFor(cdp,'window.N021&&N021.state().running&&window.__bootDone453',150000))throw Error('Native running city timeout');
 await H.sleep(1500);
 }else report.initial={reusedNativeRaw:true,rawSHA256:hash(background),path:'legal-background021.json'};
 const started=await cdp.evalJs(`(()=>{GV.setSpeed(0);GV.ai(false);N021.hide();const c=N021.controls(),s=N021.state();return {state:s,control:c,disasters:GV.disasters(),ordinary:s.running&&s.diff===1&&s.disastersOn&&!s.editor&&!c.sandbox&&!c.god&&!Object.values(c.overrides).some(v=>v===true),stats:GV.stats()};})()`);
 report.started=started;if(!started.ordinary)throw Error('Ordinary native city required');
 let setup;try{setup=await cdp.evalJs(`(()=>{
 const G=GV,U=G.useScales021,N=N021,rows=U.rows(),checks=[],paid=[],roots=[],zones=[],first={},snapshots=[];
 window.F021={checks,paid,roots,zones,first,snapshots,rows};
 const add=(name,ok,data)=>{checks.push({name,ok:!!ok,data});if(!ok)throw Error(name);};
 const pay=(id,x,y)=>{const p=G.placePreview459(id,x,y),m=N.state().money;add('native preview '+id+' '+x+','+y,p&&p.ok,p);const ok=G.placeUndo(id,x,y),after=N.state().money;add('native paid '+id+' '+x+','+y,ok&&Math.abs((m-after)-p.cost)<1e-7,{cost:p.cost,charged:m-after});paid.push({id,x,y,cost:p.cost,charged:m-after});return ok;};
 const road=(x,y)=>{if(!N.tile(x,y).road)pay('road',x,y);if(!N.tile(x,y).wp)pay('wpipe',x,y);};
 for(let x=31;x<=39;x++)road(x,26);for(let y=22;y<=31;y++)road(39,y);
 for(let x=5;x<=20;x++)road(x,18);pay('rail',16,13);pay('rail',17,13);
 pay('plant',38,27);pay('water',38,28);pay('police',36,27);
 // Real paid service sites, before new lots. No coverage, hazard or staff overrides.
 for(let y=15;y<=21;y++)road(25,y);for(let y=13;y<=33;y++)road(39,y);
 for(let y=23;y<=33;y++)road(42,y);for(const y of[24,28])for(let x=40;x<=42;x++)road(x,y);
 for(let y=10;y<=13;y++)road(19,y);for(let y=10;y<=14;y++)road(33,y);
 // The north craft courtyard must have actual connected frontage, not only a
 // positive geometric fire-coverage counter. Pay for its ordinary access roads
 // before zoning; keep disasters and all native service rules enabled.
 for(let y=10;y<=13;y++)road(39,y);
 for(let x=39;x<=42;x++)road(x,10);
 for(let y=10;y<=13;y++)road(42,y);
 for(let x=39;x<=42;x++)road(x,13);
 for(const[x,y]of[[26,15],[37,14],[37,30]])pay('prison',x,y);
 for(const[x,y]of[[20,13],[34,13],[38,25],[31,21],[43,29]])pay('fire',x,y);
 G.rebuildCov();G.recomputePower450();
 const svcBefore=N.state();G.setSpeed(1);G.advanceN(.05,180);G.setSpeed(0);
 add('normal native service construction time advances days',N.state().day>svcBefore.day,{before:svcBefore,after:N.state(),civic:G.t495().civic,emergency:G.emergency455()});
 const Z=[['UKO021-S',18,11],['UKO021-M',21,11],['UKO021-L',32,23],['UKC021-S',34,11],['UKC021-M',37,11],['UKC021-L',40,11],['UKI021-S',40,23],['UKI021-M',40,26],['UKI021-L',40,29]];
 for(const[id,x,y]of Z){const q=rows.find(q=>q.id===id);add('select zone '+id,U.select(id));for(let dy=0;dy<q.bh;dy++)for(let dx=0;dx<q.bw;dx++){add('empty before native zone '+id,!N.tile(x+dx,y+dy).bld);if(!N.tile(x+dx,y+dy).wp)pay('wpipe',x+dx,y+dy);pay(q.tool,x+dx,y+dy);}zones.push({id,x,y,w:q.bw,h:q.bh});}
 const site=(q,cow=false)=>{for(let y=2;y<=41-q.bh;y++)for(let x=2;x<=47-q.bw;x++){
  if(cow&&(x*7+y*5)%5!==0)continue;let free=true,roadNear=false;const el=N.tile(x,y).el||0;
  for(let dy=0;dy<q.bh;dy++)for(let dx=0;dx<q.bw;dx++){const t=N.tile(x+dx,y+dy);if(t.t!==2||t.bld||t.zone||t.road||t.rail||t.tram||t.tree||(t.el||0)!==el)free=false;}
  if(!free)continue;for(let dy=-1;dy<=q.bh;dy++)for(let dx=-1;dx<=q.bw;dx++)if(N.tile(x+dx,y+dy)?.road)roadNear=true;
  if(roadNear&&G.canPlaceTool(q.tool,x,y)===null)return[x,y];
 }throw Error('No legal native site '+q.id);};
 const direct=rows.filter(q=>q.mode!=='block'&&q.k!==23).sort((a,b)=>Number(b.id==='UKT021-L')-Number(a.id==='UKT021-L'));
 for(const q of direct){const[x,y]=q.id==='UKT021-L'?[16,14]:site(q);add('select '+q.id,U.select(q.id));pay(q.tool,x,y);const b=N.tile(x,y).bld;add('native root/profile '+q.id,b&&!b.ref&&b.k===q.k&&b.art021===q.id,{...b});roots.push({id:q.id,x,y,w:q.bw,h:q.bh,kind:'paid'});}
 for(const q of rows.filter(q=>q.k===23)){const[x,y]=site(q,true);add('select cow '+q.id,U.select(q.id));pay(q.tool,x,y);let b=N.tile(x,y).bld;add('native cow v0 '+q.id,b.v===0&&b.art021==='ranch',b);for(let lv=1;lv<q.lv;lv++){const cost=N.upCost(23,lv),before=N.state().money;G.upgrade(x,y);b=N.tile(x,y).bld;add('paid cow upgrade '+q.id+' '+lv,b.lv===lv+1&&Math.abs(before-N.state().money-cost)<1e-7,{cost,charged:before-N.state().money,lv:b.lv});}roots.push({id:q.id,x,y,w:2,h:2,kind:'paid-upgrade'});}
 const example=roots.find(r=>r.id==='UKU021-M'),m=N.state().money,before=JSON.stringify(N.tile(example.x,example.y));
 U.select(example.id);const duplicate=G.placeUndo(rows.find(q=>q.id===example.id).tool,example.x,example.y);
 add('duplicate rejected without money or root change',duplicate===false&&N.state().money===m&&JSON.stringify(N.tile(example.x,example.y))===before,{duplicate,money:N.state().money});
 U.open();U.close();add('catalog close cancels no paid placement',N.state().money===m);
 G.selectTool434('road');add('native other tool clears art selection',U.selection()===null);
 G.rebuildCov();G.recomputePower450();G.lookAt(24,23);G.setZoom(.55);G.setVisT(55);N.hide();
 window.F021={checks,paid,roots,zones,first,snapshots,rows,add,
  advanceDay:()=>{const before=N.state();G.setSpeed(1);G.advanceN(.05,18);G.setSpeed(0);return{before,after:N.state(),dispatch:N.dispatch()};},
  scan:()=>{N.frame(.016);const P=N.part(),current=[],detail=[];
   const healthy=(x,y,b)=>b&&!b.fire&&!b.crime&&!b.abandoned&&!N.tile(x,y).ruin;
   for(const r of roots){const b=N.tile(r.x,r.y).bld,s=U.read(r.x,r.y);if(healthy(r.x,r.y,b)&&b.age>=9&&s?.__art021?.id===r.id)current.push(r.id);detail.push({target:r.id,x:r.x,y:r.y,root:b?{...b}:null,actual:s?.__art021||null});}
   for(const z of zones){let allHealthy=true;for(let dy=0;dy<z.h;dy++)for(let dx=0;dx<z.w;dx++)if(!healthy(z.x+dx,z.y+dy,N.tile(z.x+dx,z.y+dy).bld))allHealthy=false;
    for(let dy=0;dy<z.h;dy++)for(let dx=0;dx<z.w;dx++){const x=z.x+dx,y=z.y+dy,b=N.tile(x,y).bld,s=U.read(x,y);if(allHealthy&&b&&b.age>=9&&s?.__art021?.id===z.id){if(!current.includes(z.id))current.push(z.id);if(!first[z.id])first[z.id]={day:N.state().day,x,y,root:{...b},actual:{...s.__art021}};}}}
   return {day:N.state().day,current:[...new Set(current)],missing:rows.map(q=>q.id).filter(id=>!current.includes(id)),state:N.state(),control:N.controls(),dispatch:N.dispatch(),civic:G.t495().civic,detail,zones:zones.map(z=>({...z,members:Array.from({length:z.w*z.h},(_,i)=>{const x=z.x+i%z.w,y=z.y+Math.floor(i/z.w),b=N.tile(x,y).bld;return {x,y,bld:b?{...b}:null,prison:G.cov('prison',x,y),police:G.cov('police',x,y),police2:G.cov('police2',x,y),fire:G.cov('fire',x,y),emergency:G.emergencyAt455(x,y)};})}))};
  }
 };return {checks,paid,roots,zones,control:N.controls(),state:N.state()};
})()`);}catch(e){
  const partial=await cdp.evalJs(`(()=>{GV.setSpeed(0);GV.lookAt(24,23);GV.setZoom(.55);GV.setVisT(55);N021.hide();N021.frame(.016);GV.save();return {checks:F021?.checks||[],paid:F021?.paid||[],roots:F021?.roots||[],zones:F021?.zones||[],raw:localStorage.getItem('glimmerville.v1.s3'),state:N021.state(),control:N021.controls()};})()`);
  report.partial={...partial,raw:undefined,error:e.message};report.checks.push(...partial.checks,{name:'native setup complete',ok:false,error:e.message});fs.writeFileSync(path.join(OUT,'native-partial-attempt-'+ATTEMPT+'.json'),partial.raw);await screenshot(cdp,'native-partial-attempt-'+ATTEMPT+'.png');throw e;
 }
 report.setup=setup;report.checks.push(...setup.checks);
 const warm=await cdp.evalJs('(()=>{const days=[];for(let i=0;i<10;i++)days.push(F021.advanceDay());return{days,scan:F021.scan()};})()');report.warm=warm;
 await screenshot(cdp,'native-midway-attempt-'+ATTEMPT+'.png');
 const trios=setup.roots.filter(r=>r.id.startsWith('UKU021-'));const mx=trios.reduce((s,r)=>s+r.x+r.w/2,0)/3,my=trios.reduce((s,r)=>s+r.y+r.h/2,0)/3;
 await cdp.evalJs('GV.lookAt('+mx+','+my+');GV.setZoom(1.6);GV.setVisT(55);N021.frame(.016);');
 await screenshot(cdp,'retail-midway-attempt-'+ATTEMPT+'.png');
 await cdp.evalJs('GV.lookAt(24,23);GV.setZoom(.55);N021.frame(.016);');
 let latest;
 for(let iteration=0;iteration<360;iteration++){
  latest=await cdp.evalJs(`(()=>{const advanced=F021.advanceDay();return{...F021.scan(),advanced};})()`);report.runs.push(latest);
  if(iteration%20===0)console.log(JSON.stringify({day:latest.day,current:latest.current.length,missing:latest.missing}));
  if(latest.current.length===36)break;
 }
 report.latest=latest;report.checks.push({name:'36 forms coexist in one mature native frame',ok:latest?.current?.length===36,data:latest?.missing});
 if(latest){const low=latest.zones.filter(z=>['UKO021-S','UKO021-M','UKC021-S','UKC021-M','UKC021-L'].includes(z.id));report.checks.push({name:'low native lots retain zero police fields and real prison coverage',ok:low.every(z=>z.members.every(m=>m.police===0&&m.police2===0&&m.prison>0)),data:low});report.checks.push({name:'native hazards remain enabled and ordinary overrides off',ok:latest.state.disastersOn&&latest.state.diff===1&&latest.state.speed===0&&!latest.state.editor&&!latest.control.sandbox&&!latest.control.god&&!Object.values(latest.control.overrides).some(v=>v===true),data:{state:latest.state,control:latest.control}});}
 const saved=await cdp.evalJs(`(()=>{GV.save();return{raw:localStorage.getItem('glimmerville.v1.s3'),first:F021.first,stats:GV.stats(),state:N021.state(),control:N021.controls()};})()`);
 fs.writeFileSync(path.join(OUT,'native-city-attempt-'+ATTEMPT+'.json'),saved.raw);if(latest?.current.length===36)fs.writeFileSync(path.join(OUT,'native-city-mature36-021.json'),saved.raw);report.saved={...saved,raw:undefined,rawSHA256:hash(saved.raw)};
 await screenshot(cdp,'native-city-attempt-'+ATTEMPT+'-1440.png');
 for(const rot of[0,1,2,3]){await cdp.evalJs(`GV.setRot(${rot});GV.lookAt(24,23);GV.setZoom(.55);GV.setVisT(55);N021.frame(.016);`);await screenshot(cdp,'native-city-attempt-'+ATTEMPT+'-rot'+rot+'.png');}
 return {errors:cdp.errors.slice(),benign:cdp.benign.slice()};
});
 report.session={ok:s.ok,fails:s.fails,seconds:s.seconds,result:s.result};
 report.ok=s.ok&&!s.result?.errors?.length&&report.checks.length>0&&report.checks.every(q=>q.ok);
}catch(e){report.error=e.stack;report.ok=false;}finally{await H.cleanup();fs.writeFileSync(path.join(OUT,'native-flow-attempt-'+ATTEMPT+'.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,latest:report.latest?.current?.length,missing:report.latest?.missing,error:report.error,session:report.session}));if(!report.ok)process.exitCode=1;}})();
