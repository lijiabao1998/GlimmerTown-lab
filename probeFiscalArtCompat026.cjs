'use strict';
// CI-only compatibility fixtures. Temporary art/guard inputs are restored;
// nothing is committed, pushed, deployed, or accepted as a product baseline.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const {resolveChangeBase026}=require('./fiscalChangeBase026.cjs');
const ROOT=__dirname,CASES=['rebake','future-release','visible-art','source-scope'],CASE=process.argv.find(a=>a.startsWith('--case='))?.slice(7)||'all';
assert(CASE==='all'||CASES.includes(CASE),'known compatibility case');
if(CASE==='all'){
  const results=CASES.map(name=>{const r=cp.spawnSync(process.execPath,[__filename,'--case='+name],{cwd:ROOT,stdio:'inherit'});return{name,status:r.status};});
  const out=path.join(ROOT,'shots','fiscal026-compat');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({ok:results.every(r=>r.status===0),cases:results},null,2)+'\n');process.exit(results.every(r=>r.status===0)?0:1);
}
const OUT=path.join(ROOT,'shots','fiscal026-compat',CASE),ART='30de519db8cc6b8e67a8ca94925e947852d90c79',PRE_FIX='25df1adcc2f5c9822025797c593227d3d8a5f02b',PINNED_RELEASE='ad77b62dabc6f3074ceff3c679dc999371555001',PRE_FRAME_FIX='dd8b222ba29862497b3973124541217424625000',PRE_SOURCE_FIX='8da82b8f3545bfda2a2e5faebc007e6d28a79bff',PATCH_BASE='98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e';
const git=(args,options={})=>cp.execFileSync('git',args,{cwd:ROOT,maxBuffer:24*1024*1024,...options}),show=(sha,file)=>git(['show',sha+':'+file]);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),head=git(['rev-parse','HEAD']).toString().trim();
const GUARDS=['fp.js','harness.js','gallery.js'],FISCAL_DECLARATIONS=['function fiscalSave515(','function fiscalLoad515(','function fiscalDailySettlement515(','function fiscalCompletionSettlement515(','const FISCAL_CADENCE515='];
const files=['index.html','fp.json','style.json',...GUARDS,'british-wave01-art025.js','wave025-runtime.js','wave025.css','embed-wave025.cjs'];
const original=Object.fromEntries(files.map(f=>[f,fs.existsSync(path.join(ROOT,f))?fs.readFileSync(path.join(ROOT,f)):null]));
const report={head,case:CASE,fixture:'future-art working tree over an independent fiscal base',artSource:ART,checks:[],negative:[],failures:[]};
fs.mkdirSync(OUT,{recursive:true});
let futureWorktree;
function run(name,args,env=process.env,root=ROOT){const r=cp.spawnSync(process.execPath,args,{cwd:root,env:{...env,GITHUB_STEP_SUMMARY:''},encoding:'utf8',maxBuffer:24*1024*1024});const text=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(OUT,name+'.txt'),text);return{...r,text};}
function staticOnly(source,env,root=ROOT){const at=source.indexOf('\n(async()=>{');assert(at>0,'static prefix boundary');return run('static-'+report.negative.length,['-e',source.slice(0,at)+'\nstaticChecks();'],env,root);}
function commentFiscal026(source,keys=FISCAL_DECLARATIONS){
  for(const key of keys){const lines=source.split('\n');assert.equal(lines.filter(l=>l.startsWith(key)).length,1,'one fiscal comment fixture declaration');source=lines.map(l=>l.startsWith(key)?l+' // approved no-behavior source-scope fixture':l).join('\n');}
  return source;
}
function committedFuture026(base,candidate){
  const payload=Object.fromEntries(files.map(f=>[f,fs.readFileSync(path.join(ROOT,f))]));
  payload['index.html']=Buffer.from(commentFiscal026(candidate));
  for(const file of GUARDS)payload[file]=Buffer.concat([payload[file],Buffer.from('\n// approved committed source-scope fixture; no behavior change\n')]);
  const fixtureEnv={...process.env,GIT_INDEX_FILE:path.join(OUT,'future-head-index')};git(['read-tree',base],{env:fixtureEnv});
  for(const [file,bytes]of Object.entries(payload)){const sha=git(['hash-object','-w','--stdin'],{input:bytes}).toString().trim();git(['update-index','--add','--cacheinfo','100644,'+sha+','+file],{env:fixtureEnv});}
  const tree=git(['write-tree'],{env:fixtureEnv}).toString().trim();
  const sha=git(['-c','user.name=Fiscal compatibility fixture','-c','user.email=fiscal-ci@example.invalid','commit-tree',tree,'-p',base,'-m','Approved future fiscal and guard comments'],{env:{...process.env,GIT_AUTHOR_DATE:'2026-10-17T00:00:00Z',GIT_COMMITTER_DATE:'2026-10-17T00:00:00Z'}}).toString().trim();
  const root=path.join(OUT,'committed-future-head');git(['worktree','add','--detach',root,sha]);futureWorktree=root;
  assert.equal(cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sha,'real detached future HEAD');
  assert.equal(cp.execFileSync('git',['rev-parse','HEAD^'],{cwd:root,encoding:'utf8'}).trim(),base,'future HEAD is a real child of its change base');
  for(const f of GUARDS)assert(!payload[f].equals(show(base,f)),'committed future guard really differs from its base: '+f);
  report.committedFuture={sha,tree,parent:base,fiscalDeclarations:FISCAL_DECLARATIONS,guards:GUARDS,method:'real detached Git HEAD; comments only in fiscal/guard sources; exact approved art and baselines'};
  const proof=path.join(OUT,'committed-source-proof');fs.mkdirSync(path.join(proof,'base'),{recursive:true});fs.mkdirSync(path.join(proof,'head'),{recursive:true});
  for(const f of ['index.html',...GUARDS]){fs.writeFileSync(path.join(proof,'base',f),show(base,f));fs.writeFileSync(path.join(proof,'head',f),payload[f]);}
  fs.writeFileSync(path.join(proof,'commits.json'),JSON.stringify({base:{sha:base,raw:git(['cat-file','-p',base]).toString()},head:{sha,raw:git(['cat-file','-p',sha]).toString()}},null,2)+'\n');
  return{root,sha,payload};
}
function selectors(){
  const A='a'.repeat(40),B='b'.repeat(40),C='c'.repeat(40),calls=[];
  const stub=args=>{calls.push(args);if(args[0]==='merge-base')return C;if(args[0]==='cat-file')return'';if(args[0]==='rev-parse')return args[1].startsWith('HEAD^')?B:args[1].slice(0,40);throw Error('unexpected git fixture');};
  assert.deepEqual(resolveChangeBase026({env:{GITHUB_EVENT_NAME:'pull_request'},event:{pull_request:{base:{sha:A}},before:B},git:stub}),{sha:A,reason:'pull_request.base.sha'});
  assert.deepEqual(resolveChangeBase026({env:{GITHUB_EVENT_NAME:'push',GITHUB_REF:'refs/heads/main'},event:{before:B},git:stub}),{sha:B,reason:'main push before'});
  assert.deepEqual(resolveChangeBase026({env:{GITHUB_EVENT_NAME:'push',GITHUB_REF:'refs/heads/gpt/art'},event:{before:B},git:stub}),{sha:C,reason:'branch merge-base origin/main'});
  assert.deepEqual(resolveChangeBase026({env:{GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:'refs/heads/main'},event:{},git:stub}),{sha:B,reason:'main parent'});
  assert.throws(()=>resolveChangeBase026({env:{GITHUB_EVENT_NAME:'pull_request'},event:{},git:stub}),/PR change base must be supplied/);
  assert(calls.some(x=>x[0]==='cat-file'),'push base existence checked');report.checks.push('PR/push/main/branch base selection and missing-PR-base rejection');
}
try{
  selectors();
  for(const f of files.filter(f=>!['index.html',...GUARDS].includes(f)))fs.writeFileSync(path.join(ROOT,f),show(ART,f));
  const embed=run('embed-real-art',['embed-wave025.cjs']);assert.equal(embed.status,0,'original art embedding succeeds');
  assert(!fs.readFileSync(path.join(ROOT,'index.html')).equals(original['index.html']),'future art genuinely changes source');
  assert(!fs.readFileSync(path.join(ROOT,'fp.json')).equals(original['fp.json']),'legitimate rebake genuinely changes fp.json');
  assert(!fs.readFileSync(path.join(ROOT,'style.json')).equals(original['style.json']),'legitimate rebake genuinely changes style.json');
  const validFp=fs.readFileSync(path.join(ROOT,'fp.json')),validStyle=fs.readFileSync(path.join(ROOT,'style.json'));
  const oldFailure=staticOnly(show(PRE_FIX,'probeFiscalLoad026.cjs').toString(),process.env);
  assert.equal(oldFailure.status,1);assert(oldFailure.text.includes('fp.json unchanged'),'P1 reproduces at the frozen-baseline guard');assert(!/ReferenceError/.test(oldFailure.text));
  report.negative.push({name:'old fiscal CI rejects a legitimate art rebake',first:'fp.json unchanged'});

  // Model an already reviewed harmless guard edit on the independent base.
  // Use a separate index to create local fixture objects; never move a ref.
  const guard=Buffer.concat([original['fp.js'],Buffer.from('\n// approved synthetic base comment for contextual guard audit\n')]);
  fs.writeFileSync(path.join(ROOT,'fp.js'),guard);
  const fixtureEnv={...process.env,GIT_INDEX_FILE:path.join(OUT,'base-index')};git(['read-tree',head],{env:fixtureEnv});
  const guardBlob=git(['hash-object','-w','--stdin'],{input:guard}).toString().trim();git(['update-index','--add','--cacheinfo','100644,'+guardBlob+',fp.js'],{env:fixtureEnv});
  const tree=git(['write-tree'],{env:fixtureEnv}).toString().trim(),base=git(['-c','user.name=Fiscal compatibility fixture','-c','user.email=fiscal-ci@example.invalid','commit-tree',tree,'-p',head,'-m','Synthetic independent guard-comment base'],{env:{...process.env,GIT_AUTHOR_DATE:'2026-10-16T00:00:00Z',GIT_COMMITTER_DATE:'2026-10-16T00:00:00Z'}}).toString().trim();
  report.independentBase={sha:base,tree,parent:head,guardDiffersFromHistorical:true};
  const eventPath=path.join(OUT,'future-pr-event.json');fs.writeFileSync(eventPath,JSON.stringify({pull_request:{base:{sha:base}},compatibilityFixture:true}));
  const env={...process.env,GITHUB_EVENT_NAME:'pull_request',GITHUB_EVENT_PATH:eventPath};
  // A future committed HEAD may intentionally differ from the independent base.
  // Extra working-tree edits must still fail the source-integrity guard.
  fs.writeFileSync(path.join(ROOT,'fp.js'),original['fp.js']);
  fs.appendFileSync(path.join(ROOT,'fp.js'),'\n// unexpected working-tree guard change\n');
  const guardFailure=staticOnly(fs.readFileSync(path.join(ROOT,'probeFiscalLoad026.cjs'),'utf8'),env);
  assert.equal(guardFailure.status,1);assert(guardFailure.text.includes('fp.js unchanged relative to committed HEAD'),'changed guard still rejected');assert(!/ReferenceError/.test(guardFailure.text));
  report.negative.push({name:'unexpected guard edit after the independent base',first:'fp.js unchanged relative to committed HEAD'});fs.writeFileSync(path.join(ROOT,'fp.js'),original['fp.js']);

  const currentIndex=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');let candidate=currentIndex,probeRoot=ROOT,probeEnv=env;
  if(CASE==='future-release'){
    for(const [before,after] of [["const GAME_VER='14.44';","const GAME_VER='14.45';"],["const GAME_ANCHOR='T751';","const GAME_ANCHOR='T752';"],['id="startVersion456">v14.44 · T751</span>','id="startVersion456">v14.45 · T752</span>']]){assert.equal(candidate.split(before).length,2,'unique next-release metadata fixture');candidate=candidate.replace(before,after);}
    fs.writeFileSync(path.join(ROOT,'index.html'),candidate);
    const pinnedFailure=staticOnly(show(PINNED_RELEASE,'probeFiscalLoad026.cjs').toString(),env);
    assert.equal(pinnedFailure.status,1);assert(pinnedFailure.text.includes('exact declared build metadata'),'version freeze reproduces at the pinned metadata guard');
    report.negative.push({name:'previous fiscal guard rejects legitimate next-release metadata',first:'exact declared build metadata'});
  }
  if(CASE==='source-scope'){
    const currentProbe=fs.readFileSync(path.join(ROOT,'probeFiscalLoad026.cjs'),'utf8'),patchEvent=path.join(OUT,'T751-patch-event.json');
    fs.writeFileSync(patchEvent,JSON.stringify({pull_request:{base:{sha:PATCH_BASE}},compatibilityFixture:true}));
    const patchEnv={...env,GITHUB_EVENT_PATH:patchEvent};
    fs.writeFileSync(path.join(ROOT,'index.html'),commentFiscal026(currentIndex,[FISCAL_DECLARATIONS[0]]));
    try{const red=staticOnly(currentProbe,patchEnv);assert.equal(red.status,1);assert(red.text.includes('function fiscalSave515( byte-identical relative to the change base'));assert(!/ReferenceError/.test(red.text));report.negative.push({name:'T751 still rejects a changed fiscal declaration',first:'function fiscalSave515( byte-identical relative to the change base'});}
    finally{fs.writeFileSync(path.join(ROOT,'index.html'),currentIndex);}
    fs.appendFileSync(path.join(ROOT,'fp.js'),'\n// unexpected T751 guard edit\n');
    try{const red=staticOnly(currentProbe,patchEnv);assert.equal(red.status,1);assert(red.text.includes('fp.js unchanged relative to the change base'));assert(!/ReferenceError/.test(red.text));report.negative.push({name:'T751 still rejects a changed shared guard',first:'fp.js unchanged relative to the change base'});}
    finally{fs.writeFileSync(path.join(ROOT,'fp.js'),original['fp.js']);}
    const future=committedFuture026(base,currentIndex);probeRoot=future.root;probeEnv={...env,GITHUB_SHA:future.sha};
    const previous=show(PRE_SOURCE_FIX,'probeFiscalLoad026.cjs').toString();
    const frozenFiscal=staticOnly(previous,probeEnv,probeRoot);assert.equal(frozenFiscal.status,1);assert(frozenFiscal.text.includes('function fiscalSave515( byte-identical relative to the change base'));assert(!/ReferenceError/.test(frozenFiscal.text));
    report.negative.push({name:'previous guard rejects a legitimate committed fiscal comment',first:'function fiscalSave515( byte-identical relative to the change base'});
    fs.writeFileSync(path.join(probeRoot,'index.html'),currentIndex);
    try{const red=staticOnly(previous,probeEnv,probeRoot);assert.equal(red.status,1);assert(red.text.includes('fp.js unchanged relative to the change base'));assert(!/ReferenceError/.test(red.text));report.negative.push({name:'previous guard rejects legitimate committed shared-guard comments',first:'fp.js unchanged relative to the change base'});}
    finally{fs.writeFileSync(path.join(probeRoot,'index.html'),future.payload['index.html']);}
    fs.appendFileSync(path.join(probeRoot,'fp.js'),'\n// unexpected edit after the committed future HEAD\n');
    try{const red=staticOnly(currentProbe,probeEnv,probeRoot);assert.equal(red.status,1);assert(red.text.includes('fp.js unchanged relative to committed HEAD'));assert(!/ReferenceError/.test(red.text));report.negative.push({name:'future HEAD still rejects an uncommitted shared-guard edit',first:'fp.js unchanged relative to committed HEAD'});}
    finally{fs.writeFileSync(path.join(probeRoot,'fp.js'),future.payload['fp.js']);}
    fs.writeFileSync(path.join(probeRoot,'index.html'),commentFiscal026(future.payload['index.html'].toString(),[FISCAL_DECLARATIONS[0]]));
    try{const red=staticOnly(currentProbe,probeEnv,probeRoot);assert.equal(red.status,1);assert(red.text.includes('function fiscalSave515( byte-identical relative to committed HEAD'));assert(!/ReferenceError/.test(red.text));report.negative.push({name:'future HEAD still rejects an uncommitted fiscal declaration edit',first:'function fiscalSave515( byte-identical relative to committed HEAD'});}
    finally{fs.writeFileSync(path.join(probeRoot,'index.html'),future.payload['index.html']);}
  }
  if(CASE==='visible-art'){
    const anchor='Object.assign(window.GV,{art574:';assert.equal(candidate.split(anchor).length,2,'unique visible-art native renderer anchor');
    const appearance='const __visibleDraw026=vdraw574;vdraw574=function(o,b){return b&&b.k===24&&!b.ref&&b.v===2?168+viewRotEff():__visibleDraw026(o,b);};\n';
    candidate=candidate.replace(anchor,appearance+anchor);fs.writeFileSync(path.join(ROOT,'index.html'),candidate);
    report.visibleArt={savedKind:24,savedVariant:2,approvedAppearance:'tattershall',nativeViews:[168,169,170,171],method:'native renderer selection; no saved data or canvas pixels rewritten'};
    // The exact old probe requires the synthetic base's guard bytes. Preserve
    // that historical fixture while the new probe audits its committed HEAD.
    let oldFrames;fs.writeFileSync(path.join(ROOT,'fp.js'),guard);
    try{oldFrames=run('old-frozen-frame-native',['-e',show(PRE_FRAME_FIX,'probeFiscalLoad026.cjs').toString()],env);}
    finally{fs.writeFileSync(path.join(ROOT,'fp.js'),original['fp.js']);}
    assert.equal(oldFrames.status,1,'previous permanent frame guard must reject the genuinely visible art change');
    const oldReport=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','fiscal026','report.json'),'utf8'));
    assert(oldReport.failures.length>0);assert(oldReport.failures.every(f=>f.name.startsWith('complete native frame ')&&f.message.startsWith('full frame head')),'the old guard must reject only intended complete-frame changes');assert.equal(oldReport.negative.length,8,'all original saved-state negative controls still pass');
    report.negative.push({name:'previous permanent guard rejects approved visible art',first:oldReport.failures[0],frameFailures:oldReport.failures.length});
    fs.cpSync(path.join(ROOT,'shots','fiscal026'),path.join(OUT,'old-frozen-frame-native'),{recursive:true});
  }
  const positive=run(CASE+'-full-native',['probeFiscalLoad026.cjs'],probeEnv,probeRoot);assert.equal(positive.status,0,'legitimate '+CASE+' passes the complete fiscal guard');
  const result=JSON.parse(fs.readFileSync(path.join(probeRoot,'shots','fiscal026','report.json'),'utf8'));assert.equal(result.ok,true);assert.equal(result.checks.length,52);assert.equal(result.negative.length,9);assert.equal(result.changeBase.sha,base);assert.equal(result.frameScope.historicalBaseEquality,false);
  assert.equal(result.sourceScope.mode,'committed HEAD integrity');if(CASE==='source-scope')assert.equal(result.sourceScope.revision,report.committedFuture.sha);
  const changed=result.frames.filter(f=>f.file.startsWith('head-')&&!f.equalChangeBase);if(CASE==='visible-art')assert(changed.length>0,'approved native art must actually change a complete fixture view');
  assert.deepEqual(result.release,CASE==='future-release'?{gameVer:'14.45',anchor:'T752'}:{gameVer:'14.44',anchor:'T751'});
  report.checks.push({name:'legitimate '+CASE+' with real approved art',fiscalChecks:result.checks.length,negative:result.negative.length,changeBase:result.changeBase,release:result.release,visibleChangedFrames:changed.length});
  report.futureSources={index:hash(fs.readFileSync(path.join(probeRoot,'index.html'))),fp:hash(validFp),style:hash(validStyle),guards:Object.fromEntries(GUARDS.map(f=>[f,hash(fs.readFileSync(path.join(probeRoot,f)))]))};
  fs.cpSync(path.join(probeRoot,'shots','fiscal026'),path.join(OUT,'current-full-native'),{recursive:true});
  const bad=JSON.parse(validFp),leaf=Object.keys(bad.subs).find(k=>k==='bld.24_1_160');assert(leaf,'actual new-art leaf exists');bad.subs[leaf].d=(bad.subs[leaf].d[0]==='0'?'1':'0')+bad.subs[leaf].d.slice(1);fs.writeFileSync(path.join(ROOT,'fp.json'),JSON.stringify(bad));
  const badFp=run('invalid-fp',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'invalid-fp-check')],env);assert.equal(badFp.status,1);assert(badFp.text.includes('FISCAL_FP_RED fingerprint leaf mismatch: '+leaf+'.d'),'isolated invalid leaf must fail the combined renderer/leaf guard');report.negative.push({name:'incorrect new-art pixel CRC',first:badFp.text.split('\n').find(l=>l.startsWith('FISCAL_FP_RED')),leaf});fs.writeFileSync(path.join(ROOT,'fp.json'),validFp);
  const style=JSON.parse(validStyle);style.families.bld.axes.palette-=.01;fs.writeFileSync(path.join(ROOT,'style.json'),JSON.stringify(style));
  const badStyle=run('invalid-style',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'invalid-style-check')],env);assert.equal(badStyle.status,1);assert(badStyle.text.includes('style.json 與這次算出的不同：bld'),'forged style must fail the existing style guard');report.negative.push({name:'forged new-art style score',first:'style.json 與這次算出的不同：bld'});fs.writeFileSync(path.join(ROOT,'style.json'),validStyle);
  const restored=run('restored-real-art',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'restored-fp-check')],env);assert.equal(restored.status,0,'restored legitimate art baselines GREEN');report.checks.push('restored legitimate fingerprint/style baselines GREEN');
}catch(e){report.failures.push(e.stack);console.error(e.stack);const file=path.join(ROOT,'shots','fiscal026','report.json');if(fs.existsSync(file)){const native=JSON.parse(fs.readFileSync(file,'utf8'));console.error('NATIVE_CASE_REPORT '+JSON.stringify({ok:native.ok,failures:native.failures,checks:native.checks.length,negative:native.negative.length}));}}
finally{
  if(futureWorktree){try{git(['worktree','remove','--force',futureWorktree]);report.futureWorktreeRemoved=!fs.existsSync(futureWorktree);}catch(e){report.failures.push('future fixture cleanup: '+e.message);}}
  for(const [f,b] of Object.entries(original))if(b===null)fs.rmSync(path.join(ROOT,f),{force:true});else fs.writeFileSync(path.join(ROOT,f),b);
  report.restored=files.every(f=>original[f]===null?!fs.existsSync(path.join(ROOT,f)):fs.readFileSync(path.join(ROOT,f)).equals(original[f]))&&(!futureWorktree||report.futureWorktreeRemoved===true);
  if(!report.restored)report.failures.push('compatibility inputs were not restored');
  report.ok=report.failures.length===0;fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('FISCAL_ART_COMPAT026 '+JSON.stringify(report));
}
process.exitCode=report.ok?0:1;
