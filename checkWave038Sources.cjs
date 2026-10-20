'use strict';
// Static source/byte checks only. No game, browser or raster execution.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {compose,strip,parse}=require('./wave038-source.cjs'),BASE='3e33523305401ea258e24204ea7218345a6dc268',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024}),current=fs.readFileSync('index.html');
assert(current.equals(original),'wave038 partial-preparation committed game source remains BASE');
const sources={art:fs.readFileSync('british-wave10-art038.js','utf8'),runtime:fs.readFileSync('wave038-runtime.js','utf8'),css:fs.readFileSync('wave038.css','utf8')},fixture=fs.readFileSync('wave038-nine-fixture.js','utf8');
assert.equal(hash(Buffer.from(sources.art)),'7ac802076803a9538fb318760269975a744ea7628968c48e0f8f62b14769ecab','wave038 retain independently reviewed art bytes');
const full=compose(current.toString(),sources),partial=compose(current.toString(),sources,fixture);
assert.equal(strip(full),original.toString(),'wave038 full future source strips exactly to independent BASE');
assert.equal(strip(partial,true),original.toString(),'wave038 explicitly partial fixture source strips exactly to independent BASE');
assert(!full.includes('GPT-038 CI NINE FIXTURE START'),'wave038 production composition excludes partial test setup');
assert.equal(compose(full,sources),full,'wave038 full composition idempotent');
const negative=[],expect=(name,fn,target)=>{let first='';try{fn();}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'source038 intended first RED '+name+': '+first);negative.push({name,first});};
const damaged=full.replace('</head>','<!-- legitimate HTML outside038 source boundary -->\n</head>');parse(damaged);
expect('valid HTML outside declared three blocks',()=>assert.equal(strip(damaged),original.toString(),'wave038 source-boundary mismatch'),'wave038 source-boundary mismatch');
expect('partial fixture cannot be accepted as full source',()=>strip(partial),'wave038 unique declared installation tail');
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
for(const file of [...guardPreparation.fullGuardPreparedSources.map(x=>x.file),'partialNinePairs038.cjs','partialNineChecks038.cjs','probePartialNative038.cjs','partialNinePower038.cjs','probeNightPower038.cjs']){
  const text=fs.readFileSync(file,'utf8');assert(!text.includes('sandbox556b'),'source038 original native sandbox save key '+file);
  for(const [,name]of text.matchAll(/GV\.([A-Za-z_$][A-Za-z0-9_$]*)/g))if(name!=='britishWave038'){
    assert(original.includes(Buffer.from(name)),'source038 reference exists in independent native source '+file+': '+name);nativeReferences.add(name);
  }
}
const report={base:BASE,head:process.env.GITHUB_SHA||null,scope:'static source preparation, not native ten-model acceptance',committedIndexSHA256:hash(current),artSourceSHA256:hash(Buffer.from(sources.art)),runtimeSHA256:hash(Buffer.from(sources.runtime)),cssSHA256:hash(Buffer.from(sources.css)),fixtureSHA256:hash(Buffer.from(fixture)),fullFutureCompositionSHA256:hash(Buffer.from(full)),partialFixtureSHA256:hash(Buffer.from(partial)),fullInlineBlocks:parse(full),partialInlineBlocks:parse(partial),sourceBoundaryNegative:negative,fullSourceStripByteEqual:true,partialSourceStripByteEqual:true,gameExecuted:false,fullWaveAcceptance:false};
if(process.env.GITHUB_ACTIONS==='true'){fs.mkdirSync('shots/wave038/source-preparation',{recursive:true});fs.writeFileSync('shots/wave038/source-preparation/manifest.json',JSON.stringify(report,null,2)+'\n');}
console.log('WAVE038_SOURCE_PREPARATION '+JSON.stringify(report));
