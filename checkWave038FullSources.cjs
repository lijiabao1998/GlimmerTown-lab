'use strict';
// Static source/byte checks only. No game, browser or raster execution.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {compose,strip,parse}=require('./wave038-source.cjs'),BASE='3e33523305401ea258e24204ea7218345a6dc268',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024}),current=fs.readFileSync('index.html');
// Complete candidate integration now embeds exactly its three declared blocks; no other production edits.
const sources={art:fs.readFileSync('british-wave10-art038.js','utf8'),runtime:fs.readFileSync('wave038-runtime.js','utf8'),css:fs.readFileSync('wave038.css','utf8')},fixture=fs.readFileSync('wave038-nine-fixture.js','utf8');
const approvedArg=process.argv.find(x=>x.startsWith('--approved-art='));
assert(!approvedArg||process.env.GITHUB_ACTIONS!=='true','wave038 CI requires the approved actual C18 Git object');
const approved=approvedArg?fs.readFileSync(approvedArg.slice('--approved-art='.length),'utf8'):cp.execFileSync('git',['show','e2f197bd5a10307fd8697ededb517aa51fe89a7f:british-wave10-art038.js'],{encoding:'utf8'});
assert.equal(hash(Buffer.from(approved)),'7ac802076803a9538fb318760269975a744ea7628968c48e0f8f62b14769ecab','wave038 approved nine source independently pinned');
function retainedNine(text){
  let out=text;
  const a=out.indexOf('  {\n    "id": "silver",'),b=out.indexOf('  {\n    "id": "harrods",',a);
  assert(a>=0&&b>a,'source038 unique Silver row before Harrods');out=out.slice(0,a)+out.slice(b);
  const start=out.indexOf('  // Silver alone:');
  if(start>=0){const end=out.indexOf('  function harrods(row,view){',start);assert(end>start,'source038 unique Silver authored block');out=out.slice(0,start)+out.slice(end);}
  out=out.replace(/^ \* (Nine candidates only;|Ten source-supported candidates;).*\n/m,'');
  out=out.replace(/^  \/\/ (Nine photo-supported candidates\.|Photo-supported frozen candidates;).*\n/m,'');
  out=out.replace('const MODELS=Object.freeze({leedsCorn,darlington,halifax,bishoplloyd,burlington,silver,harrods,liberty,danum,willow});','const MODELS=Object.freeze({leedsCorn,darlington,halifax,bishoplloyd,burlington,harrods,liberty,danum,willow});');
  return out;
}
function assertNine(text){assert.equal(retainedNine(text),retainedNine(approved),'source038 retain every approved nine/helper/other-row byte outside declared Silver additions');}
assertNine(sources.art);
const full=compose(original.toString(),sources),partial=compose(original.toString(),sources,fixture);
assert.equal(current.toString(),full,'source038 complete committed production equals exact source composition');
assert.equal(strip(full),original.toString(),'wave038 full future source strips exactly to independent BASE');
assert.equal(strip(partial,true),original.toString(),'wave038 explicitly partial fixture source strips exactly to independent BASE');
assert(!full.includes('GPT-038 CI NINE FIXTURE START'),'wave038 production composition excludes partial test setup');
assert.equal(compose(full,sources),full,'wave038 full composition idempotent');
const phaseBridge=fs.readFileSync('wave038-traffic-phase-fixture.js','utf8'),phasePoint='Object.assign(window.GV,{art574:';
assert.equal(original.toString().split(phasePoint).length,2,'source038 unique BASE phase bridge location');
const phaseBase=original.toString().replace(phasePoint,phaseBridge+'\n'+phasePoint),phaseHead=compose(original.toString(),sources,fixture+'\n'+phaseBridge);
assert.equal(phaseBase.split(phaseBridge+'\n').length,2,'source038 unique CI bridge in BASE');
assert.equal(phaseBase.replace(phaseBridge+'\n',''),original.toString(),'source038 phase BASE removes only CI bridge to exact independent Git bytes');
assert.equal(strip(phaseHead,true),original.toString(),'source038 phase HEAD three blocks strip to exact independent Git bytes');
assert(!full.includes('__wave038TrafficPhase'),'source038 production excludes traffic-phase helper');
const negative=[],expect=(name,fn,target)=>{let first='';try{fn();}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'source038 intended first RED '+name+': '+first);negative.push({name,first});};
expect('genuine retained-helper source mutation',()=>assertNine(sources.art.replace('function context(row,view){','function context(row,view){/* wrong shared helper */')),'source038 retain every approved nine/helper/other-row byte outside declared Silver additions');
const damaged=full.replace('</head>','<!-- legitimate HTML outside038 source boundary -->\n</head>');parse(damaged);
expect('valid HTML outside declared three blocks',()=>assert.equal(strip(damaged),original.toString(),'wave038 source-boundary mismatch'),'wave038 source-boundary mismatch');
expect('partial fixture cannot be accepted as full source',()=>strip(partial),'wave038 unique declared installation tail');
const phaseLeak=full.replace(phasePoint,phaseBridge+'\n'+phasePoint);parse(phaseLeak);
expect('valid phase bridge leaked outside production boundaries',()=>assert.equal(strip(phaseLeak),original.toString(),'wave038 source-boundary mismatch'),'wave038 source-boundary mismatch');
assert.equal(strip(full),original.toString(),'source038 restored full source');
const card='docs/branch/GPT-038-british-wave10-commerce-markets.md',localFirst=process.argv.find(x=>x.startsWith('--first-card='));
assert(!localFirst||process.env.GITHUB_ACTIONS!=='true','wave038 CI requires the actual C1 Git object');
const first=localFirst?fs.readFileSync(localFirst.slice('--first-card='.length),'utf8'):cp.execFileSync('git',['show','95373e6e6222cfa54830323adc8e9b0fba24120f:'+card],{encoding:'utf8'});
assert.equal(hash(Buffer.from(first)),'e59c1317fb328a9f2b3d19415fb10b46bf28d1d7c677fb532cbc93912a934eb7','wave038 exact original first-card bytes');
assert(fs.readFileSync(card,'utf8').startsWith(first),'wave038 first-card criteria remain exact prefix');
const smoke=fs.readFileSync('smoke.js','utf8'),smokeStart=smoke.indexOf('    // GPT-038 NEW SELFTEST START'),smokeEnd=smoke.indexOf('    // GPT-038 NEW SELFTEST END\n',smokeStart);
assert(smokeStart>=0&&smokeEnd>smokeStart,'source038 unique appended smoke hook');
assert.equal(smoke.slice(0,smokeStart)+smoke.slice(smokeEnd+'    // GPT-038 NEW SELFTEST END\n'.length),cp.execFileSync('git',['show',BASE+':smoke.js'],{encoding:'utf8'}),'source038 every previous smoke assertion byte unchanged');
for(const file of['fp.js','fp.json','style.json','harness.js','gallery.js','british-use-scales-kit021.js','british-complex-primitives014.js'])assert(fs.readFileSync(file).equals(cp.execFileSync('git',['show',BASE+':'+file],{maxBuffer:8*1024*1024})),'source038 unchanged shared source '+file);
const guardPreparation=JSON.parse(fs.readFileSync('docs/branch/GPT-038-full-guard-preparation.json','utf8'));
for(const entry of guardPreparation.fullGuardPreparedSources)assert.equal(hash(fs.readFileSync(entry.file)),entry.expectedSHA256,'source038 exact prepared full ten-model guard '+entry.file);
const nativeReferences=new Set();
for(const file of [...guardPreparation.fullGuardPreparedSources.map(x=>x.file),'partialNinePairs038.cjs','partialNineChecks038.cjs','probePartialNative038.cjs','partialNinePower038.cjs','probeNightPower038.cjs','nativeTenPower038.cjs','probeTenPower038.cjs','wave038-traffic-phase-fixture.js']){
  const text=fs.readFileSync(file,'utf8');assert(!text.includes('sandbox556b'),'source038 original native sandbox save key '+file);
  for(const [,name]of text.matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave038'){
    assert(original.includes(Buffer.from(name)),'source038 reference exists in independent native source '+file+': '+name);nativeReferences.add(name);
  }
}
const report={base:BASE,head:process.env.GITHUB_SHA||null,scope:'static complete-ten production source boundaries, not native whole-wave acceptance',committedIndexSHA256:hash(current),artSourceSHA256:hash(Buffer.from(sources.art)),approvedNineRetainedByteExact:true,approvedNineArtSourceSHA256:hash(Buffer.from(approved)),runtimeSHA256:hash(Buffer.from(sources.runtime)),cssSHA256:hash(Buffer.from(sources.css)),fixtureSHA256:hash(Buffer.from(fixture)),fullFutureCompositionSHA256:hash(Buffer.from(full)),partialFixtureSHA256:hash(Buffer.from(partial)),phaseBaseFixtureSHA256:hash(Buffer.from(phaseBase)),phaseHeadFixtureSHA256:hash(Buffer.from(phaseHead)),trafficBridgeSHA256:hash(Buffer.from(phaseBridge)),phaseBaseInlineBlocks:parse(phaseBase),phaseHeadInlineBlocks:parse(phaseHead),productionTrafficBridgeAbsent:true,fullInlineBlocks:parse(full),partialInlineBlocks:parse(partial),sourceBoundaryNegative:negative,fullSourceStripByteEqual:true,partialSourceStripByteEqual:true,gameExecuted:false,fullWaveAcceptance:false};
if(process.env.GITHUB_ACTIONS==='true'){fs.mkdirSync('shots/wave038/source-preparation',{recursive:true});fs.writeFileSync('shots/wave038/source-preparation/manifest.json',JSON.stringify(report,null,2)+'\n');}
console.log('WAVE038_SOURCE_PREPARATION '+JSON.stringify(report));
