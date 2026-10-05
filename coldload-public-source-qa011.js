#!/usr/bin/env node
'use strict';
// Source-only observer tests. No game, renderer, browser, network or test fixture.
const assert=require('node:assert/strict');
const {OFFICIAL011,MANIFEST011,MANIFEST_TEXT011,isManifestDuplicate011,reconcileManifestDuplicates011,reconcilePublicLogs011}=require('./coldload-public-log011');
const entry={level:'error',url:OFFICIAL011+'?publicqa011=verified-sha&check=reload',text:MANIFEST_TEXT011};
const proof=[{url:MANIFEST011,status:404,type:'Manifest'}];
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('exact document-attributed manifest duplicate including query is recognized',()=>assert.equal(isManifestDuplicate011(entry),true));
check('exact independent network 404 proves duplicate and retains explicit disclosure',()=>{const r=reconcileManifestDuplicates011([entry],proof);assert.equal(r.known.length,1);assert.deepEqual(r.known[0].networkProof,{url:MANIFEST011,status:404});assert.equal(r.known[0].text,MANIFEST_TEXT011);assert.equal(r.errors.length,0);});
check('every repeated known duplicate remains individually disclosed',()=>{const r=reconcileManifestDuplicates011([entry,entry,entry,entry],proof);assert.equal(r.known.length,4);assert.equal(r.errors.length,0);});
for(const[name,bad]of[
 ['unknown manifest host',{...entry,text:MANIFEST_TEXT011.replace('lijiabao1998.github.io','example.com')}],
 ['unknown manifest path',{...entry,text:MANIFEST_TEXT011.replace('manifest.json','other.json')}],
 ['unknown manifest status',{...entry,text:MANIFEST_TEXT011.replace('404','403')}],
 ['unknown manifest text',{...entry,text:MANIFEST_TEXT011+' unexpected failure'}],
 ['changed text case',{...entry,text:MANIFEST_TEXT011.replace('Manifest','manifest')}],
 ['unknown source host',{...entry,url:'https://example.com/GlimmerTown-lab/'}],
 ['unknown source path',{...entry,url:'https://lijiabao1998.github.io/other/'}],
 ['source manifest resource rather than actual game document',{...entry,url:MANIFEST011}],
 ['missing source',{...entry,url:undefined}],
 ['malformed source',{...entry,url:'not a URL'}],
 ['source credentials',{...entry,url:'https://user:pass@lijiabao1998.github.io/GlimmerTown-lab/'}],
 ['source wrong protocol',{...entry,url:OFFICIAL011.replace('https:','http:')}],
 ['source whitespace',{...entry,url:entry.url+'\n'}],
 ['non-error log level',{...entry,level:'warning'}]
])check('reject '+name,()=>{assert.equal(isManifestDuplicate011(bad),false);const r=reconcileManifestDuplicates011([bad],proof);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
for(const[name,rows]of[
 ['missing network proof',[]],
 ['unrelated network 404',[{url:'https://example.com/manifest.json',status:404}]],
 ['different manifest path',[{url:OFFICIAL011+'other.json',status:404}]],
 ['wrong network status',[{url:MANIFEST011,status:500}]],
 ['string status without actual numeric 404',[{url:MANIFEST011,status:'404'}]],
 ['query-modified network resource',[{url:MANIFEST011+'?different=1',status:404}]]
])check('reject '+name,()=>{const r=reconcileManifestDuplicates011([entry],rows);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
check('out-of-order log followed by matching network proof resolves only at final reconciliation',()=>{assert.equal(reconcileManifestDuplicates011([entry],[]).errors.length,1);assert.equal(reconcileManifestDuplicates011([entry],proof).known.length,1);});
check('classifier never mutates recorded browser or network evidence',()=>{const e=JSON.stringify(entry),p=JSON.stringify(proof);reconcileManifestDuplicates011([entry],proof);assert.equal(JSON.stringify(entry),e);assert.equal(JSON.stringify(proof),p);});


// Pure source/data tests. Never imports the runtime runner, launches Chrome,
// evaluates product HTML or changes a native game/save.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {passivePublicState011,functionalPublicState011}=require('./coldload-public-state011');
const root=__dirname,source=fs.readFileSync(path.join(root,'coldload-public-qa011.js'),'utf8');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/coldload-public011.yml'),'utf8');
check('runner and serialized passive function parse without executing the game',()=>{
  new vm.Script(source,{filename:'coldload-public-qa011.js'});
  new vm.Script('('+passivePublicState011.toString()+')');
});
check('real runtime remains guarded as CI-only before harness import',()=>{
  assert.ok(source.indexOf("process.env.GITHUB_ACTIONS !== 'true'")<source.indexOf("require('./harness')"));
});
check('public runner calls the fixed static and complete no-promotion fingerprint contracts',()=>{
  assert.match(source,/const proof = verifyStatic011\(\)/);
  assert.match(source,/!proof\.release/);
  assert.match(source,/verifyFingerprint011\(fp, blocks\)/);
  assert.match(source,/proof\.trackedBaselineExact/);
});
check('observer requires exact T724 title prefix in both workflow and runtime',()=>{
  assert.ok(workflow.includes("startsWith(github.event.workflow_run.head_commit.message, 'T724 ')"));
  assert.ok(source.includes(".startsWith('T724 ')"));
  assert.ok(!workflow.includes('contains('));
  for(const text of ['T725 next round\n\nT724 history','Revert T724 change','prefix T724 ','T7240 next','T724'])
    assert.equal(text.startsWith('T724 '),false);
  assert.equal('T724 v14.28: cold-load power restore'.startsWith('T724 '),true);
});
check('observer retains successful same-repository main Pages checks and exact checkout SHA',()=>{
  for(const required of ["run.conclusion!=='success'","run.head_branch!=='main'",'run.head_sha!==head',
    'run.head_repository?.full_name!==process.env.GITHUB_REPOSITORY','head !== expected'])assert.ok(source.includes(required),required);
  assert.match(workflow,/permissions:\n  contents: read\n/);
  assert.match(workflow,/persist-credentials: false/);
  assert.ok(!/contents: write|pages: write|id-token: write|deploy-pages|git push/.test(workflow));
});
check('browser downloads actual official document bytes for initial and repeated reloads',()=>{
  for(const required of ["redirect: 'error'",'Network.getResponseBody','Network.setCacheDisabled',
    'Network.setBypassServiceWorker','!row.fromServiceWorker','bytes.equals(localBytes)',
    "await documentProof('initial-navigation', 0)","await documentProof('cold-page-reload-' + cycle, previousDocumentCount)"])
    assert.ok(source.includes(required),required);
  assert.ok(!/Fetch\.enable|Fetch\.fulfillRequest|Page\.setDocumentContent|startServer|withGame/.test(source));
});
check('measured cold phase contains no native load shortcut or topology/repair calls',()=>{
  const measured=source.slice(source.indexOf('const retained = fixture.retained;'),source.indexOf("await publicFetch('after-browser')"));
  for(const name of ['GV.load','GV.place','GV.rebuild','GV.forceDraw','GV.test','GV.t450','GV.t471',
    'GV.powerAt','GV.recompute','ensurePower','dispatchPower','setupMuseum010','setupStreet009'])
    assert.ok(!measured.includes(name),'forbidden measured-phase helper '+name);
  assert.ok(measured.includes('cycle <= 2'));
  assert.ok(measured.includes("cdp.send('Page.reload', {ignoreCache:true})"));
  assert.ok(measured.includes("document.getElementById('bContinue').click()"));
  assert.ok(measured.includes('day <= 3'));
  assert.ok(measured.includes('functionalPublicState011(next.state)'));
  assert.ok(measured.includes('equal(row.immediate.cells,row.before.cells)'));
  assert.ok(measured.includes('equal(next.state.otherSlots,row.before.otherSlots)'));
});
check('passive state helper uses only permitted public native readers',()=>{
  const calls=[...passivePublicState011.toString().matchAll(/GV\.([a-zA-Z0-9_]+)\s*\(/g)].map(m=>m[1]);
  const allowed=new Set(['tile','stats','diff','dev516B','ver','museumEvidence010','streetLifeEvidence009']);
  assert.ok(calls.length>0&&calls.every(q=>allowed.has(q)));
  assert.ok(!/localStorage\.setItem|localStorage\.removeItem|GV\.[a-zA-Z0-9_]+\s*=/.test(passivePublicState011.toString()));
});
const good={version:'14.28',slot:'3',difficulty:1,developer:{sandbox:false,god:false},menuVisible:false,
  stats:{money:100,pop:50,poweredBld:97},physical:{poweredRoads:441,sources:6},powerDistrictCache:{districts:1},
  museum:{roots:[{k:277,root:2938,built:true,operational:true,power:true,powerState:1,powerAllocation:{root:2938},
    water:true,waterState:{code:2},waterDelivered:4.5,road:[2866],positions:24,employed:12,staff:{k:277},
    activity:{publicJobs:24},tourism:{currentBase:15},coverageStamp:{radius:8}}]},
  street:{roots:[274,275,276].map(k=>({k,operational:true,power:true,powerState:1,employed:5}))},
  retained:Array.from({length:47},(_,i)=>({k:i,bld:{k:i}})),oldMuseums:[35,206].map(k=>({k,bld:{k,sz:2}}))};
check('positive ordinary snapshot predicate can pass',()=>assert.equal(functionalPublicState011(good),true));
for(const[name,mutate]of[
  ['legacy zero-district cold failure',q=>q.powerDistrictCache.districts=0],
  ['legacy citywide power collapse',q=>q.stats.poweredBld=0],
  ['powered roads without supplied museum',q=>q.museum.roots[0].powerState=0],
  ['museum allocation points at another root',q=>q.museum.roots[0].powerAllocation.root=1],
  ['unpowered museum flag',q=>q.museum.roots[0].power=false],
  ['missing native museum staff',q=>q.museum.roots[0].employed=0],
  ['missing museum coverage',q=>q.museum.roots[0].coverageStamp=null],
  ['missing native tourism',q=>q.museum.roots[0].tourism.currentBase=0],
  ['old town hotel without native staff',q=>q.street.roots[0].employed=0],
  ['duplicate street identity',q=>q.street.roots[0].k=275],
  ['lost retained old identity',q=>q.retained[0].bld.k=999],
  ['wrong release',q=>q.version='14.27'],
  ['wrong slot',q=>q.slot='1'],
  ['sandbox',q=>q.developer.sandbox=true],
  ['nonfinite treasury',q=>q.stats.money=NaN]
])check('first-day gate rejects '+name,()=>{const bad=structuredClone(good);mutate(bad);assert.equal(functionalPublicState011(bad),false);});
check('precise direct PWA logs remain disclosed only with independently matching 404',()=>{
  for(const p of ['manifest.json','icon.svg','sw.js']){
    const e={level:'error',url:OFFICIAL011+p,text:'Failed to load resource: the server responded with a status of 404 ()'};
    assert.equal(reconcilePublicLogs011([e],[{url:e.url,status:404}]).known.length,1);
    assert.equal(reconcilePublicLogs011([e],[]).errors.length,1);
    assert.equal(reconcilePublicLogs011([{...e,text:'Uncaught TypeError about '+p}],[{url:e.url,status:404}]).errors.length,1);
  }
});
check('duplicate manifest logs arriving before network response reconcile only with independent proof',()=>{
  assert.equal(reconcilePublicLogs011([entry,entry],[]).errors.length,2);
  assert.equal(reconcilePublicLogs011([entry,entry],proof).known.length,2);
  assert.equal(reconcilePublicLogs011([{...entry,text:entry.text+' extra'}],proof).errors.length,1);
});
check('uncaught exceptions console.error and all loadingFailed remain hard failures',()=>{
  for(const required of ["message.method === 'Network.loadingFailed'", "errors.push('Network loading failed: '",
    "message.method === 'Runtime.exceptionThrown'", "errors.push('Uncaught exception: '",
    "if (p.type === 'error') errors.push('console.error: '", 'report.rawBrowserErrors.push({...p.entry})',
    'reconcilePublicLogs011(pending, report.knownPWA404)', 'cdp.errors.length === 0 && report.networkFailures.length === 0'])
    assert.ok(source.includes(required),required);
});
console.log(JSON.stringify({ok:true,checks,scope:'source and synthetic diagnostic data only; no game or browser runtime'}));
