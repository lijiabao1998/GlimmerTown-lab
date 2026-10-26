#!/usr/bin/env node
/* GPT-050: additive CI-only contracts and disposable native-game QA. */

'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto'),cp=require('child_process');
const ROOT=__dirname,Q=path.join(ROOT,'docs/branch/GPT-050-qa');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(ROOT,'shadow-warehouse050.js'),'utf8');
const upstreamBlock=fs.readFileSync(path.join(Q,'lab01-ff4a-runtime.js'),'utf8');
const upstreamTest=fs.readFileSync(path.join(Q,'shadow-cargo049.test.js'),'utf8');
const provenance=JSON.parse(fs.readFileSync(path.join(Q,'source.json'),'utf8'));
const native=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const anchor='Object.assign(window.GV,{art574:';
const pure=textBetween(source,'/* GPT-050 PURE FACTORY BEGIN */','/* GPT-050 PURE FACTORY END */');
function textBetween(s,a,b){assert.equal(s.split(a).length,2);assert.equal(s.split(b).length,2);return s.split(a)[1].split(b)[0];}
assert.equal(hash(native),provenance.nativeIndexSha256,'W01 native main bytes must be untouched');
assert.equal(hash(upstreamBlock),provenance.files['lab01-ff4a-runtime.js'].sha256,'W01 exact upstream runtime');
assert.equal(hash(upstreamTest),provenance.files['shadow-cargo049.test.js'].sha256,'W01 exact upstream tests');
assert.equal(native.split(anchor).length,2,'W01 unique QA insertion anchor');
console.log('WAREHOUSE050 SOURCE '+JSON.stringify({head:process.env.GITHUB_SHA||null,nativeHash:hash(native),candidateHash:hash(source),...provenance}));
const originalPure=textBetween(upstreamBlock,'/* GPT-049 PURE FACTORY BEGIN */','/* GPT-049 PURE FACTORY END */');
const compatibilityBlock=upstreamBlock.replace(originalPure,pure.replace('function createWarehouseCargo050(','function createShadowCargo049('));
const roots=[];
fs.mkdirSync(path.join(ROOT,'shots'),{recursive:true});
function qaRoot(label,insert) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'glimmertown-lab050-'+label+'-'));roots.push(dir);
  for(const f of fs.readdirSync(ROOT)) {
    if(['.git','.github','index.html','harness.js','shadow-cargo049.test.js'].includes(f)||f.startsWith('.smoke-profile-'))continue;
    fs.symlinkSync(path.join(ROOT,f),path.join(dir,f),fs.statSync(path.join(ROOT,f)).isDirectory()?'dir':'file');
  }
  fs.copyFileSync(path.join(ROOT,'harness.js'),path.join(dir,'harness.js'));
  const composed=native.replace(anchor,insert+'\n'+anchor);
  assert.equal(hash(composed.replace(insert+'\n','')),hash(native),'W01 removing only declared QA insertions restores native bytes');
  fs.writeFileSync(path.join(dir,'index.html'),composed);
  fs.writeFileSync(path.join(dir,'shadow-cargo049.test.js'),upstreamTest);
  console.log('WAREHOUSE050 COMPOSITION '+JSON.stringify({label,htmlHash:hash(composed),harnessHash:hash(fs.readFileSync(path.join(dir,'harness.js'))),role:'disposable-QA-not-product'}));
  return dir;
}
function legacy(label,block) {
  const dir=qaRoot(label,block);
  console.log('WAREHOUSE050 LEGACY_BEGIN '+label+' unchanged original assertions including native Chrome');
  cp.execFileSync(process.execPath,[path.join(dir,'shadow-cargo049.test.js')],{stdio:'inherit',env:process.env});
  console.log('WAREHOUSE050 LEGACY_PASS '+label);
}
const capStart=upstreamBlock.indexOf('    const nativeState=()=>JSON.stringify({');
const capEnd=upstreamBlock.indexOf('    const beforeNative=',capStart);
assert.ok(capStart>0&&capEnd>capStart,'W09 pinned direct-copy observation source');
const capture=upstreamBlock.slice(capStart,capEnd).replace('const nativeState=','window.__nativeCapture050=');
const observer=String.raw`
/* GPT-050 QA OBSERVER ONLY BEGIN */
`+capture+String.raw`
window.__protected050=fn=>{
  const before=window.__nativeCapture050(),frame=document.getElementById('game').toDataURL(),originalR=R,originalRandom=Math.random;
  const originalSet=Storage.prototype.setItem,originalRemove=Storage.prototype.removeItem,originalClear=Storage.prototype.clear;
  let rng=0,storage=0,result;
  try {
    R=()=>{rng++;throw new Error('unexpected native RNG');};
    Math.random=()=>{rng++;throw new Error('unexpected Math.random');};
    Storage.prototype.setItem=function(){storage++;throw new Error('unexpected storage write');};
    Storage.prototype.removeItem=function(){storage++;throw new Error('unexpected storage removal');};
    Storage.prototype.clear=function(){storage++;throw new Error('unexpected storage clear');};
    result=fn();
  } finally {
    R=originalR;Math.random=originalRandom;Storage.prototype.setItem=originalSet;Storage.prototype.removeItem=originalRemove;Storage.prototype.clear=originalClear;
  }
  return {result,nativeEqual:before===window.__nativeCapture050(),canvasEqual:frame===document.getElementById('game').toDataURL(),rng,storage};
};
window.__installVariant050=text=>{
  window.GV.shadowWarehouse050?.end();
  window.__noShadowWarehouse050=false;
  load=qaLoadBase050;newWorld=qaWorldBase050;
  eval(text);
  return true;
};
/* GPT-050 QA OBSERVER ONLY END */
`;
async function browser() {
  const dir=qaRoot('C-native-warehouse',upstreamBlock+'\nconst qaLoadBase050=load,qaWorldBase050=newWorld;\n'+source+'\n'+observer);
  const {withGame,sleep,waitFor}=require(path.join(dir,'harness.js'));
  const result=await withGame({port:8199,timeout:300,fresh:true,log:s=>console.log('WAREHOUSE050 CHROME '+s)},async({cdp})=>{
    await cdp.evalJs('GV.setSpeed(0); true');
    const run=code=>cdp.evalJs(code);
    const proof=await run(`__protected050(()=>{
      const a=GV.shadowWarehouse050,checks=[],add=(name,ok)=>{checks.push({name,ok:!!ok});if(!ok)throw new Error(name);};
      add('W09 default off no state or DOM',!a.snapshot().active&&!document.getElementById('shadowWarehouse050Panel'));
      add('W01 pinned049 reference remains inactive',!GV.shadowCargo049.snapshot().active);
      add('W02 real factory selftest',a.selftest().ok);
      add('W09 explicit demo',a.demo().ok);add('W10 real open',a.open().ok);add('W10 repeated open singleton',a.open().ok&&document.querySelectorAll('#shadowWarehouse050Panel').length===1);
      const values=[],observe=()=>{const s=a.snapshot().ledger,w=s.warehouse;const used=s.batches.filter(b=>b.owner===w.id).reduce((n,b)=>n+b.qty,0);add('W07 independent conservation',s.unissued+s.batches.reduce((n,b)=>n+b.qty,0)===20);add('W02 independent capacity',w.used===used&&used>=0&&used<=10);values.push(used);};
      observe();for(const id of ['InA','InB','OutA','Retry']){document.getElementById('shadowWarehouse050'+id).click();observe();}
      add('W02 required sequence',JSON.stringify(values)==='[0,7,7,0,8]');
      add('W03 A and B still unique',a.snapshot().ledger.batches.length===2);
      a.end();window.__noShadowWarehouse050=true;add('W09 OFF rejects demo',!a.demo().ok);window.__noShadowWarehouse050=false;
      return {checks,capacity:values,warning:a.warning};
    })`);
    assert.equal(proof.nativeEqual,true,'W09 enabled and off native/economy/traffic/labor/dirty state changed');
    assert.equal(proof.canvasEqual,true,'W09 synchronous full native canvas changed');
    assert.equal(proof.rng,0,'W09 RNG calls');assert.equal(proof.storage,0,'W09 storage writes');
    console.log('WAREHOUSE050 NATIVE_ISOLATION '+JSON.stringify(proof));
    async function uiMutant(id,from,to,probe) {
      assert.equal(source.split(from).length,2,'unique UI mutation '+id);
      const broken=source.replace(from,to);
      await run('__installVariant050('+JSON.stringify(broken)+')');
      let failed=null;try { await probe(); }catch(e){failed=e;}
      assert.ok(failed,'W10 mutant escaped '+id);
      assert.equal(failed.code,'ERR_ASSERTION','W10 mutant must first fail its independent assertion: '+id+' '+failed.message);
      assert.ok(failed.message.includes(id),'W10 wrong first guard '+id+' '+failed.message);
      console.log('WAREHOUSE050 EXPECTED_RED '+JSON.stringify({guard:id,sourceHash:hash(broken),firstFailure:failed.message.split('\n')[0],restoredHash:hash(source)}));
      await run('__installVariant050('+JSON.stringify(source)+')');
      await probe();await run('GV.shadowWarehouse050.end(); true');
      console.log('WAREHOUSE050 RESTORED '+id);
    }
    const setup=async()=>run(`(()=>{const a=GV.shadowWarehouse050;a.end();if(!a.demo().ok||!a.open().ok)throw new Error('UI setup');return true;})()`);
    await uiMutant('W10-bar','view.bar.value=w.used','view.bar.value=0',async()=>{
      await setup();await run("document.getElementById('shadowWarehouse050InA').click(); true");
      assert.equal(await run("document.getElementById('shadowWarehouse050Bar').value"),7,'W10-bar actual occupied7');
    });
    await uiMutant('W10-capacity-text',"'容量：'+w.used","'容量：'+0",async()=>{
      await setup();await run("document.getElementById('shadowWarehouse050InA').click(); true");
      assert.ok((await run("document.getElementById('shadowWarehouse050Capacity').textContent")).includes('7／10'),'W10-capacity-text');
    });
    await uiMutant('W10-wait-text',"'空間不足，等待出庫'","'可接貨'",async()=>{
      await setup();await run("document.getElementById('shadowWarehouse050InA').click(); document.getElementById('shadowWarehouse050InB').click(); true");
      assert.ok((await run("document.getElementById('shadowWarehouse050Status').textContent")).includes('空間不足'),'W10-wait-text');
    });
    await uiMutant('W10-button',"=>operation('WH_IN','batch-A')","=>operation('WH_IN','batch-B')",async()=>{
      await setup();await run("document.getElementById('shadowWarehouse050InA').click(); true");
      const s=await run('GV.shadowWarehouse050.snapshot().ledger');
      assert.equal(s.batches.find(b=>b.batchId==='batch-A').owner,s.warehouse.id,'W10-button A actual custody');
    });
    await uiMutant('W10-close',"()=>end('panel-ended-research-cancelled')","()=>refresh()",async()=>{
      await setup();await run("document.getElementById('shadowWarehouse050End').click(); true");
      assert.equal(await run("!!document.getElementById('shadowWarehouse050Panel')"),false,'W10-close panel removed');
    });
    await uiMutant('W10-details',"details.append(summary,json);","details.open=true;details.append(summary,json);",async()=>{
      await setup();assert.equal(await run("document.getElementById('shadowWarehouse050Details').open"),false,'W10-details collapsed initially');
    });

    await uiMutant('W10-full-state',"w.free===0?'倉庫已滿，等待出庫':'可接收研究貨物'","'可接收研究貨物'",async()=>{
      await run(`(()=>{const a=GV.shadowWarehouse050;a.end();const m={manifestId:'full-ui',provenance:'qa-fixture',commodityId:'food',total:20,source:'src',custodians:[{id:'src',location:'s'},{id:'wh',location:'w'},{id:'dst',location:'d'}]};const r=a.start(m,{id:'wh',commodityId:'food',capacity:10,maxWaiting:8});if(!r.ok)throw new Error('full setup');a.command({eventId:'full-create',sessionId:r.sessionId,batchId:'batch-A',type:'CREATE',expectedRevision:0,payload:{commodityId:'food',qty:10,source:'src',destination:'dst'}});a.open();document.getElementById('shadowWarehouse050InA').click();return true;})()`);
      assert.ok((await run("document.getElementById('shadowWarehouse050Status').textContent")).includes('倉庫已滿'),'W10-full-state full warehouse not advertised available');
      assert.ok((await run("document.getElementById('shadowWarehouse050InA').textContent")).includes('10'),'W10-full-state quantity derived, not fixed7');
    });

    async function click(id,selector=false) {
      const p=await run(`(()=>{const e=document.${selector?'querySelector':'getElementById'}(${JSON.stringify(id)}),r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})()`);
      assert.equal(p.hit,true,'W10 actual click target visible '+id);
      await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});
      await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});
      await sleep(40);
    }
    const screenshots=[];
    async function shot(name,state) {
      const png=await cdp.send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(png.data,'base64');
      const file='smoke-warehouse050-'+process.pid+'-'+name+'.png';fs.writeFileSync(path.join(ROOT,'shots',file),bytes);
      const receipt={file,sha256:hash(bytes),bytes:bytes.length,state,role:'isolated-native-QA-composition',head:process.env.GITHUB_SHA||null};
      screenshots.push(receipt);console.log('WAREHOUSE050 SCREENSHOT '+JSON.stringify(receipt));
    }
    const stages=[['initial',0,0],['A-in',7,0,'InA'],['B-wait',7,1,'InB'],['A-out',0,1,'OutA'],['B-resumed',8,0,'Retry'],['ended',null,0,'End']];
    for(const [layout,width,height,mobile] of [['desktop',1280,900,false],['mobile',390,844,true]])for(const [light,t] of [['day',55],['night',90]]) {
      await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
      await run(`GV.setVisT(${t});GV.forceDraw();GV.shadowWarehouse050.end();GV.shadowWarehouse050.demo();GV.shadowWarehouse050.open();true`);await sleep(80);
      let ids=null;
      for(const [name,used,waiting,button] of stages) {
        if(button)await click('shadowWarehouse050'+button);
        const s=await run('GV.shadowWarehouse050.snapshot()');
        if(used===null) {
          assert.equal(s.active,false,'W08 ended');assert.equal(s.ledger,null,'W08 no retained ledger');
          assert.equal(s.ended.cancelled,20,'W08 cancelled not delivered');assert.equal(await run("!!document.getElementById('shadowWarehouse050Panel')"),false,'W10 closed DOM');
        }else{
          const w=s.ledger.warehouse,bs=s.ledger.batches;
          assert.equal(w.used,used,'W02 rendered sequence');assert.equal(w.free,10-used);assert.equal(w.waitingInbound.length,waiting);
          assert.equal(bs.filter(b=>b.owner===w.id).reduce((n,b)=>n+b.qty,0),used,'W02 actual custody-derived used');
          assert.equal(s.ledger.unissued,5);assert.equal(bs.reduce((n,b)=>n+b.qty,0)+s.ledger.unissued,20,'W07 independent qty sum');
          const identity=bs.map(b=>[b.batchId,b.qty,b.source,b.destination]);if(ids)assert.deepEqual(identity,ids,'W03 immutable batch identity');else ids=identity;
          if(name==='B-wait')assert.equal(bs.find(b=>b.batchId==='batch-B').owner,'research-source','W03 waiting keeps source');
          if(name==='A-out')assert.equal(bs.find(b=>b.batchId==='batch-A').owner,'research-receiver','W03 out retains cargo at legal receiver');
          const ui=await run(`(()=>{const p=document.getElementById('shadowWarehouse050Panel'),r=p.getBoundingClientRect(),b=document.getElementById('shadowWarehouse050End').getBoundingClientRect();return{within:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,button:b.height>=44&&b.bottom<=innerHeight,warning:p.textContent.includes('未保存，重載即遺失'),bar:document.getElementById('shadowWarehouse050Bar').value,details:document.getElementById('shadowWarehouse050Details').open,text:document.getElementById('shadowWarehouse050Capacity').textContent};})()`);
          assert.equal(ui.within,true,'W10 viewport containment');assert.equal(ui.button,true,'W10 end reachable');assert.equal(ui.warning,true);assert.equal(ui.bar,used);assert.ok(ui.text.includes(used+'／10'));assert.equal(ui.details,false,'W10 JSON not dominating mobile');
        }
        await shot(layout+'-'+light+'-'+name,{active:s.active,used,waiting,unissued:s.ledger?.unissued??null});
        if(name==='B-wait') {
          await run(`document.getElementById('shadowWarehouse050Details').open=true;document.getElementById('shadowWarehouse050Scroll').scrollTop=10000;true`);
          const cam=await run('GV.camera436()');
          const rect=await run(`(()=>{const e=document.getElementById('shadowWarehouse050JSON'),p=document.getElementById('shadowWarehouse050Scroll'),r=e.getBoundingClientRect(),q=p.getBoundingClientRect();e.scrollTop=0;const top=Math.max(r.top,q.top,0),bottom=Math.min(r.bottom,q.bottom,innerHeight),x=r.left+30,y=(top+bottom)/2;return{x,y,visible:bottom>top,hit:e.contains(document.elementFromPoint(x,y)),before:e.scrollTop};})()`);
          assert.equal(rect.visible,true,'W10 JSON visible wheel target');assert.equal(rect.hit,true,'W10 wheel target hits JSON');assert.equal(rect.before,0,'W10 JSON starts at zero');
          await cdp.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:rect.x,y:rect.y,deltaX:0,deltaY:420});await sleep(80);
          const scroll=await run(`(()=>{const j=document.getElementById('shadowWarehouse050JSON');return{jsonOverflow:j.scrollHeight>j.clientHeight,after:j.scrollTop,cam:GV.camera436()};})()`);
          assert.equal(scroll.jsonOverflow,true,'W10 expandable diagnostic JSON');assert.ok(scroll.after>rect.before,'W10 actual wheel increases JSON scroll');assert.equal(scroll.cam.z,cam.z,'W10 panel wheel does not zoom city');
          console.log('WAREHOUSE050 REAL_SCROLL '+JSON.stringify({layout,light,before:rect.before,after:scroll.after,hit:rect.hit,cameraUnchanged:scroll.cam.z===cam.z}));
          await run("document.getElementById('shadowWarehouse050Details').open=false;document.getElementById('shadowWarehouse050Scroll').scrollTop=0;true");
        }
      }
    }
    console.log('WAREHOUSE050 SEQUENCE '+JSON.stringify({expectedUsed:[0,7,7,0,8],initial:20,unissued:5,A:7,B:8,split:false,physicalTransport:false}));
    const legacyRaw=fs.readFileSync(path.join(ROOT,'fixtures/fiscal-load026/legacy.json'),'utf8');
    await run('window.__legacy050='+JSON.stringify(legacyRaw)+';true');
    const lifecycle=await run(`(()=>{
      const a=GV.shadowWarehouse050,checks=[],add=(n,v)=>{checks.push({name:n,ok:!!v});if(!v)throw new Error(n);};
      const start=n=>{add(n+' active before stimulus',a.demo().ok&&a.snapshot().active);a.open();};
      GV.setSpeed(0);GV.newWorldSeeded(491);GV.setSpeed(0);const before=__nativeCapture050();
      start('enabled same-seed');a.end();add('W09 same-seed native identical',before===__nativeCapture050());
      const N=GV.shadowCargo049.nativeObservation().N;let spot=null;
      for(let y=5;y<N-5&&!spot;y++)for(let x=5;x<N-5&&!spot;x++){const t=GV.tile(x,y);if(t.t===2&&!t.bld&&!t.road&&!t.rail&&!t.tram&&!t.ruin)spot={x,y};}
      add('native land fixture',!!spot);start('build');
      add('W09 build',GV.placeUndo('road',spot.x,spot.y)&&GV.tile(spot.x,spot.y).road===1);
      GV.undo();add('W09 Undo',!GV.tile(spot.x,spot.y).road);GV.redo();add('W09 Redo',GV.tile(spot.x,spot.y).road===1);
      add('W09 demolition',GV.placeUndo('doze',spot.x,spot.y)&&!GV.tile(spot.x,spot.y).road);
      add('W09 pure warehouse does not claim native binding',a.snapshot().ledger.batches.length===2);a.end();GV.save();
      const keys=Object.keys(localStorage).filter(k=>/^glimmerville\\.v1\\.s3(?:\\.sandbox516b)?$/.test(k)),saved=keys.map(k=>[k,localStorage.getItem(k)]);
      const restore=()=>{for(const[k,v]of saved)localStorage.setItem(k,v);};add('slot3 fixture only',keys.length>0);
      const read=()=>JSON.parse(__nativeCapture050()),controlBefore=read();
      add('control load',GV.load());GV.setSpeed(0);const expected=read(),controlVersionDelta=expected.amVersion502-controlBefore.amVersion502;
      restore();start('normal load');const enabledBefore=read();add('enabled load',GV.load());GV.setSpeed(0);const actual=read(),enabledVersionDelta=actual.amVersion502-enabledBefore.amVersion502;
      add('W09 native load version delta equality',controlVersionDelta>0&&enabledVersionDelta===controlVersionDelta);
      // Native activeMobilityLoad502 always increments this one counter. Compare its exact delta;
      // every other copied field remains in the strict equality, and synchronous W09 stays byte-exact.
      delete expected.amVersion502;delete actual.amVersion502;
      const loadDifferences=Object.keys(expected).filter(k=>JSON.stringify(expected[k])!==JSON.stringify(actual[k]));
      add('W09 native load control equality '+JSON.stringify(loadDifferences),loadDifferences.length===0);add('W08 load cancellation',!a.snapshot().active&&!document.getElementById('shadowWarehouse050Panel'));
      const corrupt=()=>{for(const[k,v]of saved){const raw=JSON.parse(v);raw.rd=null;localStorage.setItem(k,JSON.stringify(raw));}};
      const attempt=()=>{try{return{returned:GV.load()};}catch(e){return{thrown:String(e.message||e)};}};
      corrupt();const failedControl=attempt();restore();add('recover failed control',GV.load());GV.setSpeed(0);
      start('partial load');corrupt();const failedEnabled=attempt(),cleared=!a.snapshot().active;restore();add('recover partial',GV.load());GV.setSpeed(0);
      add('W08 partial load clears before failure',cleared);add('W09 partial native outcome equal',JSON.stringify(failedControl)===JSON.stringify(failedEnabled)&&failedEnabled.returned!==true);
      const normal=keys.find(k=>k==='glimmerville.v1.s3');add('archived test slot3',!!normal);
      localStorage.setItem(normal,__legacy050);add('legacy control',GV.load());GV.setSpeed(0);GV.save();const expectedLegacy=localStorage.getItem(normal);
      localStorage.setItem(normal,__legacy050);start('legacy');add('legacy enabled',GV.load());GV.setSpeed(0);add('W08 legacy clears',!a.snapshot().active);
      start('save');const token=a.snapshot().ledger.sessionId;GV.save();add('W09 archived roundtrip equal',localStorage.getItem(normal)===expectedLegacy);
      add('W09 no research token persistence',keys.every(k=>!localStorage.getItem(k).includes(token)&&!localStorage.getItem(k).includes('shadowWarehouse050')));
      GV.newWorldSeeded(492);GV.setSpeed(0);add('W08 newWorld clears',!a.snapshot().active);
      start('explicit disable');a.disable();add('W08 disable clears',!a.snapshot().active);window.__noShadowWarehouse050=false;
      start('empty queue kill');window.__noShadowWarehouse050=true;document.getElementById('shadowWarehouse050Retry').click();window.__noShadowWarehouse050=false;add('W08 empty-head action checks valve',!a.snapshot().active&&!document.getElementById('shadowWarehouse050Panel'));
      start('pagehide');dispatchEvent(new Event('pagehide'));add('W08 pagehide clears',!a.snapshot().active);
      start('end argument safety');const cyclic={};cyclic.self=cyclic;a.end(cyclic);add('W08 public end ignores caller object',!a.snapshot().active);add('W08 end cannot poison native delegate',GV.load());GV.setSpeed(0);
      return{checks,loadVersionDeltas:{control:controlVersionDelta,enabled:enabledVersionDelta},legacyVersion:JSON.parse(__legacy050).gameVer,failedControl,failedEnabled};
    })()`);
    console.log('WAREHOUSE050 LIFECYCLE '+JSON.stringify(lifecycle));
    await run('GV.shadowWarehouse050.end();true');await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
    const cam0=await run('GV.camera436()');
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:640,y:450,deltaX:0,deltaY:-120});await sleep(400);
    const cam1=await run('GV.camera436()');assert.notEqual(cam1.z,cam0.z,'W10 native wheel after close');
    const tools=await run(`(()=>{const e=document.getElementById('tools');return{exists:!!e,buttons:e?.querySelectorAll('button').length||0,display:e?getComputedStyle(e).display:null};})()`);
    assert.equal(tools.exists,true,'W10 native toolbar exists');assert.notEqual(tools.display,'none','W10 toolbar still displayed');
    await click('.catalog458Btn',true);
    assert.equal(await run("document.getElementById('buildCatalog458').classList.contains('show')"),true,'W10 native catalog button opens after research close');
    await click('catalogClose458');
    assert.equal(await run("document.getElementById('buildCatalog458').classList.contains('show')"),false,'W10 native catalog button closes');
    console.log('WAREHOUSE050 NATIVE_INPUT '+JSON.stringify({cam0,cam1,tools,nativeCatalogOpenedAndClosed:true}));
    const beforeReload=await run(`(()=>{const a=GV.shadowWarehouse050,demo=a.demo(),opened=a.open(),s=a.snapshot();return{demo:demo.ok,opened:opened.ok,active:s.active,session:s.ledger?.sessionId,panel:!!document.getElementById('shadowWarehouse050Panel')};})()`);
    assert.equal(beforeReload.demo,true,'W08 reload actual demo');assert.equal(beforeReload.opened,true);assert.equal(beforeReload.active,true);assert.equal(beforeReload.panel,true);assert.ok(beforeReload.session,'W08 reload actual live session token');
    await cdp.send('Page.reload',{ignoreCache:true});
    assert.equal(await waitFor(cdp,'!!window.__bootDone453 && !!window.GV?.shadowWarehouse050',120000),true);
    const reloaded=await run(`({state:GV.shadowWarehouse050.snapshot(),panel:!!document.getElementById('shadowWarehouse050Panel')})`);
    assert.equal(reloaded.state.active,false,'W08 reload no autorestore');assert.equal(reloaded.state.ledger,null);assert.equal(reloaded.panel,false);
    console.log('WAREHOUSE050 RELOAD '+JSON.stringify({beforeReload,...reloaded}));
    console.log('WAREHOUSE050 BROWSER_ERRORS '+JSON.stringify({errors:cdp.errors,knownHarnessBenign:cdp.benign}));
    assert.equal(cdp.errors.length,0,'W10 native Chrome errors');
    return{ok:true,screenshots:screenshots.length,head:process.env.GITHUB_SHA||null,claims:'isolated native Chrome desktop/mobile viewport; no hardware phone/Safari or released integration'};
  });
  console.log('WAREHOUSE050 BROWSER_RESULT '+JSON.stringify({ok:result.ok,fails:result.fails,result:result.result,seconds:result.seconds}));
  assert.equal(result.ok,true,JSON.stringify(result.fails));
}

