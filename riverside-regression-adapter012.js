#!/usr/bin/env node
'use strict';
// New temporary exact-source gate adapters; every historical file is immutable.
// --static-test runs text transformations and syntax compilation only.
const fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync,spawnSync}=require('child_process');
const fixed=require('./riverside-static-contract012'),ROOT=__dirname;
const FILES={museum:'museum-integration-qa010.js',publiclife:'museum-prior-regression-qa010.js',station:'museum-prior-regression-qa010.js',streetlife:'museum-streetlife-regression010.js',compatibility:'museum-compatibility-qa010.js',coldload:'coldload-native-qa011.js'};
const IMPORT_COUNTS={museum:[1,1],publiclife:[6,3],station:[6,3],streetlife:[2,2],compatibility:[1,0]};
const MUSEUM_MODES=['preflight','fingerprint','gameplay',...Array.from({length:4},(_,i)=>'camera'+i),...Array.from({length:4},(_,i)=>'construction'+i),'weather'];
const COLD_CASES=['without-museum','with-museum','zero-source','disconnected','escape-disabled'];
function exactRange012(original,adapted,start,end){
 if(original.split(start).length!==2||adapted.split(start).length!==2||(end&&(original.split(end).length!==2||adapted.split(end).length!==2)))throw Error('Nonunique runtime-preservation boundaries: '+start);
 const part=s=>s.slice(s.indexOf(start),end?s.indexOf(end,s.indexOf(start)):undefined);
 if(part(original)!==part(adapted))throw Error('Historical runtime functions/assertions changed: '+start);
}
function buildAdapter012(suite){
 const file=FILES[suite];if(!file)throw Error('Unknown riverside historical suite');
 const original=fs.readFileSync(path.join(ROOT,file),'utf8'),pinned=fixed.baseFile(file).toString();if(original!==pinned)throw Error('Historical suite differs from immutable deployed T724: '+file);
 let adapted=original,compatibilityAdded='';const audit=[];
 const replace=(from,to,count=1)=>{if(adapted.split(from).length-1!==count)throw Error('Historical gate anchor count mismatch: '+from);adapted=adapted.split(from).join(to);audit.push({from,to,count});};
 if(suite==='publiclife'||suite==='station'){
  replace("!((staticProof.release===false&&staticProof.version==='14.26'&&staticProof.anchor==='T722')||(staticProof.release===true&&staticProof.version==='14.27'&&staticProof.anchor==='T723'))", "!(staticProof.release===false&&staticProof.phase==='candidate'&&staticProof.version==='14.28'&&staticProof.anchor==='T724'&&nativeProof.proof.museumLineageExact&&nativeProof.proof.projectedOnlyDeclared24&&nativeProof.proof.riversideOldLeaves===2895&&nativeProof.proof.riversideNewLeaves===24&&nativeProof.proof.currentLeaves===2919)");
  // Decode only the one generated replacement containing the historical log
  // helper. The original nested suite anchors remain unchanged.
  const matches=adapted.split('\n').filter(l=>l.includes('const streetPriorLog009=full=>{'));if(matches.length!==1)throw Error('Unique historical bounded-log adapter required');
  const line=matches[0],pair=JSON.parse(line.trim().replace(/,$/,'')),start=pair[1].indexOf('const streetPriorLog009=full=>{'),endText='return previous;};',end=pair[1].indexOf(endText,start);
  if(start<0||end<start||pair[1].split(endText).length!==2)throw Error('Historical log helper boundaries changed');
  pair[1]=pair[1].slice(0,start)+"const streetPriorLog009=full=>require('./riverside-historical-bridge012').priorLog012(full);"+pair[1].slice(end+endText.length);replace(line,' '+JSON.stringify(pair)+',');
  replace("const streetExpected=[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions];", "const streetExpected=[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions,...require('./riverside-static-contract012').expectedAdditions];");
  replace("expectedAdditions:[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions]", "expectedAdditions:[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions,...require('./riverside-static-contract012').expectedAdditions]");
  replace("all2795 prior leaves paired with exactly100 declared additions',Object.keys(fp.subs||{}).length===2895", "all2795 prior leaves paired with exactly124 declared additions',Object.keys(fp.subs||{}).length===2919");
  replace('exactly100 cumulative declared canonical leaves','exactly124 cumulative declared canonical leaves');
  replace("exactly five declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"museum010\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\"]'", "exactly six declared cumulative families touched',JSON.stringify(touched.sort())==='[\\\"bld\\\",\\\"museum010\\\",\\\"riverside012\\\",\\\"stationConstruction008\\\",\\\"stationDistrict008\\\",\\\"streetLife009\\\"]'");
  replace('all2807 old leaves exact and exactly88 declared cumulative additions','all2807 old leaves exact and exactly112 declared cumulative additions');
  replace('complete in-memory QA extension equals every2895 native leaf and family aggregate','complete in-memory QA extension equals every2919 native leaf and family aggregate');
 }
 if(suite==='compatibility'){
  replace("const ROOT=__dirname,BASE='d9dfe87689fa841edb8775d0f95db77d9f2deb5b';","const ROOT=__dirname,BASE='"+fixed.BASE+"';");
  replace("const HASH='b00099c4837038812278ee5e3f86528416731e24904559e60befb575b315934f';","const HASH='"+fixed.BASE_HTML_SHA256+"';");
  replace("const version=label==='candidate'?staticProof.version:'14.26',anchor=label==='candidate'?staticProof.anchor:'T722';", "const version=label==='candidate'?staticProof.version:'14.28',anchor=label==='candidate'?staticProof.anchor:'T724';");
  replace("if(label==='candidate'&&staticProof.release){if(version!=='14.27'||anchor!=='T723')throw Error('Only approved T723 label normalization allowed');q.enterprise.version='14.26';q.enterprise.anchor='T722';}", "if(version!=='14.28'||anchor!=='T724'||staticProof.release!==false)throw Error('Both compatibility products must retain exact T724 labels; normalization is forbidden');");
  replace("out.metadataNormalization={applied:staticProof.release,paths:['seed900721.checkpoints[*].enterprise.version','seed900721.checkpoints[*].enterprise.anchor'],from:{version:staticProof.version,anchor:staticProof.anchor},to:{version:'14.26',anchor:'T722'},rawObservationsPreserved:true};", "out.metadataNormalization={applied:false,paths:[],from:{version:staticProof.version,anchor:staticProof.anchor},to:{version:'14.28',anchor:'T724'},rawObservationsPreserved:true,sameLabelExact:true};");
  // Add a sixth comparison world. The five original runtime worlds, functions,
  // checkpoint data and final complete JSON equality remain byte-identical.
  const before="        if(cdp.errors.length){out.consoleErrors={label,errors:cdp.errors};throw Error(label+' console or uncaught errors: '+JSON.stringify(cdp.errors));}return arr;";
  const extra="        const museumCompat=require('./riverside-museum-compat012');\n        const museum=await cdp.evalJs('(()=>{'+museumCompat.fixtureSource012()+';return ('+museumCompat.runMuseumWorld012.toString()+')(setupMuseum010,('+seedApprovedBritishLegacy007.toString()+'));})()');\n        if(museum.checkpoints.length!==7||!museum.nativeLoadIdentitiesExact||!museum.otherSlotsUnchanged||museum.checkpoints.some(q=>q.difficulty!==1||q.roots.length!==1||q.roots[0].k!==277||q.paths.length!==3||q.retained.length!==47||q.enterprise.version!=='14.28'||q.enterprise.anchor!=='T724'))throw Error('Complete same-label T724 museum comparison checkpoints missing');\n        arr.push({seed:900724,kind:'Immutable paid T724 museum and all old street/station/British identities; complete stats, tiles, RNG, native load and following day',fixture:museum.fixture,nativeLoadIdentitiesExact:museum.nativeLoadIdentitiesExact,otherSlotsUnchanged:museum.otherSlotsUnchanged,checkpoints:museum.checkpoints.map(({tiles,...q})=>({...q,tilesSHA256:hash(JSON.stringify(tiles))}))});\n";
  compatibilityAdded=extra;replace(before,extra+before);
 }
 if(suite==='coldload'){
  replace("const {verifyStatic011}=require('./coldload-static-contract011');", "const {verifyStatic012:verifyStatic011}=require('./riverside-static-contract012');");
  replace("const {verifyFingerprint011}=require('./coldload-fingerprint-qa011');", "const {verifyFingerprint012:verifyFingerprint011}=require('./riverside-fingerprint-qa012');");
  replace("check('all 2895 approved leaves,157 families and1728 blocks stay exact',report.fingerprint.ok===true&&fp.stats.leaves===2895&&fp.stats.families===157&&blocks.count===1728,report.fingerprint);", "check('all2895 approved leaves and1728 blocks exact plus precisely24 riverside leaves in158 families',report.fingerprint.ok===true&&report.fingerprint.oldLeaves===2895&&report.fingerprint.newLeaves===24&&fp.stats.leaves===2919&&fp.stats.families===158&&blocks.count===1728,report.fingerprint);");
 }
 if(suite!=='coldload')for(const[i,from]of['./museum-static-contract010','./museum-fingerprint-qa010'].entries()){
  const count=IMPORT_COUNTS[suite][i]-(from.includes('static')&&(suite==='publiclife'||suite==='station')?1:0);
  // One old static import lived inside the removed bounded-log helper.
  if(count)replace(from,'./riverside-historical-bridge012',count);else if(adapted.includes(from))throw Error('Unexpected historical import');
 }
 if(suite==='museum')exactRange012(original,adapted,'function nativeScene010(');
 if(suite==='compatibility'){
  exactRange012(original,adapted,'const originalRng=','(async()=>');
  exactRange012(original,adapted.replace(compatibilityAdded,''),"    for(const [label,bytes]of[['baseline',old],['candidate',current]]){","        if(cdp.errors.length)");
 }
 if(suite==='streetlife')exactRange012(original,adapted,"const start='function setupStreet009('");
 if(suite==='coldload'){
  exactRange012(original,adapted,'function coldSnapshot011(','(async()=>');
  exactRange012(original,adapted,'  for(const caseName of CASES){');
 }
 new vm.Script(adapted,{filename:'.riverside-'+suite+'-runtime012.js'});
 return{file,original,adapted,audit,proof:{suite,baseline:fixed.BASE,originalSHA256:fixed.hash(original),adaptedSHA256:fixed.hash(adapted),originalExact:true,runtimeFunctionsExact:true,gameplayAssertionsExact:true,gateOnly:suite!=='compatibility',additionalFullMuseumCompatibility:suite==='compatibility',coldloadCaseBodiesExact:suite==='coldload'}};
}
function nestedStatic012(suite,q){
 if(suite==='publiclife'||suite==='station'){
  const mode=suite,original=fs.readFileSync(path.join(ROOT,mode==='publiclife'?'publiclife-integration-qa.js':'station-integration-qa008.js'),'utf8');
  if(original!==fixed.baseFile(mode==='publiclife'?'publiclife-integration-qa.js':'station-integration-qa008.js').toString())throw Error('Nested immutable historical suite changed');
  const start=q.adapted.indexOf('const oldGate='),end=q.adapted.indexOf('const temporary=');if(start<0||end<start)throw Error('Nested historical adapter boundaries missing');
  const context={mode,original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  return{nestedSHA256:fixed.hash(context.output),nestedRuntimeChecksExact:true};
 }
 if(suite==='streetlife'){
  const original=fs.readFileSync(path.join(ROOT,'streetlife-integration-qa009.js'),'utf8'),start=q.adapted.indexOf('const edits='),end=q.adapted.indexOf('new vm.Script(adapted)');
  if(original!==fixed.baseFile('streetlife-integration-qa009.js').toString())throw Error('Nested immutable streetlife suite changed');
  if(start<0||end<start)throw Error('Nested streetlife adapter boundaries missing');const context={original};new vm.Script(q.adapted.slice(start,end)+';globalThis.output=adapted;').runInNewContext(context);new vm.Script(context.output);
  return{nestedSHA256:fixed.hash(context.output),nestedRuntimeChecksExact:true};
 }
 return{};
}
function staticTest012(){
 const results=[];for(const suite of Object.keys(FILES)){const q=buildAdapter012(suite);results.push({...q.proof,...nestedStatic012(suite,q),transformations:q.audit.length});}
 const museum=require('./riverside-museum-compat012');new vm.Script(museum.fixtureSource012());new vm.Script('('+museum.runMuseumWorld012.toString()+')');
 return{ok:true,sourceOnly:true,gameExecuted:false,museumModes:MUSEUM_MODES,coldloadCases:COLD_CASES,results};
}
function run012(){
 if(process.env.GITHUB_ACTIONS!=='true')throw Error('Runtime adapters run only in authorized isolated GitHub Actions');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact workflow head required');
 const suite=process.env.RL012_SUITE||'museum',mode=process.env.RL012_MODE||(suite==='coldload'?(process.env.COLD011_CASE||'all'):'preflight');
 if(suite==='museum'&&!MUSEUM_MODES.includes(mode))throw Error('Unknown native museum evidence mode');
 if(suite==='coldload'&&mode!=='all'&&!COLD_CASES.includes(mode))throw Error('Unknown original cold-load case');
 const product=fixed.verifyStatic012(),q=buildAdapter012(suite);let native;
 if(suite!=='museum')native=require('./riverside-fingerprint-qa012').readPreflight012();
 const out=path.join(ROOT,'riverside-evidence','historical',suite,suite==='museum'||suite==='coldload'?mode:'gameplay','guards');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'runtime-adapter.json'),JSON.stringify({...q.proof,checkedSHA:head,sourceSHA256:product.sourceSHA256,version:product.version,anchor:product.anchor,phase:product.phase,changes:q.audit,strictNativeProjection:native?.proof,preflightEvidenceSHA256:native?.evidenceSHA256},null,2));
 const temp=path.join(ROOT,'.riverside-'+suite+'-runtime012.js');
 try{
  fs.writeFileSync(temp,q.adapted);
  const cases=suite==='coldload'?(mode==='all'?COLD_CASES:[mode]):[null];
  for(const coldCase of cases){const r=spawnSync(process.execPath,[temp],{cwd:ROOT,env:{...process.env,MU010_MODE:mode,MU010_PRIOR:suite,...(coldCase?{COLD011_CASE:coldCase}:{})},stdio:'inherit',timeout:45*60*1000});if(r.error)throw r.error;if(r.status!==0){process.exitCode=r.status??1;break;}}
 }finally{fs.rmSync(temp,{force:true});}
}
module.exports={buildAdapter012,staticTest012,FILES,MUSEUM_MODES,COLD_CASES};
if(require.main===module){if(process.argv.includes('--static-test'))console.log(JSON.stringify(staticTest012(),null,2));else run012();}
