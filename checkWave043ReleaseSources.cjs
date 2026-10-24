'use strict';
// Source/byte checks, including deliberately broken controls. No game or canvas.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const {compose,strip,parse}=require('./wave043-source.cjs');
const BASE='5f546bc1b090982f9d7f51ab5bbf1da15a57e7a6',FIRST='8a59d41831010faad3096d2c6c4096e606177f06',C2='9a27fd2bff5f53eb772af5a2d358a776185c0b04';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(f),git=(ref,file)=>cp.execFileSync('git',['show',ref+':'+file],{maxBuffer:32*1024*1024});
const baseRef=BASE,original=git(BASE,'index.html'),current=read('index.html');
assert.equal(hash(original),'2da67e4b29c7ffcab10523b0897637a276adb28de5ce40816ba43ccfd0c329ea','source043 independently pinned published main index');
const sources={art:read('british-wave15-art043.js').toString(),runtime:read('wave043-runtime.js').toString(),css:read('wave043.css').toString()},full=compose(original.toString(),sources);
const release043=require('./wave043-release-labels.cjs');
assert.equal(hash(read('wave043-release-metadata.cjs')),'b9589056c25d2bf153ae53b3c2eff6c762f702a251b02cf2ca9f2472f5c94702','release043 exact metadata insertion contract source');
const releaseMetadata=require('./wave043-release-metadata.cjs');
assert.deepEqual(Object.keys(releaseMetadata.PATCHES).sort(),['AUTORUN-LOG.md','docs/GPT-方向.md'],'release043 exactly two declared metadata files');
assert.equal(release043.toCandidate(current.toString()),full,'release043 release reverses to exact source composition');
assert.equal(release043.toCandidate(current.toString()),git(C2,'index.html').toString(),'release043 reverse to actual C2 Git source');
const releaseNegative=release043.negatives(current.toString());
const declaredBase=release043.baseToRelease(original.toString());
assert.equal(release043.restoreBase(declaredBase),original.toString(),'release043 source exact BASE label inverse');
assert.equal(strip(current.toString()),declaredBase,'release043 source full HEAD strips to exact declared release BASE');
assert.equal(strip(full),original.toString(),'source043 three blocks strip to independent published main bytes');
assert.equal(compose(full,sources),full,'source043 source composition idempotent');
const scope=JSON.parse(read('wave043-original-scope.json')),ids=['reedcider','pondbadminton','holtscout','fennelhoney','ashfives','brassbell','teaselhat','withebasket','gorsearchery','rillramblers'];
function metadata(s){assert.equal(s.schema,'GPT-043.original-wave15-scope.v1');assert.deepEqual(s.families,['bld']);assert.equal(s.baseCommit,BASE);assert.equal(s.rows.length,10,'source043 exact original ten');assert.deepEqual(s.rows.map(r=>r.id),ids,'source043 exact ordered original identities');assert.deepEqual(s.rows.map(r=>r.v),Array.from({length:10},(_,i)=>720+i*4),'source043 exact forty variant slots');assert(s.rows.every(r=>r.evidenceStatus==='original-code-native-design'&&!r.url&&!r.inspectedReferenceSHA256),'source043 original provenance, no borrowed photo claim');assert.equal(s.nativeCarrier.newSpriteCount,40);assert.equal(s.nativeCarrier.cost,2000);}
metadata(scope);
const card='docs/branch/GPT-043-original-community-crafts-wave15.md',first=git(FIRST,card);
assert.equal(hash(first),'e1ddda14d1f7765a4bf72fdb7db05eb9605eb324fb3d1f94947b4fb78c8f1faa','source043 exact original-scope first-card bytes');assert(read(card).subarray(0,first.length).equals(first),'source043 first original criteria remain exact prefix');
// Every published file remains byte-exact, apart from the declared index,
// appended smoke hook and eventual exact CI-produced fingerprint adoption.
const entries=cp.execFileSync('git',['ls-tree','-r','-z','--full-tree',baseRef],{encoding:'utf8',maxBuffer:2*1024*1024}).split('\0').filter(Boolean);assert.equal(entries.length,1443,'source043 exact independent published file inventory');let retained=0;
for(const line of entries){const m=line.match(/^\d+ blob ([a-f0-9]{40})\t(.+)$/);if(!m)continue;const [,sha,file]=m;if(['index.html','smoke.js','fp.json','style.json'].includes(file))continue;const b=read(file),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');if(Object.hasOwn(releaseMetadata.PATCHES,file))releaseMetadata.verify(file,b,git(baseRef,file));else assert.equal(blob,sha,'source043 every published source byte unchanged '+file);retained++;}
assert.equal(retained,1439,'source043 all published non-declared files verified');
const smoke=read('smoke.js').toString(),a=smoke.indexOf('    // GPT-043 NEW SELFTEST START'),e='    // GPT-043 NEW SELFTEST END\n',b=smoke.indexOf(e,a);assert(a>=0&&b>a,'source043 unique added smoke hook');assert.equal(smoke.slice(0,a)+smoke.slice(b+e.length),git(baseRef,'smoke.js').toString(),'source043 every previous smoke assertion unchanged');
const phase=read('wave043-traffic-phase-fixture.js').toString(),point='Object.assign(window.GV,{art574:',end='/* GPT-043 RUNTIME END */';assert.equal(original.toString().split(point).length,2);
const phaseBase=original.toString().replace(point,phase+'\n'+point),phaseHead=full.replace(end,phase+'\n'+end);
assert.equal(phaseBase.replace(phase+'\n',''),original.toString(),'source043 CI-only BASE phase bridge strip exact');assert.equal(strip(phaseHead),original.toString(),'source043 HEAD phase bridge belongs only in removable CI block');assert(!full.includes('__wave043TrafficPhase'),'source043 production excludes phase helper');assert(!full.includes('installBritishWave043NineFixture'),'source043 production cannot use partial installer');
const negative=[],expect=(name,fn,target)=>{let first='';try{fn();}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'source043 intended first RED '+name+': '+first);negative.push({name,first,restored:true});};
const damaged=full.replace('</head>','<!-- outside043 -->\n</head>');parse(damaged);expect('valid HTML outside source boundary',()=>assert.equal(strip(damaged),original.toString(),'source043 source-boundary mismatch'),'source043 source-boundary mismatch');
const leaked=full.replace(point,phase+'\n'+point);parse(leaked);expect('CI phase helper leaked outside runtime boundary',()=>assert.equal(strip(leaked),original.toString(),'source043 source-boundary mismatch'),'source043 source-boundary mismatch');
expect('missing complete installer',()=>strip(full.replace('installBritishWave043();','')),'wave043 unique declared installation tail');
for(const [name,mutate,target]of[['one omitted original',s=>s.rows.pop(),'source043 exact original ten'],['reordered originals',s=>s.rows.reverse(),'source043 exact ordered original identities'],['wrong variant range',s=>s.rows[0].v=520,'source043 exact forty variant slots'],['false photograph claim',s=>s.rows[0].inspectedReferenceSHA256=['invented'],'source043 original provenance']]){const wrong=structuredClone(scope);mutate(wrong);expect(name,()=>metadata(wrong),target);metadata(scope);}
for(const file of Object.keys(releaseMetadata.PATCHES)){const old=git(BASE,file),good=read(file);releaseMetadata.verify(file,good,old);for(const [name,wrong] of [['old byte',Buffer.from('!'+good.toString().slice(1))],['missing insertion',old],['duplicate insertion',Buffer.concat([good,good])]])expect(name+' '+file,()=>releaseMetadata.verify(file,wrong,old),'release043 only exact declared metadata insertion '+file);}
expect('altered independent BASE',()=>release043.baseToRelease(original.toString().replace('</head>','<!-- outside BASE -->\n</head>')),'release043 independent BASE source');
expect('altered declared BASE inverse',()=>release043.restoreBase(declaredBase.replace('</head>','<!-- outside BASE -->\n</head>')),'release043 restore exact independent BASE');
let baselineStage='unchanged published baseline; candidate CI rebake still required';
if(fs.existsSync('docs/branch/GPT-043-raw-CI-baseline-adoption.json')){
  const p=JSON.parse(read('docs/branch/GPT-043-raw-CI-baseline-adoption.json'));assert.match(p.producerHead,/^[a-f0-9]{40}$/);assert(Number.isSafeInteger(p.run)&&Number.isSafeInteger(p.job));assert.equal(p.artSourceSHA256,hash(Buffer.from(sources.art)),'source043 adopted baseline binds to exact artwork');
  for(const f of['fp.json','style.json']){const pin=p.files.find(x=>x.name===f);assert(pin&&pin.bytes>0);const bytes=read(f),check=x=>assert(x.length===pin.bytes&&hash(x)===pin.sha256,'source043 exact raw CI baseline bytes '+f);check(bytes);const bad=Buffer.from(bytes);bad[bad.length-1]^=1;expect('one raw baseline byte '+f,()=>check(bad),'source043 exact raw CI baseline bytes '+f);}
  baselineStage='exact CI artifact bytes adopted; independent native fp proof still required';
}else for(const f of['fp.json','style.json'])assert(read(f).equals(git(baseRef,f)),'source043 candidate must retain published baseline before CI adoption '+f);
// Original 043 preparation is immutable C2 evidence, never rebound to release wrappers.
const originalContractFiles=['docs/branch/GPT-043-full-guard-preparation.json','wave043-original-scope.json','wave043-source.cjs','checkWave043FullSources.cjs'];
for(const file of originalContractFiles)assert(read(file).equals(git(C2,file)),'release043 original candidate contract unchanged '+file);
const guards=JSON.parse(read('docs/branch/GPT-043-full-guard-preparation.json'));
assert.equal(guards.base,BASE);assert.equal(guards.firstCardCommit,FIRST);assert.equal(guards.firstCardSHA256,hash(first));assert.equal(guards.artSource.sha256,hash(Buffer.from(sources.art)));for(const entry of guards.fullGuardPreparedSources){const src=read(entry.file);assert.equal(hash(src),entry.expectedSHA256,'source043 exact prepared complete native guard '+entry.file);assert(!src.includes(Buffer.from('sandbox556b')),'source043 retain native sandbox save key');for(const [,name]of src.toString().matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave043')assert(original.includes(Buffer.from(name)),'source043 native API exists in independent published main '+entry.file+': '+name);}
// New release guards are additional contracts; all original guards above remain frozen.
const releaseGuardPins=[{"file":"wave043-release-labels.cjs","sha256":"57c5f23478cecd3f2c81e522632a00f071b30a41e18a9619dec5592bf3c3b55c"},{"file":"probeBritishWaveRelease043.cjs","sha256":"7a863f616ef448a5588183d93d6f6ae2869293c2f980c43f986be30286d0ff71"},{"file":"probeNativePairsRelease043.cjs","sha256":"b53d5587306e383bad53bfc4c782e0f10027ed1002ab185a2cf1b4a5ea6398c1"},{"file":"probeScenesRelease043.cjs","sha256":"b3a2a84bd205dfba0057f7478fc7c5a86c52d886eaf33c01ebe3313f25bfbec8"},{"file":"probeTenPowerRelease043.cjs","sha256":"7b1629109a7b61bfa853d1467b4e132738fe2999bb3470a39defe7660d9f24bf"}];
const releaseGuardSources=[];
for(const pin of releaseGuardPins){
 const src=read(pin.file),check=bytes=>assert.equal(hash(bytes),pin.sha256,'release043 exact additional release guard '+pin.file);
 check(src);new vm.Script(src.toString(),{filename:pin.file});assert(!src.includes(Buffer.from('sandbox556b')),'release043 retain native sandbox save key');
 for(const [,name]of src.toString().matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave043')assert(original.includes(Buffer.from(name)),'release043 native API exists in independent BASE '+pin.file+': '+name);
 const bad=Buffer.from(src);bad[bad.length-1]^=1;expect('one additional release-guard byte '+pin.file,()=>check(bad),'release043 exact additional release guard '+pin.file);check(src);
 releaseGuardSources.push({...pin,bytes:src.length,sourceParsed:true,gameExecuted:false});
}
assert.equal(strip(full),original.toString());const report={ok:true,kind:'source-only-complete-original-ten-release-v2',base:BASE,baseObjectRead:baseRef,head:process.env.GITHUB_SHA||null,sourceSHA256:hash(Buffer.from(sources.art)),committedIndexSHA256:hash(current),retainedPublishedFiles:retained-2,protectedPublishedFiles:retained,declaredMetadataFilesChecked:2,releaseNegative,releaseGuardSources,originalCandidateContractsUnchanged:true,candidateCommit:C2,firstScopeCardSHA256:hash(first),sourceStripExact:true,sharedGuardsUnchanged:true,productionPhaseBridgeAbsent:true,inlineScripts:parse(full),negativeControls:negative,baselineStage,gameExecuted:false,rasterizerExecuted:false,renderedNewSprites:0,fullWaveAcceptance:false};
if(process.env.GITHUB_ACTIONS==='true'){fs.mkdirSync('shots/wave043/source-preparation',{recursive:true});fs.writeFileSync('shots/wave043/source-preparation/manifest.json',JSON.stringify(report,null,2)+'\n');}
console.log('WAVE043_SOURCE_PREPARATION '+JSON.stringify(report));
