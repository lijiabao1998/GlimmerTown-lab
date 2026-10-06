#!/usr/bin/env node
'use strict';
// Reversible count-checked metadata/registry/fingerprint/import adaptations.
// Every original runtime body, runtime assertion and performance bound survives.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync,spawnSync}=require('node:child_process');
const fixed=require('./complexes-static-contract014'),ROOT=__dirname,legacy=require('./theatre-regression-adapter013');
const FILES={...legacy.FILES,theatre:'theatre-integration-qa013.js'};
const MUSEUM_MODES=[...legacy.MUSEUM_MODES],RIVERSIDE_MODES=[...legacy.RIVERSIDE_MODES],THEATRE_MODES=[...RIVERSIDE_MODES],COLD_CASES=[...legacy.COLD_CASES];
const IMPORT_COUNTS={museum:2,publiclife:9,station:9,streetlife:4,compatibility:1,riverside:2};
function immutableAudit014(){
 const files=execFileSync('git',['ls-tree','-r','-z','--name-only',fixed.BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(f=>f&&f!=='smoke.js'&&(/\.js$/.test(f)||/(?:release-pins|patch)\d+\.json$/.test(f)));
 return files.map(file=>{const current=fs.readFileSync(path.join(ROOT,file)),old=fixed.baseFile(file);if(!current.equals(old))throw Error('Historical tracked source changed from deployed T726: '+file);return{file,sha256:fixed.hash(current),deployedExact:true};});
}
function exactRange014(original,adapted,start,end){
 if(original.split(start).length!==2||adapted.split(start).length!==2||(end&&(original.split(end).length!==2||adapted.split(end).length!==2)))throw Error('Nonunique source-preservation range: '+start);
 const part=s=>s.slice(s.indexOf(start),end?s.indexOf(end,s.indexOf(start)):undefined);if(part(original)!==part(adapted))throw Error('Historical runtime body/assertions changed: '+start);
 return{start,end:end||null,sha256:fixed.hash(part(original)),bytes:Buffer.byteLength(part(original)),exact:true};
}
function buildAdapter014(suite){
 const file=FILES[suite];if(!file)throw Error('Unknown complexes historical suite');
 const historicalSources=immutableAudit014(),original=fs.readFileSync(path.join(ROOT,file),'utf8');
 const previous=suite==='theatre'?{adapted:original,proof:{originalExact:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true},audit:[]}:legacy.buildAdapter013(suite);
 let adapted=previous.adapted;const audit=[],preservedRanges=[];
 const replace=(from,to,count=1)=>{if(from===to||adapted.split(from).length-1!==count)throw Error('Count-checked014 gate anchor mismatch: '+from);adapted=adapted.split(from).join(to);audit.push({from,to,count});};
 if(IMPORT_COUNTS[suite])replace('./theatre-historical-bridge013','./complexes-historical-bridge014',IMPORT_COUNTS[suite]);
 if(suite==='publiclife'||suite==='station'){
  replace("!(((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.29'&&staticProof.anchor==='T725')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.30'&&staticProof.anchor==='T726'))&&nativeProof.proof.museumLineageExact&&nativeProof.proof.riversideLineageExact&&nativeProof.proof.projectedOnlyDeclared52&&nativeProof.proof.riversideOldLeaves===2895&&nativeProof.proof.riversideNewLeaves===24&&nativeProof.proof.theatreOldLeaves===2919&&nativeProof.proof.theatreNewLeaves===28&&nativeProof.proof.currentLeaves===2947)","!((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.30'&&staticProof.anchor==='T726')&&nativeProof.proof.museumLineageExact&&nativeProof.proof.riversideLineageExact&&nativeProof.proof.theatreLineageExact&&nativeProof.proof.projectedOnlyDeclared164&&nativeProof.proof.riversideOldLeaves===2895&&nativeProof.proof.riversideNewLeaves===24&&nativeProof.proof.theatreOldLeaves===2919&&nativeProof.proof.theatreNewLeaves===28&&nativeProof.proof.complexesOldLeaves===2947&&nativeProof.proof.complexesNewLeaves===112&&nativeProof.proof.currentLeaves===3059)");
  replace("require('./complexes-historical-bridge014').priorLog013(full)","require('./complexes-historical-bridge014').priorLog014(full)");
  replace("...require('./theatre-static-contract013').expectedAdditions]","...require('./theatre-static-contract013').expectedAdditions,...require('./complexes-static-contract014').expectedAdditions]",2);
  replace("all2795 prior leaves paired with exactly152 declared additions',Object.keys(fp.subs||{}).length===2947","all2795 prior leaves paired with exactly264 declared additions',Object.keys(fp.subs||{}).length===3059");
  replace('exactly152 cumulative declared canonical leaves','exactly264 cumulative declared canonical leaves');
  replace("exactly seven declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"theatre013\\\"]'","exactly eight declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"complexes014\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"theatre013\\\"]'");
  replace('all2807 old leaves exact and exactly140 declared cumulative additions','all2807 old leaves exact and exactly252 declared cumulative additions');
  replace('complete in-memory QA extension equals every2947 native leaf and family aggregate','complete in-memory QA extension equals every3059 native leaf and family aggregate');
 }
 let additionalWorld='';
 if(suite==='compatibility'){
  replace("const ROOT=__dirname,BASE='"+require('./theatre-static-contract013').BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");
  replace("const HASH='"+require('./theatre-static-contract013').BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  replace("require('./theatre-compatibility013').normalizeCompatibility013(out.runs,staticProof)","require('./complexes-compatibility014').normalizeCompatibility014(out.runs,staticProof)");
  replace("label==='candidate'?staticProof.version:'14.29'","label==='candidate'?staticProof.version:'14.30'",3);
  replace("label==='candidate'?staticProof.anchor:'T725'","label==='candidate'?staticProof.anchor:'T726'",3);
  const before="        if(cdp.errors.length){out.consoleErrors={label,errors:cdp.errors};throw Error(label+' console or uncaught errors: '+JSON.stringify(cdp.errors));}return arr;";
  additionalWorld="        const theatreCompat=require('./complexes-compatibility014');\n        const theatre=await theatreCompat.runCompleteTheatreWorld014(cdp,seedApprovedBritishLegacy007,label==='candidate'?staticProof.version:'14.30',label==='candidate'?staticProof.anchor:'T726');\n        if(theatre.checkpoints.length!==9||!theatre.nativeSaveMetadataExact||!theatre.nativeLoadIdentitiesExact||!theatre.nativeContinueIdentitiesExact||!theatre.continueSaveBytesExact||!theatre.actualPageReload||!theatre.reloadedSourceExact||!theatre.followingContinueDay||!theatre.otherSlotsUnchanged||theatre.checkpoints.some(q=>q.difficulty!==1||q.roots.length!==1||q.roots[0].k!==281||q.roots[0].cells.length!==9||q.paths.length!==6||q.retained.length!==47||q.water.length!==70||q.shoreline.length!==13||q.enterprise.version!==(label==='candidate'?staticProof.version:'14.30')||q.enterprise.anchor!==(label==='candidate'?staticProof.anchor:'T726')))throw Error('Complete paid T726 theatre with real Page.reload/Continue comparison checkpoints missing');\n        const observedTheatre={seed:900726,kind:'Immutable full paid T726 theatre: all roots/refs/tiles/stats/RNG, complete raw native saves, native load, real cold Continue and following ordinary day',...theatre,checkpoints:theatre.checkpoints.map(({tiles,...q})=>({...q,tilesSHA256:hash(JSON.stringify(tiles))}))};\n        const separatedTheatre=theatreCompat.separateTheatreTiming014(observedTheatre);\n        (out.theatreTimingEvidence014||(out.theatreTimingEvidence014=[])).push({label,...separatedTheatre.evidence});\n        arr.push(separatedTheatre.world);\n";
  replace(before,additionalWorld+before);
 }
 if(suite==='coldload'){
  replace("const {verifyStatic013:verifyStatic011}=require('./theatre-static-contract013');","const {verifyStatic014:verifyStatic011}=require('./complexes-static-contract014');");
  replace("const {verifyFingerprint013:verifyFingerprint011}=require('./theatre-fingerprint-qa013');","const {verifyFingerprint014:verifyFingerprint011}=require('./complexes-fingerprint-qa014');");
  replace("check('exact T725 candidate or approved T726 theatre release labels',version===report.static.version&&anchor===report.static.anchor&&((report.static.release===false&&report.static.phase==='candidate'&&version==='14.29'&&anchor==='T725')||(report.static.release===true&&report.static.phase==='release'&&version==='14.30'&&anchor==='T726'))&&report.static.coldLoadFixExact,{version,anchor});","check('exact T726 candidate and byte-exact approved T724 cold-load fix',version===report.static.version&&anchor===report.static.anchor&&report.static.release===false&&report.static.phase==='candidate'&&version==='14.30'&&anchor==='T726'&&report.static.coldLoadFixExact,{version,anchor});");
  replace("check('all2919 approved leaves and1728 blocks exact plus precisely28 theatre leaves in159 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2919&&report.fingerprint.newLeaves===28&&fp.stats.leaves===2947&&fp.stats.families===159&&blocks.count===1728,report.fingerprint);","check('all2947 approved leaves and1728 complete blocks exact plus precisely112 complex leaves in160 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2947&&report.fingerprint.newLeaves===112&&fp.stats.leaves===3059&&fp.stats.families===160&&blocks.count===1728&&report.fingerprint.completeBlockRecordsExact,report.fingerprint);");
 }
 if(suite==='theatre'){
  replace("const {verifyStatic013,BASE}=require('./theatre-static-contract013'),{verifyFingerprint013,staticTest013}=require('./theatre-fingerprint-qa013');","const {verifyStatic013,THEATRE_BASE:BASE,verifyFingerprint013,staticTest013}=require('./complexes-historical-bridge014');");
  preservedRanges.push(exactRange014(original,adapted,"const {legacyFixtures013,functions013}"));
 }
 if(suite==='riverside')preservedRanges.push(exactRange014(original,adapted,'const ROOT = __dirname'));
 if(suite==='museum')preservedRanges.push(exactRange014(original,adapted,'function nativeScene010('));
 if(suite==='compatibility'){
  preservedRanges.push(exactRange014(original,adapted,'const originalRng=','(async()=>'));
  preservedRanges.push(exactRange014(original,adapted,'    out.ok=JSON.stringify(reference)===JSON.stringify(comparison);'));
  const extraStart="        const museumCompat=",extraEnd="        if(cdp.errors.length)";
  if(adapted.split(extraStart).length!==2||adapted.split(extraEnd).length!==2)throw Error('Unique additive compatibility world boundaries required');
  const olderFive=adapted.slice(0,adapted.indexOf(extraStart))+adapted.slice(adapted.indexOf(extraEnd));
  preservedRanges.push(exactRange014(original,olderFive,"    for(const [label,bytes]of[['baseline',old],['candidate',current]]){",extraEnd));
 }
 if(suite==='coldload'){
  preservedRanges.push(exactRange014(original,adapted,'function coldSnapshot011(','(async()=>'));
  preservedRanges.push(exactRange014(original,adapted,'  for(const caseName of CASES){'));
 }
 if(suite==='streetlife')preservedRanges.push(exactRange014(original,adapted,"const start='function setupStreet009('"));
 let recovered=adapted;for(const edit of[...audit].reverse()){
  if(recovered.split(edit.to).length-1!==edit.count)throw Error('Adapter audit cannot uniquely reverse: '+edit.to);recovered=recovered.split(edit.to).join(edit.from);
 }
 if(recovered!==previous.adapted)throw Error('Unlisted historical014 runner edit');new vm.Script(adapted,{filename:'.complexes-'+suite+'-runtime014.js'});
 return{file,original,adapted,audit,proof:{suite,baseline:fixed.BASE,originalSHA256:fixed.hash(original),previousAdapterSHA256:fixed.hash(previous.adapted),adaptedSHA256:fixed.hash(adapted),originalExact:true,trackedHistoricalSourcesExact:true,historicalSources,previousSourceAudit:previous.proof,previousTransformations:previous.audit,preservedRanges,reversibleExactSourceAudit:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true,gateOnly:suite!=='compatibility',originalSevenCompatibilityWorldsRetained:suite==='compatibility',additionalFullTheatreCompatibility:suite==='compatibility',actualColdContinueAdded:suite==='compatibility',boundedMetadataNormalizationPaths:[],exactCandidateLabels:true,coldloadCaseBodiesExact:suite==='coldload',allTheatreRuntimeBytesExceptImportsExact:suite==='theatre',allRiversideRuntimeBytesExceptImportsExact:suite==='riverside'}};
}
function nestedStatic014(suite,q){return legacy.nestedStatic013(suite,q);}
function staticTest014(){
 const results=[];for(const suite of Object.keys(FILES)){const q=buildAdapter014(suite);results.push({...q.proof,...nestedStatic014(suite,q),transformations:q.audit.length});}
 const compat=require('./complexes-compatibility014');new vm.Script(compat.fixtureSource014());
 return{ok:true,sourceOnly:true,gameExecuted:false,metadataNormalization:compat.staticNormalizationTest014(),museumModes:MUSEUM_MODES,riversideModes:RIVERSIDE_MODES,theatreModes:THEATRE_MODES,coldloadCases:COLD_CASES,results};
}
function pinnedSourceControls014(){
 // Execute the UNCHANGED old release data-test file against an immutable T726
 // filesystem view. This tests old source controls, never approves new014 art.
 const historicalFiles=['theatre-release-contract013.test.js','theatre-release-contract013.js'];
 for(const file of historicalFiles)if(!fs.readFileSync(path.join(ROOT,file)).equals(fixed.baseFile(file)))throw Error('Immutable historical data-test source changed');
 const index=path.join(ROOT,'index.html'),reader=new Proxy(fs,{get(target,key){if(key==='readFileSync')return(p,...args)=>path.resolve(String(p))===index?(args[0]?fixed.baseFile('index.html').toString(typeof args[0]==='string'?args[0]:args[0]?.encoding||'utf8'):fixed.baseFile('index.html')):target.readFileSync(p,...args);return target[key];}});
 const modules=new Map(),logs=[],load=file=>{if(modules.has(file))return modules.get(file);const module={exports:{}};modules.set(file,module.exports);const text=fs.readFileSync(path.join(ROOT,file),'utf8'),localRequire=id=>(id==='fs'||id==='node:fs')?reader:id==='./theatre-release-contract013'?load('theatre-release-contract013.js'):require(id);const context={require:localRequire,module,exports:module.exports,__dirname:ROOT,__filename:path.join(ROOT,file),process:{...process,argv:[process.execPath,path.join(ROOT,file)]},Buffer,console:{log:s=>logs.push(String(s))},structuredClone};const keys=Object.keys(context),run=new vm.Script('(function('+keys.join(',')+'){'+text.replace(/^#![^\n]*/,s=>'//'+s.slice(2))+'\n})',{filename:'immutable-t726-'+file}).runInThisContext();run(...keys.map(k=>context[k]));modules.set(file,module.exports);return module.exports;};
 load('theatre-release-contract013.test.js');const releaseControls=JSON.parse(logs.at(-1));if(!releaseControls.ok||releaseControls.rejectedCount!==45||releaseControls.nativeNegativeCases!==0)throw Error('Complete original release data controls missing');
 return{ok:true,sourceOnly:true,gameExecuted:false,filesWritten:false,baselineOnlySourceControls:true,baseline:fixed.BASE,baselineHTMLSHA256:fixed.BASE_HTML_SHA256,releaseControls};
}
function historicalSourceTests014(){const product=require('./complexes-historical-bridge014').currentProduct014();return{...pinnedSourceControls014(),currentCandidateSourceVerified:true,currentSourceSHA256:product.sourceSHA256};}
function run014(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Runtime adapters run only in authorized isolated GitHub Actions');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.CX014_SUITE||'museum',mode=process.env.CX014_MODE||(suite==='coldload'?'all':['museum','riverside','theatre'].includes(suite)?'preflight':'gameplay');
 if(!FILES[suite]||(suite==='museum'&&!MUSEUM_MODES.includes(mode))||(suite==='riverside'&&!RIVERSIDE_MODES.includes(mode))||(suite==='theatre'&&!THEATRE_MODES.includes(mode))||(suite==='coldload'&&mode!=='all'&&!COLD_CASES.includes(mode))||(!['museum','riverside','theatre','coldload'].includes(suite)&&mode!=='gameplay'))throw Error('Unknown historical suite/mode');
 const product=fixed.verifyStatic014(),q=buildAdapter014(suite),native=require('./complexes-fingerprint-qa014').readPreflight014();
 const out=path.join(ROOT,'complexes-evidence','historical',suite,mode,'guards');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'runtime-adapter.json'),JSON.stringify({...q.proof,...nestedStatic014(suite,q),checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,release:product.release,changes:q.audit,strictNativeProjection:native.proof,preflightEvidenceSHA256:native.evidenceSHA256},null,2));
 const temp=path.join(ROOT,'.complexes-'+suite+'-runtime014.js');
 try{fs.writeFileSync(temp,q.adapted);const cases=suite==='coldload'?(mode==='all'?COLD_CASES:[mode]):[null];for(const coldCase of cases){const result=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,TH013_MODE:mode,...(coldCase?{COLD011_CASE:coldCase}:{})},stdio:'inherit',timeout:45*60*1000});if(result.error)throw result.error;if(result.status!==0){process.exitCode=result.status??1;break;}}}finally{fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter014,staticTest014,nestedStatic014,immutableAudit014,historicalSourceTests014,pinnedSourceControls014,FILES,MUSEUM_MODES,RIVERSIDE_MODES,THEATRE_MODES,COLD_CASES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest014(),null,2));else if(process.argv.includes('--historical-source-tests'))console.log(JSON.stringify(historicalSourceTests014(),null,2));else run014();}
