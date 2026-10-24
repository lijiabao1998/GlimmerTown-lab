'use strict';
// Source/byte checks, including deliberately broken controls. No game or canvas.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const {compose,strip,parse}=require('./wave044-source.cjs');
const BASE='6284b854e18b12188d193652e9aa69cb7022dfea',FIRST='73e6e412b4be622dcdf9d068068ec529324db8b3',C2='ef9efc5292584aa62e15e5a7f899946fb753d1d0';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(f),git=(ref,file)=>cp.execFileSync('git',['show',ref+':'+file],{maxBuffer:32*1024*1024});
const baseRef=BASE,original=git(BASE,'index.html'),current=read('index.html');
assert.equal(hash(original),'cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8','source044 independently pinned published main index');
const sources={art:read('british-wave16-art044.js').toString(),runtime:read('wave044-runtime.js').toString(),css:read('wave044.css').toString()},full=compose(original.toString(),sources);
const release044=require('./wave044-release-labels.cjs');
assert.equal(hash(read('wave044-release-metadata.cjs')),'a5d3bbf7a386134da371a3898451070769e606bc6f708b4d5fc57a21d4f688e0','release044 exact metadata insertion contract source');
const releaseMetadata=require('./wave044-release-metadata.cjs');
assert.deepEqual(Object.keys(releaseMetadata.PATCHES).sort(),['AUTORUN-LOG.md','docs/GPT-方向.md'],'release044 exactly two declared metadata files');
assert.equal(release044.toCandidate(current.toString()),full,'release044 release reverses to exact source composition');
assert.equal(release044.toCandidate(current.toString()),git(C2,'index.html').toString(),'release044 reverse to actual C2 Git source');
const releaseNegative=release044.negatives(current.toString());
const declaredBase=release044.baseToRelease(original.toString());
assert.equal(release044.restoreBase(declaredBase),original.toString(),'release044 source exact BASE label inverse');
assert.equal(strip(current.toString()),declaredBase,'release044 source full HEAD strips to exact declared release BASE');
assert.equal(strip(full),original.toString(),'source044 three blocks strip to independent published main bytes');
assert.equal(compose(full,sources),full,'source044 source composition idempotent');
const scope=JSON.parse(read('wave044-original-scope.json')),ids=["lindenmaps","wrenumbrella","meadowsweetherb","sorrelglove","tamargauge","rookspiano","hartcurrier","sainwax","brackenlast","harecase"];
function metadata(s){assert.equal(s.schema,'GPT-044.original-wave16-scope.v1');assert.deepEqual(s.families,['bld']);assert.equal(s.baseCommit,BASE);assert.equal(s.rows.length,10,'source044 exact original ten');assert.deepEqual(s.rows.map(r=>r.id),ids,'source044 exact ordered original identities');assert.deepEqual(s.rows.map(r=>r.v),Array.from({length:10},(_,i)=>760+i*4),'source044 exact forty variant slots');assert(s.rows.every(r=>r.evidenceStatus==='original-code-native-design'&&!r.url&&!r.inspectedReferenceSHA256),'source044 original provenance, no borrowed photo claim');assert.equal(s.nativeCarrier.newSpriteCount,40);assert.equal(s.nativeCarrier.cost,2000);}
metadata(scope);
const card='docs/branch/GPT-044-original-specialist-workshops-wave16.md',first=git(FIRST,card);
assert.equal(hash(first),'87382d6a855c59860d3cd7679577c6d1768e91990896ae7c41d7bff8c921d479','source044 exact original-scope first-card bytes');assert(read(card).subarray(0,first.length).equals(first),'source044 first original criteria remain exact prefix');
// Every published file remains byte-exact, apart from the declared index,
// appended smoke hook, exact CI-produced fingerprint adoption and two exact metadata insertions.
const entries=cp.execFileSync('git',['ls-tree','-r','-z','--full-tree',baseRef],{encoding:'utf8',maxBuffer:2*1024*1024}).split('\0').filter(Boolean);assert.equal(entries.length,1492,'source044 exact independent published file inventory');let retained=0;
for(const line of entries){const m=line.match(/^\d+ blob ([a-f0-9]{40})\t(.+)$/);if(!m)continue;const [,sha,file]=m;if(['index.html','smoke.js','fp.json','style.json'].includes(file))continue;const b=read(file),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');if(Object.hasOwn(releaseMetadata.PATCHES,file))releaseMetadata.verify(file,b,git(baseRef,file));else assert.equal(blob,sha,'source044 every published source byte unchanged '+file);retained++;}
assert.equal(retained,1488,'source044 all published non-declared files verified');
const smoke=read('smoke.js').toString(),a=smoke.indexOf('    // GPT-044 NEW SELFTEST START'),e='    // GPT-044 NEW SELFTEST END\n',b=smoke.indexOf(e,a);assert(a>=0&&b>a,'source044 unique added smoke hook');assert.equal(smoke.slice(0,a)+smoke.slice(b+e.length),git(baseRef,'smoke.js').toString(),'source044 every previous smoke assertion unchanged');
const phase=read('wave044-traffic-phase-fixture.js').toString(),point='Object.assign(window.GV,{art574:',end='/* GPT-044 RUNTIME END */';assert.equal(original.toString().split(point).length,2);
const phaseBase=original.toString().replace(point,phase+'\n'+point),phaseHead=full.replace(end,phase+'\n'+end);
assert.equal(phaseBase.replace(phase+'\n',''),original.toString(),'source044 CI-only BASE phase bridge strip exact');assert.equal(strip(phaseHead),original.toString(),'source044 HEAD phase bridge belongs only in removable CI block');assert(!full.includes('__wave044TrafficPhase'),'source044 production excludes phase helper');assert(!full.includes('installBritishWave044NineFixture'),'source044 production cannot use partial installer');
const negative=[],expect=(name,fn,target)=>{let first='';try{fn();}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'source044 intended first RED '+name+': '+first);negative.push({name,first,restored:true});};
const damaged=full.replace('</head>','<!-- outside044 -->\n</head>');parse(damaged);expect('valid HTML outside source boundary',()=>assert.equal(strip(damaged),original.toString(),'source044 source-boundary mismatch'),'source044 source-boundary mismatch');
const leaked=full.replace(point,phase+'\n'+point);parse(leaked);expect('CI phase helper leaked outside runtime boundary',()=>assert.equal(strip(leaked),original.toString(),'source044 source-boundary mismatch'),'source044 source-boundary mismatch');
expect('missing complete installer',()=>strip(full.replace('installBritishWave044();','')),'wave044 unique declared installation tail');
for(const [name,mutate,target]of[['one omitted original',s=>s.rows.pop(),'source044 exact original ten'],['reordered originals',s=>s.rows.reverse(),'source044 exact ordered original identities'],['wrong variant range',s=>s.rows[0].v=520,'source044 exact forty variant slots'],['false photograph claim',s=>s.rows[0].inspectedReferenceSHA256=['invented'],'source044 original provenance']]){const wrong=structuredClone(scope);mutate(wrong);expect(name,()=>metadata(wrong),target);metadata(scope);}
for(const file of Object.keys(releaseMetadata.PATCHES)){const old=git(BASE,file),good=read(file);releaseMetadata.verify(file,good,old);for(const [name,wrong] of [['old byte',Buffer.from('!'+good.toString().slice(1))],['missing insertion',old],['duplicate insertion',Buffer.concat([good,good])]])expect(name+' '+file,()=>releaseMetadata.verify(file,wrong,old),'release044 only exact declared metadata insertion '+file);}
expect('altered independent BASE',()=>release044.baseToRelease(original.toString().replace('</head>','<!-- outside BASE -->\n</head>')),'release044 independent BASE source');
expect('altered declared BASE inverse',()=>release044.restoreBase(declaredBase.replace('</head>','<!-- outside BASE -->\n</head>')),'release044 restore exact independent BASE');
let baselineStage='unchanged published baseline; candidate CI rebake still required';
if(fs.existsSync('docs/branch/GPT-044-raw-CI-baseline-adoption.json')){
  const p=JSON.parse(read('docs/branch/GPT-044-raw-CI-baseline-adoption.json'));assert.match(p.producerHead,/^[a-f0-9]{40}$/);assert(Number.isSafeInteger(p.run)&&Number.isSafeInteger(p.job));assert.equal(p.artSourceSHA256,hash(Buffer.from(sources.art)),'source044 adopted baseline binds to exact artwork');
  for(const f of['fp.json','style.json']){const pin=p.files.find(x=>x.name===f);assert(pin&&pin.bytes>0);const bytes=read(f),check=x=>assert(x.length===pin.bytes&&hash(x)===pin.sha256,'source044 exact raw CI baseline bytes '+f);check(bytes);const bad=Buffer.from(bytes);bad[bad.length-1]^=1;expect('one raw baseline byte '+f,()=>check(bad),'source044 exact raw CI baseline bytes '+f);}
  baselineStage='exact CI artifact bytes adopted; independent native fp proof still required';
}else for(const f of['fp.json','style.json'])assert(read(f).equals(git(baseRef,f)),'source044 candidate must retain published baseline before CI adoption '+f);
// Original 044 preparation is immutable C2 evidence, never rebound to release wrappers.
const originalContractFiles=["docs/branch/GPT-044-full-guard-preparation.json","docs/branch/GPT-044-raw-CI-baseline-adoption.json","wave044-original-scope.json","wave044-source.cjs","wave044-source-geometry-report.json","checkWave044FullSources.cjs","checkOriginalGeometry044.cjs","embed-wave044.cjs"];
for(const file of originalContractFiles)assert(read(file).equals(git(C2,file)),'release044 original candidate contract unchanged '+file);
const guards=JSON.parse(read('docs/branch/GPT-044-full-guard-preparation.json'));
assert.equal(guards.base,BASE);assert.equal(guards.firstCardCommit,FIRST);assert.equal(guards.firstCardSHA256,hash(first));assert.equal(guards.artSource.sha256,hash(Buffer.from(sources.art)));for(const entry of guards.fullGuardPreparedSources){const src=read(entry.file);assert(src.equals(git(C2,entry.file)),'release044 original prepared guard exact C2 bytes '+entry.file);assert.equal(hash(src),entry.expectedSHA256,'source044 exact prepared complete native guard '+entry.file);assert(!src.includes(Buffer.from('sandbox556b')),'source044 retain native sandbox save key');for(const [,name]of src.toString().matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave044')assert(original.includes(Buffer.from(name)),'source044 native API exists in independent published main '+entry.file+': '+name);}
// New release guards are additional contracts; all original guards above remain frozen.
const releaseGuardPins=[{"file":"wave044-release-labels.cjs","sha256":"76e2fb54264feff0683a2da51cd9a8519cb70054684abba9694fecfb29fee3d0"},{"file":"probeBritishWaveRelease044.cjs","sha256":"059b89dd1b91fc0d55ad4ed965d7a9e47e2719e8fb4fe5eb606d126dec176672"},{"file":"probeNativePairsRelease044.cjs","sha256":"ac9d5e4a21254d998e4eb9f49725985f1b924b025d6d167d2d2f092cd8046368"},{"file":"probeScenesRelease044.cjs","sha256":"89748cb034149880acdb3126ced9ce0455ba2cb0e3dbb9f19cf7c7ae0a5bf23c"},{"file":"probeTenPowerRelease044.cjs","sha256":"6ec268c166cd7a2c97f4f3372f089e27c4122100d4a6afd5518e96a34cf0b941"},{"file":"probeConstruction044.cjs","sha256":"a501101388e88c96642d2c8496db8ac6b70cbcc787ef1cca6664736f2c436c8a"}];
const releaseGuardSources=[];
for(const pin of releaseGuardPins){
 const src=read(pin.file),check=bytes=>assert.equal(hash(bytes),pin.sha256,'release044 exact additional release guard '+pin.file);
 check(src);new vm.Script(src.toString(),{filename:pin.file});assert(!src.includes(Buffer.from('sandbox556b')),'release044 retain native sandbox save key');
 for(const [,name]of src.toString().matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave044')assert(original.includes(Buffer.from(name)),'release044 native API exists in independent BASE '+pin.file+': '+name);
 const bad=Buffer.from(src);bad[bad.length-1]^=1;expect('one additional release-guard byte '+pin.file,()=>check(bad),'release044 exact additional release guard '+pin.file);check(src);
 releaseGuardSources.push({...pin,bytes:src.length,sourceParsed:true,gameExecuted:false});
}
assert.equal(strip(full),original.toString());const report={ok:true,kind:'source-only-complete-original-ten-release-v2',base:BASE,baseObjectRead:baseRef,head:process.env.GITHUB_SHA||null,sourceSHA256:hash(Buffer.from(sources.art)),committedIndexSHA256:hash(current),retainedPublishedFiles:retained-2,protectedPublishedFiles:retained,declaredMetadataFilesChecked:2,releaseNegative,releaseGuardSources,originalCandidateContractsUnchanged:true,candidateCommit:C2,firstScopeCardSHA256:hash(first),sourceStripExact:true,sharedGuardsUnchanged:true,productionPhaseBridgeAbsent:true,inlineScripts:parse(full),negativeControls:negative,baselineStage,gameExecuted:false,rasterizerExecuted:false,renderedNewSprites:0,fullWaveAcceptance:false};
if(process.env.GITHUB_ACTIONS==='true'){fs.mkdirSync('shots/wave044/source-preparation',{recursive:true});fs.writeFileSync('shots/wave044/source-preparation/manifest.json',JSON.stringify(report,null,2)+'\n');}
console.log('WAVE044_SOURCE_PREPARATION '+JSON.stringify(report));
