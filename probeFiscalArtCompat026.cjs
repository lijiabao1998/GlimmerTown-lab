'use strict';
// CI-only compatibility fixtures. Temporary art/guard inputs are restored;
// nothing is committed, pushed, deployed, or accepted as a product baseline.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const {resolveChangeBase026}=require('./fiscalChangeBase026.cjs');
const ROOT=__dirname,OUT=path.join(ROOT,'shots','fiscal026-compat'),ART='30de519db8cc6b8e67a8ca94925e947852d90c79',PRE_FIX='25df1adcc2f5c9822025797c593227d3d8a5f02b',PINNED_RELEASE='ad77b62dabc6f3074ceff3c679dc999371555001';
const git=(args,options={})=>cp.execFileSync('git',args,{cwd:ROOT,maxBuffer:24*1024*1024,...options}),show=(sha,file)=>git(['show',sha+':'+file]);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),head=git(['rev-parse','HEAD']).toString().trim();
const files=['index.html','fp.json','style.json','fp.js','british-wave01-art025.js','wave025-runtime.js','wave025.css','embed-wave025.cjs'];
const original=Object.fromEntries(files.map(f=>[f,fs.existsSync(path.join(ROOT,f))?fs.readFileSync(path.join(ROOT,f)):null]));
const report={head,fixture:'future-art working tree over an independent fiscal base',artSource:ART,checks:[],negative:[],failures:[]};
fs.mkdirSync(OUT,{recursive:true});
function run(name,args,env=process.env){const r=cp.spawnSync(process.execPath,args,{cwd:ROOT,env:{...env,GITHUB_STEP_SUMMARY:''},encoding:'utf8',maxBuffer:24*1024*1024});const text=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(OUT,name+'.txt'),text);return{...r,text};}
function staticOnly(source,env){const at=source.indexOf('\n(async()=>{');assert(at>0,'static prefix boundary');return run('static-'+report.negative.length,['-e',source.slice(0,at)+'\nstaticChecks();'],env);}
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
  for(const f of files.filter(f=>!['index.html','fp.js'].includes(f)))fs.writeFileSync(path.join(ROOT,f),show(ART,f));
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
  fs.appendFileSync(path.join(ROOT,'fp.js'),'\n// unexpected working-tree guard change\n');
  const guardFailure=staticOnly(fs.readFileSync(path.join(ROOT,'probeFiscalLoad026.cjs'),'utf8'),env);
  assert.equal(guardFailure.status,1);assert(guardFailure.text.includes('fp.js unchanged relative to the change base'),'changed guard still rejected');assert(!/ReferenceError/.test(guardFailure.text));
  report.negative.push({name:'unexpected guard edit after the independent base',first:'fp.js unchanged relative to the change base'});fs.writeFileSync(path.join(ROOT,'fp.js'),guard);

  const positive=run('future-art-full-native',['probeFiscalLoad026.cjs'],env);assert.equal(positive.status,0,'legitimate art rebake passes the complete fiscal guard');
  const result=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','fiscal026','report.json'),'utf8'));assert.equal(result.ok,true);assert.equal(result.checks.length,42);assert.equal(result.negative.length,8);assert.equal(result.changeBase.sha,base);
  report.checks.push({name:'legitimate real art and rebaked baselines',fiscalChecks:result.checks.length,negative:result.negative.length,changeBase:result.changeBase});
  report.futureSources={index:hash(fs.readFileSync(path.join(ROOT,'index.html'))),fp:hash(validFp),style:hash(validStyle),guard:hash(guard)};
  fs.cpSync(path.join(ROOT,'shots','fiscal026'),path.join(OUT,'future-art-native'),{recursive:true});
  // A subsequent legitimate main-writer release also changes build metadata.
  // This source variant is CI-only and is restored before the remaining checks.
  const currentIndex=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');let nextIndex=currentIndex;
  for(const [before,after] of [["const GAME_VER='14.44';","const GAME_VER='14.45';"],["const GAME_ANCHOR='T751';","const GAME_ANCHOR='T752';"],['id="startVersion456">v14.44 · T751</span>','id="startVersion456">v14.45 · T752</span>']]){assert.equal(nextIndex.split(before).length,2,'unique next-release metadata fixture');nextIndex=nextIndex.replace(before,after);}
  fs.writeFileSync(path.join(ROOT,'index.html'),nextIndex);
  const pinnedFailure=staticOnly(show(PINNED_RELEASE,'probeFiscalLoad026.cjs').toString(),env);
  assert.equal(pinnedFailure.status,1);assert(pinnedFailure.text.includes('exact declared build metadata'),'version freeze reproduces at the pinned metadata guard');
  report.negative.push({name:'previous fiscal guard rejects legitimate next-release metadata',first:'exact declared build metadata'});
  const futureRelease=run('future-release-full-native',['probeFiscalLoad026.cjs'],env);assert.equal(futureRelease.status,0,'legitimate next-release writer metadata passes complete fiscal guard');
  const nextResult=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','fiscal026','report.json'),'utf8'));assert.equal(nextResult.ok,true);assert.equal(nextResult.checks.length,42);assert.equal(nextResult.negative.length,8);assert.deepEqual(nextResult.release,{gameVer:'14.45',anchor:'T752'});
  report.checks.push({name:'legitimate next-release metadata with real art',fiscalChecks:nextResult.checks.length,negative:nextResult.negative.length,release:nextResult.release});
  fs.cpSync(path.join(ROOT,'shots','fiscal026'),path.join(OUT,'future-release-native'),{recursive:true});fs.writeFileSync(path.join(ROOT,'index.html'),currentIndex);
  const bad=JSON.parse(validFp),leaf=Object.keys(bad.subs).find(k=>k==='bld.24_1_160');assert(leaf,'actual new-art leaf exists');bad.subs[leaf].d=(bad.subs[leaf].d[0]==='0'?'1':'0')+bad.subs[leaf].d.slice(1);fs.writeFileSync(path.join(ROOT,'fp.json'),JSON.stringify(bad));
  const badFp=run('invalid-fp',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'invalid-fp-check')],env);assert.equal(badFp.status,1);assert(badFp.text.includes('FISCAL_FP_RED fingerprint leaf mismatch: '+leaf+'.d'),'isolated invalid leaf must fail the combined renderer/leaf guard');report.negative.push({name:'incorrect new-art pixel CRC',first:badFp.text.split('\n').find(l=>l.startsWith('FISCAL_FP_RED')),leaf});fs.writeFileSync(path.join(ROOT,'fp.json'),validFp);
  const style=JSON.parse(validStyle);style.families.bld.axes.palette-=.01;fs.writeFileSync(path.join(ROOT,'style.json'),JSON.stringify(style));
  const badStyle=run('invalid-style',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'invalid-style-check')],env);assert.equal(badStyle.status,1);assert(badStyle.text.includes('style.json 與這次算出的不同：bld'),'forged style must fail the existing style guard');report.negative.push({name:'forged new-art style score',first:'style.json 與這次算出的不同：bld'});fs.writeFileSync(path.join(ROOT,'style.json'),validStyle);
  const restored=run('restored-real-art',['checkFiscalFingerprint026.cjs','--out='+path.join(OUT,'restored-fp-check')],env);assert.equal(restored.status,0,'restored legitimate art baselines GREEN');report.checks.push('restored legitimate fingerprint/style baselines GREEN');
}catch(e){report.failures.push(e.stack);console.error(e.stack);}
finally{
  for(const [f,b] of Object.entries(original))if(b===null)fs.rmSync(path.join(ROOT,f),{force:true});else fs.writeFileSync(path.join(ROOT,f),b);
  report.restored=files.every(f=>original[f]===null?!fs.existsSync(path.join(ROOT,f)):fs.readFileSync(path.join(ROOT,f)).equals(original[f]));
  if(!report.restored)report.failures.push('compatibility inputs were not restored');
  report.ok=report.failures.length===0;fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('FISCAL_ART_COMPAT026 '+JSON.stringify(report));
}
process.exitCode=report.ok?0:1;