function runLineage050(){
  const oldFactory=vm.runInNewContext(originalPure+'\ncreateShadowCargo049;',{}, {timeout:3000});
  function check(code){
    const newer=vm.runInNewContext(textBetween(code,'/* GPT-050 PURE FACTORY BEGIN */','/* GPT-050 PURE FACTORY END */')+'\ncreateWarehouseCargo050;',{}, {timeout:3000});
    const m={manifestId:'lineage-20',provenance:'qa-fixture',commodityId:'food',total:20,source:'source',
      custodians:[{id:'source',location:'s'},{id:'warehouse',location:'w'},{id:'receiver',location:'r'}]};
    const a=oldFactory('lineage-session',m).engine,b=newer('lineage-session',m,undefined,{id:'warehouse',commodityId:'food',capacity:10,maxWaiting:8}).engine;
    for(const [batchId,qty]of [['A',7],['B',8]]){
      const c={eventId:'create-'+batchId,sessionId:'lineage-session',batchId,type:'CREATE',expectedRevision:a.snapshot().revision,
        payload:{commodityId:'food',qty,source:'source',destination:'receiver'}};
      assert.deepEqual(JSON.parse(JSON.stringify(b.command(c))),JSON.parse(JSON.stringify(a.command(c))),'W01-lineage inherited CREATE result equality');
      const s=b.snapshot();delete s.warehouse;
      assert.deepEqual(JSON.parse(JSON.stringify(s)),JSON.parse(JSON.stringify(a.snapshot())),'W01-lineage exact pre-warehouse cargo/events/conservation');
    }
  }
  check(source);
  const from="batch={batchId:c.batchId,commodityId:'food',qty:p.qty,",to="batch={batchId:c.batchId,commodityId:'food',qty:p.qty+1,";
  assert.equal(source.split(from).length,2);
  let red=null;try{check(source.replace(from,to));}catch(e){red=e;}
  assert.ok(red?.code==='ERR_ASSERTION'&&red.message.includes('W01-lineage'),'W01-lineage actual-source mutation must fail target');
  console.log('WAREHOUSE050 EXPECTED_RED '+JSON.stringify({guard:'W01-lineage',firstFailure:red.message.split('\n')[0]}));
  check(source);console.log('WAREHOUSE050 RESTORED W01-lineage');
}

