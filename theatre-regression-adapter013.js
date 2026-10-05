#!/usr/bin/env node
'use strict';
// Count-checked temporary adapters only. Every tracked older source/assertion is
// immutable. --static-test compiles source/data, never browser/game code.
const fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync,spawnSync}=require('child_process');
const fixed=require('./theatre-static-contract013'),ROOT=__dirname;
const legacy=require('./riverside-regression-adapter012');
const FILES={...legacy.FILES,riverside:'riverside-integration-qa012.js'};
const MUSEUM_MODES=[...legacy.MUSEUM_MODES],RIVERSIDE_MODES=[...MUSEUM_MODES,'coldload'];
const COLD_CASES=[...legacy.COLD_CASES];
const IMPORT_COUNTS={museum:2,publiclife:9,station:9,streetlife:4,compatibility:1};
const HISTORICAL_FILES=[...new Set([...Object.values(FILES),'riverside-regression-adapter012.js','riverside-historical-bridge012.js','riverside-museum-compat012.js','riverside-static-contract012.js','riverside-fingerprint-qa012.js','riverside-release-contract012.js','riverside-release-pins012.json','museum-static-contract010.js','museum-fingerprint-qa010.js','streetlife-static-contract009.js','streetlife-fingerprint-qa009.js','publiclife-integration-qa.js','station-integration-qa008.js','streetlife-integration-qa009.js','publiclife-legacy-fixture007.js','station-legacy-fixture008.js','coldload-static-contract011.js','coldload-fingerprint-qa011.js'])];
function immutableAudit013(){
 return HISTORICAL_FILES.map(file=>{const current=fs.readFileSync(path.join(ROOT,file)),old=fixed.baseFile(file);if(!current.equals(old))throw Error('Historical tracked source changed from deployed T725: '+file);return{file,sha256:fixed.hash(current),deployedExact:true};});
}
function exactRange013(original,adapted,start,end){
 if(original.split(start).length!==2||adapted.split(start).length!==2||(end&&(original.split(end).length!==2||adapted.split(end).length!==2)))throw Error('Nonunique source-preservation range: '+start);
 const part=s=>s.slice(s.indexOf(start),end?s.indexOf(end,s.indexOf(start)):undefined);
 if(part(original)!==part(adapted))throw Error('Historical runtime body/assertions changed: '+start);
 return{start,end:end||null,sha256:fixed.hash(part(original)),bytes:Buffer.byteLength(part(original)),exact:true};
}
function buildAdapter013(suite){
 const file=FILES[suite];if(!file)throw Error('Unknown theatre historical suite');
 const historicalSources=immutableAudit013(),original=fs.readFileSync(path.join(ROOT,file),'utf8');
 const previous=suite==='riverside'?{adapted:original,proof:{originalExact:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true},audit:[]}:legacy.buildAdapter012(suite);
 let adapted=previous.adapted;const audit=[],preservedRanges=[];
 const replace=(from,to,count=1)=>{if(from===to||adapted.split(from).length-1!==count)throw Error('Count-checked theatre gate anchor mismatch: '+from);adapted=adapted.split(from).join(to);audit.push({from,to,count});};
 if(IMPORT_COUNTS[suite])replace('./riverside-historical-bridge012','./theatre-historical-bridge013',IMPORT_COUNTS[suite]);
 if(suite==='publiclife'||suite==='station'){
  replace("!(((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.28'&&staticProof.anchor==='T724')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.29'&&staticProof.anchor==='T725'))&&nativeProof.proof.museumLineageExact&&nativeProof.proof.projectedOnlyDeclared24&&nativeProof.proof.riversideOldLeaves===2895&&nativeProof.proof.riversideNewLeaves===24&&nativeProof.proof.currentLeaves===2919)","!(((staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.29'&&staticProof.anchor==='T725')||(staticProof.release===true&&staticProof.phase==='release'&&staticProof.version==='14.30'&&staticProof.anchor==='T726'))&&nativeProof.proof.museumLineageExact&&nativeProof.proof.riversideLineageExact&&nativeProof.proof.projectedOnlyDeclared52&&nativeProof.proof.riversideOldLeaves===2895&&nativeProof.proof.riversideNewLeaves===24&&nativeProof.proof.theatreOldLeaves===2919&&nativeProof.proof.theatreNewLeaves===28&&nativeProof.proof.currentLeaves===2947)");
  replace("require('./theatre-historical-bridge013').priorLog012(full)","require('./theatre-historical-bridge013').priorLog013(full)");
  replace("...require('./riverside-static-contract012').expectedAdditions]","...require('./riverside-static-contract012').expectedAdditions,...require('./theatre-static-contract013').expectedAdditions]",2);
  replace("all2795 prior leaves paired with exactly124 declared additions',Object.keys(fp.subs||{}).length===2919","all2795 prior leaves paired with exactly152 declared additions',Object.keys(fp.subs||{}).length===2947");
  replace('exactly124 cumulative declared canonical leaves','exactly152 cumulative declared canonical leaves');
  replace("exactly six declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\"]'","exactly seven declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\",\\\"theatre013\\\"]'");
  replace('all2807 old leaves exact and exactly112 declared cumulative additions','all2807 old leaves exact and exactly140 declared cumulative additions');
  replace('complete in-memory QA extension equals every2919 native leaf and family aggregate','complete in-memory QA extension equals every2947 native leaf and family aggregate');
 }
 let additionalWorld='';
 if(suite==='compatibility'){
  replace("const ROOT=__dirname,BASE='"+require('./riverside-static-contract012').BASE+"';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");
  replace("const HASH='"+require('./riverside-static-contract012').BASE_HTML_SHA256+"';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  replace("require('./riverside-museum-compat012').normalizeCompatibility012(out.runs,staticProof)","require('./theatre-compatibility013').normalizeCompatibility013(out.runs,staticProof)");
  // Keep the sixth museum routine/fixture and every checkpoint assertion. Only
  // its declared immutable baseline metadata moves from T724 to deployedT725.
  replace("q.enterprise.version!==(label==='candidate'?staticProof.version:'14.28')||q.enterprise.anchor!==(label==='candidate'?staticProof.anchor:'T724')","q.enterprise.version!==(label==='candidate'?staticProof.version:'14.29')||q.enterprise.anchor!==(label==='candidate'?staticProof.anchor:'T725')");
  const before="        if(cdp.errors.length){out.consoleErrors={label,errors:cdp.errors};throw Error(label+' console or uncaught errors: '+JSON.stringify(cdp.errors));}return arr;";
  additionalWorld="        const riversideCompat=require('./theatre-compatibility013');\n        const riverside=await cdp.evalJs('(()=>{'+riversideCompat.fixtureSource013()+';return ('+riversideCompat.runRiversideWorld013.toString()+')(setupRiverside012,('+seedApprovedBritishLegacy007.toString()+'),'+JSON.stringify(label==='candidate'?staticProof.version:'14.29')+','+JSON.stringify(label==='candidate'?staticProof.anchor:'T725')+');})()');\n        if(riverside.checkpoints.length!==7||!riverside.nativeSaveMetadataExact||!riverside.nativeLoadIdentitiesExact||!riverside.otherSlotsUnchanged||riverside.checkpoints.some(q=>q.difficulty!==1||q.roots.length!==3||q.paths.length!==36||q.retained.length!==47||q.water.length!==70||q.shoreline.length!==13||q.enterprise.version!==(label==='candidate'?staticProof.version:'14.29')||q.enterprise.anchor!==(label==='candidate'?staticProof.anchor:'T725')))throw Error('Complete paid T725 riverside comparison checkpoints missing');\n        arr.push({seed:900725,kind:'Immutable full paid T725 riverside: all tiles/stats/RNG, full native save bytes, native load and following day',fixture:riverside.fixture,nativeSave:riverside.nativeSave,nativeSaveMetadataExact:riverside.nativeSaveMetadataExact,nativeLoadIdentitiesExact:riverside.nativeLoadIdentitiesExact,otherSlotsUnchanged:riverside.otherSlotsUnchanged,checkpoints:riverside.checkpoints.map(({tiles,...q})=>({...q,tilesSHA256:hash(JSON.stringify(tiles))}))});\n";
  replace(before,additionalWorld+before);
 }
 if(suite==='coldload'){
  replace("const {verifyStatic012:verifyStatic011}=require('./riverside-static-contract012');","const {verifyStatic013:verifyStatic011}=require('./theatre-static-contract013');");
  replace("const {verifyFingerprint012:verifyFingerprint011}=require('./riverside-fingerprint-qa012');","const {verifyFingerprint013:verifyFingerprint011}=require('./theatre-fingerprint-qa013');");
  replace("check('exact T724 candidate or authorized T725 riverside release labels',version===report.static.version&&anchor===report.static.anchor&&((report.static.release===false&&report.static.phase==='candidate'&&version==='14.28'&&anchor==='T724')||(report.static.release===true&&report.static.phase==='release'&&version==='14.29'&&anchor==='T725')),{version,anchor});","check('exact T725 candidate or approved T726 theatre release labels',version===report.static.version&&anchor===report.static.anchor&&((report.static.release===false&&report.static.phase==='candidate'&&version==='14.29'&&anchor==='T725')||(report.static.release===true&&report.static.phase==='release'&&version==='14.30'&&anchor==='T726'))&&report.static.coldLoadFixExact,{version,anchor});");
  replace("check('all2895 approved leaves and1728 blocks exact plus precisely24 riverside leaves in158 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2895&&report.fingerprint.newLeaves===24&&fp.stats.leaves===2919&&fp.stats.families===158&&blocks.count===1728,report.fingerprint);","check('all2919 approved leaves and1728 blocks exact plus precisely28 theatre leaves in159 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2919&&report.fingerprint.newLeaves===28&&fp.stats.leaves===2947&&fp.stats.families===159&&blocks.count===1728,report.fingerprint);");
 }
 if(suite==='riverside'){
  // The complete twelve-mode native body and every assertion are byte-exact.
  // Its original24 proof is a full-record projection, after strict native28.
  replace("const { verifyStatic012, BASE } = require('./riverside-static-contract012');","const { verifyStatic012, RIVERSIDE_BASE: BASE } = require('./theatre-historical-bridge013');");
  replace("const { verifyFingerprint012 } = require('./riverside-fingerprint-qa012');","const { verifyFingerprint012 } = require('./theatre-historical-bridge013');");
  preservedRanges.push(exactRange013(original,adapted,'const ROOT = __dirname'));
 }
 if(suite==='museum')preservedRanges.push(exactRange013(original,adapted,'function nativeScene010('));
 if(suite==='compatibility'){
  preservedRanges.push(exactRange013(original,adapted,'const originalRng=','(async()=>'));
  preservedRanges.push(exactRange013(original,adapted,'    out.ok=JSON.stringify(reference)===JSON.stringify(comparison);'));
  // The original five worlds and their complete assertions end immediately
  // before the additive sixth/seventh worlds; this prefix stays byte-exact.
  const extraStart="        const museumCompat=",extraEnd="        if(cdp.errors.length)";
  if(adapted.split(extraStart).length!==2||adapted.split(extraEnd).length!==2)throw Error('Unique additive compatibility world boundaries required');
  const olderFive=adapted.slice(0,adapted.indexOf(extraStart))+adapted.slice(adapted.indexOf(extraEnd));
  preservedRanges.push(exactRange013(original,olderFive,"    for(const [label,bytes]of[['baseline',old],['candidate',current]]){",extraEnd));
 }
 if(suite==='coldload'){
  preservedRanges.push(exactRange013(original,adapted,'function coldSnapshot011(','(async()=>'));
  preservedRanges.push(exactRange013(original,adapted,'  for(const caseName of CASES){'));
 }
 if(suite==='streetlife')preservedRanges.push(exactRange013(original,adapted,"const start='function setupStreet009('"));
 // A reversible complete-source audit rules out ANY unlisted byte edit, even
 // outside named ranges. Inverting only our exact edits recovers012 exactly.
 let recovered=adapted;for(const edit of [...audit].reverse()){
  if(recovered.split(edit.to).length-1!==edit.count)throw Error('Adapter audit cannot uniquely reverse: '+edit.to);
  recovered=recovered.split(edit.to).join(edit.from);
 }
 if(recovered!==previous.adapted)throw Error('Unlisted historical runner edit');
 new vm.Script(adapted,{filename:'.theatre-'+suite+'-runtime013.js'});
 return{file,original,adapted,audit,proof:{suite,baseline:fixed.BASE,originalSHA256:fixed.hash(original),previousAdapterSHA256:fixed.hash(previous.adapted),adaptedSHA256:fixed.hash(adapted),originalExact:true,trackedHistoricalSourcesExact:true,historicalSources,previousSourceAudit:previous.proof,previousTransformations:previous.audit,preservedRanges,reversibleExactSourceAudit:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true,gateOnly:suite!=='compatibility',originalSixCompatibilityWorldsRetained:suite==='compatibility',additionalFullRiversideCompatibility:suite==='compatibility',boundedMetadataNormalizationPaths:suite==='compatibility'?[...require('./theatre-compatibility013').METADATA_PATHS013,require('./theatre-compatibility013').SAVE_PATH013]:[],exactCandidateOrApprovedReleaseLabels:true,coldloadCaseBodiesExact:suite==='coldload',allRiversideRuntimeBytesExceptTwoImportsExact:suite==='riverside'}};
}
function nestedStatic013(suite,q){
 if(suite==='publiclife'||suite==='station'){
  const mode=suite,file=mode==='publiclife'?'publiclife-integration-qa.js':'station-integration-qa008.js',original=fs.readFileSync(path.join(ROOT,file),'utf8');
  const start=q.adapted.indexOf('const oldGate='),end=q.adapted.indexOf('const temporary=');if(start<0||end<start)throw Error('Nested historical adapter boundaries missing');
  const context={mode,original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  return{nestedSHA256:fixed.hash(context.output),nestedRuntimeChecksExact:true,nestedSourcePreservationExecuted:true};
 }
 if(suite==='streetlife'){
  const original=fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8'),start=q.adapted.indexOf('const edits='),end=q.adapted.indexOf('new vm.Script(adapted)');
  if(start<0||end<start)throw Error('Nested streetlife adapter boundaries missing');
  const context={original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  return{nestedSHA256:fixed.hash(context.output),nestedRuntimeChecksExact:true,nestedSourcePreservationExecuted:true};
 }
 return{};
}
function staticTest013(){
 const results=[];for(const suite of Object.keys(FILES)){const q=buildAdapter013(suite);results.push({...q.proof,...nestedStatic013(suite,q),transformations:q.audit.length});}
 const compat=require('./theatre-compatibility013');new vm.Script(compat.fixtureSource013());new vm.Script('('+compat.runRiversideWorld013.toString()+')');
 const museum=require('./riverside-museum-compat012');new vm.Script(museum.fixtureSource012());new vm.Script('('+museum.runMuseumWorld012.toString()+')');
 return{ok:true,sourceOnly:true,gameExecuted:false,metadataNormalization:compat.staticNormalizationTest013(),museumModes:MUSEUM_MODES,riversideModes:RIVERSIDE_MODES,coldloadCases:COLD_CASES,results};
}
function run013(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Runtime adapters run only in authorized isolated GitHub Actions');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.TH013_SUITE||'museum',mode=process.env.TH013_MODE||(suite==='coldload'?'all':['museum','riverside'].includes(suite)?'preflight':'gameplay');
 if(!FILES[suite]||(suite==='museum'&&!MUSEUM_MODES.includes(mode))||(suite==='riverside'&&!RIVERSIDE_MODES.includes(mode))||(suite==='coldload'&&mode!=='all'&&!COLD_CASES.includes(mode))||(!['museum','riverside','coldload'].includes(suite)&&mode!=='gameplay'))throw Error('Unknown historical suite/mode');
 const product=fixed.verifyStatic013(),q=buildAdapter013(suite),native=require('./theatre-fingerprint-qa013').readPreflight013();
 const out=path.join(ROOT,'theatre-evidence','historical',suite,mode,'guards');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'runtime-adapter.json'),JSON.stringify({...q.proof,...nestedStatic013(suite,q),checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,release:product.release,changes:q.audit,strictNativeProjection:native.proof,preflightEvidenceSHA256:native.evidenceSHA256},null,2));
 const temp=path.join(ROOT,'.theatre-'+suite+'-runtime013.js');
 try{
  fs.writeFileSync(temp,q.adapted);
  const cases=suite==='coldload'?(mode==='all'?COLD_CASES:[mode]):[null];
  for(const coldCase of cases){const result=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,MU010_MODE:mode,MU010_PRIOR:suite,RL012_MODE:mode,...(coldCase?{COLD011_CASE:coldCase}:{})},stdio:'inherit',timeout:45*60*1000});if(result.error)throw result.error;if(result.status!==0){process.exitCode=result.status??1;break;}}
 }finally{fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter013,staticTest013,nestedStatic013,immutableAudit013,FILES,MUSEUM_MODES,RIVERSIDE_MODES,COLD_CASES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest013(),null,2));else run013();}
