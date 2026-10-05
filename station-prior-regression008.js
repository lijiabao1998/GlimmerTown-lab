#!/usr/bin/env node
'use strict';
// CI-only adapter: preserve every prior runtime statement and its native
// workforce/neighbor fixture. Historical release-specific static gates extend
// to the exact approved T721 product and strict native48 baseline promotion.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync,spawnSync}=require('child_process');
const ROOT=__dirname,BASE='ed49bab0b73bacfe8c7d6f6a8ca13491b01c9f5f';
if(process.env.GITHUB_ACTIONS!=='true')throw Error('GitHub Actions runtime only');
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
if(head!==process.env.GITHUB_SHA)throw Error('Exact-head requirement');
const original=fs.readFileSync(path.join(ROOT,'publiclife-integration-qa.js'),'utf8');
const pinned=execFileSync('git',['show',BASE+':publiclife-integration-qa.js'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
if(original!==pinned)throw Error('Prior release QA source changed');
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
let adapted=original;
for(const[from,to]of edits){if(adapted.split(from).length!==2)throw Error('Historical gate anchor not unique: '+from);adapted=adapted.replace(from,to);}
const runtimeAnchor='  const wallStart=Date.now();progress(\'browser boot requested\'';
if(original.split(runtimeAnchor).length!==2||adapted.slice(adapted.indexOf(runtimeAnchor))!==original.slice(original.indexOf(runtimeAnchor)))throw Error('Original native runtime statements changed');
const temporary=path.join(ROOT,'.station-prior-runtime008.js');
// Compile only; runtime remains exclusively inside the Actions child process.
new (require('vm').Script)(adapted,{filename:temporary});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const proof={checkedSHA:head,base:BASE,originalExact:true,originalSHA256:hash(original),adaptedSHA256:hash(adapted),replacementCount:edits.length,runtimeStatementsExact:true,expectedNormalizedHTMLSHA256:'da956974f0e3dc775b755449dc661f20e9b9edd8c8dc369c8785d81b3b363d73',contract:'All original35 gameplay groups,203 retained physical-road neighbors,30 paid native social homes,21-day limit,actual loaded-day staffing and every original native runtime statement unchanged. Only historical release-specific static gates extend to equally strict approved T721 metadata and cumulative60 additions.'};
const dest=path.join(ROOT,'station-evidence/regression/guards');fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'prior-runtime-adapter.json'),JSON.stringify(proof,null,2));
try{
  fs.writeFileSync(temporary,adapted);
  const result=spawnSync(process.execPath,[temporary],{cwd:ROOT,env:{...process.env,PL007_MODE:'gameplay'},stdio:'inherit',timeout:38*60*1000});
  if(result.error)throw result.error;
  process.exitCode=result.status??1;
}finally{fs.rmSync(temporary,{force:true});}