'use strict';
// Drafted statically; NOT executed locally. Parent integrates/reviews before CI.
// Tests the supplied shipping source, not a parallel warehouse implementation.
function runPureAndRuntimeTests({source, upstreamBlock, assert = require('node:assert/strict'), vm = require('node:vm')}) {
  void upstreamBlock; // Parent owns exact upstream/hash/compatibility compositions.
  const receipts = [], plain = x => JSON.parse(JSON.stringify(x));
  function extract(s,a,b) {
    assert.equal(s.split(a).length,2,'W00 unique begin marker');
    assert.equal(s.split(b).length,2,'W00 unique end marker');
    return s.split(a)[1].split(b)[0];
  }
  function factory(s) {
    const code=extract(s,'/* GPT-050 PURE FACTORY BEGIN */','/* GPT-050 PURE FACTORY END */');
    return vm.runInNewContext(code+'\ncreateWarehouseCargo050;',{}, {timeout:3000});
  }
  const manifest=(total=20)=>({manifestId:'fixture-050',provenance:'qa-fixture',commodityId:'food',total,source:'src',
    custodians:[{id:'src',location:'s'},{id:'wh',location:'w'},{id:'dst',location:'d'}]});
  const wh=(extra={})=>({id:'wh',commodityId:'food',capacity:10,maxWaiting:8,...extra});
  const src=()=>({owner:'src',location:'s'}), stored=()=>({owner:'wh',location:'w'});
  function make(s,id,{total=20,warehouse={},limits}={}) {
    const r=factory(s)('session-050',manifest(total),limits,wh(warehouse));
    assert.equal(r.ok,true,id+' setup factory');return r.engine;
  }
  function cmd(e,type,batchId,payload,extra={}) {
    const s=e.snapshot();return {eventId:'event-'+s.revision,sessionId:s.sessionId,batchId,type,expectedRevision:s.revision,payload,...extra};
  }
  function send(e,type,batchId,payload,extra) {return e.command(cmd(e,type,batchId,payload,extra));}
  function create(e,batchId,qty,id) {
    const r=send(e,'CREATE',batchId,{commodityId:'food',qty,source:'src',destination:'dst'});
    assert.equal(r.ok,true,id+' CREATE '+batchId);return r;
  }
  const row=(e,id)=>e.snapshot().batches.find(b=>b.batchId===id);
  function reject(e,c,id,code) {
    const before=JSON.stringify(e.snapshot()),r=e.command(c);
    assert.equal(r.ok,false,id+' must reject');
    assert.equal(JSON.stringify(e.snapshot()),before,id+' rejected command changes no ledger/queue/event');
    if(code)assert.equal(r.code,code,id+' rejection reason');return r;
  }
  function oracle(s,id,total=s.manifest.total) {
    const ids=new Set(),custodians=new Map(s.manifest.custodians.map(c=>[c.id,c.location]));let live=0,terminal=0,used=0;
    for(const b of s.batches) {
      assert.equal(ids.has(b.batchId),false,id+' unique actual batch');ids.add(b.batchId);
      assert.ok(Number.isSafeInteger(b.qty)&&b.qty>0,id+' positive safe quantity');
      assert.equal(custodians.get(b.owner),b.location,id+' unique registered owner/location');
      if(b.state==='COMPLETED')terminal+=b.qty;else live+=b.qty;
      if(s.warehouse&&b.owner===s.warehouse.id)used+=b.qty;
    }
    assert.equal(s.unissued+live+terminal,total,id+' independent quantity sum');
    assert.equal(s.conservation.ok,true,id+' reducer agrees with independent conservation');
    assert.equal(s.conservation.live,live,id+' live quantity');assert.equal(s.conservation.terminal,terminal,id+' terminal quantity');
    assert.equal(s.revision,s.events.length,id+' one revision per committed event');
    if(s.warehouse) {
      const w=s.warehouse;assert.equal(w.used,used,id+' actual custody determines used');
      assert.equal(w.free,w.capacity-used,id+' free capacity');assert.ok(used>=0&&used<=w.capacity,id+' capacity range');
      const queued=new Set();for(const q of w.waitingInbound) {
        assert.equal(queued.has(q.batchId),false,id+' unique waiting batch');queued.add(q.batchId);
        const b=s.batches.find(b=>b.batchId===q.batchId);assert.ok(b,id+' request references actual cargo');
        assert.equal(b.owner,b.source,id+' waiting retains source owner');assert.equal(b.state,'SOURCE_READY',id+' waiting cargo state');
      }
      assert.ok(w.waitingInbound.length<=w.maxWaiting,id+' queue bound');
    }
  }
  function blockedFixture(s,id,options) {
    const e=make(s,id,options);create(e,'A',7,id);create(e,'B',8,id);
    assert.equal(send(e,'WH_IN','A',src()).outcome,'STORED',id+' A inbound');
    assert.equal(send(e,'WH_IN','B',src()).outcome,'WAITING',id+' B accepted waiting');return e;
  }
  const guards={};
  guards.W02_capacity=s=>{
    const id='W02_capacity',e=make(s,id);create(e,'A',7,id);create(e,'B',8,id);oracle(e.snapshot(),id,20);
    const immutable=plain(row(e,'A')),beforeB=JSON.stringify(row(e,'B'));
    assert.equal(send(e,'WH_IN','A',src()).outcome,'STORED',id+' A admitted');assert.equal(e.snapshot().warehouse.used,7,id+' 7/10');
    assert.equal(send(e,'WH_IN','B',src()).outcome,'WAITING',id+' capacity shortage accepts a waiting request');
    assert.equal(JSON.stringify(row(e,'B')),beforeB,id+' waiting does not mutate cargo');oracle(e.snapshot(),id,20);
    const requestId=e.snapshot().warehouse.waitingInbound[0].requestId;
    assert.equal(send(e,'WH_OUT','A',{...stored(),to:'dst'}).outcome,'OUTBOUND',id+' outbound accepted');
    assert.equal(e.snapshot().warehouse.used,0,id+' release observable before retry');assert.equal(row(e,'A').owner,'dst',id+' A retains receiver custody');
    assert.equal(send(e,'WH_RETRY','B',{...src(),requestId}).outcome,'STORED',id+' whole B retried');
    assert.equal(e.snapshot().warehouse.used,8,id+' 8/10');assert.equal(e.snapshot().unissued,5,id+' unissued5');
    for(const k of ['batchId','qty','source','destination','creationEvent'])assert.equal(row(e,'A')[k],immutable[k],id+' stable '+k);
    oracle(e.snapshot(),id,20);
    const f=make(s,id);create(f,'full',10,id);assert.equal(send(f,'WH_IN','full',src()).outcome,'STORED',id+' exact full accepted');
    assert.equal(f.snapshot().warehouse.free,0,id+' exact full free0');oracle(f.snapshot(),id,20);
  };
  guards.W02_oversize=s=>{const id='W02_oversize',e=make(s,id);create(e,'large',11,id);reject(e,cmd(e,'WH_IN','large',src()),id,'batch-exceeds-capacity');oracle(e.snapshot(),id,20);};
  guards.W03_custody=s=>{
    const id='W03_custody',e=make(s,id);create(e,'A',7,id);
    for(const p of [{owner:'forged',location:'s'},{owner:'src',location:'forged'}])reject(e,cmd(e,'WH_IN','A',p),id,'custody-conflict');
    assert.equal(send(e,'WH_IN','A',src()).ok,true,id+' valid inbound');
    reject(e,cmd(e,'WH_OUT','A',{owner:'forged',location:'w',to:'dst'}),id,'custody-conflict');
    reject(e,cmd(e,'WH_OUT','A',{...stored(),to:'src'}),id,'destination-unavailable');
    reject(e,cmd(e,'HANDOFF','A',{...stored(),to:'dst'}),id,'warehouse-admission-required');
    reject(e,cmd(e,'CREATE','direct',{commodityId:'food',qty:1,source:'src',destination:'wh'}),id,'warehouse-admission-required');
    assert.equal(send(e,'WH_OUT','A',{...stored(),to:'dst'}).ok,true,id+' legitimate outbound');
    assert.equal(row(e,'A').location,'d',id+' receiver location');oracle(e.snapshot(),id,20);
  };
  guards.W03_atomic=s=>{
    const id='W03_atomic',e=make(s,id),before=JSON.stringify(e.snapshot());
    const r=send(e,'CREATE','A',{commodityId:'food',qty:7,source:'src',destination:'dst'});
    // The coupled atomic mutant deliberately forces final conservation rejection.
    if(!r.ok)assert.equal(JSON.stringify(e.snapshot()),before,id+' final validation failure must not commit');
    assert.equal(r.ok,true,id+' unmodified valid CREATE succeeds');
    reject(e,cmd(e,'WH_IN','A',{owner:'wrong',location:'s'}),id);oracle(e.snapshot(),id,20);
  };
  guards.W04_events=s=>{
    const id='W04_events',e=make(s,id);create(e,'A',7,id);const c=cmd(e,'WH_IN','A',src()),r=e.command(c),after=JSON.stringify(e.snapshot());
    assert.equal(r.ok,true,id+' initial event');assert.deepEqual(plain(e.command(plain(c))),plain(r),id+' exact replay');
    assert.equal(JSON.stringify(e.snapshot()),after,id+' replay no mutation');
    for(const change of [{sessionId:'other'},{batchId:'B'},{type:'WH_OUT'},{expectedRevision:99},{payload:{owner:'src',location:'wrong'}}])reject(e,{...c,...change},id,'event-conflict');
    reject(e,cmd(e,'WH_OUT','A',{...stored(),to:'dst'},{expectedRevision:0}),id,'stale-revision');
    reject(e,cmd(e,'WH_OUT','A',{...stored(),to:'dst'},{sessionId:'old'}),id,'stale-session');
    const q=blockedFixture(s,id),head=q.snapshot().warehouse.waitingInbound[0],event=q.snapshot().events.find(x=>x.eventId===head.requestId);
    assert.deepEqual(plain(q.command(event.command)),plain(event.result),id+' waiting event replay');oracle(q.snapshot(),id,20);
  };
  guards.W05_fifo=s=>{
    const id='W05_fifo',e=blockedFixture(s,id);create(e,'C',2,id);
    assert.equal(send(e,'WH_IN','C',src()).outcome,'WAITING',id+' fitting new arrival cannot jump head');
    const q=e.snapshot().warehouse.waitingInbound;
    assert.deepEqual(plain(q.map(x=>x.batchId)),['B','C'],id+' deterministic FIFO order');
    reject(e,cmd(e,'WH_RETRY','C',{...src(),requestId:q[1].requestId}),id,'fifo-head-required');
    assert.equal(send(e,'WH_CANCEL','B',{...src(),requestId:q[0].requestId}).outcome,'CANCELLED',id+' cancel head');
    assert.equal(e.snapshot().warehouse.waitingInbound[0].reason,'capacity-available-retry-required',id+' current reason recalculated');
    assert.equal(send(e,'WH_RETRY','C',{...src(),requestId:q[1].requestId}).outcome,'STORED',id+' new head may enter');oracle(e.snapshot(),id,20);
  };
  guards.W05_bounds=s=>{
    const id='W05_bounds',e=make(s,id,{warehouse:{maxWaiting:2}});for(const [b,n]of[['A',10],['B',1],['C',1],['D',1]])create(e,b,n,id);
    send(e,'WH_IN','A',src());assert.equal(send(e,'WH_IN','B',src()).outcome,'WAITING',id+' first wait');
    reject(e,cmd(e,'WH_IN','B',src()),id,'duplicate-waiting');
    assert.equal(send(e,'WH_IN','C',src()).outcome,'WAITING',id+' second wait');
    reject(e,cmd(e,'WH_IN','D',src()),id,'waiting-limit');assert.deepEqual(plain(e.snapshot().warehouse.waitingInbound.map(q=>q.batchId)),['B','C'],id+' accepted requests retained');oracle(e.snapshot(),id,20);
  };
  guards.W06_cancel=s=>{
    const id='W06_cancel',e=blockedFixture(s,id),q=e.snapshot().warehouse.waitingInbound[0];
    assert.equal(send(e,'WH_CANCEL','B',{...src(),requestId:q.requestId}).outcome,'CANCELLED',id+' cancel accepted');
    send(e,'WH_OUT','A',{...stored(),to:'dst'});
    reject(e,cmd(e,'WH_IN','B',src()),id,'request-cancelled');reject(e,cmd(e,'WH_RETRY','B',{...src(),requestId:q.requestId}),id,'request-cancelled');
    assert.equal(row(e,'B').owner,'src',id+' cancelled request retains source cargo');oracle(e.snapshot(),id,20);
  };
  guards.W06_frozen=s=>{
    const id='W06_frozen',e=make(s,id);create(e,'A',7,id);send(e,'WH_IN','A',src());
    assert.equal(send(e,'FREEZE','A',{...stored(),reason:'hold'}).ok,true,id+' freeze accepted');
    oracle(e.snapshot(),id,20);assert.equal(e.snapshot().warehouse.used,7,id+' frozen cargo still occupies');
    reject(e,cmd(e,'WH_OUT','A',{...stored(),to:'dst'}),id,'frozen-batch');
    const f=make(s,id);create(f,'done',1,id);send(f,'HANDOFF','done',{...src(),to:'dst'});send(f,'COMPLETE','done',{owner:'dst',location:'d'});
    reject(f,cmd(f,'WH_IN','done',{owner:'dst',location:'d'}),id,'terminal-batch');oracle(f.snapshot(),id,20);
  };
  guards.W06_invalid=s=>{
    const id='W06_invalid',e=blockedFixture(s,id);
    assert.equal(send(e,'WH_INVALIDATE',null,{reason:'custodian unavailable'}).outcome,'INVALIDATED',id+' invalidate');
    assert.equal(e.snapshot().warehouse.operational,false,id+' operational disabled');assert.equal(row(e,'A').state,'FROZEN',id+' stored frozen');
    assert.equal(e.snapshot().warehouse.waitingInbound.length,0,id+' waits cancelled');assert.equal(row(e,'B').owner,'src',id+' waiting not delivered');oracle(e.snapshot(),id,20);
    const f=make(s,id);create(f,'A',1,id);send(f,'WH_INVALIDATE',null,{reason:'offline'});
    reject(f,cmd(f,'WH_IN','A',src()),id,'warehouse-unavailable');oracle(f.snapshot(),id,20);
  };
  guards.W07_copy=s=>{
    const id='W07_copy',m=manifest(),r=factory(s)('session-050',m,undefined,wh());assert.equal(r.ok,true,id+' make');const e=r.engine;
    m.total=999;m.custodians[0].location='tampered';const c=cmd(e,'CREATE','A',{commodityId:'food',qty:7,source:'src',destination:'dst'}),out=e.command(c);
    assert.equal(out.ok,true,id+' create');const before=JSON.stringify(e.snapshot());
    let aliasError=null;try{c.payload.qty=999;out.ok=false;const snap=e.snapshot();snap.batches[0].qty=999;snap.manifest.total=999;snap.warehouse.used=999;}catch(error){aliasError=error;}
    assert.equal(aliasError,null,id+' returned copies are independently mutable');
    assert.equal(JSON.stringify(e.snapshot()),before,id+' inputs/results/snapshot do not alias');oracle(e.snapshot(),id,20);
  };
  guards.W07_getters=s=>{
    const id='W07_getters';let touched=0;const m=manifest();Object.defineProperty(m,'total',{enumerable:true,get(){touched++;return 20;}});
    assert.equal(factory(s)('session-050',m,undefined,wh()).ok,false,id+' manifest accessor rejected');assert.equal(touched,0,id+' manifest getter not invoked');
    const e=make(s,id),c=cmd(e,'CREATE','A',{commodityId:'food',qty:7,source:'src',destination:'dst'});
    Object.defineProperty(c.payload,'qty',{enumerable:true,get(){touched++;return 7;}});reject(e,c,id,'invalid-data');assert.equal(touched,0,id+' command getter not invoked');
    for(const value of [null,1,{},[]])reject(e,cmd(e,value,'A',{}),id); // No startsWith TypeError.
    const missing=manifest();missing.custodians=missing.custodians.slice(0,2);assert.equal(factory(s)('session-050',missing,undefined,wh()).ok,false,id+' distinct receiver required');
  };
  guards.W07_conservation=s=>{
    const id='W07_conservation',e=make(s,id);create(e,'A',7,id);create(e,'B',8,id);assert.equal(e.snapshot().unissued,5,id+' known source debit');oracle(e.snapshot(),id,20);
    reject(e,cmd(e,'CREATE','tooMuch',{commodityId:'food',qty:6,source:'src',destination:'dst'}),id,'source-exhausted');
    const full=make(s,id,{total:32});for(let i=0;i<32;i++){create(full,'b'+i,1,id);send(full,'WH_IN','b'+i,src());send(full,'WH_OUT','b'+i,{...stored(),to:'dst'});}
    assert.equal(full.snapshot().events.length,96,id+' admitted history readable');assert.equal(full.snapshot().batches.length,32,id+' no batch eviction');oracle(full.snapshot(),id,32);
  };

  function runtime(candidate) {
    const allNodes=[],listeners=new Map(),counts={rng:0,storage:0,native:0,clock:0,crypto:0},calls=[];
    class Node {
      constructor(tag){this.tagName=tag;this.style={};this.dataset={};this.children=[];this.parent=null;this.handlers=new Map();this.textContent='';allNodes.push(this);}
      setAttribute(k,v){this[k]=v;}
      addEventListener(k,f){if(!this.handlers.has(k))this.handlers.set(k,new Set());this.handlers.get(k).add(f);}
      removeEventListener(k,f){this.handlers.get(k)?.delete(f);}
      appendChild(n){n.parent=this;this.children.push(n);return n;}
      append(...ns){for(const n of ns)this.appendChild(n);}
      replaceChildren(...ns){for(const n of this.children)n.parent=null;this.children=[];this.append(...ns);}
      remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null;}
      click(){const e={stopPropagation(){},preventDefault(){}};for(const f of [...(this.handlers.get('click')||[])])f.call(this,e);}
    }
    const body=new Node('body'),find=(id,n=body)=>n.id===id?n:n.children.map(c=>find(id,c)).find(Boolean)||null;
    const window={GV:{},crypto:{getRandomValues(a){counts.crypto++;for(let i=0;i<a.length;i++)a[i]=i+1;return a;}},
      addEventListener(k,f){if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(f);},removeEventListener(k,f){listeners.get(k)?.delete(f);}};
    const context={window,document:{body,createElement:t=>new Node(t),getElementById:id=>find(id)},Uint8Array,
      tiles:[{t:2,rail:0,bld:null}],economy482:{food:12},fin:{net:3},money:700,pop:10,jobs:8,goods:4,fuel:5,steel:6,supplies:7,
      R(){counts.rng++;throw Error('forbidden native RNG');}};
    context.Math=Object.create(Math);context.Math.random=()=>{counts.rng++;throw Error('forbidden Math.random');};
    context.Date={now(){counts.clock++;throw Error('forbidden clock');}};context.performance={now(){counts.clock++;throw Error('forbidden clock');}};
    for(const name of ['setTimeout','setInterval','requestAnimationFrame'])context[name]=window[name]=()=>{counts.clock++;throw Error('forbidden timer');};
    for(const host of [context,window])for(const name of ['localStorage','sessionStorage','indexedDB'])Object.defineProperty(host,name,{get(){counts.storage++;throw Error('forbidden persistence');}});
    for(const name of ['save','tick','advance','rebuildRailOps463','ensureMobility462','railOpsSnapshot463','transitOpsSnapshot501','stationEvidence008'])context[name]=()=>{counts.native++;throw Error('forbidden native '+name);};
    const thrown=Error('native error identity');
    for(const name of ['load','newWorld'])context[name]=function(...args){calls.push({name,self:this,args,active:window.GV.shadowWarehouse050.snapshot().active});context.tiles=[{native:name}];if(args[0]==='throw')throw thrown;return args[0]==='partial'?false:name+'-result';};
    vm.createContext(context);vm.runInContext(candidate,context,{timeout:3000});
    return {a:window.GV.shadowWarehouse050,context,window,body,allNodes,counts,calls,thrown,listeners,find,
      pagehide(){for(const f of [...(listeners.get('pagehide')||[])])f();},
      capture(){return JSON.stringify({tiles:context.tiles,economy482:context.economy482,fin:context.fin,money:context.money,pop:context.pop,jobs:context.jobs,goods:context.goods,fuel:context.fuel,steel:context.steel,supplies:context.supplies});}};
  }
  function active(r,id){const v=r.a.demo();assert.equal(v.ok,true,id+' explicit active start');assert.equal(r.a.snapshot().active,true,id+' active precondition');return v;}
  function clean(r,id){assert.equal(r.a.snapshot().active,false,id+' session removed');assert.equal(r.a.snapshot().ledger,null,id+' ledger removed');assert.equal(r.find('shadowWarehouse050Panel'),null,id+' DOM removed');assert.equal(r.listeners.get('pagehide')?.size||0,0,id+' session listener removed');}
  guards.W08_load=s=>{
    const id='W08_load',r=runtime(s);for(const arg of ['ok','partial','throw']){active(r,id);assert.equal(r.a.open().ok,true,id+' open');const n=r.calls.length,target={target:true};
      if(arg==='throw')assert.throws(()=>r.context.load.call(target,arg,9),e=>e===r.thrown,id+' original exception identity');
      else assert.equal(r.context.load.call(target,arg,9),arg==='partial'?false:'load-result',id+' return preserved');
      assert.equal(r.calls.length,n+1,id+' delegate once');assert.equal(r.calls[n].self,target,id+' this preserved');assert.deepEqual(r.calls[n].args,[arg,9],id+' args preserved');assert.equal(r.calls[n].active,false,id+' invalidated BEFORE delegate');clean(r,id);}
  };
  guards.W08_world=s=>{
    const id='W08_world',r=runtime(s);for(const arg of ['ok','throw']){active(r,id);const n=r.calls.length,target={world:true};
      if(arg==='throw')assert.throws(()=>r.context.newWorld.call(target,arg,11),e=>e===r.thrown,id+' exception identity');else assert.equal(r.context.newWorld.call(target,arg,11),'newWorld-result',id+' return');
      assert.equal(r.calls.length,n+1,id+' once');assert.equal(r.calls[n].self,target,id+' this');assert.deepEqual(r.calls[n].args,[arg,11],id+' args');assert.equal(r.calls[n].active,false,id+' before delegate');clean(r,id);}
  };
  guards.W08_pagehide=s=>{const id='W08_pagehide',r=runtime(s);active(r,id);r.a.open();r.pagehide();clean(r,id);};
  guards.W08_disable=s=>{const id='W08_disable',r=runtime(s);active(r,id);r.a.open();r.a.disable();assert.equal(r.find('shadowWarehouse050Panel'),null,id+' immediate DOM removal before read');assert.equal(r.listeners.get('pagehide').size,0,id+' immediate listener removal before read');clean(r,id);assert.equal(r.a.demo().ok,false,id+' cannot restart disabled');};
  guards.W08_flag=s=>{const id='W08_flag',r=runtime(s);active(r,id);r.a.open();r.window.__noShadowWarehouse050=true;r.a.refresh();clean(r,id);};
  guards.W08_tiles=s=>{const id='W08_tiles',r=runtime(s);active(r,id);r.a.open();r.context.tiles=[{replacement:true}];r.a.snapshot();clean(r,id);};
  guards.W08_end=s=>{
    const id='W08_end',r=runtime(s),v=active(r,id);r.a.open();const old={eventId:'old-event',sessionId:v.sessionId,batchId:'batch-A',type:'WH_IN',expectedRevision:2,payload:{owner:'research-source',location:'research-source-shelf'}};
    const cyclic={};cyclic.self=cyclic;let ended;assert.doesNotThrow(()=>{ended=r.a.end(cyclic);},id+' hostile end input must not throw');assert.equal(ended.ok,true,id+' ignores hostile public reason');assert.equal(typeof ended.ended.reason,'string',id+' bounded reason only');clean(r,id);
    assert.equal(r.a.command(old).ok,false,id+' old command cannot revive');assert.equal(r.context.load(),'load-result',id+' cleanup cannot poison native delegate');
    const newer=active(r,id);assert.notEqual(newer.sessionId,v.sessionId,id+' new session identity');assert.equal(r.a.command(old).ok,false,id+' stale command rejected in new session');r.a.end();
  };
  guards.W08_buttons=s=>{
    const id='W08_buttons';for(const button of ['Retry','Cancel'])for(const stale of ['flag','tiles']){const r=runtime(s);active(r,id);r.a.open();
      assert.equal(r.a.snapshot().ledger.warehouse.waitingInbound.length,0,id+' EMPTY queue precondition');
      if(stale==='flag')r.window.__noShadowWarehouse050=true;else r.context.tiles=[{other:true}];
      r.find('shadowWarehouse050'+button).click();
      // Inspect DOM/listeners BEFORE snapshot(), which itself would conceal a missed button guard.
      assert.equal(r.find('shadowWarehouse050Panel'),null,id+' empty '+button+' invalidates at '+stale+' boundary');assert.equal(r.listeners.get('pagehide').size,0,id+' listener removed before read');clean(r,id);}
  };
  guards.W09_isolation=s=>{
    const id='W09_isolation',r=runtime(s);assert.equal(r.body.children.length,0,id+' default no panel');assert.equal(r.counts.crypto,0,id+' default no nonce draw');
    const before=r.capture();let boundaryError=null;
    try{active(r,id);assert.equal(r.a.open().ok,true,id+' open enabled');r.find('shadowWarehouse050InA').click();r.find('shadowWarehouse050InB').click();r.find('shadowWarehouse050OutA').click();r.find('shadowWarehouse050Retry').click();r.a.refresh();r.a.end();}catch(error){boundaryError=error;}
    for(const k of ['rng','storage','native','clock'])assert.equal(r.counts[k],0,id+' zero '+k+' calls');
    assert.equal(boundaryError,null,id+' enabled research API must not throw');
    assert.equal(r.capture(),before,id+' enabled protected native values unchanged');
    assert.equal(r.counts.crypto,1,id+' independent nonce only');clean(r,id);
    assert.equal(r.allNodes.reduce((n,x)=>n+[...x.handlers.values()].reduce((a,v)=>a+v.size,0),0),0,id+' own DOM handlers removed');
  };
  guards.W10_vmButtons=s=>{
    const id='W10_vmButtons',r=runtime(s);active(r,id);assert.equal(r.a.open().ok,true,id+' open');assert.equal(r.a.open().ok,true,id+' repeat open');assert.equal(r.body.children.length,1,id+' singleton');
    for(const [button,used,waiting]of[['InA',7,0],['InB',7,1],['OutA',0,1],['Retry',8,0]]){r.find('shadowWarehouse050'+button).click();const st=r.a.snapshot().ledger;
      assert.equal(st.warehouse.used,used,id+' real '+button+' transition');assert.equal(st.warehouse.waitingInbound.length,waiting,id+' real queue '+button);
      assert.ok(r.find('shadowWarehouse050Capacity').textContent.includes(used+'／10'),id+' displayed capacity matches real ledger');assert.equal(r.find('shadowWarehouse050Bar').value,used,id+' progress matches real ledger');}
    r.find('shadowWarehouse050End').click();clean(r,id);
  };


  guards.W02_config=s=>{
    const id='W02_config',f=factory(s);
    for(const bad of [{capacity:0},{capacity:-1},{capacity:1.5},{capacity:Infinity},{capacity:NaN},{capacity:Number.MAX_SAFE_INTEGER+1},{maxWaiting:0},{maxWaiting:9},{maxWaiting:1.5},{id:'src'},{id:'unknown'},{commodityId:'coal'},{extra:true}])
      assert.equal(f('session-050',manifest(),undefined,wh(bad)).ok,false,id+' invalid bounded config '+JSON.stringify(bad));
    let touched=0;const w=wh();Object.defineProperty(w,'capacity',{enumerable:true,get(){touched++;return 10;}});
    assert.equal(f('session-050',manifest(),undefined,w).ok,false,id+' accessor rejected');assert.equal(touched,0,id+' accessor not invoked');
  };
  guards.W05_eventBound=s=>{
    const id='W05_eventBound',e=make(s,id,{limits:{maxEvents:2}});create(e,'A',1,id);
    assert.equal(send(e,'WH_IN','A',src()).outcome,'STORED',id+' last admitted event');
    reject(e,cmd(e,'WH_OUT','A',{...stored(),to:'dst'}),id,'event-limit');
    assert.equal(e.snapshot().warehouse.used,1,id+' technical bound retains cargo');assert.equal(e.snapshot().events.length,2,id+' no event eviction');oracle(e.snapshot(),id,20);
  };
  guards.W10_renderAtomic=s=>{
    const id='W10_renderAtomic',r=runtime(s);active(r,id);assert.equal(r.a.open().ok,true,id+' open');
    Object.defineProperty(r.find('shadowWarehouse050Capacity'),'textContent',{set(){throw new Error('injected DOM rendering fault');},configurable:true});
    const st=r.a.snapshot().ledger;let result;
    assert.doesNotThrow(()=>{result=r.a.command({eventId:'render-fault',sessionId:st.sessionId,batchId:'batch-A',type:'WH_IN',expectedRevision:st.revision,payload:{owner:'research-source',location:'research-source-shelf'}});},id+' render failure cannot turn committed event into thrown failure');
    assert.equal(result.ok,true,id+' committed core result retained');assert.equal(r.a.snapshot().ledger.warehouse.used,7,id+' custody remains authoritative');
    assert.equal(r.find('shadowWarehouse050Panel'),null,id+' broken own UI removed');r.a.end();
  };

  function run(id,candidate) {
    guards[id](candidate);
  }
  for(const id of Object.keys(guards)){run(id,source);receipts.push({kind:'green',guard:id});console.log('WAREHOUSE050 GREEN '+id);}
  function edit(from,to,count=1,occurrence=0){return {from,to,count,occurrence};}
  const mutations=[
    ['config-capacity','W02_config',[edit('!positive(warehouse.capacity) ||','')]],
    ['event-bound','W05_eventBound',[edit("if(ledger.events.size>=limits.maxEvents)return fail('event-limit');",''),edit('state.events.size<=limits.maxEvents','true')]],
    ['render-atomic','W10_renderAtomic',[edit('if(panel)try{refresh();}catch(_){removePanel();}','if(panel)refresh();')]],
    ['capacity','W02_capacity',[edit("const mayEnter=old.qty<=room && (c.type==='WH_RETRY' || whNext.waiting.length===0);","const mayEnter=true;")]],
    ['used','W02_capacity',[edit('const storedQuantity=state=>warehouse?[...state.batches.values()].filter(b=>b.owner===warehouse.id).reduce((n,b)=>n+b.qty,0):0;','const storedQuantity=state=>0;')]],
    ['oversized-wait','W02_oversize',[edit("if(old.qty>warehouse.capacity)return fail('batch-exceeds-capacity');",''),edit("b.qty<=warehouse.capacity && state.events.get(q.requestId)?.command.type==='WH_IN'","true && state.events.get(q.requestId)?.command.type==='WH_IN'")]],
    ['custody','W03_custody',[edit("if(old.owner!==p.owner || old.location!==p.location)return fail('custody-conflict');",'')]],
    ['outbound-location','W03_custody',[edit("batch={...copyData(old),owner:p.to,location:custodians.get(p.to).location,state:'HELD',eventSeq:ledger.revision+1};","batch={...copyData(old),owner:p.to,location:old.location,state:'HELD',eventSeq:ledger.revision+1};")]],
    ['atomic-final-validation','W03_atomic',[edit("if(!conservation(next).ok)return fail('conservation-violation');\n    ledger=next;","ledger=next;\n    if(!conservation(next).ok)return fail('conservation-violation');"),edit("unissued:ledger.unissued-(c.type==='CREATE'?batch.qty:0)",'unissued:ledger.unissued')]],
    ['replay','W04_events',[edit("if(previous)return previous.signature===signature?copyData(previous.result):fail('event-conflict');","if(previous)return fail('broken-replay');")]],
    ['event-conflict','W04_events',[edit("if(previous)return previous.signature===signature?copyData(previous.result):fail('event-conflict');","if(previous)return copyData(previous.result);")]],
    ['stale-revision','W04_events',[edit("if(c.expectedRevision!==ledger.revision)return fail('stale-revision');",'')]],
    ['fifo-new-arrival','W05_fifo',[edit("const mayEnter=old.qty<=room && (c.type==='WH_RETRY' || whNext.waiting.length===0);","const mayEnter=old.qty<=room;")]],
    ['fifo-retry','W05_fifo',[edit("if(whNext.waiting[0]!==queued)return fail('fifo-head-required');",''),edit('if(queued)whNext.waiting.shift();','if(queued)whNext.waiting=whNext.waiting.filter(q=>q!==queued);')]],
    ['duplicate-queue','W05_bounds',[edit("if(c.type==='WH_IN' && queued)return fail('duplicate-waiting');",''),edit('valid=valid && !ids.has(q.batchId) && !!b', 'valid=valid && true && !!b')]],
    ['queue-bound','W05_bounds',[edit("if(whNext.waiting.length>=warehouse.maxWaiting)return fail('waiting-limit');",''),edit('w.waiting.length<=warehouse.maxWaiting','true')]],
    ['cancelled-readmission','W06_cancel',[edit("if(whNext.cancelled.some(q=>q.batchId===c.batchId))return fail('request-cancelled');",'')]],
    ['frozen-capacity','W06_frozen',[edit('const storedQuantity=state=>warehouse?[...state.batches.values()].filter(b=>b.owner===warehouse.id).reduce((n,b)=>n+b.qty,0):0;',"const storedQuantity=state=>warehouse?[...state.batches.values()].filter(b=>b.owner===warehouse.id && b.state!=='FROZEN').reduce((n,b)=>n+b.qty,0):0;")]],
    ['frozen-outbound','W06_frozen',[edit("if(old.state==='FROZEN')return fail('frozen-batch');",'',2,0),edit("if(old.state!=='WAREHOUSED' || old.owner!==warehouse.id)return fail('invalid-transition');","if(!['WAREHOUSED','FROZEN'].includes(old.state) || old.owner!==warehouse.id)return fail('invalid-transition');")]],
    ['invalid-warehouse','W06_invalid',[edit("if(!whNext.operational)return fail('warehouse-unavailable');",'',2,1)]],
    ['unissued','W07_conservation',[edit("unissued:ledger.unissued-(c.type==='CREATE'?batch.qty:0)",'unissued:ledger.unissued')]],
    ['result-not-copy','W07_copy',[edit('return copyData(result);','return result;')]],
    ['getter-input','W07_getters',[edit('try { c=copyData(input); }','try { c=input; }')]],
    ['load-cancel','W08_load',[edit("load=function(...args){end('load-entry-research-cancelled');return nativeLoad050.apply(this,args);};","load=function(...args){return nativeLoad050.apply(this,args);};")]],
    ['world-cancel','W08_world',[edit("newWorld=function(...args){end('new-world-entry-research-cancelled');return nativeNewWorld050.apply(this,args);};","newWorld=function(...args){return nativeNewWorld050.apply(this,args);};")]],
    ['pagehide','W08_pagehide',[edit("const hide=()=>end('pagehide-research-cancelled');","const hide=()=>{};")]],
    ['disable-immediate','W08_disable',[edit("disable(){window.__noShadowWarehouse050=true;return end('explicit-disable-research-cancelled');}","disable(){window.__noShadowWarehouse050=true;return {ok:true};}")]],
    ['kill-flag','W08_flag',[edit("if(window.__noShadowWarehouse050===true){end('feature-disabled-research-cancelled');return 'disabled';}",'')]],
    ['world-identity','W08_tiles',[edit("if(engine && world!==tiles){end('world-replaced-research-cancelled');return 'stale-world';}",'')]],
    ['end-reason-injection','W08_end',[edit("end:()=>end('explicit-research-cancelled'),selftest",'end,selftest')]],
    ['retry-empty-guard','W08_buttons',[edit("()=>{if(guard())return;const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_RETRY',q.batchId);}","()=>{const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_RETRY',q.batchId);}")]],
    ['cancel-empty-guard','W08_buttons',[edit("()=>{if(guard())return;const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_CANCEL',q.batchId);}","()=>{const q=engine?.snapshot().warehouse.waitingInbound[0];if(q)operation('WH_CANCEL',q.batchId);}")]],
    ['native-write','W09_isolation',[edit('const r=engine.command(input);','money+=1;const r=engine.command(input);')]],
    ['native-rng','W09_isolation',[edit('const r=engine.command(input);','R();const r=engine.command(input);')]],
    ['native-storage','W09_isolation',[edit('const r=engine.command(input);','void window.localStorage;const r=engine.command(input);')]],
    ['native-ensure','W09_isolation',[edit('const r=engine.command(input);','rebuildRailOps463();const r=engine.command(input);')]],
    ['dom-cleanup','W09_isolation',[edit('handlers=[];if(panel)try{panel.remove();}catch(_){}panel=null;view=null;','handlers=[];panel=null;view=null;')]],
    ['capacity-text','W10_vmButtons',[edit("view.capacity.textContent='容量：'+w.used","view.capacity.textContent='容量：'+0")]],
    ['inbound-button','W10_vmButtons',[edit("()=>operation('WH_IN','batch-A')","()=>operation('WH_IN','batch-B')")]],
    ['end-button','W10_vmButtons',[edit("()=>end('panel-ended-research-cancelled')",'()=>{}')]]
  ];
  for(const [name,id,edits]of mutations) {
    let broken=source;
    for(const e of edits){const parts=broken.split(e.from);assert.equal(parts.length-1,e.count,'W00 exact source mutation count '+name);assert.ok(e.occurrence<e.count,'W00 mutation occurrence');let n=-1;broken=broken.replaceAll(e.from,()=>++n===e.occurrence?e.to:e.from);}
    // Parsing failure is NOT accepted as a negative-control success.
    new vm.Script(broken);
    let red=null;try{run(id,broken);}catch(e){red=e;}
    assert.ok(red&&red.code==='ERR_ASSERTION'&&String(red.message).includes(id),'W00 mutant must reach named assertion '+name);
    const first=String(red.message).split('\n')[0];receipts.push({kind:'expected-red',name,guard:id,firstAssertion:first,edits:edits.map(e=>({from:e.from,to:e.to,occurrence:e.occurrence}))});
    console.log('WAREHOUSE050 EXPECTED_RED '+JSON.stringify({name,guard:id,firstAssertion:first,sourceHash:hash(broken),restoredHash:hash(source),edits:edits.map(e=>({from:e.from,to:e.to,occurrence:e.occurrence}))}));
    run(id,source);receipts.push({kind:'restored-green',name,guard:id});console.log('WAREHOUSE050 RESTORED_GREEN '+name+' '+id);
  }
  return {ok:true,guards:Object.keys(guards),mutants:mutations.map(([name,guard])=>({name,guard})),receipts,
    scope:'pure shipping-source and VM guards only; exact upstream compatibility, native Chrome, frames, legacy save, fingerprints and hardware remain separate evidence'};
};

(async()=>{
  runLineage050();
  runPureAndRuntimeTests({source,upstreamBlock,assert,vm});
  legacy('A-exact-upstream',upstreamBlock);
  legacy('B-derived-compatibility',compatibilityBlock);
  await browser();
  console.log('WAREHOUSE050 ALL_PASS '+JSON.stringify({head:process.env.GITHUB_SHA||null,nativeProductUnchanged:true,published:false}));
})().catch(e=>{console.error('WAREHOUSE050 FAIL',e.stack||e);process.exitCode=1;}).finally(()=>{
  for(const dir of roots)try{fs.rmSync(dir,{recursive:true,force:true});}catch(_){}
});

