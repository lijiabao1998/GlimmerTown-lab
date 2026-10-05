#!/usr/bin/env node
'use strict';
// Source-only observer tests. No game, renderer, browser, network or test fixture.
const assert=require('node:assert/strict');
const {OFFICIAL012,MANIFEST012,MANIFEST_TEXT012,isManifestDuplicate012,reconcileManifestDuplicates012,reconcilePublicLogs012}=require('./riverside-public-log012');
const entry={level:'error',url:OFFICIAL012+'?publicqa012=verified-sha&check=reload',text:MANIFEST_TEXT012};
const proof=[{url:MANIFEST012,status:404,type:'Manifest'}];
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('exact document-attributed manifest duplicate including query is recognized',()=>assert.equal(isManifestDuplicate012(entry),true));
check('exact independent network 404 proves duplicate and retains explicit disclosure',()=>{const r=reconcileManifestDuplicates012([entry],proof);assert.equal(r.known.length,1);assert.deepEqual(r.known[0].networkProof,{url:MANIFEST012,status:404});assert.equal(r.known[0].text,MANIFEST_TEXT012);assert.equal(r.errors.length,0);});
check('every repeated known duplicate remains individually disclosed',()=>{const r=reconcileManifestDuplicates012([entry,entry,entry,entry],proof);assert.equal(r.known.length,4);assert.equal(r.errors.length,0);});
for(const[name,bad]of[
 ['unknown manifest host',{...entry,text:MANIFEST_TEXT012.replace('lijiabao1998.github.io','example.com')}],
 ['unknown manifest path',{...entry,text:MANIFEST_TEXT012.replace('manifest.json','other.json')}],
 ['unknown manifest status',{...entry,text:MANIFEST_TEXT012.replace('404','403')}],
 ['unknown manifest text',{...entry,text:MANIFEST_TEXT012+' unexpected failure'}],
 ['changed text case',{...entry,text:MANIFEST_TEXT012.replace('Manifest','manifest')}],
 ['unknown source host',{...entry,url:'https://example.com/GlimmerTown-lab/'}],
 ['unknown source path',{...entry,url:'https://lijiabao1998.github.io/other/'}],
 ['source manifest resource rather than actual game document',{...entry,url:MANIFEST012}],
 ['missing source',{...entry,url:undefined}],
 ['malformed source',{...entry,url:'not a URL'}],
 ['source credentials',{...entry,url:'https://user:pass@lijiabao1998.github.io/GlimmerTown-lab/'}],
 ['source wrong protocol',{...entry,url:OFFICIAL012.replace('https:','http:')}],
 ['source whitespace',{...entry,url:entry.url+'\n'}],
 ['non-error log level',{...entry,level:'warning'}]
])check('reject '+name,()=>{assert.equal(isManifestDuplicate012(bad),false);const r=reconcileManifestDuplicates012([bad],proof);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
for(const[name,rows]of[
 ['missing network proof',[]],
 ['unrelated network 404',[{url:'https://example.com/manifest.json',status:404}]],
 ['different manifest path',[{url:OFFICIAL012+'other.json',status:404}]],
 ['wrong network status',[{url:MANIFEST012,status:500}]],
 ['string status without actual numeric 404',[{url:MANIFEST012,status:'404'}]],
 ['query-modified network resource',[{url:MANIFEST012+'?different=1',status:404}]]
])check('reject '+name,()=>{const r=reconcileManifestDuplicates012([entry],rows);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
check('out-of-order log followed by matching network proof resolves only at final reconciliation',()=>{assert.equal(reconcileManifestDuplicates012([entry],[]).errors.length,1);assert.equal(reconcileManifestDuplicates012([entry],proof).known.length,1);});
check('classifier never mutates recorded browser or network evidence',()=>{const e=JSON.stringify(entry),p=JSON.stringify(proof);reconcileManifestDuplicates012([entry],proof);assert.equal(JSON.stringify(entry),e);assert.equal(JSON.stringify(proof),p);});


// Pure source/data tests only. No product evaluation or native runtime imports.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const contract=require('./riverside-public-contract012');
const {passivePublicState012,retailAccounting012,marketIdentity012,functionalPublicState012,summarizePublicResult012}=require('./riverside-public-state012');
const root=__dirname,releaseRoot=path.resolve(process.env.EXPECTED_RELEASE_ROOT||root);
const source=fs.readFileSync(path.join(root,'riverside-public-qa012.js'),'utf8');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/riverside-public012.yml'),'utf8');
const pages=fs.readFileSync(path.join(root,'riverside-public-pages012.js'),'utf8');
check('all observer scripts and serialized passive reader parse without executing product',()=>{
 for(const name of fs.readdirSync(root).filter(p=>/^riverside-public-.*012\.js$/.test(p)))new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
 new vm.Script('('+passivePublicState012.toString()+')');
});
check('Actions-only gate precedes the pinned deployed harness import',()=>{
 assert.ok(source.indexOf("process.env.GITHUB_ACTIONS !== 'true'")<source.indexOf("require(path.join(ROOT,'harness.js'))"));
 assert.ok(source.indexOf('verifyRelease012(ROOT,process.env.EXPECTED_DEPLOY_SHA)')<source.indexOf("require(path.join(ROOT,'harness.js'))"));
});
check('approved fixture bodies remain exact and parse without executing game',()=>{
 const body=contract.fixtureSource012(releaseRoot);new vm.Script(body);
 assert.ok(body.includes('function setupRiverside012('));
 for(const [file,start,end,pin] of contract.fixtureRanges)
  assert.equal(contract.hash(contract.range(fs.readFileSync(path.join(releaseRoot,file),'utf8'),start,end)),pin);
});
check('exact three-label release transform independently gives pinned T725 HTML',()=>{
 const candidate=contract.gitFile(releaseRoot,contract.APPROVED,'index.html');
 assert.equal(contract.hash(candidate),contract.APPROVED_SOURCE_SHA256);
 const promoted=candidate.toString().replace("const GAME_VER='14.28'","const GAME_VER='14.29'")
  .replace("const GAME_ANCHOR='T724'","const GAME_ANCHOR='T725'")
  .replace('id="startVersion456">v14.28 · T724','id="startVersion456">v14.29 · T725');
 assert.equal(contract.hash(promoted),contract.RELEASE_SOURCE_SHA256);
 assert.deepEqual(contract.normalizeRelease012(Buffer.from(promoted)),candidate);
 assert.throws(()=>contract.normalizeRelease012(candidate));
 assert.throws(()=>contract.normalizeRelease012(Buffer.from(promoted+"const GAME_VER='14.29'")));
});
check('dedicated observer branch exact SHA and independent deployed checkout are enforced',()=>{
 for(const required of ['observerHead!==process.env.GITHUB_SHA','head !== expected',
  "process.env.GITHUB_REF!=='refs/heads/gpt/riverside-public012'",'pages.head_sha!==head',
  "pages.head_branch!=='main'","pages.conclusion!=='success'","pages.title.startsWith('T725 ')"])
  assert.ok(source.includes(required),required);
 for(const text of ['T726 next\n\nT725 history','Revert T725 change','prefix T725 ','T7250 next','T725'])assert.equal(text.startsWith('T725 '),false);
 assert.ok(workflow.includes('path: observer')&&workflow.includes('path: deployed')&&workflow.includes('ref: ${{ steps.pins.outputs.sha }}'));
 assert.ok(workflow.includes('persist-credentials: false'));
 assert.ok(!/contents: write|actions: write|pages: write|id-token: write|deploy-pages|git push|schedule:|workflow_run:/.test(workflow));
});
check('successful Pages proof uses public GET first and only an exhausted rate-limit fallback',()=>{
 assert.ok(pages.includes("accessMode='public unauthenticated GET'"));
 assert.ok(pages.includes("response.status===403&&response.headers.get('x-ratelimit-remaining')==='0'"));
 assert.ok(pages.includes("r.head_sha===sha&&r.head_branch==='main'"));
 assert.ok(pages.includes("r.conclusion==='success'&&r.status==='completed'"));
 assert.ok(pages.includes("r.head_repository?.full_name===repository"));
 assert.ok(pages.includes(".startsWith('T725 ')"));
 assert.ok(!/method:\s*['"](?:POST|PUT|PATCH|DELETE)/.test(pages));
});
check('every actual public HTML document is compared byte-for-byte with pinned release',()=>{
 for(const required of ["redirect: 'error'",'Network.getResponseBody','Network.setCacheDisabled','Network.setBypassServiceWorker',
  '!row.fromServiceWorker','bytes.equals(localBytes)',"await documentProof('initial-navigation', 0)",
  "await documentProof('cold-page-reload-'+cycle,previousDocumentCount)"])
  assert.ok(source.includes(required),required);
 assert.ok(!/Fetch\.enable|Fetch\.fulfillRequest|Page\.setDocumentContent|startServer|withGame/.test(source));
});
check('measured cold section admits only current save Continue pause ticks and passive reads',()=>{
 const measured=source.slice(source.indexOf('// BEGIN MEASURED COLD PHASE'),source.indexOf('// END MEASURED COLD PHASE'));
 for(const name of ['GV.load','GV.place','GV.rebuild','GV.forceDraw','GV.test','GV.t450','GV.t471','GV.powerAt','GV.recompute',
  'ensurePower','dispatchPower','setupRiverside012','bindObservation012','nativeScene012','localStorage.setItem','localStorage.removeItem'])
  assert.ok(!measured.includes(name),'forbidden cold-phase helper '+name);
 for(const required of ['cycle<=2',"cdp.send('Page.reload',{ignoreCache:true})","document.getElementById('bContinue').click()",'day<=3',
  'functionalPublicState012(next.state)','equal(row.immediate.cells,row.before.cells)','equal(next.state.paths,row.before.paths)',
  'equal(next.state.otherSlots,row.before.otherSlots)','menu.raw===raw','menu.fixtureAbsent'])assert.ok(measured.includes(required),required);
});
check('passive snapshot uses only documented native readers and never setters',()=>{
 const code=passivePublicState012.toString(),calls=[...code.matchAll(/GV\.([a-zA-Z0-9_]+)\s*\(/g)].map(m=>m[1]);
 const allowed=new Set(['tile','ver','diff','dev516B','stats','riversideEvidence012','riversideAt012','streetLifeEvidence009','museumEvidence010','stationDistrictAt008']);
 assert.ok(calls.length>0&&calls.every(k=>allowed.has(k)));
 assert.ok(!/localStorage\.setItem|localStorage\.removeItem|GV\.[a-zA-Z0-9_]+\s*=/.test(code));
});
function syntheticGood(){
 const roots=[278,279,280].map((k,n)=>({k,root:100+n,built:true,age:9,operational:true,power:true,powerState:1,
  powerAllocation:{root:100+n,pool:0},water:true,waterState:{code:2},waterDelivered:4,road:[1],positions:({278:18,279:3,280:4})[k],
  employed:1,enterprise:{activePositions:({278:18,279:3,280:4})[k],employed:1,potentialJobs:({278:18,279:3,280:4})[k]},retailUnits:1/14,
  activity:{shopping:2.15,work:1,enterpriseJobs:1,publicJobs:0,education:0,services:0,leisure:0,parking:0},tax:{tax:2}}));
 return {version:'14.29',slot:'3',difficulty:1,developer:{sandbox:false,god:false},menuVisible:false,coldFixDisabled:false,
  stats:{money:100,pop:50,poweredBld:97,day:10},physical:{poweredRoads:441,sources:6},districtCache:{districts:1},
  market:{day:10,roots,retailUnits:3/14,taxLedger:{current:true,day:10,total:6,rows:roots.map(r=>({root:r.root,k:r.k,tax:2}))}},
  street:{roots:[274,275,276].map(k=>({k,operational:true,power:true,powerState:1,employed:5}))},
  museum:{roots:[{k:277,built:true,operational:true,powerState:1,waterDelivered:4,employed:10,tourism:{currentBase:15}}]},
  retained:Array.from({length:47},(_,i)=>({k:i,sz:1,x:i,y:0,bld:{k:i,sz:1},cells:[{k:i,sz:1}]})),
  oldMuseums:[35,206].map(k=>({k,bld:{k,sz:2}})),stations:[1,2].map(()=>({k:139,v:3,age:9,ownedRail:Array(10).fill(1)})),
  themes:Array.from({length:36},(_,i)=>{const theme=['quay','rail','promenade'][i%3];return{theme,at:{theme,am502:1,baseWalkCost:.72,amx502:{british012:theme}}};}),
  water:Array.from({length:70},()=>({t:0})),shoreline:Array.from({length:13},()=>({land:1,water:0}))};
}
check('synthetic fully supplied paid-market snapshot and single tax authority can pass',()=>{
 assert.equal(functionalPublicState012(syntheticGood()),true);
 assert.equal(retailAccounting012(syntheticGood().market).exact,true);
});
for(const[name,mutate]of[
 ['zero cold districts',q=>q.districtCache.districts=0],['citywide power collapse',q=>q.stats.poweredBld=0],
 ['market allocation for another root',q=>q.market.roots[0].powerAllocation.root=0],['market without road',q=>q.market.roots[0].road=[]],
 ['market without delivered water',q=>q.market.roots[0].waterDelivered=0],['unpowered market',q=>q.market.roots[0].powerState=0],
 ['no actual enterprise labor',q=>q.market.roots[0].enterprise.employed=0],['zero workers',q=>q.market.roots[0].employed=0],
 ['inconsistent native enterprise employment',q=>q.market.roots[0].enterprise.employed=2],
 ['inconsistent native enterprise active positions',q=>q.market.roots[0].enterprise.activePositions=1],
 ['zero native work capacity',q=>{q.market.roots[0].activity.work=0;q.market.roots[0].activity.enterpriseJobs=0;}],
 ['inflated jobs',q=>q.market.roots[1].positions=99],['duplicate building identity',q=>q.market.roots[0].k=279],
 ['unfinished building',q=>q.market.roots[0].age=8],['public-job contamination',q=>q.market.roots[0].activity.publicJobs=1],
 ['fabricated shopping capacity',q=>q.market.roots[0].activity.shopping=999],['fabricated retail units',q=>q.market.retailUnits=999],
 ['stale tax ledger',q=>q.market.taxLedger.current=false],['wrong tax day',q=>q.market.taxLedger.day--],
 ['wrong total commercial receipts',q=>q.market.taxLedger.total++],['duplicate tax row',q=>q.market.taxLedger.rows.push(q.market.taxLedger.rows[0])],
 ['missing tax row',q=>q.market.taxLedger.rows.pop()],['root without real tax',q=>q.market.roots[0].tax=null],
 ['zero commercial receipt',q=>{q.market.taxLedger.total=0;q.market.taxLedger.rows.forEach(r=>r.tax=0);q.market.roots.forEach(r=>r.tax.tax=0);} ],
 ['lost older British footprint',q=>q.retained[0].cells=[]],['lost historical museum',q=>q.oldMuseums[0].bld.k=999],
 ['lost station rail',q=>q.stations[0].ownedRail=[0]],['empty owned rail inventory',q=>q.stations[0].ownedRail=[]],['unemployed retained hotel',q=>q.street.roots[0].employed=0],
 ['lost museum tourism',q=>q.museum.roots[0].tourism.currentBase=0],['missing theme',q=>q.themes=q.themes.filter(p=>p.theme!=='rail')],
 ['path metadata mismatch',q=>q.themes[0].at.amx502.british012='rail'],['missing canal water',q=>q.water[0].t=1],
 ['quay no longer adjoins water',q=>q.shoreline[0].water=1],['sandbox',q=>q.developer.sandbox=true],
 ['cold fix disabled',q=>q.coldFixDisabled=true],['wrong release',q=>q.version='14.28'],['wrong slot',q=>q.slot='1'],
 ['nonfinite treasury',q=>q.stats.money=NaN]
])check('independent first-day gate rejects '+name,()=>{const q=syntheticGood();mutate(q);assert.equal(functionalPublicState012(q),false);});
check('ordinary days retain exact market coordinates dimensions variants and every reference cell',()=>{
 assert.ok(source.includes('equal(marketIdentity012(next.state),marketIdentity012(row.before))'));
 const q=syntheticGood();q.market.roots.forEach((r,n)=>{r.id='shop'+n;r.v=0;r.sz=n?1:3;r.refCells=n?[]:[{i:101,bld:{k:278,ref:[10,10],sz:1,lv:1,v:0,age:9}}];});
 const before=marketIdentity012(q),age=structuredClone(q);age.market.roots[0].age++;age.market.roots[0].refCells[0].bld.age++;
 assert.deepEqual(marketIdentity012(age),before);
 for(const mutate of [r=>r.root++,r=>r.k++,r=>r.v++,r=>r.sz++,r=>r.refCells[0].bld.ref[0]++,r=>r.refCells=[]]){
  const bad=structuredClone(q);mutate(bad.market.roots[0]);assert.notDeepEqual(marketIdentity012(bad),before);
 }
});
check('precise direct PWA logs require their own independent exact numeric 404',()=>{
 for(const name of ['manifest.json','icon.svg','sw.js']){
  const row={level:'error',url:OFFICIAL012+name,text:'Failed to load resource: the server responded with a status of 404 ()'};
  assert.equal(reconcilePublicLogs012([row],[{url:row.url,status:404}]).known.length,1);
  for(const responses of [[],[{url:row.url,status:403}],[{url:row.url+'?x=1',status:404}]])
   assert.equal(reconcilePublicLogs012([row],responses).errors.length,1);
  assert.equal(reconcilePublicLogs012([{...row,text:'Uncaught TypeError '+name}],[{url:row.url,status:404}]).errors.length,1);
 }
});
check('raw errors remain disclosed independently of functional pass and known classification',()=>{
 for(const required of ['report.rawBrowserErrors.push({...p.entry})','report.functionalChecksPassed=true','report.rawConsoleClean=',
  'report.rawBrowserErrorCount=report.rawBrowserErrors.length','report.unknownErrorCount=cdp.errors.length',
  "errors.push('Uncaught exception: '","errors.push('console.error: '","errors.push('Network loading failed: '",
  'cdp.errors.length === 0 && report.networkFailures.length === 0'])assert.ok(source.includes(required),required);
 assert.ok(!source.includes('zero game console errors'));
});
check('generic URL-less SW errors stay unknown even with exact independent sw.js 404',()=>{
 const generic={level:'error',text:'A bad HTTP response code (404) was received when fetching the script.'};
 const rows=[{url:OFFICIAL012+'sw.js',status:404}];
 const r=reconcilePublicLogs012([generic],rows);
 assert.equal(r.known.length,0);assert.equal(r.errors.length,1);
});
check('functional success remains distinct from strict unknown-error failure in read-only summary',()=>{
 const q={functionalChecksPassed:true,checks:[{name:'both independent public cold reloads passed their very first ordinary day',ok:true,scope:'functional'},
  {name:'no unknown errors',ok:false,scope:'diagnostics'}],rawBrowserErrors:[{level:'error',text:'URL-less SW 404'}],knownPWALogs:[],
  consoleErrors:['Browser log: URL-less SW 404 @'],knownPWA404:[{url:OFFICIAL012+'sw.js',status:404}],
  networkFailures:[],warnings:['sw.js registration failed'],coldReloads:[]};
 const before=JSON.stringify(q),s=summarizePublicResult012(q);
 assert.equal(s.functionalSummary.passed,true);assert.equal(s.functionalSummary.checksFailed,0);
 assert.equal(s.browserDiagnosticSummary.rawBrowserErrorCount,1);assert.equal(s.browserDiagnosticSummary.unknownErrorCount,1);
 assert.equal(s.browserDiagnosticSummary.knownPWAErrorCount,0);assert.equal(s.browserDiagnosticSummary.rawConsoleClean,false);
 assert.equal(s.browserDiagnosticSummary.strictErrorGatePassed,false);assert.equal(JSON.stringify(q),before);
});
check('known errors remain raw red and partial functional work is never summarized as passed',()=>{
 const q={checks:[{name:'native city',ok:true,scope:'functional'}],rawBrowserErrors:[{text:'exact known 404'}],
  knownPWALogs:[{classification:'exact known'}],consoleErrors:[],networkFailures:[]};
 const s=summarizePublicResult012(q);assert.equal(s.functionalSummary.status,'incomplete');
 assert.equal(s.functionalSummary.passed,false);assert.equal(s.browserDiagnosticSummary.rawConsoleClean,false);
 assert.equal(s.browserDiagnosticSummary.strictErrorGatePassed,true);
 const empty=summarizePublicResult012({});assert.equal(empty.functionalSummary.status,'not_run');
 assert.equal(empty.browserDiagnosticSummary.observed,false);assert.equal(empty.browserDiagnosticSummary.rawConsoleClean,false);
});
check('summary records each cold cycle first day and emits a small standalone JSON artifact',()=>{
 const q={functionalChecksPassed:true,checks:[1,2,3].map(d=>({scope:'functional',ok:true,
  name:'cold reload 1: '+(d===1?'FIRST':d)+' unaided ordinary day retains native services'})),
  coldReloads:[{cycle:1,save:{sha256:'exact-current-save',bytes:3000,day:10},days:[11,12,13].map(day=>({state:{stats:{day}}}))}]};
 const s=summarizePublicResult012(q);assert.deepEqual(s.functionalSummary.coldReloads[0].observedNativeDays,[11,12,13]);
 assert.equal(s.functionalSummary.coldReloads[0].firstOrdinaryDay,'passed');assert.equal(s.functionalSummary.coldReloads[0].ordinaryDaysPassed,3);
 assert.ok(source.includes('Object.assign(report,summarizePublicResult012(report))'));
 assert.ok(source.includes("path.join(OUT,'summary.json')"));
 assert.ok(source.includes("},'diagnostics')"));
});
const baseChecks=checks;
let releaseDependentChecks=0;
if(process.env.EXPECTED_RELEASE_ROOT){
 check('synthetic complete promoted T725 fingerprint passes exact pure-data release gate',()=>{
  const b=JSON.parse(fs.readFileSync(path.join(releaseRoot,'fp.json'))),fp={ok:true,subs:b.subs,families:b.families,stats:b.stats},blocks={ok:true,...b.blocks};
  assert.equal(contract.verifyPublicFingerprint012(releaseRoot,fp,blocks).promotedNativeRecordsExact,true);
  const changed=structuredClone(fp);changed.subs[Object.keys(changed.subs)[0]].d='bad';
  assert.throws(()=>contract.verifyPublicFingerprint012(releaseRoot,changed,blocks));
  assert.throws(()=>contract.verifyPublicFingerprint012(releaseRoot,fp,{...blocks,count:1727}));
 });
 releaseDependentChecks=checks-baseChecks;
}
console.log(JSON.stringify({ok:true,checks,baseChecks,releaseDependentChecks,releaseDataChecked:releaseDependentChecks>0,scope:'source and synthetic data only; no game, browser or public network runtime'}));
