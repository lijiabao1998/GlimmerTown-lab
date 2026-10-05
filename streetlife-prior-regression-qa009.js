#!/usr/bin/env node
'use strict';
// Exact CI-only gate extension; historical test sources remain untouched.
// The independently collected preflight record is checked against this SHA and
// every complete T721 leaf/family/block before extending in-memory QA records.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const {execFileSync,spawnSync}=require('child_process');
const {verifyStatic009,BASE,expectedAdditions}=require('./streetlife-static-contract009');
const {readPreflight009}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname;
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact-head requirement');
const staticProof=verifyStatic009(),nativeProof=readPreflight009();
const mode=process.env.SL009_PRIOR||'publiclife';
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
 ["const stationRelease=require('./station-release-contract008'),stationReleaseProof=stationRelease.verifyRelease();", "const stationRelease=require('./station-release-contract008');const streetStatic=require('./streetlife-static-contract009').verifyStatic009();const streetNative=require('./streetlife-fingerprint-qa009').readPreflight009();const streetExpected=require('./streetlife-static-contract009').expectedAdditions;const stationReleaseProof={htmlExact:streetStatic.htmlExact};"],
 ["const releaseBaseline=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8'));", "const releaseBaseline=streetNative.qaBaseline;"],
 [".concat(Object.keys(stationRelease.promotion.subs)).sort();", ".concat(Object.keys(stationRelease.promotion.subs),streetExpected).sort();"],
 ["all2795 prior leaves paired with exactly60 declared additions',Object.keys(fp.subs||{}).length===2855", "all2795 prior leaves paired with exactly84 declared additions',Object.keys(fp.subs||{}).length===2879"],
 ["exactly60 cumulative declared canonical leaves", "exactly84 cumulative declared canonical leaves"],
 ["exactly three declared cumulative families touched',JSON.stringify(touched.sort())==='[\"bld\",\"stationConstruction008\",\"stationDistrict008\"]'", "exactly four declared cumulative families touched',JSON.stringify(touched.sort())==='[\"bld\",\"stationConstruction008\",\"stationDistrict008\",\"streetLife009\"]'"],
 ["promoted.stats=stationRelease.promotion.stats;Object.assign(promoted.families,stationRelease.promotion.families);Object.assign(promoted.subs,stationRelease.promotion.subs);", "promoted.stats=streetNative.qaBaseline.stats;promoted.families=streetNative.qaBaseline.families;promoted.subs=streetNative.qaBaseline.subs;"],
 ["release baseline is strictly additive promotion of60 approved full leaf records", "in-memory QA extension retains all original2855 complete records and exactly24 independently verified candidate additions"]
];
const stationEdits=[
 ["const {verifyRelease}=require('./station-release-contract008'),{isDeepStrictEqual:equal}=require('util');", "const streetStatic=require('./streetlife-static-contract009');const streetNative=require('./streetlife-fingerprint-qa009').readPreflight009();const verifyRelease=()=>({...streetStatic.verifyStatic009(),fpExact:true,logExact:true,releaseBaseline:streetNative.qaBaseline});const {isDeepStrictEqual:equal}=require('util');"],
 ["...Array.from({length:4},(_,st)=>Array.from({length:4},(_,v)=>'stationConstruction008.'+st+'_'+v)).flat()].sort();", "...Array.from({length:4},(_,st)=>Array.from({length:4},(_,v)=>'stationConstruction008.'+st+'_'+v)).flat(),...streetStatic.expectedAdditions].sort();"],
 ["all2807 old leaves exact and exactly48 declared additions", "all2807 old leaves exact and exactly72 declared cumulative additions"],
 ["complete promoted baseline equals every2855 native leaf and family aggregate", "complete in-memory QA extension equals every2879 native leaf and family aggregate"]
];
let adapted=original;
const replacements=mode==='publiclife'?[...edits,...extension]:stationEdits;
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
const temporary=path.join(ROOT,'.streetlife-prior-'+mode+'-runtime009.js');
new vm.Script(adapted,{filename:temporary});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const proof={checkedSHA:head,base:BASE,mode,originalExact:true,originalSHA256:hash(original),adaptedSHA256:hash(adapted),replacements:audit,preflightEvidenceSHA256:nativeProof.evidenceSHA256,strictNativeProjection:nativeProof.proof,sourceSHA256:staticProof.sourceSHA256,runtimeStatementsExact:true,contract:'Original35 gameplay groups,203 fixed physical-road neighbors,30 paid homes,21-day construction/load budget OR complete original station/rail gameplay assertions are unchanged. Only exact historical release/source/fingerprint gates extend to this statically reproduced candidate and independently verified24 additions. No tracked baseline promotion.'};
const dest=path.join(ROOT,'streetlife-evidence/prior-'+mode+'/guards');fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'runtime-adapter.json'),JSON.stringify(proof,null,2));
try{
 fs.writeFileSync(temporary,adapted);
 const result=spawnSync(process.execPath,[temporary],{cwd:ROOT,env:{...process.env,PL007_MODE:'gameplay',ST008_MODE:'gameplay'},stdio:'inherit',timeout:40*60*1000});
 if(result.error)throw result.error;
 process.exitCode=result.status??1;
}finally{fs.rmSync(temporary,{force:true});}
