'use strict';
// Actual game/Chrome work belongs to Actions. This program deliberately tests
// nine existing candidates and reports complete ten-model acceptance as pending.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('partial038 native integration runs on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const {withGame,ROOT}=require('./harness.js'),{compose,strip}=require('./wave038-source.cjs'),partialChecks=require('./partialNineChecks038.cjs'),partialPairs=require('./partialNinePairs038.cjs');
const BASE='3e33523305401ea258e24204ea7218345a6dc268',index=path.join(ROOT,'index.html'),OUT=path.join(ROOT,'shots','wave038','partial-native'),head=fs.readFileSync(index),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024});assert(head.equals(original),'partial038 committed source is still independent BASE');
const files=['british-wave10-art038.js','wave038-runtime.js','wave038.css','wave038-nine-fixture.js','partialNineChecks038.cjs','partialNinePairs038.cjs','probePartialNative038.cjs','wave038-source.cjs','docs/branch/GPT-038-reviewed-f53009d-image-index.json'];
const sourceFiles=files.map(file=>{const b=fs.readFileSync(file),committed=cp.execFileSync('git',['show','HEAD:'+file],{maxBuffer:1024*1024});assert(b.equals(committed),'partial038 exact committed source '+file);return{file,bytes:b.length,sha256:hash(b),gitBlob:cp.execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim()};});
const fixture=Buffer.from(compose(head.toString(),{art:fs.readFileSync(files[0],'utf8'),runtime:fs.readFileSync(files[1],'utf8'),css:fs.readFileSync(files[2],'utf8')},fs.readFileSync(files[3],'utf8')));
assert.equal(strip(fixture.toString(),true),original.toString(),'partial038 exact three-block and unique fixture-tail boundary');
const fixed=[['leedsCorn',520],['darlington',524],['halifax',528],['bishoplloyd',532],['burlington',536],['harrods',544],['liberty',548],['danum',552],['willow',556]],gold=JSON.parse(fs.readFileSync('docs/branch/GPT-038-reviewed-f53009d-image-index.json'));
assert.equal(gold.artSourceSHA256,sourceFiles[0].sha256,'partial038 unchanged independently reviewed art');
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
function compare(a,b,allowed=new Map(),label='partial038 complete state'){
  const changed=[];function walk(x,y,p=''){
    if(JSON.stringify(canon(x))===JSON.stringify(canon(y)))return;
    if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p?p+'.'+k:k);return;}
    if(allowed.has(p)){assert(Number.isInteger(x)&&x>=0&&x<=2,label+' independent native variant '+p);assert.equal(y,allowed.get(p),label+' exact authored variant '+p);changed.push({path:p,base:x,head:y});return;}
    throw Error(label+' differs at '+p+': '+JSON.stringify(x)+' -> '+JSON.stringify(y));
  }walk(a,b);return changed;
}
function permittedVariants(state,lots,values){const m=new Map();for(let i=0;i<lots.length;i++){const root=lots[i].y*state.n+lots[i].x,at=state.bl.findIndex(q=>q[0]===root);assert(at>=0&&state.bl[at][1]===24,'partial038 independently located native root');m.set('bl.'+at+'.3',values[i]);}return m;}
function transfer(name,b){console.log('WAVE038_PARTIAL_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE038_PARTIAL_DATA '+s.slice(i,i+4096));console.log('WAVE038_PARTIAL_END '+name);}
fs.mkdirSync(OUT,{recursive:true});const evidence=[];
function write(name,b,send=false){fs.writeFileSync(path.join(OUT,name),b);const m={name,bytes:b.length,sha256:hash(b)};evidence.push(m);if(send)transfer(name,b);return m;}
function json(name,x,send=false){return write(name,Buffer.from(JSON.stringify(x,null,2)+'\n'),send);}
function png(name,url,send=false){return write(name,Buffer.from(url.split(',')[1],'base64'),send);}
const opt={port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log};
function frames038(lots,near=false){
  GV.setSpeed(0);GV.selectTool434('pan');const game=document.getElementById('game');game.dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));window.__waterF695=0;
  for(const p of lots)GV.testAge635(p.x,p.y,2,2,30);
  const at=[lots.reduce((n,p)=>n+p.x+.5,0)/lots.length,lots.reduce((n,p)=>n+p.y+.5,0)/lots.length],out=[];
  const specs=[];for(const night of[false,true])for(let rot=0;rot<4;rot++)specs.push({name:(night?'night':'day')+'-r'+rot,night,rot,at,z:1});
  if(near)for(let i=0;i<lots.length;i++)specs.push({name:'near-native-'+i,night:false,rot:0,at:[lots[i].x+.5,lots[i].y+.5],z:2});
  for(const s of specs){GV.britishWeather004(1,0,0);GV.setRot(s.rot);GV.art574.zoom574(s.z);GV.lookAt(...s.at);const t=GV.art574.cycle574()*(s.night?.02:.5);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();out.push({...s,w:game.width,h:game.height,data:game.toDataURL('image/png')});}
  return out;
}
function loadOld038(raw){
  delete window.__noBritishWave038;const key='glimmerville.v1.s3.sandbox516b';localStorage.setItem(key,raw);const states=[];
  for(let i=0;i<2;i++){if(!GV.load())throw Error('partial038 old native load');GV.save();states.push(JSON.parse(GV.rawSave()));}
  if(GV.britishWave038.selection()!==null)throw Error('partial038 load clears selected appearance');return states;
}
function saveFault038(){
  const cash=GV.devMoney516B();GV.save();const before=JSON.parse(GV.rawSave());GV.capabilitySetMoney506(cash-1);GV.save();const damaged=JSON.parse(GV.rawSave());GV.capabilitySetMoney506(cash);GV.save();return{before,damaged,restored:JSON.parse(GV.rawSave())};
}
async function session(source,fn){fs.writeFileSync(index,source);const r=await withGame(opt,async({cdp})=>{const out=await fn(cdp);assert.equal(cdp.errors.length,0,cdp.errors.join('; '));return out;});assert(r.ok&&r.result,'partial038 actual native Chrome session: '+r.fails.join('; '));return r.result;}
(async()=>{
  const report={head:process.env.GITHUB_SHA,base:BASE,scope:'nine native candidates only; complete ten-model guard remains blocked',committedIndexSHA256:hash(head),fixtureIndexSHA256:hash(fixture),fixtureIsCommittedHEADIndex:false,sourceFiles,fieldExclusions:[],nativeGameTests:true,fullWaveAcceptance:false,notClaimed:['complete ten-model installation','all twelve full-wave native first-RED controls','complete97-state/113PNG scenes','full17 pedestrian cases','full40-group performance','physical mobile/Safari/touch','release or deployment']};
  write('index-partial-nine.html',fixture);write('index-partial-nine.html.gz',zlib.gzipSync(fixture,{level:9,mtime:0}),true);json('source-provenance.json',{head:process.env.GITHUB_SHA,committedIndexSHA256:hash(head),fixtureIndexSHA256:hash(fixture),fixtureBytes:fixture.length,sourceFiles,generatedOnlyOnCI:true,stripByteEqualBase:true});
  try{
    const baseline=await session(original,async cdp=>{const pairs=await cdp.evalJs('('+partialPairs.toString()+')(false)'),frames=await cdp.evalJs('('+frames038.toString()+')('+JSON.stringify(pairs.nineTransactions.lots)+',false)');json('base-complete-native-states.json',pairs);return{pairs,frames};});
    const next=await session(fixture,async cdp=>{
      const pairs=await cdp.evalJs('('+partialPairs.toString()+')(true)');json('head-complete-native-states.json',pairs);
      const a=baseline.pairs,b=pairs;report.normalPairs=[];
    for(let i=0;i<3;i++){
      assert.equal(a.pairs[i].seed,b.pairs[i].seed);assert.deepEqual(a.pairs[i].placements.map(p=>[p.x,p.y,p.spent]),b.pairs[i].placements.map(p=>[p.x,p.y,p.spent]));
      const changes=[];for(let j=0;j<3;j++){const x=a.pairs[i].checkpoints[j],y=b.pairs[i].checkpoints[j];compare(x.stats,y.stats,new Map(),'partial038 complete normal stats');changes.push(compare(x.state,y.state,permittedVariants(x.state,a.pairs[i].placements,[520,532,544])));}
      report.normalPairs.push({seed:a.pairs[i].seed,checkpoints:3,fullSerializeAndStats:true,changes});
    }
    const baseNine=a.nineTransactions,headNine=b.nineTransactions;assert.equal(baseNine.lots.length,9);assert.deepEqual(baseNine.lots,headNine.lots);report.nineTransactions={forms:9,actualCatalogClicks:9,paid2000UndoRedoAndReferenceDemolition:true,fieldExclusions:[],changes:{}};
    for(const k of['preUpdate','afterStep','initialized'])report.nineTransactions.changes[k]=compare(baseNine[k],headNine[k],permittedVariants(baseNine[k],baseNine.lots,fixed.map(q=>q[1])));
    for(let i=0;i<2;i++){compare(baseNine.initialized,baseNine.loaded[i]);compare(headNine.initialized,headNine.loaded[i]);compare(baseNine.loaded[i],headNine.loaded[i],permittedVariants(baseNine.loaded[i],baseNine.lots,fixed.map(q=>q[1])));}
    for(const k of['input','output'])compare(a.bootstrap[k],b.bootstrap[k],permittedVariants(a.bootstrap[k],a.pairs[0].placements,[520,532,544]));report.bootstrapAllFieldsCompared=true;report.twoNewAndBaseLoadSaveCycles=true;
    report.normalSaveNegatives=[];for(const control of b.controls){let first='';try{compare(control.original,control.damaged,new Map(),'partial038 normal save');}catch(e){first=e.message;}assert(first.startsWith('partial038 normal save differs at money'),'partial038 seeded real dollar first RED');compare(control.original,control.restored);report.normalSaveNegatives.push({seed:control.seed,first,restored:true});}
      const nativeFrames=await cdp.evalJs('('+frames038.toString()+')('+JSON.stringify(headNine.lots)+',true)');for(const f of nativeFrames)png('native-'+f.name+'.png',f.data,f.name.startsWith('near-native-')||f.name==='day-r0'||f.name==='night-r0');
      const loaded=await cdp.evalJs('('+loadOld038.toString()+')('+JSON.stringify(JSON.stringify(baseNine.initialized))+')');for(let i=0;i<2;i++)compare(baseNine.loaded[i],loaded[i]);report.twoOldSaveCyclesAllFieldsEqual=true;
      await cdp.evalJs('window.__noBritishWave038=true');const valve=await cdp.evalJs('('+frames038.toString()+')('+JSON.stringify(baseNine.lots)+',false)');report.wholeFrames=[];
      for(let i=0;i<8;i++){const x=Buffer.from(baseline.frames[i].data.split(',')[1],'base64'),y=Buffer.from(valve[i].data.split(',')[1],'base64');assert(x.equals(y),'partial038 whole BASE/valve frame '+valve[i].name);png('base-'+valve[i].name+'.png',baseline.frames[i].data);png('valve-'+valve[i].name+'.png',valve[i].data);report.wholeFrames.push({name:valve[i].name,w:valve[i].w,h:valve[i].h,sha256:hash(y),byteEqual:true});}
      const corrupt=await cdp.evalJs('(()=>{const c=document.getElementById("game"),g=c.getContext("2d"),d=g.getImageData(0,0,1,1);d.data[0]^=255;g.putImageData(d,0,0);return c.toDataURL("image/png");})()');let first='';try{assert(Buffer.from(corrupt.split(',')[1],'base64').equals(Buffer.from(valve.at(-1).data.split(',')[1],'base64')),'partial038 whole canvas mismatch');}catch(e){first=e.message.split('\n')[0];}assert(first==='partial038 whole canvas mismatch');report.canvasNegative={first,actualOnePixel:true};
      const restored=await cdp.evalJs('('+frames038.toString()+')('+JSON.stringify(baseNine.lots)+',false)');assert.equal(restored.at(-1).data,valve.at(-1).data,'partial038 whole canvas restored');
      await cdp.evalJs('delete window.__noBritishWave038');const f=await cdp.evalJs('('+saveFault038.toString()+')()');first='';try{compare(f.before,f.damaged,new Map(),'partial038 complete save');}catch(e){first=e.message;}assert(first.startsWith('partial038 complete save differs at money'),'partial038 real dollar fault first RED: '+first);compare(f.before,f.restored);report.saveNegative={first,actualDollar:true,restored:true};
      const checks=await cdp.evalJs('('+partialChecks.toString()+')()');json('partial-checks-after-normal-model.json',{...checks,images:checks.images.map(({name})=>({name}))});
      const golden=new Map(gold.files.map(f=>[f.name,f]));for(const im of checks.images){const b=Buffer.from(im.data.split(',')[1],'base64'),expected=golden.get(im.name);assert(expected&&expected.bytes===b.length&&expected.sha256===hash(b),'partial038 actual installed pixels match reviewed f53009d '+im.name);write('installed-'+im.name,b);}
      report.installed72OriginalsMatchReviewed=true;checks.images=checks.images.map(({name})=>({name}));report.checks=checks;
      await cdp.evalJs('GV.britishWave038.open()');const desktop=await cdp.send('Page.captureScreenshot',{format:'png'});write('catalog-nine-desktop.png',Buffer.from(desktop.data,'base64'),true);
      await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await cdp.evalJs('GV.britishWave038.close();GV.britishWave038.open()');
      const responsive=await cdp.evalJs('(()=>{const d=document.getElementById("waveDialog038"),g=document.getElementById("waveGrid038"),b=d.getBoundingClientRect();return{width:innerWidth,dialogWidth:b.width,gridColumns:getComputedStyle(g).gridTemplateColumns,articleCount:g.children.length,silverDisabled:document.querySelector("[data-wave038=silver]").disabled,overflow:d.scrollWidth>d.clientWidth+1};})()');assert(responsive.dialogWidth<=390&&!responsive.overflow&&responsive.articleCount===10&&responsive.silverDisabled,'partial038 responsive catalog390');const narrow=await cdp.send('Page.captureScreenshot',{format:'png'});write('catalog-nine-responsive390.png',Buffer.from(narrow.data,'base64'),true);return{nativeFrames:nativeFrames.map(({data,...x})=>x),responsive};
    });Object.assign(report,next);report.committedIndexRestored=true;report.files=evidence;json('manifest-partial038.json',report,true);
    console.log('WAVE038_PARTIAL '+JSON.stringify({head:report.head,models:9,installedLeaves:36,fullTenSelftestBlocked:true,normalSeeds:3,ninePaidUndoRedoForms:9,twoNewAndOldSaveCycles:true,installed72PNGMatchReviewed:true,wholeBaseValveFrames:8,fullWaveAcceptance:false}));
  }finally{fs.writeFileSync(index,head);assert(fs.readFileSync(index).equals(head),'partial038 restore exact committed source');}
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'partial-error.txt'),e.stack+'\n');console.error(e.stack);process.exitCode=1;});
