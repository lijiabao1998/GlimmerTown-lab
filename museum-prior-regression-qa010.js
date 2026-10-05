#!/usr/bin/env node
'use strict';
// Exact CI-only gate extension; historical test sources remain untouched.
// The independently collected preflight record is checked against this SHA and
// every complete T722 leaf/family/block before extending in-memory QA records.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const {execFileSync,spawnSync}=require('child_process');
const {verifyStatic010:verifyStatic009,BASE,expectedAdditions}=require('./museum-static-contract010');
const {readPreflight010:readPreflight009}=require('./museum-fingerprint-qa010');
const ROOT=__dirname;
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact-head requirement');
const staticProof=verifyStatic009(),nativeProof=readPreflight009();
if(!staticProof.fpExact||!staticProof.logExact||!((staticProof.release===false&&staticProof.version==='14.26'&&staticProof.anchor==='T722')||(staticProof.release===true&&staticProof.version==='14.27'&&staticProof.anchor==='T723'))||nativeProof.proof.oldLeaves!==2879||nativeProof.proof.newLeaves!==16||nativeProof.proof.leaves!==2895)throw Error('Unverified strict T722 candidate and16 museum additions');
const mode=process.env.MU010_PRIOR||'publiclife';
if(!['publiclife','station'].includes(mode))throw Error('Unknown prior suite');
const file=mode==='publiclife'?'publiclife-integration-qa.js':'station-integration-qa008.js';
const original=fs.readFileSync(path.join(ROOT,file),'utf8');
const pinned=execFileSync('git',['show',BASE+':'+file],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
if(original!==pinned)throw Error('Historical runtime suite source changed');
const oldGate="check('approved product changes only three exact release metadata fields',sha(normalizedHTML)===APPROVED_HTML_SHA256);";
const newGate="check('authorized station product differs only in three release labels',stationReleaseProof.htmlExact);";
const edits=[
 ["const ROOT=__dirname,{withGame}=require('./harness');","const ROOT=__dirname,{withGame}=require('./harness');\nconst stationRelease=require('./station-release-contract008'),stationReleaseProof=stationRelease.verifyRelease();"],
 ["const RELEASE_VERSION='14.24',RELEASE_ANCHOR='T720';","const RELEASE_VERSION='14.25',RELEASE_ANCHOR='T721';"],
 [oldGate,newGate],
 ["const expected=TARGETS.map(t=>'bld.'+t.k+'_1_0').sort();","const expected=TARGETS.map(t=>'bld.'+t.k+'_1_0').concat(Object.keys(stationRelease.promotion.subs)).sort();"],
 ["check('all2795 prior leaves paired with exactly12 declared additions',Object.keys(fp.subs||{}).length===2807&&removed.length===0);","check('all2795 prior leaves paired with exactly60 declared additions',Object.keys(fp.subs||{}).length===2855&&removed.length===0);"],
 ["check('exactly twelve new canonical building leaves',JSON.stringify(out.added)===JSON.stringify(expected),out);","check('exactly60 cumulative declared canonical leaves',JSON.stringify(out.added)===JSON.stringify(expected),out);"],
 ["check('only bld family touched',JSON.stringify(touched.sort())==='[\"bld\"]',touched);","check('exactly three declared cumulative families touched',JSON.stringify(touched.sort())==='[\"bld\",\"stationConstruction008\",\"stationDistrict008\"]',touched);"],
 ["for(const text of [\"const GAME_VER='14.24'\",\"const GAME_ANCHOR='T720'\",'id=\"startVersion456\">v14.24 · T720'])","for(const text of [\"const GAME_VER='14.25'\",\"const GAME_ANCHOR='T721'\",'id=\"startVersion456\">v14.25 · T721'])"],
 ["for(const t of TARGETS)promoted.subs['bld.'+t.k+'_1_0']=RELEASE_PIXEL_PINS['bld.'+t.k+'_1_0'];","for(const t of TARGETS)promoted.subs['bld.'+t.k+'_1_0']=RELEASE_PIXEL_PINS['bld.'+t.k+'_1_0'];\n  promoted.stats=stationRelease.promotion.stats;Object.assign(promoted.families,stationRelease.promotion.families);Object.assign(promoted.subs,stationRelease.promotion.subs);"],
 ["check('release baseline is strictly additive promotion of twelve approved full leaf records'","check('release baseline is strictly additive promotion of60 approved full leaf records'"],
 ["const priorLog=execFileSync('git',['show',PINNED_BASE+':AUTORUN-LOG.md']","const priorLog=execFileSync('git',['show',stationRelease.BASE+':AUTORUN-LOG.md']"],
 ["const logEntries=currentLog.match(/<!-- T720 release entry BEGIN -->[\\s\\S]*?<!-- T720 release entry END -->\\n/g)||[];","const logEntries=currentLog.match(/<!-- T721 release entry BEGIN -->[\\s\\S]*?<!-- T721 release entry END -->\\n/g)||[];"],
 ["logEntries[0].includes('r167')&&logEntries[0].includes('PR12')","logEntries[0].includes('r168')&&logEntries[0].includes('PR13')"]
];
const extension=[
 ["const stationRelease=require('./station-release-contract008'),stationReleaseProof=stationRelease.verifyRelease();", "const stationRelease=require('./station-release-contract008');const streetStatic=require('./museum-static-contract010').verifyStatic010();const streetNative=require('./museum-fingerprint-qa010').readPreflight010();const streetExpected=[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions];const stationReleaseProof={htmlExact:streetStatic.htmlExact};const streetPriorLog009=full=>{if(streetStatic.release){const entry=streetStatic.releaseLogEntry;if(!streetStatic.logExact||typeof entry!=='string'||!entry||full.split(entry).length!==2)throw Error('Expected unique source-verified T723 release entry');full=full.replace(entry,'');}const pinnedLog=execFileSync('git',['show',require('./museum-static-contract010').BASE+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});if(full!==pinnedLog)throw Error('Complete T722 historical log changed');const previous=execFileSync('git',['show',require('./streetlife-static-contract009').BASE+':AUTORUN-LOG.md'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});const entries=full.match(/<!-- T722 release entry BEGIN -->[\\s\\S]*?<!-- T722 release entry END -->\\n/g)||[];if(entries.length!==1||full.replace(entries[0],'')!==previous)throw Error('Pinned T722 log does not exactly recover T721');return previous;};"],
 ["const releaseBaseline=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8'));", "const releaseBaseline=streetNative.qaBaseline;"],
 [".concat(Object.keys(stationRelease.promotion.subs)).sort();", ".concat(Object.keys(stationRelease.promotion.subs),streetExpected).sort();"],
 ["all2795 prior leaves paired with exactly60 declared additions',Object.keys(fp.subs||{}).length===2855", "all2795 prior leaves paired with exactly100 declared additions',Object.keys(fp.subs||{}).length===2895"],
 ["exactly60 cumulative declared canonical leaves", "exactly100 cumulative declared canonical leaves"],
 ["exactly three declared cumulative families touched',JSON.stringify(touched.sort())==='[\"bld\",\"stationConstruction008\",\"stationDistrict008\"]'", "exactly five declared cumulative families touched',JSON.stringify(touched.sort())==='[\"bld\",\"museum010\",\"stationConstruction008\",\"stationDistrict008\",\"streetLife009\"]'"],
 ["promoted.stats=stationRelease.promotion.stats;Object.assign(promoted.families,stationRelease.promotion.families);Object.assign(promoted.subs,stationRelease.promotion.subs);", "promoted.stats=streetNative.qaBaseline.stats;promoted.families=streetNative.qaBaseline.families;promoted.subs=streetNative.qaBaseline.subs;"],
 ["release baseline is strictly additive promotion of60 approved full leaf records", "in-memory QA extension retains all original2879 complete records and exactly16 independently verified museum additions"]
];
const releaseExtension=[
 [
  "const RELEASE_VERSION='14.25',RELEASE_ANCHOR='T721';",
  "const RELEASE_VERSION=streetStatic.version,RELEASE_ANCHOR=streetStatic.anchor;"
 ],
 [
  "for(const text of [\"const GAME_VER='14.25'\",\"const GAME_ANCHOR='T721'\",'id=\"startVersion456\">v14.25 · T721'])",
  "for(const text of [\"const GAME_VER='\"+RELEASE_VERSION+\"'\",\"const GAME_ANCHOR='\"+RELEASE_ANCHOR+\"'\",'id=\"startVersion456\">v'+RELEASE_VERSION+' · '+RELEASE_ANCHOR])"
 ],
 [
  "currentLog=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8');",
  "currentLog=streetPriorLog009(fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'));"
 ],
 [
  "authorized station product differs only in three release labels",
  "exact source-verified GPT010 candidate or authorized T723 release against immutable T722"
 ]
];
const stationEdits=[
 ["const {verifyRelease}=require('./station-release-contract008'),{isDeepStrictEqual:equal}=require('util');", "const streetStatic={...require('./museum-static-contract010'),expectedAdditions:[...require('./streetlife-static-contract009').expectedAdditions,...require('./museum-static-contract010').expectedAdditions]};const streetNative=require('./museum-fingerprint-qa010').readPreflight010();const streetProduct=streetStatic.verifyStatic010();const verifyRelease=()=>({...streetProduct,releaseBaseline:streetNative.qaBaseline});const {isDeepStrictEqual:equal}=require('util');"],
 ["...Array.from({length:4},(_,st)=>Array.from({length:4},(_,v)=>'stationConstruction008.'+st+'_'+v)).flat()].sort();", "...Array.from({length:4},(_,st)=>Array.from({length:4},(_,v)=>'stationConstruction008.'+st+'_'+v)).flat(),...streetStatic.expectedAdditions].sort();"],
 ["all2807 old leaves exact and exactly48 declared additions", "all2807 old leaves exact and exactly88 declared cumulative additions"],
 ["complete promoted baseline equals every2855 native leaf and family aggregate", "complete in-memory QA extension equals every2895 native leaf and family aggregate"],
 ["check('T721 v14.25 ordinary boot',report.boot.ready&&report.boot.version==='14.25'", "check('verified '+report.release.anchor+' v'+report.release.version+' ordinary boot',report.boot.ready&&report.boot.version===report.release.version"]
];
let adapted=original;
const replacements=mode==='publiclife'?[...edits,...extension,...releaseExtension]:stationEdits;
const audit=[];
for(const [from,to]of replacements){if(adapted.split(from).length!==2)throw Error('Historical gate anchor not unique: '+from);adapted=adapted.replace(from,to);audit.push({from,to});}
const runtimeAnchor="  const wallStart=Date.now();progress('browser boot requested'";
if(mode==='publiclife'&&(original.split(runtimeAnchor).length!==2||adapted.slice(adapted.indexOf(runtimeAnchor))!==original.slice(original.indexOf(runtimeAnchor))))throw Error('Original35-group native runtime statements changed');
if(mode==='station'){
 const start='function setupDistrict(seedFn){',end='function protectedSources(){';
 if(original.split(start).length!==2||original.split(end).length!==2||original.slice(original.indexOf(start),original.indexOf(end))!==adapted.slice(adapted.indexOf(start),adapted.indexOf(end)))throw Error('Original station native functions changed');
 const tail="    report.fixture=await ev('(";
 if(original.split(tail).length!==2||original.slice(original.indexOf(tail))!==adapted.slice(adapted.indexOf(tail)))throw Error('Original station gameplay assertions changed');
}
const temporary=path.join(ROOT,'.museum-prior-'+mode+'-runtime010.js');
new vm.Script(adapted,{filename:temporary});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const proof={checkedSHA:head,base:BASE,mode,originalExact:true,originalSHA256:hash(original),adaptedSHA256:hash(adapted),replacements:audit,preflightEvidenceSHA256:nativeProof.evidenceSHA256,strictNativeProjection:nativeProof.proof,sourceSHA256:staticProof.sourceSHA256,version:staticProof.version,anchor:staticProof.anchor,release:staticProof.release,releasePromotionExact:staticProof.fpExact,historicalLogExact:staticProof.logExact,runtimeStatementsExact:true,contract:'Original35 publiclife gameplay groups,203 fixed physical-road neighbors,30 paid homes,21-day construction/load budget OR complete original station/rail gameplay assertions are unchanged. Only exact historical source/metadata/fingerprint gates extend to this statically reproduced candidate and independently verified16 additions. Every T722 leaf and block remains immutable. Candidate files retain T722 metadata and logs; T723 release accepts only the separately verified three-label change, exact native16 promotion, single release-log entry, and exact previous public-observer head pin. QA adapters never write tracked baselines.'};
const dest=path.join(ROOT,'museum-evidence/prior-'+mode+'/guards');fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'runtime-adapter.json'),JSON.stringify(proof,null,2));
try{
 fs.writeFileSync(temporary,adapted);
 const result=spawnSync(process.execPath,[temporary],{cwd:ROOT,env:{...process.env,PL007_MODE:'gameplay',ST008_MODE:'gameplay'},stdio:'inherit',timeout:40*60*1000});
 if(result.error)throw result.error;
 process.exitCode=result.status??1;
}finally{fs.rmSync(temporary,{force:true});}
